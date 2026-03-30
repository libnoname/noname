// 声明：沙盒维护的是服务器秩序，让服务器秩序不会因为非房主的玩家以及旁观者的影响，并在此基础上维护玩家设备不受危险代码攻击
// 但沙盒不会也没有办法维护恶意服务器/房主对于游戏规则的破坏，请玩家尽量选择官方或其他安全的服务器，同时选择一个受信任的玩家作为房主

import { MD5 } from "crypto-js";

// 是否强制所有模式下使用沙盒
const SANDBOX_FORCED = false;
// 是否启用自动测试
const SANDBOX_AUTOTEST = false;
// 是否禁用自动测试延迟
// 这将放弃渲染，在游戏结束前无响应
const SANDBOX_AUTOTEST_NODELAY = false;
// 沙盒开发模式
const SANDBOX_DEV = false;

const WSURL_FOR_IP = /ws:\/\/(\d+.\d+.\d+.\d+):\d+\//;

/** @type {readonly string[]} */
const TRUSTED_IPS = Object.freeze([]); // 标记哪些服务器IP是可信任的
/** @type {readonly string[]} */
const TRUSTED_IP_MD5 = Object.freeze([
	// 被拷打了喵 > <
]); // 标记哪些服务器IP的MD5是可信任的，MD5计算方式是`md5("noname_server" + ip)`

// 声明导入类
/** @type {boolean} */
let SANDBOX_ENABLED = true;
/** @type {typeof import("./sandbox.js").AccessAction} */
let AccessAction;
/** @type {typeof import("./sandbox.js").Domain} */
let Domain;
/** @type {typeof import("./sandbox.js").Marshal} */
let Marshal;
/** @type {typeof import("./sandbox.js").Monitor} */
let Monitor;
/** @type {typeof import("./sandbox.js").Rule} */
let Rule;
/** @type {typeof import("./sandbox.js").Sandbox} */
let Sandbox;

/** @typedef {import("./sandbox.js").AccessAction} AccessAction */
/** @typedef {import("./sandbox.js").Domain} Domain */
/** @typedef {import("./sandbox.js").Marshal} Marshal */
/** @typedef {import("./sandbox.js").Monitor} Monitor */
/** @typedef {import("./sandbox.js").Rule} Rule */
/** @typedef {import("./sandbox.js").Sandbox} Sandbox */

/** @type {boolean} */
let initialized = false;
/** @type {Sandbox} */
let defaultSandbox;

/** @type {Array<Sandbox>} */
const sandboxStack = [];

// 沙盒Function类型缓存
/** @type {WeakMap<Sandbox, Array<typeof Function>>} */
const isolatedsMap = new WeakMap();

// noname 顶级变量
/** @type {Object<string|symbol, any>} */
const topVariables = {
	lib: null,
	game: null,
	ui: null,
	get: null,
	ai: null,
	_status: null,
};

// eval保存
const defaultEval = window.eval;

// 对于 `lib.init.start` 的首次编译我们放宽
let initStartParsed = false;
// 是否软启用沙盒
let sandBoxRequired = SANDBOX_FORCED;

// 可能的垫片函数
const pfPrototypes = ["Object", "Array", "String", "Map"]; // 传递的实例垫片
const pfNamespaces = ["Object", "Array", "Reflect", "Math", "Promise"]; // 传递的静态垫片
// 可能还要补充喵？
const nativePattern = /\{ \[native code\] \}$/;

// 垫片备份
const polyfills = {
	prototypes: {},
	namespaces: {},
};

// 被封装的Function类型
/** @type {typeof Function} */
let ModFunction;
/** @type {typeof Function} */
let ModGeneratorFunction;
/** @type {typeof Function} */
let ModAsyncFunction;
/** @type {typeof Function} */
let ModAsyncGeneratorFunction;

/**
 * ```plain
 * 将一个沙盒作为当前联网传输的运行沙盒
 * ```
 *
 * @param {Sandbox} box
 */
