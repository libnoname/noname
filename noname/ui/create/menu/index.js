import { ui, game, get, lib, _status } from "noname";

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
	if (this.classList.contains("disabled")) {
		return;
	}
	var node = this;
	this.classList.add("on");
	if (this._link.menu) {
		var pos1 = this.lastChild.getBoundingClientRect();
		var pos2 = ui.window.getBoundingClientRect();
		if (this._link.menu.classList.contains("visual")) {
			openMenu(
				this._link.menu,
				{
					clientX: pos1.left + pos1.width + 5 - pos2.left,
					clientY: pos1.top - pos2.top,
				},
				function () {
					node.classList.remove("on");
				}
			);
		} else if (this._link.menu.childElementCount > 10) {
			openMenu(
				this._link.menu,
				{
					clientX: pos1.left + pos1.width + 5 - pos2.left,
					clientY: Math.min((ui.window.offsetHeight - 400) / 2, pos1.top - pos2.top),
				},
				function () {
					node.classList.remove("on");
				}
			);
			lib.setScroll(this._link.menu);
		} else {
			openMenu(
				this._link.menu,
				{
					clientX: pos1.left + pos1.width + 5 - pos2.left,
					clientY: pos1.top - pos2.top,
				},
				function () {
					node.classList.remove("on");
				}
			);
		}
	}
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
	var config = node._link.config;
	node._link.current = this.link;
	var tmpName = node.lastChild.innerHTML;
	node.lastChild.innerHTML = config.item[this._link];
	if (config.onclick) {
		if (config.onclick.call(node, this._link, this) === false) {
			node.lastChild.innerHTML = tmpName;
		}
	}
	if (config.update) {
		config.update();
	}
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
		menuTabBar.style.transform = "translateX(" + (this.getBoundingClientRect().left - this.parentNode.firstChild.getBoundingClientRect().left) / get.menuZoom() + "px)";
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
	var node = ui.create.div(".config", config.name);
	node._link = { config: config };
	if (!config.clear) {
		if (config.name != "开启") {
			if (config.name == "屏蔽弱将") {
				config.intro = "强度过低的武将（孙策除外）不会出现在选将框，也不会被AI选择";
			} else if (config.name == "屏蔽强将") {
				config.intro = "强度过高的武将不会出现在选将框，也不会被AI选择";
			} else if (!config.intro) {
				config.intro = "设置" + config.name;
			}
			lib.setIntro(node, function (uiintro) {
				if (lib.config.touchscreen) {
					_status.dragged = true;
				}
				uiintro.style.width = "170px";
				var str = config.intro;
				if (typeof str == "function") {
					str = str();
				}
				uiintro._place_text = uiintro.add('<div class="text" style="display:inline">' + str + "</div>");
			});
		}
	} else {
		node.innerHTML = "<span>" + config.name + "</span>";
		if (!config.nopointer) {
			node.classList.add("pointerspan");
		}
	}
	if (config.item) {
		if (typeof config.item == "function") {
			config.item = config.item();
		}
		if (Array.isArray(config.init)) {
			void 0;
		} else {
			node.classList.add("switcher");
			node.listen(clickSwitcher);
			node._link.choosing = ui.create.div("", config.item[config.init], node);
			node._link.menu = ui.create.div(".menu");
			if (config.visualMenu) {
				node._link.menu.classList.add("visual");
				var updateVisual = function () {
					config.visualMenu(this, this._link, config.item[this._link], config);
				};
				var createNode = function (i, before) {
					var visualMenu = ui.create.div();
					if (config.visualBar) {
						if (before) {
							node._link.menu.insertBefore(visualMenu, before);
						} else {
							node._link.menu.insertBefore(visualMenu, node._link.menu.lastChild);
						}
					} else {
						node._link.menu.appendChild(visualMenu);
					}
					ui.create.div(".name", get.verticalStr(config.item[i]), visualMenu);
					visualMenu._link = i;
					if (config.visualMenu(visualMenu, i, config.item[i], config) !== false) {
						visualMenu.listen(clickMenuItem);
					}
					visualMenu.update = updateVisual;
				};
				if (config.visualBar) {
					var visualBar = ui.create.div(node._link.menu, function () {
						this.parentNode.parentNode.noclose = true;
					});
					node._link.menu.classList.add("withbar");
					config.visualBar(visualBar, config.item, createNode, node);
					visualBar.update = function () {
						config.visualBar(visualBar, config.item, createNode, node);
					};
				}
				for (var i in config.item) {
					createNode(i);
				}
				lib.setScroll(node._link.menu);
				node._link.menu.updateBr = function () {
					var br = Array.from(this.querySelectorAll(".menu.visual>br"));
					while (br.length) {
						br.shift().remove();
					}
					var split = [];
					for (var i = 1; i < this.childElementCount; i++) {
						if (i % 3 == 0) {
							split.push(this.childNodes[i]);
						}
					}
					for (var i = 0; i < split.length; i++) {
						this.insertBefore(ui.create.node("br"), split[i]);
					}
				};
				node._link.menu.updateBr();
			} else {
				for (var i in config.item) {
					var textMenu = ui.create.div("", config.item[i], node._link.menu, clickMenuItem);
					textMenu._link = i;
					if (config.textMenu) {
						config.textMenu(textMenu, i, config.item[i], config);
					}
					lib.setScroll(node._link.menu);
				}
			}
			node._link.menu._link = node;
			node._link.current = config.init;
		}
	} else if (config.range) {
		void 0;
	} else if (config.clear) {
		if (node.innerHTML.length >= 15) {
			node.style.height = "auto";
		}
		node.listen(clickToggle);
	} else if (config.input) {
		node.classList.add("switcher");
		var input = ui.create.div(node);
		if (!config.fixed) {
			input.contentEditable = true;
			input.style.webkitUserSelect = "text";
		}
		input.style.minWidth = "10px";
		input.style.maxWidth = "60%";
		input.style.overflow = "hidden";
		input.style.whiteSpace = "nowrap";
		input.onkeydown = function (e) {
			if (e.key == "Enter") {
				e.preventDefault();
				e.stopPropagation();
				input.blur();
			}
		};
		if (config.name == "联机昵称") {
			input.innerHTML = config.init || "无名玩家";
			input.onblur = function () {
				input.innerHTML = input.innerHTML.replace(/<br>/g, "");
				if (!input.innerHTML || get.is.banWords(input.innerHTML)) {
					input.innerHTML = "无名玩家";
				}
				input.innerHTML = input.innerHTML.slice(0, 12);
				game.saveConfig("connect_nickname", input.innerHTML);
				game.saveConfig("connect_nickname", input.innerHTML, "connect");
			};
		} else if (config.name == "联机大厅") {
			input.innerHTML = config.init || lib.hallURL;
			input.onblur = function () {
				if (!input.innerHTML) {
					input.innerHTML = lib.hallURL;
				}
				input.innerHTML = input.innerHTML.replace(/<br>/g, "");
				game.saveConfig("hall_ip", input.innerHTML, "connect");
			};
		} else {
			input.innerHTML = config.init;
			input.onblur = config.onblur;
		}
	} else {
		node.classList.add("toggle");
		node.listen(clickToggle);
		ui.create.div(ui.create.div(node));
		if (config.init == true) {
			node.classList.add("on");
		}
	}
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
