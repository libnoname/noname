import { get } from "../get/index.js";
import { game } from "../game/index.js";
import { _status } from "../status/index.js";
import { ui } from "../ui/index.js";
import { CacheContext } from "../library/cache/cacheContext.js";
export class Basic {
	/**
	 * @param { (
	 * 	button: Button,
	 * 	buttons?: Button[]
	 * ) => number } check
	 */
	chooseButton(check) {
		const event = _status.event;
		let i, j, range, buttons, buttons2;
		let ok = false,
			forced = event.forced;
		let iwhile = 100;
		while (iwhile--) {
			range = get.select(event.selectButton);
			if (ui.selected.buttons.length >= range[0]) {
				ok = true;
			}
			CacheContext.setCacheContext(new CacheContext());
			CacheContext.setInCacheEnvironment(true);
			if (range[1] <= -1) {
				j = 0;
				for (i = 0; i < ui.selected.buttons.length; i++) {
					j += check(ui.selected.buttons[i]);
				}
				CacheContext.setInCacheEnvironment(false);
				CacheContext.removeCacheContext();
				return j > 0;
			}
			buttons = get.selectableButtons();
			if (buttons.length == 0) {
				CacheContext.setInCacheEnvironment(false);
				CacheContext.removeCacheContext();
				return ok;
			}
			buttons2 = buttons.slice(0);
			let ix = 0;
			let checkix = check(buttons[0], buttons2);
			for (i = 1; i < buttons.length; i++) {
				let checkixtmp = check(buttons[i], buttons2);
				if (checkixtmp > checkix) {
					ix = i;
					checkix = checkixtmp;
				}
			}
			// buttons.sort(function(a,b){
			// 	return check(b,buttons2)-check(a,buttons2);
			// });
			if (check(buttons[ix]) <= 0) {
				if (!forced || ok) {
					CacheContext.setInCacheEnvironment(false);
					CacheContext.removeCacheContext();
					return ok;
				}
			}
			CacheContext.setInCacheEnvironment(false);
			CacheContext.removeCacheContext();
			buttons[ix].classList.add("selected");
			ui.selected.buttons.add(buttons[ix]);
			game.check();
			if (ui.selected.buttons.length >= range[0]) {
				ok = true;
			}
			if (ui.selected.buttons.length == range[1]) {
				return true;
			}
		}
	}
	/**
	 * @param { (
	 * card?: Card,
	 * cards?: Card[]
	 * ) => number } check
	 * @returns { boolean | undefined }
	 */
	chooseCard(check) {
		const event = _status.event;
		if (event.filterCard == undefined) {
			return check() > 0;
		}
		let i, j, range, cards, cards2, skills, effect;
		let ok = false,
			forced = event.forced;
		let iwhile = 100;
		while (iwhile--) {
			range = get.select(event.selectCard);
			if (ui.selected.cards.length >= range[0]) {
				ok = true;
			}
			if (range[1] <= -1) {
				if (ui.selected.cards.length == 0) {
					return true;
				}
				j = 0;
				CacheContext.setCacheContext(new CacheContext());
				CacheContext.setInCacheEnvironment(true);
				for (i = 0; i < ui.selected.cards.length; i++) {
					effect = check(ui.selected.cards[i]);
					if (effect < 0) {
						j -= Math.sqrt(-effect);
					} else {
						j += Math.sqrt(effect);
					}
				}
				CacheContext.setInCacheEnvironment(false);
				CacheContext.removeCacheContext();
				return j > 0;
			}
			cards = get.selectableCards();
			// @ts-expect-error ignore
			if (!_status.event.player._noSkill) {
				// @ts-expect-error ignore
				cards = cards.concat(get.skills());
			}
			if (cards.length == 0) {
				return ok;
			}
			cards2 = cards.slice(0);
			// cards.sort(function(a,b){
			// 	return (check(b,cards2)-check(a,cards2));
			// });
			var ix = 0;
			CacheContext.setCacheContext(new CacheContext());
			CacheContext.setInCacheEnvironment(true);
			var checkix = check(cards[0], cards2);
			for (i = 1; i < cards.length; i++) {
				var checkixtmp = check(cards[i], cards2);
				if (checkixtmp > checkix) {
					ix = i;
					checkix = checkixtmp;
				}
			}
			if (check(cards[ix]) <= 0) {
				if (!forced || ok) {
					CacheContext.setInCacheEnvironment(false);
					CacheContext.removeCacheContext();
					return ok;
				}
			}
			CacheContext.setInCacheEnvironment(false);
			CacheContext.removeCacheContext();
			if (typeof cards[ix] == "string") {
				ui.click.skill(cards[ix]);
				var info = get.info(event.skill);
				if (info.filterCard) {
					check = info.check || get.unuseful2;
					return this.chooseCard(check);
				} else {
					return true;
				}
			} else {
				cards[ix].classList.add("selected");
				ui.selected.cards.add(cards[ix]);
				game.check();
				if (ui.selected.cards.length >= range[0]) {
					ok = true;
				}
				if (ui.selected.cards.length == range[1]) {
					return true;
				}
			}
		}
	}
	/**
	 * @param { (
	 * target?: Player,
	 * targets?: Player[]
	 * ) => number } check
	 */
	chooseTarget(check) {
		const event = _status.event;
		if (event.filterTarget == undefined) {
			return check() > 0;
		}
		let i, j, range, targets, targets2, effect;
		let ok = false,
			forced = event.forced;
		let iwhile = 100;
		while (iwhile--) {
			range = get.select(event.selectTarget);
			if (ui.selected.targets.length >= range[0]) {
				ok = true;
			}
			if (range[1] <= -1) {
				j = 0;
				CacheContext.setCacheContext(new CacheContext());
				CacheContext.setInCacheEnvironment(true);
				for (i = 0; i < ui.selected.targets.length; i++) {
					effect = check(ui.selected.targets[i]);
					if (effect < 0) {
						j -= Math.sqrt(-effect);
					} else {
						j += Math.sqrt(effect);
					}
				}
				CacheContext.setInCacheEnvironment(false);
				CacheContext.removeCacheContext();
				return j > 0;
			} else if (range[1] == 0) {
				return check() > 0;
			}
			targets = get.selectableTargets();
			if (targets.length == 0) {
				return range[0] == 0 || ok;
			}
			targets2 = targets.slice(0);
			// targets.sort(function(a,b){
			// 	return check(b)-check(a);
			// });
			let ix = 0;
			CacheContext.setCacheContext(new CacheContext());
			CacheContext.setInCacheEnvironment(true);
			let checkix = check(targets[0], targets2);
			for (i = 1; i < targets.length; i++) {
				let checkixtmp = check(targets[i], targets2);
				if (checkixtmp > checkix) {
					ix = i;
					checkix = checkixtmp;
				}
			}
			if (check(targets[ix]) <= 0) {
				if (!forced || ok) {
					CacheContext.setInCacheEnvironment(false);
					CacheContext.removeCacheContext();
					return ok;
				}
			}
			CacheContext.setInCacheEnvironment(false);
			CacheContext.removeCacheContext();
			targets[ix].classList.add("selected");
			ui.selected.targets.add(targets[ix]);
			game.check();
			if (ui.selected.targets.length >= range[0]) {
				ok = true;
			}
			if (ui.selected.targets.length == range[1]) {
				return true;
			}
		}
	}
}
