import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"神州平板",content:function (config,pack){
      
},precontent:function (){
    
},help:{},config:{},package:{
    character:{
        character:{
            "FH_Fuka":["female","beng",4,["FH_niepan","FH_XWGX","FH_WX","FH_ZQTY","FH_CJ"],["des:圣芙蕾雅学园一年生代表，武术课代理导师、女武神武术部部长。出生于香港武学世家，从小习武，在家父的严格训练下成为了一个性格刚正凛然的少女。符华在学校中成绩名列前茅，是史上最年轻的A级女武神。但是平时一副冷漠的扑克脸形象加上过于认真的处事态度让她显得有些固执和死板。<br><br>“先有符华后有天,寸劲开天秒神仙”<br><br>“浮华上仙法力无边，神州平板寸劲开天”"]],
            "FH_Fuka_chiyuan":["female","beng",0,["FH_CHZY","FH_ZY","FH_FCB","FH_XS"],["unseen","des:传说，在神州有一位仙人，每当神州遭遇劫难，仙人便会消灾除厄，保神州安宁。无论是外敌来犯，还是崩坏爆发，在这位仙人面前都伤不到神州分毫。<br>仙人名唤“赤鸢”，白发而赤瞳，身披烈火，平步白云。然而，从某天起，世人就再也没有见过仙人。有人说，仙人化作了太阳，继续守护着神州。<br>她经历了许多，也忘记了许多。但那个约定，如同刻在身体最深处的烙印一般从未忘却。虽然已经难以想起许下约定的那个场面，但有一种怀念与悲伤，在她的内心之中久久不能散去。"]],
        },
        translate:{
            beng:"<span style=\"color:#FFB6C1\">崩</span>",
            "FH_Fuka":"符华",
            "FH_Fuka_chiyuan":"赤鸢仙人",
        },
        characterTitle:{
            "FH_Fuka":"<span style=\"color:#FFB6C1\">风华的武者</span><br>素衣玄裳",
            "FH_Fuka_chiyuan":"神州守护者<br>炽翎",
        },
    },
    card:{
        card:{
            "FH_chiyuan_up":{
                fullskin:true,
                type:"equip",
                subtype:"equip6",
                ai:{
                    basic:{
                        equipValue:6.5,
                        order:function (card,player){
                            if(player&&player.hasSkillTag('reverseEquip')){
                                return 8.5-get.equipValue(card,player)/20;
                            }else{
                                return 8+get.equipValue(card,player)/20;
                            };
                        },
                        useful:2,
                        value:function (card,player){
                            var value=0;
                            var info=get.info(card);
                            var current=player.getEquip(info.subtype);
                            if(current&&card!=current) value=get.value(current,player);
                            var equipValue=info.ai.equipValue;
                            if(equipValue==undefined) equipValue=info.ai.basic.equipValue;
                            if(typeof equipValue=='function') return equipValue(card,player)-value;
                            if(typeof equipValue!='number') equipValue=0;
                            return equipValue-value;
                        },
                    },
                    result:{
                        target:function (player,target){
                            return get.equipResult(player,target,name);
                        },
                    },
                },
                skills:["FH_chiyuan_zhanchi"],
                enable:true,
                selectTarget:-1,
                filterTarget:function (card,player,target){
                    return target==player;
                },
                modTarget:true,
                allowMultiple:false,
                content:function (){
                    target.equip(card);
                },
                toself:true,
            },
            "FH_chiyuan_mid":{
                fullskin:true,
                type:"equip",
                subtype:"equip7",
                ai:{
                    basic:{
                        equipValue:6.5,
                        order:function (card,player){
                            if(player&&player.hasSkillTag('reverseEquip')){
                                return 8.5-get.equipValue(card,player)/20;
                            }else{
                                return 8+get.equipValue(card,player)/20;
                            };
                        },
                        useful:2,
                        value:function (card,player){
                            var value=0;
                            var info=get.info(card);
                            var current=player.getEquip(info.subtype);
                            if(current&&card!=current) value=get.value(current,player);
                            var equipValue=info.ai.equipValue;
                            if(equipValue==undefined) equipValue=info.ai.basic.equipValue;
                            if(typeof equipValue=='function') return equipValue(card,player)-value;
                            if(typeof equipValue!='number') equipValue=0;
                            return equipValue-value;
                        },
                    },
                    result:{
                        target:function (player,target){
                            return get.equipResult(player,target,name);
                        },
                    },
                },
                skills:["FH_chiyuan_feiniao"],
                enable:true,
                selectTarget:-1,
                filterTarget:function (card,player,target){
                    return target==player;
                },
                modTarget:true,
                allowMultiple:false,
                content:function (){
                    target.equip(card);
                },
                toself:true,
            },
            "FH_chiyuan_dow":{
                fullskin:true,
                type:"equip",
                subtype:"equip8",
                ai:{
                    basic:{
                        equipValue:6.5,
                        order:function (card,player){
                            if(player&&player.hasSkillTag('reverseEquip')){
                                return 8.5-get.equipValue(card,player)/20;
                            }else{
                                return 8+get.equipValue(card,player)/20;
                            };
                        },
                        useful:2,
                        value:function (card,player){
                            var value=0;
                            var info=get.info(card);
                            var current=player.getEquip(info.subtype);
                            if(current&&card!=current) value=get.value(current,player);
                            var equipValue=info.ai.equipValue;
                            if(equipValue==undefined) equipValue=info.ai.basic.equipValue;
                            if(typeof equipValue=='function') return equipValue(card,player)-value;
                            if(typeof equipValue!='number') equipValue=0;
                            return equipValue-value;
                        },
                    },
                    result:{
                        target:function (player,target){
                            return get.equipResult(player,target,name);
                        },
                    },
                },
                skills:["FH_chiyuan_wei"],
                enable:true,
                selectTarget:-1,
                filterTarget:function (card,player,target){
                    return target==player;
                },
                modTarget:true,
                allowMultiple:false,
                content:function (){
                    target.equip(card);
                },
                toself:true,
            },
            "FH_GodKey":{
                type:"equip",
                subtype:"equip1",
                skills:["FH_GodKey_skill","FH_GodKey_skill_1","FH_GodKey_skill_2"],
                fullskin:true,
                distance:{
                    attackFrom:-1,
                },
                ai:{
                    basic:{
                        equipValue:6,
                    },
                },
            },
            "FH_GodKey_control":{
                type:"equip",
                subtype:"equip1",
                skills:["FH_GodKey_skill","FH_GodKey_skill_1","FH_GodKey_skill_2"],
                fullskin:true,
                distance:{
                    attackFrom:-1,
                },
                ai:{
                    basic:{
                        equipValue:6,
                    },
                },
            },
            "FH_taixuzhiwo":{
                type:"equip",
                subtype:"equip1",
                skills:["FH_taixuzhiwo_skill1","FH_taixuzhiwo_skill2"],
                fullskin:true,
                ai:{
                    basic:{
                        equipValue:6,
                    },
                },
            },
            "FH_taixuzhiwo_control":{
                type:"equip",
                subtype:"equip1",
                skills:["FH_taixuzhiwo_skill1","FH_taixuzhiwo_skill2"],
                fullskin:true,
                ai:{
                    basic:{
                        equipValue:6,
                    },
                },
            },
            "FH_yuduchen":{
                type:"equip",
                subtype:"equip5",
                skills:["FH_yuduchen_skill"],
                fullskin:true,
                ai:{
                    basic:{
                        equipValue:6,
                    },
                },
            },
        },
        skill:{
            "FH_GodKey_skill":{
                trigger:{
                    player:"equipAfter",
                },
                silent:true,
                priority:-1,
                filter:function (event,player){
            return    (get.translation(player.name)=='符华'||get.translation(player.name2)=='符华')||(get.translation(player.name)=='赤鸢仙人'||get.translation(player.name2)=='赤鸢仙人');
            },
                content:function (){
        'step 0'
                player.chooseControl('太虚之握','羽渡尘').ai=function(){
                    if(player.hp<2) return '太虚之握';
                    if((player.maxHp-player.hp)<=1) return '羽渡尘';                                
                }
                'step 1'
                if(result.control=='太虚之握'){
                    var hs=player.getCards('e');
        for(var i=0;i<hs.length;i++){
            if(hs[i].name.indexOf('FH_GodKey')==0){
                hs[i].init([hs[i].suit,hs[i].number,'FH_taixuzhiwo']);
            }
        }
                }
                else{
                    var hs=player.getCards('e');
        for(var i=0;i<hs.length;i++){
            if(hs[i].name.indexOf('FH_GodKey')==0){
                hs[i].init([hs[i].suit,hs[i].number,'FH_yuduchen']);
            }
        }
                }
                  },
            },
            "FH_GodKey_skill_1":{
                trigger:{
                    source:"damageBefore",
                },
                forced:true,
                filter:function (event){
                    return event.notLink()&&event.nature!=null;
                },
                content:function (){
                    trigger.num++;
                    trigger._FH_GodKey_skill=true;
                },
            },
            "FH_GodKey_skill_2":{
                trigger:{
                    source:"damageAfter",
                },
                forced:true,
                popup:false,
                filter:function (event,player){
                    return event._FH_GodKey_skill;
                },
                content:function (){
                    player.loseHp();
                },
            },
            "FH_taixuzhiwo_skill1":{
                trigger:{
                    target:"useCardToBefore",
                },
                forced:true,
                filter:function (event,player){
                return event.player!=player&&event.card;
                 },
                content:function (){
         "step 0"
         event.num=0;
         "step 1"
         if (event.num<3){
         player.chooseTarget(get.prompt('FH_taixuzhiwo_skill1'),function(card,player,target){
                return target!=player;
            }).set('ai',function(target){
                return 1-get.attitude(_status.event.player,target);
            })
                }else{
            event.finish();
            }
             "step 2"
                if(result.bool){
                if (Math.random()<=0.7){
                result.targets[0].popup('命中')
                result.targets[0].damage('fire');
                }else{
                result.targets[0].popup('没中');
                }
                event.num++;
                event.goto(1)
                }                    
                },
            },
            "FH_taixuzhiwo_skill2":{
                trigger:{
                    source:"damageBegin",
                },
                forced:true,
                filter:function (event,player){
                return event.card&&event.card.name=='sha'&&event.player.hp>player.hp;
                },
                content:function (){
                 trigger.num++;
                },
            },
            "FH_yuduchen_skill":{
                trigger:{
                    player:"phaseBegin",
                },
                forced:true,
                mark:true,
                filter:function (event,player){
                    if(typeof player.storage.FH_yuduchen_skill2=='number'){
                        return player.hp<player.storage.FH_yuduchen_skill2;
                    }
                    return false;
                },
                check:function (event,player){
                    if(player.hp<=1) return true;
                    return player.hp<player.storage.FH_yuduchen_skill2-1;
                },
                content:function (){
                    player.recover(player.storage.FH_yuduchen_skill2-player.hp);
                    player.draw(Math.ceil((player.storage.FH_yuduchen_skill2-player.hp)/2));
                    player.storage.retishen=true;
                },
                intro:{
                    mark:function (dialog,player){
                        if(typeof player.storage.FH_yuduchen_skill2!='number'){
                            return '上回合体力：无';
                        }
                        return '上回合体力：'+player.storage.FH_yuduchen_skill2;
                    },
                },
                group:["FH_yuduchen_skill2"],
            },
            "FH_yuduchen_skill2":{
                trigger:{
                    player:"phaseEnd",
                },
                priority:-10,
                silent:true,
                content:function (){
                    player.storage.FH_yuduchen_skill2=player.hp;
                    game.broadcast(function(player){
                        player.storage.FH_yuduchen_skill2=player.hp;
                    },player);
                    game.addVideo('storage',player,['FH_yuduchen_skill2',player.storage.FH_yuduchen_skill2]);
                },
                intro:{
                    content:function (storage,player){
                        if(player.storage.FH_yuduchen_skill) return;
                        return '上回合体力：'+storage;
                    },
                },
            },
            "FH_chiyuan_zhanchi":{
                trigger:{
                    source:"damageBegin",
                },
                forced:true,
                filter:function (event,player){    
            return player.getEnemies().length==1;
            },
                content:function (){
            trigger.num++;
              },
            },
            "FH_chiyuan_feiniao":{
                trigger:{
                    player:"phaseBegin",
                },
                forced:true,
                filter:function (event,player){    
            return player.getEnemies().length<=3;
            },
                content:function (){
            player.addTempSkill('FH_chiyuan_feiniao1');
            player.addTempSkill('FH_chiyuan_feiniao2');
              },
            },
            "FH_chiyuan_feiniao1":{
                trigger:{
                    source:"damageBegin",
                },
                forced:true,
                filter:function (event,player){    
            return event.nature=='fire';
            },
                content:function (){
            trigger.num++;
              },
            },
            "FH_chiyuan_feiniao2":{
                mod:{
                    globalFrom:function (from,to,distance){
                      return distance-1;
                      },
                },
            },
            "FH_chiyuan_wei":{
                trigger:{
                    player:"phaseBegin",
                },
                filter:function (event,player){    
            return player.getEnemies().length<=2;
            },
                forced:true,
                content:function (){
            if (player.hp<=Math.ceil(player.maxHp/2)) player.recover();
            player.changeHujia();
              },
            },
            "_FH_chiyuan_puhuo":{
                trigger:{
                    source:"damageBegin",
                },
                usable:1,
                filter:function (event,player){
                    var bool1=false;
                    if(player.countCards('e',{name:'FH_chiyuan_up'})>0) bool1=true;
                    var bool2=false;
                    if(player.countCards('e',{name:'FH_chiyuan_mid'})>0) bool2=true;
                    var bool3=false;
                    if(player.countCards('e',{name:'FH_chiyuan_dow'})>0) bool3=true;
                    if((bool1&&bool2)||(bool2&&bool3)||(bool1&&bool3)) return event.card!=undefined&&event.card.name=='sha';
                    return false;
                },
                check:function (event,player){
                    return get.attitude(player,event.target)<=0;
                },
                content:function (){
                 if  (trigger.player.wunature=='metal') trigger.num++;
                },
            },
            "_FH_chiyuan_hongyi":{
                trigger:{
                    source:"damageEnd",
                },
                usable:1,
                filter:function (event,player){
                    var bool1=false;
                    if(player.countCards('e',{name:'FH_chiyuan_up'})>0) bool1=true;
                    var bool2=false;
                    if(player.countCards('e',{name:'FH_chiyuan_mid'})>0) bool2=true;
                    var bool3=false;
                    if(player.countCards('e',{name:'FH_chiyuan_dow'})>0) bool3=true;
                    if(bool1&&bool2&&bool3) return event.card!=undefined&&event.card.name=='sha';
                    return false;
                },
                forced:true,
                priority:null,
                content:function (){
                player.recover(trigger.num);
                if (trigger.player.countCards('he')>=2) {
                player.gainPlayerCard(trigger.player,'he',2);
                }else if (trigger.player.countCards('he')==1) {
                player.gainPlayerCard(trigger.player,'he');
                }
                },
            },
        },
        translate:{
            "FH_chiyuan_up":"炽翎-上",
            "FH_chiyuan_up_info":"场上战斗中敌人不多于1个时，你的伤害均+1",
            "FH_chiyuan_zhanchi":"展翅",
            "FH_chiyuan_zhanchi_info":"场上战斗中敌人不多于1个时，你的伤害均+1",
            "FH_chiyuan_mid":"炽翎-中",
            "FH_chiyuan_mid_info":"你的回合开始时，场上的敌人不多于3个时，你的攻击距离+1，火焰伤害提高",
            "FH_chiyuan_feiniao":"飞鸟",
            "FH_chiyuan_feiniao1":"飞鸟",
            "FH_chiyuan_feiniao_info":"每轮限一次，你的回合开始时场上的敌人不多于3个时，你的攻击距离+1，火焰伤害提高",
            "FH_chiyuan_dow":"炽翎-下",
            "FH_chiyuan_dow_info":"你的回合开始时，若场上敌人数不多于2个时，你获得一点护甲，此时你的体力小于等于体力上限50%，则回复自身一点体力",
            "FH_chiyuan_wei":"卫",
            "FH_chiyuan_wei_info":"你的回合开始时，若场上敌人数不多于2个时，你获得一点护甲，此时你的体力小于等于体力上限50%，则回复自身一点体力",
            "_FH_chiyuan_puhuo":"扑火",
            "_FH_chiyuan_hongyi":"红翼",
            "shenghen_tz_chiyuan":"<br><br>套装技能：<li>两件：你对金属性角色造成的伤害+1。<li>三件：你对其他角色造成伤害后，你恢复同等数值体力，那之后，你获得其两张牌(以上效果每回合触发一次)",
            "FH_GodKey":"轩辕剑",
            "FH_GodKey_control":"轩辕剑·统御",
            "FH_GodKey_skill":"形态转变",
            "FH_GodKey_skill_1":"元素爆发",
            "FH_GodKey_skill_2":"元素爆发",
            "FH_GodKey_skill_info":"你造成的属性伤害均+1，那之后，你流失一点体力",
            "FH_GodKey_info":"这把武器真正的力量还在沉睡，但是在未来的某个时刻，它将被唤醒。",
            "FH_taixuzhiwo":"太虚之握",
            "FH_taixuzhiwo_control":"太虚之握·统御",
            "FH_taixuzhiwo_skill1":"阴阳",
            "FH_taixuzhiwo_skill1_info":"召唤三把轩辕剑的投影攻击目标敌人(70％命中)，每把造成1点火焰元素伤害",
            "FH_taixuzhiwo_skill2":"无极",
            "FH_taixuzhiwo_skill2_info":"你对其他角色使用【杀】造成伤害前，若该角色的体力多于你，该伤害+1",
            "FH_taixuzhiwo_info":"状态：已觉醒</li><li>【阴阳】召唤三把轩辕剑的投影攻击目标敌人(70％命中)，每把造成1点火焰元素伤害</li><li>【无极】你对其他角色使用【杀】造成伤害前，若该角色的体力多于你，该伤害+1",
            "FH_yuduchen":"羽渡尘",
            "FH_yuduchen_skill":"羽渡尘",
            "FH_yuduchen_info":"准备阶段开始时，你可以将体力回复至等同于你上回合结束时的体力值，然后你每以此法回复2点体力(向上取整)，便摸一张牌。",
        },
        list:[["spade",1,"FH_GodKey"],["heart",1,"FH_GodKey"],["club",1,"FH_GodKey"],["diamond",1,"FH_GodKey"]],
    },
    skill:{
        skill:{
            "FH_XWGX":{
                nobracket:true,
                zhuSkill:true,
                forced:true,
                trigger:{
                    player:"phaseUseBegin",
                },
                filter:function (event,player){
                if (player.identity!='zhu') return false;
                for(var i=0;i<game.players.length;i++){
                        if ( game.players[i].node.identity.firstChild.innerHTML=='忠' ) return true;
                    };
                },
                content:function (){
                event.num=0;
                    for(var i=0;i<game.players.length;i++){
                        if(game.players[i].node.identity.firstChild.innerHTML=='忠') {game.players[i].draw();
                        event.num++;
                        }
                    };
                    player.draw(event.num);
                },
                ai:{
                    order:13,
                    result:{
                        player:1,
                    },
                },
            },
            "FH_WX":{
                nobracket:true,
                group:["FH_WX_YL","FH_WX_KT"],
                subSkill:{
                    YL:{
                        content:function (){
            player.recover();
              },
                        sub:true,
                    },
                    KT:{
                        content:function (){
    'step 0'
   event.list=player.getFriends().sortBySeat();
    'step 1'
    if(event.list.length){
    var target=event.list.shift();
    player.line(target,'green');
    target.recover();
    event.redo();
      }
         },
                        sub:true,
                    },
                },
            },
            "FH_ZQTY":{
                nobracket:true,
                forced:true,
                trigger:{
                    player:"damageBegin",
                },
                filter:function (event,player){
            return event.source&&event.source!=player&&get.distance(event.source,player)>1;
            },
                content:function (){
        "step 1"
        event.cards=get.cards();
                player.showCards(event.cards,'朱雀踏云');
                "step 2"
                    if(get.color(event.cards)=='red') {if (player.hp>0){trigger.num-=Math.min(trigger.num,player.hp);}else{trigger.num--;}};
                player.gain(event.cards,'gain2');
                },
            },
            "FH_CJ":{
                nobracket:true,
                direct:true,
                trigger:{
                    source:"damageBefore",
                },
                content:function (){
            if (trigger.player.storage.FH_CJ==undefined) {trigger.player.storage.FH_CJ=0};
             trigger.player.storage.FH_CJ++;
             if (player.storage.FH_CJ_FH!=true){
             var FH=[1,2,3,4,5,6].randomGet();
             var CJ="CJ_"+FH;
             if (get.translation(CJ)=="CJ_1"){
             player.storage.FH_CJ_1=true;
             }else if (get.translation(CJ)=="CJ_2"){
             player.storage.FH_CJ_2=true;
             }else if (get.translation(CJ)=="CJ_3"){
             player.storage.FH_CJ_3=true;
             }else if (get.translation(CJ)=="CJ_4"){
             player.storage.FH_CJ_4=true;
             }else if (get.translation(CJ)=="CJ_5"){
             player.storage.FH_CJ_5=true;
             }else if (get.translation(CJ)=="CJ_6"){
             player.storage.FH_CJ_6=true;
             }
             player.storage.FH_CJ_FH=true;
             }
             },
                group:["FH_CJ_BJCZ","FH_CJ_YL","FH_CJ_KT","FH_CJ_PL","FH_CJ_YP","FH_CJ_LL","FH_CJ_SB"],
                subSkill:{
                    BJCZ:{
                        trigger:{
                            player:"phaseAfter",
                        },
                        direct:true,
                        content:function (){
             delete player.storage.FH_CJ_FH;
             for(var i=0;i<game.players.length;i++){            
           if (game.players[i].storage.FH_CJ>0)game.players[i].storage.FH_CJ=0;
        }
              },
                        sub:true,
                    },
                    YL:{
                        trigger:{
                            source:"damageAfter",
                        },
                        forced:true,
                        popup:false,
                        filter:function (event,player){
            return player.storage.FH_CJ_1==true;
            },
                        content:function (){
            if (trigger.player.storage.FH_CJ==3){
            player.popup('寸劲·云岚');
            game.log('喝！',player,'对',trigger.player,'发动了【寸劲·云岚】');
            trigger.player.damage(player.maxHp);
            delete player.storage.FH_CJ_1;
            player.useSkill("FH_WX_YL");
            }
              },
                        sub:true,
                    },
                    KT:{
                        trigger:{
                            source:"damageAfter",
                        },
                        forced:true,
                        popup:false,
                        filter:function (event,player){
            return player.storage.FH_CJ_2==true;
            },
                        content:function (){
            if (trigger.player.storage.FH_CJ==3){
            player.popup('寸劲·开天');
            game.log('喝！',player,'对',trigger.player,'发动了【寸劲·开天】');
            if(Math.random()<=0.83){
                     trigger.player.damage(trigger.player.maxHp);
                     }
                     else{
                        var next=game.createEvent('die');
                        next.player=trigger.player;
                        next.source=player;
                        next.setContent('die');
                     };            
            delete player.storage.FH_CJ_2;
            }
              },
                        sub:true,
                    },
                    PL:{
                        trigger:{
                            source:"damageAfter",
                        },
                        forced:true,
                        popup:false,
                        filter:function (event,player){
            return player.storage.FH_CJ_3==true;
            },
                        content:function (){
            if (trigger.player.storage.FH_CJ==3){
            player.popup('寸劲·霹雳');
            game.log('喝！',player,'对',trigger.player,'发动了【寸劲·霹雳】');
                var ec=get.cards();
player.showCards(ec,'寸劲·霹雳');
   var n=get.number(ec[0]);  
                    game.delay(1.6);
            trigger.player.damage(n,'thunder');
            delete player.storage.FH_CJ_3;
            }
              },
                        sub:true,
                    },
                    YP:{
                        trigger:{
                            source:"damageAfter",
                        },
                        forced:true,
                        popup:false,
                        filter:function (event,player){
            return player.storage.FH_CJ_4==true;
            },
                        content:function (){
            if (trigger.player.storage.FH_CJ==3){
            player.popup('寸劲·岩破');
            game.log('喝！',player,'对',trigger.player,'发动了【寸劲·岩破】');
            var n=Math.max(1,trigger.player.countCards('e'));
            trigger.player.discard(trigger.player.get("e"));
            trigger.player.damage(n);
            delete player.storage.FH_CJ_4;
            }else{event.finish()}            
              },
                        sub:true,
                    },
                    LL:{
                        trigger:{
                            source:"damageAfter",
                        },
                        forced:true,
                        popup:false,
                        filter:function (event,player){
            return player.storage.FH_CJ_5==true;
            },
                        content:function (){
            if (trigger.player.storage.FH_CJ==3){
            player.popup('寸劲·乱雷');
            game.log('喝！',player,'对',trigger.player,'发动了【寸劲·乱雷】');
            var ec=get.cards();
player.showCards(ec,'寸劲·乱雷');
   var n=Math.floor(get.number(ec[0])/2);  
                    game.delay(1.6);
            trigger.player.damage(n,'thunder');
            if(trigger.player.previous!=player) trigger.player.previous.damage(n,'thunder');    
 if(trigger.player.next!=player) trigger.player.next.damage(n,'thunder');
            delete player.storage.FH_CJ_5;
            }
              },
                        sub:true,
                    },
                    SB:{
                        trigger:{
                            source:"damageAfter",
                        },
                        forced:true,
                        popup:false,
                        filter:function (event,player){
            return player.storage.FH_CJ_6==true;
            },
                        content:function (){
            if (trigger.player.storage.FH_CJ==3){            
            player.popup('寸劲·山崩');
            game.log('喝！',player,'对',trigger.player,'发动了【寸劲·山崩】');
            var n=Math.max(1,Math.ceil(trigger.player.countCards('he')/2));
            trigger.player.discard(trigger.player.get("he"));
            trigger.player.damage(n);
            delete player.storage.FH_CJ_6;
            }else{event.finish()};            
              },
                        sub:true,
                    },
                },
                mod:{
                    cardUsable:function (card,player,num){
                        if(card.name=='sha') return Infinity;
                    },
                },
                ai:{
                    unequip:true,
                    skillTagFilter:function (player,tag,arg){
                        if(arg&&arg.name=='sha') return true;
                        return false;
                    },
                },
            },
            "FH_niepan":{
                trigger:{
                    player:"dying",
                },
                direct:true,
                usable:1,
                init:function (player){
             if (player.identity=='zhu'){
                player.storage.FH_niepan=player.maxHp+1;
                }else{
                player.storage.FH_niepan=player.maxHp;
                 }
            },
                filter:function (event,player){
             return Math.random()<=0.07;
             },
                content:function (){                    
'step 1'
player.init('FH_Fuka_chiyuan');
player.gainMaxHp(player.storage.FH_niepan);
player.popup('凤凰涅槃');
'step 2'
player.hp=player.storage.FH_niepan;
/*player.setAvatar('FH_Fuka','FH_Fuka_chiyuan');*/
/*player.node.avatar.setBackgroundImage('extension/神州平板/'+'FH_Fuka_chiyuan'+'.jpg');
    game.broadcastAll(function(user) {
                                lib.translate['FH_Fuka'] = lib.translate["FH_Fuka_chiyuan"];
                                user.node.name.innerHTML = get.slimName(user.name);
                            }, player);*/
             var card1=game.createCard({name:'FH_chiyuan_up'});
        player.gain(card1,'gain2');
        player.equip(card1);
        var card2=game.createCard({name:'FH_chiyuan_mid'});
        player.gain(card2,'gain2');
        player.equip(card2);
        var card3=game.createCard({name:'FH_chiyuan_dow'});
        player.gain(card3,'gain2');
        player.equip(card3);                    
                 },
            },
            "FH_CHZY":{
                nobracket:true,
                unique:true,
                forced:true,
                global:"FH_CHZY2",
                zhuSkill:true,
            },
            "FH_CHZY2":{
                mod:{
                    attackTo:function (from,to,distance){
                        if(from.node.identity.firstChild.innerHTML!='忠') return;
                        var players=game.filterPlayer();
                        for(var i=0;i<players.length;i++){
                            if(from!=players[i]&&to!=players[i]&&
                                players[i].hasZhuSkill('FH_CHZY',from)){
                                if(get.distance(players[i],to)<=1) return distance-100;
                            }
                        }
                    },
                },
            },
            "FH_ZY":{
                nobracket:true,
            },
            "FH_FCB":{
                nobracket:true,
                forced:true,
                trigger:{
                    player:"damageBegin",
                },
                filter:function (event,player){
            return event.source&&event.source!=player&&get.distance(player,event.source,'attack')<=1;
            },
                content:function (){
        "step 1"
        var ec=get.cards();
   player.showCards(ec,'拂尘步');
   game.delay(1.6); 
                "step 2"
                    if(get.number(ec[0])<=7) {if (player.hp>0){trigger.num-=Math.min(trigger.num,player.hp);}else{trigger.num--;}};
                player.gain(ec,'gain2');
                },
            },
            "FH_XS":{
                nobracket:true,
                trigger:{
                    source:"damageAfter",
                },
                forced:true,
                usable:1,
                filter:function (event,player){
            return event.card&&event.card.name=='sha'&&event.player.countCards('h')<player.countCards('h')&&player.hp<=event.player.hp;
                },
                noAdd:true,
                noRemove:true,
                noDisabled:true,
                content:function (){
        "step 0"
        event.num=0;
        if(player==game.me){                        
            event.FH_XS=ui.create.control('仙式·玄鸟散',function(){
                event.FH_XS.status--;
            });
            event.FH_XS.status=1;
            for(var i=0;i<event.FH_XS.childNodes.length;i++){
                event.FH_XS.childNodes[i].num=0;
            }
            event.timer=setInterval(function(){
                if(event.FH_XS.status<=0){
                    clearInterval(event.timer);
                    game.resume();
                    event.FH_XS.close();
                    return;
                }
                event.count(0);
                if(event.FH_XS.status>1) event.count(1);
                if(event.FH_XS.status>2) event.count(2);
                if(event.FH_XS.status>3) event.count(3);
                if(event.FH_XS.status>4) event.count(4);
            },50);
            event.count=function(num){
                event.FH_XS.childNodes[num].num=(event.FH_XS.childNodes[num].num+1)%5;
                if(event.FH_XS.childNodes[num].num==1) event.FH_XS.childNodes[num].innerHTML='仙式·凰翔脚';
                else if(event.FH_XS.childNodes[num].num==2) event.FH_XS.childNodes[num].innerHTML='仙式·白雉';
                else if(event.FH_XS.childNodes[num].num==3) event.FH_XS.childNodes[num].innerHTML='仙式·时雨燕';
                else if(event.FH_XS.childNodes[num].num==4) event.FH_XS.childNodes[num].innerHTML='仙式·月下骛';
                else if(event.FH_XS.childNodes[num].num==0) event.FH_XS.childNodes[num].innerHTML='仙式·玄鸟散';
                else event.FH_XS.childNodes[num].innerHTML=get.cnNumber(event.FH_XS.childNodes[num].num);
            }
            game.pause();
        }
else{
            event.finish();
            var x=Math.random();
            if(x<0.2) trigger.player.damage(player.maxHp);
            if(x>0.2&&x<0.4) trigger.player.damage(player.maxHp);
            if(x>0.4&&x<0.6) trigger.player.damage(player.maxHp);
            if(x>0.6&&x<0.8) trigger.player.damage(player.maxHp);
            if(x>0.8&&x<1) trigger.player.damage(player.maxHp);
}
 "step 1"
        var str='';
        for(var i=0;i<event.FH_XS.childNodes.length;i++){
            str+=event.FH_XS.childNodes[i].innerHTML;
        }
        //var nature=['fire','epic','water','metal'].randomGet();
        player.$skill(str);
        game.delay();
        switch(str){
            case '仙式·玄鸟散':{
            var n=Math.max(1,trigger.player.maxHp-trigger.player.hp);
            trigger.player.damage(n,'fire');
            if(trigger.player.previous!=player) trigger.player.previous.damage(n,'fire');    
 if(trigger.player.next!=player) trigger.player.next.damage(n,'fire');
            };break;
            case '仙式·凰翔脚':{
            player.storage.XS_HXJ=true;
            event.goto(2);
            };break;
            case '仙式·白雉':{
           if (player.hasSkill('FH_ZY')&&trigger.player.hasSkill('FH_XS_LH')){
            trigger.player.addSkill("FH_BZ_DEBUFF");
            }
            trigger.player.damage(Math.max(1,player.countCards('e')))
            };break;
            case '仙式·时雨燕':{
            player.storage.XS_SYY=true;
            event.goto(4);
            };break;
            case '仙式·月下骛':{
            var card=player.getCards('h').randomGet();
            player.showCards([card]);
            var n=get.number(card);
            trigger.player.damage(Math.ceil(n/2));
            if (player.hasSkill('FH_ZY')&&trigger.player.hasSkill('FH_XS_LH')){
                            var num=trigger.player.countCards('h');
                            trigger.player.discard(trigger.player.get('h'));
                            trigger.player.draw(num);
                            trigger.player.showHandcards();
                            var num2=trigger.player.num('h',function(card){
                                return get.type(card)=='basic';
                            });
                            trigger.player.discard(trigger.player.get('h',function(card){
                                return get.type(card)=='basic';
                            }));
                            if(num2) trigger.player.damage(num2);        
                            }
            };break;
}
     "step 2"
     if (player.storage.XS_HXJ==true){
     player.judge(function(card){
                        if(get.color(card)=='red') return 1.5;
                        return -1.5;
                    });
                    }
                    "step 3"
                    if (player.storage.XS_HXJ==true){
                    if(result.judge>0){
                    event.num++;
                    event.goto(2);
                    }else{
                    trigger.player.damage(event.num);
                    delete player.storage.XS_HXJ;
                    event.goto(6);
                      }
                     }
     "step 4"
     if (player.storage.XS_SYY==true){
     player.judge(function(card){
                        if(get.type(card)=='basic') return 1.5;
                        return -1.5;
                    });
                    }
                    "step 5"
                    if (player.storage.XS_SYY==true){
                    if(result.judge>0){
                    trigger.player.damage();
                    event.goto(4);
                    }else{
                    if (player.hasSkill('FH_ZY')&&trigger.player.hasSkill('FH_XS_LH')){
                    var num=player.countCards('h');
                    player.discard(player.get('h'));                    
                    player.draw(num);
                    }
                    delete player.storage.XS_SYY;
                    event.goto(6);
                      }
                    }  
     "step 6"
     if (Math.random()<=0.05) {
     player.$skill('飞烬玄灵','fire','avatar');
    game.countPlayer(function(current){
            if(current!=player){
                player.line(current,'red');
                current.damage('fire')._triggered=null; 
            }
        });
      }
    },
                group:["FH_XS_sha"],
                subSkill:{
                    sha:{
                        trigger:{
                            source:"damageBefore",
                        },
                        forced:true,
                        filter:function (event,player){
            return event.card&&event.card.name=='sha'&&event.nature=='fire';
                },
                        content:function (){
       trigger.player.addSkill("FH_XS_LH");
            },
                        sub:true,
                    },
                },
                ai:{
                    order:10,
                    result:{
                        player:function (player){
                return 1;    
            },
                    },
                    threaten:1,
                },
            },
            "FH_XS_LH":{
                trigger:{
                    player:"phaseBegin",
                },
                forced:true,
                popup:false,
                content:function (){
                    player.addSkill('FH_XS_LH_debuff');                            
                },
            },
            "FH_XS_LH_debuff":{
                trigger:{
                    player:"phaseAfter",
                },
                forced:true,
                popup:false,
                content:function (){
                player.loseHp();
                player.removeSkill('FH_XS_LH');
                player.removeSkill('FH_XS_LH_debuff');
                 },
                mod:{
                    globalFrom:function (from,to,distance){
                        return distance+1;
                    },
                },
            },
            "FH_BZ_DEBUFF":{
                trigger:{
                    player:"phaseDrawBegin",
                },
                forced:true,
                popup:false,
                content:function (){
                player.popup('摸牌数-1');
                    trigger.num--;
                    player.removeSkill('FH_BZ_DEBUFF');
                },
            },
        },
        translate:{
            "FH_XWGX":"玄武归心",
            "FH_XWGX_info":"主公技，锁定技，你的出牌阶段开始时，场上身份显示为忠的角色依次摸起一张牌，那之后，你摸X张牌(X为因此摸牌的角色数)",
            "FH_WX":"悟心",
            "FH_WX_info":"【寸劲·云岚】时恢复自己一点体力，【寸劲·开天】时全体友方恢复一点体力",
            "FH_ZQTY":"朱雀踏云",
            "FH_ZQTY_info":"锁定技，你受到与你距离大于1的角色的伤害时，你亮出并获得牌堆顶的一张牌，若该牌颜色为红色，该伤害-X(X为你的体力值，至少为1)",
            "FH_CJ":"寸劲",
            "FH_CJ_YL":"寸劲·云岚",
            "FH_CJ_KT":"寸劲·开天",
            "FH_CJ_PL":"寸劲·霹雳",
            "FH_CJ_YP":"寸劲·岩破",
            "FH_CJ_LL":"寸劲·乱雷",
            "FH_CJ_SB":"寸劲·山崩",
            "FH_CJ_info":"你的出牌阶段内限一次，当你对一名其他角色累计造成三次伤害后，你对其发动一次以下技能中的一个【寸劲·云岚】【寸劲·开天】【寸劲·霹雳】【寸劲·岩破】【寸劲·乱雷】【寸劲·山崩】。锁定技，你使用的【杀】无次数限制",
            "FH_CHZY":"缠火之鸢",
            "FH_CHZY_info":"主公技，锁定技，你距离为1的角色视为在其他身份显示为“忠”角色的攻击范围内",
            "FH_ZY":"烛夜",
            "FH_ZY_info":"若发动以下技能时目标已处于“离火”状态，则该技能附加以下效果：</li><li>[仙式·白雉]时令目标下个摸牌阶段摸牌数-1<li>[仙式·时雨燕]时重铸自己所有手牌</li><li>[仙式·月下骛]时目标先弃置所有手牌再摸等量的牌并展示之，然后你弃置其中所有基本牌，并对其造成等量的伤害",
            "FH_FCB":"拂尘步",
            "FH_FCB_info":"锁定技，你受到你攻击范围内角色的伤害时，你亮出并获得牌堆顶的一张牌，若该牌点数不大于7，该伤害-X(X为你的体力值，至少为1)",
            "FH_XS":"仙式",
            "FH_XS_XNS":"仙式·玄鸟散",
            "FH_XS_HXJ":"仙式·凰翔脚",
            "FH_XS_BZ":"仙式·白雉",
            "FH_XS_SYY":"仙式·时雨燕",
            "FH_XS_YXW":"仙式·月下骛",
            "FH_XS_info":"当你对一名其他角色使用【杀】造成伤害后，若你的体力不小于目标且手牌数大于该角色，你选择发动以下技能[仙式·玄鸟散][仙式·凰翔脚][仙式·白雉][仙式·时雨燕][仙式·月下骛]，那之后，5%连锁触发必杀[飞烬玄灵]。锁定技，你使用火【杀】造成伤害时目标进入“离火”状态",
            "FH_XS_LH":"离火",
            "FH_XS_LH_debuff":"离火2",
            "FH_XS_BSJ":"飞烬玄灵",
        },
    },
    intro:"<img src='file:///storage/emulated/0/Android/data/com.widget.noname/extension/神州平板/神州平板.jpg' width='264' height='136'><br>神州平azdrgvhuyfkkookklopjjnnhggtfff安",
    author:"欧尼斯特·渣诚",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["FH_Fuka_chiyuan.jpg"],"card":["FH_yuduchen.png"],"skill":[]}}};