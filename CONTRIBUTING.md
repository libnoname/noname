# 贡献指南

感谢你参与无名杀的开发。在开始贡献前，请先阅读本指南；更通用的 Git 与 Pull Request 操作可参考[现有 Wiki 规范](https://github.com/libnoname/noname/wiki/%E3%80%8A%E6%97%A0%E5%90%8D%E6%9D%80%E3%80%8B%E9%A1%B9%E7%9B%AE-Pull-Request-%E6%8F%90%E4%BA%A4%E8%A7%84%E8%8C%83)。

## 贡献流程

1. 从最新的 `main` 分支创建工作分支。
2. 让每个分支和 Pull Request 只处理一个明确的主题，避免夹带无关的重构、格式化或清理。
3. 完成修改后运行必要的检查，并通过实际使用路径验证行为。
4. 向 `main` 分支提交 Pull Request，说明变更内容和验证方式。
5. 耐心等待审查，及时回应问题；根据审查意见修改后，应重新执行相关检查。

如果变更有对应的功能请求、错误报告或讨论，建议先创建或查找相关 issue，并在 Pull Request 中使用 `Closes #123`、`Fixes #123` 或普通链接进行关联。issue 用于记录需求背景、问题原因和讨论过程；Pull Request 应重点说明最终改了什么。

## 变更范围

一个 Pull Request 应保持单一目的。尤其是：

- `feat` 与 `fix` 必须分开提交，不能在同一个 Pull Request 中同时新增功能或内容并修复 Bug。
- 实现功能时发现的独立问题，应另开 `fix` Pull Request 处理。
- 与主要变更直接相关的测试和文档可以随对应 Pull Request 一并提交，不视为混合 `feat` 与 `fix`。
- 不要顺手修改与当前目标无关的代码、注释或格式。

## 编码规范

- JavaScript 代码使用 Tab 字符缩进，不使用空格代替缩进。
- 遵循项目现有代码风格和 ESLint 规则。
- 新增公共方法时使用 JSDoc 说明参数、返回值和用途。
- 复杂逻辑应提供必要的注释或配套文档，但不要用注释重复代码本身。

### 编写武将

新增或重写技能的 `content` 时，必须使用 `Async Content`，显式声明 `event`、`trigger` 和 `player` 参数：

```js
async content(event, trigger, player) {
	await player.draw(2);
}
```

不要新增 `Step Content`。如果只是修改现有技能，不要求顺带迁移未修改的旧 `content`。相关写法请阅读：

- [Async 章节](./docs/async-guide.md)
- [lib.skill 格式速查](./docs/lib-skill-format.md)

调用支持对象参数的 `Player` 事件方法时，必须使用对象参数，不要混用对象参数和旧式位置参数：

```js
await player.gain({
	cards,
	source,
	animate: "giveAuto",
});
```

`draw(2)`、`damage(2)`、`recover(1)`、`loseMaxHp(1)` 和 `gainMaxHp(1)` 等文档明确支持的单数字调用可以继续使用。少数方法仍保留必要的位置参数，应以类型声明和文档为准：

- [Player 事件的对象参数](./docs/player-event-object-parameters.md)
- [从不定参数迁移到对象参数](./docs/player-event-object-parameters-migration.md)

## Pull Request 标题

Pull Request 标题必须遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)：

```text
<type>: <内容>
<type>(<scope>): <内容>
```

`scope` 可选，用于说明受影响的模块。当前允许的 `type` 与仓库检查配置保持一致：

| 类型       | 用途                             |
| ---------- | -------------------------------- |
| `build`    | 构建系统或依赖相关变更           |
| `feat`     | 新增功能或内容                   |
| `fix`      | 修复错误                         |
| `docs`     | 仅修改文档                       |
| `style`    | 不影响逻辑的格式调整             |
| `refactor` | 不新增功能、不修复错误的代码重构 |
| `perf`     | 性能优化                         |
| `test`     | 新增或修改测试                   |
| `chore`    | 日常维护                         |
| `ci`       | 持续集成配置或脚本变更           |
| `revert`   | 撤销已有变更                     |

标题应简洁说明变更内容，不要把需求背景或问题原因写进标题。例如：

```text
feat(character): 添加武将张三及其技能
fix(card): 修复装备牌结算次数错误
docs: 补充对象参数迁移说明
```

Pull Request 中的单个 commit 不作额外的格式强制要求，但提交信息应清晰、有意义。

## Pull Request 说明

Pull Request 描述建议至少包含：

- **变更内容**：列出实际新增、修改或删除的内容。
- **验证方式**：说明执行过的命令和手动验证场景。
- **关联 issue**：如有，使用 issue 编号或链接关联。

需求动机、问题原因和方案讨论应优先记录在 issue 中，避免在 Pull Request 中重复大段背景说明。涉及界面变化时，建议提供截图或录屏。

## 提交前检查

提交前至少运行：

```bash
pnpm lint
```

根据变更范围，继续运行构建、相关测试或实际游戏流程验证。提交 Pull Request 前确认：

- [ ] 分支基于最新的 `main`，变更中没有无关内容。
- [ ] Pull Request 标题符合 Conventional Commits。
- [ ] `feat` 和 `fix` 内容没有出现在同一个 Pull Request 中。
- [ ] 新增或重写的技能 `content` 使用了 `Async Content`。
- [ ] 武将代码中的 `Player` 事件调用遵循对象参数规范。
- [ ] 已运行 `pnpm lint`，并完成与改动范围相符的验证。
- [ ] 已在描述中写明变更内容和验证方式，并在存在相关 issue 时完成关联。
