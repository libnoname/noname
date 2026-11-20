# AGENTS.md

《无名杀》（Noname）是一款基于 HTML5 / JavaScript / TypeScript 构建的开源卡牌策略游戏客户端与规则引擎，支持全端跨平台游玩与模块化扩展。

## 1. 项目环境

- 技术栈：
  - 语言：JavaScript (ESNext), TypeScript (5.x), Vue 3 (SFC)
  - 工程化：pnpm workspace (Monorepo), Vite 7, tsup, tsx, ESLint 9 (Flat config), Prettier
  - 运行时与平台：Web 标准 (DOM, WebWorker), Node.js, Electron (桌面端), Capacitor (移动端), Fastify (本地文件服务), WebSocket (联机服务)
- 构建入口：
  - 根目录构建：`scripts/build.ts`（全量打包核心引擎并合并产物至 `dist/`）
  - 本地联调：`scripts/dev.ts`（并发启动核心服务、扩展监听与开发服务）
  - 核心引擎入口：`apps/core/noname/entry.ts`、`apps/core/noname.js`、`apps/core/index.html`
  - 桌面端入口：`apps/electron/app/main.ts`
  - 移动端入口：`apps/mobile/src/preload.ts`（预加载与平台接入）与 `apps/mobile/scripts/sync.ts`（资源与容器同步）
  - 独立包入口：`packages/fs/src/entry.ts`、`packages/server/src/cli.ts`、`packages/jit/src/index.ts`
- 目标平台：
  - 浏览器端：Chromium >= 91, Safari >= 16.4.0（暂不支持 Firefox）
  - 桌面端 (Electron)：Windows (x64/ia32), Linux (x64/arm64), macOS (x64/arm64)
  - 移动端 (Capacitor)：Android, iOS
- 必需工具：
  - Node.js: 核心与桌面开发支持 `^20.19.0 || >=22.12.0`（CI 推荐 Node 24）；移动端 Capacitor 8 CLI 必须 `>=22.0.0`
  - pnpm: `>= 9`
  - 移动端构建可选：JDK 21, Android SDK (build-tools 36.0.0), Xcode
- 统一启用：
  - TypeScript 严格模式：继承根目录 `tsconfig.json`（`strict: true`、`target/module: ESNext`、`moduleResolution: Bundler`）
  - 代码风格与编码：UTF-8 编码，LF 换行符，Tab 字符缩进（禁止使用空格缩进）
  - 统一 Linter：ESLint 9 Flat config 结合 `typescript-eslint` 与 `eslint-plugin-vue`

新增项目时：
- 按照下方目录结构在 `apps/` 和 `packages/` 下新建子项目（若路径未被 `pnpm-workspace.yaml` 现有通配规则覆盖则需补充声明）；
- `package.json` 必须显式声明 `"type": "module"`；
- 继承根目录 `tsconfig.json` 配置，不要重复声明通用编译器与构建属性；
- 必须提供 `lint` 脚本（如 `pnpm eslint src/**`）以接入根目录统一检查；
- 扩展项目可优先使用 `scripts/initExtension.ts` 脚手架生成。

## 2. 目录结构

| 路径 | 职责 |
| --- | --- |
| `apps/core/` | 游戏核心引擎与主体：包含规则调度、武将（`character/`）、卡牌（`card/`）、模式（`mode/`）、UI、音频与图片资源、TypeScript 类型声明 |
| `apps/electron/` | 桌面端包装（基于 Electron 与 Vite 构建桌面窗口容器与跨平台安装包） |
| `apps/mobile/` | 移动端包装（基于 Capacitor 适配 Android 与 iOS 平台的原生工程与同步逻辑） |
| `packages/fs/` | 基础文件服务（基于 Fastify 提供本地文件系统读写及静态资源托管） |
| `packages/server/` | 联机服务端（基于 WebSocket 的多人房间对战通信服务与 CLI 工具） |
| `packages/jit/` | JIT 运行时编译工具库（提供 Vue SFC 与 TS 的动态解析与代码生成） |
| `scripts/` | 根工程管理与构建脚本（打包构建、扩展初始化、环境联调等） |
| `docs/` | 官方开发指南、核心规范与语法迁移文档 |
| `dist/` | 全量构建产物输出目录（聚合核心引擎、媒体资源与扩展） |

