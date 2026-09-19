# 外部交互 (Interaction)

外部交互模块是 GameEvent 系统对外暴露的合约面。外部代码通过此模块传参、等待事件完成、获取结果。

依赖：[lifecycle.md](lifecycle.md)（`start()` 是 Promise 链的入口）。

## 接口

```
// 传参
set(key: string, value: any): this
set(entries: [string, any][]): this
_args: any[]                   // 构造参数缓存（联机同步用）
_set: [string, any][]          // set 调用记录（联机同步用）

// Promise 接口
then(onfulfilled?, onrejected?): Promise
catch(onrejected?): Promise
finally(onfinally?): Promise
forResult(): Promise<Partial<Result>>

// 联机
send(): this                   // 将事件发送到客户端执行
sendAsync(): Promise<any>      // send 的 Promise 版本

// 结果
result: Partial<Result>        // 事件执行结果
cost_data: Result["cost_data"] // result.cost_data 快捷别名
```

## 传参

### 常用参数属性

GameEvent 声明 `[key: string]: any`，允许动态挂载任意属性。以下为系统中公认的常用字段：

| 属性 | 类型 | 说明 |
|------|------|------|
| `type` | `string` | 事件类型，如 `"card"` |
| `source` | `Player` | 伤害来源 / 效果来源 |
| `player` | `Player` | 主要角色 |
| `players` | `Player[]` | 涉及的多名角色 |
| `target` | `Player` | 单一目标 |
| `targets` | `Player[]` | 多个目标 |
| `card` | `VCard` | 关联的虚拟牌 |
| `cards` | `Card[]` | 关联的卡牌列表 |
| `skill` | `string` | 关联的技能名 |
| `forced` | `boolean` | 是否强制触发 |
| `num` | `number` | 数值参数（伤害值、摸牌数等） |
| `original_num` | `number` | 原始数值（修正前） |
| `directHit` | `Player[]` | 强制命中的角色列表 |
| `baseDamage` | `number` | 基础伤害值 |
| `extraDamage` | `number` | 额外伤害值 |
| `customSource` | `Player` | 自定义伤害来源 |
| `nature` | `string` | 属性（火/雷/冰等） |
| `unreal` | `boolean` | 是否虚拟伤害 |
| `responded` | `boolean` | 是否已响应 |
| `forceDie` | `boolean` | 强制死亡（即使已死亡也继续） |
| `includeOut` | `boolean` | 包含已离开角色 |

### set(key, value)

为事件设置属性，同时记录到 `_set` 数组以支持联机同步。支持批量设置。返回 `this` 以链式调用。

```js
event.set("player", somePlayer);
event.set([
  ["targets", [p1, p2]],
  ["num", 3],
]);
```

### _args 与 _set

- `_args: any[]` — `game.createEvent` 调用时 arguments 的缓存，用于联机同步参数
- `_set: [string, any][]` — 通过 `set()` 设置的所有键值对历史

## Promise 接口

GameEvent 实现 `PromiseLike<void>`，可直接 `await event`。

### then / catch / finally

```js
event.then(onfulfilled, onrejected);
event.catch(onrejected);
event.finally(onfinally);
```

`then()` 的正常路径：调用 `this.start()` 启动事件，在返回的 Promise 上挂载回调。

**历史兼容**：当事件有 parent 时，先 `await parent.waitNext()` 再启动自身——这是兜底策略，防止旧代码中事件被 await 时尚未被父事件调度。推荐写法中事件总是通过父事件的 `next` 链自动调度，不需要此兼容路径。

### forResult()

```js
const chooseCardResult = await event.forResult();
// chooseCardResult.cards, chooseCardResult.targets, ...
```

等价于先 `await event` 再读取 `event.result`。

## 结果

### result

`result: Partial<Result>` — 事件执行完毕后，content 的返回值被写入此属性。

### cost_data

`cost_data: Result["cost_data"]` — `result.cost_data` 的快捷别名。

## 联机同步

### send()

将事件发送到客户端执行，然后暂停主端：

```js
event.send();
// player.wait() + game.pause()
```

客户端收到事件后通过 `game.me[name].apply(game.me, args)` 重新创建并执行同名方法。

### sendAsync()

`send()` 的 Promise 版本，通过 `lib.node.waitForResult[playerid]` 获取客户端执行结果：

```js
const result = await event.sendAsync();
```

## 实用方法

| 方法 | 说明 |
|------|------|
| `changeToZero()` | 将 `num` 设为 0 并标记 `numFixed = true` |
| `setHiddenSkill(skill)` | 若 `player` 拥有隐藏技能，写入 `hsskill` 属性 |
| `getLogv()` | 向上 3 层查找父事件中设置了 `logvid` 的事件 |
| `getRand(name?)` | 获取事件内稳定的随机数（同名返回同一值） |
| `isMine()` | 是否当前客户端操作的角色 |
| `isOnline()` | 是否联机模式下的远程角色 |
| `notLink()` | 是否不在连环（铁索连环传导）中 |
| `isPhaseUsing(player)` | 是否处在指定角色的出牌阶段内 |
| `resume()` | 清除选择缓存，恢复为可重新选择状态 |
