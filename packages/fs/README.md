生成ssl证书:

[掘金链接](https://juejin.cn/post/7242694746829045819)

## 安全说明

- 服务默认只监听 `127.0.0.1`，不会暴露到局域网；需要局域网访问时显式传入 `--host 0.0.0.0`。
- 文件接口（`/readFile`、`/writeFile`、`/removeFile`、`/removeDir` 等）需要本地会话凭据：
  - 浏览器：加载页面时自动下发 `noname_fs_auth` Cookie（`HttpOnly` + `SameSite=Strict`），跨站页面无法携带或伪造；
  - 非浏览器调用：读取 `<dirname>/Home/.fs_auth_token`，通过 `x-noname-fs-auth` 请求头发送。
- 服务拒绝来源（`Origin` / `Referer`）非本机的请求，跨域 CORS 同样只允许本机来源。
