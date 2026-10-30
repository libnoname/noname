import { describe, it, expect, vi } from "vitest";

import { clearReconnectState, decideReconnect, finishConnectCallback } from "./reconnect.js";

describe("finishConnectCallback", () => {
	it("回调中发起新连接时保留新回调", () => {
		const next = vi.fn();
		const status = { connectCallback: () => (status.connectCallback = next) };
		finishConnectCallback(status, false);
		expect(status.connectCallback).toBe(next);
	});
});

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

	it("maxAttempts 为 0 时不重试", () => {
		expect(decideReconnect({ ...base, maxAttempts: 0 }).action).toBe("reload");
	});

	it("负的重试次数按首次重试处理", () => {
		expect(decideReconnect({ ...base, attempts: -1 })).toEqual({ action: "retry", delay: 1000, nextAttempts: 1 });
	});

	it("noReconnect 优先于重试（即便有 ip、次数未满）", () => {
		expect(decideReconnect({ ...base, noReconnect: true, attempts: 0 }).action).toBe("reload");
	});

	it("大厅握手后被拒绝时即使仍在线也不重试", () => {
		expect(decideReconnect({ ...base, wasOnline: true, reconnecting: false, noReconnect: true }).action).toBe("reload");
	});
});

/**
 * clearReconnectState 由「协议层确认联机态已恢复」的两个入口共用：
 * 大厅走 roomlist，直连房主走 reinit。
 */
describe("clearReconnectState", () => {
	it("取消已安排的重连并清除定时器引用", () => {
		vi.useFakeTimers();
		try {
			const reconnect = vi.fn();
			const status = { reconnectAttempts: 1, reconnecting: true, reconnectTimer: setTimeout(reconnect, 1000) };
			clearReconnectState(status);
			vi.advanceTimersByTime(1000);
			expect(reconnect).not.toHaveBeenCalled();
			expect(status.reconnectTimer).toBeUndefined();
		} finally {
			vi.useRealTimers();
		}
	});
	it("清零重试计数并结束重试链", () => {
		const status = { reconnectAttempts: 3, reconnecting: true };
		clearReconnectState(status);
		expect(status.reconnectAttempts).toBe(0);
		expect(status.reconnecting).toBe(false);
	});

	it("对未开始重连的状态是幂等的", () => {
		const status = {};
		clearReconnectState(status);
		clearReconnectState(status);
		expect(status.reconnectAttempts).toBe(0);
		expect(status.reconnecting).toBe(false);
	});

	it("清理后再断线，decideReconnect 从第一次退避重新开始", () => {
		const status = { reconnectAttempts: 4, reconnecting: true };
		clearReconnectState(status);
		const d = decideReconnect({
			wasOnline: true,
			wasGameOver: false,
			noReconnect: false,
			reconnecting: status.reconnecting,
			hasIp: true,
			attempts: status.reconnectAttempts,
			maxAttempts: 5,
		});
		// 未清理时 attempts=4 会退避 15s，再断一次即耗尽转 reload
		expect(d.action).toBe("retry");
		expect(d.delay).toBe(1000);
	});

	it("不触碰其它 _status 字段", () => {
		const status = { reconnectAttempts: 2, reconnecting: true, ip: "1.2.3.4", noReconnect: true };
		clearReconnectState(status);
		expect(status.ip).toBe("1.2.3.4");
		expect(status.noReconnect).toBe(true);
	});
});
