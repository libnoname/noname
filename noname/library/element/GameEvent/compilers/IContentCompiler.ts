import { lib } from "../../../../../noname.js";
import { GameEvent } from "../../gameEvent.js";

export type EventContent = Function | Function[];
export type EventCompileable = EventContent | Iterable<Function> | keyof typeof lib.element.content;
export { GameEvent };

// 指示标准的事件content应该是只接受event一个参数的异步函数，同时有一个属性指示编译前的content类型
export type EventCompiledContent = ((e: GameEvent) => Promise<void>) & {
    compiled: true;
    type: string;
    original: EventCompileable;
    /**
     * array content的原始值
     */
    originals?: Function[];
};

export default interface IContentCompiler {
    /**
     * ```plain
     * 当前编译器的事件content类型
     * ```
     */
    type: string;

    /**
     * ```plain
     * 判断事件content是否被当前编译器支持
     * ```
     * 
     * @param content 事件content
     */
    filter(content: EventContent): boolean;

    /**
     * 对content执行编译
     * 并返回标准的事件content
     * 
     * @param content 要编译的content
     */
    compile(content: EventCompileable): ((e: GameEvent) => Promise<void>);
}