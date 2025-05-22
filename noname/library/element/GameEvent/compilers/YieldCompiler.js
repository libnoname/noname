import { GeneratorFunction } from "../../../../util/index.js";
import { _status, ai, game, get, lib, ui } from "../../../../../noname.js";
import ContentCompilerBase from "./ContentCompilerBase.js";
import ContentCompiler from "./ContentCompiler.js";
import { GameEvent } from "../../gameEvent.js";

export default class YieldCompiler extends ContentCompilerBase {
	type = "yield";
	static #mapArgs(event) {
		const { step, source, target, targets, card, cards, skill, forced, num, _result, _trigger, player } = event;
		return {
			event,
			step,
			source,
			player,
			target,
			targets,
			card,
			cards,
			skill,
			forced,
			num,
			trigger: _trigger,
			result: _result,
			_status,
			lib,
			game,
			ui,
			get,
			ai,
		};
	}
	filter(content) {
		return typeof content === "function" && content instanceof GeneratorFunction;
	}
	compile(content) {
		const compiler = this;
		const middleware = async function (event) {
			const args = YieldCompiler.#mapArgs(event);
			const generator = Reflect.apply(content, this, [event, args]);

			let result = null;
			let done = false;

			while (!done) {
				let value = null;

				if (!compiler.isPrevented(event)) {
					({ value, done = true } = generator.next(result));
					if (done) {
						break;
					}
					result = await (value instanceof GameEvent ? value.forResult() : value);
				}

				const nextResult = await event.waitNext();
				result ??= nextResult;
			}

			generator.return();
		};

		return ContentCompiler.compile([middleware]);
	}
}
