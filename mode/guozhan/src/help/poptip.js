import { lib, game, ui, get, ai, _status } from "../../../../noname.js";

lib.poptip.addType("guozhan");

const guozhanPoptip = new Map([
	["guozhan_duilie", { name: "队列", info: "座次连续的至少两名同势力角色成为一条队列。" }],
	["guozhan_weigong", { name: "围攻", info: "一名角色的上家和下家为同势力角色、且与该角色势力不同时，该角色被围攻，称为“被围攻角色”，其上家和下家称为“围攻角色”，这些角色处于同一“围攻关系”。" }],
	["guozhan_zhenfa", { name: "阵法技", info: "在存活角色数不小于4时锁定生效的技能。拥有阵法技的角色可以发起阵法召唤，令满足该技能条件的未确定势力角色可按逆时针顺序依次明置一张武将牌。" }],
	["guozhan_zongheng", { name: "纵横", info: "一名角色对目标角色发动具有“纵横”标签的技能后，可以令其获得具有对应“纵横”效果的此技能直到其下回合结束。" }],
]);

const poptips = Array.from(guozhanPoptip.keys());
poptips.forEach(poptip => {
	lib.poptip.add({
		id: poptip,
		type: "guozhan",
		...guozhanPoptip.get(poptip),
	});
});

export default poptips;