function enterSandbox(box) {
	if (!SANDBOX_ENABLED) {
		return;
	}
	if (!(box instanceof Sandbox)) {
		throw new TypeError("无效的沙盒对象");
	}

	if (!Domain.isBelievable(Domain.topDomain)) {
		throw new Error("无法在沙盒里面访问");
	}

	sandboxStack.push(box);
}

/**
 * ```plain
 * 退出当前联网传输的运行沙盒
 * ```
 */
function exitSandbox() {
	if (!SANDBOX_ENABLED) {
		return;
	}

	if (!Domain.isBelievable(Domain.topDomain)) {
		throw new Error("无法在沙盒里面访问");
	}
	if (!sandboxStack.length) {
		throw new ReferenceError("无法弹出更多的沙盒");
	}

	sandboxStack.pop();
}

/**
 * ```plain
 * 判断对象是否是安全对象
 * ```
 *
 * @param {Object?} obj 要检查的对象
 * @param {string?} prop 指定要检查的属性描述符
 */
function isUnsafeObject(obj, prop = null) {
	if (!SANDBOX_ENABLED) {
		return true;
	}

	if (prop != null) {
		const descriptor = Object.getOwnPropertyDescriptor(obj, prop);

		if (descriptor) {
			if (descriptor.get && isUnsafeObject(descriptor.get)) {
				return true;
			}
			if (descriptor.set && isUnsafeObject(descriptor.set)) {
				return true;
			}
			if (isUnsafeObject(descriptor.value)) {
				return true;
			}
		}
	}

	if (isPrimitive(obj)) {
		return false;
	}

	return !Domain.topDomain.isFrom(obj);
}

/**
 * ```plain
 * 确保对象是安全对象
 * ```
 *
 * @param {Object?} obj 要检查的对象
 * @param {string?} prop 指定要检查的属性描述符
 */
function assertSafeObject(obj, prop = null) {
	if (isUnsafeObject(obj, prop)) {
		throw new Error("unsafe object denied");
	}
}

/**
 * @param {Object?} obj
 */
function isPrimitive(obj) {
	return Object(obj) !== obj;
}

/**
 * ```plain
 * 获取当前指定的联网传输运行沙盒
 * ```
 *
 * @returns {Sandbox?}
 */
function currentSandbox() {
	if (!SANDBOX_ENABLED) {
		return null;
	}

	return sandboxStack[sandboxStack.length - 1] || defaultSandbox;
}

/**
 * ```plain
 * 进入沙盒运行模式
 * ```
 */
function requireSandbox() {
	sandBoxRequired = true;
}

const GRANTED_LIST_KEY = "security_grantedServers";

/**
 * @param {string} key 
 * @returns {Record<string,boolean>}
 */
function readStorage(key) {
	const value = localStorage.getItem(key);

	if (!value) {
		return {};
	}

	const mayArray = JSON.parse(value);

	if (!mayArray || typeof mayArray != "object") {
		return {};
	}

	return mayArray;
}

/**
 * 重置受信任的服务器列表
 */
function resetGrantedServers() {
	localStorage.removeItem(GRANTED_LIST_KEY);
}

/**
 * @param {string} ip 
 * @returns {boolean}
 */
function alertForServer(ip) {
	const grantedList = readStorage(GRANTED_LIST_KEY);
	const granted = grantedList[ip];

	if (granted != null) {
		return !!granted;
	}

	const newResult = alertForNewServer();
	grantedList[ip] = newResult;
	localStorage.setItem(GRANTED_LIST_KEY, JSON.stringify(grantedList));
	return newResult;
}

/**
 * @returns {boolean}
 */
function alertForNewServer() {
	const tips = [
		"您登录的服务器不在受信任的列表中，是否要信任来自服务器的代码?",
		"\n如果您信任此服务器则可以选择“确定”，否则您应该选择“取消”来启动隔离沙盒。",
		"请注意：开启隔离沙盒可能会让服务器部分功能受限，以此换取更安全的执行环境。",
		"\n另外，您无论如何选择都可以随时通过点击“联机模式选项-更多-重置受信任的服务器列表”来重置您的选择。"
	];

	return confirm(tips.join("\n"));
}

