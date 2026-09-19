# 游戏启动到进行时流程速查

本文根据 `apps/core/index.html`、`apps/core/noname/entry.ts`、`apps/core/noname/init/index.ts`、`apps/core/noname/game/index.js`、模式 `start` 以及 `phaseLoop` 相关代码整理，用于后续理解项目从启动到游戏进行时的主线。

## 总览

整体流程：

```text
index.html
  -> noname/entry.ts
  -> boot()
  -> 加载配置/资源/模式/武将包/卡包/扩展
  -> ui.create.arena()
  -> game.createEvent("game", false).setContent(当前模式 start)
  -> game.loop()
  -> GameEvent.start()
  -> 模式 start
  -> chooseCharacter / gameStart / gameDraw / phaseLoop
  -> 玩家回合循环
```

启动阶段的核心目标是：

- 初始化全局单例：`lib`、`game`、`ui`、`get`、`ai`、`_status`
- 加载配置和素材
- 加载当前模式、武将包、卡包、扩展
- 把当前模式能力混入全局对象
- 创建根事件 `game`
- 启动事件系统

游戏进行时的核心则是：

```text
phaseLoop 无限推进玩家回合
  -> phase 创建一个玩家回合
    -> phaseZhunbei / phaseJudge / phaseDraw / phaseUse / phaseDiscard / phaseJieshu
      -> 每个阶段都是 GameEvent
        -> 阶段中继续创建子事件和触发技能
```

## 入口 index.html

入口文件是 `apps/core/index.html`。

它做两件事：

- 设置全局错误处理
- 加载模块入口

```html
<script type="module" src="./noname/entry.ts"></script>
```

从这里开始进入 TypeScript/ESM 模块流程。

## entry.ts

`apps/core/noname/entry.ts` 导入核心单例：

```js
import { lib, game, get, _status, ui, ai } from "noname";
import { boot } from "@/init/index.js";
```

`"noname"` 对应 `apps/core/noname.js`，该文件统一导出：

```js
export { AI, ai, setAI } from "./noname/ai/index.js";
export { Game, game, setGame } from "./noname/game/index.js";
export { Get, get, setGet } from "./noname/get/index.js";
export { Library, lib, setLibrary } from "./noname/library/index.js";
export { status, _status, setStatus } from "./noname/status/index.js";
export { UI, ui, setUI } from "./noname/ui/index.js";
```

这些对象的职责大致是：

- `lib`：技能、卡牌、武将、翻译、配置、content 表等静态库
- `game`：游戏行为 API 和运行入口
- `ui`：DOM/UI 创建、交互和展示
- `get`：查询、计算、转换工具
- `ai`：AI 评估逻辑
- `_status`：运行时状态

`entry.ts` 接着根据平台加载 preload：

```text
优先 /preload.js
Electron -> init/node.js
普通浏览器 -> init/browser.js
移动客户端/Cordova -> init/cordova.js
```

preload 完成后，处理 GPL 确认，然后调用：

```js
await boot();
```

## boot 基础初始化

`boot()` 位于 `apps/core/noname/init/index.ts`。

前半段主要做基础环境准备：

```text
导入 polyfill
设置加载超时
设置背景
把 get/ui/ai/game 挂到 lib
创建初始 _status.event
设置窗口监听和错误处理
加载配置
初始化兼容层
初始化沙盒 Realms
初始化 security
设置 CacheContext proxy
处理触屏/布局等配置
```

关键点：

```js
_status.event = lib.element.GameEvent.initialGameEvent();
```

这给事件系统一个初始状态。后续根事件 `game` 会接管真正的游戏流程。

## 加载配置和预加载内容

`boot()` 会读取本地配置，并根据配置决定加载哪些内容。

重要加载项：

```text
当前模式
所有启用卡包
所有启用武将包
rank / replace / perfectPairs
扩展
自定义皮肤样式
背景
触屏设置
```

模式、卡包、武将包通过这些函数加载：

```js
importMode(name)
importCardPack(name)
importCharacterPack(name)
importExtension(name)
```

这些函数位于 `apps/core/noname/init/import.ts`。

