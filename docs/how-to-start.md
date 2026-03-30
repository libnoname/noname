# 如何运行无名杀

## 一、安装环境（前置条件）

### Node.js (^20.19.0 || >=22.12.0)

打开 [Node.js 官方下载页面](https://nodejs.org/)，找到最新的版本。

- Windows：下载 `.msi` 安装包，点击“下一步”直到安装完成。
- macOS：下载 `.pkg` 安装包，双击安装。

验证（输出版本号）：

   ```bash
   node -v
   npm -v
   ```

### pnpm (>=8)

在命令行输入：

```bash
npm install -g pnpm
```

验证（输出版本号）：

```bash
pnpm -v
```

## 二、安装依赖

在项目根目录执行：

```bash
pnpm install
```

## 三、启动项目

- ### 开发环境

  执行：
  
  ```bash
  pnpm dev
  ```
  
  使用vite服务器开发。浏览器会自动打开，占用本地的8080端口和8089端口。

- ### 构建项目

  - 打包代码（只包含运行时必要的代码）：
  
    ```bash
    pnpm build
    ```
  
  - 打包离线包（包含完整源代码以及这个版本更新的素材）：
  
    ```bash
    pnpm build:diff
    ```
  
  - 打包完整包（包含完整源代码、所有素材和所有内置扩展）：
  
    ```bash
    pnpm build:full
    ```

  打包结果会输出到`dist/`文件夹，可以复制到启动器（如electron）中打开。

  > **提示:**
  >
  > 如果需要自动打包成zip，请在命令之后增加`--zip`，如：
  >
  > ```bash
  > pnpm build:diff --zip
  > ```
  >
  > 这会在打包完成后额外在项目根目录输出结果的压缩包。

- ### 生产环境

  执行：
  
  ```bash
  pnpm start
  ```

  或在构建完项目后执行：

  ```bash
  pnpm serve
  ```
  
  浏览器会自动打开，占用本地的8080端口。

- ### 语法检查

  执行：
  
  ```bash
  pnpm lint
  ```
  
  进行eslint检查，如果没有任何输出即可提交，否则请检查提示位置。

## Q&A

1. **Q:** 执行npm命令的时候提示:

    ```powershell
    无法加载文件 path/to/your/nodejs/npm.ps1, 因为在此系统上禁止运行脚本。
    ```

    **A:** 使用管理员权限打开VSCode。如果仍未解决，请先在命令行输入以下命令：

    ```powershell
    set-executionpolicy remotesigned -scope currentuser
    ```
