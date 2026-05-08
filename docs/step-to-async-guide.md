# Step Content 转 Async Content 指南

本文整理 `setContent` 中旧式 `step` 写法与新式 `async` 写法的区别，并给出常见转换方法。适合在重构技能、事件 content、模式 start 流程时作为上下文。

相关实现：

- `apps/core/noname/library/element/GameEvent/compilers/StepCompiler.ts`
- `apps/core/noname/library/element/GameEvent/compilers/AsyncCompiler.ts`
- `apps/core/noname/library/element/GameEvent/compilers/ArrayCompiler.ts`
- `apps/core/noname/library/element/gameEvent.ts`

## 总览

`setContent(content)` 支持多种 content 形式：

```js
event.setContent("phaseDraw");
event.setContent(function () {
  "step 0";
  player.draw();
  "step 1";
  player.chooseToDiscard(1, true);
});
event.setContent(async function (event, trigger, player) {
  await player.draw();
  await player.chooseToDiscard(1, true);
});
event.setContent([fn1, fn2]);
```

其中：

- 普通非 async 函数会进入 `StepCompiler`
- async 函数会进入 `AsyncCompiler`
- 函数数组会进入 `ArrayCompiler`

一个很关键的事实是：`async` content 也会被包装成函数数组，只是数组里通常只有一个 async 函数。

```text
async function
  -> AsyncCompiler
  -> ContentCompiler.compile([async function])
  -> ArrayCompiler
```

而 step content 的流程是：

```text
普通 function
  -> StepCompiler 解析 "step 0" / "step 1"
  -> 拆成函数数组
  -> ArrayCompiler
```

所以二者最终都走 `ArrayCompiler`，差别主要在写法和等待方式。

## Step Content 是什么

旧式 step 写法通常这样：

```js
content: function () {
  "step 0";
  player.chooseCard("选择一张牌");

  "step 1";
  if (result.bool) {
    player.discard(result.cards);
  }
}
```

`"step 0"`、`"step 1"` 不是普通注释，而是 `StepCompiler` 识别的分隔标记。

编译器会把它拆成类似：

```js
[
  function step0(event, trigger, player) {
    player.chooseCard("选择一张牌");
  },
  function step1(event, trigger, player) {
    if (result.bool) {
      player.discard(result.cards);
    }
  },
]
```

每一步执行后，`ArrayCompiler` 会自动：

```text
等待当前事件的 next 队列
把子事件 result 写入 event._result
下一步里通过 result 读取 event._result
```

所以 step 写法中，`player.chooseCard()` 后面不需要 `await`。下一步的 `result` 会自然拿到 `chooseCard` 的结果。

## Async Content 是什么

新式 async 写法：

```js
content: async function (event, trigger, player) {
  const result = await player.chooseCard("选择一张牌").forResult();
  if (result.bool) {
    await player.discard(result.cards);
  }
}
```

`async` content 不再依赖 `"step N"` 标签。你需要用 JavaScript 原生控制流表达顺序：

- `await`
- `if`
- `for`
- `while`
- `return`
- `break`
- `continue`
- 局部变量

## 核心区别

| 对比项 | Step Content | Async Content |
| --- | --- | --- |
| 执行分段 | 通过 `"step 0"`、`"step 1"` 分段 | 一个普通 async 函数 |
| 等待子事件 | 每步结束后自动 `waitNext()` | 需要显式 `await` |
| 获取子事件结果 | 下一步直接用 `result` | `const result = await next.forResult()` |
| 跳转 | `event.goto(n)`、`event.redo()` | 用 `if/while/for/return/break/continue` |
| 局部变量 | step 间不自然共享，通常要挂到 `event` | 普通局部变量自然可用 |
| 可读性 | 像状态机 | 像正常异步流程 |
| 调试 | 依赖编译拆分后的代码片段 | 更接近原始代码 |

## 隐式变量差异

StepCompiler 会给每个 step 注入一些变量：

```js
var { step, source, target, targets, card, cards, skill, forced, num, _result: result } = event;
var { _status, lib, game, ui, get, ai } = topVars;
```

因此 step 中常见：

```js
if (result.bool) ...
target.damage();
```

Async 中推荐显式写：

```js
const { target, targets, card, cards, num } = event;
const result = await player.chooseCard().forResult();
```

在角色包或模块文件里，`lib/game/ui/get/ai/_status` 通常已经通过 import 获得：

```js
import { lib, game, ui, get, ai, _status } from "noname";
```

