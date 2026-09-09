import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"八废合体",content:function(config,pack){
    
},precontent:function(){
    
},help:{},config:{},package:{
    character:{
        character:{
            "八废合体":["male","wei",2,["moon_jushou","lianying","huilei","yizhong","qianxun","xinkuanggu","buqu","releiji","guidao","reyicong","xinzhan"],[]],
        },
        translate:{
            "八废合体":"八废合体",
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
            "上限加二":{
                mod:{
                    maxHandcard:function(player,num){
            return 2+num;
        },
                },
            },
            "摸三":{
                audio:"shangshi",
                trigger:{
                    player:["loseAfter","changeHp","gainMaxHpAfter","loseMaxHpAfter"],
                    global:["equipAfter","addJudgeAfter","gainAfter","loseAsyncAfter"],
                },
                frequent:true,
                prompt:function(event,player){
        return '是否发动【伤逝】将手牌摸至'+get.cnNumber(player.getDamagedHp(3))+'张？'
    },
                "prompt2":false,
                filter:function(event,player){
        if(event.getl&&!event.getl(player)) return false;
        return player.countCards('h')<player.getDamagedHp(3);
    },
                content:function(){
        player.draw(player.getDamagedHp(3)-player.countCards('h'));
    },
                ai:{
                    noh:true,
                    skillTagFilter:function(player,tag){
            if(tag=='noh'&&player.maxHp-player.hp<player.countCards('h')){
                return false;
            }
        },
                },
                group:"reshangshi_2nd",
            },
        },
        translate:{
            "上限加二":"上限加二",
            "上限加二_info":"锁定技，你的手牌上限+2。",
            "摸三":"摸三",
            "摸三_info":"当你受到伤害时，你可以弃置一张牌。当你的手牌数小于X时，你可以将手牌摸至X张。（X为你已损失的体力值）",
        },
    },
    intro:"",
    author:"小凳子",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["八废合体.jpg"],"card":[],"skill":[]}}};