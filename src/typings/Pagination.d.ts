interface PaginationState {
    /** 储存的数据 */
    data: any[];
	/** 当前页数 */
	pageNumber: number;
	/** 总页数 */
	totalPageCount: number;
	/** 页面元素的外部容器 */
	container: (keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap | keyof MathMLElementTagNameMap | keyof HTMLElementDeprecatedTagNameMap | string & {}) | HTMLElement;
    /** 页面元素要添加到容器的哪个子元素后面 */
    insertAfter?: (keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap | keyof MathMLElementTagNameMap | keyof HTMLElementDeprecatedTagNameMap | string & {}) | HTMLElement;
	/** 不包括开头和结尾的两个固定按钮外，中间最多展示几个数字页码按钮 */
	maxShowBtnCount: number;
	/** 所有的页码元素的class样式名，包括上一页、下一页 */
	pCName: string;
	/** 当选中页码时添加的类名class */
	activeCName: string;
	/** 代表页码数字的属性(元素的Attribute) */
	dataNumberAttr: string;
	/** 上一页按钮的类名class */
	prevCName: string;
	/** 下一页按钮的类名class */
	nextCName: string;
	/** 禁用上一页按钮时给此按钮添加的类名class(即当前为第一页) */
	disbalePrevCName: string;
	/** 禁用下一页按钮时给此按钮添加的类名class(即当前为最后一页) */
	disbaleNextCName: string;
	/** 按钮的页码元素类名(不包括上一页/下一页/省略号) */
	pageNumberCName: string;
	/** 触发切换页面的事件名 */
	changePageEvent: keyof GlobalEventHandlersEventMap;
	/** 切换页面时调用的函数 */
	onPageChange?: (state: PaginationState) => any;
	/** 当前active的位置 */
	activePosition?: number;
	/** 翻页页数的具体显示数组（默认为数字） */
	pageNumberForCN?: any[];
	/** 最左边和最右边的翻页显示（默认为“上一页”和“下一页”） */
	pageLimitForCN?: any[];
	/** 是否禁止翻页 */
	pageRefuseChanged?: boolean;
	/** 载入翻页属性的额外元素 */
	pageElement?: object;
}