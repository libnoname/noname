import { GameEvent } from "../gameEvent.js";

export default class GameEventManager{
	get [Symbol.toStringTag]() {
		return 'GameEventManager';
	}
	eventStack = [];
	rootEvent;
	tempEvent;
	get event(){
		return this.getStatusEvent();
	}
    getStartedEvent(){
		return this.tempEvent || this.eventStack.at(-1);
	}
	getStatusEvent() {
		return this.tempEvent || this.eventStack.at(-1) || this.rootEvent;
	}
	setStatusEvent(event) {
		if (!(event instanceof GameEvent)) return;
		if (this.eventStack.length === 0) this.rootEvent = event;
		else if (this.eventStack.includes(event)) this.tempEvent = event;
		else throw new Error("Cannot assign a value to _status.event that is not in eventStack.");
	}
}
