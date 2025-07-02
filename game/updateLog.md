# v1.10.17.3 版本更新内容

※添加新武将
- 武将包：青史翰墨四个亡国之君、四象封印·青龙七将、珍藏封印八个将、风云际会、“山河煮酒·关索传”11个新武将，“长安风云”6个新武将，“蚀心入魔”8位新武将，“君霸天下”10位新武将，“渭南风云”7位新武将
- 新杀：向宠、吉邈吉穆、崔令仪、新杀谋胡烈、谋姜维、诸葛均、怀刃伍孚、忠锷伍孚、任婉、张琪瑛一号、张琪瑛二号、忍邓艾、忍姜维、
- OL：OL谋小乔、族陆绩、族陆景、冲儿
- 手杀：势鲁肃、手杀孙峻、势魏延、笮融
- 线下：魔曹操、曲阿小将、
- 国战：“紫气东来”、“金印紫绶”扩展包22个晋将，晋势力君主【君司马懿】

※**国战拆分**
※联机支持域名地址
※新卡牌：新杀开黑妙妙杀卡牌【以毒攻毒】【大军压境】【浑天仪】
※斗地主休闲和开黑模式支持自定义地主农民候选武将数
※临时关闭首次载入时的在线更新素材提示
※临时修复技能未初始化引起的录像bug
※修复兵乐无useful导致AI错乱留牌的bug
※修复廖化【伏枥】回复值问题
※修复新杀蒋琬费祎【生息】时机
※修复星张让【蠹害】可以对死亡角色发动的问题
※修复TW周处【除害】从其他角色处获得牌报错的bug
※调整界面缩放功能为百分比显示
※ 修改部分默认配置
※重写乐就/TW乐就【催进】AI
※优化汉末神皇甫嵩【势策】提示
※【决斗】杀不足AI不再打出
※简化mayHaveShan调用（Player.mayHaveShan(viewer, type, ignore, rvt): 若type为"use"且ignore不为false，则自动设ignore为this.getCards("h", i => i.hasGaintag("sha_notshan"))）
※生死与共、落井下石增加$skill动画
※桃园陆逊的火烧连营语音调整、以及展示牌窗口调整
※技能调整至最新版：乐蔡邕、新杀夏侯玄、新杀徐馨、OL张曼成、吴珂助国、新杀钟毓、诸葛均、乐诸葛果、诸葛若雪、手杀谋贾诩、手杀清河公主等
※海外调整：葛玄、童渊、夏侯紫萼、夏侯子萼、幻张郃、幻姜维、界朱治、谋陈宫、阎圃。同时手杀的对应武将技能async化
※调整文鸯【膂力】为动态 usable
※修复 SCL 曹婴【凌人】猜对效果不符
※界廖化【伏枥】回复体力失效
※幻曹冲【修睦】联机报错
※轮次结束时机前加个空白记录隔断；
※修复势于吉【符济】ai 报错
※族钟会【迂志】event.num1 未修改为 num1
※魔司马【骤袭】未判断失效技能
※【浮雷】判定生效不会受伤的 bug
※调整张绣【雄乱】、鲁班【鬼斧】【神工】
※修复了一个使用[无懈可击]但是客机“取消”按钮异常滞留的 bug
※修复了“\_wuxie”部分情况下导致的异常报错与技能效果无效（旧版本的\_wuxie 没有判断\_status.event 是否为“\_wixie”就直接执行了 game.resume();导致部分情况下“arrangeTrigger”被报错取消从而导致技能失效）
※优化手杀曹髦【清正】，将选择牌的部分提出方便其他技能使用
※修复库特莉亚芙卡【巧手】未适配最新装备的更改
※修复合赵云【镇胆】num 未定义导致报错的 bug
※将陈寿【点墨】的创造卡牌部分添加到 ui.create.buttonPresets.skill 方法中（类似使用chooseBtton选择的技能可以参考【蹈节】【点墨】等技能使用[skills, "skill"]的格式）
※对各模式（身份、对决、挑战、战旗）的 phaseloop 进行调整以正确触发每轮结束时的时机
※修复吴庞统【送丧】参数名不同导致报错的 bug
※修复谋程昱【识诈】与护甲相关的体力值变化互动错误
※庞宏【评骘】不能使用【火攻】不能重置
※修复伍孚势力错误的 bug
※黄权【途绝】添加备注（无名杀现版本黄权体力值和【途绝】均为海外服版本）
※修复兴诸葛诞【摧冰】角色死亡报错的 bug
※修复张怀【诀言】因插入结算导致失去【决言】而报错
※将大部分技能的 cost 中与 get.prompt/prompt2(具体技能名)相关部分改为 event.skill 方便其他技能继承
※修复判定牌不为后来先判的 bug
※修复SP 马超一号【追击】不为伤害值的 bug
※修复国战【珠联璧合】当【桃】效果失效的bug
※将【舍身】、【洞察】常驻至 lib.skill、身份局添加【明察】选项
※修正 TW 赵襄【扶汉】、蛇栗嵩【窥机】技能描述
※为原来的 charater 写法支持 clans 拼接
※修复 lib.filter.characterDisabled2 未判断诸神降临的开启导致单挑模式挑战武将不可用的 bug
※修复\_wuxie 某些情况下可能卡死的 bug
※修复了一系列装备/判定牌显示问题
※修爵裴秀【制图】记录加个排序优化显示
※修复 player.needsToDiscard 对 add 为 cards 进行数组嵌套数组的操作，导致进行 ignoredHandcard 的 mod 检查时数组没有 hasGaintag 方法报错的 bug
※修复OL 李异【缠双】因缠双角色死亡导致报错的 bug
※对部分未与木牛流马一样可刷新使用次数的装备进行刷新装备使用技能的适配，主要涉及装备：金箍棒、红缎枪、烈淬刀、水波剑、信鸽、桃园飞龙夺凤、春秋笔、木头面具、玉衡、炼妖壶、伏羲琴、神农鼎、昆仑镜、神偷面具、蓝格怪衣、四非真面鼠槌、诏书、定澜夜明珠
※修复旧伏寿【求援】报错的 bug
※修复夏侯楙【蹙国】未限制首次抵消的 bug
※修复 OL 关张【父魂】isPhaseUsing 少打括号的bug
※本体编辑器兼容 extension.character 的对象写法
※神鲁肃【榻谟】调整方便其他武将引用、【智盟】跟进外服最新版本
※将赵直【统观】吴普【识草】共用的 localMark 函数内置为 player#localMarkSkill
※蔡邕【飞白】效果调整为牌堆/弃牌堆均没有牌才摸牌
※调整辛宪英、新辛宪英、将辛宪英等武将【忠鉴】、【才识】
※调整邴原【清滔】【秉德】
※修正谋刘赪【掠影】【莺舞】技能描述和效果
※修复diy 羊祜【避召】一个拼写错误
※修复吴质【圆融】联机 player 未定义的 bug
※合并技能的 changeSeat 和 seatRelated 标签
※斗地主休闲模式添加加强地主和〖飞扬〗版本选项
※修复 TW 王昶【摄叛】不能成功重置次数的 bug
※调整神鲁肃【榻谟】至外服版本
※tw赵襄【扶汉】async化、async化部分refresh.js的技能
※所有跟每轮结束有关的武将技能调整，具体如下：
- OL：族钟会clanyuzhi、夏侯玄olzeyue、袁姬olshuiyue、魔司马懿olzhouxi|olrumo、谋董卓olguanbian
- 十周年：神许褚zhengqing、周善dcmiyun、黄承彦dczecai、星袁绍dcjiaowang、星荀彧staranshu
- 其他：三公将军oldigong、龙廖化dragxigui、桃园系列tyxihun、荆扬诸葛亮jyqibian

