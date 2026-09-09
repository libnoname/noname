import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"死神",content:function (config,pack){
    
},precontent:function (){
    
},help:{"死神拓展":"<ul type=\"circle\"><li>动漫主题的扩展包</li><li>由苍雪进行修复还原工作(≧▽≦)/</li><li>作者为kafkasea</li></ul>"},config:{},package:{
    character:{
        character:{
            "白一护":["male","shu",3,["ss天锁","ss斩月","ss连舞"],["des:是日本动漫《死神》里边的人物。在黑崎一护的体内，有三种力量-人性之力-一护、死神之力-斩月、而白一护，便是本能之力。"]],
            "更木剑八":["male","qun",5,["ss剑压","ss剑道","ss封印"],["des:更木剑八是久保带人的少年漫画《死神》中护庭十三队十一番队队长，第十一代剑八。 更木剑八是尸魂界第一位不懂\"卍解\"的队长。战斗就是他的乐趣，并且为了让对手有利而戴上会吸收灵力的眼罩，还在头发里编上铃铛。  在尸魂界篇曾和一护厮杀，双方重伤倒地，认为是一护胜利。在虚圈时使出双手剑道击败诺伊特拉，后与白哉一起轻松击败牙密。在千年血战篇中成功解放斩魄刀，击败了\"V\"葛雷密·托谬。"]],
            "黑翼大魔":["male","wu",5,["ss再生","ss尾鞭","ss雷霆","ss响转"],["des:是日本漫画家久保带人作品《死神》中的人物乌尔奇奥拉一段归刃的解放状态。此状态会延伸出翅膀使自己的移动速度加快，从而也能产生巨大的范围性攻击。"]],
            "巧木白哉":["male","wei",4,["ss千本樱","ss无伤"],["des:日本漫画家久保带人作品《BLEACH》中的人物。是护庭十三队之六番队队长，四大贵族之一朽木家的第二十八代当家，同时也是十三番队副队长朽木露琪亚的义兄。总是冷静彻底思考问题的他，实际上，是非常重视感情的人(标准的外冷内热)。"]],
            "碎蜂":["female","shu",3,["ss雀蜂雷","ss蜂纹华","ss机动"],["des:碎蜂是日本漫画家久保带人作品《死神》中的人物。护廷十三队二番队队长兼隐密机动总司令官及第一分队\"刑军\"团长、女性死神协会理事。崇拜四枫院夜一。"]],
            "涅茧利":["male","wei",3,["ss监视","ss科研","ss毒素"],["des:《死神》中的主要人物之一，护廷十三队十二番队队长、第二代技术开发局局长，头饰随着剧情进展而变化。将自己的身体改造成各样隐密的武器及装置，例如在耳内藏着镰刀、随身携带令肉体再生的药等等，与其他队长不同，性格怪异，有\"疯狂科学家\"的典型心理状况，在任技术开发局局长期内对尸魂界有重大的贡献。  基本信息"]],
            "薛定谔准尉":["male","qun",4,["ss无处不在","ss薛定谔的喵","ss虚无"],[]],
            "上校":["male","qun",3,["ss战争狂","ss观战"],[]],
            "平子真子":["female","wu",4,["ss逆扶","ss洞察"],["des:平子真子，日本动漫作品《BLEACH》里的角色，为假面军团中的队长。"]],
            "萨尔阿波罗":["male","wei",3,["ss人偶支配","ss受胎告知"],["des:萨尔阿波罗·格兰兹(ザエルアポロ·グランツ)，日本动漫久保带人的作品《死神》中的人物。\"破面十刃\"一员，号码为NO.8，象征死亡方式是疯狂。粉色短发，金色瞳孔，有明显的下睫毛，是从初期就存在的十刃。在一护进入虚圈营救井上的时候被赶来的涅茧利杀死，身体被做成标本。"]],
            "井上织姬":["female","shu",3,["ss遁舜六花","biyue"],["des:井上织姬(Inoue Orihime)是日本动漫《死神》中的主角之一。性格单纯可爱、天然呆又无厘头，总有很多奇思异想，是一个喜好和平的女孩，也总是能给人带来轻松和笑声。能力是头上发夹中的\"盾舜六花\"，通常用做防御术和修复术，因为她的存在，才能使黑崎一护一行人很快从战斗中恢复，喜欢黑崎一护并对他暗暗许下\"五世只爱君一人\"的感人誓言，为了保护和支持一户而在不断努力修行，提高自己。  在千年血战中织姬通过了浦原喜助的修行，能力大幅度提升。并在大决战中通过月岛秀九郎的帮助成功修复了一护的天锁斩月，使得一护与同伴最终打败了友哈巴赫，成功的解救了尸魂界、现世和虚圈。十年后织姬与一护喜结连理并育有一子，名为黑崎一勇。"]],
            "蓝染惣右介":["male","wu",4,["ss镜花水月","ss幻象"],["des:蓝染惣右介（あいぜん そうすけ Aizen Sousuke）是日本漫画《BLEACH》中的登场人物。在音乐剧中扮演此角色的演员是大口兼悟。"]],
            "诺伊特拉":["male","wei",4,["ss钢皮","ss圣哭螳螂"],["des:诺伊特拉全名是诺伊特拉·吉尔加，是久保带人漫画《死神》中的角色。在十刃中属于不折不扣的战斗狂人，且无论对手是谁，对手处于什么状态都从不手下留情。在一护打败葛力姆乔后插手，差点要了主角的命。后与十一番队队长更木剑八交手，并使出解放状态，可惜也不敌使出双手剑“剑道”后的剑八，最终倒在了剑八的刀下"]],
            "葛力姆乔":["male","wei",4,["ss豹王之爪"],["des:葛力姆乔·贾卡杰克是日本漫画家久保带人作品《死神》中的人物。葛力姆乔·贾卡杰克为《死神》中十刃中的六刃，实力非常强大，特别是攻击力上极为惊人。解放语为“吱嘎作响吧，豹王！”招数为“豹王之爪”，能够释放“王虚的闪光”。在与黑崎一护的战斗中战败，之后为诺伊特拉所重创，但已生还。在动画中的声优为诹访部顺一。"]],
            "埼玉":["male","qun",4,["ss一击必杀"],["des:漫画《一拳超人》/《一击男》主人公，英雄名:秃头披风侠。拥有着无法估量的强大实力，战斗力远超目前作品中正式登场的其他所有英雄和怪人。学生时代因为自己的弱小而对自己的未来产生了怀疑。进入社会后，一度陷入失业的颓废状态中，但在对螃蟹人的战斗中，找到了成为英雄的趣味所在而开始努力锻炼身体(每天100下俯卧撑、100下仰卧起坐、10公里跑)，并在锻炼身体的过程中击败各式各样的怪人。最终，埼玉拥有了超乎常理的力量，作为代价他失去了很多(比如很多感情，做事的激情以及头发)。  One版本截止103话，英雄排名为A级39位;村田版本截止81话，英雄排名为B级7位。  埼玉老师是杰诺斯以及网友对其的常用称呼"]],
            "草稚素子":["female","qun",3,["ss侵入"],["des:草薙素子，日本漫画人物，攻壳机动队队长，具备正确的判断力与冷静敏捷的行动力的女性改造生化人。"]],
            "茶渡泰虎":["male","shu",4,["ss恶魔左臂","ss巨人右臂"],["des:身高接近2米的一护的巨人同班同学，同时也是一护的国中同学。拥有被掉下的钢板压到或者和摩托车正面冲突都只受轻伤的无敌不死之身。一直对自己拥有和常人不同的身体抱有疑问，不过，由于一直在一护的身边的缘故，自己身体的秘密的答案也越来越显现出来了。在跟虚的战斗中隐藏了的能力被发动了。喜欢小动物，还很珍惜脖子上的项链，是他爷爷的遗物。  在第一次进入尸魂界时，右手的一部分力量被引发（进入虚圈后，和No.107破面刚腾拜恩·莫司克达战斗时被完全引发，成盾牌形）。在虚圈和一护他们一起去救井上时，左手的恶魔盾牌也被引发。攻击力还在为增强之中。  在一护封印蓝染两万年后，成为一个现世灵力组织的成员。并在一护无法激发死神之力之时提醒了他要想起自己的荣誉，帮助他启动了代理死神的证明。  茶渡·泰虎是一个强悍得令人惧怕的男人。他可以被钢筋压到仍然丝毫无损、被摩托车撞到反倒是司机受伤了、遭虚袭击仍然死不了．．．总括而言，他是一个打不死的铁人。然而，一个如此厉害的人，却从不和别人打架，即使遭到挑衅也绝不还手——一切只因他那个隐藏在强大背后的沉重故事。"]],
            "京乐春水":["male","qun",4,["ss五鬼","ss影送"],["des:京乐春水，久保带人作品《死神》中的人物，尸魂界护廷十三队中的前任八番队队长，左右手都擅使长刀和短刀。真央灵术院毕业生中，最先当上队长的，与浮竹十四郎同为山本总队长的爱徒，也是担任队长一职时间最久的四位队长之一。在山本元柳斋重国战死后，接替他总队长一职。"]],
            "猿柿日世里":["female","qun",3,["ss馘蛇"],["des:猿柿日世里 日本漫画家久保带人作品《死神-BLEACH》中的人物角色，是原尸魂界的十二番队副队长（原十二番队队长是浦原喜助），后遭蓝染阴谋暗算，被迫前往现世，和前五番队队长平子真子一起成为假面军团的领袖之一。"]],
            "东仙要":["male","qun",3,["ss阎魔","ss蟋蟀"],["des:东仙要，日本漫画家久保带人作品《死神》的人物，原护庭十三队九番队队长，为了复仇而成为死神，跟随蓝染惣右介背叛了尸魂界，曾因葛力姆乔擅自行动而砍下葛力姆乔的手臂，在进攻现实的时候，被狛村左阵和桧佐木修兵击败，被蓝染杀死。"]],
            "市丸银":["male","wei",4,["ss神枪","ss毒刃","ss千转白蛇"],["des:日本动漫《死神》中的角色。原瀞灵廷三番队队长。与十番队副队长松本乱菊是青梅竹马的关系并且相互喜欢。携带武器为斩魄刀---神枪。不过仅用一年就从真央灵术院毕业以及幼年展露出来的超人天赋实力可见一斑。幼年就跟随蓝染身边，后蓝染叛变，于是跟随蓝染以及东仙三人叛逃至虚圈。而多年的奔走追随实则是为了夺走乱菊幼时被夺走之物以及自己的一厢情愿，后在刺杀蓝染中由于意料之外的变故导致计划失败，被蓝染洞穿胸口，在乱菊怀中死去。"]],
            "狛村左阵":["male","wu",5,["ss黑绳天谴明王"],["des:日本动漫《死神》中的角色，护廷十三队七番队队长，是非人类灵魂转变成死神的成员。曾因自己的外形而受旁人的歧视与排斥，后被护廷十三队总队长山本元柳斋重国收留栽培，为了报答山本元柳斋重国而努力修行成为七番队队长。在千年血战中首次使用\"人化之术\"变身为半兽人，以强大的力量击败了星十字骑士团成员邦比爱塔·芭丝塔拜姻。"]],
            "黑绳天谴明王":["male","wu",12,["ss天谴","ss佑护"],["des:黑绳天谴明王，形如凶猛武士状，手持钢刀面戴头盔。  而其身世，与佛教有些联系。  天谴卍解之后，斩魄刀本体会巨大化，出现巨大的持刀明王。  若明王收到伤害，其主人亦会收到同等伤害。  初登场:148.Countdown to The End: 2 (Lady Lennon~Frankenstein)  日本鬼神文化中的一个强大的武神  漫画384话再次登场  根据名字分析:在地狱分八寒地狱与八热地狱，大红莲为八寒地狱之最后一层也是最寒一层，所以冰轮丸是冰水系最强的斩魂刀。而黑绳属于八热地狱，全名是:黑绳狱 描述为\"地狱中的人被狱卒先以黑绳在身上弹划，再以斧等斩锯。\"  天谴:通常说的是不道德，违反天理，会被上天惩罚。  明王:明王在佛教中的身份就是佛的\"忿化身\"。俗话说:佛都有火，佛一旦发火后会怎样呢?那就是变身。每个佛都有个对应的\"忿化身\"，如弥勒佛的\"忿化身\"是无能胜明王，大日如来的\"忿化身\"是中央不动尊明王等。  黑绳天谴明王 应该是炎热系的斩魂刀这个大家应该都没意见，但是从狛村无数次万解可看出，从来没有显现出它的斩魂刀有跟火有关的招试，他应该也是隐瞒了自己刀的一些能力。"]],
            "拜勒岗":["male","wei",4,["ss腐朽","ss叹息"],["des:拜勒岗·鲁伊森邦，日本久保带人《死神》\"十刃\"之中的NO.2，手下从属官称其为\"陛下\"，并且其从属官的实力比其他十刃的从属官相比要强出许多。武器是一把巨大的双刃斧，名字含义是众神之王。原虚圈的统治者，在现世之战中死于自己的无敌能力之下。"]],
            "暗黑露琪亚":["female","qun",3,["ss暗月","ss记忆切割","ss虚化"],["des:黑暗露琪亚，源自日本动漫死神的剧场版3《呼唤君之名:永别了!露琪亚!》。露琪亚被一对少年姐弟用虚的能力除去了记忆，被其强行合体后化身为黑暗化的露琪亚。黑暗露琪亚拥有强大的力量，武器为巨大的黑色镰刀。"]],
            "崩玉·蓝染":["male","wei",4,["ss超速再生","ss究极辐射波"],[]],
            "浮竹十四郎":["male","wu",4,["ss虚弱","ss双鱼理"],["des:浮竹十四郎，十三番队队长，也是“真央灵术院”创校以来的第一任队长。下级贵族浮竹家长子，有7名兄弟姐妹。五个弟弟，两个妹妹。亲属大致上的生活都是靠他独立养活，很孝顺。 为人和善而且本事高强，所以他队里的队员都很崇拜他。一出生就患肺病，因此经常都躺着。年幼时第一次肺病发作时，让他三天内就白了头发。因此满头白发、身体虚弱。"]],
        },
        translate:{
            "白一护":"白一护",
            "更木剑八":"更木剑八",
            "黑翼大魔":"黑翼大魔",
            "巧木白哉":"巧木白哉",
            "碎蜂":"碎蜂",
            "涅茧利":"涅茧利",
            "薛定谔准尉":"薛定谔准尉",
            "上校":"上校",
            "平子真子":"平子真子",
            "萨尔阿波罗":"萨尔阿波罗",
            "井上织姬":"井上织姬",
            "蓝染惣右介":"蓝染惣右介",
            "诺伊特拉":"诺伊特拉",
            "葛力姆乔":"葛力姆乔",
            "埼玉":"埼玉",
            "草稚素子":"草稚素子",
            "茶渡泰虎":"茶渡泰虎",
            "京乐春水":"京乐春水",
            "猿柿日世里":"猿柿日世里",
            "东仙要":"东仙要",
            "市丸银":"市丸银",
            "狛村左阵":"狛村左阵",
            "黑绳天谴明王":"黑绳天谴明王",
            "拜勒岗":"拜勒岗",
            "暗黑露琪亚":"暗黑露琪亚",
            "崩玉·蓝染":"崩玉·蓝染",
            "浮竹十四郎":"浮竹十四郎",
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
            "ss天锁":{
                enable:"phaseUse",
                usable:1,
                filter:function (event,player){
return player.num('h',{type:'trick'})>0||player.num('h',{type:'equip'})>0||player.num('h',{type:'delay'})>0;
},
                filterCard:function (card){
return get.type(card)!=`basic`;
},
                viewAs:{
                    name:"tiesuo",
                },
                prompt:"将一张非基本牌当铁锁连环使用",
                ai:{
                    wuxie:function (){
                        if(Math.random()<0.5) return 0;
                    },
                    basic:{
                        useful:4,
                        value:4,
                        order:7,
                    },
                    result:{
                        target:function (player,target){
                            if(target.isLinked()) return 1;
                            if(get.attitude(player,target)>=0) return -1;
                            if(ui.selected.targets.length) return -1;
                            if(game.hasPlayer(function(current){
                                return get.attitude(player,current)<=-1&&current!=target&&!current.isLinked();
                            })){
                                return -1;
                            }
                            return 0;
                        },
                    },
                    tag:{
                        multitarget:1,
                        multineg:1,
                        norepeat:1,
                    },
                },
            },
            "ss斩月":{
                trigger:{
                    player:"useCardToBefore",
                },
                priority:100,
                forced:true,
                filter:function (event,player){
if(event.card.name=='sha'&&!event.card.nature) return true;
},
                check:function (event,player){
var att=ai.get.attitude(player,event.target);
if(event.target.hasSkillTag('nofire')){
return att>0;
}
return att<=0;
},
                content:function (){
trigger.card.nature='fire';
},
            },
            "ss连舞":{
                trigger:{
                    player:"phaseDiscardAfter",
                },
                frequent:true,
                filter:function (event,player){
return player.num('h')<2;
},
                content:function (){
event.num=event.num=Math.ceil(player.maxHp-player.hp+1);
player.draw(event.num);
},
            },
            "ss剑压":{
                group:["ss剑压_xxx","ss剑压_yyy","ss剑压_zzz"],
                subSkill:{
                    xxx:{
                        trigger:{
                            global:"gameStart",
                        },
                        popup:false,
                        forced:true,
                        content:function (){
player.storage.ss剑压=0;
},
                    },
                    yyy:{
                        trigger:{
                            player:"phaseBegin",
                        },
                        forced:true,
                        silent:true,
                        content:function (){
player.storage.ss剑压++;
},
                        popup:false,
                    },
                    zzz:{
                        trigger:{
                            source:"damageBegin",
                        },
                        forced:true,
                        filter:function (event,player){
return event.card&&event.card.name=='sha';
},
                        content:function (){
trigger.num+=Math.floor((player.storage.ss剑压)/3);
},
                    },
                },
            },
            "ss剑道":{
                trigger:{
                    player:"useCardToBefore",
                },
                priority:100,
                filter:function (event,player,target){
return event.card&&event.card.name=='sha'&&event.target.get('e',{subtype:'equip2'}).length>0&&event.target.get('e',{subtype:'equip2'})&&player.num('he')>0;
},
                content:function (){
"step 0"
player.chooseToDiscard('he');
"step 1"
if(result.bool){
player.addTempSkill('unequip','useCardAfter');
}
},
            },
            "ss封印":{
                group:["ss封印_jianba1","ss封印_jianba2"],
                subSkill:{
                    "jianba1":{
                        mod:{
                            cardEnabled:function (card,player){
if(get.subtype(card,'equip')=='equip2'||get.subtype(card,'equip')=='equip3') return false;
},
                            cardSavable:function (card,player){
if(get.subtype(card,'equip')=='equip2'||get.subtype(card,'equip')=='equip3') return false;
},
                        },
                    },
                    "jianba2":{
                        mod:{
                            globalFrom:function (from,to,distance){
return distance-1;
},
                        },
                    },
                },
            },
            "ss再生":{
                trigger:{
                    player:"phaseDrawBefore",
                },
                filter:function (event,player){
return player.hp<player.maxHp;
},
                check:function (event,player){
if(player.maxHp-player.hp<2){
return false;
}
else if(player.maxHp-player.hp==2){
return player.num('h')>=2;
}
return true;
},
                content:function (){
"step 0"
trigger.untrigger();
trigger.finish();
event.cards=get.cards(player.maxHp-player.hp);
player.showCards(event.cards);
"step 1"
var num=0;
for(var i=0;i<event.cards.length;i++){
if(get.color(event.cards[i])=='red'){
num++;
ui.discardPile.appendChild(event.cards[i]);
event.cards.splice(i--,1);
}
}
if(num){
player.recover(num);
}
"step 2"
if(event.cards.length){
player.gain(event.cards);
player.$gain2(event.cards);
game.delay();
}
},
                ai:{
                    threaten:function (player,target){
if(target.hp==1) return 2;
if(target.hp==2) return 1.5;
return 1;
},
                },
            },
            "ss尾鞭":{
                enable:"phaseUse",
                position:"he",
                usable:1,
                filterTarget:function (card,player,target){
return player!=target&&player.previous!=target;
},
                filterCard:{
                    color:"black",
                },
                content:function (){
game.swapSeat(target,player,true,true);
},
            },
            "ss雷霆":{
                group:["ss雷霆_kkkk1","ss雷霆_kkkk2"],
                subSkill:{
                    "kkkk1":{
                        trigger:{
                            player:"useCardToBefore",
                        },
                        priority:100,
                        forced:true,
                        filter:function (event,player){
if(event.card.name=='sha'&&!event.card.nature) return true;
},
                        check:function (event,player){
var att=ai.get.attitude(player,event.target);
if(event.target.hasSkillTag('nothunder')){
return att>0;
}
return att<=0;
},
                        content:function (){
trigger.card.nature='thunder';
},
                    },
                    "kkkk2":{
                        trigger:{
                            source:"damageBegin",
                        },
                        filter:function (event){
return event.card&&(event.card.name=='sha')&&
event.parent.name!='_lianhuan'&&event.parent.name!='_lianhuan2';
},
                        forced:true,
                        content:function (){
"step 0"
player.judge(function(card){
if(get.suit(card)=='heart') return 2;
return 1;
})
"step 1"
if(result.judge==1){
trigger.num++
}
else{
if(result.judge==2){
trigger.num--;
}
}
},
                    },
                },
            },
            "ss响转":{
                group:["ss响转_fuck1","ss响转_fuck2"],
                subSkill:{
                    "fuck1":{
                        trigger:{
                            player:"shaBefore",
                        },
                        priority:20,
                        forced:true,
                        filter:function (event,player){
return get.distance(player,event.target)<=1;
},
                        content:function (){
player.addTempSkill('unequip','useCardAfter'
);
},
                    },
                    "fuck2":{
                        mod:{
                            globalFrom:function (from,to,distance){
return distance-1;
},
                        },
                    },
                },
            },
            "ss千本樱":{
                nobracket:true,
                enable:"phaseUse",
                usable:1,
                filter:function (card,player,target){
return player.num('he',{subtype:'equip1'})>0;
},
                filterTarget:function (card,player,target){
return player!=target;
},
                filterCard:function (card){
return get.subtype(card)=='equip1';
},
                selectCard:1,
                position:"he",
                check:function (){return -1},
                selectTarget:function (card){
if(ui.selected.cards.length){
var card=ui.selected.cards[0];
if(card.name=='zhuge') return 1;
if(card.name=='chilongya'||card.name=='guiyanfadao'||card.name=='fengxueren'||card.name=='hanbing'||card.name=='guding'||card.name=='wuliu'||card.name=='cixiong'||card.name=='qinggang') return [1,2];
if(card.name=='sanjian'||card.name=='qinglong'||card.name=='guanshi'||card.name=='zhangba') return [1,3];
if(card.name=='zhuque'||card.name=='pangfugu'||card.name=='fangtian') return [1,4];
if(card.name=='qilin') return [1,5];
if(card.name=='xuanyuanjian') return [1,Infinity];
}
},
                content:function (){
"step 0"
target.judge();
"step 1"
var suit=get.suit(cards[0]);
if(result.suit!=suit){
target.loseHp();
};
},
            },
            "ss无伤":{
                group:["ss无伤_fuck1","ss无伤_fuck2"],
                subSkill:{
                    "fuck1":{
                        enable:["chooseToUse","chooseToRespond"],
                        prompt:"将一张梅花牌当杀使用或打出",
                        position:"he",
                        check:function (card,event){
if(_status.event.player.hp>1) return 0;
return 10-ai.get.value(card);
},
                        viewAsFilter:function (player){
if(!player.num('he',{suit:'club'})) return false;
},
                        selectCard:1,
                        viewAs:{
                            name:"sha",
                        },
                        filterCard:function (card){
return get.suit(card)=='club';
},
                        ai:{
                            respondSha:true,
                            skillTagFilter:function (player){
if(!player.num('he',{suit:'club'})) return false;
},
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
                    "fuck2":{
                        enable:["chooseToRespond"],
                        filterCard:function (card){
return get.suit(card)=='club';
},
                        position:"he",
                        viewAs:{
                            name:"shan",
                        },
                        viewAsFilter:function (player){
if(!player.num('he',{suit:'club'})) return false;
},
                        prompt:"将一张梅花牌当闪打出",
                        check:function (){return 1},
                        ai:{
                            respondShan:true,
                            skillTagFilter:function (player){
if(!player.num('he',{suit:'club'})) return false;
},
                            basic:{
                                useful:[7,2],
                                value:[7,2],
                            },
                        },
                    },
                },
            },
            "ss雀蜂雷":{
                nobracket:true,
                enable:"phaseUse",
                skillAnimation:true,
                unique:true,
                filter:function (event,player){
return player.num('h')>0&&!player.storage.ss雀蜂雷;
},
                filterTarget:function (card,player,target){
return player!=target;
},
                content:function (){
"step 0"
player.discard(player.get('h'));
target.damage(2);
"step 1"
player.loseHp();
player.storage.ss雀蜂雷=true;
},
                intro:{
                    content:"limited",
                },
            },
            "ss蜂纹华":{
                nobracket:true,
                group:["ss蜂纹华_fuck1","ss蜂纹华_fuck2"],
                subSkill:{
                    "fuck1":{
                        trigger:{
                            source:"damageEnd",
                        },
                        forced:true,
                        filter:function (event,player){
return event.card&&event.card.name=='sha'&&event.player.classList.contains('dead')==false&&!event.player.storage.蜂纹;
},
                        priority:50,
                        content:function (){
"step 0"
trigger.player.judge();
"step 1"
if(result.suit=='heart'){
trigger.player.storage.蜂纹=1;
trigger.player.mark('❖',{
name:'蜂纹',
content:'已发动 标记为♠'});
};
if(result.suit=='diamond'){
trigger.player.storage.蜂纹=2;
trigger.player.mark('❖',{
name:'蜂纹',
content:'已发动 标记为♦'});
};
if(result.suit=='club'){
trigger.player.storage.蜂纹=3;
trigger.player.mark('❖',{
name:'蜂纹',
content:'已发动 标记为♣'});
};
if(result.suit=='spade'){
trigger.player.storage.蜂纹=4;
trigger.player.mark('❖',{
name:'蜂纹',
content:'已发动 标记为♠'});
};
},
                    },
                    "fuck2":{
                        trigger:{
                            player:"shaBegin",
                        },
                        forced:true,
                        filter:function (event,player){
return event.target.storage.蜂纹;
},
                        priority:50,
                        content:function (){
"step 0"
trigger.target.judge();
"step 1"
if((trigger.target.storage.蜂纹==1&&result.suit=='heart')||(trigger.target.storage.蜂纹==2&&result.suit=='diamond')||(trigger.target.storage.蜂纹==3&&result.suit=='club')||(trigger.target.storage.蜂纹==4&&result.suit=='spade')){
trigger.target.loseHp(2);
}
else{
player.draw();
}
},
                    },
                },
            },
            "ss机动":{
                mod:{
                    globalFrom:function (from,to,current){
return current-(from.maxHp-from.hp);
},
                },
            },
            "ss监视":{
                enable:"phaseUse",
                usable:1,
                filterTarget:function (card,player,target){
return target!=player&&target.num('he');
},
                content:function (){
"step 0"
player.chooseCardButton(target,target.get('he'))
"step 1"
if(result.bool){
var card2=result.links[0];
var card=game.createCard(card2.name,card2.suit,card2.number);
ui.cardPile.insertBefore(card,ui.cardPile.firstChild);
game.log(player,'将',card,'置于牌堆顶');
game.delay(2);
}
},
            },
            "ss科研":{
                enable:"phaseUse",
                usable:1,
                filter:function (event,player){
return player.num('he')>1;
},
                position:"he",
                filterCard:true,
                selectCard:2,
                content:function (){
player.draw();
},
            },
            "ss毒素":{
                enable:"phaseUse",
                usable:1,
                discard:false,
                prepare:function (cards,player,targets){
player.$give(1,targets[0]);
},
                filter:function (event,player){
return player.num('h')>0;
},
                filterTarget:function (card,player,target){
if(player==target) return false;
return true;
},
                position:"h",
                filterCard:true,
                selectCard:1,
                check:function (card){
if(get.owner(card).num('h')<get.owner(card).hp) return 0;
return 4-ai.get.value(card);
},
                content:function (){
var color=get.color(cards);
target.gain(cards);
target.storage.qianxi2=color;
target.addSkill('qianxi2');
game.delay();
},
            },
            "ss无处不在":{
                nobracket:true,
                trigger:{
                    player:["phaseEnd","phaseBegin"],
                },
                direct:true,
                filter:function (event,player){
return game.players.length>2;
},
                content:function (){
"step 0"
player.chooseTarget('是否发动【无处不在】？',function(card,player,target){
return player!=target;
},1)
"step 1"
if(result.bool){
player.line(result.targets[0]);
game.delayx();
game.swapSeat(player,result.targets[0]);
}
},
            },
            "ss薛定谔的喵":{
                nobracket:true,
                group:["ss薛定谔的喵_fuck1","ss薛定谔的喵_fuck2"],
                subSkill:{
                    "fuck1":{
                        trigger:{
                            player:["dieBegin","damageBefore"],
                        },
                        forced:true,
                        popup:false,
                        content:function (){
if(trigger.name=='die'){
if(Math.random()>1/2){
player.revive();
player.popup('我回来啦喵');
player.maxHp=0;
player.update();
trigger.untrigger();
trigger.finish();
game.log(player,'又回来了！！！');
}
else{
player.popup('再见～喵≡￣﹏￣≡');
game.log('那么可爱的',player,'竟然被打死了，好可怜～')
}
};
if(trigger.name=='damage'){
if(Math.random()>1/2){
player.popup('没打到喵');
trigger.untrigger();
trigger.finish();
game.log(player,'跑掉了！！！');
}
else{
player.popup('好疼喵TAT');
game.log(trigger.source,'打中了',player,'！！！')
}
}
},
                    },
                    "fuck2":{
                        trigger:{
                            target:"useCardToBefore",
                        },
                        forced:true,
                        popup:false,
                        filter:function (event,player){
return event.card&&event.player!=player;
},
                        content:function (){
if(Math.random()>1/2){
trigger.target.popup('喵～');
game.log(trigger.player,'失误了！！！');
trigger.untrigger();
trigger.finish();
}
else{
player.popup('Ծ‸Ծ');
game.log(trigger.player,'捕获了一只',player,'！！！');
}
},
                    },
                },
            },
            "ss虚无":{
                trigger:{
                    global:"gameStart",
                    player:"gainMaxHpEnd",
                },
                priority:-9,
                forced:true,
                popup:false,
                content:function (){
player.maxHp=0;
player.update();
},
            },
            "ss战争狂":{
                nobracket:true,
                trigger:{
                    global:"damageAfter",
                },
                forced:true,
                priority:100,
                filter:function (event,player){
return event.source!=undefined;
},
                content:function (){
if(player!=trigger.source){
player.draw();
trigger.source.draw();
}
else{
player.draw();
};
game.log(player,'诸君，我喜欢战争！');
},
            },
            "ss观战":{
                mod:{
                    globalTo:function (from,to,distance){
return distance+1;
},
                },
            },
            "ss逆扶":{
                group:["ss逆抚_fff1","ss逆抚_fff2","ss逆抚_fff3"],
                subSkill:{
                    "fff1":{
                        trigger:{
                            player:"shaBegin",
                        },
                        forced:true,
                        content:function (){
"step 0"
var next=trigger.target.chooseToRespond({name:'sha'});
next.autochoose=lib.filter.autoRespondSha;
next.ai=function(card){
if(trigger.target.num('h','sha')>0){
return ai.get.unuseful2(card);
}
return -1;
};
"step 1"
if(result.bool==false){
trigger.untrigger();
trigger.directHit=true;
}
else{
trigger.trigger('shaMiss');
trigger.finish();
trigger.result={bool:false}
trigger.trigger('shaUnhirt');
};
},
                    },
                    "fff2":{
                        trigger:{
                            player:"juedou",
                            target:"juedou",
                        },
                        forced:true,
                        filter:function (event,player){
return event.turn!=player;
},
                        content:function (){
"step 0"
var next=trigger.turn.chooseToRespond({name:'shan'});
next.autochoose=lib.filter.autoRespondShan;
next.ai=function(card){
if(ai.get.attitude(trigger.turn,player)<0&&trigger.turn.num('h','shan')>0){
return ai.get.unuseful2(card);
}
return -1;
};
"step 1"
if(result.bool==false){
trigger.directHit=true;
}
else{
trigger.turn=player;
};
},
                        ai:{
                            result:{
                                target:function (card,player,target){
if(card.name=='juedou'&&target.num('h')>0) return [1,0,0,-1];
},
                            },
                        },
                    },
                    "fff3":{
                        trigger:{
                            player:"useCard",
                        },
                        direct:true,
                        filter:function (event,player){
return event.targets&&(event.card.name=='sha'||event.card.name=='juedou');
},
                        content:function (){
"step 0"
player.chooseCard('是否发动逆抚','he').ai=function(card){
return -ai.get.value(card);
};
"step 1"
if(result.bool){
trigger.targets[0].gain(result.cards[0]);
player.$give(1,trigger.targets[0]);
}
else{
event.finish();
}
"step 2"
player.choosePlayerCard(trigger.targets[0],ai.get.buttonValue,'hej',true);
"step 3"
player.gain(result.buttons[0].link);
trigger.targets[0].$give(1,player);
},
                    },
                },
            },
            "ss洞察":{
                group:["ss洞察_fff1","ss洞察_fff3"],
                subSkill:{
                    "fff1":{
                        trigger:{
                            player:"useCard",
                        },
                        forced:true,
                        popup:false,
                        filter:function (event,player){
return get.type(event.card)=='trick';
},
                        content:function (){
player.removeSkill('ss洞察_fff2');
},
                    },
                    "fff2":{
                        trigger:{
                            player:"phaseDiscardBefore",
                        },
                        forced:true,
                        content:function (){
trigger.untrigger();
trigger.finish();
},
                    },
                    "fff3":{
                        trigger:{
                            player:"phaseBefore",
                        },
                        forced:true,
                        popup:false,
                        content:function (){
player.addSkill('ss洞察_fff2');
},
                    },
                },
            },
            "ss人偶支配":{
                nobracket:true,
                group:["ss人偶支配_fff1"],
                subSkill:{
                    "fff1":{
                        enable:"phaseUse",
                        usable:1,
                        filter:function (event,player){
return player.num('h')>1;
},
                        filterTarget:function (card,player,target){
return !target.skills.contains('ss人偶支配_fff2');
},
                        filterCard:true,
                        selectCard:2,
                        selectTarget:2,
                        content:function (){
target.addSkill('ss人偶支配_fff2');
target.addSkill('ss人偶支配_fff3');
target.mark('支',{
name:'支配',
content:'已发动 '});
},
                    },
                    "fff2":{
                        trigger:{
                            global:"damageEnd",
                        },
                        filter:function (event,player){
return event.num>0&&event.player.skills.contains('ss人偶支配_fff2')&&event.player!=player;
},
                        forced:true,
                        content:function (){
"step 0"
player.judge();
"step 1"
if(result.color=='black'){
player.loseHp(trigger.num);
}
else{
player.discard(player.get('he').randomGets(trigger.num));
};
},
                    },
                    "fff3":{
                        trigger:{
                            global:["dieAfter","phaseBegin"],
                        },
                        filter:function (event,player){
return event.player.skills.contains('ss人偶支配');
},
                        forced:true,
                        content:function (){
player.removeSkill('ss人偶支配_fff2');
player.removeSkill('ss人偶支配_fff3');
player.unmark('支');
},
                    },
                },
            },
            "ss受胎告知":{
                nobracket:true,
                trigger:{
                    player:"dieBefore",
                },
                direct:true,
                content:function (){
"step 0"
player.chooseTarget('是否发动【受胎告知】？',function(card,player,target){
return target!=player&&target.num('h');
})
"step 1"
if(result.bool){
result.targets[0].showHandcards();
var cards=result.targets[0].get('h',{suit:'heart'});
if(cards.length){
player.gain(cards);
result.targets[0].$give(cards.length,result.targets[0])
player.revive(cards.length);
player.turnOver();
trigger.finish();
trigger.untrigger();
};
}

},
            },
            "ss遁舜六花":{
                nobracket:true,
                group:["ss盾舜六花_fff1"],
                subSkill:{
                    "fff1":{
                        enable:"phaseUse",
                        filterCard:function (card,player){
if(get.suit(card)=='spade'){
if(lib.filter.filterCard({name:'sha'},player)){
return true;
}
else{
return false
};
};
return true;
},
                        usable:1,
                        filterTarget:function (card,player,target){
if(ui.selected.cards.length){
var suit=get.suit(ui.selected.cards[0]);
if(player!=target&&suit==`spade`) return true;
if(suit=='heart'&&target.hp<target.maxHp&&player!=target) return true;
if(suit==`diamond`) return true;
if(suit=='club'&&!target.skills.contains('盾舜六花_fff2')) return true;
};
},
                        content:function (){
var suit=get.suit(cards[0]);
if(suit==`diamond`){
target.changeHujia();
target.update();
};
if(suit==`heart`){
target.draw();
target.recover();
};
if(suit==`club`){
target.addSkill('ss盾舜六花_fff2');
target.mark('反',{
name:'反甲',
content:'锁定技 当一名角色对你造成伤害时，该角色受到来自你的一点伤害。'
});
};
if(suit==`spade`){
player.useCard({name:'sha'},targets);
};
},
                    },
                    "fff2":{
                        trigger:{
                            player:"damageEnd",
                        },
                        forced:true,
                        filter:function (event,player){
return event.source!=undefined&&event.source!=player;
},
                        content:function (){
"step 0"
player.removeSkill('ss盾舜六花_fff2');trigger.source.damage();
"step 1"
player.unmark('反')
},
                    },
                },
            },
            "ss镜花水月":{
                nobracket:true,
                trigger:{
                    target:"useCardToBefore",
                },
                direct:true,
                priority:5,
                filter:function (event,player){
return event.card&&event.player!=player&&event.targets.length==1&&player.storage.ss幻象>0;
},
                content:function (){
"step 0"
player.chooseTarget(function(card,player,target){
return get.distance(trigger.player,target,'attack')<=1&&target!=player;
},
'是否发动【镜花水月】？'
);
"step 1"
if(result.bool){
player.storage.ss幻象--;
if(trigger.player!=result.targets){
trigger.player.line(result.targets[0]);
};
player.logSkill('ss镜花水月',result.targets);
trigger.target=result.targets[0];
trigger.targets.remove(player);
trigger.targets.push(result.targets[0]);
player.judge();
}
else{
event.finish();
};
"step 2"
if(result.color==`red`&&player.hp!=player.maxHp){
player.recover();
}
else{
player.draw();
};
trigger.untrigger();
trigger.trigger('useCardToBefore');
trigger.trigger('shaBefore');
game.delay();
},
            },
            "ss幻象":{
                init:function (player){
player.storage.ss幻象=0;
},
                intro:{
                    content:"mark",
                },
                forced:true,
                trigger:{
                    player:"damageEnd",
                },
                filter:function (event,player){
return event.num>0;
},
                content:function (){

player.storage.ss幻象+=trigger.num;
player.syncStorage('ss幻象');
player.markSkill('ss幻象');


},
                mod:{
                    maxHandcard:function (player,num){
return player.storage.ss幻象+num;
},
                },
            },
            "ss钢皮":{
                trigger:{
                    player:"damageBegin",
                },
                priority:20,
                forced:true,
                filter:function (event,player){
return event.source;
},
                content:function (){
"step 0"
player.judge(function(card){
if(get.number(card)<=5) return 2;
return -2;
});
"step 1"
if(result.bool&&trigger.num>=1){
trigger.num--;
};
},
            },
            "ss圣哭螳螂":{
                nobracket:true,
                trigger:{
                    player:"shaMiss",
                },
                filter:function (event,player){
return (event.target.num('h')>0&&player.num('h')>0)||(event.target.num('h')==0&&player.num('h')>1);
},
                check:function (event,player){
return ai.get.attitude(player,event.player)<0&&player.num('h')>1;
},
                priority:5,
                content:function (){
"step 0"
if(trigger.target.num('h')>0&&player.num('h')>0){
player.chooseToCompare(trigger.target);
}
else{
event.goto(2);
};
"step 1"
if(result.bool){
trigger.target.damage();
event.finish();
}
else if(!result.bool){
player.damage();
event.finish();
}
"step 2"
player.chooseToDiscard('是否发动【圣哭螳螂】','h',2);
"step 3"
if(result.bool){
trigger.target.damage();
}
},
            },
            "ss豹王之爪":{
                nobracket:true,
                group:["ss豹王之爪_fff1","ss豹王之爪_fff2"],
                subSkill:{
                    "fff1":{
                        mod:{
                            targetInRange:function (card,player,target,now){
if(card.name=='sha'&&player.hp<=3) return true;
},
                            cardUsable:function (card,player,num){
if(card.name=='sha'&&player.hp<=2) return num+1;
},
                            maxHandcard:function (player,num){
if(player.hp==1) return num+2;
},
                        },
                        trigger:{
                            player:"shaBegin",
                        },
                        forced:true,
                        filter:function (event,player){
return player.hp==1;
},
                        content:function (){
"step 0"
var next=trigger.target.chooseToRespond({name:'shan'});
next.autochoose=lib.filter.autoRespondShan;
next.ai=function(card){
if(trigger.target.num('h','shan')>1){
return ai.get.unuseful2(card);
}
return -1;
};
"step 1"
if(result.bool==false){
trigger.untrigger();
trigger.directHit=true;
}
},
                        ai:{
                            maixie:true,
                        },
                    },
                    "fff2":{
                        trigger:{
                            source:"damageEnd",
                        },
                        direct:true,
                        filter:function (event,player){
return event.card&&event.card.name=='sha'&&player.hp<=2;
},
                        content:function (){
"step 0"
player.chooseControl('摸牌','回血','cancel').ai=function(){
if(player.hp>=2) return 0;
return 1;
};
"step 1"
if(result.control=='摸牌'){
player.logSkill('ss豹王之爪_fff2');
player.draw();
}
else if(result.control=='回血'){
player.logSkill('ss豹王之爪_fff2');
player.recover();
}
},
                    },
                },
            },
            "ss一击必杀":{
                nobracket:true,
                group:["ss一击必杀_fff1","ss一击必杀_fff2","ss一击必杀_fff3"],
                subSkill:{
                    "fff1":{
                        trigger:{
                            player:"useCard",
                        },
                        forced:true,
                        priority:10,
                        popup:false,
                        filter:function (event){
return event.card.name=='sha';
},
                        content:function (){player.addTempSkill('unequip','useCardAfter');
},
                    },
                    "fff2":{
                        trigger:{
                            source:"damageBegin",
                        },
                        filter:function (event,player){
return event.card&&event.card.name=='sha';
},
                        forced:true,
                        popup:false,
                        content:function (){
trigger.player.die(trigger)._triggered=null;
},
                    },
                    "fff3":{
                        trigger:{
                            player:"shaBegin",
                        },
                        forced:true,
                        content:function (){
trigger.directHit=true;
},
                    },
                },
            },
            "ss侵入":{
                group:["ss侵入_fff1"],
                subSkill:{
                    "fff1":{
                        enable:"phaseUse",
                        usable:1,
                        filter:function (event,player){
return player.num('h')>0;
},
                        changePlayer:true,
                        filterTarget:function (card,player,target){
return player!=target},
                        content:function (){
"step 0"
player.discard(player.get('h'));
"step 1"
game.swapPlayer(target,player);
target.addSkill('ss侵入_fff2');
target.mark('侵',{
name:'侵入',
content:'锁定技，回合结束阶段，若场上有‘草雉素子’，你与‘草雉素子’交换控制权。'
}
);
},
                    },
                    "fff2":{
                        trigger:{
                            player:"phaseEnd",
                        },
                        forced:true,
                        filter:function (event,player){
for(var i=0;i<game.players.length;i++){
if(game.players[i]!=player&&game.players[i].name=='草雉素子') return true;
}
return false;
},
                        content:function (){
for(var i=0;i<game.players.length;i++){
if(game.players[i].name=='草雉素子'){
game.swapPlayer(game.players[i],player);
player.removeSkill('ss侵入_fff2');
player.unmark('侵');
}
}
},
                    },
                },
            },
            "ss巨人右臂":{
                nobracket:true,
                trigger:{
                    player:"damageBegin",
                },
                filter:function (event,player){
return player.num('h',{color:'red',name:'sha'})>0;
},
                direct:true,
                content:function (){
"step 0"
var next=player.chooseToDiscard('h','是否弃置一张红杀令伤害-1？',function(card,player){
return card.name=='sha'&&get.color(card)=='red';
});
next.ai=function(card){
if(player.hp==1||trigger.num>1){
return 9-ai.get.value(card);
}
if(player.hp==2){
return 8-ai.get.value(card);
}
return 7-ai.get.value(card);
};
next.logSkill='ss巨人右臂';
"step 1"
if(result.bool){
game.delay();
trigger.num--;
}
},
            },
            "ss恶魔左臂":{
                nobracket:true,
                trigger:{
                    source:"damageBegin",
                },
                filter:function (event,player){
if(event.card&&event.card.name=='sha'&&get.color(event.card)=='black') return true;
return false;
},
                forced:true,
                content:function (){
trigger.num++;
},
            },
            "ss五鬼":{
                group:["ss五鬼_fff1","ss五鬼_fff2","ss五鬼_fff3","ss五鬼_fff4","ss五鬼2"],
                subSkill:{
                    "fff1":{
                        enable:"phaseUse",
                        usable:1,
                        filterTarget:function (card,player,target){return player!=target&&target.num('h')>0&&get.distance(player,target,'attack')<=1;},
                        filter:function (event,player){return player.num('h')>0;},
                        popup:false,
                        filterCard:true,
                        prompt:"弃置一张手牌指定一名你攻击范围内的其他角色",
                        content:function (){
                game.log(player,'发动了','【'+get.translation('影鬼')+'】');
                var card=targets[0].get('h').randomGet();
                player.showCards(card);
                if(get.color(card)=='black'){player.addTempSkill('unequip','shaAfter');player.useCard({name:'sha'},targets[0],false);}
                else{targets[0].$give(1,player); player.gain(card);event.finish();}
            },
                    },
                    "fff2":{
                        trigger:{
                            player:"shaBegin",
                        },
                        prompt:function (event,player){return '是否对'+get.translation(event.target)+'发动【崭鬼】？'},
                        check:function (event,player){return ai.get.attitude(player,event.target)<=0;},
                        popup:false,
                        filter:function (event,player){return player.num('h')>0&&event.target.num('h')>0;},
                        content:function (){
            "step 0"
            game.log(player,'发动了','【'+get.translation('崭鬼')+'】');
            player.chooseToCompare(trigger.target);
            "step 1"
            if(result.bool){trigger.directHit=true;}
            else{event.finish();};
        },
                    },
                    "fff3":{
                        trigger:{
                            source:"damageBegin",
                        },
                        check:function (event,player){return ai.get.attitude(player,event.player)<=0;},
                        filter:function (event,player){
 return event.card.name=='sha'&&event.parent.name!='_lianhuan'&&event.parent.name!='_lianhuan2'&&(player.num('h',{color:'red'})>1||player.num('h',{color:'black'})>1);
              },
                        direct:true,
                        content:function (){
              "step 0"
          player.chooseToDiscard('是否发动【艳鬼】？',2,function(card){
              if(ui.selected.cards.length){
                  return get.color(card)==get.color(ui.selected.cards[0]);}return player.num('h',{
                      color:get.color(card)})>1;}).ai=function(card){
              if(ai.get.damageEffect(trigger.player,player,player,'thunder')>0){
                  return 8-ai.get.value(card);
              }
              return 0;
          };
              "step 1"
              if(result.bool){game.log(player,'发动了','【'+get.translation('艳鬼')+'】');trigger.num++;}
              else{event.finish();}
              "step 2"
              trigger.player.chooseToDiscard('是否弃置两张牌减少伤害？',2,function(card){if(ui.selected.cards.length){return get.color(card)==get.color(ui.selected.cards[0]);}
           return player.num('h',{color:get.color(card)})>1;}).ai=function(card){return 8-ai.get.value(card);};
           "step 3"
           if(result.bool){trigger.num--;}},
                    },
                    "fff4":{
                        trigger:{
                            player:"shaAfter",
                        },
                        prompt:function (event,player){return '是否对'+get.translation(event.target)+'发动【赌魔王】？'},
                        popup:false,
                        filter:function (event,player){return event.target.isAlive()&&player.num('he')>0&&event.target.num('he')>0;},
                        content:function (){
             "step 0"
             game.log(player,'发动了','【'+get.translation('赌魔王')+'】');
             event.card1=get.cards()[0];
             player.gain(event.card1);
             "step 1"
             event.card2=get.cards()[0];           
             player.lose(event.card1);
             trigger.target.lose(event.card2);
             player.$compare(event.card1,trigger.target,event.card2);
             game.delay(4);
             "step 2"
             game.log(player,'展示了',event.card1);
             game.log(trigger.target,'展示了',event.card2);
             if(event.card1.number>event.card2.number){player.gain(trigger.target.get('he'));trigger.target.$give(trigger.target.num('he'),player);}
             else if(event.card1.number<event.card2.number){trigger.target.gain(player.get('he'));player.$give(player.num('he'),trigger.target);}
             else if(event.card1.number=event.card2.number){trigger.target.gain(event.card2);player.gain(event.card1);}
             "step 3"
             ui.arena.classList.remove('thrownhighlight');game.addVideo('thrownhighlight2');},
                    },
                },
            },
            "ss五鬼2":{
                mod:{
                    attackFrom:function (from,to,distance){
            if(get.distance(to,from,'attack')>1) 
                return distance-100;
        },
                },
            },
            "ss影送":{
                trigger:{
                    global:"useCard",
                },
                priority:15,
                filter:function (event,player){
return event.card.name=='sha'&&event.player!=player&&event.targets.contains(player);
},
                content:function (){
"step 0"
player.discard(player.get('h'));
player.judge();
"step 1"
if(result.color=='black'){
trigger.player.gain(result.card);trigger.untrigger();
trigger.finish();
}
else{
player.gain(result.card);
}
},
            },
            "ss馘蛇":{
                group:["ss馘蛇_fff1"],
                subSkill:{
                    "fff1":{
                        trigger:{
                            player:"phaseBegin",
                        },
                        content:function (){
"step 0"
event.cards=get.cards(2);
player.chooseCardButton(event.cards,1,true,'选择获得一张牌').ai=ai.get.buttonValue;
"step 1"
var choice=result.links[0];
for(var i=0;i<cards.length;i++){
ui.cardPile.appendChild(cards[i]);
}
player.showCards(choice);player.gain(choice);

game.log(player,'发动馘蛇');
if(get.type(choice)=='basic'){
player.addTempSkill('ss馘蛇_fff2','phaseAfter');
player.addTempSkill('mashu','phaseAfter');
}
else{
player.discard(player.get('j'));
player.draw();
};

game.delay();
},
                    },
                    "fff2":{
                        mod:{
                            cardUsable:function (card,player,num){
if(card.name=='sha') return num+1;
},
                        },
                    },
                },
            },
            "ss阎魔":{
                group:["ss阎魔_fff1","ss阎魔_fff2"],
                subSkill:{
                    "fff1":{
                        trigger:{
                            player:"useCardBefore",
                        },
                        forced:true,
                        priority:50,
                        filter:function (event,player){
return get.color(event.card)=='black';
},
                        content:function (){
var num=0;
for(var i=0;i<game.players.length;i++){
if(game.players[i]!=player&&get.distance(player,game.players[i],'attack')<=1&&!game.players[i].skills.contains('jilei2')){
game.players[i].addSkill('jilei2');
game.players[i].mark('阎');
}
};
player.storage.ss阎魔=trigger.card;
player.addSkill('ss阎魔_fff3');
},
                    },
                    "fff2":{
                        trigger:{
                            source:"damageBefore",
                        },
                        filter:function (event,player){
return event.num>0&&get.color(event.card)=='black';
},
                        forced:true,
                        popup:false,
                        content:function (){
trigger.player.damage('nosource');
trigger.untrigger();
trigger.finish();
},
                    },
                    "fff3":{
                        trigger:{
                            player:"useCardAfter",
                        },
                        forced:true,
                        priority:50,
                        popup:false,
                        filter:function (event,player){
return event.player==player&&player.storage.ss阎魔==event.card;
},
                        content:function (){
delete player.storage.ss阎魔;
var num=0;
for(var i=0;i<game.players.length;i++){
if(player!=game.players[i]){
game.players[i].removeSkill('jilei2');
game.players[i].unmark('阎');
}
}
},
                    },
                },
            },
            "ss蟋蟀":{
                mod:{
                    targetEnabled:function (card,player,target){
if(get.color(card)=='black'&&player!=target&&get.distance(target,player,'attack')<=1) return false;
},
                },
            },
            "ss神枪":{
                trigger:{
                    player:"phaseUseBegin",
                },
                init:function (player){
player.storage.ss神枪=[];
},
                direct:true,
                content:function (){
"step 0"
player.chooseToDiscard('h','是否弃置一张牌以发动技能“神枪”');
"step 1"
if(result.bool){
player.logSkill('ss神枪');
if(player.storage.ss神枪.length>0){
player.discard(player.storage.ss神枪);
delete player.storage.ss神枪;
player.storage.ss神枪=[];
player.storage.ss神枪.length=0;
player.updateMarks();
};
var suit=get.suit(result.cards[0]);
var cards=[];
for(var i=0;i<ui.cardPile.childNodes.length;i++){
var card=ui.cardPile.childNodes[i];
cards.push(card);
if(get.suit(card)==suit||i>3){
break;
}
}
event.cards=cards;
event.suit=suit;
player.showCards(cards);
}
else{
event.finish();
}
"step 2"
if(event.cards&&event.cards.length){
player.gain(event.cards);
player.lose(event.cards);
player.storage.ss神枪=player.storage.ss神枪.concat(event.cards);
game.log(player,'将',event.cards,'置于武将牌上作为“神枪”');
player.markSkill('ss神枪');
player.updateMarks();
}
},
                intro:{
                    content:"cards",
                },
                mod:{
                    attackFrom:function (from,to,distance){

if(from.storage.神枪.length>0) return distance-from.storage.神枪.length;
},
                },
            },
            "ss毒刃":{
                trigger:{
                    source:"damageEnd",
                },
                filter:function (event,player){
return event.card&&event.card.name=='sha'&&event.player.isAlive()&&player.storage.ss神枪.length>0;
},
                content:function (){
trigger.player.gain(player.storage.ss神枪);
trigger.player.$gain(player.storage.ss神枪.length);
game.log(trigger.player,'从',player,'处获得了',player.storage.ss神枪.length,'张牌');
delete player.storage.ss神枪;
player.storage.ss神枪=[];
player.storage.ss神枪.length=0;
player.updateMarks();
trigger.player.turnOver();
},
            },
            "ss千转白蛇":{
                group:["ss千转白蛇_fff1"],
                subSkill:{
                    "fff1":{
                        trigger:{
                            player:"damageBegin",
                        },
                        filter:function (event,player){
return event.source&&event.source.isAlive()&&player.storage.ss神枪.length>0;
},
                        direct:true,
                        content:function (){
"step 0"
player.chooseControl('给牌','摸牌');
"step 1"
if(result.control=='给牌'){
trigger.untrigger();
trigger.player=trigger.source;
trigger.trigger('damageBefore');
trigger.source.gain(player.storage.ss神枪);
trigger.source.$gain(player.storage.ss神枪.length);
game.log(trigger.source,'从',player,'处获得了',player.storage.ss神枪.length,'张牌');
delete player.storage.ss神枪;
player.storage.ss神枪=[];
player.storage.ss神枪.length=0;
player.updateMarks();

}
else{
player.gain(player.storage.ss神枪);
player.$gain(player.storage.ss神枪.length);
game.log(player,'获得了',player.storage.ss神枪.length,'张牌');
delete player.storage.ss神枪;
player.storage.ss神枪=[];
player.storage.ss神枪.length=0;
player.updateMarks();
}
},
                        ai:{
                            maixie:true,
                            effect:{
                                target:function (card,player,target){
if(get.tag(card,'damage')){
if(player.skills.contains('jueqing')) return [1,-2];
if(!target.hasFriend()) return;
if(target.hp>=4&&target.storage.ss神枪.length>3) return [1,get.tag(card,'damage')*2];
if(target.hp==3&&target.storage.ss神枪.length>2) return [1,get.tag(card,'damage')*1.5];
if(target.hp==2&target.storage.ss神枪.length>2) return [1,get.tag(card,'damage')*0.5];
}
},
                            },
                        },
                    },
                    "fff2":{
                        trigger:{
                            player:"damageBefore",
                        },
                        forced:true,
                        content:function (){
trigger.untrigger();
trigger.finish();
},
                    },
                },
            },
            "ss黑绳天谴明王":{
                nobracket:true,
                unique:true,
                enable:"phaseUse",
                skillAnimation:true,
                mark:true,
                filter:function (event,player){
return !player.storage.ss黑绳天谴明王&&player.num('h');
},
                init:function (player){
player.storage.ss黑绳天谴明王=false;
},
                filterTarget:true,
                content:function (){
"step 0"
player.unmarkSkill('ss黑绳天谴明王');
var cards=player.get('h');

player.storage.ss黑绳天谴明王=true;
game.delay();
target.addSkill('ss佑护');
player.addSkill('ss天谴');
target.marks.ss黑绳天谴明王=target.markCharacter('ss黑绳天谴明王');
},
                intro:{
                    content:"limited",
                },
            },
            "ss天谴":{
                trigger:{
                    player:"shaEnd",
                },
                direct:true,
                filter:function (event,card,player,target){
for(var i=0;i<game.players.length;i++){
if(game.players[i].skills.contains('ss佑护')&&event.target.isAlive()) return true;
}
return false;
},
                content:function (){
"step 0"
player.chooseToDiscard('h','是否发动【天谴】');
"step 1"
if(result.bool){
for(var i=0;i<game.players.length;i++){
if(game.players[i].skills.contains('ss佑护')){game.players[i].useCard({name:'sha'},trigger.target);
}
};
}
else{
event.finish();
}
},
            },
            "ss佑护":{
                trigger:{
                    global:"damageBegin",
                },
                mark:true,
                direct:true,
                filter:function (event,player){
for(var i=0;i<game.players.length;i++){
if(game.players[i].skills.contains('ss黑绳天谴明王')&&player.storage.ss佑护>0&&(event.player==player||event.player.skills.contains('ss黑绳天谴明王'))) return true;
}
return false;
},
                init:function (player){
player.storage.ss佑护=5;
},
                content:function (){
"step 0"
for(var i=0;i<game.players.length;i++){
if(game.players[i].skills.contains('ss黑绳天谴明王')){
game.players[i].chooseBool('是否发动佑护？');
}
};
"step 1"
if(result.bool){
trigger.untrigger();
trigger.finish();
player.storage.ss佑护--;
player.updateMarks();
for(var i=0;i<game.players.length;i++){
if(game.players[i].skills.contains('ss黑绳天谴明王')){
player.draw();
game.players[i].draw();
game.players[i].loseHp();
}
};
}
else{
event.finish();
}
},
                intro:{
                    content:"mark",
                },
            },
            "ss腐朽":{
                trigger:{
                    player:"phaseDiscardEnd",
                },
                priority:6,
                direct:true,
                content:function (){
        'step 0'
        player.chooseToDiscard('h','请弃置一张手牌否则流失一点体力');
        'step 1'
        if(result.bool){
            event.goto(2);
        }else{
            player.loseHp();event.finish();
        }
        'step 2'
        var targets=get.players();
        targets.remove(player);
        event.targets=targets;
        event.damages=[];
        event.card=result.cards[0];
        'step 3'
        var type=get.type(event.card,'trick');
        if(event.targets.length){
            var current=event.targets.shift();
            current.chooseToDiscard('弃置一张'+get.translation(type)+'牌或流失一点体力','he',function(card){
            return get.type(card,'trick')==type;}).ai=function(card){
            return 7-ai.get.value(card);
            }
            event.current=current;
        }else{
            event.goto(5);
        }
        'step 4'
        if(!result.bool){
            event.damages.push(event.current);
             player.line(event.current);
        }
        if(event.targets.length){
    event.goto(3);
}
        'step 5'
        if(event.damages.length){
            event.damages.shift().loseHp();
            event.redo();
        }
    },
            },
            "ss叹息":{
                trigger:{
                    player:"damageEnd",
                    source:"damageEnd",
                },
                filter:function (event,player,card){
        if(event.num&&event.player==player&&event.source&&event.source.num('he')&&event.source.isAlive()) 
            return true;
        if(event.num&&event.player!=player&&event.player.num('he')&&event.player.isAlive()) 
            return true;
        return false;
    },
                check:function (event,player){
        return (ai.get.attitude(player,event.source)<=0);
    },
                content:function (){
        if(trigger.player!=player){          
            player.discardPlayerCard(trigger.player,'he',true);
                                  }
        else{
            player.discardPlayerCard(trigger.source,'he',true);
             }
            },
            },
            "ss暗月":{
                group:["ss暗月_fff1"],
                subSkill:{
                    "fff1":{
                        enable:"phaseUse",
                        unique:true,
                        mark:true,
                        skillAnimation:true,
                        filter:function (event,player){
                return !player.storage.ss暗月},
                        content:function (){
                "step 0"
                player.unmark('ss暗月');
                player.storage.ss暗月=true;             
                event.targets=game.players.slice(0);             event.targets.remove(player);
                event.targets.sort(lib.sort.seat);
                event.targets2=event.targets.slice(0);
                "step 1"
                if(event.targets.length){
                    event.targets.shift().addSkill('ss暗月_fff2');event.redo();
                }
                "step 2"
                if(event.targets2.length){
                    var cur=event.targets2.shift();
                    cur.damage();
                    event.redo();
                }
            },
                        intro:{
                            content:"limited",
                        },
                    },
                    "fff2":{
                        trigger:{
                            global:"phaseAfter",
                        },
                        forced:true,
                        mark:true,
                        popup:false,
                        content:function (){
                player.removeSkill('ss暗月_fff2');
            },
                        mod:{
                            cardEnabled:function (card,player){if(get.color(card)=='red') return  false;},
                            cardUsable:function (card,player){if(get.color(card)=='red') return false;},
                            cardRespondable:function (card,player){if(get.color(card)=='red') return false;},
                            cardSavable:function (card,player){if(get.color(card)=='red') return false;},
                        },
                    },
                },
            },
            "ss记忆切割":{
                nobracket:true,
                trigger:{
                    player:"respond",
                },
                filter:function (event,player){
    return (event.card.name=='shan'||event.card.name==`sha`)&&player!=_status.currentPhase;},
                direct:true,
                content:function (){
        "step 0"
        player.chooseCardTarget({
            multitarget:true,
            filterTarget:function(card,player,target){
                if(ui.selected.targets.length){
                    var from=ui.selected.targets[0];
                    var judges=from.get('j');
                    for(var i=0;i<judges.length;i++){
                        if(!target.hasJudge(judges[i].viewAs||judges[i].name)) 
                            return true;
                    }
                    if(target.isMin()) return false;
  if((from.get('e','1')&&!target.get('e','1'))||(from.get('e','2')&&!target.get('e','2'))||(from.get('e','3')&&!target.get('e','3'))||(from.get('e','4')&&!target.get('e','4'))||(from.get('e','5')&&!target.get('e','5'))||(from.get('h'))) return true;
                    return false;
                }
                else{
                    return target.num('hej')>0;
                }},
            selectTarget:2,
            filterCard:true,
            selectCard:0,
            prompt:'是否发动记忆切割？',
            targetprompt:['被移走','移动目标']
        });
        "step 1"
        if(result.bool==false){
            event.finish();
            return;
        }
        player.discard(result.cards);
        player.logSkill('ss记忆切割',result.targets,false);
        player.line2(result.targets);
        event.targets=result.targets;
        "step 2"
        game.delay();
        "step 3"
        if(targets.length==2){
            player.choosePlayerCard('hej',function(button){
                if(ai.get.attitude(player,targets[0])>ai.get.attitude(player,targets[1])){
                    return get.position(button.link)=='j'?10:0;
                }
                else{
                    if(get.position(button.link)=='j') return -10;
                    return ai.get.equipValue(button.link);
                }
            },
                                    targets[0]
                                   );
        }
        else{
            event.finish();
        }
        "step 4"
        if(result.bool){
            if(get.position(result.buttons[0].link)=='e'){
                event.targets[1].equip(result.buttons[0].link);
            }
            else if(get.position(result.buttons[0].link)=='h'){
                event.targets[1].gain(result.buttons[0].link);
            }
            else if(result.buttons[0].link.viewAs){
                event.targets[1].addJudge({name:result.buttons[0].link.viewAs},[result.buttons[0].link]);
            }
            else{
                event.targets[1].addJudge(result.buttons[0].link);
            }
            event.targets[0].$give(result.buttons[0].link,event.targets[1])
            game.delay();
        }
    },
                ai:{
                    expose:0.2,
                },
            },
            "ss虚化":{
                trigger:{
                    player:"phaseDrawBefore",
                },
                direct:true,
                content:function (){
        "step 0"
        player.chooseTarget('是否发动【虚化】？',function(card,player,target){
            return player!=target;
        });
        "step 1"
        if(result.bool){
            player.logSkill('虚化',result.targets); player.addTempSkill('unequip','useCardAfter');
            player.draw(player.maxHp-player.num('h'));
            player.useCard({name:'sha'},result.targets[0],false).animate=false;
            trigger.untrigger();
            trigger.finish();
        }
    },
            },
            "ss超速再生":{
                nobracket:true,
                trigger:{
                    player:"damageEnd",
                },
                forced:true,
                content:function (){
        "step 0"
        if(player.maxHp-player.hp<=3){
            event.cards=get.cards(player.maxHp-player.hp);
        }
        else{
            event.cards=get.cards(3);
        };
        player.showCards(event.cards);
        "step 1"
        var num=0;
        for(var i=0;i<event.cards.length;i++){
            if(get.color(event.cards[i])=='red'){
                num++;ui.discardPile.appendChild(event.cards[i]);
                event.cards.splice(i--,1);}
        }
    if(num){
        player.recover(num);
    }
        "step 2"
        if(event.cards.length){
            player.draw(event.cards.length);
            game.delay();
        }
    },
            },
            "ss究极辐射波":{
                nobracket:true,
                enable:"phaseUse",
                usable:1,
                filter:function (event,player){
        return player.num('h',{type:'basic'})>0;
    },
                filterCard:function (card){
        return get.type(card)=='basic';
    },
                filterTarget:function (card,player,target){
        if(_status.auto||player!=game.me){
            if(ai.get.attitude(player,target)>0) 
                return false;
        }
        return player!=target;
    },
                selectTarget:[1,6],
                content:function (){
        "step 0"
        if(targets.length>=2){
            target.damage('fire');
            event.finish();
        };
        if(targets.length==1){
            if(target.hp-1>6){
                player.storage.ss究极辐射波=6;
            }
            else if(target.hp-1<=0){
                player.storage.ss究极辐射波=1;
            }
            else{
                player.storage.ss究极辐射波=target.hp-1;
                    }
                   }
        "step 1"
        if(target.isAlive&&player.storage.ss究极辐射波>0){
            player.addTempSkill('unequip','useCardAfter');
            player.useCard({name:'sha',nature:'fire'},target,false);
            player.storage.ss究极辐射波--;
            game.delay();
            event.goto(1);
        }
        else{
    event.finish();
};
},
                ai:{
                    order:20,
                    threaten:99,
                    result:{
                        target:function (player,target){
                if(target.hasSkillTag('nofire')) return 0;
                if(lib.config.mode=='versus') return -1;
                for(var i=0;i<game.players.length;i++){
                    if(lib.config.mode=='identity'){
                        if(game.players[i].ai.shown<=0.2) return 0;
                    }
                    else if(lib.config.mode=='guozhan'){
                        if(game.players[i].identity=='unknown') return 0;
                    }
                }
                return ai.get.damageEffect(target,player);
            },
                    },
                },
            },
            "ss虚弱":{
                group:["ss虚弱_fff1"],
                subSkill:{
                    "fff1":{
                        trigger:{
                            player:"shaEnd",
                        },
                        forced:true,
                        filter:function (event,player){
                return _status.currentPhase==player;
            },
                        content:function (){
                player.addSkill('ss虚弱_fff2');
                player.mark('虚',{
                    name:'虚弱',
                    content:'已发动'
                });
            },
                        mod:{
                            maxHandcard:function (player,num){
                    var nd=player.num('h','sha');
                    if(player.num('h','sha')>0) return num+nd;
                },
                        },
                    },
                    "fff2":{
                        trigger:{
                            global:"phaseAfter",
                        },
                        forced:true,
                        popup:false,
                        content:function (){
                player.removeSkill('ss虚弱_fff2');
                player.unmark('虚');
            },
                        mod:{
                            cardEnabled:function (card,player){
if(card.name=='sha') return false;},
                            cardUsable:function (card,player){if(card.name=='sha') return false;},
                            cardRespondable:function (card,player){if(card.name=='sha') return false;},
                            cardSavable:function (card,player){if(card.name=='sha') return false;},
                        },
                    },
                },
            },
            "ss双鱼理":{
                nobracket:true,
                group:["ss双鱼理_fff1","ss双鱼理_fff2"],
                subSkill:{
                    "fff1":{
                        trigger:{
                            player:"damageEnd",
                        },
                        filter:function (event,player){
return event.source&&event.source!=player&&event.card&&get.position(event.cards[0])=='d'&&get.itemtype(event.cards)=='cards'&&event.parent.name!='_lianhuan'&&event.parent.name!='_lianhuan2';
            },
                        forced:true,
                        content:function (){
                player.storage.ss双鱼理=true;
            },
                    },
                    "fff2":{
                        trigger:{
                            global:"useCardAfter",
                        },
                        filter:function (event,player){
                return event.player!=player&&get.position(event.card)=='d'&&get.itemtype(event.card)=='card'&&event.targets[0]==player;
            },
                        direct:true,
                        content:function (){
                "step 0"
                if(player.storage.ss双鱼理&&trigger.targets.length==1){
                    player.chooseTarget('是否发动【双鱼理】？',function(card,player,target){
                        return target!=player;
                    },1);
                }
                else if(!player.storage.ss双鱼理&&trigger.targets.length==1&&player.num('he')>0){
                    player.chooseCardTarget({
                        prompt:'是否发动【双鱼理】？',
                        filterCard:true,
                        position:'he',
                        filterTarget:function(card,player,target){
                            return target!=player;
                        },
                    }
                                           );
                }
                else if(trigger.targets.length!=1){
                    player.storage.ss双鱼理=false;
                    event.finish();
                }
                "step 1"
                if(result.bool){
                    player.discard(result.cards);
                    player.logSkill('ss双鱼理',result.targets);
                    player.useCard(trigger.card,result.targets[0]);
                }
                else{
                    player.storage.ss双鱼理=false;
            event.finish();
        }
        "step 2"
        player.storage.ss双鱼理=false;
            },
                    },
                },
            },
        },
        translate:{
            "ss天锁":"天锁",
            "ss天锁_info":"出牌阶段，你可以把一张非基本手牌当黑色的铁索连环使用，每回合限用一次。",
            "ss斩月":"斩月",
            "ss斩月_info":"锁定技，你的普通杀视为火杀。",
            "ss连舞":"连舞",
            "ss连舞_info":"锁定技，弃牌阶段结束后，如果你的手牌数小于2，你摸x张牌，x为你的已损失体力值加1",
            "ss剑压":"剑压",
            "ss剑压_info":"锁定技，每隔两回合，你杀造成的伤害加一",
            "ss剑道":"剑道",
            "ss剑道_info":"当你的杀指定一名角色时，你可以弃置一张牌，视为这张杀无视该角色防具",
            "ss封印":"封印",
            "ss封印_info":"锁定技 你不能使用或装备防具和加一马，你到其它角色的距离始终减一。",
            "ss再生":"再生",
            "ss再生_info":"摸牌阶段，若你已受伤，你可以放弃摸牌并展示牌堆顶的X张牌，X为你已损失的体力值，其中每有一张红色牌，你回复1点体力，然后弃掉这些红色牌，将其余的牌收入手牌。",
            "ss尾鞭":"尾鞭",
            "ss尾鞭_info":"出牌阶段，你可以弃置一张黑色手牌，指定一名其他角色拉至你的旁边，每回合限用一次",
            "ss雷霆":"雷霆",
            "ss雷霆_info":"锁定技，当你杀造成伤害时，你进行一次判定，若不为红桃，伤害加一，否则，伤害减一。你的普通杀均视为雷杀",
            "ss响转":"响转",
            "ss响转_info":"锁定技，你与其他角色的距离始终减一，当你的杀指定一名角色时，若距离为一，则此杀无视对方防具。",
            "ss千本樱":"千本樱",
            "ss千本樱_info":"出牌阶段，你可以弃置一张武器牌指定x名角色（x为武器的攻击范围），指定角色分别进行判定，若与武器牌的花色不同，则该角色流失一点体力，每回合限一次。",
            "ss无伤":"无伤",
            "ss无伤_info":"你可以把梅花牌当杀或者闪使用或打出。",
            "ss雀蜂雷":"雀蜂雷",
            "ss雀蜂雷_info":"限定技 出牌阶段，你可以弃置全部手牌（至少一张），指定一名其他角色造成两点伤害，然后你失去一点体力",
            "ss蜂纹华":"蜂纹华",
            "ss蜂纹华_info":"当你使用杀时，若该角色已经标记“蜂纹华”，则该角色进行一次判定，若判定牌与“蜂纹华”花色相同，则该角色失去两点体力，否则，你摸一张牌。当你的杀造成伤害时，若该角色未标记“蜂纹华”，该角色进行一次判定，并标记“蜂纹华”。",
            "ss机动":"机动",
            "ss机动_info":"计算你到其他角色距离时，始终减x，x为你已损失体力值。",
            "ss监视":"监视",
            "ss监视_info":"出牌阶段，你可以观看任意一名角色的手牌和装备牌，然后可以选择一张牌复制，并将其置于牌堆顶。每回合限一次",
            "ss科研":"科研",
            "ss科研_info":"出牌阶段，你可以弃置两张牌，摸一张牌，每回合限一次。",
            "ss毒素":"毒素",
            "ss毒素_info":"出牌阶段，你可以选择一张手牌交给一名其他角色，该角色不能打出或使用与这张牌相同的颜色的牌，直到回合结束，每回合限一次。",
            "ss无处不在":"无处不在",
            "ss无处不在_info":"回合开始前或者回合结束后，若当场上角色人数大于2，你可以和一名其他角色交换位置。",
            "ss薛定谔的喵":"薛定谔的喵",
            "ss薛定谔的喵_info":"锁定技 每当一名角色的卡牌指定你为目标或者你受到伤害时，有50%的概率取消之；当你死亡时，你有50%的概率复活。（薛定谔的猫:一只既存在又不存在的猫）。",
            "ss虚无":"虚无",
            "ss虚无_info":"锁定技 你的体力上限始终为0。",
            "ss战争狂":"战争狂",
            "ss战争狂_info":"锁定技 当一名其他角色造成伤害时，该角色和你各摸一张牌；当你造成伤害时，你摸一张牌。",
            "ss观战":"观战",
            "ss观战_info":"当计算其它角色与你的距离时，始终+1",
            "ss逆扶":"逆扶",
            "ss逆扶_info":"当你的杀或决斗指定一名目标时，你可以交给其一张牌，然后获得其一张牌（包括判定区的牌）；锁定技，你使用的杀需要杀来响应，你的决斗需要闪来响应。",
            "ss洞察":"洞察",
            "ss洞察_info":"锁定技 若你回合内未使用非延时性锦囊牌，你跳过弃牌阶段",
            "ss人偶支配":"人偶支配",
            "ss人偶支配_info":"出牌阶段，你可以弃置两张手牌，指定两名角色，这两名角色标记“支配”，直到你死亡或者下回合开始，每当一名标记“支配”的玩家受伤后，另一名角色进行一次判定，若为红色，则随机弃置x张牌，若为黑色，该角色失去x点体力，x为该角色受到伤害的数量",
            "ss受胎告知":"受胎告知",
            "ss受胎告知_info":"当你死亡时，你可以选择一名其他角色，展示其全部手牌，若手牌中含有红桃牌，则你获得这些红桃牌，你复活并翻面，体力为x，x为该角色以此法交给你的红桃牌数量。",
            "ss遁舜六花":"盾舜六花",
            "ss遁舜六花_info":"出牌阶段，你可以以此法弃置一张手牌并指定一名角色：梅花：该角色获得技能\"反甲\"（当该角色受到伤害时，对方也受到一点伤害）直到受到伤害为止；方块：该角色获得一点护甲；红桃：该角色回复一点体力，然后摸一张牌，不能对自己使用；黑桃：视为对该角色使用了一张无视距离的杀，不能对自己使用。每回合限一次。",
            "ss镜花水月":"镜花水月",
            "ss镜花水月_info":"当一名其他角色的牌指定你为唯一目标时，你可以弃置一张“幻”标记，选择该角色或者该角色攻击范围的另一名角色，该牌的目标转移为该指定角色，然后你判定一次，若为红色且你已受伤，则你回复一点体力，否则你摸一张牌",
            "ss幻象":"幻象",
            "ss幻象_info":"锁定技，每当你受到一点伤害，你标记一张“幻”，你的手牌上限加始终加x，x为你标记的“幻”数量。",
            "ss钢皮":"钢皮",
            "ss钢皮_info":"锁定技，当你受到一名角色伤害时，你判定一次，若判定牌点数小于等于5，伤害减一",
            "ss圣哭螳螂":"圣哭螳螂",
            "ss圣哭螳螂_info":"当你的杀被闪避时，若该角色和你都有手牌，你可以与该角色拼点，输的角色受到一点伤害；若该角色没有手牌，你可以弃置两张手牌，该角色受到一点伤害。",
            "ss豹王之爪":"豹王之爪",
            "ss豹王之爪_info":"锁定技，当你体力不大于三时，你的杀无视距离；当你体力不大于二时，你的杀造成伤害后可以摸一张牌或者回复一点体力，且你回合内可多使用一张杀；当你体力等于一时，你的杀需要两张闪才能闪避，你的手牌上限加二。",
            "ss一击必杀":"一击必杀",
            "ss一击必杀_info":"锁定技，你的杀无视防具且不可闪避，当你的杀对一名角色造成伤害时，该角色立即死亡。",
            "ss侵入":"侵入",
            "ss侵入_info":"出牌阶段，你可以弃置全部手牌（至少一张），选择一名其他角色，你与该角色交换控制权。",
            "ss巨人右臂":"巨人右臂",
            "ss巨人右臂_info":"当你受到伤害时，你可以弃置一张红杀，令此伤害减一",
            "ss恶魔左臂":"恶魔左臂",
            "ss恶魔左臂_info":"锁定技 你黑杀造成的伤害加一。",
            "ss五鬼":"五鬼",
            "ss五鬼_info":"包括以下五个技能:“影鬼”：出牌阶段，你可以弃置一张手牌指定一名你攻击范围内的其他角色，该角色随机展示一张手牌，若该牌为黑色，则视为你对其使用了一张无视防具的杀，若该牌为红色，你获得之。“崭鬼”：当你使用杀时，你可以与该角色拼点，若拼点成功，则该杀无法闪避。“艳鬼”：当你的杀造成伤害时，你可以弃置两张颜色相同的手牌，令伤害加一，若如此做，该角色也可以弃置两张颜色相同的手牌，来减少一点伤害。“赌魔王”：当你使用杀后，若该角色存活，且你和该角色都有牌，你可以令你和该角色各展示牌堆顶一张牌，点数大的一方获得点数小的一方所有牌，若点数相同，双方分别获得展示的牌。“倒翁”：锁定技，你到攻击范围内不包含你的角色攻击距离始终减100。",
            "ss五鬼2":"五鬼",
            "ss五鬼2_info":"",
            "ss影送":"影送",
            "ss影送_info":"当你成为杀的目标时，你可以弃置全部手牌，若没有则不弃，然后判定一次，若为黑色，则取消之，该角色获得判定牌；若为红色，你获得该判定牌。",
            "ss馘蛇":"馘蛇",
            "ss馘蛇_info":"回合开始时，你可以观看牌堆顶两张牌，然后获得其中一张牌，并展示之，若该牌为基本牌，你获得技能“马术”直到回合结束，且本回合你可以多使用一张杀；若不为基本牌，你弃置你武将上的判定牌，然后摸一张牌。",
            "ss阎魔":"阎魔",
            "ss阎魔_info":"锁定技，当你使用黑色牌时，你攻击范围内的其他角色无法使用或打出任何手牌，直到该牌结算之后，且你黑色手牌造成的伤害，均视为一点无属性无来源的伤害",
            "ss蟋蟀":"蟋蟀",
            "ss蟋蟀_info":"锁定技，你不能成为你攻击范围内其他角色黑色牌的目标",
            "ss神枪":"神枪",
            "ss神枪_info":"你的出牌阶段开始，你可以弃置一张牌，然后依次展示牌堆顶的牌，直到花色相同（最多5张），然后你将这些牌置于你武将上（若你的武将上已经有“神枪”标记，你须弃置之），称为“神枪”，每有一张“神枪”，你的攻击距离加一",
            "ss毒刃":"毒刃",
            "ss毒刃_info":"当你的杀对一名角色造成伤害时，若你武将牌上有“神枪”，你可以将你武将牌上的所有“神枪”牌交给该角色，然后该角色翻面。",
            "ss千转白蛇":"千转白蛇",
            "ss千转白蛇_info":"当你受到一名角色伤害时，若你的武将牌上有“神枪”，你可以令该角色代替你受到伤害，然后该角色获得你武将上的牌；否则你获得你武将上的所有牌。",
            "ss黑绳天谴明王":"黑绳天谴明王",
            "ss黑绳天谴明王_info":"限定技，出牌阶段你可以指定一名角色，该角色获得5个“佑护”标记，并获得技能“佑护”，你获得技能“天谴”，该角色视为“黑绳天谴明王”。",
            "ss天谴":"天谴",
            "ss天谴_info":"当你使用一张杀后，若你已发动技能“黑绳天谴明王”，且该角色和天谴明王未死，你可以弃置一张手牌，视为天谴明王对其使用了一张杀。",
            "ss佑护":"佑护",
            "ss佑护_info":"当你受到伤害时，若你武将上的“佑护”数量不小于1且场上有角色拥有技能“黑绳天谴明王”，该角色可以令你减少一个“佑护”标记，防止此伤害，然后你和该角色各摸一张牌，然后该角色失去一点体力（当该角色受伤时，也可以这样做）。",
            "ss腐朽":"腐朽",
            "ss腐朽_info":"弃牌阶段结束时，你需要弃置一张手牌，若你没有手牌则流失一点体力，然后其他角色需依次弃置一张相同类型的牌，否则流失一点体力.",
            "ss叹息":"叹息",
            "ss叹息_info":"当你对一名角色造成伤害或者一名角色对你造成伤害时，你可以弃置该角色一张牌。",
            "ss暗月":"暗月",
            "ss暗月_info":"限定技，出牌阶段，你可以令其他所有角色无法使用或者打出红色牌直到回合结束，然后分别受到一点伤害",
            "ss记忆切割":"记忆切割",
            "ss记忆切割_info":"你的回合外，每当你打出闪或杀时，你可以将场上任意一张牌移至相应位置。",
            "ss虚化":"虚化",
            "ss虚化_info":"摸牌阶段开始前，你可以放弃摸牌，将手牌补至体力上限，指定一名角色，视为你使用了一张无视防具无视距离的杀，该杀不计入回合内出杀限制",
            "ss超速再生":"超速再生",
            "ss超速再生_info":"当你受到伤害后，你展示牌堆顶x张牌，每有一张红色牌，你回复一点体力，然后你摸等同于展示的牌中黑色牌数量的牌，x为你已损失体力值，且最多为3",
            "ss究极辐射波":"究极辐射波",
            "ss究极辐射波_info":"出牌阶段，你可以弃置一张基本牌，然后至多选择6名角色，各受到一点伤害，且不触发任何技能，若你只指定了一名角色，则视为你对该角色打出了x张无视防具的火杀（不计入回合内出杀限制），x为该角色体力值-1（至少为一，最多为6）",
            "ss虚弱":"虚弱",
            "ss虚弱_info":"锁定技，你回合内最多只能使用一张杀，你的手牌上限加x，x为你手牌中杀的数量",
            "ss双鱼理":"双鱼理",
            "ss双鱼理_info":"当一名其他角色的卡牌指定你为唯一目标并且该卡牌结算之后，若你没有因为该卡牌而受到伤害，你可以弃置一张牌，指定一名其他角色，视为你对其使用了一张相同的卡牌；若你因为此卡牌而受到伤害，则无需弃牌",
        },
    },
},files:{"character":["白一护.jpg","更木剑八.jpg","黑翼大魔.jpg","巧木白哉.jpg","薛定谔准尉.jpg","碎蜂.jpg","蓝染惣右介.jpg","东仙要.jpg","黑绳天谴明王.jpg","萨尔阿波罗.jpg","京乐春水.jpg","猿柿日世里.jpg","拜勒岗.jpg","市丸银.jpg","暗黑露琪亚.jpg","崩玉·蓝染.jpg","上校.jpg","涅茧利.jpg","平子真子.jpg","草稚素子.jpg","埼玉.jpg","狛村左阵.jpg","茶渡泰虎.jpg","葛力姆乔.jpg","井上织姬.jpg","浮竹十四郎.jpg","诺伊特拉.jpg"],"card":[],"skill":[]}}};