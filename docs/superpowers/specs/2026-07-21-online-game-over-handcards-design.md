# 联机结算剩余手牌同步设计

## 问题

联机游戏结束后，主机结算页可以点击角色行末的手牌图标，查看该角色结算时的剩余手牌；客机虽然收到相同的结算表格外观，但图标文字异常，点击后也没有内容。该问题对应 `libnoname/noname#4042`。

## 根因

改动前 `Game.over` 在主机端生成结算表格时，为每个手牌图标调用 `get.poptip({ name, dialog })`。未指定 `id` 时，`PoptipManager.add` 会生成随机 ID，并只在当前页面内存中的 `#customPoptip` 与 `createDialog` 注册表保存名称和回调。主机随后通过：

```js
clients[i].send(game.over, dialog.content.innerHTML, game.checkOnlineResult(clients[i]));
```

仅把 HTML 和胜负结果发送给客机。HTML 中包含随机 ID，但客机没有对应的名称、卡牌快照或 `createDialog` 回调，因此无法还原该 poptip。

## 目标

- 保留现有结算页 HTML 结构和视觉样式。
- 主机与客机使用一致、可预测且互不冲突的结算手牌 poptip ID。
- 主机只在游戏结束后发送实际可见的 `game.players`、`game.dead` 结算行角色标识、显示名称和剩余手牌快照。
- 客机先恢复本地 poptip 注册，再插入收到的 HTML，使存活角色和阵亡角色的手牌入口都可用。
- 单个坏条目不得阻断其余结算内容；诊断信息必须通过 `console.warn` 明确暴露。
- `Game.over` 的新增参数保持可选，已有两参数调用不报错。

## 非目标

- 不重写结算表格，不调整统计列、排序、透明度或现有图标样式。
- 不改变手牌的序列化格式；继续复用 `get.cardsInfo` 和 `get.infoCards`。
- 不修改游戏进行中的手牌可见性或同步协议。
- 不处理录像回放中的结算手牌交互；现有 `game.addVideo("over", ...)` 仍只记录 HTML。
- 不为本修复引入新的通用网络协议、第三方测试框架或 poptip 生命周期系统。
- 不顺带重构 `PoptipManager` 的其他注册路径。

## 架构

改动集中在 `apps/core/noname/game/index.js`，继续使用 `apps/core/noname/library/poptip.js` 已支持的显式 `id` 注册能力。`PoptipManager.add` 在提供 `id` 时会把名称写入 `lib.translate`、把回调写入 `createDialog`，并把 ID 加入对应类型列表，因此不需要修改 poptip 核心实现。

设计包含三个协作部分：

1. **本地 poptip 创建辅助函数**：接收稳定 ID、角色显示名和本地 `Card[]`，注册 poptip 回调并返回现有手牌图标 HTML。
2. **主机载荷收集**：仅为实际可见的 `game.players` 和 `game.dead` 手牌列生成稳定 ID，使用结算开始时的 `hsMap` 快照构造纯数据载荷，并复用辅助函数渲染主机页面。
3. **客机载荷恢复**：在 `Game.over` 的联机接收分支校验可选载荷，使用 `get.infoCards` 恢复卡牌对象，逐项调用同一辅助函数注册回调，然后再设置 `dialog.content.innerHTML`。

该边界保证网络只传输可序列化数据，不传输函数、DOM 节点或主机闭包。

## 组件接口

### 结算手牌载荷

在文件顶部增加完整 JSDoc 类型，表达网络边界：

```js
/**
 * @typedef {Object} GameOverHandcardPoptipPayload
 * @property {string} poptipId 结算页手牌入口的稳定 ID
 * @property {string} position 角色在联机状态中的座位标识
 * @property {string} name 结算时的角色显示名
 * @property {Array<unknown[]>} cards get.cardsInfo 生成的卡牌信息
 */
```

`cards` 的运行时校验仍按 `get.cardInfo` 最多五项的数组格式处理，不在本修复中另建一套卡牌协议类型。

### 本地 poptip 创建辅助函数

在 `Game` 类外、同一模块内定义：

```js
/**
 * 注册结算页手牌 poptip，并返回手牌图标 HTML。
 *
 * @param {Object} options
 * @param {string} options.poptipId
 * @param {string} options.name
 * @param {Card[]} options.cards
 * @returns {string}
 */
function createGameOverHandcardPoptip({ poptipId, name, cards }) {}
```

辅助函数调用 `get.poptip` 时显式传入 `id: poptipId`，保留现有图标 HTML。回调继续显示“`角色名`的手牌”，有牌时调用 `dialog.addSmall(cards)`，零张牌时显示“（没有手牌）”。

名称和卡牌数组作为独立局部值传入回调，不再依赖主机专有的 `target` 和 `hsMap` 闭包。该函数只负责本地注册与 HTML 生成，不负责网络发送。

### `Game.over`

接口扩展为：

