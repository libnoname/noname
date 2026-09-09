import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function(lib,game,ui,get,ai,_status){return {name:"长衫",content:function(config,pack){
    
},precontent:function(){
    
},config:{},help:{},package:{
    character:{
        character:{
        	"cs_cschangshan":["male","qun",25,["cs_csjima","cs_cstianlao","cs_csbailu","cs_csneifa","cs_csduanxiu"],["boss","bossallowed","des:等我把你们都鲨了。"]],
        },
        translate:{
        	"cs_cschangshan":"长衫",
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
    cs_csjima:{
	trigger:{
	global:['gameStart','roundStart'],
	player:'enterGame',
	},
	forced:true,
	filter:function(event,player){
	if(player.isDisabled(3)&&player.isDisabled(4)) return false;
	return true;
	},
	content:function(){
	var chat=['钱财与马不可兼得','上了这条路，弃马又何妨？'];
	player.say(chat.randomGet());
	player.disableEquip(3);
	player.disableEquip(4);
	},
	group:'cs_csjima_ma',
	subSkill:{
	ma:{
	trigger:{
	player:'gainEnd',
	},
	forced:true,
	filter:function(event,player){
	if(!event.cards) return false;
	for(var i=0;i<event.cards.length;i++){
	if(get.type(event.cards[i])=='equip'&&['equip3','equip4'].contains(get.subtype(event.cards[i]))) return true;
	}
	},
	content:function(){
	var card=[];
	for(var i=0;i<trigger.cards.length;i++){
	if(get.type(trigger.cards[i])=='equip'&&['equip3','equip4'].contains(get.subtype(trigger.cards[i]))) card.push(trigger.cards[i]);
	}
	player.discard(card);
	player.recover(card.length);
	var chat=['钱财与马不可兼得','都当策划了，要马干什么？'];
	player.say(chat.randomGet());
	},
	},
	},
	},
	cs_cstianlao:{
	trigger:{
	player:'phaseBegin',
	global:'gameStart',
	},
	intro:{
	mark:function(dialog,content,player){
	if(!player.storage.cs_cstianlao) return dialog.add("暂无【天牢令】");
	if(player.isUnderControl(true)){
	dialog.addText('【天牢令】:'+get.translation(player.storage.cs_cstianlao));
	}
	else{
	dialog.addText('已记录'+player.storage.cs_cstianlao.length+'种【天牢令】');
	};
	},
	},
	forced:true,
	content:function(){
	'step 0'
	var chat=['bug？冷处理，糊弄两下就好了','舆论反复，糊弄敷衍！'];
	player.say(chat.randomGet());
	var list=[];
	for(var i=0;i<lib.inpile.length;i++){
	if(!list.contains(get.type(lib.inpile[i],'trick'))) list.add(get.type(lib.inpile[i],'trick'));
	}
	player.chooseControl(list).set('prompt', '请选择一种类型的牌作为【天牢令】').set('ai', function () {
	var rand=Math.random();
	if(rand<=0.2) return 'equip';
	else if(rand<=0.5) return 'trick';
	else if(rand<=0.9) return 'basic';
	else return list.randomGet();
	});
	'step 1'
	if(result.control){
	player.storage.cs_cstianlao=result.control;
	player.markSkill(event.name);
	}
	},
	global:'cs_cstianlao_use',
	subSkill:{
	use:{
	trigger:{
	player:'useCard',
	},
	usable:3,
	forced:true,
	filter:function(event,player){
	return game.findPlayer(function (current) {
	if(current.storage.cs_cstianlao&&current.storage.cs_cstianlao==get.type(event.card,'trick')) return true;
	});
	},
	content:function(){
	'step 0'
	game.findPlayer(function (current) {
	if(current.storage.cs_cstianlao&&current.storage.cs_cstianlao==get.type(trigger.card,'trick')){
	current.addMark('cs_csbailu');
	player.draw();
	}
	});
	'step 1'
	game.delay();
	event.trigger('cs_csbailu');
	},
	},
	},
	},
	cs_csbailu:{
	trigger:{
	global:'cs_csbailu',
	},
	filter:function(event,player){
	return player.countMark('cs_csbailu')>=7;
	},
	intro:{
	content:"mark",
	name:"天",
	},
	forced:true,
	content:function(){
	'step 0'
	var chat=['妈的，关老子屁事！','看我把你们都鲨了!'];
	player.say(chat.randomGet());
	player.removeMark('cs_csbailu',Infinity);
	player.loseHp(5);
	player.chooseTarget(true,get.prompt('cs_csbailu'),'令一名其他角色弃置所有牌',function(card,player,target){
	return target!=player;
	}).set('ai',function(target){
	var player=_status.event.player;
	if(get.attitude(player,target)<0) return get.attitude(player,target)*target.countCards('he')<0;
	});
	'step 1'
	if(result.targets){
	result.targets[0].discard(result.targets[0].getCards('he'));
	for(var i=0;i<game.players.length;i++){
	game.players[i].addTempSkill('cs_csbailu_baiban');
	}
	}
	else event.finish();
	'step 2'
	for(var i=0;i<game.players.length;i++){
	if(game.players[i]!=player) game.players[i].damage()._triggered=null;
	}
	'step 3'
	for(var i=0;i<game.players.length;i++){
	game.players[i].removeSkill('cs_csbailu_baiban');
	}
	},
	subSkill:{
	baiban:{
	init:function(player,skill){
	player.addSkillBlocker(skill);
	},
	onremove:function(player,skill){
	player.removeSkillBlocker(skill);
	},
	charlotte:true,
	skillBlocker:function(skill,player){
	return !lib.skill[skill].charlotte;
	},
	mark:true,
	intro:{
	content:function(storage,player,skill){
	var list=player.getSkills(null,false,false).filter(function(i){
	return lib.skill.baiban.skillBlocker(i,player);
	});
	if(list.length) return '失效技能：'+get.translation(list);
	return '无失效技能';
	},
	},
	},
	},
	},
	cs_csneifa:{
	trigger:{
	player:'phaseUseBegin',
	},
	filter:function(event,player){
	return player.countCards('he')>0;
	},
	direct:true,
	content:function(){
	'step 0'
	player.chooseCardTarget({
	filterCard:true,
	selectCard:[1,Infinity],
	position:'he',
	selectTarget:2,
	filterTarget:function(card,player,target){
	return player!=target;
	},
	ai1:function(card){
	return 6-get.value(card);
	},
	ai2:function(target){
	var att=get.attitude(_status.event.player,target);
	if(ui.selected.targets){
	return att*target.countCards('h',{name:'sha'})<=0;
	}
	else{
	return get.effect(target,{name:'sha'},ui.selected.targets[0],target);
	}
	},
	prompt:'请选择要送人的卡牌',
	targetprompt:['获得者','被杀者']
	});
	'step 1'
	if(result.cards&&result.targets){
	player.logSkill(event.name,result.targets);
	var chat=['我游卡阴兵百万，这小小玩家要翻了天不成？','孝子阴兵，助我洗地！'];
	player.say(chat.randomGet());
	event.cards=result.cards;
	event.targets=result.targets;
	event.num=result.cards.length;
	event.targets[0].gain(result.cards,player,'giveAuto');
	}
	else event.finish();
	'step 2'
	var card=event.targets[0].getCards('h','sha')[0];
	if(card&&event.targets[1].isAlive()){
	event.targets[0].useCard(card,event.targets[1]);
	}
	else{
	if(event.num>0){
	event.targets[0].loseHp(event.num);
	}
	event.finish();
	}
	'step 3'
	event.num--;
	if(event.num>0) event.goto(2);
	else event.finish();
	},
	},
	cs_csduanxiu:{
	trigger:{
	player:'damageBefore',
	},
	forced:true,
	content:function(){
	trigger.cancel();
	if(player.countCards('he')) player.discard(player.getCards('he').randomGet());
	else player.loseHp();
	var chat=['长衫关我短袖什么事？','敢忤逆我，你怕是不知道真正的代价！'];
	player.say(chat.randomGet());
	},
	mod:{
	targetEnabled:function(card,player,target,now){
	if(get.type(card)=='delay') return false;
	},
	},
	},
        },
        translate:{
    "cs_csjima":"祭马",
	"cs_csjima_info":"锁定技，你进入游戏时废除坐骑栏；你获得坐骑牌后，你弃置此牌并回复一点体力。",
	"cs_cstianlao":"天牢",
	"cs_cstianlao_info":"锁定技：游戏开始时或你的回合开始阶段，你记录一种牌的类型（仅你可见）称之为【天牢令】，直到你的下个回合开始，当有角色使用此类型的牌时，其摸一张牌（每人每回合限三次），然后你获得一个「天」标记。",
	"cs_csbailu":"败露",
	"cs_csbailu_info":"锁定技，当你的「天」标记达到7个及以上后，你弃置所有此标记并失去5点体力，然后你令一名其他角色弃置所有牌且对除你以外的所有角色造成一点伤害。(伤害结算前，所有角色技能失效)",
	"cs_csneifa":"内伐",
	"cs_csneifa_info":"出牌阶段开始时，你可以交给一名其他角色任意张牌，令其对另一名角色依次随机使用手牌中等量的【杀】；每少使用一张【杀】，该角色失去一点体力。",
	"cs_csduanxiu":"短袖",
	"cs_csduanxiu_info":"锁定技，你受到伤害前防止之，然后你随机弃置一张牌，若你没有牌则你失去一点体力；你不能成为延时锦囊牌的目标。",
        },
        },
    intro:"",
    author:"清瑶",
    diskURL:"",
    forumURL:"",
    version:"1.0",
},files:{"character":[],"card":[],"skill":[]}}};