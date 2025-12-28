// 给扩展开发者的的提示:
// 如果你在调试时启用了类似 `在出现异常时中断` 的选项，
// 如果你不想频繁进入此文件，那么你可以在调试窗口中 `右键-将此文件添加到忽略列表/black box script` 来屏蔽此文件
// 另外由于封送的原因，如果当前模式启用了沙盒，会导致编译后的本地或远程代码创建的对象使用代理包装
// 你在调试器中需要通过 `[[Target]].target` 查看原始对象，在此导致的不便对开发者表示歉意
// 不过沙盒默认只在联机实际，实际影响已经降到最低，对于不接触联机模式的开发者来说，应该没有太大问题

// 最后为安全考虑，请遵守规范，尽量不要使用 `eval` 函数而是使用 `security.exec2` 来替代

import { SANDBOX_EXPORT, isSandboxEnabled } from "./initRealms.js";

// 很重要的事情！
// 请不要在在其他文件中import sandbox.js！
// 如果需要沙盒相关的类请用security.importSandbox()导入！！！
// 什么时候支持顶级await(Chrome 89)就可以改回去了，现在好麻烦哦

/** @typedef {any} Window */

// 新的开关放到了 "./initRealms.js" 里面，请不要改动此处！
const SANDBOX_ENABLED = isSandboxEnabled();

// 暴露方法Symbol，用于类之间通信
const SandboxExposer = Symbol("Sandbox.Exposer"); // 实例暴露
const SandboxExposer2 = Symbol("Sandbox.Exposer2"); // 静态暴露

// 暴露方法Signal，类间通信信号
const SandboxSignal_InitDomain = Symbol("InitDomain");
const SandboxSignal_GetMarshalledProxy = Symbol("GetMarshalledProxy");
const SandboxSignal_SetMarshalledProxy = Symbol("SetMarshalledProxy");
const SandboxSignal_GetWindow = Symbol("GetWindow");
const SandboxSignal_GetPromise = Symbol("GetPromise");
const SandboxSignal_EnterDomain = Symbol("EnterDomain");
const SandboxSignal_ExitDomain = Symbol("ExitDomain");
const SandboxSignal_ListDomain = Symbol("ListDomain");
const SandboxSignal_UnpackProxy = Symbol("UnpackProxy");
const SandboxSignal_Marshal = Symbol("Marshal");
const SandboxSignal_MarshalArray = Symbol("MarshalArray");
const SandboxSignal_TrapDomain = Symbol("TrapDomain");
const SandboxSignal_DiapatchMonitor = Symbol("DiapatchMonitor");
const SandboxSignal_ListMonitor = Symbol("ListMonitor");
const SandboxSignal_ExposeInfo = Symbol("ExposeInfo");
const SandboxSignal_TryFunctionRefs = Symbol("TryFunctionRefs");

/** @type {typeof import("./error.js").CodeSnippet} */
let CodeSnippet;
/** @type {typeof import("./error.js").ErrorReporter} */
let ErrorReporter;
/** @type {typeof import("./error.js").ErrorManager} */
let ErrorManager;

// 用于适配 < Chrome 84 的设备
const WeakRef =
	window.WeakRef ||
	class WeakRef {
		/**
		 * @param {any} target
		 */
		constructor(target) {
			this.target = target;
		}

		/**
		 * @returns {any}
		 */
		deref() {
			return this.target;
		}

		/**
		 * @type {"WeakRef"}
		 */
		[Symbol.toStringTag] = "WeakRef";
	};

/** @type {typeof Function} */
// @ts-expect-error Sandbox
const GeneratorFunction = function* () {}.constructor;
/** @type {typeof Function} */
// @ts-expect-error Sandbox
const AsyncFunction = async function () {}.constructor;
/** @type {typeof Function} */
// @ts-expect-error Sandbox
const AsyncGeneratorFunction = async function* () {}.constructor;

/**
 * ```plain
 * 判断是否为基元类型
 * ```
 *
 * @param {any} obj
 * @returns {boolean}
 */
function isPrimitive(obj) {
	return Object(obj) !== obj;
}

/**
 * ```plain
 * AccessAction枚举
 * 提供给Rule类作为权限ID
 * 对应 Proxy 的12种拦截器
 * ```
 */
class AccessAction {
	// static CALL     = 0;  // apply
	// static NEW      = 1;  // construct
	// static READ     = 2;  // get
	// static WRITE    = 3;  // set
	// static DESCRIBE = 4;  // getOwnPropertyDescriptor
	// static DEFINE   = 5;  // defineProperty
	// static TRACE    = 6;  // getPrototypeOf
	// static META     = 7;  // setPrototypeOf
	// static SEAL     = 8;  // preventExtensions
	// static EXISTS   = 9;  // has
	// static LIST     = 10; // ownKeys
	// static DELETE   = 11; // delete

	/** ```Reflect.apply``` */
	static CALL = 0;
	/** ```Reflect.construct``` */
	static NEW = 1;
	/** ```Reflect.get``` */
	static READ = 2;
	/** ```Reflect.set ``` */
	static WRITE = 3;
	/** ```Reflect.getOwnPropertyDescriptor``` */
	static DESCRIBE = 4;
	/** ```Reflect.defineProperty``` */
	static DEFINE = 5;
	/** ```Reflect.getPrototypeOf``` */
	static TRACE = 6;
	/** ```Reflect.setPrototypeOf``` */
	static META = 7;
	/** ```Reflect.preventExtensions``` */
	static SEAL = 8;
	/** ```Reflect.has``` */
	static EXISTS = 9;
	/** ```Reflect.ownKeys``` */
	static LIST = 10;
	/** ```Reflect.delete``` */
	static DELETE = 11;

	/**
	 * 判断给定的action是否是AccessAction
	 *
	 * @param {number} action
	 * @returns
	 */
	static isAccessAction(action) {
		return typeof action == "number" && action >= 0 && action < 12;
	}
}

/**
 * ```plain
 * 指定一个对象的封送规则
 *
 * 是否允许对象进行封送
 * 是否允许对象封送到某个具体的运行域
 * 是否允许封送的对象进行特定的操作
 * ```
 */
class Rule {
	/** @type {Domain} */
	#domain;
	/** @type {boolean} */
	#allowMarshal = true;

	/** @type {WeakSet<Domain>?} */
	#allowMarshalTo = null;
	/** @type {WeakSet<Domain>?} */
	#disallowMarshalTo = null;

	/** @type {boolean[]} */
	#permissions = new Array(12).fill(true);

	/** @type {((...args: any[]) => boolean)?} */
	#accessControl = null;

	/**
	 * ```plain
	 * 创建一个封送规则
	 * ```
	 *
	 * @param {Rule?} rule
	 */
	constructor(rule = null) {
		this.#domain = Domain.current;

		if (rule instanceof Rule) {
			this.#allowMarshal = rule.#allowMarshal;
			this.#allowMarshalTo = rule.#allowMarshalTo;
			this.#disallowMarshalTo = rule.#disallowMarshalTo;
			this.#permissions = rule.#permissions.slice();
			this.#accessControl = rule.#accessControl;
		}
	}

	/**
	 * ```plain
	 * 检查当前是否是 Rule 所属的运行域
	 * ```
	 *
	 * @param {Rule} thiz
	 */
	static #assertOperator(thiz) {
		if (thiz.#domain !== Domain.current) {
			throw new Error("当前不是 Rule 所属的运行域");
		}
	};

	/**
	 * ```plain
	 * 是否允许对象进行封送
	 * ```
	 *
	 * @type {boolean}
	 */
	get canMarshal() {
		Rule.#assertOperator(this);
		return this.#allowMarshal;
	}

	/**
	 * ```plain
	 * 是否允许对象进行封送
	 * ```
	 *
	 * @type {boolean}
	 */
	set canMarshal(newValue) {
		Rule.#assertOperator(this);
		this.#allowMarshal = !!newValue;
	}

	/**
	 * ```plain
	 * 检查当前的规则是否允许封送到指定的运行域
	 * ```
	 *
	 * @param {Domain} domain
	 * @returns {boolean}
	 */
	canMarshalTo(domain) {
		Rule.#assertOperator(this);

		if (!this.#allowMarshal) {
			return false;
		}

		// 存在于封送白名单或不存在于封送黑名单
		if (this.#allowMarshalTo) {
			return this.#allowMarshalTo.has(domain);
		} else if (this.#disallowMarshalTo) {
			return !this.#disallowMarshalTo.has(domain);
		}

		return true;
	}

	/**
	 * ```plain
	 * 将特定的运行域添加到当前对象的封送白名单
	 *
	 * 请注意，封送白名单与黑名单不能同时指定
	 * ```
	 *
	 * @param {Domain} domain
	 */
	allowMarshalTo(domain) {
		Rule.#assertOperator(this);

		if (!this.#allowMarshalTo) {
			if (this.#disallowMarshalTo) {
				throw new TypeError("封送黑名单与封送白名单不能同时存在");
			}

			this.#allowMarshalTo = new WeakSet();
		}

		this.#allowMarshalTo.add(domain);
	}

	/**
	 * ```plain
	 * 将特定的运行域添加到当前对象的封送黑名单
	 *
	 * 请注意，封送白名单与黑名单不能同时指定
	 * ```
	 *
	 * @param {Domain} domain
	 */
	disallowMarshalTo(domain) {
		Rule.#assertOperator(this);

		if (!this.#disallowMarshalTo) {
			if (this.#allowMarshalTo) {
				throw new TypeError("封送黑名单与封送白名单不能同时存在");
			}

			this.#disallowMarshalTo = new WeakSet();
		}

		this.#disallowMarshalTo.add(domain);
	}

	/**
	 * ```plain
	 * 检查给定的AccessAction是否被允许
	 * ```
	 *
	 * @param {number} action
	 * @returns {boolean}
	 */
	isGranted(action) {
		Rule.#assertOperator(this);

		if (!AccessAction.isAccessAction(action)) {
			throw new TypeError("参数 action 不是一个有效的操作");
		}

		return this.#permissions[action];
	}

	/**
	 * ```plain
	 * 指定给定的AccessAction是否被允许
	 * ```
	 *
	 * @param {number} action
	 * @param {boolean} granted
	 */
	setGranted(action, granted) {
		Rule.#assertOperator(this);

		if (!AccessAction.isAccessAction(action)) {
			throw new TypeError("参数 action 不是一个有效的操作");
		}

		this.#permissions[action] = !!granted;
	}

	/**
	 * ```plain
	 * 判断在给定的AccessAction与指定的参数下是否允许访问
	 * ```
	 *
	 * @param {number} action
	 * @param  {...any} args
	 * @returns {boolean}
	 */
	canAccess(action, ...args) {
		Rule.#assertOperator(this);

		// 判断行为是否允许
		if (!this.isGranted(action)) {
			return false;
		}

		// 通过权限控制器判断是否允许
		if (this.#accessControl && !this.#accessControl(action, ...args)) {
			return false;
		}

		return true;
	}

	/**
	 * ```plain
	 * 设置当前的权限控制器
	 *
	 * 权限控制器形参是拦截器的对应参数
	 * 返回值则控制本次访问是否允许
	 * ```
	 *
	 * @param {(action: number, ...args: any[]) => boolean} accessControl
	 */
	setAccessControl(accessControl) {
		Rule.#assertOperator(this);

		if (typeof accessControl != "function") {
			throw new TypeError("无效的权限控制器");
		}
		if (this.#accessControl) {
			throw new TypeError("权限控制器已经被设置");
		}

		this.#accessControl = accessControl;
	}
}

/**
 * ```plain
 * 将全局索引函数单独提取了出来
 * 
 * 解析全局索引集合
 * 将类似于 "/Object/assign" 的索引解析为 [Object, "assign"] 的索引
 * 支持以下几种情况:
 * "/Object/assign" -> [[window.Object, "assign"]]
 * "/Event/prototype/preventDefault" -> [[window.Event.prototype, "preventDefault"]]
 * ["Event", "prototype", "preventDefault"] -> [[window.Event.prototype, "preventDefault"]]
 * [/^\w*?Event$/, "prototype", "preventDefault"] -> [
 *     [window.Event.prototype, "preventDefault"],
 *     [window.UIEvent.prototype, "preventDefault"],
 *     [window.MouseEvent.prototype, "preventDefault"],
 *     [window.KeyEvent.prototype, "preventDefault"],
 *     ...
 * ]
 * ```
 * 
 * @param {Window} window
 * @param {string|Array<string|symbol|RegExp>} selector
 * @returns {Array<[any, string|symbol]>}
 */
function buildGlobalIndexes(window, selector) {
	/** @type {Array<string|symbol|RegExp>} */
	const items = Array.isArray(selector) ? selector : selector.split("/").filter(Boolean);

	items.unshift(window);

	const pathes = [items];

	/** @type {Array<[any, string|symbol]>} */
	const indexes = [];

	// 将所有路径转换为索引
	// 如: /a/b/c => [window.a.b, "c"]
	while (pathes.length) {
		/** @type {Array} */
		// @ts-expect-error Sandbox
		const path = pathes.shift();

		// 如果已经是长度为二了
		if (path.length == 2) {
			// 最后一项如果不是正则表达式直接添加为索引
			if (!(path[1] instanceof RegExp)) {
				if (path[1] in path[0]) {
					// @ts-expect-error Sandbox
					indexes.push(path);
				}

				continue;
			}

			// 否则需要遍历添加索引
			const root = path[0];
			const pattern = path[1];
			indexes.push(
				// @ts-expect-error Sandbox
				...Reflect.ownKeys(root)
					.filter(k => k in root && pattern.test(typeof k == "string" ? k : `@${k.description}`))
					.map(k => [root, k])
			);

			continue;
		}

		// 如果下一个键不是正则表达式
		if (!(path[1] instanceof RegExp)) {
			const root = path.shift();

			// 向下索引，并将 `__proto__` 改为原型获取
			if (path[0] === "__proto__") {
				path[0] = Reflect.getPrototypeOf(root);
			} else {
				path[0] = root[path[0]];
			}

			if (!path[0]) {
				continue;
			}

			// 添加新的路径
			pathes.push(path);
			continue;
		}

		// 如果下一个键是正则表达式
		// 此时需要遍历向下索引
		const root = path.shift();
		const pattern = path.shift();
		const keys = Reflect.ownKeys(root)
			.filter(k => k in root && pattern.test(typeof k == "string" ? k : `@${k.description}`));

		if (!keys.length) {
			continue;
		}

		// 添加新的路径
		pathes.push(...keys.map(k => [root[k], ...path]));
	}

	return indexes;
}

/**
 * ```plain
 * 全局变量映射表
 *
 * 在下表中标记的全局变量，
 * 封送时将不使用代理封送，
 * 而是直接映射成另一个运行域对应的全部变量
 *
 * 映射表项格式:
 * string: 全局变量路径
 * 例如: /Object/assign 指向 window.Object.assign
 * 同时路径也是映射的键名
 * array: [全局变量名称, 对应的获取代码]
 * 例如: [/AsyncFunction, (async()=>{}).constructor]
 * 指向异步函数的构造函数，使用/AsyncFunction作为映射键名
 *
 * 请注意，映射键名不得相同，不然会导致相互覆盖
 * 全局变量映射表应该用于JavaScript的内建对象
 * 因为只有内建对象才会在所有运行域同时都有
 * ```
 */