```js
/**
 * @param {boolean | string} [result]
 * @param {boolean} [bool]
 * @param {GameOverHandcardPoptipPayload[]} [handcardPoptips]
 * @returns
 */
over(result, bool, handcardPoptips) {}
```

第三个参数仅供主机向客机发送结算手牌载荷。省略时沿用现有流程，不尝试恢复注册，也不抛出异常。

## 稳定 ID

ID 使用固定前缀和结算手牌行的递增序号，例如：

```text
game_over_handcards_0
game_over_handcards_1
game_over_handcards_2
```

序号按实际带有可见手牌入口的结算行生成顺序分配：`game.players`、`game.dead`。不直接使用 `position` 作为唯一后缀，因为特殊模式中的不可见或复用座位入口不应参与载荷；可见行序号能在一次结算中保证唯一，并且主机发送的 HTML 与载荷天然引用同一 ID。

客机只接受匹配 `^game_over_handcards_\d+$` 的 ID，并拒绝同一载荷中的重复 ID，避免覆盖其他 poptip 注册。

## 数据流

### 主机

1. `Game.over` 进入时按现有逻辑把 `game.players` 和 `game.dead` 的手牌保存到 `hsMap`，保证后续动画或清理不会改变结算快照。
2. 初始化空的 `handcardPoptips` 数组和递增行序号。
3. 每次为 `game.players` 或 `game.dead` 生成实际可见手牌列时：
   - 生成 `poptipId`。
   - 从 `hsMap` 读取该角色的 `Card[]`，缺省为空数组。
   - 读取 `String(target.dataset.position)` 和 `get.translation(target)`。
   - 将 `{ poptipId, position, name, cards: get.cardsInfo(cards) }` 追加到载荷。
   - 调用 `createGameOverHandcardPoptip` 取得 HTML。
4. 主机完成整个结算页后，调用：

```js
clients[i].send(
	function (result, bool, handcardPoptips) {
		game.over(result, bool, handcardPoptips);
	},
	dialog.content.innerHTML,
	game.checkOnlineResult(clients[i]),
	handcardPoptips
);
```

5. 单机和主机本地页面继续使用同一辅助函数，不经过序列化往返。

`game.additionaldead` 保持既有 HTML：当前实现创建手牌 `td` 后未追加到行中，因此不补列、不分配稳定 ID、不加入 `handcardPoptips`，也不发送不可见入口载荷。本修复只消除联机主客机差异，不顺带改变特殊阵亡角色的既有展示。

### 客机

1. 进入 `game.online` 分支后创建 dialog，但暂不写入收到的 HTML。
2. 若第三个参数为 `undefined`，直接走旧流程。
3. 若第三个参数不是数组，输出 `console.warn`，忽略整份手牌载荷并继续显示结算 HTML。
4. 对数组逐项执行结构校验：
   - 条目必须是非空对象。
   - `poptipId` 必须符合固定前缀格式且在本批次唯一。
   - `position` 必须是非空字符串。
   - `name` 必须是字符串。
   - `cards` 必须是数组；每项也必须是数组，长度为三至五项，且索引 `2` 的卡牌名必须是字符串。花色、点数、属性和 `cardid` 继续交由现有 `get.infoCard` 兼容处理，避免拒绝已有合法牌型。
5. `position` 用于诊断和匹配实际可见的 `game.players`、`game.dead` 角色；主机不会为 `game.additionaldead` 补建或发送不可见入口载荷。找不到时输出 `console.warn`，但由于载荷已包含显示名和完整卡牌快照，仍可继续注册该项，不让客户端状态差异破坏可用结果。
6. 使用 `get.infoCards(entry.cards)` 恢复本地 `Card[]`。若结果数量与输入不一致，或仍包含 `get.infoCard` 失败时返回的原始数组，则视为恢复失败；否则调用 `createGameOverHandcardPoptip` 注册同一 ID。
7. 单项恢复抛错或返回无效结果时，输出包含 `poptipId` 和 `position` 的 `console.warn`，跳过该项并处理下一项。
8. 所有可用项注册完成后，才执行 `dialog.content.innerHTML = result`。自定义元素连接 DOM 时即可读取正确名称和回调。

## 错误处理

- **缺少第三个参数**：视为旧调用，不告警、不失败。
- **载荷整体类型错误**：告警一次，忽略载荷，结算 HTML、胜负音效和退出按钮继续正常显示。
- **条目字段错误**：告警并跳过该条目，不终止循环。
- **重复或越界 ID**：告警并跳过，防止覆盖本地注册。
- **本地找不到角色**：告警后使用载荷快照继续注册；`position` 用于诊断，不作为渲染的硬依赖。
- **卡牌恢复失败**：告警并跳过该条目，不使用空数组伪装成功。
- **零张手牌**：这是有效数据，正常注册并显示“（没有手牌）”，不告警。

