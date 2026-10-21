# Step Content 转 Async Content(s) 指南

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

### 迁移目标：Async Content 或 Array Content

迁移时按保持原有调度语义所需的等待方式选择：

- 能通过明确的子事件 `await` 保持执行顺序，无需在函数内部调用 `await event.waitNext()`：转换为单个 Async Content。
- 必须在函数内部调用 `await event.waitNext()`，等待当前事件的 `next` 队列整体结算后才能继续：转换为 Array Content，数组各项使用 async 函数（也称 async contents）。在需要等待队列的位置划分函数，由 `ArrayCompiler` 在每段函数结束后自动调用 `waitNext()`。

这里判断的是迁移后的实际等待需求，不是旧代码中是否出现了 `waitNext()`；单个 async 函数返回后由编译器执行的 `waitNext()` 也不属于函数内部的等待。数组分段只等待当前事件的 `next` 队列，不会让改挂到 `after` 或其他事件队列的事件提前执行。

后文的单函数示例适用于第一种情况。两种形式都需要核对原 step 边界的终止检查；无需内部 `waitNext()` 并不意味着合并后必然行为等价。

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

或者单纯的:

```js
content: function () {
  player.draw();
}
```

`"step 0"`、`"step 1"` 不是普通注释，而是 `StepCompiler` 识别的分隔标记。对于不存在`"step X"`的普通function，应视为Step Content，因为这些函数仍然会经过`StepCompiler`处理，并将函数内部视为存在`"step 0"`。

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

`await next` 等待事件完成，但不直接返回 `next.result`；需要结果时使用 `.forResult()`。

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

### 原 step 边界的终止检查

`ArrayCompiler` 在每个 step 执行前通过 `isPrevented()` 检查事件拥有者是否死亡、离场或被移除；死亡、离场检查分别受 `forceDie`、`includeOut` 控制。单个 async 函数内部每次 `await` 后不会自动重做这些检查。例如子事件导致技能拥有者死亡时，原先后续 step 可能停止，合并后的代码却仍会继续。

迁移时逐个核对原 step 边界的终止条件，需要时保留对应检查和终止行为，不能仅靠添加 `await` 保证等价；特殊事件（如 `phaseLoop`）应按实现单独判断。

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

`event.redo()` 只重复当前 step，不会自动回到上一个 step。循环体应对应被重复的步骤。

Step：

```js
"step 0";
event.count = 0;

"step 1";
player.draw();
event.count++;
if (event.count < 3) {
  event.redo();
}
```

Async：

```js
let count = 0;
while (count < 3) {
  await player.draw();
  count++;
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

  "step 1";
  player.judge(card => (get.color(card) == "black" ? 1 : -1));

  "step 2";
  if (result.bool && result.card) {
    event.cards.push(result.card);
    player.chooseBool("是否再次发动？");
  } else {
    event.goto(4);
  }

  "step 3";
  if (result.bool) {
    event.goto(1);
  }

  "step 4";
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

`stepHead` 会在每个 step 重新执行。只有确认声明的取值跨 step 不变且没有副作用时，才可像上例一样移到 async 函数开头；否则应在原 step 对应的位置重新计算或执行，保留原执行次数与时机。

疑似旧 Bug 应单独标记，不在迁移中顺手修复。

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

- 是否按等待需求选择了单个 Async Content 或 Array Content；需要内部 `event.waitNext()` 的流程应改为数组分段
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
- 原 step 边界的死亡、离场、移除检查及相应终止行为是否仍然等价
