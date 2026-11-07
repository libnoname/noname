import { game, _status } from "noname";
import { IContentCompiler, EventContent } from "./IContentCompiler.js";

type HandlerOption = { state?: "begin" | "end" };

/**
 * 向子类提供统一的公共方法
 */
export default abstract class ContentCompilerBase implements IContentCompiler {
	abstract type: string;
	abstract filter(content: EventContent): boolean;
	abstract compile(content: EventContent): (e: GameEvent) => Promise<void>;

	/**
	 * ```plain
	 * 对于事件执行前的一些准备工作
	 * ```
	 *
	 * @param event 事件
	 */
	beforeExecute(event: GameEvent) {
		const handlerType = event.getDefaultHandlerType() as `on${Capitalize<string>}`;
		const option: HandlerOption = { state: "begin" };
		event.callHandler(handlerType, event, option);
		event.updateStep();
	}

	/**
	 * ```plain
	 * 判断事件能否继续执行
	 * ```
	 *
	 * @param event 事件
	 * @returns 当返回true时，代表event.finish()已经被调用
	 */
	isPrevented(event: GameEvent): boolean {
		const { player } = event;

		if (event.name === "phaseLoop") {
			return false;
		}

		if (!player) {
			return false;
		}
		if (player.isDead() && !event.forceDie) {
			game.broadcastAll(function () {
				while (_status.dieClose.length) {
					_status.dieClose.shift().close();
				}
			});
			event._oncancel?.();
		} else if (player.isOut() && !event.includeOut) {
			if (event.name == "phase" && player == _status.roundStart && !event.skill) {
				_status.roundSkipped = true;
			}
		} else if (player.removed) {
			void 0;
		} else {
			return false;
		}

		event.finish();
		return true;
	}

	/**
	 * ```plain
	 * 对于事件执行后的一些收尾工作
	 * ```
	 *
	 * @param event 事件
	 */
	afterExecute(event: GameEvent) {
		event.clearStepCache(null);

		const handlerType = event.getDefaultHandlerType() as `on${Capitalize<string>}`;
		const option: HandlerOption = { state: "end" };
		event.callHandler(handlerType, event, option);
		event.updateStep();
	}
}
