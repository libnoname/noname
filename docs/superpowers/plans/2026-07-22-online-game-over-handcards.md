# 联机结算剩余手牌同步实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让联机游戏的客机在结算页使用主机发送的纯数据快照恢复每名角色的剩余手牌 poptip，同时保持单机、旧调用和混合版本安全退化。

**Architecture:** 在 `apps\core\noname\game\index.js` 内增加一个本地 poptip 创建辅助函数，主机按现有结算行顺序生成稳定 ID、收集 `{ poptipId, position, name, cards }` 并随结算 HTML 发送。客机在插入 HTML 前校验载荷、用 `get.infoCards` 恢复卡牌并注册相同 ID；单项错误只告警并跳过，缺失本地 Player 时仍使用名称和卡牌快照。

**Tech Stack:** JavaScript ES modules、JSDoc、DOM Custom Elements、`lib.poptip`、`get.cardsInfo`、`get.infoCards`、pnpm、ESLint、项目现有 Vite/Fastify 运行环境。

## Global Constraints

- 实现仅修改 `apps\core\noname\game\index.js`；不修改 `poptip.js`、`get\index.js`、录像格式或结算表格结构。
- 不新增依赖、测试框架、测试目录、测试脚本或通用网络协议。
- JavaScript 使用 Tab 缩进，并通过仓库现有 ESLint；新增类型、函数和 `Game.over` 参数必须有完整 JSDoc。
- 稳定 ID 固定使用 `game_over_handcards_<行序号>`，序号依次覆盖实际渲染手牌入口的 `game.players` 和 `game.dead`，不得只使用可能复用的 `position`。
- 网络载荷固定为 `{ poptipId, position, name, cards }`；`cards` 由主机 `get.cardsInfo` 生成，由客机 `get.infoCards` 恢复。
- 只在 `Game.over` 已进入结算流程后随结算 HTML 发送手牌快照，不改变游戏进行中的隐藏信息。
- `Game.over` 第三个参数保持可选；缺省时不告警、不失败，前两个参数和现有 HTML 行为不变。
- 非数组载荷、坏条目、重复或非法 ID、卡牌恢复失败必须 `console.warn` 后继续；不得静默失败或伪装成零手牌。
- 找不到本地 Player 时必须 `console.warn`，但仍使用有效的 `name` 和 `cards` 快照注册 poptip。
- 零张手牌是有效结果，显示“（没有手牌）”；不改变 `game.additionaldead` 当前未把手牌单元格加入行节点的既有 HTML 行为。
- 混合版本只保证不崩溃：旧客户端忽略新增参数，完整 poptip 交互要求主客机都包含修复。
- 实现提交使用中文动词短语 Conventional Commit；PR 目标为 `libnoname/noname:main`，描述包含原因、测试结果和 `Fixes #4042`。

---

## 文件结构与职责

| 路径 | 当前行范围 | 处理方式 | 职责 |
| --- | --- | --- | --- |
| `apps\core\noname\game\index.js` | `1-24` | 修改 | 定义序列化条目、载荷、辅助函数选项的 JSDoc 类型，定义稳定 ID 常量和本地 poptip 创建/校验/恢复函数。 |
| `apps\core\noname\game\index.js` | `6541-6564`、`6635-6645` | 修改 | 扩展 `Game.over(result, bool, handcardPoptips)`，并在客机分支返回后初始化主机快照、行序号和统一入口闭包。 |
| `apps\core\noname\game\index.js` | `6581-6635` | 修改 | 客机先恢复 poptip，再设置 `dialog.content.innerHTML`；保持缺省第三参数兼容。 |
| `apps\core\noname\game\index.js` | `6854-6865` | 修改 | 存活角色手牌列改用统一入口。 |
| `apps\core\noname\game\index.js` | `6947-6958` | 修改 | 阵亡角色手牌列改用统一入口。 |
| `apps\core\noname\game\index.js` | `7036-7040` | 修改 | 把纯数据载荷作为第四个 `send` 实参发送。 |
| `apps\core\noname\library\poptip.js` | `208-244` | 只读参考 | 已支持显式 `id`、名称和 `createDialog` 注册；本计划不改动。 |
| `apps\core\noname\get\index.js` | `2302-2342` | 只读参考 | 提供 `get.cardsInfo`、`get.infoCard`、`get.infoCards`；本计划不复制序列化逻辑。 |
| `docs\superpowers\specs\2026-07-21-online-game-over-handcards-design.md` | `1-247` | 只读参考 | 设计约束和验收来源。 |

