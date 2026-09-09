import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"WH40K",content:function(config,pack){
    var tenUi=document.createElement('style');//十周年UI支持
var style2=document.createElement('style');//新势力添加



//——势力名——势力颜色——//
	style2.innerHTML=".player.identity[data-color='WH40K_SM'],";
	style2.innerHTML+="div[data-nature='WH40K_SM'],";
	style2.innerHTML+="span[data-nature='WH40K_SM'] {text-shadow: black 0 0 1px,rgba(255,215,0,1) 0 0 2px,rgba(255,215,0,1) 0 0 5px,rgba(255,215,0,1) 0 0 10px,rgba(255,215,0,1) 0 0 10px}";
	style2.innerHTML+="div[data-nature='WH40K_SMm'],";//名称描边染色
	style2.innerHTML+="span[data-nature='WH40K_SMm'] {text-shadow: black 0 0 1px,rgba(255,215,0,1) 0 0 2px,rgba(255,215,0,1) 0 0 5px,rgba(255,215,0,1) 0 0 5px,rgba(255,215,0,1) 0 0 5px,black 0 0 1px;}";
	style2.innerHTML+="div[data-nature='WH40K_SMmm'],";//名称描边染色
	style2.innerHTML+="span[data-nature='WH40K_SMmm'] {text-shadow: black 0 0 1px,rgba(255,215,0,1) 0 0 2px,rgba(255,215,0,1) 0 0 2px,rgba(255,215,0,1) 0 0 2px,rgba(255,215,0,1) 0 0 2px,black 0 0 1px;}";
	document.head.appendChild(style2);
	lib.group.add('WH40K_SM');
	lib.translate.WH40K_SM = '星';
	lib.translate.WH40K_SM2 = '星';
	lib.groupnature.WH40K_SM = 'WH40K_SM';
	tenUi.innerHTML+=".player>.camp-zone[data-camp='WH40K_SM']>.camp-back {background: linear-gradient(to bottom, rgb(255,215,0), rgb(255,215,0));}";//十周年UI武将名背景
	tenUi.innerHTML+=".player>.camp-zone[data-camp='WH40K_SM']>.camp-name {text-shadow: 0 0 5px rgb(255,215,0), 0 0 10px rgb(255,215,0), 0 0 15px rgb(255,215,0);}";//十周年UI势力

},precontent:function(){
    
},help:{},config:{},package:{
    character:{
        character:{
            "WH40K_Acheran":["male","WH40K_SM",118,["WH40K_ATK28","WH40K_UME","WH40K_ThunderAssualt","WH40K_Armour1","WH40K_IronHalo"],["zhu","des:N/A"]],
            "WH40K_UM_Reiver":["male","WH40K_SM",72,["WH40K_Armour2","WH40K_ PreciseHit","WH40K_Range","WH40K_ATK18","WH40K_Scared"],[]],
            "WH40K_UM_ReviserL":["male","WH40K_SM",58,["WH40K_Armour2","WH40K_Scared","WH40K_ATK22","WH40K_CATK","WH40K_Assual1","WH40K_Steal"],[]],
            "WH40K_UM_TacticalSM":["male","WH40K_SM",67,["WH40K_ATK23","WH40K_Shoot","WH40K_ PreciseHit","WH40K_Armour2","WH40K_Range"],[]],
            "WH40K_UM_PrimarisAncient":["male","WH40K_SM",75,["WH40K_ATK13","WH40K_Range","WH40K_Armour2","WH40K_ PreciseHit","WH40K_UM_Flag"],[]],
            "WH40K_UM_PrimarisApothecary":["male","WH40K_SM",80,["WH40K_CATK","WH40K_Armour2","WH40K_ATK15","WH40K_UM_Health","WH40K_UM_Save"],[]],
            "WH40K_UM_ Infiltrator":["male","WH40K_SM",73,["WH40K_UM_Hide","WH40K_UM_Smoke","WH40K_ATK22","WH40K_ PreciseHit","WH40K_Armour2","WH40K_Range"],[]],
            "WH40K_UM_PLibrarian":["male","WH40K_SM",92,["WH40K_Armour2","WH40K_Range","WH40K_PhychicSoul","WH40K_ATK29","WH40K_PhychicActual","WH40K_PhychicCh"],[]],
            "WH40K_CenturionDevastator":["male","WH40K_SM",81,["WH40K_ATK30","WH40K_SM_CenturionArmour","WH40K_UM_CenturionMissile","WH40K_ PreciseHit","WH40K_Range"],[]],
            "WH40K_UM_InvictorTacticalWarsuit":["male","WH40K_SM",150,["WH40K_ATK30","WH40K_UM_StormG","WH40K_UM_FlameCannon","WH40K_TaticalWarsuit","WH40K_Range","WH40K_ PreciseHit"],[]],
            "WH40K_UM_Erdicator":["male","WH40K_SM",85,["WH40K_ATK31","WH40K_Shoot","WH40K_ PreciseHit","WH40K_Armour2","WH40K_Range"],[]],
            "WH40K_UM_Hero_C1":["male","WH40K_SM",73,["WH40K_UM_Sword","WH40K_UM_StormShield","WH40K_Armour2","WH40K_UM_Hero","WH40K_CATK","WH40K_ATK23"],[]],
            "WH40K_UM_Hero_C2":["male","WH40K_SM",93,["WH40K_UM_Sword","WH40K_Armour2","WH40K_CATK","WH40K_UM_Hero","WH40K_UM_ActualTactical","WH40K_ATK23"],[]],
            "WH40K_UM_BladeguardAncient":["male","WH40K_SM",128,["WH40K_ATK18","WH40K_UM_ACFlag","WH40K_Armour2","WH40K_Range","WH40K_ PreciseHit"],[]],
            "WH40K_UM_P_Outride":["male","WH40K_SM",88,["WH40K_ATK28","WH40K_Armour2","WH40K_CATK","WH40K_Bike_Assualt","WH40K_Bike_HeavyBluster"],[]],
            "WH40K_Suppressor":["male","WH40K_SM",50,["WH40K_ATK37","WH40K_UM_Supp","WH40K_UM_Fire","WH40K_Shoot","WH40K_Range","WH40K_Armour2","WH40K_ PreciseHit","WH40K_UM_Smoke"],[]],
            "WH40K_Eliminator":["male","WH40K_SM",70,["WH40K_ATK20","WH40K_UM_MarkE","WH40K_ PreciseHit2","WH40K_UM_HideC","WH40K_Armour2","WH40K_Range"],[]],
            "WH40K_UM_Stormtalon":["male","WH40K_SM",138,["WH40K_ATK62","WH40K_Typhoon","WH40K_ATKG","WH40K_UM_GunShip","WH40K_UM_Fire","WH40K_ PreciseHit"],[]],
            "WH40K_UM_Tigurius":["male","WH40K_SM",70,["WH40K_PhychicSoul2","WH40K_ATK40","WH40K_PhychicActual","WH40K_Armour2","WH40K_Range","WH40K_UM_SpellMaster","WH40K_PhychicCh"],["zhu"]],
            "WH40K_UM_Calgar":["male","WH40K_SM",113,["WH40K_UM_ChapterMaster","WH40K_UM_HeraclesArmour","WH40K_ATK50","WH40K_UM_TaticalMaster","WH40K_CATK","WH40K_UME"],["zhu"]],
        },
        translate:{
            "WH40K_Acheran":"阿切拉",
            "WH40K_UM_Reiver":"劫掠者",
            "WH40K_UM_ReviserL":"劫掠士官",
            "WH40K_UM_TacticalSM":"战术战士",
            "WH40K_UM_PrimarisAncient":"原铸旗手",
            "WH40K_UM_PrimarisApothecary":"药剂师",
            "WH40K_UM_ Infiltrator":"渗透者",
            "WH40K_UM_PLibrarian":"原铸智库",
            "WH40K_CenturionDevastator":"百夫长破坏者",
            "WH40K_UM_InvictorTacticalWarsuit":"不屈者战术机甲",
            "WH40K_UM_Erdicator":"根除者",
            "WH40K_UM_Hero_C1":"原铸副官",
            "WH40K_UM_Hero_C2":"原铸副官",
            "WH40K_UM_BladeguardAncient":"剑卫旗手",
            "WH40K_UM_P_Outride":"原铸骑手",
            "WH40K_Suppressor":"压制者",
            "WH40K_Eliminator":"歼灭者",
            "WH40K_UM_Stormtalon":"风暴爪炮艇",
            "WH40K_UM_Tigurius":"狄格里斯",
            "WH40K_UM_Calgar":"卡尔加",
        },
    },
    card:{
        card:{
            "WH40K_PhychicGet":{
                type:"WH40K_Phychic",
                enable:true,
                selectTarget:1,
                toself:false,
                filterTarget:function(card,player,target){
        return target==target;
    },
                modTarget:true,
                content:function(){
        'step 0'
        if(get.isLuckyStar(player)){ 
            event.num=6; 
            player.throwDice(6); 
        } 
        else player.throwDice();
        'step 1'
        target.draw(Math.floor((event.num*5)+(player.maxHp*0.1+event.num)));
    },
                ai:{
                    basic:{
                        order:7.2,
                        useful:4.5,
                        value:9.2,
                    },
                    result:{
                        target:2,
                    },
                    tag:{
                        draw:2,
                    },
                },
                fullimage:true,
            },
            "WH40K_FocusATK":{
                type:"Tactical",
                subtype:"Tactical_Basic",
                enable:true,
                filterTarget:function(card,player,target){
        return target!=player;
    },
                content:function(){
        'step 0'
        event.list=game.filterPlayer(function(current){
            return current!=target;
        }).sortBySeat();
        'step 1'
        if(!target.isIn()){
            event.finish();
            return;
        }
        var current=event.list.shift();
        if(!current||!current.isIn()||current.hasSkill('diaohulishan')){
            if(event.list.length) event.redo();
            else event.finish();
            return;
        }
        event.current=current;
            current.chooseToDiscard('he','弃置一张牌，并视为对'+get.translation(target)+'使用一张【杀】，或点击「取消」弃置其一张牌').set('ai',function(card){
                if(!_status.event.goon) return 0;
                return 5-get.value(card);
            }).set('goon',(get.effect(target,{name:'guohe'},current)<get.effect(target,{name:'sha'},current)));
        
        'step 2'
        if(!target.isIn()){
            event.finish();
            return;
        }
        var current=event.current;
        if(result.bool){
            if(current.isIn()&&current.canUse({name:'sha',isCard:true},target,false)) current.useCard({name:'sha',isCard:true},target,false);
        }
        if(event.list.length) event.goto(1);
    },
                ai:{
                    order:6,
                    value:9,
                    useful:6,
                    tag:{
                        damage:1,
                        discard:1,
                        loseCard:1,
                    },
                    result:{
                        target:function(player,target){
                return -1.5*(game.countPlayer()-1);
            },
                    },
                },
                selectTarget:1,
                fullimage:true,
            },
            "WH40K_PhychicExplosive":{
                type:"WH40K_Phychic",
                enable:true,
                selectTarget:1,
                filterTarget:function(card,player,target){
        return target!=player;
    },
                content:function(){
       'step 0'
        if(get.isLuckyStar(player)){ 
            event.num=6; 
            player.throwDice(6); 
        } 
        else player.throwDice();
        'step 1' 
        target.loseHp(Math.floor((event.num*5)+(target.maxHp*0.1+event.num)));
    },
                fullimage:true,
            },
            "WH40K_PhychicRecover":{
                type:"WH40K_Phychic",
                enable:true,
                selectTarget:1,
                filterTarget:function(card,player,target){
        return target==target;
    },
                content:function(){
       'step 0'
        if(get.isLuckyStar(player)){ 
            event.num=6; 
            player.throwDice(6); 
        } 
        else player.throwDice();
        'step 1' 
        target.recover(Math.floor((event.num*5)+(target.maxHp*0.1+event.num)));
    },
                fullimage:true,
            },
        },
        cardType:{
            "WH40K_Phychic":0.3,
            Tactical:0.5,
            "Tactical_Legion":0.2,
            "Tactical_Advanced":0.3,
            "Tactical_Basic":0.4,
        },
        translate:{
            "WH40K_Phychic":"灵能",
            Tactical:"战术",
            "Tactical_Legion":"军团战术",
            "Tactical_Advanced":"进阶战术",
            "Tactical_Basic":"基础战术",
            "WH40K_PhychicGet":"灵能蓄能",
            "WH40K_PhychicGet_info":"出牌阶段，对任意角色使用。该角色摸X张牌(X为骰子的点数的五倍与该角色体力上限的10%加骰子点数之和)",
            "WH40K_FocusATK":"集火",
            "WH40K_FocusATK_info":"出牌阶段，对一名角色使用。所有其他角色依次选择一项：①弃置一张牌，视为对目标角色使用一张【杀】；②弃置目标角色的一张牌。",
            "WH40K_PhychicExplosive":"灵能引爆",
            "WH40K_PhychicExplosive_info":"出牌阶段，你对一名角色使用，你投一枚骰子，你使该角色流失X点体力(X为骰子的点数的五倍与该角色体力上限的10%加以骰子点数之和)",
            "WH40K_PhychicRecover":"灵能投射",
            "WH40K_PhychicRecover_info":"出牌阶段，你对一名角色使用，你投一枚骰子，你使该角色回复X点体力(X为骰子的点数的五倍与该角色体力上限的10%加以骰子点数之和)",
        },
        list:[["spade","5","WH40K_FocusATK"],["spade","5","WH40K_FocusATK"],["spade","5","WH40K_FocusATK"],["spade","5","WH40K_FocusATK"],["spade","5","WH40K_FocusATK"],["spade","5","WH40K_FocusATK"],["club","5","WH40K_FocusATK"],["club","5","WH40K_FocusATK"],["club","5","WH40K_FocusATK"],["club","5","WH40K_FocusATK"],["club","5","WH40K_FocusATK"],["club","5","WH40K_FocusATK"]],
    },
    skill:{
        skill:{
            "WH40K_UME":{
                forced:true,
                frequent:true,
                trigger:{
                    player:"damage",
                },
                content:function(){
        player.draw(Math.floor(Math.random()*6));
    },
            },
            "WH40K_ATK28":{
                trigger:{
                    source:"damageBegin",
                },
                priority:15,
                filter:function (event,player){
        return event.card&&(event.card.name=='sha')&&event.notLink();
    },
                forced:true,
                content:function (){       
        player.addTempSkill('unequip','shaAfter');
        trigger.num+=27;
    },
                ai:{
                    unequip:true,
                    skillTagFilter:function (player,tag,arg){
            if(arg&&arg.name=='sha') return true;
            return false;
        },
                },
            },
            "WH40K_ThunderAssualt":{
                frequent:true,
                trigger:{
                    player:"shaBegin",
                },
                filter:function (event,player){
    return event.card.name=='sha'
    },
                forced:true,
                content:function (){
        'step 0'
        if(get.isLuckyStar(player)){ 
            event.num=6; 
            player.throwDice(6); 
        } 
        else player.throwDice();
        'step 1'
        if(event.num>3){
            trigger.directHit=true;
        }
        
        else{
            player.draw(event.num);
            player.loseHp(event.num);
            };
        
    },
            },
            "WH40K_Armour1":{
                forced:true,
                frequent:true,
                trigger:{
                    player:"damageBefore",
                },
                filter:function (event,player){   
        return player.isAlive();
    },
                content:function (){
        'step 0'
        if(get.isLuckyStar(player)){ 
            event.num=6; 
            player.throwDice(6); 
        } 
        else player.throwDice();
        'step 1'
        if(event.num==6){
            trigger.cancel();
        };
        'step 2'
        if(event.num>3){
            trigger.num-=Math.floor(trigger.num/2);
        };
        
    },
            },
            "WH40K_ATK23":{
                trigger:{
                    source:"damageBegin",
                },
                priority:15,
                filter:function (event,player){
        return event.card&&(event.card.name=='sha')&&event.notLink();
    },
                forced:true,
                content:function (){       
        player.addTempSkill('unequip','shaAfter');
        trigger.num+=22;
    },
                ai:{
                    unequip:true,
                    skillTagFilter:function (player,tag,arg){
            if(arg&&arg.name=='sha') return true;
            return false;
        },
                },
            },
            "WH40K_Shoot":{
                forced:true,
                enable:"phaseUse",
                usable:1,
                content:function (){
        "step 0"
        player.chooseToDiscard(1);
        "step 1"
        player.chooseUseTarget({name:'sha'}).set('addCount',false);
    },
            },
            "WH40K_ PreciseHit":{
                frequent:true,
                trigger:{
                    player:"shaBegin",
                },
                filter:function (event,player){
    return event.card.name=='sha'
    },
                forced:true,
                content:function (){
        'step 0'
        if(get.isLuckyStar(player)){ 
            event.num=6; 
            player.throwDice(6); 
        } 
        else player.throwDice();
        'step 1'
        if(event.num>4){
            trigger.directHit=true;
            trigger.num+=Math.floor(trigger.num*0.5);
        }
        
        else player.draw(Math.floor(Math.random()*3));
        
    },
            },
            "WH40K_Armour2":{
                forced:true,
                frequent:true,
                trigger:{
                    player:"damageBegin",
                },
                filter:function (event,player){   
        return player.isAlive();
    },
                content:function (){
        'step 0'
        if(get.isLuckyStar(player)){ 
            event.num=6; 
            player.throwDice(6); 
        } 
        else player.throwDice();
        'step 1'
        if(event.num>3){
            trigger.num-=Math.floor(trigger.num/2);
        };
    },
            },
            "WH40K_Range":{
                forced:true,
                mod:{
                    targetInRange:function (card,player,target,now){
            if(card.name=='sha') return true;
        },
                },
            },
            "WH40K_ATK18":{
                trigger:{
                    source:"damageBegin",
                },
                priority:15,
                filter:function (event,player){
        return event.card&&(event.card.name=='sha')&&event.notLink();
    },
                forced:true,
                content:function (){       
        player.addTempSkill('unequip','shaAfter');
        trigger.num+=17;
    },
                ai:{
                    unequip:true,
                    skillTagFilter:function (player,tag,arg){
            if(arg&&arg.name=='sha') return true;
            return false;
        },
                },
            },
            "WH40K_Scared":{
                forced:true,
                frequent:true,
                trigger:{
                    player:"damageBegin",
                },
                filter:function (event,player){   
        return player.isAlive();
    },
                content:function (){
        trigger.num-=Math.floor(trigger.num*0.25);
             
        
    },
            },
            "WH40K_CATK":{
                frequent:true,
                trigger:{
                    player:"shaBegin",
                },
                filter:function (event,player){
    return event.card.name=='sha'
    },
                forced:true,
                content:function (){
        'step 0'
        if(get.isLuckyStar(player)){ 
            event.num=6; 
            player.throwDice(6); 
        } 
        else player.throwDice();
        'step 1'
        if(event.num>2){
            trigger.directHit=true;
        }
        
        else player.draw(Math.floor(Math.random()*2));
        
    },
            },
            "WH40K_ATK22":{
                trigger:{
                    source:"damageBegin",
                },
                priority:15,
                filter:function (event,player){
        return event.card&&(event.card.name=='sha')&&event.notLink();
    },
                forced:true,
                content:function (){       
        player.addTempSkill('unequip','shaAfter');
        trigger.num+=21;
    },
                ai:{
                    unequip:true,
                    skillTagFilter:function (player,tag,arg){
            if(arg&&arg.name=='sha') return true;
            return false;
        },
                },
            },
            "WH40K_Assual1":{
                forced:true,
                enable:"phaseUse",
                usable:1,
                changeSeat:true,
                filterTarget:function(card,player,target){ 
        return player!=target&&player.next!=target&&player.canUse('sha',target,false)&&get.distance(player,target)<=2; 
    },
                filter:function(event,player){ 
        var min=Math.max(1,player.maxHp-player.hp); 
        return lib.filter.filterCard({name:'sha'},player); 
    },
                content:function(){ 
        game.swapSeat(player,target,true,true); 
        player.useCard({name:'sha'},target,false); 
        
    },
                ai:{
                    result:{
                        target:function(player,target){ 
                return get.effect(target,{name:'sha'},player,target); 
            },
                    },
                    order:4,
                },
            },
            "WH40K_Steal":{
                trigger:{
                    player:"shaBegin",
                },
                direct:true,
                filter:function (event,player){
        return player.isAlive();
    },
                content:function (){
        if(trigger.target.countCards('h')){
                player.logSkill('xwj_xu_lixing');
                game.playSu(['xwj_xsanguo_wuniang1','xwj_xsanguo_wuniang2'].randomGet());  
                player.gainPlayerCard(trigger.target,'h',true);
        }
        else{
        event.finish();
        }
    },
                ai:{
                    effect:{
                        player:function (card,player,target){
                if(card.name=='sha') return [1,1];
            },
                    },
                },
            },
            "WH40K_UM_Flag1":{
                forced:true,
                frequent:true,
                trigger:{
                    global:"phaseBegin",
                },
                filter:function (event,player){
        return event.player.identity=='zhong'&&player.identity=='zhu';
    },
                content:function(){
        trigger.player.draw(3);
    },
            },
            "WH40K_ATK13":{
                trigger:{
                    source:"damageBegin",
                },
                priority:15,
                filter:function (event,player){
        return event.card&&(event.card.name=='sha')&&event.notLink();
    },
                forced:true,
                content:function (){       
        player.addTempSkill('unequip','shaAfter');
        trigger.num+=12;
    },
                ai:{
                    unequip:true,
                    skillTagFilter:function (player,tag,arg){
            if(arg&&arg.name=='sha') return true;
            return false;
        },
                },
            },
            "WH40K_UM_Flag2":{
                forced:true,
                frequent:true,
                trigger:{
                    global:"phaseBegin",
                },
                filter:function (event,player){
        return event.player.identity=='zhu'&&player.identity=='zhong';
    },
                content:function(){
        trigger.player.draw(3);
    },
            },
            "WH40K_UM_Flag3":{
                forced:true,
                frequent:true,
                trigger:{
                    global:"phaseBegin",
                },
                filter:function (event,player){
        return event.player.identity==player.identity;
    },
                content:function(){
        trigger.player.draw();
    },
            },
            "WH40K_UM_Flag":{
                forced:true,
                direct:true,
                unique:true,
                locked:true,
                group:["WH40K_UM_Flag1","WH40K_UM_Flag2","WH40K_UM_Flag3"],
            },
            "WH40K_UM_Health1":{
                forced:true,
                frequent:true,
                trigger:{
                    global:"phaseBegin",
                },
                filter:function (event,player){
        return event.player.identity=='zhong'&&player.identity=='zhu';
    },
                content:function(){
        trigger.player.recover(Math.floor(trigger.player.maxHp*0.1));
    },
            },
            "WH40K_UM_Health2":{
                forced:true,
                frequent:true,
                trigger:{
                    global:"phaseBegin",
                },
                filter:function (event,player){
        return event.player.identity=='zhu'&&player.identity=='zhong';
    },
                content:function(){
        trigger.player.recover(Math.floor(trigger.player.maxHp*0.1));
    },
            },
            "WH40K_UM_Health3":{
                forced:true,
                frequent:true,
                trigger:{
                    global:"phaseBegin",
                },
                filter:function (event,player){
        return event.player.identity==player.identity;
    },
                content:function(){
        trigger.player.recover(Math.floor(trigger.player.maxHp*0.1));
    },
            },
            "WH40K_UM_Health":{
                forced:true,
                direct:true,
                unique:true,
                locked:true,
                group:["WH40K_UM_Health1","WH40K_UM_Health2","WH40K_UM_Health3"],
            },
            "WH40K_ATK15":{
                trigger:{
                    source:"damageBegin",
                },
                priority:15,
                filter:function (event,player){
        return event.card&&(event.card.name=='sha')&&event.notLink();
    },
                forced:true,
                content:function (){       
        player.addTempSkill('unequip','shaAfter');
        trigger.num+=14;
    },
                ai:{
                    unequip:true,
                    skillTagFilter:function (player,tag,arg){
            if(arg&&arg.name=='sha') return true;
            return false;
        },
                },
            },
            "WH40K_UM_Save1":{
                frequent:true,
                trigger:{
                    global:"dying",
                },
                filter:function (event,player){
    return event.player.identity=='zhong'&&player.identity=='zhu';
    },
                forced:true,
                content:function (){
        'step 0'
        if(get.isLuckyStar(player)){ 
            event.num=6; 
            player.throwDice(6); 
        } 
        else player.throwDice();
        'step 1'
        if(event.num>4){
            trigger.player.recover(Math.floor((trigger.player.maxHp*0.2)-trigger.player.hp));
        }
        
        
        
    },
            },
            "WH40K_UM_Save2":{
                frequent:true,
                trigger:{
                    global:"dying",
                },
                filter:function (event,player){
    return event.player.identity=='zhu'&&player.identity=='zhong';
    },
                forced:true,
                content:function (){
        'step 0'
        if(get.isLuckyStar(player)){ 
            event.num=6; 
            player.throwDice(6); 
        } 
        else player.throwDice();
        'step 1'
        if(event.num>4){
            trigger.player.recover(Math.floor((trigger.player.maxHp*0.2)-trigger.player.hp));
        }
        
        
        
    },
            },
            "WH40K_UM_Save3":{
                frequent:true,
                trigger:{
                    global:"dying",
                },
                filter:function (event,player){
    return event.player.identity==player.identity;
    },
                forced:true,
                content:function (){
        'step 0'
        if(get.isLuckyStar(player)){ 
            event.num=6; 
            player.throwDice(6); 
        } 
        else player.throwDice();
        'step 1'
        if(event.num>4){
            trigger.player.recover(Math.floor((trigger.player.maxHp*0.2)-trigger.player.hp));
        }
        
        
        
    },
            },
            "WH40K_UM_Save":{
                forced:true,
                direct:true,
                unique:true,
                locked:true,
                group:["WH40K_UM_Save1","WH40K_UM_Save2","WH40K_UM_Save3"],
            },
            "WH40K_IronHalo1":{
                priority:6,
                frequent:true,
                zhuSkill:true,
                trigger:{
                    global:"dying",
                },
                filter:function (event,player){
    return event.player.identity=='zhong'&&player.identity=='zhu'&&event.player.group=="WH40K_SM";
    },
                forced:true,
                content:function (){
        'step 0'
        if(get.isLuckyStar(player)){ 
            event.num=6; 
            player.throwDice(6); 
        } 
        else player.throwDice();
        'step 1'
        if(event.num>4){
            trigger.player.recover(Math.floor(5-trigger.player.hp));
        }
        
        
        
    },
            },
            "WH40K_IronHalo2":{
                priority:6,
                frequent:true,
                zhuSkill:true,
                trigger:{
                    global:"dying",
                },
                filter:function (event,player){
    return event.player.identity=='zhu'&&player.identity=='zhu'&&event.player.group=="WH40K_SM";
    },
                forced:true,
                content:function (){
        'step 0'
        if(get.isLuckyStar(player)){ 
            event.num=6; 
            player.throwDice(6); 
        } 
        else player.throwDice();
        'step 1'
        if(event.num>4){
            trigger.player.recover(Math.floor(5-trigger.player.hp));
        }
        
        
        
    },
            },
            "WH40K_IronHalo":{
                forced:true,
                direct:true,
                unique:true,
                locked:true,
                group:["WH40K_IronHalo1","WH40K_IronHalo2"],
            },
            "WH40K_UM_Smoke1":{
                mark:true,
                intro:{
                    content:"不能成为杀的目标",
                },
                trigger:{
                    player:"phaseBegin",
                },
                forced:true,
                popup:false,
                content:function(){ 
        player.removeSkill('WH40K_UM_Smoke1'); 
    },
                mod:{
                    targetEnabled:function(card){ 
            if(get.name(card,'sha')) return false; 
        },
                },
            },
            "WH40K_UM_Smoke":{
                forced:true,
                enable:"phaseUse",
                usable:1,
                round:2,
                content:function(){
        player.addSkill('WH40K_UM_Smoke1'); 
        player.storage.WH40K_UM_Smoke1='WH40K_UM_Smoke1';
    },
                derivation:["WH40K_UM_Smoke1"],
                group:["WH40K_UM_Smoke_roundcount"],
            },
            "WH40K_UM_Hide1":{
                frequent:true,
                trigger:{
                    player:"damageBefore",
                },
                forced:true,
                priority:15,
                check:function (event,player){
        if(player==event.player) return true;
        return false;
    },
                filter:function (event,player){
        return get.type(event.card,'trick')=='trick';
    },
                content:function (){
        trigger.cancel();
    },
            },
            "WH40K_UM_Hide2":{
                trigger:{
                    target:"useCardToBefore",
                },
                forced:true,
                filter:function (event,player){
        return event.card.name=='sha';
    },
                content:function (){
        "step 0"
        var eff=get.effect(player,trigger.card,trigger.player,trigger.player);
        trigger.player.chooseToDiscard('渗透：弃置一张基本牌，否则此牌对'+get.translation(player)+'无效',function(card){
            return get.type(card)=='basic';
        }).set('ai',function(card){
            if(_status.event.eff>0){
                return 10-get.value(card);
            }
            return 0;
        }).set('eff',eff);
        "step 1"
        if(result.bool==false){
            trigger.finish();
            trigger.untrigger();
        }
    },
            },
            "WH40K_UM_Hide":{
                forced:true,
                direct:true,
                unique:true,
                locked:true,
                group:["WH40K_UM_Hide1","WH40K_UM_Hide2"],
            },
            "WH40K_PhychicSoul":{
                trigger:{
                    player:"phaseBegin",
                },
                forced:true,
                direct:true,
                round:2,
                content:function(){
        'step 0'
        if(get.isLuckyStar(player)){ 
            event.num=6; 
            player.throwDice(6); 
        } 
        else player.throwDice();
        'step 1'
        if(event.num>3){
        var list=[['','','WH40K_PhychicGet'],
            ['','','WH40K_PhychicExplosive'],
            ['','','WH40K_PhychicRecover'],
            ];
        var dialog=ui.create.dialog(get.prompt('WH40K_PhychicSoul'),[list,'vcard'],'hidden');
        player.chooseButton(dialog).ai=function(){return Math.random();};
        }
        else{
            player.loseHp(event.num);
            event.cancel
        }
        
        'step 2'
        if(result.buttons){
            player.logSkill('WH40K_PhychicSoul');
            player.gain(game.createCard(result.buttons[0].link[2]),'draw');
        };
        
        
    },
                ai:{
                    threaten:1.3,
                    effect:{
                        target:function(card,player,target){
                if(card.name=='guiyoujie') return [0,1];
            },
                    },
                },
                group:["WH40K_PhychicSoul_roundcount"],
            },
            "WH40K_ATK29":{
                trigger:{
                    source:"damageBegin",
                },
                priority:15,
                filter:function (event,player){
        return event.card&&(event.card.name=='sha')&&event.notLink();
    },
                forced:true,
                content:function (){       
        player.addTempSkill('unequip','shaAfter');
        trigger.num+=28;
    },
                ai:{
                    unequip:true,
                    skillTagFilter:function (player,tag,arg){
            if(arg&&arg.name=='sha') return true;
            return false;
        },
                },
            },
            "WH40K_PhychicActual":{
                frequent:true,
                trigger:{
                    player:"shaBegin",
                },
                filter:function (event,player){
    return event.card.name=='sha'
    },
                forced:true,
                content:function (){
        'step 0'
        if(get.isLuckyStar(player)){ 
            event.num=6; 
            player.throwDice(6); 
        } 
        else player.throwDice();
        'step 1'
        if(event.num>4){
            trigger.directHit=true;
            trigger.num+=Math.floor(trigger.num*0.5);
        }
        
        else player.draw(Math.floor(Math.random()*3));
        
    },
            },
            "WH40K_UM_CenturionMissile":{
                forced:true,
                enable:"phaseUse",
                selectTarget:1,
                toself:false,
                filterTarget:function(card,player,target){
        return target!=player;
    },
                usable:1,
                content:function(){
        'step 0'
        target.damage(5);
        'step 1'
        target.damage(5);
        'step 2'
        target.damage(5);
        'step 3'
        target.damage(5);
        'step 4'
        target.damage(5);
        'step 5'
        target.damage(5);
        'step 6'
        player.draw(1);
        player.recover(1);
    },
            },
            "WH40K_SM_CenturionArmour":{
                forced:true,
                frequent:true,
                trigger:{
                    player:"damageBegin",
                },
                filter:function (event,player){   
        return player.isAlive();
    },
                content:function (){
        'step 0'
        if(get.isLuckyStar(player)){ 
            event.num=6; 
            player.throwDice(6); 
        } 
        else player.throwDice();
        'step 1'
        if(event.num==2){
            trigger.num-=Math.floor(trigger.num/2);
        };
        'step 2'
        if(event.num>2){
            trigger.num-=Math.floor(trigger.num*0.75);
        };
    },
            },
            "WH40K_ATK30":{
                trigger:{
                    source:"damageBegin",
                },
                priority:15,
                filter:function (event,player){
        return event.card&&(event.card.name=='sha')&&event.notLink();
    },
                forced:true,
                content:function (){       
        player.addTempSkill('unequip','shaAfter');
        trigger.num+=29;
    },
                ai:{
                    unequip:true,
                    skillTagFilter:function (player,tag,arg){
            if(arg&&arg.name=='sha') return true;
            return false;
        },
                },
            },
            "WH40K_UM_StormG":{
                forced:true,
                enable:"phaseUse",
                selectTarget:[1,3],
                toself:false,
                filterTarget:function(card,player,target){
        return target!=player;
    },
                usable:1,
                content:function(){
        'step 0'
        target.damage(5);
        'step 1'
        target.damage(5);
        'step 2'
        target.damage(5);
        'step 3'
        target.damage(5);
        
    },
            },
            "WH40K_UM_FlameCannon":{
                forced:true,
                enable:"phaseUse",
                selectTarget:1,
                toself:false,
                filterTarget:function(card,player,target){
        return target!=player;
    },
                usable:1,
                content:function(){
        'step 0'
        target.damage(5,'fire');
        'step 1'
        target.damage(5,'fire');
        'step 2'
        target.damage(5,'fire');
        
    },
            },
            "WH40K_TaticalWarsuit":{
                forced:true,
                frequent:true,
                trigger:{
                    player:"damageBegin",
                },
                filter:function (event,player){   
        return player.isAlive();
    },
                content:function (){
        'step 0'
        if(get.isLuckyStar(player)){ 
            event.num=6; 
            player.throwDice(6); 
        } 
        else player.throwDice();
        'step 1'
        if(event.num==2){
            trigger.num-=Math.floor(trigger.num/2);
        };
        'step 2'
        if(event.num>2){
            trigger.num-=Math.floor(trigger.num*0.75);
        };
    },
            },
            "WH40K_ATK31":{
                trigger:{
                    source:"damageBegin",
                },
                priority:15,
                filter:function (event,player){
        return event.card&&(event.card.name=='sha')&&event.notLink();
    },
                forced:true,
                content:function (){       
        player.addTempSkill('unequip','shaAfter');
        trigger.num+=30;
    },
                ai:{
                    unequip:true,
                    skillTagFilter:function (player,tag,arg){
            if(arg&&arg.name=='sha') return true;
            return false;
        },
                },
            },
            "WH40K_ATK40":{
                trigger:{
                    source:"damageBegin",
                },
                priority:15,
                filter:function (event,player){
        return event.card&&(event.card.name=='sha')&&event.notLink();
    },
                forced:true,
                content:function (){       
        player.addTempSkill('unequip','shaAfter');
        trigger.num+=39;
    },
                ai:{
                    unequip:true,
                    skillTagFilter:function (player,tag,arg){
            if(arg&&arg.name=='sha') return true;
            return false;
        },
                },
            },
            "WH40K_PhychicSoul2":{
                trigger:{
                    player:"phaseBegin",
                },
                forced:true,
                direct:true,
                round:2,
                content:function(){
        'step 0'
        if(get.isLuckyStar(player)){ 
            event.num=6; 
            player.throwDice(6); 
        } 
        else player.throwDice();
        'step 1'
        if(event.num>2){
        var list=[['','','WH40K_PhychicGet'],
            ['','','WH40K_PhychicExplosive'],
            ['','','WH40K_PhychicRecover'],
            ];
        var dialog=ui.create.dialog(get.prompt('WH40K_PhychicSoul'),[list,'vcard'],'hidden');
        player.chooseButton(dialog).ai=function(){return Math.random();};
        }
        else{
            player.loseHp(event.num);
            event.cancel
        }
        
        'step 2'
        if(result.buttons){
            player.logSkill('WH40K_PhychicSoul');
            player.gain(game.createCard(result.buttons[0].link[2]),'draw');
        };
        
        
    },
                ai:{
                    threaten:1.3,
                    effect:{
                        target:function(card,player,target){
                if(card.name=='guiyoujie') return [0,1];
            },
                    },
                },
                group:["WH40K_PhychicSoul_roundcount","WH40K_PhychicSoul2_roundcount"],
            },
            "WH40K_UM_Sword":{
                trigger:{
                    player:"shaMiss",
                },
                check:function(event,player){ 
        return get.attitude(player,event.target)<0; 
    },
                content:function(){ 
    'step 0'
        if(get.isLuckyStar(player)){ 
            event.num=6; 
            player.throwDice(6); 
        } 
        else player.throwDice();
        'step 1'
        if(event.num>3){ 
            trigger.target.chooseToRespond({name:'shan'},'动力剑：请额外打出一张闪响应杀').autochoose=lib.filter.autoRespondShan; 
        } 
        else{ 
            event.finish(); 
        } 
        "step 2" 
        if(!result.bool){ 
            trigger.untrigger(); 
            trigger.trigger('shaHit'); 
            trigger._result.bool=false; 
        } 
    },
            },
            "WH40K_UM_StormShield":{
                forced:true,
                frequent:true,
                trigger:{
                    player:"damageBefore",
                },
                filter:function (event,player){   
        return player.isAlive();
    },
                content:function (){
        'step 0'
        if(get.isLuckyStar(player)){ 
            event.num=6; 
            player.throwDice(6); 
        } 
        else player.throwDice();
        'step 1'
        if(event.num>3){
            trigger.cancel();
        };
        
        
    },
            },
            "WH40K_UM_Hero1":{
                forced:true,
                frequent:true,
                trigger:{
                    global:"phaseBegin",
                },
                filter:function (event,player){
        return event.player.identity=='zhu'&&player.identity=='zhong';
    },
                content:function(){
        trigger.player.draw(4);
    },
            },
            "WH40K_UM_Hero2":{
                forced:true,
                frequent:true,
                trigger:{
                    global:"phaseBegin",
                },
                filter:function (event,player){
        return event.player.identity=='zhong'&&player.identity=='zhu';
    },
                content:function(){
        trigger.player.draw(4);
    },
            },
            "WH40K_UM_Hero3":{
                forced:true,
                frequent:true,
                trigger:{
                    global:"phaseBegin",
                },
                filter:function (event,player){
        return event.player.identity==player.identity;
    },
                content:function(){
        trigger.player.draw(4);
    },
            },
            "WH40K_UM_Hero":{
                forced:true,
                direct:true,
                unique:true,
                locked:true,
                group:["WH40K_UM_Hero1","WH40K_UM_Hero2","WH40K_UM_Hero3"],
            },
            "WH40K_UM_ActualTactical":{
                forced:true,
                frequent:true,
                trigger:{
                    global:"useCard",
                },
                filter:function(event){ 
        return get.type(event.card,'WH40K_Tactical')=='WH40K_Tactical'&&event.card.isCard; 
    },
                content:function(){
        player.draw(2);
     
              
    },
            },
            "WH40K_UM_ACFlag1":{
                forced:true,
                frequent:true,
                trigger:{
                    global:"phaseBegin",
                },
                filter:function (event,player){
        return event.player.identity=='zhu'&&player.identity=='zhong';
    },
                content:function(){
        trigger.player.draw(5);
        trigger.player.recover(5);
    },
            },
            "WH40K_UM_ACFlag2":{
                forced:true,
                frequent:true,
                trigger:{
                    global:"phaseBegin",
                },
                filter:function (event,player){
        return event.player.identity=='zhong'&&player.identity=='zhu';
    },
                content:function(){
        trigger.player.draw(5);
        trigger.player.recover(5);
    },
            },
            "WH40K_UM_ACFlag3":{
                forced:true,
                frequent:true,
                trigger:{
                    global:"phaseBegin",
                },
                filter:function (event,player){
        return event.player.identity==player.identity;
    },
                content:function(){
        trigger.player.draw(5);
        trigger.player.recover(5);
    },
            },
            "WH40K_UM_ACFlag":{
                forced:true,
                direct:true,
                unique:true,
                locked:true,
                group:["WH40K_UM_ACFlag1","WH40K_UM_ACFlag2","WH40K_UM_ACFlag3"],
            },
            "WH40K_Bike_HeavyBluster":{
                forced:true,
                enable:"phaseUse",
                selectTarget:1,
                toself:false,
                filterTarget:function(card,player,target){
        return target!=player;
    },
                usable:1,
                content:function(){
        'step 0'
        target.damage(14);
        'step 1'
        target.damage(14);
        
        
    },
            },
            "WH40K_Bike_Assualt":{
                forced:true,
                enable:"phaseUse",
                usable:1,
                changeSeat:true,
                filterTarget:function(card,player,target){ 
        return player!=target&&player.next!=target&&player.canUse('sha',target,false); 
    },
                filter:function(event,player){ 
        var min=Math.max(1,player.maxHp-player.hp); 
        return lib.filter.filterCard({name:'sha'},player); 
    },
                content:function(){ 
        game.swapSeat(player,target,true,true); 
        player.useCard({name:'sha'},target,false); 
        
    },
                ai:{
                    result:{
                        target:function(player,target){ 
                return get.effect(target,{name:'sha'},player,target); 
            },
                    },
                    order:4,
                },
            },
            "WH40K_ATK37":{
                trigger:{
                    source:"damageBegin",
                },
                priority:15,
                filter:function (event,player){
        return event.card&&(event.card.name=='sha')&&event.notLink();
    },
                forced:true,
                content:function (){       
        player.addTempSkill('unequip','shaAfter');
        trigger.num+=36;
    },
                ai:{
                    unequip:true,
                    skillTagFilter:function (player,tag,arg){
            if(arg&&arg.name=='sha') return true;
            return false;
        },
                },
            },
            "WH40K_UM_Supp":{
                forced:true,
                trigger:{
                    player:"useCard",
                },
                filter:function(event,player){ 
        if(event.card.name!='sha') return false; 
        if(event.targets.length!=1) return false; 
        var target=event.targets[0]; 
        var players=game.filterPlayer(function(current){ 
            return get.distance(target,current,'pure')==1; 
        }); 
        for(var i=0;i<players.length;i++){ 
            if(player!=players[i]&&target!=players[i]&&player.canUse('sha',players[i],false)){ 
                return true; 
            } 
        } 
        return false; 
    },
                prompt:function(event,player){ 
        var targets=[]; 
        var target=event.targets[0]; 
        var players=game.filterPlayer(function(current){ 
            return get.distance(target,current,'pure')==1; 
        }); 
        for(var i=0;i<players.length;i++){ 
            if(player!=players[i]&&target!=players[i]&&player.canUse('sha',players[i],false)){ 
                targets.push(players[i]); 
            } 
        } 
        return get.prompt('feizhua',targets); 
    },
                check:function(event,player){ 
        var target=event.targets[0]; 
        var num=0; 
        var players=game.filterPlayer(function(current){ 
            return get.distance(target,current,'pure')==1; 
        }); 
        for(var i=0;i<players.length;i++){ 
            if(player!=players[i]&&target!=players[i]&&player.canUse('sha',players[i],false)){ 
                num+=get.effect(players[i],{name:'sha'},player,player); 
            } 
        } 
        return num>0; 
    },
                content:function(){ 
        "step 0" 
        var target=trigger.targets[0]; 
        var players=game.filterPlayer(function(current){ 
            return get.distance(target,current,'pure')==1; 
        }); 
        for(var i=0;i<players.length;i++){ 
            if(player!=players[i]&&target!=players[i]&&player.canUse('sha',players[i],false)){ 
                trigger.targets.push(players[i]); 
                player.line(players[i],'green'); 
            } 
        } 
    },
            },
            "WH40K_UM_Fire":{
                trigger:{
                    player:"shaMiss",
                },
                check:function(event,player){ 
        return get.attitude(player,event.target)<0; 
    },
                content:function(){ 
    'step 0'
        if(get.isLuckyStar(player)){ 
            event.num=6; 
            player.throwDice(6); 
        } 
        else player.throwDice();
        'step 1'
        if(event.num>3){ 
            trigger.target.chooseToRespond({name:'shan'},'火力全开：请额外打出一张闪响应杀').autochoose=lib.filter.autoRespondShan; 
        } 
        else{ 
            event.finish(); 
        } 
        "step 2" 
        if(!result.bool){ 
            trigger.untrigger(); 
            trigger.trigger('shaHit'); 
            trigger._result.bool=false; 
        } 
    },
            },
            "WH40K_UM_MarkE":{
                forced:true,
                enable:"phaseUse",
                selectTarget:1,
                toself:false,
                filterTarget:function(card,player,target){
        return target!=player;
    },
                usable:1,
                content:function(){
        target.damage(35);
        
        
    },
            },
            "WH40K_UM_HideC":{
                forced:true,
                frequent:true,
                trigger:{
                    player:"damageBegin",
                },
                filter:function (event,player){   
        return player.isAlive();
    },
                content:function (){
        'step 0'
        if(get.isLuckyStar(player)){ 
            event.num=6; 
            player.throwDice(6); 
        } 
        else player.throwDice();
        'step 1'
        if(event.num==3){
            trigger.num-=Math.floor(trigger.num/2);
        };
        'step 2'
        if(event.num>3){
            trigger.num-=Math.floor(trigger.num*0.75);
        };
    },
            },
            "WH40K_ATK20":{
                trigger:{
                    source:"damageBegin",
                },
                priority:15,
                filter:function (event,player){
        return event.card&&(event.card.name=='sha')&&event.notLink();
    },
                forced:true,
                content:function (){       
        player.addTempSkill('unequip','shaAfter');
        trigger.num+=19;
    },
                ai:{
                    unequip:true,
                    skillTagFilter:function (player,tag,arg){
            if(arg&&arg.name=='sha') return true;
            return false;
        },
                },
            },
            "WH40K_ PreciseHit2":{
                frequent:true,
                trigger:{
                    player:"shaBegin",
                },
                filter:function (event,player){
    return event.card.name=='sha'
    },
                forced:true,
                content:function (){
        'step 0'
        if(get.isLuckyStar(player)){ 
            event.num=6; 
            player.throwDice(6); 
        } 
        else player.throwDice();
        'step 1'
        if(event.num>2){
            trigger.directHit=true;
            trigger.num+=Math.floor(trigger.num*0.5);
        }
        
        else player.draw(Math.floor(Math.random()*3));
        
    },
            },
            "WH40K_Typhoon":{
                forced:true,
                enable:"phaseUse",
                selectTarget:[1,2],
                toself:false,
                filterTarget:function(card,player,target){
        return target!=player;
    },
                usable:1,
                content:function(){
        'step 0'
        target.damage(10);
        'step 1'
        target.damage(10);
        'step 2'
        target.damage(10);
        
    },
            },
            "WH40K_ATK62":{
                trigger:{
                    source:"damageBegin",
                },
                priority:15,
                filter:function (event,player){
        return event.card&&(event.card.name=='sha')&&event.notLink();
    },
                forced:true,
                content:function (){       
        player.addTempSkill('unequip','shaAfter');
        trigger.num+=61;
    },
                ai:{
                    unequip:true,
                    skillTagFilter:function (player,tag,arg){
            if(arg&&arg.name=='sha') return true;
            return false;
        },
                },
            },
            "WH40K_ATKG":{
                forced:true,
                trigger:{
                    player:"useCard",
                },
                filter:function(event,player){ 
        if(event.card.name!='sha') return false; 
        if(event.targets.length!=1) return false; 
        var target=event.targets[0]; 
        var players=game.filterPlayer(function(current){ 
            return get.distance(target,current,'pure')==1; 
        }); 
        for(var i=0;i<players.length;i++){ 
            if(player!=players[i]&&target!=players[i]&&player.canUse('sha',players[i],false)){ 
                return true; 
            } 
        } 
        return false; 
    },
                prompt:function(event,player){ 
        var targets=[]; 
        var target=event.targets[0]; 
        var players=game.filterPlayer(function(current){ 
            return get.distance(target,current,'pure')==1; 
        }); 
        for(var i=0;i<players.length;i++){ 
            if(player!=players[i]&&target!=players[i]&&player.canUse('sha',players[i],false)){ 
                targets.push(players[i]); 
            } 
        } 
        return get.prompt('feizhua',targets); 
    },
                check:function(event,player){ 
        var target=event.targets[0]; 
        var num=0; 
        var players=game.filterPlayer(function(current){ 
            return get.distance(target,current,'pure')==1; 
        }); 
        for(var i=0;i<players.length;i++){ 
            if(player!=players[i]&&target!=players[i]&&player.canUse('sha',players[i],false)){ 
                num+=get.effect(players[i],{name:'sha'},player,player); 
            } 
        } 
        return num>0; 
    },
                content:function(){ 
        "step 0" 
        var target=trigger.targets[0]; 
        var players=game.filterPlayer(function(current){ 
            return get.distance(target,current,'pure')==1; 
        }); 
        for(var i=0;i<players.length;i++){ 
            if(player!=players[i]&&target!=players[i]&&player.canUse('sha',players[i],false)){ 
                trigger.targets.push(players[i]); 
                player.line(players[i],'green'); 
            } 
        } 
    },
            },
            "WH40K_UM_GunShip":{
                forced:true,
                frequent:true,
                trigger:{
                    player:"damageBegin",
                },
                filter:function (event,player){   
        return player.isAlive();
    },
                content:function (){
        'step 0'
        if(get.isLuckyStar(player)){ 
            event.num=6; 
            player.throwDice(6); 
        } 
        else player.throwDice();
        'step 1'
        if(event.num>3){
            trigger.num-=Math.floor(trigger.num/2);
        };
    },
            },
            "WH40K_UM_SpellMaster1":{
                frequent:true,
                zhuSkill:true,
                filter:function (event,player){
    return event.player.identity=='zhu'&&player.identity=='zhu'&&event.player.group=="WH40K_SM";
    },
                forced:true,
                trigger:{
                    global:"phaseZhunbeiBegin",
                },
                content:function() {
        'step 0'
        if (player.isUnderControl()) {
            game.modeSwapPlayer(player);
        }
        
        var num = Math.min(10,game.countPlayer());
        if (player.hasSkill('yizhi') && player.hasSkill('WH40K_UM_SpellMaster1')) {
            num = 5;
        }
        var player = event.player;
        if(player.isUnderControl()) game.modeSwapPlayer(player);
        
        var cards = get.cards(num);
        var guanXing = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length);
        game.broadcast(function(player, cards){
            if (!window.decadeUI) return;
            decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length);
        }, player, cards);
        
        event.switchToAuto = function(){
            var cards = guanXing.cards[0].concat();
            var cheats = [];
            var judges = player.node.judges.childNodes;
            if (judges.length) {
                cheats = decadeUI.get.cheatJudgeCards(cards, judges, true);
            }
            
            if (cards.length && cheats.length == judges.length) {
                for (var i = 0; i >= 0 && i < cards.length; i++) {
                    if (get.value(cards[i], player) >= 5) {
                        cheats.push(cards[i]);
                        cards.splice(i, 1)
                    }
                }
            }
            
            var time = 500;
            for (var i = 0; i < cheats.length; i++) {
                setTimeout(function(card, index, finished){
                    guanXing.move(card, index, 0);
                    if (finished) guanXing.finishTime(1000);
                }, time, cheats[i], i, (i >= cheats.length - 1) && cards.length == 0);
                time += 500;
            }
            
            for (var i = 0; i < cards.length; i++) {
                setTimeout(function(card, index, finished){
                    guanXing.move(card, index, 1);
                    if (finished) guanXing.finishTime(1000);
                }, time, cards[i], i, (i >= cards.length - 1));
                time += 500;
            }
        };
        
        if (event.isOnline()) {
            event.player.send(function(){
                if (!window.decadeUI && decadeUI.eventDialog) _status.event.finish();
            }, event.player);
            
            event.player.wait();
            decadeUI.game.wait();
        } else if (!event.isMine()) {
            event.switchToAuto();
        }
        'step 1'
        player.popup(get.cnNumber(event.num1) + '上' + get.cnNumber(event.num2) + '下');
        game.log(player, '将' + get.cnNumber(event.num1) + '张牌置于牌堆顶，' + get.cnNumber(event.num2) +'张牌置于牌堆底');
        game.updateRoundNumber()
    },
                ai:{
                    threaten:1.2,
                },
            },
            "WH40K_UM_SpellMaster2":{
                frequent:true,
                zhuSkill:true,
                filter:function (event,player){
    return event.player.identity=='zhong'&&player.identity=='zhu'&&event.player.group=="WH40K_SM";
    },
                forced:true,
                trigger:{
                    global:"phaseZhunbeiBegin",
                },
                content:function() {
        'step 0'
        if (player.isUnderControl()) {
            game.modeSwapPlayer(player);
        }
        
        var num = Math.min(10,game.countPlayer());
        if (player.hasSkill('yizhi') && player.hasSkill('WH40K_UM_SpellMaster1')) {
            num = 5;
        }
        var player = event.player;
        if(player.isUnderControl()) game.modeSwapPlayer(player);
        
        var cards = get.cards(num);
        var guanXing = decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length);
        game.broadcast(function(player, cards){
            if (!window.decadeUI) return;
            decadeUI.content.chooseGuanXing(player, cards, cards.length, null, cards.length);
        }, player, cards);
        
        event.switchToAuto = function(){
            var cards = guanXing.cards[0].concat();
            var cheats = [];
            var judges = player.node.judges.childNodes;
            if (judges.length) {
                cheats = decadeUI.get.cheatJudgeCards(cards, judges, true);
            }
            
            if (cards.length && cheats.length == judges.length) {
                for (var i = 0; i >= 0 && i < cards.length; i++) {
                    if (get.value(cards[i], player) >= 5) {
                        cheats.push(cards[i]);
                        cards.splice(i, 1)
                    }
                }
            }
            
            var time = 500;
            for (var i = 0; i < cheats.length; i++) {
                setTimeout(function(card, index, finished){
                    guanXing.move(card, index, 0);
                    if (finished) guanXing.finishTime(1000);
                }, time, cheats[i], i, (i >= cheats.length - 1) && cards.length == 0);
                time += 500;
            }
            
            for (var i = 0; i < cards.length; i++) {
                setTimeout(function(card, index, finished){
                    guanXing.move(card, index, 1);
                    if (finished) guanXing.finishTime(1000);
                }, time, cards[i], i, (i >= cards.length - 1));
                time += 500;
            }
        };
        
        if (event.isOnline()) {
            event.player.send(function(){
                if (!window.decadeUI && decadeUI.eventDialog) _status.event.finish();
            }, event.player);
            
            event.player.wait();
            decadeUI.game.wait();
        } else if (!event.isMine()) {
            event.switchToAuto();
        }
        'step 1'
        player.popup(get.cnNumber(event.num1) + '上' + get.cnNumber(event.num2) + '下');
        game.log(player, '将' + get.cnNumber(event.num1) + '张牌置于牌堆顶，' + get.cnNumber(event.num2) +'张牌置于牌堆底');
        game.updateRoundNumber()
    },
                ai:{
                    threaten:1.2,
                },
            },
            "WH40K_UM_SpellMaster":{
                forced:true,
                direct:true,
                unique:true,
                locked:true,
                group:["WH40K_UM_SpellMaster1","WH40K_UM_SpellMaster2"],
            },
            "WH40K_PhychicCh":{
                forced:true,
                trigger:{
                    global:"useCard",
                },
                filter:function(event,player){ 
        return get.type(event.card,'WH40K_Phychic')=='WH40K_Phychic'&&event.card.isCard&&event.player!=player; 
    },
                content:function(){
        'step 0'
        if(get.isLuckyStar(player)){ 
            event.num=6; 
            player.throwDice(6); 
        } 
        else player.throwDice();
        'step 1'
        if(event.num>4){
            trigger.cancel();
        };
     
              
    },
            },
            "WH40K_ATK50":{
                trigger:{
                    source:"damageBegin",
                },
                priority:15,
                filter:function (event,player){
        return event.card&&(event.card.name=='sha')&&event.notLink();
    },
                forced:true,
                content:function (){       
        player.addTempSkill('unequip','shaAfter');
        trigger.num+=49;
    },
                ai:{
                    unequip:true,
                    skillTagFilter:function (player,tag,arg){
            if(arg&&arg.name=='sha') return true;
            return false;
        },
                },
            },
            "WH40K_UM_TaticalMaster":{
                zhuSkill:true,
                forced:true,
                frequent:true,
                trigger:{
                    global:"useCard",
                },
                filter:function(event,player){ 
        return get.type(event.card,'WH40K_Tactical')=='WH40K_Tactical'&&event.card.isCard&&event.player.identity=='zhong'&&player.identity=='zhu'; 
    },
                content:function(){
        player.draw(5);
        event.player.draw(5);
    },
            },
            "WH40K_UM_ChapterMaster1":{
                forced:true,
                frequent:true,
                trigger:{
                    global:"phaseBegin",
                },
                filter:function (event,player){
        return event.player.identity=='zhu'&&player.identity=='zhong'&&event.player.group=="WH40K_SM";
    },
                content:function(){
        trigger.player.draw(8);
        trigger.player.recover(8);
    },
            },
            "WH40K_UM_ChapterMaster2":{
                forced:true,
                frequent:true,
                trigger:{
                    global:"phaseBegin",
                },
                filter:function (event,player){
        return event.player.identity=='zhong'&&player.identity=='zhu'&&event.player.group=="WH40K_SM";
    },
                content:function(){
        trigger.player.draw(8);
        trigger.player.recover(8);
    },
            },
            "WH40K_UM_ChapterMaster3":{
                forced:true,
                frequent:true,
                trigger:{
                    global:"phaseBegin",
                },
                filter:function (event,player){
        return event.player.identity==player.identity&&event.player.group=="WH40K_SM";
    },
                content:function(){
        trigger.player.draw(8);
        trigger.player.recover(8);
    },
            },
            "WH40K_UM_ChapterMaster":{
                forced:true,
                direct:true,
                unique:true,
                locked:true,
                group:["WH40K_UM_ChapterMaster1","WH40K_UM_ChapterMaster2","WH40K_UM_ChapterMaster3"],
            },
            "WH40K_UM_HeraclesArmour":{
                forced:true,
                frequent:true,
                trigger:{
                    player:"damageBefore",
                },
                filter:function (event,player){   
        return player.isAlive();
    },
                content:function (){
        'step 0'
        if(get.isLuckyStar(player)){ 
            event.num=6; 
            player.throwDice(6); 
        } 
        else player.throwDice();
        'step 1'
        if(event.num==6){
            trigger.cancel();
        }else trigger.num-=Math.floor(trigger.num/2);
        
        
    },
            },
        },
        translate:{
            "WH40K_UME":"不屈意志",
            "WH40K_UME_info":"锁定技，当你受到伤害，你随机摸0~6张牌",
            "WH40K_ATK28":"基础伤害",
            "WH40K_ATK28_info":"锁定技，你使用【杀】造成的伤害为28且无视防具。",
            "WH40K_ThunderAssualt":"雷霆突击",
            "WH40K_ThunderAssualt_info":"锁定技，当你使用一张杀时，你投一枚骰子，若结果大于3，此杀无法闪避，否则你摸X张牌并流失X点体力(X为骰子点数)",
            "WH40K_Armour1":"动力装甲",
            "WH40K_Armour1_info":"锁定技，当你即将受到伤害时，你投一枚骰子，若结果大3，此杀伤害减半；若结果等于6，此伤害无效",
            "WH40K_ATK23":"基础伤害",
            "WH40K_ATK23_info":"锁定技，你使用【杀】造成的伤害为23且无视防具。",
            "WH40K_Shoot":"射击",
            "WH40K_Shoot_info":"锁定技，出牌阶段限一次，你可以弃置一张牌并选择一名角色，视为你对其使用一张杀",
            "WH40K_ PreciseHit":"精准命中",
            "WH40K_ PreciseHit_info":"锁定技，当你使用一张杀时，你投一枚骰子，若结果大于4，此杀无法闪避且伤害提升50%，否则你摸0~3张牌",
            "WH40K_Armour2":"动力装甲",
            "WH40K_Armour2_info":"锁定技，当你即将受到伤害时，你投一枚骰子，若结果大于3，此杀伤害减半",
            "WH40K_Range":"远射",
            "WH40K_Range_info":"你使用的杀无距离限制",
            "WH40K_ATK18":"基础伤害",
            "WH40K_ATK18_info":"锁定技，你使用【杀】造成的伤害为18且无视防具。",
            "WH40K_Scared":"恐怖化身",
            "WH40K_Scared_info":"锁定技，当你即将受到伤害时，此杀对你的伤害-25%",
            "WH40K_CATK":"精准暴击",
            "WH40K_CATK_info":"<span class=\"yellowtext\"><b><span class=\"yellowtext\"><b><span class=\"yellowtext\"><b>锁定技</b></span></b></span></b></span>，当你<span style=\"color:#00FFFF\"><span style=\"color:#00FFFF\"><span style=\"color:#00FFFF\">使用</span></span></span>一张杀时，你投一枚骰子，若结果大于2，此杀无法闪避，否则你摸0~2张牌",
            "WH40K_ATK22":"基础伤害",
            "WH40K_ATK22_info":"锁定技，你使用【杀】造成的伤害为22且无视防具。",
            "WH40K_Assual1":"潜杀",
            "WH40K_Assual1_info":"锁定技，出牌阶段限一次，对距离为2或以内的角色使用，你可以将移动到任意一名角色的前一位，视为对其使用了一张不计入出杀次数的杀，并获得目标一张牌",
            "WH40K_Steal":"劫掠",
            "WH40K_Steal_info":"当你使用【杀】指定目标时，你可获得目标角色的一张手牌",
            "WH40K_UM_Flag1":"战旗",
            "WH40K_UM_Flag1_info":"锁定技，每名角色的准备阶段，若该角色与你阵营相同，该角色摸3张牌",
            "WH40K_ATK13":"基础伤害",
            "WH40K_ATK13_info":"锁定技，你使用【杀】造成的伤害为13且无视防具。",
            "WH40K_UM_Flag2":"战旗",
            "WH40K_UM_Flag2_info":"锁定技，每名角色的准备阶段，若该角色与你阵营相同，该角色摸3张牌",
            "WH40K_UM_Flag3":"战旗",
            "WH40K_UM_Flag3_info":"锁定技，每名角色的准备阶段，若该角色与你阵营相同，该角色摸3张牌",
            "WH40K_UM_Flag":"战旗",
            "WH40K_UM_Flag_info":"锁定技，每名角色的准备阶段，若该角色与你阵营相同，该角色摸3张牌",
            "WH40K_UM_Health1":"药剂",
            "WH40K_UM_Health1_info":"锁定技，每名角色的准备阶段，若该角色与你阵营相同，该角色回复X点体力(X为该角色体力上限的10%)",
            "WH40K_UM_Health2":"药剂",
            "WH40K_UM_Health2_info":"锁定技，每名角色的准备阶段，若该角色与你阵营相同，该角色回复X点体力(X为该角色体力上限的10%)",
            "WH40K_UM_Health3":"药剂",
            "WH40K_UM_Health3_info":"锁定技，每名角色的准备阶段，若该角色与你阵营相同，该角色回复X点体力(X为该角色体力上限的10%)",
            "WH40K_UM_Health":"药剂",
            "WH40K_UM_Health_info":"锁定技，每名角色的准备阶段，若该角色与你阵营相同，该角色回复X点体力(X为该角色体力上限的10%)",
            "WH40K_ATK15":"基础伤害",
            "WH40K_ATK15_info":"锁定技，你使用【杀】造成的伤害为15且无视防具。",
            "WH40K_UM_Save1":"急救",
            "WH40K_UM_Save1_info":"锁定技，当一名同阵营角色进入濒死状态时，你投一枚骰子，若结果大于4，角色回复至体力上限的20%",
            "WH40K_UM_Save2":"急救",
            "WH40K_UM_Save2_info":"锁定技，当一名同阵营角色进入濒死状态时，你投一枚骰子，若结果大于4，角色回复至体力上限的20%",
            "WH40K_UM_Save3":"急救",
            "WH40K_UM_Save3_info":"锁定技，当一名同阵营角色进入濒死状态时，你投一枚骰子，若结果大于4，角色回复至体力上限的20%",
            "WH40K_UM_Save":"急救",
            "WH40K_UM_Save_info":"锁定技，当一名同阵营角色进入濒死状态时，你投一枚骰子，若结果大于4，角色回复至体力上限的20%",
            "WH40K_IronHalo1":"铁光环",
            "WH40K_IronHalo1_info":"主公技，当一名同阵营阿斯塔特进入濒死状态时，你可以投一枚骰子，若结果大于4，你使他回复至5点体力",
            "WH40K_IronHalo2":"铁光环",
            "WH40K_IronHalo2_info":"主公技，当一名同阵营阿斯塔特进入濒死状态时，你可以投一枚骰子，若结果大于4，你使他回复至5点体力",
            "WH40K_IronHalo":"铁光环",
            "WH40K_IronHalo_info":"主公技，当一名同阵营阿斯塔特进入濒死状态时，你可以投一枚骰子，若结果大于4，你使他回复至5点体力",
            "WH40K_UM_Smoke1":"烟雾",
            "WH40K_UM_Smoke1_info":"锁定技，你不能成为杀的目的直到你的下回合开始",
            "WH40K_UM_Smoke":"烟雾弹",
            "WH40K_UM_Smoke_info":"锁定技，每两回合限一次，你获得技能\"烟雾\"",
            "WH40K_UM_Hide1":"渗透",
            "WH40K_UM_Hide1_info":"你防止锦囊牌造成的伤害",
            "WH40K_UM_Hide2":"渗透",
            "WH40K_UM_Hide2_info":"当其他玩家使用【杀】指定你为目标时，需额外弃掉一张基本牌，否则该牌对你无效",
            "WH40K_UM_Hide":"渗透",
            "WH40K_UM_Hide_info":"锁定技 当其他玩家使用【杀】指定你为目标时，需额外弃掉一张基本牌，否则该牌对你无效。你防止受到锦囊牌造成的伤害",
            "WH40K_PhychicSoul":"灵魂之海",
            "WH40K_PhychicSoul_info":"每两轮限一次，准备阶段，你投一枚骰子，若结果大于3，你选择一张灵能牌获得之，若结果不大于3，你失去X点体力并摸X张牌(X为骰子的点数)",
            "WH40K_ATK29":"基础伤害",
            "WH40K_ATK29_info":"锁定技，你使用【杀】造成的伤害为29且无视防具。",
            "WH40K_PhychicActual":"灵能定位",
            "WH40K_PhychicActual_info":"<span class=\"yellowtext\"><b><span class=\"yellowtext\"><b><span class=\"yellowtext\"><b><span class=\"yellowtext\"><b><span class=\"yellowtext\"><b><span class=\"yellowtext\"><b>锁定技</b></span></b></span></b></span></b></span></b></span></b></span>，当你<span style=\"color:#00FFFF\"><span style=\"color:#00FFFF\"><span style=\"color:#00FFFF\"><span style=\"color:#00FFFF\"><span style=\"color:#00FFFF\"><span style=\"color:#00FFFF\">使用</span></span></span></span></span></span>一张杀时，你投一枚骰子，若结果大于4，此杀无法闪避且<span style=\"color:#FFC0CB\"><span style=\"color:#FFC0CB\"><span style=\"color:#FFC0CB\"><span style=\"color:#FFC0CB\"><span style=\"color:#FFC0CB\"><span style=\"color:#FFC0CB\">伤害</span></span></span></span></span></span>提升50%，否则你摸0~3张牌",
            "WH40K_UM_CenturionMissile":"百夫长飞弹",
            "WH40K_UM_CenturionMissile_info":"锁定技，出牌阶段限一次，你可以选择一名角色，对其造成6*5点伤害，然后你摸1张牌并回复1点体力",
            "WH40K_SM_CenturionArmour":"百夫长动力甲",
            "WH40K_SM_CenturionArmour_info":"锁定技，当你即将受到伤害时，你投一枚骰子，若结果等于2，此杀伤害减半，若结果大于2，此杀伤害减75%",
            "WH40K_ATK30":"基础伤害",
            "WH40K_ATK30_info":"锁定技，你使用【杀】造成的伤害为30且无视防具。",
            "WH40K_UM_StormG":"风暴雷",
            "WH40K_UM_StormG_info":"锁定技，出牌阶段限一次，你可以至多选择三名角色，对其造成4*5点伤害",
            "WH40K_UM_FlameCannon":"焚化炮",
            "WH40K_UM_FlameCannon_info":"锁定技，出牌阶段限一次，你可以选择一名角色，对其造成3*5点火焰伤害",
            "WH40K_TaticalWarsuit":"战术机甲",
            "WH40K_TaticalWarsuit_info":"锁定技，当你即将受到伤害时，你投一枚骰子，若结果等于2，此杀伤害减半，若结果大于2，此杀伤害减75%",
            "WH40K_ATK31":"基础伤害",
            "WH40K_ATK31_info":"锁定技，你使用【杀】造成的伤害为31且无视防具。",
            "WH40K_ATK40":"基础伤害",
            "WH40K_ATK40_info":"锁定技，你使用【杀】造成的伤害为40且无视防具。",
            "WH40K_PhychicSoul2":"灵魂之海",
            "WH40K_PhychicSoul2_info":"每两轮限一次，准备阶段，你投一枚骰子，若结果大2，你选择一张灵能牌获得之，若结果不大于3，你失去X点体力并摸X张牌(X为骰子的点数)",
            "WH40K_UM_Sword":"动力剑",
            "WH40K_UM_Sword_info":"当你的杀被闪避后，可以投一枚骰子，若结果大于3，目标需再打出一张闪",
            "WH40K_UM_StormShield":"风暴盾",
            "WH40K_UM_StormShield_info":"锁定技，当你即将受到伤害时，你投一枚骰子，若结果大于3，此伤害无效",
            "WH40K_UM_Hero1":"连队英雄",
            "WH40K_UM_Hero1_info":"锁定技，每名角色的准备阶段，若该角色与你阵营相同，该角色摸4张牌",
            "WH40K_UM_Hero2":"连队英雄",
            "WH40K_UM_Hero2_info":"锁定技，每名角色的准备阶段，若该角色与你阵营相同，该角色摸4张牌",
            "WH40K_UM_Hero3":"连队英雄",
            "WH40K_UM_Hero3_info":"锁定技，每名角色的准备阶段，若该角色与你阵营相同，该角色摸4张牌",
            "WH40K_UM_Hero":"连队英雄",
            "WH40K_UM_Hero_info":"锁定技，每名角色的准备阶段，若该角色与你阵营相同，该角色摸4张牌",
            "WH40K_UM_ActualTactical":"精准战术",
            "WH40K_UM_ActualTactical_info":"锁定技，当任意角色使用战术牌，你摸两张牌",
            "WH40K_UM_ACFlag1":"不败战旗",
            "WH40K_UM_ACFlag1_info":"锁定技，每名角色的准备阶段，若该角色与你阵营相同，该角色摸5张牌并回复5点体力",
            "WH40K_UM_ACFlag2":"不败战旗",
            "WH40K_UM_ACFlag2_info":"锁定技，每名角色的准备阶段，若该角色与你阵营相同，该角色摸5张牌并回复5点体力",
            "WH40K_UM_ACFlag3":"不败战旗",
            "WH40K_UM_ACFlag3_info":"锁定技，每名角色的准备阶段，若该角色与你阵营相同，该角色摸5张牌并回复5点体力",
            "WH40K_UM_ACFlag":"不败战旗",
            "WH40K_UM_ACFlag_info":"锁定技，每名角色的准备阶段，若该角色与你阵营相同，该角色摸5张牌并回复5点体力",
            "WH40K_Bike_HeavyBluster":"重爆弹",
            "WH40K_Bike_HeavyBluster_info":"锁定技，出牌阶段限一次，你可以选择一名角色，对其造成2*14点伤害",
            "WH40K_Bike_Assualt":"突击",
            "WH40K_Bike_Assualt_info":"锁定技，出牌阶段限一次，对一名角色使用，你可以将移动到任意一名角色的前一位，视为对其使用了一张不计入出杀次数的杀，并获得目标一张牌",
            "WH40K_ATK37":"基础伤害",
            "WH40K_ATK37_info":"锁定技，你使用【杀】造成的伤害为37且无视防具。",
            "WH40K_UM_Supp":"压制",
            "WH40K_UM_Supp_info":"锁定技，当你使用一张杀时，你可以将与目标相邻的角色追加为额外目标",
            "WH40K_UM_Fire":"火力全开",
            "WH40K_UM_Fire_info":"当你的杀被闪避后，可以投一枚骰子，若结果大于3，目标需再打出一张闪",
            "WH40K_UM_MarkE":"观察射击",
            "WH40K_UM_MarkE_info":"锁定技，出牌阶段限一次，你可以选择一名角色，对其造成35点伤害",
            "WH40K_UM_HideC":"迷彩斗篷",
            "WH40K_UM_HideC_info":"锁定技，当你即将受到伤害时，你投一枚骰子，若结果等于3，此杀伤害减半，若结果大3，此杀伤害减75%",
            "WH40K_ATK20":"基础伤害",
            "WH40K_ATK20_info":"锁定技，你使用【杀】造成的伤害为20且无视防具。",
            "WH40K_ PreciseHit2":"屏息瞄准",
            "WH40K_ PreciseHit2_info":"锁定技，当你使用一张杀时，你投一枚骰子，若结果大于2，此杀无法闪避且伤害提升50%，否则你摸0~3张牌",
            "WH40K_Typhoon":"台风飞弹",
            "WH40K_Typhoon_info":"锁定技，出牌阶段限一次，你可以至多选择两名角色，对其造成3*10点伤害",
            "WH40K_ATK62":"基础伤害",
            "WH40K_ATK62_info":"锁定技，你使用【杀】造成的伤害为62且无视防具。",
            "WH40K_ATKG":"扫射",
            "WH40K_ATKG_info":"锁定技，当你使用一张杀时，你可以将与目标相邻的角色追加为额外目标",
            "WH40K_UM_GunShip":"炮艇",
            "WH40K_UM_GunShip_info":"锁定技，当你即将受到伤害时，你投一枚骰子，若结果大于3，此杀伤害减半",
            "WH40K_UM_SpellMaster1":"预言大师",
            "WH40K_UM_SpellMaster1_info":"主公技，友方阿斯塔特准备阶段，你可以观看牌堆顶的X张牌，并将其以任意顺序置于牌堆项或牌堆底。（X为存活人数且至多为10）",
            "WH40K_UM_SpellMaster2":"预言大师",
            "WH40K_UM_SpellMaster2_info":"主公技，友方阿斯塔特准备阶段，你可以观看牌堆顶的X张牌，并将其以任意顺序置于牌堆项或牌堆底。（X为存活人数且至多为10）",
            "WH40K_UM_SpellMaster":"预言大师",
            "WH40K_UM_SpellMaster_info":"主公技，友方阿斯塔特准备阶段，你可以观看牌堆顶的X张牌，并将其以任意顺序置于牌堆项或牌堆底。（X为存活人数且至多为10）",
            "WH40K_PhychicCh":"灵能干扰",
            "WH40K_PhychicCh_info":"锁定技，当任意角色使用灵能牌，你投一枚骰子，若结果大于4，该牌取消",
            "WH40K_ATK50":"基础伤害",
            "WH40K_ATK50_info":"锁定技，你使用【杀】造成的伤害为50且无视防具。",
            "WH40K_UM_TaticalMaster":"战术大师",
            "WH40K_UM_TaticalMaster_info":"主公技，当友方角色使用战术牌，你与其摸五张牌",
            "WH40K_UM_ChapterMaster1":"战团长",
            "WH40K_UM_ChapterMaster1_info":"锁定技，每名友方阿斯塔特的准备阶段，若该角色与你阵营相同，该角色摸8张牌并回复8点体力",
            "WH40K_UM_ChapterMaster2":"战团长",
            "WH40K_UM_ChapterMaster2_info":"锁定技，每名友方阿斯塔特的准备阶段，若该角色与你阵营相同，该角色摸8张牌并回复8点体力",
            "WH40K_UM_ChapterMaster3":"战团长",
            "WH40K_UM_ChapterMaster3_info":"锁定技，每名友方阿斯塔特的准备阶段，若该角色与你阵营相同，该角色摸8张牌并回复8点体力",
            "WH40K_UM_ChapterMaster":"战团长",
            "WH40K_UM_ChapterMaster_info":"锁定技，每名友方阿斯塔特的准备阶段，若该角色与你阵营相同，该角色摸8张牌并回复8点体力",
            "WH40K_UM_HeraclesArmour":"海格力斯战甲",
            "WH40K_UM_HeraclesArmour_info":"锁定技，当你即将受到伤害时，你投一枚骰子，若结果等于6，此伤害无效；你受到的伤害永远减半",
        },
    },
    intro:"",
    author:"无名玩家",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["WH40K_UM_Calgar.jpg"],"card":["WH40K_PhychicRecover.jpg"],"skill":[]}}};