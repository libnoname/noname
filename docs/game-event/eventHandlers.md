# EventHandlers（已废弃）

EventHandlers 是事件系统早期使用的回调注册机制，现已被淘汰。新代码不应依赖此机制。

## 机制

`game.globalEventHandlers` 维护一个 `事件名 → handler类型 → 回调函数列表` 的二级映射。GameEvent 构造时自动调用 `addHandlerToEvent(event)` 将匹配的回调推送到事件实例上。

### 生命周期钩子

`ContentCompilerBase.beforeExecute()` 和 `afterExecute()` 分别调用：

```js
// beforeExecute — 事件 step 开始前
event.callHandler("onXxx", event, { state: "begin" });

// afterExecute — 事件 step 结束后
event.callHandler("onXxx", event, { state: "end" });
```

其中 `"onXxx"` 由事件名派生：首字母大写，前缀 `on`。例如 `"damage"` → `"onDamage"`。

### 子事件传递

`next` 链的 Proxy 在 push 新子事件时，自动将父事件上注册的 `onNextXxx` 类型 handler 推送到子事件上，实现 handler 沿事件链向下传播。
