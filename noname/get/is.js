import { _status, lib, game, get, ui } from "noname";
import { userAgentLowerCase, GeneratorFunction, AsyncFunction } from "@/util/index.js";

export class Is {
	/**
	 * 检查对象的某个属性是否是content*(){}/async content(){}/content(){}中的特定形式
	 * @param {{[key: string]: any}} obj 目标对象
	 * @param {string} key 属性名
	 * @returns {boolean} 如果属性值是上述形式的函数定义，则返回true
	 */
	functionMethod(obj, key) {
		const value = obj[key];
		if (!(typeof value === "function")) {
			return false;
		}
		key = key.replaceAll("$", "\\$");
		let reg;
		if (value instanceof GeneratorFunction) {
			// content*(){}
			reg = new RegExp(`\\*\\s*${key}[\\s\\S]*?\\(`);
		} else if (value instanceof AsyncFunction) {
			// async content(){}
			reg = new RegExp(`async\\s*${key}[\\s\\S]*?\\(`);
		} else {
			// content(){}
			reg = new RegExp(`${key}[\\s\\S]*?\\(`);
		}
		return reg.exec(value)?.index === 0;
	}
	/**
	 * @param { string } str
	 * @returns
	 */
	emotion(str) {
		let regExp = /^<img\b(?=[^>]*\bsrc="##assetURL##image\/emotion\/([^"/]+)\/([^"/]+)\.gif")(?=[^>]*\bwidth="50")(?=[^>]*\bheight="50")(?!.*\b(?!src|width|height)\w+=)[^>]*\/?>$/i;
		return regExp.test(str);
	}
	/**
	 * 判断是否为进攻坐骑
	 * @param { Card | VCard } card
	 * @param { false | Player } [player]
	 * @returns { boolean }
	 */
	attackingMount(card, player) {
		const subtype = get.subtype(card, player);
		if (subtype == "equip4") {
			return true;
		} else if (subtype == "equip6") {
			const subtypes = get.subtypes(card, player);
			if (subtypes.includes("equip4")) {
				return true;
			}
			const info = get.info(card, player),
				distance = info.distance;
			if (!distance) {
				return false;
			}
			if (distance.globalFrom && !info.notMount) {
				return true;
			}
		}
		return false;
	}
	/**
	 * 判断是否为防御坐骑
	 * @param { Card | VCard } card
	 * @param { false | Player } [player]
	 * @returns { boolean }
	 */
	defendingMount(card, player) {
		const subtype = get.subtype(card, player);
		if (subtype == "equip3") {
			return true;
		} else if (subtype == "equip6") {
			const subtypes = get.subtypes(card, player);
			if (subtypes.includes("equip3")) {
				return true;
			}
			const info = get.info(card, player),
				distance = info.distance;
			if (!distance) {
				return false;
			}
			if (distance.globalTo && !info.notMount) {
				return true;
			}
		}
		return false;
	}
	/**
	 * 判断坐骑栏是否被合并
	 * @returns { boolean }
	 */
	mountCombined() {
		if (lib.configOL.mount_combine) {
			return lib.configOL.mount_combine;
		} else if (typeof _status.mountCombined != "boolean") {
			_status.mountCombined = lib.config.mount_combine;
		}
		return _status.mountCombined;
	}
	/**
	 * 判断传入的参数的属性是否相同（参数可以为卡牌、卡牌信息、属性等）
	 * @param {...} infos 要判断的属性列表
	 * @param {boolean} every 是否判断每一个传入的属性是否完全相同而不是存在部分相同
	 */
	sameNature() {
		let processedArguments = [],
			every = false;
		Array.from(arguments).forEach(argument => {
			if (typeof argument == "boolean") {
				every = argument;
			} else if (argument) {
				processedArguments.push(argument);
			}
		});
		if (!processedArguments.length) {
			return true;
		}
		if (processedArguments.length == 1) {
			const argument = processedArguments[0];
			if (!Array.isArray(argument)) {
				return false;
			}
			if (!argument.length) {
				return true;
			}
			if (argument.length == 1) {
				return false;
			}
			processedArguments = argument;
		}
		const naturesList = processedArguments.map(card => {
			if (typeof card == "string") {
				return card.split(lib.natureSeparator);
			} else if (Array.isArray(card)) {
				return card;
			}
			return get.natureList(card || {});
		});
		const testingNaturesList = naturesList.slice(0, naturesList.length - 1);
		if (every) {
			return testingNaturesList.every((natures, index) => naturesList.slice(index + 1).every(testingNatures => testingNatures.length == natures.length && testingNatures.every(nature => natures.includes(nature))));
		}
		return testingNaturesList.every((natures, index) => {
			const comparingNaturesList = naturesList.slice(index + 1);
			if (natures.length) {
				return natures.some(nature => comparingNaturesList.every(testingNatures => testingNatures.includes(nature)));
			}
			return comparingNaturesList.every(testingNatures => !testingNatures.length);
		});
	}
	/**
	 * 判断传入的参数的属性是否不同（参数可以为卡牌、卡牌信息、属性等）
	 * @param ...infos 要判断的属性列表
	 * @param every {boolean} 是否判断每一个传入的属性是否完全不同而不是存在部分不同
	 */
	differentNature() {
		let processedArguments = [],
			every = false;
		Array.from(arguments).forEach(argument => {
			if (typeof argument == "boolean") {
				every = argument;
			} else if (argument) {
				processedArguments.push(argument);
			}
		});
		if (!processedArguments.length) {
			return false;
		}
		if (processedArguments.length == 1) {
			const argument = processedArguments[0];
			if (!Array.isArray(argument)) {
				return true;
			}
			if (!argument.length) {
				return false;
			}
			if (argument.length == 1) {
				return true;
			}
			processedArguments = argument;
		}
		const naturesList = processedArguments.map(card => {
			if (typeof card == "string") {
				return card.split(lib.natureSeparator);
			} else if (Array.isArray(card)) {
				return card;
			}
			return get.natureList(card || {});
		});
		const testingNaturesList = naturesList.slice(0, naturesList.length - 1);
		if (every) {
			return testingNaturesList.every((natures, index) => naturesList.slice(index + 1).every(testingNatures => testingNatures.every(nature => !natures.includes(nature))));
		}
		return testingNaturesList.every((natures, index) => {
			const comparingNaturesList = naturesList.slice(index + 1);
			if (natures.length) {
				return natures.some(nature => comparingNaturesList.every(testingNatures => !testingNatures.length || testingNatures.some(testingNature => testingNature != nature)));
			}
			return comparingNaturesList.every(testingNatures => testingNatures.length);
		});
	}
	/**
	 * 判断一张牌是否为连接手牌
	 * @param { Card } card
	 */
	connectedCard(card) {
		return _status.sxrmConnectCards?.includes(card);
	}
	/**
	 * 判断一张牌是否为明置手牌
	 * @param { Card } card
	 */
	shownCard(card) {
		if (!card) {
			return false;
		}

		const gaintag = card.gaintag;
		// TODO: 添加通用前缀处理系统
		return Array.isArray(gaintag) && gaintag.some(tag => {
			if (tag.startsWith("eternal_")) {
				return tag.slice(8).startsWith("visible_");
			}
			return tag.startsWith("visible_");
		});
	}
	/**
	 * 是否是虚拟牌
	 * @param { Card | VCard } card
	 */
	virtualCard(card) {
		return !("cards" in card) || !Array.isArray(card.cards) || card.cards.length === 0;
	}
	/**
	 * 是否是转化牌
	 * @param { Card | VCard } card
	 */
	convertedCard(card) {
		return !card.isCard && "cards" in card && Array.isArray(card.cards) && card.cards.length > 0;
	}
	/**
	 * 是否是实体牌
	 * @param { Card | VCard } card
	 */
	ordinaryCard(card) {
		return card.isCard && "cards" in card && Array.isArray(card.cards) && card.cards.length === 1;
	}
	/**
	 * 押韵判断
	 * @param { string } str1
	 * @param { string } str2
	 */
	yayun(str1, str2) {
		if (str1 == str2) {
			return true;
		}
		let pinyin1 = get.pinyin(str1, false),
			pinyin2 = get.pinyin(str2, false);
		if (!pinyin1.length || !pinyin2.length) {
			return false;
		}
		let pron1 = pinyin1[pinyin1.length - 1],
			pron2 = pinyin2[pinyin2.length - 1];
		if (pron1 == pron2) {
			return true;
		}
		return get.yunjiao(pron1) == get.yunjiao(pron2);
	}
	/**
	 * @param { string } skill 技能id
	 * @param { Player } player 玩家
	 * @returns
	 */
	blocked(skill, player) {
		if (!player.storage.skill_blocker || !player.storage.skill_blocker.length) {
			return false;
		}
		for (let i of player.storage.skill_blocker) {
			if (lib.skill[i] && lib.skill[i].skillBlocker && lib.skill[i].skillBlocker(skill, player)) {
				return true;
			}
		}
		return false;
	}
	/**
	 * 是否是双势力武将
	 * @param { string } name
	 * @param { string[] } [array]
	 * @returns { boolean | string[] }
	 */
	double(name, array) {
		const extraInformation = get.character(name);
		if (extraInformation && extraInformation.doubleGroup && extraInformation.doubleGroup.length > 0) {
			return array ? extraInformation.doubleGroup.slice(0) : true;
		}
		return false;
	}
	/**
	 * Check if the card has a Yingbian condition
	 *
	 * 检测此牌是否具有应变条件
	 * @param { Card | VCard } card
	 */
	yingbianConditional(card) {
		return get.is.complexlyYingbianConditional(card) || get.is.simplyYingbianConditional(card);
	}
	/**
	 * @param { Card | VCard } card
	 */
	complexlyYingbianConditional(card) {
		for (const key of lib.yingbian.condition.complex.keys()) {
			if (get.cardtag(card, `yingbian_${key}`)) {
				return true;
			}
		}
		return false;
	}
	/**
	 * @param { Card | VCard } card
	 */
	simplyYingbianConditional(card) {
		for (const key of lib.yingbian.condition.simple.keys()) {
			if (get.cardtag(card, `yingbian_${key}`)) {
				return true;
			}
		}
		return false;
	}
	/**
	 * Check if the card has a Yingbian effect
	 *
	 * 检测此牌是否具有应变效果
	 *
	 * @param { Card | VCard } card
	 */
	yingbianEffective(card) {
		for (const key of lib.yingbian.effect.keys()) {
			if (get.cardtag(card, `yingbian_${key}`)) {
				return true;
			}
		}
		return false;
	}
	/**
	 * @param { Card | VCard } card
	 */
	yingbian(card) {
		return get.is.yingbianConditional(card) || get.is.yingbianEffective(card);
	}
	/**
	 * @param { string } [substring]
	 */
	emoji(substring) {
		if (substring) {
			const reg = new RegExp("[~#^$@%&!?%*]", "g");
			if (substring.match(reg)) {
				return true;
			}
			for (let i = 0; i < substring.length; i++) {
				const hs = substring.charCodeAt(i);
				if (0xd800 <= hs && hs <= 0xdbff) {
					if (substring.length > 1) {
						const ls = substring.charCodeAt(i + 1);
						const uc = (hs - 0xd800) * 0x400 + (ls - 0xdc00) + 0x10000;
						if (0x1d000 <= uc && uc <= 0x1f77f) {
							return true;
						}
					}
				} else if (substring.length > 1) {
					const ls = substring.charCodeAt(i + 1);
					if (ls == 0x20e3) {
						return true;
					}
				} else {
					if (0x2100 <= hs && hs <= 0x27ff) {
						return true;
					} else if (0x2b05 <= hs && hs <= 0x2b07) {
						return true;
					} else if (0x2934 <= hs && hs <= 0x2935) {
						return true;
					} else if (0x3297 <= hs && hs <= 0x3299) {
						return true;
					} else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030 || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b || hs == 0x2b50) {
						return true;
					}
				}
			}
		}
		return false;
	}
	/**
	 * @param { string } str
	 */
	banWords(str) {
		return get.is.emoji(str) || window.bannedKeyWords?.some(item => str.includes(item));
	}
	/**
	 * @param { GameEvent } event
	 */
	converted(event) {
		return !(event.card && event.card.isCard);
	}
	safari() {
		return userAgentLowerCase.indexOf("safari") != -1 && userAgentLowerCase.indexOf("chrome") == -1;
	}
	/**
	 * @param { (Card | VCard)[]} cards
	 */
	freePosition(cards) {
		return !cards.some(card => !card.hasPosition || card.hasPosition());
	}
	/**
	 * @param { string } name
	 * @param { boolean } item
	 */
	nomenu(name, item) {
		const menus = ["system", "menu"];
		const configs = {
			show_round_menu: lib.config.show_round_menu,
			round_menu_func: lib.config.round_menu_func,
			touchscreen: lib.config.touchscreen,
			swipe_up: lib.config.swipe_up,
			swipe_down: lib.config.swipe_down,
			swipe_left: lib.config.swipe_left,
			swipe_right: lib.config.swipe_right,
			right_click: lib.config.right_click,
			phonelayout: lib.config.phonelayout,
		};
		configs[name] = item;
		if (!configs.phonelayout) {
			return false;
		}
		if (configs.show_round_menu && menus.includes(configs.round_menu_func)) {
			return false;
		}
		if (configs.touchscreen) {
			if (menus.includes(configs.swipe_up)) {
				return false;
			}
			if (menus.includes(configs.swipe_down)) {
				return false;
			}
			if (menus.includes(configs.swipe_left)) {
				return false;
			}
			if (menus.includes(configs.swipe_right)) {
				return false;
			}
		} else {
			if (configs.right_click == "config") {
				return false;
			}
		}
		if (name) {
			setTimeout(function () {
				alert("请将至少一个操作绑定为显示按钮或打开菜单，否则将永远无法打开菜单");
			});
		}
		return true;
	}
	altered(skillName) {
		return false;
	}
	/**
	 * @param { any } obj
	 * @returns { boolean }
	 */
	node(obj) {
		return Object.prototype.toString.call(obj).startsWith("[object HTML");
	}
	/**
	 * @param { any } obj
	 */
	div(obj) {
		return Object.prototype.toString.call(obj) === "[object HTMLDivElement]";
	}
	/**
	 * @param { any } obj
	 */
	map(obj) {
		return Object.prototype.toString.call(obj) === "[object Map]";
	}
	/**
	 * @param { any } obj
	 */
	set(obj) {
		return Object.prototype.toString.call(obj) === "[object Set]";
	}
	/**
	 * @param { any } obj
	 */
	object(obj) {
		return Object.prototype.toString.call(obj) === "[object Object]";
	}
	/**
	 * @overload
	 * @param { Function | number | [number, number] } func
	 * @returns { boolean }
	 */
	singleSelect(func) {
		if (typeof func == "function") {
			return false;
		}
		const select = get.select(func);
		return select[0] == 1 && select[1] == 1;
	}
	/**
	 * @param { string | Player } name
	 */
	jun(name) {
		if (get.mode() == "guozhan") {
			if (name instanceof lib.element.Player) {
				if (name.isUnseen && name.isUnseen(0)) {
					return false;
				}
				name = name.name1;
			}
			if (typeof name == "string" && name.startsWith("gz_jun_")) {
				return true;
			}
		}
		return false;
	}
	versus() {
		return !_status.connectMode && get.mode() == "versus" && _status.mode == "three";
	}
	changban() {
		return get.mode() == "single" && _status.mode == "changban";
	}
	single() {
		return get.mode() == "single" && _status.mode == "normal";
	}
	/**
	 * @param { Player } [player]
	 */
	mobileMe(player) {
		return (game.layout == "mobile" || game.layout == "long") && !game.chess && player && player.dataset.position == "0";
	}
	newLayout() {
		return game.layout != "default";
	}
	phoneLayout() {
		if (!lib.config.phonelayout) {
			return false;
		}
		return game.layout == "mobile" || game.layout == "long" || game.layout == "long2" || game.layout == "nova";
	}
	singleHandcard() {
		return game.singleHandcard || game.layout == "mobile" || game.layout == "long" || game.layout == "long2" || game.layout == "nova";
	}
	/**
	 * @param { Player } player
	 */
	linked2(player) {
		if (game.chess) {
			return true;
		}
		if (lib.config.link_style2 != "rotate") {
			return true;
		}
		// if(game.chess) return false;
		if (game.layout == "long" || game.layout == "long2" || game.layout == "nova") {
			return true;
		}
		if (player.dataset.position == "0") {
			return ui.arena.classList.contains("oblongcard");
		}
		return false;
	}
	/**
	 * @param { {} } obj
	 */
	empty(obj) {
		return Object.keys(obj).length == 0;
	}
	/**
	 * @param { string } str
	 * @returns { str is "h" | "e" | "j" | "he" | "hej" | "ej" | "hj" }
	 */
	pos(str) {
		return str == "h" || str == "e" || str == "j" || str == "he" || str == "hj" || str == "ej" || str == "hej";
	}
	/**
	 * @param { string } skill
	 * @param { Player } player
	 * @returns
	 */
	locked(skill, player) {
		const info = lib.skill[skill];
		if (!info) {
			return false;
		}
		if (typeof info.locked == "function") {
			return info.locked(skill, player);
		}
		if (info.locked == false) {
			return false;
		}
		if (info.trigger && info.forced) {
			return true;
		}
		if (info.mod) {
			return true;
		}
		if (info.locked) {
			return true;
		}
		return false;
	}
	/**
	 * @param { string } skill
	 * @param { Player } player
	 * @returns
	 */
	zhuanhuanji(skill, player) {
		const info = get.info(skill),
			{ zhuanhuanji } = info;
		if ("zhuanhuanji2" in info) {
			const { zhuanhuanji2 } = info;
			if (typeof zhuanhuanji2 === "function") {
				return Boolean(zhuanhuanji2(skill, player));
			}
			return Boolean(zhuanhuanji2);
		}
		return Boolean(zhuanhuanji);
	}

	/**
	 * 检查指定玩家的名称的子串是否包含指定字符串
	 *
	 * @author tangXins
	 * @param {Player} player
	 * @param {string} name
	 * @returns {boolean}
	 */
	playerNames(player, name) {
		return get.nameList(player).some(namex => namex.startsWith(name));
	}
}