不创建自动化测试文件。失败复现、边界断言和回归检查都通过项目现有浏览器运行时执行；静态验证使用现有 lint/build 命令。

当前 `additionaldead` 段虽然创建了一个手牌 `td`，但没有执行 `tr.appendChild(td)`，因此页面没有第三个可见手牌入口。为遵守“不改变结算 HTML”的设计边界，本计划只统一实际显示的存活和阵亡两处入口，不补列、不为不可见入口发送多余载荷。

## 锁定接口

```js
/**
 * @typedef {Array<unknown>} GameOverHandcardCardInfo
 */

/**
 * @typedef {Object} GameOverHandcardPoptipPayload
 * @property {string} poptipId 结算手牌入口的稳定 ID
 * @property {string} position 角色的联机座位标识
 * @property {string} name 结算时的角色显示名
 * @property {GameOverHandcardCardInfo[]} cards get.cardsInfo 生成的卡牌信息
 */

/**
 * @typedef {Object} GameOverHandcardPoptipOptions
 * @property {string} poptipId
 * @property {string} name
 * @property {Card[]} cards
 */

/**
 * 注册结算手牌 poptip，并返回现有手牌图标 HTML。
 *
 * @param {GameOverHandcardPoptipOptions} options
 * @returns {string}
 */
function createGameOverHandcardPoptip({ poptipId, name, cards }) {}

/**
 * @param {unknown} value
 * @returns {value is GameOverHandcardCardInfo}
 */
function isGameOverHandcardCardInfo(value) {}

/**
 * @param {unknown} value
 * @returns {value is GameOverHandcardPoptipPayload}
 */
function isGameOverHandcardPoptipPayload(value) {}

/**
 * 恢复客机结算手牌 poptip；参数缺省时保持旧调用行为。
 *
 * @param {unknown} handcardPoptips
 * @returns {void}
 */
function restoreGameOverHandcardPoptips(handcardPoptips) {}

/**
 * @param {boolean | string} [result]
 * @param {boolean} [bool]
 * @param {GameOverHandcardPoptipPayload[]} [handcardPoptips]
 * @returns
 */
over(result, bool, handcardPoptips) {}
```

### Task 1: 统一本地结算手牌入口并生成稳定 ID

**Files:**
- Modify: `apps\core\noname\game\index.js:1-24`
- Modify: `apps\core\noname\game\index.js:6541-6564`
- Modify: `apps\core\noname\game\index.js:6635-6645`
- Modify: `apps\core\noname\game\index.js:6854-6865`
- Modify: `apps\core\noname\game\index.js:6947-6958`
- Test: 浏览器运行时结算页断言；不创建测试文件

**Interfaces:**
- Consumes: `get.poptip({ id, name, dialog })`、`hsMap.get(Player)`、`get.translation(Player)`。
- Produces: `GAME_OVER_HANDCARD_POPTIP_PREFIX`、`GameOverHandcardCardInfo`、`GameOverHandcardPoptipPayload`、`GameOverHandcardPoptipOptions`、`createGameOverHandcardPoptip(options): string`，以及 `Game.over` 内部的 `getHandcardPoptip(target): string`。

- [ ] **Step 1: 在未修改代码上复现随机 ID**

从仓库根目录启动现有开发服务器：

```powershell
pnpm --filter noname dev --host 127.0.0.1 --port 5173 --strictPort
```

预期：终端打印 `http://127.0.0.1:5173/`，浏览器可打开游戏。完成一局至少包含一名存活角色和一名阵亡角色的单机对局，在结算页 DevTools Console 执行：

```js
const handcardPoptips = [...document.querySelectorAll("noname-poptip")].filter(node =>
	node.querySelector('img[src*="image/card/handcard.png"]')
);
const handcardPoptipIds = handcardPoptips.map(node => node.getAttribute("poptip"));
console.assert(handcardPoptips.length >= 2, "失败复现需要至少两个结算手牌入口");
console.assert(
	handcardPoptipIds.every(id => /^game_over_handcards_\d+$/.test(id)),
	`当前实现使用随机 ID：${handcardPoptipIds.join(", ")}`
);
```

