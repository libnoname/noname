import { _status, game, get, lib, ui } from "noname";

/**
 * 使字符串有html的代码提示
 */
const html = (strings, ...values) => String.raw({ raw: strings }, ...values);

/**
 * @type { import("vue").Component }
 */
export const NonameToggle = {
	template: html`<div class="new-menu-toggle"><div></div></div>`,
};

/**
 * @type { import("vue").Component }
 */
export const NonameConfig = {
	template: html`
		<div
			ref="node"
			:class="{ config: true, switcher: config.item || config.input, toggle: !config.item && !config.range && !config.clear && !config.input }"
			@click="nodeClick"
			:style="nodeStyle"
		>
			<span>{{ config.name }}</span>
			<div v-if="config.item">{{ config.item[config.init] }}</div>
			<div v-else-if="config.range">
				<input type="range" />
			</div>
			<div v-else-if="config.clear"></div>
			<div v-else-if="config.input" ref="input" :contentEditable="!config.fixed" :style="inputStyle" @keydown="inputKeydown"></div>
			<noname-toggle v-else></noname-toggle>
		</div>
	`,
	props: {
		config: Object,
	},
	components: {
		"noname-toggle": NonameToggle,
	},
	methods: {
		nodeClick() {
			if (this.config.item) {
				this.clickSwitcher(this.$refs.node);
			}
			if (!this.config.item && !this.config.range && !this.config.clear && !this.config.input) {
				this.clickToggle(this.$refs.node);
			}
		},
		clickSwitcher(node) {
			console.log("clickSwitcher");
		},
		clickToggle(node) {
			console.log("clickToggle");
			if (node.classList.contains("disabled")) {
				return;
			}
			node.classList.toggle("on");
			const config = this.config;
			if (config.onclick) {
				if (config.onclick.call(node, node.classList.contains("on")) === false) {
					node.classList.toggle("on");
				}
			}
			if (config.update) {
				config.update();
			}
			// saveconfig后发送通知
		},
		nodeStyle() {
			if (this.config.clear && this.$refs.node.innerHTML.length >= 15) {
				return {
					height: "auto",
				};
			}
			return {};
		},
		inputStyle() {
			return {
				webkitUserSelect: this.config.fixed ? "text" : "",
				maxWidth: "60%",
				overflow: "hidden",
				whiteSpace: "nowrap",
			};
		},
		inputKeydown(e) {
			if (e.key == "Enter") {
				e.preventDefault();
				e.stopPropagation();
				e.target.blur();
			}
		},
	},
	mounted() {
		this.$nextTick(() => {
			// const root = this.$refs.root;
			const config = this.config;
			// root._link = { config: this.config };
			if (!config.clear) {
				if (config.name != "开启") {
					if (config.name == "屏蔽弱将") {
						config.intro = "强度过低的武将（孙策除外）不会出现在选将框，也不会被AI选择";
					} else if (config.name == "屏蔽强将") {
						config.intro = "强度过高的武将不会出现在选将框，也不会被AI选择";
					} else if (!config.intro) {
						config.intro = "设置" + config.name;
					}
					lib.setIntro(this.$refs.node, function (uiintro) {
						if (lib.config.touchscreen) {
							_status.dragged = true;
						}
						uiintro.style.width = "170px";
						let str = config.intro;
						if (typeof str == "function") {
							str = str();
						}
						uiintro._place_text = uiintro.add('<div class="text" style="display:inline">' + str + "</div>");
					});
				}
			} else {
				if (!config.nopointer) {
					this.$refs.node.classList.add("pointerspan");
				}
			}
			if (config.item) {
				// 还没写，是false
				if (this.$refs.menu) {
					if (typeof this.config.textMenu == "function" && this.$refs.menu.childElementCount > 0) {
						Array.from(this.$refs.menu.children).forEach(node => {
							const link = node.getAttribute("link");
							// 设置不同字体时，修改对应node的文字字体
							this.config.textMenu?.(node, link, this.config.item[link], this.config);
						});
					}
					if (typeof this.config.visualBar == "function" && this.$refs.visualBar) {
						this.config.visualBar(this.$refs.visualBar, this.config.item, function (i, before) {}, this.$refs.root);
					}
					lib.setScroll(this.$refs.menu);
				}
			} else if (config.range) {
				void 0;
			} else if (config.clear) {
				void 0;
			} else if (config.input) {
				const input = this.$refs.input;
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
				} else if (config.name == "联机头像") {
					// 显示当前配置的武将名称（直接使用翻译，不额外添加前缀）
					const currentId = lib.config.connect_avatar || config.init || "caocao";
					input.innerHTML = lib.translate[currentId] || "曹操";
					input.onblur = config.onblur;
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
				if (config.init == true) {
					this.$refs.node.classList.add("on");
				}
			}
		});
	},
	beforeMount() {
		const config = this.config;
		if (config.item) {
			if (typeof config.item == "function") {
				config.item = config.item();
			}
		}
	},
};

/**
 * @type { import("vue").Component }
 */
export const menuConfigTemplate = {
	template: html`
		<div ref="menu" v-if="config.item" :class="{ menu: true, visual: config.visualMenu, withbar: config.visualBar }">
			<!-- visualBar -->
			<div ref="visualBar" v-if="config.visualMenu" @click="visualBarClick"></div>
			<!-- visualMenu -->
			<div v-if="config.visualMenu" v-for="(value, i) in config.item" :link="i" @click="clickMenuItem">
				<div class="name">{{ get.verticalStr(value) }}</div>
			</div>
			<!-- itemMenu -->
			<div v-else v-for="(value, i) in config.item" @click="clickMenuItem" :link="i">{{ value }}</div>
		</div>
	`,
	props: {
		config: Object,
	},
	data() {
		return {};
	},
	methods: {
		createNode(i, before) {
			var visualMenu = ui.create.div();
			if (this.config.visualBar) {
				if (before) {
					this.$refs.menu.insertBefore(visualMenu, before);
				} else {
					this.$refs.menu.insertBefore(visualMenu, this.$refs.menu.lastChild);
				}
			} else {
				this.$refs.menu.appendChild(visualMenu);
			}
			ui.create.div(".name", get.verticalStr(this.config.item[i]), visualMenu);
			visualMenu._link = i;
			if (this.config.visualMenu(visualMenu, i, this.config.item[i], this.config) !== false) {
				visualMenu.listen(this.clickMenuItem);
			}
			visualMenu.update = this.updateVisual;
		},
		clickMenuItem() {},
		visualBarClick() {
			// todo: visualBar.parentNode.parentNode 是 popup-container
			this.$refs.visualBar.parentNode.parentNode.noclose = true;
		},
		updateVisual(node) {
			const link = node.getAttribute("link");
			this.config.visualMenu(node, link, this.config.item[link], this.config);
		},
	},
	mounted() {
		this.$nextTick(() => {});
	},
};
