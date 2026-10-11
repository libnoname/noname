# 从 `direct` 迁移到 `cost`

本文说明如何把常见的“`direct: true`，然后在 `content` 中询问是否发动”的触发技迁移到 `cost`。

本文只讨论 async 技能写法，也只覆盖已有大量用例、行为明确的选择事件。遇到本文未列出的选择事件或特殊流程时，不要机械迁移。

## 为什么要迁移

过去，涉及选牌、选目标等特殊选择的触发技通常使用 `direct: true` 跳过引擎的发动询问，再在 `content` 中完成以下全部工作：

1. 询问玩家是否发动技能并作出选择；
2. 玩家确认后手动调用 `player.logSkill(...)`；
3. 支付代价并执行技能效果。

这种写法混合了“是否发动、选择什么”和“技能发动后的效果”，引擎也无法准确判断技能何时真正发动。

`cost` 将两部分分开：

- `cost` 负责询问玩家，并记录发动技能所需的选择结果；
- `content` 负责在技能确认发动后支付代价、改变游戏状态和执行效果。

技能只有在 `cost` 返回的结果中 `bool` 为真时才会发动。此时，引擎会先展示并记录技能发动，再执行 `content`。

## 先判断是否适合迁移

只有同时满足以下条件时，才按本文迁移：

- 这是一个非强制触发技；
- `direct` 的主要用途是取消引擎默认的 `chooseBool`，以便改用选目标、选牌、选项等常规选择；
- 玩家取消选择时，技能不应发动；
- 确认选择前不需要记录技能发动；
- 选择流程和技能效果可以清楚地拆分。

本文覆盖的选择事件白名单如下：

| 类型                     | 选择事件                           | 结果的常用字段                      |
| ------------------------ | ---------------------------------- | ----------------------------------- |
| 确认                     | `chooseBool`                       | `bool`                              |
| 选择目标                 | `chooseTarget`                     | `bool`、`targets`                   |
| 选择自己的牌             | `chooseCard`                       | `bool`、`cards`                     |
| 选择按钮                 | `chooseButton`                     | `bool`、`links`                     |
| 选择选项                 | `chooseControl`                    | `control`、`index`                  |
| 同时选择牌和目标         | `chooseCardTarget`                 | `bool`、`cards`、`targets`          |
| 同时选择按钮和目标       | `chooseButtonTarget`               | `bool`、`links`、`targets`          |
| 选择其他角色的牌         | `choosePlayerCard`                 | `bool`、`links`，通常整理为 `cards` |
| 只选择待弃置的牌         | `chooseToDiscard` + `chooseonly`   | `bool`、`cards`                     |
| 只选择其他角色待弃置的牌 | `discardPlayerCard` + `chooseonly` | `bool`、`cards` / `links`           |
| 只选择待获得的牌         | `gainPlayerCard` + `chooseonly`    | `bool`、`cards` / `links`           |

`chooseCardButton` 是 `chooseButton` 的便捷封装，`chooseControlList` 是 `chooseControl` 的便捷封装。它们可以按照对应的基础选择事件处理：前者读取 `links`，后者读取 `control` 或 `index`。

以下情况不在本文的迁移范围内：

- `chooseToUse`、`chooseToRespond`、`chooseUseTarget`；
- `chooseToCompare`；
- 强制技中的必选流程；
- 选择过程本身已经完成技能的主要效果；
- `logSkill` 的对象、参数或时机有特殊要求；
- 需要在玩家确认选择前改变游戏状态；
- 本文白名单之外的选择事件。

这些技能应保留原有 `direct` 流程，或在完整分析事件、日志和联机行为后单独处理。

### 只需要普通确认框时不必使用 `cost`

如果原技能的 `direct` 只用于在 `content` 开头调用一次 `chooseBool`，并且不涉及其他选择或分支，优先直接删除 `direct`，使用触发技已有的 `prompt`、`prompt2` 和 `check`。没有 `direct`、`forced` 和 `cost` 的普通触发技，引擎本来就会创建发动确认框。