预期：第二个断言失败并打印随机 ID，证明稳定 ID 尚未实现。

- [ ] **Step 2: 保存旧客户端构建供混合版本验收**

另开 PowerShell，在未修改产品代码时构建并保存基线产物：

```powershell
pnpm build
$baseline = Join-Path $env:TEMP "noname-4042-old-dist"
if (Test-Path $baseline) {
	Remove-Item -Recurse -Force $baseline
}
Copy-Item -Recurse ".\dist" $baseline
Get-ChildItem $baseline | Select-Object -First 5
```

预期：`pnpm build` 退出码为 `0`，`$env:TEMP\noname-4042-old-dist` 存在且包含构建文件。该目录只用于最终旧客户端验收，不提交到仓库。

- [ ] **Step 3: 增加类型、稳定 ID 常量和本地 poptip 辅助函数**

在 `apps\core\noname\game\index.js` 顶部现有 typedef 后、imports 前加入类型；在 imports 后、`export class Game` 前加入常量和函数：

```js
/**
 * @typedef {Array<unknown>} GameOverHandcardCardInfo
 */

/**
 * @typedef {Object} GameOverHandcardPoptipPayload
 * @property {string} poptipId 结算手牌入口的稳定 ID
 * @property {string} position 角色的联机座位标识
 * @property {string} name 结算时的角色显示名
 * @property {GameOverHandcardCardInfo[]} cards get.cardsInfo 生成的卡牌信息
 */

/**
 * @typedef {Object} GameOverHandcardPoptipOptions
 * @property {string} poptipId
 * @property {string} name
 * @property {Card[]} cards
 */

const GAME_OVER_HANDCARD_POPTIP_PREFIX = "game_over_handcards_";

/**
 * 注册结算手牌 poptip，并返回现有手牌图标 HTML。
 *
 * @param {GameOverHandcardPoptipOptions} options
 * @returns {string}
 */
function createGameOverHandcardPoptip({ poptipId, name, cards }) {
	return get.poptip({
		id: poptipId,
		name: `<img style="width:15px; vertical-align: middle;" src="${lib.assetURL}image/card/handcard.png">`,
		dialog(dialog) {
			dialog.add(`${name}的手牌`);
			dialog[cards.length > 0 ? "addSmall" : "addText"](cards.length > 0 ? cards : "（没有手牌）");
			return dialog;
		},
	});
}
```

预期：函数不引用 `target` 或 `hsMap`，只闭包捕获传入的 `name` 和 `cards`。

- [ ] **Step 4: 在客机分支返回后建立统一入口闭包**

在现有 `if (game.online) { ... return; }` 之后、主机继续生成结算内容之前增加递增序号和闭包：

```js
		let handcardPoptipIndex = 0;
		const getHandcardPoptip = target => {
			const cards = hsMap.get(target) ?? [];
			return createGameOverHandcardPoptip({
				poptipId: `${GAME_OVER_HANDCARD_POPTIP_PREFIX}${handcardPoptipIndex++}`,
				name: get.translation(target),
				cards,
			});
		};
```

此位置只会被单机或主机执行。序号只在生成可见结算手牌单元格时递增，调用顺序保持 `game.players`、`game.dead`。

- [ ] **Step 5: 将存活与阵亡两个重复入口替换为统一闭包**

存活角色段使用：

```js
				td = document.createElement("td");
				td.innerHTML = getHandcardPoptip(game.players[i]);
				tr.appendChild(td);
```

阵亡角色段使用：

```js
				td = document.createElement("td");
				td.innerHTML = getHandcardPoptip(game.dead[i]);
				tr.appendChild(td);
```

预期：存活和阵亡两处匿名 `dialog(dialog)` 回调删除。`additionaldead` 段保持原样，避免本修复新增结算列。

- [ ] **Step 6: 运行目标文件 ESLint**

```powershell
pnpm --filter noname exec eslint noname/game/index.js
```

预期：退出码为 `0`，没有 ESLint error。

- [ ] **Step 7: 重跑稳定 ID 与本地弹窗断言**

刷新开发服务器页面并完成相同单机场景，在结算页执行：

