// apk每次安装后第一次启动加载Service Worker会失败
// 所以每次导入这个ts判断是否会成功，失败的话重启一次
import { rootURL } from "@noname";
import { ref } from "vue";
console.log(rootURL, ref);
export const text = "ts文件导入成功";
