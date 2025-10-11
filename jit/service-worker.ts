/// <reference lib="WebWorker" />
const self = globalThis as unknown as ServiceWorkerGlobalScope;
import ts from "typescript";
import * as sfc from "@vue/compiler-sfc";
import dedent from "dedent";

console.log(`ts loaded`, ts.version);
console.log(`sfc loaded`, sfc.version);
sfc.registerTS(() => ts);

self.addEventListener("install", event => {
	// The promise that skipWaiting() returns can be safely ignored.
	self.skipWaiting();
});

self.addEventListener("activate", event => {
	// 当一个 service worker 被初始注册时，页面在下次加载之前不会使用它。 claim() 方法会立即控制这些页面
	// event.waitUntil(self.clients.claim());
	event.waitUntil(
		self.clients.claim().then(() => {
			console.log("service worker加载完成，执行重启操作");
			sendReload();
		})
	);
});

self.addEventListener("message", event => {
	console.log(event.data);
	const { action } = event.data;
	switch (action) {
		case "reload":
			sendReload();
			break;
		default:
			console.log("Unknown action");
	}
});

function sendReload() {
	self.clients.matchAll().then(clients => {
		clients.forEach(client => {
			client.postMessage({ type: "reload" });
		});
	});
}

interface RequestContext {
	event: FetchEvent;
	request: Request;
	url: URL;
}

function getResponse(data: string, type: string = "text/javascript") {
	return new Response(new Blob([data], { type }), {
		status: 200,
		statusText: "OK",
		headers: new Headers({
			"Content-Type": type,
		}),
	});
}

interface BaseStrategy {
	match(ctx: RequestContext): boolean;
	process(ctx: RequestContext): Promise<Response>;
}

abstract class CompileStrategy implements BaseStrategy {
	abstract match(ctx: RequestContext): boolean;
	abstract transform(ctx: RequestContext, text: string): Promise<Response>;

	// 默认行为：请求源文件，再走 transform
	async process(ctx: RequestContext): Promise<Response> {
		const response = await fetch(ctx.request.url.replace(/\?.*/, ""), {
			method: ctx.request.method,
			// mode: "no-cors",
			headers: new Headers({ "Content-Type": "text/plain" }),
		});

		if (!response.ok) return response;

		const text = await response.text();
		
		try {
			console.log("正在编译", ctx.request.url);
			const result = this.transform(ctx, text);
			console.log(console.log(ctx.request.url, "编译成功"));
			return result;
		} catch(e) {
			console.error(ctx.request.url, "编译失败: ", e);
			return Response.error();
		}
	}
}

/**
 * 将nodejs的模块编译为js module模块，是在html中使用了如下代码:
 * ```js
 * const builtinModules = require("module").builtinModules;
 * if (Array.isArray(builtinModules)) {
 * 	const importMap = {
 * 		imports: {},
 * 	};
 * 	for (const module of builtinModules) {
 * 		importMap.imports[module] = importMap.imports[`node:${module}`] =
 * 			`./noname-builtinModules/${module}`;
 * 	}
 * 	const im = document.createElement("script");
 * 	im.type = "importmap";
 * 	im.textContent = JSON.stringify(importMap);
 * 	document.currentScript.after(im);
 * }
 * ```
 */
class BuiltinModuleStrategy implements BaseStrategy {
	match(ctx: RequestContext): boolean {
		return ctx.url.pathname.startsWith("/noname-builtinModules/");
	}
	async process(ctx: RequestContext): Promise<Response> {
		const moduleName = ctx.request.url.replace(location.origin + "/noname-builtinModules/", "");
		return getResponse(`const module = require('${moduleName}');\nexport default module;`);
	}
}

/**
 * 返回资源的原始内容字符串
 * ```js
 * import string from 'url?raw';
 * ```
 */
class RawResourceStrategy extends CompileStrategy {
	match(ctx: RequestContext): boolean {
		return ctx.url.searchParams.has("raw");
	}
	async transform(ctx: RequestContext, text: string): Promise<Response> {
		return getResponse(`export default ${text}`);
	}
}

/**
 * 返回一个 Web Worker 或 Shared Worker 构造函数
 * ```js
 * import myWorker from 'url?worker';
 * new myWorker();
 *
 * import myWorker2 from 'url?sharedworker';
 * new myWorker2();
 *
 * import myWorker3 from 'url?worker&module';
 * new myWorker3();
 *
 * import myWorker4 from 'url?sharedworker&module';
 * new myWorker4();
 * ```
 */