/**
 * ```plain
 * 检查服务器地址并请求进入沙盒运行模式
 * ```
 *
 * @param {string} ip
 */
function requireSandboxOn(ip) {
	let isTrusted = false;

	if (ip) {
		isTrusted = TRUSTED_IPS.includes(ip);

		if (!isTrusted && TRUSTED_IP_MD5.length > 0) {
			const md5 = MD5("noname_server" + ip).toString();
			isTrusted = TRUSTED_IP_MD5.includes(md5);
		}

		if (!isTrusted) {
			isTrusted = alertForServer(ip);
		}
	}

	if (!isTrusted) {
		sandBoxRequired = true;
		return;
	}

	if (SANDBOX_FORCED && topVariables.game && topVariables.game.ws) {
		const match = WSURL_FOR_IP.exec(topVariables.game.ws.url);

		if (match && match[1] === ip) {
			sandBoxRequired = false;
		}
	}
}

/**
 * ```plain
 * 判断是否是沙盒运行模式
 * ```
 *
 * @returns {boolean}
 */
function isSandboxRequired() {
	return SANDBOX_ENABLED && sandBoxRequired;
}

/**
 * ```plain
 * 是否可以跳过沙盒进行编译
 * ```
 *
 * @param {any} item
 * @returns {boolean}
 */
function canSkipSandbox(item) {
	if (!topVariables.lib) {
		return false;
	}

	if (item === topVariables.lib.init.start) {
		if (!initStartParsed) {
			initStartParsed = true;
			return true;
		}
	}

	return false;
}

/**
 * ```plain
 * 简单的、不带上下文的模拟eval函数
 *
 * 自动根据沙盒的启用状态使用不同的实现
 * ```
 *
 * @param {any} x
 * @returns {any}
 */
function _eval(x) {
	if (!SANDBOX_ENABLED || !sandBoxRequired) {
		new Function(x);
		const topVars = Object.assign({}, topVariables);
		const vars = "_" + Math.random().toString(36).slice(2);
		return new Function(vars, `with(${vars}){${x}}`)(topVars);
	}

	return defaultSandbox.exec(x);
}

/**
 * ```plain
 * 携带简单上下文的eval函数
 *
 * 自动根据沙盒的启用状态使用不同的实现
 * ```
 *
 * @param {any} x
 * @param {Object} scope
 * @returns {any}
 */
function _exec(x, scope = {}) {
	if (isPrimitive(scope)) {
		scope = {};
	}

	if (!SANDBOX_ENABLED || !sandBoxRequired) {
		// 如果没有沙盒，则进行简单模拟
		new Function(x);
		const topVars = Object.assign({}, topVariables);
		const vars = "__vars_" + Math.random().toString(36).slice(2);
		const name = "__scope_" + Math.random().toString(36).slice(2);
		return new Function(vars, name, `with(${vars}){with(${name}){${x}}}`)(topVars, scope);
	}

	return defaultSandbox.exec(x, scope);
}

/**
 * ```plain
 * 携带简单上下文的eval函数，并返回scope
 * eval代码的返回值将覆盖 `scope.return` 这个属性
 * 另外任意因对未定义变量赋值导致全局变量赋值的行为将被转移到scope里面
 * （替代eval的对策函数，具体看下面的例子）
 *
 * 自动根据沙盒的启用状态使用不同的实现
 *
 * 下面是 `security.exec2` 的使用示例:
 * ```
 * @example
 * ```javascript
 * // 执行一段代码并获取赋值的多个变量
 * let { return: skill, filter, content } = security.exec2(`
 *     filter = (e, p) => e.source && e.source == p;
 *     content = async (e, t, p) => t.cancel();
 *     return { filter, content };
 * `, { content: () => {}, lib, game, ui, get, ai, _status, }); // 提供默认的content，提供六个变量
 * ```
 *
 * @param {any} x
 * @param {Object|"window"} scope 传入一个对象作为上下文，或者传入 "window" 来生成一个包含指向自身的 `window` 属性的对象
 * @returns {Object}
 */
