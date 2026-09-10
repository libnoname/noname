import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"手杀补全",content:function (config,pack){
    
},precontent:function (){
    
},help:{},config:{},package:{
    character:{
        character:{
            simahui:["male","qun",3,["jianjie","chenghao","yinshi"],["des:司马徽（？—208年），字德操，颍川阳翟（今河南禹州）人。东汉末年名士，精通道学、奇门、兵法、经学。有“水镜先生”之称。 司马徽为人清雅，学识广博，有知人之明，并向刘备推荐了诸葛亮、庞统等人，受到世人的敬重。"]],
            pangdegong:["male","qun",3,["pingcai","pcpingcai","pcyinshi"],["des:庞德公，字尚长，荆州襄阳人，东汉末年名士、隐士。 庞德公与当时徐庶、司马徽、诸葛亮、庞统等人交往密切。庞德公曾称诸葛亮为\"卧龙\"，庞统为\"凤雏\"，司马徽为\"水镜\"，被誉为知人。对诸葛亮、庞统等人早年影响较大，并得到诸葛亮的敬重。庞德公最后隐居于鹿门山，采药而终。"]],
        },
        translate:{
            simahui:"司马徽",
            pangdegong:"庞德公",
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
            "longyin2":{
                mark:true,
                intro:{
                    content:"已获得技能【火计】",
                },
                nopop:true,
            },
            "fengyin2":{
                mark:true,
                intro:{
                    content:"已获得技能【连环】",
                },
                nopop:true,
            },
            jianjie:{
                group:["jianjie1","jianjie2"],
            },
            "jianjie1":{
                trigger:{
                    player:"phaseBegin",
                },
                forced:true,
                priority:9,
                filter:function (){
        return game.players.length>1;
    },
                content:function (){
        'step 0'
        player.chooseTarget('选择【龙印】的目标',lib.translate.jianjie1_info,true,function(card,player,target){
            return !target.hasSkill('longyin2')&&!target.hasSkill("fengyin2");
        }).set('ai',function(target){
            var att=get.attitude(_status.event.player,target);
            if(att>0) return att+1;
            if(att==0) return Math.random();
            return att;
        });
        'step 1'
        if(result.bool){
            var target=result.targets[0];
            player.line(target,'green');
            game.log(target,'获得了','【龙印】');
            target.addSkill('longyin2');
            target.addSkill("shuangyin");
        }
          'step 2'
        player.addSkill("jianjie6");    
        player.removeSkill("jianjie1");
    },
            },
            "jianjie2":{
                trigger:{
                    player:"phaseBegin",
                },
                forced:true,
                priority:1,
                filter:function (){
        return game.players.length>1;
    },
                content:function (){
        'step 0'
        player.chooseTarget('选择【凤印】的目标',lib.translate.jianjie2_info,true,function(card,player,target){
            return !target.hasSkill('fengyin2')&&!target.hasSkill("longyin2");
        }).set('ai',function(target){
            var att=get.attitude(_status.event.player,target);
            if(att>0) return att+1;
            if(att==0) return Math.random();
            return att;
        });
        'step 1'
        if(result.bool){ 
            var target=result.targets[0];
            player.line(target,'green');
            game.log(target,'获得了','【凤印】');
            target.addSkill('fengyin2');
            target.addSkill("shuangyin");
        }
        'step 2'
      player.addSkill("jianjie6");
        player.removeSkill("jianjie");
    },
            },
            yinshi:{
                trigger:{
                    player:"damageBefore",
                },
                forced:true,
                priority:15,
                check:function (event,player){
        if(player==event.player) return true;
        return false;
    },
                filter:function (event,player){
        if(player.getEquip(2))return false;
        if(player.hasSkill("longyin2")||player.hasSkill("fengyin2"))return false;
        return get.type(event.card,'trick')=='trick'||event.source&&event.nature;
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
                        player:function (card,player,target,current){
                if(get.type(card)=='trick'&&get.tag(card,'damage')){
                    return 'zeroplayertarget';
                }
            },
                    },
                },
            },
            reyeyan:{
   unique:true,
				enable:'phaseUse',
				animationColor:'fire',
				skillAnimation:'legend',
				filterTarget:function(card,player,target){
					var length=ui.selected.cards.length;
					return (length==0||length==4);
				},
				filter:function (event,player){
        return !player.storage.reyeyan;
    },
   init:function (player){
        player.storage.reyeyan=false;
    },
	 			filterCard:function(card){
					var suit=get.suit(card);
					for(var i=0;i<ui.selected.cards.length;i++){
						if(get.suit(ui.selected.cards[i])==suit) return false;
					}
					return true;
				},
				complexCard:true,
				limited:true,
				selectCard:[0,4],
				line:'fire',
				check:function(){return -1},
				selectTarget:function(){
					if(ui.selected.cards.length==4) return 1;
					if(ui.selected.cards.length==0) return [1,3];
					game.uncheck('target');
					return [1,3];
				},
				content:function(){
				"step 0"
					player.awakenSkill('reyeyan');
					player.storage.reyeyan=true;
					if(cards.length==4){
						player.loseHp(3);
						target.damage('fire',3,'nocard');
					}
					else{
						target.damage('fire','nocard');
					}
					 "step 1"
        player.removeSkill("longyin2");
        player.removeSkill("fengyin2");
        player.removeSkill("shuangyin");
        for(var i=0;i<game.players.length;i++){ 
             simahui=game.players[i];
             simahui.removeSkill("jianjie6");
             simahui.removeSkill("jianjie4");
       } 
    },
                intro:{
                    content:"limited",
                },
                ai:{
                    order:1,
                    result:{
                        target:function (player,target){
                if(target.hasSkillTag('nofire')) return 0;
                if(lib.config.mode=='versus') return -1;
                if(player.hasUnknown()) return 0;
                return get.damageEffect(target,player);
            },
                    },
                },
            },
            chenghao:{
                trigger:{
                    global:"damageBegin",
                },
                forced:true,
                filter:function (event,player){
        if(player.hasSkill("chenghao1"))return false;
        return event.player.isLinked()&&event.notLink&&(event.source&&event.nature);
    },
                content:function (){
          "step 0"
         var num=0;
                    for(var i=0;i<game.players.length;i++){
                        if(game.players[i].isLinked()){
                            num++;
                        }
                    }
        event.cards=get.cards(num);
        player.addTempSkill("chenghao1");
        "step 1"
        if(event.cards.length>1){
            player.chooseCardButton('将牌分配给任意角色',true,event.cards,[1,event.cards.length]).set('ai',function(button){
                if(ui.selected.buttons.length==0) return 1;
                return 0;
            });
        }
        else if(event.cards.length==1){
            event._result={links:event.cards.slice(0),bool:true};
        }
        else{
            event.finish();
        }
        "step 2"
        if(result.bool){
            for(var i=0;i<result.links.length;i++){
                event.cards.remove(result.links[i]);
            }
            event.togive=result.links.slice(0);
            player.chooseTarget('将'+get.translation(result.links)+'交给一名角色',true).set('ai',function(target){
                var att=get.attitude(_status.event.player,target);
                if(_status.event.enemy){
                    return -att;
                }
                else if(att>0){
                    return att/(1+target.countCards('h'));
                }
                else{
                    return att/100;
                }
            }).set('enemy',get.value(event.togive[0])<0);
        }
        "step 3"
        if(result.targets.length){
            result.targets[0].gain(event.togive,'draw');
            player.line(result.targets[0],'green');
            game.log(result.targets[0],'获得了'+get.cnNumber(event.togive.length)+'张牌');
            event.goto(1);
        }
    },
            },
            "chenghao1":{
            },
            "jianjie4":{
                group:["jianjie4_longyin4","jianjie4_fengyin4"],
                subSkill:{
                    "longyin4":{
                        trigger:{
                            global:"dieBegin",
                        },
                        forced:true,
                        filter:function (event,player){
        return game.players.length>1&&event.player.hasSkill("longyin2");
    },
                        content:function (){
        'step 0'
        player.chooseTarget('选择【龙印】的目标',lib.translate.jianjie3_info,true,function(card,player,target){
            return !target.hasSkill('longyin2');
        }).set('ai',function(target){
            var att=get.attitude(_status.event.player,target);
            if(att>0) return att+1;
            if(att==0) return Math.random();
            return att;
        });
        'step 1'
        if(result.bool){
            var target=result.targets[0];
            player.line(target,'green');
            game.log(target,'获得了','【龙印】');
            target.addSkill('longyin2');
            target.addSkill("shuangyin");
        }
    },
                        sub:true,
                    },
                    "fengyin4":{
                        trigger:{
                            global:"dieBegin",
                        },
                        forced:true,
                        filter:function (event,player){
        return game.players.length>1&&event.player.hasSkill("fengyin2");
    },
                        content:function (){
        'step 0'
        player.chooseTarget('选择【凤印】的目标',lib.translate.jianjie3_info,true,function(card,player,target){
            return !target.hasSkill('fengyin2');
        }).set('ai',function(target){
            var att=get.attitude(_status.event.player,target);
            if(att>0) return att+1;
            if(att==0) return Math.random();
            return att;
        });
        'step 1'
        if(result.bool){
            var target=result.targets[0];
            player.line(target,'green');
            game.log(target,'获得了','【凤印】');
            target.addSkill('fengyin2');
            target.addSkill("shuangyin");
        }
    },
                        sub:true,
                    },
                },
            },
            "jjlianhuan3":{
                trigger:{
                    player:"useCard",
                },
                filter:function (event){
        return event.skill=='jjlianhuan1'&&event.targets.length==1;
    },
                forced:true,
                popup:false,
                content:function (){
        player.draw();
    },
            },
            "jjlianhuan1":{
                enable:"phaseUse",
                usable:3,
                filter:function (event,player){
        return player.countCards('h',{suit:'club'})>0;
    },
                filterCard:{
                    suit:"club",
                },
                viewAs:{
                    name:"tiesuo",
                    suit:"club",
                    number:8,
                    cards:[{"node":{"image":{},"info":{},"name":{},"name2":{},"background":{},"intro":{},"range":{}},"storage":{},"vanishtag":[],"_uncheck":[],"suit":"club","number":8,"name":"sha","cardid":"8024391289","_transform":"translateX(448px)","clone":{"name":"sha","suit":"club","number":8,"node":{"name":{},"info":{},"intro":{},"background":{},"image":{}},"_transitionEnded":true,"timeout":423},"timeout":401,"original":"h"}],
                },
                prompt:"将一张梅花牌当铁锁连环使用",
                check:function (card){return 6-get.value(card)},
                ai:{
                    order:7.5,
                    result:{
                        target:function (player,target){
                if(ui.selected.targets.length) return 0;
                if(target.isLinked()) return 1;
                return -1;
            },
                    },
                    wuxie:function (){
            if(Math.random()<0.5) return 0;
        },
                    basic:{
                        useful:4,
                        value:4,
                        order:7,
                    },
                    tag:{
                        multitarget:1,
                        multineg:1,
                        norepeat:1,
                    },
                },
            },
            "jjlianhuan2":{
                audio:"ext:手杀武将/apk/手杀补全:2",
                enable:"phaseUse",
                filter:function (event,player){
        return player.countCards('h',{suit:'club'})>0;
    },
                filterCard:function (card){
        return get.suit(card)=='club';
    },
                check:function (card){
        return 5-get.useful(card);
    },
                content:function (){
        player.draw();
    },
                discard:false,
                prompt:"将一张梅花牌置入弃牌堆并摸一张牌",
                delay:0.5,
                prepare:function (cards,player){
        player.$throw(cards,1000);
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
            shuangyin:{
                trigger:{
                    player:"phaseUseBegin",
                },
                filter:function (player){
        if(player.hasSkill("reyeyan"))return false;
        return true;
    },
                forced:true,
                content:function (){
          if(player.hasSkill("longyin2")&&!player.hasSkill("fengyin2")){
              player.addTempSkill("jjhuoji");
          }
          if(player.hasSkill("fengyin2")&&!player.hasSkill("longyin2")){
              player.addTempSkill("jjlianhuan");
          }
        if(player.hasSkill("longyin2")&&player.hasSkill("fengyin2")){
        player.addTempSkill("reyeyan");
        }
    },
                ai:{
                    threaten:1.2,
                },
            },
            "jianjie3":{
                group:["jjlongyin3","jjfengyin3"],
            },
            "jjlongyin3":{
                trigger:{
                    player:"phaseDrawEnd",
                },
                filter:function (event,player){
        return !player.hasSkill("jianjie5")&&game.players.length>1;
    },
                content:function (){
    "step 0"
player.chooseTarget('选择有【龙印】的目标',lib.translate.jianjie3_info,true,function(card,player,target){
            return target.hasSkill('longyin2');
        }).set('ai',function(target){
            var att=get.attitude(_status.event.player,target);
            if(att>0) return att+1;
            if(att==0) return Math.random();
            return att;
        });
     "step 1"
        if(result.bool){
            var target=result.targets[0];
            player.line(target,'green');
            game.log(target,'失去了','【龙印】');
            target.removeSkill('longyin2');
            target.removeSkill("shuangyin");
            target.addTempSkill("markyinji");
            player.addTempSkill('jianjie5');
        }
      "step 2"
      player.chooseTarget('选择没有【龙印】的目标',lib.translate.jianjie1_info,true,function(card,player,target){
            return !target.hasSkill('longyin2')&&!target.hasSkill("markyinji");
        }).set('ai',function(target){
            var att=get.attitude(_status.event.player,target);
            if(att>0) return att+1;
            if(att==0) return Math.random();
            return att;
        });
     "step 3"
        if(result.bool){
            var target=result.targets[0];
            player.line(target,'green');
            game.log(target,'获得了','【龙印】');
            target.addSkill('longyin2');
            target.addSkill("shuangyin");
            event.finish();
        }  
},
            },
            "jjfengyin3":{
                trigger:{
                    player:"phaseDrawEnd",
                },
                filter:function (event,player){
        return !player.hasSkill("jianjie5")&&game.players.length>1;
    },
                content:function (){
    "step 0"
player.chooseTarget('选择有【凤印】的目标',lib.translate.jianjie3_info,true,function(card,player,target){
            return target.hasSkill('fengyin2');
        }).set('ai',function(target){
            var att=get.attitude(_status.event.player,target);
            if(att>0) return att+1;
            if(att==0) return Math.random();
            return att;
        });
     "step 1"
        if(result.bool){
            var target=result.targets[0];
            player.line(target,'green');
            game.log(target,'失去了','【凤印】');
            target.removeSkill('fengyin2');
            target.removeSkill("shuangyin");
            target.addTempSkill("markyinji");
            player.addTempSkill('jianjie5');
        }
      "step 2"
      player.chooseTarget('选择没有【凤印】的目标',lib.translate.jianjie2_info,true,function(card,player,target){
            return !target.hasSkill('fengyin2')&&!target.hasSkill("markyinji");
        }).set('ai',function(target){
            var att=get.attitude(_status.event.player,target);
            if(att>0) return att+1;
            if(att==0) return Math.random();
            return att;
        });
     "step 3"
        if(result.bool){
            var target=result.targets[0];
            player.line(target,'green');
            game.log(target,'获得了','【凤印】');
            target.addSkill('fengyin2');
            target.addSkill("shuangyin");        
            event.finish();   
        }  
    },
            },
            "jianjie5":{
            },
            markyinji:{
            },
            "jianjie6":{
                trigger:{
                    player:"phaseBegin",
                },
                filter:function (player){
        if(!player.hasSkill("jianjie"))return false;
        if(player.hasSkill("reyeyan"))return false;
        return true;
    },
                forced:true,
                content:function (){
        player.addTempSkill("jianjie3");
        player.addSkill("jianjie4");
    },
                ai:{
                    expose:0.1,
                },
            },
            jjlianhuan:{
                group:["jjlianhuan1","jjlianhuan2","jjlianhuan3"],
            },
            jjhuoji:{
                enable:"chooseToUse",
                usable:3,
                filterCard:function (card){
        return get.color(card)=='red';
    },
                viewAs:{
                    name:"huogong",
                    nature:"fire",
                    suit:"heart",
                    number:7,
                    cards:[{"node":{"image":{},"info":{},"name":{},"name2":{},"background":{},"intro":{},"range":{}},"storage":{},"vanishtag":[],"_uncheck":[],"suit":"heart","number":7,"name":"sha","nature":"fire","cardid":"4270988258","_transform":"translateX(112px)","clone":{"name":"sha","suit":"heart","number":7,"node":{"name":{},"info":{},"intro":{},"background":{},"image":{}},"_transitionEnded":true,"timeout":741},"timeout":691,"original":"h"}],
                },
                viewAsFilter:function (player){
        if(!player.countCards('h',{color:'red'})) return false;
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
            pcwolong:{
                audio:"ext:手杀武将/apk/手杀补全:true",
                enable:"phaseUse",
                animationColor:"fire",
                skillAnimation:"legend",
                filter:function (event,player,target){
        return !player.hasSkill("pingcai2");
    },
                filterTarget:function (card,player,target){
        return player!=target;
    },
                line:"fire",
                selectTarget:1,
                check:function (){return -1},
                content:function (){
        "step 0"
        target.damage('fire');
        "step 1"
        player.addTempSkill("pingcai2",'phaseDiscard');
    },
                ai:{
                    order:8,
                    result:{
                        target:function (player,target){
                            if(ui.selected.targets.length==0){
                                return -3;
                            }
                            else{
                                return get.effect(target,{name:'juedou'},ui.selected.targets[0],target);
                            }
                        },
                    },
                    expose:0.4,
                    threaten:3,
                },
            },
            pcfengchu:{
                audio:"ext:手杀武将/apk/手杀补全:true",
                enable:"phaseUse",
                skillAnimation:true,
                animationColor:"metal",
                selectTarget:[1,3],
                filterTarget:function (card,player,target){
        return true;
    },
                filter:function (event,player,target){
        return !player.hasSkill("pingcai2");
    },
                content:function (){
        "step 0"
         target.link();
        "step 1"
        player.addTempSkill("pingcai2",'phaseDiscard');
    },
                ai:{
					order:7.5,
					result:{
						target:function(player,target){
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
						}
					},
					}
            },
            pcshuijing:{
                audio:"ext:手杀武将/apk/手杀补全:true",
                enable:"phaseUse",
                skillAnimation:true,
                animationColor:"water",
                selectTarget:2,
                targetprompt:["被移走","移动目标"],
                filterTarget:function (card,player,target){
        if(ui.selected.targets.length){
            var from=ui.selected.targets[0];
            if(target.isMin()) return false;
            if(from.getEquip(2)&&!target.getEquip(2)) return true;
            return false;
        }
        else{
            return target.countCards('e',{subtype:['equip2']})>0;
        }
    },
                filter:function (event,player,target){
        return !player.hasSkill("pingcai2");
    },
                multitarget:true,
                content:function (){
        "step 0"
        event.cards=[targets[0].getCards('e',{subtype:['equip2']}),targets[1].getCards('e',{subtype:['equip2']})];
        targets[0].lose(event.cards[0],ui.special);
        
        if(event.cards[0].length) targets[0].$give(event.cards[0],targets[1]);
        
        "step 1"
        
        for(var i=0;i<event.cards[0].length;i++){
            targets[1].equip(event.cards[0][i]);
        }
        "step 2"
        player.addTempSkill("pingcai2",'phaseDiscard');
    },
                ai:{
                    order:10,
                    threaten:function (player,target){
            return 0.8*Math.max(1+target.maxHp-target.hp);
        },
                    result:{
                        target:function (player,target){
                var list1=[];
                var list2=[];
                var num=player.maxHp-player.hp;
                var players=game.filterPlayer();
                for(var i=0;i<players.length;i++){
                    if(get.attitude(player,players[i])>0) list1.push(players[i]);
                    else if(get.attitude(player,players[i])<0) list2.push(players[i]);
                }
                list1.sort(function(a,b){
                    return a.countCards('e')-b.countCards('e');
                });
                list2.sort(function(a,b){
                    return b.countCards('e')-a.countCards('e');
                });
                var delta;
                for(var i=0;i<list1.length;i++){
                    for(var j=0;j<list2.length;j++){
                        delta=list2[j].countCards('e')-list1[i].countCards('e');
                        if(delta<=0) continue;
                        if(delta<=num){
                            if(target==list1[i]||target==list2[j]){
                                return get.attitude(player,target);
                            }
                            return 0;
                        }
                    }
                }
                return 0;
            },
                    },
                    effect:{
                        target:function (card,player,target){
                if(target.hp==target.maxHp&&get.tag(card,'damage')) return 0.2;
            },
                    },
                },
            },
            pcxuanjian:{
                audio:"ext:手杀武将/apk/手杀补全:true",
                enable:"phaseUse",
                skillAnimation:true,
                animationColor:"epic",
                filterTarget:function (card,player,target){
        return true;
    },
                filter:function (event,player,target){
        return !player.hasSkill("pingcai2");
    },
                content:function (){
        "step 0"
        target.recover();
        target.draw();
        "step 1"
        player.addTempSkill("pingcai2",'phaseDiscard');
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
                    threaten:2,
                },
            },
            pcyinshi:{
                group:["pcyinshi_Begin","pcyinshi_End"],
                subSkill:{
                    Begin:{
                        trigger:{
                            player:"phaseBegin",
                        },
                        priority:99999,
                        forced:true,
                        content:function (){
                'step 0'
             trigger.cancel();
                'step 1' 
             player.update();
             player.phaseDraw();
             player.phaseUse();   
             player.phaseDiscard();
                'step 2'
             player.getStat().card={};
    },
                        sub:true,
                    },
                    End:{
                        trigger:{
                            player:"phaseUseEnd",
                        },
                        priority:99999,
                        forced:true,
                        content:function (){
            trigger.cancel();
    },
                        sub:true,
                    },
                },
                mod:{
                    targetEnabled:function (card,player,target){
            if(get.type(card)=='delay'){
                return false;
            }
        },
                },
            },
            "pcwolong1":{
                audio:"ext:手杀武将/apk/手杀补全:true",
                unique:true,
                enable:"phaseUse",
                animationColor:"fire",
                skillAnimation:"legend",
                filter:function (event,player,target){
        return !player.hasSkill("pingcai2");
    },
                filterTarget:function (card,player,target){
        return player!=target;
    },
                selectTarget:[1,2],
                line:"fire",
                check:function (){return -1},
                content:function (){
         "step 0"
        target.damage('fire');
        "step 1"
        player.addTempSkill("pingcai2",'phaseDiscard');
    },
                ai:{
                    order:8,
                    result:{
                        target:function (player,target){
                            if(ui.selected.targets.length==0){
                                return -3;
                            }
                            else{
                                return get.effect(target,{name:'juedou'},ui.selected.targets[0],target);
                            }
                        },
                    },
                    expose:0.4,
                    threaten:3,
                },
            },
            "pcfengchu1":{
                audio:"ext:手杀武将/apk/手杀补全:true",
                enable:"phaseUse",
                skillAnimation:true,
                animationColor:"metal",
                selectTarget:[1,4],
                filterTarget:function (card,player,target){
        return true;
    },
                filter:function (event,player,target){
        return !player.hasSkill("pingcai2");
    },
                content:function (){
        "step 0"
       target.link();
        "step 1"
        player.addTempSkill("pingcai2",'phaseDiscard');
    },
              ai:{
					order:7.5,
					result:{
						target:function(player,target){
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
						}
					},
					}
            },
            "pcshuijing1":{
                audio:"ext:手杀武将/apk/手杀补全:true",
                enable:"phaseUse",
                skillAnimation:true,
                animationColor:"water",
                multitarget:true,
                targetprompt:["被移走","移动目标"],
                filter:function (event,player,target){
        return !player.hasSkill("pingcai2");
    },
                filterTarget:function (card,player,target){
        if(ui.selected.targets.length){
            var from=ui.selected.targets[0];
            if(target.isMin()) return false;
            if((from.getEquip(1)&&!target.getEquip(1))||
                (from.getEquip(2)&&!target.getEquip(2))||
                (from.getEquip(3)&&!target.getEquip(3))||
                (from.getEquip(4)&&!target.getEquip(4))||
                (from.getEquip(5)&&!target.getEquip(5))) return true;
            return false;
        }
        else{
            return target.countCards('e')>0;
        }
    },
                selectTarget:2,
                content:function (){
        "step 0"
        if(targets.length==2){
            player.choosePlayerCard('e',function(button){
                if(get.attitude(player,targets[0])>get.attitude(player,targets[1])){
                    return get.position(button.link)=='e'?10:0;
                }
                else{
                    if(get.position(button.link)=='e') return -10;
                    return get.equipValue(button.link);
                }
            },targets[0]);
        }
        else{
            event.finish();
        }
        "step 1"
        if(result.bool){
            if(get.position(result.buttons[0].link)=='e'){
                event.targets[1].equip(result.buttons[0].link);
            }
            event.targets[0].$give(result.buttons[0].link,event.targets[1])
            game.delay();
        }
        "step 2"
        player.addTempSkill("pingcai2",'phaseDiscard');
    },
            },
            "pcxuanjian1":{
                audio:"ext:手杀武将/apk/手杀补全:true",
                enable:"phaseUse",
                skillAnimation:true,
                animationColor:"epic",
                filterTarget:function (card,player,target){
        return true;
    },
                filter:function (event,player,target){
        return !player.hasSkill("pingcai2");
    },
                content:function (){
        "step 0"
        target.recover();
        target.draw();
        player.draw();
        "step 1"
        player.addTempSkill("pingcai2",'phaseDiscard');
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
                    threaten:2,
                },
            },
            pingcai:{
                trigger:{
                    player:"phaseDrawEnd",
                },
                audio:"ext:手杀武将/apk/手杀补全:true",
                noAdd:true,
                noRemove:true,
                noDisabled:true,
                "precreate1":function (player){
      game.log('庞德公擦拭出的宝物为卧龙');
        player.addTempSkill("pcwolong",'phaseDiscard');
    },
                "precreate2":function (player){
       game.log('庞德公擦拭出的宝物为凤雏');
        player.addTempSkill("pcfengchu",'phaseDiscard');
    },
                "precreate3":function (player){
        game.log('庞德公擦拭出的宝物为水镜');
        player.addTempSkill("pcshuijing",'phaseDiscard');
    },
                "precreate4":function (player){
       game.log('庞德公擦拭出的宝物为玄剑');
        player.addTempSkill("pcxuanjian",'phaseDiscard');
    },
                content:function (){
        "step 0"
        if(event.isMine()){                        
            event.pingcai=ui.create.control('卧龙',function(){
                event.pingcai.status--;
            });
            event.pingcai.status=1;
            for(var i=0;i<event.pingcai.childNodes.length;i++){
                event.pingcai.childNodes[i].num=0;
            }
            event.timer=setInterval(function(){
                if(event.pingcai.status<=0){
                    clearInterval(event.timer);
                    game.resume();
                    event.pingcai.close();
                    return;
                }
                event.count(0);
                if(event.pingcai.status>1) event.count(1);
                if(event.pingcai.status>2) event.count(2);
                if(event.pingcai.status>3) event.count(3);
            },200);
            event.count=function(num){
                event.pingcai.childNodes[num].num=(event.pingcai.childNodes[num].num+1)%4;
                if(event.pingcai.childNodes[num].num==1) event.pingcai.childNodes[num].innerHTML='凤雏';
                else if(event.pingcai.childNodes[num].num==2) event.pingcai.childNodes[num].innerHTML='水镜';
                else if(event.pingcai.childNodes[num].num==3) event.pingcai.childNodes[num].innerHTML='玄剑';
                else if(event.pingcai.childNodes[num].num==0) event.pingcai.childNodes[num].innerHTML='卧龙';
                else event.pingcai.childNodes[num].innerHTML=get.cnNumber(event.pingcai.childNodes[num].num);
            }
            game.pause();
        }
else{
            event.finish();
            var x=Math.random();
            if(x<0.25) lib.skill['pingcai'].precreate1(player);
            if(x>0.25&&x<0.5) lib.skill['pingcai'].precreate2(player);
            if(x>0.5&&x<0.75) lib.skill['pingcai'].precreate3(player);
            if(x>0.75&&x<1.0) lib.skill['pingcai'].precreate4(player);
}
 "step 1"
        var str='';
        for(var i=0;i<event.pingcai.childNodes.length;i++){
            str+=event.pingcai.childNodes[i].innerHTML;
        }
        //var nature=['fire','epic','water','metal'].randomGet();
        player.$skill(str);
        game.delay();
        switch(str){
            case '卧龙':lib.skill['pingcai'].precreate1(player);break;
            case '凤雏':lib.skill['pingcai'].precreate2(player);break;
            case '水镜':lib.skill['pingcai'].precreate3(player);break;
            case '玄剑':lib.skill['pingcai'].precreate4(player);break;
}
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
            "pcpingcai":{
                trigger:{
                    player:"phaseUseBegin",
                },
                filter:function (player){
        return true;
    },
                forced:true,
                content:function (){
        "step 0"
        var wo=game.findPlayer(function(current){
            return current.name=='sp_zhugeliang';
        });
          if(wo){
              if(player.hasSkill("pcwolong")){
              player.removeSkill("pcwolong");    
              player.addTempSkill("pcwolong1",'phaseDiscard');
          }
          }
        "step 1"
        var pa=game.findPlayer(function(current){
            return current.name=='pangtong';
        });
          if(pa){
              if(player.hasSkill("pcfengchu")){
              player.removeSkill("pcfengchu");    
              player.addTempSkill("pcfengchu1",'phaseDiscard');
          }
          }
         "step 2"
         var si=game.findPlayer(function(current){
            return current.name=='simahui';
        });
          if(si){
              if(player.hasSkill("pcshuijing")){
              player.removeSkill("pcshuijing");    
              player.addTempSkill("pcshuijing1",'phaseDiscard');
          }
          }
        "step 3"
        var xu=game.findPlayer(function(current){
            return current.name=='xushu'||current.name=='re_xushu';
        });
          if(xu){
              if(player.hasSkill("pcxuanjian")){
              player.removeSkill("pcxuanjian");    
              player.addTempSkill("pcxuanjian1",'phaseDiscard');
          }
          }
    },
            },
            "pingcai2":{
            },
        },
        translate:{
            "longyin2":"龙印",
            "longyin2_info":"",
            "fengyin2":"凤印",
            "fengyin2_info":"",
            jianjie:"荐杰",
            "jianjie_info":"你的第一个回合开始阶段，你令两名不同的玩家分别获得龙印与凤印；出牌阶段限一次（你的第一个回合除外），或当拥有龙印凤印的玩家死亡时，你可以转移龙印或凤印。龙印：获得“火计”。凤印：获得“连环”。（均一回合限使用三次） 龙凤印齐全：获得“业炎”，“业炎”发动后移除龙凤印",
            "jianjie1":"荐杰",
            "jianjie1_info":"选择一名角色获得“龙印”",
            "jianjie2":"荐杰",
            "jianjie2_info":"选择一名角色获得“凤印”",
            yinshi:"隐士",
            "yinshi_info":"锁定技，若你没有龙印，凤印且没装备防具，防止你受到的属性伤害和锦囊牌造成的伤害。",
            reyeyan:"业炎",
            "reyeyan_info":"限定技，出牌阶段，你可以对一至三名角色造成至多共3点火焰伤害（你可以任意分配每名目标角色受到的伤害点数），若你将对一名角色分配2点或更多的火焰伤害，你须先弃置四张不同花色的手牌再失去3点体力。",
            chenghao:"称好",
            "chenghao_info":"当一名角色受到属性伤害时，若其处于“连环状态”且是伤害传导的起点，你可以观看牌堆顶的X张牌并分配给任意角色。(X为横置角色的数量)",
            "chenghao1":"称好",
            "chenghao1_info":"",
            "jianjie4":"荐杰",
            "jianjie4_info":"",
            markyinji:"",
            "jjlianhuan3":"连环",
            "jjlianhuan3_info":"",
            "jjlianhuan1":"连环",
            "jjlianhuan1_info":"出牌阶段限三次，你可以将一张♣手牌当【铁索连环】使用，若以此法使用的【铁索连环】仅指定一个目标，你摸一张牌；你可以重铸♣牌。",
            "jjlianhuan2":"重铸",
            "jjlianhuan2_info":"",
            shuangyin:"",
            "shuangyin_info":"",
            "jianjie3":"荐杰",
            "jianjie3_info":"出牌阶段限一次，你可以转移“龙印”或“凤印”。当拥有龙印凤印的玩家死亡时，你可以转移龙印或凤印。",
            "jjlongyin3":"龙印",
            "jjlongyin3_info":"",
            "jjfengyin3":"凤印",
            "jjfengyin3_info":"",
            "jianjie5":" ",
            "jianjie5_info":"",
            "jianjie6":"荐杰",
            "jianjie6_info":"",
            jjlianhuan:"连环",
            "jjlianhuan_info":"出牌阶段限三次，你可以将一张♣手牌当【铁索连环】使用，若以此法使用的【铁索连环】仅指定一个目标，你摸一张牌；你可以重铸♣牌。",
            jjhuoji:"火计",
            "jjhuoji_info":"出牌阶段限三次，你可以将一张红色手牌当【火攻】使用。",
            pcwolong:"卧龙",
            "pcwolong_info":"你对一名其他角色造成一点火焰伤害，说卧龙诸葛亮存活，则将“一名”改为“至多两名”。",
            pcfengchu:"凤雏",
            "pcfengchu_info":"你令至多三名角色横置其武将牌，若庞统存活，则将“三名”改为“四名”。",
            pcshuijing:"水镜",
            "pcshuijing_info":"移动场上一张防具牌，若司马徽存活，则将“防具牌”改为“装备牌”。",
            pcxuanjian:"玄剑",
            "pcxuanjian_info":"你令一名角色摸一张牌并回复一点体力，若徐庶(界徐庶)存活，你摸一张牌。",
            pcyinshi:"隐世",
            "pcyinshi_info":"锁定技，你只有摸牌阶段，出牌阶段和弃牌阶段;你不能成为延时锦囊牌的目标。",
            "pcwolong1":"卧龙",
            "pcwolong1_info":"你对一名其他角色造成一点火焰伤害，说卧龙诸葛亮存活，则将“一名”改为“至多两名”。",
            "pcfengchu1":"凤雏",
            "pcfengchu1_info":"你令至多三名角色横置其武将牌，若庞统存活，则将“三名”改为“四名”。",
            "pcshuijing1":"水镜",
            "pcshuijing1_info":"移动场上一张防具牌，若司马徽存活，则将“防具牌”改为“装备牌”。",
            "pcxuanjian1":"玄剑",
            "pcxuanjian1_info":"你令一名角色摸一张牌并回复一点体力，若徐庶(界徐庶)存活，你摸一张牌。",
            pingcai:"评才",
            "pingcai_info":"</span><span class=\"bluetext\" style=\"color:\t#DC143C\">出牌阶段限一次</span>，你可以擦拭一个宝物上的灰尘，若擦拭成功且该宝物为<span class=\"bluetext\" style=\"color:\t #B0E0E6\">卧龙</span>，你对一名其他角色造成1点火焰伤害，若卧龙诸葛亮存活，则将“一名”改为“至多两名”;<span class=\"bluetext\" style=\"color:\t #B0E0E6\">凤雏</span>，你令至多三名角色横置其武将牌，若庞统存活，则将“三名”改为“四名”;<span class=\"bluetext\" style=\"color:\t #B0E0E6\">水镜</span>，移动场上一张防具牌，若司马徽存活，则将“防具牌”改为“装备牌”;<span class=\"bluetext\" style=\"color:\t #B0E0E6\">玄剑</span>，你令一名角色摸一张牌并回复1点体力，然后若徐庶/界徐庶存活，你摸一张牌。",
            pcpingcai:"评才",
            "pcpingcai_info":"",         
        },
    },
    intro:"手杀补全1.1.5更新说明：</br>①修复不易触发的少数BUG</br>②添加庞德公AI</br>③优化部分技能。",
    author:"Esperanto",
    diskURL:"",
    forumURL:"",
    version:"1.1.5",
},files:{"character":["pangdegong.jpg"],"card":[],"skill":[]}}};