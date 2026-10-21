import { describe, expect, it, vi } from "vitest";
import { lib } from "noname";
import { Is } from "@/get/is.js";

describe("smoke", () => {
	it("运行 JavaScript 断言", () => {
		expect(1 + 1).toBe(2);
	});

	it("加载 TypeScript 测试与真实模块", () => {
		const is = new Is();
		expect(is.shownCard({ gaintag: ["visible_test"] })).toBe(true);
		expect(is.virtualCard({ cards: [] })).toBe(true);
	});

	it("支持异步测试", async () => {
		const value = await Promise.resolve(42);
		expect(value).toBe(42);
	});

	it("支持 mock", () => {
		const fn = vi.fn((num: number) => num * 2);
		expect(fn(21)).toBe(42);
		expect(fn).toHaveBeenCalledTimes(1);
	});

	it("setup 垫片提供 localStorage，引擎替身生效", () => {
		localStorage.setItem("smoke", "1");
		expect(localStorage.getItem("smoke")).toBe("1");
		expect(lib.natureSeparator).toBe("|");
	});
});
