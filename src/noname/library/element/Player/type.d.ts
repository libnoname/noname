import type { Card, VCard, Player, Button, Dialog, GameEvent } from ".."

// 一些常用的封装

/**
 * 相比`Select`来说更加广泛的选择范围
 * 
 * 当给定`number`时，表示精确选择该数量
 * 
 * 当给定`[begin, end]`时，表示选择数量在该区间内
 */
export type BroadSelect = number | Select

/**
 * 
 */
export interface CheckCardParams {
    /**
	 * 选择牌需要满足的条件
     * 
	 * 直接填true，则有些地方，会优先触发过滤可使用的卡牌，例如ui.click.skill,ai.basic.chooseCard
	 * 
	 * 注：game.check时，如果当前时viewAs“视为技”，则其过滤技能时filterCard,作为方法，多入参一个event参数，需要时可以使用；
	 * （一般没有）
	 * 
	 * @param card - 选择的牌
	 * @param player - 发起选择的玩家
	 * @param event - 触发选择的事件，一般情况下可能不存在
	 * @returns 牌是否符合条件
	 */
	filterCard?: boolean | ((card: Card, player: Player, event?: GameEvent) => boolean);
	
	/**
	 * 需要选择牌数量的范围
	 * 
	 * 当值为-1时，表示选择所有满足条件的牌
	 * 
	 * @returns 选择牌的数量范围
	 */
	selectCard?: BroadSelect | (() => BroadSelect);

	/** 
	 * 指定选择牌的位置
	 * 
	 * 可选值为"hejsx"的字串全排序，其中：
	 * 
	 * - "h": 手牌区
	 * - "e": 装备区
	 * - "j": 判定区
	 * - "s": 特殊区，一般用于《木牛流马》等需要“如手牌般使用或打出”的情况
	 * - "x": 武将牌上的牌，例如《屯田》
	 * 
	 * 此外，有一些不属于位置但存在的缩写：
	 * 
	 * - "c": 牌堆
	 * - "d": 弃牌堆
	 * - "o": 处理区，即当前正在使用或打出的牌
	 * 
	 * 一般情况下默认为"h"
	 */
	position?: string;

	/**
	 * 选择牌的情况是否复杂
	 * 
	 * 当该值为`true`时，`filterCard`和`selectCard`将在每选择一张牌后重新计算
	 * 
	 * 默认为`false`
	 */
	complexCard?: boolean;

	/**
	 * 是否允许选牌时可以使用全选/反选按钮
	 * 
	 * 仅在`complexCard`不为`true`的情况下生效
	 */
	allowChooseAll?: boolean;

	/**
	 * AI选择牌时的优先级评分函数
	 * 
	 * @param card - 选择的牌
	 * @RETURNS 选择该牌的优先级评分
	 */
	ai?(card: Card): number;
}

/**
 * 
 */
export interface CheckTargetParams {
	/**
	 * 选择的目标需要满足的条件
	 * 
	 * @param card - 与选择目标相关的牌，一般情况下可能不存在
	 * @param player - 发起选择的玩家
	 * @param target - 被选择的目标玩家
	 * @returns 目标是否符合条件
	 */
	filterTarget?: boolean | ((card: Card, player: Player, target: Player) => boolean);

	/**
	 * 需要选择目标的范围
	 * 
	 * 当值为-1时，表示选择所有符合条件的目标
	 * 
	 * @returns 选择目标的数量范围
	 */
	selectTarget?: BroadSelect | (() => BroadSelect);

	/**
	 * 选择目标的情况是否复杂
	 * 
	 * 当该值为`true`时，`filterTarget`和`selectTarget`将在每选择一个目标后重新计算
	 * 
	 * 默认为`false`
	 */
	complexTarget?: boolean;

	/**
	 * AI选择目标时的优先级评分函数
	 * 
	 * @param target - 选择的目标
	 * @RETURNS 选择该目标的优先级评分
	 */
	ai?(target: Player): number;
}

/**
 * 
 */
export interface CheckButtonParams {
	/**
	 * 选择的按钮需要满足的条件
	 * 
	 * @param button - 被选择的按钮
	 * @param player - 发起选择的玩家
	 * @returns 按钮是否符合条件
	 */
	filterButton?(button: Button, player: Player): boolean;