```js
example: {
	trigger: { player: "phaseZhunbeiBegin" },
	prompt2: "摸一张牌",
	check(event, player) {
		return player.countCards("h") < player.getHandcardLimit();
	},
	async content(event, trigger, player) {
		await player.draw();
	},
},
```

只有普通确认框不足以表达选择时，才需要增加 `cost`。`chooseBool` 仍在白名单中，用于带有条件分支、动态准备数据或其他不能由技能级确认框直接表达的常规确认流程。

## 引擎如何处理 `cost`

非强制触发技配置了 `cost` 后，引擎大致按以下顺序处理：

```text
触发技能
  -> 创建名为 `${skill}_cost` 的 cost 事件
  -> 执行 cost
  -> 检查 cost 事件的 event.result.bool
     -> 不为 true：取消发动，不执行 content
     -> 为 true：记录技能发动，并创建技能 content 事件
  -> 将规定的选择结果传给 content 事件
  -> 执行 content
```

必须给 `cost` 的 `event.result` 赋值。`return result` 不会代替该赋值：

```js
async cost(event, trigger, player) {
	// 正确
	event.result = await player.chooseTarget(...).forResult();
}
```

引擎只会自动把以下字段传给 `content` 事件：

| `cost` 的结果            | `content` 中读取  |
| ------------------------ | ----------------- |
| `event.result.targets`   | `event.targets`   |
| `event.result.cards`     | `event.cards`     |
| `event.result.cost_data` | `event.cost_data` |

其中 `targets` 和 `cards` 会复制为新数组。其他字段不会自动传递。例如 `links`、`control`、`index` 和自定义计算结果需要整理到 `cost_data`，或者转换成 `cards`、`targets`。

虽然类型声明曾将 `cost_data` 写成对象，现有技能也会用它传递字符串、数字、数组、卡牌或其他数据。应把它理解为由技能自行约定的透传数据。

## 标准迁移步骤

迁移一个普通技能时：

1. 删除 `direct: true`；
2. 新增 `async cost(event, trigger, player)`；
3. 把决定是否发动以及选择牌、目标、选项的代码移入 `cost`；
4. 将最终结果赋给 `event.result`；
5. 把实际支付代价和执行效果的代码保留在 `content`；
6. 在 `content` 中改从 `event.cards`、`event.targets` 或 `event.cost_data` 读取选择结果；
7. 删除普通的手写 `player.logSkill(...)`。

注意：`direct` 的处理优先于 `cost`。如果迁移后仍保留 `direct: true`，引擎不会执行 `cost`。

技能级的 `prompt`、`prompt2` 和 `check` 主要服务于引擎默认创建的 `chooseBool`。改用 `cost` 后，应在具体的选择事件中设置提示和 AI，不能假定这些技能属性会自动应用到 `chooseTarget`、`chooseCard` 等选择事件。

## 选择目标

迁移前：

```js
example: {
	trigger: { player: "phaseZhunbeiBegin" },
	direct: true,
	async content(event, trigger, player) {
		const result = await player
			.chooseTarget(get.prompt2(event.name), lib.filter.notMe)
			.set("ai", target => get.attitude(player, target))
			.forResult();
		if (!result.bool) {
			return;
		}

		const target = result.targets[0];
		player.logSkill(event.name, target);
		await target.draw();
	},
},
```

迁移后：

```js
example: {
	trigger: { player: "phaseZhunbeiBegin" },
	async cost(event, trigger, player) {
		event.result = await player
			.chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
			.set("ai", target => get.attitude(player, target))
			.forResult();
	},
	async content(event, trigger, player) {
		const target = event.targets[0];
		await target.draw();
	},
},
```

不再需要手动判断是否取消或调用 `logSkill`。如果玩家取消，`content` 根本不会执行；如果玩家确认，引擎会使用 `result.targets` 记录指向目标的日志和指示线。

## 同时选择牌和目标

`chooseCardTarget` 的 `cards` 和 `targets` 都会自动传递：

```js
async cost(event, trigger, player) {
	event.result = await player
		.chooseCardTarget({
			prompt: get.prompt2(event.skill),
			position: "he",
			filterCard: lib.filter.cardDiscardable,
			filterTarget: lib.filter.notMe,
			ai1: card => 6 - get.value(card),
			ai2: target => get.attitude(player, target),
		})
		.forResult();
},
async content(event, trigger, player) {
	const card = event.cards[0];
	const target = event.targets[0];

	await player.discard(card);
	await target.draw();
},
```

