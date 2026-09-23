<template>
	<!-- 配置名可以是游戏内 HTML，不是用户输入 -->
	<span v-if="showClearLabel" v-once v-html="clearLabel"></span>
	<div v-if="mode === 'toggle'" ref="knob" v-once><div></div></div>
	<div v-else-if="mode === 'switcher'" ref="choosing" v-once></div>
	<div v-else-if="mode === 'input'" ref="input" v-once></div>
</template>

<script lang="ts" setup>
import { onMounted, useTemplateRef } from "vue";
import { ui, game, get, lib, _status } from "noname";
import type { Dialog } from "@/library/element/dialog.js";

type ConfigMode = "switcher" | "plain" | "clear" | "input" | "toggle";

interface MenuConfig {
	name?: string;
	init?: string | boolean | string[];
	item?: Record<string, string>;
	range?: unknown;
	clear?: boolean;
	input?: boolean;
	intro?: string | (() => string);
	nopointer?: boolean;
	visualMenu?: (node: HTMLDivElement, link: string, name: string, config: MenuConfig) => void | false;
	visualBar?: (
		node: HTMLDivElement,
		item: Record<string, string>,
		create: (link: string, before?: Node | null) => void,
		switcher?: HTMLDivElement
	) => void;
	textMenu?: (node: HTMLDivElement, link: string, name: string, config: MenuConfig) => void;
	fixed?: boolean;
	onblur?: (this: GlobalEventHandlers, event: FocusEvent) => void;
}

interface VisualMenuNode extends HTMLDivElement {
	update: (this: HTMLDivElement) => void;
}

interface PopupContainer extends HTMLElement {
	noclose?: boolean;
}

interface Props {
	config: MenuConfig;
	node: HTMLDivElement;
	clickToggle: (this: HTMLDivElement, event: Event) => void;
	clickSwitcher: (this: HTMLDivElement, event: Event) => void;
	clickMenuItem: (this: HTMLDivElement, event: Event) => void;
}

const props = defineProps<Props>();

const config = props.config;
const showClearLabel = Boolean(config.clear);
const clearLabel = showClearLabel ? String(config.name) : "";
const mode = resolveMode(config);
const node = props.node;
const knob = useTemplateRef<HTMLDivElement>("knob");
const choosing = useTemplateRef<HTMLDivElement>("choosing");
const input = useTemplateRef<HTMLDivElement>("input");

onMounted(() => {
	const raw = node._link.config as MenuConfig;
	if (showClearLabel && !raw.nopointer) {
		node.classList.add("pointerspan");
	}
	stripComments(node);
	if (!showClearLabel && typeof raw.name == "string" && raw.name) {
		node.insertAdjacentHTML("afterbegin", raw.name);
	}
	const tail = knob.value || choosing.value || input.value;
	if (tail) {
		node.appendChild(tail);
	}
	stripComments(node);
	if (!showClearLabel && raw.name != "开启") {
		lib.setIntro(node, function (uiintro: Dialog & { _place_text?: ReturnType<Dialog["add"]> }) {
			if (lib.config.touchscreen) {
				_status.dragged = true;
			}
			uiintro.style.width = "170px";
			let str = raw.intro;
			if (typeof str == "function") {
				str = str();
			}
			uiintro._place_text = uiintro.add('<div class="text" style="display:inline">' + str + "</div>");
		});
	}
	if (mode == "switcher") {
		const choosingNode = choosing.value!;
		node.classList.add("switcher");
		node.listen(props.clickSwitcher);
		const choice = raw.item![String(raw.init)] || raw.init;
		choosingNode.innerHTML = typeof choice == "string" ? choice : "";
		node._link.choosing = choosingNode;
		buildMenu(node, raw);
	} else if (mode == "clear") {
		if (node.innerHTML.length >= 15) {
			node.style.height = "auto";
		}
		node.listen(props.clickToggle);
	} else if (mode == "input") {
		node.classList.add("switcher");
		bindInput(input.value!, raw);
	} else if (mode == "toggle") {
		node.classList.add("toggle");
		node.listen(props.clickToggle);
		if (raw.init == true) {
			node.classList.add("on");
		}
	}
});