	/** 
	 * 需要选择按钮的范围
	 * 
	 * 当值为-1时，表示选择所有符合条件的按钮
	 * 
	 * @returns 选择按钮的数量范围
	 */
	selectButton?: BroadSelect | (() => BroadSelect);

	/**
	 * 是否允许选目标时可以使用全选/反选按钮
	 * 
	 * 当该值为`true`时，`filterButton`和`selectButton`将不再每选择一个按钮后重新计算
	 */
	allowChooseAll?: boolean;

	/**
	 * AI选择按钮时的优先级评分函数
	 * 
	 * @param button - 选择的按钮
	 * @RETURNS 选择该按钮的优先级评分
	 */
	ai?(button: Button): number;
}

/**
 * 
 */
export interface CheckCardTargetParams extends CheckCardParams, CheckTargetParams {
	ai?: undefined;

	/**
	 * AI选择牌时的优先级评分函数
	 * 
	 * @param card - 选择的牌
	 * @RETURNS 选择该牌的优先级评分
	 */
	ai1?(card: Card): number;

	/**
	 * AI选择目标时的优先级评分函数
	 * 
	 * @param target - 选择的目标
	 * @RETURNS 选择该目标的优先级评分
	 */
	ai2?(target: Player): number;
}

/**
 * 
 */
export interface CheckButtonTargetParams extends CheckButtonParams, CheckTargetParams {
	ai?: undefined;

	/**
	 * AI选择按钮时的优先级评分函数
	 * 
	 * @param button - 选择的按钮
	 * @RETURNS 选择该按钮的优先级评分
	 */
	ai1?(button: Button): number;

	/**
	 * AI选择目标时的优先级评分函数
	 * 
	 * @param target - 选择的目标
	 * @RETURNS 选择该目标的优先级评分
	 */
	ai2?(target: Player): number;
}

/**
 * 
 */
export interface ChooseBase {
	forced?: boolean;
	prompt?: string;
	prompt2?: string;
}

// 事件的具体选项
// TODO: 等各事件的作者自行补充注释

export interface EventConnectCardsParams {
	cards?: Card[];
	source?: Player;
	log?: boolean;
}

export interface EventResetConnectCardsParams {
	cards?: Card[];
	source?: Player;
	log?: boolean;
}

export interface EventAddShownCardsParams {
	cards?: Card[];
	gaintag?: string[];
}

export interface EventHideShownCardsParams {
	cards?: Card[];
	gaintag?: string[];
}

export interface EventDisableEquipParams {
	source?: Player;
	slots?: string[];
}

export interface EventEnableEquipParams {
	source?: Player;
	slots?: string[];
}

export interface EventExpandEquipParams {
	source?: Player;
	slots?: string[];
}

export interface EventChooseToDebateParams {
	list: Player[];
	args: any[]
}

export interface EventChooseCooperationForParams {
	target: Player;
	cardlist?: string[];
	reason?: string;
}

export interface EventChooseToMoveParams extends ChooseBase {
	forced?: boolean;
	allowChooseAll?: boolean;
}

export type EventChooseToMoveNewParams = ChooseBase;

export interface EventChooseToEnableParams extends CheckButtonParams {
	source?: Player;
}

export interface EventChooseToDisableParams extends CheckButtonParams {
	source?: Player;
	horse?: boolean;
}

export interface EventChooseToUseParams extends ChooseBase, CheckCardTargetParams {
	chooseonly?: boolean;
}

export interface EventChooseToRespondParams extends ChooseBase, CheckCardParams {
	nosource?: boolean;
	card?: VCard;
}

export interface EventChooseToGiveParams extends ChooseBase, CheckCardParams {
	target: Player,
	chooseonly?: boolean;
	dialog?: Dialog;
}

export interface EventChooseToDiscardParams extends ChooseBase, CheckCardParams {
	chooseonly?: boolean;
	dialog?: Dialog;
}

export interface EventChooseSkillParams extends ChooseBase {
	func?: (...args: any[]) => unknown;
}

export interface EventDiscoverCardParams extends ChooseBase {
	use?: boolean;
	nogain?: boolean;
	num?: number;
	ai?(card: Card): number;
}

