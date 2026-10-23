# chooseToUse（待重构）

chooseToUse 是事件为技能出牌/选择目标提供的筛选配置机制。通过 `backup()` 保存事件当前的 filter/select 函数，将技能的筛选逻辑临时覆盖到事件上，技能执行完毕后通过 `restore()` 恢复。

## 机制

### event.custom

持有自定义筛选函数：

- `custom.add` — 追加的筛选逻辑
- `custom.replace` — 替换的筛选逻辑

### event.backup(skill)

将事件当前的所有筛选/选择相关属性保存到 `_backup`，然后从技能信息中读取对应配置覆盖到事件上：

**通用属性**：`filterButton`、`selectButton`、`filterTarget`、`selectTarget`、`filterCard`、`selectCard`、`position`、`ai1`、`ai2` 等

**viewAs 技能额外处理**：
- `filterOk` 包装：检查 viewAs 函数是否允许当前卡牌
- `filterCard` 先过 mod 检查再套用自定义 filter
- 清除 `_buttonChoice`、`_cardChoice`、`_targetChoice` 等暂存的选择结果

### event.restore()

从 `_backup` 恢复所有被覆盖的属性，删除临时添加的 `skill`、`ignoreMod`、`filterCard2` 等字段。
