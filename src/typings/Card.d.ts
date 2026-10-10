declare type CardBaseUIData = {
	/** 卡牌名字 */
	name?: string;
	/** 卡牌花色（heart/spade/diamond/club） */
	suit?: string;
	/** 卡牌点数（1~13） */
	number?: number;
	/**
	 * 卡牌属性
	 *
	 * 多个属性用分隔符连接，如 "fire|thunder"；
	 * 可选值：fire、thunder、kami、ice、stab、poison
	  * @since 1.11.5
	 */
	nature?: string | null;
	/**
	 * 卡牌存储数据
	 *
	 * 用于在卡牌上保存自定义状态（如标记、计数等）；
	 * VCard 构造时会通过 get.copy 复制源牌的 storage
	  * @since 1.11.5
	 */
	storage?: Record<string, any>;

	/**
	 * 以下字段用于过滤卡牌的额外结构
	 *
	 * 当本类型对象作为 filterCard / get.filter 的过滤条件传入时，
	 * 这些字段会通过对应的 get.xxx 方法取值并匹配
	 * （见 get/index.js 的 filter 方法）
	  * @since 1.11.5
	 */
	/** 卡牌类型
	 * 
	 * （basic/equip/trick/delay/zhenfa）
	 * 数组表示满足其一即可
	  * @since 1.11.5
	 */
	type?: string | string[];
	/** 卡牌子类型
	 * 
	 * （装备位 equip1~equip5）
	  * @since 1.11.5
	 */
	subtype?: string;
	/** 卡牌颜色
	 * 
	 * （red/black）
	  * @since 1.11.5
	 */
	color?: string;

	/**
	 * 是否是视为牌
	 *
	 * - true：本来的卡牌（实体牌）
	 * - false/undefined：作为视为牌
	 *
	 * 在 useCard 使用时，作为视为牌会把 next.cards 设置为 card.cards
	  * @since 1.11.5
	 */
	isCard?: boolean;

	/**
	 * 真实使用的卡牌
	 *
	 * 视为牌 背后对应的实体牌；VCard 构造时会复制该数组
	  * @since 1.11.5
	 */
	cards?: Card[];
}

/**
 * 卡牌信息（lib.card[name]）
 *
 * 通过 get.info(card) 获取（传入卡牌对象，返回 lib.card[card.name]）
 *
 * 注意：与 lib.element.Card（DOM 元素）不同，CardInfo 是卡牌的功能定义
 *
 * 卡牌数据通常由 importCardConfig 动态导入，最终挂载到 lib.card 上。
  * @since 1.11.5
 */
declare interface CardInfo {
	// ===== 全局开关 =====
	/**
	 * 可用的模式列表
	 *
	 * 数组形式（如 ["guozhan", "versus"]），用于限制卡牌仅在指定模式中可用；
	 * 配置该字段后，凡 `mode` 不含当前模式的卡牌都会被过滤掉（与 forbid 互补）。
	 *
	 * 逻辑：get.usableCards()（apps/core/noname/get/index.js）
	 * ```js
	 * for (var i in lib.card) {
	 * 	if (lib.card[i].mode && lib.card[i].mode.includes(get.mode()) == false) {
	 * 		continue;
	 * 	}
	 * }
	 * ```
	  * @since 1.11.5
	 */
	mode?: string[];
	/**
	 * 禁用的模式列表(unused)
	 * 
	 * @todo: get.types()使用forbid字段排除模式，但是没有任何地方使用get.types()，因此事实上无用，也没有卡牌使用该字段
	 *
	 * 逻辑：get.types()（apps/core/noname/get/index.js）
	 * ```js
	 * if (lib.card[i].forbid && lib.card[i].forbid.includes(lib.config.mode)) {
	 * 	continue;
	 * }
	 * ```
	  * @since 1.11.5
	 */
	forbid?: string[];
	/**
	 * 当前是否处于闪闪节活动期间（diy）
	 *
	 * 用于限定仅在活动期间生效的卡牌机制；目前仅【思召剑】配置该函数，返回 true 表示当前处于闪闪节。
	 *
	 * 逻辑：onlyOL/card.js【思召剑】（通过日期判断活动期间：3 月 2 日 ~ 3 月 15 日）
	 * ```js
	 * inShanShanFestival() {
	 * 	const date = new Date();
	 * 	return date.getMonth() + 1 == 3 && date.getDate() >= 2 && date.getDate() <= 15;
	 * }
	 * ```
	 * 使用处：onlyOL/card.js【思召剑】的 onLose 中
	 * ```js
	 * onLose() {
	 * 	if (!lib.card.sizhaojian.inShanShanFestival() && ...) {
	 * 		cards.forEach(card => card.fix());
	 * 	}
	 * }
	 * ```
	  * @since 1.11.5
	 */
	inShanShanFestival?: () => boolean;
	/**
	 * 隐藏卡牌（不出现在卡包内）
	 *
	 * 为 true 时该牌不进入任何卡包、不随机出现。
	 *
	 * 逻辑：lib.element.content.loadPackage() 构建卡包时跳过隐藏牌
	 * （apps/core/noname/library/element/content.ts）
	 * ```js
	 * for (const cardName in cards[cardPackName].card) {
	 * 	if (!cards[cardPackName].card[cardName].hidden && cards[cardPackName].translate[`${cardName}_info`]) {
	 * 		cardPack.push(cardName);
	 * 	}
	 * }
	 * ```
	  * @since 1.11.5
	 */
	hidden?: boolean;
	/**
	 * 继承另一张卡牌的属性(unused)
	 *
	 * 值为被继承的卡牌名（如 "zhuangshu_basic"），期望继承其未定义的属性。
	 *
	 * TODO：引擎在**CardInfo**上并不处理该字段（`finishSkill()` 中的 `inherit` 继承仅针对技能）；
	 * 目前仅有 zhuangshu_equip 等极少数牌配置了它，实际不生效，疑似误把技能的用法写在了卡牌上。
	  * @since 1.11.5
	 */
	inherit?: string;

	// ===== 基本属性 =====
	/**
	 * 名称（疑似无用）
	 * 
	 * 实际上似乎不起作用，只在【軨軨】zc26_lingling 装备技能中用于判定该装备。
	 * TODO: 缺少相关逻辑。
	 *
	 * 逻辑：offline/skill/extra_offline.js 中
	 * ```js
	 * player.getCards("e", card => get.info(card)?.name == "zc26_lingling")
	 * ```
	  * @since 1.11.5
	 */
	name?: string;
	/**
	 * 默认颜色
	 *
	 * 取值为该牌默认使用的颜色，如 "red"（红）、"black"（黑）等；
	 * 在创建卡牌未显式指定花色时用作兜底。
	 *
	 * 逻辑：game/index.js 创建卡牌（get.suit）时
	 * ```js
	 * if (!suit && lib.card[name].cardcolor) {
	 * 	suit = lib.card[name].cardcolor;
	 * }
	 * ```
	  * @since 1.11.5
	 */
	cardcolor?: string;
	/**
	 * 默认属性
	 *
	 * 为卡牌指定一个默认属性（如【火攻】cardnature: "fire"、【闪电】cardnature: "thunder"），
	 * 在创建该牌未显式指定属性时用作兜底；也用于生成虚拟牌时作为其属性。
	 *
	 * 逻辑：game/index.js 创建卡牌时
	 * ```js
	 * if (!nature && lib.card[name].cardnature) {
	 * 	nature = lib.card[name].cardnature;
	 * }
	 * ```
	 * player.js 生成虚拟卡牌时
	 * ```js
	 * virtualCard.init(["", "", card, info && info.cardnature]);
	 * ```
	  * @since 1.11.5
	 */
	cardnature?: string;
	/**
	 * 可拥有的属性们
	 *
	 * 数组列出该牌可携带的属性（fire/thunder/ice/kami/poison 等）；
	 * 仅【杀】配置（sha 的 `nature: ["thunder", "fire", "kami", "ice"]`），
	 * 说明该牌以不同属性变体的形态存在于牌堆中。
	 *
	 * 逻辑：牌堆中带属性的【杀】实例（list 第 4 项为属性）被收集进 lib.inpile_nature，
	 * 供洗入牌堆与判定属性用（ui/create/index.js）
	 * ```js
	 * if (lib.card.list[i][2] == "sha" && lib.card.list[i][3]) {
	 * 	lib.inpile_nature.add(lib.card.list[i][3]);
	 * }
	 * ```
	  * @since 1.11.5
	 */
	nature?: string[];
	/**
	 * 卡牌类型
	 *
	 * - basic：基本牌
	 * - equip：装备牌
	 * - trick：锦囊牌
	 * - delay：延时锦囊牌
	 * - zhenfa：阵法牌
	 * - pss：手势
	 * - db_atk：策略-进攻（审配技能）
	 * - db_def：策略-防御（审配技能）
	 * - takaramono：宝物（庞德公技能）
	 * - special_delay：技能机制
	 * - poker：扑克牌
	  * @since 1.11.5
	 */
	type?: string;
	/**
	 * 卡牌子类型
	 *
	 * - equip1：武器
	 * - equip2：防具
	 * - equip3：防御马（减攻击距离）
	 * - equip4：进攻马（加攻击距离）
	 * - equip5：宝物
	 * - equip6：特殊装备
	 * - zf_common：普通战法牌
	 * - zf_rare：稀有战法牌
	 * - zf_epic：史诗战法牌
	 * - zf_legend：传说战法牌
	  * @since 1.11.5
	 */
	subtype?: string;
	/**
	 * 多个子类型
	 *
	 * 与 subtype 互斥，用于一张牌同时属于多个装备位的情况；
	 * 由 get.subtypes() 读取，可被置入多张虚拟装备。
	 *
	 * 逻辑：get.subtypes()（apps/core/noname/get/index.js）
	 * ```js
	 * if (Array.isArray(obj.subtypes)) {
	 * 	return get.copy(obj.subtypes);
	 * }
	 * ```
	 * player.canEquip() 据此判断能否装备到对应装备位
	 * ```js
	 * const ranges = get.subtypes(name);
	 * ```
	  * @since 1.11.5
	 */
	subtypes?: string[];
	/**
	 * 装备牌的范围/距离修正
	 *
	 * 各子字段均为**距离修正量**（非最终距离），由装备者的装备牌累加：
	 * - globalFrom：自己到其他玩家的距离修正（正值**减少**距离，即"攻击马"效果，如 -1 马）；
	 * - globalTo：其他玩家到自己的距离修正（正值**增加**防御距离，即"防御马"效果）；
	 * - attackFrom：自己的攻击距离修正（正值**减少**攻击距离，如 -3 表示攻击距离 +3）；
	 * - attackTo：其他玩家攻击自己时的距离修正（正值**增加**自己承受的攻击距离）；
	 * - attackRange：动态攻击范围（函数优先于 attackFrom 计算，返回值参与所有装备范围取最大值）。
	 *
	 * 消费逻辑：player.js 的 inRangeOf（攻击范围判断的核心，apps/core/noname/library/element/player.js）
	 * ```js
	 * let n = 座位全局距离, m = n;                     // m 为最终攻击距离
	 * for (const vcard of from.getVCards("e")) {       // from（攻击方）的装备
	 * 	const info = get.info(vcard).distance;
	 * 	if (info.globalFrom) { m += info.globalFrom; n += info.globalFrom; }   // 攻击马：m、n 同时修正
	 * }
	 * for (const vcard of to.getVCards("e")) {         // to（目标）的装备
	 * 	const info = get.info(vcard).distance;
	 * 	if (info.globalTo) { m += info.globalTo; n += info.globalTo; }         // 防御马：m、n 同时修正
	 * 	if (info.attackTo) { m += info.attackTo; }                             // 只修正 m（攻击距离）
	 * }
	 * return m <= range;                               // 攻击距离不超过 range 才算在范围内
	 * ```
	 * 配套还有 getGlobalFrom()（返回 `-range`）与 getGlobalTo()（返回 `range`）
	  * @since 1.11.5
	 */
	distance?: {
		/** 自己到其他玩家的距离修正（正值减少距离，如 -1 马） */
		globalFrom?: number;
		/** 其他玩家到自己的距离修正（正值增加距离，如 +1 马） */
		globalTo?: number;
		/** 自己的攻击距离修正（正值减少，如【贯石斧】(guanshi)的distance.attackFrom: -2） */
		attackFrom?: number;
		/** 其他玩家攻击自己时的距离修正（正值增加自己承受的攻击距离） */
		attackTo?: number;
		/**
		 * 动态攻击范围
		 *
		 * 若存在该函数，则在 `player.getEquipRange` 中调用 `info.distance.attackRange(card, player)`
		 * 以动态计算该装备提供的攻击范围（返回值参与所有装备范围取最大值）；
		 * 不提供时回退到 `attackFrom` 静态计算（1 - attackFrom）。
		 * 返回数字表示攻击范围；返回非数字（如 false）则视为无效、不参与计算。
		 * @param card 当前装备卡牌
		 * @param player 装备拥有者
		 * @returns 攻击范围数值；无效时返回 false
		  * @since 1.11.5
		 */
		attackRange?: (card: Card, player: Player) => number | false;
	};
	/**
	 * 装备附带的技能
	 *
	 * 装备该牌时，角色会获得这些技能（武器/防具/坐骑等装备牌的技能入口）；
	 * 在取装备技能时统一收集。
	 *
	 * 逻辑：get.skillsFromEquips()（apps/core/noname/get/index.js）
	 * ```js
	 * const info = get.info(card, false);
	 * if (info.skills) { skills.addArray(info.skills); }
	 * ```
	  * @since 1.11.5
	 */
	skills?: string[];
	/**
	 * 全局技能
	 *
	 * 卡牌被创建（进入牌堆）时，将其指定的技能注册为全局技能；
	 * 可为字符串或字符串数组，注册后该字段会被 delete（只在首次进堆时生效一次）。
	 *
	 * 逻辑：card.js 的 Card.$init()（apps/core/noname/library/element/card.js）
	 * ```js
	 * var info = lib.card[card[2]];
	 * if (info.global && !this.classList.contains("button")) {
	 * 	if (Array.isArray(info.global)) {
	 * 		while (info.global.length) {
	 * 			game.addGlobalSkill(info.global.shift());
	 * 		}
	 * 	} else if (typeof info.global == "string") {
	 * 		game.addGlobalSkill(info.global);
	 * 	}
	 * 	delete info.global;
	 * }
	 * ```
	  * @since 1.11.5
	 */
	global?: string | string[];
	/**
	 * 基础伤害值
	 *
	 * 使用该牌造成伤害时的基础伤害值（未指定时默认 1）；用作伤害事件的 baseDamage 基数。
	 *
	 * 逻辑：content.ts 的 damage 结算中（apps/core/noname/library/element/content.ts）
	 * ```js
	 * if (typeof event.baseDamage != "number") {
	 * 	event.baseDamage = get.info(event.card, false).baseDamage || 1;
	 * }
	 * ```
	  * @since 1.11.5
	 */
	baseDamage?: number;
	/**
	 * 来源卡牌名数组(目前只有装备牌有用)
	 *
	 * NOTE: 事实上并没有卡牌使用该字段，也并没有Card.getSource()的消费点
	 * 
	 * FIXME: 这个设计很脆弱，因为如果通过player.getCards("e", (card) => card.name === 'xxx')的方式获取装备栏里的装备，就无法利用source字段。
	 * 该字段只用于player.getEquip()、player.getVEquip()，不过考虑到目前并没有卡牌使用该字段，也许该字段是被弃用了。
	 * 
	 * 但player.getEquip()、player.getVEquip()里有source字段的消费点
	 * getEquip可以通过 传入装备名 来检索装备栏里的装备，但如果source包含该装备名，也会返回该装备牌。
	 * 是的，所以该字段目前只用于装备牌。
	 * 
	 * 逻辑：
	 * player.js 的 getEquip() 亦按来源卡牌名检索
	 * ```js
	 * var source = get.info(es[i]).source;
	 * if (Array.isArray(source) && source.includes(name)) return es[i];
	 * ```
	 * card.js 的 Card.getSource()（apps/core/noname/library/element/card.js）
	 * ```js
	 * getSource(name) {
	 * 	var info = lib.card[this.name];
	 * 	if (info && Array.isArray(info.source)) {
	 * 		return info.source.includes(name);
	 * 	}
	 * 	return false;
	 * }
	 * ```
	  * @since 1.11.5
	 */
	source?: string[];

