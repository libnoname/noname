import { OnloadSplash } from "./onload-splash";

export class DefaultSplash implements OnloadSplash {
	readonly id: string;
	readonly name: string;

	protected path: string;
	private resolve: (mode: string) => void;
	private app: any;
	private clicked: HTMLDivElement;

	init(node: HTMLDivElement, resolve: (mode: string) => void): Promise<void>;

	dispose(node: HTMLDivElement): Promise<boolean>;

	preview(node: HTMLDivElement): void;

	handle(mode: string): string;

	click(mode: string, node: HTMLDivElement): void;
}
