import { lib, game, ui, get, ai, _status } from "noname";
import { precontent } from "./main/precontent.js";
import { content } from "./main/content.js";
import { arenaReady } from "./main/arenaReady.js";
import { config, help, files } from "./main/config.js";

const { name, ...extensionInfo } = await lib.init.promises.json(`${lib.assetURL}extension/名将杀/info.json`);
let extensionPackage = {
    name: name,
    editable: false,
    arenaReady,
    content,
    precontent,
    package: {},
    config,
    help,
    files,
};
Object.keys(extensionInfo).forEach(key => extensionPackage.package[key] = extensionInfo[key]);
export let type = "extension";
export default extensionPackage;