## importMode / game.import

`importMode(name)` 会动态导入模式模块：

```text
/mode/identity.js
/mode/guozhan/index.js
/mode/doudizhu.js
...
```

简化逻辑：

```js
const path = alreadyModernMode.includes(name)
  ? `/mode/${name}/index`
  : `/mode/${name}`;

await importFunction("mode", path);
```

`importFunction()` 会：

```text
动态 import path.js
若安全上下文允许，失败后尝试 path.ts
检查导出 type 是否匹配
调用 game.import(type, defaultExport)
```

`game.import(type, content)` 负责把导入结果暂存到：

```js
lib.imported[type][result.name] = result;
```

例如：

```text
lib.imported.mode.identity = identityModeConfig
lib.imported.character.standard = standardCharacterConfig
lib.imported.card.standard = standardCardConfig
```

注意：动态 import 只是把模块加载进 `lib.imported`，不等于已经完全合并到 `lib.skill`、`lib.card`、`game` 等对象。

## splash 与模式选择

如果当前模式没有提前加载，boot 会显示 splash：

```text
创建 #splash
调用 splash.init
等待玩家选择模式
splash.dispose
保存 config.mode
importMode(result)
```

如果设置了 directstart、关闭 splash 或播放录像，则可能跳过选择，直接加载配置中的模式。

## loadMode

模式加载到 `lib.imported.mode` 后，boot 会取出当前模式：

```js
const currentMode = lib.imported.mode[lib.config.mode];
loadMode(currentMode);
```

`loadMode()` 位于 `apps/core/noname/init/loading.ts`。

它会把模式配置混入全局对象：

```js
mixinLibrary(mode, lib);
mixinGeneral(mode, "game", game);
mixinGeneral(mode, "ui", ui);
mixinGeneral(mode, "get", get);
mixinGeneral(mode, "ai", ai);
```

也就是说，模式可以提供：

- `mode.game`：扩展 `game` 方法，例如 `chooseCharacter`
- `mode.ui`：扩展 UI
- `mode.get`：扩展查询逻辑
- `mode.ai`：扩展 AI
- `mode.skill`：提供模式技能
- `mode.translate`：提供翻译
- `mode.start`：模式启动流程
- `mode.startBefore`：模式启动前处理

随后 boot 保存：

```js
lib.init.start = currentMode.start;
lib.init.startBefore = currentMode.startBefore;
```

## 加载武将包、卡包、play、扩展

模式加载后，boot 会继续将其他导入内容合并到全局。

大致顺序：

```text
loadCharacter(imported character packs)
loadCardPile()
loadCard(imported card packs)
过滤/转换 card.list
loadPlay(imported play packs)
loadExtension(enabled extensions)
```

角色包中的 `skill.js` 会进入 `lib.skill`。

卡包中的牌定义会进入：

```text
lib.card
lib.cardPack
lib.translate
lib.skill
```

扩展也可注入角色、卡牌、技能、翻译、菜单和预处理逻辑。

## startBefore 与 UI arena

加载完成后：

```js
if (lib.init.startBefore) {
  lib.init.startBefore();
  delete lib.init.startBefore;
}

ui.create.arena();
```

`startBefore` 给模式一个在根事件创建前调整环境的机会。

`ui.create.arena()` 创建游戏主界面容器，但还不等于已经创建玩家座位。具体玩家区通常由模式 start 内的 `game.prepareArena()` 完成。

## 创建根事件 game

启动流程真正进入事件系统的关键语句：

```js
game.createEvent("game", false).setContent(lib.init.start);
```

含义：

- 创建名为 `"game"` 的根事件
- `trigger` 传 `false`，因此它不会自动走 `gameBefore/gameBegin/gameEnd/gameAfter`
- content 是当前模式的 `start`

随后：

```js
delete lib.init.start;
await _status.onprepare;
game.loop();
```

## game.loop

`game.loop(event = _status.event)` 很薄：

```js
loop(event = _status.event) {
  if (!event) throw new Error("There is no _status.event when game.loop.");
  return event.start();
}
```

它不是传统游戏主循环，只是启动当前事件。

