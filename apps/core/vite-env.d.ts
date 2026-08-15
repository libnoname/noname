/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_BUILD_CHANNEL?: Exclude<import("./noname/util/meta").BuildChannel, "dev">;
	readonly VITE_BUILD_COMMIT?: string;
	readonly VITE_BUILD_TIME?: string;
}
