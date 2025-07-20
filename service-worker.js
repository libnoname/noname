/// <reference lib="WebWorker" />
/**
 * @type { ServiceWorkerGlobalScope } 提供ServiceWorker的代码提示
 */
// @ts-expect-error transfer type on force.
var self = globalThis;
// 以副作用导入typescript，以保证require也可以同步使用
import './game/typescript.js';
/**
 * @type { import('typescript') }
 */
var ts = globalThis.ts;
// sfc以正常的esmodule使用
import * as sfc from './game/compiler-sfc.esm-browser.js';
import dedent from "./game/dedent.js";
if (typeof ts != 'undefined') {
	console.log(`ts loaded`, ts.version);
} else {
	console.error(`ts undefined`);
}

if (typeof sfc != 'undefined') {
	console.log(`sfc loaded`, sfc.version);
	sfc.registerTS(() => ts);
} else {
	console.error(`sfc undefined`);
}

self.addEventListener("install", (event) => {
	// The promise that skipWaiting() returns can be safely ignored.
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	// 当一个 service worker 被初始注册时，页面在下次加载之前不会使用它。 claim() 方法会立即控制这些页面
	// event.waitUntil(self.clients.claim());
	event.waitUntil(self.clients.claim().then(() => {
		console.log("service worker加载完成，执行重启操作");
		sendReload();
	}));
});

self.addEventListener('message', event => {
	console.log(event.data);
	const { action } = event.data;
	switch (action) {
		case "reload":
			sendReload();
			break;
		default:
			console.log('Unknown action');
	}
});

function sendReload() {
	self.clients.matchAll().then(clients => {
		clients.forEach(client => {
			client.postMessage({ type: 'reload' });
		});
	});
}

/**
 * 将vue编译的结果放在这里，调用的时候直接返回就好了
 */
const vueFileMap = new Map();

const searchParams = ["raw", "worker", "sharedworker", "module", "url"];