	// ===== 特殊属性 =====
	/**
	 * 是否可被无懈可击
	 *
	 * 标记该牌能否被【无懈可击】响应；锦囊牌默认可无懈，非锦囊牌需显式 `wuxieable: true` 才可。
	 *
	 * 逻辑：无懈可击技能响应判定中（standard.js）
	 * ```js
	 * const info = get.info(card);
	 * if (info.wuxieable === false) return false;          // 显式禁无懈
	 * if (get.type(event.card) !== "trick" && !info.wuxieable) return false; // 非锦囊且未标记则不可
	 * ```
	  * @since 1.11.5
	 */
	wuxieable?: boolean;
	/**
	 * 是否可救人
	 *
	 * 标记/判定该牌能否在濒死求桃阶段被用于救人；
	 * 为函数时按（牌, 施救者, 濒死角色）动态判定。
	 *
	 * 逻辑：player.js 的 Player.canSaveCard()（apps/core/noname/library/element/player.js）
	 * ```js
	 * let savable = get.info(card).savable;
	 * if (typeof savable == "function") {
	 * 	savable = savable(card, this, target);
	 * }
	 * return savable;
	 * ```
	 * library/index.js 的 lib.filter.cardSavable 同理
	 * ```js
	 * let savable = get.info(card2).savable;
	 * if (typeof savable === "function") {
	 * 	savable = savable(card2, player, target);
	 * }
	 * ```
	 * @param card 使用的牌
	 * @param player 施救者
	 * @param dying 濒死角色
	 * @returns 该牌是否可被用于救人
	  * @since 1.11.5
	 */
	savable?: boolean | ((card: Card, player: Player, dying: Player) => boolean);
	/**
	 * 是否可重铸
	 *
	 * 标记/判定该牌能否被重铸（弃置并摸一张）；
	 * chongzhu 为 recastable 的别名，两者等价。
	 *
	 * 逻辑：library/index.js 的 lib.filter.cardRecastable()（apps/core/noname/library/index.js）
	 * ```js
	 * const info = get.info(card);
	 * const recastable = info.recastable || info.chongzhu;
	 * return Boolean(typeof recastable === "function" ? recastable(_status.event, player) : recastable);
	 * ```
	 * @param event _status.event 当前事件
	 * @param player 重铸者
	  * @since 1.11.5
	 */
	recastable?: boolean | ((event: GameEvent, player: Player) => boolean);
	/**
	 * 是否可重铸
	 *
	 * recastable 的别名，两者等价；写法兼容老版本的 chongzhu 字段。
	 *
	 * 逻辑：library/index.js 的 lib.filter.cardRecastable()（apps/core/noname/library/index.js）
	 * ```js
	 * const info = get.info(card);
	 * const recastable = info.recastable || info.chongzhu;
	 * return Boolean(typeof recastable === "function" ? recastable(_status.event, player) : recastable);
	 * ```
	 * @param event _status.event 当前事件
	 * @param player 重铸者
	  * @since 1.11.5
	 */
	chongzhu?: boolean | ((event: GameEvent, player: Player) => boolean);
	/**
	 * 国战里是否可以合纵（unuseful）
	 *
	 * 标记该牌在国战模式中可否被「合纵/连横」交给其他角色。
	 *
	 * 注意：实际生效依赖**造牌标记数组** （guozhan/src/info/pile.js 中 list 的第 5 项），
	 * 造牌后转为卡牌 tag，经 `card.hasTag("lianheng")` 检测；
	 * 本布尔字段（extra.js、versus.js 等配置）**无任何消费点**，为死字段。
	 * REVIEW: 或者其实有我不知道的用途，希望别人审核一下。
	 * 
	 * 逻辑：guozhan/pile.js 牌堆配置
	 * ```js
	 * ["spade", 1, "xietianzi", null, ["lianheng"]], // 第 5 项为 tag 数组
	 * ```
	 * guozhan 合纵技能 `_lianheng`（guozhan/src/skill/character/rest.js）据此判定
	 * ```js
	 * filterCard(card) {
	 * 	return card.hasTag("lianheng") || card.hasGaintag("_lianheng");
	 * },
	 * ```
	  * @since 1.11.5
	 */
	lianheng?: boolean;

	// ===== 是否可使用 =====
	/**
	 * 主动使用
	 *
	 * - true：可使用
	 * - false：不可使用
	 * - function：动态判断，返回 true 或可使用的卡牌数组
	 * 备注："phaseUse"是技能Skill内的写法，卡牌里不是合法字段。
	 *
	 * 装备牌equip和延时锦囊牌delay可不写，游戏初始化时在game.finishCard()时自动补充。
	 * 基本牌basic和即时锦囊牌trick需要写，不然无法使用。
	 * 为函数时按（牌, 使用者, 事件）动态判定。
	 *
	 * 逻辑：lib.filter.cardEnabled()（apps/core/noname/library/index.js）
	 * ```js
	 * const filter = get.info(card2).enable;
	 * if (!filter) return false;
	 * if (typeof filter === "boolean") return filter;
	 * if (typeof filter === "function") return filter(card2, player, event);
	 * return false;
	 * ```
	 * game.finishCard() 自动补全（apps/core/noname/game/index.js）
	 * ```js
	 * if (card.type == "equip") {
	 * 	if (card.enable == undefined) { card.enable = true; }
	 * }
	 * ```
	 * @param card 卡牌
	 * @param player 使用者
	 * @param event 当前事件
	 * @returns true 可使用
	  * @since 1.11.5
	 */
	enable?: boolean | ((card: Card, player: Player, event: GameEvent) => boolean);
	/**
	 * 使用次数限制
	 *
	 * - number：最多使用次数
	 * - function：动态判断，传入 (card, player) 返回次数
	 *
	 * 配合updateUsable、forceUsable使用。
	 *
	 * 逻辑：lib.filter.cardUsable()（apps/core/noname/library/index.js）
	 * ```js
	 * let num = info.usable;
	 * if (typeof num === "function") {
	 * 	num = num(card2, player);
	 * }
	 * num = game.checkMod(card2, player, num, "cardUsable", player);
	 * if (typeof num !== "number") {
	 * 	return typeof num === "boolean" ? num : true;
	 * }
	 * if (player.countUsed(card2) < num) { // 已用次数未达到上限
	 * 	return true;
	 * }
	 * return game.hasPlayer2(current => Boolean(game.checkMod(card2, player, current, false, "cardUsableTarget", player)), true);
	 * ```
	 * @param card 卡牌
	 * @param player 使用者
	 * @returns 每回合最多可使用次数
	  * @since 1.11.5
	 */
	usable?: number | ((card: Card, player: Player) => number);
	/**
	 * 何时使用usable限制使用次数
	 *
	 * 目前仅支持 "phaseUse"————出牌阶段中限制使用次数限制；
	 * 在阶段结束时会把已用次数清零。
	 *
	 * 逻辑：lib.filter.cardUsable2()（apps/core/noname/library/index.js）
	 * ```js
	 * if (info.updateUsable === "phaseUse") {
	 * 	event ??= _status.event;
	 * 	if (event.type === "chooseToUse_button") {
	 * 		const phaseUseEvent = event.getParent("phaseUse");
	 * 		...
	 * 	}
	 * }
	 * ```
	  * @since 1.11.5
	 */
	updateUsable?: "phaseUse";
	/**
	 * 强制遵循卡牌的usable，无视"无次数限制"效果(diy)
	 *
	 * TODO: 建议移到公共逻辑（虽然还没有卡牌使用此字段）
	 * 
	 * 卡牌info里无实例配置此字段
	 * 实际上需要那些拥有"无次数限制"效果的技能，例如〖狂才〗kuangcai在mod的cardUsable里写上这个字段，才能生效
	 * 实际上相当多拥有"无次数限制"效果的技能比如〖界狂才〗rekuangcai、〖立牧〗xinfu_limu，并没有判断该字段，因此很多时候不生效
	  * @since 1.11.5
	 */
	forceUsable?: boolean;
	/**
	 * 能否使用这张牌
	 *
	 * TODO：从【借刀杀人】【隔岸观火】这两张牌的CardInfo来看，作用应该类似于技能的filter字段。
	 * 但目前消费点仅在player.canUse()，而不用于player.useCard()，所以事实上，基本不起作用。可能是从lib.element.player.useCard中误删掉了，应该修改。
	 * 
	 * 逻辑：player.js 的 Player.canUse()（apps/core/noname/library/element/player.js）
	 * ```js
	 * var info = get.info(card);
	 * if (info.multicheck && !info.multicheck(card, this)) {
	 * 	return false;
	 * }
	 * ```
	 * @param card 卡牌
	 * @param player 使用者
	 * @returns 是否通过检查
	  * @since 1.11.5
	 */
	multicheck?: (card: Card, player: Player) => boolean;
	/**
	 * 是否需要手动确认（不自动使用）
	 *
	 * 为 true 时即使开启了「自动确认」选项，选择使用该牌也需玩家手动确认；
	 * 技能侧亦有同名字段。
	 *
	 * 逻辑：game/index.js 判断自动确认时
	 * ```js
	 * if (_status.event.name == "chooseToUse" && (skillinfo?.manualConfirm === true || cardinfo?.manualConfirm === true)) {
	 * 	auto_confirm = false;
	 * }
	 * ```
	  * @since 1.11.5
	 */
	manualConfirm?: boolean;

	// ===== 目标筛选 =====
	/**
	 * 对距离为 ~ 或（攻击范围 + ~）内的目标使用（目标距离范围限制）
	 *
	 * 由 lib.filter.targetInRange 消费（apps/core/noname/library/index.js），决定能否对 target 使用此牌。
	 * attack 优先级 > global 优先级。
	 *
	 * 形态有三：
	 * 1. 函数 `(card, player, target) => any` —— 自定义判定，返回值会被 Boolean() 包裹（必为 boolean）。参考【杀】。
	 * 2. `{ attack?: number }` —— 对距离为（攻击范围 + ~ - 1）及以内的角色使用。
	 * 3. `{ global?: number }` —— 对距离为 ~ 及以内的角色使用。参考【顺手牵羊】、【兵粮寸断】。
	 *
	 * 消费逻辑（targetInRange）：
	 * ```js
	 * // range 函数形态
	 * if (typeof range === "function") return Boolean(range(card, player, target));
	 * // range 对象形态：distance <= 限制值才可通过
	 * if (range[type] < distance) return false;          // global：distance <= range.global
	 * if (range[type] <= distance - attackRange) return false; // attack：distance <= range.attack + attackRange - 1
	 * ```
	 *
	 * 备注：与 outrange 的逻辑相反。
	 *
	 * @param card 卡牌
	 * @param player 使用者
	 * @param target 目标
	 * @returns 是否对目标在范围内（返回值会被 Boolean 包裹）
	  * @since 1.11.5
	 */
	range?: ((card: Card | VCard | CardBaseUIData, player: Player, target: Player) => any) | {
		/** 对距离为（攻击范围 + ~ - 1）及以内的角色使用 */
		attack?: number;
		/** 对距离为 ~ 及以内的角色使用。参考【顺手牵羊】、【兵粮寸断】 */
		global?: number;
	};
	/**
	 * 对距离为 ~ 或（攻击范围 + ~）外的目标使用（目标距离范围限制，与 range 相反）
	 *
	 * 由 lib.filter.targetInRange 消费，决定能否对 target 使用此牌。
	 * attack 优先级 > global 优先级。
	 *
	 * 形态有二：
	 * 1. `{ attack?: number }` —— 对距离为（攻击范围 + ~ - 1）及以外的角色使用。
	 * 2. `{ global?: number }` —— 对距离为 ~ 及以外的角色使用。
	 *
	 * 消费逻辑（targetInRange）：与 range 相反，distance 需**不小于**限制值才可通过。
	 * ```js
	 * if (outrange[type] > distance) return false;             // global：distance >= outrange.global
	 * if (outrange[type] > distance - attackRange + 1) return false; // attack：distance >= outrange.attack + attackRange - 1
	 * ```
	 *
	 * 备注：与 range 的逻辑相反。
	  * @since 1.11.5
	 */
	outrange?: {
		/** 对距离为（攻击范围 + ~ - 1）及以外的角色使用 */
		attack?: number;
		/** 对距离为 ~ 及以外的角色使用 */
		global?: number;
	};
	/**
	 * 是否只能以使用者自身为目标(diy)
	 *
	 * 为 true 时该牌只能以使用者自身为目标（多与 selectTarget == -1 搭配，表示"选中自己"）。
	 * 本字段**不被引擎直接强制消费**，而是约定俗成的标记，由卡牌的 filterTarget / content 及技能按需读取。
	 *
	 * 装备牌在初始化时，通过 game/index.js 的 game.finishCard()（`card.type == "equip"` 分支）将 toself 默认置为 true。
	 *
	 * 逻辑：game.finishCard()（apps/core/noname/game/index.js）
	 * ```js
	 * if (card.type == "equip") {
	 * 	if (card.toself == undefined) card.toself = true;
	 * }
	 * ```
	  * @since 1.11.5
	 */
	toself?: boolean;
	/**
	 * 是否无需选择目标即可使用
	 *
	 * 不选择目标就可以发动效果。
	 *
	 * 逻辑：lib.element.content 的 useCard 结算中（apps/core/noname/library/element/content.ts）
	 * ```js
	 * if (targets.length == 0 && !info.notarget) return;
	 * ```
	  * @since 1.11.5
	 */
	notarget?: boolean;
	/**
	 * 目标合法性检查（决定该目标是否可选）
	 *
	 * 由 lib.filter.targetEnabled 消费（apps/core/noname/library/index.js）：
	 * - `true`：任意目标均可；
	 * - `false`：任意目标均不可；
	 * - 函数：动态判断 `(card, player, target) => 是否可选`，返回值会被 Boolean() 包裹。
	 *
	 * 未配置时，装备牌会在 game.finishCard() 中被默认填充为默认 filterTarget。
	 * 当 filterTarget 为 null 且未配置 selectTarget 时，该牌视为无目标限制（lib.filter.filterCard 中直接返回 true）。
	 *
	 * 消费逻辑（targetEnabled）：
	 * ```js
	 * if (typeof filterTarget === "boolean") return filterTarget;
	 * if (typeof filterTarget === "function") return Boolean(filterTarget(card, player, target));
	 * ```
	 *
	 * @param card 卡牌
	 * @param player 使用者
	 * @param target 待选目标
	 * @returns 该目标是否可选；也允许数值（如 countCards 等计数的直接结果，非 0 即真）
	  * @since 1.11.5
	 */
	filterTarget?: ((card: Card, player: Player, target: Player) => number | boolean) | boolean | null;
	/**
	 * 是否为「借刀类牌」（可选一个主目标 + 多个追加目标）（需配合filterAddedTarget使用）
	 *
	 * 为 true 时，选中的第一个目标作为主目标，其余目标作为追加目标addedTarget：
	 * - `event.target`：主目标；
	 * - `event.addedTargets`：追加目标数组（`event.addedTarget` 为首个追加目标）；
	 * - `event._targets`：完整的目标数组（切片备份）。
	 *
	 * 配合 filterAddedTarget 过滤追加目标、selectTarget 翻倍上限实现"1 主 + N 追加"的目标结构，
	 * 典型如【借刀杀人】。
	 *
	 * 消费逻辑（player.js 的 useCard）：
	 * ```js
	 * if (info.singleCard) {
	 * 	next._targets = next.targets.slice(0);
	 * 	next.target = next.targets[0];
	 * 	next.addedTargets = next.targets.splice(1);
	 * 	if (next.addedTargets.length) next.addedTarget = next.addedTargets[0];
	 * }
	 * ```
	  * @since 1.11.5
	 */
	singleCard?: boolean;
	/**
	 * 「借刀类追加目标」合法性检查（需配合 singleCard 使用）
	 *
	 * 当 singleCard 为 true 时，对追加的目标(例如【借刀杀人】的第二个目标)进行过滤；
	 * 在 library/index.js、content.ts 中通过 `info.filterAddedTarget(card, player, target, preTarget)` 调用，
	 * 其中 preTarget 为已选的上一名（主）目标。
	 *
	 * 消费逻辑（targetEnabledx）：
	 * ```js
	 * if (info.singleCard && info.filterAddedTarget && ui.selected.targets.length) {
	 * 	return Boolean(info.filterAddedTarget(card, player, target, ui.selected.targets[ui.selected.targets.length - 1]));
	 * }
	 * ```
	 * 参考【借刀杀人】（standard.js）：追加目标是主目标需对其出杀的目标。
	 *
	 * @param card 卡牌
	 * @param player 使用者
	 * @param target 待选（追加）目标
	 * @param preTarget 已选的上一名目标
	 * @returns 是否可选
	  * @since 1.11.5
	 */
	filterAddedTarget?: (card: Card, player: Player, target: Player, preTarget: Player) => boolean;
	/**
	 * 是否允许该牌「额外指定目标」(diy)
	 *
	 * 事实上大部分时候不需要单独设置此字段，因为game.finishCard会自动将“装备牌”和 “延时锦囊牌”设置allowMultiple为false。
	 * 所以一般是基本牌或即时锦囊牌不想被额外指定目标时才使用。
	 *
	 * REVIEW: 可能是为了解决modTarget优先级低于“为true的filterTarget”而设计。但实现上很脆弱，因为本字段主要由技能逻辑消费，而非引擎消费。
	 * 逻辑；olchunhui (character/sp/skill.js)
	 * ```js
	 * // 判断能不能多指，有好几个方面（allowMultiple为true、没有multitarget、是否有能够增加的目标，缺一不可）
	 * if (info.allowMultiple == false || !targets.length || info.multitarget || !addTargets.length) { ... }
	 * ```
	  * @since 1.11.5
	 */
	allowMultiple?: boolean;
	/**
	 * 「额外增加目标」时，扩展合法的目标的范围
	 * 
	 * 注意优先级低于为true的filterTarget。
	 * 所以实际上作用是「额外增加目标」时，相对于牌面信息，扩展合法的目标的范围
	 * 比如【桃】tao (card/standard.js)
	 * ```js
	 * filterTarget(card, player, target) {
	 *		return target === player && target.isDamaged();
	 *	},
	 *	modTarget(card, player, target) {
	 *		return target.isDamaged();
	 *	},
	 * ```
	 * 
	 * 注意与filterTarget区分，例如：
	 * 〖舍宴〗额外指定目标时，通过lib.filter.targetEnabled2判断「额外目标」合法性；
	 * 而〖诛害〗回合外出杀，只通过lib.filter.targetEnabled判断「牌面目标」合法性。
	 * 
	 * 
	 * 由 lib.filter.targetEnabled2 / targetEnabled3 消费（apps/core/noname/library/index.js）：
	 * - `true`：任意目标均可指定；
	 * - `false`：不提供额外放宽；
	 * - 函数：动态判断 `(card, player, target) => 是否可指定`，返回值会被 Boolean() 包裹。
	 *
	 * 装备牌在 game.finishCard() 中默认被置为 true。
	 *
	 * 消费逻辑（targetEnabled2）：
	 * ```js
	 * if (lib.filter.targetEnabled(card, player, target)) return true;
	 * const modTarget = info.modTarget;
	 * if (typeof modTarget === "boolean") return modTarget;
	 * if (typeof modTarget === "function") return Boolean(modTarget(card, player, target));
	 * ```
	 * 
	 *
	 * @param card 卡牌
	 * @param player 使用者
	 * @param target 目标
	 * @returns 是否可指定该目标
	  * @since 1.11.5
	 */
	modTarget?: boolean | ((card: Card, player: Player, target: Player) => boolean);
	/**
	 * 是否允许指定死亡玩家为目标
	 *
	 * 默认 false，即死亡玩家不能被指定为目标。为 true 时允许指定。
	 * 在目标筛选（lib.filter.targetEnabledx 等）与 useCard 结算（content.ts）中均会检查。
	 *
	 * 消费逻辑（targetEnabledx，apps/core/noname/library/index.js）：
	 * ```js
	 * if (!info?.deadTarget && target.isDead()) return false;
	 * ```
	 * useCard 结算（content.ts）：
	 * ```js
	 * if (targets[num].isDead() && !info?.deadTarget) return;
	 * ```
	  * @since 1.11.5
	 */
	deadTarget?: boolean;
	/**
	 * 是否允许指定出局玩家为目标
	 *
	 * 默认 false，即已出局（out）玩家不能被指定为目标。为 true 时允许指定。
	 * 在目标筛选（lib.filter.targetEnabledx 等）与 useCard 结算（content.ts）中均会检查，
	 * 语义与 deadTarget 类似但针对出局状态。
	 *
	 * 消费逻辑（targetEnabledx，apps/core/noname/library/index.js）：
	 * ```js
	 * if (!info?.includeOut && target.isOut()) return false;
	 * ```
	  * @since 1.11.5
	 */
	includeOut?: boolean;