const MAPPING_GLOBALS = Object.freeze([
	"/Object",
	"/Array",
	"/Promise",
	"/Date",
	"/String",
	"/Number",
	"/Boolean",
	"/BigInt",
	"/RegExp",
	"/Symbol",
	"/Error",
	"/TypeError",
	"/SyntaxError",
	"/RangeError",
	"/EvalError",
	"/ReferenceError",
	"/Map",
	"/Set",
	"/WeakRef",
	"/WeakMap",
	"/WeakSet",
	["/Object/Symbol(Symbol.hasInstance)", "Object[Symbol.hasInstance]"],
	"/Object/prototype",
	"/Array/prototype",
	"/Function/prototype",
	"/Promise/prototype",
	"/Date/prototype",
	"/String/prototype",
	"/Number/prototype",
	"/Boolean/prototype",
	"/BigInt/prototype",
	"/RegExp/prototype",
	"/Symbol/prototype",
	"/Error/prototype",
	"/TypeError/prototype",
	"/SyntaxError/prototype",
	"/RangeError/prototype",
	"/EvalError/prototype",
	"/ReferenceError/prototype",
	"/Map/prototype",
	"/Set/prototype",
	"/WeakRef/prototype",
	"/WeakMap/prototype",
	"/WeakSet/prototype",
	["/Generator", "(function*(){})().constructor"],
	["/AsyncGenerator", "(async function*(){})().constructor"],
	["/Generator/prototype", "(function*(){})().constructor.prototype"],
	["/AsyncGenerator/prototype", "(async function*(){})().constructor.prototype"],
	["/GeneratorFunction/prototype", "(function*(){}).constructor.prototype"],
	["/AsyncFunction/prototype", "(async()=>{}).constructor.prototype"],
	["/AsyncGeneratorFunction/prototype", "(async function*(){}).constructor.prototype"],
	"/JSON",
	"/Proxy",
	"/Math",
	"/Reflect",
	"/parseInt",
	"/parseFloat",
	"/isNaN",
	"/isFinite",

	// 危险对象不传递
	// "/Function",
	// ["/GeneratorFunction", "(function*(){}).constructor"],
	// ["/AsyncFunction", "(async()=>{}).constructor"],
	// ["/AsyncGeneratorFunction", "(async function*(){}).constructor"],
	// "/eval",
]);

/**
 * ```plain
 * 初始化内建对象时就需要封送的全局变量
 *
 * 这些函数的成功执行依赖于browser context
 * 必须要顶级域来提供给其他运行域
 * 
 * 补充:
 * 对于需要异步执行函数的功能，沙盒本身的运行域因为被卸载了document，受限于浏览器规则不会被执行
 * 这时候我们需要借助顶级域的对应功能，将它们包装（封送）到沙盒的运行域中，保证异步函数正常执行
 * 
 * 另外需要判断原型链的类也需要从顶级域给出，否则会导致检查失败的问题
 * ```
 */
const MARSHALLED_LIST = Object.freeze([
	"/setTimeout",
	"/clearTimeout",
	"/setInterval",
	"/clearInterval",
	"/setImmediate",
	"/clearImmediate",
	"/requestAnimationFrame",
	"/cancelAnimationFrame",
	"/requestIdleCallback",
	"/cancelIdleCallback",
	"/queueMicrotask",
	"/MutationObserver",
	// 根据狂神喵提供的问题
	// 我们对console进行迁移
	...Object.keys(console).map(key => `/console/${key}`),
	// 另外补充这两个可能的函数哦
	"/alert",
	"/confirm",
	// 补充所有的事件喵
	// 因为需要判断原型链，所以这里要让顶级域把它的事件类传过来喵
	...Reflect.ownKeys(globalThis)
		.filter(key => typeof key == "string")
		.filter(key => /^\w*?Event$/.test(key))
		.map(key => `/${key}`),
]);

/**
 * ```plain
 * 为每个运行域的全局对象提供封送映射
 *
 * 非暴露类
 * ```
 */
class Globals {
	/** @type {[WeakMap, Object, Object]} */
	static #topGlobals;
	/** @type {WeakMap<Domain, [WeakMap, Object]>} */
	static #globals = new WeakMap();
	/** @type {Record<string|symbol, true>} */
	static #builtinKeys = {};

	/**
	 * ```plain
	 * 判断是否是顶级域的内建对象
	 * ```
	 *
	 * @param {string|symbol} key
	 * @returns {boolean}
	 */
	static isBuiltinKey(key) {
		return key in Globals.#builtinKeys; // 基于hash的存在性检查效率最高喵
	}

	/**
	 * ```plain
	 * 解析映射路径
	 *
	 * 如: /a/b/c => ["/a/b/c", window.a.b.c]
	 * ```
	 *
	 * @param {string|string[]} path
	 * @param {Window} window
	 * @returns {[string, any]} [映射键名, 映射值]
	 */
	static parseFrom(path, window) {
		if (typeof path == "string") {
			const items = path.split("/").filter(Boolean);
			let obj = window;

			for (const item of items) {
				if (!(obj = obj[item])) {
					break;
				}
			}

			return [path, obj];
		} else {
			return [path[0], window.eval(path[1])];
		}
	}

	/**
	 * ```plain
	 * 解析映射路径为索引
	 *
	 * 如: /a/b/c => [window.a.b, "c"]
	 * ```
	 *
	 * @param {string} path
	 * @param {Window} window
	 * @returns {[Object, string]} [索引对象, 索引键名]
	 */
	static parseIndex(path, window) {
		const items = path.split("/").filter(Boolean);
		const last = items.pop();
		let obj = window;

		for (const item of items) {
			if (!(obj = obj[item])) {
				break;
			}
		}

		// @ts-expect-error Sandbox
		return [obj, last];
	}

	/**
	 * ```plain
	 * 初始化运行域的全局对象映射
	 * ```
	 *
	 * @param {Domain} domain
	 */
	static ensureDomainGlobals(domain) {
		if (!Globals.#globals.has(domain)) {
			const window = domain[SandboxExposer](SandboxSignal_GetWindow);
			const globals = [new WeakMap(), {}];
			// @ts-expect-error Sandbox
			Globals.#globals.set(domain, globals);

			// 检查是否是顶级域
			if (Globals.#topGlobals) {
				// 不是顶级域则封送 `MARSHALLED_LIST` 的对象
				const marshalleds = Globals.#topGlobals[2];

				for (const path of MARSHALLED_LIST) {
					const [obj, key] = Globals.parseIndex(path, window);
					obj[key] = trapMarshal(Domain.topDomain, domain, marshalleds[path]);
				}
			} else {
				// 否则将 `MARSHALLED_LIST` 的对象保存
				// @ts-expect-error Sandbox
				Globals.#topGlobals = globals;
				globals.push({});

				for (const path of MARSHALLED_LIST) {
					const [key, obj] = Globals.parseFrom(path, window);

					if (obj == null) {
						continue;
					}

					globals[2][key] = obj;
				}

				// 另外构造内建对象表
				for (const key of Reflect.ownKeys(window)) {
					Globals.#builtinKeys[key] = true;
				}
			}

			// 构建全局变量映射
			for (const path of MAPPING_GLOBALS) {
				const [key, obj] = Globals.parseFrom(path, window);

				if (obj == null) {
					continue;
				}

				globals[0].set(obj, key);
				globals[1][key] = obj;
			}
		}
	}

	/**
	 * ```plain
	 * 将一个对象映射为全局键
	 * ```
	 *
	 * @param {Domain} domain
	 * @param {Object} obj
	 */
	static findGlobalKey(domain, obj) {
		Globals.ensureDomainGlobals(domain);
		const globals = Globals.#globals.get(domain);
		// @ts-expect-error Sandbox
		return globals[0].get(obj);
	}

	/**
	 * ```plain
	 * 将一个全局键映射为对象
	 * ```
	 *
	 * @param {Domain} domain
	 * @param {string} key
	 */
	static findGlobalObject(domain, key) {
		Globals.ensureDomainGlobals(domain);
		const globals = Globals.#globals.get(domain);
		// @ts-expect-error Sandbox
		return globals[1][key];
	}

	/**
	 * ```plain
	 * 将一个运行域的全局对象映射为另一个运行域的全局对象
	 * ```
	 *
	 * @param {Object} obj
	 * @param {Domain} sourceDomain
	 * @param {Domain} targetDomain
	 */
	static mapTo(obj, sourceDomain, targetDomain) {
		const key = Globals.findGlobalKey(sourceDomain, obj);

		if (!key) {
			return undefined;
		}

		return Globals.findGlobalObject(targetDomain, key);
	}
}

/**
 * ```plain
 * 需要封装传递ExecuteContext的函数
 *
 * 根据HTML现有函数设置
 * 请不要改动下面的列表
 * 
 * 补充:
 * 对于需要执行回调函数的功能，沙盒本身的运行域因为被卸载了document，受限于浏览器规则不会被执行
 * 这时候我们需要借助顶级域的执行上下文，将回调函数包装（封送）到顶级的运行域中，保证回调函数正常执行
 * ```
 */
const WRAPPING_LIST = [
	"/setTimeout",
	"/setInterval",
	"/setImmediate",
	"/requestAnimationFrame",
	"/requestIdleCallback",
	"/queueMicrotask",
	"/EventTarget/prototype/addEventListener",
	"/EventTarget/prototype/removeEventListener",
	[/^HTML\w*?Element$/, "prototype", /^on[a-z0-9]+$/, "*"],
	["IDBRequest", "prototype", /^on[a-z0-9]+$/, "*"],
	["XMLHttpRequestEventTarget", "prototype", /^on[a-z0-9]+$/, "*"],
	"/MutationObserver",

	// 对于 cordova 的特殊处理
	"/document/addEventListener",
	"/document/removeEventListener",
	"/window/addEventListener",
	"/window/removeEventListener",

	// "/HTMLCanvasElement/prototype/toBlob",
	// "/DataTransferItem/prototype/getAsString",
	// "/LaunchQueue/prototype/setConsumer",
	// "/ResizeObserver",
	// "/ReportingObserver",
	// "/PerformanceObserver",
	// "/IntersectionObserver",
];

// 不支持的：
// customElements / CustomElementRegistry, 太抽象了喵，太多东西了喵，太麻烦了喵，太复杂了喵（用这个的要被狠狠的打皮鼓喵！

/**
 * ```plain
 * 对于原生函数进行封装
 *
 * 非暴露类
 * ```
 */
class NativeWrapper {
	static #unboxedFunction = Symbol("NativeWrapper.unboxedFunction");

	/** @type {WeakMap<Proxy, Function>} */
	static #boxedMap = new WeakMap();
	/** @type {WeakSet<Function>} */
	static #boxedSet = new WeakSet();

	/** @type {typeof Function?} */
	static #topFunction = null;
	/** @type {typeof Function?} */
	static #currentFunction = null;

	/**
	 * ```plain
	 * 初始化顶级运行域的Function
	 * ```
	 *
	 * @param {Window} topGlobal
	 */
	static initTopDomain(topGlobal) {
		if (NativeWrapper.#topFunction) {
			throw new Error("NativeWrapper 已经初始化过了");
		}

		NativeWrapper.#topFunction = topGlobal.Function;
	}

	/**
	 * ```plain
	 * 对某个域的原生函数进行封装
	 * ```
	 *
	 * @param {Window} global
	 */
	static wrapInDomains(global) {
		// 保存当前域的Function构造函数用于后续构建原型链
		NativeWrapper.#currentFunction = global.Function;

		// 封装所有函数
		for (const selector of WRAPPING_LIST) {
			NativeWrapper.wrapFunctions(global, selector);
		}

		NativeWrapper.#currentFunction = null;
	}

	/**
	 * ```plain
	 * 根据选择器对原生函数进行封装
	 * ```
	 *
	 * @param {Window} global
	 * @param {string|Array<string|symbol|RegExp>} selector
	 */
	static wrapFunctions(global, selector) {
		let flags = 2; // 默认装箱了喵

		if(Array.isArray(selector)) {
			if (selector.length > 1 && selector[selector.length - 1] === '*') {
				flags |= 1;
				selector.splice(selector.length - 1, 1);
			}
		} else if (selector.length > 2 && selector.slice(-2) === "/*") {
			flags |= 1;
			selector = selector.slice(0, -2);
		}

		const indexes = buildGlobalIndexes(global, selector);

		// 根据索引进行封装
		for (const index of indexes) {
			NativeWrapper.wrapFunction(global, ...index, flags);
		}
	}

	/**
	 * ```plain
	 * 对于具体的原生函数进行封装
	 * ```
	 *
	 * @param {Window} global
	 * @param {Object} parent
	 * @param {string|symbol} name
	 * @param {number} flags
	 */
	static wrapFunction(global, parent, name, flags) {
		if (flags & 1) {
			// 如果路径结尾是 `*`，代表需要封装访问器(getter与setter)
			const descriptor = Reflect.getOwnPropertyDescriptor(parent, name);

			if (!descriptor || typeof descriptor.get != "function" || typeof descriptor.set != "function") {
				throw new TypeError("不支持的HTML实现");
			}

			// 封装访问器
			descriptor.get = NativeWrapper.wrapGetter(descriptor.get);
			descriptor.set = NativeWrapper.wrapSetter(descriptor.set);
			Reflect.defineProperty(parent, name, descriptor);
		} else {
			const defaultFunction = parent[name];

			if (!defaultFunction) {
				return;
			}

			if (defaultFunction.prototype) {
				// 如果此函数是一个构造函数
				const wrappedApply = NativeWrapper.wrapApply(defaultFunction, flags);
				const wrappedConstruct = NativeWrapper.wrapConstruct(defaultFunction, flags);

				// 使用代理封装
				parent[name] = new Proxy(defaultFunction, {
					apply(target, thisArg, argArray) {
						return Reflect.apply(wrappedApply, thisArg, argArray);
					},
					construct(target, argArray, newTarget) {
						return Reflect.construct(wrappedConstruct, argArray, newTarget);
					},
				});
			} else {
				// 否则直接进行封装
				parent[name] = NativeWrapper.wrapApply(global === parent ? defaultFunction.bind(null) : defaultFunction, flags);
			}
		}
	}

	/**
	 * ```plain
	 * 将原生函数进行调用封装
	 * ```
	 *
	 * @param {Function} func
	 * @param {number} flags
	 * @returns {Function}
	 */
	static wrapApply(func, flags = 0) {
		// @ts-expect-error Sandbox
		const prototype = NativeWrapper.#currentFunction.prototype;
		// 根据是否装箱进行不同的封装
		const wrapped =
			flags & 2
				? function (/** @type {any[]} */ ...args) {
						const list = args.map(a => NativeWrapper.boxCallback(a, prototype));
						// @ts-expect-error Sandbox
						return ContextInvoker1(func, this, list);
					}
				: function (/** @type {any[]} */ ...args) {
						// @ts-expect-error Sandbox
						return ContextInvoker1(func, this, args);
					};

		// 构造原型链
		Reflect.setPrototypeOf(wrapped, prototype);
		return wrapped;
	}

	/**
	 * ```plain
	 * 将原生函数进行构造封装
	 * ```
	 *
	 * @param {Function} func
	 * @param {number} flags
	 * @returns {Function}
	 */
	static wrapConstruct(func, flags = 0) {
		// @ts-expect-error Sandbox
		const prototype = NativeWrapper.#currentFunction.prototype;
		// 根据是否装箱进行不同的封装
		const wrapped =
			flags & 2
				? function (/** @type {any[]} */ ...args) {
						const list = args.map(a => NativeWrapper.boxCallback(a, prototype));
						return ContextInvoker2(func, list, new.target);
					}
				: function (/** @type {any[]} */ ...args) {
						return ContextInvoker2(func, args, new.target);
					};

		// 构造原型链
		Reflect.setPrototypeOf(wrapped, prototype);
		return wrapped;
	}

