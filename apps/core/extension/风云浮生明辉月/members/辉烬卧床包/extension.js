export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"辉烬卧床包",content:function (config,pack){
    
},precontent:function (){
    
},help:{},config:{},package:{
    character:{
        character:{
            Ahjwlzgl:["male","shu",3,["hjxinxinqimen","hjxindunjia"],[]],
            Ahjwhzgl:["male","shu",3,["hjxinzhentu","hjxinrangxing","hjxinxingxiang"],[]],
            Ahjxjxs:["male","shu",4,["hjxinrenxia","hjxincongwen"],[]],
            Ahjwsgy:["male","shu",4,["hjxinwusheng","hjxinyijue"],[]],
            Ahjzszf:["male","shu",4,["hjxinpaoxiao","hjxinzhanshen"],[]],
            Ahjlszy:["male","shu",4,["hjxinlongdan","hjxinyajiao"],[]],
            Ahjfcpt:["male","shu",4,["hjxinlianhuan","hjxinzhanji","hjxinniepan"],[]],
            Ahjhwsc:["male","wu",4,["hjxinjiang","hjxinhunzi"],[]],
        },
        translate:{
            Ahjwlzgl:"辉★卧龙诸葛亮",
            Ahjwhzgl:"辉★武侯诸葛亮",
            Ahjxjxs:"辉★玄剑徐庶",
            Ahjwsgy:"辉★武圣关羽",
            Ahjzszf:"辉★战神张飞",
            Ahjlszy:"辉★龙神赵云",
            Ahjfcpt:"辉★凤雏庞统",
            Ahjhwsc:"辉★恒王孙策",
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
            hjbaiji:{
                audio:"yiji",
                enable:"phaseUse",
                usable:1,
                filter:function (event,player){
        return player.countCards('he')>0;
    },
                chooseButton:{
                    dialog:function (event,player){
            var list=[];
            for(var i=0;i<lib.inpile.length;i++){
                var name=lib.inpile[i];
                if(get.type(name)=='trick') list.push(['锦囊','',name]);
            }
            return ui.create.dialog('百计',[list,'vcard']);
        },
                    filter:function (button,player){
            return lib.filter.filterCard({name:button.link[2]},player,_status.event.getParent());
        },
                    check:function (button){
            var player=_status.event.player;
            var recover=0,lose=1,players=game.filterPlayer();
            for(var i=0;i<players.length;i++){
                if(players[i].hp==1&&get.damageEffect(players[i],player,player)>0&&!players[i].hasSha()){
                    return (button.link[2]=='juedou')?2:-1;
                }
                if(!players[i].isOut()){
                    if(players[i].hp<players[i].maxHp){
                        if(get.attitude(player,players[i])>0){
                            if(players[i].hp<2){
                                lose--;
                                recover+=0.5;
                            }
                            lose--;
                            recover++;
                        }
                        else if(get.attitude(player,players[i])<0){
                            if(players[i].hp<2){
                                lose++;
                                recover-=0.5;
                            }
                            lose++;
                            recover--;
                        }
                    }
                    else{
                        if(get.attitude(player,players[i])>0){
                            lose--;
                        }
                        else if(get.attitude(player,players[i])<0){
                            lose++;
                        }
                    }
                }
            }
            if(lose>recover&&lose>0) return (button.link[2]=='nanman')?1:-1;
            if(lose<recover&&recover>0) return (button.link[2]=='taoyuan')?1:-1;
            return (button.link[2]=='wuzhong')?1:-1;
        },
                    backup:function (links,player){
            return {
                filterCard:true,
                selectCard:1,
                popname:true,
                check:function (card){
                    return 6-get.value(card);
                },
                viewAs:{name:links[0][2],nature:links[0][3]},
                onuse:function(result,player){
                    player.logSkill('hjbaiji');
                }
            }
        },
                    prompt:function (links,player){
            return '将一张手牌当做'+(get.translation(links[0][3])||'')+get.translation(links[0][2])+'使用';
        },
                },
                ai:{
                    order:4,
                    result:{
                        player:1,
                    },
                    threaten:1.5,
                },
            },
            hjxinlongdan:{
                audio:"longdan_sha",
                enable:"chooseToUse",
                group:["hjxinlongdan_sha","hjxinlongdan_shan"],
                filter:function (event,player){    
                if(!player.countCards('h',{type:'basic'})) return false;                                            
        if((event.filterCard({name:'sha'},player,event))||
            (event.filterCard({name:'jiu'},player,event))||
            (event.filterCard({name:'tao'},player,event))){
   return player.isAlive();    
        }
        return false;
    },
                chooseButton:{
                    dialog:function (event,player){
            var list=[];
            if(event.filterCard({name:'sha'},player,event)){
                list.push(['基本','','sha']);
                list.push(['基本','','sha','fire']);
                list.push(['基本','','sha','thunder']);
            }
            if(event.filterCard({name:'tao'},player,event)){
                list.push(['基本','','tao']);
            }
            if(event.filterCard({name:'jiu'},player,event)){
                list.push(['基本','','jiu']);
            }
            return ui.create.dialog('龙胆',[list,'vcard'],'hidden');
        },
                    check:function (button){
            var player=_status.event.player;
            var card={name:button.link[2],nature:button.link[3]};
            if(game.hasPlayer(function(current){
                return player.canUse(card,current)&&get.effect(current,card,player,player)>0;
            })){
                switch(button.link[2]){
                    case 'tao':return 5;
                    case 'jiu':return 3.01;
                    case 'sha':
                        if(button.link[3]=='fire') return 2.95;
                        else if(button.link[3]=='fire') return 2.92;
                        else return 2.9;
                }
            }
            return 0;
        },
                    backup:function (links,player){
            return {
                  filterCard:function (card,player){                    
                      return get.type(card)=='basic';
                },
                selectCard:1,
                viewAsFilter:function (player){return player.isAlive()},
                viewAs:{name:links[0][2],nature:links[0][3],suit:null,number:null},                                    
                popname:true,
                ignoreMod:true,
                precontent:function(){                            
                    player.logSkill('hjxinlongdan');                        
                },
            }
        },
                    prompt:function (links,player){
            return '视为使用一张'+get.translation(links[0][3]||'')+get.translation(links[0][2]);
        },
                },
                ai:{
                    order:function (){
            var player=_status.event.player;
            var event=_status.event;
            if(event.filterCard({name:'jiu'},player,event)&&get.effect(player,{name:'jiu'})>0){
                return 3.1;
            }
            return 2.9;
        },
                    save:true,
                    respondSha:true,
                    result:{
                        player:1,
                    },
                },
            },
            "hjxinlongdan_sha":{
                trigger:{
                    player:"chooseToRespondBegin",
                },
                filter:function (event,player){         
        if(!event.filterCard({name:'sha'})) return false;
        if(!lib.filter.cardRespondable({name:'sha'},player,event)) return false;                 
     //  if(event.parent.name!='sha') return false;
        return true;
    },
                content:function (){     
                    "step 0"
        player.chooseCard(get.prompt2('hjxinlongdan_sha'),'h',function(card){
                        return get.type(card)=='basic';
                    }).set('ai',function(card){
                        if(!_status.event.player.countCards('h','shan')){
                            return 8-get.value(card);
                        }
                        return 6-get.value(card);
                    });
                    "step 1"
                    if(result.bool){
                        trigger.untrigger();
                        trigger.responded=true;
                        trigger.result={bool:true,card:{name:'sha'}};
                        player.lose(result.cards,ui.special);
                        player.$throw(result.cards);
                        player.logSkill('hjxinlongdan');                    
                    }                    
        else event.finish();                
    },
            },
            "hjxinlongdan_shan":{
                trigger:{
                    player:["chooseToRespondBegin","chooseToUseBegin"],
                },
                direct:true,
                filter:function (event,player){     
    if(event.parent.name!='sha') return false;
    if(!lib.filter.cardRespondable({name:'shan'},player,event)) return false;
    if(!event.filterCard({name:'shan'})) return false;
         return true;                                  
    },
                content:function (){
              "step 0"
        player.chooseCard(get.prompt2('hjxinlongdan_shan'),'h',function(card){
                        return get.type(card)=='basic';
                    }).set('ai',function(card){
                        if(!_status.event.player.countCards('h','shan')){
                            return 8-get.value(card);
                        }
                        return 6-get.value(card);
                    });
                    "step 1"
                    if(result.bool){
                        trigger.untrigger();
                        trigger.responded=true;
                        trigger.result={bool:true,card:{name:'shan'}};
                        player.lose(result.cards,ui.special);
                        player.$throw(result.cards);                        
                        player.logSkill('hjxinlongdan');                    
                    }                    
        else event.finish();   
},
            },
            hjxinqimen:{
                audio:"guanxing",
                trigger:{
                    player:"drawBegin",
                },
                content:function (){
'step 0'
delete player.storage.hjxinqimen;
event.gain=[];
if(!player.storage.hjxinqimen) player.storage.hjxinqimen=0;
'step 1'
event.cards=get.cards()[0];
player.showCards(event.cards);
if(get.type(event.cards)=='basic') player.storage.hjxinqimen++;
event.cards.discard();
event.gain.push(event.cards);
'step 2'
if(player.storage.hjxinqimen<2) event.goto(1);
'step 3'
if(event.gain.length){
player.gain(event.gain);
player.$draw(event.gain);
}
trigger.cancel();
},
                ai:{
                    threaten:2,
                },
            },
            "hjxindunjia_gong":{
                position:"he",
                audio:"huoji",
                enable:"chooseToUse",
                filterCard:function (card){
        return get.color(card)=='red';
    },
                viewAs:{
                    name:"huogong",
                    nature:"fire",
                },
                viewAsFilter:function (player){
        if(!player.countCards('he',{color:'red'})) return false;
    },
                prompt:"将一张红色牌当火攻使用",
                check:function (card){
        var player=_status.currentPhase;
        if(player.countCards('h')>player.hp){
            return 6-get.value(card);
        }
        return 4-get.value(card)
    },
                ai:{
                    basic:{
                        order:4,
                        value:[3,1],
                        useful:1,
                    },
                    wuxie:function (target,card,player,current,state){
            if(get.attitude(current,player)>=0&&state>0) return false;
        },
                    result:{
                        player:function (player){
                var nh=player.countCards('h');
                if(nh<=player.hp&&nh<=4&&_status.event.name=='chooseToUse'){
                    if(typeof _status.event.filterCard=='function'&&
                        _status.event.filterCard({name:'huogong'})){
                        return -10;
                    }
                    if(_status.event.skill){
                        var viewAs=get.info(_status.event.skill).viewAs;
                        if(viewAs=='huogong') return -10;
                        if(viewAs&&viewAs.name=='huogong') return -10;
                    }
                }
                return 0;
            },
                        target:function (player,target){
                if(target.hasSkill('huogong2')||target.countCards('h')==0) return 0;
                if(player.countCards('h')<=1) return 0;
                if(target==player){
                    if(typeof _status.event.filterCard=='function'&&
                        _status.event.filterCard({name:'huogong'})){
                        return -1.5;
                    }
                    if(_status.event.skill){
                        var viewAs=get.info(_status.event.skill).viewAs;
                        if(viewAs=='huogong') return -1.5;
                        if(viewAs&&viewAs.name=='huogong') return -1.5;
                    }
                    return 0;
                }
                return -1.5;
            },
                    },
                    tag:{
                        damage:1,
                        fireDamage:1,
                        natureDamage:1,
                        norepeat:1,
                    },
                },
            },
            "hjxindunjia_shou":{
                audio:"kanpo",
                position:"he",
                enable:"chooseToUse",
                filterCard:function (card){
        return get.color(card)=='black';
    },
                viewAsFilter:function (player){
        return player.countCards('he',{color:'black'})>0;
    },
                viewAs:{
                    name:"wuxie",
                },
                prompt:"将一张黑色牌当无懈可击使用",
                check:function (card){return 8-get.value(card)},
                threaten:1.2,
                ai:{
                    basic:{
                        useful:[6,4],
                        value:[6,4],
                    },
                    result:{
                        player:1,
                    },
                    expose:0.2,
                },
            },
            hjxindunjia:{
                forced:true,
                group:["hjxindunjia_gong","hjxindunjia_shou"],
            },
            "hjxinzhentu_shan":{
                audio:"bazhen",
                trigger:{
                    player:["chooseToRespondBegin","chooseToUseBegin"],
                },
                filter:function (event,player){
        if(event.responded) return false;
        if(!event.filterCard({name:'shan'},player,event)) return false;
        return player.countCards('h','shan')>0;
    },
                direct:true,
                usable:991,
                content:function (){
        "step 0"
        var goon=(get.damageEffect(player,trigger.player,player)<=0);
        player.chooseCard(get.prompt2('hjxinzhentu_shan'),{name:'shan'}).ai=function(){
            return goon?1:0;
        }
        "step 1"
        if(result.bool){
            player.logSkill('hjxinzhentu');
            player.showCards(result.cards);
            trigger.untrigger();
            trigger.responded=true;
            trigger.result={bool:true,card:{name:'shan'}}
            player.addSkill('hjxinzhentu_ai');
        }
        else{
            player.storage.counttrigger.zhangmu--;
        }
    },
                ai:{
                    respondShan:true,
                    effect:{
                        target:function (card,player,target,effect){
                if(get.tag(card,'respondShan')&&effect<0){
                    if(target.hasSkill('hjxinzhentu_ai')) return 0;
                    if(target.countCards('h')>=2) return 0.5;
                }
            },
                    },
                },
            },
            "hjxinzhentu_sha":{
                audio:"bazhen",
                trigger:{
                    player:["chooseToRespondBegin"],
                },
                filter:function (event,player){
        if(event.responded) return false;
        if(!event.filterCard({name:'sha'},player,event)) return false;
        return player.countCards('h','sha')>0;
    },
                direct:true,
                usable:991,
                content:function (){
        "step 0"
        var goon=(get.damageEffect(player,trigger.player,player)<=0);
        player.chooseCard(get.prompt2('hjxinzhentu_sha'),{name:'sha'}).ai=function(){
            return goon?1:0;
        }
        "step 1"
        if(result.bool){
            player.logSkill('hjxinzhentu');
            player.showCards(result.cards);
            trigger.untrigger();
            trigger.responded=true;
            trigger.result={bool:true,card:{name:'sha'}}
            player.addSkill('hjxinzhentu_ai');
        }
        else{
            player.storage.counttrigger.zhangmu--;
        }
    },
                ai:{
                    respondShan:true,
                    effect:{
                        target:function (card,player,target,effect){
                if(get.tag(card,'respondShan')&&effect<0){
                    if(target.hasSkill('hjxinzhentu_ai')) return 0;
                    if(target.countCards('h')>=2) return 0.5;
                }
            },
                    },
                },
            },
            hjxinzhentu:{
                audio:"bazhen",
                forced:true,
                group:["hjxinzhentu_sha","hjxinzhentu_shan"],
            },
            hjxinyijue:{
                audio:"yijue",
                enable:"phaseUse",
                usable:1,
                position:"he",
                filterTarget:function (card,player,target){
        return player!=target&&target.countCards('h');
    },
                filterCard:true,
                check:function (card){
        return 8-get.value(card);
    },
                content:function (){
        "step 0"
        target.chooseCard(true).ai=function(card){
            var player=_status.event.player;
            if((player.hasShan()||player.hp<3)&&get.color(card)=='black') return 0.5;
            return Math.max(1,20-get.value(card));
        };
        "step 1"
        target.showCards(result.cards);
        event.card2=result.cards[0];
        if(get.color(event.card2)=='black'){
            if(!target.hasSkill('baiban')){
                target.addTempSkill('baiban');
            }
            target.addTempSkill('hjxinyijue2');
            event.finish();
        }
        else{
            player.gain(event.card2,target,'give');
            if(target.hp<target.maxHp){
                player.chooseBool('是否让目标回复一点体力？').ai=function(event,player){
                    return get.recoverEffect(target,player,player)>0;
                };
            }
        }
        "step 2"
        if(result.bool){
            target.recover();
        }
    },
                ai:{
                    result:{
                        target:function (player,target){
                var hs=player.getCards('h');
                if(hs.length<3) return 0;
                if(target.countCards('h')>target.hp+1&&get.recoverEffect(target)>0){
                    return 1;
                }
                if(player.canUse('sha',target)&&(player.countCards('h','sha')||player.countCards('he',{color:'red'}))){
                    return -2;
                }
                return -0.5;
            },
                    },
                    order:9,
                },
            },
            "hjxinyijue2":{
                trigger:{
                    player:"damageBegin1",
                },
                filter:function (event){
        return event.source&&event.source.hasSkill('hjxinyijue')&&event.card&&event.card.name=='sha'&&event.notLink();
    },
                silent:true,
                popup:false,
                forced:true,
                content:function (){
        trigger.num++;
    },
                mark:true,
                mod:{
                    "cardEnabled2":function (card){
            if(get.position(card)=='h') return false;
        },
                },
                intro:{
                    content:"不能使用或打出手牌",
                },
            },
            hjxinwusheng:{
                mod:{
                    targetInRange:function (card){
            if(get.suit(card)=='diamond'&&(_status.event.skill=='hjxinwusheng'||card.name=='sha')) return true;
        },
                },
                audio:"wusheng",
                enable:["chooseToRespond","chooseToUse"],
                filterCard:true,
                position:"he",
                viewAs:{
                    name:"sha",
                },
                viewAsFilter:function (player){
        if(!player.countCards('he')) return false;
    },
                prompt:"将一张牌当杀使用或打出",
                check:function (card){return 4-get.value(card)},
                ai:{
                    skillTagFilter:function (player){
            if(get.zhu(player,'shouyue')){
                if(!player.countCards('he')) return false;
            }
        },
                    respondSha:true,
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
            hjxinpaoxiao:{
                audio:"paoxiao",
                inherit:"paoxiao",
                mod:{
                    targetInRange:function (card,player){
            if(card.name=='sha'&&get.cardCount({name:'sha'},player)>0) return true;
        },
                    cardUsable:function (card,player,num){
            if(card.name=='sha') return Infinity;
        },
                },
                group:["hjxinpaoxiao_miss","hjxinpaoxiao_wushi"],
                subSkill:{
                    miss:{
                        trigger:{
                            player:"shaMiss",
                        },
                        forced:true,
                        direct:true,
                        popup:false,
                        content:function (){
                player.logSkill('hjxinpaoxiao');
                player.draw();
            },
                        sub:true,
                    },
                    wushi:{
                        trigger:{
                            player:"shaBefore",
                        },
                        forced:true,
                        popup:false,
                        filter:function (event,player){ 
                return event.card; 
            },
                        content:function (){ 
                player.addTempSkill('unequip','shaAfter'); 
            },
                        sub:true,
                    },
                },
                ai:{
                    unequip:true,
                    skillTagFilter:function (player,tag,arg){
            if(!get.zhu(player,'shouyue')) return false;
            if(arg&&arg.name=='sha') return true;
            return false;
        },
                },
                trigger:{
                    player:"useCard1",
                },
                forced:true,
                filter:function (event,player){
        return !event.audioed&&event.card.name=='sha'&&player.countUsed('sha',true)>1&&event.getParent().type=='phase';
    },
                content:function (){
        trigger.audioed=true;
    },
                firstDo:true,
                audioname:["re_zhangfei","guanzhang","xiahouba"],
            },
            hjxinpojun:{
                enable:"chooseToUse",
                filterCard:true,
                selectCard:2,
                position:"he",
                viewAs:{
                    name:"sha",
                },
                prompt:"将两张牌当杀使用",
                check:function (card){
        if(_status.event.player.countCards('h')<4) return 6-get.useful(card);
        return 7-get.useful(card);
    },
                ai:{
                    order:function (){
            return get.order({name:'sha'})+0.1;
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
                group:["hjxinpojun2"],
            },
            "hjxinpojun2":{
                trigger:{
                    player:"shaBegin",
                },
                filter:function (event){
        return event.skill=='hjxinpojun'
    },
                forced:true,
                popup:false,
                content:function (){
        "step 0"
        var next=trigger.target.chooseToRespond({name:'shan'});
        next.autochoose=lib.filter.autoRespondShan;
        next.ai=function(card){
            if(trigger.target.countCards('h','shan')>1){
                return get.unuseful2(card);
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
                    threaten:1.3,
                },
            },
            hjxinyajiao:{
                audio:"reyajiao",
                trigger:{
                    player:["respond","useCard"],
                },
                frequent:true,
                filter:function (event,player){
        return true;
    },
                content:function (){
        "step 0"
        event.card=get.cards();
        player.showCards(event.card);
        event.same=false;
        if(get.type(event.card[0],'trick')==get.type(trigger.card,'trick')) event.same=true;
        player.chooseTarget('选择获得此牌的角色',true).set('ai',function(target){
            var att=get.attitude(_status.event.player,target);
            if(_status.event.du){
                if(target.hasSkillTag('nodu')) return 0;
                return -att;
            }
            if(!_status.event.same) att+=target==_status.event.player?1:0;
            if(att>0){
                return att+Math.max(0,5-target.countCards('h'));
            }
            return att;
        }).set('du',event.card.name=='du').set('same',event.same);
        "step 1"
        if(result.targets){
            player.line(result.targets,'green');
            result.targets[0].gain(event.card,'gain2');
            if(!event.same) player.chooseToDiscard(true,'he');
        }
    },
                ai:{
                    effect:{
                        target:function (card,player){
                if(get.tag(card,'respond')&&player.countCards('h')>1) return [1,0.2];
            },
                    },
                },
            },
            hjxinzhanji:{
                audio:"zhanji",
                trigger:{
                    player:"useCard",
                },
                usable:1999,
                direct:true,
                filter:function (event,player){
    return get.type(event.card)=="trick"&&event.targets.length>0||get.type(event.card)=="basic"&&event.targets.length>0;;
    },
                content:function (){
    "step 0"
    player.chooseTarget("展骥:是否指定1名不是"+get.translation(trigger.card)+"目标的其他角色成为此牌额外目标",function(card,player,target){
   var trigger=_status.event.getTrigger();
   return target!=trigger.targets[0];
   }).set('autodelay',true).set('ai',function(target){
   var trigger=_status.event.getTrigger();
   var player=_status.event.player;
   return get.effect(target,trigger.card,player,player);
   });
   "step 1"
   if(result.bool){
player.logSkill("hjxinzhanji",result.targets);
event.targets=result.targets[0];
player.line(event.targets,["fire","thunder","green","white"].randomGet());
trigger.targets.push(event.targets);
game.log(event.targets,"成为",trigger.card,"额外目标");
}
    },
                ai:{
                    threaten:2,
                },
            },
            "hjxinlianhuan_tiesuo":{
                audio:["xinlianhuan",1],
                audioname:["xinlianhuan"],
                enable:"phaseUse",
                filter:function (event,player){
        return player.countCards('h',{color:'black'})>0;
    },
                filterCard:{
                    color:"black",
                },
                viewAs:{
                    name:"tiesuo",
                },
                prompt:"将一张黑色手牌当铁锁连环使用",
                check:function (card){return 6-get.value(card)},
                ai:{
                    wuxie:function (){
            if(_status.event.getRand()<0.5) return 0;
        },
                    basic:{
                        useful:4,
                        value:4,
                        order:7,
                    },
                    result:{
                        target:function (player,target){
                if(target.isLinked()){
                    if(target.hasSkillTag('link')) return 0;
                    var f=target.hasSkillTag('nofire');
                    var t=target.hasSkillTag('nothunder');
                    if(f&&t) return 0;
                    if(f||t) return 0.5;
                    return 2;
                }
                if(get.attitude(player,target)>=0) return -0.9;
                if(ui.selected.targets.length) return -0.9;
                if(game.hasPlayer(function(current){
                    return get.attitude(player,current)<=-1&&current!=target&&!current.isLinked();
                })){
                    return -0.9;
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
            "hjxinlianhuan_mubiao":{
                mod:{
                    selectTarget:function (card,player,range){
            if(card.name=='tiesuo'&&player.hasSkill('hjxinlianhuan')&&range[1]<3&&range[1]!=-1) range[1]=3;
        },
                },
            },
            "hjxinlianhuan_chongzhu":{
                audio:["xinlianhuan",2],
                popup:"lianhuan",
                enable:"phaseUse",
                filter:function (event,player){
        return player.countCards('h',{color:'black'})>0;
    },
                filterCard:function (card){
        return get.color(card)=='black';
    },
                check:function (card){
        return 5-get.useful(card);
    },
                content:function (){
        player.draw();
    },
                discard:false,
                visible:true,
                loseTo:"discardPile",
                prompt:"将一张黑色牌置入弃牌堆并摸一张牌",
                delay:0.5,
                prepare:function (cards,player){
        player.$throw(cards,1000);
        game.log(player,'将',cards,'置入了弃牌堆');
    },
                ai:{
                    basic:{
                        order:1,
                    },
                    result:{
                        player:1,
                    },
                },
            },
            hjxinlianhuan:{
                audio:"ext:风云浮生明辉月/members/辉烬卧床包:2",
                group:["hjxinlianhuan_mubiao","hjxinlianhuan_tiesuo","hjxinlianhuan_chongzhu"],
            },
            "hjxinniepan_yuhuo":{
                forced:true,
                nobracket:true,
                trigger:{
                    player:"damageEnd",
                },
                filter:function (event,player){
        return event.nature=='fire';
    },
                content:function (){
        player.recover(trigger.num);
    },
                ai:{
                    nofire:true,
                    effect:{
                        target:function (card,player,target,current){
                if(get.tag(card,'fireDamage')) return 0;
            },
                    },
                },
            },
            "hjxinniepan_chongsheng":{
                audio:"niepan",
                audioname:["re_pangtong"],
                unique:true,
                enable:"chooseToUse",
                mark:true,
                limited:true,
                skillAnimation:true,
                animationStr:"涅盘",
                animationColor:"fire",
                init:function (player){
        player.storage.niepan=false;
    },
                filter:function (event,player){
        if(player.storage.niepan) return false;
        if(event.type=='dying'){
            if(player!=event.dying) return false;
            return true;
        }
        else if(event.parent.name=='phaseUse'){
            return true;
        }
        return false;
    },
                content:function (){
        'step 0'
        player.awakenSkill('hjxinniepan_chongsheng');
        player.storage.niepan=true;
        player.discard(player.getCards('hej'));
        'step 1'
        if(player.hp<player.maxHp){
            player.recover(player.maxHp-player.hp);
        }
        'step 2'
        player.draw(3);
        'step 3'
        player.link(false);
        'step 4'
        player.turnOver(false);
    },
                ai:{
                    order:0.5,
                    skillTagFilter:function (player){
            if(player.storage.niepan) return false;
            if(player.hp>0) return false;
        },
                    save:true,
                    result:{
                        player:function (player){
                if(player.hp==0) return 10;
                if(player.hp<=1&&player.countCards('he')<=1) return 10;
                return 0;
            },
                    },
                    threaten:function (player,target){
            if(!target.storage.niepan) return 0.6;
        },
                },
                intro:{
                    content:"limited",
                },
            },
            hjxinniepan:{
                audio:"ext:风云浮生明辉月/members/辉烬卧床包:2",
                group:["hjxinniepan_yuhuo","hjxinniepan_chongsheng"],
            },
            hjxinxinqimen:{
                audio:"guanxing",
                forced:true,
                frequent:true,
                trigger:{
                    target:"useCardToBegin",
                },
                filter:function (event,player){
        if(event.player.hp<=player.hp) return true;
        if(event.targets.length>1) return true;
        var hs=player.getCards('h');
        var names=['sha','shan','tao','jiu'];
        for(var i=0;i<hs.length;i++){
            names.remove(hs[i].name);
        }
        for(var i=0;i<ui.cardPile.childElementCount;i++){
            if(names.contains(ui.cardPile.childNodes[i].name)){
                return true;
            }
        }
        return false;
    },
                usable:111,
                content:function (){
        var hs=player.getCards('h');
        var list=[];
        var names=['sha','shan','tao','jiu'];
        for(var i=0;i<hs.length;i++){
            names.remove(hs[i].name);
        }
        for(var i=0;i<ui.cardPile.childElementCount;i++){
            if(names.contains(ui.cardPile.childNodes[i].name)){
                list.push(ui.cardPile.childNodes[i]);
            }
        }
        if(list.length){
            player.gain(list.randomGet(),'draw');
        }
    },
            },
            hjxinrangxing:{
                audio:"qixing",
                trigger:{
                    global:"dying",
                },
                priority:100,
                direct:true,
                content:function (){
   "step 0"
   event.players=trigger.player;
   player.chooseBool("是否发动禳星").ai=function(event,player){
   var players=_status.event.getParent().player;
   if(player.getFriends().contains(event.players)||event.players==player) return true;
   return false;
   };
   "step 1"
   if(result.bool){
   player.logSkill("hjxinrangxing",trigger.player);
   player.line(trigger.player,"white");
   game.delay(0.1);
   }
   else event.finish();
   "step 2"
                player.judge(function(card){
                if(get.suit(card)!='spade') return 3;
                return 1;
                });
                "step 3"
                if(result.suit){
                if(result.suit!='spade') trigger.player.recover(1-trigger.player.hp);
                else trigger.player.draw();
                }
   },
                ai:{
                    threaten:1.9,
                    expose:0.1,
                },
            },
            hjxinrenxia:{
                audio:"zhuhai",
                enable:"phaseUse",
                usable:1,
                filter:function (event,player){
        return player.countCards('he')>0;
    },
                filterCard:true,
                position:"he",
                filterTarget:function (card,player,target){
        return target!=player;
    },
                check:function (event,player){
        return get.attitude(player,event.target)<=0;
    },
                content:function (){
        player.addTempSkill('hjxinrenxia_miss','shaAfter');
        player.addTempSkill('hjxinrenxia_damage','shaAfter');
        player.useCard({name:'sha'},target,false);
    },
                subSkill:{
                    miss:{
                        trigger:{
                            player:"shaMiss",
                        },
                        forced:true,
                        content:function (){
        player.draw();
        },
                        sub:true,
                    },
                    damage:{
                        trigger:{
                            source:"damageEnd",
                        },
                        forced:true,
                        filter:function (event,player){
                return event.card&&event.card.name=='sha';
            },
                        content:function (){
                player.gainPlayerCard('he',trigger.player,true);
            },
                        sub:true,
                    },
                },
                ai:{
                    order:8,
                    expose:0.2,
                    result:{
                        target:function (player,target){ 
                return ai.get.damageEffect(target,player); 
            },
                    },
                },
            },
            hjxincongwen:{
                skillAnimation:true,
                animationColor:"orange",
                audio:"qianxin",
                unique:true,
                juexingji:true,
                trigger:{
                    source:"damageSource",
                },
                forced:true,
                derivation:"jianyan",
                filter:function (event,player){
        return player.hp<=player.maxHp;
    },
                content:function (){
        player.awakenSkill('hjxincongwen');
        player.addSkill('hjxinwuyan');
        player.addSkill('hjxincelue');
    },
            },
            hjxinwuyan:{
                audio:"wuyan",
                trigger:{
                    player:"damageBegin4",
                },
                forced:true,
                check:function (event,player){
        if(player==event.player) return true;
        return false;
    },
                filter:function (event,player){
        return get.type(event.card,'trick')=='trick';
    },
                content:function (){
        trigger.cancel();
    },
                ai:{
                    notrick:true,
                    notricksource:true,
                    effect:{
                        target:function (card,player,target,current){
                if(get.type(card)=='trick'&&get.tag(card,'damage')){
                    return 'zeroplayertarget';
                }
            },
                    },
                },
            },
            hjxincelue:{
                nobracket:true,
                audio:"jianyan",
                enable:"phaseUse",
                usable:1,
                line:false,
                filterTarget:function (card,player,target){
        return target.countCards('h')!=player.countCards('h');
     },
                selectTarget:1,
                content:function (){
     player.line(target,["fire","thunder","green","white"].randomGet());
     var num=player.countCards('h');
     var nh=target.countCards('h');
     if(num<nh) target.chooseToDiscard(nh-num,true);
     else target.draw(num-nh);
     },
                ai:{
                    order:2,
                    result:{
                        target:function (player,target){
             return player.countCards('h')-target.countCards('h');
             },
                    },
                    threaten:2,
                },
            },
            "hjxinzhanshen_sha":{
                audio:"ext:风云浮生明辉月/members/辉烬卧床包:2",
                enable:["chooseToRespond","chooseToUse"],
                filterCard:function (card,player){
        if(get.zhu(player,'shouyue')) return true;
        return get.color(card)=='black';
    },
                position:"he",
                viewAs:{
                    name:"sha",
                },
                viewAsFilter:function (player){
        if(get.zhu(player,'shouyue')){
            if(!player.countCards('he')) return false;
        }
        else{
            if(!player.countCards('he',{color:'black'})) return false;
        }
    },
                prompt:"将一张黑色牌当杀使用或打出",
                check:function (card){return 4-get.value(card)},
                ai:{
                    skillTagFilter:function (player){
            if(get.zhu(player,'shouyue')){
                if(!player.countCards('he')) return false;
            }
            else{
                if(!player.countCards('he',{color:'black'})) return false;
            }
        },
                    respondSha:true,
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
            "hjxinzhanshen_xiangying":{
                audio:"tishen",
                trigger:{
                    player:"shaBegin",
                },
                priority:7,
                logTarget:"target",
                forced:true,
                filter:function (event,player){
        return event.card&&(get.color(event.card)=='red'||get.color(event.card)=='black');
    },
                content:function (){
        if(get.suit(trigger.card)=='club'){
            trigger.directHit=true;
        }else if(get.suit(trigger.card)=='spade'){
            if(typeof trigger.extraDamage!='number'){
                trigger.extraDamage=0;
            }
            trigger.extraDamage++;
        }
    },
                ai:{
                    unequip:true,
                    skillTagFilter:function (player,tag,arg){
            if(arg&&arg.name=='sha'&&get.color(arg.card)=='black') return true;
            return false;
        },
                },
            },
            hjxinzhanshen:{
                audio:"tishen",
                forced:true,
                group:["hjxinzhanshen_sha","hjxinzhanshen_xiangying"],
            },
            hjxintianming:{
                audio:"guicai",
                group:["hjxintianming_panding","hjxintianming_shiyong"],
            },
            "hjxintianming_shiyong":{
                audio:"guicai",
                enable:["chooseToUse","chooseToRespond"],
                usable:1999,
                onChooseToUse:function (event){
        var cards=[];
        var num=game.players.length>3?game.players.length:3;
        if(ui.cardPile.childNodes.length<num){
            var discardcards=get.cards(num);
            for(var i=0;i<discardcards.length;i++){
                discardcards[i].discard();
            }
        }
        for(var i=0;i<num;i++){
            cards.push(ui.cardPile.childNodes[i]);
        }
        event.set('lanquancards',cards);
    },
                chooseButton:{
                    dialog:function (event,player){
            return ui.create.dialog('选择一张牌使用',event.lanquancards);
        },
                    filter:function (button,player){
            var evt=_status.event.getParent();
            if(evt&&evt.filterCard){
                var type=get.type(button.link,'trick');
                return evt.filterCard(button.link,player,evt);
            }
            return false;
        },
                    check:function (button){
            return get.value(button.link);
        },
                    backup:function (links,player){
            return {
                filterCard:function(){return false},
                selectCard:-1,
                viewAs:links[0],
            }
        },
                    prompt:function (links,player){
            return '选择'+get.translation(links)+'的目标';
        },
                },
                ai:{
                    order:12,
                    result:{
                        player:1,
                    },
                    threaten:1.5,
                },
            },
            "hjxintianming_panding":{
                audio:"guicai",
                trigger:{
                    global:"judgeBefore",
                },
                content:function (){
        "step 0"
        var A=game.players.length>3?game.players.length:3;
        event.cards=get.cards(A);
        player.chooseCardButton(true,event.cards,'天命：选择一张牌作为'+get.translation(trigger.player)+'的'+trigger.judgestr+'判定结果').ai=function(button){
            if(get.attitude(player,trigger.player)>0){
                return 1+trigger.judge(button.link);
            }
            if(get.attitude(player,trigger.player)<0){
                return 1-trigger.judge(button.link);
            }
            return 0;
        };
        "step 1"
        if(!result.bool){
            event.finish();
            return;
        }
        player.logSkill('hjxintianming_panding',trigger.player);
        var card=result.links[0];
        event.cards.remove(card);
        var judgestr=get.translation(trigger.player)+'的'+trigger.judgestr+'判定';
        event.videoId=lib.status.videoId++;
        event.dialog=ui.create.dialog(judgestr);
        event.dialog.classList.add('center');
        event.dialog.videoId=event.videoId;

        game.addVideo('judge1',player,[get.cardInfo(card),judgestr,event.videoId]);
        for(var i=0;i<event.cards.length;i++) event.cards[i].discard();
        // var node=card.copy('thrown','center',ui.arena).animate('start');
        var node;
        if(game.chess){
            node=card.copy('thrown','center',ui.arena).animate('start');
        }
        else{
            node=player.$throwordered(card.copy(),true);
        }
        node.classList.add('thrownhighlight');
        ui.arena.classList.add('thrownhighlight');
        if(card){
            trigger.cancel();
            trigger.result={
                card:card,
                judge:trigger.judge(card),
                node:node,
                number:get.number(card),
                suit:get.suit(card),
                color:get.color(card),
            };
            if(trigger.result.judge>0){
                trigger.result.bool=true;
                trigger.player.popup('洗具');
            }
            if(trigger.result.judge<0){
                trigger.result.bool=false;
                trigger.player.popup('杯具');
            }
            game.log(trigger.player,'的判定结果为',card);
            trigger.direct=true;
            trigger.position.appendChild(card);
            game.delay(2);
        }
        else{
            event.finish();
        }
        "step 2"
        ui.arena.classList.remove('thrownhighlight');
        event.dialog.close();
        game.addVideo('judge2',null,event.videoId);
        ui.clear();
        var card=trigger.result.card;
        trigger.position.appendChild(card);
        trigger.result.node.delete();
        game.delay();
    },
                ai:{
                    tag:{
                        rejudge:1,
                    },
                },
            },
            hjxintianlang:{
                audio:"baiyin",
                trigger:{
                    source:"dieAfter",
                },
                filter:function (event,player){
    return event.player!=player;
    },
                content:function (){
    var target=trigger.player;
    player.line(target,['fire','water','thunder','green'].randomGet());
    for(var i=0;i<target.skills.length;i++){
player.addSkill(target.skills[i]);
}
game.log(player,'<span style=\"color: red\">获得了</span>',target,'所有技能');
    },
                ai:{
                    threaten:2.1,
                },
            },
            hjxinxingxiang:{
                trigger:{
                    global:"judgeBegin",
                },
                frequent:true,
                filter:function (){
        return ui.cardPile.childNodes.length>1;
    },
                check:function (){
        return false;
    },
                content:function (){
        'step 0'
        var str='';
        if(trigger.card) str=get.translation(trigger.card.viewAs||trigger.card.name);
        else if(trigger.skill) str=get.translation(trigger.skill);
        else str=get.translation(trigger.parent.name);

        var cards=[ui.cardPile.childNodes[0],ui.cardPile.childNodes[1]];
        var att=get.attitude(player,trigger.player);
        var delta=trigger.judge(ui.cardPile.childNodes[1])-trigger.judge(ui.cardPile.childNodes[0]);
        player.chooseControl('调换顺序','cancel2',
        ui.create.dialog('星象：'+get.translation(trigger.player)+'的'+str+'判定',cards,'hidden')).ai=function(){
            if(att*delta>0) return '调换顺序';
            else return 'cancel2';
        };
        'step 1'
        if(result.control=='调换顺序'){
            var card=ui.cardPile.firstChild;
            ui.cardPile.removeChild(card);
            ui.cardPile.insertBefore(card,ui.cardPile.firstChild.nextSibling);
            game.log(player,'调换了牌堆顶两张牌的顺序');
        }
    },
                ai:{
                    expose:0.1,
                    tag:{
                        rejudge:0.5,
                    },
                },
            },
            "hjxinjiang_heise":{
                mod:{
                    cardUsable:function (card,player,num){ 
            if(card.name=='jiu') return Infinity; 
        },
                },
                audio:"ext:风云浮生明辉月/members/辉烬卧床包:2",
                audioname:["re_dongzhuo"],
                enable:"chooseToUse",
                filterCard:function (card){
        return get.color(card)=='black';
        
    },
                position:"he",
                viewAs:{
                    name:"jiu",
                },
                viewAsFilter:function (player){
        if(!player.countCards('he',{color:'black'})) return false;
    },
                prompt:"将一张黑色牌当酒使用",
                check:function (card){
        if(_status.event.type=='dying') return 1;
        return 4-get.value(card);
    },
                ai:{
                    skillTagFilter:function (player){
            return player.countCards('he',{color:'black'})>0&&player.hp<=0;
        },
                    threaten:1.5,
                    save:true,
                    basic:{
                        useful:function (card,i){
                if(_status.event.player.hp>1){
                    if(i==0) return 4;
                    return 1;
                }
                if(i==0) return 7.3;
                return 3;
            },
                        value:function (card,player,i){
                if(player.hp>1){
                    if(i==0) return 5;
                    return 1;
                }
                if(i==0) return 7.3;
                return 3;
            },
                    },
                    order:function (){
            return get.order({name:'sha'})+0.2;
        },
                    result:{
                        target:function (player,target){
                if(target&&target.isDying()) return 2;
                if(target&&!target.isPhaseUsing()) return 0;
                if(lib.config.mode=='stone'&&!player.isMin()){
                    if(player.getActCount()+1>=player.actcount) return 0;
                }
                var shas=player.getCards('h','sha');
                if(shas.length>1&&player.getCardUsable('sha')>1){
                    return 0;
                }
                var card;
                if(shas.length){
                    for(var i=0;i<shas.length;i++){
                        if(lib.filter.filterCard(shas[i],target)){
                            card=shas[i];break;
                        }
                    }
                }
                else if(player.hasSha()&&player.needsToDiscard()){
                    if(player.countCards('h','hufu')!=1){
                        card={name:'sha'};
                    }
                }
                if(card){
                    if(game.hasPlayer(function(current){
                        return (get.attitude(target,current)<0&&
                            target.canUse(card,current,true,true)&&
                            !current.getEquip('baiyin')&&
                            get.effect(current,card,target)>0);
                    })){
                        return 1;
                    }
                }
                return 0;
            },
                    },
                    tag:{
                        save:1,
                    },
                },
            },
            "hjxinjiang_hongse":{
                audio:"ext:风云浮生明辉月/members/辉烬卧床包:2",
                audioname:["sp_lvmeng","re_sunben"],
                trigger:{
                    player:"useCardToPlayered",
                    target:"useCardToTargeted",
                },
                filter:function (event,player){
        if(get.color(event.card)!=='red') return false;
        return player==event.target||event.getParent().triggeredTargets3.length==1;
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
                        player:function (card,player,target){
                if(get.color(card)=='red') return [1,1];
            },
                    },
                },
            },
            hjxinjiang:{
                audio:"ext:风云浮生明辉月/members/辉烬卧床包:2",
                group:["hjxinjiang_heise","hjxinjiang_hongse"],
            },
            hjxinyinghun:{
                audio:"yinghun_sunce",
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                filter:function (event,player){
        return player.hp<player.maxHp;
    },
                direct:true,
                content:function (){
        "step 0"
        player.chooseTarget(get.prompt2('hjxinyinghun'),function(card,player,target){
            return player!=target;
        }).set('ai',function(target){
            var player=_status.event.player;
            if(player.maxHp-player.hp==1&&target.countCards('he')==0){
                return 0;
            }
            if(get.attitude(_status.event.player,target)>0){
                return 10+get.attitude(_status.event.player,target);
            }
            if(player.maxHp-player.hp==1){
                return -1;
            }
            return 1;
        });
        "step 1"
        if(result.bool){
            event.num=player.maxHp-player.hp;
            if(player.countCards('e')>=player.hp){
                event.num=player.maxHp;
            }
            player.logSkill('hjxinyinghun',result.targets);
            event.target=result.targets[0];
            if(event.num==1){
                event.directcontrol=true;
            }
            else{
                var str1='摸'+get.cnNumber(event.num,true)+'弃一';
                var str2='摸一弃'+get.cnNumber(event.num,true);
                player.chooseControl(str1,str2,function(event,player){
                    return _status.event.choice;
                }).set('choice',get.attitude(player,event.target)>0?str1:str2);
                event.str=str1;
            }
        }
        else{
            event.finish();
        }
        "step 2"
        if(event.directcontrol||result.control==event.str){
            event.target.draw(event.num);
            event.target.chooseToDiscard(true,'he');
        }
        else{
            event.target.draw();
            event.target.chooseToDiscard(event.num,true,'he');
        }
    },
                ai:{
                    threaten:function (player,target){
            if(target.hp==1||target.countCards('e')>=target.hp) return 2;
            if(target.hp==target.maxHp) return 0.5;
            if(target.hp==2) return 1.5;
            return 0.5;
        },
                    maixie:true,
                    effect:{
                        target:function (card,player,target){
                if(target.maxHp<=3) return;
                if(get.tag(card,'damage')){
                    if(target.hp==target.maxHp) return [0,1];
                }
                if(get.tag(card,'recover')&&player.hp>=player.maxHp-1) return [0,0];
            },
                    },
                },
            },
            hjxinyingzi:{
                audio:"reyingzi_sunce",
                trigger:{
                    player:"phaseDrawBegin2",
                },
                forced:true,
                content:function (){
        trigger.num++;
    },
                ai:{
                    threaten:1.5,
                },
                mod:{
                    maxHandcard:function (player,num){
            if(player.hp<player.maxHp) return num+player.getDamagedHp();
        },
                },
            },
            hjxinhunzi:{
                inherit:"hunzi",
                filter:function (event,player){
        return player.hp<=2&&!player.storage.rehunzi;
    },
                ai:{
                    threaten:function (player,target){
            if(target.hp<=2) return 2;
            return 0.5;
        },
                    maixie:true,
                    effect:{
                        target:function (card,player,target){
                if(!target.hasFriend()) return;
                if(get.tag(card,'damage')==1&&target.hp==3&&!target.isTurnedOver()&&
                _status.currentPhase!=target&&get.distance(_status.currentPhase,target,'absolute')<=3) return [0.5,1];
            },
                    },
                },
                skillAnimation:true,
                animationColor:"wood",
                audio:"ext:风云浮生明辉月/members/辉烬卧床包:2",
                juexingji:true,
                derivation:["reyingzi","gzyinghun"],
                unique:true,
                trigger:{
                    player:"phaseZhunbeiBegin",
                },
                forced:true,
                content:function (){
        player.loseMaxHp();
        player.addSkill('hjxinyingzi');
        player.addSkill('hjxinyinghun');
        game.log(player,'获得了技能','#g【英姿】和【英魂】')
        player.awakenSkill(event.name);
        player.storage[event.name]=true;
    },
            },
        },
        translate:{
            hjbaiji:"百计",
            "hjbaiji_info":"出牌阶段限一次，你可以将一张手牌当作任意一张非延时锦囊牌使用。",
            hjxinlongdan:"龙胆",
            "hjxinlongdan_info":"你可以将基本牌互相转化然后使用或打出",
            "hjxinlongdan_sha":"龙胆",
            "hjxinlongdan_sha_info":"将一张基本牌当【杀】使用",
            "hjxinlongdan_shan":"龙胆",
            "hjxinlongdan_shan_info":"将一张基本牌当【闪】使用",
            hjxinqimen:"奇门",
            "hjxinqimen_info":"你的摸牌可以改为展示牌堆顶的牌，直到展示出第二张基本牌为止，然后你获得所有展示出来的牌",
            "hjxindunjia_gong":"遁甲",
            "hjxindunjia_gong_info":"你可以将你的红色牌当作【火攻】使用。",
            "hjxindunjia_shou":"遁甲",
            "hjxindunjia_shou_info":"你可以将你的黑色牌当作【无懈可击】使用。",
            hjxindunjia:"遁甲",
            "hjxindunjia_info":"你可以将你的红色牌当作【火攻】使用<br>你可以将你的黑色牌当作【无懈可击】使用。",
            "hjxinzhentu_shan":"阵图",
            "hjxinzhentu_shan_info":"你可以展示一张闪，视为使用或打出了此闪",
            "hjxinzhentu_sha":"阵图",
            "hjxinzhentu_sha_info":"你可以展示一张杀，视为使用或打出了此杀",
            hjxinzhentu:"阵图",
            "hjxinzhentu_info":"每当你因响应而需要使用或打出一张杀/闪时，你可以展示一张杀/闪，视为使用或打出了此杀/闪",
            hjxinyijue:"义绝",
            "hjxinyijue_info":"出牌阶段限一次，你可以弃置一张牌并令一名有手牌的其他角色展示一张手牌。若此牌为黑色，则该角色不能使用或打出牌，技能失效且受到来自你的【杀】的伤害+1直到回合结束。若此牌为红色，则你可以获得此牌，并可以令其回复一点体力。",
            "hjxinyijue2":"义绝",
            "hjxinyijue2_info":"",
            hjxinwusheng:"武圣",
            "hjxinwusheng_info":"你可以将一张牌当做【杀】使用或打出。你使用的方片杀没有距离限制。",
            hjxinpaoxiao:"咆哮",
            "hjxinpaoxiao_info":"出牌阶段，你使用【杀】没有数量限制且无视防具。若你于此出牌阶段内使用过【杀】，则你本回合内使用【杀】没有距离限制。若【杀】被闪避，则摸一张牌",
            hjxinpojun:"破军",
            "hjxinpojun_info":"你可以将两张牌当作杀使用，此杀需要额外一张闪才能闪避",
            "hjxinpojun2":"破军",
            "hjxinpojun2_info":"",
            hjxinyajiao:"涯角",
            "hjxinyajiao_info":"每当你使用或打出牌时，你可以亮出牌堆顶的一张牌，并将其交给一名角色。若此牌与你此次使用或打出的牌类别不同，则你弃置一张牌。",
            hjxinzhanji:"展骥",
            "hjxinzhanji_info":"你使用非延时锦囊或基本牌指定目标后，你可以令1名不为此牌目标的角色成为此牌额外目标。",
            "hjxinlianhuan_tiesuo":"连环",
            "hjxinlianhuan_tiesuo_info":"将一张黑色手牌当铁锁连环使用",
            "hjxinlianhuan_mubiao":"连环",
            "hjxinlianhuan_mubiao_info":"",
            "hjxinlianhuan_chongzhu":"连铸",
            "hjxinlianhuan_chongzhu_info":"",
            hjxinlianhuan:"连环",
            "hjxinlianhuan_info":" 你可以将一张黑色手牌当【铁索连环】使用或重铸。你使用的【铁索连环】可以指定至多3个目标。",
            "hjxinniepan_yuhuo":"涅槃",
            "hjxinniepan_yuhuo_info":"锁定技，你受到火焰伤害后，回复等量的体力值。",
            "hjxinniepan_chongsheng":"涅槃",
            "hjxinniepan_chongsheng_info":"限定技，出牌阶段或当你处于濒死状态时，你可以弃置你区域内的所有牌并复原你的武将牌，然后摸三张牌并将体力回复至上限。",
            hjxinniepan:"涅槃",
            "hjxinniepan_info":"①浴火<br>锁定技，你受到火焰伤害后，回复等量的体力值。<br>②重生<br>限定技，出牌阶段或当你处于濒死状态时，你可以弃置你区域内的所有牌并复原你的武将牌，然后摸三张牌并将体力回复至上限。",
            hjxinxinqimen:"奇门",
            "hjxinxinqimen_info":"锁定技<br>当你成为牌的目标后<br>你随机获得牌堆里一张你没有的基本牌(杀闪酒桃之一)",
            hjxinrangxing:"禳星",
            "hjxinrangxing_info":"1名角色进入濒死状态时，你可以进行判定，若结果不为黑桃，其将体力值回复至1点，否则其摸1张牌。",
            hjxinrenxia:"任侠",
            "hjxinrenxia_info":"出牌阶段限一次，你可以弃置一张牌并指定一名其他角色 你视为对其使用了一张不计入出杀次数的【杀】 <br>若其响应则你摸一张牌 否则你获得其一张牌。",
            hjxincongwen:"从文",
            "hjxincongwen_info":"觉醒技，当你造成一次伤害后，你获得技能【无言】【策略】。",
            hjxinwuyan:"无言",
            "hjxinwuyan_info":"锁定技，当你使用锦囊牌造成伤害时，你防止此伤害；锁定技，当你受到锦囊牌对你造成的伤害时，你防止此伤害。",
            hjxincelue:"策略",
            "hjxincelue_info":"出牌阶段限1次，你可以令1名手牌数不等于你的其他角色将手牌调整至与你相同。",
            "hjxinzhanshen_sha":"战神",
            "hjxinzhanshen_sha_info":"你可以将一张黑色牌当做【杀】使用或打出。",
            "hjxinzhanshen_xiangying":"战神",
            "hjxinzhanshen_xiangying_info":"你的梅花【杀】不能被响应；你的黑桃【杀】伤害＋1。",
            hjxinzhanshen:"战神",
            "hjxinzhanshen_info":"你可以将一张黑色牌当做【杀】使用或打出<br>你的梅花【杀】不能被响应；你的黑桃【杀】伤害＋1。",
            hjxintianming:"天命",
            "hjxintianming_info":"当你需要使用或打出一张牌时，你可以观看牌堆顶的X张牌并使用打出之。<br>任意一名角色进行判定前，你可以观看牌堆顶的X张牌，并选择一张作为判定结果，此结果不可被更改，也不能触发技能<br>（X为场上存活角色数且至少为三）",
            "hjxintianming_shiyong":"天命",
            "hjxintianming_shiyong_info":"当你需要使用或打出一张牌时，你可以观看牌堆顶的七张牌并使用打出之。",
            "hjxintianming_panding":"天命",
            "hjxintianming_panding_info":"任意一名角色进行判定前，你观看牌堆顶的7张牌，并选择一张作为判定结果，此结果不可被更改，也不能触发技能",
            hjxintianlang:"天狼",
            "hjxintianlang_info":"当你杀死一名角色，你可以获得其所有技能",
            hjxinxingxiang:"星象",
            "hjxinxingxiang_info":"任意一名角色进行判定前，你可以观看牌堆顶的两张牌，并可以将其调换顺序",
            "hjxinjiang_heise":"激昂",
            "hjxinjiang_heise_info":"你可以将一张黑色牌当作【酒】使用，你使用【酒】无次数限制",
            "hjxinjiang_hongse":"激昂",
            "hjxinjiang_hongse_info":"每当你使用或被使用红色牌时，你可以摸一张牌。",
            hjxinjiang:"激昂",
            "hjxinjiang_info":"每当你使用或被使用红色牌时，你可以摸一张牌。<br>你可以将一张黑色牌当作【酒】使用，你使用【酒】无次数限制",
            hjxinyinghun:"英魂",
            "hjxinyinghun_info":"准备阶段开始时，若你已受伤，你可令一名其他角色执行一项：摸X张牌，然后弃置一张牌；或摸一张牌，然后弃置X张牌（X为你已损失的体力值，若你装备区里牌的数量不小于你的体力值，则X改为你的体力上限）",
            hjxinyingzi:"英姿",
            "hjxinyingzi_info":"锁定技，摸牌阶段摸牌时，你额外摸一张牌；你的手牌上限不会因体力值的减少而减少。",
            hjxinhunzi:"魂姿",
            "hjxinhunzi_info":"觉醒技，准备阶段，若你的体力值不大于2，你减1点体力上限，并获得技能〖英姿〗和〖英魂〗。",
        },
    },
    intro:"",
    author:"无名玩家",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["Ahjhwsc.jpg"],"card":[],"skill":[]}}};
