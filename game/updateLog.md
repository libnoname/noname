# v1.10.17.2版本更新内容

- 新武将
线下：长安神曹操、神王允、神李傕郭汜、长安神贾诩、车胄、陈寿
OL：蔡贞姬、族杨彪、族荀爽、杨阜、李丰、界马岱、谋卢植、族杨众、管亥、张曼成、魔司马懿、张角三兄弟
新杀：夏侯玄、星张让、谋刘协、钟毓、夏侯徽、烈袁绍袁术、威曹丕、神钟会、吴质、朱铄
手杀：国渊、黄祖、田丰、陆郁生、关银屏、孟达、曹性、张燕
- 跟进旧武将的技能效果
- 添加“自动导入扩展”选项，开启后将在启动时自动检索扩展文件夹，并导入未导入的扩展
  - 由于可能存在某一平台下文件管理的效率低下，导致启动页加载效率过低，故不自动开启，有需求请自行开启
  - 当以此法导入新扩展时，为防止一些特殊情况，此扩展将默认被关闭

- 将扩展《富甲天下》所有的构造函数变成类，重写help对象
- 增添联机聊天表情包
- 添加角色引言（lib.characterAppend用法与lib.characterTitle相同）
- 规范大部分觉醒技、限定技的unique标签
- 修复文钦偕举没有目标仍选择出杀目标的bug
- 修复马伶俐send缺漏导致的bug（直接重写了选择部分）
- 修复衰曹节王甫和OL谋卢植持续加伤效果未能多次叠加
- 修复OL界关张继承标父魂后没有修改viewAsFilter
- 修复SCL祢衡效果的错误，之前即使不摸牌用到五张牌后就不能出牌了
- 修复手杀薛综诫训prompt补充，以及ai补充
- 修复OL费祎和衷ai错误
- 修复星法正语音引用错误
- 修复谋黄忠亮出牌不进处理区的bug
- 修复线下汉末风云严政印杀会触发八卦阵的bug
- 修复威吕布霸关出杀受限制问题
- 修复赵昂在自己没有手牌时不能正常观看其他角色手牌的bug
- 修复神华佗寰道ai报错bug
- 增加族杨修高视，族杨赐谏直、张翼鏖刃、乐貂蝉低讴、新杀张虎同援的combo
- 修复OL界蔡夫人窃听filterButton和ai未定义player导致的bug
- 修复用间李儒毒谋其他角色失去手牌里的视为毒不会失去体力的bug
- 修复幻黄盖焚险决斗能指定黄盖的bug
- 修复食岑昏ai错误、年兽岁崇prompt错误的bug
- 修复张曼成掠城目标使用第一张杀后没有再次筛选能使用的牌导致的bug
- 修复荆扬曹仁御军技能描述错误的bug
- 修复桃园沙摩柯二技能效果错误的bug
- 汉末神朱儁撤击修改
- 修复神皇甫嵩有个choice拼错的bug
- 族荀爽耽道和界朱然胆守增加对当前回合角色的判断
- 修复线下张曼背水加伤结算bug
- 修复神张角天劫chooseTarget与描述不符的bug
- 修复阳球扫奸send缺少参数的bug
- 修复修复若干技能错误使用或者没使用isCard的问题的bug
- 新杀SP马超追击子技能增加onremove
- 修复海外郝萌攻阁交给牌数量缺失的bug
- 修复ol界双雄捡牌没有判断区域的bug
- 庞凤衣异瞳摸牌条件调整
- 补充谋黄盖、谋周瑜技能的tip
- 海外谋曹仁护甲调整
- 手杀星董卓雄进效果调整为在董卓死后会移除
- 调整乐系列武将标记初始手牌的技能的描述和效果
- 手杀谋黄盖诈降跟进描述和效果
- 乐邹氏筝标记调整为永久标记
- 重写战役篇王允的连计
- 新杀谋荀彧技能同步
- 增加曹婴凌人三种类型的牌面
- 新增OL开黑季限时锦囊（ai差点意思）
- 为木马的牌被弃置添加广播
- 修复食岑昏【暴食】ai判断相反的bug
- 修复起何进【诛宦】结算与描述不符的bug
- 修复威张辽【破戎】插结情况下tip显示错误问题
- 修复charater类一个duaslside拼写错误问题
- 修复界关羽【义绝】加伤buff永久累加的bug
- 修复界刘备【仁德】未按阶段计数导致同一回合多个出牌阶段只能使用一次基本牌的bug
- 修复幻丁尚涴【春晖】摸牌结算错误问题
- 修复孙霸【结党】联机客机看不见对话框的bug
- 修复TW法正【恩怨】摸牌条件错误问题
- 修复谋吕蒙【夺荆】没有护甲仍能无视防具的bug
- 修复杨彪【义争】和马忠【抚蛮】技能buff未加夏洛特标签的bug
- 修复星文丑【连战】联机选择增加目标卡死的bug
- 修正年兽【岁崇】及TW张昭【力谏】部分错别字的情况
- 修正谋典韦【亢勇】描述
- 宝宝化手杀星董卓【镇边】结算、界法正【恩怨】、星法正【谙计】
- 修复本体编辑器引用技能报错的bug
- 修复player.hasUsableCard部分情况报错的bug
- 修复神贾诩【炼魄】判断最大阵营数错误的bug
- 修复柳婒【迟行】某些情况下报错的bug
- 优化王元姬【谦冲】、【尚俭】
- 优化势董昭、TW董昭【妙略】
- 修复SP蔡文姬【默识】不使用第一张牌也能使用第二张的bug
- 注释掉缺失素材的水墨指示线
- 补充义绝、强化、纵掠等技能的skillTagFilter
- 修复蛇韩悝【宵赂】最后为韩悝向选择的角色使用牌的bug
- 修复族杨赐【切议】判定打断报错的bug
- 修复蛇赵忠【鸱咽】ai报错问题
- 修复高升【地锋】使用错误函数的bug
- 修复十周年界马忠【抚蛮】filter只限制有手牌才能发动的bug
- 南华老仙天书的一个效果更正
- 修复庞统【连环】缺失ai白板的bug
- 给与当前回合角色相关的技能补全对当前回合角色存在的判断
- OL谋赵云【逆澜】【绝崖】、乐诸葛果【乘烟】、阮瑀【妙弦】调整
- 将除国战外的与player.awakenskil相关的l具体技能名改为event.name/skill方便扩展/其他技能继承
- 修改【木牛】支持装备多个木牛流马下可以任选其中一个扣置牌
- 修复手杀裴秀【行图】一个逻辑问题导致的显示bug
- 修复手杀谋贾诩【乱武】其他角色可以杀贾诩的bug
- 修复界夏侯氏【樵拾】满足条件也不能继续发动的bug
- 修复手杀皇甫嵩中止甄姬【洛神】、夏侯惇【刚烈】判定导致报错的bug
- 调整贾诩/界贾诩【乱武】结算
- 修复十周年界全琮【邀名】联机player未定义报错的bug
- 修复起刘宏与闪刘宏【甚宠】多了true的参数导致清除jiu2等夏洛特技的bug
- 修复TW霍峻与手杀【霍峻】【伺怠】、司马徽【荐杰】、势太史慈【振锋】因批量替换awakenSkill导致的报错的bug
- 修复张角【雷击】因插入结算导致判断无后续而报错的bug
- 修复忙牙长【截刀】技能fiter错误导致可以多次触发的bug
- 修复手杀谋贾诩【完杀】为正面向上分配的bug
- 修复卢氏在有角色体力/手牌均进行调整后触发【驻颜】报错的bug
- 修复手杀谋郭嘉【遗计】、手杀谋贾诩【完杀】、淳于琼【粮营】、十周年李丰【输粮】、手杀SP甄宓【济危】、徐琨【筏铸】、吕常【守襄】、OL界王异【秘计】、OL董昭【先略】、【宿守】、谋张绣【豪义】中loseAsync事件的cards未展开的bug
- 调整reluoyi，gameEvent.cancel方法中为事件添加_cancelled属性
- 修复友徐庶【启诲】多刀buff未生效的bug
- 修复OL袁涣【德辱】摸牌效果为摸至体力上限的bug
- 修复OL袁涣【德辱】必须选择至少一个牌名的bug
- OL董昭与其两个技能开放其他模式的使用权
- OL袁涣【德辱】添加技能AI，优化操作界面
- OL韩遂【骁袭】发动时机调整
- OL谋董卓【封赏】记录花色时机调整，防止嵌套结算，添加已选择过的花色tip标记
- 关索【当先】改为OL界廖化版本，修复关索【征南】可重复选择已拥有但失效的技能的bug
- OL南华老仙【青书】添加概率获得1条高级词条
- 修复国战野心家司马昭翻译问题
- 修复OL谋文丑【决绝】不仅为使用手牌也能触发技能的bug（人话：实体牌不能掺杂自己手牌外的牌）
- 修复twxiayong颜良播放配音错误的bug
- 优化外服王昶【开济】写法（从存储进入过濒死的角色改为采用历史获取进入过濒死的角色）
- 修改鲍信/TW鲍信【募讨】中获取下家的方法从.next改为getNext()
- 修复慑伏在无实体牌不触发技能防止伤害的bug
- 提升万箭齐发的音质
- 增加为武将包添加文字描述的方法，添加武将包id+'_info'格式即可实现
- 其他bug修复、AI优化、台词调整、素材补充、姓名适配和补充函数注释

