export type BuildChannel = "dev" | "test" | "nightly" | "release";

export interface BuildInfo {
	/** 
	 * 构建渠道。 
	 */
	channel: BuildChannel;
	/** 
	 * 完整 Git SHA；无法获取时为 "local"。 
	 */
	commit: string;
	/**
	 * Nightly 构建的 Asia/Shanghai ISO 时间；
	 * 其他渠道或无法获取时为 "unknown"。
	 */
	builtAt: string;
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

export function formatBuildLabel(info: Readonly<BuildInfo>): string {
	switch (info.channel) {
		case "dev":
			return "dev";
		case "test":
			return `test @ ${info.commit.slice(0, 8)}`;
		case "nightly":
			return `nightly ${info.builtAt.slice(0, 10)}`;
		case "release":
			return "";
	}

	info.channel satisfies never;
}
