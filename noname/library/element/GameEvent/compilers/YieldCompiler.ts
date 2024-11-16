import { EventContent, GameEvent } from "./IContentCompiler.ts";
import { _status, ai, game, get, lib, ui } from "../../../../../noname.js";
import ContentCompilerBase from "./ContentCompilerBase.ts";

export default class YieldCompiler extends ContentCompilerBase {
    type = "yield";
    static #mapArgs(event: GameEvent): Record<string, any> {
        const {
            step, source, target, targets,
            card, cards, skill, forced,
            num, _result, _trigger, player
        } = event;

        return {
            event, step, source, player,
            target, targets, card, cards, skill,
            forced, num, trigger: _trigger,
            result: _result,
            _status, lib, game, ui, get, ai,
        };
    }

    filter(content: EventContent): boolean {
        return typeof content === "function" && content.constructor.name === "GeneratorFunction";
    }

    compile(content: EventContent) {
        const compiler = this;
        return async function(event: GameEvent) {
            const args = YieldCompiler.#mapArgs(event);
            const generator: Generator<any, void, any> =
                //@ts-ignore
                Reflect.apply(content as GeneratorFunction, this, [event, args]);

            let result: any = null;
            let done: boolean = false;

            while (!event.finished) {
                if (done) {
                    event.finish();
                    break;
                }
                let value: any = null;

                compiler.beforeExecute(event);

                if (!compiler.isPrevented(event))
                    ({ value, done = false } = generator.next(result));

                await event.waitNext();
                result = value instanceof GameEvent ? value.result : value;

                compiler.afterExecute(event);
            }

            generator.return();
        };
    }
}
