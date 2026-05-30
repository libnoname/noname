# 无名杀 (noname)

开源卡牌游戏。

## 项目使用约定

本项目基于 GPL 3.0 协议开源，使用此项目时请遵守开源协议。  
除此外，希望你在使用代码时已经了解以下额外说明：

1. 打包、二次分发 **请保留代码出处**：<https://github.com/libnoname/noname>
2. 请不要用于商业用途。

> 关于《无名杀十周年》破坏开源协议的违法行为的通告：
> <https://github.com/libnoname/noname/discussions/3892>

## 快速启动

> **提示：** 新手请参考 [本地文档](./docs/how-to-start.md) 或 [GitHub 文档](https://github.com/libnoname/noname/wiki/%E5%A6%82%E4%BD%95%E8%BF%90%E8%A1%8C%E6%97%A0%E5%90%8D%E6%9D%80%EF%BC%88%E7%A8%8B%E5%BA%8F%E5%91%98%E7%89%88%EF%BC%89) 配置环境。

### 环境要求

- [Node.js](https://nodejs.org/) ^20.19.0 || >=22.12.0
- [pnpm](https://pnpm.io/) >= 9
- Webview: Chromium >= 91 || Safari >= 16.4 (暂不支持 Firefox)

### 安装与启动

```bash
pnpm install          # 安装依赖
pnpm dev              # 启动开发服务器
```

## 外部资源

- 仓库: <https://github.com/libnoname/noname>
- 贡献指南: [CONTRIBUTING.md](CONTRIBUTING.md)

客户端下载：

- 安卓: <https://github.com/nonameShijian/noname-shijian-android/releases/tag/v1.6.8>
- PC: <https://github.com/nonameShijian/noname/releases/tag/v1.75>

## 项目结构

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
