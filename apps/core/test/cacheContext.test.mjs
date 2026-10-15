// CacheContext 单元测试。
//
// 放在 apps/core/test/ 而不是 noname/ 下：apps/core/scripts/build.ts 会把整个
// noname/ 目录原样复制进 dist/src，测试文件放在那里会变成对外分发的死重量。
//
// 运行：pnpm -F noname test   （等价于 node --test test/）
import assert from "node:assert/strict";
import { test } from "node:test";

const { CacheContext } = await import("../noname/library/cache/cacheContext.js");

// 构造一个假的 get 对象，记录每个方法的调用次数
function makeFake() {
	const calls = { rawAttitude: 0, order: 0, effect: 0 };
	const fake = {
		rawAttitude(a, b) {
			calls.rawAttitude++;
			return `${a}-${b}`;
		},
		order(item) {
			calls.order++;
			return typeof item;
		},
		// 故意返回 undefined，用于验证未命中哨兵
		effect() {
			calls.effect++;
			return undefined;
		},
	};
	return { fake, calls };
}

test("invoke 在无上下文时直接调用原函数（不缓存、也不建上下文）", () => {
	const { fake, calls } = makeFake();
	CacheContext.setProxy({ get: fake });
	assert.equal(CacheContext.getCacheContext(), undefined);

	CacheContext.invoke("get", "rawAttitude", fake, ["a", "b"]);
	CacheContext.invoke("get", "rawAttitude", fake, ["a", "b"]);

	assert.equal(calls.rawAttitude, 2, "无上下文时不应命中缓存");
	assert.equal(CacheContext.getCacheContext(), undefined, "不应顺手注册缓存上下文");
});

test("invoke 在已注册上下文时命中缓存", () => {
	const { fake, calls } = makeFake();
	CacheContext.setProxy({ get: fake });
	CacheContext.setCacheContext(new CacheContext());
	try {
		CacheContext.invoke("get", "rawAttitude", fake, ["a", "b"]);
		CacheContext.invoke("get", "rawAttitude", fake, ["a", "b"]);
		assert.equal(calls.rawAttitude, 1, "第二次应命中缓存");
	} finally {
		CacheContext.removeCacheContext();
	}
});

test("返回 undefined 的结果也会被缓存", () => {
	const { fake, calls } = makeFake();
	CacheContext.setProxy({ get: fake });
	CacheContext.setCacheContext(new CacheContext());
	try {
		CacheContext.invoke("get", "effect", fake, []);
		CacheContext.invoke("get", "effect", fake, []);
		assert.equal(calls.effect, 1, "返回 undefined 的函数第二次应命中而非重算");
	} finally {
		CacheContext.removeCacheContext();
	}
});

test("源码相同但捕获不同的闭包不会共用缓存条目", () => {
	const { fake } = makeFake();
	fake.withFilter = function (filter) {
		return filter();
	};
	CacheContext.setProxy({ get: fake });
	CacheContext.setCacheContext(new CacheContext());
	try {
		// 同一份源码、不同捕获变量 —— 旧实现下两者的 toString() 完全相同，
		// 因而 MD5(源码) 生成的缓存键也相同，第二个会命中第一个的值。
		const closures = [1, 2].map(n => () => n * 100);
		assert.equal(closures[0].toString(), closures[1].toString(), "前置条件：两者源码应一致");

		const r1 = CacheContext.invoke("get", "withFilter", fake, [closures[0]]);
		const r2 = CacheContext.invoke("get", "withFilter", fake, [closures[1]]);
		assert.equal(r1, 100);
		assert.equal(r2, 200, "第二个闭包不应命中第一个闭包的缓存值");
	} finally {
		CacheContext.removeCacheContext();
	}
});

test("不同参数产生不同缓存条目", () => {
	const { fake, calls } = makeFake();
	CacheContext.setProxy({ get: fake });
	CacheContext.setCacheContext(new CacheContext());
	try {
		CacheContext.invoke("get", "rawAttitude", fake, ["a", "b"]);
		CacheContext.invoke("get", "rawAttitude", fake, ["a", "c"]);
		assert.equal(calls.rawAttitude, 2);
	} finally {
		CacheContext.removeCacheContext();
	}
});

test("proxy 源缺失时 invoke 走兜底分支且不产生非预期错误", () => {
	CacheContext.setProxy({});
	try {
		CacheContext.invoke("get", "rawAttitude", null, []);
	} catch (e) {
		// 兜底分支本身会因 proxyed.get 缺失而失败，但只应是读取属性类的 TypeError
		assert.ok(e instanceof TypeError, `兜底分支不应抛出 ${e?.constructor?.name}`);
	}
});

test("inject 仅在 cacheEnvironment 为真时返回缓存", () => {
	const proto = {
		hit: 0,
		compute(x) {
			this.hit++;
			return x * 2;
		},
	};
	CacheContext.inject(proto, ["compute"]);
	CacheContext.setProxy({ get: makeFake().fake });

	CacheContext.setInCacheEnvironment(false);
	proto.compute(3);
	proto.compute(3);
	assert.equal(proto.hit, 2, "缓存环境关闭时应每次真实调用");

	CacheContext.setCacheContext(new CacheContext());
	CacheContext.setInCacheEnvironment(true);
	try {
		proto.compute(5);
		proto.compute(5);
		assert.equal(proto.hit, 3, "缓存环境打开时同参数应命中");
	} finally {
		CacheContext.setInCacheEnvironment(false);
		CacheContext.removeCacheContext();
	}
});
