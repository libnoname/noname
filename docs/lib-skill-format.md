# lib.skill 格式速查

本文根据 `apps/core/character/standard/skill.js` 中的标准包技能代码整理，用于后续阅读或编写 `lib.skill` 技能对象时作为上下文。

`lib.skill` 本质是一个技能表：

```js
lib.skill = {
  技能名: 技能配置对象,
};
```

角色包里的 `skill.js` 通常导出一个 `skills` 对象，加载后会被合并到 `lib.skill`。

```js
const skills = {
  stdqingjiao: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    forced: true,
    async content(event, trigger, player) {
      await player.draw();
    },
  },
};

export default skills;
```

## 核心分类

一个技能对象通常由以下几组字段组成：

- 触发技：`trigger`、`filter`、`check`、`cost`、`content`
- 主动技：`enable`、`filterCard`、`selectCard`、`filterTarget`、`selectTarget`、`content`
- 视为技：`enable`、`filterCard`、`viewAs`、`viewAsFilter`、`position`、`prompt`
- 规则修改：`mod`
- 组合技能：`group`、`subSkill`、`sourceSkill`
- 展示和状态：`audio`、`intro`、`mark`、`marktext`、`onremove`、`init`
- AI：`ai`

## 触发技

典型格式：

```js
skillName: {
  audio: 2,
  trigger: { player: "damageEnd" },
  filter(event, player) {
    return event.num > 0;
  },
  check(event, player) {
    return true;
  },
  async content(event, trigger, player) {
    await player.draw();
  },
}
```

`trigger` 表示监听的事件时机。常见 role：

```js
trigger: { player: "damageEnd" }       // 当前事件的 event.player 是自己
trigger: { source: "damageSource" }    // 当前事件的 event.source 是自己
trigger: { target: "useCardToTarget" } // 当前事件的 event.target 是自己
trigger: { global: "phaseJieshuBegin" } // 全局时机
```

时机可以是字符串，也可以是数组：

```js
trigger: {
  player: ["chooseToRespondBefore", "chooseToUseBefore"],
}
```

触发技大致执行流程：

```text
事件触发
  -> 按 trigger 匹配技能
  -> filter 判断是否能触发
  -> forced/direct/frequent/cost/check 决定是否发动
  -> 创建技能事件
  -> 执行 content
```

## cost 与 content

`cost` 用于支付代价或选择目标，通常把结果写到 `event.result`。

```js
async cost(event, trigger, player) {
  event.result = await player
    .chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
    .set("ai", target => get.attitude(player, target))
    .forResult();
}
```

如果需要把额外数据传给 `content`，可写入 `cost_data`：

```js
event.result = {
  bool: true,
  cost_data: {
    cards: result.cards,
  },
};
```

`content` 是技能效果本体。常用参数：

```js
async content(event, trigger, player) {
  // event: 当前技能事件
  // trigger: 被触发的原始事件
  // player: 技能拥有者
}
```

`content` 中常用数据：

- `event.cards`：cost 或主动技选择的牌
- `event.targets`：cost 或主动技选择的目标数组
- `event.target`：主动技单目标
- `event.cost_data`：cost 传入的额外数据
- `trigger.player`、`trigger.source`、`trigger.card` 等原始事件信息

## 主动技

主动技主要通过 `enable` 声明可用场景。

```js
skillName: {
  audio: 2,
  enable: "phaseUse",
  usable: 1,
  filter(event, player) {
    return player.countCards("h") > 0;
  },
  filterCard: true,
  selectCard: 1,
  filterTarget(card, player, target) {
    return player != target;
  },
  async content(event, trigger, player) {
    await event.target.damage();
  },
}
```

常见 `enable`：

```js
enable: "phaseUse"                         // 出牌阶段
enable: "chooseToUse"                      // 响应使用牌
enable: "chooseToRespond"                  // 响应打出牌
enable: ["chooseToUse", "chooseToRespond"] // 多场景
```

主动技选择字段：