export interface EventChooseCardButtonParams extends ChooseBase {
	cards: Card[];
	select?: BroadSelect | (() => BroadSelect);
	filter?(button: Button, player: Player): boolean;
	ai?(button: Button): number;
}

export interface EventChooseVCardButtonParams extends ChooseBase {
	list: string[];
	notype?: boolean;
	select?: BroadSelect | (() => BroadSelect);
	filter?(button: Button, player: Player): boolean;
	ai?(button: Button): number;
}

export interface EventChooseButtonParams extends ChooseBase, CheckButtonParams {
	complexSelect?: boolean;
	dialog?: Dialog;
	direct?: boolean;
	// TODO: 加类型
	createDialog?: any[];
}

export interface EventChooseCardOLParams {
	list?: Player[];
	args: any[];
}

export interface EventChooseCardParams extends ChooseBase, CheckCardParams {
	glow_result?: boolean;
}

export interface EventChooseUseTargetParams extends ChooseBase, CheckTargetParams {
	cards?: Card[];
	card?: Card | VCard;
	nopopup?: boolean;
	animate?: boolean;
	throw?: boolean;
	nodistance?: boolean;
	noTargetDelay?: boolean;
	nodelayx?: boolean;
	addCount?: boolean;
}

export interface EventChooseTargetParams extends ChooseBase, CheckTargetParams {
	dialog?: Dialog;
}

export interface EventChooseCardTargetParams extends ChooseBase, CheckCardTargetParams {}

export interface EventChooseButtonTargetParams extends ChooseBase, CheckButtonTargetParams {}

export interface EventChooseControlListParams extends ChooseBase {
	list?: string[];
	ai?(event: GameEvent, player: Player): string | number;
}

export interface EventChooseControlParams extends ChooseBase {
	forced?: undefined;
	controls?: string[];
	choiceList?: string[];
	choice?: number;
	dialog?: Dialog;
	dialogcontrol?: boolean;
	seperate?: boolean;
	ai?(event: GameEvent, player: Player): string | number;
}

export interface EventChooseBoolParams extends ChooseBase {
	choice?: boolean;
	dialog?: Dialog;
	ai?(event: GameEvent, player: Player): boolean;
}

export interface EventChooseDrawRecoverParams extends ChooseBase {
	num1?: number;
	num2?: number;
	target?: Player;
	gaintag?: string[];
	ai?(event: GameEvent, player: Player): "draw_card" | "recover_hp" | "cancel2";
}

export interface EventChooseNumbersParams extends ChooseBase {
	list: ChooseNumbersObject[];
	optionSum?: number;
	processAI?(event: GameEvent): false | number[];
	filterSelect?(num: number, index: number, event: GameEvent): boolean;
	filterOk?(event: GameEvent): boolean;
}

export interface EventChoosePlayerCardParams extends ChooseBase, CheckButtonParams {
	target: Player;
	position?: string;
	visible?: boolean;
	complexSelect?: boolean;
}

export type EventDiscardPlayerCardParams = EventChoosePlayerCardParams;
export type EventGainPlayerCardParams = EventChoosePlayerCardParams;

export interface EventMoveCardParams extends ChooseBase {
	sourceTargets?: Player[];
	aimTargets?: Player[];
	canReplace?: boolean;
	targetprompt?: string[];
	filter?(card: Card): boolean;
}

export interface EventUseCardParams {
	card: Card | VCard;
	cards?: Card[];
	targets: Player[];
	skill?: string;
	addCount?: boolean;
	noai?: boolean;
	nowuxie?: boolean;
}

export interface EventUseSkillParams {
	skill: string;
	card?: Card | VCard;
	cards?: Card[];
	targets?: Player[];
	addCount?: boolean;
}

export type EventDrawToParams = Omit<EventDrawParams, "num">

export interface EventDrawParams {
	num?: number;
	source?: Player;
	gaintag?: string[];
	drawDeck?: number;
	visible?: boolean;
	bottom?: boolean;
	nodelay?: boolean;
}

export interface EventRandomDiscardParams {
	/**
	 * 要弃置的牌数，默认为1
	 */
	num?: number;

	/**
	 * 弃牌来源，令Player弃牌的角色，默认目标角色
	 */
	discarder?: Player;

