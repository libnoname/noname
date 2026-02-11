import { lib } from "noname";
import PauseManager from "@/game/PauseManager.ts";
import { GameEventManager } from "@/library/element/gameEvent.js";

export class status {
	imchoosing = false;
	auto = false;
	eventManager = new GameEventManager();
	/**
	 * @type { GameEvent }
	 */
	get event() {
		// @ts-expect-error 除开局外，必然存在当前事件
		return this.eventManager.getStatusEvent();
	}
	set event(event) {
		this.eventManager.setStatusEvent(event);
	}
	ai = {};
	lastdragchange = [];
	/**
	 * @type { string[] }
	 */
	skillaudio = [];
	dieClose = [];
	dragline = [];
	dying = [];
	/**
	 * @type { GameHistory[] }
	 */
	globalHistory = [
		{
			cardMove: [],
			custom: [],
			useCard: [],
			changeHp: [],
			everything: [],
		},
	];
	cardtag = {
		yingbian_zhuzhan: [],
		yingbian_kongchao: [],
		yingbian_fujia: [],
		yingbian_canqu: [],
		yingbian_force: [],
	};
	renku = [];
	sxrmConnectCards = [];
	prehidden_skills = [];
	postReconnect = {};
	/**
	 * @type { string | undefined }
	 */
	extension = undefined;
	/**
	 * @type { boolean }
	 */
	importingExtension = false;
	/**
	 * @type { Promise<any>[] | undefined }
	 */
	extensionLoading = undefined;
	/**
	 * @type { string[] | undefined }
	 */
	extensionLoaded = undefined;
	/**
	 * @type { { [key: string]: Promise<any>[] } | undefined }
	 */
	importing = undefined;
	clicked = false;
	/**
	 * @type { boolean | undefined }
	 */
	dragged = undefined;
	/**
	 * @type { boolean | undefined }
	 */
	touchconfirmed = undefined;
	connectMode = false;
	/**
	 * @type { boolean | undefined }
	 */
	video = undefined;
	/**
	 * @type { Function | boolean | undefined }
	 */
	new_tutorial = undefined;
	/**
	 * @type { Player | undefined }
	 */
	roundStart = undefined;
	/**
	 * @type { boolean }
	 */
	roundSkipped;
	/**
	 * @type { string | undefined }
	 */
	mode = undefined;
	/**
	 * @type { { [key: string]: any } | undefined }
	 */
	brawl = undefined;
	/**
	 * @type { string | undefined }
	 */
	playback = undefined;
	/**
	 * @type { number | undefined }
	 */
	coinCoeff = undefined;
	pauseManager = new PauseManager();
	get paused() {
		return this.pauseManager.pause.isStarted;
	}
	set paused(bool) {
		if (bool) {
			this.pauseManager.pause.start();
		} else {
			this.pauseManager.pause.resolve();
		}
	}
	get paused2() {
		return this.pauseManager.pause2.isStarted;
	}
	set paused2(bool) {
		if (bool) {
			this.pauseManager.pause2.start();
		} else {
			this.pauseManager.pause2.resolve();
		}
	}
	get paused3() {
		return this.pauseManager.pause3.isStarted;
	}
	set paused3(bool) {
		if (bool) {
			this.pauseManager.pause3.start();
		} else {
			this.pauseManager.pause3.resolve();
		}
	}
	get over() {
		return this.pauseManager.over.isStarted;
	}
	set over(bool) {
		if (bool) {
			this.pauseManager.over.start();
		} else {
			this.pauseManager.over.resolve();
		}
	}
}

export let _status = new status();

/**
 * @param { InstanceType<typeof status> } [instance]
 */
export let setStatus = instance => {
	_status = instance || new status();
	if (lib.config.dev) {
		window._status = _status;
	}
};