	// ===== 目标选择与结算顺序 =====
	/**
	 * 是否启用复杂选择模式（禁用全选等快捷操作）
	 *
	 * 为 true 时禁用"全选"按钮与自动直选等快捷操作，强制玩家逐个手动选择。
	 *
	 * 消费逻辑：
	 * - ui/create/index.js 中，`event.complexSelect` 为 true 时不注入全选按钮；
	 * - content.ts 中，`(!event.complexSelect || select[1] === 1)` 控制是否自动直选（仅选中 1 个时可直选）。
	 *
	 * ```js
	 * // ui/create/index.js
	 * if (!event.isMine() || !event.allowChooseAll || event.complexCard || event.complexSelect || !lib.config.choose_all_button) { ... }
	 * // content.ts
	 * let directh = !lib.config.unauto_choose && !event.isOnline() && select[0] == select[1] && (!event.complexSelect || select[1] === 1);
	 * ```
	 *
	 * 与 complexTarget 不同：complexSelect 主要关掉 UI 快捷（全选/直选），complexTarget 关掉目标的自动补全。
	  * @since 1.11.5
	 */
	complexSelect?: boolean;
	/**
	 * 是否启用复杂目标选择（禁用目标的自动补全）
	 *
	 * 为 true 时，即使已满足目标数量条件（targets.length == range[0] 且 range[0] == range[1] 且事件为 forced），
	 * 也不会自动把当前已选目标作为最终目标，而需玩家显式确认。
	 *
	 * 消费逻辑：
	 * - content.ts 的 chooseTarget 结算中，`!info.complexTarget` 才允许自动补全；
	 * - game/index.js 的目标过滤缓存中，`cardinfo.complexTarget` 为 true 时禁用缓存。
	 *
	 * ```js
	 * // content.ts
	 * } else if (!info.complexTarget && targets.length == range[0] && range[0] == range[1] && event.forced) {
	 * 	event.targets2 = targets;
	 * 	return { bool: true };
	 * }
	 * // game/index.js
	 * const cardinfo = get.info(get.card() || {});
	 * if (cardinfo && cardinfo.complexTarget) return false; // 禁用缓存
	 * ```
	 *
	 * 参考【借刀杀人】（standard.js）——需选择两名目标（被借刀者 + 出杀目标），故开启复杂目标选择。
	  * @since 1.11.5
	 */
	complexTarget?: boolean;
	/**
	 * 选择目标的数量
	 *
	 * - number：固定数量
	 * - [number1, number2]：可选择 number1 ~ number2 个目标
	 * - -1：选择所有可能的目标（不设上限）
	 * - function：动态判断，调用为 `select(card, player)`，返回 number 或 Select
	 *
	 * 由 get.select()（apps/core/noname/get/index.js）归一化：
	 * ```js
	 * if (typeof select == "function") return get.select(select());       // 递归解析函数返回值
	 * else if (typeof select == "number") return [select, select];       // 数字 -> [n, n]
	 * else if (select && get.itemtype(select) == "select") return select; // 数组 -> 原样
	 * return [1, 1];                                                      // 兜底
	 * ```
	 *
	 * 未配置时按牌的性质自动补齐：
	 * - 若定义了 filterTarget 且未定义 selectTarget，则默认 selectTarget = 1（game.finishCard 及 lib.filter.selectTarget）；
	 * - 装备牌在 game.finishCard() 中默认 selectTarget = -1（所有可装位置）。
	 *
	 * 注意：函数形态引擎以 `(card, player)` 调用（如 player.js 的 useTargets、lib.filter.selectTarget），
	 * 但 JS 会忽略多余实参，故卡牌里写 `() => 1` 也可行（参考 xianxia.js 的【联军盛宴】）。
	 *
	 * 附加：当 `singleCard` 与 `filterAddedTarget` 并存时，lib.filter.selectTarget 会把上限翻倍
	 * （`return [range[0] * 2, range[1] * 2]`），因为追加目标额外占用一半名额。
	 *
	 * @param card 卡牌
	 * @param player 使用者
	 * @returns 可选目标数量（数字或 [min, max] 区间）
	  * @since 1.11.5
	 */
	selectTarget?: number | Select | ((card: Card, player: Player) => number | Select);
	/**
	 * 改变目标（在正式结算前动态修改目标数组）
	 *
	 * 在 useCard 事件中于 `next.targets` 确定后调用，函数内可直接 push/splice 修改目标数组；
	 * 常用来把使用者自身等额外目标补入 targets。
	 *
	 * 消费逻辑（player.js 的 useCard）：
	 * ```js
	 * var info = get.info(next.card);
	 * if (info.changeTarget) info.changeTarget(next.player, next.targets);
	 * ```
	 * 技能侧亦有同名字段（SkillInfo.changeTarget，在 player.js useCard 中一并调用）。
	 * 参考 xianxia.js 的【联军盛宴】：`changeTarget(player, targets) { targets.push(player); }`
	 *
	 * @param player 使用者
	 * @param targets 目标数组（可直接修改）
	  * @since 1.11.5
	 */
	changeTarget?: (player: Player, targets: Player[]) => void;
	/**
	 * 是否反转目标结算顺序（对决-统率三军）
	 *
	 * 为 true 且处于 versus 模式、目标数 > 1 时，结算前插入一个"选择结算方向"（顺时针/逆时针）的
	 * 事件，按玩家选择的方向反转目标顺序。
	 *
	 * 消费逻辑（content.ts 的 useCard）：
	 * ```js
	 * } else if (info.reverseOrder && get.is.versus() && targets.length > 1) {
	 * 	const next = game.createEvent(`${event.card.name}ContentBefore`);
	 * 	next.setContent("reverseOrder");
	 * 	next.targets = targets;
	 * 	next.card = event.card;
	 * }
	 * ```
	 * reverseOrder 内容（content.ts）会根据 tag.multineg 及座次选择方向，然后
	 * `evt.targets.sortBySeat(...)` 后 `reverse()` 调整顺序。
	  * @since 1.11.5
	 */
	reverseOrder?: boolean;
	/**
	 * 目标忽略（已选中目标后在结算阶段跳过它）
	 *
	 * 返回 true 时，该已选目标在 useCard 结算中被跳过，触发 useCardToIgnored（空事件）而非正常结算。
	 * 注意：与 deadTarget / includeOut 的"提前禁选"不同，ignoreTarget 是**已选中**后在结算阶段跳过，
	 * 通常用于该目标因状态变化不再应受牌影响的场景（如【无懈可击】、国战部分牌）。
	 *
	 * 消费逻辑：content.ts 的 useCard 结算（apps/core/noname/library/element/content.ts）
	 * ```js
	 * if (targets[num] && info.ignoreTarget && info.ignoreTarget(event.card, player, targets[num])) {
	 * 	const next = game.createEvent("useCardToIgnored", false);
	 * 	next.setContent("emptyEvent");   // 空事件，跳过该目标结算
	 *  …
	 * }
	 * ```
	 *
	 * @param card 卡牌
	 * @param player 使用者
	 * @param target 目标
	 * @returns 是否忽略该目标
	  * @since 1.11.5
	 */
	ignoreTarget?: (card: Card, player: Player, target: Player) => boolean;
	/**
	 * 是否为多目标一次性结算 + 借刀类指示线 + 禁止该牌「额外指定目标」
	 *
	 * 备注：如【南蛮入侵】【万箭齐发】等多目标牌，其content内容只针对一个目标，将对所有目标逐次使用content逻辑。
	 * 如果multitarget为true，则所有目标共同且同时使用content。
	 * 
	 * 同时影响连线动画（multitarget 时目标对下一个目标连线 `player.line2(targets)`，否则从来源向所有目标连指示线）。
	 * 
	 * REVIEW: 此外，设计上不允许该牌「额外指定目标」(因很多能额外指定目标的技能会排除该字段为true的卡牌)，这可能是因为multitarget为true的卡牌content通常同时针对所有目标，如果有额外指定目标可能有预期之外的bug。
	 * 但我觉得没什么必要，这有可能是遗留问题。有可能是【借刀杀人】改成addedTarget机制后遗留的问题。
	 * 
	 * @example
	 * - true：所有目标一同结算（content 中 event.targets 为全部目标，各目标共用同一份结算数据）；
	 * - false/void：按目标逐一结算（content.ts 中通过 `event.num++ / event.redo()` 依次处理每个目标）。
	 *
	 * 消费逻辑（content.ts 的 useCard 结算）：
	 * ```js
	 * next.multitarget = info.multitarget;      // 传给 useCardToTarget 事件
	 * if (!get.info(event.card, false).multitarget && num < targets.length - 1) {
	 * 	event.num++;
	 * 	event.redo();                            // 逐一结算
	 * }
	 * ```
	  * @since 1.11.5
	 */
	multitarget?: boolean;
	/**
	 * 是否强制结算到底（即便使用者/装备者死亡也继续）
	 *
	 * 在卡牌结算的多个环节，卡牌的 `forceDie` 会被读取并转写为结算事件的 `event.forceDie` 标记，
	 * 使结算在相关角色死亡的情况下依然继续，而不是被打断。
	 *
	 * 消费逻辑之一（content.ts 的装备失去流程，`info = get.info(VEquip, false)`）：
	 * ```js
	 * // 装备者已死亡时，默认不弹装备名、不延迟；forceDie 为 true 则照常
	 * if (info.loseDelay != false && (player.isAlive() || info.forceDie)) {
	 * 	player.popup(VEquip.name);
	 * 	game.delayx();
	 * }
	 * ...
	 * if (info.forceDie) { next.forceDie = true; }   // 转写到 lose_ 事件
	 * ```
	 *
	 * 消费逻辑之二（content.ts 的 useCardToTarget，`info = get.info(event.skill)`，技能侧同名）：
	 * ```js
	 * if (info.forceDie) { next.forceDie = true; }
	 * ```
	 *
	 * 注意区分：这里指的是**卡牌/技能 info 上的 forceDie 配置**；而 `event.forceDie` 是结算事件自身的
	 * 强制继续标记（由 useCard 默认置 true，受 noForceDie 控制）。二者机制相同——都是"死亡也照常结算"。
	  * @since 1.11.5
	 */
	forceDie?: boolean;
	/**
	 * 出牌/使用时不强制结算到底（默认 false，即默认强制结算）
	 *
	 * useCard 流程默认会把结算事件的 `event.forceDie` 置 true（强制结算到底，使用者死亡也不打断）。
	 * `noForceDie` 为 true 时**跳过这一设置**，使该牌结算允许因使用者死亡等条件被打断。
	 *
	 * 消费逻辑（content.ts 的 useCard）：
	 * ```js
	 * if (!get.info(event.card, false).noForceDie) {
	 * 	event.forceDie = true;   // 默认强制结算到底
	 * }
	 * event._playCardAnimation = () => { ... };
	 * ```
	 * 后续 useCardToTarget 中：
	 * ```js
	 * if (event.forceDie) { next.forceDie = true; }   // 标记继续向目标事件传递
	 * ```
	 *
	 * 语义上 `noForceDie` 与 `forceDie` 相对：`forceDie` 主动要求强制结算，`noForceDie` 主动解除默认强制。
	  * @since 1.11.5
	 */
	noForceDie?: boolean;

	// ===== 效果 =====
	/**
	 * 卡牌构建完成后的执行
	 *
	 * 在 Card 元素构建（$init）末尾调用，用于在卡牌实例创建后执行自定义初始化逻辑。
	 *
	 * 消费逻辑：card.js 的 Card.$init（apps/core/noname/library/element/card.js）
	 * ```js
	 * if (typeof info.init == "function") {
	 * 	info.init();   // 无参数调用
	 * }
	 * if (vanish) {
	 * 	delete lib.card[card[2]];   // 若 vcard 标记为 vanish，构建后从卡池移除
	 * }
	 * ```
	  * @since 1.11.5
	 */
	init?: () => void;
	/**
	 * 使用前内容（在 content 之前执行）
	 *
	 * 在 content.ts 中创建 `${card.name}ContentBefore` 事件，
	 * 通过 next.setContent(info.contentBefore) 设置，type 为 "precard"。
	 * 也支持数组形式（依次执行多个内容函数，与 content 一致）。
	 *
	 * 消费逻辑（content.ts 的 useCard）：
	 * ```js
	 * if (info.contentBefore) {
	 * 	const next = game.createEvent(`${event.card.name}ContentBefore`);
	 * 	next.setContent(info.contentBefore);
	 * 	next.targets = targets;
	 * 	next.card = event.card;
	 * 	next.cards = cards;
	 * 	next.type = "precard";   // 前置事件标记
	 * 	await next;
	 * }
	 * ```
	  * @since 1.11.5
	 */
	contentBefore?: ContentFuncByAll | OldContentFuncByAll | (ContentFuncByAll | OldContentFuncByAll)[];
	/**
	 * 卡牌使用效果（使用卡牌后执行的内容）
	 *
	 * 在 content.ts 的 useCard 结算中，创建卡牌名称同名的事件并 `next.setContent(info.content)` 执行。
	 * 支持两种形态：
	 * - **function**：`(event, trigger, player) => Promise<any>`，异步内容函数；
	 * - **数组**：依次执行多个内容函数（与 SkillInfo.content 一致）。
	 *
	 * 消费逻辑（content.ts）：
	 * ```js
	 * const next = game.createEvent(event.card.name);
	 * next.setContent(info.content);
	 * next.card = event.card;
	 * next.cards = cards;
	 * next.targets = targets;
	 * await next;
	 * ```
	  * @since 1.11.5
	 */
	content?: ContentFuncByAll | OldContentFuncByAll | (ContentFuncByAll | OldContentFuncByAll)[];
	/**
	 * 使用后内容（在 content 之后执行）
	 *
	 * 在 content.ts 中创建 `${card.name}ContentAfter` 事件，
	 * 通过 next.setContent(info.contentAfter) 设置。
	 * 也支持数组形式（依次执行多个内容函数，与 content 一致）。
	 *
	 * 消费逻辑（content.ts 的 useCard 结算结束分支）：
	 * ```js
	 * if (get.info(event.card, false).contentAfter) {
	 * 	const next = game.createEvent(`${event.card.name}ContentAfter`);
	 * 	next.setContent(get.info(event.card, false).contentAfter);
	 * 	next.targets = targets;
	 * 	next.card = event.card;
	 * 	next.cards = event.cards;
	 * }
	 * ```
	  * @since 1.11.5
	 */
	contentAfter?: ContentFuncByAll | OldContentFuncByAll | (ContentFuncByAll | OldContentFuncByAll)[];
	/**
	 * 效果结算次数
	 *
	 * 该牌的效果一共需要结算的次数，默认 1。useCard 事件初始化时从卡牌 info 读取，
	 * 并与实际已结算次数 `event.effectedCount` 比较，不足则继续循环结算。
	 *
	 * 消费逻辑：content.ts 的 useCard（apps/core/noname/library/element/content.ts）
	 * ```js
	 * // 初始化（默认 1）
	 * if (typeof event.effectCount != "number") {
	 * 	event.effectCount = get.info(event.card, false).effectCount || 1;
	 * }
	 * event.effectedCount = 0;
	 * ...
	 * // 结算循环：未达到次数则继续
	 * if (event.effectedCount < event.effectCount) {
	 * 	if (document.getElementsByClassName("thrown").length) { ... }
	 * 	event.redo();
	 * 	return;
	 * }
	 * ```
	 * 该值可被技能动态累加（skill.js 的"额外结算"类技能）：
	 * ```js
	 * content(event, trigger, player) {
	 * 	trigger.effectCount += num;   // 增加额外结算次数
	 * }
	 * ```
	  * @since 1.11.5
	 */
	effectCount?: number;
	/**
	 * 当做 xx 牌使用（自动视为另一种牌）
	 *
	 * 标记该牌在使用/计算时可自动视为另一种牌（值为目标牌的 name），
	 * 由 get.autoViewAs()（apps/core/noname/get/index.js）消费。
	 *
	 * 消费逻辑（get.autoViewAs / get._autoViewAs）：
	 * ```js
	 * _autoViewAs(card, cards) {
	 * 	const info = get.info(card);
	 * 	if (info.autoViewAs) {
	 * 		return { name: info.autoViewAs, cards: (cards?.slice(0)) || [card], suit: card.suit, number: card.number };
	 * 	}
	 * }
	 * ```
	  * @since 1.11.5
	 */
	autoViewAs?: string;
	/**
	 * 根据传入数量生成【影】牌(diy)
	 *
	 * 生成指定数量的【影】标记牌并返回数组。注意：`getYing` **不属于通用卡牌配置字段**，
	 * 仅在 `ying` 这张特殊标记牌上定义（jsrg/card.js），由涉及【影】的武将技能消费。
	 *
	 * 定义（jsrg/card.js）：
	 * ```js
	 * ying: {
	 * 	destroy: "discardPile",
	 * 	getYing(count) {
	 * 		var cards = [];
	 * 		if (typeof count != "number") count = 1;   // 非数字默认生成 1 张
	 * 		while (count--) {
	 * 			let card = game.createCard("ying", "spade", 1);
	 * 			cards.push(card);
	 * 		}
	 * 		return cards;
	 * 	},
	 * }
	 * ```
	 * 消费逻辑（武将技能，如 offline_chunqiu.js / jsrg/skill.js）：
	 * ```js
	 * await player.gain(lib.card.ying.getYing(1), "gain2");   // 生成 1 张【影】加入手牌
	 * ```
	 *
	 * @param count 要生成的【影】数量（非数字时默认 1）
	 * @returns 生成的【影】卡牌数组
	  * @since 1.11.5
	 */
	getYing?: (count: number) => Card[];
	/**
	 * 默认应变效果
	 *
	 * 标记该牌在"应变"模式下未触发任何主动应变效果时的**默认应变效果标识**。
	 * 取值为 `lib.yingbian.effect` 表中的键（如 "add"、"draw"、"remove"、"hit"），
	 * 或 null 表示无默认应变。
	 *
	 * 消费逻辑一：get.defaultYingbianEffect()（apps/core/noname/get/index.js）
	 * ```js
	 * defaultYingbianEffect(card) {
	 * 	const info = get.info(card);
	 * 	return (info && info.defaultYingbianEffect) || null;
	 * }
	 * ```
	 *
	 * 消费逻辑二：yingbian.js 的应变触发（使用牌时，若无主动应变效果则用默认值）
	 * ```js
	 * if (!yingbianEffectExecuted) {
	 * 	const defaultYingbianEffect = get.defaultYingbianEffect(card);
	 * 	if (lib.yingbian.effect.has(defaultYingbianEffect)) {
	 * 		game.yingbianEffect(trigger, lib.yingbian.effect.get(defaultYingbianEffect));
	 * 		yingbianEffectExecuted = true;
	 * 	}
	 * }
	 * ```
	 * 参考：standard.js 中【雷杀】"add"、【闪】"draw"、【南蛮入侵】"remove"、【决斗】"hit"。
	  * @since 1.11.5
	 */
	defaultYingbianEffect?: "add" | "draw" | "remove" | "hit" | string | null;
	/**
	 * 宛城之战特殊效果(diy)
	 *
	 * 卡牌配置字段，jueying 等卡牌在特定模式（如斗地主）下的特殊处理函数，返回布尔值表示是否生效。
	 *
	 * 消费逻辑：standard.js【绝影】的 skill filter 中
	 * ```js
	 * filter(event, player) {
	 * 	return lib.card.jueying.battleOfWancheng() && player.hasCard(...);
	 * }
	 * ```
	 * 实现（standard.js）：
	 * ```js
	 * battleOfWancheng() {
	 * 	if (get.mode() !== "doudizhu") return false;
	 * 	const date = new Date();
	 * 	if (date.getMonth() !== 6) { ... }
	 * }
	 * ```
	 *
	 * @returns 该卡的特殊效果在当前模式/时间下是否生效
	  * @since 1.11.5
	 */
	battleOfWancheng?: () => boolean;

