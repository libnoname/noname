import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"戏志才",content:function (config,pack){
    
},precontent:function (){
    
},help:{},config:{},package:{
    character:{
        character:{
            "戏子":["male","shen",10,["zyile_xuwu","rebeige","huituo","wang_diaochan_qidun","wang_diaochan_lianxiang","tiandu","new_reyiji","xinfu_qianchong","wsqq_雷鸣","xianfu","rejieming","repojun","xshangjian","筹策","ly_junshenbao_simayi_guicai","ly_junshenbao_maliang_zishu"],["forbidai"]],
        },
        translate:{
            "戏子":"戏子",
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
            "筹策":{
                trigger:{
                    player:["damageEnd","recoverAfter"],
                },
                content:function (){
        'step 0'
        event.num=trigger.num;
        'step 1'
        player.judge();
        'step 2'
        event.color=result.color;
        if(event.color=='black'){
            player.chooseTarget('弃置一名角色区域内的一张牌',function(card,player,target){
                return target.countCards('hej');
            }).set('ai',function(target){
                var player=_status.event.player;
                var att=get.attitude(player,target);
                if(att<0){
                    att=-Math.sqrt(-att);
                }
                else{
                    att=Math.sqrt(att);
                }
                return att*lib.card.guohe.ai.result.target(player,target);
            })
        }
        else{
            var next=player.chooseTarget('令一名角色摸一张牌');
            if(player.storage.xianfu2&&player.storage.xianfu2.length){
                next.set('prompt2','（若目标为'+get.translation(player.storage.xianfu2)+'则改为摸两张牌）');
            }
            next.set('ai',function(target){
                var player=_status.event.player;
                var att=get.attitude(player,target)/Math.sqrt(1+target.countCards('h'));
                if(player.storage.xianfu2&&player.storage.xianfu2.contains(target)) return att*2;
                return att;
            })
        }
        'step 3'
        if(result.bool){
            var target=result.targets[0];
            player.line(target,'green');
            if(event.color=='black'){
                player.discardPlayerCard(target,'hej',true);
            }
            else{
                if(player.storage.xianfu2&&player.storage.xianfu2.contains(target)){
                    if(!target.storage.xianfu_mark) target.storage.xianfu_mark=[];
                    target.storage.xianfu_mark.add(player);
                    target.storage.xianfu_mark.sortBySeat();
                    target.markSkill('xianfu_mark');
                    target.draw(2);
                }
                else{
                    target.draw();
                }
            }
        }
        'step 4'
        if(--event.num>0){
            player.chooseBool(get.prompt2('chouce'));
        }
        else{
            event.finish();
        }
        'step 5'
        if(result.bool){
            player.logSkill('chouce');
            event.goto(1);
        }
    },
                ai:{
                    maixie:true,
                    "maixie_hp":true,
                    effect:{
                        target:function (card,player,target){
                if(get.tag(card,'damage')){
                    if(player.hasSkillTag('jueqing',false,target)) return [1,-2];
                    if(!target.hasFriend()) return;
                    if(target.hp>=4) return [1,get.tag(card,'damage')*1.5];
                    if(target.hp==3) return [1,get.tag(card,'damage')*1];
                    if(target.hp==2) return [1,get.tag(card,'damage')*0.5];
                }
            },
                    },
                },
            },
            "演谋":{
                audio:"wylianji",
                enable:"phaseUse",
                usable:1,
                filter:function (event,player){
        return game.players.length>1;
    },
                filterTarget:function (card,player,target){
        return player!=target;
    },
                targetprompt:["打人","被打"],
                selectTarget:2,
                multitarget:true,
                content:function (){
        'step 0'
        game.delay(0.5);
        if(targets[0].isDisabled(1)) event.goto(2);
        'step 1'
        var target=targets[0];
        var equip1=get.cardPile2(function(card){
            return get.subtype(card)=='equip1';
        });
        if(!equip1){
            player.popup('连计失败');
            game.log('牌堆中无装备');
            event.finish();
            return;
        }
        if(equip1.name=='qinggang'&&!lib.inpile.contains('qibaodao')){
            equip1.remove();
            equip1=game.createCard('qibaodao',equip1.suit,equip1.number);
        }
        target.$draw(equip1);
        target.chooseUseTarget(equip1,'noanimate','nopopup',true);
        'step 2'
        game.updateRoundNumber();
        var list=['nanman','wanjian','huogong','juedou','sha'];
        var list2=game.players.slice(0);
        list2.remove(player);
        for(var i=0;i<list.length;i++){
            if(!targets[0].canUse(list[i],targets[1],false)) list.splice(i--,1);
        }
        if(!list.length) return;
        var name=list.randomGet();
        if(name=='nanman'||name=='wanjian'){
            for(var i=0;i<list2.length;i++){
                if(!targets[0].canUse(name,list2[i],false)) list2.splice(i--,1);
            }
        }
        else list2=targets[1];
        targets[0].useCard({name:name,isCard:true},list2,'noai');
        game.delay(0.5);
    },
                ai:{
                    order:8,
                    result:{
                        target:function (player,target){
                if(ui.selected.targets.length==0){
                    return 1;
                }
                else{
                    return -1;
                }
            },
                    },
                    expose:0.4,
                    threaten:3,
                },
                group:"relianji_count",
                subSkill:{
                    count:{
                        sub:true,
                        forced:true,
                        popup:false,
                        silent:true,
                        trigger:{
                            global:"damageEnd",
                        },
                        filter:function (event,player){
                var evt=event.getParent(3);
                return evt&&evt.name=='relianji'&&evt.player==player;
            },
                        content:function (){
                if(!player.storage.relianji) player.storage.relianji=0;
                player.storage.relianji++;
                if(player.storage.relianji>2){
                    event.trigger('remoucheng_awaken');
                }
            },
                    },
                },
            },
            "焚心":{
                mode:["identity"],
                trigger:{
                    source:"dieBegin",
                },
                init:function (player){
        player.storage.fenxin=false;
    },
                intro:{
                    content:"limited",
                },
                skillAnimation:"epic",
                animationColor:"fire",
                unique:true,
                limited:true,
                audio:"ext:戏志才:2",
                mark:true,
                filter:function (event,player){
        if(player.storage.fenxin) return false;
        return event.player.identity!='zhu'&&player.identity!='zhu'&&
            player.identity!='mingzhong'&&event.player.identity!='mingzhong';
    },
                check:function (event,player){
        if(player.identity==event.player.identity) return Math.random()<0.5;
        var stat=get.situation();
        switch(player.identity){
            case 'fan':
                if(stat<0) return false;
                if(stat==0) return Math.random()<0.6;
                return true;
            case 'zhong':
                if(stat>0) return false;
                if(stat==0) return Math.random()<0.6;
                return true;
            case 'nei':
                if(event.player.identity=='fan'&&stat<0) return true;
                if(event.player.identity=='zhong'&&stat>0) return true;
                if(stat==0) return Math.random()<0.7;
                return false;
        }
    },
                prompt:function (event,player){
        return '焚心：是否与'+get.translation(event.player)+'交换身份？';
    },
                content:function (){
        game.broadcastAll(function(player,target,shown){
            var identity=player.identity;
            player.identity=target.identity;
            if(shown||player==game.me){
                player.setIdentity();
            }
            target.identity=identity;
        },player,trigger.player,trigger.player.identityShown);
        player.line(trigger.player,'green');
        player.storage.fenxin=true;
        player.awakenSkill('fenxin_old');
    },
            },
        },
        translate:{
            "筹策":"筹策",
            "筹策_info":"当你受到1点伤害或回复1点体力后，你可以判定，若结果为：黑色，你弃置一名角色区域里的一张牌；红色，你选择一名角色摸一张牌（如果是先辅的角色摸两张）。",
            "演谋":"演谋",
            "演谋_info":"出牌阶段限一次，你可以选择两名其他角色。第一名角色随机使用牌堆中的一张武器牌，然后这名角色视为对另一名角色随机使用一张伤害型的牌。",
            "焚心":"焚心",
            "焚心_info":"当你杀死一名非主公角色时，你可以与其交换未翻开的身份牌。",
        },
    },
    intro:"",
    author:"淰沁",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["戏子.jpg"],"card":[],"skill":[]}}};