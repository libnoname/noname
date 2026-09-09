import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"蔡阳与友",content:function (){
    
    lib.translate.rw_1 = " ";
    lib.translate.rw_5 = "其他";


    lib.characterSort['mode_extension_蔡阳与友']={
        'rw_1':['RWk1','RWd1'],
        'rw_5':['CYZi','JSLi','JSLi2'],
    };

if(lib.config.mode=="brawl"){
if(!lib.storage.scene) lib.storage.scene={};
if(!lib.storage.scene["蔡阳与友"]){
lib.storage.scene["蔡阳与友"]={
    name:"蔡阳与友",
    intro:[
        '抄千里单骑做出来的劣质场景<br><br>',
        '蔡阳死亡时取消之，然后这样那样，最后结束当前回合。<br><br>',
        '剩下的请自行体验，我也不是很懂<br><br>',
        '①存档：您可以在进入下一关时存档（记录关数、蔡阳的技能和蔡友）。下次进入第二关前可进入存档（用记录的关数、蔡阳的技能和蔡友覆盖）<br><br>',
        '②记录：您可以在闯关时点右上角的记录，查看最高、上局以及存档记录'
    ],
    players:[{"name":"JSLi","name2":"none","identity":"fan","position":2,"hp":null,"maxHp":null,"linked":false,"turnedover":false,"playercontrol":false,"handcards":[],"equips":[],"judges":[]},{"name":"CYZi","name2":"none","identity":"fan","position":3,"hp":null,"maxHp":null,"linked":false,"turnedover":false,"playercontrol":false,"handcards":[],"equips":[],"judges":[]},{"name":"JSLi2","name2":"none","identity":"zhu","position":1,"hp":null,"maxHp":null,"linked":false,"turnedover":false,"playercontrol":true,"handcards":[],"equips":[],"judges":[]}],
    cardPileTop:[],
    cardPileBottom:[],
    discardPile:[],
    gameDraw:true,
};
_status.extensionscene=true;}
if(!_status.extensionmade) _status.extensionmade=[];
_status.extensionmade.push("蔡阳与友");
}},package:{
    character:{
        character:{
            RWk1:["male","jin",4,["RWkz"],["des: "]],
            RWd1:["male","shen","3/5",["RWsj5","RWxx"],["des: "]],

            CYZi:["male","qun",1,["RWtg"],["unseen"],["forbidai","des: "]],
            JSLi:["none","qun",1,["RWdc"],["unseen"],["forbidai","des: "]],
            JSLi2:["none","qun",1,["RWxj"],["unseen"],["forbidai","des: "]],
        },
        translate:{

            RWk1:"？",
            RWd1:"¿",

            CYZi:"蔡阳",
            JSLi:" ",
            JSLi2:" ",
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
            "RWsj5":{
                audio:"ext:蔡阳与友:4",
                trigger:{
                    player:"useCard",
                },
                usable:5,
                filter:function (event,player){ 
                    return player.countCards('he')>=1; 
                },
                direct:true,
                content:function (){
                    'step 0'
                    var rw=6-player.storage.counttrigger.RWsj5;
                    player.chooseCard('###【世界】###可以重铸任意张牌（还能发动 '+rw+' 次）',[1,Infinity],'he').set('ai',function(card){
                        return Math.min(8,rw+5)-get.value(card);
                    });
                    'step 1'
                    if(result.bool){
                        player.logSkill('RWsj5');
                        player.say("the ○");
                        player.lose(result.cards,ui.discardPile);
                        player.$throw(result.cards,1000);
                        game.log(player,'将',result.cards,'置入了弃牌堆');
                        player.draw(result.cards.length);
                    }
                    else player.storage.counttrigger.RWsj5--;
                },
                ai:{
                    threaten:3.5,
                },
            },
            "RWxx":{
                audio:"ext:蔡阳与友:4",
                trigger:{
                    global:"dying",
                },
                filter:function (event,player){
                    return player!=event.player&&player.isDamaged();
                },
                check:function (event,player){
                    return get.attitude(player,event.player)<0;
                },
                logTarget:"player",
                content:function (){
                    'step 0'
                    player.say("☟");
                    player.recover();
                    trigger.player.hp--;
                    trigger.player.update();
                    'step 1'
                    if(Math.random()>0.76){
                        player.awakenSkill('RWxx');
                        if(player.hasSkill('RWsj5')) player.removeSkill('RWsj5');
                        if(!player.hasSkill('RWsj9')) player.addSkill('RWsj9');
                        game.broadcastAll()+player.node.avatar.setBackgroundImage('extension/蔡阳与友/dio2.jpg');
                        player.maxHp++;
                        player.hp=player.maxHp;
                        player.update();
                        player.say("☞");
                        if(!player.hasSkill('RWhigh')) player.addSkill('RWhigh');
                        game.log(player,'【☞】','high dio');
                    }
                },
                derivation:["RWsj9","RWhigh"],
                ai:{
                    threaten:function (player,target){ 
                        if(target.isHealthy()) return 0.8; 
                        return 2; 
                    },
                },
            },
            "RWsj9":{
                audio:"RWsj5",
                trigger:{
                    player:"useCard",
                },
                usable:9,
                filter:function (event,player){ 
                    return player.countCards('he')>=1; 
                },
                direct:true,
                content:function (){
                    'step 0'
                    var rw=10-player.storage.counttrigger.RWsj9;
                    player.chooseCard('###【世界】###可以重铸任意张牌（还能发动 '+rw+' 次）',[1,Infinity],'he').set('ai',function(card){
                        return 8-get.value(card);
                    });
                    'step 1'
                    if(result.bool){
                        player.logSkill('RWsj9');
                        player.say(["無駄無駄無駄無駄無駄無駄無駄無駄無駄無駄無駄無駄無駄無駄無駄無駄無駄無駄無駄無駄無駄無駄無駄無駄無駄無駄無駄無駄無駄無駄無駄無駄無駄無駄無駄無駄無駄無駄無駄無駄無駄無駄無駄無駄!","砸瓦鲁多！","停止吧！时间","哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈！！！！"].randomGet());
                        player.lose(result.cards,ui.discardPile);
                        player.$throw(result.cards,1000);
                        game.log(player,'将',result.cards,'置入了弃牌堆');
                        player.draw(result.cards.length);
                    }
                    else player.storage.counttrigger.RWsj9--;
                },
                ai:{
                    threaten:3.5,
                },
            },
            RWhigh:{
                audio:"ext:蔡阳与友:4",
                trigger:{
                    player:["phaseZhunbeiBegin","phaseJieshuBegin"],
                    global:"dieEnd",
                },
                filter:function(event,player){
                    if(event.name!="die") return event.name=="phaseZhunbei"||player.countCards('h')>0;
                     return event.player!=player&&player.isDamaged();
                },
                direct:true,
                content:function (){
                    player.logSkill('RWhigh');
                    if(trigger.name=="die"){
                        player.say(["老东西，你的替身最没用啦！","论实力你还是比不过我DIO大爷哒!","来我身边吧，我能让你得到永远的安心","high","如果有神在操作命运的话！我们的关系一定被他安排的很巧妙吧！我们在这个世界上是注定要合而为一的！","猪吃草、人吃猪、而我吃人……以人为食才是真正的万物主宰者！","呵哈哈哈啊哈哈哈哈！","人的能力真是有限啊","猴子是永远不可能超越人类的！而你对我来说，不过就是只猴子罢了！","平角裤！","食我压路机","成功了！一切都结束了！","只有这个…只有这个能使我获得满足感！","下一个就是承太郎，你这家伙了！","想测试一下我的『世界』比你强多少。<br>算了，应该也没必要测试了。"].randomGet());
                        player.recover();
                    }
                    else{
                        player.say(["Wryyyyyyyyyyyyyyy","所谓“活着”就是要克服恐惧，而站在世界顶点的，便是那没有一丝恐惧的人！","你在看着我对吧！","high","呵哈哈哈啊哈哈哈哈！","你能记得你吃过多少块面包吗？","给我开车！","难道你不觉得这条路很眼熟吗？","过程和方法之类……那都不重要！！！","难道你不觉得这条路很眼熟吗？"].randomGet());
                        if(trigger.name=="phaseZhunbei") player.draw();
                        else player.discard(player.getCards('h'));
                    }
                },
                ai:{
                    threaten:2,
                },
            },
            "RWja":{
                audio:"RWkz",
                trigger:{
                    target:"useCardToTarget",
                },
                filter:function (event,player){
                    return get.color(event.card)=='red';
                },
                frequent:true,
                content:function (){
                    player.draw();
                },
                ai:{
                    effect:{
                        target:function (card,player,target){
                            if(get.color(card)=='red') return [1,0.6];
                        },
                    },
                },
            },
            "RWyz":{
                audio:"RWkz",
                trigger:{
                    player:"phaseDrawBegin2",
                },
                frequent:true,
                content:function (){
                    trigger.num++;
                },
            },
            "RWby":{
                audio:"RWkz",
                trigger:{
                    player:"phaseJieshuBegin",
                },
                frequent:true,
                content:function (){
                    player.draw();
                },
            },
            "RWjz":{
                audio:"RWkz",
                trigger:{
                    target:"useCardToTargeted",
                },
                filter:function (event,player){
                    return get.type(event.card)=='trick';
                },
                frequent:true,
                content:function (){
                    player.draw();
                },
                ai:{
                    effect:{
                        target:function (card,player,target){
                            if(get.type(card)=='trick') return [1,0.6];
                        },
                    },
                },
            },
            "RWpx":{
                audio:"RWkz",
                mod:{
                    targetEnabled:function (card,player,target,now){
                        if(target.isDamaged()&&get.type(card)=='delay') return false;
                    },
                },
            },
            "RWfy":{
                audio:"RWkz",
                mod:{
                    globalTo:function (from,to,distance){
                        if(to.isHealthy()) return distance+1;
                    },
                },
            },
            "RWzj":{
                audio:"RWkz",
                mod:{
                    globalFrom:function (from,to){
                        if(from.hp>=to.hp) return -Infinity;
                    },
                },
            },
            "RWyc":{
                audio:"RWkz",
                mod:{
                    targetEnabled:function (card,player,target,now){
                        if(target.countCards('h')>=target.hp&&card.name=='sha'&&get.color(card)=='black') return false;
                    },
                },
            },
            "RWjjsw":{
                audio:"RWkz",
                mark:true,
                intro:{
                    content:function (storage,player,skill){
                        var r='必定选项：';
                        if(player.storage.RWjjsw_x) r+=player.storage.RWjjsw_x;
                        else r+='无';
                        return r+'<br>【放弃思考】 '+storage;
                    },
                },
                init:function (player){
                    if(!player.storage.RWjjsw) player.storage.RWjjsw=0;
                },
                trigger:{
                    player:"changeHp",
                },
                derivation:["RWmyyg","RWzjqq","RWfqsk","RWwin"],
                forced:true,
                content:function (){
                    'step 0'
                    var list=[];
                    if(player.storage.RWjjsw_x) list.push(player.storage.RWjjsw_x);
                    else list.push(["☼","➷","　","♪"].randomGet());
                    list.push(["☼","➷","　","♪"].randomGet());
                    player.chooseControl(list,function(event,player){
                        if(player.countCards('h')<=0&&(list[0]=='➷'||list[1]=='➷')) return '➷';
                        if(list[0]=='☼'||list[1]=='☼') return '☼';
                        if(list[0]=='♪'||list[1]=='♪') return '♪';
                        if(list[0]=='　') return list[1];
                        return list[0];
                    });
                    event.list=list;
                    'step 1'
                    if(result.index==0) player.storage.RWjjsw_x=event.list[1];
                    else player.storage.RWjjsw_x=event.list[0];
                    if(result.control=='☼'){
                        player.logSkill('RWmyyg');
                        player.draw();
                    }
                    if(result.control=='➷'){
                        player.logSkill('RWzjqq');
                        player.chooseToDiscard(true).ai=function(card){
                            return -get.value(card);
                        };
                    }
                    if(result.control=='　'){
                        player.logSkill('RWfqsk');
                        player.storage.RWjjsw++;
                        player.markSkill('RWjjsw');
                        game.log(player,'【放弃思考】',' '+player.storage.JJjjsw); 
                    }
                    if(result.control=='♪') player.logSkill('RWwin');
                },
                group:["RWjjsw_x"],
                subSkill:{
                    x:{
                        audio:"RWkz",
                        trigger:{
                            player:"phaseBefore",
                        },
                        filter:function (event,player){
                            return player.storage.RWjjsw>=1;
                        },
                        silent:true,
                        firstDo:true,
                        content:function (){
                            'step 0'
                            player.storage.RWjjsw--;
                            player.markSkill('RWjjsw');
                            game.log(player,'【放弃思考】',' '+player.storage.RWjjsw); 
                            'step 1'
                            var evt=_status.event.getParent('phase');
                            if(evt){
                                game.resetSkills();
                                _status.event=evt;
                                _status.event.finish();
                                _status.event.untrigger(true);
                            }
                        },
                        sub:true,
                    },
                },
            },
            "RWmyyg":{
                audio:"RWkz",
            },
            "RWzjqq":{
                audio:"RWkz",
            },
            "RWfqsk":{
                audio:"RWkz",
            },
            "RWwin":{
                audio:"RWkz",
            },
            RWkz:{
                audio:"ext:蔡阳与友:4",
                trigger:{
                    global:"roundStart",
                },
                forced:true,
                derivation:["RWja","RWyz","RWby","RWjz","RWpx","RWfy","RWzj","RWyc","RWjjsw","RWmyyg","RWzjqq","RWfqsk","RWwin"],
                content:function (){
                    player.draw();
                    var list=[];
                    if(!player.hasSkill('RWja')){
                        list.push('RWja');
                    }
                    if(!player.hasSkill('RWyz')){
                        list.push('RWyz');
                    }
                    if(!player.hasSkill('RWby')){
                        list.push('RWby');
                    }
                    if(!player.hasSkill('RWjz')){
                        list.push('RWjz');
                    }
                    if(!player.hasSkill('RWpz')){
                        list.push('RWpx');
                    }
                    if(!player.hasSkill('RWfy')){
                        list.push('RWfy');
                    }
                    if(!player.hasSkill('RWzj')){
                        list.push('RWzj');
                    }
                    if(!player.hasSkill('RWyc')){
                        list.push('RWyc');
                    }
                    if(list.length){
                        var num=list.randomGet();
                        player.addSkill(num)&&player.popup(num);
                    }
                    if(list.length-1<=player.getDamagedHp()){
                        player.awakenSkill('RWkz');
                        game.broadcastAll()+player.node.avatar.setBackgroundImage('extension/蔡阳与友/kazi2.jpg');
                        player.maxHp++;
                        player.hp=player.maxHp;
                        player.update(); 
                        if(!player.hasSkill('RWjjsw')) player.addSkill('RWjjsw');
                        game.log(player,'【逐光】','究极');
                    }
                },
                ai:{
                    threaten:6,
                },
            },



            "RWdc":{
                nobracket:true,
                trigger:{
                    global:"roundStart",
                },
                unique:true,
                silent:true,
                content:function (){
                    player.init(["caocao","simayi","xiahoudun","zhangliao","xuzhu","guojia","zhenji","liubei","guanyu","zhangfei","zhugeliang","zhaoyun","machao","huangyueying","sunquan","ganning","lvmeng","huanggai","zhouyu","daqiao","luxun","sunshangxiang","huatuo","lvbu","diaochan","huaxiong","re_yuanshu"].randomGet());
                },
            },
            "RWtg":{
                trigger:{
                    player:"dieBegin",
                },
                unique:true,
                silent:true,
                lastDo:true,
                content:function (){
                    'step 0'
                    trigger.cancel();
                    player.init('CYZi');
                    player.link(false);
                    player.turnOver(false);
                    player.lose(player.getCards('hej'))._triggered=null;
                    game.zhu.changeHujia();
                    if(lib.config.rw_level8&&!lib.config.rw_level0){
                        game.zhu.chooseControl('快让我进入存档','我只想随便玩玩').set('prompt','###检测到您已存档###存档：第 '+(lib.config.rw_level5+1)+' 关<br>'+lib.config.rw_level8+'<br><br>您要进入存档了吗！');
                    }
                    'step 1'
                    lib.config.rw_level0=true;
                    if(result.control=='快让我进入存档'){
                        lib.config.rw_level1=lib.config.rw_level5;
                        game.saveConfig('rw_level3',lib.config.rw_level1);
                        _status.event.goto(5);
                    }
                    else{
                        lib.config.rw_level1++;
                        if(!lib.config.rw_level||lib.config.rw_level<lib.config.rw_level1){
                            game.saveConfig('rw_level',lib.config.rw_level1);
                            game.saveConfig('rw_level2',lib.config.rw_level4);
                        }
                        game.saveConfig('rw_level3',lib.config.rw_level1);
                    }
                    'step 2'
                    var add=Math.floor(lib.config.rw_level1/6);
                    player.hp+=add;
                    player.maxHp+=add;
                    player.update();
                    player.gain(get.cards(4));
                    game.triggerEnter(player);
                    if(lib.config.rw_level1%6>0){
                        event.list=['lggdx','lggxl','lggyh','lggzss','lgggx','jiang','lggjxx','lgggl','lggll','lggzy','lggsx','lggfj','lggfw','lggxss','lggpk','ccxlj','ccxjx'].randomGets(lib.config.rw_level1%6);
                        for(var i=0;i<event.list.length;i++){
                            player.addSkill(event.list[i]);
                        }
                    }
                    else player.addSkill('zhuixi');
                    if(game.dead&&game.dead.length>0){
                        var source=game.dead[0];
                        source.revive(null,false);
                        source.uninit();
                    }
                    if(game.hasPlayer(function(current){ return current!=player&&current.identity=='fan' })){
                        var source=game.filterPlayer(function(current){ return current!=player&&current.identity=='fan' })[0];
                        source.init(["caocao","simayi","xiahoudun","zhangliao","xuzhu","guojia","zhenji","liubei","guanyu","zhangfei","zhugeliang","zhaoyun","machao","huangyueying","sunquan","ganning","lvmeng","huanggai","zhouyu","daqiao","luxun","sunshangxiang","huatuo","lvbu","diaochan","huaxiong","re_yuanshu"].randomGet());
                        source.link(false);
                        source.lose(source.getCards('hej'))._triggered=null;
                        source.gain(get.cards(4));
                        event.zs=source;
                    }
                    'step 3'
                    if(player.getSkills().length>1){
                        lib.config.rw_level11='对手是有<font color=green>';
                        for(var i=1;i<player.getSkills().length;i++){
                            lib.config.rw_level11+='"'+get.translation(player.getSkills()[i])+'"';
                            if(i+1<player.getSkills().length) lib.config.rw_level11+='、';
                        }
                        lib.config.rw_level11+='</font>的蔡阳和他的朋友 <font color=yellow>'+get.translation(event.zs.name)+'</font>';
                    }
                    else lib.config.rw_level11='对手是白板蔡阳和他的朋友 <font color=yellow>'+get.translation(event.zs.name)+'</font>';
                    game.zhu.chooseControl('开打','先存个档',function(event,player){
                        return 1;
                    }).set('prompt','###恭喜您，打败了一只蔡阳！###本次 <font color=red>第'+(lib.config.rw_level1+1)+'关</font> 的'+lib.config.rw_level11+'<br><br>请击败他们并挑战下一关吧！');
                    'step 4'
                    if(result.control=='先存个档'){
                        game.saveConfig('rw_level5',lib.config.rw_level3);
                        lib.config.rw_level6=[];
                        for(var i=1;i<player.getSkills().length;i++){
                            lib.config.rw_level6.push(player.getSkills()[i]);
                        }
                        game.saveConfig('rw_level6',lib.config.rw_level6);
                        game.saveConfig('rw_level7',event.zs.name);
                        game.saveConfig('rw_level8',lib.config.rw_level11);
                    }
                    event.goto(6);
                    'step 5'
                    var add=Math.floor(lib.config.rw_level5/6);
                    player.hp+=add;
                    player.maxHp+=add;
                    player.update();
                    player.gain(get.cards(4));
                    game.triggerEnter(player);
                    for(var i=0;i<lib.config.rw_level6.length;i++){
                        player.addSkill(lib.config.rw_level6[i]);
                    }
                    if(game.dead&&game.dead.length>0){
                        var source=game.dead[0];
                        source.revive(null,false);
                        source.uninit();
                    }
                    if(game.hasPlayer(function(current){ return current!=player&&current.identity=='fan' })){
                        var source=game.filterPlayer(function(current){ return current!=player&&current.identity=='fan' })[0];
                        source.init(lib.config.rw_level7);
                        source.lose(source.getCards('hej'))._triggered=null;
                        source.gain(get.cards(4));
                    }
                    'step 6'
                    var cards=Array.from(ui.ordering.childNodes);
                    while(cards.length){
                        cards.shift().discard();
                    }
                    var evt=_status.event.getParent('phase');
                    if(evt){
                        game.resetSkills();
                        _status.event=evt;
                        _status.event.finish();
                        _status.event.untrigger(true);
                    }
                },
            },
            "RWxj":{
                nobracket:true,
                trigger:{
                    global:"roundStart",
                },
                unique:true,
                silent:true,
                content:function (){
                    'step 0'
                    ui.rwptd=ui.create.system('看看你的',null,true);
                    lib.setPopped(ui.rwptd,function(){
                    var uiintro=ui.create.dialog('hidden');
                    uiintro.addText((lib.config.rw_level2?('您曾通过第 '+lib.config.rw_level+' 关，所用武将为：'+lib.config.rw_level2+'<br><br><br><br>'):'<font color=red>无</font><br><br><br><br>')+(lib.config.rw_level10?('上次在第 '+(lib.config.rw_level9+1)+' 关结束，所用武将为：'+lib.config.rw_level10+'<br><br><br><br>'):'<font color=red>no</font><br><br><br><br>')+(lib.config.rw_level8?('您的存档：<font color=red>第'+(lib.config.rw_level5+1)+'关</font><br>'+lib.config.rw_level8):'<font color=red>没有</font>'));
                    uiintro.content.lastChild.style.paddingBottom='8px';
                    return uiintro;
                    },150);
                    if(lib.config.rw_level3||lib.config.rw_level3==0) game.saveConfig('rw_level9',lib.config.rw_level3);
                    if(lib.config.rw_level4) game.saveConfig('rw_level10',lib.config.rw_level4);
                    'step 1'
                    // dialog.add([list.randomGets(5),'character']);
                    player.chooseButton(true).set('ai',function(button){
                        return get.rank(button.link,true)-lib.character[button.link][2];
                    }).set('createDialog',['###请选择闯关武将###',[_status.characterlist.randomGets(5),'character']]);
                    'step 2'
                    player.init(result.links[0]);
                    player.hp+=2;
                    player.maxHp+=2;
                    player.update();
                    'step 3'
                    lib.config.rw_level1=0;
                    game.saveConfig('rw_level3',0);
                    game.saveConfig('rw_level4',get.translation(player.name)+'，id：'+player.name);
                },
            },



            lggdx:{
                trigger:{
                    player:"phaseBegin",
                },
                check:function (event,player){
                    if(!player.hasSkill('lggzn')) return true;
                    if(player.hasSkill('lggws')) return false;
                    return true;
                },
                derivation:["lggws","lggzm"],
                content:function (){
                    player.removeSkill('lggdx');
                    if(!player.hasSkill('lggws')) player.addSkill('lggws');
                    if(!player.hasSkill('lggzm')) player.addSkill('lggzm');
                },
	ai:{
	    threaten:1.3,
	},
            },
            lggws:{
                trigger:{
                    source:"damageEnd",
                },
                filter:function (event,player){
                    return event.card&&event.card.name=='sha';
                },
                frequent:function (event,player){
                    if(!player.hasSkill('lggzn')) return true;
                    if(player.hasSkill('lggdx')) return false;
                    return true;
                },
                check:function (event,player){
                    if(!player.hasSkill('lggzn')) return true;
                    if(player.hasSkill('lggdx')) return false;
                    return true;
                },
                derivation:["lggdx","lggzm"],
                shaRelated:true,
                content:function (){
                    "step 0"
                    player.removeSkill('lggws');
                    if(!player.hasSkill('lggdx')) player.addSkill('lggdx');
                    if(!player.hasSkill('lggzm')) player.addSkill('lggzm');
                    "step 1"
                    player.gain(game.createCard('sha'),'log','gain2');
                },
	ai:{
	    threaten:1.3,
	},
            },
            lggzm:{
                trigger:{
                    source:"damageBegin",
                },
                filter:function (event,player){
                    return event.num>1&&event.player.isAlive();
                },
                frequent:function (event,player){
                    if(!player.hasSkill('lggzn')) return true;
                    if(player.hasSkill('lggdx')&&player.hasSkill('lggws')) return false;
                    return true;
                },
                check:function (event,player){
                    if(!player.hasSkill('lggzn')) return true;
                    if(player.hasSkill('lggdx')&&player.hasSkill('lggws')) return false;
                    return true;
                },
                derivation:["lggdx","lggws"],
                content:function (){
                    "step 0"
                    player.removeSkill('lggzm');
                    if(!player.hasSkill('lggdx')) player.addSkill('lggdx');
                    if(!player.hasSkill('lggws')) player.addSkill('lggws');
                    "step 1"
                    trigger.num--;
                    player.draw(2);
                },
                ai:{
                    threaten:1.2,
                },
            },
            lggxl:{
                audio:"xiangle",
                trigger:{
                    player:["phaseJudgeBefore","phaseUseBefore","phaseDiscardBefore"],
                },
                logTarget:function (event,player){
                    if(event.name=="phaseJudge") return " <font color=red>判定阶段</font> ";
                    if(event.name=="phaseUse") return " <font color=black>出牌阶段</font> ";
                    return " <font color=green>弃牌阶段</font> ";
                },
                check:function (event,player){
                    if(event.name=="phaseUse"){
                        if(game.hasPlayer(function(current){ return current.hasSkill('lggfq1'); })) return false;
                        return [false,true,true,true].randomGet();
                    }
                    return true;
                },
                content:function (){
                    "step 0"
                    trigger.cancel();
                    "step 1"
                    player.draw(player.getHistory('skipped').length);
                },
                ai:{
                    effect:{
                        target:function (card,player,target){
                            if(get.type(card)=='delay') return 'zerotarget';
                        },
                    },
                    threaten:4,
                },
            },
            lggyh:{
                audio:"yinghun",
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                filter:function (event,player){
                    return player.isDamaged();
                },
                frequent:true,
                content:function (){
                    player.recover();
                },
                ai:{
                    threaten:0.9,
                },
            },
            lggzss:{
                audio:"zhishou",
                trigger:{
                    global:"phaseAfter",
                    player:"dyingAfter",
                },
                filter:function (event,player){
                    if(event.name=='dying') return player.countCards('he')>=1&&!player.hasSkill('lggzss1');
                    return player.hasSkill('lggzss1');
                },
                direct:true,
                content:function (){
                    "step 0"
                    if(trigger.name=='dying'){
                        player.chooseToDiscard('###【宗室】###可以弃置一张牌并获得“宗室”标记','he').set('ai',function(card){
                            return 22-get.value(card);
                        });
                    }
                    else{
                        player.logSkill('lggzss1');
                        player.removeSkill('lggzss1');
                        player.insertPhase();
                        event.finish();
                    }
                    'step 1'
                    if(result.bool){
                        player.logSkill('lggzss');
                        player.addSkill('lggzss1');
                    }
                },
                ai:{
                    threaten:0.9,
                },
            },
            lggzss1:{
                marktext:"z",
                mark:true,
                intro:{
                    content:"已用宗室",
                },
            },
            lgggx:{
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                filter:function (event,player){
                    return player.previous.countGainableCards(player,'h');
                },
                check:function (event,player){
                    if(get.attitude(player,player.previous)>0) return false;
                    return player.hp>1;
                },
                content:function (){
                    "step 0"
                    player.gainPlayerCard('h',player.previous,true);
                    player.loseHp();
                    "step 1"
                    if(result.bool&&result.cards[0]){
                        var rw=result.cards[0];
                        player.gain([game.createCard(rw.name,rw.suit,rw.number,rw.nature),game.createCard(rw.name,rw.suit,rw.number,rw.nature)],'log','gain2');
                    }
                },
                ai:{
                    threaten:1.5,
                },
            },
            lggjxx:{
                audio:"jianxiong",
                enable:"phaseUse",
                filter:function (event,player){
                    if(player.hasSkill('lggjxx_1')&&player.hasSkill('lggjxx_2')&&player.hasSkill('lggjxx_3')) return false;
                    return true;
                },
                filterTarget:function (card,player,target){
                    return player!=target;
                },
                content:function (){
                    "step 0"
                    var list=[];
                    if(!player.hasSkill('lggjxx_1')) list.push('位置');
                    if(!player.hasSkill('lggjxx_2')) list.push('体力值');
                    if(!player.hasSkill('lggjxx_3')) list.push('手牌数');
                    player.chooseControl(list,function(event,player){
                            if(!player.hasSkill('lggjxx_1')&&get.attitude(player,target.next)>3&&target.next!=player&&get.attitude(player,target.previous)>3&&target.previous!=player) return 0;
                            if(!player.hasSkill('lggjxx_1')&&get.attitude(player,player.next)<=3&&get.attitude(player,target.previous)>3&&target.previous!=player) return 0;
                            if(!player.hasSkill('lggjxx_1')&&get.mode()=='versus'&&get.attitude(player,target.next)>3&&target.next!=player&&target.previous!=player) return 0;
                            if(!player.hasSkill('lggjxx_2')&&target.hp-player.hp>=1) return '体力值';
                            if(!player.hasSkill('lggjxx_3')&&target.countCards('h')-player.countCards('h')>1) return '手牌数';
                        return list.randomGet();
                    }).set('prompt','您到底看上 '+get.translation(target)+' 哪点！');
                    "step 1"
                    if(result.control=='位置'){
                        game.log(player,'【想取代 '+get.translation(target)+' 】');
                        player.addTempSkill('lggjxx_1');
                        game.swapSeat(player,target);
                    }
                    if(result.control=='体力值'){
                        player.addTempSkill('lggjxx_2');
                        var r=player.hp;
                        var w=target.hp;
                        if(r>w) game.log(player,'【馋 '+get.translation(target)+' 松松的身体】');
                        if(r<w) game.log(player,'【馋 '+get.translation(target)+' 紧紧的身体】');
                        if(r==w) game.log(player,'【馋 '+get.translation(target)+' 】');
                        player.changeHp(Math.min(player.getDamagedHp(),w-r));
                        target.changeHp(Math.min(target.getDamagedHp(),r-w));
                        if(player.hp<=0){
                            player.dying();
                        }
                        if(target.hp<=0){
                            target.dying();
                        }
                    }
                    if(result.control=='手牌数'){
                        game.log(player,'【希望能和 '+get.translation(target)+' 参加变形计】');
                        player.addTempSkill('lggjxx_3');
                        var r=player.countCards('h');
                        var w=target.countCards('h');
                        if(r>w){
                            player.chooseToDiscard(r-w,true);
                            target.draw(r-w);
                        }
                        if(r<w){
                            player.draw(w-r);
                            target.chooseToDiscard(w-r,true);
                        }
                    }
                },
                ai:{
                    order:10,
                    result:{
                        player:function (player,target){
                            if(!player.hasSkill('lggjxx_1')&&get.attitude(player,target.next)>3&&target.next!=player&&get.attitude(player,target.previous)>3&&target.previous!=player) return 10;
                            if(!player.hasSkill('lggjxx_1')&&get.attitude(player,player.next)<=3&&get.attitude(player,target.previous)>3&&target.previous!=player) return 7;
                            if(!player.hasSkill('lggjxx_1')&&get.mode()=='versus'&&get.attitude(player,target.next)>3&&target.next!=player&&target.previous!=player) return 5;
                            return 0;
                        },
                        target:function (player,target){
                            if(!player.hasSkill('lggjxx_2')&&target.hp-player.hp>=1) return player.hp-target.hp;
                            if(!player.hasSkill('lggjxx_3')&&target.countCards('h')-player.countCards('h')>1) return player.countCards('h')-target.countCards('h');
                            return 0;
                        },
                    },
                    threaten:4,
                },
                group:["lggjxx_x"],
                subSkill:{
                    x:{
                        audio:"jianxiong",
                        trigger:{
                            player:"phaseJieshuBegin",
                        },
                        filter:function (event,player){
                            return player.hasSkill('lggjxx_1')||player.hasSkill('lggjxx_2')||player.hasSkill('lggjxx_3');
                        },
                        direct:true,
                        content:function (){
                            player.logSkill('lggjxx_x');
                            if(player.hasSkill('lggjxx_1')){
                                game.swapSeat(player,player.previous);
                            }
                            if(player.hasSkill('lggjxx_2')){
                                for(var r=0;r<game.players.length;r++){
                                    if(!w) var w=player;
                                    w.loseHp();
                                    var w=w.next;
                                }
                            }
                            if(player.hasSkill('lggjxx_3')&&player.countCards('h')>0){
                                player.discard(player.getCards('h')); 
                                player.recover(); 
                            }
                        },
                        sub:true,
                    },
                    1:{
                        sub:true,
                    },
                    2:{
                        sub:true,
                    },
                    3:{
                        sub:true,
                    },
                },
            },
            lgggl:{
                audio:"ganlu",
                trigger:{
                    global:"dieBefore",
                },
                check:function (event,player){
                    return get.attitude(player,event.player)>0;
                },
                marktext:"g",
                mark:true,
                intro:{
                    content:"傻了吧，爷有甘露",
                },
                content:function (){
                    "step 0"
                    trigger.cancel();
                    player.removeSkill('lgggl');
                    "step 1"
                    if(trigger.player.hp<2) trigger.player.recover(2-trigger.player.hp);
                    trigger.player.draw(2);
                },
                ai:{
                    threaten:3.5,
                },
            },
            lggll:{
                audio:"liuli",
                trigger:{
                    player:"phaseDrawEnd",
                },
                filter:function (event,player){
                    return player.countCards('he')>0;
                },
                forced:true,
                content:function (){
                    var hs=player.getCards('he');
                    if(hs.length){
                        var hs2=[];
                        for(var i=0;i<hs.length;i++){
                            hs2.push(game.createCard(hs[i]));
                        }
                        player.gain(hs2,'log','gain2');
                        player.chooseToDiscard(hs.length,'he',true).set('ai',function(card){
                            return -get.value(card);
                        });
                    }
                },
                ai:{
                    threaten:1.5,
                },
            },
            lggzy:{
                audio:"zhuiyi",
                trigger:{
                    player:"phaseUseEnd",
                },
                init:function (player){
                    player.storage.lggzy=0;
                },
                frequent:true,
                content:function (){
                    player.gain(game.createCard('tao'),'log','gain2');
                    if(player.storage.lggzy&&player.storage.lggzy>0) player.draw(player.storage.lggzy);
                },
                ai:{
                    effect:{
                        player:function (card,player,target){
                            if(get.color(card)=='red'){
                                return [1,1];
                            }
                        },
                    },
                    threaten:3.5,
                },
                group:["lggzy_1","lggzy_2"],
                subSkill:{
                    1:{
                        trigger:{
                            player:"useCard",
                        },
                        silent:true,
                        firstDo:true,
                        filter:function (event,player){
                            if(_status.currentPhase!=player) return false;
                            return get.color(event.card)&&get.color(event.card)=='red';
                        },
                        content:function (){
                            if(get.color(trigger.card)&&get.color(trigger.card)=='red') player.storage.lggzy++;
                        },
                        sub:true,
                    },
                    2:{
                        trigger:{
                            player:"phaseAfter",
                        },
                        silent:true,
                        firstDo:true,
                        content:function (){
                            player.storage.lggzy=0;
                        },
                        sub:true,
                    },
                },
            },
            lggsx:{
                audio:"shanxi",
                trigger:{
                    global:["useCard"],
                },
                filter:function (event,player){
                    if(event.player==player) return false;
                    return event.card.name=='shan';
                },
                check:function (event,player){
                    return get.attitude(player,event.player)<0&&player.hp>1;
                },
                content:function (){
                    trigger.cancel();
                    player.loseHp();
                },
                ai:{
                    threaten:2,
                },
            },
            lggfj:{
                audio:"refanjian",
                enable:"phaseUse",
                usable:1,
                filter:function (event,player){
                    return player.countCards('h','sha')>=1;
                },
                filterTarget:function (card,player,target){
                    return target!=player;
                },
                filterCard:function (card){
                    return card.name=='sha';
                },
                discard:false,
                lose:false,
                delay:false,
                position:"h",
                content:function (){
                    target.gain(cards[0],player,'giveAuto');
                    target.chooseToDiscard('he',2,true);
                    target.loseHp();
                },
                ai:{
                    order:10,
                    result:{
                        target:-1,
                    },
                    threaten:2,
                },
            },
            lggfw:{
                audio:"fenwei",
                trigger:{
                    player:["dyingBefore"],
                },
                forced:true,
                content:function (){
                    if(player.maxHp+player.hp>=0){
                        player.draw();
                        trigger.cancel();
                    }
                    else{
                        player.loseMaxHp();
                        player.recover(-player.hp);
                    }
                },
                ai:{
                    threaten:0.5,
                },
            },
            lggxss:{
                audio:"xinsheng",
                trigger:{
                    player:"phaseJieshuBegin",
                },
                filter:function (event,player){
                    return !player.storage.lggxss;
                },
                derivation:["lgglz"],
                unique:true,
                skillAnimation:true,
                animationStr:"新生",
                limited:true,
                animationColor:"water",
                init:function (player){
                    player.storage.lggxss=false;
                },
                mark:true,
                intro:{
                    content:"未发动",
                },
                content:function (){
                    player.awakenSkill('lggxss');
                    player.storage.lggxss=true;
                    player.insertPhase();
                },
                ai:{
                    threaten:2.5,
                },
            },
            lggpk:{
                audio:"pingkou",
                trigger:{
                    player:"phaseBegin",
                },
                direct:true,
                content:function (){
                    "step 0"
                    player.chooseTarget('可以对一名角色造成一点伤害').set('ai',function(target){
                        var player=_status.event.player;
                        return get.damageEffect(target,player,player);
                    });
                    "step 1"
                    if(result.bool){
                        player.logSkill('lggpk');
                        result.targets[0].damage();
                    }
                },
                ai:{
                    threaten:2,
                },
            },
            ccxlj:{
                audio:"luanji",
                trigger:{
                    player:"phaseDrawEnd",
                },
                direct:true,
                content:function (){
                    player.logSkill('ccxlj');
                    player.chooseUseTarget({name:'wanjian'},true);
                },
                ai:{
                    threaten:1.5,
                },
            },
            ccxjx:{
                audio:"junxing",
                trigger:{
                    global:"phaseEnd",
                },
                filter:function (event,player){
                    return event.player.getHistory('useCard').length<=0&&event.player!=player&&event.player.isAlive();
                },
                check:function (event,player){
                    if(event.player.hasSkillTag('noturn')) return 0;
                    if(event.player.isTurnedOver()) return get.attitude(player,event.player)>0;
                    return get.attitude(player,event.player)<0;
                },
                logTarget:"player",
                content:function (){
                    trigger.player.turnOver();
                },
                ai:{
                    threaten:2.5,
                },
            },
        },
        translate:{
            "RWsj5":"世界",
            "RWsj5_info":"每回合限五次，当你使用牌后，你可以重铸任意张牌。",

            "RWxx":"☟",
            "RWxx_info":"当其他角色进入濒死状态时，你可以回复1点体力并令其体力-1。然后有24%几率废除此技能，将。",

            "RWsj9":"世界",
            "RWsj9_info":"每回合限九次，当你使用牌后，你可以重铸任意张牌。",

            RWhigh:"☞",
            "RWhigh_info":"准备阶段，你摸一张牌；结束阶段，你弃置所有手牌；其他角色死亡后，你回复一点体力。",

            "RWja":"♥♦",
            "RWja_info":"当你成为红色牌的目标时，你可以摸一张牌。",

            "RWyz":"☺♥",
            "RWyz_info":"摸牌阶段，你可以多摸一张牌。",

            "RWby":"｜☽",
            "RWby_info":"结束阶段，你可以摸一张牌。",

            "RWjz":"集智",
            "RWjz_info":"当你成为非延时锦囊牌的目标后，你可以摸一张牌。",

            "RWpx":"咆哮",
            "RWpx_info":"锁定技，若你已受伤，你不能成为延时锦囊牌的目标。",

            "RWfy":"飞影",
            "RWfy_info":"锁定技，若你未受伤，其他角色计算与你的距离时+1。",

            "RWzj":"➷➷",
            "RWzj_info":"锁定技，你与体力值不大于你的角色的距离视为1。",

            "RWyc":"毅重",
            "RWyc_info":"锁定技，若你的手牌不小于体力值，你不能成为黑色【杀】的目标。",

            "RWjjsw":"究极",
            "RWjjsw_info":"锁定技，当你体力值发生变化后，你在两个随机选项中选择一个。（未选择的选项会保留到下次）",

            "RWmyyg":"☼",
            "RWmyyg_info":"摸一张牌",

            "RWzjqq":"➷",
            "RWzjqq_info":"弃置一张手牌",

            "RWfqsk":"　",
            "RWfqsk_info":"回合开始前，终止一切结算，当前回合结束",

            "RWwin":"♪",
            "RWwin_info":"无事发生",

            RWkz:"逐光",
            "RWkz_info":"锁定技，每轮游戏开始时，你摸1张牌并从固定的8个技能中获得随机1个未拥有的技能，若其中你未拥有的技能数≤你已损失的体力值，你废除此技能并。",


            "RWdc":"初登场",
            "RWdc_info":"",

            "RWxj":"选择武将",
            "RWxj_info":"",

            "RWtg":"通关",
            "RWtg_info":"",


            lggdx:"当先",
            "lggdx_info":"回合开始时，你可以失去此技能并获得〖武圣〗和〖制蛮〗。",
            lggws:"武圣",
            "lggws_info":"你使用【杀】造成伤害后，可以失去此技能并获得〖当先〗和〖制蛮〗，然后获得一张【杀】。",
            lggzm:"制蛮",
            "lggzm_info":"你造成伤害值＞1的伤害时，可以失去此技能并获得〖当先〗和〖武圣〗，然后令伤害值－1并摸两张牌。",
            lggxl:"享乐",
            "lggxl_info":"你可以跳过判定阶段、出牌阶段或弃牌阶段，然后摸x张牌<br><br>x为本回合你跳过的阶段数",
            lggyh:"英魂",
            "lggyh_info":"准备阶段，你可以回复一点体力。",
            lggzss:"宗室",
            "lggzss_info":"<li>当你脱离濒死状态后，若你没有“宗室”标记，你可以弃置一张牌，然后获得“宗室”标记。<br><br><li>一名角色的回合结束后，若你有“宗室”标记，你移去“宗室”标记并进行一个额外的回合。",
            lggzss1:"宗室",
            "lggzss1_info":"",
            lgggx:"观星",
            "lgggx_info":"准备阶段，你可以获得上家的一张手牌并失去一点体力，然后获得两张与此牌的复制。",
            lggjxx:"奸雄",
            "lggjxx_info":"<li>出牌阶段每项限一次，你可以与一名其他角色交换：①位置；②体力值；③手牌数。<br><br><li>结束阶段，若你本回合发动过：〖奸雄〗①你与上家交换位置；<br>〖奸雄〗②所有角色失去一点体力；<br>〖奸雄〗③你弃置所有手牌并回复一点体力。",
            lgggl:"甘露",
            "lgggl_info":"一名角色死亡前，你可以取消之并失去此技能，然后其将体力回复至2点并摸两张牌。",
            lggll:"流离",
            "lggll_info":"锁定技，摸牌阶段结束时，你获得你的所有牌的复制并弃置等量的牌。",
            lggzy:"追忆",
            "lggzy_info":"出牌阶段结束时，你可以获得一张【桃】并摸x张牌。<br><br>x为你本回合使用过的红色牌数",
            lggsx:"闪袭",
            "lggsx_info":"其他角色使用【闪】时，你可以取消之并失去一点体力。",
            lggfj:"反间",
            "lggfj_info":"出牌阶段限一次，你可以将一张【杀】交给一名其他角色，其弃置两张牌并失去一点体力。",
            lggfw:"奋威",
            "lggfw_info":"锁定技，当你即将进行濒死结算时，若你的体力上限+你的体力值≥0，你摸1张牌并取消之；否则你减1点体力上限并将体力值回复至0点。",
            lggxss:"新生",
            "lggxss_info":"限定技，结束阶段，你可以进行一个额外的回合。",
            lggpk:"平寇",
            "lggpk_info":"回合开始时，你可以对一名角色造成一点伤害。",
            ccxlj:"乱击",
            "ccxlj_info":"摸牌阶段结束时，你视为使用1张【万箭齐发】。",
            ccxjx:"峻刑",
            "ccxjx_info":"一名其他角色的回合结束时，若其本回合未使用牌，你可以令其翻面。",
        },
    },
    intro:"在某个群里看到的，盗了",
    author:"那个谁",
    diskURL:"",
    forumURL:"",
    version:"",
},files:{"character":[],"card":[],"skill":[]}}};