	// ===== 牌的去向及触发 =====
	/**
	 * 使用后是否弃置(unuseful)
	 * 
	 * REVIEW: 实际上应该是技能Skill的字段，仅炉石传说【传送门】使用该字段，但实际上不弃牌的功能是靠content完成的。因此事实上并没有卡牌使用此字段，引擎里也没任何消费点。
	 * TODO: 建议【传送门】的discard字段改为ai的nodiscard字段。
	 * @since 1.11.5
	*/
	discard?: boolean;
	/**
	 * 洗牌时销毁（标记该牌不进入正常牌堆流转）
	 *
	 * 配置了 `vanish: true` 的牌在洗牌时会从弃牌堆中被移除，不进入牌堆参与后续摸牌/洗牌，
	 * 常用于一次性/瞬效/标识类牌（不应进入正常游戏流程流转的牌）。
	 *
	 * 消费逻辑：game/index.js 的 shuffle（洗牌时遍历弃牌堆）
	 * ```js
	 * currentcard.vanishtag.length = 0;
	 * currentcard.clearKnowers();
	 * if (get.info(currentcard).vanish || currentcard.storage.vanish) {
	 * 	currentcard.remove();     // 从弃牌堆移除，不进入牌堆
	 * 	continue;
	 * }
	 * cards.push(currentcard);
	 * ```
	 *
	 * 注意区分 `storage.vanish`（运行时标记，非卡牌配置）：
	 * - `game.createCard()` 创建的牌默认 `card.storage.vanish = true`（临时牌，如手牌移动产生的过渡牌）；
	 * - `game.createCard2()` 会 `delete card.storage.vanish`（正式牌，不消失）。
	 * 而本字段 `info.vanish` 是卡牌配置，与 `storage.vanish` 效果相同但来源不同。
	  * @since 1.11.5
	 */
	vanish?: boolean;
	/**
	 * 销毁条件/技能（决定卡牌何时被销毁/移除）
	 *
	 * 在 card.js 初始化时 `if (info.destroy && typeof info.destroy != "boolean" && !lib.skill[info.destroy])`，
	 * 即非布尔、且非技能名时，把该值直接赋给 `card.destroyed`。
	 * 销毁判定统一走 card.js 的 `willBeDestroyed(targetPosition, player, event)`：
	 * - **function**：`destroyed(this, targetPosition, player, event)`，返回是否销毁（bool）；
	 * - **string（技能名，`lib.skill[destroyed]` 存在）**：持有该技能的玩家触碰时销毁——
	 *   玩家持有该技能则返回 false（不销毁），否则返回 true；
	 * - **string（区域标记）**：`destroyed == targetPosition`，仅当卡牌落入该区域（如 "lose"、"discard"）时销毁；
	 * - **boolean**：原样返回。
	 *
	 * 消费逻辑（card.js 的 willBeDestroyed）：
	 * ```js
	 * willBeDestroyed(targetPosition, player, event) {
	 * 	const destroyed = this.destroyed;
	 * 	if (typeof destroyed == "function") return destroyed(this, targetPosition, player, event);
	 * 	else if (lib.skill[destroyed]) {
	 * 		if (player && player.hasSkill(destroyed)) { delete this.destroyed; return false; }
	 * 		return true;
	 * 	} else if (typeof destroyed == "string") return destroyed == targetPosition;
	 * 	return destroyed;
	 * }
	 * ```
	 *
	 * @param card 卡牌
	 * @param targetPosition 目标位置/区域标识，可能值：`"cardPile"`（牌堆）、`"discardPile"`（弃牌堆）、`"equip"`（装备区）、`"handcard"`（手牌区）、`"judge"`（判定区）、`"ordering"`（处理区/使用牌）、`"renku"`（仁库）、`"special"`（特殊区）、`"expansion"`（扩展区/神势）、或 `event.position.id`（lose 事件动态位置 ID）
	 * @param player 相关玩家，可能为 null
	 * @param event 触发事件
	 * @returns 返回 truthy 值允许销毁（进入 selfDestroy 流程，触发 onDestroy/destroyLog）；返回 falsy 则走 info.destroy 直接 delete() 的分支
	  * @since 1.11.5
	 */
	destroy?: boolean | string | ((card: Card, targetPosition: string, player: Player, event: GameEvent) => boolean | void);
	/**
	 * 卡牌销毁后触发
	 *
	 * 当卡牌被销毁（selfDestroy）时，在完成 `fix()`/`delete()` 之后调用，用于销毁后的收尾逻辑。
	 *
	 * 消费逻辑：card.js 的 selfDestroy（apps/core/noname/library/element/card.js）
	 * ```js
	 * selfDestroy(event) {
	 * 	if (this._selfDestroyed) return;
	 * 	this._selfDestroyed = true;
	 * 	this.fix();
	 * 	this.delete();                       // 先删除
	 * 	const info = get.info(this, false);
	 * 	if (!info) return;
	 * 	if ((!("destroyLog" in this) || this.destroyLog !== false) && info.destroyLog !== false) {
	 * 		game.log(this, "被销毁了");
	 * 	}
	 * 	if (info.onDestroy) {
	 * 		info.onDestroy(this, event);      // 销毁后回调
	 * 	}
	 * }
	 * ```
	 *
	 * @param card 被销毁的卡牌
	 * @param event 触发销毁的事件
	  * @since 1.11.5
	 */
	onDestroy?: (card: Card, event: GameEvent) => void;
	/**
	 * 是否记录销毁日志（"被销毁了"）
	 *
	 * 默认为 true。该判断同时检查两处：卡牌实例属性 `card.destroyLog` 与卡牌配置 `info.destroyLog`，
	 * 任一显式为 false 即不记录日志。
	 *
	 * 消费逻辑：card.js 的 selfDestroy（apps/core/noname/library/element/card.js）
	 * ```js
	 * if ((!("destroyLog" in this) || this.destroyLog !== false) && info.destroyLog !== false) {
	 * 	game.log(this, "被销毁了");
	 * }
	 * ```
	  * @since 1.11.5
	 */
	destroyLog?: boolean;

	// ===== 装备牌 =====
	/**
	 * 不能被改造(diy)
	 *
	 * 为 true 时该装备不允许被「改造」机制处理（与 nopower 一同配置在 boss 装备等特殊装备上，
	 * 参考 extra.js、guozhan.js、xianxia.js 等大量装备牌）。
	 *
	 * 注意：核心引擎 `apps/core/noname` 与 `apps/core/extension` 中均未检索到该字段的消费点，
	 * 属约定俗成的标记字段（由使用「改造」机制的模式/玩法内容按需读取）。
	  * @since 1.11.5
	 */
	nomod?: boolean;
	/**
	 * 不能被强化(diy)
	 *
	 * 为 true 时该装备不允许被「强化」机制处理（与 nomod 一同配置在 boss 装备等特殊装备上）。
	 *
	 * 注意：核心引擎 `apps/core/noname` 与 `apps/core/extension` 中均未检索到该字段的消费点，
	 * 属约定俗成的标记字段（由使用「强化」机制的模式/玩法内容按需读取）。
	  * @since 1.11.5
	 */
	nopower?: boolean;
	/**
	 * 不算作进攻坐骑或防御坐骑(unused)
	 *
	 * 通常用于equip6，即使有distance.globalFrom或distance.globalTo，也不算作坐骑。
	 * 实际上并没有卡牌使用此字段。
	 * 
	 * 引擎在 `get.is.attackingMount` / `get.is.defendingMount` 中消费（apps/core/noname/get/is.js）：
	 * ```js
	 *attackingMount(card, player) {
	 *	const subtype = get.subtype(card, player);
	 *	if (subtype == "equip4") {
	 *		return true;
	 *	} else if (subtype == "equip6") {
	 *		const subtypes = get.subtypes(card, player);
	 *		if (subtypes.includes("equip4")) {
	 *			return true;
	 *		}
	 *		const info = get.info(card, player),
	 *			distance = info.distance;
	 *		if (!distance) {
	 *			return false;
	 *		}
	 *		if (distance.globalFrom && !info.notMount) {
	 *			return true;
	 *		}
	 *	}
	 *	return false;
	 *}
	 * ```
	  * @since 1.11.5
	 */
	notMount?: boolean;
	/**
	 * 执行onEquip / prepareEquip 的前提
	 *
	 * 返回 true 时才触发 onEquip / prepareEquip；未配置时只要存在 onEquip / prepareEquip 即触发。
	 *
	 * 消费逻辑：content.ts 的 equip 流程（apps/core/noname/library/element/content.ts）
	 * ```js
	 * // 穿戴后
	 * if (cardInfo.onEquip && (!cardInfo.filterEquip || cardInfo.filterEquip(card, player))) { ... }
	 * // 穿戴前（prepareEquip）
	 * if (cardInfo.prepareEquip && (!cardInfo.filterEquip || cardInfo.filterEquip(event.card, player))) { ... }
	 * ```
	 *
	 * @param card 待穿戴的装备牌
	 * @param player 装备者
	 * @returns 是否触发穿戴逻辑
	  * @since 1.11.5
	 */
	filterEquip?: (card: Card, player: Player) => boolean;
	/**
	 * 穿戴装备牌前执行的内容（prepareEquip）
	 *
	 * 在装备真正被穿戴前触发，用于装备前的准备/条件处理；
	 * 满足 filterEquip（或未配置）时，创建 `prepare_${card.name}` 事件执行。
	 *
	 * 消费逻辑：content.ts 的 equip 流程（apps/core/noname/library/element/content.ts）
	 * ```js
	 * if (cardInfo.prepareEquip && (!cardInfo.filterEquip || cardInfo.filterEquip(event.card, player))) {
	 * 	const next = game.createEvent(`prepare_${event.card.name}`);
	 * 	next.setContent(cardInfo.prepareEquip);
	 * 	next.player = player;
	 * 	next.card = event.card;
	 * }
	 * ```
	  * @since 1.11.5
	 */
	prepareEquip?: ContentFuncByAll | OldContentFuncByAll;
	/**
	 * 穿戴装备牌时执行的内容（支持数组形式多个执行）
	 *
	 * 满足 filterEquip（或未配置）时，创建 `equip_${card.name}` 事件执行。
	 * 支持**数组形式**依次执行多个内容函数。
	 *
	 * 消费逻辑：content.ts 的 equip 流程
	 * ```js
	 * if (cardInfo.onEquip && (!cardInfo.filterEquip || cardInfo.filterEquip(card, player))) {
	 * 	if (Array.isArray(cardInfo.onEquip)) {
	 * 		for (const onEquip of cardInfo.onEquip) {
	 * 			const next = game.createEvent(`equip_${card.name}`);
	 * 			next.setContent(onEquip);
	 * 			next.player = player;
	 * 			next.card = event.vcards[0];
	 * 			await next;
	 * 		}
	 * 	} else {
	 * 		const next = game.createEvent(`equip_${card.name}`);
	 * 		next.setContent(cardInfo.onEquip);
	 * 		...
	 * 	}
	 * }
	 * ```
	  * @since 1.11.5
	 */
	onEquip?: ContentFuncByAll | OldContentFuncByAll | (ContentFuncByAll | OldContentFuncByAll)[];
	/**
	 * 执行 onLose 的前提
	 *
	 * 返回 true 时才触发 onLose；未配置时只要存在 onLose 即触发。
	 *
	 * 消费逻辑（与 onLose 同一失去装备流程）：
	 * 入口：player.lose(params)（apps/core/noname/library/element/player.js）→ next.setContent("lose")；
	 * 事件内容：lib.element.content.lose（apps/core/noname/library/element/content.ts 的 Content.lose）；
	 * filterLose 判断位于 Content.lose 第 4 步（content.ts 失去装备分步处理）。
	 * ```js
	 * // Content.lose 第 4 步
	 * if (info.onLose && (!info.filterLose || info.filterLose(VEquip, player))) {
	 * 	event.goto(3);           // 进入执行 onLose 的分支
	 * 	event.currentVEquip = VEquip;
	 * 	return;
	 * }
	 * ```
	 *
	 * @param VEquip 被移除装备的虚拟牌
	 * @param player 失去装备的玩家
	 * @returns 是否触发 onLose
	  * @since 1.11.5
	 */
	filterLose?: (VEquip: Card, player: Player) => boolean | void;
	/**
	 * 失去装备时执行的内容（支持数组形式多个触发）
	 *
	 * 满足 filterLose（或未配置）时，创建 `lose_${VEquip.name}` 事件执行。
	 * 支持**数组形式**依次执行多个内容函数（与 onEquip 一致）。
	 *
	 * 消费逻辑（失去装备流程）：
	 * 入口：player.lose(params)（apps/core/noname/library/element/player.js）→ next.setContent("lose")；
	 * 事件内容：lib.element.content.lose（apps/core/noname/library/element/content.ts 的 Content.lose）；
	 * onLose/filterLose 判断与触发位于 Content.lose 第 4 步（content.ts 失去装备分步处理），
	 * 实际执行 onLose 位于 Content.lose 第 5 步（event.goto(3) 目标）。
	 * ```js
	 * // Content.lose 第 4 步：判断是否触发 onLose
	 * if (info.onLose && (!info.filterLose || info.filterLose(VEquip, player))) {
	 * 	event.goto(3);
	 * 	event.currentVEquip = VEquip;
	 * 	return;
	 * }
	 * // Content.lose 第 5 步：创建事件执行 onLose
	 * if (Array.isArray(info.onLose)) {
	 * 	for (const onLose of info.onLose) {
	 * 		const next = game.createEvent(`lose_${VEquip.name}`);
	 * 		next.setContent(onLose);
	 * 		if (info.forceDie) next.forceDie = true;
	 * 		next.player = player;
	 * 		next.card = VEquip;
	 * 		next.cards = VEquip.cards;
	 * 	}
	 * } else { ... }
	 * ```
	 * 典型用途：木牛流马（extra.js）配合 onLose 在失去装备时掉落其储存的牌。
	  * @since 1.11.5
	 */
	onLose?: ContentFuncByAll | OldContentFuncByAll | (ContentFuncByAll | OldContentFuncByAll)[];
	/**
	 * 移除装备时以事件执行 onLose
	 *
	 * TODO：似乎onLose修改成事件后，出现重复执行onLose的情况，这算是Bug吧。
	 * 
	 * 角色移除某装备时，会调用 `player.removeEquipTrigger()` 注销该装备挂载的触发器/技能；
	 * 若 `clearLose` 为 true，则会**额外**创建 `lose_${card.name}` 事件执行该装备的 `onLose`，
	 * 用于清理装备被移除时需处理的后续效果。
	 *
	 * 例：木牛流马（extra.js）配合 `onLose` 在失去装备时掉落其储存的牌。
	 *
	 * 逻辑：player.js 的 removeEquipTrigger()（apps/core/noname/library/element/player.js）
	 * ```js
	 * if (info.clearLose && typeof info.onLose == "function") {
	 * 	var next = game.createEvent("lose_" + card.name);
	 * 	next.setContent(info.onLose);
	 * 	next.player = this;
	 * 	next.card = card;
	 * }
	 * ```
	  * @since 1.11.5
	 */
	clearLose?: boolean;
	/**
	 * 自定义装备替换逻辑（决定穿戴新装备时顶掉哪些旧装备）
	 *
	 * 存在该字段的装备（specializedVCards）走自定义替换路径：以 `customSwap(card)` 作为
	 * `player.getVCards("e", ...)` 的过滤条件，从已装备的牌中选出需要被替换的牌。
	 * 返回 true 表示全部替换，或返回真值筛选出需替换的卡牌。
	 *
	 * 消费逻辑：content.ts 的 replaceEquip（apps/core/noname/library/element/content.ts）
	 * ```js
	 * const info = get.info(card, false);
	 * (info?.customSwap ? specializedVCards : normalVCards).push(card);
	 * ...
	 * specializedVCards.forEach(card => {
	 * 	const info = get.info(card, false);
	 * 	replacedCards.addArray(player.getVCards("e", card => info.customSwap(card)));
	 * });
	 * ```
	 *
	 * @param card 待评估的旧装备卡牌（getVCards 逐张传入）
	 * @returns 是否替换该旧装备（真值即替换），或返回可被 getVCards 接受的过滤结果
	  * @since 1.11.5
	 */
	customSwap?: (card: Card) => boolean | Card[];
	/**
	 * 兵主（绑定该装备所属的武将名）
	 *
	 * 标记该牌归属的武将名数组（如 `["曹操"]`、`["诸葛亮", "黄月英"]`），
	 * 与 `derivation`（衍生武将）一同构成「兵主」检索依据。
	 *
	 * 消费逻辑：get.bingzhu()（apps/core/noname/get/index.js）
	 * ```js
	 * bingzhu(name) {
	 * 	const list = [];
	 * 	if (lib.cardBingzhu[name]) list.addArray(lib.cardBingzhu[name]);
	 * 	if (info.derivation) list.addArray(get.characterSurname(info.derivation).map(l => l.join("")));
	 * 	if (info.bingzhu) list.addArray(info.bingzhu);
	 * 	return list.filter(surname => surname !== "某");
	 * }
	 * ```
	 * 参考：standard.js 各武器/防具均配置了 bingzhu。
	  * @since 1.11.5
	 */
	bingzhu?: string[];

