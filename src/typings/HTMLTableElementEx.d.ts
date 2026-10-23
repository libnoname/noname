interface HTMLTableElement {
	/**
	 * 获取该div下表结构row行，col列的元素
	 * @param row 
	 * @param col 
	 */
	get(row: number, col: number): HTMLElement | void;
}