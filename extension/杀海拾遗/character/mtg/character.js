const character = {
	mtg_jiding: {
		sex: "male",
		group: "qun",
		hp: 4,
		skills: ["mbaizhan", "msilian"],
	},
	mtg_jiesi: {
		sex: "male",
		group: "wei",
		hp: 3,
		skills: ["mtongnian", "msuoling", "mhuanyi"],
	},
	mtg_lilianna: {
		sex: "female",
		group: "qun",
		hp: 3,
		skills: ["lingyong", "mduohun"],
	},
};

for (let i in character) {
	character[i].img = "extension/杀海拾遗/image/character/" + i + ".jpg";
}

export default character;
