import StackFrame from "stackframe";
import ErrorStackParser from "error-stack-parser";
import StackTraceGPS from "stacktrace-gps";
import { ErrorManager } from "@/util/sandbox.js";

function getStatusInfo({ lib, get, _status }) {
	if (!_status?.event) return "";

	let str = "";
	const evt = _status.event;
	str += `\nevent.name: ${evt.name}\nevent.step: ${evt.step}`;
	if (evt.parent) {
		str += `\nevent.parent.name: ${evt.parent.name}\nevent.parent.step: ${evt.parent.step}`;
	}
	if (evt.parent && evt.parent.parent) {
		str += `\nevent.parent.parent.name: ${evt.parent.parent.name}\nevent.parent.parent.step: ${evt.parent.parent.step}`;
	}
	if (evt.player || evt.target || evt.source || evt.skill || evt.card) {
		str += "\n-------------";
	}
	if (evt.player) {
		if (lib.translate[evt.player.name]) {
			str += `\nplayer: ${lib.translate[evt.player.name]}[${evt.player.name}]`;
		} else {
			str += "\nplayer: " + evt.player.name;
		}
		let distance = get.distance(_status.roundStart, evt.player, "absolute");
		if (distance != Infinity) {
			str += `\n座位号: ${distance + 1}`;
		}
	}
	if (evt.target) {
		if (lib.translate[evt.target.name]) {
			str += `\ntarget: ${lib.translate[evt.target.name]}[${evt.target.name}]`;
		} else {
			str += "\ntarget: " + evt.target.name;
		}
	}
	if (evt.source) {
		if (lib.translate[evt.source.name]) {
			str += `\nsource: ${lib.translate[evt.source.name]}[${evt.source.name}]`;
		} else {
			str += "\nsource: " + evt.source.name;
		}
	}
	if (evt.skill) {
		if (lib.translate[evt.skill]) {
			str += `\nskill: ${lib.translate[evt.skill]}[${evt.skill}]`;
		} else {
			str += "\nskill: " + evt.skill;
		}
	}
	if (evt.card) {
		if (lib.translate[evt.card.name]) {
			str += `\ncard: ${lib.translate[evt.card.name]}[${evt.card.name}]`;
		} else {
			str += "\ncard: " + evt.card.name;
		}
	}
	return str;
}

function normalizeError(reason: unknown): Error {
	if (reason instanceof Error) return reason;

	if (typeof reason === "string") {
		return new Error(reason);
	}

	try {
		return new Error(JSON.stringify(reason));
	} catch {
		return new Error(String(reason));
	}
}

/**
 * 目前和StackTrace.fromError一样
 * @param error
 * @param opts
 * @returns
 */
async function fromError(error: Error, opts?: StackTraceGPS.Options): Promise<{ origin: StackFrame; source?: StackFrame }[]> {
	try {
		const gps = new StackTraceGPS(opts);
		const stackframes = ErrorStackParser.parse(error);
		return Promise.all(
			stackframes.map(async sf => {
				try {
					const source = await gps.pinpoint(sf);
					return { origin: sf, source };
				} catch {
					return { origin: sf };
				}
			})
		);
	} catch (e) {
		return [{ origin: new StackFrame({}) }];
	}
}