```js
const handcardPoptips = [...document.querySelectorAll("noname-poptip")].filter(node =>
	node.querySelector('img[src*="image/card/handcard.png"]')
);
const handcardPoptipIds = handcardPoptips.map(node => node.getAttribute("poptip"));
console.assert(handcardPoptips.length >= 2, "必须包含存活和阵亡角色入口");
console.assert(
	handcardPoptipIds.every((id, index) => id === `game_over_handcards_${index}`),
	`ID 必须按行连续：${handcardPoptipIds.join(", ")}`
);
console.assert(
	new Set(handcardPoptipIds).size === handcardPoptipIds.length,
	"结算手牌 ID 不得碰撞"
);
console.assert(
	handcardPoptipIds.every(id => lib.poptip.createDialog.has(id)),
	"每个稳定 ID 必须在本地注册 dialog"
);
```

预期：所有断言通过。逐个点击存活、阵亡、多张和零张手牌入口，分别看到实际卡牌或“（没有手牌）”。

- [ ] **Step 8: 提交统一入口**

```powershell
git add apps\core\noname\game\index.js
git commit -m "refactor: 统一结算手牌入口" -m "Co-authored-by: Copilot App <223556219+Copilot@users.noreply.github.com>"
```

预期：提交成功，提交内容只包含 `apps\core\noname\game\index.js` 的类型、辅助函数、稳定 ID 和存活/阵亡两个入口替换。

### Task 2: 收集并发送主机结算手牌快照

**Files:**
- Modify: `apps\core\noname\game\index.js:6541-6546`
- Modify: `apps\core\noname\game\index.js:6635-6645`
- Modify: `apps\core\noname\game\index.js:7036-7040`
- Test: 主机浏览器运行时 `Player.send` 探针；不创建测试文件

**Interfaces:**
- Consumes: Task 1 的 `GAME_OVER_HANDCARD_POPTIP_PREFIX`、`createGameOverHandcardPoptip(options)` 和 `getHandcardPoptip(target)`。
- Produces: `GameOverHandcardPoptipPayload[]` 主机快照；`clients[i].send(function (result, bool, handcardPoptips) { game.over(result, bool, handcardPoptips); }, html, result, handcardPoptips)` 四实参调用。

- [ ] **Step 1: 安装运行时发送探针并确认当前调用缺少载荷**

在主机开始一局联机游戏后、游戏结束前，于主机 DevTools Console 执行：

```js
const isGameOverWrapper = fn =>
	typeof fn === "function" &&
	/function\s*\(\s*result\s*,\s*bool\s*,\s*handcardPoptips\s*\)\s*\{\s*game\.over\s*\(\s*result\s*,\s*bool\s*,\s*handcardPoptips\s*\)\s*;\s*\}/.test(fn.toString());
window.__gameOverSendCalls = [];
window.__gameOverSendRestores = game.players
	.concat(game.dead)
	.filter(client => client.isOnline2())
	.map(client => {
		const originalSend = client.send;
		client.send = function (...args) {
			if (isGameOverWrapper(args[0])) {
				window.__gameOverSendCalls.push({
					args,
					overAtSend: _status.over,
				});
			}
			return originalSend.apply(this, args);
		};
		return () => {
			client.send = originalSend;
		};
	});
```

结束游戏后在主机 Console 执行：

```js
console.assert(window.__gameOverSendCalls.length > 0, "必须捕获至少一次 game.over 发送");
console.assert(
	window.__gameOverSendCalls.every(call => {
		const args = call.args;
		return args.length === 4 && Array.isArray(args[3]);
	}),
	"当前发送只有 HTML 和胜负结果，缺少第四个手牌载荷实参"
);
window.__gameOverSendRestores.forEach(restore => restore());
```

预期：第二个断言失败；随后恢复所有临时 `send` 包装。

- [ ] **Step 2: 扩展 `Game.over` JSDoc 并初始化载荷**

把方法签名更新为：

```js
	/**
	 * @param {boolean | string} [result]
	 * @param {boolean} [bool]
	 * @param {GameOverHandcardPoptipPayload[]} [handcardPoptips]
	 * @returns
	 */
	over(result, bool, handcardPoptips) {
```

在客机分支 `return` 后、Task 1 的统一入口闭包前初始化主机载荷：

```js
		/** @type {GameOverHandcardPoptipPayload[]} */
		handcardPoptips = [];
```

该赋值只位于主机生成结算表格的路径，不会覆盖客机收到的第三参数。

- [ ] **Step 3: 让统一入口同时记录纯数据快照**

