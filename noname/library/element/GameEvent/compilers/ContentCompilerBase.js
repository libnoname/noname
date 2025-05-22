import { game, _status } from "../../../../../noname.js";
export default class ContentCompilerBase {
	beforeExecute(event) {
		const handlerType = event.getDefaultHandlerType();
		const option = { state: "begin" };
		event.callHandler(handlerType, event, option);
		event.updateStep();
	}
	isPrevented(event) {
		const { player } = event;
		if (event.name === "phaseLoop") {
			return false;
		}
		if (!player) {
			return false;
		}
		if (player.isDead() && !event.forceDie) {
			// @ts-expect-error ignore
			game.broadcastAll(function () {
				while (_status.dieClose.length) {
					_status.dieClose.shift().close();
				}
			});
			if (event._oncancel) {
				event._oncancel();
			}
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
	afterExecute(event) {
		event.clearStepCache(null);
		const handlerType = event.getDefaultHandlerType();
		const option = { state: "end" };
		event.callHandler(handlerType, event, option);
		event.updateStep();
	}
}
