# P0：来源标记架构审计（只读审计）

审计范围：`3e72c4b7980050c3b7d58adc53d232b64bb00791..c44be94`，共 31 个路径。原技能证据均由 `git show 3e72c4b7980050c3b7d58adc53d232b64bb00791:<path>` 读取；下文“原版行号”属于该提交，“当前行号”属于 `c44be94`。本审计仅新增本文，不改生产文件、既有文档、技能或配置，不执行部署，不提交 commit。

## 结论与阻断点

1. 当前提交是“通用显式账本 + 手工接入若干技能”，不是“旧技能全部自动获得来源语义”。`Player.addMark/removeMark` 对未追踪桶仍按旧逻辑运行；对已追踪桶只是改聚合值。`countMark/hasMark` 仍读聚合值。若要求旧技能文件保持原样并自动生效，当前交付尚不满足。
2. 7 个角色/模式文件可以在**文件依赖层面**全部回退：核心没有硬编码这些技能名，只通过 `sourceSkill -> lib.skill[sourceSkill].onOwnedMarkChange` 调通用钩子。但只回退这 7 个文件，会同时撤销来源创建、按来源读取、参数关联、转移、清理和技能关系投影，不能宣称来源需求仍成立。
3. 集中兼容层可以把选定的技能规则、适配器、显示覆盖从角色文件搬到统一模块，满足“原角色文件不改”。这仍是集中定义规则，并不等于从任意旧代码无损推导规则。无需让用户逐项手工迁移；工程内部仍需识别不同语义。
4. 暴戾、普通劫营和国战劫营原代码明确采用共享外部状态。要求“外部标记按施加来源独立、各自消费/回收”是本次产品规则调整，不能写成“原版本来如此”。这不阻止实现用户要求，但验收预期必须来自新要求。
5. 只拦截 `addMark/removeMark` 不足以覆盖：数值阈值、`markAuto` 数组、`storage` 直接赋值、动态技能、AdditionalSkill 提供者、禁用原因，以及没有显式转移标识的 remove/add。不能以词法扫描或几项单元测试证明全库通用。

## 31 个差异路径的分类

采用主要职责归类，混合文件同时说明次要职责；共 A=4、B=3、C=17、D=7，合计 31。分类不意味着某文件可独立删除。

### A：引擎账本、API 与生命周期（4）

- `apps/core/noname/library/element/ownedMarkStore.js`：新增纯数据关系账本；effect id/revision、来源身份、数量、JSON params、转移、精确消费、生命周期、旧匿名聚合值。
- `apps/core/noname/library/element/player.js`：新增显式来源 API；旧标记 API 兼容；重置和移除技能生命周期。混有 B：玩家身份状态、技能状态导入、标记恢复保护。
- `apps/core/noname/library/element/content.ts`：死亡流程 `await event.trigger("die")` 后，确认死亡才处理 `death` 生命周期。
- `apps/core/noname/game/index.js`：挂载账本桥接 API、竞技场初始化/录像初始化重置、角色永久移除清理。混有 B：录像 `ownedMarks` 接收入口。

### B：UI、联机同步与序列化（3）

- `apps/core/noname/game/ownedMarks.js`：账本到 `storage` 和标记 DOM 的投影，来源玩家身份映射，恢复与修订检查、广播、录像、显式存档，以及 `onOwnedMarkChange` 关系投影。该文件也包含部分 A 生命周期桥接；不能视为单纯 UI 文件。
- `apps/core/noname/get/index.js`：`arenaState` / `skillState` 导出 JSON 字符串账本。
- `apps/core/noname/library/index.js`：重连前重置、玩家身份恢复、竞技场恢复后导入账本。

### C：测试、文档与工具（17）

- `docs/owned-marks/API说明.md`
- `docs/owned-marks/execution-log.md`
- `docs/owned-marks/implementation-plan.md`
- `docs/owned-marks/migration-catalog.md`
- `docs/owned-marks/recovery.md`
- `docs/owned-marks/实施交付报告.md`
- `docs/owned-marks/工具与验证.md`
- `tests/owned-marks/camps-duorui.test.mjs`
- `tests/owned-marks/lifecycle-integration.test.mjs`
- `tests/owned-marks/player-fixture.mjs`
- `tests/owned-marks/player.test.mjs`
- `tests/owned-marks/relations.test.mjs`
- `tests/owned-marks/store.test.mjs`
- `tests/ownedMarksGame.test.js`
- `tools/deploy-owned-marks.mjs`
- `tools/scan-owned-marks.mjs`
- `tools/test-owned-marks-browser.mjs`

