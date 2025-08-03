import { lib, game, ui, get, ai, _status } from "../../../noname.js";

export async function precontent(config, pack) {
	const timeout = 5000; // 超时控制
	try {
		// 如果模块加载时间超过5秒，抛出超时错误
		await Promise.race([
			import("../card/index.js"),
			new Promise((_, reject) =>
				setTimeout(() => reject(new Error("『欢乐卡牌』加载超时")), timeout)
			)
		]);
		lib.config.all.cards.push("欢乐卡牌");
		lib.translate.欢乐卡牌_card_config = "欢乐卡牌";
	} catch (err) {
		console.error("Failed to import extension 『欢乐卡牌』: ", err);
		alert("Error:『欢乐卡牌』扩展导入失败");
	}
}
