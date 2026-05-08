# GameEvent 事件流程速查

本文根据 `apps/core/noname/library/element/gameEvent.ts` 及其配套的 `GameEventManager`、content 编译器整理，用于后续阅读事件系统时作为上下文。

## 核心定位

`GameEvent` 是游戏运行时的事件节点。摸牌、出牌、造成伤害、判定、选择目标、技能发动等行为，最终都通过一个或多个 `GameEvent` 串起来执行。

它同时承担三类职责：

- 数据容器：保存 `name`、`player`、`target`、`card`、`num`、`result` 等事件数据
- 异步单元：实现 `PromiseLike<void>`，可以被 `await`
- 调度节点：维护父子事件、后续事件、生命周期触发和技能触发

可以把一个事件理解成：

```text
一个带有上下文数据的可 await 节点
  -> 它有自己的 content
  -> 它能创建/等待子事件
  -> 它会触发 Before/Begin/End/After 等时机
  -> 它会收集并执行技能触发
```

## 创建事件

常见入口是 `game.createEvent(name, trigger, triggerEvent)`。

简化逻辑：

```js
createEvent(name, trigger, triggerEvent) {
  const next = new lib.element.GameEvent(name, trigger, _status.eventManager);
  const parent = triggerEvent || _status.eventManager.getStartedEvent();
  if (parent) {
    parent.next.push(next);
  } else {
    _status.event = next;
  }
  return next;
}
```

含义：

- 创建一个 `GameEvent`
- 找到当前正在执行的事件作为父事件
- 如果存在父事件，把新事件放入父事件的 `next` 队列
- 如果没有父事件，则把它设为当前 `_status.event`

事件通常不是创建后立刻执行，而是进入父事件的 `next` 队列，等待父事件调度。

## 设置事件内容

`event.setContent(content)` 会把 content 编译成统一的异步函数。

```js
event.setContent("phaseDraw");
event.setContent(async event => {});
event.setContent([fn1, fn2]);
event.setContent(function () {
  "step 0";
  // old step content
});
```

支持形式：

- 字符串：从 `lib.element.content[name]` 或 `lib.element.contents[name]` 查找
- async 函数：包装成标准事件 content
- 普通函数：按旧式 `"step 0"`、`"step 1"` 语法解析
- 函数数组：按步骤逐个执行
- 可迭代对象：会转成数组后处理

`setContent()` 不能在事件 content 正在运行时调用，否则会抛错。

## await 事件

`GameEvent` 实现了 `then/catch/finally`，所以可以：

```js
await player.draw();
const result = await player.chooseCard().forResult();
```

`then()` 的关键逻辑：

```text
如果事件有 parent
  -> 等 parent.waitNext()
否则
  -> 自己 start()
```

这意味着：对子事件 `await` 时，通常不是子事件孤立执行，而是让父事件继续调度自己的 `next` 队列。

`forResult()` 是常用语法糖：

```js
async forResult() {
  await this;
  return this.result;
}
```

## 父子关系

重要字段：

```js
parent?: GameEvent;
childEvents: GameEvent[] = [];
next: GameEvent[] = [];
after: GameEvent[] = [];
```

- `parent`：父事件
- `childEvents`：已经开始过的子事件记录
- `next`：待执行子事件队列
- `after`：主体完成后追加执行的事件队列

`next` 是一个 `Proxy` 数组。向 `next` push 子事件时，会自动：

- 设置 `childEvent.parent = 当前事件`
- 继承部分 next handler
- 在特殊情况下直接 resolve 子事件

## start()

`start()` 是事件启动入口。

简化流程：

```text
如果已经 start 过，返回同一个 Promise
如果有 parent，加入 parent.childEvents
加入全局历史 everything
设置当前状态事件
执行 loop()
结束后弹出事件栈
```

`GameEventManager` 负责维护当前事件栈：

