import { createHash } from "node:crypto";
import { cp, lstat, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { extname, join, relative, resolve } from "node:path";

const runtimeExtensions = new Set([".js", ".mjs", ".cjs", ".json", ".css", ".html", ".wasm"]);
const excluded = new Set(["src", "extension", "image", "audio", "font"]);

export function isHostRuntimeFile(path: string) {
  const parts = path.replaceAll("\\", "/").split("/");
  return !excluded.has(parts[0]) && (runtimeExtensions.has(extname(path).toLowerCase()) || /(?:^|[\\/])[^\\/]*LICENSE[^\\/]*$/i.test(path));
}

// Compatibility is tied to code, not deployment time or local media. Repeating
// a deployment must not force players to download the same client again.
export async function onlineBuildId(root: string) {
  const hash = createHash("sha256");
  async function walk(path: string) {
    const stat = await lstat(join(root, path));
    if (stat.isSymbolicLink()) throw new Error(`Unexpected build input symlink: ${path}`);
    if (stat.isDirectory()) {
      for (const name of (await readdir(join(root, path))).sort()) await walk(`${path}/${name}`);
    } else if (/\.(?:[cm]?[jt]s|vue|json|css|html|yaml)$/.test(path)) {
      hash.update(path + "\0");
      hash.update((await readFile(join(root, path), "utf8")).replaceAll("\r\n", "\n"));
      hash.update("\0");
    }
  }
  for (const path of ["apps/core/noname", "apps/core/character", "apps/core/card", "apps/core/mode", "apps/core/game",
    "apps/core/layout", "apps/core/theme", "apps/core/scripts", "apps/core/index.html", "apps/core/noname.js",
    "apps/core/extension/红楼幻境/extension.js", "apps/core/extension/红楼幻境/info.json",
    "apps/core/extension/红楼幻境/appearance.js", "apps/core/extension/红楼幻境/motion.js", "apps/core/extension/红楼幻境/theme/appearance.css",
    "apps/core/extension/红楼幻境/theme/catalog.js", "apps/core/extension/红楼幻境/voice/runtime.js",
    "apps/core/extension/红楼幻境/voice/daiyu.js", "apps/core/extension/红楼幻境/voice/panel.js", "apps/core/extension/红楼幻境/voice/catalogs",
    "apps/core/package.json", "apps/core/pnpm-lock.yaml", "apps/core/vite.config.ts", "packages/online-protocol/src",
    "scripts/build-online.ts", "scripts/online-artifacts.ts", "package.json", "pnpm-lock.yaml", "pnpm-workspace.yaml"]) await walk(path);
  return `online-${hash.digest("hex").slice(0, 20)}`;
}

export async function assembleOnline(root: string, client: boolean, build: string, origin: string) {
  const source = resolve(root, "apps/core/dist");
  const output = resolve(root, client ? "dist/online-client" : "dist-online-host");
  if (relative(root, output).replaceAll("\\", "/") !== (client ? "dist/online-client" : "dist-online-host")) throw new Error("Unexpected output directory");
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  await cp(source, output, { recursive: true, filter: async path => {
    const name = relative(source, path);
    if (!name) return true;
    const stat = await lstat(path);
    if (stat.isSymbolicLink()) throw new Error(`Unexpected runtime symlink: ${name}`);
    const top = name.split(/[\\/]/)[0];
    if (["src", "extension"].includes(top)) return false;
    return client || (stat.isDirectory() ? !excluded.has(top) : isHostRuntimeFile(name));
  } });
  if (client) {
    await cp(resolve(root, "apps/core/image"), join(output, "image"), { recursive: true, filter: path => !path.split(/[\\/]/).some(part => part === "动态资源" || part.endsWith("_配音")) });
    await cp(resolve(root, "apps/core/audio"), join(output, "audio"), { recursive: true });
    // Reviewed extension art is shipped as ordinary media. The trusted host
    // still excludes /extension and never loads client-supplied executable code.
    await mkdir(join(output, "image/character"), { recursive: true });
    await mkdir(join(output, "image/card"), { recursive: true });
    await cp(resolve(root, "apps/core/extension/红楼幻境/hlhj_daiyu.svg"), join(output, "image/character/hlhj_daiyu.svg"));
    await cp(resolve(root, "apps/core/extension/红楼幻境/hlhj_qingsi.png"), join(output, "image/card/hlhj_qingsi.png"));
    await cp(resolve(root, "apps/core/extension/红楼幻境/theme"), join(output, "image/hlhj/theme"), { recursive: true, filter: path => !path.split(/[\\/]/).some(part => part === "动态资源" || part.endsWith("_配音")) });
  }
  await cp(resolve(root, "LICENSE"), join(output, "LICENSE"));
  await writeFile(join(output, "deployment.json"), JSON.stringify({ build, origin, kind: client ? "client" : "host" }) + "\n");
  return output;
}