※修改牢贾逵【挽澜】的写法，其造成伤害后能溯源
※神张宝技能效果加强能使用其他人的咒兵
※OL赵忠【抵慈】造成的伤害修正为雷电伤害
※威吕布威张辽统一：只要有一张是标记牌即可无次数限制使用
※修复OL界廖化【当先】即使不摸杀也会受到伤害的bug
※新杀谋刘协结算调整
※OL赵忠【抵慈】改为unmarkAuto
※吴普【识草】选类型的按钮样式改为vcard
※谋荀彧【弼佐】回合封技能改为phaseBegin时机触发
※九鼎谋关羽不计入次数和无次数限制合并
※修复OL【劝酒】不能使用转化牌技能的问题
※修复族杨彪其他角色失去牌不能触发【间难】以及重铸装备牌没包括手牌的bug
※修复神钟会觉醒不加体力上限的bug
※修复手杀势于吉【符济】不能展示装备区的牌的bug
※OL管亥【诱阙】结算小修改
※修复朱烁体力上限的错误
※陈寿春秋笔改为随机一项并休整描述
※修复手杀羊徽瑜awakenSkill错误，同时把两个技能async化
※tw李翠莲赵全定势力改为蜀
※修复张曼成【掠城】对非掠城角色也可以无限出杀的bug
※珪固技能错误、技能描述修正、子技能添加charlotte标签
※修复汉末神张宝【咒怨】发动后有可能看不到咒兵牌的bug
※修复魔司马【骤袭】检索记录错误
※谋卢植【司兵】因为player未定义的报错
※威曹丕被朱佩兰发动限定技之后标记报错
※修复十常侍被长安神贾诩复活导致不能正常进行休整不能死亡的bug
※修复谋关【威临】判断印牌时没有unsure的问题
※势于吉【符济】描述错误
※修复线下车胄【暗谋】指定角色后会显示标记的bug
※转化牌部分含有符济牌时没有判断gaintag_map对应的键值对是否存在
※修复四个【酒诗】脱离濒死翻回来后下次进濒死不能正常喝酒的bug
※修复钟毓【捷思】拿到同一张牌不算同名牌的bug
※修复长安李傕和魔曹操联机对话框无法正常关闭并执行下一步操作的bug
※修复废除装备区不会弃置牌的bug
※修复联机填地址为空时报错的问题 
※修复draw的摸牌数0时控制台警告的错误
※回滚player#addSkill的info.mark处理部分、更改player#addAdditionalSkill、player#addTempSkill执行的addSkill中的nobroadcast为null，以此支持mark显示
※revive写成事件，需要使用时请使用player#reviveEvent
※chooseToCompare写成contents
※调整多个前缀的nature属性
※点墨生成的技能牌增加衍生技的显示
※允许game.expandSkills展开subSkill，来让【点墨】【骤袭】可以筛选到更多的技能
※为国战添加”文德武备“选项，控制国战司马懿、张春华等晋势力武将使用的版本
※为执行的额外回合来源增加提示
※修复lib.filter.cardUsable中判断event出错的bug
※调整线下武将【龙关羽】【吕常】为修订版本
※新杀谋曹洪【迎驾】SP贾诩【拥嫡】加强
※调整国战界徐盛的技能为【破军】
※起韩遂【互雠】添加tip标记
※修复【立世】【戒酒】【募讨】【蜕骨】【争擎】【机论】【标倾城】【倾袭】【令法】【狂骨·二级】【平辽】【西向】【逐北】【侻失】的描述问题
※调整【间计】【砺锋】【围铸】【虚羯】【雷公助我】【锻体】【异合】结算
※调整【锋势】【凶逆】【溃降】【谋清俭】【登锋】【谋连营】【大雾】【狂风】【礼让】【离叛】【旧蛊惑】【落宠】的写法
※调整【革制】【残玺】【狂信】【合伐】【国战探锋】的ai
※修复谋董卓换肤后的焚城语音
※【诈亡】【邀弈】【经纶】等技能补充衍生技
※调整【蹈节】【帝力】【破怠】【夺锐】【写轮眼】使用的技能牌样式
※调整【双雄】【连环】【惑众】的写法以符合点墨的筛选条件
※【昭凶】补充combo
※SP曹操【逐北】添加使用牌数提示
※乐綝【破锐】添加次数提示
※补充国战君曹操的缺失语音
※调整【聚谷】为各摸一张
※修复闪刘宏【朝争】的语音问题
※调整【累卵】为自选锦囊牌
※修复“同心”机制的标记显示问题
※修正【绝围】中错误的参数
※【寤寐】回合复制phaseList
※【诏图】【任贤】【弼佐】回合特效绑定对应额外回合
※为执行的额外回合来源增加提示
※修复【制霸】语音
※调整【乘烟】的牌名检测，避免mod的影响
※调整【武圣归来】为对活人无效
※调整杨奉【威命】为使命失败时重置【血途】使用次数
※为【再起】【兴衰】等多个技能的恢复体力添加来源
※对”对指定目标使用一张牌“的技能补上complexTarget，以适配如方天画戟的额外指定目标技能
※调整所有[背水！]技能的结算为先执行技能效果后支付背水代价
※国战吕玲绮【无双】语音调整
※国战【凶虐】效果调整
※国战【酣战】提示修复
※国战【拒战】【卫戍】描述和标记调整
※调整【雄踞】为修改起始手牌数
※修复【出策】未正常限制可用牌的bug
※修复【寤寐】在挑战模式下无限回合的bug
※修复濒死时无法使用【献酿】酒的bug
※修复【袭爵】的【骁果】可以被【骤袭】检索的bug
※修复【镇胆】轮次结束时不能摸牌的bug
※修复【妙语】没有给牌动画的bug
※修复谋【武圣】未适配unsure的bug
※修复【善断】联机报错的bug
※修复【落宠】ai报错的bug
※修复长安神贾诩的僵尸会导致getFriends/getEnemies出问题的bug
※修复标马良【协穆】不为正面给牌的bug
※修复势于吉【道转】飞刀的bug
※修复用间李儒【威权】发动报错的bug
※修复【绝围】ai报错的bug
※修复【拾忆】没牌发动时报错的bug
※修复【积干】部分情况未初始化报错的bug
※修复挑战模式黑名单未正常生效的bug
※修复吴质【圆融】选牌报错的bug
※修复谋甘宁【奋威】ai报错的bug
※修复【纵横】【密图】和延时拼点的bug
※修复锦盒弃牌的bug
※修复【军神】【狈行】【道转】的bug
※修复濒死时使用不计入次数限制的酒，会导致无法再喝酒的bug
※修复国战暴露野心报错的bug
※修复君曹操衍生技id错误的bug
※修复国战【拒战】和【迅析】的互动bug
※修复国战【总御】交换坐骑牌不触发【屯田】的bug
※修复国战【急袭】不能发动的bug
※修复国战【苦肉】缺少技能翻译的bug
※修复谋【天香】不能使用装备区牌的bug
※修复【灭害】期间使用黑桃牌当闪不触发后续效果的bug
※修复【余料】未筛选可选牌的bug
※修复【武继】不会失去【虎啸】的bug
※修复【奇击】杀自己的bug
※修复【衡虑】回收已使用桃的bug
※修复【袭营】【御嶂】不禁止虚拟牌使用的bug
※修复【青冥剑】无法正确触发的bug
※修复【乘流】目标死亡不终止流程的bug
※修复【承袭】拼点没赢无法额外指定目标的bug
※修复多个【设伏】重复发动的bug
※修复【仓储】不会被【失守】失效的bug
※修复评鉴发动【思泣】指定所有目标的bug
※修复【精械】选择装备区牌不改变效果的bug
※修复【据险】可以赠送牌的bug
※修复【有福同享】仅能生效一个目标的bug
※修复【慑叛】重置发动次数为生效的bug
※修复【媦婉】不能对仅判定区有牌的角色使用的bug
※修复3d夏侯玄【玄论】控底未生效的bug
※修复【变装】未判断可用性的bug
※修复【狂骨】技能log在回血/摸牌之后的bug
※修复【系力】无脑发动的bug
※修复【齐眉】不触发展示牌时机的bug
※将国战的围攻、被围攻、处于队列等函数常驻；
※修复传械马钧巧思卡死的bug
※修复谋张飞无法退出酒状态的bug
※诸葛若雪暖惠async化
※async化手杀胡车儿的盗戟（顺便修复伤害有来源牌的bug
※族陆景的探锋适配许劭的评鉴，避免发动技能后没法触发无视防具的效果，吴文鸟的冲坚同理
※两个挽澜的ai优化
※.星魏延摸牌效果和限制次数的效果放在同一个used子技能，如果中流插入结束不能摸牌
※修复严政地道强制发动的bug
※修复宗护没有ignoreMod标签导致的无法使用虚拟闪的bug同时优化技能交互
※修改OL老仙天书技能的filter
※调整雍闿势力为蜀
※为神将补齐国战势力
※添加势力”魔（devil）“
※调整汉末神卢植的id为hm_shen_yl_luzhi
※调整国战孙尚香的技能id
※将各个武将包中的perfectPairs.js合并
※幻曹昂的煌烛修正
※沙盒允许用户来决定是否对当前服务器启用
※**若干素材补充**


