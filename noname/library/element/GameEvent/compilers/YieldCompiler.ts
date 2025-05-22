import { GeneratorFunction } from "../../../../util/index.js";
import { EventContent, GameEvent } from "./IContentCompiler.ts";
import { _status, ai, game, get, lib, ui } from "../../../../../noname.js";
import ContentCompiler from "./ContentCompiler.ts";
import ContentCompilerBase from "./ContentCompilerBase.ts";

export default class YieldCompiler extends ContentCompilerBase {
	type = "yield";
	static #mapArgs(event: GameEvent): Record<string, any> {
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

	filter(content: EventContent): boolean {
		return typeof content === "function" && content instanceof GeneratorFunction;
	}

	compile(content: EventContent) {
		const compiler = this;
		const middleware = async function (event: GameEvent) {
			const args = YieldCompiler.#mapArgs(event);
			const generator: Generator<any, void, any> =
				// @ts-expect-error ignore
				Reflect.apply(content as GeneratorFunction, this, [event, args]);

			let result: any = null;
			let done: boolean = false;

			while (!done) {
				let value: any = null;

				if (!compiler.isPrevented(event)) {
					({ value, done = true } = generator.next(result));
					if (done) {
						break;
					}
					result = await (value instanceof GameEvent ? value.forResult() : value);
				}

				const nextResult = await event.waitNext();
				event._result = result ?? nextResult ?? event._result;
			}

			generator.return();
		};

		return ContentCompiler.compile([middleware]);
	}
}
