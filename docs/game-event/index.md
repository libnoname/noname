# 游戏事件系统 (GameEvent System)

GameEvent 是无名杀游戏内核的核心驱动机制。游戏中的所有行为——出牌、技能发动、伤害、死亡、阶段切换——都通过 GameEvent 对象来表达和执行。

## 基础概念

**事件 (Event)** 是一个携带上下文数据的异步执行单元。每个事件有名字（`name`）、要执行的内容（`content`）、以及一组键值对参数。

**事件树** 是所有事件构成的层级结构——子事件通过 `parent` 挂在父事件下，同一层的事件通过 `next` 链串行执行。这棵树的根是从 `game.createEvent` 创建的顶层事件。

**三种 content 写法**（按推荐度排序）：

| 写法 | 状态 | 示例 |
|------|------|------|
| 单 async 函数 | **推荐** | `event.setContent(async (event, trigger, player) => { ... })` |
| 函数数组 | 待废弃 | `event.setContent([fn1, fn2, fn3])` |
| step 语法 | 待废弃 | `event.setContent(function() { "step 0"; ... })` |

## 模块架构

GameEvent 系统由五个正交模块组成：

```
外部交互 (interaction)
  │  then/await/forResult, set/send
  └──▶ 内部生命周期 (lifecycle)
          │  start/loop, finish/cancel, _triggered 状态机
          ├──▶ Trigger (trigger)
          │       │  trigger(), arrangeTrigger, addTrigger/removeTrigger
          │       └──▶ 事件关系 (relationships)
          │               parent/next/after, waitNext, GameEventManager
          └──▶ Content 编译 (content)
                  ContentCompiler, AsyncCompiler, ArrayCompiler
```

### 模块职责

| 模块 | 文档 | 职责 |
|------|------|------|
| 外部交互 | [interaction.md](interaction.md) | 传参、Promise 接口、联机同步。系统唯一的对外合约面 |
| 内部生命周期 | [lifecycle.md](lifecycle.md) | 事件从创建到结束的完整状态流转，中断控制 |
| Trigger | [trigger.md](trigger.md) | 技能触发时机的注册、收集、排序与执行 |
| 事件关系 | [relationships.md](relationships.md) | 事件间的树结构、时序调度、调用栈管理 |
| Content 编译 | [content.md](content.md) | content 格式的编译链，从各种写法到统一可执行形式 |
| chooseToUse 适配 | [chooseToUse.md](chooseToUse.md) | 技能出牌/选择目标的备份恢复机制 |

### 废弃模块

以下机制已标记废弃，文档独立存放，不在上述架构图中：

| 文档 | 说明 |
|------|------|
| [cache.md](cache.md) | 步骤级记忆化缓存 |
| [eventHandlers.md](eventHandlers.md) | 旧式回调注册机制 |

## 阅读指引

- **新手入门**：按上面表格从上到下阅读——先理解"外部怎么用事件"（interaction），再深入内部机制
- **调试事件流**：重点读 [relationships.md](relationships.md)（事件栈、waitNext、tempEvent）
- **编写技能**：重点读 [trigger.md](trigger.md) + [content.md](content.md)
- **迁移旧代码**：参考 [content.md](content.md) 末尾的 Step 迁移附录 + 各废弃模块文档
