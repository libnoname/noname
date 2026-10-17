import { ui, game, get, lib, _status } from "noname";
import { createApp, markRaw } from "vue";

import ConfigItem from "./ConfigItem.vue";

export function openMenu(node, e, onclose) {
	popupContainer.innerHTML = "";
	var left = Math.round(e.clientX / get.menuZoom());
	var zoom = get.is.phoneLayout() ? 1.3 : 1;
	popupContainer.appendChild(node);
	// var rect=node.getBoundingClientRect();
	if (node.classList.contains("visual")) {
		// var num=node.querySelectorAll('.menu.visual>div').length;
		// node.style.top=(e.y-node.offsetHeight/2+30)+'px';
		for (var i = 0; i < node.childElementCount; i++) {
			if (node.childNodes[i].update) {
				node.childNodes[i].update();
			}
		}
		// if(node.offsetTop<10){
		// 	node.style.top='10px';
		// }
	}
	// else if(get.is.phoneLayout()&&rect.top*1.3+rect.height*1.3+20>ui.window.offsetHeight){
	// 	node.style.top=(ui.winheightdow.offsetHeight-20-rect.height*1.3)/1.3+'px';
	// }
	// if(e){
	var height = node.offsetHeight;
	var idealtop = e.clientY / get.menuZoom();
	if (idealtop < 10) {
		idealtop = 10;
	} else if ((idealtop + height) * zoom + 10 > ui.window.offsetHeight) {
		idealtop = (ui.window.offsetHeight - 10) / zoom - height;
	}
	node.style.top = idealtop + "px";
	node.style.left = left + "px";
	// }

	popupContainer.classList.remove("hidden");
	popupContainer.onclose = onclose;
}
export function clickToggle() {
	if (this.classList.contains("disabled")) {
		return;
	}
	this.classList.toggle("on");
	var config = this._link.config;
	if (config.onclick) {
		if (config.onclick.call(this, this.classList.contains("on")) === false) {
			this.classList.toggle("on");
		}
	}
	if (config.update) {
		config.update();
	}
}
export function clickSwitcher() {
	this._link.clickSwitcher();
}
/**
 * @this { HTMLDivElement } menuContainer
 */
export function clickContainer(connectMenu) {
	this.classList.add("hidden");
	if (connectMenu) {
		if (_status.enteringroom) {
			_status.enteringroom = false;
		}
		if (_status.creatingroom) {
			_status.creatingroom = false;
		}
		ui.window.classList.remove("shortcutpaused");
	} else {
		game.resume2();
		if (game.onresume2) {
			game.onresume2();
		}
		ui.arena.classList.remove("menupaused");
		ui.historybar.classList.remove("menupaused");
		ui.window.classList.remove("touchinfohidden");
		ui.config2.classList.remove("pressdown2");
	}
}
export function clickMenuItem() {
	var node = this.parentNode._link;
	node._link.clickMenuItem(this);
}
export function createMenu(connectMenu, tabs, config) {
	var createPage = function (position) {
		var node = ui.create.div(position);
		lib.setScroll(ui.create.div(".left.pane", node));
		lib.setScroll(ui.create.div(".right.pane", node));
		return node;
	};
	var menu = ui.create.div(".main.menu.dialog.popped.static", config.position, function (e) {
		e.stopPropagation();
	});
	if (connectMenu) {
		menu.classList.add("center");
		menuContainer.classList.add("centermenu");
	}
	var menuTab = ui.create.div(".menu-tab", menu);
	var menuTabBar = ui.create.div(".menu-tab-bar", menu);
	menuTabBar.style.left = (config.bar || 0) + "px";
	if (Math.round(2 * get.menuZoom()) < 2) {
		menuTabBar.style.height = "3px";
	}
	var menuContent = ui.create.div(".menu-content", menu);
	var clickTab = function () {
		if (this.classList.contains("disabled")) {
			return;
		}
		var active = this.parentNode.querySelector(".active");
		if (active) {
			active.classList.remove("active");
			active._link.remove();
		}
		this.classList.add("active");
		menuTabBar.style.transform =
			"translateX(" + (this.getBoundingClientRect().left - this.parentNode.firstChild.getBoundingClientRect().left) / get.menuZoom() + "px)";
		menuContent.appendChild(this._link);
	};
	ui.click.menuTab = function (tab) {
		for (var i = 0; i < menuTab.childNodes.length; i++) {
			if (menuTab.childNodes[i].innerHTML == tab) {
				clickTab.call(menuTab.childNodes[i]);
				return;
			}
		}
	};
	var pages = [];
	for (var i = 0; i < tabs.length; i++) {
		var active = i === (config.init || 0);
		pages[i] = createPage(active ? menuContent : null);
		ui.create.div(active ? ".active" : "", tabs[i], menuTab, clickTab)._link = pages[i];
	}
	return {
		menu: menu,
		pages: pages,
	};
}
export function createConfig(config, position) {
	if (typeof config.item == "function") {
		config.item = config.item();
	}
	if (!config.clear && config.name != "开启") {
		if (config.name === "屏蔽弱将") {
			config.intro = "强度过低的武将（孙策除外）不会出现在选将框，也不会被AI选择";
		} else if (config.name == "屏蔽强将") {
			config.intro = "强度过高的武将不会出现在选将框，也不会被AI选择";
		} else if (!config.intro) {
			config.intro = "设置" + config.name;
		}
	}
	const node = ui.create.div(".config");
	node._link = { config };
	const app = createApp(ConfigItem, {
		config,
		node: markRaw(node),
		clickToggle,
		openMenu,
	});
	app.mount(node);
	node._link.unmount = () => app.unmount();
	if (position) {
		position.appendChild(node);
	}
	return node;
}

