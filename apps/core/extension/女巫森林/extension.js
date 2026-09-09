import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"女巫森林",content:function (config,pack){

},precontent:function (){
    
},help:{},config:{},package:{
    character:{
        character:{
            "nwsl_boss_nvwusenlin":["male","shen",1,["女巫森林","boss_nwsl"],["boss","forbidai","bossallowed","des:别去女巫森林，太可怕了！"]],
            "nwsl_baogaobing1":["male","wei",1,["nwsl_liule"],["forbidai","des:加入战斗！"]],
            "nwsl_baogaobing2":["male","wei",1,["nwsl_liule"],["forbidai","des:加入战斗！"]],
            "nwsl_taisi":["female","qun",5,["nwsl_lnbz","nwsl_maoxian2","nwsl_fanjian","nwsl_maoxian1"],["forbidai","des:如果喜欢本拓展的话，给小作者点个赞吧，嘤嘤嘤"]],
            "nwsl_boss_guguji":["female","shen",4,["nwsl_jie","boss_nwsl_bianshen1"],["forbidai","des:每一滴血都会让这只食腐鸟变得愈发强大。"]],
            "nwsl_boss_fuya":["male","shen",4,["nwsl_dlsy","boss_nwsl_bianshen1"],["forbidai","des:不管是灵体还是真的，抓人都一样疼!"]],
            "nwsl_boss_gehouzheweili":["male","shen",6,["nwsl_pouji","nwsl_liren","nwsl_anying","boss_nwsl_bianshen2"],["forbidai","des:看看他的名字就知道他干了什么。"]],
            "nwsl_boss_liugenshuren":["male","shen",6,["boss_nwsl_bianshen2","nwsl_kysz1","nwsl_shengji","nwsl_juhuo","nwsl_kysz2"],["forbidai","des:粗糙扭曲的根，延伸出新的生命。"]],
            "nwsl_boss_sezawoyisheng":["male","shen",6,["nwsl_kongxinzhen","nwsl_fusu","boss_nwsl_bianshen2","nwsl_wudu"],["forbidai","des:献血是好事，但别献给他，他根本就不是医生。"]],
            "nwsl_boss_suizhi":["female","shen",8,["nwsl_jjsp","nwsl_zrph","nwsl_xwzz","boss_nwsl_bianshen3"],["forbidai","des:她会拿走你的血肉，变成她自己的。"]],
            "nwsl_boss_zhuobokabula":["male","shen",9,["nwsl_shixue","nwsl_xxgzy","nwsl_jinu","nwsl_jianya","nwsl_lizhao","boss_nwsl_bianshen3"],["forbidai","des:哇哇啊哇！哇咔咔啊哇！"]],
            "nwsl_boss_buliezheyifan":["male","shen",9,["nwsl_bzxj","nwsl_zdst","nwsl_shouwang","nwsl_tianchong","boss_nwsl_bianshen3"],["forbidai","des:留神脚下，这位叛徒可是个陷进专家。"]],
            "nwsl_boss_shengxuandeelang":["male","shen",4,["nwsl_zehj","boss_nwsl_bianshen1"],["forbidai","des:怪异的嚎叫让野生动物开始发狂。"]],
            "nwsl_boss_mianjushoujizhe":["male","shen",15,["nwsl_mianju","nwsl_xdmj"],["forbidai","des:又一张面具，你和我真的有什么不同吗？"]],
            "nwsl_ceshi":["male","wei",9,["nwsl_maoxian3"],["forbidai"]],
        },
        translate:{
            "nwsl_boss_nvwusenlin":"女巫森林",
            "nwsl_baogaobing1":"报告兵",
            "nwsl_baogaobing2":"报告兵",
            "nwsl_taisi":"苔丝",
            "nwsl_boss_guguji":"咕咕鸡",
            "nwsl_boss_fuya":"腐牙",
            "nwsl_boss_gehouzheweili":"割喉者威利",
            "nwsl_boss_liugenshuren":"瘤根树人",
            "nwsl_boss_sezawoyisheng":"瑟扎沃医生",
            "nwsl_boss_suizhi":"碎枝",
            "nwsl_boss_zhuobokabula":"卓柏卡布拉",
            "nwsl_boss_buliezheyifan":"捕猎者伊凡",
            "nwsl_boss_shengxuandeelang":"生癣的恶狼",
            "nwsl_boss_mianjushoujizhe":"面具收集者",
            "nwsl_ceshi":"测试",
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
            "nwsl01bs":{
                trigger:{
                    global:"gameStart",
                },
                forced:true,
                popup:false,
                fixed:true,
                unique:true,
                content:function (){
        'step 0'
        player.discard(player.getCards('j'));
        player.link(false);
        player.turnOver(false);
        'step 1'
        player.chooseControl('腐牙','生癣的恶狼','咕咕鸡',function(){
            if(Math.random()<0.33) return '腐牙';
            if(Math.random()>0.66) return '生藓的恶狼';
            return '咕咕鸡';
        }).set('prompt','进入下一关');
        'step 2'
        if(result.control=='腐牙'){
            player.init('nwsl_boss_fuya');
        }
        if(result.control=='生癣的恶狼'){
            player.init('nwsl_boss_shengxuandeelang');
        }
        if(result.control=='咕咕鸡'){
            player.init('nwsl_boss_guguji');
        }
        'step 3'
        player.skills.remove('nwsl01bs');
    },
            },
            "女巫森林":{
                nobracket:true,
            },
            "nwsl_liule":{
                audio:"ext:女巫森林:1",
                trigger:{
                    global:"gameStart",
                },
                forced:true,
                popup:false,
                fixed:true,
                unique:true,
                content:function (){
        player.classList.add('out');
    },
            },
            "nwsl_souxun":{
                audio:"ext:女巫森林:1",
                trigger:{
                    player:["phaseBegin","phaseEnd"],
                },
                forced:true,
                content:function (){
        'step 0'
        var list=get.inpile('trick');
        list=list.randomGets(3);
        for(var i=0;i<list.length;i++){
            list[i]=['锦囊','',list[i]];
        }
        var dialog=ui.create.dialog('选择一张锦囊牌加入你的手牌',[list,'vcard'],'hidden');
        player.chooseButton(dialog,true).set('ai',function(button){
            var card={name:button.link[2]};
            var value=get.value(card);
            return value;
        });
        'step 1'
        if(result.bool){
            player.gain(game.createCard(result.buttons[0].link[2]),'draw');
        }
    },
                ai:{
                    order:9,
                    result:{
                        player:1,
                    },
                },
            },
            "nwsl_jianya":{
                trigger:{
                    source:"damageEnd",
                },
                forced:true,
                filter:function (event){
        return event.card&&(event.card.name=='sha'||event.card.name=='juedou')&&event.notLink();
    },
                content:function (){
        player.draw();
    },
            },
            "nwsl_lizhao":{
                mod:{
                    cardUsable:function (card,player,num){
            if(card.name=='sha') return num+3;
        },
                },
            },
            "nwsl_jihuo":{
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                forced:true,
                filter:function (event,player){
       if(!player.storage.nwsl_jihuo||game.roundNumber-player.storage.nwsl_jihuo>=3)
        return true;
   },
                content:function (){
       'step 0'
        player.storage.nwsl_jihuo=game.roundNumber;
       'step 1'
        player.storage.nwsl_zhanlipin1++;
},
            },
            "nwsl_maoxian1":{
                audio:"ext:女巫森林:1",
                enable:"phaseUse",
                filter:function (event,player){
        return player.storage.nwsl_zhanlipin1>=1;
    },
                content:function (){
        "step 0"
        player.storage.nwsl_zhanlipin1--;
        "step 1"
        var list=[];
        list.push('叠甲');
        list.push('生长');
        list.push('怒吼');
        if(!player.hasSkill('nwsl_jianya')){
            list.push('nwsl_jianya');
        }
        if(!player.hasSkill('nwsl_lizhao')){
            list.push('nwsl_lizhao');
        }
        if(!player.hasSkill('nwsl_jihuo')){
            list.push('nwsl_jihuo');
        }
        player.chooseControl(list.randomGets(3)).set('prompt','选择一项进行进化');
        "step 2"
        if(result.control=='叠甲'){
            player.changeHujia(3);
        }
        if(result.control=='生长'){
            player.gainMaxHp();
            player.recover();
        }
        if(result.control=='怒吼'){
            player.draw(3);
        }
        else{
            player.addSkill(result.control);
        }
    },
                group:["nwsl_zhanlipin1"],
            },
            "nwsl_maoxian2":{
                audio:"ext:女巫森林:1",
                enable:"phaseUse",
                filter:function (event,player){
return player.storage.nwsl_maoxian2>=1;
},
                content:function (){
        "step 0"
        player.storage.nwsl_maoxian2--;
        "step 1"
        player.chooseControl(['伤害技','苟活技','特殊技']).set('prompt','选择一种技能');
        "step 2"
        if(result.control=='伤害技'){
        player.chooseControl(['破军','烈弓','裸衣','火计','取消']).set('prompt','选择一个你没有获得过得技能');
        }
        if(result.control=='苟活技'){
        player.chooseControl(['恢拓','涅槃','智迟','父荫','取消']).set('prompt','选择一个你没有获得过得技能');
        }
        if(result.control=='特殊技'){
        player.chooseControl(['伤逝','奋音','狂才','龙魂','取消']).set('prompt','选择一个你没有获得过得技能');
        }
        "step 3"
        if(result.control=='破军'){
        player.addSkill('repojun');
        }
        if(result.control=='烈弓'){
        player.addSkill('xinliegong');
        }
        if(result.control=='裸衣'){
        player.addSkill('reluoyi');
        }
        if(result.control=='火计'){
        player.addSkill('rehuoji');
        }
        if(result.control=='恢拓'){
        player.addSkill('huituo');
        }
        if(result.control=='涅槃'){
        player.addSkill('olniepan');
        }
        if(result.control=='智迟'){
        player.addSkill('zhichi');
        }
        if(result.control=='父荫'){
        player.addSkill('old_fuyin');
        }
        if(result.control=='伤逝'){
        player.addSkill('nwsl_shangshi');
        }
        if(result.control=='奋音'){
        player.addSkill('fenyin');
        }
        if(result.control=='狂才'){
        player.addSkill('kuangcai');
        }
        if(result.control=='龙魂'){
        player.addSkill('relonghun');
        }
        if(result.control=='取消'){
        event.goto(1);
        }
    },
                group:["nwsl_maoxian3"],
            },
            "nwsl_shangshi":{
                audio:"shangshi",
                trigger:{
                    player:["loseAfter","changeHp","gainMaxHpAfter","loseMaxHpAfter"],
                    global:["equipAfter","addJudgeAfter","gainAfter"],
                },
                frequent:true,
                prompt:function (event,player){
        return '是否发动【伤逝】将手牌摸至'+get.cnNumber(player.getDamagedHp())+'张？'
    },
                "prompt2":false,
                filter:function (event,player){
        if(event.getl&&!event.getl(player)) return false;
        if(player.countCards('h')>=5) return false;
        return player.countCards('h')<player.getDamagedHp();
    },
                content:function (){
        player.draw(player.getDamagedHp()-player.countCards('h'));
    },
                ai:{
                    noh:true,
                    skillTagFilter:function (player,tag){
            if(tag=='noh'&&player.maxHp-player.hp<player.countCards('h')){
                return false;
            }
        },
                },
                group:"reshangshi_2nd",
            },
            "nwsl_jie":{
                audio:"ext:女巫森林:1",
                trigger:{
                    source:"damageEnd",
                    player:"damageEnd",
                },
                forced:true,
                content:function (){
        player.draw(trigger.num);
    },
            },
            "nwsl_yeman":{
                trigger:{
                    source:"damageBegin1",
                },
                forced:true,
                content:function (){
        trigger.num+=2;
        player.removeSkill('nwsl_yeman');
    },
                ai:{
                    damageBonus:true,
                },
                mark:true,
                intro:{
                    content:"下次造成的伤害值+2",
                },
            },
            "nwsl_zehj":{
                audio:"ext:女巫森林:1",
                nobracket:true,
                trigger:{
                    player:"phaseBegin",
                },
                unique:true,
                content:function (){
        "step 0"
        event.players=get.players(player);
        "step 1"
        if(event.players.length){
            var current=event.players.shift();
            if(current.isEnemyOf(player)){
                player.line(current,'green');
                current.chooseToDiscard('he',1,true);
                player.draw();
            }
            event.redo();
        }
    },
                ai:{
                    threaten:2,
                },
            },
            "nwsl_pouji":{
                audio:"ext:女巫森林:1",
                trigger:{
                    player:"phaseJieshuBegin",
                },
                forced:true,
                content:function (){
        "step 0"
        player.chooseTarget(get.prompt('nwsl_pouji'),function(card,player,target){
            return player!=target;
        }).ai=function(target){
            return get.damageEffect(target,player,player);
        }
        "step 1"
        if(result.bool){
            event.current=result.targets[0];
            player.logSkill('nwsl_pouji',event.current);
            player.line(event.current,'thunder');
            if(event.current.hp==event.current.maxHp){
                event.current.damage(2);
            }else{
                event.current.damage();
            }
        }
        else event.finish();
    },
            },
            "nwsl_anying":{
                mod:{
                    targetEnabled:function (card,player,target){
            if(get.type(card)=='delay'){
                return false;
            }
        },
                },
            },
            "nwsl_liren":{
                audio:"ext:女巫森林:1",
                trigger:{
                    source:"damageEnd",
                },
                filter:function (event,player){
return !player.storage.nwsl_liren&&event.card&&event.card.name=='sha'&&event.notLink();
},
                forced:true,
                content:function (){
     "step 0"
      player.storage.nwsl_liren=true;
     "step 1"
      trigger.player.disableEquip([1,2,3,4].randomGet());
      player.unmarkSkill('nwsl_liren');
    },
                mark:true,
                limit:true,
                intro:{
                    content:"limited",
                },
            },
            "nwsl_juhuo":{
                audio:"ext:女巫森林:2",
                trigger:{
                    player:"damageBegin4",
                },
                filter:function (event){
        return event.nature=='fire';
    },
                forced:true,
                content:function (){
        trigger.num++;
    },
                ai:{
                    effect:{
                        target:function (card,player,target,current){
                if(get.tag(card,'fireDamage')) return 2;
            },
                    },
                },
            },
            "nwsl_lnbz":{
                audio:"ext:女巫森林:1",
                mark:true,
                marktext:"雷",
                intro:{
                    name:"雷诺宝藏",
                    content:"mark",
                },
                skillAnimation:"epic",
                animationColor:"green",
                nobracket:true,
                enable:"phaseUse",
                filter:function (event,player){
      return !player.storage.nwsl_lnbz;
    },
                content:function (){
    "step 0"
        player.storage.nwsl_lnbz=true;
        player.awakenSkill('nwsl_lnbz');
    "step 1"
        player.recover(player.maxHp-player.hp);
        player.draw(player.maxHp-player.countCards('h'));
    },
            },
            "nwsl_dlsy":{
                audio:"ext:女巫森林:1",
                enable:"phaseUse",
                nobracket:true,
                usable:1,
                filterCard:true,
                selectCard:1,
                filter:function (event,player){
       if((!player.storage.nwsl_dlsy||game.roundNumber-player.storage.nwsl_dlsy>=2)&&!player.hasSkill('nwsl_yeman'))
        return true;
   },
                content:function (){        
        player.addSkill('nwsl_yeman');
        player.storage.nwsl_dlsy=game.roundNumber;
    },
                check:function (card){
        return 6-ai.get.value(card);
    },
                ai:{
                    order:10,
                    result:{
                        player:function (player){
                if(player.countCards('h')>=3) return 5;
            },
                    },
                    threaten:1.2,
                },
            },
            "nwsl_shengji":{
                mark:true,
                marktext:"生",
                intro:{
                    name:"生机",
                    content:"mark",
                },
                trigger:{
                    player:"recoverEnd",
                },
                forced:true,
                content:function (){
        player.addMark('nwsl_shengji',trigger.num);
    },
                group:["nwsl_xiongyong"],
            },
            "nwsl_xiongyong":{
                audio:"ext:女巫森林:1",
                enable:"phaseUse",
                usable:1,
                filter:function (event,player){
       if(player.storage.nwsl_shengji>=3)
        return true;
   },
                content:function (){
        player.removeMark('nwsl_shengji',3);
        var n=[1,2,3].randomGet();
        if(n==1) player.draw(3);
        if(n==2) {player.recover();
                  player.draw();
                 }
        if(n==3) player.changeHujia(2);
    },
                ai:{
                    order:9,
                    result:{
                        player:function (player){
            if(player.countCards('h')+2<=player.hp) return 2;
            return 0.5
        },
                    },
                },
            },
            "nwsl_kongxinzhen":{
                nobracket:true,
                audio:"ext:女巫森林:2",
                enable:"phaseUse",
                usable:1,
                filterTarget:function (card,player,target){
        return player!=target;
    },
                content:function (){
        if(player.hp>=player.maxHp){
            target.damage();
            player.draw();
        }
        else{
            player.recover();
            event.target.chooseToDiscard(true);
        }
    },
                ai:{
                    order:10,
                    result:{
                        target:-1,
                    },
                },
            },
            "nwsl_fusu":{
                audio:"ext:女巫森林:1",
                trigger:{
                    player:"phaseBegin",
                },
                forced:true,
                filter:function (event,player){
        return player.hp<=1;
    },
                content:function (){
            player.recover();
    },
            },
            "nwsl_yaoyin":{
                trigger:{
                    global:"recoverAfter",
                },
                forced:true,
                content:function (){
        player.draw(trigger.num);
    },
            },
            "nwsl_bingxiang":{
                audio:"ext:女巫森林:1",
                audioname:["nwsl_bingdong"],
                mark:true,
                marktext:"奥",
                intro:{
                    content:"mark",
                },
                trigger:{
                    player:"damageBegin4",
                },
                forced:true,
                filter:function (event,player){
        return event.num>=player.hp;
    },
                content:function (){
        trigger.cancel();
        player.recover();
        player.draw(2);
        player.addMark('nwsl_zdst',1);
        player.removeSkill('nwsl_bingxiang');
        player.storage.aomishu--;
    },
            },
            "nwsl_wuzhuang":{
                audio:"nwsl_bingxiang",
                mark:true,
                marktext:"奥",
                intro:{
                    content:"mark",
                },
                trigger:{
                    global:"equipEnd",
                },
                forced:true,
                filter:function (event,player){
        return event.player!=player;
    },
                content:function (){
        player.draw(3);
        player.addTempSkill('feiying','phaseBegin');
        player.addMark('nwsl_zdst',1);
        player.removeSkill('nwsl_wuzhuang');
        player.storage.aomishu--;
    },
            },
            "nwsl_huifu":{
                audio:"nwsl_bingxiang",
                mark:true,
                marktext:"奥",
                intro:{
                    content:"mark",
                },
                trigger:{
                    global:"recoverEnd",
                },
                forced:true,
                filter:function (event,player){
 return event.player!=player;
},
                content:function (){
        if(player.hp>=player.maxHp){
            player.draw(4);
        }
        else{
            player.recover(2);
        }
        player.addMark('nwsl_zdst',1);
        player.removeSkill('nwsl_huifu');
        player.storage.aomishu--;
    },
            },
            "nwsl_bzxj":{
                audio:"ext:女巫森林:3",
                nobracket:true,
                enable:"phaseUse",
                usable:1,
                filterCard:true,
                selectCard:1,
                filter:function (event,player){
        return (player.storage.aomishu<=2||!player.storage.aomishu);
    },
                content:function (){
        'step 0'
        var list=[];
        if(!player.hasSkill('nwsl_bingxiang')){
            list.push('nwsl_bingxiang');
        }
        if(!player.hasSkill('nwsl_wuzhuang')){
            list.push('nwsl_wuzhuang');
        }
        if(!player.hasSkill('nwsl_huifu')){
            list.push('nwsl_huifu');
        }
        if(!player.hasSkill('nwsl_bushu')){
            list.push('nwsl_bushu');
        }
        if(!player.hasSkill('nwsl_bingdong')){
            list.push('nwsl_bingdong');
        }
        if(list.length){
            player.chooseControl(list).set('prompt','选择获得一个奥秘');
        }
        'step 1'
        player.addSkill(result.control);
        player.addMark('aomishu');
        game.log(player,'获得了一个奥秘');
        var audio=game.playAudio();
        audio.src=lib.assetURL+'extension/女巫森林/nwsl_aomi1.mp3';
    },
                check:function (card){
        return 6-ai.get.value(card);
    },
                ai:{
                    order:9,
                    result:{
                        player:5,
                    },
                    threaten:1.2,
                },
            },
            "nwsl_zdst":{
                marktext:"弹",
                intro:{
                    name:"子弹",
                    content:"mark",
                },
                nobracket:true,
                audio:"ext:女巫森林:1",
                trigger:{
                    player:"phaseJieshuBegin",
                },
                filter:function (event,player){
        return player.storage.nwsl_zdst>=1;
    },
                content:function (){
        "step 0"
        player.chooseTarget(get.prompt('nwsl_zdst'),function(card,player,target){
            return player!=target;
        }).ai=function(target){
            return get.damageEffect(target,player,player);
        }
        "step 1"
        if(result.bool){
            event.current=result.targets[0];
            player.logSkill('nwsl_zdst',event.current);
            player.line(event.current,'thunder');
            player.removeMark('nwsl_zdst',1);
        }
        else event.finish();
        "step 2"
        if(event.current.countCards('h')>=3){
            event.current.chooseToDiscard(3,'h',true);
        }else{
            event.current.chooseToDiscard('h',true);
            event.current.loseHp(1);
        }
    },
            },
            "nwsl_shouwang":{
                audio:"ext:女巫森林:1",
                trigger:{
                    global:"drawEnd",
                },
                forced:true,
                filter:function (event,player){
        return event.player!=player&&event.player.countCards('h')>=8;
    },
                content:function (){
        trigger.player.chooseToDiscard(4,true);
    },
            },
            "nwsl_jjsp":{
                nobracket:true,
                audio:"ext:女巫森林:1",
                enable:"phaseUse",
                usable:1,
                filterTarget:function (card,player,target){
        return player!=target;
    },
                content:function (){
        player.swapEquip(target);
 },
                ai:{
                    order:10,
                    result:{
                        player:function (player,target){
                return target.countCards('e')-player.countCards('e');
            },
                    },
                },
            },
            "nwsl_zrph":{
                nobracket:true,
                audio:"ext:女巫森林:2",
                trigger:{
                    global:["drawEnd","gainAfter"],
                },
                forced:true,
                filter:function (event,player){
        return event.player!=player&&event.player.countCards('h')>player.countCards('h');
    },
                content:function (){
        player.draw(trigger.player.countCards('h')-player.countCards('h'));
    },
            },
            "nwsl_xwzz":{
                mark:true,
                marktext:"种",
                intro:{
                    name:"希望之种",
                    content:"mark",
                },
                nobracket:true,
                audio:"ext:女巫森林:1",
                enable:"chooseToUse",
                filter:function (event,player){
        if(player.hp>=1) return false;
        if(event.type=='dying'){
            if(player!=event.dying) return false;
            return true;
        }
        return false;
    },
                priority:100,
                fixed:true,
                content:function (){
        'step 0'
        player.discard(player.getCards('hej'));
        player.link(false);
        player.turnOver(false);
        'step 1'
        player.awakenSkill('nwsl_xwzz');
        if(player.maxHp<8){
            player.gainMaxHp(8-player.maxHp);
        }
        player.recover(8-player.hp);
        player.draw(8);
        player.addSkill('nwsl_zjgr');
      },
                ai:{
                    save:true,
                    result:{
                        player:function (player){
                if(player.hp<=0) return 10;
           },
                    },
                },
            },
            "nwsl_shixue":{
                audio:"ext:女巫森林:1",
                trigger:{
                    source:"damageEnd",
                },
                forced:true,
                filter:function (event,player){
        return player.hp<player.maxHp;
    },
                content:function (){
        player.recover(trigger.num);
    },
            },
            "nwsl_jinu":{
                mark:true,
                marktext:"怒",
                intro:{
                    name:"激怒",
                    content:"mark",
                },
                audio:"ext:女巫森林:1",
                trigger:{
                    player:"damageEnd",
                },
                forced:true,
                content:function (){
        'step 0'
        player.addMark('nwsl_jinu',trigger.num);
        'step 1'
        player.draw(trigger.num);
    },
            },
            "nwsl_xxgzy":{
                audio:"ext:女巫森林:1",
                enable:"phaseUse",
                usable:1,
                nobracket:true,
                filter:function (event,player){
       if(!player.storage.nwsl_xxgzy||game.roundNumber-player.storage.nwsl_xxgzy>=3)
        return true;
   },
                filterTarget:function (card,player,target){
        if(target==player) return false;
        return true;
    },
                content:function (){
       'step 0'
        player.storage.nwsl_xxgzy=game.roundNumber;
       'step 1'
       if(!player.storage.nwsl_jinu){
           player.storage.nwsl_jinu=0
       }
        target.damage(1+player.storage.nwsl_jinu);
},
                ai:{
                    order:10,
                    result:{
                        target:function (player,target){
                if(player.isDamaged()) return -2;
                return 0;
            },
                    },
                },
            },
            "nwsl_ywzs":{
                nobracket:true,
                trigger:{
                    player:"drawBegin",
                },
                forced:true,
                content:function (){
        trigger.num=trigger.num*2;
    },
            },
            "nwsl_pjjg":{
                nobracket:true,
                trigger:{
                    player:"damageEnd",
                },
                forced:true,
                content:function (){
        player.changeHujia(trigger.num);
        player.draw(trigger.num);
    },
            },
            "nwsl_llmf":{
                nobracket:true,
                trigger:{
                    player:"phaseBegin",
                },
                forced:true,
                content:function (){
        "step 0"
        event.count=2;
        "step 1"
        var list=[];
        if(!player.hasSkill('repojun')){
            list.push('repojun');
        }
        if(!player.hasSkill('xinliegong')){
            list.push('xinliegong');
        }
        if(!player.hasSkill('rehuoji')){
            list.push('rehuoji');
        }
        if(!player.hasSkill('reluoyi')){
            list.push('reluoyi');
        }
        if(!player.hasSkill('huituo')){
            list.push('huituo');
        }
        if(!player.hasSkill('olniepan')){
            list.push('olniepan');
        }
        if(!player.hasSkill('zhichi')){
            list.push('zhichi');
        }
        if(!player.hasSkill('old_fuyin')){
            list.push('old_fuyin');
        }
        if(!player.hasSkill('nwsl_shangshi')){
            list.push('nwsl_shangshi');
        }
        if(!player.hasSkill('kuangcai')){
            list.push('kuangcai');
        }
        if(!player.hasSkill('fenyin')){
            list.push('fenyin');
        }
        if(!player.hasSkill('relonghun')){
            list.push('relonghun');
        }
        player.addTempSkill(list.randomGet(),{player:'phaseBegin'});
        event.count--;
        "step 3"
        if(event.count>0){
            event.goto(1)
        }
    },
            },
            "nwsl_maoxian3":{
                audio:"nwsl_maoxian2",
                enable:"phaseUse",
                filter:function (event,player){
    return player.storage.nwsl_maoxian3>=1;
    },
                content:function (){
       "step 0"
        player.storage.nwsl_maoxian3--;
       "step 1"
        var list=[];
        list.push('活力药水');
        if(!player.hasSkill('nwsl_souxun')){
            list.push('狼神崇拜');
        }
        if(!player.hasSkill('nwsl_ywzs')){
            list.push('nwsl_ywzs');
        }
        if(!player.hasSkill('nwsl_pjjg')){
            list.push('nwsl_pjjg');
        }
        if(!player.hasSkill('nwsl_llmf')){
            list.push('nwsl_llmf');
        }
        if(!player.hasSkill('nwsl_jjys')){
            list.push('nwsl_jjys');
        }
      player.chooseControl(list.randomGets(3)).set('prompt','选择一个宝藏');
      "step 2"
      if(result.control=='活力药水'){
      player.gainMaxHp(player.maxHp);
      player.recover(player.hp);
      }
      if(result.control=='狼神崇拜'){
      player.removeSkill('nwsl_fanjian');
      player.addSkill('nwsl_souxun');
      }
      else{
            player.addSkill(result.control);
      }
   },
            },
            "nwsl_11bs":{
                enable:"chooseToUse",
                filter:function (event,player){
        if(player.hp>=1) return false;
        if(event.type=='dying'){
            if(player!=event.dying) return false;
            return true;
        }
        return false;
    },
                priority:100,
                content:function (){
        'step 0'
        player.discard(player.getCards('hej'));
        player.link(false);
        player.turnOver(false);
        'step 1'
        player.chooseControl('瘤根树人','割喉者威利','瑟扎沃医生',function(){
            if(Math.random()<0.33) return '瘤根树人';
            if(Math.random()>0.66) return '割喉者威利';
            return '瑟扎沃医生';
        }).set('prompt','进入下一关');
        'step 2'
        if(result.control=='瘤根树人'){
            player.init('nwsl_boss_liugenshuren');
        }
        if(result.control=='割喉者威利'){
            player.init('nwsl_boss_gehouzheweili');
        }
        if(result.control=='瑟扎沃医生'){
            player.init('nwsl_boss_sezawoyisheng');
        }
        'step 3'
        player.skills.remove('nwsl11bs');
        player.recover(player.maxHp-player.hp);
        if(player.countCards('h')<player.maxHp){
            player.draw(player.maxHp-player.countCards('h'));
        }
        'step 4'
        player.chooseTarget(true,function (card,player,target){
        if(target.name!='nwsl_taisi') return false;
        return true;
    });
        'step 5'
        if(result.bool){
            result.targets[0].storage.nwsl_maoxian1=1;
        }
      },
                ai:{
                    save:true,
                    result:{
                        player:function (player){
                if(player.hp<=0) return 10;
           },
                    },
                },
            },
            "nwsl_21bs":{
                enable:"chooseToUse",
                filter:function (event,player){
        if(player.hp>=1) return false;
        if(event.type=='dying'){
            if(player!=event.dying) return false;
            return true;
        }
        return false;
    },
                priority:100,
                content:function (){
        'step 0'
        player.discard(player.getCards('hej'));
        player.link(false);
        player.turnOver(false);
        'step 1'
        player.chooseControl('捕猎者伊凡','碎枝','卓柏卡布拉',function(){
            if(Math.random()<0.33) return '捕猎者伊凡';
            if(Math.random()>0.66) return '碎枝';
            return '卓柏卡布拉';
        }).set('prompt','进入下一关');
        'step 2'
        if(result.control=='捕猎者伊凡'){
            player.init('nwsl_boss_buliezheyifan');
        }
        if(result.control=='碎枝'){
            player.init('nwsl_boss_suizhi');
        }
        if(result.control=='卓柏卡布拉'){
            player.init('nwsl_boss_zhuobokabula');
        }
        'step 3'
        player.skills.remove('nwsl21bs');
        player.recover(player.maxHp-player.hp);
        if(player.countCards('h')<player.maxHp){
            player.draw(player.maxHp-player.countCards('h'));
        }
        'step 4'
        player.chooseTarget(true,function (card,player,target){
        if(target.name!='nwsl_taisi') return false;
        return true;
    });
        'step 5'
        if(result.bool){
            result.targets[0].storage.nwsl_maoxian1=1;
        }
      },
                ai:{
                    save:true,
                    result:{
                        player:function (player){
                if(player.hp<=0) return 10;
           },
                    },
                },
            },
            "boss_nwsl":{
                trigger:{
                    global:"gameStart",
                },
                forced:true,
                popup:false,
                fixed:true,
                unique:true,
                content:function (){
        player.smoothAvatar();
        player.init(['nwsl_boss_fuya','nwsl_boss_shengxuandeelang','nwsl_boss_guguji'].randomGet());
        _status.noswap=true;
        game.addVideo('reinit2',player,player.name);
        ui.backgroundMusic.src=lib.assetURL+'extension/女巫森林/nwslbjyy.mp3';
    },
            },
            "boss_nwsl_bianshen2":{
                mode:["boss"],
                fixed:true,
                trigger:{
                    player:"dieBegin",
                },
                silent:true,
                content:function (){
        player.hide();
        player.delete();
        game.players.remove(player);
        game.dead.remove(player);
        game.addVideo('hidePlayer',player);
        game.delay();
        'step 0'
        game.changeBoss(['nwsl_boss_buliezheyifan','nwsl_boss_suizhi','nwsl_boss_zhuobokabula'].randomGet());
        game.dead.remove(player);
        ui.backgroundMusic.src=lib.assetURL+'extension/女巫森林/nwslbjyy.mp3';
        'step 1'
        while(_status.event.name!='phaseLoop'){
            _status.event=_status.event.parent;
        }
        _status.paused=false;
        _status.event.player=game.boss;
        _status.event.step=0;
        _status.roundStart=game.boss;
        game.phaseNumber=0;
        var list=game.filterPlayer(function(current){
            return current.name=='nwsl_taisi'||current.name2=='nwsl_taisi';
        });
        if(list.length){
            var target=list.randomGet();
            target.storage.nwsl_maoxian2=1;
        }
        else event.finish();
    },
                forced:true,
                popup:false,
            },
            "nwsl_zjgr":{
                audio:"ext:女巫森林:1",
                nobracket:true,
                enable:"phaseUse",
                filter:function (event,player){
        return !player.storage.nwsl_zjgr;
    },
                filterTarget:function (card,player,target){
        return player!=target;
    },
                content:function (){
     "step 0"
        player.storage.nwsl_zjgr=true;
     "step 1"
        target.damage(5);
        player.draw(5);
        player.changeHujia(5);
     player.unmarkSkill('nwsl_zjgr');
    },
                mark:true,
                limit:true,
                intro:{
                    content:"limited",
                },
                ai:{
                    order:10,
                    result:{
                        target:-10,
                    },
                },
            },
            "nwsl_kysz2":{
                audio:"ext:女巫森林:1",
                trigger:{
                    player:"damageEnd",
                },
                forced:true,
                content:function (){
   'step 0'
    player.addMark('nwsl_kysz1',1);
   'step 1'
    player.draw();
       },
            },
            "nwsl_kysz1":{
                nobracket:true,
                marktext:"狂",
                intro:{
                    name:"狂野",
                    content:"mark",
                },
                group:["nwsl_kysz1_effect1","nwsl_kysz1_effect2"],
                subSkill:{
                    "effect1":{
                        audio:"ext:女巫森林:2",
                        enable:"phaseUse",
                        usable:1,
                        filter:function (event,player){
        return player.storage.nwsl_kysz1>=3;
   },
                        content:function (){
       'step 0'
        player.removeMark('nwsl_kysz1',3);
       'step 1'
        player.gainMaxHp(2);
        player.recover();
},
                        ai:{
                            order:10,
                            result:{
                                player:2,
                            },
                            threaten:2,
                        },
                        sub:true,
                    },
                    "effect2":{
                        trigger:{
                            player:"phaseBegin",
                        },
                        forced:true,
                        content:function (){
        player.addMark('nwsl_kysz1',1);
    },
                        sub:true,
                    },
                },
            },
            "nwsl_tianchong":{
                audio:"ext:女巫森林:1",
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                forced:true,
                init:function (player){
        if(!player.storage.aomishu) player.storage.aomishu=0;
    },
                content:function (){
        player.draw(player.storage.aomishu*2);
    },
            },
            "nwsl_wudu":{
                audio:"ext:女巫森林:2",
                trigger:{
                    global:"useCard",
                },
                forced:true,
                filter:function (event,player){
        return event.card.name=='tao'&&event.player!=player;
    },
                content:function (){
        player.line(trigger.player);
        trigger.player.loseHp();
    },
            },
            "nwsl_zhanlipin1":{
                marktext:"战",
                intro:{
                    name:"战利品",
                    content:function (storage,player,skill){
            return '当前有'+player.storage.nwsl_zhanlipin1+'个普通战利品'
        },
                },
                audio:"ext:女巫森林:2",
                trigger:{
                    global:"gameDrawAfter",
                },
                forced:true,
                content:function (){
        player.addMark('nwsl_zhanlipin1',2);
    },
            },
            "nwsl_fanjian":{
                audio:"ext:女巫森林:1",
                trigger:{
                    player:"phaseBegin",
                },
                forced:true,
                content:function (){
        'step 0'
        var list=get.inpile('trick');
        list=list.randomGets(3);
        for(var i=0;i<list.length;i++){
            list[i]=['锦囊','',list[i]];
        }
        var dialog=ui.create.dialog('选择一张锦囊牌加入你的手牌',[list,'vcard'],'hidden');
        player.chooseButton(dialog,true).set('ai',function(button){
            var card={name:button.link[2]};
            var value=get.value(card);
            return value;
        });
        'step 1'
        if(result.bool){
            player.gain(game.createCard(result.buttons[0].link[2]),'draw');
        }
    },
                ai:{
                    order:9,
                    result:{
                        player:1,
                    },
                },
                "audioname2":{
                    "key_shiki":"nwsl_mianju",
                },
            },
            "nwsl_bushu":{
                audio:"nwsl_bingxiang",
                mark:true,
                marktext:"奥",
                intro:{
                    content:"mark",
                },
                trigger:{
                    global:"useCardAfter",
                },
                forced:true,
                filter:function (event,player){
        return event.player!=player&&event.player.countUsed(null,true)==3;
    },
                content:function (){
        player.draw(Math.max(3,8-player.countCards('h')));
        player.addMark('nwsl_zdst',1);
        player.removeSkill('nwsl_bushu');
        player.storage.aomishu--;
    },
            },
            "nwsl_jjys":{
                nobracket:true,
                trigger:{
                    player:"phaseJieshuBegin",
                },
                frequent:true,
                content:function (){
        player.recover()
    },
            },
            "nwsl_bingdong":{
                audio:"nwsl_bingxiang",
                mark:true,
                marktext:"奥",
                intro:{
                    content:"mark",
                },
                trigger:{
                    target:"shaBefore",
                },
                forced:true,
                content:function (){
        trigger.cancel();
        var card=get.cardPile(function(card){
                    return card.name=='du';
                });
        if(card) {
            trigger.player.gain(card,'gain2');
        }else{
            player.draw(2);
        }
        player.addMark('nwsl_zdst',1);
        player.removeSkill('nwsl_bingdong');
        player.storage.aomishu--;
    },
            },
            "boss_nwsl_bianshen1":{
                mode:["boss"],
                fixed:true,
                trigger:{
                    player:"dieBegin",
                },
                silent:true,
                content:function (){
        player.hide();
        player.delete();
        game.players.remove(player);
        game.dead.remove(player);
        game.addVideo('hidePlayer',player);
        game.delay();
        'step 0'
        game.changeBoss(['nwsl_boss_sezawoyisheng','nwsl_boss_gehouzheweili','nwsl_boss_liugenshuren'].randomGet());
        ui.backgroundMusic.src=lib.assetURL+'extension/女巫森林/nwslbjyy.mp3';
        'step 1'
        while(_status.event.name!='phaseLoop'){
            _status.event=_status.event.parent;
        }
        
        _status.paused=false;
        _status.event.player=game.boss;
        _status.event.step=0;
        _status.roundStart=game.boss;
        game.phaseNumber=0;
        var list=game.filterPlayer(function(current){
            return current.name=='nwsl_taisi'||current.name2=='nwsl_taisi';
        });
        if(list.length){
            var target=list.randomGet();
            target.storage.nwsl_maoxian3=1
        }
        else event.finish();
    },
                forced:true,
                popup:false,
            },
            "boss_nwsl_bianshen3":{
                mode:["boss"],
                fixed:true,
                trigger:{
                    player:"dieBegin",
                },
                silent:true,
                content:function (){
        player.hide();
        player.delete();
        game.players.remove(player);
        game.dead.remove(player);
        game.addVideo('hidePlayer',player);
        game.delay();
        'step 0'
        game.changeBoss(['nwsl_boss_mianjushoujizhe'].randomGet());
        game.dead.remove(player);
        ui.backgroundMusic.src=lib.assetURL+'extension/女巫森林/nwslbjyy.mp3';
        'step 1'
        while(_status.event.name!='phaseLoop'){
            _status.event=_status.event.parent;
        }
        _status.paused=false;
        _status.event.player=game.boss;
        _status.event.step=0;
        _status.roundStart=game.boss;
        game.phaseNumber=0;
        var list=game.filterPlayer(function(current){
            return current.name=='nwsl_taisi'||current.name2=='nwsl_taisi';
        });
        if(list.length){
            var target=list.randomGet();
            target.storage.nwsl_maoxian2=1;
        }
        else event.finish();
    },
                forced:true,
                popup:false,
            },
            "nwsl_mianju":{
                audio:"ext:女巫森林:2",
                trigger:{
                    player:"phaseBegin",
                },
                filter:function (event,player){
        return game.players.length>=2&&!player.storage.nwsl_mianju;
    },
                content:function (){
        'step 0'
        player.chooseTarget(get.prompt('nwsl_mianju'),'选择一名其他角色，获得其现有技能的全部复制',function(card,player,target){
            return player!=target;
        }).set('ai',function(target){
             var player=_status.event.player;
            return get.damageEffect(target,player,player);
        });
        'step 1'
        if(result.bool){
            var list=result.targets[0].getSkills(null,false);
            player.addSkill(list);
            player.storage.nwsl_mianju=true;
            player.removeSkill('nwsl_mianju');
        }
    },
                ai:{
                    result:{
                        player:1,
                    },
                    threaten:3,
                },
            },
            "nwsl_xdmj":{
                nobracket:true,
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                forced:true,
                content:function (){
        "step 0"
        event.count=3;
        "step 1"
        var list=[];
        if(!player.hasSkill('repojun')){
            list.push('repojun');
        }
        if(!player.hasSkill('xinliegong')){
            list.push('xinliegong');
        }
        if(!player.hasSkill('rehuoji')){
            list.push('rehuoji');
        }
        if(!player.hasSkill('reluoyi')){
            list.push('reluoyi');
        }
        if(!player.hasSkill('huituo')){
            list.push('huituo');
        }
        if(!player.hasSkill('olniepan')){
            list.push('olniepan');
        }
        if(!player.hasSkill('zhichi')){
            list.push('zhichi');
        }
        if(!player.hasSkill('old_fuyin')){
            list.push('old_fuyin');
        }
        if(!player.hasSkill('shangshi')){
            list.push('shangshi');
        }
        if(!player.hasSkill('kuangcai')){
            list.push('kuangcai');
        }
        if(!player.hasSkill('fenyin')){
            list.push('fenyin');
        }
        if(!player.hasSkill('relonghun')){
            list.push('relonghun');
        }
        player.addTempSkill(list.randomGet(),{player:'phaseBegin'});
        event.count--;
        "step 3"
        if(event.count>0){
            event.goto(1)
        }
    },
            },
            "nwsl_huixiang":{
                trigger:{
                    player:"useCardAfter",
                },
                filter:function (event,player){
        if(event.parent.name=='nwsl_huixiang') return false;
        if(!event.targets||!event.card) return false;
        if(event.card&&event.card.name=='wuxie') return false;
        var type=get.type(event.card);
        if(type!='trick') return false;
        var card=game.createCard(event.card.name,event.card.suit,event.card.number,event.card.nature);
        var targets=event._targets||event.targets;
        for(var i=0;i<targets.length;i++){
            if(!targets[i].isIn()) return false;
            if(!player.canUse({name:event.card.name},targets[i],false,false)){
                return false;
            }
        }
        return true;
    },
                check:function (event,player){
        if(event.card.name=='tiesuo') return false;
        return true;
    },
                content:function (){
        var card=game.createCard(trigger.card.name,trigger.card.suit,trigger.card.number,trigger.card.nature);
        player.useCard(card,(trigger._targets||trigger.targets).slice(0));
    },
                ai:{
                    threaten:1.3,
                },
            },
            "nwsl_fzmj":{
                enable:"phaseUse",
                filterTarget:function (event,player,target){
        return target.getSkills(null,false).filter(function(skill){
            var info=get.info(skill);
            return info&&!info.juexingji&&!info.zhuSkill&&!info.charlotte&&!info.limited;
        }).length>0;
    },
                content:function (){
        'step 0'
        var list=target.getSkills(null,false).filter(function(skill){
            var info=get.info(skill);
            return info&&!info.juexingji&&!info.zhuSkill&&!info.charlotte&&!info.limited;
        });
        if(list.length==1) event._result={control:list[0]};
        else player.chooseControl(list).set('prompt','选择一个技能').set('ai',function(){
            return list.randomGet();
        });
        'step 1'
        player.addSkillLog(result.control);
        player.removeSkill('nwsl_fzmj');
    },
            },
        },
        translate:{
            "nwsl01bs":"01",
            "nwsl01bs_info":"",
            "女巫森林":"女巫森林",
            "女巫森林_info":"英雄们，你们哪位有勇气进入女巫森林?",
            "nwsl_liule":"溜了",
            "nwsl_liule_info":"老大加油＾０＾~看好你哟！",
            "nwsl_souxun":"搜寻",
            "nwsl_souxun_info":"回合开始与结束时，发现一张锦囊牌。",
            "nwsl_jianya":"尖牙",
            "nwsl_jianya_info":"杀和决斗造成伤害时摸一张牌",
            "nwsl_lizhao":"利爪",
            "nwsl_lizhao_info":"使用杀的次数+3",
            "nwsl_jihuo":"激活",
            "nwsl_jihuo_info":"每三个回合获得一个普通战利品",
            "nwsl_maoxian1":"寻宝",
            "nwsl_maoxian1_info":"游戏开始时，你获得两个普通战利品。",
            "nwsl_maoxian2":"冒险",
            "nwsl_maoxian2_info":"每当你击败一个boss，你可以获得一个宝藏或者技能。",
            "nwsl_shangshi":"伤逝改",
            "nwsl_shangshi_info":"当你受到伤害时，你可以弃置一张牌。当你的手牌数小于X时，你可以将手牌摸至X张。（X为你已损失的体力值且最多为5）",
            "nwsl_jie":"饥饿",
            "nwsl_jie_info":"当你受到伤害或造成伤害时，摸等同于伤害值的牌。",
            "nwsl_yeman":"野蛮",
            "nwsl_yeman_info":"你使用【杀】额外造成两点伤害。触发后移除此技能",
            "nwsl_zehj":"震耳嚎叫",
            "nwsl_zehj_info":"回合开始时，使一名敌方角色弃置一张手牌，然后你摸一张牌。(对所有敌方角色使用)",
            "nwsl_pouji":"剖击",
            "nwsl_pouji_info":"回合结束时，对一名其他角色造成1点伤害，如果是未受伤的角色则改为2点。",
            "nwsl_anying":"暗影",
            "nwsl_anying_info":"锁定技，你不能成为延时类锦囊的目标。",
            "nwsl_liren":"利刃",
            "nwsl_liren_info":"锁定技，限定技，当你使用【杀】对目标造成伤害时，随机废除其一个装备栏。",
            "nwsl_juhuo":"惧火",
            "nwsl_juhuo_info":"锁定技，当你受到火属性伤害时，伤害值+1。",
            "nwsl_lnbz":"雷诺宝藏",
            "nwsl_lnbz_info":"限定技，出牌阶段使用，如果你还没有挂掉，你可以回复全部的生命值，将手牌数摸至体力上限，然后移除此技能。",
            "nwsl_dlsy":"凋零撕咬",
            "nwsl_dlsy_info":"每两轮限一次，你可以弃置一张牌，使你下一次造成的伤害值+2。",
            "nwsl_shengji":"生机",
            "nwsl_shengji_info":"每当你回复生命值后，获得等同于回复值的标志；出牌阶段限一次，你可以移除5个标志，随机获得一个增益buff。",
            "nwsl_xiongyong":"汹涌",
            "nwsl_xiongyong_info":"",
            "nwsl_kongxinzhen":"空心针",
            "nwsl_kongxinzhen_info":"出牌阶段限一次，你可以令一名其他角色弃置一张牌，然后你回复一点体力值；若你已拥有全部体力值则改为对目标造成一点伤害，你摸一张牌。",
            "nwsl_fusu":"复苏",
            "nwsl_fusu_info":"锁定技，回合开始时，如果你的体力值为1，你回复一点体力值。",
            "nwsl_yaoyin":"药引",
            "nwsl_yaoyin_info":"锁定技，场上任意一名角色回复生命值时，你摸一张牌。",
            "nwsl_bingxiang":"冰箱",
            "nwsl_bingxiang_info":"",
            "nwsl_wuzhuang":"武装",
            "nwsl_wuzhuang_info":"",
            "nwsl_huifu":"回复",
            "nwsl_huifu_info":"",
            "nwsl_bzxj":"布置陷阱",
            "nwsl_bzxj_info":"出牌阶段限一次，你可以弃置一张牌，然后获得一个奥秘。（你最多拥有3个奥秘）",
            "nwsl_zdst":"子弹上膛",
            "nwsl_zdst_info":"回合结束时，消耗一颗子弹，使一名其他角色弃置三张手牌，若其手牌不足三张，使其流失一点体力并弃置一张手牌;每当你的奥秘触发一次，获得一颗子弹。",
            "nwsl_shouwang":"收网",
            "nwsl_shouwang_info":"锁定技，当一名其他角色摸牌后，若其手牌不少于八张，使其弃置四张手牌。",
            "nwsl_jjsp":"嫁接树皮",
            "nwsl_jjsp_info":"出牌阶段限一次，你可以与一名其他角色交换装备区。",
            "nwsl_zrph":"自然平衡",
            "nwsl_zrph_info":"锁定技，当其他角色摸牌时，若其手牌数大于你，你将手牌数摸至与其相等。",
            "nwsl_xwzz":"希望之种",
            "nwsl_xwzz_info":"限定技，当你进入濒死阶段，你可以重置你的武将牌，并将你的体力值回复值8点，然后获得技能【树枝】。",
            "nwsl_shixue":"嗜血",
            "nwsl_shixue_info":"锁定技，当你造成伤害时，你回复等量的生命值。",
            "nwsl_jinu":"激怒",
            "nwsl_jinu_info":"锁定技，当你受到伤害时，摸X张牌并获得X个激怒标记。（X为伤害值）",
            "nwsl_xxgzy":"吸血鬼之牙",
            "nwsl_xxgzy_info":"每3轮限一次，对一名其他角色造成1点伤害。(每拥有一个激怒标记，便额外造成一点伤害)",
            "nwsl_ywzs":"欲望之手",
            "nwsl_ywzs_info":"你的摸牌数翻倍。",
            "nwsl_pjjg":"披甲金刚",
            "nwsl_pjjg_info":"当你受到X点伤害后，获得X点护甲，摸X张牌。",
            "nwsl_llmf":"六棱魔方",
            "nwsl_llmf_info":"在你的回合开始和结束时随机获得两个优质战利品技能，直到回合结束。",
            "nwsl_maoxian3":"宝藏",
            "nwsl_maoxian3_info":"",
            "nwsl_11bs":"变身11",
            "nwsl_11bs_info":"",
            "nwsl_21bs":"变身21",
            "nwsl_21bs_info":"",
            "boss_nwsl":"封面",
            "boss_nwsl_info":"",
            "boss_nwsl_bianshen2":"变2",
            "boss_nwsl_bianshen2_info":"",
            "nwsl_zjgr":"终极感染",
            "nwsl_zjgr_info":"选择一个目标，对其造成5点伤害，你摸5张牌，获得5点护甲。",
            "nwsl_kysz2":"愈合",
            "nwsl_kysz2_info":"锁定技，每当你受到伤害时，摸一张牌并获得一个狂野标记。",
            "nwsl_kysz1":"狂野生长",
            "nwsl_kysz1_info":"你的回合开始时获得一个狂野标记；出牌阶段，你可以移除3个标记增加两点体力上限并回复一点生命值。",
            "nwsl_tianchong":"填充",
            "nwsl_tianchong_info":"回合开始时，你摸X张牌。（X为你的奥秘数的两倍）",
            "nwsl_wudu":"巫毒",
            "nwsl_wudu_info":"锁定技，其他角色使用【桃】时，你使其失去1点体力。",
            "nwsl_zhanlipin1":"战利品",
            "nwsl_zhanlipin1_info":"",
            "nwsl_fanjian":"翻捡",
            "nwsl_fanjian_info":"回合开始时，你可以发现一张锦囊牌。",
            "nwsl_bushu":"捕鼠",
            "nwsl_bushu_info":"",
            "nwsl_jjys":"急救药水",
            "nwsl_jjys_info":"回合结束时，回复一点体力值。",
            "nwsl_bingdong":"冰冻",
            "nwsl_bingdong_info":"",
            "boss_nwsl_bianshen1":"变1",
            "boss_nwsl_bianshen1_info":"",
            "boss_nwsl_bianshen3":"变3",
            "boss_nwsl_bianshen3_info":"",
            "nwsl_mianju":"面具",
            "nwsl_mianju_info":"限定技，回合开始时，你可以选择一名其他角色，获得其现有技能的全部复制。",
            "nwsl_xdmj":"新的面具",
            "nwsl_xdmj_info":"在你的准备阶段开始时随机获得三个优质战利品技能，直到你的下一个回合开始。",
            "nwsl_huixiang":"回响",
            "nwsl_huixiang_info":"你可以令你的普通锦囊牌额外结算一次",
            "nwsl_fzmj":"复制魔镜",
            "nwsl_fzmj_info":"出牌阶段，你可以选择一名角色，获得其一个技能的复制，然后移除本技能。",
        },
    },
    intro:"第一次玩本拓展的萌新，强烈推荐苔丝加两个报告兵的组合。",
    author:"小可乐",
    diskURL:"",
    forumURL:"算了，没有人会和我这个萌新一起讨论的",
    version:"1.41",
},files:{"character":["nwsl_boss_nvwusenlin.jpg","nwsl_baogaobing1.jpg","nwsl_baogaobing2.jpg","nwsl_boss_guguji.jpg","nwsl_taisi.jpg","nwsl_ceshi.jpg","nwsl_boss_mianjushoujizhe.jpg","nwsl_boss_sezawoyisheng.jpg","nwsl_boss_zhuobokabula.jpg","nwsl_boss_shengxuandeelang.jpg","nwsl_boss_liugenshuren.jpg","nwsl_boss_suizhi.jpg","nwsl_boss_fuya.jpg","nwsl_boss_buliezheyifan.jpg","nwsl_boss_gehouzheweili.jpg"],"card":[],"skill":[]}}};