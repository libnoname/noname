import { _status, get, lib, ui } from "noname";
export class Button extends HTMLDivElement {
	/**
	 * @type { string | undefined }
	 */
	// eslint-disable-next-line no-unreachable
	buttonid;
	/**
	 * @param {{}} item
	 * @param {keyof typeof ui.create.buttonPresets | ((item: {}, type: Function, position?: HTMLDivElement | DocumentFragment, noClick?: true, button?: Button) => Button)} type
	 * @param {HTMLDivElement|DocumentFragment} [position]
	 * @param {true} [noClick]
	 * @param { Button } [button]
	 */
	// @ts-expect-error ignore
	constructor(item, type, position, noClick, button) {
		if (item instanceof Button) {
			const other = item;
			// @ts-expect-error ignore
			[item, type, position, noClick, button] = other._args;
		}
		if (typeof type == "function") {
			button = type(item, type, position, noClick, button);
		} else if (ui.create.buttonPresets[type]) {
			button = ui.create.buttonPresets[type](item, type, position, noClick, button);
		}
		if (button) {
			Object.setPrototypeOf(button, (lib.element.Button || Button).prototype);
			if (!noClick) {
				button.addEventListener(lib.config.touchscreen ? "touchend" : "click", ui.click.button);
			} else {
				button.classList.add("noclick");
				const intro = button.querySelector(".intro");
				if (intro) {
					intro.remove();
				}
			}
			if (!button.buttonid) {
				button.buttonid = get.id();
			}
			// @ts-expect-error ignore
			button._args = [item, type, position, noClick, button];
			return button;
		} else {
			console.error([item, type, position, noClick, button]);
			throw new Error("button不合法");
		}
	}
	exclude() {
		if (_status.event.excludeButton == undefined) {
			_status.event.excludeButton = [];
		}
		_status.event.excludeButton.add(this);
	}
	get updateTransform() {
		return lib.element.Card.prototype.updateTransform;
	}
}
