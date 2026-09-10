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
	zhenfa: {
		name: "阵法牌",
		init: true,
		intro: "国战模式专属卡牌扩展包",
	},
	yunchou: {
		name: "运筹帷幄（<span style='color:rgb(8, 228, 228)'>建议开启</span>）",
		init: true,
		intro: "以三国背景设计的若干武将牌和卡牌",
	},
};

export default config;