	/**
	 * 弃牌区域，默认 "he"
	 */
	position?: string;

	/**
	 * 是否纯随机，否则优先弃置能弃置的牌
	 */
	random?: boolean;

	/**
	 * 因对应Mod技能导致部分牌未被弃置时，是否为Mod技能执行对应函数。默认"popup"
	 */
	log?: string | "popup" | "logSkill" | false;
}

export interface EventLoseToDiscardpileParams {
	cards?: Card[];
	source?: Player;
	position?: HTMLDivElement | DocumentFragment;
	blank?: boolean;
	animate?: boolean;
	notBySelf?: boolean;
	insert_card?: boolean;
}
export interface EventRandomGainParams {
	/**
	 * 要获得牌的角色
	 */
	target: Player;

	/**
	 * 要获得的牌数，默认为1
	 */
	num?: number;

	/**
	 * 弃牌区域，默认 "he"
	 */
	position?: string;

	/**
	 * 是否在获取时显示指示线
	 */
	line?: boolean;
}

export interface EventDiscardParams {
	/**
	 * 要弃置的牌
	 */
	cards: Card[];

	/**
	 * 弃牌来源，令Player弃牌的角色
	 */
	discarder?: Player;

	/**
	 * 经Mod筛选后的牌要置入的区域，默认ui.discardPile
	 */
	position?: HTMLDivElement | DocumentFragment;

	/**
	 * 是否是他人弃置。discarder设置后会自动判断
	 */
	notBySelf?: boolean;
}

export interface EventModedDiscardParams {
	/**
	 * 要弃置的牌
	 */
	cards: Card[];

	/**
	 * 弃牌来源，令Player弃牌的角色。默认目标角色
	 */
	discarder?: Player;

	/**
	 * 经Mod筛选后的牌要置入的区域，默认`ui.discardPile`
	 */
	position?: HTMLDivElement | DocumentFragment;

	/**
	 * 因对应Mod技能导致部分牌未被弃置时，是否为Mod技能执行对应函数。默认`"popup"`
	 */
	log?: string | "popup" | "logSkill" | false;
}

export interface EventRespondParams {
	cards?: Card[];
	card?: Card | VCard;
	source?: Player;
	skill?: string;
	animate?: boolean;
	highlight?: boolean;
	noOrdering?: boolean;
}

export interface EventGainParams {
	cards?: Card[];
	source?: Player;
	animate?: string;
	gaintag?: string[];
	log?: boolean;
	areaNames?: string[];
	fromStorage?: boolean;
	bySelf?: boolean;
	delay?: boolean;
}

export interface EventAddToExpansionParams {
	cards?: Card[];
	source?: Player;
	gaintag?: string[];
	animate?: string;
	fromStorage?: boolean;
	areaNames?: string[];
	log?: boolean;
	bySelf?: boolean;
	delay?: boolean;
}

export interface EventLoseParams {
	source?: Player;
	cards?: Card[];
	position?: HTMLDivElement | DocumentFragment;
	toStorage?: boolean;
	areaNames?: string[];
	visible?: boolean;
	insert_card?: boolean;
}

export interface EventDamageParams {
	cards?: Card[];
	card?: Card | VCard;
	num?: number;
	source?: Player;
	nature?: string;
	notrigger?: boolean;
	nocard?: boolean;
	nosource?: boolean;
	nohujia?: boolean;
	unreal?: boolean;
}

export interface EventRecoverParams {
	num?: number;
	card?: Card | VCard;
	cards?: Card[];
	source?: Player;
	nocard?: boolean;
	nosource?: boolean;
}

export type EventRecoverToParams = Omit<EventRecoverParams, "num">;


export interface EventLoseMaxHpParams {
	num?: number;
	forced?: boolean;
}

export interface EventGainMaxHpParams {
	num?: number;
	forced?: boolean;
}

export interface EventJudgeParams {
	card?: Card | VCard;
	skill?: string;
	clearArena?: boolean;
	position?: HTMLDivElement | DocumentFragment;
	judge?(card: Card): number;
	judge2?(result: Partial<Result>): boolean;
}

// 一些不暴露的类型

interface ChooseNumbersObject {
	prompt: string;
	min: number;
	max: number;
}
