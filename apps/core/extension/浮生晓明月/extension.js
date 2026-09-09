import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"浮生晓明月",content:function(config,pack){
    
},precontent:function(){
    
},help:{},config:{},package:{
    character:{
        character:{
            HUIzhaoxiang:["female","shu",3,["HUIfanghun","HUIfuhan"],[]],
            HUIhuangyueying:["female","shu",3,["HUIjizhi","HUIqicai"],[]],
            HUIhuanggai:["male","wu",4,["HUIkurou","HUIhengzhou"],[]],
            HUIchengong:["male","qun",3,["HUIzhichi","HUIlunhui"],[]],
            HUIhjhln:["male","shen",4,["HUImoqu","执意"],[]],
        },
        translate:{
            HUIzhaoxiang:"赵襄",
            HUIhuangyueying:"黄月英",
            HUIhuanggai:"黄盖",
            HUIchengong:"陈宫",
            HUIhjhln:"辉烬贺流年",
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
            HUIfanghun:{
                audio:"fanghun",
                init:function(player){
        player.storage.HUIfanghun=0;
    },
                intro:{
                    content:"mark",
                },
                trigger:{
                    source:"damageSource",
                    player:"damageEnd",
                },
                forced:true,
                content:function(){
        player.storage.HUIfanghun+=trigger.num;
        player.markSkill('HUIfanghun');
        
    },
                group:["HUIfanghun_sha","HUIfanghun_shan","HUIfanghun_draw"],
                subSkill:{
                    draw:{
                        trigger:{
                            player:["useCard","respond"],
                        },
                        forced:true,
                        popup:false,
                        filter:function(event){
                return event.skill=='HUIfanghun_sha'||event.skill=='HUIfanghun_shan';
            },
                        content:function(){
                player.draw();
            },
                        sub:true,
                    },
                    sha:{
                        name:"龙胆",
                        audio:"fanghun",
                        enable:["chooseToUse","chooseToRespond"],
                        filterCard:{
                            name:"shan",
                        },
                        viewAs:{
                            name:"sha",
                        },
                        viewAsFilter:function(player){
                if(!player.storage.HUIfanghun||player.storage.HUIfanghun<0) return false;
                if(!player.countCards('h','shan')) return false;
            },
                        prompt:"将一张闪当杀使用或打出",
                        onuse:function(result,player){
                player.storage.HUIfanghun--;
                if(!player.storage.HUIfanghun||player.storage.HUIfanghun<0){
                    player.storage.HUIfanghun=0;
                    player.unmarkSkill('fanghun');
                }
                else{
                    player.updateMarks();
                }
            },
                        check:function(){return 1},
                        ai:{
                            respondSha:true,
                            skillTagFilter:function(player){
                    if(!player.storage.HUIfanghun||player.storage.HUIfanghun<0) return false;
                    if(!player.countCards('h','shan')) return false;
                },
                            order:function(){
                    return get.order({name:'sha'})+0.1;
                },
                            useful:-1,
                            value:-1,
                            basic:{
                                useful:[5,1],
                                value:[5,1],
                            },
                            result:{
                                target:function(player,target,card,isLink){
                        if(!isLink&&player.hasSkill('jiu')&&!target.hasSkillTag('filterDamage',null,{
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
                        return -1.5;
                    },
                            },
                            tag:{
                                respond:1,
                                respondShan:1,
                                damage:function(card){
                        if(card.nature=='poison') return;
                        return 1;
                    },
                                natureDamage:function(card){
                        if(card.nature) return 1;
                    },
                                fireDamage:function(card,nature){
                        if(card.nature=='fire') return 1;
                    },
                                thunderDamage:function(card,nature){
                        if(card.nature=='thunder') return 1;
                    },
                                poisonDamage:function(card,nature){
                        if(card.nature=='poison') return 1;
                    },
                            },
                        },
                        sub:true,
                    },
                    shan:{
                        enable:["chooseToUse","chooseToRespond"],
                        name:"龙胆",
                        audio:"fanghun",
                        filterCard:{
                            name:"sha",
                        },
                        viewAs:{
                            name:"shan",
                        },
                        prompt:"将一张杀当闪使用或打出",
                        viewAsFilter:function(player){
                if(!player.storage.HUIfanghun||player.storage.HUIfanghun<0) return false;
                if(!player.countCards('h','sha')) return false;
            },
                        onrespond:function(result,player){
                player.storage.HUIfanghun--;
                if(!player.storage.HUIfanghun||player.storage.HUIfanghun<0){
                    player.storage.HUIfanghun=0;
                    
                    player.unmarkSkill('HUIfanghun');
                }
                else{
                    player.updateMarks();
                }
            },
                        onuse:function(result,player){
                player.storage.HUIfanghun--;
                if(!player.storage.HUIfanghun||player.storage.HUIfanghun<0){
                    player.storage.HUIfanghun=0;
                    player.unmarkSkill('fanghun');
                }
                else{
                    player.updateMarks();
                }
            },
                        check:function(){return 1},
                        ai:{
                            respondShan:true,
                            skillTagFilter:function(player){
                    if(!player.storage.HUIfanghun||player.storage.HUIfanghun<0) return false;
                    if(!player.countCards('h','sha')) return false;
                },
                            order:4,
                            useful:-1,
                            value:-1,
                            basic:{
                                useful:[7,2],
                                value:[7,2],
                            },
                            result:{
                                player:1,
                            },
                        },
                        sub:true,
                    },
                },
            },
            HUIfuhan:{
                audio:"fuhan",
                trigger:{
                    player:"phaseBegin",
                },
                unique:true,
                limited:true,
                skillAnimation:true,
                animationColor:"orange",
                forceunique:true,
                prompt:function(event,player){
        var numA=Math.max(0,player.storage.HUIfanghun||0);
        if(numA>6){
            numA=6
        }
        var numB=numA+player.maxHp;
        return get.prompt('HUIfuhan')+'（体力上限：'+numB+'）';
    },
                check:function(event,player){
        var num=Math.max(0,player.storage.HUIfanghun||0);
        if(num==1) return false;
        if(player.hp<=1) return true;
        if(num==2) return false;
        if(num==3) return player.hp<3&&player.isMinHp();
        return true;
    },
                content:function(){
        'step 0'
        if(player.storage.HUIfanghun) player.draw(player.storage.HUIfanghun);
        event.num=Math.max(0,player.storage.HUIfanghun||0);
        var list;
        if(_status.characterlist){
            list=[];
            for(var i=0;i<_status.characterlist.length;i++){
                var name=_status.characterlist[i];
                if(lib.character[name][1]=='shu') list.push(name);
            }
        }
        else if(_status.connectMode){
            list=get.charactersOL(function(i){
                return lib.character[i][1]!='shu';
            });
        }
        else{
            list=get.gainableCharacters(function(info){
                return info[1]=='shu';
            });
        }
        var players=game.players.concat(game.dead);
        for(var i=0;i<players.length;i++){
            list.remove(players[i].name);
            list.remove(players[i].name1);
            list.remove(players[i].name2);
        }
        // var dialog=ui.create.dialog();
        // dialog.add([list.randomGets(3),'character']);
        player.chooseButton(true).set('ai',function(button){
            return get.rank(button.link,true)-lib.character[button.link][2];
        }).set('createDialog',['将武将牌替换为一名角色',[list.randomGets(5),'character']]);
        
        'step 1'
        player.reinit('HUIzhaoxiang',result.links[0],false);
        if(_status.characterlist){
            _status.characterlist.add('HUIzhaoxiang');
            _status.characterlist.remove(result.links[0]);
        }
        'step 2'
        event.num=Math.max(0,player.storage.HUIfanghun||0);
        var A=event.num;
        if(A>6){
           A=6  
        }
        
         player.gainMaxHp(A);
        
        player.addSkill('HUIfanghun');
        
    },
                mark:true,
                intro:{
                    content:"limited",
                },
                init:function(player,skill){
        player.storage[skill]=false;
    },
            },
            HUIjizhi:{
                mod:{
                    targetInRange:function(card,player,target,now){
            var type=get.type(card);
            if(type=='trick'||type=='delay') return true;
        },
                },
                audio:"jizhi",
                trigger:{
                    player:["useCard"],
                },
                forced:true,
                content:function (){
        "step 0"
        var card1=game.createCard(trigger.card);
        if(get.type(card1)!='basic') {
        player.draw();
        }  
    },
            },
            HUIchangsheng:{
                trigger:{
                    player:["gainEnd","loseEnd"],
                },
                forced:true,
                filter:function(event,player){
        return player.countCards('h')!=4
    },
                content:function(){
        "step 0"
    if(player.countCards('h')<4){
        player.draw(4-player.countCards('h'));}
        "step 1"
    if(player.countCards('h')>4){
    var num1=player.countCards('h')-4;
        player.chooseToDiscard('h',num1,true)}
    },
            },
            HUIjiangjun:{
                mod:{
                    cardname:function(card,player,name){
            if(get.position(card)=='h'&&get.suit(card)=='diamond'&&get.type(card.name)!=='equip') return 'sha';
            
            if(get.position(card)=='h'&&get.suit(card)=='club'&&get.type(card.name)!=='equip') return 'sha';
            
            if(get.position(card)=='h'&&get.suit(card)=='heart'&&get.type(card.name)!=='equip') return 'tao';
            
            if(get.position(card)=='h'&&get.suit(card)=='spade'&&get.type(card.name)!=='equip') return 'jiu';
        },
                    cardnature:function(card,player){
            if(get.suit(card)=='diamond') return 'fire';
            if(get.suit(card)=='club') return 'thunder';
        },
                },
            },
            HUIqicai:{
                init:function (player){ 
        player.storage.HUIqicai=[]; 
    },
                trigger:{
                    player:"useCardEnd",
                },
                filter:function (event,player){ 
        if(!player.isPhaseUsing()) return false; 
        var type=get.type(event.card); 
        if(type=='delay') type='trick'; 
        return !player.storage.HUIqicai.contains(type); 
    },
                mark:true,
                marktext:"奇",
                intro:{
                    content:function (storage){ 
            if(!storage.length){ 
                return '本回合未使用过任何类型的牌'; 
            } 
            
            else{ 
                var str='本回合使用过的类型有：'+get.translation(storage[0]); 
                for(var i=1;i<storage.length;i++){ 
                    var temp=get.translation(storage[i]); 
                    if(storage[i]=='trick') temp='锦囊'; 
                    if(storage[i]=='equip') temp='装备';
                    if(storage[i]=='basic') temp='基本';
                    str+='、'+get.translation(storage[i]); 
                } 
                return str; 
            } 
        },
                },
                direct:true,
                content:function (){ 
        var type=get.type(trigger.card); 
        if(type=='delay') type='trick'; 
        player.storage.HUIqicai.push(type); 
        player.syncStorage('HUIqicai'); 
        player.markSkill('HUIqicai'); 
    },
                group:["HUIqicai_end"],
                subSkill:{
                    temp:{
                        sub:true,
                    },
                    end:{
                        "prompt2":function (event,player){ 
                if(player.storage.HUIqicai.length==1){ 
                    return '是否跳过弃牌阶段？'; 
                } 
                else if(player.storage.HUIqicai.length==3){ 
                    return '是否于本回合结束后进行一个额外的回合？'; 
                } 
            },
                        direct:true,
                        trigger:{
                            player:["phaseUseEnd","phaseBefore"],
                        },
                        filter:function (event,player){ 
                if(!player.storage.HUIqicai) return false; 
                return player.storage.HUIqicai.length!=0; 
            },
                        content:function(){ 
                "step 0" 
                if(trigger.name=='phaseUse'){ 
                    var str=''; 
                    if(player.storage.HUIqicai.length==3&&!player.hasSkill('HUIqicai_temp')){ 
                        str='是否于本回合结束后进行一个额外的回合？';             
                    } 
                    else if(player.storage.HUIqicai.length==1){ 
                        str='是否跳过弃牌阶段？'; 
                    } 
                    if(str!='') { 
                        player.chooseBool(get.prompt('HUIqicai'),str).set('ai',function(){ 
                            return true; 
                        }); 
                    } 
                    else event.goto(2); 
                } 
                else event.goto(2); 
                "step 1" 
                if(result.bool){ 
                    player.logSkill('HUIqicai'); 
                    if(player.storage.HUIqicai.length==1) { 
                        player.skip('phaseDiscard'); 
                    } 
                    else if(player.storage.HUIqicai.length==3&&!player.hasSkill('HUIqicai_temp')) { 
                        player.insertPhase(); 
                        player.addTempSkill('HUIqicai_temp','roundStart'); 
                    }     
                } 
                "step 2" 
                player.storage.HUIqicai=[]; 
                player.syncStorage('HUIqicai'); 
            },
                        sub:true,
                    },
                },
            },
            HUIkurou:{
                audio:"ext:浮生晓明月:2",
                enable:"phaseUse",
                prompt:"失去一点体力并摸两张牌",
                content:function(){
        "step 0"
        player.damage('fire');
        
    },
                ai:{
                    basic:{
                        order:1,
                    },
                    result:{
                        player:function(player){
                if(player.countCards('h')>=player.hp-1) return -1;
                if(player.hp<3) return -1;
                return 1;
            },
                    },
                },
                group:["HUIkurou_1"],
                subSkill:{
                    "1":{
                        audio:"kurou",
                        trigger:{
                            player:["damageEnd","loseHpEnd"],
                        },
                        filter:function (event,player){
                        return event.num>0;
                        },
                        forced:true,
                        content:function (){
                        "step 0"
                        event.num=trigger.num;
                        "step 1"
                        player.draw(2);
                         "step 2"
                         event.num--;
                         if(event.num>0){
                         event.goto(1);
                         }
                         else{
                         event.finish();
                         }
                        },
                        sub:true,
                    },
                },
            },
            HUIhengzhou:{
                trigger:{
                    player:"linkBegin",
                },
                forced:true,
                content:function(){
        player.recover()
    },
                ai:{
                    effect:{
                        target:function(card){
            if(card.name=='tiesuo') return 'zeroplayertarget';
            },
                    },
                },
            },
            HUIzhichi:{
                init:function (player){ 
    player.storage.HUIzhichi=0;
    game.addVideo('storage',player,['HUIzhichi',player.storage.HUIzhichi]);    
    },
                mark:true,
                marktext:"智",
                intro:{
                    name:"智迟",
                    "name2":"智",
                    content:"可以使用#张牌",
                },
                trigger:{
                    player:"phaseEnd",
                },
                frequent:true,
                filter:function(event,player){
        return player.countCards('he');
    },
                content:function(){
        'step 0'
        var max=1;
        var map={};
        var hs=player.getCards('he');
        for(var i=0;i<hs.length;i++){
            var type=get.type(hs[i],'trick');
            if(!map[type]){
                map[type]=1;
            }
            else{
                map[type]++;
                if(map[type]>max){
                    max=map[type];
                }
            }
        }
        player.draw(max);
        player.storage.HUIzhichi=max;
        player.syncStorage("HUIzhichi");
        'step 1'
        player.chooseToUse();
        'step 2'
        player.storage.HUIzhichi--;
        player.syncStorage("HUIzhichi");
        'step 3'
        if(player.storage.HUIzhichi>0){
          event.goto(1)  
        }
        else{
            event.finish();
        }
        
    },
                group:"HUIzhichi_1",
                subSkill:{
                    "1":{
                        mod:{
                            maxHandcard:function(player,num){
            return 2+num;
        },
                        },
                        trigger:{
                            player:["phaseUseBefore"],
                        },
                        forced:true,
                        content:function(){
        'step 0'
        player.storage.HUIzhichi=0;
        player.syncStorage("HUIzhichi");
         'step 1'
         trigger.cancel();
        
            },
                        sub:true,
                    },
                },
            },
            HUIlunhui:{
                trigger:{
                    global:"phaseBegin",
                },
                forced:true,
                forceDie:true,
                filter:function(event,player){
if(!player.storage.HUIlunhui){
player.storage.HUIlunhui=0;
}
if(player.isDead()){
player.storage.HUIlunhui++;
}
return player.isDead()&&player.storage.HUIlunhui>=5;
},
                content:function(){
player.revive(player.maxHp);
player.storage.HUIlunhui=0;
},
            },
            HUImoqu:{
                trigger:{
                    player:"changeHp",
                },
                priority:10,
                filter:function (event,player){
        return (ui.cardPile.childElementCount+ui.discardPile.childElementCount)>=2;
    },
                content:function (){
        "step 0"
        event.cards=get.cards(2);
        player.showCards(event.cards);
        "step 1"            
        if(get.color(event.cards[0])=='red'&&get.color(event.cards[1])=='red'){                        
            player.gain(event.cards,'gain2');                        
            game.delay();
        }
        
        if(get.color(event.cards[0])=='black'&&get.color(event.cards[1])=='black'){                        
            player.gain(event.cards,'gain2');                        
            game.delay();
        }
        
        if(get.color(event.cards[0])!=get.color(event.cards[1])){ 
            player.chooseDrawRecover();
            
        };
    },
            },
            "执意":{
                audio:"ext:浮生晓明月:2",
                trigger:{
                    player:["useCard","respond"],
                },
                forced:true,
                filter:function(event,player){
        if(get.type(event.card)=='equip') return false;
        if(get.type(event.card)=='delay') return false;
        var history=player.getHistory('useCard',function(evt){
            return get.type(evt.card)=='basic'||get.type(evt.card)=='trick';
        }).concat(player.getHistory('respond',function(evt){
            return get.type(evt.card)=='basic'||get.type(evt.card)=='trick';
        }));
        return history.length==1&&history[0]==event;
    },
                content:function(){
        'step 0'
        var info=get.info(trigger.card);
        if(!info||!info.enable) event._result={index:0};
        else{
            var evt=trigger;
            if(evt.respondTo&&evt.getParent('useCard').name=='useCard') evt=evt.getParent('useCard');
            event.evt=evt;
            player.chooseControl().set('prompt','执义：请选择一项').set('choiceList',[
                '摸一张牌',
                '于'+get.translation(evt.card)+'的使用结算结束之后视为使用一张'+get.translation({name:trigger.card.name,nature:trigger.card.nature,isCard:true}),
            ]).set('ai',function(){return _status.event.choice}).set('choice',function(){
                var card={name:trigger.card.name,nature:trigger.card.nature,isCard:true};
                if(card.name=='sha'){
                    if(player.getUseValue(card)>0) return 1;
                }
                else if(card.name=='tao'){
                    var hp=player.maxHp-player.hp;
                    if(trigger.targets.contains(player)) hp--;
                    return hp>0?1:0;
                }
                return 0;
            }());
        }
        'step 1'
        if(result.index==0){
            player.draw();
        }
        else{
            var next=player.chooseUseTarget({name:trigger.card.name,nature:trigger.card.nature},false,true);
            _status.event.next.remove(next);
            event.evt.after.push(next);
            next.logSkill='zhiyi';
        }
    },
            },
        },
        translate:{
            HUIfanghun:"芳魂",
            "HUIfanghun_info":"当你造成或受到伤害后，你获得X个“芳魂”标记（X为伤害点数）；你可以移去1个“芳魂”标记来发动〖龙胆〗并摸一张牌。",
            HUIfuhan:"扶汉",
            "HUIfuhan_info":"限定技，回合开始时，你可以移去所有“芳魂”标记，摸等量的牌，然后随机观看5位未登场的蜀势力角色，将武将牌替换为其中一名角色并增加等同于移去标记数的体力上限（以此法至多增加六点体力上限）",
            HUIjizhi:"集智",
            "HUIjizhi_info":"锁定技；你使用非基本牌后摸一张牌；你使用锦囊牌无距离限制。",
            HUIchangsheng:"常胜",
            "HUIchangsheng_info":"锁定技；你的手牌数固定为4",
            HUIjiangjun:"将军",
            "HUIjiangjun_info":"锁定技;<br>你的♦非装备牌均视为【火杀】<br> 你的♣非装备牌均视为【雷杀】<br> 你的♥非装备牌均视为【桃】<br> 你的♠非装备牌均视为【酒】",
            HUIqicai:"奇才",
            "HUIqicai_info":"出牌阶段结束，若你于此阶段仅使用了1种类型的牌，你可跳过弃牌阶段；若你于此阶段使用了基本牌、锦囊牌、装备牌每种至少1张，你可在此回合结束后进行1个额外的回合（每轮限1次）。",
            HUIkurou:"苦肉",
            "HUIkurou_info":"出牌阶段，你可以使自己受到一点火焰伤害<br>锁定技；每当你体力减少一点，你摸两张牌",
            HUIhengzhou:"横舟",
            "HUIhengzhou_info":"锁定技；当你被铁锁或解除铁锁时，回复一点体力",
            HUIzhichi:"智迟",
            "HUIzhichi_info":"你始终跳过出牌阶段且手牌上限+2<br>回合结束时，你可以摸X牌并使用至多X张牌(X为你拥有的牌中同类型数量最多的牌的数量)",
            HUIlunhui:"轮回",
            "HUIlunhui_info":"哔卟哔卟",
            HUImoqu:"魔躯",
            "HUImoqu_info":"锁定技；当你体力值发生变动时，展示牌堆顶两张牌，若颜色不同则你恢复一点体力或摸一张牌，颜色相同则你获得之",
            "执意":"执意",
            "执意_info":"锁定技，当你于一回合内使用或打出第一张基本牌或普通锦囊牌时，你选择一项：1.摸一张牌。2.于此牌A（若此牌是因响应牌B而使用或打出的，则改为牌B）的使用或打出流程结算完成后，视为使用一张与此牌名称和属性相同的卡牌。",
        },
    },
    intro:"",
    author:"无名玩家",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["HUIhjhln.jpg"],"card":[],"skill":[]}}};