其中 deploy 是会写入交付目录的工具，不属于运行时核心；保留工具不等于授权重新部署。测试中的 Player facade/技能字面量加载验证特定函数关系，不能替代真实调度器、多客户端重连、全量技能和第三方扩展的验证。

### D：角色/模式规则（7）与回退条件

- `apps/core/character/extra/skill.js`：`drlt_duorui` 及普通 `drlt_jieying` 的关系写入、查询、消费和关系钩子。可以原文件回退，但需要集中适配层接管上述控制链；只保留账本不够。
- `apps/core/character/extra/translate.js`：劫营/夺锐规则改写。可回退原文件；若新行为保留，需集中提供准确描述，避免 UI 展示原规则而运行新规则。
- `apps/core/character/mobile/skill.js`：节谏从聚合 HP 阈值改为每来源参数关系；易宠修正为清理所有雀。两部分不是同一种“标记独立化”，回退及兼容策略应分开。
- `apps/core/character/mobile/translate.js`：节谏描述改为只移除自己的标记、以最近一次交牌时 HP 为阈值。可回退原文件，但新规则描述需在集中层覆盖。
- `apps/core/character/newjiang/skill.js`：焰狱的来源×花色关系、收益过滤及技能投影。可回退原文件，但不能用单个共享花色数组继续表达各来源花色。
- `apps/core/mode/guozhan/src/skill/character/wushuang.js`：国战劫营独立来源创建、移动、收益和回收。可回退原文件，但必须保留国战“回收营”与普通“销毁营”的区别。
- `apps/core/mode/guozhan/src/translate/skill/character/wushuang.js`：国战新规则描述及文件末尾换行。可回退；行为和描述必须配对。

“7 个文件能回退”是源码组织判断，不是“7 份规则都可凭空删除”。若追求完全不改角色文件，可以在加载后统一注册策略/包装技能。对复杂技能直接集中替换相关方法，也属于规则适配；不能称作已证明的任意技能自动推导。

## 当前核心的精确控制链

显式路径：`bearer.addOwnedMark(name, owner, count, options)` → `Player._mutateOwnedMarks` → `OwnedMarkStore.grant` 在私有 draft 验证并提交 → store `onChange` → `game.syncOwnedMarks` → `project` 写聚合 `storage[name]` / 更新 DOM → 按 `sourceSkill` 调 `onOwnedMarkChange` → 主机广播 JSON 与写录像 → `_mutateOwnedMarks` 按总量差异排入 add/removeMark 事件。

该链要求**调用者提供 owner 和 params**。账本保存 creator / owner / beneficiary / bearer 四个角色，但调用者未指定时前三者默认同一 owner；核心不会根据实际效果自动区分这些角色。

旧 API 路径：`addMark/removeMark/syncStorage` → `_legacyOwnedMark`；只有已有 `_ownedMarkIdentity` 且账本 `isTracked(bearer,name)` 才进入 `legacySet`，否则继续旧实现。`legacySet` 增量进入 anonymous；减量先扣 anonymous，再按 effects 数组顺序扣已知来源。它是确定性的聚合兼容，**不是按本次发动者来源扣除**，也不追踪转移。当前 `countMark/hasMark` 没有来源上下文过滤。

恢复路径：导出 `{ledger,players}` → JSON 传输/录像 → import 验证 session、revision、玩家绑定 → `restore` → `project(...,{restoring:true})`。普通数值投影避免调用 add/removeMark；关系钩子自行实现恢复专用 attach/detach。来源账本和其派生技能关系必须一同恢复，不能只恢复图标总数。

## 原版徐荣 / 凶镬：不能跳过的共享控制链

角色定义在原版 `apps/core/character/xianding/character.js:927`，`xurong` 的技能是 `xinfu_xionghuo`、`xinfu_shajue`。技能正文在 `apps/core/character/sp/skill.js:46009`，不是 xianding 技能文件；描述在 `apps/core/character/sp/translate.js:37`。这三个位置均未出现在本次 31 文件差异里。

原版完整链：

