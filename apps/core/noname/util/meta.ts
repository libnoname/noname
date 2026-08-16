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

type ReadJson = (url: string) => Promise<unknown>;

const buildChannels = ["test", "nightly", "release"] as const;
const developmentBuildInfo: Readonly<BuildInfo> = Object.freeze({
	channel: "dev",
	commit: "local",
	builtAt: "unknown",
});

function isBuildInfo(value: unknown): value is BuildInfo {
	if (typeof value !== "object" || value === null) {
		return false;
	}

	const info = value as Record<string, unknown>;
	return buildChannels.includes(info.channel as (typeof buildChannels)[number]) && typeof info.commit === "string" && typeof info.builtAt === "string";
}

export async function loadBuildInfo(readLocalJson: ReadJson): Promise<Readonly<BuildInfo> | null> {
	if (import.meta.env.DEV) {
		return developmentBuildInfo;
	}

	const url = new URL("game/build-info.json", document.baseURI).href;
	try {
		const value =
			location.protocol === "file:"
				? await readLocalJson(url)
				: await fetch(url, { cache: "no-store" }).then(response => {
						if (!response.ok) {
							throw new Error(`Failed to load build info: ${response.status}`);
						}
						return response.json();
					});

		return isBuildInfo(value) ? Object.freeze({ ...value }) : null;
	} catch {
		return null;
	}
}

export function formatBuildLabel(info: Readonly<BuildInfo> | null): string {
	if (info === null) {
		return "未知来源";
	}

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
