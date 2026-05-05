<template>
  <div
    class="hidden"
    v-for="(mode, index) in lib.config.all.mode"
    :key="mode"
    :link="mode"
    :index="index"
    ref="nodeList"
  >
    <div class="splashtext">
      {{ get.verticalStr(get.translation(mode)) }}
    </div>
    <div class="avatar"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { lib, get } from "noname";
import { delay } from "@/util/index.js";

interface Props {
  handle: (mode: string) => string;
  click: (mode: string, node: HTMLElement) => void;
}

const props = defineProps<Props>();

const nodeList = ref<HTMLElement[]>([]);
let clicked = false;

onMounted(() => {
  nodeList.value.forEach(async (node: HTMLElement) => {
    const mode = node.getAttribute("link") as string;
    const index = parseInt(node.getAttribute("index") || "0");

    (node as any).listen(() => {
      if (!clicked) {
        clicked = true;
        props.click(mode, node);
      }
    });

    const avatar = node.querySelector(".avatar") as any;

    const background = lib.config.all.stockmode.includes(mode)
      ? props.handle(mode)
      : lib.mode[mode].splash;

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
    (node as any).show();
  });
});
</script>
