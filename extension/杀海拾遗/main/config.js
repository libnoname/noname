import { lib, game, ui, get, ai, _status } from "./utils.js";

const config = {
	tip: {
		name: ui.joint`
			<hr aria-hidden="true">
			<div style="display: flex; justify-content: center">
				<span class="bold">以下按钮长按有提示或介绍</span>
			</div>
			<br />
		`,
		clear: true,
	},
	wuxing: {
		name: "五行生克",
		init: false,
		intro: "每名角色和部分卡牌在游戏开始时随机获得一个属性",
	},
	rand: {
		name: "带属性卡牌概率",
		init: "0.3",
		item: {
			0.1: "10%",
			0.2: "20%",
			0.3: "30%",
			0.5: "50%",
		},
	},
	mtg: {
		name: "万智牌",
		init: true,
		intro: "包含12种地图牌和3张武将牌，首次引入“随从”概念",
	},
	zhenfa: {
		name: "阵法牌",
		init: true,
		intro: "国战模式专属卡牌扩展包",
	},
	gwent: {
		name: "昆特牌（<span style='color:rgb(8, 228, 107)'>建议开启</span>）",
		init: true,
		intro: "包含32种法术牌和52张武将牌，并引入“天气牌”",
	},
	yunchou: {
		name: "运筹帷幄（<span style='color:rgb(8, 228, 228)'>建议开启</span>）",
		init: true,
		intro: "以三国背景设计的若干武将牌和卡牌",
	},
};

export default config;