	/**
	 * ```plain
	 * 将原生GETTER进行调用封装
	 * ```
	 *
	 * @param {Function} func
	 * @returns {(...args: any[]) => any}
	 */
	static wrapGetter(func) {
		// @ts-expect-error Sandbox
		const prototype = NativeWrapper.#currentFunction.prototype;
		const wrapped = function () {
			// @ts-expect-error Sandbox
			return NativeWrapper.unboxCallback(ContextInvoker1(func, this, []));
		};

		// 构造原型链
		Reflect.setPrototypeOf(wrapped, prototype);
		return wrapped;
	}

	/**
	 * ```plain
	 * 将原生SETTER进行调用封装
	 * ```
	 *
	 * @param {Function} func
	 * @returns {(...args: any[]) => any}
	 */
	static wrapSetter(func) {
		// @ts-expect-error Sandbox
		const prototype = NativeWrapper.#currentFunction.prototype;
		const wrapped = function (/** @type {ProxyConstructor} */ value) {
			// @ts-expect-error Sandbox
			return ContextInvoker1(func, this, [NativeWrapper.boxCallback(value, prototype)]);
		};

		// 构造原型链
		Reflect.setPrototypeOf(wrapped, prototype);
		return wrapped;
	}

	/**
	 * ```plain
	 * 将回调函数进行装箱
	 * ```
	 *
	 * @param {Proxy} unboxed
	 * @param {Function} prototype
	 * @returns
	 */
	static boxCallback(unboxed, prototype) {
		if (typeof unboxed != "function") {
			return unboxed;
		}

		// 读取缓存
		let wrapped = NativeWrapper.#boxedMap.get(unboxed);

		if (!wrapped) {
			// 缓存不存在则创建
			wrapped = ContextInvokerCreator(
				{
					unboxed, // 向封装函数提供unboxed函数
				},
				function (/** @type {any} */ thiz, /** @type {readonly any[]} */ args, /** @type {(new (...args: any) => any) | undefined} */ newTarget) {
					return newTarget
						? // @ts-expect-error Sandbox
							Reflect.construct(this.unboxed, args, newTarget)
						: // @ts-expect-error Sandbox
							Reflect.apply(this.unboxed, thiz, args);
				}
			);

			// 设置暴露器
			wrapped[SandboxExposer] = (/** @type {symbol} */ signal) => {
				if (signal === NativeWrapper.#unboxedFunction) {
					return unboxed;
				}
			};

			// 构造原型链
			Reflect.setPrototypeOf(wrapped, prototype);
			NativeWrapper.#boxedMap.set(unboxed, wrapped);
		}

		NativeWrapper.#boxedSet.add(wrapped);
		return wrapped;
	}

	/**
	 * ```plain
	 * 将回调函数进行拆箱
	 * ```
	 *
	 * @param {Function} boxed
	 * @returns
	 */
	static unboxCallback(boxed) {
		if (!NativeWrapper.#boxedSet.has(boxed)) {
			return boxed;
		}

		// 通过暴露器获取原始函数
		return boxed[SandboxExposer](NativeWrapper.#unboxedFunction);
	}
}

// 执行上下文传递函数，请勿动喵
// 用于传递顶级execute context

/** @type {(target: Function, thiz: Object, args: Array) => any} */
// @ts-expect-error Sandbox
const ContextInvoker1 = window.replacedCI1;

/** @type {(target: Function, args: Array, newTarget: Function) => any} */
// @ts-expect-error Sandbox
const ContextInvoker2 = window.replacedCI2;

/** @type {(closure: Object, target: Function) => ((...args: any[]) => any)} */
// @ts-expect-error Sandbox
const ContextInvokerCreator = window.replacedCIC;

/**
 * ```plain
 * 管理每个运行域对于其封送对象的 Monitor
 *
 * 非暴露类
 * ```
 */
class DomainMonitors {
	/** @type {WeakMap<Domain, DomainMonitors>} */
	static #domainMonitors = new WeakMap();

	/** @type {WeakMap<Object, Record<number, Set<Monitor>>>} */
	#targetMonitorsMap = new WeakMap();
	/** @type {WeakMap<Domain, Record<number, Set<Monitor>>>} */
	#monitorsMap = new WeakMap();

	/**
	 * ```plain
	 * 在当前运行域安装一个 Monitor
	 * ```
	 *
	 * @param {DomainMonitors} thiz
	 * @param {Monitor} monitor
	 */
	static #installMonitor(thiz, monitor) {
		// 解构 Monitor 相关条件
		// @ts-expect-error Sandbox
		const [actions, allowDomains, disallowDomains, targets] = Monitor[SandboxExposer2](SandboxSignal_ExposeInfo, monitor);

		/**
		 * @param {{ [x: number]: Set<Monitor>; }} actionMap
		 */
		function addToActionMap(actionMap) {
			for (const action of actions) {
				let monitorMap = actionMap[action];

				if (!monitorMap) {
					monitorMap = actionMap[action] = new Set();
				}

				monitorMap.add(monitor);
			}
		}

		// 如果指定了目标，使用目标 Monitor 集合
		// 以此对于特定对象的 Monitor 进行性能优化
		if (targets) {
			for (const target of targets) {
				let actionMap = thiz.#targetMonitorsMap.get(target);

				if (!actionMap) {
					thiz.#targetMonitorsMap.set(target, (actionMap = {}));
				}

				// 根据 actions 添加到不同的触发器集合
				addToActionMap(actionMap);
			}

			return;
		}

		const domainList = [];

		if (!allowDomains) {
			// 取运行域补集
			// @ts-expect-error Sandbox
			const totalDomains = new Set(Domain[SandboxExposer2](SandboxSignal_ListDomain));
			totalDomains.delete(monitor.domain);

			if (disallowDomains) {
				for (const domain of disallowDomains) {
					totalDomains.delete(domain);
				}
			}

			domainList.push(...totalDomains);
		} else {
			domainList.push(...allowDomains);
		}

		// 根据允许的运行域安装 Monitor
		for (const domain of domainList) {
			let actionMap = thiz.#monitorsMap.get(domain);

			if (!actionMap) {
				thiz.#monitorsMap.set(domain, (actionMap = {}));
			}

			// 根据 actions 添加到不同的触发器集合
			addToActionMap(actionMap);
		}
	};

	/**
	 * ```plain
	 * 从当前运行域卸载一个 Monitor
	 * ```
	 *
	 * @param {DomainMonitors} thiz
	 * @param {Monitor} monitor
	 */
	static #uninstallMonitor(thiz, monitor) {
		// 解构 Monitor 相关条件
		const [actions, allowDomains, disallowDomains, targets] = Monitor[SandboxExposer2](SandboxSignal_ExposeInfo, monitor);

		/**
		 * @param {{ [x: number]: Set<Monitor>; }} actionMap
		 */
		function removeFromActionMap(actionMap) {
			for (const action of actions) {
				const monitorMap = actionMap[action];

				if (!monitorMap) {
					continue;
				}

				monitorMap.delete(monitor);
			}
		}

		// 对于指定了目标的 Monitor 特殊处理
		if (targets) {
			for (const target of targets) {
				const actionMap = thiz.#targetMonitorsMap.get(target);

				if (!actionMap) {
					continue;
				}

				// 根据 actions 从不同的触发器集合移除
				removeFromActionMap(actionMap);
			}

			return;
		}

		const domainList = [];

		if (!allowDomains) {
			// 取运行域补集
			// @ts-expect-error Sandbox
			const totalDomains = new Set(Domain[SandboxExposer2](SandboxSignal_ListDomain));

			if (disallowDomains) {
				for (const domain of disallowDomains) {
					totalDomains.delete(domain);
				}
			}

			domainList.push(...totalDomains);
		} else {
			domainList.push(...allowDomains);
		}

		// 根据允许的运行域卸载 Monitor
		for (const domain of domainList) {
			const actionMap = thiz.#monitorsMap.get(domain);

			if (!actionMap) {
				continue;
			}

			// 根据 actions 从不同的触发器集合移除
			removeFromActionMap(actionMap);
		}
	};

	/**
	 * ```plain
	 * 获取当前运行域封送到目标运行域的所有符合条件的 Monitor
	 * ```
	 *
	 * @param {Domain} sourceDomain
	 * @param {Domain} targetDomain
	 * @param {number} action
	 * @param {Object} target
	 * @returns {Array<Monitor>?}
	 */
	static #getMonitorsBy(sourceDomain, targetDomain, action, target) {
		const instance = DomainMonitors.#domainMonitors.get(sourceDomain);

		if (!instance) {
			return null;
		}

		const targetActionMap = instance.#targetMonitorsMap.get(target);
		const targetMonitors = targetActionMap && targetActionMap[action];
		const actionMap = instance.#monitorsMap.get(targetDomain);
		const actionMonitors = actionMap && actionMap[action];

		let array = null;

		if (targetMonitors) {
			array = [...targetMonitors];
		} // 优先执行指定目标的 Monitor

		if (actionMonitors) {
			if (!array) {
				array = [...actionMonitors];
			} else {
				array.push(...actionMonitors);
			}
		}

		return array;
	};

	/**
	 * ```plain
	 * 对新的运行域进行 Monitor 安装
	 * ```
	 *
	 * @param {DomainMonitors} thiz
	 * @param {Domain} domain
	 */
	static #handleNewDomain(thiz, domain) {
		let actionMap = thiz.#monitorsMap.get(domain);

		// 遍历所有启用的 Monitor
		for (const monitor of Monitor[SandboxExposer2](SandboxSignal_ListMonitor)) {
			if (monitor.domain === domain) {
				continue;
			}

			// 解构 Monitor 相关条件
			const [actions, allowDomains, disallowDomains, targets] = Monitor[SandboxExposer2](SandboxSignal_ExposeInfo, monitor);

			// 指定了目标的 Monitor 不参与新运行域处理
			if (targets) {
				continue;
			}

			// 判断新增的 Domain 是否是 Monitor 监听的目标
			if (allowDomains && !allowDomains.has(domain)) {
				continue;
			}
			if (disallowDomains && disallowDomains.has(domain)) {
				continue;
			}

			// 根据 actions 添加到不同的触发器集合
			if (!actionMap) {
				thiz.#monitorsMap.set(domain, (actionMap = {}));
			}

			for (const action of actions) {
				let monitors = actionMap[action];

				if (!monitors) {
					monitors = actionMap[action] = new Set();
				}

				monitors.add(monitor);
			}
		}
	};

	/**
	 * ```plain
	 * 处理新的运行域
	 * ```
	 *
	 * @param {Domain} newDomain
	 */
	static handleNewDomain(newDomain) {
		// @ts-expect-error Sandbox
		const totalDomains = new Set(Domain[SandboxExposer2](SandboxSignal_ListDomain));

		for (const domain of totalDomains) {
			const instance = DomainMonitors.#domainMonitors.get(domain);

			if (!instance) {
				continue;
			}

			DomainMonitors.#handleNewDomain(instance, newDomain);
		}
	}

	/**
	 * ```plain
	 * 分发 Monitor 监听事件
	 * ```
	 *
	 * @param {Domain} sourceDomain
	 * @param {Domain} targetDomain
	 * @param {number} action
	 * @param {Array} args
	 * @returns
	 */
	static dispatch(sourceDomain, targetDomain, action, args) {
		const nameds = {};
		let indexMap;

		// 构造命名参数
		switch (action) {
			case AccessAction.CALL:
				indexMap = {
					target: 0,
					thisArg: 1,
					arguments: 2,
				};
				break;
			case AccessAction.NEW:
				indexMap = {
					target: 0,
					arguments: 1,
					newTarget: 2,
				};
				break;
			case AccessAction.DEFINE:
				indexMap = {
					target: 0,
					property: 1,
					descriptor: 2,
				};
				break;
			case AccessAction.DELETE:
			case AccessAction.DESCRIBE:
			case AccessAction.EXISTS:
				indexMap = {
					target: 0,
					property: 1,
				};
				break;
			case AccessAction.READ:
				indexMap = {
					target: 0,
					property: 1,
					receiver: 2,
				};
				break;
			case AccessAction.TRACE:
			case AccessAction.LIST:
			case AccessAction.SEAL:
				indexMap = {
					target: 0,
				};
				break;
			case AccessAction.WRITE:
				indexMap = {
					target: 0,
					property: 1,
					value: 2,
					receiver: 3,
				};
				break;
			case AccessAction.META:
				indexMap = {
					target: 0,
					prototype: 1,
				};
				break;
			default:
				throw new TypeError("不支持的访问操作");
		}

		for (const key in indexMap) {
			nameds[key] = args[indexMap[key]];
		}

		Object.freeze(indexMap);
		Object.freeze(nameds);

		// 获取可能的 Monitor 集合
		const monitorMap = DomainMonitors.#getMonitorsBy(sourceDomain, targetDomain, action, args[0]);

		const result = {
			preventDefault: false,
			stopPropagation: false,
			returnValue: undefined,
		};

		if (!monitorMap || !monitorMap.length) {
			return result;
		}

		const access = {
			domain: targetDomain,
			action,
		};

		const control = Object.freeze({
			preventDefault() {
				result.preventDefault = true;
			},
			stopPropagation() {
				result.stopPropagation = true;
			},
			/**
			 * @param {string} name
			 * @param {any} value
			 */
			overrideParameter(name, value) {
				if (!(name in indexMap)) {
					throw new TypeError(`参数 ${name} 没有找到`);
				}

				args[indexMap[name]] = value;
			},
			/**
			 * @param {undefined} value
			 */
			setReturnValue(value) {
				result.returnValue = value;
			},
			throwDenied(message = null) {
				throw new RangeError(message || "封送对象的源运行域禁止了此项操作");
			},
		});

		// 遍历并尝试分发监听事件
		for (const monitor of monitorMap) {
			Monitor[SandboxExposer2](SandboxSignal_DiapatchMonitor, monitor, access, nameds, control);

			if (result.stopPropagation) {
				break;
			}
		}

		return result;
	}

	/**
	 * ```plain
	 * 安装一个 Monitor 监控
	 * ```
	 *
	 * @param {Monitor} monitor
	 */
	static installMonitor(monitor) {
		const domain = monitor.domain;
		let instance = DomainMonitors.#domainMonitors.get(domain);

		if (!instance) {
			DomainMonitors.#domainMonitors.set(domain, (instance = new DomainMonitors()));
		}

		DomainMonitors.#installMonitor(instance, monitor);
	}

	/**
	 * ```plain
	 * 卸载一个 Monitor 监控
	 * ```
	 *
	 * @param {Monitor} monitor
	 */
	static uninstallMonitor(monitor) {
		const domain = monitor.domain;
		const instance = DomainMonitors.#domainMonitors.get(domain);

		if (instance) {
			DomainMonitors.#uninstallMonitor(instance, monitor);
		}
	}
}

/**
 * ```plain
 * 提供封送对象的行为监控
 *
 * 可以对具体的行为、访问的属性进行监控并更改行为
 *
 * 例如监听 dummy 这个对象的 value 属性在运行域 domain 的修改行为:
 * ```
 * ```javascript
 * const monitor = new Monitor();
 * monitor.allow(domain); // 指定监听 domain 运行域
 * monitor.action(AccessAction.WRITE); // 指定监听 Reflect.set 行为
 * monitor.require("target", dummy); // 指定监听 dummy 对象
 * monitor.require("property", "value"); // 指定监听 value 属性
 * monitor.filter((access, nameds) => nameds.value >= 0); // 过滤掉大于等于 0 的修改
 * monitor.then((access, nameds, control) => {
 *     control.overrideParameter("value", 0); // 将要修改的新值改回 0
 * });
 * monitor.start(); // 启动Monitor
 * ```
 */
class Monitor {
	/** @type {Set<Monitor>} */
	static #monitorSet = new Set();