# 新增函数/函数修改/函数修复
### player.reviveEvent方法，以及将复活事件化
```javascript
        /**
	 * 令玩家复活--事件化
	 * @param { number } [hp = 1]
	 * @param { boolean } [log]
	 */
	reviveEvent(hp, log) {
		const next = game.createEvent("revive");
		next.player = this;
		if (hp) {
			next.hp = hp;
		} else {
			next.hp = 1;
		}
		next.log = log;
		next.forceDie = true;
		next.setContent("revive");
		return next;
	}
       //用例：卡牌武圣归来
      async content(event, trigger, player) {
		const { target } = event;
		if (!target.isDead()) {
			return;
		}
		await target.reviveEvent();
		await target.draw(3);
	},
```
### 修改player#useCard和player#respond以获取哪个技能的mod修改了对应实体牌的牌名属性花色点数
```javascript
         /**
	 * 令玩家使用牌
	 * @returns { GameEventPromise }
	 */
	useCard() {
		...
		const event = get.event(),
			card = next.cards[0];
		next.modSkill = {
			cardname: null,
			cardnature: null,
			cardsuit: null,
			cardnumber: null,
		};
		const keys = Object.keys(next.modSkill).flat();
		if (event.name == "chooseToUse" && !next.skill && get.itemtype(card) == "card") {
			let skills = [];
			if (typeof this.getModableSkills === "function") {
				skills = this.getModableSkills();
			} else if (typeof this.getSkills === "function") {
				skills = this.getSkills().concat(lib.skill.global);
				game.expandSkills(skills);
				skills = skills.filter(i => {
					const info = get.info(i);
					return info && info.mod;
				});
				skills.sort((a, b) => get.priority(a) - get.priority(b));
			}
			for (const skill of skills) {
				for (const key of keys) {
					const mod = get.info(skill).mod[key == "cardsuit" ? "suit" : key];
					if (mod) {
						let arg = [card, this, event, "unchanged"];
						const result = mod.call(game, ...arg);
						if (result !== undefined && typeof arg[arg.length - 1] !== "object") {
							arg[arg.length - 1] = result;
						}
						if (arg[arg.length - 1]) {
							next.modSkill[key] = skill;
						}
					}
				}
			}
		}

		...
	}
         
```
### 为一些需要选目标的choose事件新增targetprompt2接口，通过钩子函数在选择目标时生成不同于player#prompt的提示，目前用例有谋小乔（触发技）、谋文丑（主动技）、OL麴义（常驻chooseToUse）
```javascript
//OL麴义的伏骑
onChooseToUse(event) {
	event.targetprompt2.add(target => {
		if (!target.isIn()) {
			return false;
		}
		const player = get.player(),
			card = get.card();
		if (get.type(card) == "trick" || (get.type(card) == "basic" && !["shan", "tao", "jiu", "du"].includes(card.name))) {
			if (target.isIn() && target !== player && get.distance(target, player) <= 1) {
				return "不可响应";
			}
		}
	});
},
//OL谋小乔的迷落
const next = player
	.chooseTarget(`###${get.prompt(event.skill)}###令一名没有“迷落”牌的角色失去1点体力，或令一名有“迷落”牌的角色回复1点体力。`, (card, player, target) => {
		return player.getStorage("olmiluo_clear").includes(target);
	})
	.set("ai", target => {
		const player = get.player();
		if (target.countCards("h", card => card.hasGaintag("olmiluo"))) {
			return get.recoverEffect(target, player, player);
		}
		return get.effect(target, { name: "loseHp" }, player, player);
	});
	next.targetprompt2.add(target => {
		if (!target.isIn() || !get.event().filterTarget(null, get.player(), target)) {
			return false;
		}
		return target.countCards("h", card => card.hasGaintag("olmiluo")) ? "回复体力" : "失去体力";
	});
	event.result = await next.forResult();
