import { lib } from "../index.js";
import { game } from "../../game/index.js";

/**
 * @type {(NonameHookType["addGroup"])[]}
 */
export const addGroup = [
	function addColor(id, _short, _name, config) {
		if (typeof config.color != "undefined" && config.color != null) {
			let color1, color2, color3, color4;
			if (typeof config.color == "string" && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(config.color)) {
				let c1 = parseInt(`0x${config.color.slice(1, 3)}`);
				let c2 = parseInt(`0x${config.color.slice(3, 5)}`);
				let c3 = parseInt(`0x${config.color.slice(5, 7)}`);
				color1 = color2 = color3 = color4 = [c1, c2, c3, 1];
			} else if (Array.isArray(config.color) && config.color.length == 4) {
				if (config.color.every((item) => Array.isArray(item))) {
					color1 = config.color[0];
					color2 = config.color[1];
					color3 = config.color[2];
					color4 = config.color[3];
				} else color1 = color2 = color3 = color4 = config.color;
			}
			if (color1 && color2 && color3 && color4) {
				const cs = lib.linq.cselector;
				game.dynamicStyle.addObject({
					[cs.group(
						cs.of(cs.class("player ", "identity"), cs.isAttr("data-color", `"${id}"`)),
						cs.of("div", cs.isAttr("data-nature", `"${id}"`)),
						cs.of("span", cs.isAttr("data-nature", `"${id}"`))
					)]: {
						textShadow: cs.group(
							"black 0 0 1px",
							`rgba(${color1.join()}) 0 0 2px`,
							`rgba(${color2.join()}) 0 0 5px`,
							`rgba(${color3.join()}) 0 0 10px`,
							`rgba(${color4.join()}) 0 0 10px`
						),
					},
					[cs.group(
						cs.of("div", cs.isAttr("data-nature", `"${id}m"`)),
						cs.of("span", cs.isAttr("data-nature", `"${id}m"`))
					)]: {
						textShadow: cs.group(
							"black 0 0 1px",
							`rgba(${color1.join()}) 0 0 2px`,
							`rgba(${color2.join()}) 0 0 5px`,
							`rgba(${color3.join()}) 0 0 5px`,
							`rgba(${color4.join()}) 0 0 5px`,
							"black 0 0 1px"
						),
					},
					[cs.group(
						cs.of("div", cs.isAttr("data-nature", `"${id}mm"`)),
						cs.of("span", cs.isAttr("data-nature", `"${id}mm"`))
					)]: {
						textShadow: cs.group(
							"black 0 0 1px",
							`rgba(${color1.join()}) 0 0 2px`,
							`rgba(${color2.join()}) 0 0 2px`,
							`rgba(${color3.join()}) 0 0 2px`,
							`rgba(${color4.join()}) 0 0 2px`,
							"black 0 0 1px"
						),
					},
				});
				lib.groupnature[id] = id;
			}
		}
	},
	function addImage(id, _short, _name, config) {
		if (typeof config.image == "string") {
			Reflect.defineProperty(lib.card, `group_${id}`, {
				configurable: true,
				enumerable: false,
				writable: true,
				value: {
					fullskin: true,
					image: config.image,
				},
			});
		}
	},
];

/**
 * @type {NonameHookType["addNature"][]}
 */
export const addNature = [
	function addColor(nature, _translation, config) {
		if (typeof config != "object") config = {};
		/**
		 * @type {boolean}
		 */
		// @ts-ignore
		let linked = config.linked;
		/**
		 * @type {number}
		 */
		// @ts-ignore
		let order = config.order;
		/**
		 * @type {string}
		 */
		// @ts-ignore
		let background = config.background;
		/**
		 * @type {number[]}
		 */
		// @ts-ignore
		let lineColor = config.lineColor;
		if (typeof linked != "boolean") linked = true;
		if (typeof order != "number") order = 0;
		if (typeof background != "string") background = "";
		if (!Array.isArray(lineColor) || lineColor.length != 3) lineColor = [];
		else if (background.startsWith("ext:")) {
			background = background.replace(/^ext:/, "extension/");
		}
		if (linked) lib.linked.add(nature);
		if (lineColor.length) lib.lineColor.set(nature, lineColor);
		lib.nature.set(nature, order);
		if (background.length > 0) lib.natureBg.set(nature, background);
		if (config.audio) {
			for (let key in config.audio) {
				if (!lib.natureAudio[key]) {
					lib.natureAudio[key] = config.audio[key];
				} else {
					for (let key2 in config.audio[key]) {
						lib.natureAudio[key][key2] = config.audio[key][key2];
					}
				}
			}
		}

		let color1, color2;
		if (typeof config.color == "string" && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(config.color)) {
			let c1 = parseInt(`0x${config.color.slice(1, 3)}`);
			let c2 = parseInt(`0x${config.color.slice(3, 5)}`);
			let c3 = parseInt(`0x${config.color.slice(5, 7)}`);
			color1 = color2 = [c1, c2, c3, 1];
		} else if (Array.isArray(config.color) && config.color.length >= 2 && config.color.length <= 4) {
			if (config.color.every((item) => Array.isArray(item))) {
				color1 = config.color[0];
				color2 = config.color[1];
			} else {
				let color = config.color.slice();
				if (color.length == 3) color.push(1);
				color1 = color2 = color;
			}
		}
		if (color1 && color2) {
			const cs = lib.linq.cselector;
			const g1 = cs.group(cs.of(cs.class("card", "fullskin", `${nature}`), ">", cs.class("name")));
			let result = {};
			result[g1] = {
				color: `rgba(${color1.join()})`,
				border: cs.merge("1px", "solid", `rgba(${color2.join()})`),
			};
			// @ts-ignore
			game.dynamicStyle.addObject(result);

			const g2 = cs.group(
				cs.of(cs.class("tempname", `${nature}`), ":not([data-nature])>", cs.class("span"))
			);
			let result2 = {};
			result2[g2] = {
				color: `rgba(${color1.join()})`,
			};
			// @ts-ignore
			game.dynamicStyle.addObject(result2);
		}
	},
];