	/** @type {Domain} */
	#domain;
	/** @type {Set<Domain>?} */
	#allowDomains = null;
	/** @type {Set<Domain>?} */
	#disallowDomains = null;
	/** @type {Set<number>} */
	#actions = new Set();
	/** @type {Record<string, Set>} */
	#checkInfo = {};
	/** @type {Function?} */
	#filter = null;
	/** @type {Function?} */
	#handler = null;

	constructor() {
		this.#domain = Domain.current;
	}

	/**
	 * ```plain
	 * 检查当前是否是 Monitor 所属的运行域
	 * ```
	 *
	 * @param {Monitor} thiz
	 */
	static #assertOperator(thiz) {
		if (thiz.#domain !== Domain.current) {
			throw new Error("当前不是 Monitor 所属的运行域");
		}
	};

	/**
	 * ```plain
	 * 获取 Monitor 所属的运行域
	 * ```
	 */
	get domain() {
		return this.#domain;
	}

	/**
	 * ```plain
	 * 指定 Monitor 可以监听的运行域
	 * 默认监听封送到的所有运行域
	 * ```
	 *
	 * @param  {...Domain} domains
	 * @returns {this}
	 */
	allow(...domains) {
		Monitor.#assertOperator(this);

		// 参数检查
		if (this.isStarted) {
			throw new Error("Monitor 在启动期间不能修改");
		}
		if (!domains.length) {
			throw new TypeError("运行域至少要有一个");
		}

		for (const domain of domains) {
			if (!(domain instanceof Domain)) {
				throw new TypeError("无效的运行域");
			}
			if (domain === this.#domain) {
				throw new TypeError("Monitor 不能监听自己");
			}
		}

		// 使用黑白名单
		if (this.#allowDomains) {
			for (const domain of domains) {
				this.#allowDomains.add(domain);
			}
		} else if (this.#disallowDomains) {
			for (const domain of domains) {
				this.#disallowDomains.delete(domain);
			}
		} else {
			this.#allowDomains = new Set(domains);
		}

		return this;
	}

	/**
	 * ```plain
	 * 指定 Monitor 不可监听的运行域
	 * 默认监听封送到的所有运行域
	 * ```
	 *
	 * @param  {...Domain} domains
	 * @returns {this}
	 */
	disallow(...domains) {
		Monitor.#assertOperator(this);

		// 参数检查
		if (this.isStarted) {
			throw new Error("Monitor 在启动期间不能修改");
		}
		if (!domains.length) {
			throw new TypeError("运行域至少要有一个");
		}

		for (const domain of domains) {
			if (!(domain instanceof Domain)) {
				throw new TypeError("无效的运行域");
			}
		}

		// 使用黑白名单
		if (this.#disallowDomains) {
			for (const domain of domains) {
				this.#disallowDomains.add(domain);
			}
		} else if (this.#allowDomains) {
			for (const domain of domains) {
				this.#allowDomains.delete(domain);
			}
		} else {
			this.#disallowDomains = new Set(domains);
		}

		return this;
	}

	/**
	 * ```plain
	 * 指定 Monitor 监听的访问动作
	 * ```
	 *
	 * @param  {...number} action
	 * @returns {this}
	 */
	action(...action) {
		Monitor.#assertOperator(this);

		// 参数检查
		if (this.isStarted) {
			throw new Error("Monitor 在启动期间不能修改");
		}
		if (action.length == 0 || !action.every(AccessAction.isAccessAction)) {
			throw new TypeError("无效的访问动作");
		}

		for (const item of action) {
			this.#actions.add(item);
		}

		return this;
	}

	/**
	 *
	 * @typedef {"target" | "thisArg" | "arguments"
	 *     | "newTarget" | "property" | "descriptor"
	 *     | "receiver" | "prototype" | "value"
	 * } PropertyKey
	 *
	 * @typedef {{
	 *     domain: Domain,
	 *     action: number,
	 * }} Access
	 *
	 * @typedef {{
	 *     target: Object,
	 *     thisArg?: Object,
	 *     arguments?: Array<any>,
	 *     newTarget?: Function,
	 *     property?: string | symbol,
	 *     descriptor?: {
	 *         value?: any,
	 *         writable?: boolean,
	 *         get?: () => any,
	 *         set?: (value: any) => void,
	 *         enumerable?: boolean,
	 *         configurable?: boolean,
	 *     },
	 *     receiver?: Object,
	 *     prototype?: Object,
	 *     value?: any,
	 * }} Nameds
	 *
	 * @typedef {{
	 *     preventDefault: () => void,
	 *     stopPropagation: () => void,
	 *     overrideParameter: (name: PropertyKey, value: any) => void,
	 *     setReturnValue: (value: any) => void,
	 *     throwDenied: (message?: string) => never,
	 * }} Control
	 *
	 */

	/**
	 * ```plain
	 * 指定 Monitor 监听的命名参数
	 *
	 * 命名参数可能如下:
	 * target: 监听的对象，访问动作：所有
	 * thisArg: 调用的this对象，访问动作：CALL
	 * arguments: 调用的参数，访问动作：CALL, NEW
	 * newTarget: 构造的new.target，访问动作：NEW
	 * property: 访问的属性，访问动作：DEFINE, DELETE, DESCRIBE, EXISTS, READ, WRITE
	 * descriptor: 定义的属性描述符，访问动作：DEFINE
	 * receiver: 设置或读取的this对象，访问动作：READ, WRITE
	 * prototype: 定义的原型，访问动作：META
	 * value: 设置的新值，访问动作：WRITE
	 * ```
	 *
	 * @param {PropertyKey} name 命名参数名称
	 * @param  {...any} values 命名参数可能的值
	 * @returns {this}
	 */
	require(name, ...values) {
		Monitor.#assertOperator(this);

		if (this.isStarted) {
			throw new Error("Monitor 在启动期间不能修改");
		}
		if (typeof name != "string") {
			throw new TypeError("无效的检查名称");
		}
		if (!values.length) {
			return this;
		}

		let info = this.#checkInfo[name];

		if (!info) {
			info = this.#checkInfo[name] = new Set();
		}

		for (const value of values) {
			info.add(value);
		}

		return this;
	}

	/**
	 * ```plain
	 * 指定 Monitor 监听的过滤器
	 *
	 * 回调参数 nameds 是一个对象，包含了 Monitor 监听的命名参数
	 * ```
	 *
	 * @param {(access: Access, nameds: Nameds) => boolean} filter 要指定的过滤器
	 * @returns {this}
	 */
	filter(filter) {
		Monitor.#assertOperator(this);

		if (this.isStarted) {
			throw new Error("Monitor 在启动期间不能修改");
		}
		if (typeof filter != "function") {
			throw new TypeError("无效的过滤器");
		}

		this.#filter = filter;
		return this;
	}

	/**
	 * ```plain
	 * 指定 Monitor 监听的回调函数
	 *
	 * 回调参数 nameds 是一个对象，包含了 Monitor 监听的命名参数
	 * 回调参数 control 是一个对象，提供本次监听的控制函数
	 * control.preventDefault(value) 阻止默认的行为，并将设定的返回值作为本次代理访问的返回值
	 * control.stopPropagation() 阻断后续的监听器，但不会阻止默认行为
	 * control.overrideParameter(name, value) 覆盖本次监听的命名参数
	 * control.setReturnValue(value) 设置本次代理访问的返回值，可以覆盖之前监听器设置的返回值
	 * ```
	 *
	 * @param {(access: Access, nameds: Nameds, control: Control) => void} handler
	 * @returns {this}
	 */
	then(handler) {
		Monitor.#assertOperator(this);

		if (this.isStarted) {
			throw new Error("Monitor 在启动期间不能修改");
		}
		if (typeof handler != "function") {
			throw new TypeError("无效的回调");
		}

		this.#handler = handler;
		return this;
	}

	/**
	 * ```plain
	 * 判断 Monitor 是否已经启动
	 * ```
	 *
	 * @type {boolean}
	 */
	get isStarted() {
		return Monitor.#monitorSet.has(this);
	}

	/**
	 * ```plain
	 * 启动 Monitor
	 * ```
	 */
	start() {
		Monitor.#assertOperator(this);

		if (this.isStarted) {
			throw new Error("Monitor 已经启动");
		}
		if (typeof this.#handler != "function") {
			throw new Error("Monitor 未指定回调函数");
		}

		Monitor.#monitorSet.add(this);
		DomainMonitors.installMonitor(this);
	}

	/**
	 * ```plain
	 * 停止 Monitor
	 * ```
	 */
	stop() {
		Monitor.#assertOperator(this);

		if (!this.isStarted) {
			throw new Error("Monitor 还未启动");
		}

		DomainMonitors.uninstallMonitor(this);
		Monitor.#monitorSet.delete(this);
	}

	/**
	 * ```plain
	 * 向外暴露 Monitor 监听的相关数据
	 * ```
	 *
	 * @param {Monitor} thiz
	 */
	static #exposeInfo(thiz) {
		return [thiz.#actions, thiz.#allowDomains, thiz.#disallowDomains, thiz.#checkInfo["target"]];
	};

	/**
	 * ```plain
	 * 检查 Monitor 监听的命名参数是否符合要求
	 * ```
	 *
	 * @param {Record<string, any>} nameds
	 * @param {Record<string, Set>} checkInfo
	 */
	static #check(nameds, checkInfo) {
		for (const [key, value] of Object.entries(nameds)) {
			if (key in checkInfo) {
				if (!checkInfo[key].has(value)) {
					return false;
				}
			}
		}

		return true;
	};

	/**
	 * ```plain
	 * 处理 Monitor 监听事件
	 * ```
	 *
	 * @param {Monitor} thiz
	 * @param {number} access
	 * @param {Nameds} nameds
	 * @param {Control} control
	 */
	static #handle(thiz, access, nameds, control) {
		if (!Monitor.#check(nameds, thiz.#checkInfo)) {
			return;
		}

		const filter = thiz.#filter;
		if (typeof filter === "function" && !filter(access, nameds)) {
			return;
		}

		if (typeof thiz.#handler !== "function") {
			throw new TypeError("Monitor 未指定回调函数");
		}

		thiz.#handler(access, nameds, control);
	};

	/**
	 * @param {Symbol} signal
	 * @param  {...any} args
	 */
	static [SandboxExposer2](signal, ...args) {
		switch (signal) {
			case SandboxSignal_DiapatchMonitor:
				// @ts-expect-error Sandbox
				return Monitor.#handle(...args);
			case SandboxSignal_ListMonitor:
				return Monitor.#monitorSet;
			case SandboxSignal_ExposeInfo:
				// @ts-expect-error Sandbox
				return Monitor.#exposeInfo(...args);
		}
	}
}

/**
 * ```plain
 * 提供运行域之间的对象封送
 * ```
 */
class Marshal {
	static #revertTarget = Symbol("Marshal.revertTarget");
	static #sourceDomain = Symbol("Marshal.sourceDomain");

	static #marshalRules = new WeakMap();
	static #marshalledProxies = new WeakSet();

	constructor() {
		throw new TypeError("Marshal 类无法被构造");
	}

	/**
	 * ```plain
	 * 判断是否应该封送
	 * ```
	 *
	 * @param {any} obj
	 * @returns {boolean}
	 */
	static #shouldMarshal(obj) {
		if (obj === Marshal || obj === Rule || obj === AccessAction || obj === Domain || obj === Sandbox || obj instanceof Domain) {
			return false;
		}

