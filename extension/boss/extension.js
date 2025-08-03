import { lib, game, ui, get, ai, _status } from "../../noname.js";

game.import("play", function () {
	return {
		name: "boss",
		init() {
			if (get.mode() === "tafang") {
				return;
			}
			let storage = localStorage.getItem("boss_storage_playpackconfig");
			try {
				storage = JSON.parse(storage) || {};
			} catch (e) {
				storage = {};
			}
			if (get.mode() !== "boss") {
				lib.characterPack.boss = storage.boss || {};
				for (const i in lib.characterPack.boss) {
					lib.characterPack.boss[i].img = `image/mode/boss/character/${i}.jpg`;
					lib.character[i] = lib.characterPack.boss[i];
					if (typeof lib.character[i][2] !== "number" && (typeof lib.character[i][2] !== "string" || lib.character[i][2].indexOf("/") === -1)) {
						lib.character[i][2] = Infinity;
					}
					if (!lib.config.boss_enableai_playpackconfig) {
						lib.config.forbidai.push(i);
					}
				}
			}
			let list2 = storage.versus || {};
			if (get.mode() !== "versus" || get.config("versus_mode") !== "jiange") {
				lib.characterPack.jiange = list2;
				for (const i in lib.characterPack.jiange) {
					lib.characterPack.jiange[i].img = `image/mode/versus/character/${i}.jpg`;
					lib.character[i] = lib.characterPack.jiange[i];
					if (typeof lib.character[i][2] !== "number") {
						lib.character[i][2] = Infinity;
					}
					if (!lib.config.boss_enableai_playpackconfig) {
						lib.config.forbidai.push(i);
					}
				}
				lib.characterIntro.boss_liedixuande = lib.characterIntro.liubei;
				lib.characterIntro.boss_gongshenyueying = lib.characterIntro.huangyueying;
				lib.characterIntro.boss_tianhoukongming = lib.characterIntro.shen_zhugeliang;
				lib.characterIntro.boss_yuhuoshiyuan = lib.characterIntro.pangtong;
				lib.characterIntro.boss_qiaokuijunyi = lib.characterIntro.zhanghe;
				lib.characterIntro.boss_jiarenzidan = lib.characterIntro.caozhen;
				lib.characterIntro.boss_duanyuzhongda = lib.characterIntro.simayi;
				lib.characterIntro.boss_juechenmiaocai = lib.characterIntro.xiahouyuan;
			} else if (_status.mode !== "jiange") {
				for (const i in list2) {
					lib.character[i] = list2[i];
					if (!lib.config.boss_enableai_playpackconfig) {
						lib.config.forbidai.push(i);
					}
				}
			}
			let list = storage.translate || {};
			list.boss_character_config = "挑战武将";
			list.jiange_character_config = "剑阁武将";

			for (const i in list) {
				lib.translate[i] ||= list[i];
			}
		},
		arenaReady() {
			if (get.mode() === "tafang") {
				return;
			}
			let storage = localStorage.getItem("boss_storage_playpackconfig");
			try {
				storage = JSON.parse(storage) || {};
			} catch (e) {
				storage = {};
			}
			if (!storage.translate) {
				storage.translate = {};
			}
			const loadversus = function () {
				if (get.mode() !== "versus") {
					game.loadModeAsync("versus", function (mode) {
						for (const i in mode.translate) {
							lib.translate[i] ||= mode.translate[i];
							storage.translate[i] = mode.translate[i];
						}
						for (const i in mode.skill) {
							if (lib.skill[i]) {
								console.log(i);
							}
							if (i !== "versus_ladder") {
								lib.skill[i] = mode.skill[i];
							}
						}
						for (const ii in mode.skill) {
							if (ii !== "versus_ladder") {
								game.finishSkill(ii);
							}
						}
						storage.versus = {};
						for (const i in mode.jiangeboss) {
							if (mode.jiangeboss[i].isBossAllowed) {
								storage.versus[i] = mode.jiangeboss[i];
							}
						}
						localStorage.setItem("boss_storage_playpackconfig", JSON.stringify(storage));
					});
				} else {
					localStorage.setItem("boss_storage_playpackconfig", JSON.stringify(storage));
				}
			};
			if (get.mode() !== "boss") {
				game.loadModeAsync("boss", function (mode) {
					for (const i in mode.translate) {
						lib.translate[i] ||= mode.translate[i];
						storage.translate[i] = mode.translate[i];
					}
					for (const i in mode.skill) {
						if (lib.skill[i]) {
							console.log(i);
						}
						lib.skill[i] = mode.skill[i];
					}
					for (const ii in mode.skill) {
						if (ii !== "versus_ladder") {
							game.finishSkill(ii);
						}
					}
					storage.boss = {};
					for (const i in mode.characterPack.mode_boss) {
						if (mode.characterPack.mode_boss[i].isBossAllowed) {
							storage.boss[i] = mode.characterPack.mode_boss[i];
						}
					}
					loadversus();
				});
			} else {
				loadversus();
			}
		},
	};
});
