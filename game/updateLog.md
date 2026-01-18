# v1.11.1更新内容

※我们继续和一些优秀且具有开源精神的代码编写者保持着积极合作。在这一版本中，我们通过接收GitHub的Pull Request，整合了@AstralBarrage @ChiryuhLii @Cicardo-Thicavasco @diandian157 @dragonJadeRan @kuangshen04 @mengxinzxz @MizuhaHimuraki @nonamemajun @rebirth-of-I-am @rintim @Sun-F2004 @S-N-O-R-L-A-X @typ-yunpeng @Xiazhiliao @xiyang141 @xizifu @xjm0708 @yx-lingmeng共19位贡献者编写的代码（排名不分先后）。

## 新武将

- **十周年：**
  - 限定专属: 新杀谋蒋干、新杀谋淳于琼、威刘备
  - 其他: 星张郃
- **OL：**
  - 门阀士族: 族荀莳、族陈泰
  - 其他: OL乐曹洪、OL曹金玉、OL界辛宪英
- **手杀/海外：**
  - 始计篇: 手杀神姜维
  - 兵势篇: 势臧洪
  - 袖里乾坤·君子六艺: 书张芝、御曹植、手杀乐周瑜、数刘徽
  - 老友季·合肥: 手杀合张辽、手杀合李典、手杀合乐进
  - 海外服·江山如故: TW起刘备
  - 其他: 韩玄、TW魔麴义
- **线下：**
  - 神话再临·线下: 赛马神马超、SP赛马神马超
  - 马年限定·赛马娘: 菲尔瓦娜·赤霞、骅骝·璆琳、爪黄·飞电、紫骍·子建、绝影·婕媖、赤兔·燎原、的卢·黛露
  - 一将之魂: 将满宠

## 底层改动

### 兼容模式（重要）

- 用于保留部分即将废弃的api，以便扩展平滑迁移。
- 正常游玩建议开启，扩展作者开发时建议关闭来观察如何适配。
- 兼容模式的api将保留1-2个版本。

> **注：** 旧兼容模式的无视报错功能已和`无视扩展报错`设置合并为`无视报错`

### 手牌展开功能

新增`选项>外观>手牌展开`选项，手牌数量过多时候，选中手牌旁边手牌会向两边散开，完全展开选中的手牌

### 连接牌

内置蚀心入魔的连接牌机制并事件化，用法可参考慢关银屏和慢于禁两个用到此机制的武将，涉及修改是：

```javascript
// 1.事件化连接牌和重置连接牌，详情请看lib.element.player.connectCards/resetConnectedCards
player.connectCards(cards);
player.resetConnectedCards(cards);

// 2.判断是否为连接牌
!get.info("_sxrm_connect").isConnect(card); //旧
get.is.connectedCard(card); //新

// 3.判断连接牌数或有无连接牌
get.info("_sxrm_connect").isConnect(target.getCards("h")).length; //旧
// 获取角色所有的连接手牌
target.getConnectedCards();
// 获取角色所有的连接手牌数
target.countConnectedCards();
// 判断一名角色是否拥有连接手牌
target.hasConnectedCards();

// 4.系统执行连接牌操作
get.info("_sxrm_connect").addConnect(connects); //旧
game.addConnectedCards(connects); //新

// 5.系统重置连接牌操作
get.info("_sxrm_connect").removeConnect(cards); //旧
game.removeConnectedCards(connects); //新

// 6.系统刷新连接牌操作
get.info("_sxrm_connect").refreshMark(); //旧
game.updateConnectedCards(); //新
```

### Rest事件

休整事件由死亡事件中独立（用法可参考十常侍）

```javascript
/**
 * 令玩家休整，同时会触发rest时机
 * @param { object | undefined } restMap 进入休整状态状态相关的参数（type是休整的计数方式，"round"是在你的额定回合开始前才计数，"phase"是每回合都计数；count是休整多少轮或者多少回合（为负数则永久休整，可以自主脱离））
 * @returns { GameEvent }
 */
player.rest(restMap = { type: "phase", count: -1 })
/**
 * 令玩家结束休整
 * @param { object | undefined } reseEndMap 进入休整状态状态相关的参数（hp是脱离休整复活时回复至的体力值）
 * @returns { GameEvent }
 */
player.restEnd(restEndMap = { hp: null })
```

### ExtraEquip（不稳定）

视为装备，无对应实体/虚拟牌（用法可参考火诸葛）

```javascript
/**
  * 添加视为装备
  * @param {string} skill 视为装备的技能
  * @param {Array<string>|string} equip 视为装备的牌名
  * @param {boolean} replace 是否清除该skill原有视为装备
  * @param {Function} [preserve] 视为装备的条件,用于八阵类视为装备
  */
player.addExtraEquip(skill, equip, replace = false, preserve)
/**
 * 移除视为装备
 * @param {string} skill 移除的技能
 * @param {Array<string>|string} equip 移除的装备
 */
player.removeExtraEquip(skill, equip = "noequip")
```

