import { lib, game, get, _status, ui, ai } from "noname";
import { boot } from "@/init/index.js";
import { userAgentLowerCase, device } from "@/util/index.js";
import { loadBuildInfo } from "@/util/meta.js";
// 只引入 core-js 的压缩版本（258 KB）而不是默认入口 index.js（856 KB）。
// 二者是同一份 bundle，只是后者带注释与缩进；本仓库的目标环境是
// chrome91 / safari16.4（见 scripts/build.ts 的 target），仍然需要这些 polyfill。
import "core-js-bundle/minified.js";
// 保证打包时存在(importmap)
// 用 prod 版（163 KB）而不是 vue.esm-browser.js（532 KB）：二者都是含运行时编译器的
// 完整版，区别只是 prod 版去掉了开发期警告与 devtools 钩子。
// 注意 importmap 里 "vue" 的映射也要同步（见 scripts/build.ts 的 importMap）。
import "vue/dist/vue.esm-browser.prod.js";

(async () => {
	try {
		lib.device = device;

		// 预加载脚本
		const path = "/preload.js";
		const { default: preload } = await import(/* @vite-ignore */ path).catch(() => {
			// Electron平台
			if (typeof window.require === "function") {
				return import("./init/node.js");
			} else {
				// 仅在“确实是移动端客户端/cordova环境”时才走 cordova 分支；
				// 否则（如 macOS 桌面 Safari/Chrome、普通手机浏览器）应走 browser 分支，避免请求 /cordova.js 并卡死在 deviceready。
				const isCordovaLike = typeof window.cordova !== "undefined" || typeof window.NonameAndroidBridge !== "undefined" || typeof window.noname_shijianInterfaces !== "undefined";

				if (import.meta.env.DEV || typeof lib.device == "undefined" || !isCordovaLike) {
					return import("./init/browser.js");
				} else {
					return import("./init/cordova.js");
				}
			}
		});
		await preload({ lib, game, get, _status, ui, ai });
		lib.buildInfo = await loadBuildInfo(url => lib.init.promises.json(url));

		// GPL确认
		if (!localStorage.getItem("gplv3_noname_alerted")) {
			if (
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

		await boot();
	} catch (e) {
		console.error(e);
		alert(`《无名杀》加载内容失败
浏览器UA信息: 
${userAgentLowerCase}
错误信息: 
${e instanceof Error ? e.stack : String(e)}
若您不理解该信息，请依次检查：
1. 游戏文件是否完整（重新下载完整包）
2. 客户端是否需要更新
3. 浏览器是否需要更新
4. 若您直接打开index.html进行游戏，请改为运行文件夹内的noname-server.exe
5. 若以上步骤均无法解决问题，请及时向开发组反馈`);
	}
})();
