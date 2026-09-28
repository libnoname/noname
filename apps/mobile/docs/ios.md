# iOS 构建与安装

本文档介绍如何为《无名杀》构建 iOS 版本（`.ipa`），以及在 iPhone 上安装的方法。

涉及两条路线：

| | 路线 A：GitHub Actions 云端构建 | 路线 B：本地 Mac 构建 |
| --- | --- | --- |
| 是否必须装 Xcode | 否 | 是（Xcode 26.0+） |
| 是否必须有 Mac | 否 | 是 |
| 耗时 | 约 20–40 分钟（云端） | 首次约 2–4 小时（含装工具） |
| 产物 | 未签名 `.ipa` | 已签名 `.ipa` |
| 花费 | 免费（公共仓库） | 免费 |

**没有 Mac、不想配开发者证书**：走路线 A。
**有 Mac、想本地出包或上架**：走路线 B。

两条路线产出的 `.ipa` 都可以用 SideStore / AltStore 侧载到 iPhone。

---

## 0. 前置说明：iOS 与 Android 的差异

在动手前，先理解本仓库为 iOS 做的两处适配，否则容易在排障时找不到方向。

### 0.1 文件系统：沙盒 vs SAF

- **Android** 使用 SAF（Storage Access Framework）：需要用户手动授权一个可写目录，游戏资源与存档都放在其中。
- **iOS** 是应用沙盒，没有「让用户选目录」这个概念，因此不需要授权流程：
  - **只读层**：随 App 打包的内置资源，由 Capacitor 在 `capacitor://localhost` 下提供；
  - **可写层**：沙盒内的 `Documents/noname/`，存放存档、扩展、导出文件。

读取遵循**覆盖层**语义：先查 `Documents`（可写层），命中则返回；否则回退到内置资源（只读层）。这样「用户改动过的文件覆盖内置文件、删除用户文件即还原内置文件」的行为与 Android 一致。

实现见 [`src/fs/ios.ts`](../src/fs/ios.ts)，与 Android 的 `SafFsPlugin` 共用 [`src/fs/types.ts`](../src/fs/types.ts) 定义的 `NativeFileSystem` 接口，映射逻辑集中在 [`src/fs/legacy-api.ts`](../src/fs/legacy-api.ts)。

### 0.2 目录列举：`asset-manifest.json`

游戏启动时需要「列目录」来扫描有哪些武将、卡牌、模式（`getFileList`）。

- Android 上是真实文件系统，可以直接列目录；
- **iOS 的 WKWebView 出于安全限制不提供目录列举能力**。

因此构建阶段会生成一份资源清单 `dist/asset-manifest.json`（全部文件的相对路径），随包一起发布，运行时的 `getFileList` 读它来模拟列目录。

生成逻辑在 [`afterSync.ts`](../afterSync.ts) 的 `writeAssetManifest()`，**必须在 `cap sync` 之前写盘**才会被同步进 iOS 工程。

> ⚠️ 如果手动裁剪了 `dist/` 下的资源，记得重新执行 `pnpm --filter @noname/mobile sync` 以重建清单，否则游戏会去找已被删除的文件。

---

## 1. 路线 A：GitHub Actions 云端构建

### 1.1 原理

GitHub 为公共仓库免费提供 macOS 云主机（Apple Silicon）。工作流 `.github/workflows/ios-build.yml` 会自动完成：

```
装 Node/pnpm → 编译网页资源 → 生成资源清单 → 生成 Xcode 工程
  → 编译（不签名）→ 组装 Payload → 打包成 .ipa → 上传 Artifact / Release
```

因为**不签名**，所以托管在 GitHub 上不需要任何 Apple 账号或证书。签名交给侧载工具（SideStore / AltStore）在你自己的 Apple ID 下完成。

### 1.2 触发方式

1. 打开仓库的 **Actions** 页面；
2. 左侧选择 **Build unsigned iOS IPA**；
3. 点 **Run workflow**，配置以下选项：

   | 选项 | 建议值 | 说明 |
   | --- | --- | --- |
   | `retention_days` | `14` | 产出的 ipa 在 GitHub 上保留多少天 |
   | `create_release` | 勾上 | 同时发布到 Release 页面，方便长期下载 |
   | `slim_assets` | 勾上 | **建议勾选**，裁掉 970MB 语音与立绘，否则大概率装不进手机（见第 3 节） |

