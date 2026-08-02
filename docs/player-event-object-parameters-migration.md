# 从不定参数迁移到对象参数

本文用于把已有的 `Player` 事件调用迁移为对象参数。对象参数的概念、公共字段和完整接口索引见 [Player 事件的对象参数](./player-event-object-parameters.md)。

迁移的目标是只改变参数表达方式，不改变事件类型、默认值、结算顺序和返回值。

## 一、迁移步骤

### 1. 找到对应参数接口

在 [`Player/type.d.ts`](../apps/core/noname/library/element/Player/type.d.ts) 中查找方法对应的 `EventXxxParams`：

```text
gain          → EventGainParams
chooseTarget  → EventChooseTargetParams
damage        → EventDamageParams
```

不要仅凭旧参数的值猜字段名。例如旧式 `gain` 中的 `"gain2"` 对应 `animate`，而 `"log"` 对应 `log: true`。

### 2. 按参数的实际职责命名

```javascript
// 迁移前：顺序不表达含义
player.gain(cards, source, "give", "bySelf");

// 迁移后
player.gain({
	cards,
	source,
	animate: "give",
	bySelf: true,
});
```

旧式调用允许交换部分参数的顺序：

```javascript
player.gain(cards, "gain2");
player.gain("gain2", cards);
```

二者都迁移为：

```javascript
player.gain({
	cards,
	animate: "gain2",
});
```

### 3. 把标志字符串改成布尔字段

旧解析器用一些特殊字符串开启选项。对象形式应写出对应字段：

```javascript
// 迁移前
player.damage(source, 2, "fire", "nocard", "nohujia");

// 迁移后
player.damage({
	source,
	num: 2,
	nature: "fire",
	nocard: true,
	nohujia: true,
});
```

不能把标志字符串原样放进对象，也不要写成不属于接口的字段：

```javascript
// 错误
player.damage({
	source,
	flags: ["nocard", "nohujia"],
});
```

### 4. 把单数值包装为复数字段

旧解析器通常接受单张牌和单个目标，对象类型通常要求数组：

```javascript
// 迁移前
player.gain(card, "gain2");
player.useCard({ name: "sha" }, target);

// 迁移后
player.gain({
	cards: [card],
	animate: "gain2",
});

player.useCard({
	card: { name: "sha" },
	targets: [target],
});
```

不要把真实的 `Card`、`Player` 或 `Dialog` 当成参数对象；它们是字段值。

### 5. 合并能够静态确定的 `.set()`

```javascript
// 迁移前
const next = player.chooseTarget("选择一名其他角色", true, lib.filter.notMe).set("ai", target => -get.attitude(player, target));

// 迁移后
const next = player.chooseTarget({
	prompt: "选择一名其他角色",
	forced: true,
	filterTarget: lib.filter.notMe,
	ai: target => -get.attitude(player, target),
});
```

以下情况可以继续使用 `.set()`：

- 属性需要在事件创建后按条件修改；
- 调用方需要先保存返回的事件；
- 属性是业务自定义数据，尚未包含在参数接口中。

### 6. 保留没有歧义的数字快捷形式

以下调用已被明确纳入方法类型，不必为了迁移而改写：

```javascript
player.draw(2);
player.damage(2);
player.recover(1);
player.loseMaxHp(1);
player.gainMaxHp(1);
```

当调用只有一个数字参数时，其含义是明确的。需要加入其他选项时，再改为对象：

```javascript
await target.damage({
	num: 2,
	source: player,
	nature: "fire",
});
```

## 二、常见迁移对照

### `gain`

```javascript
// 迁移前
await target.gain(cards, player, "giveAuto", "bySelf", "log");

// 迁移后
await target.gain({
	cards,
	source: player,
	animate: "giveAuto",
	bySelf: true,
	log: true,
});
```