- `filter(event, player)`：技能整体是否可用
- `filterCard(card, player)`：哪些牌可被选择
- `selectCard`：选择牌数，如 `1`、`[1, Infinity]`、`-1`
- `position`：可选牌区域，如 `"h"`、`"he"`、`"hs"`、`"hes"`
- `filterTarget(card, player, target)`：哪些角色可被选择
- `selectTarget`：选择目标数
- `check(card)`：AI 选牌评估
- `discard: false`：不走默认弃牌
- `lose: false`：不走默认失去牌
- `delay`：是否/如何延迟展示

## 视为技

视为技把某些牌当作另一张牌使用或打出。

```js
skillName: {
  enable: ["chooseToUse", "chooseToRespond"],
  filterCard(card) {
    return get.color(card) == "red";
  },
  viewAs: { name: "sha" },
  viewAsFilter(player) {
    return player.countCards("hs", { color: "red" }) > 0;
  },
  position: "hs",
  prompt: "将一张红色牌当杀使用或打出",
  check(card) {
    return 5 - get.value(card);
  },
}
```

关键字段：

- `viewAs: { name: "sha" }`：视为的牌
- `filterCard`：原始牌选择条件
- `viewAsFilter`：技能按钮是否可出现
- `position`：从哪些区域选原始牌
- `prompt`：技能提示文本

若不需要选择实体牌，可以使用：

```js
filterCard() {
  return false;
},
selectCard: -1,
viewAs: { name: "sha" },
```

## mod 规则修改

`mod` 是持续性规则修改，可单独存在，不一定需要 `trigger/content`。

```js
skillName: {
  mod: {
    maxHandcard(player, num) {
      return num + 1;
    },
    cardUsable(card, player, num) {
      if (card.name == "sha") return Infinity;
    },
    targetEnabled(card, player, target) {
      if (target.countCards("h") == 0 && card.name == "sha") return false;
    },
  },
}
```

常见 `mod` 项：

- `maxHandcard(player, num)`：手牌上限
- `cardUsable(card, player, num)`：牌使用次数
- `targetEnabled(card, player, target)`：是否能成为目标
- `targetInRange(card, player, target)`：是否无视距离
- `aiValue(player, card, num)`：AI 牌值
- `aiUseful(player, card, num)`：AI 可用价值

## group 与 subSkill

`group` 表示拥有主技能时，同时拥有其他技能逻辑。

```js
skillName: {
  group: ["skillName_part1", "skillName_part2"],
}
```

`subSkill` 适合把一个技能拆成多个子技能：

```js
skillName: {
  group: ["skillName_sha", "skillName_shan"],
  subSkill: {
    sha: {
      enable: ["chooseToUse", "chooseToRespond"],
      viewAs: { name: "sha" },
    },
    shan: {
      enable: ["chooseToUse", "chooseToRespond"],
      viewAs: { name: "shan" },
    },
  },
}
```

加载时会展开为：

```text
lib.skill.skillName_sha
lib.skill.skillName_shan
```

子技能通常会自动带上：

```js
sub: true
sourceSkill: "skillName"
```

## 标记、状态与移除

常用字段：

```js
skillName: {
  mark: true,
  marktext: "义",
  intro: {
    content: "expansion",
    markcount: "expansion",
  },
  init(player, skill) {
    player.storage[skill] = 0;
  },
  onremove(player, skill) {
    delete player.storage[skill];
  },
}
```

常见含义：

- `mark`：是否显示技能标记
- `marktext`：标记文字
- `intro`：标记说明
- `intro.markcount`：标记计数方式
- `init`：获得技能时初始化
- `onremove`：移除技能时清理
- `onremove: true`：简单清理该技能 storage

## 控制字段

高频控制字段：

- `forced: true`：强制发动，不询问（如不额外设置locked则默认locked为true）
- `frequent: true`：频繁发动，可自动发动
- `direct: true`：直接发动，减少确认流程
- `locked: true`：锁定技
- `zhuSkill: true`：主公技
- `limited: true`：限定技
- `skillAnimation: true`：发动动画
- `animationColor: "orange"`：动画颜色
- `preHidden: true`：国战等模式下可预亮
- `silent: true`：静默触发
- `popup: false`：不显示技能 popup
- `firstDo: true`：同一时机中优先处理
- `lastDo: true`：同一时机中延后处理
- `sourceSkill: "xxx"`：归属技能
- `charlotte: true`：状态技/特殊隐藏/不常规移除类标记
- `usable: 1`：每阶段或每时机可用次数限制
- `round: 1`：按轮次限制

