import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import cors from "@fastify/cors";
import fs from "fs/promises";
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

/**
 * 默认允许的跨域来源。
 *
 * 这里**不能**再写 `origin: "*"`：本服务提供 /writeFile、/removeFile、/removeDir
 * 这类无鉴权的写接口，配合 `*` 意味着用户访问的任意网页都能向本机
 * http://localhost:8089 发跨域请求，读写甚至删除游戏目录里的文件。
 *
 * 合法使用场景都是「本机」或「本机应用」，因此默认只放行：
 *   - 没有 Origin 头（同源导航、非浏览器客户端、服务端代理）
 *   - `null`（file:// 打包版桌面端 / Electron）
 *   - localhost / 127.0.0.1 / [::1]（含 vite 开发服务器所在端口）
 *   - capacitor://localhost、ionic://localhost（移动端 WebView）
 * 需要额外来源时用 `--allowOrigin=<origin>[,<origin>...]` 显式追加。
 */
const DEFAULT_ALLOWED_ORIGIN_PATTERNS = ["capacitor://localhost", "ionic://localhost"];

function isLocalOrigin(origin: string): boolean {
	let url: URL;
	try {
		url = new URL(origin);
	} catch {
		return false;
	}
	if (url.protocol === "file:") {
		return true;
	}
	return url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "[::1]" || url.hostname === "::1";
}

export const defaultConfig = {
	server: false,
	port: 8089,
	debug: false,
	dirname: cwd(),
	/** 监听地址。显式绑定回环地址，避免依赖框架默认值。 */
	host: "127.0.0.1",
	/** 单次写请求的体积上限，默认 64 MiB（原为 10 GiB，等于没有上限）。 */
	maxBodySize: 64 * 1024 * 1024,
	/** 静态资源缓存秒数。0 = 每次都发条件请求（本地开发友好，仍有 ETag/304）。 */
	maxAge: 0,
	/** 追加允许的跨域来源，逗号分隔，例如 `--allowOrigin=http://192.168.1.5:8081`。 */
	allowOrigin: "",
};

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

export default function createApp(config: Partial<typeof defaultConfig> = {}) {
	const cfg = { ...defaultConfig, ...config };
	cfg.dirname = path.resolve(cfg.dirname);
	if (cfg.debug) console.log(cfg);
	const app = Fastify({
		logger: cfg.debug,
	});

	const { ensureSafe, wrap } = createFsHandler(cfg.dirname);

	// CORS 只放行本机来源（详见 DEFAULT_ALLOWED_ORIGIN_PATTERNS 的注释）。
	// 同源请求不带 Origin 头，不受影响；vite 开发服务器是服务端代理，也不受影响。
	const extraAllowedOrigins = String(cfg.allowOrigin || "")
		.split(",")
		.map(item => item.trim())
		.filter(Boolean);

	app.register(cors, {
		origin(origin: string | undefined, callback: (err: Error | null, allow: boolean) => void) {
			// 无 Origin 头：同源导航或非浏览器客户端
			if (!origin) {
				return callback(null, true);
			}
			// `Origin: null`：file:// 打包版桌面端
			if (origin === "null") {
				return callback(null, true);
			}
			if (DEFAULT_ALLOWED_ORIGIN_PATTERNS.includes(origin) || extraAllowedOrigins.includes(origin) || isLocalOrigin(origin)) {
				return callback(null, true);
			}
			if (cfg.debug) {
				console.log(`[fs] 拒绝跨域来源: ${origin}`);
			}
			// 不抛错，只是不回 CORS 头，让浏览器按同源策略拦截
			return callback(null, false);
		},
		methods: ["GET", "POST", "OPTIONS"],
	});

	app.register(fastifyStatic, {
		root: cfg.dirname,
		prefix: "/",
		// 不要把 .git / .gitignore / .wrangler 等点文件当静态资源发出去。
		// dotfiles: "allow" 会让 `GET /.git/config` 直接可读。
		dotfiles: "ignore",
		maxAge: cfg.maxAge,
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
			bodyLimit: cfg.maxBodySize,
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
		console.log(`Server listening on http://${cfg.host}:${cfg.port}/`);
		if (cfg.host !== "127.0.0.1" && cfg.host !== "localhost" && cfg.host !== "::1") {
			console.warn(
				`[fs] 注意：当前监听地址为 ${cfg.host}，本服务的写/删接口没有鉴权，` +
					"暴露到局域网意味着同网段任何设备都能改动游戏目录。仅在确有必要时这样使用。"
			);
		}
		if (!cfg.server && !cfg.debug) exec(`start http://localhost:${cfg.port}/`);
	};

	// 说明：这里曾有一段被注释掉的 HTTPS 分支，读取仓库内的
	// localhost.decrypted.key / localhost.crt。那两个文件是真实私钥+证书且已入库，
	// 现已从版本控制移除（见 .gitignore）。若本地确实需要 HTTPS，请自行生成
	// 自签名证书后再启用下面这段，并且不要把私钥提交回来。
	//
	// if (config.https) {
	// 	const SSLOptions = {
	// 		key: fs.readFileSync(path.join(config.dirname, "localhost.decrypted.key")),
	// 		cert: fs.readFileSync(path.join(config.dirname, "localhost.crt")),
	// 	};
	// 	const httpsServer = https.createServer(SSLOptions, app);
	// 	// 会提示NET::ERR_CERT_AUTHORITY_INVALID
	// 	// 但浏览器还是可以访问的
	// 	// todo: 解决sw注册问题
	// 	httpsServer.listen({ port: cfg.port, host: cfg.host }, callback);
	// } else {
	// 	app.listen({ port: cfg.port, host: cfg.host }, callback);
	// }
	app.listen({ port: cfg.port, host: cfg.host }, callback);

	return app;
}
