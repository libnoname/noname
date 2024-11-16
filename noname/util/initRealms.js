import { CodeSnippet, ErrorReporter, ErrorManager } from "./error.js";

// 方便开关确定沙盒的问题喵
// 当此处为true、debug模式未启用、设备非苹果时，沙盒生效
let SANDBOX_ENABLED = false;

// 执行上下文传递函数，请勿动喵
// 用于传递顶级execute context

/** @type {(target: Function, thiz: Object, args: Array) => any} */
// @ts-ignore
const ContextInvoker1 = (function (apply, target, thiz, args) {
    return apply(target, thiz, args);
}).bind(null, Reflect.apply);

/** @type {(target: Function, args: Array, newTarget: Function) => any} */
// @ts-ignore
const ContextInvoker2 = (function (construct, target, args, newTarget) {
    return construct(target, args, newTarget);
}).bind(null, Reflect.construct);

/** @type {(closure: Object, target: Function) => ((...args: any[]) => any)} */
// @ts-ignore
const ContextInvokerCreator = (function (apply, closure, target) {
    return function (...args) {
        return apply(target, closure,
            // @ts-ignore
            [this === window ? null : this, args, new.target]);
    };
}).bind(null, Reflect.apply);

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
    if (!enabled) {
        SANDBOX_ENABLED = false;
        return;
    }

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

    if (!iframe.contentWindow)
        throw new ReferenceError("无法载入运行域");

    // 定义 createRealms 函数
    Reflect.defineProperty(iframe.contentWindow, "createRealms", {
        value() {
            // 通过构造 iframe 来创建新的变量域
            const iframe = createElement("iframe");
            iframe.style.display = "none";
            appendChild(iframe);

            const window = iframe.contentWindow;
            if (!window)
                throw new ReferenceError("顶级域已经被卸载");

            iframe.remove();
            return window;
        },
    });

    // 传递顶级变量域、上下文执行器、错误管理器
    // @ts-ignore
    iframe.contentWindow.replacedGlobal = window;
    // @ts-ignore
    iframe.contentWindow.replacedCI1 = ContextInvoker1;
    // @ts-ignore
    iframe.contentWindow.replacedCI2 = ContextInvoker2;
    // @ts-ignore
    iframe.contentWindow.replacedCIC = ContextInvokerCreator;
    // @ts-ignore
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

    // @ts-ignore
    delete iframe.contentWindow.replacedGlobal;
    // @ts-ignore
    delete iframe.contentWindow.replacedCI1;
    // @ts-ignore
    delete iframe.contentWindow.replacedCI2;
    // @ts-ignore
    delete iframe.contentWindow.replacedCIC;
    // @ts-ignore
    delete iframe.contentWindow.replacedErrors;

    // @ts-ignore
    Object.assign(SANDBOX_EXPORT, iframe.contentWindow.SANDBOX_EXPORT);
    iframe.remove();
}

function isSandboxEnabled() {
    return SANDBOX_ENABLED;
}

export {
    initializeSandboxRealms,
    isSandboxEnabled,
    SANDBOX_EXPORT,
};
