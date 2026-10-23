# @noname/fs

《无名杀》的本地文件服务（`noname-server`）。游戏本体在浏览器/WebView 中运行时，
通过 `/checkFile`、`/readFile`、`/writeFile`、`/getFileList` 等同源 HTTP 接口读写
游戏目录，本包就是这些接口的 Fastify 实现。

```bash
pnpm -F @noname/fs dev                 # 默认在 127.0.0.1:8089 提供服务
pnpm -F @noname/fs dev --dirname=../../dist
```

## 安全模型（重要）

**这个服务没有任何鉴权**，它在设计上就是一个「把本机目录开放给同源页面」的桥。
因此：

- **只监听回环地址**。`host` 默认 `127.0.0.1`；改成局域网地址时启动会打印警告——
  同网段任何设备都能调用写/删接口改动你的游戏目录。
- **跨域只放行本机来源**（`localhost` / `127.0.0.1` / `[::1]` / `Origin: null` /
  `capacitor://localhost` 等）。历史上这里写的是 `origin: "*"`，那意味着用户访问的
  **任意网站**都能向 `http://localhost:8089` 发跨域请求读写文件。需要额外来源时用
  `--allowOrigin=<origin>[,<origin>...]` 显式追加。
- **写请求体积上限 64 MiB**（`--maxBodySize`）。原为 10 GiB，等于没有上限。
- **不提供点文件**（`dotfiles: "ignore"`），避免 `/.git/config`、`/.gitignore`
  之类被直接读走。
- 路径穿越有防护：所有接口都会在 `path.resolve` 之后校验目标仍在 `dirname` 之内
  （见 `src/index.ts` 的 `createFsHandler`）。

## 关于 HTTPS

`src/index.ts` 里保留了一段注释掉的 HTTPS 分支。仓库曾经把本地自签名的
`localhost.decrypted.key` / `localhost.crt` 一并提交（其中 `.key` 是真实 PKCS#8
私钥），现已从版本控制移除并在根 `.gitignore` 中忽略。需要 HTTPS 时请自行生成
自签名证书，**不要**把私钥提交回来。
