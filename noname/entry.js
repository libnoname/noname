import { game } from "noname";
import { boot } from "@/init/index.js";
import { nonameInitialized, userAgentLowerCase } from "@/util/index.js";
import "core-js-bundle";
import "../jit/index.js";
// 保证打包时存在(importmap)
import "vue/dist/vue.esm-browser.js";

(async function () {
	window["bannedExtensions"] = [
		"\u4fa0\u4e49",
		"\u5168\u6559\u7a0b",
		"在线更新", //游戏内在线更新方式修改了，不再依赖于在线更新扩展了
	];

	// GPL确认
	if (!localStorage.getItem("gplv3_noname_alerted")) {
		const gameIntialized = nonameInitialized && nonameInitialized.length > 0;

		if (
			gameIntialized ||
			confirm(`①无名杀是一款基于GPLv3协议的开源软件
你可以在遵守GPLv3协议的基础上任意使用，修改并转发《无名杀》，以及所有基于《无名杀》开发的扩展
点击“确定”即代表您认可并接受GPLv3协议↓️
https://www.gnu.org/licenses/gpl-3.0.html
②无名杀官方发布地址仅有GitHub仓库
其他所有的所谓“无名杀”社群（包括但不限于绝大多数“官方”QQ群、QQ频道等）均为玩家自发组织，与无名杀官方无关`)
		) {
			localStorage.setItem("gplv3_noname_alerted", String(true));
		} else {
			game.exit();
			return;
		}
	}

	try {
		await boot();
	} catch (e) {
		console.error(e);
		alert(`《无名杀》加载内容失败
浏览器UA信息: 
${userAgentLowerCase}
报错信息: 
${e instanceof Error ? e.stack : String(e)}
若您不理解该报错信息，请依次检查：
1. 游戏文件是否完整（重新下载完整包）
2. 客户端是否需要更新
3. 浏览器是否需要更新
4. 若您直接打开index.html进行游戏，请改为运行文件夹内的noname-server.exe
5. 若以上步骤均无法解决问题，请及时向开发组反馈`);
	}
})();
