export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"云游四海",content:function(config,pack){
    lib.characterTitle.云游四海_luxianhe = '#p兵乱邪魔';
    lib.characterTitle.云游四海_songyingjie = '#p皮影戏';
    lib.characterTitle.云游四海_gaolu = '#p誓仇之龙';
    lib.group.push('ye');
    lib.translate.ye = '野';
    lib.group.push('gong');
    lib.translate.gong = '公';
    lib.groupnature.ye = 'ysye';
    lib.groupnature.gong = 'ysgong';
    lib.translate.Q_云游四海 = "云游四海";
    lib.characterSort['mode_extension_云游四海']={
        'Q_云游四海': ["云游四海_luxianhe","云游四海_songyingjie","云游四海_gaolu"]};
},precontent:function(){
    
},help:{},config:{},package:{
    character:{
        character:{
            "云游四海_luxianhe":["male","ye",3,["云游四海_buluan","云游四海_duanyu","云游四海_sihe"],["des:&nbsp;沧州街头还是那么热闹，似是今时同于往日，也有些许不同，随着卖报的小娃子的声声呐喊，似乎除了那些乞儿，谁都知道了一个大事，玄衣饲鹤的魔头伏法了。 <br><br>&nbsp;&nbsp;街上的人流倒是没什么变化，只是那以往便趾高气昂，嚣张的仿佛皇帝一般的贵族老爷们，有点不一样了，连被卖报的娃子撞到都没留下那娃子的手指头，甚至还给了喊的最大声的娃子赏银。  <br><br>&nbsp;&nbsp;把那娃子乐的。怕是能吃一顿饱饭了，之后的事？那些汉子可不是吃素的，老爷给的赏钱他们不敢抢，卖报的娃子吃饭剩下的钱，他们还不敢抢了？ <br><br>&nbsp;&nbsp;至于为什么不在那娃子吃饭的时候抢，这倒是那些汉子最后一点良心了，他们这帮子没心的东西也有规矩，暴富的得让人享受一下再抢，还不能害了人命。若是害了命，那些贵族老爷为了面子也要罚他们跟去马场刷厕所，甚至要罚去跟马匪打仗哩。 &nbsp;不过这也和故事的主角没什么关系，那玄衣俊郎还在刑场上等着吃贵族老爷亲自打的枪子哩。 <br><br>&nbsp;&nbsp;那个陆闲鹤，顺着四海互通的水路，在十六州好几个地方行乱了，每回到了新地方都能让人发疯，让人专打关系好的。让那帮子人把利民，更利贵族老爷的设施，装备全拆了，还把粮食都弄去养白鹤，自己反而不谋利。 <br><br>&nbsp;&nbsp;那些贵族老爷最怕这个人了，他到的地方的老爷没一个还能继续当老爷的，那些个家仆还好说，若是老爷不刻薄，还能继续帮着，可若是那老爷稍不好点，最好也不过袖手旁观，欠着老爷款的爷们们对着那些老爷报仇报的可凶，听说有个挺乱的州边境还出现了拿老爷祭天的事，这可是打千年前贵族初成头一次出现的老爷被领地的公民弄去当祭品的事。 &nbsp;刑场上的少年嘴角带着笑，那刀斧手一刀刀劈下只换来一声声鹤的悲鸣。 那少年冷笑一声，指尖的血便溢了出来，向着刀斧手飞去，远处等着补几枪的老爷似是被吓得，那枪便冲着理他最近的子嗣打过去了，那个被血丝包围的刀斧手也同疯子一般，冲着老爷举刀便劈。 <br><br>&nbsp;&nbsp;到了这时候，台上的老爷们才反应过来，这是他们被算计了，他们中套了，一个个便顾不得绅士风度，淑女气质，迈腿便冲着场外跑。 <br><br>&nbsp;&nbsp;他们却是忘了玄衣少年还在，只见他手一挥，一道散如薄雾的血便飙了出去，不，应该说飞了出去，像有什么神秘力量支撑着一般。 &nbsp;被沾到的的人便开始疯了，仆杀主，夫杀妻，倒是可笑，越身居高位的，这时候越没攻击性，只会被一群人围攻。 <br><br>&nbsp;&nbsp;“这就是这个州的主宰者吗？呵，呵呵。”，自来到这个州便一直没说过话的俊郎在这偏远之地头一次的开了口，“连个有能耐的都不养，还不如舍州那帮子匪王厉害。” <br><br>&nbsp;&nbsp;革新！这力量为了革新而生！迂腐的旧主宰者不必存在，因人是拥有随时创造新的阶级的伟大适应力与内斗力的种族。 &nbsp;看着随着贵族的逃离，陷入火海与疯狂的人群中小镇，他笑了，笑的无比灿烂，“连反抗之力都不保留的破地方，毁灭的更彻底一点吧，在四海巡捕那群疯子来之前，毁掉吧！” &nbsp;一切为了革新！ <br><br>&nbsp;&nbsp;“饲鹤，如饲心”&nbsp;兵乱邪魔 陆闲鹤"]],
            "云游四海_songyingjie":["male","ye",4,["云游四海_qixi"],["des:(暂无)"]],
            "云游四海_piying_3":["male","ye",4,["云游四海_tuichang","云游四海_chicheng"],["unseen"]],
            "云游四海_piying_2":["male","ye",3,["云游四海_tuichang","云游四海_leijue"],["unseen"]],
            "云游四海_piying_1":["male","ye",3,["云游四海_tuichang","云游四海_shutian"],["unseen"]],
            "云游四海_piying_4":["female","ye",3,["云游四海_tuichang","云游四海_hongyan"],["unseen"]],
            "云游四海_gaolu":["male","gong",3,["云游四海_longyi1","云游四海_chounuo"],["des:（暂无）"]],
            "云游四海_shichouzhilong":["male","gong",4,["云游四海_longlin","云游四海_longxi","云游四海_longyi"],["unseen"]],
            "云游四海_bolansiji":["male","gong",4,["云游四海_yimao","云游四海_xingzui"],["des:（暂无）"]],
        },
        translate:{
            "云游四海_luxianhe":"陆闲鹤",
            "云游四海_songyingjie":"宋英杰",
            "云游四海_piying_3":"皮影将军",
            "云游四海_piying_2":"皮影道人",
            "云游四海_piying_1":"皮影书生",
            "云游四海_piying_4":"皮影美人",
            "云游四海_gaolu":"高禄",
            "云游四海_shichouzhilong":"誓仇之龙",
            "云游四海_bolansiji":"波兰斯基",
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
            "云游四海_yimao":{
                audio:"ext:清瑶葭绮/members/云游四海:2",
                trigger:{
                    player:"damageAfter",
                },
                direct:true,
                content:function(){
        'step 0'
        player.chooseTarget(get.prompt('云游四海_yimao'),'将形态转换为选中角色',function(card,player,target){
            return target!=player;
        });
        'step 1'
        if(result.bool){
            player.logSkill('云游四海_yimao',result.targets);
            player.reinit(player.name,result.targets[0].name);
            player.addSkill('云游四海_yimao');
            player.draw();
        }
    },
                group:"云游四海_yimao2",
            },
            "云游四海_xingzui":{
                audio:"ext:清瑶葭绮/members/云游四海:2",
                trigger:{
                    player:"drawBefore",
                },
                direct:true,
                content:function(){
        'step 0'
        trigger.num--;
        'step 1'
        player.chooseTarget(get.prompt('行罪'),'对选中角色造成一点伤害',function(card,player,target){
            return target!=player;
        });
        'step 2'
        if(result.bool){
            player.logSkill('行罪',result.targets);
            result.targets[0].damage();
        }
        'step 3'
        player.recover();
    },
            },
            "云游四海_buluan1":{
                audio:"ext:清瑶葭绮/members/云游四海:2",
                enable:"phaseUse",
                mark:true,
                marktext:"邪",
                content:function(){
        'step 0'
        player.chooseTarget(get.prompt('布乱'),'令一名其他角色进入混乱状态',function(card,player,target){
            return target!=player;
        });
        'step 1'
        if(result.bool){
            player.logSkill('布乱',result.targets);
            result.targets[0].goMad({player:'phaseAfter'});
            result.targets[0].addSkill('云游四海_布乱_2');
            result.targets[0].link();
            player.link();
            player.loseHp();
        }
    },
            },
            "云游四海_buluan":{
                audio:"ext:清瑶葭绮/members/云游四海:2",
                trigger:{
                    player:"phaseDrawBefore",
                },
                content:function(){
        trigger.cancel();
        player.addTempSkill('云游四海_buluan1');
    },
            },
            "云游四海_duanyu":{
                audio:"ext:清瑶葭绮/members/云游四海:2",
                trigger:{
                    player:["phaseJudgeBegin","phaseJieshuBegin"],
                },
                forced:true,
                content:function(){
        trigger.cancel();
    },
            },
            "云游四海_sihe":{
                audio:"ext:清瑶葭绮/members/云游四海:2",
                trigger:{
                    player:"useCard",
                },
                usable:2,
                marktext:"鹤",
                intro:{
                    content:"mark",
                    name:"鹤",
                },
                content:function(){
        trigger.cancel();
        player.addMark('云游四海_sihe',trigger.num||1);
    },
                group:"云游四海_sihe1",
            },
            "云游四海_sihe1":{
                audio:"ext:清瑶葭绮/members/云游四海:2",
                trigger:{
                    player:"damageBegin",
                },
                forced:true,
                filter:function(event,player){
        return player.storage.云游四海_sihe&&player.storage.云游四海_sihe>0;
    },
                content:function(){
        "step 0"
        trigger.num--;
        player.storage.云游四海_sihe--;
        "step 1"
        player.gain(trigger.cards,'gain2');
    },
            },
            "云游四海_qixi":{
                audio:"",
                trigger:{
                    player:"phaseUseBefore",
                },
                usable:1,
                derivation:["云游四海_独唱","云游四海_书天","云游四海_雷绝","云游四海_驰骋","云游四海_红颜","云游四海_退场"],
                content:function (){
        "step 0"
        player.chooseControl('书生','道人','将军','美人');
        "step 1"
        if(result.control=='书生'){
            player.reinit('云游四海_songyingjie','云游四海_piying_1');
        }
        if(result.control=='道人'){
            player.reinit('云游四海_songyingjie','云游四海_piying_2');
        }
        if(result.control=='将军'){
            player.reinit('云游四海_songyingjie','云游四海_piying_3');
        }
        if(result.control=='美人'){
            player.reinit('云游四海_songyingjie','云游四海_piying_4');
        }
    },
                group:"云游四海_qixi1",
                ai:{
                    order:9.8,
                    threaten:1.8,
                    result:{
                        player:1,
                    },
                },
            },
            "云游四海_tuichang":{
                trigger:{
                    player:["phaseZhunbeiBegin","die"],
                },
                content:function (){
        player.reinit(player.name,'云游四海_songyingjie');
    },
            },
            "云游四海_qixi1":{
                trigger:{
                    global:"gameDrawAfter",
                },
                forced:true,
                filter:function (event,player){
            return get.config('double_character')||lib.config.mode=='guozhan';
    },
                content:function (){
        player.uninit();
        player.classList.remove('fullskin2');
        player.init('云游四海_songyingjie');
        player.addSkill('云游四海_duchang');
    },
            },
            "云游四海_duchang":{
                audio:"ext:清瑶葭绮/members/云游四海:2",
                trigger:{
                    player:["phaseJudgeBegin","phaseDrawBegin"],
                },
                forced:true,
                content:function(){
        trigger.cancel();
    },
                group:"云游四海_duchang1",
            },
            "云游四海_duchang1":{
                audio:"ext:清瑶葭绮/members/云游四海:2",
                trigger:{
                    player:"phaseJieshuEnd",
                },
                forced:true,
                content:function(){
        player.draw(3);
        player.recover();
    },
            },
            "云游四海_yimao2":{
                audio:"",
                trigger:{
                    player:["phaseJieshuBegin","phaseZhunbeiBegin"],
                },
                forced:true,
                content:function (){
        player.reinit(player.name,'yunyousihai_bolansiji');
    },
            },
            "云游四海_buluan2":{
                audio:"ext:清瑶葭绮/members/云游四海:2",
                trigger:{
                    player:"dying",
                },
                forced:true,
                mark:true,
                marktext:"残",
                init:function (player){
        player.storage.残=true;
    },
                content:function(){
        player.recover(3);
        player.awakenSkill('云游四海_buluan2');
        player.say("最后一次仁慈了，这副躯体");
    },
                intro:{
                    content:"身陷疯狂之人最后的救赎，心入黑暗之人最后的慈悲。限定技，濒死时回复三点体力。",
                },
            },
            "云游四海_longyi1":{
                audio:"ext:清瑶葭绮/members/云游四海2",
                trigger:{
                    source:"recoverEnd",
                },
                direct:true,
                filter:function(event,player){
        return (event.player&&event.player.countGainableCards(player,'he')&&event.num>0&&event.player!=player);
    },
                content:function(){
        "step 0"
        event.count--;
        player.gainPlayerCard(get.prompt('云游四海_longyi1',trigger.player),trigger.player,get.buttonValue,'he').set('logSkill',['云游四海_longyi1',trigger.player]);
        "step 1"
        if(result.bool&&event.count>0&&trigger.player.countGainableCards(player,'he')>0) event.goto(1);
    },
                group:"云游四海_longyi",
                ai:{
                    "maixie_defend":true,
                    effect:{
                        target:function(card,player,target){
                if(player.countCards('he')>1&&get.tag(card,'damage')){
                    if(player.hasSkillTag('jueqing',false,target)) return [1,-1.5];
                    if(get.attitude(target,player)<0) return [1,1];
                }
            },
                    },
                },
            },
            "云游四海_longyi":{
                audio:"ext:清瑶葭绮/members/云游四海:2",
                trigger:{
                    player:"recoverEnd",
                },
                forced:true,
                filter:function(event,player){
        return (event.source&&event.source.countGainableCards(player,'he')&&event.num>0&&event.source!=player);
    },
                content:function(){
        "step 0"
        event.count--;
        player.gainPlayerCard(get.prompt('云游四海_longyi',trigger.source),trigger.source,get.buttonValue,'he').set('logSkill',['云游四海_longyi',trigger.source]);
        "step 1"
        if(result.bool&&event.count>0&&trigger.source.countGainableCards(player,'he')>0) event.goto(1);
    },
                ai:{
                    "maixie_defend":true,
                    effect:{
                        target:function(card,player,target){
                if(player.countCards('he')>1&&get.tag(card,'damage')){
                    if(player.hasSkillTag('jueqing',false,target)) return [1,-1.5];
                    if(get.attitude(target,player)<0) return [1,1];
                }
            },
                    },
                },
            },
            "云游四海_longlin":{
                audio:"ext:清瑶葭绮/members/云游四海:2",
                trigger:{
                    player:"damageBefore",
                },
                forced:true,
                usable:1,
                content:function(){
        trigger.num--;
        player.discardPlayerCard(trigger.player,'he',true);
    },
            },
            "云游四海_longxi":{
                audio:"ext:清瑶葭绮/members/云游四海:2",
                trigger:{
                    player:"phaseAfter",
                },
                direct:true,
                content:function(){
        'step 0'
        player.chooseTarget(get.prompt('云游四海_longxi'),function(card,player,target){
            return target!=player;
        });
        'step 1'
        if(result.bool){
            player.logSkill('云游四海_longxi',result.targets);
            result.targets[0].damage('fire');
            player.discardPlayerCard(trigger.player,'he',true);
            player.draw();
        }
    },
            },
            "云游四海_chounuo":{
                audio:"ext:清瑶葭绮/members/云游四海:2",
                trigger:{
                    player:"dieBefore",
                },
                forced:true,
                content:function(){
        trigger.cancel();
        player.reinit('云游四海_gaolu','云游四海_shichouzhilong');
        player.recover(3);
    },
            },
            "云游四海_chicheng":{
                trigger:{
                    source:"damageBegin",
                },
                forced:true,
                filter:function(event,player){
        return event.player.hp<player.hp;
    },
                content:function(){
        trigger.num++;
    },
                mod:{
                    globalFrom:function(from,to,distance){
            return distance-3;
        },
                },
                ai:{
                    noturn:true,
                },
            },
            "云游四海_hongyan1":{
                audio:"ext:清瑶葭绮/members/云游四海:2",
                trigger:{
                    player:"recoverBegin",
                },
                direct:true,
                content:function(){
        'step 0'
        player.chooseTarget(get.prompt('云游四海_hongya1'),'令一名其他角色回复等量的体力',function(card,player,target){
            return target!=player;
        });
        'step 1'
        if(result.bool){
            player.logSkill('云游四海_hongyan1',result.targets);
            result.targets[0].recover(trigger.num);
            trigger.num--;
        }
    },
            },
            "云游四海_hongyan":{
                audio:"ext:清瑶葭绮/members/云游四海:2",
                trigger:{
                    player:"drawBegin",
                },
                direct:true,
                content:function(){
        'step 0'
        player.chooseTarget(get.prompt('云游四海_hongyan'),'令一名其他角色摸等量的牌',function(card,player,target){
            return target!=player;
        });
        'step 1'
        if(result.bool){
            player.logSkill('云游四海_hongyan',result.targets);
            result.targets[0].draw(trigger.num);
            trigger.num--;
        }
    },
                group:"云游四海_hongyan1",
            },
            "云游四海_shutian":{
                trigger:{
                    player:"useCardAfter",
                },
                usable:2,
                check:function(event,player){
        var type=get.type(event.card);
        if(type!='equip') return false;
        if(event.card.name=='tiesuo') return false;
        return true;
    },
                content:function(){
        'step 0'
        player.chooseTarget(get.prompt('云游四海_shutian'),'令一名其他角色使用此牌',function(card,player,target){
            return target!=player;
        });
        'step 1'
        if(result.bool){
            player.logSkill('云游四海_shutian',result.targets);
            result.targets[0].useCard(trigger.card,(trigger._targets||trigger.targets).slice(0));;
            player.loseHp();
        }
    },
                ai:{
                    threaten:1.3,
                },
            },
            "云游四海_leijue":{
                audio:"ext:清瑶葭绮/members/云游四海:2",
                trigger:{
                    player:"useCard",
                },
                usable:2,
                content:function(){
        'step 0'
        trigger.cancel();
        'step 1'
        player.chooseTarget(get.prompt('云游四海_leijue'),'对一名其他角色造成一点雷属性伤害',function(card,player,target){
            return target!=player;
        });
        'step 2'
        if(result.bool){
            player.logSkill('云游四海_leijue',result.targets);
            result.targets[0].damage('thunder');
        }
    },
            },
        },
        translate:{
            "云游四海_yimao":"易貌",
            "云游四海_yimao_info":"受到伤害后，你可以选择一名角色，将形态转化为被选中角色并摸一张牌；结束阶段，你将形态转换为“波兰斯基”；准备阶段你可以将形态转换为“波兰斯基”。",
            "云游四海_xingzui":"行罪",
            "云游四海_xingzui_info":"当你即将摸牌时，你可以少摸一张并选择一名角色并对选中角色造成一点伤害，然后你回复一点体力。",
            "云游四海_buluan1":"布乱",
            "云游四海_buluan1_info":"",
            "云游四海_buluan":"布乱",
            "云游四海_buluan_info":"你可以跳过摸牌阶段，若如此做，本回合你可以指定一名角色，该角色进入混乱状态并令其获得【残】，然后与你进入/脱离铁锁状态，你流失一点体力。",
            "云游四海_duanyu":"断欲",
            "云游四海_duanyu_info":"锁定技，你始终跳过【判定阶段】【结束阶段】。",
            "云游四海_sihe":"饲鹤",
            "云游四海_sihe_info":"每回合限两次，使用牌时，你可以取消之并获得一枚【鹤】；锁定技，受到伤害时，你失去一枚【鹤】令伤害数值减一并获得伤害牌（若无则不获得）。",
            "云游四海_sihe1":"饲鹤",
            "云游四海_sihe1_info":"",
            "云游四海_qixi":"起戏",
            "云游四海_qixi_info":"出牌阶段即将开始时，你可以选择将形态转换为【书生】【道人】【将军】【美人】；游戏开始时，若为双将/国战模式，你将武将替换为【宋英杰】并获得技能【独唱】。",
            "云游四海_tuichang":"退场",
            "云游四海_tuichang_info":"准备阶段/阵亡时，你可以将形态转换为【宋英杰】。",
            "云游四海_qixi1":"起戏",
            "云游四海_qixi1_info":"",
            "云游四海_duchang":"独唱",
            "云游四海_duchang_info":"锁定技，你始终跳过【摸牌阶段】【判定阶段】，【结束阶段】结束后，你摸三张牌并回复一点体力。",
            "云游四海_duchang1":"独唱",
            "云游四海_duchang1_info":"",
            "云游四海_yimao2":"易貌",
            "云游四海_yimao2_info":"",
            "云游四海_buluan2":"布乱",
            "云游四海_buluan2_info":"",
            "云游四海_longyi1":"龙裔",
            "云游四海_longyi1_info":"锁定技，每当你令其他角色回复体力后，你获得目标角色的一张牌；锁定技，每当你回复体力后，你获得回复来源的一张牌。",
            "云游四海_longyi":"龙裔",
            "云游四海_longyi_info":"锁定技，每当你回复体力后，你获得回复来源的一张牌。",
            "云游四海_longlin":"龙鳞",
            "云游四海_longlin_info":"锁定技，每回合第一次即将受到伤害时，你令伤害数值减一，然后弃置自己一张牌（无牌则不弃）。",
            "云游四海_longxi":"龙息",
            "云游四海_longxi_info":"回合结束时，你选择一名其他角色造成一点火属性伤害，弃置自己一张牌（无牌则不弃）然后摸一张牌。",
            "云游四海_chounuo":"仇诺",
            "云游四海_chounuo_info":"锁定技，当你阵亡时，你将形态转换为誓仇之龙并回复三点体力。",
            "云游四海_chicheng":"驰骋",
            "云游四海_chicheng_info":"锁定技，你对体力值小于你的角色造成的伤害+1；你与其他角色距离-3。",
            "云游四海_hongyan1":"红颜",
            "云游四海_hongyan1_info":"",
            "云游四海_hongyan":"红颜",
            "云游四海_hongyan_info":"当你摸牌/回复体力时，你可以令一名其他角色摸/回复等量的牌/体力，然后你的摸牌/回复量减一。",
            "云游四海_shutian":"书天",
            "云游四海_shutian_info":"每轮限两次，你可以令你使用的牌由其他角色额外结算一次（目标不变），然后失去一点体力。",
            "云游四海_leijue":"雷绝",
            "云游四海_leijue_info":"每回合限两次，使用牌时，你可以取消之，对一名其他角色造成一点雷属性伤害。",
        },
    },
    intro:"",
    author:"天书庇佑",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["云游四海_piying_1.jpg","云游四海_piying_4.jpg","云游四海_piying_2.jpg","云游四海_songyingjie.jpg","云游四海_gaolu.jpg","云游四海_luxianhe.jpg","云游四海_shichouzhilong.jpg","云游四海_bolansiji.jpg","云游四海_piying_3.jpg"],"card":[],"skill":[]}}};