1. `xinfu_xionghuo_init`（46083–46099）：游戏初始 `phaseBefore` 或 `enterGame`，本人少于 3 时补至 3。`xinfu_shajue`（46191 起）也会给本人补充同名资源，通常上限 3。
2. 主技能（46011–46021）：自身 `countMark > 0` 才可发动；`filterTarget` 是 `player != target && !target.hasMark("xinfu_xionghuo")`，所以目标只要有任何同名暴戾就拒绝。随后本人 remove 1、目标 add 1，没有来源字段、没有 transfer 操作。
3. 增伤子技能（46101–46112）：对其他角色造成伤害时，仅看受伤者同名聚合 `countMark > 0`，不核对是谁给予。持有凶镬的 A 可以从 B 给予 T 的暴戾受益。
4. 开始子技能（46114–46160）：所有技能持有者监听 T 的 `phaseUseBegin`；过滤仅看 T 的聚合标记和 T != 当前技能持有者；content 先移去 T 的全部同名标记，再随机一次分支。因真实触发队列可能预先收集多个候选，原版多个持有者在同一时点是否都继续执行，需要调度器复核；不能仅凭此 filter 断言“必定只执行一次”或“必定每人一次”。
5. 分支 0 造成无显式 source 参数的火焰伤害，然后 `markAuto("xinfu_xionghuo_disable", [player])` 保存禁止攻击的施加者。分支 1 失去体力及同名手牌上限惩罚；分支 2 当前技能持有者随机获得两张可获得的牌。派生禁杀是来源列表，但这不能反推被消费的外部暴戾原本属于谁。

原描述明确写“对有暴戾标记的其他角色”及“移去所有暴戾”，没有“你给予的”。因此用户要求的外部来源独立应定义为新规则，且至少同时影响：目标资格、给予/移动、增伤归属、出牌阶段消费、随机分支收益与禁杀归属、清理策略。只把 remove 改成按来源扣除会漏掉早期 `filterTarget`，其他来源仍无法叠加。

**最小新规则反例**：A 和 B 均有凶镬，T 无暴戾。A 给 T 一枚后，原版 B 的 `filterTarget` 直接返回 false；核心只给 addMark 附来源，无法让第二次施加发生。若将 hasMark 全局改为“本来源”，T 自己及其他公共查询又可能看不到真实状态。因此读操作需要按技能/场景声明是“任意来源”还是“当前来源”。本人暴戾是自用资源，外部暴戾才是用户要求独立的关系，两者又共用同一 key；按名称一刀切也不够。

## 普通劫营与国战劫营：原版差异必须保留

普通劫营原版 `extra/skill.js:3902–4072`：

- `phaseBegin` 时用 `!game.hasPlayer(current => current.hasMark(...))` 判断**全场**无营，才给本人一枚。
- `phaseJieshuBegin` 时本人有任意营，目标必须没有任意营；content 读取本人聚合数、remove、target add（3985–3991）。这两次操作是转移意图，但旧 API 未保留 effect identity。
- 摸牌阶段由每个劫营技能持有者监听并 +1（3904–3912）；出杀/手牌上限为营持有者加**全场有效劫营持有者人数**（4028–4045），不是营的已知来源人数。
- 其他营持有者 `phaseEnd`，每个满足过滤的技能持有者都可能进入回收候选；content 创建给牌事件后先 clearMark 再 await 给牌（4011–4018）。普通版移除营，不把营还给本人。触发队列的再次校验不能凭此片段推断。

国战原版 `wushuang.js:1026–1184`：

- 游戏初始、入场及本人回合开始创建，同样要求**全场**没有营（1028–1041）。
- effect 监听 `phaseEnd/phaseAfter`。`(name=="phaseAfter") === (player==event.player)` 的过滤排除“别人 phaseEnd”和“自己 phaseAfter”，故自己回合结束可转移、别人回合结束后回收。
- 送出也是本人聚合 remove + 目标 add（1103–1107）。回收先 await 取得目标可获得手牌，再读取目标聚合营、remove 并 add 回本人（1109–1116）。这与普通版的销毁和顺序不同。
- 摸牌、出杀、手牌上限也是按全场劫营持有者数量加成，而非营来源数（1126–1161）。

当前实现改成“每来源独立一枚、同一目标可以多来源、只按实际有效来源加成、仅处理自己的营”，并把国战营的回收提交移动到给牌 await 之前。这包含共享规则变更和提交时序修正，不是简单 API 替换。

