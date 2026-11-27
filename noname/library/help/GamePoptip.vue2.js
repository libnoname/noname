import { defineComponent, openBlock, createElementBlock, Fragment, renderList, unref, createElementVNode, toDisplayString } from "vue";
import "../../../noname.js";
import { lib } from "../index.js";
const _hoisted_1 = { class: "game-poptip" };
const _hoisted_2 = ["innerHTML"];
const _sfc_main = /* @__PURE__ */ defineComponent({
  ...{ persist: false },
  __name: "GamePoptip",
  setup(__props) {
    const items = lib.poptip.getIdList("rule").map((id) => ({
      id,
      name: lib.poptip.getName(id),
      info: lib.poptip.getInfo(id)
    }));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("dl", _hoisted_1, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(unref(items), (item) => {
          return openBlock(), createElementBlock("div", {
            key: item.id,
            class: "game-poptip-entry"
          }, [
            createElementVNode("dt", null, toDisplayString(item.name), 1),
            createElementVNode("dd", {
              innerHTML: item.info
            }, null, 8, _hoisted_2)
          ]);
        }), 128))
      ]);
    };
  }
});
export {
  _sfc_main as default
};