		return true;
	};

	/**
	 * ```plain
	 * 判断是否禁止封送
	 * ```
	 *
	 * @param {any} obj
	 * @returns {boolean}
	 */
	static #strictMarshal(obj) {
		return obj instanceof Sandbox || obj instanceof Rule || obj instanceof Monitor;
	};

	/**
	 * ```plain
	 * 拆除封送代理
	 * ```
	 *
	 * @typedef {[
	 *     Domain,
	 *     Object,
	 * ]} Reverted
	 *
	 * @param {any} proxy
	 * @returns {Reverted}
	 */
	static #revertProxy(proxy) {
		return [proxy[Marshal.#sourceDomain], proxy[Marshal.#revertTarget]];
	};

	/**
	 * ```plain
	 * 检查封送缓存
	 * ```
	 *
	 * @param {Object} obj
	 * @param {Domain} domain
	 * @returns {Object?}
	 */
	static #cacheProxy(obj, domain) {
		return domain[SandboxExposer](SandboxSignal_GetMarshalledProxy, obj);
	};

	/**
	 * ```plain
	 * 获取指定对象的封送规则引用
	 * ```
	 *
	 * @param {Object} obj
	 * @returns {{rule: Rule}}
	 */
	static #ensureRuleRef(obj) {
		let rule = Marshal.#marshalRules.get(obj);

		if (!rule) {
			Marshal.#marshalRules.set(obj, (rule = { rule: null }));
		}

		return rule;
	};

	/**
	 * ```plain
	 * 判断某个对象是否指定了封送规则
	 * ```
	 *
	 * @param {Object} obj
	 * @returns {boolean}
	 */
	static hasRule(obj) {
		return Marshal.#marshalRules.has(obj);
	}

	/**
	 * ```plain
	 * 指定某个对象的封送规则
	 * ```
	 *
	 * @param {Object} obj
	 * @param {Rule} rule
	 */
	static setRule(obj, rule) {
		if (Marshal.#marshalledProxies.has(obj)) {
			throw new ReferenceError("无法为封送对象设置封送规则");
		}

		const ref = Marshal.#ensureRuleRef(obj);

		if (ref.rule) {
			throw new ReferenceError("对象的封送规则已经被设置");
		}

		ref.rule = rule;
	}

	/**
	 * ```plain
	 * 判断某个对象是否是其他运行域被封送的对象
	 * ```
	 *
	 * @param {Object} obj
	 * @returns {boolean}
	 */
	static isMarshalled(obj) {
		return Marshal.#marshalledProxies.has(obj);
	}

	/**
	 * ```plain
	 * 获取封送对象的源运行域
	 * ```
	 *
	 * @param {Object} obj
	 * @returns {Domain?}
	 */
	static getMarshalledDomain(obj) {
		if (!Marshal.#marshalledProxies.has(obj)) {
			return null;
		}

		const [domain] = Marshal.#revertProxy(obj);
		return domain;
	}

	/**
	 * ```plain
	 * 对于封送或未封送的函数执行转字符串操作
	 * ```
	 *
	 * @param {Function} func
	 */
	static decompileFunction(func) {
		if (typeof func !== "function") {
			throw new TypeError("无效的函数对象");
		}

		if (Marshal.#marshalledProxies.has(func)) {
			[, func] = Marshal.#revertProxy(func);
		}

		const refs = Sandbox[SandboxExposer2](SandboxSignal_TryFunctionRefs, func);

		if (refs) {
			return refs;
		}

		return Function.prototype.toString.call(func);
	}

	/**
	 * ```plain
	 * 判断给定的参数列表和函数体字符串是否可以构造一个合法的函数
	 * ```
	 *
	 * @typedef {"async"|"generator"|"agenerator"|"any"|null} FunctionType
	 *
	 * @param {string|string[]} paramList
	 * @param {string} funcBody
	 * @param {FunctionType} [type = null]
	 */
	static canCreateFunction(paramList, funcBody, type = null) {
		if (Array.isArray(paramList)) {
			paramList = paramList.join(",");
		}

		if (type == "any") {
			return (
				["async", "generator", "agenerator", null]
					// @ts-expect-error Sandbox // 突然发现ts-ignore也挺方便的喵
					.some(t => Marshal.canCreateFunction(t, paramList, funcBody))
			);
		}

		try {
			switch (type) {
				default:
					new Function(paramList, funcBody);
					break;
				case "generator":
					new GeneratorFunction(paramList, funcBody);
					break;
				case "async":
					new AsyncFunction(paramList, funcBody);
					break;
				case "agenerator":
					new AsyncGeneratorFunction(paramList, funcBody);
					break;
			}
		} catch (e) {
			return false;
		}

		return true;
	}

	/**
	 * ```plain
	 * 陷入某个运行域并执行代码
	 * ```
	 *
	 * @param {Domain} domain
	 * @param {() => any} action
	 */
	static #trapDomain(domain, action) {
		const prevDomain = Domain.current;

		// 如果可能，应该尽量避免陷入相同运行域
		if (prevDomain === domain) {
			return console.warn("trapDomain 处于相同 domain"), action();
		}

		Domain[SandboxExposer2](SandboxSignal_EnterDomain, domain);

		try {
			return action();
		} catch (e) {
			throw Marshal.#marshal(e, prevDomain);
		} finally {
			Domain[SandboxExposer2](SandboxSignal_ExitDomain);
		}
	};

	/**
	 * ```plain
	 * 封送数组
	 * ```
	 *
	 * @param {Array} array
	 * @param {Domain} targetDomain
	 * @returns {Array}
	 */
	static #marshalArray(array, targetDomain) {
		if (isPrimitive(array)) {
			return array;
		}

		// 构造目标域的数组，并逐个元素封送
		const window = targetDomain[SandboxExposer](SandboxSignal_GetWindow);
		const newArray = new window.Array(array.length);

		for (let i = 0; i < newArray.length; i++) {
			newArray[i] = Marshal.#marshal(array[i], targetDomain);
		}

		return newArray;
	};

	/**
	 * ```plain
	 * 封送对象
	 * ```
	 *
	 * @param {Object} object
	 * @param {Domain} targetDomain
	 * @returns {Object}
	 */
	static #marshalObject(object, targetDomain) {
		if (isPrimitive(object)) {
			return object;
		}

		// 构造目标域的对象，并逐个属性封送
		const window = targetDomain[SandboxExposer](SandboxSignal_GetWindow);
		const newObject = new window.Object();

		for (const key of Reflect.ownKeys(object)) {
			newObject[key] = Marshal.#marshal(object[key], targetDomain);
		}

		return newObject;
	};

	/**
	 * ```plain
	 * 根据目标对象的特征复制一个基本对象
	 * ```
	 *
	 * @param {Object} src
	 * @returns {any}
	 */
	static #clonePureObject(src) {
		let cloned;

		if (typeof src === "function") {
			const descriptor = Reflect.getOwnPropertyDescriptor(src, "prototype");
			if (descriptor && descriptor.value && !descriptor.enumerable && !descriptor.configurable) {
				cloned = function () {};
			} else {
				cloned = () => {};
			}
		} else if (Array.isArray(src)) {
			cloned = [];
		} else {
			cloned = {};
		}

		Reflect.setPrototypeOf(cloned, null);
		return cloned;
	};

	/**
	 * ```plain
	 * 封送核心函数
	 * ```
	 *
	 * @param {Object} obj
	 * @param {Domain} targetDomain
	 * @returns {Object}
	 */
	static #marshal(obj, targetDomain) {
		// 基元封送
		if (isPrimitive(obj)) {
			return obj;
		}

		// 尝试拆除代理
		let [sourceDomain, target] = Marshal.#marshalledProxies.has(obj) ? Marshal.#revertProxy(obj) : [Domain.current, obj];

		// target: 确保拆除了封送代理的对象
		// sourceDomain: target所属的运行域
		// targetDomain: 要封送到的运行域

		if (sourceDomain === targetDomain) {
			return target;
		}

		// 检查基本封送条件
		if (Marshal.#strictMarshal(target) || sourceDomain.isUnsafe(target)) {
			throw new TypeError("对象无法封送");
		}
		if (!Marshal.#shouldMarshal(target)) {
			return target;
		}

		// 全局变量封送
		const mapped = Globals.mapTo(target, sourceDomain, targetDomain);

		if (mapped != null) {
			return mapped;
		}

		// 错误封送
		if (sourceDomain.isError(target)) {
			// 把源错误对象克隆到目标运行域
			const errorCtor = target.constructor;
			const mappedCtor = Globals.mapTo(errorCtor, sourceDomain, targetDomain);

			// // 立即报告错误，而不是通过封送报错
			// const window = Domain.topDomain[SandboxExposer](SandboxSignal_GetWindow);
			// window.onunhandledrejection && window.onunhandledrejection({ promise: Promise.reject(target) });

			if (mappedCtor) {
				const newError = new mappedCtor();
				const silentAccess = (o, p, d) => {
					try {
						if (typeof p == "function") {
							return p(o);
						} else {
							return o[p];
						}
					} catch (e) {
						return d;
					}
				};
				const pinValue = (o, p, v) => {
					Reflect.defineProperty(o, p, {
						get: () => v,
						set: () => {},
						configurable: false,
					});
				};

				const name = String(silentAccess(target, "name", "#无法获取错误名#"));
				const message = String(silentAccess(target, "message", "#无法获取错误消息#"));
				const stack = String(silentAccess(target, "stack", "#无法获取调用栈#"));
				const string = silentAccess(target, String, "#无法获取错误信息#");

				pinValue(newError, "name", name);
				pinValue(newError, "message", message);
				pinValue(newError, "stack", stack);
				pinValue(newError, "toString", () => string);

				// 继承原本的错误信息
				const errorReporter = ErrorManager.getErrorReporter(target);
				ErrorManager.setErrorReporter(newError, errorReporter || new ErrorReporter(target)); // 无论有没有都捕获当前的错误信息

				return newError;
			}
		}

		// 检查封送权限
		const ruleRef = Marshal.#ensureRuleRef(target); // 为加快访问速度使用了引用
		const rule = ruleRef.rule;

		if (rule && !rule.canMarshalTo(targetDomain)) {
			throw new TypeError("无法将对象封送到目标运行域");
		}

		// 检查封送缓存
		const cached = Marshal.#cacheProxy(target, targetDomain);

		if (cached) {
			return cached;
		}

		// 创建一个空白对象，防止JavaScript的一些奇怪错误
		const pure = Marshal.#clonePureObject(target);

		// 创建封送代理
		const proxy = new Proxy(pure, {
			// 设置属性方便调试
			// @ts-expect-error Sandbox
			$target: target,
			$sourceDomain: sourceDomain,
			$targetDomain: targetDomain,
			apply(_, thisArg, argArray) {
				const defaultApply = () => {
					const marshalledThis = Marshal.#marshal(thisArg, sourceDomain);
					const marshalledArgs = Marshal.#marshalArray(argArray, sourceDomain);

					return Marshal.#trapDomain(sourceDomain, () => {
						const rule = ruleRef.rule;

						if (rule && !rule.canAccess(AccessAction.CALL, target, marshalledThis, marshalledArgs)) {
							throw new ReferenceError("封送对象的源运行域禁止了此项操作");
						}

						const args = [target, marshalledThis, marshalledArgs];
						const dispatched = DomainMonitors.dispatch(sourceDomain, targetDomain, AccessAction.CALL, args);

						if (dispatched.preventDefault) {
							return Marshal.#marshal(dispatched.returnValue, targetDomain);
						}

						// @ts-expect-error Sandbox
						const result = Reflect.apply(...args);
						return Marshal.#marshal(result, targetDomain);
					});
				};

				// 此处处理异步封送
				// 如果没有逃逸情况，此处代表着当前是异步调用
				if (Domain.current !== targetDomain) {
					return Marshal.#trapDomain(targetDomain, defaultApply);
				}

				return defaultApply();
			},
			construct(_, argArray, newTarget) {
				const marshalledArgs = Marshal.#marshalArray(argArray, sourceDomain);
				const marshalledNewTarget = Marshal.#marshal(newTarget, sourceDomain);

				return Marshal.#trapDomain(sourceDomain, () => {
					const rule = ruleRef.rule;

					if (rule && !rule.canAccess(AccessAction.NEW, target, argArray, newTarget)) {
						throw new ReferenceError("封送对象的源运行域禁止了此项操作");
					}

					const args = [target, marshalledArgs, marshalledNewTarget];
					const dispatched = DomainMonitors.dispatch(sourceDomain, targetDomain, AccessAction.NEW, args);

					if (dispatched.preventDefault) {
						return Marshal.#marshal(dispatched.returnValue, targetDomain);
					}

					// @ts-expect-error Sandbox
					const result = Reflect.construct(...args);
					return Marshal.#marshal(result, targetDomain);
				});
			},
			defineProperty(_, property, attributes) {
				const isSourceDomain = sourceDomain === Domain.current;

				if (!isSourceDomain) {
					let getter = attributes.get;
					let setter = attributes.set;

					if (typeof getter == "function") {
						getter = Marshal.#marshal(getter, sourceDomain);
					}
					if (typeof setter == "function") {
						setter = Marshal.#marshal(setter, sourceDomain);
					}

					const window = sourceDomain[SandboxExposer](SandboxSignal_GetWindow);
					const descriptor = new window.Object();

					if ("value" in attributes) {
						descriptor.value = Marshal.#marshal(attributes.value, sourceDomain);
					}
					if ("get" in attributes) {
						descriptor.get = getter;
					}
					if ("set" in attributes) {
						descriptor.set = setter;
					}
					if ("writable" in attributes) {
						descriptor.writable = !!attributes.writable;
					}
					if ("enumerable" in attributes) {
						descriptor.enumerable = !!attributes.enumerable;
					}
					if ("configurable" in attributes) {
						descriptor.configurable = !!attributes.configurable;
					}

					attributes = descriptor;
				}

				const domainTrapAction = () => {
					const rule = ruleRef.rule;

					if (rule && !rule.canAccess(AccessAction.DEFINE, target, property, attributes)) {
						throw new ReferenceError("封送对象的源运行域禁止了此项操作");
					}

					const args = [target, property, attributes];
					const dispatched = DomainMonitors.dispatch(sourceDomain, targetDomain, AccessAction.DEFINE, args);

					if (dispatched.preventDefault) {
						return !!dispatched.returnValue;
					}

					// @ts-expect-error Sandbox
					const success = Reflect.defineProperty(...args);

					if (success && target === args[0]) {
						// 为适配JavaScript对于代理的强制要求
						// 我们要对空白对象模拟不可配置
						// @ts-expect-error Sandbox
						attributes = Reflect.getOwnPropertyDescriptor(...args);

						if (!attributes.configurable) {
							Reflect.defineProperty(pure, args[1], attributes);
						}
					}

					return success;
				};

				// `defineProperty`、`getOwnPropertyDescriptor`、`has` 都可能被JavaScript引擎重复调用
				// 故在执行之前，为避免 `trapDomain` 的警告，我们先进行一次判断
				return isSourceDomain ? domainTrapAction() : Marshal.#trapDomain(sourceDomain, domainTrapAction);
			},
			deleteProperty(_, p) {
				return Marshal.#trapDomain(sourceDomain, () => {
					const rule = ruleRef.rule;

					if (rule && !rule.canAccess(AccessAction.DELETE, target, p)) {
						throw new ReferenceError("封送对象的源运行域禁止了此项操作");
					}

					const args = [target, p];
					const dispatched = DomainMonitors.dispatch(sourceDomain, targetDomain, AccessAction.DELETE, args);

					if (dispatched.preventDefault) {
						return !!dispatched.returnValue;
					}

					// @ts-expect-error Sandbox
					return Reflect.deleteProperty(...args);
				});
			},
			get(_, p, receiver) {
				// 因为 get 的东西最多，所以对此追加注释
				// 其他的拦截器都是与 get 类似

				// 向外暴露封送
				switch (p) {
					case Marshal.#revertTarget:
						return target;
					case Marshal.#sourceDomain:
						return sourceDomain;
				}

				// 默认封送
				const marshalledReceiver = Marshal.#marshal(receiver, sourceDomain);

				// 陷入源运行域执行
				return Marshal.#trapDomain(sourceDomain, () => {
					// 获取封送规则并检查
					const rule = ruleRef.rule;

					if (rule && !rule.canAccess(AccessAction.READ, target, p, marshalledReceiver)) {
						throw new ReferenceError("封送对象的源运行域禁止了此项操作");
					}

					// 通知 Monitor
					const args = [target, p, marshalledReceiver];
					const dispatched = DomainMonitors.dispatch(sourceDomain, targetDomain, AccessAction.READ, args);

					// 处理 Monitor 的结果
					if (dispatched.preventDefault) {
						return Marshal.#marshal(dispatched.returnValue, targetDomain);
					}

					// 执行默认流程
					// @ts-expect-error Sandbox
					const result = Reflect.get(...args);
					return Marshal.#marshal(result, targetDomain);
				});
			},
			getOwnPropertyDescriptor(_, p) {
				const isSourceDomain = Domain.current === sourceDomain;

				const domainTrapAction = () => {
					const rule = ruleRef.rule;

					if (rule && !rule.canAccess(AccessAction.DESCRIBE, target, p)) {
						throw new ReferenceError("封送对象的源运行域禁止了此项操作");
					}

					const args = [target, p];
					const dispatched = DomainMonitors.dispatch(sourceDomain, targetDomain, AccessAction.DESCRIBE, args);

					if (dispatched.preventDefault) {
						return dispatched.returnValue;
					}

					// @ts-expect-error Sandbox
					return Reflect.getOwnPropertyDescriptor(...args);
				};

				if (isSourceDomain) {
					return domainTrapAction();
				}

				return Marshal.#trapDomain(sourceDomain, () => {
					const descriptor = domainTrapAction();
					return Marshal.#marshalObject(descriptor, targetDomain);
				});
			},
			getPrototypeOf(_) {
				return Marshal.#trapDomain(sourceDomain, () => {
					const rule = ruleRef.rule;

					if (rule && !rule.canAccess(AccessAction.TRACE, target)) {
						throw new ReferenceError("封送对象的源运行域禁止了此项操作");
					}

					const args = [target];
					const dispatched = DomainMonitors.dispatch(sourceDomain, targetDomain, AccessAction.TRACE, args);

					if (dispatched.preventDefault) {
						return Marshal.#marshal(dispatched.returnValue, targetDomain);
					}

					// @ts-expect-error Sandbox
					const result = Reflect.getPrototypeOf(...args);
					const marshalledResult = Marshal.#marshal(result, targetDomain);

					if (Marshal.#marshalledProxies.has(marshalledResult)) {
						return null;
					} // 没有实装hasInstance喵，只能折中处理喵

					return marshalledResult;
				});
			},
			has(_, p) {
				const isSourceDomain = Domain.current === sourceDomain;
				const domainTrapAction = () => {
					const rule = ruleRef.rule;

					if (rule && !rule.canAccess(AccessAction.EXISTS, target, p)) {
						throw new ReferenceError("封送对象的源运行域禁止了此项操作");
					}

					const args = [target, p];
					const dispatched = DomainMonitors.dispatch(sourceDomain, targetDomain, AccessAction.EXISTS, args);

					if (dispatched.preventDefault) {
						return !!dispatched.returnValue;
					}

					// @ts-expect-error Sandbox
					return Reflect.has(...args);
				};

				if (isSourceDomain) {
					return domainTrapAction();
				}

				return Marshal.#trapDomain(sourceDomain, domainTrapAction);
			},
			isExtensible(_) {
				return Reflect.isExtensible(target);
			},
			ownKeys(_) {
				return Marshal.#trapDomain(sourceDomain, () => {
					const rule = ruleRef.rule;

					if (rule && !rule.canAccess(AccessAction.LIST, target)) {
						throw new ReferenceError("封送对象的源运行域禁止了此项操作");
					}

					const args = [target];
					const dispatched = DomainMonitors.dispatch(sourceDomain, targetDomain, AccessAction.LIST, args);

					/** @type {Array} */
					let keys;

					if (dispatched.preventDefault) {
						if (!Array.isArray(dispatched.returnValue)) {
							throw new TypeError("`Reflect.ownKeys` 必须返回一个数组");
						}

						keys = dispatched.returnValue;
					}
					else {
						// @ts-expect-error Sandbox
						keys = Reflect.ownKeys(...args);
					}

					return Marshal.#marshalArray(keys, targetDomain);
				});
			},
			preventExtensions(_) {
				return Marshal.#trapDomain(sourceDomain, () => {
					const rule = ruleRef.rule;

					if (rule && !rule.canAccess(AccessAction.SEAL, target)) {
						throw new ReferenceError("封送对象的源运行域禁止了此项操作");
					}

					const args = [target];
					const dispatched = DomainMonitors.dispatch(sourceDomain, targetDomain, AccessAction.SEAL, args);

					if (dispatched.preventDefault) {
						return !!dispatched.returnValue;
					}

					// @ts-expect-error Sandbox
					const success = Reflect.preventExtensions(...args);

					if (success && target === args[0]) {
						// 为适配JavaScript对于代理的强制要求
						// 我们要对空白对象进行模拟键
						Reflect.ownKeys(target).forEach(key => {
							pure[key] = undefined;
						});
						Reflect.preventExtensions(pure);
					}

					return success;
				});
			},
			set(_, p, newValue, receiver) {
				const marshalledNewValue = Marshal.#marshal(newValue, sourceDomain);
				const marshalledReceiver = Marshal.#marshal(receiver, sourceDomain);

				return Marshal.#trapDomain(sourceDomain, () => {
					const rule = ruleRef.rule;

					if (rule && !rule.canAccess(AccessAction.WRITE, target, p, marshalledNewValue, marshalledReceiver)) {
						throw new ReferenceError("封送对象的源运行域禁止了此项操作");
					}

					const args = [target, p, marshalledNewValue, marshalledReceiver];
					const dispatched = DomainMonitors.dispatch(sourceDomain, targetDomain, AccessAction.WRITE, args);

					if (dispatched.preventDefault) {
						return !!dispatched.returnValue;
					}

					// @ts-expect-error Sandbox
					return Reflect.set(...args);
				});
			},
			setPrototypeOf(_, v) {
				const marshalledV = Marshal.#marshal(v, sourceDomain);

				if (Marshal.#marshalledProxies.has(marshalledV)) {
					return false;
				} // 没有实装hasInstance喵，只能折中处理喵

				return Marshal.#trapDomain(sourceDomain, () => {
					const rule = ruleRef.rule;

					if (rule && !rule.canAccess(AccessAction.META, target, marshalledV)) {
						throw new ReferenceError("封送对象的源运行域禁止了此项操作");
					}

					const args = [target, marshalledV];
					const dispatched = DomainMonitors.dispatch(sourceDomain, targetDomain, AccessAction.META, args);

					if (dispatched.preventDefault) {
						return !!dispatched.returnValue;
					}

					// @ts-expect-error Sandbox
					return Reflect.setPrototypeOf(...args);
				});
			},
		});

		Marshal.#marshalledProxies.add(proxy);
		targetDomain[SandboxExposer](SandboxSignal_SetMarshalledProxy, target, proxy);
		return proxy;
	};

	/**
	 * @param {Symbol} signal
	 * @param {...any} args
	 */
	static [SandboxExposer2](signal, ...args) {
		switch (signal) {
			case SandboxSignal_Marshal:
				// @ts-expect-error Sandbox
				return Marshal.#marshal(...args);
			case SandboxSignal_MarshalArray:
				// @ts-expect-error Sandbox
				return Marshal.#marshalArray(...args);
			case SandboxSignal_UnpackProxy:
				// @ts-expect-error Sandbox
				return Marshal.#revertProxy(...args);
			case SandboxSignal_TrapDomain:
				// @ts-expect-error Sandbox
				return Marshal.#trapDomain(...args);
		}
	}
}