//OL谋文丑的轮战
onChooseToUse(event) {
	if (!game.online && !event.olsblunzhan) {
		const player = get.player();
		event.set("olsblunzhan", player.getHistory("useCard"));
	}
	event.targetprompt2.add(target => {
		if (!target.isIn() || get.event().skill != "olsblunzhan" || !get.event().filterTarget(get.card(), get.player(), target)) {
			return false;
		}
		const player = get.player(),
			history = get.event().olsblunzhan;
		const num = history?.filter(evt => evt.targets?.includes(target)).length;
		return `轮战${num}`;
	});
},
```
### 新增game#createFakeCards和game#deleteFakeCards用来生成用于点击的假牌（用例看手杀杨弘和手杀势鲁肃）
```javascript
         /**
	 * 用于玩家使用非自己手牌时生成的可以选择的假牌（其实就是复制一份出来）。
	 *
	 * @param { Card[] | Card } cards 需要被复制的真牌，允许传入单张卡牌或者卡牌数组
	 * @param { Boolean } isBlank 是否生成只有牌背没有其他牌面信息的牌
	 * @param { string } tempname 生成的假牌的临时名字，只有isBlank为true才会用到
	 * @returns { Card[] }
	 */
	createFakeCards(cards, isBlank = false, tempname) {
		if (!Array.isArray(cards)) {
			cards = [cards];
		}
		const cardsx = cards.map(card => {
			const cardx = ui.create.card();
			cardx.isFake = true;
			cardx._cardid = card.cardid;
			if (isBlank) {
				//没有tempname默认就是白板
				cardx.init([null, null, tempname || "猜猜看啊", null]);
				game.broadcastAll(cardx => {
					cardx.classList.add("infohidden");
					cardx.classList.add("infoflip");
				}, cardx);
			} else {
				cardx.init(get.cardInfo(card));
			}
			return cardx;
		});
		return cardsx;
	}
	/**
	 * 用于删除createFakeCards生成的假牌。
	 *
	 * @param { Card[] | Card } cards 需要被删除的假牌，允许传入单张卡牌或者卡牌数组
	 * @returns { Card[] } 返回那些不是假牌的牌
	 */
	deleteFakeCards(cards) {
		if (!Array.isArray(cards)) {
			cards = [cards];
		}
		const fake = cards.filter(card => card.isFake && card._cardid),
			other = cards.removeArray(fake),
			wild = [],
			map = {};
		fake.forEach(card => {
			const owner = get.owner(card);
			if (!owner) {
				wild.push(card);
				return;
			}
			if (!map[owner.playerid]) {
				map[owner.playerid] = [];
			}
			map[owner.playerid].push(card);
		});
		wild.forEach(i => i.delete());
		for (const id in map) {
			const target = (_status.connectMode ? lib.playerOL : game.playerMap)[id];
			const cards = map[id];
			if (target?.isOnline2()) {
				target.send(
					function (cards, player) {
						cards.forEach(i => i.delete());
						if (player == game.me) {
							ui.updatehl();
						}
					},
					cards,
					target
				);
			}
			cards.forEach(i => i.delete());
			if (target == game.me) {
				ui.updatehl();
			}
		}
		return other;
	}
