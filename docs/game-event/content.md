# Content 编译系统

Content 编译系统将各种 content 格式统一编译为 `(event: GameEvent) => Promise<void>`，供生命周期模块调用。

## 接口

```
// 门面
ContentCompiler.compile(content: EventCompileable): EventCompiledContent

// 事件上
event.setContent(content: EventCompileable): this
event.content: EventCompiledContent        // 编译后的 content
```

## 架构

ContentCompiler 通过**责任链模式**匹配编译器：

```
单 async 函数 → AsyncCompiler（适配层） → [fn]
旧 step 函数 → StepCompiler（解析）   → [fn1, fn2, ...]
数组直接传入  → 跳过预处理              → [fn1, fn2, ...]
                                              ↓
                                    ArrayCompiler（执行引擎）
                                              ↓
                              while(!finished) {
                                beforeExecute → execute → waitNext → afterExecute
                              }
```

AsyncCompiler 和 StepCompiler 都是**预处理层**，统一将各自格式转为函数数组后交由 ArrayCompiler 执行。ArrayCompiler 是唯一的执行引擎。

### IContentCompiler 接口

```ts
interface IContentCompiler {
  type: string;                              // 编译器标识
  filter(content: EventContent): boolean;     // 是否支持此 content
  compile(content: EventCompileable): (e: GameEvent) => Promise<void>;
}
```

### ContentCompiler.compile() 门面

处理内容标准化和缓存：

- 已标记 `compiled: true` 的 content 直接返回（幂等）
- `regularize()` 预处理：字符串从 `lib.element.content[name]` 查找；可迭代对象转为数组
- 编译结果以原始 content 为 key 存入 WeakMap 缓存
- 遍历编译器列表，第一个 `filter` 匹配的编译器执行 `compile`

## AsyncCompiler — 推荐写法

`type = "async"`，`filter` 匹配 `instanceof AsyncFunction`。

单 async 函数是当前推荐的 content 格式：

```js
event.setContent(async (event, trigger, player) => {
  await game.delay();
  await player.draw(2);
  await player.chooseToUse();
});
```

AsyncCompiler 将单个 async 函数包装为单元素数组 `[asyncFn]`，重新调用 `ContentCompiler.compile([asyncFn])` 使责任链匹配到 ArrayCompiler 执行。它是一个纯粹的适配层（约 19 行）。

## ArrayCompiler — 执行引擎

`type = "array"`，`filter` 匹配 `Array.isArray(content) && content.every(item => typeof item === "function")`。

ArrayCompiler 是所有 content 的最终执行器。编译后的函数实现一个 while 循环：

1. 若 `event.step` 非整数则初始化为 0
2. 循环条件 `!event.finished`：
   - `beforeExecute(event)` — 提交排队的 step 变更
   - `event.step++` — 递增步骤号
   - `isPrevented(event)` 检查是否终止（角色死亡/离场/移除）
   - 执行 `content[event.step](event, trigger, player, event._result)`
   - `await event.waitNext()` 等待子事件链
   - 合并子事件的 result 到 `event._result`
   - `afterExecute(event)` — 清理 step cache、提交排队的 step 变更

每个函数接收四个参数：`(event, trigger, player, _result)`，其中 `_result` 是上一个子事件产生的 result。

### step 导航

`event.step` 使用双字段设计：

- `#step: number` — 当前实际步骤号（getter 返回此值）
- `#nextStep: number | null` — 排队的下一步（setter 写入此值）

`event.step++` 不立即改变 `#step`，而是写入 `#nextStep`。`content[event.step]` 读取 getter 返回的 `#step`，因此总能拿到正确的当前索引。

`updateStep()` 将 `#nextStep` 提交到 `#step`，在 `beforeExecute()` 和 `afterExecute()` 中各调用一次。

- `goto(n)`：设置 `step = n`（写入 `#nextStep`），下次 `updateStep()` 提交
- `redo()`：等价于 `goto(this.step)`

### _result 传递

`_result: Partial<Result>` 存储最后一个子事件的 result，在 step 间传递：

```
step N 返回值 → event._result → 作为第四参数传给 step N+1
```

在单 async 函数写法中，变量直接通过闭包传递，不依赖此机制。

