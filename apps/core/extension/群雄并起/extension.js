import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"群雄并起",content:function (config,pack){
    
},precontent:function (){
    
},help:{},config:{},package:{
    character:{
        character:{
            "魏·绪褚":["male","wei",4,["qx_miaoji2","qx_luoyi","qx_erxing"],["des:强项：输出"]],
            "魏·曹丕":["male","wei",3,["qx_miaoji2","qx_xingshang","qx_fangzhu","qx_luoshui","qx_songwei","qx_erxing"],["zhu","des:强项：控制"]],
            "魏·甄姬":["female","wei",3,["qx_miaoji2","qx_luoshen1","qx_qingguo0","qx_erxing"],[]],
            "魏·典韦":["male","wei",4,["qx_miaoji2","qx_qiangxi5","qx_feiji","qx_erxing"],[]],
            "魏·张辽":["male","wei",4,["qx_miaoji2","qx_duorui","qx_tuxi","qx_sanxing"],["des:魏国强将"]],
            "魏·夏侯渊":["male","wei",4,["qx_miaoji2","qx_erxing","qx_fengxing","qx_xhy_jiying","qx_xhy_miaocai"],[]],
            "魏·司马懿":["male","wei",3,["qx_miaoji2","qx_sixing","qx_smy_langgu","qx_smy_guicai","qx_smy_renjie"],["des:势力技妙计来源，伪五星将，顶级强度，建议ai禁用，挑战模式将出boss"]],
            "蜀·张飞":["male","shu",4,["qx_tongren","qx_paoxiao","qx_numu1","qx_yixing"],["des:强项：爆发，输出"]],
            "蜀·刘谌":["male","shu",4,["qx_tongren","qx_qinwang","qx_zhanjue","qx_jizhao","qx_erxing"],["zhu","des:强项：辅助，团战，收割"]],
            "蜀·黄月英":["female","shu",3,["qx_jizhi","qx_qicai","qx_tongren","qx_sanxing"],["des:强项：摸牌。该扩展包摸牌量最大武将"]],
            "蜀·赵云":["male","shu",4,["qx_tongren","qx_longdan1","qx_yajiao","qx_sixing"],["des:强项：防御，控制输出。该扩展包第一全能型武将。(强度严重失衡，给电脑用用可能还行，玩家慎用)"]],
            "蜀·孟获":["male","shu",4,["qx_tongren","qx_manwang","qx_zaiqi","qx_erxing"],[]],
            "蜀·姜维":["male","shu",4,["qx_erxing","qx_tongren","qx_tiaoxin","qx_jw_jizhi"],[]],
            "蜀·祝融":["female","shu",4,["qx_yixing","qx_tongren","qx_zr_juxiang","qx_zr_lieren"],[]],
            "吴·孙策":["male","wu",4,["qx_yingzi1","qx_jiang2","qx_zhiba1","qx_yingyang0","qx_erxing"],["zhu","des:强项：拆迁，摸牌"]],
            "吴·太史慈":["male","wu",4,["qx_yingzi1","qx_tianyi","qx_erxing"],["des:强项：输出"]],
            "灵·青龙":["male","wu",7,["qx_longling","qx_longyin","qx_qiyu","qx_longwei","qx_yunchong","qx_jiying","qx_zhengua"],["boss","forbidai","bossallowed","des:削弱计划：干旱影响改为摸牌阶段少摸一张牌；暂未实行"]],
            "吴·陆逊":["male","wu",3,["qx_yingzi1","qx_qianxun","qx_lianying","qx_jieyan","qx_sanxing"],["des:强项：摸牌，综合能力较强；连营已经削过了，但还是很强，慎用"]],
            "qx_yuan":["female","wu",3,["qx_yingzi1","qx_xiaoji2","qx_baoyu","qx_erxing"],["unseen"]],
            "qx_jin":["female","wu",3,["qx_yingzi1","qx_xiaoji1","qx_lihua","qx_erxing"],[]],
            "吴·吕蒙":["male","wu",4,["qx_yingzi1","qx_keji","qx_qinxue","qx_erxing"],[]],
            "吴·周瑜":["male","wu",3,["qx_yingzi1","qx_fanjian","qx_qinyin0","qx_yeyan","qx_sanxing"],["des:势力技英姿源头，挑战模式将推出boss乱世仙音"]],
            "吕·高顺":["male","qun",4,["qx_hanyong","qx_jinjiu","qx_zhongyi","qx_xianzhen","qx_erxing"],[]],
            "吴·张昭张纮":["male","wu",3,["qx_sanxing","qx_yingzi1","qx_zz_zhijian","qx_zz_guzheng","qx_zz_anbang"],[]],
            "吴·甘宁":["male","wu",4,["qx_erxing","qx_yingzi1","qx_gn_fenwei","qx_gn_qixi"],[]],
            "袁·颜良文丑":["male","qun",4,["qx_mingmen","qx_shuangxiong","qx_erxing"],[]],
            "刘·何太后":["female","qun",3,["qx_huangshi","qx_zhendu","qx_qiluan","qx_yixing"],[]],
            "智·蔡文姬":["female","qun",3,["qx_sanren","qx_beige1","qx_kusi","qx_guihan","qx_erxing"],[]],
            "董·贾诩":["male","qun",3,["qx_baonue","qx_wansha","qx_weimu","qx_luanwu0","qx_luanwu1","qx_sixing"],["des:群雄势力强度最高谋士，杀人控局易如反掌，强度：严重失衡"]],
            "董卓":["male","qun",4,["qx_baonue","qx_jiuchi","qx_hengzheng","qx_daoxing","qx_nishi","qx_shanquan","qx_sixing"],["zhu","des:暴虐势力技源头，群雄主公之一，各项能力强大，挑战模式将推出boss版董卓"]],
            "马·庞德":["male","qun",4,["qx_yixing","qx_qun_tieji","qx_mashu","qx_mengjin"],[]],
            "袁绍":["male","qun",4,["qx_erxing","qx_mingmen","qx_ys_haogui","qx_ys_jianyu","qx_ys_xueyi"],["zhu","des:名门势力技源头"]],
        },
        translate:{
            "魏·绪褚":"魏·绪褚",
            "魏·曹丕":"魏·曹丕",
            "魏·甄姬":"魏·甄姬",
            "魏·典韦":"魏·典韦",
            "魏·张辽":"魏·张辽",
            "魏·夏侯渊":"魏·夏侯渊",
            "魏·司马懿":"魏·司马懿",
            "蜀·张飞":"蜀·张飞",
            "蜀·刘谌":"蜀·刘谌",
            "蜀·黄月英":"蜀·黄月英",
            "蜀·赵云":"蜀·赵云",
            "蜀·孟获":"蜀·孟获",
            "蜀·姜维":"蜀·姜维",
            "蜀·祝融":"蜀·祝融",
            "吴·孙策":"吴·孙策",
            "吴·太史慈":"吴·太史慈",
            "灵·青龙":"灵·青龙",
            "吴·陆逊":"吴·陆逊",
            "qx_yuan":"吴·孙尚香",
            "qx_jin":"吴·孙尚香",
            "吴·吕蒙":"吴·吕蒙",
            "吴·周瑜":"吴·周瑜",
            "吴·张昭张纮":"吴·张昭张纮",
            "吴·甘宁":"吴·甘宁",
            "吕·高顺":"吕·高顺",
            "袁·颜良文丑":"袁·颜良文丑",
            "刘·何太后":"刘·何太后",
            "智·蔡文姬":"智·蔡文姬",
            "董·贾诩":"董·贾诩",
            "董卓":"董卓",
            "马·庞德":"马·庞德",
            "袁绍":"袁绍",
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
            "qx_miaoji2":{
                audio:"ext:群雄并起:2",
                group:"qx_miaoji1",
                trigger:{
                    player:"damageEnd",
                },
                frequent:true,
                content:function (){
        "step 0"
        player.judge(function(card){
            if(get.color(card)=='red') return -2;
            return 2;
        })
        "step 1"
        if(result.judge<2){
            player.draw();
        }
       if(result.judge==2){
           player.draw(2);
       }
       
    },
            },
            "qx_luoshen2":{
                audio:"luoshen",
                trigger:{
                    player:"phaseDiscardEnd",
                },
                frequent:true,
                filter:function (event,card,player){
        return event.cards&&event.cards.length<3;
    },
                content:function (){
        'step 0'
        player.chooseTarget('是否发动洛神',function(card,player,target){
            return player!=target;}).set('ai',function(target){
            return get.attitude(_status.event.player,target);
        });
        'step 1'
       if(result.bool){
           player.logSkill('qx_luoshen2');
           result.targets[0].$gain(trigger.cards,player);
           result.targets[0].gain(trigger.cards,player);
       }
    },
            },
            "qx_luoshen1":{
                group:["xinluoshen_clear","qx_luoshen2"],
                audio:"luoshen",
                trigger:{
                    player:"phaseBegin",
                },
                frequent:true,
                content:function (){
        "step 0"
        if(event.cards==undefined) event.cards=[];
        player.judge(function(card){
            if(get.color(card)=='black') return 1.5;
            return -1.5;
        },ui.special);
        "step 1"
        if(result.judge>0){
            event.cards.push(result.card);
            if(lib.config.autoskilllist.contains('luoshen')){
                player.chooseBool('是否再次发动【洛神】？');
            }
            else{
                event._result={bool:true};
            }
        }
        else{
            for(var i=0;i<event.cards.length;i++){
                if(get.position(event.cards[i])!='s'){
                    event.cards.splice(i,1);i--;
                }
            }
            player.gain(event.cards,'gain2');
            player.storage.xinluoshen=event.cards.slice(0);
            event.finish();
        }
        "step 2"
        if(result.bool){
            event.goto(0);
        }
        else{
            if(event.cards.length){
                player.gain(event.cards,'gain2');
                player.storage.xinluoshen=event.cards.slice(0);
            }
        }
    },
                mod:{
                    ignoredHandcard:function (card,player){
            if(get.is.altered('xinluoshen')&&player.storage.xinluoshen&&player.storage.xinluoshen.contains(card)){
                return true;
            }
        },
                },
                subSkill:{
                    clear:{
                        trigger:{
                            player:"phaseAfter",
                        },
                        silent:true,
                        content:function (){
                delete player.storage.xinluoshen;
            },
                        sub:true,
                        forced:true,
                        popup:false,
                    },
                },
            },
            "qx_qingguo1":{
                mod:{
                    suit:function (card,suit){
            if(suit=='diamond') return 'club';
        },
                },
            },
            "qx_qingguo2":{
                trigger:{
                    player:"phaseEnd",
                },
                frequent:true,
                filter:function (event,player){
        return player.countUsed('sha')==0;
    },
                content:function (){
        player.draw(2);
    },
            },
            "qx_qingguo4":{
                audio:"fangzhu",
                trigger:{
                    player:"damageEnd",
                },
                filter:function (event,player){
        return player.hp==3;
    },
                direct:true,
                content:function (){
        "step 0"
        player.chooseTarget(get.prompt('fangzhu'),function(card,player,target){
            return player!=target
        }).ai=function(target){
            if(target.hasSkillTag('noturn')) return 0;
            var player=_status.event.player;
            if(get.attitude(_status.event.player,target)==0) return 0;
            if(get.attitude(_status.event.player,target)>0){
                if(target.classList.contains('turnedover')) return 1000-target.countCards('h');
                if(player.maxHp-player.hp<3) return -1;
                return 100-target.countCards('h');
            }
            else{
                if(target.classList.contains('turnedover')) return -1;
                if(player.maxHp-player.hp>=3) return -1;
                return 1+target.countCards('h');
            }
        }
        "step 1"
        if(result.bool){
            player.logSkill('fangzhu',result.targets);
            result.targets[0].draw(player.maxHp-player.hp);
            result.targets[0].turnOver();
        }
    },
                ai:{
                    maixie:true,
                    "maixie_hp":true,
                    effect:{
                        target:function (card,player,target){
                if(get.tag(card,'damage')){
                    if(player.hasSkillTag('jueqing',false,target)) return [1,-2];
                    if(target.hp<=1) return;
                    if(!target.hasFriend()) return;
                    var hastarget=false;
                    var turnfriend=false;
                    var players=game.filterPlayer();
                    for(var i=0;i<players.length;i++){
                        if(get.attitude(target,players[i])<0&&!players[i].isTurnedOver()){
                            hastarget=true;
                        }
                        if(get.attitude(target,players[i])>0&&players[i].isTurnedOver()){
                            hastarget=true;
                            turnfriend=true;
                        }
                    }
                    if(get.attitude(player,target)>0&&!hastarget) return;
                    if(turnfriend||target.hp==target.maxHp) return [0.5,1];
                    if(target.hp>1) return [1,0.5];
                }
            },
                    },
                },
            },
            "qx_qingguo0":{
                group:"qx_qingguo4",
                trigger:{
                    player:["phaseBefore","changeHp"],
                },
                forced:true,
                popup:false,
                unique:true,
                content:function (){
        player.removeAdditionalSkill('qx_qingguo0');
        var list=[];
        if(player.hp<=3){
            list.push('qingguo');
        }
        if(player.hp<=2){
            list.push('qx_qingguo2');
        }
        if(player.hp<=1){
            list.push('qx_qingguo1');
        }
        if(list.length){
            player.addAdditionalSkill('qx_qingguo0',list);
        }
    },
                ai:{
                    maixie:true,
                    effect:{
                        target:function (card,player,target){
                if(get.tag(card,'damage')){
                    if(!target.hasFriend()) return;
                    if(target.hp>=4) return [0,1];
                }
                if(get.tag(card,'recover')&&player.hp>=player.maxHp-1) return [0,0];
            },
                    },
                },
            },
            "qx_luoyi":{
                group:"qx_luoyi_damage",
                trigger:{
                    player:"phaseDrawBegin",
                },
                forced:true,
                content:function (){
        trigger.num++;
    },
                ai:{
                    threaten:1.3,
                },
                subSkill:{
                    damage:{
                        audio:"luoyi",
                        trigger:{
                            player:"phaseDrawBegin",
                        },
                        priority:10,
                        check:function (event,player){
        if(player.hp<=2)return false;
            },
                        content:function (){
        trigger.num--;
        player.addTempSkill('qx_luoyi_sha',{player:'phaseBegin'});
    },
                        sub:true,
                    },
                },
            },
            "qx_luoyi_sha":{
                group:"qx_luoyi_sha_damage",
                trigger:{
                    source:"damageBefore",
                },
                forced:true,
                content:function (){
        trigger.num++;
        if(trigger.player.countCards('he')){          
            player.gainPlayerCard(trigger.player,'he',true);            
        }
    },
                subSkill:{
                    damage:{
                        trigger:{
                            player:"damageBefore",
                            sub:true,
                        },
                        forced:true,
                        content:function (){
        trigger.num++;
        player.removeSkill('qx_luoyi_sha');
    },
                        sub:true,
                    },
                },
            },
            "qx_miaoji1":{
                trigger:{
                    global:"damageEnd",
                },
                check:function (event,player){
        if(player.hp<=2)return false;
        if(get.attitude(player,event.player)<=0)return false;        
        return true;
    },
                filter:function (event,player){
        return event.player.hasSkill('qx_miaoji2')&&event.player!=player&&event.player.isAlive();
    },
                content:function (){        
        player.loseHp();
        trigger.source.damage();
        trigger.player.draw();
    },
            },
            "qx_xingshang":{
                audio:"xingshang",
                trigger:{
                    global:"dieEnd",
                },
                frequent:true,
                content:function (){
        game.countPlayer(function(current){            
            if(current!=player&&!current.countCards('he')){
               player.draw();
            }
             if(current!=player&&current.countCards('he'))
                 player.gainPlayerCard(current,'he');           
        });
    },
            },
            "qx_fangzhu":{
                group:["qx_fangzhu_global","qx_fangzhu_gain"],
                audio:"fangzhu",
                enable:"phaseUse",
                filterCard:true,
                selectCard:1,
                usable:1,
                check:function (card){
        return 4.4-get.value(card);
    },
                filterTarget:function (card,player,target){
         return player!=target&&!target.hasSkill('qx_fangzhu_1');
    },
                prepare:"give",
                discard:false,
                content:function (){
        target.addTempSkill('qx_fangzhu_1',{player:'phaseEnd'});        
        target.gain(cards,player);
    },
                ai:{
                    order:3,
                    result:{
                        target:function (player,target){
              return -4;
            },
                    },
                    threaten:2,
                },
                subSkill:{
                    "1":{
                        alter:true,
                        mark:true,
                        marktext:"逐",
                        intro:{
                            content:"手牌上限减一，攻击距离减二",
                        },
                        mod:{
                            globalFrom:function (from,to,distance){
            return distance+2;
        },
                            maxHandcard:function (player,num){
            return num-1;
        },
                        },
                        sub:true,
                    },
                    global:{
                        trigger:{
                            global:"damageEnd",
                        },
                        audio:"fangzhu",
                        frequent:true,
                        filter:function (event,player){
                return event.source&&event.source.hasSkill('qx_fangzhu_1');
            },
                        content:function (){
        'step 0'
        player.chooseToDiscard('是否发动【放逐】？').set('ai',function(card){
                return 5-get.value(card);},function(event,player){
            if(trigger.source.hasSkillTag('noturn')) return 0;
            var player=_status.event.player;
            if(get.attitude(_status.event.player,trigger.source)==0) return 0;
            if(get.attitude(_status.event.player,trigger.source)>0){
                if(trigger.source.classList.contains('turnedover')) return true;
            }
            else{
                if(trigger.source.classList.contains('turnedover')) return -1;                
                return  true;
            }
        }
        );
        'step 1'
        if(result.bool)
           { trigger.source.turnOver();
            trigger.source.draw();
          trigger.source.removeSkill('qx_fangzhu_1');}
    },
                        sub:true,
                    },
                    gain:{
                        trigger:{
                            global:"gainAfter",
                        },
                        popup:false,
                        filter:function (event,player){
        if(event.source==player&&event.player!=player)            
            return true;
    },
                        check:function (event,player){
        return get.attitude(player,event.player)<0;
    },
                        content:function (){
        player.discardPlayerCard('he',trigger.player);
    },
                        sub:true,
                    },
                },
            },
            "qx_luoshui":{
                audio:"luoshen",
                trigger:{
                    player:"phaseBeginStart",
                },
                unique:true,
                forced:true,
                skillAnimation:"epic",
                animationColor:"thunder",
                filter:function (event,player){
        return player.hp==1;
    },
                content:function (){        
        player.uninit;
        player.init(player.name,'魏·甄姬');
        player.maxHp=4;
        player.hp=1;
        player.update();
        player.awakenSkill('qx_luoshui');
    },
            },
            "qx_songwei":{
                audio:"songwei",
                trigger:{
                    global:"judgeEnd",
                },
                usable:2,
                frequent:true,
                filter:function (event,player){
        return event.player.group=='wei'&&player.identity=='zhu';
    },
                content:function (){
       'step 0'
       player.discardPlayerCard('是否弃置该角色一张手牌？','hj',trigger.player).set('ai',function(target){
            return -get.attitude(_status.event.player,target);
        });
        'step 1'
        if(!result.bool)player.draw();
    },
            },
            "qx_qiangxi5":{
                audio:"qiangxi",
                skillAnimation:true,
                unique:true,
                enable:"phaseUse",
                filter:function (event,player){
        if(!player.hasSkill('qx_qiangxi5'))return false;
        if(player.countCards('he')<2) return false;
        return !player.storage.qx_qiangxi5;
    },
                selectCard:2,
                init:function (player){
        if(player.hasSkill('qx_qiangxi5')){
            player.markSkill('qx_qiangxi5');
            player.storage.qx_qiangxi5=false;
        }
    },
                filterTarget:function (card,player,target){
        return target!=player;
    },
                filterCard:true,
                position:"he",
                check:function (card){
        return 7-get.value(card);
    },
                discard:false,
                prepare:"give",
                content:function (){
        player.storage.qx_qiangxi5=true;
        player.awakenSkill('qx_qiangxi5');
        target.gain(cards,player);
        player.storage.qx_qiangxi5_target=target;
        player.addSkill('qx_qiangxi6');
        target.markSkillCharacter('qx_qiangxi5',player,'强袭','成为强袭目标直到'+get.translation(player)+'首次进入濒死状态');
    },
                intro:{
                    content:"limited",
                },
                ai:{
                    order:7,
                    result:{
                        player:function (player,target){
                if(player.hasUnknown()) return 0;
                var att=get.attitude(player,target);
                if(att<=0){
                    if(target.hp==1) return (10-att)/2;
                    return 10-att;
                }
                else{
                    if(target.hp==1) return 0;
                    return (10-att)/4;
                }
            },
                    },
                },
            },
            "qx_qiangxi6":{
                trigger:{
                    player:"damageEnd",
                },
                forced:true,
                content:function (){
        player.storage.qx_qiangxi5_target.damage(trigger.num);
    },
                group:["qx_qiangxi6_discard","qx_qiangxi6_die"],
                subSkill:{
                    discard:{
                        trigger:{
                            player:"discardEnd",
                        },
                        filter:function (event,player){
                return player.storage.qx_qiangxi5_target.countCards('he');
            },
                        popup:false,
                        forced:true,
                        content:function (){               
        player.storage.qx_qiangxi5_target.chooseToDiscard(true);
    },
                        sub:true,
                    },
                    die:{
                        trigger:{
                            player:"dying",
                        },
                        popup:false,
                        forced:true,
                        filter:function (event,player){
                return player.storage.qx_qiangxi5_target.isAlive();
            },
                        content:function (){               
            player.storage.qx_qiangxi5_target.unmarkSkill('qx_qiangxi5');
                    delete player.storage.qx_qiangxi5_target;
                    player.removeSkill('qx_qiangxi6');
    },
                        sub:true,
                    },
                },
            },
            "qx_feiji":{
                mod:{
                    selectTarget:function (card,player,range){
            if(card.name=='sha'&&player.storage.qx_feiji_ji==0) range[1]+=1;
        },
                },
                group:"qx_feiji_ji",
                audio:"qiangxi",
                enable:"phaseUse",
                filter:function (event,player){
       return player.storage.qx_feiji_ji>0;
    },
                filterCard:true,
                selectCard:1,
                filterTarget:function (card,player,target){
        if(player==target) return false;
        return true;
    },
                content:function (){ 
        'step 0'
        player.storage.qx_feiji_ji--;    
        player.markSkill('qx_feiji_ji');
        target.damage();
       'step 1'
        var evt=_status.event.getParent('phase');
        if(evt){       
            _status.event=evt;
            _status.event.finish();
            game.resetSkills();
        }
    },
                check:function (card){
        return 6.9-get.value(card);
    },
                position:"he",
                ai:{
                    order:1,
                    jueqing:true,
                    result:{
                        target:function (player,target){
                return get.damageEffect(target,player);
            },
                    },
                },
                threaten:1.5,
                subSkill:{
                    ji:{
                        init:function (player){
        player.storage.qx_feiji_ji=3;
    },
                        mark:true,
                        trigger:{
                            player:["damageEnd","phaseEnd"],
                        },
                        forced:true,
                        filter:function (event,player){
            return  player.storage.qx_feiji_ji==0;
        },
                        content:function (){                 
            player.storage.qx_feiji_ji++;         
    },
                        intro:{
                            content:"剩余#枚",
                        },
                        ai:{
                            "maixie_defend":true,
                            effect:{
                                target:function (card,player,target){
                if(player.hasSkillTag('jueqing',false,target)) return [1,-1];
                return 0.8;
                // if(get.tag(card,'damage')&&get.damageEffect(target,player,player)>0) return [1,0,0,-1.5];
            },
                            },
                        },
                        sub:true,
                    },
                },
            },
            "qx_jizhi":{
                audio:"jizhi",
                trigger:{
                    target:"useCardToBefore",
                },
                frequent:true,
                content:function (){
        player.draw()
    },
            },
            "qx_qicai":{
                audio:"jiqiao",
                trigger:{
                    player:"useCard",
                },
                direct:true,
                filter:function (event,player){
         if(get.info(event.card).multitarget) return false;
        if(!player.countCards('he')) return false;
        return event.targets.length==1&&get.type(event.card)=='trick';
    },
                position:"he",
                content:function (){
        "step 0"
        player.chooseTarget(get.prompt('qx_qicai'),function(card,player,target){
            var trigger=_status.event.getTrigger();
            return lib.filter.filterTarget(trigger.card,player,target)&&target!=trigger.targets[0];
        }).set('autodelay',true).set('ai',function(target){
            var trigger=_status.event.getTrigger();
            var player=_status.event.player;
            return get.effect(target,trigger.card,player,player);
        });
        "step 1"
        if(result.bool){
            player.chooseToDiscard('he',true);
            trigger.targets.push(result.targets[0]);
            player.logSkill('qx_qicai',result.targets);
        }
    },
            },
            "qx_tongren":{
                enable:"phaseUse",
                filterCard:{
                    color:"red",
                },
                usable:1,
                prepare:"give",
                discard:false,
                group:"qx_tongren2",
                check:function (card){
        return 9-get.value(card)
    },
                filterTarget:function (card,player,target){
        return player!=target;
    },
                content:function (){
        target.gain(cards,player);
        player.draw();
    },
                ai:{
                    order:4,
                    result:{
                        target:function (player,target){
                if(target.hasSkillTag('nogain')) return 0;
                if(ui.selected.cards.length&&ui.selected.cards[0].name=='du'){
                    if(target.hasSkillTag('nodu')) return 0;
                    return -10;
                }
                if(target.hasJudge('lebu')) return 0;
                return 5;
            },
                    },
                },
            },
            "qx_paoxiao":{
                mod:{
                    cardUsable:function (card,player,num){
            if(card.name=='sha') return num+player.storage.qx_paoxiao;
        },
                    selectTarget:function (card,player,range){
            if(card.name=='sha') range[1]+=Infinity;
        },
                },
                init:function (player){
        player.storage.qx_paoxiao=0;
    },
                audio:"paoxiao",
                group:"qx_paoxiao_clear",
                trigger:{
                    player:"useCardBegin",
                },
                filter:function (event,player){
        if(player.hasSkill('qx_numu2')) return false;
        return event.card&&event.card.name=='sha';
    },
                frequent:true,
                content:function (){
        "step 0"
        player.judge(function(card){
            if(get.color(card)=='black') return -2;
            return 2;
        })
        "step 1"
        if(result.judge<2){
            event.finish;
        }
       if(result.judge==2){
            player.storage.qx_paoxiao++;
       }
       
    },
                subSkill:{
                    clear:{
                        trigger:{
                            player:"phaseEnd",
                        },
                        forced:true,
                        content:function (){
        player.storage.qx_paoxiao=0;
    },
                        sub:true,
                    },
                },
            },
            "qx_numu1":{
                enable:"phaseUse",
                skillAnimation:"epic",
                animationColor:"fire",
                unique:true,
                mark:true,
                filterTarget:function (card,player,target){
        return target!=player;
    },
                intro:{
                    content:"limited",
                },
                content:function (){
        target.addTempSkill('qx_numu3');
        player.addTempSkill('qx_numu2');
        player.awakenSkill('qx_numu1');
    },
                ai:{
                    order:9,
                    result:{
                        target:function (player,target){          
                if(player.countCards('h')>target.hp&&player.countCards('h')-target.hp<4)
             return get.damageEffect(target,player);
              
            },
                    },
                },
            },
            "qx_numu2":{
                mod:{
                    playerEnabled:function (card,player,target){
                if(player!=target&&!target.hasSkill('qx_numu3')) return false;            
        },
                    targetInRange:function (card,player,target,now){
            if(target.hasSkill('qx_numu3'))  return true;
        },
                    cardUsable:function (card,player,num){
            if(card.name=='sha') return num+Infinity;
        },
                },
                audio:"paoxiao",
                enable:["chooseToUse","chooseToRespond"],
                filterCard:true,
                viewAs:{
                    name:"sha",
                    suit:"spade",
                    number:1,
                    cards:[{"node":{"image":{},"info":{},"name":{},"name2":{},"background":{},"intro":{},"range":{}},"storage":{},"vanishtag":[],"_uncheck":[],"suit":"spade","number":1,"name":"caomu","cardid":"5632693313","_transform":"translateX(0px)","clone":{"name":"caomu","suit":"spade","number":1,"node":{"name":{},"info":{},"intro":{},"background":{},"image":{}},"_transitionEnded":true,"timeout":1478},"timeout":1423,"original":"h"}],
                },
                ai:{
                    unequip:true,
                    basic:{
                        useful:[5,1],
                        value:[5,1],
                    },
                    order:function (){
            if(_status.event.player.hasSkillTag('presha',true,null,true)) return 10;
            return 3;
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
            "qx_numu3":{
            },
            "qx_tongren2":{
                trigger:{
                    global:"shaBegin",
                },
                filter:function (event,player){
        if(event.target.hasSkill('qx_tongren'))
        return player.countCards('h','shan')&&event.target!=player;
    },
                check:function (event,player){
        if(player.countCards('h','shan')==1)return false;
        return get.attitude(player,event.target)>0;
    },
                content:function (){
        "step 0"
        if(trigger.target!=player){
            player.chooseCard(true,'h',function(card){
            return card.name=='shan';},'交给'+get.translation(trigger.target)+'一张牌').set('ai',function(card){
                if(card.name=='shan') return 1;                
                return 0;
            });
        }
        else{
            event.finish();
        }
        "step 1"
        trigger.target.gain(result.cards,player);
        player.$give(result.cards,trigger.target);
    },
            },
            "qx_qinwang":{
                group:"qx_qinwang_draw",
                trigger:{
                    player:"discardAfter",
                },
                filter:function (event,player){
        for(var i=0;i<event.cards.length;i++){
            if(get.position(event.cards[i])=='d'){
                return true;
            }
        }
        return false;
    },
                direct:true,
                popup:false,
                content:function (){
        "step 0"
        if(trigger.delay==false) game.delay();
        event.cards=[];
        for(var i=0;i<trigger.cards.length;i++){
            if(get.position(trigger.cards[i])=='d'){
                event.cards.push(trigger.cards[i]);
                ui.special.appendChild(trigger.cards[i]);
            }
        }
        "step 1"
        if(event.cards.length){
            var goon=false;
            for(var i=0;i<event.cards.length;i++){
                if(event.cards[i].name=='du'){
                    goon=true;break;
                }
            }
            if(!goon){
                goon=game.hasPlayer(function(current){
                    return player!=current&&get.attitude(player,current)>1;
                });
            }
            player.chooseCardButton(get.prompt('qx_qinwang'),event.cards,[1,event.cards.length]).set('ai',function(button){
                if(!_status.event.goon||ui.selected.buttons.length) return 0;
                if(button.link.name=='du') return 2;
                return 1;
            }).set('goon',goon);
        }
        else{
            event.finish();
        }
        "step 2"
        if(result.bool){
            event.togive=result.links.slice(0);
            player.chooseTarget('将'+get.translation(result.links)+'交给一名角色',true,function(card,player,target){
                return target!=player;
            }).set('ai',function(target){
                var att=get.attitude(_status.event.player,target);
                if(_status.event.enemy){
                    return -att;
                }
                else{
                    if(att>2) return att/Math.sqrt(1+target.countCards('h'));
                    return att/Math.sqrt(1+target.countCards('h'))/5;
                }
            }).set('enemy',get.value(event.togive[0])<0);
        }
        else{
            for(var i=0;i<event.cards.length;i++){
                event.cards[i].discard();
            }
            event.finish();
        }
        "step 3"
        if(result.bool){
            player.logSkill('qx_qinwang',result.targets);
            for(var i=0;i<event.togive.length;i++){
                event.cards.remove(event.togive[i]);
            }
            result.targets[0].gain(event.togive,player);
            result.targets[0].$gain2(event.togive);
            event.goto(1);
        }
        else{
            for(var i=0;i<event.cards.length;i++){
                event.cards[i].discard();
            }
            event.finish();
        }
    },
                ai:{
                    expose:0.1,
                    effect:{
                        target:function (card,player,target,current){
                if(target.hasFriend()&&get.tag(card,'discard')){
                    if(current<0) return 0;
                    return [1,1];
                }
            },
                    },
                },
                subSkill:{
                    draw:{
                        trigger:{
                            player:"drawAfter",
                        },
                        forced:true,
                        filter:function (event,player){
        return event.num>1;
    },
                        content:function (){
        player.chooseToDiscard(true);
    },
                        sub:true,
                    },
                },
            },
            "qx_buqu":{
                audio:"zhanjue",
                filter:function (event,player){
        return event.player!=player&&event.card&&(event.card.name=='sha'||get.type(event.card)=='trick');
    },
                logTarget:"player",
                check:function (event,player){
        if(get.attitude(player,event.player)>0){
            return false;
        }
        if(get.tag(event.card,'respondSha')){
            if(player.countCards('h',{name:'sha'})==0){
                return true;
            }
        }
        else if(get.tag(event.card,'respondShan')){
            if(player.countCards('h',{name:'shan'})==0){
                return true;
            }
        }
        else if(get.tag(event.card,'damage')){
            if(player.countCards('h')<2) return true;
        }
        else if(event.card.name=='shunshou'&&player.hp>2){
            return true;
        }
        else if(player.identity=='zhong'&&game.zhu.hp==1){
            return true;
        }
        return false;
    },
                priority:10,
                trigger:{
                    target:"useCardToBefore",
                },
                content:function (){
        "step 0"
        player.damage();
        trigger.player.damage();
        "step 1"        
        trigger.cancel();               
    },
                ai:{
                    expose:0.3,
                },
            },
            "qx_xuezhan":{
                audio:"zhanjue",
                trigger:{
                    player:"phaseEnd",
                },
                round:2,
                forced:true,
                content:function (){
        'step 0'
        player.damage();
        player.chooseTarget([1,2]).set('ai',function(target){
            return 0.5-get.attitude(_status.event.player,target);
        });
        'step 1'
        if(result.bool){
            player.logSkill('qx_xuezhan',result.targets);
            for(var i=0;i<result.targets.length;i++){
                result.targets[i].damage();                            
        }
    }
    },
                subSkill:{
                    damage:{
                        trigger:{
                            player:"damageEnd",
                        },
                        frequent:true,
                        content:function (){
        player.draw(3);
    },
                        sub:true,
                    },
                    recover:{
                        trigger:{
                            player:"recoverEnd",
                        },
                        filter:function (event,player){
                return player.hp>1;
            },
                        forced:true,
                        content:function (){
        player.loseHp();
                player.changeHujia();
    },
                        sub:true,
                    },
                },
                group:["qx_xuezhan_roundcount","qx_xuezhan_damage","qx_xuezhan_recover"],
            },
            "qx_zhanjue":{
                trigger:{
                    player:"dying",
                },
                skillAnimation:"epic",
                animationColor:"fire",
                unique:true,
                forced:true,
                priority:4,
                content:function (){
        player.recover(5);
        player.addSkill('qx_xuezhan');
        player.addSkill('qx_buqu');
        player.awakenSkill('qx_zhanjue');
    },
            },
            "qx_jizhao":{
                audio:"qinwang",
                trigger:{
                    player:"dying",
                },
                forced:true,
                priority:30,
                unique:true,
                filter:function (event,player){
        return player.identity=="zhu";
    },
                content:function (){
       'step 0' 
       player.chooseTarget(get.prompt('qx_jizhao'),function(event,player,target){
            return target.group=='shu'&&target!=player&&!target.hasSkill('qx_jizhao');}).set('ai',function(target){
            return get.attitude(_status.event.player,target);
        });
       'step 1'
       if(result.bool){
           player.logSkill('qx_jizhao');
          for(var i=0;i<result.targets.length;i++){
                player.line(result.targets[i]);
           result.targets[i].addSkill('qx_buqu');}
       }
    },
            },
            "qx_longdan2":{
                trigger:{
                    player:"useCardAfter",
                },
                forced:true,
                popup:false,
                filter:function (event,player){
        return event.skill&&(event.skill=="qx_longdan1_backup"||event.skill=="qx_longdan1_shan");
    },
                content:function (){
        player.turnOver();        
    },
            },
            "qx_longdan1":{
                group:["qx_longdan2","qx_longdan1_shan"],
                enable:"phaseUse",
                filter:function (event,player){
        return !player.isTurnedOver();
    },
                chooseButton:{
                    dialog:function (event,player){
            var list=['sha','tao','jiu'];
            for(var i=0;i<list.length;i++){
                if(i<3){
                    list[i]=['基本','',list[i]];
                }
            }
            return ui.create.dialog([list,'vcard']);
        },
                    filter:function (button,player){
            return lib.filter.filterCard({name:button.link[2]},player,_status.event.getParent());
        },
                    check:function (button){
            var player=_status.event.player;
            var players=game.filterPlayer();                        
            if(button.link=='tao'){
                if(player.hp<3)
                return 1000+Math.random();
            }
            if(button.link=='sha'){
                return 2+Math.random();
            } 
            if(button.link=='jiu'){
                return 0;
            }  
            return Math.random();
        },
                    backup:function (links,player){
            return {
                audio:"longdan1",
                filterCard:false,
                selectCard:0,
                popname:true,
                viewAs:{name:links[0][2]},
            }
        },
                    prompt:function (links,player){
            return '选择'+get.translation(links[0][2])+'的目标';
        },
                },
                ai:{
                    order:4,
                    result:{
                        player:function (player){
                var allshown=true,players=game.filterPlayer();
                for(var i=0;i<players.length;i++){
                    if(players[i].ai.shown==0){
                        allshown=false;
                    }
                    if(players[i]!=player&&players[i].countCards('h')&&get.attitude(player,players[i])>0){
                        return 1;
                    }
                }
                if(allshown) return 1;
                return 0;
            },
                    },
                    threaten:1.6,
                },
                subSkill:{
                    shan:{
                        audio:"longdan2",
                        enable:"chooseToRespond",
                        viewAs:{
                            name:"shan",
                        },
                        filterCard:function (){return false},
                        viewAsFilter:function (player){
        return player.isTurnedOver();
    },
                        onrespond:function (event,player){
              if(player.isTurnedOver())player.turnOver();
            },
                        check:function (){return Infinity},
                        selectCard:-1,
                        prompt:"视为使用一张闪",
                        ai:{
                            respondShan:true,
                            effect:{
                                target:function (card,player,target){
                        if(get.tag(card,'respondShan')){
                         if(target.isTurnedOver()&&target.countCards('he')>2)  return [1,2];
                        }                
               },
                            },
                            basic:{
                                useful:[7,2],
                                value:[7,2],
                            },
                        },
                        sub:true,
                    },
                },
            },
            "qx_yajiao":{
                group:["qx_yajiao_turn","qx_yajiao_t"],
                mod:{
                    globalTo:function (from,to,current){
          if(!to.classList.contains('turnedover'))  return current+1;
        },
                    targetInRange:function (card,player,target,now){
            if(player.isTurnedOver())  return true;
        },
                },
                trigger:{
                    source:"damageBefore",
                },
                filter:function (event,player){
        return player.isTurnedOver();
    },
                check:function (event,player){
         if(get.attitude(player,event.player)>0&&!event.player.isTurnedOver()){
            return false;
        }
        if(get.attitude(player,event.player)<0&&event.player.isTurnedOver()){
            return false;
        }
        return true;
    },
                content:function (){
         "step 0"
        player.judge(function(card){
            if(get.color(card)=='black') return 1;
            return 2;
        })
        "step 1"
        if(result.judge==1){
            trigger.player.turnOver();
        }
       if(result.judge==2){
           player.turnOver();
         
       }
    },
                subSkill:{
                    turn:{
                        audio:"reyajiao",
                        usable:2,
                        trigger:{
                            player:"turnOverAfter",
                        },
                        frequent:true,
                        content:function (){
                "step 0"                
        player.chooseTarget('是否获得其他角色一张牌',function(card,player,target){
            return player!=target&&target.countCards('he')>0;}).set('ai',function(target){
            return -get.attitude(_status.event.player,target);
        });
                "step 1"
         if(result.bool){
             player.gainPlayerCard(result.targets[0],'he');
             result.targets[0].draw();
         }
            },
                        sub:true,
                    },
                    t:{
                        trigger:{
                            player:"turnOverAfter",
                        },
                        forced:true,
                        content:function (){
                player.addTempSkill('qx_yajiao_sha');
                player.storage.qx_yajiao_sha++;
            },
                        sub:true,
                    },
                    sha:{
                        init:function (player){
        player.storage.qx_yajiao_sha=0;
    },
                        mod:{
                            cardUsable:function (card,player,num){
            if(card.name=='sha') return num+player.storage.qx_yajiao_sha;
        },
                        },
                        sub:true,
                    },
                },
            },
            "qx_jiang2":{
                audio:"jiang",
                group:"qx_jiang1",
                trigger:{
                    source:"damageEnd",
                },
                frequent:true,
                content:function (){
        player.draw()
    },
            },
            "qx_jiang1":{
                trigger:{
                    global:"gameDrawAfter",
                },
                forced:true,
                unique:true,
                filter:function (event,player){
        if(player.identity!='zhu') return false;
        return game.players.length>4;
    },
                content:function (){
        player.loseMaxHp()
    },
            },
            "qx_yingzi1":{
                init:function (player){
        player.storage.qx_yingzi1=false;
    },
                audio:"ext:群雄并起:2",
                group:"qx_yingzi3",
                trigger:{
                    player:"phaseBegin",
                },
                frequent:true,
                content:function (){
        "step 0"        
        player.judge(function(card){
            if(get.color(card)=='black') return -2;
            return 2;
        })
        player.storage.qx_yingzi1=true;
        "step 1"
        if(result.judge<2){
            event.finish;
        }
       if(result.judge==2){
           player.draw();
         player.addTempSkill('qx_yingzi2');
       }
        "step 2"        
        player.storage.qx_yingzi1=false;
       
    },
            },
            "qx_yingzi2":{
                mod:{
                    maxHandcard:function (player,num){
            return num+1;
        },
                    cardUsable:function (card,player,num){
            if(card.name=='sha'||card.name=='jiu') return num+1;
        },
                },
            },
            "qx_yingyang1":{
                trigger:{
                    target:"shaBegin",
                },
                filter:function (event,player){
        return event.card.name=='sha'&&player.hasSha();
    },
                priority:3,
                unique:true,
                direct:true,
                content:function (){
        player.chooseToUse({name:'sha'},'鹰扬：是否使用一张杀？').logSkill='qx_yingyang';
    },
            },
            "qx_yingyang2":{
                trigger:{
                    player:"phaseUseBefore",
                },
                content:function (){
       'step 0' 
       player.chooseTarget(get.prompt('qx_yingyang2'),function(event,player,target){
            return target.group=='wu'&&target!=player&&!target.hasSkill('qx_yingyang_0');}).set('ai',function(target){
            return get.attitude(_status.event.player,target);
        });
       'step 1'
       if(result.bool){
           player.logSkill('qx_yingyang2');
           player.line(result.targets[0]);
           result.targets[0].addSkill('qx_yingyang_0');}
    },
            },
            "qx_yingyang0":{
                trigger:{
                    global:"gameDrawAfter",
                },
                forced:true,
                filter:function (event,player){
       if(player.identity!='zhu') return false;
        return true;
},
                content:function (){
        player.addSkill('qx_yingyang1');
        player.addSkill('qx_yingyang2');
    },
            },
            "qx_yingyang_0":{
                trigger:{
                    global:"shaEnd",
                },
                frequent:true,
                filter:function (event,player,card){
        return event.player.hasSkill('qx_yingyang2');
    },
                content:function (){
        player.chooseToUse({name:'sha'},'激扬：是否使用一张杀？').logSkill='qx_yingyang_0';
    },
            },
            "qx_zhiba1":{
                group:["qx_zhiba2","qx_zhiba1_gain","qx_zhiba1_damage"],
                mod:{
                    wuxieRespondable:function (){
            return false;
        },
                },
                audio:"zhiba",
                trigger:{
                    player:"discardEnd",
                },
                frequent:true,
                content:function (){
        'step 0'
        player.chooseTarget('是否弃置其他角色一张牌',function(card,player,target){
            return player!=target&&target.countCards('he')>0;}).set('ai',function(target){
            return 0.5-get.attitude(_status.event.player,target);
        });
       'step 1'
       if(result.bool){
       player.logSkill('qx_zhiba1');
        player.discardPlayerCard(result.targets[0],'he',false);}
    },
                subSkill:{
                    damage:{
                        trigger:{
                            player:"damageEnd",
                        },
                        filter:function (card,player){
               return  player.countCards('h');
            },
                        content:function (){                
        player.chooseToDiscard().set('ai',function(card){
                return 5-get.value(card);});
    },
                        sub:true,
                    },
                    gain:{
                        audio:"zhiba",
                        trigger:{
                            global:"gainBegin",
                        },
                        popup:false,
                        filter:function (event,player){
        if(event.source==player&&event.player!=player)
            return true;            
        },
                        content:function (){
       'step 0'
        player.chooseTarget('是否令一名角色摸牌',function(card,target,player){
            return target!=player;}).set('ai',function(target){
            return get.attitude(_status.event.player,target);
        });
       'step 1'
       if(result.bool){
       player.logSkill('qx_zhiba1');
      result.targets[0].draw(player.maxHp-player.hp); }
    
    },
                        sub:true,
                    },
                },
            },
            "qx_zhiba2":{
                audio:"zhiba",
                trigger:{
                    player:"phaseJudgeBegin",
                },
                frequent:true,
                filter:function (event,player){
        return player.countCards('j');
    },
                content:function (){
         player.$gain(player.getCards('j'),Infinity);
        player.gain(player.getCards('j'),Infinity);
       
    },
            },
            "qx_tianyi":{
                mod:{
                    targetInRange:function (card,player,target,now){
            return true;
        },
                    selectTarget:function (card,player,range){
            if(card.name=='sha') range[1]+=1;
        },
                },
                group:["qx_tianyi2","qx_tianyi3"],
                audio:"tianyi",
                trigger:{
                    player:"shaBegin",
                },
                forced:true,
                content:function (){
        trigger.shanRequired=2;        
    },
                ai:{
                    unequip:true,
                },
            },
            "qx_tianyi2":{
                mod:{
                    targetEnabled:function (card,player,target){
                if(card.name=='zhuge') return false;
            
        },
                },
                enable:"phaseUse",
                filterCard:{
                    name:"zhuge",
                },
                check:function (card){
        return get.value(card)
    },
                filterTarget:function (card,player,target){
        if(target.hp>=target.maxHp) return false;
        return true;
    },
                content:function (){
        target.recover();
        player.draw(2);
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
                    threaten:1,
                },
            },
            "qx_tianyi3":{
                trigger:{
                    player:"phaseDiscardBefore",
                },
                forced:true,
                filter:function (event,player){
        if(player.countCards('h'))       
        return player.countUsed('sha')!=0;
    },
                content:function (){
       player.chooseToDiscard(true);
    },
            },
            "qx_yingzi3":{
                trigger:{
                    global:"damageBefore",
                },
                check:function (event,player){
        if(player.hp<=2)return false;
        if(get.attitude(player,event.player)<=0)return false;
        if(player.hp<=event.player.hp) return false;
        return true;
    },
                filter:function (event,player){
        return event.player.hasSkill('qx_yingzi1')&&event.player!=player;
    },
                content:function (){
        trigger.cancel();
        player.loseHp();
        event.finish();
    },
            },
            "qx_longling":{
                group:"qx_longling_player",
                trigger:{
                    global:"damageBefore",
                },
                filter:function (event,player){
        return event.nature=='thunder'&&event.source!=player;
    },
                priority:100,
                forced:true,
                content:function (){
        'step 0'
        trigger.cancel();
        'step 1'
        player.chooseTarget(get.prompt('qx_longling')).set('ai',function(target){
            if(target.hasSkill('qx_fen')&&target.hp<target.maxHp)return get.attitude(_status.event.player,target);
            if(!target.hasSkill('qx_fen'))return -get.attitude(_status.event.player,target);
            if(target.hasSkill('qx_fen')&&target.hp==target.maxHp)return 0.1;
        });
        'step 2'
        if(result.bool){            
            player.line(result.targets[0]);
            if(!result.targets[0].hasSkill('qx_fen'))
            result.targets[0].damage(trigger.num,'thunder');
            if(result.targets[0].hasSkill('qx_fen')&&result.targets[0].hp<result.targets[0].maxHp)
                result.targets[0].recover(trigger.num);
            if(result.targets[0].hasSkill('qx_fen')&&result.targets[0].hp==result.targets[0].maxHp)
                result.targets[0].draw(trigger.num);
        }
    },
                subSkill:{
                    player:{
                        trigger:{
                            player:"damageBefore",
                        },
                        filter:function (event,player){
        return event.nature=='thunder'||event.nature=='fire';
    },
                        priority:109,
                        forced:true,
                        content:function (){
                if(trigger.nature=='thunder'){
                    trigger.cancel();
        player.recover(trigger.num);
                }
                if(trigger.nature=='fire'){
                    trigger.num--;       
                }
    },
                        sub:true,
                        ai:{
                            effect:{
                                target:function (card){
                if(get.tag(card,'thunderDamage')){
                    return [0,2];
                }
            },
                            },
                        },
                    },
                },
            },
            "qx_longyin":{
                group:"qx_longyin_clear",
                enable:"phaseUse",
                filterCard:true,
                usable:1,
                check:function (card){
        return 5-get.value(card)
    },
                filterTarget:true,
                selectTarget:[1,3],
                content:function (){
        target.addSkill('qx_fen');
    },
                ai:{
                    order:9,
                    result:{
                        target:function (player,target){
                 if(!target.hasFriend()) return 0;
                if(target==player) return 8;
                return 5;
            },
                    },
                },
                subSkill:{
                    clear:{
                        trigger:{
                            player:"phaseUseBegin",
                        },
                        forced:true,
                        content:function (){
        game.countPlayer(function(current){
            if(current.hasSkill('qx_fen')){                
                current.removeSkill('qx_fen');
            }
        });
    },
                        sub:true,
                    },
                },
            },
            "qx_fen":{
                alter:true,
                mark:true,
                marktext:"奋",
                intro:{
                    content:"振奋",
                },
            },
            "qx_qiyu":{
                trigger:{
                    player:"phaseBeginStart",
                },
                frequent:true,
                content:function (){
        'step 0'
        player.chooseControl('下雨','干旱','取消').set('ai',function(){
            if(player.countCards('h')>2) return '干旱';
            if(player.countCards('h')<3) return '下雨';            
        });
        'step 1'
        player.popup(result.control);
        if(result.control=='下雨'){
            if(player.hasSkill('qx_ganhan')) player.removeSkill('qx_ganhan');
            player.addSkill('qx_xiayu');
        }
        if(result.control=='干旱'){
            if(player.hasSkill('qx_xiayu')) player.removeSkill('qx_xiayu');
            player.addSkill('qx_ganhan');
        }
       if(result.control=='取消'){
           if(player.hasSkill('qx_ganhan')) player.removeSkill('qx_ganhan');
           if(player.hasSkill('qx_xiayu')) player.removeSkill('qx_xiayu');
       }
    },
            },
            "qx_xiayu":{
                trigger:{
                    global:"phaseBegin",
                },
                mark:true,
                marktext:"雨",
                intro:{
                    content:"无奋标记角色的摸牌阶段摸牌数加一，拥有奋标记的角色回合内获得牌时获得量加一，若为你且你有奋标记，你同时拥有以上两种效果",
                },
                forced:true,
                priority:30,
                content:function (){
        if(!trigger.player.hasSkill('qx_fen'))
        trigger.player.addTempSkill('qx_xiayu_1');
        if(trigger.player.hasSkill('qx_fen')){
        trigger.player.addTempSkill('qx_xiayu_2'); 
        if(trigger.player==player)trigger.player.addTempSkill('qx_xiayu_1');}  
        
    },
                subSkill:{
                    "1":{
                        trigger:{
                            player:"phaseDrawBegin",
                        },
                        forced:true,
                        content:function (){
        trigger.num++;
    },
                        sub:true,
                    },
                    "2":{
                        trigger:{
                            player:"drawBefore",
                        },
                        forced:true,
                        content:function (){
        trigger.num++;
    },
                        sub:true,
                    },
                },
            },
            "qx_ganhan":{
                trigger:{
                    global:"phaseBegin",
                },
                mark:true,
                marktext:"旱",
                intro:{
                    content:"场上某角色的回合内，该角色摸牌数量减一，若其有奋标记或者为你，则其不受影响",
                },
                forced:true,
                priority:30,
                filter:function (event,player){
        return event.player!=player&&!event.player.hasSkill('qx_fen');
    },
                content:function (){
        trigger.player.addTempSkill('qx_ganhan_1');
    },
                subSkill:{
                    "1":{
                        trigger:{
                            player:"phaseDrawBefore",
                        },
                        forced:true,
                        content:function (){
        trigger.num--;
    },
                        sub:true,
                    },
                },
            },
            "qx_longwei":{
                group:"qx_longwei_dying",
                trigger:{
                    target:["useCardToBefore"],
                },
                filter:function (event,player){
        return event.player!=player&&event.target;
    },
                forced:true,
                unique:true,
                content:function (){
        'step 0'
        if(player.hp>4&&trigger.player.countCards('he'))
            trigger.player.chooseToDiscard('he',true);
        if(player.hp<=4)
        player.judge(function(card){
            if(get.color(card)=='black') return -2;
            return 2;
        })
        "step 1"
        if(player.hp<=4&&result.judge<2){
            event.finish;
        }
       if(player.hp<=4&&result.judge==2){
           trigger.cancel();
           event.finish();
       }                
    },
                subSkill:{
                    dying:{
                        trigger:{
                            player:"damageBefore",
                        },
                        forced:true,
                        unique:true,
                        priority:1,
                        filter:function (event,player){
               return player.hp==1; 
            },
                        content:function (){
        trigger.source.addSkill('fengyin');
    },
                        sub:true,
                    },
                },
            },
            "qx_yunchong":{
                mod:{
                    targetInRange:function (card){
            if(card.nature=='thunder'&&card.name=='sha') return true;
        },
                },
                group:"qx_yunchong_lian",
                enable:"chooseToUse",
                filterCard:function (card){
        return card.name=='sha'&&!card.nature;
    },
                viewAs:{
                    name:"sha",
                    nature:"thunder",
                    suit:"club",
                    number:6,
                    cards:[{"node":{"image":{},"info":{},"name":{},"name2":{},"background":{},"intro":{},"range":{}},"storage":{},"vanishtag":[],"_uncheck":[],"suit":"club","number":6,"name":"sha","cardid":"7942900349","_transform":"translateX(224px)","clone":{"name":"sha","suit":"club","number":6,"node":{"name":{},"info":{},"intro":{},"background":{},"image":{}},"_transitionEnded":true,"timeout":2245},"timeout":2228,"original":"h"}],
                },
                ai:{
                    basic:{
                        useful:[5,1],
                        value:[5,1],
                    },
                    order:function (){
            if(_status.event.player.hasSkillTag('presha',true,null,true)) return 10;
             return get.order({name:'sha'})+0.1;
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
            "qx_yunchong_lian":{
                trigger:{
                    player:"phaseJudgeBefore",
                },
                check:function (event,player){
        if(player.hp<4) return false;
        return player.storage.qx_jiying>=3;
    },
                content:function (){
        'step 0'
        var i=0;
        if(player.hasSkill('qx_xiayu'))i=2;        
        player.loseHp();
        player.chooseTarget(get.prompt('qx_yunchong'),[0,i+3]).set('ai',function(target){
            if(target==player) return true;
            return -get.attitude(_status.event.player,target);
        });
        'step 1'
         if(result.bool){           
          for(var i=0;i<result.targets.length;i++){
                player.line(result.targets[i]);
           result.targets[i].addTempSkill('qx_yunchong_lian_l');
        }
       }
    },
                subSkill:{
                    l:{
                        alter:true,
                        mark:true,
                        marktext:"连",
                        intro:{
                            content:"次状态下，一名角色受到⚡️伤害时，其他角色也受到⚡️伤害",
                        },
                        trigger:{
                            global:"damageEnd",
                        },
                        filter:function (event,player){               
        return event.nature=='thunder';
    },
                        forced:true,
                        content:function (){                              
        player.damage(trigger.num,'thunder',trigger.source);  
                player.removeSkill('qx_yunchong_lian_l');
               
    },
                        sub:true,
                    },
                },
            },
            "qx_zhengua":{
                group:"qx_zhengua_lei",
                init:function (player){
        player.storage.qx_zhengua=0;
    },
                unique:true,
                enable:"phaseUse",
                skillAnimation:"epic",
                animationColor:"thunder",
                filter:function (event,player){
       return player.storage.qx_zhengua==0;
    },
                filterTarget:function (card,player,target){
        return true;
    },
                selectTarget:[1,4],
                content:function (){
        target.addSkill('qx_zhenji');
        player.storage.qx_zhengua++;
    },
                ai:{
                    order:9,
                    result:{
                        target:function (player,target){
                return get.damageEffect(target,player);
            },
                    },
                    threaten:1.3,
                },
                subSkill:{
                    lei:{
                        trigger:{
                            global:"phaseJudgeBefore",
                        },
                        forced:true,
                        filter:function (event,player){     
        return event.player.hasSkill('qx_zhenji');
    },
                        unique:true,
                        content:function (){
        "step 0"
        trigger.player.judge(function(card){
            if(get.suit(card)=='spade') return -5;
            return 5;
        })
        "step 1"
        if(result.judge==5){
            event.finish;
        }
       if(result.judge==-5){
        trigger.player.damage('thunder',3);
           player.storage.qx_zhengua=0;
           game.countPlayer(function(current){
            if(current.hasSkill('qx_zhenji')){              
                current.removeSkill('qx_zhenji');
            }
        });
       }
       
    },
                        sub:true,
                    },
                },
            },
            "qx_zhenji":{
                alter:true,
                mark:true,
                marktext:"⚡️",
                intro:{
                    content:"回合开始时，进行⚡️判定",
                },
            },
            "qx_jiying":{
                init:function (player){
        player.storage.qx_jiying=0;
    },
                trigger:{
                    source:"damageEnd",
                    player:"respond",
                },
                filter:function (event,player){
        if(event.name=='damage')return event.nature=='thunder';
        if(event.name=='respond')return event.card.name=='shan';
    },
                forced:true,
                content:function (){
        player.storage.qx_jiying++;
        player.markSkill('qx_jiying');
    },
                intro:{
                    content:"#⚡️",
                },
                group:["qx_jiying_shan","qx_jiying_phase"],
                subSkill:{
                    shan:{
                        enable:["chooseToRespond"],
                        filterCard:true,
                        viewAs:{
                            name:"shan",
                            suit:"club",
                            number:3,
                        },
                        viewAsFilter:function (player){
        if(!player.countCards('h')) return false;
    },
                        prompt:"将一张黑色手牌当闪打出",
                        sub:true,
                        check:function (){return 1},
                        ai:{
                            respondShan:true,
                            effect:{
                                target:function (card,player,target,current){
                if(get.tag(card,'respondShan')&&current<0) return 0.6
            },
                            },
                            basic:{
                                useful:[7,2],
                                value:[7,2],
                            },
                        },
                    },
                    phase:{
                        trigger:{
                            player:"phaseUseBegin",
                        },
                        filter:function (event,player){
        return player.storage.qx_jiying>2;
    },
                        check:function (player){
        return player.storage.qx_jiying>2;
    },
                        frequent:true,
                        content:function (){                 
              "step 0"
         var list=[];
                if(player.storage.qx_jiying>2){
            list.push('三');
        }
                if(player.storage.qx_jiying>5){
            list.push('六');
        }
                if(player.storage.qx_jiying>8){
            list.push('九');
        }
                player.chooseControl(list,function(event,player){
            if(player.storage.qx_jiying>8) return '九';
                    if(player.storage.qx_jiying>5) return '六';
            return '三';}).set('prompt','选择要使用的疾标记数量');                
                "step 1"
                if(result.control){
        player.chooseTarget().set('ai',function(target){
            return -get.attitude(_status.event.player,target);
        });
                }
                event.control=result.control;
         "step 2"         
         if(result.bool){
           if(event.control=='三'){
            result.targets[0].damage('thunder');
            player.storage.qx_jiying=player.storage.qx_jiying-3;
           }
        if(event.control=='六'){
            result.targets[0].damage(2,'thunder');
            player.storage.qx_jiying=player.storage.qx_jiying-6;
            
        }
        if(event.control=='九'){
            result.targets[0].damage(3,'thunder');
            player.storage.qx_jiying=player.storage.qx_jiying-9;
        }
         }
         
    },
                        sub:true,
                        ai:{
                            order:81,
                            result:{
                                target:function (player,target){   
                        
                return get.damageEffect(target,player);
            },
                            },
                        },
                    },
                },
            },
            "qx_qianxun":{
                mod:{
                    targetEnabled:function (card,player,target){
            if(get.type(card)=='delay') return false;
        },
                },
                trigger:{
                    player:"damageBegin",
                },
                audio:"reqianxun",
                direct:true,
                filter:function (event,player){
        return event.source;
    },
                content:function (){
        "step 0"
        var next=player.chooseToDiscard(get.prompt('qx_qianxun'),'he',
                                        function(card,player,target){
            if(player.hp>trigger.source.hp)return get.suit(card)=='heart';
        else return  get.color(card)=='red';});
        next.set('ai',function(card){
            return 9-get.value(card);
        });
        next.set('logSkill','qx_qianxun');
        "step 1"
        if(result.bool){
            trigger.num--;
        }
    },
                ai:{
                    threaten:0.8,
                },
            },
            "qx_lianying":{
                trigger:{
                    player:"loseEnd",
                },
                audio:"relianying",
                filter:function (event,player){
        return  !player.countCards('h');
    },
                frequent:true,
                content:function (){
        'step 0'       
        player.chooseTarget('是否横置一名角色').set('ai',function(target){
            if(target.isLinked())return get.attitude(_status.event.player,target);
            if(!target.isLinked())return -get.attitude(_status.event.player,target);
        });
       'step 1'
       if(result.bool){
       player.logSkill('qx_lianying');
           player.line(result.targets[0]);
        result.targets[0].link();}
        'step 2'
        var gained=get.cards()[0];
        player.gain(gained,'gain2');               
        if(get.type(gained)!='equip')
       player.chooseToUse().prompt='是否使用'+get.translation(gained)+'？';
            
    },
                ai:{
                    threaten:0.8,
                    effect:{
                        target:function (card){
                if(card.name=='guohe'||card.name=='liuxinghuoyu') return 0.5;
            },
                    },
                    noh:true,
                },
            },
            "qx_jieyan":{
                init:function (player){
        player.storage.qx_jieyan=false;
    },
                mark:true,
                intro:{
                    content:"limited",
                },
                audio:"relianying",
                unique:true,
                enable:"phaseUse",
                animationColor:"fire",
                skillAnimation:"legend",
                filterCard:function (card){
        var color=get.color(card);
        for(var i=0;i<ui.selected.cards.length;i++){
            if(get.color(ui.selected.cards[i])==color) return false;
        }
        return true;
    },
                complexCard:true,
                limited:true,
                selectCard:2,
                line:"fire",
                filterTarget:true,
                selectTarget:true,
                content:function (){
        player.awakenSkill('qx_jieyan');        
        target.damage('fire');
    },
                ai:{
                    order:10,
                    result:{
                        target:function (player,target){     
                for(var i=0;i<game.players.length;i++)
           {   if(game.players[i].isLinked()&&get.attitude(player,game.players[i])>0)return false;              
           if(!game.players[i].isLinked()&&get.attitude(player,game.players[i])<0)return false;  }
                if(target.hasSkillTag('nofire')) return 0;                 
                if(player.hasUnknown()) return 0;
                return get.damageEffect(target,player);
            },
                    },
                },
            },
            "qx_jinjiu":{
                mod:{
                    targetEnabled:function (card,player,target){
                if(card.name=='jiu') return false;
            
        },
                },
                audio:"jinjiu",
                enable:"phaseUse",
                filterCard:{
                    name:"jiu",
                },
                position:"he",
                filterTarget:function (card,player,target){
        return true;
    },
                content:function (){
        'step 0'
        player.useCard({name:'sha',nature:'thunder'},target,false);
        'step 1'
        player.chooseTarget(get.prompt('qx_jinjiu'),function(card,player,target){
            return player!=target
        }).set('ai',function(target){
            return get.attitude(_status.event.player,target)});
       'step 2'
       if(result.bool){
           player.logSkill('qx_jinjiu',result.targets);  
           result.targets[0].$gain(cards,player);
            result.targets[0].gain(cards,player);
       };
    },
                ai:{
                    order:8.5,
                    result:{
                        target:function (player,target){               
                return get.damageEffect(target,player);
            },
                    },
                },
                threaten:1,
            },
            "qx_zhongyi":{
                trigger:{
                    global:"dieBefore",
                },
                forced:true,
                filter:function (event,player){
        return player.identity=='zhong'&&event.player.identity=='zhu';
    },
                content:function (){        
       trigger.player.recover(5);
        trigger.cancel();             
        event.finish();
        player.die();
    },
            },
            "qx_huangshi":{
                trigger:{
                    player:"damageEnd",
                },
                round:1,
                frequent:true,
                content:function (){
        'step 0'
        var chat="乱臣者，必当株之";
        player.say(chat);
        player.draw();
        player.chooseTarget('是否弃置其他角色一张牌',function(card,player,target){
            return player!=target&&target.countCards('he')>0;}).set('ai',function(target){
            return -get.attitude(_status.event.player,target);
        });
       'step 1'
       if(result.bool){
       player.logSkill('qx_huangshi');
        player.discardPlayerCard(result.targets[0],'he',false);}
    },
                group:["qx_huangshi_roundcount"],
            },
            "qx_zhendu":{
                audio:"zhendu",
                trigger:{
                    global:"phaseBegin",
                },
                filter:function (event,player){
        return event.player!=player&&player.countCards('h')>0;
    },
                direct:true,
                content:function (){
        "step 0"
        var nono=(Math.abs(get.attitude(player,trigger.player))<3);
        if(get.damageEffect(trigger.player,player,player)<=0){
            nono=true
        }
        else if(trigger.player.hp>2){
            nono=true;
        }
        else if(trigger.player.hp>1&&player.countCards('h')<3){
            nono=true;
        }
        else if(trigger.player.canUse('sha',player)&&!player.countCards('h','shan')&&trigger.player.countCards('h')>=3){
            nono=true;
        }
        var next=player.chooseToDiscard(get.prompt('qx_zhendu',trigger.player));
        next.set('ai',function(card){
            if(_status.event.nono) return -1;
            return 7-get.useful(card);
        });
        next.set('logSkill',['qx_zhendu',trigger.player]);
        next.set('nono',nono);
        "step 1"
        if(result.bool){
            trigger.player.damage();
            trigger.player.addSkill('qx_zhendu1');
        }
        else{
            event.finish();
        }
        "step 2"
        trigger.player.useCard({name:'jiu'},trigger.player);
    },
                ai:{
                    threaten:2,
                    expose:0.3,
                },
            },
            "qx_zhendu1":{
                trigger:{
                    player:"phaseEnd",
                },
                mark:true,
                filter:function (event,player){
        return  true;
    },
                content:function (){
        if( player.countUsed('sha')==0){player.loseHp();}
        player.removeSkill('qx_zhendu1');
        
    },
                intro:{
                    content:"若当前回合未使用杀，则回合结束时失去一点体力",
                },
            },
            "qx_qiluan":{
                audio:"qiluan",
                trigger:{
                    global:"dieEnd",
                },
                frequent:true,
                content:function (){
        player.draw(2);
    },
            },
            "qx_xianzhen":{
                audio:"xianzhen",
                trigger:{
                    player:"shaHit",
                },
                filter:function (event,target){
        return !event.target.hasSkill('qx_xianzhen2');
    },
                check:function (event,player){
        return (get.attitude(player,event.target)<=0);
    },
                frequent:true,
                content:function (){
        'step 0'
        player.chooseToDiscard(get.prompt('qx_xianzhen'),'he',false).set('ai',function(card){
            return 7-get.value(card);
        });
        'step 1'
        if(result.bool){
            var  chat="攻无不克，战无不胜";
            player.say(chat);
            trigger.target.addSkill('qx_xianzhen2');
            player.logSkill('qx_xianzhen');
            player.addTempSkill('qx_xianzhen1')
        }
        
    },
            },
            "qx_xianzhen2":{
                mod:{
                    globalTo:function (from,to,distance){
            return distance-3;
        },
                },
                group:"fengyin",
                trigger:{
                    player:["phaseEnd","recoverBefore"],
                },
                forced:true,
                mark:true,
                intro:{
                    content:"已陷阵中",
                },
                content:function (){
        trigger.cancel();
        player.removeSkill('qx_xianzhen2');
         player.removeSkill('fengyin');
        event.finish();
    },
            },
            "qx_xianzhen1":{
                mod:{
                    targetInRange:function (card,player,target,now){
            return true;
        },
                    cardUsable:function (card,player,num){
            if(card.name=='sha') return num+Infinity;
        },
                },
                trigger:{
                    player:"shaBegin",
                },
                forced:true,
                filter:function (event,target){
        return event.target.hasSkill('fengyin');
    },
                content:function (){
        trigger.shanRequired=2;        
    },
                ai:{
                    unique:true,
                },
            },
            "qx_hanyong":{
                trigger:{
                    player:"damageEnd",
                },
                direct:true,
                content:function (){
        "step 0"
        player.chooseTarget(get.prompt('qx_hanyong'),function(card,player,target){
            return lib.filter.targetEnabled({name:'sha'},player,target);
        }).set('ai',function(target){
            return get.effect(target,{name:'sha'},_status.event.player);
        });
        "step 1"
        if(result.bool){
            player.logSkill('qx_hanyong');
            player.useCard({name:'sha'},result.targets,false);
        }
    },
                ai:{
                    ai:{
                        "maixie_defend":true,
                        effect:{
                            target:function (card,player,target){
                if(player.hasSkillTag('jueqing',false,target)) return [1,-1];
                return 0.8;
                // if(get.tag(card,'damage')&&get.damageEffect(target,player,player)>0) return [1,0,0,-1.5];
            },
                        },
                    },
                },
            },
            "qx_shuangxiong":{
                group:"qx_shuangxiong1",
                audio:"shuangxiong1",
                trigger:{
                    player:"shaMiss",
                },
                usable:1,
                direct:true,
                content:function (){
        "step 0"
        player.chooseTarget([1,2],get.prompt('qx_shuangxiong'),function(card,player,target){
            return lib.filter.targetEnabled({name:'sha'},player,target);
        }).set('ai',function(target){
            return get.effect(target,{name:'sha'},_status.event.player);
        });
        "step 1"
        if(result.bool){
            player.logSkill('qx_shuangxiong');
            player.useCard({name:'sha'},result.targets,false);
        }
    },
                ai:{
                    threaten:function (player,target){
            return 1.3;
        },
                },
            },
            "qx_shuangxiong1":{
                trigger:{
                    player:"useCardEnd",
                },
                usable:2,
                direct:true,
                audio:"shuangxiong2",
                filter:function (event,player){          
        return event.targets.length==1&&get.type(event.card)=='trick';
    },
                position:"he",
                content:function (){
        "step 0"
        player.chooseTarget(get.prompt('qx_shuangxiong1'),function(card,player,target){
            var trigger=_status.event.getTrigger();
            return lib.filter.filterTarget(trigger.card,player,target);
        }).set('autodelay',true).set('ai',function(target){
            var trigger=_status.event.getTrigger();
            var player=_status.event.player;
            return get.effect(target,trigger.card,player,player);
        });
        "step 1"
        if(result.bool){
            player.useCard(trigger.card,result.targets,false)._triggered=null;;
            player.logSkill('qx_shuangxiong1',result.targets);
        }
        
    },
            },
            "qx_mingmen":{
                audio:"xueyi",
                trigger:{
                    source:"damageEnd",
                },
                usable:1,
                filter:function (event,player){
        return event.player.countCards('he');
    },
                check:function (event,player){
    if(get.attitude(player,event.player)>0)
        return false;
    },
                content:function (){
        player.discardPlayerCard('he',trigger.player);
    },
            },
            "qx_sanren":{
                mode:["identity"],
                trigger:{
                    global:"gameDrawAfter",
                },
                forced:true,
                filter:function (event,player){
        return game.zhu&&player.identity!='zhu'&&player.group!=game.zhu.group;
    },
                content:function (){
        player.group=game.zhu.group;
    },
            },
            "qx_beige2":{
                group:"fengyin",
                trigger:{
                    player:["damageEnd","recoverBefore"],
                },
                forced:true,
                mark:true,
                intro:{
                    content:"悲歌",
                },
                content:function (){
        if(trigger.name=="recover")trigger.cancel();
        player.removeSkill('qx_beige2');
         player.removeSkill('fengyin');
        event.finish();
    },
            },
            "qx_beige1":{
                audio:"beige",
                trigger:{
                    player:"damageEnd",
                },
                priority:3,
                check:function (event,player){
      return  get.attitude(player,event.source)<0;
    },
                filter:function (event,player){
        return !event.source.hasSkill('qx_beige2');
    },
                content:function (){
        trigger.source.addSkill('qx_beige2');
    },
                ai:{
                    "maixie_defend":true,
                    effect:{
                        target:function (card,player,target){
                if(player.hasSkillTag('jueqing',false,target)) return [1,-1];
                return 0.8;
                // if(get.tag(card,'damage')&&get.damageEffect(target,player,player)>0) return [1,0,0,-1.5];
            },
                    },
                },
            },
            "qx_kusi":{
                group:["qx_kusi_turn","qx_kusi_damage"],
                audio:"duanchang",
                trigger:{
                    player:"phaseEnd",
                },
                frequent:true,
                content:function (){
        player.logSkill('qx_kusi'),
        player.turnOver();
        player.draw(2);
    },
                subSkill:{
                    turn:{
                        trigger:{
                            player:["turnOverAfter"],
                        },
                        filter:function (event,player){        
        return !player.isTurnedOver();
            },
                        frequent:true,
                        content:function (){
               'step 0'
        player.chooseTarget('是否令一名角色回复一点体力？',function(card,player,target){
            return target.hp<target.maxHp;}).set('ai',function(target){
            if(player.hp==1) return target==player;
            return  get.attitude(_status.event.player,target);
        });
       'step 1'
       if(result.bool){       
           player.line(result.targets[0]);
        result.targets[0].recover();}
                else player.draw();
   
    },
                        sub:true,
                    },
                    damage:{
                        audio:"duanchang",
                        trigger:{
                            global:"damageEnd",
                        },
                        filter:function (event,player){
        if(!player.isTurnedOver()) return false;
        if(event.card&&(event.card.name=='sha'||event.card.name=='juedou'))
        return (event.source&&player.countCards('he'));
    },
                        direct:true,
                        checkx:function (event,player){
                if(event.source.isTurnedOver()) return false;
          return get.attitude(player,event.source)<0;
    },
                        content:function (){
        "step 0"
        var next=player.chooseToDiscard('he',get.prompt('qx_kusi_damage'));
        var check=lib.skill.qx_kusi_damage.checkx(trigger,player);
        next.set('ai',function(card){
            if(_status.event.goon) return 8-get.value(card);
            return 0;
        });
        next.set('logSkill','qx_kusi_damage');
                next.set('goon',check);
        "step 1"
        if(result.bool){
            player.logSkill('qx_kusi')
            trigger.source.judge();
        }
        else{
            event.finish();
        }
        "step 2"
        switch(get.color(result.card)){
            case 'red':{trigger.source.loseHp();
                       if(trigger.source.hasSkill('qx_beige2'))
                       {trigger.source.loseHp();trigger.source.removeSkill('qx_beige2');
                       } };break;
            case 'black':trigger.source.turnOver();break;
            
        }
    },
                        ai:{
                            expose:0.3,
                        },
                        sub:true,
                    },
                },
            },
            "qx_guihan":{
                trigger:{
                    player:"dieBefore",
                },
                frequent:true,
                content:function (){
       'step 0'
        player.chooseTarget(get.prompt('qx_guihan'),function(card,player,target){
            return player!=target;}).set('ai',function(target){
            return get.attitude(_status.event.player,target);
        });
       'step 1'
       if(result.bool){
           result.targets[0].draw(4);
           result.targets[0].gainMaxHp(); 
       result.targets[0].recover();}
  
    },
            },
            "qx_xiaoji1":{
                group:"qx_xiaoji1_hua",
                audio:"xiaoji",
                trigger:{
                    target:"shaBegin",
                },
                filter:function (event,player){
        return event.card.name=='sha'&&player.hasSha();
    },
                frequent:true,
                content:function (){
        'step 0'
        player.chooseToUse({name:'sha'},trigger.player,'枭姬：是否对来源使用一张杀？').logSkill='qx_xiaoji';
        'step 1'
        if(result.bool)
        trigger.cancel();
    },
                subSkill:{
                    hua:{
                        init:function (player){
        player.storage.qx_xiaoji1_hua=0;
            },
                        mark:true,
                        marktext:"花",
                        intro:{
                            content:"拥有#枚花",
                        },
                        sub:true,
                        trigger:{
                            player:"useCardAfter",
                        },
                        forced:true,
                        filter:function (event,player){
                return event.card.name=='sha';
            },
                        content:function (){                
         player.storage.qx_xiaoji1_hua++;
                player.markSkill('qx_xiaoji1_hua');
    },
                    },
                },
            },
            "qx_xiaoji2":{
                group:"qx_xiaoji2_sha",
                audio:"xiaoji",
                mod:{
                    targetInRange:function (card,player,target){
            if(card.name=='sha')  return true;
        },
                },
                trigger:{
                    player:"shaHit",
                },
                usable:2,
                frequent:true,
                content:function (){
        "step 0"         
        if(!player.hasSkill('qx_xiaoji2_yu'))
        player.addSkill('qx_xiaoji2_yu');
        if(!trigger.target.hasSkill('qx_xiaoji2_yu'))
        trigger.target.addSkill('qx_xiaoji2_yu');
        player.chooseTarget(get.prompt('qx_xiaoji2'),function(card,player,target){
            return target!=trigger.target&&lib.filter.targetEnabled({name:'sha'},player,target);
        }).set('ai',function(target){
            return get.effect(target,{name:'sha'},_status.event.player);
        });
        "step 1"
        if(result.bool){
            player.logSkill('qx_xiaoji2');
            player.useCard({name:'sha'},result.targets,false);
        }
    },
                ai:{
                    threaten:function (player,target){
            return 1.3;
        },
                },
                subSkill:{
                    yu:{
                        alter:true,
                        mark:true,
                        marktext:"雨",
                        intro:{
                            content:"雨",
                        },
                        sub:true,
                    },
                    sha:{
                        audio:"xiaoji",
                        trigger:{
                            player:"shaBegin",
                        },
                        usable:1,
                        content:function (){
        'step 0'
        player.chooseToDiscard().set('ai',function(card){
                return 8-get.value(card)});
        'step 1'
        if(result.bool){
            trigger.directHit=true;
        }
    },
                        sub:true,
                    },
                },
            },
            "qx_lihua":{
                group:"qx_lihua_hua",
                mod:{
                    maxHandcard:function (player,num){
            if(player.hp<player.maxHp) return num+player.maxHp-player.hp;
        },
                },
                trigger:{
                    player:"turnOverBegin",
                },
                forced:true,
                content:function (){
        trigger.cancel();
        var i=player.hp;
        player.uninit;
        player.init('qx_yuan');
        player.hp=i;
        player.update();
    },
                ai:{
                    noturn:true,
                    effect:{
                        target:function (card,player,target,current){ 
                if(get.tag(card,'turnOver')) return [0,0]; 
            },
                    },
                },
                subSkill:{
                    hua:{
                        enable:"phaseUse",
                        filter:function (event,player){
        if(player.hp>=player.maxHp) return false;
        return player.storage.qx_xiaoji1_hua>0;
    },
                        content:function (){
                'step 0'
        player.recover();
                player.turnOver();
               player.chooseTarget([1,player.storage.qx_xiaoji1_hua]).set('ai',function(target){
            return  get.attitude(_status.event.player,target);
        });
               'step 1'
               if(result.bool){
                   for(var i=0;i<result.targets.length;i++)
                      result.targets[i].draw(); 
               }
        
    },
                        ai:{
                            order:9,
                            maixie:true,
                            effect:{
                                target:function (card,player,target){
                if(get.tag(card,'damage')){
                    if(!target.hasFriend()) return;
                    if(target.hp>=4) return [0,1];
                }
                if(get.tag(card,'recover')&&player.hp>=player.maxHp-1) return [0,0];
            },
                            },
                            result:{
                                player:1,
                            },
                            threaten:1.3,
                        },
                        sub:true,
                    },
                },
            },
            "qx_baoyu":{
                group:"qx_baoyu_yu",
                mod:{
                    maxHandcard:function (player,num){
            if(player.hp<player.maxHp) return num+player.maxHp-player.hp;
        },
                },
                trigger:{
                    player:"turnOverBegin",
                },
                forced:true,
                content:function (){
        trigger.cancel();
        var i=player.hp;
        player.uninit;
        player.init('qx_jin');
        player.hp=i;
        player.update();
    },
                ai:{
                    noturn:true,
                    effect:{
                        target:function (card,player,target,current){ 
                if(get.tag(card,'turnOver')) return [0,0]; 
            },
                    },
                },
                subSkill:{
                    yu:{
                        enable:"phaseUse",
                        filter:function (event,player){
        return player.hasSkill('qx_xiaoji2_yu');
    },
                        content:function (){
                player.turnOver();
               game.countPlayer(function(current){      
                   if(current.hasSkill('qx_xiaoji2_yu')){
            if(current!=player&&!current.countCards('he')){
               current.damage();
            }
             if(current!=player&&current.countCards('he'))
                 player.discardPlayerCard(current,'he'); 
                current.removeSkill('qx_xiaoji2_yu');   }         
        });                
        
    },
                        ai:{
                            order:9,
                            result:{
                                player:1,
                            },
                            threaten:1.3,
                        },
                        sub:true,
                    },
                },
            },
            "qx_zaiqi":{
                trigger:{
                    player:"dying",
                },
                audio:"zaiqi",
                frequent:true,
                priority:9,
                filter:function (event,player){
        return player.countCards('h');
    },
                content:function (){
        var i=player.countCards('h');
        player.chooseToDiscard(i,true);
        player.recover(2*i);        
    },
                ai:{
                    threaten:2,
                    effect:{
                        target:function (card,player,target){
                if(get.tag(card,'damage')&&target.hp==1&&target.countCards('h')){
                    return [1,4];
                }
            },
                    },
                },
            },
            "qx_manwang":{
                group:"qx_manwang_1",
                audio:"huoshou",
                trigger:{
                    player:"recoverAfter",
                },
                filter:function (event,player){
        return event.num>1;
    },
                content:function (){
        var list=game.filterPlayer(function(current){
                    return player.canUse('nanman',current);
                });
                list.sortBySeat();
                player.useCard({name:'nanman'},list);
    },
                ai:{
                    result:{
                        target:function (player,target){
                if(player.hasUnknown(2)&&get.mode()!='guozhan') return 0;
                var nh=target.countCards('h');
                if(get.mode()=='identity'){
                    if(target.isZhu&&nh<=2&&target.hp<=1) return -100;
                }
                if(nh==0) return -2;
                if(nh==1) return -1.7
                return -1.5;
            },
                    },
                },
                subSkill:{
                    "1":{
                        trigger:{
                            source:"damageEnd",
                        },
                        frequent:true,
                        filter:function (event,player){
            return event.card.name=='nanman'&&event.player.countCards('h');
            },
                        check:function (event,player){
        return get.attitude(player,event.player)<0;
    },
                        content:function (){
        player.discardPlayerCard(trigger.player);
    },
                        sub:true,
                    },
                },
            },
            "qx_keji":{
                audio:"keji",
                mod:{
                    maxHandcard:function (player,num){
            return num+player.storage.qx_keji;
        },
                    cardUsable:function (card,player,num){
            if(player.storage.qx_keji>2&&card.name=='sha') return num+1;
        },
                },
                init:function (player){
        player.storage.qx_keji=0;
    },
                intro:{
                    content:"#克",
                },
                trigger:{
                    player:"damageEnd",
                },
                mark:true,
                forced:true,
                filter:function (event,player){
          return  player.storage.qx_keji<8;
       },
                content:function (){
        player.storage.qx_keji++;
        player.markSkill('qx_keji');
    },
                ai:{
                    threaten:2.3,
                },
                group:["qx_keji_Begin","qx_keji_8"],
                subSkill:{
                    "8":{
                        trigger:{
                            player:"shaBegin",
                        },
                        frequent:true,
                        filter:function (event,player){
              return  player.storage.qx_keji>5;
           },
                        content:function (){
        if(!trigger.target.hasSkill('fengyin')){
            trigger.target.addTempSkill('fengyin',{player:'phaseBegin'});
        }
            },
                        sub:true,
                    },
                    Begin:{
                        trigger:{
                            player:"phaseDrawBegin",
                        },
                        filter:function (event,player){
              return  player.storage.qx_keji>1;
           },
                        forced:true,
                        content:function (){
        trigger.num++;
    },
                        sub:true,
                    },
                },
            },
            "qx_gongxin":{
                audio:"gongxin",
                enable:"phaseUse",
                usable:1,
                filter:function (event,player){
        return player.countCards('h')>0;
    },
                filterTarget:function (card,player,target){
        return player!=target;
    },
                check:function (card,player){
        return player.countCards('h')>1;
    },
                content:function (){
        "step 0"              
        target.chooseControl('heart2','diamond2','club2','spade2').set('ai',function(event){
            switch(Math.floor(Math.random()*6)){
                case 0:return 'heart2';
                case 1:case 4:case 5:return 'diamond2';
                case 2:return 'club2';
                case 3:return 'spade2';
            }
        }); 
        "step 1"              
        event.choice=result.control;
        player.chooseCard('h',true).set('ai',function(card){
                return 1000-get.value(card);}) 
        "step 2"
        event.card=result.cards[0];
        game.log(target,'选择了'+get.translation(event.choice));
        target.popup(event.choice); 
        player.showCards(event.card);
        game.delay();
        "step 3"
        if(get.suit(event.card)+'2'!=event.choice) {                     
             target.showHandcards();
            game.delay();
        target.gain(event.card,player);
             player.$give(event.card,target);
        target.loseHp();}
        else  target.addTempSkill('qx_gongxin_sha',{player:'phaseEnd'});
    },
                ai:{
                    jueqing:true,
                    threaten:2.9,
                    order:8.5,
                    result:{
                        target:function (player,target){                    
                return get.damageEffect(target,player);           
        },
                    },
                },
                subSkill:{
                    sha:{
                        mark:true,
                        intro:{
                            content:"无法对其他角色出杀",
                        },
                        mod:{
                            playerEnabled:function (card,player,target){
                if(card.name=='sha') return false;
            
        },
                        },
                        sub:true,
                    },
                },
            },
            "qx_qinxue":{
                skillAnimation:true,
                audio:"qinxue",
                unique:true,
                derivation:"qx_gongxin",
                trigger:{
                    player:"phaseBegin",
                },
                forced:true,
                filter:function (event,player){
     return    player.storage.qx_keji>2;
    },
                content:function (){        
        player.loseMaxHp();
        player.addSkill('qx_gongxin');
        player.awakenSkill('qx_qinxue');
    },
            },
            "qx_weimu":{
                audio:"weimu",
                trigger:{
                    source:"damageBefore",
                },
                group:["qx_weimu1","qx_weimu1_an"],
                forced:true,
                content:function (){
        'step 0'
        player.chooseTarget('请选择伤害来源',function(event,player,target){
            if(!target.hasSkill('qx_luanwu2'))
                return player!=target&&trigger.player!=target;}).set('ai',function(target){
            return 10-get.attitude(_status.event.player,target);
        });
       'step 1'
       if(result.bool){
        trigger.source=result.targets[0];
       player.line(result.targets[0]);
       result.targets[0].line(trigger.player);}
        else player.loseHp();
    },
                ai:{
                    threaten:1.3,
                    jueqing:true,
                },
            },
            "qx_wansha":{
                audio:"wansha",
                trigger:{
                    global:"dying",
                },
                check:function (event,player){
        return get.attitude(player,event.player)<0;
    },
                filter:function (event,player){
        return player.countCards('he');
    },
                direct:true,
                priority:null,
                content:function (){
        'step 0'
        player.chooseToDiscard(get.prompt('qx_wansha'),'he').set('ai',function(card){
             if(get.attitude(player,trigger.player)>0)  return false;
            return 15-get.value(card);});
        'step 1'
        if(result.bool)
           {   player.logSkill('qx_wansha',trigger.player);
               trigger.player.die();}
    },
                ai:{
                    threaten:2.5,
                },
            },
            "qx_baonue":{
                audio:"baonue",
                trigger:{
                    global:"damageEnd",
                },
                filter:function (event,player){
        return _status.currentPhase==player&&player.hp<player.maxHp;
    },
                frequent:true,
                content:function (){
        "step 0"
        player.judge(function(card){
            if(get.suit(card)=='spade') return 2;
            return -2;
        })
        "step 1"
        if(result.judge<2){
            event.finish;
        }
       if(result.judge==2){
           player.recover();
       }
       
    },
            },
            "qx_weimu1":{
                trigger:{
                    player:"useCard",
                },
                filter:function (event,player){
        if(!player.countCards('he')) return false;
       return event.player&&!event.targets.contains(player)&&event.card.name!='wuxie';
    },
                check:function (event){
        return event.card.name=='juedou';
    },
                content:function (){
        "step 0"
        player.chooseToDiscard('he').set('ai',function(card){
            return 7-get.value(card);});
        "step 1"
        if(result.bool){
        player.chooseTarget('请选择此牌使用者',function(card,player,target){
            return player!=target;
        }).set('ai',function(target){
            return 0.1-get.attitude(_status.event.player,target);
        }); }
        
        else  event.finish();
        "step 2"
        if(result.targets[0]){
            player.logSkill('qx_weimu',result.targets[0]);
            player.line(result.targets[0]);
            trigger.untrigger();
            trigger.player=result.targets[0];
            trigger.trigger('useCard'); 
        }        
    },
                subSkill:{
                    an:{
                        audio:"weimu",
                        filter:function (event,player){
                if(!player.countCards('he',{color:'black'}))return false;
        return event.player!=player&&event.targets&&event.targets.length<=1;
    },
                        trigger:{
                            target:"useCardToBefore",
                        },
                        check:function (event,player){
        return get.attitude(player,event.player)<=0;
    },
                        content:function (){      
          "step 0"
        player.chooseToDiscard('he',function(card){
           return get.color(card)=='black'; 
        }).set('ai',function(card){
            return 15-get.value(card);});
        "step 1"
        if(result.bool){
        player.chooseTarget('请选择此牌目标',function(card,player,target){
            return player!=target&&lib.filter.targetEnabled(trigger.card,player,target);;
        }).set('ai',function(target){
            return 0.1-get.attitude(_status.event.player,target);
        }); }
        else  event.finish();
        "step 2"
        if(result.targets[0]){            
            player.line(result.targets[0]);
            trigger.untrigger();
            trigger.target=result.targets[0];
            trigger.trigger('useCard'); 
        }
    },
                        ai:{
                            threaten:0.7,
                        },
                        sub:true,
                    },
                },
            },
            "qx_luanwu2":{
                mark:true,
                intro:{
                    content:"回合结束时流失一点体力，对其他角色造成伤害后可以转移此标记",
                },
                trigger:{
                    player:"phaseEnd",
                },
                forced:true,
                content:function (){
        player.loseHp();
    },
                group:"qx_luanwu2_luan",
                subSkill:{
                    luan:{
                        trigger:{
                            source:"damageBefore",
                        },
                        forced:true,
                        filter:function (event,player){
                return !event.player.hasSkill('qx_luanwu0');
            },
                        priority:10,
                        content:function (){
        player.removeSkill('qx_luanwu2');
        trigger.player.addSkill('qx_luanwu2');
    },
                        sub:true,
                    },
                },
            },
            "qx_luanwu1":{
                audio:"luanwu",
                enable:"phaseUse",
                skillAnimation:"epic",
                animationColor:"thunder",
                unique:true,
                mark:true,
                marktext:"武",
                filterTarget:function (card,player,target){
        return target!=player;
    },
                intro:{
                    content:"可发动",
                },
                content:function (){
        target.addSkill('qx_luanwu2');
        player.removeSkill('qx_luanwu1');
    },
                ai:{
                    order:9,
                    result:{
                        target:function (player,target){     
                if(target.hp<3)
             return get.damageEffect(target,player);
              
            },
                    },
                },
            },
            "qx_luanwu0":{
                trigger:{
                    global:"dieBefore",
                },
                forced:true,
                filter:function (event,player){
        return event.player.hasSkill('qx_luanwu2');
    },
                content:function (){
        trigger.player.removeSkill('qx_luanwu2');
        player.addSkill('qx_luanwu1');
    },
            },
            "qx_sixing":{
                mark:true,
                marktext:"🌟",
                intro:{
                    content:"🌟",
                },
                init:function (player){
        player.storage.qx_sixing=4;
    },
                ai:{
                    threaten:3,
                },
            },
            "qx_jiuchi":{
                audio:"jiuchi",
                trigger:{
                    source:"damageBefore",
                },
                forced:true,
                filter:function (event,player){
        return event.card&&event.card.name=='sha'&&get.suit(event.card)=='spade';
    },
                content:function (){
        trigger.num++;
    },
            },
            "qx_hengzheng":{
                audio:"hengzheng",
                trigger:{
                    player:"loseHpEnd",
                },
                direct:true,
                content:function (){
        'step 0'
        player.chooseTarget('是否获得其他角色的牌',[1,trigger.num],function(card,player,target){
            return player!=target&&target.countCards('hej')>0;}).set('ai',function(target){
            if(target.countCards('j')) return 30*get.attitude(_status.event.player,target);
            return 0.5-get.attitude(_status.event.player,target);
        });
       'step 1'
       if(result.bool){
       player.logSkill('qx_hengzheng');
           for(var i=0;i<result.targets.length;i++)
        player.gainPlayerCard(result.targets[i],'hej',false);}
    },
            },
            "qx_daoxing":{
                init:function (player){
        player.storage.qx_daoxing=0;
    },
                intro:{
                    content:"拥有#枚",
                },
                audio:"ext:群雄并起:1",
                trigger:{
                    player:"phaseBegin",
                },
                mark:true,
                forced:true,
                content:function (){
        "step 0"
        player.gainMaxHp(4);
        if(!player.hasSkill('qx_daoxing_die'))player.addSkill('qx_daoxing_die');
        player.judge(function(card){
            if(get.suit(card)=='spade') return 4;
           if(get.suit(card)=='club') return 3;
            if(get.suit(card)=='diamond') return 2;
            if(get.suit(card)=='heart') return 1;
        })
        "step 1"
        var i=result.judge;
        player.recover(i);
        player.storage.qx_daoxing=i+player.storage.qx_daoxing;
    },
                ai:{
                    threaten:3,
                },
                group:"qx_daoxing_damage",
                subSkill:{
                    damage:{
                        trigger:{
                            player:"damageEnd",
                        },
                        forced:true,
                        filter:function (event,player){
                return player.storage.qx_daoxing>0;
            },
                        content:function (){
        if(player.storage.qx_daoxing>=trigger.num)
            player.storage.qx_daoxing=player.storage.qx_daoxing-trigger.num;
        else player.storage.qx_daoxing=0;
        player.markSkill('qx_daoxing');
    },
                        sub:true,
                    },
                    die:{
                        sub:true,
                    },
                },
            },
            "qx_nishi":{
                mod:{
                    maxHandcard:function (player,num){
            return num-(player.storage.qx_daoxing+1);
        },
                },
                audio:"ext:群雄并起:1",
                trigger:{
                    player:"phaseBeginStart",
                },
                filter:function (event,player){
        return player.hasSkill('qx_daoxing_die');
    },
                forced:true,
                content:function (){
       if(player.storage.qx_daoxing>0) 
           player.loseHp(player.storage.qx_daoxing);
        player.loseMaxHp(4);
        player.storage.qx_daoxing=0;
        player.markSkill('qx_daoxing');        
    },
            },
            "qx_shanquan":{
                audio:"boss_baolin",
                trigger:{
                    global:"damageEnd",
                },
                filter:function (event,player){
        return event.source!=undefined&&event.source.group=='qun'&&event.source!=player&&player.identity=='zhu';
    },
                check:function (event,player){
        return get.attitude(player,event.source)>0;
    },
                content:function (){
          trigger.source.draw();
    },
            },
            "qx_duorui":{
                mod:{
                    targetInRange:function (card,player,target,now){
            if(target.hasSkill('qx_duorui_rui'))  return true;
        },
                },
                audio:"ext:群雄并起:2",
                trigger:{
                    player:"phaseBegin",
                },
                direct:true,
                content:function (){
        "step 0"
        player.chooseTarget('是否发动【夺锐】？',function(card,player,target){
            return target!=player;
        }).set('ai',function(target){
            return 0.5-get.attitude(_status.event.player,target);
        });
        "step 1"
        if(result.bool){
            player.logSkill('qx_duorui',result.targets[0]);
            player.line(result.targets[0]);
            if(!result.targets[0].countCards('h'))result.targets[0].damage();
            else 
            {  event.card=result.targets[0].getCards('h').randomGet();
                player.showCards(event.card);       
             event.target=result.targets[0];
            }            
        }
        else event.finish();
        "step 2"
        if(event.card){
            if(get.suit(event.card)=='spade'||event.card.name=='shan')  
                {player.storage.qx_tuxi++;
                player.markSkill('qx_tuxi');}
           else{event.target.addTempSkill('qx_duorui_rui');
            player.chooseCardButton(event.target,event.target.getCards('h'),true).set('filterButton',function(button){
            return true;
        },'ai',function(button){
            return get.value(button.link);});            
               } }
        "step 3"
        if(result.links[0])player.gain(result.links[0]);
    },
                ai:{
                    threaten:function (player,target){
            return 1.6;
        },
                },
                subSkill:{
                    rui:{
                        alter:true,
                        mark:true,
                        marktext:"锐",
                        intro:{
                            content:"锐",
                        },
                        sub:true,
                    },
                },
            },
            "qx_tuxi":{
                trigger:{
                    source:"damageEnd",
                },
                mark:true,
                marktext:"袭",
                forced:true,
                content:function (){
        player.storage.qx_tuxi++;
    },
                init:function (player){
        player.storage.qx_tuxi=0;
    },
                intro:{
                    content:"剩余#枚",
                },
                group:["qx_tuxi_ew","qx_tuxi_xi"],
                subSkill:{
                    ew:{
                        audio:"retuxi",
                        trigger:{
                            global:"phaseEnd",
                        },
                        round:1,
                        check:function (event,player){
        var att=get.attitude(player,event.player);
        return !game.hasPlayer(function(current){
            return get.attitude(player,current)<att;
        });
    },
                        filter:function (event,player){
        return player.storage.qx_tuxi>0&&event.player!=player;
    },
                        content:function (){
        player.storage.qx_tuxi=0;
                trigger.player.addTempSkill('qx_duorui_rui',{player:'phaseBegin'});
        player.insertPhase();
    },
                        ai:{
                            threaten:1.6,
                        },
                        sub:true,
                        group:["qx_tuxi_ew_roundcount"],
                    },
                    xi:{
                        trigger:{
                            player:"phaseBeginStart",
                        },
                        forced:true,
                        filter:function (event,player){
        return player.storage.qx_tuxi>0;
    },
                        content:function (){
        player.storage.qx_tuxi=0;        
    },
                        sub:true,
                    },
                },
            },
            "qx_fanjian":{
                audio:"fanjian",
                enable:"phaseUse",
                usable:1,
                filterTarget:function (card,player,target){
        return player!=target&&target.countCards('h');
    },
                content:function (){
        "step 0"              
         player.chooseControl('heart2','diamond2','club2','spade2').set('ai',function(event){
            switch(Math.floor(Math.random()*6)){
                case 0:return 'diamond2';
                case 1:case 4:case 5:return 'heart2';
                case 2:return 'club2';
                case 3:return 'spade2';
            }
        });
        "step 1"              
        event.choice=result.control;
        game.log(player,'选择了'+get.translation(event.choice));
       player.popup(event.choice); 
         target.chooseCard('h',true).set('ai',function(card){
             if(get.suit(card)+'2'==event.choice)  return Infinity;
              else   return 100-get.value(card);}) 
        "step 2"
        event.card=result.cards[0];        
       target.showCards(event.card);
        game.delay();
        "step 3"
        if(get.suit(event.card)+'2'!=event.choice) {                     
             target.loseHp()
        }
        else  {player.viewHandcards(target);            
        player.gain(event.card,target);
         target.$give(event.card,player);}
    },
                ai:{
                    jueqing:true,
                    threaten:function (player,target){
            return 2.3;
        },
                    order:8.5,
                    result:{
                        target:function (player,target){                    
                return get.damageEffect(target,player);           
        },
                    },
                },
            },
            "qx_qinyin":{
                init:function (player){
        player.storage.qx_qinyin=false;
    },
                audio:"qinyin1",
                trigger:{
                    global:"judge",
                },
                filter:function (event,player){
        if(player.countCards('he')&&player.storage.qx_qinyin==false)
        return event.player.storage.qx_yingzi1==true;
    },
                direct:true,
                priority:-1,
                content:function (){
        'step 0'
        player.chooseCard('he').set('ai',function(card,player,target){
         if(get.attitude(_status.event.player,trigger.player)>0)
            return   get.color(card)=='red';    
            else  return get.color(card)=='black';  
        });
        'step 1'
        if(result.bool){ 
            if(get.color(result.cards[0])=='red')
                player.logSkill('qx_qinyin');
              else player.logSkill('qx_qinyin_red');
            player.storage.qx_qinyin=true;
            player.showCards(result.cards[0]);
            trigger.player.judging[0]=result.cards[0];          }
        'step 2'
        player.storage.qx_qinyin=false;
    },
                subSkill:{
                    red:{
                        audio:"qinyin2",
                        trigger:{
                            global:"judge",
                        },
                        filter:function (event,player){
        if(player.countCards('he')&&player.storage.qx_qinyin==false)
        return event.player.storage.qx_yingzi1==true&&get.color(event.player.judging[0])=='red';
    },
                        check:function (event,player){
        return get.attitude(player,event.player)<0;
    },
                        content:function (){
        'step 0'
        player.chooseCard('he').set('ai',function(card){
         return   get.color(card)=='black';                    
        });
        'step 1'
        if(result.bool){ 
            player.storage.qx_qinyin=true;
            player.showCards(result.cards[0]);            
            trigger.player.judging[0]=result.cards[0];
         }
                'step 2'
                player.storage.qx_qinyin=false;
    },
                        sub:true,
                    },
                },
            },
            "qx_qinyin0":{
                group:["qx_qinyin0_qin","qx_qinyin0_d","qx_qinyin0_s","qx_qinyin0_h","qx_qinyin0_c","qx_qinyin"],
                trigger:{
                    player:["useCardAfter","respondAfter"],
                },
                filter:function (event,player){
        return event.cards.length==1;
    },
                forced:true,
                popup:false,
                content:function (){
        if(get.suit(trigger.cards)=='spade')
           {player.storage.qx_qinyin0_s++;player.markSkill('qx_qinyin0_s');}
        if(get.suit(trigger.cards)=='diamond')
        {player.storage.qx_qinyin0_d++;player.markSkill('qx_qinyin0_d');}
        if(get.suit(trigger.cards)=='heart')
        {player.storage.qx_qinyin0_h++;player.markSkill('qx_qinyin0_h');}
        if(get.suit(trigger.cards)=='club')
        {player.storage.qx_qinyin0_c++;player.markSkill('qx_qinyin0_c');}
    },
                subSkill:{
                    qin:{
                        trigger:{
                            player:"phaseEnd",
                        },
                        filter:function (event,player){
                if(player.storage.qx_qinyin0_h&&player.storage.qx_qinyin0_d)
                return player.storage.qx_qinyin0_c&&player.storage.qx_qinyin0_s;
            },
                        content:function (){
                'step 0'
                player.chooseControl('回复体力','弃牌').set('ai',function(){
                    if(game.countPlayer(function(current){
                        return  get.attitude(player,current)>0&&current.hp<=2;}))return '回复体力';
                    else return '弃牌';            
        });
                'step 1'
                if(result.control){
                    event.control=result.control;
                    player.chooseTarget(function(card,player,target){
                        if(event.control=='回复体力'&&target.hp>=target.maxHp)return false;
                        return true;
                    }).set('ai',function(target){
           if(event.control=='回复体力') return get.attitude(_status.event.player,target);
             else  return  0.1-get.attitude(_status.event.player,target);});
                }
                'step 2'
                if(result.bool){
                    player.storage.qx_qinyin0_h--;
                    player.storage.qx_qinyin0_d--;
                    player.storage.qx_qinyin0_c--;
                    player.storage.qx_qinyin0_s--;
                    player.markSkill('qx_qinyin0_h');
                    player.markSkill('qx_qinyin0_d');
                    player.markSkill('qx_qinyin0_c');
                    player.markSkill('qx_qinyin0_s');
                if(result.bool&&event.control=='回复体力')
                {   player.logSkill('qx_qinyin');
                    result.targets[0].recover();}
                if(result.bool&&event.control=='弃牌')
                {   player.logSkill('qx_qinyin_red');
                    if(result.targets[0].countCards('he')>1)  
                      result.targets[0].chooseToDiscard(2,'he',true);
                else result.targets[0].loseHp();}}
    },
                        sub:true,
                    },
                    c:{
                        mark:true,
                        marktext:"♣️",
                        intro:{
                            content:"已使用#张♣️牌",
                        },
                        init:function (player){
        player.storage.qx_qinyin0_c=0;
    },
                        sub:true,
                    },
                    h:{
                        mark:true,
                        marktext:"♥️",
                        intro:{
                            content:"已使用#张♥️牌",
                        },
                        init:function (player){
        player.storage.qx_qinyin0_h=0;
    },
                        sub:true,
                    },
                    s:{
                        mark:true,
                        marktext:"♠️",
                        intro:{
                            content:"已使用#张♠️牌",
                        },
                        init:function (player){
        player.storage.qx_qinyin0_s=0;
    },
                        sub:true,
                    },
                    d:{
                        mark:true,
                        marktext:"♦️",
                        intro:{
                            content:"已使用#张♦️牌",
                        },
                        init:function (player){
        player.storage.qx_qinyin0_d=0;
    },
                        sub:true,
                    },
                },
            },
            "qx_yeyan":{
                group:"qx_yeyan_kong",
                audio:"yeyan",
                trigger:{
                    player:"phaseBeginStart",
                },
                direct:true,
                skillAnimation:true,
                animationStr:"业炎",
                animationColor:"fire",
                filter:function (event,player){
        var  i=player.storage.qx_qinyin0_s;  
        var  x=player.storage.qx_qinyin0_c;  
        var  y=player.storage.qx_qinyin0_h;  
        var  z=player.storage.qx_qinyin0_d;  
        return i+x+y+z>=16;
    },
                content:function (){
        "step 0"
        player.chooseTarget('是否发动【业炎】？',[1,4],function(card,player,target){
            return lib.filter.targetEnabled({name:'sha',nature:'fire'},player,target);
        }).set('ai',function(target){
            return get.effect(target,{name:'sha',nature:'fire'},_status.event.player);
        });
        "step 1"
        if(result.bool){
            player.addTempSkill('qx_yeyan_sha',{player:'phaseBegin'});
            player.logSkill('qx_yeyan');
            player.storage.qx_qinyin0_s=0;
            player.storage.qx_qinyin0_c=0;
            player.storage.qx_qinyin0_h=0;
            player.storage.qx_qinyin0_d=0;
            player.markSkill('qx_qinyin0_h');
            player.markSkill('qx_qinyin0_d');
            player.markSkill('qx_qinyin0_c');
            player.markSkill('qx_qinyin0_s');
            for(var i=0;i<result.targets.length;i++)
            player.useCard({name:'sha',nature:'fire'},result.targets[i],false);
        }
    },
                ai:{
                    threaten:function (player,target){
            return 1.3;
        },
                },
                subSkill:{
                    kong:{
                        trigger:{
                            global:"shaBegin",
                        },
                        forced:true,
                        filter:function (event,player){
                if(event.target.hasSkill('qx_yeyan_ran'))
                return event.card.nature=='fire'||!event.card.nature;                    
            },
                        content:function (){
               if(trigger.card.nature=='fire')
               {trigger.target.storage.qx_yeyan_ran++;
               trigger.target.markSkill('qx_yeyan_ran');}
                else{if(!trigger.player.hasSkill('qx_yeyan_ran'))
                   trigger.player.addSkill('qx_yeyan_ran');
                    else trigger.player.storage.qx_yeyan_ran++;
                }
               
            },
                        sub:true,
                    },
                    sha:{
                        trigger:{
                            player:"shaHit",
                        },
                        forced:true,
                        content:function (){
               if(!trigger.target.hasSkill('qx_yeyan_ran'))
                   trigger.target.addSkill('qx_yeyan_ran');
    },
                        sub:true,
                    },
                    ran:{
                        mark:true,
                        marktext:"🔥",
                        intro:{
                            content:"拥有#枚🔥标记，其他角色对你使用火杀时，你增加一枚🔥标记，对你使用普通杀时，来源获得一枚🔥标记",
                        },
                        init:function (player){
        player.storage.qx_yeyan_ran=1;
    },
                        trigger:{
                            player:"phaseEnd",
                        },
                        forced:true,
                        content:function (){
              player.damage('fire','nosource');
                player.storage.qx_yeyan_ran--;
                if(player.storage.qx_yeyan_ran==0)player.removeSkill('qx_yeyan_ran');
    },
                        sub:true,
                        ai:{
                            effect:{
                                target:function (card,player,target){
                if(card.name=='sha'&&!card.nature)
                    return  0;                
                        if(card.name=='sha'&&card.nature=='fire')
                      return [1,-2];
                },
                            },
                        },
                    },
                },
            },
            "qx_sanxing":{
                mark:true,
                marktext:"🌟",
                intro:{
                    content:"🌟",
                },
                init:function (player){
        player.storage.qx_sanxing=3;
    },
                ai:{
                    threaten:2.5,
                },
            },
            "qx_yixing":{
                mark:true,
                marktext:"🌟",
                intro:{
                    content:"🌟",
                },
                init:function (player){
        player.storage.qx_yixing=1;
    },
            },
            "qx_erxing":{
                mark:true,
                marktext:"🌟",
                intro:{
                    content:"🌟",
                },
                init:function (player){
        player.storage.qx_erxing=2;
    },
                ai:{
                    threaten:2,
                },
            },
            "qx_fengxing":{
                audio:"ext:群雄并起:2",
                trigger:{
                    global:"shaBegin",
                },
                direct:true,
                round:1,
                filter:function (event,player){
        return _status.currentPhase!=player;
    },
                content:function (){
        "step 0"
        player.chooseTarget(get.prompt('qx_fengxing'),function(card,player,target){
            return lib.filter.targetEnabled({name:'sha'},player,target);
        }).set('ai',function(target){
            return get.effect(target,{name:'sha'},_status.event.player);
        });
        "step 1"
        if(result.bool){
            player.logSkill('qx_fengxing');
            player.useCard({name:'sha'},result.targets,false);
        }
    },
                ai:{
                    threaten:function (player,target){
            return 1.6;
        },
                },
                group:["qx_fengxing_roundcount"],
            },
            "qx_xhy_jiying":{
                audio:"ext:群雄并起:1",
                trigger:{
                    player:"shaBegin",
                },
                filter:function (event,card,player){
        return event.card.name=="sha";
    },
                priority:2,
                direct:true,
                content:function (){
        'step 0'
        player.chooseToDiscard('he',get.prompt('qx_xhy_jiying')).set('ai',function(card){ 
           return 6-get.value(card);}); 
        'step 1'
        if(result.bool){
            player.logSkill('qx_xhy_jiying');
            trigger.card.nature='thunder';
            trigger.shanRequired=2;}
       
    },
            },
            "qx_xhy_miaocai":{
                trigger:{
                    player:["damageEnd","loseHpEnd"],
                },
                unique:true,
                forced:true,
                skillAnimation:true,
                animationColor:"thunder",
                filter:function (event,player){
        return player.hp==1;
    },
                content:function (){
         'step 0'
         player.awakenSkill('qx_xhy_miaocai');
        player.loseMaxHp();
        player.recover();
        player.draw(2);
        player.addSkill('qx_xhy_leili');
        'step 1' 
           player.chooseControl().set('choiceList',[
               '额外回复一点体力，手牌上限加3',
               '手牌上限加1，失去技能风行，获得技能神速和穿云，',
            ]);
        'step 2'
        if(result.index==0){
            player.recover();
            player.addSkill('qx_xhy_miaocai_hand');           
        }else{
           player.removeSkill('qx_fengxing') ;
            player.addSkill('qx_xhy_shensu');
            player.addSkill('qx_xhy_chuanyun');
            event.finish();        }       
    },
                subSkill:{
                    hand:{
                        mod:{
                            maxHandcard:function (player,num){
            return num+3;
        },
                        },
                        sub:true,
                    },
                },
            },
            "qx_xhy_leili":{
                audio:"ext:群雄并起:2",
                trigger:{
                    player:"shaHit",
                },
                filter:function (event,card,player){
        return event.card.nature=='thunder'&&event.target.getCards('he').length>0;
    },
                frequent:true,
                content:function (){
        player.discardPlayerCard('he',trigger.target);
    },
            },
            "qx_xhy_chuanyun":{
                audio:"ext:群雄并起:1",
                trigger:{
                    target:"shaBegin",
                },
                usable:1,
                content:function (){
        player.useCard({name:"sha"},trigger.player);
    },
            },
            "qx_xhy_shensu":{
                mod:{
                    maxHandcard:function (player,num){
            return num+1;
        },
                },
                audio:"ext:群雄并起:2",
                trigger:{
                    global:"shaBegin",
                },
                priority:6,
                direct:true,
                filter:function (event,player){
        return _status.currentPhase!=player&&event.player!=player;
    },
                content:function (){
        "step 0"
        player.chooseToDiscard('he',get.prompt('qx_xhy_shensu')).set('ai',function(card){ 
           return 4.5-get.value(card);}); ;
        'step 1'
       if(result.bool){ player.chooseTarget(get.prompt('qx_xhy_shensu'),function(card,player,target){
            return lib.filter.targetEnabled({name:'sha'},player,target);
        }).set('ai',function(target){
            return get.effect(target,{name:'sha'},_status.event.player);
        });}
        "step 2"
        if(result.bool){
            player.logSkill('qx_xhy_shensu');
            player.useCard({name:'sha',nature:'thunder'},result.targets,false);
        }
    },
                ai:{
                    threaten:function (player,target){
            return 1.6;
        },
                },
            },
            "qx_tiaoxin":{
                audio:"ext:群雄并起:2",
                trigger:{
                    global:"phaseBegin",
                },
                check:function (event,player){
        var att=get.attitude(player,event.player);
        return !game.hasPlayer(function(current){
            return get.attitude(player,current)<att;
        });
    },
                filter:function (event,player){
        return event.player!=player&&event.player.countCards('he')&&!player.storage.qx_tiaoxin;
    },
                logTarget:"player",
                content:function (){        
        player.gainPlayerCard('he',trigger.player);
        player.markSkill('qx_tiaoxin');
        player.storage.qx_tiaoxin=trigger.player;
        trigger.player.addTempSkill('qx_tiaoxin_q');
        trigger.player.addTempSkill('qx_tiaoxin_d');
    },
                ai:{
                    threaten:function (player,target){
            return 1.6;
        },
                },
                intro:{
                    content:"player",
                },
                group:"qx_tiaoxin_z",
                subSkill:{
                    z:{
                        trigger:{
                            player:"phaseBegin",
                        },
                        silent:true,
                        content:function (){
                player.unmarkSkill('qx_tiaoxin');
                player.storage.qx_tiaoxin=null;
            },
                        sub:true,
                        forced:true,
                        popup:false,
                    },
                    d:{
                        trigger:{
                            source:"damageEnd",
                        },
                        forced:true,
                        filter:function (event,player){
                return  event.player.hasSkill('qx_tiaoxin');
            },
                        content:function (){
        player.removeSkill('qx_tiaoxin_d');
        player.removeSkill('qx_tiaoxin_q');
    },
                        sub:true,
                    },
                    q:{
                        mod:{
                            targetInRange:function (card,player,target,now){
            if(card.name=='sha'&&target.hasSkill('qx_tiaoxin'))  return true;
            },
                        },
                        trigger:{
                            player:"phaseEnd",
                        },
                        forced:true,
                        popup:false,
                        content:function (){
           player.showHandcards();
    },
                        sub:true,
                    },
                },
            },
            "qx_beifa":{
                audio:"ext:群雄并起:2",
                trigger:{
                    global:"dieEnd",
                },
                mark:true,
                frequent:true,
                content:function (){
        player.draw();
        player.storage.qx_beifa++;
        if(player.hp<player.maxHp)player.recover();
       else player.draw();
    },
                mod:{
                    maxHandcard:function (player,num){
            return num+player.storage.qx_beifa;
        },
                },
                init:function (player){
        player.storage.qx_beifa=0;
    },
                intro:{
                    content:"手牌上限加#",
                },
            },
            "qx_guanxing":{
                audio:"ext:群雄并起:2",
                trigger:{
                    global:"phaseBeginStart",
                },
                check:function (event,player){
        if(get.attitude(player,event.player)>0&&event.player.countCards('j'))
            return true;
        return get.attitude(player,event.player)<0;
    },
                content:function (){   
        'step 0'
       var gained=get.cards()[0];
        player.gain(gained);  
        player.chooseCard('h',true).set('ai',function(card){            
           if(trigger.player.countCards('j')){              
              var i=get.judge(trigger.player.getCards('j')[0])(card);                  
            var attitude=get.attitude(player,trigger.player);  
            if(attitude==0) return 0;
            if(attitude>0){
                return  i>=0&&100-get.value(card);              
            }
            if(attitude<0)
                return  i<0&&100-get.value(card); 
               return 10000-get.value(card);
           }       
             return 10000-get.value(card);});
        'step 1' 
       event.card=result.cards[0];           
        player.lose(event.card,ui.special);
        'step 2'
        event.card.fix();
        game.log(player,'将',event.card,'置于牌堆顶');
        ui.cardPile.insertBefore(event.card,ui.cardPile.firstChild);                                               
    },
                ai:{
                    threaten:1.6,
                    rejudge:1,
                },
            },
            "qx_jw_jizhi":{
                audio:"ext:群雄并起:2",
                trigger:{
                    player:"damageEnd",
                },
                forced:true,
                unique:true,
                skillAnimation:true,
                derivation:["qx_guanxing","qx_beifa"],
                filter:function (event,player){
        return player.hp==1;
    },
                content:function (){
        player.addSkill('qx_guanxing');
        player.addSkill('qx_beifa');
        player.recover();
        player.draw(2);
        player.awakenSkill('qx_jw_jizhi');
    },
            },
            "qx_mashu":{
                mod:{
                    targetEnabled:function (card,player,target){
               if(get.subtype(card)=='equip3'||get.subtype(card)=='equip4') return false;            
        },
                    globalFrom:function (from,to,distance){
            return distance-1;
        },
                    globalTo:function (from,to,distance){
            return distance+1;
        },
                },
            },
            "qx_mengjin":{
                audio:"jianchu",
                trigger:{
                    player:"shaBegin",
                },
                direct:true,
                usable:1,
                filter:function (event,player){
      return event.target.countCards('e');  
    },
                content:function (){
        'step 0'
        player.logSkill('qx_mengjin');
        player.gainPlayerCard('e',trigger.target);
        'step 1'
        if(result.bool){
        if(get.subtype(result.cards[0])=='equip3'||get.subtype(result.cards[0])=='equip4')
            player.equip(result.cards[0]);}
    },
                ai:{
                    threaten:1.4,
                },
                group:"qx_mengjin_damage",
                subSkill:{
                    meng:{
                        init:function (player){
        player.storage.qx_mengjin_meng=1;
    },
                        intro:{
                            content:"#",
                        },
                        mod:{
                            maxHandcard:function (player,num){
            return num-player.storage.qx_mengjin_meng;
        },
                        },
                        sub:true,
                    },
                    damage:{
                        trigger:{
                            source:"damageEnd",
                        },
                        frequent:true,
                        content:function (){   
                 if(trigger.player.hasSkill('qx_mengjin_meng')&&trigger.player.storage.qx_mengjin_meng>=2)
        player.draw();
         if(trigger.player.hasSkill('qx_mengjin_meng')&&trigger.player.storage.qx_mengjin_meng<2)
{trigger.player.storage.qx_mengjin_meng++;trigger.player.markSkill('qx_mengjin_meng');}        
                if(!trigger.player.hasSkill('qx_mengjin_meng'))
                {trigger.player.addSkill('qx_mengjin_meng');trigger.player.markSkill('qx_mengjin_meng');}
             },
                        sub:true,
                    },
                },
            },
            "qx_qun_tieji":{
                audio:"ext:群雄并起:2",
                trigger:{
                    player:"shaBegin",
                },
                check:function (event,player){
        return get.attitude(player,event.target)<=0;
    },
                logTarget:"target",
                content:function (){
        "step 0"
        player.judge(function(card){                   
                if(get.suit(card)=='heart') return 2;           
            return -0.5;
        });
        "step 1"
        if(result.bool){
            trigger.directHit=true;
        }
    },
            },
            "qx_zz_guzheng":{
                audio:"ext:群雄并起:2",
                trigger:{
                    global:"phaseEnd",
                },
                filter:function (event,player){
        return event.player.countCards('h')<event.player.hp;
    },
                check:function (event,player){
        return get.attitude(player,event.player)>0;
    },
                content:function (){
        var  i=trigger.player.hp-trigger.player.countCards('h');
        if(i>=3)i=3;
        trigger.player.draw(i);
    },
                ai:{
                    threaten:1.2,
                },
            },
            "qx_zz_anbang":{
                audio:"ext:群雄并起:2",
                enable:"phaseUse",
                usable:1,
                selectTarget:true,
                selectCard:2,
                discard:false,
                prepare:"give",
                complexCard:true,
                filterCard:function (card){
        var color=get.color(card);
        for(var i=0;i<ui.selected.cards.length;i++){
            if(get.color(ui.selected.cards[i])==color) return false;
        }
        return true;
    },
                filterTarget:function (card,player,target){
        return player!=target&&(target.hp==1||player.hp==1);
    },
                content:function (){
        target.gain(cards,player);
        if(player.hp==1)player.recover();
       else if(target.hp<target.maxHp)target.recover();
    },
                ai:{
                    order:9,
                    result:{
                        target:function (player,target){
                if(target.hp==1||player.hp==1) return 5;
                if(target.hasSkillTag('nogain')) return 0;
                if(ui.selected.cards.length&&ui.selected.cards[0].name=='du'){
                    if(target.hasSkillTag('nodu')) return 0;
                    return -10;
                }
                if(target.hasJudge('lebu')) return 0;
                return 5;
            },
                    },
                },
            },
            "qx_zz_zhijian":{
                audio:"ext:群雄并起:2",
                enable:"phaseUse",
                usable:1,
                selectTarget:true,
                filterTarget:function (card,player,target){
        return target.countCards('hej')&&target!=player;
    },
                content:function (){
        'step 0'
        player.discardPlayerCard('hej',target,true);
        'step 1'
        event.card=result.cards[0];
        target.chooseToDiscard('he',function(card,player,target){
            return get.suit(card)==get.suit(event.card);
        }).set('ai',function(card){
             if(get.attitude(player,_status.event.player)>0)  return false;
            return 7-get.value(card);});
        'step 2'
        if(result.bool){player.damage(target);event.finish();}
        else player.chooseControl('终止技能','继续发动',function(event,player){
       if(get.attitude(player,target)<=0) return '终止技能';
            else return '继续发动';
        });
        'step 3'
        if(result.control=='继续发动')
            player.chooseTarget(function(card,player,target){
            return target.countCards('e')}).set('ai',function(card){
                return get.attitude(player,target)>0;
             });
        else        event.finish();
        'step 4'
        if(result.bool)
            {player.line(result.targets[0]);
            player.choosePlayerCard('e',result.targets[0]).set('ai',function(card){
            return get.value(card)-2;});}
        else {player.draw();
            target.draw();
             event.finish();}
        'step 5'
         if(result.bool){
             player.line(target);
             target.equip(result.cards[0]);}
        else{player.draw();
            target.draw(); }
    },
                ai:{
                    order:5,
                    threaten:function (player,target){
            return 1.3;
        },
                    result:{
                        target:function (player,target){
               if(get.attitude(player,target)>0) {if(target.countCards('j')) return  7;
                                                  return  3;}
                if(get.attitude(player,target)<=0&&target.countCards('he')<4)
                    return -1;
            },
                    },
                },
            },
            "qx_zr_juxiang":{
                audio:"ext:群雄并起:2",
                trigger:{
                    global:"useCardBefore",
                },
                direct:true,
                filter:function (event,player){
        return  event.card&&event.card.name=="nanman";
    },
                content:function (){
        'step 0'
        player.chooseTarget([1,Infinity],function(card,player,target){
                return trigger.targets.contains(target);
            }).set('ai',function(target){
                var trigger=_status.event.getTrigger();
                return get.attitude(_status.event.player,target);
            });
        'step 1'
        if(result.bool){
            player.logSkill('qx_zr_juxiang');
            for(var i=0;i<result.targets.length;i++)
                {player.line(result.targets[i]);
               trigger.targets.remove(result.targets[i]); }
            game.delay();
        }
    },
                group:"qx_zr_juxiang_After",
                subSkill:{
                    After:{
                        trigger:{
                            global:"useCardAfter",
                        },
                        filter:function (event,player){
                if(event.player==player) return  false;
        return  event.card&&event.card.name=="nanman";
    },
                        content:function (){
                   var list=game.filterPlayer(function(current){
                    return player.canUse('nanman',current);
                });
                list.sortBySeat();
                player.useCard({name:'nanman'},list);
               },
                        sub:true,
                    },
                },
            },
            "qx_zr_lieren":{
                enable:"chooseToUse",
                filterCard:function (card){
        return card.name=='sha'&&get.color(card)=='red';
    },
                viewAs:{
                    name:"sha",
                    nature:"fire",
                    suit:"diamond",
                    number:9,
                    cards:[{"node":{"image":{},"info":{},"name":{},"name2":{},"background":{},"intro":{},"range":{}},"storage":{},"vanishtag":[],"_uncheck":[],"suit":"diamond","number":9,"name":"sha","cardid":"7261762325","_transform":"translateX(112px)","clone":{"name":"sha","suit":"diamond","number":9,"node":{"name":{},"info":{},"intro":{},"background":{},"image":{}},"_transitionEnded":true,"timeout":1401},"timeout":1384,"original":"h"}],
                },
                ai:{
                    order:function (){
            if(_status.event.player.hasSkillTag('presha',true,null,true)) return 10;
            return 3;
        },
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
                group:"qx_zr_lieren_compare",
                subSkill:{
                    compare:{
                        audio:"ext:群雄并起:2",
                        trigger:{
                            player:"shaBefore",
                        },
                        usable:1,
                        filter:function (event,player){
        return player.canCompare(event.target);
    },
                        check:function (event,player){
        return player.countCards('h')>1;
    },
                        content:function (){
                'step 0'
                player.chooseToCompare(trigger.target);
                'step 1'
                if(result.bool){
                    trigger.target.addTempSkill('fengyin');
                player.chooseTarget([1,2],get.prompt('qx_zr_lieren'),function(card,player,target){
            return lib.filter.targetEnabled({name:'sha'},player,target)&&target!=trigger.targets[0];
        }).set('autodelay',true).set('ai',function(target){
             return get.effect(target,{name:'sha'},_status.event.player);
        }); 
                }
                else {player.gain([result.target]);
                        player.$gain2([result.target]);
                    event.finish();}
        "step 2"
        if(result.targets){ 
            for(var i=0;i<result.targets.length;i++)
            {   player.line(result.targets[i]);
                result.targets[i].addTempSkill('fengyin');
                trigger.targets.push(result.targets[i]);}
            
        }
    },
                        sub:true,
                    },
                },
            },
            "qx_gn_fenwei":{
                audio:"ext:群雄并起:2",
                trigger:{
                    player:"useCardAfter",
                },
                filter:function (event,player){
        return get.color(event.card)=='black';
    },
                direct:true,
                content:function (){
          'step 0'
        player.chooseTarget('是否弃置其他角色一张牌',function(card,player,target){
            return player!=target&&target.countCards('hej')>0;}).set('ai',function(target){
            if(target.countCards('j')) return 30*get.attitude(_status.event.player,target);
            return -get.attitude(_status.event.player,target);
        });
       'step 1'
       if(result.bool){
       player.logSkill('qx_gn_fenwei');
           for(var i=0;i<result.targets.length;i++)
        player.discardPlayerCard(result.targets[i],'hej',false);}
    },
            },
            "qx_gn_qixi":{
                audio:"ext:群雄并起:2",
                trigger:{
                    player:"phaseDiscardBefore",
                },
                filter:function (event,player){
        return !player.hasSkill('qx_gn_qixi0');
    },
                content:function (){
        player.addTempSkill('qx_gn_qixi0',{player:'phaseEnd'});
        var evt=_status.event.getParent('phase');
        if(evt){          
            _status.event=evt;
            _status.event.finish();
            _status.event.untrigger(true);
        }
    },
            },
            "qx_gn_qixi0":{
                audio:"ext:群雄并起:2",
                mod:{
                    targetInRange:function (card,player,target,now){
            if(target.hasSkill('qx_gn_qixi0_q'))  return true;
        },
                },
                trigger:{
                    global:"phaseBeginStart",
                },
                check:function (event,player){
        var att=get.attitude(player,event.player);
        return !game.hasPlayer(function(current){
            return get.attitude(player,current)<att;
        });
    },
                filter:function (event,player){
        return event.player!=player&&!player.storage.qx_gn_qixi0;
    },
                logTarget:"player",
                content:function (){   
        'step 0'
        player.markSkill('qx_gn_qixi0');
        player.storage.qx_gn_qixi0=trigger.player;
        trigger.player.addTempSkill('fengyin',{player:'phaseUseBegin'});
        trigger.player.addTempSkill('qx_gn_qixi0_q',{player:'phaseUseBegin'});   
        player.draw(2);
        player.getStat().card={};
        player.phaseUse();
        'step 1'
        player.getStat().card={};
    },
                ai:{
                    threaten:function (player,target){
            return 1.6;
        },
                },
                intro:{
                    content:"player",
                },
                group:"qx_gn_qixi0_z",
                subSkill:{
                    z:{
                        trigger:{
                            player:"phaseBegin",
                        },
                        silent:true,
                        content:function (){
                player.unmarkSkill('qx_gn_qixi0');
                player.storage.qx_gn_qixi0=null;
            },
                        sub:true,
                        forced:true,
                        popup:false,
                    },
                    q:{
                        mark:true,
                        mod:{
                            cardEnabled:function (){
                    return false;
                },
                            cardUsable:function (){
                    return false;
                },
                            cardRespondable:function (){
                    return false;
                },
                            cardSavable:function (){
                    return false;
                },
                        },
                        intro:{
                            content:"不能使用或打出卡牌",
                        },
                        sub:true,
                    },
                },
            },
            "qx_ys_xueyi":{
                mod:{
                    maxHandcard:function (player,num){
          if(player.hasZhuSkill('qx_ys_xueyi'))
            return num+(7-2*player.storage.qx_ys_xueyi);
          else return num;
        },
                },
                zhuSkill:true,
                init:function (player){
        player.storage.qx_ys_xueyi=0;
    },
                trigger:{
                    global:"dieEnd",
                },
                forced:true,
                content:function (){
        player.storage.qx_ys_xueyi++;
    },
            },
            "qx_ys_haogui":{
                audio:"ext:群雄并起:2",
                trigger:{
                    global:"useCardAfter",
                },
                filter:function (event,player){
        if(event.player==player) return false;
        return  get.itemtype(event.cards)=='cards'&&get.position(event.cards[0])=='d'&&event.card.name=='sha';
    },
                check:function (event,player){
        return get.attitude(player,event.player)>0;
    },
                content:function (){
        player.gain(trigger.cards,'gain2');
        trigger.player.addTempSkill('qx_ys_haogui_hu',{player:'phaseBegin'});
    },
                group:"qx_ys_haogui_hu",
                subSkill:{
                    hu:{
                        mod:{
                            targetEnabled:function (card,player,target){           
                if(card.name=='wanjian') return false;           
        },
                        },
                        intro:{
                            content:"",
                        },
                        mark:true,
                        marktext:"护",
                        sub:true,
                    },
                },
            },
            "qx_ys_jianyu":{
                audio:"ext:群雄并起:2",
                group:["qx_ys_jianyu_storage","qx_ys_jianyu_use","qx_ys_jianyua","qx_ys_jianyua_a"],
                enable:"phaseUse",
                viewAs:{
                    name:"wanjian",
                    cards:[{"node":{"image":{},"info":{},"name":{},"name2":{},"background":{},"intro":{},"range":{}},"storage":{},"vanishtag":[],"_uncheck":[],"suit":"diamond","number":7,"name":"shan","cardid":"7576596318","_transform":"translateX(336px)","clone":{"name":"shan","suit":"diamond","number":7,"node":{"name":{},"info":{},"intro":{},"background":{},"image":{}},"_transitionEnded":true,"timeout":1182},"timeout":1149,"original":"h"},{"node":{"image":{},"info":{},"name":{},"name2":{},"background":{},"intro":{},"range":{}},"storage":{},"vanishtag":[],"_uncheck":[],"suit":"diamond","number":8,"name":"sha","cardid":"1600973319","_transform":"translateX(448px)","clone":{"name":"sha","suit":"diamond","number":8,"node":{"name":{},"info":{},"intro":{},"background":{},"image":{}},"_transitionEnded":true,"timeout":1183},"timeout":1150,"original":"h"}],
                },
                check:function (card){
        var player=_status.event.player;
        var targets=game.filterPlayer(function(current){
            return player.canUse('wanjian',current);
        });
        var num=0;
        for(var i=0;i<targets.length;i++){
            var eff=get.sgn(get.effect(targets[i],{name:'wanjian'},player,player));
            if(targets[i].hp==1){
                eff*=1.5;
            }
            num+=eff;
        }
        if(!player.needsToDiscard(-1)){
            if(targets.length>=7){
                if(num<2) return 0;
            }
            else if(targets.length>=5){
                if(num<1.5) return 0;
            }
        }
        return 6-get.value(card);
    },
                filter:function (event,player){
        return player.storage.qx_ys_jianyu<=player.storage.qx_ys_jianyu_storage;
    },
                filterCard:true,
                selectCard:2,
                ai:{
                    wuxie:function (target,card,player,viewer){
            if(get.attitude(viewer,target)>0&&target.countCards('h','shan')){
                if(!target.countCards('h')||target.hp==1||Math.random()<0.7) return 0;
            }
        },
                    basic:{
                        order:9,
                        useful:1,
                        value:5,
                    },
                    result:{
                        target:function (player,target){
                if(player.hasUnknown(2)&&get.mode()!='guozhan') return 0;
                var nh=target.countCards('h');
                if(get.mode()=='identity'){
                    if(target.isZhu&&nh<=2&&target.hp<=1) return -100;
                }
                if(nh==0) return -2;
                if(nh==1) return -1.7
                return -1.5;
            },
                    },
                    tag:{
                        respond:1,
                        respondShan:1,
                        damage:1,
                        multitarget:1,
                        multineg:1,
                    },
                },
                subSkill:{
                    use:{
                        trigger:{
                            player:"useCardAfter",
                        },
                        frequent:true,
                        filter:function (event,player){
                var i=player.countUsed('wanjian');
                return event.card.name=='wanjian'&&i%2==1;
            },
                        content:function (){
        player.draw();
    },
                        sub:true,
                    },
                    storage:{
                        trigger:{
                            global:"dieEnd",
                        },
                        forced:true,
                        content:function (){
        player.storage.qx_ys_jianyu_storage++;
    },
                        init:function (player){
        player.storage.qx_ys_jianyu_storage=0;
    },
                        sub:true,
                    },
                },
            },
            "qx_ys_jianyua":{
                trigger:{
                    player:"phaseBefore",
                },
                silent:true,
                content:function (){
        player.storage.qx_ys_jianyu=0;
    },
                subSkill:{
                    a:{
                        trigger:{
                            player:"useCardAfter",
                        },
                        forced:true,
                        popup:false,
                        filter:function (event,player){
                return event.skill=='qx_ys_jianyu';
            },
                        content:function (){
                player.storage.qx_ys_jianyu++;
            },
                        sub:true,
                    },
                },
                forced:true,
                popup:false,
            },
            "qx_smy_guicai":{
                audio:"ext:群雄并起:2",
                enable:"phaseUse",
                usable:1,
                content:function (){
        'step 0'
           if(ui.discardPile.childNodes.length){
                    var list=[];
                    for(var i=0;i<ui.discardPile.childNodes.length;i++)
                        list.unshift(ui.discardPile.childNodes[i]);
         player.chooseCardButton(list).set('ai',function(button){              
            return get.value(button);});    
           }
        'step 1'
        if(result.bool){
            player.gain(result.links[0],'gain2');
            game.log(player,'从弃牌堆获得了',result.links[0]);}
   },
                ai:{
                    order:1,
                    tag:{
                        rejudge:1,
                    },
                    result:{
                        player:1,
                    },
                },
                group:["qx_smy_guicai_judge","qx_smy_guicai_draw"],
                subSkill:{
                    judge:{
                        audio:"ext:群雄并起:2",
                        trigger:{
                            global:"judge",
                        },
                        direct:true,
                        filter:function (event,player){
        return ui.discardPile.childNodes.length;
    },
                        content:function (){
        "step 0"
          var list=[];
                    for(var i=0;i<ui.discardPile.childNodes.length;i++)
                        list.unshift(ui.discardPile.childNodes[i]);
         player.chooseCardButton(list,'是否更改判定牌?').set('ai',function(button){
            var trigger=_status.event.getTrigger();
            var player=_status.event.player;
            var judging=_status.event.judging;
            var result=trigger.judge(button)-trigger.judge(judging);
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
            player.respond(result.links[0],'highlight');
        }
        else{
            event.finish();
        }
        "step 2"
        if(result.bool){
            player.logSkill('qx_smy_guicai_judge');
            if(trigger.player.judging[0].clone){
                trigger.player.judging[0].clone.classList.remove('thrownhighlight');
                game.broadcast(function(card){
                    if(card.clone){
                        card.clone.classList.remove('thrownhighlight');
                    }
                },trigger.player.judging[0]);
                game.addVideo('deletenode',player,get.cardsInfo([trigger.player.judging[0].clone]));
            }
            trigger.player.judging[0].discard();
            trigger.player.judging[0]=result.links[0];
            if(!get.owner(result.links[0],'judge')){
                trigger.position.appendChild(result.links[0]);
            }
            game.log(trigger.player,'的判定牌改为',result.links[0]);
            game.delay(2);
        }
    },
                        ai:{
                            tag:{
                                rejudge:1,
                            },
                        },
                        sub:true,
                    },
                    draw:{
                        trigger:{
                            player:"phaseDrawBegin",
                        },
                        forced:true,
                        silent:true,
                        content:function (){
        trigger.num--;
    },
                        sub:true,
                        popup:false,
                    },
                },
            },
            "qx_smy_langgu":{
                audio:"ext:群雄并起:2",
                trigger:{
                    player:"recoverEnd",
                },
                direct:true,
                content:function (){
        'step 0'
        player.chooseTarget('是否对其他角色造成一点伤害',function(card,player,target){
            return player!=target;}).set('ai',function(target){
           return get.damageEffect(target,player,player)*2;
        });
       'step 1'
       if(result.bool){
           player.logSkill('qx_smy_langgu');
           player.line(result.targets[0]);
           result.targets[0].damage();}
    },
                ai:{
                    maixie:true,
                    effect:{
                        target:function (card,player,target){
                if(get.tag(card,'damage')){
                    if(!target.hasFriend()) return;
                    if(target.hp>=4) return [0,1];
                }
                if(get.tag(card,'recover')&&player.hp>=player.maxHp-1) return [0,0];
            },
                    },
                },
                group:"qx_smy_langgu_lose",
                subSkill:{
                    lose:{
                        trigger:{
                            global:"loseHpEnd",
                        },
                        direct:true,
                        content:function (){
        'step 0'
        if(trigger.player.hasSkill('qx_miaoji2'))
       {player.chooseTarget('是否获得其他角色一张牌',function(card,player,target){
            return player!=target&&target.countCards('he')>0;}).set('ai',function(target){            
            return 0.5-get.attitude(_status.event.player,target);
        });}        
       'step 1'
       if(result.bool){
           player.logSkill('qx_smy_langgu'); 
           player.line(result.targets[0]);
               player.gainPlayerCard(result.targets[0],'hej',false);}
                else    if(!trigger.player.hasSkill('qx_miaoji2')){
                    player.logSkill('qx_smy_langgu'); 
                    player.line(trigger.player);
                    player.gainPlayerCard('he',trigger.player);}    
                
    },
                        sub:true,
                    },
                },
            },
            "qx_smy_renjie":{
                audio:"ext:群雄并起:1",
                trigger:{
                    player:"damageEnd",
                },
                filter:function (event,player){
        if(player==event.source)  return false;
        for(var i=0;i<game.players.length;i++){
            if(game.players[i].isAlive()&&game.players[i].hasSkill('qx_smy_renjie_feng'))
                return false;
            }
        return (event.source!=undefined);
    },
                check:function (event,player){
        return get.attitude(player,event.source)<0;
    },
                content:function (){
        trigger.source.addSkill('qx_smy_renjie_feng');
    },
                group:"qx_smy_renjie_fa",
                subSkill:{
                    fa:{
                        audio:"ext:群雄并起:1",
                        trigger:{
                            global:"phaseBegin",
                        },
                        filter:function (event,player){
                return event.player.hasSkill('qx_smy_renjie_feng')&&event.player.countCards('h');
            },
                        content:function (){
        "step 0"    
        trigger.player.removeSkill('qx_smy_renjie_feng');
         player.chooseControl('heart2','diamond2','club2','spade2').set('ai',function(event){
            switch(Math.floor(Math.random()*6)){
                case 0:return 'diamond2';
                case 1:case 4:case 5:return 'heart2';
                case 2:return 'club2';
                case 3:return 'spade2';
            }
        });
        "step 1"              
        event.choice=result.control;
        game.log(player,'选择了'+get.translation(event.choice));
       player.popup(event.choice); 
        trigger.player.chooseCard('h',true).set('ai',function(card){
             if(get.suit(card)+'2'==event.choice)  return Infinity;
              else   return 100-get.value(card);}) 
        "step 2"
        event.card=result.cards[0];        
       trigger.player.showCards(event.card);
        game.delay();
        "step 3"
        if(get.suit(event.card)+'2'!=event.choice) {                     
             trigger.player.goMad({player:'phaseAfter'});
        }
    },
                        sub:true,
                    },
                    feng:{
                        mod:{
                            maxHandcard:function (player,num){
            return num-1;
        },
                        },
                        mark:true,
                        marktext:"戒",
                        intro:{
                            content:"",
                        },
                        trigger:{
                            player:"damageBefore",
                        },
                        forced:true,
                        content:function (){
                var  i=trigger.num;
                trigger.cancel();
                player.loseHp(i);
    },
                        sub:true,
                    },
                },
            },
        },
        translate:{
            "qx_miaoji2":"妙计",
            "qx_miaoji2_info":"势力技，当你受到伤害后，进行一次判定，若为红色，摸一张牌，否则摸两张牌；其他拥有此技能的角色受到伤害后，若其仍然存活，你可以流失一点体力，然后你对伤害来源造成一点伤害，然后受伤者摸一张牌。",
            "qx_luoshen2":"洛神",
            "qx_luoshen2_info":"",
            "qx_luoshen1":"洛神",
            "qx_luoshen1_info":"准备阶段，你可以进行一定判定，若为黑色则可以继续判定，直到出现红色。然后你获得所有黑色的判定牌。你通过洛神获得的牌，不计入当前回合的手牌上限；回合结束时，若你弃置的牌数小于3，则你可以将这些牌交给其他一名角色",
            "qx_qingguo1":"倾国",
            "qx_qingguo1_info":"锁定技，你的♦️牌均视为♣️",
            "qx_qingguo2":"倾国",
            "qx_qingguo2_info":"若你在出牌阶段没有使用[杀]，则在回合结束阶段可以摸两张牌",
            "qx_qingguo4":"倾国",
            "qx_qingguo4_info":"你每受到一次伤害，可令除你以外的任一角色补X张牌，X为你已损失的体力值，然后该角色将其武将牌翻面。",
            "qx_qingguo0":"倾国",
            "qx_qingguo0_info":"你受到伤害后，若体力值为3，则可以发动一次放逐；锁定技，回合开始或你受到伤害后，根据你的体力值情况，你获得以下子技能：小于等于3，原版本倾国；小于等于2，若当前回合未出杀，回合结束时摸两张牌；小于等于1，你的方片牌视为梅花牌",
            "qx_luoyi":"裸衣",
            "qx_luoyi_info":"你摸牌阶段的摸牌量加一；摸牌阶段时，你可以少摸一张牌，则直到你的下个回合开始，你造成的伤害加一，且造成伤害时可以获得目标的一张牌，你受到伤害时，伤害加一，然后失去此技能效果。",
            "qx_luoyi_sha":"裸衣",
            "qx_luoyi_sha_info":"",
            "qx_miaoji1":"妙计",
            "qx_miaoji1_info":"",
            "qx_xingshang":"行殇",
            "qx_xingshang_info":"当场上一名角色死亡后，你可以从每名其他角色那里获得一张牌(手牌或装备牌)，场上每有一名角色没有牌，你便摸一张牌",
            "qx_fangzhu":"放逐",
            "qx_fangzhu_info":"出牌阶段限一次，你可以交给一名角色一张黑色手牌，则直到其下个回合结束其手牌上限减1，且攻击距离减2；当被放逐的角色对任意一名角色造成了伤害时，你可以弃一张牌，令该角色取消放逐状态，翻面并摸一张牌。其他角色获得你的牌时，你可以弃置其一张牌",
            "qx_luoshui":"洛水",
            "qx_luoshui_info":"觉醒技，锁定技，回合开始时，若你的体力值为一，则你增加副将\"魏·甄姬\"并增加一点体力上限",
            "qx_songwei":"颂威",
            "qx_songwei_info":"主公技，当场上有一名魏国角色进行了判定之后，你可以弃置其一手牌或判定区里的牌，若不如此做，你摸一张牌，每轮限两次",
            "qx_qiangxi5":"强袭",
            "qx_qiangxi5_info":"限定技，出牌阶段，你可以交给一名角色两张牌，则直到你第一次进入濒死状态：你受到伤害后，其受到等量伤害；你弃牌后，该角色弃一张牌。",
            "qx_qiangxi6":"强袭",
            "qx_qiangxi6_info":"",
            "qx_feiji":"飞戟",
            "qx_feiji_info":"游戏开始时，你获得三枚戟标记，出牌阶段，你可以使用一枚戟，并弃置一张牌，对一名角色造成一点伤害，然后立刻结束你的回合；当你受到伤害或者回合结束时，若你没有戟，则你获得一枚戟，你没有戟时，杀可以多指定一名目标",
            "qx_jizhi":"集智",
            "qx_jizhi_info":"当你成为了一张牌的目标时，可以立刻摸一张牌",
            "qx_qicai":"奇才",
            "qx_qicai_info":"每当你使用锦囊牌指定了一名角色后，若你有牌，则你可以弃置一张牌，并指定一名可以成为该牌目标的角色，视为你对其使用了该牌(无中生有等使用者和目标固定为自己的牌不可用触发)",
            "qx_tongren":"同仁",
            "qx_tongren_info":"势力技，出牌阶段，你可以交给其他角色一张红色手牌，你摸一张牌，每阶段限一次；当拥有此技能的其他角色成为了杀的目标时，你可以交给其一张闪",
            "qx_paoxiao":"咆哮",
            "qx_paoxiao_info":"锁定技，你的杀可以指定任意名目标；你出杀时，可以进行一次判定，若为红色，则当前回合你可以多出一张杀",
            "qx_numu1":"怒目",
            "qx_numu1_info":"限定技，出牌阶段，你可以指定一名角色，则直到回合结束，你的所有手牌都可以当杀对该角色使用，且你的牌不能指定你与该角色以外的角色，该角色处于你的攻击范围内，你无视防具",
            "qx_numu2":"怒目",
            "qx_numu2_info":"你可以将任意一张手牌当杀使用或打出",
            "qx_numu3":"怒目",
            "qx_numu3_info":"",
            "qx_tongren2":"同仁",
            "qx_tongren2_info":"",
            "qx_qinwang":"勤王",
            "qx_qinwang_info":"锁定技，每当你一次性摸了两张或者以上的牌时，你需要弃置一张牌；当你的牌因弃置而置入弃牌堆时，你可以将其中的任意张牌交给其他角色",
            "qx_buqu":"不屈",
            "qx_buqu_info":"每当你成为其他角色的卡牌的目标时，你可以对自己和对方同时造成一点伤害，然后此牌取消",
            "qx_xuezhan":"血战",
            "qx_xuezhan_info":"锁定技，每两轮的回合结束阶段，你对自己造成一点伤害，然后你可以指定至多两名目标，这些目标各受到一点伤害；锁定技，你受到伤害后，摸三张牌，你回复体力后，若你的体力值不小于2，你流失一点体力，然后获得一点护甲。",
            "qx_zhanjue":"战绝",
            "qx_zhanjue_info":"锁定技，限定技，当你第一次进入濒死状态时，你回复五点体力，然后获得技能战绝，不屈",
            "qx_jizhao":"激诏",
            "qx_jizhao_info":"主公技，你进入濒死状态时，可以指定任意名蜀国势力目标，这些目标获得技能不屈",
            "qx_longdan2":"龙胆",
            "qx_longdan2_info":"",
            "qx_longdan1":"龙胆",
            "qx_longdan1_info":"出牌阶段，若你正面向上，你可以将自己武将牌翻面，则可视为使用桃，酒，杀中的任意一张牌；若你反面向上，需要打出闪时可以视为打出了一张闪并把自己翻回来。",
            "qx_yajiao":"涯角",
            "qx_yajiao_info":"锁定技，你正面向上时，防御距离加一；反面向上时，无视与其他角色的距离，且对其他角色造成伤害后可以进行一次判定：若为红色，你把自己翻回来，否则将敌人翻面；你翻面或者翻回来时，当前回合可以多出一张杀，并可以获得其他角色的一张牌，若如此做，该角色摸一张牌(每轮最多拿别人牌两次)",
            "qx_jiang2":"激昂",
            "qx_jiang2_info":"当你造成伤害后，可以摸一张牌；游戏开始时，若你因为主公身份而增加了体力上限，则你失去一点体力上限",
            "qx_jiang1":"激昂",
            "qx_jiang1_info":"",
            "qx_yingzi1":"英姿",
            "qx_yingzi1_info":"势力技，回合开始阶段，你进行一次判定，若为红色，则你摸一张牌，并且本回合杀与酒使用次数加一，手牌上限加一；当场上有其他拥有此技能的角色受到伤害时，你可以取消之，然后你流失一点体力",
            "qx_yingzi2":"英姿",
            "qx_yingzi2_info":"",
            "qx_yingyang1":"鹰扬",
            "qx_yingyang1_info":"",
            "qx_yingyang2":"鹰扬",
            "qx_yingyang2_info":"",
            "qx_yingyang0":"鹰扬",
            "qx_yingyang0_info":"主公技，你成为杀的目标时，可以出一张杀；出牌阶段开始时，你可以指定一名角色，该角色获得技能激扬(你出杀时，其可以出一张杀)",
            "qx_yingyang_0":"激扬",
            "qx_yingyang_0_info":"当孙策打出了一张杀时，你可以使用一张杀",
            "qx_zhiba1":"制霸",
            "qx_zhiba1_info":"你使用的普通锦囊牌不能被无懈可击响应；当你弃牌后，可以弃置其他角色一张牌；判定阶段开始时，你获得你判定区里的牌；你受到伤害后，可以弃置一张牌；你的牌被其他角色获得后，可以选择一名角色，该角色摸X张牌(X为你已损失的体力值，若你没有受伤，则该角色不摸牌)",
            "qx_zhiba2":"制霸",
            "qx_zhiba2_info":"制霸",
            "qx_tianyi":"天义",
            "qx_tianyi_info":"锁定技，你的杀需要两张闪闪避，且可以多指定一名目标，你无视防具，无视距离，若你在回合内使用了杀，则你在弃牌阶段之前需要先弃置一张手牌；你不能成为诸葛连弩的合法目标，出牌阶段，你可以弃置一张诸葛连弩，指定一名角色，该角色回复一点体力，你摸两张牌。",
            "qx_tianyi2":"天义",
            "qx_tianyi2_info":"",
            "qx_tianyi3":"天义",
            "qx_tianyi3_info":"",
            "qx_yingzi3":"英姿",
            "qx_yingzi3_info":"",
            "qx_longling":"龙灵",
            "qx_longling_info":"锁定技：当场上即将有角色受到雷电伤害时，若伤害来源不为你，你取消此伤害；然后你可以选择一名角色：若该角色有奋标记且不为满体力，其回复等同于此次伤害数量的体力值，否则摸等量的牌；若其没有奋标记，受到等量的雷电伤害；你受到雷电伤害时，先回复等量体力；受到🔥伤害时，伤害减一",
            "qx_longyin":"龙吟",
            "qx_longyin_info":"出牌阶段限一次，你可以弃一张牌，指定至多三名角色，这些角色获得奋标记；你的出牌阶段开始时，所有角色失去奋标记。",
            "qx_fen":"振奋",
            "qx_fen_info":"",
            "qx_qiyu":"祈雨",
            "qx_qiyu_info":"出牌阶段开始时，你可以选择：1场上进入下雨天气(拥有奋标记的角色获得如下技能直到回合结束：摸牌时多摸一张牌；没有奋标记的角色摸牌阶段多摸一张牌；若你于此时机拥有奋标记，则你获得以上两种效果)；2场上干旱(场上其他角色的回合开始时，若其没有奋标记，则其摸牌时少摸一张牌；拥有奋标记的角色不受影响)；3，取消天气状态",
            "qx_xiayu":"下雨",
            "qx_xiayu_info":"",
            "qx_ganhan":"干旱",
            "qx_ganhan_info":"",
            "qx_longwei":"龙威",
            "qx_longwei_info":"锁定技，当你的体力值大于四时，其他角色对你使用牌前，需要弃置一张牌；若你的体力值不大于4，其他角色对你使用牌时进行一次判定，若为红色，则此牌无效；你受到伤害前，若体力值为1，则伤害来源非锁定技失效",
            "qx_yunchong":"云从",
            "qx_yunchong_info":"你可以将杀当雷杀打出，你的雷杀无视距离；回合开始时，你可以流失一点体力，并指定一到三名角色，这些角色获得连标记直到你的回合结束(若场上为雨天，你可以额外指定两名目标)，拥有⚡️标记的角色中的任意一个受到雷电伤害时，所有拥有⚡️标记的角色受到等量雷电伤害并失去连标记",
            "qx_yunchong_lian":"云从",
            "qx_yunchong_lian_info":"",
            "qx_zhengua":"震卦",
            "qx_zhengua_info":"出牌阶段时，若没有角色在进行该技能的判定，则你可以指定至多四名角色，这些角色判定阶段之前进行一次判定，若为黑桃，则你对其造成三点雷电伤害，被指定的角色不再进行此判定",
            "qx_zhenji":"⚡️",
            "qx_zhenji_info":"",
            "qx_jiying":"疾影",
            "qx_jiying_info":"你可以将你的所有牌当闪打出；当你打出了一张闪或者造成了一次雷电伤害后，增加一枚疾标记；出牌阶段之前，你可以弃置3X枚标记(最多九枚)，对一名角色造成X点雷电伤害",
            "qx_qianxun":"谦逊",
            "qx_qianxun_info":"锁定技，你不能成为延时类锦囊牌的目标；你即将受到伤害时，可以弃置一张红色牌，则该伤害减一，若你的体力值大于该角色，则只有弃置红桃牌才可发动此效果",
            "qx_lianying":"联营",
            "qx_lianying_info":"你失去最后一张手牌时，可以横置(或取消横置)一名角色，然后可以摸一张牌，若你以此法获得的牌不为装备牌，则可以立刻使用一张牌",
            "qx_jieyan":"劫焰",
            "qx_jieyan_info":"限定技，出牌阶段，你可以弃置一张红色牌和一张黑色牌，然后对一名角色造成一点火焰伤害",
            "qx_jinjiu":"禁酒",
            "qx_jinjiu_info":"锁定技，你不能成为酒的目标，出牌阶段，你可以弃置一张酒，视为对一名角色使用一张不计入次数的雷杀，此杀结算后，你可以将酒交给一名其他角色",
            "qx_zhongyi":"忠义",
            "qx_zhongyi_info":"锁定技，若你为忠臣，当主公即将死亡时，你代替其死亡，并且其回复五点体力",
            "qx_huangshi":"皇室",
            "qx_huangshi_info":"势力技，每轮限一次，你受到伤害后，可以摸一张牌，然后弃置其他角色一张牌",
            "qx_zhendu":"鸩毒",
            "qx_zhendu_info":"其他角色的回合阶段开始时，你可以弃置一张手牌，视为该角色使用一张【酒】，然后你对其造成一点伤害，若该角色该回合未出杀，则其回合结束阶段失去一点体力",
            "qx_zhendu1":"鸩毒",
            "qx_zhendu1_info":"",
            "qx_qiluan":"戚乱",
            "qx_qiluan_info":"当场上有角色死亡时，你可以摸两张牌",
            "qx_xianzhen":"陷阵",
            "qx_xianzhen_info":"当你的杀命中目标时，可以弃一张牌，则被杀命中的目标非锁定技失效无法回复体力且防御距离减3直到其下回合结束或者回复体力；然后当前回合内，你可以出任意张杀且无视与其他角色的距离和其他角色的防具，当你对技能被封印角色出杀时，该角色需要出两张闪",
            "qx_xianzhen2":"陷阵",
            "qx_xianzhen2_info":"",
            "qx_xianzhen1":"陷阵",
            "qx_xianzhen1_info":"",
            "qx_hanyong":"悍勇",
            "qx_hanyong_info":"势力技，受到伤害后，你可以视为使用一张无视距离的杀",
            "qx_shuangxiong":"双雄",
            "qx_shuangxiong_info":"出牌阶段限一次，当你的杀被闪避后，你可以指定两名目标，视为对他们使用无视距离的杀；你使用普通锦囊牌仅指定一个目标并结算后，可以重新使用一次此牌(以此法使用锦囊牌阶段最多两次)",
            "qx_shuangxiong1":"双雄",
            "qx_shuangxiong1_info":"你使用普通锦囊牌仅指定一个目标并结算后，可以重新使用一次此牌",
            "qx_mingmen":"名门",
            "qx_mingmen_info":"势力技，每阶段限一次，你对其他角色造成伤害后，可以弃置其一张牌",
            "qx_sanren":"散人",
            "qx_sanren_info":"势力技，锁定技，身份局中，游戏开始时，你的势力调整为主公的势力",
            "qx_beige2":"悲歌",
            "qx_beige2_info":"",
            "qx_beige1":"悲歌",
            "qx_beige1_info":"你受到伤害后，可以令伤害来源非锁定技失效且无法回复体力直到其受到伤害或者回复体力。",
            "qx_kusi":"苦思",
            "qx_kusi_info":"回合结束阶段，你可以摸两张牌并将自己翻面；你翻回来时，可以令一名角色回复一点体力，若不如此做，你摸一张牌；若你反面向上，当有一名角色受到了杀或者决斗的伤害时，你可以弃置一张牌，并令伤害来源判定：黑色，武将牌翻面；红色，流失一点体力，若判定者是你悲歌的目标，则其额外流失一点体力并脱离悲歌状态",
            "qx_guihan":"归汉",
            "qx_guihan_info":"你死亡时，可以令一名角色摸四张牌，增加一点体力上限并回复一点体力。",
            "qx_xiaoji1":"枭姬",
            "qx_xiaoji1_info":"当你成为了杀的目标时，可以对来源出一张杀，若如此做，来源对你出的杀无效；每当你使用了一张杀后，你获得一枚花标记",
            "qx_xiaoji2":"枭姬",
            "qx_xiaoji2_info":"你的杀无视距离限制，你出杀时可以弃置一张手牌，则该杀直接命中(每阶段限一次)；你的杀命中了目标后，你与目标各获得一枚雨标记，并且可以指定一名其他角色，视为对该角色使用了一张杀，每轮限两次",
            "qx_lihua":"梨花",
            "qx_lihua_info":"锁定技，你的手牌上限不会因你体力值的减少而减少，你翻面时，防止翻面，武将牌替换为你的远程武将牌；出牌阶段，若你有花标记并且已受伤，可以弃置所有花标记，则你回复一点体力并翻面，然后可以指定至多X个目标(X为你弃置的花标记数)摸一张牌。",
            "qx_baoyu":"暴雨",
            "qx_baoyu_info":"锁定技，你的手牌上限为你的体力上限你翻面时，防止翻面，武将牌替换为你的近战武将牌；出牌阶段，若你有雨标记，可以弃置所有角色的雨标记，然后你翻面并可以各弃置这些角色的一张牌(这些角色里面没有牌的角色受到你的一点伤害)。",
            "qx_zaiqi":"再起",
            "qx_zaiqi_info":"你濒死时，若有手牌，可以弃置所有手牌，并回复2X点体力(X为你以此法弃置的牌数)。",
            "qx_manwang":"蛮王",
            "qx_manwang_info":"每当你一次性回复了超过一点体力后，可以视为使用一张南蛮入侵；你的南蛮入侵造成伤害后，你可以弃置目标一张手牌",
            "qx_keji":"克己",
            "qx_keji_info":"每当你受到一次伤害，你获得一枚克标记(最多拥有八枚)，你的手牌上限加X(X为你克标记数量)；若你的克标记不小于2，摸牌阶段你多摸一张牌；若你的克标记不小于3，出牌阶段你可以多出一张杀；若你的克标记不小于6，你的杀指定目标时，可以令其非锁定技失效直到该角色回合开始",
            "qx_gongxin":"攻心",
            "qx_gongxin_info":"出牌阶段限一次，若你有手牌，可以指定一名角色，该角色猜测一种花色(不公布)，你选择一张牌，然后该角色公布其猜的花色，你展示你选择的牌：若其猜的和你选择的牌花色不同，则其展示其手牌，获得你展示的牌并流失一点体力；若其猜的花色与你展示的相同，其无法对其他角色使用杀直到其下个回合结束",
            "qx_qinxue":"勤学",
            "qx_qinxue_info":"觉醒技，准备阶段开始时，若你拥有的克标记不小于3，你须减一点体力上限并获得技能【攻心】",
            "qx_weimu":"帷幕",
            "qx_weimu_info":"你即将造成伤害时，需要指定一名角色(该角色不可以为你，被你攻击角色以及拥有乱标记的角色)，并将伤害来源转移为你所指定的角色，若不如此做，伤害来源仍然为你，且你流失一点体力；当你使用了一张牌指定目标后，若目标中不含你，则你可以弃置一张牌，转移改牌的使用者；当你成为了一张牌唯一的目标后，可以弃置一张黑色牌，为此牌重新定义一个目标",
            "qx_wansha":"完杀",
            "qx_wansha_info":"场上一名角色濒死时，你可以弃一张牌，令其立刻死亡",
            "qx_baonue":"暴虐",
            "qx_baonue_info":"势力技，你的回合内，有角色受到了伤害后，你可以进行一次判定，若为黑桃，你回复一点体力",
            "qx_weimu1":"帷幕",
            "qx_weimu1_info":"当你使用了一张牌指定目标后，若目标中不含你，则你可以弃置一张牌，转移改牌的使用者；当你成为了一张牌唯一的目标后，可以弃置一张黑色牌，为此牌重新定义一个目标",
            "qx_luanwu2":"乱武",
            "qx_luanwu2_info":"",
            "qx_luanwu1":"乱武",
            "qx_luanwu1_info":"",
            "qx_luanwu0":"乱武",
            "qx_luanwu0_info":"出牌阶段，若你有武标记，则你可以弃置该标记，并指定一名角色获得乱标记(拥有乱标记的角色若出牌阶段未对其他角色造成伤害，则其回合结束时流失一点体力，当拥有乱标记的角色对其他角色造成了伤害时，乱标记转移到受伤角色身上)，拥有乱标记的角色即将死亡时，你重新获得武标记；你不是乱标记的合法转移目标",
            "qx_sixing":"四星",
            "qx_sixing_info":"",
            "qx_jiuchi":"酒池",
            "qx_jiuchi_info":"锁定技，你的♠️杀造成的伤害加一",
            "qx_hengzheng":"横征",
            "qx_hengzheng_info":"每当你流失体力时后，可以指定至多X个目标，你获得这些目标的各一张牌(X为你流失的体力数，可以获得判定区中的牌)",
            "qx_daoxing":"倒行",
            "qx_daoxing_info":"回合开始时，你进行一次判定并增加4点体力上限，根据判定结果的花色回复对应的体力，并获得相同数量倒标记：♠️，4；♣️，3；♦️，2；红桃，1；每当你受到一点伤害，你弃置一枚倒标记",
            "qx_nishi":"逆施",
            "qx_nishi_info":"你的手牌上限减X(X为你的倒标记数量加一)；准备阶段开始时，你流失等同于你倒标记数量的体力值，并减少4点体力上限。",
            "qx_shanquan":"擅权",
            "qx_shanquan_info":"主公技，其他群雄势力角色造成伤害时，你可以令其一张牌",
            "qx_duorui":"夺锐",
            "qx_duorui_info":"准备阶段，你可以选择一名角色，若该角色没有手牌，你对其造成一点伤害，否则你随机展示其一张手牌，若：你展示的牌不为闪或者♠️牌，你观看其手牌并获得其中一张，并且目标获得锐标记直到当前回合结束(你对拥有锐标记的角色使用牌无视距离限制)；否则你获得一枚袭标记",
            "qx_tuxi":"突袭",
            "qx_tuxi_info":"你造成伤害后，获得一枚袭标记；一名角色的回合结束时，你可以弃置所有袭标记，并开始一个你的回合，并为该角色添加锐标记直到其回合开始，每轮限一次；准备阶段开始时，若你有袭标记，则你弃置袭标记并摸一张牌",
            "qx_fanjian":"反间",
            "qx_fanjian_info":"出牌阶段限一次，你可以指定一名有手牌的角色，然后你声明一种花色，并令该角色展示其一张手牌，若该角色展示的牌花色与你声明的不同，其流失一点体力，否则你获得其展示的牌并观看其手牌",
            "qx_qinyin":"琴音",
            "qx_qinyin_info":"",
            "qx_qinyin0":"琴音",
            "qx_qinyin0_info":"场上有角色进行英姿的判定时，展示自己的一张牌，视该牌为判定结果；每当你每使用或响应了一张牌(使用或打出的牌数不得超过一张)，便获得一枚与该牌花色对应的标记，回合结束阶段，你可以弃置四种花色各一枚，令一名角色回复一点体力或者弃置两张牌(不足则流失一点体力)",
            "qx_yeyan":"业炎",
            "qx_yeyan_info":"准备阶段开始时，若你的四种花色标记之和不小于16，则你可以弃置所有的花色标记，并指定至多四名角色，对角色各使用一张火杀，于此期间被你的杀命中的角色将获得🔥标记(🔥标记为负面状态，详情可以点击其他角色🔥标记查看)",
            "qx_sanxing":"三星",
            "qx_sanxing_info":"",
            "qx_yixing":"一星",
            "qx_yixing_info":"",
            "qx_erxing":"二星",
            "qx_erxing_info":"",
            "qx_fengxing":"风行",
            "qx_fengxing_info":"你的回合外，场上有角色出杀时，你可以立刻视为使用一张无视距离的杀，每轮限一次",
            "qx_xhy_jiying":"极影",
            "qx_xhy_jiying_info":"你对一名角色出杀时，可以弃一张牌，则此杀视为雷属性，且需要两张【闪】闪避",
            "qx_xhy_miaocai":"妙才",
            "qx_xhy_miaocai_info":"觉醒技，锁定技，当你受到伤害或流失体力后，若你的体力值为1，则你失去一点体力上限，回复一点体力，摸两张牌，获得技能雷厉，并选择一项：1，额外回复一点体力，手牌上限加三；2，失去技能风行，获得技能神速，手牌上限加1",
            "qx_xhy_leili":"雷厉",
            "qx_xhy_leili_info":"当你用雷杀命中目标后，可以弃置目标的一张牌",
            "qx_xhy_chuanyun":"穿云",
            "qx_xhy_chuanyun_info":"你成为杀的目标后，可以视为对来源出一张杀，每阶段限一次",
            "qx_xhy_shensu":"神速",
            "qx_xhy_shensu_info":"你的回合外，有其他角色出杀时，你可以弃一张牌，视为使用一张无视距离雷杀",
            "qx_tiaoxin":"挑衅",
            "qx_tiaoxin_info":"其他角色的回合开始时，你可以获得其一张牌，则当前回合内，其对你使用杀无视距离限制，若该角色当前回合内未对你造成伤害，其于该回合结束阶段需要向所有人展示其手牌",
            "qx_beifa":"北伐",
            "qx_beifa_info":"当场上有角色死亡时，你可以摸一张牌，回复一点体力(满体力则再摸一张牌)，并且手牌上限永久加一",
            "qx_guanxing":"观星",
            "qx_guanxing_info":"一名角色的准备阶段开始时，你可以获得牌堆顶的一张牌，然后你需要将一张手牌置于牌堆顶",
            "qx_jw_jizhi":"继志",
            "qx_jw_jizhi_info":"锁定技，觉醒技，你受到伤害后，若你的体力值为一，则你获得技能观星，北伐，回复一点体力并摸两张牌",
            "qx_mashu":"马术",
            "qx_mashu_info":"锁定技，你的防御距离和进攻距离都+1，你不能成为坐骑牌的目标",
            "qx_mengjin":"鞬出",
            "qx_mengjin_info":"你的杀指定了目标后，可以获得该角色的一张装备牌，若该牌为坐骑牌，你装备之，每阶段限一次；你造成伤害后，可以令目标手牌上限永久减一，如果你已经对该目标发动了两次此效果，则改为你摸一张牌",
            "qx_qun_tieji":"铁骑",
            "qx_qun_tieji_info":"势力技，当你使用一张[杀]时，可进行一次判定，若为红桃则此[杀]不可闪避",
            "qx_zz_guzheng":"固政",
            "qx_zz_guzheng_info":"一名角色的回合结束时，若其手牌数小于其体力值，你可以令其将手牌补至体力值数(最多补三张)",
            "qx_zz_anbang":"安邦",
            "qx_zz_anbang_info":"每阶段限一次，你可以将一张黑色牌和一张红色牌一同交给一名角色(要求你和目标中至少要有一个人体力值为1)，若你的体力值为一，你回复一点体力，否则若目标回复一点体力",
            "qx_zz_zhijian":"直谏",
            "qx_zz_zhijian_info":"出牌阶段限一次，你可以弃置一名角色的一张牌，然后该角色可以弃置一张与你弃置的牌花色相同的牌，若其如此做，你受到该角色对你造成的一点伤害，若其不如此做，你可以选择是否继续发动技能，若继续发动，你可以再选择一名有装备牌的目标的装备牌，则你选择的第一名目标装备你选择的装备牌，若你未选择装备牌，你与选择的第一名目标各摸一张牌",
            "qx_zr_juxiang":"巨象",
            "qx_zr_juxiang_info":"场上有角色使用南蛮入侵时，你可以令任意名角色不成为该牌的目标，若使用该南蛮入侵的不为你，你可以在该牌结束后立刻使用一张南蛮入侵。",
            "qx_zr_lieren":"烈刃",
            "qx_zr_lieren_info":"你可以将自己的红杀当火杀使用；你使用杀指定了目标后，可以与该目标拼点，若你赢，则你可以为此杀额外指定两名目标(无视距离)，且该杀指定得所有目标非锁定技失效直到当前回合结束，若你没赢，你获得该角色的拼点牌，每阶段限一次",
            "qx_gn_fenwei":"奋威",
            "qx_gn_fenwei_info":"每当你使用了一张黑色牌之后，你可以弃置其他一名角色的一张牌(可以弃置判定区里的牌)",
            "qx_gn_qixi":"奇袭",
            "qx_gn_qixi_info":"你的弃牌阶段开始时，若你未拥有该技能的子技能，则你可以立刻结束当前回合，并且你获得以下子技能直到你的下个回合结束：场上有其他角色准备阶段开始时，你可以摸两张牌，执行额外的一个出牌阶段，直到该角色的出牌阶段开始，该角色非锁定技失效且无法使用或打出牌",
            "qx_gn_qixi0":"奇袭",
            "qx_gn_qixi0_info":"",
            "qx_ys_xueyi":"血裔",
            "qx_ys_xueyi_info":"主公技，锁定技，你的手牌上限加7，当场上有角色死亡后，你手牌上限永久减二",
            "qx_ys_haogui":"豪贵",
            "qx_ys_haogui_info":"其他角色使用杀之后，你可以获得该杀，则该角色获得护标记直到其下个回合开始；你和拥有护标记的角色不会成为万箭齐发的目标",
            "qx_ys_jianyu":"箭雨",
            "qx_ys_jianyu_info":"出牌阶段限X次(X初始值为一，场上每有一名角色阵亡，X便加一)，你可以弃置两张牌，视为使用了一张万箭齐发，当你使用了当前回合第N张万箭齐发时，你摸一张牌(N为任何奇数)",
            "qx_ys_jianyua":"箭雨",
            "qx_ys_jianyua_info":"",
            "qx_smy_guicai":"鬼才",
            "qx_smy_guicai_info":"你摸牌阶段少摸一张牌；每阶段限一次，你可以从弃牌堆里选择一张牌获得之；其他角色的判定牌亮出后，你可以从弃牌堆里选择一张牌作为判定牌",
            "qx_smy_langgu":"狼顾",
            "qx_smy_langgu_info":"当你回复体力后，可以选择一名角色，你对该角色造成一点伤害；当场上有角色流失体力后，你可以获得该角色的一张牌，若该角色拥有技能妙计，则你可以选择目标的范围扩大为所有人",
            "qx_smy_renjie":"忍戒",
            "qx_smy_renjie_info":"你受到其他角色的伤害后，你可以令对你造成伤害的角色获得一枚戒标记(场上最多同时存在一枚，死亡角色不计数)，拥有戒标记的角色手牌上限减一，并且即将受到伤害时转化为流失等量体力；拥有戒标记的角色出牌阶段开始时，若其有手牌，你可以弃置该角色的戒标记声明一种花色，则该角色需要展示一张与你声明的花色相同花色的手牌，否则该角色进入混乱状态。",
        },
    },
    intro:"扩展武将强度较高，不建议双武将打国战(太容易一打多，控全场)，ai较简单，部分技能可能不大会用，不过彼此之前强度比较平衡。欢迎反馈bug；另外感谢提供帮助的N多大佬。<li>本扩展粗略将武将划分为了四个星级，以一二星为本扩展标准强度，部分武将会略高或略低与二星武将 <li>暂定四星为最高，出现五星级普通武将会进行削弱，四星武将有一定概率削弱<li>该扩展技能配音大部分引自游戏自带配音，后期技能方才开始自带配音；且该扩展直接引用了部分三国杀技能(如倾国，放逐，但是引用的不多)，因此禁用三国杀包可能会卡死<li>更新内容：张辽无法再通过袭标记摸牌 ，庞德鞬出获得其他角色坐骑牌时可以直接装备上，二张安邦在自己一血时也可以发动，并且优先为自己回血，更新武将：一星祝融，二星甘宁，二星主公袁绍，伪五星司马懿",
    author:"食之无味",
    diskURL:"",
    forumURL:"",
    version:"2.0",
},files:{"character":["袁绍.jpg"],"card":[],"skill":[]}}};