## 新增函数/函数修改/函数修复
1.新增player方法ChooseButtonTarget，简化一些交互，后续增加了可隐藏弹窗的按钮（由canHidden参数控制是否开启，默认为true，主要用于应对弹窗过大导致手机端没法选择目标的问题），该按钮的实现会覆盖event的custom.add.button，如果后续有人覆盖了该事件的custom请适配一下。目前给出的例子如下：陆郁生（一般的选选项和目标且dialog为自己搓的）、国渊（有选项不需要目标的且用createDialog创建dialog）、李丰（用于分牌）、管亥（用于主动技，但不太推荐）

```js
//使用例
async (event, trigger, player) => {
    const { result } = await player.chooseButtonTarget({
        createDialog: ...,//同chooseButton的dialog写法
        filterButton(button) {...},//同chooseButton的filterButton写法
        filterTarget(card, player, target){ ...},//同chooseTarget的filterTarget写法
        ai1(button) { ...},//同chooseButton的ai写法
        ai2(target) { ...},//同chooseTarget的ai写法
    });
    console.log(result)//返回bool/links/targets
};
```
2.新增player.canRespond(event,card)，新增lib.respondMap用于保存一些卡牌的可被响应牌，新增get.canRespond以获取lib.respondMap，用于判断玩家或玩家的某张牌能否响应该useCard事件，目前仅适配本体常用的卡牌（但有接口可以添加），具体用法见player.js