## ContentCompilerBase — 共享钩子

所有编译器的抽象基类，提供三个由 ArrayCompiler 执行循环调用的方法：

**`beforeExecute(event)`**：调用 `event.updateStep()` 提交排队的 step 变更

**`isPrevented(event)`**：检查是否应终止当前步骤
- 角色死亡 `player.isDead() && !event.forceDie` → 关闭 dieClose 弹窗，调用 `_oncancel`，finish
- 角色离场 `player.isOut() && !event.includeOut` → finish（phase 事件额外标记 `_status.roundSkipped`）
- 角色移除 `player.removed` → 无操作
- `event.name === "phaseLoop"` 始终返回 false（特殊绕过）

**`afterExecute(event)`**：`clearStepCache(null)` + `updateStep()`

## 编译器对照

| | AsyncCompiler | ArrayCompiler | StepCompiler |
|--|---------------|---------------|--------------|
| type | `"async"` | `"array"` | `"step"` |
| filter | `instanceof AsyncFunction` | 函数数组 | 普通同步函数 |
| 角色 | 适配层 | 执行引擎 | 预处理器 |
| 状态 | 推荐 | 待废弃 | 待废弃 |
| 独立性 | 依赖 ArrayCompiler | 独立 | 依赖 ArrayCompiler |

---

# 附录：已废弃 — Step 语法与数组写法

## 现状概述

| 写法 | 状态 | 示例 |
|------|------|------|
| 单 async 函数 | **推荐** | `setContent(async (event, trigger, player) => { ... })` |
| 函数数组 | 待废弃（次优先） | `setContent([fn1, fn2, fn3])` |
| step 语法 | 待废弃（优先） | `setContent(function() { "step 0"; ...; "step 1"; ... })` |

- **step 语法**数量最大（约 3886 处），迁移最优先
- **数组写法**直接传入数组的调用极少，但 `setContent("stringName")` 引用的预定义 content 大多内部也是数组
- **单 async 函数**是目标格式，所有新 content 应只使用此写法

## Step 语法

旧 step 写法在一个普通同步函数体中用 `"step N"` 字符串字面量标记步骤边界。StepCompiler 在编译时识别这些分隔符，将函数切分为多个闭包，交给 ArrayCompiler 执行。

### 旧写法示例

```js
event.setContent(function () {
  "step 0"
  game.delay();

  "step 1"
  player.draw(2);

  "step 2"
  player.chooseToUse();
});
```

### StepCompiler 编译流程

1. **formatFunction(func)**：通过 Marshal API 获取函数源代码，移除注释，去除外层大括号
2. **parseStep()**：循环匹配正则 `"?step N"?` 分割代码块：
   - step 0 之前的代码保存为 `stepHead`（公共头部，注入每个 step 编译结果的开头）
   - 每个 step 的代码块独立编译
   - 最后一段代码同样独立编译
3. **packStep(code)**：使用隔离的 Function 构造函数编译每个 step，注入前置变量和解构参数

编译后的函数注入：

```js
new FunctionConstructor(
  "topVars", "event", "trigger", "player",
  `
    var { step, source, target, targets, card, cards, skill, forced, num, _result: result } = event;
    var { _status, lib, game, ui, get, ai } = topVars;
    ${stepHead}
    { ${code} }
  `
);
```

**安全机制**：使用 `security.getIsolatedsFrom(func)` 获取函数对应的隔离域 Function 构造函数，确保编译代码在正确沙盒中运行。

## 数组写法

直接传入函数数组是 step 语法的"手动版本"：

```js
event.setContent([
  async (event) => { await game.delay(); },
  async (event) => { await player.draw(2); },
]);
```

每个函数作为独立一步执行，`goto`/`redo` 在数组中同样可用。

## 迁移路线

- **阶段一（优先）**：step 语法 → 单 async 函数。将步骤间的 `"step N"` 替换为 `await`，跨步骤的局部变量提升到 async 函数体内的闭包变量
- **阶段二（后续）**：数组写法 → 单 async 函数。直接使用数组的调用极少，一次性处理

迁移目标写法：

```js
event.setContent(async (event, trigger, player) => {
  await game.delay();
  await player.draw(2);
  await player.chooseToUse();
});
```