| 旧参数                                 | 对象字段                |
| -------------------------------------- | ----------------------- |
| `Card`                                 | `cards: [card]`         |
| `Card[]`                               | `cards`                 |
| `Player`                               | `source`                |
| `"draw"`、`"gain2"`、`"give"` 等动画名 | `animate`               |
| `"log"`                                | `log: true`             |
| `"fromStorage"`                        | `fromStorage: true`     |
| 公共区域的来源名                       | `areaNames: [areaName]` |
| `"bySelf"`                             | `bySelf: true`          |
| `boolean`                              | `delay`                 |

若有多项 `gaintag`，直接写入 `gaintag: string[]`，不再依靠创建事件后的隐式属性赋值。

### `chooseTarget`

```javascript
// 迁移前
const result = await player
	.chooseTarget([1, 2], "选择至多两名其他角色", true, (_card, player, target) => target !== player)
	.set("ai", target => -get.attitude(player, target))
	.forResult();

// 迁移后
const result = await player
	.chooseTarget({
		selectTarget: [1, 2],
		prompt: "选择至多两名其他角色",
		forced: true,
		filterTarget: (_card, player, target) => target !== player,
		ai: target => -get.attitude(player, target),
	})
	.forResult();
```

旧式调用中的第一个函数会被当作 `filterTarget`，第二个函数会被当作 `ai`。迁移后应直接使用字段名，不再依赖函数出现的先后顺序。

### `chooseCard`

```javascript
// 迁移前
const result = await player
	.chooseCard(2, true, "he", "选择两张可重铸的牌", (card, player) => player.canRecast(card))
	.set("ai", card => 6 - get.value(card))
	.forResult();

// 迁移后
const result = await player
	.chooseCard({
		selectCard: 2,
		forced: true,
		position: "he",
		prompt: "选择两张可重铸的牌",
		filterCard: (card, player) => player.canRecast(card),
		ai: card => 6 - get.value(card),
	})
	.forResult();
```

`chooseToDiscard`、`chooseToGive`、`chooseToRespond` 等选牌方法使用相同的公共字段，但仍应检查各自的 `EventXxxParams`，因为它们还有不同的专用字段。

`filterCard` 还可以使用 `CardFilter`，直接按牌名、类型、子类型、颜色、花色或点数条件筛选：

```javascript
const result = await player
	.chooseCard({
		position: "he",
		prompt: "选择一张红色基本牌",
		filterCard: {
			type: "basic",
			color: "red",
		},
	})
	.forResult();
```

旧式调用中作为筛选条件传入的普通对象，可以迁移到 `filterCard` 字段；方法会通过 `get.filter` 将它转换为函数。动态条件仍使用函数形式。

### `chooseCardTarget`

`chooseCardTarget` 本身就是按配置对象工作的，迁移时重点是把随后设置的公共字段收进对象：

```javascript
const result = await player
	.chooseCardTarget({
		prompt: "弃置一张牌并选择一名其他角色",
		position: "he",
		filterCard: lib.filter.cardDiscardable,
		selectCard: 1,
		filterTarget: (_card, player, target) => target !== player,
		selectTarget: 1,
		ai1: card => 6 - get.value(card),
		ai2: target => -get.attitude(player, target),
	})
	.forResult();
```

同时存在牌和目标评分时使用 `ai1`、`ai2`，不要写单独的 `ai`。

### `draw` 与 `drawTo`

```javascript
// 迁移前
await player.draw(2, source, "bottom", "visible", "nodelay");

// 迁移后
await player.draw({
	num: 2,
	source,
	bottom: true,
	visible: true,
	nodelay: true,
});
```

`drawTo` 的目标手牌数仍是第一个位置参数：

```javascript
// 迁移前
await player.drawTo(5, ["bottom", "visible"]);

// 迁移后
await player.drawTo(5, {
	bottom: true,
	visible: true,
});
```

### `useCard`

```javascript
// 迁移前
await player.useCard({ name: "sha", isCard: true }, cards, target, "example_skill", false);

// 迁移后
await player.useCard({
	card: { name: "sha", isCard: true },
	cards,
	targets: [target],
	skill: "example_skill",
	addCount: false,
});
```

