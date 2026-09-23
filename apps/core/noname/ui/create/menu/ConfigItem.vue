<template>
	<!-- 配置名可以是游戏内 HTML，不是用户输入 -->
	<span v-if="showClearLabel" v-once v-html="clearLabel"></span>
	<span v-else-if="nameHtml" v-once v-html="nameHtml"></span>
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
	onclick?: (this: HTMLDivElement, ...args: unknown[]) => void | boolean;
	update?: (...args: unknown[]) => void;
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
	openMenu: (menu: HTMLDivElement, event: { clientX: number; clientY: number }, onclose: () => void) => void;
}

interface ConfigLink {
	config: MenuConfig;
	choosing?: HTMLDivElement;
	menu?: HTMLDivElement;
	current?: MenuConfig["init"];
	setChoice?: (text: string) => void;
	clickSwitcher?: () => void;
	clickMenuItem?: (menuItem: HTMLDivElement) => void;
	addTextMenuItem?: (link: string, label: string, index?: number) => HTMLDivElement;
}

const props = defineProps<Props>();

const config = props.config;
const showClearLabel = Boolean(config.clear);
const clearLabel = showClearLabel ? String(config.name) : "";
const nameHtml = !showClearLabel && typeof config.name == "string" && config.name ? config.name : "";
const mode = resolveMode(config);
const node = props.node;
const link = node._link as ConfigLink;
const choosing = useTemplateRef<HTMLDivElement>("choosing");
const input = useTemplateRef<HTMLDivElement>("input");

onMounted(() => {
	mount();
});

function mount() {
	if (showClearLabel && !config.nopointer) {
		node.classList.add("pointerspan");
	}
	if (!showClearLabel && config.name != "开启") {
		lib.setIntro(node, (uiintro: Dialog & { _place_text?: ReturnType<Dialog["add"]> }) => {
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
	if (mode == "switcher") {
		link.choosing = choosing.value!;
		link.setChoice = setChoice;
		link.clickSwitcher = openSwitcher;
		link.clickMenuItem = selectMenuItem;
		link.addTextMenuItem = addTextMenuItem;
		node.classList.add("switcher");
		node.listen(openSwitcher);
		const choice = config.item![String(config.init)] || config.init;
		setChoice(typeof choice == "string" ? choice : "");
		buildMenu();
	} else if (mode == "clear") {
		if ((`<span>${clearLabel}</span>`).length >= 15) {
			node.style.height = "auto";
		}
		node.listen(props.clickToggle);
	} else if (mode == "input") {
		node.classList.add("switcher");
		bindInput(input.value!);
	} else if (mode == "toggle") {
		node.classList.add("toggle");
		node.listen(props.clickToggle);
		if (config.init == true) {
			node.classList.add("on");
		}
	}
}

function setChoice(text: string) {
	link.choosing!.innerHTML = text;
}

function openSwitcher() {
	if (node.classList.contains("disabled")) {
		return;
	}
	node.classList.add("on");
	const menu = link.menu;
	if (!menu) {
		return;
	}
	const pos1 = link.choosing!.getBoundingClientRect();
	const pos2 = ui.window.getBoundingClientRect();
	const close = () => {
		node.classList.remove("on");
	};
	if (menu.classList.contains("visual")) {
		props.openMenu(
			menu,
			{
				clientX: pos1.left + pos1.width + 5 - pos2.left,
				clientY: pos1.top - pos2.top,
			},
			close
		);
	} else if (menu.childElementCount > 10) {
		props.openMenu(
			menu,
			{
				clientX: pos1.left + pos1.width + 5 - pos2.left,
				clientY: Math.min((ui.window.offsetHeight - 400) / 2, pos1.top - pos2.top),
			},
			close
		);
		lib.setScroll(menu);
	} else {
		props.openMenu(
			menu,
			{
				clientX: pos1.left + pos1.width + 5 - pos2.left,
				clientY: pos1.top - pos2.top,
			},
			close
		);
	}
}

function selectMenuItem(menuItem: HTMLDivElement) {
	const raw = link.config;
	link.current = menuItem.link;
	const previous = link.choosing!.innerHTML;
	setChoice(raw.item![menuItem._link]);
	if (raw.onclick) {
		if (raw.onclick.call(node, menuItem._link, menuItem) === false) {
			setChoice(previous);
		}
	}
	if (raw.update) {
		raw.update();
	}
}

function addTextMenuItem(itemLink: string, label: string, index?: number) {
	const menu = link.menu!;
	const textMenu = ui.create.div(
		"",
		label,
		menu,
		function (this: HTMLDivElement) {
			selectMenuItem(this);
		},
		index
	);
	textMenu._link = itemLink;
	return textMenu;
}

function buildMenu() {
	const item = config.item!;
	const menu = ui.create.div(".menu");
	link.menu = menu;
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
				visualMenuNode.listen(function (this: HTMLDivElement) {
					selectMenuItem(this);
				});
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
			const textMenu = ui.create.div("", item[i] || i, menu, function (this: HTMLDivElement) {
				selectMenuItem(this);
			});
			textMenu._link = i;
			if (config.textMenu) {
				config.textMenu(textMenu, i, item[i] || i, config);
			}
			lib.setScroll(menu);
		}
	}
	menu._link = node;
	link.current = config.init;
}

function bindInput(inputNode: HTMLDivElement) {
	if (!config.fixed) {
		inputNode.contentEditable = "true";
		inputNode.style.webkitUserSelect = "text";
	}
	inputNode.style.minWidth = "10px";
	inputNode.style.maxWidth = "60%";
	inputNode.style.overflow = "hidden";
	inputNode.style.whiteSpace = "nowrap";
	inputNode.onkeydown = function (e) {
		if (e.key == "Enter") {
			e.preventDefault();
			e.stopPropagation();
			inputNode.blur();
		}
	};
	if (config.name == "联机昵称") {
		inputNode.innerHTML = String(config.init || "无名玩家");
		inputNode.onblur = function () {
			inputNode.innerHTML = inputNode.innerHTML.replace(/<br>/g, "");
			if (!inputNode.innerHTML || get.is.banWords(inputNode.innerHTML)) {
				inputNode.innerHTML = "无名玩家";
			}
			inputNode.innerHTML = inputNode.innerHTML.slice(0, 12);
			game.saveConfig("connect_nickname", inputNode.innerHTML);
			game.saveConfig("connect_nickname", inputNode.innerHTML, "connect");
		};
	} else if (config.name == "联机头像") {
		const currentId = String(lib.config.connect_avatar || config.init || "caocao");
		inputNode.innerHTML = lib.translate[currentId] || "曹操";
		inputNode.onblur = config.onblur ?? null;
	} else if (config.name == "联机大厅") {
		inputNode.innerHTML = String(config.init || lib.hallURL);
		inputNode.onblur = function () {
			if (!inputNode.innerHTML) {
				inputNode.innerHTML = lib.hallURL;
			}
			inputNode.innerHTML = inputNode.innerHTML.replace(/<br>/g, "");
			game.saveConfig("hall_ip", inputNode.innerHTML, "connect");
		};
	} else {
		inputNode.innerHTML = config.init == null ? "" : String(config.init);
		inputNode.onblur = config.onblur ?? null;
	}
}

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

</script>