export function setOnError({ lib, game, get, _status }) {
	window.onunhandledrejection = async (event: PromiseRejectionEvent) => {
		const error = normalizeError(event.reason);
		window.onerror?.(error.message, undefined, undefined, undefined, error);
	};

	window.onerror = async (_msg: string | Event, _src?: string, _line?: number, _column?: number, err?: Error) => {
		if (!err) return;
		const stackframes = await fromError(err);
		const frame = stackframes[0].source || stackframes[0].origin;
		const msg = err.message;
		const src = frame.fileName;
		const log: string[] = [];
		log.push(`错误文件: ${typeof src == "string" ? decodeURI(src).replace(lib.assetURL, "") : "未知文件"}`);
		log.push(`错误信息: ${msg}`);
		const tip = lib.getErrorTip(msg);
		if (tip) {
			log.push(`错误提示: ${tip}`);
		}
		log.push(`行号: ${frame.lineNumber}`);
		log.push(`列号: ${frame.columnNumber}`);
		const version = typeof lib.version != "undefined" ? lib.version : "";
		const match = version.match(/[^\d.]/) != null;
		log.push(`${match ? "游戏" : "无名杀"}版本: ${version || "未知版本"}`);
		if (match) {
			log.push("⚠️您使用的游戏代码不是源于libnoname/noname无名杀官方仓库，请自行寻找您所使用的游戏版本开发者反馈！");
		}
		log.push(getStatusInfo({ lib, get, _status }));
		log.push("-------------");
		const errorReporter = ErrorManager.getErrorReporter(err);
		if (errorReporter) {
			game.print(errorReporter.report(log.join("\n") + "\n代码出现错误"));
		} else {
			if (typeof frame.lineNumber == "number" && (typeof game.readFile == "function" || location.origin != "file://")) {
				/**
				 * @param code 源代码
				 * @param line 代码报错行数
				 */
				const createShowCode = (code: string, line: number) => {
					const lines = code.split("\n");
					const showCode: string[] = [];
					// 10行窗口
					for (let i = Math.max(0, line - 5); i < line + 6 && i < lines.length; i++) {
						showCode.push(`${i + 1}| ${line == i + 1 ? "⚠️" : ""}${lines[i]}`);
					}
					showCode.push("-------------");
					return showCode;
				};
				// 解析step content的错误
				if (frame.functionName === "packStep") {
					const codes = _status.event.content.originals[_status.event.step];
					if (typeof codes == "function") {
						const regex = /<anonymous>:(\d+):\d+/;
						const match = err.stack?.split("\n")[1].match(regex);
						if (match) {
							log.push(...createShowCode(codes.toString(), parseInt(match[1])));
						}
					}
				}
				// 协议名须和html一致(网页端防跨域)，且文件是js
				else if (typeof src == "string" && src.startsWith(location.protocol) && src.endsWith(".js")) {
					//获取sourcemap
					try {
						const source = stackframes[0].source;
						if (!source?.fileName) throw new Error();

						let rawSourceMap = await lib.init.promises.req(src + ".map");
						if (!rawSourceMap) throw new Error();
						const sourceMap = JSON.parse(rawSourceMap);

						function relativeUrl(from: string, to: string): string {
							try {
								const fromUrl = new URL(from);
								const toUrl = new URL(to);

								if (fromUrl.origin !== toUrl.origin) {
									// 不同域名没法相对，直接返回绝对路径
									return to;
								}

								const fromParts = fromUrl.pathname.split("/").filter(Boolean);
								const toParts = toUrl.pathname.split("/").filter(Boolean);

								// 找到公共前缀长度
								let i = 0;
								while (i < fromParts.length && i < toParts.length && fromParts[i] === toParts[i]) {
									i++;
								}

								const backSteps = fromParts.length - i;
								const relativeParts = [...Array(backSteps).fill(".."), ...toParts.slice(i)];

								return relativeParts.join("/") || toParts[toParts.length - 1];
							} catch {
								return to;
							}
						}

						const file = relativeUrl(src, source.fileName);
						const content = sourceMap.sourcesContent[sourceMap.sources.indexOf(file)];

						log.push(...createShowCode(content, frame.lineNumber || 0));
					} catch (e) {
						let code = await lib.init.promises.req(src);
						if (code) log.push(...createShowCode(code, frame.lineNumber || 0));
					}
				}
			}
			if (err && err.stack) {
				log.push(`${err.name}: ${err.message}`);
				log.push(
					...stackframes.map(frame => {
						const f = frame.source || frame.origin;
						return `    at ${f.functionName || "(anonymous)"} (${decodeURI(f.fileName || "").replace(new RegExp(lib.assetURL, "g"), "")}:${f.lineNumber}:${f.columnNumber})`;
					})
				);
			}
			alert(log.join("\n"));
			game.print(log.join("\n"));
		}
	};
}
