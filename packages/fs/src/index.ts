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

const oneYear = 60 * 1000 * 60 * 24 * 365;

export const defaultConfig = {
	server: false,
	maxAge: oneYear,
	port: 8089,
	debug: false,
	dirname: cwd(),
};

function createFsHandler(dirname: string) {
	const join = (url: string) => path.join(dirname, url);
	const isInProject = (url: string) => path.normalize(join(url)).startsWith(dirname);

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

	app.register(cors, {
		origin: "*",
		methods: ["GET", "POST", "OPTIONS"],
	});

	app.register(fastifyStatic, {
		root: cfg.dirname,
		prefix: "/",
		dotfiles: "allow",
		maxAge: cfg.debug ? 0 : cfg.maxAge,
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
		console.log(`Server listening on port ${cfg.port}`);
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
	app.listen({ port: cfg.port }, callback);

	return app;
}
