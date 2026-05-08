import { lib, game, ui, get, ai, _status } from "noname";

export default {
	gz_jixi: "急袭",
	gz_jixi_info: `${get.poptip("guozhan_mainSkill")}，此武将牌减少半个阴阳鱼。你可以将一张“田”当作【顺手牵羊】使用。`,
	ziliang: "资粮",
	ziliang_info: `${get.poptip("guozhan_viceSkill")}，当与你势力相同的一名角色受到伤害后，你可以将一张“田”交给该角色。`,

	fake_huyuan: "护援",
	fake_huyuan_info: "①你的回合内，当一张装备牌进入一名角色的装备区后，你可以弃置与其距离为1以内的另一名角色区域里的一张牌。②结束阶段，你可以将一张装备牌置入一名角色的装备区。",
	heyi: "鹤翼",
	heyi_info: `${get.poptip("guozhan_zhenfa")}。与你处于同一${get.poptip("guozhan_duilie")}的角色视为拥有技能${get.poptip("feiying")}。`,

	gz_shengxi: "生息",
	gz_shengxi_info: "结束阶段，若你本回合未造成过伤害，你可以摸两张牌。",
	gz_shoucheng: "守成",
	gz_shoucheng_info: "当与你势力相同的一名角色于其回合外失去手牌时，若其没有手牌，则你可以令其摸一张牌。",

	yizhi: "遗志",
	yizhi_info: `${get.poptip("guozhan_viceSkill")}，此武将牌减少半个阴阳鱼。若你的主将拥有技能${get.poptip("guanxing")}，则将其描述中的X改为5；若你的主将没有技能${get.poptip("guanxing")}，则你视为拥有技能${get.poptip("guanxing")}。`,
	tianfu: "天覆",
	tianfu_info: `${get.poptip("guozhan_mainSkill")}，${get.poptip("guozhan_zhenfa")}，若当前回合角色与你处于同一${get.poptip("guozhan_duilie")}，则你视为拥有技能${get.poptip("kanpo")}。`,

	yicheng: "疑城",
	yicheng_info: "当与你势力相同的一名角色成为【杀】的目标后，你可以令该角色摸一张牌，然后弃置一张牌。",
	gz_yicheng_new: "疑城",
	gz_yicheng_new_info: "与你势力相同的角色使用【杀】指定第一个目标后或成为【杀】的目标后，你可以令其摸一张牌，然后其弃置一张牌。",

	gz_shangyi: "尚义",
	gz_shangyi_info: "出牌阶段限一次，你可以令一名其他角色观看你的手牌。若如此做，你选择一项：1.观看其手牌并可以弃置其中的一张黑色牌；2.观看其所有暗置的武将牌。",
	niaoxiang: "鸟翔",
	niaoxiang_info: `${get.poptip("guozhan_zhenfa")}，在同一个${get.poptip("guozhan_weigong")}关系中，若你是围攻角色，则你或另一名围攻角色使用【杀】指定被围攻角色为目标后，该角色需依次使用两张【闪】才能抵消。`,

	qianhuan: "千幻",
	qianhuan_bg: "幻",
	qianhuan_info: "当与你势力相同的一名角色受到伤害后，你可以将一张与你武将牌上花色均不同的牌置于你的武将牌上。当一名与你势力相同的角色成为基本牌或锦囊牌的唯一目标时，你可以移去一张“千幻”牌，取消之。",
};
