import { lib, game, ui, get, ai, _status } from "noname";
const dynamicTranslates = {
    mjsyanshuizhuifeng(player, skill) {
        if (player.hasSkill(`${skill}_sha`)) return "你可以弃置2张牌，出杀次数+1。击杀，你本回合每打出过1张杀，就可以摸2张牌，然后此技能本回合无效。";
        return lib.translate[skill + "_info"];
    },
    mjsbashidanjing(player, skill) {
        if (player.storage[skill]) return "受伤，你可以弃置1张牌，对伤害来源造成1点伤害<del>，然后每局游戏限1次，你可以减1点体力上限，回复1点体力，并可以对目标打出1张具有强命的杀</del>。";
        return lib.translate[skill + "_info"];
    },
    mjspingyanouzhe(player, skill) {
        if (player.storage[skill]) return "每回合每种牌限1次，当你打出牌后，令一名其他角色添加1张此牌的复制";
        return lib.translate[skill + "_info"];
    },
    mjsfabuagui(player, skill) {
        if (player.hasSkill(`${skill}_rewrite`)) return "出牌阶段限1次，你可以令所有角色上一轮每发动过1次技能，就摸1张牌。";
        return lib.translate[skill + "_info"];
    },
    mjszaokongxiyu(player, skill) {
        if (player.storage[skill]) return "你每累计获得其他角色8张牌后，装备上限+1，并随机获得1张装备牌。";
        return lib.translate[skill + "_info"];
    },
    mjsneimoufazhi(player, skill) {
        const num = 1 + player.countMark(skill + "_effect");
        return `${get.poptip("rule_mjs_yingzhan")}，你随机弃置目标${num}张牌，令此技能可以弃牌的数量+1，直到你的下个回合开始。`;
    },
    mjszhuchenshoufan(player, skill) {
        const num = 1 + player.countMark(skill + "_effect");
        return `${get.poptip("rule_mjs_yingzhan")}，你摸${num}张牌，若你未受到此杀伤害，令此技能可以摸牌的数量+1，直到你的下个回合开始。`;
    },
    mjsshanshinanzhong(player, skill) {
        if (player.hasSkill(skill + "_rewrite")) return "当你打出削弱牌时，摸1张牌。每个回合限1次，当你获得牌时，削弱这些牌。";
        return lib.translate[skill + "_info"];
    },
};
export default dynamicTranslates;
