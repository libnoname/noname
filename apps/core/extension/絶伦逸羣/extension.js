import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"絶伦逸羣",content:function(config,pack){
    
},precontent:function(){
			 
},help:{},config:{},package:{
    character:{
        character:{
            "jvelun_苦肉计_黄盖":["male","wu","4/4",["jvelun_huanggai_kurou","jvelun_huanggai_zhaxiang"],[]],
            "jvelun_如饮醇醪_程普":["male","wu","4/4",["jvelun_chengpu_lihuo","jvelun_chengpu_chunlao"],[]],
            "jvelun_倾吴解忧_韩当":["male","wu","4/4",["jvelun_handang_gongqi","jvelun_handang_jiefan"],[]],
            "jvelun_轻赐尚义_蒋钦":["male","wu","4/4",["jvelun_jiangqing_niaoxiang","jvelun_jiangqing_shangyi"],[]],
            "jvelun_死战不屈_周泰":["male","wu","4/4",["jvelunhuzhu1","jvelun_zhoutai_buqu"],[]],
            "jvelun_勇战仁厚_陈武":["male","wu","4/4",["jvelun_chenwu_yongzhan","jvelun_chenwu_renhou"],[]],
            "jvelun_奋命断缆_董袭":["male","wu","4/4",["jvelun_dongxi_fenming","jvelun_dongxi_duanlan"],[]],
            "jvelun_百骑劫营_甘宁":["male","wu","4/4",["jvelun_ganning_qixi","jvelun_ganning_fenwei"],[]],
            "jvelun_旋略勇进_凌统":["male","wu","4/4",["jvelun_lingtong_xvanfeng","jvelun_lingtong_yongjin"],[]],
            "jvelun_疑城破魏_徐盛":["male","wu","4/4",["jvelun_xvsheng_pojvn","jvelun_xvsheng_yicheng"],[]],
        },
        translate:{
            "jvelun_苦肉计_黄盖":"黄盖",
            "jvelun_如饮醇醪_程普":"程普",
            "jvelun_倾吴解忧_韩当":"韩当",
            "jvelun_轻赐尚义_蒋钦":"蒋钦",
            "jvelun_死战不屈_周泰":"周泰",
            "jvelun_勇战仁厚_陈武":"陈武",
            "jvelun_奋命断缆_董袭":"董袭",
            "jvelun_百骑劫营_甘宁":"甘宁",
            "jvelun_旋略勇进_凌统":"凌统",
            "jvelun_疑城破魏_徐盛":"徐盛",
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
            "jvelun_liubei_jvxin":{
                audio:"ext:絶伦逸羣:2",
                trigger:{
                    player:"loseEnd",
                },
                init:function (player){
        player.storage.聚心=0;
    },
                filter:function (event,player){
        return player.storage.聚心<=2;
    },
                content:function (){
        'step 0'
        player.chooseTarget(function(card,player,target){
            return target!=player;
        }).set('ai',function(target){
            return get.attitude(player,target);
        });
        'step 1'
        if(result.bool){
            result.targets[0].draw();
             player.storage.聚心+=1;
        if(player.storage.聚心){
            player.markSkill('聚心');
        }
        game.addVideo('storage',player,['聚心',player.storage.聚心]);
        }
    },
                intro:{
                    content:"mark",
                },
                group:"聚心_a",
                subSkill:{
                    a:{
                        trigger:{
                            global:"phaseEnd",
                        },
                        forced:true,
                        filter:function (event,player){
        return player.storage.聚心>=1;
    },
                        content:function (){
                player.storage.聚心=0;
                player.update();
            },
                        sub:true,
                    },
                },
            },
            "jvelun_huanggai_kurou":{
                mark:true,
                intro:{
                    content:function (storage,player){
            var str='';
            if(!player.hasSkill('jvelun_huanggai_kurou_basic')&&!player.hasSkill('jvelun_huanggai_kurou_trick')&&!player.hasSkill('jvelun_huanggai_kurou_equip')){
                str+='暂无任何效果';
            }
            if(player.hasSkill('jvelun_huanggai_kurou_basic')){
                str+='<li>使用牌无次数限制';
            }
            if(player.hasSkill('jvelun_huanggai_kurou_trick')&&player.hasSkill('jvelun_huanggai_kurou_basic')){
                str+='<br><li>使用牌无距离限制';
            }
            if(player.hasSkill('jvelun_huanggai_kurou_equip')&&player.hasSkill('jvelun_huanggai_kurou_basic')){
            str+='<br><li>使用牌不可被响应';
            }
                 if(player.hasSkill('jvelun_huanggai_kurou_trick')&&!player.hasSkill('jvelun_huanggai_kurou_basic')){
                str+='<li>使用牌无距离限制';
            }
            if(player.hasSkill('jvelun_huanggai_kurou_equip')&&!player.hasSkill('jvelun_huanggai_kurou_basic')){
            str+='<li>使用牌不可被响应';
            }    
            return str;
        },
                },
                group:["jvelun_huanggai_kurou_clear","jvelun_huanggai_kurou_lose"],
                audio:"ext:絶伦逸羣:2",
                enable:"phaseUse",
                position:"he",
                filterCard:function (card,player){
        if(player.storage.jvelun_huanggai_kurou_type&&
            player.storage.jvelun_huanggai_kurou_type.contains(get.type2(card))){
            return false;
        }
        return true;
    },
                subSkill:{
                    clear:{
                        trigger:{
                            player:"phaseAfter",
                        },
                        silent:true,
                        content:function (){
   
                delete player.storage.jvelun_huanggai_kurou_type;
            },
                        sub:true,
                        forced:true,
                        popup:false,
                    },
                },
                check:function (card){
        var player=_status.event.player;
        var type=get.type(card,'trick');   
        if(type=='basic'){
                       if(player.getEquip('zhuge')) return 0;
               if(player.countCards('h',{name:'sha'})>=3){  
            return get.name(card)=='shan'||get.name(card)=='tao';
        }
        }
        else if(type=='equip'){
            if(player.countCards('h',{name:'sha'})>=3){
                return 6-get.value(card);
            }
        }  
    },
                content:function (){
        'step 0'
     if(!player.storage.jvelun_huanggai_kurou_type){
            player.storage.jvelun_huanggai_kurou_type=[];
player.loseHp();

     };

      
        player.storage.jvelun_huanggai_kurou_type.push(get.type2(cards[0]));
        'step 1'
        switch(get.type(cards[0],'trick')){
            case 'basic':player.addTempSkill('jvelun_huanggai_kurou_basic');player.addMark('jvelun_huanggai_kurou_lose');break;
            case 'equip':
           player.addTempSkill('jvelun_huanggai_kurou_equip');
                player.addMark('jvelun_huanggai_kurou_lose');break;
            case 'trick':
    player.addTempSkill('jvelun_huanggai_kurou_trick');
             player.addMark('jvelun_huanggai_kurou_lose');break;
        }
    },
                ai:{
                    order:9.1,
                    result:{
                        player:1,
                    },
                },
            },
            "jvelun_huanggai_kurou_trick":{
                mod:{
                    targetInRange:function (card,player){
           return true;
        },
                },
            },
            "jvelun_huanggai_kurou_basic":{
                mod:{
                    cardUsable:function (card,player,num){
            return Infinity;
        },
                },
            },
            "jvelun_huanggai_kurou_equip":{
                trigger:{
                    player:"useCard",
                },
                forced:true,
                content:function (){
                       trigger.directHit.addArray(game.filterPlayer(function(current){
            return true;
        }));   
    },
            },
            "jvelun_huanggai_kurou_lose":{
                marktext:"伤",
                intro:{
                    content:"结束阶段，失去#点体力",
                },
                trigger:{
                    player:"phaseJieshuBegin",
                },
                forced:true,
                filter:function (event,player){
        return player.countMark('jvelun_huanggai_kurou_lose')>0;
    },
                content:function (){
        'step 0'
       
        player.loseHp(player.countMark('jvelun_huanggai_kurou_lose'));

        'step 1'
        player.removeMark('jvelun_huanggai_kurou_lose',player.countMark('jvelun_huanggai_kurou_lose'));
    },
            },
            "jvelun_huanggai_zhaxiang":{
                trigger:{
                    player:"loseHpEnd",
                },
                forced:true,
                audio:"ext:絶伦逸羣:2",
                content:function(){
        var num=trigger.num;
        player.draw(2*num+num);
        
    },
                ai:{
                    maihp:true,
                },
            },
            "jvelun_chengpu_lihuo":{
                audio:"ext:絶伦逸羣:2",
                trigger:{
                    source:"damageBegin1",
                },
                check:function (event,player){
        var att=get.attitude(player,event.player);
        var num=event.num+1;
        var hc=player.countCards('h')-event.player.countCards('h');
        if(att<0&&num>=event.player.hp) return true;
        if(att<0&&hc<0) return true;
        return false;
    },
                filter:function (event,player){
        return event.card&&event.card.name=='sha'&&event.parent.name!='_lianhuan'&&event.parent.name!='_lianhuan2';
    },
                content:function (){
        trigger.num++;
        var h=player.countCards('h')-trigger.player.countCards('h');
        if(h>0){
           player.chooseToDiscard(true,'he',h);
            player.loseHp();
        }
    },
                ai:{
                    unequip:true,
                    skillTagFilter:function (player,tag,arg){
            if(arg&&arg.name=='sha') return true;
            return false;
        },
                },
            },
            "jvelun_chengpu_chunlao":{
                audio:"ext:絶伦逸羣:2",
                enable:"phaseUse",
                usable:1,
                filterTarget:function (card,player,target){
        return player.countCards('h')!=target.countCards('h');
    },
                content:function (){
        
          "step 0"
     player.chooseUseTarget({name:'jiu'},get.prompt('jvelun_chengpu_chunlao'),'视为使用一张【酒】',false).logSkill='jvelun_chengpu_chunlao';
        
      player.chooseControl('调整自己','调整目标').set('ai',function(event){
            if(player.countCards('h')>2) return '调整目标';
            return '调整自己';
        });
        "step 1"
        if(result.control=='调整目标'){
            
            var num=player.countCards('h')-target.countCards('h');
        if(num>0){
      
            
            target.draw(num);
           
        }
        else if(num<0){
            
            target.chooseToDiscard(-num,true);
            
        }
        
        
         }
           "step 2"        
        if(result.control=='调整自己') {
            
            var num=target.countCards('h')-player.countCards('h');
        if(num>0){
         
            player.draw(num);
        }
        else if(num<0){
            
            player.chooseToDiscard(-num,true);
       
            
        }
            
        
         }
   
         
    },
                ai:{
                    threaten:1.8,
                    order:function (name,player){
            var max=true,num=0;
            var players=game.filterPlayer();
            for(var i=0;i<players.length;i++){
                if(players[i]==player) continue;
                var att=get.attitude(player,players[i]);
                var dh=player.countCards('h')-players[i].countCards('h');
                if(att*dh>num){
                    if(att>0){
                        max=true;
                    }
                    else if(att<0){
                        max=false;
                    }
                    num=att*dh;
                }
            }
            if(max) return 10;
            return 0.5;
        },
                    result:{
                        player:function (player,target){
                return (player.countCards('h')-target.countCards('h'))*get.attitude(player,target);
            },
                    },
                    expose:0.2,
                },
            },
            "jvelun_huanggai_handang_gongqi_2":{
                mod:{
                    attackFrom:function (){
            return -Infinity;
        },
                    targetInRange:function (card,player,target,now){
        if(card.name=='sha') return true;
        },
                },
                trigger:{
                    player:"shaBegin",
                },
                forced:true,
                filter:function (event,player){
        return event.card;
    },
                content:function (){
        trigger.directHit=true;
    },
            },
            "jvelun_jiangqing_shangyi":{
                audio:"ext:絶伦逸羣:2",
                enable:"phaseUse",
                usable:1,
                filterTarget:function (card,player,target){
        return player!=target&&target.countCards('h');
    },
                filter:function (event,player){    
        return player.isAlive();
    },
                content:function (){
        "step 0"
       // target.gain(cards,player);         
        event.cards=target.getCards('h');
        "step 1"
         player.chooseCardButton(event.cards,1,'选择使用'+get.translation(target)+'的一张手牌').set('filterButton',function(button){           
             return game.hasPlayer(function(current){
                 return player.canUse(button.link,current);
             });
         }).set('ai',function(button){
             return get.value(button.link);
         });
       "step 2"
        if(result.bool){
           // target.lose(result.links[0]);       
            target.$give(result.links[0],player);
            player.chooseUseTarget(result.links[0],true);            
        }       
        else event.finish();
    },
                ai:{
                    result:{
                        target:function (player,target){
             // if(target.countCards('h')&lt;3) return 1;   
                return -target.countCards('h');
            },
                    },
                    order:8,
                    threaten:0.5,
                },
            },
            "jvelun_jiangqing_niaoxiang":{
                audio:"ext:絶伦逸羣:2",
                trigger:{
                    player:"shaBegin",
                },
                forced:true,
                filter:function(event,player){
        return event.target.hp>=2;
    },
                content:function(){
        player.logSkill('jvelun_jiangqing_niaoxiang');
        trigger.directHit=true;
    },
                mod:{
                    targetInRange:function(card){
            if(card.name=='sha') return true;
        },
                },
            },
            "jvelunhuzhu1":{
                audio:"ext:絶伦逸羣:2",
                group:["jvelunhuzhu1_effect1","jvelunhuzhu1_effect2"],
                subSkill:{
                    "effect1":{
                        trigger:{
                            global:"damageBegin",
                        },
                        priority:15,
                        filter:function(event,player){
                return event.player!=player&&player.countCards('h',{type:"basic"});
            },
                        direct:true,
                        content:function(){
                "step 0"
                player.chooseToDiscard("是否对"+get.translation(trigger.player)+"发动护主?<p>弃置一张基本牌,将伤害转移给你</p>",{type:"basic"}).ai=function(card){
                    if(get.damageEffect(trigger.player,trigger.source,player)<0){
                        if(player.hp>trigger.player.hp)return 8 - get.value(card);
                        return 0;
                    }
                    return 0;
                };
                "step 1"
                if(result.bool){
                    player.logSkill("jvelunhuzhu1",trigger.player);
                    trigger.player = player;
                }
                else {
                    event.finish();
                }
            },
                        sub:true,
                    },
                    "effect2":{
                        trigger:{
                            player:"damageEnd",
                        },
                        filter:function(event,player){
                return player.isDamaged();
            },
                        content:function(){
                player.draw(1);
            },
                        ai:{
                            effect:{
                                target:function(card,player,target){
                        if(get.tag(card,'damage')){
                            var num = player.maxHp - player.hp + 1;
                            if(player.hasSkillTag('jueqing',false,target)) return [1,-num];
                            if(!target.hasFriend()) return;
                            if(target.hp<=get.tag(card,'damage'))return;
                            return [1,num];
                        }
                    },
                            },
                        },
                        sub:true,
                    },
                },
                ai:{
                    cardValue:function(card){
            if(get.type(card)=='basic'){
                return 3;
            }
            return 0;
        },
                },
            },
            "jvelunchenwuyongzhan1":{
                group:["jvelunchenwuyongzhan1_gainMaxHp","jvelunchenwuyongzhan1_changeHp"],
                subSkill:{
                    gainMaxHp:{
                        trigger:{
                            global:"gameStart",
                        },
                        forced:true,
                        content:function(){
                player.maxHp=8;
                player.hp=4;
                player.update();
            },
                        sub:true,
                    },
                    changeHp:{
                        trigger:{
                            player:"phaseEnd",
                        },
                        forced:true,
                        priority:null,
                        filter:function(event,player){
                return player.maxHp>player.hp;
            },
                        content:function(){
                player.hp=player.maxHp-player.hp;
                player.update();
            },
                        sub:true,
                    },
                },
            },
            "jvelun_zhoutai_buqu":{
                audio:"ext:絶伦逸羣:2",
                trigger:{
                    player:"chooseToUseBefore",
                },
                forced:true,
                filter:function(event,player){return event.type=='dying'&&player.isDying()&&event.dying==player},
                content:function(){
        "step 0"
        event.card=get.cards()[0];
        if(player.storage.jvelun_zhoutai_buqu==undefined) player.storage.jvelun_zhoutai_buqu=[];
        player.storage.jvelun_zhoutai_buqu.push(event.card);
        player.syncStorage('jvelun_zhoutai_buqu');
        //event.trigger("addCardToStorage");
        game.cardsGotoSpecial(event.card);
        player.showCards(player.storage.jvelun_zhoutai_buqu,'不屈')
        player.markSkill('jvelun_zhoutai_buqu');
        "step 1"
        for(var i=0;i<player.storage.jvelun_zhoutai_buqu.length-1;i++){
            if(get.number(event.card)&&get.number(event.card)==get.number(player.storage.jvelun_zhoutai_buqu[i])){
                player.storage.jvelun_zhoutai_buqu.remove(event.card);
                player.syncStorage('jvelun_zhoutai_buqu');
                player.markSkill('jvelun_zhoutai_buqu');
                game.cardsDiscard(event.card);
                return;
            };
        }
        trigger.cancel();
        trigger.result={bool:true};
        if(player.hp<=0){
            for(var i=0;i<player.storage.jvelun_zhoutai_buqu.length-1;i++){
            if(get.number(event.card)&&get.number(event.card)==get.number(player.storage.jvelun_zhoutai_buqu[i])&&get.suit(event.card)&&get.suit(event.card)==get.suit(player.storage.jvelun_zhoutai_buqu[i])) return;
        }
            player.hp=2;
            player.update();
        }
    },
                mod:{
                    maxHandcardBase:function(player,num){
            var num=player.hp
            if(get.mode()!='guozhan'&&player.storage.jvelun_zhoutai_buqu&&player.storage.jvelun_zhoutai_buqu.length) return player.storage.jvelun_zhoutai_buqu.length+num;
        },
                },
                ai:{
                    save:true,
                    mingzhi:true,
                    skillTagFilter:function(player){
            if(player.hp>0) return false;
        },
                },
                intro:{
                    content:"cards",
                    onunmark:function(storage,player){
            if(storage&&storage.length){
                player.$throw(storage,1000);
                game.cardsDiscard(storage);
                delete player.storage.jvelun_zhoutai_buqu;
            }
        },
                },
            },
            "jvelun_chenwu_yongzhan":{
                audio:"ext:絶伦逸羣:2",
                trigger:{
                    player:"phaseUseBegin",
                },
                filter:function (event,player){
          return game.hasPlayer(function(current){
                return get.distance(player,current,'attack')<=1;
            });
      },
                content:function (){
           'step 0' 
        player.chooseTarget(get.prompt2('jvelun_chenwu_yongzhan'),1,function(card,player,target){
            return target!=player&&get.distance(player,target,'attack')<=1;
        },function(target){
            return -get.attitude(player,target);
        });        
           'step 1' 
        if(result.bool){   
            player.logSkill('jvelun_chenwu_yongzhan');                           
            event.target=result.targets[0];
            if(player.hp<=event.target.hp){
              player.useCard({name:'sha'},event.target,false);
            }
            if(player.countCards('h')<=event.target.countCards('h')){
              player.useCard({name:'sha'},event.target,false);
            }
            if(player.getAttackRange()<=event.target.getAttackRange()){
              player.useCard({name:'sha'},event.target,false);
            }
        }
        else{
            event.finish();
        }
        'step 2' 
        player.addTempSkill('jvelun_chenwu_yongzhan2');
        player.chooseToDiscard('h',Math.max(1,player.hp),true);
    },
            },
            "jvelun_chenwu_yongzhan2":{
                mod:{
                    cardEnabled:function(card){
            if(card.name=='sha'||get.type(card)=='trick') return false
        },
                },
            },
            "jvelun_chenwu_renhou":{
                audio:"ext:絶伦逸羣:2",
                trigger:{
                    source:"damageSource",
                },
                direct:true,
                filter:function (event,player){
        if(event._notrigger.contains(event.player))return false;
        if(!event.card||event.card.name!='sha')return false;
        return game.hasPlayer(function(current){
            return current.isDamaged()&&current.isMinHp();
        });
    },
                content:function (){
        "step 0"
        player.chooseTarget(get.prompt2("jvelun_chenwu_renhou"),function(card,player,target){
            return target.isDamaged()&&target.isMinHp();
        }).set("ai",function(target){
            var player=get.player();
            return get.attitude(player,target);
        });
        "step 1"
        if(result.bool){
            player.logSkill("jvelun_chenwu_renhou");
            result.targets[0].recover(player.maxHp);
        }
    },
            },
            "jvelun_dongxi_fenming":{
                audio:"ext:絶伦逸羣:2",
                forced:true,
                mod:{
                    globalTo:function (from,to,distance){
            return distance-from.storage.disableEquip.length
        },
                    globalFrom:function(from,to,distance){
            return distance-from.storage.disableEquip.length;
        },
                    maxHandcard:function(player,num){
            return num+=player.storage.disableEquip.length;
        },
                },
            },
            "jvelun_dongxi_duanlan":{
                audio:"ext:絶伦逸羣:2",
                enable:"phaseUse",
                direct:true,
                filter:function(event,player){
        if(player.storage.jvelun_dongxi_duanlanUse==0) return false;
        return player.storage.disableEquip.length<5;
    },
                init:function(player){
        player.storage.jvelun_dongxi_duanlan=false;
        player.storage.jvelun_dongxi_duanlanUse=1;
    },
                content:function(){
        'step 0'
        player.popup('断缆','wood');
        game.playA(['jvelun_dongxi_duanlan1','jvelun_dongxi_duanlan2'].randomGet());
        game.log(player,'发动了武将技能','#g【断缆】');
        player.storage.jvelun_dongxi_duanlanUse--;
        event.equip1=0;
        event.equip2=0;
        event.equip3=0;
        event.equip4=0;
        event.equip5=0;
        if(player.get('e','1')) event.equip1++;
        if(player.get('e','2')) event.equip2++;
        if(player.get('e','3')) event.equip3++;
        if(player.get('e','4')) event.equip4++;
        if(player.get('e','5')) event.equip5++;
        player.chooseToDisable().set('ai',function(event,player,list){
            if(player.isDamaged()&&list.contains('equip2')&&player.getEquip('baiyin')) return 'equip2';
            var num=game.countPlayer(function(current){
                return !current.isUnknown()&&get.attitude(player,current)>0;
            });
            if(num>0){
                if(list.contains('equip4')&&player.get('e','4')) return 'equip4';
                else if(list.contains('equip5')&&player.get('e','5')) return 'equip5';
                else if(list.contains('equip1')&&player.get('e','1')) return 'equip1';
                else if(list.contains('equip3')&&player.get('e','3')) return 'equip3';
                else if(list.contains('equip2')&&player.get('e','2')) return 'equip2';
            }
            else{
                if(list.contains('equip4')) return 'equip4';
                else if(list.contains('equip5')) return 'equip5';
                else if(list.contains('equip1')) return 'equip1';
                else if(list.contains('equip3')) return 'equip3';
                else if(list.contains('equip2')) return 'equip2';
            }
            return list.randomGet();
        });
        'step 1'
        player.draw(2);
        player.recover();
        if(result.control=='equip1'&&event.equip1>0) player.storage.jvelun_dongxi_duanlan=true;
        if(result.control=='equip2'&&event.equip2>0) player.storage.jvelun_dongxi_duanlan=true;
        if(result.control=='equip3'&&event.equip3>0) player.storage.jvelun_dongxi_duanlan=true;
        if(result.control=='equip4'&&event.equip4>0) player.storage.jvelun_dongxi_duanlan=true;
        if(result.control=='equip5'&&event.equip5>0) player.storage.jvelun_dongxi_duanlan=true;
        'step 2'
        if(!player.storage.jvelun_dongxi_duanlan){
            event.finish();
            return;
        }
        player.chooseTarget('是否令1名角色摸2张牌',function(card,player,target){
            return true;
        }).set('ai',function(target){
            return get.attitude(player,target);
        });
        'step 3'
        if(result.bool){
            var target=result.targets[0];
            player.line(target,'green');
            target.draw(2);
            target.recover();
            player.storage.jvelun_dongxi_duanlan=false;
        }
        else player.storage.jvelun_dongxi_duanlan=false;
    },
                group:["jvelun_dongxi_duanlan_use"],
                subSkill:{
                    use:{
                        popup:false,
                        forced:true,
                        trigger:{
                            player:"phaseUseBegin",
                        },
                        content:function(){
                player.storage.jvelun_dongxi_duanlanUse=1;
            },
                        sub:true,
                    },
                },
                ai:{
                    order:8,
                    result:{
                        player:function(player){
                if(player.isDamaged()&&!player.isDisabled(2)&&player.getEquip('baiyin')) return 10;
                if(player.hp<3) return 10;
                var num=game.countPlayer(function(current){
                    return !current.isUnknown()&&get.attitude(player,current)>0;
                });
                if(num>0){
                    if(!player.isDisabled(4)&&player.get('e','4')) return 9;
                    else if(!player.isDisabled(5)&&player.get('e','5')) return 8;
                    else if(!player.isDisabled(1)&&player.get('e','1')) return 7;
                    else if(!player.isDisabled(3)&&player.get('e','3')) return 6;
                    else if(!player.isDisabled(2)&&player.get('e','2')) return 5;
                }
                else{
                    if(!player.isDisabled(4)) return 5;
                    else if(!player.isDisabled(5)) return 4;
                    else if(!player.isDisabled(1)) return 3;
                    else if(!player.isDisabled(3)) return 0;
                    else if(!player.isDisabled(2)) return 0;
                }
                return 0;
            },
                    },
                    effect:{
                        player:function(card,player){
                if(player.storage.jvelun_dongxi_duanlanUse>0&&get.type(card)=='equip') return [10,10];
            },
                    },
                },
            },
            "jvelun_ganning_qixi":{
                audio:"ext:絶伦逸羣:2",
                enable:"phaseUse",
                filter:function (event,player){
        return player.countCards('he')>0;
    },
                position:"he",
                filterCard:true,
                filterTarget:function (card,player,target){
        if(player==target) return false;
        if(target.countCards('hej')==0) return false;
        return lib.filter.targetEnabled({name:'guohe'},player,target);
    },
                check:function (card){
        return 5-get.value(card);
    },
                content:function (){
        'step 0'
        var next=player.useCard({name:'guohe'},target,cards);
        next.animate=false;
        next.audio=false;
        'step 1'
        if(get.color(cards)=='black') player.draw();
    },
                ai:{
                    basic:{
                        order:9,
                        useful:1,
                        value:5,
                    },
                    result:{
                        target:function (player,target){
                var att=get.attitude(player,target);
                var nh=target.countCards('h');
                if(att>0){
                    var js=target.getCards('j');
                    if(js.length){
                        var jj=js[0].viewAs?{name:js[0].viewAs}:js[0];
                        if(jj.name=='guohe'||js.length>1||get.effect(target,jj,target,player)<0){
                            return 3;
                        }
                    }
                    if(target.getEquip('baiyin')&&target.isDamaged()&&
                        get.recoverEffect(target,player,player)>0){
                        if(target.hp==1&&!target.hujia) return 1.6;
                        if(target.hp==2) return 0.01;
                        return 0;
                    }
                }
                var es=target.getCards('e');
                var noe=(es.length==0||target.hasSkillTag('noe'));
                var noe2=(es.length==1&&es[0].name=='baiyin'&&target.isDamaged());
                var noh=(nh==0||target.hasSkillTag('noh'));
                if(noh&&(noe||noe2)) return 0;
                if(att<=0&&!target.countCards('he')) return 1.5;
                return -1.5;
            },
                    },
                    tag:{
                        loseCard:1,
                        discard:1,
                    },
                },
            },
            "jvelun_ganning_fenwei":{
                audio:"ext:絶伦逸羣:2",
                trigger:{
                    global:"useCard",
                },
                filter:function (event,player){
        if(get.type(event.card)!='trick') return false;
        if(get.info(event.card).multitarget) return false;
        if(event.targets.length<2) return false;     
      return game.hasPlayer(function(current){
            return current.maxHp>current.hp;
        });
        return true;
    },
                direct:true,
                skillAnimation:true,
                content:function (){
        "step 0"
        
        player.chooseTarget(get.prompt('jvelun_ganning_fenwei'),
           [1,trigger.targets.length],function(card,player,target){
            return _status.event.getTrigger().targets.contains(target)&&target.maxHp>target.hp;
        }).set('ai',function(target){
            var trigger=_status.event.getTrigger();
            if(game.phaseNumber>game.players.length*2&&trigger.targets.length>=game.players.length-1){
                return -get.effect(target,trigger.card,trigger.player,_status.event.player);
            }
            return -1;
        });
        "step 1"
        if(result.bool){
            
            player.logSkill('jvelun_ganning_fenwei',result.targets);
           
            for(var i=0;i<result.targets.length;i++){
                trigger.targets.remove(result.targets[i]);
            }
            game.delay();
        }
    },
            },
            "jvelun_handang_jiefan":{
                audio:"ext:絶伦逸羣:2",
                trigger:{
                    global:["useCard","respond"],
                },
                direct:true,
                usable:1,
                filter:function(event,player){
        return Array.isArray(event.respondTo)&&event.respondTo[0]!=event.player&&[event.respondTo[0],event.player].contains(player);
    },
                content:function(){
        'step 0'
        
        event.type=get.type(trigger.card)=='basic';
        var prompt=event.type?'令一名角色摸两张牌或弃置两张牌':'令一名角色回复2点体力或对其造成2点伤害';
        player.chooseTarget(get.prompt('kanade_benzhan'),prompt).set('ai',function(target){
            var player=_status.event.player;
            if(_status.event.getParent().type){
                var att=get.attitude(player,target);
                if(target.hasSkillTag('nogain')) return -att;
                if(target.countCards('he')==1&&att<0) att/=2;
                return Math.abs(att)*(1+0.1*(Math.min(0,5-target.countCards('h'))))
            }
            return Math.max(get.recoverEffect(target,player,player),get.damageEffect(target,player,player))
        });
        'step 1'
        if(result.bool){
            var target=result.targets[0];
            event.target=target;
            player.logSkill('jvelun_handang_jiefan',target,'thunder');
            var trans=get.translation(target);
            var list;
            if(event.type){
                if(!target.countCards('hej')) event._result={index:0};
                else list=['令'+trans+'摸两张牌','令'+trans+'弃置两张牌'];
            }
            else{
                if(target.isHealthy()) event._result={index:1};
                else list=['令'+trans+'回复2点体力','对'+trans+'造成2点伤害'];
            }
            player.chooseControl().set('choiceList',list).set('choice',function(){
                if(event.type) return (get.attitude(player,target)>0)?0:1;
                return (get.recoverEffect(target,player,player)>get.damageEffect(target,player,player))?0:1;
            }()).set('ai',function(){
                return _status.event.choice;
            });
        }
        else event.finish();
        'step 2'
        player.addExpose(0.2);
        if(event.type){
            if(result.index==0) target.draw(2);
            else target.chooseToDiscard(2,'hej',true);
        }
        else{
            if(result.index==0) target.recover(2);
            else target.damage(2);
        }
    },
            },
            "jvelun_handang_gongqi":{
                enable:"phaseUse",
                usable:1,
                audio:"ext:絶伦逸羣:2",
                position:"he",
                filterCard:true,
                check:function (card){
        if(get.type(card)!='equip') return 0;
        var player=_status.currentPhase;
        if(player.num('he',{subtype:get.subtype(card)})>1){
            return 11-ai.get.equipValue(card);
        }
        return 6-ai.get.equipValue(card);
    },
                content:function (){
        "step 0"
        player.addTempSkill('jvelun_huanggai_handang_gongqi_2','phaseAfter');
        "step 1"
        if(get.type(cards[0])=='equip'){
            player.chooseTarget('是否弃置一名角色的两张牌？',function(card,player,target){
                return player!=target&&target.num('he')>0;
            }).set('ai',function(target){
                var player=_status.event.player;
                if(ai.get.attitude(player,target)<0){
                    return Math.max(0.5,ai.get.effect(target,{name:'sha'},player,player));
                }
                return 0;
            });
        }
        else{
            event.finish();
        }
        "step 2"
        if(result.bool){
            player.line(result.targets,'green');
            event.target=result.targets[0];
            
            player.discardPlayerCard(event.target,2,'he',true).ai=ai.get.buttonValue;
        }
    },
                ai:{
                    order:9,
                    result:{
                        player:1,
                    },
                },
            },
            "jvelun_lingtong_xvanfeng":{
                audio:"ext:絶伦逸羣:2",
                trigger:{
                    player:"loseEnd",
                },
                direct:true,
                filter:function (event,player){
        for(var i=0;i<event.cards.length;i++){
            if(event.cards[i].original=='e') return true;
        }
        return false;
    },
                content:function (){
        "step 0"
        player.chooseTarget(get.prompt('jvelun_lingtong_xvanfeng'),function(card,player,target){
            if(target==player) return false;
            return get.distance(player,target)<=1||player.canUse('sha',target,false);
        }).set('ai',function(target){
            if(get.distance(player,target)<=1){
                return get.damageEffect(target,player,player)*2;
            }
            else{
                return get.effect(target,{name:'sha'},player,player);
            }
        });
        "step 1"
        if(result.bool){
            player.logSkill('jvelun_lingtong_xvanfeng',result.targets);
            var target=result.targets[0];
            var distance=get.distance(player,target);
            if(distance<=1&&player.canUse('sha',target,false)){
                player.chooseControl('出杀','造成伤害').ai=function(){
                    return '造成伤害';
                }
                event.target=target;
            }
            else if(distance<=1){
                target.damage();
                player.draw();
                event.finish();
            }
            else{
                player.discardPlayerCard(target,'he',[1,2],true);
                player.useCard({name:'sha'},target,false).animate=false;
                
                game.delay();
                event.finish();
            }
        }
        else{
            event.finish();
        }
        "step 2"
        var target=event.target;
        if(result.control=='出杀'){
           player.discardPlayerCard(target,'he',[1,2],true); 
            player.useCard({name:'sha'},target,false).animate=false;
            game.delay();
        }
        else{
            target.damage();
            player.draw();
        }
    },
                ai:{
                    effect:{
                        target:function (card,player,target,current){
                if(get.type(card)=='equip') return [3,1];
            },
                    },
                    reverseEquip:true,
                    noe:true,
                },
            },
            "jvelun_lingtong_yongjin":{
                audio:"ext:絶伦逸羣:2",
                trigger:{
                    global:"discardAfter",
                },
                filter:function (event,player){
        if(event.player==player) return false;
        for(var i=0;i<event.cards.length;i++){
            if(get.type(event.cards[i])=='equip'&&get.position(event.cards[i])=='d'){
                return true;
            }
        }
        return false;
    },
                frequent:"check",
                check:function (event,player){
        for(var i=0;i<event.cards.length;i++){
            if(get.type(event.cards[i])=='equip'&&get.position(event.cards[i])=='d'){
                if(event.cards[i].name=='du') return false;
            }
        }
        return true;
    },
                content:function (){
        "step 0"
        if(trigger.delay==false) game.delay();
        "step 1"
        var cards=[];
        for(var i=0;i<trigger.cards.length;i++){
            if(get.type(trigger.cards[i])=='equip'&&get.position(trigger.cards[i])=='d'){
                cards.push(trigger.cards[i]);
            }
        }
        if(cards.length){
            player.gain(cards,'log');
            player.$gain2(cards);
        }
    },
            },
            "jvelun_xvsheng_pojvn":{
                shaRelated:true,
                audio:"ext:絶伦逸羣:2",
                trigger:{
                    player:"useCardToPlayered",
                },
                direct:true,
                filter:function(event,player){
        return event.card.name=='sha'&&event.target.hp>0&&event.target.countCards('he')>0;
    },
                content:function(){
        'step 0'
        var next=player.choosePlayerCard(trigger.target,'he',[1,Math.min(trigger.target.hp,trigger.target.countCards('he'))],get.prompt('jvelun_xvsheng_pojvn',trigger.target));
        next.set('ai',function(button){
            if(!_status.event.goon) return 0;
            var val=get.value(button.link);
            if(button.link==_status.event.target.getEquip(2)) return 2*(val+3);
            return val;
        });
        next.set('goon',get.attitude(player,trigger.target)<=0);
        next.set('forceAuto',true);
        'step 1'
        if(result.bool){
            event.cards=result.cards;
            var target=trigger.target;
            player.logSkill('jvelun_xvsheng_pojvn',trigger.target);
            target.addSkill('jvelun_xvsheng_pojvn2');
            target.markAuto('jvelun_xvsheng_pojvn2',result.cards);
            target.lose(result.cards,ui.special,'toStorage');
            game.log(target,'失去了'+get.cnNumber(result.cards.length)+'张牌');;
        }
        else event.finish();
        'step 2'
        var discard=false,draw=false;
        for(var i of cards){
            var type=get.type2(i);
            if(type=='equip') discard=true;
            if(type=='trick') draw=true;
        }
        if(discard){
            event.equip=true;
            player.chooseButton(['选择一张牌置入弃牌堆',cards.filter(function(card){
                return get.type(card)=='equip';
            })],true).set('ai',function(button){
                return get.value(button.link,_status.event.getTrigger().target);
            });
        }
        if(draw)    event.draw=true;
        'step 3'
        if(event.equip&&result.links&&result.links.length){
            trigger.target.unmarkAuto('jvelun_xvsheng_pojvn2',result.links);
            trigger.target.$throw(result.links,1000);
            game.log(player,'将',result.links,'置入了弃牌堆');
            game.cardsDiscard(result.links);
            if(!event.draw) game.delayx();
        }
        if(event.draw) player.draw();
    },
                ai:{
                    "unequip_ai":true,
                    skillTagFilter:function(player,tag,arg){
            if(arg&&arg.name=='sha'&&arg.target.getEquip(2)) return true;
            return false;
        },
                },
            },
            "jvelun_xvsheng_yicheng":{
                group:["jvelun_xvsheng_yicheng_turn","jvelun_xvsheng_yicheng_damage"],
                subSkill:{
                    damage:{
                        trigger:{
                            source:"damageBegin1",
                        },
                        forced:true,
                        filter:function(event,player){
                return event.notLink()&&event.card&&event.card.name=='sha'&&event.player.hp>player.hp;
            },
                        content:function(){
                trigger.num++;
            },
                        sub:true,
                    },
                    turn:{
                        trigger:{
                            player:"turnOverBefore",
                        },
                        priority:20,
                        forced:true,
                        filter:function(event,player){
                return !player.isTurnedOver();
            },
                        content:function(){
                trigger.cancel();
                game.log(player,'取消了翻面');
            },
                        sub:true,
                    },
                },
                mod:{
                    globalFrom:function(from,to,distance){
            return distance-1;
        },
                },
                ai:{
                    noturn:true,
                },
            },
            "jvelun_xvsheng_pojvn2":{
                init:function(player,skill){
        if(!player.storage[skill]) player.storage[skill]=[];
    },
                trigger:{
                    global:"phaseEnd",
                },
                forced:true,
                popup:false,
                charlotte:true,
                filter:function(event,player){
        return player.storage.jvelun_xvsheng_pojvn2&&player.storage.jvelun_xvsheng_pojvn2.length>0;
    },
                content:function(){
        game.log(player,'收回了'+get.cnNumber(player.gain(player.storage.jvelun_xvsheng_pojvn2,'draw','fromStorage').cards.length)+'张〖破军〗牌');
        player.storage.jvelun_xvsheng_pojvn2.length=0;
        player.removeSkill('jvelun_xvsheng_pojvn2');
    },
                intro:{
                    onunmark:"throw",
                    content:"cardCount",
                },
            },
        },
        translate:{
            "jvelun_liubei_jvxin":"聚心",
            "jvelun_liubei_jvxin_info":"每当你失去牌后，你获得一枚“聚心”标记，并令一名其他角色摸一张牌;锁定技，你的“聚心”标记最多有三枚，每名角色回合结束时,你弃置所有的”聚心”标记。",
            "jvelun_huanggai_kurou":"苦肉",
            "jvelun_huanggai_kurou_info":"出牌阶段，第一次发动〖苦肉〗时你失去1点体力，你可以弃置一张牌，若是基本牌，你本回合使用牌无次数限制；若是锦囊牌，你本回合使用牌无距离限制；若是装备牌，你本回合使用牌不可被响应。结束阶段，你失去X点体力（X为你本回合发动〖苦肉〗的次数）。",
            "jvelun_huanggai_kurou_trick":"苦肉",
            "jvelun_huanggai_kurou_trick_info":"",
            "jvelun_huanggai_kurou_basic":"苦肉",
            "jvelun_huanggai_kurou_basic_info":"",
            "jvelun_huanggai_kurou_equip":"苦肉",
            "jvelun_huanggai_kurou_equip_info":"",
            "jvelun_huanggai_kurou_lose":"苦肉",
            "jvelun_huanggai_kurou_lose_info":"",
            "jvelun_huanggai_zhaxiang":"诈降",
            "jvelun_huanggai_zhaxiang_info":"锁定技 每当你失去1点体力后，你摸2+x张牌。(x为你本次流失的体力)",
            "jvelun_chengpu_lihuo":"疠火",
            "jvelun_chengpu_lihuo_info":"当你使用【杀】对一名角色造成伤害时，你可以令此伤害+1，当你这样做时，若其手牌数量小于你，你需弃置x张牌并失去1点体力(x为你与其手牌数差)。",
            "jvelun_chengpu_chunlao":"醇醪",
            "jvelun_chengpu_chunlao_info":"出牌阶段限一次，你可以视为使用了一张【酒】并选择一名其他角色，并执行一项：①将手牌数调整到与其相同；②将其手牌数调整到与你相同。",
            "jvelun_huanggai_handang_gongqi_2":"弓骑",
            "jvelun_huanggai_handang_gongqi_2_info":"",
            "jvelun_jiangqing_shangyi":"尚义",
            "jvelun_jiangqing_shangyi_info":"出牌阶段限一次，你可以观看一名角色的手牌并可以视为使用一张其手牌区内你可使用的牌。",
            "jvelun_jiangqing_niaoxiang":"鸟翔",
            "jvelun_jiangqing_niaoxiang_info":"锁定技，你的杀无视距离；体力值不小于2的角色不能闪避你的杀",
            "jvelunhuzhu1":"护主",
            "jvelunhuzhu1_info":"当其他角色受到伤害时,你可以弃置一张基本牌,将此伤害转移给你;当你受到伤害后,你可以摸1张牌。",
            "jvelunchenwuyongzhan1":"勇战",
            "jvelunchenwuyongzhan1_info":"锁定技，游戏开始时，你增加四点体力上限；回合结束阶段开始时，若你已受伤，须将你的体力值调整为你至损失的体力值。",
            "jvelun_zhoutai_buqu":"不屈",
            "jvelun_zhoutai_buqu_info":"锁定技，当你处于濒死状态时，你亮出牌堆顶的一张牌并置于你的武将牌上，称之为“创”。若此牌的点数与你武将牌上已有的“创”点数均不同，则你回复体力至2。若点数相同，则将此牌置入弃牌堆。只要你的武将牌上有“创”，你的手牌上限便加“创”的数量。",
            "jvelun_chenwu_yongzhan":"勇战",
            "jvelun_chenwu_yongzhan_info":"出牌阶段开始时，你可以选择你攻击范围一名其他角色。其每满足下面一项便视为对其使用了一张【杀】<br>①其的体力值不小于你<br>②其的手牌数不小于你<br>③其的攻击范围不小于你。<br>然后你弃置X张手牌（X为你当前的体力值且至少为1。）且本回合你不能使用【杀】和锦囊牌直到回合结束。",
            "jvelun_chenwu_yongzhan2":"勇战",
            "jvelun_chenwu_yongzhan2_info":"",
            "jvelun_chenwu_renhou":"仁厚",
            "jvelun_chenwu_renhou_info":"当你使用的【杀】造成伤害后，你可以令场上当前体力最少（或之一）的一名角色将体力值恢复到体力上限。",
            "jvelun_dongxi_fenming":"奋命",
            "jvelun_dongxi_fenming_info":"锁定技，你计算与其他角色的距离时，始终-X;你的手牌上限始终+X（X为你被废除装备栏的数量）。",
            "jvelun_dongxi_duanlan":"断缆",
            "jvelun_dongxi_duanlan_info":"出牌阶段限1次，你可以废除1个未废除的装备栏，然后摸2张牌并将回复1点体力值，若以此法失去了装备牌，你可以令1名角色摸2张牌并回复1点体力。",
            "jvelun_ganning_qixi":"奇袭",
            "jvelun_ganning_qixi_info":"你可以将一张牌当作【过河拆桥】使用。若你以此法使用的【过河拆桥】为黑色，你于结算完成后摸一张牌。",
            "jvelun_ganning_fenwei":"奋威",
            "jvelun_ganning_fenwei_info":"当一张锦囊牌指定两个以上的目标后，若选择的目标里有角色受伤，你可以令任意名受伤角色不受此牌的效果。",
            "jvelun_handang_jiefan":"解烦",
            "jvelun_handang_jiefan_info":"当你使用或打出牌响应其他角色，或其他角色使用或打出牌响应你后，若此牌为：基本牌，你可令一名角色弃置两张牌或令一名角色摸两张牌；非基本牌，你可对一名角色造成2点伤害或令一名其他角色回复2点体力(每回合限一次)。",
            "jvelun_handang_gongqi":"弓骑",
            "jvelun_handang_gongqi_info":"出牌阶段，你可以弃置一张牌，令你的攻击范围无限且出杀不能被闪抵消，直到回合结束，然后若你以此法弃置的牌为装备牌，你可以弃置一名其他角色两张牌。每回合限一次。",
            "jvelun_lingtong_xvanfeng":"旋风",
            "jvelun_lingtong_xvanfeng_info":"每当你失去一次装备区里的牌时，你可以执行下列两项中的一项：1.视为对任意一名其他角色使用一张【杀】并弃置其1～2张牌（此【杀】不计入每回合的使用限制）；2.对与你距离1以内的一名其他角色造成一点伤害并摸一张牌。",
            "jvelun_lingtong_yongjin":"勇进",
            "jvelun_lingtong_yongjin_info":"当其他角色的装备牌，因卡牌弃牌或机制弃牌而进入弃牌堆时，你可以获得之。",
            "jvelun_xvsheng_pojvn":"破军",
            "jvelun_xvsheng_pojvn_info":"当你使用【杀】指定目标后，你可以将其的至多X张牌置于其武将牌上（X为其体力值）。若这些牌中：有装备牌，你将这些装备牌中的一张置于弃牌堆；有锦囊牌，你摸一张牌。其于回合结束时获得其武将牌上的这些牌。",
            "jvelun_xvsheng_yicheng":"疑城",
            "jvelun_xvsheng_yicheng_info":"锁定技，你使用杀对体力值大于你的角色造成的伤害+1。你与其他角色距离－1。你不能被翻面。",
            "jvelun_xvsheng_pojvn2":"破军",
            "jvelun_xvsheng_pojvn2_info":"",
        },
    },
    intro:"“相逢依旧此山河”，何其有幸，纵然时光流逝不曾回首，山河大地仍一如往常，把故人们那些波澜壮阔亦或是风流宛转的往事娓娓道来。他们的故事，我们记得，那日月星辰、山川河流，哪一处不记得？荆襄雨，长江水，秦岭月，成都花，汉中夜，哪一处曾忘记？他们的名字是我们的信仰，永远铭刻在岁月之中，星河之上。<br>○强度为中等，建议与其他中等强度扩展一起玩耍<br>●本人QQ为3510248284，常在892852274此群活动<br>更新报告：<br> ①更改了扩展的扩展介绍，缩短了主题介绍。 <br>②削弱4/4黄盖。（诈降现在只能摸3了）<br> ③增加了[江东之铁壁]。",
    author:"叫什么（刘玄德）",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["jvelun_疑城破魏_徐盛.jpg"],"card":[],"skill":[]}}};