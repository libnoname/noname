import ContentCompilerBase from "./ContentCompilerBase.js";
import { GameEvent } from "../../gameEvent.js";
export default class ArrayCompiler extends ContentCompilerBase {
    type = "array";
    filter(content) {
        return Array.isArray(content);
    }
    compile(content) {
        if (!Array.isArray(content))
            throw new ReferenceError("content必须是一个数组");
        const compiler = this;
        return async function (event) {
            if (!Number.isInteger(event.step))
                event.step = 0;
            while (!event.finished) {
                if (event.step >= content.length) {
                    event.finish();
                    break;
                }
                compiler.beforeExecute(event);
                event.step++;
                let result;
                if (!compiler.isPrevented(event)) {
                    const original = content[event.step];
                    //@ts-ignore
                    const next = await Reflect.apply(original, this, [event, event._trigger, event.player]);
                    result = next instanceof GameEvent ? next.result : next;
                }
                const nextResult = await event.waitNext();
                event._result = result || nextResult || event._result;
                compiler.afterExecute(event);
            }
        };
    }
}