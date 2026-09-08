import { lib, game, ui, get, ai, _status } from "noname";

const hooks = {
    checkTarget: [
        function skillEnabledx(target, event) {
            var skill = get.sourceSkillFor(event);
            if (!skill) {
                return;
            }
            var info = get.info(skill);
            if (!info || info.ruleSkill) {
                return;
            }
            const mod = game.checkMod(event.player, target, "unchanged", "skillEnabledx", target);
            if (mod === false) {
                target.classList.remove("selected");
                target.classList.remove("selectable");
            }
        },
    ],
};
export default hooks;