将 `getHandcardPoptip` 更新为：

```js
		let handcardPoptipIndex = 0;
		const getHandcardPoptip = target => {
			const cards = hsMap.get(target) ?? [];
			const payload = {
				poptipId: `${GAME_OVER_HANDCARD_POPTIP_PREFIX}${handcardPoptipIndex++}`,
				position: String(target.dataset.position),
				name: get.translation(target),
				cards: get.cardsInfo(cards),
			};
			handcardPoptips.push(payload);
			return createGameOverHandcardPoptip({
				poptipId: payload.poptipId,
				name: payload.name,
				cards,
			});
		};
```

预期：载荷只含字符串和数组；回调、DOM、Player、`hsMap` 均不进入网络参数。

- [ ] **Step 4: 把载荷作为第四个 `send` 实参发送**

修改现有发送点：

```js
		let clients = game.players.concat(game.dead);
		for (let i = 0; i < clients.length; i++) {
			if (clients[i].isOnline2()) {
				clients[i].send(
					function (result, bool, handcardPoptips) {
						game.over(result, bool, handcardPoptips);
					},
					dialog.content.innerHTML,
					game.checkOnlineResult(clients[i]),
					handcardPoptips
				);
			}
		}
```

该代码仍位于 `_status.over = true` 之后和结算 HTML 完成之后；不得在其他游戏阶段广播载荷。

- [ ] **Step 5: 运行目标文件 ESLint**

```powershell
pnpm --filter noname exec eslint noname/game/index.js
```

预期：退出码为 `0`，没有 ESLint error。

- [ ] **Step 6: 重跑发送探针并校验序列化内容**

重新开始联机游戏并安装 Step 1 的探针。确保至少一名角色有多张手牌、至少一名角色为零张手牌，然后结束游戏并执行：

```js
const calls = window.__gameOverSendCalls;
console.assert(calls.length > 0, "必须捕获 game.over 发送");
for (const { args, overAtSend } of calls) {
	const payloads = args[3];
	console.assert(args.length === 4, "game.over 发送必须有四个实参");
	console.assert(overAtSend === true, "手牌载荷只能在 _status.over 后发送");
	console.assert(Array.isArray(payloads), "第四个实参必须是数组");
	console.assert(
		payloads.every((entry, index) =>
			entry.poptipId === `game_over_handcards_${index}` &&
			typeof entry.position === "string" &&
			typeof entry.name === "string" &&
			Array.isArray(entry.cards) &&
			entry.cards.every(card => Array.isArray(card))
		),
		"每个载荷条目必须符合序列化接口"
	);
	console.assert(
		payloads.some(entry => entry.cards.length === 0),
		"载荷必须保留零张手牌"
	);
	console.assert(
		payloads.some(entry => entry.cards.length > 1),
		"载荷必须保留多张手牌"
	);
}
window.__gameOverSendRestores.forEach(restore => restore());
```

预期：所有断言通过；客机在 Task 3 前仍无法打开 poptip，这是下一任务的失败起点。

- [ ] **Step 7: 提交主机快照发送**

```powershell
git add apps\core\noname\game\index.js
git commit -m "fix: 发送联机结算手牌快照" -m "Co-authored-by: Copilot App <223556219+Copilot@users.noreply.github.com>"
```

预期：提交成功，只包含载荷收集、序列化和第四个发送实参。

### Task 3: 校验载荷并恢复客机 poptip

**Files:**
- Modify: `apps\core\noname\game\index.js:1-24`
- Modify: `apps\core\noname\game\index.js:6541-6546`
- Modify: `apps\core\noname\game\index.js:6581-6586`
- Test: 客机浏览器运行时失败断言、载荷注入、双端联机和单机回归；不创建测试文件

**Interfaces:**
- Consumes: Task 2 的 `GameOverHandcardPoptipPayload[]` 和 `createGameOverHandcardPoptip(options)`；现有 `get.infoCards(infos): Card[]`。
- Produces: `isGameOverHandcardCardInfo(value)`、`isGameOverHandcardPoptipPayload(value)`、`restoreGameOverHandcardPoptips(handcardPoptips): void`；完整的 `Game.over(result, bool, handcardPoptips?)` 客机恢复流程。

- [ ] **Step 1: 在 Task 2 代码上复现客机缺少本地注册**

完成一局新主机加新客机联机游戏，在客机结算页执行：