分层规则：
- 业务逻辑严格就地归位：卡牌、武将、游戏模式的结算与判定留在 `apps/core/` 对应子目录，严禁随意在核心引擎层写硬编码业务逻辑。
- 通用能力严格下沉：网络传输、文件系统抽象、动态编译等跨模块共用能力必须下沉到 `packages/`，严禁在业务项目或扩展中重复引入多套临时实现。
- 宿主容器隔离：`apps/electron` 与 `apps/mobile` 仅作为宿主外壳和原生能力桥接层，业务逻辑必须与外壳解耦。
- 扩展与核心解耦：独立开发扩展应位于 `packages/extension/`，通过公开暴露的引擎 API 接入；内置核心扩展位于 `apps/core/extension/`。禁止直接侵入修改引擎私有状态。

### 2.1 核心业务目录详细要求

- `apps/core/character/`: 武将包定义。新增或重写的技能 content 必须采用 `Async Content`；若仅修改现有技能，最好顺带迁移未修改的旧 content；触发技根据需求按 `cost` 规范拆分费用与效果（`cost` 非强制必填，详见 `docs/lib-skill-format.md`）。
- `apps/core/card/`: 卡牌定义。包含基本牌、锦囊牌、装备牌的卡牌属性与使用/生效结算。
- `apps/core/mode/`: 游戏模式。身份局、国战等模式的主流程初始化、胜利条件判断与专有规则。
- `apps/core/noname/`: 引擎底层系统。
  - `game/`: 游戏主循环、事件系统与时间轴驱动。
  - `get/`: 只读查询与逻辑推导函数集。
  - `ui/`: 交互界面渲染、对话框与动效。
  - `ai/`: AI 决策树与卡牌/技能评估逻辑。
  - `library/`: 核心数据注册表（卡牌库、武将库、技能库）。

## 3. 代码规范

- **缩进与排版**：
  - JavaScript / TypeScript / Vue 源码严格使用 **Tab 字符** 进行缩进，禁止使用空格缩进（受 Prettier 与 `.editorconfig` 约束）。
  - 行尾统一使用 LF；语句保留分号；对象属性根据 ES5 规范保留必要尾随逗号；Prettier 单行宽度不设硬折行（`printWidth: Infinity`）。
- **语言与 Linter 检查**：
  - 遵循根目录 ESLint 9 配置，禁止引入未定义的全局变量，严禁引入未经检查的语法错误。
  - 统一通过 `pnpm lint` 进行规范验证。
- **注释与可读性**：
  - 新增公共 API 或复杂事件方法时，使用 JSDoc 阐明参数类型、返回值与用途。
  - 注释应聚焦于“为什么这样做”（业务时钟、时序敏感逻辑或设计考量），严禁用无意义注释复述代码字面内容。

## 4. 领域特化规范

- **强制 Async Content 规范**：
  - 新增或重写技能的 `content` 时，必须使用 `Async Content`，显式声明 `async content(event, trigger, player)` 参数。
  - 按事件调度语义合理使用 `await`：后续逻辑依赖子事件的返回值或其结算后的状态变化（或需要保证结算时序）时，必须 `await`（如 `await player.draw(2)` 后读取手牌）；对 `event.insertAfter(...)`、`player.insertPhase(...)` 等调度型调用，不要在当前内容中盲目 `await`。
  - 涉及需等待整个事件队列结算的复杂流程，按 `docs/step-to-async-guide.md` 规范使用 `Array Content`（由引擎分段自动处理队列等待）。
  - 严禁新增 `Step Content`；`Async Content` 中严禁使用 `event.goto()` 或 `event.redo()` 改写控制流；循环操作使用原生的 `while` / `for` 异步循环。若仅修改现有技能，最好顺带重写未改动的旧 `content`。
