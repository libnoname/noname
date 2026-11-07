import "../../../../noname.js";
import { get } from "../../../get/index.js";
import { ui } from "../../index.js";
import { lib } from "../../../library/index.js";
import { _status } from "../../../status/index.js";
import { game } from "../../../game/index.js";
function openMenu(node, e, onclose) {
  popupContainer.innerHTML = "";
  var left = Math.round(e.clientX / get.menuZoom());
  var zoom = get.is.phoneLayout() ? 1.3 : 1;
  popupContainer.appendChild(node);
  if (node.classList.contains("visual")) {
    for (var i = 0; i < node.childElementCount; i++) {
      if (node.childNodes[i].update) {
        node.childNodes[i].update();
      }
    }
  }
  var height = node.offsetHeight;
  var idealtop = e.clientY / get.menuZoom();
  if (idealtop < 10) {
    idealtop = 10;
  } else if ((idealtop + height) * zoom + 10 > ui.window.offsetHeight) {
    idealtop = (ui.window.offsetHeight - 10) / zoom - height;
  }
  node.style.top = idealtop + "px";
  node.style.left = left + "px";
  popupContainer.classList.remove("hidden");
  popupContainer.onclose = onclose;
}
function clickToggle() {
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
function clickSwitcher() {
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
          clientY: pos1.top - pos2.top
        },
        function() {
          node.classList.remove("on");
        }
      );
    } else if (this._link.menu.childElementCount > 10) {
      openMenu(
        this._link.menu,
        {
          clientX: pos1.left + pos1.width + 5 - pos2.left,
          clientY: Math.min((ui.window.offsetHeight - 400) / 2, pos1.top - pos2.top)
        },
        function() {
          node.classList.remove("on");
        }
      );
      lib.setScroll(this._link.menu);
    } else {
      openMenu(
        this._link.menu,
        {
          clientX: pos1.left + pos1.width + 5 - pos2.left,
          clientY: pos1.top - pos2.top
        },
        function() {
          node.classList.remove("on");
        }
      );
    }
  }
}
function clickContainer(connectMenu) {
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
function clickMenuItem() {
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
function createMenu(connectMenu, tabs, config) {
  var createPage = function(position) {
    var node = ui.create.div(position);
    lib.setScroll(ui.create.div(".left.pane", node));
    lib.setScroll(ui.create.div(".right.pane", node));
    return node;
  };
  var menu2 = ui.create.div(".main.menu.dialog.popped.static", config.position, function(e) {
    e.stopPropagation();
  });
  if (connectMenu) {
    menu2.classList.add("center");
    menuContainer.classList.add("centermenu");
  }
  var menuTab = ui.create.div(".menu-tab", menu2);
  var menuTabBar = ui.create.div(".menu-tab-bar", menu2);
  menuTabBar.style.left = (config.bar || 0) + "px";
  if (Math.round(2 * get.menuZoom()) < 2) {
    menuTabBar.style.height = "3px";
  }
  var menuContent = ui.create.div(".menu-content", menu2);
  var clickTab = function() {
    if (this.classList.contains("disabled")) {
      return;
    }
    var active2 = this.parentNode.querySelector(".active");
    if (active2) {
      active2.classList.remove("active");
      active2._link.remove();
    }
    this.classList.add("active");
    menuTabBar.style.transform = "translateX(" + (this.getBoundingClientRect().left - this.parentNode.firstChild.getBoundingClientRect().left) / get.menuZoom() + "px)";
    menuContent.appendChild(this._link);
  };
  ui.click.menuTab = function(tab) {
    for (var i2 = 0; i2 < menuTab.childNodes.length; i2++) {
      if (menuTab.childNodes[i2].innerHTML == tab) {
        clickTab.call(menuTab.childNodes[i2]);
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
    menu: menu2,
    pages
  };
}
function createConfig(config, position) {
  var node = ui.create.div(".config", config.name);
  node._link = { config };
  if (!config.clear) {
    if (config.name != "开启") {
      if (config.name == "屏蔽弱将") {
        config.intro = "强度过低的武将（孙策除外）不会出现在选将框，也不会被AI选择";
      } else if (config.name == "屏蔽强将") {
        config.intro = "强度过高的武将不会出现在选将框，也不会被AI选择";
      } else if (!config.intro) {
        config.intro = "设置" + config.name;
      }
      lib.setIntro(node, function(uiintro) {
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
    } else {
      node.classList.add("switcher");
      node.listen(clickSwitcher);
      node._link.choosing = ui.create.div("", config.item[config.init] || config.init, node);
      node._link.menu = ui.create.div(".menu");
      if (config.visualMenu) {
        node._link.menu.classList.add("visual");
        var updateVisual = function() {
          config.visualMenu(this, this._link, config.item[this._link] || this._link, config);
        };
        var createNode = function(i2, before) {
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
          ui.create.div(".name", get.verticalStr(config.item[i2] || i2), visualMenu);
          visualMenu._link = i2;
          if (config.visualMenu(visualMenu, i2, config.item[i2] || i2, config) !== false) {
            visualMenu.listen(clickMenuItem);
          }
          visualMenu.update = updateVisual;
        };
        if (config.visualBar) {
          var visualBar = ui.create.div(node._link.menu, function() {
            this.parentNode.parentNode.noclose = true;
          });
          node._link.menu.classList.add("withbar");
          config.visualBar(visualBar, config.item, createNode, node);
          visualBar.update = function() {
            config.visualBar(visualBar, config.item, createNode, node);
          };
        }
        for (var i in config.item) {
          createNode(i);
        }
        lib.setScroll(node._link.menu);
        node._link.menu.updateBr = function() {
          var br = Array.from(this.querySelectorAll(".menu.visual>br"));
          while (br.length) {
            br.shift().remove();
          }
          var split = [];
          for (var i2 = 1; i2 < this.childElementCount; i2++) {
            if (i2 % 3 == 0) {
              split.push(this.childNodes[i2]);
            }
          }
          for (var i2 = 0; i2 < split.length; i2++) {
            this.insertBefore(ui.create.node("br"), split[i2]);
          }
        };
        node._link.menu.updateBr();
      } else {
        for (var i in config.item) {
          var textMenu = ui.create.div("", config.item[i] || i, node._link.menu, clickMenuItem);
          textMenu._link = i;
          if (config.textMenu) {
            config.textMenu(textMenu, i, config.item[i] || i, config);
          }
          lib.setScroll(node._link.menu);
        }
      }
      node._link.menu._link = node;
      node._link.current = config.init;
    }
  } else if (config.range) {
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
    input.onkeydown = function(e) {
      if (e.key == "Enter") {
        e.preventDefault();
        e.stopPropagation();
        input.blur();
      }
    };
    if (config.name == "联机昵称") {
      input.innerHTML = config.init || "无名玩家";
      input.onblur = function() {
        input.innerHTML = input.innerHTML.replace(/<br>/g, "");
        if (!input.innerHTML || get.is.banWords(input.innerHTML)) {
          input.innerHTML = "无名玩家";
        }
        input.innerHTML = input.innerHTML.slice(0, 12);
        game.saveConfig("connect_nickname", input.innerHTML);
        game.saveConfig("connect_nickname", input.innerHTML, "connect");
      };
    } else if (config.name == "联机头像") {
      const currentId = lib.config.connect_avatar || config.init || "caocao";
      input.innerHTML = lib.translate[currentId] || "曹操";
      input.onblur = config.onblur;
    } else if (config.name == "联机大厅") {
      input.innerHTML = config.init || lib.hallURL;
      input.onblur = function() {
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
let menuContainer;
let popupContainer;
let updateActive;
function setUpdateActive(fun) {
  updateActive = fun;
}
let updateActiveCard;
function setUpdateActiveCard(fun) {
  updateActiveCard = fun;
}
let menux;
let menuxpages;
const menuUpdates = [];
function menu(connectMenu) {
  let menuTimeout = null;
  if (!connectMenu && !game.syncMenu) {
    menuTimeout = setTimeout(lib.init.reset, 1e3);
  }
  const cacheMenuContainer = menuContainer = ui.create.div(".menu-container.hidden", ui.window, () => {
    clickContainer.call(cacheMenuContainer, connectMenu);
  });
  const cachePopupContainer = popupContainer = ui.create.div(".popup-container.hidden", ui.window, function closeMenu() {
    if (cachePopupContainer.noclose) {
      cachePopupContainer.noclose = false;
      return;
    }
    cachePopupContainer.classList.add("hidden");
    if (typeof cachePopupContainer.onclose == "function") {
      cachePopupContainer.onclose();
    }
  });
  if (!connectMenu) {
    ui.menuContainer = cacheMenuContainer;
    ui.click.configMenu = function() {
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
      bar: 40
    });
  } else {
    ui.connectMenuContainer = cacheMenuContainer;
    ui.click.connectMenu = function() {
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
      bar: 123
    });
    let cacheMenux = menux;
  }
  menuxpages = menux.pages.slice(0);
  let startButton = ui.create.startMenu(connectMenu);
  ui.create.optionsMenu(connectMenu);
  let updateCharacterPackMenu = ui.create.characterPackMenu(connectMenu);
  ui.updateCharacterPackMenu.push(updateCharacterPackMenu);
  let updatecardPackMenu = ui.create.cardPackMenu(connectMenu);
  ui.updateCardPackMenu.push(updatecardPackMenu);
  ui.create.extensionMenu(connectMenu);
  ui.create.otherMenu(connectMenu);
  if (menuTimeout) {
    clearTimeout(menuTimeout);
    delete window.resetExtension;
    localStorage.removeItem(lib.configprefix + "disable_extension", true);
  }
}
export {
  clickContainer,
  clickMenuItem,
  clickSwitcher,
  clickToggle,
  createConfig,
  createMenu,
  menu,
  menuContainer,
  menuUpdates,
  menux,
  menuxpages,
  openMenu,
  popupContainer,
  setUpdateActive,
  setUpdateActiveCard,
  updateActive,
  updateActiveCard
};