**最小反例**：A、B 都有劫营，A 的营在 T；原版 B 回合开始不能新建营，而独立规则应允许。T 的原版加成为 +2，即使只有 A 的营；若集中策略要求实际来源加成，新规则应为 +1。只给 remove/add 加 owner，`game.hasPlayer`、`game.countPlayer` 仍会产生原版共享结果。国战回收若继续在 await 后才取标记，等待期间别的效果可能改变营，回收将误取后来的来源；需先选定并原子迁移准确 effect，再异步拿牌，或明确另一种新规则的时间边界。

## 节谏：数字不一定是标记数量

原版 `mobile/skill.js:13116–13215`：给牌事件结束后，取 `num = target.hp - target.countMark("mbjiejian_mark")` 再 `addMark(num)`，意图用一个数字覆盖“赠牌时 HP 阈值”；非己方非装备牌唯一目标保护只看任意节谏；`phaseEnd` 消耗聚合数字并比较 HP 后奖励当前技能持有者。

必须区分意图和实际执行：原版 Player.addMark（4798–4805）遇 `num=0` 会强制设为 1，且允许负增量。因此目标旧阈值恰等于当前 HP 时会意外 +1；原版 remove 内容还使用 `event.targets[0]`，而非 `trigger.player`。当前提交顺带修正了这类问题。不能用“原版稳定地 set 到 HP”作为严格行为等价证明。

**最小信息丢失反例**（避开零增量 bug）：A 在 T HP=4 时给牌，数字成为 4；B 在 T HP=2 时给牌，num=-2，数字成为 2。T 回合结束 HP=3：独立阈值规则应 A 不奖励、B 奖励，原聚合只剩 2。仅凭最终数字 2，无法判断它是 A 的阈值、B 的阈值或两来源合计；将负增量解释成“移除 A 的两枚数量”更不符合阈值含义。

在运行时写入点记录来源和**赋予时 HP 参数**，并让清理/比较按来源关联，才可正确结算。集中策略可以识别该技能的“每来源最新阈值”，无需改原技能文件；但不是普通数量账本可自动猜出的操作。保护状态是否跨来源共享和收益是否按来源，亦是两个不同查询策略；当前代码前者共享、后者独立。

## 焰狱：两个集合不能恢复二元关系

原版 `newjiang/skill.js:1445–1478`：展示牌得到 suits；给除选定防具对象外的所有角色（包括自己）`markAuto("yj_yanyu_fire", suits)`；另将 player 加进独立 `yj_yanyu_source` 来源集合；所有来源技能持有者在 `useCardAfter` 判断“本人在来源集合”且“使用牌花色命中共享 fire 集合”便摸牌。改牌 mod 也读 fire 集合。

**最小不可逆反例**：T 最终 suits={heart,spade}、sources={A,B}，可以来自历史 H1：A=heart、B=spade；也可以来自 H2：A=spade、B=heart。两个旧数组完全相同，但 T 使用 heart 牌时，按独立规则 H1 只应 A 摸牌、H2 只应 B 摸牌。把两个集合做笛卡尔积会同时奖励 A、B，不能称为恢复原始来源×花色关系。

新发生的施加可以在上下文完整时集中记录 tuple `(owner,bearer,suits,effectId)`。已经丢失配对的旧存档不能仅凭最终集合精确恢复；有完整可信操作日志时可以重放，有唯一外部证据时可以确定，否则应保留匿名兼容状态并采用明示策略。当前实现保留旧 fire 为匿名转换，不按旧 source 数组猜收益，是保守选择，但会改变旧存档的奖励表现，须作为兼容限制记录。

## 夺锐与易宠：来源不只存在于数字标记

夺锐原版 `extra/skill.js:3543–3674` 在施加者存 `drlt_duorui` 与 `drlt_duorui_player`，同时覆盖受害者同名数组；`drlt_duorui1.init` 用同一个字符串作为禁用原因，移除时 `enableSkill(skill)` 撤掉该原因。当前 Player.addTempSkill（12065 起）对于已经永久有的同名技能直接返回，对于已存在的临时技能再次调用 addSkill 通常也不会重新初始化。多个施加者的“技能列表 + 受害者 + 结束时间 + 禁用原因 + 获得提供者”不能由同一个数组和同一个禁用原因表达。集中策略需要每 effect 的禁用原因和 AdditionalSkill provider，并在恢复时重建；单纯数字 provenance 不会触及这条控制链。

