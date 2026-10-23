// import { game, get, lib } from "noname";
// 注：这里原本 `import { MD5 } from "crypto-js"`（用于把函数源码哈希成缓存键）。
// 改用 WeakMap 身份键后不再需要，已移除该 import——它会把整个 crypto-js 拉进
// 这条模块链，而本文件只用过其中的 MD5。

let cacheEnvironment = false;
let cacheContext = undefined;
let proxyed = {};

// 函数参数的缓存键：改用「对象身份」而不是「源码内容」。
//
// 原实现是 MD5(param.toString())（crypto-js 的纯 JS MD5），有两个问题：
//   1. 每次生成缓存键都要把整段函数源码做一次哈希，代价可能超过被缓存的函数本身；
//   2. 更要紧的是**语义错误**：两个源码相同但捕获变量不同的闭包会得到同一个键，
//      于是第二个闭包会直接命中第一个的缓存值。形如
//        for (const name of names) skills[name] = { ai: { effect: () => name.length } };
//      的写法（同一份源码、不同捕获）就会串味。按身份取键同时更快也更安全。
let nextFunctionCacheKeyId = 0;
const functionCacheKeys = new WeakMap();

/** @param {Function} func @returns {number} */
function getFunctionCacheKey(func) {
	let id = functionCacheKeys.get(func);
	if (id === undefined) {
		id = ++nextFunctionCacheKeyId;
		functionCacheKeys.set(func, id);
	}
	return id;
}

/**
 * 缓存上下文，用于在各种方法中暂时缓存值，以第一次获取的缓存值为准。
 */
export class CacheContext {
	constructor() {
		// this.lib = this._createCacheProxy(lib);
		// this.game = this._createCacheProxy(game);
		// this.get = this._createCacheProxy(get);
		for (const i in proxyed){
			this[i] = this._createCacheProxy(proxyed[i]);
		}
		this.sourceMap = new Map();
		this.storageMap = new Map();
	}

	/**
	 * 设置缓存上下文代理的对象。
	 * @param {Record<string, any>} proxy
	 */
	static setProxy(proxy){
		proxyed = proxy;
	}

	/**
	 * 设置当前是否处于缓存环境。当使用inject对类进行注入时，只在缓存环境下会返回缓存值。
	 * @param {boolean} cache
	 */
	static setInCacheEnvironment(cache) {
		cacheEnvironment = cache;
	}

	/**
	 * 设置一个公有的缓存上下文。缓存上下文持有期间，假设所缓存的函数在参数相同时，绝对不会（注意是绝对不会）返回不同的返回值。
	 * 使用inject对类进行注入时，将应用公有的缓存上下文。
	 * @param {CacheContext} context
	 */
	static setCacheContext(context) {
		cacheContext = context;
	}

	/**
	 * 返回当前公有的缓存上下文。
	 * @returns {CacheContext} 缓存上下文
	 */
	static getCacheContext() {
		return cacheContext;
	}

	/**
	 * 移除当前公有的缓存上下文。
	 */
	static removeCacheContext() {
		cacheContext = undefined;
	}

	/**
	 * 返回公有的缓存上下文，没有就创建一个新的返回（不会设置为新的公有缓存上下文）。
	 * @returns {CacheContext} 缓存上下文
	 */
	static requireCacheContext() {
		let cache = CacheContext.getCacheContext();
		if (!cache) {
			return new CacheContext();
		}
		return cache;
	}

	/**
	 * 在「已注册缓存上下文」存在时经由缓存代理调用，否则直接调用原函数。
	 *
	 * 适用场景：**一次调用里只会用到一次缓存**的包装方法，例如
	 * `get.attitude` / `get.cacheOrder` / `get.cacheEffect` / `get.cacheEffectUse`。
	 * 它们原先无条件 `requireCacheContext()`：在没有缓存上下文时（即绝大多数调用，
	 * 缓存上下文只在 AI 决策窗口里注册）会白建一个 CacheContext——3 个 Proxy 加
	 * 2 个 Map——再走一遍代理陷阱、算一次缓存键、写进一个随即被丢弃的 Map，
	 * 一次都不会命中。get.attitude 全仓有近 4000 个调用点，这是纯开销。
	 *
	 * 注意**不适用于** `get.effect` / `get.effect_use`：它们在函数体内会多次经由
	 * 同一个上下文做嵌套缓存（`cache.get.effect` / `cache.delegate(...)`），
	 * 临时上下文在单次求值内仍有收益，不能短路。
	 *
	 * @param {"lib" | "game" | "get"} name 代理对象名
	 * @param {string} method 方法名
	 * @param {any} thisArg 调用时的 this
	 * @param {ArrayLike<any>} args 参数
	 */
	static invoke(name, method, thisArg, args) {
		const context = cacheContext;
		if (context && context[name]) {
			return context[name][method].apply(thisArg, args);
		}
		const source = proxyed[name];
		if (source && typeof source[method] === "function") {
			return source[method].apply(thisArg, args);
		}
		// 兜底：代理源尚未注册（正常流程下 init 阶段就会 setProxy）
		return CacheContext.requireCacheContext()[name][method].apply(thisArg, args);
	}

