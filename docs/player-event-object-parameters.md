# Player 事件的对象参数

`Player` 上的大多数事件方法同时兼容两种传参方式：

```javascript
// 旧式不定参数
player.gain(cards, "gain2");
player.gain("gain2", cards);

// 对象参数（推荐）
player.gain({
	cards,
	animate: "gain2",
});
```

旧式调用根据每个参数的运行时类型推断用途，所以部分参数可以交换顺序。对象参数则直接写明每个值的含义，阅读、补全、检查和后续修改都更容易。

本文介绍对象参数本身。已有代码如何改写，请继续阅读[从不定参数迁移到对象参数](./player-event-object-parameters-migration.md)。

## 一、基本规则

### 1. 传入一个普通对象

对绝大多数支持该形式的方法，对象参数必须是唯一的实参：

```javascript
player.gain({
	cards,
	source,
	animate: "give",
	log: true,
});
```

以下写法不是“对象参数 + 额外参数”，而会回到旧式不定参数解析：

```javascript
// 错误：不要混用两种形式
player.gain({ cards }, "gain2");
```

少数常用的单数值调用是明确保留的快捷形式：

```javascript
player.draw(2);
player.damage(2);
player.recover(1);
player.loseMaxHp(1);
player.gainMaxHp(1);
```

只需表达这个数值时可以继续使用快捷形式；需要设置来源、属性或其他选项时，再使用参数对象。

这里的“普通对象”还要求它不是引擎能够识别的 `Card`、`Player`、`Dialog` 等游戏对象。以 `useCard` 为例：

```javascript
// 旧式调用：第一个对象表示一张虚拟牌
player.useCard({ name: "sha" }, target);

// 对象参数：card 和 targets 是具名字段
player.useCard({
	card: { name: "sha" },
	targets: [target],
});
```

### 2. 字段名就是事件属性名

对象中的字段会用于初始化该方法创建的 `GameEvent`。例如：

```javascript
const next = player.damage({
	source,
	num: 2,
	nature: "fire",
	nohujia: true,
});
```

创建的伤害事件会具有对应的 `source`、`num`、`nature` 和 `nohujia` 属性。方法的返回值没有变化，仍然是 `GameEvent`，所以可以继续使用 `await`、`forResult()` 或事件方法：

```javascript
const result = await player
	.chooseTarget({
		prompt: "选择一名其他角色",
		filterTarget: (_card, player, target) => target !== player,
		ai: target => -get.attitude(player, target),
	})
	.forResult();
```

对象参数只负责创建和初始化事件，不会把调用变成普通同步函数。事件的等待与结果读取方式参见[游戏事件的外部交互](./game-event/interaction.md)。

### 3. 以类型声明为参数清单

对象参数的类型定义在 [`Player/type.d.ts`](../apps/core/noname/library/element/Player/type.d.ts) 中。接口通常按以下规则命名：

```text
player.chooseTarget(params)
       ↓
EventChooseTargetParams
```

编辑器能够据此补全字段并检查值的类型。接口中的必填字段必须显式提供；可选字段省略后，由方法使用默认值或当前事件上下文补充。

## 二、选择事件的公共参数

许多 `choose*` 方法复用下列公共接口。

### `ChooseBase`

| 字段      | 类型      | 作用             |
| --------- | --------- | ---------------- |
| `forced`  | `boolean` | 是否必须作出选择 |
| `prompt`  | `string`  | 主提示文本       |
| `prompt2` | `string`  | 补充提示文本     |

### `CheckCardParams`

| 字段             | 类型                                        | 作用                                 |
| ---------------- | ------------------------------------------- | ------------------------------------ |
| `filterCard`     | `boolean`、`CardFilter` 或函数              | 可选择的牌需要满足的条件             |
| `selectCard`     | `number`、`[min, max]` 或返回选择范围的函数 | 选择牌的数量                         |
| `position`       | `string`                                    | 选牌区域，如 `"h"`、`"he"`、`"hes"`  |
| `complexCard`    | `boolean`                                   | 每次选牌后是否重新计算筛选条件和数量 |
| `allowChooseAll` | `boolean`                                   | 是否提供全选、反选                   |
| `ai`             | `(card) => number`                          | AI 选择牌的评分                      |

`CardFilter` 用对象描述牌需要满足的条件：