function _exec2(x, scope = {}) {
	if (scope == "window") {
		scope = {};
		scope.window = scope;
	} else if (isPrimitive(scope)) {
		scope = {};
	}

	if (!SANDBOX_ENABLED || !sandBoxRequired) {
		// 如果没有沙盒，则进行简单模拟
		// 进行语法检查
		new Function(x);

		// 构造拦截器
		const intercepter = new Proxy(scope, {
			get(target, prop, receiver) {
				if (prop === Symbol.unscopables) {
					return undefined;
				}

				if (!Reflect.has(target, prop) && !Reflect.has(window, prop)) {
					throw new ReferenceError(`"${String(prop)}" is not defined`);
				}

				return Reflect.get(target, prop, receiver) || topVariables[prop] || window[prop];
			},
			has(target, prop) {
				return true;
			},
		});

		const result = new Function("_", `with(_){return(()=>{"use strict";\n${x}})()}`)(intercepter);
		scope.return = result;
		return scope;
	}

	const [result] = defaultSandbox.exec2(x, scope);
	scope.return = result;
	return scope;
}

/**
 * ```plain
 * 初始化模块
 * ```
 */
async function initSecurity({ lib, game, ui, get, ai, _status }) {
	if (initialized) {
		throw new Error("security 已经被初始化过了");
	}

	const sandbox = await import("./sandbox.js");
	SANDBOX_ENABLED = sandbox.SANDBOX_ENABLED;

	if (SANDBOX_ENABLED) {
		AccessAction = sandbox.AccessAction;
		Domain = sandbox.Domain;
		Marshal = sandbox.Marshal;
		Monitor = sandbox.Monitor;
		Rule = sandbox.Rule;
		Sandbox = sandbox.Sandbox;
	}

	topVariables.lib = lib;
	topVariables.game = game;
	topVariables.ui = ui;
	topVariables.get = get;
	topVariables.ai = ai;
	topVariables._status = _status;

	if (!SANDBOX_ENABLED) {
		return;
	}

	loadPolyfills();
	initSerializeNeeded();
	initIsolatedEnvironment();

	// 不允许被远程代码访问的game函数
	const ioFuncs = ["download", "readFile", "readFileAsText", "writeFile", "removeFile", "getFileList", "ensureDirectory", "createDir", "removeDir", "checkForUpdate", "checkForAssetUpdate", "importExtension", "export", "multiDownload2", "multiDownload", "fetch"];

	const accessDenieds = [
		...ioFuncs.map(n => game[n]).filter(Boolean),
		...Object.values(game.promises),
		defaultEval,
		localStorage.setItem,
		window.require,
		// @ts-expect-error There's
		window.define,
	];

	// 构造禁止函数调用的规则
	const callRule = new Rule();
	callRule.canMarshal = false; // 禁止获取函数
	callRule.setGranted(AccessAction.CALL, false); // 禁止函数调用
	callRule.setGranted(AccessAction.NEW, false); // 禁止函数new调用

	// 为禁止的函数设置规则
	accessDenieds.filter(Boolean).forEach(o => {
		Marshal.setRule(o, callRule);
	});

	// 构造暴露类型的使用规则
	// 对于要使用instanceof的类型应该限制沙盒如何使用
	const exposedClassRule = new Rule();

	exposedClassRule.canMarshal = true; // 允许获取这些类对象
	exposedClassRule.setGranted(AccessAction.NEW, false); // 禁止不安全代码创建这些类的对象
	exposedClassRule.setGranted(AccessAction.WRITE, false); // 禁止不安全代码更改这些类的属性
	exposedClassRule.setGranted(AccessAction.DELETE, false); // 禁止不安全代码删除这些类的属性
	exposedClassRule.setGranted(AccessAction.DEFINE, false); // 禁止不安全代码重定义这些类的属性
	exposedClassRule.setGranted(AccessAction.DESCRIBE, false); // 禁止不安全代码获取这些类的属性描述符
	exposedClassRule.setGranted(AccessAction.TRACE, false); // 禁止不安全代码获取这些类的原型
	exposedClassRule.setGranted(AccessAction.META, false); // 禁止不安全代码更改这些类的原型

	// 为所有Event类型应用上面的规则
	Reflect.ownKeys(globalThis)
		.filter(key => typeof key == "string")
		.filter(key => /^\w*?Event$/.test(key))
		.map(key => globalThis[key])
		.forEach(o => Marshal.setRule(o, exposedClassRule));

	// 构造禁止访问的规则
	const bannedRule = new Rule();
	bannedRule.canMarshal = false; // 禁止获取
	bannedRule.setGranted(AccessAction.READ, false); // 禁止读取属性
	bannedRule.setGranted(AccessAction.WRITE, false); // 禁止写入属性
	bannedRule.setGranted(AccessAction.DELETE, false); // 禁止删除属性
	bannedRule.setGranted(AccessAction.DEFINE, false); // 禁止定义属性
	bannedRule.setGranted(AccessAction.DESCRIBE, false); // 禁止描述属性
	bannedRule.setGranted(AccessAction.TRACE, false); // 禁止获取原型
	bannedRule.setGranted(AccessAction.META, false); // 禁止设置原型

	// 禁止访问关键对象
	[
		lib.cheat,
		lib.node,
		lib.message,
		window.process,
		window.module,
		window.exports,
		window.cordova,
		window.NonameAndroidBridge,
		window.noname_shijianInterfaces,
		window,
	]
		.filter(Boolean)
		.forEach(o => Marshal.setRule(o, bannedRule));

	// 构造禁止修改的规则
	const writeRule = new Rule();
	writeRule.setGranted(AccessAction.WRITE, false); // 禁止写入属性
	writeRule.setGranted(AccessAction.DEFINE, false); // 禁止重定义属性
	// 禁止修改 game.promises 的函数
	Marshal.setRule(game.promises, writeRule);
	// 禁止修改 localStorage
	Marshal.setRule(localStorage, writeRule);

	// 对于 game 当中访问特定函数我们通过 Monitor 进行拦截
	new Monitor()
		// 如果是写入或重定义属性
		.action(AccessAction.WRITE)
		.action(AccessAction.DEFINE)
		// 如果目标是 game 的 ioFuncs 包含的所有函数
		.require("target", game)
		.require("property", ...ioFuncs)
		.require("property", "ws", "sandbox")
		// 抛出异常
		.then((access, nameds, control) => {
			throw new Error(`有不信任的代码修改 \`game.${String(nameds.property)}\` 属性`);
		})
		// 让 Monitor 开始工作
		.start(); // 差点忘记启动了喵

	// 监听原型、toStringTag的更改
	const toStringTag = Symbol.toStringTag;
	new Monitor()
		.action(AccessAction.WRITE)
		.action(AccessAction.DEFINE)
		.action(AccessAction.META)
		.require("property", toStringTag)
		.then((access, nameds, control) => {
			// 阻止原型、toStringTag的更改
			control.preventDefault();
			control.stopPropagation();
			control.setReturnValue(false);
		})
		.start();

	if (SANDBOX_AUTOTEST) {
		// 一个测试循环喵
		Reflect.defineProperty(lib.element.GameEvent.prototype, "animate", {
			get: () => undefined,
			set() {},
			enumerable: false,
			configurable: false,
		});

		if (!lib.videos) {
			lib.videos = [];
		}

		game.over = function (...args) {
			if (_status.over) {
				return;
			}
			_status.over = true;
			setTimeout(
				() => {
					if (!_status.auto) {
						return;
					}

					const count = parseInt(localStorage.getItem("__sandboxTestCount") || "0");
					localStorage.setItem("__sandboxTestCount", String(count + 1));

					localStorage.setItem(lib.configprefix + "directstart", "true");
					game.reload();
				},
				SANDBOX_AUTOTEST_NODELAY ? 5000 : 1000
			);
		};

		lib.arenaReady.push(() =>
			setTimeout(() => {
				if (SANDBOX_AUTOTEST_NODELAY) {
					game.resume = () => {};
					game.pause = () => {};
				}
				game.delay = game.delayx = () => {};
				game.asyncDelay = game.asyncDelayx = async () => {};

				ui.auto.click();
			}, 1000)
		);
	}

	initialized = true;
}

