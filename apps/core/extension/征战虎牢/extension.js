import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"征战虎牢",content:function(config,pack){
    
},precontent:function(){
			 
},help:{},config:{},package:{
    character:{
        character:{
            "boss_lvbu4":["male","shen",27,["mashu","wushuang","boss_baguan","boss_zhanjia","boss_xvli"],["boss","forbidai","bossallowed"]],
            "boss_lvbu5":["male","shen",12,["wushuang","boss_zhankai","boss_shenji","boss_yangwu"],["forbidai"]],
            "hulaoguan_lijue":["male","qun","6/8",["xinfu_langxi","xinfu_yisuan","hulaoguan_mojun"],["forbidai"]],
            "hulaoguan_guosi":["male","qun",6,["xinfu_tanbei","xinfu_sidao","hulaoguan_mojun"],["forbidai"]],
            "hulaoguan_fanchou":["male","qun",6,["hulaoguan_fangong","hulaoguan_mojun"],["forbidai"]],
            "hulaoguan_zhangji":["male","qun",6,["hulaoguan_jielue","hulaoguan_mojun"],["forbidai"]],
            "hulaoguan_huaxiong":["male","qun",10,["hulaoguan_moqu","hulaoguan_yaowu","hulaoguan_mojun"],["forbidai"]],
            "hulaoguan_caoxing":["male","qun",8,["cxliushi","zhanwan"],["forbidai"]],
            "hulaoguan_chengong":["male","qun",7,["hulaoguan_shence","zhichi"],["forbidai"]],
            "hulaoguan_gaoshun":["male","qun",8,["mashu","hulaoguan_sizhen","hulaoguan_juejiu"],["forbidai"]],
            "hulaoguan_dongxie":["female","qun",7,["hulaoguan_juntun","hulaoguan_jiaoxia"],["forbidai"]],
            "hulaoguan_fengyaojun":["female","qun",4,["hulaoguan_fengying"],["forbidai"]],
            longxiangjun:["male","qun",5,["hulaoguan_longying"],["forbidai"]],
            "hulaoguan_hubenjun":["male","qun",4,["hulaoguan_huying"],["forbidai"]],
            "hulaoguan_feixiongjun":["male","qun",4,["hulaoguan_jingqi"],["forbidai"]],
            "hulaoguan_baoluejun":["male","qun",4,["hulaoguan_baoying"],["forbidai"]],
            "hulaoguan_tanlangjun":["male","qun",3,["hulaoguan_ruiqi"],["forbidai"]],
        },
        translate:{
            "boss_lvbu4":"鏖战虎牢",
            "boss_lvbu5":"戾火浮屠",
            "hulaoguan_lijue":"李傕",
            "hulaoguan_guosi":"郭汜",
            "hulaoguan_fanchou":"樊稠",
            "hulaoguan_zhangji":"张济",
            "hulaoguan_huaxiong":"华雄",
            "hulaoguan_caoxing":"曹性",
            "hulaoguan_chengong":"陈宫",
            "hulaoguan_gaoshun":"高顺",
            "hulaoguan_dongxie":"董翓",
            "hulaoguan_fengyaojun":"凤瑶军",
            longxiangjun:"龙骧军",
            "hulaoguan_hubenjun":"虎贲军",
            "hulaoguan_feixiongjun":"飞熊军",
            "hulaoguan_baoluejun":"豹掠军",
            "hulaoguan_tanlangjun":"贪狼军",
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
            "boss_baguan":{
                trigger:{
                    global:"phaseAfter",
                },
                unique:true,
                charlotte:true,
                forced:true,
                mode:["boss"],
                filter:function(event,player){
        return event.player!=player;
    },
                content:function(){
        player.addTempSkill('reyingzi',{player:"phaseJieshuBegin"});
        player.insertPhase();
    },
            },
            "boss_zhanjia":{
                trigger:{
                    player:"damageBegin4",
                },
                unique:true,
                charlotte:true,
                forced:true,
                usable:1,
                mode:["boss"],
                filter:function(event){
        return event.num>2;
    },
                content:function(){
        trigger.num=2;
        player.draw(2);
    },
            },
            "boss_xvli":{
                unique:true,
                trigger:{
                    player:"changeHp",
                    global:"boss_baonuwash",
                },
                forced:true,
                priority:100,
                fixed:true,
                audio:"ext:征战虎牢:2",
                mode:["identity","guozhan","boss","stone"],
                init:function(player){
        if(get.mode()=='boss'&&player==game.boss){
            lib.onwash.push(function(){
                if(!_status.boss_baonuwash){
                    _status.boss_baonuwash=true;
                    _status.event.parent.trigger('boss_baonuwash');
                }
                else{
                    _status.event.player.addSkill('boss_baonuwash');
                }
            });
            for(var i in lib.card){
                if(lib.card[i].subtype=='equip1') lib.card[i].chongzhu=true;
            }
        }
    },
                filter:function(event,player){
        return player.hp<=4||_status.boss_baonuwash;
    },
                content:function(){
        'step 0'
        if(player.hp>6){
            game.delay();
        }
        'step 1'
        player.chooseControl('戾火浮屠','神鬼无前',function(){
            if(Math.random()<0.5) return '神鬼无前';
            return '戾火浮屠';
        }).set('prompt','选择一个形态');
        'step 2'
        var hp=player.hp;
        player.removeSkill('boss_baonu',true);
        if(result.control=='戾火浮屠'){
            player.init('boss_lvbu5');
        }
        else{
            player.init('boss_lvbu3');
        }
        if(hp>6){
            player.maxHp=hp;
            player.hp=hp;
        }
        player.update();
        ui.clear();
        if(player.isLinked()) player.link();
        if(player.isTurnedOver()) player.turnOver();
        player.discard(player.getCards('j'));
        'step 3'
        while(_status.event.name!='phaseLoop'){
            _status.event=_status.event.parent;
        }
        game.resetSkills();
        _status.paused=false;
        _status.event.player=player;
        _status.event.step=0;
        if(game.bossinfo){
            game.bossinfo.loopType=1;
            _status.roundStart=game.boss;
        }
    },
                ai:{
                    effect:{
                        target:function(card,player,target){
                if(get.tag(card,'damage')||get.tag(card,'loseHp')){
                    if(player.hp==5){
                        if(game.players.length<4) return [0,5];
                        var num=0
                        for(var i=0;i<game.players.length;i++){
                            if(game.players[i]!=game.boss&&game.players[i].hp==1){
                                num++;
                            }
                        }
                        if(num>1) return [0,2];
                        if(num&&Math.random()<0.7) return [0,1];
                    }
                }
            },
                    },
                },
            },
            "boss_zhankai":{
                mod:{
                    maxHandcardBase:function(player,num){
            return 12;
        },
                },
                trigger:{
                    player:"damageEnd",
                },
                filter:function(event,player){
        return event.source!=undefined&&event.source!=player;
    },
                unique:true,
                charlotte:true,
                forced:true,
                logTarget:"source",
                mode:["boss"],
                content:function(){
        "step 0"
        event.num=trigger.num;
        "step 1"
        if(trigger.source.countCards('e')){
            trigger.source.discard(trigger.source.getCards('e')); 
            event.dist=true;
        }
        if(!event.dist&&trigger.source.countCards('h')>0){
            trigger.source.chooseToDiscard(2,true); 
        }
        "step 2"
        player.draw(2);
        var card=get.discardPile(function(card){
            return card.name=='sha';
        });
        if(card) player.gain(card,'gain2');
        "step 3"
        game.updateRoundNumber();
        "step 4"
        if(--event.num>0) event.goto(1);
    },
                ai:{
                    "maixie_defend":true,
                    effect:{
                        target:function(card,player,target){
                if(player.hasSkillTag('jueqing',false,target)) return [1,-1];
                return 0.8;
            },
                    },
                },
            },
            "boss_shenji":{
                mod:{
                    selectTarget:function(card,player,range){
            if(range[1]==-1) return;
            if(card.name=='sha') range[1]+=2;
        },
                    cardUsable:function(card,player,num){
            if(card.name=='sha') return num+2;
        },
                },
                trigger:{
                    player:"phaseJudgeBegin",
                },
                mode:["boss"],
                unique:true,
                charlotte:true,
                locked:true,
                direct:true,
                filter:function(event,player){
        return player.countCards('j')&&player.countCards('h')>1;
    },
                content:function(){
        "step 0"
        player.chooseToDiscard('h',2,'是否发动【神戟】，弃置两张手牌并弃置自己判定区的牌？').set('logSkill','boss_shenji').ai=function(card){
            return 10-get.value(card);
        };
        "step 1"
        if(result.bool){
            player.discard(player.getCards('j'));
        }
    },
                group:["boss_shenji_draw"],
                subSkill:{
                    draw:{
                        trigger:{
                            player:"phaseDrawBegin2",
                        },
                        forced:true,
                        filter:function(event,player){
                return !event.numFixed;
            },
                        content:function(){
                trigger.num+=2;
            },
                        sub:true,
                    },
                },
            },
            "boss_yangwu":{
                trigger:{
                    global:"useCard",
                },
                filter:function(event,player){
        return player.getEnemies().contains(event.player)&&event.card.name=='wuxie'&&event.player.countCards('he')>0;
    },
                mode:["boss"],
                unique:true,
                charlotte:true,
                forced:true,
                logTarget:"player",
                content:function(){
        trigger.player.chooseToDiscard(2,true)
    },
            },
            "hulaoguan_mojun":{
                trigger:{
                    global:"damageEnd",
                },
                forced:true,
                filter:function(event,player){
        return (event.card&&(event.card.name=='sha'))&&event.source.isAlive()&&event.source.countCards('h')<=event.player.countCards('h')&&event.notLink()&&event.source&&event.source.isIn()&&event.source.isFriendOf(player);
    },
                logTarget:"source",
                content:function(){
        game.asyncDraw([player,trigger.source]);
    },
            },
            "hulaoguan_fangong":{
                trigger:{
                    global:"useCardAfter",
                },
                audio:"xinfu_xingluan",
                filter:function(event,player){
        return lib.filter.targetEnabled({name:'sha'},player,event.player)&&player.getEnemies().contains(event.player)&&event.targets.contains(player)&&get.tag(event.card,'damage')&&['basic','trick'].contains(get.type(event.card));
    },
                forced:true,
                logTarget:"player",
                content:function(){
        player.useCard({name:'sha',isCard:true},trigger.player,false);
    },
                ai:{
                    threaten:0.7,
                },
            },
            "hulaoguan_jielue":{
                audio:"xinfu_lveming",
                trigger:{
                    source:"damageSource",
                },
                filter:function(event,player){
        if(event._notrigger.contains(event.player)) return false;
        return event.player.isAlive()&&event.player.countCards('he')>0&&event.player!=player;
    },
                forced:true,
                content:function(){
        var num=0;
        if(trigger.player.countCards('h')) num++;
        if(trigger.player.countCards('e')) num++;
        if(num){
            player.gainPlayerCard(trigger.player,num,'he',true).set('filterButton',function(button){
                for(var i=0;i<ui.selected.buttons.length;i++){
                    if(get.position(button.link)==get.position(ui.selected.buttons[i].link)) return false;
                }
                return true;
            });
        }
    },
                ai:{
                    threaten:3.5,
                },
            },
            "hulaoguan_moqu":{
                trigger:{
                    global:"phaseJieshuBegin",
                },
                forced:true,
                filter:function(event,player){
        return event.player.countCards('h')<6&&event.player.isAlive()&&event.player.isIn()&&event.player.isFriendOf(player);
    },
                logTarget:"player",
                content:function(){
        trigger.player.drawTo(6);
    },
            },
            "hulaoguan_yaowu":{
                trigger:{
                    player:"damageBegin3",
                },
                audio:"new_reyaowu",
                filter:function (event){
        return event.card&&event.card.name=='sha'&&(get.color(event.card)!='red'||event.source&&event.source.isAlive());
    },
                forced:true,
                check:function (event){
        if(event.card&&(event.card.name=='sha')){
            return get.color(event.card)=='black';
        }
    },
                content:function (){
        if(get.color(trigger.card)!='red') player.draw();
        else trigger.source.chooseDrawRecover(true);
    },
                ai:{
                    effect:{
                        target:function (card,player,target,current){
                if(card.name=='sha'&&(get.color(card)=='red')&&get.attitude(player,target)<=0){
                    return [1,0.8,1,0];
                }
                if(card.name=='sha'&&(get.color(card)=='black')){
                    return [1,0.4];
                }
            },
                    },
                },
            },
            "hulaoguan_shence":{
                trigger:{
                    global:"phaseUseBegin",
                },
                forced:true,
                audio:"mingce",
                filter:function(event,player){
        return event.player.isAlive()&&event.player.isIn()&&event.player.isFriendOf(player);
    },
                logTarget:"player",
                content:function(){
        'step 0'
        if(!trigger.player.hasSkill('hulaoguan_shence_sha')) trigger.player.addTempSkill('hulaoguan_shence_sha');
        var card=get.discardPile(function(card){
            return card.name=='sha';
        });
        if(card) trigger.player.gain(card,'gain2');
        'step 1'
        game.updateRoundNumber();
    },
                ai:{
                    threaten:3,
                },
                subSkill:{
                    sha:{
                        mark:true,
                        marktext:"策",
                        intro:{
                            content:"可额外使用一张【杀】且第一张【杀】无距离限制",
                        },
                        mod:{
                            cardUsable:function(card,player,num){
                    if(card.name=='sha') return num+1;
                },
                            targetInRange:function(card,player){
                    if(card.name=='sha'&&player.countUsed('sha',true)==0) return true;
                },
                        },
                        sub:true,
                    },
                },
            },
            "hulaoguan_sizhen":{
                audio:"xianzhen",
                trigger:{
                    player:"useCardToPlayered",
                },
                filter:function(event){
        return event.card&&event.card.name=='sha';
    },
                logTarget:"target",
                forced:true,
                content:function(){
        var id=trigger.target.playerid;
        var map=trigger.getParent().customArgs;
        if(!map[id]) map[id]={};
        if(typeof map[id].extraDamage!='number'){
            map[id].extraDamage=0;
        }
        map[id].extraDamage++;
    },
                ai:{
                    unequip:true,
                    skillTagFilter:function(player,tag,arg){
            if(arg&&arg.name=='sha') return true;
            return false;
        },
                },
            },
            "hulaoguan_juejiu":{
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                audio:"jinjiu",
                forced:true,
                firstDo:true,
                content:function(){
        var targets=game.filterPlayer();
        targets.sort(lib.sort.seat);
        player.line(targets,'green');
        game.log('本回合内，所有角色不能使用','#y【酒】');
    },
                global:"hulaoguan_juejiu_debuff",
                subSkill:{
                    debuff:{
                        mod:{
                            cardEnabled:function(card,player){
                    if(card.name=='jiu'&&_status.currentPhase&&_status.currentPhase.hasSkill('hulaoguan_juejiu')) return false;
                },
                            cardSavable:function(card,player){
                    if(card.name=='jiu'&&_status.currentPhase&&_status.currentPhase.hasSkill('hulaoguan_juejiu')) return false;
                },
                        },
                        sub:true,
                    },
                },
            },
            "hulaoguan_juntun":{
                audio:"juntun",
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                forced:true,
                filter:function(event,player){
        return player.maxHp>=2;
    },
                content:function(){
        'step 0'
        player.loseMaxHp();
        'step 1'
        player.draw(player.maxHp);
    },
            },
            "hulaoguan_jiaoxia":{
                mod:{
                    aiOrder:function(player,card,num){
            if(typeof card=='object'&&player==_status.currentPhase){
                if(card.name=='sha'&&get.color(card)=='red'){
                    return num+10;
                }
            }
        },
                    ignoredHandcard:function(card,player){
            if(get.color(card)=='red'){
                return true;
            }
        },
                    cardDiscardable:function(card,player,name){
            if(name=='phaseDiscard'&&get.color(card)=='red'){
                return false;
            }
        },
                    targetInRange:function(card){
            if(get.color(card)=='black') return true;
        },
                    cardUsable:function(card){
            if(get.color(card)=='black') return Infinity;
        },
                },
            },
            "hulaoguan_fengying":{
                trigger:{
                    global:"useCardToPlayered",
                },
                forced:true,
                filter:function(event,player){
        var card=event.card;
        if(get.color(card)=='black'&&event.targets.length==1&&player.getEnemies().contains(event.player)){
            if(event.targets[0].isFriendOf(player)&&event.targets[0].isMinHp()) return true;
            return false;
        }
        return false;
    },
                logTarget:function(event,player){
        return event.targets[0];
    },
                content:function(){
        trigger.getParent().excluded.add(trigger.targets[0]);
    },
                ai:{
                    threaten:3.5,
                },
                global:"hulaoguan_fengying_aix",
                subSkill:{
                    aix:{
                        ai:{
                            effect:{
                                target:function (card,player,target,current){
                        if(game.hasPlayer(function(current){
                            return current.hasSkill('hulaoguan_fengying')&&current.getEnemies().contains(player);
                        })&&player!=target&&player.getEnemies().contains(target)&&target.isMinHp()){
                            if(get.color(card)=='black') return 'zerotarget';
                            return;
                        }
                    },
                            },
                        },
                        sub:true,
                    },
                },
            },
            "hulaoguan_longying":{
                trigger:{
                    player:"phaseUseBegin",
                },
                forced:true,
                filter:function (event,player){
        return game.hasPlayer(function(current){
            return current.isDamaged()&&current.isFriendOf(player)&&current!=player;
        });
    },
                content:function(){
        player.loseHp();
        var targets=game.filterPlayer(function(current){
            return current.isDamaged()&&current.isFriendOf(player)&&current!=player;
        });
        var target=targets.randomGet();
        player.line(target);
        target.recover();
        target.draw(2);
    },
                ai:{
                    threaten:2,
                },
            },
            "hulaoguan_huying":{
                trigger:{
                    player:"phaseUseBegin",
                },
                forced:true,
                content:function(){
        'step 0'
        var i=0;
        var list=[];
        while(i++<2){
            var card=get.cardPile(function(card){
                if(card.name!='sha') return false;
                return list.length==0||card!=list[0];
            });
            if(card) list.push(card);
        }
        if(!list.length){event.finish();return;}
        event.list=list;
        var targets=game.filterPlayer(function(current){
            return current.isFriendOf(player);
        });
        var target=targets.randomGet();
        player.line(target);
        target.gain(event.list,'gain2');
        'step 1'
        game.updateRoundNumber();
    },
            },
            "hulaoguan_jingqi":{
                global:"hulaoguan_jingqi_buff",
                subSkill:{
                    buff:{
                        mod:{
                            globalFrom:function(from,to,distance){
                    if(game.hasPlayer(function(current){
                        return current.hasSkill('hulaoguan_jingqi')&&from.isFriendOf(current);
                    })&&from.getEnemies().contains(to)) return distance-1;
                },
                        },
                        sub:true,
                    },
                },
            },
            "hulaoguan_ruiqi":{
                trigger:{
                    global:"phaseDrawBegin2",
                },
                forced:true,
                filter:function(event,player){
        return !event.numFixed&&event.player.isAlive()&&event.player.isIn()&&event.player.isFriendOf(player);
    },
                logTarget:"player",
                content:function(){
        trigger.num++;
    },
                ai:{
                    threaten:4,
                },
            },
            "hulaoguan_baoying":{
                trigger:{
                    global:"dying",
                },
                filter:function(event,player){
        return event.player.hp<=0&&player.countCards('he')>0&&event.player.isIn()&&event.player.isFriendOf(player);
    },
                forced:true,
                logTarget:"player",
                content:function(){
        player.randomDiscard();
        trigger.player.recover();
    },
                ai:{
                    threaten:2.1,
                },
            },
        },
        translate:{
            "boss_baguan":"霸关",
            "boss_baguan_info":"锁定技，其他角色的回合结束后，你执行一个额外回合，额外回合内，你视为拥有技能“英姿（界限突破）”。",
            "boss_zhanjia":"战甲",
            "boss_zhanjia_info":"锁定技，每回合限一次，当你受到大于2点的伤害时，你将此伤害减至2点，然后摸两张牌。",
            "boss_xvli":"蓄力",
            "boss_xvli_info":"锁定技，当你的体力值降至4或更低时，你变身为神鬼无前或戾火浮屠，并立即开始你的回合",
            "boss_zhankai":"战铠",
            "boss_zhankai_info":"锁定技，你的手牌上限为12；当你受到其他角色造成的1点伤害后，你令伤害来源弃置装备区内所有牌（装备区内无牌则改为弃置两张手牌），然后你摸两张牌并从弃牌堆中随机获得一张【杀】。",
            "boss_shenji":"神戟",
            "boss_shenji_info":"判定阶段，你可以弃置两张手牌，然后弃置判定区内所有牌；摸牌阶段，你多摸两张牌；出牌阶段，你使用【杀】次数上限+2且可以多指定两名角色为目标。",
            "boss_yangwu":"扬武",
            "boss_yangwu_info":"锁定技，敌方角色使用【无懈可击】时，其弃置两张牌。",
            "hulaoguan_mojun":"魔军",
            "hulaoguan_mojun_info":"锁定技，己方角色使用【杀】造成伤害后，若其手牌数小于等于受伤角色，则你和该角色各摸一张牌。",
            "hulaoguan_fangong":"反攻",
            "hulaoguan_fangong_info":"锁定技，当你成为一名敌方角色使用【杀】或伤害类锦囊牌的目标且该牌结算完成后，你视为对其使用一张【杀】（无距离限制）。",
            "hulaoguan_jielue":"劫掠",
            "hulaoguan_jielue_info":"锁定技，当你对一名其他角色造成伤害后，你获得其手牌、装备区各一张牌。",
            "hulaoguan_moqu":"魔躯",
            "hulaoguan_moqu_info":"锁定技，己方角色回合结束时，该角色将手牌补至6张。",
            "hulaoguan_yaowu":"耀武",
            "hulaoguan_yaowu_info":"锁定技，当你受到【杀】造成的伤害时，若此【杀】为红色，伤害来源回复1点体力或摸一张牌；若此【杀】不为红色，则你摸一张牌",
            "hulaoguan_shence":"神策",
            "hulaoguan_shence_info":"锁定技，己方角色的出牌阶段开始时，该角色从弃牌堆获得一张【杀】且本回合使用【杀】次数+1，出牌阶段使用的第一张【杀】无视距离。",
            "hulaoguan_sizhen":"死阵",
            "hulaoguan_sizhen_info":"锁定技，你的【杀】无视目标角色防具且伤害+1。",
            "hulaoguan_juejiu":"绝酒",
            "hulaoguan_juejiu_info":"锁定技，你的回合内，所有角色均不能使用【酒】。",
            "hulaoguan_juntun":"军屯",
            "hulaoguan_juntun_info":"锁定技，准备阶段，若你的体力上限大于等于2，则你扣减1点体力上限，然后摸X张牌（X为你的体力上限）。",
            "hulaoguan_jiaoxia":"狡黠",
            "hulaoguan_jiaoxia_info":"锁定技，你的红色手牌不计入手牌上限，且使用黑色牌无距离和次数限制。",
            "hulaoguan_fengying":"凤营",
            "hulaoguan_fengying_info":"锁定技，敌方角色使用黑色牌指定己方角色为唯一目标后，若目标角色体力值是全场最少的（或之一），则此牌对其无效。",
            "hulaoguan_longying":"龙营",
            "hulaoguan_longying_info":"锁定技，出牌阶段开始时，若己方有其他角色已受伤，你失去1点体力，然后随机一名己方受伤角色回复1点体力并摸两张牌。",
            "hulaoguan_huying":"虎营",
            "hulaoguan_huying_info":"锁定技，出牌阶段开始时，随机一名己方角色获得牌堆中的两张【杀】。",
            "hulaoguan_jingqi":"精骑",
            "hulaoguan_jingqi_info":"锁定技，己方角色计算与敌方角色的距离-1。",
            "hulaoguan_ruiqi":"锐骑",
            "hulaoguan_ruiqi_info":"锁定技，己方角色摸牌阶段额外摸一张牌。",
            "hulaoguan_baoying":"豹营",
            "hulaoguan_baoying_info":"锁定技，己方有其他角色进入濒死状态时，你随机弃置一张牌，然后该角色回复1点体力。",
        },
    },
    intro:"本扩展的第二阶段其实是可以调的，你在应战中选的形态在下局挑战时人机会选择相同的形态，实验证明！！！",
    author:"烟雨墨染",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["hulaoguan_tanlangjun.jpg"],"card":[],"skill":[]}}};