| 旧参数                          | 对象字段            |
| ------------------------------- | ------------------- |
| `Card` 或带 `name` 的虚拟牌对象 | `card`              |
| `Card[]`                        | `cards`             |
| `Player`                        | `targets: [target]` |
| `Player[]`                      | `targets`           |
| 一般字符串                      | `skill`             |
| `"noai"`                        | `noai: true`        |
| `"nowuxie"`                     | `nowuxie: true`     |
| `boolean`                       | `addCount`          |

最容易出错的写法是把虚拟牌对象误认为参数对象：

```javascript
// 仍是旧式调用，因为还有第二个实参
player.useCard({ name: "sha" }, target);

// 明确的对象参数
player.useCard({
	card: { name: "sha" },
	targets: [target],
});
```

### `damage` 与 `recover`

```javascript
// 迁移前
await target.damage(cards, card, 2, source, "fire", "notrigger", "nohujia");

// 迁移后
await target.damage({
	cards,
	card,
	num: 2,
	source,
	nature: "fire",
	notrigger: true,
	nohujia: true,
});

// 迁移前
await target.recover(card, cards, source, 1, "nocard");

// 迁移后
await target.recover({
	card,
	cards,
	source,
	num: 1,
	nocard: true,
});
```

注意：`nocard` 和 `nosource` 会阻止方法从当前事件继承牌或来源。即使调用时没有显式的 `card` 或 `source`，迁移时也要保留这些字段，才能保持旧行为。

`recoverTo` 与 `drawTo` 类似，目标体力值仍是第一个位置参数：

```javascript
await target.recoverTo(3, {
	source,
	nocard: true,
});
```

### `discard`、`loseToDiscardpile` 与 `lose`

```javascript
// 迁移前
await player.discard(cards, source);

// 迁移后
await player.discard({
	cards,
	discarder: source,
});

// 迁移前
await player.loseToDiscardpile(cards, source, "insert", "blank", false);

// 迁移后
await player.loseToDiscardpile({
	cards,
	source,
	insert_card: true,
	blank: true,
	animate: false,
});

// 迁移前
await player.lose(cards, source, ui.discardPile, "visible", "insert");

// 迁移后
await player.lose({
	cards,
	source,
	position: ui.discardPile,
	visible: true,
	insert_card: true,
});
```

`discard` 的行为发起者字段名是 `discarder`；`lose` 与 `loseToDiscardpile` 使用 `source`。不要机械地把所有 `Player` 参数都命名为同一个字段。

## 三、常见标志字符串对照

同一个字符串在不同方法中可能有不同含义。迁移时先确定方法，再查对应接口和实现。

