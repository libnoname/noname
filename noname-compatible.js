// 关于兼容环境
// （以后再补，总之兼容环境的代码必须：不依赖coreJS，照顾低版本的浏览器）

export const rootURL = new URL("./", import.meta.url);

export { GetCompatible, get, setGetCompatible } from "./noname/get/compatible.js";
export { GameCompatible, game, setGameCompatible, UpdateReason } from "./noname/game/compatible.js";
export * as util from "./noname/util/index.js";
