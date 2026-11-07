# Trigger 触发系统

Trigger 模块是技能与游戏事件之间的桥梁。当事件需要"检查是否有技能可发动"时，调用 `event.trigger(name)` 收集、排序并执行所有匹配的技能触发。

依赖：[relationships.md](relationships.md)（创建 arrangeTrigger 子事件，操作 next 链）。

## 接口

```
// 核心触发
trigger(name: string): GameEvent | null  // 触发指定时机，返回 arrangeTrigger 或 null

// 动态注册/移除
addTrigger(skills: string | string[], player: Player): this
removeTrigger(skills: string | string[], player: Player): this

// 取消
untrigger(all, player?)       // 取消触发（_triggered = 5 或 加入 _notrigger）
```

## trigger() — 核心触发流程

`event.trigger(name)` 被调用时：

1. 检查 `lib.hookmap[name]` 是否存在，不存在直接返回
2. 检查 `game.players` 是否有玩家，无则返回
3. 检查 `event.filterStop` 是否中断
4. 确定起始角色（`_status.currentPhase` > `event.source` > `event.player` > `game.me` > `game.players[0]`）
5. 按座位顺序遍历所有角色，对每个角色：
   - 收集常规技能、附加技能、临时技能
   - 清理过期的临时技能
   - 收集全局 hook（`lib.hook.globalskill[role_name]`）
   - 收集角色 hook（`lib.hook[playerid_role_name]`）
   - 对技能按 `firstDo` / `lastDo` / 普通队列分组
   - 同队列内按 `priority` 降序排列
6. 如果收集到任何技能，创建 `arrangeTrigger` 子事件并返回

## 共联时机 (relatedTrigger)

`lib.relatedTrigger` 定义时机的动态关系：

```js
{
  get phaseAny() { return lib.phaseName; },  // 动态解析为当前阶段名
}
```

当触发 `phaseJudge` 时，技能若注册了 `phaseAny`，系统会检查 relatedTrigger：`phaseAny` 动态返回 `lib.phaseName`，匹配则纳入触发队列。

## arrangeTrigger 数据结构

`trigger()` 创建的 `arrangeTrigger` 事件的 `doingList` 按座位顺序排列：

```
[
  { player: "firstDo",  todoList: [...], doneList: [...] },  // 优先队列
  { player: player_1,   todoList: [...], doneList: [...] },
  { player: player_2,   todoList: [...], doneList: [...] },
  ...
  { player: "lastDo",   todoList: [...], doneList: [...] },  // 末位队列
]
```

每项字段：

| 字段 | 说明 |
|------|------|
| `player` | 角色实例，或 `"firstDo"` / `"lastDo"` 特殊标识 |
| `todoList` | 待触发的技能条目，按 priority 降序 |
| `doneList` | 已触发过的技能条目（防止重复） |

每个技能条目：`{ skill, player, priority, indexedData? }`

## arrangeTrigger 执行流程

`arrangeTrigger` 的 content 定义在 `lib.element.content.arrangeTrigger`，核心为双层循环：

**外层循环** — 遍历 `doingList` 中的每个角色条目：

1. 取出头部条目，设为 `event.doing`
2. 进入内层循环处理该角色的技能

**内层循环** — 处理当前角色的技能触发：

1. **检查中断**：`trigger.filterStop?.()` 若返回 true，退出整个 arrangeTrigger
2. **过滤可用技能**：调用 `lib.filter.filterTrigger()` 筛选当前时机可发动的技能。无可用技能则切换到下一角色
3. **优先级剪枝**：裁剪 `todoList` 为仅保留最高 priority 的条目
4. **选择触发目标**：
   - `firstDo` / `lastDo`：直接取 `usableSkills[0]`
   - 单候选 / 同技能名多条：自动选定
   - 多候选：弹出 `chooseControl` 让玩家选择；静默技能（`silent` 或无名）自动优先
5. **执行技能**：将选中条目从 `todoList` 移入 `doneList`，调用 `game.createTrigger()` 创建并执行
6. **取消传播**：结果为 `"cancelled"` 时将该技能的所有剩余条目移入 `doneList`

## createTrigger

`game.createTrigger(name, skill, player, event, indexedData)` 为单个技能触发创建事件：

- 检查技能信息存在、角色未离开/死亡（除非技能定义 `forceOut` / `forceDie`）
- 创建 `name = "trigger"` 的非 trigger 事件
- 设置 `skill`、`player`、`triggername`、`_trigger`、`indexedData` 等

## addTrigger / removeTrigger

在 `arrangeTrigger` 创建后动态添加或移除技能触发：

- `addTrigger(skills, player)`：沿 parent 链找 `arrangeTrigger`，检查技能是否定义了对应 trigger，加入适当队列。对普通条目检查重复，`indexedData` 条目不检查
- `removeTrigger(skills, player)`：从 `arrangeTrigger` 所有队列中移除指定技能的条目

## _trigger / triggername — 因果链

- `_trigger: GameEvent` — 指向触发此事件链的原始事件
- `triggername: string` — 触发的时机名（如 `"useCardBegin"`）
- `getTrigger()`：沿 parent 链向上找到第一个带 `_trigger` 的事件，返回 `_trigger`
