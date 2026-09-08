import { lib, game, ui, get, ai, _status } from "noname";
/** @type { importCharacterConfig["skill"] } */
export default {
    _mjsshowAudio: {
        name: "登场",
        trigger: {
            player: "phaseBegin",
        },
        lastDo: true,
        silent: true,
        charlotte: true,
        filter(event, player) {
            return get.character(player.name)?.enterAudios?.length && player.phaseNumber == 1;
        },
        async content(event, trigger, player) {
            const audioList = get.character(player.name).enterAudios.slice();
            const audio = audioList.randomRemove();
            game.playAudio(audio);
        },
    },
    _mjskillAudio: {
        name: "击杀",
        trigger: {
            source: "dieAfter",
        },
        lastDo: true,
        silent: true,
        charlotte: true,
        filter(event, player) {
            return get.character(player.name)?.killAudios?.length;
        },
        async content(event, trigger, player) {
            const audioList = get.character(player.name).killAudios.slice();
            const audio = audioList.randomRemove();
            game.playAudio(audio);
        },
    },
};

