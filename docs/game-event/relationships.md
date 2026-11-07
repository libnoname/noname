# 事件关系 (Relationships)

事件关系模块管理事件间的**层级结构**和**时序调度**。它是其他模块的运行时基础——所有子事件的执行都通过此模块排队和等待。

## 接口

```
// 树结构
parent?: GameEvent          // 父事件引用
childEvents: GameEvent[]    // 所有直接子事件
getParent(level, forced?, includeSelf?)  // 沿 parent 链向上查找

// 时序调度
next: GameEvent[]           // 串行执行队列（Proxy 包装）
after: GameEvent[]          // 延迟执行队列
insert(content, map)        // 向 next 插入子事件
insertAfter(content, map)   // 向 after 插入子事件

// 子事件等待
waitNext(): Promise<Result | void>  // 阻塞等待 next 队列执行完毕

// 全局调度器（GameEventManager）
eventStack: GameEvent[]     // 运行时调用栈
tempEvent?: GameEvent       // 临时覆盖（不改变栈）
rootEvent?: GameEvent       // 栈空时的兜底事件
setStatusEvent(event, internal)  // 事件入栈/设为当前
popStatusEvent()            // 事件出栈
```

## 树结构

### parent / childEvents — 层级归属

```
 game (根事件)
  └─ ...
      └─ phase (阶段事件)
          ├─ phaseUse (出牌阶段)
          │   └─ chooseToUse (选择用牌)
          │       └─ useCard (出牌)
          │           └─ arrangeTrigger (时机：使用牌时)
          │               └─ createTrigger (触发技能)
          ├─ phaseDiscard (弃牌阶段)
         ...
```

- `parent?: GameEvent` — 子事件持有对父事件的引用。由 `next` 的 Proxy 在 push 时自动设置
- `childEvents: GameEvent[]` — 父事件在子事件 `start()` 时将其加入此列表

树结构主要用于显式建模和调试（类似函数调用栈），运行时调度由 `next` 链驱动。

### getParent(level, forced?, includeSelf?)

沿 parent 链向上查找。支持三种查询方式：

- `number`：向上 N 层（默认 1，即直接父事件）
- `string`：按事件名匹配
- `function`：自定义匹配逻辑

`forced = true` 时找不到返回 `undefined`；否则返回空对象 `{}`（安全 fallback）。`includeSelf = true` 时从自身开始匹配。

联机模式下，由于没有在客机上同步完整事件树，若事件有 `_modparent`，getParent 会沿 `_modparent` 而非 `parent` 向上查找。

## 时序调度

### next 链 — 串行执行

`next: GameEvent[]` 是父事件控制子事件执行顺序的核心队列。父事件通过 `waitNext()` 依次取 `next[0]` 并等待其完成。

一个父事件的所有子事件严格串行——父事件执行 content 后进入 waitNext，等 `next[0]` 完成再继续。

`next` 使用 Proxy 包装，当 push 新事件时自动：

1. 设置 `childEvent.parent = this`
2. 如果父事件已在 `finished` 状态，立即 `resolve` 子事件使其跳过执行（避免已完成的事件产生新的活跃子事件）

### after 链 — 延迟执行

`after: GameEvent[]` 存放需要在当前事件**完全结束后**（`_triggered === 4`）才执行的子事件。

`next` 和 `after` 的区别：

|  | next | after |
|--|------|-------|
| 执行时机 | 下一轮 loop 迭代 | 所有 trigger 完成后 |
| 使用场景 | `game.createEvent` 默认挂载 | `event.insertAfter`、延迟回调 |

### insert / insertAfter

```js
event.insert(content, { player: target });
event.insertAfter(cleanupContent, { player: target });
```

- `insert(content, map)`：创建非 trigger 事件 push 到 `next`
- `insertAfter(content, map)`：创建非 trigger 事件 push 到 `after`

## waitNext — 子事件等待

`waitNext()` 是父事件阻塞等待所有子事件完成的机制：

1. 等待 `_status.pauseManager.waitPause()`（联机暂停）
2. 检查 `manager.tempEvent`：如果指向自己则清除；如果指向其他事件则 cancel 自身
3. 如果 `next` 链为空，直接返回（result 为 `undefined`）
4. 否则取 `next[0]`，`await next.start()`，合并其 `result`，从 `next` 中移除

返回值是最后一个子事件的 `result`，用于废弃的 step/array content 中收集子事件结果。推荐取结果使用 `await event.forResult()`。

## 运行时映射：事件栈

事件树的层级关系定义"谁属于谁"，而事件栈决定"当前在执行谁"。

### _status.event — 当前事件指针

由 `GameEventManager.getStatusEvent()` 决定，按优先级依次返回：

1. `tempEvent` — 临时覆盖
2. `eventStack.at(-1)` — 栈顶事件
3. `rootEvent` — 根事件（栈空时兜底）

### setStatusEvent / popStatusEvent

`setStatusEvent(event, internal)` 管理事件指针的切换：

- **栈空时**：设 event 为 `rootEvent`；若 `internal = true` 同时 push 入栈
- **栈非空 + internal**：push 入栈（标准流程，`start()` 中调用）
- **栈非空 + 非 internal + event 在栈中**：设为 `tempEvent`（临时回指）
- **其他情况**：抛出错误

`popStatusEvent()` 从栈中弹出栈顶，触发 `Noname.Game.Event.Changed` 公告。

### tempEvent — 临时覆盖

不改变 eventStack 的"软切换"。当已在栈中的事件需要被重新设为 `_status.event` 时使用（如联机模式下子事件回调时重新指向父事件）。

## 完整执行示例

以"出牌 → 触发技能"为例：

```
1. game.createEvent("chooseToUse")  → push 到父事件 next
2. chooseToUse.start()              → eventStack: [..., chooseToUse]
                                    _status.event = chooseToUse
3. chooseToUse.content 执行         → game.createEvent("useCard")
                                    push 到 chooseToUse.next
4. chooseToUse.waitNext() 等待      → 取 useCard，await useCard.start()
5. useCard.start()                  → eventStack: [..., chooseToUse, useCard]
                                    _status.event = useCard
6. useCard.loop(): trigger("useCardBegin")
   创建 arrangeTrigger 并 push 到 useCard.next
7. useCard.waitNext() 等待          → 取 arrangeTrigger，await
8. arrangeTrigger.start()           → eventStack: [..., chooseToUse, useCard, arrangeTrigger]
                                    _status.event = arrangeTrigger
9. arrangeTrigger 执行完毕          → popStatusEvent()
                                    eventStack: [..., chooseToUse, useCard]
10. useCard 执行完毕                → popStatusEvent()
                                    eventStack: [..., chooseToUse]
11. chooseToUse 继续下一步...
```

关键要点：

- **树与栈的对应**：从根到任意叶的路径 = eventStack 的内容
- **深度优先**：子事件在父事件 waitNext 期间执行，父事件等子事件完成后恢复
- **createEvent 的默认挂载**：`game.createEvent` 默认 push 到当前活跃事件的 `next` 链
