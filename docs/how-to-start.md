# 无名杀本地运行与扩展安装指南

本文面向第一次从源代码运行本项目的开发者，说明如何准备环境、安装依赖、启动游戏、安装与启用扩展，以及如何排查常见问题。

> 本文中的“扩展”指无名杀游戏扩展，目录通常位于 `apps/core/extension/`，不是浏览器插件或编辑器插件。

## 1. 项目结构速览

与运行和扩展相关的主要目录如下：

```text
noname/
├─ apps/
│  ├─ core/                 # 游戏 Web 核心
│  │  ├─ extension/         # 运行时游戏扩展
│  │  └─ vite.config.ts     # 开发服务器配置
│  ├─ electron/             # Electron 桌面客户端
│  └─ mobile/               # 移动端项目
├─ packages/
│  ├─ fs/                   # 本地文件服务，扩展导入依赖它
│  ├─ server/               # WebSocket 联机大厅服务
│  └─ extension/            # 使用工程模板开发、需要构建的扩展
├─ scripts/
│  ├─ dev.ts                # 根目录开发启动脚本
│  └─ initExtension.ts      # 创建扩展工程模板
├─ docs/
└─ package.json
```

## 2. 环境要求

- Node.js：`^20.19.0` 或 `>=22.12.0`
- pnpm：`>=9`
- 浏览器内核：Chromium `>=91` 或 Safari `>=16.4`
- 当前不建议使用 Firefox

在 PowerShell 中检查版本：

```powershell
node -v
npm -v
pnpm -v
```

如果没有 pnpm，可执行：

```powershell
npm install -g pnpm
```

如果 PowerShell 提示禁止运行 `npm.ps1` 或 `pnpm.ps1`，可仅为当前用户调整脚本策略：

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

修改执行策略前应了解其影响；在受管理的公司设备上请先遵循本机管理策略。

## 3. 安装依赖

在项目根目录执行：

```powershell
pnpm install --frozen-lockfile
```

`--frozen-lockfile` 可确保安装结果与仓库锁文件一致。

本仓库是 pnpm workspace，完整安装还会安装 Electron、移动端和服务器依赖。如果只是运行浏览器开发版，并且完整安装被 Electron 打包依赖的网络下载阻塞，可以只安装核心运行链路：

```powershell
pnpm --filter noname... install --frozen-lockfile
```

只有在依赖此前已经进入本机 pnpm 缓存时，才适合增加 `--offline`：

```powershell
pnpm --filter noname... install --offline --frozen-lockfile
```

`app-builder-bin`、Electron 镜像等下载失败主要影响桌面安装包构建，通常不影响浏览器开发版运行。

## 4. 启动浏览器开发版

推荐始终从项目根目录启动：

```powershell
pnpm dev
```

根启动脚本会同时启动：

- 游戏 Vite 开发服务器：`http://127.0.0.1:8081/`
- 文件服务：`http://127.0.0.1:8089/`
- `packages/extension/` 下工程扩展的构建监听

文件服务为游戏提供读取、写入和导入扩展的能力。只运行 `pnpm -F noname dev` 虽然可以打开页面，但扩展导入等文件操作可能因为 8089 文件服务未启动而失败。

启动后浏览器通常会自动打开。若未自动打开，手动访问：

```text
http://127.0.0.1:8081/
```

首次运行时：

1. 阅读并确认 GPLv3 提示。
2. 根据需要完成或跳过新手向导。
3. 确认可以看到“开始、选项、武将、卡牌、扩展”等菜单。

停止开发服务时，在启动它的终端中按 `Ctrl+C`。

## 5. 检查服务是否正常

可以另开一个 PowerShell 窗口执行：

```powershell
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8081/
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8089/index.html
```

两个请求均返回 HTTP `200`，说明游戏页面和文件服务已启动。

也可以检查监听端口：

```powershell
Get-NetTCPConnection -State Listen |
    Where-Object { $_.LocalPort -in 8081, 8089 } |
    Select-Object LocalAddress, LocalPort, OwningProcess
```

## 6. 扩展包的标准结构

游戏内导入器接受 ZIP 文件，并在 ZIP 根目录查找 `info.json` 或 `extension.js`。标准结构示例：

```text
某扩展.zip
├─ extension.js
├─ info.json
├─ extension.css            # 可选
├─ image/                   # 可选
├─ audio/                   # 可选
├─ character/               # 可选
└─ ...
```

以下结构不能直接被游戏内导入器识别，因为关键文件外面多套了一层目录：

```text
某扩展.zip
└─ repository-main/
   ├─ extension.js
   ├─ info.json
   └─ ...
```

遇到这种情况，需要重新制作 ZIP：进入 `repository-main/`，选择其中的全部内容进行压缩，使 `extension.js` 和 `info.json` 位于新 ZIP 的根目录。

扩展目录名、`info.json` 中的 `name`、`extension.js` 中声明的名称以及代码引用的素材路径应保持一致。例如扩展声明名为“活动武将”，推荐安装目录为：

```text
apps/core/extension/活动武将/
```

## 7. 方法一：通过游戏界面安装扩展（推荐）

