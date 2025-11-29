import { game, get } from "noname";
import { boot, onload, tryUpdateProtocol } from "@/init/index.js";
import { nonameInitialized, userAgentLowerCase } from "@/util/index.js";
import "core-js-bundle";
import "../jit/index.js";
// 保证打包时存在(importmap)
import "vue/dist/vue.esm-browser.js";

(async function () {
	// 使用到的文本
	const globalText = {
		GPL_ALERT: ["①无名杀是一款基于GPLv3协议的开源软件！", "你可以在遵守GPLv3协议的基础上任意使用，修改并转发《无名杀》，以及所有基于《无名杀》开发的拓展。", "点击“确定”即代表您认可并接受GPLv3协议↓️", "https://www.gnu.org/licenses/gpl-3.0.html", "②无名杀官方发布地址仅有GitHub仓库！", "其他所有的所谓“无名杀”社群（包括但不限于绝大多数“官方”QQ群、QQ频道等）均为玩家自发组织，与无名杀官方无关！"].join("\n"),
		LOAD_ENTRY_FAILED: ["您使用的浏览器或《无名杀》客户端加载内容失败！", "请检查是否缺少游戏文件！隔版本更新请下载完整包而不是离线包！", "目前使用的浏览器UA信息为: ", userAgentLowerCase, "若您使用的客户端为自带内核的旧版“兼容版”，请及时更新客户端版本！", "若您使用的客户端为手机端的非兼容版《无名杀》，请尝试更新手机的WebView内核，或者更换为1.8.2版本及以上的兼容版！", "若您是直接使用浏览器加载index.html进行游戏，请改为运行文件夹内的“noname-server.exe”（或使用VSCode等工具启动Live Server），以动态服务器的方式启动《无名杀》！", "若您使用的是苹果端，请至少将Safari升级至16.4.0！"].join("\n"),
		REDIRECT_TIP: ["您使用的浏览器或无名杀客户端的版本或内核版本过低，已经无法正常运行无名杀！", "目前使用的浏览器UA信息为: ", userAgentLowerCase, "如果你使用的是浏览器，请更新你的浏览器内核！", "如果你使用的是无名杀客户端，点击“确认”以前往GitHub下载最新版无名杀客户端（可能需要科学上网）。", "（第三方客户端请联系第三方客户端的发布者）"].join("\n"),
		SAFARI_VERSION_NOT_SUPPORT: ["您使用的Safari浏览器无法支持当前无名杀所需的功能，请至少升级至16.4.0！", "当前浏览器的UA为: ", userAgentLowerCase, "稍后您的无名杀将自动退出（可能的话）"].join("\n"),
	};

	// 不支持file协议
	if (location.protocol.startsWith("file")) {
		alert(globalText.REDIRECT_TIP);
		return;
	}
	

	window["bannedExtensions"] = [
		"\u4fa0\u4e49",
		"\u5168\u6559\u7a0b",
		"在线更新", //游戏内在线更新方式修改了，不再依赖于在线更新扩展了
	];

	// 检查浏览器版本
	const [core, ...version] = get.coreInfo();
	if (core === "safari" && !get.checkVersion([16, 4, 0], version)) {
		alert(globalText.SAFARI_VERSION_NOT_SUPPORT);
		game.exit();
		return;
	} else if (core === "chrome" && !get.checkVersion([91, 0, 0], version)) {
		/*
        const tip = "检测到您的浏览器内核版本小于91，请及时升级浏览器或手机webview内核！";
        console.warn(tip);
        game.print(tip);
        const redirect_tip = `您使用的浏览器或无名杀客户端内核版本过低，将在未来的版本被废弃！\n目前使用的浏览器UA信息为：\n${userAgent}\n点击“确认”以前往GitHub下载最新版无名杀客户端（可能需要科学上网）。`;
        if (confirm(redirect_tip)) {
            window.open("https://github.com/libnoname/noname/releases/tag/chromium91-client");
        }
        */
		game.tryUpdateClient(/** UpdateReason.UNDERSUPPORT **/ 4);
	}

	// GPL确认
	if (!localStorage.getItem("gplv3_noname_alerted")) {
		const gameIntialized = nonameInitialized && nonameInitialized.length > 0;

		if (gameIntialized || confirm(globalText.GPL_ALERT)) {
			localStorage.setItem("gplv3_noname_alerted", String(true));
		} else {
			game.exit();
			return;
		}
	}


	try {
		await boot();

		await tryUpdateProtocol();

		await onload();
	} catch (e) {
		console.error(e);
		alert(globalText.LOAD_ENTRY_FAILED);
	}
})();
