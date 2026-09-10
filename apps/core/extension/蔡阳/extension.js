import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function () {
    return {
        name: "蔡阳",
        editable: false,
        content() {},
        precontent() {},
        config: {},
        help: {},
        package: {
            character: {
                character: {
                    CYZi: ["male", "qun", 4, ["pxlngu_caiyang_tongguan"], ["ext:蔡阳/CYZi.jpg"]],
                },
                translate: {
                    CYZi: "蔡阳",
                    pxlngu_caiyang_tongguan: "通关",
                    pxlngu_caiyang_tongguan_info: "限定技，当你进入濒死状态时，你将体力回复至1点并摸两张牌。",
                },
            },
            card: { card: {}, translate: {}, list: [] },
            skill: {
                skill: {
                    pxlngu_caiyang_tongguan: {
                        trigger: { player: "dying" },
                        limited: true,
                        skillAnimation: true,
                        animationColor: "orange",
                        filter(event, player) {
                            return player.hp <= 0 && !player.storage.pxlngu_caiyang_tongguan;
                        },
                        content() {
                            player.awakenSkill("pxlngu_caiyang_tongguan");
                            player.storage.pxlngu_caiyang_tongguan = true;
                            player.recover(1 - player.hp);
                            player.draw(2);
                        },
                    },
                },
                translate: {},
            },
            intro: "PXLNGU 单武将：蔡阳",
            author: "原扩展作者",
            version: "1",
        },
        files: { character: ["CYZi.jpg"], card: [], skill: [] },
    };
}
