const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./sandbox.js","./initRealms.js","./error.js"])))=>i.map(i=>d[i]);
import { __vitePreload } from "../../../_virtual/preload-helper.js";
import { c as cryptoJsExports } from "../../../_virtual/index3.js";
const SANDBOX_FORCED = false;
const SANDBOX_AUTOTEST = false;
const SANDBOX_AUTOTEST_NODELAY = false;
const SANDBOX_DEV = false;
const WSURL_FOR_IP = /ws:\/\/(\d+.\d+.\d+.\d+):\d+\//;
const TRUSTED_IPS = Object.freeze([]);
const TRUSTED_IP_MD5 = Object.freeze([
  // 被拷打了喵 > <
]);
let SANDBOX_ENABLED = true;
let AccessAction;
let Domain;
let Marshal;
let Monitor;
let Rule;
let Sandbox;
let initialized = false;
let defaultSandbox;
const sandboxStack = [];
const isolatedsMap = /* @__PURE__ */ new WeakMap();
const topVariables = {
  lib: null,
  game: null,
  ui: null,
  get: null,
  ai: null,
  _status: null
};
const defaultEval = window.eval;
let initStartParsed = false;
let sandBoxRequired = SANDBOX_FORCED;
const pfPrototypes = ["Object", "Array", "String", "Map"];
const pfNamespaces = ["Object", "Array", "Reflect", "Math", "Promise"];
const nativePattern = /\{ \[native code\] \}$/;
const polyfills = {
  prototypes: {},
  namespaces: {}
};
let ModFunction;
let ModGeneratorFunction;
let ModAsyncFunction;
let ModAsyncGeneratorFunction;
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
function assertSafeObject(obj, prop = null) {
  if (isUnsafeObject(obj, prop)) {
    throw new Error("unsafe object denied");
  }
}
function isPrimitive(obj) {
  return Object(obj) !== obj;
}
function currentSandbox() {
  if (!SANDBOX_ENABLED) {
    return null;
  }
  return sandboxStack[sandboxStack.length - 1] || defaultSandbox;
}
function requireSandbox() {
  sandBoxRequired = true;
}
const GRANTED_LIST_KEY = "security_grantedServers";
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
function resetGrantedServers() {
  localStorage.removeItem(GRANTED_LIST_KEY);
}
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
function alertForNewServer() {
  const tips = [
    "您登录的服务器不在受信任的列表中，是否要信任来自服务器的代码?",
    "\n如果您信任此服务器则可以选择“确定”，否则您应该选择“取消”来启动隔离沙盒。",
    "请注意：开启隔离沙盒可能会让服务器部分功能受限，以此换取更安全的执行环境。",
    "\n另外，您无论如何选择都可以随时通过点击“联机模式选项-更多-重置受信任的服务器列表”来重置您的选择。"
  ];
  return confirm(tips.join("\n"));
}
function requireSandboxOn(ip) {
  let isTrusted = false;
  if (ip) {
    isTrusted = TRUSTED_IPS.includes(ip);
    if (!isTrusted && TRUSTED_IP_MD5.length > 0) {
      const md5 = cryptoJsExports.MD5("noname_server" + ip).toString();
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
function isSandboxRequired() {
  return SANDBOX_ENABLED && sandBoxRequired;
}
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
function _eval(x) {
  if (!SANDBOX_ENABLED || !sandBoxRequired) {
    new Function(x);
    const topVars = Object.assign({}, topVariables);
    const vars = "_" + Math.random().toString(36).slice(2);
    return new Function(vars, `with(${vars}){${x}}`)(topVars);
  }
  return defaultSandbox.exec(x);
}
function _exec(x, scope = {}) {
  if (isPrimitive(scope)) {
    scope = {};
  }
  if (!SANDBOX_ENABLED || !sandBoxRequired) {
    new Function(x);
    const topVars = Object.assign({}, topVariables);
    const vars = "__vars_" + Math.random().toString(36).slice(2);
    const name = "__scope_" + Math.random().toString(36).slice(2);
    return new Function(vars, name, `with(${vars}){with(${name}){${x}}}`)(topVars, scope);
  }
  return defaultSandbox.exec(x, scope);
}
function _exec2(x, scope = {}) {
  if (scope == "window") {
    scope = {};
    scope.window = scope;
  } else if (isPrimitive(scope)) {
    scope = {};
  }
  if (!SANDBOX_ENABLED || !sandBoxRequired) {
    new Function(x);
    const intercepter = new Proxy(scope, {
      get(target, prop, receiver) {
        if (prop === Symbol.unscopables) {
          return void 0;
        }
        if (!Reflect.has(target, prop) && !Reflect.has(window, prop)) {
          throw new ReferenceError(`"${String(prop)}" is not defined`);
        }
        return Reflect.get(target, prop, receiver) || topVariables[prop] || window[prop];
      },
      has(target, prop) {
        return true;
      }
    });
    const result2 = new Function("_", `with(_){return(()=>{"use strict";
${x}})()}`)(intercepter);
    scope.return = result2;
    return scope;
  }
  const [result] = defaultSandbox.exec2(x, scope);
  scope.return = result;
  return scope;
}
async function initSecurity({ lib, game, ui, get, ai, _status }) {
  if (initialized) {
    throw new Error("security 已经被初始化过了");
  }
  const sandbox = await __vitePreload(() => import("./sandbox.js"), true ? __vite__mapDeps([0,1,2]) : void 0, import.meta.url);
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
  const ioFuncs = ["download", "readFile", "readFileAsText", "writeFile", "removeFile", "getFileList", "ensureDirectory", "createDir", "removeDir", "checkForUpdate", "checkForAssetUpdate", "importExtension", "export", "multiDownload2", "multiDownload", "fetch"];
  const accessDenieds = [
    ...ioFuncs.map((n) => game[n]).filter(Boolean),
    ...Object.values(game.promises),
    defaultEval,
    localStorage.setItem,
    window.require,
    // @ts-expect-error There's
    window.define
  ];
  const callRule = new Rule();
  callRule.canMarshal = false;
  callRule.setGranted(AccessAction.CALL, false);
  callRule.setGranted(AccessAction.NEW, false);
  accessDenieds.filter(Boolean).forEach((o) => {
    Marshal.setRule(o, callRule);
  });
  const exposedClassRule = new Rule();
  exposedClassRule.canMarshal = true;
  exposedClassRule.setGranted(AccessAction.NEW, false);
  exposedClassRule.setGranted(AccessAction.WRITE, false);
  exposedClassRule.setGranted(AccessAction.DELETE, false);
  exposedClassRule.setGranted(AccessAction.DEFINE, false);
  exposedClassRule.setGranted(AccessAction.DESCRIBE, false);
  exposedClassRule.setGranted(AccessAction.TRACE, false);
  exposedClassRule.setGranted(AccessAction.META, false);
  Reflect.ownKeys(globalThis).filter((key) => typeof key == "string").filter((key) => /^\w*?Event$/.test(key)).map((key) => globalThis[key]).forEach((o) => Marshal.setRule(o, exposedClassRule));
  const bannedRule = new Rule();
  bannedRule.canMarshal = false;
  bannedRule.setGranted(AccessAction.READ, false);
  bannedRule.setGranted(AccessAction.WRITE, false);
  bannedRule.setGranted(AccessAction.DELETE, false);
  bannedRule.setGranted(AccessAction.DEFINE, false);
  bannedRule.setGranted(AccessAction.DESCRIBE, false);
  bannedRule.setGranted(AccessAction.TRACE, false);
  bannedRule.setGranted(AccessAction.META, false);
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
    window
  ].filter(Boolean).forEach((o) => Marshal.setRule(o, bannedRule));
  const writeRule = new Rule();
  writeRule.setGranted(AccessAction.WRITE, false);
  writeRule.setGranted(AccessAction.DEFINE, false);
  Marshal.setRule(game.promises, writeRule);
  Marshal.setRule(localStorage, writeRule);
  new Monitor().action(AccessAction.WRITE).action(AccessAction.DEFINE).require("target", game).require("property", ...ioFuncs).require("property", "ws", "sandbox").then((access, nameds, control) => {
    throw new Error(`有不信任的代码修改 \`game.${String(nameds.property)}\` 属性`);
  }).start();
  const toStringTag = Symbol.toStringTag;
  new Monitor().action(AccessAction.WRITE).action(AccessAction.DEFINE).action(AccessAction.META).require("property", toStringTag).then((access, nameds, control) => {
    control.preventDefault();
    control.stopPropagation();
    control.setReturnValue(false);
  }).start();
  if (SANDBOX_AUTOTEST) {
    Reflect.defineProperty(lib.element.GameEvent.prototype, "animate", {
      get: () => void 0,
      set() {
      },
      enumerable: false,
      configurable: false
    });
    if (!lib.videos) {
      lib.videos = [];
    }
    game.over = function(...args) {
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
        SANDBOX_AUTOTEST_NODELAY ? 5e3 : 1e3
      );
    };
    lib.arenaReady.push(
      () => setTimeout(() => {
        if (SANDBOX_AUTOTEST_NODELAY) {
          game.resume = () => {
          };
          game.pause = () => {
          };
        }
        game.delay = game.delayx = () => {
        };
        game.asyncDelay = game.asyncDelayx = async () => {
        };
        ui.auto.click();
      }, 1e3)
    );
  }
  initialized = true;
}
function createSandbox(persistId) {
  if (!SANDBOX_ENABLED) {
    return null;
  }
  const box = new Sandbox(persistId);
  box.freeAccess = true;
  box.domAccess = true;
  box.initBuiltins();
  box.document = document;
  Object.assign(box.scope, topVariables);
  setupPolyfills(box);
  box.pushScope();
  return box;
}
function getIsolateds(sandbox) {
  let isolateds = isolatedsMap.get(sandbox);
  if (isolateds) {
    return isolateds.slice();
  }
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
function getIsolatedsFrom(item) {
  if (canSkipSandbox(item) || !SANDBOX_ENABLED) {
    return [defaultFunction, defaultGeneratorFunction, defaultAsyncFunction, defaultAsyncGeneratorFunction];
  }
  const domain = Marshal.getMarshalledDomain(item) || Domain.caller;
  if (domain && domain !== Domain.topDomain) {
    const box = Sandbox.from(domain);
    if (!box) {
      throw new Error("意外的运行域: 运行域没有绑定沙盒");
    }
    return getIsolateds(box);
  }
  return [ModFunction, ModGeneratorFunction, ModAsyncFunction, ModAsyncGeneratorFunction];
}
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
    Sandbox
  };
}
const defaultFunction = (function() {
}).constructor;
const defaultGeneratorFunction = (function* () {
}).constructor;
const defaultAsyncFunction = (async function() {
}).constructor;
const defaultAsyncGeneratorFunction = (async function* () {
}).constructor;
function initIsolatedEnvironment() {
  defaultSandbox = createSandbox();
  defaultSandbox.scope.localStorage = localStorage;
  const [IsolatedFunction, IsolatedGeneratorFunction, IsolatedAsyncFunction, IsolatedAsyncGeneratorFunction] = getIsolateds(defaultSandbox);
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
    }
  });
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
    }
  });
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
    }
  });
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
    }
  });
  function rewriteCtor(prototype, newCtor) {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, "constructor") || { configurable: true, writable: true, enumerable: false };
    if (!descriptor.configurable) {
      throw new TypeError("无法覆盖不可配置的构造函数");
    }
    descriptor.value = newCtor;
    Reflect.defineProperty(prototype, "constructor", descriptor);
  }
  window.Function = ModFunction;
  rewriteCtor(defaultFunction.prototype, ModFunction);
  rewriteCtor(defaultGeneratorFunction.prototype, ModGeneratorFunction);
  rewriteCtor(defaultAsyncFunction.prototype, ModAsyncFunction);
  rewriteCtor(defaultAsyncGeneratorFunction.prototype, ModAsyncGeneratorFunction);
}
function initSerializeNeeded() {
  const structuredClone = window.structuredClone;
  const deepClone = (obj) => {
    try {
      return structuredClone(obj);
    } catch (e) {
      return obj;
    }
  };
  const funcList = [["Worker.prototype.postMessage", [0]]];
  for (const [funcCode, argIndexes] of funcList) {
    const originalFunc = new Function(`return ${funcCode}`)();
    const newFunc = (
      /** @this {any} */
      function(...args) {
        for (const index of argIndexes) {
          args[index] = deepClone(args[index]);
        }
        return originalFunc.apply(this, args);
      }
    );
    new Function("_", `${funcCode} = _;`)(newFunc);
  }
}
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
      box[key] = descriptor;
    }
  }
  for (const key of pfPrototypes) {
    const top = window[key];
    if (!top || !top.prototype) {
      continue;
    }
    copyDescriptors(top.prototype, polyfills.prototypes[key] = {});
  }
  for (const key of pfNamespaces) {
    const top = window[key];
    if (!top) {
      continue;
    }
    copyDescriptors(top, polyfills.namespaces[key] = {});
  }
}
function setupPolyfills(sandbox) {
  const context = {
    pfPrototypes,
    pfNamespaces,
    prototypes: polyfills.prototypes,
    namespaces: polyfills.namespaces
  };
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
if (SANDBOX_DEV) {
  Reflect.defineProperty(window, "sandbox", {
    get: () => defaultSandbox,
    set: () => {
    },
    configurable: true
  });
}
const security = {
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
  SANDBOX_ENABLED
};
Object.freeze(security);
export {
  security
};
