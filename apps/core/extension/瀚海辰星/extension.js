import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"瀚海辰星",content:function (config,pack){
    
},precontent:function (){
    
},help:{},config:{},package:{
    character:{
        character:{
            "ys2":["male","qun",4,["xiaoyong","pozhen_"],["des:不要让战斗停下来！！！"]],
            "luzhi_ys":["male","qun",3,["mingren","zhenliang"],[]],
            ys:["male","qun","1/4",["liejun2","canjun"],["forbidai","des:绝不倒下！"]],
            jieyueyujin:["male","wei",4,["jieyue8"],[]],
            "sp_caoren_ys":["male","wei",4,["kuiwei","yanzheng_ys"],[]],
            "niujin_ys":["male","wei",4,["cuorui0","liekai"],[]],
            xinzhuling:["male","wei",4,["xinzhanyi_ys"],[]],
            "sp_zhuling":["male","wei",4,["jizhan_ys","jiegong"],[]],
            anxing:["male","qun",5,["xueren6"],[]],
            guangxing:["male","qun",3,["huiren","yaozhan"],[]],
            lixing:["male","qun",4,["liren","shifang"],[]],
            "kai0":["male","qun",4,["xiuluo","moqv","666"],[]],
            reheqi:["male","wu",4,["reqizhou","rshanxi"],[]],
            "xusheng_ys":["male","wu",4,["pojun_ys"],[]],
            "miheng_ys":["male","qun",3,["rekuangcai","shejian"],[]],
            "sulie0":["male","qun",4,["gangyi0","tiebi0"],[]],
        },
        translate:{
            "ys2":"星辰高顺",
            "luzhi_ys":"星辰卢植",
            ys:"星辰审配",
            jieyueyujin:"星辰于禁",
            "sp_caoren_ys":"星辰曹仁",
            "niujin_ys":"星辰牛金",
            xinzhuling:"朱灵",
            "sp_zhuling":"星辰朱灵",
            anxing:"狂暴李信",
            guangxing:"统御李信",
            lixing:"李信",
            "kai0":"铠",
            reheqi:"界贺齐",
            "xusheng_ys":"星辰徐盛",
            "miheng_ys":"星辰祢衡",
            "sulie0":"苏烈",
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
            "666":{
                trigger:{
                    player:"useCard2",
                },
                forced:true,
                filter:function (trigger,player){
          if(trigger.targets.length==1) return false;
           return true;
       },
                content:function (){
           player.addTempSkill('sb',{player:"useCardAfter"});
       },
            },
            "888":{
                trigger:{
                    player:"useCard2",
                },
                forced:true,
                filter:function (trigger,player){
          if(trigger.targets.length==1) return false;
           return true;
       },
                content:function (){
           player.addTempSkill('sd',{player:"useCardAfter"});
       },
            },
            canjun:{
                priority:10,
                audio:"ext:瀚海辰星:2",
                forced:true,
                trigger:{
                    global:"gameDrawAfter",
                },
                filter:function (event,player){
if(player.isZhu&&game.players.length+game.dead.length>=5) return true;
return false;
},
                content:function (){
player.loseMaxHp();
player.loseHp();
game.delay();
},
            },
            "liejun2":{
                skillAnimation:true,
                animationColor:"wood",
                unique:true,
                juexingji:true,
                audio:"ext:瀚海辰星:2",
                derivation:["liejun3","liejun4","sishouzhuangtai","tuweizhuangtai","xuezhanzhuangtai"],
                trigger:{
                    player:"dyingBegin",
                },
                forced:true,
                filter:function (event,player){
return !player.hp<=1;1
},
                content:function (){
"step 0"
player.loseMaxHp();
"step 1"
player.recover(5-player.hp);
"step2"
player.draw(2);
"step 3"
player.addSkill('sishouzhuangtai');
player.addSkill('liejun3');
player.removeSkill('liejun2');
trigger.cancel();
game.delay();
},
            },
            "liejun3":{
                skillAnimation:true,
                animationColor:"metal",
                unique:true,
                juexingji:true,
                audio:"ext:瀚海辰星:2",
                trigger:{
                    player:"dyingBegin",
                },
                forced:true,
                filter:function (event,player){
return !player.hp<=1;
},
                content:function (){
"step 0"
player.loseMaxHp();
"step 1"
player.recover(5-player.hp);
"step2"
player.draw(2);
"step 3"
player.addSkill('liejun4');
player.addSkill('tuweizhuangtai');
player.removeSkill('liejun3');
player.removeSkill('sishouzhuangtai');
player.disableEquip('equip1');
player.disableEquip('equip2');
player.disableEquip('equip3');
player.disableEquip('equip4');
player.disableEquip('equip5');
trigger.cancel();
game.delay();
},
            },
            "liejun4":{
                skillAnimation:true,
                animationColor:"fire",
                unique:true,
                juexingji:true,
                audio:"ext:瀚海辰星:2",
                trigger:{
                    player:"dyingBegin",
                },
                forced:true,
                filter:function (event,player){
return !player.hp<=1;
},
                content:function (){
"step 0"
player.loseMaxHp();
"step 1"
player.recover(5-player.hp);
"step2"
player.draw(2);
"step 3"
player.addSkill('xuezhanzhuangtai');
player.removeSkill('liejun4');
player.removeSkill('tuweizhuangtai');
player.disableJudge();
trigger.cancel();
game.delay();
},
            },
            tuweizhuangtai:{
                mark:true,
                marktext:"突",
                intro:{
                    name:"突围状态",
                    content:"锁定技，准备阶段，你弃置0至X名其他角色区域内的各一张牌；出牌阶段，你拥有“整军”（你可以弃置一张装备牌并摸一张牌）；结束阶段，你摸X张牌；你的装备区处于废除状态。（X为当时场上装备区内武器牌总数且至少为1）",
                },
                group:["tuwei1","tuwei2","huairou"],
            },
            xuezhanzhuangtai:{
                mark:true,
                marktext:"绝",
                intro:{
                    name:"血战状态",
                    content:"锁定技，你的手牌上限+2；当你进入或脱离濒死状态时，你摸一张牌。你的【闪】视为【酒】、【桃】视为【杀】；你使用牌无距离和次数限制；你的【杀】无视防具。你的装备区和判定区处于废除状态",
                },
                group:["longxiao1","longxiao2","longxiao3","pojia","xinjuejing_ys"],
            },
            "xinjuejing_ys":{
                mod:{
                    maxHandcard:function (player,num){
return 2+num;
},
                },
                audio:"ext:瀚海辰星:2",
                trigger:{
                    player:["dyingBegin","dyingAfter"],
                },
                forced:true,
                content:function (){
player.draw();
game.delay();
},
            },
            "longxiao3":{
                mod:{
                    targetInRange:function (card,player,target,now){        
            return true;            
        },
                    cardUsable:function (card,player,num){
            return Infinity;
        },
                },
            },
            "pz4":{
                audio:"ext:瀚海辰星:2",
                firstDo:true,
                trigger:{
                    player:"useCard1",
                },
                forced:true,
                filter:function (event,player){
        return !event.audioed;
    },
                content:function (){
        trigger.audioed=true;
        game.delay(2);
    },
                mod:{
                    targetInRange:function (card,player){
           return true;
        },
                    cardUsable:function (card,player,num){
            return Infinity;
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
            "tuwei1":{
                audio:"ext:瀚海辰星:2",
                trigger:{
                    player:"phaseJieshuBegin",
                },
                forced:true,
                content:function (){
var num=Math.max(1,game.countPlayer(function(current){
return current.getEquip(1);
}));
player.draw(num);},
                ai:{
                    effect:{
                        target:function (card){
if(card.name=='guiyoujie') return [0,2];
},
                    },
                },
            },
            "tuwei2":{
                audio:"ext:瀚海辰星:2",
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                direct:true,
                content:function (){
'step 0'
var num=Math.max(1,game.countPlayer(function(current){
return current.getEquip(1);
}));
player.chooseTarget(get.prompt('tuwei2'),'弃置0至'+get.cnNumber(num)+'名角色区域的各一张牌',true,[0,num],function(card,player,target){
return target.countDiscardableCards(player,'hej')>0;
}).ai=function(target){
var player=_status.event.player;
return get.effect(target,{name:'guohe'},player,player);
};
'step 1'
if(result.bool){
result.targets.sortBySeat();
event.targets=result.targets;
player.line(result.targets,'green');
player.logSkill('tuwei2',result.targets);
}
else event.finish();
'step 2'
event.current=targets.shift();
player.discardPlayerCard(event.current,'hej',true)
if(targets.length) event.redo();
},
            },
            huairou:{
                audio:"ext:瀚海辰星:2",
                enable:"phaseUse",
                position:"he",
                filter:function (event,player){            
return player.countCards('he',{type:'equip'})>0;            
},
                filterCard:function (card){            
return get.type(card)=='equip';            
},
                check:function (card){                
if(_status.event.player.isDisabled(get.subtype(card))) return 5;                
return 3-get.value(card);            
},
                content:function (){                
player.draw();                
},
                discard:false,
                visible:true,
                loseTo:"discardPile",
                prompt:"将一张装备牌置入弃牌堆并摸一张牌",
                delay:0.5,
                prepare:function (cards,player){                    
player.$throw(cards,1000);            
game.log(player,'将',cards,'置入了弃牌堆');                },
                ai:{
                    order:10,
                    result:{
                        player:1,
                    },
                },
            },
            "longxiao1":{
                mod:{
                    cardname:function (card,player){
if(card.name=='tao') return 'sha';
},
                },
            },
            "longxiao2":{
                mod:{
                    cardname:function (card,player){
if(card.name=='shan') return 'jiu';
},
                },
            },
            "s1":{
                mod:{
                    cardname:function (card,player){
if(card.name=='sha') return 'wuxie';
},
                },
            },
            "s2":{
                mod:{
                    cardname:function (card,player){
if(card.name=='shan') return 'wuxie';
},
                },
            },
            "s3":{
                mod:{
                    cardname:function (card,player){
if(card.name=='tao') return 'wuxie';
},
                },
            },
            "s4":{
                mod:{
                    cardname:function (card,player){
if(card.name=='jiu') return 'wuxie';
},
                },
            },
            sishouzhuangtai:{
                mark:true,
                marktext:"守",
                intro:{
                    name:"死守状态",
                    content:"锁定技，你的基本牌均视为【无懈可击】",
                },
                group:["s1","s2","s3","s4"],
            },
            xiaoyong:{
                audio:"ext:瀚海辰星:2",
                trigger:{
                    player:"phaseUseBegin",
                },
                forced:true,
                direct:true,
                filter:function (event,player){
for(var i=0;i<game.players.length;i++){
if(player.canCompare(game.players[i])) return true;
}
return false;
},
                content:function (){
"step 0"
player.chooseTarget(get.prompt2('xiaoyong'),function(card,player,target){
return player.canCompare(target);
},true).set('ai',function(target){
return -get.attitude(_status.event.player,target)/target.countCards('h');
});
"step 1"
if(result.bool){
player.logSkill('xiaoyong',result.targets[0]);
player.chooseToCompare(result.targets[0]);
}
else{
event.finish();
}
"step 2"
if(result.bool){  player.chooseToDisable().ai=function(event,player,list){
                if(list.contains('equip5')) return 'equip5';
                return list.randomGet();
            };

}
    
else{ player.chooseToEnable();

 
}
       'step3'
                    var card1=result.player;           
                var card2=result.target;
            if(get.position(card1)=='d') target.gain(card1,'gain2');
            if(get.position(card2)=='d') player.gain(card2,'gain2');
},
                ai:{
                    expose:0.1,
                },
            },
            "pz1":{
                audio:"ext:瀚海辰星:2",
                trigger:{
                    player:"useCardToPlayered",
                },
                filter:function (event,player){
    if(event.target.isEmpty(2)&&event.target.isEmpty(3)) return false;
       if(event.target.isDisabled(2)&&event.target.isEmpty(3)) return false;    
       if(event.target.isEmpty(2)&&event.target.isDisabled(3)) return false;
       if(event.target.isDisabled(2)&&event.target.isDisabled(3)) return false; 
    return _status.currentPhase==player&&player!=event.target;},
                check:function (event,player){
return get.attitude(player,event.target)<0;
},
                intro:{
                    content:"card",
                },
                priority:3,
                forced:true,
                content:function (){
"step 0"
trigger.target.discard(trigger.target.getCards('e',{subtype:'equip2'}));
"step1"
trigger.target.discard(trigger.target.getCards('e',{subtype:'equip3'}));
game.delay(3);
},
                ai:{
                    "unequip_ai":true,
                    skillTagFilter:function (player,tag,arg){            
        if(arg&&arg.name=='sha') return true;                
        return false;                    },
                },
            },
            "pz2":{
                audio:"ext:瀚海辰星:2",
                trigger:{
                    player:"useCardToPlayered",
                },
                filter:function (event,player){
    if(event.target.hasSkill('fengyin')) return false;
return _status.currentPhase==player&&player!=event.target;},
                check:function (event,player){
return get.attitude(player,event.target)<0;
},
                intro:{
                    content:"card",
                },
                forced:true,
                priority:2,
                content:function (){
"step 0"
if(!trigger.target.hasSkill('fengyin')){
trigger.target.addTempSkill('fengyin');
game.delay(3);
}
},
            },
            "pz3":{
                audio:"ext:瀚海辰星:2",
                trigger:{
                    player:"useCardToPlayered",
                },
                filter:function (event,player){
    if(event.target.hasSkill('canfei')) return false;
return _status.currentPhase==player&&player!=event.target;},
                check:function (event,player){
return get.attitude(player,event.target)<0;
},
                intro:{
                    content:"card",
                },
                forced:true,
                content:function (){
"step 0"
if(!trigger.target.hasSkill('canfei')){
trigger.target.addTempSkill('canfei');
game.delay(3);
}
},
            },
            "pz5":{
                audio:"ext:瀚海辰星:2",
                trigger:{
                    source:"damageBegin1",
                },
                filter:function (event){
        return event.card&&event.notLink();
    },
                forced:true,
                content:function (){
        trigger.num++;
        game.delay(2);
    },
            },
            "pozhen1":{
                mark:true,
                marktext:"1",
                intro:{
                    name:"1阶破阵状态",
                    content:"锁定技，你使用牌指定一名其他角色为目标后，其弃置装备区中的防具和+1马",
                },
                group:"pz1",
            },
            "pozhen2":{
                mark:true,
                marktext:"2",
                intro:{
                    name:"2阶破阵状态",
                    content:"锁定技，你使用牌指定一名其他角色为目标后，其弃置装备区中的防具和+1马，然后你令其非锁定技失效直到回合结束",
                },
                group:["pz1","pz2"],
            },
            "pozhen3":{
                mark:true,
                marktext:"3",
                intro:{
                    name:"3阶破阵状态",
                    content:"锁定技，你使用牌指定一名其他角色为目标后，其弃置装备区中的防具+1马，然后你令其非锁定技失效且不能使用和打出手牌直到回合结束",
                },
                group:["pz1","pz2","pz3"],
            },
            "pozhen4":{
                mark:true,
                marktext:"4",
                intro:{
                    name:"4阶破阵状态",
                    content:"锁定技，你使用牌无距离和次数限制；你使用牌指定一名其他角色为目标后，其弃置装备区中的防具+1马，然后你令其非锁定技失效且不能使用和打出手牌直到回合结束",
                },
                group:["pz1","pz2","pz3","pz4"],
            },
            "pozhen5":{
                mark:true,
                marktext:"5",
                intro:{
                    name:"5阶破阵状态",
                    content:"锁定技，你使用牌无距离和次数限制；你使用的牌伤害+1；你使用牌指定一名其他角色为目标后，其弃置装备区中的防具+1马，然后你令其非锁定技失效且不能使用和打出手牌直到回合结束",
                },
                group:["pz1","pz2","pz3","pz4","pz5"],
            },
            canfei:{
                mark:true,
                marktext:"残",
                intro:{
                    name:"残废",
                    content:"不能使用和打出手牌",
                },
                mod:{
                    "cardEnabled2":function (card){                
        if(get.position(card)=='h') return false;                
    },
                },
            },
            mingren:{
                audio:"nzry_mingren_1",
                init:function (player){
        if(!player.storage.mingren) player.storage.mingren=[];
    },
                marktext:"任",
                intro:{
                    content:"cards",
                    onunmark:function (storage,player){
            if(storage&&storage.length){
                player.$throw(storage,1000);
                game.cardsDiscard(storage);
                game.log(storage,'被置入了弃牌堆');
                player.storage.mingren.length=0;
            }
        },
                },
                mark:true,
                group:["mingren_1","mingren_2"],
                subSkill:{
                    "1":{
                        audio:"nzry_mingren_1",
                        trigger:{
                            global:"gameDrawAfter",
                            player:"enterGame",
                        },
                        forced:true,
                        filter:function (event,player){
                return !player.storage.mingren||!player.storage.mingren.length;
            },
                        content:function (){
                'step 0'
                player.draw();
                'step 1'
                player.chooseCard('h','请选择一张手牌置于你的武将牌上，称为“任”',true).set('ai',function(card){
                    return 6-get.value(card);
                });
                'step 2'
                if(result.bool){
                    player.storage.mingren.push(result.cards[0]);
                    player.syncStorage('mingren');
                    game.log(player,'将',result.cards[0],'置于其武将牌上');
                    player.lose(result.cards[0],ui.special,'toStorage');
                };
            },
                        sub:true,
                    },
                    "2":{
                        audio:"nzry_mingren_2",
                        trigger:{
                            player:"phaseUseEnd",
                        },
                        direct:true,
                        content:function (){
                'step 0'
                player.chooseCard('h','是否用一张手牌替换“任”？').set('ai',function(card){
                    return 5-get.value(card);
                });
                'step 1'
                if(result.bool){
                    player.logSkill('mingren');
                    if(player.storage.mingren!=undefined&&player.storage.mingren[0]!=undefined){
                        player.gain(player.storage.mingren[0],'gain2','fromStorage');
                        player.storage.mingren.remove(player.storage.mingren[0]);
                    };
                    player.syncStorage('mingren');
                    player.storage.mingren.push(result.cards[0]);
                    player.syncStorage('mingren');
                    game.log(player,'将',result.cards[0],'置于其武将牌上');
                    player.lose(result.cards[0],ui.special,'toStorage');
                };
            },
                        sub:true,
                    },
                },
            },
            zhenliang:{
                audio:"nzry_zhenliang_1",
                mark:true,
                locked:false,
                zhuanhuanji:true,
                marktext:"贞",
                intro:{
                    content:function (storage,player,skill){
            if(player.storage.zhenliang==true) return '你的回合外，当你使用或打出与“任”类别相同的牌时，你可以令任意名角色摸一张牌';
            return '出牌阶段限一次，你可以选择一名攻击范围内的其他角色，然后弃置X张与“任”颜色相同的牌并对其造成一点伤害（X为你与其的体力差且至少为1）';
        },
                },
                group:["zhenliang_1","zhenliang_2"],
                subSkill:{
                    "1":{
                        prompt:"出牌阶段限一次，你可以选择一名攻击范围内的其他角色，然后弃置X张与“任”颜色相同的牌并对其造成一点伤害（X为你与其的体力差且至少为1）",
                        audio:"nzry_zhenliang_1",
                        enable:"phaseUse",
                        usable:1,
                        filter:function (event,player){
                return game.hasPlayer(function(current){
                    return current!=player&&
                    get.distance(player,current,'attack')<=1&&
                    player.storage.mingren!=undefined&&
                    player.countCards('he',{color:get.color(player.storage.mingren[0])})>=Math.max(Math.abs(current.hp-player.hp),1);
                })&&player.storage.zhenliang!=true;
            },
                        filterTarget:function (card,player,target){
                return player.storage.mingren!=undefined&&
                target!=player&&
                get.distance(player,target,'attack')<=1&&
                player.countCards('he',{color:get.color(player.storage.mingren[0])})>=Math.max(Math.abs(target.hp-player.hp),1);
            },
                        content:function (){
                'step 0'
                player.chooseToDiscard('请选择发动【贞良】的牌',Math.max(Math.abs(target.hp-player.hp),1),'he',{color:get.color(player.storage.mingren[0])},true).set('ai',function(card){
                    return 6-get.value(card);
                });
                'step 1'
                if(result.bool){
                    player.storage.zhenliang=true;
                    target.damage('nocard');
                };
            },
                        ai:{
                            order:5,
                            result:{
                                target:function (player,target){
                        if(Math.abs(target.hp-player.hp)<=1) return -1;
                    },
                            },
                        },
                        sub:true,
                    },
                    "2":{
                        audio:"nzry_zhenliang_2",
                        trigger:{
                            player:["useCardAfter","respondAfter"],
                        },
                        filter:function (event,player){
                return _status.currentPhase!=player&&
                player.storage.mingren!=undefined&&
                player.storage.mingren[0]!=undefined&&
                get.type(player.storage.mingren[0])==get.type(event.card)&&
                player.storage.zhenliang==true;
            },
                        direct:true,
                        content:function (){
                "step 0"
                   player.chooseTarget(get.prompt('zhenliang'),'令任意名角色各摸一张牌',[1,Infinity]).ai=function(target){
                    return get.attitude(player,target)
                };
                "step 1"
                if(result.bool){
                    player.storage.zhenliang=false;
                    player.line(result.targets);
              
            player.logSkill('zhenliang',result.targets);
            game.asyncDraw(result.targets);
        
       }else{
                    event.finish();
                };
            },
                        sub:true,
                    },
                },
            },
            jinji:{
                audio:"ext:瀚海辰星:2",
                trigger:{
                    player:"disableEquipAfter",
                },
                forced:true,
                content:function (){
"step 0"
if(player.storage.disableEquip!=undefined&&player.storage.disableEquip.length==1){
player.addSkill('pozhen1');
player.removeSkill('pozhen2');
player.removeSkill('pozhen3');
player.removeSkill('pozhen4');
player.removeSkill('pozhen5');
};
"step 1"
if(player.storage.disableEquip!=undefined&&player.storage.disableEquip.length==2){
player.addSkill('pozhen2');
player.removeSkill('pozhen1');
player.removeSkill('pozhen3');
player.removeSkill('pozhen4');
player.removeSkill('pozhen5');
};
"step2"
if(player.storage.disableEquip!=undefined&&player.storage.disableEquip.length==3){
player.addSkill('pozhen3');
player.removeSkill('pozhen2');
player.removeSkill('pozhen1');
player.removeSkill('pozhen4');
player.removeSkill('pozhen5');
};
"step 3"
if(player.storage.disableEquip!=undefined&&player.storage.disableEquip.length==4){
player.addSkill('pozhen4');
player.removeSkill('pozhen2');
player.removeSkill('pozhen3');
player.removeSkill('pozhen1');
player.removeSkill('pozhen5');
};
"step4"
if(player.storage.disableEquip!=undefined&&player.storage.disableEquip.length==0){
player.removeSkill('pozhen1');
player.removeSkill('pozhen2');
player.removeSkill('pozhen3');
player.removeSkill('pozhen4');
player.removeSkill('pozhen5');
};
"step5"
if(player.storage.disableEquip!=undefined&&player.storage.disableEquip.length==5){
player.addSkill('pozhen5');
player.removeSkill('pozhen2');
player.removeSkill('pozhen3');
player.removeSkill('pozhen4');
player.removeSkill('pozhen1');
};
},
            },
            tuishou:{
                audio:"ext:瀚海辰星:2",
                trigger:{
                    player:"enableEquipAfter",
                },
                forced:true,
                content:function (){
"step 0"
if(player.storage.disableEquip!=undefined&&player.storage.disableEquip.length==1){
player.addSkill('pozhen1');
player.removeSkill('pozhen2');
player.removeSkill('pozhen3');
player.removeSkill('pozhen4');
player.removeSkill('pozhen5');
};
"step 1"
if(player.storage.disableEquip!=undefined&&player.storage.disableEquip.length==2){
player.addSkill('pozhen2');
player.removeSkill('pozhen1');
player.removeSkill('pozhen3');
player.removeSkill('pozhen4');
player.removeSkill('pozhen5');
};
"step2"
if(player.storage.disableEquip!=undefined&&player.storage.disableEquip.length==3){
player.addSkill('pozhen3');
player.removeSkill('pozhen2');
player.removeSkill('pozhen1');
player.removeSkill('pozhen4');
player.removeSkill('pozhen5');
};
"step 3"
if(player.storage.disableEquip!=undefined&&player.storage.disableEquip.length==4){
player.addSkill('pozhen4');
player.removeSkill('pozhen2');
player.removeSkill('pozhen3');
player.removeSkill('pozhen1');
player.removeSkill('pozhen5');
};
"step4"
if(player.storage.disableEquip!=undefined&&player.storage.disableEquip.length==0){
player.removeSkill('pozhen1');
player.removeSkill('pozhen2');
player.removeSkill('pozhen3');
player.removeSkill('pozhen4');
player.removeSkill('pozhen5');
};
"step5"
if(player.storage.disableEquip!=undefined&&player.storage.disableEquip.length==5){
player.addSkill('pozhen5');
player.removeSkill('pozhen2');
player.removeSkill('pozhen3');
player.removeSkill('pozhen4');
player.removeSkill('pozhen1');
};
},
            },
            "pozhen_":{
                derivation:["pozhen1","pozhen2","pozhen3","pozhen4","pozhen5"],
                group:["tuishou","jinji"],
            },
            "yizhong8":{
                mark:true,
                marktext:"毅",
                intro:{
                    name:"毅重",
                    content:"黑色【杀】对你无效",
                },
                trigger:{
                    target:"shaBefore",
                },
                forced:true,
                audio:"yizhong",
                filter:function (event,player){
        if(player.getEquip(2)) return false;
        if(player.hasSkill('jieyue2')) return false;
        return (event.card.name=='sha'&&get.color(event.card)=='black')
    },
                content:function (){
        trigger.cancel();
    },
                ai:{
                    effect:{
                        target:function (card,player,target){
                if(player==target&&get.subtype(card)=='equip2'){
                    if(get.equipValue(card)<=8) return 0;
                }
                if(target.getEquip(2)) return;
                if(card.name=='sha'&&get.color(card)=='black') return 'zerotarget';
            },
                    },
                },
            },
            "jieyue8":{
                group:["jieyue1","laobie"],
                trigger:{
                    global:"gameDrawAfter",
                    player:["phaseZhunbeiAfter","equipEnd","loseEnd","phaseJieshuAfter"],
                },
                forced:true,
                popup:false,
                content:function (){
        'step0'
        if(player.hasSkill('jieyue2')||player.getEquip(2)){
            player.removeSkill('yizhong8');
        };
            'step1'
            if(!player.hasSkill('jieyue2')&&player.isEmpty(2)){
                player.addSkill('yizhong8');
            };
    },
            },
            "yanzheng8":{
                enable:"chooseToUse",
                audio:"yanzheng",
                filter:function (event,player){
        return player.hp<player.countCards('h')&&player.countCards('e')>0;
    },
                viewAsFilter:function (player){
        return player.hp<player.countCards('h')&&player.countCards('e')>0;
    },
                filterCard:true,
                position:"e",
                viewAs:{
                    name:"wuxie",
                },
                prompt:"将一张装备区内的牌当无懈可击使用",
                check:function (card){return 8-get.equipValue(card)},
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
                },
            },
            "yanzheng9":{
                enable:"chooseToUse",
                audio:"yanzheng",
                filter:function (event,player){
        return player.hp<player.countCards('h')&&player.countCards('e')>0;
    },
                viewAsFilter:function (player){
        return player.hp<player.countCards('h')&&player.countCards('e')>0;
    },
                filterCard:true,
                position:"e",
                viewAs:{
                    name:"shan",
                },
                prompt:"将一张装备区内的牌当闪使用或打出",
                check:function (card){return 8-get.equipValue(card)},
                threaten:1.2,
                ai:{
                    RespondShan:true,
                    basic:{
                        useful:[7,2],
                        value:[7,2],
                    },
                    result:{
                        player:1,
                    },
                    expose:0.2,
                },
            },
            "yanzheng_ys":{
                group:["yanzheng8","yanzheng9"],
            },
            pojia:{
                audio:"pz1",
                trigger:{
                    player:"useCardToPlayered",
                },
                filter:function (event){       
    if(event.target.isEmpty(2)) return false;
       if(event.target.isDisabled(2)) return false;    
 
        return event.card.name=='sha';            
    },
                forced:true,
                logTarget:"target",
                content:function (){                
        trigger.target.addTempSkill('qinggang2');                
        trigger.target.storage.qinggang2.add(trigger.card);            
    },
            },
            "cuorui_ys":{
                audio:"cuorui",
                trigger:{
                    global:"gameDrawAfter",
                    player:"enterGame",
                },
                forced:true,
                group:["cuorui6"],
                content:function (){
    player.disableJudge();
        
      
    },
            },
            "liewei_ys":{
                audio:"liewei",
                trigger:{
                    source:"dyingBegin",
                },
                content:function (){
   'step0'
            player.draw(2);
        'step1'
        if(!player.hasSkill('nu')){
            player.addTempSkill('nu');
        }

    },
            },
            nu:{
                mark:true,
                marktext:"裂",
                intro:{
                    name:"裂围",
                    content:"你使用牌无次数限制",
                },
                mod:{
                    cardUsable:function (card,player,num){
            return Infinity;
        },
                },
            },
            "jizhan_ys":{
                audio:"zhanyi",
                enable:"phaseUse",
                usable:1,
                filter:function (event,player){
        return player.storage.disableEquip!=undefined&&player.storage.disableEquip.length<5;
    },
                content:function (){
        'step 0'
        player.chooseToDisable(true).set('ai',function(event,player,list){
                          
            if(list.contains('equip2')&&player.hp<3&&player.countCards('h',{type:'basic'})>0) return 'equip2';        
                  if(list.contains('equip1')&&player.countCards('h',{name:'jiu'})>0&&player.countCards('h',{name:'sha'})>0) return 'equip1';
                  if(list.contains('equip1')&&list.contains('equip1')&&game.roundNumber>2&&player.countCards('h',{name:'sha'})>0) return 'equip1';              
            if(list.contains('equip6')&&player.countCards('h',{type:'trick'})>1||list.contains('equip6')&&player.countCards('he',{name:'zhuge'})>0||list.contains('equip6')&&player.countCards('h')<3) return 'equip6';
            if(list.contains('equip5')&&player.countCards('h')>=5&&player.countCards('h',{color:'black'})<=3&&player.countCards('h',{type:'trick'})>1&&player.countCards('h',{color:'black'})>=2||list.contains('equip5')&&player.countCards('h')>=5&&player.countCards('h',{name:'sha'})>2&&player.countCards('h',{name:'zhuge'})>0) return 'equip5';

        });
        'step 1'

        if(result.control=='equip1'){
            player.addTempSkill('zhanyi_equip0');
        };
        if(result.control=='equip2'){
            player.addTempSkill('zhanyi_basic0');
        };
        if(result.control=='equip6'){
            player.draw(2);
            player.addTempSkill('zhanyi_trick0');
        };
        if(result.control=='equip5'){
            player.addTempSkill('fenyin0');
        };
 
        
    },
                ai:{
                    order:9.1,
                    result:{
                        player:function (player){
                if(!player.isDisabled('equip2')&&player.hp<3&&player.countCards('h',{type:'basic'})>0) return 1;
                if(!player.isDisabled('equip1')&&player.countCards('h',{name:'jiu'})>0&&player.countCards('h',{name:'sha'})>0) return 1;                      
                if(!player.isDisabled('equip6')&&player.countCards('h',{type:'trick'})>1||!player.isDisabled('equip6')&&player.countCards('h')<3||!player.isDisabled('equip6')&&player.countCards('he',{name:'zhuge'})>0) return 1;
                      if(!player.isDisabled('equip5')&&player.countCards('h')>=5&&player.countCards('h',{color:'black'})<=3&&player.countCards('h',{type:'trick'})>0&&player.countCards('h',{color:'black'})>1) return 1;
                         
                  return -1;
                
            },
                    },
                },
            },
            "xinzhanyi_basic0":{
                mark:true,
                marktext:"战",
                intro:{
                    name:"战意基本牌",
                    content:"你可以将一张基本牌当任意基本牌使用，你以此法使用的第一张基本牌伤害值或回复值+1",
                },
                group:["xinzhanyi_basic4","xinzhanyi_basic3"],
                onremove:function (p,s){                
    delete p.storage[s+1];            
    },
                enable:"chooseToUse",
                filter:function (event,player){                    if(event.filterCard({name:'sha'},player,event)||                        event.filterCard({name:'jiu'},player,event)||                        event.filterCard({name:'tao'},player,event)){                    
    return player.hasCard(function(card){            
                return get.type(card)=='basic';},'h');                
    }                
    return false;            
    },
                chooseButton:{
                    dialog:function (event,player){                    
    var list=[];            
            if(event.filterCard({name:'sha'},player,event)){            
                list.push(['基本','','sha']);        
                    list.push(['基本','','sha','fire']);        
                    list.push(['基本','','sha','thunder']);                    
    }                        if(event.filterCard({name:'tao'},player,event)){                            list.push(['基本','','tao']);                    
    }                    
    if(event.filterCard({name:'jiu'},player,event)){                        
    list.push(['基本','','jiu']);                    
    }                    
    return ui.create.dialog('战意',[list,'vcard'],'hidden');                
    },
                    check:function (button){                    
var player=_status.event.player;            
        var card={name:button.link[2],nature:button.link[3]};                        if(game.hasPlayer(function(current){                    
    return player.canUse(card,current)&&get.effect(current,card,player,player)>0;                        })){                        
switch(button.link[2]){                        
    case 'tao':return 5;                        
case 'jiu':{                        
        if(player.countCards('h',{type:'basic'})>=2) return 3;                                };                                case 'sha':                                    if(button.link[3]=='fire') return 2.95;                                    else if(button.link[3]=='thunder') return 2.92;                                    else return 2.9;                            }                        }                        return 0;                    },
                    backup:function (links,player){                        return {                            audio:'zhanyi',                            filterCard:function(card,player,target){                                return get.type(card)=='basic';                            },                            check:function(card,player,target){                                return 9-get.value(card);                            },                            viewAs:{name:links[0][2],nature:links[0][3]},                            position:'he',                            popname:true,                        }                    },
                    prompt:function (links,player){                        return '将一张基本牌当做'+get.translation(links[0][3]||'')+get.translation(links[0][2])+'使用';                    },
                },
                ai:{
                    order:function (){                        var player=_status.event.player;                        var event=_status.event;                        if(event.filterCard({name:'jiu'},player,event)&&get.effect(player,{name:'jiu'})>0&&player.countCards('h',{type:'basic'})>=2){                            return 3.3;                        }                        return 3.1;                    },
                    save:true,
                    respondSha:true,
                    skillTagFilter:function (player,tag,arg){                        if(player.hasCard(function(card){                            return get.type(card)=='basic';                        },'he')){                            if(tag=='respondSha'){                                if(arg!='use') return false;                            }                        }                        else{                            return false;                        }                    },
                    result:{
                        player:1,
                    },
                },
            },
            "xinzhanyi_trick0":{
                mark:true,
                marktext:"战",
                intro:{
                    name:"战意锦囊牌",
                    content:"你使用锦囊牌不可被【无懈可击】响应",
                },
                group:"xinzhanyi_trick",
            },
            "xinzhanyi_equip0":{
                mark:true,
                marktext:"战",
                intro:{
                    name:"战意装备牌",
                    content:"你使用【杀】指定一个目标后，其弃置两张牌，你获得其中的一张牌",
                },
                group:"xinzhanyi_equip",
            },
            "xinzhanyi_ys":{
                audio:"zhanyi",
                enable:"phaseUse",
                usable:1,
                filterCard:true,
                position:"he",
                check:function (card){
        var player=_status.event.player;
        if(player.hp<3) return 0;
        var type=get.type(card,'trick');
        if(type=='trick'){
            return 6-get.value(card);
        }
        else if(type=='equip'){
            if(player.hasSha()&&game.hasPlayer(function(current){
                return (player.canUse('sha',current)&&
                    get.attitude(player,current)<0&&
                    get.effect(current,{name:'sha'},player,player)>0)
            })){
                return 6-get.value(card);
            }
        }
        return 0;
    },
                content:function (){
        
        player.loseHp();
        switch(get.type(cards[0],'trick')){
            case 'basic':player.addTempSkill('xinzhanyi_basic0',{player:'phaseUseEnd'});break;
            case 'equip':player.addTempSkill('xinzhanyi_equip0',{player:'phaseUseEnd'});break;
            case 'trick':player.addTempSkill('xinzhanyi_trick0',{player:'phaseUseEnd'});player.draw(3);break;
        };

    },
                ai:{
                    order:9.1,
                    result:{
                        player:1,
                    },
                },
            },
            "xinzhanyi_basic8":{
                mark:true,
                marktext:"战",
                intro:{
                    name:"疾战防具栏",
                    content:"你可以将一张基本牌当任意基本牌使用，你以此法使用的第一张基本牌伤害值或回复值+1",
                },
                group:["xinzhanyi_basic5","xinzhanyi_basic6"],
                onremove:function (p,s){                
    delete p.storage[s+1];            
    },
                enable:"chooseToUse",
                filter:function (event,player){                    if(event.filterCard({name:'sha'},player,event)||                        event.filterCard({name:'jiu'},player,event)||                        event.filterCard({name:'tao'},player,event)){                    
    return player.hasCard(function(card){            
                return get.type(card)=='basic';},'h');                
    }                
    return false;            
    },
                chooseButton:{
                    dialog:function (event,player){                    
    var list=[];            
            if(event.filterCard({name:'sha'},player,event)){            
                list.push(['基本','','sha']);        
                    list.push(['基本','','sha','fire']);        
                    list.push(['基本','','sha','thunder']);                    
    }                        if(event.filterCard({name:'tao'},player,event)){                            list.push(['基本','','tao']);                    
    }                    
    if(event.filterCard({name:'jiu'},player,event)){                        
    list.push(['基本','','jiu']);                    
    }                    
    return ui.create.dialog('疾战',[list,'vcard'],'hidden');                
    },
                    check:function (button){                    
var player=_status.event.player;            
        var card={name:button.link[2],nature:button.link[3]};                        if(game.hasPlayer(function(current){                    
    return player.canUse(card,current)&&get.effect(current,card,player,player)>0;                        })){                        
switch(button.link[2]){                        
    case 'tao':return 5;                        
case 'jiu':{                        
        if(player.countCards('h',{type:'basic'})>=2) return 3;                                };                                case 'sha':                                    if(button.link[3]=='fire') return 2.95;                                    else if(button.link[3]=='thunder') return 2.92;                                    else return 2.9;                            }                        }                        return 0;                    },
                    backup:function (links,player){                        return {                            audio:'zhanyi',                            filterCard:function(card,player,target){                                return get.type(card)=='basic';                            },                            check:function(card,player,target){                                return 9-get.value(card);                            },                            viewAs:{name:links[0][2],nature:links[0][3]},                            position:'he',                            popname:true,                        }                    },
                    prompt:function (links,player){                        return '将一张基本牌当做'+get.translation(links[0][3]||'')+get.translation(links[0][2])+'使用';                    },
                },
                ai:{
                    order:function (){                        var player=_status.event.player;                        var event=_status.event;                        if(event.filterCard({name:'jiu'},player,event)&&get.effect(player,{name:'jiu'})>0&&player.countCards('h',{type:'basic'})>=2){                            return 3.3;                        }                        return 3.1;                    },
                    save:true,
                    respondSha:true,
                    skillTagFilter:function (player,tag,arg){                        if(player.hasCard(function(card){                            return get.type(card)=='basic';                        },'he')){                            if(tag=='respondSha'){                                if(arg!='use') return false;                            }                        }                        else{                            return false;                        }                    },
                    result:{
                        player:1,
                    },
                },
            },
            "xinzhanyi_trick8":{
                mark:true,
                marktext:"战",
                intro:{
                    name:"疾战坐骑栏",
                    content:"你使用锦囊牌不可被【无懈可击】响应",
                },
                group:"xinzhanyi_trick",
            },
            "xinzhanyi_equip8":{
                mark:true,
                marktext:"战",
                intro:{
                    name:"疾战武器栏",
                    content:"你使用【杀】指定一个目标后，其弃置两张牌，你获得其中的一张牌",
                },
                group:"xinzhanyi_equip",
            },
            "fenyin0":{
                mark:true,
                marktext:"疾",
                intro:{
                    name:"疾战宝物栏",
                    content:"当你使用一张牌时，若此牌与你上一张使用的牌颜色不同，你可以摸一张牌",
                },
                group:"fenyin",
            },
            jiegong:{
                audio:"liejun4",
                skillAnimation:true,
                animationColor:"thunder",
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                forced:true,
                unique:true,
                juexingji:true,
                derivation:"xinzhanyi_ys",
                init:function (player){
        player.storage.jiegong=false;
    },
                filter:function (event,player){
        return !player.storage.jiegong&&((player.storage.disableEquip!=undefined&&player.storage.disableEquip.length==5));
    },
                content:function (){
        "step 0"
        player.storage.jiegong=true;
        player.loseMaxHp();
        player.disableJudge();
        "step 1"
        var num=player.maxHp-player.countCards('h');
        if(num>0) player.draw(num);
        player.removeSkill('jizhan_ys');
        player.awakenSkill('jiegong');
        player.addSkill('xinzhanyi_ys');
    },
            },
            "xinzhanyi_basic3":{
                trigger:{
                    source:["damageBegin","recoverBegin"],
                },
                forced:true,
                silent:true,
                popup:false,
                filter:function (event){                    return event.getParent(2).xinzhanyi_ys==true;                },
                content:function (){                    trigger.num++                },
            },
            "xinzhanyi_basic4":{
                trigger:{
                    player:"useCard",
                },
                filter:function (event,player){                    return event.skill=='xinzhanyi_basic0_backup'&&!player.storage.xinzhanyi_basic4;                },
                forced:true,
                silent:true,
                popup:false,
                content:function (){                    trigger.xinzhanyi_ys=true;                    player.storage.xinzhanyi_basic4=true;                },
            },
            "xinzhanyi_basic5":{
                trigger:{
                    source:["damageBegin","recoverBegin"],
                },
                forced:true,
                silent:true,
                popup:false,
                filter:function (event){                    return event.getParent(2).jizhan_ys==true;                },
                content:function (){                    trigger.num++                },
            },
            "xinzhanyi_basic6":{
                trigger:{
                    player:"useCard",
                },
                filter:function (event,player){                    return event.skill=='xinzhanyi_basic8_backup'&&!player.storage.xinzhanyi_basic6;                },
                forced:true,
                silent:true,
                popup:false,
                content:function (){                    trigger.jizhan_ys=true;                    player.storage.xinzhanyi_basic6=true;                },
            },
            "pojun_ys":{
                audio:"pojun",
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
                filter:function (event,player){
if(event._notrigger.contains(event.player)) return false;
        return event.card&&event.card.name=='sha'&&event.player.isAlive()&&event.notLink()&&event.player!=player&&event.notTianxiang();
    },
                logTarget:"player",
                content:function (){
                'step 0'

            player.chooseControl(function(){
                return 1;
            }).set('choiceList',[
                '令'+(get.translation(trigger.player))+'翻面并摸'+get.cnNumber(trigger.player.hp)+'张牌',
                '令'+(get.translation(trigger.player))+'获得一个“溃”标记(当其成为【杀】的目标后，须移去一个“溃”并弃置两张牌)'
            ]);
        

        'step 1'
        if(result.control=='选项一'){
              trigger.player.turnOver();
           
    trigger.player.draw(Math.min(5,trigger.player.hp));
           
        }
        else{      
            trigger.player.addSkill('kuijun0');
 trigger.player.addMark('kuijun0');

        }
        
        
        
        
 
        
        
        
        
        
        
        
        
        
        
        
        
    },
            },
            "danshou_ys":{
                audio:"danshou",
                trigger:{
                    source:"damageSource",
                    player:"damageEnd",
                },
                check:function (event,player){
        return get.attitude(player,event.player)<=0;
    },
                content:function (){
        "step 0"
        player.draw();
        "step 1"
        var evt=_status.event.getParent('phase');
        if(evt){
            game.resetSkills();
            _status.event=evt;
            _status.event.finish();
            _status.event.untrigger(true);
        }
    },
                ai:{
                    jueqing:true,
                    effect:{
                        target:function (card,player,target){
                if(get.tag(card,'damage'&&target.countCards('h'))){
                    return 0.8
                }
            },
                    },
                },
            },
            "yizhong9":{
                trigger:{
                    player:["phaseZhunbeiAfter","phaseJieshuAfter"],
                    global:"gameDrawAfter",
                },
                forced:true,
                content:function (){
           'step0'
           if(player.hasSkill('jieyue2')){player.removeSkill('yizhong8')};
               'step1'
               if(!player.hasSkill('jieyue2')&&!player.hasSkill('yizhong8')){player.addSkill('yizhong8')};
       },
            },
            "zhanyi0":{
                audio:"zhanyi",
                enable:"phaseUse",
                usable:1,
                filterCard:true,
                position:"he",
                check:function (card){
        var player=_status.event.player;
        if(player.hp<3) return 0;
        var type=get.type(card,'trick');
        if(type=='trick'){
            return 6-get.value(card);
        }
        else if(type=='equip'){
            if(player.hasSha()&&game.hasPlayer(function(current){
                return (player.canUse('sha',current)&&
                    get.attitude(player,current)<0&&
                    get.effect(current,{name:'sha'},player,player)>0)
            })){
                return 6-get.value(card);
            }
        }
        return 0;
    },
                content:function (){
        player.loseHp();
 
        switch(get.type(cards[0],'trick')){
            case 'basic':player.addTempSkill('zhanyi_basic0');break;
            case 'equip':player.addTempSkill('zhanyi_equip0');break;
            case 'trick':player.addTempSkill('zhanyi_trick0');player.draw(2);break;
                
        };
     
    },
                ai:{
                    order:9.1,
                    result:{
                        player:1,
                    },
                },
            },
            "zhanyi_basic0":{
                mark:true,
                marktext:"疾",
                intro:{
                    name:"疾战防具栏",
                    content:"你可以将一张基本牌当任意基本牌使用",
                },
                group:["xinzhanyi_basic1","xinzhanyi_basic2"],
                onremove:function (p,s){                
    delete p.storage[s+1];            
    },
                enable:"chooseToUse",
                filter:function (event,player){                    if(event.filterCard({name:'sha'},player,event)||                        event.filterCard({name:'jiu'},player,event)||                        event.filterCard({name:'tao'},player,event)){                    
    return player.hasCard(function(card){            
                return get.type(card)=='basic';},'h');                
    }                
    return false;            
    },
                chooseButton:{
                    dialog:function (event,player){                    
    var list=[];            
            if(event.filterCard({name:'sha'},player,event)){            
                list.push(['基本','','sha']);        
                    list.push(['基本','','sha','fire']);        
                    list.push(['基本','','sha','thunder']);                    
    }                        if(event.filterCard({name:'tao'},player,event)){                            list.push(['基本','','tao']);                    
    }                    
    if(event.filterCard({name:'jiu'},player,event)){                        
    list.push(['基本','','jiu']);                    
    }                    
    return ui.create.dialog('疾战',[list,'vcard'],'hidden');                
    },
                    check:function (button){                    
var player=_status.event.player;            
        var card={name:button.link[2],nature:button.link[3]};                        if(game.hasPlayer(function(current){                    
    return player.canUse(card,current)&&get.effect(current,card,player,player)>0;                        })){                        
switch(button.link[2]){                        
    case 'tao':return 5;                        
case 'jiu':{                        
        if(player.countCards('h',{type:'basic'})>=2) return 3;                                };                                case 'sha':                                    if(button.link[3]=='fire') return 2.95;                                    else if(button.link[3]=='thunder') return 2.92;                                    else return 2.9;                            }                        }                        return 0;                    },
                    backup:function (links,player){                        return {                            audio:'zhanyi',                            filterCard:function(card,player,target){                                return get.type(card)=='basic';                            },                            check:function(card,player,target){                                return 9-get.value(card);                            },                            viewAs:{name:links[0][2],nature:links[0][3]},                            position:'he',                            popname:true,                        }                    },
                    prompt:function (links,player){                        return '将一张基本牌当做'+get.translation(links[0][3]||'')+get.translation(links[0][2])+'使用';                    },
                },
                ai:{
                    order:function (){                        var player=_status.event.player;                        var event=_status.event;                        if(event.filterCard({name:'jiu'},player,event)&&get.effect(player,{name:'jiu'})>0&&player.countCards('h',{type:'basic'})>=2){                            return 3.3;                        }                        return 3.1;                    },
                    save:true,
                    respondSha:true,
                    skillTagFilter:function (player,tag,arg){                        if(player.hasCard(function(card){                            return get.type(card)=='basic';                        },'he')){                            if(tag=='respondSha'){                                if(arg!='use') return false;                            }                        }                        else{                            return false;                        }                    },
                    result:{
                        player:1,
                    },
                },
            },
            "zhanyi_trick0":{
                mark:true,
                marktext:"疾",
                intro:{
                    name:"疾战坐骑栏",
                    content:"你使用牌无距离限制",
                },
                group:"zhanyi_trick",
            },
            "zhanyi_equip0":{
                mark:true,
                marktext:"疾",
                intro:{
                    name:"疾战武器栏",
                    content:"你使用【杀】指定一个目标后，其弃置两张牌",
                },
                group:"zhanyi_equip",
            },
            feijian:{
                mod:{
                    targetInRange:function (card,player){
            if(card.name=='sha') return true;
        },
                },
            },
            "ganglie_ys":{
                audio:"ganglie",
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
            player.draw();
            if(trigger.source.countCards('he')){
                player.discardPlayerCard(trigger.source,'he',true);
          
            }
        }
        else if(trigger.source.isIn()){
            trigger.source.damage();
        }
        event.num--;
        if(event.num>0){
            player.chooseBool(get.prompt2('reganglie'));
        }
        else{
            event.finish();
        }
        "step 3"
        if(result.bool){
            player.logSkill('reganglie',trigger.source);
            event.goto(1);
        }
    },
                ai:{
                    "maixie_defend":true,
                    expose:0.4,
                },
            },
            "hengjiang_ys":{
                audio:"hengjiang",
                trigger:{
                    player:"damageEnd",
                },
                check:function (event,player){
        return get.attitude(player,_status.currentPhase)<0||!_status.currentPhase.needsToDiscard(2);
    },
                filter:function (event){
        return _status.currentPhase&&_status.currentPhase.isIn()&&event.num>0;
    },
                content:function (){
        var source=_status.currentPhase;
        if(source.hasSkill('hengjiang2')){
            source.storage.hengjiang2+=player.maxHp-player.hp;
            source.storage.hengjiang3.add(player);
            source.updateMarks();
        }
        else{
            source.storage.hengjiang3=[player];
            source.storage.hengjiang2=player.maxHp-player.hp;
            source.addTempSkill('hengjiang2');
        }
    },
                ai:{
                    "maixie_defend":true,
                },
            },
            liren:{
                audio:"ext:瀚海辰星:2",
                init:function (player){
        if(!player.storage.liren) player.storage.liren=0;
    },
                market:"刃",
                intro:{
                    content:"觉醒进程：#/3",
                },
                trigger:{
                    source:"damageEnd",
                },
                forced:true,
                filter:function (event,player){
        return event.player!=player;
    },
                content:function (){
        
        player.draw();
        player.storage.liren++;
        player.markSkill('liren');
        
        
        
        
        
    },
            },
            heian:{
                trigger:{
                    player:"phaseBegin",
                },
                audio:"ext:瀚海辰星:2",
                skillAnimation:true,
                animationColor:"fire",
                filter:function (event,player){
        return player.hasSkill('liren')&&player.storage.liren>=3;
    },
                forced:true,
                content:function (){
        "step 0"
    
            if(player.name2!=undefined){
               player.chooseControl(player.name,player.name2).set('prompt','请选择要更换的武将牌');
            }else event._result={control:player.name};
    
        "step 1"
        player.reinit(result.control,'anxing');
        if(_status.characterlist){
            _status.characterlist.add(result.control);
            _status.characterlist.remove('anxing');
        }
  
    },
            },
            guangming:{
                trigger:{
                    player:"phaseBegin",
                },
                audio:"ext:瀚海辰星:2",
                skillAnimation:true,
                animationColor:"metal",
                filter:function (event,player){
        return player.hasSkill('liren')&&player.storage.liren>=3;
    },
                forced:true,
                content:function (){
        "step 0"

 
            if(player.name2!=undefined){
               player.chooseControl(player.name,player.name2).set('prompt','请选择要更换的武将牌');
            }else event._result={control:player.name};
 
        "step 1"
        player.reinit(result.control,'guangxing');
        if(_status.characterlist){
            _status.characterlist.add(result.control);
            _status.characterlist.remove('guangxing');
        }
      
     
    },
            },
            "xueren0":{
                audio:"ext:瀚海辰星:2",
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                check:function (event,player){
        if(player.hasJudge('lebu')||player.hasJudge('bingliang')) return false;
        return(player.countCards('h',{name:'sha'})>2);
    },
                content:function (){
        'step0'
player.loseHp();
        'step1'
player.draw(1);
        player.addTempSkill('wushicishu');
        player.addTempSkill('mengjin');
 
    
     
    },
            },
            wushijuli:{
                mark:true,
                marktext:"辉",
                intro:{
                    name:"辉刃",
                    content:"使用牌无距离限制，使用【杀】可以多指定一个目标",
                },
                mod:{
                    targetInRange:function (card,player,target,now){        
            return true;            
            
        },
                },
            },
            wushicishu:{
                mark:true,
                marktext:"血",
                intro:{
                    name:"血刃",
                    content:"使用牌无次数限制且视为拥有“猛进”",
                },
                mod:{
                    cardUsable:function (card,player,num){
            return Infinity;
        },
                },
            },
            "xiaoyong1":{
                trigger:{
                    player:"damageEnd",
                    source:"damageEnd",
                },
                forced:true,
                content:function (){
        player.chooseToDisable();
    },
            },
            "xiaoyong2":{
                trigger:{
                    global:"phaseAfter",
                },
                forced:true,
                content:function (){
           player.chooseToEnable();
 
       },
            },
            "xiaoyong0":{
                group:["xiaoyong1","xiaoyong2"],
            },
            "cuorui6":{
                audio:"xinjuejing_ys",
                trigger:{
                    global:"gameDrawAfter",
                },
                priority:-1,
                content:function (){
        'step 0'
        var shas=player.getCards('h','sha');
        var num;
        if(player.hp>=4&&shas.length>=3){
            num=3;
        }
        else if(player.hp>=3&&shas.length>=2){
            num=2;
        }

        else{
            
            num=1
        }
        var map={};
        var list=[];
        for(var i=1;i<=player.hp;i++){
            var cn=get.cnNumber(i,true);
            map[cn]=i;
            list.push(cn);
        }
        event.map=map;
        player.awakenSkill('qimou');
        player.storage.qimou=true;
        player.chooseControl(list,function(){
            return get.cnNumber(_status.event.goon,true);
        }).set('prompt','失去任意点体力').set('goon',num);
        'step 1'
        var num=event.map[result.control]||1;
        player.storage.qimou2=num;
        player.loseHp(num);
        player.draw(num*2);

    },
                ai:{
                    order:2,
                    result:{
                        player:function (player){
                if(player.hp==1) return 0;
                var shas=player.getCards('h','sha');
                if(!shas.length) return 0;
                var card=shas[0];
                if(!lib.filter.cardEnabled(card,player)) return 0;
                if(lib.filter.cardUsable(card,player)) return 0;
                var mindist;
                if(player.hp>=4&&shas.length>=3){
                    mindist=4;
                }
                else if(player.hp>=3&&shas.length>=2){
                    mindist=3;
                }
                else{
                    mindist=2;
                }
                if(game.hasPlayer(function(current){
                    return (current.hp<=mindist-1&&
                        get.distance(player,current,'attack')<=mindist&&
                        player.canUse(card,current,false)&&
                        get.effect(current,card,player,player)>0);
                })){
                    return 1;
                }
                return 0;
            },
                    },
                },
            },
            huiren:{
                audio:"ext:瀚海辰星:2",
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                filter:function (event,player){
      return (player.countCards('h')>0);
    },
                content:function (){
        'step0'
player.chooseToDiscard('h',true);
        'step1'
                       
        player.addTempSkill('wushijuli');
 player.addTempSkill('pojia');
        player.addTempSkill('duomubiao');
                       
    },
            },
            duomubiao:{
                audio:"ext:瀚海辰星:2",
                trigger:{
                    player:"useCard2",
                },
                direct:true,
                filter:function (event,player){
        return event.card&&event.card.name=='sha'&&game.countPlayer()>2;
    },
                content:function (){
        'step 0'
        var num=1;
        player.chooseTarget('是否为此【杀】增加一个目标？',[1,num],function(card,player,target){
            return target!=player&&!trigger.targets.contains(target)&&player.canUse({name:'sha'},target);
        }).ai=function(target){
            return get.effect(target,{name:'sha'},_status.event.player);
        };
        'step 1'
        if(result.bool&&result.targets&&result.targets.length){
            var targets=result.targets;
            player.logSkill('duomubiao',targets);
            player.line(targets,trigger.card.nature);
            trigger.targets.addArray(targets);
        }
    },
            },
            yingbao:{
                audio:"ext:瀚海辰星:2",
                unique:true,
                enable:"phaseUse",
                mark:true,
                skillAnimation:true,
                animationColor:"fire",
                limited:true,
                init:function (player){
        player.storage.yingbao=false;
    },
                filter:function (event,player){
        if(player.storage.yingbao) return false;
        if(player.countCards('he',{type:'equip'})=0) return false;
return true;
        
    },
                filterTarget:function (card,player,target){
        return target!=player;
    },
                content:function (){
   
        'step0'
     player.chooseToDiscard('he',{type:'equip'},true);

        'step1'

        player.awakenSkill('yingbao');
     player.storage.yingbao1=target;
        player.addTempSkill('yingbao1');
        target.addTempSkill('yingbao2');
        target.addTempSkill('yingbao3');
'step2'

if(!target.hasSkill('fengyin')){
target.addTempSkill('fengyin');};
    },
                ai:{
                    order:13,
                    result:{
                        target:function (player,target){
                var hs=player.countCards('h',{name:['sha','juedou']});
                var ts=target.hp;
                if(hs>=ts&&ts>1) return -1;
                return 0;
            },
                    },
                },
                intro:{
                    content:"limited",
                },
            },
            "yingbao1":{
                charlotte:true,
                mod:{
                    targetInRange:function (card,player,target){                
            if(target==player.storage.yingbao1) return true;            
        },
                },
            },
            "yingbao2":{
                mark:true,
                marktext:"影",
                intro:{
                    content:"当前回合结束时，失去一点体力并弃置#张牌",
                },
                trigger:{
                    target:"useCardToPlayered",
                },
                filter:function (event){
        if(event.target==!'anxing') return false;
        return true;
    },
                forced:true,
                content:function (){
        player.addMark('yingbao2');
    },
            },
            "yingbao3":{
                trigger:{
                    global:"phaseJieshuBegin",
                },
                forced:true,
                content:function (){
 
        player.chooseToDiscard('he',player.countMark('yingbao2'),true);
    
         
    },
            },
            yaozhan:{
                audio:"ext:瀚海辰星:2",
                unique:true,
                trigger:{
                    player:"phaseUseBegin",
                },
                mark:true,
                skillAnimation:true,
                animationColor:"metal",
                limited:true,
                init:function (player){
        player.storage.yaozhan=false;
    },
                filter:function (event,player){
        if(player.storage.yaozhan) return false;
return true;
        
    },
                content:function (){
        'step0'
  
        player.awakenSkill('yaozhan');
              player.storage.yaozhan=true;
        player.addTempSkill('yaozhan1');
        player.addTempSkill('yaozhan2');
        player.addTempSkill('yaozhan3');
        player.addTempSkill('yaozhan4');
        'step1'
         
        player.discard(player.getCards('he'));
;
        'step2'
        player.chooseUseTarget('【耀斩】<br>视为使用一张【杀】(第一张，共三张)',{name:'sha'},false,'nodistance',true);
        player.chooseUseTarget('【耀斩】<br>视为使用一张【杀】(第二张，共三张)',{name:'sha'},false,'nodistance',true);
        player.chooseUseTarget('【耀斩】<br>视为使用一张【杀】(第三张，共三张)',{name:'sha'},false,'nodistance',true);
    
    },
                ai:{
                    order:13,
                },
                intro:{
                    content:"limited",
                },
            },
            "yaozhan1":{
                mark:true,
                marktext:"斩",
                intro:{
                    content:"当前回合结束时，摸#张牌",
                },
            },
            "yaozhan2":{
                trigger:{
                    source:"damageEnd",
                },
                forced:true,
                content:function (){

        player.addMark('yaozhan1');
  
    },
            },
            "yaozhan3":{
                trigger:{
                    player:"phaseJieshuBegin",
                },
                forced:true,
                content:function (){
        player.draw(player.countMark('yaozhan1'));
    },
            },
            "yaozhan4":{
                trigger:{
                    player:"useCardAfter",
                },
                forced:true,
                content:function (){
        player.removeSkill('yaozhan2');
        player.addTempSkill('yaozhan5');
        player.addTempSkill('yaozhan6');
    player.removeSkill('yaozhan4');
    trigger.cancel();
    },
            },
            "yaozhan5":{
                trigger:{
                    source:"damageEnd",
                },
                forced:true,
                content:function (){

    player.addMark('yaozhan1');
      },
            },
            "yaozhan6":{
                trigger:{
                    player:"useCardAfter",
                },
                forced:true,
                content:function (){
        player.removeSkill('yaozhan5');
        player.addTempSkill('yaozhan7');
        player.addTempSkill('yaozhan8');
    player.removeSkill('yaozhan6');
    trigger.cancel();
    },
            },
            "yaozhan8":{
                trigger:{
                    player:"useCardAfter",
                },
                forced:true,
                content:function (){
        player.removeSkill('yaozhan7');
        player.removeSkill('yaozhan6');
        player.removeSkill('yaozhan4');
    player.removeSkill('yaozhan8');
    trigger.cancel();
    },
            },
            "yaozhan7":{
                trigger:{
                    source:"damageEnd",
                },
                forced:true,
                content:function (){
 
    player.addMark('yaozhan1');
   },
            },
            shifang:{
                trigger:{
                    player:"phaseBegin",
                },
                filter:function (event,player){
        return player.hasSkill('liren')&&player.storage.liren>=3;
    },
                content:function (){
               'step 0'

            player.chooseControl(function(){
                return 1;
            }).set('choiceList',[
            '将武将牌替换为“统御李信”(体力上限：3；输出炮台)',
                '将武将牌替换为“狂暴李信”(体力上限：5；自爆卡车)'
            ]
        );
        

        'step 1'
        if(result.control=='选项一'){
              player.addSkill('guangming');
        }
        else{         
  player.addSkill('heian');
        }
    },
            },
            "xueren6":{
                mark:true,
                locked:true,
                marktext:"血",
                intro:{
                    content:function (storage,player,skill){
            if(player.storage.xueren6==true) return '锁定技，出牌阶段开始时，你减1点体力上限并令本回合手牌上限+2，本回合所有其他角色非锁定技失效且不能使用和打出手牌';
            return '锁定技，出牌阶段开始时，你失去1点体力并摸两张牌，本回合你使用牌无距离和次数限制';
        },
                },
                audio:"xueren0",
                trigger:{
                    player:"phaseUseBegin",
                },
                forced:true,
                content:function (){
        if(player.storage.xueren6==true){
            player.storage.xueren6=false;
            player.loseMaxHp();
 
            player.addTempSkill('longnu_2',{player:'phaseAfter'});
        }else{
            player.storage.xueren6=true;
            player.loseHp();
            player.draw(2);
            player.addTempSkill('longnu_1',{player:'phaseAfter'});
        };
    },
            },
            "longnu_1":{
                mod:{
                    targetInRange:function (card,player){
           return true;
        },
                    cardUsable:function (card,player,num){
            return Infinity;
        },
                },
            },
            "longnu_2":{
                mod:{
                    maxHandcard:function (player,num){
            return num+2
        },
                },
                trigger:{
                    player:"phaseUseBegin",
                },
                forced:true,
                content:function (){
        'step0'
        game.countPlayer(function(current){
            if(current!=player&&!current.hasSkill('fengyin')){
                player.line(current,'fire');
                current.addTempSkill('fengyin');
            }
        });
        'step1'
             game.countPlayer(function(current){
            if(current!=player&&!current.hasSkill('canfei')){
                player.line(current,'fire');
                current.addTempSkill('canfei');
            }
        });
    },
            },
            wuwei:{
                marktext:"削",
                intro:{
                    content:"共有#个“星削”",
                },
                trigger:{
                    player:"damageBegin4",
                },
                group:["yingshi0"],
                forced:true,
                content:function (){
        'step0'
        player.addMark('wuwei',trigger.num);
        'step1'
        trigger.cancel();
    },
            },
            "yingshi0":{
                trigger:{
                    player:"phaseJieshuBegin",
                },
                forced:true,
                filter:function (event,player){
        return (player.countMark('wuwei')>0);
    },
                content:function (){
        'step0'
        player.removeMark('wuwei',1);
        'step1'
        player.loseHp();
        
    },
            },
            xiuluo:{
                init:function (player,skill){
        if(!player.storage[skill]) player.storage.xiuluo=[];
    },
                marktext:"铠",
                intro:{
                    content:"cards",
                    onunmark:function (storage,player){
            if(storage&&storage.length){
                player.$throw(storage,1000);
                game.cardsDiscard(storage);
                game.log(storage,'被置入了弃牌堆');
             storage.length=0;
            }
        },
                },
                mark:true,
                audio:"ext:瀚海辰星:2",
                trigger:{
                    source:"damageBegin2",
                },
                filter:function (event,player){
       if(player.hasSkill('sb')) return false;
       return (event.notLink());
   },
                direct:true,
                content:function (){
        'step 0'
        player.choosePlayerCard('是否发动【极刃】？<br>将'+(get.translation(trigger.player))+'一张牌置于你的武将牌上','he',trigger.player).set('ai',function(button){
            return -get.attitude(player,trigger.player)+1;
        });
        'step 1'
        if(result&&result.links&&result.links.length){
            player.line(player,trigger.player);
            player.logSkill('xiuluo');
            player.storage.xiuluo.push(result.links[0]);
            player.syncStorage('xiuluo');
            trigger.player.lose(result.links[0],ui.special,'toStorage');
            trigger.player.$give(result.links,player);
            game.log(player,'将',result.links[0],'置于其武将牌上');
        };
    },
            },
            "xiuluo0":{
                trigger:{
                    player:"useCard2",
                },
                filter:function (event){
        return (trigger.targets.length>1);
    },
                forced:true,
                content:function (){
        player.addTempSkill('xiuluoshixiao',{player:"useCardAfter"});
    },
            },
            xiuluoshixiao:{
                trigger:{
                    source:"damageEnd",
                },
                priority:2,
                forced:true,
                content:function (){
        trigger.cancel();
    },
            },
            moqv:{
                audio:"ext:瀚海辰星:2",
                unique:true,
                trigger:{
                    player:"phaseJieshuBegin",
                },
                derivation:"mokai",
                mark:true,
                skillAnimation:true,
                animationColor:"water",
                limited:true,
                init:function (player){
        player.storage.moqv=false;
    },
                filter:function (event,player){
        if(player.storage.moqv) return false;
        return true;
    },
                filterTarget:function (card,player,target){
        return target!=player;
    },
                content:function (){
        player.awakenSkill('moqv');
        player.storage.moqv=true;
      
        player.disableJudge();
        player.addSkill('moqv_chufa');
player.addSkill('sb');
        player.addSkill('xiuluo_xiugai');
        player.addSkill('888');
        player.removeSkill('666');
 
    },
                ai:{
                    order:13,
                    result:{
                        target:function (player){
                
                if(player.storage.xiuluo.length>=3) return -1;
                return 0;
            },
                    },
                },
                intro:{
                    content:"limited",
                },
            },
            "moqv_chufa":{
                trigger:{
                    player:"phaseBegin",
                },
                forced:true,
                content:function (){
        'step0'
               event.card=get.cardPile(function(card){
                return get.subtype(card)=='equip1'&&!player.isDisabled(get.subtype(card));
            });
                player.chooseUseTarget(event.card,'noanimate','nopopup',true);
              event.card=get.cardPile(function(card){
                return get.subtype(card)=='equip2'&&!player.isDisabled(get.subtype(card));
            });
                player.chooseUseTarget(event.card,'noanimate','nopopup',true);
        

        game.delay();

        'step1'
        player.addSkill('mokai_shenfen');
        player.addSkill('mokai_erdao');
                player.addSkill('mokai_heisha');
                player.addSkill('mokai_hongsha');
                player.addSkill('mokai_jianshang');
        player.addSkill('mokai');
        player.addSkill('mokai_shixiao');
        
        player.removeSkill('moqv_chufa');
    },
            },
            mokai:{
                mark:true,
                marktext:"极",
                intro:{
                    name:"魔铠状态",
                    content:"锁定技，你于出牌阶段可以多使用一张【杀】；你使用黑色【杀】无视防具、红色【杀】伤害+1；当你受到伤害时，令此伤害减至1并摸一张牌。准备阶段，若你有“铠”，你获得一张“铠”并令所有其他角色弃置一张牌；若你没有“铠”，你弃置所有牌并失去“魔铠”",
                },
            },
            "mokai_shenfen":{
                audio:"moqv",
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                forced:true,
                direct:true,
                content:function (){
             'step 0'
 
        player.chooseCardButton('###【回旋之刃】###获得一张“铠”并令所有其他角色弃置一张牌',player.storage.xiuluo,true);

        'step 1'
              player.logSkill('mokai_shenfen');
             player.gain(result.links[0],'gain2','fromStorage');
            player.storage.xiuluo.remove(result.links[0]);
            
                     player.syncStorage('xiuluo');
        'step2'
                 game.countPlayer(function(current){
            if(current!=player){
                player.line(current,'thunder');
                current.chooseToDiscard('he',true);
            }
        }); 
  
       },
            },
            "mokai_erdao":{
                mod:{
                    cardUsable:function (card,player,num){                    
            if(card.name=='sha') return num+1;            
        },
                },
            },
            "mokai_heisha":{
                audio:"moqv",
                trigger:{
                    player:"useCardToPlayered",
                },
                filter:function (event){       
    if(event.target.isEmpty(2)) return false;
       if(event.target.isDisabled(2)) return false;    
 
        return (get.name(event.card)=='sha'&&get.color(event.card)=='black');
    },
                forced:true,
                logTarget:"target",
                content:function (){                
        trigger.target.addTempSkill('qinggang2');                
        trigger.target.storage.qinggang2.add(trigger.card);            
    },
            },
            "mokai_hongsha":{
                audio:"moqv",
                trigger:{
                    source:"damageBegin1",
                },
                filter:function (event){
        return (event.card&&get.name(event.card)=='sha'&&get.color(event.card)=='red');
    },
                forced:true,
                content:function (){
        trigger.num++;
        
    },
            },
            "mokai_jianshang":{
                audio:"moqv",
                trigger:{
                    player:"damageBegin3",
                },
                forced:true,
                group:["moqv_mopai"],
                content:function (){
        player.draw();
   trigger.num=1;

    },
            },
            "xiuluo_xiugai":{
                audio:"ext:瀚海辰星:2",
                trigger:{
                    source:"damageBegin2",
                },
                direct:true,
                filter:function (event,player){
         
  
      if(player.hasSkill('sd')) return false;
        return (event.notLink());
    },
                content:function (){
        player.discardPlayerCard('是否发动【极刃】？<br>弃置'+(get.translation(trigger.player))+'一张牌',trigger.player,'he');
    },
            },
            "mokai_shixiao":{
                audio:"kai0",
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                filter:function (event,player){
               return(player.storage.xiuluo.length==0)
                
    },
                forced:true,
                priority:2,
                content:function (){
        'step0'
             
                player.unmarkSkill('xiuluo');
        'step1'

              player.removeSkill('mokai_shenfen');
        player.removeSkill('mokai_erdao');
                player.removeSkill('mokai_heisha');
                player.removeSkill('mokai_hongsha');
                player.removeSkill('mokai_jianshang');
        player.removeSkill('mokai');
        
                player.removeSkill('mokai_shixiao');        
        'step2'
        player.discard(player.getCards('he'));
        
        
        
        
        
        
        
        
        
    },
            },
            sd:{
            },
            reqizhou:{
                trigger:{
                    player:["phaseBefore","equipEnd","loseEnd"],
                },
                forced:true,
                popup:false,
                derivation:["yingzi","qixi","xuanfeng"],
                filter:function (event,player){
        if(player.equiping) return false;
        var suits=[];
        var es=player.getCards('e');
        for(var i=0;i<es.length;i++){
            suits.add(get.suit(es[i]));
        }
        if(player.additionalSkills.reqizhou){
            return player.additionalSkills.reqizhou.length!=suits.length;
        }
        else{
            return suits.length>0;
        }
    },
                content:function (){
        var suits=[];
        var es=player.getCards('e');
        for(var i=0;i<es.length;i++){
            suits.add(get.suit(es[i]));
        }
        player.removeAdditionalSkill('reqizhou');
        switch(suits.length){
            case 1:player.addAdditionalSkill('reqizhou',['yingzi']);break;
            case 2:player.addAdditionalSkill('reqizhou',['yingzi','qixi']);break;
            case 3:player.addAdditionalSkill('reqizhou',['yingzi','qixi','xuanfeng']);break;
            case 4:player.addAdditionalSkill('reqizhou',['yingzi','qixi','xuanfeng']);break;
        }
    },
                ai:{
                    threaten:1.2,
                },
            },
            yingqu:{
                mod:{
                    maxHandcard:function (player,num){
            return num+player.getDamagedHp();
        },
                },
                forced:true,
                firstDo:true,
                filter:function (event,player){
        return player.isDamaged()&&player.countCards('h')>player.hp;
    },
                content:function (){},
            },
            "reshanxi2":{
                marktext:"袭",
                init:function (player,skill){                
        if(!player.storage[skill]) player.storage[skill]=[];            
    },
                trigger:{
                    global:"phaseEnd",
                },
                forced:true,
                popup:false,
                charlotte:true,
                filter:function (event,player){                    
        return player.storage.reshanxi2&&player.storage.reshanxi2.length>0;            
    },
                content:function (){                
    game.log(player,'收回了'+get.cnNumber(player.gain(player.storage.reshanxi2,'draw','fromStorage').cards.length)+'张〖闪袭〗牌');                
    player.storage.reshanxi2.length=0;                    player.removeSkill('reshanxi2');                },
                intro:{
                    onunmark:"throw",
                    content:"cardCount",
                },
            },
            rshanxi:{
                audio:"shanxi",
                trigger:{
                    player:"phaseUseBegin",
                },
                filter:function (event,player){
        return(player.countCards('h',{type:['basic'],color:'red'})>0);
    },
                direct:true,
                content:function (){
        'step 0'
        player.chooseTarget('是否发动【闪袭】？','弃置一张红色基本牌并将一名其他角色的至多X张牌置于其武将牌上(X为你的体力值)，本回合结束时，其获得这些牌',function(card,player,target){
            return target!=player&&target.countCards('he')>0;
        }).set('ai',function(target){
            return (1-get.attitude(_status.event.player,target))/target.countCards('he');
        }).set('targets',trigger.targets);
        'step 1'
        
        if(result.bool){
          player.chooseToDiscard('弃置一张红色基本牌','h',{type:['basic'],color:'red'},true); 
     var target=result.targets[0];
            event.target=result.targets[0];
            player.logSkill('rshanxi',target);
            player.choosePlayerCard('将'+(get.translation(target))+'至多'+get.cnNumber(player.hp)+'张牌置于其武将牌上',target,'he',[1,Math.min(player.hp,target.countCards('he'))]);ai=get.buttonValue;
        }
        else event.finish();
        

               
      
        'step 2'
        if(result.bool){
                       player.logSkill('rshanxi',target);
            target.addSkill('reshanxi2');
            target.storage.reshanxi2.addArray(result.cards);
            target.lose(result.cards,ui.special,'toStorage');
            game.log(target,'失去了'+get.cnNumber(result.cards.length)+'张牌');
            target.markSkill('reshanxi2');
  
        }
    },
            },
            "cuorui1":{
                audio:"cuorui",
                mark:true,
                marktext:"疾",
                intro:{
                    name:"疾行",
                    content:"判定阶段开始时，你可以弃置此标记，然后弃置判定区内的所有牌",
                },
                trigger:{
                    player:"phaseJudgeBegin",
                },
                filter:function (event,player){
        return (player.countMark('cuorui1')>0&&player.countCards('j')>0);
    },
                content:function (){
           player.removeMark('cuorui1',1);
player.discard(player.getCards('j'));
       },
            },
            "cuorui2":{
                audio:"cuorui",
                mark:true,
                marktext:"勇",
                intro:{
                    name:"勇进",
                    content:"摸牌阶段开始时，你可以弃置此标记，然后本阶段你多摸两张牌",
                },
                trigger:{
                    player:"phaseDrawBegin1",
                },
                filter:function (event,player){
        return (player.countMark('cuorui2')>0);
    },
                content:function (){
           player.removeMark('cuorui2',1);
           player.addTempSkill('yingzi_ys',{player:"phaseDrawEnd"});
       },
            },
            "cuorui3":{
                audio:"cuorui",
                mark:true,
                marktext:"破",
                intro:{
                    name:"破阵",
                    content:"出牌阶段开始时，你可以弃置此标记，然后本阶段你可以多使用两张【杀】",
                },
                trigger:{
                    player:"phaseUseBegin",
                },
                filter:function (event,player){
        return (player.countMark('cuorui3')>0);
    },
                content:function (){
           player.removeMark('cuorui3',1);
           player.addTempSkill('paoxiao_ys',{player:"phaseUseEnd"});
       },
                ai:{
                    order:2,
                },
            },
            "cuorui4":{
                audio:"cuorui",
                mark:true,
                marktext:"镇",
                intro:{
                    name:"镇围",
                    content:" 弃牌阶段开始时，你可以弃置此标记，然后本阶段你的手牌上限+2 ",
                },
                trigger:{
                    player:"phaseDiscardBegin",
                },
                filter:function (event,player){
        if(player.countCards('h')<=player.hp) return false;
           return (player.countMark('cuorui4')>0);
       },
                content:function (){
           player.removeMark('cuorui4',1);
player.addTempSkill('jiashangxian',{player:"phaseDiscardEnd"});
       },
            },
            "cuorui0":{
                audio:"cuorui",
                trigger:{
                    global:"gameDrawAfter",
                },
                derivation:["cuorui1","cuorui2","cuorui3","cuorui4"],
                group:["cuorui1","cuorui2","cuorui3","cuorui4"],
                forced:true,
                content:function (){'step0'
                      player.addMark('cuorui4');
                        'step1'
                      player.addMark('cuorui3');
                        'step2'
                      player.addMark('cuorui2');
                        'step3'
                      player.addMark('cuorui1');
           
       },
            },
            "yingzi_ys":{
                trigger:{
                    player:"phaseDrawBegin2",
                },
                forced:true,
                content:function (){
        trigger.num++;
        trigger.num++;
 
    },
                ai:{
                    threaten:1.3,
                },
            },
            "paoxiao_ys":{
                mod:{
                    cardUsable:function (card,player,num){                    
            if(card.name=='sha') return num+2;            
        },
                },
            },
            jiashangxian:{
                mod:{
                    maxHandcard:function (player,num){
            return num+2
        },
                },
            },
            "moqv_mopai":{
                trigger:{
                    player:"damageBegin4",
                },
                forced:true,
                content:function (){
     trigger.num=1;
    },
            },
            liekai:{
                audio:"liewei",
                trigger:{
                    source:"die",
                },
                forced:true,
                content:function (){
        'step 0'

            player.chooseControl(function(){
                return 1;
            }).set('choiceList',[
                '摸三张牌',
                '获得四种标记各一个(疾行、勇进、破阵、镇围)'
            ]
        );
        

        'step 1'
        if(result.control=='选项一'){
       player.draw(3);
        }
        else{         
 player.removeMark('cuorui1');              
         player.removeMark('cuorui2');              
    player.removeMark('cuorui3');                   
     player.removeMark('cuorui4');                       
                      player.addMark('cuorui4');                      
                      player.addMark('cuorui3');                
                      player.addMark('cuorui2');                      
                      player.addMark('cuorui1');
        }
    },
            },
            laobie:{
                trigger:{
                    global:"gameDrawAfter",
                    player:["phaseBegin","equipEnd","loseEnd","phaseAfter"],
                },
                forced:true,
                popup:false,
                content:function (){
        'step0'
        if(player.hasSkill('jieyue2')||player.getEquip(2)){
            player.removeSkill('yizhong8');
        };
            'step1'
            if(!player.hasSkill('jieyue2')&&player.isEmpty(2)){
                player.addSkill('yizhong8');
            };
    },
            },
            "kuijun0":{
                Charlotte:true,
                mark:true,
                marktext:"溃",
                intro:{
                    content:"成为“杀”的目标后，须移去一个“溃”并弃置两张牌",
                },
                trigger:{
                    target:"useCardToTargeted",
                },
                filter:function (event,player){
        return(event.card.name=='sha');
    },
                forced:true,
                content:function (){
    'step0'
           player.removeMark('kuijun0');
           player.chooseToDiscard('he',true,2);
        'step1'
        if(player.countMark('kuijun0')==0){
            player.removeSkill('kuijun0');
        }
        
       },
                ai:{
                    threaten:4.5,
                },
            },
            "kuijun1":{
                trigger:{
                    target:"useCardToTargeted",
                },
                priority:-1,
                forced:true,
                filter:function (event,player){
        return (player.countMark('kuijun0')<1);
    },
                content:function (){
 
            player.removeSkill('kuijun0');
        player.removeSkill('kuijun1');
        
    },
            },
            rekuangcai:{
                audio:"kuangcai",
                trigger:{
                    player:"phaseUseBegin",
                },
                filter:function (event,player){
        return player.countCards('he')>0;
    },
                content:function (){
        'step 0'
        player.draw(2);
        'step 1'
        player.chooseCard('弃置至少一张牌','he',[1,player.countCards('he')],true).set('ai',function(card){
            if(get.position(card)=='e') return 1-get.value(card);
            if(card.name=='shan'||card.name=='du'||!player.hasValueTarget(card)) return 1;
            return 4-get.value(card);
        });
        'step 2'
 
            player.addTempSkill('sb',{player:"phaseUseEnd"});
            player.addTempSkill('kuang',{player:"phaseUseEnd"});
            player.addTempSkill('rekuangcai2',{player:"phaseUseEnd"})
            player.logSkill('rekuangcai');

            player.discard(result.cards);

        
    },
                ai:{
                    threaten:2,
                },
            },
            "rekuangcai2":{
                trigger:{
                    player:"loseAfter",
                },
                popup:false,
                forced:true,
                filter:function (event,player){
        if(!player.hasSkill('sb')) return false;
        return true;
    },
                content:function (){
        "step 0"
        var num=trigger.hs.length+trigger.es.length;
player.addMark('kuang',num);
        player.removeSkill('sb');
        "step 1"
        game.delay();
    },
            },
            kuang:{
                mark:true,
                marktext:"狂",
                intro:{
                    content:"使用牌无距离和次数限制，使用牌时摸一张牌。<br>本阶段还可以再使用#张牌。",
                },
                audio:"kuangcai",
                trigger:{
                    player:"useCard2",
                },
                forced:true,
                content:function (){
        'step0'
        player.removeMark('kuang',1);
        'step1'
     player.draw();
        'step2'
     if(player.countMark('kuang')==0){
                player.addTempSkill('zhi',{player:"phaseUseEnd"});
 
 
      
   
     
     }
    },
                mod:{
                    targetInRange:function (card,player){
           return true;
        },
                    cardUsable:function (card,player,num){
            return Infinity;
        },
                },
            },
            zhi:{
                mark:true,
                marktext:"止",
                intro:{
                    content:"本阶段不能再使用牌",
                },
                group:["drlt_wanglie2"],
            },
            "gangyi0":{
                group:["gangyi1","gangyi2"],
                ai:{
                    threaten:3,
                },
            },
            "gangyi1":{
                trigger:{
                    player:"damageBegin3",
                },
                forced:true,
                content:function (){
        'step0'
        trigger.num=1;
        'step1'
        player.draw();
    },
            },
            "gangyi2":{
                trigger:{
                    player:"damageBegin4",
                },
                popup:false,
                forced:true,
                content:function (){
     
        trigger.num=1;
      
    },
            },
            "tiebi0":{
                skillAnimation:true,
                animationColor:"metal",
                unique:true,
                juexingji:true,
                audio:"ext:瀚海辰星:2",
                trigger:{
                    player:"dyingBegin",
                },
                forced:true,
                derivation:["fenghuo1","shoulei0"],
                content:function (){
"step0"
player.turnOver();
player.discard(player.getCards('he'));
        'step1'
player.recover(3-player.hp);
"step2"
        game.countPlayer(function(current){
            if(current!=player&&!current.hasSkill('fenghuo0')){
    
                current.addSkill('fenghuo0');
            }
        });
          player.addTempSkill('susu',{player:"phaseBegin"});      
  player.addTempSkill('fenghuo1',{player:"phaseBegin"});      
player.addTempSkill('canfei',{player:"phaseBegin"});
player.addTempSkill('tiebi1',{player:"phaseZhunbeiBegin"});
player.removeSkill('gangyi0');

player.awakenSkill('tiebi0');
game.delay();
},
            },
            "tiebi1":{
                trigger:{
                    player:"phaseBegin",
                },
                forced:true,
                popup:false,
                content:function (){
       
              game.countPlayer(function(current){
            if(current!=player&&current.hasSkill('fenghuo0')){
    
                current.removeSkill('fenghuo0');
            }
        });           
player.addSkill('shoulei0');
       },
            },
            "fenghuo1":{
                mark:true,
                marktext:"援",
                intro:{
                    name:"烽火",
                    content:"其他角色于其出牌阶段可以弃置两张手牌，然后其与你各回复一点体力（每回合限一次）",
                },
                ai:{
                    threaten:4.5,
                },
            },
            "shoulei0":{
                audio:"ext:瀚海辰星:2",
                trigger:{
                    global:"useCardToTargeted",
                },
                filter:function (event,player){
        return (get.name(event.card)=='sha');
    },
                check:function (event,player){
        return get.attitude(player,event.target)>=0;
    },
                content:function (){
       
        if(player.countCards('he')<=1){
            player.loseHp();
        trigger.target.draw(2);
            event.finish();
        }
        else{
                      player.chooseControl(function(){
                return 1;
            }).set('choiceList',[
            '失去一点体力并令'+(get.translation(trigger.target))+'摸两张牌',
                '弃置两张牌并令'+(get.translation(trigger.target))+'摸两张牌'
            ]
        );
                       if(result.control=='选项一'){
              player.loseHp();
                  trigger.target.draw(2);
        }
           else{ 
  player.chooseToDiscard('弃置两张牌，令'+(get.translation(trigger.target))+'摸两张牌','he',true,2);
            trigger.target.draw(2);
        }
      
            
        }
     
   
      
      
      
    
    },
                ai:{
                    threaten:0.9,
                },
            },
            "fenghuo0":{
                audio:"ext:瀚海辰星:2",
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

        if(!target.hasSkill('susu')) return false;
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
                },
            },
            susu:{
            },
        },
        translate:{
            "666":" ",
            "888":" ",
            canjun:"残军",
            "canjun_info":"锁定技，你做主公时，不增加体力上限和体力值",
            "liejun2":"烈军·死守",
            "liejun2_info":"觉醒技，当你进入濒死状态时，你减１点体力上限并将体力回复至体力上限数，然后你摸两张牌，进入死守状态并获得“烈军·突围”",
            "liejun3":"烈军·突围",
            "liejun3_info":"觉醒技，当你进入濒死状态时，你减１点体力上限并将体力回复至体力上限数，然后你摸两张牌，进入突围状态并获得“烈军·血战”",
            "liejun4":"烈军·血战",
            "liejun4_info":"觉醒技，当你进入濒死状态时，你减１点体力上限并将体力回复至体力上限数，然后你摸两张牌，并在脱离濒死状态后进入血战状态",
            tuweizhuangtai:"突围状态",
            "tuweizhuangtai_info":"锁定技，准备阶段，你弃置0至X名角色区域内的各一张牌；出牌阶段，你拥有“整军”（你可以弃置一张装备牌并摸一张牌）；结束阶段，你摸X张牌；你的装备区处于废除状态。（X为当时场上装备区内武器牌总数且至少为1）",
            xuezhanzhuangtai:"血战状态",
            "xuezhanzhuangtai_info":"锁定技，你的手牌上限+2；当你进入或脱离濒死状态时，你摸一张牌。你的【闪】视为【酒】、【桃】视为【杀】；你使用牌无距离和次数限制；你的【杀】无视防具。你的装备区和判定区处于废除状态",
            "xinjuejing_ys":"血战",
            "xinjuejing_ys_info":"",
            "longxiao3":"龙啸",
            "longxiao3_info":"",
            "pz4":"无畏冲锋",
            "pz4_info":"锁定技，出牌阶段，你使用【杀】没有数量限制。",
            "tuwei1":"突围",
            "tuwei1_info":"",
            "tuwei2":"突围",
            "tuwei2_info":"",
            huairou:"整军",
            "huairou_info":"",
            "longxiao1":"龙啸·杀",
            "longxiao1_info":"",
            "longxiao2":"龙啸·酒",
            "longxiao2_info":"",
            "s1":"死守",
            "s1_info":"",
            "s2":"死守",
            "s2_info":"",
            "s3":"死守",
            "s3_info":"",
            "s4":"死守",
            "s4_info":"",
            sishouzhuangtai:"死守状态",
            "sishouzhuangtai_info":"锁定技，你的基本牌均视为【无懈可击】",
            xiaoyong:"骁勇",
            "xiaoyong_info":"锁定技，出牌阶段开始时，你与一名其他角色拼点。若你赢，你废除一个装备栏；若你没赢，你恢复一个装备栏。本次拼点结束时，你与其交换拼点牌",
            "pz1":"破坏防御",
            "pz1_info":"",
            "pz2":"沉默打击",
            "pz2_info":"",
            "pz3":"致残之握",
            "pz3_info":"",
            "pz5":"夺命暴斩",
            "pz5_info":"",
            "pozhen1":"1阶",
            "pozhen1_info":"锁定技，你使用牌指定一名其他角色为目标后，其弃置装备区中的防具和+1马",
            "pozhen2":"2阶",
            "pozhen2_info":"锁定技，你使用牌指定一名其他角色为目标后，其弃置装备区中的防具和+1马，然后你令其非锁定技失效直到回合结束",
            "pozhen3":"3阶",
            "pozhen3_info":"锁定技，你使用牌指定一名其他角色为目标后，其弃置装备区中的防具+1马，然后你令其非锁定技失效且不能使用和打出手牌直到回合结束",
            "pozhen4":"4阶",
            "pozhen4_info":"锁定技，你使用牌无距离和次数限制；你使用牌指定一名其他角色为目标后，其弃置装备区中的防具+1马，然后你令其非锁定技失效且不能使用和打出手牌直到回合结束",
            "pozhen5":"5阶",
            "pozhen5_info":"锁定技，你使用牌无距离和次数限制；你使用的牌伤害+1；你使用牌指定一名其他角色为目标后，其弃置装备区中的防具+1马，然后你令其非锁定技失效且不能使用和打出手牌直到回合结束",
            canfei:"残废",
            "canfei_info":"",
            mingren:"明任",
            "mingren_info":"游戏开始时，你摸一张牌，然后将你的一张手牌置于你的武将牌上，称为“任”。出牌阶段结束时，你可以用手牌替换“任”",
            zhenliang:"贞良",
            "zhenliang_info":"转换技，①出牌阶段限一次，你可以选择一名攻击范围内的其他角色，然后弃置X张与“任”颜色相同的牌并对其造成一点伤害（X为你与其的体力差且至少为1）。②你的回合外，当你使用或打出与“任”类型相同的牌时，你可以令任意名角色摸一张牌",
            jinji:"进击",
            "jinji_info":"锁定技，若你已废除的装备栏数量为1，你进入“1阶破阵状态”；为2，你进入“2阶破阵状态”；为3，你进入“3阶破阵状态”；为4，你进入“4阶破阵状态”；为5，你进入“5阶破阵状态”",
            tuishou:"退守",
            "tuishou_info":"锁定技，若你已废除的装备栏数量为1，你进入“1阶破阵状态”；为2，你进入“2阶破阵状态”；为3，你进入“3阶破阵状态”；为4，你进入“4阶破阵状态”；为5，你进入“5阶破阵状态”",
            "pozhen_":"破阵",
            "pozhen__info":"锁定技，若你已废除的装备栏数量为1，你进入“1阶破阵状态”；为2，你进入“2阶破阵状态”；为3，你进入“3阶破阵状态”；为4，你进入“4阶破阵状态”；为5，你进入“5阶破阵状态”",
            "yizhong8":"毅重",
            "yizhong8_info":"",
            "jieyue8":"节钺",
            "jieyue8_info":"结束阶段，你可以弃置一张手牌并选择一名其他角色，除非其将一张牌置于你的武将牌上，否则你弃置其一张牌。若你的武将牌上有“节钺”牌，你可以将黑色手牌当【无懈可击】、红色手牌当【闪】使用或打出；若你的武将牌上没有“节钺”牌，你视为拥有“毅重”（锁定技，若你没有装备防具，黑色的【杀】对你无效）。准备阶段，你获得“节钺”牌",
            "yanzheng8":"严整",
            "yanzheng8_info":"若你的手牌数大于你的体力值，则你可以将你装备区内的牌当作【无懈可击】使用。",
            "yanzheng9":"严整",
            "yanzheng9_info":"若你的手牌数大于你的体力值，则你可以将你装备区内的牌当作【无懈可击】使用。",
            "yanzheng_ys":"严整",
            "yanzheng_ys_info":"若你的手牌数大于体力值，你可以将装备区中的牌当【闪】、【无懈可击】使用",
            pojia:"破甲",
            "pojia_info":"",
            "cuorui_ys":"挫锐",
            "cuorui_ys_info":"锁定技，游戏开始时，你可以失去任意点体力并摸两倍的牌；你的判定区始终处于废除状态",
            "liewei_ys":"裂围",
            "liewei_ys_info":"当一名其他角色因你造成的伤害而进入濒死状态时，你可以摸两张牌，若此时为你的回合，你使用牌无次数限制直到回合结束。",
            nu:"裂",
            "nu_info":"",
            "jizhan_ys":"疾战",
            "jizhan_ys_info":"出牌阶段限一次，你可以废除一种装备栏，根据所废除的装备栏种类你获得以下效果直到回合结束：武器栏，你使用【杀】指定一个目标后，其弃置两张牌；防具栏，你可以将一张基本牌当任意基本牌使用；坐骑栏，你摸两张牌，你使用牌无距离限制；宝物栏，你获得“奋音”",
            "xinzhanyi_basic0":"战意",
            "xinzhanyi_basic0_info":"",
            "xinzhanyi_trick0":" ",
            "xinzhanyi_trick0_info":"",
            "xinzhanyi_equip0":" ",
            "xinzhanyi_equip0_info":"",
            "xinzhanyi_ys":"战意",
            "xinzhanyi_ys_info":"出牌阶段限一次，你可以弃置一张牌并失去1点体力，然后根据你弃置的牌获得以下效果直到出牌阶段结束：基本牌，你可以将一张基本牌当任意基本牌使用或打出，且你本回合第一次以此法使用的牌的回复值/伤害值+1；锦囊牌，摸三张牌且你使用的锦囊牌不能被【无懈可击】响应；装备牌，你使用【杀】指定一个目标后，其弃置两张牌，然后你获得其中的一张。",
            "xinzhanyi_basic8":" 疾战",
            "xinzhanyi_basic8_info":"",
            "xinzhanyi_trick8":" ",
            "xinzhanyi_trick8_info":"",
            "xinzhanyi_equip8":" ",
            "xinzhanyi_equip8_info":"",
            "fenyin0":" ",
            "fenyin0_info":"",
            jiegong:"竭攻",
            "jiegong_info":"觉醒技，准备阶段开始时，若你的装备栏均已被废除，则你减一点体力上限，将手牌摸至体力上限并废除判定区，然后失去技能“疾战”，获得技能“战意”",
            "xinzhanyi_basic3":" ",
            "xinzhanyi_basic3_info":"",
            "xinzhanyi_basic4":" ",
            "xinzhanyi_basic4_info":"",
            "xinzhanyi_basic5":" ",
            "xinzhanyi_basic5_info":"",
            "xinzhanyi_basic6":" ",
            "xinzhanyi_basic6_info":"",
            "pojun_ys":"破军",
            "pojun_ys_info":"当你使用【杀】对目标角色造成伤害后，你可以选择一项：1.令其翻面并摸X张牌（X为其体力值且至多为5）；2.令其获得一个“溃”标记（当其成为【杀】的目标后，移去一个“溃”并弃置两张牌）",
            "danshou_ys":"胆守",
            "danshou_ys_info":"当你造成或受到伤害后，你可以摸一张牌。若如此做，终止一切结算，当前回合结束。",
            "yizhong9":" ",
            "yizhong9_info":"",
            "zhanyi0":"战意",
            "zhanyi0_info":"出牌阶段限一次，你可以弃置一张牌并失去1点体力，然后根据你弃置的牌获得以下效果直到回合结束：基本牌，你可以将一张基本牌当作任意基本牌使用或打出；锦囊牌，你摸两张牌，你使用牌无距离限制；装备牌，你使用【杀】指定一名其他角色为目标后，其弃置两张牌。",
            "zhanyi_basic0":"疾战",
            "zhanyi_basic0_info":"",
            "zhanyi_trick0":"战锦",
            "zhanyi_trick0_info":"",
            "zhanyi_equip0":"战装",
            "zhanyi_equip0_info":"",
            feijian:"飞箭",
            "feijian_info":"",
            "ganglie_ys":"刚烈",
            "ganglie_ys_info":"每当你受到1点伤害后，可进行一次判定，若结果为红色，你对伤害来源造成1点伤害，若结果为黑色，你摸一张牌并弃置其一张牌。",
            "hengjiang_ys":"横江",
            "hengjiang_ys_info":"当你受到伤害后，你可以令当前回合角色本回合的手牌上限-X（X为你已损失体力值）然后若其弃牌阶段内没有弃牌，则你摸一张牌。",
            liren:"利刃",
            "liren_info":"锁定技，当你对其他角色造成伤害后，你摸一张牌。",
            heian:"暗影释放",
            "heian_info":"",
            guangming:"光明觉醒",
            "guangming_info":"",
            "xueren0":"血刃",
            "xueren0_info":"准备阶段，你可以失去一点体力并摸一张牌，然后获得以下效果直到回合结束：你使用牌无次数限制，你视为拥有“猛进”",
            wushijuli:"无距离限制",
            "wushijuli_info":"",
            wushicishu:"无次数限制",
            "wushicishu_info":"",
            "xiaoyong1":"  ",
            "xiaoyong1_info":"",
            "xiaoyong2":"  ",
            "xiaoyong2_info":"",
            "xiaoyong0":"骁勇",
            "xiaoyong0_info":"锁定技，当你造成或受到伤害后，你废除一个装备栏；每名角色的回合结束时，你恢复两个装备栏",
            "cuorui6":"挫锐",
            "cuorui6_info":"失去任意点体力并摸两倍的牌",
            huiren:"辉刃",
            "huiren_info":"准备阶段，你可以弃置手牌，获得以下效果直到回合结束：你使用牌无距离限制，你使用【杀】无视防具且可以多指定一个目标",
            duomubiao:"辉刃",
            "duomubiao_info":"",
            yingbao:"影爆",
            "yingbao_info":"限定技，出牌阶段，你可以弃置一张装备牌并选择一名其他角色，本回合其非锁定技失效且你对其使用牌无距离限制；本回合结束时，其弃置X张牌（X为本回合此法发动后你对其使用牌的次数）",
            "yingbao1":"影爆",
            "yingbao1_info":"",
            "yingbao2":"影爆",
            "yingbao2_info":"",
            "yingbao3":"影爆",
            "yingbao3_info":"",
            yaozhan:"耀斩",
            "yaozhan_info":"限定技，出牌阶段开始时，你可以弃置所有牌，然后视为使用三张【杀】；本回合结束时，你摸X张牌（X为此法造成的伤害值）",
            "yaozhan1":"耀斩",
            "yaozhan1_info":"",
            "yaozhan2":"耀斩",
            "yaozhan2_info":"",
            "yaozhan3":"耀斩",
            "yaozhan3_info":"",
            "yaozhan4":" ",
            "yaozhan4_info":"",
            "yaozhan5":"耀斩",
            "yaozhan5_info":"",
            "yaozhan6":" ",
            "yaozhan6_info":"",
            "yaozhan8":" ",
            "yaozhan8_info":"",
            "yaozhan7":"耀斩",
            "yaozhan7_info":"",
            shifang:"释放",
            "shifang_info":"回合开始时，若你因“利刃”摸牌的数量不小于3，你可以将武将牌替换为“统御李信”或“狂暴李信”<br>（点击“取消”放弃本次觉醒）",
            "xueren6":"血刃",
            "xueren6_info":"转换技，锁定技，①出牌阶段开始时，你失去1点体力并摸两张牌，然后本回合内你使用牌无距离和次数限制。②出牌阶段开始时，你减1点体力上限并令本回合手牌上限+2，然后本回合所有其他角色非锁定技失效且不能使用和打出手牌。",
            "longnu_1":"血刃",
            "longnu_1_info":"",
            "longnu_2":"血刃",
            "longnu_2_info":"",
            wuwei:"陨辰",
            "wuwei_info":"锁定技，当你受到伤害时，你防止此伤害并获得与伤害值等量的“星削”；结束阶段，你移去一个“星削”并失去一点体力",
            "yingshi0":"星蚀",
            "yingshi0_info":"",
            xiuluo:"极刃",
            "xiuluo_info":"当你使用仅指定唯一目标的牌对目标角色造成伤害时，你可以将其一张牌置于你的武将牌上，称为“铠”(若“魔躯”已发动，则改为弃置其一张牌)",
            "xiuluo0":" ",
            "xiuluo0_info":"",
            xiuluoshixiao:" ",
            "xiuluoshixiao_info":"",
            moqv:"魔躯",
            "moqv_info":"限定技，结束阶段，你可以废除判定区，若如此做，你的下个回合开始时，你获得“魔铠”并随机使用一张武器牌和一张防具牌",
            "moqv_chufa":"魔铠降临",
            "moqv_chufa_info":"",
            mokai:"魔铠",
            "mokai_info":"锁定技，你于出牌阶段可以多使用一张【杀】；你使用黑色【杀】无视防具、红色【杀】伤害+1；当你受到伤害时，令此伤害减至1并摸一张牌。准备阶段，若你有“铠”，你获得一张“铠”并令所有其他角色弃置一张牌；若你没有“铠”，你弃置所有牌并失去“魔铠”",
            "mokai_shenfen":"回旋之刃",
            "mokai_shenfen_info":"",
            "mokai_erdao":"魔刃",
            "mokai_erdao_info":"",
            "mokai_heisha":"破甲魔刃",
            "mokai_heisha_info":"",
            "mokai_hongsha":"淬血魔刃",
            "mokai_hongsha_info":"",
            "mokai_jianshang":"不灭魔躯",
            "mokai_jianshang_info":"",
            "666_info":"",
            "xiuluo_xiugai":"极刃",
            "xiuluo_xiugai_info":"",
            "888_info":"",
            "mokai_shixiao":"魔铠失效",
            "mokai_shixiao_info":"",
            sd:" ",
            "sd_info":"",
            reqizhou:"绮胄",
            "reqizhou_info":"锁定技，你根据装备区里牌的花色数获得以下技能：1种或以上：〖英姿〗(旧版)；2种或以上：〖奇袭〗；3种或以上：〖旋风〗。",
            yingqu:"影躯",
            "yingqu_info":"锁定技，你的手牌上限等于体力上限",
            "reshanxi2":"闪袭",
            "reshanxi2_info":"",
            rshanxi:"闪袭",
            "rshanxi_info":"出牌阶段开始时，你可以弃置一张红色基本牌并将一名其他角色的至多X张牌扣置于其武将牌旁（X为你的体力值），然后其于当前回合结束时获得这些牌。",
            "cuorui1":"疾行",
            "cuorui1_info":"判定阶段开始时，你可以弃置“疾行”，然后弃置判定区内的所有牌",
            "cuorui2":"勇进",
            "cuorui2_info":"摸牌阶段开始时，你可以弃置“勇进”，然后本阶段你多摸两张牌",
            "cuorui3":"破阵",
            "cuorui3_info":"出牌阶段开始时，你可以弃置“破阵”，然后本阶段你可以多使用两张【杀】",
            "cuorui4":"镇围",
            "cuorui4_info":"弃牌阶段开始时，你可以弃置“镇围”，然后本阶段你的手牌上限+2",
            "cuorui0":"挫锐",
            "cuorui0_info":"游戏开始时，你获得四种标记各一个（疾行、勇进、破阵、镇围，每种标记至多一个）",
            "yingzi_ys":" ",
            "yingzi_ys_info":"",
            "paoxiao_ys":" ",
            "paoxiao_ys_info":"",
            jiashangxian:" ",
            "jiashangxian_info":"",
            "moqv_mopai":" ",
            "moqv_mopai_info":"",
            liekai:"裂围",
            "liekai_info":"锁定技，当你杀死一名角色后，你选择一项：1.摸三张牌；2.获得四种标记各一个（疾行、勇进、破阵、镇围）",
            laobie:" ",
            "laobie_info":"",
            "kuijun0":"溃军",
            "kuijun0_info":"",
            "kuijun1":"恢复",
            "kuijun1_info":"",
            rekuangcai:"狂才",
            "rekuangcai_info":"出牌阶段开始时，你可以摸两张牌并弃置至少一张牌，然后你获得以下效果直到出牌阶段结束：你使用牌无距离和次数限制；你使用牌时，摸一张牌；你于本阶段至多可以使用X张牌（X为你以此法弃置的牌数）",
            "rekuangcai2":" ",
            "rekuangcai2_info":"",
            kuang:"狂才",
            "kuang_info":"",
            zhi:" ",
            "zhi_info":"",
            "gangyi0":"刚毅",
            "gangyi0_info":"锁定技，当你受到伤害时，你摸一张牌并令此伤害减至1",
            "gangyi1":"刚毅",
            "gangyi1_info":"",
            "gangyi2":"刚毅",
            "gangyi2_info":"",
            "tiebi0":"铁壁",
            "tiebi0_info":"觉醒技，当你进入濒死状态时，你弃置所有牌并翻面，然后将体力回复至3点并失去“刚毅”，直到你的下个回合开始，你不能使用或打出手牌且视为拥有“烽火”，你的下个回合开始时，你获得“守垒”",
            "tiebi1":"铁壁",
            "tiebi1_info":"",
            "fenghuo1":"烽火",
            "fenghuo1_info":"其他角色的出牌阶段限一次，其可以弃置两张手牌并与你各回复一点体力",
            "shoulei0":"守垒",
            "shoulei0_info":"当一名角色成为【杀】的目标后，你可以弃置两张牌或失去一点体力，然后令其摸两张牌",
            "fenghuo0":"烽火",
            "fenghuo0_info":"出牌阶段限一次，你可以弃置两张手牌，然后你与苏烈各回复一点体力。",
            susu:"小苏苏",
            "susu_info":"",
        },
    },
    intro:"",
    author:"东方曜",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["sulie0.jpg"],"card":[],"skill":[]}}};