import { clips } from "./catalogs/hlhj_daiyu.js";

const ids = (prefix, numbers) => numbers.map(n => prefix + String(n).padStart(2, "0"));
const range = (prefix, count) => ids(prefix, Array.from({ length: count }, (_, n) => n + 1));
const skill = (label, lines, priority = 50) => ({ label, lines, category: "skills", priority });
const life = (label, lines, priority, cooldown = 8) => ({ label, lines, category: "life", priority, cooldown });
const appearance = (label, lines) => ({ label, lines, category: "appearance", priority: 10, group: "appearance" });

// A character contributes only its asset catalog, semantic event pools and
// relationship lookup. The shared runtime knows no skill names or card rules.
export function daiyuVoice(themeRoot) {
    return {
        character: "hlhj_daiyu", label: "绛珠仙子", root: themeRoot + "voices/hlhj_daiyu/", clips,
        isBond: (source, target) => source.getStorage("hlhj_mushi")[0] === target,
        events: {
            convert: { ...skill("绛珠仙子 · 化情思", range("JZ", 13), 20), cooldown: 15 },
            bond: skill("木石前缘 · 初结缘", ids("MS", [1, 2, 9, 10])),
            bondDraw: skill("木石前缘 · 为缘摸牌", ids("MS", [3, 4, 11])),
            selfDraw: skill("木石前缘 · 自摸弃思", ids("MS", [5, 6, 12])),
            changeBond: skill("木石前缘 · 换缘", ids("MS", [7, 8, 13, 14]), 60),
            collect: skill("香断谁怜 · 收取弃牌", ids("XD", [1, 2, 3, 4, 9]), 60),
            share: skill("香断谁怜 · 双方得牌", ids("XD", [5, 6]), 60),
            flowerLost: skill("香断谁怜 · 失花得泪", ids("XD", [7, 8, 10]), 30),
            bury: skill("葬花吟", range("ZH", 12), 70),
            tearsGain: skill("潇湘妃子 · 得泪", ids("XX", [1, 2, 3, 4, 9, 10]), 60),
            tearsLost: skill("潇湘妃子 · 失泪", ids("XX", [5, 6, 7, 8, 11]), 60),
            dream: { ...life("绛珠归梦 · 泪满", ids("GM", [1, 2, 3, 4, 9, 10, 11]), 95), category: "skills" },
            gift: { ...life("绛珠归梦 · 授愿", ids("GM", [5, 6, 7, 8, 12, 13]), 95), category: "skills" },
            recover: skill("绛珠遗愿 · 回复", ids("YY", [1, 2, 3, 4, 9, 10, 11, 12]), 65),
            guard: skill("绛珠遗愿 · 代伤", ids("YY", [5, 6, 7, 8, 13, 14]), 70),
            qingsi: skill("情思 · 转移效果", range("QS", 13), 75),
            enter: life("登场", range("EN", 4), 80, 2),
            death: life("死亡", range("D", 5), 100, 15),
            hurt: life("受伤", range("H", 2), 35),
            dying: life("濒死", range("DY", 4), 85),
            bondHurt: life("木石缘受伤 · 探伤", range("TS", 6), 55, 10),
            win: life("胜利", range("W", 4), 80, 15),
            lose: life("失败", range("L", 3), 80, 15),
            portrait_bamboo: appearance("原画 · 潇湘竹影", ids("P", [1, 2, 7, 8])),
            portrait_dream: appearance("原画 · 绛珠归梦", ids("P", [3, 4])),
            portrait_original: appearance("原画 · 绛珠题笺", ids("P", [5, 6])),
            background_bamboo: appearance("背景 · 竹窗听雨", ids("B", [1, 2])),
            background_dream: appearance("背景 · 绛珠归梦", ids("B", [3, 4])),
        },
    };
}
