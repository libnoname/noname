import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//官盗K系列杜预
	pkwuku: {
		audio: "spwuku",
		trigger: { global: "useCard" },
		forced: true,
		preHidden: true,
		filter(event, player) {
			if (get.type(event.card) != "equip") {
				return false;
			}
			return player.countMark("pkwuku") < 3;
		},
		content() {
			player.addMark("pkwuku", 1);
		},
		marktext: "库",
		intro: {
			content: "mark",
		},
		ai: {
			combo: "pkmiewu",
			threaten: 3.6,
		},
	},
	pksanchen: {
		audio: "spsanchen",
		trigger: { player: "phaseJieshuBegin" },
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "gray",
		filter(event, player) {
			return player.countMark("pkwuku") > 2;
		},
		content() {
			player.awakenSkill(event.name);
			player.gainMaxHp();
			player.recover();
			player.addSkills("pkmiewu");
		},
		ai: {
			combo: "pkwuku",
		},
		derivation: "pkmiewu",
	},
	pkmiewu: {
		audio: "spmiewu",
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			if (!player.countMark("pkwuku") || player.hasSkill("pkmiewu_used")) {
				return false;
			}
			return get.inpileVCardList(info => {
				if (!["basic", "trick"].includes(info[0])) {
					return false;
				}
				return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
			}).length;
		},
		chooseButton: {
			dialog(event, player) {
				const list = get.inpileVCardList(info => {
					if (!["basic", "trick"].includes(info[0])) {
						return false;
					}
					return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
				});
				return ui.create.dialog("灭吴", [list, "vcard"]);
			},
			check(button) {
				if (_status.event.getParent().type != "phase") {
					return 1;
				}
				const player = get.player();
				if (["wugu", "zhulu_card", "yiyi", "lulitongxin", "lianjunshengyan", "diaohulishan"].includes(button.link[2])) {
					return 0;
				}
				return player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup(links, player) {
				return {
					audio: "spmiewu",
					filterCard: () => false,
					selectCard: -1,
					popname: true,
					viewAs: { name: links[0][2], nature: links[0][3], isCard: true },
					log: false,
					async precontent(event, trigger, player) {
						player
							.when({ player: ["useCardAfter", "respondAfter"] })
							.filter(evt => evt.getParent() == event.getParent())
							.step(async (event, trigger, player) => {
								player.removeSkill(event.name);
								await player.draw();
							});
						player.addTempSkill("pkmiewu_used");
						player.logSkill("pkmiewu");
						player.removeMark("pkwuku", 1);
					},
				};
			},
			prompt(links, player) {
				return "视为使用" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "并摸一张牌";
			},
		},
		hiddenCard(player, name) {
			if (!lib.inpile.includes(name)) {
				return false;
			}
			const type = get.type(name);
			return ["basic", "trick"].includes(type) && player.countMark("pkwuku") > 0 && !player.hasSkill("pkmiewu_used");
		},
		ai: {
			combo: "pkwuku",
			fireAttack: true,
			respondSha: true,
			respondShan: true,
			skillTagFilter(player) {
				if (!player.countMark("pkwuku") || player.hasSkill("pkmiewu_used")) {
					return false;
				}
			},
			order: 7,
			result: {
				player(player) {
					if (_status.event.dying) {
						return get.attitude(player, _status.event.dying);
					}
					return 1;
				},
			},
		},
		subSkill: {
			backup: {},
			used: { charlotte: true },
		},
	},
};

export default skills;