```
### 将神张飞【神裁】中获取牌面信息的函数常驻为 get.cardDescription 方法
#### Get.cardDescription 方法
```javascript
	cardDescription(node, player) {
		let str = "",
			name = node.name;
		if (lib.translate[name + "_info"]) {
			if (lib.card[name].type && lib.translate[lib.card[name].type]) {
				str += "" + get.translation(lib.card[name].type) + "牌|";
			}
			if (get.subtype(name)) {
				str += "" + get.translation(get.subtype(name)) + "|";
			}
			if (lib.card[name] && lib.card[name].addinfomenu) {
				str += "" + lib.card[name].addinfomenu + "|";
			}
			if (get.subtype(name) == "equip1") {
				let added = false;
				if (lib.card[node.name] && lib.card[node.name].distance) {
					const dist = lib.card[node.name].distance;
					if (dist.attackFrom) {
						added = true;
						str += "攻击范围：" + (-dist.attackFrom + 1) + "|";
					}
				}
				if (!added) {
					str += "攻击范围：1|";
				}
			}
		}
		if (lib.card[name].cardPrompt) {
			str += "" + lib.card[name].cardPrompt(node, player) + "|";
		} else if (lib.translate[name + "_info"]) {
			str += "" + lib.translate[name + "_info"] + "|";
		}
		if (lib.translate[name + "_append"]) {
			str += "" + lib.translate[name + "_append"] + "|";
		}
		if (get.is.yingbianConditional(node)) {
			const yingbianEffects = get.yingbianEffects(node);
			if (!yingbianEffects.length) {
				const defaultYingbianEffect = get.defaultYingbianEffect(node);
				if (lib.yingbian.prompt.has(defaultYingbianEffect)) {
					yingbianEffects.push(defaultYingbianEffect);
				}
			}
			if (yingbianEffects.length) {
				str += `应变：${yingbianEffects.map(value => lib.yingbian.prompt.get(value)).join("；")}|`;
			}
		}
		return str;
	}