真正的持续循环在后面的 `phaseLoop` 事件中。

## 根事件进入模式 start

`GameEvent.start()` 会：

```text
加入全局历史
设置当前事件栈
执行 event.loop()
```

根事件 `"game"` 的 content 是当前模式的 `start`。

模式 `start` 有两类常见写法：

- 旧式数组步骤：如 `identity.js`
- async 函数：如部分现代模式

事件系统会通过 `ContentCompiler` 统一编译。

## 身份模式 start 主线

以 `apps/core/mode/identity.js` 为例，`start` 是一个步骤数组。

核心流程：

```text
设置 _status.mode
处理录像播放
prepareArena
新手教程/变更日志
联机等待或本地选将前处理
game.chooseCharacter()
处理身份显示、主公增强等规则
game.syncState()
event.trigger("gameStart")
game.addVideo("init")
game.gameDraw(beginner, ...)
game.phaseLoop(beginner)
```

关键节点：

```js
game.prepareArena();
game.chooseCharacter();
event.trigger("gameStart");
game.gameDraw(event.beginner, ...);
game.phaseLoop(event.beginner);
```

## prepareArena

`game.prepareArena(num)` 会准备游戏桌面：

```text
_status.prepareArena = true
game.showHistory(false)
ui.create.players(num)
ui.create.me()
ui.create.cardsAsync()
game.finishCards()
```

它负责创建玩家节点、自己的手牌区、牌堆 UI，并完成初始牌堆。

联机模式下还有 `randomMapOL()` 等额外逻辑，用于映射客户端和玩家座位。

## chooseCharacter

`game.chooseCharacter()` 是模式提供的选将流程。不同模式差异很大。

身份模式中，它负责：

- 分配身份
- 选择/随机武将
- 初始化玩家武将、体力、势力
- 设置主公、忠臣、反贼、内奸等身份字段
- 处理特殊模式，如忠胆英杰、3v3v2、谋攻等
- 处理 AI 选将

选将完成后，模式 start 继续向后推进。

## gameStart

模式调用：

```js
event.trigger("gameStart");
```

`GameEvent.trigger("gameStart")` 有额外逻辑：

```text
发布 Noname.Game.Event.GameStart
发布 gameStart
执行 brawl.gameStart
显示牌堆按钮
_status.gameStarted = true
game.showHistory()
```

从这里开始，运行时认为游戏已经正式开始。

很多技能会监听：

```js
trigger: { global: "gameStart" }
```

## gameDraw

`game.gameDraw(player, num, targets)` 会创建 `gameDraw` 事件：

```js
let next = game.createEvent("gameDraw");
next.player = player;
next.num = num;
next.targets = targets;
next.setContent("gameDraw");
```

`gameDraw` content 负责初始发牌：

```text
从 player 开始按座次遍历
对 targets 中的玩家发 num 张牌
处理特殊牌堆 otherPile
设置 _start_cards
处理双将/特殊摸牌
必要时提供手气卡换牌
```

完成后，游戏进入回合循环。

## phaseLoop

`game.phaseLoop(player)` 创建 `phaseLoop` 事件：

```js
let next = game.createEvent("phaseLoop");
next.player = player;
next._isStandardLoop = true;
next.setContent("phaseLoop");
return next;
```

`phaseLoop` content 是真正的游戏进行时主循环。

简化逻辑：

```text
初始化座次号
while true:
  如果 event.player 仍在 game.players:
    执行 lib.onphase
    const phase = event.player.phase()
    将 phase 放入 event.next
    await phase
  触发 phaseOver
  找到下一个玩家
  event.player = 下一个玩家
```

这就是无名杀对局持续推进的核心。

## player.phase

`player.phase()` 创建一个 `phase` 事件：

```js
var next = game.createEvent("phase", false);
next.player = this;
next.setContent("phase");
next.forceDie = true;
next.includeOut = true;
return next;
```

注意 `trigger` 是 `false`，因为 `phase` content 内部会更细粒度地手动触发各种时机。

## phase 回合事件

`phase` content 默认阶段列表：

