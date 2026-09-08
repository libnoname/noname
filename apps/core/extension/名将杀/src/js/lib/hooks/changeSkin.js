import { lib, game, ui, get, ai, _status } from "noname";

/**
 * @type {(NonameHookType["changeSkin"])[]}
 */
const changeSkin = {
	refreshSkin: [
		function changeSkin(characterName, skinName, sourcenode, avatar) {
            // @ts-ignore
            if (avatar) {
                avatar.parentNode?.changeSkin({ characterName: characterName }, skinName);
            }
            if (sourcenode) {
                const goon = !lib.character[skinName];
                if (goon) {
                    lib.character[skinName] = get.convertedCharacter(["", "", 0, [], (lib.characterSubstitute[characterName].find((i2) => i2[0] == skinName) || [skinName, []])[1]]);
                }
                const skinImg = !lib.config.skin[skinName] && lib.character[skinName]?.img;
                skinImg ? sourcenode.setBackgroundImage(skinImg) : sourcenode.setBackground(skinName, "character");
            }
        },
	],
};
export default changeSkin;

