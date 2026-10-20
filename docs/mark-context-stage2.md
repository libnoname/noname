# Mark 来源上下文：第二阶段实现与验证

日期：2026-10-20。仓库 zziyoo/noname，分支 `标记认主`；基线 `f604fd50c870bda892ae25257c2f090a245193fd`。

本阶段修改现有 Mark API、技能执行边界、编译链和状态恢复。没有修改武将、国战武将或技能描述，没有新增 OwnedMark 等平行公开 API。本报告不能作为全体武将或完整联机对局已验收的结论。

## 1. 架构和适用边界

`storage[mark]` 仍保存旧式数值或数组，始终是显示和旧代码读取的聚合值。Player 私有 `_markSources` 保存来源份额与聚合快照，`_markSourceRevisions` 保存该持有者、该标记的版本。来源身份使用实际 Player 的非空 `playerid`；不会根据武将 ID、技能 ID、名称、座位或任意 `event.player` 推断玩家实例。

无来源旧调用有两种执行语义：

- 在明确登记的来源标记、明确登记的技能执行范围内，使用调度器提供的实际技能持有者。
- 其他范围保持旧式聚合操作；新增加的数量没有来源证据时属于未知份额，绝不自动归给当前回合角色。

因此本实现是“可信执行上下文 + 已审核语义声明 + 原 API”，不是所有旧技能的自动私有化。来源证据与标记是否允许共享是两个不同问题，后者不能从调用表达式判断。

最小不可区分反例：两个技能都执行 `target.addMark("m", 1)`，之后都执行 `target.hasMark("m")`。一种规则允许全场共用，另一种规则只允许施加者消费。调用、目标、当前执行者可以完全相同，只有规则语义不同；没有声明时，引擎不能判断应该隔离还是共享。本实现对此保持原行为。

## 2. 现有接口

原有位置参数保留：

```js
bearer.addMark("m", 1, false, { source: creator });
bearer.removeMark("m", 1, false, { source: creator.playerid });
bearer.countMark("m", { source: creator });
bearer.hasMark("m", { source: creator });
bearer.clearMark("m", false, { source: creator });
bearer.setMark("m", 2, false, { source: creator });
bearer.markAuto("array", [member], { source: creator });
bearer.unmarkAuto("array", member, { source: creator });
```

`{ source: null }` 只访问未知份额。`{ aggregate: true }` 强制访问总量；例如 `countMark("m", {aggregate:true})`、`clearMark("m", false, {aggregate:true})`。明确 source 优先于上下文。

不传 options 的普通标记、共享标记、自身资源仍采用原行为。仅在已审核的来源执行范围内，不传 options 才自动访问当前来源。默认 `countMark` 不是在所有代码中都隔离；普通查询、显示和范围外查询仍然得到合计。

`markSkill`、`unmarkSkill` 保持显示管理职责，不凭一次显示调用创造来源，也不把一个显示标记拆成多个独立技能。保留原 intro。它们的广播携带已有来源快照，防止较旧显示广播覆盖较新状态。本阶段没有新增悬停来源 UI。

## 3. 数据不变量与转移

- 数值标记：所有已知及未知份额的和等于 `storage[mark]`，不允许负份额、非有限源数量或浮点舍入造成的虚增。
- 数组标记：聚合数组成员保持原对象引用；同一个成员可由多个来源保有，最后一份成员关系消失后才从聚合数组移除。
- 直接替换、删除或改变 storage 后，无法证实的旧来源失效，新的聚合值成为未知来源，不能复活过期份额。
- 一次 Mark 数值更新先校验、再提交聚合和来源，再产生同步/事件。添加和删除事件附带 `markSource` 供审查。
- 无明确来源的聚合删除仍先消费未知份额，再按来源登记顺序消费，保持上一阶段兼容约定。

集中声明的 `transferSkills` 才允许把旧 remove/add 组合视为转移。底层记录该技能事件内**实际成功移除的数量**；后续 add 只允许使用相应收据，不会根据请求数量凭空创建，也不把所有相邻 remove/add 都视为转移。来源不因持有者变化而改变。