/**
 * ```plain
 * 创建一个新的沙盒
 * ```
 *
 * @param {string} persistId 
 * @returns {Sandbox?}
 */
function createSandbox(persistId) {
	if (!SANDBOX_ENABLED) {
		return null;
	}

	const box = new Sandbox(persistId);
	box.freeAccess = true;
	box.domAccess = true;
	box.initBuiltins();

	// 向沙盒提供顶级运行域的文档对象
	// TODO: 仅提供必要的document函数(?)
	box.document = document;

	// 传递七个变量
	Object.assign(box.scope, topVariables);
	// 复制垫片函数
	setupPolyfills(box);

	box.pushScope();
	return box;
}

/**
 * ```plain
 * 导出当前沙盒的Function类型
 * ```
 *
 * @param {Sandbox} sandbox
 * @returns {Array<typeof Function>}
 */
function getIsolateds(sandbox) {
	let isolateds = isolatedsMap.get(sandbox);

	if (isolateds) {
		return isolateds.slice();
	}

	// 获取当前沙盒的Function类型
	isolateds = Array.from(
		sandbox.exec(`
		return [
			(function(){}).constructor,
			(function*(){}).constructor,
			(async function(){}).constructor,
			(async function*(){}).constructor,
		];
	`)
	);

	isolatedsMap.set(sandbox, isolateds);
	return isolateds.slice();
}

