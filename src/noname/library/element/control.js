import { _status, get, lib, ui } from "noname";

export class Control extends HTMLDivElement {
	// @ts-expect-error ignore
	constructor(...args) {
		if (args[0] instanceof Control) {
			const other = args[0];
			// @ts-expect-error ignore
			args = other._args;
		}

		// 不能用 querySelector 找后代：滚动条滑块 .controlscrollthumb 也是 div，
		// 会被 div:not(.controlscrollbar) 命中，导致之后的首行永远拿不到 nozoom
		const nc = !Array.from(ui.control.children).some(node => !node.classList.contains("removing") && !node.classList.contains("stayleft") && !node.classList.contains("controlscrollbar"));
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
			// 横向滚动模式下按钮条是从左侧排布的，不能再套用居中模式的 translateX(-width/2)
			if (!control.stayleft && !ui.control.classList.contains("controloverflow")) {
				control.style.transform = `translateX(-${control.offsetWidth / 2}px)`;
			}
			control.style.opacity = 1;
			ui.refresh(control);
			control.style.transition = "";
		}

		control.addEventListener(lib.config.touchscreen ? "touchend" : "click", ui.click.control2);

		if (lib.config.button_press) {
			/** 还原按下时的缩放 */
			const restorePress = function () {
				this.classList.remove("controlpressdown");
				const node = control._pressnode || this;
				delete control._pressnode;
				if (node === this) {
					if (typeof this._offset == "number") {
						this.style.transform = `translateX(${this._offset}px)`;
					}
				} else {
					node.classList.remove("controlpressed");
				}
			};
			control.addEventListener(lib.config.touchscreen ? "touchstart" : "mousedown", function (e) {
				if (this.classList.contains("disabled")) {
					return;
				}
				this.classList.add("controlpressdown");
				control._pressnode = this;
				// 横向滚动模式下整条按钮条可能有几千像素宽，
				// 对它整体做 scale(0.97) 会绕远在屏幕外的中心缩放，让可见部分整体位移，
				// 所以只缩放被按下的那一个按钮（缩放比例写在 layout.css 里）。
				if (ui.control.classList.contains("controloverflow")) {
					// 事件目标可能是按钮内部的后代元素，要向上找最近的按钮本身
					const target = e.target instanceof HTMLElement ? e.target.closest(".control > div") : null;
					if (target && target !== this && target.parentNode === this) {
						control._pressnode = target;
						target.classList.add("controlpressed");
					}
					return;
				}
				if (typeof this._offset == "number") {
					this.style.transform = `translateX(${this._offset}px) scale(0.97)`;
				}
			});
			control.addEventListener(lib.config.touchscreen ? "touchend" : "mouseup", restorePress);
			control.addEventListener("touchcancel", restorePress);
			control.addEventListener("mouseleave", restorePress);
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
			if (!ui.control.classList.contains("controloverflow")) {
				this.style.transform = "translateX(-" + this.offsetWidth / 2 + "px)";
			}
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
