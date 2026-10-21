import { describe, expect, it } from "vitest";
import ArrayCompiler from "@/library/element/GameEvent/compilers/ArrayCompiler.js";
import { FakeEvent } from "../helpers/fakeEvent";

const compiler = new ArrayCompiler();

async function run(content: any[], event = new FakeEvent()) {
	const compiled = compiler.compile(content as any);
	await compiled.call(event as any, event as any);
	return event;
}

describe("ArrayCompiler", () => {
	describe("filter", () => {
		it("只接受全部由函数组成的数组", () => {
			expect(compiler.filter([])).toBe(true);
			expect(compiler.filter([() => {}])).toBe(true);
			expect(compiler.filter([() => {}, async () => {}])).toBe(true);
			expect(compiler.filter([1])).toBe(false);
			expect(compiler.filter([() => {}, 1])).toBe(false);
			expect(compiler.filter("step 0")).toBe(false);
			expect(compiler.filter(undefined)).toBe(false);
		});
	});

	describe("compile", () => {
		it("空数组直接结束事件", async () => {
			const event = await run([]);
			expect(event.finished).toBe(true);
			expect(event.step).toBe(0);
		});

		it("按顺序执行 content 并传递上一步结果", async () => {
			const calls: string[] = [];
			const event = await run([
				(evt: FakeEvent) => {
					calls.push("first");
					evt._result = { value: 1 };
				},
				(_evt: FakeEvent, _trigger: any, _player: any, result: any) => {
					calls.push("second");
					expect(result).toEqual({ value: 1 });
					return { value: result.value + 1 };
				},
				(_evt: FakeEvent, _trigger: any, _player: any, result: any) => {
					calls.push("third");
					expect(result).toEqual({ value: 2 });
				},
			]);
			expect(calls).toEqual(["first", "second", "third"]);
			expect(event.step).toBe(3);
			expect(event.finished).toBe(true);
		});

		it("返回值和 waitNext 结果写入 _result", async () => {
			const byReturn = await run([() => ({ fromReturn: true })]);
			expect(byReturn._result).toEqual({ fromReturn: true });

			const byWait = await run([() => undefined], new FakeEvent({ nextResults: [{ fromWait: true }] }));
			expect(byWait._result).toEqual({ fromWait: true });
		});

		it("finish 后不再执行后续步骤", async () => {
			const calls: number[] = [];
			const event = await run([
				(evt: FakeEvent) => {
					calls.push(1);
					evt.finish();
				},
				() => {
					calls.push(2);
				},
			]);
			expect(calls).toEqual([1]);
			expect(event.finished).toBe(true);
		});

		it("content 的 this 与调用上下文一致", async () => {
			let seen: any;
			const event = new FakeEvent();
			await run(
				[
					function (this: any) {
						seen = this;
					},
				],
				event
			);
			expect(seen).toBe(event);
		});

		it("content 抛出的异常向上传递", async () => {
			const event = new FakeEvent();
			const compiled = compiler.compile([
				() => {
					throw new Error("boom");
				},
			] as any);
			await expect(compiled.call(event as any, event as any)).rejects.toThrow("boom");
		});

		it("每步调用 begin/end 处理器并清理步骤缓存", async () => {
			const event = await run([() => {}, () => {}]);
			expect(event.handlers).toEqual([
				{ type: "onDefault", state: "begin" },
				{ type: "onDefault", state: "end" },
				{ type: "onDefault", state: "begin" },
				{ type: "onDefault", state: "end" },
			]);
			expect(event.clearedSteps).toEqual([null, null]);
		});
	});
});
