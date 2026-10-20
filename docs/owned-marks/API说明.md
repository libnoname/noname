# 标记归属 API（协议版本 1）

> P0 整改追加了默认不启用规则的旧 API 兼容原型和统一来源 UI。旧接口在显式策略下的行为及无法自动推断的边界，见 [p0-design.md](p0-design.md)。本文件描述原显式账本接口，不代表全库旧技能已自动接入。

## 模型与不变量

底层独立账本保存 `{id,revision,name,bearer,creator,owner,beneficiary,count,params,sourceSkill,lifecycle}`。四种身份都是显式分配的字符串，不存 Player 对象。`game.getOwnedMarkIdentity(player)` 只为调用者明确提供的 Player 分配身份，不根据武将、事件、技能名或座位猜来源。Player 对象的 playerid 重新生成不改变此身份。

同一 bearer/name 有一个数值投影：`storage[name] = anonymous + sum(effects.count)`。anonymous 是旧调用产生的无来源数量，不属于任何技能拥有者。`countOwnedMark` 不计算 anonymous；旧 `countMark/hasMark` 仍看聚合值。

每次修改在私有草稿上完成，校验成功后同步提交一个 revision，再更新显示、网络和录像。失败校验不改变数量或序列号。恢复不产生加减标记事件、奖励、onunmark 副作用或回传消息。异步奖励必须在成功消费之后执行。

效果数量为安全正整数，0数量只能用于移除／设置总数；参数必须是无循环的有限 JSON 数据。数组或对象型原标记不能被同键数值账本覆盖。不同参数不会因同来源而自动合并。

## Player 接口

`owner/creator/beneficiary` 接受明确的 Player 或稳定身份字符串。查询中的 owner 可省略表示全部来源；写入／转移／消费不能省略 owner。

- `addOwnedMark(name, owner, count=1, options={})`：创建新实例，返回记录副本。options 支持 creator、beneficiary、params、sourceSkill、lifecycle、log。creator/beneficiary 默认等于已明确提供的 owner。
- `getOwnedMarks(name?, owner?)`：返回符合条件的记录副本，不暴露内部可变状态。
- `countOwnedMark(name?, owner?)`、`hasOwnedMark(name?, owner?)`：查询有来源份额，不认领匿名旧数。
- `getMarkOwners(name)`：去重后的 owner 身份字符串数组；通过 `game.resolveOwnedMarkPlayer(id)` 获取当前实体，可能不存在或已离场。
- `removeOwnedMark(name, owner, count=Infinity, options={effectId?,revision?,log?})`：按明确来源移除份额，返回移除记录。revision 不匹配或实例已消费，返回空数组。
- `consumeOwnedMark(name, owner, effectId, revision?)`：同步消费整笔实例，返回已消费记录或 undefined。需要竞争保护时必须携带选择时的 revision。
- `transferOwnedMark(name,target,owner,count=Infinity,options={effectId?,revision?,log?})`：原子更新两端，完整移动保留 id／creator／owner／beneficiary／参数；部分移动产生新实例 id。目标已有匿名数也被保留。同对象转移不改变 revision。
- `updateOwnedMark(name,effectId,owner,patch,options={revision?})`：允许更新 params、count、beneficiary、owner、lifecycle；不可改 id、creator、bearer 或标记名称。返回更新记录数组。patch 是替换字段，不是 params 深合并。
- `mergeOwnedMarks(name,owner)`：显式合并相同 bearer、owner、creator、beneficiary、参数、技能、生命周期的兼容实例。不同参数／期限保留独立；被合并掉的 id 不可再消费。
- `clearOwnedMarks(name?,owner?)`：明确清除相应范围的所有有来源份额。省略 owner 是全来源清理；不会把匿名旧数归给任何人。

### 安全消费示例

```js
const record = target.addOwnedMark("example_effect", player, 1, {
    sourceSkill: "example",
    params: { hpAtGrant: target.hp },
    lifecycle: { ownerDeath: "remove", bearerDeath: "remove" },
});

// filter 和 content 均可重新查当前份额，content 的消费是最终竞争检查。
const selected = target.getOwnedMarks("example_effect", player)[0];
if (selected) {
    const consumed = target.consumeOwnedMark(selected.name, player, selected.id, selected.revision);
    if (consumed) await player.draw();
}
```

不能先 await 发收益再移除，也不能在多个 owner 的效果存在时用旧 `clearMark` 代替单来源消费。

## 旧接口兼容边界

未启用来源账本的数字、数组、共享状态和自身资源维持原实现。`addMark/removeMark/setMark/countMark/hasMark/markAuto/unmarkAuto` 不会自动认主。

已启用的数值键，旧 add 增加 anonymous；旧 remove/set/clear 是刻意的**聚合操作**：先扣匿名，再按记录顺序扣有来源份额。它们没有声称调用者拥有某份标记。所有已经迁移的私有收益必须使用新接口，不依赖聚合清除。

旧直接 `storage[key]=number`／删除后调用 `syncStorage(key)` 会按聚合设置协调账本；未同步的直接写入无法被普通对象拦截，不属于可靠的新接口。`markAuto(key,array)` 不能把已启用的同键数字账本改成数组。重置角色时按生命周期处理来源；旧匿名数按旧 uninit 清空规则清除。

`syncStorage` 原本是录像存储接口。新账本通过专用状态消息同步，不以它冒充网络同步。UI 标记的显示名字与颜色不参与权限判定。

## 生命周期与关系通知

策略默认：ownerDeath=retain、bearerDeath=remove、skillRemoval=remove、reset=remove。技能可以覆盖 remove/retain。暂离、断线、技能暂时失效不会自动销毁关系；技能效果应另查当前 owner 的在场及有效技能资格。永久移除清除涉及该实体的关系，游戏重新准备清空会话。

`sourceSkill` 是清理策略与通知入口，不是玩家身份。`game.handleOwnedMarkLifecycle(player,reason,skill?)` 支持 death、removeSkill、reset、remove；实际引擎已接死亡、失技能、换将／uninit、永久移除。不要用 out 当 death。

技能可定义 `onOwnedMarkChange(recordOrNull,previousOrNull,{restoring})` 重建额外状态，例如夺锐的禁用理由／附加技能来源。恢复分支必须幂等，不发奖励、不修改账本；必须重建无法从通用基础武将状态还原的派生辅助技能。关系删除时 previous 仍带完整参数。

## 恢复、版本与性能

Game export/import、录像、重连及显式模式存档接口见 [recovery.md](recovery.md)。网络以 JSON 字符串运输完整快照，防止通用编码器深度截断和保留字符串误解释。相同／过时 revision 不覆盖新状态，跨会话需 reset 或显式 force；旧录像不新增猜测出来的关系。

当前实现对启用的效果列表做线性扫描与草稿／快照复制，内存 O(E)，每次修改及同步 O(E)，E 为本局有来源实例数；普通旧资源标记未启用时不创建来源记录。完整快照优先保证恢复与幂等性，尚未针对极大规模扩展做增量性能优化或压力基准。
