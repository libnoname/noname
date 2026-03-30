const nonameInitialized = localStorage.getItem("noname_inited");
const assetURL = "";
const GeneratorFunction = (function* () {
}).constructor;
const AsyncFunction = (async function() {
}).constructor;
const AsyncGeneratorFunction = (async function* () {
}).constructor;
const userAgent = navigator.userAgent;
const userAgentLowerCase = userAgent.toLowerCase();
const characterDefaultPicturePath = "image/character/default_silhouette_";
const isIPadOSMasqueradingAsMac = userAgentLowerCase.includes("macintosh") && typeof navigator != "undefined" && Number(navigator.maxTouchPoints) > 1;
const device = nonameInitialized !== "nodejs" ? userAgentLowerCase.includes("android") ? "android" : userAgentLowerCase.includes("iphone") || userAgentLowerCase.includes("ipad") || isIPadOSMasqueradingAsMac ? "ios" : void 0 : void 0;
class Uninstantable {
  constructor() {
    throw new TypeError(`${new.target.name} is not a constructor`);
  }
}
function delay(ms) {
  return new Promise((resolve) => {
    let timeout = setTimeout(() => {
      clearTimeout(timeout);
      resolve();
    }, ms);
  });
}
function isClass(func) {
  if (typeof func !== "function") {
    return false;
  }
  const fnStr = Function.prototype.toString.call(func);
  return /^class\s/.test(fnStr);
}
export {
  AsyncFunction,
  AsyncGeneratorFunction,
  GeneratorFunction,
  Uninstantable,
  assetURL,
  characterDefaultPicturePath,
  delay,
  device,
  isClass,
  nonameInitialized,
  userAgent,
  userAgentLowerCase
};
