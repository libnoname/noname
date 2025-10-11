import { lib, game, ui, get, ai, _status } from "../../../../../../noname.js";

export default {
	gz_hengjiang: "横江",
	gz_hengjiang_info: "当你受到伤害后，你可以令当前回合角色本回合的手牌上限-X（X为其装备区牌数且至少为1）。然后其本回合弃牌阶段结束时，若其未于此阶段弃牌，则你将手牌摸至体力上限。",

	gz_guixiu: "闺秀",
	gz_guixiu_info: "当你明置此武将牌时，你可以摸两张牌；当你移除此武将牌时，你可以回复1点体力。",
	gz_cunsi: "存嗣",
	gz_cunsi_info: `出牌阶段，你可以移除此武将牌并选择一名角色，然后其获得技能${get.poptip("gzyongjue")}，若你选择的目标角色不是自己，则其摸两张牌。`,

	yingyang: "鹰扬",
	yingyang_info: "当你的拼点牌亮出后，你可以令此牌的点数+3或-3（至多为K，至少为1）。",
	baka_hunshang: "魂殇",
	baka_hunshang_info: `${get.poptip("guozhan_viceSkill")}，此武将牌减少半个阴阳鱼；准备阶段，若你的体力值不大于1，则你获得${get.poptip("baka_yingzi")}和${get.poptip("baka_yinghun")}直到回合结束。`,
	baka_yinghun: "英魂",
	baka_yinghun_info: "准备阶段，你可令一名其他角色执行一项：摸X张牌，然后弃置一张牌；或摸一张牌，然后弃置X张牌（X为你已损失的体力值）。",
	baka_yingzi: "英姿",
	baka_yingzi_info: "锁定技，摸牌阶段，你多摸一张牌；你的手牌上限+X（X为你已损失的体力值）。",

	fake_fenming: "奋命",
	fake_fenming_info: "出牌阶段限一次，若你处于横置状态，你可以弃置所有处于横置状态的角色的各一张牌。",

	fake_baoling: "暴凌",
	fake_baoling_info: `${get.poptip("guozhan_mainSkill")}，锁定技，出牌阶段结束时，若你有副将，则你移除副将，加3点体力上限并回复3点体力，然后获得${get.poptip("fake_benghuai")}。`,
	fake_benghuai: "崩坏",
	fake_benghuai_info: `结束阶段，若你的体力值不为全场最低，则你选择一项：①失去1点体力；②减1点体力上限；③${get.poptip("rule_beishui")}：执行一个额外的摸牌阶段。`,

	gz_fengshi: "锋矢",
	gz_fengshi_sha: "锋矢",
	gz_fengshi_info: `${get.poptip("guozhan_zhenfa")}，在一个${get.poptip("guozhan_weigong")}关系中，若你是围攻角色，则你或另一名围攻角色使用【杀】指定被围攻角色为目标后，可令该角色弃置装备区内的一张牌。`,
};
