import { describe, it, expect } from "vitest";

import { decideReconnect } from "./reconnect.js";

/**
 * decideReconnect 是从 lib.element.ws.onclose 中抽出的纯决策函数，
 * 不含任何副作用（setTimeout / game.reload / DOM），便于单测。
 */
describe("decideReconnect", () => {
	/** 构造一个“在线且需要重连”的基础状态，单测时按需覆盖字段 */
	const base = {
		wasOnline: true,
		wasGameOver: false,
		noReconnect: false,
		reconnecting: false,
		hasIp: true,
		attempts: 0,
		maxAttempts: 5,
	};

	it("未联机且不在重连链中 → 不处理（none）", () => {
		expect(decideReconnect({ ...base, wasOnline: false }).action).toBe("none");
	});

	it("游戏正常结束 → 不处理（none）", () => {
		expect(decideReconnect({ ...base, wasGameOver: true }).action).toBe("none");
	});

	it("用户主动退出 / 被踢（noReconnect）→ 回退刷新（reload）", () => {
		expect(decideReconnect({ ...base, noReconnect: true }).action).toBe("reload");
	});

	it("无可重连地址 → 回退刷新（reload）", () => {
		expect(decideReconnect({ ...base, hasIp: false }).action).toBe("reload");
	});

	it("重试次数达到上限 → 回退刷新（reload）", () => {
		expect(decideReconnect({ ...base, attempts: 5 }).action).toBe("reload");
	});

	it("首次断线 → 重试，延迟 1s，下次尝试数 1", () => {
		const d = decideReconnect({ ...base, attempts: 0 });
		expect(d.action).toBe("retry");
		expect(d.delay).toBe(1000);
		expect(d.nextAttempts).toBe(1);
	});

	it("指数退避：1s → 2s → 4s → 8s → 15s（封顶）", () => {
		const delayAt = a => decideReconnect({ ...base, attempts: a }).delay;
		expect(delayAt(0)).toBe(1000);
		expect(delayAt(1)).toBe(2000);
		expect(delayAt(2)).toBe(4000);
		expect(delayAt(3)).toBe(8000);
		expect(delayAt(4)).toBe(15000); // 16000 封顶为 15000
	});

	it("纯大厅续连：wasOnline=false 但 reconnecting=true 仍继续重试（核心修复）", () => {
		const d = decideReconnect({
			...base,
			wasOnline: false,
			reconnecting: true,
			attempts: 2,
		});
		expect(d.action).toBe("retry");
		expect(d.delay).toBe(4000);
		expect(d.nextAttempts).toBe(3);
	});

	it("续连耗尽：reconnecting=true 且 attempts 达上限 → 回退刷新", () => {
		expect(decideReconnect({ ...base, wasOnline: false, reconnecting: true, attempts: 5 }).action).toBe("reload");
	});

	it("maxAttempts 缺省为 5", () => {
		const s = { ...base, attempts: 5 };
		delete s.maxAttempts;
		expect(decideReconnect(s).action).toBe("reload");
	});

	it("noReconnect 优先于重试（即便有 ip、次数未满）", () => {
		expect(decideReconnect({ ...base, noReconnect: true, attempts: 0 }).action).toBe("reload");
	});
});
