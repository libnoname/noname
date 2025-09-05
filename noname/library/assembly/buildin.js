import { lib } from "../index.js";
import { ui } from "../../ui/index.js";
import { get } from "../../get/index.js";
import { _status } from "../../status/index.js";
import { game } from "../../game/index.js";

/**
 * @type {(NonameAssemblyType["checkBegin"])}
 *
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 */
export const checkBegin = {};

/**
 * @type {(NonameAssemblyType["checkCard"])}
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 */
export const checkCard = {
	updateTempname(card, event) {
		if (lib.config.cardtempname === "off") {
			return;
		}
		if (get.name(card) === card.name && get.is.sameNature(get.nature(card), card.nature, true)) {
			return;
		}
		const node = ui.create.cardTempName(card);
		if (lib.config.cardtempname !== "default") {
			node.classList.remove("vertical");
		}
	},
};

/**
 * @type {(NonameAssemblyType["checkTarget"])}
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 */
export const checkTarget = {
	updateInstance(target, event) {
		// @ts-expect-error ignore
		if (!target.instance) {
			return;
		}
		["selected", "selectable"].forEach(className => {
			if (target.classList.contains(className)) {
				// @ts-expect-error ignore
				target.instance.classList.add(className);
			} else {
				// @ts-expect-error ignore
				target.instance.classList.remove(className);
			}
		});
	},
	addTargetPrompt(target, event) {
		if (!event.targetprompt2?.length) {
			return;
		}
		const str = event.targetprompt2
			.map(func => func(target) || "")
			.flat()
			.filter(prompt => prompt.length)
			.toUniqued()
			.join("<br>");
		let node;
		if (target.node.prompt2) {
			node = target.node.prompt2;
			node.innerHTML = "";
			node.className = "damage normal-font damageadded";
		} else {
			node = ui.create.div(".damage.normal-font", target);
			target.node.prompt2 = node;
			ui.refresh(node);
			node.classList.add("damageadded");
		}
		node.innerHTML = str;
		node.dataset.nature = "soil";
	},
};

/**
 * @type {(NonameAssemblyType["checkButton"])}
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 */
export const checkButton = {};

/**
 * @type {(NonameAssemblyType["checkEnd"])}
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 */
export const checkEnd = {
	autoConfirm(event, { ok, auto, autoConfirm }) {
		if (!event.isMine()) {
			return;
		}
		const skillinfo = get.info(event.skill) || {};
		// @ts-expect-error ignore
		if (ok && auto && (autoConfirm || skillinfo.direct) && !_status.touchnocheck && !_status.mousedown && (!_status.mousedragging || !_status.mouseleft)) {
			if (ui.confirm) {
				ui.confirm.close();
			}
			// @ts-expect-error ignore
			if (event.skillDialog === true) {
				event.skillDialog = false;
			}
			ui.click.ok();
			// @ts-expect-error ignore
			_status.mousedragging = null;
			if (skillinfo.preservecancel) {
				ui.create.confirm("c");
			}
		}
	},
	createChooseAll(event, _) {
		// 如果配置中关闭了那么就不生效哦喵
		if (!lib.config.choose_all_button) {
			return;
		}
		// 仅在chooseToUse里面生效喵
		if (event.name === "chooseToUse" && event.isMine() && !(event.cardChooseAll instanceof lib.element.Control)) {
			// 判断技能是否可以使用全选按钮喵
			const skill = event.skill;
			if (!skill || !get.info(skill)) {
				return;
			}
			const info = get.info(skill);
			if (!info.filterCard || !info.selectCard) {
				return;
			}
			if (info.complexSelect || info.complexCard || !info.allowChooseAll) {
				return;
			}
			// 调用函数创建全选按钮喵
			ui.create.cardChooseAll();
		}
	},
};

/**
 * @type {(NonameAssemblyType["uncheckBegin"])}
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 */
export const uncheckBegin = {
	destroyChooseAll(event, _) {
		// 如果配置中关闭了那么就不生效哦喵
		if (!lib.config.choose_all_button) {
			return;
		}
		// 仅在chooseToUse里面生效喵
		if (event.name !== "chooseToUse") {
			return;
		}
		// 清理全选按钮喵
		if (event.cardChooseAll instanceof lib.element.Control) {
			event.cardChooseAll.close();
			delete event.cardChooseAll;
		}
	},
};

/**
 * @type {(NonameAssemblyType["uncheckCard"])}
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 */
export const uncheckCard = {
	removeTempname(card, event) {
		// @ts-expect-error ignore
		if (!card._tempName) {
			return;
		}
		// @ts-expect-error ignore
		card._tempName.delete();
		// @ts-expect-error ignore
		delete card._tempName;
	},
};

