import { beforeEach } from "vitest";

const store = new Map<string, string>();

if (typeof globalThis.localStorage === "undefined") {
	Object.defineProperty(globalThis, "localStorage", {
		configurable: true,
		value: {
			getItem(key: string) {
				return store.get(String(key)) ?? null;
			},
			setItem(key: string, value: string) {
				store.set(String(key), String(value));
			},
			removeItem(key: string) {
				store.delete(String(key));
			},
			clear() {
				store.clear();
			},
			key(index: number) {
				return Array.from(store.keys())[index] ?? null;
			},
			get length() {
				return store.size;
			},
		},
	});
}

if (typeof globalThis.navigator === "undefined") {
	Object.defineProperty(globalThis, "navigator", {
		configurable: true,
		value: { userAgent: "node", maxTouchPoints: 0 },
	});
}

beforeEach(() => {
	store.clear();
});