| 方法                        | 旧标志             | 对象字段               |
| --------------------------- | ------------------ | ---------------------- |
| `chooseToUse`               | `"chooseonly"`     | `chooseonly: true`     |
| `chooseToRespond`           | `"nosource"`       | `nosource: true`       |
| `chooseCard`                | `"glow_result"`    | `glow_result: true`    |
| 多个选牌方法                | `"allowChooseAll"` | `allowChooseAll: true` |
| `chooseButton`              | `"complexSelect"`  | `complexSelect: true`  |
| `chooseButton`              | `"direct"`         | `direct: true`         |
| `chooseUseTarget`           | `"nopopup"`        | `nopopup: true`        |
| `chooseUseTarget`           | `"noanimate"`      | `animate: false`       |
| `chooseUseTarget`           | `"nothrow"`        | `throw: false`         |
| `chooseUseTarget`           | `"nodistance"`     | `nodistance: true`     |
| `chooseUseTarget`           | `"noTargetDelay"`  | `noTargetDelay: true`  |
| `chooseUseTarget`           | `"nodelayx"`       | `nodelayx: true`       |
| `draw`                      | `"visible"`        | `visible: true`        |
| `draw`                      | `"bottom"`         | `bottom: true`         |
| `draw`                      | `"nodelay"`        | `nodelay: true`        |
| `gain`、`addToExpansion`    | `"log"`            | `log: true`            |
| `gain`、`addToExpansion`    | `"fromStorage"`    | `fromStorage: true`    |
| `gain`、`addToExpansion`    | `"bySelf"`         | `bySelf: true`         |
| `loseToDiscardpile`         | `"blank"`          | `blank: true`          |
| `loseToDiscardpile`、`lose` | `"insert"`         | `insert_card: true`    |
| `lose`                      | `"visible"`        | `visible: true`        |
| `damage`                    | `"notrigger"`      | `notrigger: true`      |
| `damage`、`recover`         | `"nocard"`         | `nocard: true`         |
| `damage`、`recover`         | `"nosource"`       | `nosource: true`       |
| `damage`                    | `"nohujia"`        | `nohujia: true`        |
| `damage`                    | `"unreal"`         | `unreal: true`         |
| `respond`                   | `"highlight"`      | `highlight: true`      |
| `respond`                   | `"noOrdering"`     | `noOrdering: true`     |
| `useCard`                   | `"noai"`           | `noai: true`           |
| `useCard`                   | `"nowuxie"`        | `nowuxie: true`        |

不是所有字符串都是标志。例如 `gain` 中的其他字符串通常表示 `animate`，`useCard` 中的其他字符串通常表示 `skill`，`chooseTarget` 中的字符串通常表示提示文本。

## 四、不能直接合并到唯一对象的方法

以下方法保留一个必要的位置参数：

| 方法                          | 保留的位置参数        | 对象参数                  |
| ----------------------------- | --------------------- | ------------------------- |
| `chooseSkill(target, params)` | 被查看技能的 `target` | `EventChooseSkillParams`  |
| `discoverCard(list, params)`  | 候选牌名 `list`       | `EventDiscoverCardParams` |
| `drawTo(num, params)`         | 目标手牌数 `num`      | `EventDrawToParams`       |
| `recoverTo(num, params)`      | 目标体力值 `num`      | `EventRecoverToParams`    |

迁移时不要把保留参数塞进对象：

```javascript
// 错误
player.drawTo({
	num: 5,
	bottom: true,
});

// 正确
player.drawTo(5, {
	bottom: true,
});
```

## 五、兼容策略

旧式不定参数目前仍受支持。迁移时建议：

1. 新代码优先使用对象参数。
2. 修改既有技能时，以单个调用为单位迁移并复核行为。
3. 不为追求形式统一而一次性改动无关文件。
4. 对尚未定义对象接口的方法继续使用原调用方式。

`draw(num)`、`damage(num)`、`recover(num)`、`loseMaxHp(num)` 和 `gainMaxHp(num)` 是受类型支持的快捷形式，不属于需要消除的含糊不定参数。

如果扩展需要兼容尚未支持对象参数的旧版本，应继续使用旧式调用，或明确提高扩展所需的最低本体版本；不要通过捕获异常后重试两种调用来兼容，因为事件创建通常已经产生副作用。

## 六、迁移后的检查清单

每次迁移至少检查以下项目：

- 调用现在只传一个参数对象，特殊的四个方法除外；
- `Card` 已改为 `cards: [card]`，单个 `Player` 目标已改为 `targets: [target]`；
- 特殊字符串已改为正确的具名字段；
- 两个筛选或评分函数没有因旧式出现顺序而互换；
- `nocard`、`nosource`、`addCount: false` 等会改变默认行为的值没有遗漏；
- 原有的 `await`、`forResult()`、返回事件赋值和后续 `.set()` 仍然保留；
- 必填字段满足对应的 `EventXxxParams`；
- 用实际技能路径测试一次取消、确定和 AI 自动选择等相关分支。

迁移前后返回的仍是相同种类的 `GameEvent`。如果只改了参数表达方式，事件触发时机和结果读取代码不应发生变化。