	/**
	 * 对一个对象进行代理，对象的所有函数都将按条件返回缓存结果。
	 * 注意：以cache开头的方法依然保持原来的调用。
	 * 如果所代理的对象拥有cacheSupportFunction方法（返回一个方法名数组），只有允许的方法才会返回缓存结果，剩余方法依然保持原来的调用。
	 * @param {any} source 需要代理的对象
	 * @returns
	 */
	delegate(source) {
		if (source === null || source === undefined) {
			return source;
		}
		if (source._cacheDelegateSource) {
			return source;
		}
		let proxy = this.sourceMap.get(source);
		if (proxy) {
			return proxy;
		}
		proxy = this._createCacheProxy(source);
		this.sourceMap.set(source, proxy);
		return proxy;
	}

	/**
	 * 对一个类进行注入。methods为可以返回缓存的所有方法。注入后，此类的相关方法会在公有缓存上下文下返回缓存值。
	 * @param {any} source
	 * @param {Array<string>} methods
	 * @returns
	 */
	static inject(source, methods) {
		if (source == null || source === undefined) {
			return null;
		}
		for (let method of methods) {
			let func = source[method];
			if (typeof func != "function") {
				continue;
			}
			source[method] = function () {
				try {
					if (!cacheEnvironment) {
						return func.call(this, ...arguments);
					}
					return CacheContext._getCacheValueFromObject(CacheContext.requireCacheContext()._requireStorage(this), method, arguments, this, func);
				} catch (e) {
					return func.call(this, ...arguments);
				}
			};
		}
	}

	_requireStorage(obj) {
		let storage = this.storageMap.get(obj);
		if (!storage) {
			storage = {};
			this.storageMap.set(obj, storage);
		}
		return storage;
	}

	/**
	 * @template T
	 * @param {T} delegateObject
	 * @returns {T}
	 */
	_createCacheProxy(delegateObject) {
		const cacheFuncObj = {};
		const cacheStorage = {};
		return new Proxy(delegateObject, {
			get: (target, key) => {
				if (key == "_cacheDelegateSource") {
					return delegateObject;
				}
				let value = target[key];
				if (key.indexOf("cache") == 0) {
					return value;
				}
				if (typeof target.cacheSupportFunction == "function") {
					if (!target.cacheSupportFunction().includes(key)) {
						return value;
					}
				}
				if (typeof value == "function") {
					let wrapFunc = cacheFuncObj[key];
					if (typeof wrapFunc != "function") {
						wrapFunc = function () {
							try {
								return CacheContext._getCacheValueFromObject(cacheStorage, key, arguments, target);
							} catch (e) {
								return value.call(target, ...arguments);
							}
						};
						cacheFuncObj[key] = wrapFunc;
					}
					return wrapFunc;
				}
				return value;
			},
		});
	}

	static _getCacheValueFromObject(storage, key, params, source, func) {
		const funcCache = CacheContext._ensureMember(storage, key);
		const cacheKey = CacheContext._wrapParametersToCacheKey(params);

		// 用 Map + has() 判定未命中。原实现用 `ret === undefined` 当未命中哨兵：
		// 合法返回 undefined 的函数永远命中不了，每次都得重算。
		if (funcCache.has(cacheKey)) {
			return funcCache.get(cacheKey);
		}

		const ret = (typeof func == "function" ? func : source[key]).call(source, ...params);
		funcCache.set(cacheKey, ret);
		return ret;
	}

	static _ensureMember(obj, key) {
		let mem = obj[key];
		if (!mem) {
			mem = new Map();
			obj[key] = mem;
		}
		return mem;
	}

	static _wrapParametersToCacheKey(params) {
		// 用数组 + join 拼接，避免原先 Array.from(...).filter(...).map(...) 的三次分配
		const parts = [];
		for (const param of params) {
			if (param instanceof CacheContext) {
				continue;
			}
			parts.push(CacheContext._wrapParameterToCacheKey(param));
		}
		return parts.join("-");
	}

	static _wrapParameterToCacheKey(param) {
		if (param === null) {
			return "null";
		}
		if (param === undefined) {
			return "undefined";
		}
		if (typeof param === "string") {
			return `[str:${param}]`;
		}
		if (typeof param === "number") {
			return `[d:${param}]`;
		}
		if (typeof param === "boolean") {
			return `[bl:${param}]`;
		}
		if (typeof param.getCacheKey == "function") {
			return param.getCacheKey();
		}
		if (Array.isArray(param)) {
			const parts = [];
			for (const item of param) {
				if (item instanceof CacheContext) {
					continue;
				}
				parts.push(CacheContext._wrapParameterToCacheKey(item));
			}
			return `[arr:[${parts.join("-")}]]`;
		}
		if (typeof param === "function") {
			// 按身份取键，理由见文件顶部的 functionCacheKeys 注释
			return `[f:${getFunctionCacheKey(param)}]`;
		}
		const entries = Object.entries(param);
		entries.sort((a, b) => (a[0] < b[0] ? -1 : 1));
		return `[obj:{${entries.map(e => e[0] + ":" + CacheContext._wrapParameterToCacheKey(e[1])).join(",")}}]`;
	}
}
