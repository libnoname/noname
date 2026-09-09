import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"极限觉醒",content:function (config,pack){
    
},precontent:function (){
    
},help:{},config:{},package:{
    character:{
        character:{
            "极●赵云":["male","shu",2,["破阵","绝险","                ","               ","      ","青缸"],[]],
            "极●张飞":["male","shu",4,["paoxiao","武进","威喝","          "],[]],
            "极●诸葛亮":["male","shu",3,["识破","制弩","静心","续命"],[]],
            "极●张角":["male","qun",3,["诡道","医道","雷击","危卦"],[]],
            "极●许褚":["male","wei",4,["xinqiangxi","  ","死魂","归魂"],[]],
            "极●关羽":["male","shu",4,["傲气","回马","wusheng"," ","   "],[]],
            "极●夏侯恩":["male","wei",4,["青缸","护剑","      "],[]],
            "极●关平张苞":["male","shu",4,["承继","蜀佑"],[]],
            "极●曹操":["male","wei",4,["枭雄","雄变","霸业"],[]],
            "极●孙坚":["male","wu",4,["英势","危进","险行","yinghun"],[]],
        },
        translate:{
            "极●赵云":"极●赵云",
            "极●张飞":"极●张飞",
            "极●诸葛亮":"极●诸葛亮",
            "极●张角":"极●张角",
            "极●许褚":"极●许褚",
            "极●关羽":"极●关羽",
            "极●夏侯恩":"极●夏侯恩",
            "极●关平张苞":"极●关平张苞",
            "极●曹操":"极●曹操",
            "极●孙坚":"极●孙坚",
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
            "龙魂":{
                trigger:{
                    player:["useCard","respond"],
                },
                filter:function (event,player){
        return event.card.name=='shan'||event.card.name=='sha';
    },
                content:function (){
        player.draw();
    },
            },
            "武进":{
                trigger:{
                    source:["damageEnd"],
                },
                content:function (){
        "step 0"
         trigger.cancel();
        "step 2"
        if(trigger.player.countCards('he')){
            player.discardPlayerCard(trigger.player,'he',true);
        }
    },
            },
            "护主":{
                trigger:{
                    global:["damageBefore"],
                },
                content:function (){
        "step 0"
        player.loseHp(1);
        "step 2"
        trigger.cancel();
    },
            },
            "承继":{
                trigger:{
                    player:["phaseBegin"],
                },
                filter:function (event,player){
        return player.countCards('he')>=2;
    },
                content:function (){
        player.addTempSkill('paoxiao','phaseAfter');
        player.addTempSkill ('wusheng','phaseAfter');
    },
            },
            "陨命":{
                audio:"ext:极限觉醒:4",
                forbid:["boss"],
                trigger:{
                    player:"damageBegin",
                },
                forced:true,
                filter:function (event){
        return event.source&&event.source.isIn();
    },
                content:function (){
        trigger.source.clearSkills();
    },
                logTarget:"source",
            },
            "绝才":{
                audio:"ext:极限觉醒:2",
                audioname:["sunce"],
                trigger:{
                    player:"phaseDrawBegin",
                },
                forced:true,
                content:function (){
        trigger.num=4;
    },
                ai:{
                    threaten:1.5,
                },
                mod:{
                    maxHandcard:function (player,num){
            player.maxHandcard=4;
        },
                },
            },
            "诡道":{
                audio:"ext:极限觉醒:2",
                trigger:{
                    global:"judge",
                },
                filter:function (event,player){
        return player.countCards('he',{color:'black'||'red'})>0;
    },
                direct:true,
                content:function (){
        "step 0"
        player.chooseCard(get.translation(trigger.player)+'的'+(trigger.judgestr||'')+'判定为'+
        get.translation(trigger.player.judging[0])+'，'+get.prompt('guidao'),'he',function(card){
            return get.color(card)=='black'||'red';
        }).set('ai',function(card){
            var trigger=_status.event.getTrigger();
            var player=_status.event.player;
            var judging=_status.event.judging;
            var result=trigger.judge(card)-trigger.judge(judging);
            var attitude=get.attitude(player,trigger.player);
            if(attitude==0||result==0) return 0;
            if(attitude>0){
                return result;
            }
            else{
                return -result;
            }
        }).set('judging',trigger.player.judging[0]);
        "step 1"
        if(result.bool){
            player.respond(result.cards,'highlight');
        }
        else{
            event.finish();
        }
        "step 2"
        if(result.bool){
            player.logSkill('guidao');
            player.$gain2(trigger.player.judging[0]);
            player.gain(trigger.player.judging[0]);
            trigger.player.judging[0]=result.cards[0];
            if(!get.owner(result.cards[0],'judge')){
                trigger.position.appendChild(result.cards[0]);
            }
            game.log(trigger.player,'的判定牌改为',result.cards[0]);
        }
        "step 3"
        game.delay(2);
    },
                ai:{
                    tag:{
                        rejudge:1,
                    },
                },
            },
            "医道":{
                audio:"ext:极限觉醒:2",
                enable:"chooseToUse",
                filter:function (event,player){
        return _status.currentPhase!=player;
    },
                filterCard:function (card){
        return get.color(card)=='black';
    },
                position:"he",
                viewAs:{
                    name:"tao",
                    suit:"spade",
                    number:2,
                    cards:[{"node":{"image":{},"info":{},"name":{},"name2":{},"background":{},"intro":{},"range":{}},"storage":{},"vanishtag":[],"_uncheck":[],"suit":"spade","number":2,"name":"bagua","cardid":"7749522257","_transform":"translateX(112px)","clone":{"name":"bagua","suit":"spade","number":2,"node":{"name":{},"info":{},"intro":{},"background":{},"image":{}},"_transitionEnded":true,"timeout":387},"timeout":376,"original":"h"}],
                },
                prompt:"将一张黑色牌当桃使用",
                check:function (card){return 15-get.value(card)},
                ai:{
                    skillTagFilter:function (player){
            return player.countCards('he',{color:'red'})>0&&_status.currentPhase!=player;
        },
                    threaten:1.5,
                    save:true,
                    respondTao:true,
                    basic:{
                        order:function (card,player){
                if(player.hasSkillTag('pretao')) return 5;
                return 2;
            },
                        useful:[8,6.5,5,4],
                        value:[8,6.5,5,4],
                    },
                    result:{
                        target:function (player,target){
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
            "雷击":{
                audio:"ext:极限觉醒:2",
                audioname:["boss_qinglong"],
                trigger:{
                    player:"respond",
                },
                filter:function (event,player){
        return event.card.name=='shan';
    },
                direct:true,
                content:function (){
        "step 0";
        player.chooseTarget(get.prompt('releiji')).ai=function(target){
            if(target.hasSkill('hongyan')) return 0;
            return get.damageEffect(target,_status.event.player,_status.event.player,'thunder');
        };
        "step 1"
        if(result.bool){
            player.logSkill('releiji',result.targets,'thunder');
            event.target=result.targets[0];
            event.target.judge(function(card){
                var suit=get.suit(card);
                if(suit=='spade') return -4;
                if(suit=='club') return -2;
                return 0;
            });
        }
        else{
            event.finish();
        }
        "step 2"
        if(result.suit=='club'){
            event.target.damage('thunder');
            player.recover();
        }
        else if(result.suit=='spade'){
            event.target.damage(2,'thunder');
        }
    },
                ai:{
                    useShan:true,
                    effect:{
                        target:function (card,player,target,current){
                if(get.tag(card,'respondShan')){
                    var hastarget=game.hasPlayer(function(current){
                        return get.attitude(target,current)<0;
                    });
                    var be=target.countCards('e',{color:'black'});
                    if(target.countCards('h','shan')&&be){
                        if(!target.hasSkill('guidao')) return 0;
                        return [0,hastarget?target.countCards('he')/2:0];
                    }
                    if(target.countCards('h','shan')&&target.countCards('h')>2){
                        if(!target.hasSkill('guidao')) return 0;
                        return [0,hastarget?target.countCards('h')/4:0];
                    }
                    if(target.countCards('h')>3||(be&&target.countCards('h')>=2)){
                        return [0,0];
                    }
                    if(target.countCards('h')==0){
                        return [1.5,0];
                    }
                    if(target.countCards('h')==1&&!be){
                        return [1.2,0];
                    }
                    if(!target.hasSkill('guidao')) return [1,0.05];
                    return [1,Math.min(0.5,(target.countCards('h')+be)/4)];
                }
            },
                    },
                },
            },
            "雷道":{
                audio:"ext:极限觉醒:2",
                trigger:{
                    player:"damageBefore",
                },
                filter:function (event){
        return event.nature=='thunder';
    },
                forced:true,
                content:function (){
        trigger.cancel();
    },
                ai:{
                    nofire:true,
                    effect:{
                        target:function (card,player,target,current){
                if(get.tag(card,'thunderDamage')) return 0;
            },
                    },
                },
            },
            "识破":{
                audio:"ext:极限觉醒:2",
                enable:"chooseToUse",
                filterCard:function (card){
        return get.color(card)=='black';
    },
                viewAsFilter:function (player){
        return player.countCards('he',{color:'black'})>0;
    },
                viewAs:{
                    name:"wuxie",
                    suit:"club",
                    number:9,
                    cards:[{"node":{"image":{},"info":{},"name":{},"name2":{},"background":{},"intro":{},"range":{}},"storage":{},"vanishtag":[],"_uncheck":[],"suit":"club","number":9,"name":"jiu","cardid":"2211578270","_transform":"translateX(0px)","clone":{"name":"jiu","suit":"club","number":9,"node":{"name":{},"info":{},"intro":{},"background":{},"image":{}},"_transitionEnded":true,"timeout":597},"timeout":576,"original":"h"}],
                },
                position:"he",
                prompt:"将一张黑色手牌当无懈可击使用",
                check:function (card){return 8-get.value(card)},
                threaten:1.2,
                ai:{
                    basic:{
                        useful:[6,4],
                        value:[6,4],
                    },
                    result:{
                        player:1,
                    },
                    expose:0.2,
                },
            },
            "强戟":{
                audio:"qiangxi",
                enable:"phaseUse",
                filter:function (event,player){
        if(player.hasSkill('xinqiangxi2')){
            return !player.hasSkill('xinqiangxi3');
        }
        else if(player.hasSkill('xinqiangxi3')){
            return !player.hasSkill('xinqiangxi2')&&player.countCards('he',{type:'equip'})>0;
        }
        else{
            return true;
        }
    },
                filterCard:function (card){
        var player=_status.event.player;
        if(player.hasSkill('xinqiangxi2')) return false;
        return get.type(card)=='equip';
    },
                selectCard:function (){
        var player=_status.event.player;
        if(player.hasSkill('xinqiangxi2')) return -1;
        if(player.hasSkill('xinqiangxi3')) return [1,1];
        return [0,1];
    },
                filterTarget:function (card,player,target){
        if(player==target) return false;
        return get.distance(player,target,'attack')<=1;
    },
                content:function (){
        "step 0"
        if(cards.length==0){
            player.loseHp(Math.floor(player.Hp/2));
            player.addTempSkill('xinqiangxi3');
        }
        else{
            player.addTempSkill('xinqiangxi2');
        }
        "step 1"
        target.damage();
    },
                check:function (card){
        return 10-get.value(card);
    },
                position:"he",
                ai:{
                    order:8.5,
                    result:{
                        target:function (player,target){
                if(player.hasSkill('xinqiangxi2')||!player.countCards('he',{type:'equip'})){
                    if(player.hp<2) return 0;
                    if(target.hp>=player.hp) return 0;
                }
                return get.damageEffect(target,player);
            },
                    },
                },
                threaten:1.5,
            },
            "回马":{
                trigger:{
                    player:"phaseEnd",
                },
                direct:true,
                content:function (){
        "step 0"
        player.chooseTarget(get.prompt('回马'),function(card,player,target){
            return lib.filter.targetEnabled({name:'sha'},player,target);
        }).set('ai',function(target){
            return get.effect(target,{name:'sha'},_status.event.player);
        });
        "step 1"
        if(result.bool){
            player.logSkill('回马');
            player.useCard({name:'sha'},result.targets,false);
        }
    },
                ai:{
                    threaten:function (player,target){
            return 1.6;
        },
                },
            },
            "傲气":{
                trigger:{
                    target:"shaBefore",
                },
                forced:true,
                priority:6,
                audio:"ext:极限觉醒:true",
                filter:function (event,player){
        if(event.player.hasSkillTag('unequip',false,{
            name:event.card?event.card.name:null,
            target:player,
            card:event.card
        })) return false;
        return (event.card.name=='sha'&&get.color(event.card)=='red')
    },
                content:function (){
        trigger.cancel();
    },
                ai:{
                    effect:{
                        target:function (card,player){
                if(player.hasSkillTag('unequip',false,{
                    name:card?card.name:null,
                    target:player,
                    card:card
                })) return;
                if(card.name=='sha'&&get.color(card)=='red') return 'zerotarget';
            },
                    },
                },
            },
            "归魂":{
                audio:"ext:极限觉醒:2",
                trigger:{
                    player:"damageBefore",
                },
                filter:function (event){
    return event.nature=='thunder'||event.nature=='fire';
    },
                forced:true,
                content:function (){
        player.die();
    },
            },
            " ":{
                trigger:{
                    player:"useCardToBefore",
                },
                forced:true,
                filter:function (event,player){
    return event.card&&event.card.name=='sha'&&get.color(event.card)=='red';
    },
                content:function (){
        trigger.card.nature='fire'; 
    },
            },
            "  ":{
                trigger:{
                    global:["gameDrawAfter"],
                },
                forced:true,
                content:function (){
        player.loseHp(Math.floor(player.Hp/2));
    },
            },
            "死魂":{
            },
            "   ":{
                trigger:{
                    source:"damageBegin",
                },
                filter:function (event){
        return event.card&&event.card.name=='sha'&&get.color(event.card)=='red'&&event.notLink();
    },
                forced:true,
                content:function (){
        trigger.num++;
    },
            },
            "青缸":{
                ai:{
                    unequip:true,
                    forced:true,
                    skillTagFilter:function (player,tag,arg){
            if(arg&&arg.name=='sha') return true;
            return false;
        },
                },
            },
            "护剑":{
                audio:"ext:极限觉醒:4",
                trigger:{
                    player:"loseEnd",
                },
                filter:function (event,player){
        for(var i=0;i<event.cards.length;i++){
            if(event.cards[i].original=='e') return true;
        }
        return false;
    },
                content:function (){
        "step 0"
        if(get.itemtype(trigger.cards)=='cards'&&get.position(trigger.cards[0])=='d'){
            player.chooseControl('增加一点体力上限','恢复一点体力','cancel2').set('prompt',get.prompt('护剑')).ai=function(){
                var trigger=_status.event.getTrigger();
                if(trigger.cards.length==1&&trigger.cards[0].name=='sha') return 0;
                return 1;
            };
        }
        else{
            player.chooseControl('恢复一点体力','cancel2').set('prompt',get.prompt('护剑'));
        }
        "step 1"
        if(result.control=='增加一点体力上限'){
            player.logSkill('护剑');
            player.gainMaxHp();
        }
        else if(result.control=='恢复一点体力'){
            player.logSkill('护剑');
            player.recover();
        }
    },
                ai:{
                    noe:true,
                    reverseEquip:true,
                    effect:{
                        target:function (card,player,target,current){
                if(get.type(card)=='equip') return [1,3];
            },
                    },
                },
            },
            "霸业":{
                trigger:{
                    player:["damageEnd"],
                },
                forced:true,
                content:function (){
        player.gainMaxHp();
    },
            },
            "枭雄":{
                trigger:{
                    global:["damageEnd"],
                },
                content:function (){
        player.draw();
    },
            },
            "雄变":{
                trigger:{
                    player:["phaseBegin"],
                },
                filter:function (event,player){
        return player.countCards('h')>=Math.floor(game.players.length/2);;
    },
                content:function (){
        "step 0"
        player.chooseToDiscard(Math.floor(game.players.length/2));
        "step 1"
        player.addTempSkill('rende','phaseAfter');
        player.addTempSkill ('zhiheng','phaseAfter');          
    },
            },
            "险境":{
                audio:"ext:极限觉醒:2",
                trigger:{
                    player:"damageEnd",
                },
                direct:true,
                filter:function (event,player){
        return (event.source&&event.source.countGainableC0,ards(player,'he')&&event.num>0&&event.source!=player);
    
    },
                content:function (){
        player.discardPlayerCard([1,trigger.num],get.prompt('险途',trigger.source),trigger.source,get.buttonValue,'he').set('logSkill',['险途',trigger.source]);
    },
                ai:{
                    "maixie_defend":true,
                    effect:{
                        target:function (card,player,target){
                if(player.countCards('he')>1&&get.tag(card,'damage')){
                    if(player.hasSkillTag('jueqing',false,target)) return [1,-1.5];
                    if(get.attitude(target,player)<0) return [1,1];
                }
            },
                    },
                },
            },
            "险行":{
                audio:"ext:极限觉醒:2",
                enable:"chooseToUse",
                filterCard:function (card){
        return get.color(card)=='black';
    },
                viewAs:{
                    name:"jiu",
                    color:"black",
                    number:9,
                    cards:[{"node":{"image":{},"info":{},"name":{},"name2":{},"background":{},"intro":{},"range":{}},"storage":{},"vanishtag":[],"_uncheck":[],"suit":"spade","number":9,"name":"jiu","cardid":"1040196249","_transform":"translateX(510px)","clone":{"name":"jiu","suit":"spade","number":9,"node":{"name":{},"info":{},"intro":{},"background":{},"image":{}},"_transitionEnded":true,"fixed":true,"timeout":107},"timeout":100,"original":"h"}],
                    suit:"spade",
                },
                viewAsFilter:function (player){
        if(!player.countCards('he',{color:'black'})) return false;
    },
                prompt:"将一张黑桃手牌当酒使用",
                check:function (card){
        if(_status.event.type=='dying') return 1;
        return 4-get.value(card);
    },
                ai:{
                    skillTagFilter:function (player){
            return player.countCards('h',{color:'black'})>0&&player.hp<=0;
        },
                    threaten:1.5,
                    save:true,
                    basic:{
                        useful:function (card,i){
                if(_status.event.player.hp>1){
                    if(i==0) return 4;
                    return 1;
                }
                if(i==0) return 7.3;
                return 3;
            },
                        value:function (card,player,i){
                if(player.hp>1){
                    if(i==0) return 5;
                    return 1;
                }
                if(i==0) return 7.3;
                return 3;
            },
                    },
                    order:function (){
            return get.order({name:'sha'})+0.2;
        },
                    result:{
                        target:function (player,target){
                if(target&&target.isDying()) return 2;
                if(lib.config.mode=='stone'&&!player.isMin()){
                    if(player.getActCount()+1>=player.actcount) return 0;
                }
                var shas=player.getCards('h','sha');
                if(shas.length>1&&player.getCardUsable('sha')>1){
                    return 0;
                }
                var card;
                if(shas.length){
                    for(var i=0;i<shas.length;i++){
                        if(lib.filter.filterCard(shas[i],target)){
                            card=shas[i];break;
                        }
                    }
                }
                else if(player.hasSha()&&player.needsToDiscard()){
                    if(player.countCards('h','hufu')!=1){
                        card={name:'sha'};
                    }
                }
                if(card){
                    if(game.hasPlayer(function(current){
                        return (get.attitude(target,current)<0&&
                            target.canUse(card,current,true,true)&&
                            !current.getEquip('baiyin')&&
                            get.effect(current,card,target)>0);
                    })){
                        return 1;
                    }
                }
                return 0;
            },
                    },
                    tag:{
                        save:1,
                    },
                },
            },
            "危进":{
                mod:{
                    cardEnabled:function (card,player){
            if(card.name=='tao'&&_status.event.skill!='危进') return false;
        },
                    cardUsable:function (card,player){
            if(card.name=='tao'&&_status.event.skill!='危进') return false;
        },
                    cardRespondable:function (card,player){
            if(card.name=='tao'&&_status.event.skill!='危进') return false;
        },
                    cardSavable:function (card,player){
            if(card.name=='tao'&&_status.event.skill!='危进') return false;
        },
                },
                enable:["chooseToUse","chooseToRespond"],
                filter:function (event,player){
        return player.countCards('h','tao')>0;
    },
                filterCard:{
                    name:"tao",
                },
                viewAs:{
                    name:"sha",
                },
                viewAsFilter:function (player){
        if(!player.countCards('h','tao')) return false;
    },
                check:function (){return 1},
                ai:{
                    skillTagFilter:function (player){
            if(!player.countCards('h','tao')) return false;
        },
                    respondSha:true,
                    order:4,
                    useful:-1,
                    value:-1,
                    basic:{
                        useful:[5,1],
                        value:[5,1],
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
            "英势":{
                audio:"ext:极限觉醒:2",
                audioname:["sunce"],
                trigger:{
                    player:"phaseDrawBegin",
                },
                forced:true,
                content:function (){
        trigger.num++;

    },
                ai:{
                    threaten:1.5,
                },
                mod:{
                    maxHandcard:function (player,num){
            trigger.num=3;
        },
                },
            },
            "威喝":{
                audio:"ext:极限觉醒:2",
                trigger:{
                    player:"shaBegin",
                },
                check:function (event,player){
        return get.attitude(player,event.target)<0;
    },
                logTarget:"target",
                content:function (){
        "step 0"
        
        if(!trigger.target.hasSkill('fengyin')){
            trigger.target.addTempSkill('fengyin');
 
        }
    },
            },
            "          ":{
                trigger:{
                    target:"shaBefore",
                },
                forced:true,
                priority:6,
                audio:"ext:极限觉醒:true",
                filter:function (event,player){
        if(event.player.hasSkillTag('unequip',false,{
            name:event.card?event.card.name:null,
            target:player,
            card:event.card
        })) return false;
        return (event.card.name=='sha'&&get.color(event.card)=='black')
    },
                content:function (){
        trigger.cancel();
    },
                ai:{
                    effect:{
                        target:function (card,player){
                if(player.hasSkillTag('unequip',false,{
                    name:card?card.name:null,
                    target:player,
                    card:card
                })) return;
                if(card.name=='sha'&&get.color(card)=='black') return 'zerotarget';
            },
                    },
                },
            },
            "危卦":{
                audio:"ext:极限觉醒:2",
                inherit:"bagua_skill",
                filter:function (event,player){  
        if(player.hp!==1) return false;
        if(!lib.skill.bagua_skill.filter(event,player)) return false;
        if(player.getEquip(2)) return false;
        return true;
    },
                ai:{
                    effect:{
                        target:function (card,player,target){
                if(player==target&&get.subtype(card)=='equip2'){
                    if(get.equipValue(card)<=7.5) return 0;
                }
                if(target.getEquip(2)) return;
                return lib.skill.bagua_skill.ai.effect.target.apply(this,arguments);
            },
                    },
                },
                trigger:{
                    player:"chooseToRespondBegin",
                },
                check:function (event,player){
        if(get.damageEffect(player,event.player,player)>=0) return false;
        return true;
    },
                content:function (){
        "step 0"
        player.judge('bagua',function(card){return (get.color(card)=='red')?1.5:-0.5});
        "step 1"
        if(result.judge>0){
            trigger.untrigger();
            trigger.responded=true;
            trigger.result={bool:true,card:{name:'shan'}}
        }
    },
            },
            "蜀佑":{
                trigger:{
                    player:["damageEnd"],
                },
                filter:function (event,player){
        return player.countCards('h')==0;
    },
                forced:true,
                content:function (){
        player.recover();
    },
            },
            "制弩":{
                trigger:{
                    player:["damageEnd"],
                },
                filter:function (event,player){
    return target.countCards('h')>1;
    },
                content:function (){
        "step 0"
        player.chooseToDiscard(); 
        "step 1"
        if(result.bool){
        var card=get.cardPile('zhuge','field');
        if(card){
            player.gain(card,'gain2','log');
        }else{
        event.finish();
        }
        
        
            
        
        }
     
    },
            },
            "静心":{
                trigger:{
                    player:["damageBefore"],
                },
                filter:function (event,player){
        return player.countCards('h')==0;
    },
                forced:true,
                content:function (){
        trigger.cancel();
    },
            },
            "      ":{
                audio:"ext:极限觉醒:2",
                trigger:{
                    player:"shaBegin",
                },
                check:function (event,player){
        return get.attitude(player,event.target)<0;
    },
                logTarget:"target",
                forced:true,
                content:function (){
        "step 0"
        
        if(!trigger.target.hasSkill('fengyin')){
            trigger.target.addTempSkill('fengyin');
 
        }
    },
            },
            "续命":{
                trigger:{
                    player:"dying",
                },
                priority:6,
                audio:"ext:极限觉醒:2",
                filter:function (event,player){
        return event.player.hp<=0&&event.player.countCards('h')>0;
    },
                direct:true,
                content:function (){
        "step 0"
        var check;
        if(trigger.player.isUnderControl(true,player)){
            check=player.hasCard(function(card){
                return get.type(card)!='basic';
            });
        }
        else{
            check=(get.attitude(player,trigger.player)>0);
        }
        player.choosePlayerCard(trigger.player,get.prompt('续命',trigger.player),'h').set('ai',function(button){
            if(!_status.event.check) return 0;
            if(_status.event.target.isUnderControl(true,_status.event.player)){
                if(get.type(button.link)!='basic'){
                    return 10-get.value(button.link);
                }
                return 0;
            }
            else{
                return Math.random();
            }
        }).set('check',check).set('filterButton',function(button){
            if(_status.event.player==_status.event.target){
                return lib.filter.cardDiscardable(button.link,_status.event.player);
            }
            return true;
        });
        "step 1"
        if(result.bool){
            player.logSkill('buyi',trigger.player);
            event.card=result.links[0];
            player.showCards([event.card],get.translation(player)+'展示的手牌');
        }
        else{
            event.finish();
        }
        "step 2"
        if(get.type(event.card)!='basic'){
            trigger.player.recover();
            trigger.player.discard(event.card);
        }
    },
                ai:{
                    threaten:1.4,
                },
            },
            "破阵":{
                trigger:{
                    source:["damageEnd"],
                },
                content:function (){
        "step 0"
         trigger.cancel();
        "step 2"
        if(trigger.player.countCards('he')){
            player.discardPlayerCard(trigger.player,'he',true);
        }
    },
            },
            "               ":{
                trigger:{
                    source:["damageEnd"],
                },
                forced:true,
                content:function (){
        player.draw();
    },
            },
            "绝险":{
                trigger:{
                    player:["damageEnd"],
                },
                forced:true,
                content:function (){
        player.recover();
    },
            },
            "                ":{
                trigger:{
                    player:["damageBefore"],
                },
                filter:function (event,player){
        return player.countCards('h')==0;
    },
                forced:true,
                content:function (){
        trigger.cancel();
    },
            },
            "龙魄":{
                audio:"ext:极限觉醒:2",
                audioname:["sunce"],
                trigger:{
                    player:"phaseDrawBegin",
                },
                forced:true,
                content:function (){
        player.draw(2);

    },
            },
        },
        translate:{
            "龙魂":"龙魂",
            "龙魂_info":"每当你使用或打出一张【杀】或【闪】，你可以摸一张牌",
            "武进":"武进",
            "武进_info":"你每造成一次伤害，可以弃其一张手牌或装备牌",
            "护主":"护主",
            "护主_info":"每当一名其他角色受到一次伤害时，你可以失去一点体力防止此伤害",
            "承继":"承继",
            "承继_info":"回合开始时，若你的装备区数+手牌数≥2，则本回合你获得【武圣】【咆哮】到回合结束",
            "陨命":"陨命",
            "陨命_info":"锁定技，对你造成伤害的角色失去当前的所有技能直到游戏结束。",
            "绝才":"绝才",
            "绝才_info":"锁定技，摸牌阶段摸牌时，你可以摸4张牌；你的手牌上限为4，不会随着体力减少而降低。",
            "诡道":"诡道",
            "诡道_info":"【通过此技能改判时打出一张【闪】也可以触发【雷击】技能】任意一名角色的判定生效前，你可以打出一张任意牌替换之。",
            "医道":"医道",
            "医道_info":"回合外，你可以将一张黑色牌当[桃]使用",
            "雷击":"雷击",
            "雷击_info":"每当你使用或打出一张【闪】，可令任意一名角色进行一次判定，若结果为梅花，其受到一点雷电伤害，然后你回复一点体力；若结果为黑桃，其受到两点雷电伤。",
            "雷道":"雷道",
            "雷道_info":"锁定技，当你受到雷属性伤害时，你防止此伤害",
            "识破":"识破",
            "识破_info":"你可以将一张黑色装备牌或手牌当【无懈可击】使用。",
            "强戟":"强戟",
            "强戟_info":"【若你首次发动本技能第一项，你失去所有体力并进入死魂状态】出牌阶段各限一次，你可以选择一项：1. 失去一点体力并对你攻击范围内的一名其他角色造成一点伤害；2. 弃置一张装备牌并对你攻击范围内的一名其他角色造成一点伤害 。【死魂状态】:自身不会因为受到伤害而死亡，且弃牌阶段你只用弃一张牌",
            "回马":"回马",
            "回马_info":"回合结束阶段，你可以视为对任意一个目标使用一张无视距离的杀",
            "傲气":"傲气",
            "傲气_info":"锁定技，红色的【杀】对你无效，且你的红色【杀】伤害+1，你任意一张红色的【杀】都附带火焰效果",
            "归魂":"归魂",
            "归魂_info":"锁定技，当你受到属性伤害时，你会因为归魂而死亡",
            " ":" ",
            " _info":"",
            "  ":"  ",
            "  _info":"",
            "死魂":"死魂",
            "死魂_info":"锁定技，游戏开始阶段，你失去所有体力并进入死魂状态，【死魂状态】你受到任何非属性伤害不会死亡，弃牌阶段你必须且只用弃一张牌",
            "   ":"   ",
            "   _info":"",
            "青缸":"青缸",
            "青缸_info":"锁定技，每当你使用【杀】指定一名目标角色后，你无视其防具和并封印其所有非锁定技直到回合结束。",
            "护剑":"护剑",
            "护剑_info":"每当你的装备区失去一张牌时，你可以选择增加一点体力上限或者恢复一点体力。",
            "霸业":"霸业",
            "霸业_info":"锁定技，每当你受到一次伤害后，你增加一点体力上限",
            "枭雄":"枭雄",
            "枭雄_info":"场上每有一名角色受到一次伤害，你可以摸一张牌",
            "雄变":"雄变",
            "雄变_info":"回合开始阶段，你可以弃×张牌，然后获得【仁德】和【制衡】直到本回合结束，×为当前存活角色数量的一半(向下取整数)",
            "险境":"险境",
            "险境_info":"每当你受到一点伤害后，你可以弃置伤害来源的一张牌。",
            "险行":"险行",
            "险行_info":"你可将你的任意一张黑色手牌当【酒】使用。",
            "危进":"危进",
            "危进_info":"锁定技，你的【桃】均视为【杀】，你无法使用桃",
            "英势":"英势",
            "英势_info":"锁定技，摸牌阶段你隔外摸一张牌。弃牌阶段你必须且只用弃一张牌。",
            "威喝":"威喝",
            "威喝_info":"当你使用【杀】指定一名角色为目标后，你可以令该角色的非锁定技失效直到回合结束。锁定技，黑色的杀对你无效。",
            "          ":"          ",
            "          _info":"",
            "危卦":"危卦",
            "危卦_info":"当你体力为1且没装备防具时，始终视为你装备【八卦阵】。",
            "蜀佑":"蜀佑",
            "蜀佑_info":"锁定技，若你没有手牌，你每受到一次伤害恢复一点体力。",
            "制弩":"制弩",
            "制弩_info":"每当你受到一次伤害，你可以弃一张牌然后从【场上】【弃牌堆】【牌堆】中获得一张【诸葛连弩】",
            "静心":"静心",
            "静心_info":"锁定技，每当你受到一次伤害时，若你没有手牌，你免疫此伤害",
            "      ":"      ",
            "      _info":"",
            "续命":"续命",
            "续命_info":"当你进入频死状态时，你可以展示一张手牌：若此牌不为基本牌，则你弃掉这张牌并回复1点体力。",
            "破阵":"破阵",
            "破阵_info":"你每造成一次伤害，可以弃其一张手牌。锁定技，你每造成一次伤害，你摸一张牌。",
            "               ":"               ",
            "               _info":"",
            "绝险":"绝险",
            "绝险_info":"锁定技，你每受到一次伤害: 若你有手牌，你恢复一点体力;若你没有手牌，你免疫本次伤害。",
            "                ":"                ",
            "                _info":"",
            "龙魄":"龙魄",
            "龙魄_info":"锁定技，摸牌阶段你隔外摸两张牌。",
        },
    },
    intro:"萌新制作，可能有bug(ฅ>ω<*ฅ)",
    author:"(ಡωಡ)",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["极●孙坚.jpg"],"card":[],"skill":[]}}};