/**
 * ```plain
 * 运行域对象
 *
 * 提供运行域的创建以及周期管理
 * ```
 */
class Domain {
	static #hasInstance = Object[Symbol.hasInstance];

	/** @type {Array<Domain>} */
	static #domainStack = [];
	/** @type {Domain} */
	static #currentDomain;
	/** @type {Domain} */
	static #topDomain;

	/** @type {Array<WeakRef<Domain>>} */
	static #domainLinks = [];

	#domainName = "top";

	/** @type {typeof Object} */
	#domainObject;
	/** @type {typeof Error} */
	#domainError;
	/** @type {typeof Promise} */
	#domainPromise;
	/** @type {typeof HTMLIFrameElement} */
	#domainIFrame;
	/** @type {Navigator} */
	#domainNavigator;
	/** @type {ServiceWorker} */
	#domainServiceWorker;
	/** @type {Location} */
	#domainLocation;
	/** @type {Function} */
	#domainOpen;
	/** @type {Function} */
	#domainClose;
	/** @type {typeof Worker} */
	#domainWorker;
	/** @type {Object} */
	#domainCSS;
	/** @type {typeof SharedWorker} */
	#domainSharedWorker;
	/** @type {Window} */
	#domainRoot;
	/** @type {WeakMap<Object, Proxy>} */
	#marshalledCached = new WeakMap();

	/**
	 * ```plain
	 * 创建运行域
	 *
	 * 一般不直接使用，
	 * 请考虑使用直接创建沙盒
	 * ```
	 */
	constructor() {
		// @ts-expect-error Sandbox
		let global = window.replacedGlobal || window;

		if (Domain.#currentDomain) {
			// @ts-expect-error Sandbox
			if (!window.createRealms) {
				throw new ReferenceError("Sandbox 载入时处于不安全运行域");
			}

			// 创建新的运行变量域
			// @ts-expect-error Sandbox
			global = createRealms();
			this.#domainName = Math.random().toString(36).slice(2);
		} else {
			NativeWrapper.initTopDomain(global);
		}

		this.#domainRoot = global;
		this.#domainObject = global.Object;
		this.#domainError = global.Error;
		this.#domainPromise = global.Promise;
		this.#domainIFrame = global.HTMLIFrameElement;
		this.#domainNavigator = global.navigator;
		this.#domainServiceWorker = global.navigator.serviceWorker;
		this.#domainLocation = global.location;
		this.#domainOpen = global.open;
		this.#domainClose = global.close;
		this.#domainWorker = global.Worker;
		this.#domainCSS = global.CSS;
		this.#domainSharedWorker = global.SharedWorker;

		NativeWrapper.wrapInDomains(global);
		Globals.ensureDomainGlobals(this);
		DomainMonitors.handleNewDomain(this);
		Domain.#domainLinks.push(new WeakRef(this));
		sealObjectTree(this);
	}

	// 实装这个要代理Object喵
	// static #hasInstanceMarshalled(obj) {
	//     if (Marshal.isMarshalled(obj))
	//         [, obj] = Marshal[SandboxExposer2]
	//             (SandboxSignal_UnpackProxy, obj);

	//     return Domain.#hasInstance.call(this, obj);
	// }

	/**
	 * ```plain
	 * 检查对象是否来自于当前的运行域
	 * ```
	 *
	 * @param {Object?} obj
	 * @returns {boolean}
	 */
	isFrom(obj) {
		if (Marshal.isMarshalled(obj)) {
			const [domain] = Marshal[SandboxExposer2](SandboxSignal_UnpackProxy, obj);
			return domain === this;
		}

		return Domain.#hasInstance.call(this.#domainObject, obj);
	}

	/**
	 * ```plain
	 * 检查对象是否来自于当前的运行域的Promise
	 * ```
	 *
	 * @param {Promise?} promise
	 * @returns {boolean}
	 */
	isPromise(promise) {
		if (Marshal.isMarshalled(promise)) {
			[, promise] = Marshal[SandboxExposer2](SandboxSignal_UnpackProxy, promise);
		}

		return Domain.#hasInstance.call(this.#domainPromise, promise);
	}

	/**
	 * ```plain
	 * 检查对象是否来自于当前的运行域的Error
	 * ```
	 *
	 * @param {Error?} error
	 * @returns {boolean}
	 */
	isError(error) {
		if (Marshal.isMarshalled(error)) {
			[, error] = Marshal[SandboxExposer2](SandboxSignal_UnpackProxy, error);
		}

		return Domain.#hasInstance.call(this.#domainError, error);
	}

	/**
	 * ```plain
	 * 检查对象是否来自于当前的运行域的危险对象
	 * ```
	 *
	 * @param {Object?} obj
	 * @returns {boolean}
	 */
	isUnsafe(obj) {
		if (Marshal.isMarshalled(obj)) {
			[, obj] = Marshal[SandboxExposer2](SandboxSignal_UnpackProxy, obj);
		}

		if (obj === this.#domainRoot) {
			return true;
		}
		if (Domain.#hasInstance.call(this.#domainIFrame, obj)) {
			return true;
		}
		if (obj === this.#domainNavigator) {
			return true;
		}
		if (obj === this.#domainServiceWorker) {
			return true;
		}
		if (obj === this.#domainLocation) {
			return true;
		}
		if (obj === this.#domainOpen) {
			return true;
		}
		if (obj === this.#domainClose) {
			return true;
		}
		if (Domain.#hasInstance.call(this.#domainWorker, obj)) {
			return true;
		}
		if (obj === this.#domainCSS) {
			return true;
		}
		if (Domain.#hasInstance.call(this.#domainSharedWorker, obj)) {
			return true;
		}

		return false;
	}

	toString() {
		return `[Domain ${this.#domainName}]`;
	}

	/**
	 * ```plain
	 * 检查对象是否是Promise对象
	 * ```
	 *
	 * @param {Error?} error
	 * @returns {boolean}
	 */
	static isError(error) {
		if (error instanceof Error) {
			return true;
		}
		if (!Marshal.isMarshalled(error)) {
			return Domain.current.isError(error);
		}

		const [domain, target] = Marshal[SandboxExposer2](SandboxSignal_UnpackProxy, error);

		return target instanceof Error || domain.isError(target);
	}

	/**
	 * @param {Domain} domain
	 */
	static #enterDomain(domain) {
		Domain.#domainStack.push(Domain.#currentDomain);
		Domain.#currentDomain = domain;
	};

	static #exitDomain() {
		if (Domain.#domainStack.length < 1) {
			throw new ReferenceError("无法弹出更多的运行域");
		}

		// @ts-expect-error Sandbox
		Domain.#currentDomain = Domain.#domainStack.pop();
	};

	/**
	 * @returns {Array<Domain>}
	 */
	static #listDomain() {
		const links = Domain.#domainLinks;
		const list = [];

		// 遍历查询并清除无效的运行域
		for (let i = links.length - 1; i >= 0; i--) {
			const link = links[i].deref();

			if (!link) {
				links.splice(i, 1);
			}

			list.push(link);
		}

		// @ts-expect-error Sandbox
		return list;
	};

	/**
	 * ```plain
	 * 获取当前运行域
	 * ```
	 *
	 * @type {Domain}
	 */
	static get current() {
		return Domain.#currentDomain;
	}

	/**
	 * ```plain
	 * 获取调用链中上一个运行域
	 * ```
	 *
	 * @type {Domain?}
	 */
	static get caller() {
		for (let i = Domain.#domainStack.length; i >= 0; i--) {
			const domain = Domain.#domainStack[i];

			if (domain !== Domain.#currentDomain) {
				return domain;
			}
		}

		return null;
	}

	/**
	 * ```plain
	 * 获取顶级运行域
	 * ```
	 *
	 * @type {Domain}
	 */
	static get topDomain() {
		return Domain.#topDomain;
	}

	/**
	 * ```plain
	 * 检查当前的调用是否来自可信的运行域
	 *
	 * 如果检查顶级运行域，则要求没有进行任何其他运行域的陷入
	 * 如果检查非顶级运行域，则要求只有顶级运行域与给定运行域的陷入
	 * ```
	 *
	 * @param {Domain} domain
	 */
	static isBelievable(domain) {
		if (domain === Domain.#topDomain) {
			return !Domain.#domainStack.length;
		}

		return Domain.#domainStack.concat([Domain.#currentDomain]).every(d => d === Domain.#topDomain || d === domain);
	}

	/**
	 * @param {Symbol} signal
	 * @param {...any} args
	 */
	[SandboxExposer](signal, ...args) {
		switch (signal) {
			case SandboxSignal_GetMarshalledProxy:
				// @ts-expect-error Sandbox
				return this.#marshalledCached.get(...args);
			case SandboxSignal_SetMarshalledProxy:
				// @ts-expect-error Sandbox
				return void this.#marshalledCached.set(...args);
			case SandboxSignal_GetWindow:
				return this.#domainRoot;
			case SandboxSignal_GetPromise:
				return this.#domainPromise;
		}
	}

	/**
	 * @param {Symbol} signal
	 * @param {...any} args
	 */
	static [SandboxExposer2](signal, ...args) {
		switch (signal) {
			case SandboxSignal_InitDomain:
				if (Domain.#currentDomain) {
					throw new TypeError("顶级运行域已经被初始化");
				}

				Domain.#currentDomain = new Domain();
				Domain.#topDomain = Domain.#currentDomain;
				return;
			case SandboxSignal_EnterDomain:
				// @ts-expect-error Sandbox
				return Domain.#enterDomain(...args);
			case SandboxSignal_ExitDomain:
				return Domain.#exitDomain();
			case SandboxSignal_ListDomain:
				return Domain.#listDomain();
		}
	}
}

/**
 * ```plain
 * 将对象从源运行域封送到目标运行域
 * ```
 *
 * @param {Domain} srcDomain
 * @param {Domain} dstDomain
 * @param {any} obj
 * @returns
 */
function trapMarshal(srcDomain, dstDomain, obj) {
	if (srcDomain === dstDomain) {
		return obj;
	}

	const domain = Domain.current;

	// 如果不需要陷入，则直接封送
	if (domain === srcDomain) {
		return Marshal[SandboxExposer2](SandboxSignal_Marshal, obj, dstDomain);
	}

	// 否则先陷入，然后再封送
	return Marshal[SandboxExposer2](SandboxSignal_TrapDomain, srcDomain, () => {
		return Marshal[SandboxExposer2](SandboxSignal_Marshal, obj, dstDomain);
	});
}

/**
 * ```plain
 * 向JavaScript提供类似于Python的exec的自带上下文的eval功能
 * 同时自动排除原有作用域以沙盒方式来执行部分代码
 * ```
 */
class Sandbox {
	// @ts-expect-error Sandbox
	static #topWindow = window.replacedGlobal || window;
	// @ts-expect-error Sandbox
	static #topWindowHTMLElement = (window.replacedGlobal || window).HTMLElement;
	/** @type {WeakMap<Domain, Sandbox>} */
	static #domainMap = new WeakMap();
	/** @type {Array} */
	static #executingScope = [];
	/** @type {WeakMap<Function, string>} */
	static #functionRefCodes = new WeakMap();

	/** @type {string?} */
	#persistId;
	/** @type {Storage?} */
	#proxyStorage;

	/** @type {Object} */
	#scope;
	/** @type {Array<Object>} */
	#scopeStack = [];

	/** @type {Domain} */
	#sourceDomain;
	/** @type {Domain} */
	#domain;
	/** @type {Window} */
	#domainWindow;
	/** @type {Document?} */
	#domainDocument;
	/** @type {typeof Object} */
	#domainObject;
	/** @type {typeof Function} */
	#domainFunction;

	/**
	 * ```plain
	 * 当在当前scope中访问不到变量时，
	 * 是否允许沙盒代码可以穿透到顶级域的全局变量域中
	 * 去读取部分非内建的全局变量（仅读取）
	 *
	 * 此开关有风险，请谨慎使用
	 * ```
	 *
	 * @type {boolean}
	 */
	#freeAccess = false;

