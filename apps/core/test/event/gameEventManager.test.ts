import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../noname/library/element/gameEvent.js", () => {
	class FakeGameEvent {
		name: string;
		constructor(name = "") {
			this.name = name;
		}
	}
	return { GameEvent: FakeGameEvent };
});

import { lib } from "noname";
import { GameEvent } from "../../noname/library/element/gameEvent.js";
import GameEventManager from "@/library/element/GameEvent/GameEventManager.js";

const publish = vi.mocked(lib.announce.publish);

function createManager() {
	const manager = new GameEventManager();
	const first = new GameEvent("first");
	const second = new GameEvent("second");
	return { manager, first, second };
}

describe("GameEventManager", () => {
	beforeEach(() => {
		publish.mockClear();
	});

	it("首个内部事件成为 rootEvent 并入栈", () => {
		const { manager, first } = createManager();
		manager.setStatusEvent(first, true);
		expect(manager.rootEvent).toBe(first);
		expect(manager.eventStack).toEqual([first]);
		expect(manager.getStatusEvent()).toBe(first);
		expect(manager.getStartedEvent()).toBe(first);
		expect(publish).toHaveBeenCalledWith("Noname.Game.Event.Changed", [first, undefined]);
	});

	it("内部事件继续入栈并更新状态", () => {
		const { manager, first, second } = createManager();
		manager.setStatusEvent(first, true);
		manager.setStatusEvent(second, true);
		expect(manager.eventStack).toEqual([first, second]);
		expect(manager.getStatusEvent()).toBe(second);
		expect(manager.getStartedEvent()).toBe(second);
		expect(publish).toHaveBeenLastCalledWith("Noname.Game.Event.Changed", [second, first]);
	});

	it("切换到栈内事件只设置临时事件", () => {
		const { manager, first, second } = createManager();
		manager.setStatusEvent(first, true);
		manager.setStatusEvent(second, true);
		manager.setStatusEvent(first);
		expect(manager.tempEvent).toBe(first);
		expect(manager.getStatusEvent()).toBe(first);
		expect(manager.getStartedEvent()).toBe(first);
		expect(publish).toHaveBeenLastCalledWith("Noname.Game.Event.Changed", [first, second]);
	});

	it("切换到栈外事件抛出异常", () => {
		const { manager, first } = createManager();
		manager.setStatusEvent(first, true);
		expect(() => manager.setStatusEvent(new GameEvent("outside"))).toThrow("not in eventStack");
	});

	it("popStatusEvent 恢复上一事件", () => {
		const { manager, first, second } = createManager();
		manager.setStatusEvent(first, true);
		manager.setStatusEvent(second, true);
		manager.popStatusEvent();
		expect(manager.eventStack).toEqual([first]);
		expect(manager.getStatusEvent()).toBe(first);
		expect(publish).toHaveBeenLastCalledWith("Noname.Game.Event.Changed", [first, second]);
	});

	it("当前事件未变化时不发布变更", () => {
		const { manager, first } = createManager();
		manager.setStatusEvent(first, true);
		publish.mockClear();
		manager.setStatusEvent(first);
		expect(publish).not.toHaveBeenCalled();
	});

	it("栈清空后仍以 rootEvent 作为状态回退", () => {
		const { manager, first } = createManager();
		manager.setStatusEvent(first, true);
		publish.mockClear();
		manager.popStatusEvent();
		expect(manager.eventStack).toEqual([]);
		expect(manager.getStatusEvent()).toBe(first);
		expect(publish).not.toHaveBeenCalled();
	});
});