3.修复“复活”后异常显示的身份标记；对一系列addSkill函数增加广播；修复主机进行chooseToMove不受联机时间限制；修复联机的一个注入漏洞

4.给useSkill的contentBefore和contentAfter增加skill属性，提高部分代码的复用性；修复 #2436——一个可能的逻辑错误

5.gameDraw、replaceHandCards、replaceHandCardsOL事件新增gaintag接口，可以为初始手牌上标记，具体用法见该事件代码

6.为无名杀支持卡牌的永久标记，修改了lose事件、gain事件以及addGaintag的相关部分，永久标记通过前缀eternal_来区分，详情见card.addGaintag

7.gameDraw、两个replaceHandcards事件重新添加更换手牌时移除所有标记，包括永久标记

8.为when生成的skill添加sourceSkill属性以适配一些需要读取源技能的技能

9.修改useCard，respond以适配直接使用装备区或判定区的转化后的牌

10.draw新增接口，otherGetCards用于从其他牌堆获得牌，传入的是从其他牌堆获得牌的函数，例子见陈寿；同时修改原来的log，正面向上摸牌时不会再log两次

11.gamedraw、replacehandcards、replacehandcardsOL新增接口otherPile用于适配起始手牌和手气卡从别的牌堆获得牌，具体见对应函数，例子见陈寿

