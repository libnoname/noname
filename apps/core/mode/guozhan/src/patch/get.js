// @ts-nocheck

import { lib, game, ui, get, Get, ai, _status } from "noname";
import { showYexingsContent, chooseCharacterContent, chooseCharacterOLContent } from "./content.js";

export class GetGuozhan extends Get {
	/**
	 * > ?.?
	 *
	 * @param {*} source
	 * @param {*} junling
	 * @param {*} performer
	 * @param {*} targets
	 * @param {*} viewer
	 * @returns
	 */
	junlingEffect(source, junling, performer, targets, viewer) {
		var att1 = get.attitude(viewer, source),
			att2 = get.attitude(viewer, performer);
		var eff1 = 0,
			eff2 = 0;
		switch (junling) {
			case "junling1":
				if (
					!targets.length &&
					game.countPlayer(function (current) {
						return get.damageEffect(viewer, current, viewer) > 0;
					})
				) {
					eff1 = 2;
				} else {
					if (get.damageEffect(targets[0], performer, source) >= 0) {
						eff1 = 2;
					} else {
						eff1 = -2;
					}
					if (get.damageEffect(targets[0], source, performer) >= 0) {
						eff2 = 2;
					} else {
						eff2 = -2;
					}
				}
				break;
			case "junling2":
				if (performer.countCards("he")) {
					eff1 = 1;
					eff2 = 0;
				} else {
					eff1 = 2;
					eff2 = -1;
				}
				break;
			case "junling3":
				if (performer.hp == 1 && !performer.hasSkillTag("save", true)) {
					eff2 = -5;
				} else {
					if (performer == viewer) {
						if (performer.hasSkillTag("maihp", true)) {
							eff2 = 3;
						} else {
							eff2 = -2;
						}
					} else {
						if (performer.hasSkillTag("maihp", false)) {
							eff2 = 3;
						} else {
							eff2 = -2;
						}
					}
				}
				break;
			case "junling4":
				eff1 = 0;
				eff2 = -2;
				break;
			case "junling5":
				var td = performer.isTurnedOver();
				if (td) {
					if (performer == viewer) {
						// @ts-expect-error 祖宗之法就是这么写的
						if (_status.currentPhase == performer && performer.hasSkill("jushou")) {
							eff2 = -3;
						} else {
							eff2 = 3;
						}
					} else {
						eff2 = 3;
					}
				} else {
					if (performer == viewer) {
						if (performer.hasSkillTag("noturn", true)) {
							eff2 = 0;
						} else {
							eff2 = -3;
						}
					} else {
						if (performer.hasSkillTag("noturn", false)) {
							eff2 = 0;
						} else {
							eff2 = -3;
						}
					}
				}
				break;
			case "junling6":
				if (performer.countCards("h") > 1) {
					eff2 += 1 - performer.countCards("h");
				}
				if (performer.countCards("e") > 1) {
					eff2 += 1 - performer.countCards("e");
				}
				break;
		}
		return Math.sign(att1) * eff1 + Math.sign(att2) * eff2;
	}

	/**
	 * > ??.?
	 *
	 * @param {string} name1
	 * @param {string} name2
	 * @returns {boolean}
	 */
	guozhanReverse(name1, name2) {
		if (get.is.double(name2)) {
			return false;
		}
		if (["gz_xunyou", "gz_lvfan", "gz_liubei"].includes(name2)) {
			return true;
		}
		if (name1 == "gz_re_xushu") {
			return true;
		}
		if (name2 == "gz_dengai") {
			return lib.character[name1][2] % 2 == 1;
		}
		if (["gz_sunce", "gz_jiangwei"].includes(name1)) {
			return name2 == "gz_zhoutai" || lib.character[name2][2] % 2 == 1;
		}
		return false;
	}

	/**
	 * 获取武将的等级
	 *
	 * @param {string} name
	 * @param {Player} player
	 * @returns
	 */
	guozhanRank(name, player) {
		if (name.indexOf("gz_shibing") == 0) {
			return -1;
		}
		if (name.indexOf("gz_jun_") == 0) {
			return 7;
		}
		if (player) {
			var skills = lib.character[name][3].slice(0);
			for (var i = 0; i < skills.length; i++) {
				if (lib.skill[skills[i]].limited && player.awakenedSkills.includes(skills[i])) {
					return skills.length - 1;
				}
			}
		}
		if (_status._aozhan) {
			for (var i in lib.aozhanRank) {
				if (lib.aozhanRank[i].includes(name)) {
					return parseInt(i);
				}
			}
		}
		for (var i in lib.guozhanRank) {
			if (lib.guozhanRank[i].includes(name)) {
				return parseInt(i);
			}
		}
		return 0;
	}

