// Array.prototype.add / addArray 去重polyfill 的等价性测试。
//
// noname/init/polyfill.ts 会在模块顶层 patch 全局 Array.prototype 并依赖 DOM，
// 无法在 node 里直接 import。因此这里把「改动前」与「改动后」两份实现都抄下来做
// 差分测试：对大量随机输入断言两者结果完全一致（元素顺序、重复处理、返回值）。
//
// 运行：pnpm -F noname test   （等价于 node --test "test/*.test.mjs"）
import assert from "node:assert/strict";
import { test } from "node:test";

/** 改动前的实现（原样照抄 polyfill.ts 的历史版本） */
const legacy = {
	add(target, ...args) {
		for (const arg of args) {
			if (target.includes(arg)) {
				continue;
			}
			target.push(arg);
		}
		return target;
	},
	addArray(target, ...args) {
		for (const arr of args) {
			for (const item of arr) {
				legacy.add(target, item);
			}
		}
		return target;
	},
};

/** 改动后的实现（与 polyfill.ts 现版本保持同一逻辑，含规模阈值） */
const current = {
	add(target, ...args) {
		if (args.length > 4 && target.length + args.length >= 40) {
			const existing = new Set(target);
			for (const arg of args) {
				if (existing.has(arg)) {
					continue;
				}
				existing.add(arg);
				target.push(arg);
			}
			return target;
		}
		for (const arg of args) {
			if (target.includes(arg)) {
				continue;
			}
			target.push(arg);
		}
		return target;
	},
	addArray(target, ...args) {
		if (args.length === 0) {
			return target;
		}
		let incomingLength = 0;
		for (const arr of args) {
			incomingLength += arr.length;
		}
		if (target.length + incomingLength < 40) {
			for (const arr of args) {
				for (const item of arr) {
					current.add(target, item);
				}
			}
			return target;
		}
		const existing = new Set(target);
		for (const arr of args) {
			for (const item of arr) {
				if (existing.has(item)) {
					continue;
				}
				existing.add(item);
				target.push(item);
			}
		}
		return target;
	},
};

// 用可比较的标签化值，覆盖字符串 / 数字 / 布尔 / null / undefined / NaN / 对象身份
const pool = ["a", "b", "c", "asdf", "", 0, 1, 2, -0, NaN, true, false, null, undefined, { id: 1 }, { id: 2 }];
const POOL_SIZE = pool.length;

function randomInt(n) {
	return Math.floor(Math.random() * n);
}

function randomArray() {
	// 长度上限 30：配合最多 4 个入参数组，既能覆盖 <40 的线性分支，
	// 也能跨过 40 的阈值进入 Set 分支，保证两条路径都被差分测试覆盖。
	const len = randomInt(31);
	const out = [];
	for (let i = 0; i < len; i++) {
		out.push(pool[randomInt(POOL_SIZE)]);
	}
	return out;
}

function snapshot(arr) {
	// 用同一套规则把结果序列化成可比较的字符串：NaN 与 -0 单独标注，
	// 但**不**把两者视为相同——若两种实现对其判定不一致，这里就会暴露。
	return arr
		.map(v => {
			if (typeof v === "number" && Number.isNaN(v)) return "NaN";
			if (typeof v === "number" && Object.is(v, -0)) return "-0";
			if (v === null) return "null";
			if (v === undefined) return "undefined";
			if (typeof v === "object") return `obj#${pool.indexOf(v)}`;
			return `${typeof v}:${String(v)}`;
		})
		.join("|");
}

