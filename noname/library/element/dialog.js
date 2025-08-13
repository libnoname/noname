import { get } from "../../get/index.js";
import { lib } from "../index.js";
import { _status } from "../../status/index.js";
import { ui } from "../../ui/index.js";
import { game } from "../../../noname.js";
import { Pagination } from "../../util/pagination.js";

export class Dialog extends HTMLDivElement {
	/** @type { HTMLDivElement } */
	// eslint-disable-next-line no-unreachable
	contentContainer;
	/** @type { HTMLDivElement } */
	content;
	/** @type { HTMLDivElement } */
	bar1;
	/** @type { HTMLDivElement } */
	bar2;
	/** @type { Button[] } */
	buttons;
	/** @type { boolean } */
	static;
	/** @type { boolean } */
	noforcebutton;
	/** @type { boolean } */
	peaceDialog;
	/** @type { boolean } */
	noopen;
	/**
	 * dialog添加数据是否支持分页
	 * @type { boolean }
	 **/
	supportsPagination;
	/**
	 * dialog中储存的分页元素(用来兼容一个dialog中多个分页的情况)
	 * @type { Map<HTMLElement, InstanceType<typeof import("../../util/pagination.js").Pagination>> }
	 */
	paginationMap;
	/**
	 * 根据数据类型，为每一个类型分配一页的最大数据量
	 * @type { Map<keyof UI['create']['buttonPresets'], number> }
	 */
	paginationMaxCount;
	// @ts-expect-error ignore
	constructor(...args) {
		if (args[0] instanceof Dialog) {
			const other = args[0];
			// @ts-expect-error ignore
			args = other._args;
		}

		let hidden = false;
		let noTouchScroll = false;
		let forceButton = false;
		let noForceButton = false;
		let peaceDialog = false;
		/** @type { this } */
		// @ts-expect-error ignore
		const dialog = ui.create.div(".dialog");
		Object.setPrototypeOf(dialog, (lib.element.Dialog || Dialog).prototype);
		dialog.supportsPagination = false;
		dialog.paginationMap = new Map();
		dialog.paginationMaxCount = new Map();
		dialog.contentContainer = ui.create.div(".content-container", dialog);
		dialog.content = ui.create.div(".content", dialog.contentContainer);
		dialog.bar1 = ui.create.div(".bar.top", dialog);
		dialog.bar2 = ui.create.div(".bar.bottom", dialog);
		dialog.buttons = [];
		Array.from(args).forEach(argument => {
			if (typeof argument == "boolean") {
				dialog.static = argument;
			} else if (argument == "hidden") {
				hidden = true;
			} else if (argument == "notouchscroll") {
				noTouchScroll = true;
			} else if (argument == "forcebutton") {
				forceButton = true;
			} else if (argument == "noforcebutton") {
				noForceButton = true;
			} else if (argument == "peaceDialog") {
				peaceDialog = true;
			} else {
				dialog.add(argument);
			}
		});
		//if (!hidden) dialog.open();
		if (!lib.config.touchscreen) {
			dialog.contentContainer.onscroll = ui.update;
		}
		if (!noTouchScroll) {
			dialog.contentContainer.ontouchstart = ui.click.dialogtouchStart;
			dialog.contentContainer.ontouchmove = ui.click.touchScroll;
			// @ts-expect-error ignore
			dialog.contentContainer.style.webkitOverflowScrolling = "touch";
			dialog.ontouchstart = ui.click.dragtouchdialog;
		}
		if (noForceButton) {
			dialog.noforcebutton = true;
		} else if (forceButton) {
			dialog.forcebutton = true;
			dialog.classList.add("forcebutton");
		}
		if (peaceDialog) {
			dialog.peaceDialog = true;
		}
		// @ts-expect-error ignore
		dialog._args = args;
		return dialog;
	}
	/**
	 * 添加分页组件到页面
	 * @param {Pagination} state - 分页组件的配置对象
	 */
	addPagination(state = {}) {
		// 传入初始配置
		const p = new Pagination(state);
		this.paginationMap.set(state.insertAfter, p);
		// 渲染元素
		p.renderPageDOM();
	}
	/**
	 *
	 * @param  {RowItem[]} args
	 */
	addNewRow(...args) {
		this.classList.add("addNewRow");
		this.classList.remove("nobutton");
		//参数归一化
		let itemOptions = parameterNormolize();
		//设置比例字符串
		let ratioStr = itemOptions.map(o => o.ratio || 1).join("fr ") + "fr";
		//定义一个属性记录加入的所有的框，框的links是加入时真实数据，方便最后获取数据，这里可以设计一下别的数据格式向外暴露结果
		if (!this.itemContainers) {
			this.itemContainers = [];
		}
		let that = this;
		//创建一个行的父容器
		let rowContainer = createRowContainer(this);
		//遍历参数
		for (let itemOption of itemOptions) {
			//为每个列创建一个子容器
			let itemContainer = createItemContainer(itemOption);
			//将项目加入到每个子容器中
			let item = itemOption.item;
			let addedItems = addItemToItemContainer(item, itemContainer, itemOption);
			//注册点击事件
			BindEvent(itemOption, addedItems, itemContainer);
			//检查溢出处理的逻辑
			checkOverflow(itemOption, itemContainer, addedItems);
			//自定义添加元素
			if (itemOption.custom) {
				itemOption.custom(itemContainer);
			}
			observeItemContainer(itemOption, itemContainer);
			this.itemContainers.push(itemContainer);
		}
		//监视容器，实现当itemcontainer的子元素发生变化时，重新调用checkOverflow
		function observeItemContainer(itemOption, itemContainer) {
			itemContainer.Observer = new MutationObserver(mutationsList => {
				for (const mutation of mutationsList) {
					if (mutation.type === "childList") {
						checkOverflow(itemOption, itemContainer, Array.from(itemContainer.querySelectorAll(".item")));
					}
				}
			});
			itemContainer.Observer.observe(itemContainer, { childList: true });
		}
		function createItemContainer(itemOption) {
			let itemContainer = ui.create.div(".item-container", rowContainer);
			itemContainer.originWidth = itemContainer.getBoundingClientRect().width;
			itemContainer.links = itemOption.item;
			if (itemOption.itemContainerCss) {
				itemContainer.css(itemOption.itemContainerCss);
			}
			return itemContainer;
		}
		function BindEvent(itemOption, addedItems, itemContainer) {
			if (itemOption.clickItem && !itemOption.ItemNoclick) {
				addedItems.forEach(item => {
					item.addEventListener("click", ev => {
						ev.stopPropagation();
						itemOption.clickItem(item, itemContainer, that.itemContainers, ev);
					});
				});
			}
			if (itemOption.clickItemContainer) {
				itemContainer.addEventListener("click", e => {
					e.stopPropagation();
					itemOption.clickItemContainer(itemContainer, itemOption.item, that.itemContainers, e);
				});
			}
		}
		function checkOverflow(itemOption, itemContainer, addedItems) {
			if (itemOption.overflow == "scroll") {
				itemContainer.css({ overflowX: "scroll" });
			} else if (itemOption.overflow == "hidden") {
				itemContainer.css({ overflow: "hidden" });
			} else if (addedItems?.length) {
				game.callHook("checkOverflow", [itemOption, itemContainer, addedItems, game]);
			}
		}
		function parameterNormolize() {
			let itemOptions = [];
			if (args.length == 0) {
				throw new Error("参数不能为空");
			} else if (args.length == 1) {
				if (isOption(args[0])) {
					itemOptions = [args[0]];
				} else {
					itemOptions = [
						{
							item: args[0],
						},
					];
				}
			} else {
				if (args.every(arg => isOption(arg))) {
					itemOptions = args;
				} else {
					itemOptions = args.map(arg => {
						return {
							item: arg,
						};
					});
				}
			}
			return itemOptions;
		}
		function isOption(obj) {
			if (["card", "player", "cards", "players"].includes(get.itemtype(obj))) {
				return false;
			}
			return typeof obj == "object" && "item" in obj;
		}
		function createRowContainer(dialog) {
			let rowContainer = ui.create.div(".row-container", dialog.content);
			rowContainer.css({
				gridTemplateColumns: ratioStr,
			});
			return rowContainer;
		}
		//添加元素到子容器中，并返回添加后的元素
		function addItemToItemContainer(item, itemContainer, itemOption) {
			if (!item || (Array.isArray(item) && !item.length)) {
				itemContainer.classList.add("popup");
				return;
			}
			/**@type {HTMLDivElement[]} */
			let items = [];
			if (typeof item == "string") {
				let caption = ui.create.caption(item, itemContainer);
				caption.css(itemOption.itemCss ?? {});
				items.push(caption);
			} else if (!Array.isArray(item)) {
				itemContainer.classList.add("popup");
				let button = ui.create.button(item, get.itemtype(item), itemContainer, itemOption.ItemNoclick);
				button.css(itemOption.itemCss ?? {});
				if (item._custom) {
					item._custom(button);
				}
				items.push(button);
			} else {
				for (let i of item) {
					items.addArray(addItemToItemContainer(i, itemContainer, itemOption));
				}
			}
			items.forEach(item => {
				item.classList.add("item");
			});
			return items;
		}
	}
	/**
	 *
	 * @param { string | HTMLDivElement | Card[] | Player[] } item
	 * @param {*} [noclick]
	 * @param { boolean } [zoom]
	 */
	add(item, noclick, zoom) {
		if (typeof item == "string") {
			if (item.startsWith("###")) {
				const items = item.slice(3).split("###");
				this.add(items[0], noclick, zoom);
				this.addText(items[1], items[1].length <= 20, zoom);
			} else if (noclick) {
				const strstr = item;
				item = ui.create.div("", this.content);
				item.innerHTML = strstr;
			} else {
				item = ui.create.caption(item, this.content);
			}
		}
		// @ts-expect-error ignore
		else if (["div", "fragment"].includes(get.objtype(item))) {
			// @ts-expect-error ignore
			this.content.appendChild(item);
		}
		// @ts-expect-error ignore
		else if (get.itemtype(item) == "cards") {
			const buttons = ui.create.div(".buttons", this.content);
			if (zoom) {
				buttons.classList.add("smallzoom");
			}
			// @ts-expect-error ignore
			this.buttons = this.buttons.concat(ui.create.buttons(item, "card", buttons, noclick));
		}
		// @ts-expect-error ignore
		else if (get.itemtype(item) == "players") {
			var buttons = ui.create.div(".buttons", this.content);
			if (zoom) {
				buttons.classList.add("smallzoom");
			}
			// @ts-expect-error ignore
			this.buttons = this.buttons.concat(ui.create.buttons(item, "player", buttons, noclick));
		} else if (item[1] == "textbutton") {
			ui.create.textbuttons(item[0], this, noclick);
		} else if (item[1] == "skill") {
			var buttons = ui.create.div(".buttons", this.content);
			if (zoom) {
				buttons.classList.add("smallzoom");
			}
			// @ts-expect-error ignore
			this.buttons = this.buttons.concat(ui.create.buttons(item[0], "skill", buttons, noclick));
		} else {
			var buttons = ui.create.div(".buttons", this.content);
			if (zoom) {
				buttons.classList.add("smallzoom");
			}
			// @ts-expect-error ignore
			this.buttons = this.buttons.concat(ui.create.buttons(item[0], item[1], buttons, noclick));
		}
		if (this.buttons.length) {
			if (this.forcebutton !== false) {
				this.forcebutton = true;
			}
			if (this.buttons.length > 3 || (zoom && this.buttons.length > 5)) {
				this.classList.remove("forcebutton-auto");
			} else if (!this.noforcebutton) {
				this.classList.add("forcebutton-auto");
			}
		}
		ui.update();
		return item;
	}
	/**
	 * @param { string } str
	 * @param { boolean } [center]
	 */
	addText(str, center) {
		if (str && str.startsWith("<div")) {
			this.add(str);
		} else if (center !== false) {
			this.add('<div class="text center">' + str + "</div>");
		} else {
			this.add('<div class="text">' + str + "</div>");
		}
		return this;
	}

