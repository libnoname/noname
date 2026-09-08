import { lib, game, ui, get, ai, _status } from "noname";
export default {
    mjsGetEquipLimit() {
        var num = mjs.maxEquipBase;
        num = game.checkMod(this, num, "maxEquipBase", this);
        num = game.checkMod(this, num, "maxEquip", this);
        num = game.checkMod(this, num, "maxEquipFinal", this);
        return Math.max(0, num);
    },
    mjsExpandEquip() {
        var next = game.createEvent("mjsExpandEquip");
        next.player = this;
        next.num = 1;
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] === "number") {
                next.num = arguments[i];
            }
        }
        next.setContent("mjsExpandEquip");
        return next;
    },
    mjsContractEquip() {
        var next = game.createEvent("mjsContractEquip");
        next.player = this;
        next.num = 1;
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] === "number") {
                next.num = arguments[i];
            }
        }
        next.setContent("mjsContractEquip");
        return next;
    },
    hasMJSEquip() {
        return this.name?.startsWith("mjs") || this.hasSkill("mjsequip");
    },
    mjsStrengthenCards() {
        var next = game.createEvent("mjsStrengthenCards");
        next.player = this;
        for (var i = 0; i < arguments.length; i++) {
            if (get.itemtype(arguments[i]) == "player") {
                next.source = arguments[i];
            }
            else if (get.itemtype(arguments[i]) == "cards") {
                next.cards = arguments[i].slice(0);
            }
            else if (get.itemtype(arguments[i]) == "card") {
                next.cards = [arguments[i]];
            }
            else if (arguments[i] == "notBySelf") {
                next.notBySelf = true;
            }
        }
        if (!next.source) {
            next.source = this;
        }
        if (next.cards) {
            for (var i = 0; i < next.cards.length; i++) {
                if (!lib.filter.canBeStrengthened(next.cards[i])) {
                    next.cards.splice(i--, 1);
                }
            }
        }
        if (!next.cards || !next.cards.length) {
            _status.event.next.remove(next);
            next.resolve();
        }
        next.setContent("mjsStrengthenCards");
        return next;
    },
    mjsWeakenCards() {
        var next = game.createEvent("mjsWeakenCards");
        next.player = this;
        for (var i = 0; i < arguments.length; i++) {
            if (get.itemtype(arguments[i]) == "player") {
                next.source = arguments[i];
            }
            else if (get.itemtype(arguments[i]) == "cards") {
                next.cards = arguments[i].slice(0);
            }
            else if (get.itemtype(arguments[i]) == "card") {
                next.cards = [arguments[i]];
            }
            else if (arguments[i] == "notBySelf") {
                next.notBySelf = true;
            }
        }
        if (!next.source) {
            next.source = this;
        }
        if (next.cards) {
            for (var i = 0; i < next.cards.length; i++) {
                if (!lib.filter.canBeWeakened(next.cards[i])) {
                    next.cards.splice(i--, 1);
                }
            }
        }
        if (!next.cards || !next.cards.length) {
            _status.event.next.remove(next);
            next.resolve();
        }
        next.setContent("mjsWeakenCards");
        return next;
    },
    $chooseToShowCards(cards, target, event, cardsetion) {
        const func = (cards, player, cardsetion) => {
            player.node.chooseToShow ??= ui.create.div(".chooseToShow", player.node.avater);
            const container = player.node.chooseToShow;
            container.replaceChildren();
            player.appendChild(container);
            container.originWidth = container.getBoundingClientRect().width;
            for (const card of cards) {
                const button = ui.create.button(card, "card", player.node.chooseToShow);
                if (cardsetion) {
                    game.createButtonCardsetion(cardsetion, button);
                }
                game.callHook("checkOverflow", [button, container, cards, game]);
            }
            container.show();
        };
        if (event.player == game.me) {
          func(cards, target, cardsetion);
        } else if (event.isOnline()) {
          this.send(func, cards, target, cardsetion);
        }
    },
    $chooseToShowCardsOL(cards) {
        game.broadcastAll(
            (player, cards) => {
                player.node.chooseToShow ??= ui.create.div(".chooseToShow", player.node.avater);
                const container = player.node.chooseToShow;
                container.replaceChildren();
                player.appendChild(container);
                container.originWidth = container.getBoundingClientRect().width;
                for (const card of cards) {
                    const button = ui.create.button(card, "card", player.node.chooseToShow);
                    game.callHook("checkOverflow", [button, container, cards, game]);
                }
                container.show();
            },
            this,
            cards
        );
    },
    $chooseToHideCards() {
        game.broadcast(
            player => {
                if (player.node?.chooseToShow) {
                    player.node?.chooseToShow.hide();
                }
            },
            this
        );
        if (this.node?.chooseToShow) {
            this.node?.chooseToShow.hide();
        }
    },
    $chooseToHideCardsOL() {
        game.broadcastAll(
            player => {
                if (player.node?.chooseToShow) {
                    player.node?.chooseToShow.hide();
                }
            },
            this
        );
    },
    changeGroup2(group, log, broadcast) {
        var next = game.createEvent("changeGroup");
        next.player = this;
        next.log = true;
        for (var i = 0; i < arguments.length; i++) {
            var arg = arguments[i];
            if (lib.group.includes(arg)) {
                next.group = arg;
            } else if (typeof arg === "boolean") {
                next.log = arg;
            } else if (arg === "nobroadcast") {
                next.broadcast = false;
            }
        }
        next.setContent("changeGroup2");
        return next;
    },
    chooseButtonCard_mjs(choose) {
        var next = game.createEvent("chooseButtonCard_mjs");
        next.player = this;
        if (arguments.length == 1) {
            for (var i in choose) {
                next[i] = choose[i];
            }
        }
        if (typeof next.filterButton == "object") {
            next.filterButton = get.filter(next.filterButton);
        }
        if (typeof next.filterCard == "object") {
            next.filterCard = get.filter(next.filterCard, 2);
        }
        if (next.filterButton == undefined || next.filterButton === true) {
            next.filterButton = lib.filter.filterButton;
        }
        if (next.selectButton == undefined) {
            next.selectButton = 1;
        }
        if (next.filterCard == undefined || next.filterCard === true) {
            next.filterCard = lib.filter.all;
        }
        if (next.selectCard == undefined) {
            next.selectCard = 1;
        }
        if (next.ai1 == undefined) {
            next.ai1 = function () {
                return 1;
            };
        }
        if (next.ai2 == undefined) {
            next.ai2 = get.unuseful2;
        }
        if (next.canHidden == undefined) {
            next.canHidden = true;
        }
        next.setContent("chooseButtonCard_mjs");
        next._args = Array.from(arguments);
        return next;
    },
    chooseTargetControl_mjs(params) {
        var next = game.createEvent("chooseTargetControl_mjs")
        next.player = this;
        Object.assign(next, params);
        if (typeof next.filterTarget == "object") {
            next.filterTarget = get.filter(next.filterTarget, 2);
        }
        if (next.filterTarget == void 0 || next.filterTarget === true) {
            next.filterTarget = lib.filter.all;
        }
        if (!next.selectTarget) {
            next.selectTarget = [1, 1];
        }
        if (!next.filterTarget) {
            next.filterTarget = lib.filter.all;
        }
        if (!next.control) {
            next.control = () => ["unchange", "ok"];
        }
        next.setContent("chooseTargetControl_mjs");
        next._args = Array.from(arguments);
        next.forceDie = true;
        return next;
    },
};
