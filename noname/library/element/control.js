import { get } from "../../get/index.js";
import { game } from "../../game/index.js";
import { lib } from "../index.js";
import { _status } from "../../status/index.js";
import { ui } from "../../ui/index.js";

export class Control extends HTMLDivElement {
	// @ts-expect-error ignore
	constructor(...args) {
		if (args[0] instanceof Control) {
			const other = args[0];
			// @ts-expect-error ignore
			args = other._args;
		}

		const nc = !ui.control.querySelector("div:not(.removing):not(.stayleft)");
		const controls = Array.isArray(args[0]) ? args[0] : args;
		/**
		 * @type {this}
		 */
		// @ts-expect-error ignore
		const control = ui.create.div(".control");
		Object.setPrototypeOf(control, (lib.element.Control || Control).prototype);
		ui.control.insertBefore(control, _status.createControl || ui.confirm);
		controls.forEach(argument => {
			if (argument == "nozoom") {
				return;
			}
			if (typeof argument == "function") {
				control.custom = argument;
			} else if (argument == "stayleft") {
				control.stayleft = true;
				control.classList.add("stayleft");
			} else {
				control.add(argument);
			}
		});
		ui.controls.unshift(control);
		if (nc) {
			ui.control.addTempClass("nozoom", 100);
		}
		if (control.childNodes.length) {
			control.style.transition = "opacity 0.5s";
			control.addTempClass("controlpressdownx", 500);
			ui.refresh(control);
			if (!control.stayleft) {
				control.style.transform = `translateX(-${control.offsetWidth / 2}px)`;
			}
			control.style.opacity = 1;
			ui.refresh(control);
			control.style.transition = "";
		}

		control.addEventListener(lib.config.touchscreen ? "touchend" : "click", ui.click.control2);

		if (lib.config.button_press) {
			control.addEventListener(lib.config.touchscreen ? "touchstart" : "mousedown", function () {
				if (this.classList.contains("disabled")) {
					return;
				}
				this.classList.add("controlpressdown");
				if (typeof this._offset == "number") {
					this.style.transform = `translateX(${this._offset}px) scale(0.97)`;
				}
			});
			control.addEventListener(lib.config.touchscreen ? "touchend" : "mouseup", function () {
				this.classList.remove("controlpressdown");
				if (typeof this._offset == "number") {
					this.style.transform = `translateX(${this._offset}px)`;
				}
			});
		}

		ui.updatec();
		// @ts-expect-error ignore
		control._args = args;
		return control;
	}
	open() {
		ui.control.insertBefore(this, _status.createControl || ui.confirm);
		ui.controls.unshift(this);
		if (this.childNodes.length) {
			this.style.transition = "opacity 0.5s";
			ui.refresh(this);
			this.style.transform = "translateX(-" + this.offsetWidth / 2 + "px)";
			this.style.opacity = 1;
			ui.refresh(this);
			this.style.transition = "";
		} else {
			this.addTempClass("controlpressdownx", 500);
		}
		ui.updatec();
		return this;
	}
	add(item) {
		var node = document.createElement("div");
		this.appendChild(node);
		node.link = item;
		node.innerHTML = get.translation(item);
		node.addEventListener(lib.config.touchscreen ? "touchend" : "click", ui.click.control);
	}
	close() {
		this.addTempClass("controlpressdownx", 500);

		ui.controls.remove(this);
		this.delete();

		setTimeout(ui.updatec, 100);

		if (ui.confirm == this) {
			delete ui.confirm;
		}
		if (ui.skills == this) {
			delete ui.skills;
		}
		if (ui.skills2 == this) {
			delete ui.skills2;
		}
		if (ui.skills3 == this) {
			delete ui.skills3;
		}
	}
	replace() {
		// this.addTempClass('controlpressdownx',500);
		if (this.replaceTransition === false) {
			this.style.transitionProperty = "none";
			ui.refresh(this);
		}

		while (this.childNodes.length) {
			this.firstChild.remove();
		}
		var i, controls;
		if (Array.isArray(arguments[0])) {
			controls = arguments[0];
		} else {
			controls = arguments;
		}
		delete this.custom;
		for (i = 0; i < controls.length; i++) {
			if (typeof controls[i] == "function") {
				this.custom = controls[i];
			} else {
				this.add(controls[i]);
			}
		}
		if (this.childNodes.length) {
			var width = 0;
			for (i = 0; i < this.childNodes.length; i++) {
				width += this.childNodes[i].offsetWidth;
			}
			ui.refresh(this);
			this.style.width = width + "px";
		}
		ui.updatec();
		if (this.replaceTransition === false) {
			var that = this;
			setTimeout(function () {
				that.style.transitionProperty = "";
			}, 200);
		}
		return this;
	}
}
