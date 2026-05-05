import { build as buildElectron, Platform, Arch, type PackagerOptions, type Configuration } from "electron-builder";
import { build as buildVite } from "vite";

async function main(targets: PackagerOptions["targets"], config: Partial<Configuration> = {}) {
	const appPaths = await buildElectron({
		config: {
			asar: false,
			appId: "com.libnoname.noname",
			productName: "noname",
			directories: {
				output: "../../output",
			},
			files: [
				{ from: "dist", to: "" },
				{ from: "../../dist", to: "" },
				{ from: "../../dist/node_modules", to: "node_modules" },
				"package.json",
			],
			extraMetadata: {
				main: "app/main.js",
			},
			...config,
		},
		targets,
	});
	console.log("打包完成");
}

await buildVite();

switch (process.argv[2]) {
	case "win":
		main(Platform.WINDOWS.createTarget("nsis", Arch.x64), {
			win: {
				verifyUpdateCodeSignature: false,
				icon: "noname.ico",
			},
			nsis: {
				oneClick: false,
				allowToChangeInstallationDirectory: true,
			},
		});
		break;
	case "linux":
		main(Platform.LINUX.createTarget("AppImage", Arch.x64));
		break;
	case "macos":
		main(Platform.MAC.createTarget("dmg", Arch.arm64, Arch.x64), {
			mac: {
				identity: null,
			},
		});
		break;
	default:
		console.log("未知平台:", process.argv[2]);
}
