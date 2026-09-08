import { lib, game, ui, get, ai, _status } from "noname";
/** @type { importCharacterConfig["skill"] } */
export default {
    //朏朏
    mjs_buddy_feifei_skill: {
        nobracket: true,
        trigger: {
            player: "phaseBegin",
        },
        silent: true,
        buddySkill: true,
        filter(event, player) {
            return player.getEnemies((target) => target.countGainableCards(player, "he"), false).length;
        },
        async content(event, trigger, player) {
            if (Math.random() < 0.32) {
                return;
            }
            player.logSkill(event.name);
            const target = player.getEnemies((target2) => target2.countGainableCards(player, "he"), false).randomGet();
            const card = target.getGainableCards(player, "he").randomGet();
            await player.gain(card, target, "giveAuto", "bySelf");
        },
    },
    //白泽
    mjs_buddy_baize_skill: {
        nobracket: true,
        trigger: {
            player: ["useCard", "respond"],
        },
        silent: true,
        buddySkill: true,
        filter(event, player) {
            return get.suit(event.card) == "spade";
        },
        async content(event, trigger, player) {
            if (player.countMark(event.name + "_used") >= 1) {
                return;
            }
            if (Math.random() < 0.32) {
                return;
            }
            player.logSkill(event.name);
            player.addTempSkill(event.name + "_used");
            player.addMark(event.name + "_used", 1, false);
            await player.draw(2);
            const targets = player.getFriends();
            await game.asyncDraw(targets);
        },
        subSkill: {
            used: {
                charlotte: true,
                onremove: true,
            },
        },
    },
    mjs_buddy_baize_skill2: {
        nobracket: true,
        trigger: {
            global: "phaseEnd,"
        },
        silent: true,
        buddySkill: true,
        async content(event, trigger, player) {
            if (Math.random() < 0.32) {
                return;
            }
            player.logSkill(event.name);
            const targets = player.getFriends();
            for (const target of targets) {
                if (!target?.isIn()) {
                    continue;
                }
                const card = get.cardPile(card => get.suit(card) == "spade");
                if (card) {
                    await target.gain(card, "draw");
                }
            }
        },
    },
    //青鸾
    mjs_buddy_baize_skill: {
        nobracket: true,
        trigger: {
            player: ["damageEnd", "recoverAfter"],
        },
        silent: true,
        buddySkill: true,
        async content(event, trigger, player) {
            if (player.countMark(event.name + "_used") >= 1) {
                return;
            }
            if (Math.random() < 0.32) {
                return;
            }
            player.logSkill(event.name);
            player.addTempSkill(event.name + "_used");
            player.addMark(event.name + "_used", 1, false);
            const targets = player.getEnemies((target) => target.countGainableCards(player, "he"), false);
            for (const target of targets) {
                const cards = target.getGainableCards(player, "he");
                if (cards.length) {
                    await player.gain(cards.randomGets(1), target, "giveAuto", "bySelf");
                }
            }
        },
        subSkill: {
            used: {
                charlotte: true,
                onremove: true,
            },
        },
    },
    mjs_buddy_qingluan_skill2: {
        nobracket: true,
        trigger: {
            global: "phaseBegin"
        },
        silent: true,
        buddySkill: true,
        async content(event, trigger, player) {
            if (Math.random() < 0.32) {
                return;
            }
            player.logSkill(event.name);
            const targets = player.getFriends(target => target.isDamaged());
            for (const target of targets) {
                if (!target?.isIn()) {
                    continue;
                }
                await target.recover();
            }
        },
    },
};

