import { lib, game, ui, get, ai, _status } from "noname";
export const type = "extension";
export default function (lib, game, ui, get, ai, _status) {
    "use strict";

    return {
        name: "乐曹植",
        editable: false,
        content: function (config, pack) {
            lib._leCaozhiExtensionConfig = config || lib._leCaozhiExtensionConfig || {};
        },
        precontent: function (config) {
            lib._leCaozhiExtensionConfig = config || lib._leCaozhiExtensionConfig || {};
            lib.translate.yue_fuyue_fu = "赋";
            lib.translate.yue_fuyue_fu_bg = "赋";
            if (!document.getElementById("le-caozhi-style")) {
                var style = document.createElement("style");
                style.id = "le-caozhi-style";
                style.textContent = [
                    ".le-fule-confirm-mode{z-index:1000!important;opacity:1!important;filter:none!important;}",
                    ".le-fule-confirm-mode.disabled{opacity:1!important;filter:none!important;pointer-events:auto!important;}",
                    ".le-fule-original-ok-hidden{visibility:hidden!important;opacity:0!important;pointer-events:none!important;}",
                    ".le-fule-name-control{display:block!important;position:fixed!important;left:0;top:0;width:auto!important;height:auto!important;margin:0!important;padding:0!important;transform:none!important;background:transparent!important;border:0!important;outline:0!important;box-shadow:none!important;pointer-events:none!important;overflow:visible!important;z-index:2147483000!important;transition:none!important;animation:none!important;will-change:auto!important;}",
                    ".le-fule-name-buttons{display:flex!important;position:relative!important;width:auto!important;height:auto!important;margin:0!important;padding:0!important;gap:8px!important;background:transparent!important;border:0!important;outline:0!important;box-shadow:none!important;pointer-events:auto!important;overflow:visible!important;transition:none!important;animation:none!important;}",
                    ".le-fule-name-control:before,.le-fule-name-control:after,.le-fule-name-buttons:before,.le-fule-name-buttons:after,.le-fule-name-button:before,.le-fule-name-button:after{content:none!important;display:none!important;}",
                    ".le-fule-name-button{display:block!important;visibility:visible!important;position:relative!important;height:52px!important;min-height:52px!important;max-height:52px!important;margin:0!important;padding:0!important;box-sizing:border-box!important;overflow:visible!important;pointer-events:auto!important;border:0!important;outline:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;filter:none!important;transition:none!important;animation:none!important;}",
                    ".le-fule-name-button>img{display:block!important;position:absolute!important;left:0!important;top:0!important;width:100%!important;height:100%!important;object-fit:fill!important;pointer-events:none!important;border:0!important;outline:0!important;box-shadow:none!important;}",
                    ".le-fule-name-button.le-fule-style-shousha{width:153px!important;min-width:153px!important;max-width:153px!important;}",
                    ".le-fule-name-button.le-fule-style-yijiang{width:145px!important;min-width:145px!important;max-width:145px!important;}",
                    ".le-fule-name-button>span{display:flex!important;position:absolute!important;left:15%!important;right:15%!important;top:0!important;bottom:0!important;justify-content:center!important;align-items:center!important;white-space:nowrap!important;overflow:hidden!important;color:#624817!important;font-size:19px!important;font-weight:bold!important;line-height:1!important;text-shadow:0 1px 1px rgba(255,245,195,.8)!important;pointer-events:none!important;}",
                    ".le-fule-name-button.le-fule-hover{filter:brightness(1.08)!important;transform:translateY(1px)!important;}",
                    ".le-fule-name-button.le-fule-disabled{opacity:.48!important;filter:grayscale(1)!important;pointer-events:none!important;}",
                    ".card .gaintag.le-fule-gaintag,.card .gaintag[data-le-fule-fu='true'],.card>.gaintag[data-le-fule-fu='true']{color:#ffe38e!important;text-shadow:0 0 2px #6b2600,0 0 5px #ffb12e!important;}",
                    ".card[data-le-fule-no-convert='true']>.temp-handCard,.card[data-le-fule-no-convert='true'] .temp-handCard{display:none!important;}"
                ].join("\n");
                document.head.appendChild(style);
            }

            var isFuActualCard = function (card) {
                if (!card) return false;
                if (card._yue_fuyue_noConvert) return true;
                if (card.storage && (card.storage.yue_fuyue_noConvert || card.storage.yue_fuyue_fu)) return true;
                if (card.hasGaintag && card.hasGaintag("yue_fuyue_fu")) return true;
                if (Array.isArray(card.cards)) {
                    for (var i = 0; i < card.cards.length; i++) {
                        if (isFuActualCard(card.cards[i])) return true;
                    }
                }
                return false;
            };

            if (get.is && !get.is._leFuleConvertedPatched && typeof get.is.converted == "function") {
                get.is._leFuleConvertedPatched = true;
                var originalIsConverted = get.is.converted;
                get.is.converted = function (card) {
                    if (isFuActualCard(card)) return false;
                    return originalIsConverted.apply(this, arguments);
                };
            }

            if (lib._leCaozhiFuleLatePatchQueued) return;
            lib._leCaozhiFuleLatePatchQueued = true;

            var installPatch = function () {
                if (!game.check || game.check._leFuleCheckWrapper) return;
                var baseCheck = game.check;
                var wrappedCheck = function () {
                    try {
                        if (lib.skill.yue_fuyue && lib.skill.yue_fuyue.prepareSelectable) {
                            lib.skill.yue_fuyue.prepareSelectable(_status.event);
                        }
                    } catch (e) {
                        console.error("[乐曹植] 赋牌名预处理失败", e);
                    }

                    var result = baseCheck.apply(this, arguments);
                    var refresh = function () {
                        try {
                            if (lib.skill.yue_fuyue && lib.skill.yue_fuyue.refreshNameButtons) {
                                lib.skill.yue_fuyue.refreshNameButtons(result);
                            }
                            if (lib.skill.yue_fuyue && lib.skill.yue_fuyue.clearAllFuConversionVisual) {
                                var current = lib.skill.yue_fuyue.getUseEvent ? lib.skill.yue_fuyue.getUseEvent(_status.event) : _status.event;
                                lib.skill.yue_fuyue.clearAllFuConversionVisual(current && current.player ? current.player : game.me);
                            }
                        } catch (e2) {
                            console.error("[乐曹植] 赋牌名按钮刷新失败", e2);
                        }
                    };
                    refresh();
                    setTimeout(refresh, 0);
                    setTimeout(refresh, 30);
                    return result;
                };
                wrappedCheck._leFuleCheckWrapper = true;
                wrappedCheck._leFuleBaseCheck = baseCheck;
                game.check = wrappedCheck;
            };

            lib.arenaReady.push(function () {
                installPatch();
                setTimeout(installPatch, 0);
                setTimeout(installPatch, 300);
                setTimeout(installPatch, 1000);
            });
        },
        config: {
            buttonStyle: {
                name: "赋牌按钮样式",
                init: "shousha",
                item: {
                    shousha: "手杀样式",
                    yijiang: "一将成名样式"
                },
                intro: "手杀样式直接调用 cbtn.png（默认）；一将成名样式直接调用 btnnnor.png。切换后，下次选中赋牌时生效。"
            }
        },
        help: {},
        package: {
            character: {
                character: {
                    yue_caozhi: [
                        "male",
                        "wei",
                        3,
                        ["yue_fuyue", "yue_wenlan"],
                        ["ext:乐曹植/yue_caozhi.jpg"]
                    ]
                },
                translate: {
                    yue_caozhi: "乐·曹植"
                },
                characterPrefix: {
                    yue_caozhi: "乐"
                }
            },
            card: {
                card: {},
                translate: {},
                list: []
            },
            skill: {
                skill: {
                    yue_fuyue: {
                        audio: 'ext:乐曹植/audio:2',
                        locked: true,
                        forced: true,
                        group: ["yue_fuyue_init", "yue_fuyue_actual", "yue_fuyue_cleanup"],

                        isFu: function (card) {
                            if (!card) return false;
                            if (card._yue_fuyue_alt || card._yue_fuyue_noConvert) return true;
                            if (card.storage && (card.storage.yue_fuyue_fu || card.storage.yue_fuyue_noConvert)) return true;
                            return !!(card.hasGaintag && card.hasGaintag("yue_fuyue_fu"));
                        },

                        getOriginalName: function (card) {
                            if (!card) return null;
                            return card._yue_fuyue_baseName || (card.storage && card.storage.yue_fuyue_baseName) || card.name || get.name(card, false);
                        },

                        getNames: function (card) {
                            if (!card) return [];
                            var list = [];
                            var original = lib.skill.yue_fuyue.getOriginalName(card);
                            if (original) list.push(original);
                            if (card._yue_fuyue_alt && list.indexOf(card._yue_fuyue_alt) == -1) {
                                list.push(card._yue_fuyue_alt);
                            }
                            return list;
                        },

                        getRandomName: function (card, replace) {
                            var original = lib.skill.yue_fuyue.getOriginalName(card);
                            var old = card && card._yue_fuyue_alt;
                            var list = [];
                            for (var i = 0; i < lib.inpile.length; i++) {
                                var name = lib.inpile[i];
                                if (!name || !lib.card[name]) continue;
                                var type = get.type(name);
                                if (type == "equip") continue;
                                if (name == original) continue;
                                if (replace && old && name == old) continue;
                                if (list.indexOf(name) == -1) list.push(name);
                            }
                            if (!list.length && replace) {
                                for (var j = 0; j < lib.inpile.length; j++) {
                                    var name2 = lib.inpile[j];
                                    if (!name2 || !lib.card[name2]) continue;
                                    if (get.type(name2) == "equip" || name2 == original) continue;
                                    if (list.indexOf(name2) == -1) list.push(name2);
                                }
                            }
                            if (!list.length) return null;
                            return list[Math.floor(Math.random() * list.length)];
                        },

                        setAltName: function (card, name) {
                            if (!card || !name) return;
                            game.broadcastAll(function (targetCard, targetName) {
                                if (!targetCard) return;
                                targetCard._yue_fuyue_alt = targetName;
                                targetCard._yue_fuyue_noConvert = true;
                                if (!targetCard.storage) targetCard.storage = {};
                                targetCard.storage.yue_fuyue_alt = targetName;
                                targetCard.storage.yue_fuyue_fu = true;
                                targetCard.storage.yue_fuyue_noConvert = true;
                                if (targetCard.dataset) targetCard.dataset.leFuleNoConvert = "true";
                            }, card, name);
                        },

                        markAsActualCard: function (card) {
                            if (!card) return;
                            card._yue_fuyue_noConvert = true;
                            if (!card.storage) card.storage = {};
                            card.storage.yue_fuyue_fu = true;
                            card.storage.yue_fuyue_noConvert = true;
                            if (card._yue_fuyue_alt) card.storage.yue_fuyue_alt = card._yue_fuyue_alt;
                            if (card.dataset) card.dataset.leFuleNoConvert = "true";
                        },

                        clearConversionVisual: function (card) {
                            if (!card || !lib.skill.yue_fuyue.isFu(card)) return;
                            lib.skill.yue_fuyue.markAsActualCard(card);
                            delete card.bianhua;
                            delete card.bianhua2;
                            if (card._tempName) {
                                try {
                                    if (card._tempName.close) card._tempName.close();
                                    else if (card._tempName.remove) card._tempName.remove();
                                } catch (e) {}
                                delete card._tempName;
                            }
                            if (card.querySelectorAll) {
                                var nodes = card.querySelectorAll(".temp-handCard");
                                for (var i = 0; i < nodes.length; i++) {
                                    if (nodes[i] && nodes[i].parentNode) nodes[i].parentNode.removeChild(nodes[i]);
                                }
                            }
                        },

                        clearAllFuConversionVisual: function (player) {
                            if (!player || !player.getCards) return;
                            var cards = player.getCards("h");
                            for (var i = 0; i < cards.length; i++) {
                                if (lib.skill.yue_fuyue.isFu(cards[i])) lib.skill.yue_fuyue.clearConversionVisual(cards[i]);
                            }
                        },

                        applyActualName: function (card, name) {
                            if (!card || !name || !lib.skill.yue_fuyue.isFu(card)) return;
                            card._yue_fuyue_tempName = name;
                            delete card._yue_fuyue_liftName;
                            lib.skill.yue_fuyue.markAsActualCard(card);
                            lib.skill.yue_fuyue.clearConversionVisual(card);
                        },

                        restoreActualName: function (card) {
                            if (!card) return;
                            if (card._yue_fuyue_baseName !== undefined) card.name = card._yue_fuyue_baseName;
                            else if (card.storage && card.storage.yue_fuyue_baseName !== undefined) card.name = card.storage.yue_fuyue_baseName;
                            delete card._yue_fuyue_baseName;
                            if (card.storage) delete card.storage.yue_fuyue_baseName;
                            delete card._yue_fuyue_tempName;
                            delete card._yue_fuyue_liftName;
                            if (lib.skill.yue_fuyue.isFu(card)) {
                                lib.skill.yue_fuyue.markAsActualCard(card);
                                lib.skill.yue_fuyue.clearConversionVisual(card);
                            }
                        },

                        normalizeUseEvent: function (evt) {
                            if (!evt) return;
                            var cards = [];
                            if (Array.isArray(evt.cards)) cards = evt.cards.slice(0);
                            else if (evt.card && Array.isArray(evt.card.cards)) cards = evt.card.cards.slice(0);
                            var isFuUse = false;
                            for (var i = 0; i < cards.length; i++) {
                                if (lib.skill.yue_fuyue.isFu(cards[i])) {
                                    isFuUse = true;
                                    lib.skill.yue_fuyue.markAsActualCard(cards[i]);
                                    lib.skill.yue_fuyue.clearConversionVisual(cards[i]);
                                }
                            }
                            if (!isFuUse && lib.skill.yue_fuyue.isFu(evt.card)) isFuUse = true;
                            if (!isFuUse) return;
                            evt._yue_fuyue_noConvert = true;
                            if (evt.card) {
                                evt.card._yue_fuyue_noConvert = true;
                                if (!evt.card.storage) evt.card.storage = {};
                                evt.card.storage.yue_fuyue_fu = true;
                                evt.card.storage.yue_fuyue_noConvert = true;
                                delete evt.card.bianhua;
                                delete evt.card.bianhua2;
                            }
                        },

                        markFu: function (player, cards, replace) {
                            if (!player || !cards) return [];
                            if (get.itemtype(cards) == "card") cards = [cards];
                            cards = cards.slice(0);
                            var changed = [];
                            for (var i = 0; i < cards.length; i++) {
                                var card = cards[i];
                                if (!card) continue;
                                var wasFu = lib.skill.yue_fuyue.isFu(card);
                                if (!wasFu && player.addGaintag) {
                                    player.addGaintag(card, "yue_fuyue_fu");
                                } else if (!wasFu && card.addGaintag) {
                                    card.addGaintag("yue_fuyue_fu");
                                }
                                lib.skill.yue_fuyue.markAsActualCard(card);
                                var newName = lib.skill.yue_fuyue.getRandomName(card, !!replace || wasFu);
                                if (newName) {
                                    lib.skill.yue_fuyue.setAltName(card, newName);
                                    changed.push(card);
                                }
                            }
                            lib.skill.yue_fuyue.refreshFuTag(cards);
                            if (player.update) player.update();
                            if (player == game.me && ui.updatehl) ui.updatehl();
                            return changed;
                        },

                        refreshFuTag: function (cards) {
                            if (!cards) return;
                            if (get.itemtype(cards) == "card") cards = [cards];
                            cards = cards.slice(0);
                            game.broadcastAll(function (targets) {
                                lib.translate.yue_fuyue_fu = "赋";
                                lib.translate.yue_fuyue_fu_bg = "赋";
                                var updateOne = function (card) {
                                    if (!card) return false;
                                    var tags = card.gaintag || [];
                                    var hasFu = false;
                                    for (var i = 0; i < tags.length; i++) {
                                        var current = Array.isArray(tags[i]) ? tags[i][0] : tags[i];
                                        if (current == "yue_fuyue_fu") {
                                            hasFu = true;
                                            break;
                                        }
                                    }
                                    if (!hasFu && !(card.storage && card.storage.yue_fuyue_fu)) return true;
                                    card._yue_fuyue_noConvert = true;
                                    if (!card.storage) card.storage = {};
                                    card.storage.yue_fuyue_fu = true;
                                    card.storage.yue_fuyue_noConvert = true;
                                    if (card.dataset) card.dataset.leFuleNoConvert = "true";
                                    delete card.bianhua;
                                    delete card.bianhua2;
                                    if (card._tempName) {
                                        try {
                                            if (card._tempName.close) card._tempName.close();
                                            else if (card._tempName.remove) card._tempName.remove();
                                        } catch (e) {}
                                        delete card._tempName;
                                    }
                                    var node = card.node && card.node.gaintag;
                                    if (!node && card.querySelector) {
                                        node = card.querySelector(".gaintag.info,.gaintag");
                                    }
                                    if (!node) return false;
                                    var labels = [];
                                    for (var j = 0; j < tags.length; j++) {
                                        var entry = tags[j];
                                        var tag = Array.isArray(entry) ? entry[0] : entry;
                                        var translated;
                                        if (tag == "yue_fuyue_fu") {
                                            // “赋”标签不显示单独的“赋”字，而显示这张牌随机获得的附加牌名。
                                            translated = card._yue_fuyue_alt ? get.translation(card._yue_fuyue_alt) : "赋";
                                        } else {
                                            translated = get.translation(tag);
                                        }
                                        if (translated == null || translated == "invisible") continue;
                                        if (Array.isArray(entry) && typeof entry[1] == "number") translated += entry[1];
                                        labels.push(translated);
                                    }
                                    node.innerHTML = labels.join(" ");
                                    node.classList.add("le-fule-gaintag");
                                    node.setAttribute("data-le-fule-fu", "true");
                                    return true;
                                };
                                for (var c = 0; c < targets.length; c++) {
                                    (function (card) {
                                        var attempts = 0;
                                        var apply = function () {
                                            attempts++;
                                            if (!updateOne(card) && attempts < 15) setTimeout(apply, 40);
                                        };
                                        apply();
                                        setTimeout(apply, 120);
                                        setTimeout(apply, 350);
                                    })(targets[c]);
                                }
                            }, cards);
                        },

                        clearTempNames: function (player, keepSelected) {
                            if (!player || !player.getCards) return;
                            var selected = keepSelected && ui.selected && ui.selected.cards ? ui.selected.cards : [];
                            var cards = player.getCards("h");
                            for (var i = 0; i < cards.length; i++) {
                                if (selected && selected.indexOf(cards[i]) != -1) continue;
                                lib.skill.yue_fuyue.restoreActualName(cards[i]);
                            }
                        },

                        safeFilterCard: function (evt, card, name) {
                            if (!evt || !card || !name || typeof evt.filterCard != "function") return false;
                            var oldTemp = card._yue_fuyue_tempName;
                            card._yue_fuyue_tempName = name;
                            lib.skill.yue_fuyue.markAsActualCard(card);
                            var bool = false;
                            try {
                                bool = !!evt.filterCard(card, evt.player, evt);
                            } catch (e) {
                                bool = false;
                            }
                            if (oldTemp === undefined) delete card._yue_fuyue_tempName;
                            else card._yue_fuyue_tempName = oldTemp;
                            lib.skill.yue_fuyue.clearConversionVisual(card);
                            return bool;
                        },

                        getUseEvent: function (evt) {
                            var current = evt || _status.event;
                            var limit = 0;
                            while (current && limit++ < 20) {
                                if (current.name == "chooseToUse" || current.name == "chooseToRespond") {
                                    return current;
                                }
                                if (current.getParent) {
                                    var parent = current.getParent();
                                    if (parent && parent != current) {
                                        current = parent;
                                        continue;
                                    }
                                }
                                if (current.parent && current.parent != current) {
                                    current = current.parent;
                                    continue;
                                }
                                break;
                            }
                            return evt || _status.event;
                        },

                        isNameButtonBlockedContext: function (evt) {
                            var current = evt || _status.event;
                            var limit = 0;
                            while (current && limit++ < 20) {
                                if (current._yue_fuyue_disableButtons || current._yue_wenlan_selecting) return true;
                                if (current.getParent) {
                                    var parent = current.getParent();
                                    if (parent && parent != current) {
                                        current = parent;
                                        continue;
                                    }
                                }
                                if (current.parent && current.parent != current) {
                                    current = current.parent;
                                    continue;
                                }
                                break;
                            }
                            return false;
                        },

                        prepareSelectable: function (evt) {
                            var currentEvt = evt || _status.event;
                            if (lib.skill.yue_fuyue.isNameButtonBlockedContext(currentEvt)) {
                                lib.skill.yue_fuyue.cleanupNameButtons();
                                return;
                            }
                            evt = lib.skill.yue_fuyue.getUseEvent(currentEvt);
                            if (!evt || !evt.player || !evt.player.hasSkill || !evt.player.hasSkill("yue_fuyue")) return;
                            if (evt.name != "chooseToUse" && evt.name != "chooseToRespond") return;
                            if (typeof evt.filterCard != "function") return;
                            var cards = evt.player.getCards("h");
                            if (!cards.length) return;

                            delete evt._cardChoice;
                            var selected = ui.selected && ui.selected.cards ? ui.selected.cards : [];
                            var selectedFu = selected.length == 1 && lib.skill.yue_fuyue.isFu(selected[0]) ? selected[0] : null;
                            var selectedKey = selectedFu ? (selectedFu.cardid || selectedFu) : null;

                            for (var i = 0; i < cards.length; i++) {
                                var card = cards[i];
                                if (!lib.skill.yue_fuyue.isFu(card)) continue;
                                var names = lib.skill.yue_fuyue.getNames(card);
                                if (names.length < 2) continue;

                                if (card == selectedFu) {
                                    var chosen = evt._yue_fuyue_chosenName;
                                    if (evt._yue_fuyue_chosenCard != selectedKey || names.indexOf(chosen) == -1) {
                                        if (lib.skill.yue_fuyue.safeFilterCard(evt, card, names[0])) chosen = names[0];
                                        else if (lib.skill.yue_fuyue.safeFilterCard(evt, card, names[1])) chosen = names[1];
                                        else chosen = names[0];
                                        evt._yue_fuyue_chosenName = chosen;
                                        evt._yue_fuyue_chosenCard = selectedKey;
                                    }
                                    lib.skill.yue_fuyue.applyActualName(card, chosen);
                                    continue;
                                }

                                lib.skill.yue_fuyue.restoreActualName(card);
                                if (lib.skill.yue_fuyue.safeFilterCard(evt, card, names[0])) {
                                    card._yue_fuyue_tempName = names[0];
                                } else if (lib.skill.yue_fuyue.safeFilterCard(evt, card, names[1])) {
                                    card._yue_fuyue_tempName = names[1];
                                    card._yue_fuyue_liftName = names[1];
                                }
                            }

                            if (!selectedFu) {
                                delete evt._yue_fuyue_chosenName;
                                delete evt._yue_fuyue_chosenCard;
                                delete evt._yue_fuyue_nameLocked;
                            }
                        },

                        getActiveSelection: function (evt) {
                            var currentEvt = evt || _status.event;
                            if (lib.skill.yue_fuyue.isNameButtonBlockedContext(currentEvt)) return null;
                            evt = lib.skill.yue_fuyue.getUseEvent(currentEvt);
                            if (!evt || !evt.player || !evt.player.hasSkill || !evt.player.hasSkill("yue_fuyue")) return null;
                            if (evt.name != "chooseToUse" && evt.name != "chooseToRespond") return null;
                            if (evt.isMine && !evt.isMine()) return null;
                            if (!ui.selected || !ui.selected.cards || ui.selected.cards.length != 1) return null;
                            var card = ui.selected.cards[0];
                            if (!lib.skill.yue_fuyue.isFu(card)) return null;
                            var names = lib.skill.yue_fuyue.getNames(card);
                            if (names.length < 2) return null;
                            return {
                                event: evt,
                                currentEvent: currentEvt,
                                player: evt.player,
                                card: card,
                                names: names
                            };
                        },

                        findConfirmNodes: function () {
                            var root = ui.confirm;
                            if (!root || !root.parentNode) return null;
                            var ok = null;
                            var cancel = null;

                            if (root.node) {
                                ok = root.node.ok || root.node.confirm || null;
                                cancel = root.node.cancel || null;
                            }
                            if (root.querySelector) {
                                if (!ok) {
                                    ok = root.querySelector(
                                        "div.primary:not(.primary2)," +
                                        ".control.primary:not(.primary2)," +
                                        "[data-control='ok']"
                                    );
                                }
                                if (!cancel) {
                                    cancel = root.querySelector(
                                        "div.primary2,.control.primary2," +
                                        "[data-control='cancel']"
                                    );
                                }
                            }
                            var children = root.children || [];
                            if (!ok) {
                                for (var i = 0; i < children.length; i++) {
                                    if (children[i].link == "ok") {
                                        ok = children[i];
                                        break;
                                    }
                                }
                            }
                            if (!cancel) {
                                for (var j = 0; j < children.length; j++) {
                                    if (children[j].link == "cancel") {
                                        cancel = children[j];
                                        break;
                                    }
                                }
                            }
                            if (!ok && children.length) ok = children[0];
                            if (!cancel && children.length > 1) cancel = children[children.length - 1];
                            if (!ok || !ok.parentNode) return null;
                            return { root: root, ok: ok, cancel: cancel };
                        },

                        getNameButtonStyle: function () {
                            var value = lib.config["extension_乐曹植_buttonStyle"];
                            if (!value && lib._leCaozhiExtensionConfig) {
                                value = lib._leCaozhiExtensionConfig.buttonStyle;
                            }
                            return value == "yijiang" ? "yijiang" : "shousha";
                        },

                        getNameButtonImage: function () {
                            var styleName = lib.skill.yue_fuyue.getNameButtonStyle();
                            var fileName = styleName == "yijiang" ? "btnnnor.png" : "cbtn.png";
                            return {
                                style: styleName,
                                path: (lib.assetURL || "") + "extension/乐曹植/" + fileName
                            };
                        },

                        positionNameButtons: function (state) {
                            if (!state || !state.control) return;

                            // 以后只改这里：正数向右/向下，负数向左/向上。
                            // 这次改为 transform 偏移，不再依赖容易被手杀UI重置的 left/top。
                            var offsetX = -110;
                            var offsetY = 50;

                            var anchor = state.root;
                            var rect = anchor && anchor.getBoundingClientRect ? anchor.getBoundingClientRect() : null;
                            if (!rect || (!rect.width && !rect.height)) {
                                rect = state.anchorRect || null;
                            } else {
                                state.anchorRect = {
                                    left: rect.left,
                                    top: rect.top,
                                    width: rect.width,
                                    height: rect.height
                                };
                            }
                            if (!rect || (!rect.width && !rect.height)) return;

                            var itemWidth = state.first && state.first.offsetWidth ? state.first.offsetWidth : 153;
                            var itemHeight = state.first && state.first.offsetHeight ? state.first.offsetHeight : 52;
                            var width = itemWidth * 2 + 8;
                            var height = itemHeight;
                            var left = rect.left + rect.width / 2 - width / 2;
                            var top = rect.top + rect.height / 2 - height / 2;
                            var maxLeft = Math.max(6, (window.innerWidth || document.documentElement.clientWidth || 0) - width - 6);
                            var maxTop = Math.max(6, (window.innerHeight || document.documentElement.clientHeight || 0) - height - 6);
                            left = Math.max(6, Math.min(left, maxLeft));
                            top = Math.max(6, Math.min(top, maxTop));

                            state.control.style.setProperty("left", Math.round(left) + "px", "important");
                            state.control.style.setProperty("top", Math.round(top) + "px", "important");
                            state.control.style.setProperty("transform", "translate3d(" + offsetX + "px," + offsetY + "px,0)", "important");
                        },

                        cleanupNameButtons: function () {
                            var state = lib.skill.yue_fuyue._buttonState;
                            if (!state) return;
                            lib.skill.yue_fuyue._buttonState = null;

                            try {
                                if (state.revealTimer) {
                                    clearTimeout(state.revealTimer);
                                    state.revealTimer = null;
                                }
                                if (state.positionTimer) {
                                    clearInterval(state.positionTimer);
                                    state.positionTimer = null;
                                }
                                if (state.first) {
                                    state.first.removeEventListener(state.eventName, state.firstListener, true);
                                }
                                if (state.second) {
                                    state.second.removeEventListener(state.eventName, state.secondListener, true);
                                }
                                if (state.control && state.control.parentNode) {
                                    state.control.parentNode.removeChild(state.control);
                                } else {
                                    if (state.first && state.first.parentNode) state.first.parentNode.removeChild(state.first);
                                    if (state.second && state.second.parentNode) state.second.parentNode.removeChild(state.second);
                                }
                                if (state.originalOk && state.originalOk.classList) {
                                    state.originalOk.classList.remove("le-fule-original-ok-hidden");
                                }
                                if (state.root && state.root.classList) {
                                    state.root.classList.remove("le-fule-confirm-mode");
                                }
                            } catch (e) {}
                        },

                        // 兼容旧版清理调用，避免 useCardAfter 阶段因函数改名报错。
                        clearNameControl: function () {
                            lib.skill.yue_fuyue.cleanupNameButtons();
                        },

                        clearSelectionUI: function (clearChoice) {
                            var evt = lib.skill.yue_fuyue.getUseEvent(_status.event);
                            lib.skill.yue_fuyue.cleanupNameButtons();
                            if (evt && evt.player) {
                                lib.skill.yue_fuyue.clearTempNames(evt.player, false);
                            }
                            if (clearChoice && evt) {
                                delete evt._yue_fuyue_chosenName;
                                delete evt._yue_fuyue_chosenCard;
                                delete evt._yue_fuyue_nameLocked;
                            }
                        },

                        chooseName: function (name, node) {
                            var active = lib.skill.yue_fuyue.getActiveSelection(_status.event);
                            if (!active || active.names.indexOf(name) == -1) return;
                            if (!lib.skill.yue_fuyue.safeFilterCard(active.event, active.card, name)) return;

                            active.event._yue_fuyue_chosenName = name;
                            active.event._yue_fuyue_chosenCard = active.card.cardid || active.card;
                            active.event._yue_fuyue_nameLocked = true;
                            lib.skill.yue_fuyue.applyActualName(active.card, name);
                            delete active.event._cardChoice;
                            delete active.event._targetChoice;

                            if (ui.selected && ui.selected.targets && ui.selected.targets.length) {
                                game.uncheck("target");
                            }

                            lib.skill.yue_fuyue.cleanupNameButtons();
                            try {
                                game.check();
                            } catch (e2) {
                                console.error("[乐曹植] 选择赋牌名后检查失败", e2);
                            }
                        },

                        refreshNameButtons: function () {
                            if (lib.skill.yue_fuyue._decoratingButtons) return;
                            lib.skill.yue_fuyue._decoratingButtons = true;
                            try {
                                var active = lib.skill.yue_fuyue.getActiveSelection(_status.event);
                                if (!active) {
                                    var useEvt = lib.skill.yue_fuyue.getUseEvent(_status.event);
                                    if (useEvt) {
                                        delete useEvt._yue_fuyue_chosenName;
                                        delete useEvt._yue_fuyue_chosenCard;
                                        delete useEvt._yue_fuyue_nameLocked;
                                    }
                                    lib.skill.yue_fuyue.cleanupNameButtons();
                                    return;
                                }

                                var cardKey = active.card.cardid || active.card;
                                var lockedName = active.event._yue_fuyue_chosenName;
                                if (active.event._yue_fuyue_nameLocked && active.event._yue_fuyue_chosenCard == cardKey && active.names.indexOf(lockedName) != -1) {
                                    lib.skill.yue_fuyue.applyActualName(active.card, lockedName);
                                    lib.skill.yue_fuyue.cleanupNameButtons();
                                    return;
                                }
                                if (active.event._yue_fuyue_chosenCard != cardKey) {
                                    delete active.event._yue_fuyue_chosenName;
                                    delete active.event._yue_fuyue_chosenCard;
                                    delete active.event._yue_fuyue_nameLocked;
                                }

                                var found = lib.skill.yue_fuyue.findConfirmNodes();
                                if (!found || !found.ok) return;
                                var buttonStyle = lib.skill.yue_fuyue.getNameButtonStyle();
                                var key = String(cardKey) + "|" + active.names.join("|") + "|" + buttonStyle;
                                var state = lib.skill.yue_fuyue._buttonState;

                                if (!state || state.root != found.root || state.originalOk != found.ok || state.key != key || !state.control || !state.control.parentNode || !state.first || !state.first.parentNode || !state.second || !state.second.parentNode) {
                                    lib.skill.yue_fuyue.cleanupNameButtons();

                                    var originalOk = found.ok;
                                    var parent = originalOk.parentNode;
                                    if (!parent) return;
                                    originalOk.classList.add("le-fule-original-ok-hidden");

                                    var control = document.createElement("div");
                                    var enable = document.createElement("div");
                                    control.className = "le-fule-name-control";
                                    enable.className = "le-fule-name-buttons";
                                    // 先隐藏，定位完成后再原地显示，避免从 left:0/top:0 飞到目标位置。
                                    control.style.setProperty("visibility", "hidden", "important");
                                    control.style.setProperty("opacity", "0", "important");
                                    control.style.setProperty("transition", "none", "important");
                                    control.style.setProperty("animation", "none", "important");
                                    control.appendChild(enable);

                                    var first = document.createElement("div");
                                    var second = document.createElement("div");
                                    first.className = "le-fule-name-button";
                                    second.className = "le-fule-name-button";
                                    first.setAttribute("role", "button");
                                    second.setAttribute("role", "button");
                                    first.setAttribute("tabindex", "0");
                                    second.setAttribute("tabindex", "0");
                                    first.dataset.id = "yue_fuyue_name_0";
                                    second.dataset.id = "yue_fuyue_name_1";

                                    var imageInfo = lib.skill.yue_fuyue.getNameButtonImage();
                                    first.classList.add("le-fule-style-" + imageInfo.style);
                                    second.classList.add("le-fule-style-" + imageInfo.style);
                                    var firstImage = document.createElement("img");
                                    var secondImage = document.createElement("img");
                                    var firstText = document.createElement("span");
                                    var secondText = document.createElement("span");
                                    firstImage.draggable = false;
                                    secondImage.draggable = false;
                                    firstImage.src = imageInfo.path;
                                    secondImage.src = imageInfo.path;
                                    first.appendChild(firstImage);
                                    first.appendChild(firstText);
                                    second.appendChild(secondImage);
                                    second.appendChild(secondText);
                                    enable.appendChild(first);
                                    enable.appendChild(second);

                                    var eventName = lib.config.touchscreen ? "touchend" : "click";
                                    var firstListener = function (ev) {
                                        if (ev) {
                                            ev.preventDefault();
                                            ev.stopPropagation();
                                            if (ev.stopImmediatePropagation) ev.stopImmediatePropagation();
                                        }
                                        lib.skill.yue_fuyue.chooseName(active.names[0], first);
                                    };
                                    var secondListener = function (ev) {
                                        if (ev) {
                                            ev.preventDefault();
                                            ev.stopPropagation();
                                            if (ev.stopImmediatePropagation) ev.stopImmediatePropagation();
                                        }
                                        lib.skill.yue_fuyue.chooseName(active.names[1], second);
                                    };
                                    first.addEventListener(eventName, firstListener, true);
                                    second.addEventListener(eventName, secondListener, true);
                                    var downEvent = lib.config.touchscreen ? "touchstart" : "mousedown";
                                    var upEvent = lib.config.touchscreen ? "touchend" : "mouseup";
                                    var addHover = function (node) {
                                        return function () { node.classList.add("le-fule-hover"); };
                                    };
                                    var removeHover = function (node) {
                                        return function () { node.classList.remove("le-fule-hover"); };
                                    };
                                    var firstDown = addHover(first), secondDown = addHover(second), firstUp = removeHover(first), secondUp = removeHover(second);
                                    first.addEventListener(downEvent, firstDown, true);
                                    second.addEventListener(downEvent, secondDown, true);
                                    first.addEventListener(upEvent, firstUp, true);
                                    second.addEventListener(upEvent, secondUp, true);
                                    first.addEventListener("mouseleave", firstUp, true);
                                    second.addEventListener("mouseleave", secondUp, true);

                                    (document.body || ui.window).appendChild(control);

                                    state = {
                                        key: key,
                                        root: found.root,
                                        originalOk: originalOk,
                                        control: control,
                                        enable: enable,
                                        first: first,
                                        second: second,
                                        firstListener: firstListener,
                                        secondListener: secondListener,
                                        firstDown: firstDown,
                                        secondDown: secondDown,
                                        firstUp: firstUp,
                                        secondUp: secondUp,
                                        eventName: eventName,
                                        downEvent: downEvent,
                                        upEvent: upEvent,
                                        firstImage: firstImage,
                                        secondImage: secondImage,
                                        firstText: firstText,
                                        secondText: secondText
                                    };
                                    lib.skill.yue_fuyue._buttonState = state;
                                    lib.skill.yue_fuyue.positionNameButtons(state);
                                    state.revealTimer = setTimeout(function () {
                                        if (lib.skill.yue_fuyue._buttonState != state || !state.control || !state.control.parentNode) return;
                                        lib.skill.yue_fuyue.positionNameButtons(state);
                                        state.control.style.setProperty("visibility", "visible", "important");
                                        state.control.style.setProperty("opacity", "1", "important");
                                    }, 32);
                                    state.positionTimer = setInterval(function () {
                                        if (lib.skill.yue_fuyue._buttonState != state || !state.control || !state.control.parentNode) {
                                            clearInterval(state.positionTimer);
                                            return;
                                        }
                                        lib.skill.yue_fuyue.positionNameButtons(state);
                                    }, 120);
                                }

                                var previewName = null;
                                if (lib.skill.yue_fuyue.safeFilterCard(active.event, active.card, active.names[0])) previewName = active.names[0];
                                else if (lib.skill.yue_fuyue.safeFilterCard(active.event, active.card, active.names[1])) previewName = active.names[1];
                                if (previewName) lib.skill.yue_fuyue.applyActualName(active.card, previewName);

                                var nodes = [state.first, state.second];
                                for (var i = 0; i < nodes.length; i++) {
                                    var item = nodes[i];
                                    var itemName = active.names[i];
                                    var textNode = i == 0 ? state.firstText : state.secondText;
                                    if (textNode) textNode.textContent = get.translation(itemName);
                                    item.link = "yue_fuyue_name_" + i;
                                    item.classList.add("le-fule-name-button");
                                    item.classList.remove("le-fule-hover");
                                    if (lib.skill.yue_fuyue.safeFilterCard(active.event, active.card, itemName)) {
                                        item.classList.remove("le-fule-disabled");
                                    } else {
                                        item.classList.add("le-fule-disabled");
                                    }
                                }
                                if (state.root && state.root.classList) {
                                    state.root.classList.add("le-fule-confirm-mode");
                                }
                                lib.skill.yue_fuyue.positionNameButtons(state);
                                if (ui.updatec) ui.updatec();
                            } finally {
                                lib.skill.yue_fuyue._decoratingButtons = false;
                            }
                        },

                        mod: {
                            ignoredHandcard: function (card, player) {
                                if (lib.skill.yue_fuyue.isFu(card)) return true;
                            },
                            cardDiscardable: function (card, player, name) {
                                if (name == "phaseDiscard" && lib.skill.yue_fuyue.isFu(card)) return false;
                            },
                            cardname: function (card, player, name) {
                                if (card && card._yue_fuyue_tempName && lib.skill.yue_fuyue.isFu(card)) {
                                    return card._yue_fuyue_tempName;
                                }
                            }
                        },

                        ai: {
                            threaten: 1.8,
                            respondSha: true,
                            respondShan: true,
                            skillTagFilter: function (player, tag) {
                                var wanted = tag == "respondSha" ? "sha" : tag == "respondShan" ? "shan" : null;
                                if (!wanted) return false;
                                return player.hasCard(function (card) {
                                    return lib.skill.yue_fuyue.isFu(card) && lib.skill.yue_fuyue.getNames(card).indexOf(wanted) != -1;
                                }, "h");
                            }
                        },

                        subSkill: {
                            init: {
                                trigger: {
                                    global: "gameDrawAfter",
                                    player: "enterGame"
                                },
                                forced: true,
                                silent: true,
                                popup: false,
                                firstDo: true,
                                filter: function (event, player) {
                                    return !player.storage.yue_fuyue_initialized && player.countCards("h") > 0;
                                },
                                content: function () {
                                    player.storage.yue_fuyue_initialized = true;
                                    lib.skill.yue_fuyue.markFu(player, player.getCards("h"), false);
                                }
                            },
                            actual: {
                                trigger: {
                                    player: ["useCardBefore", "respondBefore"]
                                },
                                forced: true,
                                silent: true,
                                popup: false,
                                firstDo: true,
                                priority: 1000,
                                filter: function (event, player) {
                                    if (event && lib.skill.yue_fuyue.isFu(event.card)) return true;
                                    var cards = event && Array.isArray(event.cards) ? event.cards : [];
                                    for (var i = 0; i < cards.length; i++) {
                                        if (lib.skill.yue_fuyue.isFu(cards[i])) return true;
                                    }
                                    return false;
                                },
                                content: function () {
                                    lib.skill.yue_fuyue.normalizeUseEvent(trigger);
                                }
                            },
                            cleanup: {
                                trigger: {
                                    player: ["useCardAfter", "respondAfter", "chooseToUseAfter", "chooseToRespondAfter", "phaseAfter"]
                                },
                                forced: true,
                                silent: true,
                                popup: false,
                                lastDo: true,
                                content: function () {
                                    // 成功选择使用/打出后，保留临时cardname到useCardAfter/respondAfter；
                                    // 实体牌的card.name始终不变，避免手牌区生成额外展示牌。
                                    if ((trigger.name == "chooseToUse" || trigger.name == "chooseToRespond") &&
                                        ((trigger.result && trigger.result.bool) || (trigger._result && trigger._result.bool))) {
                                        if (player == game.me) lib.skill.yue_fuyue.cleanupNameButtons();
                                        return;
                                    }
                                    var cards = player.getCards("h");
                                    var usedCards = [];
                                    if (trigger && Array.isArray(trigger.cards)) usedCards = trigger.cards.slice(0);
                                    else if (trigger && trigger.card && Array.isArray(trigger.card.cards)) usedCards = trigger.card.cards.slice(0);
                                    cards.addArray(usedCards);
                                    for (var i = 0; i < cards.length; i++) {
                                        lib.skill.yue_fuyue.restoreActualName(cards[i]);
                                    }
                                    if (player == game.me) lib.skill.yue_fuyue.cleanupNameButtons();
                                }
                            }
                        }
                    },

                    yue_wenlan: {
                        audio: 'ext:乐曹植/audio:2',
                        trigger: {
                            player: ["useCardAfter", "respondAfter"]
                        },
                        forced: true,
                        init: function (player) {
                            if (!Array.isArray(player.storage.yue_wenlan_records)) {
                                player.storage.yue_wenlan_records = [];
                            }
                        },
                        getSourceCards: function (event) {
                            var cards = [];
                            if (event && Array.isArray(event.cards)) cards = event.cards.slice(0);
                            else if (event && event.card && Array.isArray(event.card.cards)) cards = event.card.cards.slice(0);
                            return cards;
                        },
                        getRecord: function (event) {
                            var cards = lib.skill.yue_wenlan.getSourceCards(event);
                            if (cards.length == 1 && lib.skill.yue_fuyue.isFu(cards[0])) {
                                return {
                                    fu: true,
                                    names: lib.skill.yue_fuyue.getNames(cards[0]).slice(0),
                                    card: cards[0]
                                };
                            }
                            return {
                                fu: false,
                                names: [],
                                card: cards.length == 1 ? cards[0] : null
                            };
                        },
                        hasCommonName: function (record1, record2) {
                            if (!record1 || !record2 || !record1.fu || !record2.fu) return false;
                            for (var i = 0; i < record1.names.length; i++) {
                                if (record2.names.indexOf(record1.names[i]) != -1) return true;
                            }
                            return false;
                        },
                        filter: function (event, player) {
                            if (event._yue_wenlan_counted) return false;
                            return true;
                        },
                        content: function () {
                            "step 0"
                            trigger._yue_wenlan_counted = true;
                            if (!Array.isArray(player.storage.yue_wenlan_records)) {
                                player.storage.yue_wenlan_records = [];
                            }
                            player.storage.yue_wenlan_records.push(lib.skill.yue_wenlan.getRecord(trigger));
                            if (player.storage.yue_wenlan_records.length < 2) {
                                event.finish();
                                return;
                            }
                            event.record1 = player.storage.yue_wenlan_records.shift();
                            event.record2 = player.storage.yue_wenlan_records.shift();
                            event.success = lib.skill.yue_wenlan.hasCommonName(event.record1, event.record2);

                            if (event.success) {
                                var names = [];
                                for (var i = 0; i < event.record1.names.length; i++) {
                                    if (names.indexOf(event.record1.names[i]) == -1) names.push(event.record1.names[i]);
                                }
                                for (var j = 0; j < event.record2.names.length; j++) {
                                    if (names.indexOf(event.record2.names[j]) == -1) names.push(event.record2.names[j]);
                                }
                                event.names = names;
                                event.gainCards = [];
                                for (var k = 0; k < names.length; k++) {
                                    var wanted = names[k];
                                    var found = get.cardPile2(function (card) {
                                        return card.name == wanted && event.gainCards.indexOf(card) == -1;
                                    });
                                    if (found) event.gainCards.push(found);
                                }
                                if (event.gainCards.length) {
                                    player.gain(event.gainCards, "gain2");
                                } else {
                                    event.finish();
                                }
                            } else {
                                if (!player.countCards("h")) {
                                    event.finish();
                                    return;
                                }
                                player.chooseCard(
                                    "h",
                                    [1, Infinity],
                                    "文澜：至少选择一张手牌；未标记的牌将标记为“赋”，已标记的牌将替换其“赋”牌名"
                                ).set("_yue_fuyue_disableButtons", true).set("_yue_wenlan_selecting", true).set("ai", function (card) {
                                    var player = _status.event.player;
                                    if (!lib.skill.yue_fuyue.isFu(card)) return 7 - get.value(card, player);
                                    return 4 - get.value(card, player);
                                });
                            }
                            "step 1"
                            if (event.success) {
                                if (event.gainCards && event.gainCards.length) {
                                    lib.skill.yue_fuyue.markFu(player, event.gainCards, false);
                                    game.log(player, "获得了", event.gainCards, "并将其标记为", "#y赋");
                                }
                            } else if (result.bool && result.cards && result.cards.length) {
                                for (var i = 0; i < result.cards.length; i++) {
                                    var card = result.cards[i];
                                    lib.skill.yue_fuyue.markFu(player, card, lib.skill.yue_fuyue.isFu(card));
                                }
                                game.log(player, "调整了", result.cards, "的", "#y赋", "牌名");
                            }
                        },
                        mark: true,
                        marktext: "澜",
                        intro: {
                            markcount: function (storage, player) {
                                var records = player.storage.yue_wenlan_records;
                                return Array.isArray(records) ? records.length : 0;
                            },
                            content: function (storage, player) {
                                var records = player.storage.yue_wenlan_records;
                                if (!Array.isArray(records) || !records.length) return "尚未记录下一组牌";
                                var record = records[0];
                                if (!record.fu) return "已记录的第一张牌不是“赋”";
                                return "已记录“赋”所含牌名：" + get.translation(record.names);
                            }
                        },
                        onremove: function (player) {
                            delete player.storage.yue_wenlan_records;
                        },
                        ai: {
                            threaten: 1.7
                        }
                    }
                },
                translate: {
                    yue_fuyue: "赋乐",
                    yue_fuyue_info: "锁定技，你的初始手牌增加“赋”标记且不计入手牌上限。“赋”随机获得另一种非装备牌牌名，使用“赋”时可选择使用该牌所拥有的任意一种牌名。以此法使用的牌不视为转化牌。",
                    yue_fuyue_fu: "赋",
                    yue_fuyue_fu_bg: "赋",
                    yue_wenlan: "文澜",
                    yue_wenlan_info: "你每使用或打出两张牌结算后：若为包含相同牌名的两张“赋”，你从牌堆中获得这两张“赋”所含牌名的牌各一张，并标记为“赋”；否则你选择任意张手牌标记为“赋”或替换“赋”牌名。"
                }
            },
            intro: "自制乐曹植武将拓展。",
            author: "soyo",
            diskURL: "",
            forumURL: "",
            version: "1.5.2"
        },
        files: {
            character: ["yue_caozhi.jpg"],
            card: [],
            skill: []
        }
    };
};