	/**
	 * > ?.??
	 *
	 * @param {Player} from
	 * @param {Player} to
	 * @param {number} difficulty
	 * @param {string} toidentity
	 * @returns
	 */
	realAttitude(from, to, difficulty, toidentity) {
		var getIdentity = function (player) {
			if (player.isUnseen()) {
				if (!player.wontYe()) {
					return "ye";
				}
				return player.getGuozhanGroup(0);
			}
			return player.identity;
		};
		var fid = getIdentity(from);
		if (fid == toidentity && toidentity != "ye") {
			return 4 + difficulty;
		}
		if (from.identity == "unknown" && fid == toidentity) {
			if (from.wontYe()) {
				return 4 + difficulty;
			}
		}
		var groups = [];
		var map = {},
			sides = [],
			pmap = _status.connectMode ? lib.playerOL : game.playerMap,
			player;
		for (var i of game.players) {
			if (i.identity == "unknown") {
				continue;
			}
			var added = false;
			for (var j of sides) {
				if (i.isFriendOf(pmap[j])) {
					added = true;
					map[j].push(i);
					if (i == this) {
						player = j;
					}
					break;
				}
			}
			if (!added) {
				map[i.playerid] = [i];
				sides.push(i.playerid);
				if (i == this) {
					player = i.playerid;
				}
			}
		}
		for (var i in map) {
			var num = map[i].length;
			groups.push(num);
		}
		var max = Math.max.apply(this, groups);
		if (max <= 1) {
			return -3;
		}
		var from_p;
		if (from.identity == "unknown" && from.wontYe()) {
			from_p = get.population(fid);
		} else {
			from_p = game.countPlayer(function (current) {
				return current.isFriendOf(from);
			}, true);
		}
		var to_p = game.countPlayer(function (current) {
			return current.isFriendOf(to);
		}, true);
		if (to.identity == "ye") {
			to_p += 1.5;
		}

		if (to_p >= max) {
			return -5;
		}
		if (from_p >= max) {
			return -2 - to_p;
		}
		if (max >= game.players.length / 2) {
			if (to_p <= from_p) {
				return 0.5;
			}
			return 0;
		}
		if (to_p < max - 1) {
			return 0;
		}
		return -0.5;
	}

	/**
	 * > ??.??
	 *
	 * @param {Player} from
	 * @param {Player} to
	 * @returns
	 */
	rawAttitude(from, to) {
		var getIdentity = function (player) {
			if (player.isUnseen()) {
				if (!player.wontYe()) {
					return "ye";
				}
				return player.getGuozhanGroup(0);
			}
			return player.identity;
		};
		var fid = getIdentity(from),
			tid = getIdentity(to);
		if (to.identity == "unknown" && game.players.length == 2) {
			return -5;
		}
		if (_status.currentPhase == from && from.ai.tempIgnore && from.ai.tempIgnore.includes(to) && to.identity == "unknown" && (!from.storage.zhibi || !from.storage.zhibi.includes(to))) {
			return 0;
		}
		var difficulty = 0;
		if (to == game.me) {
			difficulty = (2 - get.difficulty()) * 1.5;
		}
		if (from == to) {
			return 5 + difficulty;
		}
		if (from.isFriendOf(to)) {
			return 5 + difficulty;
		}
		if (from.identity == "unknown" && fid == to.identity) {
			if (from.wontYe()) {
				return 4 + difficulty;
			}
		}
		var att = get.realAttitude(from, to, difficulty, tid);
		if (from.storage.zhibi && from.storage.zhibi.includes(to)) {
			return att;
		}
		if (to.ai.shown >= 0.5) {
			return att * to.ai.shown;
		}

		var nshown = 0;
		for (var i = 0; i < game.players.length; i++) {
			if (game.players[i] != from && game.players[i].identity == "unknown") {
				nshown++;
			}
		}
		if (to.ai.shown == 0) {
			if (nshown >= game.players.length / 2 && att >= 0) {
				return 0;
			}
			return Math.min(0, Math.random() - 0.5) + difficulty;
		}
		if (to.ai.shown >= 0.2) {
			if (att > 2) {
				return Math.max(0, Math.random() - 0.5) + difficulty;
			}
			if (att >= 0) {
				return 0;
			}
			return Math.min(0, Math.random() - 0.7) + difficulty;
		}
		if (att > 2) {
			return Math.max(0, Math.random() - 0.7) + difficulty;
		}
		if (att >= 0) {
			return Math.min(0, Math.random() - 0.3) + difficulty;
		}
		return Math.min(0, Math.random() - 0.5) + difficulty;
	}
}