## result 的区别

Step 中的 `result` 不是 `event.result`，而是 `event._result` 的解构别名。

```js
var { _result: result } = event;
```

`ArrayCompiler` 每一步后会更新：

```text
event._result = 当前步骤返回值 ?? 子事件 result ?? 原 event._result
```

所以旧写法：

```js
"step 0";
player.chooseTarget("选择一名角色");

"step 1";
if (result.bool) {
  event.target = result.targets[0];
}
```

转换成 async：

```js
const result = await player.chooseTarget("选择一名角色").forResult();
if (result.bool) {
  event.target = result.targets[0];
}
```

如果你要设置当前事件最终结果，仍然写：

```js
event.result = {
  bool: true,
  cards,
  targets,
};
```

## 等待子事件的区别

Step：

```js
"step 0";
player.draw(2);

"step 1";
player.chooseToDiscard(1, true);

"step 2";
game.log(player, "完成了流程");
```

Async：

```js
await player.draw(2);
await player.chooseToDiscard(1, true);
game.log(player, "完成了流程");
```

注意：在 async 中如果你不写 `await`：

```js
player.draw(2);
player.chooseToDiscard(1, true);
game.log(player, "完成了流程");
```

这些子事件仍可能被加入当前事件的 `next` 队列，并在 async 函数返回后的 `waitNext()` 中执行。但 `game.log` 会先运行，不会等待前面的事件结果。

因此转换时的基本规则是：

```text
旧代码中跨 step 依赖某个子事件完成
  -> async 中必须 await

旧代码中下一步使用 result
  -> async 中使用 await xxx.forResult()
```

## 特殊：改挂到 after 或其他事件队列的事件不要 await

大多数通过 `game.createEvent()` 创建的事件，会被放进当前事件的 `next` 队列；这种事件在 async 中通常可以 `await`。

但项目中存在一类特殊事件：函数调用时会把刚创建的事件从当前事件的 `next` 中移除，然后挂到别的地方，例如：

```js
event.next.remove(next);
evt.after.push(next);
```

或：

```js
event.next.remove(next);
trigger.next.push(next);
```

这类事件的语义是“安排到稍后/别的事件流程中执行”，不是“现在作为当前 content 的子事件执行”。在 async 转换时，不能对这类返回事件直接 `await`，否则会等待一个并不处于当前执行流程的事件，可能卡死，或至少得不到你以为的执行顺序。

### 如何识别

看到以下模式时，就要警惕：

```js
const next = game.createEvent(...);
event.next.remove(next);
someEvent.after.push(next);
return next;
```

```js
const next = game.createEvent(...);
_status.event.next.remove(next);
someEvent.next.push(next);
return next;
```

```js
const next = event.insertAfter(...);
```

这些都说明 `next` 不是当前步骤中应该等待的事件。

### event.insertAfter

`GameEvent#insertAfter(content, map)` 会创建一个事件并放入当前事件的 `after` 队列。

```js
const next = event.insertAfter(content, {
  player,
});
```

它和 `event.insert(...)` 不同：

- `event.insert(...)` 放进当前事件的 `next`，适合当前流程中插入执行
- `event.insertAfter(...)` 放进当前事件的 `after`，要等当前事件主体和 End/After 流程推进到对应位置后才执行

因此：

```js
// 不推荐：这个事件被安排在 after，不属于当前可立即等待的 next 流程
await event.insertAfter(content, { player });
```

应写成：

```js
event.insertAfter(content, { player });
```

如果后续逻辑必须依赖它执行完，通常说明不该用 `insertAfter`；应改用 `event.insert(...)` 或直接 `await` 一个正常创建在当前 `next` 中的事件。

### player.showCharacter

`player.showCharacter(num, log)` 会先立即执行部分同步展示逻辑，然后创建 `showCharacter` 事件。

当当前事件不是 `useSkill` 或 `trigger` 时，它会把 `showCharacter` 从当前 `next` 移除，转移到当前事件或父事件的 `after`：

```js
var next = game.createEvent("showCharacter", false);
...
if (!["useSkill", "trigger"].includes(evt.name)) {
  evt.next.remove(next);
  if (evt.logSkill) {
    evt = evt.getParent();
  }
  evt.after.push(next);
}
return next;
```

所以转换时不要写：

```js
await player.showCharacter(0);
```

应写成：

```js
player.showCharacter(0);
```

