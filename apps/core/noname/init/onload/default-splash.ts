import { lib, game, ui } from "noname";
import { createApp } from "vue";

import type { OnloadSplash as IOnloadSplash } from "./onload-splash";

export class DefaultSplash implements IOnloadSplash {
	readonly id: string = "style1";
	readonly name: string = "样式一";

	protected path: string = "image/splash/style1/";
	private resolve: (mode: string) => void;
	private app: any;
	private clicked?: HTMLElement;

	async init(node: HTMLDivElement, resolve: (mode: string) => void): Promise<void> {
		// The lobby component graph is not needed to initialize the core or directstart.
		const { default: EntryShell } = await import("@/online/ui/EntryShell.vue");
		this.resolve = resolve;
		this.clicked = undefined;
		const shousha = lib.config.presentation_style !== "classic";
		node.classList.toggle("shousha-lobby", shousha);

		if (lib.config.touchscreen) {
			node.classList.add("touch");
			if (!shousha) lib.setScroll(node);
		}
		if (lib.config.player_border !== "wide") {
			node.classList.add("slim");
		}

		node.dataset.radius_size = lib.config.radius_size;
		node.dataset.splash_style = lib.config.splash_style;

		this.app = createApp(EntryShell, {
			shousha,
			handle: this.handle.bind(this),
			click: this.click.bind(this),
		});

		this.app.mount(node);

		if (lib.config.mousewheel && !shousha) {
			node.addEventListener("wheel", ui.click.mousewheel);
		}
	}

	async dispose(node: HTMLDivElement): Promise<boolean> {
		node.classList.add("removing");
		const clicked = this.clicked;
		if (clicked) {
			await new Promise<void>(resolve => {
				const finish = () => {
					clearTimeout(timer);
					clicked.removeEventListener("transitionend", finish);
					resolve();
				};
				const timer = setTimeout(finish, 350);
				clicked.addEventListener("transitionend", finish, { once: true });
			});
		}
		node.removeEventListener("wheel", ui.click.mousewheel);
		this.app?.unmount();
		this.app = null;
		node.remove();
		return true;
	}

	preview(node: HTMLDivElement): void {
		node.className = "button character";
		node.style.width = "200px";
		node.style.height = `${(node.offsetWidth * 1080) / 2400}px`;
		node.style.display = "flex";
		node.style.flexDirection = "column";
		node.style.alignItems = "center";
		node.style.backgroundSize = "100% 100%";
		node.setBackgroundImage(`image/splash/${this.id}.jpg`);
	}

	handle(mode: string): string {
		return lib.path.join(this.path, `${mode}.jpg`);
	}

	click(mode: string, node: HTMLElement): void {
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
