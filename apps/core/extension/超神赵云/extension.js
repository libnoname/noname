import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"超神赵云",content:function (config,pack){
    
},precontent:function (){
    
},help:{},config:{},package:{
    character:{
        character:{
            "超神赵云":["male","shen",4,["ollongdan","zongheng2","huoyu2","longteng1"],["boss","forbidai","bossallowed"]],
            "杂鱼":["male","shen",5,["zaiqi1","huoyu2","baigei1"],["des:无"]],
            Eason:["male","xrenlei",4,["yihua1","jiemu1"],["des:陈奕迅"]],
        },
        translate:{
            "超神赵云":"超神赵云",
            "杂鱼":"杂鱼",
            Eason:"Eason",
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
            "qiyun1":{
                superCharlotte:true,
                charlotte:true,
                fixed:true,
                skillAnimation:"epic",
                trigger:{
                    player:["phaseDrawBegin","recoverBegin","judgeBefore"],
                    global:"damageBegin",
                    target:"useCardToBefore",
                },
                popup:false,
                forced:true,
                filter:function (event, player) {
        player.storage.bozhittype = -1;
        if (event.name == 'phaseDraw') {
            player.storage.bozhittype = 0;
            return true;
        }
        if (event.name == 'judge') {
            player.storage.bozhittype = 5;
            return true;
        }
        if (event.name == 'damage') {
            if (event.player != player && _status.currentPhase == player) {
                player.storage.bozhittype = 1;
                return true;
            }
            if (event.player == player) {
                player.storage.bozhittype = 2;
                return true;
            }
            return false;
        }
        if (event.name == 'recover') {
            player.storage.bozhittype = 4;
            return true;
        }
        if (get.type(event.card) == 'trick' && event.card.name != 'taoyuan' && event.card.name != 'wugu' && event.target == player && event.player != player) {
            player.storage.bozhittype = 3;
            return true;
        }
        return false;
    },
                content:function () {
        'step 0'
        var i = 0;
        switch (player.storage.bozhittype) {
        case 0:
            if (Math.random() < 0.3)
            for (i = 1; Math.random() < 0.2 / i; i++) {
                trigger.num++;
            }
            if (i > 1) game.log(player, "幸运降临，追加摸", i - 1, "张牌！");
            if (i > 1) player.popup((i - 1).toString() + "x 追加");
            break;
        case 1:
            for (i = 1; Math.random() < 0.2 / i; i++) {
                trigger.num++;
            }
            if (i > 1) game.log(player, "幸运降临，追加", i - 1, "点伤害！");
            if (i > 1) player.popup((i - 1).toString() + "x 追加");
            break;
        case 2:
            for (i = 1; Math.random() < 0.1 / i; i++) {}
            if (i > 1) {
                trigger.num -= i - 1;
                game.log(player, "幸运降临，减少", i - 1, "点伤害！");
                player.popup((i - 1).toString() + "x 减伤");
            }
            if (Math.random() < 0.2)
            break;
        case 3:
            if (Math.random() < (0.1 + player.maxHp / player.hp * 0.2)) {
                game.log(player, '幸运降临！', trigger.card, '对', trigger.target, '失效');
                player.popup("lucky!");
                trigger.untrigger();
                trigger.finish();
                i = 2;
            }
            break;
        case 4:
            for (i = 1; Math.random() < 0.1 / i; i++) {}
            if (i > 1) {
                trigger.num += i - 1;
                game.log(player, "幸运降临，追加", i - 1, "点恢复！");
                player.popup((i - 1).toString() + "x 追加");
            }
            break;
        case 5:
            i = 2;
            var tc = ui.cardPile.firstChild;
            var enumtc = tc;
            var getValue = trigger.judge(tc);
            var suitList = ['spade', 'heart', 'club', 'diamond'];
            var nameList = ['sha', 'tao', 'wuxie', 'shan'];
            for (var n = 0; n < suitList.length; n++) {
                for (var i = 1; i < 21; i++) {
                    var name = nameList[n];
                    var suit = suitList[n];
                    var number = i;
                    var tmpCard = game.createCard(name, suit, number, null);
                    var keyValue = trigger.judge(tmpCard);
                    if (keyValue > getValue) {
                        getValue = keyValue;
                        enumtc = tmpCard;
                    }
                }
            }
            if (tc != enumtc) {
                player.popup('lucky!');
                ui.cardPile.removeChild(tc);
                ui.cardPile.insertBefore(enumtc, ui.cardPile.firstChild);
            }
            break;
        }
        if (i == 1) game.log("看来你的幸运也到头了。");
        if (i == 1) player.popup("什么也没有发生...");
    },
                priority:0,
            },
            "shenqiang1":{
                superCharlotte:true,
                charlotte:true,
                fixed:true,
                unique:true,
                mod:{
                    selectTarget:function (card,player,range){
            if(range[1]==-1) return;
            //if(player.getEquip(1)) return;
            if(card.name=='sha') range[1]+=1;
        },
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
            "baigei1":{
                forbid:["boss"],
                trigger:{
                    player:"die",
                },
                forced:true,
                forceDie:true,
                skillAnimation:true,
                animationColor:"gray",
                filter:function (event){
        return event.source&&event.source.isIn();
    },
                content:function (){
         "step 0"
        trigger.source.addSkill("baigei1");
         "step 1"
        trigger.source.gainMaxHp();
        trigger.source.recover();
        trigger.source.draw(3);
         "step 2"
    },
                logTarget:"source",
            },
            "zaiqi1":{
                audio:"ext:超神赵云:2",
                trigger:{
                    player:["damageEnd","loseHpEnd"],
                },
                forced:true,
                content:function (){
        var num=trigger.num;
        player.gainMaxHp(num);
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
            },
            "yihua1":{
                superCharlotte:true,
                charlotte:true,
                fixed:true,
                trigger:{
                    source:"damageBefore",
                },
                check:function (event,player){
        return event.player.hasSkillTag('maixie');
    },
                direct:true,
                content:function (){
        'step 0'
        player.chooseTarget(get.prompt2('yihua1'),function(card,player,target){
            return target!=player;
        }).set('ai',function(target){
            if(_status.event.bool){
                return -get.attitude(_status.event.player,target);
            }
            return 0;
        }).set('bool',trigger.player.hasSkillTag('maixie_defend'));
        'step 1'
        if(result.bool){
            player.logSkill('yihua1',result.targets);
            trigger.source=result.targets[0];
        }
    },
            },
            "jiemu1":{
                superCharlotte:true,
                charlotte:true,
                fixed:true,
                trigger:{
                    global:"useCard",
                },
                direct:true,
                priority:5.5,
                filter:function (event,player){
        if(get.type(event.card)!='equip'&&event.cards.length==1&&event.card.isCard){
            if(event.player==player) return false;
            if(!player.countCards('he',{suit:get.suit(event.card)})) return false;
            return true;
        }
        return false;
    },
                content:function (){
        'step 0'
        var att=get.attitude(player,trigger.player);
        var suit=get.suit(trigger.card);
        player.chooseToDiscard('he',get.prompt2('接木',trigger.player),function(card){
            return get.suit(card)==suit;
        }).set('autodelay',true).set('logSkill',['接木',trigger.player]).ai=function(card){
            if(att<0){
                return 8-get.value(card);
            }
            return 0;
        };
        'step 1'
        if(result.bool){
            trigger.cancel();
            player.chooseUseTarget(trigger.card);
        }
    },
            },
        },
        translate:{
            "zongheng1":"纵横",
            "zongheng1_info":"锁定技，只要你的体力值大于2点，你的进攻距离为无限；只要你的体力值为2点或更低，你的防御距离+1。你不能被翻面。",
            "juejing1":"绝境",
            "juejing1_info":"锁定技，你的手牌上限+4；当你受到伤害或失去体力或进入或脱离濒死状态时，你摸等量的牌。",
            "longteng1":"龙腾",
            "longteng1_info":"觉醒技，当你进入濒死阶段时，你需减1点体力上限并将体力恢复至1点，失去技能“龙胆\"，并获得技能“绝境”和“龙魂”。",
            "qiyun1":"气运",
            "qiyun1_info":"锁定技，受到伤害时有几率减少1点伤害，抽牌时有几率多抽1张牌，对角色造成伤害时有几率使伤害+1，回复体力时有概率使恢复量+1，被锦囊牌作为目标时有几率使其无效化。以上效果均可多重触发,此外你因为牌的效果进行判定时，判定结果往往会对你有利。",
            "shenqiang1":"神枪",
            "shenqiang1_info":"锁定技，你使用【杀】指定的目标加1。",
            "huoyu2":"豁余",
            "huoyu2_info":"每当你于回合外使用或打出一张基本牌，你可以摸一张牌。",
            "baigei1":"白给",
            "baigei1_info":"锁定技，杀死你的角色摸三张牌，增加一点体力上限，恢复1点体力并获得技能【白给】。",
            "zaiqi1":"再起",
            "zaiqi1_info":"锁定技，当你受到伤害后或失去体力时，你增加等量的体力上限。",
            "zongheng2":"纵横",
            "zongheng2_info":"锁定技，只要你的体力值大于2点，你的进攻距离为无限；只要你的体力值为2点或更低，你的防御距离+1。若伤害来源不为你，你受到的大于1的伤害会反弹给伤害来源。你不能被翻面。",
            "zongheng3":"纵横",
            "zongheng3_info":"锁定技，你的武将牌始终正面向上。",
            "Rlonghun1":"龙魂",
            "Rlonghun1_info":"你可以将同花色的一至两张牌按下列规则使用或打出：红桃当【桃】，方块当火【杀】，梅花当【闪】，黑桃当普【无懈可击】。若你以此法使用了两张红色牌，则此牌回复值或伤害值+1。若你以此法使用了两张黑色牌，则你弃置当前回合角色一张牌。",
            "fangyu1":"纵横",
            "fangyu1_info":"受到伤害大于1则超过的部分反弹。",
            "yihua1":"移花",
            "yihua1_info":"每当你即将造成一次伤害时，你可以为此伤害重新指定伤害来源",
            "jiemu1":"接木",
            "jiemu1_info":"当其他角色使用牌指定目标后，你可以弃置一张相同花色的手牌取消之，然后视为你使用此牌。",
        },
    },
    intro:"",
    author:"火枪",
    diskURL:"",
    forumURL:"",
    version:"1.114514",
},files:{"character":["Eason.jpg"],"card":[],"skill":[]}}};