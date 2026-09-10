export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"三国名医",editable:false,content:function(config,pack){
    
},precontent:function(){
    
},config:{},help:{},package:{
    character:{
        character:{
            "jp_jiping":["male","wei",3,["jp_lieyi","jp_guyao"],[]],
            "zzj_zhangzhongjing":["male","qun",3,["zzj_caifang","zzj_zuotang"],["des:张仲景(约公元150~154年--约公元215~219年)，名机，字仲景，东汉南阳涅阳县(今河南省邓州市穰东镇张寨村)人。东汉末年著名医学家，被后人尊称为医圣。张仲景广泛收集医方，写出了传世巨著《伤寒杂病论》。它确立的辨证论治原则，是中医临床的基本原则，是中医的灵魂所在 。  在方剂学方面，《伤寒杂病论》也做出了巨大贡献，创造了很多剂型，记载了大量有效的方剂。其所确立的六经辨证的治疗原则，受到历代医学家的推崇。这是中国第一部从理论到实践、确立辨证论治法则的医学专著，是中国医学史上影响最大的著作之一，是后学者研习中医必备的经典著作，广泛受到医学生和临床大夫的重视。"]],
            "df_dongfeng":["male","qun",3,["df_zhixin","df_fushang"],["des:董奉(220年-280年)，又名董平，字君异，号拔墘，候官县董墘村(今福州市长乐区古槐镇龙田村)人，东汉建安二十五年(公元220年)生。少年学医，信奉道教。年青时，曾任候官县小吏，不久归隐，在其家村后山中，一面练功，一面行医。董奉医术高明，治病不取钱物，只要重病愈者在山中栽杏5株，轻病愈者栽杏1株。数年之后，有杏万株，郁然成林。春天杏子熟时，董奉便在树下建一草仓储杏。需要杏子的人，可用谷子自行交换。再将所得之谷赈济贫民，供给行旅。后世称颂医家\"杏林春暖\"之语，盖源于此。董奉也出行在南方一带行医。有一次到交州(今广东、广西、越南北部一带)，恰遇交州太守士燮病危，垂死已3日。董奉把3粒药丸放入病人口中，用水灌下。稍后，病人手足能动，肤色逐渐转活，半日后即能坐起，4日后能说话，不久病愈。显然这是民间传说，士燮死于公元226年，此时董奉才6、7岁。由于医术高明，人们把董奉同当时谯郡的华佗、南阳的张仲景并称为\"建安三神医\"。晚年到豫章(今江西)庐山下隐居，继续行医。吴天纪四年(280年)，董奉逝世。"]],
        },
        translate:{
            "df_dongfeng":"董奉",
            "zzj_zhangzhongjing":"张仲景",
            "jp_jiping":"吉平",
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
        "jp_guyaodamage":{
    trigger:{
        player:"phaseUseEnd",
    },
    forced:true,  
    popup:false,
    filter:function (event,player){
		return player.storage.jp_guyaocount==0&&game.hasPlayer(function(current){
				return current.hasSkill('jp_guyao1');
		});       
	},	    
	content:function(){			
		"step 0" 
		event.targets=game.filterPlayer(function(current){
				return current.hasSkill('jp_guyao1');
		});       
		"step 1" 
		player.chooseControl().set('choiceList',['失去一点体力','令'+get.translation(event.targets[0])+'回复一点体力']).set('ai',function(){
        if(player.hp<2) return 1;          
            return 0;
        });        
        "step 2" 
        if(result.index==0){
            player.loseHp();           
        }
        else{
            event.targets[0].recover();                     
		}				
	},
        },
        "jp_guyaocount":{
         trigger:{
        player:"useCardToPlayered",
    },
    forced:true,  
    popup:false,    
    marktext:"安",    
    init:function (player){
		player.storage.jp_guyaocount=0;
	},
    intro:{
       name:"蛊药",
       content:"你这回合安全了",
    },
    filter:function (event,player){
		return event.card&&get.suit(event.card)==player.storage.jp_guyao;
	},
	content:function(){				
		player.storage.jp_guyaocount++;		
		player.markSkill("jp_guyaocount");
		player.update();
	},
        },
        "jp_guyao2":{
        trigger:{
            global:"phaseEnd",
        }, 
        forced:true,
        popup:false,
        content:function (){
           player.storage.jp_guyao=[]; 
           player.storage.jp_guyaocount=0;
        },        
        },      
        "jp_guyao1":{},
        "jp_guyao":{             
                trigger:{
                    player:"phaseUseBegin",
                },                       
                init:function (player){
                   player.storage.jp_guyao=[]; 
                }, 
                direct:true,
                group:["jp_guyao2"],                   
                filter:function (event,player){               
                   return game.hasPlayer(function(current){
						return current.countCards('h');
					});           
                },
                content:function (){
             'step 0'
		player.chooseTarget('蛊药',1,lib.translate.jp_guyao_info,function(card,player,target){
            return player!=target&&target.countCards('h');
        }).set('ai',function(target){			
            return -get.attitude(_status.event.player,target);            
        });
		    'step 1'
		if(result.bool){ 
            result.targets[0].addTempSkill('jp_guyao1');
            player.discardPlayerCard(result.targets[0],'h',get.prompt('jp_guyao')).set('ai',function(button){            
            if(get.position(button.link)=='h'){               
                return Math.random();
            }			
        }).set('logSkill',['jp_guyao',result.targets[0]]).set('att',get.attitude(player,result.targets[0])<=0);
	    }
			else{
                event.finish(); 
            } 
            'step 2'
        if(result.bool&&result.links&&result.links.length){
			player.logSkill('jp_guyao');
			player.storage.jp_guyao=get.suit(result.links[0]);         
			player.addTempSkill("jp_guyaocount");	
			player.addTempSkill("jp_guyaodamage");		        
		}   
            else{
               event.finish();
            }            		                                                                
    },
            },
            "jp_lieyi2":{},
            "jp_lieyi":{               
                trigger:{
                    player:"useCardToPlayered",
                },
                group:"jp_lieyi_source",                
                filter:function (event,player){
          return event.card&&event.card.name=="tao"&&player!=event.target&&event.target.hasSkill("jp_lieyi2");
      },
            subSkill:{
                "source":{
                   trigger:{
                    player:"damageEnd",
                },
                forced:true,
                popup:false,
                filter:function (event,player){
          return event.source;
      },
                content:function (){
             trigger.source.addSkill("jp_lieyi2");
    }, 
                },
                },
                content:function (){
        trigger.cancel();
        trigger.target.loseHp();
        trigger.target.draw();
    },
            },
        "zzj_zuotang":{
				global:'zzj_zuotang2',				
			},
			"zzj_zuotang2":{				
				enable:'phaseUse',
				filter:function (event,player){
					if(player.hasSkill('zzj_zuotang')) return false;
					if(player.hasSkill('zzj_zuotang3')) return false;
					return player.countCards('h')&&game.hasPlayer(function(current){
						return current.hasSkill('zzj_zuotang');
					});
				},
				direct:true,
				delay:false,
				filterCard:true,
				discard:false,
				lose:false,
				position:'h',
				selectCard:[1,Infinity],
				prompt:function(){
					var player=_status.event.player;
					var list=game.filterPlayer(function(current){
						return current.hasSkill('zzj_zuotang');
					});
					var str='将任意张牌交给'+get.translation(list);
					if(list.length>1) str+='中的一人';
					return str;
				},
				check:function(card){					
					return 8-get.value(card);
				},
				content:function(){
					"step 0"
					var targets=game.filterPlayer(function(current){
						return current.hasSkill('zzj_zuotang');
					});
					if(targets.length==1){
						event.target=targets[0];
						event.goto(2);
					}
					else if(targets.length>0){
						player.chooseTarget(true,'选择【坐堂】的目标',function(card,player,target){
							return _status.event.list.contains(target);
						}).set('list',targets).set('ai',function(target){
							var player=_status.event.player;
							return get.attitude(player,target);
						});
					}
					else{
						event.finish();
					}
					"step 1"
					if(result.bool&&result.targets.length){
						event.target=result.targets[0];
					}
					else{
						event.finish();
					}
					"step 2"
					if(event.target){
					    event.suits=[];
					    event.suits2=[];
					    player.$give(cards,event.target);
					    event.target.gain(cards,player);
					    game.log(event.target,'获得了'+get.translation(player)+'的',cards);          
						player.logSkill('zzj_zuotang',event.target);
						player.addTempSkill('zzj_zuotang3','phaseUseEnd');											
						  for(var i=0;i<cards.length;i++){
							event.suits.add(get.suit(cards[i]));							
						  }																		
					}					
					"step 3"			             
            event.target.chooseCard('h',[1,Infinity],'是否交给'+get.translation(player)+'任意张手牌？',true).ai=function(card){
           if(get.attitude(player,event.target)>0) return 10-get.value(card);                    
           return -get.value(card);         
       };                                         
			"step 4"    
		if(result.bool){          
           event.target.line(player,'green'); 		        
           event.target.$give(result.cards,player);
           player.gain(result.cards,event.target);
           for(var i=0;i<result.cards.length;i++){
			 event.suits2.add(get.suit(result.cards[i]));
		   }
		   if((event.suits.length==4)||(event.suits2.length==4)||((event.suits.length+event.suits2.length)==4)){
			 player.recover();
		   }								     
           game.log(player,'获得了'+get.translation(event.target)+'的',result.cards);          
		}
		else{
		   event.finish();
		}						
				},
				ai:{
					order:6,
					threaten:1.5,
					result:{
						player:function(player,target){
							var target=game.findPlayer(function(current){
								return current.hasSkill('zzj_zuotang');
							});
							if(target){
								return get.attitude(player,target);
							}
						},
					},
				},
			},
		"zzj_zuotang3":{},
        "zzj_caifangdraw":{
		trigger:{player:'drawBegin'},							
        forced:true,      
        filter:function (event,player){							
            return event.num>0;                          
		},  
        content:function (){ 
            "step 0"           
			event.cards=get.cards(trigger.num);
			game.cardsGotoOrdering(event.cards);
			player.showCards(event.cards); 
			trigger.changeToZero();
			player.gain(event.cards);
			player.$gain2(event.cards);		
			game.log(player,'重铸后获得了',result.cards);          	
			"step 1" 	
        	event.num=0;
			for(var i=0;i<event.cards.length;i++){
				if(get.suit(event.cards[i])=='club'){
					event.num++;					
				}
			}
			"step 2"
			if(event.num>0){
			    if(player.isDamaged()){
				player.chooseControl().set('choiceList',['回复一点体力','摸一张牌']).set('ai',function(){
        if(player.hp<3) return 0;          
            return 1;
        });
        }
        else{
            player.draw();    
            player.removeSkill("zzj_caifangdraw"); 
            event.finish();       
        }
			}	
			else{
			    player.removeSkill("zzj_caifangdraw");
			    event.finish(); 
			}
		"step 3" 
        if(result.index==0){
            player.recover();
            player.removeSkill("zzj_caifangdraw");
            event.finish(); 
        }
        else{
            player.draw();    
            player.removeSkill("zzj_caifangdraw");  
            event.finish();       
		}					  							         					        
 	  	},	
	},
            "zzj_caifang":{
                enable:'phaseUse',
                usable:1,
				filter:function(event,player){
					return player.countCards('he',{suit:'club'})>0;
				},
				filterCard:function(card){
					return get.suit(card)=='club';
				},
				selectCard:[1,Infinity],
				position:"he",
				check:function(card){
					return 7-get.useful(card);
				},
				content:function(){
			    	player.addSkill("zzj_caifangdraw");
					player.draw(cards.length);
				},
				discard:false,
				visible:true,
				loseTo:'discardPile',
				prompt:'将任张梅花牌置入弃牌堆并摸等量张牌',
				delay:0.5,
				prepare:function(cards,player){
					player.$throw(cards,1000);
					game.log(player,'将',cards,'置入了弃牌堆');
				},
				ai:{
					basic:{
						order:1
					},
					result:{
						player:1,
					},
				},
            },
        "df_fushang":{             
                trigger:{
                    global:"damage",
                },       
                check:function (event,player){                    
                    return get.attitude(player,event.player)>0;
                },                     
                filter:function (event,player){
                for(var i=0;i<player.storage.df_zhixin.length;i++){
                   return event.card&&event.card.isCard&&event.player.hp<=0&&player.storage.df_zhixin.length>0&&get.suit(player.storage.df_zhixin[i])==get.suit(trigger.card); 
                }           
      },
                content:function (){
        'step 0' 
        player.chooseCardButton(player.storage.df_zhixin,1,'选择使用与'+get.translation(trigger.card)+'花色相同的牌').set('filterButton',function(button){           
             return get.suit(button.link)==get.suit(trigger.card);
         }).set('ai',function(button){
             return get.value(button.link);
         });                                     
            'step 1'
          if(result.bool){                             
              player.$throw(result.links);
			  player.storage.df_zhixin.remove(result.links[0]);
		      game.cardsDiscard(result.links[0]);
			  player.syncStorage('df_zhixin')
              player.useCard({name:'tao',isCard:true},trigger.player);
              trigger.player.chooseCard('交给'+get.translation(player)+'一张牌当作“杏”','h',function(card){
               return true;
            }).ai=function(card){			   
               return 6-get.value(card);
            };                                 
        }
         else{		 
			 event.finish();
		 }
		'step 2'
		if(result.cards&&result.cards.length){
            trigger.player.lose(result.cards);         		     				
			//player.storage.df_zhixin=result.cards.slice(0);		     		
		    player.storage.df_zhixin=player.storage.df_zhixin.concat(result.cards);
			player.syncStorage('df_zhixin');
	     	player.update();	  	   	  
		}					                                                                  
    },
            },
             "df_zhixin2":{
                trigger:{
                    player:"phaseDrawBegin2",
                },
                forced:true,
                filter:function (event,player){
                    return !event.numFixed;
                },
                content:function(){
                for(var i=0;i<player.storage.df_zhixin.length;i++){
                   if(get.color(player.storage.df_zhixin[i])=='red'){
                    trigger.num++;
                   }
                }    
                },
                ai:{
                    threaten:1.3,
                },
            },
            "df_zhixin":{
                trigger:{
                    player:"phaseBegin",
                },
                forced:true,
                init:function (player){
                    if(!player.storage.df_zhixin) player.storage.df_zhixin=[];
                },
                marktext:"杏",
                intro:{
                    content:"cards",
                },
                group:"df_zhixin2",
                filter:function (event,player){
          return player.countCards('h');
      },
                content:function (){
        'step 0'       
        player.draw();        
        'step 1'
        player.chooseCard('选择一张手牌当作“杏”','h',true,function(card){
               return true;
            }).ai=function(card){               
               return 6-get.value(card);
            };                                 
         'step 2'
        if(result.cards&&result.cards.length){
            player.storage.df_zhixin=player.storage.df_zhixin.concat(result.cards);
			player.syncStorage('df_zhixin');
			player.markSkill('df_zhixin');
			player.lose(result.cards,ui.special,'toStorage');
			player.$give(result.cards,player,false);             
        }                                
    },
            },
        },                
        translate:{
            "df_fushang":"扶伤",
            "df_fushang_info":"当一名角色进入濒死状态时，你可以将与对其造成伤害的该牌同花色的‘杏’当【桃】对其使用，然后其可以将一张牌当“杏”置于你的武将牌上",
            "df_zhixin":"植杏",
            "df_zhixin_info":"锁定技 回合开始时，你摸一张牌，然后将一张牌置于你的武将牌上，成为‘杏’；摸牌阶段，若你有红色的“杏”，你多摸一张牌",
            "zzj_zuotang2":"坐堂",
            "zzj_zuotang2_info":"其他角色的出牌阶段限一次 该角色可以正面朝上交给你任意张手牌，然后你正面朝上交给其任意张手牌，若你与其正面朝上的牌中有四种花色 则其可以回复1点体力",            
            "zzj_zuotang":"坐堂",
            "zzj_zuotang_info":"其他角色的出牌阶段限一次 该角色可以正面朝上交给你任意张手牌，然后你正面朝上交给其任意张手牌，若你与其正面朝上的牌中有四种花色 则其可以回复1点体力",
            "zzj_caifang":"採方",
            "zzj_caifang_info":"出牌阶段限一次 你可以重铸你的任意张梅花牌，然后你展示以此法获得的牌，若其中有梅花牌 你可以摸一张牌或回复1点体力",
            "jp_guyao":"蛊药",
            "jp_guyao_info":"出牌阶段开始时，你可弃置一名其他角色的一张手牌，然后出牌阶段结束时，若你本回合未使用过与此牌花色相同的牌，你选择一项：失去一点体力；令其回复一点体力",
            "jp_lieyi":"烈医",
            "jp_lieyi_info":"锁定技，当你对其他角色使用桃时，若其曾对你造成过伤害，你改为令其失去一点体力，然后其摸一张牌",
        },
    },
    intro:"",
    author:"技能设计：萨克巨人<li>编写代码：玉蝴蝶(QQ:764235332)",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":["jp_jiping.jpg"],"card":[],"skill":[]}}};
