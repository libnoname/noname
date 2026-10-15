import { CodeSnippet, ErrorReporter, ErrorManager } from "./error.ts";

// 沙盒总开关。
//
// false = 关闭，这是当前（也是上游有意为之的）默认值：上游提交
// 3f242939c「fix: close sandbox as sandbox is not suit to open now.」把这里从
// true 改成了 false —— 沙盒一旦开启，所有扩展/模式代码都会走封送与权限检查，
// 与现有扩展生态不兼容。本仓库尊重该决定，保持关闭。
//
// 若将来要打开：把下面改成 true，并注意 init/index.ts 的前置条件
// （非 debug 模式且非 Safari）——不满足时 initializeSandboxRealms 会直接关掉它。
// 打开之前请先跑一轮常用扩展的兼容性测试。
let SANDBOX_ENABLED = false;

// 运行期实际状态：沙盒运行域是否已经成功建立。
//
// 与上面的配置开关分开，是因为调用方 init/index.ts 传进来的 enabled 只表示
// 「当前环境允许启用沙盒」（非 debug、非 Safari）。若把「允许」直接当成
// 「已启用」，那么只要开关是 false 而调用方传 true，就会在没有配置许可的情况下
// 把沙盒打开——正是要避免的事。两者必须同时成立。
let sandboxActive = false;

// 如果要调试沙盒内代码需要开启，否则沙盒内部代码的断点和单步调试将不生效喵
const SANDBOX_DEBUG = true;

// 子运行域启用标记。
//
// sandbox.js 会把这个文件（initRealms.js）在沙盒 iframe 里重新载入一遍，
// 于是子运行域里是一份**全新的模块实例**，读不到顶级域的 SANDBOX_ENABLED。
// 没有这个标记的话，子运行域里 sandbox.js 的 `if (SANDBOX_ENABLED)` 引导块
// 不会执行，也就不会发布 window.SANDBOX_EXPORT，最终 Object.assign 到的是
// undefined —— 静默失败（Object.assign 会忽略 null/undefined）。
// 因此加载 sandbox.js 之前先在 iframe 的 window 上打这个标记。
const SANDBOX_REALM_FLAG = "__noname_sandbox_realm__";

// 执行上下文传递函数，请勿动喵
// 用于传递顶级execute context

/** @type {(target: Function, thiz: Object, args: Array) => any} */
const ContextInvoker1 = function (apply, target, thiz, args) {
	return apply(target, thiz, args);
}.bind(null, Reflect.apply);

/** @type {(target: Function, args: Array, newTarget: Function) => any} */
const ContextInvoker2 = function (construct, target, args, newTarget) {
	return construct(target, args, newTarget);
}.bind(null, Reflect.construct);

/** @type {(closure: Object, target: Function) => ((...args: any[]) => any)} */
const ContextInvokerCreator = function (apply, closure, target) {
	return function (...args) {
		return apply(
			target,
			closure,
			// @ts-expect-error ignore
			[this === window ? null : this, args, new.target]
		);
	};
}.bind(null, Reflect.apply);

/**
 * @param {string} path
 * @param {string} name
 */
function replaceName(path, name) {
	const index = path.lastIndexOf("/");
	return path.slice(0, index + 1) + name;
}

const TARGET_URL = replaceName(import.meta.url, "sandbox.js");
const SANDBOX_EXPORT = {};

async function initializeSandboxRealms(enabled) {
	sandboxActive = false;

	// 必须同时满足：环境允许（enabled）且总开关打开（SANDBOX_ENABLED）。
	if (!enabled || !SANDBOX_ENABLED) {
		return;
	}

	try {
		await setupSandboxRealm();
		sandboxActive = true;
	} catch (e) {
		// 沙盒是加固措施而不是功能开关：初始化失败时回退为「无沙盒运行」，
		// 让游戏还能开局，但绝不静默——否则又会退化成「以为有隔离其实没有」。
		sandboxActive = false;
		console.error("沙盒启用失败，已回退为无沙盒运行。若不需要沙盒，请忽略此条。", e);
	}
}