function resolveMode(config: MenuConfig): ConfigMode {
	if (config.item && !Array.isArray(config.init)) {
		return "switcher";
	}
	if (config.item || config.range) {
		return "plain";
	}
	if (config.clear) {
		return "clear";
	}
	if (config.input) {
		return "input";
	}
	return "toggle";
}

function stripComments(node: HTMLDivElement) {
	for (const child of Array.from(node.childNodes)) {
		if (child.nodeType == Node.COMMENT_NODE) {
			child.remove();
		}
	}
}

function buildMenu(node: HTMLDivElement, config: MenuConfig) {
	const item = config.item!;
	const menu = ui.create.div(".menu");
	node._link.menu = menu;
	if (config.visualMenu) {
		const visualMenu = config.visualMenu;
		menu.classList.add("visual");
		const updateVisual = function (this: HTMLDivElement) {
			visualMenu(this, String(this._link), item[String(this._link)] || String(this._link), config);
		};
		const createNode = function (i: string, before?: Node | null) {
			const visualMenuNode = ui.create.div() as VisualMenuNode;
			if (config.visualBar) {
				if (before) {
					menu.insertBefore(visualMenuNode, before);
				} else {
					menu.insertBefore(visualMenuNode, menu.lastChild);
				}
			} else {
				menu.appendChild(visualMenuNode);
			}
			ui.create.div(".name", get.verticalStr(item[i] || i), visualMenuNode);
			visualMenuNode._link = i;
			if (visualMenu(visualMenuNode, i, item[i] || i, config) !== false) {
				visualMenuNode.listen(props.clickMenuItem);
			}
			visualMenuNode.update = updateVisual;
		};
		if (config.visualBar) {
			const renderBar = config.visualBar;
			const visualBar = ui.create.div(menu, function (this: HTMLDivElement) {
				(this.parentNode!.parentNode as PopupContainer).noclose = true;
			}) as HTMLDivElement & { update: () => void };
			menu.classList.add("withbar");
			renderBar(visualBar, item, createNode, node);
			visualBar.update = function () {
				renderBar(visualBar, item, createNode, node);
			};
		}
		for (const i in item) {
			createNode(i);
		}
		lib.setScroll(menu);
		const menuNode = menu as HTMLDivElement & { updateBr: (this: HTMLDivElement) => void };
		menuNode.updateBr = function () {
			const br = Array.from(this.querySelectorAll(".menu.visual>br"));
			while (br.length) {
				br.shift()!.remove();
			}
			const split: ChildNode[] = [];
			for (let i = 1; i < this.childElementCount; i++) {
				if (i % 3 == 0) {
					split.push(this.childNodes[i]!);
				}
			}
			for (let i = 0; i < split.length; i++) {
				this.insertBefore(ui.create.node("br"), split[i]!);
			}
		};
		menuNode.updateBr();
	} else {
		for (const i in item) {
			const textMenu = ui.create.div("", item[i] || i, menu, props.clickMenuItem);
			textMenu._link = i;
			if (config.textMenu) {
				config.textMenu(textMenu, i, item[i] || i, config);
			}
			lib.setScroll(menu);
		}
	}
	menu._link = node;
	node._link.current = config.init;
}

function bindInput(input: HTMLDivElement, config: MenuConfig) {
	if (!config.fixed) {
		input.contentEditable = "true";
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
		input.innerHTML = String(config.init || "无名玩家");
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
		const currentId = String(lib.config.connect_avatar || config.init || "caocao");
		input.innerHTML = lib.translate[currentId] || "曹操";
		input.onblur = config.onblur ?? null;
	} else if (config.name == "联机大厅") {
		input.innerHTML = String(config.init || lib.hallURL);
		input.onblur = function () {
			if (!input.innerHTML) {
				input.innerHTML = lib.hallURL;
			}
			input.innerHTML = input.innerHTML.replace(/<br>/g, "");
			game.saveConfig("hall_ip", input.innerHTML, "connect");
		};
	} else {
		input.innerHTML = String(config.init);
		input.onblur = config.onblur ?? null;
	}
}
</script>