| 字段      | 类型                 | 作用         |
| --------- | -------------------- | ------------ |
| `name`    | `string \| string[]` | 限制牌名     |
| `type`    | `string \| string[]` | 限制类型     |
| `subtype` | `string \| string[]` | 限制子类型   |
| `color`   | `string \| string[]` | 限制颜色     |
| `suit`    | `string \| string[]` | 限制花色     |
| `number`  | `string \| string[]` | 限制点数条件 |

方法会用 `get.filter` 把 `CardFilter` 转换为过滤函数。例如：

```javascript
const result = await player
	.chooseCard({
		prompt: "选择一张红色基本牌",
		position: "he",
		filterCard: {
			type: "basic",
			color: "red",
		},
	})
	.forResult();
```

需要组合动态条件或读取 `player`、`event` 时，仍应使用函数形式的 `filterCard`。

### `CheckTargetParams`

| 字段            | 类型                                        | 作用                       |
| --------------- | ------------------------------------------- | -------------------------- |
| `filterTarget`  | `boolean` 或函数                            | 可选择的目标需要满足的条件 |
| `selectTarget`  | `number`、`[min, max]` 或返回选择范围的函数 | 选择目标的数量             |
| `complexTarget` | `boolean`                                   | 每次选择目标后是否重新计算 |
| `ai`            | `(target) => number`                        | AI 选择目标的评分          |

### `CheckButtonParams`

| 字段             | 类型                                        | 作用                       |
| ---------------- | ------------------------------------------- | -------------------------- |
| `filterButton`   | `(button, player) => boolean`               | 可选择的按钮需要满足的条件 |
| `selectButton`   | `number`、`[min, max]` 或返回选择范围的函数 | 选择按钮的数量             |
| `allowChooseAll` | `boolean`                                   | 是否提供全选、反选         |
| `ai`             | `(button) => number`                        | AI 选择按钮的评分          |

同时选择牌和目标时使用 `CheckCardTargetParams`，评分函数分别写为 `ai1` 和 `ai2`；同时选择按钮和目标时使用 `CheckButtonTargetParams`，规则相同。

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

## 三、常用动作事件

### 获得牌

`gain` 使用 `EventGainParams`：

```javascript
await player.gain({
	cards,
	source,
	animate: "giveAuto",
	gaintag: ["example_skill"],
	log: true,
	bySelf: true,
	delay: true,
});
```

常用字段如下：

| 字段          | 类型          | 说明                                                                        |
| ------------- | ------------- | --------------------------------------------------------------------------- |
| `cards`       | `Card[]`      | 要获得的牌                                                                  |
| `source`      | `Player`      | 牌的来源角色                                                                |
| `animate`     | `GainAnimate` | `"draw"`、`"gain"`、`"gain2"`、`"draw2"`、`"give"`、`"giveAuto"` 或动画函数 |
| `gaintag`     | `string[]`    | 为获得的牌添加的标签                                                        |
| `log`         | `boolean`     | 是否记录日志                                                                |
| `areaNames`   | `string[]`    | 牌原先所在的公共区域名                                                      |
| `fromStorage` | `boolean`     | 是否来自特殊存储区域                                                        |
| `bySelf`      | `boolean`     | 是否由获得者自己发起                                                        |
| `delay`       | `boolean`     | 是否进行事件延时                                                            |

`addToExpansion` 的 `EventAddToExpansionParams` 与其结构接近，用于把牌置于武将牌上。

### 摸牌

`draw` 使用 `EventDrawParams`：

```javascript
await player.draw({
	num: 2,
	source,
	bottom: true,
	visible: true,
	nodelay: true,
	gaintag: ["example_skill"],
});
```

其中 `num` 是摸牌数，`bottom` 表示从牌堆底摸牌，`visible` 表示牌对其他角色可见，`nodelay` 表示不播放通常的摸牌延时。`drawDeck` 可指定牌堆。

### 使用牌或技能

`useCard` 使用 `EventUseCardParams`，其中 `card` 和 `targets` 是必填字段：

```javascript
await player.useCard({
	card: { name: "sha", isCard: true },
	cards,
	targets: [target],
	skill: "example_skill",
	addCount: false,
	noai: true,
	nowuxie: true,
});
```

`useSkill` 使用 `EventUseSkillParams`，`skill` 必填，`card`、`cards`、`targets` 和 `addCount` 可选：

```javascript
await player.useSkill({
	skill: "example_skill",
	cards,
	targets: [target],
	addCount: false,
});
```

### 伤害与回复

