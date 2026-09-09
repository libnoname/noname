import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"张三丰",content:function (config,pack){
    
},precontent:function (){
    
},help:{},config:{},package:{
    character:{
        character:{
            woyebuzhidaoweishenmezhangshanfen:["male","wu",3,["w_huansha1","w_huanshan1","w_taiji11111"],["des:用来打太极的张三丰"]],
            yijiushidataijidezhangsanfen:["male","shen",4,["w_huansha1","w_huanshan1","w_taiji11111","w_faen111"],["des:依旧是打太极的张三丰"]],
        },
        translate:{
            woyebuzhidaoweishenmezhangshanfen:"太极张三丰",
            yijiushidataijidezhangsanfen:"神张三丰",
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
            "w_huansha1":{
                srlose:true,
                enable:["chooseToUse","chooseToRespond"],
                filterCard:function (){return false;},
                selectCard:-1,
                viewAs:{
                    name:"sha",
                    nature:"fire",
                },
                viewAsFilter:function (player){
        return !player.isLinked();
    },
                prompt:"横置你的武将牌，视为打出一张火杀",
                check:function (){return},
                onuse:function (result,player){
        player.link();
    },
                onrespond:function (result,player){
        if(!player.isLinked()) player.link()
    },
                ai:{
                    skillTagFilter:function (player){
            return !player.isLinked();
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
            "w_huanshan1":{
				enable:['chooseToUse','chooseToRespond'],
				prompt:function(){
					return '重置你的武将牌，视为打出一张闪';
				},
                filterCard:function (){return false;},
                selectCard:-1,
                viewAs:{
                    name:"shan",
                },
                viewAsFilter:function (player){
                    return player.isLinked();
                },
                check:function (){return},
				onuse:function (result,player){
        player.link();
                                                },
                onrespond:function (result,player){
                    if(player.isLinked()) player.link()
                },
                ai:{
                    skillTagFilter:function (player){
                        return player.isLinked();
                    },
                    respondShan:true,
                    basic:{
                        useful:[7,2],
                        value:[7,2],
                    },
                },
            },
            "w_taiji11111":{
              trigger:{player:['useCard','respond']},
				filter:function(event,player){
					return event.card.name=='shan'&&player.hasSha();
				},
				direct:true,
				content:function(){
					player.chooseToUse({name:'sha'},'太极：是否使用一张杀？').logSkill='taiji';
				},
            },
            "w_faen111":{
                trigger:{
                    global:["linkAfter"],
                },
                forced:true,
                filter:function (){
                    if(event.name=='link') return event.player.isLinked();
                    return !event.player.isTurnedOver();
                },
                check:function (event,player){
                    return get.attitude(player,event.player)>0;
                },
                logTarget:"player",
                content:function (){
                    player.draw();
                },
                ai:{
                    expose:0.2,
                },
            },
        },
        translate:{
            "w_huansha1":"阳刚",
            "w_huansha1_info":"横置你的武将牌，视为打出一张火杀",
            "w_huanshan1":"阴柔",
            "w_huanshan1_info":"重置你的武将牌，视为打出一张闪",
            "w_taiji11111":"太极",
            "w_taiji11111_info":"每当你使用或打出一张闪，你可以使用一张杀",
            "w_faen111":"天恩",
            "w_faen111_info":"锁定技，当一名角色横置或重置后，你摸一张牌",
        },
    },
    intro:"",
    author:"迷之仙人",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["woyebuzhidaoweishenmezhangshanfen.jpg","yijiushidataijidezhangsanfen.jpg"],"card":[],"skill":[]}}};