12.对虚拟装备/虚拟判定牌机制进行完善

获取转化后实体牌的位置:
- get.owner
- get.position
- get.vcardinfo

重构事件效果:

- `Player`
- lib.element.player.equip
- lib.element.player.addVirtualJudge
- lib.element.player.#addVirtualJudge
- lib.element.player.addVirtualEquip
- lib.element.player.#addVirtualEquip
- `Content`
- lib.element.content.lose
- lib.element.content.equip
- lib.element.content.replaceEquip
- lib.element.content.swapEquip
- lib.element.content.swapHandcardsx
- lib.element.content.addJudge
- lib.element.content.phaseJudge
- lib.element.content.moveCard

其他修改:

- 为新的虚拟装备/虚拟延时锦囊兼容了“重连”

注意事项:

- 新的equip目前不再支持同时装备多个装备(也就是回退回了老“equip”的使用方法)，有可能需要扩展兼容

13.调整player.chooseDrawRecover，支持令玩家对其他角色选择回复体力和摸牌的操作，不填target参数默认自己对自己进行选择

14.gain/lose从step-content改contents

```js
//其实就是让函数少走一次解构的同时也方便修改
//牢函数
lib.element.content.gain/lose=()=>{
'step 0'
...
'step 114513'
};
//新函数
lib.element.content.gain/lose=[
第1步的函数
...
第114514步的函数
];
```

15.添加boss挑战黑名单接口，用例见下

```
//挑战祭风卧龙时禁用晋司马师
_status.banlist["boss_zhugeliang"] = ["jin_simashi"];
```

```
//也可以写成函数形式
//下为挑战boss刘备时禁选所有关羽
_status.banlist["boss_liubei"] = function (button) {
	let { link } = button;
	if (link.includes("guanyu")) {
		return false;
	}
	return true;
}
```

16.继续优化get.cardsetion

17.为player.draw添加默认摸牌来源

18.修复player.choosecard部分情况导致的bug

19.添加响应列表，具体函数见下

```js
/**
 * the cards which can respond card
 *
 * 卡牌的可被响应牌（主要是用于player.canRespond函数）
 * 例如可响应杀的主要就是闪，或者本体的草船借箭，以此类推；
 * 类似劝酒这种复杂条件的，可以放函数，但仅检测实体牌
 */
lib.respondMap = {
	sha: ["shan"],
	wanjian: ["shan"],
	qizhengxiangsheng: ["sha", "shan"],
	juedou: ["sha"],
	nanman: ["sha"],
	jiedao: ["jiedao"],
	//所有锦囊都可以用无懈可击响应
	trick: ["wuxie"],
	//所有伤害牌都可以用草船借箭响应
	damage: ["caochuan"],
	//所有基本牌或普通锦囊牌都可以响应
	all: [],
	//也可以放函数
	khquanjiu: ["jiu", (card, player) => get.number(card, player) == 9],
};
/**
 * 返回如何响应此牌的一个数组，其中包含字符串或者函数，具体用法可见player.canRespond
 * @param {string | Card | VCard | object } card（也支持一些标签，如trick，damage和all）
 * @param {false | Player} [player]
 * @returns {string[]}
 */
get.canRespond = function (card, player) {
	let name;
	if (typeof card == "object") name = get.name(card, player);
	else name = card;
	if (typeof name != "string") return [];
	const filter = lib.respondMap[name];
	if (Array.isArray(filter)) return filter;
	if (typeof filter == "function") return [filter];
	return [];
};
/**
 * 玩家（或某张牌）能否响应某个useCard事件的牌，目前仅支持本体部分常用的卡牌，需要添加新卡牌的可以到lib.respondMap按格式添加
 * 请注意，该函数只能粗略判断，有些情况是没法判断的
 * @param {GameEvent} event 需要判断能否响应的事件，目前只能为useCard或者它的下一级衍生事件，其他全部返回undefined
 * @param { Card | VCard | object | string } card 需要检测的牌
 * @param { string | boolean } [type] 响应什么类型，默认使用。"use": 使用 / "respond": 打出 / "all": 全部，true
 * @returns { boolean | undefined }
 */
lib.element.player.canRespond = function (event, card, type) {
	const player = this;
	if (!event.name?.startsWith("useCard")) return;
	const evt = event.name == "useCard" ? event : event.getParent();
	if (!evt || !evt.card) return;
	if (card && typeof card == "string") {
		card = { name: card };
	}
	if (typeof type !== "string") type = type ? "all" : "use";
	const keys = get.canRespond(evt.card);
	if (get.type(evt?.card) == "trick") keys.addArray(get.canRespond("trcik"));
	if (get.tag(evt?.card, "damage")) keys.addArray(get.canRespond("damage"));
	keys.addArray(get.canRespond("all"));
	if (card) return keys.some(key => (typeof key == "function" ? key(card, player) : key == get.name(card, player)));
	const evtx = get.event();
	let evtNames = typeof type !== "string" || type === "all" ? ["chooseToUse", "chooseToRespond"] : ["chooseTo" + type.slice(0, 1).toUpperCase() + type.slice(1)];
	const cards = player.getCards("hs", card => {
		if (type === "all") return true;
		return evtNames.some(evtName => {
			let evty = evtx.getParent(evtName);
			if (get.itemtype(evt) !== "event") evty = evtx;
			if (type === "respond") return lib.filter.cardRespondable(card, player, evty);
			return lib.filter.cardEnabled(card, player, evty);
		});
	});
	return keys.some(key => (typeof key == "function" ? cards.some(card => key(card, player)) : player.hasUsableCard(name, type))) && !evt.directHit.includes(player);
};
```