/**
 * ```plain
 * 根据传入对象的运行域获取对应的Function类型
 * ```
 *
 * @param {Object} item
 * @returns {Array<typeof Function>}
 */
function getIsolatedsFrom(item) {
	if (canSkipSandbox(item) || !SANDBOX_ENABLED) {
		return [defaultFunction, defaultGeneratorFunction, defaultAsyncFunction, defaultAsyncGeneratorFunction];
	}

	const domain = Marshal.getMarshalledDomain(item) || Domain.caller;

	// 非顶级域调用情况下我们替换掉Function类型
	if (domain && domain !== Domain.topDomain) {
		const box = Sandbox.from(domain);

		if (!box) {
			throw new Error("意外的运行域: 运行域没有绑定沙盒");
		}

		return getIsolateds(box);
	}

	return [ModFunction, ModGeneratorFunction, ModAsyncFunction, ModAsyncGeneratorFunction];
}

/**
 * ```plain
 * 导入 `sandbox.js` 的相关类
 *
 * 请注意，这需要先判断 `security.isSandboxRequired()`
 * ```
 *
 * @returns {{
 *     AccessAction: typeof import("./sandbox.js").AccessAction,
 *     Domain: typeof import("./sandbox.js").Domain,
 *     Marshal: typeof import("./sandbox.js").Marshal,
 *     Monitor: typeof import("./sandbox.js").Monitor,
 *     Rule: typeof import("./sandbox.js").Rule,
 *     Sandbox: typeof import("./sandbox.js").Sandbox,
 * }}
 */
function importSandbox() {
	if (!AccessAction) {
		throw new ReferenceError("sandbox.js 还没有被载入");
	}

	return {
		AccessAction,
		Domain,
		Marshal,
		Monitor,
		Rule,
		Sandbox,
	};
}

