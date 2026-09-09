import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"不灭钻石",content:function (config,pack){
    
},precontent:function (){
    
},help:{},config:{},package:{
    character:{
        character:{
            anjieluo:["male","shen",4,["AQUA NECKLACE","AQUA NECKLACE_pohuai","yini"],["boss","bossallowed","des:片桐安十郎，男，罪犯。高智商反社会人格，心理变态，行为疯狂。可以很好地掩饰自己的性格。人很狡猾，有胆量，有耐心，有计划，能把握住机会。1964年出生于杜王町。IQ160。「日本犯罪史上最恶的杀人鬼」。 自12岁起就不断因为犯罪而过着牢狱生涯 （12岁时因强盗、强奸入狱，之后也多次入狱，呆在狱里的时间共20年。1994年时遇见3名14岁少年，在奸杀了其中2名少年之后绑架勒索另一名少年，这名少年被他用残忍的方式杀害）。本来因为强奸杀人罪被判死刑，但在牢房里被虹村形兆用「箭」射中并得到了替身能力，后来逃狱并来到杜王町继续犯案 。因为受到东方仗助的阻碍而对他起杀机，并以替身能力杀死了仗助的祖父，但最后还是被仗助和空条承太郎逮到，被盛怒之下的仗助用替身能力打入一块岩石中并于岩石合为一体，求生不能求死不得，成为杜王町名胜之一的「安杰罗岩」 。"]],
            dongfangzhangzhu:["male","shen",6,["fengzuan","nuhufa","dula"],[]],
            hongcunyitai:["male","shen",6,["kongxiao","congming"],["des:虹村形兆的弟弟，因为父亲于12年前被迪奥移植的肉芽变成了怪物（第三部的时间线），所以兄弟俩儿想利用【弓箭】寻找强大的替身使者，助父亲脱离痛苦。最初与哥哥一起行动，因康一误闯宅邸而袭击康一，并攻击想救康一的仗助，后来当自己遭到哥哥的替身所伤时被仗助相救的行为所感动，于是反过来帮仗助脱离了险境。后来解除了误会，两人成为了朋友，可是哥哥却被突然出现的神秘人所杀，【弓箭】也被夺走。后来在仗助等人的帮助下曾一度得到亲手杀死音石明替身“辛红辣椒”的绝佳机会，最终打败杀害哥哥的神秘人——音石明。 去东尼欧·托拉萨迪的餐馆试吃意大利料理时经常做出一惊一乍的剧烈反应（尽管实际情况都是自身的疑难杂症得到治愈而已）。 与东方仗助一同发现了前往岸边露伴家的康一的异常，并进入岸边露伴家营救康一，但被岸边露伴用替身能力俘获，险些自焚，最后被仗助所救。 与东方仗助、矢安宫重清（胖重）共分500万日元奖金，因胖重想独吞奖金，导致三人发生分歧，最终与仗助一起击败胖重。 在仗助得知广濑康一和空条承太郎在百足鞋店陷入苦战后，与仗助一起前往支援。尽管仗助用计识破了假装路人的吉良吉影，然而还是被吉良吉影逃脱。 在与吉良吉影对战过程中被其重伤，虽被仗助的替身【疯狂钻石】治疗却还是陷入昏迷，在千钧一发之际醒来解救了仗助，称在陷入昏迷的过程中看见了自己的哥哥，是他给予了自己勇气。"]],
        },
        translate:{
            anjieluo:"安杰罗",
            dongfangzhangzhu:"东方仗助",
            hongcunyitai:"虹村亿泰",
        },
    },
    card:{
        card:{
            zhengyizhixin:{
                audio:true,
                type:"equip",
                subtype:"equip5",
                nomod:true,
                nopower:true,
                unique:true,
                skills:["zhengyizhixin_skill"],
                enable:true,
                selectTarget:-1,
                filterTarget:function (card,player,target){
        return target==player;
    },
                modTarget:true,
                allowMultiple:false,
                content:function (){
        if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
    },
                toself:true,
                fullskin:true,
            },
        },
        translate:{
            zhengyizhixin:"正义之心",
            "zhengyizhixin_info":"锁定技，你区域内的和判定的♠️牌视为♥️牌，♣️牌视为♦️牌。",
        },
        list:[["heart","13","zhengyizhixin"],["heart","13","zhengyizhixin"],["heart","13","zhengyizhixin"],["heart","13","zhengyizhixin"],["heart","13","zhengyizhixin"],["heart","13","zhengyizhixin"],["heart","13","zhengyizhixin"],["heart","13","zhengyizhixin"],["heart","13","zhengyizhixin"],["heart","13","zhengyizhixin"],["heart","13","zhengyizhixin"],["heart","13","zhengyizhixin"]],
    },
    skill:{
        skill:{
            "AQUA NECKLACE":{
                audio:"ext:不灭钻石:2",
                trigger:{
                    global:"phaseZhunbeiBegin",
                },
                direct:true,
                filter:function (event,player){
        if(!game.hasPlayer(function(current){
            return current.hasSkill('AQUA NECKLACE_mark');
        })) return true;
        return player.countCards('he')>=1&&game.hasPlayer(function(current){
            return current!=player&&!current.hasSkill('AQUA NECKLACE_mark');
        });
    },
                content:function (){
        'step 0'
        if(game.hasPlayer(function(current){
            return current.hasSkill('AQUA NECKLACE_mark');
        })) event.goto(2);
        else player.chooseTarget(lib.filter.notMe,get.prompt('AQUA NECKLACE'),'令『AQUA NECKLACE』侵入一名其他角色。').set('ai',function(target){
            var player=_status.event.player;
            var att=-get.attitude(player,target);
            return att*target.countCards('h');
        });
        'step 1'
        if(result.bool){
            var target=result.targets[0];
            player.logSkill('AQUA NECKLACE',target);
            target.addSkill('AQUA NECKLACE_mark');
        }
        event.finish();
        'step 2'
        var list=game.filterPlayer(function(current){
            return current.hasSkill('AQUA NECKLACE_mark');
        });
        player.chooseCardTarget({
            prompt:get.prompt('AQUA NECKLACE'),
            prompt2:('弃置一张牌并将'+get.translation(list)+'体内的『AQUA NECKLACE』转移给其他角色'),
            position:'he',
            filterTarget:function(card,player,target){
                return player!=target&&!target.hasSkill('AQUA NECKLACE_mark');
            },
            filterCard:lib.filter.cardDiscardable,
            ai1:function(card){
                if(_status.event.goon) return 5-get.value(card);
                return 0;
            },
            ai2:function(target){
                var player=_status.event.player;
                var att=-get.attitude(player,target);
                return att*target.countCards('h');
            },
            goon:function(target){
                var att=-get.attitude(player,target);
                return att*target.countCards('h')<=0;
            }(list[0]),
        });
        'step 3'
        if(result.bool){
            var target=result.targets[0];
            player.logSkill('AQUA NECKLACE');
            player.discard(result.cards).delay=false;
            player.line2(game.filterPlayer(function(current){
                if(current.hasSkill('AQUA NECKLACE_mark')){
                    current.removeSkill('AQUA NECKLACE_mark');
                    return true;
                }
            }).concat(result.targets),'green');
            target.addSkill('AQUA NECKLACE_mark');
        }
        else event.finish();
        'step 4'
        game.delayx();
    },
                ai:{
                    threaten:8,
                },
            },
            "AQUA NECKLACE_pohuai":{
                audio:"ext:不灭钻石:2",
                trigger:{
                    global:"phaseJieshuBegin",
                },
                direct:true,
                filter:function (event,player){
        return game.hasPlayer(function(current){
            return current!=player&&current.hasSkill('AQUA NECKLACE_mark')&&current.getHistory('lose',function(evt){
                return evt.cards2&&evt.cards2.length>0;
            }).length>0;
        });
    },
                content:function (){
        'step 0'
        player.chooseTarget(get.prompt('AQUA NECKLACE_pohuai'),'对一名本回合失去过牌的其他角色造成1点伤害',function(card,player,target){
            return _status.event.targets.contains(target);
        }).set('targets',game.filterPlayer(function(current){
            return current!=player&&current.hasSkill('AQUA NECKLACE_mark')&&current.getHistory('lose',function(evt){
                return evt.cards2&&evt.cards2.length>0;
            }).length>0;
        })).set('ai',function(target){
            var player=_status.event.player;
            return get.damageEffect(target,player,player);
        });
        'step 1'
        if(result.bool){
            var target=result.targets[0];
            player.logSkill('AQUA NECKLACE_pohuai',target);
            target.damage();
        }
    },
            },
            "AQUA NECKLACE_mark":{
                marktext:"水",
                mark:true,
                intro:{
                    name:"<font color=#ff0033>已被『AQUA NECKLACE』入侵</font>",
                    content:"",
                },
                locked:true,
            },
            zhuidi:{
                audio:"ext:不灭钻石:2",
                trigger:{
                    player:"useCard2",
                },
                forced:true,
                filter:function (event,player){
        return player.isPhaseUsing();
    },
                content:function (){},
                mod:{
                    globalFrom:function (from,to,distance){
            if(_status.currentPhase==from){
                return distance-from.countUsed();
            }
        },
                },
                ai:{
                    unequip:true,
                },
            },
            yini:{
                audio:"ext:不灭钻石:2",
                trigger:{
                    player:"loseAfter",
                },
                frequent:true,
                init:function (player){
        player.storage.yinni=0;
    },
                filter:function (event,player){
        return player!=_status.currentPhase;
    },
                content:function (){
        player.storage.yinni++;
        player.markSkill('yinni');
    },
                intro:{
                    content:"mark",
                },
                group:"yinni2",
                ai:{
                    unequip:true,
                },
            },
            "yinni2":{
                trigger:{
                    player:"phaseBegin",
                },
                forced:true,
                filter:function (event,player){
        return player.storage.yinni>0;
    },
                content:function (){
        player.draw(player.storage.yinni);
        player.storage.yinni=0;
        player.unmarkSkill('yinni');
    },
                mod:{
                    globalTo:function (from,to,distance){
            if(typeof to.storage.yinni=='number') 
                return distance+to.storage.yinni;
        },
                },
            },
            fengzuan:{
                audio:"ext:不灭钻石:2",
                enable:"phaseUse",
                position:"he",
                filterCard:true,
                selectCard:[1,Infinity],
                check:function (card){
        return 9-get.value(card)
    },
                prompt:"弃置任意张牌并令一名其他角色回复等量体力",
                filterTarget:function (card,player,target){
        if(target.hp>=target.maxHp) return false;
        return target!=player&&!target.hasSkill("fengzuan_air");
        return true;
    },
                filter:function (event,player){
        return !player.hasSkill('fengzuan_air');
    },
                content:function (){
        'step 0'
        target.recover(cards.length);
        target.link(false);
        target.turnOver(false);
        target.addTempSkill("fengzuan_air");
        'step 1'
        if(target.maxHp-target.hp>0){
            event.finish();
        }
        else{
            player.draw(cards.length);
            player.addTempSkill("fengzuan_air");
        }
    },
                subSkill:{
                    air:{
                        sub:true,
                    },
                },
                ai:{
                    order:9,
                    result:{
                        target:function (player,target){
                if(target.hp==1) return 5;
                if(player==target&&player.countCards('h')>player.hp) return 5;
                return 2;
            },
                    },
                    threaten:2,
                },
            },
            niufentou:{
                trigger:{
                    source:"damageBegin",
                },
                limited:true,
                skillAnimation:"epic",
                animationColor:"thunder",
                forced:true,
                logTarget:"player",
                filter:function (event,player){
        return event.player.hasSkill('nuhufa');
    },
                content:function (){
        trigger.num++;
        player.awakenSkill(event.name);
        player.storage.niufentou=true;
        player.addMark("weixian");
    },
                init:function (player,skill){
        player.storage[skill]=false;
    },
                mark:true,
                intro:{
                    content:"limited",
                },
            },
            nuhufa:{
                audio:"ext:不灭钻石:2",
                group:"hufanu",
                trigger:{
                    global:"gameDrawAfter",
                },
                derivation:["niufentou"],
                forced:true,
                content:function (){
        game.countPlayer(function(current){
            if(current!=player&&player.getEnemies().contains(current)){
                player.line(current,'yellow');
                current.addSkill('niufentou');
            }
        });
    },
            },
            hufanu:{
                audio:"ext:不灭钻石:2",
                trigger:{
                    player:"damageEnd",
                },
                limited:true,
                skillAnimation:"epic",
                animationColor:"thunder",
                logTarget:"source",
                filter:function (event,player){
        return event.source.storage.niufentou;
    },
                forced:true,
                content:function (){
         'step 0'
        player.awakenSkill(event.name);
        player.storage[event.name]=true;
        player.draw(player.maxHp);
        player.discard(player.getCards('j'));
        'step 1'
        while(_status.event.name!='phaseLoop'){
            _status.event=_status.event.parent;
        }
        game.resetSkills();
        _status.paused=false;
        _status.event.player=player;
        _status.event.step=0;
        player.storage.hufajuli_juli=trigger.source;
        player.addTempSkill('hufajuli_juli',{player:"phaseJieshuBegin"});
    },
                init:function (player,skill){
        player.storage[skill]=false;
    },
                mark:true,
                intro:{
                    content:"limited",
                },
            },
            weixian:{
                marktext:"<font color=#ff0033>危</font>",
                mark:true,
                intro:{
                    name:"<font color=#ff0033>危</font>",
                    content:"<font color=#ff0033>你惊扰了东方仗助</font>",
                },
                locked:true,
            },
            "hufajuli_juli":{
                mark:"character",
                onremove:true,
                intro:{
                    content:"到$的距离视为1",
                },
                mod:{
                    globalFrom:function (from,to){
            if(to==from.storage.hufajuli_juli)
                return -Infinity;
        },
                },
            },
            dula:{
                audio:"ext:不灭钻石:2",
                shaRelated:true,
                trigger:{
                    player:"useCardToPlayered",
                },
                frequent:true,
                logTarget:"target",
                check:function (event,player){
        return get.attitude(player,event.target)<=0;
    },
                filter:function (event,player){
        return event.card.name=='sha';
    },
                content:function (){
        "step 0"
        player.judge(function(card){
            if(get.zhu(_status.event.player,'dula')){
                if(get.suit(card)!='spade') return 2;
            }
            else{
                if(get.color(card)=='red') return 2;
            }
            return -0.5;
        });
        "step 1"
        if(result.bool){
            player.draw();
            var next=player.chooseToUse({name:'sha'},'是否对'+get.translation(trigger.target)+'使用一张杀',trigger.target,-1);
        next.logSkill='dula';
        }
    },
                ai:{
                    "directHit_ai":true,
                    skillTagFilter:function (player,tag,arg){
            if(get.attitude(player,arg.target)>0||arg.card.name!='sha'||!ui.cardPile.firstChild||get.color(ui.cardPile.firstChild,player)!='red') return false;
        },
                },
            },
            "zhengyizhixin_skill":{
                forced:true,
                mod:{
                    suit:function (card,suit){
        if(suit=='spade') return 'heart';
        if(suit=='club') return 'diamond';
        },
                },
            },
            kongxiao:{
                enable:"phaseUse",
                usable:"1",
                position:"he",
                filterTarget:function (card,player,target){
        return target!=player&&get.distance(player,target)>1;
    },
                content:function (){
        'step 0'
        player.storage.kongxiao_ju=target;
        player.addTempSkill('kongxiao_ju');
        player.addTempSkill('kongxiao2');
        player.choosePlayerCard(target,'he',
            [1,Math.min(target.countCards('he'),target.hp)],get.prompt('kongxiao',target));
        'step 1'
        if(result.bool&&result.links.length){
            player.logSkill('kongxiao',target);
            if(target.storage.kongxiao3){
                target.storage.kongxiao3=target.storage.kongxiao3.concat(result.links);
            }
            else{
                target.storage.kongxiao3=result.links.slice(0);
            }
            game.addVideo('storage',target,['kongxiao3',get.cardsInfo(target.storage.kongxiao3),'cards']);
            target.addSkill('kongxiao3');
            target.lose(result.links,ui.special,'toStorage');
        }
    },
                check:function (card){
        if(card.name=='sha'&&_status.event.player.countCards('h','sha')<=1) return 0;
        return 6-get.value(card);
    },
                filterCard:true,
                ai:{
                    order:11,
                    result:{
                        target:-1,
                    },
                },
            },
            "kongxiao_ju":{
                mark:"character",
                onremove:true,
                intro:{
                    content:"到$的距离视为1",
                },
                mod:{
                    globalFrom:function (from,to){
            if(to==from.storage.kongxiao_ju){
                return -Infinity;
            }
        },
                },
            },
            "kongxiao3":{
                trigger:{
                    global:"phaseEnd",
                },
                forced:true,
                audio:"ext:不灭钻石:false",
                mark:true,
                intro:{
                    content:"cardCount",
                    onunmark:function (storage,player){
            if(storage&&storage.length){
                player.$throw(storage,1000);
                game.cardsDiscard(storage);
                game.log(storage,'被置入了弃牌堆');
             storage.length=0;
            }
        },
                },
                content:function (){
        if(player.storage.kongxiao3){
            player.gain(player.storage.kongxiao3,'fromStorage');
            delete player.storage.kongxiao3;
        }
        player.removeSkill('kongxiao3');
    },
            },
            "kongxiao2":{
                enable:"phaseUse",
                usable:"1",
                position:"he",
                filterTarget:function (card,player,target){
        return target!=player&&get.distance(player,target)>1;
    },
                content:function (){
        'step 0'
        player.storage.kongxiao2_ju=target;
        player.addTempSkill('kongxiao2_ju');
        player.addTempSkill('kongxiao4');
        player.choosePlayerCard(target,'he',
            [1,Math.min(target.countCards('he'),target.hp)],get.prompt('kongxiao2',target));
        'step 1'
        if(result.bool&&result.links.length){
            player.logSkill('kongxiao2',target);
            if(target.storage.kongxiao3){
                target.storage.kongxiao3=target.storage.kongxiao3.concat(result.links);
            }
            else{
                target.storage.kongxiao3=result.links.slice(0);
            }
            game.addVideo('storage',target,['kongxiao3',get.cardsInfo(target.storage.kongxiao3),'cards']);
            target.addSkill('kongxiao3');
            target.lose(result.links,ui.special,'toStorage');
        }
    },
                check:function (card){
        if(card.name=='sha'&&_status.event.player.countCards('h','sha')<=1) return 0;
        return 6-get.value(card);
    },
                filterCard:true,
                ai:{
                    order:11,
                    result:{
                        target:-1,
                    },
                },
            },
            "kongxiao2_ju":{
                mark:"character",
                onremove:true,
                intro:{
                    content:"到$的距离视为1",
                },
                mod:{
                    globalFrom:function (from,to){
            if(to==from.storage.kongxiao2_ju){
                return -Infinity;
            }
        },
                },
            },
            "kongxiao4":{
                enable:"phaseUse",
                usable:"1",
                position:"he",
                filterTarget:function (card,player,target){
        return target!=player&&get.distance(player,target)>1;
    },
                content:function (){
        'step 0'
        player.storage.kongxiao4_ju=target;
        player.addTempSkill('kongxiao4_ju');
        player.addTempSkill('kongxiao5');
        player.choosePlayerCard(target,'he',
            [1,Math.min(target.countCards('he'),target.hp)],get.prompt('kongxiao4',target));
        'step 1'
        if(result.bool&&result.links.length){
            player.logSkill('kongxiao4',target);
            if(target.storage.kongxiao3){
                target.storage.kongxiao3=target.storage.kongxiao3.concat(result.links);
            }
            else{
                target.storage.kongxiao3=result.links.slice(0);
            }
            game.addVideo('storage',target,['kongxiao3',get.cardsInfo(target.storage.kongxiao3),'cards']);
            target.addSkill('kongxiao3');
            target.lose(result.links,ui.special,'toStorage');
        }
    },
                check:function (card){
        if(card.name=='sha'&&_status.event.player.countCards('h','sha')<=1) return 0;
        return 6-get.value(card);
    },
                filterCard:true,
                ai:{
                    order:11,
                    result:{
                        target:-1,
                    },
                },
            },
            "kongxiao4_ju":{
                mark:"character",
                onremove:true,
                intro:{
                    content:"到$的距离视为1",
                },
                mod:{
                    globalFrom:function (from,to){
            if(to==from.storage.kongxiao4_ju){
                return -Infinity;
            }
        },
                },
            },
            "kongxiao5":{
                enable:"phaseUse",
                usable:"1",
                position:"he",
                filterTarget:function (card,player,target){
        return target!=player&&get.distance(player,target)>1;
    },
                content:function (){
        'step 0'
        player.storage.kongxiao5_ju=target;
        player.addTempSkill('kongxiao5_ju');
        player.addTempSkill('kongxiao6');
        player.choosePlayerCard(target,'he',
            [1,Math.min(target.countCards('he'),target.hp)],get.prompt('kongxiao5',target));
        'step 1'
        if(result.bool&&result.links.length){
            player.logSkill('kongxiao5',target);
            if(target.storage.kongxiao3){
                target.storage.kongxiao3=target.storage.kongxiao3.concat(result.links);
            }
            else{
                target.storage.kongxiao3=result.links.slice(0);
            }
            game.addVideo('storage',target,['kongxiao3',get.cardsInfo(target.storage.kongxiao3),'cards']);
            target.addSkill('kongxiao3');
            target.lose(result.links,ui.special,'toStorage');
        }
    },
                check:function (card){
        if(card.name=='sha'&&_status.event.player.countCards('h','sha')<=1) return 0;
        return 6-get.value(card);
    },
                filterCard:true,
                ai:{
                    order:11,
                    result:{
                        target:-1,
                    },
                },
            },
            "kongxiao5_ju":{
                mark:"character",
                onremove:true,
                intro:{
                    content:"到$的距离视为1",
                },
                mod:{
                    globalFrom:function (from,to){
            if(to==from.storage.kongxiao5_ju){
                return -Infinity;
            }
        },
                },
            },
            "kongxiao6":{
                enable:"phaseUse",
                usable:"1",
                position:"he",
                filterTarget:function (card,player,target){
        return target!=player&&get.distance(player,target)>1;
    },
                content:function (){
        'step 0'
        player.storage.kongxiao6_ju=target;
        player.addTempSkill('kongxiao6_ju');
        player.addTempSkill('kongxiao7');
        player.choosePlayerCard(target,'he',
            [1,Math.min(target.countCards('he'),target.hp)],get.prompt('kongxiao6',target));
        'step 1'
        if(result.bool&&result.links.length){
            player.logSkill('kongxiao6',target);
            if(target.storage.kongxiao3){
                target.storage.kongxiao3=target.storage.kongxiao3.concat(result.links);
            }
            else{
                target.storage.kongxiao3=result.links.slice(0);
            }
            game.addVideo('storage',target,['kongxiao3',get.cardsInfo(target.storage.kongxiao3),'cards']);
            target.addSkill('kongxiao3');
            target.lose(result.links,ui.special,'toStorage');
        }
    },
                check:function (card){
        if(card.name=='sha'&&_status.event.player.countCards('h','sha')<=1) return 0;
        return 6-get.value(card);
    },
                filterCard:true,
                ai:{
                    order:11,
                    result:{
                        target:-1,
                    },
                },
            },
            "kongxiao6_ju":{
                mark:"character",
                onremove:true,
                intro:{
                    content:"到$的距离视为1",
                },
                mod:{
                    globalFrom:function (from,to){
            if(to==from.storage.kongxiao6_ju){
                return -Infinity;
            }
        },
                },
            },
            "kongxiao7":{
                enable:"phaseUse",
                usable:"1",
                position:"he",
                filterTarget:function (card,player,target){
        return target!=player&&get.distance(player,target)>1;
    },
                content:function (){
        'step 0'
        player.storage.kongxiao7_ju=target;
        player.addTempSkill('kongxiao7_ju');
        player.addTempSkill('kongxiao8');
        player.choosePlayerCard(target,'he',
            [1,Math.min(target.countCards('he'),target.hp)],get.prompt('kongxiao7',target));
        'step 1'
        if(result.bool&&result.links.length){
            player.logSkill('kongxiao7',target);
            if(target.storage.kongxiao3){
                target.storage.kongxiao3=target.storage.kongxiao3.concat(result.links);
            }
            else{
                target.storage.kongxiao3=result.links.slice(0);
            }
            game.addVideo('storage',target,['kongxiao3',get.cardsInfo(target.storage.kongxiao3),'cards']);
            target.addSkill('kongxiao3');
            target.lose(result.links,ui.special,'toStorage');
        }
    },
                check:function (card){
        if(card.name=='sha'&&_status.event.player.countCards('h','sha')<=1) return 0;
        return 6-get.value(card);
    },
                filterCard:true,
                ai:{
                    order:11,
                    result:{
                        target:-1,
                    },
                },
            },
            "kongxiao7_ju":{
                mark:"character",
                onremove:true,
                intro:{
                    content:"到$的距离视为1",
                },
                mod:{
                    globalFrom:function (from,to){
            if(to==from.storage.kongxiao7_ju){
                return -Infinity;
            }
        },
                },
            },
            "kongxiao8":{
                enable:"phaseUse",
                usable:"1",
                position:"he",
                filterTarget:function (card,player,target){
        return target!=player&&get.distance(player,target)>1;
    },
                content:function (){
        'step 0'
        player.storage.kongxiao8_ju=target;
        player.addTempSkill('kongxiao8_ju');
        player.choosePlayerCard(target,'he',
            [1,Math.min(target.countCards('he'),target.hp)],get.prompt('kongxiao8',target));
        'step 1'
        if(result.bool&&result.links.length){
            player.logSkill('kongxiao8',target);
            if(target.storage.kongxiao3){
                target.storage.kongxiao3=target.storage.kongxiao3.concat(result.links);
            }
            else{
                target.storage.kongxiao3=result.links.slice(0);
            }
            game.addVideo('storage',target,['kongxiao3',get.cardsInfo(target.storage.kongxiao3),'cards']);
            target.addSkill('kongxiao3');
            target.lose(result.links,ui.special,'toStorage');
        }
    },
                check:function (card){
        if(card.name=='sha'&&_status.event.player.countCards('h','sha')<=1) return 0;
        return 6-get.value(card);
    },
                filterCard:true,
                ai:{
                    order:11,
                    result:{
                        target:-1,
                    },
                },
            },
            "kongxiao8_ju":{
                mark:"character",
                onremove:true,
                intro:{
                    content:"到$的距离视为1",
                },
                mod:{
                    globalFrom:function (from,to){
            if(to==from.storage.kongxiao8_ju){
                return -Infinity;
            }
        },
                },
            },
            congming:{
                trigger:{
                    player:"useCard",
                },
                direct:true,
                filter:function (event,player){
        if(event.card.name!='sha') return false;
        if(event.targets.length!=1) return false;
        if(!player.countCards('he')) return false;
        var target=event.targets[0];
        return game.hasPlayer(function(current){
            return player!=current&&target!=current&&get.distance(player,current)<=1;
        });
    },
                content:function (){
        "step 0"
        event.targets=game.filterPlayer(function(current){
            var target=trigger.targets[0];
            return player!=current&&target!=current&&get.distance(player,current)<=1;
        });
        var num=0;
        for(var i=0;i<event.targets.length;i++){
            num+=get.effect(event.targets[i],{name:'sha'},player,player);
        }
        var next=player.chooseToDiscard(get.prompt('congming',event.targets),'he');
        next.logSkill=['congming',event.targets];
        next.ai=function(card){
            if(num<=0) return -1;
            return 7-get.value(card);
        }
        "step 1"
        if(result.bool){
            for(var i=0;i<targets.length;i++){
                trigger.targets.add(targets[i]);
                // targets[i].classList.add('selected');
            }
            player.draw();
        }
    },
            },
        },
        translate:{
            "AQUA NECKLACE":"水链",
            "AQUA NECKLACE_info":"所有角色的准备阶段，若场上无人被『AQUA NECKLACE』入侵，你可以让『AQUA NECKLACE』入侵一名其他角色；若有被入侵的其他角色，你可以弃置一张牌并转移『AQUA NECKLACE』。",
            "AQUA NECKLACE_pohuai":"破坏",
            "AQUA NECKLACE_pohuai_info":"所有角色的结束阶段，你可以对一名被入侵且本回合内失去过牌的其他角色造成1点伤害。",
            "AQUA NECKLACE_mark":"水链",
            "AQUA NECKLACE_mark_info":"",
            zhuidi:"寻敌",
            "zhuidi_info":"锁定技，当你于回合内使用一张牌时，其他角色对你的距离-1。",
            yini:"隐匿",
            "yini_info":"锁定技，每当你与回合外失去牌时，你可以令你的防御距离+1；准备阶段，你将累计的防御距离清零，然后摸等量的牌。",
            "yinni2":"隐匿",
            "yinni2_info":"",
            fengzuan:"疯钻",
            "fengzuan_info":"出牌阶段，你可以弃置任意张手牌然后令一名其他角色回复等量的体力并复原武将牌；若其因此回复了全部已损体力，你摸等量的牌然后本回合此技能失效。",
            niufentou:"挑衅",
            "niufentou_info":"限定技，锁定技，当你于出牌阶段对东方仗助造成伤害时，你可以嘲讽他的发型并令此伤害+1，然后你的回合会被结束。",
            nuhufa:"护发",
            "nuhufa_info":"锁定技，游戏开始时，你令敌方角色获得技能〖挑衅〗；<br>限定技，当你受到一名角色造成的伤害时，若其有且已发动〖挑衅〗，你摸体力上限的牌，弃置判定区的牌并立即开始你的回合，在此回合内，你计算与其的距离视为1。",
            hufanu:"护发",
            "hufanu_info":"",
            weixian:"危",
            "weixian_info":"",
            "hufajuli_juli":"护发",
            "hufajuli_juli_info":"",
            dula:"嘟啦",
            "dula_info":"当你使用【杀】指定目标时，你可以进行判定，若为红色你摸一张牌并可以继续对其使用一张【杀】。",
            "zhengyizhixin_skill":"正义之心",
            "zhengyizhixin_skill_info":"锁定技，你区域内的和判定的♠️牌视为♥️牌，♣️牌视为♦️牌。",
            kongxiao:"空消",
            "kongxiao_info":"出牌阶段限七次，你可以弃置一张牌并选择一个距离你不为1的角色，将其区域内至多X张牌移出游戏至回合结束，且此回合你计算与其的距离视为一。（X为其体力值）",
            "kongxiao_ju":"空消",
            "kongxiao_ju_info":"",
            "kongxiao3":"空消",
            "kongxiao3_info":"",
            "kongxiao2":"空消",
            "kongxiao2_info":"",
            "kongxiao2_ju":"空消",
            "kongxiao2_ju_info":"",
            "kongxiao4":"空消",
            "kongxiao4_info":"",
            "kongxiao4_ju":"空消",
            "kongxiao4_ju_info":"",
            "kongxiao5":"空消",
            "kongxiao5_info":"",
            "kongxiao5_ju":"空消",
            "kongxiao5_ju_info":"",
            "kongxiao6":"空消",
            "kongxiao6_info":"",
            "kongxiao6_ju":"空消",
            "kongxiao6_ju_info":"",
            "kongxiao7":"空消",
            "kongxiao7_info":"",
            "kongxiao7_ju":"空消",
            "kongxiao7_ju_info":"",
            "kongxiao8":"空消",
            "kongxiao8_info":"",
            "kongxiao8_ju":"空消",
            "kongxiao8_ju_info":"",
            congming:"聪明",
            "congming_info":"每当你使用一张杀，你可以重铸一张牌，令距离你1以内的所有角色成为额外目标。",
        },
    },
    intro:"<font color=#ff0033>萌新的作品ฅฅ*，以后会逐渐出完jo4全部替身使者<br>大佬勿喷〃∀〃</font><img style=width:238px src=file:///storage/emulated/0/Android/data/yuri.nakamura.noname/extension/不灭钻石/title.jpg>",
    author:"<font color=#ff0033>Al₂O₃·3H₂Oฅฅ*</font>",
    diskURL:"",
    forumURL:"",
    version:"v0.3测试先行版",
},files:{"character":["hongcunyitai.jpg"],"card":["zhengyizhixin.png"],"skill":[]}}};