20.添加`lib.concurrent`异步库，用于一些特定情况的异步场景，目前的定义如下:

```typescript
export class Concurrent extends Uninstantable {
	/**
	 * 执行一个异步的for range循环
	 *
	 * 由于异步的特性，你无法中途中止循环，但你可以提供一个AbortSignal，来使回调函数能通过该信号中止
	 *
	 * > 步长为1主要是C#的Parallel.ForAsync的步长只能为1，~~绝对不是我懒~~
	 *
	 * @param start - 开始索引（包含）
	 * @param end - 结束索引（不包含）
	 * @param callback - 回调函数，接收当前索引和提供的信号；如果回调函数不包含异步操作，则将退化为同步操作
	 * @param options - 可选参数，具体可参阅`ConcurrentOptions`
	 * @returns 返回一个Promise，包含执行过程中所有的异常
	 * @throws {TypeError} 如果提供的回调函数不是一个函数
	 * @example
	 * // 使用AbortController来控制循环的终止
	 * const controller = new AbortController();
	 * await Concurrent.for(1, 100, async (i, signal) => {
	 * 	if (signal.aborted) return;
	 * 	await someAsyncOperation(i);
	 * }, { signal: controller.signal });
	 */
	static async for<T extends number>(start: T, end: T, callback: ForCallback<T>, options?: ConcurrentOptions): Promise<ForException<T>[]>;

	/**
	 * 执行一个异步的for of循环
	 *
	 * 由于异步的特性，你无法中途中止循环
	 *
	 * > 为了性能考虑，假定传入的可迭代对象均为有限迭代器，请勿传递无限迭代器
	 *
	 * @param iterable - 可迭代对象（请勿传递无限迭代器）
	 * @param callback - 回调函数，接收当前元素；如果回调函数不包含异步操作，则将退化为同步操作
	 * @param options - 可选参数，具体可参阅`ConcurrentOptions`
	 * @returns 返回一个Promise，包含执行过程中所有的异常
	 * @throws {TypeError} 如果提供的`iterable`不是一个对象，或回调函数不是一个函数
	 * @example
	 * // 对数组中的每项进行异步处理
	 * const controller = new AbortController();
	 * const items = [1, 2, 3, 4, 5];
	 * await Concurrent.forEach(items, async (item) => {
	 *   await processItem(item);
	 * }, { signal: controller.signal });
	 */
	static async forEach<T>(iterable: Iterable<T> | AsyncIterable<T>, callback: ForEachCallback<T>, options?: ConcurrentOptions): Promise<ForEachException<T>[]>;
}
```
