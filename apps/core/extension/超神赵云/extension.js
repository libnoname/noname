import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"超神赵云",content:function () {} ,precontent:function () {} ,help:{},config:{},package:{
    character:{
        character:{
"超神赵云": ["male","shen",4,["ollongdan","zongheng2","huoyu2","longteng1"],["character:zhaoyun"]]
},
        translate:{
"超神赵云":"超神赵云"
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
"zongheng1":{
                trigger:{
                    player:["changeHp"],
                },
                forced:true,
                filter:function (event,player){
        return get.sgn(player.hp-2.5)!=get.sgn(player.hp-2.5-event.num);
    },
                content:function (){},
                mod:{
                    globalFrom:function (from,to,current){
            if(from.hp>2) return current-99;
        },
                    globalTo:function (from,to,current){
            if(to.hp<=2) return current+1;
        },
                },
                ai:{
                    threaten:0.8,
                },
            },
"juejing1":{
                superCharlotte:true,
                charlotte:true,
                fixed:true,
                mod:{
                    maxHandcard:function (player,num){
            return 4+num;
        },
                },
                audio:"juejing",
                trigger:{
                    player:["damageEnd","loseHpEnd","dying"],
                },
                forced:true,
                content:function (){
        var num=trigger.num;
        player.draw(num);
    },
            },
"longteng1":{
                superCharlotte:true,
                charlotte:true,
                fixed:true,
                skillAnimation:true,
                animationColor:"water",
                trigger:{
                    player:"dying",
                },
                forced:true,
                unique:true,
                juexingji:true,
                filter:function (event,player){
        var zhu=get.zhu(player);
        if(zhu&&zhu.isZhu){
            var name=zhu.name
            while(name.indexOf('_')!=-1){
                name=name.slice(name.indexOf('_')+1);
            }
            if(name.indexOf('zhaoyun')==0) return false;
        }
        return !player.storage.longteng1
    },
                content:function (){
        "step 0"
        player.loseMaxHp();
        "step 1"
        player.storage.longteng1=true;
        player.removeSkill('relongdan');
        player.addSkill('juejing1');
        player.addSkill('Rlonghun1');
        player.awakenSkill('longteng1');
        if(player.hp<1){
            player.recover(1-player.hp);
        }
        "step 2"
    },
            },
"huoyu2":{
                superCharlotte:true,
                charlotte:true,
                fixed:true,
                audio:"reyajiao",
                trigger:{
                    player:["respond","useCard"],
                },
                filter:function (event,player){      
        if(player==_status.currentPhase) return false; 
        if(get.type(event.card)=='basic') return true;
    },
                frequent:true,
                content:function (){
        player.draw();
    },
            },
"zongheng2":{
                superCharlotte:true,
                charlotte:true,
                fixed:true,
                group:["zongheng1","fangyu1","zongheng3"],
            },
"zongheng3":{
                trigger:{
                    player:"turnOverBefore",
                },
                priority:20,
                forced:true,
                filter:function (event,player){
        return !player.isTurnedOver();
    },
                content:function (){
        trigger.cancel();
    },
            },
"Rlonghun1":{
                superCharlotte:true,
                charlotte:true,
                fixed:true,
                group:["xinlonghun1","xinlonghun2","xinlonghun3","xinlonghun4","xinlonghun_num","xinlonghun_discard"],
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
                            source:["damageBegin","recoverBegin"],
                        },
                        forced:true,
                        popup:false,
                        filter:function (event){
                var evt=event.getParent();
                return (evt.skill=='xinlonghun1'||evt.skill=='xinlonghun2')&&evt.cards&&evt.cards.length==2;
            },
                        content:function (){
                trigger.num++;
            },
                        sub:true,
                    },
                    discard:{
                        trigger:{
                            player:["useCard","respond"],
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
                return (evt.skill=='xinlonghun3'||evt.skill=='xinlonghun4')&&
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
"fangyu1":{
                trigger:{
                    player:"damageBegin4",
                },
                forced:true,
                priority:-30,
                filter:function (event,player){
        if(event.source==player) return false;
        return event.num>1;
    },
                content:function (){
        if(trigger.source) trigger.source.damage(trigger.num-1,trigger.nature,trigger.source)
        trigger.num=1;
    },
            }
},
        translate:{
"zongheng1":"纵横",
"zongheng1_info":"锁定技，只要你的体力值大于2点，你的进攻距离为无限；只要你的体力值为2点或更低，你的防御距离+1。你不能被翻面。",
"juejing1":"绝境",
"juejing1_info":"锁定技，你的手牌上限+4；当你受到伤害或失去体力或进入或脱离濒死状态时，你摸等量的牌。",
"longteng1":"龙腾",
"longteng1_info":"觉醒技，当你进入濒死阶段时，你需减1点体力上限并将体力恢复至1点，失去技能“龙胆\"，并获得技能“绝境”和“龙魂”。",
"huoyu2":"豁余",
"huoyu2_info":"每当你于回合外使用或打出一张基本牌，你可以摸一张牌。",
"zongheng2":"纵横",
"zongheng2_info":"锁定技，只要你的体力值大于2点，你的进攻距离为无限；只要你的体力值为2点或更低，你的防御距离+1。若伤害来源不为你，你受到的大于1的伤害会反弹给伤害来源。你不能被翻面。",
"zongheng3":"纵横",
"zongheng3_info":"锁定技，你的武将牌始终正面向上。",
"Rlonghun1":"龙魂",
"Rlonghun1_info":"你可以将同花色的一至两张牌按下列规则使用或打出：红桃当【桃】，方块当火【杀】，梅花当【闪】，黑桃当普【无懈可击】。若你以此法使用了两张红色牌，则此牌回复值或伤害值+1。若你以此法使用了两张黑色牌，则你弃置当前回合角色一张牌。",
"fangyu1":"纵横",
"fangyu1_info":"受到伤害大于1则超过的部分反弹。"
},
    },
    intro:"",
    author:"火枪",
    diskURL:"",
    forumURL:"",
    version:"1.114514",
},files:{"character":[],"card":[],"skill":[]}}};