```javascript
await target.damage({
	source: player,
	num: 2,
	nature: "fire",
	card,
	cards,
	nohujia: true,
});

await target.recover({
	source: player,
	num: 1,
	card,
	cards,
});
```

`EventDamageParams` 还提供 `notrigger`、`nocard`、`nosource` 和 `unreal`；`EventRecoverParams` 提供 `nocard` 和 `nosource`。这些字段用于禁止默认触发或禁止从当前事件继承牌、来源，不能简单理解为给事件附加一个同名的普通标记。

### 弃牌、失去牌和打出牌

```javascript
await player.discard({
	cards,
	discarder: source,
	position: ui.discardPile,
	notBySelf: true,
});

await player.lose({
	cards,
	source,
	position: ui.discardPile,
	visible: true,
	insert_card: true,
});

await player.respond({
	card: { name: "shan", isCard: true },
	cards,
	source,
	skill: "example_skill",
	animate: true,
	highlight: true,
	noOrdering: true,
});
```

`discard` 会强制弃置指定牌；`modedDiscard` 还会检查牌能否被弃置；`lose` 是更底层的失牌事件。不要仅因三个方法都接受 `cards` 就互相替换。

## 四、支持对象参数的方法

下表按 [`Player/type.d.ts`](../apps/core/noname/library/element/Player/type.d.ts) 中的接口整理。字段的最终清单和精确类型以该文件为准。

### 牌与装备区域

| 方法                  | 参数接口                       |
| --------------------- | ------------------------------ |
| `connectCards`        | `EventConnectCardsParams`      |
| `resetConnectedCards` | `EventResetConnectCardsParams` |
| `addShownCards`       | `EventAddShownCardsParams`     |
| `hideShownCards`      | `EventHideShownCardsParams`    |
| `disableEquip`        | `EventDisableEquipParams`      |
| `enableEquip`         | `EventEnableEquipParams`       |
| `expandEquip`         | `EventExpandEquipParams`       |

### 选择与交互

| 方法                   | 参数接口                          |
| ---------------------- | --------------------------------- |
| `chooseToDebate`       | `EventChooseToDebateParams`       |
| `chooseCooperationFor` | `EventChooseCooperationForParams` |
| `chooseToMove`         | `EventChooseToMoveParams`         |
| `chooseToMove_new`     | `EventChooseToMoveNewParams`      |
| `chooseToEnable`       | `EventChooseToEnableParams`       |
| `chooseToDisable`      | `EventChooseToDisableParams`      |
| `chooseToUse`          | `EventChooseToUseParams`          |
| `chooseToRespond`      | `EventChooseToRespondParams`      |
| `chooseToGive`         | `EventChooseToGiveParams`         |
| `chooseToDiscard`      | `EventChooseToDiscardParams`      |
| `chooseSkill`          | `EventChooseSkillParams`          |
| `discoverCard`         | `EventDiscoverCardParams`         |
| `chooseCardButton`     | `EventChooseCardButtonParams`     |
| `chooseVCardButton`    | `EventChooseVCardButtonParams`    |
| `chooseButton`         | `EventChooseButtonParams`         |
| `chooseCardOL`         | `EventChooseCardOLParams`         |
| `chooseCard`           | `EventChooseCardParams`           |
| `chooseUseTarget`      | `EventChooseUseTargetParams`      |
| `chooseTarget`         | `EventChooseTargetParams`         |
| `chooseCardTarget`     | `EventChooseCardTargetParams`     |
| `chooseButtonTarget`   | `EventChooseButtonTargetParams`   |
| `chooseControlList`    | `EventChooseControlListParams`    |
| `chooseControl`        | `EventChooseControlParams`        |
| `chooseBool`           | `EventChooseBoolParams`           |
| `chooseDrawRecover`    | `EventChooseDrawRecoverParams`    |
| `chooseNumbers`        | `EventChooseNumbersParams`        |
| `choosePlayerCard`     | `EventChoosePlayerCardParams`     |
| `discardPlayerCard`    | `EventDiscardPlayerCardParams`    |
| `gainPlayerCard`       | `EventGainPlayerCardParams`       |
| `moveCard`             | `EventMoveCardParams`             |

### 执行动作