它的用途是“安排亮将相关事件在合适的时点结算”，不是让当前 async content 停下来等它。

### player.insertPhase

`player.insertPhase(skill, insert)` 用于插入额外回合。

它会尝试找到当前 `phase` 的父事件或当前事件父事件，把新 `phase` 创建到那个事件的 `next` 中；`insert` 为真时还会调整到队首：

```js
next = game.createEvent("phase", false, evt);
...
if (evt && insert && evt.next.includes(next)) {
  evt.next.remove(next);
  evt.next.unshift(next);
}
```

这个 `phase` 是给 `phaseLoop` 或父级流程执行的，不是当前技能 content 的普通子事件。

不要写：

```js
await player.insertPhase();
```

应写成：

```js
player.insertPhase();
```

如果你在当前技能中等待它，就相当于试图在当前流程里等待一个被插入到父级/回合循环队列中的事件，容易破坏调度顺序或卡住。

### player.changeZhuanhuanji 与 player.logSkill

这两个函数不主要作为可 await 事件使用，但它们内部也会创建延后事件。

`player.changeZhuanhuanji(skill)` 内部会创建：

- `changeZhuanhuanjiBegin`：当前时机
- `changeZhuanhuanji`：移到相关事件的 `after`

`player.logSkill(...)` 内部会创建：

- `logSkillBegin`：当前时机
- `logSkill`：移到相关事件的 `after`

它们本身不返回需要等待的 `GameEvent`。转换 step 时不要试图把这些内部事件拿出来 `await`；按普通同步调用保留即可：

```js
player.changeZhuanhuanji("skillName");
player.logSkill("skillName", targets);
```

### orderingDiscard 内部事件

`cardsGotoOrdering` 和部分 `lose` 到 `ui.ordering` 的流程中，会创建 `orderingDiscard` 事件，然后把它挂到相关事件的 `after`。

典型模式：

```js
const next = game.createEvent("orderingDiscard", false);
event.next.remove(next);
evt.after.push(next);
next.relatedEvent = evt;
next.setContent("orderingDiscard");
```

这类 `orderingDiscard` 是内部清理事件。外层调用仍然可以正常等待：

```js
await game.cardsDiscard(cards);
await player.lose(cards, ui.ordering);
```

但不要把内部创建出来、已经改挂到 `after` 的 `orderingDiscard` 当成当前 content 的子事件来等待。

### 技能代码中的同类手动改挂

项目的具体技能里也能看到类似模式：

```js
event.next.remove(next);
trigger.after.push(next);
```

```js
event.next.remove(next);
trigger.getParent().next.push(next);
```

转换这类 step 代码时，判断原则是：

```text
只要 next 被 remove 出当前事件 next，并 push 到别的事件 next/after
  -> 当前 async content 中不要 await next
  -> 它是被调度给目标事件稍后执行的
```

也就是说，转换时保留“创建并改挂”的副作用即可：

```js
const next = game.createEvent("someLaterEvent", false);
event.next.remove(next);
trigger.after.push(next);
next.setContent(...);
```

不要追加：

```js
await next;
```

## 基础转换规则

### 规则 1：去掉 step 标签

Step：

```js
content: function () {
  "step 0";
  player.draw();

  "step 1";
  player.recover();
}
```

Async：

```js
content: async function (event, trigger, player) {
  await player.draw();
  await player.recover();
}
```

### 规则 2：子事件结果用 forResult

Step：

```js
"step 0";
player.chooseBool("是否摸一张牌？");

"step 1";
if (result.bool) {
  player.draw();
}
```

Async：

```js
const result = await player.chooseBool("是否摸一张牌？").forResult();
if (result.bool) {
  await player.draw();
}
```

### 规则 3：event.goto 转成结构化控制流

Step：

```js
"step 0";
event.count = 0;

"step 1";
player.draw();
event.count++;
if (event.count < 3) {
  event.goto(1);
}
```

Async：

```js
for (let count = 0; count < 3; count++) {
  await player.draw();
}
```

### 规则 4：event.redo 转成循环

Step：

```js
"step 0";
player.judge(card => get.color(card) == "black" ? 1 : -1);

"step 1";
if (result.bool) {
  player.draw();
  event.redo();
}
```

Async：

```js
while (true) {
  const result = await player.judge(card => (get.color(card) == "black" ? 1 : -1)).forResult();
  if (!result.bool) {
    break;
  }
  await player.draw();
}
```

### 规则 5：event.finish 转成 return

