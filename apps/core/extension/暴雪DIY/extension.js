import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"暴雪DIY",content:function(config,pack){
    
},precontent:function(){
    
},help:{},config:{},package:{
    character:{
        character:{
            murozond:["male","wei",5,["shachen","jingzhi"],["des:诺兹多姆看见了自己的未来：堕落成姆诺兹多，创立了永恒龙军团，试图篡改历史，最终被过去的自己杀死"]],
            temporus:["male","wei",4,["luanliu","zhefu"],[]],
            crowley:["male","wei",4,["paoji","langhun"],[]],
            azshara:["female","wei",3,["bengkui","qingliu"],["des:曾经高贵的暗夜精灵女王，如今沦为海底的娜迦"]],
            ashe:["female","shu",3,["leiguan","lieqiang","zhuangdan"],["des:死局帮的领袖，麦克雷曾经的好友"]],
            kael:["male","shu",4,["lieyan","huofa"],[]],
            illidan:["male","wu",4,["liemo","feiying"],["des:艾泽拉斯第一位恶魔猎手，为了消灭燃烧军团不择手段"]],
            slord:["male","qun",4,["shunpi","jianren"],[]],
            gul:["male","qun",3,["moxie","shiyao","hongxi"],[]],
            malchezaar:["male","wu",4,["moxie","juntuan"],[]],
            sanduin:["male","qun",3,["xukong"],[]],
            lichk:["male","qun",5,["shihun"],["des:霜之哀伤，饿了……"]],
            lili:["female","wu",3,["yingzong","jianiang","buzui"],[]],
            toki:["female","shu",3,["qianghua","fix"],[]],
            priest:["female","qun",3,["fushang"],[]],
            itoki:["female","wei",3,["beilun","jiasu"],[]],
            jim:["male","shu",2,["xinliegong","jisu"],[]],
            aegwynn:["female","wei",3,["aofa","chuansuo"],["des:前任提瑞斯法守护者，能驾驭艾露尼斯的强大法师，麦迪文的母亲。"]],
            onixia:["female","qun",3,["longxing","离间"],["des:死亡之翼的女儿，曾潜入暴风城腐化其政治。"]],
        },
        translate:{
            murozond:"姆诺兹多",
            temporus:"坦普卢斯",
            crowley:"克罗雷",
            azshara:"艾萨拉",
            ashe:"艾什",
            kael:"凯尔萨斯",
            illidan:"伊利丹",
            slord:"天灾领主",
            gul:"鲜血掠夺者",
            malchezaar:"玛克扎尔",
            sanduin:"暗影收割者",
            lichk:"巫妖王",
            lili:"丽丽",
            toki:"托奇",
            priest:"北郡牧师",
            itoki:"永恒托奇",
            jim:"吉姆·雷诺",
            aegwynn:"艾格文",
            onixia:"奥妮克希亚",
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
            fix:{
                trigger:{
                    player:"judgeBegin",
                },
                frequent:true,
                filter:function(){
        return ui.cardPile.childNodes.length>1;
    },
                check:function(){
        return false;
    },
                content:function(){
        'step 0'
        var str='';
        if(trigger.card) str=get.translation(trigger.card.viewAs||trigger.card.name);
        else if(trigger.skill) str=get.translation(trigger.skill);
        else str=get.translation(trigger.parent.name);

        var cards=[ui.cardPile.childNodes[0],ui.cardPile.childNodes[1]];
        var att=get.attitude(player,trigger.player);
        var delta=trigger.judge(ui.cardPile.childNodes[1])-trigger.judge(ui.cardPile.childNodes[0]);
        player.chooseControl('调换顺序','cancel2',
        ui.create.dialog('修补:你的'+str+'判定',cards,'hidden')).ai=function(){
            if(att*delta>0) return '调换顺序';
            else return 'cancel2';
        };
        'step 1'
        if(result.control=='调换顺序'){
            var card=ui.cardPile.firstChild;
            ui.cardPile.removeChild(card);
            ui.cardPile.insertBefore(card,ui.cardPile.firstChild.nextSibling);
            game.log(player,'调换了牌堆顶两张牌的顺序');
        }
    },
                ai:{
                    expose:0.1,
                    tag:{
                        rejudge:0.5,
                    },
                },
            },
            fushang:{
                trigger:{
                    global:"recoverEnd",
                },
                frequent:true,
                content:function(){
        player.draw()
    },
            },
            beilun:{
                audio:"ext:暴雪DIY:2",
                audioname:["jianyong"],
                trigger:{
                    player:"useCard",
                },
                frequent:true,
                filter:function(event){
        return (get.type(event.card)=='trick'&&event.cards[0]&&event.cards[0]==event.card);
    },
                content:function(){var card=[]; 
                       card.push(game.createCard('sha'));
    player.gain(card) ; },
                ai:{
                    threaten:1.4,
                    noautowuxie:true,
                },
            },
            chuansuo:{
                mod:{
                    globalFrom:function(from,to,distance){
            return distance-2;
        },
                },
            },
            jiasu:{
                mod:{
                    cardUsable:function(card,player,num){
            if(card.name=='sha') return num+3;
        },
                },
            },
            jisu:{
                trigger:{
                    player:"phaseBegin",
                },
                frequent:true,
                content:function(){
    player.recover()   },
            },
            longxing:{
                audio:"ext:暴雪DIY:2",
                unique:true,
                enable:"chooseToUse",
                mark:true,
                skillAnimation:true,
                animationStr:"龙形",
                animationColor:"fire",
                init:function(player){
        player.storage.niepan=false;
    },
                filter:function(event,player){
        if(player.storage.niepan) return false;
        if(event.type=='dying'){
            if(player!=event.dying) return false;
            return true;
        }
        else if(event.parent.name=='phaseUse'){
            return true;
        }
        return false;
    },
                content:function(){
        'step 0'
        player.maxHp=player.maxHp+2;
        player.hp=Math.min(5,player.maxHp);
        player.discard(player.getCards('hej'));
        player.draw(6);
        player.awakenSkill('longxing');
        player.storage.niepan=true;
        player.clearSkills()
        'step 1'
        player.link(false);
        'step 2'
        player.turnOver(false);
    },
                ai:{
                    order:0.5,
                    skillTagFilter:function(player){
            if(player.storage.niepan) return false;
            if(player.hp>0) return false;
        },
                    save:true,
                    result:{
                        player:function(player){
                if(player.hp==0) return 10;
                if(player.hp<=1&&player.countCards('he')<=1) return 10;
                return 0;
            },
                    },
                    threaten:function(player,target){
            if(!target.storage.niepan) return 0.6;
        },
                },
                intro:{
                    content:"limited",
                },
            },
            aofa:{
                trigger:{
                    player:"phaseEnd",
                },
                forced:true,
                content:function(){
        player.draw(3)
    },
            },
            yingzong:{
                audio:"ext:暴雪DIY:2",
                trigger:{
                    player:"damageEnd",
                },
                direct:true,
                content:function(){
        "step 0"
        player.gain(game.createCard('shan'))
  ;  },
                ai:{
                    effect:{
                        target:function(card,player,target,current){
                if(get.tag(card,'damage')&&target.hp>1){
                    if(player.hasSkillTag('jueqing',false,target)) return [1,-2];
                    var max=0;
                    var players=game.filterPlayer();
                    for(var i=0;i<players.length;i++){
                        if(get.attitude(target,players[i])>0){
                            max=Math.max(Math.min(5,players[i].hp)-players[i].countCards('h'),max);
                        }
                    }
                    switch(max){
                        case 0:return 2;
                        case 1:return 1.5;
                        case 2:return [1,2];
                        default:return [0,max];
                    }
                }
                if((card.name=='tao'||card.name=='caoyao')&&
                    target.hp>1&&target.countCards('h')<=target.hp) return [0,0];
            },
                    },
                },
            },
            "离间":{
                audio:"ext:暴雪DIY:2",
                enable:"phaseUse",
                usable:1,
                filter:function(event,player){
        return game.countPlayer(function(current){
            return current!=player&&current.sex=='male';
        })>1;
    },
                check:function(card){return 10-get.value(card)},
                filterCard:true,
                position:"he",
                filterTarget:function(card,player,target){
        if(player==target) return false;
        if(target.sex!='male') return false;
        if(ui.selected.targets.length==1){
            return target.canUse({name:'juedou'},ui.selected.targets[0]);
        }
        return true;
    },
                targetprompt:["先出杀","后出杀"],
                selectTarget:2,
                multitarget:true,
                content:function(){
        targets[1].useCard({name:'juedou'},targets[0],'noai').animate=false;
        game.delay(0.5);
    },
                ai:{
                    order:8,
                    result:{
                        target:function(player,target){
                if(ui.selected.targets.length==0){
                    return -3;
                }
                else{
                    return get.effect(target,{name:'juedou'},ui.selected.targets[0],target);
                }
            },
                    },
                    expose:0.4,
                    threaten:3,
                },
            },
            shihun:{
                trigger:{
                    player:"shaBegin",
                },
                priority:5,
                logTarget:"target",
                check:function(event,player){
        return get.attitude(player,event.target)<=0;
    },
                filter:function(event,player){
        return event.target.countCards('he');
    },
                content:function(){
        trigger.target.chooseToDiscard('he',true);
    },
            },
            xukong:{
                enable:"phaseUse",
                filterCard:{
                    color:"black",
                },
                filter:function(event,player){
        return player.countCards('he',{color:'black'})>0;
    },
                position:"he",
                usable:2,
                mark:true,
                intro:{
                    content:"已进入暗影形态",
                },
                check:function(card){
        return 9-get.value(card)
    },
                filterTarget:true,
                content:function(){
        target.loseHp();
    },
                ai:{
                    order:9,
                    result:{
                        target:-1,
                    },
                    threaten:2,
                    expose:0.2,
                },
            },
            juntuan:{
                mod:{
                    maxHandcard:function(player,num){
            return num*2;
        },
                },
                trigger:{
                    global:"gameStart",
                    player:"enterGame",
                },
                forced:true,
                content:function(){
        player.draw(5,false);
        player.$draw(5);
    },
            },
            jianiang:{
                audio:"ext:暴雪DIY:2",
                enable:["chooseToUse"],
                filter:function(event,player){
        return _status.currentPhase!=player;
    },
                filterCard:{
                    name:"jiu",
                },
                position:"he",
                viewAs:{
                    name:"tao",
                    suit:"diamond",
                    number:5,
                    cards:[{"node":{"image":{},"info":{},"name":{},"name2":{},"background":{},"intro":{},"range":{}},"storage":{},"vanishtag":[],"_uncheck":[],"suit":"diamond","number":5,"name":"jiu","cardid":"2991566443","_transform":"translateX(0px)","clone":{"name":"jiu","suit":"diamond","number":5,"node":{"name":{},"info":{},"intro":{},"background":{},"image":{}},"_transitionEnded":true,"timeout":120},"timeout":101,"original":"h"}],
                },
                prompt:"将一张酒当桃使用",
                check:function(card){return 15-get.value(card)},
                ai:{
                    skillTagFilter:function(player){
            return player.countCards('he',{color:'red'})>0&&_status.currentPhase!=player;
        },
                    threaten:1.5,
                    save:true,
                    respondTao:true,
                    basic:{
                        order:function(card,player){
                if(player.hasSkillTag('pretao')) return 5;
                return 2;
            },
                        useful:[8,6.5,5,4],
                        value:[8,6.5,5,4],
                    },
                    result:{
                        target:function(player,target){
                // if(player==target&&player.hp<=0) return 2;
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
            shiyao:{
                enable:"phaseUse",
                filterCard:{
                    color:"black",
                },
                filter:function(event,player){
        return player.countCards('he',{color:'black'})>0;
    },
                position:"he",
                usable:1,
                mark:true,
                intro:{
                    content:"已进入暗影形态",
                },
                check:function(card){
        return 9-get.value(card)
    },
                filterTarget:true,
                content:function(){
        target.loseHp();
  player.recover();  },
                ai:{
                    order:9,
                    result:{
                        target:-1,
                    },
                    threaten:2,
                    expose:0.2,
                },
            },
            shunpi:{
                audio:"ext:暴雪DIY:true",
                trigger:{
                    source:"damageAfter",
                },
                direct:true,
                filter:function(event,player){
        if(player.countCards('h')==0) return false;
        if(!event.card) return false;
        if(event.card.name!='sha') return false;
        return game.hasPlayer(function(current){
            return current!=event.player&&get.distance(event.player,current)<=1;
        });
    },
                content:function(){
        "step 0"
        var damaged=trigger.player;
        player.chooseCardTarget({
            filterCard:lib.filter.cardDiscardable,
            filterTarget:function(card,player,target){
                var damaged=_status.event.damaged;
                return get.distance(damaged,target)<=1&&target!=damaged;
            },
            ai1:function(card){
                return 9-get.value(card);
            },
            ai2:function(target){
                var player=_status.event.player;
                return get.damageEffect(target,player,player);
            },
            prompt:get.prompt('shunpi')
        }).set('damaged',damaged);
        "step 1"
        if(result.bool){
            player.logSkill('shunpi',result.targets);
            player.discard(result.cards);
            result.targets[0].damage();
        }
    },
            },
            liemo:{
                mod:{
                    targetInRange:function(card){
            if(card.name=='sha'&&get.color(card)=='red') return true;
        },
                    selectTarget:function(card,player,range){
            if(card.name=='sha'&&range[1]!=-1&&get.color(card)=='black'){
                range[1]++;
            }
        },
                },
                ai:{
                    threaten:1.4,
                },
            },
            lieyan:{
                audio:"ext:暴雪DIY:2",
                enable:"phaseUse",
                viewAs:{
                    name:"chiyuxi",
                },
                filterCard:function(card,player){
        if(ui.selected.cards.length){
            return get.suit(card)==get.suit(ui.selected.cards[0]);
        }
        var cards=player.getCards('h');
        for(var i=0;i<cards.length;i++){
            if(card!=cards[i]){
                if(get.suit(card)==get.suit(cards[i])) return true;
            }
        }
        return false;
    },
                selectCard:2,
                complexCard:true,
                check:function(card){
        var player=_status.event.player;
        var targets=game.filterPlayer(function(current){
            return player.canUse('chiyuxi',current);
        });
        var num=0;
        for(var i=0;i<targets.length;i++){
            var eff=get.sgn(get.effect(targets[i],{name:'chiyuxi'},player,player));
            if(targets[i].hp==1){
                eff*=1.5;
            }
            num+=eff;
        }
        if(!player.needsToDiscard(-1)){
            if(targets.length>=7){
                if(num<2) return 0;
            }
            else if(targets.length>=5){
                if(num<1.5) return 0;
            }
        }
        return 6-get.value(card);
    },
                ai:{
                    basic:{
                        order:10,
                        useful:1,
                        value:5,
                    },
                    wuxie:function(target,card,player,viewer){
            if(get.attitude(viewer,target)>0&&target.countCards('h','shan')){
                if(!target.countCards('h')||target.hp==1||Math.random()<0.7) return 0;
            }
        },
                    result:{
                        target:function(player,target){
                if(player.hasUnknown(2)&&get.mode()!='guozhan') return 0;
                var nh=target.countCards('h');
                if(get.mode()=='identity'){
                    if(target.isZhu&&nh<=2&&target.hp<=1) return -100;
                }
                if(nh==0) return -2;
                if(nh==1) return -1.7
                return -1.5;
            },
                    },
                    tag:{
                        respond:1,
                        respondShan:1,
                        damage:1,
                        multitarget:1,
                        multineg:1,
                        natureDamage:1,
                        fireDamage:1,
                    },
                },
            },
            huofa:{
                trigger:{
                    player:"phaseEnd",
                },
                frequent:true,
                content:function(){
        player.gain(game.createCard('liuxinghuoyu'))
    },
            },
            buzui:{
                trigger:{
                    player:"phaseEnd",
                },
                forced:true,
                content:function(){
        if (player.hp<player.maxHp) player.gain(game.createCard('jiu'));
    },
            },
            lieqiang:{
                mod:{
                    targetInRange:function(card){
            if(card.name=='sha') return true;
        },
                },
                ai:{
                    threaten:1.4,
                },
            },
            leiguan:{
                audio:"ext:暴雪DIY:2",
                enable:"chooseToUse",
                filterCard:function(card){
        return get.color(card)=='red';
    },
                viewAs:{
                    name:"liuxinghuoyu",
                    nature:"fire",
                    suit:"diamond",
                    number:8,
                    cards:[{"node":{"image":{},"info":{},"name":{},"name2":{},"background":{},"intro":{},"range":{}},"storage":{},"vanishtag":[],"_uncheck":[],"suit":"diamond","number":8,"name":"shan","cardid":"4296935345","_transform":"translateX(112px)","clone":{"name":"shan","suit":"diamond","number":8,"node":{"name":{},"info":{},"intro":{},"background":{},"image":{}},"_transitionEnded":true,"timeout":1816},"timeout":1770,"original":"h"}],
                },
                viewAsFilter:function(player){
        if(!player.countCards('h',{color:'red'})) return false;
    },
                prompt:"将一张红色牌当流星火雨使用",
                check:function(card){
        var player=_status.currentPhase;
        if(player.countCards('h')>player.hp){
            return 6-get.value(card);
        }
        return 4-get.value(card)
    },
                ai:{
                    basic:{
                        order:4,
                        value:[3,1],
                        useful:1,
                    },
                    wuxie:function(target,card,player,current,state){
            if(get.attitude(current,player)>=0&&state>0) return false;
        },
                    result:{
                        player:function(player){
                var nh=player.countCards('h');
                if(nh<=player.hp&&nh<=4&&_status.event.name=='chooseToUse'){
                    if(typeof _status.event.filterCard=='function'&&
                        _status.event.filterCard({name:'huogong'})){
                        return -10;
                    }
                    if(_status.event.skill){
                        var viewAs=get.info(_status.event.skill).viewAs;
                        if(viewAs=='huogong') return -10;
                        if(viewAs&&viewAs.name=='huogong') return -10;
                    }
                }
                return 0;
            },
                        target:function(player,target){
                if(target.hasSkill('huogong2')||target.countCards('h')==0) return 0;
                if(player.countCards('h')<=1) return 0;
                if(target==player){
                    if(typeof _status.event.filterCard=='function'&&
                        _status.event.filterCard({name:'huogong'})){
                        return -1.5;
                    }
                    if(_status.event.skill){
                        var viewAs=get.info(_status.event.skill).viewAs;
                        if(viewAs=='huogong') return -1.5;
                        if(viewAs&&viewAs.name=='huogong') return -1.5;
                    }
                    return 0;
                }
                return -1.5;
            },
                    },
                    tag:{
                        damage:1,
                        fireDamage:1,
                        natureDamage:1,
                        norepeat:1,
                        discard:1,
                        loseCard:1,
                        position:"he",
                    },
                },
            },
            zhuangdan:{
                trigger:{
                    player:"phaseEnd",
                },
                frequent:true,
                content:function(){
        player.gain(game.createCard('sha'))    },
            },
            bengkui:{
                audio:"ext:暴雪DIY:2",
                trigger:{
                    player:"damageEnd",
                },
                direct:true,
                forced:true,
                content:function(){
var list=game.filterPlayer(function(current){
        return player.canUse('jingleishan',current);
    });
    list.sort(lib.sort.seat);
    player.useCard({name:'jingleishan'},list) ;  },
                ai:{
                    effect:{
                        target:function(card,player,target,current){
                if(get.tag(card,'damage')&&target.hp>1){
                    if(player.hasSkillTag('jueqing',false,target)) return [1,-2];
                    var max=0;
                    var players=game.filterPlayer();
                    for(var i=0;i<players.length;i++){
                        if(get.attitude(target,players[i])>0){
                            max=Math.max(Math.min(5,players[i].hp)-players[i].countCards('h'),max);
                        }
                    }
                    switch(max){
                        case 0:return 2;
                        case 1:return 1.5;
                        case 2:return [1,2];
                        default:return [0,max];
                    }
                }
                if((card.name=='tao'||card.name=='caoyao')&&
                    target.hp>1&&target.countCards('h')<=target.hp) return [0,0];
            },
                    },
                },
            },
            paoji:{
                audio:"ext:暴雪DIY:true",
                trigger:{
                    player:"phaseBegin",
                },
                direct:true,
                content:function(){
        "step 0"
        player.chooseTarget(get.prompt('paoji'),function(card,player,target){
           
            return lib.filter.targetEnabled({name:'liuxinghuoyu'},player,target);
        }).ai=function(target){
            return get.effect(target,{name:'liuxinghuoyu'},player);
        }
        "step 1"
        if(result.bool){
            player.logSkill('paoji');
            player.useCard({name:'liuxinghuoyu'},result.targets,false);
        }
    },
                ai:{
                    expose:0.2,
                    threaten:1.3,
                },
            },
            langhun:{
                audio:"ext:暴雪DIY:true",
                trigger:{
                    source:"dieAfter",
                },
                forced:true,
                content:function(){
        player.maxHp+=1;
        player.recover();
    },
            },
            luanliu:{
                trigger:{
                    player:"phaseAfter",
                },
                forced:true,
                priority:-50,
                filter:function(event,player){
        return event.skill!='luanliu';
    },
                content:function(){player.insertPhase(); 
        
    },
                ai:{
                    threaten:1.8,
                },
            },
            zhefu:{
                trigger:{
                    global:"gameStart",
                    player:"enterGame",
                },
                forced:true,
                content:function(){
        player.turnOver()
    },
            },
            jingzhi:{
                trigger:{
                    player:"phaseEnd",
                },
                direct:true,
                content:function(){
        "step 0"
        player.chooseTarget(get.prompt('jingzhi'),function(card,player,target){
            return true;
        }).ai=function(target){
            var att=get.attitude(player,target);
            if(target.isTurnedOver()){
                if(att>0){
                    return att+5;
                }
                return -1;
            }
            if(player.isTurnedOver()){
                return 5-att;
            }
            return -att;
        };
        "step 1"
        if(result.bool){
            player.logSkill('jingzhi',result.targets);
            result.targets[0].turnOver();
        }
    },
                ai:{
                    threaten:1.7,
                },
            },
            shachen:{
                audio:"ext:暴雪DIY:2",
                mod:{
                    maxHandcard:function(player,num){
            return num-=2;
        },
                },
                trigger:{
                    player:"phaseDrawBegin",
                },
                forced:true,
                content:function(){
        trigger.num+=2;
    },
                ai:{
                    threaten:1.3,
                },
            },
        },
        translate:{
            fix:"修补",
            "fix_info":"你在进行判定前，可以观看牌堆顶的两张牌，并可以将其调换顺序",
            fushang:"扶伤",
            "fushang_info":"每当一名角色回复体力时，你摸一张牌",
            beilun:"悖论",
            "beilun_info":"当你使用一张非转化、非延时锦囊牌，可以获得一张杀",
            chuansuo:"穿梭",
            "chuansuo_info":"锁定技，你的进攻距离+2",
            jiasu:"加速",
            "jiasu_info":"锁定技，你在一个出牌阶段可以使用4张杀",
            jisu:"激素",
            "jisu_info":"你在回合开始时可以回复1点体力",
            longxing:"龙形",
            "longxing_info":"限定技，出牌阶段或当你处于濒死状态时，你可以丢弃你所有的牌和你判定区里的牌，并复原你的武将牌，失去所有技能，增加2点体力上限，然后摸6张牌且体力回复至5点。",
            aofa:"奥法",
            "aofa_info":"锁定技，你在回合结束阶段抽3张牌",
            yingzong:"影踪",
            "yingzong_info":"你每受到1次伤害，可获得一张闪",
            "离间":"离间",
            "离间_info":"出牌阶段，你可以弃一张牌，视为一名男性角色对另一名男性角色使用一张[决斗]，每阶段限一次",
            shihun:"噬魂",
            "shihun_info":"当你使用【杀】指定一名角色为目标后，你可令该角色弃置一张牌。",
            xukong:"虚空",
            "xukong_info":"出牌阶段限2次，你可以弃置一张黑色牌令一名角色流失一点体力",
            juntuan:"军团",
            "juntuan_info":"锁定技，1.你的手牌上限翻倍。2.游戏开始时，你摸5张牌",
            jianiang:"佳酿",
            "jianiang_info":"回合外，你可以将一张[酒]当[桃]使用",
            shiyao:"噬咬",
            "shiyao_info":"出牌阶段限1次，你可以弃置一张黑色牌令一名角色流失一点体力，并让自己回复一点体力",
            shunpi:"顺劈",
            "shunpi_info":"每当你的杀造成伤害时，你可以弃置一张手牌，然后对一名与目标距离不大于1的其他角色造成1点伤害",
            liemo:"猎魔",
            "liemo_info":"锁定技，你的红色杀无视距离；你的黑色杀可以额外指定一个目标",
            lieyan:"烈焰",
            "lieyan_info":"出牌阶段，你可以将任意两张相同花色的手牌当【炽羽袭】使用。",
            huofa:"火法",
            "huofa_info":"回合结束时，你可以获得一张流星火羽",
            buzui:"不醉",
            "buzui_info":"锁定技，你在回合结束时若已受伤，将一张酒置入你的手牌",
            lieqiang:"猎枪",
            "lieqiang_info":"锁定技，你的杀无视距离",
            leiguan:"雷管",
            "leiguan_info":"出牌阶段，你可以将你的任意一张♥或♦手牌当流星火羽使用。",
            zhuangdan:"装弹",
            "zhuangdan_info":"回合结束时，你可以获得一张杀",
            bengkui:"崩溃",
            "bengkui_info":"锁定技，你每受到1次伤害，视为使用一张惊雷闪",
            paoji:"炮击",
            "paoji_info":"准备阶段，你可以选择一名角色，若如此做，视为对其使用了一张[流星火羽]",
            langhun:"狼魂",
            "langhun_info":"锁定技，每当你杀死一名角色，你的体力上限+1，回复一点体力。",
            luanliu:"乱流",
            "luanliu_info":"锁定技，回合结束时，你进行一个额外的回合",
            zhefu:"蛰伏",
            "zhefu_info":"锁定技，游戏开始时，你将武将牌翻面",
            jingzhi:"静滞",
            "jingzhi_info":"结束阶段，你可以选择一名玩家，将其武将牌翻面",
            shachen:"沙尘",
            "shachen_info":"锁定技，你的手牌上限-2；摸牌阶段，你额外摸2张牌",
        },
    },
    intro:"",
    author:"SamLukeYes",
    diskURL:"",
    forumURL:"",
    version:"1.3.0",
},files:{"character":["onixia.jpg","itoki.jpg"],"card":[],"skill":[]}}};