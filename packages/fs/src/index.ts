import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import cors from "@fastify/cors";
import fs from "fs/promises";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import crypto from "crypto";
import path from "path";
import { cwd } from "process";
import { exec } from "child_process";

interface JsonResult<T = any> {
	success: boolean;
	code: number;
	errorMsg?: string;
	data?: T;
}

const successfulJson = <T = any>(data?: T): JsonResult<T> => ({
	success: true,
	code: 200,
	data,
});
const failedJson = <T = any>(code: number, message?: string): JsonResult<T> => ({
	success: false,
	code,
	errorMsg: message,
});

export const defaultConfig = {
	server: false,
	port: 8089,
	debug: false,
	// 监听地址：默认仅回环，避免局域网内其它设备直接调用文件接口。
	// 需要局域网访问（例如手机连电脑上的本地服务）时显式传 host: "0.0.0.0"。
	host: "127.0.0.1",
	dirname: cwd(),
};

/**
 * 本地会话凭据：首次启动生成并持久化到 `<dirname>/Home/.fs_auth_token`。
 * 持久化是为了让同名 Cookie 在重启后继续有效（页面/Service Worker 缓存不会立刻重新拉取页面）。
 */
function loadAuthToken(dirname: string) {
	const tokenPath = path.join(dirname, "Home", ".fs_auth_token");
	try {
		const saved = readFileSync(tokenPath, "utf-8").trim();
		if (saved.length >= 32) return saved;
	} catch {}
	const token = crypto.randomBytes(32).toString("hex");
	try {
		mkdirSync(path.dirname(tokenPath), { recursive: true });
		writeFileSync(tokenPath, token, { mode: 0o600 });
	} catch {
		console.warn("无法持久化本地会话凭据，本次运行使用临时凭据");
	}
	return token;
}

function createFsHandler(dirname: string) {
	const join = (url: string) => path.join(dirname, url);
	// 比较前给 dirname 补上路径分隔符，否则同级的 `${dirname}-backup` 之类目录会被当成项目内路径
	const prefix = dirname.endsWith(path.sep) ? dirname : dirname + path.sep;
	const isInProject = (url: string) => {
		const full = path.resolve(join(url));
		return full === dirname || full.startsWith(prefix);
	};

	const ensureSafe = (url: string) => {
		if (!isInProject(url)) throw new Error(`只能访问 ${dirname} 下的资源`);
		return join(url);
	};

	const wrap = <Q, R>(fn: (query: Q) => Promise<R>) => {
		return async (req: any) => {
			try {
				return successfulJson(await fn(req.method == "POST" ? req.body : req.query));
			} catch (e: any) {
				return failedJson(400, String(e));
			}
		};
	};

	return { join, ensureSafe, wrap };
}

/** 仅允许本机来源（localhost / 127.0.0.1 / [::1]，端口不限，兼容 vite 开发服务器） */
function isLocalOrigin(value: string) {
	try {
		const { hostname } = new URL(value);
		return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
	} catch {
		return false;
	}
}

const AUTH_COOKIE = "noname_fs_auth";
const DEV_HEADER = "noname-fs-dev";

