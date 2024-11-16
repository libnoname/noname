import { OnloadSplash } from "./onload-splash";

export class WideSplash extends DefaultSplash implements OnloadSplash {
	readonly id: string;
	readonly name: string;

	protected path: string;
}
