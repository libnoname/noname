import { lib, game, ui, get, ai, _status } from "noname";
export default {
    async mjsExpandEquip(event, trigger, player) {
        const num = event.num;
        player.addSkill("mjsequip");
        var info = player.storage;
        if (typeof info.mjsequip != "number") {
            info.mjsequip = 0;
        }
        info.mjsequip += num;
        game.log(player, "的装备上限", "#y+" + num);
        player.update();
    },
    async mjsContractEquip(event, trigger, player) {
        const num = event.num;
        player.addSkill("mjsequip");
        var info = player.storage;
        if (typeof info.mjsequip != "number") {
            info.mjsequip = 0;
        }
        info.mjsequip -= num;
        game.log(player, "的装备上限", "#y-" + num);
        player.update();
        const next = game.createEvent("mjsContractEquipLose");
        next.player = player;
        next.setContent("mjsContractEquipLose");
        await next;
    },
    async mjsContractEquipLose(event, trigger, player) {
        let cards = player.getCards("e");
        let replacedCards = [];
        let left = player.mjsGetEquipLimit(),
            lose = cards.length - left;
        if (left == 0) {
            const next = game.createEvent("mjsContractEquipAll");
            next.player = player;
            next.setContent("emptyEvent");
            await next;
        }
        if (lose <= 0) {
            return;
        }
        else if (lose > 0 && cards.length == 1) {
            replacedCards.addArray(cards);
        } else if (lose > 0) {
            const result = await player
                .chooseButton(["选择" + get.cnNumber(lose) + "张装备牌置入弃牌堆", cards], lose, true)
                .forResult();
            if (result?.bool) {
                replacedCards.addArray(result.links);
            }
        }
        if (replacedCards.length > 0) {
            await player.loseToDiscardpile(replacedCards);
        }
    },
    async mjsStrengthenCards(event, trigger, player) {
        const { cards, source } = event;
        for (const card of cards) {
            const bool = get.position(card) == "e";
            if (bool) {
                player.removeEquipTrigger(card.card || card);
            }
            game.broadcastAll(
                card => {
                    card.storage.mjsstrengthen = true;
                    //card.classList.add("mjsstrengthen-glow");
                    card.addGaintag("eternal_mjsstrengthen_tag");
                },
                card
            );
            if (bool) {
                player.addEquipTrigger(card.card || card);
            }
            if (card.storage.mjsstrengthen && card.storage.mjsweaken) {
                game.broadcastAll(
                    card => {
                        card.storage.mjsstrengthen = false;
                        card.storage.mjsweaken = false;
                        //card.classList.remove("mjsstrengthen-glow");
                        //card.classList.remove("mjsweaken-glow");
                        card.removeGaintag("eternal_mjsstrengthen_tag");
                        card.removeGaintag("eternal_mjsweaken_tag");
                    },
                    card
                );
                continue;
            }
            const info = lib.card[card.name];
            if (!get.info("_mjsstrengthen").getList.includes(card.name)) continue;
            if (info.mjsstrengthen_prompt) continue;
            info.mjsstrengthen_prompt = true;
            if (info.cardPrompt) {
                info.mjsstrengthen_cardPrompt = get.copy(info.cardPrompt);
            }
            info.cardPrompt = function (card, player) {
                var str = "", name, info;
                if (Array.isArray(card)) {
                    name = card[2];
                } else {
                    name = card.name;
                }
                info = get.info({ name: name });
                if (info.mjsstrengthen_cardPrompt) {
                    str += info.mjsstrengthen_cardPrompt(card, player);
                } else {
                    str += lib.translate[`${name}_info`];
                }
                if (card?.storage?.mjsstrengthen) {
                    var description;
                    if (card.name == "sha") {
                        if (game.hasNature(card, "thunder")) {
                            description = "出牌阶段限1次，对攻击范围内的1名其他角色造成1点雷电伤害，并且造成伤害后，出杀次数+1";
                        } else if (game.hasNature(card, "fire")) {
                            description = "出牌阶段限1次，对攻击范围内的1名其他角色造成1点火焰伤害，并且造成伤害后，令目标下回合开始时受到1点火焰伤害";
                        }
                    }
                    if (!description) {
                        description = get.info("_mjsstrengthen").getBuff.get(name).description;
                    }
                    str += `<br><span data-nature=\"shen\">增强：${description}</span>`;
                }
                return str;
            };
        }
        if (event.log != false) {
            game.log(source, "<span data-nature=\"shen\">强化</span>", "了", player, "的", get.cnNumber(cards.length), "张牌");
        }
    },
    async mjsWeakenCards(event, trigger, player) {
        const { cards, source } = event;
        for (const card of cards) {
            const bool = get.position(card) == "e";
            if (bool) {
                player.removeEquipTrigger(card.card || card);
            }
            game.broadcastAll(
                card => {
                    //card.classList.add("mjsweaken-glow");
                    card.storage.mjsweaken = true;
                    card.addGaintag("eternal_mjsweaken_tag");
                },
                card
            );
            if (bool) {
                player.addEquipTrigger(card.card || card);
            }
            if (card.storage.mjsstrengthen && card.storage.mjsweaken) {
                game.broadcastAll(
                    card => {
                        card.storage.mjsstrengthen = false;
                        card.storage.mjsweaken = false;
                        //card.classList.remove("mjsstrengthen-glow");
                        //card.classList.remove("mjsweaken-glow");
                        card.removeGaintag("eternal_mjsstrengthen_tag");
                        card.removeGaintag("eternal_mjsweaken_tag");
                    },
                    card
                );
                continue;
            }
            const info = lib.card[card.name];
            if (!get.info("_mjsweaken").getList.includes(card.name)) continue;
            if (info.mjsweaken_prompt) continue;
            info.mjsweaken_prompt = true;
            if (info.cardPrompt) {
                info.mjsweaken_cardPrompt = get.copy(info.cardPrompt);
            }
            info.cardPrompt = function (card, player) {
                var str = "", name, info;
                if (Array.isArray(card)) {
                    name = card[2];
                } else {
                    name = card.name;
                }
                info = get.info({ name: name });
                if (info.mjsweaken_cardPrompt) {
                    str += info.mjsweaken_cardPrompt(card, player);
                } else {
                    str += lib.translate[`${name}_info`];
                }
                if (card?.storage?.mjsweaken) {
                    var description;
                    if (card.name == "sha") {
                        if (game.hasNature(card, "thunder")) {
                            description = "出牌阶段限1次，对攻击范围内的1名其他角色造成1点雷电伤害，并且造成伤害后，出杀次数+1";
                        } else if (game.hasNature(card, "fire")) {
                            description = "出牌阶段限1次，对攻击范围内的1名其他角色造成1点火焰伤害，并且造成伤害后，令目标下回合开始时受到1点火焰伤害";
                        }
                    }
                    if (!description) {
                        description = get.info("_mjsweaken").getBuff.get(name).description;
                    }
                    str += `<br><span data-nature=\"devil\">削弱：${description}</span>`;
                }
                return str;
            };
        }
        if (event.log != false) {
            game.log(source, "<span data-nature=\"devil\">削弱</span>", "了", player, "的", get.cnNumber(cards.length), "张牌");
        }
    },
    changeGroup2() {
        event.originGroup = player.group;
        if (!event.group) {
            event.group = player.group;
        }
        var group = event.group;
        game.addVideo("changeGroup", player, group);
        player.getHistory("custom").push(event);
        if (event.broadcast !== false) {
            game.broadcast(
                function (player, group) {
                    player.group2 = group;
                    //player.node.name.dataset.nature = get.groupnature(group);
                },
                player,
                group
            );
        }
        player.group2 = group;
        //player.node.name.dataset.nature = get.groupnature(group);
        if (event.log !== false) {
            game.log(player, "将势力变为了", "#y" + get.translation(group + 2));
        }
    },
    chooseButtonCard_mjs: [
        async (event, _trigger, player) => {
            //根据player.chooseButtonCard_mjs获取到的dialog信息创建对话框，也支持createDialog
            if (typeof event.dialog == "number") {
                event.dialog = get.idDialog(event.dialog);
            }
            if (event.createDialog && !event.dialog) {
                if (Array.isArray(event.createDialog)) {
                    event.createDialog.add("hidden");
                    event.dialog = ui.create.dialog.apply(this, event.createDialog);
                }
                event.closeDialog = true;
            }
            if (event.dialog == undefined) {
                event.dialog = ui.dialog;
            }
            if (event.isMine()) {
                if (event.hsskill && !event.forced && _status.prehidden_skills.includes(event.hsskill)) {
                    ui.click.cancel();
                    return;
                }
                if (event.isMine() || event.dialogdisplay) {
                    event.dialog.style.display = "";
                    event.dialog.open();
                    if (event.canHidden) {
                        //增加隐藏窗口的按钮
                        const func = () => {
                            const event = get.event();
                            const controls = [
                                link => {
                                    ui.selected.buttons.length = 0;
                                    game.check();
                                    return;
                                },
                            ];
                            event.controls = [
                                ui.create.control(
                                    controls.concat([
                                        "隐藏窗口",
                                        "stayleft",
                                        link => {
                                            const control = event.controls[0];
                                            if (event.dialog.style.display == "none") {
                                                control.childNodes[0].innerHTML = "隐藏窗口";
                                                event.dialog.style.display = "";
                                            } else {
                                                control.childNodes[0].innerHTML = "显示窗口";
                                                event.dialog.style.display = "none";
                                            }
                                        },
                                    ])
                                ),
                            ];
                        };
                        if (event.isMine()) {
                            func(event);
                        } else if (event.isOnline()) {
                            event.player.send(func, event);
                        }
                        if (event.custom == undefined) {
                            event.custom = {
                                add: {},
                                replace: {},
                            };
                        }
                        if (event.custom.add.confirm == undefined) {
                            //如果有人canHidden是true然后还动了这部分请把一部分代码复制过去适配一下，不然隐藏的按钮不会关闭
                            event.custom.add.confirm = function (bool) {
                                if (bool != true) {
                                    return;
                                }
                                const event = get.event();
                                if (event.controls) {
                                    event.controls.forEach(i => i.close());
                                }
                                if (ui.confirm) {
                                    ui.confirm.close();
                                }
                                game.uncheck();
                            };
                        }
                    }
                }
                game.check();
                game.pause();
            } else if (event.isOnline()) {
                event.result = await event.sendAsync();
            } else {
                //考虑中途托管的情况
                event.result = "ai";
            }
        },
        async (event, _trigger, player, result) => {
            //处理ai的选择结果
            if (event.result == "ai") {
                if (event.processAI) {
                    event.result = event.processAI();
                } else {
                    game.check();
                    if (ai.basic.chooseButton(event.ai1) || event.forced) {
                        if ((ai.basic.chooseCard(event.ai2) || event.forced) && (!event.filterOk || event.filterOk())) {
                            ui.click.ok();
                            _status.event._aiexclude.length = 0;
                        } else {
                            ui.click.cancel();
                        }
                    } else {
                        ui.click.cancel();
                    }
                }
            }
        },
        async (event, _trigger, player, result) => {
            //处理选择的结果
            event.resume();
            if (event.dialog) {
                event.dialog.close();
            }
        }
    ],
    chooseTargetControl_mjs: [
        async (event, _trigger, player) => {
            var chooseTarget = function (event, player) {
                if (!event.result) event.result = {};
                event.forceMine = true;
                if (event.dialog) event.dialog.open();
                var selectTarget;
                if (typeof event.selectTarget == "function") selectTarget = event.selectTarget();
                else selectTarget = event.selectTarget;
                if (typeof selectTarget == "number") selectTarget = [selectTarget, selectTarget];
                event.players = game.players;
                if (event.deadTarget) {
                    event.players.addArray(game.dead);
                }
                event.players.forEach(target => {
                    target.classList.add("pointerdiv");
                    if (event.filterTarget([target], target)) {
                        target.classList.add("selectable");
                    }
                });
                event.custom.replace.target = function (target) {
                    if (!target.classList.contains("selectable")) return;
                    target.unprompt();
                    if (target.classList.contains("selected")) {
                        if (event.complexSelect || event.complexTarget) {
                            event.players.forEach(target => {
                                target.unprompt();
                                target.classList.remove("selected");
                                target.classList.remove("selectable");
                                if (ui.selected.targets.length < event.selectTarget[1] && event.filterTarget([target], target)) {
                                    target.classList.add("selectable");
                                }
                            })
                        }
                        else {
                            ui.selected.targets.remove(target);
                            event.players.forEach(target => {
                                target.classList.remove("selected");
                                target.classList.remove("selectable");
                                if (ui.selected.targets.length < event.selectTarget[1] && event.filterTarget(ui.selected.targets.slice().add(target), target)) {
                                    target.classList.add("selectable")
                                }
                            })
                        }
                    }
                    else {
                        ui.selected.targets.add(target)
                        event.players.forEach(target => {
                            if (ui.selected.targets.includes(target)) return;
                            target.classList.remove("selectable");
                            if (ui.selected.targets.length < event.selectTarget[1] && event.filterTarget(ui.selected.targets.slice().add(target), target)) {
                                target.classList.add("selectable");
                            }
                        })
                        ui.selected.targets.add(target);
                        var targetprompt = get.event().targetprompt;
                        if (targetprompt) {
                            if (Array.isArray(targetprompt)) {
                                var targets = ui.selected.targets.slice()
                                var index = ui.selected.targets.indexOf(target)
                                for (var i of targetprompt) {
                                    var target = targets.find(cur => cur.node.prompt && cur.node.prompt.innerHTML === i)
                                    if (target) targets.remove(target)
                                    else {
                                        index = i
                                        break
                                    }
                                }
                                targetprompt = targetprompt[Math.min(targetprompt.length - 1, index)]
                            }
                            else if (typeof targetprompt == "function") targetprompt = targetprompt(target)
                            if (targetprompt && typeof targetprompt == "string") target.prompt(targetprompt)
                        }
                        target.classList.add("selected");
                    }
                    if (get.event().custom.add.target) {
                        get.event().custom.add.target();
                    }
                    event.replacecontrols();
                }
                event.custom.replace.window = function () {
                    ui.selected.targets = [];
                    event.replacecontrols();
                    event.players.forEach(target => {
                        target.unprompt();
                        target.classList.remove("selected");
                        if (ui.selected.targets.length < event.selectTarget[1] && event.filterTarget([target], target)) {
                            target.classList.add("selectable");
                        }
                    });
                }
                event.controls = [];
                event.replacecontrols = function () {
                    var newControls, unchange, change, 
                        args = event.control(ui.selected.targets, event.controls);
                    if (Array.isArray(args)) newControls = args;
                    else if (args !== undefined && args !== null) newControls = [args];
                    else newControls = [];
                    if (!event.forced && !newControls.includes("cancel2") && newControls.every(i => typeof i == "string" || !i.includes("canale2"))) {
                        newControls.add("cancel2");
                    }
                    if (ui.selected.targets.length < selectTarget[0]) {
                        event.controls.forEach(i => i.close());
                        event.controls = [];
                        if (!ui.selected.targets && !event.forced) {
                            newControls.forEach(i => {
                                if (i == "cancel2") {
                                    var control = ui.create.control([i]);
                                    control.custom = () => {
                                        event.result = {
                                            bool: false,
                                            targets: [],
                                            control: "cancel2",
                                            index: newControls.length,
                                        }
                                        if (event.dialog) event.dialog.close();
                                        event.controls.forEach(i => i.close());
                                        event.players.forEach(target => {
                                            target.classList.remove("selected");
                                            target.unprompt();
                                            target.classList.remove("selectable");
                                            target.classList.remove("unselectable");
                                        })
                                        game.resume();
                                        _status.imchoosing = false;
                                    };
                                    event.controls.add(control);
                                }
                                else if (Array.isArray(i) && i.includes("cancel2")) {
                                    var control = ui.create.control([i]);
                                    control.custom = () => {
                                        if (control == "cancel2") {
                                            event.result = {
                                                bool: false,
                                                control: "cancel2",
                                            }
                                        }
                                        else {
                                            event.result = {
                                                bool: true,
                                                targets: ui.selected.targets,
                                                control: control,
                                                index: newControls.indexOf(i),
                                            }
                                        }
                                        if (event.dialog) event.dialog.close();
                                        event.controls.forEach(i => i.close())
                                        event.players.forEach(target => {
                                            target.classList.remove("selected");
                                            target.unprompt();
                                            target.classList.remove("selectable");
                                            target.classList.remove("unselectable");
                                        })
                                        game.resume();
                                        _status.imchoosing = false;
                                    }
                                    event.controls.add(control);
                                }
                            });
                        }
                        //return;
                    }
                    if (newControls[0] == "unchange") unchange = newControls.shift();
                    if (typeof newControls[0] == "function") change = newControls.shift();
                    newControls.forEach(i => { if (typeof i == "string") i = [i] });
                    if (unchange && event.controls.length && event.controls[0].innerHTML != "<div>取消</div>") {
                        if (change) change(control);
                    }
                    else {
                        event.controls.forEach(i => i.close());
                        event.controls = [];
                        newControls.forEach((i, index) => {
                            var control = ui.create.control(i);
                            control.link = i;
                            control.custom ??= function() {
                                if (this.link != "cancel2" && !ui.selected.targets.length) {
                                    return;
                                }
                                if (this.link == "cancel2") {
                                    event.result = {
                                        bool: false,
                                        control: "cancel2",
                                    }
                                }
                                else {
                                    event.result = {
                                        bool: true,
                                        targets: ui.selected.targets,
                                        control: this.link,
                                        index: index,
                                    }
                                }
                                event.controls.forEach(i => i.close());
                                event.players.forEach(target => {
                                    target.classList.remove("selected");
                                    target.unprompt();
                                    target.classList.remove("selectable");
                                    target.classList.remove("unselectable");
                                })
                                if (event.dialog) event.dialog.close();
                                game.resume();
                                _status.imchoosing = false;
                            }
                            if (change) change(control);
                            event.controls.add(control);
                        });
                        if (!ui.selected.targets.length) {
                            event.controls.forEach(control => {
                                if (control.innerHTML != "<div>取消</div>") {
                                    control.classList.add("disabled");
                                }
                            });
                        } else {
                            event.controls.forEach(control => {
                                if (control.innerHTML == "<div>取消</div>") return;
                                if (event.filter && !event.filter(control, player)) {
                                    control.classList.add("disabled");
                                }
                            });
                        }
                    }
                }
                event.replacecontrols();
                game.pause();
                game.countChoose();
            }
            if (event.isMine()) {
                if (event.hsskill && !event.forced && _status.prehidden_skills.includes(event.hsskill)) {
                    ui.click.cancel();
                    return;
                }
                if (typeof event.dialog == "number") {
                    event.dialog = get.idDialog(event.dialog);
                }
                if (event.createDialog && !event.dialog) {
                    if (Array.isArray(event.createDialog)) {
                        event.createDialog.add("hidden");
                        event.dialog = ui.create.dialog.apply(void 0, event.createDialog);
                    }
                    event.closeDialog = true;
                }
                if (event.dialog == void 0) {
                    event.dialog = ui.dialog;
                }
                if (event.isMine() || event.dialogdisplay) {
                    event.dialog.style.display = "";
                    event.dialog.open();
                }
                chooseTarget(event, player);
            }
            else if (event.isOnline()) {
                event.send();
            } else {
                //考虑中途托管的情况
                event.result = "ai";
            }
        },
        async (event, _trigger, player, result) => {
            //处理ai的选择结果
            if (event.result != "ai") {
                return;
            }
            if (event.processAI) {
                event.result = event.processAI();
            } else if (!event.forced) {
                event.result = { bool: false };
            } else {
                throw `processAI : ${event.getParent().name}"s chooseTargetControl is forced`;
            }
        },
        async (event, _trigger, player, result) => {
            //处理选择的结果
            event.resume();
            if (event.result.bool && event.animate !== false) {
                for (var i = 0; i < event.result.targets.length; i++) {
                    event.result.targets[i].addTempClass("target");
                }
            }
            if (event.controls && event.controls.length) {
                for (var i = 0; i < event.controls.length; i++) {
                    event.controls[i].close();
                }
            }
            if (event.dialog) {
                event.dialog.close();
            }
        }
    ],
};
