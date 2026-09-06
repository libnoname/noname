declare interface Result {
	/**
	 * 最终结果
	 * 
	 * 大多代表该事件到达这一步骤过程中的结果;
	 * 一般用来标记当前事件是否按预定执行的，即执行成功
	 * 
	 * 大部分事件间接接触game.check，一般最终结果不变，大多数是这种
	 * 
	 * 其实主要是ok方法会有直接的bool，主要涉及game.check;
	 */
	bool?: boolean;

	//choose系
	/** 记录返回当前事件操作过程中的卡牌 */
	cards: Card[];
	/** 记录返回当前事件操作过程中的目标 */
	targets: Player[];
	/** 记录返回当前事件操作过程中的按钮 */
	buttons: Button[];
	/** 记录buttons内所有button.link(即该按钮的类型，link的类型很多，参考按钮的item) */
	links: any[];

	//control系(直接control系列没有result.bool)
	/** control操作面板的选中结果，即该按钮的link，即名字 */
	control: string;
	/** 既control的下标 */
	index: number;

	//ok系
	/** 记录返回当前事件操作过程中，面板按钮的确定ok取消cancel */
	confirm: string;
	/** 一般为触发的“视为”技能 */
	skill: string;
	/**
	 *  当前事件操作的“视为”牌，
	 * 当前有“视为”操作，该card参数特供给视为牌，不需要cards[0]获取视为牌 ；
	 * 判断是否为视为牌：card.isCard，false为视为牌
	 */
	card: Card | CardBaseUIData;

	
	cost_data: Record<string, any>;

	[key: string]: any;
}