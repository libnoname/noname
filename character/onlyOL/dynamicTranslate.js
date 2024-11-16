import { lib, game, ui, get, ai, _status } from "../../noname.js";

const dynamicTranslates = {
    olsbjinming(player) {
        let str = "回合开始时，你可以选择一项：";
        for (let i of ["1.回复过1点体力；", "2.造成过2点伤害；", "3.使用过三种类型的牌；", "4.弃置过四张牌。"]) {
            if (!player.getStorage("olsbjinming").includes(parseInt(i.slice(0, 1)))) i = `<span style="text-decoration: line-through;">${i}</span>`;
            str += i;
        }
        str += "然后本回合结束时你摸X张牌，若未满足选择的条件，则你失去1点体力并删除此选项（X为本回合〖矜名〗选择的选项序号）。";
        return str;
    },
};
export default dynamicTranslates;
