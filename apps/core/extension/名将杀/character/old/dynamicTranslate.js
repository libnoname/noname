import { lib, game, ui, get, ai, _status } from "noname";
const dynamicTranslates = {
    mjsoldpingyanouzhe(player, skill) {
        if (player.storage[skill]) return "当你打出牌后，令一名其他角色添加1张此牌的复制。";
        return "当你打出牌后，弃置1张牌；当你失去最后的手牌后，添加你当前回合弃置牌的复制，并且将此技能改为“当你打出牌后，令一名其他角色添加1张此牌的复制”。";
    },
    mjsoldneimoufazhi(player, skill) {
    	const num = 1 + (player.storage[skill] || 0);
        return `${get.poptip("rule_mjs_yingzhan")}，你随机弃置目标${num}张手牌或装备牌，若你未受到此杀伤害，令此技能可以弃牌的数量+1，否则-1。`;
    },
    mjsoldzhuchenshoufan(player, skill) {
    	const num = 1 + (player.storage[skill] || 0);
        return `${get.poptip("rule_mjs_yingzhan")}，你摸${num}张牌，若你未受到此杀伤害，令此技能可以摸牌的数量+1，否则-1。`;
    },
    mjsoldjiaobingzhiji(player, skill) {
        const num = player.countMark(`${skill}_add`);
        return `${get.poptip("rule_mjs_yingzhan")}，你可以摸${num}张牌，然后可以立即对目标打出1张杀，或者令此技能的摸牌数再次发动时+1，直到你的下个回合开始。`;
    },
};
export default dynamicTranslates;
