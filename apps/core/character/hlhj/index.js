import createExtension from "../../extension/红楼幻境/extension.js";

export const type = "character";

// Only this checked-in extension is included in the trusted online build.
// Rollup bundles its rules; the host never imports an /extension URL at runtime.
export default function (lib, game, ui, get, ai, _status) {
    const extension = createExtension(lib, game, ui, get, ai, _status, {
        theme: "image/hlhj/theme/", original: "image/character/hlhj_daiyu.svg",
    });
    extension.precontent();
    const { character, card, skill } = extension.package;
    card.card.hlhj_qingsi.image = "image/card/hlhj_qingsi.png";
    return {
        ...character,
        name: "hlhj",
        connect: true,
        characterSort: { hlhj: character.characterSort["红楼幻境"] },
        card: card.card,
        skill: skill.skill,
        translate: { ...character.translate, ...card.translate, ...skill.translate, hlhj: "红楼幻境" },
    };
}