export default function createApp(config: Partial<typeof defaultConfig> = {}) {
	const cfg = { ...defaultConfig, ...config };
	cfg.dirname = path.resolve(cfg.dirname);
	if (cfg.debug) console.log(cfg);
	const app = Fastify({
		logger: cfg.debug,
	});

	const { ensureSafe, wrap } = createFsHandler(cfg.dirname);
	const authToken = loadAuthToken(cfg.dirname);

	const apiPaths = new Set([
		"/createDir",
		"/removeDir",
		"/readFile",
		"/readFileAsText",
		"/writeFile",
		"/removeFile",
		"/getFileList",
		"/checkFile",
		"/checkDir",
	]);

	const hasAuth = (req: any) => {
		const header = String(req.headers["x-noname-fs-auth"] ?? "");
		if (header && header === authToken) return true;
		// 本地开发：vite 代理注入固定标记，仅在 debug 模式下接受；
		// 跨站页面无法伪造该请求头（自定义头会触发 CORS 预检，而预检来源必须为本机）。
		if (cfg.debug && header === DEV_HEADER) return true;
		const cookie = String(req.headers.cookie ?? "");
		return cookie.split(";").some(item => item.trim() === `${AUTH_COOKIE}=${authToken}`);
	};

	// 统一鉴权：拒绝跨站来源；文件接口必须携带本地会话凭据
	app.addHook("onRequest", async (req, reply) => {
		const origin = String(req.headers.origin ?? "");
		const referer = String(req.headers.referer ?? "");
		if ((origin && !isLocalOrigin(origin)) || (referer && !isLocalOrigin(referer))) {
			return reply.code(403).send(failedJson(403, "拒绝跨站请求"));
		}
		const pathname = req.url.split("?")[0];
		if (apiPaths.has(pathname)) {
			if (!hasAuth(req)) {
				return reply.code(403).send(failedJson(403, "未授权：缺少本地会话凭据"));
			}
		} else if (req.method === "GET") {
			// 任何静态页面加载都会刷新会话 Cookie（同站请求携带；跨站请求不会携带 SameSite=Strict 的 Cookie）
			reply.header(
				"Set-Cookie",
				`${AUTH_COOKIE}=${authToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=31536000`
			);
		}
	});

	app.register(cors, {
		origin: (origin: string | undefined, callback: (err: Error | null, allow: boolean) => void) => {
			callback(null, !origin || isLocalOrigin(origin));
		},
		methods: ["GET", "POST", "OPTIONS"],
	});

	app.register(fastifyStatic, {
		root: cfg.dirname,
		prefix: "/",
		dotfiles: "allow",
		maxAge: 0,
	});

	// index.html
	app.get("/", async (req, reply) => reply.redirect("/index.html"));

	app.get(
		"/createDir",
		wrap(async ({ dir }: { dir: string }) => {
			const full = ensureSafe(dir);
			await fs.mkdir(full, { recursive: true });
			return true;
		})
	);

	app.get(
		"/removeDir",
		wrap(async ({ dir }: { dir: string }) => {
			const full = ensureSafe(dir);
			const stat = await fs.stat(full);
			if (!stat.isDirectory()) throw new Error(`${full} 不是文件夹`);
			await fs.rm(full, { recursive: true, force: true });
			return true;
		})
	);

	app.get(
		"/readFile",
		wrap(async ({ fileName }: { fileName: string }) => {
			const full = ensureSafe(fileName);
			const data = await fs.readFile(full);
			return [...new Uint8Array(data)];
		})
	);

	app.get(
		"/readFileAsText",
		wrap(async ({ fileName }: { fileName: string }) => {
			const full = ensureSafe(fileName);
			return await fs.readFile(full, "utf-8");
		})
	);

	app.post(
		"/writeFile",
		{
			bodyLimit: 10 * 1024 * 1024 * 1024,
		},
		wrap(async ({ path: p, data }: { path: string; data: number[] }) => {
			const full = ensureSafe(p);
			await fs.mkdir(path.dirname(full), { recursive: true });
			await fs.writeFile(full, Buffer.from(data));
			return true;
		})
	);

	app.get(
		"/removeFile",
		wrap(async ({ fileName }: { fileName: string }) => {
			const full = ensureSafe(fileName);
			const stat = await fs.stat(full);
			if (stat.isDirectory()) throw new Error("不能删除文件夹");
			await fs.unlink(full);
			return true;
		})
	);

	app.get(
		"/getFileList",
		wrap(async ({ dir }: { dir: string }) => {
			const full = ensureSafe(dir);
			const stat = await fs.stat(full);
			if (stat.isFile()) throw new Error("路径不是文件夹");

			const entries = await fs.readdir(full);
			const files: string[] = [];
			const folders: string[] = [];

			await Promise.all(
				entries.map(async entry => {
					if (entry.startsWith(".") || entry.startsWith("_")) return;
					const s = await fs.stat(path.join(full, entry));
					s.isDirectory() ? folders.push(entry) : files.push(entry);
				})
			);

			return { folders, files };
		})
	);

	app.get(
		"/checkFile",
		wrap(async ({ fileName }: { fileName: string }) => {
			const full = ensureSafe(fileName);
			try {
				const stat = await fs.stat(full);
				if (stat.isFile()) return "file";
				else return "directory";
			} catch {
				return {};
			}
		})
	);

	app.get(
		"/checkDir",
		wrap(async ({ dir }: { dir: string }) => {
			const full = ensureSafe(dir);
			try {
				const stat = await fs.stat(full);
				if (stat.isFile()) return "file";
				else return "directory";
			} catch {
				return {};
			}
		})
	);

	app.setNotFoundHandler((req, reply) => {
		reply.code(404).send("Sorry can't find that!");
	});

	app.setErrorHandler((err, req, reply) => {
		reply.send(failedJson(400, String(err)));
	});

	const callback = () => {
		console.log(`Server listening on ${cfg.host}:${cfg.port}`);
		if (!cfg.server && !cfg.debug) exec(`start http://localhost:${cfg.port}/`);
	};

	// if (config.https) {
	// 	const SSLOptions = {
	// 		key: fs.readFileSync(path.join(config.dirname, "localhost.decrypted.key")),
	// 		cert: fs.readFileSync(path.join(config.dirname, "localhost.crt")),
	// 	};
	// 	const httpsServer = https.createServer(SSLOptions, app);
	// 	// 会提示NET::ERR_CERT_AUTHORITY_INVALID
	// 	// 但浏览器还是可以访问的
	// 	// todo: 解决sw注册问题
	// 	httpsServer.listen(config.port, callback);
	// } else {
	// 	app.listen(config.port, callback);
	// }
	app.listen({ port: cfg.port, host: cfg.host }, callback);

	return app;
}
