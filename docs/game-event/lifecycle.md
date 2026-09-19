# 内部生命周期 (Lifecycle)

生命周期模块管理单个事件从启动到结束的完整状态流转，包括状态机驱动、content 执行编排和中断控制。

依赖：[trigger.md](trigger.md)、[content.md](content.md)、[relationships.md](relationships.md)（waitNext）。

## 接口

```
// 启动
start(): Promise<void>         // 启动事件，入栈 + 执行 loop
resolve()                      // 创建已 resolved 的 Promise（跳过实际执行）

// 状态
_triggered: number | null      // 触发器状态机（见下表）
finished: boolean              // 事件是否已完成

// 中断
finish()                       // 标记完成，触发 End/After 时机
cancel(all?, player?, notrigger?)  // 组合 untrigger + finish
neutralize(event?)             // [待废弃] 中和事件
unneutralize()                 // [待废弃] 取消中和

// 内部
loop()                         // 核心执行循环
checkSkipped(): Promise<bool>  // 检查是否被跳过
```

## _triggered 状态机

`_triggered` 是事件流程的核心状态字段，驱动 `loop()` 的分支走向：

| 值 | 含义 | 触发阶段 |
|----|------|----------|
| `null` | 非 trigger 事件（构造时 `trigger = false`） | 无 |
| `0` | 初始状态 | → `XXXBefore` |
| `1` | Before 已触发 | → `XXXBegin`（未 finish）/ `XXXOmitted`（已 finish） |
| `2` | Begin 已触发 | → 执行 content |
| `3` | Content 已执行 | → `XXXAfter` |
| `4` | 全部触发完成 | → 处理 after 链，退出 loop |
| `5` | 被 `untrigger` 取消 | 跳过当前 arrangeTrigger |

## 构造

```js
new GameEvent(name, trigger, manager)
```

- `name`：事件名。传入另一个 GameEvent 时从中提取 name 和 manager
- `trigger`：是否触发技能时机。默认 `true`。联机模式下 `_triggered` 设为 `null`
- `manager`：默认取 `_status.eventManager`

静态方法 `GameEvent.initialGameEvent()` 创建已 finish 的空事件，用作根事件的占位。

## start() 与 resolve()

- `resolve()`：设置 `#start = Promise.resolve()`，使事件"已就绪"但不执行任何内容。用于需要跳过执行但保持 Promise 接口的子事件
- `start()`：真正启动事件。将自身推入 eventStack，执行 `loop()`，完成后弹出

`event.then()` 或 `await event` 底层调用 `start()`。

## loop() 主循环

`loop()` 是事件的核心执行循环：

1. 如果 `checkSkipped()` 返回 true，直接退出
2. 进入 while 循环：
   - **未 finish 时**：按 `_triggered` 值依次触发 `XXXBefore`(0→1) → `XXXBegin`(1→2) → 执行 content(2)
   - **已 finish 时**：按 `_triggered` 值依次触发 `XXXOmitted`(1→4) → `XXXEnd`(2→3) → `XXXAfter`(3→4)
   - 每次迭代前调用 `waitNext()`，等待子事件链中的下一个事件完成
   - 当 `_triggered === 4` 且 `after` 链为空时，loop 退出

在执行 content（`_triggered === 2`）期间，设置 `#inContent = true`，执行 `content(event)`，完成后置回 `false`。

`trigger()` 调用本身会创建 `arrangeTrigger` 子事件，通过 `waitNext` 等待其完成。

## checkSkipped()

判断当前事件是否需要跳过：

1. `player` 存在且 `player.skipList` 包含该事件名，或 `event.isSkipped` 为 true
2. 从 `skipList` 中移除该事件名
3. 如果事件名是阶段名，记录到 `player.getHistory("skipped")`
4. 调用 `finish()` 并触发 `XXXSkipped`

## 中断控制

### finish()

设置 `finished = true`。不直接终止执行——loop 检测到 `finished` 后走 finish 分支（触发 End/After 时机）。

**注意**：`finish()` 不会中断正在执行的 content 函数。content 需要自行检查 `event.finished` 来决定是否提前返回。

### cancel()

组合 `untrigger()` + `finish()`：

1. 调用 `untrigger(all, player)`
2. 若非 `notrigger` 模式，记录 skipped 历史、设置 `_cancelled = true`、触发 `XXXCancelled`
3. 调用 `finish()`

### _notrigger / notrigger

- `notrigger: boolean` — 如果为 true，此事件不触发任何技能时机
- `_notrigger: Player[]` — 特定角色的不触发列表，`trigger()` 中检查

### _oncancel

取消回调函数，由 `ContentCompilerBase.isPrevented()` 在角色死亡时触发。
