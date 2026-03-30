declare type CardBaseUIData = {
	name?: string;
	suit?: string;
	number?: number;
	nature?: string | null;

	//用于某些方法，用于过滤卡牌的额外结构
	type?: string | string[];
	subtype?: string;
	color?: string;

	/** 
	 * 是否时视为牌 
	 * 
	 * 是本来的卡牌，则为true,作为视为牌则为false/undefined
	 * 在useCard使用时，作为视为牌，会把next.cards,设置为card.cards;
	 * 
	 */
	isCard?: boolean;

	/** 真实使用的卡牌 */
	cards?: Card[];
}