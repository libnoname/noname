import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"nba",content:function (config,pack){
    
},precontent:function (){
    
},help:{},config:{},package:{
    character:{
        character:{
            "蔡徐坤":["female","qun",4,["脚踝","射程无限","手感火热","控球大师","xinkuanggu"],["zhu","boss","forbidai","bossallowed","des:nba形象大使"]],
        },
        translate:{
            "蔡徐坤":"蔡徐坤",
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
            "脚踝":{
                audio:"ext:nba:2",
                trigger:{
                    player:"shaBegin",
                },
                check:function (event,player){
        return get.attitude(player,event.target)<0;
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
        target.chooseToDiscard('请弃置一张'+get.translation(suit)+'牌，否则不能使用闪抵消此杀','he',function(card){
            return get.suit(card)==_status.event.suit;
        }).set('ai',function(card){
            var num=_status.event.num;
            if(num==0) return 0;
            if(card.name=='shan') return num>1?2:0;
            return 8-get.value(card);
        }).set('num',num).set('suit',suit);
        "step 2"
        if(!result.bool){
            trigger.directHit=true;
        }
    },
            },
            "射程无限":{
                mod:{
                    globalFrom:function (from,to,distance){
            return distance-5;
        },
                },
            },
            "手感火热":{
                audio:"ext:nba:2",
                trigger:{
                    player:"loseEnd",
                },
                frequent:true,
                filter:function (event,player){
        if(player.countCards('h')) return false;
        for(var i=0;i<event.cards.length;i++){
            if(event.cards[i].original=='h') return true;
        }
        return false;
    },
                content:function (){
        player.draw(2);
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
                if(player.countCards('h')!=1) return false;
            }
        },
                },
            },
            "控球大师":{
                mod:{
                    targetEnabled:function (card,player,target,now){
            if(card.name=='shunshou'||card.name=='lebu') return false;
        },
                },
            },
        },
        translate:{
            "脚踝":"脚踝",
            "脚踝_info":"脚踝终结者，当你使用【杀】指定一名角色为目标后，你可以进行一次判定并令该角色的非锁定技失效直到回合结束，除非该角色弃置一张与判定结果花色相同的牌，否则不能使用【闪】抵消此【杀】。",
            "射程无限":"射程无限",
            "射程无限_info":"半场三分",
            "手感火热":"手感火热",
            "手感火热_info":"每当你失去最后一张手牌，可摸两张牌",
            "控球大师":"控球大师",
            "控球大师_info":"锁定技，你不能成为[顺手牵羊]和[乐不思蜀]的目标",
        },
    },
    intro:"",
    author:"无名玩家",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["蔡徐坤.jpg"],"card":[],"skill":[]}}};