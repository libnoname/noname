import { lib } from "noname";
import { executionContext } from "./ExecutionContext.js";
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
		const executing = executionContext.current?.executingEvent;
		return this.tempEvent || (executing?.manager === this ? executing : this.eventStack.at(-1));
	}
	getStatusEvent() {
		return this.getStartedEvent() || this.rootEvent;
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
	popStatusEvent(event?: GameEvent) {
		const index = event ? this.eventStack.lastIndexOf(event) : this.eventStack.length - 1;
		const lastEvent = index >= 0 ? this.eventStack.splice(index, 1)[0] : undefined;
		const now = this.getStatusEvent();
		if (lastEvent == null || lastEvent !== now) {
			lib.announce.publish<NonameGameEventChangedArgs>("Noname.Game.Event.Changed", [now!, lastEvent!]);
		}
	}
}
