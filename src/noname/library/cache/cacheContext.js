// import { game, get, lib } from "noname";
import { MD5 } from "crypto-js";

let cacheEnvironment = false;
let cacheContext = undefined;
let proxyed = {};

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
		let cache = storage;
		let funcCache = CacheContext._ensureMember(cache, key);
		let cacheKey = CacheContext._wrapParametersToCacheKey(params);
		let ret = funcCache[cacheKey];
		if (ret === undefined) {
			ret = (typeof func == "function" ? func : source[key]).call(source, ...params);
			funcCache[cacheKey] = ret;
			//console.log('缓存未命中!'+key+":"+cacheKey+":"+params.length+":ret:"+ret);
		} else {
			//console.log(key+":"+cacheKey+":"+params.length+":ret:"+ret);
		}
		return ret;
	}

	static _ensureMember(obj, key) {
		let mem = obj[key];
		if (!mem) {
			mem = {};
			obj[key] = mem;
		}
		return mem;
	}

	static _wrapParametersToCacheKey(params) {
		return Array.from(params)
			.filter(p => !(p instanceof CacheContext))
			.map(param => CacheContext._wrapParameterToCacheKey(param))
			.join("-");
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
			return `[arr:[${param
				.filter(p => !(p instanceof CacheContext))
				.map(p => CacheContext._wrapParameterToCacheKey(p))
				.join("-")}]]`;
		}
		if (typeof param === "function") {
			return `[f:${MD5(param.toString()).toString()}]`;
		}
		let entries = Object.entries(param);
		entries.sort((a, b) => (a[0] < b[0] ? -1 : 1));
		return `[obj:{${entries.map(e => e[0] + ":" + CacheContext._wrapParameterToCacheKey(e[1])).join(",")}}]`;
	}
}
