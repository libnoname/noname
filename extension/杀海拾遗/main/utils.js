import { lib, game, ui, get, ai, _status } from "../../../noname.js";

/**
 * 伪连接字符串，去掉换行和行前空串
 * @param { TemplateStringsArray } strings 模板字符串
 * @param { ...any } values 插值
 * @returns { string }
 */
ui.joint = function (strings, ...values) {
	let str = strings.reduce((acc, str, i) => acc + str + (values[i] || ""), "");
	let lines = str.split("\n").map(line => line.trimStart());
	return lines.join("").trim();
};

export { lib, game, ui, get, ai, _status };