	/**
	 * ```plain
	 * 当在当前scope中访问不到变量时，
	 * 是否允许沙盒代码可以穿透到顶级域的全局变量域中
	 * 去读取DOM类型的构造函数（仅读取）
	 * （包括Image、Audio等）
	 *
	 * 此开关有风险，请谨慎使用
	 * ```
	 *
	 * @type {boolean}
	 */
	#domAccess = false;

	/**
	 * ```plain
	 * 创建一个新的沙盒
	 * 
	 * 并指定沙盒使用的持久化ID
	 * 当服务器需要使用`localStorage`时必须指定持久化ID来确保每次访问的持久化数据的一致性
	 * ```
	 * 
	 * @param {string} persistId 
	 */
	constructor(persistId) {
		this.#persistId = typeof persistId == "string" && persistId.length > 0 ? persistId : null;

		this.#sourceDomain = Domain.current;
		this.#domain = new Domain();
		this.#domainWindow = this.#domain[SandboxExposer](SandboxSignal_GetWindow);
		this.#domainDocument = null; // 默认不开放DOM，而且我们也缺少BrowserContext
		this.#domainObject = this.#domainWindow.Object;
		this.#domainFunction = this.#domainWindow.Function;
		// this.#domainEval = this.#domainWindow.eval;
		Sandbox.#domainMap.set(this.#domain, this);
		
		this.#proxyStorage = persistId ? this.#createSandboxStorage() : null;

		Sandbox.#initDomainFunctions(this, this.#domainWindow);
		Sandbox.#createScope(this);
	}

	/**
	 * ```plain
	 * 检查沙盒操作运行域
	 * ```
	 *
	 * @param {Sandbox} thiz
	 */
	static #assertOperator(thiz) {
		if (thiz.#sourceDomain !== Domain.current) {
			throw new TypeError("当前运行域不是沙盒的所有运行域");
		}
	};

	/**
	 * ```plain
	 * 封装沙盒的 Function 函数
	 * ```
	 *
	 * @param {Sandbox} thiz
	 * @param {Window} global
	 */
	static #initDomainFunctions(thiz, global) {
		/** @type {typeof Function} */
		const defaultFunction = global.Function;
		/** @type {typeof Function} */
		const defaultGeneratorFunction = global.eval("(function*(){}).constructor");
		/** @type {typeof Function} */
		const defaultAsyncFunction = global.eval("(async function(){}).constructor");
		/** @type {typeof Function} */
		const defaultAsyncGeneratorFunction = global.eval("(async function*(){}).constructor");

		/**
		 * @param {typeof Function} target
		 * @param {Array} argArray
		 * @returns
		 */
		function functionCtor(target, argArray) {
			if (!argArray.length) {
				return new target();
			}

			argArray = Array.from(argArray);

			const code = argArray.slice(-1)[0];
			const params = argArray.slice(0, -1);

			const compiled = Sandbox.#compileCore(thiz, code, null, params, true);
			Sandbox.#functionRefCodes.set(compiled, `function (${params.join(", ")}) {\n${code}\n}`);
			return compiled;
		}

		const handler = {
			/**
			 * @param {FunctionConstructor} target
			 * @param {any} thisArg
			 * @param {any[]} argArray
			 */
			apply(target, thisArg, argArray) {
				return functionCtor(target, argArray);
			},
			/**
			 * @param {FunctionConstructor} target
			 * @param {any[]} argArray
			 * @param {any} newTarget
			 */
			construct(target, argArray, newTarget) {
				return functionCtor(target, argArray);
			},
		};

		/**
		 * @param {object} prototype
		 * @param {any} newCtor
		 */
		function rewriteCtor(prototype, newCtor) {
			const descriptor = Object.getOwnPropertyDescriptor(prototype, "constructor") || { configurable: true, writable: true, enumerable: false };
			if (!descriptor.configurable) {
				throw new TypeError("无法覆盖不可配置的构造函数");
			}
			descriptor.value = newCtor;
			Reflect.defineProperty(prototype, "constructor", descriptor);
		}

		// 封装当前运行域所有Function类型的构造函数
		// 确保沙盒代码无法访问真正的 Window 对象
		// (不过理论上说访问了也基本上没什么东西喵)
		rewriteCtor(defaultFunction.prototype, (global.Function = new Proxy(defaultFunction, handler)));
		rewriteCtor(defaultGeneratorFunction.prototype, new Proxy(defaultGeneratorFunction, handler));
		rewriteCtor(defaultAsyncFunction.prototype, new Proxy(defaultAsyncFunction, handler));
		rewriteCtor(defaultAsyncGeneratorFunction.prototype, new Proxy(defaultAsyncGeneratorFunction, handler));
	};

	// /**
	//  * ```plain
	//  * 替代原本的eval函数，阻止访问原生的 window 对象
	//  * ```
	//  *
	//  * @param {Window} trueWindow
	//  * @param {(x: string) => any} _eval
	//  * @param {Proxy} intercepter
	//  * @param {Window} global
	//  * @param {any} x
	//  */
	// static #wrappedEval(trueWindow, _eval, intercepter, global, x) {
	// 	const intercepterName = Sandbox.#makeName("_", trueWindow);
	// 	const evalName = Sandbox.#makeName("_", global);
	// 	const codeName = Sandbox.#makeName("_", global);
	// 	trueWindow[intercepterName] = intercepter;
	// 	global[evalName] = _eval;
	// 	global[codeName] = x;
	// 	const result = _eval(`with(${intercepterName}){with(window){${evalName}(\`"use strict";\${${codeName}}\`)}}`);
	// 	delete global[codeName];
	// 	delete global[evalName];
	// 	delete trueWindow[intercepterName];
	// 	return result;
	// }

	/**
	 * ```plain
	 * 替代原本的eval函数，阻止访问原生的 window 对象
	 * ```
	 *
	 * @param {Sandbox} thiz
	 * @param {any} x
	 * @returns
	 */
	static #wrappedEval(thiz, x) {
		let code = String(x).trim();

		while (code.endsWith(";")) {
			code = code.slice(0, -1);
		}

		if (!/[;\n\r]$/.test(code)) {
			const newCode = `return (${code})`;
			try {
				new Function(newCode)
				code = newCode
			} catch { }
		}

		return thiz.exec(code);
	};

	/**
	 * ```plain
	 * 获取当前的scope
	 * ```
	 *
	 * @type {Object}
	 */
	get scope() {
		Sandbox.#assertOperator(this);
		return trapMarshal(this.#domain, Domain.current, this.#scope);
	}

	/**
	 * ```plain
	 * 获取当前沙盒内的运行域
	 * ```
	 *
	 * @type {Domain}
	 */
	get domain() {
		return this.#domain;
	}

	/**
	 * ```plain
	 * 获取当前沙盒内的document对象
	 * ```
	 *
	 * @type {Document}
	 */
	get document() {
		Sandbox.#assertOperator(this);
		return trapMarshal(this.#domain, Domain.current, this.#domainDocument);
	}

	/**
	 * ```plain
	 * 设置当前沙盒内的document对象
	 * ```
	 *
	 * @type {Document}
	 */
	set document(value) {
		Sandbox.#assertOperator(this);
		this.#domainDocument = Marshal[SandboxExposer2](SandboxSignal_Marshal, value, this.#domain);
	}

	/**
	 * ```plain
	 * 当在当前scope中访问不到变量时，
	 * 是否允许沙盒代码可以穿透到顶级域的全局变量域中
	 * 去读取部分非内建的全局变量（仅读取）
	 *
	 * 此开关有风险，请谨慎使用
	 * ```
	 *
	 * @type {boolean}
	 */
	get freeAccess() {
		Sandbox.#assertOperator(this);
		return this.#freeAccess;
	}

	/**
	 * ```plain
	 * 当在当前scope中访问不到变量时，
	 * 是否允许沙盒代码可以穿透到顶级域的全局变量域中
	 * 去读取部分非内建的全局变量（仅读取）
	 *
	 * 此开关有风险，请谨慎使用
	 * ```
	 *
	 * @type {boolean}
	 */
	set freeAccess(value) {
		Sandbox.#assertOperator(this);
		this.#freeAccess = !!value;
	}

	/**
	 * ```plain
	 * 当在当前scope中访问不到变量时，
	 * 是否允许沙盒代码可以穿透到顶级域的全局变量域中
	 * 去读取DOM类型的构造函数（仅读取）
	 * （包括Image、Audio等）
	 *
	 * 此开关有风险，请谨慎使用
	 * ```
	 *
	 * @type {boolean}
	 */
	get domAccess() {
		Sandbox.#assertOperator(this);
		return this.#domAccess;
	}

	/**
	 * ```plain
	 * 当在当前scope中访问不到变量时，
	 * 是否允许沙盒代码可以穿透到顶级域的全局变量域中
	 * 去读取DOM类型的构造函数（仅读取）
	 * （包括Image、Audio等）
	 *
	 * 此开关有风险，请谨慎使用
	 * ```
	 *
	 * @type {boolean}
	 */
	set domAccess(value) {
		Sandbox.#assertOperator(this);
		this.#domAccess = !!value;
	}

	/**
	 * ```plain
	 * 向当前域注入内建对象
	 *
	 * 如果使用在使用了 `initBuiltins` 之后进行 `pushScope`，
	 * 则将自动继承前面的内建对象，无需再次调用 `initBuiltins`
	 * ```
	 */
	initBuiltins() {
		Sandbox.#assertOperator(this);

		/**
		 * ```plain
		 * 如果要扩充沙盒的内建函数或类，请在此增加喵
		 * 
		 * 沙盒中模拟window提供的全局变量全部在这里喵
		 * ```
		 */
		const builtins = {
			Object: this.#domainWindow.Object,
			Function: this.#domainWindow.Function,
			Array: this.#domainWindow.Array,
			Math: this.#domainWindow.Math,
			Date: this.#domainWindow.Date,
			String: this.#domainWindow.String,
			Number: this.#domainWindow.Number,
			Boolean: this.#domainWindow.Boolean,
			RegExp: this.#domainWindow.RegExp,
			Error: this.#domainWindow.Error,
			TypeError: this.#domainWindow.TypeError,
			RangeError: this.#domainWindow.RangeError,
			SyntaxError: this.#domainWindow.RangeError,
			EvalError: this.#domainWindow.EvalError,
			ReferenceError: this.#domainWindow.ReferenceError,
			Promise: this.#domainWindow.Promise,
			Map: this.#domainWindow.Map,
			Set: this.#domainWindow.Set,
			WeakMap: this.#domainWindow.WeakMap,
			WeakSet: this.#domainWindow.WeakSet,
			WeakRef: this.#domainWindow.WeakRef,
			Symbol: this.#domainWindow.Symbol,
			Proxy: this.#domainWindow.Proxy,
			Reflect: this.#domainWindow.Reflect,
			BigInt: this.#domainWindow.BigInt,
			JSON: this.#domainWindow.JSON,
			// eval: this.#domainWindow.eval, // 我们另外定义 `eval` 函数
			setTimeout: this.#domainWindow.setTimeout,
			clearTimeout: this.#domainWindow.clearTimeout,
			setInterval: this.#domainWindow.setInterval,
			clearInterval: this.#domainWindow.clearInterval,
			setImmediate: this.#domainWindow.setImmediate,
			clearImmediate: this.#domainWindow.clearImmediate,
			requestAnimationFrame: this.#domainWindow.requestAnimationFrame,
			cancelAnimationFrame: this.#domainWindow.cancelAnimationFrame,
			requestIdleCallback: this.#domainWindow.requestIdleCallback,
			cancelIdleCallback: this.#domainWindow.cancelIdleCallback,
			queueMicrotask: this.#domainWindow.queueMicrotask,
			MutationObserver: this.#domainWindow.MutationObserver,
			alert: this.#domainWindow.alert,
			confirm: this.#domainWindow.confirm,
			console: this.#domainWindow.console,
			parseInt: this.#domainWindow.parseInt,
			parseFloat: this.#domainWindow.parseFloat,
			isFinite: this.#domainWindow.isFinite,
			isNaN: this.#domainWindow.isNaN,

			ArrayBuffer: this.#domainWindow.ArrayBuffer,
			performance: this.#domainWindow.performance,
			localStorage: this.#createSandboxStorageProxy(),

			Domain: Domain,
		};

		// 将事件类型暴露到沙盒的模拟window里面喵
		const patternBuiltins = [
			/^\w*?Event$/, // 让模拟window里面可以访问上面封送过来的事件类型
		];

		const hardBuiltins = {
			NaN: NaN,
			Infinity: Infinity,
			undefined: undefined,
		};

		// 先从沙盒运行域实际的window中得到所有的全局属性名
		const globalKeys = Reflect.ownKeys(this.#domainWindow)
			.filter(key => typeof key == "string");

		// 我们遍历 `patternBuiltins` 并将符合条件的属性放到 `builtins` 中
		for (const key of globalKeys) {
			for (const pattern of patternBuiltins) {
				if (pattern.test(key)) {
					builtins[key] = this.#domainWindow[key];
					break;
				}
			}
		}

		// 放置内建函数或类
		Marshal[SandboxExposer2](SandboxSignal_TrapDomain, this.#domain, () => {
			for (const [k, v] of Object.entries(builtins)) {
				if (!v) {
					delete builtins[k];
				}

				// 非类的函数应该要绑定 this 为 null
				if (typeof v == "function" && !("prototype" in v)) {
					builtins[k] = v.bind(null);
				}
			}
		});

		// 防止MD5报错
		builtins.exports = undefined; 
		builtins.define = undefined;

		Object.assign(this.#scope, builtins);

		// 对于常量我们需要重定义
		for (const [k, v] of Object.entries(hardBuiltins)) {
			Reflect.defineProperty(this.#scope, k, {
				value: v,
				writable: false,
				enumerable: false,
				configurable: false,
			});
		}
	}

	/**
	 * ```plain
	 * 基于当前的scope克隆一个新的scope
	 * 然后将原本的scope压入栈中
	 * ```
	 */
	pushScope() {
		Sandbox.#assertOperator(this);
		this.#scopeStack.push(this.#scope);
		Sandbox.#createScope(this);
	}

	/**
	 * ```plain
	 * 丢弃当前的scope并从栈中弹出原本的scope
	 * ```
	 */
	popScope() {
		Sandbox.#assertOperator(this);

		if (!this.#scopeStack) {
			throw new ReferenceError("没有更多的scope可以弹出");
		}

		this.#scope = this.#scopeStack.pop();
	}

	/**
	 * ```plain
	 * 核心编译函数
	 * ```
	 *
	 * @param {Sandbox} thiz 当前沙盒实例
	 * @param {string} code 代码字符串
	 * @param {Object?} context 额外的执行上下文
	 * @param {Array<string>?} paramList 参数名列表，以此来创建可以传递参数的函数
	 * @param {boolean?} inheritScope 是否继承当前正在执行的scope而不是当前沙盒的scope（为封装Function类型而提供的参数）
	 * @param {"exists"|"extend"|"all"} writeContext 当执行的代码尝试为未声明的变量赋值时，应该 根据context与window的变量写入(默认行为)|默认行为并且新的变量写入context|全部写入context
	 * @returns
	 */
	static #compileCore(thiz, code, context = null, paramList = null, inheritScope = false, writeContext = "exists") {
		if (typeof code != "string") {
			throw new TypeError("代码需要是一个字符串");
		}

		if (isPrimitive(context)) {
			context = {};
		}

		// 进行语法检查，防止注入
		new thiz.#domainFunction(code);

		const passThis = !("this" in context);
		const executingScope = Sandbox.#executingScope[Sandbox.#executingScope.length - 1];
		const scope = (inheritScope && executingScope) || thiz.#scope;
		const contextName = Sandbox.#makeName("_", scope);
		const argsName = Sandbox.#makeName("_", scope);
		const applyName = Sandbox.#makeName("_", scope);
		const parameters = paramList ? paramList.join(", ") : "";
		const writeContextAction = { exists: 0, extend: 1, all: 2 }[writeContext] || 0;

		let argumentList;
		let wrappedEval;

		// 必须使用严格模式否则会导致this逃逸
		const raw = new thiz.#domainFunction("_", `with(_){with(window){with(${contextName}){return(${applyName}(function(${parameters}){"use strict";// 沙盒代码起始\n${code}\n// 沙盒代码结束\n},${contextName}.this,${argsName}))}}}`);
		const snippet = new CodeSnippet(code, 5); // 错误信息的行号从 5 开始 (即错误信息的前 5 行是不属于 `code` 的范围)

		const domain = thiz.#domain;
		const domainWindow = thiz.#domainWindow;
		const marshalledContext = Marshal[SandboxExposer2](SandboxSignal_Marshal, context, domain);

		// 构建上下文拦截器
		const intercepter = new Proxy(scope, {
			has() {
				return true;
			},
			get(target, p) {
				switch (p) {
					case contextName:
						return marshalledContext;
					case argsName:
						return argumentList;
					case applyName:
						return Reflect.apply;
				}

				// 防止逃逸
				if (p === Symbol.unscopables) {
					return undefined;
				}

				if (!(p in target)) {
					if (p === "eval") {
						return wrappedEval;
					} // 返回我们封装的 `eval` 函数

					throw new domainWindow.ReferenceError(`${String(p)} is not defined`);
				}

				return target[p];
			},
			set(target, p, v) {
				if (writeContextAction == 2 || (writeContextAction == 1 && !(p in target))) {
					return Reflect.set(marshalledContext, p, v);
				}

				return Reflect.set(target, p, v);
			},
		});

		// wrappedEval = Sandbox.#wrappedEval.bind(null,
		// 	thiz.#domainWindow, thiz.#domainEval, intercepter, scope);
		wrappedEval = Sandbox.#wrappedEval.bind(null, thiz);

		// 构建陷入的沙盒闭包
		// 同时对返回值进行封送
		return /** @this {any} */ function (/** @type {any} */ ...args) {
			const prevDomain = Domain.current;
			const domainAction = () => {
				// 指定执行域
				// 方便后续新的函数来继承
				Sandbox.#executingScope.push(scope);
				// 指定当前的代码片段
				CodeSnippet.pushSnippet(snippet);

				try {
					// 传递 `this`、以及函数参数
					if (passThis) {
						context.this = Marshal[SandboxExposer2](SandboxSignal_Marshal, this, domain);
					}
					argumentList = Marshal[SandboxExposer2](SandboxSignal_MarshalArray, args, domain);

					// 调用闭包函数
					const result = raw.call(null, intercepter);

					// 封送返回结果
					return Marshal[SandboxExposer2](SandboxSignal_Marshal, result, prevDomain);
				} catch (e) {
					// @ts-expect-error Sandbox
					if (!Domain.isError(e)) {
						throw e;
					} // 非错误对象无法读取堆栈，继续向上抛出

					// 保存当前错误信息
					// 这样无论几次重抛都可以复现最原始的错误信息
					ErrorManager.setErrorReporter(e);
					throw e; // 继续向上抛出(由于JS不支持rethrow只能这样喵)
				} finally {
					CodeSnippet.popSnippet();
					Sandbox.#executingScope.pop();
				}
			};

			if (prevDomain === domain) {
				return domainAction();
			}

			return Marshal[SandboxExposer2](SandboxSignal_TrapDomain, domain, domainAction);
		};
	};

	/**
	 * ```plain
	 * 基于给定的代码与当前的scope来构造一个闭包函数
	 *
	 * 参数context指定临时上下文，类似与scope但是里面的变量优先级高于scope
	 * 另外可以通过context.this属性来指定函数的this
	 *
	 * 请注意，当沙盒闭包函数构造后，scope将被闭包固定
	 * 这意味着pushScope与popScope不会影响到构造好的函数
	 * ```
	 *
	 * @param {string} code 沙盒闭包函数的代码
	 * @param {Object?} context 临时上下文
	 * @returns {(...args: any[]) => any} 构造的沙盒闭包函数
	 */
	compile(code, context = null) {
		return Sandbox.#compileCore(this, code, context);
	}

	/**
	 * ```plain
	 * 基于当前的scope在沙盒环境下执行给定的代码
	 *
	 * 参数context指定临时上下文，类似与scope但是里面的变量优先级高于scope
	 * 另外可以通过context.this属性来指定函数的this
	 * ```
	 *
	 * @param {string} code 沙盒闭包函数的代码
	 * @param {Object?} context 临时上下文
	 * @returns 执行代码的返回值
	 */
	exec(code, context = null) {
		return this.compile(code, context)();
	}

	/**
	 * ```plain
	 * 基于当前的scope在沙盒环境下执行给定的代码
	 *
	 * 参数context指定临时上下文，类似与scope但是里面的变量优先级高于scope
	 * 另外可以通过context.this属性来指定函数的this
	 *
	 * 与exec的区别在于，此函数可以指定未定义变量赋值行为
	 * 当 `readonly` 为false时，不存在的全局变量的赋值行为将被转移到context里面
	 * 当 `readonly` 为true(默认)时，任何全局变量的赋值行为将被转移到context里面
	 * ```
	 *
	 * @param {string} code 沙盒闭包函数的代码
	 * @param {Object?} context 临时上下文(没有给出将自动创建)
	 * @param {boolean} readonly 是否拦截所有全局变量的赋值
	 * @returns {[any, Object]} [执行代码的返回值, 参数context]
	 */
	exec2(code, context = null, readonly = true) {
		if (isPrimitive(context)) {
			context = {};
		}

		const compiled = Sandbox.#compileCore(this, code, context, null, false, readonly ? "all" : "extend");
		return [compiled(), context];
	}

	/**
	 * ```plain
	 * 根据运行域获取沙盒对象
	 * ```
	 *
	 * @param {Domain} domain
	 * @returns {Sandbox?}
	 */
	static from(domain) {
		const sandbox = Sandbox.#domainMap.get(domain);

		if (!sandbox) {
			return null;
		}

		if (sandbox.#sourceDomain !== Domain.current) {
			throw new TypeError("当前运行域不是沙盒的所有运行域");
		}

		return sandbox;
	}

	/**
	 * ```plain
	 * 创建一个被代理的 Window 对象
	 *
	 * （为什么一定要指名道姓选window的东西喵）
	 * ```
	 *
	 * @param {Sandbox} thiz
	 */
	static #createScope(thiz) {
		let baseScope = thiz.#scope;
		const rawScope = new thiz.#domainObject();

		thiz.#scope = new Proxy(rawScope, {
			get(target, p, receiver) {
				if (p in target) {
					return Reflect.get(target, p, receiver);
				}

				// 暴露非内建的顶级全局变量
				if (thiz.#freeAccess && !Globals.isBuiltinKey(p)) {
					const topWindow = Sandbox.#topWindow;

					if (p in topWindow) {
						return trapMarshal(Domain.topDomain, thiz.#domain, topWindow[p]);
					}
				} else if (thiz.#domAccess) {
					const topWindow = Sandbox.#topWindow;
					const accessTarget = topWindow[p];

					if (typeof accessTarget == "function" && "prototype" in accessTarget && accessTarget.prototype instanceof Sandbox.#topWindowHTMLElement) {
						return trapMarshal(Domain.topDomain, thiz.#domain, accessTarget);
					}
				}

				return undefined;
			},
			has(target, p) {
				if (p in target) {
					return true;
				}

				if (thiz.#freeAccess && !Globals.isBuiltinKey(p)) {
					const topWindow = Domain.topDomain[SandboxExposer](SandboxSignal_GetWindow);
					return p in topWindow;
				} else if (thiz.#domAccess) {
					const topWindow = Sandbox.#topWindow;
					const accessTarget = topWindow[p];

					if (typeof accessTarget == "function" && "prototype" in accessTarget && accessTarget.prototype instanceof Sandbox.#topWindowHTMLElement) {
						return true;
					}
				}

				return false;
			},
		});

		// 定义三个超级变量
		Reflect.defineProperty(rawScope, "window", {
			get: function () {
				// @ts-expect-error Sandbox
				return this;
			}.bind(thiz.#scope),
			enumerable: false,
			configurable: false,
		});
		Reflect.defineProperty(rawScope, "self", {
			get: function () {
				// @ts-expect-error Sandbox
				return this;
			}.bind(thiz.#scope),
			enumerable: false,
			configurable: false,
		});
		Reflect.defineProperty(rawScope, "document", {
			get: function () {
				// @ts-expect-error Sandbox
				return this.#domainDocument;
			}.bind(thiz),
			enumerable: false,
			configurable: false,
		});

		if (!baseScope) {
			return;
		}

		// 继承之前的变量域
		const descriptors = Object.getOwnPropertyDescriptors(baseScope);
		delete descriptors.window;
		delete descriptors.self;
		delete descriptors.document;
		Object.defineProperties(rawScope, descriptors);
	};

	static #makeName(/** @type {string} */ prefix, /** @type {any} */ conflict) {
		let builtName;

		do {
			builtName = prefix + Math.random().toString(36).slice(2);
		} while (builtName in conflict);

		return builtName;
	};

	/**
	 * 创建沙盒的`localStorage`原型
	 * 
	 * @returns {Storage}
	 */
	#createSandboxStorage() {
		/** @type {Storage} */
		// @ts-expect-error 因为必须要使用new创建对象而不是`{}`语法
		const prototype = new this.#domainObject();
		const prefix = `SANDBOX[${this.#persistId}]_`;

		/** @type {Storage} */
		const localStorage = Sandbox.#topWindow.localStorage;
		/** @type {Array<string>} */
		const keys = Object.keys(localStorage)
			.filter(key => key.startsWith(prefix));

		Sandbox.#topWindow.addEventListener("storage", function(e) {
			if (e.storageArea !== localStorage) {
				return;
			}

			if (e.key == null) {
				keys.length = 0;
				return;
			}
			
			if (!e.key.startsWith(prefix)) {
				return;
			}

			const adding = e.oldValue == null;
			const removing = e.newValue == null;

			if (adding === removing) {
				return;
			}

			if (adding) {
				keys.push(e.key);
			} else {
				delete keys[keys.indexOf(e.key)];
			}
		});

		prototype.clear = function() {
			const removingKeys = Object.assign([], keys);
			keys.length = 0;

			for (const key of removingKeys) {
				delete localStorage[key];
			}
		};

		prototype.getItem = function(key) {
			return localStorage[prefix + key];
		};

		prototype.key = function(index) {
			return keys[index] || null;
		};

		prototype.removeItem = function(key) {
			delete localStorage[prefix + key];
		};

		prototype.setItem = function(key, value) {
			localStorage[prefix + key] = value;
		};

		Object.defineProperty(prototype, "length", {
			get() {
				return keys.length;
			},
			enumerable: false,
		});

		Object.freeze(prototype);
		return prototype;
	}

	/**
	 * 创建`localStorage`实例 (简单模拟了一下`localStorage`)
	 * 
	 * @returns {Storage?}
	 */
	#createSandboxStorageProxy() {
		const prototype = this.#proxyStorage;

		if (prototype == null) {
			return null;
		}

		const storage = this.#domainObject.create(prototype);

		return new Proxy(storage, {
			get(target, p, receiver) {
				if (typeof p != "string") {
					return undefined;
				}
				if (p in prototype) {
					return prototype[p];
				}

				return prototype.getItem(p);
			},
			set(target, p, newValue, receiver) {
				if (typeof p != "string") {
					return true;
				}
				if (p in prototype) {
					return true;
				}
				
				prototype.setItem(p, String(newValue));
				return true;
			},
			deleteProperty(target, p) {
				if (typeof p != "string") {
					return true;
				}

				prototype.removeItem(p);
				return true;
			}
		});
	}

	/**
	 * @param {Symbol} signal
	 * @param  {...any} args
	 * @returns
	 */
	static [SandboxExposer2](signal, ...args) {
		switch (signal) {
			case SandboxSignal_TryFunctionRefs:
				return Sandbox.#functionRefCodes.get(args[0]);
		}
	}
}