	addSmall(item, noclick) {
		return this.add(item, noclick, true);
	}
	addAuto(content) {
		// @ts-expect-error ignore
		if (content && content.length > 4 && !this._hovercustomed) {
			this.addSmall(content);
		} else {
			this.add(content);
		}
	}
	open() {
		if (this.noopen) {
			return;
		}
		for (let i = 0; i < ui.dialogs.length; i++) {
			if (ui.dialogs[i] == this) {
				this.show();
				this.refocus();
				ui.dialogs.remove(this);
				ui.dialogs.unshift(this);
				ui.update();
				return this;
			}
			if (!this.peaceDialog) {
				if (ui.dialogs[i].static) {
					ui.dialogs[i].unfocus();
				} else {
					ui.dialogs[i].hide();
				}
			}
		}
		ui.dialog = this;
		let translate;
		if (lib.config.remember_dialog && lib.config.dialog_transform && !this.classList.contains("fixed")) {
			translate = lib.config.dialog_transform;
			this._dragtransform = translate;
			this.style.transform = "translate(" + translate[0] + "px," + translate[1] + "px) scale(0.8)";
		} else {
			this.style.transform = "scale(0.8)";
		}
		this.style.transitionProperty = "opacity,transform";
		this.style.opacity = "0";
		ui.arena.appendChild(this);
		ui.dialogs.unshift(this);
		ui.update();
		ui.refresh(this);
		if (lib.config.remember_dialog && lib.config.dialog_transform && !this.classList.contains("fixed")) {
			this.style.transform = "translate(" + translate[0] + "px," + translate[1] + "px) scale(1)";
		} else {
			this.style.transform = "scale(1)";
		}
		this.style.opacity = "1";
		setTimeout(() => {
			this.style.transitionProperty = "";
		}, 500);
		return this;
	}
	close() {
		ui.dialogs.remove(this);
		this.delete();
		if (ui.dialogs.length > 0) {
			ui.dialog = ui.dialogs[0];
			ui.dialog.show();
			ui.dialog.refocus();
			ui.update();
		}
		// if(ui.arenalog){
		// 	ui.arenalog.classList.remove('withdialog');
		// }
		return this;
	}
	/**
	 * @param { string } str
	 */
	setCaption(str) {
		// @ts-expect-error ignore
		this.querySelector(".caption").innerHTML = str;
		return this;
	}
}