test("addArray：随机输入下新旧实现结果完全一致", () => {
	for (let round = 0; round < 3000; round++) {
		const base = randomArray();
		const incoming = Array.from({ length: randomInt(4) }, randomArray);

		const a = base.slice();
		const b = base.slice();

		const ra = legacy.addArray(a, ...incoming.map(x => x.slice()));
		const rb = current.addArray(b, ...incoming.map(x => x.slice()));

		assert.equal(snapshot(rb), snapshot(ra), `第 ${round} 轮结果不一致\nbase=${JSON.stringify(base)}\nincoming=${JSON.stringify(incoming)}`);
		// 返回值必须是同一个数组对象（链式调用依赖这一点）
		assert.equal(rb, b, "应返回原数组本身");
		assert.equal(ra, a, "旧实现也应返回原数组本身");
	}
});

test("add：随机输入下新旧实现结果完全一致", () => {
	for (let round = 0; round < 3000; round++) {
		const base = randomArray();
		const args = randomArray();

		const a = base.slice();
		const b = base.slice();

		const ra = legacy.add(a, ...args);
		const rb = current.add(b, ...args);

		assert.equal(snapshot(rb), snapshot(ra), `第 ${round} 轮结果不一致\nbase=${JSON.stringify(base)}\nargs=${JSON.stringify(args)}`);
		assert.equal(rb, b);
		assert.equal(ra, a);
	}
});

test("两条分支（线性 / Set）结果一致", () => {
	// 阈值两侧各取一个大数组用例，明确覆盖 Set 分支
	for (const [n, m] of [
		[39, 0],
		[30, 15],
		[100, 100],
		[500, 300],
	]) {
		const base = Array.from({ length: n }, (_, i) => `k${i}`);
		const incoming = Array.from({ length: m }, (_, i) => `k${i % Math.max(1, n - 1)}`);

		const a = base.slice();
		const b = base.slice();
		legacy.addArray(a, incoming);
		current.addArray(b, incoming);

		assert.equal(snapshot(b), snapshot(a), `n=${n} m=${m} 时两条分支结果不一致`);
		assert.equal(b.length, a.length);
	}
});

test("保持追加顺序，且不产生重复", () => {
	const target = ["x", "y"];
	current.addArray(target, ["y", "z", "z"], ["x", "w"]);
	assert.deepEqual(target, ["x", "y", "z", "w"]);
	assert.equal(new Set(target).size, target.length, "结果中不应有重复元素");
});

test("空参数与空数组不改变原数组", () => {
	const target = ["a"];
	current.addArray(target);
	assert.deepEqual(target, ["a"]);
	current.addArray(target, []);
	assert.deepEqual(target, ["a"]);
	current.add(target);
	assert.deepEqual(target, ["a"]);
});

test("NaN 与 ±0 的去重语义与 includes 一致", () => {
	const target = [NaN, 0];
	current.add(target, NaN, -0, 0);
	// includes / Set 都用 SameValueZero：NaN 视为相同，+0 与 -0 视为相同
	assert.equal(target.length, 2, `期望 [NaN, 0]，实际长度 ${target.length}`);
	assert.ok(Number.isNaN(target[0]));
	assert.equal(target[1], 0);
});

test("对象按身份去重", () => {
	const first = { id: 1 };
	const second = { id: 1 };
	const target = [first];
	current.addArray(target, [first, second]);
	assert.equal(target.length, 2);
	assert.equal(target[0], first);
	assert.equal(target[1], second);
});

test("addArray 复杂度：大数组不再退化为 O(n·m)", () => {
	// 旧实现在 n=m=20000 时约需 4×10^8 次 includes 比较，会明显超时；
	// 这里只做一个宽松的回归护栏（10 秒），防止将来又退回线性去重。
	const big = Array.from({ length: 20000 }, (_, i) => `k${i}`);
	const incoming = Array.from({ length: 20000 }, (_, i) => `k${i + 10000}`);

	const target = big.slice();
	const startedAt = performance.now();
	current.addArray(target, incoming);
	const elapsed = performance.now() - startedAt;

	assert.equal(target.length, 30000, "应合并为 30000 个唯一元素");
	assert.ok(elapsed < 5000, `耗时 ${elapsed.toFixed(1)}ms，疑似退化回 O(n·m)`);
});
