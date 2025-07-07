import { lib, get } from "../../../noname.js";
import { ref, onMounted } from "../../../game/vue.esm-browser.js";
import { delay } from "../../util/index.js";
import dedent from "../../../game/dedent.js";

const html = dedent;
/**
 * @type {import("vue").Component}
 */
export default {
	template: html`
		<div class="hidden" v-for="(mode, index) in lib.config.all.mode" :key="mode" :link="mode" :index="index" ref="nodeList">
			<div class="splashtext">{{ get.verticalStr(get.translation(mode)) }}</div>
			<div class="avatar"></div>
		</div>
	`,
	props: {
		handle: Function,
		click: Function,
	},

	setup(props) {
		let nodeList = ref([]);

		let clicked = false;

		onMounted(() => {
			nodeList.value.forEach(async node => {
				let mode = node.getAttribute("link");
				let index = parseInt(node.getAttribute("index"));
				node.listen(() => {
					if (!clicked) {
						clicked = true;
						props.click(mode, node);
					}
				});

				let avatar = node.querySelector(".avatar");

				let background = lib.config.all.stockmode.includes(mode) ? props.handle(mode) : lib.mode[mode].splash;
				let link = lib.init.parseResourceAddress(background);
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

		return {
			lib,
			get,
			nodeList,
		};
	},
};