```js
const handcardPoptips = [...document.querySelectorAll("noname-poptip")].filter(node =>
	node.getAttribute("poptip")?.startsWith("game_over_handcards_")
);
const missingDialogs = handcardPoptips.filter(
	node => !lib.poptip.createDialog.has(node.getAttribute("poptip"))
);
console.assert(handcardPoptips.length > 0, "客机必须收到稳定 ID 的结算 HTML");
console.assert(
	missingDialogs.length === 0,
	`客机缺少 ${missingDialogs.length} 个本地 poptip 回调`
);
```

预期：第二个断言失败，点击图标无有效手牌内容。

- [ ] **Step 2: 增加卡牌条目和载荷类型守卫**

在 `createGameOverHandcardPoptip` 后加入：

```js
const GAME_OVER_HANDCARD_POPTIP_ID_PATTERN = /^game_over_handcards_\d+$/;

/**
 * @param {unknown} value
 * @returns {value is GameOverHandcardCardInfo}
 */
function isGameOverHandcardCardInfo(value) {
	return (
		Array.isArray(value) &&
		value.length >= 3 &&
		value.length <= 5 &&
		typeof value[2] === "string"
	);
}

/**
 * @param {unknown} value
 * @returns {value is GameOverHandcardPoptipPayload}
 */
function isGameOverHandcardPoptipPayload(value) {
	return (
		typeof value === "object" &&
		value !== null &&
		!Array.isArray(value) &&
		typeof value.poptipId === "string" &&
		GAME_OVER_HANDCARD_POPTIP_ID_PATTERN.test(value.poptipId) &&
		typeof value.position === "string" &&
		value.position.length > 0 &&
		typeof value.name === "string" &&
		Array.isArray(value.cards) &&
		value.cards.every(isGameOverHandcardCardInfo)
	);
}
```

预期：零长度 `cards` 通过；非数组、长度小于三或大于五、缺少字符串卡牌名的条目失败。

- [ ] **Step 3: 增加逐项恢复函数和精确告警**

继续加入：

```js
/**
 * 恢复客机结算手牌 poptip；参数缺省时保持旧调用行为。
 *
 * @param {unknown} handcardPoptips
 * @returns {void}
 */
function restoreGameOverHandcardPoptips(handcardPoptips) {
	if (handcardPoptips === undefined) {
		return;
	}
	if (!Array.isArray(handcardPoptips)) {
		console.warn("联机结算手牌载荷无效：载荷必须是数组", handcardPoptips);
		return;
	}

	const poptipIds = new Set();
	const players = [...game.players, ...game.dead];
	handcardPoptips.forEach((payload, index) => {
		if (!isGameOverHandcardPoptipPayload(payload)) {
			console.warn(`联机结算手牌载荷无效（索引 ${index}）`, payload);
			return;
		}
		if (poptipIds.has(payload.poptipId)) {
			console.warn(
				`联机结算手牌载荷无效：重复 poptipId ${payload.poptipId}`,
				payload
			);
			return;
		}
		poptipIds.add(payload.poptipId);

		const target = players.find(
			player => String(player.dataset.position) === payload.position
		);
		if (!target) {
			console.warn(
				`联机结算手牌找不到角色（poptipId: ${payload.poptipId}, position: ${payload.position}），使用载荷快照`,
				payload
			);
		}

		let cards;
		try {
			cards = get.infoCards(payload.cards);
		} catch (error) {
			console.warn(
				`联机结算手牌恢复失败（poptipId: ${payload.poptipId}, position: ${payload.position}）`,
				error
			);
			return;
		}
		if (cards.length !== payload.cards.length || cards.some(Array.isArray)) {
			console.warn(
				`联机结算手牌恢复结果无效（poptipId: ${payload.poptipId}, position: ${payload.position}）`,
				payload
			);
			return;
		}

		createGameOverHandcardPoptip({
			poptipId: payload.poptipId,
			name: payload.name,
			cards,
		});
	});
}
```

预期：只捕获 `get.infoCards` 的转换错误；无宽泛包裹整个循环。缺失 Player 只告警，不阻止快照注册。

- [ ] **Step 4: 在插入 HTML 前恢复收到的第三参数**

```js
		if (game.online) {
			let dialog = ui.create.dialog();
			dialog.noforcebutton = true;
			restoreGameOverHandcardPoptips(handcardPoptips);
			dialog.content.innerHTML = result;
```

