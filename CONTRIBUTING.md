欢迎为[《无名杀》](https://github.com/libnoname/noname)贡献代码！本文档帮助你了解项目结构、开发规范和提交流程。

## 快速开始

- 环境配置: [本地文档](docs/how-to-start.md) / [GitHub 文档](https://github.com/libnoname/noname/wiki/%E5%A6%82%E4%BD%95%E8%BF%90%E8%A1%8C%E6%97%A0%E5%90%8D%E6%9D%80%EF%BC%88%E7%A8%8B%E5%BA%8F%E5%91%98%E7%89%88%EF%BC%89)
- 本地文档: [docs/](docs/)

**技术栈**:

- **包管理**: pnpm workspace (>=9)
- **运行时**: Node.js ^20.19.0 || >=22.12.0
- **构建**: Vite (preserveModules, 不压缩, 不 treeshake)
- **类型**: TypeScript (迁移中, strict 未开启)
- **UI**: 原生JS (正在迁移到Vue 3)
- **代码风格**: ESLint + Prettier, tab缩进, 小驼峰

```bash
pnpm install          # 安装依赖
pnpm dev              # 启动开发服务器
```

## 项目概览

### 项目结构

```text
apps/core/        主项目 — 游戏核心、UI、武将/卡牌/模式数据
apps/electron/    Electron 桌面端
apps/mobile/      移动端 (Capacitor)
packages/         工程化包
  fs/              HTTP静态资源服务器 + 文件操作接口
  jit/             JIT 编译
  server/          联机服务器
  extension/       工程化扩展开发 → 产物放到 apps/core/extension/
docs/             本地文档
scripts/          顶层构建/工具脚本
```

### 命名空间

`apps/core/noname.js` 是框架入口，导出六个全局命名空间。所有内容直接挂载在上面，无隔离、无对外接口：

| 导出 | 别名 | 职责 |
| ---- | ---- | ---- |
| `Library` | `lib` | 元素/技能/配置管理 |
| `Game` | `game` | 游戏流程/事件循环 |
| `UI` | `ui` | 界面渲染 |
| `Get` | `get` | 查询/检索 |
| `Status` | `_status` | 运行时状态 |
| `AI` | `ai` | AI 逻辑 |

命名空间非模块，是类 C++ `std::` 的全局寄存器。任何内容注册后全局可访问，修改时需注意兼容性（尤其在社区扩展生态中）。

### 目录自动导入

`apps/core/noname/init/import.ts` 按目录结构自动解析导入路径：

- **武将包**: `/character/{包名}/index.js` → 先试 `.js`，安全上下文下回退到 `.ts`
- **卡牌包**: `/card/{包名}.js`
- **模式**: `/mode/{模式名}/index.js`
- **扩展**: `/extension/{扩展名}/extension.js`

所有内容必须导出 `type` 字段标明类型 (`"character" | "card" | "mode" | "extension"`)。

旧版是单文件入口（`character/name.js`），新版是目录入口（`character/name/index.ts`），已迁移的武将通过 `game/config.json` 中的 `moderned_characters` 列表追踪。

## 开发规范

- **提交信息**: 中文 Conventional Commits (`feat:`, `fix:`, `perf:`, `docs:`, `build:`, `refactor:` 等)
- **命名**: JS 生态小驼峰，无特殊中文/拼音要求
- **分支**: 主分支 `main`
- **PR 流程**: 参考 [PR 模板](.github/PULL_REQUEST_TEMPLATE/)（功能提交 / 更新报告）
- **测试**: 项目目前没有自动化测试。修改核心逻辑（命名空间挂载、ContentCompiler、导入系统）需格外谨慎
- **"代提" PR**: 表示替不会用 git/上不了 GitHub 的贡献者提交代码

新手入门：

- [Git 下载安装指南](https://github.com/libnoname/noname/wiki/Git%E4%B8%8B%E8%BD%BD%E5%AE%89%E8%A3%85%E6%8C%87%E5%8D%97)
- [Github 桌面版客户端使用入门](https://docs.github.com/zh/desktop/overview/getting-started-with-github-desktop)
- [如何提交代码到《无名杀》Github 仓库](https://github.com/libnoname/noname/wiki/%E5%A6%82%E4%BD%95%E6%8F%90%E4%BA%A4%E4%BB%A3%E7%A0%81%E5%88%B0%E3%80%8A%E6%97%A0%E5%90%8D%E6%9D%80%E3%80%8BGithub%E4%BB%93%E5%BA%93)

## 核心架构

### Content 系统

游戏逻辑的执行引擎，使用责任链模式统一编译为 `(event: GameEvent) => Promise<void>`：

| 写法 | 状态 | 说明 |
| ---- | ---- | ---- |
| 单 async 函数 | **推荐** | `setContent(async (event, trigger, player) => { ... })` |
| 函数数组 | 待废弃 | `setContent([fn1, fn2, fn3])` |
| step 语法 | 待废弃 | `setContent(function() { "step 0"; ... })` |

**所有新代码使用单 async 函数写法。** 项目正从旧的 step DSL 逐步迁移到 async，迁移路线详见 `docs/game-event/content.md`。

### 构建系统

`apps/core/scripts/build.ts` 是核心构建脚本：

- 本体构建使用 `preserveModules: true` 保留文件结构，`treeshake: false`，`minify: false`
- Vue 作为 external，通过 import map 运行时加载
- 武将包/卡牌包/模式包单独构建到 `dist/` 对应子目录
- 构建后通过 static copy 和 import map 组装为与旧项目兼容的物理结构

### 扩展系统

双层结构以兼容旧生态的相对路径导入：

- `packages/extension/` — 工程化扩展的**源码**
- `apps/core/extension/` — 扩展的**产物**（工程化扩展打包结果 + 未工程化扩展直接存放）

扩展生态与主仓库开发差异较大。

## 迁移状态

项目正从 **ES5 巨石应用** 迁移到 **pnpm monorepo + TypeScript**。所有迁移都是新旧并存、渐进式的：

- **JS → TS**: 类型文件集中在 `typings/`，严格度暂时放宽 (`noImplicitAny: false` 等)
- **step → async**: 旧的 step DSL（字符串标记步骤边界）正在逐步替换为单 async 函数。`docs/game-event/content.md` 详细描述了 ContentCompiler 的三种格式及迁移路线
