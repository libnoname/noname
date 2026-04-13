import { spawn } from "node:child_process";
import type { ChildProcessWithoutNullStreams } from "node:child_process";

const apps = [
	{ name: "noname", pack: "noname", args: ["dev", "--open"] },
	{ name: "fs", pack: "@noname/fs", args: ["dev", "--debug", "--dirname=../../apps/core"] },
	{ name: "extension", pack: "./packages/extension/**", args: ["build:watch"] },
];

const children = new Map<string, ChildProcessWithoutNullStreams>();
const { promise: shuttedDown, resolve } = Promise.withResolvers<void>();
let shuttingDown = false;
let exitCode = 0;

const settleShuttedDown = () => {
	if (children.size === 0) {
		resolve();
	}
};
const shutdown = async (code: number, reason: string) => {
	if (shuttingDown) return;

	shuttingDown = true;
	exitCode = code;
	console.log(reason);

	for (const [name, child] of children) {
		if (!child.pid) continue;
		console.log("正在结束 [%s] (PID: %d)", name, child.pid);
		try {
			if (process.platform === "win32") {
				const killer = spawn("taskkill", ["/pid", child.pid.toString(), "/f", "/t"], {
					shell: false,
					detached: false,
					stdio: "ignore",
				});
				killer.on("error", err => {
					console.error("无法结束 [%s] (PID: %d): %s", name, child.pid, err);
				});
			} else {
				process.kill(-child.pid, "SIGINT");
			}
		} catch (e) {
			console.error("无法结束 [%s] (PID: %d): %s", name, child.pid, e);
		}
	}
	await shuttedDown;

	console.log("所有子进程已结束，退出主进程");
	process.exit(exitCode);
};

for (const { name, pack, args } of apps) {
	const child = spawn("pnpm", ["-F", pack, ...args], {
		shell: process.platform === "win32",
		detached: process.platform !== "win32",
	});
	child.stdout.on("data", data => {
		if (shuttingDown) return;
		console.log("\x1b[32m[%s]\x1b[0m %s", name, data.toString().trim());
	});
	child.stderr.on("data", data => {
		console.error("\x1b[31m[%s]\x1b[0m %s", name, data.toString().trim());
	});
	child.on("exit", (code, signal) => {
		console.log("\x1b[33m[%s]\x1b[0m 已退出(结束码: %d，信号: %s)", name, code, signal);

		children.delete(name);
		if (!shuttingDown) {
			void shutdown(1, `\n检测到 [${name}] 已意外退出，正在结束其他子进程`);
		}
		settleShuttedDown();
	});
	child.on("error", err => {
		console.error("\x1b[31m[%s]\x1b[0m 发生错误: %s", name, err);

		children.delete(name);
		if (!shuttingDown) {
			void shutdown(1, `\n检测到 [${name}] 启动失败，正在结束其他子进程`);
		}
		settleShuttedDown();
	});

	child.unref();
	children.set(name, child);
}

const shutdownSignals = process.platform === "win32" ? (["SIGINT", "SIGTERM"] as const) : (["SIGINT", "SIGTERM", "SIGHUP"] as const);
for (const signal of shutdownSignals) {
	process.on(signal, () => {
		void shutdown(0, `\n收到 ${signal}，正在结束所有子进程`);
	});
}
