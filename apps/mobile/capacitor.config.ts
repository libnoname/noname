import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
	appId: "com.libnoname.noname",
	appName: "noname",
	webDir: "../../dist",
	ios: {
		// 游戏自己用绝对定位铺满整屏，不能让 WebView 再加安全区内边距，
		// 否则顶部标签栏 / 系统按钮的坐标会整体下移，点击热区对不上。
		contentInset: "never",
		// 允许加载 Capacitor 的本地资源方案（capacitor://localhost）。
		// `fs/ios.ts` 依赖它读取打包进 App 的只读资源。
		limitsNavigationsToAppBoundDomains: false,
	},
	plugins: {
		App: {},
		// 安卓 15/16 对 targetSdk 35+ 强制 edge-to-edge，系统栏会浮在 WebView 上层并吃掉
		// 页面顶部那一带的触摸，导致左上角系统按钮（选项/整理手牌/收藏）和选项菜单的
		// 标签栏（武将/扩展等）点不到。这里启动即隐藏系统栏，与旧 Cordova 端默认
		// 隐藏状态栏（show_statusbar_android 默认 false）的行为保持一致。
		//
		// iOS 侧同样生效：隐藏状态栏后 WebView 铺满整屏，避免系统栏遮挡顶部标签栏。
		SystemBars: {
			hidden: true,
			style: "DARK",
		},
	},
};

export default config;
