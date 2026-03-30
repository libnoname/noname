import { _status, get, game, lib, ui } from "noname";
export const defaultHooks: {
	[K in keyof NonameHookType]?: NonameHookType[K][];
} = {
	addGroup: [
		function addColor(id, _short, _name, config) {
			if (typeof config.color != "undefined" && config.color != null) {
				let color1, color2, color3, color4;
				if (typeof config.color == "string" && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(config.color)) {
					let c1 = parseInt(`0x${config.color.slice(1, 3)}`);
					let c2 = parseInt(`0x${config.color.slice(3, 5)}`);
					let c3 = parseInt(`0x${config.color.slice(5, 7)}`);
					color1 = color2 = color3 = color4 = [c1, c2, c3, 1];
				} else if (Array.isArray(config.color) && config.color.length == 4) {
					if (config.color.every(item => Array.isArray(item))) {
						color1 = config.color[0];
						color2 = config.color[1];
						color3 = config.color[2];
						color4 = config.color[3];
					} else {
						color1 = color2 = color3 = color4 = config.color;
					}
				}
				if (color1 && color2 && color3 && color4) {
					game.dynamicStyle.addObject({
						[`.player.identity[data-color="${id}"], div[data-nature="${id}"], span[data-nature="${id}"]`]: {
							textShadow: [`black 0 0 1px`, `rgba(${color1.join()}) 0 0 2px`, `rgba(${color2.join()}) 0 0 5px`, `rgba(${color3.join()}) 0 0 10px`, `rgba(${color4.join()}) 0 0 10px`].join(","),
						},
						[`div[data-nature="${id}m"], span[data-nature="${id}m"]`]: {
							textShadow: ["black 0 0 1px", `rgba(${color1.join()}) 0 0 2px`, `rgba(${color2.join()}) 0 0 5px`, `rgba(${color3.join()}) 0 0 5px`, `rgba(${color4.join()}) 0 0 5px`, "black 0 0 1px"].join(","),
						},
						[`div[data-nature="${id}mm"], span[data-nature="${id}mm"]`]: {
							textShadow: ["black 0 0 1px", `rgba(${color1.join()}) 0 0 2px`, `rgba(${color2.join()}) 0 0 2px`, `rgba(${color3.join()}) 0 0 2px`, `rgba(${color4.join()}) 0 0 2px`, "black 0 0 1px"].join(","),
						},
					});
					lib.groupnature[id] = id;
				}
			}
		},
		function addImage(id, _short, _name, config) {
			if (typeof config.image == "string") {
				Reflect.defineProperty(lib.card, `group_${id}`, {
					configurable: true,
					enumerable: false,
					writable: true,
					value: {
						fullskin: true,
						image: config.image,
					},
				});
			}
			lib.translate[`group_${id}`] ??= `${_short}势力`;
		},
	],

	addNature: [
		function addColor(nature, _translation, config) {
			if (typeof config != "object") {
				config = {};
			}
			/**
			 * @type {boolean}
			 */
			// @ts-expect-error ignore
			let linked = config.linked;
			/**
			 * @type {number}
			 */
			// @ts-expect-error ignore
			let order = config.order;
			/**
			 * @type {string}
			 */
			// @ts-expect-error ignore
			let background = config.background;
			/**
			 * @type {number[]}
			 */
			// @ts-expect-error ignore
			let lineColor = config.lineColor;
			if (typeof linked != "boolean") {
				linked = true;
			}
			if (typeof order != "number") {
				order = 0;
			}
			if (typeof background != "string") {
				background = "";
			}
			if (!Array.isArray(lineColor) || lineColor.length != 3) {
				lineColor = [];
			} else if (background.startsWith("ext:")) {
				background = background.replace(/^ext:/, "extension/");
			}
			if (linked) {
				lib.linked.add(nature);
			}
			if (lineColor.length) {
				lib.lineColor.set(nature, lineColor);
			}
			lib.nature.set(nature, order);
			if (background.length > 0) {
				lib.natureBg.set(nature, background);
			}
			if (config.audio) {
				for (let key in config.audio) {
					if (!lib.natureAudio[key]) {
						lib.natureAudio[key] = config.audio[key];
					} else {
						for (let key2 in config.audio[key]) {
							lib.natureAudio[key][key2] = config.audio[key][key2];
						}
					}
				}
			}

			let color1, color2;
			if (typeof config.color == "string" && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(config.color)) {
				let c1 = parseInt(`0x${config.color.slice(1, 3)}`);
				let c2 = parseInt(`0x${config.color.slice(3, 5)}`);
				let c3 = parseInt(`0x${config.color.slice(5, 7)}`);
				color1 = color2 = [c1, c2, c3, 1];
			} else if (Array.isArray(config.color) && config.color.length >= 2 && config.color.length <= 4) {
				if (config.color.every(item => Array.isArray(item))) {
					color1 = config.color[0];
					color2 = config.color[1];
				} else {
					let color = config.color.slice();
					if (color.length == 3) {
						color.push(1);
					}
					color1 = color2 = color;
				}
			}
			if (color1 && color2) {
				let result = {};
				result[`.card.fullskin.${nature}>.name`] = {
					color: `rgba(${color1.join()})`,
					border: `1px solid rgba(${color2.join()})`,
				};
				// @ts-expect-error ignore
				game.dynamicStyle.addObject(result);

				let result2 = {};
				result2[`.tempname.${nature}:not([data-nature])>.span`] = {
					color: `rgba(${color1.join()})`,
				};
				// @ts-expect-error ignore
				game.dynamicStyle.addObject(result2);
			}
		},
	],

	checkBegin: [],

	checkCard: [
		function updateTempname(card, event) {
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
	],

	checkTarget: [
		function updateInstance(target, event) {
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
		function addTargetPrompt(target, event) {
			if (!event.targetprompt2?.length) {
				return;
			}
			const str = event.targetprompt2
				.flatMap(func => func(target) || "")
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
	],
	checkButton: [],

	checkEnd: [
		function autoConfirm(event, { ok, auto, autoConfirm }) {
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
		function createChooseAll(event, _) {
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
	],

	uncheckBegin: [
		function destroyChooseAll(event, _) {
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
	],

	uncheckCard: [
		function removeTempname(card, event) {
			// @ts-expect-error ignore
			if (!card._tempName) {
				return;
			}
			// @ts-expect-error ignore
			card._tempName.delete();
			// @ts-expect-error ignore
			delete card._tempName;
		},
	],

	uncheckTarget: [
		function removeInstance(target, event) {
			// @ts-expect-error ignore
			if (!target.instance) {
				return;
			}
			// @ts-expect-error ignore
			target.instance.classList.remove("selected");
			// @ts-expect-error ignore
			target.instance.classList.remove("selectable");
		},
		function removeTargetPrompt(target, event) {
			if (target.node.prompt2) {
				target.node.prompt2.remove();
				delete target.node.prompt2;
			}
		},
	],

	uncheckButton: [],

	uncheckEnd: [],

	checkOverflow: [
		function updateDialog(itemOption, itemContainer, addedItems, game) {
			//计算压缩折叠的量
			const gap = 3;
			function isEqual(a, b) {
				return Math.abs(a - b) < 3;
			}
			let equal = isEqual(itemContainer.originWidth, itemContainer.getBoundingClientRect().width);
			const L = (itemContainer.originWidth - 2 * gap) * (equal ? 0.8 : 1);
			const W = 90; //这里需要填卡的实际宽度，扩展中需要自行调整。
			// @ts-expect-error ignore
			let n = addedItems.length;
			const r = 16; //为偏移留出的空间，如果r为0，可能会把前面的卡牌全遮住
			if (n * W + (n + 1) * gap < L) {
				itemContainer.style.setProperty("--ml", gap + "px");
				itemContainer.classList.remove("zoom");
			} else {
				const ml = Math.min((n * W - L + gap) / (n - 1), W - r);
				itemContainer.style.setProperty("--ml", "-" + ml + "px");
				itemContainer.classList.add("zoom");
			}
		},
	],
	checkTipBottom: [
		function undateTipBottom(player) {
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
	],

	checkDamage1: [
		function kuanggu(event, player) {
			if (get.distance(event.source, player) <= 1) {
				event.checkKuanggu = true;
			}
		},
		function jyliezhou(event, player) {
			if (event.player.isLinked()) {
				event.checkJyliezhou = true;
			}
		},
	],

	checkDamage2: [],

	checkDamage3: [
		function jiushi(event, player) {
			if (player.isTurnedOver()) {
				event.checkJiushi = true;
			}
		},
	],

	checkDamage4: [],

	checkDie: [],

	checkUpdate: [],

	checkSkillAnimate: [],

	addSkillCheck: [],

	removeSkillCheck: [
		function checkCharge(skill, player) {
			if (player.countCharge(true) < 0) {
				player.removeCharge(-player.countCharge(true));
			}
		},
	],

	refreshSkin: [],
};
