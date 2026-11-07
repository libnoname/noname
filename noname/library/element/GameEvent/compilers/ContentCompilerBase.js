import "../../../../../noname.js";
import { game } from "../../../../game/index.js";
import { _status } from "../../../../status/index.js";
class ContentCompilerBase {
  /**
   * ```plain
   * 对于事件执行前的一些准备工作
   * ```
   *
   * @param event 事件
   */
  beforeExecute(event) {
    const handlerType = event.getDefaultHandlerType();
    const option = { state: "begin" };
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
  isPrevented(event) {
    const { player } = event;
    if (event.name === "phaseLoop") {
      return false;
    }
    if (!player) {
      return false;
    }
    if (player.isDead() && !event.forceDie) {
      game.broadcastAll(function() {
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
  afterExecute(event) {
    event.clearStepCache(null);
    const handlerType = event.getDefaultHandlerType();
    const option = { state: "end" };
    event.callHandler(handlerType, event, option);
    event.updateStep();
  }
}
export {
  ContentCompilerBase as default
};
