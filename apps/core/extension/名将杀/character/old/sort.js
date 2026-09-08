import characters from "./character.js";

const characterSort = {
	mjsmingjiangjiugai: [],
	mjsgongxingtianfa: ["mjs_zhaogao", "mjs_shichangshi", "mjs_jiangchong", "mjs_naochi"],
	mjsnianshoulaixi: ["mjs_nianshou"],
	mjsqianlidanqi: [],
	mjsmingjiangguanfang: ["mjs_tap_laobing", "mjs_tap_guangzhichen", "mjs_tap_xiaolongbao"],
};

for (const name in characters) {
	if (Object.values(characterSort).flat().includes(name)) {
		continue;
	} else if (name.startsWith("mjs_npc")) {
		characterSort.mjsqianlidanqi.add(name);
	}
	else {
		characterSort.mjsmingjiangjiugai.add(name);
	}
}

const characterSortTranslate = {
	mjsmingjiangjiugai: "名将旧改",
	mjsgongxingtianfa: "龚行天罚",
	mjsnianshoulaixi: "年兽来袭",
	mjsqianlidanqi: "千里单骑",
	mjsmingjiangguanfang: "名将官方",
};

export { characterSort, characterSortTranslate };
