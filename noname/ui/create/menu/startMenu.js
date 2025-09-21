import { ui, game, get, lib, _status } from "../../../../noname.js";
import { createApp, ref, reactive, onMounted, toRaw, isReactive, watch } from "vue";
import { NonameConfig } from "./nonameConfig.js";
/**
 * 使字符串有html的代码提示
 */
const html = (strings, ...values) => String.raw({ raw: strings }, ...values);

/** 显示在菜单的名称 */
export const startMenutabName = "开始";

/**
 * @type { menuData }
 */
export const startMenuData = {
	leftPaneData: [],
	rightPaneApps: new Map(),
	configDatas: new Map(),
	// @ts-expect-error ignore
	initLeftPaneData(connectMenu) {
		/** @type { string[] } */
		const modeorder = lib.config.modeorder || [];
		for (const i in lib.mode) {
			modeorder.add(i);
		}
		const leftPaneNames = modeorder.filter(mode => {
			if (connectMenu) {
				if (!lib.mode[mode].connect) {
					return;
				}
				if (!lib.config["connect_" + mode + "_banned"]) {
					lib.config["connect_" + mode + "_banned"] = [];
				}
				if (!lib.config["connect_" + mode + "_bannedcards"]) {
					lib.config["connect_" + mode + "_bannedcards"] = [];
				}
			}
			if (lib.config.all.mode.includes(mode)) {
				// createModeConfig(modeorder[i], start.firstChild);
				return true;
			}
		});
		return leftPaneNames.map(mode => {
			return {
				name: lib.mode[mode]?.name || mode,
				attrs: {
					mode,
				},
			};
		});
	},
	getDefaultActive(connectMenu, nodes) {
		for (let index = 0; index < nodes.length; index++) {
			const node = nodes[index];
			const mode = node.getAttribute("mode");
			if (connectMenu) {
				// todo: menuUpdates.push(updateConnectDisplayMap);
				if (mode == lib.config.connect_mode) {
					return node;
				}
			} else {
				if (mode == lib.config.mode) {
					return node;
				}
			}
		}
	},
	initConfigs(connectMenu, node, startButton) {
		/** @type { string } */
		// @ts-expect-error ignore
		const mode = node.getAttribute("mode");
		/** @type { { name: string, connect: { update: (config, map) => any; [key: string]: SelectConfigData }, config: { update: (config, map) => any; [key: string]: SelectConfigData } } } */
		const info = lib.mode[mode];
		const infoconfig = connectMenu ? info.connect : info.config;
		if (infoconfig) {
			const config = lib.config.mode_config[mode] || {};
			if (connectMenu) {
				if (!infoconfig.connect_choose_timeout) {
					infoconfig.connect_choose_timeout = {
						name: "出牌时限",
						init: "30",
						item: {
							10: "10秒",
							15: "15秒",
							30: "30秒",
							60: "60秒",
							90: "90秒",
						},
						connect: true,
						frequent: true,
					};
				}
				if (!infoconfig.connect_observe) {
					infoconfig.connect_observe = {
						name: "允许旁观",
						init: true,
						connect: true,
					};
				}
				if (!infoconfig.connect_observe_handcard) {
					infoconfig.connect_observe_handcard = {
						name: "允许观看手牌",
						init: false,
						connect: true,
					};
				}
				if (!infoconfig.connect_mount_combine) {
					infoconfig.connect_mount_combine = {
						name: "合并坐骑栏",
						init: false,
						connect: true,
					};
				}
			}
			for (const key in infoconfig) {
				if (key === "update") {
					continue;
				}
				const value = infoconfig[key];
				value._name = key;
				// @ts-expect-error ignore
				value.mode = mode;
				if (key in config) {
					value.init = config[key];
				} else {
					game.saveConfig(key, value.init, mode);
				}
				if (!value.onclick) {
					value.onclick = function (result) {
						// var value = this._link.config;
						// @ts-expect-error ignore
						game.saveConfig(value._name, result, mode);
						if (typeof value.onsave == "function") {
							value.onsave.call(this, result);
						}
						if (!_status.connectMode || game.online) {
							if (typeof value.restart == "function") {
								if (value.restart()) {
									startButton.classList.add("glowing");
								}
							} else if (value.restart) {
								startButton.classList.add("glowing");
							}
						}
					};
				}
				// if (infoconfig.update) {
				// 	value.update = function () {
				// 		infoconfig.update(config, map);
				// 	};
				// }
				// if (infoconfig.update) {
				// 	infoconfig.update(config, map);
				// 	node.update = function () {
				// 		infoconfig.update(config, map);
				// 	};
				// }
			}
		}
		const configData = this.configDatas.get(mode) || reactive({});
		for (const [key, value] of Object.entries(infoconfig)) {
			configData[key] = value;
		}
		if (!isReactive(lib.mode[mode])) {
			lib.mode[mode] = reactive(lib.mode[mode]);
			watch(
				() => lib.mode[mode],
				() => {
					console.log(`lib.mode[${mode}]初始化或更新`);
					for (const [key, value] of Object.entries(infoconfig)) {
						configData[key] = value;
					}
				},
				{ deep: true }
			);
		}
		if (!this.configDatas.get(mode)) {
			this.configDatas.set(mode, configData);
		}
	},
	rightPaneTemplate: {
		template: html` <div ref="root">
			<noname-config v-for="config in configsWithOutUpdate" :config="config" />
		</div>`,
		props: {
			configs: Object,
		},
		data() {
			return {
				configsWithOutUpdate: {},
			};
		},
		components: {
			"noname-config": NonameConfig,
		},
		methods: {},
		beforeMount() {
			const configs = this.configs;
			watch(
				() => configs,
				newVal => {
					console.log("config初始化或更新");
					for (const [key, value] of Object.entries(toRaw(newVal))) {
						if (key === "update") {
							continue;
						}
						this.configsWithOutUpdate[key] = value;
					}
				},
				{ deep: true, immediate: true }
			);
		},
	},
};

/**
 * @type { SMap<null | HTMLElement> }
 */
const connectDisplayMap = {
	connect_player_number: null,
	connect_versus_mode: null,
};

const updateConnectDisplayMap = function () {
	if (_status.waitingForPlayer) {
		if (connectDisplayMap.connect_player_number) {
			connectDisplayMap.connect_player_number.style.display = "none";
		}
		if (connectDisplayMap.connect_versus_mode) {
			connectDisplayMap.connect_versus_mode.style.display = "none";
		}
	}
};