	// ===== 延时锦囊 =====
	/**
	 * 是否允许同名延时锦囊牌重复放置
	 *
	 * 为 false/默认时，同一名延时锦囊不能重复贴在同一玩家的判定区；
	 * 为 true 时允许同名多张并存。
	 *
	 * 消费逻辑：player.js 的 canAddJudge()（apps/core/noname/library/element/player.js）
	 * ```js
	 * if (!cardInfo.allowDuplicate && this.hasJudge(name)) {
	 * 	return false;
	 * }
	 * ```
	  * @since 1.11.5
	 */
	allowDuplicate?: boolean;
	/**
	 * 判定牌槽位/判定区占位名
	 *
	 * 标记该延时锦囊除了自身牌名外，还占用的判定槽位名（字符串或字符串数组）。
	 * 用于判定区占位判定（hasJudge）与同名/槽位冲突检测，避免判定区被同类牌重复占位。
	 *
	 * 消费逻辑：get.judgeSlots()（apps/core/noname/get/index.js）
	 * ```js
	 * const list = [name];                          // 默认至少占自己牌名
	 * if (lib.card[name].judgeSlots) {
	 * 	const judgeSlots = get.copy(lib.card[name].judgeSlots);
	 * 	list.addArray(Array.isArray(judgeSlots) ? judgeSlots : [judgeSlots]);
	 * }
	 * return list;
	 * ```
	 * 再由 player.hasJudge() 依据槽位是否被占用判断能否再贴该牌。
	  * @since 1.11.5
	 */
	judgeSlots?: string | string[];
	/**
	 * 判定函数（延时锦囊牌用）
	 *
	 * 用于自定义判定结果：接收判定结果对象（含 `result.card` 判定牌、`result.suit`/`result.number` 等），
	 * 返回一个数值：
	 * - 正数：判定结果为真（result.bool = true）；
	 * - 负数：判定结果为假（result.bool = false）；
	 * - 0：中性（result.bool = null）。
	 *
	 * 消费逻辑：player.judge() 通过 get.judge(card) 取得本字段后，
	 * 在 content.ts 的 judge 结算中调用 `event.result.judge = event.judge(event.result)`。
	 * 参考【乐不思蜀】【闪电】（standard.js）：`judge(card) { if (get.suit(card) === "heart") return 1; return -2; }`
	 *
	 * 判定结果计算（content.ts）：
	 * ```js
	 * event.result.judge = event.judge(event.result);
	 * if (event.result.judge > 0) event.result.bool = true;
	 * else if (event.result.judge < 0) event.result.bool = false;
	 * else event.result.bool = null;
	 * ```
	 *
	 * @param result 判定结果对象（含判定牌 card、花色/点数等信息）
	 * @returns 正数/负数/0，分别对应判定真/假/中性
	  * @since 1.11.5
	 */
	judge?: (result: Partial<Result>) => number;
	/**
	 * 判定结果回调（延时锦囊牌判定后触发）
	 *
	 * 接收判定结果对象（含 `result.bool`），返回布尔值用于判定动画（tryJudgeAnimate）；
	 * 未配置时为 undefined。
	 *
	 * 消费逻辑：get.judge2()（apps/core/noname/get/index.js）
	 * ```js
	 * judge2(card) { return card.viewAs ? lib.card[card.viewAs].judge2 : get.info(card).judge2; }
	 * ```
	 * content.ts 的 judge 结算中调用：
	 * ```js
	 * if (event.judge2) {
	 * 	const judge2 = event.judge2(event.result);
	 * 	if (typeof judge2 == "boolean") player.tryJudgeAnimate(judge2);
	 * }
	 * ```
	 * 参考【闪电】（standard.js）：`judge2(result) { return result.bool === false ? true : false; }`
	 *
	 * @param result 判定结果对象（含 bool）
	 * @returns 是否触发判定成功/失败的动画
	  * @since 1.11.5
	 */
	judge2?: (result: Partial<Result>) => boolean | void;
	/**
	 * 延时锦囊牌的判定阶段效果（替代默认判定流程）
	 *
	 * 判定完成后执行该延时锦囊的实际效果，通过 `next.setContent(info.effect)` 创建 `${card.name}` 事件执行。
	 * 事件字段含 `next._result`（判定结果对象，含 `_result.bool`），卡牌侧用 `result.bool` 判断是否结算效果。
	 *
	 * 若该牌未配置 effect，则判定阶段会 `event.redo()` 重复流程（视为无效果）；
	 * 若配置了 effect 但未配置 judge，则跳过判定（`event.nojudge = true`）直接执行效果。
	 *
	 * 消费逻辑（content.ts 的 phaseJudge）：
	 * ```js
	 * if (!cardInfo.effect) { await game.delay(); event.redo(); }   // 无 effect -> 重判
	 * else if (!cardInfo.judge) { await game.delay(); event.nojudge = true; } // 有 effect 无 judge -> 跳过判定
	 * ...
	 * const next = game.createEvent(name);
	 * next.setContent(lib.card[name].effect);
	 * next._result = event.result;   // 判定结果注入
	 * ```
	 *
	 * 实际签名多一个 `result` 参数：`(event, trigger, player, result) => Promise<void>`，
	 * 其中 `result` 为判定结果（含 `result.bool`），如乐不思蜀/闪电的 effect 用它判断是否结算。
	  * @since 1.11.5
	 */
	effect?: ContentFuncByAll | OldContentFuncByAll;
	/**
	 * 延时锦囊牌仅占位（不判定、无效果）
	 *
	 * 为 true 时该牌仅作为判定区占位，判定阶段会直接跳过它。
	 *
	 * 消费逻辑：content.ts 的 phaseJudge（apps/core/noname/library/element/content.ts）
	 * ```js
	 * if (cardInfo.noEffect || !player.getCards("j").includes(event.card)) {
	 * 	event.redo();   // 跳过该牌
	 * }
	 * ```
	  * @since 1.11.5
	 */
	noEffect?: boolean;
	/**
	 * 取消判定时执行 / 是否不参与天灾随机抽牌（延时锦囊专用，双重语义）
	 *
	 * REVIEW: 是否需要拆分这两种逻辑？
	 * 
	 * 存在两种消费方式：
	 *
	 * 1. **布尔（天灾过滤）**：player.js 的 getDebuff（天灾/随机负面效果）中，
	 *    通过 `info.type == "delay" && !info.cancel` 过滤——cancel 为真（含函数）时该延时锦囊
	 *    不会被随机抽中并置入判定区（典型用途：排除【闪电】等不希望被天灾机制二次插入的牌）。
	 *    ```js
	 *    if (info.type == "delay" && !info.cancel && !this.hasJudge(lib.inpile[i])) {
	 *    	list.push(lib.inpile[i]);
	 *    }
	 *    ```
	 *
	 * 2. **函数（取消回调）**：判定被取消（event.cancelled 且非 direct）时执行该函数，
	 *    创建 `${card.name}Cancel` 事件执行，常用于把被取消的延时牌转移/回收。参考【闪电】：
	 *    ```js
	 *    // content.ts
	 *    if (event.cancelled && !event.direct) {
	 *    	const cardCancel = lib.card[cardName].cancel;
	 *    	if (cardCancel) {
	 *    		const next = game.createEvent(`${cardName}Cancel`);
	 *    		next.setContent(cardCancel); ...
	 *    	}
	 *    }
	 *    // standard.js【闪电】
	 *    async cancel(event, trigger, player) { player.addJudgeNext(event.card); }
	 *    ```
	 *
	 * 注意：函数形态同样为 truthy，会被天灾过滤排除，配置时需留意双重效果。
	  * @since 1.11.5
	 */
	cancel?: boolean | ((event: GameEvent, trigger: GameEvent, player: Player) => any);

	// ===== AI =====
	/**
	 * AI 评估配置
	 *
	 * 该牌在 AI 决策时使用的评估数据（见 CardAI 接口）：
	 * - order：出牌优先度（越高越优先）；
	 * - value：使用收益评估；
	 * - useful：回合外留牌价值；
	 * - equipValue：装备价值；
	 * - basic：外层字段的别名容器（order/value/useful/equipValue）；
	 * - result：使用/选择目标时的收益预估（player/target/player_use/target_use/keepAI/ignoreStatus）；
	 * 
	 * - expose：身份暴露度（身份/国战模式）；
	 * - canLink：属性伤害连环传导的 AI 处理；
	 * - wuxie：是否对该牌使用无懈的 AI 决策；
	 * - yingbian：应变效果评估；
	 * - button：chooseButton 的按钮评分；
	 * - tag：卡牌标签（见 CardTag）。
	 *
	 * 消费逻辑：get/index.js 中大量以 `info.ai.xxx` 读取（get.order / get.value / get.useful / get.equipValue 等）。
	  * @since 1.11.5
	 */
	ai?: CardAI;
	/**
	 * 是否禁止 AI 使用该牌后触发 logAi（身份暴露度计算）
	 *
	 * 为 true 时，AI 使用该牌后不会触发 `logAi` 计算，同时跳过 postAi 的评估。
	 * 注意：它**不阻止** AI 选择/使用该牌，仅抑制 useCard 流程中对 `logAi` 的调用。
	 *
	 * **`logAi` 的真实用途**：在身份/国战等有 `ai.shown`（身份暴露度）的模式下，`logAi(targets, card)`
	 * 根据"对目标用牌的收益效果 get.effect × 目标已暴露程度"累加自己的 `this.ai.shown`（暴露度），
	 * 使 AI 的出牌行为会暴露其身份倾向。`noai` 用于隐藏身份的关键牌，让 AI 用牌时不暴露身份。
	 *
	 * `logAi` 仅在有身份暴露机制的模式下被挂载到玩家对象（mode/guozhan/src/patch/player.js、
	 * mode/identity.js 有真实实现），单挑/斗地主等无 `ai.shown` 的模式覆盖为空函数
	 * （mode/single.js、doudizhu.js、brawl.js），此时该段不执行。
	 *
	 * 消费逻辑：player.js 的 useCard（apps/core/noname/library/element/player.js）
	 * ```js
	 * if (
	 * 	typeof this.logAi == "function" &&
	 * 	!next.noai &&                       // 事件 noai（运行时标记，非卡牌字段）
	 * 	!get.info(next.card).noai &&        // 卡牌 info.noai
	 * 	!this.hasSkillTag(...)
	 * ) {
	 * 	var postAi = get.info(next.card).postAi;
	 * 	if (postAi && postAi(next.targets)) next.postAi = true;
	 * 	else this.logAi(next.targets, next.card);
	 * }
	 * ```
	 *
	 * 注意区分：
	 * - **卡牌 info.noai**：仅抑制 AI 使用该牌后的身份暴露度（logAi）计算；
	 * - **事件 event.noai**：由 `player.useCard(card, targets, "noai")`（player.js 的 "noai" 实参）设置，
	 *   经 standard.js `map.noai = Boolean(trigger.getParent().noai)` 写入 `event.info_map.noai`，
	 *   在 `lib.filter.wuxieSwap`（library/index.js）中用于禁止对该牌自动响应【无懈可击】——两者作用不同。
	  * @since 1.11.5
	 */
	noai?: boolean;
	/**
	 * AI 身份暴露度计算后置（延后触发 logAi）
	 *
	 * 在 AI useCard 时调用 `postAi(targets)`：返回真值时置 `next.postAi = true`（暂不进行 logAi
	 * 身份暴露度计算），否则立即 `this.logAi(...)`。为 true 时，logAi 计算被延后到该牌效果结算完成后再执行
	 * （content.ts 的 useCard 结算 step 16）。
	 *
	 * 与 noai 相同，`logAi` 是身份/国战等模式下的**身份暴露度计算**（有真实实现：
	 * mode/guozhan/src/patch/player.js、mode/identity.js），本字段仅在这些模式起作用。
	 *
	 * 消费逻辑一（player.js 的 useCard，apps/core/noname/library/element/player.js）：
	 * ```js
	 * var postAi = get.info(next.card).postAi;
	 * if (postAi && postAi(next.targets)) {
	 * 	next.postAi = true;                 // 延后身份暴露度计算
	 * } else {
	 * 	this.logAi(next.targets, next.card); // 立即计算
	 * }
	 * ```
	 * 消费逻辑二（content.ts 的 useCard 结算 step 16）：
	 * ```js
	 * if (event.postAi) {
	 * 	event.player.logAi(event.targets, event.card);   // 效果结算完后再计算暴露度
	 * }
	 * ```
	 * 典型用途：某些不应在出牌瞬间暴露 AI 身份的牌，把暴露度计算延后到效果结算后再进行。
	 *
	 * @param targets 已选目标数组
	 * @returns 真值表示延后身份暴露度计算（置 postAi），假值则立即计算
	  * @since 1.11.5
	 */
	postAi?: (targets: Player[]) => number | boolean;

	// ===== 音效 =====
	/**
	 * 音频配置
	 *
	 * - true：使用默认音频（自动转为 "ext:" + 扩展名）
	 * - string：指定音频路径/扩展音频（"db:"/"ext:"/"blob:"/"data:" 前缀）
	 * - number/boolean：在扩展中自动转为 "ext:" + 扩展名 + ":" + 值
	 * - array/object：复杂音频配置
	 * - function：动态计算，调用为 `(card, sex) => string`，返回音频路径字符串
	 *
	 * 消费逻辑：game/index.js 的 useAudio（apps/core/noname/game/index.js）
	 * ```js
	 * const audio = get.dynamicVariable(lib.card[card.name].audio, card, sex);
	 * if (typeof audio == "string") {
	 * 	const audioInfo = audio.split(":");
	 * 	if (["blob:", "data:"].some(prefix => audio.startsWith(prefix))) game.playAudio(audio);
	 * 	else if (audio.startsWith("db:")) game.playAudio(audioInfo[0] + ":" + audioInfo[1], audioInfo[2], card.name + "_" + sex + "." + (audioInfo[3] || "mp3"));
	 * 	else if (audio.startsWith("ext:")) game.playAudio(audioInfo[0] + ":" + audioInfo[1], card.name + "_" + sex + "." + (audioInfo[2] || "mp3"));
	 * 	else game.playAudio("card", sex, audioInfo[0] + "." + (audioInfo[1] || "mp3"));
	 * } else {
	 * 	game.playAudio("card", sex, card.name);
	 * }
	 * ```
	 *
	 * 在 get/audio.ts 中处理，参考 Skill.d.ts 的 audio 字段说明。
	 *
	 * @param card 卡牌
	 * @param sex 目标的性别
	 * @returns 音频路径字符串
	  * @since 1.11.5
	 */
	audio?: number | string | boolean | [string, number] | Record<string, any> | ((card: Card, sex: string) => string);