告警需包含固定前缀（例如“联机结算手牌载荷无效”）以及可用的 `poptipId`、`position` 或数组索引，便于定位异常。不得使用空 `catch`、静默返回或成功形态的兜底数据。

## 兼容性

- 新增的第三个参数是可选参数，仓库内已有 `game.over(result, bool)` 调用保持可用。
- 新客机连接旧主机时收不到载荷，不会崩溃；其手牌 poptip 维持旧版本行为。
- 旧客机连接新主机时会忽略 JavaScript 的额外参数，不会崩溃；由于旧客机不会本地注册稳定 ID，手牌 poptip 仍不可用。
- 主机和客机都包含本修复时，完整功能生效。
- HTML、录像记录格式和前两个参数的含义不变。

因此，此兼容策略保证混合版本安全退化，不承诺在只升级一端时修复交互。

## 安全性与隐私

- 手牌载荷只在 `_status.over` 已进入结算流程、主机准备发送结算 HTML 时发送，不提前广播，不改变对局中的隐藏信息规则。
- 只传输字符串和 `get.cardsInfo` 产生的数组，不序列化函数、闭包、DOM 或可执行代码。
- 客机不执行来自网络的回调；回调由本地固定辅助函数创建。
- `poptipId` 使用白名单格式并检查重复，不能借载荷覆盖任意 poptip。
- 图标 HTML 由本地常量生成；载荷字段不会拼接进主结算 HTML。
- `name` 来自主机对已存在角色执行的 `get.translation`。它仅用于现有 dialog 标题路径，不扩大当前主机权威模型。

## 测试

仓库当前没有针对 `Game.over` 的 JavaScript 单元测试运行器，因此本修复不新增第三方框架或自动化测试脚本。实现阶段必须在浏览器开发环境中执行下列边界测试矩阵，并在 PR 中逐项记录结果；缺失角色、坏条目和重复 ID 通过在主机发送前替换一份载荷副本注入，不修改正常结算数据源。

| 场景 | 预期结果 |
| --- | --- |
| 存活角色，多张手牌 | 主机和客机显示相同角色名、相同卡牌顺序与数量 |
| 阵亡角色，多张手牌 | 阵亡表格透明度不变，双方均可打开相同手牌 |
| 存活或阵亡角色，零张手牌 | 双方均显示“（没有手牌）”，无告警 |
| 本地缺失 `position` 对应角色 | 输出明确 `console.warn`，仍使用有效载荷显示该项，其余项不受影响 |
| 单个条目字段错误 | 输出明确 `console.warn`，仅跳过坏条目 |
| 重复或非法 `poptipId` | 输出明确 `console.warn`，不覆盖已有 poptip |
| 第三个参数缺省 | 不报错，结算 HTML、胜负结果和退出流程与旧调用一致 |
| `cards` 不是数组或卡牌项格式错误 | 输出明确 `console.warn`，不把错误伪装成零手牌 |

### 联机验收

使用两个独立客户端完成一局主机加客机联机对局，并至少保留一名存活角色和一名阵亡角色：

1. 结束前确认客机看不到其他角色的隐藏手牌。
2. 结束后分别在主机和客机点击所有手牌图标。
3. 对照角色名、卡牌名称、花色、点数、属性、顺序和零手牌提示。
4. 确认控制台没有正常载荷相关告警。
5. 注入一个缺失角色或坏条目，确认只出现预期告警，其他结算行仍可点击。

### 单机回归

完成一局单机对局，确认：

- 结算表格结构、统计数字、图标和胜负结果不变。
- 存活和阵亡角色手牌入口仍可点击。
- 多张和零张手牌显示与修改前一致。
- 退出、再来一局和录像保存流程未受影响。

### 静态检查与构建

实现阶段执行：

```text
pnpm --filter noname lint
pnpm build
```

JavaScript 使用 Tab 缩进，新增类型和函数提供完整 JSDoc；稳定 ID、先注册后插入 HTML、缺失角色仍可使用快照等非直观逻辑添加简短原因说明。

## PR 验收

- 分支基于最新 `upstream/main`，PR 目标分支为 `libnoname/noname:main`。
- 实现提交使用清晰的 Conventional Commit 动词短语；不混入无关重构。
- PR 描述包含：
  - **原因**：随机自定义 poptip ID、名称和闭包只存在于主机内存，客机只收到 HTML。
  - **方案**：稳定 ID、纯数据手牌载荷、客机本地恢复注册、坏条目隔离。
  - **测试**：列出 lint、build、主机加客机验收和单机回归结果。
  - **Issue**：使用 `Fixes #4042`。
- 主机和客机的存活、阵亡、多张、零张场景全部通过。
- 缺失角色、坏条目和参数缺省均按本设计安全退化。
- 游戏结束前没有新增手牌信息广播。
- 变更范围适合单个实现 PR，不包含录像 poptip、通用 poptip 重构或其他结算页改造。