class WorkerResourceStrategy extends CompileStrategy {
	match(ctx: RequestContext): boolean {
		return ctx.url.searchParams.has("worker") || ctx.url.searchParams.has("sharedworker");
	}
	async transform(ctx: RequestContext, text: string): Promise<Response> {
		return getResponse(dedent`
			const url = new URL(import.meta.url);
			url.searchParams.delete("worker");
			url.searchParams.delete("SharedWorker");
			export default class extends ${ctx.url.searchParams.has("worker") ? "Worker" : "SharedWorker"} {
				constructor() {
					super(url.toString(), { type: url.searchParams.has("module") ? "module" : "classic" });
				}
			};
		`);
	}
}

/**
 * 返回资源的 URL 而不是文件内容
 * ```js
 * import logoUrl from 'logo.png?url';
 * ```
 */
class UrlResourceStrategy extends CompileStrategy {
	match(ctx: RequestContext): boolean {
		return ctx.url.searchParams.has("url");
	}
	async transform(ctx: RequestContext, text: string): Promise<Response> {
		// TODO: 返回资源 URL 字符串
		return getResponse(`
			const url = new URL(import.meta.url);
			url.searchParams.delete("url");
			export default url.toString();
		`);
	}
}

class JSONStrategy extends CompileStrategy {
	match(ctx: RequestContext): boolean {
		// 只处理import关键字发起的请求
		return ctx.url.pathname.endsWith(".json") && !!ctx.request.headers.get("origin");
	}
	async transform(ctx: RequestContext, text: string): Promise<Response> {
		// 兼容import with
		if (ctx.request.headers.get("accept")?.includes("application/json")) {
			return getResponse(text, "application/json");
		}
		return getResponse(`export default ${text}`);
	}
}

class TSStrategy extends CompileStrategy {
	match(ctx: RequestContext): boolean {
		if (!ctx.url.pathname.endsWith(".ts")) return false;
		if (ctx.url.pathname.endsWith(".d.ts")) return false;
		if (ctx.request.headers.get("accept")?.includes("video/mp2t")) return false;
		return true;
	}
	async transform(ctx: RequestContext, text: string): Promise<Response> {
		return getResponse(
			ts.transpile(
				text,
				{
					module: ts.ModuleKind.ES2015,
					target: ts.ScriptTarget.ES2020,
					inlineSourceMap: true,
					resolveJsonModule: true,
					esModuleInterop: true,
				},
				ctx.request.url
			)
		);
	}
}

class CSSStrategy extends CompileStrategy {
	match(ctx: RequestContext): boolean {
		// 只处理import关键字发起的请求
		return ctx.url.pathname.endsWith(".css") && !!ctx.request.headers.get("origin");
	}
	async transform(ctx: RequestContext, text: string): Promise<Response> {
		// 兼容import with
		if (ctx.request.headers.get("accept")?.includes("text/css")) {
			return getResponse(text, "text/css");
		} else {
			const id = Date.now().toString();
			const scopeId = `data-v-${id}`;
			return getResponse(dedent`
				const style = document.createElement('style');
				style.setAttribute('type', 'text/css');
				style.setAttribute('data-vue-dev-id', \`${scopeId}\`);
				style.textContent = ${JSON.stringify(text)};
				document.head.appendChild(style);
			`);
		}
	}
}