## AI 字段

`ai` 不直接改变规则，主要影响电脑决策、响应判断和界面评估。

```js
ai: {
  order: 3,
  threaten: 0.8,
  expose: 0.1,
  respondSha: true,
  respondShan: true,
  result: {
    player(player) {
      return 1;
    },
    target(player, target) {
      return get.attitude(player, target);
    },
  },
  effect: {
    target(card, player, target, current) {
      if (get.tag(card, "damage")) return [1, 0.5];
    },
  },
  skillTagFilter(player, tag, arg) {
    return true;
  },
  tag: {
    rejudge: 1,
  },
}
```

常见字段：

- `order`：主动使用优先级
- `result.player`：对自己的收益
- `result.target`：对目标的收益
- `effect.target`：被某牌影响时的修正
- `respondSha` / `respondShan`：可响应杀/闪
- `skillTagFilter`：技能标签是否有效
- `threaten`：威胁度
- `expose`：身份暴露倾向
- `tag`：能力标签，如 `rejudge`

## 触发技模板

```js
skillName: {
  audio: 2,
  trigger: { player: "damageEnd" },
  filter(event, player) {
    return event.num > 0;
  },
  check(event, player) {
    return true;
  },
  async content(event, trigger, player) {
    await player.draw();
  },
}
```

## 带代价触发技模板

```js
skillName: {
  audio: 2,
  trigger: { global: "phaseJieshuBegin" },
  filter(event, player) {
    return event.player != player;
  },
  async cost(event, trigger, player) {
    event.result = await player
      .chooseToDiscard(get.prompt2(event.skill), "h")
      .set("ai", card => 6 - get.value(card))
      .forResult();
  },
  async content(event, trigger, player) {
    await trigger.player.damage();
  },
}
```

## 主动技模板

```js
skillName: {
  audio: 2,
  enable: "phaseUse",
  usable: 1,
  filterCard: true,
  selectCard: 1,
  filterTarget(card, player, target) {
    return player != target;
  },
  check(card) {
    return 6 - get.value(card);
  },
  async content(event, trigger, player) {
    await event.target.damage();
  },
}
```

## 视为技模板

```js
skillName: {
  audio: 2,
  enable: ["chooseToUse", "chooseToRespond"],
  filterCard(card) {
    return get.color(card) == "red";
  },
  viewAs: { name: "sha" },
  viewAsFilter(player) {
    return player.countCards("hs", { color: "red" }) > 0;
  },
  position: "hs",
  prompt: "将一张红色手牌当杀使用或打出",
  check(card) {
    return 5 - get.value(card);
  },
  ai: {
    respondSha: true,
  },
}
```

## 规则修改模板

```js
skillName: {
  mod: {
    maxHandcard(player, num) {
      return num + player.countMark("skillName");
    },
    cardUsable(card, player, num) {
      if (card.name == "sha") return num + 1;
    },
  },
  intro: {
    content: "手牌上限+#",
  },
}
```

## 运行时注意点

- 技能名是 `lib.skill` 的键，也是默认翻译键，如 `lib.translate.skillName` 和 `lib.translate.skillName_info`。
- `trigger` 技能由事件系统收集并创建 `arrangeTrigger` 事件统一排序执行。
- `cost` 不是必须字段；没有 `cost` 且不是 `forced/direct` 时，引擎通常会创建确认框。
- `content` 推荐使用 `async content(event, trigger, player)` 写法。
- `subSkill` 会被展开到顶层 `lib.skill`，命名规则是 `主技能名_子技能名`。
- `viewAs` 若是字符串，初始化时会被规范成 `{ name: 字符串 }`。
- `limited: true` 会自动补充部分限定技默认字段，如 `mark`、`intro`、`skillAnimation`、`init`。
- `ai` 字段非常影响电脑行为；规则正确但 AI 缺失时，电脑可能不会合理发动。