- **强制 Player 事件对象参数规范**：
  - 调用支持对象参数的 `Player` 事件方法（如 `gain`, `discard`, `damage`, `chooseToUse`, `chooseCardTarget` 等）时，优先使用具名对象参数传递上下文，严禁混用旧式不定长位置参数：
    ```js
    await player.gain({
    	cards,
    	source,
    	animate: "giveAuto",
    });
    ```
  - **保留必要位置参数**：部分方法明确要求保留首个位置参数，后续配置作为第二个对象参数传入，如：
    ```js
    player.chooseSkill(target, { prompt: "选择获得一个技能" });
    player.discoverCard(list, { num: 3 });
    player.drawTo(5, { bottom: true });
    player.recoverTo(3, { source });
    ```
  - **单数字简写形式**：`draw(2)`、`damage(2)`、`recover(1)`、`loseMaxHp(1)`、`gainMaxHp(1)` 等官方明确支持的单数字简写形式可保留使用。
  - 完整规则以 `docs/player-event-object-parameters.md` 与 `apps/core/noname/library/element/Player/type.d.ts` 为准。
- **变更独立性（PR 隔离原则）**：
  - `feat`（新功能/新武将）与 `fix`（缺陷修复）必须严格分开，不得混在同一个提交或分支中。
  - 修复 Bug 时找准根本原因，严禁顺手修改与当前目标无关的代码、注释或格式。

## 5. 测试

- 现阶段以运行时端到端验证为主（`scripts/generateTestPack.ts` 用于生成测试资源包）；现阶段禁止新增单元测试项目或用例。
- **防止无用测试**：坚决禁止编写重复测试、仅测试第三方库自身行为的测试、不可达死逻辑测试或无断言的形式主义测试。
- Bug 修复必须针对真实历史场景（具体技能结算时钟、卡牌触发时序）设计最小化验证路径。

## 6. 验证

在仓库根目录执行：

- **格式检查**：
  ```bash
  pnpm -F noname lint:prettier             # 核心包脚本默认仅覆盖 noname/**；修改 character/card/mode 等业务目录需对相应路径执行（如 pnpm prettier -c apps/core/character/**）
  ```
- **代码规范检查 (ESLint)**：
  ```bash
  pnpm lint                                # 递归检查各子包；注意核心包默认仅覆盖 noname/**，业务目录改动需指定路径检查（如 pnpm eslint apps/core/character/**）
  ```
- **核心类型检查**：
  ```bash
  pnpm -F noname build:types
  ```
- **全量构建**：
  ```bash
  pnpm build
  ```
- **单模块构建**：
  ```bash
  pnpm -F "noname..." build                # 核心引擎构建（带 ... 连同 @noname/jit 等前置工作区依赖一并构建）
  pnpm -F "./packages/extension/**" build  # 官方扩展构建（通配符加引号避免被 shell 提前展开）
  pnpm -F @noname/electron build           # 桌面端构建
  pnpm -F @noname/mobile sync              # 移动端同步
  ```
- **本地启动与交互验证**：
  ```bash
  pnpm dev                                 # 启动开发服务器与本地文件服务，打开浏览器验证游戏交互
  ```

> 不要对文档进行任何格式检查

## 7. 文档与交付

- **文档规范**：
  - 核心设计、机制说明与迁移指南统一放置在 `docs/` 目录下（如 `async-guide.md`、`player-event-object-parameters.md`、`step-to-async-guide.md` 等）。
  - 若修改公共 API 或事件签名，必须同步更新 `docs/` 对应文档与对应位置的 TypeScript 类型定义（如 `apps/core/typings/` 及 `apps/core/noname/library/element/Player/type.d.ts` 等）。
  - 版本更新日志记录于 `apps/core/game/updateLog.md`。
- **Git 提交与 PR 规范 (Conventional Commits)**：
  - PR 标题必须遵循 Conventional Commits 格式，对齐 `CONTRIBUTING.md`：
    ```text
    <type>: <简短描述>
    <type>(<scope>): <简短描述>
    ```
  - `scope` 为可选字段；PR 中的单个 commit 提交信息应清晰有意义，不作额外的严格格式强制。
  - 允许的 `type`：`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`。
  - 常见 `scope`：`character`, `card`, `skill`, `mode`, `ui`, `ai`, `core`, `electron`, `mobile`。
  - 示例：
    ```text
    feat(character): 新增移动版苏越（袖里乾坤）
    fix(character): 修复界于吉蛊惑结算读取空弃牌结果时崩溃
    refactor(skill): 迁移〖膂力〗为 Async Content
    docs: 补充 Player 事件对象参数使用说明
    chore: 增加 AGENTS.md
    ```
