import { lib, get } from "noname";

/** Exact native boss-mode skills used by 山海异志将包 in ordinary modes.
 * Source: mode/boss.js, boss_modao / boss_guihuo / boss_guimei (GPL-3.0).
 * No boss-mode rules or character registration are enabled here.
 */
export function registerOrganizedCompatibility() {
	if (!lib.config["extension_山海异志将包_enable"]) return;
	lib.skill.boss_modao ??= {
		audio: true,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		content() {
			player.draw(2);
		},
	};
	lib.skill.boss_guihuo ??= {
		trigger: { player: "phaseJieshuBegin" },
		direct: true,
		content() {
			"step 0";
			player.chooseTarget(get.prompt("boss_guihuo"), function (card, player, target) {
				return player != target;
			}).ai = function (target) {
				return get.damageEffect(target, player, player, "fire");
			};
			("step 1");
			if (result.bool) {
				player.logSkill("boss_guihuo", result.targets);
				result.targets[0].damage("fire");
			}
		},
	};
	lib.skill.boss_guimei ??= {
		mod: {
			targetEnabled(card, player, target) {
				if (get.type(card) == "delay") return false;
			},
		},
	};
	lib.translate.boss_modao ??= "魔道";
	lib.translate.boss_modao_info ??= "锁定技，准备阶段，你摸两张牌。";
	lib.translate.boss_guihuo ??= "鬼火";
	lib.translate.boss_guihuo_info ??= "结束阶段，你可以对一名其他角色造成1点火属性伤害。";
	lib.translate.boss_guimei ??= "鬼魅";
	lib.translate.boss_guimei_info ??= "锁定技，你不能成为延时锦囊牌的目标。";
}