Step：

```js
"step 0";
if (!player.countCards("h")) {
  event.finish();
  return;
}
player.chooseToDiscard(1, true);

"step 1";
player.draw();
```

Async：

```js
if (!player.countCards("h")) {
  return;
}
await player.chooseToDiscard(1, true);
await player.draw();
```

如果需要保留事件 finished 状态给外部判断，可以写：

```js
event.finish();
return;
```

### 规则 6：跨 step 变量优先改成本地变量

Step 中跨步骤常把数据挂到 `event`：

```js
"step 0";
event.target = trigger.player;
player.chooseCard("he", true);

"step 1";
event.target.gain(result.cards, player);
```

Async 中可以用局部变量：

```js
const target = trigger.player;
const result = await player.chooseCard("he", true).forResult();
await target.gain(result.cards, player);
```

如果该数据需要给别的事件或后续系统读取，再保留 `event.target`。

## 常见转换例子

### 选择目标后执行效果

Step：

```js
content: function () {
  "step 0";
  player.chooseTarget("选择一名角色", lib.filter.notMe).set("ai", target => {
    return get.attitude(player, target);
  });

  "step 1";
  if (result.bool) {
    result.targets[0].draw();
  }
}
```

Async：

```js
content: async function (event, trigger, player) {
  const result = await player
    .chooseTarget("选择一名角色", lib.filter.notMe)
    .set("ai", target => get.attitude(player, target))
    .forResult();

  if (result.bool) {
    await result.targets[0].draw();
  }
}
```

### cost 转换

Step：

```js
cost: function () {
  "step 0";
  player.chooseToDiscard(get.prompt(event.skill), "h").set("ai", card => {
    return 6 - get.value(card);
  });

  "step 1";
  event.result = result;
}
```

Async：

```js
cost: async function (event, trigger, player) {
  event.result = await player
    .chooseToDiscard(get.prompt(event.skill), "h")
    .set("ai", card => 6 - get.value(card))
    .forResult();
}
```

### 多次循环

Step：

```js
content: function () {
  "step 0";
  event.num = 0;

  "step 1";
  player.chooseBool("是否继续？");

  "step 2";
  if (result.bool) {
    player.draw();
    event.num++;
    if (event.num < 3) {
      event.goto(1);
    }
  }
}
```

Async：

```js
content: async function (event, trigger, player) {
  for (let num = 0; num < 3; num++) {
    const result = await player.chooseBool("是否继续？").forResult();
    if (!result.bool) {
      break;
    }
    await player.draw();
  }
}
```

### 逐个处理目标

Step：

```js
content: function () {
  "step 0";
  event.targets = targets.slice(0);

  "step 1";
  if (!event.targets.length) {
    event.finish();
    return;
  }
  event.current = event.targets.shift();
  event.current.chooseToDiscard(1, true);

  "step 2";
  event.goto(1);
}
```

Async：

```js
content: async function (event, trigger, player) {
  const targets = event.targets.slice(0);
  for (const target of targets) {
    await target.chooseToDiscard(1, true);
  }
}
```

### 判定循环

Step：

```js
content: function () {
  "step 0";
  event.cards = [];
  player.judge(card => (get.color(card) == "black" ? 1 : -1));

  "step 1";
  if (result.bool && result.card) {
    event.cards.push(result.card);
    player.chooseBool("是否再次发动？");
  } else {
    event.goto(3);
  }

  "step 2";
  if (result.bool) {
    event.goto(0);
  }

  "step 3";
  if (event.cards.length) {
    player.gain(event.cards, "gain2");
  }
}
```

Async：

```js
content: async function (event, trigger, player) {
  const cards = [];

  while (true) {
    const judgeResult = await player.judge(card => (get.color(card) == "black" ? 1 : -1)).forResult();
    if (!judgeResult.bool || !judgeResult.card) {
      break;
    }

    cards.push(judgeResult.card);

    const again = await player.chooseBool("是否再次发动？").forResult();
    if (!again.bool) {
      break;
    }
  }

  if (cards.length) {
    await player.gain(cards, "gain2");
  }
}
```

## stepHead 的特殊点

StepCompiler 会把 `"step 0"` 之前的代码保存为 `stepHead`，并注入到每一个拆分后的步骤中。

例如：

```js
content: function () {
  var target = trigger.player;

  "step 0";
  player.chooseCard();

  "step 1";
  target.gain(result.cards, player);
}
```

