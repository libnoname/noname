import { menuContainer, popupContainer, updateActive, setUpdateActive, updateActiveCard, setUpdateActiveCard, menux, menuxpages, menuUpdates, openMenu, clickToggle, clickSwitcher, clickContainer, clickMenuItem, createMenu, createConfig } from "../index.js";
import { ui, game, get, ai, lib, _status } from "../../../../../noname.js";

export const characterPackMenu = function (connectMenu) {
	/**
	 * 由于联机模式会创建第二个菜单，所以需要缓存一下可变的变量
	 */
	// const cacheMenuContainer = menuContainer;
	// const cachePopupContainer = popupContainer;
	const cacheMenux = menux;
	const cacheMenuxpages = menuxpages;
	/** @type { HTMLDivElement } */
	// @ts-expect-error ignore
	var start = cacheMenuxpages.shift();
	// 用于切换显示对应武将包所有武将的界面
	var rightPane = start.lastChild;

	var clickMode = function () {
		var active = this.parentNode.querySelector(".active");
		if (active) {
			if (active === this) {
				return;
			}
			active.classList.remove("active");
			active.link.remove();
		}
		this.classList.add("active");
		updateActive(this);
		if (this.link) {
			rightPane.appendChild(this.link);
		} else {
			this._initLink();
			rightPane.appendChild(this.link);
		}
	};
	setUpdateActive(function (node) {
		if (!node) {
			node = start.firstChild.querySelector(".active");
			if (!node) {
				return;
			}
		}
		if (!node.link) {
			node._initLink();
		}
		for (var i = 0; i < node.link.childElementCount; i++) {
			if (node.link.childNodes[i].updateBanned) {
				node.link.childNodes[i].updateBanned();
			}
		}
	});
	var updateNodes = function () {
		for (var i = 0; i < start.firstChild.childNodes.length; i++) {
			var node = start.firstChild.childNodes[i];
			if (node.mode) {
				if (node.mode.startsWith("mode_")) {
					// 扩展武将包开启逻辑
					if (node.mode.startsWith("mode_extension")) {
						const extName = node.mode.slice(15);
						if (!game.hasExtension(extName) || !game.hasExtensionLoaded(extName)) {
							continue;
						}
						if (lib.config[`extension_${extName}_characters_enable`] == true) {
							node.classList.remove("off");
							if (node.link) {
								node.link.firstChild.classList.add("on");
							}
						} else {
							node.classList.add("off");
							if (node.link) {
								node.link.firstChild.classList.remove("on");
							}
						}
					}
					continue;
				}
				if (node.mode == "custom") {
					continue;
				}
				if (connectMenu) {
					if (!lib.config.connect_characters.includes(node.mode)) {
						node.classList.remove("off");
						if (node.link) {
							node.link.firstChild.classList.add("on");
						}
					} else {
						node.classList.add("off");
						if (node.link) {
							node.link.firstChild.classList.remove("on");
						}
					}
				} else {
					if (lib.config.characters.includes(node.mode)) {
						node.classList.remove("off");
						if (node.link) {
							node.link.firstChild.classList.add("on");
						}
					} else {
						node.classList.add("off");
						if (node.link) {
							node.link.firstChild.classList.remove("on");
						}
					}
				}
			}
		}
	};
	var togglePack = function (bool) {
		var name = this._link.config._name;
		// 扩展武将包开启逻辑
		if (name.startsWith("mode_extension")) {
			const extName = name.slice(15);
			if (!game.hasExtension(extName) || !game.hasExtensionLoaded(extName)) {
				return false;
			}
			game.saveExtensionConfig(extName, "characters_enable", bool);
		}
		// 原逻辑
		else {
			if (connectMenu) {
				if (!bool) {
					lib.config.connect_characters.add(name);
				} else {
					lib.config.connect_characters.remove(name);
				}
				game.saveConfig("connect_characters", lib.config.connect_characters);
			} else {
				if (bool) {
					lib.config.characters.add(name);
				} else {
					lib.config.characters.remove(name);
				}
				game.saveConfig("characters", lib.config.characters);
			}
		}
		updateNodes();
	};

	var createModeConfig = function (mode, position, position2) {
		var _info = lib.characterPack[mode];
		var page = ui.create.div("");
		var node = ui.create.div(".menubutton.large", lib.translate[mode + "_character_config"], position, clickMode);
		if (node.innerHTML.length >= 5) {
			node.classList.add("smallfont");
		}
		if (position2) {
			position.insertBefore(node, position2);
		}
		node.mode = mode;
		node._initLink = function () {
			node.link = page;
			page.node = node;
			var list = [];
			var boolAI = lib.config[`forbidai_user_${mode}`];
			for (var i in _info) {
				const characterInfo = _info[i];
				if (characterInfo.isUnseen) {
					continue;
				}
				if (connectMenu && lib.connectBanned.includes(i)) {
					continue;
				}
				list.push(i);
				if (Boolean(boolAI) !== lib.config.forbidai_user.includes(i)) {
					lib.config.forbidai_user[boolAI ? "add" : "remove"](i);
					game.saveConfig("forbidai_user", lib.config.forbidai_user);
				}
				for (var j = 0; j < characterInfo.skills.length; j++) {
					if (!lib.skill[characterInfo.skills[j]]) {
						continue;
					}
				}
			}
			list.sort(lib.sort.character);
			var list2 = list.slice(0);
			var cfgnode = createConfig({
				name: "开启",
				_name: mode,
				init: (() => {
					// 扩展武将包开启逻辑
					if (mode.startsWith("mode_extension")) {
						const extName = mode.slice(15);
						if (!game.hasExtension(extName) || !game.hasExtensionLoaded(extName)) {
							return false;
						}
						// 这块或许应该在加载扩展时候写
						if (lib.config[`extension_${extName}_characters_enable`] === undefined) {
							game.saveExtensionConfig(extName, "characters_enable", true);
						}
						return lib.config[`extension_${extName}_characters_enable`] === true;
					}
					// 原逻辑
					else {
						return connectMenu ? !lib.config.connect_characters.includes(mode) : lib.config.characters.includes(mode);
					}
				})(),
				onclick: togglePack,
			});
			var cfgnodeAI = createConfig({
				name: "仅点将可用",
				_name: mode,
				init: boolAI,
				intro: "将该武将包内的武将全部设置为仅点将可用",
				onclick(bool) {
					game.saveConfig(`forbidai_user_${mode}`, bool);
					lib.config.forbidai_user[bool ? "addArray" : "removeArray"](list);
					game.saveConfig("forbidai_user", lib.config.forbidai_user);
				},
			});
			if (!mode.startsWith("mode_")) {
				cfgnodeAI.style.marginTop = "0px";
				page.appendChild(cfgnode);
				page.appendChild(cfgnodeAI);
			} else if (mode.startsWith("mode_extension")) {
				// 排除4个基本扩展
				// 给扩展的武将包加一个开启关闭的功能
				if (!lib.config.all.stockextension.includes(mode.slice(15))) {
					page.appendChild(cfgnode);
					cfgnodeAI.style.marginTop = "0px";
				}
				page.appendChild(cfgnodeAI);
			} else {
				page.style.paddingTop = "8px";
			}
			if (lib.translate[mode + "_charactersInfo"]) {
				var modeTranslation = '<p style="padding-left: 2em; margin-block: unset;">' + lib.translate[mode + "_charactersInfo"] + "</p>";
				page.insertAdjacentHTML("beforeend", modeTranslation);
			}
			var banCharacter = function (e) {
				if (_status.clicked) {
					_status.clicked = false;
					return;
				}
				if (mode.startsWith("mode_") && !mode.startsWith("mode_extension_") && mode != "mode_favourite" && mode != "mode_banned") {
					if (!connectMenu && lib.config.show_charactercard) {
						ui.click.charactercard(this.link, this, mode == "mode_guozhan" ? "guozhan" : true);
					}
					return;
				}
				ui.click.touchpop();
				this._banning = connectMenu ? "online" : "offline";
				if (!connectMenu && lib.config.show_charactercard) {
					ui.click.charactercard(this.link, this);
				} else {
					ui.click.intro.call(this, e);
				}
				_status.clicked = false;
				delete this._banning;
			};
			var updateBanned = function () {
				var _list;
				if (connectMenu) {
					var mode = cacheMenux.pages[0].firstChild.querySelector(".active");
					if (mode && mode.mode) {
						_list = lib.config["connect_" + mode.mode + "_banned"];
					}
				} else {
					_list = lib.config[get.mode() + "_banned"];
				}
				if (_list && _list.includes(this.link)) {
					this.classList.add("banned");
				} else {
					this.classList.remove("banned");
				}
			};
			if (lib.characterSort[mode]) {
				var listb = [];
				if (!connectMenu) {
					listb = lib.config[get.mode() + "_banned"] || [];
				} else {
					var modex = cacheMenux.pages[0].firstChild.querySelector(".active");
					if (modex && modex.mode) {
						listb = lib.config["connect_" + modex.mode + "_banned"];
					}
				}
				for (var pak in lib.characterSort[mode]) {
					var info = lib.characterSort[mode][pak];
					var listx = [];
					var boolx = false;
					for (var ii = 0; ii < list2.length; ii++) {
						if (info.includes(list2[ii])) {
							listx.add(list2[ii]);
							if (!listb.includes(list2[ii])) {
								boolx = true;
							}
							list2.splice(ii--, 1);
						}
					}
					if (listx.length) {
						var cfgnodeY = {
							name: lib.translate[pak],
							intro: lib.translate[pak + "_info"] || false,
							_name: pak,
							init: boolx,
							onclick(bool) {
								var banned = [];
								if (connectMenu) {
									var modex = cacheMenux.pages[0].firstChild.querySelector(".active");
									if (modex && modex.mode) {
										banned = lib.config["connect_" + modex.mode + "_banned"];
									}
								} else if (_status.connectMode) {
									return;
								} else {
									banned = lib.config[get.mode() + "_banned"] || [];
								}
								var listx = lib.characterSort[mode][this._link.config._name];
								if (bool) {
									for (var i = 0; i < listx.length; i++) {
										banned.remove(listx[i]);
									}
								} else {
									for (var i = 0; i < listx.length; i++) {
										banned.add(listx[i]);
									}
								}
								game.saveConfig(connectMenu ? "connect_" + modex.mode + "_banned" : get.mode() + "_banned", banned);
								updateActive();
							},
						};
						if (mode.startsWith("mode_") && !mode.startsWith("mode_extension_") && !mode.startsWith("mode_guozhan")) {
							cfgnodeY.clear = true;
							delete cfgnodeY.onclick;
						}
						var cfgnodeX = createConfig(cfgnodeY);
						page.appendChild(cfgnodeX);
						var buttons = ui.create.buttons(listx, "character", page);
						for (var i = 0; i < buttons.length; i++) {
							buttons[i].classList.add("noclick");
							buttons[i].listen(banCharacter);
							ui.create.rarity(buttons[i]);
							buttons[i].node.hp.style.transition = "all 0s";
							buttons[i].node.hp._innerHTML = buttons[i].node.hp.innerHTML;
							if (mode != "mode_banned") {
								buttons[i].updateBanned = updateBanned;
							}
						}
					}
				}
				if (list2.length) {
					var cfgnodeX = createConfig({
						name: "其他",
						_name: "others",
						clear: true,
					});
					page.appendChild(cfgnodeX);
					var buttons = ui.create.buttons(list2, "character", page);
					for (var i = 0; i < buttons.length; i++) {
						buttons[i].classList.add("noclick");
						buttons[i].listen(banCharacter);
						ui.create.rarity(buttons[i]);
						buttons[i].node.hp.style.transition = "all 0s";
						buttons[i].node.hp._innerHTML = buttons[i].node.hp.innerHTML;
						if (mode != "mode_banned") {
							buttons[i].updateBanned = updateBanned;
						}
					}
				}
			} else {
				var buttons = ui.create.buttons(list, "character", page);
				for (var i = 0; i < buttons.length; i++) {
					buttons[i].classList.add("noclick");
					ui.create.rarity(buttons[i]);
					buttons[i].listen(banCharacter);
					buttons[i].node.hp.style.transition = "all 0s";
					buttons[i].node.hp._innerHTML = buttons[i].node.hp.innerHTML;
					if (mode != "mode_banned") {
						buttons[i].updateBanned = updateBanned;
					}
				}
			}
			page.classList.add("menu-buttons");
			page.classList.add("leftbutton");
			if (!connectMenu) {
				if (lib.config.all.sgscharacters.includes(mode)) {
					ui.create.div(".config.pointerspan", '<span style="opacity:0.5">该武将包不可被隐藏</span>', page);
				} else if (!mode.startsWith("mode_")) {
					ui.create.div(".config.pointerspan", "<span>隐藏武将包</span>", page, function () {
						if (this.firstChild.innerHTML == "隐藏武将包") {
							if (confirm("真的要隐藏“" + get.translation(mode + "_character_config") + "”武将包吗？\n建议使用“关闭”而不是“隐藏”功能，否则将会影响其他相关武将包的正常运行！")) {
								this.firstChild.innerHTML = "武将包将在重启后隐藏";
								lib.config.hiddenCharacterPack.add(mode);
								if (!lib.config.prompt_hidepack) {
									alert("隐藏的扩展包可通过选项-其它-重置隐藏内容恢复");
									game.saveConfig("prompt_hidepack", true);
								}
							}
						} else {
							this.firstChild.innerHTML = "隐藏武将包";
							lib.config.hiddenCharacterPack.remove(mode);
						}
						game.saveConfig("hiddenCharacterPack", lib.config.hiddenCharacterPack);
					});
				}
			}
		};
		if (!get.config("menu_loadondemand")) {
			node._initLink();
		}
		return node;
	};
	if (lib.config.show_favourite_menu && !connectMenu && Array.isArray(lib.config.favouriteCharacter)) {
		lib.characterPack.mode_favourite = {};
		for (var i = 0; i < lib.config.favouriteCharacter.length; i++) {
			var favname = lib.config.favouriteCharacter[i];
			if (lib.character[favname]) {
				lib.characterPack.mode_favourite[favname] = lib.character[favname];
			}
		}
		var favouriteCharacterNode = createModeConfig("mode_favourite", start.firstChild);
		if (!favouriteCharacterNode.link) {
			favouriteCharacterNode._initLink();
		}
		ui.favouriteCharacter = favouriteCharacterNode.link;
		if (get.is.empty(lib.characterPack.mode_favourite)) {
			ui.favouriteCharacter.node.style.display = "none";
		}
		delete lib.characterPack.mode_favourite;
	}
	if (!connectMenu && lib.config.show_ban_menu) {
		lib.characterPack.mode_banned = {};
		for (var i = 0; i < lib.config.all.mode.length; i++) {
			var banned = lib.config[lib.config.all.mode[i] + "_banned"];
			if (banned) {
				for (var j = 0; j < banned.length; j++) {
					if (lib.character[banned[j]]) {
						lib.characterPack.mode_banned[banned[j]] = lib.character[banned[j]];
					}
				}
			}
		}
		var bannednode = createModeConfig("mode_banned", start.firstChild);
		if (get.is.empty(lib.characterPack.mode_banned)) {
			bannednode.style.display = "none";
		}
		delete lib.characterPack.mode_banned;
	}
	var characterlist = connectMenu ? lib.connectCharacterPack : lib.config.all.characters;
	for (var i = 0; i < characterlist.length; i++) {
		createModeConfig(characterlist[i], start.firstChild);
	}
	if (!connectMenu) {
		Object.keys(lib.characterPack).forEach(key => {
			// 单机模式下显示不在lib.config.all.characters里的武将包
			if (!characterlist.includes(key)) {
				createModeConfig(key, start.firstChild);
			}
			if (connectMenu) {
				lib.connectCharacterPack.add(key);
			}
		});
	}
	var active = start.firstChild.querySelector(".active");
	if (!active) {
		active = start.firstChild.firstChild;
		if (active.style.display == "none") {
			active = active.nextSibling;
			if (active.style.display == "none") {
				active = active.nextSibling;
			}
		}
		active.classList.add("active");
		updateActive(active);
	}
	if (!active.link) {
		active._initLink();
	}
	rightPane.appendChild(active.link);

	if (!connectMenu) {
		// 下面使用了var的特性，请不要在这里直接改为let
		var node1 = ui.create.div(".lefttext", "全部开启", start.firstChild, function () {
			game.saveConfig("characters", lib.config.all.characters);
			updateNodes();
		});
		var node3 = ui.create.div(".lefttext", "全部关闭", start.firstChild, function () {
			game.saveConfig("characters", []);
			updateNodes();
		});
		var node2 = ui.create.div(".lefttext", "恢复默认", start.firstChild, function () {
			game.saveConfig("characters", lib.config.defaultcharacters);
			updateNodes();
		});
		node1.style.marginTop = "12px";
		node3.style.marginTop = "7px";
		node2.style.marginTop = "2px";
	}

	updateNodes();

	/**
	 * 在菜单栏初始化完成后，如果又加载了武将包，进行刷新
	 *
	 * @param { string } packName
	 */
	return function (packName) {
		// 判断菜单栏有没有加载过这个武将包
		if ([...start.firstChild.children].map(node => node.mode).includes(packName)) {
			return;
		}
		// 显示不是无名杀自带的武将包
		if (!lib.connectCharacterPack.includes(packName) && !lib.config.all.characters.includes(packName)) {
			createModeConfig(packName, start.firstChild, node1);
			if (connectMenu) {
				lib.connectCharacterPack.add(packName);
			}
		}
	};
};
