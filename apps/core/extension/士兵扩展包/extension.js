import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"士兵扩展包",content:function (config,pack){
    
},precontent:function (){
    
},help:{},config:{},package:{
    character:{
        character:{
            liannubing:["male","shu",4,["liannu_all"],["des:诸葛亮死后，姜维得到了诸葛亮尚未使用的「诸葛连弩」的图纸，开始大量制造「诸葛连弩」，大大提升了蜀军的战斗力。"]],
            baibing:["male","wei",4,["spm_kuitao"],["des:战败之后溃逃的士兵。因忙着逃跑而经常顾不上自己的物品。"]],
            jianloubing:["male","qun",4,["zhuxiao"],["des:战役结束后，打扫战场，收集遗留的武器马匹等物的士兵。"]],
            shuibing:["male","wu",4,["弄潮"],["des:东吴随处可见的水兵，游泳技术一流"]],
            huangjinbing:["male","qun",4,["fulu"],["des:跟随张角等人反叛的普通士兵，略通一点妖术。"]],
            manbing:["male","shu",4,["spm_manyi3"],["des:南蛮随处可见的士兵。骁勇善战，但是不善谋略，很容易中敌人的计。"]],
            qibingputong:["male","qun",4,["mashu"],["des:西凉随处可见的普通骑兵。借助马匹，可以很快地移动。"]],
            changgongbing:["male","wu",4,["gongbing"],["des:使用弓箭攻击敌人的士兵。因为有弓箭，所以通常不需要近身战斗。"]],
            feidaobing:["female","wu",4,["feidao"],["des:东吴女武神训练出的行动敏捷的飞刀兵"]],
            huojianshou:["male","wu",4,["huojian"],["des:火箭具有非凡的攻击效果，为此吴王对此兵种格外重视，并加强训练，组建该兵种的军队"]],
            saodangbing:["male","qun",4,["saodang"],["des:董卓为了加固自己的地位，首先需要取得一定的资本作为支撑，因此他组建了一批专门扫荡战时战后的极为贵重物品"]],
            shenjibing:["male","wei",4,["shenjishibing"],["des:曹魏行使特战任务所组建的奇兵"]],
            jijunbing:["male","wei",4,["jijunshibing"],["des:为专门募集军队所组建起来的兵队"]],
            mujunbing:["male","qun",4,["mujunshibing"],["des:不惜一切代价得募集军队所组建起来的特训士兵"]],
            shenbigongwei:["male","wu",4,["shengongshibing"],["des:臂力绝人的士兵可开各种弓弩类兵器极擅长携带重型装备"]],
            yufuwenguan:["female","wu",4,["yufuwenguan"],["des:文官:御府"]],
            ceshi:["male","wu",4,["ceshi"],["des:能言善辩有三寸不烂之舌，屡出奇策"]],
            buguashiwu:["female","wu",4,["bugua"],["des:卜卦师，文官"]],
            buguashiqun:["male","qun",4,["bugua"],["des:卜卦师，文官"]],
            guiyi:["female","qun",4,["guiyinvguan"],["des:女官:贵仪"]],
            daoguan:["male","wu",4,["daoguan"],["des:文官官职:道官"]],
            guolianbing:["male","shu",4,["guolian"],["des:蜀汉重臣押运粮草所创建的奇兵"]],
            hubenwei:["male","shu",4,["huben","weishi"],["des:精锐士兵，虎贲卫，拥有极强作战能力防卫能力警戒能力"]],
            "hubenwei1":["male","wei",4,["huben","weishi"],["des:虎贲卫，精锐之师"]],
            "hubenwei4":["male","qun",4,["huben","weishi"],["des:精锐士兵:虎贲卫"]],
            fubing:["male","wei",4,["maifushibing"],["des:出其不意暗箭伤人以众击寡是埋伏兵的特性"]],
            "fubing3":["male","wu",4,["maifushibing"],["des:伏兵，擅长丛林作战"]],
            huweibing:["male","wei",4,["huweishibing"],["des:具有极强的防御能力及警戒性，与侍卫相辅相成"]],
            "huweibing3":["female","wu",4,["huweishibing"],["des:护卫"]],
            "huweibing2":["male","shu",4,["huweishibing"],["des:护卫兵，警惕性强"]],
            "shenjiansbing2":["male","shu",4,["shenjiansbing","chuqiao"],[]],
            "shenjiansbing3":["male","wu",4,["shenjiansbing","chuqiao"],[]],
            "shenjiansbing4":["female","wu",4,["shenjiansbing","chuqiao"],[]],
            yiliaobing:["male","shu",4,["yiliao"],["des:治愈受伤的将士，后方恢复能力极强"]],
            "shenjiansbing1":["male","wei",4,["shenjiansbing","chuqiao"],["des:s级别士兵，极为擅长使用剑类武器给予敌军重创，非常适合近身作战，骁勇善战适合用来擒拿敌军文官或者高级将领"]],
            xiaodaoshou:["male","shu",4,["daofeng","xuerenshibing"],["des:极强作战能力的刀兵"]],
            "xiaodaoshou1":["male","wei",4,["daofeng","xuerenshibing"],[]],
            "xiaodaoshou4":["male","qun",4,["xuerenshibing","daofeng"],[]],
            "xiaodaoshou5":["female","qun",4,["daofeng","xuerenshibing"],[]],
            "xiaodaoshou6":["male","shu",4,["daofeng","xuerenshibing"],[]],
            "xiaodaoshou7":["female","qun",4,["daofeng","xuerenshibing"],[]],
            "shenbigongwei4":["male","qun",4,["shengongshibing"],[]],
            yantangbing:["male","shu",4,["yantang"],["des:手持雁镗，臂力绝人，刺伤程度更高"]],
            "fubing5":["male","wei",4,["maifushibing"],[]],
            tiezhuabing:["male","shu",4,["tiezhua"],["des:近身作战能力极强，具有极高的伤害能力，作战极为敏捷迅速，攻击力杀伤力爆满，而作战速度不足"]],
            "shenjibing1":["male","wei",4,["shenjishibing"],[]],
            yunliangbing:["male","shu",5,["yunliang"],[]],
            "yunliangbing1":["male","wei",5,["yunliang1"],[]],
            "yunliangbing2":["male","shu",5,["yunliang"],[]],
            mengchongdoujian:["none","wu",5,["mengchong","youjia","doujian"],[]],
            "mengchongdoujian3":["none","wu",5,["doujian","youjia","mengchong"],[]],
            mitan:["male","shu",5,["tanmishibing"],[]],
        },
        translate:{
            liannubing:"连弩兵",
            baibing:"败兵",
            jianloubing:"捡漏兵",
            shuibing:"水兵",
            huangjinbing:"黄巾兵",
            manbing:"蛮兵",
            qibingputong:"普通骑兵",
            changgongbing:"长弓兵",
            feidaobing:"飞刀兵",
            huojianshou:"火箭手",
            saodangbing:"扫荡兵",
            shenjibing:"神戟兵",
            jijunbing:"集军兵",
            mujunbing:"募军兵",
            shenbigongwei:"神臂弓卫",
            yufuwenguan:"御府",
            ceshi:"策士",
            buguashiwu:"卜卦师",
            buguashiqun:"卜卦师",
            guiyi:"贵仪",
            daoguan:"道官",
            guolianbing:"钩镰兵",
            hubenwei:"虎贲卫",
            "hubenwei1":"虎贲卫",
            "hubenwei4":"虎贲卫",
            fubing:"伏兵",
            "fubing3":"伏兵",
            huweibing:"护卫兵",
            "huweibing3":"护卫兵",
            "huweibing2":"护卫兵",
            "shenjiansbing2":"神剑兵",
            "shenjiansbing3":"神剑兵",
            "shenjiansbing4":"神剑兵",
            yiliaobing:"医疗兵",
            "shenjiansbing1":"神剑兵",
            xiaodaoshou:"校刀手",
            "xiaodaoshou1":"校刀手",
            "xiaodaoshou4":"校刀手",
            "xiaodaoshou5":"校刀手",
            "xiaodaoshou6":"校刀手",
            "xiaodaoshou7":"校刀手",
            "shenbigongwei4":"神臂弓卫",
            yantangbing:"雁镋兵",
            "fubing5":"伏兵",
            tiezhuabing:"铁爪兵",
            "shenjibing1":"神戟兵",
            yunliangbing:"运粮兵",
            "yunliangbing1":"运粮兵",
            "yunliangbing2":"运粮兵",
            mengchongdoujian:"蒙冲斗舰",
            "mengchongdoujian3":"蒙冲斗舰",
            mitan:"密探",
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
            gongbing:{
                mod:{
                    targetInRange:function (card,player,target,now){
            var type=get.type(card);
            if(type=='trick'||type=='delay'||type=='basic') return true;
        },
                },
            },
            "spm_kuitao":{
                group:["spm_kuitao1","spm_kuitao2"],
            },
            "spm_manyi1":{
                trigger:{
                    player:"damageBegin",
                },
                forced:true,
                filter:function (event,player){
        return get.type(event.card,'trick')=='trick';
    },
                content:function (){
        trigger.num++;
    },
            },
            "spm_manyi2":{
                trigger:{
                    source:"damageBegin",
                },
                forced:true,
                filter:function (event,player){
        return get.type(event.card,'basic')=='basic';
    },
                content:function (){
        trigger.num++;
    },
            },
            "spm_manyi3":{
                group:["spm_manyi1","spm_manyi2"],
            },
            "spm_kuitao2":{
                mod:{
                    globalTo:function (from,to,distance){
            return distance+1
        },
                },
            },
            "spm_kuitao1":{
                mod:{
                    maxHandcard:function (player,num){
            return num-1;
        },
                },
            },
            zhuxiao:{
                audio:"ext:士兵扩展包:2",
                trigger:{
                    global:"discardAfter",
                },
                filter:function (event,player){
        if(event.player==player) return false;
        for(var i=0;i<event.cards.length;i++){
            if(get.type(event.cards[i])=='equip'&&get.position(event.cards[i])=='d'){
                return true;
            }
        }
        return false;
    },
                frequent:"check",
                check:function (event,player){
        for(var i=0;i<event.cards.length;i++){
            if(get.type(event.cards[i])=='equip'&&get.position(event.cards[i])=='d'){
                if(event.cards[i].name=='du') return false;
            }
        }
        return true;
    },
                content:function (){
        "step 0"
        if(trigger.delay==false) game.delay();
        "step 1"
        var cards=[];
        for(var i=0;i<trigger.cards.length;i++){
            if(get.type(trigger.cards[i])=='equip'&&get.position(trigger.cards[i])=='d'){
                cards.push(trigger.cards[i]);
            }
        }
        if(cards.length){
            player.gain(cards,'log');
            player.$gain2(cards);
        }
    },
            },
            "弄潮":{
                trigger:{
                    player:"damageBegin",
                },
                forced:true,
                audio:"ext:士兵扩展包:2",
                filter:function (event,player){
        if(event.num<=1) return false;
        if(event.nature!='fire') return false
        if(event.source&&event.source.hasSkillTag('unequip',false,event.card)) return false;
        return true;
    },
                priority:-10,
                content:function (){
        trigger.num--;
    },
            },
            liannu:{
                trigger:{
                    player:"phaseUseBegin",
                },
                forced:true,
                filter:function (event,player){
        if(player.getEquip(1)) return false;
    return true;
    },
                content:function (){
        
            player.addTempSkill('zhuge_skill',{player:'phaseAfter'});
        
    },
            },
            "liannu_all":{
                group:["liannu","liannu_lost"],
            },
            "liannu_lost":{
                trigger:{
                    player:"useCardAfter",
                },
                forced:true,
                filter:function (event,player){
        if(player.getEquip(1)) return true;
    },
                content:function (){
        
            player.removeSkill('zhuge_skill');
        
    },
            },
            feidao:{
                skillAnimation:true,
                animationStr:"死期已到",
                animationColor:"thunder",
                srlose:true,
                enable:"phaseUse",
                usable:1,
                filter:function (event,player){
        return player.num('h')>0;
    },
                selectTarget:[1,4],
                filterTarget:function (card,player,target){
        return player!=target;
    },
                filterCard:true,
                check:function (card){
        return 6-ai.get.value(card);
    },
                discard:false,
                content:function (){
        'step 0'
        var cardx=ui.create.card();
        cardx.classList.add('infohidden');
        cardx.classList.add('infoflip');
        player.$throw(cardx);
        cards[0].fix();
        ui.cardPile.insertBefore(cards[0],ui.cardPile.firstChild);
        target.chooseControl('heart2','diamond2','club2','spade2').set('ai',function(event){
            switch(Math.floor(Math.random()*6)){
                case 0:return 'heart2';
                case 1:case 4:case 5:return 'diamond2';
                case 2:return 'club2';
                case 3:return 'spade2';
            }
        });
        'step 1'
        game.log(target,'选择了'+get.translation(result.control));     
        event.choice=result.control;
        target.popup(event.choice);
        event.cards=get.cards();
        target.gain(event.cards,'draw');
        'step 2'
        if(get.suit(event.cards)+'2'!=event.choice) 
            target.damage(2,'poison');
            player.recover();
    },
                ai:{
                    threaten:8,
                    expose:1,
                    order:9,
                    result:{
                        target:function (player,target){
                if(target.hasSkillTag('maixie')) return -50;
                return -3;
            },
                        player:function (player){
                if(player.hp<=2) return 10;
                return 0;
            },
                    },
                },
            },
            huojian:{
                enable:"phaseUse",
                skillAnimation:true,
                animationStr:"火箭齐发",
                animationColor:"fire",
                usable:1,
                selectTarget:[1,2],
                filterTarget:function (card,player,target){
        return target!=player;
    },
                content:function (){
        target.damage('fire',2);
        player.damage('fire');
    
    },
                ai:{
                    order:6,
                    threaten:2.6,
                    result:{
                        target:function (player,target){
                if(target.hasSkillTag('nofire')) return 0;
                return -1;
            },
                        player:function (player){
                if(player.hp<=3) return -3;
            },
                    },
                },
            },
            saodang:{
                enable:"phaseUse",
                usable:1,
                filter:function (event,player){
        return player.num('h')>0;
    },
                check:function (){return 1;},
                content:function (){
        player.draw(player.num('h'));
        player.damage(1);
    },
                ai:{
                    order:15,
                    threaten:2.4,
                    result:{
                        player:function (player){
                if(player.hp>2)return 2;
                if(player.hp==2) return -2;
                
            },
                    },
                },
            },
            shenjishibing:{
                forced:true,
                mod:{
                    targetInRange:function (card){
             if(card.name=='sha') return true;
        },
                    selectTarget:function (card,player,range){
            if(card.name=='sha'&&range[1]!=-1) range[1]=2;
        },
                    cardUsable:function (card,player,num){
            if(card.name=='sha') return Infinity;
        },
                },
            },
            jijunshibing:{
                trigger:{
                    global:"phaseUseBegin",
                },
                forced:true,
                filter:function (event,player){
        return event.player!=player&&event.player.num('h')>=player.num('h');
    },
                content:function (){
        "step 0"
        trigger.player.chooseCard('交给'+get.translation(player)+'一张手牌',true).ai=function(card){
            if(ai.get.attitude(trigger.player,player)>0){
                return ai.get.value(card);
            }
            else{
                return -ai.get.value(card);
            }
        }
        "step 1"
        if(result.bool){
            player.gain(result.cards[0]);
            trigger.player.$give(1,player);
        }
    },
            },
            mujunshibing:{
                trigger:{
                    player:"phaseDrawBefore",
                },
                check:function (event,player){
        if(game.players.length<3) return 0;
    },
                content:function (){
        "step 0"
        trigger.finish();
        trigger.untrigger();
        event.current=player.next;
        "step 1"
        event.current.chooseCard('交给'+get.translation(player)+'一张手牌或令其摸一张牌').ai=function(card){
            if(ai.get.attitude(event.current,player)>0){
                return -1;
            }
            else{
                return 3-ai.get.value(card);
            }
        }
        "step 2"
        if(result.bool==false){
            event.current.line(player,'green');
            game.log(get.translation(event.current)+'让'+get.translation(player)+'摸了一张牌');
            player.draw();
        }
        else{
            player.gain(result.cards[0]);
            event.current.$give(1,player);
        }
        if(event.current.next!=player){
            event.current=event.current.next;
            game.delay(0.5);
            event.goto(1);
        }
    },
            },
            shengongshibing:{
                mod:{
                    cardUsable:function (card){
            if(get.info(card)&&get.info(card).forceUsable) return;
            return Infinity;
        },
                    targetInRange:function (){
            return true;
        },
                },
                trigger:{
                    player:"useCard",
                },
                filter:function (event,player){
        if(_status.currentPhase!=player) return false;
        return get.cardCount(event.card,player)>1;
    },
                forced:true,
                usable:5,
                content:function (){
        player.draw();
    },
            },
            yufuwenguan:{
                enable:"phaseUse",
                usable:2,
                position:"he",
                filterCard:true,
                viewAs:{
                    name:"wuzhong",
                    suit:"diamond",
                    number:1,
                    cards:[{"node":{"image":{},"info":{},"name":{},"name2":{},"background":{},"intro":{},"range":{}},"storage":{},"vanishtag":[],"_uncheck":[],"suit":"diamond","number":1,"name":"zhuge","cardid":"7707239385","_transform":"translateX(112px)","clone":{"name":"zhuge","suit":"diamond","number":1,"node":{"name":{},"info":{},"intro":{},"background":{},"image":{}},"_transitionEnded":true,"timeout":5658},"timeout":5641,"original":"h"}],
                },
                viewAsFilter:function (player){
        if(!player.num('he')) return false;
    },
                prompt:"将一张手牌当作无中生有使用",
                check:function (card){return 6-ai.get.value(card)},
                ai:{
                    threaten:1.4,
                    order:15,
                    basic:{
                        order:7.2,
                        useful:4,
                        value:9.2,
                    },
                    result:{
                        player:function (card){
                if(card.name=='du') return -2;
                return 2;
            },
                        target:2,
                    },
                    tag:{
                        draw:2,
                    },
                },
            },
            ceshi:{
                enable:"phaseUse",
                usable:2,
                filter:function (event,player){
        return player.num('h')>0;
    },
                filterCard:true,
                check:function (card){
        return 6-ai.get.value(card);
    },
                content:function (){
        var list=get.inpile('trick','trick');
        var list2=[];
        for(var i=0;i<2;i++){
            list2.push(game.createCard(list.randomGet()));
        }
        player.gain(list2,'draw');
    },
                ai:{
                    order:16,
                    threaten:1.8,
                    result:{
                        player:1,
                    },
                },
            },
            bugua:{
                enable:"phaseUse",
                usable:1,
                selectTarget:[1,2],
                filterTarget:function (card,player,target){
        return target!=player;
    },
                content:function (){
        target.damage('thunder');
    },
                ai:{
                    threaten:4.6,
                    order:6,
                    result:{
                        target:-3,
                    },
                },
            },
            guiyinvguan:{
                trigger:{
                    player:"damageBegin",
                },
                filter:function (event,player){
        return (event.source!=undefined);
    },
                frequent:true,
                content:function (){
        'step 0'
        trigger.source.chooseToDiscard('弃置2张牌并展示所有手牌，或令此伤害-1',2).ai=function(card){
            if(ai.get.attitude(trigger.source,player)<0)
                return 7-ai.get.value(card);
            return false;
        }
        'step 1'
        if(result.bool){
            trigger.source.showHandcards();
        }else{
            trigger.num--;
        }
    },
                ai:{
                    effect:{
                        target:function (card,player,target,current){
                var bs=player.get('h');
                if(bs.length==0) return 0;
                if(player.hasSkill('jiu')||player.hasSkill('tianxianjiu')) return;
                return [1,0,1,-0.5];
            },
                    },
                },
            },
            daoguan:{
                enable:"phaseUse",
                usable:1,
                filterTarget:function (card,player,target){
        return player!=target&&target.num('he')>0;
    },
                filterCard:true,
                position:"he",
                content:function (){
       player.discard(player.get('he'));
       player.gain(target.get('he'));
       target.$give(target.num('he'),player);
    },
                ai:{
                    threaten:4.8,
                    order:1,
                    result:{
                        target:function (player,target){
                if(target.num('h')>target.hp) return -100;
                return -2;
            },
                    },
                },
            },
            guolian:{
                skillAnimation:true,
                animationStr:"钩魂索命",
                animationColor:"metal",
                enable:"phaseUse",
                usable:1,
                selectTarget:[1,3],
                filter:function (event,player){
        return player.num('he',{subtype:'equip1'});
    },
                filterCard:function (card){
        return get.subtype(card)=='equip1';
    },
                position:"he",
                filterTarget:function (card,player,target){
        return player!=target;
    },
                check:function (card){
        8-ai.get.value(card);
    },
                content:function (){
        target.damage('fire');
    },
                ai:{
                    threaten:2.4,
                    order:6,
                    result:{
                        target:-2,
                    },
                },
            },
            huben:{
                enable:"phaseUse",
                usable:1,
                filterCard:true,
                position:"he",
                filterTarget:function (card,player,target){
        return player!=target&&target.num('he')>0;
    },
                check:function (card){
        return 6-ai.get.value(card);
    },
                content:function (){
        player.gainPlayerCard('he',target,2);
        target.damage('fire');
    },
                ai:{
                    threaten:3,
                    order:15,
                    expose:0.3,
                    result:{
                        target:function (player,target){
                if(target.hasSkillTag('nofire')) return 0;
                return -2;
            },
                    },
                },
            },
            weishi:{
                skillAnimation:true,
                animationStr:"神之护卫",
                animationColor:"metal",
                trigger:{
                    player:"dying",
                },
                priority:7,
                unique:true,
                forced:true,
                filter:function (event,player){
        return player.hp<=0;
    },
                content:function (){
        'step 0'
        player.judge(function(card){
            return get.suit(card)=='spade'?-1:1;
        });
        'step 1'
        if(result.bool){
            player.recover(1-player.hp);
            if(!player.isTurnedOver());
        }
    },
                ai:{
                    threaten:0.8,
                },
            },
            maifushibing:{
                trigger:{
                    source:"damageBegin",
                },
                forced:true,
                priority:-10,
                unique:true,
                filter:function (event,player){
                    return event.player&&event.player.isAlive();
                },
                content:function (){
                    'step 0'
                    event.num=trigger.num;
                    'step 1'
                    if(trigger.player.isTurnedOver()){
                        trigger.player.loseHp();
                    }
                    else{
                        player.chooseToDiscard('he',true);
                        trigger.player.turnOver();
                    }
                    'step 2'
                    event.num--;
                    'step 3'
                    if(event.num>0) event.goto(1);
                    'step 4'
                    while(_status.event.name!='damage'){
                        _status.event=_status.event.parent;
                    }
                    _status.event.finish();
                    _status.event.untrigger(true);                
                },
                ai:{
                    effect:{
                        player:function (card,player,target){
                            if(player.hasSkill('jueqing')) return;
                            if(get.tag(card,'damage')){
                                if(target.isTurnedOver()) return [1,1];
                            } 
                        },
                    },
                },
            },
            huweishibing:{
                srlose:true,
                trigger:{
                    global:"shaBegin",
                },
                filter:function (event,player){
        return event.player!=player;
    },
                direct:true,
                content:function (){
        'step 0'
        if(get.distance(player,trigger.player,'attack')<=8){
            player.chooseBool(get.prompt('护卫',trigger.player)).ai=function(){
                if(sgs.isFriend(player,trigger.player)){
                    if(sgs.needKongcheng(trigger.player)&&trigger.player.num('h')==1) return true;
                    if(ai.get.effect(trigger.target,{name:'sha'},trigger.player)<0) return true;
                    return false;
                }
                else{
                    if(sgs.needKongcheng(trigger.player)&&trigger.player.num('h')==1) return false;
                    if(ai.get.effect(trigger.target,{name:'sha'},trigger.player)<0) return false;
                    return true;
                }
                return false;
            };
        }
        else{
            player.chooseToDiscard(get.prompt('护卫',trigger.player)).ai=function(card){
                if(sgs.isFriend(player,trigger.player)){
                    if(sgs.needKongcheng(trigger.player)&&trigger.player.num('h')==1) return 6-ai.get.value(card);
                    if(ai.get.effect(trigger.target,{name:'sha'},trigger.player)<0) return 6-ai.get.value(card);
                    return 0;
                }
                else{
                    if(trigger.player.num('h')&&!sgs.isFriend(player,trigger.target)) return 0;
                    if(sgs.isFriend(player,trigger.target)) return 6-ai.get.value(card);
                    if(sgs.needKongcheng(trigger.player)&&trigger.player.num('h')==1) return 0;
                    if(ai.get.effect(trigger.target,{name:'sha'},trigger.player)<0) return 0;
                    if(sgs.needKongcheng(player)&&player.num('h')==1) return 10-ai.get.value(card);
                    return 4-ai.get.value(card);
                }
                return 0;
            };
        }
        'step 1'
        if(result.bool){
            player.logSkill('护卫',trigger.player);
            if(trigger.player.num('h')){
                trigger.player.chooseControl('选项一','选项二').set('prompt','护卫<br><br><div class="text">选项一：令'+get.translation(player)+'获得你一张手牌</div><br><div class="text">选项二：即将对'+get.translation(trigger.target)+'生效的杀无效</div>').ai=function(){
                    if(ai.get.effect(trigger.target,{name:'sha'},trigger.player)<0) return '选项二';
                    return '选项一';
                };
            }
            else{
                trigger.untrigger();
                trigger.finish();
                event.finish();
            }
        }
        else{
            event.finish();
        }
        'step 2'
        if(result.control=='选项一'){
            player.gainPlayerCard('h',trigger.player,true);
        }
        else{
            trigger.untrigger();
            trigger.finish();
        }    
    },
                ai:{
                    expose:1,
                    result:{
                        target:-3,
                    },
                },
            },
            shenjiansbing:{
                enable:"phaseUse",
                usable:1,
                skillAnimation:true,
                animationStr:"神剑出鞘必索汝命",
                animationColor:"black",
                content:function (){
        "step 0"
        event.targets=game.players.slice(0);
        event.targets.remove(player);
        event.targets.sort(lib.sort.seat);
        event.targets2=event.targets.slice(0);
        "step 1"
        if(event.targets.length){
            event.targets.shift().damage();
            event.redo();
        }
        "step 2"
        if(event.targets2.length){
            var cur=event.targets2.shift();
            if(cur&&cur.num('he')){
                if(cur.num('e')){
                    cur.discard(cur.get('e'));
                }
                cur.chooseToDiscard('h',true,1);
            }
            event.redo();
        }
       
    },
                ai:{
                    order:1,
                    result:{
                        player:function (player){
                if(lib.config.mode=='identity'&&game.zhu.isZhu&&player.identity=='fan'){
                    if(game.zhu.hp==1&&game.zhu.countCards('h')<=2) return 1;
                }
                var num=0;
                var players=game.filterPlayer();
                for(var i=0;i<players.length;i++){
                    var att=get.attitude(player,players[i]);
                    if(att>0) att=1;
                    if(att<0) att=-1;
                    if(players[i]!=player&&players[i].hp<=3){
                        if(players[i].countCards('h')==0) num+=att/players[i].hp;
                        else if(players[i].countCards('h')==1) num+=att/2/players[i].hp;
                        else if(players[i].countCards('h')==2) num+=att/4/players[i].hp;
                    }
                    if(players[i].hp==1) num+=att*1.5;
                }
                if(player.hp==1){
                    return -num;
                }
                if(player.hp==2){
                    return -game.players.length/4-num;
                }
                return -game.players.length/3-num;
            },
                    },
                },
            },
            chuqiao:{
                mod:{
                    targetInRange:function (card){
             if(card.name=='sha') return true;
        },
                    targetEnabled:function (card,player,target,now){
            if(card.name=='lebu') return false;
        },
                },
                trigger:{
                    global:"phaseBegin",
                },
                filter:function (event,player){
        return event.player!=player
    },
                frequent:true,
                content:function (){
        player.draw(2);
        player.chooseToUse('出鞘：是否使用一张卡牌？');
        
    },
                ai:{
                    nodu:true,
                    result:{
                        player:function (card){
     if(card.name=='jiu') return 0;
       },
                    },
                },
            },
            yiliao:{
                enable:"phaseUse",
                usable:1,
                filterTarget:function (card,player,target){
        if(target.hp>=target.maxHp) return false;
        return true;
    },
                selectTarget:[1,2],
                content:function (){
        'step 0'
        target.draw();
        'step 1'
        target.chooseToDiscard('he',1,true);
        'step 2'
        target.recover();
},
                ai:{
                    order:15,
                    useful:4,
                    value:10,
                    tag:{
                        draw:2,
                    },
                    result:{
                        target:function (player,target){
                if(target.num('j','lebu')) return 1;
                return Math.max(1,2-target.num('h')/10);
            },
                    },
                },
            },
            daofeng:{
                trigger:{
                    source:"damageBegin",
                },
                filter:function (event){
        return event.card&&(event.card.name=='sha'||event.card.name=='juedou'||event.card.name=='wanjian')&&
        event.parent.name!='_lianhuan'&&event.parent.name!='_lianhuan2';
    },
                forced:true,
                content:function (){
        trigger.num++;
    },
            },
            xuerenshibing:{
                trigger:{
                    global:"shaAfter",
                },
                forced:true,
                usable:1,
                content:function (){ 
        player.draw(); 
    },
                ai:{
                    threaten:4,
                    nodu:true,
                },
            },
            yantang:{
                enable:"phaseUse",
                usable:1,
                filterTarget:function (card,player,target){
        return player!=target&&target.num('he')>0;
    },
                selectTarget:[1,2],
                content:function (){
        player.discardPlayerCard('he',target);
        target.damage('thunder');
        
},
                ai:{
                    order:9,
                    result:{
                        target:-3,
                    },
                },
            },
            tiezhua:{
                srlose:true,
                trigger:{
                    player:"phaseDrawBegin",
                },
                check:function (event){
        return event.num<=3;
    },
                prompt:"是否发动技能【铁爪】，展示牌中每有一张基本牌便可视为对一名角色使用一张【杀】",
                content:function (){
        'step 0'
        trigger.untrigger();
        trigger.finish();
        event.cards=get.cards(5);
        player.showCards(event.cards);
        'step 1'
        var num=0;
        for(var i=0;i<event.cards.length;i++){
            if(get.type(event.cards[i])=='basic'){
                num++;
            }
        }
        if(num>0){
            var next=player.chooseCardButton('请选择铁爪视为【杀】使用的牌',event.cards);
            next.ai=function(button){
                if(game.hasPlayer(function(target){
                    return player.canUse('sha',target,false)&&get.effect(target,{name:'sha'},player,player)>0;
                })){
                    return 8-get.value(button.link)
                }
                return 0;
            }
            next.filterButton=function(button){
                return get.type(button.link)=='basic';
            }
        }
        else{
            player.gain(event.cards,'gain2');
            event.finish();
        }
        'step 2'
        if(result.bool){
            event.cards1=result.links[0];
            player.chooseTarget('请选择铁爪的目标',function(card,player,target){
                return player.canUse('sha',target,false);
            }).set('ai',function(target){
                return get.effect(target,{name:'sha'},player,player);
            });
        }
        else{
            player.gain(event.cards,'gain2');
            event.finish();
        }
        'step 3'
        if(result.bool){
            player.useCard({name:'sha'},result.targets,[event.cards1],false);
            event.cards.remove(event.cards1);
            event.goto(1);
        }
        else{
            player.gain(event.cards,'gain2');
            event.finish();
        }
    },
                ai:{
                    threaten:1.3,
                    expose:0.2,
                },
            },
            yunliang:{
                enable:"phaseUse",
                usable:1,
                content:function (){
                "step 0"
                event.cards=get.cards(player.maxHp);
                player.chooseCardButton(event.cards,[1,player.maxHp-player.hp]);
                "step 1"
                var cards2=[];
                for(var i=0;i<result.buttons.length;i++){
                    cards.remove(result.buttons[i].link);
                    cards2.push(result.buttons[i].link);
                }
                if(cards2.length){
                    player.gain(cards2);
                    player.$gain(cards2);
                }
                for(var i=0;i<cards.length;i++){
                    ui.discardPile.appendChild(cards[i]);
                }
            },
                ai:{
                    order:8,
                    result:{
                        player:2,
                    },
                },
            },
            "yunliang1":{
                trigger:{
                    player:["phaseJudgeBefore","phaseEnd"],
                },
                direct:true,
                filter:function (event,player,name){
                var notarget=true;
                for(var i=0;i<game.players.length;i++){
                    if(game.players[i].group=='wei'){
                        notarget=false;break;
                    }
                }
                if(notarget) return false;
                if(name=='phaseJudgeBefore'){
                    return player.num('j')>0;
                }
                return true;
            },
                content:function (){
                "step 0"
                player.chooseTarget('魏兵：令一名魏势力角色摸一张牌',function(card,player,target){
                    return target.group=='wei';
                });
                "step 1"
                if(result.bool){
                    player.logSkill('weibing',result.targets[0]);
                    result.targets[0].draw();
                }
            },
            },
            mengchong:{
                trigger:{
                    global:"shaBefore",
                },
                direct:true,
                filter:function (event,player){
                    return _status.currentPhase==event.player&&
                    game.countPlayer(function(current){
                        return get.distance(player,current,'attack')<=1&&!event.targets.contains(current);
                    })>0&&
                    player.countCards('h')>0;
                },
                content:function (){
                    "step 0"
                    player.chooseCard(1,'h',get.prompt('mengchong')).set('ai',function(card){
                        if(game.countPlayer(function(current){return get.attitude(trigger.player,current)<0&&get.distance(player,current,'attack')<=1&&!trigger.targets.contains(current)})>0&&
                        player.countCards('h')>1&&
                        get.attitude(player,trigger.player)>0) return 6-get.value(card);
                        return -1;
                    });
                    "step 1"
                    if(result.bool){
                        player.discard(result.cards[0]);
                        if(player!=trigger.player) player.line(trigger.player);
                        trigger.player.chooseTarget('请选择【杀】的额外目标',function(card,player,target){
                            return !trigger.targets.contains(target)&&get.distance(player,target,'attack')<=1;
                        }).ai=function(target){
                            return -ai.get.attitude(trigger.player,target);
                        };
                    }else{
                        event.finish();
                    };
                    "step 2"
                    if(result.bool){
                        trigger.player.line(result.targets[0],trigger.nature);
                        trigger.targets.push(result.targets[0]);
                    }else{
                        event.finish();
                    };
                },
                ai:{
                    expose:0.9,
                },
            },
            youjia:{
                group:["youjia_showCards","youjia_nanman"],
                subSkill:{
                    showCards:{
                        trigger:{
                            target:"huogongEnd",
                        },
                        forced:true,
                        filter:function (event,player){
                            return player.countCards('h')>0;
                        },
                        content:function (){
                            player.chooseToDiscard(1,'h',true);
                        },
                        sub:true,
                    },
                    nanman:{
                        trigger:{
                            target:"useCardToBefore",
                        },
                        forced:true,
                        priority:15,
                        filter:function (event,player){
                            return event.card.name=='nanman';
                        },
                        content:function (){
                            trigger.cancel();
                        },
                        ai:{
                            effect:{
                                target:function (card,player,target){
                                    if(card.name=='nanman') return 0;
                                },
                            },
                        },
                        sub:true,
                    },
                },
            },
            doujian:{
                trigger:{
                    player:"phaseDiscardBegin",
                },
                direct:true,
                content:function (){
                    "step 0"
                    player.chooseToUse(get.prompt('doujian'));
                    "step 1"
                    if(result.bool) player.draw();
                },
            },
            tanmishibing:{
                trigger:{
                    source:"damageAfter",
                },
                check:function (event,player){
                    return get.attitude(player,event.target) <= 0;
                },
                filter:function (event,player){
                    if(event.player == player){
                        return false;
                    }
                    if(!event.player.isIn()){
                        return false;
                    }
                    if(!event.player.countGainableCards(player,'he')){
                        return false;
                    }
                    return true;
                },
                content:function (){
                    'step 0'
                    player.gainPlayerCard('he',trigger.player,true);
                    'step 1'
                    player.choosePlayerCard('he',player,true).set('ai',function(button){
                        return -get.value(button.link);
                    });
                    'step 2'
                    if(result.bool){
                        var card = result.links[0];
                        player.give(card,trigger.player);
                    }
                },
            },
        },
        translate:{
            gongbing:"长弓",
            "gongbing_info":"锁定技，你使用的锦囊牌和基本牌没有距离限制",
            "spm_kuitao":"溃逃",
            "spm_kuitao_info":"锁定技，你的手牌上限始终-1，其他角色计算与你的距离时始终+1",
            "spm_manyi1":"蛮夷",
            "spm_manyi1_info":"锁定技，当你使用「杀」造成伤害或受到锦囊伤害后，该伤害+1。",
            "spm_manyi2":"蛮夷",
            "spm_manyi2_info":"锁定技，当你使用「杀」造成伤害或受到锦囊伤害后，该伤害+1。",
            "spm_manyi3":"蛮夷",
            "spm_manyi3_info":"锁定技，当你使用「杀」造成伤害或受到锦囊伤害后，该伤害+1。",
            "spm_kuitao2":"溃逃",
            "spm_kuitao2_info":"",
            "spm_kuitao1":"溃逃",
            "spm_kuitao1_info":"锁定技，1.你的手牌上限+X。2.游戏开始时，你摸X张牌（X为你的体力上限）",
            zhuxiao:"捡漏",
            "zhuxiao_info":"当其他角色的装备牌，因弃牌而进入弃牌堆时，你可以获得之。",
            "弄潮":"弄潮",
            "弄潮_info":"锁定技，当你受到火焰伤害后，若该伤害大于一，则该伤害减一。",
            liannu:"连弩",
            "liannu_info":"锁定技，若你没装备武器，则你本回合内使用杀没有次数限制。",
            "liannu_all":"连弩总",
            "liannu_all_info":"锁定技，若你没装备武器，则你本回合内使用杀没有次数限制。",
            "liannu_lost":"放下连弩",
            "liannu_lost_info":"锁定技，若你没装备武器，则你本回合内使用杀没有次数限制。",
            feidao:"飞刀",
            "feidao_info":"出牌阶段限1次，你弃置一张手牌，然后令至多3名目标猜测一种花色，并摸一张牌，如果猜的花色和摸的牌花色不同，你对其造成一点毒属性伤害",
            huojian:"火箭",
            "huojian_info":"出牌阶段限制一次，你指定至多2名目标使其受到2点火属性伤害，你每指定一名角色你受到一点火属性伤害",
            saodang:"扫荡",
            "saodang_info":"出牌阶段，你可以摸等同于手牌数的牌。若此做你受到一点来伤害",
            shenjishibing:"神戟",
            "shenjishibing_info":"你使用的杀可以指定至多2名目标并且无距离限制",
            jijunshibing:"集军",
            "jijunshibing_info":"锁定技，其他角色的出牌阶段开始时，若其手牌数不小于你的手牌，必须交给你一张手牌",
            mujunshibing:"募军",
            "mujunshibing_info":"摸牌阶段，你可以放弃摸牌，然后令所有其他角色依次选择一项：1、交给你一张牌；2、令你摸一张牌。",
            shengongshibing:"神弓",
            "shengongshibing_info":"锁定技，你使用的任何卡牌无数量及距离限制；当你于回合内重复使用同名卡牌时，你摸一张牌（每回合最多以此法摸5张牌）。",
            yufuwenguan:"御府",
            "yufuwenguan_info":"出牌阶段限2次，你可以将一张牌当作无中生有使用",
            ceshi:"策士",
            "ceshi_info":"出牌阶段限2次，你可以弃置一张牌，然后随机获得2张锦囊牌",
            bugua:"卜卦",
            "bugua_info":"出牌阶段限一次，你可以对至多2名角色造成一点雷属性伤害",
            guiyinvguan:"贵仪",
            "guiyinvguan_info":"每当你受到一次伤害时，你可以令伤害来源选择一项：展示所有手牌并弃置其中2张；或令此伤害-1",
            daoguan:"道官",
            "daoguan_info":"出牌阶段限制一次，你可以弃置全部手牌，然后指定一名角色，获得其所有牌",
            guolian:"钩镰",
            "guolian_info":"出牌阶段,你可以弃置一张武器牌，选择至多3名角色对其造成1点火属性伤害",
            huben:"虎贲",
            "huben_info":"出牌阶段限一次，你可以弃置一张牌并选择一名其他角色，获得目标两张手牌，然后对其造成1点火属性伤害。",
            weishi:"卫士",
            "weishi_info":"锁定技，当你进入濒死状态时，你进行一次判定，若结果不为黑桃，你将体力回复至1",
            maifushibing:"埋伏",
            "maifushibing_info":"锁定技，每当你造成一点伤害时，防止该伤害，你须弃置一张牌，然后令该名角色翻面；若其已翻面则令其失去一点体力",
            huweishibing:"护卫",
            "huweishibing_info":"当一名其他角色使用杀指定目标后，你令其选择一项：1、弃置一张牌。2、令此杀无效",
            shenjiansbing:"神剑",
            "shenjiansbing_info":"出牌阶段限一次，你对每名其他角色各造成一点伤害，其他角色弃掉各自装备区里所有的牌，再弃置一张手牌",
            chuqiao:"出鞘",
            "chuqiao_info":"每名角色的准备阶段你可以摸2张牌，并且可以使用一张牌，你的杀无距离限制",
            yiliao:"医疗",
            "yiliao_info":"每回合限制一次，你选择至多2名已受伤的目标，让其摸一张牌然后弃置一张牌，使其回复一点体力。",
            daofeng:"刀锋",
            "daofeng_info":"锁定技，你的杀、决斗、万箭齐发造成伤害+1",
            xuerenshibing:"血刃",
            "xuerenshibing_info":"锁定技，每回合限制一次，所有角色打出杀后你摸一张牌",
            yantang:"雁镋",
            "yantang_info":"每回合限制一次，指定至多2名有手牌角色，你弃置目标一张牌，让后受到一点雷属性伤害。",
            tiezhua:"铁爪",
            "tiezhua_info":"出牌阶段限制一次，你可以亮出牌堆顶的3张牌，其中每有一张基本牌，你便可视为对一名其他角色使用一张杀(每阶段对每名角色限一次)。然后将这些基本牌置入弃牌堆，其余收入手牌",
            yunliang:"运粮",
            "yunliang_info":"判定阶段和结束阶段前，你可以令一名蜀势力角色摸一张牌",
            "yunliang1":"运粮",
            "yunliang1_info":"判定阶段和结束阶段前，你可以令一名魏势力角色摸一张牌'",
            mengchong:"蒙冲",
            "mengchong_info":"当一名角色于出牌阶段使用【杀】指定目标后，你可弃置一张手牌并令该角色可额外指定一名你攻击范围内的角色为目标",
            youjia:"尤甲",
            "youjia_info":"锁定技，当你成为【火攻】的目标时，该牌结算后，你弃置一张手牌；【南蛮入侵】对你无效\",",
            doujian:"斗舰",
            "doujian_info":"弃牌阶段开始时，你可使用一张牌，若如此做，你摸一张牌\",",
            tanmishibing:"探密",
            "tanmishibing_info":"当你对一名角色造成伤害后，你可以获得其一张牌，并交给其一张牌",
        },
    },
    intro:"素材提供：平西镇北征南破东定中拢左揽右震天憾地司马",
    author:"苏婆玛丽奥，作者弃坑素菜提供者代更",
    diskURL:"",
    forumURL:"",
    version:"0.1",
},files:{"character":["mengchongdoujian3.jpg","mitan.jpg"],"card":[],"skill":[]}}};