Task 2 已把主机的 `handcardPoptips = []` 放在此分支 `return` 之后，不需要移动。预期：`handcardPoptips === undefined` 时恢复函数立即返回且不告警；有效载荷总是在自定义元素连接 DOM 前完成注册。

- [ ] **Step 5: 运行完整核心 lint 与项目构建**

```powershell
pnpm --filter noname lint
pnpm build
```

预期：两个命令退出码均为 `0`；ESLint 无 error，构建完成且无 JavaScript/JSDoc 相关失败。

- [ ] **Step 6: 验证有效载荷、零张和多张手牌**

启动新构建：

```powershell
pnpm -F @noname/fs dev --dirname=".\dist" --port=8091 --server
```

预期：打印 `Server listening on port 8091`。使用 `http://localhost:8091/` 打开两个新客户端，完成一局包含存活、阵亡、多张和零张手牌的联机游戏。在两个客户端结算页执行：

```js
const nodes = [...document.querySelectorAll("noname-poptip")].filter(node =>
	node.getAttribute("poptip")?.startsWith("game_over_handcards_")
);
const ids = nodes.map(node => node.getAttribute("poptip"));
console.assert(nodes.length >= 2, "必须包含存活和阵亡角色入口");
console.assert(ids.length === new Set(ids).size, "稳定 ID 不得碰撞");
console.assert(
	ids.every(id => lib.poptip.createDialog.has(id)),
	"主机和客机都必须注册全部有效 poptip"
);
```

预期：所有断言通过。逐项点击并核对主客机角色名、卡牌名称、花色、点数、属性、顺序以及零张提示一致。

- [ ] **Step 7: 注入坏条目和缺失 Player 快照**

重新开始联机游戏。在主机游戏结束前，找到在线客机并安装一次性注入包装：

```js
(() => {
	const isGameOverWrapper = fn =>
		typeof fn === "function" &&
		/function\s*\(\s*result\s*,\s*bool\s*,\s*handcardPoptips\s*\)\s*\{\s*game\.over\s*\(\s*result\s*,\s*bool\s*,\s*handcardPoptips\s*\)\s*;\s*\}/.test(fn.toString());
	const client = game.players.concat(game.dead).find(current => current.isOnline2());
	const originalSend = client.send;
	client.send = function (fn, html, result, payloads) {
		if (!isGameOverWrapper(fn) || arguments.length !== 4 || !Array.isArray(payloads)) {
			return originalSend.apply(this, arguments);
		}
		client.send = originalSend;
		const missingId = "game_over_handcards_9999";
		const injectedHtml =
			html +
			`<noname-poptip poptip = ${missingId}></noname-poptip>`;
		const first = payloads[0];
		const injectedPayloads = [
			...payloads,
			{
				poptipId: missingId,
				position: "missing-player",
				name: "快照角色",
				cards: [],
			},
			null,
			{
				poptipId: "invalid-id",
				position: "0",
				name: "非法 ID",
				cards: [],
			},
			{
				...first,
				cards: "not-an-array",
			},
			{
				...first,
			},
		];
		return originalSend.call(this, fn, injectedHtml, result, injectedPayloads);
	};
})();
```

结束游戏后，客机预期：

1. 控制台分别出现缺失角色、空对象、非法 ID、坏 `cards`、重复 ID 的明确 `console.warn`。
2. 正常存活和阵亡角色入口仍可点击。
3. 新增的“快照角色”入口已注册，点击后显示“（没有手牌）”。
4. 没有未捕获异常，胜负结果和退出按钮正常。

再开始一局，安装只替换整体载荷类型的一次性包装：

```js
(() => {
	const isGameOverWrapper = fn =>
		typeof fn === "function" &&
		/function\s*\(\s*result\s*,\s*bool\s*,\s*handcardPoptips\s*\)\s*\{\s*game\.over\s*\(\s*result\s*,\s*bool\s*,\s*handcardPoptips\s*\)\s*;\s*\}/.test(fn.toString());
	const client = game.players.concat(game.dead).find(current => current.isOnline2());
	const originalSend = client.send;
	client.send = function (fn, html, result, payloads) {
		if (!isGameOverWrapper(fn) || arguments.length !== 4 || !Array.isArray(payloads)) {
			return originalSend.apply(this, arguments);
		}
		client.send = originalSend;
		return originalSend.call(this, fn, html, result, "not-an-array");
	};
})();
```