```js
[
  "phaseZhunbei",
  "phaseJudge",
  "phaseDraw",
  "phaseUse",
  "phaseDiscard",
  "phaseJieshu",
]
```

回合开始时会：

```text
触发 phaseBefore
更新 game.phaseNumber
判断是否新一轮 roundStart
推入 globalHistory/actionHistory/stat
触发 phaseBeforeStart
触发 phaseBeforeEnd
检查翻面跳过
设置 _status.currentPhase
触发 phaseBeginStart
触发 phaseBegin
```

随后逐个执行阶段：

```text
phaseChange
player[event.currentPhase]()
await 阶段事件
阶段结束后 event.num++
继续下一阶段
```

阶段全部结束后：

```text
触发 phaseEnd
触发 phaseAfter
清理 _status.currentPhase
```

## 六个标准阶段

### phaseZhunbei

准备阶段：

```text
记录日志：进入准备阶段
触发 phaseZhunbei
```

### phaseJudge

判定阶段：

```text
收集判定区牌
逐张处理
触发 phaseJudge
执行 player.judge
根据结果执行延时锦囊效果或取消效果
```

### phaseDraw

摸牌阶段：

```text
触发 phaseDrawBegin1
触发 phaseDrawBegin2
默认摸 event.num 张牌
记录摸到的 cards
```

默认 `event.num = 2`，首轮少摸等规则会在创建阶段事件时调整。

### phaseUse

出牌阶段：

```text
重置 phaseUse 技能/卡牌使用统计
触发 phaseUseBefore
触发 phaseUseBegin
创建 player.chooseToUse()
如果 result.bool 为真，回到 chooseToUse
触发 phaseUseEnd
触发 phaseUseAfter
```

因此出牌阶段的“反复使用牌/技能”是通过 `event.goto(3)` 回到选择步骤实现的。

### phaseDiscard

弃牌阶段：

```text
计算 player.needsToDiscard()
如果不需要弃牌，finish()
触发 phaseDiscard
player.chooseToDiscard(num, true)
记录弃牌 cards
```

### phaseJieshu

结束阶段：

```text
记录日志：进入结束阶段
触发 phaseJieshu
```

## 技能如何穿插进流程

任何事件触发时机都会进入 `GameEvent.trigger(name)`。

例如：

```text
phaseDrawBegin1
phaseUseBegin
damageEnd
useCardToTarget
gameStart
```

事件系统会：

```text
查 lib.hookmap[name]
按座次遍历玩家
收集符合 trigger 的技能
创建 arrangeTrigger
按 firstDo / priority / lastDo 执行
每个技能创建 createTrigger 事件
执行技能 cost/content
```

所以游戏进行时并不是单纯的阶段函数顺序调用，而是：

```text
阶段事件
  -> 生命周期时机
    -> 技能触发事件
      -> 技能 content
        -> 更多子事件
```

## 本地与联机差异

启动流程中有不少联机分支：

- `lib.config.mode === "connect"` 会设置 `_status.connectMode`
- 模式 start 中可能调用 `game.waitForPlayer`
- `randomMapOL()` 负责客户端座位映射
- 玩家选择事件可能通过 `event.send()` 发给客户端
- `_status.connectMode` 下部分错误处理、触发、同步逻辑不同

但主线仍然一致：

```text
加载模式
创建根 game 事件
执行模式 start
触发 gameStart
进入 gameDraw
进入 phaseLoop
```

## 录像播放分支

部分模式 start 开头会检查：

```js
localStorage.getItem(lib.configprefix + "playback")
```

如果存在录像：

```text
创建 me
隐藏 arena/system
读取 video
game.playVideoContent(...)
event.finish() 或直接 return
```

此时不会进入正常选将和 phaseLoop。

## 一句话总结

项目启动阶段主要是在装配运行环境和模式数据；真正进入游戏后，根事件 `"game"` 执行当前模式的 `start`，模式负责选将、触发 `gameStart`、初始摸牌，最后创建 `phaseLoop`。此后对局由 `phaseLoop -> phase -> 阶段事件 -> 子事件/技能事件` 这条事件链持续推进。