此方法会自动复制文件、登记扩展并将其设为启用。

1. 使用根目录的 `pnpm dev` 启动游戏。
2. 打开游戏菜单中的“扩展”。
3. 进入“获取扩展”。
4. 展开“导入扩展”。
5. 选择标准结构的 `.zip` 文件。
6. 点击“确定”。
7. 等待“导入成功”提示，游戏会自动重启。
8. 重启后回到“扩展”菜单，确认扩展已出现并处于启用状态。

导入过程会执行扩展元数据或扩展入口代码，用于识别扩展名称。只应安装来源可信、内容经过检查的扩展。

### 游戏提示“此压缩包不是一个扩展”

依次检查：

- ZIP 根目录是否存在 `info.json` 或 `extension.js`。
- 是否多包了一层 GitHub 仓库目录，例如 `xxx-main/`。
- `info.json` 是否为合法 JSON。
- 扩展是否使用了当前版本不支持的旧格式。

## 8. 方法二：手动安装扩展目录

开发场景下，可以直接把解压后的扩展目录放入：

```text
apps/core/extension/<扩展名称>/
```

例如：

```text
apps/core/extension/活动武将/extension.js
apps/core/extension/活动武将/info.json
apps/core/extension/名将杀/extension.js
apps/core/extension/名将杀/info.json
```

直接复制目录只完成了“文件安装”，还需要让游戏登记并启用扩展。

### 8.1 使用自动导入功能登记

1. 在游戏顶部打开“选项”。
2. 进入左侧的“通用”。
3. 向下滚动，在靠后的位置开启“自动导入扩展”。
4. 重启游戏。
5. 游戏会扫描 `apps/core/extension/` 下的新扩展。
6. 自动发现的扩展默认关闭，需要在“扩展”菜单中手动启用，再次重启。

自动扫描依赖文件服务，因此应使用根目录 `pnpm dev`，确保 8089 端口正常。

### 8.2 使用开发导入参数登记

开发环境还支持一次性的 URL 参数：

```text
http://127.0.0.1:8081/?importExtensionName=活动武将
```

它会把指定目录加入扩展列表，并在第一次登记时启用。中文名称可由浏览器自动编码。

注意：

- 该参数适合首次登记已经复制到 `apps/core/extension/` 的目录。
- 不要反复用同一参数登记同一个扩展。
- 如果扩展已经登记但被关闭，应直接在“扩展”菜单中重新启用。
- 一次只登记一个扩展；登记完成后再访问下一个扩展的 URL。

## 9. 当前仓库中的两个扩展示例

本地 `扩展包/` 目录中的两个压缩包分别声明为：

- `活动武将20260823(1).zip` → 扩展名“活动武将”
- `名将杀（基本补充完）.zip` → 扩展名“名将杀”

其中“活动武将”的原始 ZIP 外层包含 `HuoDong-update-main/`，不能原样通过游戏导入；安装时应去掉这一层。“名将杀”的关键文件已经位于 ZIP 根目录。

当前“名将杀”发布包没有提供 `skin/index.js`，但原始 `main/precontent.js` 仍引用了该可选模块，会触发 Vite 的 `Failed to resolve import "../skin/index.js"`。本地安装版本已跳过该缺失的可选皮肤模块；若以后重新解压覆盖扩展，需要再次检查这一问题。

手动安装后的正确路径为：

```text
apps/core/extension/活动武将/
apps/core/extension/名将杀/
```

第三方扩展是可执行 JavaScript。即使静态检查没有发现系统命令，也不能保证扩展没有游戏逻辑错误、数据破坏行为或联网行为。建议保留原始 ZIP 和存档备份，并先在测试配置中运行。

## 10. 验证扩展是否正常运行

不能只以“目录存在”作为成功标准，建议完成以下验证：

1. 扩展菜单中能看到扩展名称、作者和版本。
2. 扩展启用后重启，页面没有出现“扩展加载失败”或模块导入错误。
3. 浏览器开发者工具控制台没有与该扩展相关的红色错误。
4. 扩展提供的武将或卡牌包能在相应菜单中看到。
5. 开始一局最简单的身份模式，验证选将、摸牌、出牌和结束回合。
6. 若扩展修改全局 API，再额外测试关闭扩展后的普通对局。

扩展入口文件是否能被开发服务器访问，可用下面的方式快速检查：

```powershell
Invoke-WebRequest -UseBasicParsing `
    "http://127.0.0.1:8081/extension/活动武将/extension.js"