// 原本的Function类型记录
/** @type {typeof Function} */
// @ts-expect-error Make the type right
const defaultFunction = function () {}.constructor;
/** @type {typeof Function} */
// @ts-expect-error Make the type right
const defaultGeneratorFunction = function* () {}.constructor;
/** @type {typeof Function} */
// @ts-expect-error Make the type right
const defaultAsyncFunction = async function () {}.constructor;
/** @type {typeof Function} */
// @ts-expect-error Make the type right
const defaultAsyncGeneratorFunction = async function* () {}.constructor;

/**
 * ```plain
 * 初始化顶级域的Funcion类型封装
 * ```
 */
function initIsolatedEnvironment() {
	// @ts-expect-error Not be null
	defaultSandbox = createSandbox(); // 所有 eval、parsex 代码全部丢进去喵

	// 对于 defaultSandbox 我们要补充一些东西喵
	defaultSandbox.scope.localStorage = localStorage;

	// 对Function类型进行包裹
	/** @type {Array<typeof Function>} */
	const [IsolatedFunction, IsolatedGeneratorFunction, IsolatedAsyncFunction, IsolatedAsyncGeneratorFunction] = getIsolateds(defaultSandbox);

	// 封装Function类型

	ModFunction = new Proxy(defaultFunction, {
		apply(target, thisArg, argumentsList) {
			if (!sandBoxRequired) {
				return new target(...argumentsList);
			}

			return new IsolatedFunction(...argumentsList);
		},
		construct(target, argumentsList, newTarget) {
			if (!sandBoxRequired) {
				return new target(...argumentsList);
			}

			return new IsolatedFunction(...argumentsList);
		},
	});

	/** @type {typeof Function} */
	ModGeneratorFunction = new Proxy(defaultGeneratorFunction, {
		apply(target, thisArg, argumentsList) {
			if (!sandBoxRequired) {
				return new target(...argumentsList);
			}

			return new IsolatedGeneratorFunction(...argumentsList);
		},
		construct(target, argumentsList, newTarget) {
			if (!sandBoxRequired) {
				return new target(...argumentsList);
			}

			return new IsolatedGeneratorFunction(...argumentsList);
		},
	});

	/** @type {typeof Function} */
	ModAsyncFunction = new Proxy(defaultAsyncFunction, {
		apply(target, thisArg, argumentsList) {
			if (!sandBoxRequired) {
				return new target(...argumentsList);
			}

			return new IsolatedAsyncFunction(...argumentsList);
		},
		construct(target, argumentsList, newTarget) {
			if (!sandBoxRequired) {
				return new target(...argumentsList);
			}

			return new IsolatedAsyncFunction(...argumentsList);
		},
	});

	/** @type {typeof Function} */
	ModAsyncGeneratorFunction = new Proxy(defaultAsyncGeneratorFunction, {
		apply(target, thisArg, argumentsList) {
			if (!sandBoxRequired) {
				return new target(...argumentsList);
			}

			return new IsolatedAsyncGeneratorFunction(...argumentsList);
		},
		construct(target, argumentsList, newTarget) {
			if (!sandBoxRequired) {
				return new target(...argumentsList);
			}

			return new IsolatedAsyncGeneratorFunction(...argumentsList);
		},
	});

	function rewriteCtor(prototype, newCtor) {
		const descriptor = Object.getOwnPropertyDescriptor(prototype, "constructor") || { configurable: true, writable: true, enumerable: false };
		if (!descriptor.configurable) {
			throw new TypeError("无法覆盖不可配置的构造函数");
		}
		descriptor.value = newCtor;
		Reflect.defineProperty(prototype, "constructor", descriptor);
	}

	// 覆盖所有的Function类型构造函数
	window.Function = ModFunction;
	rewriteCtor(defaultFunction.prototype, ModFunction);
	rewriteCtor(defaultGeneratorFunction.prototype, ModGeneratorFunction);
	rewriteCtor(defaultAsyncFunction.prototype, ModAsyncFunction);
	rewriteCtor(defaultAsyncGeneratorFunction.prototype, ModAsyncGeneratorFunction);
}

