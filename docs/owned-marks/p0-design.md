# P0 设计边界与验证计划

本轮范围：审计既有31文件，验证原始技能能否由底层服务，补统一来源提示。冻结 character 及国战武将目录；不自动撤销旧成果，不把实验策略部署到正式游戏。新实现是用于可行性验证的兼容基础设施，尚不是全库完成态。用户已明确授权本轮底层验证；完全自动兼容不成立后的扩展方案等待审核。

## 选择与理由

1. 全自动猜测来源：不采用。执行者不总是创建者；聚合调用不带语义、实例、阈值或转移意图。普通 async 跨 await 的 JS 全局变量也不能隔离其他回调。武将名、技能名、座位和 `_status.event.player` 均不能替代来源。
2. 全部技能迁移到显式 API：上一版路径，只保留账本后端价值。本轮不扩大；原31文件中7个武将文件冻结，未直接回退，以免撤掉仍然需要的已实现功能。
3. **声明式语义策略 + 引擎明确的执行边界 + 现有账本后端**：本轮验证。先证明一类原始数值技能可用，不承诺自动解释任意 storage 或所有规则。特殊语义需声明；如果只把每个技能函数搬进表中，仍是逐技能补丁，不作为最终架构目标。

## 兼容策略契约

`game.registerOwnedMarkPolicy(name, descriptor)` 在本局账本首次事务前声明，字段为：

```js
{
  semantics: 'multi', // private | multi | shared | resource
  skills: ['明确的主动/触发/子技能ID'],
  sourceSkill: '规则族的生命周期入口',
  query: 'owner', // owner | all
  remove: 'owner', // owner | all
  selfResource: true,
  lifecycle: {ownerDeath:'retain', bearerDeath:'remove', skillRemoval:'remove', reset:'remove'}
}
```

技能 ID 只用于确定**这条已声明规则适用于哪段代码**，绝不作为玩家身份。actor 来自引擎明确传入的 Player。同名角色仍有独立的稳定账本身份。

- 无声明：旧数值／数组／共享行为不变，不推断 owner。
- shared/resource 声明：保留原聚合操作；UI 标明共享或自身资源，不虚构外部创建者。
- private/multi 声明且执行边界、技能范围匹配：旧 addMark 创建该 actor 的份额；query=owner 时原 has/count 查询本来源，remove=owner 时只减本来源。selfResource 允许 actor 自身使用旧匿名资源，但外部匿名份额不被据为己有。
- 默认 countMark、hasMark 在作用域外仍看合计。显式 `{scope:'all'}` 始终聚合；`{scope:'owner',owner:playerOrId}` 指定来源。
- 无可靠作用域的私有写入：add 记为匿名；remove/clear 只能减匿名，不碰已归属份额。未知调用不是按当前回合补 owner。
- 旧 clearMark(name,log,options)、removeMark(name,num,log,options)、setMark(name,num,log,options) 可明确指定 owner/all。否则遵循注册策略。没有声明就不静默改变旧 remove 的聚合含义。
- 数组／对象不被数值策略改造成数值，未声明转移的 remove+add 不被猜成转移。

策略用 JSON 随账本状态导出／恢复，整份验证后才提交；不支持本局账本已有事务后的动态注册。尚未提供不同协议版本混用大厅的能力协商，属于原型边界。

## 可靠执行上下文

`withMarkExecution(actor,skill,callback,{phase,event})` 只覆盖 callback 的同步执行。返回 Promise 就立即恢复前一上下文，绝不 push 后 await/finally。null 明确屏蔽外层 actor。

`bindMarkExecution(event,actor,skill)` 使用 WeakMap 给引擎创建的技能事件绑定元数据，不从可变 event.player 回溯来源。ArrayCompiler 每次调用原始 step/async 函数时 runMarkContent；未绑定事件使用 null。旧 step 每步能恢复绑定，原生 async 首次 await 后不能凭这套同步机制恢复。

接入点：filterTrigger/filterEnable 的显式 player+skill；createTrigger 创建的 cost/content；useSkill 及 contentBefore/content/contentAfter；init/onremove；backup 的 filterTarget 与创建时捕获 scope 的 chooseTarget 回调。mod 执行隔离调用者作用域，因为全局 mod 的 subject 与 provider 未必相同；未随意选择 globalmap 中某个 provider。

`captureMarkCallback` 用于引擎已知的回调创建边界；任意外部 setTimeout、未绑定 Promise 回调、绕过引擎直接调用技能函数仍然未知。不能将 event 上有 metadata 等同于所有异步 continuation 都被正确归因。

## UI

在中央 get.nodeintro 统一追加来源区域；不改技能 intro，保留原名称、文本、动态数量、卡牌列表、自定义 DOM 与异步介绍。来源行按 owner 汇总，显示译名和可读座位；内部仍是稳定 ID。匿名、共享、自身资源和暂不可解析角色分别明确标注。UI 查询不创建身份或账本，数值投影在 null 执行上下文中完成。

## 验证与停止条件

1. 备份工作分支、目标开发端未提交文件及当前发行模块。
2. 独立加载固定基线技能对象，保留原函数体；原始徐荣、两版营、节谏和共享／资源对照。
3. API TDD：来源隔离、未知写入、精确消费、匿名保护、共享／资源、数组、await 隔离、捕获回调、策略恢复。
4. UI TDD：单源、多源同名、未知、共享、自身资源、自定义／异步说明及恢复。
5. 只读浏览器预览：使用编译后的核心覆盖层，原武将函数来自 git show。保存账本、UI 和真实事件记录；不修改正式运行文件。
6. 未满足的新规则作为正常失败断言执行，退出非零，不用 TODO/skip 降级。若原始 A/B 不全部达到要求，明确报告，并停止进一步武将迁移，交付可审查的最小方案。

## 待审核的最小后续方案

先批准“声明是必要输入”这一边界，然后才实现有限、可复用的策略种类：数值资源与外部关系分离、明确的转移映射、按 bearer 实际有效 owner 计算增益、带参数的效果 schema。对信息在原始 API 流中根本不存在的复杂关系，要求极少量显式参数／关系声明，不能承诺零声明自动恢复。跨 await 的安全传递需要经过验证的编译器 instrumentation 或显式 callback/event API；本轮不对所有 async 源码做高风险自动重写。
