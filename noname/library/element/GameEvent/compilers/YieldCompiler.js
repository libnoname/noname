import { _status, ai, game, get, lib, ui } from "../../../../../noname.js";
import ContentCompilerBase from "./ContentCompilerBase.js";
import { GameEvent } from "../../gameEvent.js";
export default class YieldCompiler extends ContentCompilerBase {
    type = "yield";
    static #mapArgs(event) {
        const { step, source, target, targets, card, cards, skill, forced, num, _result, _trigger, player } = event;
        return {
            event, step, source, player,
            target, targets, card, cards, skill,
            forced, num, trigger: _trigger,
            result: _result,
            _status, lib, game, ui, get, ai,
        };
    }
    filter(content) {
        return typeof content === "function" && content.constructor.name === "GeneratorFunction";
    }
    compile(content) {
        const compiler = this;
        return async function (event) {
            const args = YieldCompiler.#mapArgs(event);
            //@ts-ignore
            const generator = Reflect.apply(content, this, [event, args]);
            let result = null;
            let done = false;
            while (!event.finished) {
                if (done) {
                    event.finish();
                    break;
                }
                let value = null;
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