| 方法                     | 参数接口                       |
| ------------------------ | ------------------------------ |
| `useCard`                | `EventUseCardParams`           |
| `useSkill`               | `EventUseSkillParams`          |
| `drawTo` 的第二个参数    | `EventDrawToParams`            |
| `draw`                   | `EventDrawParams`              |
| `randomDiscard`          | `EventRandomDiscardParams`     |
| `loseToDiscardpile`      | `EventLoseToDiscardpileParams` |
| `randomGain`             | `EventRandomGainParams`        |
| `discard`                | `EventDiscardParams`           |
| `modedDiscard`           | `EventModedDiscardParams`      |
| `respond`                | `EventRespondParams`           |
| `gain`                   | `EventGainParams`              |
| `addToExpansion`         | `EventAddToExpansionParams`    |
| `lose`                   | `EventLoseParams`              |
| `damage`                 | `EventDamageParams`            |
| `recover`                | `EventRecoverParams`           |
| `recoverTo` 的第二个参数 | `EventRecoverToParams`         |
| `loseMaxHp`              | `EventLoseMaxHpParams`         |
| `gainMaxHp`              | `EventGainMaxHpParams`         |
| `judge`                  | `EventJudgeParams`             |

其中 `draw`、`damage`、`recover`、`loseMaxHp` 和 `gainMaxHp` 还接受单个 `number` 作为快捷参数。该形式没有不定参数歧义，可以按需保留：

```javascript
await player.draw(2);
await target.damage(1);
await target.recover(1);
await player.loseMaxHp(1);
await player.gainMaxHp(1);
```

## 五、必填字段与保留位置参数

下列接口含有必填字段：

| 接口                                       | 必填字段          |
| ------------------------------------------ | ----------------- |
| `EventChooseToDebateParams`                | `list`、`args`    |
| `EventChooseCooperationForParams`          | `target`          |
| `EventChooseToMoveParams`                  | `list`            |
| `EventChooseToGiveParams`                  | `target`          |
| `EventChooseCardButtonParams`              | `cards`           |
| `EventChooseVCardButtonParams`             | `list`            |
| `EventChooseCardOLParams`                  | `list`            |
| `EventChooseNumbersParams`                 | `list`            |
| `EventChoosePlayerCardParams` 及其派生接口 | `target`          |
| `EventUseCardParams`                       | `card`、`targets` |
| `EventUseSkillParams`                      | `skill`           |
| `EventRandomGainParams`                    | `target`          |
| `EventDiscardParams`                       | `cards`           |
| `EventModedDiscardParams`                  | `cards`           |

有四个方法仍保留一个必要的位置参数，对象只替代其后的可选参数：

```javascript
player.chooseSkill(target, {
	prompt: "选择获得一个技能",
	func: skill => skill,
});

player.discoverCard(list, {
	num: 3,
	use: true,
});

player.drawTo(5, {
	bottom: true,
});

player.recoverTo(3, {
	source,
	nocard: true,
});
```

`chooseSkill` 的 `target`、`discoverCard` 的 `list`、`drawTo` 和 `recoverTo` 的目标数值不属于对应参数对象。

## 六、对象参数与 `.set()`

下列两种写法都能设置事件属性：

```javascript
player
	.chooseTarget({
		prompt: "选择一名角色",
		filterTarget: lib.filter.notMe,
	})
	.set("ai", target => -get.attitude(player, target));

player.chooseTarget({
	prompt: "选择一名角色",
	filterTarget: lib.filter.notMe,
	ai: target => -get.attitude(player, target),
});
```

已在参数接口中声明、创建事件时即可确定的字段，推荐直接写进对象。需要保留返回事件、在创建后按条件修改，或设置尚未纳入参数接口的自定义事件数据时，仍可使用 `.set()`：

```javascript
const next = player.chooseTarget({
	prompt: "选择一名角色",
});

if (extraFilter) {
	next.set("filterTarget", extraFilter);
}
next.set("customData", customData);
```

对象参数并不废弃 `.set()`；它只是让事件的初始配置集中、具名并可由类型系统检查。

## 七、数组字段不要省略数组

旧式接口常把单张牌或单个目标自动包装成数组；对象接口按声明使用数组：

```javascript
// 单张牌
player.gain({ cards: [card] });

// 单个目标
player.useCard({
	card: { name: "sha", isCard: true },
	targets: [target],
});

// 单个标签
player.gain({
	cards,
	gaintag: ["example_skill"],
});
```

同理，`cards`、`targets`、`gaintag`、`areaNames` 等复数字段都应传数组。这样既符合类型声明，也避免依赖旧式参数解析器的自动转换。
