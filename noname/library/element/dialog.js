import "../../../noname.js";
import { Pagination } from "../../util/pagination.js";
import { ui } from "../../ui/index.js";
import { lib } from "../index.js";
import { game } from "../../game/index.js";
import { get } from "../../get/index.js";
class Dialog extends HTMLDivElement {
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
      args = other._args;
    }
    let hidden = false;
    let noTouchScroll = false;
    let forceButton = false;
    let noForceButton = false;
    let peaceDialog = false;
    const dialog = ui.create.div(".dialog");
    Object.setPrototypeOf(dialog, (lib.element.Dialog || Dialog).prototype);
    dialog.supportsPagination = false;
    dialog.paginationMap = /* @__PURE__ */ new Map();
    dialog.paginationMaxCount = /* @__PURE__ */ new Map();
    dialog.contentContainer = ui.create.div(".content-container", dialog);
    dialog.content = ui.create.div(".content", dialog.contentContainer);
    dialog.bar1 = ui.create.div(".bar.top", dialog);
    dialog.bar2 = ui.create.div(".bar.bottom", dialog);
    dialog.buttons = [];
    Array.from(args).forEach((argument) => {
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
    if (!lib.config.touchscreen) {
      dialog.contentContainer.onscroll = ui.update;
    }
    if (!noTouchScroll) {
      dialog.contentContainer.ontouchstart = ui.click.dialogtouchStart;
      dialog.contentContainer.ontouchmove = ui.click.touchScroll;
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
    dialog._args = args;
    return dialog;
  }
  /**
   * 添加分页组件到页面
   * @param {Pagination} state - 分页组件的配置对象
   */
  addPagination(state = {}) {
    const p = new Pagination(state);
    this.paginationMap.set(state.insertAfter, p);
    p.renderPageDOM();
  }
  /**
   *
   * @param  {RowItem[]} args
   */
  addNewRow(...args) {
    this.classList.add("addNewRow");
    this.classList.remove("nobutton");
    let itemOptions = parameterNormolize();
    let ratioStr = itemOptions.map((o) => o.ratio || 1).join("fr ") + "fr";
    if (!this.itemContainers) {
      this.itemContainers = [];
    }
    let that = this;
    let rowContainer = createRowContainer(this);
    for (let itemOption of itemOptions) {
      let itemContainer = createItemContainer(itemOption);
      let item = itemOption.item;
      let addedItems = addItemToItemContainer(item, itemContainer, itemOption);
      BindEvent(itemOption, addedItems, itemContainer);
      checkOverflow(itemOption, itemContainer, addedItems);
      if (itemOption.custom) {
        itemOption.custom(itemContainer);
      }
      observeItemContainer(itemOption, itemContainer);
      this.itemContainers.push(itemContainer);
    }
    function observeItemContainer(itemOption, itemContainer) {
      itemContainer.Observer = new MutationObserver((mutationsList) => {
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
        addedItems.forEach((item) => {
          item.addEventListener("click", (ev) => {
            ev.stopPropagation();
            itemOption.clickItem(item, itemContainer, that.itemContainers, ev);
          });
        });
      }
      if (itemOption.clickItemContainer) {
        itemContainer.addEventListener("click", (e) => {
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
      let itemOptions2 = [];
      if (args.length == 0) {
        throw new Error("参数不能为空");
      } else if (args.length == 1) {
        if (isOption(args[0])) {
          itemOptions2 = [args[0]];
        } else {
          itemOptions2 = [
            {
              item: args[0]
            }
          ];
        }
      } else {
        if (args.every((arg) => isOption(arg))) {
          itemOptions2 = args;
        } else {
          itemOptions2 = args.map((arg) => {
            return {
              item: arg
            };
          });
        }
      }
      return itemOptions2;
    }
    function isOption(obj) {
      if (["card", "player", "cards", "players"].includes(get.itemtype(obj))) {
        return false;
      }
      return typeof obj == "object" && "item" in obj;
    }
    function createRowContainer(dialog) {
      let rowContainer2 = ui.create.div(".row-container", dialog.content);
      rowContainer2.css({
        gridTemplateColumns: ratioStr
      });
      return rowContainer2;
    }
    function addItemToItemContainer(item, itemContainer, itemOption) {
      if (!item || Array.isArray(item) && !item.length) {
        itemContainer.classList.add("popup");
        return;
      }
      let items = [];
      if (typeof item == "string") {
        if (item.startsWith("###")) {
          const items2 = item.slice(3).split("###");
          itemContainer.closest(".dialog").add(items2[0]);
          itemContainer.closest(".dialog").addText(items2[1], items2[1].length <= 20);
        } else {
          let caption = ui.create.caption(item, itemContainer);
          caption.css(itemOption.itemCss ?? {});
          items.push(caption);
        }
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
      items.forEach((item2) => {
        item2.classList.add("item");
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
    if (Array.isArray(item) && item.every((itemx) => Array.isArray(itemx))) {
      item.forEach((itemx) => {
        this.add(itemx, noclick, zoom);
      });
    } else if (typeof item == "string") {
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
    } else if (["div", "fragment"].includes(get.objtype(item))) {
      this.content.appendChild(item);
    } else if (get.itemtype(item) == "cards") {
      const buttons2 = ui.create.div(".buttons", this.content);
      if (zoom) {
        buttons2.classList.add("smallzoom");
      }
      this.buttons = this.buttons.concat(ui.create.buttons(item, "card", buttons2, noclick));
    } else if (get.itemtype(item) == "players") {
      var buttons = ui.create.div(".buttons", this.content);
      if (zoom) {
        buttons.classList.add("smallzoom");
      }
      this.buttons = this.buttons.concat(ui.create.buttons(item, "player", buttons, noclick));
    } else if (item[1] == "textbutton") {
      ui.create.textbuttons(item[0], this, noclick);
    } else if (item[1] == "skill") {
      var buttons = ui.create.div(".buttons", this.content);
      if (zoom) {
        buttons.classList.add("smallzoom");
      }
      this.buttons = this.buttons.concat(ui.create.buttons(item[0], "skill", buttons, noclick));
    } else if (item[1] == "addNewRow") {
      this.addNewRow(...item[0]);
    } else if (item[1] == "handle") {
      item[0](this);
    } else {
      var buttons = ui.create.div(".buttons", this.content);
      if (zoom) {
        buttons.classList.add("smallzoom");
      }
      this.buttons = this.buttons.concat(ui.create.buttons(item[0], item[1], buttons, noclick));
    }
    if (this.buttons.length) {
      if (this.forcebutton !== false) {
        this.forcebutton = true;
      }
      if (this.buttons.length > 3 || zoom && this.buttons.length > 5) {
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
    return this;
  }
  /**
   * @param { string } str
   */
  setCaption(str) {
    this.querySelector(".caption").innerHTML = str;
    return this;
  }
}
export {
  Dialog
};
