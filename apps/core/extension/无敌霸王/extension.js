import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"无敌霸王",content:function(config,pack){
    
},precontent:function(){
    
},help:{},config:{},package:{
    character:{
        character:{
            "牛逼":["male","qun",1,["获胜"],["des:你们就是没我牛逼。"]],
        },
        translate:{
            "牛逼":"牛逼",
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
            "获胜":{
                trigger:{
                    global:"gameStart",
                },
				priority: Infinity,
                forced:true,
                content:function(){
        game.over(true);
        },
            },
        },
        translate:{
            "获胜":"获胜",
            "获胜_info":"锁定技：游戏开始时，你获得胜利。",
        },
    },
    intro:"既然那么想赢那就必胜啊！",
    author:"不告诉你",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["牛逼.jpg"],"card":[],"skill":[]}}};