/**
 * @type {(NonameAssemblyType["uncheckTarget"])}
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 */
export const uncheckTarget = {
	removeInstance(target, event) {
		// @ts-expect-error ignore
		if (!target.instance) {
			return;
		}
		// @ts-expect-error ignore
		target.instance.classList.remove("selected");
		// @ts-expect-error ignore
		target.instance.classList.remove("selectable");
	},
	removeTargetPrompt(target, event) {
		if (target.node.prompt2) {
			target.node.prompt2.remove();
			delete target.node.prompt2;
		}
	},
};

/**
 * @type {(NonameAssemblyType["uncheckButton"])}
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 */
export const uncheckButton = {};

/**
 * @type {(NonameAssemblyType["uncheckEnd"])}
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 */
export const uncheckEnd = {};

/**
 * @type {(NonameAssemblyType["checkOverflow"])}
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 */
export const checkOverflow = {
	updateDialog(itemOption, itemContainer, addedItems, game) {
		//计算压缩折叠的量
		const gap = 3;
		// @ts-expect-error ignore
		function isEqual(a, b) {
			return Math.abs(a - b) < 3;
		}
		let equal = isEqual(itemContainer.originWidth, itemContainer.getBoundingClientRect().width);
		const L = (itemContainer.originWidth - 2 * gap) * (equal ? 0.8 : 1);
		// @ts-expect-error ignore
		const W = 90; //这里需要填卡的实际宽度，扩展中需要自行调整。
		// @ts-expect-error ignore
		let n = addedItems.length;
		const r = 16; //为偏移留出的空间，如果r为0，可能会把前面的卡牌全遮住
		if (n * W + (n + 1) * gap < L) {
			itemContainer.style.setProperty("--ml", gap + "px");
			itemContainer.classList.remove("zoom");
		} else {
			// @ts-expect-error ignore
			const ml = Math.min((n * W - L + gap) / (n - 1), W - r);
			itemContainer.style.setProperty("--ml", "-" + ml + "px");
			itemContainer.classList.add("zoom");
		}
	},
};
/**
 * @type {(NonameAssemblyType["checkTipBottom"])}
 */
export const checkTipBottom = {
	undateTipBottom(player) {
		if (!player.node.tipContainer) {
			return;
		}
		if ((lib.config.layout == "mobile" || lib.config.layout == "long") && player.dataset.position == "0") {
			player.style.removeProperty("--bottom");
		} else {
			//如果全是空的装备栏
			if (Array.from(player.node.equips.children).every(e => e.classList.contains("emptyequip"))) {
				player.style.removeProperty("--bottom");
			} else {
				let eqipContainerTop = player.node.equips.offsetTop;
				let equipTop = 0;
				for (let equip of Array.from(player.node.equips.children)) {
					if (!equip.classList.contains("emptyequip")) {
						equipTop = equip.offsetTop;
						break;
					}
				}
				let top = equipTop + eqipContainerTop;
				const bottom = player.getBoundingClientRect().height - top;
				player.style.setProperty("--bottom", bottom + "px");
			}
		}
	},
};

/**
 * @type {(NonameAssemblyType["checkDamage1"])}
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 */
export const checkDamage1 = {
	kuanggu(event, player) {
		// @ts-expect-error ignore
		if (get.distance(event.source, player) <= 1) {
			event.checkKuanggu = true;
		}
	},
	jyliezhou(event, player) {
		// @ts-expect-error ignore
		if (event.player.isLinked()) {
			event.checkJyliezhou = true;
		}
	},
};

/**
 * @type {(NonameAssemblyType["checkDamage2"])}
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 */
export const checkDamage2 = {};

/**
 * @type {(NonameAssemblyType["checkDamage3"])}
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 */
export const checkDamage3 = {
	jiushi(event, player) {
		// @ts-expect-error ignore
		if (player.isTurnedOver()) {
			event.checkJiushi = true;
		}
	},
};

/**
 * @type {(NonameAssemblyType["checkDamage4"])}
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 * 要加接口去node_modules/@types/noname-typings/NonameAssemblyType.d.ts里把类型补了
 */
export const checkDamage4 = {};

/**
 * @type {(NonameAssemblyType["checkDie"])}
 */
export const checkDie = {};

/**
 * @type {(NonameAssemblyType["checkUpdate"])}
 */
export const checkUpdate = {};

/**
 * @type {(NonameAssemblyType["checkSkillAnimate"])}
 */
export const checkSkillAnimate = {};

export const addSkillCheck = {};

export const removeSkillCheck = {
	checkCharge(skill, player) {
		if (player.countCharge(true) < 0) {
			player.removeCharge(-player.countCharge(true));
		}
	},
};

export const refreshSkin = {};
