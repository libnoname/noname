import { lib, game, ui, get, ai, _status } from "noname";
export const config = {
    uptateLog: {
        name: "更新说明（点击查看）",
        clear: true,
        onclick() {
            if (ui.onclickhokuptate) return;
            ui.onclickhokuptate = true;
            var bg = ui.create.div(".mjs-beijing", document.body, function () {
                delete ui.onclickhokuptate;
                uptate.delete();
                game.playAudio("..", "extension/王者荣耀/audio/ui/Notice02.mp3");
                bg.delete();
            });
            var h = document.body.offsetHeight / 1.5;
            var w = document.body.offsetWidth / 1.5;
            game.playAudio("..", "extension/王者荣耀/audio/ui/Notice02.mp3");
            var uptate = ui.create.div(".mjs-update", `<div><iframe  width="${w}px" height="${h}px" style="border:none;" src="${lib.assetURL}extension/名将杀/update.html" ></iframe></div>`, ui.window);
            uptate.style.top = ((document.body.offsetHeight - h) / 2) + 'px';
            uptate.style.left = ((document.body.offsetWidth - w) / 2) + 'px';
        },
    },
    qq: {
        name: "联系及反馈（点击查看）",
        clear: true,
        onclick() {
            var bg = ui.create.div(".mjs-beijing", document.body);
            var h = document.body.offsetHeight / 1.5;
            var w = document.body.offsetWidth / 1.5;
            game.playAudio("..", "extension/王者荣耀/audio/ui/Notice02.mp3");
            var uptate = ui.create.div(".mjs-update", ui.window);
            uptate.style.top = ((document.body.offsetHeight - h) / 2) + "px";
            uptate.style.left = ((document.body.offsetWidth - w)) + "px";
            var authorq = ui.create.div(".mjs-authorq", uptate);
            var authorg = ui.create.div(".mjs-authorg", uptate);
            bg.addEventListener(lib.config.touchscreen ? "touchstart" : "mousedown", function () {
                uptate.delete();
                game.playAudio("..", "extension/王者荣耀/audio/ui/Notice02.mp3");
                bg.delete();
            });
        },
    },
    UI: {
        name: "名将UI",
        intro: "适用于无名杀本体无美化的UI美化（包括技能按钮分离等）",
        init: lib.config.extension_名将杀_UI === undefined ? true : lib.config.extension_名将杀_UI,
        onclick(item) {
            game.playAudio("..", "extension/王者荣耀/audio/ui/Notice02.mp3");
            game.saveConfig("extension_名将杀_UI", item);
        },
    },
    outcrop: {
        name: "露头样式",
        intro: "武将立绘的显示选择",
        init: "full",
        item: {
            "full": "全身",
            "half": "半身",
            "head": "露头",
        },
        onclick(item) {
            game.playAudio("..", "extension/王者荣耀/audio/ui/Notice02.mp3");
            game.saveConfig("extension_名将杀_outcrop", item);
        },
    },
    buddy: {
        name: "伙伴",
        intro: "伙伴开关",
        init: lib.config.extension_名将杀_buddy === undefined ? "feifei" : lib.config.extension_名将杀_buddy,
        item: {
            "off": "关闭",
            "feifei": "朏朏",
            "baize": "白泽",
            "niannian": "年年",
            "jiuwei": "九尾",
            "hundun": "混沌",
            "qingluan": "青鸾",
            "wuzhui": "乌骓",
            "kaka": "卡卡",
        },
        onclick(item) {
            game.playAudio("..", "extension/王者荣耀/audio/ui/Notice02.mp3");
            game.saveConfig("extension_名将杀_buddy", item);
            if (!window.buddy) {
                ui.create.buddy();
            }
            if (item == "off") {
                
            } else {
                window.buddy.style.setProperty("background-image", `url(${lib.assetURL}extension/名将杀/image/buddy/${item}/default.png)`);
            }
        },
        visualMenu(node, link, name, config) {
            node.className = "button character";
            node.innerHTML = "";
            if (link != "off") {
                var div = new Image();
                div.src = `extension/名将杀/image/buddy/${link}/default.png`;
                div.classList.add("buddyImage");
                node.appendChild(div);
            }
            let text = document.createElement("p");
            text.classList.add("buddyText");
            text.innerText = name;
            text.style.fontSize = 15 + "px";
            node.appendChild(text);
        },
    },
    chooseCardPopup: {
        name: "卡牌弹出入手",
        intro: "装备区、判定区、武将牌上的牌弹出到手牌区",
        init: lib.config.extension_名将杀_chooseCardPopup === undefined ? true : lib.config.extension_名将杀_chooseCardPopup,
        onclick(item) {
            game.playAudio("..", "extension/王者荣耀/audio/ui/Notice02.mp3");
            game.saveExtensionConfig("名将杀", "chooseCardPopup", item);
            game.saveExtensionConfig("王者荣耀", "chooseCardPopup", item);
        },
    },
    getShaUsable: {
        name: "出杀次数显示",
        intro: "在武将左下角显示出牌阶段剩余的出杀次数",
        init: lib.config.extension_名将杀_getShaUsable === undefined ? true : lib.config.extension_名将杀_getShaUsable,
        onclick(item) {
            game.playAudio("..", "extension/王者荣耀/audio/ui/Notice02.mp3");
            game.saveConfig("extension_名将杀_getShaUsable", item);
        },
    },
    maxEquipBase: {
        name: "装备上限",
        intro: "名将武将的初始装备上限",
        init: lib.config.extension_名将杀_maxEquipBase === undefined ? 3 : lib.config.extension_名将杀_maxEquipBase,
        item: {
            3: "3",
            4: "4",
            5: "5",
            10: "10",
            114514: "无上限",
        },
        onclick(item) {
            game.playAudio("..", "extension/王者荣耀/audio/ui/Notice02.mp3");
            game.saveConfig("extension_名将杀_maxEquipBase", item);
        },
    },
    cardPile: {
        name: "名将牌堆",
        intro: "启用名将杀标准牌堆",
        init: lib.config.extension_名将杀_cardPile === undefined ? false : lib.config.extension_名将杀_cardPile,
        onclick(item) {
            game.playAudio("..", "extension/王者荣耀/audio/ui/Notice02.mp3");
            game.saveConfig("extension_名将杀_cardPile", item);
        },
    },
    shaNature: {
        name: "属性杀修改",
        intro: "杀会按照花色点数转化为火杀（♥）、雷杀（♦4）",
        init: lib.config.extension_名将杀_shaNature === undefined ? true : lib.config.extension_名将杀_shaNature,
        onclick(item) {
            game.playAudio("..", "extension/王者荣耀/audio/ui/Notice02.mp3");
            game.saveConfig("extension_名将杀_shaNature", item);
        },
    },
    phaseLoop: {
        name: "换位修改",
        intro: "交换位置后不更改当前轮次的回合行动顺序（仅供娱乐）",
        init: lib.config.extension_名将杀_phaseLoop === undefined ? false : lib.config.extension_名将杀_phaseLoop,
        onclick(item) {
            game.playAudio("..", "extension/王者荣耀/audio/ui/Notice02.mp3");
            game.saveConfig("extension_名将杀_phaseLoop", item);
        },
    },
}

export const help = {

}
export const files = {
    "character": [], "card": [], "skill": []
}