`chooseButtonTarget` 的目标会自动传递，但按钮结果位于 `links`，需要通过 `cost_data` 传递：

```js
async cost(event, trigger, player) {
	const result = await player.chooseButtonTarget(...).forResult();
	event.result = {
		bool: result.bool,
		targets: result.targets,
		cost_data: result.links,
	};
},
async content(event, trigger, player) {
	const target = event.targets[0];
	const link = event.cost_data[0];
	// 使用 target 和 link 执行技能效果
},
```

## 传递按钮或选项结果

`links`、`control` 和 `index` 不会自动传给 `content`，应显式放入 `cost_data`。

选择按钮：

```js
async cost(event, trigger, player) {
	const result = await player.chooseButton(...).forResult();
	event.result = {
		bool: result.bool,
		cost_data: result.links,
	};
},
async content(event, trigger, player) {
	const link = event.cost_data[0];
	// 根据 link 执行效果
},
```

选择选项：

```js
async cost(event, trigger, player) {
	const result = await player
		.chooseControl("摸牌", "回复体力", "cancel2")
		.set("prompt", get.prompt2(event.skill))
		.forResult();

	event.result = {
		bool: result.control !== "cancel2",
		cost_data: result.control,
	};
},
async content(event, trigger, player) {
	if (event.cost_data === "摸牌") {
		await player.draw();
	} else {
		await player.recover();
	}
},
```

`chooseControl` 的结果会被引擎补充为是否取消，但显式设置 `bool` 更容易读懂，也避免自定义取消项产生歧义。

使用 `chooseCardButton` 时按 `chooseButton` 处理 `links`；使用 `chooseControlList` 时按 `chooseControl` 处理 `control` 或 `index`。

## 使用 `chooseonly` 延后实际操作

`cost` 应当完成选择，但不应在引擎记录技能发动前改变游戏状态。

`chooseToDiscard` 默认会在选择成功后立即弃置牌。如果直接放进 `cost`，弃牌会发生在技能日志之前。迁移时应设置 `chooseonly: true`，让它只返回所选牌，再在 `content` 中弃置：

```js
async cost(event, trigger, player) {
	event.result = await player
		.chooseToDiscard({
			prompt: get.prompt2(event.skill),
			position: "he",
			chooseonly: true,
			ai: card => 6 - get.value(card),
		})
		.forResult();
},
async content(event, trigger, player) {
	await player.discard(event.cards);
	// 执行后续效果
},
```

同样的规则适用于 `discardPlayerCard`：

```js
async cost(event, trigger, player) {
	event.result = await player
		.discardPlayerCard({
			target: trigger.player,
			position: "he",
			prompt: get.prompt2(event.skill),
			chooseonly: true,
		})
		.forResult();
},
async content(event, trigger, player) {
	await trigger.player.discard({
		cards: event.cards,
		discarder: player,
	});
	// 执行后续效果
},
```

以及 `gainPlayerCard`：

```js
async cost(event, trigger, player) {
	const result = await player
		.gainPlayerCard({
			target: trigger.player,
			position: "he",
			prompt: get.prompt2(event.skill),
			chooseonly: true,
		})
		.forResult();

	event.result = {
		bool: result.bool,
		cards: result.links,
	};
},
async content(event, trigger, player) {
	await player.gain(event.cards, trigger.player, "giveAuto");
	// 执行后续效果
},
```

这里将 `links` 整理成了 `cards`，使 `content` 可以统一从 `event.cards` 读取。

`chooseonly` 只阻止选择事件执行其默认操作。迁移者仍需在 `content` 中显式完成弃置、获得等操作，否则技能只会选中牌而不会移动它们。

## 手动构造 `event.result`

并非每个触发时机都必须询问玩家。有些技能在不同分支中，一部分需要选择，另一部分可以直接发动：