- `eventStack`：当前事件调用栈
- `rootEvent`：根事件
- `tempEvent`：临时切换到的事件
- `_status.event` 实际通过 manager 读取当前事件

## loop 生命周期

`loop()` 是 `GameEvent` 的核心。

典型生命周期：

```text
checkSkipped()
while true:
  waitNext()
  如果事件未 finished:
    _triggered === 0 -> 触发 name + "Before"
    _triggered === 1 -> 触发 name + "Begin"
    其他情况       -> 执行 content(event)
  如果事件已 finished:
    _triggered === 1 -> 触发 name + "Omitted"
    _triggered === 2 -> 触发 name + "End"
    _triggered === 3 -> 触发 name + "After"
    after 有内容     -> 移入 next 队列
    否则            -> 结束
```

若事件构造时 `trigger !== false`，且非联机环境，`_triggered` 初始为 `0`，所以会走完整生命周期：

```text
nameBefore
nameBegin
content
nameEnd
nameAfter
```

如果是卡牌事件，即 `event.type == "card"`，还会额外触发：

```text
useCardToBefore
useCardToBegin
useCardToEnd
useCardToAfter
```

## waitNext()

`waitNext()` 是事件调度的关键。

简化逻辑：

```text
while true:
  等待 pauseManager
  如果有 tempEvent 且不是自己，取消当前事件
  如果 next 队列为空，返回最后一个子事件 result
  取 next[0]
  await next.start()
  如果 next.result 存在，记录 result
  从 next 队列移除该事件
```

因此，当前事件每个生命周期节点前都会先把自己的子事件跑完。

常见效果：

```text
damage content 中创建 loseHp
  -> loseHp 进入 damage.next
  -> damage 下一次 waitNext 时执行 loseHp
  -> loseHp 完成后 damage 继续 End/After
```

这也是事件系统“嵌套但有序”的核心。

## 跳过、结束、取消、中和

### finish()

```js
finish() {
  this.finished = true;
}
```

`finish()` 只标记事件主体完成，不代表立即跳出整个事件。事件还可能继续触发 `End`、`After`，并处理 `after` 队列。

### checkSkipped()

事件开始时会检查：

- `player.skipList` 是否包含事件名
- `event.isSkipped` 是否为真

如果跳过：

```text
从 skipList 移除
记录 skipped 历史
finish()
触发 name + "Skipped"
```

### cancel()

`cancel()` 会：

- 调用 `untrigger()`
- 标记 `_cancelled`
- 触发 `name + "Cancelled"`
- 调用 `finish()`

用于取消阶段、取消牌效果等。

### neutralize()

`neutralize()` 用于中和事件：

- 标记 `_neutralized`
- 触发 `eventNeutralized`
- 若没有被 `unneutralize()` 撤销，则 `untrigger()` 并 `finish()`

## trigger 技能触发

`event.trigger(name)` 用于触发某个技能时机，例如：

```js
await event.trigger("damageBegin");
await event.trigger("phaseUseEnd");
```

核心步骤：

```text
如果没有 lib.hookmap[name]，返回
确定开始座次
遍历玩家
收集符合 role + triggername 的技能
处理 tempSkills 过期
按 firstDo / normal / lastDo 分类
按 priority 排序
创建 arrangeTrigger 事件
```

`trigger` 技能的 role 与原始事件字段对应：

```js
trigger: { player: "damageEnd" }
trigger: { source: "damageSource" }
trigger: { target: "useCardToTarget" }
trigger: { global: "phaseJieshuBegin" }
```

如果存在可触发技能，`trigger()` 会创建：

```js
const next = game.createEvent("arrangeTrigger", false, event);
next.setContent("arrangeTrigger");
next.doingList = doingList;
next._trigger = event;
next.triggername = name;
```

## arrangeTrigger

`arrangeTrigger` 的 content 在 `apps/core/noname/library/element/content.js`。

简化流程：