class VueSFCStrategy extends CompileStrategy {
	cache = new Map<string, string>();
	match(ctx: RequestContext): boolean {
		return ctx.url.pathname.endsWith(".vue");
	}
	async process(ctx: RequestContext): Promise<Response> {
		if (this.cache.has(ctx.request.url)) {
			return getResponse(this.cache.get(ctx.request.url)!);
		}
		return super.process(ctx);
	}
	async transform(ctx: RequestContext, text: string): Promise<Response> {
		const id = Date.now().toString();
		// 后续处理sourceMap合并
		const { descriptor } = sfc.parse(text, { filename: ctx.request.url, sourceMap: true });
		// console.log({ descriptor });
		const url = new URL(ctx.request.url);

		return getResponse(
			[
				...this.compileScript(url, descriptor, id),
				...this.compileTemplate(url, descriptor, id),
				...this.compileStyle(url, descriptor, id),
			].join("\n")
		);
	}
	compileScript(url: URL, descriptor: sfc.SFCDescriptor, id: string): string[] {
		const scopeId = `data-v-${id}`;
		const hasScoped = descriptor.styles.some(s => s.scoped);

		// 编译 script，因为可能有 script setup，还要进行 css 变量注入
		const script = sfc.compileScript(descriptor, {
			id: scopeId,
			inlineTemplate: true,
			templateOptions: {
				scoped: hasScoped,
				compilerOptions: {
					scopeId: hasScoped ? scopeId : undefined,
				},
			},
		});

		//缓存后续的子请求
		const scriptSearchParams = new URLSearchParams(url.search.slice(1));
		scriptSearchParams.append("type", "script");
		this.cache.set(
			`${url.origin}${url.pathname}?${scriptSearchParams.toString()}`,
			// 重写 default
			sfc
				.rewriteDefault(
					script.attrs && script.attrs.lang == "ts"
						? ts.transpile(
								script.content,
								{
									module: ts.ModuleKind.ES2015,
									target: ts.ScriptTarget.ES2020,
									inlineSourceMap: true,
									resolveJsonModule: true,
									esModuleInterop: true,
								},
								`${url.origin}${url.pathname}?${scriptSearchParams.toString()}`
							)
						: script.content,
					"__sfc_main__"
				)
				.replace(`const __sfc_main__`, `export const __sfc_main__`)
		);
		return [
			`import { __sfc_main__ } from '${url.origin + url.pathname + "?" + scriptSearchParams.toString()}'`,
			`__sfc_main__.__scopeId = '${scopeId}'`,
		];
	}
	compileTemplate(url: URL, descriptor: sfc.SFCDescriptor, id: string): string[] {
		const scopeId = `data-v-${id}`;
		const hasScoped = descriptor.styles.some(s => s.scoped);

		//缓存后续的子请求
		const templateSearchParams = new URLSearchParams(url.search.slice(1));
		templateSearchParams.append("type", "template");
		this.cache.set(
			`${url.origin}${url.pathname}?${templateSearchParams.toString()}`,
			// 编译模板，转换成 render 函数
			sfc.compileTemplate({
				source: descriptor.template ? descriptor.template.content : "",
				filename: url.href, // 用于错误提示
				id: scopeId,
				scoped: hasScoped,
				compilerOptions: {
					scopeId: hasScoped ? scopeId : undefined,
				},
			}).code
			// .replace(`function render(_ctx, _cache) {`, str => str + 'console.log(_ctx);')
		);

		return [
			`import { render } from '${url.origin + url.pathname + "?" + templateSearchParams.toString()}'`,
			`__sfc_main__.render = render;`,
			`export default __sfc_main__;`,
		];
	}
	compileStyle(url: URL, descriptor: sfc.SFCDescriptor, id: string): string[] {
		// 一个 Vue 文件可能有多个 style 标签
		let styleIndex = 0;
		const result: string[] = [];
		for (const styleBlock of descriptor.styles) {
			const styleCode = sfc.compileStyle({
				source: styleBlock.content,
				id,
				filename: url.href,
				scoped: styleBlock.scoped,
			});
			const varName = `el${styleIndex}`;
			const styleDOM = `let ${varName} = document.createElement('style');\n${varName}.innerHTML =  \`${styleCode.code}\`;\ndocument.body.append(${varName});`;
			result.push(styleDOM);
		}
		return result;
	}
}

const strategies: BaseStrategy[] = [
	new BuiltinModuleStrategy(),
	new RawResourceStrategy(),
	new WorkerResourceStrategy(),
	new UrlResourceStrategy(),
	new JSONStrategy(),
	new TSStrategy(),
	new CSSStrategy(),
	new VueSFCStrategy(),
];

const proxyedPath = ["/extension", "/noname-builtinModules/"];
// --- fetch 拦截入口 ---
self.addEventListener("fetch", (event: FetchEvent) => {
	const request = event.request;
	if (typeof request.url !== "string") return;

	const url = new URL(request.url);
	// 非相关请求
	if (url.hostname !== "localhost" && url.hostname !== "127.0.0.1") return;
	if (!proxyedPath.some(i => url.pathname.startsWith(i))) return;

	const ctx: RequestContext = { event, request, url };
	const strategy = strategies.find(s => s.match(ctx));
	if (strategy) {
		try {
			event.respondWith(strategy.process(ctx));
		} catch (e) {
			console.error(request.url,  e);
			event.respondWith(Response.error());
		}
	}
});