这不是跨多个 Player 的通用回滚事务：如果来源 remove 已成功，目标 add 随后抛错，不会自动撤销之前的删除或已经发生的牌移动。收据与 claim 是弱引用的事件内数据，不写入存档。通用的跨任意技能的转移、所有副作用的全局原子结算不在本次实现之内。

## 4. 可信执行上下文和异步

`GameEvent/ExecutionContext.js` 用 WeakMap 保存技能调度器明确赋予事件的执行者元数据；父子事件可以继承，但任意事件的 player 属性不是来源证据。主动 useSkill、触发技能、filter、mod、初始化及 onremove 等边界传入实际技能持有者。

同步 active frame 在每次调用 finally 中恢复；等待 Promise 时没有 owner 长驻全局。原生 async/await 在 Vite 正式构建、开发加载和有游戏导入的 JIT 扩展模块中被编译成恢复 frame 的 generator continuation。保留外层 AsyncFunction 身份，兼容现有 ContentCompiler 分类。

明确注册的 Promise.then、计时器和 GameEvent.then 回调捕获注册时的 frame。选择事件上的过滤/AI 回调绑定其事件元数据，避免 UI 延迟调用离开技能执行段后读成总量。事件栈按实际完成事件出栈，嵌套/交错根事件的父事件优先使用当前执行段。

编译器仅降低 async，避免给同步 Step 内容注入 __rest 等模块闭包。生成 awaiter 使用保留属性 `__nonameAwait` 标记；StepCompiler 在重编译时注入该依赖的实际别名，兼容 Rollup 改名和同步 Step 内的 async callback。没有重新注入任意武将模块闭包。

沙箱框架 `noname/util/sandbox/` 必须可在无游戏 import map 的独立 iframe 中加载，保持原生；不向它注入主引擎导入。独立 worker 没有 noname 导入时，JIT 不引入 DOM 引擎。

编译依赖 TypeScript 5.9.3 的内部 ES2019/ES2017 转换器；缺失时明确失败。这是升级 TS 时必须复测的兼容边界。含 `for await` 的模块保持原样，本次不承诺恢复这类原生 continuation。

## 5. 集中语义清单

声明位于 `Player/markSemantics.js`，只保存规则数据，不复制技能函数。

- `drlt_jieying_mark`：multi。来源范围为劫营及三个子技能；结束阶段子技能转移，回收子技能消费。
- `gz_gn_jieying_mark`：multi。保留国战版给牌后回营的原始流程，使用转移收据和消费 claim。
- `xinfu_xionghuo`：multi。初始化、施放、增伤、惩罚及 `xinfu_shajue` 明确关联实际持有者；自身的三份资源与外施份额用同一 API 管理，但不会属于另一实例。
- `new_wuhun`、`wuhun`：shared，保持总量可见。
- `baonu`、`renjie`：resource，保持旧行为。
- 其他未声明标记：保持原语义，不宣称已自动认主。节谏、焰狱、夺锐以及动态禁用/附加技能关系，没有在本轮批量迁移。

劫营原始标记收益里存在按全场技能持有者数量计算的旧代码。仅在声明的标记收益执行范围，人口查询限制为给当前持有者实际贡献该标记的来源；不是全局修改所有 hasPlayer/countPlayer 的含义。

消费效果进入内容前，按“持有者、标记、来源”申请 claim；来源已消失或正在另一次结算中时，不再执行该份效果。claim 在 await 的 finally 中释放。显式来源/聚合操作是有意的管理覆盖，不受自动上下文 claim 屏蔽；因此它不是防止任何外部代码修改的锁，也不能撤销已经发生的副作用。

## 6. 规则变化和结算顺序

原版凶镬判断的是目标是否有同名标记，没有来源判断。本项目要求多徐荣独立，这是明确的规则细化/变化；不会据此改变其他共享标记。

