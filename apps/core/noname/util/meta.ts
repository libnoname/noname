export type BuildChannel = "dev" | "test" | "nightly" | "release";

export interface BuildInfo {
	channel: BuildChannel;
	commit?: string;
	builtAt?: string;
}

const channels = ["test", "nightly", "release"] as const;
function getBuildChannel(): BuildChannel {
	if (import.meta.env.DEV) {
		return "dev";
	}

	const channel = import.meta.env.VITE_BUILD_CHANNEL;
	return channels.includes(channel as (typeof channels)[number]) ? (channel as (typeof channels)[number]) : "test";
}

export const buildInfo: Readonly<BuildInfo> = Object.freeze({
	channel: getBuildChannel(),
	commit: import.meta.env.VITE_BUILD_COMMIT || "local",
	builtAt: import.meta.env.VITE_BUILD_TIME || "unknown",
});
