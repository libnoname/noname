import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"强标包",content:function (config,pack){
    
},precontent:function (){
    
},help:{},config:{},package:{
    character:{
        character:{
            "jiexin_sunjian":["male","wu",4,["xin_yinghun_sunjian","xin_yinghun_sunjian2","xin_cangxi_sunjian"],["zhu"]],
            "xin_sunjian":["male","wu",4,["xin_yinghun_sunjian2","xin_yinghun_sunjian"],["zhu"]],
            "xin_zhoutai":["male","wu",5,["xin_buqv_zhoutai"],[]],
            "jiexin_zhoutai":["male","wu",5,["xin_buqv_zhoutai","xin_fenji_zhoutai","xin_fenji_zhoutai2"],[]],
            "jiexin_gongsunzan":["male","qun",4,["xin_baima_gongsunzan","xin_yicong_gongsunzan","xin_yizhi_gongsunzan"],["zhu"]],
            "xin_gongsunzan":["male","qun",4,["xin_baima_gongsunzan","xin_yicong_gongsunzan"],["zhu"]],
            "xinshen_zhangliao":["male","shen","4/5",["xxyy_duorui","xin_xiying_shenzhangliao","drlt_zhiti"],[]],
            "高览":["male","qun",4,["xin_xiying_gaolan","xin_xiying_gaolan2","gaolan_zhenwang"],["des:高览，东汉末年人物，袁绍部下勇将。官渡之战中，乌巢受袭。郭图建议攻击曹营而不去救乌巢。高览、张郃被派往攻击曹营，为曹军击败。回军时，郭图诬告张郃、高览不尽力迎战，逼使张郃、高览投降曹操，期后下落不明。《三国演义》加插高览攻打汝南，斩杀刘辟，后为赵云斩杀一幕。"]],
            "xin_chendao":["male","shu",4,["xin_wanglie3_chendao","xin_wanglie4_chendao"],[]],
            "张燕":["male","qun",5,["xin_feiyan_zhangyan"],["des:张燕,常山真定人,原姓褚。黄巾军起义时,张燕聚集了一帮少年为强盗,在山水间转战出击,待回到真定时,已有一万多人了。博陵的张牛角也聚合起一伙人,自称将军,与张燕合兵一处。张燕让张牛角做统帅,进兵攻打睰陶。牛角被箭射中,身受重伤,濒临死亡,他告诫众人要聚集在张燕的麾下,说:“你们一定要以张燕为统帅。”牛角死后,张燕做了统帅,所以张燕改姓褚为张。张燕剽捍敏捷超人,所以军中又称他为“飞燕”。其后他的部队不断壮大,与常山、赵郡、中山、上党、河内等地山贼互相联络,那些拉起小队伍的如孙轻、王当等,都带着队伍归附于他,队伍发展到百万,名号为“黑山”。灵帝无法征讨,河北各郡县深受其害。张燕派人到京都拜见灵帝,提出归顺朝廷,灵帝接受并拜张燕为平难中郎将。这以后,董卓挟持灵帝到了长安,天下各路豪杰纷纷起兵,于是张燕领着自己的部队与各路豪杰联合。袁绍与公孙瓒争夺冀州,张燕派将领杜长等人帮助公孙瓒,被袁绍击溃,手下兵士有些自行离散。太祖将平定冀州,张燕派使者去求见,希望能做太祖的辅佐,太祖任命他为平北将军。他率领人马刚到邺城,又被封为安国亭侯,封邑五百户。张燕死后,儿子褚方继承了他的爵位。褚方去世,其子褚融继承爵位。"]],
        },
        translate:{
            "jiexin_sunjian":"界孙坚",
            "xin_sunjian":"孙坚",
            "xin_zhoutai":"周泰",
            "jiexin_zhoutai":"界周泰",
            "jiexin_gongsunzan":"界公孙瓒",
            "xin_gongsunzan":"公孙瓒",
            "xinshen_zhangliao":"神张辽",
            "高览":"高览",
            "xin_chendao":"陈到",
            "张燕":"张燕",
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
            "xin_yinghun_sunjian":{
                audio:"ext:强标包:2",
                nobracket:true,
                trigger:{
                    player:"changeHp",
                },
                direct:true,
                filter:function (event,player){
        return true;
    },
                content:function (){
        'step 0'
        var num1=player.hp;
        var num2=player.maxHp-player.hp;
        event.num1=num1;
        event.num2=num2;
        var str='令目标摸'+get.cnNumber(num1)+'张牌';
        if(num2){
            str+='，然后弃置'+get.cnNumber(num2)+'张牌';
        }
        player.chooseTarget(get.prompt('xin_yinghun_sunjian'),function(card,player,target){
            return true;
        }).set('ai',function(target){
        var num=game.countPlayer(function(current){
            return player.getFriends().contains(current);
            });
            if(player.hp>=player.maxHp-player.hp){
                if(get.attitude(player,target)>0){
                    if(!target.hasJudge('lebu')&&target==player&&target.countCards('h')<3){
                        return 12;
                    }
                    if(target.hasJudge('lebu')&&num>1){
                        return -1;
                    }
                    if(target.countCards('h')<4&!target.hasJudge('lebu')){
                        return target.hp+4;
                    }
                }
                return get.attitude(player,target);
            }
            else{
                if(get.attitude(player,target)<0){
                    if(target.hasSkillTag('doubleDraw')){
                        if(player.hp=player.maxHp-player.hp-1){
                            return -3;
                        }
                        return 0.5;
                    }
                    else{
                        if(!target.hasSkillTag('equipDraw')&&target.countCards('he')>2){
                            return 3;
                        }
                        if(target.hasSkillTag('equipDraw')&&target.countCards('e')<1){
                            return 1;
                        }
                        if(target.hasSkillTag('equipDraw')&&target.countCards('e')>0){
                            return -3;
                        }
                    }
                }
                return -get.attitude(player,target);
            }
        }).set('prompt2',str);
            'step 1'
        if(result.bool){
            player.logSkill('xin_yinghun_sunjian',result.targets);            
            player.line(result.targets[0],'green');
            event.target=result.targets[0];
            result.targets[0].draw(player.hp);
            if(player.hp-player.maxHp<1) event.finish();
            result.targets[0].chooseToDiscard(player.maxHp-player.hp,true,'he');
        }
    },
                ai:{
                    moreDraw:true,
                    maixie:true,
                    effect:{
                        target:function (card,player,target){
                if(target.maxHp<=3) return;
                if(get.tag(card,'damage')){
                    if(target.hp==target.maxHp) return [0,1];
                }
                if(get.tag(card,'recover')&&player.hp>=player.maxHp-1) return [0,1];
            },
                    },
                },
            },
            "xin_yinghun_sunjian2":{
                audio:"ext:强标包:2",
                enable:"phaseUse",
                usable:1,
                filterCard:{
                    type:"basic",
                },
                filter:function (event,player){
        return player.countCards('h',{type:'basic'});
    },
                content:function (){
        'step 0'
        var equip=null, trick=null;
        for(var i=0;i<ui.discardPile.childElementCount;i++){
            var type=get.type(ui.discardPile.childNodes[i],'trick');
            if(type=='trick'){
                trick=ui.discardPile.childNodes[i];
            }
            else if(type=='equip'){
                equip=ui.discardPile.childNodes[i];
            }
            if(trick&&equip){
                break;
            }
        }
        var list=[];
        if(trick) list.push(trick);
        if(equip) list.push(equip);
        if(!list.length){
            player.draw(Math.min(3,1+player.maxHp-player.hp));
        }
        else{
            player.gain(list,'gain2');
            event.equip=equip;
        }
        'step 1'
        if(event.equip&&get.owner(event.equip)==player){
            player.chooseTarget('是否将'+get.translation(event.equip)+'装备给一其角色？',function(card,player,target){
                return target!=player
            }).set('ai',function(target){
                var att=get.attitude(_status.event.player,target);
                if(att>1){
                    if(!target.getEquip(_status.event.subtype)) return att;
                }
                return 0;
            }).set('subtype',get.subtype(event.equip));
        }
        else{
            event.finish();
        }
        'step 2'
        if(result.bool){
            player.line(result.targets,'green');
            player.$give(event.equip,result.targets[0]);
            player.lose(event.equip,ui.special);
        }
        else{
            event.finish();
        }
        'step 3'
        game.delay(0.5);
        'step 4'
        result.targets[0].equip(event.equip);
        'step 5'
        game.delay();
    },
                check:function (card){
        return 7-get.value(card);
    },
                ai:{
                    order:7,
                    result:{
                        player:1,
                    },
                },
            },
            "xin_cangxi_sunjian":{
                audio:"ext:强标包:2",
                unique:true,
                global:"xin_cangxi_sunjian2",
                zhuSkill:true,
                init:function (player){
        player.storage.xin_cangxi_sunjian=0;
    },
                intro:{
                    content:"手牌上限+#",
                },
                mod:{
                    maxHandcard:function (player,num){
            return num+player.storage.xin_cangxi_sunjian;
        },
                },
            },
            "xin_cangxi_sunjian2":{
                audio:"ext:强标包:2",
                trigger:{
                    player:"phaseDiscardEnd",
                },
                filter:function (event,player){
        if(!event.cards||event.cards.length<=1) return false;
        if(player.group!='wu') return false;
        return game.hasPlayer(function(target){
            return player!=target&&target.hasZhuSkill('xin_cangxi_sunjian',player);
        });
    },
                direct:true,
                content:function (){
        'step 0'
        var list=game.filterPlayer(function(current){
            return current!=player&&current.hasZhuSkill('xin_cangxi_sunjian',player);
        });
        list.sortBySeat();
        event.list=list;
        'step 1'
        if(event.list.length){
            var current=event.list.shift();
            event.current=current;
            player.chooseBool(get.prompt('xin_cangxi_sunjian',current)).set('choice',get.attitude(player,current)>0);
        }
        else{
            event.finish();
        }
        'step 2'
        if(result.bool){
            player.logSkill('xin_cangxi_sunjian',event.current);
            player.judge(function(card){
                return _status.event.att*(get.color(card)=='black'?1:0);
            }).set('att',get.sgnAttitude(player,event.current));
        }
        else{
            event.goto(1);
        }
        'step 3'
        if(result.color=='black'){
            var name=get.translation(event.current.name);
            var att=0;
            if(event.current.needsToDiscard()){
                att=1;
            }
            player.chooseControlList(['令'+name+'摸一张牌展示','令'+name+'手牌上永久+1','弃置一张牌并令'+name+'获得一张本回进入弃牌堆的牌'],function(){
                return _status.event.att;
            }).set('att',att);
        }
        else{
            event.goto(1);
        }
        'step 4'
        switch(result.index){
            case 0: event.current.draw('visible');break;
            case 1: {
                if(typeof event.current.storage.xin_cangxi_sunjian!='number'){
                    event.current.storage.xin_cangxi_sunjian=0;
                }
                event.current.storage.xin_cangxi_sunjian++;
                event.current.syncStorage('xin_cangxi_sunjian');
                event.current.markSkill('xin_cangxi_sunjian');
                break;
            }
            case 2: {
                player.chooseToDiscard(true,'he');
                break;
            }
        }
        if(result.index!=2){
            event.goto(1);
        }
        'step 5'
        if(result.bool){
            var discarded=get.discarded();
            if(discarded.length){
                event.current.chooseCardButton('选择一张获得之',discarded,true).set('ai',function(button){
                    return get.value(button.link);
                });
            }
            else{
                event.goto(1);
            }
        }
        else{
            event.goto(1);
        }
        'step 6'
        if(result.bool&&result.links&&result.links.length){
            event.current.gain(result.links,'gain2');
        }
        event.goto(1);
    },
            },
            "xin_fenji_zhoutai":{
                audio:"ext:强标包:2",
                trigger:{
                    player:"phaseDrawBegin",
                },
                frequent:true,
                forced:true,
                check:function (event,player){
        return player.countCards('h')<=player.maxHp||player.skipList.contains('phaseUse');
    },
                content:function (){
        "step 0"
        trigger.num-=2;
        "step 1"
        event.cards=get.cards(event.num);
        player.draw(player.maxHp-player.hp);
    },
                mod:{
                    maxHandcard:function (player,num){
            return num=(player.maxHp-player.hp);
        },
                },
            },
            "xin_buqv_zhoutai":{
                nobracket:true,
                audio:"ext:强标包:2",
                forced:true,
                trigger:{
                    player:"changeHp",
                },
                filter:function (event,player){
    return player.hp<=0;
    },
                content:function (){
    "step 0"
    if(!player.storage.xin_buqv_zhoutai1) player.storage.xin_buqv_zhoutai1=0;
    event.cards=get.cards(0);
 player.showCards(event.cards);
 "step 1"
 if(!player.hasSkill('xin_buqv_zhoutai_spade')&&!player.hasSkill('xin_buqv_zhoutai_heart')&&!player.hasSkill('xin_buqv_zhoutai_diamond')&&!player.hasSkill('xin_buqv_zhoutai_club')){
 player.storage.xin_buqv_zhoutai=get.suit(event.cards);
 if(get.suit(event.cards)=="spade"){
 player.recover(1-player.hp);
 player.removeSkill('xin_buqv_zhoutai_heart');
 player.removeSkill('xin_buqv_zhoutai_club');
 player.removeSkill('xin_buqv_zhoutai_diamond');
 player.addSkill('xin_buqv_zhoutai_spade');
 }
 if(get.suit(event.cards)=="club"){
 player.recover(1-player.hp);
 player.removeSkill('xin_buqv_zhoutai_heart');
 player.removeSkill('xin_buqv_zhoutai_spade');
 player.removeSkill('xin_buqv_zhoutai_diamond');
 player.addSkill('xin_buqv_zhoutai_club');
 }
 if(get.suit(event.cards)=="heart"){
 player.recover(1-player.hp);
 player.removeSkill('xin_buqv_zhoutai_spade');
 player.removeSkill('xin_buqv_zhoutai_club');
 player.removeSkill('xin_buqv_zhoutai_diamond');
 player.addSkill('xin_buqv_zhoutai_heart');
 }
 if(get.suit(event.cards)=="diamond"){
 player.recover(1-player.hp);
 player.removeSkill('xin_buqv_zhoutai_heart');
 player.removeSkill('xin_buqv_zhoutai_club');
 player.removeSkill('xin_buqv_zhoutai_spade');
 player.addSkill('xin_buqv_zhoutai_diamond');
 }
 }
 else{
 if(get.suit(event.cards)==player.storage.xin_buqv_zhoutai){
 player.popup('<span style=\"color: red\">扛不住了</span>');
 }
 else{
 player.storage.xin_buqv_zhoutai=get.suit(event.cards);
 if(get.suit(event.cards)=="spade"){
 player.recover(1-player.hp);
 player.removeSkill('xin_buqv_zhoutai_heart');
 player.removeSkill('xin_buqv_zhoutai_club');
 player.removeSkill('xin_buqv_zhoutai_diamond');
 player.addSkill('xin_buqv_zhoutai_spade');
 }
 if(get.suit(event.cards)=="club"){
 player.recover(1-player.hp);
 player.removeSkill('xin_buqv_zhoutai_heart');
 player.removeSkill('xin_buqv_zhoutai_spade');
 player.removeSkill('xin_buqv_zhoutai_diamond');
 player.addSkill('xin_buqv_zhoutai_club');
 }
 if(get.suit(event.cards)=="heart"){
 player.recover(1-player.hp);
 player.removeSkill('xin_buqv_zhoutai_spade');
 player.removeSkill('xin_buqv_zhoutai_club');
 player.removeSkill('xin_buqv_zhoutai_diamond');
 player.addSkill('xin_buqv_zhoutai_heart');
 }
 if(get.suit(event.cards)=="diamond"){
 player.recover(1-player.hp);
 player.removeSkill('xin_buqv_zhoutai_heart');
 player.removeSkill('xin_buqv_zhoutai_club');
 player.removeSkill('xin_buqv_zhoutai_spade');
 player.addSkill('xin_buqv_zhoutai_diamond');
 }
 }
 }
    },
                group:["xin_buqv_zhoutai_spade","xin_buqv_zhoutai_heart","xin_buqv_zhoutai_club","xin_buqv_zhoutai_heart","xin_buqv_zhoutai_draw"],
                subSkill:{
                    draw:{
                        forced:true,
                        popup:false,
                        trigger:{
                            player:"damageEnd",
                        },
                        filter:function (event,player){
            return player.countCards('h')<player.maxHp-player.hp;
            },
                        content:function (){
            player.logSkill('xin_buqv_zhoutai');
            player.draw(Math.min(5,player.maxHp-player.hp-player.countCards('h')));
            },
                        sub:true,
                    },
                    spade:{
                        mark:true,
                        marktext:"<span style=\"color: black\">♠</span>",
                        intro:{
                            content:"上次<span style=\"color: red\">不屈</span>花色",
                        },
                        sub:true,
                    },
                    club:{
                        mark:true,
                        marktext:"<span style=\"color: black\">♣</span>",
                        intro:{
                            content:"上次<span style=\"color: red\">不屈</span>花色",
                        },
                        sub:true,
                    },
                    heart:{
                        mark:true,
                        marktext:"<span style=\"color: red\">♥</span>",
                        intro:{
                            content:"上次<span style=\"color: red\">不屈</span>花色",
                        },
                        sub:true,
                    },
                    diamond:{
                        mark:true,
                        marktext:"<span style=\"color: red\">◆</span>",
                        intro:{
                            content:"上次<span style=\"color: red\">不屈</span>花色",
                        },
                        sub:true,
                    },
                },
            },
            "xin_fenji_zhoutai2":{
                audio:"ext:强标包:2",
                usable:1,
                trigger:{
                    global:"shaBefore",
                },
                check:function (event,player){
        return get.attitude(player,event[event.name=='gain'?'source':'player'])<0;
    },
                logTarget:function (event){
        return event[event.name=='gain'?'source':'player'];
    },
                content:function (){
        "step 0"
        trigger.cancel();
        "step 1"
        player.loseHp(1);
    },
                result:{
                    player:function (player){
            if(player.hp>0) return -1;
        },
                },
            },
            "xin_baima_gongsunzan":{
                nobracket:true,
                audio:"ext:强标包:2",
                enable:"phaseUse",
                filterTarget:function (card,player,target){
    return target!=player;
    },
                check:function (card){
   if(card.name=="sha") return false;
   return 7-get.value(card);
   },
                line:"green",
                usable:1,
                filterCard:true,
                selectCard:1,
                filter:function (event,player){
     return player.countCards('h')>0;
     },
                content:function (){
     if(!player.storage.xin_baima_gongsunzan) player.storage.xin_baima_gongsunzan=target;
     player.addTempSkill('xin_baima_gongsunzan_effect');
     player.addTempSkill('xin_baima_gongsunzan_delete');
     },
                subSkill:{
                    delete:{
                        forced:true,
                        popup:false,
                        trigger:{
                            player:"phaseEnd",
                        },
                        content:function (){
             delete player.storage.xin_baima_gongsunzan;
             },
                        sub:true,
                    },
                    effect:{
                        mod:{
                            targetInRange:function (card,player,target,now){
            if(player.storage.xin_baima_gongsunzan==target) return true;
        },
                            cardUsable:function (card,player,num){
            if(card.name=='sha') return Infinity;
        },
                        },
                        sub:true,
                        ai:{
                            unequip:true,
                        },
                    },
                },
                ai:{
                    threaten:2,
                    order:9,
                    result:{
                        player:function (player,target){
             if(player.countCards('h',{name:"sha"})>1) return 1;
             return 0;
             },
                        target:-1,
                    },
                },
            },
            "xin_yizhi_gongsunzan":{
                nobracket:true,
                audio:"ext:强标包:2",
                forced:true,
                trigger:{
                    player:"phaseDrawBegin",
                },
                content:function (){
    "step 0"
    trigger.num++;
    "step 1"                
    var color=['red','black'].randomGet();
    var num=[1,2,3,4,5,6,7,8,9,10,11,12,13].randomGet();
    var card=game.createCard({name:'sha'},{color:color},{number:num});
    ui.cardPile.insertBefore(card,ui.cardPile.firstChild);
    },
                ai:{
                    moreDraw:true,
                },
            },
            "xin_yicong_gongsunzan":{
                trigger:{
                    player:["changeHp"],
                },
                audio:"ext:强标包:2",
                forced:true,
                filter:function (event,player){
        return get.sgn(player.hp-2.5)!=get.sgn(player.hp-2.5-event.num);
    },
                content:function (){},
                mod:{
                    globalFrom:function (from,to,current){
            if(from.hp>2) return current-1;
        },
                    globalTo:function (from,to,current){
            if(to.hp<=2) return current+1;
        },
                },
                ai:{
                    threaten:0.8,
                },
            },
            "xin_xiying_shenzhangliao":{
                nobracket:true,
                audio:"ext:强标包:1",
                trigger:{
                    player:"phaseDrawBegin",
                },
                direct:true,
                content:function (){
    "step 0"
    event.num=2;
    "step 1"
     player.chooseTarget(1,'袭营:是否选择获得1名有牌的其他角色1张牌',function(card,player,target){
return target.countCards('he')>0&&target!=player;
}).set('ai',function(target){
var player=_status.event.player;
if((target.hasSkillTag('receiveEquip')||target.hasSkillTag('equipDraw'))&&target.countCards('e')>0) return -100;
if(target.hasSkillTag('noh')&&target.countCards('h')<2) return -100;
if(target.hasSkillTag('nohDamage')) return -100;
return -get.attitude(player,target);
   });
   "step 2"
   if(result.bool){
player.line(result.targets[0],'thunder');
player.logSkill('xin_xiying_shenzhangliao',result.targets);
trigger.num--;
event.target=result.targets[0];
}
else{
event.finish();
}
"step 3"
player.chooseControl('手牌区','装备区').ai=function(){
var num=player.countCards('e');
if(event.target.countCards('e')>0&&!event.target.getEquip('baiyin')&&num<1) return '装备区';
if(event.target.countCards('e')>2&&!event.target.isDamaged()&&event.target.getEquip('baiyin')&&num<2) return '装备区';
if(event.target.countCards('e')>0&&event.target.isDamaged()&&event.target.getEquip('baiyin')) return '手牌区';
if(event.target.countCards('h')<1) return '装备区';
if(event.target.countCards('e')<1) return '手牌区';
return '手牌区';
}
"step 4"
if(result.control=='手牌区'){
if(event.target.countCards('h')>0){
var card=event.target.getCards('h').randomGet();
player.gain(card,event.target);
event.target.$give(card,player);
}
else{
var card=event.target.getCards('e').randomGet();
player.gain(card,event.target);
event.target.$give(card,player);
}
if(!player.storage.xin_xiying_shenzhangliao_card){
player.storage.xin_xiying_shenzhangliao_card=card;
event.goto(5);
}
else{
if(get.color(card)==get.color(player.storage.xin_xiying_shenzhangliao_card)){
event.goto(6);
}
else{
event.goto(5);
}
}
}
if(result.control=='装备区'){
if(event.target.countCards('e')>0){
var card=event.target.getCards('e').randomGet();
player.gain(card,event.target);
event.target.$give(card,player);
}
else{
var card=event.target.getCards('h').randomGet();
player.gain(card,event.target);
event.target.$give(card,player);
}
if(!player.storage.xin_xiying_shenzhangliao_card){
player.storage.xin_xiying_shenzhangliao_card=card;
event.goto(5);
}
else{
if(get.color(card)==get.color(player.storage.xin_xiying_shenzhangliao_card)){
event.goto(6);
}
else{
event.goto(5);
}
}
}
"step 5"
event.num--;
if(event.num>0){
event.goto(1);
}
else{
event.finish();
}
"step 6"
if(get.color(player.storage.xin_xiying_shenzhangliao_card)=='red'){
player.recover();
event.finish();
}
else{
event.num=2;
event.goto(7);
}
"step 7"
player.chooseTarget('是否对1名其他角色造成1点<span style=\"color: red\">雷电伤害</span>',function(card,player,target){
return target!=player;
}).set('ai',function(target){
var player=_status.event.player;
return get.damageEffect(target,player,player,'thunder');
});
"step 8"
if(result.bool){
player.line(result.targets,'thunder');
result.targets[0].damage('thunder');
}
"step 9"
event.num--;
if(event.num>0) event.goto(7);
    },
                group:"xin_xiying_shenzhangliao_clear",
                subSkill:{
                    clear:{
                        popup:false,
                        forced:true,
                        trigger:{
                            player:"phaseEnd",
                        },
                        content:function (){
            delete player.storage.xin_xiying_shenzhangliao_card;
            },
                        sub:true,
                    },
                },
                ai:{
                    threaten:2,
                    expose:0.3,
                },
            },
            "xxyy_duorui1":{
                init:function (player,skill){
 player.disableSkill(skill,player.storage.xxyy_duorui);
 },
                onremove:function (player,skill){
 "step 0"
 player.enableSkill(skill);
 "step 1"
 delete player.storage.xxyy_duorui;
 },
                locked:true,
                mark:true,
                intro:{
                    content:function (storage,player,skill){
 var list=[];
 for(var i in player.disabledSkills){
 if(player.disabledSkills[i].contains(skill)) list.push(i);
 };
 if(list.length){
 var str='失效技能：';
 for(var i=0;i<list.length;i++){
 if(lib.translate[list[i]+'_info']) str+=get.translation(list[i])+'、';
 };
 return str.slice(0,str.length-1);
 };
 },
                },
            },
            "xxyy_duorui":{
                audio:"ext:强标包:2",
                init:function (player){
 player.storage.xxyy_duorui=[];
 },
                trigger:{
                    source:"damageSource",
                },
                filter:function (event,player){
 if(player.storage.xxyy_duorui.length&&player.storage.xxyy_duorui_player.isAlive()) return false;
 return player!=event.player&&event.player.isAlive()&&_status.currentPhase==player;
 },
                check:function (event,player){
 if(player.isDisabled(5)) return false;
 return (get.attitude(player,event.player)<=0);
 /* var skills=event.player.skills.slice(0);
 for(var i=0;i<skills.length;i++){
 var info=get.info(skills[i])
 if(info!=undefined&&!info.charlotte) return true;
 }*/
 },
                content:function (){
 'step 0'

        event.skills=[];
        var skills=trigger.player.skills.slice(0);
        for(var i=0;i<skills.length;i++){
            var info=get.info(skills[i])
            if(info!=undefined&&!info.charlotte&&(!info.unique||info.gainable)) event.skills.push(skills[i]);
        };
        if(player.countDisabled()<5){
            player.chooseToDisable().ai=function(event,player,list){
                if(list.contains('equip5')) return 'equip5';
                return list.randomGet();
            };
        }
 'step 1'
 if(event.skills.length>0){
 player.chooseControl(event.skills).set('prompt','请选择要获得的技能').set('ai',function(){return event.skills.randomGet()});
 }
 else event.finish();
 'step 2'
 player.addTempSkill(result.control,{player:'dieAfter'});
 player.popup(result.control,'thunder');
 player.storage.xxyy_duorui=[result.control]; 
     player.storage.xxyy_duorui_player=trigger.player;
 trigger.player.storage.xxyy_duorui=[result.control];
 trigger.player.addTempSkill('xxyy_duorui1',{player:'dieAfter'});
 game.log(player,'获得了技能','#g【'+get.translation(result.control)+'】')
 },
            },
            "xin_xiying_gaolan":{
                audio:"ext:强标包:2",
                enable:"phaseUse",
                skillAnimation:true,
                usable:1,
                content:function(){
        "step 0"
        player.chooseControlList(
            ['令全部其他角色本回合内全部技能失效。',
            '令全部其他角色本回合无法响应你的牌。'],
            true).set('ai',function(event,player){
            if(player.isDamaged()) return 0;
            return 1;
        });
        "step 1"
        if(result.index==0){
            player.chooseToDiscard(1,'h',true);
            game.countPlayer(function(current){
                if(current!=player&&!current.hasSkill('baiban')){
                    player.line(current,'white');
                    current.addTempSkill('baiban');
                }
            });
        }
        else{
            player.chooseToDiscard(1,'h',true)
            player.addTempSkill('xin_xiying_gaolan_nores');
            game.countPlayer(function(current){
                player.line(current,'white');
            });
        }
        "step 2"
        player.addTempSkill('xin_xiying_gaolan_dis',{player:'phaseBefore'})
    },
                ai:{
                    order:9,
                    result:{
                        player:2,
                    },
                },
                subSkill:{
                    nores:{
                        trigger:{
                            player:"useCard",
                        },
                        silent:true,
                        filter:function (event,player){
                return true;
            },
                        content:function(){
                trigger.nowuxie=true;
                trigger.directHit.addArray(game.players);
            },
                        forced:true,
                        popup:false,
                        sub:true,
                    },
                    dis:{
                        mod:{
                            globalFrom:function (from,to,current){
                    return current-1;
                },
                        },
                        sub:true,
                    },
                },
            },
            "xin_xiying_gaolan2":{
                audio:"ext:强标包:2",
                unique:true,
                init:function (player){
 player.storage.xin_xiying_gaolan2=0;
 },
                mark:true,
                intro:{
                    content:"已累计造成#次伤害",
                },
                trigger:{
                    source:"damageBegin",
                },
                forced:true,
                popup:false,
                content:function (){
 if(player.storage.xin_xiying_gaolan2<2){
 player.storage.xin_xiying_gaolan2++;
 }
 else{
 trigger.num+=trigger.player.getDamagedHp();
 player.storage.xin_xiying_gaolan2=0;
 player.logSkill('xin_xiying_gaolan2');
 }
 player.updateMarks();
 },
            },
            "gaolan_zhenwang":{
                audio:"ext:强标包:1",
                trigger:{
                    player:"die",
                },
                forced:true,
                forceDie:true,
                filter:function(event){
        return event.source!=undefined;
    },
                logTarget:"source",
                skillAnimation:true,
                animationColor:"thunder",
                content:function(){
        trigger.source.discard(trigger.source.getCards(0,'he'));
    },
                ai:{
                    threaten:0.7,
                },
            },
            "xin_wanglie3_chendao":{
                nobracket:true,
                audio:"ext:强标包:2",
                trigger:{
                    global:"useCard",
                },
                prompt:function(event,player){
    return "<span style=\"color: red\">往烈</span>:是否<span style=\"color: red\">取消</span>"+get.translation(event.card)+"的结算并视为对"+get.translation(event.player)+"使用"+get.translation(event.card);
    },
                init:function(player){
    player.storage.xin_wanglie3_chendao=0;
    },
                filter:function(event,player){
    if(event.player==player) return false;
    return event.card.name=="sha"&&event.targets.contains(player);
    },
                check:function (event,player){
   return ai.get.attitude(player,event.player)<=0;
   },
                content:function(){
   "step 0"
   trigger.cancel();
   "step 1"
   player.useCard(trigger.card,trigger.player,false);
   player.storage.xin_wanglie3_chendao++;
   },
                ai:{
                    effect:{
                        target:function (card,player,target){
   if(!target.hasFriend()) return;
   if(target.getEnemies().contains(player)&&card.name=="sha"){
   if(get.distance(target,player,'attack')<=1&&get.distance(player,target,'attack')<=1) return [-1,1];
   return [0.1,-0.1];
   }
   },
                    },
                },
                group:["xin_wanglie3_chendao_player","xin_wanglie3_chendao_target"],
                subSkill:{
                    player:{
                        trigger:{
                            player:"shaMiss",
                        },
                        forced:true,
                        popup:false,
                        filter:function(event,player){
   if(player.storage.xin_wanglie3_chendao<1) return false;
   return event.target!=player;
   },
                        content:function(){
   game.log(player,"<span style=\"color: red\">往烈</span>效果生效");
   trigger.target.line(player,"white");
   player.damage(trigger.target);
   player.storage.xin_wanglie3_chendao--;
   },
                        sub:true,
                    },
                    target:{
                        trigger:{
                            player:"shaHit",
                        },
                        filter:function(event,player){
   if(player.storage.xin_wanglie3_chendao<1) return false;
   return event.target!=player;
   },
                        forced:true,
                        popup:false,
                        content:function(){
   game.log(player,"<span style=\"color: red\">往烈</span>效果生效");
   player.line(trigger.target,"white");
   trigger.target.damage(player);
   player.storage.xin_wanglie3_chendao--;
   },
                        sub:true,
                    },
                },
            },
            "xin_wanglie4_chendao":{
                mod:{
                    targetInRange:function (card,player,target,now){
            if(!player.countUsed()) return true;
        },
                },
                audio:"ext:强标包:2",
                trigger:{
                    player:"useCard",
                },
                filter:function (event,player){
        return _status.currentPhase==player;
    },
                check:function(trigger,player){
        if(player.countCards('h')<=player.hp+1&&((get.type(trigger.card)=='trick'&&game.countPlayer(function(current){return get.attitude(current,player)<=0&&current.countCards('h',{name:'wuxie'})})>0)||trigger.card.name=='sha')) return true;
        return false;
    },
                content:function(){
        trigger.nowuxie=true;
        trigger.directHit.addArray(game.players);
        player.addTempSkill('drlt_wanglie2');
    },
            },
            "xin_feiyan_zhangyan":{
                audio:"ext:强标包:2",
                trigger:{
                    player:["changeHp"],
                },
                forced:true,
                filter:function (event,player){
        return event.num!=0;
    },
                mod:{
                    maxHandcard:function (player,num){
            return num+player.storage.xin_feiyan_zhangyan*2;
        },
                },
                content:function (){
        var num1=Math.abs(trigger.num);
        player.storage.xin_feiyan_zhangyan+=num1;
        player.draw(num1*2);
        game.delay();
    },
                init:function(player){
        player.storage.xin_feiyan_zhangyan=0;
    },
                group:["xin_feiyan_zhangyan_clear","xin_feiyan_zhangyan_damage"],
                subSkill:{
                    clear:{
                        audio:true,
                        trigger:{
                            player:["phaseDiscardAfter"],
                        },
                        forced:true,
                        popup:false,
                        silent:true,
                        content:function (){
                player.storage.xin_feiyan_zhangyan=0;
            },
                        sub:true,
                    },
                    damage:{
                        audio:true,
                        trigger:{
                            player:"damageBegin",
                        },
                        forced:true,
                        filter:function (event,player){
                return event.num>0;
            },
                        priority:-1,
                        content:function (){
                trigger.num=1;
            },
                        sub:true,
                    },
                },
            },
        },
        translate:{
            "xin_yinghun_sunjian":"英魂",
            "xin_yinghun_sunjian_info":"",
            "xin_yinghun_sunjian2":"英魂",
            "xin_yinghun_sunjian2_info":"出阶段限一次，你可以弃置一张基本牌，获得弃牌堆底的一张装备牌和一张锦囊牌，然后你可以将那张装备牌装备给一名角色（允许替换）。如果弃牌堆没有装备以及锦囊牌，则改为摸X张牌，X为损失的体力加一（最多3张）当你的体力值发生变化时，你可以令1名角色摸等同于你体力值的牌，然后弃置等同于你已损失体力值的牌。",
            "xin_cangxi_sunjian":"藏玺",
            "xin_cangxi_sunjian_info":"主公技，其他吴势力角色的弃牌阶段结束时，若其弃置了至少两张牌，则可以选择判定，若是黑色，则其选择一项，1，令主公摸一张并且展示；2，主公手牌上限永久加一；3，额外弃置一张牌，令主公获得本回合进入弃牌堆的一张牌",
            "xin_cangxi_sunjian2":"藏玺",
            "xin_cangxi_sunjian2_info":"",
            "xin_fenji_zhoutai":"奋激",
            "xin_fenji_zhoutai_info":"每个角色的回合限1次。当场上有人使用【杀】指定目标后，你可以失去一点体力，令此【杀】失效。你的摸牌数为x，手牌上限为x。（x为你已损失的体力值）",
            "xin_buqv_zhoutai":"不屈",
            "xin_buqv_zhoutai_info":"锁定技，当你的体力值降到0或更低时，你立即亮出并弃置牌堆顶1张牌，若此牌花色与你前次因此法亮出牌花色不同，你回复体力至1点;你受到伤害后，你将手牌补至X(X为你已损失的体力值且至多为5)。",
            "xin_fenji_zhoutai2":"奋激",
            "xin_fenji_zhoutai2_info":"",
            "xin_baima_gongsunzan":"白马",
            "xin_baima_gongsunzan_info":"出牌阶段限1次，你可以弃置1张手牌指定1名其他角色，若如此做，你获得以下效果直到回合结束。<br>(对其使用牌无距离限制、用杀次数限制、无视防具)",
            "xin_yizhi_gongsunzan":"义志",
            "xin_yizhi_gongsunzan_info":"锁定技，摸牌阶段你额外摸1张牌且必定摸到1张杀。",
            "xin_yicong_gongsunzan":"义从",
            "xin_yicong_gongsunzan_info":"锁定技，只要你的体力值大于2点，你的进攻距离+1；只要你的体力值为2点或更低，你的防御距离+1",
            "xin_xiying_shenzhangliao":"袭营",
            "xin_xiying_shenzhangliao_info":"摸牌阶段限2次，你可以令此阶段摸牌数-1并选择1名有牌的其他角色，获得其随机1张牌(可选择优先获得牌的区域);若你以此法获得了2张牌:颜色均为黑色，你可以对1名其他角色造成1点雷电伤害(可结算2次);颜色均为红色，你回复1点体力。",
            "xxyy_duorui1":"夺锐",
            "xxyy_duorui1_info":"",
            "xxyy_duorui":"夺锐",
            "xxyy_duorui_info":"描述：当你于出牌阶段内对一名其他角色造成伤害后，你可以废除你装备区内的一个装备栏（若已全部废除则可以跳过此步骤），然后获得其的一个技能直到你死亡(包括觉醒技，限定技，主公技等特殊技能，不包括状态技，子技能)。若如此做，该角色该技能失效且你不能再发动〖夺锐〗直到其死亡。",
            "xin_xiying_gaolan":"袭营",
            "xin_xiying_gaolan_info":"",
            "xin_xiying_gaolan2":"袭营",
            "xin_xiying_gaolan2_info":"出牌阶段限1次，你可以选择1项：令全部其他角色本回合内全部技能失效；令全部其他角色本回合无法响应你的牌，若如此你需要弃一张牌且本回合你的进攻距离+1。当你累计造成两次伤害后，下一次造成伤害将会+X(X为目标已损失体力值)",
            "gaolan_zhenwang":"阵亡",
            "gaolan_zhenwang_info":"",
            "xin_wanglie3_chendao":"往烈",
            "xin_wanglie3_chendao_info":"",
            "xin_wanglie4_chendao":"往烈",
            "xin_wanglie4_chendao_info":"出牌阶段，你使用的第一张牌无距离限制；当你于回合内使用牌时，你可以令此牌不能被响应，若如此做，本回合内你不能再使用牌，其他角色对你使用杀时，你可以取消之，若如此做，你视为对其使用1张杀;若你以此法使用的杀被响应，你受到来自目标的1点伤害，否则你对其造成1点伤害。",
            "xin_feiyan_zhangyan":"飞燕",
            "xin_feiyan_zhangyan_info":"锁定技，你受到的伤害最大为1；当你的体力变化时，你摸2X张牌，且本回合手牌上限+2X，X为体力变化值。",
        },
    },
    intro:"\"<b><span class=\\\"yellowtext\\\" style=\\\"color:#FFFF00\\\">拓展作者:</span></b><li>贴吧昵称： </br>是我dio哒--<li>Q群昵称：</br> 叫什么(哒啦啦啦啦)</br></br><b><span class=\\\"yellowtext\\\" style=\\\"color:#FFFF00\\\">更新日志:</span></b></br>2020年2月11日更新列表</br></br><b><span class=\\\"yellowtext\\\" style=\\\"color:#FFFF00\\\">新增武将:</span></b><li>【强标包】</br>张燕<li><b><span class=\\\"yellowtext\\\" style=\\\"color:#FFFF00\\\">武将优化:</span></b></br>无</br>无</br></br></br><li>有bug，可以来联机二群找我\",",
    author:"叫什么",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["张燕.jpg"],"card":[],"skill":[]}}};