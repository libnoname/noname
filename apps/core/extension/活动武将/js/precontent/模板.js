import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

const packs = function () {
    
};

export default packs;

/*
模板
//简易武将包模板(不可关闭)
game.addCharacterPack({
character:{
},
characterIntro:{
},
skill:{
},
translate:{
},
},'武将包中文名');
//简易卡包模板(不可关闭)
game.addCardPack({
card:{
},
skill:{
},
translate:{
},
list:[]
},'卡包中文名');
//复杂武将包模板(可关闭)
game.import('character',function(){
const 武将包英文名={
name:'武将包英文名',
connect:true,
characterSort:{
武将包英文名:{
},
},
character:{
},
skill:{
},
translate:{
},
};
for(const i in 武将包英文名.character){
武将包英文名.character[i][4].push('ext:活动武将/image/character/'+i+'.jpg');
}
lib.config.all.sgscharacters.push('武将包英文名');
lib.translate['武将包英文名_character_config']='武将包中文名';
return 武将包英文名;
});
//复杂卡包模板(可关闭)
game.import('card',function(){
const 卡包英文名={
name:'卡包英文名',
connect:true,
card:{
},
skill:{
},
translate:{
},
list:[],
};
lib.config.all.cards.push('卡包英文名');
if(!lib.config.cards.includes('卡包英文名')) lib.config.cards.remove('卡包英文名');
lib.translate['卡包英文名_card_config']='卡包中文名';
return 卡包英文名;
});
*/