4. 点 **Run workflow** 开始构建。

也可以通过打 tag 自动触发（`ios-v*`）：

```bash
git tag ios-v1.0.0
git push origin ios-v1.0.0
```

### 1.3 下载产物

构建成功后有两种获取方式：

- **Artifacts**：任务页面底部的 `noname-ios-unsigned`（zip，解压后是 `.ipa`）；
- **Release**：仓库 Release 页面中对应 tag 的 `noname-ios-unsigned.ipa`。

> ⚠️ 产物是**未签名**的 `.ipa`，**不能双击直接安装**，必须经过 SideStore / AltStore 重签。

### 1.4 关于仓库体积

《无名杀》的 Git 历史非常庞大（十几年累积，大量 mp3/jpg 直接提交进历史），完整克隆需要 TB 级磁盘。工作流为此做了三重防护：

1. `fetch-depth: 1` —— 只拉取最新 1 个提交；
2. 每步打印磁盘剩余空间；
3. 编译前体检，剩余空间不足时直接给出明确报错。

如果仍因磁盘问题失败，可考虑维护一个只存放构建产物的轻量仓库专门用于出包。

---

## 2. 路线 B：本地 Mac 构建

### 2.1 环境要求

| 项目 | 要求 |
| --- | --- |
| macOS | 支持 Xcode 26.0+ 的版本 |
| Xcode | **26.0+**（Capacitor 8 要求；且改用 Swift Package Manager，无需 CocoaPods） |
| Node.js | 22.x（LTS） |
| pnpm | 通过 `corepack enable pnpm` 启用 |

> 💡 Xcode 26 起 Apple 不再支持 Intel Mac。Intel 机器最高只能装 Xcode 15.x，无法用于本仓库当前的 Capacitor 8 工程；此类机器请改用**路线 A** 云端构建。

安装 Xcode 后先打开一次以同意许可协议，然后验证：

```bash
xcodebuild -version        # 应输出 Xcode 26.x
```

若提示 `xcode-select: error`：

```bash
sudo xcode-select -s /Applications/Xcode.app
```

### 2.2 获取代码并安装依赖

```bash
git clone https://github.com/libnoname/noname.git
cd noname
pnpm install
```

### 2.3 生成 iOS 工程

```bash
cd apps/mobile
npx cap add ios
```

成功后会生成 `apps/mobile/ios/` 目录。**此步骤只需执行一次**，之后重新构建不必重复。

### 2.4 查询 Team ID

1. 打开 <https://developer.apple.com/account>；
2. 进入 **Membership details**，找到 **Team ID**（10 位字符）。

> 没有付费开发者账号（$99/年）时，免费 Apple ID 也可以出 `.ipa`，但签名 **7 天过期**、最多 3 台设备，自用测试足够。
> 免费账号的 Team ID 可在 Xcode 的 `Settings → Accounts` 中查看（显示为 `你的名字 (Personal Team)`）。

### 2.5 一键构建

在 `apps/mobile` 目录执行：

```bash
pnpm build:ios -- --team=<你的TeamID>
```

脚本会依次完成：构建网页资源 → `cap sync`（含资源清单生成）→ `xcodebuild archive` → 导出 `.ipa`。

产物路径：

```
apps/mobile/ios/build/export/<AppName>.ipa
```

可选参数：

| 参数 | 作用 |
| --- | --- |
| `--method=development` | 默认，适合侧载（SideStore / AltStore） |
| `--method=ad-hoc` | 需先在 Apple 后台登记设备 UDID |
| `--method=app-store-connect` | 用于上架 App Store 或 TestFlight |
| `--configuration=Release` | 出正式版（体积更小、运行更快），默认 Debug |
| `--skip-web-build` | 复用已有 `dist`，不重新构建网页部分 |

---

## 3. 资源体积与裁剪

游戏完整资源约 **2.8 GB**，体积分布：

| 目录 | 体积 |
| --- | --- |
| `audio/skill` | 470 MB |
| `image/character` | 390 MB |
| `audio/die` | 111 MB |
| `image/emotion` | 52 MB |
| `image/background` | 43 MB |
| `audio/background` | 42 MB |
| `image/mode` | 31 MB |
| `image/card` | 11 MB |
| 代码类合计 | 约 11 MB |