```

HTTP `200` 只表示文件可以访问，不代表扩展运行逻辑一定正确。

## 11. 创建自己的扩展工程

如果要开发新扩展，而不是安装现有 ZIP，可在根目录执行：

```powershell
pnpm init:extension <扩展名称> --author <作者>
```

需要 Vue 模板时：

```powershell
pnpm init:extension <扩展名称> --author <作者> --vue
```

生成位置是：

```text
packages/extension/<扩展名称>/
```

随后执行：

```powershell
pnpm install
pnpm dev
```

根开发脚本会监听该目录下工程扩展的构建变化。

## 12. 构建可分发版本

构建核心运行文件：

```powershell
pnpm build
```

输出目录为：

```text
dist/
```

根构建脚本会复制 `apps/core/extension/`，因此放在该目录下的运行时扩展会进入构建结果。分发第三方扩展前，请确认其许可证允许再分发。

构建后本地运行：

```powershell
pnpm serve
```

也可以一次完成构建和运行：

```powershell
pnpm start
```

## 13. 运行 Electron 桌面开发版

完整依赖安装成功后，可执行：

```powershell
pnpm -F @noname/electron dev
```

构建 Windows 桌面包：

```powershell
pnpm build
pnpm -F @noname/electron build:win
```

Electron 和 `app-builder-bin` 体积较大，网络不稳定时可能下载失败。这类失败与浏览器开发版能否运行是两件事，应分开排查。

## 14. 启动本地联机大厅

联机大厅不是 `pnpm dev` 默认启动的一部分。另开 PowerShell，在项目根目录执行：

```powershell
pnpm -F @noname/server dev
```

默认监听端口为 `8082`。在游戏的“联机”模式中填写：

```text
localhost:8082
```

即可进入本地联机大厅。

这里只启动本机 WebSocket 服务。若要让其他网络中的玩家连接，还需要处理防火墙、路由器端口映射、域名、TLS/WSS 和服务器安全加固。

## 15. 常见问题

### 15.1 页面打不开

- 确认 `pnpm dev` 进程仍在运行。
- 确认访问的是 `http://127.0.0.1:8081/`，不是旧文档中的 8080。
- 用 `Get-NetTCPConnection` 检查 8081 是否监听。
- 查看启动终端中 Vite 的错误信息。

### 15.2 扩展导入时提示没有文件系统权限

- 应从项目根目录运行 `pnpm dev`。
- 确认 8089 文件服务正在监听。
- 不要只启动 `pnpm -F noname dev`。

### 15.3 扩展已经复制，但菜单里看不到

- 开启“选项 → 通用 → 自动导入扩展”，然后重启；该选项位于通用设置靠后的位置。
- 或首次使用 `?importExtensionName=<扩展名>` 登记。
- 检查目录根部是否存在 `extension.js` 或 `extension.ts`。
- 检查目录名和扩展声明名称是否一致。

### 15.4 扩展启用后白屏或无法进入游戏

- 打开浏览器开发者工具查看第一条报错。
- 先在扩展菜单中关闭最近启用的扩展。
- 检查扩展要求的本体版本和依赖扩展。
- 检查导入路径的大小写与文件名是否一致。
- 若多个扩展都会修改同一个全局方法，分别单独启用以定位冲突。

### 15.5 `pnpm install` 卡在 Electron 下载

如果只需要浏览器开发版，可以执行：

```powershell
pnpm --filter noname... install --frozen-lockfile
```

不要通过关闭 TLS 校验或忽略证书错误来绕过下载问题。需要构建 Electron 时，应修复代理、镜像或网络环境后重新完整安装。

### 15.6 端口被占用

检查占用进程：

```powershell
Get-NetTCPConnection -State Listen |
    Where-Object { $_.LocalPort -in 8081, 8082, 8089 } |
    Select-Object LocalAddress, LocalPort, OwningProcess
```

确认进程用途后再决定停止它；不要直接结束不明进程。

## 16. 推荐的首次运行顺序

```text
检查 Node/pnpm 版本
→ 安装核心依赖
→ pnpm dev
→ 确认 8081 与 8089 返回 200
→ 进入主界面
→ 检查扩展 ZIP 根目录结构
→ 通过界面导入，或手动复制后登记
→ 启用扩展并重启
→ 查看控制台错误
→ 开始一局最小对局验证
```

如果还要验证联机功能，再单独启动 8082 联机大厅，不要把联机问题和扩展加载问题混在同一次排查中。

## 17. 将扩展资源提交到 Git

仓库根目录的 `.gitignore` 已排除依赖、构建输出、测试覆盖率、工具缓存、运行数据、日志、临时文件和原始扩展压缩包。需要提交的是解压后的扩展内容，而不是作为安装来源的 ZIP：

```text
apps/core/extension/活动武将/
apps/core/extension/名将杀/
```

为避免把工作区中的其他文件误带入提交，不要直接使用 `git add .`，而是明确指定本次内容：

```powershell
git add .gitignore
git add apps/core/.gitignore
git add docs/how-to-start.md
git add "apps/core/extension/活动武将"
git add "apps/core/extension/名将杀"
```

提交前依次检查：

```powershell
git status --short
git diff --cached --stat
git diff --cached --name-only
git diff --cached --check
```

暂存区中不应出现下列内容：

```text
扩展包/
node_modules/
dist/
dist-types/
output/
coverage/
.cache/
.vite/
apps/electron/Home/
任何日志、临时文件或本地环境配置
```

可以用以下命令确认某个文件为什么被忽略：

```powershell
git check-ignore -v "扩展包/活动武将20260823(1).zip"
```

只有确认暂存清单正确后才创建提交。若当前目录执行 `git status` 提示“not a git repository”，说明这里没有 `.git` 元数据：已有项目应切换到正确的克隆目录；只有确定要创建全新仓库时才运行 `git init`。
