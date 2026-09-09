import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"时间管理大师",content:function(config,pack){
    
},precontent:function(){
    
},help:{},config:{},package:{
    character:{
        character:{
            guanlidashi:["male","wei",4,["shijianGL"],["des:时间管理大师"]],
        },
        translate:{
            guanlidashi:"管理大师",
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
            shijianGL:{
                enable:"phaseUse",
                usable:1,
                content:function (){
              "step 0"
        function getSfm(){
var time = new Date();
var h = time.getHours();

var m= time.getMinutes();
m=m<10?'0'+m:m;
var s= time.getSeconds();
s=s<10?'0'+s:s;
return h+'时'+m+'分'+s+'秒';
}
var sfm= new Date();
xs=sfm.getHours();
fz= sfm.getMinutes();
ms= sfm.getSeconds();

var num1=Math.ceil(xs/4);
var num2=Math.ceil(fz/10);
num3=Math.ceil(ms/20);
game.log('当前时间分秒数为'+getSfm());
game.log('你将恢复'+num1+'点体力'+'和摸'+num2+'张牌'+'造成'+num3+'点伤害');
player.recover(num1);
player.draw(num2);
 player.chooseTarget('请选择你要造成伤害的目标',1,function(card,player,target){ 
        return target!=player; 
     },true).set('ai',function(target){ 
        return -ai.get.attitude(_status.event.player,target); 
     }); 
   
        "step 1"
       
 player.line(result.targets[0]); 
    result.targets[0].damage(player,num3); 
    
    
},
                ai:{
                    order:9,
                    result:{
                        player:1,
                    },
                    threaten:1.55,
                },
            },
        },
        translate:{
            shijianGL:"时间管理",
            "shijianGL_info":"出牌阶段限一次，你可以查询一次当前时间，根据时分秒获得以下效果：1.你恢复当前小时的四分之一点体力(向上取整)。2.你摸当前分钟的十分之一张牌(向上取整)。3.你选择一名其他角色，对其造成当前秒数的二十分之一点伤害(向上取整)。",
        },
    },
    intro:"时间管理大师罗志祥:技能:      时间管理：出牌阶段限一次，你可以查询一次当前时间，根据时分秒获得以下效果：1.你恢复当前小时的四分之一点体力(向上取整)。2.你摸当前分钟的十分之一张牌(向上取整)。3.你选择一名其他角色，对其造成当前秒数的二十分之一点伤害(向上取整)。",
    author:"藏海",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["guanlidashi.jpg"],"card":[],"skill":[]}}};