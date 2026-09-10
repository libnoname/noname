import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"朱绩",content:function(config,pack){
    
},precontent:function(){
    
},config:{},help:{},package:{
    character:{
        character:{
            mb_zhuji: ['male', 'wu', 4, ['sjiezhu','shuanshi']],
            mb_shiji: ['male', 'wu', 4, ['sjiezhu','sjianlv'], ['unseen']],
        },
        translate: {
			mb_zhuji: "朱绩",
			mb_shiji: "施绩",
        },
    },
    card:{
        card:{},
        translate:{},
        list:[],
    },
    skill:{
        skill:{
    sjiezhu:{
    audio:4,
    enable:'phaseUse',
    usable:1,
    filter:function(event,player){
        var allCounts=game.filterPlayer().map(p=>p.countCards('h'));
        var current=player.countCards('h');
        var existing=new Set(allCounts);
        
        var uniqueSmaller=[];
        for(var i=0;i<current;i++){
            if(!existing.has(i)) uniqueSmaller.push(i);
        }
        return uniqueSmaller.length>0;
    },
    content:function(){
        'step 0'
        var allCounts=game.filterPlayer().map(p=>p.countCards('h'));
        var current=player.countCards('h');
        var existing=new Set(allCounts);
        
        var uniqueSmaller=[];
        for(var i=0;i<current;i++){
            if(!existing.has(i)) uniqueSmaller.push(i);
        }
        
        event.discardTarget=Math.max.apply(null,uniqueSmaller);
        event.discardCount=current-event.discardTarget;
        
        player.logSkill('sjiezhu');

        if(event.discardCount>0){
            player.chooseToDiscard(event.discardCount,true,'h');
        }else{
            event.finish();
        }
        
        'step 1'
        event.X=event.discardCount;
        
        player.chooseTarget(
            '竭逐：视为使用【杀】，选择至多'+event.X+'名目标',
            [1,event.X],
            function(card,player,target){
                return player.canUse({name:'sha'},target,false);
            }
        );
        
        'step 2'
        if(result.bool){
            event.targets=result.targets;
            event.actualTargetCount=result.targets.length;
            event.timestamp=game.roundNumber+'_'+game.shuffleNumber+'_'+get.time();
            
            var sha={
                name:'sha',
                isCard:false,
                sjiezhu_timestamp:event.timestamp
            };
            
            player.useCard(sha,result.targets,false);
        }else{
            event.finish();
        }
        
        'step 3'
        game.delayx();
        
        'step 4'
        if(event.actualTargetCount!==event.X){
            event.finish();
            return;
        }
        
        var allDamaged=true;
        for(var target of event.targets){
            var damaged=false;
            var history=target.getHistory('damage');
            for(var dmg of history){
                if(dmg.source===player && dmg.card && dmg.card.sjiezhu_timestamp===event.timestamp){
                    damaged=true;
                    break;
                }
            }
            if(!damaged){
                allDamaged=false;
                break;
            }
        }
        
        if(!allDamaged){
            event.finish();
            return;
        }
        
        'step 5'
        var allCounts=game.filterPlayer().map(p=>p.countCards('h'));
        var current=player.countCards('h');
        var existing=new Set(allCounts);
        
        var drawTarget=null;
        for(var i=current+1;i<=20;i++){
            if(!existing.has(i)){
                drawTarget=i;
                break;
            }
        }
        
        if(drawTarget!==null){
            var drawNum=drawTarget-current;
            if(drawNum>0){
                player.draw(drawNum);
            }
        }
    },
    ai:{
        order:7,
        result:{
            player:function(player){
                var allCounts=game.filterPlayer().map(p=>p.countCards('h'));
                var current=player.countCards('h');
                var existing=new Set(allCounts);
                
                var uniqueSmaller=[];
                for(var i=0;i<current;i++){
                    if(!existing.has(i)) uniqueSmaller.push(i);
                }
                if(uniqueSmaller.length===0) return 0;
                
                var discardTarget=Math.max.apply(null,uniqueSmaller);
                var discardNum=current-discardTarget;
                
                var enemies=game.filterPlayer(function(target){
                    return get.attitude(player,target)<0 && 
                           player.canUse({name:'sha'},target,false);
                });
                
                if(enemies.length<discardNum) return 0;
                
                var afterDiscard=discardTarget;
                var futureCounts=allCounts.map((count,idx)=>{
                    var p=game.filterPlayer()[idx];
                    return p===player?afterDiscard:count;
                });
                var futureExisting=new Set(futureCounts);
                
                var drawTarget=null;
                for(var i=afterDiscard+1;i<=20;i++){
                    if(!futureExisting.has(i)){
                        drawTarget=i;
                        break;
                    }
                }
                
                if(drawTarget===null) return 0;
                var drawNum=drawTarget-afterDiscard;
                
                return drawNum - discardNum + discardNum * 1.5;
            }
        }
    }
},
    shuanshi: {
    audio: 3,
    dutySkill: true,
    locked: true,
    group: ["shuanshi_effect", "shuanshi_record", "shuanshi_achieve", "shuanshi_chongzhu", "shuanshi_mark"],
    derivation: "sjianlv",
    enable: "phaseUse",
    filterCard: { name: "jiu" },
    filter: function (event, player) {
        return player.countCards("h", "jiu") > 0;
    },
    content: function () {
        player.draw();
    },
    prompt: "重铸一张【酒】",
    ai: {
        order: 3,
        result: { player: 1 },
    },
    subSkill: {
        effect: {
            trigger: { source: "damageBegin1" },
            forced: true,
            filter: function (event, player) {
                var shaCount = player.getHistory("useCard", function (evt) {
                    return evt.card.name == "sha";
                }).length;
                return shaCount == 1 && event.card && event.card.name == "sha";
            },
            content: function () {
                trigger.num++;
            },
            sub: true,
        },
        record: {
            trigger: { player: "damageBegin4", source: "damageBegin1" },
            forced: true,
            silent: true,
            popup: false,
            firstDo: true,
            content: function () {
                player.storage.shuanshi_hp = player.hp;
            },
            sub: true,
        },
        achieve: {
            audio: "shuanshi",
            trigger: { player: "damageAfter", source: "damageSource" },
            forced: true,
            skillAnimation: true,
            animationColor: "wood",
            filter: function (event, player) {
                if (player.storage.shuanshi_hp === undefined) return false;
                return event.num == player.storage.shuanshi_hp;
            },
            content: function () {
                "step 0";
                game.log(player, "成功完成使命");
                player.awakenSkill("shuanshi");
                player.shixiaoSkill("shuanshi");

                "step 1";
                player.addSkillLog("sjianlv");

                "step 2";
                player.node.avatar.setBackground("mb_shiji", "character");
                player.node.avatar2.setBackground("mb_shiji", "character");
                player.name = "mb_shiji";
                player.name1 = "mb_shiji";
                player.node.name.innerHTML = get.slimName("mb_shiji");

                "step 3";
                player.addSkill("mb_shiji");

                "step 4";
                delete player.storage.shuanshi_hp;
            },
            sub: true,
        },
        chongzhu: {
            mark: false,
            sub: true,
        },
        mark: {
            mark: false,
            sub: true,
        },
    },
    mod: {
        cardEnabled: function (card, player) {
            if (card.name == "jiu" && player.hp > 0) return false;
        },
        cardSavable: function (card, player) {
            if (card.name == "jiu" && player.hp > 0) return false;
        },
    },
},
    sjianlv: {
    audio: 3,
    trigger: { player: "loseEnd" },
    filter: function (event, player) {
        if (event.type != "discard") return false;

        var discardCount = 0;
        for (var i = 0; i < event.cards.length; i++) {
            var card = event.cards[i];
            if (get.position(card) == "d") {
                discardCount++;
            }
        }
        if (discardCount == 0) return false;

        var x = player.storage.sjianlv || 1;
        return discardCount >= x;
    },
    direct: true,
    init: function (player, skill) {
        player.storage.sjianlv = 1;  
    },
    mark: true,
    marktext: "兼虑",  
    intro: {
        content: function (storage, player) {
            var triggeredCount = player.storage.sjianlv_count || 0;
            return "下次需弃" + storage + "张牌";
        },
    },
    content: function () {
        "step 0";
        var discardCount = 0;
        for (var i = 0; i < trigger.cards.length; i++) {
            var card = trigger.cards[i];
            if (get.position(card) == "d") {
                discardCount++;
            }
        }
        event.discardCount = discardCount;
        event.x = player.storage.sjianlv || 1;

        player
            .chooseTarget(
                "兼虑：弃置了" + discardCount + "张牌（需≥" + event.x + "），是否对一名其他角色造成1点伤害？",
                function (card, player, target) {
                    return target != player;
                }
            )
            .set("ai", function (target) {
                var player = _status.event.player;
                return get.damageEffect(target, player, player);
            });

        "step 1";
        if (result.bool) {
            event.target = result.targets[0];
            player.logSkill("sjianlv", event.target);

            player.storage.sjianlv_count = (player.storage.sjianlv_count || 0) + 1;
            player.storage.sjianlv = (player.storage.sjianlv || 1) + 1;
            player.markSkill("sjianlv");

            event.target.damage("nocard");
        } else {
            event.finish();
        }

        "step 2";
        if (event.target.isDead()) {
            player
                .chooseControl("重置X", "再造成1点伤害", "cancel2")
                .set("prompt", "兼虑：目标已死亡，请选择一项")
                .set("ai", function () {
                    var player = _status.event.player;
                    var enemies = game.filterPlayer(function (target) {
                        return (
                            target != player &&
                            get.attitude(player, target) < 0 &&
                            target != _status.event.getParent().target
                        );
                    });
                    if (enemies.length > 0) return "再造成1点伤害";
                    return "重置X";
                });
        } else {
            event.finish();
        }
        "step 3";
        if (result.control == "重置X") {
            player.storage.sjianlv_count = 0;
            player.storage.sjianlv = 1; 
            player.markSkill("sjianlv");
            event.finish();
        } else if (result.control == "再造成1点伤害") {
            player
                .chooseTarget("兼虑：对另一名其他角色造成1点伤害", function (card, player, target) {
                    return target != player && target != event.target;
                })
                .set("ai", function (target) {
                    return get.damageEffect(target, _status.event.player, _status.event.player);
                });
        } else {
            event.finish();
        }

        "step 4";
        if (result.bool) {
            player.logSkill("sjianlv", result.targets[0]);
            result.targets[0].damage("nocard");
        }
    },
    ai: {
        threaten: 2,
    },
},
},
                translate:{
			sjiezhu: '竭逐',
			sjiezhu_info: '每回合限一次，你可将手牌弃置至最接近的唯一值，视为使用一张指定至多X名角色为目标、不计入次数且无距离次数限制的普通【杀】(X为弃置牌数）。此【杀】结算后，若此【杀】目标数为X且对所有目标造成伤害，你将手牌摸至最接近的唯一值。',
			shuanshi: '还施',
			shuanshi_info: '使命技，你每回合使用首张【杀】伤害+1；你于非濒死状态时无法使用但可重铸【酒】。成功：你造成或受到伤害后，若本次伤害值等于你体力值，你获得〖兼虑〗。',
			sjianlv: '兼虑',
			sjianlv_info: '你一次性弃置至少X张牌时(X为本技能已触发次数+1），你可对一名其他角色造成1点伤害。若其因此死亡，你选择一项:1.重置此技能的X;2.对一名其他角色造成1点伤害。',
        },
    },
    intro:"",
    author:"<img style=width:80px;border-radius:100%; src=" + lib.assetURL + "extension/朱绩/author/v.jpg></img>   <b><small><strong>v</strong></small></b>",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":[],"card":[],"skill":[]}}};
