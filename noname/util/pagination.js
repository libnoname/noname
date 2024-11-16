/*
 * https://github.com/accforgit/blog-data/blob/master/%E7%AE%80%E5%8D%95%E5%88%86%E9%A1%B5/demo/index.html
 */

import { lib } from "../../noname.js";

/**
 * 简单分页类
 */
export class Pagination {
	/** 是否加载了分页类对应的css文件 */
	static loaded = false;
	/** @type { HTMLUListElement } 渲染的dom元素 */
	element;
	/**
	 * @type { PaginationState }
	 */
	state = {
		data: [],
		pageNumber: 1,
		totalPageCount: 1,
		container: "body",
		maxShowBtnCount: 3,
		pCName: "page-li",
		activeCName: "page-active",
		dataNumberAttr: "data-number",
		prevCName: "page-prev",
		nextCName: "page-next",
		disbalePrevCName: "no-prev",
		disbaleNextCName: "no-next",
		pageNumberCName: "page-number",
		changePageEvent: "click",
	};
	/**
	 * @param { Partial<PaginationState> } paramsObj
	 */
	constructor(paramsObj = {}) {
		if (!Pagination.loaded) {
			Pagination.loaded = true;
			lib.init.css(lib.assetURL + "layout/default/pagination.css");
		}
		let { state } = this;
		for (const [key, value] of Object.entries(paramsObj)) {
			state[key] = value;
		}
		if (state.totalPageCount > state.maxShowBtnCount + 2) {
			state.activePosition = Math.ceil(state.maxShowBtnCount / 2);
		}
	}
	/** 切换页码并设置按钮点击事件 */
	switchPage() {
		let { state } = this;
		let pCNameList = this.selectorEle("." + state.pCName, true);
		let pageNumber;
		if (!pCNameList) {
			console.error(`未找到类名为${"." + state.pCName}的元素`);
			return;
		}
		pCNameList.forEach(item => {
			item.addEventListener(state.changePageEvent, (/** @type { Event } */ e) => {
				/** @type { HTMLElement } */
				// @ts-ignore
				const currentPageEle = e.target;
				// 点击的是当前页数不进行操作
				if (this.hasClass(currentPageEle, state.activeCName)) return;
				let dataNumberAttr = currentPageEle.getAttribute(state.dataNumberAttr);
				// 点击数字按钮
				if (dataNumberAttr) {
					pageNumber = +dataNumberAttr;
				}
				// 点击上一页按钮
				else if (this.hasClass(currentPageEle, state.prevCName)) {
					state.pageNumber > 1 && (pageNumber = state.pageNumber - 1);
				}
				// 点击下一页按钮
				else if (this.hasClass(currentPageEle, state.nextCName)) {
					state.pageNumber < state.totalPageCount && (pageNumber = state.pageNumber + 1);
				}
				if (pageNumber) {
					this.gotoPage(pageNumber);
				}
			});
		});
	}
	/**
	 * 跳转页数
	 * @param { number } pageNumber
	 */
	gotoPage(pageNumber) {
		let { state } = this;
		let evaNumberLi = this.selectorEle("." + state.pageNumberCName, true);
		if (!evaNumberLi) {
			console.error(`未找到类名为${"." + state.pageNumberCName}的元素`);
			return;
		}
		let len = evaNumberLi.length;
		// 不合法的页数
		if (len === 0 || this.isIllegal(pageNumber)) {
			return;
		}
		if (state.pageNumber !== pageNumber) {
			// 清除 active 样式
			const active = this.selectorEle(`.${state.pCName}.${state.activeCName}`);
			if (active) this.removeClass(active, state.activeCName);
			if (state.activePosition) {
				let rEllipseSign = state.totalPageCount - (state.maxShowBtnCount - state.activePosition) - 1;
				// 左边不需要出现省略符号占位
				if (pageNumber <= state.maxShowBtnCount && pageNumber < rEllipseSign) {
					if (+(evaNumberLi[1].getAttribute(state.dataNumberAttr) || 0) > 2) {
						for (let i = 1; i < state.maxShowBtnCount + 1; i++) {
							let value = String(i + 1);
							// @ts-ignore
							evaNumberLi[i].innerText = value;
							evaNumberLi[i].setAttribute(state.dataNumberAttr, value);
						}
					}
					this.hiddenEllipse(".ellipsis-head");
					this.hiddenEllipse(".ellipsis-tail", false);
					this.addClass(evaNumberLi[pageNumber - 1], state.activeCName);
				}
				// 两边都需要出现省略符号占位
				if (pageNumber > state.maxShowBtnCount && pageNumber < rEllipseSign) {
					// 针对 maxShowBtnCount===1 的特殊处理
					this.hiddenEllipse(".ellipsis-head", pageNumber === 2 && state.maxShowBtnCount === 1);
					this.hiddenEllipse(".ellipsis-tail", false);
					for (let i = 1; i < state.maxShowBtnCount + 1; i++) {
						let value = String(pageNumber + (i - state.activePosition));
						// @ts-ignore
						evaNumberLi[i].innerText = value;
						evaNumberLi[i].setAttribute(state.dataNumberAttr, value);
					}
					this.addClass(evaNumberLi[state.activePosition], state.activeCName);
				}
				// 右边不需要出现省略符号占位
				if (pageNumber >= rEllipseSign) {
					this.hiddenEllipse(".ellipsis-tail");
					this.hiddenEllipse(".ellipsis-head", false);
					if (+(evaNumberLi[len - 2].getAttribute(state.dataNumberAttr) || 0) < state.totalPageCount - 1) {
						for (let i = 1; i < state.maxShowBtnCount + 1; i++) {
							let value = String(state.totalPageCount - (state.maxShowBtnCount - i) - 1);
							// @ts-ignore
							evaNumberLi[i].innerText = value;
							evaNumberLi[i].setAttribute(state.dataNumberAttr, value);
						}
					}
					const active = Array.from(evaNumberLi).find(item => item.getAttribute(state.dataNumberAttr) === String(pageNumber));
					if (active) this.addClass(active, state.activeCName);
				}
			} else {
				// 不需要省略符号占位
				this.addClass(evaNumberLi[pageNumber - 1], state.activeCName);
			}
			state.pageNumber = pageNumber;
		}
		state.onPageChange && state.onPageChange(state);
		// 判断 上一页 下一页 是否可使用
		this.switchPrevNextAble();
	}
	/** 设置上一页下一页按钮合法性 */
	switchPrevNextAble() {
		let { state } = this;
		let prevBtn = this.selectorEle("." + state.prevCName);
		let nextBtn = this.selectorEle("." + state.nextCName);
		if (!prevBtn) {
			console.error(`未找到上一页按钮的元素`);
			return;
		}
		if (!nextBtn) {
			console.error(`未找到下一页按钮的元素`);
			return;
		}
		// 当前页已经是第一页，则禁止 上一页 按钮的可用性
		state.pageNumber > 1 ? this.hasClass(prevBtn, state.disbalePrevCName) && this.removeClass(prevBtn, state.disbalePrevCName) : !this.hasClass(prevBtn, state.disbalePrevCName) && this.addClass(prevBtn, state.disbalePrevCName);
		// 当前页已经是最后一页，则禁止 下一页 按钮的可用性
		state.pageNumber >= state.totalPageCount ? !this.hasClass(nextBtn, state.disbaleNextCName) && this.addClass(nextBtn, state.disbaleNextCName) : this.hasClass(nextBtn, state.disbaleNextCName) && this.removeClass(nextBtn, state.disbaleNextCName);
	}
	/** 渲染Dom */
	renderPageDOM() {
		let { state } = this;
		let pageContainer = state.container instanceof Element ? state.container : document.querySelector(state.container);
		if (!pageContainer) {
			console.error(`未根据配置找到父元素`);
			return;
		}

		if (this.element instanceof HTMLElement && pageContainer.contains(this.element)) {
			pageContainer.removeChild(this.element);
			// @ts-ignore
			this.element = void 0;
		}

		let { totalPageCount, pCName, prevCName, disbalePrevCName, pageNumber, pageNumberCName, activeCName, dataNumberAttr, maxShowBtnCount, nextCName, disbaleNextCName } = state;

		let paginationStr = `
				<ul class="pagination">
					<li class="${pCName} ${prevCName} ${disbalePrevCName}">上一页</li>
					<li class="${pCName} ${pageNumberCName} ${activeCName}" ${dataNumberAttr}='1'>1</li>
			`;
		if (totalPageCount - 2 > maxShowBtnCount) {
			paginationStr += `<li class="${pCName} number-ellipsis ellipsis-head" style="display: none;">...</li>`;
			for (let i = 2; i < maxShowBtnCount + 2; i++) {
				paginationStr += `<li class="${pCName} ${pageNumberCName} ${i === 1 ? activeCName : ""}" ${dataNumberAttr}='${i}'>${i}</li>`;
			}
			paginationStr += `
				<li class="${pCName} number-ellipsis ellipsis-tail">...</li>
				<li class="${pCName} ${pageNumberCName}" ${dataNumberAttr}='${totalPageCount}'>${totalPageCount}</li>
			`;
		} else {
			for (let i = 2; i <= totalPageCount; i++) {
				paginationStr += `<li class="${pCName} ${pageNumberCName}" ${dataNumberAttr}='${i}'>${i}</li>`;
			}
		}
		paginationStr += `<li class="${pCName} ${nextCName}${totalPageCount === 1 ? " " + disbaleNextCName : ""}">下一页</li></ul>`;
		
		if (state.insertAfter) {
			let afterElement = state.insertAfter instanceof Element ? state.insertAfter : document.querySelector(state.insertAfter);
			if (!afterElement || !pageContainer.contains(afterElement)) {
				console.error(`未根据配置找到兄弟元素，元素将添加到父元素结尾`);
				pageContainer.insertAdjacentHTML("beforeend", paginationStr);
				// @ts-ignore
				this.element = pageContainer.lastElementChild;
			} else {
				afterElement.insertAdjacentHTML("afterend", paginationStr);
				// @ts-ignore
				this.element = afterElement.nextElementSibling;
				// @ts-ignore
				this.element.style.position = 'static';
			}
		} else {
			pageContainer.insertAdjacentHTML("beforeend", paginationStr);
			// @ts-ignore
			this.element = pageContainer.lastElementChild;
		}

		// 在dialog中使用分页，将应用shadowed这个css类名以靠近dialog样式
		let ele = this.element;
		while (ele !== null) {
			// @ts-ignore
			if (ele.classList.contains('dialog')) {
				// @ts-ignore
				Array.from(this.element.children).forEach(item => {
					if (item.classList.contains("number-ellipsis") || item.classList.contains("ellipsis-tail")) return;
					item.classList.add("shadowed");
				});
				break;
			}
			if (ele === document.body) break;
			// @ts-ignore
			ele = ele.parentNode;
		}
		this.switchPage();
		this.gotoPage(pageNumber);
	}
	/**
	 * 判断按钮合法性
	 * @param { number } pageNumber
	 */
	isIllegal(pageNumber) {
		let { state } = this;
		return /*state.pageNumber === pageNumber || */Math.ceil(pageNumber) !== pageNumber || pageNumber > state.totalPageCount || pageNumber < 1 || typeof pageNumber !== "number" || pageNumber !== pageNumber;
	}
	/**
	 * 隐藏/显示省略符号占位
	 * @param { string } selector
	 **/
	hiddenEllipse(selector, shouldHidden = true) {
		/** @type { HTMLElement } */
		// @ts-ignore
		const element = this.selectorEle(selector);
		if (element) {
			element.style.display = shouldHidden ? "none" : "";
		}
	}
	/**
	 * @overload
	 * @param { string } selector
	 * @returns { ReturnType<typeof document['querySelector']> }
	 */
	/**
	 * @overload
	 * @param { string } selector
	 * @param { boolean } [all]
	 * @returns { ReturnType<typeof document['querySelectorAll']> }
	 */
	selectorEle(selector, all = false) {
		// return all ? document.querySelectorAll(selector) : document.querySelector(selector);
		const dom = this.element || document;
		return all ? dom.querySelectorAll(selector) : dom.querySelector(selector);
	}
	/**
	 * @param { Element } eleObj
	 * @param { string } className
	 */
	hasClass(eleObj, className) {
		return eleObj.classList.contains(className);
	}
	/**
	 * @param { Element } eleObj
	 * @param { string } className
	 */
	addClass(eleObj, className) {
		eleObj.classList.add(className);
	}
	/**
	 * @param { Element } eleObj
	 * @param { string } className
	 */
	removeClass(eleObj, className) {
		if (this.hasClass(eleObj, className)) {
			eleObj.classList.remove(className);
		}
	}
	/**
	 * 自行添加的修改总页数的方法
	 *
	 * @param { number } totalPageCount
	 */
	setTotalPageCount(totalPageCount) {
		let { state } = this;
		state.pageNumber = 1;
		state.totalPageCount = totalPageCount;
		if (state.totalPageCount > state.maxShowBtnCount + 2) {
			state.activePosition = Math.ceil(state.maxShowBtnCount / 2);
		}
		this.renderPageDOM();
	}
}
