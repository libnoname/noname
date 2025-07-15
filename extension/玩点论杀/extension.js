import { lib, game, ui, get, ai, _status } from "../../noname.js";
import { precontent } from "./main/precontent.js";

const extensionInfo = await lib.init.promises.json(`${lib.assetURL}extension/玩点论杀/info.json`);
let extensionPackage = {
	name: "玩点论杀",
	config: {},
	help: {},
	package: {},
	precontent,
	files: { character: [], card: [], skill: [], audio: [] },
};

Object.keys(extensionInfo)
	.filter(key => key !== "name")
	.forEach(key => {
		extensionPackage.package[key] = extensionInfo[key];
	});

export let type = "extension";
export default extensionPackage;
