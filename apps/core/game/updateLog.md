# v1.11.4更新内容

※ 我们继续和一些优秀且具有开源精神的代码编写者保持着积极合作。在这一版本中，我们通过接收GitHub的Pull Request，整合了 @bacz00 @ChiryuhLii @DennyCats @Foxissimo-8 @gitxin09 @karimvern @morego123 @PositionZer0 @qihang518887 @rintim @Spmario233 @xizifu @xjm0708 @yx-lingmeng @YYUZDS @Zander-Sun @zhpy2004 @zziyoo 共18位贡献者编写的代码（排名不分先后）。

# 新武将

- **十周年:**
  - 神武: 神曹丕

- **OL:**
  - 魔武将: 魔张飞
  - 门阀士族: 族陆郁生

- **手杀/海外:**
  - SP: 手杀诸葛果
  - 测试服: 手杀夏侯楙
  - 限时地主: 魔周瑜
  - 袖里乾坤: 手杀曹纯
  - 神将异构: 手杀神马超

- **线下:**
  - 蚀心入魔: 魔周瑜

# 底层改动

## 使自由选将搜索栏能以技能搜索武将 (#3592)

由于群友觉得搜索栏应该能以技能搜索武将，故添加该功能

## 修改仅点将可用机制，分离单独禁将和整体禁将 (#3622)

无名杀在几个月前增加了武将包的“仅点将可用”选项，使得能使一整个武将包在开启的状态下使人机无法选择其中的武将

但当时的逻辑是在加载武将包时修改`lib.config.forbidai_user`，武将包仅点将则把该武将包的所有武将均放进去，反之就把该武将包的所有武将移除

这使得“随机选将可用”完全没了作用，因为在加载武将包时会立即根据“仅点将可用”的状态更新数组，使得单独禁将失去了作用

现在分离了相关逻辑，“随机选将可用”仍然走`lib.config.forbidai_user`，而仅点将可用则在加载游戏时单独根据配置判断

## 修复电脑端不支持window.prompt导致无法正常运行 (#3638)

由于Electron不支持`window.prompt`，导致一些使用`window.prompt`读取用户输入的地方均无法在Electron正常运行

现将这些地方改成无名杀自带的`game.prompt`和`game.promises.prompt`，以使得Electron正常运行

> 目前唯一留下的`window.prompt`会检测移动端和诗笺版接口，Electron端不会访问，故无修改

## 支持viewAs函数返回卡牌名称 (#3658)

原先函数式viewAs返回string类型，仅做了类型声明，未进行实现

现在实现了对string返回值的处理，可以正常使用了

目前，函数式viewAs的返回值类型，是原本静态viewAs类型的超集

也就是说，如果需要动态计算某些参数，现在所有静态viewAs都可以改为函数式viewAs

## 国战暗将时，长按暗将点击查看资料时，可以直接看到隐藏的主将 (#3747)

上个版本中，对于拥有隐匿技的武将和国战暗将，在武将牌未知时，可通过“查看资料”来获取武将信息

现版本中，如果一个武将是“未知”的，则不会显示“查看资料”按钮

## 将【Charlotte技】正式更名为【异能技】 (#3877)

给Charlotte技确认了正式的名称，至于延迟效果等charlotte标签是否需要改名则另当别论

## API更改

### 新增

**Player#iterableGetConnectedCards**、**Player#iterableGetShownCards**和**Player#iterableGetKnownCards**

- 用于以迭代器的形式遍历连接牌/明置牌/已知牌，对于不需要完整数组的情况下能优化相关性能

**Player#hasCards**、**Player#hasDiscardableCards**和**Player#hasGainableCards**

- 用于判断是否有牌/可弃置的牌/可获取的牌，参数位置同`Player#getCards`/`Player#getDiscardableCards`/`Player#getGainableCards`
- `Player#hasCards`拥有短路机制，在获取到存在牌时即会返回结果，无需完整遍历牌区，能优化相关性能

**Player#countHistory**、**Player#countAllHistory**和**Player#countRoundHistory**

- 为“获取某轮次XX事件数量”“获取当前回合XX事件数量”“获得整局XX事件数量”增加了统一的数量函数

**get.hpColor**

- 获取一名角色的勾玉颜色。用法参考【瞋视】

### 变动

**Player#getShownCards**、**Player#countShownCards**和**Player#hasShownCards**

- 现版本已知牌相关的函数在判断`filter`时，会先走一遍是否符合`filter`，再判断是否已知；上个版本前是先判断是否已知，再判断`filter`；这会导致现在提供给`filter`的函数会出现未知牌。如果原先代码中存在直接从`filter`中编写逻辑的情况，则会导致相关函数退化会`get/count/hasCards`，需要适配

**Player#changeHp**、**Player#gainMaxHp**和**Player#loseMaxHp**

- 返回的事件增加属性`changedHp`和`changedMaxHp`，用于获取准确的体力值变化值和体力上限变化值

**Player#gainMultiple**

- 返回的事件增加属性`gaintag`，支持使用`gaintag`给获得的牌添加标记