相关限制：

- Apple 对未压缩 App 的硬上限为 **4 GB**，全量资源可以容纳；
- 但 AltStore / SideStore 安装 **超过 300 MB 的 `.ipa`** 时容易报 `Bad Allocation`；
- 本地编译 2.8 GB 工程非常慢，且至少需要 20 GB 空闲磁盘。

**推荐裁剪三个最大的目录**：

| 裁剪内容 | 体积 | 影响 |
| --- | --- | --- |
| `audio/skill` | 470 MB | 武将技能无配音，其他正常 |
| `audio/die` | 111 MB | 阵亡无配音 |
| `image/character` | 390 MB | 武将显示默认剪影 |

裁剪后约 **337 MB**，可正常侧载。

- **路线 A**：触发工作流时勾选 `slim_assets`，会自动裁剪、保留必需的 3 张默认剪影、并重建资源清单；
- **路线 B**：手动删除目录后，**必须重新执行 `pnpm --filter @noname/mobile sync`** 重建 `asset-manifest.json`。

> ⚠️ `image/character` 中的 `default_silhouette_*` 是**游戏必需**的默认剪影，不能整目录删干净，否则没有立绘的武将会显示破图。

---

## 4. 安装到 iPhone

以 SideStore 为例：

1. 把 `.ipa` 传到手机上（AirDrop 最方便）；
2. 打开 SideStore，点 `+`，选择该 `.ipa`；
3. 等待安装完成，桌面会出现《无名杀》图标。

> **7 天过期**：免费账号签名的应用每 7 天需重新签名。SideStore 会在充电 + 连接 Wi-Fi 时自动续签。

---

## 5. 常见问题

| 报错 / 现象 | 原因与解决 |
| --- | --- |
| `xcodebuild: command not found` | Xcode 未安装或未打开过；执行 `sudo xcode-select -s /Applications/Xcode.app` |
| `No signing certificate` | Team ID 填错，或 Apple ID 未在 Xcode 中登录 |
| `Unable to find a destination` | 缺 iOS 平台支持，执行 `xcodebuild -downloadPlatform iOS` |
| `Bad Allocation` | `.ipa` 过大，见第 3 节裁剪资源 |
| `iOS project not found` | 未执行 `npx cap add ios` |
| `Xcode project/workspace not found` | iOS 工程未初始化好，删除 `apps/mobile/ios` 后重跑 `npx cap add ios` |
| 菜单 / 顶部按钮点不动 | 系统栏（状态栏、导航栏）浮层吃掉了触摸事件。确认 `capacitor.config.ts` 中 `SystemBars.hidden` 为 `true`，且未启用 `contentInset` |
| 游戏能启动但读不到武将 / 卡牌 | `asset-manifest.json` 缺失或未随资源裁剪更新，重新执行 `pnpm --filter @noname/mobile sync` |

---

## 6. 相关实现文件

| 文件 | 作用 |
| --- | --- |
| [`src/preload.ts`](../src/preload.ts) | 平台分流入口：按 `Capacitor.getPlatform()` 选择文件系统实现，安装 `game.*` API |
| [`src/fs/ios.ts`](../src/fs/ios.ts) | iOS 文件系统实现（沙盒覆盖层 + 内置资源清单列举） |
| [`src/fs/types.ts`](../src/fs/types.ts) | 跨平台共用的 `NativeFileSystem` 接口与工具函数 |
| [`src/fs/legacy-api.ts`](../src/fs/legacy-api.ts) | 把 `NativeFileSystem` 映射为游戏所需的回调式 `game.*` API |
| [`buildIos.ts`](../buildIos.ts) | 本地 Mac 一键构建脚本 |
| [`afterSync.ts`](../afterSync.ts) | `cap sync` 前置步骤：打包 preload、生成资源清单 |
| [`capacitor.config.ts`](../capacitor.config.ts) | Capacitor 平台配置（含 iOS 的 `contentInset`、`SystemBars`） |
| [`.github/workflows/ios-build.yml`](../../../.github/workflows/ios-build.yml) | 云端未签名 `.ipa` 构建工作流 |
