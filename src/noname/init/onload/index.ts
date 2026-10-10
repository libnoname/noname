import { DefaultSplash } from "./default-splash";
import { WideSplash } from "./wide-splash";
import type { OnloadSplash as IOnloadSplash } from "./onload-splash"

export const defaultSplashs: IOnloadSplash[] = [new DefaultSplash(), new WideSplash()];
