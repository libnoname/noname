# v1.11.3更新内容

※ 我们继续和一些优秀且具有开源精神的代码编写者保持着积极合作。在这一版本中，我们通过接收GitHub的Pull Request，整合了 @1937475624 @1TheLeaderOne @diandian157 @gitxin09 @mengxinzxz @rintim @willinie @Xiazhiliao @xjm0708 @xiyang141 @xizifu @yx-lingmeng @YYUZDS @Zander-Sun 共14位贡献者编写的代码（排名不分先后）。

# 新武将

- **十周年:**
  - 星河璀璨: 星张松
  - 限定专属: 张裕、刘璿、威张星彩、新杀谋张任、史阿、王越
  - 一将成名2026: 笛音荀勖、勘律荀勖
  - 武将列传: 曹豹

- **OL:**
  - OL专属: 闪张郃、OL界张松、OL界夏侯氏
  - 限时地主: 乐诸葛亮
  - 璀璨星河: OL刘晔、OL皇甫嵩、董予安、逄纪

- **手杀/海外:**
  - 限时地主: 赤兔、绝影、的卢
  - 喵喵杀: 体重之神、可爱之神、委屈之神、抉择之神、变幻之神、睡眠之神、逆转之神、美腿之神、宫百万
  - 移动版·缘: 缘孙权、缘关羽、缘梅成、缘陈兰、缘蹋顿
  - 兵势篇: 手杀朱绩
  - 未分组: 手杀张既

- **线下:**
  - 四象封印: 标轲比能、标牛金、标甘夫人、标王沈、标曹金玉、标吕伯奢、吴珂
  - 雁翎耀光: 雁翎庞统、雁翎典韦
  - 神霸虎牢: 虎牢神关羽、虎牢神诸葛亮、虎牢神吕蒙、虎牢神周瑜、虎牢神吕布
  - 文心雕龙: 文曹植

# 底层改动

## 为所有不定参数的Player方式添加可提供类型的obj参数 (#3428)

无名杀不少创建事件的函数都是不定参数顺序的，以`chooseCard`举例，`player.chooseCard(2, true)`和`player.chooseCard(true, 2)`都发挥一个功能，即强制选择两张牌；这些不定顺序的函数有一个问题，就是不好写函数的注释

目前为所有参数为不定参数的`Player#xxx`增加了一个新的形参，即提供一个和`Player#chooseCardTarget`参数形式一样的object类型参数，而该object类型的参数拥有完整的类型，方便函数使用

**注:** 该改动理应不影响以前的扩展，但由于固有代码与现形式的部分冲突，发生以下情况请及时适配:

- 在使用`Player#chooseCard`等选择牌函数的时候，如果只给了一个参数且该参数是限定可选择什么牌的object（如`player.chooseCard({ type: "trick" })`），如果限定object没有name属性，则会被当成obj参数从而导致函数异常

## 重写Step Content任务 (#3323) (W.I.P)

Step Content过于依赖Javascript的动态，导致现在环境下，Step Content拥有下面的问题:
- IDE/LSP无法正常理解Step Content中的状态问题
- AI也无法理解Step Content的逻辑
基于此，将本体的Step Content都重写成Async Content和Array Content需提上日程，其中无需跨步的重写成Async Content，而需要跨步的重写成Array Content

目前已完成下面的任务:

- 重写`lib.element.content`中的所有`Step Content`函数 (#3324)
- 重写神话再临和神将的`Step Content` (#3336)
- 重写界限突破包的所有step content (#3407)
- 重写旧武将包和四象封印包的所有step content (#3450)

等所有Step Content均重写完后，将会把武将包和模式打包成单文件，从而加快游戏加载流程

**注:** 重写Step Content不代表要舍弃Step Content，请无需担心

## API更改

### 新增

**Player#sortHandcard**和**Player#sortHandcardOL**

- 用于整理手牌，其中`Player#sortHandcard`用于单机，而`Player#sortHandcardOL`同时作用于单机和联机，建议一般情况下均使用`Player#sortHandcardOL`

**game.syncHandcard**

- 供联机中主机同步手牌状态，应用可参考OL的蒋琬

### 变动

**game.addPlayerOL**和**game.removePlayerOL**

- 改为异步函数（返回值不变），同时增加新函数，可允许自定义动画；`game.addPlayerOL`可增加添加角色的来源
- 现函数签名如下:
```typescript
type Game = {
    ...
    /**
     * 添加一个新玩家到target的上家或下家（默认为上家）
     * @param { Player } target 新玩家的下家
     * @param { string|undefined|null } [character] 新玩家主将
     * @param { string|undefined|null } [character2] 新玩家副将
     * @param { boolean } [isNext] 是否添加到下家
     * @param { object } [config] 一些别的参数塞这来！
     * @param { Player } [config.source] addPlayer的来源，不填就是没有
     * @param { ((player: Player) => Promise) | false } [config.animate] 添加player的动画，有默认动画，自定义动画须返回一个promise；false则不生成动画
     * @returns { Player }
     */
    async addPlayerOL(target, character, character2, isNext, config = {})

    /**
     * 移除一名玩家，单机联机都可用
     * @param { Player } player 要移除的玩家
     * @param { object } [config] 一些别的参数塞这来！
     * @param { ((player: Player) => Promise) | false } [config.animate] 移除player的动画，有默认动画，自定义动画须返回一个promise；false则不生成动画
     * @returns { Player }
     */
    async removePlayerOL(player, config = {})
    ...
}
```

**Player#showCards**

- 新增 `multipleShow` 属性，有该属性时，showCards 的 log 改为每个在此次事件中有牌被展示的角色依次展示

**Player#clearSkills**

- 如果第一个参数不为真则直接返回`this.removeSkills(this.getSkills(null, false, false).removeArray(skills))`，否则走老逻辑

**game.gameDraw**

- 新增可传入`targets`数组（不传默认为`game.players`），让部分人定向执行分发起始手牌

### 废弃

**game.addPlayer**和**game.removePlayer**

- 请使用`game.addPlayerOL`和`game.removePlayerOL`替代
