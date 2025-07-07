import { lib, game, ui } from "../../../noname.js";
import { createApp } from "../../../game/vue.esm-browser.js";

import OnloadSplash from "./OnloadSplash.js";

/**
 * @typedef {import("./onload-splash.js").OnloadSplash} IOnloadSplash
 * @interface IOnloadSplash
 */
export class DefaultSplash {
	id = "style1";
	name = "样式一";

	path = "image/splash/style1/";
	resolve;
	app;
	clicked;

	async init(node, resolve) {
		this.resolve = resolve;

		if (lib.config.touchscreen) {
			node.classList.add("touch");
			lib.setScroll(node);
		}
		if (lib.config.player_border !== "wide") {
			node.classList.add("slim");
		}

		node.dataset.radius_size = lib.config.radius_size;
		node.dataset.splash_style = lib.config.splash_style;

		this.app = createApp(OnloadSplash, {
			handle: this.handle.bind(this),
			click: this.click.bind(this),
		});

		this.app.mount(node);

		if (lib.config.mousewheel) {
			node.addEventListener("wheel", ui.click.mousewheel);
		}
	}

	async dispose(node) {
		node.delete(1000);

		await new Promise(resolve => this.clicked.listenTransition(resolve, 500));

		return true;
	}

	preview(node) {
		node.className = "button character";
		node.style.width = "200px";
		node.style.height = `${(node.offsetWidth * 1080) / 2400}px`;
		node.style.display = "flex";
		node.style.flexDirection = "column";
		node.style.alignItems = "center";
		node.style.backgroundSize = "100% 100%";
		node.setBackgroundImage(`image/splash/${this.id}.jpg`);
	}

	handle(mode) {
		return lib.path.join(this.path, `${mode}.jpg`);
	}

	click(mode, node) {
		node.classList.add("clicked");

		if (game.layout !== "mobile" && lib.layoutfixed.indexOf(mode) !== -1) {
			game.layout = "mobile";
			// @ts-expect-error ignore
			ui.css.layout.href = `${lib.assetURL}layout/${game.layout}/layout.css`;
		} else if (game.layout === "mobile" && lib.config.layout !== "mobile" && lib.layoutfixed.indexOf(mode) === -1) {
			game.layout = lib.config.layout;
			if (game.layout === "default") {
				// @ts-expect-error ignore
				ui.css.layout.href = "";
			} else {
				// @ts-expect-error ignore
				ui.css.layout.href = `${lib.assetURL}layout/${game.layout}/layout.css`;
			}
		}

		this.clicked = node;
		this.resolve(mode);
	}
}
