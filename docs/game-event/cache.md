# Cache 缓存（已废弃）

缓存系统为事件提供步骤级的记忆化存储，避免同一事件内重复计算。分为两个独立机制。

## stepCache

事件级别的记忆化缓存，在单次事件执行期间有效。每次 step 结束后由 `ContentCompilerBase.afterExecute()` 清理。

- `putStepCache(key, value)` — 存入缓存（惰性创建 `_stepCache` 对象）
- `getStepCache(key)` — 读取缓存，不存在返回 `undefined`
- `clearStepCache(key)` — 清除指定 key 或整个 `_stepCache`（key 为 null 时）
- `callFuncUseStepCache(prefix, func, params)` — 带缓存的函数调用：以 `[prefix] + 参数序列化` 为 key，命中则直接返回缓存值，否则调用 func 并缓存结果

## tempCache

二级缓存，提供 `key1 → key2 → value` 的嵌套存取：

- `putTempCache(key1, key2, value)` — 存入，惰性创建存储结构
- `getTempCache(key1, key2)` — 读取

与 stepCache 不同，tempCache 不在 step 结束时自动清理，生命周期由调用方自行管理。
