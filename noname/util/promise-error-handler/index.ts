/**
 * 关于不同浏览器下对异步错误的处理方式
 *
 * 目前已实现的浏览器如下：
 *
 * - `Google Chrome`（包括`electron`、`cordova`以及`crosswalk`）
 * - `Mozilla Firefox`
 *
 */

import { PromiseErrorHandler } from "./promise-error-handler.ts";
import { ChromePromiseErrorHandler } from "./chrome.ts";
import { FirefoxPromiseErrorHandler } from "./firefox.ts";
import { UnknownPromiseErrorHandler } from "./unknown.ts";

/**
 * 从浏览器名到不同浏览器下异步处理方式的映射
 *
 * `key`的值同`get.coreInfo`函数返回值的第一个元素
 */
export const promiseErrorHandlerMap: Record<string, new () => PromiseErrorHandler> = {
    chrome: ChromePromiseErrorHandler,
    firefox: FirefoxPromiseErrorHandler,
    safari: UnknownPromiseErrorHandler,
    other: UnknownPromiseErrorHandler,
};