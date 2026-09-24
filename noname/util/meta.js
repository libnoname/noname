const buildChannels = ["test", "nightly", "release"];
const developmentBuildInfo = Object.freeze({
  channel: "dev",
  commit: "local",
  builtAt: "unknown"
});
function isBuildInfo(value) {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const info = value;
  return buildChannels.includes(info.channel) && typeof info.commit === "string" && typeof info.builtAt === "string";
}
async function loadBuildInfo(readLocalJson) {
  if (false) {
    return developmentBuildInfo;
  }
  const url = new URL("game/build-info.json", document.baseURI).href;
  try {
    const value = location.protocol === "file:" ? await readLocalJson(url) : await fetch(url, { cache: "no-store" }).then((response) => {
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
function formatBuildLabel(info) {
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
  info.channel;
}
export {
  formatBuildLabel,
  loadBuildInfo
};
