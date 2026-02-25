# v1.11.2更新内容

※我们继续和一些优秀且具有开源精神的代码编写者保持着积极合作。在这一版本中，我们通过接收GitHub的Pull Request，整合了 @diandian157 @kuangshen04 @rintim @S-N-O-R-L-A-X @Xiazhiliao @xiyang141 @xizifu @xjm0708 @yx-lingmeng共9位贡献者编写的代码（排名不分先后）。

## 新武将

- **十周年：**
  - 限定专属: 新杀陈祗、新杀谋刘璋、威公孙瓒
  - 群英荟萃: 新杀张世平、新杀魏讽
- **OL：**
  - OL专属: OL界曹节
- **手杀/海外：**
  - 移动版·缘: 缘檀石槐、缘吕布、缘高顺
  - 谋攻篇: 谋朱然
  - 联动卡: 集蜜袁术、手杀木牛流马
  - 外服武将: TW皇甫嵩、TW起王允
- **线下：**
  - 雁翎耀光: 雁翎小乔、雁翎于吉
  - 无名专属: 幻小无

## 底层改动

### 项目结构更改

- 项目结构更改为monorepo，本体代码位于`apps/core`下
- 开发分支切换为`main`，以后请向`main`分支提交pr
- 加入electron启动器代码（位于`apps/electron`下）
- 将原先的`noname-server.ts`（文件系统管理）分离为`@noname/fs`包（位于`packages/fs`下）
- 将原先的`scripts/server.js`（联机服务器）分离为`@noname/server`包（位于`packages/server`下）
- `game/asset.js`与`game/config.js`改为使用json存储

### 扩展工程化

- 可以在`packages/extension`下创建工程化扩展，直接参与本体的开发服务器与打包流程
- 使用`pnpm init:extension <name> [--author <author>] [--vue]`命令来快速创建新工程化扩展
  - `<name>` 扩展目录名与扩展名
  - `--author <author>` 作者名，默认: 无名玩家
  - `--vue` 启用 Vue

> **提示：** 开发模式使用`build:watch`命令，生产模式使用`build`命令，打包到`apps/core/extension`文件夹下。具体配置请参考`scripts/extension-template`下的模板。

### lib.element.content相关

- lib.element.content全部重构为async content

### 在线更新相关

- 由于本体项目结构正在重构，在线更新功能暂时废弃，请前往<https://github.com/libnoname/noname/releases>下载最新版本
- 在1-2个版本后会重新加入在线更新功能，与启动器一并发布

## api更改

### 新增

#### get.is.damageCard(card)

- 用于判断一张牌是否为伤害牌

#### player.when相关

- `player.when()`的`.then()`方法支持传入async content

### 立即废弃

#### 扩展加载相关

- 废弃`game.runAfterExtensionLoaded`
- 废弃`lib.announce`的`Noname.Init.Extension.onLoad`和`Noname.Init.Extension.${name}.onLoad`时机

#### **（1.11.1兼容模式）** lib.init.jsForExtension

> 适配方法：改为使用esm导入(`await import(xxx)`)或使用`for(let i in files)promise.then(()=>lib.init.promises.js(xxx,i))`遍历文件

### 移入兼容模式

#### lib.init.jsSync/reqSync/jsonSync

> 适配方法：请使用异步的`lib.init.js/req/json`

#### player.when相关

- 废弃多时机参数`player.when("aaa", "bbb")`以及`player.when({player: "aaa"}, "bbb")`
    > 注: 时机的数组形式`player.when(["aaa", "bbb"])`不受影响
- 废弃`player.when()`的`.popup()`方法
- 废弃`player.when()`的`.apply()`传递作用域方法
- 废弃`player.when()`的`removeFilter()`、`filter2()`、`removeFilter2()`

#### player.draw相关

- 将draw事件的result由cards数组改为统一的`{ bool: true, cards: cards }`

> 适配方法：

```javascript
const cards = await player.draw().forResult();
// 请改为
const { cards } = await player.draw().forResult();
//或
const cards = (await player.draw().forResult()).cards;
```