	// ===== 图片 =====
	/**
	 * 复用另一张牌的图片配置
	 *
	 * 优先级：cardimage > image > modeimage
	 * 
	 * 指定用哪张卡的图来渲染本卡：把 `bg`（图片查找名）替换为 `cardimage` 的值，
	 * 之后按 `lib.card[bg].image` / `modeimage` 加载对应图片。
	 *
	 * 消费逻辑：card.js 的 Card.$init()（apps/core/noname/library/element/card.js）
	 * ```js
	 * var bg = card[2];
	 * if (info.cardimage) {
	 * 	bg = info.cardimage;   // 覆盖图片查找名
	 * }
	 * let img = get.dynamicVariable(lib.card[bg].image, this);
	 * ```
	  * @since 1.11.5
	 */
	cardimage?: string;
	/**
	 * 卡牌图片路径
	 *
	 * 优先级：cardimage > image > modeimage
	 * 
	 * 可指定为图片路径字符串，也可指定为函数 `(card) => string`（由 get.dynamicVariable 调用，参数为卡牌元素实例）动态返回路径。
	 * 若返回假值（false/null/undefined 等），表示未配置有效图片，走默认图片兜底。
	 *
	 * 字符串返回值支持的前缀/特殊值（完整清单，与 card.js 的 Card.$init 消费逻辑一一对应）：
	 * - `"ext:"`：扩展内资源，渲染时把 `"ext:" + 子路径` 替换为 `extension/子路径`（如 `ext:a/b.png` → `extension/a/b.png`）；
	 * - `"character:"`：改用武将头像图，`"character:" + 武将名`，经 `setBackground(武将名, "character")` 渲染；
	 * - `"db:"`：本地数据库图片，`"db:" + 键名`，经 `setBackgroundDB` 从数据库读取；
	 * - `"background"`：字面量标记，只渲染卡牌背景框（`this.node.background`），不渲染卡面插图；
	 * - `"card"`：字面量标记，整张卡都用背景图（`this.setBackground(bg, "card")`）；
	 * - 完整 URL（`https://`、`data:`、`blob:`、`file:` 等，能被 `URL.canParse` 解析）：`setBackgroundImage` 直接作为背景图，不再拼前缀；
	 * - 其余普通字符串：被当作相对路径，`setBackgroundImage` 仅在前面追加 `lib.assetURL`，最终形如 `url("${lib.assetURL}${路径}")`。
	 *
	 * 注意（易踩坑）：
	 * - image 字段不会自动插入 `image/card/` 等目录，普通相对路径必须写全，@example `"image/card/bagua.png"`；
	 * - `image/{type}/{name}.jpg` 这种按卡牌 type 自动拼目录的行为，是 `setBackground(name, type)` 方法的能力，
	 *   与 image 字段无关——image 字段本身不感知卡牌 type；
	 * - `"background"` 与 `"card"` 是两个不同的固定字面量，分别触发"只渲染背景框"和"整卡用背景图"两条分支，不是同义词；
	 * - 完整 URL（尤其 `data:`/`blob:`）的判定发生在 `setBackgroundImage` 内部（`URL.canParse`），不在 card.js 的分支里；
	 * - `mode:` 前缀不适用于 image 字段（那是武将 trashBin / 背景音频等其他场景的写法），卡牌按模式取图请用 `modeimage` 字段。
	 *
	 * 消费逻辑一（card.js 的 Card.$init，见 apps/core/noname/library/element/card.js）：
	 * ```js
	 * let img = get.dynamicVariable(lib.card[bg].image, this);
	 * if (img.startsWith("ext:")) img = img.replace(/^ext:/, "extension/");
	 * else if (img.startsWith("character:") || ["background", "card"].includes(img)) img = null;
	 * ```
	 *
	 * 兜底逻辑（game/index.js 初始化卡牌信息时，未配置 image）：
	 * ```js
	 * if (!info.image || typeof info.image !== "string") {
	 * 	if (info.fullskin) info.image = "ext:" + extname + "/" + name + ".png";
	 * 	else if (info.fullimage) info.image = "ext:" + extname + "/" + name + ".jpg";
	 * }
	 * ```
	 *
	 * @param card 卡牌元素实例（Card）
	 * @returns 图片路径字符串或特殊标记（"background"/"card"）
	  * @since 1.11.5
	 */
	image?: string | ((card: Card) => string | boolean);
	/**
	 * 图片文件所在的模式子目录名
	 *
	 * 优先级：cardimage > image > modeimage
	 * 
	 * 指定图片所在的模式子目录名，加载路径为 `image/mode/{modeimage}/card/{name}.png`。
	 *
	 * 消费逻辑一（card.js 的 Card.$init）：
	 * ```js
	 * if (lib.card[bg].modeimage) {
	 * 	this.node.image.setBackgroundImage("image/mode/" + lib.card[bg].modeimage + "/card/" + bg + ".png");
	 * } else { ... }
	 * ```
	 * 消费逻辑二（ui/create/index.js 的卡牌预览）：
	 * ```js
	 * if (lib.card[cardName].modeimage) {
	 * 	bg.setBackgroundImage("image/mode/" + lib.card[cardName].modeimage + "/card/" + cardName + ".png");
	 * }
	 * ```
	  * @since 1.11.5
	 */
	modeimage?: string;
	/**
	 * 全图皮肤（PNG，设置到 node.image 图片节点）
	 *
	 * 优先级：fullskin > fullimage > fullborder
	 *
	 * 为 true 时按 PNG 加载整张卡图：未配置 info.image 时自动补为 `ext:...png`（game/index.js），
	 * 卡面渲染到 `this.node.image` 节点（且受 `!lib.config.hide_card_image` 开关控制）。
	 *
	 * 消费逻辑一（game/index.js 的 addCard）：
	 * ```js
	 * if (info.fullskin) info.image = "ext:" + extname + "/" + name + ".png";
	 * ```
	 * 消费逻辑二（card.js 的 Card.$init）：
	 * ```js
	 * if (!lib.config.hide_card_image && lib.card[bg].fullskin) {
	 * 	this.classList.add("fullskin");
	 * 	if (img) this.node.image.setBackgroundImage(img);   // 图片节点
	 * 	else this.node.image.setBackgroundImage("image/card/" + bg + ".png");
	 * }
	 * ```
	  * @since 1.11.5
	 */
	fullskin?: boolean;
	/**
	 * 全图皮肤（JPG，设置到整个 .card 元素本身）
	 *
	 * 优先级：fullskin > fullimage > fullborder
	 *
	 * 为 true 时按 JPG 加载整张卡图：未配置 info.image 时自动补为 `ext:...jpg`（game/index.js），
	 * 卡面渲染到**整个卡牌元素**（`this.setBackgroundImage`）并加 `backgroundSize: "cover"`。
	 *
	 * 消费逻辑一（game/index.js 的 addCard）：
	 * ```js
	 * else if (info.fullimage) info.image = "ext:" + extname + "/" + name + ".jpg";
	 * ```
	 * 消费逻辑二（card.js 的 Card.$init）：
	 * ```js
	 * else if (lib.card[bg].fullimage) {
	 * 	this.classList.add("fullimage");
	 * 	this.setBackgroundImage(img);       // 整个卡牌元素
	 * 	this.style.backgroundSize = "cover";
	 * }
	 * ```
	  * @since 1.11.5
	 */
	fullimage?: boolean;
	/**
	 * 卡图边框颜色（gold/silver 两种）
	 *
	 * 优先级：fullskin > fullimage > fullborder
	 *
	 * 指定卡牌的边框材质：gold 时名称属性 nature 设为 `metalmm`（金属），silver 时设为 `watermm`（水），
	 * 并创建 `avatar`（卡图）与 `framebg`（边框背景）节点承载图片。
	 *
	 * 消费逻辑：card.js 的 Card.$init()
	 * ```js
	 * else if (lib.card[bg].fullborder) {
	 * 	this.classList.add("fullborder");
	 * 	if (lib.card[bg].fullborder == "gold") this.node.name.dataset.nature = "metalmm";
	 * 	else if (lib.card[bg].fullborder == "silver") this.node.name.dataset.nature = "watermm";
	 * 	if (!this.node.avatar) this.node.avatar = ui.create.div(".cardavatar");   // 卡图节点
	 * 	if (!this.node.framebg) {
	 * 		this.node.framebg = ui.create.div(".cardframebg");                    // 边框背景
	 * 		this.node.framebg.dataset.auto = lib.card[bg].fullborder;
	 * 	}
	 * 	... this.node.avatar.setBackgroundImage(img);   // 图片加载到 avatar
	 * }
	 * ```
	  * @since 1.11.5
	 */
	fullborder?: "gold" | "silver";

	// ===== 卡图UI信息 =====
	/**
	 * 隐藏卡牌名
	 *
	 * 在 card.js 中Card.$init()中
	 * ```js
	 * if (info.noname) {
	 *		this.node.name.style.display = "none";
	 * }
	 * ```
	  * @since 1.11.5
	 */
	noname?: boolean;
	/**
	 * 名字蓝色背景（史诗品质样式）
	 *
	 * 标记该牌名称使用蓝色背景样式。四个品质字段互斥，优先级为 epic > legend > gold > unique
	 *
	 * 注意：该样式需配合 fullskin 生效，CSS 选择器为 `.card.fullskin.epic > .name`（背景 `rgba(0,66,165,0.6)`）。
	 *
	 * 消费逻辑：card.js 的 Card.$init()（apps/core/noname/library/element/card.js）
	 * ```js
	 * if (info.epic) this.classList.add("epic");
	 * else if (info.legend) this.classList.add("legend");
	 * else if (info.gold) this.classList.add("gold");
	 * else if (info.unique) this.classList.add("unique");
	 * ```
	  * @since 1.11.5
	 */
	epic?: boolean;
	/**
	 * 名字紫色背景（传说品质样式）
	 *
	 * 标记该牌名称使用紫色背景样式。四个品质字段互斥，优先级为 epic > legend > gold > unique。
	 *
	 * 注意：该样式需配合 fullskin 生效，CSS 选择器为 `.card.fullskin.legend > .name`（背景 `rgba(106,27,154,0.6)`）。
	 *
	 * 消费逻辑：card.js 的 Card.$init()（apps/core/noname/library/element/card.js）
	 * ```js
	 * if (info.epic) this.classList.add("epic");
	 * else if (info.legend) this.classList.add("legend");
	 * ```
	  * @since 1.11.5
	 */
	legend?: boolean;
	/**
	 * 名字金色背景（黄金品质样式）
	 *
	 * 标记该牌名称使用金色背景样式。四个品质字段互斥，优先级为 epic > legend > gold > unique。
	 *
	 * 注意：该样式需配合 fullskin 生效，CSS 选择器为 `.card.fullskin.gold > .name`（背景 `rgba(234,158,0,0.6)`，
	 * 且自带 `text-shadow: black 0 0 1px`）。
	 *
	 * 消费逻辑：card.js 的 Card.$init()（apps/core/noname/library/element/card.js）
	 * ```js
	 * if (info.epic) this.classList.add("epic");
	 * else if (info.legend) this.classList.add("legend");
	 * else if (info.gold) this.classList.add("gold");
	 * ```
	  * @since 1.11.5
	 */
	gold?: boolean;
	/**
	 * 是否为特殊装备（特殊品质）
	 *
	 * 优先级：epic > legend > gold > unique
	 * 标记该牌为特殊品质：card.js 中 `else if (info.unique) this.classList.add("unique")`，
	 * 但并无对应的 CSS 样式。其实际效果体现在卡牌描述（uiintro）的文案上：
	 * - 类型信息显示为"特殊X牌"（get/index.js）：
	 *   ```js
	 *   if (lib.card[name] && lib.card[name].unique) typeinfo += "特殊" + get.translation(lib.card[name].type) + "牌";
	 *   ```
	 * - 装备类特殊牌在 uiintro 中追加"特殊装备"（国战为"专属装备"）四字：
	 *   ```js
	 *   if (lib.card[name].unique && lib.card[name].type == "equip") {
	 *   	if (lib.cardPile.guozhan && lib.cardPack.guozhan.includes(name)) uiintro.add("专属装备");
	 *   	else uiintro.add("特殊装备");
	 *   }
	 *   ```
	 * 另有 game/index.js 可在游戏中 `lib.card[content.name].unique = true` 动态标记特殊牌。
	  * @since 1.11.5
	 */
	unique?: boolean;
	/**
	 * 覆盖花色/点数显示的自定义 HTML（仅覆盖显示，不影响实际花色/点数数据）
	 *
	 * 配置后，卡牌的"花色+点数"区域不再显示默认的花色/点数 HTML，而是显示 `modinfo` 指定的内容。
	 *
	 * 注意：一定要使用 `<span>` 标签包裹，例如 `<span>modinfo</span>`，否则会报错。TODO: 也许需要修改相关逻辑。
	 *
	 * 消费逻辑：card.js 的 Card.$init()（apps/core/noname/library/element/card.js）
	 * ```js
	 * if (info.modinfo) {
	 * 	this.node.info.innerHTML = info.modinfo;   // 覆盖显示
	 * } else {
	 * 	this.node.info.innerHTML = get.translation(card[0]) + '<span style="font-family:xinwei"> </span><span style="font-family:xinwei">' + cardnum + "</span>";   // 默认花色+点数
	 * }
	 * ```
	  * @since 1.11.5
	 */
	modinfo?: string;
	/**
	 * 额外信息（卡图距离/范围位置显示此文字）
	 *
	 * 显示在卡图左下角距离位置的附加文字；炉石模式亦会动态赋值（如"消耗: 3"）。
	 *
	 * 逻辑：card.js 的 Card.$init() 渲染卡图信息时（apps/core/noname/library/element/card.js）
	 * ```js
	 * if (info.addinfo) {
	 * 	if (!this.node.addinfo) this.node.addinfo = ui.create.div(".range", this);
	 * 	this.node.addinfo.innerHTML = info.addinfo;
	 * }
	 * ```
	  * @since 1.11.5
	 */
	addinfo?: string;
	/**
	 * 文字阴影样式（css 样式）
	 *
	 * BUG: 实际上不生效。配置时，card.js 会把该值赋给**卡牌元素容器**：`this.style.textShadow = info.textShadow`。
	 * 由于卡牌容器本身没有直接文字（名称、花色点数都渲染在子节点 `node.name` / `node.info` 中），
	 * 此赋值对卡牌名称/点数文字实际不生效。
	 *
	 * 卡牌名称文字阴影的真实来源是 CSS 类与 hooks 的 data-nature 机制
	 * （如 `.card.fullskin.gold > .name` 自带 `text-shadow: black 0 0 1px`），与 `info.textShadow` 字段无关。
	 * 标准卡牌目录（apps/core/card）中也无任何卡牌配置该字段。
	 *
	 * 消费逻辑：card.js 的 Card.$init()（apps/core/noname/library/element/card.js）
	 * ```js
	 * if (info.textShadow) {
	 * 	this.style.textShadow = info.textShadow;   // 赋给卡牌元素容器，不作用于名称子节点
	 * }
	 * ```
	  * @since 1.11.5
	 */
	textShadow?: string;
	/**
	 * 卡牌的名称、花色、点数的透明度 0~1
	 *
	 * 同时作用于名称节点（node.name）与花色/点数节点（node.info）。
	 *
	 * 消费逻辑：card.js 的 Card.$init()（apps/core/noname/library/element/card.js）
	 * ```js
	 * if (info.opacity) {
	 * 	this.node.info.style.opacity = info.opacity;   // 花色/点数
	 * 	this.node.name.style.opacity = info.opacity;   // 名称
	 * }
	 * ```
	  * @since 1.11.5
	 */
	opacity?: number;

	// ===== 卡牌描述uiintro =====
	/**
	 * 动态卡牌描述文本（动态生成卡牌描述，替代默认的 `name_info` 翻译）
	 *
	 * 为函数时动态返回该卡的描述文本；未配置时回退用 `lib.translate[name + "_info"]`。
	 *
	 * 消费逻辑：
	 * - get/index.js 的 get.info 拼接：`if (lib.card[name].cardPrompt) str += lib.card[name].cardPrompt(node, player) + "|";`
	 * - get/index.js 的卡牌描述（uiintro）中装备/手牌展示：
	 *   ```js
	 *   const special = [es[i]].concat(es[i].cards || []).find(j => j.name == es[i].name && lib.card[j.name]?.cardPrompt);
	 *   var str = special ? lib.card[special.name].cardPrompt(special, node) : lib.translate[es[i].name + "_info"];
	 *   ```
	 *
	 * @param card 卡牌
	 * @param player 玩家
	 * @returns 提示文本
	  * @since 1.11.5
	 */
	cardPrompt?: (card: Card, player: Player) => string;
	/**
	 * 卡牌描述附加信息（显示在卡牌描述 uiintro 面板中）
	 *
	 * 区别于 addinfo（卡图角落小字），addinfomenu 是**卡牌描述面板**里的附加说明文字。
	 * 消费逻辑有两处：
	 * - get/index.js 的 get.info 拼接：`if (lib.card[name] && lib.card[name].addinfomenu) str += lib.card[name].addinfomenu + "|"`
	 * - get/index.js 的卡牌描述渲染：`uiintro.add('<div class="text center">' + lib.card[name].addinfomenu + "</div>")`
	 *
	 * 炉石模式（mode/stone.js）会动态赋值（如 "消耗：3"）。
	  * @since 1.11.5
	 */
	addinfomenu?: string;
	/**
	 * 衍生卡牌包（标记该牌为某武将的衍生牌）
	 *
	 * 标记该牌归属于哪个武将（衍生牌/专属牌的来源武将名）。
	 * 通常为单个武将名字符串（如 "ty_shamoke"、"drag_huaci"），部分消费点也支持数组。
	 *
	 * 消费逻辑：
	 * - get/index.js 的 bingzhu 中 `get.characterSurname(info.derivation).map(l => l.join(""))` 取武将姓；
	 * - init/index.ts 加载卡包过滤：`typeof lib.card[item].derivation == "string" && !lib.character[lib.card[item].derivation]`；
	 * - ui/click/index.js 的武将牌归属判定中兼容数组：`if (typeof derivation == "string") derivation = [derivation];`
	  * @since 1.11.5
	 */
	derivation?: string | string[] | boolean;
	/**
	 * 来源的卡包
	 *
	 * 标记该牌归属于哪个卡包（衍生牌/扩展牌的来源），源卡包未启用时该牌不加载；
	 * 卡牌描述uiintro显示"来源：xx包"。
	 * 
	 * 使用方法：把derivation设为true，然后derivation: "来源卡包"
	 * @example "standard"（标准）、"extra"（军争）、"guozhan"（国战）
	 *
	 * 逻辑：noname/init/index.ts 加载卡包时过滤，以及 noname/get/index.ts 卡牌描述（uiintro）
	 * ```js
	 * // init/index.ts
	 * return !(typeof lib.card[item].derivationpack == "string" && !lib.config.cards.includes(lib.card[item].derivationpack));
	 * // get/index.js
	 * if (lib.card[name] && lib.card[name].derivation) {
	 *	if (typeof lib.card[name].derivation == "string") {
	 *		uiintro.add(...来源：xxx...);
	 *	} else if (lib.card[name].derivationpack) {
	 *		uiintro.add(...来源：xxx包...);
	 *	}
	 * }
	 * ```
	  * @since 1.11.5
	 */
	derivationpack?: string;