```js
async cost(event, trigger, player) {
	if (trigger.name === "specialEvent") {
		event.result = {
			bool: true,
			cost_data: "automatic",
		};
		return;
	}

	const result = await player.chooseTarget(...).forResult();
	event.result = {
		bool: result.bool,
		targets: result.targets,
		cost_data: "selectedTarget",
	};
},
```

所有可能结束 `cost` 的分支都应产生明确结果。未设置 `event.result` 与设置 `{ bool: false }` 一样，都不会执行 `content`，但显式结果通常更容易维护。

## 日志与目标

普通迁移中，不要在 `cost` 或 `content` 中保留原来的 `player.logSkill(...)`。当 `event.result.bool` 为真时，引擎会自动记录技能发动。

日志目标按以下优先级确定：

1. `event.result.targets` 中非空的目标；
2. 技能的 `logTarget`。

如果玩家的选择不是技能效果目标，但日志需要指向某个固定角色，可以配置 `logTarget`：

```js
logTarget: "player",
```

也可以在结果中补充目标：

```js
event.result = await player.chooseToDiscard(...).forResult();
event.result.targets = [trigger.player];
```

如果原技能有特殊日志内容、特殊日志时机、由另一个选择事件负责记录技能，或需要抑制重复弹框，则不属于本文的普通迁移范围，不应仅靠添加 `popup: false` 或继续手写 `logSkill` 强行迁移。

## `event.skill`、`event.name` 与隐藏技能

在 `cost` 中：

- `event.skill` 是原技能名；
- `event.name` 是 `${skill}_cost`。

因此，提示、读取技能配置以及隐藏技能标记应优先使用 `event.skill`：

```js
async cost(event, trigger, player) {
	event.result = await player
		.chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
		.setHiddenSkill(event.skill)
		.forResult();
},
```

不要假定 `cost` 中的 `event.name` 就是技能名，也不要依赖手动截掉 `_cost` 来恢复技能名。

在 `content` 中，`event.name` 是技能事件名。引擎创建该事件时不会像创建 `cost` 事件一样设置 `event.skill`，因此不要假定 `content` 中也能读取 `event.skill`。

## `forced`、`direct` 与 `frequent`

- `direct: true` 会使引擎直接进入 `content`，所以不能与待执行的 `cost` 并存；
- `forced: true` 会使引擎直接确认发动，同样不会执行 `cost`；
- `frequent` 不会跳过 `cost`。如果 `cost` 使用 `chooseBool`，并希望保留“自动发动”设置，需要给该选择事件设置 `.set("frequentSkill", event.skill)`。

例如：

```js
async cost(event, trigger, player) {
	event.result = await player
		.chooseBool(get.prompt2(event.skill))
		.set("frequentSkill", event.skill)
		.forResult();
},
```

不要为了让 `cost` 中的选择不可取消而给整个技能添加 `forced: true`。如果技能本身是可选的，但确认发动后某个后续步骤必须执行，应让初次选择保持可取消，并在 `content` 中把后续事件设为强制。

## 迁移检查清单

提交迁移前逐项检查：

- 已删除 `direct: true`；
- 技能不是 `forced: true`；
- 使用的选择事件位于本文白名单中；
- `cost` 的所有结束路径都会正确设置或有意不设置 `event.result`；
- 成功结果具有 `bool: true`；
- `cards` 和 `targets` 直接使用引擎自动传递；
- `links`、`control`、`index` 及其他数据已整理到 `cost_data`；
- 会立即弃置或获得牌的选择事件设置了 `chooseonly: true`；
- `content` 补做了被 `chooseonly` 延后的实际操作；
- 普通的手写 `player.logSkill(...)` 已删除；
- `cost` 中使用 `event.skill`，没有误把 `${skill}_cost` 当成技能名；
- 选择事件自身具有正确的提示和 AI，没有错误依赖技能级 `prompt`、`prompt2` 或 `check`；
- 玩家取消选择时不会支付代价、记录技能或执行效果；
- 玩家确认选择时，日志先于代价和技能效果出现；
- 技能的 AI、隐藏技能提示、联机选择和目标指示线仍符合预期。

如果其中任一项无法确定，应停止机械迁移，保留原有 `direct` 写法并单独分析。
