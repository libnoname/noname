# v1.10.17版本更新内容

- 彻底取消file协议的支持，以及客户端或浏览器必须启用ServiceWorker，新版本最低要求为chrome 91或ios15
- 从此版本开始，最低支持的安卓客户端为：由理版(v1.9.4)，~~兼容版(v1.8.4)~~，诗笺版(v1.6.7)，增强版(v1.3.2)，兼容版因技术问题暂时不进行更新，由理版需要卸载重装。这些APP均已强制使用HTTPS协议进行游戏以及签名验证，此举将不再能使用旧版本无名杀进行游戏。最低支持的Windows客户端为：诗笺版(v1.7.4)和新由理版客户端(没有版本号)。另外，ios端将只能使用网页端进行游戏且其余版本的无名杀APP均不为官方发布，且其内容无法保证，请注意甄别！
- 我们继续和一些优秀且具有开源精神的代码编写者保持着积极合作。在这一版本中，我们通过接收GitHub的Pull Request，整合了 @Rintim @mengxinzxz  @PZ157 @Curpond @zhichaoxi2006 @xizifu @Bryant-F @Iking123 @Icelotusflower @weeeeeesterly @1039727228  @Spmario233  等12位其他代码贡献者编写的代码。
- 正式允许使用import关键字来导入css，json，typescript和vue文件了
- 针对早已修改的`get.stringify`，将`character`文件夹和`mode/guozhan.js`中所有可以省略的`: function`给删去，减小文件大小，详见[PR2204](https://github.com/libnoname/noname/pull/2204)和[PR2212](https://github.com/libnoname/noname/pull/2212)
- 添加新武将OL韩馥、OL牛辅、成公英、星法正、传械马钧、奇巧马钧、OL董翓、新武将手杀SP甘夫人、谋郭嘉、谋张辽、SP曹操、威张辽、新杀袁胤、司马师、马钧、裴秀、幻刘封、莫琼树、无名专属·诗笺、OL南华老仙（三服老仙糖丸了）、幻曹昂、乐周瑜、谋邓艾、十周年李丰、卫青、OL武安国、OL谋公孙瓒、【线下·汉末风云】武将包、庞宏、吕据、OL郭照、星丁奉、OL薛灵芸、OL谋沮授、OL界廖化、OL谋黄月英、OL谋赵云、OL谋张飞、威孙权、OL谋张绣、龙起襄樊庞德、战神吕布、OL秦朗、势太史慈、OL刘璋、孙霸、神庞统、SP刘备、OL袁涣、手杀谋郭淮、族吴懿、幻黄盖、幻丁尚涴、手杀薛综、新服SP马超一号、新服SP马超二号、星文丑、【老友季】三个、武陆抗、势董昭、年兽、十二生肖、TW司马师、韩氏五虎、食岑昏、新张翼、威吕布、抢红包年兽、十二生肖、外服谋诸葛亮、外服谋曹丕
- 将Key武将包中的“由依”重命名为“芳冈由依”
- 单机模式下点将单挑添加玩家控制双方角色选项
- `cardPrompt`支持传入第二个`player`参数，详见[PR2229](https://github.com/libnoname/noname/pull/2229)
- 为`changeSkills`、`addSkillLog`函数添加`popup`参数以实现获得/失去技能时的`popup`功能，详见[PR2207](https://github.com/libnoname/noname/pull/2207)
- 删除未使用的技能`_save`，将唯一用到的`content`流程置入`lib.element.content`（从`lib.skill._save.content`到`lib.element.content._save`），详见[PR2229](https://github.com/libnoname/noname/pull/2229)
- 取消国战武将的体力限制
- 补充部分技能的cost选择和content执行分离
- 补充响应卡牌的chooseToRespond事件的respondTo属性
- 修复tip和记牌器开关不生效的bug
- 修改记牌器的样式且支持联机
- 修复`lib.element.player.$uninit`不能清除角色翻面、横置和tip显示的bug
- 技能的usable支持函数写法（`skill.usable(skill, player)`）
- `Player.countSkill`支持返回更多技能本回合的使用次数
- 3D武将解禁，线下卡牌包联机默认关闭
- 现在每次启动都会检测并导入根目录的noname.config.txt配置文件了
- 添加[dedent.js](https://github.com/dmnd/dedent)(MIT)，用于处理模板字符串的诱导缩进问题
- 修复Chrome 123版本新增的import-with语法会在无名杀报错的问题
- 添加部分Vite项目的特殊的查询参数功能
- 新增经Mod检测的弃牌方法Player.modedDiscard（令玩家弃置其区域内一些能被弃置的牌）
- `Get.cardPile`、`Get.cardPile2`、`Get.discardPile`功能拓展，可从牌堆顶或底部或随机开始遍历
- 修复报错弹窗不准确的问题
- 指示线优化（可从选项 - 外观 - 指示线调整配置）
- 修复乱斗自定义场景装备牌和判定牌失效bug
- 修复`chooseUseTarget`不能使用自定义ai的问题
- 加强身份局候选武将数功能
- 现在联机模式也可以自定义各身份候选武将数了
- 修复安卓端无法使用`game.download`函数在线下载文件的问题
- `Player.setAvatar`适配皮肤
- 修复千里走单骑因打断arrangeTrigger事件，可能导致事件内的chooseControl没有result的问题
- 修复历史记录栏单击后显示的技能详细中的技能名，仅会截取技能名的前两个字符的问题
- `Player.markAuto`无第二个传参时将自动刷新标记（mark/unmark）
- `Player.unmarkAuto`支持移除单个元素，并在没有长度时对此技能执行unmark，但仍然限制对应storage必须是数组以保证兼容性
- 请所有开启［加强主公］的玩家重新开关一次此功能（关闭再开启），以保证其能够正常生效！
- 修改`get.skillInfoTranslation`，为其添加保底机制，避免报错
- 修改`_wuxie`用于在联机模式下令客机接收`onChooseToUse`的相关赋值
- 修改`get.bottomCards`不再支持`get.bottomCards(0)`的写法
- 扩展衍生牌bug修复
- 修复拼点`event.small`不生效的问题
- 新增`AI.guessTargetPoints`方法
- 现在`GameEvent.addTrigger`会跑技能的`getIndex`
- 菜单增加内核查看和切换功能
- 其他bug修复、AI优化、台词调整、素材补充、姓名适配和补充函数注释。

## 扩展适配

修改了以下函数的扩展需要进行适配：

- game.check
- game.uncheck
- lib.element.player.$uninit
- lib.element.player.init
- lib.element.player.$update
- lib.element.content.die
- lib.element.player/content.draw/gainPlayerCard/chooseToGive
- lib.skill._save.content
- game.trySkillAnimate
- lib.element.content.chooseButtonOL

## 新增或修改的函数用法以及接口

### 1. get.strNumber

```js
/**
 * 返回数字在扑克牌中的表示形式
 * @param { number } num
 * @param { boolean } [forced] 未获取点数字母对应元素时，若此参数不为false，则返回字符串格式
 * @returns { string }
 */
 strNumber(num, forced) {
 if (typeof num !== "number") return;
 let result = lib.numstrList.get(num);
 if (result === undefined && forced !== false) result = num.toString();
 return result;
}
```

### 2. get.numString

```js
/**
* 返回扑克牌中的表示形式对应的数字
* @param { string } str
* @param { boolean } [forced] 未获取字母点数对应元素时，若此参数不为false，则返回数字格式
* @returns { number }
*/
numString(str, forced) {
 if (typeof str !== "string") return;
 let result = lib.numstrList.entries().reduce((map, list) => {
  map[list[1]] = list[0];
  return map;
 }, {})[str];
 if (result === undefined && forced !== false) result = parseInt(str);
 return result;
}
```

### 3. usable(skill, player)

添加技能usable的函数使用方法（同卡牌usable使用方法），以步骘【定叛】（部分）为例

```js
dingpan: {
        // 其他代码省略
 usable(skill, player) {
  let num, mode = get.mode();
  if (mode == "identity" || mode == "doudizhu") {
   if (mode == "identity" && _status.mode == "purple") num = player.getEnemies().length;
   else num = get.population("fan");
  } else if (mode == "versus") {
   if (!_status.mode || _status.mode != "two") num = player.getEnemies().length;
   else {
    const target = game.findPlayer(x => {
     return !game.hasPlayer(y => {
      return x != y && y.getFriends().length > x.getFriends().length;
     });
    });
    num = target ? target.getFriends(true).length : 1;
   }
  } else {
   num = 1;
  }
  return num;
 },
}
```

### 4. player.countSkill支持返回更多技能本回合的使用次数

```js
/**
 * @returns { number }
 */
countSkill(skill) {
 const info = lib.skill[skill];
 let num = 0;
 if (!info) {
  console.warn("“" + skill + "”为无效技能ID！");
  return 0;
 }
 if (info.usable !== undefined && this.hasSkill("counttrigger") && this.storage.counttrigger) {
  num = this.storage.counttrigger[skill];
  if (typeof num === "number") return num;
 }
 num = this.getStat("skill")[skill];
 if (typeof num === "number") return num;
 return this.getHistory("useSkill", evt => {
  return evt.skill === skill;
 }).length;
}
```

### 5. 新增Player.modedDiscard，用法同Player.discard，也触发discard事件，但不弃置不能弃置的牌

```js
// 弃置target的所有红色牌
const cards = target.getDiscardableCards(player, "he", card => {
    return get.color(card) === "red";
});
if (cards.length) await target.discard(cards, player);
// 可以改写为：
const cards = target.getCards("he", card => {
    return get.color(card) === "red";
});
await target.modedDiscard(cards, player);
```

受Mod保护的牌不会被弃置且会告知对应Mod技能
可以传参false取消技能告知，或传参"logSkill"令对应技能在拦截卡牌时触发

存在区别的地方

```js
/* 从target能被弃置的手牌中随机弃置两张 */
const cards = target.getDiscardableCards(target, "h");
if (cards.length) await target.discard(cards.randomGets(2));

/* 从target的手牌中随机弃置两张 */
const cards = target.getCards("h");
await target.modedDiscard(cards.randomGets(2), player);
由于Player.discard为强制弃牌，将第一段代码改为const cards = target.getCards("h");并不能实现第二段代码可能少弃甚至不弃牌的效果
```

### 6. `Get.cardPile`、`Get.cardPile2`、`Get.discardPile`功能拓展

效果：试从指定区域获得一张牌
第一个参数 name：{function|string|object|true} 牌的筛选条件或名字，true为任意一张牌
第二个参数 position：{string|boolean|undefined} 筛选区域，默认牌堆+弃牌堆：
"cardPile"：仅牌堆；
"discardPile"：仅弃牌堆；
"filed"：牌堆+弃牌堆+场上
若为true且name为{string|object}类型，则在筛选区域内没有找到卡牌时创建一张name条件的牌
第三个参数 start：{string|undefined} 遍历方式。默认置为"top"
"top"：从牌堆和弃牌堆顶自顶向下遍历
"bottom"：从牌堆和弃牌堆自底向上遍历
"random"：随机位置遍历

```js
// 新增start参数，可为“top”，“bottom”，“random”，代表从顶部、底部、随机获取，默认为顶部
get.cardPile(name, position, start)
```

### 7. 添加部分Vite项目的特殊的查询参数功能(需要启用service worker)

raw: 返回资源的原始内容字符串

```js
import string from './noname.js?raw';
// 打印该文件的字符串形式
console.log(string);
```

worker和sharedworker: 返回一个 Web Worker 或 Shared Worker 构造函数

```js
// 普通worker
import myWorker from 'url?worker';
new myWorker();

// 普通sharedworker
import myWorker2 from 'url?sharedworker';
new myWorker2();

// 模块worker
import myWorker3 from 'url?worker&module';
new myWorker3();

// 模块sharedworker
mport myWorker4 from 'url?sharedworker&module';
new myWorker4();
```

url: 返回资源的 URL 而不是文件内容

```js
import logoUrl from 'logo.png?url';
img.src = logoUrl;
```

### 8. 支持直接通过import导入css，json，typescript，vue文件

css: 无返回值，将css直接嵌入到html中

```js
import './a/b.css';
await import('./a/b.css');
```

注: 在chrome 123中全面支持的import-with导入css: 返回CSSStyleSheet

```js
import sheet from './a/b.css' with { type: "css" };
const { default: sheet  } = await import("./a/b.css", { with: { type: "css" } });
```

json: 将json文件的数据转换为js的json数据

```js
import json from './package.json'
const { default: json } = await import('./package.json');
```

注: 在chrome 123中全面支持的import-with导入json: 返回对应的json数据

```js
import json from './package.json' with { type: "json" };
const { default: json } = await import('./package.json', { with: { type: "json"} });
```

typescript: 返回编译后的js，同样的，在电脑端可以导入一个node的原生模块（js文件中也可用）

```js
import xxx from './a/b.ts';
const { default: xxx } = await import('./a/b.ts');

import fs from 'node:fs';
const { default: fs } = await import('node:fs');
```

vue: 同vue项目的使用方法，vue文件中目前只支持使用原生js，ts和原生css

```html
<template>
    <Hello />
</template>

<script setup lang="ts">
import Hello from './Hello.vue';
// 或
const { default: Hello} = await import('./Hello.vue');
</script>
```

### 9. `get.cards`、`get.bottomCards`、`player.getTopCards`等方法不再支持num参数小于等于0的情况

```js
/* 此前执行以下情况等均会获取相应牌堆首张牌的数组（虽然没有实际应用） ，这与新武将乐周瑜的初始手牌数可为0冲突*/

/* 从牌堆顶摸牌 */
const cards = get.cards(-1);
/* 从牌堆底摸牌 */
const cards = get.bottomCards(0);
/* 从斗地主智斗模式的底牌库中摸牌 */
const cards = player.getTopCards(-2);
```

### 10. 为`get.skillInfoTranslation`添加保底检测

在某些情况如DIY张绣百鸣初始化技能时，部分扩展的技能翻译存在为最终返回值为undefined的情况，主要是动态翻译（一般没人会在lib.translate[技能名 + "_info"]也返回不为字符串的类型吧）如：

```js
dynamicTranslate: {
    jineng(player) {
        if (player.storage.jineng == 1) return '出牌阶段，你可以摸一张牌。';
        else if (player.storage.jineng == 2) return '出牌阶段，你可以摸两张牌。';
        else if (player.storage.jineng == 3) return '出牌阶段，你可以摸三张牌。';
    }
}
现在对原来的返回值进行一步类型检查的保底检测，不为字符串则于控制台反馈
```

### 11. `Player.markAuto`

无第二个参数时支持依据各类型的this.storage[name]对技能name标记进行this.markSkill(name)或this.unmarkSkill(name)操作了

```js
/* 此前执行以下语句均无效果 */
if (typeof player.storage.skill_id1 === "string") player.markAuto("skill_id1");
if (typeof player.storage.skill_id2 === "boolean") player.markAuto("skill_id2");
```

### 12. `Player.unmarkAuto`

第二个参数即使不为数组，亦可将其作为元素加入this.storage[name]内了（当然this.storage[name]须为数组）

### 13. `AI.getTargetPoints`

获取viewer视角下target手牌的点数、最大值和最小值

target(必需): { Player } target 目标
viewer: { Player | true } 视角，true则透视
cards: { function (Card): boolean | Card[] } 枚举的卡牌或卡牌筛选条件
access: { string } [access] Cache存取，默认"11"。第一位为"1"存入，第二位为"1"读取
right: { number } 最大值限制，默认13
left: { number } 最小值限制，默认1
返回值{ nums: number[], max: number, min: number }

```js
ai.getTargetPoints(target, viewer, cards, access ,right, left);
```

### 14. 为`damage`属性添加无视护甲参数`nohujia`

示例（以`XXX`的部分代码为例）

```js
//牢写法-对自己造成1点无视护甲的伤害
lib.skill['XXX'] = {
    content() {
        player.damage();
    },
    ai: {
        nohujia: true,
        skillTagFilter(player) {
            return get.event().getParent('XXX').player === player;
        },
    },
};
//新写法①
lib.skill['XXX'] = {
    content() {
        player.damage('nohujia');
    },
};
//新写法②
lib.skill['XXX'] = {
    content() {
        player.damage().nohujia = true;
    },
};
```

### 15. 为`lib.element.player.getRoundHistory`的`filter`参数添加默认的`lib.filter.all`

第二个filer参数不存在或不为函数则默认`lib.filter.all`，不作使用介绍

### 16. 为`lib.element.player.draw/gainPlayerCard/chooseToGive`添加默认`gaintag`属性

```js
//以后将支持直接为这三个函数获得的牌添加gaintag
//lib.element.player.draw
player.draw().gaintag.add('wusheng');
//lib.element.player.gainPlayerCard
player.gainPlayerCard(target,'h',true).gaintag.add('wusheng');
//lib.element.player.chooseToGive
player.chooseToGive(target,'h',true).gaintag.add('wusheng');
```

### 17. 拓充翻页功能

添加`lib.element.dialog`方法`addPagination`
添加一系列翻页方法，翻页方法变量定义详见文件`node_modules\@types\noname-typings\Pagination.d.ts`
翻页方法具体实现详见文件`noname\util\pagination.js`
以下为界左慈【化身】代码，仅展示使用了翻页方法的部分
（目前【化身】dialog代码得到进一步优化，本实例着重于方法介绍，需要技能本身的请进入`character`文件夹查询`rehuashen`代码）

```js
//界左慈化身
rehuashen: {
 content() {
  "step 0";
  //...代码省略
  var dialog = (event.dialog = ui.create.dialog(get.prompt("rehuashen"), [cards, (item, type, position, noclick, node) => lib.skill.rehuashen.$createButton(item, type, position, noclick, node)]));
  event.dialog.videoId = event.videoId;
  var buttons = dialog.content.querySelector(".buttons");
  var array = dialog.buttons.filter(item => !item.classList.contains("nodisplay") && item.style.display !== "none");
  var groups = array
   .map(i => get.character(i.link).group)
   .unique()
   .sort((a, b) => {
    const getNum = g => (lib.group.includes(g) ? lib.group.indexOf(g) : lib.group.length);
    return getNum(a) - getNum(b);
   });
  if (groups.length > 1) {
   event.dialog.classList.add("fullheight");
   event.dialog.addPagination({
    data: array,
    totalPageCount: groups.length,
    container: dialog.content,
    insertAfter: buttons,
    onPageChange(state) {
     const { pageNumber, data } = state;
     data.forEach(item => {
      const group = get.character(item.link).group;
      item.classList[groups.indexOf(group) + 1 === pageNumber ? "remove" : "add"]("nodisplay");
     });
    },
    pageLimitForCN: ["上一势力", "下一势力"],
    pageNumberForCN: groups.map(i => get.plainText(lib.translate[i + "2"] || lib.translate[i] || "无").slice(0, 1)),
    changePageEvent: "click",
   });
  }
  //...代码省略
  "step 2";
  if (result.bool && event.control != "弃置化身") {
   event.card = result.links[0];
   var func = function (card, id) {
    var dialog = get.idDialog(id);
    if (dialog) {
     //禁止翻页
     var paginationInstance = dialog.paginationMap?.get(event.dialog.content.querySelector(".buttons"));
     if (paginationInstance?.state) paginationInstance.state.pageRefuseChanged = true;
     for (var i = 0; i < dialog.buttons.length; i++) {
      if (dialog.buttons[i].link == card) {
       dialog.buttons[i].classList.add("selectedx");
      } else {
       dialog.buttons[i].classList.add("unselectable");
      }
     }
    }
   };
   if (player.isOnline2()) {
    player.send(func, event.card, event.videoId);
   } else if (event.isMine()) {
    func(event.card, event.videoId);
   }
   var list = player.storage.rehuashen.map[event.card].slice(0);
   list.push("返回");
   player
    .chooseControl(list)
    .set("choice", event.aiChoice)
    .set("ai", function () {
     return _status.event.choice;
    });
  } else {
   lib.skill.rehuashen.removeHuashen(player, result.links.slice(0));
   lib.skill.rehuashen.addHuashens(player, result.links.length);
  }
  "step 3";
  if (result.control == "返回") {
   var func = function (id) {
    var dialog = get.idDialog(id);
    if (dialog) {
     //允许翻页
     var paginationInstance = dialog.paginationMap?.get(event.dialog.content.querySelector(".buttons"));
     if (paginationInstance?.state) paginationInstance.state.pageRefuseChanged = false;
     for (var i = 0; i < dialog.buttons.length; i++) {
      dialog.buttons[i].classList.remove("selectedx");
      dialog.buttons[i].classList.remove("unselectable");
     }
    }
   };
   if (player.isOnline2()) {
    player.send(func, event.videoId);
   } else if (event.isMine()) {
    func(event.videoId);
   }
   event._result = { control: "更换技能" };
   event.goto(1);
   return;
  }
  //...代码省略
 },
},
```

## 更详细的bug修复内容

### 技能/卡牌修正

- 修复木鹿大王【咒鳞】、新杀界郭淮【精策】
- 修复孙鲁育【魅步】弃置黑色延时锦囊结算问题
- 修复新杀蒋钦【尚义】、谋陈琳【邀作】【撰文】、王瓘【失路】
- 修复刘虞【止戈】效果
- 修复鲍信、TW鲍信【毅谋】、手杀谋贾诩【完杀】
- 修复谋黄忠【烈弓】在装备武器但是有空缺装备栏时仍然拥有【杀】无属性效果的bug
- 修复王戎【死孝】描述含“【无懈可击】外”问题，增加技能发动log，调整技能摸牌时机
- 修复起朱儁【分敌】封印卡牌效果失去时机问题
- 修复黄舞蝶、各个夏侯渊、新杀潘淑、国战徐盛、国战祢衡
- 修复周泰【不屈】弹窗
- 修复传械马钧【巧思】
- 修复桃园孙权【辅汉】
- 修复庞凤衣【异瞳】
- 修复SCL裴秀【爵制】、SCL孙寒华【冲虚】、国战杨婉【诱言】剩余牌不放回牌堆顶的bug
- 修复国战宗预承赏bug
- 修复文钦、周处、李异、王濬的技能问题
- 修复整肃相关技能及效果
- 修复黄舞蝶【伏械】无法选择部分角色的问题
- 修复成公英【匡襄】不加伤的bug
- 修复朱佩兰【痛悼】
- 修复牛金【挫锐】1v1模式登场不发动的问题
- 修复张宁【天则】
- 修复无名【出山】能获得charlotte技能的问题
- 修复界关羽，袁胤，陆凯
- 修复幻陆逊【逆涡】
- 修复无名【出山】
- 修复张让【滔乱】仅装备区有牌不能发动的问题
- 修复起孔融【争义】
- 修复张布【惩凶】
- 修复新杀田丰【随势】
- 修复朱鹭户沙耶【授计】
- 修复【拒战】、【外使】
- 修复OL韩馥【恇守】弃牌数异常的问题
- 修复谋韩当、谋黄忠、tw卢植
- 修复OL牛辅【纵略】未限制次数、裴秀【复爵】摸牌数错误、潘璋马忠【夺刀】的bug
- 修复起许劭【盈门】
- 修复吴国太【补益】
- 修复极略神司马【连破】
- 修复手杀陈珪【诡谋】，诸葛尚【三顾】
- 修复谋卢植【贞良】
- 修复左慈/界左慈失去【化身】无法更回性别和势力的bug
- 修复OL南华老仙“天书”中的一个技能效果
- 修复段颎【扫谷】令他人弃牌弹窗的bug
- 修复SP穆顺【谋溃】
- 修复手杀彭羕【达命】可不选目标的问题
- 调整袁胤【墨守】结算顺序
- 修复TW马岱【潜袭】未考虑多次封印的问题
- 修复诸葛梦雪【寄春】
- 修复OL谋袁术【厌粱】不能给装备区内牌的问题
- 修复用间董卓【失察】仅【推诚】和【耀令】均发动后才不触发的问题
- 修复太阴司马师【景略】
- 修复张燕【狼蹈】在双方同时选择目标+1结算异常的问题
- 修复九鼎小乔【天香】可以选择装备区的牌的问题
- 修复两个曹婴增伤效果被覆盖的问题
- 修复幻刘封【沉勋】、复爵裴秀【复爵】、幻陆逊【逆涡】
- 修复石韬【劫囚】获得的额外回合无法自己手动控制选择的bug（以后关闭【劫囚】自动发动即可选择）
- 修复OL谋张绣【仇猎】使用的【杀】有距离限制的bug
- 修复董翓【鞭御】选择视为【杀】的卡牌缺少“无次数限制”效果的bug
- 修复OL秦朗【贤膺】弃牌的bug
- 修复【推心置腹】不能交装备牌的bug
- 修复【密诏】交牌为明牌交的问题
- 修复孙资刘放【勤慎】摸牌数不正确的bug
- 修复庞宏【评骘】技能执行完毕才转换阴阳状态的bug
- 修复OL郭照【椒遇】执行判定最多一次的bug
- 修复OL郭照【椒遇】未考虑多种颜色的bug并添加本轮声明的颜色标记
- 修复OL郭照【内训】没判别使用类型的bug
- 修复OL郭照【内训】交给牌和获得牌非强制的bug
- 修复OL谋黄月英【并才】判别角色范围错误的bug
- 修复吕据【征越】技能效果+ai补充
- 修复陆绩【怀橘】，神甘宁【劫营】效果类技能缺少sourceSkill属性的bug
- 修复OL谋张飞【敬贤】无法给出牌反而将牌弃置的bug
- 修复星丁奉【荡尘】只能获得牌数大于1的角色的牌的bug并对此技能其余结算进行优化
- 修复星丁奉【翦羽】无法对一次性多名角色失去装备区而多次发动的bug并简化技能写法
- 修复【卜天术】和【自然馈赠】
- OL郭照【椒遇】标记显示适配非红黑的其他颜色
- 修复OL郭照【椒遇】标记背景颜色出错的bug
- 修复陶升【扦卫】给牌不摸的问题
- 修复唐周限定技结算问题
- 修复OL谋黄月英【并才】
- 修复OL薛灵芸【思泣】结算
- 修复界马忠【抚蛮】的bug
- 修复【裸衣】添加不存在的子技能
- 修复南华老仙天书获得的效果标记显示问题
- 修复【七星宝刀】在交换装备区时出错的问题
- 修复战神吕布【戒酒】hiddenCard检测问题
- 修复族王沈【岸然】显示问题
- 修复SP祝融缺少技能【探乱】的bug
- 修复屈原【离骚】有玩家回答错误也会结束抢答的bug

### 卡牌/技能AI优化

- 优化神孙策【冯河】ai
- 新杀王濬【长驱】加伤ai补充
- 优化费曜【镇锋】ai
- 重写手杀司马伷【避锋】ai
- 添加【复难】ai
- 调整【铁索连环】【戮力同心】无懈ai
- 修复新杀谋蒋济【应时】、周泰、界周泰【不屈】ai；重写新杀潘凤【狂斧】ai
- 修复少阴骆统、少阳刘谌、刘谌、界刘谌【战绝】、谋袁绍【血裔】、袁谭袁尚【内伐】ai
- 骆统ai修复
- 调整新杀刘辟【踞营】、牛辅董翓【凶袭】ai
- 修复新杀夏侯霸【豹变】ai
- 微调【雌雄双股剑】ai
- 添加少阳孙鲁班【除异】ai
- 修复OL文钦【犷骜】ai
- 修复SP甄宓【惠济】ai
- 修复各【锋势】ai
- 修复乐大乔【姊希】ai
- 优化文鸳【铿锵】ai
- 优化界关羽【义绝】ai
- 修复官盗S1066★贾诩【驱魄】ai
- 重写星孙坚【锐军】ai
- 修复王桃【护关】ai
- 调整星孙坚出牌顺序ai,星孙坚用牌诱导ai、回血加成ai
- 补充攒桃和嘲讽ai
- 优化新杀甘夫人【淑慎】ai
- 修复TW马腾【雄争】ai
- 修复新杀祢衡【舌剑】ai
- 修复OL韩馥【恇守】
- 优化OL谋华雄【搏决】ai
- 优化OL张春华【翦灭】ai
- 优化张楚【集众】、张华【剑合】ai
- 微调【乐不思蜀】ai
- 调整神孙策【英霸】嘲讽
- 增加神孙策【冯河】ai
- 添加袁胤【墨守】ai并调整技能效果
- 修复手杀谋徐晃AI对队友发动【势迫】的问题
- 调低【英魂】收益ai
- 修复祭风卧龙并增加ai
- 优化少阳孙鲁班ai
- 修复马伶俐【硝引】ai
- 补充新杀谋蒋济【势举】ai
- 增补神赵云摸牌ai、高达一号连弩ai、南极仙翁【福照】ai
- 重写吴兰【挫锐】ai
- 修复【凌人】ai
- 修复神皇甫嵩ai与bug
- 修复oljiaoyu的ai
- 修复木鹿大王【咒法】受伤计算距离对象算反的bug
- 修复十常侍【党锢】被锁的情况下脱离休整无法选择常侍的bug
- 修复庞弘【评骘】使用牌计入次数的bug
- 修改谋诸葛瑾【缓释】描述并修复【缓释】使用手牌修改判定牌无法获得原判定牌的bug
- 修复手杀司马孚“臣节”对成为过“蹒襄”目标但不是当前回合成为过的角色失效

### 技能/描述调整

- 修复【无双】描述
- 调整手杀谋贾诩【乱武】
- 调整国战许攸【成略】
- 调整国战吕范【调度】
- 修复孟达描述
- 陈式【擎北】显示优化
- 调整周宣【寤寐】时机为规则集中的回合开始后④（卑弥呼【纵傀】时机）phaseBeforeEnd，大幅简化技能实现写法（笑点解析：翻面不能发动【寤寐】）
- 修改武将武皇甫嵩、乐貂蝉、OL界李儒、谋曹丕、谋韩当、手杀贾充的技能
- 修改OL谋华雄【扬威】标记描述
- 修改谋董卓；乐貂蝉、文钦的技能
- 调整OL谋关羽【威临】封牌时机
- 修复【奇巧】描述
- 修复【威临】描述
- 调整手杀谋诸葛瑾的所有技能
- 调整OL谋董卓【封赏】
- 调整谋吕蒙【夺荆】
- 调整OL谋华雄【扬威】
- 调整手杀谋贾诩【完杀】
- 调整OL董翓技能
- 修改OL牛辅技能名
- 修改OL界李儒
- 调整威张辽，庞凤衣，武皇，幻刘禅技能
- 调整威张辽驭袭】
- 调整石苞、星法正
- 调整阳球，幻刘禅
- 调整凌操【独锋】
- 起孔融技能async化并防止被【中流】刷新
- 许攸、蒯良蒯越、卢植（3个版本）、严颜等一批老的转换技武将调整优化
- 修正【复爵】描述
- 修改谋郭嘉、莫琼树
- 修复黄舞蝶【双锐】、刘协【天命】技能描述
- 调整南华老仙，谋董卓，张奋
- 调整OL谋董卓【封赏】
- 调整OL李儒【灭计】
- 修复经典孙策【双璧】描述
- 优化OL文钦【彗企】描述
- 修复蒯祺【良秀】描述
- OL界程普【醇醪】“醇”上限改为9
- 调整乐周瑜技能
- 调整谋邓艾体力值
- 修改SP曹操，界马忠，谋张辽
- 调整星董卓、谋卢植、王经、势太史慈、OL薛灵芸的技能
- 调整九鼎诸葛亮【观星】
- 调整跟进OL牛辅【筮算】
- 诸葛京【研作】改为可印属性【杀】
- 优化汉末神朱儁结算
- 修复武陆逊【雄幕】描述
- 为手杀神司马懿【忍戒】添加势力选择（须势力为神且未进行过神/西武将势力选择）
- 修改谋张角【雷击】、尹夫人【拥嬖】为外服版本
- 修改谋袁术【矜名】【枭噬】、宣公主【齐眉】、幻曹昂【炽灰】【离渊】、势太史慈【战烈】为新版本

### 其他

- 移除"出错时停止游戏"选项和判断以修复游戏流程出错却不弹窗的bug
- 更换部分同图素材+更改比例
- get.skillTranslation、lib.element.player.addTip等bugfix
- 修复【声东击西】无指向目标的结算
- 王者之战武将切换补充
- 移除部分废弃素材
- 势力补充
- div.goto修改
- 彻里吉宝物花色补充
- 补充专属卡牌cardcolor
- 【长安大舰】改交替颜色
- 移除西势力
- 一将谋郭嘉添加新杀前缀
- get.is.banWords加上可选链判断
- 修改loadcard,防止某模式出现不属于此模式的卡牌
- OL谋孙坚加入国战
- 四象标记
- 四象标记添加prompt
- 精简神华佗【静域】的代码
- OL南华老仙、蔡贞姬姓氏适配
- 修改(文字+"X张牌/手牌")形式的阿拉伯数字型X为汉字（比如"摸2张牌"→"摸两张牌"）
- 删除重复的ol_liaohua翻译
- 为武将包子包增加了长按（电脑右键）显示描述的功能，原来这里只会显示“设置xxx”
- 鹰原羽未拼音
- 【激鼓】、【斡衡】、【惶汗】、【宗护】中流适配
- drlt_zhenggu_mark添加状态技标签
- 神黄忠击中部位播报修复
- 刘璋台词文本修复