	// ===== 使用时UI =====
	/**
	 * 目标提示文本（选择目标时显示的提示）
	 *
	 * 可为字符串、字符串数组（对应多个目标位）或函数（动态返回提示文本）
	 * 在 ui/click/index.js 中通过 `get.info(currentcard).targetprompt` 读取，
	 * 其中函数形式被调用为 `targetprompt(this)`（this 为待选目标）
	 *
	 * @param target 待选目标
	 * @returns 提示文本
	  * @since 1.11.5
	 */
	targetprompt?: string | string[] | ((target: Player) => string);
	/**
	 * 是否为扣置牌（进入判定区后对其他玩家隐藏牌面信息）
	 *
	 * 为 true 时该牌进入目标判定区后，非目标控制者对牌面不可见（不展示花色/点数/牌名），
	 * 仅显示为"扣置"状态。目前仅 `xumou_jsrg`（蓄谋，江山如故）启用此字段。
	 *
	 * 注意：前端视觉渲染（判定区卡面 DOM、判定区标记 marks）目前尚未适配 `blankCard`，
	 * 本字段目前生效的仅为后端知识传播与出牌界面两处。
	 *
	 * --- 生效路径 1：阻止其他玩家的知牌权 ---✔
	 *
	 * 进入判定区时（content.ts 的 addJudge，apps/core/noname/library/element/content.ts）：
	 * ```js
	 * const cardInfo = lib.card[cardName];
	 * const visible = cardInfo && !cardInfo.blankCard;
	 * event.visible = visible;
	 * // ...
	 * if (event.visible) {
	 * 	card.addKnower("everyone");	// blankCard 为 true 时跳过，其他玩家不会获得"知道"此牌的知识
	 * }
	 * ```
	 *
	 * --- 生效路径 2：日志文本切换 ---✘
	 *
	 * 同一 addJudge 的日志分支（content.ts）：
	 * ```js
	 *	const isViewAsCard = cards?.length !== 1 || cards[0].name !== card.name || !card.isCard;
	 *	if (isViewAsCard && cards?.length) {
	 *		if (cardInfo.blankCard) {
	 *			game.log(player, `被扣置了<span class="yellowtext">${get.translation(cardName)}</span>`);
	 *		} else {
	 *			game.log(player, `被贴上了<span class="yellowtext">${get.translation(cardName)}</span>（`, cards, "）");
	 *		}
	 *	} else {
	 *		game.log(player, "被贴上了", card);
	 *	}
	 * ```
	 *
	 * --- 生效路径 3：选择目标界面（dialog）中隐藏牌面 ---✔
	 *
	 * 出牌阶段选择目标 / 技能选择判定区目标时（content.ts 的 chooseTarget 流程）：
	 * ```js
	 * const shown = js.filter(card => {
	 * 	const name = card.viewAs || card.name;
	 * 	const info = lib.card[name];
	 * 	if (!info || !info.blankCard) return true;
	 * 	return false;
	 * });
	 * if (shown.length < js.length && !target.isUnderControl(true)) {
	 * 	const hidden = js.filter(card => !shown.includes(card));
	 * 	// shown 渲染为正常卡牌按钮，hidden 渲染为空白按钮
	 * 	event.dialog.buttons = event.dialog.buttons.concat(ui.create.buttons(shown, "card", buttons));
	 * 	event.dialog.buttons = event.dialog.buttons.concat(ui.create.buttons(hidden, "blank", buttons));
	 * }
	 * ```
	 * 非 `isUnderControl` 的玩家在选牌界面中，blankCard 牌以无信息空白按钮渲染。
	  * @since 1.11.5
	 */
	blankCard?: boolean;
	/**
	 * 借刀类多指示线（UI 相关）
	 * 
	 * multitarget需显式设置为true才有效。
	 * 将指示线转为【借刀杀人】类型的从目标指向下一个目标的多条指示线。
	 * 
	 * 逻辑：noname\library\element\content.ts useCard()
	 * ```js
	 * if (event.addedTarget) {
	 *		player.line2(targets.concat(event.addedTargets), config);
	 * } else if (get.info(event.card, false).multitarget && targets.length > 1 && !get.info(event.card, false).multiline) {
	 *		player.line2(targets, config);
	 * } else {
	 *		player.line(targets, config);
	 * }
	 * ```
	  * @since 1.11.5
	 */
	multiline?: boolean;
	/**
	 * 失去时是否抛出动画
	 *
	 * 为 true 时该牌被替换/失去时以抛牌动画（$throw）表现，而非默认的收牌动画。
	 *
	 * 逻辑：content.ts 的 equip 替换流程中（apps/core/noname/library/element/content.ts）
	 * ```js
	 * if (get.info(event.card, true)?.loseThrow) {
	 * 	player.$throw(result.cards, 1000);
	 * }
	 * ```
	  * @since 1.11.5
	 */
	loseThrow?: boolean;

	// ===== 延迟 =====
	/**
	 * 是否无动画延迟（使用该牌时不播放卡牌动画延迟）
	 *
	 * 为 true 时跳过卡牌使用/目标结算时的动画延迟（仅当 `event.animate != false` 时生效）。
	 *
	 * 消费逻辑（content.ts 的 useCard，apps/core/noname/library/element/content.ts）：
	 * ```js
	 * if (!info.nodelay && event.animate != false) {
	 * 	await game.playUseCardAnimation(...);   // 使用牌动画
	 * }
	 * ...
	 * if (!info.nodelay && num > 0) {
	 * 	if (event.targetDelay !== false) {
	 * 		await game.delayx(0.5);             // 多目标间延迟
	 * 	}
	 * }
	 * ```
	 * 即 `nodelay` 同时作用于"出牌动画"与"多目标间延迟"两处。
	  * @since 1.11.5
	 */
	nodelay?: boolean;
	/**
	 * 是否启用最终延迟（效果结算后、弃置物清场前的延迟动画）
	 *
	 * 默认为 true，仅显式 false 时关闭"结算后若有被弃置的牌则延迟清场"的最终延迟。
	 *
	 * 消费逻辑（content.ts 的 useCard 结算收尾）：
	 * ```js
	 * if (document.getElementsByClassName("thrown").length) {
	 * 	if (event.delayx !== false && get.info(event.card, false).finalDelay !== false) {
	 * 		game.delayx();
	 * 	}
	 * } else { ... }
	 * ```
	  * @since 1.11.5
	 */
	finalDelay?: boolean;
	/**
	 * 装备时是否延迟（onEquip 触发后）
	 *
	 * 默认为 true，仅显式 false 时关闭"穿戴装备后的延迟动画"。
	 *
	 * 消费逻辑：content.ts 的 equip 流程（apps/core/noname/library/element/content.ts）
	 * ```js
	 * if (cardInfo.equipDelay != false) {
	 * 	await game.delayx();
	 * }
	 * ```
	  * @since 1.11.5
	 */
	equipDelay?: boolean;
	/**
	 * 失去装备时是否延迟（onLose 触发前）
	 *
	 * 默认为 true，仅显式 false 时关闭"失去装备时的弹名/延迟动画"。
	 * 注意：该延迟还受 `player.isAlive() || info.forceDie` 约束——装备者已死亡且未配置 forceDie 时同样不延迟。
	 *
	 * 消费逻辑：content.ts 的失去装备流程（apps/core/noname/library/element/content.ts）
	 * ```js
	 * if (info.loseDelay != false && (player.isAlive() || info.forceDie)) {
	 *		player.popup(VEquip.name);   // 弹出装备名
	 *		game.delayx();
	 * }
	 * ```
	  * @since 1.11.5
	 */
	loseDelay?: boolean;
	/**
	 * 是否启用目标间延迟
	 *
	 * 多目标结算时，各目标之间是否插入延迟动画；默认为 true，仅显式 false 时关闭。
	 *
	 * 逻辑：lib.element.content 的多目标结算中（apps/core/noname/library/element/content.ts）
	 * ```js
	 * if (info.targetDelay === false) {
	 *		event.targetDelay = false;
	 * }
	 * ```
	  * @since 1.11.5
	 */
	targetDelay?: boolean;

	// ===== 炉石模式（mode/stone.js）特有 =====
	/**
	 * 卡牌使用次数的消耗值（炉石模式）
	 *
	 * 仅炉石模式下有意义：为卡牌设置使用该牌需消耗的「法力水晶」数；
	 * 装备牌默认为 0，法术/随从卡各自配置。
	 *
	 * 逻辑：mode/stone.js 的 game 流程中（注意读取的是 `lib.card[i]` 顶层，而非 `.ai`）
	 * ```js
	 * if (lib.card[i].type == "equip") {
	 * 	lib.card[i].stoneact = 0;
	 * } else if (typeof lib.card[i].stoneact === "number") {
	 * 	lib.card[i].addinfo = "消耗: " + lib.card[i].stoneact;
	 * }
	 * ```
	  * @since 1.11.5
	 */
	stoneact?: number;
	/**
	 * 是否在该模式中隐藏（炉石模式）
	 *
	 * 为 true 时该牌在炉石模式的卡池中不出现。
	 *
	 * 逻辑：mode/stone.js 中
	 * ```js
	 * if (lib.card[i].stonehidden) { continue; }
	 * ```
	  * @since 1.11.5
	 */
	stonehidden?: boolean;
	/**
	 * 卡牌职业（炉石模式）
	 *
	 * 值为 `lib.careerList` 中的职业名（mage/shaman/druid/...），
	 * 用于把牌按职业分组；为 null 表示中立。
	 * @example
	 * mage		法师
	 * shaman	祭司（萨满）
	 * druid	德鲁伊
	 * paladin	圣骑士
	 * rogue	潜行者
	 * priest	牧师
	 * hunter	猎人
	 * warrior	战士
	 * warlock	术士
	 * 
	 * 逻辑：mode/stone.js 中 get.stonecard
	 * ```js
	 * if (career && lib.card[i].career != career) { continue; }
	 * ```
	  * @since 1.11.5
	 */
	career?: string | null;

	// ===== 扩展字段 =====
	/** 允许动态扩展其他字段 */
	[key: string]: any;
}

/**
 * 卡牌 AI 评估配置
 *
 * 卡牌通过 `get.info(card).ai` 访问，字段定义见本 interface；技能另有独立的 SkillAI（见 Skill.d.ts）。
 * 本 interface 已列出卡牌实际使用的全部字段，新增卡牌 AI 字段应在此补充。
  * @since 1.11.5
 */
declare interface CardAI {
	// ===== 基础评估值 =====
	/**
	 * 出牌优先度
	 *
	 * 数字越大越优先使用；可为函数动态计算。
	 * 备注：实际使用顺序还会受到技能的Mod的aiOrder的影响
	 * 大致标准：桃园结义 10 > 火攻 9.2 > 过河拆桥 9 > 顺手牵羊 7.5 > 无中生有 7 > 决斗 5 > 杀 3.2 > 诸葛连弩 3.1 > 桃 2 > 乐不思蜀 1
	 *
	 * 逻辑：get.order()（apps/core/noname/get/index.js）
	 * ```js
	 * var num = order;
	 * if (typeof order == "function") num = order(item, player);
	 * if (typeof item == "object" && player) num = game.checkMod(player, item, num, "aiOrder", player);
	 * ```
	 * 注意：濒死求桃的 ai1（apps/core/noname/library/element/content.ts）以 `(null, player)` 调用，
	 * 即函数第一个参数 `card` 可能为 null，写卡牌时勿直接使用 card。
	 * ```js
	 * } else if (typeof info.ai.order == "function") {
	 * 	return info.ai.order(null, player);   // 第一参为 null
	 * }
	 * ```
	 *
	 * @param card 卡牌（可能为 null）
	 * @param player 使用者
	 * @returns 出牌优先度数值
	  * @since 1.11.5
	 */
	order?: number | ((card: Card | null, player: Player) => number);
	/**
	 * 使用价值
	 *
	 * 该牌当前的「使用收益」评估；为函数时按出牌情景动态计算（3 参 num、4 参 method）。
	 * 备注：实际使用价值还会受到技能的Mod的aiValue的影响
	 * 大致标准：无中生有 9.2 > 顺手牵羊 9 > 乐不思蜀 8 > 桃 [8,6.5,5,4] > 杀 [5,1]
	 *
	 * 逻辑：get.value()（apps/core/noname/get/index.js）
	 * ```js
	 * if (typeof value == "function") {
	 * 	result = value(card, player, geti(), method);   // geti() 返回手牌下标
	 * }
	 * if (Array.isArray(value)) {                        // 数组形态按下标取值
	 * 	var num = geti();
	 * 	result = num < value.length ? value[Math.max(0, num)] : value[value.length - 1];
	 * }
	 * result = game.checkMod(player, card, result, "aiValue", player);
	 * ```
	 *
	 * @param card 卡牌
	 * @param player 使用者
	 * @param num 当前手牌下标
	 * @param method 评估方法
	 * @returns 该牌的使用价值（数值或数值数组）
	  * @since 1.11.5
	 */
	value?: SAAType<number> | ((card: Card, player: Player, num: number, method: any) => SAAType<number>);
	/**
	 * 回合外留牌价值
	 *
	 * 该牌在回合外留存于手中的「实用」评估；为函数时按留牌下标动态计算。
	 * 备注：实际留牌价值还会受到技能的Mod的aiUseful的影响
	 * 大致标准：桃 [8,6.5,5,4] > 闪 [7,2] > 无懈 [6,4] > 杀 [5,1]
	 *
	 * 逻辑：get.useful_raw()（apps/core/noname/get/index.js）
	 * ```js
	 * if (useful == undefined) result = -1;
	 * else if (typeof useful == "function") result = useful(card, i);   // i 为手牌下标
	 * else if (typeof useful == "number") result = useful;
	 * else if (i < useful.length) result = useful[i];
	 * else result = useful[useful.length - 1];
	 * result = game.checkMod(player, card, result, "aiUseful", player);
	 * ```
	 *
	 * @param card 卡牌
	 * @param cardIndex 当前事件玩家的手牌下标
	 * @returns 回合外留牌价值（数值或数值数组）
	  * @since 1.11.5
	 */
	useful?: SAAType<number> | ((card: Card, cardIndex: number) => SAAType<number>);
	/**
	 * 装备牌的价值（装备牌用）
	 *
	 * 在 get/index.js、game/index.js 中 `let equipValue = info.ai.equipValue || info.ai.basic.equipValue`
	 * 函数形态实际以 4 个实参调用（第 3 参恒为 null 占位、第 4 参为评估方法标记 "raw2"），
	 * 声明时通常无需使用后两参，但请知悉真实调用形态。
	 *
	 * 逻辑：get.equipValue()（apps/core/noname/get/index.js）
	 * ```js
	 * var value = info.ai.equipValue;
	 * if (value == undefined && info.ai.basic?.equipValue != undefined) {
	 * 	value = info.ai.basic.equipValue;      // 回退 basic
	 * }
	 * if (typeof value == "function") {
	 * 	return value(card, player, null, "raw2");
	 * }
	 * ```
	 *
	 * @param card 卡牌
	 * @param player 使用者
	 * @param arg3 占位参数（恒为 null）
	 * @param method 评估方法标记（"raw2"）
	 * @returns 该装备的价值数值
	  * @since 1.11.5
	 */
	equipValue?: number | ((card: Card, player: Player, arg3?: null, method?: string) => number);

	// ===== basic =====
	/**
	 * 基础 AI 配置（与外层 order/useful/value/equipValue 同义，优先使用外层）
	 *
	 * 在 game/index.js 中 `card.ai.order = lib.card[...].ai.order; if (!card.ai.order && lib.card[...].ai.basic) card.ai.order = lib.card[...].ai.basic.order`
	  * @since 1.11.5
	 */
	basic?: {
		/**
		 * 出牌优先度
		 *
		 * 数字越大越优先使用；与外层 `order` 同义，外层存在时优先取外层。
		 *
		 * 大致标准：桃园结义 10 > 火攻 9.2 > 过河拆桥 9 > 顺手牵羊 7.5 > 无中生有 7 > 决斗 5 > 杀 3.2 > 诸葛连弩 3.1 > 桃 2 > 乐不思蜀 1
		 *
		 * @param card 卡牌
		 * @param player 使用者
		 * @returns 出牌优先度数值
		  * @since 1.11.5
		 */
		order?: number | ((card: Card | null, player: Player) => number);
		/**
		 * 使用价值
		 *
		 * 与外层 `value` 同义，外层存在时优先取外层。
		 *
		 * 大致标准：无中生有 9.2 > 顺手牵羊 9 > 乐不思蜀 8 > 桃 [8,6.5,5,4] > 杀 [5,1]
		 *
		 * @param card 卡牌
		 * @param player 使用者
		 * @param num 当前手牌下标
		 * @param method 评估方法
		 * @returns 该牌的使用价值（数值或数值数组）
		  * @since 1.11.5
		 */
		value?: SAAType<number> | ((card: Card, player: Player, num: number, method: any) => SAAType<number>);
		/**
		 * 回合外留牌价值
		 *
		 * 与外层 `useful` 同义，外层存在时优先取外层。
		 *
		 * 大致标准：桃 [8,6.5,5,4] > 闪 [7,2] > 无懈 [6,4] > 杀 [5,1]
		 *
		 * @param card 卡牌
		 * @param cardIndex 当前事件玩家的手牌下标
		 * @returns 回合外留牌价值（数值或数值数组）
		  * @since 1.11.5
		 */
		useful?: SAAType<number> | ((card: Card, cardIndex: number) => SAAType<number>);
		/**
		 * 装备牌的价值（装备牌用）
		 *
		 * 与外层 `equipValue` 同义，外层存在时优先取外层。
		 * 函数形态的真实调用方式与外层相同（4 参，见外层 equipValue 说明）。
		 *
		 * @param card 卡牌
		 * @param player 使用者
		 * @param arg3 占位参数（恒为 null）
		 * @param method 评估方法标记
		 * @returns 该装备的价值数值
		  * @since 1.11.5
		 */
		equipValue?: number | ((card: Card, player: Player, arg3?: null, method?: string) => number);
		// ===== 扩展字段 =====
		[key: string]: any;
	};