async function setupSandboxRealm() {
	const document = window.document;
	const createElement = document.createElement.bind(document);
	const appendChild = document.body.appendChild.bind(document.body);

	// 通过构造 iframe 来创建新的变量域
	// 我们需要确保顶级运行域的原型链不暴露
	// 为此我们从新的变量域重新载入当前脚本
	// 然后就可以直接冻结当前变量域的原型链
	const iframe = createElement("iframe");
	iframe.style.display = "none";
	const firefoxLoaded = new Promise(resolve => {
		iframe.onload = resolve;
	});
	appendChild(iframe);

	// Firefox 的 appendChild 居然还是异步的喵_(:з」∠)_
	await firefoxLoaded;

	if (!iframe.contentWindow) {
		throw new ReferenceError("无法载入运行域");
	}

	// 先打上子运行域标记，再做其它注入：sandbox.js 会在载入时立即读取它。
	// @ts-expect-error ignore
	iframe.contentWindow[SANDBOX_REALM_FLAG] = true;

	// 定义 createRealms 函数
	Reflect.defineProperty(iframe.contentWindow, "createRealms", {
		value() {
			// 通过构造 iframe 来创建新的变量域
			const iframe = createElement("iframe");
			iframe.style.display = "none";
			appendChild(iframe);

			const window = iframe.contentWindow;
			if (!window) {
				throw new ReferenceError("顶级域已经被卸载");
			}

			if (!SANDBOX_DEBUG) {
				iframe.remove();
			}

			return window;
		},
	});

	// 传递顶级变量域、上下文执行器、错误管理器
	// @ts-expect-error ignore
	iframe.contentWindow.replacedGlobal = window;
	// @ts-expect-error ignore
	iframe.contentWindow.replacedCI1 = ContextInvoker1;
	// @ts-expect-error ignore
	iframe.contentWindow.replacedCI2 = ContextInvoker2;
	// @ts-expect-error ignore
	iframe.contentWindow.replacedCIC = ContextInvokerCreator;
	// @ts-expect-error ignore
	iframe.contentWindow.replacedErrors = { CodeSnippet, ErrorReporter, ErrorManager };

	// 重新以新的变量域载入当前脚本
	const script = iframe.contentWindow.document.createElement("script");
	script.src = TARGET_URL;
	script.type = "module";

	const promise = new Promise((resolve, reject) => {
		script.onload = resolve;
		script.onerror = reject;
	});
	iframe.contentWindow.document.head.appendChild(script);
	await promise; // Top Await Required Chrome 89

	// @ts-expect-error ignore
	delete iframe.contentWindow.replacedGlobal;
	// @ts-expect-error ignore
	delete iframe.contentWindow.replacedCI1;
	// @ts-expect-error ignore
	delete iframe.contentWindow.replacedCI2;
	// @ts-expect-error ignore
	delete iframe.contentWindow.replacedCIC;
	// @ts-expect-error ignore
	delete iframe.contentWindow.replacedErrors;

	// 子运行域必须已经把导出送了回来。此前缺这一步校验，于是子运行域引导失败
	// （或 SANDBOX_ENABLED 在子域里为 false）时，Object.assign 会静默忽略
	// undefined，SANDBOX_EXPORT 保持空对象，最终在 security/sandbox 里以
	// 「拿到的类全是 undefined」的形式延迟爆炸，极难定位。
	// @ts-expect-error ignore
	const exported = iframe.contentWindow.SANDBOX_EXPORT;
	if (!exported || typeof exported !== "object" || typeof exported.Sandbox !== "function" || typeof exported.Marshal !== "object") {
		throw new ReferenceError("无法同步载入运行域：沙盒 iframe 未发布有效的 SANDBOX_EXPORT");
	}

	Object.assign(SANDBOX_EXPORT, exported);
	if (!SANDBOX_DEBUG) {
		iframe.remove();
	}
}

function isSandboxEnabled() {
	// 子运行域（沙盒 iframe 内重新载入的本模块副本）：只认显式标记。
	// 那里读不到顶级域的运行期状态，若只依赖模块变量，子运行域永远返回 false，
	// sandbox.js 的引导块不会执行，沙盒即便「打开」也无法真正生效。
	// 注意 window 在子运行域里就是该 iframe 的 window。
	if (typeof window !== "undefined" && window[SANDBOX_REALM_FLAG] === true) {
		return true;
	}
	// 顶级域：以「运行域是否真的建立成功」为准，而不是配置开关。
	return sandboxActive;
}

export { initializeSandboxRealms, isSandboxEnabled, SANDBOX_EXPORT };
