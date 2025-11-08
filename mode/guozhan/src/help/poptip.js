import { lib, game, ui, get, ai, _status } from "../../../../noname.js";

lib.poptip.addType("guozhan");

const guozhanPoptip = new Map([
	["guozhan_mainSkill", { name: "主将技", info: "此武将牌为主武将时方能使用的技能。" }],
	["guozhan_viceSkill", { name: "副将技", info: "此武将牌为副武将时才能使用的技能。" }],
	["guozhan_duilie", { name: "队列", info: "座次连续的至少两名同势力角色成为一条队列。" }],
	["guozhan_weigong", { name: "围攻", info: "一名角色的上家和下家为同势力角色、且与该角色势力不同时，该角色被围攻，称为“被围攻角色”，其上家和下家称为“围攻角色”，这些角色处于同一“围攻关系”。" }],
	["guozhan_zhenfa", { name: "阵法技", info: "在存活角色数不小于4时锁定生效的技能。拥有阵法技的角色可以发起阵法召唤，令满足该技能条件的未确定势力角色可按逆时针顺序依次明置一张武将牌。" }],
	["guozhan_zongheng", { name: "纵横", info: "一名角色对目标角色发动具有“纵横”标签的技能后，可以令其获得具有对应“纵横”效果的此技能直到其下回合结束。" }],
	["guozhan_transCharacter", { name: "易位", info: "发起武将易位后，若目标角色选择执行，则易位双方交换对应武将。<br><li>一名角色只能对相同势力的其他角色发起武将易位。<br><li>易位武将不会影响你的体力上限，也不会获得珠联壁合、阴阳鱼标记。<br><li>易位武将不会移除武将牌上的牌，如“田”等，也不会影响技能失效状态。"}]
]);

const poptips = Array.from(guozhanPoptip.keys());
poptips.forEach(poptip => {
	// @ts-expect-error 祖宗之法就是这么做的
	lib.poptip.add({
		id: poptip,
		type: "guozhan",
		...guozhanPoptip.get(poptip),
	});
});

export default poptips;