```text
复制 doingList
逐个处理 firstDo、每个玩家、lastDo
  -> 过滤当前可用技能 filterTrigger
  -> 同优先级技能可能让玩家选择
  -> 创建 createTrigger 事件
  -> await 技能发动结果
```

最终每个技能会通过 `game.createTrigger(...)` 变成一个技能发动事件。

## createTrigger 技能事件

触发技真正发动时，会经历：

```text
检查技能是否仍然拥有/可见
检查 hidden / invisible
forced/direct/frequent/cost/check 决定是否发动
如果有 cost，先创建 skill_cost 事件
发动成功后创建 skillName 事件
把 player、trigger、triggername、targets、cards、cost_data 传入
执行 info.content
```

这就是 `lib.skill.xxx.content` 的运行位置。

## step 与 result

事件支持旧式 step content。

相关字段：

```js
#step = 0;
#nextStep = null;
_result = {};
```

常用方法：

```js
event.goto(step);
event.redo();
event.updateStep();
```

函数数组 content 每执行一步后，会：

- 等待 `event.waitNext()`
- 把当前步骤返回值或子事件 result 写入 `event._result`
- 执行 handler begin/end

## chooseToUse 相关 backup/restore

`backup(skill)` 和 `restore()` 主要服务于主动技、视为技、选择事件。

`backup(skill)` 会把技能信息临时套到事件上：

- `filterButton`
- `selectButton`
- `filterTarget`
- `selectTarget`
- `filterCard`
- `selectCard`
- `position`
- `ai1`
- `ai2`
- `filterOk`
- `viewAs` 相关逻辑

`restore()` 则恢复之前的选择条件。

这使得 `chooseToUse`、`chooseToRespond` 等事件可以临时变成某个技能的选择流程。

## 联机 send/sendAsync

`send()` 用于把事件发送到对应玩家客户端执行：

```text
把 name、args、set、parent event、技能状态发给客户端
客户端调用 game.me[name](...args)
恢复 set 参数
设置 _modparent
game.resume()
本端 player.wait()
game.pause()
```

`sendAsync()` 在支持时等待客户端结果。

## handler

事件可以挂处理器：

```js
event.pushHandler(handler);
event.pushHandler("onDamage", handler);
event.callHandler(type, event, option);
```

默认 handler 名：

```text
事件 damage       -> onDamage
子事件 damage next -> onNextDamage
```

这套机制用于在事件执行步骤前后插入额外处理。

## cache

事件提供两类缓存：

```js
putStepCache(key, value)
getStepCache(key)
clearStepCache(key)
callFuncUseStepCache(prefix, func, params)

putTempCache(key1, key2, value)
getTempCache(key1, key2)
```

`stepCache` 通常用于同一步骤中避免重复计算；每步结束后会清理。

## 常见事件执行示意

以 `damage` 为例：

```text
创建 damage 事件
设置 player/source/num/card 等数据
setContent("damage")
进入父事件 next
父事件 waitNext
damage.start()
damageBefore
damageBegin
执行 damage content
  -> 可能创建 loseHp / die / chooseToUse 等子事件
  -> waitNext 执行这些子事件
damageEnd
damageAfter
完成
```

以出牌阶段中的使用牌为例：

```text
phaseUse
  -> chooseToUse
    -> 玩家选择牌/技能/目标
    -> useSkill 或 useCard
      -> useCardBefore / useCardBegin
      -> useCardToPlayer / useCardToTarget
      -> 卡牌 content
      -> damage / respond / gain / lose 等子事件
      -> useCardEnd / useCardAfter
  -> 若 result.bool 为真，phaseUse 回到选择步骤
  -> 玩家结束出牌，phaseUseEnd / phaseUseAfter
```

## 一句话总结

`GameEvent` 不是简单的回调对象，而是整个游戏的异步事件调度骨架。它通过 `next` 队列、生命周期触发、技能触发和可 `await` 语义，把游戏行为组织成一棵有序执行的事件树。