同一目标有两份营时，收益按实际贡献来源计数，避免一个来源的营被无关技能持有者放大。原版回收按事件队列顺序逐个执行：先结算的合法来源获得当时的手牌，后结算的来源只能获得剩余手牌；本次没有创造手牌副本或分摊手牌的新规则。国战版各来源按原流程收回自己的营。

死亡、失技能、技能暂时失效、暂离、复活和永久移除不是同一种状态。本次不强制把任何一种状态解释成清理所有外部来源。技能注册/资格仍由原引擎管理，份额按原技能语义保留；例如失去劫营不会让另一神甘宁获得遗留营的管理权，原实例重获技能后可以访问自己的份额。未增加新的死亡/换将统一清理规则。

## 7. 同步、录像和恢复

私有 wire 协议 v1 携带 kind、revision、entries，与原聚合值一起替换。数字份额校验总和；数组来源用聚合数组的索引编码，恢复时复用同一成员对象。重复、较旧消息被拒绝；未知版本或非法总量在修改前报错。不存在来源信息的旧数据只恢复旧聚合值。

`syncStorage` 的网络广播、录像 storage 事件分别处理，不能互相代替。录像额外记录真实玩家实例 ID 绑定；回放按录制顺序强制应用快照。getState、get.skillState、applySkills 和重连入口携带编码后的 markState 字符串，避免原网络递归深度限制截掉内部数组索引。重连在全部玩家登记后第二遍恢复，以支持自引用和前向 Player 引用。

这些 revision 是同一 Player 状态序列内的版本，不是跨服务器/跨会话的共识、认证或冲突合并协议。混用新旧客户端无法保证新来源行为；自定义模式如果仅保存 storage、不走上述状态接口，则不会保存来源。本次没有逐个改写所有模式的独立存档格式。

## 8. 验证结果和证据分类

### 自动化单元/模拟

`node --test tests/event-context.test.mjs tests/mark-api.test.mjs tests/mark-context-boundaries.test.mjs`：47 项，45 通过，2 项已知失败以 TODO 保留，0 个未预期失败。TODO 不代表支持已实现。

Mark 测试使用真实 Player 方法及真实数组 polyfill，模拟 DOM、广播及动画边界；覆盖数值/数组、显式源/未知源/聚合、自动上下文、共享与资源、浮点一致性、广播乱序、旧数据和 wire 校验。

`MARK_STRICT_CONTEXT=1` 下两个边界断言应失败：动态 `new AsyncFunction` 的原生 await 没经过编译；其他未注入运行域的 Promise 回调没有相同上下文基础设施。两者恢复后的来源为 undefined，不猜成某个玩家。需要通过加载编译链或显式 source 解决，不能宣称所有扩展自动兼容。

### Chrome 真实调度、源码及正式产物

`tests/browser/run-cdp.mjs`：源码与正式产物各 19 组通过，无未捕获异常。使用真实 Player.addSkillTrigger、GameEvent.trigger、主动 useSkill、filter/content、Array/Step 编译器和实际事件队列。测试没有改写技能函数，没有给旧技能调用手工添加 source。

覆盖：原版双徐荣及三种随机惩罚、双神甘宁、国战回营、多来源与交错等待、同一来源重复结算、拒绝子事件后的 claim 释放、失技能/重新获得、不同武将获得同技能、共享梦魇及暴怒忍戒、GameEvent.then、同步 Step 中嵌套 async，以及重连实际恢复阶段。

牌移动、伤害/失血最终执行、手动选择、声音/动画和 socket 均使用确定性的测试边界替身。数组来源的 serializer、applySkills、video storage handler 与重连恢复阶段执行真实实现；这不是一次真实断线重连或完整录像播放器测试。

正式产物通过默认 `pnpm -F @noname/jit build`、`pnpm -F noname build` 生成，测试动态加载打包后的 character/extra.js、character/sp.js、mode/guozhan.js。生产测试页只增加夹具，不修补引擎或武将产物。用项目 @noname/fs 服务的默认 index.html 启动冒烟通过。普通 Python 静态服务器缺少游戏文件接口，不用于判断正式入口通过。

