export interface FakeEventOptions {
	player?: any;
	nextResults?: any[];
}

/**
 * ArrayCompiler 测试用的最小事件替身。
 *
 * 复刻真实 GameEvent 的关键语义：`step` 的 setter 只暂存 nextStep，
 * 由 `updateStep()` 提交；其余方法只记录调用，不实现事件引擎。
 */
export class FakeEvent {
	#step = 0;
	#nextStep: number | null = null;

	finished = false;
	_result: any = {};
	_trigger: any = undefined;
	player: any = undefined;
	name = "fake";
	nextResults: any[] = [];
	handlers: Array<{ type: string; state?: string }> = [];
	clearedSteps: any[] = [];

	constructor(options: FakeEventOptions = {}) {
		this.player = options.player;
		this.nextResults = options.nextResults ?? [];
	}

	get step() {
		return this.#step;
	}

	set step(value: number) {
		this.#nextStep = value;
	}

	updateStep() {
		if (this.#nextStep !== null) {
			this.#step = this.#nextStep;
			this.#nextStep = null;
		}
	}

	finish() {
		this.finished = true;
	}

	async waitNext() {
		return this.nextResults.shift();
	}

	getDefaultHandlerType() {
		return "onDefault";
	}

	callHandler(type: string, _event: FakeEvent, option?: { state?: string }) {
		this.handlers.push({ type, state: option?.state });
	}

	clearStepCache(value: any) {
		this.clearedSteps.push(value);
	}
}
