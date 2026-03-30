import { defineComponent, ref, onMounted, openBlock, createElementBlock, Fragment, renderList, unref, createElementVNode, toDisplayString } from "vue";
import "../../../noname.js";
import { delay } from "../../util/index.js";
import { lib } from "../../library/index.js";
import { get } from "../../get/index.js";
const _hoisted_1 = ["link", "index"];
const _hoisted_2 = { class: "splashtext" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "OnloadSplash",
  props: {
    handle: { type: Function },
    click: { type: Function }
  },
  setup(__props) {
    const props = __props;
    const nodeList = ref([]);
    let clicked = false;
    onMounted(() => {
      nodeList.value.forEach(async (node) => {
        const mode = node.getAttribute("link");
        const index = parseInt(node.getAttribute("index") || "0");
        node.listen(() => {
          if (!clicked) {
            clicked = true;
            props.click(mode, node);
          }
        });
        const avatar = node.querySelector(".avatar");
        const background = lib.config.all.stockmode.includes(mode) ? props.handle(mode) : lib.mode[mode].splash;
        const link = lib.init.parseResourceAddress(background);
        if (link.protocol === "db:") {
          avatar.setBackgroundDB(link.href);
        } else {
          avatar.setBackgroundImage(link.href);
        }
        if (!lib.config.touchscreen) {
          node.addEventListener("mousedown", () => node.classList.add("glow"));
          node.addEventListener("mouseup", () => node.classList.remove("glow"));
          node.addEventListener("mouseleave", () => node.classList.remove("glow"));
        }
        await delay(index * 100);
        node.show();
      });
    });
    return (_ctx, _cache) => {
      return openBlock(true), createElementBlock(Fragment, null, renderList(unref(lib).config.all.mode, (mode, index) => {
        return openBlock(), createElementBlock("div", {
          class: "hidden",
          key: mode,
          link: mode,
          index,
          ref_for: true,
          ref_key: "nodeList",
          ref: nodeList
        }, [
          createElementVNode("div", _hoisted_2, toDisplayString(unref(get).verticalStr(unref(get).translation(mode))), 1),
          _cache[0] || (_cache[0] = createElementVNode("div", { class: "avatar" }, null, -1))
        ], 8, _hoisted_1);
      }), 128);
    };
  }
});
export {
  _sfc_main as default
};
