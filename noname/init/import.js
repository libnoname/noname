import "../../noname.js";
import { lib } from "../library/index.js";
import { game } from "../game/index.js";
async function importCardPack(name) {
  await importFunction("card", `/card/${name}`);
}
async function importCharacterPack(name) {
  const alreadyModernCharacterPack = lib.config.moderned_characters || [];
  const path = !alreadyModernCharacterPack.includes(name) ? `/character/${name}/index` : `/character/${name}`;
  await importFunction("character", path).catch((e) => {
    console.error(`武将包《${name}》加载失败`, e);
  });
}
async function importExtension(name) {
  if (!game.hasExtension(name) && !lib.config.all.stockextension.includes(name)) {
    await game.import("extension", await createEmptyExtension(name));
    return;
  }
  try {
    await importFunction("extension", `/extension/${name}/extension`);
  } catch (e) {
    console.error(`扩展《${name}》加载失败`, e);
    let close = confirm(`扩展《${name}》加载失败，是否关闭此扩展？错误信息: 
${e instanceof Error ? e.stack : String(e)}`);
    if (close) {
      game.saveConfig(`extension_${name}_enable`, false);
      await game.import("extension", await createEmptyExtension(name));
    }
  }
}
async function importMode(name) {
  if (lib.mode[name] && lib.mode[name].fromextension) {
    let loadModeMethod = lib.init["setMode_" + name];
    if (typeof loadModeMethod === "function") {
      await Promise.resolve(loadModeMethod());
      return;
    }
  }
  const alreadyModernMode = lib.config.moderned_modes || [];
  const path = alreadyModernMode.includes(name) ? `/mode/${name}/index` : `/mode/${name}`;
  await importFunction("mode", path);
}
async function importFunction(type, path) {
  const modeContent = await import(
    /* @vite-ignore */
    path + ".js"
  ).catch(async (e) => {
    if (window.isSecureContext) {
      try {
        return await import(
          /* @vite-ignore */
          path + ".ts"
        );
      } catch {
        throw e;
      }
    }
    throw e;
  });
  if (!modeContent.type) return;
  if (modeContent.type !== type) {
    throw new Error(`Loaded Content doesn't match "${type}" (received "${modeContent.type}").`);
  }
  await game.import(type, modeContent.default);
}
async function createEmptyExtension(name) {
  const extensionInfo = await lib.init.promises.json(`${lib.assetURL}extension/${name}/info.json`).then(
    (info) => info,
    () => {
      return {
        name,
        intro: `扩展<b>《${name}》</b>尚未开启，请开启后查看信息。（建议扩展添加info.json以在关闭时查看信息）`,
        author: "未知",
        diskURL: "",
        forumURL: "",
        version: "1.0.0"
      };
    }
  );
  return {
    name: extensionInfo.name,
    editable: false,
    arenaReady() {
    },
    content(config, pack) {
    },
    prepare() {
    },
    precontent() {
    },
    config: {},
    help: {},
    package: {
      translation: extensionInfo.translation,
      nopack: true,
      intro: extensionInfo.intro ? extensionInfo.intro.replace("${assetURL}", lib.assetURL) : "",
      author: extensionInfo.author ?? "未知",
      diskURL: extensionInfo.diskURL ?? "",
      forumURL: extensionInfo.forumURL ?? "",
      version: extensionInfo.version ?? "1.0.0"
    },
    files: {
      character: [],
      card: [],
      skill: [],
      audio: []
    }
  };
}
export {
  createEmptyExtension,
  importCardPack,
  importCharacterPack,
  importExtension,
  importMode
};