预期：客机只输出一次“载荷必须是数组”的 `console.warn`；结算 HTML、胜负结果和退出按钮仍正常，没有未捕获异常。

- [ ] **Step 8: 验证第三参数缺省与旧客户端安全退化**

启动 Task 1 保存的旧客户端构建：

```powershell
$baseline = Join-Path $env:TEMP "noname-4042-old-dist"
pnpm -F @noname/fs dev --dirname="$baseline" --port=8090 --server
```

预期：打印 `Server listening on port 8090`。执行两个方向：

1. 使用 `http://localhost:8090/` 的旧主机创建房间，`http://localhost:8091/` 的新客机加入并完成一局。新客机收到缺省第三参数，不出现“联机结算手牌载荷无效”告警，HTML、胜负音效和退出按钮正常；手牌 poptip 维持旧行为。
2. 使用 `http://localhost:8091/` 的新主机创建房间，`http://localhost:8090/` 的旧客机加入并完成一局。旧客机忽略第四个 `send` 实参，不崩溃，结算 HTML、胜负结果和退出按钮正常；手牌 poptip 维持旧行为。

两个方向都只验证安全退化，不把旧行为误判为完整修复。

- [ ] **Step 9: 执行单机回归**

在新客户端完成一局单机游戏，逐项确认：

```text
PASS 结算表格结构、统计数字、透明度和手牌图标不变
PASS 存活角色多张手牌可打开且顺序正确
PASS 阵亡角色手牌可打开
PASS 零张手牌显示“（没有手牌）”
PASS 退出、再来一局和录像保存流程可用
PASS 游戏结束前没有新增其他角色手牌数据发送
```

预期：六项均为 `PASS`。

- [ ] **Step 10: 提交客机恢复逻辑**

```powershell
git add apps\core\noname\game\index.js
git commit -m "fix: 恢复客机结算手牌弹窗" -m "Co-authored-by: Copilot App <223556219+Copilot@users.noreply.github.com>"
```

预期：提交成功，只包含类型守卫、恢复函数、可选参数和“先注册后插入 HTML”的客机流程。

## 最终验证与 PR 准备

- [ ] **重新运行静态检查和构建**

```powershell
pnpm --filter noname lint
pnpm build
```

预期：两个命令退出码均为 `0`，没有 lint 或 build error。

- [ ] **检查提交范围和工作树**

```powershell
git status --short
git --no-pager diff --check upstream/main...HEAD
git --no-pager diff --name-only upstream/main...HEAD
git --no-pager log --oneline upstream/main..HEAD
```

预期：`git status --short` 无输出，`diff --check` 无输出；产品代码变更只有 `apps\core\noname\game\index.js`，另含已批准的设计和计划文档提交；日志显示三个中文动词短语实现提交及文档提交。

- [ ] **清理临时基线构建**

```powershell
$baseline = Join-Path $env:TEMP "noname-4042-old-dist"
if (Test-Path $baseline) {
	Remove-Item -Recurse -Force $baseline
}
Test-Path $baseline
```

预期：输出 `False`；仓库内没有测试注入、探针或临时文件。

- [ ] **准备 PR 描述**

```markdown
## 原因

联机结算 HTML 引用了主机随机生成的自定义 poptip ID，但名称、手牌和 dialog 回调只存在于主机内存，客机无法恢复。

## 修改

- 使用按结算行递增的稳定 poptip ID，并统一存活和阵亡角色的手牌入口
- 主机在 Game.over 后发送 `{ poptipId, position, name, cards }` 纯数据快照
- 客机校验载荷、用 get.infoCards 恢复卡牌，并在插入 HTML 前注册本地回调
- 坏条目告警后隔离；缺失 Player 时继续使用有效快照；第三参数缺省和旧客户端安全退化

## 测试

- `pnpm --filter noname lint`
- `pnpm build`
- 主机与客机：存活、阵亡、多张、零张、坏条目、缺失 Player
- 新主机与旧客机安全退化
- 单机结算与退出/再来一局/录像保存回归

Fixes #4042
```

预期：PR 目标为 `libnoname/noname:main`，描述包含原因、验证命令、联机/单机结果和 `Fixes #4042`。