这里 `var target = trigger.player;` 会出现在每个 step 编译后的函数里。

转换 async 时，通常可以写成：

```js
content: async function (event, trigger, player) {
  const target = trigger.player;
  const result = await player.chooseCard().forResult();
  await target.gain(result.cards, player);
}
```

但要注意：如果 `"step 0"` 前的代码有副作用，旧 step 写法里它可能每一步都会执行。转换时需要确认真实意图：

- 只是声明变量：放到 async 函数开头
- 每一步都要执行：放进循环或对应位置
- 只应执行一次但旧代码放错了：转换时顺手改成只执行一次

## 机械转换思路

对于复杂的 `goto` 状态机，可以先机械翻译，再逐步重构。

机械形式：

```js
content: async function (event, trigger, player) {
  let step = 0;
  while (true) {
    switch (step) {
      case 0: {
        const result = await player.chooseBool("是否继续？").forResult();
        if (result.bool) {
          step = 1;
        } else {
          return;
        }
        break;
      }
      case 1: {
        await player.draw();
        step = 0;
        break;
      }
    }
  }
}
```

不过这只是过渡方案。最终更推荐改成结构化写法：

```js
content: async function (event, trigger, player) {
  while (true) {
    const result = await player.chooseBool("是否继续？").forResult();
    if (!result.bool) {
      break;
    }
    await player.draw();
  }
}
```

## 转换检查清单

转换时逐项检查：

- 每个会创建子事件的调用，后续代码是否依赖它完成；依赖就加 `await`
- 如果事件被 `next.remove(...)` 后挂到 `after` 或别的事件 `next/after`，不要 `await`
- `event.insertAfter(...)`、`player.showCharacter(...)`、`player.insertPhase(...)` 这类调度型调用通常只调用不等待
- 下一 step 使用 `result` 的地方，改成 `const result = await xxx.forResult()`
- `event.goto(n)` 是否能改成 `if/while/for`
- `event.redo()` 是否能改成循环的 `continue`
- `event.finish()` 是否能改成 `return`
- 跨 step 的 `event.xxx` 是否可以改成本地变量
- 需要被外部读取的数据是否仍保留在 `event.xxx`
- `trigger`、`target`、`card` 等隐式变量是否已显式解构或引用
- `cost` 是否正确写入 `event.result`
- `content` 是否保留原来的 `event.result`、`event.cards`、`event.targets` 语义
- 没有结果需求的事件是否仍然需要 `await` 来保证顺序

## 常见坑

### 忘记 await

错误：

```js
player.chooseToDiscard(1, true);
player.draw();
```

这会先创建两个子事件，然后当前 async 函数直接继续/返回。若期望先弃牌再摸牌并让代码等待，应写：

```js
await player.chooseToDiscard(1, true);
await player.draw();
```

### 忘记 forResult

错误：

```js
const result = await player.chooseTarget("选择目标");
if (result.bool) ...
```

`await event` 只等待事件完成，不直接返回 `event.result`。应写：

```js
const result = await player.chooseTarget("选择目标").forResult();
if (result.bool) ...
```

### 把 step 的 result 当成 event.result

Step 中：

```js
if (result.bool) ...
```

这里的 `result` 是上一个子事件的结果。Async 中应改成本地变量：

```js
const result = await next.forResult();
```

只有需要设置当前事件结果时才写：

```js
event.result = result;
```

### 保留 event.goto 但没有必要

Async 写法下，`event.goto()` 大多数时候不再需要。保留它会让代码继续像旧状态机，不利于阅读。优先改成：

- `if`
- `return`
- `while`
- `for`
- `break`
- `continue`

## 推荐风格

推荐：

```js
async content(event, trigger, player) {
  const target = trigger.player;
  const result = await player.chooseCard("he", true).forResult();
  if (!result.bool) {
    return;
  }

  await target.gain(result.cards, player);
  await player.draw();
}
```

不推荐：

```js
async content(event, trigger, player) {
  player.chooseCard("he", true);
  const result = event.result;
  target.gain(result.cards, player);
}
```

## 一句话总结

`step` 写法依赖引擎在每个 `"step N"` 之间自动等待子事件，并把结果塞进 `result`；`async` 写法则把这些隐式行为显式化：用 `await` 等事件，用 `.forResult()` 取结果，用正常 JavaScript 控制流替代 `goto/redo`。转换的核心就是把“跨 step 的隐式等待和 result”改成“局部变量 + await”。
