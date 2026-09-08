import { lib, game, ui, get, ai, _status } from "noname";
/** @type { importCharacterConfig["skill"] } */
export default {
    mjs_debuff_fengjin: {
        popup: false,
        charlotte: true,
        init(player, skill) {
            player.addSkillBlocker(skill);
            game.broadcastAll(
                player => {
                    
                },
                player
            );
        },
        onremove(player, skill) {
            player.removeSkillBlocker(skill);
        },
        skillBlocker(skill, player) {
            return !lib.skill[skill].persevereSkill && !lib.skill[skill].charlotte;
        },
    },
    mjs_debuff_liuxue: {
        nopop: true,
        trigger: {
            player: "phaseEnd",
        },
        silent: true,
        charlotte: true,
        onremove: true,
        async content(event, trigger, player) {
            await player.loseHp();
            player.removeMark(event.name);
            if (!player.hasMark(event.name)) {
                player.removeSkill(event.name);
            }
        },
        mark: true,
        intro: {
            content: "info",
        },
    },
    mjs_debuff_zhongdu: {
        nopop: true,
        trigger: {
            player: "recoverBegin",
        },
        silent: true,
        charlotte: true,
        onremove: true,
        filter(event, player) {
            return player.hasMark("mjszhongdu");
        },
        async content(event, trigger, player) {
            trigger.cancel();
            player.removeMark(event.name);
            if (!player.hasMark(event.name)) {
                player.removeSkill(event.name);
            }
        },
        mark: true,
        intro: {
            content: "info",
        },
    },
};