/**
 * @type { HTMLDivElement }
 *
 * 也是一个全屏div，但它的子元素是菜单栏
 */
export let menuContainer;

/**
 * @type { HTMLDivElement }
 *
 * 一个全屏div
 */
export let popupContainer;

/**
 * @type { Function }
 */
export let updateActive;

/**
 * @param { Function } fun
 */
export function setUpdateActive(fun) {
	updateActive = fun;
}

/**
 * @type { Function }
 */
export let updateActiveCard;

/**
 * @param { Function } fun
 */
export function setUpdateActiveCard(fun) {
	updateActiveCard = fun;
}

/**
 * @type { { menu: HTMLDivElement; pages: HTMLDivElement[]; } }
 */
export let menux;

/**
 * @type { HTMLDivElement[] }
 */
export let menuxpages;

/**
 * @type { Function[] }
 */
export const menuUpdates = [];

/**
 * @param { boolean } [connectMenu]
 */
export function menu(connectMenu) {
	/** 提示重启的计时器 */
	let menuTimeout = null;
	if (!connectMenu && !game.syncMenu) {
		menuTimeout = setTimeout(lib.init.reset, 1000);
	}
	/** menu是menux.menu，目前只有赋值没有使用，所以先注释掉 */
	// let menu;

	/**
	 * 由于联机模式会创建第二个菜单，所以需要缓存一下可变的变量
	 */
	const cacheMenuContainer = (menuContainer = ui.create.div(".menu-container.hidden", ui.window, () => {
		clickContainer.call(cacheMenuContainer, connectMenu);
	}));
	const cachePopupContainer = (popupContainer = ui.create.div(".popup-container.hidden", ui.window, function closeMenu() {
		// @ts-expect-error ignore
		if (cachePopupContainer.noclose) {
			// @ts-expect-error ignore
			cachePopupContainer.noclose = false;
			return;
		}
		cachePopupContainer.classList.add("hidden");
		if (typeof cachePopupContainer.onclose == "function") {
			// @ts-expect-error ignore
			cachePopupContainer.onclose();
		}
	}));

	if (!connectMenu) {
		ui.menuContainer = cacheMenuContainer;
		ui.click.configMenu = function () {
			ui.click.shortcut(false);
			if (cacheMenuContainer.classList.contains("hidden")) {
				ui.config2.classList.add("pressdown2");
				ui.arena.classList.add("menupaused");
				ui.historybar.classList.add("menupaused");
				ui.window.classList.add("touchinfohidden");
				cacheMenuContainer.classList.remove("hidden");
				for (var i = 0; i < menuUpdates.length; i++) {
					menuUpdates[i]();
				}
			} else {
				clickContainer.call(cacheMenuContainer, connectMenu);
			}
		};
		menux = createMenu(connectMenu, ["开始", "选项", "武将", "卡牌", "扩展", "其它"], {
			position: cacheMenuContainer,
			bar: 40,
		});
	} else {
		ui.connectMenuContainer = cacheMenuContainer;
		ui.click.connectMenu = function () {
			if (cacheMenuContainer.classList.contains("hidden")) {
				if (_status.waitingForPlayer) {
					startButton.innerHTML = "设";
					var start = cacheMenux.pages[0].firstChild;
					for (var i = 0; i < start.childNodes.length; i++) {
						if (start.childNodes[i].mode != lib.configOL.mode) {
							start.childNodes[i].classList.add("unselectable");
							start.childNodes[i].classList.remove("active");
							if (start.childNodes[i].link) {
								start.childNodes[i].link.remove();
							}
						} else {
							start.childNodes[i].classList.add("active");
							if (start.childNodes[i].link) {
								start.nextSibling.appendChild(start.childNodes[i].link);
							} else {
								console.log(start.nextSibling, start.childNodes[i]);
							}
						}
					}
				}
				ui.window.classList.add("shortcutpaused");
				cacheMenuContainer.classList.remove("hidden");
				for (var i = 0; i < menuUpdates.length; i++) {
					menuUpdates[i]();
				}
			} else {
				clickContainer.call(cacheMenuContainer, connectMenu);
			}
		};

		menux = createMenu(connectMenu, ["模式", "武将", "卡牌"], {
			position: cacheMenuContainer,
			bar: 123,
		});
		// menu = menux.menu;
		let cacheMenux = menux;
	}
	menuxpages = menux.pages.slice(0);

	// 开始
	let startButton = ui.create.startMenu(connectMenu);

	// 选项
	ui.create.optionsMenu(connectMenu);

	// 武将
	let updateCharacterPackMenu = ui.create.characterPackMenu(connectMenu);
	ui.updateCharacterPackMenu.push(updateCharacterPackMenu);

	// 卡牌
	let updatecardPackMenu = ui.create.cardPackMenu(connectMenu);
	ui.updateCardPackMenu.push(updatecardPackMenu);

	// 扩展
	ui.create.extensionMenu(connectMenu);

	// 其他
	ui.create.otherMenu(connectMenu);

	if (menuTimeout) {
		clearTimeout(menuTimeout);
		delete window.resetExtension;
		localStorage.removeItem(lib.configprefix + "disable_extension", true);
	}
}