完整多人联机、录像播放器从头回放、所有模式读档、实际死亡复活/换将和完整人机对局尚未全部验证，不能用上述结果替代。

### 静态检查与审查

本体和 JIT eslint 通过。相对 f604 的 TypeScript 诊断比较：基线 7359，当前 7359，新增 0；项目完整类型检查本身仍有基线错误，不能写成 tsc 全绿。

独立代码复核发现并修复 Step 嵌套 async helper 丢失和重连前向 Player 引用丢失；两项均增加回归。默认启动冒烟还发现并修复了向独立沙箱框架注入主引擎 import 的回归。

证据保存在本地 audit/mark-stage2-*.log、*-results.json、*-delta.json；可复核 JSON（含来源账本和实际执行记录）会随集成测试提交到 tests/results/mark-stage2，Chrome profile/旧审查备份不提交。

## 9. 重跑和人工测试

```powershell
node --test tests/event-context.test.mjs tests/mark-api.test.mjs tests/mark-context-boundaries.test.mjs
node tests/typecheck-mark-baseline.mjs
pnpm -F @noname/jit build
pnpm -F noname build
node tests/browser/prepare-production.mjs
pnpm -F @noname/fs dev --dirname=../../apps/core/dist --port=8083
# 另一终端
$env:MARK_TEST_URL='http://127.0.0.1:8083/tests/mark-integration.html?production'
$env:MARK_REPORT='audit/mark-stage2-production-results.json'
node tests/browser/run-cdp.mjs
```

客户端人工重点：同将模式双徐荣向同目标施加、分别增伤和惩罚；双神甘宁独立起营、给同一目标后回收；国战给牌后营返回原来源；共享梦魇仍按总量；普通资源不串号。请记录实际发动者、来源份额、总数量、收益者、结算顺序和最终状态。单纯悬停文字不是归属验证。

客户端 Electron 包装版本为 1.11.0；其资源内是可单独同步的编译引擎，源码 core/package.json 为 1.11.7。运行入口是 resources/app/app/main.js 启动文件服务，再加载 http://localhost:8089/index.html。不能只改 resources/app/src 或开发源码。

同步需要一并更新引擎、JIT 和经过同一 async 编译的武将/模式/卡牌产物；这不是修改武将技能源码。仅覆盖 player.js 会缺少可信 continuation。同步清单与逐文件原件备份在客户端 audit/mark-stage2-runtime-backup-20261020/manifest.json；不覆盖 Electron 主程序、扩展、图片音频和用户配置。

## 10. 提交与验收结论

- `8ae3bd320`：可信技能 frame、构建及 JIT async continuation 基础。
- `bd0e99619`：集中来源语义、旧 API 选择器和劫营来源贡献查询。
- `0deb2d622`：回调绑定、交错事件父子/出栈、Step 编译依赖、已知失败边界。
- `476134043`：消费 claim、转移收据、版本化来源同步与恢复、Mark API 回归。
- 集成测试与本说明独立提交，确切 SHA 见最终 git log。

客户端已经备份并同步 97 个编译运行文件，逐文件 SHA-256 校验一致；实际 noname.exe 已打开到模式选择页。只读探针确认加载引擎提交 476134043，来源恢复接口已加载。Electron 包装版本 1.11.0、core 包元数据 1.11.7、现有游戏资源 lib.version 1.11.6 分别记录，未用其中任意一个代替真实构建 SHA。尚未把用户手动对局结果计为通过。

本阶段已证明：未经改写的两组原始技能能通过已审核声明在真实调度器及正式构建产物中区分来源。没有证明所有旧技能、任意动态代码、所有联机/录像/存档路径都自动安全。待人工对局和未覆盖路径审核后，再决定下一阶段；不继续批量修改武将。
