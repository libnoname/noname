export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"渐意新生",content:function (config,pack){
    // Keep the original record visible; do not silently replace missing skills.
    lib.characterFilter.xxy_yinhui = () => !!(lib.skill.xxy_guima && lib.skill.xxy_shenpan);
    lib.characterIntro.xxy_yinhui = "兼容提示：源扩展缺少 xxy_guima、xxy_shenpan 的实现。武将资料保留，技能补齐前不可进入对局。";
},precontent:function (){
    
},help:{},config:{},package:{
    character:{
        character:{
            "xxy_wangyuehan":["male","wei",3,["xxy_yuehan","xxy_jiezhen","xxy_yingjian"],[]],
            "xxy_yinhui":["male","wei",4,["xxy_sishen","xxy_guima","xxy_shenpan"],[]],
            "xxy_lianyinshuang":["female","shen",3,["xxy_tiannai","xxy_shuangwu","xxy_shuangren","xxy_jinmie"],[]],
            "xxy_yingyue":["female","wei",4,["xxy_yanshan","xxy_luoqun"],[]],
            "xxy_shatianshi":["female","shu",3,["xxy_shaqi","xxy_shenzhu"],["des:巾帼不让须眉，英姿飒爽，如得神助，天人合一。"]],
        },
        translate:{
            "xxy_wangyuehan":"望月寒",
            "xxy_yinhui":"银灰",
            "xxy_lianyinshuang":"蓝银霜",
            "xxy_yingyue":"莹月",
            "xxy_shatianshi":"煞天使",
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
            "xxy_yuehan":{
                trigger:{
                    player:"damageBefore",
                },
                direct:true,
                filter:function (event,player){
        return player.storage.xxy_yingjian>0;
    },
                content:function (){
        trigger.cancel();
        var chat=['月圆似我心','月寒似我意'].randomGet();
                  player.say(chat);
        player.storage.xxy_yingjian--;
    },
                group:"xxy_yuehan_1",
                subSkill:{
                    "1":{
                        trigger:{
                            player:"phaseDrawBegin",
                        },
                        frequent:true,
                        content:function (){
                var chat=['月圆似我心','月寒似我意'].randomGet();
                  player.say(chat);
        trigger.num+=player.storage.xxy_yingjian;
                player.storage.xxy_yingjian=0;
    },
                        sub:true,
                    },
                },
            },
            "xxy_jiezhen":{
                mod:{
                    canBeDiscarded:function (card){
            if(get.position(card)=='e') return false;
        },
                },
            },
            "xxy_yingjian":{
                init:function (player){
    player.storage.xxy_yingjian=game.players.length;
    game.addVideo('storage',player,['xxy_yingjian',player.storage.xxy_yingjian]);
    },
                intro:{
                    content:function (storage){
        return '当前值：'+storage+'/15';
        },
                },
                marktext:"月",
                mark:true,
                audio:"ext:清瑶葭绮/members/渐意新生:2",
                trigger:{
                    source:"damageBegin",
                },
                filter:function (event){
        return event.card&&event.card.name=='sha'&&event.parent.name!='_lianhuan'&&event.parent.name!='_lianhuan2';
    },
                forced:true,
                content:function (){
        var chat=['剑锋若光','剑影似月'].randomGet();
                  player.say(chat);
        var num=player.hp;
        player.storage.xxy_yingjian+=num;       
        player.syncStorage('xxy_yingjian');
        player.markSkill('xxy_yingjian');
        game.log(player,'获得了num个“橘”');
        player.draw();
    },
            },
            "xxy_huilian":{
                audio:"ext:清瑶葭绮/members/渐意新生:2",
                enable:"phaseUse",
                filter:function (event,player){
        return player.countCards('he',{color:'black'})>0&&!player.hasSkill('xxy_huilian2');
    },
                content:function (){
        'step 0'
        var next=player.chooseCardTarget({
            prompt:get.prompt('xxy_huilian'),
            position:'he',
            filterCard:function(card,player){
                return get.color(card)=='black'&&lib.filter.cardDiscardable(card,player);
            },
            ai1:function(card){
                return 7-get.value(card);
            },
            ai2:function(target){
                var att=-get.attitude(player,target);
                if(target==player.next){
                    att/=10;
                }
                if(target==player.next.next){
                    att/=2;
                }
                return att;
            },
            filterTarget:function(card,player,target){
                return player!=target;
            },
        });
        'step 1'
        if(result.bool){
            var chat=['接受死亡审判吧！','没有什么是我一刀解决不了的，如果有那就两刀'].randomGet();
                  player.say(chat);
            player.discard(result.cards);
            player.logSkill('xxy_huilian',result.targets);
            player.addSkill('xxy_huilian2');
            var target=result.targets[0]
            player.storage.xxy_huilian2=target;
            if(target&&(get.mode()!='guozhan')||!target.isUnseen()){
                player.markSkillCharacter('xxy_huilian2',target,'挥镰','在'+get.translation(target)+'的下一准备阶段视为对其使用一张杀');
            }
        }
    },
            },
            "xxy_huilian2":{
                trigger:{
                    global:["phaseBegin","dieAfter"],
                },
                forced:true,
                filter:function (event,player){
        return event.player==player.storage.xxy_huilian2;
    },
                content:function (){
        "step 0"
        if(player.storage.xxy_huilian2.isIn()){
            player.useCard({name:'sha'},player.storage.xxy_huilian2);
        }       
        "step 1"
        if(result.bool&&player.storage.xxy_huilian2.hp<2){
           player.storage.xxy_huilian2.die();   
           var chat=['太弱了'].randomGet();
                  player.say(chat);
        }   
        "step 2"
        player.removeSkill('xxy_huilian2');
        delete player.storage.xxy_huilian2;
    },
                mod:{
                    targetEnabled:function (){
            return false;
        },
                    cardEnabled:function (card,player){
            return false;
        },
                },
                group:"xxy_huilian2_1",
                subSkill:{
                    "1":{
                        trigger:{
                            player:"shaMiss",
                        },
                        direct:true,
                        filter:function (event,player){
        return player.hasSkill('xxy_huilian2');
    },
                        content:function (){
                player.draw(player.storage.xxy_huilian2.hp);
    },
                        sub:true,
                    },
                },
            },
            "xxy_sishen":{
                audio:"ext:清瑶葭绮/members/渐意新生:2",
                trigger:{
                    player:"dieBefore",
                },
                forced:true,
                content:function (){
        trigger.cancel();
        var chat=['冥王也怕我三分','我怎会死亡'].randomGet()
                  player.say(chat)
    },
                group:"xxy_sishen_1",
                subSkill:{
                    "1":{
                        trigger:{
                            player:"phaseEnd",
                        },
                        audio:2,
                        forced:true,
                        unique:true,
                        filter:function (){
            return Math.random()<=0.5;
    },
                        content:function (){
            if(player.hp<1){
               player.removeSkill('xxy_sishen')
               player.die();
            var chat=['怎么会……'].randomGet();
                player.say(chat);
        }
    },
                        sub:true,
                    },
                },
            },
            "xxy_tiannai":{
                trigger:{
                    player:"enterGame",
                    global:"gameStart",
                },
                frequent:true,
                forced:true,
                content:function (){
          game.broadcastAll()+ui.background.setBackgroundImage("extension/清瑶葭绮/members/渐意新生/xxy_weewh.jpg");
          game.log(player,'将场地切换为清风逍悦');
          ui.backgroundMusic.src=lib.assetURL+'extension/清瑶葭绮/members/渐意新生/xxy_nuhuayachongzhi.mp3'; 
          player.node.name.innerHTML='神·蓝银霜';
          player.update();
     },
            },
            "xxy_shuangwu":{
                mark:true,
                unique:true,
                init:function (player){
        player.storage.xxy_shuangwu=0;
        game.addVideo('storage',player,['xxy_shuangwu',player.storage.xxy_shuangwu]);
    },
                intro:{
                    content:function (storage){
            return '当前值：'+storage+'/10';
        },
                },
                audio:"ext:清瑶葭绮/members/渐意新生:2",
                trigger:{
                    global:"phaseEnd",
                },
                filter:function (event,player){
        return player.storage.xxy_shuangwu<10;
    },
                frequent:true,
                content:function (){
        player.storage.xxy_shuangwu++;      
        player.syncStorage('xxy_shuangwu');
        player.markSkill('xxy_shuangwu');
        game.log(player,'获得了1个“霜”');
    },
            },
            "xxy_shuangren":{
                audio:"ext:清瑶葭绮/members/渐意新生:2",
                trigger:{
                    source:"damageBegin",
                },
                filter:function (event,player){
        return player.storage.xxy_shuangwu>=player.hp;
    },
                forced:true,
                content:function (){
        trigger.num++;
        player.draw();
        player.storage.xxy_shuangwu-=player.hp;
        
    },
            },
            "xxy_jinmie":{
                audio:"ext:清瑶葭绮/members/渐意新生:2",
                trigger:{
                    player:["damageEnd","xxy_shuangwuAfter"],
                },
                forced:true,
                filter:function (event,player){
        return player.storage.xxy_shuangwu>0&&player.hp<2;
    },
                content:function (){
        player.hp=player.storage.xxy_shuangwu;
        player.maxHp=player.storage.xxy_shuangwu;
        player.removeSkill('xxy_shuangwu');
        player.removeSkill('xxy_shuangren');
        player.removeSkill('xxy_jinmie');
        player.setAvatar('xxy_lianyinshuang','xxy_lianyinshuang1');
        player.update();      
        player.node.name.innerHTML='神·兰馨';
        player.addSkill('xxy_huoren');
        player.addSkill('xxy_huowu');
        player.$fullscreenpop('霜林尽染<br>心有暖意','fire');
        game.delay(4);
    },
                ai:{
                    maixie:true,
                    "maixie_hp":true,
                    effect:{
                        target:function (card,player,target){
                if(player.hasSkillTag('jueqing',false,target)) return [1,-1];
                if(get.tag(card,'damage')) return [1,0.55];
            },
                    },
                },
            },
            "xxy_huoren":{
                group:"xuanyan2",
                trigger:{
                    source:"damageBefore",
                },
                direct:true,
                priority:10,
                filter:function (event){
        return event.nature!='fire';
    },
                content:function (){
            
            trigger.nature='fire';
        },
            },
            "xxy_huowu":{
                trigger:{
                    player:"phaseEnd",
                },
                filter:function (event,player){
        return player.getStat('damage')>1;
    },
                content:function (){
        'step 0'
        player.loseHp();
        'step 1'  
        
var targets=player.getEnemies();
if(targets.length){
  var target=targets.randomGet();
        player.line(target,'green');
        target.damage('fire');        
        game.delayx();
    }
        
    },
                ai:{
                    order:8,
                    effect:function (card,player,target){
    if(get.tag(card,'damage')){
        if(player.hasSkillTag('jueqing',false,target)) return [1,1];
        return 1.2;
    }
    if(get.tag(card,'loseHp')){
        if(player.hp<=1) return;
        return [0,0];
    }
        },
                },
            },
            "xxy_yinghua":{
                init:function (player){
    player.storage.xxy_yinghua=0;
    game.addVideo('storage',player,['xxy_yinghua',player.storage.xxy_yinghua]);
    },
                intro:{
                    content:function (storage){
            return '当前值：'+storage+'/10';
        },
                },
                mark:true,
                audio:"ext:清瑶葭绮/members/渐意新生:2",
                trigger:{
                    player:"damageEnd",
                    source:"damageEnd",
                },
                filter:function (event,player){
        return !player.storage.xxy_yinghua>9;
    },
                frequent:true,
                content:function (){
        player.storage.xxy_yinghua++;      
        player.syncStorage('xxy_yinghua');
        player.markSkill('xxy_yinghua');
        game.log(player,'获得了1个“灵”');
        player.draw(2);
    },
            },
            "xxy_qingchan":{
                audio:"ext:清瑶葭绮/members/渐意新生:2",
                unique:true,
                enable:"chooseToUse",
                mark:true,
                skillAnimation:true,
                animationStr:"情缠",
                limited:true,
                animationColor:"orange",
                init:function (player){
        player.storage.xxy_qingchan=false;
    },
                filter:function (event,player){
        if(player.storage.xxy_qingchan) return false;
        if(event.type=='dying'&&event.player.sex=='male'&&player.storage.xxy_yinghua>0){
            return true;
        }
        return false;
    },
                checkx:function (event,player){
        var att1=get.attitude(player,event.player);
        var att2=get.attitude(player,event.source);
        return att1>0&&att2<=0;
    },
                content:function (){
        'step 0'
        player.awakenSkill('xxy_qingchan');
        player.storage.xxy_qingchan=true;
        'step 1'   
        event.player.recover(player.storage.xxy_yinghua);
        'step 2'
        event.player.draw(player.storage.xxy_yinghua); 
        player.$fullscreenpop('荧荧一水间，默默不得语','fire');
    },
                ai:{
                    order:1,
                    save:true,
                },
                intro:{
                    content:"limited",
                },
            },
            "xxy_yanshan":{
                audio:"ext:清瑶葭绮/members/渐意新生:2",
                trigger:{
                    player:"damageBefore",
                },
                frequent:true,
                filter:function (event){
        return Math.random()<=0.6;
    },
                content:function (){
        "step 0"
        trigger.cancel();
        "step 1"  
        player.draw(player.maxHp-player.hp);
        var chat=['轻罗小扇扑流萤'].randomGet();
                  player.say(chat);
    },
                ai:{
                    maixie:true,
                    "maixie_hp":true,
                    effect:{
                        target:function (card,player,target){
                if(get.tag(card,'damage')){
                    if(player.hasSkillTag('jueqing',false,target)) return [1,-2];
                    if(!target.hasFriend()) return;
                    var num=1;
                    if(get.attitude(player,target)>0){
                        if(player.needsToDiscard()){
                            num=0.7;
                        }
                        else{
                            num=0.5;
                        }
                    }
                    if(target.hp>=4) return [1,num*2];
                    if(target.hp==3) return [1,num*1.5];
                    if(target.hp==2) return [1,num*0.5];
                }
            },
                    },
                },
            },
            "xxy_qingling":{
                mark:true,
                unique:true,
                init:function (player){
        player.storage.xxy_qingling=0;
        game.addVideo('storage',player,['xxy_qingling',player.storage.xxy_qingling]);
    },
                intro:{
                    content:function (storage){
            return '当前值：'+storage+'/player.maxHp';
        },
                },
                trigger:{
                    player:"loseEnd",
                },
                forced:true,
                filter:function (event,card){    
        return trigger.num>1;      
    },
                content:function (){
        
        player.storage.xxy_qingling++;
        player.draw();
        var chat=['如果你为失去太阳而流泪时<br>你也将失去群星了','我走后<br>也不想带走一粒尘埃'].randomGet()
                  player.say(chat)
        if(player.storage.xxy_qingling>player.maxHp)
            player.storage.xxy_qingling=player.maxHp;
        game.addVideo('storage',player,['xxy_qingling',player.storage.xxy_qingling]);
    },
            },
            "xxy_luoqun":{
                mark:true,
                unique:true,
                init:function (player){
        player.storage.xxy_luoqun=0;
        game.addVideo('storage',player,['xxy_luoqun',player.storage.xxy_luoqun]);
    },
                intro:{
                    content:"当前有#个“裙”",
                },
                audio:"ext:清瑶葭绮/members/渐意新生:2",
                trigger:{
                    player:"phaseEnd",
                },
                frequent:true,
                content:function (){
        "step 0"
        player.storage.xxy_luoqun++;
        "step 1"
        player.draw(1+player.storage.xxy_luoqun);
        var chat=['凌波微步，罗袜生尘'].randomGet();
                  player.say(chat);
    },
            },
            "xxy_shaqi":{
                audio:"ext:清瑶葭绮/members/渐意新生:2",
                trigger:{
                    source:"damageBegin",
                },
                filter:function (event,player){
        return _status.currentPhase=player;
    },
                forced:true,
                content:function (){
        trigger.num++;
        player.removeSkill('xxy_shaqi');
        player.addSkill('xxy_shaqi_1');
    },
                group:"xxy_shaqi_1",
                subSkill:{
                    "1":{
                        trigger:{
                            player:"damageBefore",
                        },
                        filter:function (event,player){
        return _status.currentPhase!=player;
    },
                        content:function (){
        trigger.cancel();
        player.removeSkill('xxy_shaqi_1');
        player.addSkill('xxy_shaqi');
    },
                        sub:true,
                    },
                },
            },
            "xxy_shenzhu":{
                audio:"ext:清瑶葭绮/members/渐意新生:2",
                trigger:{
                    global:"phaseEnd",
                },
                frequent:true,
                filter:function (){
        return Math.random()<=0.4;
    },
                content:function (){
        player.recover();
        player.addSkill('xxy_shamie');
    },
            },
            "xxy_shamie":{
                trigger:{
                    source:"damageEnd",
                },
                audio:"ext:清瑶葭绮/members/渐意新生:2",
                filter:function (event,player){
        return event.player.countCards('e')||event.player.countCards('h');
    },
                check:function (event,player){
        return get.attitude(player,event.player)<0;
    },
                content:function (){
        trigger.player.discard(trigger.player.getCards('he'));
        player.removeSkill('xxy_shamie');
    },
            },
        },
        translate:{
            "xxy_yuehan":"月寒",
            "xxy_yuehan_info":"摸牌阶段，你额外摸X张牌(X为标记数)，然弃置清空月，你每受1点伤害前，需要弃置1个月标记，取消此伤害",
            "xxy_jiezhen":"解阵",
            "xxy_jiezhen_info":"锁定技，其他角色不能拆除或获得你装备区里的牌",
            "xxy_yingjian":"影剑",
            "xxy_yingjian_info":"锁定技，你的杀造成伤害后摸一张牌，并获得X个标记(X为玩家体力值的1倍，初始有现场玩家数个标记)",
            "xxy_huilian":"挥镰",
            "xxy_huilian_info":"出牌阶段限一次，你可以将一张黑色牌置于一名角色的武将牌上，下个准备阶段开始时，你视为对其使用一张杀，若其体力值因此小于2，其死亡。你不能使用卡牌，也不能成为卡牌的目标，若杀未命中摸目标体力值张牌",
            "xxy_huilian2":"镰刀",
            "xxy_huilian2_info":"下个准备阶段对目标用杀",
            "xxy_sishen":"死神",
            "xxy_sishen_info":"锁定技，你不会死亡，当你回合结束时，若你的体力值小于1，你有一半机率死亡",
            "xxy_tiannai":"天籁",
            "xxy_tiannai_info":"锁定技，天神下凡，出场自带音效，自带背景",
            "xxy_shuangwu":"霜舞",
            "xxy_shuangwu_info":"每回合结束后，你获得一个霜标记。上限10个",
            "xxy_shuangren":"霜刃",
            "xxy_shuangren_info":"锁定技，若你的标记不小于体力值，你弃置等同体力值个标记，你造成的伤害+1，造成伤害后摸一张牌",
            "xxy_jinmie":"烬灭",
            "xxy_jinmie_info":"锁定技，当你的标记不小于1且你体力值不大于1，你变为神·兰馨，体力与体力上限变为标记数",
            "xxy_huoren":"火刃",
            "xxy_huoren_info":"锁定技，你即将造成的伤害均视为火焰伤害，你的火焰伤害加一。",
            "xxy_huowu":"火舞",
            "xxy_huowu_info":"回合结束时，若你至少造成2点伤害，你可以失去1点体力，对一名敌方角色造成1点火焰伤害",
            "xxy_yinghua":"荧华",
            "xxy_yinghua_info":"若你标记数小于10当你造成或受到伤害或回合结束后，获得一个“荧”，然后摸两张牌。",
            "xxy_qingchan":"情缠",
            "xxy_qingchan_info":"限定技，当一名其他男性角色濒死时，你可令其回复X点体力，并获得所有“荧”。",
            "xxy_yanshan":"掩面",
            "xxy_yanshan_info":"每当你即将受到一点伤害，有60%机率取消之，并摸卫损失的体力值的牌。",
            "xxy_qingling":"轻灵",
            "xxy_qingling_info":"锁定技，当你失去至少两张手牌时，你获得一个“灵”标记，然后摸一张牌（标记上限为你的体力上限）",
            "xxy_luoqun":"罗裙",
            "xxy_luoqun_info":"回合结束时，你获得一个标记摸X+2张牌（X为标记数）",
            "xxy_shaqi":"煞气",
            "xxy_shaqi_info":"锁定技，你的杀造成的伤害+1，造成伤害后摸一张牌",
            "xxy_shenzhu":"神助",
            "xxy_shenzhu_info":"每回合结束时，你有40%机率回复一点体力并获得技能“煞灭”",
            "xxy_shamie":"煞灭",
            "xxy_shamie_info":"你造成伤害后，弃置目标所有牌，然后失去此技能",
        },
    },
    intro:"扩展内武将全部使用动图，内存较大，大部分内存是图片。武将不可再次编辑（编辑闪退）。因暂无配音素材，所以无音效，以后可能更新音效。作者技术一般，扩展内不会出现高制作难度武将。<br>可积极建议，发现Bug后可联系作者改动，最好直接说改变方法。<br>1.1更新内容：修复了一些Bug和一个卡死Bug，改进了部分技能描述。<br>1.2更新内容：新增加一个武将并修复了一些BUG",
    author:"清风逍悦",
    diskURL:"以后也不会有",
    forumURL:"以后更不会有",
    version:"1.2",
},files:{"character":["xxy_shatianshi.jpg"],"card":[],"skill":[]}}};
