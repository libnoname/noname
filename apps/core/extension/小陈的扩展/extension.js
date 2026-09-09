import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"小陈的扩展",content:function (config,pack){
    
},precontent:function (){
    
},help:{},config:{},package:{
    character:{
        character:{
            "小鱼":["male","shen",3,["恢复","守护","暴击"],["des:陈鱼养的一只......这是什么物种？拥有陈鱼的一些时之力"]],
            "陈鱼":["male","shen",3,["时之力","时光之力","回溯","拳武","替换","斩魂","倒流"],["des:在这个被污染的世界，或许会需要一些人来消除污染，比起治标不治本的清理，不如除掉源头，以世界的名义，现在，你！可以死了！陈鱼经常说这句话，不过基本就没用上过，他使用时光倒流的能力之后解决问题时根本就不开杀戒，与其说是不杀，不如说是小鱼不让？或许你可以问问，万一能知道什么呢，陈鱼掌控时间的能力怎么来的？这个你可以问问小鱼，它应该知道，不过要记住一点，陈鱼是使用拳头来解决问题的。"]],
        },
        translate:{
            "小鱼":"小鱼",
            "陈鱼":"陈鱼",
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
            "拳武":{
                forced:true,
                trigger:{
                    player:"phaseJudgeEnd",
                },
                content:function (){//内容:
    player.disableEquip(1);//这是拳武废除武器栏的代码，如果你想，你可以删掉这个-小陈
},
                derivation:[],
            },
            "时之力":{
                forced:true,
                trigger:{
                    player:"shaBegin",
                },
                content:function (){
 player.draw();
},
                mod:{
                    selectTarget:function (card,player,range){
 if(card.name=='sha')range[1]+=1; 
},
                },
                derivation:[],
            },
            "时光之力":{
                forced:true,
                trigger:{
                    player:["damageEnd","loseHpEnd"],
                },
                content:function (){
    player.gainMaxHp(1);
    player.draw(1)
},
                derivation:[],
            },
            "回溯":{
                round:3,
                trigger:{
                    player:"phaseBegin",
                },
                content:function (){
 player.recover(1);//你可以把1改成任何数字，1就是回复的体力值
        player.draw(1)
},
                group:["回溯_roundcount"],
                derivation:[],
            },
            "复苏":{
                usable:1,
                enable:"phaseUse",
                selectCard:1,
                filterCard:true,
                position:"h",
                viewAs:{
                    name:"tao",
                },
                viewAsFilter:function (player){//这是使用条件，别删-小陈
 return player.countCards("h");//这是使用条件，别删
},
                ai:{
                    basic:{
                        order:function (card,player){
                if(player.hasSkillTag('pretao')) return 5;
                return 2;
            },
                        useful:[8,6.5,5,4],
                        value:[8,6.5,5,4],
                    },
                    result:{
                        target:2,
                        "target_use":function (player,target){
                // if(player==target&&player.hp<=0) return 2;
                if(player.hasSkillTag('nokeep',true,null,true)) return 2;
                var nd=player.needsToDiscard();
                var keep=false;
                if(nd<=0){
                    keep=true;
                }
                else if(nd==1&&target.hp>=2&&target.countCards('h','tao')<=1){
                    keep=true;
                }
                var mode=get.mode();
                if(target.hp>=2&&keep&&target.hasFriend()){
                    if(target.hp>2||nd==0) return 0;
                    if(target.hp==2){
                        if(game.hasPlayer(function(current){
                            if(target!=current&&get.attitude(target,current)>=3){
                                if(current.hp<=1) return true;
                                if((mode=='identity'||mode=='versus'||mode=='chess')&&current.identity=='zhu'&&current.hp<=2) return true;
                            }
                        })){
                            return 0;
                        }
                    }
                }
                if(target.hp<0&&target!=player&&target.identity!='zhu') return 0;
                var att=get.attitude(player,target);
                if(att<3&&att>=0&&player!=target) return 0;
                var tri=_status.event.getTrigger();
                if(mode=='identity'&&player.identity=='fan'&&target.identity=='fan'){
                    if(tri&&tri.name=='dying'&&tri.source&&tri.source.identity=='fan'&&tri.source!=target){
                        var num=game.countPlayer(function(current){
                            if(current.identity=='fan'){
                                return current.countCards('h','tao');
                            }
                        });
                        if(num>1&&player==target) return 2;
                        return 0;
                    }
                }
                if(mode=='identity'&&player.identity=='zhu'&&target.identity=='nei'){
                    if(tri&&tri.name=='dying'&&tri.source&&tri.source.identity=='zhong'){
                        return 0;
                    }
                }
                if(mode=='stone'&&target.isMin()&&
                player!=target&&tri&&tri.name=='dying'&&player.side==target.side&&
                tri.source!=target.getEnemy()){
                    return 0;
                }
                return 2;
            },
                    },
                    tag:{
                        recover:1,
                        save:1,
                    },
                },
            },
            "恢复":{
                forced:true,
                trigger:{
                    player:"phaseBegin",
                },
                content:function (){
var num=[1,2].randomGet();
        if(num==1) player.recover(1);
        if(num==2) player.draw(2);
        
},
            },
            "守护":{
                forced:true,
                trigger:{
                    player:["damageEnd"],
                },
                content:function (){
player.changeHujia(1);
player.draw(1)
player.gainMaxHp(1)
},
            },
            "袭击":{
                enable:"phaseUse",
                usable:1,
                selectCard:2,
                filterCard:true,
                position:"h",
                selectTarget:1,
                filterTarget:function (card,player,target){
        return target!=player;
    },
                filter:function (event,player){
    return player.countCards("h");
},
                content:function (){
 target.addSkill('遇袭')
},
            },
            "遇袭":{
                trigger:{
                    player:"phaseBegin",
                },
                content:function (){
 player.loseHp(1)
player.chooseToDiscard(2,true)
player.removeSkill('遇袭')
},
            },
            "替换":{
                usable:1,
                enable:"phaseUse",
                chooseButton:{
                    dialog:function (){//显示
        return ui.create.dialog([["guohe","jiu","tao"],"vcard"]);
    },
                    filter:function (button,player){
        return lib.filter.filterCard({name:button.link[2]},player,_status.event.parent);
   
    },
                    backup:function (links,player){
        return{
            selectCard:1,
            filterCard:true,
            viewAs:{
                name:links[0][2],
            },
        };
    },
                    prompt:function (links,player){
        return "选择当做"+get.translation(links[0][2])+"的牌";
      
    },
                },
                derivation:[],
            },
            "暴击":{
                enable:"phaseUse",
                usable:1,
                selectCard:2,
                filterCard:true,
                position:"h",
                selectTarget:1,
                filterTarget:function (card,player,target){
        return target!=player;
    },
                filter:function (event,player){
    return player.countCards("h");
},
                content:function (){
        target.chooseToDiscard(2,true)
 target.loseHp()
 },
            },
            "斩魂":{
                usable:1,
                enable:"phaseUse",
                selectCard:1,
                filterCard:true,
                position:"h",
                viewAs:{
                    name:"sha",
                },
                viewAsFilter:function (player){//这是使用条件，别删-小陈
 return player.countCards("h");//这是使用条件，别删
},
                ai:{
                    canLink:function (player,target,card){
            if(!target.isLinked()&&!player.hasSkill('wutiesuolian_skill')) return false;
            if(target.mayHaveShan()&&!player.hasSkillTag('directHit_ai',true,{
                target:target,
                card:card,
            },true)) return false;
            if(player.hasSkill('jueqing')||target.hasSkill('gangzhi')||target.hasSkill('gangzhi')) return false;
            return true;
        },
                    basic:{
                        useful:[5,1],
                        value:[5,1],
                    },
                    order:function (item,player){
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
                        target:function (player,target,card,isLink){
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
            "倒流":{
                forced:true,
                unique:true,
                limited:true,
                mark:true,
                intro:{
                    content:"limited",
                },
                skillAnimation:true,
                init:function (player){
    player.storage.倒流=false;
},
                trigger:{
                    player:"phaseUseBegin",
                },
                filter:function (event,player){
     return player.hp=6&&!player.storage.hunzi;
    },
                content:function (){
    "step 0"
    player.storage.倒流=true;
    player.awakenSkill("倒流")
    "step 1"
    player.draw(5)
        player.loseMaxHp(4)
        player.removeSkill('拳武')
player.removeSkill('时之力')
player.removeSkill('斩魂')
player.addSkill('斩魂●改')
player.enableEquip(1)
},
            },
            "斩魂●改":{
                enable:"phaseUse",
                selectCard:1,
                filterCard:true,
                position:"h",
                viewAs:{
                    name:"sha",
                },
                viewAsFilter:function (player){
 return player.countCards("h");
},
                mod:{
                    cardUsable:function (card,player,num){
            if(card.name=='sha') return num+Infinity;
        },
                },
                ai:{
                    canLink:function (player,target,card){
            if(!target.isLinked()&&!player.hasSkill('wutiesuolian_skill')) return false;
            if(target.mayHaveShan()&&!player.hasSkillTag('directHit_ai',true,{
                target:target,
                card:card,
            },true)) return false;
            if(player.hasSkill('jueqing')||target.hasSkill('gangzhi')||target.hasSkill('gangzhi')) return false;
            return true;
        },
                    basic:{
                        useful:[5,1],
                        value:[5,1],
                    },
                    order:function (item,player){
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
                        target:function (player,target,card,isLink){
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
        },
        translate:{
            "拳武":"拳武",
            "拳武_info":"锁定技，你的回合开始后，你废除你的武器栏",
            "时之力":"时之力",
            "时之力_info":"锁定技，当你使用杀指定目标时，此杀每指定一个目标，则你摸一张牌并且你的杀可以额外指定一个目标",
            "时光之力":"时光之力",
            "时光之力_info":"锁定技，每当你失去体力值或受到伤害后，你增加一点体力上限并摸一张牌",
            "回溯":"回溯",
            "回溯_info":"每二轮限一次，你的回合开始时，你可以回复一点体力并摸一张牌",
            "复苏":"复苏",
            "复苏_info":"每回合仅限一次，你可以将一张牌当做桃使用",
            "恢复":"恢复",
            "恢复_info":"锁定技，你的回合开始时，你随机摸两张牌或回复一点体力",
            "守护":"守护",
            "守护_info":"锁定技，当你受到伤害后，你获得一点护盾摸一张牌并加一点体力上限",
            "袭击":"袭击",
            "袭击_info":"出牌阶段仅限一次，你可以弃置两张牌选择一名其他角色，其获得技能，遇袭:锁定技，你的回合开始时，你失去一点体并弃置两张牌然后你失去技能 遇袭",
            "遇袭":"遇袭",
            "遇袭_info":"锁定技，你的回合开始时，你失去一点体并弃置两张牌然后你失去技能，遇袭",
            "替换":"替换",
            "替换_info":"出牌阶段仅限一次，你可以将一张手牌视为《过河拆桥》《酒》《桃》使用",
            "暴击":"暴击",
            "暴击_info":"出牌阶段仅限一次，你可以弃置两张手牌令一名其他角色弃置两张手牌并失去一点体力",
            "斩魂":"斩魂",
            "斩魂_info":"出牌阶段限一次，你可以将一张任意手牌当做杀使用",
            "倒流":"倒流",
            "倒流_info":"限定技，出牌阶段开始时，若你的体力值等于6，则你摸5张牌减少4点体力上限并失去技能拳武与时之力修改斩魂然后恢复武器栏 《斩魂●改》出牌阶段，你可以将一张手牌当做杀使用并且你的杀无次数限制",
            "斩魂●改":"斩魂●改",
            "斩魂●改_info":"出牌阶段，你可以将一张手牌当做杀使用并且你的杀无次数限制",
        },
    },
    intro:"",
    author:"小陈哥哥",
    diskURL:"",
    forumURL:"",
    version:"1.5.6",
},files:{"character":["陈鱼.jpg"],"card":[],"skill":[]}}};