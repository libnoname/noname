import { lib, game, ui, get, ai, _status } from "noname";
export default {
    canBeStrengthened: (card, player, event) => {
        event = event || _status.event;
        if (typeof event != "string") {
            event = event.getParent().name;
        }
        if (card?.storage?.mjsstrengthen) return false;
        if (!get.info(card)?.affectable && !get.info("_mjsstrengthen").getList.includes(card.name)) {
            return false;
        }
        return true;
    },
    canBeWeakened: (card, player, event) => {
        event = event || _status.event;
        if (typeof event != "string") {
            event = event.getParent().name;
        }
        if (card?.storage?.mjsweaken) {
            return false;
        }
        if (!get.info(card)?.affectable && !get.info("_mjsweaken").getList.includes(card.name)) {
            return false;
        }
        return true;
    },
    cardDestuctible: (card, player, event) => {
        event = event || _status.event;
        if (typeof event != "string") {
            event = event.getParent().name;
        }
        var mod = game.checkMod(card, player, event, "unchanged", "cardDestuctible", player);
        if (mod != "unchanged") {
            return mod;
        }
        return true;
    },
    cardCombustible: (card, player, event) => {
        event = event || _status.event;
        if (typeof event != "string") {
            event = event.getParent().name;
        }
        var mod = game.checkMod(card, player, event, "unchanged", "cardCombustible", player);
        if (mod != "unchanged") {
            return mod;
        }
        return true;
    },
};
