# gameEvent.ts 方法/属性归属映射

[gameEvent.ts](../../apps/core/noname/library/element/gameEvent.ts) 中的方法/属性按模块划分。

## 外部交互 (interaction)

`[key: string]: any`, `_args`, `_set`, `set()`, `result`, `cost_data`, `then()`, `catch()`, `finally()`, `forResult()`

参数属性：`type`, `source`, `player`, `players`, `target`, `targets`, `card`, `cards`, `skill`, `forced`, `num`, `original_num`, `directHit`, `baseDamage`, `extraDamage`, `customSource`, `nature`, `unreal`, `responded`, `forceDie`, `includeOut`

实用方法：`changeToZero()`, `setHiddenSkill()`, `getLogv()`, `send()`, `sendAsync()`, `getRand()`, `isMine()`, `isOnline()`, `notLink()`, `isPhaseUsing()`, `resume()`, `_oncancel`

## 内部生命周期 (lifecycle)

`constructor`（含 `_triggered` 初始化）, `static initialGameEvent()`, `name`, `_triggered`, `resolve()`, `start()`, `loop()`, `checkSkipped()`, `#inContent`, `finished`, `finish()`, `cancel()`, `neutralize()`, `unneutralize()`

## 事件关系 (relationships)

`manager`, `parent`, `childEvents`, `getParent()`, `next` (Proxy), `after`, `insert()`, `insertAfter()`, `waitNext()`

## Trigger (trigger)

`_trigger`, `triggername`, `getTrigger()`, `doingList`, `_triggering`, `filterStop`, `addTrigger()`, `removeTrigger()`, `trigger()`, `untrigger()`, `notrigger`, `_notrigger`

## Content 编译 (content)

`content`, `setContent()`

编译器实现分散在 `GameEvent/compilers/` 目录下。

## 待废弃

| 方法/属性 | 对应文档 |
| --------- | -------- |
| `step` (getter/setter), `goto()`, `redo()`, `updateStep()`, `_result` | [content.md](content.md) 附录 |
| `custom`, `backup()`, `restore()` | [chooseToUse.md](chooseToUse.md) |
| `callHandler()`, `getHandler()`, `pushHandler()`, `hasHandler()`, `getDefaultHandlerType()`, `getDefaultNextHandlerType()` | [eventHandlers.md](eventHandlers.md) |
| `putStepCache()`, `getStepCache()`, `clearStepCache()`, `callFuncUseStepCache()`, `putTempCache()`, `getTempCache()` | [cache.md](cache.md) |
