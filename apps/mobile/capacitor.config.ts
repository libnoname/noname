import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
	appId: "com.libnoname.noname",
	appName: "noname",
	webDir: "../../dist",
	android: {
		path: "native/android",
	},
	ios: {
		path: "native/ios",
		contentInset: "never",
		limitsNavigationsToAppBoundDomains: false,
	},
	plugins: {
		App: {},
		SystemBars: {
			hidden: true,
			style: "DARK",
		},
	},
};

export default config;
