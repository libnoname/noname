import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"马腾",content:function(config,pack){
},precontent:function(){
},config:{},help:{},package:{
    character:{
        character:{
            mb_mateng:['male','qun',4,['mashu','mbxiongzheng','mbluannian'],['zhu']],
        },
        translate: {
			mb_mateng: "马腾",
        },
    },
    card:{
        card:{},
        translate:{},
        list:[],
    },
    skill:{
        skill:{
    mbxiongzheng:{
	audio:'twxiongzheng',
	onremove:true,
	trigger:{global:'roundStart'},
	direct:true,
	content:function(){
		'step 0'
		var target=player.storage.mbxiongzheng_target;
		delete player.storage.mbxiongzheng_target;
		if(!target){event.goto(4);return;}
		event.target=target;
		var list=[],list2=[];
		var history=target.actionHistory;
		if(history.length<2){event.goto(4);return;}
		for(var i=history.length-2;i>=0;i--){
			for(var evt of history[i].damage){
				if(evt.source) list.add(evt.source);
			}
			if(history[i].isRound) break;
		}
		var list2=game.filterPlayer(i=>i!=player).removeArray(list);
		event.list=list; event.list2=list2;
		var choiceList=[
			'视为对任意名上一轮未对'+get.translation(target)+'造成过伤害的角色使用一张【杀】',
			'令任意名上一轮对'+get.translation(target)+'造成过伤害的角色摸两张牌'
		];
		var choices=[];
		if(list2.length){
			choices.push('选项一');
			choiceList[0]+='（'+get.translation(list2)+'）';
		}
		else choiceList[0]='<span style="opacity:0.5">'+choiceList[0]+'</span>';
		if(list.length){
			choices.push('选项二');
			choiceList[1]+='（'+get.translation(list)+'）';
		}
		else choiceList[1]='<span style="opacity:0.5">'+choiceList[1]+'</span>';
		choices.push('cancel2');
		player.chooseControl(choices).set('prompt','雄争：是否选择一项？').set('choiceList',choiceList).set('ai',function(){
			var player=_status.event.player;
			var list=_status.event.getParent().list,list2=_status.event.getParent().list2;
			var eff=list.map(target=>{
				if(target==player) return 0;
				return get.effect(target,{name:'sha'},player,player);
			}).reduce((p,c)=>p+c,0),eff2=list2.map(target=>get.effect(target,{name:'wuzhong'},player,player)).reduce((p,c)=>p+c,0);
			if(_status.event.controls.contains('选项二')&&eff2>eff) return '选项二';
			if(eff>0) return 0;
			return 'cancel2';
		});
		'step 1'
		if(result.control=='选项一'){
			event.bool=true;
			if(event.list2.length) player.chooseTarget('雄争：请选择任意名满足条件的角色，你视为依次对这些角色使用一张杀',[1,Infinity],true,function(card,player,target){
				return player.canUse('sha',target,false,false)&&_status.event.getParent().list2.contains(target);
			}).set('ai',function(target){
				var player=_status.event.player;
				return get.effect(target,{name:'sha'},player,player);
			});
			else event.finish();
		}
		else if(result.control=='选项二'){
			event.bool=false;
			if(event.list.length) player.chooseTarget('雄争：请选择任意名满足条件的角色，这些角色摸两张牌',[1,Infinity],true,function(card,player,target){
				return _status.event.getParent().list.contains(target);
			}).set('ai',function(target){
				var player=_status.event.player;
				return get.effect(target,{name:'wuzhong'},player,player);
			});
			else event.finish();
		}
		else event.goto(3);
		'step 2'
		result.targets.sortBySeat();
		player.logSkill('mbxiongzheng',result.targets);
		if(event.bool){
			for(var i of result.targets) player.useCard({name:'sha',isCard:true},i,false);
		}
		else game.asyncDraw(result.targets,2);
		'step 3'
		if(!game.hasPlayer(function(current){
			return !player.getStorage('mbxiongzheng').contains(current);
		})) event.finish();
		else game.delayx();
		'step 4'
		player.chooseTarget(get.prompt('mbxiongzheng'),'选择一名未选择过的角色，称为“雄争”角色',function(card,player,target){
			return !player.getStorage('mbxiongzheng').contains(target);
		}).set('ai',function(target){
			var player=_status.event.player,att=get.attitude(player,target);
			if(game.roundNumber<=1&&player.hasUnknown()) return 0;
			return -att;
		});
		'step 5'
		if(result.bool){
			var target=result.targets[0];
			player.logSkill('mbxiongzheng',target);
			player.markAuto('mbxiongzheng',[target]);
			player.storage.mbxiongzheng_target=target;
			player.addTempSkill('mbxiongzheng_mark','roundStart');
			target.addTempSkill('mbxiongzheng_threaten','roundStart');
			game.delayx();
		}
	},
	subSkill:{
		mark:{
			intro:{
				content:'$参与了〖雄争〗的争斗',
				onunmark:true,
			},
			charlotte:true,
			onremove:true,
			trigger:{global:'damage'},
			firstDo:true,
			direct:true,
			filter:function(event,player){
				return event.player==player.storage.mbxiongzheng_target&&get.itemtype(event.source)=='player';
			},
			content:function(){
				player.markAuto('mbxiongzheng_mark',[trigger.source]);
			},
		},
		threaten:{
			mark:true,
			intro:{content:'本轮〖雄争〗目标'},
			ai:{threaten:10},
		},
	},
},
    mbluannian:{
	audio:'twluannian',
	global:'mbluannian_global',
	unique:true,
	zhuSkill:true,
	subSkill:{
		global:{
			audio:'mbluannian',
			enable:'phaseUse',
			usable:1,
			forceaudio:true,
			onChooseToUse:function(event){
				if(!game.online){
					var num=0;  
					game.countPlayer2(current=>{
					var history=current.actionHistory;
						for(var i=history.length-1;i>=0;i--){
							for(var evt of history[i].useSkill){
								if(evt.skill=='mbluannian_global') num++;
							}
							if(history[i].isRound) break;
						}
					});
					if(num==0) num=1; 
					event.set('mbluannian_num',num);
				}
			},
			filter:function(event,player){
				if(!event.mbluannian_num) return false;
				return player.group=='qun'&&player.countCards('he')>=event.mbluannian_num&&game.hasPlayer(function(current){
					var target=current.storage.mbxiongzheng_target;
					return target&&target.isIn()&&current!=player&&current.hasZhuSkill('mbluannian',player)
				})
			},
			filterCard:true,
			position:'he',
			prompt:function(){
				var player=_status.event.player;
				var num=_status.event.mbluannian_num
				var list=game.filterPlayer(function(current){
					return current.hasZhuSkill('mbluannian',player);
				}).map(i=>i.storage.mbxiongzheng_target).sortBySeat();
				return '弃置'+get.cnNumber(num)+'张牌，对'+get.translation(list)+(list.length>1?'中的一人':'')+'造成1点伤害';
			},
			selectCard:function(){
				return _status.event.mbluannian_num;
			},
			complexSelect:true,
			complexCard:true,
			filterTarget:function(card,player,target){
				return game.filterPlayer(function(current){
					return current.hasZhuSkill('mbluannian',player);
				}).map(i=>i.storage.mbxiongzheng_target).contains(target);
			},
			selectTarget:function(){
				return game.filterPlayer(function(current){
					return current.hasZhuSkill('mbluannian',_status.event.player);
				}).map(i=>i.storage.mbxiongzheng_target).filter(i=>i&&i.isIn()).length>1?1:-1;
			},
			check:function(card){
				return 6-get.value(card);
			},
			content:function(){
				target.damage();
			},
			ai:{
				order:7,
				result:{
					target:function(player,target){
						return get.damageEffect(target,player,target);
					}
				},
				expose:0.25,
			},
		},
	},
},
},
                translate:{
			mbxiongzheng:'雄争',
			mbxiongzheng_info:'每名角色限一次，每轮开始时,你可选择一名角色。然后本轮结束时，你可选择一项: 1.视为对任意名本轮未对其造成过伤害的其他角色各使用一张无距离限制的普通【杀】；2.今任意名本轮对其造成过伤害的角色各摸两张牌。',
			mbluannian:'乱年',
			mbluannian_info:'主公技,其他群势力角色出牌阶段限一次，其可弃置X张牌，对“雄争”角色造成1点伤害（X为此技能本轮发动次数）。',
        },
    },
    intro:"",
    author:"v",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":[],"card":[],"skill":[]}}};