## api更改

### 新增

#### Skill.initGroup

用于指定登场势力（用法可参考谋孙尚香、玄司马昭）

#### game.finishCard

传入单个卡牌id，用于初始化单个卡牌

#### 代码编辑器相关

- 重写ui.create.editor
- 废弃lib.codeMirrorReady
- 废弃ui.create.editor2，请改为使用ui.create.editor

示例：

```javascript
ui.create.editor({
 language: "json",
 value: JSON.stringify(initialValue, null, 2),
 saveInput: result => {
  const config = JSON.parse(result);
  if (!Array.isArray(config)) {
    // 抛出异常以重新编辑
   throw new Error("代码格式有错误，请对比示例代码仔细检查");
  }
   game.saveConfig("myconfig", config);
 },
});
```

### 立即废弃

#### gnc相关

- noname.js导出的gnc
- lib.gnc
- lib.genSync
- lib.genAwait
- util的mutex类
- 扩展的构造函数、precontent、onprepare与content的迭代器(function*)写法
- lib.init.setMode_XXX的迭代器(function*)写法

> 适配方法：改为异步函数

#### lib.corcurrent

#### lib.channel

> 适配方法：改为lib.announce相关方法

#### lib.creation

#### lib.linq

#### lib.comparator

#### lib.init.eval

#### util/index.js

- Mutex
- freezeButExtensible
- compatibleEnvironment
- leaveCompatibleEnvironment
- jumpToCatchBlock
- cast
- androidNewStandardApp

#### 沙盒相关

- util/error.js
- util/initRealms.js
- util/sandbox.js
- util/security.js

> 以上内容改为全部由util/sandbox.js导出，但不推荐扩展使用

#### promise-error-handler

#### game/source.js

#### GameEventPromise相关

- lib.element.GameEventPromise
- GameEvent.toEvent
- GameEvent.toPromise

> 适配方法：直接使用GameEvent

#### GameEvent.debugger

#### player.$enableEquip/player.$disableEquip

#### window.isNonameServer相关

- window.nodb
- window.isNonameServer
- window.isNonameServerIp
- 启动URL传参?server=xxx

### 移入兼容模式

#### 导入相关

> 注：不建议直接import无名杀内核中不由`noname.js`导出的内容，这些内容的更改不会在更新公告中说明

- game/dedent.js
- game/vue.esm-browser.js
- noname/get/pinyins/index.js

> 适配方法：改为`import xxx from "dedent"` `import xxx from "vue"` `import xxx from "pinyin-pro"`

#### 文件系统相关

- lib.node.fs
- window.resolveLocalFileSystemURL
- util/index.js nonameInitialized

> 适配方法：改为无名杀自带的game.xxx/game.promises.xxx方法

#### GameEvent.forResult相关

- await后直接从返回值解构result

    ```javascript
    const { result } = await event;
    ```

    **改为:**

    ```javascript
    const result = await event.forResult();
    ```

- 给forResult传递字符串

    ```javascript
    const cards = await event.forResult("cards");
    ```

    **改为:**

    ```javascript
    const { cards } = await event.forResult();
    // 或
    const cards = (await event.forResult()).cards;
    ```

- forResultXXX()

    ```javascript
    const cards = await event.forResultCards();
    ```

    **改为:**

    ```javascript
    const { cards } = await event.forResult();
    // 或
    const cards = (await event.forResult()).cards;
    ```

#### 事件的generator content (function*)

> 请改为async function的写法

```javascript
event.setContent(function*(event, map){
    const { cards } = yield map.targets[0].chooseCard();
})
```

**改为:**

```javascript
event.setContent(async function(event, trigger, player){
    const { cards } = await event.targets[0].chooseCard().forResult();
})
```

#### get.event相关

- 给get.event传递字符串

    ```javascript
    get.event("xxx")
    ```

    **改为:**

    ```javascript
    get.event().xxx
    ```

#### GameEvent.addNumber相关

- GameEvent.addNumber
- GameEvent.subtractNumber
- GameEvent.increase
- GameEvent.decrease

> 适配方法：直接对事件属性更改(+=/-=)

#### game.asyncDelay相关

- game.asyncDelay
- game.asyncDelayx

> 适配方法：直接使用game.delay或game.delayx

#### Map的数组方法（lib.nature相关）

- Map.contains
- Map.includes
- Map.push
- Map.add
- Map.addArray
- Map.remove

> 适配方法：改为map原生方法(Map.has/Map.get/Map.set/Map.delete)

#### HTMLDivElement.animate相关

- 与原生js冲突的HTMLDivElement.animate(name: string, time?: number)

> 适配方法：改为HTMLDivElement.addTempClass(name: string, time?: number)

#### lib.init.jsForExtension

> 适配方法：改为使用esm导入(`await import(xxx)`)

#### player.get/player.num

> 适配方法：player.get改为使用player.getCards/player.getSkills; player.num改为使用player.countCards/player.getSkills(xxx).length

#### player.insertEvent
