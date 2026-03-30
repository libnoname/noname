import { ErrorManager, ErrorReporter, CodeSnippet } from "./error.js";
let SANDBOX_ENABLED = false;
const SANDBOX_DEBUG = true;
const ContextInvoker1 = (function(apply, target, thiz, args) {
  return apply(target, thiz, args);
}).bind(null, Reflect.apply);
const ContextInvoker2 = (function(construct, target, args, newTarget) {
  return construct(target, args, newTarget);
}).bind(null, Reflect.construct);
const ContextInvokerCreator = (function(apply, closure, target) {
  return function(...args) {
    return apply(
      target,
      closure,
      // @ts-expect-error ignore
      [this === window ? null : this, args, new.target]
    );
  };
}).bind(null, Reflect.apply);
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
  const iframe = createElement("iframe");
  iframe.style.display = "none";
  const firefoxLoaded = new Promise((resolve) => {
    iframe.onload = resolve;
  });
  appendChild(iframe);
  await firefoxLoaded;
  if (!iframe.contentWindow) {
    throw new ReferenceError("无法载入运行域");
  }
  Reflect.defineProperty(iframe.contentWindow, "createRealms", {
    value() {
      const iframe2 = createElement("iframe");
      iframe2.style.display = "none";
      appendChild(iframe2);
      const window2 = iframe2.contentWindow;
      if (!window2) {
        throw new ReferenceError("顶级域已经被卸载");
      }
      if (!SANDBOX_DEBUG) {
        iframe2.remove();
      }
      return window2;
    }
  });
  iframe.contentWindow.replacedGlobal = window;
  iframe.contentWindow.replacedCI1 = ContextInvoker1;
  iframe.contentWindow.replacedCI2 = ContextInvoker2;
  iframe.contentWindow.replacedCIC = ContextInvokerCreator;
  iframe.contentWindow.replacedErrors = { CodeSnippet, ErrorReporter, ErrorManager };
  const script = iframe.contentWindow.document.createElement("script");
  script.src = TARGET_URL;
  script.type = "module";
  const promise = new Promise((resolve, reject) => {
    script.onload = resolve;
    script.onerror = reject;
  });
  iframe.contentWindow.document.head.appendChild(script);
  await promise;
  delete iframe.contentWindow.replacedGlobal;
  delete iframe.contentWindow.replacedCI1;
  delete iframe.contentWindow.replacedCI2;
  delete iframe.contentWindow.replacedCIC;
  delete iframe.contentWindow.replacedErrors;
  Object.assign(SANDBOX_EXPORT, iframe.contentWindow.SANDBOX_EXPORT);
  if (!SANDBOX_DEBUG) {
    iframe.remove();
  }
}
function isSandboxEnabled() {
  return SANDBOX_ENABLED;
}
export {
  SANDBOX_EXPORT,
  initializeSandboxRealms,
  isSandboxEnabled
};