易宠原描述 `mobile/translate.js:813` 明确“移除场上的所有雀”；原 content（16908–16913）仅清当前施加者动态 key，故当前 `clearMarks()` 修正全场同族标记清理，并标注动态 `sourceSkill`。这是一条明确的**共享替换规则**，若全局强制“所有删除都只能删自己来源”，反而重新引入错误。它可以通过集中策略统一清除该技能族，不能归入所有标记都独立的默认规则。

## remove/add 不携带转移意图的最小反例

观察到 API 流 `X.removeMark(K,1); Y.addMark(K,1)`，既可能是“把原 effect 从 X 移到 Y，保留 creator、owner、参数及过期”，也可能是“消费 X 的一个 K，然后新给 Y 一个 K，形成新 effect 与新过期”。两段 API 流、数量和当前发动者完全相同。X 还可能持有 A、B 两个来源的同名 K，聚合 remove 本身也不说明选了哪一枚。无已注册策略或显式 effect/transfer 意图时，无通用无损判别函数。

集中兼容层可以对**已识别的转移控制链**注册规则，把同一技能事务中的 remove/add 合成精确转移；不应把任意相邻同名 remove/add 自动当转移。异步嵌套、其他触发者插入、部分转移和参数差异都需要事务边界，不能依赖一个全局“最近 removed mark”缓存。

## 可行的集中策略边界

建议把“无需逐角色改文件”作为代码组织约束，把“来源独立/共享/自用”作为明确运行时策略，而非同一名称自动决定：

1. 核心统一保留稳定身份、effect 账本、原子消费/迁移、生命周期、同步与序列化。旧 API 默认仍保持聚合兼容，避免没有依据地改变全库行为。
2. 注册表按技能家族和操作类型集中描述：自用数量、外部来源关系、来源参数、公共状态查询、来源限定查询、全场共享替换、transfer、技能借用关系。对被要求的暴戾明确区分本人资源和外部关系；对劫营区分普通销毁、国战收回；对易宠明确全族替换。
3. 在技能加载/展开后统一应用适配器，使原 character/mode 文件可以恢复 baseline。适配范围可以包含 filter/cost/content/mod/intro、临时技能、动态技能和恢复 hook；保留原方法供审计，并防止重复包装。翻译可从同一注册表生成运行时覆盖。
4. 每次执行带栈式技能上下文，包含真实技能持有者、触发玩家、受体、原始技能和 effect，异步和嵌套必须保存/恢复。上下文只能帮助记录**已经有证据**的来源，不能把当前事件 source、当前回合者或最近调用者一律当 owner。
5. 对能无歧义追踪的新操作自动建立关系；对缺失语义的数据保留匿名桶并报告覆盖缺口。可以继续自动扫描和扩展策略，但不得把“发现了 addMark”提升为“已理解规则”。第三方动态代码或直接 storage 写入不在当前 31 路径证明范围。
6. 验收必须包含原文不变的完整技能链测试：第二来源能否通过 filter、消费谁的 effect、公共查询和来源查询是否各自正确、阈值/花色是否关联、await 前后顺序、禁用原因和提供者是否独立、失效/失去技能/死亡/重置/复活、录像重连与旧数据匿名兼容。数据层测试不能独自证明这些结论。

本文未提出“无法做集中适配”，也未证明“所有旧技能都能自动推导”。可确定的是：当前架构还缺少集中策略和执行上下文层；如果删除 D 而不补这两层，需求会回退。后续是否保留、重构或替换当前账本，应由这项约束和实际控制链验证决定。

## 审计取证与验证

- `git diff --stat <baseline> c44be94`：31 files，2188 insertions，148 deletions。
- `git -c core.quotepath=false diff --name-only <baseline> c44be94`：逐项核对上述 31 路径，无额外隐藏角色路径。
- `git show <baseline>:...`：读取 sp 凶镬/描述、xianding 徐荣定义、普通/国战劫营、节谏、焰狱、夺锐、易宠及 Player 原标记/禁用实现。
- `git diff <baseline> c44be94 -- apps/core/noname apps/core/character apps/core/mode/guozhan`：核对 A/B/D 变化及混合职责。
- 本次属于源码架构审计，没有执行全库测试或宣称联机/调度器行为已经验证；有关预收集触发队列的结论均保留为待真实调度验证项。
