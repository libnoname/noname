import { lib } from "../../../noname.js";
// import { Character } from "../../../noname/library/element/index.js";

/** @type { importCharacterConfig['character'] } */
const characters = {
	wdb_feishi: {
		sex: "male",
		group: "shu",
		hp: 3,
		skills: ["nsshuaiyan", "moshou"],
	},
	wdb_hanlong: {
		sex: "male",
		group: "wei",
		hp: 4,
		skills: ["siji", "ciqiu"],
	},
	wdb_liufu: {
		sex: "male",
		group: "wei",
		hp: 3,
		skills: ["zhucheng", "duoqi"],
	},
	wdb_liuyan: {
		sex: "male",
		group: "qun",
		hp: 3,
		skills: ["juedao", "geju"],
	},
	wdb_liuzan: {
		sex: "male",
		group: "wu",
		hp: 4,
		skills: ["kangyin"],
	},
	wdb_tianyu: {
		sex: "male",
		group: "wei",
		hp: 4,
		skills: ["chezhen", "youzhan"],
	},
	wdb_xizhenxihong: {
		sex: "male",
		group: "shu",
		hp: 4,
		skills: ["fuchou", "jinyan"],
		names: "习|珍-习|宏",
	},
	wdb_zaozhirenjun: {
		sex: "male",
		group: "wei",
		hp: 3,
		skills: ["liangce", "jianbi", "diyjuntun"],
		names: "枣|祗-任|峻",
	},
	wdb_yangyi: {
		sex: "male",
		group: "shu",
		hp: 3,
		skills: ["choudu", "liduan"],
	},
};

for (let i in characters) {
	characters[i].img = "extension/玩点论杀/image/character/" + i + ".jpg";
	// characters[i] = new Character(character[i]);
}

if (lib.characterReplace) {
	for (let i in characters) {
		const name = i.slice(4);
		if (!lib.character[name]) {
			continue;
		}
		if (!lib.characterReplace[name]) {
			lib.characterReplace[name] = [name, i];
		} else {
			lib.characterReplace[name].push(i);
		}
	}
}

export default characters;
