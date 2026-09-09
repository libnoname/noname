import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"UT",content:function (){
if(lib.config.mode=="brawl"){
if(!lib.storage.scene) lib.storage.scene={};
if(!lib.storage.scene["   "]){
lib.storage.scene["   "]={
    name:"   ",
    intro:"",
    players:[{"name":"random","name2":"none","identity":"fan","position":0,"hp":15,"maxHp":15,"linked":false,"turnedover":false,"playercontrol":false,"handcards":[],"equips":[],"judges":[]},{"name":"random","name2":"none","identity":"fan","position":0,"hp":15,"maxHp":15,"linked":false,"turnedover":false,"playercontrol":false,"handcards":[],"equips":[],"judges":[]},{"name":"random","name2":"none","identity":"fan","position":0,"hp":15,"maxHp":15,"linked":false,"turnedover":false,"playercontrol":false,"handcards":[],"equips":[],"judges":[]},{"name":"random","name2":"none","identity":"fan","position":0,"hp":15,"maxHp":15,"linked":false,"turnedover":false,"playercontrol":false,"handcards":[],"equips":[],"judges":[]},{"name":"random","name2":"none","identity":"zhu","position":1,"hp":75,"maxHp":75,"linked":false,"turnedover":false,"playercontrol":true,"handcards":[["random","random","random"],["random","random","random"],["random","random","random"],["random","random","random"],["random","random","random"],["random","random","random"],["random","random","random"]],"equips":[],"judges":[]},{"name":"random","name2":"none","identity":"fan","position":4,"hp":15,"maxHp":15,"linked":false,"turnedover":false,"playercontrol":false,"handcards":[],"equips":[],"judges":[]},{"name":"random","name2":"none","identity":"zhong","position":8,"hp":30,"maxHp":30,"linked":false,"turnedover":false,"playercontrol":false,"handcards":[],"equips":[],"judges":[]},{"name":"random","name2":"none","identity":"zhong","position":2,"hp":30,"maxHp":30,"linked":false,"turnedover":false,"playercontrol":false,"handcards":[],"equips":[],"judges":[]}],
    cardPileTop:[],
    cardPileBottom:[],
    discardPile:[],
    gameDraw:true,
};
_status.extensionscene=true;}
if(!_status.extensionmade) _status.extensionmade=[];
_status.extensionmade.push("   ");
}},package:{
    character:{
        character:{
            sans:["none","wei",1,["miss","与生俱来的罪业","Bad time"],[]],
            "gaster ":["none","wei",66,["破碎","虚无","遗忘"],["boss","bossallowed"]],
            frisk:["male","qun",92,["物品","Determination"],[]],
        },
        translate:{
            sans:"sans",
            "gaster ":"gaster ",
            frisk:"frisk",
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
            "虚无":{
                trigger:{
                    player:["damageBefore"],
                },
                forced:true,
                content:function (){
        trigger.cancel();
        player.recover(6666666);
    },
                ai:{
                    noDirectDamage:true,
                },
            },
            miss:{
                group:["miss1"],
                marktext:"miss",
                intro:{
                    name:"miss",
                    "name2":"miss",
                    content:"闪避次数",
                },
                trigger:{
                    global:"gameDrawBefore",
                },
                forced:true,
                frequent:true,
                content:function (){
        player.addMark('miss',19);
        
           
    },
            },
            "miss1":{
                trigger:{
                    player:["damageBegin1"],
                },
                forced:true,
                filter:function (event,player){
    return event.player.hasMark('miss')&&(event.name=='damage'||!event.numFixed);
    },
                content:function (){       
  player.line(trigger.player,'green');
    if(trigger.name=='damage'){
    trigger.cancel();
    trigger.player.removeMark('miss',1)    
    if(player.countMark('miss')<=12){player.addSkill('gaster baster')}
    

 }
    else trigger.num++;
    },
            },
            "与生俱来的罪业":{
                trigger:{
                    source:"damageBefore",
                },
                forced:true,
                check:function (){return false;},
                content:function (){
        trigger.cancel();
        trigger.player.loseHp(1);
        trigger.player.loseHp(1);  
        trigger.player.loseHp(1);
        trigger.player.loseHp(1);
        trigger.player.loseHp(1);
        trigger.player.loseHp(1);
        trigger.player.loseHp(1);
        trigger.player.loseHp(1);
        trigger.player.loseHp(1);
        trigger.player.loseHp(1);
        trigger.player.loseHp(1);
        trigger.player.loseHp(1);
        trigger.player.loseHp(1);
        trigger.player.loseHp(1);
        trigger.player.loseHp(1);
        
        
        
        
        
        
        
        
        
        
    },
                ai:{
                    jueqing:true,
                },
            },
            "遗忘":{
                trigger:{
                    player:"phaseDrawBegin",
                    global:"phaseDrawBegin",
                },
                forced:true,
                content:function (){
        player.loseHp(4)
    },
            },
            "破碎":{
                trigger:{
                    source:"damageBegin",
                },
                forced:true,
                content:function (){
        trigger.player.turnOver();
        trigger.player.goMad({player:'phaseBefore'});
        trigger.source.loseMaxHp(1)
        trigger.source.recover(666)
      
    },
            },
            "gaster baster":{
                audio:"ext:UT:1",
                usable:1,
                nobracket:true,
                enable:"phaseUse",
                filterTarget:function (card,player,target){
 return player!=target;
 },
                content:function (){
        'step 0'
 target.damage(1);
    },
                ai:{
                    order:2,
                    result:{
                        target:-5,
                    },
                },
            },
            "物品":{
                marktext:"物品",
                intro:{
                    name:"物品",
                    "name2":"物品",
                    content:"食物数量",
                },
                trigger:{
                    global:"gameStart",
                },
                forced:true,
                frequent:true,
                content:function (){
        player.addMark('物品',8);
        player.addSkill('派')
           
    },
            },
            "派":{
                enable:"phaseUse",
                usable:1,
                content:function (){      
     player.recover(9999)   
    player.removeMark('物品',1)  
     if(player.countMark('物品')==7){player.addSkill('方便面')}
    player.removeSkill("派")   
       
    },
                ai:{
                    order:2,
                    result:{
                        player:function (player){
            if(player.hp<20) return 5;
            },
                    },
                },
            },
            "方便面":{
                enable:"phaseUse",
                usable:1,
                content:function (){ 
     player.recover(90)
    player.removeMark('物品',1) 
    if(player.countMark('物品')==6){player.addSkill('牛排')}
    player.removeSkill("方便面")    
    
    },
                ai:{
                    order:2,
                    result:{
                        player:function (player){
            if(player.hp<20) return 5;
            },
                    },
                },
            },
            "牛排":{
                enable:"phaseUse",
                usable:1,
                content:function (){ 
     player.recover(60)
    player.removeMark('物品',1) 
    if(player.countMark('物品')==5){player.addSkill('雪块')}
    player.removeSkill("牛排")    
    },
                ai:{
                    order:2,
                    result:{
                        player:function (player){
            if(player.hp<40) return 5;
            },
                    },
                },
            },
            "雪块":{
                enable:"phaseUse",
                usable:1,
                content:function (){ 
     player.recover(45)
    player.removeMark('物品',1) 
    if(player.countMark('物品')==4){player.addSkill('雪块2')}
    player.removeSkill("雪块")    
    },
                ai:{
                    order:2,
                    result:{
                        player:function (player){
            if(player.hp<45) return 5;
            },
                    },
                },
            },
            "雪块2":{
                enable:"phaseUse",
                usable:1,
                content:function (){ 
     player.recover(45)
    player.removeMark('物品',1) 
    if(player.countMark('物品')==3){player.addSkill('英雄传说')}
    player.removeSkill("雪块2")    
    },
                ai:{
                    order:2,
                    result:{
                        player:function (player){
            if(player.hp<45) return 5;
            },
                    },
                },
            },
            "英雄传说":{
                enable:"phaseUse",
                usable:1,
                content:function (){ 
     player.recover(40)
    player.removeMark('物品',1) 
    if(player.countMark('物品')==2){player.addSkill('英雄传说2')}
    player.removeSkill("英雄传说")    
    },
                ai:{
                    order:2,
                    result:{
                        player:function (player){
            if(player.hp<52) return 5;
            },
                    },
                },
            },
            "英雄传说2":{
                enable:"phaseUse",
                usable:1,
                content:function (){ 
     player.recover(40)
    player.removeMark('物品',1) 
    if(player.countMark('物品')==1){player.addSkill('英雄传说3')}
    player.removeSkill("英雄传说2")    
    },
                ai:{
                    order:2,
                    result:{
                        player:function (player){
            if(player.hp<52) return 5;
            },
                    },
                },
            },
            "英雄传说3":{
                enable:"phaseUse",
                usable:1,
                content:function (){ 
     player.recover(40)
    player.removeMark('物品',1) 
    player.removeSkill("英雄传说3")    
    },
                ai:{
                    order:2,
                    result:{
                        player:function (player){
            if(player.hp<52) return 5;
            },
                    },
                },
            },
            Determination:{
                trigger:{
                    player:"dyingBegin",
                },
                forced:true,
                frequent:true,
                content:function (){
        player.recover(Infinity)
        player.removeMark('物品',Infinity)
        player.addMark('物品',8)
        player.removeSkill('Determination')
    },
            },
            "Bad time":{
                audio:"ext:UT:1",
                trigger:{
                    global:"gameStart",
                },
                forced:true,
                filter:function (){
 return game.players.length>1;
 },
                content:function (){ 'step 0'
 player.chooseTarget('Do you wanna have a bad time?',function(card,player,target){ return target!=player; })
.set('ai',function(target){
 var att=get.attitude (player,target);                                        
 return -att;
})
'step 1'
if(result.bool){
  var target=result.targets[0];
target.damage(); 
target.damage(); 
target.damage();
target.damage();
}
     },
            },
        },
        translate:{
            "虚无":"虚无",
            "虚无_info":"*你无法对祂造成伤害 试试其他的办法",
            miss:"miss",
            "miss_info":"",
            "miss1":"miss",
            "miss1_info":"",
            "与生俱来的罪业":"KR",
            "与生俱来的罪业_info":"*罪业在你的血脉之中奔涌",
            "遗忘":"遗忘",
            "遗忘_info":"*祂只是一个被所有人遗忘的科学家而已 没什么好怕的",
            "破碎":"破碎",
            "破碎_info":"为什么？ 为什么祂又回来了？",
            "gaster baster":"gaster baster",
            "gaster baster_info":"",
            "物品":"物品",
            "物品_info":"",
            "派":"派",
            "派_info":"",
            "方便面":"方便面",
            "方便面_info":"",
            "牛排":"牛排",
            "牛排_info":"",
            "雪块":"雪块",
            "雪块_info":"",
            "雪块2":"雪块",
            "雪块2_info":"",
            "英雄传说":"英雄传说",
            "英雄传说_info":"",
            "英雄传说2":"英雄传说",
            "英雄传说2_info":"",
            "英雄传说3":"英雄传说",
            "英雄传说3_info":"",
            Determination:"决心",
            "Determination_info":"",
            "Bad time":"开场杀",
            "Bad time_info":"",
        },
    },
    intro:"",
    author:"",
    diskURL:"",
    forumURL:"",
    version:"",
},files:{"character":["frisk.jpg"],"card":[],"skill":[]}}};