	// ===== 使用结果评估 =====
	/**
	 * 收益值预估
	 * 
	 * get.result 中使用
	 *
	 * - target：对目标的收益
	 * - player：对使用者的收益
	 * - target_use/player_use：主要用于 get.effect_use，优先于 target/player
	 * - keepAI：装备牌使用卡牌自带的ai.result.target
	 * - ignoreStatus：忽略目标的状态(如体力、手牌数、威胁度)
	  * @since 1.11.5
	 */
	result?: {
		/**
		 * 对玩家自身的收益（AI是否使用此牌）
		 *
		 * 由 get.result() 归一化后，在 get.effect / get.effect_use 中调用，
		 * 以 4 个实参 `(player, target, card, linking)` 调用；返回非 number 时被当作 0 处理。
		 *
		 * 逻辑：get.effect_use()（apps/core/noname/get/index.js）
		 * ```js
		 * let result1 = result.player_use || result.player;    // effect_use 优先取 player_use
		 * if (typeof result1 === "function") {
		 * 	result1 = result1(player, target, card, linking);
		 * }
		 * if (typeof result1 !== "number") result1 = 0;        // 非 number 一律按 0 计
		 * ```
		 * get.effect()（apps/core/noname/get/index.js）同理，但直接取 `result.player`。
		 *
		 * @param player 使用者
		 * @param target 目标
		 * @param card 卡牌
		 * @param linking 是否正在计算连环传导，或传导计算时携带的上下文
		 * @returns 正数发动，负数不发动，无返回值则默认不发动（非 number 一律按 0 计）
		  * @since 1.11.5
		 */
		player?: number | ((player: Player, target: Player, card: Card, linking?: boolean | Record<string, any>) => number | void);
		/**
		 * 主动使用牌时对发动者自身的收益
		 *
		 * 仅 get.effect_use()（apps/core/noname/get/index.js）使用，优先于 player；
		 * 未定义时退回 player。调用方式与 player 相同（4 参，第 4 参为 linking）。
		 *
		 * 逻辑：get.effect_use()（apps/core/noname/get/index.js）
		 * ```js
		 * let result1 = result.player_use || result.player;    // 优先取 player_use
		 * if (typeof result1 === "function") {
		 * 	result1 = result1(player, target, card, linking);
		 * }
		 * if (typeof result1 !== "number") result1 = 0;
		 * ```
		 *
		 * @param player 使用者
		 * @param target 目标
		 * @param card 卡牌
		 * @param linking 是否正在计算连环传导，或传导计算时携带的上下文
		 * @returns 正数发动，负数不发动，无返回值则默认不发动（非 number 一律按 0 计）
		  * @since 1.11.5
		 */
		player_use?: number | ((player: Player, target: Player, card: Card, linking?: boolean | Record<string, any>) => number | void);
		/**
		 * 对目标的收益（AI如何选择目标）
		 *
		 * 由 get.result() 归一化后，在 get.effect / get.effect_use 中调用，
		 * 以 4 个实参 `(player, target, card, linking)` 调用；返回非 number 时被当作 0 处理。
		 *
		 * 逻辑：get.effect_use()（apps/core/noname/get/index.js）
		 * ```js
		 * let result2 = result.target_use || result.target;    // effect_use 优先取 target_use
		 * if (typeof result2 === "function") {
		 * 	result2 = result2(player, target, card, linking);
		 * }
		 * if (typeof result2 !== "number") result2 = 0;
		 * ```
		 * get.effect()（apps/core/noname/get/index.js）同理，但直接取 `result.target`。
		 *
		 * @param player 使用者
		 * @param target 目标
		 * @param card 卡牌
		 * @param linking 是否正在计算连环传导，或传导计算时携带的上下文
		 * @returns 正数选队友，负数选敌人，无返回值则不选（非 number 一律按 0 计）
		  * @since 1.11.5
		 */
		target?: number | ((player: Player, target: Player, card: Card, linking?: boolean | Record<string, any>) => number | void);
		/**
		 * 主动使用牌时对目标的收益（AI 选择目标）
		 *
		 * 仅 get.effect_use()（apps/core/noname/get/index.js）使用，优先于 target；
		 * 未定义时退回 target。调用方式与 target 相同（4 参，第 4 参为 linking）。
		 *
		 * 逻辑：get.effect_use()（apps/core/noname/get/index.js）
		 * ```js
		 * let result2 = result.target_use || result.target;    // 优先取 target_use
		 * if (typeof result2 === "function") {
		 * 	result2 = result2(player, target, card, linking);
		 * }
		 * if (typeof result2 !== "number") result2 = 0;
		 * ```
		 *
		 * @param player 使用者
		 * @param target 目标
		 * @param card 卡牌
		 * @param linking 是否正在计算连环传导，或传导计算时携带的上下文
		 * @returns 正数选队友，负数选敌人，无返回值则不选（非 number 一律按 0 计）
		  * @since 1.11.5
		 */
		target_use?: number | ((player: Player, target: Player, card: Card, linking?: boolean | Record<string, any>) => number | void);
		/**
		 * 装备牌使用卡牌自带的 ai.result.target，而不使用 get.equipResult
		 *
		 * 为 true 时，禁止 game.finishCard 用默认装备收益函数 aiResultTarget 覆盖本卡牌自带的 result.target；
		 * 为 false/未配置时，装备牌初始化会把 result.target 替换成默认的自动装备评估。
		 * 仅对装备类卡牌有意义——设 true 可保留开发者手写的 result.target。
		 *
		 * 逻辑：game/index.js 的 finishCard（装备牌初始化分支）
		 * ```js
		 * if (!card.ai.result.keepAI) {
		 * 	card.ai.result.target = aiResultTarget;   // 默认用 get.equipResult 自动装备评估覆盖
		 * }
		 * ```
		  * @since 1.11.5
		 */
		keepAI?: boolean;
		/**
		 * 计算卡牌效果时忽略目标的状态(如体力、手牌数、威胁度)
		 *
		 * 为 true 时，get.effect / get.effect_use 跳过对目标收益 result2 的**全部**状态修正，
		 * 包括：威胁度衰减、目标血量（hp==1/2）倍率、手牌数倍率等。典型用于乐不思蜀等延时锦囊
		 * （这些牌的效果不依赖目标当前的体力/手牌状态，去掉修正可使 AI 评估更稳定）。
		 *
		 * 逻辑：get.effect() 与 get.effect_use()（apps/core/noname/get/index.js）
		 * ```js
		 * if (typeof card === "object" && !result.ignoreStatus) {
		 * 	if (cache.get.attitude(player, target) < 0) result2 *= Math.sqrt(threaten);
		 * 	else result2 *= Math.sqrt(Math.sqrt(threaten));   // 威胁度衰减
		 * 	if (target.hp === 1) result2 *= 2.5;
		 * 	if (target.hp === 2) result2 *= 1.8;              // 血量修正
		 * 	// ... 手牌数修正等
		 * }
		 * ```
		  * @since 1.11.5
		 */
		ignoreStatus?: boolean;
		[key: string]: any;
	};


	// ===== 身份 =====
	/**
	 * 身份暴露度（0~1）
	 *
	 * 使用某张牌会增加该玩家的「身份暴露值」，数值越大暴露身份越明显；
	 * 仅在身份局 / 国战模式下生效，技能侧亦有同名字段（SkillAI.expose）。
	 *
	 * 逻辑：mode/identity.js 与 guozhan/src/patch/player.js（国战）均读取卡牌 `info.ai.expose`
	 * ```js
	 * const info = get.info(card);
	 * if (info.ai && info.ai.expose) {
	 * 	this.ai.shown += info.ai.expose;
	 * }
	 * ```
	 * 注意：与技能侧 `SkillAI.expose` 的消费点（player.js 的 logAi，读 `lib.skill[name].ai.expose`）不同，勿混淆。
	  * @since 1.11.5
	 */
	expose?: number;

	// ===== AI决策 =====
	/**
	 * 是否对连锁状态下的目标处理
	 *
	 * 用于属性伤害（含 tag "natureDamage"）的连环传导评估：返回真值时引擎把返回值作为传入
	 * get.effect 的 linking 上下文——对象形态会被原地注入 `source = target` 后使用，
	 * 布尔/其它真值则被规范化为空对象。返回假值时走默认传导逻辑（`{ source: target }`）。
	 *
	 * 逻辑：get.effect_use() 与 get.effect()（apps/core/noname/get/index.js）
	 * ```js
	 * const info = get.info(card);
	 * if (!info || !info.ai || !info.ai.canLink) {
	 * 	if (target.isLinked()) {
	 * 		// 默认：对每个连环目标累加 `get.effect(current, card, player, player2, { source: target })`
	 * 	}
	 * } else {
	 * 	let canLink = info.ai.canLink(player, target, card);
	 * 	if (canLink) {
	 * 		if (typeof canLink !== "object") canLink = {};   // 真值规范化为对象
	 * 		canLink.source = target;                          // 原地注入 source
	 * 		// 对每个连环目标累加 `get.effect(current, card, player, player2, canLink)`
	 * 	}
	 * }
	 * ```
	 *
	 * @param player 使用者
	 * @param target 伤害传导的起点
	 * @param card 所使用卡牌
	 * @returns 是否处理（布尔），或返回存放所需数据的字典（对象会被注入 source）
	  * @since 1.11.5
	 */
	canLink?(player: Player, target: Player, card: Card): boolean | object;
	/**
	 * 是否对该牌使用无懈（AI 决策）
	 *
	 * 由无懈响应逻辑调用，返回 number 时直接作为无懈 AI 评分；返回 undefined 时落入引擎
	 * 默认的无懈评分逻辑（基于 get.attitude / get.effect）。
	 *
	 * 参数说明：
	 * - `target`：无懈目标。在 isJudge 判定牌分支（`info = lib.card[name]`）**实际传的是该牌的使用者（source）**；
	 *   在无目标牌评估分支显式传 `undefined`。卡牌定义统一把第一参当「目标」处理即可，无需区分场景。
	 *
	 * 逻辑：apps/core/card/standard.js 的无懈响应（6 处调用，此处为有目标分支代表）
	 * ```js
	 * const info = get.info(card);
	 * if (info.ai && info.ai.wuxie) {
	 * 	const aiii = info.ai.wuxie(target, card, source, _status.event.player, state);
	 * 	if (typeof aiii === "number") {   // 仅 number 被采用
	 * 		return aiii;
	 * 	}
	 * }
	 * // 返回 undefined 时落入默认评分
	 * ```
	 * 无目标分支：`info.ai.wuxie(undefined, card, source, _status.event.player, state)`；
	 * isJudge 判定牌分支：`info.ai.wuxie(source, card, source, _status.event.player, state)`（第 1 参传使用者）。
	 *
	 * @param target 无懈目标（isJudge 判定场景下实为被无懈牌的使用者；多目标/无目标评估时可能为 undefined）
	 * @param card 无懈牌
	 * @param player 无懈使用者
	 * @param viewer 视角玩家
	 * @param status 无懈收益值
	 * @returns 收益值（数值），或 undefined 表示不发动、交由引擎默认评分
	  * @since 1.11.5
	 */
	wuxie?(target: Player | void, card: Card, player: Player, viewer: Player, status: any): number | void;
	/**
	 * 应变效果评估（AI 决策是否触发应变）
	 *
	 * 在"应变助战"的 chooseCard ai 中调用，返回 number 作为助战评分基础（再减去弃牌价值）；
	 * 返回假值表示不助战。第 2 参语义为「使用该牌的玩家（来源）」而非「视角玩家」——
	 * 卡牌定义里常将其命名为 `player`（如 standard.js 的 `yingbian(card, player, targets, viewer)`），
	 * 写卡牌时勿把它误当成 viewer（视角玩家才是第 4 参）。
	 *
	 * 逻辑：apps/core/noname/library/index.js 的应变助战 ai
	 * ```js
	 * if (info && info.ai && info.ai.yingbian) {
	 * 	var ai = info.ai.yingbian(card, source, targets, player);
	 * 	if (!ai) return 0;                       // 假值不助战
	 * 	return ai - get.value(cardx);            // 评分减弃牌价值
	 * }
	 * ```
	 *
	 * @param card 卡牌
	 * @param source 使用者（卡牌定义中常命名 player）
	 * @param targets 目标
	 * @param viewer 视角玩家
	 * @returns 应变收益值（number），或假值表示不助战
	  * @since 1.11.5
	 */
	yingbian?(card: Card, source: Player, targets: Player[], viewer: Player): number;
	/**
	 * 卡牌按钮决策（chooseButton 的 AI）(diy)
	 *
	 * 自定义字段：**引擎不会自动读取 `info.ai.button`**，而是由卡牌的内容函数在
	 * 需要给手牌/装备选择类 chooseButton 事件指定按钮评分时，通过 `.set("ai", lib.card.xxx.ai.button)`
	 * 手动引用（如 standard.js 的顺手牵羊/过河拆桥、yingbian.js 的应变助战）。
	 * 若某卡牌不配置此字段，也没有别处手动引用，则该卡没有可供复用的按钮评分函数。
	 *
	 * 逻辑：apps/core/card/standard.js 中手动引用
	 * ```js
	 * await player.gainPlayerCard(pos, target, true).set("ai", lib.card.shunshou.ai.button);
	 * ```
	 * 消费：赋给 chooseButton 事件的 `ai` 后，由 ai/basic.js 的 chooseButton 以 `check(button)` 调用，
	 * 返回 number 作为按钮评分（越大越优先）。
	 * ```js
	 * let checkix = check(buttons[0], buttons2);      // 第一参 button，第二参可选
	 * // ... 遍历比较 check(buttons[i], buttons2) 取最大
	 * if (check(buttons[ix]) <= 0) { ... }           // 评分 <=0 视为不选
	 * ```
	 * 卡牌定义仅使用第一参 `button`（如 standard.js 的 `button: button => {...}`）。
	 *
	 * @param button 按钮
	 * @returns 按钮的评分（number）
	  * @since 1.11.5
	 */
	button?(button: Button): number;

	/**
	 * 卡牌标签（get.tag 中使用，标记卡牌的特性）
	 *
	 * 常用标签：use, useSha, respond, respondSha, respondShan,
	 *  damage, natureDamage, fireDamage, thunderDamage, iceDamage, poisonDamage,
	 *  recover, save, loseHp, draw, gain, discard, lose, loseCard,
	 *  multitarget, multineg, norepeat, skip, valueswap
	 * 
	 * @example
	 * ```js
	 * ai: {
	 * 	tag: {
	 * 	  useSha: 1,
	 * 	}
	 * }
	 * ```
	  * @since 1.11.5
	 */
	tag?: CardTag;

	// ===== 扩展字段 =====
	[key: string]: any;
}

// ===== 标签（用于 AI 识别卡牌特性） =====
/**
 * 卡牌标签（get.tag 中使用，标记卡牌的特性）
 *
 * 读取方式：`get.tag(card, "damage")`；
 *
 * 常用标签：respondSha、respondShan、damage、natureDamage、fireDamage、thunderDamage、iceDamage、
 * poisonDamage、recover、loseHp、gain、save、discard、loseCard、multitarget、multineg、
 * draw、norepeat、valueswap、respond
 *
 * 取值：数字（标记强度）或函数（动态判断）
  * @since 1.11.5
 */
declare interface CardTag {
	// ===== 使用 / 打出 =====
	/** 使用 */
	use?: number;
	/** 使用杀（手上没有杀时也有可能使用杀） */
	useSha?: number;
	/** 打出 */
	respond?: number;
	/** 打出杀（手上没有杀时也有可能用杀响应） */
	respondSha?: number;
	/** 打出闪（手上没有闪时也有可能用闪响应） */
	respondShan?: number;

	// ===== 伤害与体力变化 =====
	/** 伤害 */
	damage?: number | ((card: Card, nature?: any) => number | void);
	/** 属性伤害 */
	natureDamage?: number | ((card: Card, nature?: any) => number | void);
	/** 火伤 */
	fireDamage?: number | ((card: Card, nature?: any) => number | void);
	/** 雷伤 */
	thunderDamage?: number | ((card: Card, nature?: any) => number | void);
	/** 冰伤 */
	iceDamage?: number | ((card: Card, nature?: any) => number | void);
	/** 毒伤 */
	poisonDamage?: number | ((card: Card, nature?: any) => number | void);
	/** 回复 */
	recover?: number;
	/** 救人 */
	save?: number;
	/** 失去体力 */
	loseHp?: number;

	// ===== 牌操作（摸牌、获得、弃置、失去） =====
	/** 摸牌 */
	draw?: number;
	/** 获得牌 */
	gain?: number;
	/** 弃置牌 */
	discard?: number;
	/** 失去牌 */
	lose?: number;
	/** 失去牌 */
	loseCard?: number;

	// ===== 多目标与结算 =====
	/** 多目标 */
	multitarget?: number | boolean;
	/** 多目标负面效果 */
	multineg?: number | boolean;
	/** 不额外结算 */
	norepeat?: number;

	// ===== 特殊效果 =====
	/** 赠物(unused) */
	gifts?: any;
	/** 翻面(unused) */
	turnOver?: any;
	/** 改判(unused) */
	rejudge?: any;
	/** 跳过阶段，值为被跳过的阶段名 */
	skip?: "phaseZhunbei" | "phaseJudge" | "phaseDraw" | "phaseUse" | "phaseDiscard" | "phaseJieshu";

	// ===== AI =====
	/** 装备替换价值 */
	valueswap?: number;

	// ===== 扩展字段 =====
	[key: string]: any;
}

/**
 * 卡牌包导入时的造牌列表元素（`list` 数组项）：[花色, 点数, 牌名, 属性?, 标记数组?]
 *
 * 前 3 项必填，后 2 项按需提供：
 * - 第 1 位「花色」：如 "spade" / "heart" / "club" / "diamond"
 * - 第 2 位 「点数」： 1 - 13
 * - 第 3 位 「牌名」：如 "sha" / "jiu" / "tao"
 * - 第 4 位「属性」：如 "fire" / "thunder" / "ice" / "stab"，无属性时省略或写 `null`
 * - 第 5 位「标记数组」：如 ["gifts"]、["yingbian_kongchao", "yingbian_damage"]，仅在提供了第 4 位时才能出现
 */
declare type CardInitListItem = [
	string, // 花色（"spade" / "heart" / "club" / "diamond"）
	number, // 点数
	string, // 牌名
	(string | null)?, // 属性，无属性为 null
	string[]?, // 标记数组
];