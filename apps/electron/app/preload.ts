import { shell } from "electron";
import { app, Menu, dialog, getCurrentWindow } from "@electron/remote";
import path from "path";
const thisWindow = getCurrentWindow();

const Menus: (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] = [
	{
		label: "操作",
		submenu: [
			{
				label: "打开无名杀目录",
				click: () => {
					shell.showItemInFolder(path.join(app.getAppPath(), "app"));
				},
			},
		],
	},
	{
		label: "窗口",
		submenu: [
			{
				label: "重新加载当前窗口",
				role: "reload",
			},
			{
				label: "打开/关闭控制台",
				role: "toggleDevTools",
			},
			{
				type: "separator", //分割线
			},
			{
				label: "全屏模式",
				role: "togglefullscreen",
			},
			{
				label: "最小化",
				role: "minimize",
			},
			{
				type: "separator", //分割线
			},
		],
	},
	{
		label: "帮助",
		submenu: [
			// {
			// 	label: "无名杀教程",
			// 	click: () => {
			// 		createIframe();
			// 	},
			// },
			// {
			// 	label: "JavaScript教程",
			// 	click: () => {
			// 		shell.openExternal(
			// 			"https://developer.mozilla.org/zh-CN/docs/learn/JavaScript"
			// 		);
			// 	},
			// },
			// {
			// 	label: "Electron教程",
			// 	click: () => {
			// 		shell.openExternal("https://www.electronjs.org/docs");
			// 	},
			// },
			// {
			// 	label: "QQ群合集",
			// 	click: () => {
			// 		shell.openExternal(
			// 			"https://mp.weixin.qq.com/s?__biz=MzUwOTMwMjExNQ==&mid=100009245&idx=1&sn=5671f6f4003d4fae44da3fc09630a759&chksm=7916e1114e616807e6aa34dec69c34ab1096d9ea332e6fb88b4b48116f41a948d907ff00f96b&mpshare=1&scene=23&srcid=0803MuuzUbphhaDV6y8C2noF&sharer_sharetime=1627992420112&sharer_shareid=0ebf733c5192798632ac5cf18bae205c#rd"
			// 		);
			// 	},
			// },
			{
				label: "bug反馈",
				click: () => {
					shell.openExternal("https://tieba.baidu.com/p/9117747182");
				},
			},
			{
				label: "版权声明",
				click: () => {
					dialog.showMessageBoxSync(thisWindow, {
						message:
							"【无名杀】属于个人（水乎）开发项目且【完全免费】。如非法倒卖用于牟利将承担法律责任 开发团队将追究到底",
						type: "info",
						title: "版权声明",
						icon: path.join(app.getAppPath(), "app", "noname.ico"),
					});
				},
			},
		],
	},
	// {
	// 	label: "反馈",
	// 	submenu: [
	// 		{
	// 			label: "通过QQ联系本应用作者（诗笺）",
	// 			click: () => {
	// 				shell.openExternal("tencent://message/?uin=2954700422");
	// 			},
	// 		},
	// 		{
	// 			label: "无名杀项目作者： 水乎",
	// 		},
	// 		{
	// 			label: "无名杀现任更新者： 苏婆玛丽奥",
	// 		},
	// 		{
	// 			label: "开发组成员之一：狂神",
	// 			click: () => {
	// 				shell.openExternal("tencent://message/?uin=2832899707");
	// 			},
	// 		},
	// 	],
	// },
];

Menu.setApplicationMenu(Menu.buildFromTemplate(Menus));
thisWindow.setAutoHideMenuBar(false);
thisWindow.setMenuBarVisibility(true);

thisWindow.on("leave-full-screen", () => {
	if (!thisWindow.isDestroyed()) {
		thisWindow.webContents.closeDevTools();
	} else {
		app.exit(0);
	}
});