self.addEventListener("fetch", event => {
	const request = event.request;
	if (typeof request.url != "string") {
		return;
	}
	const url = new URL(request.url);
	// 直接返回vue编译好的结果
	if (vueFileMap.has(request.url)) {
		const rep = new Response(new Blob([vueFileMap.get(request.url)], { type: "text/javascript" }), {
			status: 200,
			statusText: "OK",
			headers: new Headers({
				"Content-Type": "text/javascript"
			}),
		});
		event.respondWith(rep);
		return;
	}
	if (!['.ts', '.json', '.vue', '.css', '.js'].some(ext => url.pathname.endsWith(ext)) && !request.url.replace(location.origin, '').startsWith('/noname-builtinModules/')) {
		return;
	}
	// 普通js请求不处理
	if (url.pathname.endsWith('.js')) {
		if (url.searchParams.size == 0 || !Array.from(url.searchParams.keys()).some(key => searchParams.includes(key))) {
			return;
		}
	}
	if (url.pathname.endsWith('.ts')) {
		// 不处理视频文件
		if (request.headers.get('accept')?.includes('video/mp2t')) {
			return;
		}
		// 不处理.d.ts文件
		if (url.pathname.endsWith('.d.ts')) {
			return;
		}
	}
	// 只处理import关键字发起的json和css请求
	if (url.pathname.endsWith('.json') || url.pathname.endsWith('.css')) {
		if (!event.request.headers.get('origin')) {
			return;
		}
	}
	/**
	 * 将nodejs的模块编译为js module模块，是在html中使用了如下代码:
	 * ```js
	 * const builtinModules = require("module").builtinModules;
			if (Array.isArray(builtinModules)) {
				const importMap = {
					imports: {},
				};
				for (const module of builtinModules) {
					importMap.imports[module] = importMap.imports[`node:${module}`] =
						`./noname-builtinModules/${module}`;
				}
				const im = document.createElement("script");
				im.type = "importmap";
				im.textContent = JSON.stringify(importMap);
				document.currentScript.after(im);
			}
	 * ```
	 */
	if (request.url.replace(location.origin, '').startsWith('/noname-builtinModules/')) {
		const moduleName = request.url.replace(location.origin + '/noname-builtinModules/', '');
		console.log('正在编译', moduleName);
		let js = `const module = require('${ moduleName }');\nexport default module;`;
		const rep = new Response(new Blob([js], { type: "text/javascript" }), {
			status: 200,
			statusText: "OK",
			headers: new Headers({
				"Content-Type": "text/javascript"
			}),
		});
		console.log(moduleName, '编译成功');
		event.respondWith(Promise.resolve(rep));
		return;
	} else {
		// 请求原文件
		const response = fetch(request.url.replace(/\?.*/, ''), {
			method: request.method,
			// mode: "no-cors",
			headers: new Headers({
				"Content-Type": "text/plain"
			}),
		});
		// 修改请求结果
		event.respondWith(
			response.then(res => {
				if (!res.ok) {
					return res;
				}
				console.log('正在编译', request.url);
				return res.text().then(text => {
					const requestAcceptHeader = request.headers.get('accept');
					// 响应的文件类型
					let responseContentType = 'text/javascript';
					// 返回或编译的文本
					let js = '';
					// 是否经过了静态资源处理
					let resourceProcessingCompleted = false;
					// 静态资源处理
					if (url.searchParams.size > 0) {
						/**
						 * 返回资源的原始内容字符串
						 * ```js
						 * import string from 'url?raw';
						 * ```
						 */
						if (url.searchParams.has('raw')) {
							resourceProcessingCompleted = true;
							js = `export default ${ JSON.stringify(text) };`;
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
						else if (url.searchParams.has('worker') || url.searchParams.has('sharedworker')) {
							resourceProcessingCompleted = true;
							// const blob = new Blob([text], { type: 'application/javascript' });
							// const url = URL.createObjectURL(blob);
							// const worker = new Worker(url);
							js = dedent`
							const url = new URL(import.meta.url);
							url.searchParams.delete("worker");
							url.searchParams.delete("SharedWorker");
							export default class extends ${ url.searchParams.has('worker') ? "Worker" : "SharedWorker" } {
								constructor() {
									super(url.toString(), { type: url.searchParams.has("module") ? "module" : "classic" });
								}
							};
							`;
						}
						/**
						 * 返回资源的 URL 而不是文件内容
						 * ```js
						 * import logoUrl from 'logo.png?url';
						 * ```
						 */
						else if (url.searchParams.has('url')) {
							resourceProcessingCompleted = true;
							js = `
								const url = new URL(import.meta.url);
								url.searchParams.delete("url");
								export default url.toString();
							`;
						}
					}
					if (!resourceProcessingCompleted) {
						if (request.url.endsWith('.json')) {
							// 兼容import with
							if (requestAcceptHeader?.includes('application/json')) {
								js = text;
								responseContentType = 'application/json';
							}
							else {
								js = `export default ${ text }`;
							}
						} else if (request.url.endsWith('.ts')/* || request.url.endsWith('.js')*/) {
							js = ts.transpile(text, {
								module: ts.ModuleKind.ES2015,
								target: ts.ScriptTarget.ES2020,
								inlineSourceMap: true,
								resolveJsonModule: true,
								esModuleInterop: true,
							}, request.url);
						} else if (request.url.endsWith('css')) {
							// 兼容import with
							if (requestAcceptHeader?.includes('text/css')) {
								js = text;
								responseContentType = 'text/css';
							}
							else {
								const id = Date.now().toString();
								const scopeId = `data-v-${ id }`;
								js = dedent`
									const style = document.createElement('style');
									style.setAttribute('type', 'text/css');
									style.setAttribute('data-vue-dev-id', \`${ scopeId }\`);
									style.textContent = ${ JSON.stringify(text) };
									document.head.appendChild(style);
								`;
							}
						} else if (request.url.endsWith('.vue')) {
							const id = Date.now().toString();
							const scopeId = `data-v-${ id }`;
							// 后续处理sourceMap合并
							const { descriptor } = sfc.parse(text, { filename: request.url, sourceMap: true });
							// console.log({ descriptor });
							const hasScoped = descriptor.styles.some(s => s.scoped);
							// 编译 script，因为可能有 script setup，还要进行 css 变量注入
							const script = sfc.compileScript(descriptor, {
								id: scopeId,
								inlineTemplate: true,
								templateOptions: {
									scoped: hasScoped,
									compilerOptions: {
										scopeId: hasScoped ? scopeId : undefined,
									}
								},
							});
							// 用于存放代码，最后 join('\n') 合并成一份完整代码
							const codeList = [];
							// 保存url并且拼接参数
							const url = new URL(request.url);
							const scriptSearchParams = new URLSearchParams(url.search.slice(1));
							scriptSearchParams.append('type', 'script');
							const templateSearchParams = new URLSearchParams(url.search.slice(1));
							templateSearchParams.append('type', 'template');
							vueFileMap.set(
								`${url.origin}${url.pathname}?${scriptSearchParams.toString()}`,
								// 重写 default
								sfc.rewriteDefault(script.attrs && script.attrs.lang == 'ts' ? ts.transpile(script.content, {
									module: ts.ModuleKind.ES2015,
									target: ts.ScriptTarget.ES2020,
									inlineSourceMap: true,
									resolveJsonModule: true,
									esModuleInterop: true,
								}, `${url.origin}${url.pathname}?${scriptSearchParams.toString()}`) : script.content, "__sfc_main__")
									.replace(`const __sfc_main__`, `export const __sfc_main__`)
							);
	
							codeList.push(`import { __sfc_main__ } from '${ url.origin + url.pathname + '?' + scriptSearchParams.toString() }'`);
							codeList.push(`__sfc_main__.__scopeId = '${ scopeId }'`);
	
							// 编译模板，转换成 render 函数
							const template = sfc.compileTemplate({
								source: descriptor.template ? descriptor.template.content : '',
								filename: request.url, // 用于错误提示
								id: scopeId,
								scoped: hasScoped,
								compilerOptions: {
									scopeId: hasScoped ? scopeId : undefined,
								}
							});
	
							vueFileMap.set(
								`${url.origin}${url.pathname}?${templateSearchParams.toString()}`,
								template.code
								// .replace(`function render(_ctx, _cache) {`, str => str + 'console.log(_ctx);')
							);
							
							codeList.push(`import { render } from '${ url.origin + url.pathname + '?' + templateSearchParams.toString() }'`);
							codeList.push(`__sfc_main__.render = render;`);
							codeList.push(`export default __sfc_main__;`);
							// 一个 Vue 文件，可能有多个 style 标签
							let styleIndex = 0;
							for (const styleBlock of descriptor.styles) {
								const styleCode = sfc.compileStyle({
									source: styleBlock.content,
									id,
									filename: request.url,
									scoped: styleBlock.scoped,
								});
								const varName = `el${ styleIndex }`;
								const styleDOM = `let ${ varName } = document.createElement('style');\n${ varName }.innerHTML =  \`${ styleCode.code }\`;\ndocument.body.append(${ varName });`;
								codeList.push(styleDOM);
							}
							js = codeList.join('\n');
							// console.log(js);
						}
					}

					const rep = new Response(new Blob([js], { type: responseContentType }), {
						status: res.status,
						statusText: "OK",
						headers: new Headers({
							"Content-Type": responseContentType
						}),
					});
					console.log(request.url, '编译成功');
					return rep;
				})
			})
			.catch(e => {
				console.error(request.url, '编译失败: ', e);
				throw e;
			})
		);
		return;
	}
});