```

### 将许劭【评荐】中初始化角色列表的函数常驻为** game.initCharactertList 方法
#### Game.initCharactertList 方法
```javascript
	/**
	 * 初始化角色列表
	 *
	 * 仅无参时修改_status.characterlist
	 * @param { boolean } [filter] 筛选逻辑：false跳过移除逻辑，否则执行默认移除逻辑
	 * @returns { string[] }
	 */
	initCharactertList(filter) {
		let list;
		if (_status.connectMode) {
			list = get.charactersOL();
		} else {
			list = Object.keys(lib.character).filter(name => !lib.filter.characterDisabled2(name) && !lib.filter.characterDisabled(name));
		}
		if (filter !== false) {
			if (list.length) {
				game.countPlayer2(current => {
					list.removeArray(get.nameList(current));
				});
			}
			if (filter === undefined) {
				_status.characterlist = list;
			}
		}
		return list;
	}
```

### 为卡牌添加 deadTarget 和 includeOut 属性，支持对死亡/修整角色用牌（用例看武圣归来）；

### player.chooseToUse 支持 chooseonly 方便在技能的 cost 使用 chooseToUse，而不用 direct:true 再在 content 中使用 chooseToUse；
```javascript
skill = {
	trigger: { player: "phaseUseBegin" },
	async cost(event, trigger, player) {
		event.result = await player.chooseToUse().set("chooseonly", true).forResult();
	},
	async content(event, trigger, player) {
		const { ResultEvent, logSkill } = event.cost_data;
		event.next.push(ResultEvent);
		if (logSkill) {
			if (typeof logSkill == "string") {
				ResultEvent.player.logSkill(event.logSkill);
			} else if (Array.isArray(logSkill)) {
				ResultEvent.player.logSkill.call(ResultEvent.player, ...logSkill);
			}
		}
		await ResultEvent;
	},
};
```

### 优化 chooseNumbers；

### player.chooseDrawRecover 添加 gaintag 支持因此获得的牌会添加对应标签；

### 添加 game.getRoundHistory（用法参考 player.getRoundHistory）；
#### Game.getRoundHistory 方法
```javascript
	getRoundHistory(key, filter = lib.filter.all, num = 0, keep, last) {
		if (!filter || typeof filter != "function") {
			filter = lib.filter.all;
		}
		let evts = [],
			history = _status.globalHistory;
		for (let i = history.length - 1; i >= 0; i--) {
			if (keep === true || num == 0) {
				let currentHistory = history[i];
				if (key) {
					currentHistory = currentHistory[key];
				}
				if (filter) {
					currentHistory = currentHistory.filter(filter);
				}
				evts.addArray(currentHistory.slice().reverse());
			}
			if (history[i].isRound) {
				if (num > 0) {
					num--;
				} else {
					break;
				}
			}
		}
		evts.reverse();
		if (last && evts.includes(last)) {
			const lastIndex = evts.indexOf(last);
			return evts.filter(evt => evts.indexOf(evt) <= lastIndex);
		}
		return evts;
	}
```

### 将赵直【统观】吴普【识草】共用的 localMark 函数内置为 player#localMarkSkill；
#### Player.localMarkSkill 方法
```javascript
localMarkSkill(skill, target, event) {
		const func = (skill, player) => {
			var name = skill,
				info;
			if (player.marks[name]) {
				player.updateMarks();
			}
			if (lib.skill[name]) {
				info = lib.skill[name].intro;
			}
			if (!info) {
				return;
			}
			if (player.marks[name]) {
				player.marks[name].info = info;
			} else {
				player.marks[name] = player.mark(name, info);
			}
			player.updateMarks();
		};
		if (event.player == game.me) {
			func(skill, target);
		} else if (event.isOnline()) {
			this.send(func, skill, target);
		}
	}
```
### 允许game.expandSkills展开subSkill，来让【点墨】【骤袭】可以筛选到更多的技能

### 增加lib.selectGroup来存储自选势力的势力
```javascript
selectGroup = ["shen", "western", "devil"];
```

### 允许chooseToCompare传入event.position控制可选区域

### 为get.is下判断进攻马/防御马的两个函数添加subtypes判断