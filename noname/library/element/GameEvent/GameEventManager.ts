import { lib } from "../../index.js";
import { GameEvent } from "../gameEvent.js";

export type NonameGameEventChangedArgs = [newEvent: GameEvent, oldEvent: GameEvent];

export default class GameEventManager {
	get [Symbol.toStringTag]() {
		return "GameEventManager";
	}
	eventStack: GameEvent[] = [];
	rootEvent?: GameEvent;
	tempEvent?: GameEvent;
	get event() {
		return this.getStatusEvent();
	}
	getStartedEvent() {
		return this.tempEvent || this.eventStack.at(-1);
	}
	getStatusEvent() {
		return this.tempEvent || this.eventStack.at(-1) || this.rootEvent;
	}
	setStatusEvent(event: GameEvent, internal: boolean = false) {
		if (!(event instanceof GameEvent)) {
			return;
		}

		const oldEvent = this.getStatusEvent();
		if (this.eventStack.length === 0) {
			this.rootEvent = event;
			if (internal) {
				this.eventStack.push(event);
			}
		} else if (internal) {
			this.eventStack.push(event);
		} else if (this.eventStack.includes(event)) {
			this.tempEvent = event;
		} else {
			throw new Error("Cannot assign a value to _status.event that is not in eventStack.");
		}

		if (oldEvent == null || event !== oldEvent) {
			lib.announce.publish<NonameGameEventChangedArgs>("Noname.Game.Event.Changed", [event, oldEvent!]);
		}
	}
	popStatusEvent() {
		const lastEvent = this.eventStack.pop();
		const now = this.getStatusEvent();
		if (lastEvent == null || lastEvent !== now) {
			lib.announce.publish<NonameGameEventChangedArgs>("Noname.Game.Event.Changed", [now!, lastEvent!]);
		}
	}
}
