import characters from "./character.js";

const characterSort = {
	mingjiangxinxiu: [],
	mingjiangqianzhan: [],
	mingjianghoutai: [],
	baijiazhengming: [],
	mingjianggongchuang: [],
};

for (const name in characters) {
	if (name.startsWith("mjs_new")) {
		characterSort.mingjiangxinxiu.add(name);
	} else if (name.startsWith("mjs_tbd")) {
		characterSort.mingjiangqianzhan.add(name);
	} else if (name.startsWith("mjs_pen")) {
		characterSort.mingjianggongchuang.add(name);
	} else if (name.startsWith("mjs_10")) {
		characterSort.baijiazhengming.add(name);
	} else {
		characterSort.mingjianghoutai.add(name);
	}
}

const characterSortTranslate = {
	mingjiangxinxiu: "名将新修",
	mingjiangqianzhan: "名将前瞻",
	mingjianghoutai: "名将后台",
	mingjianggongchuang: "名将共创",
	baijiazhengming: "百家争鸣",
	bimozhengfeng: "笔墨争锋",
};

export { characterSort, characterSortTranslate };