/**
 * ```plain
 * 初始化需要额外序列化的函数
 *
 * 适配扩展，当在skillcontent里面调用皮切的playEffect时会报错
 * ```
 */
function initSerializeNeeded() {
	const structuredClone = window.structuredClone;
	const deepClone = (/** @type {any} */ obj) => {
		try {
			return structuredClone(obj);
		} catch (e) {
			return obj;
		}
	};

	/** @type {Array<[string, number[]]>} */
	const funcList = [["Worker.prototype.postMessage", [0]]];

	for (const [funcCode, argIndexes] of funcList) {
		const originalFunc = new Function(`return ${funcCode}`)();
		const newFunc = /** @this {any} */ function (/** @type {any[]} */ ...args) {
			for (const index of argIndexes) {
				args[index] = deepClone(args[index]);
			}

			return originalFunc.apply(this, args);
		};

		new Function("_", `${funcCode} = _;`)(newFunc);
	}
}

/**
 * ```plain
 * 加载当前的垫片函数
 * ```
 */
function loadPolyfills() {
	function isNativeDescriptor(descriptor) {
		if (typeof descriptor.value == "function" && !nativePattern.test(descriptor.value.toString())) {
			return false;
		}
		if (typeof descriptor.get == "function" && !nativePattern.test(descriptor.get.toString())) {
			return false;
		}
		if (typeof descriptor.set == "function" && !nativePattern.test(descriptor.set.toString())) {
			return false;
		}

		return true;
	}

	function copyDescriptors(top, box) {
		for (const key of Reflect.ownKeys(top)) {
			const descriptor = Reflect.getOwnPropertyDescriptor(top, key);

			// if (!descriptor
			// 	|| (typeof descriptor.value !== "function"
			// 		&& !descriptor.get && !descriptor.set))
			// 	continue;

			// if (isNativeDescriptor(descriptor))
			// 	continue;

			box[key] = descriptor;
		}
	}

	// 将垫片函数的描述器复制出来

	for (const key of pfPrototypes) {
		const top = window[key];

		if (!top || !top.prototype) {
			continue;
		}

		copyDescriptors(top.prototype, (polyfills.prototypes[key] = {}));
	}

	for (const key of pfNamespaces) {
		const top = window[key];

		if (!top) {
			continue;
		}

		copyDescriptors(top, (polyfills.namespaces[key] = {}));
	}
}

/**
 * ```plain
 * 初始化沙盒的垫片
 * ```
 *
 * @param {Sandbox} sandbox
 */
function setupPolyfills(sandbox) {
	const context = {
		pfPrototypes,
		pfNamespaces,
		prototypes: polyfills.prototypes,
		namespaces: polyfills.namespaces,
	};

	// 根据之前复制的垫片函数描述器定义垫片函数
	sandbox.exec(
		`
	function definePolyfills(top, box) {
		for (const key in top)
			if (!(key in box))
				Reflect.defineProperty(box, key, top[key]);
	}

	for (const key of pfPrototypes) {
		if (key in prototypes)
			definePolyfills(
				prototypes[key],
				window[key].prototype
			);
	}

	for (const key of pfNamespaces) {
		if (key in namespaces)
			definePolyfills(
				namespaces[key],
				window[key]
			);
	}
	`,
		context
	);
}

// 测试暴露喵
if (SANDBOX_DEV) {
	Reflect.defineProperty(window, "sandbox", {
		get: () => defaultSandbox,
		set: () => {},
		configurable: true,
	});
}

export const security = {
	enterSandbox,
	exitSandbox,
	currentSandbox,
	createSandbox,
	isUnsafeObject,
	assertSafeObject,
	getIsolateds,
	getIsolatedsFrom,
	importSandbox,
	requireSandbox,
	requireSandboxOn,
	resetGrantedServers,
	isSandboxRequired,
	initSecurity,
	eval: _eval,
	exec: _exec,
	exec2: _exec2,
	SANDBOX_ENABLED,
};

Object.freeze(security);