/**
 * @param {any} clazz
 */
function sealClass(clazz) {
	sealObjectTree(clazz);

	if (typeof clazz == "function") {
		sealObjectTree(clazz.prototype);
	} else if (clazz.constructor) {
		sealObjectTree(clazz.constructor);
	}
}

// FREEZE FROM SOUL!
/**
 * @param {any} obj
 */
function sealObjectTree(obj) {
	// @ts-expect-error Sandbox
	sealObject(obj, (/** @type {object} */ o) => {
		if (!Reflect.isExtensible(o)) {
			return;
		}
		if (o === obj) {
			return void Object.freeze(o);
		}

		sealObjectTree(o);
	});
}

/**
 * @param {any} obj
 */
function sealObject(obj, freeze = Object.freeze) {
	if (isPrimitive(obj)) {
		return;
	}

	const descriptors = Object.getOwnPropertyDescriptors(obj);

	freeze(obj);

	// 防止通过函数属性传值
	for (const [key, descriptor] of Object.entries(descriptors)) {
		if (descriptor.get) {
			freeze(descriptor.get);
		}
		if (descriptor.set) {
			freeze(descriptor.set);
		}
		if (!isPrimitive(descriptor.value)) {
			freeze(descriptor.value);
		}
	}
}

if (SANDBOX_ENABLED) {
	// 确保顶级运行域的原型链不暴露
	if (window.top === window) {
		({
			// @ts-expect-error Sandbox
			AccessAction,
			// @ts-expect-error Sandbox
			Rule,
			// @ts-expect-error Sandbox
			Monitor,
			// @ts-expect-error Sandbox
			Marshal,
			// @ts-expect-error Sandbox
			Domain,
			// @ts-expect-error Sandbox
			Sandbox,
		} = SANDBOX_EXPORT);
	} else {
		// 这里是沙盒核心类初始化时所在的独立运行域
		// 这里的全局对象不会直接暴露

		// 防止被不信任代码更改
		sealClass(AccessAction);
		sealClass(Rule);
		sealClass(Globals);
		sealClass(DomainMonitors);
		sealClass(Monitor);
		sealClass(Marshal);
		sealClass(Domain);
		sealClass(Sandbox);

		sealClass(Object);
		sealClass(Array);
		sealClass(Function);
		sealClass(Promise);
		sealClass(RegExp);
		sealClass(String);
		sealClass(Number);
		sealClass(Boolean);
		sealClass(Symbol);
		sealClass(Reflect);
		sealClass(Proxy);
		sealClass(Date);
		sealClass(Math);
		sealClass(Error);
		sealClass(TypeError);
		sealClass(ReferenceError);
		sealClass(RangeError);
		sealClass(EvalError);
		sealClass(SyntaxError);

		sealClass(function* () {}.constructor);
		sealClass(async function () {}.constructor);
		sealClass(async function* () {}.constructor);

		// 改为此处初始化，防止多次初始化
		Domain[SandboxExposer2](SandboxSignal_InitDomain);

		// 获取顶级域的错误管理器
		({ CodeSnippet, ErrorReporter, ErrorManager } =
			// @ts-expect-error Sandbox
			window.replacedErrors);

		// 向顶级运行域暴露导出
		// @ts-expect-error Sandbox
		window.SANDBOX_EXPORT = {
			AccessAction,
			Rule,
			Monitor,
			Marshal,
			Domain,
			Sandbox,
		};
	}
}

export { AccessAction, Rule, Monitor, Marshal, Domain, Sandbox, SANDBOX_ENABLED };
