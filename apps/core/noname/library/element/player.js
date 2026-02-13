import { _status, get, lib, game, ai, ui } from "noname";
import { CacheContext } from "../cache/cacheContext.js";
import { ChildNodesWatcher } from "../cache/childNodesWatcher.js";
import { security } from "@/util/sandbox.js";
import { ContentCompiler } from "./gameEvent.js";
import { AsyncFunction } from "@/util/index.js";
import dedent from "dedent";

export class Player extends HTMLDivElement {
	/**
	 * @param {HTMLDivElement|DocumentFragment} [position]
	 */
	// @ts-expect-error ignore

	constructor(position) {
		if (position instanceof Player) {
			const other = position;
			[position] = other._args;
		}
		/**
		 * @type {this}
		 */
		// @ts-expect-error ignore
		const player = ui.create.div(".player", position);
		Object.setPrototypeOf(player, (lib.element.Player || Player).prototype);
		// @ts-expect-error ignore
		player._args = [position];
		return player;
	}
	build(noclick) {
		let player = this;
		player.buildNode();
		player.buildProperty();
		player.buildExtra();
		player.buildEventListener(noclick);
		return this;
	}
	buildNode() {
		let player = this;
		/** @type { Record<string, HTMLDivElement> } */
		const node = (player.node = {
			avatar: ui.create.div(".avatar", player, ui.click.avatar).hide(),
			avatar2: ui.create.div(".avatar2", player, ui.click.avatar2).hide(),
			turnedover: ui.create.div(".turned", "<div>翻面<div>", player),
			framebg: ui.create.div(".framebg", player),
			intro: ui.create.div(".intro", player),
			identity: ui.create.div(".identity", player),
			hp: ui.create.div(".hp", player),
			name: ui.create.div(".name", player),
			name2: ui.create.div(".name.name2", player),
			nameol: ui.create.div(".nameol", player),
			count: ui.create.div(".count", player).hide(),
			equips: ui.create.div(".equips", player).hide(),
			judges: ui.create.div(".judges", player),
			marks: ui.create.div(".marks", player),
			chain: ui.create.div(".chain", "<div></div>", player),
			handcards1: ui.create.div(".handcards"),
			handcards2: ui.create.div(".handcards"),
			expansions: ui.create.div(".expansions"),
		});
		player.node.handcards1._childNodesWatcher = new ChildNodesWatcher(player.node.handcards1);
		player.node.handcards2._childNodesWatcher = new ChildNodesWatcher(player.node.handcards2);
		let observer = new MutationObserver(mutationsList => {
			for (let mutation of mutationsList) {
				if (mutation.type === "childList") {
					const addedNodes = Array.from(mutation.addedNodes);
					const removedNodes = Array.from(mutation.removedNodes);
					// @ts-expect-error ignore
					if (
						addedNodes.some(card => !card.classList.contains("emptyequip")) ||
						// @ts-expect-error ignore
						removedNodes.some(card => !card.classList.contains("emptyequip"))
					) {
						player.$handleEquipChange();
					}
				}
			}
		});
		const config = { childList: true };
		observer.observe(node.equips, config);
		node.expansions.style.display = "none";
		const chainLength = game.layout == "default" ? 64 : 40;
		for (let repetition = 0; repetition < chainLength; repetition++) {
			ui.create.div(node.chain.firstChild, ".cardbg").style.transform = `translateX(${repetition * 5 - 5}px)`;
		}
		node.action = ui.create.div(".action", node.avatar);
	}
	buildExtra() {
		let player = this;
		let node = player.node;
		node.link = player.mark(" ", {
			mark: get.linkintro,
		});
		// @ts-expect-error ignore
		node.link.firstChild.setBackgroundImage("image/card/tiesuo_mark.png");
		// @ts-expect-error ignore
		node.link.firstChild.style.backgroundSize = "cover";
		ui.create.div(node.identity);
	}
	buildProperty() {
		let player = this;
		player.phaseNumber = 0;
		player.skipList = [];
		player.skills = [];
		player.invisibleSkills = [];
		player.initedSkills = [];
		player.additionalSkills = {};
		player.disabledSkills = {};
		player.hiddenSkills = [];
		player.awakenedSkills = [];
		player.forbiddenSkills = {};
		player.popups = [];
		player.damagepopups = [];
		player.judging = [];
		player.extraEquip = [];
		player.stat = [
			{
				card: {},
				skill: {},
				triggerSkill: {},
			},
		];
		player.actionHistory = [
			{
				useCard: [],
				respond: [],
				skipped: [],
				lose: [],
				gain: [],
				sourceDamage: [],
				damage: [],
				custom: [],
				useSkill: [],
			},
		];
		player.tempSkills = {};
		player.storage = {
			counttrigger: new Proxy(
				{},
				{
					get(_, prop) {
						return player.getStat("triggerSkill")[prop];
					},
					set(_, prop, value) {
						player.getStat("triggerSkill")[prop] = value;
						return true;
					},
					deleteProperty(_, prop) {
						delete player.getStat("triggerSkill")[prop];
						return true;
					},
					has(_, prop) {
						return prop in player.getStat("triggerSkill");
					},
					ownKeys() {
						return Reflect.ownKeys(player.getStat("triggerSkill"));
					},
					getOwnPropertyDescriptor(_, prop) {
						return Object.getOwnPropertyDescriptor(player.getStat("triggerSkill"), prop);
					},
				}
			),
		};
		player.marks = {};
		player.expandedSlots = {};
		player.disabledSlots = {};
		player.ai = {
			friend: [],
			enemy: [],
			neutral: [],
			handcards: {
				global: [],
				source: [],
				viewed: [],
			},
		};
		player.queueCount = 0;
		player.outCount = 0;
		//TODO: 添加对应的typedef
		player.vcardsMap = {
			handcards: [],
			equips: [],
			judges: [],
		};
	}
	buildEventListener(noclick) {
		let player = this;
		let node = player.node;
		if (noclick) {
			player.noclick = true;
		} else {
			player.addEventListener(lib.config.touchscreen ? "touchend" : "click", ui.click.target);
			node.identity.addEventListener(lib.config.touchscreen ? "touchend" : "click", ui.click.identity);
			if (lib.config.touchscreen) {
				player.addEventListener("touchstart", ui.click.playertouchstart);
				player.addEventListener("touchmove", ui.click.playertouchmove);
			}
		}
	}
	/** @type { Record<string, HTMLDivElement> } */
	// eslint-disable-next-line no-unreachable
	node;
	/**
	 * @type { number }
	 */
	phaseNumber;
	/**
	 * @type { string[] }
	 */
	skipList;
	/**
	 * @type { Array<[string,string,Function|undefined]> }
	 */
	extraEquip;
	/**
	 * @type { string[] }
	 */
	skills;
	/**
	 * @type { string[] }
	 */
	invisibleSkills;
	/**
	 * @type { string[] }
	 */
	initedSkills;
	/**
	 * @type { Record<string, string[]> }
	 */
	additionalSkills;
	/**
	 * @type { Record<string, string[]> }
	 */
	disabledSkills;
	/**
	 * @type { string[] }
	 */
	hiddenSkills;
	/**
	 * @type { string[] }
	 */
	awakenedSkills;
	/**
	 * @type { Record<string, string[]> }
	 */
	forbiddenSkills;
	/**
	 * @type { any[] }
	 */
	popups;
	/**
	 * @type { any[] }
	 */
	damagepopups;
	/**
	 * @type { Card[] }
	 */
	judging;
	/**
	 * @type {Stat[]}
	 */
	stat;
	/**
	 * 玩家的行动历史，每个回合对应一个历史。
	 * @type { ActionHistory[] }
	 */
	actionHistory;
	/**
	 * @type { Record<string, string[]> }
	 */
	tempSkills;
	/**
	 * @type { Record<string, any> }
	 */
	storage;
	/**
	 * @type { Record<string, HTMLDivElement> }
	 */
	marks;
	/**
	 * @type { Record<string, number> }
	 */
	expandedSlots;
	/**
	 * @type { Record<string, number> }
	 */
	disabledSlots;
	/**
	 * @type { {
	 * 	friend: [],
	 * 	enemy: [],
	 * 	neutral: [],
	 * 	shown?: number,
	 * 	handcards?: {
	 * 		global: [],
	 * 		source: [],
	 * 		viewed: []
	 * 	}
	 * } }
	 */
	ai;
	/**
	 * @type { number }
	 */
	queueCount;
	/**
	 * @type { number }
	 */
	outCount;
	/**
	 * @type { number }
	 */
	maxHp;
	/**
	 * @type { number }
	 */
	hp;
	/**
	 * @type { number }
	 */
	hujia;
	/**
	 * @type { number }
	 */
	seatNum;
	/**
	 * @type { Player }
	 */
	nextSeat;
	/**
	 * @type { Player }
	 */
	next;
	/**
	 * @type { Player }
	 */
	previousSeat;
	/**
	 * @type { Player }
	 */
	previous;
	/**
	 * @type { string }
	 */
	name;
	/**
	 * @type { string }
	 */
	name1;
	/**
	 * @type { string }
	 */
	name2;
	/**
	 * @type { any[] }
	 */
	tempname;
	/**
	 * @type { string }
	 */
	junName;
	/**
	 * @type { string }
	 */
	skinPath;
	/**
	 * @type { string }
	 */
	sex;
	/**
	 * @type { string }
	 */
	group;
	/**
	 * @type { ((player: this) => any)[] }
	 */
	inits;
	/**
	 * @type { ((player: this) => any)[] }
	 */
	_inits;
	/**
	 * @type { boolean }
	 */
	isZhu;
	/**
	 * @type { string }
	 */
	identity;
	/**
	 * @type { boolean | undefined }
	 */
	identityShown;
	/**
	 * @type { boolean }
	 */
	removed;
	/**
	 * @type {Map<string,HTMLDivElement>}
	 */
	tips;

	/**
	 * 添加视为装备
	 * @param {string} skill 视为装备的技能
	 * @param {Array<string>|string} equip 视为装备的牌名
	 * @param {boolean} replace 是否清除该skill原有视为装备
	 * @param {Function} [preserve] 视为装备的条件,用于八阵类视为装备
	 */
	addExtraEquip(skill, equip, replace = false, preserve) {
		const player = this;
		if (replace) {
			player.removeExtraEquip(skill);
		}
		let list;
		if (typeof equip == "string") {
			list = [[skill, equip, preserve]];
		} else {
			list = equip.map(card => [skill, card, preserve]);
		}
		player.extraEquip.addArray(list);
		player.$handleEquipChange();
		game.broadcast(
			(player, list) => {
				player.extraEquip.addArray(list);
				player.$handleEquipChange();
			},
			player,
			list
		);
	}

	/**
	 * 移除视为装备
	 * @param {string} skill 移除的技能
	 * @param {Array<string>|string} equip 移除的装备
	 */
	removeExtraEquip(skill, equip = "noequip") {
		const player = this;
		let equips;
		if (equip != "noequip") {
			equip = typeof equip == "string" ? [equip] : equip;
			equips = player.extraEquip.filter(info => info[0] != skill || !equip.includes(info[1]));
		} else {
			equips = player.extraEquip.filter(info => info[0] != skill);
		}
		player.extraEquip = equips;
		player.$handleEquipChange();
		game.broadcast(
			(player, equips) => {
				player.extraEquip = equips;
				player.$handleEquipChange();
			},
			player,
			equips
		);
	}

	/**
	 * 是否拥有对应战法
	 * @param {string} id 战法的id
	 */
	hasZhanfa(id) {
		return this.getStorage("zhanfa").includes(id);
	}
	/**
	 * 获得对应战法
	 * @param {string} id 战法的id
	 */
	addZhanfa(id) {
		const skill = lib.zhanfa.getSkill(id);
		if (!skill) {
			console.warn(`不存在战法: ${id}`);
			return;
		}
		this.addAdditionalSkill("zhanfa", skill, true);
		this.markAuto("zhanfa", id);
		game.log(this, "获得战法", `#g【${get.translation(id)}】`);
	}
	/**
	 * 失去对应战法
	 * @param {string} id 战法的id
	 */
	removeZhanfa(id) {
		const skill = lib.zhanfa.getSkill(id);
		if (!skill) {
			console.warn(`不存在战法: ${id}`);
			return;
		}
		this.removeAdditionalSkill("zhanfa", skill);
		this.unmarkAuto("zhanfa", id);
		game.log(this, "失去战法", `#g【${get.translation(id)}】`);
	}
	/**
	 * 获取一名角色的名字翻译
	 * @param {boolean} forDialog 是否用于对话框显示，如【五谷丰登】/【惠民】之类多名角色选择卡牌的卡牌/技能的content中，方便知晓卡牌和角色的对应关系。默认为false。
	 * @returns { string } 角色名字翻译，forDialog为true会返回HTML字符串，为对话框中的卡牌呈现类似卡牌动画信息的效果，否则根据player._tempTranslate、lib.translate[`${player.name}_ab`]、get.translation(player.name)的优先级返回纯文本。
	 */
	getName(forDialog = false) {
		const { name } = this;
		let playername, hasTempTranslate;
		if (this._tempTranslate) {
			playername = this._tempTranslate;
			hasTempTranslate = true;
		} else if (lib.translate[`${name}_ab`]) {
			playername = lib.translate[`${name}_ab`];
		} else {
			playername = get.translation(name);
		}
		if (!forDialog) {
			return playername;
		} else {
			const SeatNum = this.getSeatNum();
			const addSeat = game.hasPlayer2(current => current != this && current.getName() == playername, true) && typeof SeatNum == "number";
			const border = get.groupnature(get.bordergroup(name));
			return `<span style="font-weight:560"><span data-nature=${border}><span style="letter-spacing:0.1em">${!hasTempTranslate ? get.slimName(name) : playername}${addSeat ? `[${SeatNum}]` : ""}</span></span><br/><span style="color:#FFD700">`;
		}
	}
	/**
	 * 玩家（或某张牌）能否响应某个useCard事件的牌，目前仅支持本体部分常用的卡牌，需要添加新卡牌的可以到lib.respondMap按格式添加
	 * 请注意，该函数只能粗略判断，有些情况是没法判断的
	 * @param {GameEvent} event 需要判断能否响应的事件，目前只能为useCard或者它的下一级衍生事件，其他全部返回undefined
	 * @param { Card | VCard | object | string } card 需要检测的牌
	 * @param { string | boolean } [type] 响应什么类型，默认使用。"use": 使用 / "respond": 打出 / "all": 全部，true
	 * @returns { boolean | undefined }
	 */
	canRespond(event, card, type) {
		const player = this;
		if (!event.name?.startsWith("useCard")) {
			return;
		}
		const evt = event.name == "useCard" ? event : event.getParent();
		if (!evt || !evt.card) {
			return;
		}
		if (card && typeof card == "string") {
			card = { name: card };
		}
		if (typeof type !== "string") {
			type = type ? "all" : "use";
		}
		const keys = get.canRespond(evt.card);
		if (get.type(evt?.card) == "trick") {
			keys.addArray(get.canRespond("trick"));
		}
		if (get.tag(evt?.card, "damage")) {
			keys.addArray(get.canRespond("damage"));
		}
		keys.addArray(get.canRespond("all"));
		if (card) {
			return keys.some(key => (typeof key == "function" ? key(card, player) : key == get.name(card, player)));
		}
		const evtx = get.event();
		let evtNames =
			typeof type !== "string" || type === "all"
				? ["chooseToUse", "chooseToRespond"]
				: ["chooseTo" + type.slice(0, 1).toUpperCase() + type.slice(1)];
		const cards = player.getCards("hs", card => {
			if (type === "all") {
				return true;
			}
			return evtNames.some(evtName => {
				let evty = evtx.getParent(evtName);
				if (get.itemtype(evt) !== "event") {
					evty = evtx;
				}
				if (type === "respond") {
					return lib.filter.cardRespondable(card, player, evty);
				}
				return lib.filter.cardEnabled(card, player, evty);
			});
		});
		return (
			keys.some(key => (typeof key == "function" ? cards.some(card => key(card, player)) : player.hasUsableCard(name, type))) &&
			!evt.directHit.includes(player)
		);
	}
	/**
	 * 设置提示文字，有则更改，无则加之。
	 * @param {string} index 给标记起一个名字，名字任意
	 * @param {string} message 设置提示标记的内容,标记中的\n代表换行符
	 * @param { SkillTrigger | SAAType<Signal> | boolean } isTemp 是否是临时的tip。默认为false,表示一直存在；若为true,则回合结束自动失去。也可以填一个具体的自定义时机。
	 * @param { object } [css] 自定义的样式
	 * @returns { void }
	 * @author Curpond
	 */
	addTip(index, message, isTemp = false, css = {}) {
		const player = this;
		if (player.getHiddenSkills(true, true).includes(index)) {
			return;
		}
		game.broadcastAll(
			(player, index, message, css) => {
				player.node.tipContainer ??= ui.create.div(".tipContainer", player);
				player.tips ??= new Map();
				if (!player.tips.has(index)) {
					player.tips.set(index, ui.create.div(".tip", player.node.tipContainer));
				}
				player.tips.get(index).innerHTML = message
					.replace(/ /g, "&nbsp;")
					.replace(/(?:♥︎|♦︎)/g, '<span style="color: red; ">$&</span>')
					.replace(/\n/g, "<br>");
				player.tips.get(index).css(css);

				let double = player.classList.contains("fullskin2") && lib.config.layout !== "long2";

				const width = player.node.avatar.clientWidth;
				let w = width * (double ? 2 : 1);
				player.style.setProperty("--w", `${w}px`);

				//检查tip的高度，使其不覆盖装备
				game.callHook("checkTipBottom", [player]);
			},
			player,
			index,
			message,
			css
		);
		if (isTemp && !player.storage[`temp_tip_${index}`]) {
			player.storage[`temp_tip_${index}`] = true;
			let expire;
			if (isTemp === true) {
				expire = { global: ["phaseAfter", "phaseBeforeStart"] };
			} else if (typeof isTemp == "string" || Array.isArray(isTemp)) {
				expire = { global: isTemp };
			}
			player
				.when(expire, false)
				.assign({
					firstDo: true,
					priority: Infinity,
				})
				.step(async (event, trigger, player) => {
					delete player.storage[`temp_tip_${index}`];
					player.removeTip(index);
				})
				.finish();
		}
	}
	/**
	 * 清除标记，不传参数可以清空所有标记
	 * @param {string} [index] 标记的名字，不传则清空所有标记
	 * @author Curpond
	 */
	removeTip(index) {
		game.broadcastAll(
			(player, index) => {
				if (index == undefined) {
					player.tips?.clear();
				} else {
					if (player.tips?.has(index)) {
						player.tips.get(index).remove();
						player.tips.delete(index);
					}
				}
				if (!player.tips?.size) {
					player.node.tipContainer?.remove();
					delete player.node.tipContainer;
				}
			},
			this,
			index
		);
	}
	//新函数
	/**
	 * 怒气
	 * @param { number } amount
	 * @param { boolean } [limit]
	 */
	changeFury(amount, limit) {
		if (typeof this.storage.stratagem_fury != "number") {
			this.storage.stratagem_fury = 0;
		}
		if (!amount) {
			return;
		}
		const furyBefore = this.storage.stratagem_fury;
		if (limit === true && typeof _status.stratagemFuryMax == "number") {
			this.storage.stratagem_fury = Math.min(Math.max(furyBefore + amount, 0), _status.stratagemFuryMax);
		} else {
			this.storage.stratagem_fury = Math.max(furyBefore + amount, 0);
		}
		const difference = this.storage.stratagem_fury - furyBefore;
		if (!difference) {
			return;
		}
		game.log(this, difference > 0 ? "获得了" : "失去了", get.cnNumber(Math.abs(difference)), "点", "#r怒气");
		this.markSkill("stratagem_fury");
	}
	/**
	 *
	 * 链式创建一次性的API。
	 *
	 * 使用者只需关注技能的效果，而不是技能本身
	 *
	 *  @example
	 * when('xxx') when([xxx1,xxx2])//均会被解析为：player:xxx或player:[xxx1,xxx2]
	 *
	 * when({player:xxx})或when({global:[xxx]})//对象类型将直接应用
	 * @param {Signal[]|Signal|SkillTrigger} triggerName 时机
	 * @param {boolean} [instantlyAdd] 自动`addSkill`。如果技能是`firstDo`或`lastDo`，请设为`false`并手动调用`.finish()`
	 * @returns {When}
	 */
	when(triggerName, instantlyAdd = true) {
		const player = this;
		if (!_status.postReconnect.player_when) {
			_status.postReconnect.player_when = [
				function (map) {
					"use strict";
					for (let i in map) {
						lib.skill[i] = {
							charlotte: true,
							forced: true,
							popup: false,
						};
						if (typeof map[i] == "string") {
							lib.translate[i] = map[i];
						}
					}
				},
				{},
			];
		}
		let trigger;
		if (Array.isArray(triggerName) || typeof triggerName == "string") {
			trigger = { player: triggerName };
		} else if (get.is.object(triggerName)) {
			trigger = triggerName;
		}
		if (!trigger) {
			throw new Error("player.when传参数类型错误:" + triggerName);
		}
		let skillName;
		do {
			skillName = "player_when_" + Math.random().toString(36).slice(-8);
		} while (lib.skill[skillName] != null);
		const vars = {};
		//获取sourceSkill
		let eventName = get.event().name;
		if (eventName.startsWith("pre_")) {
			eventName = eventName.slice(4);
		}
		if (eventName.endsWith("_backup")) {
			eventName = eventName.slice(0, eventName.lastIndexOf("_backup"));
		}
		if (eventName.endsWith("ContentBefore")) {
			eventName = eventName.slice(0, eventName.lastIndexOf("ContentBefore"));
		}
		if (eventName.endsWith("ContentAfter")) {
			eventName = eventName.slice(0, eventName.lastIndexOf("ContentAfter"));
		}
		if (eventName.endsWith("_cost")) {
			eventName = eventName.slice(0, eventName.lastIndexOf("_cost"));
		}
		const sourceSkill = get.sourceSkillFor(eventName);
		/** @type { Skill } */
		let skill = {
			trigger: trigger,
			forced: true,
			charlotte: true,
			popup: false,
			// 保证仅发动一次
			triggered: false,
			sourceSkill: sourceSkill,
			/** @type { Required<Skill>['filter'][] } */
			filterFuns: [
				function (event, player) {
					return !lib.skill[skillName].triggered;
				},
			],
			/** @type { Required<Skill>['content'][] } */
			contentFuns: [],
			// 外部变量
			get vars() {
				return vars;
			},
			get filter() {
				return (event, player, name) => skill.filterFuns.every(fun => Boolean(fun(event, player, name)));
			},
		};
		const warnVars = ["event", "step", "source", "player", "target", "targets", "card", "cards", "skill", "forced", "num", "trigger", "result"];
		const errVars = ["_status", "lib", "game", "ui", "get", "ai"];
		const createContent = () => {
			let varstr = "";
			for (const key in vars) {
				if (warnVars.includes(key)) {
					console.warn(`Variable '${key}' should not be referenced by vars objects`);
				}
				if (errVars.includes(key)) {
					throw new Error(`Variable '${key}' should not be referenced by vars objects`);
				}
				varstr += `var ${key}=lib.skill['${skillName}'].vars['${key}'];\n`;
			}
			const originals = [];
			const contents = [];
			const compileStep = (code, scope) => {
				const deconstructs = ["step", "source", "target", "targets", "card", "cards", "skill", "forced", "num", "_result: result"];
				const topVars = ["_status", "lib", "game", "ui", "get", "ai"];

				const params = ["topVars", "event", "trigger", "player"];
				const body = dedent`
					var { ${deconstructs.join(", ")} } = event;
					var { ${topVars.join(", ")} } = topVars;
					${varstr}
					{
						${code}
					}
				`;

				if (!get.isFunctionBody(body)) {
					throw new Error(`无效的函数体: ${body}`);
				}

				let compiled;
				if (!scope) {
					compiled = new Function(...params, body);
				} else {
					compiled = scope(`(function (${params.join(", ")}) {\n${body}\n})`);
				}

				originals.push(compiled);
				contents.push(function (event, trigger, player) {
					// @ts-expect-error ignore
					return compiled.apply(this, [{ lib, game, ui, get, ai, _status }, event, trigger, player]);
				});
			};
			for (let i = 0; i < skill.contentFuns.length; i++) {
				const fun2 = skill.contentFuns[i];
				if (typeof fun2 === "function") {
					originals.push(fun2);
					contents.push(fun2);
				} else {
					const a = fun2;
					//防止传入()=>xxx的情况
					const begin =
						a.indexOf("{") == a.indexOf("}") && a.indexOf("{") == -1 && a.indexOf("=>") > -1 ? a.indexOf("=>") + 2 : a.indexOf("{") + 1;
					const str2 = a.slice(begin, a.lastIndexOf("}") != -1 ? a.lastIndexOf("}") : undefined).trim();
					// 防止注入喵
					if (!get.isFunctionBody(str2)) {
						throw new Error("无效的content函数代码");
					}
					let recompiledScope;
					if (security.isSandboxRequired()) {
						recompiledScope = code => security.eval(`return (${code.toString()})`);
					} else {
						recompiledScope = eval;
					}
					compileStep(str2, recompiledScope);
				}
			}
			const content = ContentCompiler.compile(contents);
			content.original = originals;
			skill.content = content;
		};
		Object.defineProperty(lib.skill, skillName, {
			configurable: true,
			//这类技能不需要被遍历到
			enumerable: false,
			writable: true,
			value: skill,
		});
		game.broadcast(function (skillName) {
			Object.defineProperty(lib.skill, skillName, {
				configurable: true,
				enumerable: false,
				writable: true,
				value: {
					forced: true,
					charlotte: true,
					popup: false,
					vars: {},
				},
			});
		}, skillName);
		if (instantlyAdd !== false) {
			this.addSkill(skillName);
		}
		_status.postReconnect.player_when[1][skillName] = true;
		return {
			// @ts-expect-error ignore
			skill: skillName,
			/**
			 * @param { Required<Skill>['filter'] } fun
			 */
			filter(fun) {
				if (lib.skill[skillName] != skill) {
					throw new Error(`This skill has been destroyed`);
				}
				skill.filterFuns.push(fun);
				return this;
			},
			/**
			 * @param { ContentFuncByAll } fun
			 */
			then(fun) {
				if (lib.skill[skillName] != skill) {
					throw new Error(`This skill has been destroyed`);
				}
				if (fun instanceof AsyncFunction) {
					skill.contentFuns.push(fun);
				} else {
					skill.contentFuns.push(String(fun)); // 提前转换，防止与闭包函数弄混
				}
				createContent();
				return this;
			},
			/**
			 * ```plain
			 * 闭包用法的then，不再提供parsex变量，改为使用闭包访问
			 * 传参为 event, trigger, player
			 *
			 * 闭包即你可以直接在when里面访问when外面的变量
			 * 如下：
			 * ```
			 * ```javascript
			 * var att = get.attitude(player, target);
			 *
			 * player.when("phaseEnd")
			 *     .step(() => {
			 *         if (att > 0) // 闭包访问了外面定义的变量 att
			 *             player.say("你好喵!");
			 *     });
			 * ```
			 *
			 * @param { ContentFuncByAll } fun
			 */
			step(fun) {
				if (lib.skill[skillName] != skill) {
					throw new Error(`This skill has been destroyed`);
				}
				skill.contentFuns.push(fun);
				createContent();
				return this;
			},
			/**
			 * @param { string } str
			 */
			popup(str) {
				if (lib.skill[skillName] != skill) {
					throw new Error(`This skill has been destroyed`);
				}
				if (typeof str == "string") {
					skill.popup = str;
				}
				return this;
			},
			/**
			 * @param { string } translation
			 */
			translation(translation) {
				if (lib.skill[skillName] != skill) {
					throw new Error(`This skill has been destroyed`);
				}
				if (typeof translation == "string") {
					_status.postReconnect.player_when[1][skillName] = translation;
					game.broadcastAll((skillName, translation) => (lib.translate[skillName] = translation), skillName, translation);
				}
				return this;
			},
			/**
			 * @param { Record<string, any> } obj
			 */
			assign(obj) {
				if (lib.skill[skillName] != skill) {
					throw new Error(`This skill has been destroyed`);
				}
				if (typeof obj == "object" && obj !== null) {
					Object.assign(skill, obj);
					game.broadcast(
						(skillName, obj) => {
							Object.assign(lib.skill[skillName], obj);
						},
						skillName,
						obj
					);
				}
				return this;
			},
			/**
			 * @deprecated
			 * @param { Record<string, any> } arg
			 */
			vars(arg) {
				if (lib.skill[skillName] != skill) {
					throw new Error(`This skill has been destroyed`);
				}
				if (!get.is.object(arg)) {
					throw new Error("vars的第一个参数必须为对象");
				}
				Object.assign(vars, arg);
				createContent();
				return this;
			},
			/**
			 * 获得技能
			 * 如果instantlyAdd为false，则需要以此法获得技能
			 **/
			finish() {
				if (lib.skill[skillName] != skill) {
					throw new Error(`This skill has been destroyed`);
				}
				player.addSkill(skillName);
				return this;
			},
		};
	}
	/**
	 * 让一名角色连接一名角色一些手牌
	 */
	connectCards() {
		const next = game.createEvent("connectCards");
		next.player = this;
		for (const argument of arguments) {
			const type = get.itemtype(argument);
			if (type == "cards") {
				next.cards = argument;
			} else if (type == "card") {
				next.cards = [argument];
			} else if (type == "player") {
				next.source = [argument];
			} else if (typeof argument == "boolean") {
				next.log = argument;
			}
		}
		if (get.itemtype(next.source) != "player") {
			next.source = _status.event.player;
		}
		if (get.itemtype(next.cards) != "cards") {
			next.cards = this.getCards("h");
		}
		if (!next.cards.length) {
			_status.event.next.remove(next);
			next.resolve();
		}
		if (next.log == undefined) {
			next.log = true;
		}
		next.setContent("connectCards");
		next._args = Array.from(arguments);
		return next;
	}
	/**
	 * 让一名角色重置一名角色一些连接手牌
	 */
	resetConnectedCards() {
		const next = game.createEvent("resetConnectedCards");
		next.player = this;
		for (const argument of arguments) {
			const type = get.itemtype(argument);
			if (type == "cards") {
				next.cards = argument;
			} else if (type == "card") {
				next.cards = [argument];
			} else if (type == "player") {
				next.source = [argument];
			} else if (typeof argument == "boolean") {
				next.log = argument;
			}
		}
		if (get.itemtype(next.source) != "player") {
			next.source = _status.event.player;
		}
		if (get.itemtype(next.cards) != "cards") {
			next.cards = this.getConnectedCards();
		}
		if (next.log == undefined) {
			next.log = true;
		}
		if (!next.cards.length) {
			_status.event.next.remove(next);
			next.resolve();
		}
		next.setContent("resetConnectedCards");
		next._args = Array.from(arguments);
		return next;
	}
	/**
	 * 获取角色所有的连接手牌
	 */
	getConnectedCards() {
		return this.getCards("h", card => get.is.connectedCard(card));
	}
	/**
	 * 获取角色所有的连接手牌数
	 * @returns {number}
	 */
	countConnectedCards() {
		return this.getConnectedCards().length;
	}
	/**
	 * 判断一名角色是否拥有连接手牌
	 * @returns {boolean}
	 */
	hasConnectedCards() {
		return this.hasCard(card => get.is.connectedCard(card), "h");
	}
	/**
	 * 让一名角色明置一些手牌
	 */
	addShownCards() {
		const cards = [],
			tags = [];
		for (const argument of arguments) {
			const type = get.itemtype(argument);
			if (type == "cards") {
				cards.addArray(argument);
			} else if (type == "card") {
				cards.add(argument);
			} else if (typeof argument == "string" && argument.startsWith("visible_")) {
				tags.add(argument);
			}
		}
		if (!cards.length || !tags.length) {
			return;
		}
		const next = game.createEvent("addShownCards", false);
		next.player = this;
		next._cards = cards;
		next.gaintag = tags;
		next.setContent("addShownCards");
		return next;
	}
	/**
	 * 让一名角色暗置一些手牌
	 */
	hideShownCards() {
		const cards = [],
			tags = [];
		for (const argument of arguments) {
			const type = get.itemtype(argument);
			if (type == "cards") {
				cards.addArray(argument);
			} else if (type == "card") {
				cards.add(argument);
			} else if (typeof argument == "string" && argument.startsWith("visible_")) {
				tags.add(argument);
			}
		}
		if (!cards.length) {
			return;
		}
		const next = game.createEvent("hideShownCards", false);
		next.player = this;
		next._cards = cards;
		next.gaintag = tags;
		next.setContent("hideShownCards");
		return next;
	}
	/**
	 * 获取角色所有的明置手牌
	 */
	getShownCards() {
		return this.getCards("h", card => {
			return get.is.shownCard(card);
		});
	}
	/**
	 * 获取角色所有的明置手牌数
	 * @returns {number}
	 */
	countShownCards() {
		return this.getShownCards().length;
	}
	/**
	 * 判断一名角色是否拥有明置手牌
	 * @returns {boolean}
	 */
	hasShownCards() {
		return this.hasCard(card => get.is.shownCard(card), "h");
	}
	/**
	 * 获取该角色被other所知的牌
	 * @param { Player } [other]
	 * @param { (card: Card) => boolean } [filter]
	 */
	getKnownCards(other = _status.event.player, filter = card => true) {
		if (!other) {
			if (other === null) {
				console.trace(`getKnownCards的other参数不应传入null,可以用void 0或undefined占位`);
			}
			other = _status.event.player || this;
		}
		if (!filter) {
			if (other === null) {
				console.trace(`getKnownCards的filter参数不应传入null,可以用void 0或undefined占位`);
			}
			filter = card => true;
		}
		return this.getCards("h", card => {
			return card.isKnownBy(other) && filter(card);
		});
	}
	/**
	 * 判断此角色的手牌是否已经被看光了
	 * @param { Player } [other]
	 */
	isAllCardsKnown(other = _status.event.player) {
		if (!other) {
			if (other === null) {
				console.trace(`isAllCardsKnown的other参数不应传入null,可以用void 0或undefined占位`);
			}
			other = _status.event.player || this;
		}
		if (!other) {
			other = this;
		}
		return (
			this.countCards("h", card => {
				return !card.isKnownBy(other);
			}) == 0
		);
	}
	/**
	 * 判断此角色是否有被知的牌。
	 * @param { Player } [other]
	 * @param { (card: Card) => boolean } [filter]
	 */
	hasKnownCards(other = _status.event.player, filter = card => true) {
		if (!other) {
			if (other === null) {
				console.trace(`hasKnownCards的other参数不应传入null,可以用void 0或undefined占位`);
			}
			other = _status.event.player || this;
		}
		if (!filter) {
			if (other === null) {
				console.trace(`hasKnownCards的filter参数不应传入null,可以用void 0或undefined占位`);
			}
			filter = card => true;
		}
		return (
			this.countCards("h", card => {
				return card.isKnownBy(other) && filter(card);
			}) > 0
		);
	}
	/**
	 * 数此角色被知道的牌
	 * @param { Player } [other]
	 * @param { (card: Card) => boolean } [filter]
	 */
	countKnownCards(other, filter) {
		return this.getKnownCards(other, filter).length;
	}
	/**
	 * Execute the delay card effect
	 *
	 * 执行延时锦囊牌效果
	 * @param { Card | string } card
	 * @param { Player } target
	 * @param {*} judge
	 * @param {*} judge2
	 * @returns
	 */
	executeDelayCardEffect(card, target, judge, judge2) {
		const executeDelayCardEffect = game.createEvent("executeDelayCardEffect");
		executeDelayCardEffect.player = this;
		executeDelayCardEffect.target = target || this;
		if (typeof card == "string") {
			const virtualCard = (executeDelayCardEffect.card = ui.create.card());
			virtualCard._destroy = true;
			virtualCard.expired = true;
			const info = lib.card[card];
			virtualCard.init(["", "", card, info && info.cardnature]);
		} else if (get.itemtype(card) == "card") {
			executeDelayCardEffect.card = card;
		} else {
			_status.event.next.remove(executeDelayCardEffect);
			executeDelayCardEffect.resolve();
		}
		executeDelayCardEffect.judge = judge;
		executeDelayCardEffect.judge2 = judge2;
		executeDelayCardEffect.setContent("executeDelayCardEffect");
		executeDelayCardEffect._args = Array.from(arguments);
		return executeDelayCardEffect;
	}
	/**
	 * Check if the card does not count toward hand limit
	 *
	 * 检测此牌是否不计入手牌上限
	 * @param { Card } card
	 * @returns { boolean }
	 */
	canIgnoreHandcard(card) {
		return lib.filter.ignoredHandcard(card, this);
	}
	//Gift
	/**
	 * Gift
	 *
	 * 赠予
	 * @param { Card | Card[] } cards
	 * @param { Player } target
	 */
	gift(cards, target) {
		const gift = game.createEvent("gift");
		gift.player = this;
		gift.target = target;
		const isArray = Array.isArray(cards);
		if (cards && !isArray) {
			gift.cards = [cards];
		} else if (isArray && cards.length) {
			gift.cards = cards;
		} else {
			_status.event.next.remove(gift);
			gift.resolve();
		}
		gift.deniedGifts = [];
		gift.setContent("gift");
		gift._args = Array.from(arguments);
		return gift;
	}
	/**
	 * Check if the player can gift the card
	 *
	 * 检测角色是否能赠予此牌
	 * @param { Card } card
	 * @param { Player } target
	 * @param { boolean } [strict]
	 */
	canGift(card, target, strict) {
		return lib.filter.cardGiftable(card, this, target, strict);
	}
	/**
	 * Check if the player refuses gifts
	 *
	 * 检测角色是否拒绝赠予
	 * @param { Card } card
	 * @param { Player } player
	 */
	refuseGifts(card, player) {
		return this.hasSkillTag("refuseGifts", null, {
			player: player,
			card: card,
		});
	}
	/**
	 * Gift AI related
	 *
	 * 赠予AI相关
	 * @param { Card } card
	 * @param { Player } target
	 */
	getGiftAIResultTarget(card, target) {
		if (!card || target.refuseGifts(card, this)) {
			return 0;
		}
		if (get.type(card, null, target) == "equip") {
			return get.effect(target, card, target, target);
		}
		if (card.name == "du") {
			return this.hp > target.hp ? -1 : 0;
		}
		if (target.hasSkillTag("nogain")) {
			return 0;
		}
		return Math.max(1, get.value(card, this) - get.value(card, target));
	}
	/**
	 * @param { Card } card
	 * @param { Player } target
	 */
	getGiftEffect(card, target) {
		return this.getGiftAIResultTarget(card, target) * get.attitude(this, target);
	}
	//Recast
	/**
	 * 重铸
	 * @param { Card | Card[] } cards
	 * @param { (player: Player, cards: Card[]) => any } [recastingLose]
	 * @param { (player: Player, cards: Card[]) => any } [recastingGain]
	 */
	recast(cards, recastingLose, recastingGain) {
		const recast = game.createEvent("recast");
		recast.player = this;
		const isArray = Array.isArray(cards);
		if (cards && !isArray) {
			recast.cards = [cards];
		} else if (isArray && cards.length) {
			recast.cards = cards;
		} else {
			_status.event.next.remove(recast);
			recast.resolve();
		}
		if (typeof recastingLose != "function") {
			if (recastingLose === null) {
				console.trace(`recast的recastingLose参数不应传入null,可以用void 0或undefined占位`);
			}
			recastingLose = (player, cards) => {
				const next = player.loseToDiscardpile(cards);
				next.log = false;
				return next;
			};
		}
		recast.recastingLose = recastingLose;
		recast.recastingLosingEvents = [];
		if (typeof recastingGain != "function") {
			if (recastingLose === null) {
				console.trace(`recast的recastingGain参数不应传入null,可以用void 0或undefined占位`);
			}
			recastingGain = (player, cards) => {
				const next = player.draw(cards.length);
				next.log = false;
				return next;
			};
		}
		recast.recastingGain = recastingGain;
		recast.recastingGainingEvents = [];
		recast.setContent("recast");
		recast._args = Array.from(arguments);
		return recast;
	}
	/**
	 * Check if the player can recast the card
	 *
	 * 检测角色是否能重铸此牌
	 * @param { Card } card
	 * @param { Player } [source]
	 * @param { boolean } [strict]
	 */
	canRecast(card, source, strict) {
		return lib.filter.cardRecastable(card, this, source, strict);
	}
	//装备栏相关
	/**
	 * 判断一名角色的某个区域是否被废除
	 *
	 * type为要判断的区域 若为空 则判断玩家是否有任意一个被废除的区域
	 * @param { string | number } [type]
	 * @returns { boolean }
	 */
	hasDisabledSlot(type) {
		if (type == "horse" || type == "equip3_4") {
			return this.hasDisabledSlot(3) && (get.is.mountCombined() || this.hasDisabledSlot(4));
		} else if (get.is.mountCombined() && type == "equip4") {
			return false;
		}
		return this.countDisabledSlot(type) > 0;
	}
	/**
	 * 判断一名角色的某个区域被废除的数量
	 *
	 * 用法同 {@link hasDisabledSlot}
	 * @param { string | number } [type]
	 */
	countDisabledSlot(type) {
		const map = this.disabledSlots || {};
		let num;
		if (type == undefined) {
			num = 0;
			for (let i = 1; i <= 5; i++) {
				num += this.countDisabledSlot(i);
			}
			return num;
		} else {
			if (typeof type == "number") {
				type = "equip" + type;
			}
			if (get.is.mountCombined() && type == "equip4") {
				return 0;
			}
			num = map[type];
			if (typeof num == "number" && num > 0) {
				return num;
			}
			return 0;
		}
	}
	/**
	 * 判断一名角色是否有某个装备栏空着
	 * @param { string | number } [type]
	 * @returns { boolean }
	 */
	hasEmptySlot(type) {
		if (type == "horse" || type == "equip3_4") {
			return this.hasEmptySlot(3) && (get.is.mountCombined() || this.hasEmptySlot(4));
		} else if (get.is.mountCombined() && type == "equip4") {
			return false;
		}
		return this.countEmptySlot(type) > 0;
	}
	/**
	 * 判断一名角色的某个装备栏空位的数量
	 * @param { string | number } [type]
	 */
	countEmptySlot(type) {
		if (!type) {
			return 0;
		}
		if (typeof type == "number") {
			type = "equip" + type;
		} else if (type == "equip3_4") {
			type = "equip3";
		}
		return Math.max(
			0,
			this.countEnabledSlot(type) -
				this.getVEquips(type).reduce((num, card) => {
					let types = get.subtypes(card, false);
					return num + get.numOf(types, type);
				}, 0)
		);
	}
	/**
	 * 判断一名角色是否有可以用于装备新装备牌的区域（排除金箍棒和六龙等“不可被替换装备”）
	 *
	 * 用法同 {@link hasEnabledSlot}
	 * @param { string | number } [type]
	 */
	hasEquipableSlot(type) {
		return this.countEquipableSlot(type) > 0;
	}
	/**
	 * 统计一名角色有多少个可以用于装备新的装备牌的区域
	 *
	 * 用法同 {@link hasEnabledSlot}
	 * @param { string | number } [type]
	 */
	countEquipableSlot(type) {
		if (!type) {
			return 0;
		}
		if (typeof type == "number") {
			type = "equip" + type;
		} else if (type == "equip3_4") {
			type = "equip3";
		} else if (get.is.mountCombined() && type == "equip4") {
			return 0;
		}
		return Math.max(
			0,
			this.countEnabledSlot(type) -
				this.getVEquips(type).reduce((num, card) => {
					let types = get.subtypes(card, false);
					if (!lib.filter.canBeReplaced(card, this)) {
						num += get.numOf(types, type);
					}
					return num;
				}, 0)
		);
	}
	/**
	 * 判断一名角色是否拥有未被废除的某个区域
	 *
	 * type为要判断的区域 若为空 则判断玩家是否有任意一个未被废除的区域
	 * @param { string | number } [type]
	 * @returns { boolean }
	 */
	hasEnabledSlot(type) {
		if (type == "horse" || type == "equip3_4") {
			return this.hasEnabledSlot(3) && (get.is.mountCombined() || this.hasEnabledSlot(4));
		}
		// else if(type=='equip3_4'){
		// 	type='equip3';
		// }
		else if (get.is.mountCombined() && type == "equip4") {
			return false;
		}
		return this.countEnabledSlot(type) > 0;
	}
	/**
	 * 判断一名角色的某个区域未被废除的数量
	 *
	 * 用法同 {@link hasEnabledSlot}
	 * @param { string | number } [type]
	 */
	countEnabledSlot(type) {
		const map = this.expandedSlots || {};
		let num;
		if (!type) {
			num = 0;
			for (let i = 1; i <= 5; i++) {
				num += this.countEnabledSlot(i);
			}
			return num;
		} else {
			if (typeof type == "number") {
				type = "equip" + type;
			}
			if (get.is.mountCombined() && type == "equip4") {
				return 0;
			}
			let slots = 1;
			num = map[type];
			if (typeof num == "number" && num > 0) {
				slots += num;
			}
			slots -= this.countDisabledSlot(type);
			return slots;
		}
	}
	/**
	 * 获取一名角色装备区内某种类型的装备牌
	 *
	 * 参数可以为数字/区域字符串/实体牌/虚拟牌/牌名
	 * @param { number | string | Card | VCard } subtype
	 * @returns { Card[] }
	 */
	getEquips(subtype) {
		const VEquips = this.getVEquips(subtype);
		return VEquips.reduce((cards, vcard) => {
			// @ts-expect-error ignore
			cards.addArray(vcard.cards || []);
			return cards;
		}, []);
	}
	/**
	 * 获取一名角色装备区内某种类型的虚拟牌
	 *
	 * 参数可以为数字/区域字符串/实体牌/虚拟牌/牌名
	 * @param { number | string | Card | VCard } subtype
	 * @returns { VCard[] }
	 */
	getVEquips(subtype) {
		switch (typeof subtype) {
			case "string":
				if (subtype == "equip3_4") {
					const cards = [];
					cards.addArray(this.getVEquips(3));
					cards.addArray(this.getVEquips(4));
					return cards;
				} else if (subtype.startsWith("equip") && parseInt(subtype.slice(5)) > 0) {
					break;
				} else if (lib.card[subtype]) {
					return this.getVCards("e", card => card.name == subtype);
				} else {
					return [];
				}
			case "number":
				subtype = "equip" + subtype;
				break;
			case "object":
				subtype = get.subtype(subtype, false);
				break;
			default:
				return [];
		}
		if (!subtype) {
			return [];
		}
		return this.getVCards("e", card => {
			// @ts-expect-error ignore
			return get.subtypes(card, false).includes(subtype);
		});
	}
	/**
	 * 新的废除装备区
	 *
	 * 参数：废除来源角色（不写默认当前事件角色），废除区域（数字/区域字符串/数组，可以写多个，重复废除）
	 */
	disableEquip() {
		var next = game.createEvent("disableEquip");
		next.player = this;
		next.slots = [];
		for (var i = 0; i < arguments.length; i++) {
			if (get.itemtype(arguments[i]) == "player") {
				next.source = arguments[i];
			} else if (Array.isArray(arguments[i])) {
				for (var arg of arguments[i]) {
					if (typeof arg == "string") {
						if (arg.startsWith("equip") && parseInt(arg.slice(5)) > 0) {
							next.slots.push(arg);
						}
					} else if (typeof arg == "number") {
						next.slots.push("equip" + arg);
					}
				}
			} else if (typeof arguments[i] == "string") {
				if (arguments[i].startsWith("equip") && parseInt(arguments[i].slice(5)) > 0) {
					next.slots.push(arguments[i]);
				}
			} else if (typeof arguments[i] == "number") {
				next.slots.push("equip" + arguments[i]);
			}
		}
		if (!next.source) {
			next.source = _status.event.player;
		}
		if (!next.slots.length) {
			_status.event.next.remove(next);
			next.resolve();
		}
		next.setContent("disableEquip");
		return next;
	}
	/**
	 * 新的恢复装备区
	 *
	 * 参数：恢复来源角色（不写默认当前事件角色），恢复区域（数字/区域字符串/数组，可以写多个，重复恢复）
	 */
	enableEquip() {
		var next = game.createEvent("enableEquip");
		next.player = this;
		next.slots = [];
		for (var i = 0; i < arguments.length; i++) {
			if (get.itemtype(arguments[i]) == "player") {
				next.source = arguments[i];
			} else if (Array.isArray(arguments[i])) {
				for (var arg of arguments[i]) {
					if (typeof arg == "string") {
						if (arg.startsWith("equip") && parseInt(arg.slice(5)) > 0) {
							next.slots.push(arg);
						}
					} else if (typeof arg == "number") {
						next.slots.push("equip" + arg);
					}
				}
			} else if (typeof arguments[i] == "string") {
				if (arguments[i].startsWith("equip") && parseInt(arguments[i].slice(5)) > 0) {
					next.slots.push(arguments[i]);
				}
			} else if (typeof arguments[i] == "number") {
				next.slots.push("equip" + arguments[i]);
			}
		}
		if (!next.source) {
			next.source = _status.event.player;
		}
		if (!next.slots.length) {
			_status.event.next.remove(next);
			next.resolve();
		}
		next.setContent("enableEquip");
		return next;
	}
	/**
	 * 新的扩展装备区
	 *
	 * 参数：扩展来源角色（不写默认当前事件角色），扩展区域（数字/区域字符串/数组，可以写多个，重复扩展）
	 */
	expandEquip() {
		var next = game.createEvent("expandEquip");
		next.player = this;
		next.slots = [];
		for (var i = 0; i < arguments.length; i++) {
			if (get.itemtype(arguments[i]) == "player") {
				next.source = arguments[i];
			} else if (Array.isArray(arguments[i])) {
				for (var arg of arguments[i]) {
					if (typeof arg == "string") {
						if (arg.startsWith("equip") && parseInt(arg.slice(5)) > 0) {
							next.slots.push(arg);
						}
					} else if (typeof arg == "number") {
						next.slots.push("equip" + arg);
					}
				}
			} else if (typeof arguments[i] == "string") {
				if (arguments[i].startsWith("equip") && parseInt(arguments[i].slice(5)) > 0) {
					next.slots.push(arguments[i]);
				}
			} else if (typeof arguments[i] == "number") {
				next.slots.push("equip" + arguments[i]);
			}
		}
		if (!next.source) {
			next.source = _status.event.player;
		}
		if (!next.slots.length) {
			_status.event.next.remove(next);
			next.resolve();
		}
		next.setContent("expandEquip");
		return next;
	}
	/**
	 * 判断判定区是否被废除
	 */
	isDisabledJudge() {
		return Boolean(this.storage._disableJudge);
	}
	/**
	 * 同步显示扩展装备区状态
	 * @param { Record<string, number> } [map]
	 */
	$syncExpand(map) {
		if (!map) {
			map = this.expandedSlots || {};
		}
		game.addVideo("$syncExpand", this, get.copy(map));
		game.broadcast(
			function (player, map) {
				player.expandedSlots = map;
				player.$syncExpand(map);
			},
			this,
			map
		);
		this.markSkill("expandedSlots");
	}
	/**
	 * 同步装备区废除牌显示状态
	 * @param { Record<string, number> } [map]
	 */
	$syncDisable(map) {
		//TODO:虚拟装备牌的添加暂时没有考虑到废除装备栏的情况，会出现排序错误的问题。需要手动设置排序。
		const suits = { equip3: "+1马栏", equip4: "-1马栏", equip6: "特殊栏" };
		if (get.is.mountCombined()) {
			suits.equip3 = "坐骑栏";
		}
		if (!map) {
			map = this.disabledSlots || {};
		}
		game.addVideo("$syncDisable", this, get.copy(map));
		game.broadcast(
			function (player, map) {
				player.disabledSlots = map;
				player.$syncDisable(map);
			},
			this,
			map
		);
		const map2 = get.copy(map);
		/** @type { Card[] } */
		// @ts-expect-error ignore
		const cards = Array.from(this.node.equips.childNodes);
		for (const card of cards) {
			if (card.name.startsWith("feichu_")) {
				const index = card.name.slice(7);
				if (!map2[index]) {
					map2[index] = 0;
				}
				map2[index]--;
			}
		}
		for (const index in map2) {
			if (!index.startsWith("equip") || !(parseInt(index.slice(5)) > 0)) {
				continue;
			}
			const num = map2[index];
			if (num > 0) {
				for (let i = 0; i < num; i++) {
					const card = game.createCard("feichu_" + index, suits[index] || get.translation(index) + "栏", "");
					card.fix();
					card.style.transform = "";
					card.classList.remove("drawinghidden");
					card.classList.add("feichu");
					delete card._transform;
					const equipNum = get.equipNum(card);
					let equipped = false;
					for (let j = 0; j < this.node.equips.childNodes.length; j++) {
						if (get.equipNum(this.node.equips.childNodes[j]) >= equipNum) {
							this.node.equips.insertBefore(card, this.node.equips.childNodes[j]);
							equipped = true;
							break;
						}
					}
					if (!equipped) {
						this.node.equips.appendChild(card);
						if (_status.discarded) {
							_status.discarded.remove(card);
						}
					}
				}
			} else if (num < 0) {
				for (let i = 0; i > num; i--) {
					const card = cards.find(card => card.name == "feichu_" + index);
					if (card) {
						this.node.equips.removeChild(card);
						cards.remove(card);
					}
				}
			}
		}
	}
	//以下函数涉及到本次更新内容而进行修改
	/**
	 * @param { string | Card | VCard | CardBaseUIData } name
	 * @param { boolean } [replace]
	 * @returns { boolean }
	 */
	canEquip(name, replace) {
		const ranges = get.subtypes(name),
			rangex = [],
			combined = get.is.mountCombined();
		if (combined) {
			ranges.forEach(type => {
				if (type == "equip3" || type == "equip4") {
					rangex.add("equip3_4");
				} else {
					rangex.add(type);
				}
			});
		} else {
			rangex.push(...new Set(ranges));
		}
		if (get.itemtype(name) == "card") {
			const owner = get.owner(name, "judge");
			if (owner && !lib.filter.canBeGained(name, this, owner)) {
				return false;
			}
		}
		for (let range of rangex) {
			let num = this.countEquipableSlot(range);
			let num2 = get.numOf(rangex, range);
			if (!replace) {
				num -= this.getVEquips(range).filter(card => lib.filter.canBeReplaced(card, this)).length;
			}
			if (num < num2) {
				return false;
			}
		}
		return true;
	}
	//以下函数将不再进行后续维护
	/**
	 * @deprecated
	 */
	countDisabled() {
		return this.countDisabledSlot(...arguments);
	}
	/**
	 * @deprecated
	 */
	isDisabled(arg) {
		return this.hasDisabledSlot(arg) && !this.hasEnabledSlot(arg);
	}
	/**
	 * @deprecated
	 */
	isEmpty(num) {
		return this.countEnabledSlot(num) > this.getVEquips(num).length;
	}
	//装备区End
	chooseToDebate() {
		var next = game.createEvent("chooseToDebate");
		next.player = this;
		next._args = [];
		for (var i = 0; i < arguments.length; i++) {
			if (get.itemtype(arguments[i]) == "players") {
				next.list = arguments[i].slice(0);
			} else {
				next._args.push(arguments[i]);
			}
		}
		next.setContent("chooseToDebate");
		return next;
	}
	/**
	 * 向target发起协力
	 * @param { Player } target
	 * @param { string } type
	 * @param {*} reason
	 */
	cooperationWith(target, type, reason) {
		if (!this.storage.cooperation) {
			this.storage.cooperation = [];
		}
		const info = {
			target,
			type,
			reason,
		};
		this.storage.cooperation.add(info);
		this.addTempSkill("cooperation", { player: "dieAfter" });
		this.addTempSkill("cooperation_" + type, { player: "dieAfter" });
		game.log(this, "向", target, "发起了“协力”，合作类型是", "#g" + get.translation("cooperation_" + type));
	}
	chooseCooperationFor() {
		var next = game.createEvent("chooseCooperationFor");
		next.player = this;
		for (var i = 0; i < arguments.length; i++) {
			if (get.itemtype(arguments[i]) == "player") {
				next.target = arguments[i];
			} else if (Array.isArray(arguments[i])) {
				next.cardlist = arguments[i];
			} else if (typeof arguments[i] == "string") {
				next.reason = arguments[i];
			}
		}
		if (!next.cardlist) {
			next.cardlist = ["cooperation_damage", "cooperation_draw", "cooperation_discard", "cooperation_use"];
		}
		next.setContent("chooseCooperationFor");
		return next;
	}
	checkCooperationStatus(target, reason) {
		var storage = this.getStorage("cooperation");
		for (var info of storage) {
			if (info.target == target && info.reason == reason) {
				var skill = lib.skill["cooperation_" + info.type];
				if (skill && skill.checkx && skill.checkx(info)) {
					return true;
				}
			}
		}
		return false;
	}
	removeCooperation(info) {
		let storage = this.getStorage("cooperation");
		if (!storage.includes(info)) {
			return;
		}
		storage.remove(info);
		let unmark = true,
			reason = info.type;
		if (!storage.length) {
			this.removeSkill("cooperation");
		} else {
			for (let i of storage) {
				if (i.type == reason) {
					unmark = false;
					break;
				}
			}
		}
		if (unmark) {
			this.removeSkill("cooperation_" + reason);
		} else {
			this.markSkill("cooperation_" + reason);
		}
	}
	/**
	 * @param { boolean } unseen 是否无视暗将的限制
	 * @returns { string[] }
	 */
	getClans(unseen) {
		const clans = [];
		if (unseen || !this.isUnseen(0)) {
			let info = lib.character[this.name1];
			if (info && info.clans) {
				clans.addArray(info.clans);
			}
		}
		if (this.name2 && (unseen || !this.isUnseen(1))) {
			let info = lib.character[this.name2];
			if (info && info.clans) {
				clans.addArray(info.clans);
			}
		}
		return clans;
	}
	/**
	 * @param { string } clan 氏族名称
	 * @param { boolean } unseen 是否无视暗将的限制
	 * @returns { boolean }
	 */
	hasClan(clan, unseen) {
		return this.getClans(unseen).includes(clan);
	}
	/**
	 * @param { string } skill
	 */
	changeZhuanhuanji(skill) {
		let info = get.info(skill),
			zhuanhuan = info.zhuanhuanji;
		if (typeof zhuanhuan == "function") {
			zhuanhuan(this, skill);
		} else if (zhuanhuan == "number") {
			this.addMark(skill, 1, false);
		} else {
			this.storage[skill] = !this.storage[skill];
		}
		game.broadcastAll(
			function (player, skill) {
				player.$changeZhuanhuanji(skill);
			},
			this,
			skill
		);
		let player = this;
		let evt = _status.event;
		//转换技转换后
		let next = game.createEvent("changeZhuanhuanji", false);
		next.player = player;
		next.forceDie = true;
		next.includeOut = true;
		next.skill = skill;
		evt.next.remove(next);
		if (evt.logSkill || evt.name?.startsWith("pre_")) {
			evt = evt.getParent();
		}
		next.log_event = evt;
		evt.after.push(next);
		next.setContent("emptyEvent");
		//转换技转换时
		let next2 = game.createEvent("changeZhuanhuanjiBegin", false, get.event());
		next2.player = player;
		next2.forceDie = true;
		next2.includeOut = true;
		next2.skill = skill;
		next2.log_event = evt;
		next2.setContent("emptyEvent");
	}
	/**
	 * @param { string } skill
	 */
	$changeZhuanhuanji(skill) {
		var mark = this.marks[skill];
		if (mark) {
			if (lib.skill[skill].$zhuanhuanji) {
				lib.skill[skill].$zhuanhuanji(skill, this);
				return;
			}
			const zhuanhuanLimit = get.zhuanhuanItemNum(skill, this);
			// @ts-expect-error ignore
			if (typeof mark.firstChild.reversed != "number") {
				// @ts-expect-error ignore
				mark.firstChild.reversed = 0;
			}
			// @ts-expect-error ignore
			mark.firstChild.reversed += 360 / zhuanhuanLimit;
			// @ts-expect-error ignore
			mark.firstChild.style.transform = "rotate(" + parseFloat(mark.firstChild.reversed) + "deg)";
		}
	}
	/**
	 * 设置玩家的座位号
	 * @param { number } num
	 */
	setSeatNum(num) {
		_status.seatNumSettled = true;
		game.broadcastAll(
			function (player, num) {
				player.seatNum = num;
			},
			this,
			num
		);
	}
	/**
	 * 返回玩家的座位号
	 * @returns { number }
	 */
	getSeatNum() {
		if (typeof this.seatNum == "number") {
			return this.seatNum;
		}
		return 0;
	}
	/**
	 * 是否拥有某一性别
	 * @param { string } sex
	 */
	hasSex(sex) {
		if (this.sex == "unknown") {
			return false;
		}
		if (this.sex == "double") {
			return true;
		}
		return this.sex == sex;
	}
	/**
	 * 是否和target同一性别
	 * @param { Player } target
	 */
	sameSexAs(target) {
		const sex1 = this.sex,
			sex2 = target.sex;
		if (sex1 == "unknown" || sex2 == "unknown") {
			return false;
		}
		if (sex1 == "double" || sex2 == "double") {
			return true;
		}
		return sex1 == sex2;
	}
	/**
	 * 是否和target不同性别
	 * @param { Player } target
	 */
	differentSexFrom(target) {
		var sex1 = this.sex,
			sex2 = target.sex;
		if (sex1 == "unknown" || sex2 == "unknown") {
			return false;
		}
		if (sex1 == "double" || sex2 == "double") {
			return true;
		}
		return sex1 != sex2;
	}
	/**
	 * @param { string } skill
	 */
	addSkillBlocker(skill) {
		if (!this.storage.skill_blocker) {
			this.storage.skill_blocker = [];
		}
		this.storage.skill_blocker.push(skill);
	}
	/**
	 * @param { string } skill
	 */
	removeSkillBlocker(skill) {
		if (this.storage.skill_blocker) {
			this.storage.skill_blocker.remove(skill);
			if (!this.storage.skill_blocker.length) {
				delete this.storage.skill_blocker;
			}
		}
	}
	/**
	 *
	 * @param { Card[] } cards
	 * @param { string } tag
	 * @param { Player } target
	 * @returns { GameEvent }
	 */
	loseToSpecial(cards, tag, target) {
		var next = game.loseAsync({
			player: this,
			cards: cards,
			tag: tag,
			toStorage: true,
			target: target || this,
		});
		next.setContent(async function (event, trigger, player) {
			await player.lose(event.cards, ui.special).set("getlx", false);
			let cards = event.cards.slice();
			cards.removeArray(player.getCards("hejsx"));
			if (cards.length) {
				event.target.directgains(cards, null, event.tag);
			}
		});
		return next;
	}
	/**
	 * 给一些牌加上Gaintag
	 * @param { Card | Card[] } cards
	 * @param { string } tag
	 */
	addGaintag(cards, tag) {
		if (get.itemtype(cards) == "card") {
			cards = [cards];
		}
		game.addVideo("addGaintag", this, [get.cardsInfo(cards), tag]);
		game.broadcastAll(
			function (player, cards, tag) {
				var hs = player.getCards("hejsx");
				for (var i of cards) {
					if (hs.includes(i)) {
						i.addGaintag(tag);
					}
				}
			},
			this,
			cards,
			tag
		);
	}
	/**
	 * 移除一些牌的Gaintag
	 * @param { string } tag
	 * @param { Card | Card[] } [cards]
	 */
	removeGaintag(tag, cards) {
		if (get.itemtype(cards) == "card") {
			cards = [cards];
		}
		cards = cards || this.getCards("h");
		game.addVideo("removeGaintag", this, [tag, get.cardsInfo(cards)]);
		game.broadcastAll(
			function (player, tag, cards) {
				for (var i of cards) {
					i.removeGaintag(tag);
				}
			},
			this,
			tag,
			cards
		);
	}
	/**
	 * @param { Player } target
	 */
	canSave(target) {
		if (this.hasSkillTag("save", true, target, true)) {
			return true;
		}
		let name = {},
			hs = this.iterableGetCards("hs");
		for (let i of hs) {
			name[get.name(i)] = true;
		}
		for (let i in lib.card) {
			if (lib.card[i].savable && (lib.inpile.includes(i) || name[i])) {
				if (lib.filter.cardSavable({ name: i }, this, target) && (_status.connectMode || this.hasUsableCard(i))) {
					return true;
				}
			}
		}
		return false;
	}
	/**
	 * @param { Card } card
	 * @param { Player } target
	 */
	canSaveCard(card, target) {
		const mod2 = game.checkMod(card, this, "unchanged", "cardEnabled2", this);
		if (mod2 != "unchanged") {
			return mod2;
		}
		const mod = game.checkMod(card, this, target, "unchanged", "cardSavable", this);
		if (mod != "unchanged") {
			return mod;
		}
		let savable = get.info(card).savable;
		if (typeof savable == "function") {
			savable = savable(card, this, target);
		}
		return savable;
	}
	/**
	 * @param { String } from
	 * @param { String } to
	 * @returns { GameEvent }
	 */
	reinitCharacter(from, to, log = true) {
		const rawPairs = [this.name1];
		if (this.name2) {
			rawPairs.push(this.name2);
		}
		for (let i = 0; i < rawPairs.length; i++) {
			if (rawPairs[i] == from) {
				rawPairs[i] = to;
				break;
			}
		}
		return this.changeCharacter(rawPairs, log);
	}
	/**
	 * @param { String[] } newPairs
	 * @returns { GameEvent }
	 */
	changeCharacter(newPairs, log = true) {
		if (!Array.isArray(newPairs)) {
			console.warn(`警告：Player[${this.name}].changeCharacter填写了一个错误的参数:`, newPairs);
			return;
		}
		for (let name of newPairs) {
			if (!lib.character[name]) {
				console.warn(`警告：Player[${this.name}]试图将武将牌变更为不存在的武将:`, name);
				return;
			}
		}
		const next = game.createEvent("changeCharacter");
		next.player = this;
		next.newPairs = newPairs;
		next.log = log;
		next.setContent("changeCharacter");
		return next;
	}
	/**
	 * 亮将函数，若num为0，则只亮主将，num为1，则只亮副将，num为2，则亮主将和副将
	 * @param { 0 | 1 | 2 } num
	 * @param { false } [log]
	 */
	showCharacter(num, log) {
		var toShow = [];
		if ((num == 0 || num == 2) && this.isUnseen(0)) {
			toShow.add(this.name1);
		}
		if ((num == 1 || num == 2) && this.isUnseen(1)) {
			toShow.add(this.name2);
		}
		if (!toShow.length) {
			return;
		}
		this.$showCharacter(num, log);
		this.$handleEquipChange();
		var next = game.createEvent("showCharacter", false);
		next.player = this;
		next.num = num;
		next.toShow = toShow;
		next._args = Array.from(arguments);
		next.setContent("showCharacter");
		var evt = _status.event;
		if (!["useSkill", "trigger"].includes(evt.name)) {
			evt.next.remove(next);
			if (evt.logSkill) {
				evt = evt.getParent();
			}
			evt.after.push(next);
		}
		return next;
	}
	/**
	 * @param { 0 | 1 | 2 } num
	 * @param { false } [log]
	 */
	$showCharacter(num, log) {
		if (num == 0 && !this.isUnseen(0)) {
			return;
		}
		if (num == 1 && (!this.name2 || !this.isUnseen(1))) {
			return;
		}
		if (!this.isUnseen(2)) {
			return;
		}
		game.addVideo("showCharacter", this, num);
		var skills;
		switch (num) {
			case 0:
				if (log !== false) {
					game.log(this, "展示了主将", "#b" + this.name1);
				}
				this.name = this.name1;
				skills = lib.character[this.name][3] || [];
				this.sex = lib.character[this.name][0];
				if (this.group == "unknown") {
					this.group = lib.character[this.name][1];
				}
				this.classList.remove("unseen");
				this.classList.remove("unseen_show");
				break;
			case 1:
				if (log !== false) {
					game.log(this, "展示了副将", "#b" + this.name2);
				}
				skills = lib.character[this.name2][3] || [];
				if (this.sex == "unknown") {
					this.sex = lib.character[this.name2][0];
				}
				if (this.name.startsWith("unknown")) {
					this.name = this.name2;
				}
				this.classList.remove("unseen2");
				this.classList.remove("unseen2_show");
				break;
			case 2:
				if (log !== false) {
					if (this.name2) {
						game.log(this, "展示了主将", "#b" + this.name1, "、副将", "#b" + this.name2);
					} else {
						game.log(this, "展示了主将", "#b" + this.name1);
					}
				}
				this.name = this.name1;
				var skills = lib.character[this.name][3] || [];
				if (this.name2) {
					skills = skills.concat(lib.character[this.name2][3] || []);
				}
				this.sex = lib.character[this.name][0];
				if (this.group == "unknown") {
					this.group = lib.character[this.name][1];
				}
				this.classList.remove("unseen");
				this.classList.remove("unseen2");
				this.classList.remove("unseen_show");
				this.classList.remove("unseen2_show");
				break;
		}
		if (!this.isUnseen(2)) {
			delete this.storage.nohp;
			this.hp = this.storage.rawHp + this.maxHp - 1;
			this.maxHp = this.storage.rawMaxHp + this.maxHp - 1;
			this.node.hp.show();
			this.update();
		}
		game.broadcast(
			function (player, name, sex, num, group) {
				player.group = group;
				player.name = name;
				player.sex = sex;
				switch (num) {
					case 0:
						player.classList.remove("unseen");
						player.classList.remove("unseen_show");
						break;
					case 1:
						player.classList.remove("unseen2");
						player.classList.remove("unseen2_show");
						break;
					case 2:
						player.classList.remove("unseen");
						player.classList.remove("unseen2");
						player.classList.remove("unseen_show");
						player.classList.remove("unseen2_show");
						break;
				}
				if (!player.isUnseen(2)) {
					delete player.storage.nohp;
					player.node.hp.show();
					player.update();
				}
			},
			this,
			this.name,
			this.sex,
			num,
			this.group
		);
		skills = skills.filter(skill => {
			var info = get.info(skill);
			if (info && info.zhuSkill && !this.isZhu2()) {
				return false;
			}
			return true;
		});
		for (var i = 0; i < skills.length; i++) {
			if (this.hiddenSkills.includes(skills[i])) {
				this.hiddenSkills.remove(skills[i]);
				this.addSkill(skills[i]);
			}
		}
		this.checkConflict();
	}
	chooseToPlayBeatmap(beatmap) {
		var next = game.createEvent("chooseToPlayBeatmap");
		next.player = this;
		next.beatmap = beatmap;
		next._args = Array.from(arguments);
		next.setContent("chooseToPlayBeatmap");
		return next;
	}
	chooseToMove() {
		var next = game.createEvent("chooseToMove");
		next.player = this;
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == "boolean") {
				next.forced = arguments[i];
			} else if (arguments[i] === "allowChooseAll") {
				next.allowChooseAll = true;
			} else if (typeof arguments[i] == "string") {
				next.prompt = arguments[i];
			}
		}
		next.setContent("chooseToMove");
		next.filterOk = function () {
			return true;
		};
		next.filterMove = function () {
			return true;
		};
		next._args = Array.from(arguments);
		return next;
	}
	chooseToMove_new() {
		var next = game.createEvent("chooseToMove_new");
		next.player = this;
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == "boolean") {
				next.forced = arguments[i];
			} else if (typeof arguments[i] == "string") {
				next.prompt = arguments[i];
			}
		}
		next.setContent("chooseToMove_new");
		next.filterOk = function () {
			return true;
		};
		next.filterMove = function () {
			return true;
		};
		next._args = Array.from(arguments);
		return next;
	}
	chooseToGuanxing(num) {
		var next = game.createEvent("chooseToGuanxing");
		next.num = num || 1;
		next.player = this;
		next.setContent("chooseToGuanxing");
		return next;
	}
	/**
	 * @param { Player } target
	 * @param { string } name
	 * @param {*} rotate
	 */
	$throwEmotion(target, name, rotate) {
		game.addVideo("throwEmotion", this, [target.dataset.position, name]);
		var getLeft = function (player) {
			if (player == game.me && !ui.fakeme && !ui.chess) {
				return player.getLeft() + player.node.avatar.offsetWidth / 2;
			}
			return player.getLeft() + player.offsetWidth / 2;
		};
		var player = this;
		var emotion = ui.create.div(
			"",
			'<div style="text-align:center"> <img src="' + lib.assetURL + "image/emotion/throw_emotion/" + name + '1.png"> </div>',
			game.chess ? ui.chess : ui.window
		);
		emotion.style.width = "60px";
		emotion.style.height = "60px";
		var width = emotion.offsetWidth / 2;
		var height = emotion.offsetHeight / 2;
		if (game.chess) {
			width += 60;
		}
		var left = getLeft(player) - width;
		var top = player.getTop() + player.offsetHeight / 3 - height;
		emotion.style.left = left + "px";
		emotion.style.top = top + "px";
		var left2 = getLeft(target) - width;
		var top2 = target.getTop() + target.offsetHeight / 3 - height;
		if (["egg", "flower", "shoe"].includes(name) || rotate) {
			var num1 = 0.95 + Math.random() * (1.1 - 0.95);
			var num2 = 1 + Math.random() * (3 - 1);
			var left2 = getLeft(target) / num1 - width;
			var top2 = target.getTop() + target.offsetHeight / num2 - height;
		} else {
			var left2 = getLeft(target) - width;
			var top2 = target.getTop() + target.offsetHeight / 3 - height;
		}
		emotion.style["z-index"] = 10;
		emotion.style.transform = "translateY(" + (top2 - top) + "px) translateX(" + (left2 - left) + "px)";
		// @ts-expect-error ignore
		if (["egg", "flower", "shoe"].includes(name) || rotate) {
			emotion.firstElementChild.style.transform = "rotate(1440deg)";
		}
		if (lib.config.background_audio) {
			game.playAudio("effect", "throw_" + name + get.rand(1, 2));
		}
		setTimeout(function () {
			emotion.innerHTML =
				'<div style="text-align:center"> <img src="' + lib.assetURL + "image/emotion/throw_emotion/" + name + '2.png"> </div>';
			setTimeout(function () {
				emotion.delete();
			}, 1200);
		}, 600);
	}
	/**
	 * @param { boolean } bool
	 */
	tryJudgeAnimate(bool) {
		game.broadcast(
			function (player, bool) {
				player.tryJudgeAnimate(bool);
			},
			this,
			bool
		);
		if (bool) {
			this.popup("判定生效", "wood", false);
		} else {
			this.popup("判定失效", "fire", false);
		}
	}
	/**
	 * @param { string } name
	 * @param { string } popname
	 * @param { 'main' | 'vice' | boolean } checkShow
	 */
	trySkillAnimate(name, popname, checkShow) {
		game.callHook("checkSkillAnimate", [this, name, popname]);
		if (!game.online && lib.config.skill_animation_type != "off" && lib.skill[name] && lib.skill[name].skillAnimation) {
			if (lib.config.skill_animation_type == "default") {
				checkShow = checkShow || "main";
			} else {
				checkShow = false;
			}
			if (lib.skill[name].textAnimation) {
				checkShow = false;
			}
			this.$skill(
				lib.skill[name].animationStr || lib.translate[name],
				lib.skill[name].skillAnimation,
				lib.skill[name].animationColor,
				checkShow
			);
			return;
		}
		var player = this;
		game.broadcast(
			function (player, name, popname) {
				player.trySkillAnimate(name, popname);
			},
			player,
			name,
			popname
		);
		if (lib.animate.skill[name]) {
			lib.animate.skill[name].apply(this, arguments);
		} else {
			if (popname != name) {
				this.popup(popname, "water", false);
			} else {
				this.popup(get.skillTranslation(name, this), "water", false);
			}
		}
	}
	/**
	 * @param { Card } card
	 * @param { string } name
	 * @param { string } [nature]
	 * @param { string } [popname]
	 */
	tryCardAnimate(card, name, nature, popname) {
		game.broadcast(
			function (player, card, name, nature, popname) {
				player.tryCardAnimate(card, name, nature, popname);
			},
			this,
			card,
			name,
			nature,
			popname
		);
		if (lib.animate.card[card.name]) {
			lib.animate.card[card.name].apply(this, arguments);
		} else {
			if (!lib.config.show_card_prompt) {
				return;
			}
			if (get.type(card) == "equip" && lib.config.hide_card_prompt_equip) {
				return;
			}
			if (get.type(card) == "basic" && lib.config.hide_card_prompt_basic) {
				return;
			}
			if (popname) {
				this.popup({ name: card.name, nature: card.nature }, nature, false);
			} else {
				this.popup(name, nature, false);
			}
		}
	}
	/**
	 * @param { string } name
	 * @param { string } type
	 * @returns { boolean | undefined }
	 */
	hasUsableCard(name, type) {
		const player = this;
		if (typeof type !== "string") {
			type = type ? "limit" : "all";
		}
		let event = get.event();
		let evtNames =
			typeof type !== "string" || type === "all"
				? ["chooseToUse", "chooseToRespond"]
				: ["chooseTo" + type.slice(0, 1).toUpperCase() + type.slice(1)];
		if (
			player.hasCard(i => {
				if (get.name(i, player) !== name) {
					return false;
				}
				if (type === "all") {
					return true;
				}
				return evtNames.some(evtName => {
					let evt = event.getParent(evtName);
					if (get.itemtype(evt) !== "event") {
						evt = event;
					}
					if (type === "respond") {
						return lib.filter.cardRespondable(i, player, evt);
					}
					return lib.filter.cardEnabled(i, player, type === "limit" ? evt : "forceEnable");
				});
			}, "hs")
		) {
			return true;
		}
		const checkEnable = (enable, event, evtName) => {
			if (typeof enable === "function") {
				return enable(event);
			}
			if (Array.isArray(enable)) {
				return enable.some(i => checkEnable(i, event, evtName));
			}
			if (enable === "phaseUse") {
				return event.type === "phase" && evtName === "chooseToUse";
			}
			if (typeof enable === "string") {
				return enable === evtName;
			}
			return false;
		};
		const skills = player.getSkills("invisible").concat(lib.skill.global);
		game.expandSkills(skills);
		for (let i = 0; i < skills.length; i++) {
			const skill = skills[i],
				info = get.info(skill),
				hiddenCard = info.hiddenCard;
			if (info.usable !== undefined) {
				let num = info.usable;
				if (typeof num === "function") {
					num = info.usable(skill, player);
				}
				if (typeof num === "number" && get.skillCount(skill, player) >= num) {
					continue;
				}
			}
			if (info.round && info.round - (game.roundNumber - player.storage[skill + "_roundcount"]) > 0) {
				continue;
			}
			if (player.storage[`temp_ban_${skill}`]) {
				continue;
			}
			if (info.viewAs && get.is.object(info.viewAs) && info.viewAs?.name === name) {
				const goon = !info.viewAsFilter || info.viewAsFilter(player) !== false;
				const bool =
					!info.filter ||
					(typeof info.filter === "function" &&
						evtNames.some(evtName => {
							let evt = event.getParent(evtName);
							if (get.itemtype(evt) !== "event") {
								evt = get.event();
							}
							if (!evt || !checkEnable(info.enable, evt, evtName)) {
								return false;
							}
							if (
								evt.name === evtName &&
								typeof evt.filterCard == "function" &&
								!evt.filterCard(get.autoViewAs(info.viewAs, "unsure"), player, evt)
							) {
								return false;
							}
							if (evt.name === evtName && info["on" + evtName.slice(0, 1).toUpperCase() + evtName.slice(1)]) {
								info["on" + evtName.slice(0, 1).toUpperCase() + evtName.slice(1)](evt);
							}
							return evt.name === evtName ? info.filter(evt, player, evt.triggername) : true;
						}));
				if (goon && bool) {
					return true;
				}
			} else if (typeof hiddenCard == "function") {
				const goon = hiddenCard(player, name);
				const bool =
					!info.filter ||
					(info.enable &&
						typeof info.filter === "function" &&
						evtNames.some(evtName => {
							let evt = event.getParent(evtName);
							if (get.itemtype(evt) !== "event") {
								evt = get.event();
							}
							if (!evt || !checkEnable(info.enable, evt, evtName)) {
								return false;
							}
							if (evt.name === evtName && info["on" + evtName.slice(0, 1).toUpperCase() + evtName.slice(1)]) {
								info["on" + evtName.slice(0, 1).toUpperCase() + evtName.slice(1)](evt);
							}
							return evt.name === evtName ? info.filter(evt, player, evt.triggername) : true;
						}));
				if (goon && bool) {
					return true;
				}
			}
		}
		return false;
	}
	/**
	 * @param { Player } to
	 * @returns { boolean }
	 */
	inRange(to) {
		const from = this;
		if (from == to || from.hasSkill("undist") || to.hasSkill("undist")) {
			return false;
		}
		if (!game.players.includes(from) && !game.dead.includes(from)) {
			return false;
		}
		if (!game.players.includes(to) && !game.dead.includes(to)) {
			return false;
		}
		const mod1 = game.checkMod(from, to, "unchanged", "inRange", from);
		if (mod1 != "unchanged") {
			return mod1;
		}
		const mod2 = game.checkMod(from, to, "unchanged", "inRangeOf", to);
		if (mod2 != "unchanged") {
			return mod2;
		}
		const range = from.getAttackRange();
		if (range < 1) {
			return false;
		}
		let player = from,
			m,
			n = 1;
		let fxy, txy;
		if (game.chess) {
			fxy = from.getXY();
			txy = to.getXY();
			n = Math.abs(fxy[0] - txy[0]) + Math.abs(fxy[1] - txy[1]);
		} else if (to.isMin(true) || from.isMin(true)) {
			/* empty */
		} else {
			let length = game.players.length;
			let totalPopulation = game.players.length + game.dead.length + 1;
			for (let iwhile = 0; iwhile < totalPopulation; iwhile++) {
				if (player.nextSeat != to) {
					player = player.nextSeat;
					if (player.isAlive() && !player.isOut() && !player.hasSkill("undist") && !player.isMin(true)) {
						n++;
					}
				} else {
					break;
				}
			}
			for (let i = 0; i < game.players.length; i++) {
				if (game.players[i].isOut() || game.players[i].hasSkill("undist") || game.players[i].isMin(true)) {
					length--;
				}
			}
			if (from.isDead()) {
				length++;
			}
			if (to.isDead()) {
				length++;
			}
			let left = from.hasSkillTag("left_hand");
			let right = from.hasSkillTag("right_hand");
			if (left === right) {
				n = Math.min(n, length - n);
			} else if (left == true) {
				n = length - n;
			}
		}
		n = game.checkMod(from, to, n, "globalFrom", from);
		n = game.checkMod(from, to, n, "globalTo", to);
		m = n;
		m = game.checkMod(from, to, m, "attackFrom", from);
		m = game.checkMod(from, to, m, "attackTo", to);
		const equips1 = from.getVCards("e", function (card) {
				return !card.cards?.some(card => {
					return ui.selected.cards?.includes(card);
				});
			}),
			equips2 = to.getVCards("e", function (card) {
				return !card.cards?.some(card => {
					return ui.selected.cards?.includes(card);
				});
			});
		for (let i = 0; i < equips1.length; i++) {
			const info = get.info(equips1[i]).distance;
			if (!info) {
				continue;
			}
			if (info.globalFrom) {
				m += info.globalFrom;
				n += info.globalFrom;
			}
		}
		for (let i = 0; i < equips2.length; i++) {
			const info = get.info(equips2[i]).distance;
			if (!info) {
				continue;
			}
			if (info.globalTo) {
				m += info.globalTo;
				n += info.globalTo;
			}
			if (info.attackTo) {
				m += info.attackTo;
			}
		}
		return m <= range;
	}
	/**
	 * @param { Player } source
	 * @returns { boolean }
	 */
	inRangeOf(source) {
		return source.inRange(this);
	}
	/**
	 * Get the player's HP not less than 0. Set “raw” to true to get the player's raw HP instead.
	 *
	 * 获取角色的体力值。设置“raw”为true以获取角色的体力。
	 *
	 * @param { boolean } [raw]
	 * @returns { number }
	 */
	getHp(raw) {
		return raw ? this.hp : Math.max(0, this.hp);
	}
	/**
	 * Set “raw” to true to get the player's raw damaged HP instead.
	 *
	 * 设置“raw”为true以获取角色已损失的体力。
	 *
	 * @param { boolean } [raw]
	 * @returns { number }
	 */
	getDamagedHp(raw) {
		if (this.getHp(raw) == Infinity) {
			return 0;
		}
		return this.maxHp - this.getHp(raw);
	}
	/**
	 * 将玩家切换至某个势力
	 * @param { string } group
	 * @param { boolean } [log]
	 * @param { "nobroadcast" } [broadcast]
	 * @returns { GameEvent }
	 */
	changeGroup(group, log, broadcast) {
		const next = game.createEvent("changeGroup");
		next.player = this;
		next.group = group;
		next.log = typeof log === "boolean" ? log : true;
		next.broadcast = broadcast !== "nobroadcast";
		next.setContent("changeGroup");
		return next;
	}
	/**
	 * @param { Player } target
	 */
	chooseToDuiben(target) {
		var next = game.createEvent("chooseToDuiben");
		next.player = this;
		next.target = target;
		next.setContent("chooseToDuiben");
		return next;
	}
	/**
	 * 令玩家与target划拳
	 * @param { Player } target
	 * @returns { GameEvent }
	 */
	chooseToPSS(target) {
		var next = game.createEvent("chooseToPSS");
		next.player = this;
		next.target = target;
		next.setContent("chooseToPSS");
		return next;
	}
	/**
	 * 令玩家选择恢复一个已废除的装备栏
	 * @returns { GameEvent }
	 */
	chooseToEnable() {
		var next = game.createEvent("chooseToEnable");
		for (var i = 0; i < arguments.length; i++) {
			if (get.itemtype(arguments[i]) == "player") {
				next.source = arguments[i];
			} else if (get.itemtype(arguments[i]) == "select") {
				next.selectButton = arguments[i];
			} else if (typeof arguments[i] == "number") {
				next.selectButton = [arguments[i], arguments[i]];
			}
		}
		if (next.source == undefined) {
			next.source = this;
		}
		next.player = this;
		next.setContent("chooseToEnable");
		return next;
	}
	/**
	 * 令玩家选择废除一个未废除的装备栏
	 * @returns { GameEvent }
	 */
	chooseToDisable() {
		var next = game.createEvent("chooseToDisable");
		for (var i = 0; i < arguments.length; i++) {
			if (get.itemtype(arguments[i]) == "player") {
				next.source = arguments[i];
			} else if (typeof arguments[i] == "boolean") {
				next.horse = arguments[i];
			} else if (get.itemtype(arguments[i]) == "select") {
				next.selectButton = arguments[i];
			} else if (typeof arguments[i] == "number") {
				next.selectButton = [arguments[i], arguments[i]];
			}
		}
		if (next.horse == undefined) {
			next.horse = false;
		}
		if (next.source == undefined) {
			next.source = this;
		}
		next.player = this;
		next.setContent("chooseToDisable");
		return next;
	}
	/**
	 * 返回玩家是否处于出牌阶段
	 * @param { boolean } [notmeisok]
	 */
	isPhaseUsing(notmeisok) {
		if (!notmeisok && _status.currentPhase != this) {
			return false;
		}
		// @ts-expect-error ignore
		return _status.event.name == "phaseUse" || _status.event.getParent("phaseUse").name == "phaseUse";
	}
	/**
	 * 与target交换装备区里的牌
	 * @param { Player } target
	 */
	swapEquip(target) {
		var next = game.createEvent("swapEquip");
		next.player = this;
		next.target = target;
		next.setContent("swapEquip");
		return next;
	}
	/**
	 * 返回玩家是否可以与target拼点
	 * @param { Player } target
	 * @param { boolean } [goon] 忽略玩家的手牌不足以拼点
	 * @param { boolean} [bool] 忽略target的手牌不足以拼点
	 */
	canCompare(target, goon, bool) {
		if (this == target) {
			return false;
		}
		if ((!this.countCards("h") && goon !== true) || (!target.countCards("h") && bool !== true)) {
			return false;
		}
		if (this.hasSkillTag("noCompareSource") || target.hasSkillTag("noCompareTarget")) {
			return false;
		}
		return true;
	}
	$disableJudge() {
		this.storage._disableJudge = true;
		for (let i = 0; i < this.node.judges.childNodes.length; i++) {
			if (this.node.judges.childNodes[i].classList.contains("feichu")) {
				return;
			}
		}
		game.addVideo("$disableJudge", this);
		var card = game.createCard("disable_judge", "", "");
		card.fix();
		card.classList.add("feichu");
		card.style.transform = "";
		card.classList.add("drawinghidden");
		this.node.judges.insertBefore(card, this.node.judges.firstChild);
		ui.updatej(this);
	}
	$enableJudge() {
		game.addVideo("$enableJudge", this);
		this.storage._disableJudge = false;
		for (let i = 0; i < this.node.judges.childNodes.length; i++) {
			// @ts-expect-error ignore
			if (this.node.judges.childNodes[i].name == "disable_judge") {
				this.node.judges.removeChild(this.node.judges.childNodes[i]);
				break;
			}
		}
	}
	disableJudge() {
		var next = game.createEvent("disableJudge");
		next.player = this;
		next.source = _status.event.player;
		next.setContent("disableJudge");
		return next;
	}
	enableJudge() {
		var next = game.createEvent("enableJudge");
		next.player = this;
		next.source = _status.event.player;
		next.setContent("enableJudge");
		return next;
	}
	//原有函数
	init(character, character2, skill, update) {
		let hidden = false;
		if (typeof character == "string" && !lib.character[character]) {
			lib.character[character] = get.character(character);
		}
		if (typeof character2 == "string" && !lib.character[character2]) {
			lib.character[character2] = get.character(character2);
		}
		if (!lib.character[character]) {
			return;
		}
		if (get.is.jun(character2)) {
			var tmp = character;
			character = character2;
			character2 = tmp;
		}
		if (character2 == false) {
			skill = false;
			character2 = null;
		}
		var info = lib.character[character];
		if (!info) {
			info = get.convertedCharacter(["", "", 1, [], []]);
		}
		var skills = info.skills.slice(0);
		this.clearSkills(true);

		var hp1 = info.hp;
		var maxHp1 = info.maxHp;
		var hujia1 = info.hujia;

		this.name = character;
		this.name1 = character;
		this.tempname = [];
		this.skin = {
			name: character,
			name2: character2,
		};
		this.sex = info.sex;
		this.group = info.group;
		this.hp = hp1;
		this.maxHp = maxHp1;
		this.hujia = hujia1;
		this.node.intro.innerHTML = lib.config.intro;
		this.node.name.dataset.nature = get.groupnature(this.group);
		lib.setIntro(this);
		this.node.name.innerHTML = get.slimName(character);
		if (this.classList.contains("minskin") && this.node.name.querySelectorAll("br").length >= 4) {
			this.node.name.classList.add("long");
		}
		if (info.hasHiddenSkill && !this.noclick) {
			if (!this.hiddenSkills) {
				this.hiddenSkills = [];
			}
			this.hiddenSkills.addArray(skills);
			skills = [];
			this.name = "unknown";
			this.sex = "male";
			hidden = true;
			skills.add("g_hidden_ai");
		}
		if (character2 && lib.character[character2]) {
			var info2 = lib.character[character2];
			if (!info2) {
				info2 = get.convertedCharacter(["", "", 1, [], []]);
			}

			this.name2 = character2;
			var hp2 = info2.hp;
			var maxHp2 = info2.maxHp;
			var hujia2 = info2.hujia;
			this.hujia += hujia2;
			var double_hp;
			if (_status.connectMode || (get.mode() == "single" && _status.mode == "changban")) {
				double_hp = "pingjun";
			} else {
				double_hp = get.config("double_hp");
			}
			switch (double_hp) {
				case "pingjun": {
					this.maxHp = Math.floor((maxHp1 + maxHp2) / 2);
					this.hp = Math.floor((hp1 + hp2) / 2);
					this.singleHp = (maxHp1 + maxHp2) % 2 === 1;
					break;
				}
				case "zuidazhi": {
					this.maxHp = Math.max(maxHp1, maxHp2);
					this.hp = Math.max(hp1, hp2);
					break;
				}
				case "zuixiaozhi": {
					this.maxHp = Math.min(maxHp1, maxHp2);
					this.hp = Math.min(hp1, hp2);
					break;
				}
				case "zonghe": {
					this.maxHp = maxHp1 + maxHp2;
					this.hp = hp1 + hp2;
					break;
				}
				default: {
					this.maxHp = maxHp1 + maxHp2 - 3;
					this.hp = hp1 + hp2 - 3;
				}
			}
			if (info2.hasHiddenSkill && !this.noclick) {
				if (!this.hiddenSkills) {
					this.hiddenSkills = [];
				}
				this.hiddenSkills.addArray(info2.skills);
				hidden = true;
				skills.add("g_hidden_ai");
			} else {
				skills = skills.concat(info2.skills);
			}
		}
		if (this.storage.nohp || hidden) {
			this.storage.rawHp = this.hp;
			this.storage.rawMaxHp = this.maxHp;
			this.hp = 1;
			this.maxHp = 1;
			if (this.storage.nohp) {
				this.node.hp.hide();
			}
		}
		if (skill != false) {
			skills = skills.filter(skill => {
				var info = get.info(skill);
				if (info && info.zhuSkill && !this.isZhu2()) {
					return false;
				}
				return true;
			});
			for (var i = 0; i < skills.length; i++) {
				this.addSkill(skills[i], null, true);
			}
			this.checkConflict();
		}
		lib.group.add(this.group);

		this.$init(character, character2);

		if (this.inits) {
			for (var i = 0; i < this.inits.length; i++) {
				this.inits[i](this);
			}
		}
		if (this._inits) {
			for (var i = 0; i < this._inits.length; i++) {
				this._inits[i](this);
			}
		}
		if (update !== false) {
			this.$update();
		}
		return this;
	}
	$init(character, character2) {
		this.classList.add("fullskin");
		var info = lib.character[character];
		if (!info) {
			info = get.convertedCharacter(["", "", 1, [], []]);
		}

		if (!game.minskin && get.is.newLayout() && !info.isMinskin) {
			this.classList.remove("minskin");
			this.node.avatar.setBackground(character, "character");
		} else {
			this.node.avatar.setBackground(character, "character");
			if (info.isMinskin) {
				this.classList.add("minskin");
			} else if (game.minskin) {
				this.classList.add("minskin");
			} else {
				this.classList.remove("minskin");
			}
		}

		this.node.avatar.show();
		this.node.count.show();
		this.node.equips.show();

		this.node.intro.innerHTML = lib.config.intro;
		this.node.name.dataset.nature = get.groupnature(this.group);
		lib.setIntro(this);
		this.node.name.innerHTML = get.slimName(character);
		if (this.classList.contains("minskin") && this.node.name.querySelectorAll("br").length >= 4) {
			this.node.name.classList.add("long");
		}
		if (info.hasHiddenSkill && !this.noclick) {
			if (!_status.video && get.mode() != "guozhan") {
				this.classList.add("unseen_show");
			}
			this.classList.add(_status.video ? "unseen_v" : "unseen");
			if (!this.node.name_seat && !_status.video) {
				this.node.name_seat = ui.create.div(".name.name_seat", get.verticalStr(get.translation(this.name)), this);
				this.node.name_seat.dataset.nature = get.groupnature(this.group);
			}
		}
		if (character2 && lib.character[character2]) {
			var info2 = lib.character[character2];
			if (!info2) {
				info2 = get.convertedCharacter(["", "", 1, [], []]);
			}
			this.classList.add("fullskin2");
			this.node.avatar2.setBackground(character2, "character");
			this.node.avatar2.show();
			this.name2 = character2;

			this.node.count.classList.add("p2");
			if (info2.hasHiddenSkill && !this.noclick) {
				if (!_status.video && get.mode() != "guozhan") {
					this.classList.add("unseen2_show");
				}
				this.classList.add(_status.video ? "unseen2_v" : "unseen2");
			}
			this.node.name2.innerHTML = get.slimName(character2);
		}
		if (this.storage.nohp) {
			this.node.hp.hide();
		}

		return this;
	}
	/**
	 * 换肤换音：想要支持某个武将更换皮肤，必须在lib.character.characterSubstitute中存在该武将的id（以下以name代指武将id，character代指换肤图片名）
	 *
	 * 如果换肤换音引用本体的image/character素材作为更换的皮肤且不需要使用本体audio/die以外的地方的配音，则你无需在characterSubstitute中书写关于此皮肤的信息
	 *
	 * 如果lib.character[character]不存在，且想引用其他路径的图片素材或阵亡素材，请以[character,[]]的形式写入lib.character.characterSubstitute[name]中，第二个数组填入形式同lib.character[4]的书写形式
	 *
	 * @param { string | object | function } map
	 * @param { string } character
	 */
	changeSkin(map, character) {
		//TODO: 这一坨改不动了 谁爱改谁改
		if (!map || !character) {
			console.warn("error: no sourceMap or character to changeSkin", get.translation(this));
			return;
		}
		if (typeof map == "string") {
			map = { skill: map };
		}
		for (const i of ["name", "name1", "name2"]) {
			if (i == "name" && get.mode() == "guozhan") {
				continue;
			}
			if (i == "name1" && this.name === this.name1 && get.mode() != "guozhan") {
				continue;
			}
			const list = lib.characterSubstitute[this[i]];
			if (this[i] && list) {
				const name = i == "name2" ? "name2" : "name";
				if (
					(() => {
						if (typeof map == "function") {
							return map(this, name);
						}
						if (typeof map.skill == "string" && get.character(this[i], 3).includes(map.skill)) {
							return true;
						}
						if (typeof map.characterName == "string" && this[i] == map.characterName) {
							return true;
						}
						if (typeof map.characterSkinName == "string" && this.skin[name] == map.characterSkinName) {
							return true;
						}
						if (typeof map.source == "string" && name == map.source) {
							return true;
						}
						return false;
					})()
				) {
					if (this.skin[name] != character) {
						const origin = this.skin[name];
						game.broadcastAll(
							(player, name, character, list, origin) => {
								player.tempname.remove(origin);
								player.tempname.add(character);
								player.skin[name] = character;
								const goon = !lib.character[character];
								if (goon) {
									lib.character[character] = get.convertedCharacter([
										"",
										"",
										0,
										[],
										(list.find(i => i[0] == character) || [character, []])[1],
									]);
								}
								player.smoothAvatar(name == "name2");
								const skinImg = !lib.config.skin[character] && lib.character[character]?.img;
								skinImg
									? player.node["avatar" + name.slice(4)].setBackgroundImage(skinImg)
									: player.node["avatar" + name.slice(4)].setBackground(character, "character");
								player.node["avatar" + name.slice(4)].show();
								if (goon) {
									delete lib.character[character];
								}
							},
							this,
							name,
							character,
							list,
							origin
						);
						game.addVideo("changeSkin", this, {
							from: origin,
							to: character,
							name: name,
							list: list,
							avatar2: name == "name2",
						});
					}
				}
			}
		}
	}
	changeSkinByName(character, index) {
		const name = index == 2 ? "name2" : "name";
		const list = lib.characterSubstitute[this[name]];
		if (list && lib.characterSubstitute[this[name]]) {
			const origin = this.skin[name];
			game.broadcastAll(
				(player, name, character, list, origin) => {
					player.tempname.remove(origin);
					player.tempname.add(character);
					player.skin[name] = character;
					const goon = !lib.character[character];
					if (goon) {
						lib.character[character] = ["", "", 0, [], (list.find(i => i[0] == character) || [character, []])[1]];
					}
					player.smoothAvatar(name == "name2");
					player.node["avatar" + name.slice(4)].setBackground(character, "character");
					player.node["avatar" + name.slice(4)].show();
					if (goon) {
						delete lib.character[character];
					}
				},
				this,
				name,
				character,
				list,
				origin
			);
			game.addVideo("changeSkin", this, {
				from: origin,
				to: character,
				name: name,
				list: list,
				avatar2: name == "name2",
			});
		}
	}
	initOL(name, character) {
		this.node.avatar.setBackground(character, "character");
		this.node.avatar.show();
		this.node.name.innerHTML = get.verticalStr(name);
		this.nickname = name;
		this.avatar = character;
		this.node.nameol.innerHTML = "";
		if (lib.character[character]) {
			this.sex = lib.character[character][0];
		}
	}
	uninitOL() {
		this.node.avatar.hide();
		this.node.name.innerHTML = "";
		this.node.identity.firstChild.innerHTML = "";
		delete this.nickname;
		delete this.avatar;
		delete this.sex;
	}
	initRoom(info, info2) {
		var str = "";
		this.serving = false;
		if (!info || info == "server") {
			this.roomempty = true;
			str = "空房间";
			this.roomfull = false;
			this.roomgaming = false;
			this.version = null;
			if (info == "server") {
				this.serving = true;
			}
		} else {
			if (info.length) {
				var config = info[2];
				this.key = info[4];
				this.roomempty = false;
				str += get.modetrans(config);
				str += " 模式　";
				for (var i = str.length; i < 11; i++) {
					str += "　";
				}
				this.version = config.version;
				if (config.gameStarted) {
					str += '<span class="firetext">游戏中</span>　';
					if (config.observe && config.observeReady && this.version == lib.versionOL) {
						this.classList.remove("exclude");
					} else {
						this.classList.add("exclude");
					}
				} else {
					str += '<span class="greentext">等待中</span>　';
					if (this.version != lib.versionOL) {
						this.classList.add("exclude");
					} else {
						this.classList.remove("exclude");
					}
				}
				this.maxHp = parseInt(config.number);
				this.hp = Math.min(this.maxHp, info[3]);
				if (this.hp < this.maxHp || config.gameStarted) {
					str += "人数：" + this.hp + "/" + this.maxHp;
				} else {
					str += '人数：<span class="firetext">' + this.hp + "/" + this.maxHp + "</span>";
				}

				str += "　(" + info[0].slice(0, 12) + " 的房间)";
				if (config.mode != "guozhan" && (config.mode != "doudizhu" || config.doudizhu_mode != "online")) {
					str += "【";
					for (var i = 0; i < config.cardPack.length; i++) {
						str += get.translation(config.cardPack[i] + "_card_config").slice(0, 2);
						if (i < config.cardPack.length - 1) {
							str += "+";
						}
					}
					str += "】";
				}
				this.config = config;
				if (this.hp == this.maxHp && !config.gameStarted) {
					this.roomfull = true;
				} else {
					this.roomfull = false;
				}
				if (config.gameStarted && (!config.observe || !config.observeReady)) {
					this.roomgaming = true;
				} else {
					this.roomgaming = false;
				}
			} else {
				str = "异常房间";
				this.roomfull = true;
				this.classList.add("exclude");
			}
		}
		this.firstChild.innerHTML = str;
		return this;
	}
	reinit2(newPairs) {
		const player = this;
		game.broadcast(
			(player, newPairs) => {
				player.reinit2(newPairs);
			},
			this,
			newPairs
		);
		const rawPairs = [this.name1];
		if (this.name2 && lib.character[this.name2]) {
			rawPairs.push(this.name2);
		}
		//单将变单将 & 双将变双将
		if (rawPairs.length == newPairs.length) {
			for (let i = 0; i < Math.min(2, rawPairs.length); i++) {
				let rawName = rawPairs[i],
					newName = newPairs[i];
				if (rawName != newName && lib.character[rawName] && lib.character[newName]) {
					player.reinit(rawName, newName, null, true);
				}
			}
		}
		//单将变双将
		else if (rawPairs.length == 1 && newPairs.length == 2) {
			player.name1 = newPairs[0];
			player.name2 = newPairs[1];
			player.$reinit12(newPairs);
		}
		//双将变单将
		else if (rawPairs.length == 2 && newPairs.length == 1) {
			player.name1 = newPairs[0];
			delete player.name2;
			player.$reinit21(newPairs);
		}
		//修改性别
		if (!player.isUnseen(1)) {
			player.name = player.name1;
			player.sex = get.character(player.name1, 0);
		} else if (!player.isUnseen(2)) {
			player.name = player.name2;
			player.sex = get.character(player.name2, 0);
		}
	}
	$reinit12(newPairs) {
		const player = this;
		player.node.avatar.setBackground(newPairs[0], "character");
		player.node.name.innerHTML = get.slimName(newPairs[0]);
		player.name2 = newPairs[1];
		player.classList.add("fullskin2");
		player.node.avatar2.classList.remove("hidden");
		player.node.avatar2.setBackground(newPairs[1], "character");
		player.node.name2.innerHTML = get.slimName(newPairs[1]);
		if (player == game.me && ui.fakeme) {
			ui.fakeme.style.backgroundImage = player.node.avatar.style.backgroundImage;
		}
	}
	$reinit21(newPairs) {
		const player = this,
			name = newPairs[0];
		player.smoothAvatar(false);
		player.node.avatar.setBackground(name, "character");
		player.node.name.innerHTML = get.slimName(name);
		player.classList.remove("fullskin2");
		player.node.avatar2.classList.add("hidden");
		player.node.name2.innerHTML = "";
		if (player == game.me && ui.fakeme) {
			ui.fakeme.style.backgroundImage = player.node.avatar.style.backgroundImage;
		}
	}
	reinit(from, to, maxHp, online) {
		var info1 = lib.character[from];
		var info2 = lib.character[to];
		var smooth = true,
			replaced = null;
		if (maxHp == "nosmooth") {
			smooth = false;
			maxHp = null;
		}
		if (this.name2 == from) {
			this.name2 = to;
			this.skin.name2 = to;
		} else if (this.name == from || this.name1 == from) {
			if (this.name1 == from) {
				this.name1 = to;
				this.skin.name = to;
			}
			if (!this.isUnseen(1)) {
				this.name = to;
				if (this.skin.name != to) {
					this.skin.name = to;
				}
				this.sex = info2[0];
			}
		} else {
			return this;
		}
		if (!online) {
			for (var i = 0; i < info1[3].length; i++) {
				this.removeSkill(info1[3][i]);
			}
			for (var i = 0; i < info2[3].length; i++) {
				var info = get.info(info2[3][i]);
				if (info && info.zhuSkill && !this.isZhu2()) {
					continue;
				}
				this.addSkill(info2[3][i]);
			}
			if (Array.isArray(maxHp)) {
				this.maxHp = maxHp[1];
				this.hp = maxHp[0];
				if (typeof maxHp[2] == "number") {
					this.hujia = maxHp[2];
				}
			} else {
				var num;
				if (maxHp === false) {
					num = 0;
				} else {
					if (typeof maxHp != "number") {
						maxHp = get.infoMaxHp(info2[2]);
					}
					num = maxHp - get.infoMaxHp(info1[2]);
				}
				if (typeof this.singleHp == "boolean") {
					if (num % 2 != 0) {
						if (this.singleHp) {
							this.maxHp += (num + 1) / 2;
							this.singleHp = false;
						} else {
							this.maxHp += (num - 1) / 2;
							this.singleHp = true;
							if (!game.online) {
								this.doubleDraw();
							}
						}
					} else {
						this.maxHp += num / 2;
					}
				} else {
					this.maxHp += num;
				}
			}
			game.broadcast(
				function (player, from, to, skills) {
					player.reinit(from, to, null, true);
					player.applySkills(skills);
				},
				this,
				from,
				to,
				get.skillState(this)
			);
		}
		game.addVideo("reinit3", this, {
			from: from,
			to: to,
			hp: this.maxHp,
			avatar2: this.name2 == to,
		});
		this.$reinit(from, to, maxHp, online);
		this.update();
	}
	$reinit(from, to, maxHp, online) {
		var smooth = true;
		if (maxHp == "nosmooth") {
			smooth = false;
			maxHp = null;
		}
		if (this.name2 == to) {
			if (smooth) {
				this.smoothAvatar(true);
			}
			this.node.avatar2.setBackground(to, "character");
			this.node.name2.innerHTML = get.slimName(to);
		} else if (this.name == to || this.name1 == to) {
			if (smooth) {
				this.smoothAvatar(false);
			}
			this.node.avatar.setBackground(to, "character");
			this.node.name.innerHTML = get.slimName(to);

			if (this == game.me && ui.fakeme) {
				ui.fakeme.style.backgroundImage = this.node.avatar.style.backgroundImage;
			}
		}
	}
	uninit() {
		delete this.name;
		delete this.name1;
		delete this.tempname;
		delete this.skin;
		delete this.sex;
		delete this.group;
		delete this.hp;
		delete this.maxHp;
		delete this.hujia;

		if (this.name2) {
			delete this.singleHp;
			delete this.name2;
		}

		this.skipList = [];
		this.clearSkills(true);
		this.initedSkills = [];
		this.additionalSkills = {};
		this.disabledSkills = {};
		this.hiddenSkills = [];
		this.awakenedSkills = [];
		this.forbiddenSkills = {};
		this.phaseNumber = 0;
		this.stat = [{ card: {}, skill: {}, triggerSkill: {} }];
		this.tempSkills = {};
		this.storage = { counttrigger: this.storage.counttrigger };
		this.expandedSlots = {};
		this.disabledSlots = {};
		this.ai = { friend: [], enemy: [], neutral: [] };
		/*
		this.vcardsMap = {
			handcards: [],
			equips: [],
			judges: [],
		};
		*/

		this.$uninit();
		this.marks = {};

		return this;
	}
	$uninit() {
		this.$syncExpand();
		this.$syncDisable();
		game.broadcastAll(function (player) {
			delete player.storage._disableJudge;
			for (var i = 0; i < player.node.judges.childNodes.length; i++) {
				if (player.node.judges.childNodes[i].name == "disable_judge") {
					player.node.judges.removeChild(player.node.judges.childNodes[i]);
					break;
				}
			}
		}, this);

		this.node.avatar.hide();
		this.node.count.hide();
		if (this.node.wuxing) {
			this.node.wuxing.hide();
		}
		if (this.node.name_seat) {
			this.node.name_seat.remove();
			delete this.node.name_seat;
		}
		this.node.hp.show();
		this.classList.remove("unseen");
		this.classList.remove("unseen2");
		this.classList.remove("unseen_show");
		this.classList.remove("unseen2_show");
		this.classList.remove("turnedover");
		this.classList.remove("linked");
		this.classList.remove("linked2");

		this.node.identity.style.backgroundColor = "";
		this.node.intro.innerHTML = "";
		this.node.name.innerHTML = "";
		this.node.hp.innerHTML = "";
		this.node.count.innerHTML = "0";

		this.node.avatar2.hide();
		this.node.name2.innerHTML = "";
		this.classList.remove("fullskin2");
		this.node.count.classList.remove("p2");

		for (var mark in this.marks) {
			this.marks[mark].remove();
		}
		this.removeTip();
		ui.updatej(this);
		ui.updatem(this);
	}
	getLeft() {
		return this.offsetLeft;
	}
	getTop() {
		return this.offsetTop;
	}
	smoothAvatar(vice, video) {
		var div = ui.create.div(".fullsize");
		if (vice) {
			div.style.background = getComputedStyle(this.node.avatar2).background;
			this.node.avatar2.appendChild(div);
		} else {
			div.style.background = getComputedStyle(this.node.avatar).background;
			this.node.avatar.appendChild(div);
		}
		ui.refresh(div);
		div.style.transition = "all 1s";
		setTimeout(function () {
			div.classList.add("removing");
			setTimeout(function () {
				div.remove();
			}, 2000);
		}, 100);
		if (video != false) {
			game.addVideo("smoothAvatar", this, vice);
		}
	}
	changeSeat(position, video) {
		var player = this;
		if (video !== false) {
			game.addVideo("changeSeat", player, position);
		}
		var rect1 = player.getBoundingClientRect();
		player.style.transition = "all 0s";
		ui.refresh(player);
		player.dataset.position = position;
		var rect2 = player.getBoundingClientRect();
		var dx = rect1.left - rect2.left;
		var dy = rect1.top - rect2.top;
		if ((game.chess || (player.dataset.position != 0 && position != 0)) && player.classList.contains("linked")) {
			player.style.transform = "rotate(-90deg) translate(" + -dy + "px," + dx + "px)";
		} else {
			player.style.transform = "translate(" + dx + "px," + dy + "px)";
		}
		setTimeout(function () {
			player.style.transition = "";
			ui.refresh(player);
			player.style.transform = "";
		}, 100);
	}
	send() {
		if (!this.ws || this.ws.closed) {
			return this;
		}
		this.ws.send.apply(this.ws, arguments);
		return this;
	}
	getId() {
		if (_status.video || _status.connectMode) {
			return this;
		}
		if (this.playerid) {
			delete game.playerMap[this.playerid];
		}
		this.playerid = get.id();
		game.playerMap[this.playerid] = this;
		return this;
	}
	throwEmotion(target, emotion, rotate) {
		game.broadcastAll(
			function (player, target, emotion, rotate) {
				player.$throwEmotion(target, emotion, rotate);
			},
			this,
			target,
			emotion,
			rotate
		);
	}
	emotion(pack, id) {
		var str = `<img src="##assetURL##image/emotion/${pack}/${id}" width="50" height="50">`;
		this.say(str);
		game.broadcast(
			function (id, str) {
				if (lib.playerOL[id]) {
					lib.playerOL[id].say(str);
				} else if (game.connectPlayers) {
					for (var i = 0; i < game.connectPlayers.length; i++) {
						if (game.connectPlayers[i].playerid == id) {
							game.connectPlayers[i].say(str);
							return;
						}
					}
				}
			},
			this.playerid,
			str
		);
	}
	/**
	 * 用法同 {@link say}，但联机模式用这个
	 * @param { string } str
	 */
	chat(str) {
		if (get.is.banWords(str)) {
			return;
		}
		this.say(str);
		game.broadcast(
			function (id, str) {
				if (lib.playerOL[id]) {
					lib.playerOL[id].say(str);
				} else if (game.connectPlayers) {
					for (var i = 0; i < game.connectPlayers.length; i++) {
						if (game.connectPlayers[i].playerid == id) {
							game.connectPlayers[i].say(str);
							return;
						}
					}
				}
			},
			this.playerid,
			str
		);
	}
	/**
	 * 让玩家说话
	 * @param { string } str
	 */
	say(str) {
		if (!get.is.emotion(str)) {
			str = get.plainText(str);
		}
		str = str.replace(/##assetURL##/g, lib.assetURL);
		var dialog = ui.create.dialog("hidden");
		dialog.classList.add("static");
		dialog.add('<div class="text" style="word-break:break-all;display:inline">' + str + "</div>");
		dialog.classList.add("popped");
		ui.window.appendChild(dialog);
		var width = dialog.content.firstChild.firstChild.offsetWidth;
		if (width < 190) {
			dialog._mod_height = -16;
		} else {
			dialog.content.firstChild.style.textAlign = "left";
		}
		dialog.style.width = width + 16 + "px";
		var refnode;
		if (this.node && this.node.avatar && this.parentNode == ui.arena) {
			refnode = this.node.avatar;
		}
		if (refnode) {
			lib.placePoppedDialog(dialog, {
				clientX: (ui.arena.offsetLeft + this.getLeft() + refnode.offsetLeft + refnode.offsetWidth / 2) * game.documentZoom,
				clientY: (ui.arena.offsetTop + this.getTop() + refnode.offsetTop + refnode.offsetHeight / 4) * game.documentZoom,
			});
		} else {
			lib.placePoppedDialog(dialog, {
				clientX: (this.getLeft() + this.offsetWidth / 2) * game.documentZoom,
				clientY: (this.getTop() + this.offsetHeight / 4) * game.documentZoom,
			});
		}
		if (dialog._mod_height) {
			dialog.content.firstChild.style.padding = 0;
		}
		setTimeout(
			function () {
				dialog.delete();
			},
			lib.quickVoice.includes(str) ? 3800 : 2000
		);
		var name = get.translation(this.name);
		var info = [name ? name + "[" + this.nickname + "]" : this.nickname, str];
		lib.chatHistory.push(info);
		if (_status.addChatEntry) {
			if (_status.addChatEntry._origin.parentNode) {
				_status.addChatEntry(info, false);
			} else {
				delete _status.addChatEntry;
			}
		}
		if (lib.config.background_speak && lib.quickVoice.includes(str)) {
			game.playAudio("voice", this.sex == "female" ? "female" : "male", lib.quickVoice.indexOf(str));
		}
	}
	showGiveup() {
		this._giveUp = true;
		if (this == game.me) {
			ui.create.giveup();
		} else if (this.isOnline2()) {
			this.send(ui.create.giveup);
		}
	}
	applySkills(skills) {
		for (var i in skills) {
			if (i == "global") {
				lib.skill.global = skills[i];
			}
			//else if(i=='skillinfo'){
			//	for(var j in skills[i]){
			//		if(!lib.skill[j]){
			//			lib.skill[j]={};
			//		}
			//		lib.skill[j].chooseButton=skills[i][j];
			//	}
			//}
			else if (i == "stat") {
				this.stat = [skills.stat];
			} else if (lib.playerOL[i]) {
				for (var j in skills[i]) {
					lib.playerOL[i][j] = skills[i][j];
				}
			}
		}
	}
	getState() {
		var state = {
			hp: this.hp,
			maxHp: this.maxHp,
			nickname: this.nickname,
			sex: this.sex,
			group: this.group,
			name: this.name,
			name1: this.name1,
			name2: this.name2,
			handcards: this.getCards("hs"),
			gaintag: [],
			equips: this.getCards("e"),
			extraEquip: this.extraEquip,
			equips_map: this.getCards("e").reduce((map, value) => {
				let id = value.cardid;
				map[id] = {};
				if (value.isViewAsCard) {
					map[id].isViewAsCard = true;
				}
				if (value._destroyed_Virtua) {
					map[id]._destroyed_Virtua = value._destroyed_Virtua;
				}
				if (value.destroyed) {
					map[id].destroyed = value.destroyed;
				}
				if (value.node.name2.innerHTML) {
					map[id].name2 = value.node.name2.innerHTML;
				}
				if (value.cardSymbol) {
					map[id].vcard = value[value.cardSymbol];
				}
				return map;
			}, {}),
			judges: this.getCards("j"),
			judges_map: this.getCards("j").reduce((map, value) => {
				let id = value.cardid;
				map[id] = {};
				if (value.isViewAsCard) {
					map[id].isViewAsCard = true;
				}
				if (value._destroyed_Virtua) {
					map[id]._destroyed_Virtua = value._destroyed_Virtua;
				}
				if (value.destroyed) {
					map[id].destroyed = value.destroyed;
				}
				if (value.node.name2.innerHTML) {
					map[id].name2 = value.node.name2.innerHTML;
				}
				if (value.cardSymbol) {
					map[id].vcard = value[value.cardSymbol];
				}
				return map;
			}, {}),
			specials: this.getCards("s"),
			expansions: this.getCards("x"),
			vcardsMap: this.vcardsMap,
			expansion_gaintag: [],
			disableJudge: this.isDisabledJudge(),
			disabledSlots: this.disabledSlots,
			expandedSlots: this.expandedSlots,
			views: [],
			position: parseInt(this.dataset.position),
			hujia: this.hujia,
			side: this.side,
			identityShown: this.identityShown,
			identityNode: [this.node.identity.innerHTML, this.node.identity.dataset.color],
			identity: this.identity,
			dead: this.isDead(),
			linked: this.isLinked(),
			turnedover: this.isTurnedOver(),
			out: this.isOut(),
			phaseNumber: this.phaseNumber,
			unseen: this.isUnseen(0),
			unseen2: this.isUnseen(1),
			seatNum: this.seatNum,
		};
		for (var i = 0; i < state.judges.length; i++) {
			state.views[i] = state.judges[i].viewAs;
		}
		for (var i = 0; i < state.handcards.length; i++) {
			state.gaintag[i] = state.handcards[i].gaintag;
		}
		for (var i = 0; i < state.expansions.length; i++) {
			state.expansion_gaintag[i] = state.expansions[i].gaintag;
		}
		if (this.getModeState) {
			state.mode = this.getModeState();
		}
		return state;
	}
	setNickname(str) {
		this.node.nameol.innerHTML = (str || this.nickname || "").slice(0, 12);
		return this;
	}
	setAvatar(name, name2, video, fakeme) {
		var node;
		if (this.name2 == name) {
			node = this.node.avatar2;
			this.smoothAvatar(true, video);
		} else if (this.name == name) {
			node = this.node.avatar;
			this.smoothAvatar(false, video);
		}
		if (node) {
			if (name === name2) {
				var skinName = this.name2 != name ? this.skin?.name : this.skin?.name2;
				if (!skinName || skinName === name2) {
					node.setBackground(name2, "character");
				} else {
					node.setBackground(skinName, "character");
				}
			} else {
				node.setBackground(name2, "character");
			}
			if (this == game.me && ui.fakeme && fakeme !== false) {
				ui.fakeme.style.backgroundImage = node.style.backgroundImage;
			}
			if (video != false) {
				game.addVideo("setAvatar", this, [name, name2]);
			}
		}
		game.broadcast(
			function (player, name, name2) {
				player.setAvatar(name, name2, false);
			},
			this,
			name,
			name2
		);
	}
	setAvatarQueue(name, list) {
		var node;
		var player = this;
		if (player.name2 == name) {
			node = player.node.avatar2;
		} else {
			node = player.node.avatar;
		}
		if (node._avatarqueue) {
			for (var i = 0; i < list.length; i++) {
				node._avatarqueue.push(list[i]);
			}
		} else {
			var func = function () {
				if (node._avatarqueue.length) {
					player.setAvatar(name, node._avatarqueue.shift(), false, false);
				} else {
					clearInterval(node._avatarqueueinterval);
					delete node._avatarqueue;
					delete node._avatarqueueinterval;
					player.setAvatar(name, name, false, false);
				}
			};
			node._avatarqueue = list.slice(0);
			node._avatarqueueinterval = setInterval(func, 1000);
			func();
		}
		game.addVideo("setAvatarQueue", this, [name, list]);
	}
	flashAvatar(skill, name) {
		if (lib.skill[name] && !lib.character[name]) {
			var stop = false;
			var list = lib.config.all.characters.slice(0);
			for (var i in lib.characterPack) {
				list.add(i);
			}
			for (var i = 0; i < list.length; i++) {
				for (var j in lib.characterPack[list[i]]) {
					if (lib.characterPack[list[i]][j].skills.includes(name)) {
						name = j;
						stop = true;
						break;
					}
				}
				if (stop) {
					break;
				}
			}
		}
		if (lib.character[this.name2] && lib.character[this.name2].skills.includes(skill)) {
			this.setAvatarQueue(this.name2, [name]);
		} else {
			this.setAvatarQueue(this.name, [name]);
		}
	}
	update() {
		if (_status.video && arguments.length == 0) {
			return;
		}
		if (this.hp >= this.maxHp) {
			this.hp = this.maxHp;
		}
		game.broadcast(
			function (player, hp, maxHp, hujia) {
				player.hp = hp;
				player.maxHp = maxHp;
				player.hujia = hujia;
				player.$update();
			},
			this,
			this.hp,
			this.maxHp,
			this.hujia
		);
		game.callHook("checkUpdate", [this]);
		this.$update(...arguments);
	}
	$update() {
		if (this.hp >= this.maxHp) {
			this.hp = this.maxHp;
		}
		var hp = this.node.hp;
		hp.style.transition = "none";
		if (!_status.video) {
			if (this.hujia) {
				this.markSkill("ghujia");
			} else {
				this.unmarkSkill("ghujia");
			}
		}
		if (!this.storage.nohp) {
			const hidden = this.classList.contains("unseen_show") || this.classList.contains("unseen2_show");
			const maxHp = hidden ? 1 : this.maxHp;
			if (maxHp == Infinity) {
				hp.innerHTML = this.hp == Infinity ? "∞" : this.hp + "<br>/<br>" + "∞" + "<div></div>";
				/*
			} else if (game.layout == "default" && maxHp > 14) {
				hp.innerHTML = this.hp + "/" + maxHp;
				hp.classList.add("text");
			} else if (get.is.newLayout() && (maxHp > 9 || (maxHp > 5 && this.classList.contains("minskin")) || ((game.layout == "mobile" || game.layout == "long") && this.dataset.position == 0 && maxHp > 7))) {
			 */
			} else if (maxHp > 5) {
				hp.innerHTML = this.hp + "<br>/<br>" + maxHp + "<div></div>";
				if (this.hp == 0) {
					hp.lastChild.classList.add("lost");
				}
				hp.classList.add("textstyle");
				// hp.classList.remove('long');
			} else {
				hp.innerHTML = "";
				hp.classList.remove("text");
				hp.classList.remove("textstyle");
				while (maxHp > hp.childNodes.length) {
					ui.create.div(hp);
				}
				while (Math.max(0, maxHp) < hp.childNodes.length) {
					hp.removeChild(hp.lastChild);
				}
				for (var i = 0; i < maxHp; i++) {
					var index = i;
					if (get.is.newLayout()) {
						index = maxHp - i - 1;
					}
					if (i < this.hp) {
						hp.childNodes[index].classList.remove("lost");
					} else {
						hp.childNodes[index].classList.add("lost");
					}
				}
				// if(maxHp==9){
				// 	hp.classList.add('long');
				// }
				// else{
				// 	hp.classList.remove('long');
				// }
			}
			if (hidden) {
				hp.dataset.condition = "hidden";
			} else if (hp.classList.contains("room")) {
				hp.dataset.condition = "high";
			} else if (this.hp == 0) {
				hp.dataset.condition = "";
			} else if (this.hp > Math.round(maxHp / 2) || this.hp === maxHp) {
				hp.dataset.condition = "high";
			} else if (this.hp > Math.floor(maxHp / 3)) {
				hp.dataset.condition = "mid";
			} else {
				hp.dataset.condition = "low";
			}

			setTimeout(function () {
				hp.style.transition = "";
			});
		}
		var numh = this.countCards("h");
		if (_status.video) {
			numh = arguments[0];
		}
		if (numh >= 10) {
			this.node.count.dataset.condition = "low";
			this.node.count.innerHTML = Array.from(numh.toString()).join("<br>");
		} else {
			if (numh > 5) {
				this.node.count.dataset.condition = "higher";
			} else if (numh > 2) {
				this.node.count.dataset.condition = "high";
			} else if (numh > 0) {
				this.node.count.dataset.condition = "mid";
			} else {
				this.node.count.dataset.condition = "none";
			}
			this.node.count.innerHTML = numh;
		}
		if (this.updates) {
			for (var i = 0; i < this.updates.length; i++) {
				this.updates[i](this);
			}
		}
		if (!_status.video) {
			game.addVideo("update", this, [this.countCards("h"), this.hp, this.maxHp, this.hujia]);
		}
		this.updateMarks();
		game.callHook("checkTipBottom", [this]);
		return this;
	}
	/**
	 * 清除玩家的标记
	 * @param { string } i
	 * @param { boolean } [log]
	 */
	clearMark(i, log) {
		let num = this.countMark(i);
		if (num > 0) {
			this.removeMark(i, num, log);
		}
	}
	/**
	 * 移除玩家的标记
	 * @param { string } i
	 * @param { number } [num = 1]
	 * @param { boolean } [log]
	 */
	removeMark(i, num, log) {
		if (typeof num != "number" || !num) {
			num = 1;
		}
		if (typeof this.storage[i] != "number" || !this.storage[i]) {
			return;
		}
		if (num > this.storage[i]) {
			num = this.storage[i];
		}
		this.storage[i] -= num;
		if (log !== false) {
			var str = false;
			var info = get.info(i);
			if (info && info.intro && (info.intro.name || info.intro.name2)) {
				str = info.intro.name2 || info.intro.name;
			} else {
				str = lib.translate[i];
			}
			if (str) {
				game.log(this, "移去了", get.cnNumber(num), "个", "#g【" + str + "】");
			}
		}
		this.syncStorage(i);
		this[this.storage[i] || (lib.skill[i] && lib.skill[i].mark) ? "markSkill" : "unmarkSkill"](i);
		const next = game.createEvent("removeMark", false, get.event());
		next.player = this;
		next.num = num;
		next.markName = i;
		next.log = log;
		next.forceDie = true;
		next.includeOut = true;
		next.setContent("emptyEvent");
	}
	/**
	 * 增加玩家的标记
	 * @param { string } i
	 * @param { number } [num = 1]
	 * @param { boolean } [log]
	 */
	addMark(i, num, log) {
		if (typeof num != "number" || !num) {
			num = 1;
		}
		if (typeof this.storage[i] != "number") {
			this.storage[i] = 0;
		}
		this.storage[i] += num;
		if (log !== false) {
			var str = false;
			var info = get.info(i);
			if (info && info.intro && (info.intro.name || info.intro.name2)) {
				str = info.intro.name2 || info.intro.name;
			} else {
				str = lib.translate[i];
			}
			if (str) {
				game.log(this, "获得了", get.cnNumber(num), "个", "#g【" + str + "】");
			}
		}
		this.syncStorage(i);
		this.markSkill(i);
		const next = game.createEvent("addMark", false, get.event());
		next.player = this;
		next.num = num;
		next.markName = i;
		next.log = log;
		next.forceDie = true;
		next.includeOut = true;
		next.setContent("emptyEvent");
	}
	/**
	 * 设置玩家的标记数
	 * @param { string } name
	 * @param { number } num
	 * @param { boolean } [log]
	 */
	setMark(name, num, log) {
		const count = this.countMark(name);
		if (count > num) {
			this.removeMark(name, count - num, log);
		} else if (count < num) {
			this.addMark(name, num - count, log);
		}
	}
	/**
	 * 返回玩家的标记数
	 * @param { string } i
	 * @returns { number }
	 */
	countMark(i) {
		if (this.storage[i] == undefined) {
			return 0;
		}
		if (typeof this.storage[i] == "number") {
			return this.storage[i];
		}
		if (Array.isArray(this.storage[i])) {
			return this.storage[i].length;
		}
		return 0;
	}
	/**
	 * 返回玩家是否拥有某个标记
	 * @param { string } i
	 * @returns { boolean }
	 */
	hasMark(i) {
		return this.countMark(i) > 0;
	}
	updateMark(i, storage) {
		if (!this.marks[i]) {
			if (lib.skill[i] && lib.skill[i].intro && (this.storage[i] || lib.skill[i].intro.markcount)) {
				this.markSkill(i);
				if (!this.marks[i]) {
					return this;
				}
			} else {
				return this;
			}
		}
		if (storage && this.storage[i]) {
			this.syncStorage(i);
		}
		if (
			i == "ghujia" ||
			((!this.marks[i].querySelector(".image") || this.storage[i + "_markcount"]) &&
				lib.skill[i] &&
				lib.skill[i].intro &&
				!lib.skill[i].intro.nocount &&
				(this.storage[i] || this.storage[i + "_markcount"] || lib.skill[i].intro.markcount))
		) {
			this.marks[i].classList.add("overflowmark");
			var num = 0;
			if (typeof lib.skill[i].intro.markcount == "function") {
				num = lib.skill[i].intro.markcount(this.storage[i], this, i);
			} else if (lib.skill[i].intro.markcount == "expansion") {
				num = this.countCards("x", card => card.hasGaintag(i));
			} else if (typeof this.storage[i + "_markcount"] == "number") {
				num = this.storage[i + "_markcount"];
			} else if (i == "ghujia") {
				num = this.hujia;
			} else if (typeof this.storage[i] == "number") {
				num = this.storage[i];
			} else if (Array.isArray(this.storage[i])) {
				num = this.storage[i].length;
			}
			if (num) {
				if (num == Infinity) {
					num = "∞";
				}
				if (!this.marks[i].markcount) {
					this.marks[i].markcount = ui.create.div(".markcount.menubutton", this.marks[i]);
				}
				this.marks[i].markcount.innerHTML = num;
			} else if (this.marks[i].markcount) {
				this.marks[i].markcount.delete();
				delete this.marks[i].markcount;
			}
		} else {
			if (this.marks[i].markcount) {
				this.marks[i].markcount.delete();
				delete this.marks[i].markcount;
			}
			if (lib.skill[i].mark == "auto") {
				this.unmarkSkill(i);
			}
		}
		return this;
	}
	updateMarks(connect) {
		if (typeof connect == "string" && _status.connectMode && !game.online) {
			game.broadcast(
				function (player, storage, skill) {
					player.storage[skill] = storage;
					player.updateMarks();
				},
				this,
				this.storage[connect],
				connect
			);
		}
		for (var i in this.marks) {
			this.updateMark(i);
		}
	}
	/**
	 * 获得蓄力点
	 * @param { number } [num = 1] 获得蓄力点数
	 * @param { boolean } [log] false: 不进行广播
	 */
	addCharge(num, log) {
		if (typeof num != "number" || !num) {
			num = 1;
		}
		let maxCharge = this.getMaxCharge();
		if (maxCharge == Infinity) {
			this.addMark("charge", num, log);
		} else {
			num = Math.min(num, maxCharge - this.countMark("charge"));
			if (num > 0) {
				this.addMark("charge", num, log);
			}
		}
	}
	/**
	 * 移去蓄力点
	 * @param { number } [num = 1] 移去蓄力点数
	 * @param { boolean } [log] false: 不进行广播
	 */
	removeCharge(num, log) {
		if (typeof num != "number" || !num) {
			num = 1;
		}
		num = Math.min(num, this.countMark("charge"));
		if (num > 0) {
			this.removeMark("charge", num, log);
		}
	}
	/**
	 * 返回玩家的蓄力点数
	 * @param { boolean } [max] true: 返回当前蓄力点与上限之差
	 * @returns { number }
	 */
	countCharge(max) {
		if (max) {
			if (this.getMaxCharge() == Infinity) {
				return Infinity;
			}
			return this.getMaxCharge() - this.countMark("charge");
		}
		return this.countMark("charge");
	}
	/**
	 * 获取蓄力点上限
	 */
	getMaxCharge() {
		let skills = game.expandSkills(this.getSkills(null, null, false).concat(lib.skill.global));
		let max = 0;
		for (let skill of skills) {
			let info = get.info(skill);
			if (!info || typeof info.chargeSkill != "number") {
				//|| !info.chargeSkill
				continue;
			}
			if (info.chargeSkill == Infinity) {
				return Infinity;
			}
			max += info.chargeSkill;
		}
		max = game.checkMod(this, max, "maxCharge", this);
		return typeof max == "number" ? Math.max(0, max) : Infinity;
	}
	line(target, config) {
		if (get.itemtype(target) == "players") {
			for (var i = 0; i < target.length; i++) {
				this.line(target[i], config);
			}
		} else if (get.itemtype(target) == "player") {
			if (target == this) {
				return;
			}
			game.broadcast(
				function (player, target, config) {
					player.line(target, config);
				},
				this,
				target,
				config
			);
			game.addVideo("line", this, [target.dataset.position, config]);
			game.linexy(
				[
					this.getLeft() + this.offsetWidth / 2,
					this.getTop() + this.offsetHeight / 2,
					target.getLeft() + target.offsetWidth / 2,
					target.getTop() + target.offsetHeight / 2,
				],
				config,
				true
			);
		}
	}
	line2(targets, config) {
		this.line(targets[0], config);
		targets = targets.slice(0);
		for (var i = 1; i < targets.length; i++) {
			(function (j) {
				setTimeout(function () {
					targets[j - 1].line(targets[j], config);
				}, lib.config.duration * i);
			})(i);
		}
	}
	/**
	 * 返回玩家的下家
	 * @returns { Player | null }
	 */
	getNext() {
		if (this.hasSkill("undist")) {
			return null;
		}
		var target = this;
		for (var i = 0; i < game.players.length - 1; i++) {
			target = target.next;
			if (!target.hasSkill("undist")) {
				return target;
			}
		}
		return null;
	}
	/**
	 * 返回玩家的上家
	 * @returns { Player | null }
	 */
	getPrevious() {
		if (this.hasSkill("undist")) {
			return null;
		}
		var target = this;
		for (var i = 0; i < game.players.length - 1; i++) {
			target = target.previous;
			if (!target.hasSkill("undist")) {
				return target;
			}
		}
		return null;
	}
	countUsed(card, type) {
		if (type === true) {
			var num = 0;
			var history = this.getHistory("useCard");
			for (var i = 0; i < history.length; i++) {
				if (!card) {
					num++;
				} else if (typeof card == "string" && history[i].card && card == history[i].card.name) {
					num++;
				} else if (typeof card == "object" && history[i].card && card.name == history[i].card.name) {
					num++;
				}
			}
			return num;
		}
		var num;
		var stat = this.getStat("card");
		if (!card) {
			num = 0;
			for (var i in stat) {
				if (typeof stat[i] == "number") {
					num += stat[i];
				}
			}
			return num;
		}
		if (typeof card == "object") {
			card = card.name;
		}
		num = stat[card];
		if (typeof num != "number") {
			return 0;
		}
		return num;
	}
	/**
	 * 返回一个键值，用于在缓存中作为键名。
	 * @param { boolean } [similar] false统一前缀
	 * @returns {string} cacheKey
	 */
	getCacheKey(similar) {
		let prefix = "[object:";
		if (similar !== false) {
			prefix = "[player:";
		}
		if (this.playerid) {
			return prefix + this.playerid + "]";
		}
		return (
			prefix +
			dedent`
			${this.name}+${this.sex}+${this.group}+${this.hp}+${this.maxHp}+${this.hujia}+${"[" + this.skills.join(",") + "]"}+${this.name1}+${this.name2}]
		`
		);
	}
	/**
	 * 返回玩家本回合使用某个技能的次数
	 * @param { string } skill
	 * @returns { number }
	 */
	countSkill(skill) {
		const info = lib.skill[skill];
		if (!info) {
			console.warn("“" + skill + "”为无效技能ID！");
			return 0;
		}
		if (typeof this.getStat("skill")[skill] === "number" || typeof this.getStat("triggerSkill")[skill] === "number") {
			return Number(this.getStat("skill")?.[skill] ?? 0) + Number(this.getStat("triggerSkill")?.[skill] ?? 0);
		}
		return this.getHistory("useSkill", evt => evt.skill === skill).length;
	}
	/**
	 * @param {*} [unowned]
	 * @param {*} [unique]
	 * @param {*} [hidden]
	 * @returns { string[] }
	 */
	getStockSkills(unowned, unique, hidden) {
		var list = [];
		if (lib.character[this.name] && (hidden || !this.isUnseen(0))) {
			list.addArray(lib.character[this.name][3]);
		}
		if (lib.character[this.name1] && (hidden || !this.isUnseen(0))) {
			list.addArray(lib.character[this.name1][3]);
		}
		if (lib.character[this.name2] && (hidden || !this.isUnseen(1))) {
			list.addArray(lib.character[this.name2][3]);
		}
		if (!unowned) {
			for (var i = 0; i < list.length; i++) {
				if (!this.hasSkill(list[i])) {
					list.splice(i--, 1);
				}
			}
		}
		if (!unique) {
			for (var i = 0; i < list.length; i++) {
				var info = lib.skill[list[i]];
				if (!info || info.unique || info.temp || info.sub || info.charlotte) {
					list.splice(i--, 1);
				}
			}
		}
		return list;
	}
	/**
	 * 获取一名角色隐藏武将牌上的所有技能
	 * @param {*} [unowned]
	 * @param {*} [unique]
	 * @returns { string[] }
	 */
	getHiddenSkills(unowned, unique) {
		const player = this;
		return player.getStockSkills(unowned, unique, true).removeArray(player.getStockSkills(unowned, unique));
	}
	/**
	 * @param { string } [arg1='h']
	 * @param { string | Record<string, any> | ((card: Card) => boolean) } [arg2]
	 * @returns { Iterable<Card> }
	 */
	*iterableGetVCards(arg1, arg2) {
		if (typeof arg1 != "string") {
			arg1 = "h";
		}
		const getCardName = card => {
			return get.name(card, false);
		};
		let filter = card => true;
		if (arg2) {
			if (typeof arg2 == "string") {
				filter = card => getCardName(card) == arg2;
			} else if (Array.isArray(arg2)) {
				filter = card => arg2.includes(getCardName(card));
			} else if (typeof arg2 == "object") {
				filter = card => {
					for (let j in arg2) {
						var value;
						if (j == "type" || j == "subtype" || j == "color" || j == "suit" || j == "number") {
							value = get[j](card);
						} else if (j == "name") {
							value = getCardName(card);
						} else {
							value = card[j];
						}
						if ((typeof arg2[j] == "string" && value != arg2[j]) || (Array.isArray(arg2[j]) && !arg2[j].includes(value))) {
							return false;
						}
					}
					return true;
				};
			} else if (typeof arg2 == "function") {
				filter = arg2;
			}
		}
		for (let i = 0; i < arg1.length; i++) {
			if (arg1[i] == "h") {
				for (let card of this.vcardsMap?.handcards ?? []) {
					if (filter(card)) {
						yield card;
					}
				}
			} else if (arg1[i] == "e") {
				for (let card of this.vcardsMap?.equips ?? []) {
					if (filter(card)) {
						yield card;
					}
				}
			} else if (arg1[i] == "j") {
				for (let card of this.vcardsMap?.judges ?? []) {
					if (filter(card)) {
						yield card;
					}
				}
			}
		}
	}
	/**
	 * @param { string } [arg1='h']
	 * @param { string | Record<string, any> | ((card: Card) => boolean) } [arg2]
	 * @returns { Card[] }
	 */
	getVCards(arg1, arg2) {
		return Array.from(this.iterableGetVCards(arg1, arg2));
	}
	/**
	 * @param { Parameters<typeof this['iterableGetCards']>[0] } [arg1]
	 * @param { Parameters<typeof this['iterableGetCards']>[1] } [arg2]
	 */
	countVCards(arg1, arg2) {
		let count = 0;
		for (let item of this.iterableGetVCards(arg1, arg2)) {
			count++;
		}
		return count;
	}
	/**
	 * @param { string } [arg1='h']
	 * @param { string | Record<string, any> | ((card: Card) => boolean) } [arg2]
	 * @returns { Iterable<Card> }
	 */
	*iterableGetCards(arg1, arg2) {
		if (typeof arg1 != "string") {
			arg1 = "h";
		}
		const getCardName = card => {
			if (card.parentNode == this.node.judges) {
				if (card.viewAs) {
					return card.viewAs;
				}
			}
			return get.name(card);
		};
		let filter = card => true;
		if (arg2) {
			if (typeof arg2 == "string") {
				filter = card => getCardName(card) == arg2;
			} else if (Array.isArray(arg2)) {
				filter = card => arg2.includes(getCardName(card));
			} else if (typeof arg2 == "object") {
				filter = card => {
					for (let j in arg2) {
						var value;
						if (j == "type" || j == "subtype" || j == "color" || j == "suit" || j == "number") {
							value = get[j](card);
						} else if (j == "name") {
							value = getCardName(card);
						} else {
							value = card[j];
						}
						if ((typeof arg2[j] == "string" && value != arg2[j]) || (Array.isArray(arg2[j]) && !arg2[j].includes(value))) {
							return false;
						}
					}
					return true;
				};
			} else if (typeof arg2 == "function") {
				filter = arg2;
			}
		}
		for (let i = 0; i < arg1.length; i++) {
			if (arg1[i] == "h") {
				for (let card of get.iterableChildNodes(this.node.handcards1, this.node.handcards2)) {
					if (!card.classList.contains("removing") && !card.classList.contains("glows") && filter(card)) {
						yield card;
					}
				}
			} else if (arg1[i] == "s") {
				for (let card of get.iterableChildNodes(this.node.handcards1, this.node.handcards2)) {
					if (!card.classList.contains("removing") && card.classList.contains("glows") && filter(card)) {
						yield card;
					}
				}
			} else if (arg1[i] == "e") {
				for (let card of get.iterableChildNodes(this.node.equips)) {
					if (
						!card.classList.contains("removing") &&
						!card.classList.contains("feichu") &&
						!card.classList.contains("emptyequip") &&
						filter(card)
					) {
						yield card;
					}
				}
			} else if (arg1[i] == "j") {
				for (let card of get.iterableChildNodes(this.node.judges)) {
					if (!card.classList.contains("removing") && !card.classList.contains("feichu") && filter(card)) {
						yield card;
					}
				}
			} else if (arg1[i] == "x") {
				for (let card of get.iterableChildNodes(this.node.expansions)) {
					if (!card.classList.contains("removing") && filter(card)) {
						yield card;
					}
				}
			}
		}
	}
	/**
	 * @param { string } [arg1='h']
	 * @param { string | Record<string, any> | ((card: Card) => boolean) } [arg2]
	 * @returns { Card[] }
	 */
	getCards(arg1, arg2) {
		return Array.from(this.iterableGetCards(arg1, arg2));
	}
	/**
	 * @param { Player } player
	 * @param { string } [arg1]
	 * @param { string } [arg2]
	 * @returns { Generator<Card, void, unknown> }
	 */
	*iterableGetDiscardableCards(player, arg1, arg2) {
		for (let card of this.iterableGetCards(arg1, arg2)) {
			if (lib.filter.canBeDiscarded(card, player, this)) {
				yield card;
			}
		}
	}
	getDiscardableCards(player, arg1, arg2) {
		return Array.from(this.iterableGetDiscardableCards(player, arg1, arg2));
	}
	/**
	 * @param {Parameters<lib['filter']['canBeGained']>[1]} player
	 * @param {Parameters<this['iterableGetCards']>[0]} arg1
	 * @param {Parameters<this['iterableGetCards']>[1]} arg2
	 */
	*iterableGetGainableCards(player, arg1, arg2) {
		for (let card of this.iterableGetCards(arg1, arg2)) {
			if (lib.filter.canBeGained(card, player, this)) {
				yield card;
			}
		}
	}
	/**
	 *
	 * @param {Parameters<this['iterableGetGainableCards']>[0]} player
	 * @param {Parameters<this['iterableGetGainableCards']>[1]} [arg1]
	 * @param {Parameters<this['iterableGetGainableCards']>[2]} [arg2]
	 */
	getGainableCards(player, arg1, arg2) {
		return Array.from(this.iterableGetGainableCards(player, arg1, arg2));
	}
	getGainableSkills(func) {
		var list = [];
		var names = [this.name, this.name1, this.name2];
		for (var i = 0; i < names.length; i++) {
			list.addArray(get.gainableSkillsName(names[i], func));
		}
		return list;
	}
	/**
	 * @param { Parameters<typeof this['iterableGetCards']>[0] } [arg1]
	 * @param { Parameters<typeof this['iterableGetCards']>[1] } [arg2]
	 */
	countCards(arg1, arg2) {
		let count = 0;
		for (let item of this.iterableGetCards(arg1, arg2)) {
			count++;
		}
		return count;
	}
	getCardIndex(arg1, name, card, max) {
		let count = 0;
		for (let item of this.iterableGetCards(arg1)) {
			if (get.name(item) == name) {
				if (card == item) {
					return count;
				}
				count++;
				if (count >= max) {
					return count;
				}
			}
		}
		return -1;
	}
	countDiscardableCards(player, arg1, arg2) {
		return this.getDiscardableCards(player, arg1, arg2).length;
	}
	/**
	 * @param {Parameters<this['getGainableCards']>[0]} player
	 * @param {Parameters<this['getGainableCards']>[1]} [arg1]
	 * @param {Parameters<this['getGainableCards']>[2]} [arg2]
	 */
	countGainableCards(player, arg1, arg2) {
		return this.getGainableCards(player, arg1, arg2).length;
	}
	/**
	 * 返回武将牌上原有的技能
	 * @returns { Array<string> } 技能名数组
	 */
	getOriginalSkills() {
		var skills = [];
		if (lib.character[this.name] && !this.isUnseen(0)) {
			skills.addArray(lib.character[this.name][3]);
		}
		if (this.name2 && lib.character[this.name2] && !this.isUnseen(1)) {
			skills.addArray(lib.character[this.name2][3]);
		}
		return skills;
	}
	getModableSkills() {
		var skills = this.getSkills().concat(lib.skill.global);
		game.expandSkills(skills);
		skills = skills.filter(function (skill) {
			var info = get.info(skill);
			return info && info.mod;
		});
		skills.sort((a, b) => get.priority(a) - get.priority(b));
		return skills;
	}
	/**
	 * @param { string | boolean | null } [arg2]
	 * @param { boolean | null} [arg3]
	 * @param {boolean} [arg4]
	 */
	getSkills(arg2, arg3, arg4) {
		var skills = this.skills.slice(0);
		var es = [];
		var i, j;
		if (arg3 !== false) {
			const VEquips = this.getVCards("e");
			es.addArray(get.skillsFromEquips(VEquips));
			if (arg2 == "e") {
				return es;
			}
		}
		for (let i in this.additionalSkills) {
			if (Array.isArray(this.additionalSkills[i]) && (arg2 || i.indexOf("hidden:") !== 0)) {
				for (j = 0; j < this.additionalSkills[i].length; j++) {
					if (this.additionalSkills[i][j]) {
						skills.add(this.additionalSkills[i][j]);
					}
				}
			} else if (this.additionalSkills[i] && typeof this.additionalSkills[i] == "string") {
				skills.add(this.additionalSkills[i]);
			}
		}
		for (let i in this.tempSkills) {
			skills.add(i);
		}
		if (arg2) {
			skills.addArray(this.hiddenSkills);
		}
		if (arg2 === false || arg2 == "invisible") {
			skills.addArray(this.invisibleSkills);
		}
		if (arg3 !== false) {
			skills.addArray(es);
		}
		for (let i in this.forbiddenSkills) {
			skills.remove(i);
		}
		if (arg4 !== false) {
			skills = game.filterSkills(skills, this, es);
		}
		return skills;
	}
	syncStorage(skill) {
		switch (get.itemtype(this.storage[skill])) {
			case "cards":
				game.addVideo("storage", this, [skill, get.cardsInfo(this.storage[skill]), "cards"]);
				break;
			case "card":
				game.addVideo("storage", this, [skill, get.cardInfo(this.storage[skill]), "card"]);
				break;
			default:
				try {
					game.addVideo("storage", this, [skill, JSON.parse(JSON.stringify(this.storage[skill]))]);
				} catch (e) {
					console.log(this.storage[skill]);
				}
		}
	}
	syncSkills() {
		game.broadcast(
			function (player, skills) {
				player.applySkills(skills);
			},
			this,
			get.skillState(this)
		);
	}
	playerfocus(time) {
		time = time || 1000;
		this.classList.add("playerfocus");
		ui.arena.classList.add("playerfocus");
		var that = this;
		setTimeout(function () {
			that.classList.remove("playerfocus");
			ui.arena.classList.remove("playerfocus");
		}, time);
		game.addVideo("playerfocus", this, time);
		game.broadcast(
			function (player, time) {
				player.playerfocus(time);
			},
			this,
			time
		);
		return this;
	}
	setIdentity(identity, nature) {
		if (!identity) {
			identity = this.identity;
		}
		if (get.is.jun(this)) {
			this.node.identity.firstChild.innerHTML = "君";
		} else {
			this.node.identity.firstChild.innerHTML = get.translation(identity);
		}
		this.node.identity.dataset.color = nature || identity;
		return this;
	}
	insertPhase(skill, insert) {
		var evt = _status.event.getParent("phase");
		var next;
		if (evt && evt.parent && evt.parent.next) {
			evt = evt.parent;
			next = game.createEvent("phase", false, evt);
		} else if (_status.event.parent && _status.event.parent.next) {
			evt = _status.event.parent;
			next = game.createEvent("phase", false, evt);
		} else {
			evt = null;
			next = game.createEvent("phase", false);
		}
		if (evt && insert && evt.next.includes(next)) {
			evt.next.remove(next);
			evt.next.unshift(next);
		}
		next.player = this;
		next.forceDie = true;
		next.includeOut = true;
		next.skill = skill || _status.event.name;
		next.setContent("phase");
		return next;
	}
	phase(skill) {
		var next = game.createEvent("phase", false);
		next.player = this;
		next.setContent("phase");
		if (!_status.roundStart) {
			_status.roundStart = this;
		}
		if (skill) {
			next.skill = skill;
		}
		next.forceDie = true;
		next.includeOut = true;
		return next;
	}
	phaseZhunbei() {
		var next = game.createEvent("phaseZhunbei");
		next.player = this;
		next.setContent("phaseZhunbei");
		return next;
	}
	phaseJudge() {
		var next = game.createEvent("phaseJudge");
		next.player = this;
		next.setContent("phaseJudge");
		return next;
	}
	phaseDraw() {
		var next = game.createEvent("phaseDraw");
		next.player = this;
		next.num = 2;
		if ((get.config("first_less") || _status.connectMode || _status.first_less_forced) && game.phaseNumber == 1 && _status.first_less) {
			next.num--;
		}
		next.setContent("phaseDraw");
		return next;
	}
	phaseUse() {
		var next = game.createEvent("phaseUse", false);
		next.player = this;
		next.setContent("phaseUse");
		return next;
	}
	phaseDiscard() {
		var next = game.createEvent("phaseDiscard");
		next.player = this;
		next.setContent("phaseDiscard");
		return next;
	}
	phaseJieshu() {
		var next = game.createEvent("phaseJieshu");
		next.player = this;
		next.setContent("phaseJieshu");
		return next;
	}
	chooseToUse(use) {
		var next = game.createEvent("chooseToUse");
		next.player = this;
		if (arguments.length == 1 && get.objtype(arguments[0]) == "object") {
			for (var i in use) {
				next[i] = use[i];
			}
		} else {
			for (var i = 0; i < arguments.length; i++) {
				if (typeof arguments[i] == "number" || get.itemtype(arguments[i]) == "select") {
					next.selectTarget = arguments[i];
				} else if ((typeof arguments[i] == "object" && arguments[i]) || typeof arguments[i] == "function") {
					if (get.itemtype(arguments[i]) == "player" || next.filterCard) {
						next.filterTarget = arguments[i];
					} else {
						next.filterCard = arguments[i];
					}
				} else if (typeof arguments[i] == "boolean") {
					next.forced = arguments[i];
				} else if (typeof arguments[i] == "string") {
					if (arguments[i] == "chooseonly") {
						next.chooseonly = true;
					} else {
						next.prompt = arguments[i];
					}
				}
			}
		}
		if (typeof next.filterCard == "object") {
			next.filterCard = get.filter(next.filterCard);
		}
		if (typeof next.filterTarget == "object") {
			next.filterTarget = get.filter(next.filterTarget, 2);
		}
		if (next.filterCard == undefined) {
			next.filterCard = lib.filter.filterCard;
		}
		if (next.selectCard == undefined) {
			next.selectCard = [1, 1];
		}
		if (next.filterTarget == undefined) {
			next.filterTarget = lib.filter.filterTarget;
		}
		if (next.selectTarget == undefined) {
			next.selectTarget = lib.filter.selectTarget;
		}
		if (next.position == undefined) {
			next.position = "hs";
		}
		if (next.ai1 == undefined) {
			next.ai1 = get.cacheOrder;
		}
		if (next.ai2 == undefined) {
			next.ai2 = get.cacheEffectUse;
		}
		next.setContent("chooseToUse");
		next._args = Array.from(arguments);
		return next;
	}
	chooseToRespond() {
		var next = game.createEvent("chooseToRespond");
		next.player = this;
		var filter;
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == "number") {
				next.selectCard = [arguments[i], arguments[i]];
			} else if (get.itemtype(arguments[i]) == "select") {
				next.selectCard = arguments[i];
			} else if (typeof arguments[i] == "boolean") {
				next.forced = arguments[i];
			} else if (get.itemtype(arguments[i]) == "position") {
				next.position = arguments[i];
			} else if (typeof arguments[i] == "function") {
				if (next.filterCard) {
					next.ai = arguments[i];
				} else {
					next.filterCard = arguments[i];
				}
			} else if (typeof arguments[i] == "object" && arguments[i]) {
				next.filterCard = get.filter(arguments[i]);
				filter = arguments[i];
			} else if (arguments[i] == "nosource") {
				next.nosource = true;
			} else if (typeof arguments[i] == "string") {
				next.prompt = arguments[i];
			}
		}
		if (next.filterCard == undefined) {
			next.filterCard = lib.filter.all;
		}
		if (next.selectCard == undefined) {
			next.selectCard = [1, 1];
		}
		if (next.source == undefined && !next.nosource) {
			next.source = _status.event.player;
		}
		if (next.ai == undefined) {
			next.ai = get.unuseful2;
		}
		if (next.prompt != false) {
			if (typeof next.prompt == "string") {
				//next.dialog=next.prompt;
			} else {
				var str = "请打出" + get.cnNumber(next.selectCard[0]) + "张";
				if (filter) {
					if (filter.name) {
						str += get.translation(filter.name);
					} else {
						str += "牌";
					}
				} else {
					str += "牌";
				}
				if (_status.event.getParent().name == "useCard") {
					var cardname = _status.event.name;
					if (lib.card[cardname] && lib.translate[cardname]) {
						str += "响应" + lib.translate[cardname];
					}
				}
				next.prompt = str;
			}
		}
		next.position = "hs";
		if (next.ai2 == undefined) {
			next.ai2 = () => 1;
		}
		next.setContent("chooseToRespond");
		next._args = Array.from(arguments);
		return next;
	}
	chooseToGive(...args) {
		const next = game.createEvent("chooseToGive");
		next.player = this;
		if (args.length == 1 && get.is.object(args[0])) {
			for (const i in args[0]) {
				next[i] = args[0][i];
			}
		} else {
			for (const arg of args) {
				if (get.itemtype(arg) == "player") {
					next.target = arg;
				} else if (typeof arg == "number") {
					next.selectCard = [arg, arg];
				} else if (get.itemtype(arg) == "select") {
					next.selectCard = arg;
				} else if (get.itemtype(arg) == "dialog") {
					next.dialog = arg;
					next.prompt = false;
				} else if (typeof arg == "boolean") {
					next.forced = arg;
				} else if (get.itemtype(arg) == "position") {
					next.position = arg;
				} else if (typeof arg == "function") {
					if (next.filterCard) {
						next.ai = arg;
					} else {
						next.filterCard = arg;
					}
				} else if (typeof arg == "object" && arg) {
					next.filterCard = get.filter(arg);
				} else if (arg == "allowChooseAll") {
					next.allowChooseAll = true;
				} else if (typeof arg == "string") {
					get.evtprompt(next, arg);
				}
				if (arg === null) {
					console.log(args);
				}
			}
		}
		if (next.isMine() == false && next.dialog) {
			next.dialog.style.display = "none";
		}
		if (next.filterCard == undefined) {
			next.filterCard = lib.filter.all;
		}
		if (next.selectCard == undefined) {
			next.selectCard = [1, 1];
		}
		if (next.position == undefined) {
			next.position = "h";
		}
		if (next.ai == undefined) {
			next.ai = get.unuseful;
		}
		next.setContent("chooseToGive");
		next._args = args;
		next.gaintag = [];
		return next;
	}
	chooseToDiscard() {
		var next = game.createEvent("chooseToDiscard");
		next.player = this;
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == "number") {
				next.selectCard = [arguments[i], arguments[i]];
			} else if (get.itemtype(arguments[i]) == "select") {
				next.selectCard = arguments[i];
			} else if (get.itemtype(arguments[i]) == "dialog") {
				next.dialog = arguments[i];
				next.prompt = false;
			} else if (typeof arguments[i] == "boolean") {
				next.forced = arguments[i];
			} else if (get.itemtype(arguments[i]) == "position") {
				next.position = arguments[i];
			} else if (typeof arguments[i] == "function") {
				if (next.filterCard) {
					next.ai = arguments[i];
				} else {
					next.filterCard = arguments[i];
				}
			} else if (typeof arguments[i] == "object" && arguments[i]) {
				next.filterCard = get.filter(arguments[i]);
			} else if (typeof arguments[i] == "string") {
				if (arguments[i] == "chooseonly") {
					next.chooseonly = true;
				} else if (arguments[i] == "allowChooseAll") {
					next.allowChooseAll = true;
				} else {
					get.evtprompt(next, arguments[i]);
				}
			}
			if (arguments[i] === null) {
				for (var i = 0; i < arguments.length; i++) {
					console.log(arguments[i]);
				}
			}
		}
		if (next.isMine() == false && next.dialog) {
			next.dialog.style.display = "none";
		}
		if (next.filterCard == undefined) {
			next.filterCard = lib.filter.cardDiscardable;
		}
		if (next.selectCard == undefined) {
			next.selectCard = [1, 1];
		}
		if (next.ai == undefined) {
			next.ai = get.unuseful;
		}
		next.autochoose = function () {
			if (!this.forced) {
				return false;
			}
			if (typeof this.selectCard == "function") {
				return false;
			}
			if (this.complexCard || this.complexSelect || this.filterOk) {
				return false;
			}
			var cards = this.player.getCards(this.position);
			if (cards.some(card => !this.filterCard(card, this.player, this))) {
				return false;
			}
			var num = cards.length;
			for (var i = 0; i < cards.length; i++) {
				if (!lib.filter.cardDiscardable(cards[i], this.player, this)) {
					num--;
				}
			}
			return get.select(this.selectCard)[0] >= num;
		};
		next.setContent("chooseToDiscard");
		next._args = Array.from(arguments);
		return next;
	}
	chooseToCompare(target, check) {
		var next = game.createEvent("chooseToCompare");
		next.player = this;
		if (Array.isArray(target)) {
			next.targets = target;
			if (check) {
				next.ai = check;
			} else {
				next.ai = function (card) {
					if (typeof card == "string" && lib.skill[card]) {
						var ais =
							lib.skill[card].check ||
							function () {
								return 0;
							};
						return ais();
					}
					var addi = get.value(card) >= 8 && get.type(card) != "equip" ? -3 : 0;
					if (card.name == "du") {
						addi -= 3;
					}
					var source = _status.event.source;
					var player = _status.event.player;
					var event = _status.event.getParent();
					var getn = function (card) {
						//会赢吗？会赢的！
						if (player.hasSkillTag("forceWin", null, { card })) {
							return 13 * (event.small ? -1 : 1);
						}
						return get.number(card) * (event.small ? -1 : 1);
					};
					if (source && source != player) {
						if (get.attitude(player, source) > 1) {
							if (event.small) {
								return getn(card) - get.value(card) / 3 + addi;
							}
							return -getn(card) - get.value(card) / 3 + addi;
						}
						if (event.small) {
							return -getn(card) - get.value(card) / 5 + addi;
						}
						return getn(card) - get.value(card) / 5 + addi;
					} else {
						if (event.small) {
							return -getn(card) - get.value(card) / 5 + addi;
						}
						return getn(card) - get.value(card) / 5 + addi;
					}
				};
			}
			next.setContent("chooseToCompareMultiple");
		} else {
			next.target = target;
			if (check) {
				next.ai = check;
			} else {
				next.ai = function (card) {
					if (typeof card == "string" && lib.skill[card]) {
						var ais =
							lib.skill[card].check ||
							function () {
								return 0;
							};
						return ais();
					}
					var player = get.owner(card);
					var getn = function (card) {
						if (player.hasSkillTag("forceWin", null, { card })) {
							return 13;
						}
						return get.number(card);
					};
					var event = _status.event.getParent();
					var to = player == event.player ? event.target : event.player;
					var addi = get.value(card) >= 8 && get.type(card) != "equip" ? -6 : 0;
					var friend = get.attitude(player, to) > 0;
					if (card.name == "du") {
						addi -= 5;
					}
					if (player == event.player) {
						if (event.small) {
							return -getn(card) - get.value(card) / (friend ? 4 : 5) + addi;
						}
						return getn(card) - get.value(card) / (friend ? 4 : 5) + addi;
					} else {
						if (friend == Boolean(event.small)) {
							return getn(card) - get.value(card) / (friend ? 3 : 5) + addi;
						}
						return -getn(card) - get.value(card) / (friend ? 3 : 5) + addi;
					}
				};
			}
			next.setContent("chooseToCompare");
		}
		next.forceDie = true;
		next._args = Array.from(arguments);
		return next;
	}
	chooseSkill(target) {
		var next = game.createEvent("chooseSkill");
		next.player = this;
		next.setContent("chooseSkill");
		next.target = target;
		for (var i = 1; i < arguments.length; i++) {
			if (typeof arguments[i] == "string") {
				next.prompt = arguments[i];
			} else if (typeof arguments[i] == "function") {
				next.func = arguments[i];
			}
		}
		return next;
	}
	discoverCard(list) {
		var next = game.createEvent("discoverCard");
		next.player = this;
		next.setContent("discoverCard");
		next.list = list || lib.inpile.slice(0);
		next.forced = true;
		for (var i = 1; i < arguments.length; i++) {
			if (typeof arguments[i] == "boolean") {
				next.forced = arguments[i];
			} else if (typeof arguments[i] == "string") {
				switch (arguments[i]) {
					case "use":
						next.use = true;
						break;
					case "nogain":
						next.nogain = true;
						break;
					default:
						next.prompt = arguments[i];
				}
			} else if (typeof arguments[i] == "number") {
				next.num = arguments[i];
			} else if (typeof arguments[i] === "function") {
				next.ai = arguments[i];
			}
		}
		return next;
	}
	chooseCardButton() {
		var cards, prompt, forced, select;
		for (var i = 0; i < arguments.length; i++) {
			if (get.itemtype(arguments[i]) == "cards") {
				cards = arguments[i];
			} else if (typeof arguments[i] == "boolean") {
				forced = arguments[i];
			} else if (typeof arguments[i] == "string") {
				prompt = arguments[i];
			} else if (get.itemtype(arguments[i]) == "select" || typeof arguments[i] == "number") {
				select = arguments[i];
			}
		}
		if (prompt == undefined) {
			prompt = "请选择卡牌";
		}
		return this.chooseButton(forced, select, "hidden", [prompt, cards, "hidden"]);
	}
	chooseVCardButton() {
		var list,
			prompt,
			forced,
			select,
			notype = false;
		for (var i = 0; i < arguments.length; i++) {
			if (Array.isArray(arguments[i])) {
				list = arguments[i];
			} else if (arguments[i] == "notype") {
				notype = true;
			} else if (typeof arguments[i] == "boolean") {
				forced = arguments[i];
			} else if (typeof arguments[i] == "string") {
				prompt = arguments[i];
			} else if (get.itemtype(arguments[i]) == "select" || typeof arguments[i] == "number") {
				select = arguments[i];
			}
		}
		for (var i = 0; i < list.length; i++) {
			list[i] = [notype ? "" : get.subtype(list[i], false) || get.type(list[i]), "", list[i]];
		}
		if (prompt == undefined) {
			prompt = "请选择卡牌";
		}
		return this.chooseButton(forced, select, "hidden", [prompt, [list, "vcard"], "hidden"]);
	}
	chooseButton(choose) {
		var next = game.createEvent("chooseButton");
		if (arguments.length == 1 && get.is.object(choose)) {
			for (var i in choose) {
				next[i] = choose[i];
			}
		} else {
			for (var i = 0; i < arguments.length; i++) {
				if (typeof arguments[i] == "boolean") {
					if (!next.forced) {
						next.forced = arguments[i];
					} else {
						next.complexSelect = arguments[i];
					}
				} else if (get.itemtype(arguments[i]) == "dialog") {
					next.dialog = arguments[i];
					next.closeDialog = true;
				} else if (get.itemtype(arguments[i]) == "select") {
					next.selectButton = arguments[i];
				} else if (typeof arguments[i] == "number") {
					next.selectButton = [arguments[i], arguments[i]];
				} else if (typeof arguments[i] == "function") {
					if (next.ai) {
						next.filterButton = arguments[i];
					} else {
						next.ai = arguments[i];
					}
				} else if (arguments[i] == "complexSelect") {
					// 为直接添加complexSelect提供支持喵
					next.complexSelect = true;
				} else if (arguments[i] == "allowChooseAll") {
					next.allowChooseAll = true;
				} else if (arguments[i] == "direct") {
					next.direct = true;
				} else if (Array.isArray(arguments[i])) {
					next.createDialog = arguments[i];
				}
			}
		}
		next.player = this;
		if (typeof next.forced != "boolean") {
			next.forced = false;
		}
		if (next.isMine() == false && next.dialog) {
			next.dialog.style.display = "none";
		}
		if (next.filterButton == undefined) {
			next.filterButton = lib.filter.filterButton;
		}
		if (next.selectButton == undefined) {
			next.selectButton = [1, 1];
		}
		if (next.ai == undefined) {
			next.ai = function () {
				return 1;
			};
		}
		if (next.complexSelect !== false) {
			if (next.complexSelect === undefined && next.allowChooseAll === true) {
				// 如果complexSelect没有被显式的定义但是全选被显式要求了，那么我们默认认为调用者需要全选而不是complexSelect喵
				next.complexSelect = false;
			} else {
				next.complexSelect = true;
			}
		}
		next.setContent("chooseButton");
		next._args = Array.from(arguments);
		next.forceDie = true;
		return next;
	}
	chooseButtonOL(list, callback, ai) {
		var next = game.createEvent("chooseButtonOL");
		next.list = list;
		next.setContent("chooseButtonOL");
		next.ai = ai;
		next.callback = callback;
		next._args = Array.from(arguments);
		return next;
	}
	chooseCardOL() {
		var next = game.createEvent("chooseCardOL");
		next._args = [];
		for (var i = 0; i < arguments.length; i++) {
			if (get.itemtype(arguments[i]) == "players") {
				next.list = arguments[i].slice(0);
			} else {
				next._args.push(arguments[i]);
			}
		}
		next.setContent("chooseCardOL");
		next._args.add("glow_result");
		return next;
	}
	chooseCard(choose) {
		var next = game.createEvent("chooseCard");
		next.player = this;
		if (arguments.length == 1 && get.is.object(choose)) {
			for (var i in choose) {
				next[i] = choose[i];
			}
		} else {
			for (var i = 0; i < arguments.length; i++) {
				if (typeof arguments[i] == "number") {
					next.selectCard = [arguments[i], arguments[i]];
				} else if (get.itemtype(arguments[i]) == "select") {
					next.selectCard = arguments[i];
				} else if (typeof arguments[i] == "boolean") {
					next.forced = arguments[i];
				} else if (get.itemtype(arguments[i]) == "position") {
					next.position = arguments[i];
				} else if (typeof arguments[i] == "function") {
					if (next.filterCard) {
						next.ai = arguments[i];
					} else {
						next.filterCard = arguments[i];
					}
				} else if (typeof arguments[i] == "object" && arguments[i]) {
					next.filterCard = get.filter(arguments[i]);
				} else if (arguments[i] == "glow_result") {
					next.glow_result = true;
				} else if (arguments[i] == "allowChooseAll") {
					next.allowChooseAll = true;
				} else if (typeof arguments[i] == "string") {
					get.evtprompt(next, arguments[i]);
				}
			}
		}
		if (next.filterCard == undefined) {
			next.filterCard = lib.filter.all;
		}
		if (next.selectCard == undefined) {
			next.selectCard = [1, 1];
		}
		if (next.ai == undefined) {
			next.ai = get.unuseful3;
		}
		next.autochoose = function () {
			if (!this.forced) {
				return false;
			}
			if (typeof this.selectCard == "function") {
				return false;
			}
			if (this.complexCard || this.complexSelect || this.filterOk) {
				return false;
			}
			if (this.type === "compare") {
				return false;
			}
			var cards = this.player.getCards(this.position);
			if (cards.some(card => !this.filterCard(card, this.player, this))) {
				return false;
			}
			return get.select(this.selectCard)[0] >= this.player.countCards(this.position);
		};
		next.setContent("chooseCard");
		next._args = Array.from(arguments);
		return next;
	}
	chooseUseTarget() {
		var next = game.createEvent("chooseUseTarget");
		next.player = this;
		for (var i = 0; i < arguments.length; i++) {
			if (get.itemtype(arguments[i]) == "cards") {
				next.cards = arguments[i].slice(0);
			} else if (get.itemtype(arguments[i]) == "card") {
				next.card = arguments[i];
			} else if (get.itemtype(arguments[i]) == "players") {
				next.targets = arguments[i];
			} else if (get.itemtype(arguments[i]) == "player") {
				next.targets = [arguments[i]];
			} else if (get.itemtype(arguments[i]) == "select") {
				next.selectTarget = arguments[i];
			} else if (typeof arguments[i] == "number") {
				next.selectTarget = [arguments[i], arguments[i]];
			} else if (get.is.object(arguments[i]) && arguments[i].name) {
				next.card = arguments[i];
			} else if (typeof arguments[i] == "string") {
				if (arguments[i] == "nopopup") {
					next.nopopup = true;
				} else if (arguments[i] == "noanimate") {
					next.animate = false;
				} else if (arguments[i] == "nothrow") {
					next.throw = false;
				} else if (arguments[i] == "nodistance") {
					next.nodistance = true;
				} else if (arguments[i] == "noTargetDelay") {
					next.noTargetDelay = true;
				} else if (arguments[i] == "nodelayx") {
					next.nodelayx = true;
				} else if (lib.card[arguments[i]] && !next.card) {
					next.card = { name: arguments[i], isCard: true };
				} else {
					get.evtprompt(next, arguments[i]);
				}
			} else if (arguments[i] === true) {
				next.forced = true;
			} else if (arguments[i] === false) {
				next.addCount = false;
			}
		}
		if (!next.targets) {
			next.targets = game.players.slice(0);
		}
		if (next.cards == undefined) {
			if (get.itemtype(next.card) == "card") {
				next.cards = [next.card];
			} else {
				next.cards = [];
			}
		} else if (next.card == undefined) {
			if (next.cards) {
				next.card = next.cards[0];
			}
		}
		if (next.card && get.info(next.card)?.deadTarget) {
			next.targets.addArray(game.dead);
		}
		next.setContent("chooseUseTarget");
		next._args = Array.from(arguments);
		return next;
		// Fully Online-Ready! Enjoy It!
	}
	chooseTarget() {
		var next = game.createEvent("chooseTarget");
		next.player = this;
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == "number") {
				next.selectTarget = [arguments[i], arguments[i]];
			} else if (get.itemtype(arguments[i]) == "select") {
				next.selectTarget = arguments[i];
			} else if (get.itemtype(arguments[i]) == "dialog") {
				next.dialog = arguments[i];
				next.prompt = false;
			} else if (typeof arguments[i] == "boolean") {
				next.forced = arguments[i];
			} else if (typeof arguments[i] == "function") {
				if (next.filterTarget) {
					next.ai = arguments[i];
				} else {
					next.filterTarget = arguments[i];
				}
			} else if (typeof arguments[i] == "string") {
				get.evtprompt(next, arguments[i]);
			}
		}
		if (next.filterTarget == undefined) {
			next.filterTarget = lib.filter.all;
		}
		if (next.selectTarget == undefined) {
			next.selectTarget = [1, 1];
		}
		if (next.ai == undefined) {
			next.ai = get.attitude2;
		}
		next.setContent("chooseTarget");
		next._args = Array.from(arguments);
		next.forceDie = true;
		return next;
	}
	chooseCardTarget(choose) {
		var next = game.createEvent("chooseCardTarget");
		next.player = this;
		if (arguments.length == 1) {
			for (var i in choose) {
				next[i] = choose[i];
			}
		}
		if (typeof next.filterCard == "object") {
			next.filterCard = get.filter(next.filterCard);
		}
		if (typeof next.filterTarget == "object") {
			next.filterTarget = get.filter(next.filterTarget, 2);
		}
		if (next.filterCard == undefined || next.filterCard === true) {
			next.filterCard = lib.filter.all;
		}
		if (next.selectCard == undefined) {
			next.selectCard = 1;
		}
		if (next.filterTarget == undefined || next.filterTarget === true) {
			next.filterTarget = lib.filter.all;
		}
		if (next.selectTarget == undefined) {
			next.selectTarget = 1;
		}
		if (next.ai1 == undefined) {
			next.ai1 = get.unuseful2;
		}
		if (next.ai2 == undefined) {
			next.ai2 = get.attitude2;
		}
		next.setContent("chooseCardTarget");
		next._args = Array.from(arguments);
		return next;
	}
	chooseButtonTarget(choose) {
		var next = game.createEvent("chooseButtonTarget");
		next.player = this;
		if (arguments.length == 1) {
			for (var i in choose) {
				next[i] = choose[i];
			}
		}
		if (typeof next.filterButton == "object") {
			next.filterButton = get.filter(next.filterButton);
		}
		if (typeof next.filterTarget == "object") {
			next.filterTarget = get.filter(next.filterTarget, 2);
		}
		if (next.filterButton == undefined || next.filterButton === true) {
			next.filterButton = lib.filter.filterButton;
		}
		if (next.selectButton == undefined) {
			next.selectButton = 1;
		}
		if (next.filterTarget == undefined || next.filterTarget === true) {
			next.filterTarget = lib.filter.all;
		}
		if (next.selectTarget == undefined) {
			next.selectTarget = 1;
		}
		if (next.ai1 == undefined) {
			next.ai1 = function () {
				return 1;
			};
		}
		if (next.ai2 == undefined) {
			next.ai2 = get.attitude2;
		}
		if (next.canHidden == undefined) {
			next.canHidden = true;
		}
		next.setContent("chooseButtonTarget");
		next._args = Array.from(arguments);
		return next;
	}
	chooseControlList() {
		var list = [];
		var prompt = null;
		var forced = "cancel2";
		var func = null;
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == "string") {
				if (!prompt) {
					prompt = arguments[i];
				} else {
					list.push(arguments[i]);
				}
			} else if (Array.isArray(arguments[i])) {
				list = arguments[i];
			} else if (arguments[i] === true) {
				forced = null;
			} else if (typeof arguments[i] == "function") {
				func = arguments[i];
			}
		}
		return this.chooseControl(forced, func).set("choiceList", list).set("prompt", prompt);
	}
	chooseControl() {
		var next = game.createEvent("chooseControl");
		next.controls = [];
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == "string") {
				if (arguments[i] == "dialogcontrol") {
					next.dialogcontrol = true;
				} else if (arguments[i] == "seperate") {
					next.seperate = true;
				} else {
					next.controls.push(arguments[i]);
				}
			} else if (Array.isArray(arguments[i])) {
				next.controls = next.controls.concat(arguments[i]);
			} else if (typeof arguments[i] == "function") {
				next.ai = arguments[i];
			} else if (typeof arguments[i] == "number") {
				next.choice = arguments[i];
			} else if (get.itemtype(arguments[i]) == "dialog") {
				next.dialog = arguments[i];
			}
		}
		next.player = this;
		if (next.choice == undefined) {
			next.choice = 0;
		}
		next.setContent("chooseControl");
		next._args = Array.from(arguments);
		next.forceDie = true;
		return next;
	}
	chooseBool() {
		var next = game.createEvent("chooseBool");
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == "boolean") {
				next.choice = arguments[i];
			} else if (typeof arguments[i] == "function") {
				next.ai = arguments[i];
			} else if (typeof arguments[i] == "string") {
				get.evtprompt(next, arguments[i]);
			} else if (get.itemtype(arguments[i]) == "dialog") {
				next.dialog = arguments[i];
			}
			if (next.choice == undefined) {
				next.choice = true;
			}
		}
		next.player = this;
		next.setContent("chooseBool");
		next._args = Array.from(arguments);
		next.forceDie = true;
		return next;
	}
	chooseDrawRecover() {
		var next = game.createEvent("chooseDrawRecover", false);
		next.player = this;
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == "number") {
				if (typeof next.num1 == "number") {
					next.num2 = arguments[i];
				} else {
					next.num1 = arguments[i];
				}
			} else if (typeof arguments[i] == "boolean") {
				next.forced = arguments[i];
			} else if (typeof arguments[i] == "string") {
				next.prompt = arguments[i];
			} else if (typeof arguments[i] == "function") {
				next.ai = arguments[i];
			} else if (get.itemtype(arguments[i]) == "player") {
				next.target = arguments[i];
			}
		}
		if (typeof next.num1 != "number") {
			next.num1 = 1;
		}
		if (typeof next.num2 != "number") {
			next.num2 = 1;
		}
		if (next.target == undefined) {
			next.target = this;
		}
		next.gaintag = [];
		next.setContent("chooseDrawRecover");
		return next;
	}
	/**
	 * 选择一或多个数值
	 */
	chooseNumbers() {
		const next = game.createEvent("chooseNumbers");
		next.player = this;
		next.list = [];
		for (const argument of arguments) {
			if (typeof argument == "string") {
				get.evtprompt(next, argument);
			} else if (typeof argument == "number") {
				next.optionSum = argument;
			} else if (typeof argument == "boolean") {
				next.forced = argument;
			} else if (typeof argument == "object" && Array.isArray(argument)) {
				next.list.push(...argument);
			} else if (typeof argument == "function") {
				if (!next.processAI) {
					next.processAI = argument;
				} else {
					next.filterSelect = argument;
				}
			}
		}
		if (!next.list.length) {
			_status.event.next.remove(next);
			next.resolve();
		}
		if (!next.filterSelect) {
			if (next.optionSum) {
				next.filterSelect = (num, index, event) =>
					num + event.numbers.reduce((sum, num) => sum + num, 0) - (event.numbers[index] || 0) <= event.optionSum;
			} else {
				next.filterSelect = () => true;
			}
		}
		if (!next.filterOk) {
			if (next.optionSum) {
				next.filterOk = event => event.numbers.reduce((sum, num) => sum + num, 0) <= event.optionSum;
			} else {
				next.filterOk = () => true;
			}
		}
		if (!next.forced) {
			next.forced = false;
		}
		next.setContent("chooseNumbers");
		next._args = Array.from(arguments);
		return next;
	}
	choosePlayerCard() {
		var next = game.createEvent("choosePlayerCard");
		next.player = this;
		for (var i = 0; i < arguments.length; i++) {
			if (get.itemtype(arguments[i]) == "player") {
				next.target = arguments[i];
			} else if (typeof arguments[i] == "number") {
				next.selectButton = [arguments[i], arguments[i]];
			} else if (get.itemtype(arguments[i]) == "select") {
				next.selectButton = arguments[i];
			} else if (typeof arguments[i] == "boolean") {
				if (!next.forced) {
					next.forced = arguments[i];
				} else {
					next.complexSelect = arguments[i];
				}
			} else if (get.itemtype(arguments[i]) == "position") {
				next.position = arguments[i];
			} else if (arguments[i] == "visible") {
				next.visible = true;
			} else if (arguments[i] == "complexSelect") {
				// 为直接添加complexSelect提供支持喵
				next.complexSelect = true;
			} else if (arguments[i] == "allowChooseAll") {
				next.allowChooseAll = true;
			} else if (typeof arguments[i] == "function") {
				if (next.ai) {
					next.filterButton = arguments[i];
				} else {
					next.ai = arguments[i];
				}
			} else if (typeof arguments[i] == "object" && arguments[i]) {
				var filter = get.filter(arguments[i]);
				next.filterButton = function (button) {
					return filter(button.link);
				};
			} else if (typeof arguments[i] == "string") {
				next.prompt = arguments[i];
			}
		}
		if (next.filterButton == undefined) {
			next.filterButton = lib.filter.all;
		}
		if (next.position == undefined) {
			next.position = "he";
		}
		if (next.selectButton == undefined) {
			next.selectButton = [1, 1];
		}
		if (next.ai == undefined) {
			next.ai = function (button) {
				var val = get.buttonValue(button);
				if (get.attitude(_status.event.player, get.owner(button.link)) > 0) {
					return -val;
				}
				return val;
			};
		}
		if (next.complexSelect !== false) {
			if (next.complexSelect === undefined && next.allowChooseAll === true) {
				// 如果complexSelect没有被显式的定义但是全选被显式要求了，那么我们默认认为调用者需要全选而不是complexSelect喵
				next.complexSelect = false;
			} else {
				next.complexSelect = true;
			}
		}
		next.setContent("choosePlayerCard");
		next._args = Array.from(arguments);
		return next;
	}
	discardPlayerCard() {
		var next = game.createEvent("discardPlayerCard");
		next.player = this;
		for (var i = 0; i < arguments.length; i++) {
			if (get.itemtype(arguments[i]) == "player") {
				next.target = arguments[i];
			} else if (typeof arguments[i] == "number") {
				next.selectButton = [arguments[i], arguments[i]];
			} else if (get.itemtype(arguments[i]) == "select") {
				next.selectButton = arguments[i];
			} else if (typeof arguments[i] == "boolean") {
				if (!next.forced) {
					next.forced = arguments[i];
				} else {
					next.complexSelect = arguments[i];
				}
			} else if (get.itemtype(arguments[i]) == "position") {
				next.position = arguments[i];
			} else if (arguments[i] == "visible") {
				next.visible = true;
			} else if (arguments[i] == "complexSelect") {
				// 为直接添加complexSelect提供支持喵
				next.complexSelect = true;
			} else if (arguments[i] == "allowChooseAll") {
				next.allowChooseAll = true;
			} else if (typeof arguments[i] == "function") {
				if (next.ai) {
					next.filterButton = arguments[i];
				} else {
					next.ai = arguments[i];
				}
			} else if (typeof arguments[i] == "object" && arguments[i]) {
				var filter = get.filter(arguments[i]);
				next.filterButton = function (button) {
					return filter(button.link);
				};
			} else if (typeof arguments[i] == "string") {
				next.prompt = arguments[i];
			}
		}
		if (next.filterButton == undefined) {
			next.filterButton = lib.filter.all;
		}
		if (next.position == undefined) {
			next.position = "he";
		}
		if (next.selectButton == undefined) {
			next.selectButton = [1, 1];
		}
		if (next.ai == undefined) {
			next.ai = function (button) {
				var val = get.buttonValue(button);
				if (get.attitude(_status.event.player, get.owner(button.link)) > 0) {
					return -val;
				}
				return val;
			};
		}
		if (next.complexSelect !== false) {
			if (next.complexSelect === undefined && next.allowChooseAll === true) {
				// 如果complexSelect没有被显式的定义但是全选被显式要求了，那么我们默认认为调用者需要全选而不是complexSelect喵
				next.complexSelect = false;
			} else {
				next.complexSelect = true;
			}
		}
		next.setContent("discardPlayerCard");
		next._args = Array.from(arguments);
		return next;
	}
	gainPlayerCard() {
		var next = game.createEvent("gainPlayerCard");
		next.player = this;
		for (var i = 0; i < arguments.length; i++) {
			if (get.itemtype(arguments[i]) == "player") {
				next.target = arguments[i];
			} else if (typeof arguments[i] == "number") {
				next.selectButton = [arguments[i], arguments[i]];
			} else if (get.itemtype(arguments[i]) == "select") {
				next.selectButton = arguments[i];
			} else if (typeof arguments[i] == "boolean") {
				if (!next.forced) {
					next.forced = arguments[i];
				} else {
					next.complexSelect = arguments[i];
				}
			} else if (get.itemtype(arguments[i]) == "position") {
				next.position = arguments[i];
			} else if (arguments[i] == "visible") {
				next.visible = true;
			} else if (arguments[i] == "visibleMove") {
				next.visibleMove = true;
			} else if (arguments[i] == "complexSelect") {
				// 为直接添加complexSelect提供支持喵
				next.complexSelect = true;
			} else if (arguments[i] == "allowChooseAll") {
				next.allowChooseAll = true;
			} else if (typeof arguments[i] == "function") {
				if (next.ai) {
					next.filterButton = arguments[i];
				} else {
					next.ai = arguments[i];
				}
			} else if (typeof arguments[i] == "object" && arguments[i]) {
				var filter = get.filter(arguments[i]);
				next.filterButton = function (button) {
					return filter(button.link);
				};
			} else if (typeof arguments[i] == "string") {
				next.prompt = arguments[i];
			}
		}
		if (next.filterButton == undefined) {
			next.filterButton = lib.filter.all;
		}
		if (next.position == undefined) {
			next.position = "he";
		}
		if (next.selectButton == undefined) {
			next.selectButton = [1, 1];
		}
		if (next.ai == undefined) {
			next.ai = function (button) {
				var val = get.buttonValue(button);
				if (get.attitude(_status.event.player, get.owner(button.link)) > 0) {
					return -val;
				}
				return val;
			};
		}
		if (next.complexSelect !== false) {
			if (next.complexSelect === undefined && next.allowChooseAll === true) {
				// 如果complexSelect没有被显式的定义但是全选被显式要求了，那么我们默认认为调用者需要全选而不是complexSelect喵
				next.complexSelect = false;
			} else {
				next.complexSelect = true;
			}
		}
		next.setContent("gainPlayerCard");
		next._args = Array.from(arguments);
		next.gaintag = [];
		return next;
	}
	/**
	 * 玩家展示手牌
	 * @param { string } [str] 对话框的提示
	 * @returns { GameEvent }
	 */
	showHandcards(str) {
		/*var next = game.createEvent("showHandcards");
		next.player = this;
		if (typeof str == "string") {
			next.prompt = str;
		}
		next.setContent("showHandcards");
		next._args = Array.from(arguments);
		return next;*/
		const cards = this.getCards("h");
		if (cards.length) {
			if (typeof str !== "string") {
				str = get.translation(this) + "的手牌";
			}
			const next = this.showCards(cards, str);
			next._args = Array.from(arguments);
			return next;
		} else {
			return false;
		}
	}
	/**
	 * 玩家展示/亮出一些牌
	 * @param { Card[] } cards 要亮出或展示的牌
	 * @param { string } [str] 对话框的提示
	 * @param { boolean | undefined } [flashAnimation] 改变动画效果，变成类似判定那种
	 * @param { boolean | undefined } [isFlash] 是否是亮出牌（若改变动画效果后不设置该属性则默认为true）
	 * @returns { GameEvent }
	 */
	showCards(cards, str, flashAnimation = false, isFlash) {
		const next = game.createEvent("showCards");
		next.player = this;
		next.str = str;
		if (typeof cards == "string") {
			str = cards;
			cards = next.str;
			next.str = str;
		}
		if (get.itemtype(cards) == "card") {
			next.cards = [cards];
		} else if (get.itemtype(cards) == "cards") {
			next.cards = cards.slice(0);
		} else {
			_status.event.next.remove(next);
			next.resolve();
		}
		next.flashAnimation = flashAnimation;
		if (flashAnimation && !isFlash) {
			next.isFlash = true;
		} else {
			next.isFlash = false;
		}
		next.getShown = function (player) {
			const event = this;
			if (get.itemtype(player) != "player") {
				return (
					event.show_map?.get?.("others") || {
						cardPile: [],
						discardPile: [],
						ordering: [],
						special: [],
						noPosition: [],
					}
				);
			}
			return (
				event.show_map?.get?.(player) || {
					hs: [],
					es: [],
					js: [],
					xs: [],
					ss: [],
					cards2: [],
					cards: [],
				}
			);
		};
		next.setContent("showCards");
		next._args = Array.from(arguments);
		return next;
	}
	/**
	 * 玩家观看一些牌
	 * @param { string } str
	 * @param { Card[] } cards
	 * @returns { GameEvent }
	 */
	viewCards(str, cards) {
		var next = game.createEvent("viewCards");
		next.player = this;
		next.str = str;
		next.cards = cards.slice(0);
		next.setContent("viewCards");
		next._args = Array.from(arguments);
		return next;
	}
	/**
	 * 玩家观看target的手牌
	 * @param { Player } target
	 * @returns { GameEvent }
	 */
	viewHandcards(target) {
		var cards = target.getCards("h");
		if (cards.length) {
			return this.viewCards(get.translation(target) + "的手牌", cards);
		} else {
			return false;
		}
	}
	//TODO: 给canMoveCard函数适配虚拟牌的移动
	canMoveCard(withatt, nojudge) {
		const player = this;
		const args = Array.from(arguments).slice(2);
		let sourceTargets, aimTargets, filterCard, canReplace;
		args.forEach(arg => {
			if (get.itemtype(arg) == "players") {
				if (!sourceTargets) {
					sourceTargets = arg;
				} else if (!aimTargets) {
					aimTargets = arg;
				}
			} else if (get.itemtype(arg) == "player") {
				if (!sourceTargets) {
					sourceTargets = [arg];
				} else if (!aimTargets) {
					aimTargets = [arg];
				}
			} else if (typeof arg == "function") {
				filterCard = arg;
			} else if (typeof arg == "object" && arg) {
				filterCard = get.filter(arg);
			} else if (arg == "canReplace") {
				canReplace = true;
			}
		});
		if (!sourceTargets) {
			sourceTargets = game.filterPlayer();
		}
		if (!aimTargets) {
			aimTargets = game.filterPlayer();
		}
		return sourceTargets.some(current => {
			const att = get.sgn(get.attitude(player, current));
			if (!withatt || att != 0) {
				var es = current.getVCards("e", filterCard);
				for (var i = 0; i < es.length; i++) {
					if (
						aimTargets.some(current2 => {
							if (withatt) {
								if (get.sgn(get.value(es[i], current)) != -att) {
									return false;
								}
								var att2 = get.sgn(get.attitude(player, current2));
								if (!canReplace || (att < 0 && current2.countEquipableSlot(get.subtype(es[i])))) {
									if (att == att2 || att2 != get.sgn(get.effect(current2, es[i], player, current2))) {
										return false;
									}
								}
							}
							return current != current2 && !current2.isMin() && current2.canEquip(es[i], canReplace);
						})
					) {
						return true;
					}
				}
			}
			if (!nojudge && (!withatt || att > 0)) {
				var js = current.getVCards("j", filterCard);
				for (var i = 0; i < js.length; i++) {
					if (
						game.hasPlayer(function (current2) {
							if (!aimTargets.includes(current2)) {
								return false;
							}
							if (withatt) {
								var att2 = get.attitude(player, current2);
								if (att2 >= 0) {
									return false;
								}
							}
							return current != current2 && current2.canAddJudge(js[i]);
						})
					) {
						return true;
					}
				}
			}
		});
	}
	/**
	 * 移动一些牌
	 * @returns { GameEvent }
	 */
	moveCard() {
		var next = game.createEvent("moveCard");
		next.player = this;
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == "boolean") {
				next.forced = arguments[i];
			} else if (get.itemtype(arguments[i]) == "players") {
				if (!next.sourceTargets) {
					next.sourceTargets = arguments[i];
				} else if (!next.aimTargets) {
					next.aimTargets = arguments[i];
				}
			} else if (get.itemtype(arguments[i]) == "player") {
				if (!next.sourceTargets) {
					next.sourceTargets = [arguments[i]];
				} else if (!next.aimTargets) {
					next.aimTargets = [arguments[i]];
				}
			} else if (typeof arguments[i] == "string") {
				if (arguments[i] == "canReplace") {
					next.canReplace = true;
				} else {
					get.evtprompt(next, arguments[i]);
				}
			} else if (Array.isArray(arguments[i])) {
				for (var j = 0; j < arguments[i].length; j++) {
					if (typeof arguments[i][j] != "string") {
						break;
					}
				}
				if (j == arguments[i].length) {
					next.targetprompt = arguments[i];
				}
			} else if (typeof arguments[i] == "function") {
				next.filter = arguments[i];
			} else if (typeof arguments[i] == "object" && arguments[i]) {
				next.filter = get.filter(arguments[i]);
			}
		}
		if (!next.sourceTargets) {
			next.sourceTargets = game.filterPlayer();
		}
		if (!next.aimTargets) {
			next.aimTargets = game.filterPlayer();
		}
		if (next.filter == undefined) {
			next.filter = lib.filter.all;
		}
		next.setContent("moveCard");
		next._args = Array.from(arguments);
		return next;
	}
	useResult(result, event) {
		event = event || _status.event;
		if (result._sendskill) {
			lib.skill[result._sendskill[0]] = result._sendskill[1];
		}
		if (event.onresult) {
			event.onresult(result);
		}
		if (result.skill) {
			var info = get.info(result.skill);
			if (info.onuse) {
				info.onuse(result, this);
			}
			// if(info.direct&&!info.clearTime){
			// 	_status.noclearcountdown=true;
			// }
		}
		if (event.logSkill) {
			if (typeof event.logSkill == "string") {
				this.logSkill(event.logSkill);
			} else if (Array.isArray(event.logSkill)) {
				this.logSkill.call(this, ...event.logSkill);
			}
		}
		if (result.card || !result.skill) {
			result.used = result.card || result.cards[0];
			var next = this.useCard(result.used, result.cards, result.targets, result.skill);
			next.oncard = event.oncard;
			next.respondTo = event.respondTo;
			if (event.addCount === false) {
				next.addCount = false;
			}
			if (result._apply_args) {
				for (var i in result._apply_args) {
					next[i] = result._apply_args[i];
				}
			}
			return next;
		} else if (result.skill) {
			result.used = result.skill;
			return this.useSkill(result.skill, result.cards, result.targets);
		}
	}
	/**
	 * 令玩家使用牌
	 * @returns { GameEvent }
	 */
	useCard() {
		var next = game.createEvent("useCard");
		next.player = this;
		next.num = 0;
		for (var i = 0; i < arguments.length; i++) {
			if (get.itemtype(arguments[i]) == "cards") {
				next.cards = arguments[i].slice(0);
			} else if (get.itemtype(arguments[i]) == "players") {
				next.targets = arguments[i];
			} else if (get.itemtype(arguments[i]) == "player") {
				next.targets = [arguments[i]];
			} else if (get.itemtype(arguments[i]) == "card") {
				next.card = arguments[i];
			} else if (typeof arguments[i] == "object" && arguments[i] && arguments[i].name) {
				next.card = arguments[i];
			} else if (typeof arguments[i] == "string") {
				if (arguments[i] == "noai") {
					next.noai = true;
				} else if (arguments[i] == "nowuxie") {
					next.nowuxie = true;
				} else {
					next.skill = arguments[i];
				}
			} else if (typeof arguments[i] == "boolean") {
				next.addCount = arguments[i];
			}
		}
		if (next.cards == undefined) {
			if (get.itemtype(next.card) == "card") {
				next.cards = [next.card];
			} else {
				next.cards = [];
			}
		} else if (next.card == undefined) {
			if (next.cards) {
				next.card = next.cards[0];
			}
		}

		const event = get.event(),
			card = next.cards[0];
		next.modSkill = {
			cardname: null,
			cardnature: null,
			cardsuit: null,
			cardnumber: null,
		};
		const keys = Object.keys(next.modSkill).flat();
		if (event.name == "chooseToUse" && !next.skill && get.itemtype(card) == "card") {
			let skills = [];
			if (typeof this.getModableSkills === "function") {
				skills = this.getModableSkills();
			} else if (typeof this.getSkills === "function") {
				skills = this.getSkills().concat(lib.skill.global);
				game.expandSkills(skills);
				skills = skills.filter(i => {
					const info = get.info(i);
					return info && info.mod;
				});
				skills.sort((a, b) => get.priority(a) - get.priority(b));
			}
			for (const key of keys) {
				let preResult = "unchanged";
				for (const skill of skills) {
					const mod = get.info(skill).mod[key == "cardsuit" ? "suit" : key];
					if (mod) {
						let arg = [card, this, get[key.slice(4)](card, false), preResult];
						let result = mod.call(game, ...arg);
						if (key == "cardsuit") {
							const mod2 = get.info(skill).mod[key];
							if (mod2) {
								let arg2 = [card, this, get[key.slice(4)](card, false), result];
								result = mod2.call(game, ...arg2);
							}
						}
						if (result !== undefined && typeof arg[arg.length - 1] !== "object") {
							arg[arg.length - 1] = result;
						}
						if (arg[arg.length - 1] !== preResult) {
							next.modSkill[key] = skill;
							preResult = arg[arg.length - 1];
						}
					}
				}
			}
		}

		if (!next.targets) {
			next.targets = [];
		}
		if (next.card) {
			next.card = get.autoViewAs(next.card, next.cards);
			var info = get.info(next.card);
			if (info.changeTarget) {
				info.changeTarget(next.player, next.targets);
			}
			if (info.singleCard) {
				next._targets = next.targets.slice(0);
				next.target = next.targets[0];
				next.addedTargets = next.targets.splice(1);
				if (next.addedTargets.length) {
					next.addedTarget = next.addedTargets[0];
				}
			}
		}
		for (var i = 0; i < next.targets.length; i++) {
			if (get.attitude(this, next.targets[i]) >= -1 && get.attitude(this, next.targets[i]) < 0) {
				if (!this.ai.tempIgnore) {
					this.ai.tempIgnore = [];
				}
				this.ai.tempIgnore.add(next.targets[i]);
			}
		}
		if (
			typeof this.logAi == "function" &&
			!next.noai &&
			!get.info(next.card).noai &&
			!this.hasSkillTag(
				this,
				true,
				{
					card: next.card,
					targets: next.targets,
				},
				true
			)
		) {
			var postAi = get.info(next.card).postAi;
			if (postAi && postAi(next.targets)) {
				next.postAi = true;
			} else {
				this.logAi(next.targets, next.card);
			}
		}
		next.stocktargets = next.targets.slice(0);
		next.setContent("useCard");
		return next;
	}
	/**
	 * 令玩家使用某个技能
	 * @returns { GameEvent }
	 */
	useSkill() {
		var next = game.createEvent("useSkill");
		next.player = this;
		next.num = 0;
		for (var i = 0; i < arguments.length; i++) {
			if (get.itemtype(arguments[i]) == "cards") {
				next.cards = arguments[i].slice(0);
			} else if (get.itemtype(arguments[i]) == "players") {
				next.targets = arguments[i];
			} else if (get.itemtype(arguments[i]) == "card") {
				next.card = arguments[i];
			} else if (typeof arguments[i] == "string") {
				next.skill = arguments[i];
			} else if (typeof arguments[i] == "boolean") {
				next.addCount = arguments[i];
			}
		}
		if (next.cards == undefined) {
			next.cards = [];
		}
		if (next.skill && get.info(next.skill) && get.info(next.skill).changeTarget) {
			get.info(next.skill).changeTarget(next.player, next.targets);
		}
		if (next.targets) {
			for (var i = 0; i < next.targets.length; i++) {
				if (get.attitude(this, next.targets[i]) >= -1 && get.attitude(this, next.targets[i]) < 0) {
					if (!this.ai.tempIgnore) {
						this.ai.tempIgnore = [];
					}
					this.ai.tempIgnore.add(next.targets[i]);
				}
			}
			if (typeof this.logAi == "function") {
				this.logAi(next.targets, next.skill);
			}
		} else {
			next.targets = [];
		}
		next.setContent("useSkill");
		return next;
	}
	/**
	 * 令玩家摸牌摸至指定值
	 * @param { number } num
	 * @param { * } args
	 * @returns { GameEvent }
	 */
	drawTo(num, args) {
		var num2 = num - this.countCards("h");
		var next = this.draw(num2);
		if (Array.isArray(args)) {
			for (var i = 0; i < args.length; i++) {
				if (get.itemtype(args[i]) == "player") {
					next.source = args[i];
				} else if (typeof args[i] == "boolean") {
					next.animate = args[i];
				} else if (args[i] == "nodelay") {
					next.animate = false;
					next.$draw = true;
				} else if (args[i] == "visible") {
					next.visible = true;
				} else if (args[i] == "bottom") {
					next.bottom = true;
				} else if (typeof args[i] == "object" && args[i] && args[i].drawDeck != undefined) {
					next.drawDeck = args[i].drawDeck;
				}
			}
		}
		return next;
	}
	/**
	 * 令玩家摸牌
	 * @returns { GameEvent }
	 */
	draw() {
		var next = game.createEvent("draw");
		next.player = this;
		const event = _status.event;
		for (var i = 0; i < arguments.length; i++) {
			if (get.itemtype(arguments[i]) == "player") {
				next.source = arguments[i];
			} else if (typeof arguments[i] == "number") {
				next.num = arguments[i];
			} else if (typeof arguments[i] == "boolean") {
				next.animate = arguments[i];
			} else if (arguments[i] == "nodelay") {
				next.animate = false;
				next.$draw = true;
			} else if (arguments[i] == "visible") {
				next.visible = true;
			} else if (arguments[i] == "bottom") {
				next.bottom = true;
			} else if (typeof arguments[i] == "object" && arguments[i] && arguments[i].drawDeck != undefined) {
				next.drawDeck = arguments[i].drawDeck;
			}
		}
		if (typeof next.num != "number") {
			next.num = 1;
		}
		if (next.num <= 0) {
			_status.event.next.remove(next);
			next.resolve();
		}
		if (get.itemtype(next.source) != "player") {
			const source = event.player;
			if (source) {
				next.source = source;
			}
		}
		next.setContent("draw");
		if (lib.config.mode == "stone" && _status.mode == "deck" && next.drawDeck == undefined && !next.player.isMin() && next.num > 1) {
			next.drawDeck = 1;
		}
		next.result = [];
		next.gaintag = [];
		return next;
	}
	/**
	 * 令玩家随机弃置其区域内的一些牌
	 *
	 * num: number;
	 * 要弃置的牌数
	 *
	 * discarder?: Player;
	 * 弃牌来源，令Player弃牌的角色。默认目标角色
	 *
	 * position?: string;
	 * 弃牌区域，默认 "he"
	 *
	 * random?: "random";
	 * 是否纯随机，否则优先弃置能弃置的牌
	 *
	 * log?: 'popup' | 'logSkill' | false | string;
	 * 因对应Mod技能导致部分牌未被弃置时，是否为Mod技能执行对应函数。默认'popup'
	 *
	 * @returns { GameEvent }
	 */
	randomDiscard() {
		let position = "he",
			discarder = this,
			num = 1,
			random = false,
			log = "popup";
		for (let i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] === "number") {
				num = arguments[i];
			} else if (get.itemtype(arguments[i]) == "player") {
				discarder = arguments[i];
			} else if (get.itemtype(arguments[i]) === "position") {
				position = arguments[i];
			} else if (arguments[i] === "random") {
				random = true;
			} else if (arguments[i] === false || typeof arguments[i] === "string") {
				log = arguments[i];
			}
		}
		let cards;
		if (random) {
			cards = this.getCards(position).randomGets(num);
		} else {
			const discardable = this.getDiscardableCards(discarder, position);
			cards = discardable.randomGets(num);
			if (cards.length < num) {
				cards.addArray(this.getCards(position, c => !discardable.includes(c)).randomGets(num - cards.length));
			}
		}
		const next = this.modedDiscard(cards, discarder, log);
		return next;
	}
	randomGain() {
		var position = "he",
			num = 1,
			target = null,
			line = false;
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == "number") {
				num = arguments[i];
			} else if (get.itemtype(arguments[i]) == "position") {
				position = arguments[i];
			} else if (get.itemtype(arguments[i]) == "player") {
				target = arguments[i];
			} else if (typeof arguments[i] == "boolean") {
				line = arguments[i];
			}
		}
		if (target) {
			var cards = target.getCards(position).randomGets(num);
			if (cards.length) {
				if (line) {
					this.line(target, "green");
				}
				this.gain(cards, target, "log", "bySelf");
				target.$giveAuto(cards, this);
			}
			return cards;
		}
		return [];
	}
	/**
	 * 强制令玩家弃置其区域内的一些牌
	 *
	 * cards: Card[] | Card;
	 * 要弃置的牌
	 *
	 * discarder?: Player;
	 * 弃牌来源，令Player弃牌的角色
	 *
	 * position?: div | fragment;
	 * 经Mod筛选后的牌要置入的区域，默认ui.discardPile
	 *
	 * notBySelf?: 'notBySelf';
	 * 是否是他人弃置。discarder设置后会自动判断
	 *
	 * @returns { GameEvent }
	 */
	discard() {
		var next = game.createEvent("discard");
		next.player = this;
		next.num = 0;
		for (var i = 0; i < arguments.length; i++) {
			if (get.itemtype(arguments[i]) === "player") {
				next.discarder = arguments[i];
				if (this !== next.discarder) {
					next.notBySelf = true;
				}
			} else if (get.itemtype(arguments[i]) === "cards") {
				next.cards = arguments[i].slice(0);
			} else if (get.itemtype(arguments[i]) === "card") {
				next.cards = [arguments[i]];
			} else if (["div", "fragment"].includes(get.objtype(arguments[i]))) {
				next.position = arguments[i];
			} else if (arguments[i] === "notBySelf") {
				next.notBySelf = true;
			}
		}
		if (get.itemtype(next.cards) !== "cards") {
			_status.event.next.remove(next);
			next.resolve();
		}
		next.setContent("discard");
		return next;
	}
	/**
	 * 令玩家弃置其区域内一些能被弃置的牌
	 *
	 * cards: Card[] | Card;
	 * 要弃置的牌
	 *
	 * discarder?: Player;
	 * 弃牌来源，令Player弃牌的角色。默认目标角色
	 *
	 * position?: div | fragment;
	 * 经Mod筛选后的牌要置入的区域，默认ui.discardPile
	 *
	 * log?: 'popup' | 'logSkill' | false | string;
	 * 因对应Mod技能导致部分牌未被弃置时，是否为Mod技能执行对应函数。默认'popup'
	 *
	 * @returns { GameEvent }
	 */
	modedDiscard() {
		var next = game.createEvent("discard");
		next.player = this;
		next.discarder = this;
		next.cards = [];
		next.log = "popup";
		for (let i = 0; i < arguments.length; i++) {
			if (get.itemtype(arguments[i]) === "player") {
				next.discarder = arguments[i];
				if (this !== next.discarder) {
					next.notBySelf = true;
				}
			} else if (get.itemtype(arguments[i]) === "cards") {
				next.cards = arguments[i].slice(0);
			} else if (get.itemtype(arguments[i]) === "card") {
				next.cards = [arguments[i]];
			} else if (["div", "fragment"].includes(get.objtype(arguments[i]))) {
				next.position = arguments[i];
			} else if (arguments[i] === false || typeof arguments[i] === "string") {
				next.log = arguments[i];
			}
		}
		if (!next.cards.length) {
			_status.event.next.remove(next);
			next.resolve();
		}
		next.skills = [];
		next.protected_cards = [];
		let event = _status.event;
		if (typeof event !== "string") {
			event = event.getParent().name;
		}
		let skills = [];
		if (typeof this.getModableSkills === "function") {
			skills = this.getModableSkills();
		} else if (typeof this.getSkills === "function") {
			skills = this.getSkills().concat(lib.skill.global);
			game.expandSkills(skills);
			skills = skills.filter(i => {
				const info = get.info(i);
				return info && info.mod;
			});
			skills.sort((a, b) => get.priority(a) - get.priority(b));
		}
		for (let skill of skills) {
			let mod = get.info(skill).mod.canBeDiscarded;
			if (mod) {
				for (let i = 0; i < next.cards.length; i++) {
					let arg = [next.cards[i], next.discarder, this, event, "unchanged"],
						result = mod.call(game, ...arg);
					if (result !== undefined && typeof arg[arg.length - 1] !== "object") {
						arg[arg.length - 1] = result;
					}
					if (!arg[arg.length - 1]) {
						next.skills.add(skill);
						next.protected_cards.push(next.cards.splice(i--, 1)[0]);
					}
				}
			}
			mod = get.info(skill).mod.cardDiscardable;
			if (mod) {
				for (let i = 0; i < next.cards.length; i++) {
					let arg = [next.cards[i], this, event, "unchanged"],
						result = mod.call(game, ...arg);
					if (result !== undefined && typeof arg[arg.length - 1] !== "object") {
						arg[arg.length - 1] = result;
					}
					if (!arg[arg.length - 1]) {
						next.skills.add(skill);
						next.protected_cards.push(next.cards.splice(i--, 1)[0]);
					}
				}
			}
		}
		next.setContent(async function (event, trigger, player) {
			if (event.skills.length && event.log) {
				for (let i of event.skills) {
					if (typeof player[event.log] === "function") {
						player[event.log](i);
					}
				}
			}
			const cards = event.cards;
			if (cards.length) {
				game.log(player, "弃置了", cards);
				event.done = player.lose(cards, event.position, "visible");
				event.done.type = "discard";
				if (event.discarder) {
					event.done.discarder = event.discarder;
				}
				await event.done;
				await event.trigger("discard");
			}
			event.result = {
				bool: cards.length > 0,
				cards,
				skills: event.skills,
				protected_cards: event.protected_cards,
			};
		});
		return next;
	}
	/**
	 * 令玩家将一些牌置入弃牌堆
	 * @returns { GameEvent }
	 */
	loseToDiscardpile() {
		var next = game.createEvent("loseToDiscardpile");
		next.player = this;
		next.num = 0;
		for (var i = 0; i < arguments.length; i++) {
			if (get.itemtype(arguments[i]) == "player") {
				next.source = arguments[i];
			} else if (get.itemtype(arguments[i]) == "cards") {
				next.cards = arguments[i].slice(0);
			} else if (get.itemtype(arguments[i]) == "card") {
				next.cards = [arguments[i]];
			} else if (typeof arguments[i] == "boolean") {
				next.animate = arguments[i];
			} else if (["div", "fragment"].includes(get.objtype(arguments[i]))) {
				next.position = arguments[i];
			} else if (arguments[i] == "notBySelf") {
				next.notBySelf = true;
			} else if (arguments[i] == "insert") {
				next.insert_card = true;
			} else if (arguments[i] == "blank") {
				next.blank = true;
			}
		}
		if (next.cards == undefined) {
			_status.event.next.remove(next);
			next.resolve();
		}
		next.setContent("loseToDiscardpile");
		return next;
	}
	/**
	 * 令玩家打出牌
	 * @returns { GameEvent }
	 */
	respond() {
		var next = game.createEvent("respond");
		next.player = this;
		for (var i = 0; i < arguments.length; i++) {
			if (get.itemtype(arguments[i]) == "cards") {
				next.cards = arguments[i].slice(0);
			} else if (get.itemtype(arguments[i]) == "card") {
				next.card = arguments[i];
			} else if (get.itemtype(arguments[i]) == "player") {
				next.source = arguments[i];
			} else if (typeof arguments[i] == "object" && arguments[i] && arguments[i].name) {
				next.card = arguments[i];
			} else if (typeof arguments[i] == "boolean") {
				next.animate = arguments[i];
			} else if (arguments[i] == "highlight") {
				next.highlight = true;
			} else if (arguments[i] == "noOrdering") {
				next.noOrdering = true;
			} else if (typeof arguments[i] == "string") {
				next.skill = arguments[i];
			}
		}
		if (next.cards == undefined) {
			if (get.itemtype(next.card) == "card") {
				next.cards = [next.card];
			} else {
				next.cards = [];
			}
		} else if (next.card == undefined) {
			if (next.cards) {
				next.card = next.cards[0];
			}
		}

		const event = get.event(),
			card = next.cards[0];
		next.modSkill = {
			cardname: null,
			cardnature: null,
			cardsuit: null,
			cardnumber: null,
		};
		const keys = Object.keys(next.modSkill).flat();
		if (event.name == "chooseToRespond" && !next.skill && get.itemtype(card) == "card") {
			let skills = [];
			if (typeof this.getModableSkills === "function") {
				skills = this.getModableSkills();
			} else if (typeof this.getSkills === "function") {
				skills = this.getSkills().concat(lib.skill.global);
				game.expandSkills(skills);
				skills = skills.filter(i => {
					const info = get.info(i);
					return info && info.mod;
				});
				skills.sort((a, b) => get.priority(a) - get.priority(b));
			}
			for (const key of keys) {
				let preResult = "unchanged";
				for (const skill of skills) {
					const mod = get.info(skill).mod[key == "cardsuit" ? "suit" : key];
					if (mod) {
						let arg = [card, this, get[key.slice(4)](card, false), preResult];
						let result = mod.call(game, ...arg);
						if (key == "cardsuit") {
							const mod2 = get.info(skill).mod[key];
							if (mod2) {
								let arg2 = [card, this, get[key.slice(4)](card, false), result];
								result = mod2.call(game, ...arg2);
							}
						}
						if (result !== undefined && typeof arg[arg.length - 1] !== "object") {
							arg[arg.length - 1] = result;
						}
						if (arg[arg.length - 1] !== preResult) {
							next.modSkill[key] = skill;
							preResult = arg[arg.length - 1];
						}
					}
				}
			}
		}

		if (next.card) {
			next.card = get.autoViewAs(next.card, next.cards);
		}
		next.setContent("respond");
		return next;
	}
	swapHandcards(target, cards1, cards2) {
		var next = game.createEvent("swapHandcards", false);
		next.player = this;
		next.target = target;
		if (cards1) {
			next.cards1 = cards1;
		}
		if (cards2) {
			next.cards2 = cards2;
		}
		next.setContent("swapHandcards");
		return next;
	}
	directequip(cards) {
		if (get.itemtype(cards) === "card") {
			cards = [cards];
		}
		for (const card of cards) {
			this.addVirtualEquip(
				...(() => {
					if (get.itemtype(card) === "vcard") {
						return [card, card.cards ?? []];
					}
					return [card.cardSymbol ? card[card.cardSymbol] : get.autoViewAs(card, void 0, false), [card]];
				})()
			);
		}
		if (!_status.video) {
			game.addVideo("directequip", this, get.cardsInfo(cards));
		}
	}
	$addToExpansion(cards, broadcast, gaintag, check = true) {
		var hs = this.getCards("x");
		for (var i = 0; i < cards.length; i++) {
			if (hs.includes(cards[i]) && check) {
				cards.splice(i--, 1);
			}
		}
		for (var i = 0; i < cards.length; i++) {
			cards[i].fix();
			if (gaintag) {
				gaintag.forEach(tag => cards[i].addGaintag(tag));
			}
			var sort = lib.config.sort_card(cards[i]);
			this.node.expansions.insertBefore(cards[i], this.node.expansions.firstChild);
		}
		if (broadcast !== false) {
			game.broadcast(
				function (player, cards, gaintag, check) {
					player.$addToExpansion(cards, null, gaintag, check);
				},
				this,
				cards,
				gaintag,
				check
			);
		}
		return this;
	}
	directgain(cards, broadcast, gaintag) {
		var hs = this.getCards("hs");
		for (var i = 0; i < cards.length; i++) {
			if (hs.includes(cards[i])) {
				cards.splice(i--, 1);
			}
		}
		for (var i = 0; i < cards.length; i++) {
			cards[i].fix();
			if (gaintag) {
				if (typeof gaintag == "string") {
					gaintag = [gaintag];
				}
				//cards[i].addGaintag(gaintag);
				gaintag.forEach(tag => cards[i].addGaintag(tag));
			}
			var sort = lib.config.sort_card(cards[i]);
			if (this == game.me) {
				cards[i].classList.add("drawinghidden");
			}
			if (get.is.singleHandcard() || sort > 0) {
				this.node.handcards1.insertBefore(cards[i], this.node.handcards1.firstChild);
			} else {
				this.node.handcards2.insertBefore(cards[i], this.node.handcards2.firstChild);
			}
		}
		if (this == game.me || _status.video) {
			ui.updatehl();
		}
		if (!_status.video) {
			game.addVideo("directgain", this, get.cardsInfo(cards));
			this.update();
		}
		if (broadcast !== false) {
			game.broadcast(
				function (player, cards) {
					player.directgain(cards);
				},
				this,
				cards
			);
		}
		return this;
	}
	directgains(cards, broadcast, gaintag) {
		var hs = this.getCards("hs");
		for (var i = 0; i < cards.length; i++) {
			if (hs.includes(cards[i])) {
				cards.splice(i--, 1);
			}
		}
		var addLast = function (card, node) {
			if (gaintag) {
				for (var i = 0; i < node.childNodes.length; i++) {
					var add = node.childNodes[node.childNodes.length - i - 1];
					if (!add.classList.contains("glows")) {
						break;
					}
					if (add.hasGaintag(gaintag)) {
						node.insertBefore(card, add.nextSibling);
						return;
					}
				}
			}
			node.appendChild(card);
		};
		for (var i = 0; i < cards.length; i++) {
			cards[i].fix();
			cards[i].remove();
			if (gaintag) {
				if (typeof gaintag == "string") {
					gaintag = [gaintag];
				}
				//cards[i].addGaintag(gaintag);
				gaintag.forEach(tag => cards[i].addGaintag(tag));
			}
			cards[i].classList.add("glows");
			if (this == game.me) {
				cards[i].classList.add("drawinghidden");
			}
			if (get.is.singleHandcard()) {
				addLast(cards[i], this.node.handcards1);
			} else {
				addLast(cards[i], this.node.handcards2);
			}
		}
		if (this == game.me || _status.video) {
			ui.updatehl();
		}
		if (!_status.video) {
			game.addVideo("directgains", this, {
				cards: get.cardsInfo(cards),
				gaintag,
			});
			this.update();
		}
		if (broadcast !== false) {
			game.broadcast(
				function (player, cards, gaintag) {
					player.directgains(cards, null, gaintag);
				},
				this,
				cards,
				gaintag
			);
		}
		return this;
	}
	/**
	 * @param { Player[] } targets
	 * @param { string } [position = "h"]
	 */
	gainMultiple(targets, position = "h") {
		var next = game.createEvent("gainMultiple", false);
		next.setContent("gainMultiple");
		next.player = this;
		next.targets = targets;
		next.position = position || "h";
		return next;
	}
	/**
	 * 令玩家获得一些牌
	 * @returns { GameEvent }
	 */
	gain() {
		var next = game.createEvent("gain");
		next.player = this;
		for (var i = 0; i < arguments.length; i++) {
			if (get.itemtype(arguments[i]) == "player") {
				next.source = arguments[i];
			} else if (get.itemtype(arguments[i]) == "cards") {
				next.cards = arguments[i].slice(0);
			} else if (get.itemtype(arguments[i]) == "card") {
				next.cards = [arguments[i]];
			} else if (arguments[i] === "log") {
				next.log = true;
			} else if (arguments[i] == "fromStorage") {
				next.fromStorage = true;
			} else if (
				typeof arguments[i] == "string" &&
				Array.from(lib.commonArea.keys()).some(area => lib.commonArea.get(area)?.fromName == arguments[i])
			) {
				next.fromStorage = true;
				next[arguments[i]] = true;
			} else if (arguments[i] == "bySelf") {
				next.bySelf = true;
			} else if (typeof arguments[i] == "string") {
				next.animate = arguments[i];
			} else if (typeof arguments[i] == "boolean") {
				next.delay = arguments[i];
			}
		}
		if (next.animate == "gain2" || next.animate == "draw2") {
			if (!("log" in next)) {
				next.log = true;
			}
		}
		if (get.itemtype(next.cards) !== "cards") {
			next.cards = [];
		}
		next.setContent("gain");
		next.getd = function (player, key, position) {
			if (!position) {
				position = ui.discardPile;
			}
			if (!key) {
				key = "cards";
			}
			var cards = [],
				event = this;
			game.checkGlobalHistory("cardMove", function (evt) {
				if (evt.name != "lose" || evt.position != position || evt.getParent() != event) {
					return;
				}
				if (player && player != evt.player) {
					return;
				}
				cards.addArray(evt[key]);
			});
			return cards;
		};
		next.getl = function (player) {
			const that = this;
			const map = {
				player: player,
				hs: [],
				es: [],
				js: [],
				ss: [],
				xs: [],
				cards: [],
				cards2: [],
				gaintag_map: {},
				vcard_map: new Map(),
			};
			player.checkHistory("lose", function (evt) {
				if (evt.parent == that) {
					map.hs.addArray(evt.hs);
					map.es.addArray(evt.es);
					map.js.addArray(evt.js);
					map.ss.addArray(evt.ss);
					map.xs.addArray(evt.xs);
					map.cards.addArray(evt.cards);
					map.cards2.addArray(evt.cards2);
					for (let key in evt.gaintag_map) {
						if (!map.gaintag_map[key]) {
							map.gaintag_map[key] = [];
						}
						map.gaintag_map[key].addArray(evt.gaintag_map[key]);
					}
					evt.vcard_map.forEach((value, key) => {
						map.vcard_map.set(key, value);
					});
				}
			});
			return map;
		};
		next.getg = function (player) {
			if (this.getlx === false || player != this.player || !this.cards) {
				return [];
			}
			return this.cards.slice(0);
		};
		next.gaintag = [];
		return next;
	}
	/**
	 * 将一些牌置入玩家的武将牌上
	 * @returns { GameEvent }
	 */
	addToExpansion() {
		var next = game.createEvent("addToExpansion");
		next.player = this;
		for (var i = 0; i < arguments.length; i++) {
			if (get.itemtype(arguments[i]) == "player") {
				next.source = arguments[i];
			} else if (get.itemtype(arguments[i]) == "cards") {
				next.cards = arguments[i].slice(0);
			} else if (get.itemtype(arguments[i]) == "card") {
				next.cards = [arguments[i]];
			} else if (arguments[i] === "log") {
				next.log = true;
			} else if (arguments[i] == "fromStorage") {
				next.fromStorage = true;
			} else if (
				typeof arguments[i] == "string" &&
				Array.from(lib.commonArea.keys()).some(area => lib.commonArea.get(area)?.fromName == arguments[i])
			) {
				next.fromStorage = true;
				next[arguments[i]] = true;
			} else if (arguments[i] == "bySelf") {
				next.bySelf = true;
			} else if (typeof arguments[i] == "string") {
				next.animate = arguments[i];
			} else if (typeof arguments[i] == "boolean") {
				next.delay = arguments[i];
			}
		}
		if (next.animate == "gain2" || next.animate == "draw2" || next.animate == "give") {
			if (!("log" in next)) {
				next.log = true;
			}
		}
		if (get.itemtype(next.cards) !== "cards") {
			next.cards = [];
		}
		next.setContent("addToExpansion");
		next.getd = function (player, key, position) {
			if (!position) {
				position = ui.discardPile;
			}
			if (!key) {
				key = "cards";
			}
			var cards = [],
				event = this;
			game.checkGlobalHistory("cardMove", function (evt) {
				if (evt.name != "lose" || evt.position != position || evt.getParent() != event) {
					return;
				}
				if (player && player != evt.player) {
					return;
				}
				cards.addArray(evt[key]);
			});
			return cards;
		};
		next.getl = function (player) {
			const that = this;
			const map = {
				player: player,
				hs: [],
				es: [],
				js: [],
				ss: [],
				xs: [],
				cards: [],
				cards2: [],
				gaintag_map: {},
				vcard_map: new Map(),
			};
			player.checkHistory("lose", function (evt) {
				if (evt.parent == that) {
					map.hs.addArray(evt.hs);
					map.es.addArray(evt.es);
					map.js.addArray(evt.js);
					map.ss.addArray(evt.ss);
					map.xs.addArray(evt.xs);
					map.cards.addArray(evt.cards);
					map.cards2.addArray(evt.cards2);
					for (let key in evt.gaintag_map) {
						if (!map.gaintag_map[key]) {
							map.gaintag_map[key] = [];
						}
						map.gaintag_map[key].addArray(evt.gaintag_map[key]);
					}
					evt.vcard_map.forEach((value, key) => {
						map.vcard_map.set(key, value);
					});
				}
			});
			return map;
		};
		next.getg = function (player) {
			return [];
		};
		next.gaintag = [];
		return next;
	}
	/**
	 * 玩家交给target一些牌
	 * @param { Card | Card[] } cards
	 * @param { Player } target
	 * @param { boolean } [visible]
	 */
	give(cards, target, visible) {
		var next = target.gain(cards, this);
		next.animate = visible ? "give" : "giveAuto";
		next.giver = this;
		return next;
	}
	lose() {
		var next = game.createEvent("lose");
		next.player = this;
		next.forceDie = true;
		for (var i = 0; i < arguments.length; i++) {
			if (get.itemtype(arguments[i]) == "player") {
				next.source = arguments[i];
			} else if (get.itemtype(arguments[i]) == "cards") {
				next.cards = arguments[i].slice(0);
			} else if (get.itemtype(arguments[i]) == "card") {
				next.cards = [arguments[i]];
			} else if (["div", "fragment"].includes(get.objtype(arguments[i]))) {
				next.position = arguments[i];
			} else if (arguments[i] == "toStorage") {
				next.toStorage = true;
			} else if (
				typeof arguments[i] == "string" &&
				Array.from(lib.commonArea.keys()).some(area => lib.commonArea.get(area)?.toName == arguments[i])
			) {
				next.toStorage = true;
				next[arguments[i]] = true;
			} else if (arguments[i] == "visible") {
				next.visible = true;
			} else if (arguments[i] == "insert") {
				next.insert_card = true;
			}
		}
		if (next.cards) {
			var hej = this.getCards("hejsx");
			for (var i = 0; i < next.cards.length; i++) {
				if (!hej.includes(next.cards[i])) {
					next.cards.splice(i--, 1);
				}
			}
		}
		if (!next.cards || !next.cards.length) {
			_status.event.next.remove(next);
			next.resolve();
		} else {
			if (next.position == undefined) {
				next.position = ui.discardPile;
			}
			next.cards = next.cards.slice(0);
		}
		next.setContent("lose");
		next.getd = function (player, key, position) {
			if (!position) {
				position = ui.discardPile;
			}
			if (!key) {
				key = "cards";
			}
			if (this.getlx === false || this.position != position || (player && this.player != player) || !Array.isArray(this[key])) {
				return [];
			}
			return this[key].slice(0);
		};
		next.getl = function (player) {
			if (this.getlx !== false && this.player == player) {
				return this;
			}
			return {
				player: player,
				hs: [],
				es: [],
				js: [],
				ss: [],
				xs: [],
				cards: [],
				cards2: [],
				gaintag_map: {},
				vcard_map: new Map(),
			};
		};
		next.getg = function (player) {
			return [];
		};
		next.vcard_map = new Map();
		return next;
	}
	/**
	 * 令玩家受到伤害
	 * @returns { GameEvent }
	 */
	damage() {
		const next = game.createEvent("damage");
		//next.forceDie=true;
		next.player = this;
		let noCard, noSource;
		const event = _status.event;
		for (const argument of arguments) {
			if (get.itemtype(argument) == "cards") {
				next.cards = argument.slice();
			} else if (get.itemtype(argument) == "card") {
				next.card = argument;
			} else if (typeof argument == "number") {
				next.num = argument;
			} else if (get.itemtype(argument) == "player") {
				next.source = argument;
			} else if (argument && typeof argument == "object" && argument.name) {
				next.card = argument;
			} else if (argument == "nocard") {
				noCard = true;
			} else if (argument == "nosource") {
				noSource = true;
			} else if (argument == "notrigger") {
				next._triggered = null;
				next.notrigger = true;
			} else if (argument == "unreal") {
				next.unreal = true;
			} else if (argument == "nohujia") {
				next.nohujia = true;
			} else if (get.itemtype(argument) == "nature" && argument != "stab") {
				next.nature = argument;
			} else if (get.itemtype(argument) == "natures") {
				const natures = argument.split(lib.natureSeparator).remove("stab");
				if (natures.length) {
					next.nature = natures.join(lib.natureSeparator);
				}
			}
		}
		if (!next.card && !noCard) {
			next.card = event.card;
		}
		if (!next.cards && !noCard) {
			next.cards = event.cards;
		}
		if (!next.source && !noSource) {
			const source = event.customSource || event.player;
			if (source && !source.isDead()) {
				next.source = source;
			}
		}
		if (typeof next.num != "number") {
			next.num = (event.baseDamage || 1) + (event.extraDamage || 0);
		}
		next.original_num = next.num;
		next.change_history = [];
		next.hasNature = function (nature) {
			if (!nature) {
				return Boolean(this.nature && this.nature.length > 0);
			}
			let natures = get.natureList(nature),
				naturesx = get.natureList(this.nature);
			if (nature == "linked") {
				return naturesx.some(n => lib.linked.includes(n));
			}
			return get.is.sameNature(natures, naturesx);
		};
		if (next.hasNature("poison")) {
			delete next._triggered;
		} else if (next.unreal) {
			next._triggered = 2;
		}
		next.setContent("damage");
		next.filterStop = function () {
			if (this.source && this.source.isDead()) {
				delete this.source;
			}
			var num = this.original_num;
			for (var i of this.change_history) {
				num += i;
			}
			if (num != this.num) {
				this.change_history.push(this.num - num);
			}
			if (this.num <= 0) {
				delete this.filterStop;
				this.trigger("damageZero");
				this.finish();
				this._triggered = null;
				return true;
			}
		};
		return next;
	}
	/**
	 * 令玩家回复体力
	 * @returns { GameEvent }
	 */
	recover() {
		var next = game.createEvent("recover");
		next.player = this;
		var nocard, nosource;
		var event = _status.event;
		for (var i = 0; i < arguments.length; i++) {
			if (get.itemtype(arguments[i]) == "cards") {
				next.cards = arguments[i].slice(0);
			} else if (get.itemtype(arguments[i]) == "card") {
				next.card = arguments[i];
			} else if (get.itemtype(arguments[i]) == "player") {
				next.source = arguments[i];
			} else if (typeof arguments[i] == "object" && arguments[i] && arguments[i].name) {
				next.card = arguments[i];
			} else if (typeof arguments[i] == "number") {
				next.num = arguments[i];
			} else if (arguments[i] == "nocard") {
				nocard = true;
			} else if (arguments[i] == "nosource") {
				nosource = true;
			}
		}
		if (next.card == undefined && !nocard) {
			next.card = event.card;
		}
		if (next.cards == undefined && !nocard) {
			next.cards = event.cards;
		}
		if (next.source == undefined && !nosource) {
			next.source = event.customSource || event.player;
		}
		if (next.num == undefined) {
			next.num = (event.baseDamage || 1) + (event.extraDamage || 0);
		}
		next.filterStop = function () {
			if (this.num <= 0 || this.player.isHealthy()) {
				delete this.filterStop;
				this.finish();
				this._triggered = null;
				return true;
			}
		};
		next.setContent("recover");
		return next;
	}
	/**
	 * 令玩家回复体力至指定值
	 * @returns { GameEvent }
	 */
	recoverTo() {
		const newArguments = [];
		let num = 1;
		for (let i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] === "number") {
				num = arguments[i] - this.getHp(true);
				newArguments.push(num);
			} else {
				newArguments.push(arguments[i]);
			}
		}
		return this.recover(...newArguments);
	}
	doubleDraw() {
		var next = game.createEvent("doubleDraw");
		if (get.is.changban()) {
			_status.event.next.remove(next);
			next.resolve();
		}
		next.player = this;
		next.setContent("doubleDraw");
		return next;
	}
	/**
	 * 令玩家流失体力
	 * @param { number } [num]
	 */
	loseHp(num) {
		var next = game.createEvent("loseHp");
		next.num = num;
		next.player = this;
		if (next.num == undefined) {
			next.num = 1;
		}
		next.setContent("loseHp");
		next.filterStop = function () {
			if (this.num <= 0) {
				delete this.filterStop;
				this.finish();
				this._triggered = null;
				return true;
			}
		};
		return next;
	}
	/**
	 * 扣减玩家的体力上限
	 * @returns { GameEvent }}
	 */
	loseMaxHp() {
		var next = game.createEvent("loseMaxHp");
		next.player = this;
		next.num = 1;
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] === "number") {
				next.num = arguments[i];
			} else if (typeof arguments[i] === "boolean") {
				next.forced = arguments[i];
			}
		}
		next.setContent("loseMaxHp");
		return next;
	}
	/**
	 * 令玩家获得体力上限
	 * @returns { GameEvent }
	 */
	gainMaxHp() {
		var next = game.createEvent("gainMaxHp");
		next.player = this;
		next.num = 1;
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] === "number") {
				next.num = arguments[i];
			} else if (typeof arguments[i] === "boolean") {
				next.forced = arguments[i];
			}
		}
		next.setContent("gainMaxHp");
		return next;
	}
	/**
	 * 调整玩家的体力值
	 * @param { number } num
	 * @param { boolean } [popup]
	 * @returns { GameEvent }
	 */
	changeHp(num, popup) {
		var next = game.createEvent("changeHp");
		next.num = num;
		if (popup != undefined) {
			next.popup = popup;
		}
		next.player = this;
		next.setContent("changeHp");
		return next;
	}
	/**
	 * 调整玩家的护甲值
	 * @param { number } [num]
	 * @param { "gain" | "lose" | "damage" | "null" } [type]
	 * @param { number } [limit] 护甲上限
	 * @returns { GameEvent }
	 */
	changeHujia(num, type, limit) {
		var next = game.createEvent("changeHujia");
		if (typeof num != "number") {
			num = 1;
		}
		if (limit === true) {
			limit = 5;
		}
		if (typeof limit == "number" && this.hujia + num > parseInt(limit)) {
			num = Math.max(0, parseInt(limit) - this.hujia);
		}
		if (typeof type != "string") {
			if (num > 0) {
				type = "gain";
			} else if (num < 0) {
				type = "lose";
			} else {
				type = "null";
			}
		}
		next.num = num;
		next.player = this;
		next.type = type;
		next.setContent("changeHujia");
		return next;
	}
	getBuff() {
		var list = [1, 2, 3, 4, 5, 6];
		var nodelay = false;
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == "number") {
				list.remove(arguments[i]);
			} else if (arguments[i] === false) {
				nodelay = true;
			}
		}
		if (this.isHealthy()) {
			list.remove(2);
		}
		if (!this.countCards("j")) {
			list.remove(5);
		}
		if (!this.isLinked() && !this.isTurnedOver()) {
			list.remove(6);
		}
		if (this.hasSkill("qianxing")) {
			list.remove(4);
		}
		switch (list.randomGet()) {
			case 1:
				this.draw(nodelay ? "nodelay" : 1);
				break;
			case 2:
				this.recover();
				break;
			case 3:
				this.changeHujia();
				break;
			case 4:
				this.tempHide();
				break;
			case 5:
				this.discard(this.getCards("j")).delay = !nodelay;
				break;
			case 6: {
				if (this.isLinked()) {
					this.link();
				}
				if (this.isTurnedOver()) {
					this.turnOver();
				}
				break;
			}
		}
		return this;
	}
	getDebuff() {
		var list = [1, 2, 3, 4, 5, 6];
		var nodelay = false;
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == "number") {
				list.remove(arguments[i]);
			} else if (arguments[i] === false) {
				nodelay = true;
			}
		}
		if (this.countCards("he") == 0) {
			list.remove(1);
		}
		if (this.isLinked()) {
			list.remove(4);
		}
		if (this.hasSkill("fengyin")) {
			list.remove(5);
		}
		if (this.hp == 1) {
			list.remove(3);
			if (list.length > 1) {
				list.remove(2);
			}
		}
		if (!list.length) {
			return this;
		}
		var num = list.randomGet();
		switch (list.randomGet()) {
			case 1:
				this.randomDiscard(nodelay ? false : "he");
				break;
			case 2:
				this.loseHp();
				break;
			case 3:
				this.damage();
				break;
			case 4:
				if (!this.isLinked()) {
					this.link();
				}
				break;
			case 5:
				this.addTempSkill("fengyin", { player: "phaseAfter" });
				break;
			case 6: {
				var list = [];
				for (var i = 0; i < lib.inpile.length; i++) {
					var info = lib.card[lib.inpile[i]];
					if (info.type == "delay" && !info.cancel && !this.hasJudge(lib.inpile[i])) {
						list.push(lib.inpile[i]);
					}
				}
				if (list.length) {
					var card = game.createCard(list.randomGet());
					this.addJudge(card);
					this.$draw(card);
					if (!nodelay) {
						game.delay();
					}
				} else {
					this.getDebuff(6);
				}
				break;
			}
		}
		return this;
	}
	/**
	 * 令玩家进入濒死状态
	 * @param { GameEvent } [reason]
	 * @returns { GameEvent }
	 */
	dying(reason) {
		if (this.nodying || this.hp > 0 || this.isDying()) {
			return;
		}
		var next = game.createEvent("dying");
		next.player = this;
		next.reason = reason;
		if (reason && reason.source) {
			next.source = reason.source;
		}
		next.setContent("dying");
		next.filterStop = function () {
			if (this.player.hp > 0 || this.nodying) {
				delete this.filterStop;
				return true;
			}
		};
		return next;
	}
	/**
	 * 令玩家死亡或进入休整状态
	 * @param { GameEvent } reason 导致角色死亡的事件
	 * @returns { GameEvent }
	 */
	die(reason, restMap = { type: null, count: null, audio: null }) {
		var next = game.createEvent("die");
		next.player = this;
		next.reason = reason;
		//next.restMap = restMap;
		if (reason) {
			next.source = reason.source;
		}
		next.excludeMark = [];
		next.setContent("die");
		return next;
	}
	/**
	 * 令玩家休整，同时会触发rest时机
	 * @param { object | undefined } restMap 进入休整状态状态相关的参数（type是休整的计数方式，"round"是在你的额定回合开始前才计数，"phase"是每回合都计数；count是休整多少轮或者多少回合（为负数则永久休整，可以自主脱离））
	 * @returns { GameEvent }
	 */
	rest(restMap = { type: "phase", count: -1 }) {
		//, audio: null
		const next = game.createEvent("rest", false);
		next.player = this;
		next.restMap = restMap;
		next.forceDie = true;
		next.includeOut = true;
		next.setContent("rest");
		return next;
	}
	/**
	 * 令玩家结束休整
	 * @param { object | undefined } reseEndMap 进入休整状态状态相关的参数（hp是脱离休整复活时回复至的体力值）
	 * @returns { GameEvent }
	 */
	restEnd(restEndMap = { hp: null }) {
		//, audio: null
		const next = game.createEvent("restEnd", false);
		restEndMap.hp ??= this.maxHp;
		next.player = this;
		next.restEndMap = restEndMap;
		next.forceDie = true;
		next.includeOut = true;
		next.setContent("restEnd");
		return next;
	}
	/**
	 * 令玩家复活
	 * @param { number } [hp = 1]
	 * @param { boolean } [log]
	 */
	revive(hp, log) {
		if (log !== false) {
			game.log(this, "复活");
		}
		this.maxHp = Math.max(1, this.maxHp);
		this.hp = hp || 1;
		game.addVideo("revive", this);
		this.classList.remove("dead");
		this.removeAttribute("style");
		this.node.avatar.style.transform = "";
		this.node.avatar2.style.transform = "";
		this.node.hp.show();
		this.node.equips.show();
		this.node.count.show();
		this.update();
		var player;
		player = this.previousSeat;
		while (player.isDead()) {
			player = player.previousSeat;
		}
		player.next = this;
		this.previous = player;
		player = this.nextSeat;
		while (player.isDead()) {
			player = player.nextSeat;
		}
		player.previous = this;
		this.next = player;
		game.players.add(this);
		game.dead.remove(this);
		if (this == game.me) {
			if (ui.auto) {
				ui.auto.show();
			}
			if (ui.wuxie) {
				ui.wuxie.show();
			}
			if (ui.revive) {
				ui.revive.close();
				delete ui.revive;
			}
			if (ui.exit) {
				ui.exit.close();
				delete ui.exit;
			}
			if (ui.swap) {
				ui.swap.close();
				delete ui.swap;
			}
			if (ui.restart) {
				ui.restart.close();
				delete ui.restart;
			}
			if (ui.continue_game) {
				ui.continue_game.close();
				delete ui.continue_game;
			}
			if (this.node.dieidentity) {
				this.node.dieidentity.delete();
				delete this.node.dieidentity;
			}
		}
	}
	/**
	 * 令玩家复活--事件化
	 * @param { number } [hp = 1]
	 * @param { boolean } [log]
	 */
	reviveEvent(hp, log) {
		const next = game.createEvent("revive");
		next.player = this;
		if (hp) {
			next.hp = hp;
		} else {
			next.hp = 1;
		}
		next.log = log;
		next.forceDie = true;
		next.setContent("revive");
		return next;
	}
	isMad() {
		return this.hasSkill("mad");
	}
	/**
	 * 令玩家进入混乱状态
	 */
	goMad(end) {
		if (end) {
			this.addTempSkill("mad", end);
		} else {
			this.addSkill("mad");
		}
		game.log(this, "进入混乱状态");
	}
	/**
	 * 解除玩家的混乱状态
	 */
	unMad() {
		this.removeSkill("mad");
	}
	tempHide() {
		this.addTempSkill("qianxing", { player: "phaseBeginStart" });
	}
	addExpose(num) {
		if (typeof this.ai.shown == "number" && !this.identityShown && this.ai.shown < 1) {
			this.ai.shown += num;
			if (this.ai.shown > 0.95) {
				this.ai.shown = 0.95;
			}
		}
		return this;
	}
	equip(card, draw) {
		var next = game.createEvent("equip");
		//next.card = card;
		next.player = this;
		next.setContent(lib.element.content.equip);
		//if (get.is.object(next.card) && next.card.cards) next.card = next.card.cards[0];
		//next.cards = [next.card];
		//不接受VCard
		let itemtype = get.itemtype(card);
		if (itemtype === "card") {
			next.cards = [card];
		} else {
			next.cards = card?.cards || [];
		}
		if (card.isViewAsCard) {
			next.card = card;
			next.cards = card[card.cardSymbol].cards;
			next.vcard = card[card.cardSymbol];
		} else {
			next.card = card;
		}
		if (draw) {
			next.draw = true;
		}
		//检查card合法性
		if ((next.cards.length > 1 && next.cards.some(cardx => cardx.isViewAsCard)) || !next.card.name) {
			//装备牌的实体牌数大于1时需要全部都为真实卡牌
			_status.event.next.remove(next);
			next.resolve();
		}
		next.getd = function (player, key, position) {
			if (!position) {
				position = ui.discardPile;
			}
			if (!key) {
				key = "cards";
			}
			var cards = [],
				event = this;
			game.checkGlobalHistory("cardMove", function (evt) {
				if (evt.name != "lose" || evt.position != position || evt.getParent() != event) {
					return;
				}
				if (player && player != evt.player) {
					return;
				}
				cards.addArray(evt[key]);
			});
			return cards;
		};
		next.getl = function (player) {
			const that = this;
			const map = {
				player: player,
				hs: [],
				es: [],
				js: [],
				ss: [],
				xs: [],
				cards: [],
				cards2: [],
				gaintag_map: {},
				vcard_map: new Map(),
			};
			player.checkHistory("lose", function (evt) {
				if (evt.parent == that) {
					map.hs.addArray(evt.hs);
					map.es.addArray(evt.es);
					map.js.addArray(evt.js);
					map.ss.addArray(evt.ss);
					map.xs.addArray(evt.xs);
					map.cards.addArray(evt.cards);
					map.cards2.addArray(evt.cards2);
					for (let key in evt.gaintag_map) {
						if (!map.gaintag_map[key]) {
							map.gaintag_map[key] = [];
						}
						map.gaintag_map[key].addArray(evt.gaintag_map[key]);
					}
					evt.vcard_map.forEach((value, key) => {
						map.vcard_map.set(key, value);
					});
				}
			});
			return map;
		};
		next.getg = function (player) {
			return [];
		};
		return next;
	}
	/**
	 * 将一些牌置入到玩家的判定区
	 * @param { Card } card
	 * @param { Card[] } [cards]
	 * @returns { GameEvent }
	 */
	addJudge(card, cards) {
		var next = game.createEvent("addJudge");
		if (get.itemtype(card) == "card") {
			next.card = card;
			if (card.isViewAsCard) {
				next.cards = card[card.cardSymbol].cards;
			} else {
				next.cards = [card];
			}
		} else {
			next.cards = cards;
			if (get.itemtype(next.cards) == "card") {
				next.cards = [next.cards];
			}
			if (typeof card == "string") {
				card = { name: card };
			}
			next.card = get.autoViewAs(card, next.cards);
		}
		next.player = this;
		next.setContent("addJudge");
		next.getd = function (player, key, position) {
			if (!position) {
				position = ui.discardPile;
			}
			if (!key) {
				key = "cards";
			}
			var cards = [],
				event = this;
			game.checkGlobalHistory("cardMove", function (evt) {
				if (evt.name != "lose" || evt.position != position || evt.getParent() != event) {
					return;
				}
				if (player && player != evt.player) {
					return;
				}
				cards.addArray(evt[key]);
			});
			return cards;
		};
		next.getl = function (player) {
			const that = this;
			const map = {
				player: player,
				hs: [],
				es: [],
				js: [],
				ss: [],
				xs: [],
				cards: [],
				cards2: [],
				gaintag_map: {},
				vcard_map: new Map(),
			};
			player.checkHistory("lose", function (evt) {
				if (evt.parent == that) {
					map.hs.addArray(evt.hs);
					map.es.addArray(evt.es);
					map.js.addArray(evt.js);
					map.ss.addArray(evt.ss);
					map.xs.addArray(evt.xs);
					map.cards.addArray(evt.cards);
					map.cards2.addArray(evt.cards2);
					for (let key in evt.gaintag_map) {
						if (!map.gaintag_map[key]) {
							map.gaintag_map[key] = [];
						}
						map.gaintag_map[key].addArray(evt.gaintag_map[key]);
					}
					evt.vcard_map.forEach((value, key) => {
						map.vcard_map.set(key, value);
					});
				}
			});
			return map;
		};
		next.getg = function (player) {
			return [];
		};
		return next;
	}
	/**
	 * 返回某些牌是否能进入玩家的判定区
	 * @overload
	 * @param { string | Card } card
	 * @param { Player } player
	 * @returns { boolean }
	 */
	canAddJudge(card, player) {
		if (this.isDisabledJudge()) {
			return false;
		}
		let name;
		if (typeof card == "string") {
			name = card;
		} else {
			name = card.viewAs || card.name;
		}
		if (!name) {
			return false;
		}
		const cardInfo = lib.card[name];
		if (!cardInfo) {
			return false;
		}
		if (!cardInfo.allowDuplicate && this.hasJudge(name)) {
			return false;
		}
		if (this.isOut()) {
			return false;
		}
		if (!player) {
			player = this;
		}
		return true;
	}
	addJudgeNext(card, unlimited) {
		if (!card.expired) {
			const name = card.viewAs || card.name;
			const cards = get.itemtype(card) == "card" ? [card] : (card.cards ?? []);
			//if (get.itemtype(cards) != "cards") return;
			if (
				!unlimited &&
				cards.some(card => {
					const position = get.position(card, true);
					return position != "j" && position != "o";
				})
			) {
				game.log(card, "已被移出处理区，无法置入判定区");
				return;
			}
			let target = this;
			do {
				target = target.getNext();
				if (!target) {
					target = this;
				}
				if (lib.filter.judge(card, target, target)) {
					break;
				}
				if (target == this) {
					target = null;
				}
			} while (target);
			if (target) {
				return target.addJudge(card, cards);
			}
		} else {
			card.expired = false;
		}
	}
	judge() {
		var next = game.createEvent("judge");
		next.player = this;
		for (var i = 0; i < arguments.length; i++) {
			if (get.itemtype(arguments[i]) == "card" || get.is.object(arguments[i])) {
				next.card = arguments[i];
			} else if (typeof arguments[i] == "string") {
				next.skill = arguments[i];
			} else if (typeof arguments[i] == "function") {
				next.judge = arguments[i];
			} else if (typeof arguments[i] == "boolean") {
				next.clearArena = arguments[i];
			} else if (["div", "fragment"].includes(get.objtype(arguments[i]))) {
				next.position = arguments[i];
			}
		}
		if (next.card && next.judge == undefined) {
			next.judge = get.judge(next.card);
			next.judge2 = get.judge2(next.card);
		}
		if (next.judge == undefined) {
			next.judge = function () {
				return 0;
			};
		}
		if (next.position == undefined) {
			next.position = ui.discardPile;
		}
		if (next.card) {
			next.cardname = next.card.viewAs || next.card.name;
		}

		var str = "";
		if (next.card) {
			str = get.translation(next.card.viewAs || next.card.name);
		} else if (next.skill) {
			str = get.translation(next.skill);
		} else {
			str = get.translation(_status.event.name);
		}
		next.judgestr = str;
		next.setContent("judge");
		return next;
	}
	turnOver(bool) {
		var next = game.createEvent("turnOver");
		next.player = this;
		next.includeOut = true;
		next.setContent("turnOver");
		if (typeof bool == "boolean") {
			if (bool) {
				if (this.isTurnedOver()) {
					_status.event.next.remove(next);
					next.resolve();
				}
			} else {
				if (!this.isTurnedOver()) {
					_status.event.next.remove(next);
					next.resolve();
				}
			}
		}
		return next;
	}
	out(skill) {
		if (typeof skill == "number") {
			this.outCount += skill;
		} else if (typeof skill == "string") {
			if (!this.outSkills) {
				this.outSkills = [];
			}
			this.outSkills.add(skill);
		} else {
			this.outCount++;
		}
		if (!this.classList.contains("out")) {
			this.classList.add("out");
			game.log(this, "离开游戏");
		}
		if (!game.countPlayer()) {
			game.over();
		}
	}
	in(skill) {
		if (this.isOut()) {
			if (typeof skill == "string") {
				if (this.outSkills) {
					this.outSkills.remove(skill);
					if (!this.outSkills.length) {
						delete this.outSkills;
					}
				}
			} else if (typeof skill == "number") {
				this.outCount -= skill;
			} else {
				if (skill === true) {
					delete this.outSkills;
				}
				this.outCount = 0;
			}
			if (this.outCount <= 0 && !this.outSkills) {
				this.outCount = 0;
				this.classList.remove("out");
				game.log(this, "进入游戏");
			}
		}
	}
	link(bool) {
		var next = game.createEvent("link");
		next.player = this;
		next.setContent("link");
		if (typeof bool == "boolean") {
			if (bool) {
				if (this.isLinked()) {
					_status.event.next.remove(next);
					next.resolve();
				}
			} else {
				if (!this.isLinked()) {
					_status.event.next.remove(next);
					next.resolve();
				}
			}
		}
		return next;
	}
	skip(name) {
		this.skipList.add(name);
	}
	wait(callback) {
		if (lib.node) {
			if (typeof callback == "function") {
				callback._noname_waiting = true;
				lib.node.torespond[this.playerid] = callback;
			} else {
				lib.node.torespond[this.playerid] = "_noname_waiting";
			}
			clearTimeout(lib.node.torespondtimeout[this.playerid]);
			if (this.ws && !this.ws.closed) {
				var player = this;
				var time = parseInt(lib.configOL.choose_timeout) * 1000;
				if (_status.event._global_timer || _status.event.getParent().skillHidden) {
					for (var i = 0; i < game.players.length; i++) {
						game.players[i].showTimer(time);
					}
					player._hide_all_timer = true;
				} else if (!_status.event._global_waiting && _status.noclearcountdown !== "direct") {
					player.showTimer(time);
				}
				lib.node.torespondtimeout[this.playerid] = setTimeout(function () {
					player.unwait("ai");
					player.ws.ws.close();
				}, time + 5000);
			}
		}
	}
	unwait(result) {
		if (this._hide_all_timer) {
			delete this._hide_all_timer;
			for (var i = 0; i < game.players.length; i++) {
				game.players[i].hideTimer();
			}
		} else if (
			!get.event()._global_waiting &&
			(_status.noclearcountdown !== "direct" || (result && result.bool)) &&
			!(result && result._noHidingTimer)
		) {
			this.hideTimer();
		}
		clearTimeout(lib.node.torespondtimeout[this.playerid]);
		delete lib.node.torespondtimeout[this.playerid];
		if (!(this.playerid in lib.node.torespond)) {
			return;
		}
		var noresume = false;
		var proceed = null;
		if (typeof lib.node.torespond[this.playerid] == "function" && lib.node.torespond[this.playerid]._noname_waiting) {
			proceed = lib.node.torespond[this.playerid](result, this);
			if (proceed === false) {
				noresume = true;
			}
		}
		lib.node.torespond[this.playerid] = result;
		for (var i in lib.node.torespond) {
			if (lib.node.torespond[i] == "_noname_waiting") {
				return;
			} else if (lib.node.torespond[i] && lib.node.torespond[i]._noname_waiting) {
				return;
			}
		}
		_status.event.result = result;
		_status.event.resultOL = lib.node.torespond;
		lib.node.torespond = {};
		if (typeof proceed == "function") {
			proceed();
		} else if (_status.paused && !noresume) {
			game.resume();
		}

		if (lib.node.waitForResult[this.playerid]?.length > 0) {
			const current = lib.node.waitForResult[this.playerid].pop();
			current(result);
			// delete lib.node.waitForResult[this.playerid];
		}
	}
	tempUnwait(result) {
		if (!(this.playerid in lib.node.torespond)) {
			return;
		}
		var proceed;
		if (typeof lib.node.torespond[this.playerid] == "function" && lib.node.torespond[this.playerid]._noname_waiting) {
			proceed = lib.node.torespond[this.playerid](result, this);
		}
		if (typeof proceed == "function") {
			proceed();
		}
	}
	/**
	 * @param { string | string[] } name
	 * @param { Player | Player[] } [targets]
	 * @param { boolean | string } [nature]
	 * @param { boolean } [logv]
	 */
	logSkill(name, targets, nature, logv, args) {
		if (get.itemtype(targets) == "player") {
			targets = [targets];
		}
		var nopop = false;
		var popname = name;
		if (Array.isArray(name)) {
			popname = name[1];
			name = name[0];
		}
		var checkShow = this.checkShow(name);
		if (lib.translate[name]) {
			this.trySkillAnimate(name, popname, checkShow);
			if (Array.isArray(targets) && targets.length) {
				var str;
				if (targets[0] == this) {
					str = "#b自己";
					if (targets.length > 1) {
						str += "、";
						str += get.translation(targets.slice(1));
					}
				} else {
					str = targets;
				}
				game.log(this, "对", str, "发动了", "【" + get.skillTranslation(name, this) + "】");
			} else {
				game.log(this, "发动了", "【" + get.skillTranslation(name, this) + "】");
			}
		}
		if (nature != false) {
			if (nature === undefined) {
				nature = "green";
			}
			this.line(targets, nature);
		}
		var info = lib.skill[name];
		if (info && info.ai && info.ai.expose != undefined && this.logAi && (!targets || targets.length != 1 || targets[0] != this)) {
			this.logAi(lib.skill[name].ai.expose);
		}
		if (info && info.round) {
			var roundname = name + "_roundcount";
			this.storage[roundname] = game.roundNumber;
			this.syncStorage(roundname);
			this.markSkill(roundname);
		}
		game.trySkillAudio(name, this, true, null, null, args);
		if (game.chess) {
			this.chessFocus();
		}
		if (logv === true) {
			game.logv(this, name, targets, null, true);
		} else if (info && info.logv !== false) {
			game.logv(this, name, targets);
		}
		if (info) {
			var player = this;
			var players = player.getSkills(false, false, false);
			var equips = player.getSkills("e");
			var global = lib.skill.global.slice(0);
			var logInfo = {
				skill: name,
				targets: targets,
				event: _status.event,
			};
			if (info.sourceSkill) {
				logInfo.sourceSkill = info.sourceSkill;
				if (global.includes(info.sourceSkill)) {
					logInfo.type = "global";
				} else if (players.includes(info.sourceSkill)) {
					logInfo.type = "player";
				} else if (equips.includes(info.sourceSkill)) {
					logInfo.type = "equip";
				}
			} else {
				if (global.includes(name)) {
					logInfo.sourceSkill = name;
					logInfo.type = "global";
				} else if (players.includes(name)) {
					logInfo.sourceSkill = name;
					logInfo.type = "player";
				} else if (equips.includes(name)) {
					logInfo.sourceSkill = name;
					logInfo.type = "equip";
				} else {
					var bool = false;
					for (var i of players) {
						var expand = [i];
						game.expandSkills(expand);
						if (expand.includes(name)) {
							bool = true;
							logInfo.sourceSkill = i;
							logInfo.type = "player";
							break;
						}
					}
					if (!bool) {
						for (var i of players) {
							var expand = [i];
							game.expandSkills(expand);
							if (expand.includes(name)) {
								logInfo.sourceSkill = i;
								logInfo.type = "equip";
								break;
							}
						}
					}
				}
			}
			var next = game.createEvent("logSkill", false),
				evt = _status.event;
			next.player = player;
			next.forceDie = true;
			next.includeOut = true;
			evt.next.remove(next);
			if (evt.logSkill || evt.name?.startsWith("pre_")) {
				evt = evt.getParent();
			}
			for (var i in logInfo) {
				if (i == "event") {
					next.log_event = logInfo[i];
				} else {
					next[i] = logInfo[i];
				}
			}
			evt.after.push(next);
			next.setContent("emptyEvent");
			player.getHistory("useSkill").push(logInfo);
			//尽可能别往这写插入结算
			//不能用来终止技能发动！！！
			var next2 = game.createEvent("logSkillBegin", false, get.event());
			next2.player = player;
			next2.forceDie = true;
			next2.includeOut = true;
			for (var i in logInfo) {
				if (i == "event") {
					next2.log_event = logInfo[i];
				} else {
					next2[i] = logInfo[i];
				}
			}
			next2.setContent("emptyEvent");
		}
		if (this._hookTrigger) {
			for (var i = 0; i < this._hookTrigger.length; i++) {
				var info = lib.skill[this._hookTrigger[i]].hookTrigger;
				if (info && info.log) {
					info.log(this, name, targets);
				}
			}
		}
	}
	unprompt() {
		if (this.node.prompt) {
			this.node.prompt.delete();
			delete this.node.prompt;
		}
	}
	prompt(str, nature) {
		var node;
		if (this.node.prompt) {
			node = this.node.prompt;
			node.innerHTML = "";
			node.className = "damage normal-font damageadded";
		} else {
			node = ui.create.div(".damage.normal-font", this);
			this.node.prompt = node;
			ui.refresh(node);
			node.classList.add("damageadded");
		}
		node.innerHTML = str;
		node.dataset.nature = nature || "soil";
	}
	prompt_old(name2, className) {
		var node;
		if (this.node.prompt) {
			node = this.node.prompt;
			node.innerHTML = "";
			node.className = "popup";
		} else {
			node = ui.create.div(".popup", this.parentNode);
			this.node.prompt = node;
		}
		node.dataset.position = this.dataset.position;
		if (
			this.dataset.position == 0 ||
			parseInt(this.dataset.position) == parseInt(ui.arena.dataset.number) / 2 ||
			typeof name2 == "number" ||
			this.classList.contains("minskin")
		) {
			node.innerHTML = name2;
		} else {
			for (var i = 0; i < name2.length; i++) {
				node.innerHTML += name2[i] + "<br/>";
			}
		}
		if (className) {
			node.classList.add(className);
		}
	}
	/**
	 *
	 * @param { string } name
	 * @param { string } className
	 * @param { Parameters<this["damagepop"]>[3] } [nobroadcast]
	 */
	popup(name, className = "water", nobroadcast) {
		var name2 = get.translation(name);
		if (!name2) {
			return;
		}
		this.$damagepop(name2, className || "water", true, nobroadcast);
	}
	popup_old(name, className) {
		var name2 = get.translation(name);
		var node = ui.create.div(".popup", this.parentNode);
		if (!name2) {
			node.remove();
			return node;
		}
		game.addVideo("popup", this, [name, className]);
		node.dataset.position = this.dataset.position;
		if (
			this.dataset.position == 0 ||
			parseInt(this.dataset.position) == parseInt(ui.arena.dataset.number) / 2 ||
			typeof name2 == "number" ||
			this.classList.contains("minskin")
		) {
			node.innerHTML = name2;
		} else {
			for (var i = 0; i < name2.length; i++) {
				node.innerHTML += name2[i] + "<br/>";
			}
		}
		if (className) {
			node.classList.add(className);
		}
		this.popups.push(node);
		if (this.popups.length > 1) {
			node.hide();
		} else {
			var that = this;
			setTimeout(function () {
				that._popup();
			}, 1000);
		}
		return node;
	}
	_popup() {
		if (this.popups.length) {
			this.popups.shift().delete();
			if (this.popups.length) {
				this.popups[0].show();
				var that = this;
				setTimeout(function () {
					that._popup();
				}, 1000);
			}
		}
	}
	showTimer(time) {
		if (!time && lib.configOL) {
			time = parseInt(lib.configOL.choose_timeout) * 1000;
		}
		if (_status.connectMode && !game.online) {
			game.broadcast(
				function (player, time) {
					player.showTimer(time);
				},
				this,
				time
			);
		}
		if (this == game.me) {
			return;
		}
		if (this.node.timer) {
			this.node.timer.remove();
		}
		var timer = ui.create.div(".timerbar", this);
		this.node.timer = timer;
		ui.create.div(this.node.timer);
		var bar = ui.create.div(this.node.timer);
		ui.refresh(bar);
		bar.style.transitionDuration = time / 1000 + "s";
		bar.style.transform = "scale(0,1)";
	}
	hideTimer() {
		if (_status.connectMode && !game.online && this.playerid) {
			game.broadcast(function (player) {
				player.hideTimer();
			}, this);
		}
		if (this.node.timer) {
			this.node.timer.delete();
			delete this.node.timer;
		}
	}
	/**
	 * 向角色对应storage中添加相应元素，刷新标记状态
	 * @param { string } name 技能ID
	 * @param { * } [info] 向storage数组中添加对应元素/元素数组
	 */
	markAuto(name, info) {
		if (typeof info != "undefined") {
			if (!Array.isArray(this.storage[name])) {
				this.storage[name] = [];
			}
			if (Array.isArray(info)) {
				this.storage[name].addArray(info);
			} else {
				this.storage[name].add(info);
			}
			this.markSkill(name);
		} else {
			var storage = this.storage[name];
			if (Array.isArray(storage)) {
				this[storage.length > 0 ? "markSkill" : "unmarkSkill"](name);
			} else if (typeof storage == "number") {
				this[storage > 0 ? "markSkill" : "unmarkSkill"](name);
			} else if (storage) {
				this.markSkill(name);
			} else {
				this.unmarkSkill(name);
			}
		}
	}
	/**
	 * 移除角色对应storage中相应元素并刷新标记状态
	 * @param { string } name 技能ID
	 * @param { * } info 移除storage数组中对应元素/元素数组
	 */
	unmarkAuto(name, info) {
		var storage = this.storage[name];
		if (Array.isArray(storage)) {
			if (Array.isArray(info)) {
				storage.removeArray(info.slice(0));
			} else {
				storage.remove(info);
			}
			this[storage.length > 0 ? "markSkill" : "unmarkSkill"](name);
		}
	}
	getExpansions(tag) {
		return this.getCards("x", card => card.hasGaintag(tag));
	}
	countExpansions(tag) {
		return this.getExpansions(tag).length;
	}
	hasExpansions(tag) {
		return this.countExpansions(tag) > 0;
	}
	setStorage(name, value, mark) {
		this.storage[name] = value;
		if (mark) {
			this.markAuto(name);
		}
		return value;
	}
	/**
	 * 获取this.storage[name]的值
	 * @param { string } name
	 * @param { any } defaultValue 预设值，默认为[]（不修改原storage）
	 * @returns
	 */
	getStorage(name, defaultValue = []) {
		return this.storage[name] || defaultValue;
	}
	hasStorage(name, value) {
		if (!(name in this.storage)) {
			return false;
		}
		if (typeof value == "undefined") {
			return true;
		}
		const storage = this.storage[name];
		if (storage === value) {
			return true;
		}
		return Array.isArray(storage) && storage.includes(value);
	}
	hasStorageAny(name, values) {
		const storage = this.storage[name];
		if (!Array.isArray(values)) {
			values = Array.from(arguments).slice(1);
		}
		if (!storage) {
			return false;
		}
		if (!Array.isArray(storage)) {
			return values.includes(storage);
		}
		return values.some(item => storage.includes(item));
	}
	hasStorageAll(name, values) {
		const storage = this.storage[name];
		if (!Array.isArray(values)) {
			values = Array.from(arguments).slice(1);
		}
		if (!storage) {
			return false;
		}
		if (!Array.isArray(storage)) {
			return false;
		}
		return values.every(item => storage.includes(item));
	}
	initStorage(name, value, mark) {
		return this.hasStorage(name) ? this.getStorage(name) : this.setStorage(name, value, mark);
	}
	updateStorage(name, operation, mark) {
		return this.setStorage(name, operation(this.getStorage(name)), mark);
	}
	updateStorageAsync(name, operation, mark) {
		return Promise.resolve(this.getStorage(name))
			.then(value => operation(value))
			.then(value => this.setStorage(name, value, mark));
	}
	removeStorage(name, mark) {
		if (!this.hasStorage(name)) {
			return false;
		}
		delete this.storage[name];
		if (mark) {
			this.unmarkSkill(name);
		}
		return true;
	}
	/**
	 * target特定技能标记内容仅对player可见的一个方法，具体用法请看【统观】和【识草】这两个技能
	 * @param {string} skill
	 * @param {Player} target
	 * @param {GameEvent} event
	 */
	localMarkSkill(skill, target, event) {
		const func = (skill, player) => {
			var name = skill,
				info;
			if (player.marks[name]) {
				player.updateMarks();
			}
			if (lib.skill[name]) {
				info = lib.skill[name].intro;
			}
			if (!info) {
				return;
			}
			if (player.marks[name]) {
				player.marks[name].info = info;
			} else {
				player.marks[name] = player.mark(name, info);
			}
			player.updateMarks();
		};
		if (event.player == game.me) {
			func(skill, target);
		} else if (event.isOnline()) {
			this.send(func, skill, target);
		}
	}
	markSkill(name, info, card, nobroadcast) {
		if (info === true) {
			this.syncStorage(name);
			info = null;
		}
		if (get.itemtype(card) == "card") {
			game.addVideo("markSkill", this, [name, get.cardInfo(card)]);
		} else {
			game.addVideo("markSkill", this, [name]);
		}
		const func = function (storage, player, name, info, card) {
			player.storage[name] = storage;
			if (!info) {
				if (player.marks[name]) {
					player.updateMarks();
					return;
				}
				if (lib.skill[name]) {
					info = lib.skill[name].intro;
				}
				if (!info) {
					return;
				}
			}
			if (player.marks[name]) {
				player.marks[name].info = info;
			} else {
				if (card) {
					player.marks[name] = player.mark(card, info, name);
				} else {
					player.marks[name] = player.mark(name, info);
				}
			}
			player.updateMarks();
		};
		func(this.storage[name], this, name, info, card);
		if (!nobroadcast) {
			game.broadcast(func, this.storage[name], this, name, info, card);
		}
		return this;
	}
	unmarkSkill(name, nobroadcast) {
		game.addVideo("unmarkSkill", this, name);
		if (!nobroadcast) {
			game.broadcast(
				function (player, name) {
					if (player.marks[name]) {
						player.marks[name].delete();
						player.marks[name].style.transform += " scale(0.2)";
						delete player.marks[name];
						ui.updatem(player);
					}
				},
				this,
				name
			);
		}
		if (this.marks[name]) {
			this.marks[name].delete();
			this.marks[name].style.transform += " scale(0.2)";
			delete this.marks[name];
			ui.updatem(this);
			var info = lib.skill[name];
			if (!game.online && info && info.intro && info.intro.onunmark) {
				if (info.intro.onunmark == "throw") {
					if (get.itemtype(this.storage[name]) == "cards") {
						this.$throw(this.storage[name], 1000);
						game.cardsDiscard(this.storage[name]);
						game.log(this.storage[name], "进入了弃牌堆");
						this.storage[name].length = 0;
					}
				} else if (typeof info.intro.onunmark == "function") {
					info.intro.onunmark(this.storage[name], this);
				} else {
					delete this.storage[name];
				}
			}
		}
		return this;
	}
	markSkillCharacter(id, target, name, content, nobroadcast) {
		if (typeof target == "object") {
			target = target.name;
		}
		const func = function (player, target, name, content, id) {
			if (player.marks[id]) {
				player.marks[id].name = name + "_charactermark";
				player.marks[id]._name = target;
				player.marks[id].info = {
					name: name,
					content: content,
					id: id,
				};
				player.marks[id].setBackground(target, "character");
				game.addVideo("changeMarkCharacter", player, {
					id: id,
					name: name,
					content: content,
					target: target,
				});
			} else {
				player.marks[id] = player.markCharacter(target, {
					name: name,
					content: content,
					id: id,
				});
				player.marks[id]._name = target;
				game.addVideo("markCharacter", player, {
					name: name,
					content: content,
					id: id,
					target: target,
				});
			}
		};
		func(this, target, name, content, id);
		if (!nobroadcast) {
			game.broadcast(func, this, target, name, content, id);
		}
		return this;
	}
	markCharacter(name, info, learn, learn2) {
		if (typeof name == "object") {
			name = name.name;
		}
		var node;
		if (name.startsWith("unknown")) {
			node = ui.create.div(".card.mark.drawinghidden");
			ui.create.div(".background.skillmark", node).innerHTML = get.translation(name)[0];
		} else {
			if (!get.character(name)) {
				return;
			}
			node = ui.create.div(".card.mark.drawinghidden").setBackground(name, "character");
		}
		this.node.marks.insertBefore(node, this.node.marks.childNodes[1]);
		node.name = name + "_charactermark";
		if (!info) {
			info = {};
		}
		if (!info.name) {
			info.name = get.translation(name);
		}
		if (!info.content) {
			info.content = get.skillintro(name, learn, learn2);
		}
		node.info = info;
		node.addEventListener(lib.config.touchscreen ? "touchend" : "click", ui.click.card);
		if (!lib.config.touchscreen) {
			if (lib.config.hover_all) {
				lib.setHover(node, ui.click.hoverplayer);
			}
			if (lib.config.right_info) {
				node.oncontextmenu = ui.click.rightplayer;
			}
		}
		ui.updatem(this);
		return node;
	}
	mark(name, info, skill) {
		if (get.itemtype(name) == "cards") {
			var marks = [];
			for (var i = 0; i < name.length; i++) {
				marks.push(this.mark(name[i], info));
			}
			return marks;
		} else {
			var node;
			if (get.itemtype(name) == "card") {
				node = name.copy("mark");
				node.classList.add("drawinghidden");
				this.node.marks.insertBefore(node, this.node.marks.childNodes[1]);
				node.suit = name.suit;
				node.number = name.number;
				// if(name.name&&lib.card[name.name]&&lib.card[name.name].markimage){
				// 	node.node.image.style.left=lib.card[name.name].markimage;
				// }

				if (name.classList.contains("fullborder")) {
					node.classList.add("fakejudge");
					node.classList.add("fakemark");
					(node.querySelector(".background") || ui.create.div(".background", node)).innerHTML =
						lib.translate[name.name + "_bg"] || get.translation(name.name)[0];
				}

				name = name.name;
			} else {
				node = ui.create.div(".card.mark.drawinghidden");
				this.node.marks.insertBefore(node, this.node.marks.childNodes[1]);
				if (lib.skill[name] && lib.skill[name].markimage) {
					node.setBackgroundImage(lib.skill[name].markimage);
					node.style["box-shadow"] = "none";
					node.style["background-size"] = "contain";
				} else if (lib.skill[name] && lib.skill[name].markimage2) {
					let img = ui.create.div(".background.skillmark", node);
					img.setBackgroundImage(lib.skill[name].markimage2);
					img.style["background-size"] = "contain";
				} else {
					var str = lib.translate[name + "_bg"];
					if (!str || str[0] == "+" || str[0] == "-") {
						str = get.translation(name)[0];
					}
					ui.create.div(".background.skillmark", node).innerHTML = str;
				}
			}
			node.name = name;
			node.skill = skill || name;
			if (typeof info == "object") {
				node.info = info;
			} else if (typeof info == "string") {
				node.markidentifer = info;
			}
			node.addEventListener(lib.config.touchscreen ? "touchend" : "click", ui.click.card);
			if (!lib.config.touchscreen) {
				if (lib.config.hover_all) {
					lib.setHover(node, ui.click.hoverplayer);
				}
				if (lib.config.right_info) {
					node.oncontextmenu = ui.click.rightplayer;
				}
			}
			this.updateMarks();
			ui.updatem(this);
			return node;
		}
	}
	unmark(name, info) {
		game.addVideo("unmarkname", this, name);
		if (get.itemtype(name) == "card") {
			this.unmark(name.name, info);
		} else if (get.itemtype(name) == "cards") {
			for (var i = 0; i < name.length; i++) {
				this.unmark(name[i].name, info);
			}
		} else {
			for (var i = 0; i < this.node.marks.childNodes.length; i++) {
				if (this.node.marks.childNodes[i].name == name && (!info || this.node.marks.childNodes[i].markidentifer == info)) {
					this.node.marks.childNodes[i].delete();
					this.node.marks.childNodes[i].style.transform += " scale(0.2)";
					ui.updatem(this);
					return;
				}
			}
		}
	}
	addLink() {
		if (get.is.linked2(this)) {
			this.classList.add("linked2");
		} else {
			this.classList.add("linked");
		}
	}
	removeLink() {
		if (get.is.linked2(this)) {
			this.classList.remove("linked2");
		} else {
			this.classList.remove("linked");
		}
	}
	/**
	 * 能否对target使用card
	 * @param { Card | VCard | object | string } card
	 * @param { Player } target
	 * @param { false } [distance] false：无距离限制
	 * @param { boolean | GameEvent } [includecard] 是否受使用次数限制，可以填入用于检测的事件
	 * @returns
	 */
	canUse(card, target, distance, includecard) {
		if (typeof card == "string") {
			card = { name: card, isCard: true };
		}
		var info = get.info(card);
		if (info.multicheck && !info.multicheck(card, this)) {
			return false;
		}
		if (!lib.filter.cardEnabled(card, this)) {
			return false;
		}
		if (includecard) {
			let evt = includecard;
			if (typeof evt !== "object") {
				evt = _status.event.getParent("chooseToUse");
			}
			if (get.itemtype(evt) !== "event") {
				evt = undefined;
			}
			if (!lib.filter.cardUsable(card, this, evt)) {
				return false;
			}
		}
		if (distance !== false && !lib.filter.targetInRange(card, this, target)) {
			return false;
		}
		return lib.filter[includecard ? "targetEnabledx" : "targetEnabled"](card, this, target);
	}
	/**
	 * 场上是否存在能对其使用card的目标
	 * @param { Card | VCard | object | string } card
	 * @param { false } [distance] false：无距离限制
	 * @param { boolean | GameEvent } [includecard] 是否受使用次数限制，可以填入用于检测的事件
	 * @returns { boolean }
	 */
	hasUseTarget(card, distance, includecard) {
		var player = this;
		return game.hasPlayer2(function (current) {
			return player.canUse(card, current, distance, includecard);
		}, true);
	}
	/**
	 * 场上是否存在收益为正的目标
	 * @param { Card | VCard | object | string } card
	 * @param { false } [distance] false：无距离限制
	 * @param { boolean | GameEvent } [includecard] 是否受使用次数限制，可以填入用于检测的事件
	 * @returns { boolean }
	 */
	hasValueTarget(card, distance, includecard) {
		if (typeof card == "string") {
			card = { name: card, isCard: true };
		}
		var player = this;
		var targets = game.filterPlayer2(null, null, true);
		var value = [];
		var min = 0;
		var info = get.info(card);
		if (!info || info.notarget) {
			return false;
		}
		var range;
		var select = get.copy(info.selectTarget);
		if (select == undefined) {
			if (info.filterTarget == undefined) {
				return true;
			}
			range = [1, 1];
		} else if (typeof select == "number") {
			range = [select, select];
		} else if (get.itemtype(select) == "select") {
			range = select;
		} else if (typeof select == "function") {
			range = select(card, player);
			if (typeof range == "number") {
				range = [range, range];
			}
		}
		if (info.singleCard) {
			range = [1, 1];
		}
		game.checkMod(card, player, range, "selectTarget", player);
		if (!range) {
			return false;
		}

		let cache = CacheContext.requireCacheContext();
		for (var i = 0; i < targets.length; i++) {
			if (player.canUse(card, targets[i], distance, includecard)) {
				var eff = cache.get.effect(targets[i], card, player, player);
				if (range[1] == 1 && eff > 0) {
					return true;
				}
				value.push(eff);
			}
		}
		value.sort(function (a, b) {
			return b - a;
		});
		for (var i = 0; i < value.length; i++) {
			if (i == range[1] || (range[1] != -1 && value[i] <= 0)) {
				break;
			}
			min += value[i];
		}
		return min > 0;
	}
	/**
	 * card使用价值
	 * @param { Card | VCard | object | string } card
	 * @param { false } [distance] false：无距离限制
	 * @param { boolean | GameEvent } [includecard] 是否受使用次数限制，可以填入用于检测的事件
	 * @returns { number } 无可选或正收益目标返回0
	 */
	getUseValue(card, distance, includecard) {
		if (typeof card == "string") {
			card = { name: card, isCard: true };
		}
		var player = this;
		var targets = game.filterPlayer2(null, null, true);
		var value = [];
		var min = 0;
		var info = get.info(card);
		if (!info || info.notarget) {
			return 0;
		}
		var range;
		var select = get.copy(info.selectTarget);
		if (select == undefined) {
			if (info.filterTarget == undefined) {
				return 1;
			}
			range = [1, 1];
		} else if (typeof select == "number") {
			range = [select, select];
		} else if (get.itemtype(select) == "select") {
			range = select;
		} else if (typeof select == "function") {
			range = select(card, player);
			if (typeof range == "number") {
				range = [range, range];
			}
		}
		if (info.singleCard) {
			range = [1, 1];
		}
		game.checkMod(card, player, range, "selectTarget", player);
		if (!range) {
			return 0;
		}

		let cache = CacheContext.requireCacheContext();
		for (var i = 0; i < targets.length; i++) {
			if (player.canUse(card, targets[i], distance, includecard)) {
				var eff = cache.get.effect(targets[i], card, player, player);
				value.push(eff);
			}
		}
		value.sort(function (a, b) {
			return b - a;
		});
		for (var i = 0; i < value.length; i++) {
			if (i == range[1] || (range[1] != -1 && value[i] <= 0)) {
				break;
			}
			min += value[i];
		}
		return min;
	}
	/**
	 * 添加随从
	 * @param { { hs?: Card[], es?: Card[], skills?: string[], hp?: number, maxHp?: number, hujia?: number, sex?: Sex, group?: string, skill?: string, source?: string  } } cfg
	 */
	addSubPlayer(cfg) {
		var skill = "subplayer_" + cfg.name + "_" + get.id();
		game.log(this, "获得了随从", "#g" + get.translation(cfg.name));
		cfg.hs = cfg.hs || [];
		cfg.es = cfg.es || [];
		cfg.skills = cfg.skills || [];
		cfg.hp = cfg.hp || 1;
		cfg.maxHp = cfg.maxHp || 1;
		cfg.hujia = cfg.hujia || 0;
		cfg.sex = cfg.sex || "male";
		cfg.group = cfg.group || "qun";
		cfg.skill = cfg.skill || _status.event.name;
		if (!cfg.source) {
			if (
				this.hasSkill(_status.event.name) &&
				this.name2 &&
				lib.character[this.name2] &&
				lib.character[this.name2][3].includes(_status.event.name)
			) {
				cfg.source = this.name2;
			} else {
				cfg.source = this.name;
			}
		}
		const list = cfg.caption ? [cfg.caption] : ["", "_prefix", "_ab"].map(str => lib.translate[cfg.name + str]);
		game.broadcastAll(
			//TODO: 这里直接修改trashBin部分，后续需要修改为新写法
			function (player, skill, list, cfg) {
				lib.skill[skill] = {
					intro: {
						content: cfg.intro || "",
					},
					mark: "character",
					subplayer: cfg.skill,
					ai: {
						subplayer: true,
					},
				};
				lib.character[skill] = [
					cfg.sex,
					cfg.group,
					parseFloat(cfg.hp) + "/" + parseFloat(cfg.maxHp) + "/" + parseFloat(cfg.hujia),
					cfg.skills,
					["tempname:" + cfg.name].concat(lib.character[cfg.name].trashBin || []),
				];
				if (Array.isArray(cfg.image)) {
					cfg.image.forEach(image => lib.character[skill][4].push(image));
				} else if (typeof cfg.image == "string") {
					lib.character[skill].trashBin.push(cfg.image);
				} else {
					lib.character[skill].trashBin.push("character:" + cfg.name);
				}
				for (let i = 0; i < list.length; i++) {
					if (!list[i]) {
						continue;
					}
					lib.translate[skill + ["", "_prefix", "_ab"][i]] = list[i];
				}
				player.storage[skill] = cfg;
			},
			this,
			skill,
			list,
			cfg
		);
		game.addVideo("addSubPlayer", this, [skill, lib.skill[skill], lib.character[skill], list, { name: cfg.name }]);
		this.addSkill(skill);
		return skill;
	}
	removeSubPlayer(name) {
		if (this.hasSkill("subplayer") && this.name == name) {
			this.exitSubPlayer(true);
		} else {
			if (this.storage[name].onremove) {
				this.storage[name].onremove(this, name);
			}
			this.removeSkill(name);
			delete this.storage[name];
			game.log(this, "牺牲了随从", "#g" + name);
			_status.event.trigger("removeSubPlayer");
		}
	}
	callSubPlayer() {
		if (this.hasSkill("subplayer")) {
			return;
		}
		var next = game.createEvent("callSubPlayer");
		next.player = this;
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == "string") {
				next.directresult = arguments[i];
			}
		}
		next.setContent("callSubPlayer");
		return next;
	}
	toggleSubPlayer() {
		if (!this.hasSkill("subplayer")) {
			return;
		}
		var next = game.createEvent("toggleSubPlayer");
		next.player = this;
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == "string") {
				next.directresult = arguments[i];
			}
		}
		next.setContent("toggleSubPlayer");
		return next;
	}
	exitSubPlayer(remove) {
		var next = game.createEvent("exitSubPlayer");
		next.player = this;
		next.remove = remove;
		next.setContent("exitSubPlayer");
		if (!this.hasSkill("subplayer")) {
			_status.event.next.remove(next);
			next.resolve();
		}
		return next;
	}
	getSubPlayers(tag) {
		var skills = this.getSkills();
		var list = [];
		for (var i = 0; i < skills.length; i++) {
			var name = skills[i];
			var info = lib.skill[name];
			if (tag && info.subplayer != tag) {
				continue;
			}
			if (info.ai && info.ai.subplayer && this.storage[name] && this.storage[name].name) {
				list.push(name);
			}
		}
		return list;
	}
	addSkillTrigger(skills, hidden, triggeronly) {
		if (typeof skills == "string") {
			skills = [skills];
		}
		game.expandSkills(skills);
		for (const skill of skills) {
			const info = lib.skill[skill];
			if (!info) {
				console.error(new ReferenceError(`Cannot find ${skill} in lib.skill, failed to add ${skill}'s trigger to ${this.name}`));
				continue;
			}
			if (!triggeronly) {
				if (info.global && (!hidden || info.globalSilent)) {
					let global = info.global;
					if (!Array.isArray(global)) {
						global = [global];
					}
					global.forEach(skill => game.addGlobalSkill(skill, this));
				}
				if (this.initedSkills.includes(skill)) {
					continue;
				}
				this.initedSkills.push(skill);
				if (info.init /* && !_status.video */) {
					info.init(this, skill);
				}
			}
			if (info.trigger && this.playerid) {
				const setTrigger = (role, evt) => {
					const name = this.playerid + "_" + role + "_" + evt;
					if (!lib.hook[name]) {
						lib.hook[name] = [];
					}
					lib.hook[name].add(skill);
					lib.hookmap[evt] = true;
				};
				const map = lib.relatedTrigger,
					names = Object.keys(map);
				for (const role in info.trigger) {
					let evts = info.trigger[role];
					if (!Array.isArray(evts)) {
						evts = [evts];
					}
					evts.forEach(evt => {
						names
							.reduce((list, i) => {
								if (evt.startsWith(i)) {
									return list.addArray(map[i].map(j => j + evt.slice(i.length)));
								}
								return list;
							}, [])
							.forEach(evtx => setTrigger(role, evtx));
						setTrigger(role, evt);
					});
				}
			}
			if (info.hookTrigger) {
				if (!this._hookTrigger) {
					this._hookTrigger = [];
				}
				this._hookTrigger.add(skill);
			}
			if (_status.event && _status.event.addTrigger) {
				_status.event.addTrigger(skill, this);
			}
			_status.event.clearStepCache();
		}
		return this;
	}
	addSkillLog(skill, popup = true) {
		if (!skill) {
			return this;
		}
		this.addSkill(skill);
		if (!Array.isArray(skill)) {
			skill = [skill];
		}
		game.log(
			this,
			"获得了技能",
			...skill.map(i => {
				if (popup) {
					this.popup(i);
				}
				return "#g【" + get.translation(i) + "】";
			})
		);
	}
	removeSkillLog(skill, popup = true) {
		if (!skill) {
			return this;
		}
		this.removeSkill(skill);
		if (!Array.isArray(skill)) {
			skill = [skill];
		}
		game.log(
			this,
			"失去了技能",
			...skill.map(i => {
				if (popup) {
					this.popup(i);
				}
				return "#g【" + get.translation(i) + "】";
			})
		);
	}
	addInvisibleSkill(skill) {
		if (Array.isArray(skill)) {
			_status.event.clearStepCache();
			for (var i = 0; i < skill.length; i++) {
				this.addInvisibleSkill(skill[i]);
			}
		} else {
			if (this.invisibleSkills.includes(skill)) {
				return;
			}
			_status.event.clearStepCache();
			var info = lib.skill[skill];
			if (!info) {
				return;
			}
			this.invisibleSkills.add(skill);
			this.addSkillTrigger(skill);
			if (this.awakenedSkills.includes(skill)) {
				this.awakenSkill(skill);
				return;
			}
		}
	}
	removeInvisibleSkill(skill) {
		if (!skill) {
			return;
		}
		if (Array.isArray(skill)) {
			for (var i = 0; i < skill.length; i++) {
				this.removeInvisibleSkill(skill[i]);
			}
		} else {
			var info = lib.skill[skill];
			if (info && info.fixed && arguments[1] !== true) {
				return skill;
			}
			game.broadcastAll(
				function (player, skill) {
					player.invisibleSkills.remove(skill);
				},
				this,
				skill
			);
			if (!this.hasSkill(skill, true)) {
				this.removeSkill(skill);
			}
		}
		return skill;
	}
	addSkills(skill, popup = true) {
		if (!skill) {
			return;
		}
		return this.changeSkills(Array.isArray(skill) ? skill : [skill], [], popup);
	}
	removeSkills(skill, popup = true) {
		if (!skill) {
			return;
		}
		return this.changeSkills([], Array.isArray(skill) ? skill : [skill], popup);
	}
	changeSkills(addSkill = [], removeSkill = [], popup = true) {
		if (!Array.isArray(addSkill) || !Array.isArray(removeSkill)) {
			console.warn(`警告：Player[${this.name}].changeSkills的参数错误，应当为数组形式。`);
			return;
		}
		const next = game.createEvent("changeSkills", false);
		next.player = this;
		next.forceDie = true;
		next.popup = popup;
		next.addSkill = addSkill.slice(0).unique();
		next.removeSkill = removeSkill.slice(0).unique();
		next.setContent("changeSkills");
		return next;
	}
	addSkill(skill, checkConflict, nobroadcast, addToSkills) {
		if (Array.isArray(skill)) {
			_status.event.clearStepCache();
			for (var i = 0; i < skill.length; i++) {
				this.addSkill(skill[i]);
			}
		} else {
			if (skill === "counttrigger" || this.skills.includes(skill)) {
				return;
			}
			_status.event.clearStepCache();
			var info = lib.skill[skill];
			if (!info) {
				return;
			}
			if (!addToSkills) {
				this.skills.add(skill);
				if (!nobroadcast) {
					game.broadcast(
						function (player, skill) {
							player.skills.add(skill);
						},
						this,
						skill
					);
				}
			}
			this.addSkillTrigger(skill);
			if (this.awakenedSkills.includes(skill)) {
				this.awakenSkill(skill);
				return;
			}
			if (info.init2 /** && !_status.video */) {
				info.init2(this, skill);
			}
			if (info.mark) {
				if (info.mark == "card" && get.itemtype(this.storage[skill]) == "card") {
					this.markSkill(skill, null, this.storage[skill], nobroadcast);
				} else if (info.mark == "card" && get.itemtype(this.storage[skill]) == "cards") {
					this.markSkill(skill, null, this.storage[skill][0], nobroadcast);
				} else if (info.mark == "image") {
					this.markSkill(skill, null, ui.create.card(null, "noclick").init([null, null, skill]), nobroadcast);
				} else if (info.mark == "character") {
					var intro = info.intro.content;
					if (typeof intro == "function") {
						intro = intro(this.storage[skill], this, skill);
					} else if (typeof intro == "string") {
						intro = intro.replace(/#/g, this.storage[skill]);
						intro = intro.replace(/&/g, get.cnNumber(this.storage[skill]));
						intro = intro.replace(/\$/g, get.translation(this.storage[skill]));
					}
					var caption;
					if (typeof info.intro.name == "function") {
						caption = info.intro.name(this.storage[skill], this, skill);
					} else if (typeof info.intro.name == "string") {
						caption = info.name;
					} else {
						caption = get.translation(skill);
					}
					this.markSkillCharacter(skill, this.storage[skill], caption, intro, nobroadcast);
				} else {
					this.markSkill(skill, null, null, nobroadcast);
				}
			}
			game.callHook("addSkillCheck", [skill, this]);
		}
		if (checkConflict) {
			this.checkConflict();
		}
		return skill;
	}
	addAdditionalSkills(skill, skillsToAdd, keep) {
		if (typeof skillsToAdd == "string") {
			skillsToAdd = [skillsToAdd];
		}
		if (!Array.isArray(skillsToAdd)) {
			console.warn(`警告：Player[${this.name}].addAdditionalSkills的参数错误，应当为技能字符串或数组:`, skillsToAdd);
		}
		const skillsToRemove = [];
		//如果不需要保留原本的additionalSkills，则判断要移除的技能，并移除这些技能
		if (!keep) {
			skillsToRemove.addArray(this.getRemovableAdditionalSkills(skill));
		}
		//创建对应的addSkills的事件
		return this.changeSkills(skillsToAdd, skillsToRemove).set("$handle", function (player, skillsToAdd, skillsToRemove) {
			//先失去先前获得的衍生技能
			if (skillsToRemove.length > 0) {
				player.removeSkillLog(skillsToRemove, get.event().popup);
			}
			//再获得新的衍生技能
			if (skillsToAdd.length > 0) {
				game.log(
					player,
					"获得了技能",
					...skillsToAdd.map(i => {
						if (get.event().popup) {
							player.popup(i);
						}
						return "#g【" + get.translation(i) + "】";
					})
				);
				if (!Array.isArray(player.additionalSkills[skill])) {
					player.additionalSkills[skill] = [];
				}
				for (var i = 0; i < skillsToAdd.length; i++) {
					player.addSkill(skillsToAdd[i], null, true, true);
					player.additionalSkills[skill].push(skillsToAdd[i]);
				}
				game.broadcast(
					(player, map) => {
						player.additionalSkills = map;
					},
					player,
					player.additionalSkills
				);
				player.checkConflict();
			}
			_status.event.clearStepCache();
		});
	}
	addAdditionalSkill(skill, skillsToAdd, keep) {
		if (typeof skillsToAdd == "string") {
			skillsToAdd = [skillsToAdd];
		}
		if (!Array.isArray(skillsToAdd)) {
			console.warn(`警告：Player[${this.name}].addAdditionalSkill的参数错误，应当为技能字符串或数组:`, skillsToAdd);
		}
		const skillsToRemove = [];
		//如果不需要保留原本的additionalSkills，则判断要移除的技能，并移除这些技能
		if (!keep) {
			skillsToRemove.addArray(this.getRemovableAdditionalSkills(skill));
		}
		this.removeSkill(skillsToRemove);
		//然后处理获得技能的操作
		if (!Array.isArray(this.additionalSkills[skill])) {
			this.additionalSkills[skill] = [];
		}
		for (var i = 0; i < skillsToAdd.length; i++) {
			this.addSkill(skillsToAdd[i], null, null, true);
			this.additionalSkills[skill].push(skillsToAdd[i]);
		}
		game.broadcast(
			(player, map) => {
				player.additionalSkills = map;
			},
			this,
			this.additionalSkills
		);
		this.checkConflict();
		_status.event.clearStepCache();
		return this;
	}
	$removeAdditionalSkills(skill, target) {
		const additionalSkills = this.additionalSkills[skill];
		if (Array.isArray(additionalSkills)) {
			if (typeof target === "string") {
				if (additionalSkills.includes(target)) {
					additionalSkills.remove(target);
					if (!additionalSkills.length) {
						delete this.additionalSkills[skill];
					}
				}
			} else {
				delete this.additionalSkills[skill];
			}
		}
		game.broadcast(
			(player, map) => {
				player.additionalSkills = map;
			},
			this,
			this.additionalSkills
		);
	}
	getRemovableAdditionalSkills(skill, target) {
		const player = this,
			removableSkills = [];
		if (this.additionalSkills[skill]) {
			const additionalSkills = this.additionalSkills[skill];
			const hasAnotherSKill = function (skillkey, skill) {
				return (
					player.skills.includes(skill) ||
					player.tempSkills[skill] ||
					Object.keys(player.additionalSkills).some(key => {
						if (key === skillkey) {
							return false;
						}
						if (Array.isArray(player.additionalSkills[key])) {
							return player.additionalSkills[key].includes(skill);
						}
						return player.additionalSkills[key] == skill;
					})
				);
			};
			if (Array.isArray(additionalSkills) && typeof target == "string") {
				if (additionalSkills.includes(target)) {
					removableSkills.push(target);
				}
			} else {
				if (Array.isArray(additionalSkills)) {
					removableSkills.addArray(additionalSkills.filter(target => !hasAnotherSKill(skill, target)));
				}
			}
		}
		return removableSkills;
	}
	removeAdditionalSkill(skill, target) {
		const player = this,
			skills = this.getRemovableAdditionalSkills(skill, target);
		if (skills.length) {
			player.removeSkill(skills);
		}
		player.$removeAdditionalSkills(skill, target);
		_status.event.clearStepCache();
		return this;
	}
	removeAdditionalSkills(skill, target) {
		const player = this,
			skills = this.getRemovableAdditionalSkills(skill, target);
		return player.changeSkills([], skills).set("$handle", function (player, addSkills, removeSkills) {
			if (removeSkills.length > 0) {
				player.removeSkillLog(removeSkills, get.event().popup);
			}
			player.$removeAdditionalSkills(skill, target);
		});
	}
	/**
	 * 中流（×）批量重置技能
	 * @param { string[] | string } [skills] 需要被重置的技能，不填默认武将牌上的所有技能
	 * @returns { string [] } 返回被重置的技能
	 */
	refreshSkill(skills) {
		const player = this;
		if (!skills) {
			skills = game.expandSkills(player.getStockSkills(true, true));
		}
		if (typeof skills == "string") {
			skills = [skills];
		}
		if (!Array.isArray(skills) || !skills?.length) {
			return [];
		}
		const resetSkills = [],
			suffixs = ["used", "round", "block", "blocker", "sunben"];
		for (const skill of skills) {
			const info = get.info(skill);
			if (info.usable !== undefined) {
				if (typeof player.getStat("triggerSkill")[skill] == "number" && player.getStat("triggerSkill")[skill] >= 1) {
					delete player.getStat("triggerSkill")[skill];
					resetSkills.add(skill);
				}
				if (typeof player.getStat("skill")[skill] == "number" && player.getStat("skill")[skill] >= 1) {
					delete player.getStat("skill")[skill];
					resetSkills.add(skill);
				}
			}
			if (info.round && player.storage[skill + "_roundcount"]) {
				delete player.storage[skill + "_roundcount"];
				player.unmarkSkill(skill + "_roundcount");
				resetSkills.add(skill);
			}
			if (player.storage[`temp_ban_${skill}`]) {
				delete player.storage[`temp_ban_${skill}`];
				resetSkills.add(skill);
			}
			if (player.awakenedSkills.includes(skill)) {
				player.restoreSkill(skill);
				resetSkills.add(skill);
			}
			for (const suffix of suffixs) {
				if (player.hasSkill(skill + "_" + suffix)) {
					player.removeSkill(skill + "_" + suffix);
					resetSkills.add(skill);
				}
			}
		}
		if (resetSkills.length) {
			let str = "";
			for (const i of resetSkills) {
				str += "【" + get.translation(i) + "】、";
			}
			game.log(player, "重置了技能", "#g" + str.slice(0, -1));
		}
		return resetSkills;
	}
	awakenSkill(skill, nounmark) {
		if (!nounmark) {
			this.unmarkSkill(skill);
		}
		this.disableSkill(skill + "_awake", skill);
		this.awakenedSkills.add(skill);
		if (this.storage[skill] === undefined || this.storage[skill] === false) {
			this.storage[skill] = true;
		}
		_status.event.clearStepCache();
		return this;
	}
	restoreSkill(skill, nomark) {
		if (this.storage[skill] === true) {
			this.storage[skill] = false;
		}
		this.awakenedSkills.remove(skill);
		this.enableSkill(skill + "_awake", skill);
		if (!nomark && this.hasSkill(skill, null, null, false)) {
			this.markSkill(skill);
		}
		_status.event.clearStepCache();
		return this;
	}
	disableSkill(skill, skills) {
		if (typeof skills == "string") {
			if (!this.disabledSkills[skills]) {
				this.disabledSkills[skills] = [];
				var info = get.info(skills);
				if (info.ondisable && info.onremove) {
					if (typeof info.onremove == "function") {
						info.onremove(this, skill);
					} else if (typeof info.onremove == "string") {
						if (info.onremove == "storage") {
							delete this.storage[skill];
						} else {
							var cards = this.storage[skill];
							if (get.itemtype(cards) == "card") {
								cards = [cards];
							}
							if (get.itemtype(cards) == "cards") {
								if (this.onremove == "discard") {
									this.$throw(cards);
								}
								if (this.onremove == "discard" || this.onremove == "lose") {
									game.cardsDiscard(cards);
									delete this.storage[skill];
								}
							}
						}
					} else if (Array.isArray(info.onremove)) {
						for (var i = 0; i < info.onremove.length; i++) {
							delete this.storage[info.onremove[i]];
						}
					} else if (info.onremove === true) {
						delete this.storage[skill];
					}
				}
			}
			this.disabledSkills[skills] ??= [];
			this.disabledSkills[skills].add(skill);
			var group = lib.skill[skills].group;
			if (typeof group == "string" || Array.isArray(group)) {
				this.disableSkill(skill, group);
			}
		} else if (Array.isArray(skills)) {
			for (var i = 0; i < skills.length; i++) {
				this.disableSkill(skill, skills[i]);
			}
		}
		_status.event.clearStepCache();
		return this;
	}
	enableSkill(skill) {
		for (var i in this.disabledSkills) {
			this.disabledSkills[i].remove(skill);
			if (this.disabledSkills[i].length == 0) {
				delete this.disabledSkills[i];
			}
		}
		_status.event.clearStepCache();
		return this;
	}
	checkMarks() {
		var skills = this.getSkills();
		game.expandSkills(skills);
		for (var i in this.marks) {
			if (!skills.includes(i) && !this.marks[i].info.fixed) {
				this.unmarkSkill(i);
			}
		}
		return this;
	}
	addEquipTrigger(card) {
		if (card) {
			/*var info = get.info(card, false);
			if (info.skills) {
				for (var j = 0; j < info.skills.length; j++) {
					this.addSkillTrigger(info.skills[j]);
				}
			}*/
			const skills = get.skillsFromEquips([card]);
			if (skills?.length) {
				skills.forEach(i => this.addSkillTrigger(i));
			}
		} else {
			var es = this.getVCards("e");
			for (var i = 0; i < es.length; i++) {
				this.addEquipTrigger(es[i]);
			}
		}
		_status.event.clearStepCache();
		return this;
	}
	removeVirtualJudge(VCard) {
		const player = this;
		game.addVideo("removeVirtualJudge", player, get.vcardInfo(VCard));
		game.broadcast(
			(VCard, player) => {
				const cards = player.vcardsMap?.judges;
				if (cards && cards.includes(VCard)) {
					cards.remove(VCard);
				}
			},
			VCard,
			player
		);
		const cards = player.vcardsMap?.judges;
		if (cards && cards.includes(VCard)) {
			cards.remove(VCard);
		}
		if (VCard.storage.equipEnable && VCard.cards?.some(card => get.type(card) == "equip")) {
			const es = player.getVCards("e"),
				equips = VCard.cards;
			if (equips.length) {
				let keepSkills = Object.values(player.additionalSkills).flat().concat(get.skillsFromEquips(es)),
					skills = get.skillsFromEquips(equips).removeArray(keepSkills);
				if (skills.length) {
					player.removeSkill(skills);
				}
			}
		}
	}
	removeVirtualEquip(VCard) {
		const player = this;
		game.addVideo("removeVirtualEquip", player, get.vcardInfo(VCard));
		game.broadcast(
			(VCard, player) => {
				const cards = player.vcardsMap?.equips;
				if (cards && cards.includes(VCard)) {
					cards.remove(VCard);
				}
			},
			VCard,
			player
		);
		const cards = player.vcardsMap?.equips;
		if (cards && cards.includes(VCard)) {
			player.removeEquipTrigger(VCard, true);
			cards.remove(VCard);
		}
		player.$handleEquipChange();
	}
	removeEquipTrigger(card, hasMove) {
		if (_status.video) {
			return;
		}
		if (card) {
			var info = get.info(card, false);
			var skills = this.getSkills(null, false);
			const VEquips = this.getVCards("e");
			VEquips.remove(card);
			skills.addArray(get.skillsFromEquips(VEquips));
			const cards = this.vcardsMap?.equips;
			if (cards && cards.includes(card) && hasMove !== true) {
				cards.remove(card);
			}
			if (info.skills) {
				for (var j = 0; j < info.skills.length; j++) {
					if (skills.includes(info.skills[j])) {
						continue;
					}
					this.removeSkillTrigger(info.skills[j]);
				}
			}
			if (info.clearLose && typeof info.onLose == "function") {
				var next = game.createEvent("lose_" + card.name);
				next.setContent(info.onLose);
				next.player = this;
				next.card = card;
			}
		} else {
			var es = this.getVCards("e");
			for (var i = 0; i < es.length; i++) {
				this.removeEquipTrigger(es[i], hasMove);
			}
		}
		_status.event.clearStepCache();
		return this;
	}
	removeSkillTrigger(skills, triggeronly) {
		if (typeof skills == "string") {
			skills = [skills];
		}
		game.expandSkills(skills);
		for (const skill of skills) {
			const info = lib.skill[skill];
			if (!info) {
				console.error(new ReferenceError(`Cannot find ${skill} in lib.skill, failed to remove ${skill}'s trigger to ${this.name}`));
				continue;
			}
			if (!triggeronly) {
				if (info.global) {
					let global = info.global;
					if (!Array.isArray(global)) {
						global = [global];
					}
					global.forEach(skill => game.removeGlobalSkill(skill, this));
				}
				if (!this.initedSkills.includes(skill)) {
					continue;
				}
				this.initedSkills.remove(skill);
				// if(info.onremove&&!_status.video) info.onremove(this,skill);
			}
			if (info.trigger && this.playerid) {
				const removeTrigger = (role, evt) => {
					const name = this.playerid + "_" + role + "_" + evt;
					if (!lib.hook[name]) {
						return;
					}
					lib.hook[name].remove(skill);
					if (lib.hook[name].length == 0) {
						delete lib.hook[name];
					}
				};
				const map = lib.relatedTrigger,
					names = Object.keys(map);
				for (const role in info.trigger) {
					let evts = info.trigger[role];
					if (!Array.isArray(evts)) {
						evts = [evts];
					}
					evts.forEach(evt => {
						names
							.reduce((list, i) => {
								if (evt.startsWith(i)) {
									return list.addArray(map[i].map(j => j + evt.slice(i.length)));
								}
								return list;
							}, [])
							.forEach(evtx => removeTrigger(role, evtx));
						removeTrigger(role, evt);
					});
				}
			}
			if (info.hookTrigger && this._hookTrigger) {
				this._hookTrigger.remove(skill);
				if (!this._hookTrigger.length) {
					delete this._hookTrigger;
				}
			}
			if (_status.event && _status.event.removeTrigger) {
				_status.event.removeTrigger(skill, this);
			}
			_status.event.clearStepCache();
		}
		return this;
	}
	removeSkill(skill) {
		if (!skill) {
			return;
		}
		_status.event.clearStepCache();
		if (Array.isArray(skill)) {
			for (var i = 0; i < skill.length; i++) {
				this.removeSkill(skill[i]);
			}
		} else {
			if (skill === "counttrigger") {
				this.stat[this.stat.length - 1].triggerSkill = {};
				return;
			} else {
				var info = lib.skill[skill];
				if (info?.fixed && arguments[1] !== true) {
					return skill;
				}
				this.unmarkSkill(skill);
				game.broadcastAll(
					function (player, skill) {
						player.skills.remove(skill);
						player.hiddenSkills.remove(skill);
						player.invisibleSkills.remove(skill);
						delete player.tempSkills[skill];
						for (var i in player.additionalSkills) {
							player.additionalSkills[i].remove(skill);
						}
					},
					this,
					skill
				);
				this.checkConflict(skill);
				if (info) {
					if (info.onremove) {
						if (typeof info.onremove == "function") {
							info.onremove(this, skill);
						} else if (typeof info.onremove == "string") {
							if (info.onremove == "storage") {
								delete this.storage[skill];
							} else {
								var cards = this.storage[skill];
								if (get.itemtype(cards) == "card") {
									cards = [cards];
								}
								if (get.itemtype(cards) == "cards") {
									if (this.onremove == "discard") {
										this.$throw(cards);
									}
									if (this.onremove == "discard" || this.onremove == "lose") {
										game.cardsDiscard(cards);
										delete this.storage[skill];
									}
								}
							}
						} else if (Array.isArray(info.onremove)) {
							for (var i = 0; i < info.onremove.length; i++) {
								delete this.storage[info.onremove[i]];
							}
						} else if (info.onremove === true) {
							delete this.storage[skill];
						}
					}
					this.removeSkillTrigger(skill);
					if (!info.keepSkill) {
						this.removeAdditionalSkills(skill);
					}
				}
				this.enableSkill(skill + "_awake");
				game.callHook("removeSkillCheck", [skill, this]);
			}
		}
		return skill;
	}
	/**
	 *
	 * @param {SAAType<string>} skillsToAdd
	 * @param {SAAType<Signal>|SkillTrigger} [expire]
	 * @returns
	 */
	addTempSkills(skillsToAdd, expire) {
		//请注意，该方法的底层实现并非tempSkill，而是additionalSkills和player.when！
		if (typeof skillsToAdd == "string") {
			skillsToAdd = [skillsToAdd];
		}
		if (!Array.isArray(skillsToAdd) || !skillsToAdd.length) {
			console.warn(`警告：Player[${this.name}].addAdditionalSkills的参数错误，应当为技能字符串或非空数组:`, skillsToAdd);
		}
		//确定技能要被移除的时机
		if (!expire) {
			expire = { global: ["phaseAfter", "phaseBeforeStart"] };
		} else if (typeof expire == "string" || Array.isArray(expire)) {
			expire = { global: expire };
		}
		return this.changeSkills(skillsToAdd, []).set("$handle", function (player, addSkills, removeSkills) {
			if (addSkills.length) {
				game.log(
					player,
					"获得了技能",
					...addSkills.map(i => {
						if (get.event().popup) {
							player.popup(i);
						}
						return "#g【" + get.translation(i) + "】";
					})
				);
				let skillName;
				//生成该TempSkills对应的ID
				do {
					skillName = "player_tempSkills_" + Math.random().toString(36).slice(-8);
				} while (player.additionalSkills[skillName] != null);
				player.addAdditionalSkill(skillName, skillsToAdd);
				player
					.when(expire, false)
					.assign({
						firstDo: true,
						priority: Infinity,
					})
					.step(async (event, trigger, player) => {
						player.removeAdditionalSkills(skillName);
					})
					.finish();
			}
		});
	}
	/**
	 * 添加临时技能
	 * @overload
	 * @param { string | string[] } skill 技能名(数组)
	 * @param { SkillTrigger |SAAType<Signal> } [expire]
	 * @param { boolean } [checkConflict]
	 */
	addTempSkill(skill, expire, checkConflict) {
		if (Array.isArray(skill)) {
			for (var i = 0; i < skill.length; i++) {
				this.addTempSkill(skill[i], expire, checkConflict);
			}
		} else {
			if (this.hasSkill(skill) && this.tempSkills[skill] == undefined) {
				return;
			}
			this.addSkill(skill, checkConflict, false, true);

			if (!expire) {
				expire = { global: ["phaseAfter", "phaseBeforeStart"] };
			} else if (typeof expire == "string" || Array.isArray(expire)) {
				expire = { global: expire };
			}
			this.tempSkills[skill] = expire;
			const map = lib.relatedTrigger,
				names = Object.keys(map);
			if (get.objtype(expire) == "object") {
				const roles = ["player", "source", "target", "global"];
				for (const i of roles) {
					let triggers = expire[i];
					if (!Array.isArray(triggers)) {
						triggers = [triggers];
					}
					triggers.forEach(trigger => {
						lib.hookmap[trigger] = true;
						const key = names.find(name => trigger?.startsWith(name));
						if (key) {
							map[key].forEach(rawTrigger => {
								lib.hookmap[`${rawTrigger}${trigger.slice(key.length)}`] = true;
							});
						}
					});
				}
			}
			game.broadcast(
				(player, map) => {
					player.tempSkills = map;
				},
				this,
				this.tempSkills
			);
		}
		return skill;
	}
	tempBanSkill(skill, expire, log) {
		if (Array.isArray(skill)) {
			for (var i = 0; i < skill.length; i++) {
				this.tempBanSkill(skill[i], expire, log);
			}
		} else {
			if (this.isTempBanned(skill)) {
				return;
			}
			this.setStorage(`temp_ban_${skill}`, true);

			if (log !== false && this.hasSkill(skill)) {
				game.log(this, "的技能", `#g【${get.translation(skill)}】`, "暂时失效了");
			}

			if (expire !== "forever") {
				if (!expire) {
					expire = { global: ["phaseAfter", "phaseBeforeStart"] };
				} else if (typeof expire == "string" || Array.isArray(expire)) {
					expire = { global: expire };
				}
				this.when(expire, false)
					.assign({
						firstDo: true,
					})
					.step(async (event, trigger, player) => {
						delete player.storage[`temp_ban_${skill}`];
					})
					.finish();
			}
		}
		return skill;
	}
	/**
	 * 返回技能是否暂时失效
	 * @param { string } skill 技能名
	 * @returns { boolean }
	 */
	isTempBanned(skill) {
		return this.hasStorage(`temp_ban_${skill}`);
	}
	attitudeTo(target) {
		if (typeof get.attitude == "function") {
			return get.attitude(this, target);
		}
		return 0;
	}
	clearSkills(all) {
		var list = [];
		var exclude = [];
		for (var i = 0; i < arguments.length; i++) {
			exclude.push(arguments[i]);
		}
		for (i = 0; i < this.skills.length; i++) {
			if (lib.skill[this.skills[i]].superCharlotte) {
				continue;
			}
			if (!all && (lib.skill[this.skills[i]].temp || lib.skill[this.skills[i]].charlotte)) {
				continue;
			}
			if (!exclude.includes(this.skills[i])) {
				list.push(this.skills[i]);
			}
		}
		if (all) {
			for (var i in this.additionalSkills) {
				this.removeAdditionalSkill(i);
			}
		}
		this[all ? "removeSkill" : "removeSkills"](list);
		this.checkConflict();
		this.checkMarks();
		return list;
	}
	checkConflict(skill) {
		if (skill) {
			if (this.forbiddenSkills[skill]) {
				delete this.forbiddenSkills[skill];
			} else {
				for (var i in this.forbiddenSkills) {
					if (this.forbiddenSkills[i].includes(skill)) {
						this.forbiddenSkills[i].remove(skill);
						if (!this.forbiddenSkills[i].length) {
							delete this.forbiddenSkills[i];
						}
					}
				}
			}
		} else {
			this.forbiddenSkills = {};
			var forbid = [];
			var getName = function (arr) {
				var str = "";
				for (var i = 0; i < arr.length; i++) {
					str += arr[i] + "+";
				}
				return str.slice(0, str.length - 1);
			};
			var forbidlist = lib.config.forbid.concat(lib.config.customforbid);
			var skills = this.getSkills();
			for (var i = 0; i < forbidlist.length; i++) {
				if (lib.config.customforbid.includes(forbidlist[i]) || !lib.config.forbidlist.includes(getName(forbidlist[i]))) {
					for (var j = 0; j < forbidlist[i].length; j++) {
						if (!skills.includes(forbidlist[i][j])) {
							break;
						}
					}
					if (j == forbidlist[i].length) {
						forbid.push(forbidlist[i]);
					}
				}
			}
			for (var i = 0; i < forbid.length; i++) {
				if (forbid[i][1] || this.name2) {
					this.forbiddenSkills[forbid[i][0]] = this.forbiddenSkills[forbid[i][0]] || [];
					if (forbid[i][1]) {
						this.forbiddenSkills[forbid[i][0]].add(forbid[i][1]);
					}
				}
			}
		}
	}
	/**
	 * 快速获取一名角色当前轮次/倒数第X轮次的历史
	 *	@template {Exclude< keyof ActionHistory, 'isRound'|'isMe'>} T
	 * @param {T} key
	 * @param {(event:GameEvent)=>boolean} filter 筛选条件，不填写默认为lib.filter.all
	 * @param {number} [num] 获取倒数第num轮的历史，默认为0，表示当前轮
	 * @param {boolean} [keep] 若为true,则获取倒数第num轮到现在的所有历史
	 * @param {GameEvent} last 代表最后一个事件，获取该事件之前的历史
	 */
	getRoundHistory(key, filter = lib.filter.all, num, keep, last) {
		if (!num) {
			num = 0;
		}
		if (!filter || typeof filter != "function") {
			filter = lib.filter.all;
		}
		const player = this;
		let evts = [],
			history = player.actionHistory;
		for (let i = history.length - 1; i >= 0; i--) {
			if (keep === true || num == 0) {
				let currentHistory = history[i];
				if (key) {
					currentHistory = currentHistory[key];
				}
				if (filter) {
					currentHistory = currentHistory.filter(filter);
				}
				evts.addArray(currentHistory.slice().reverse());
			}
			if (history[i].isRound) {
				if (num > 0) {
					num--;
				} else {
					break;
				}
			}
		}
		evts.reverse();
		if (last && evts.includes(last)) {
			const lastIndex = evts.indexOf(last);
			return evts.filter(evt => evts.indexOf(evt) <= lastIndex);
		}
		return evts;
	}
	/**
	 * 不填参数，直接获得最后一个回合的该玩家的整个历史对象。
	 * @overload
	 * @returns { ActionHistory }
	 */
	/**
	 *
	 * @overload
	 * @param { 'isRound'|'isMe' } key
	 * @returns { boolean}
	 */
	/**
	 * @template { Exclude<keyof ActionHistory,'isRound'|'isMe'> } T
	 * @overload
	 * @param { T } key
	 * @param { (event: GameEvent) => boolean } [filter] 过滤条件
	 * @param { GameEvent } [last] 若有该参数，则该参数事件之后的将被排除掉
	 * @returns { ActionHistory[T] }
	 */
	getHistory(key, filter, last) {
		if (!key) {
			return this.actionHistory[this.actionHistory.length - 1];
		}
		if (!filter) {
			return this.actionHistory[this.actionHistory.length - 1][key];
		} else {
			const history = this.getHistory(key);
			if (last) {
				const lastIndex = history.indexOf(last);
				return history.filter((event, index) => {
					if (index > lastIndex) {
						return false;
					}
					return filter(event);
				});
			}
			return history.filter(filter);
		}
	}
	/**
	 * 遍历历史
	 * @template { Exclude<keyof ActionHistory,'isRound'|'isMe'> } T
	 * @param { T } key
	 * @param { (event: GameEvent) => void } filter 遍历过程需要执行的函数
	 * @param { GameEvent } [last]
	 */
	checkHistory(key, filter, last) {
		if (!key || !filter) {
			return;
		} else {
			const history = this.getHistory(key);
			if (last) {
				const lastIndex = history.indexOf(last);
				history.forEach((event, index) => {
					if (index > lastIndex) {
						return false;
					}
					filter(event);
				});
			} else {
				history.forEach(filter);
			}
		}
	}
	/**
	 * @template { Exclude<keyof ActionHistory,'isRound'|'isMe'> } T
	 * @param { T } key
	 * @param { (event: GameEvent) => boolean } [filter]
	 * @param { GameEvent } [last]
	 * @returns { boolean }
	 */
	hasHistory(key, filter = lib.filter.all, last) {
		const history = this.getHistory(key);
		if (!filter || typeof filter != "function") {
			filter = lib.filter.all;
		}
		if (last) {
			const lastIndex = history.indexOf(last);
			return history.some((event, index) => {
				if (index > lastIndex) {
					return false;
				}
				return filter(event);
			});
		}
		return history.some(filter);
	}
	/**
	 * 不填参数，直接获得最后一个回合的该玩家的整个历史对象。
	 * @overload
	 * @returns { ActionHistory }
	 */
	/**
	 * @template { Exclude<keyof ActionHistory,'isRound'|'isMe'> } T
	 * @overload
	 * @param { T } key
	 * @param { (event: GameEvent) => boolean } [filter] 过滤条件
	 * @param { GameEvent } [last] 若有该参数，则该参数事件之后的将被排除掉
	 * @returns { ActionHistory[T] }
	 */
	getLastHistory(key, filter, last) {
		let history = false;
		for (let i = this.actionHistory.length - 1; i >= 0; i--) {
			if (this.actionHistory[i].isMe) {
				history = this.actionHistory[i];
				break;
			}
		}
		if (!history) {
			return null;
		}
		if (!key) {
			return history;
		}
		if (!filter) {
			return history[key];
		} else {
			if (last) {
				const lastIndex = history.indexOf(last);
				return history.filter((event, index) => {
					if (index > lastIndex) {
						return false;
					}
					return filter(event);
				});
			}
			return history.filter(filter);
		}
	}
	/**
	 * 遍历整局游戏该玩家的历史
	 * @template { Exclude<keyof ActionHistory,'isRound'|'isMe'> } T
	 * @param { T } key
	 * @param { (event: GameEvent) => void } filter
	 * @param { GameEvent } [last]
	 */
	checkAllHistory(key, filter, last) {
		if (!key || !filter) {
			return;
		}
		this.actionHistory.forEach(value => {
			let history = value[key];
			if (last && history.includes(last)) {
				const lastIndex = history.indexOf(last);
				history.forEach((event, index) => {
					if (index > lastIndex) {
						return false;
					}
					return filter(event);
				});
			} else {
				history.forEach(filter);
			}
		});
	}
	/**
	 * 获得整局游戏该玩家的行动历史
	 * @overload
	 * @returns { ActionHistory[] }
	 */
	/**
	 * 获得整局游戏该玩家的某个指定行为的历史
	 * @template { Exclude<keyof ActionHistory,'isRound'|'isMe'> } T
	 * @overload
	 * @param { T } key
	 * @param { (event: GameEvent) => boolean } [filter]
	 * @param { GameEvent } [last]
	 * @returns { ActionHistory[T] }
	 */
	getAllHistory(key, filter, last) {
		const history = [];
		this.actionHistory.forEach(value => {
			if (!key || !value[key]) {
				history.push(value);
			} else {
				history.push(...value[key]);
			}
		});
		if (filter) {
			if (last) {
				const lastIndex = history.indexOf(last);
				return history.filter((event, index) => {
					if (index > lastIndex) {
						return false;
					}
					return filter(event);
				});
			}
			return history.filter(filter);
		}
		return history;
	}
	/**
	 * @template { Exclude<keyof ActionHistory,'isRound'|'isMe'> } T
	 * @param { T } key
	 * @param { (event: GameEvent) => boolean } filter
	 * @param { GameEvent } [last]
	 * @returns { boolean }
	 */
	hasAllHistory(key, filter, last) {
		return this.actionHistory.some(value => {
			let history = value[key];
			if (last && history.includes(last)) {
				const lastIndex = history.indexOf(last);
				if (
					history.some(function (event, index) {
						if (index > lastIndex) {
							return false;
						}
						return filter(event);
					})
				) {
					return true;
				}
			} else {
				if (history.some(filter)) {
					return true;
				}
			}
			return false;
		});
	}
	getLastUsed(num) {
		if (typeof num != "number") {
			num = 0;
		}
		var history = this.getHistory("useCard");
		if (history.length <= num) {
			return null;
		}
		return history[history.length - num - 1];
	}
	/**
	 * @overload
	 * @returns {Stat}
	 */
	/**
	 * @template {keyof Stat} T
	 * @overload
	 * @param {T} key
	 * @returns {Stat[T]}
	 */
	getStat(key) {
		if (!key) {
			return this.stat[this.stat.length - 1];
		}
		return this.stat[this.stat.length - 1][key];
	}
	/**
	 * 用法同getStat，区别是获得自己的回合的统计
	 * @overload
	 * @returns {Stat}
	 */
	/**
	 * @template {keyof Stat} T
	 * @overload
	 * @param {T} key
	 * @returns {Stat[T]}
	 */
	getLastStat(key) {
		var stat = false;
		for (var i = this.stat.length - 1; i >= 0; i--) {
			if (this.stat[i].isMe) {
				stat = this.stat[i];
				break;
			}
		}
		if (!stat) {
			return null;
		}
		if (!key) {
			return stat;
		}
		return stat[key];
	}
	queue(time) {
		if (time == false) {
			clearTimeout(this.queueTimeout);
			this.queueCount = 0;
			return;
		}
		if (time == undefined) {
			time = 500;
		}
		var player = this;
		player.queueCount++;
		this.queueTimeout = setTimeout(function () {
			player.queueCount--;
			if (player.queueCount == 0) {
				player.style.transform = "";
				player.node.avatar.style.transform = "";
				player.node.avatar2.style.transform = "";
				if (game.chess) {
					ui.placeChess(player, player.dataset.position);
				}
				if (player == game.me) {
					ui.me.removeAttribute("style");
				}
			}
		}, time);
	}
	getCardUsable(card, pure) {
		var player = this;
		if (typeof card == "string") {
			card = { name: card };
		}
		card = get.autoViewAs(card);
		var num = get.info(card).usable;
		if (typeof num == "function") {
			num = num(card, player);
		}
		num = game.checkMod(card, player, num, "cardUsable", player);
		if (typeof num != "number") {
			return Infinity;
		}
		if (!pure && _status.currentPhase == player) {
			return num - player.countUsed(card);
		}
		return num;
	}
	/**
	 * 返回玩家的攻击距离
	 * @param { boolean } raw
	 * @returns { number }
	 */
	getAttackRange(raw) {
		const player = this;
		let range = 0;
		if (raw) {
			range = game.checkMod(player, player, range, "globalFrom", player);
			range = game.checkMod(player, player, range, "attackFrom", player);
			const equips = player.getVCards("e", function (card) {
				return !card.cards?.some(card => {
					return ui.selected.cards?.includes(card);
				});
			});
			equips.forEach(card => {
				const info = get.info(card, false).distance;
				if (info && info.globalFrom) {
					range += info.globalFrom;
				}
			});
			return player.getEquipRange() - range;
		}
		let base = game.checkMod(player, "unchanged", "attackRangeBase", player);
		if (base != "unchanged") {
			range = base;
		} else {
			range = player.getEquipRange();
		}
		range = game.checkMod(player, range, "attackRange", player);
		return range;
	}
	/**
	 * 返回一些牌的攻击距离
	 * @param { Card[] } cards
	 * @returns { number }
	 */
	getEquipRange(cards) {
		const player = this;
		if (!cards) {
			cards = player.getVCards("e", function (card) {
				return !card.cards?.some(card => {
					return ui.selected.cards?.includes(card);
				});
			});
		}
		const range = cards.reduce((range, card) => {
			let newRange = false;
			const info = get.info(card, false);
			if (info.distance) {
				//如果存在attackRange 则通过attackRange动态获取攻击范围
				if (typeof info.distance.attackRange == "function") {
					newRange = info.distance.attackRange(card, player);
				}
				//否则采用祖宗之法
				else if (typeof info.distance.attackFrom == "number") {
					newRange = 1 - info.distance.attackFrom;
				}
			}
			let isN1 = typeof range == "number";
			let isN2 = typeof newRange == "number";
			if (isN1 && isN2) {
				return Math.max(range, newRange);
			} else {
				return isN1 ? range : newRange;
			}
		}, false);
		return typeof range == "number" ? range : 1;
	}
	getGlobalFrom() {
		var player = this;
		var range = 0;
		range = game.checkMod(player, player, range, "globalFrom", player);
		var equips = player.getVCards("e", function (card) {
			return !card.cards?.some(card => {
				return ui.selected.cards?.includes(card);
			});
		});
		for (var i = 0; i < equips.length; i++) {
			var info = get.info(equips[i]).distance;
			if (!info) {
				continue;
			}
			if (info.globalFrom) {
				range += info.globalFrom;
			}
		}
		return -range;
	}
	getGlobalTo() {
		var player = this;
		var range = 0;
		range = game.checkMod(player, player, range, "globalTo", player);
		var equips = player.getVCards("e", function (card) {
			return !card.cards?.some(card => {
				return ui.selected.cards?.includes(card);
			});
		});
		for (var i = 0; i < equips.length; i++) {
			var info = get.info(equips[i]).distance;
			if (!info) {
				continue;
			}
			if (info.globalTo) {
				range += info.globalTo;
			}
		}
		return range;
	}
	/**
	 * 返回玩家的手牌上限
	 * @returns { number }
	 */
	getHandcardLimit() {
		var num = Math.max(this.hp, 0);
		num = game.checkMod(this, num, "maxHandcardBase", this);
		num = game.checkMod(this, num, "maxHandcard", this);
		num = game.checkMod(this, num, "maxHandcardFinal", this);
		return Math.max(0, num);
	}
	getEnemies(func, includeDie) {
		var player = this;
		var targets;
		var mode = get.mode();
		let method = includeDie ? "filterPlayer2" : "filterPlayer";
		if (mode == "identity") {
			if (_status.mode == "purple") {
				switch (player.identity) {
					case "bZhu":
					case "bZhong":
					case "rNei":
						targets = game[method](function (target) {
							if (func && !func(target)) {
								return false;
							}
							return ["rZhu", "rZhong", "bNei"].includes(target.identity);
						});
						break;
					case "rZhu":
					case "rZhong":
					case "bNei":
						targets = game[method](function (target) {
							if (func && !func(target)) {
								return false;
							}
							return ["bZhu", "bZhong", "rNei"].includes(target.identity);
						});
						break;
					case "rYe":
					case "bYe":
						targets = game[method](function (target) {
							if (func && !func(target)) {
								return false;
							}
							return !["rYe", "bYe"].includes(target.identity);
						});
						break;
				}
			} else {
				var num = get.population("fan");
				switch (player.identity) {
					case "zhu":
					case "zhong":
					case "mingzhong":
						targets = game[method](function (target) {
							if (func && !func(target)) {
								return false;
							}
							if (num >= 3) {
								return target.identity == "fan";
							}
							return target.identity == "nei" || target.identity == "fan";
						});
						break;
					case "nei":
						targets = game[method](function (target) {
							if (func && !func(target)) {
								return false;
							}
							if (num >= 3) {
								return target.identity == "fan";
							}
							if (game.players.length == 2) {
								return target != player;
							}
							return target.identity == "zhong" || target.identity == "mingzhong" || target.identity == "fan";
						});
						break;
					case "fan":
						targets = game[method](function (target) {
							if (func && !func(target)) {
								return false;
							}
							return target.identity != "fan";
						});
						break;
					case "commoner":
						targets = game[method](function (target) {
							if (func && !func(target)) {
								return false;
							}
							if (num >= 3) {
								return target.identity != "fan";
							}
							return target.identity == "fan";
						});
						break;
				}
			}
		} else if (mode == "guozhan") {
			if (player.identity == "ye") {
				targets = game[method](function (target) {
					if (func && !func(target)) {
						return false;
					}
					return true;
				});
			} else {
				var group = lib.character[player.name1][1];
				targets = game[method](function (target) {
					if (func && !func(target)) {
						return false;
					}
					return target.identity == "ye" || lib.character[target.name1][1] != group;
				});
			}
		} else if (mode == "doudizhu") {
			targets = game[method](function (target) {
				if (func && !func(target)) {
					return false;
				}
				return target.identity != player.identity;
			});
		} else {
			targets = game[method](function (target) {
				if (func && !func(target)) {
					return false;
				}
				return target.side != player.side;
			});
		}
		targets.remove(player);
		return targets;
	}
	getFriends(func, includeDie) {
		var player = this;
		var targets = [];
		var mode = get.mode();
		var self = false;
		if (func === true) {
			func = null;
			self = true;
		}
		let method = includeDie ? "filterPlayer2" : "filterPlayer";
		if (mode == "identity") {
			if (_status.mode == "purple") {
				switch (player.identity) {
					case "rZhu":
					case "rZhong":
					case "bNei":
						targets = game[method](function (target) {
							if (func && !func(target)) {
								return false;
							}
							return ["rZhu", "rZhong", "bNei"].includes(target.identity);
						});
						break;
					case "bZhu":
					case "bZhong":
					case "rNei":
						targets = game[method](function (target) {
							if (func && !func(target)) {
								return false;
							}
							return ["bZhu", "bZhong", "rNei"].includes(target.identity);
						});
						break;
					case "rYe":
					case "bYe":
						targets = game[method](function (target) {
							if (func && !func(target)) {
								return false;
							}
							return ["rYe", "bYe"].includes(target.identity);
						});
						break;
				}
			} else {
				switch (player.identity) {
					case "zhu":
					case "zhong":
					case "mingzhong":
						targets = game[method](function (target) {
							if (func && !func(target)) {
								return false;
							}
							return ["zhu", "zhong", "mingzhong"].includes(target.identity);
						});
						break;
					case "nei":
						targets = [];
						break;
					case "fan":
						targets = game[method](function (target) {
							if (func && !func(target)) {
								return false;
							}
							return target.identity == "fan";
						});
						break;
					case "commoner":
						targets = game[method](function (target) {
							if (func && !func(target)) {
								return false;
							}
							return true;
						});
						break;
				}
			}
		} else if (mode == "guozhan") {
			if (player.identity == "ye") {
				targets = [];
			} else {
				var group = lib.character[player.name1][1];
				targets = game[method](function (target) {
					if (func && !func(target)) {
						return false;
					}
					return target.identity != "ye" && lib.character[target.name1][1] == group;
				});
			}
		} else if (mode == "doudizhu") {
			targets = game[method](function (target) {
				if (func && !func(target)) {
					return false;
				}
				return target.identity == player.identity;
			});
		} else {
			targets = game[method](function (target) {
				if (func && !func(target)) {
					return false;
				}
				return target.side == player.side;
			});
		}
		if (self) {
			targets.add(player);
		} else {
			targets.remove(player);
		}
		return targets;
	}
	isEnemyOf() {
		return !this.isFriendOf.call(this, ...arguments);
	}
	isFriendOf(player) {
		if (get.mode() == "guozhan") {
			if (this == player) {
				return true;
			}
			if (this.getStorage("yexinjia_friend").includes(player) || player.getStorage("yexinjia_friend").includes(this)) {
				return true;
			}
			if (this.identity == "unknown" || this.identity == "ye") {
				return false;
			}
			if (player.identity == "unknown" || player.identity == "ye") {
				return false;
			}
			return this.identity == player.identity;
		}
		if (get.mode() == "doudizhu") {
			return this.identity == player.identity;
		}
		if (this.side != undefined && typeof player.side == "boolean") {
			return this.side == player.side;
		}
		return this == player;
	}
	isFriendsOf(player, includeDie) {
		return player.getFriends(true, includeDie).includes(this);
	}
	isEnemiesOf(player, includeDie) {
		return player.getEnemies(null, includeDie).includes(this);
	}
	isAlive() {
		return this.classList.contains("dead") == false;
	}
	isDead() {
		return this.classList.contains("dead");
	}
	/**
	 * 判断角色是否处于休整状态
	 * @returns { boolean }
	 */
	isRest() {
		return this.isAlive() && this.isOut() && _status._rest_return[this.playerid];
	}
	isDying() {
		return _status.dying.includes(this) && this.hp <= 0 && this.isAlive();
	}
	isDamaged() {
		return this.hp < this.maxHp && !this.storage.nohp;
	}
	isHealthy() {
		return this.hp >= this.maxHp || this.storage.nohp;
	}
	/**
	 * 判断玩家是否是场上/某些角色中体力上限最大的玩家
	 * @param { boolean } [only] 是否唯一
	 * @param { (player: Player) => boolean } [filter] 过滤要判断的角色
	 * @returns { boolean }
	 */
	isMaxMaxHp(only, filter) {
		if (typeof filter !== "function") {
			filter = lib.filter.all;
		}
		return game.filterPlayer(filter).every(value => {
			if (value.isOut() || value == this) {
				return true;
			}
			return only ? value.maxHp < this.maxHp : value.maxHp <= this.maxHp;
		});
	}
	/**
	 * 判断玩家是否是场上/某些角色中体力上限最少的玩家
	 * @param { boolean } [only] 是否唯一
	 * @param { (player: Player) => boolean } [filter] 过滤要判断的角色
	 * @returns { boolean }
	 */
	isMinMaxHp(only, filter) {
		if (typeof filter !== "function") {
			filter = lib.filter.all;
		}
		return game.filterPlayer(filter).every(value => {
			if (value.isOut() || value == this) {
				return true;
			}
			return only ? value.maxHp > this.maxHp : value.maxHp >= this.maxHp;
		});
	}
	/**
	 * 判断玩家是否是场上/某些角色中体力最大的玩家
	 * @param { boolean } [only] 是否唯一
	 * @param { boolean } [raw]
	 * @param { (player: Player) => boolean } [filter] 过滤要判断的角色
	 * @returns { boolean }
	 */
	isMaxHp(only, raw, filter) {
		if (typeof filter !== "function") {
			filter = lib.filter.all;
		}
		return game.filterPlayer(filter).every(value => {
			if (value.isOut() || value == this) {
				return true;
			}
			return only ? value.getHp(raw) < this.getHp(raw) : value.getHp(raw) <= this.getHp(raw);
		});
	}
	/**
	 * 判断玩家是否是场上/某些角色中体力最少的玩家
	 * @param { boolean } [only] 是否唯一
	 * @param { boolean } [raw]
	 * @param { (player: Player) => boolean } [filter] 过滤要判断的角色
	 * @returns { boolean }
	 */
	isMinHp(only, raw, filter) {
		if (typeof filter !== "function") {
			filter = lib.filter.all;
		}
		return game.filterPlayer(filter).every(value => {
			if (value.isOut() || value == this) {
				return true;
			}
			return only ? value.getHp(raw) > this.getHp(raw) : value.getHp(raw) >= this.getHp(raw);
		});
	}
	/**
	 * 判断玩家是否是场上/某些角色中牌最多的玩家
	 * @param { boolean } [only] 是否唯一
	 * @param { (player: Player) => boolean } [filter] 过滤要判断的角色
	 * @returns { boolean }
	 */
	isMaxCard(only, filter) {
		if (typeof filter !== "function") {
			filter = lib.filter.all;
		}
		const numberOfCards = this.countCards("he");
		return game.filterPlayer(filter).every(value => {
			if (value.isOut() || value == this) {
				return true;
			}
			return only ? value.countCards("he") < numberOfCards : value.countCards("he") <= numberOfCards;
		});
	}
	/**
	 * 判断玩家是否是场上/某些角色中牌最少的玩家
	 * @param { boolean } [only] 是否唯一
	 * @param { (player: Player) => boolean } [filter] 过滤要判断的角色
	 * @returns { boolean }
	 */
	isMinCard(only, filter) {
		if (typeof filter !== "function") {
			filter = lib.filter.all;
		}
		const numberOfCards = this.countCards("he");
		return game.filterPlayer(filter).every(value => {
			if (value.isOut() || value == this) {
				return true;
			}
			return only ? value.countCards("he") > numberOfCards : value.countCards("he") >= numberOfCards;
		});
	}
	/**
	 * 判断玩家是否是场上/某些角色中手牌最多的玩家
	 * @param { boolean } [only] 是否唯一
	 * @param { (player: Player) => boolean } [filter] 过滤要判断的角色
	 * @returns { boolean }
	 */
	isMaxHandcard(only, filter) {
		if (typeof filter !== "function") {
			filter = lib.filter.all;
		}
		const numberOfHandCards = this.countCards("h");
		return game.filterPlayer(filter).every(value => {
			if (value.isOut() || value == this) {
				return true;
			}
			return only ? value.countCards("h") < numberOfHandCards : value.countCards("h") <= numberOfHandCards;
		});
	}
	/**
	 * 判断玩家是否是场上/某些角色中手牌最少的玩家
	 * @param { boolean } [only] 是否唯一
	 * @param { (player: Player) => boolean } [filter] 过滤要判断的角色
	 * @returns { boolean }
	 */
	isMinHandcard(only, filter) {
		if (typeof filter !== "function") {
			filter = lib.filter.all;
		}
		const numberOfHandCards = this.countCards("h");
		return game.filterPlayer(filter).every(value => {
			if (value.isOut() || value == this) {
				return true;
			}
			return only ? value.countCards("h") > numberOfHandCards : value.countCards("h") >= numberOfHandCards;
		});
	}
	/**
	 * 判断玩家是否是场上/某些角色中装备区牌最多的玩家
	 * @param { boolean } [only] 是否唯一
	 * @param { (player: Player) => boolean } [filter] 过滤要判断的角色
	 * @returns { boolean }
	 */
	isMaxEquip(only, filter) {
		if (typeof filter !== "function") {
			filter = lib.filter.all;
		}
		const numberOfEquipAreaCards = this.countCards("e");
		return game.filterPlayer(filter).every(value => {
			if (value.isOut() || value == this) {
				return true;
			}
			return only ? value.countCards("e") < numberOfEquipAreaCards : value.countCards("e") <= numberOfEquipAreaCards;
		});
	}
	/**
	 * 判断玩家是否是场上/某些角色中装备区牌最少的玩家
	 * @param { boolean } [only] 是否唯一
	 * @param { (player: Player) => boolean } [filter] 过滤要判断的角色
	 * @returns { boolean }
	 */
	isMinEquip(only, filter) {
		if (typeof filter !== "function") {
			filter = lib.filter.all;
		}
		const numberOfEquipAreaCards = this.countCards("e");
		return game.filterPlayer(filter).every(value => {
			if (value.isOut() || value == this) {
				return true;
			}
			return only ? value.countCards("e") > numberOfEquipAreaCards : value.countCards("e") >= numberOfEquipAreaCards;
		});
	}
	/**
	 * 返回玩家是否是横置状态
	 * @returns { boolean }
	 */
	isLinked() {
		if (get.is.linked2(this)) {
			return this.classList.contains("linked2");
		}
		return this.classList.contains("linked");
	}
	/**
	 * 返回玩家是否是翻面状态
	 * @returns { boolean }
	 */
	isTurnedOver() {
		return this.classList.contains("turnedover");
	}
	/**
	 * 返回玩家是否是被移出游戏
	 * @returns { boolean }
	 */
	isOut() {
		return this.classList.contains("out");
	}
	isMin(distance) {
		if (distance && lib.config.mode != "stone") {
			return false;
		}
		if (this.forcemin) {
			return true;
		}
		return this.classList.contains("minskin") && !game.chess;
	}
	isIn() {
		return this.classList.contains("dead") == false && this.classList.contains("out") == false && !this.removed;
	}
	isUnseen(num) {
		switch (num) {
			case 0:
				return this.classList.contains("unseen");
			case 1:
				return this.classList.contains("unseen2");
			case 2:
				return this.classList.contains("unseen") || this.classList.contains("unseen2");
			default:
				return this.classList.contains("unseen") && (!this.name2 || this.classList.contains("unseen2"));
		}
	}
	isUnderControl(self, me) {
		me = me || game.me;
		var that = this._trueMe || this;
		if (that.isMad() || game.notMe) {
			return false;
		}
		if (this === me) {
			if (self) {
				return true;
			}
			return false;
		}
		if (that === me || this == me?._trueMe) {
			return true;
		}
		if (_status.connectMode) {
			return false;
		}
		if (lib.config.mode == "versus") {
			if (_status.mode == "three") {
				return this.side == me.side;
			}
			if (_status.mode == "standard") {
				return lib.storage.single_control && this.side == me.side;
			}
			if (_status.mode == "four") {
				return get.config("four_phaseswap") && this.side == me.side;
			}
			if (_status.mode == "two") {
				return get.config("two_phaseswap") && this.side == me.side;
			}
			return false;
		} else if (lib.config.mode == "boss") {
			if (me.side) {
				return false;
			}
			return this.side == me.side && get.config("single_control");
		} else if (game.chess) {
			if (lib.config.mode == "chess") {
				if (_status.mode == "combat" && !get.config("single_control")) {
					return false;
				}
			}
			return this.side == me.side;
		}
		return false;
	}
	isMine() {
		return this == game.me && !_status.auto && !this.isMad() && !game.notMe;
	}
	isOnline() {
		if (this.ws && lib.node && !this.ws.closed && this.ws.inited && !this.isAuto) {
			return true;
		}
		return false;
	}
	isOnline2() {
		if (this.ws && lib.node && !this.ws.closed) {
			return true;
		}
		return false;
	}
	isOffline() {
		if (this.ws && lib.node && this.ws.closed) {
			return true;
		}
		return false;
	}
	isMajor() {
		if (get.mode() == "guozhan") {
			if (this.identity == "unknown") {
				return false;
			}
			var list = game.filterPlayer(function (current) {
				return current.identity != "unknown" && current.hasSkillTag("forceMajor");
			});
			if (list.length) {
				for (var i of list) {
					if (i.isFriendOf(this)) {
						return true;
					}
				}
				return false;
			}
			var map = {},
				sides = [],
				pmap = _status.connectMode ? lib.playerOL : game.playerMap,
				player;
			for (var i of game.players) {
				if (i.identity == "unknown") {
					continue;
				}
				var added = false;
				for (var j of sides) {
					if (i.isFriendOf(pmap[j])) {
						added = true;
						map[j].push(i);
						if (i == this) {
							player = j;
						}
						break;
					}
				}
				if (!added) {
					map[i.playerid] = [i];
					sides.push(i.playerid);
					if (i == this) {
						player = i.playerid;
					}
				}
			}
			if (!player || map[player].length < 2) {
				return false;
			}
			for (var i in map) {
				if (map[i].length > map[player].length) {
					return false;
				}
			}
			return true;
		} else {
			var list = game.filterPlayer(function (current) {
				return current.hasSkillTag("forceMajor");
			});
			if (list.length) {
				for (var i of list) {
					if (i.group == this.group) {
						return true;
					}
				}
				return false;
			}
			var map = {};
			for (var i of game.players) {
				if (!map[i.group]) {
					map[i.group] = [];
				}
				map[i.group].push(i);
			}
			for (var i in map) {
				if (map[i].length > map[this.group].length) {
					return false;
				}
			}
			return true;
		}
	}
	isNotMajor() {
		for (var i = 0; i < game.players.length; i++) {
			if (game.players[i].isMajor()) {
				return !this.isMajor();
			}
		}
		return false;
	}
	isMinor(nomajor) {
		if (get.mode() == "guozhan") {
			if (this.identity == "unknown" || (!nomajor && this.isMajor())) {
				return false;
			}
			if (
				!nomajor &&
				!game.hasPlayer(function (current) {
					return current.isMajor();
				})
			) {
				return false;
			}
			var map = {},
				sides = [],
				pmap = _status.connectMode ? lib.playerOL : game.playerMap,
				player;
			for (var i of game.players) {
				if (i.identity == "unknown") {
					continue;
				}
				var added = false;
				for (var j of sides) {
					if (i.isFriendOf(pmap[j])) {
						added = true;
						map[j].push(i);
						if (i == this) {
							player = j;
						}
						break;
					}
				}
				if (!added) {
					map[i.playerid] = [i];
					sides.push(i.playerid);
					if (i == this) {
						player = i.playerid;
					}
				}
			}
			for (var i in map) {
				if (map[i].length < map[player].length) {
					return false;
				}
			}
			return true;
		} else {
			if (!nomajor && this.isMajor()) {
				return false;
			}
			if (
				!nomajor &&
				!game.hasPlayer(function (current) {
					return current.isMajor();
				})
			) {
				return false;
			}
			var map = {};
			for (var i of game.players) {
				if (!map[i.group]) {
					map[i.group] = [];
				}
				map[i.group].push(i);
			}
			for (var i in map) {
				if (map[i].length < map[this.group].length) {
					return false;
				}
			}
			return true;
		}
	}
	siege(player) {
		if (this.identity == "unknown" || this.hasSkill("undist")) {
			return false;
		}
		if (!player) {
			var next = this.getNext();
			if (next && next.sieged()) {
				return true;
			}
			var previous = this.getPrevious();
			if (previous && previous.sieged()) {
				return true;
			}
			return false;
		} else {
			return player.sieged() && (player.getNext() == this || player.getPrevious() == this);
		}
	}
	sieged(player) {
		if (this.identity == "unknown") {
			return false;
		}
		if (player) {
			return player.siege(this);
		} else {
			var next = this.getNext();
			var previous = this.getPrevious();
			if (next && previous && next != previous) {
				if (next.identity == "unknown" || next.isFriendOf(this)) {
					return false;
				}
				return next.isFriendOf(previous);
			}
			return false;
		}
	}
	inline() {
		if (["unknown", "ye"].includes(this.identity) || this.hasSkill("undist")) {
			return false;
		}
		var next = this,
			previous = this;
		var list = [];
		for (var i = 0; next || previous; i++) {
			if (next) {
				next = next.getNext();
				if (!next.isFriendOf(this) || next == this) {
					next = null;
				} else {
					list.add(next);
				}
			}
			if (previous) {
				previous = previous.getPrevious();
				if (!previous.isFriendOf(this) || previous == this) {
					previous = null;
				} else {
					list.add(previous);
				}
			}
		}
		if (!list.length) {
			return false;
		}
		for (var i = 0; i < arguments.length; i++) {
			if (!list.includes(arguments[i]) && arguments[i] != this) {
				return false;
			}
		}
		return true;
	}
	checkShow(skill, showonly) {
		var sourceSkill = get.info(skill);
		var noshow = false;
		if (sourceSkill && sourceSkill.sourceSkill) {
			skill = sourceSkill.sourceSkill;
		}
		if (lib.skill.global.includes(skill)) {
			return false;
		}
		if (get.mode() != "guozhan" || game.expandSkills(this.getSkills()).includes(skill)) {
			if (showonly) {
				return false;
			} else {
				noshow = true;
			}
		}
		var unseen0 = this.isUnseen(0);
		var name1 = this.name1 || this.name;
		if (lib.character[name1] && (!showonly || unseen0)) {
			var skills = game.expandSkills(lib.character[name1][3].slice(0));
			if (skills.includes(skill)) {
				if (!noshow && this.isUnseen(0)) {
					this.showCharacter(0);
				}
				return "main";
			}
		}
		var unseen1 = this.isUnseen(1);
		var name2 = this.name2;
		if (lib.character[name2] && (!showonly || unseen1)) {
			var skills = game.expandSkills(lib.character[name2][3].slice(0));
			if (skills.includes(skill)) {
				if (!noshow && this.isUnseen(1)) {
					this.showCharacter(1);
				}
				return "vice";
			}
		}
		return false;
	}
	/**
	 *
	 * @param { number | Card[] | Card } [add] (逻辑上)同时考虑“获得”的这张/些牌
	 * @param { (card?: Card, player?: Player) => boolean } [filter] 代替默认策略(计入手牌数的手牌)进行筛选
	 * @param { boolean } [pure] (手牌上限大于手牌数时)返回负值
	 * @returns { number } 需要弃置的牌数
	 */
	needsToDiscard(add, filter, pure) {
		let cards = this.getCards("h"),
			num = 0;
		if (typeof add === "number") {
			num = add;
		} else if (get.itemtype(add) === "cards") {
			cards.addArray(add);
		} else if (get.itemtype(add) === "card") {
			cards.push(add);
		}
		if (typeof filter !== "function") {
			filter = (card, player) => !player.canIgnoreHandcard(card);
		}
		cards = cards.filter(card => {
			return filter(card, this, cards);
		});
		num += cards.length - this.getHandcardLimit();
		if (pure) {
			return num;
		}
		return Math.max(0, num);
	}
	distanceTo(target, method) {
		return get.distance(this, target, method);
	}
	distanceFrom(target, method) {
		return get.distance(target, this, method);
	}
	/**
	 * @param { string } skill
	 * @param { Parameters<this['getSkills']>[0] } [arg2]
	 * @param { Parameters<this['getSkills']>[1] } [arg3]
	 * @param { Parameters<this['getSkills']>[2] } [arg4]
	 * @returns { boolean }
	 */
	hasSkill(skill, arg2, arg3, arg4) {
		if (skill === "counttrigger") {
			return true;
		}
		return game.expandSkills(this.getSkills(arg2, arg3, arg4)).includes(skill);
	}
	/**
	 * @param { string } skill
	 * @param { Parameters<this['getStockSkills']>[0] } arg1
	 * @param { Parameters<this['getStockSkills']>[1] } arg2
	 * @param { Parameters<this['getStockSkills']>[2] } arg3
	 * @returns { boolean }
	 */
	hasStockSkill(skill, arg1, arg2, arg3) {
		return game.expandSkills(this.getStockSkills(arg1, arg2, arg3)).includes(skill);
	}
	isZhu2() {
		var player = this,
			mode = get.mode();
		if (!this.isZhu) {
			return false;
		}
		if (mode == "identity") {
			if (_status.mode == "stratagem" && !this.identityShown) {
				return false;
			}
			return true;
		}
		if (mode == "versus" && (_status.mode == "four" || _status.mode == "guandu")) {
			return true;
		}
		return false;
	}
	isInitFilter(tag) {
		const player = this;
		for (const name of [player.name, player.name1, player.name2]) {
			if (name && lib.character[name]) {
				const filter = lib.character[name].initFilters;
				if (!filter.includes(tag)) {
					continue;
				}
				if (lib.characterInitFilter[name] && lib.characterInitFilter[name](tag) === false) {
					continue;
				}
				return true;
			}
		}
		return false;
	}
	/**
	 *
	 * @param {string} skill
	 * @param {Player} [player]
	 */
	hasZhuSkill(skill, player) {
		if (!this.hasSkill(skill)) {
			return false;
		}
		if (player) {
			var mode = get.mode();
			if (mode == "identity" && _status.mode == "purple") {
				if (this.identity.slice(0, 1) != player.identity.slice(0, 1)) {
					return false;
				}
			}
			if (mode == "versus" && (_status.mode == "four" || _status.mode == "guandu")) {
				if (this.side != player.side) {
					return false;
				}
			}
		}
		return true;
	}
	hasGlobalTag(tag, arg) {
		var skills = lib.skill.global.slice(0);
		game.expandSkills(skills);
		for (var i = 0; i < skills.length; i++) {
			var info = lib.skill[skills[i]];
			if (info && info.ai) {
				if (info.ai.skillTagFilter && info.ai[tag] && info.ai.skillTagFilter(this, tag, arg) === false) {
					continue;
				}
				if (typeof info.ai[tag] == "string") {
					if (info.ai[tag] == arg) {
						return true;
					}
				} else if (info.ai[tag]) {
					return true;
				}
			}
		}
		return false;
	}
	/**
	 * @param {string} tag
	 * @param {Parameters<this['getSkills']>[0]} [hidden]
	 * @param {Parameters<SkillAI['skillTagFilter']>[2]} [arg]
	 * @param {boolean} [globalskill] 只有为false才不添加全局技能ai进行筛选
	 */
	hasSkillTag(tag, hidden, arg, globalskill) {
		var skills = this.getSkills(hidden);
		if (globalskill !== false) {
			skills.addArray(lib.skill.global);
		}
		game.expandSkills(skills);
		for (var i = 0; i < skills.length; i++) {
			var info = lib.skill[skills[i]];
			if (info && info.ai) {
				if (info.ai.skillTagFilter && info.ai[tag]) {
					if (info.ai.skillTagFilter(this, tag, arg) === false) {
						continue;
					}
				}
				if (info.ai[tag] === true) {
					if (typeof arg === "object" && arg && !info.ai.skillTagFilter) {
						console.log(`疑似忘给lib.skill.${skills[i]}.ai.${tag}加skillTagFilter了\nhasSkillTag：`, arg);
					}
					return true;
				} else if (typeof info.ai[tag] !== "undefined") {
					if (typeof arg !== typeof info.ai[tag]) {
						console.warn(`lib.skill.${skills[i]}.ai.${tag}类型不符\nhasSkillTag：`, arg);
					}
					if (info.ai[tag] == arg) {
						// 全凭"=="大人的包容
						return true;
					}
				}
			}
		}
		return false;
	}
	/**
	 *
	 * @overload
	 * @param { string } name
	 * @returns { boolean} 返回玩家判定区是否有某(种牌名的)牌
	 */
	hasJudge(name) {
		if (name && typeof name === "object") {
			name = name.viewAs || name.name;
		}
		var judges = this.getVCards("j");
		for (var i = 0; i < judges.length; i++) {
			if (judges[i].name === name) {
				return true;
			}
		}
		return false;
	}
	/**
	 * 返回玩家是否存在队友
	 * @returns { boolean }
	 */
	hasFriend() {
		for (var i = 0; i < game.players.length; i++) {
			if (game.players[i].isOut()) {
				continue;
			}
			if (game.players[i] != this && get.attitude(game.players[i], this) > 0) {
				return true;
			}
		}
		return false;
	}
	/**
	 * 场上是否有至少num/1个不明身份角色
	 * @param { number } [num] 允许最多有num个不明身份角色
	 * @returns { boolean }
	 */
	hasUnknown(num) {
		var mode = get.mode();
		if (typeof num != "number") {
			num = 0;
		}
		if (mode == "identity" || mode == "guozhan") {
			for (var i = 0; i < game.players.length; i++) {
				if (game.players[i].ai.shown == 0 && game.players[i] != this) {
					num--;
					if (num <= 0) {
						return true;
					}
				}
			}
		}
		return false;
	}
	isUnknown(player) {
		var mode = get.mode();
		if (mode == "identity" || mode == "guozhan") {
			if (this.ai.shown == 0 && this != player) {
				return true;
			}
		}
		return false;
	}
	hasWuxie(info) {
		if (this.countCards("hs", "wuxie")) {
			return true;
		}
		var skills = this.getSkills("invisible").concat(lib.skill.global);
		game.expandSkills(skills);
		for (var i = 0; i < skills.length; i++) {
			var ifo = get.info(skills[i]);
			if (!ifo) {
				continue;
			}
			if (ifo.hiddenWuxie && info) {
				if (typeof ifo.hiddenWuxie == "function" && ifo.hiddenWuxie(this, info)) {
					return true;
				}
			} else if (ifo.viewAs && typeof ifo.viewAs != "function" && ifo.viewAs.name == "wuxie") {
				if (!ifo.viewAsFilter || ifo.viewAsFilter(this)) {
					return true;
				}
			} else {
				var hiddenCard = ifo.hiddenCard;
				if (typeof hiddenCard == "function" && hiddenCard(this, "wuxie")) {
					return true;
				}
			}
		}
		return false;
	}
	/**
	 * 有没有可用杀
	 * @param { string | boolean } [respond] 响应什么类型，默认使用。"use": 使用 / "respond": 打出 / "all": 全部，true
	 * @param { boolean } [noauto] 不考虑出牌阶段才能用的（待补充）
	 */
	hasSha(respond, noauto) {
		if (this.countCards("hs", "sha")) {
			return true;
		}
		if (this.countCards("hs", "hufu")) {
			return true;
		}
		if (!noauto && this.countCards("hs", "yuchanqian")) {
			return true;
		}
		if (typeof respond !== "string") {
			respond = respond ? "all" : "use";
		}
		if (this.hasSkillTag("respondSha", true, respond, true)) {
			return true;
		}
		return this.hasUsableCard("sha", respond);
	}
	/**
	 * 有没有可用闪
	 * @param { string | boolean } [respond] 响应什么类型，默认使用。"use": 使用 / "respond": 打出 / "all": 全部，true
	 */
	hasShan(respond) {
		if (this.countCards("hs", "shan")) {
			return true;
		}
		if (this.countCards("hs", "hufu")) {
			return true;
		}
		if (typeof respond !== "string") {
			respond = respond ? "all" : "use";
		}
		if (this.hasSkillTag("respondShan", true, respond, true)) {
			return true;
		}
		return this.hasUsableCard("shan", respond);
	}
	/**
	 * 以viewer视角猜测Player手里的杀
	 * @param { Player } [viewer]
	 * @param { "use" | "respond" } [type] 此杀用途："use"/"respond"，无则均加入
	 * @param { Card[] | Card | null } [ignore] 此牌/这些牌不纳入考量
	 * @param { "bool" | "count" | "odds" } [rvt]
	 * @returns { boolean | number } 返回值：rvt:"bool"(默认)是否可能有杀，"count"推测有多少张杀，"odds"有杀的概率
	 */
	mayHaveSha(viewer, type, ignore, rvt) {
		let count = 0;
		if ((this.hp > 2 || (!this.isZhu && this.hp > 1)) && this.hasSkillTag("respondSha", true, type, true)) {
			if (rvt === "count") {
				count++;
			} else if (rvt === "odds") {
				return 1;
			} else {
				return true;
			}
		}
		if (get.itemtype(viewer) !== "player") {
			viewer = _status.event.player;
		}
		let cards,
			selected = [];
		if (get.itemtype(ignore) === "cards") {
			selected.addArray(ignore);
		} else if (get.itemtype(ignore) === "card") {
			selected.add(ignore);
		}
		if (this === viewer || get.itemtype(viewer) == "player") {
			cards = this.getKnownCards(viewer);
		} else {
			cards = this.getShownCards();
		}
		count += cards.filter(card => {
			if (selected.includes(card)) {
				return false;
			}
			let name = get.name(card, this);
			if (name == "sha" || name == "hufu" || name == "yuchanqian") {
				if (type === "use") {
					return lib.filter.cardEnabled(card, this);
				}
				if (type === "respond") {
					return lib.filter.cardRespondable(card, this);
				}
				return true;
			}
			return false;
		}).length;
		if (count && rvt !== "count") {
			return rvt === "odds" ? 1 : true;
		}
		let hs = this.getCards("hs").filter(i => !cards.includes(i) && !selected.includes(i)).length;
		if (!hs) {
			if (rvt === "count") {
				return count;
			} else if (rvt === "odds") {
				return 0;
			}
			return false;
		}
		if (rvt === "count") {
			if (this.isPhaseUsing()) {
				return count + hs / 4;
			}
			return count + hs / 4.8;
		}
		if (hs > 9 || this.isPhaseUsing()) {
			count += Math.pow(2 + hs, 2) / 40;
		} else {
			count += -1.5 * Math.log(1 - hs / 10);
		}
		if (rvt === "odds") {
			return Math.min(1, count);
		}
		return count > _status.event.getRand("mayHaveSha" + hs + this.playerid);
	}
	/**
	 * 以viewer视角猜测Player手里的闪
	 * @param { Player } [viewer]
	 * @param { "use" | "respond" } [type] 此闪用途："use"/"respond"，无则均加入
	 * @param { Card[] | Card | boolean } [ignore] 此牌/这些牌不纳入考量。若 type 为"use"且此项不为false，则使用 this.getCards("h", i => i.hasGaintag("sha_notshan"))
	 * @param { "bool" | "count" | "odds" } [rvt]
	 * @returns { boolean | number } 返回值：rvt: "bool"(默认)是否可能有闪，"count"推测有多少张闪，"odds"有闪的概率
	 */
	mayHaveShan(viewer, type, ignore, rvt) {
		let count = 0;
		if ((this.hp > 2 || (!this.isZhu && this.hp > 1)) && this.hasSkillTag("respondShan", true, type, true)) {
			if (rvt === "count") {
				count++;
			} else if (rvt === "odds") {
				return 1;
			} else {
				return true;
			}
		}
		if (get.itemtype(viewer) !== "player") {
			viewer = _status.event.player;
		}
		let cards,
			selected = [];
		if (get.itemtype(ignore) === "cards") {
			selected.addArray(ignore);
		} else if (get.itemtype(ignore) === "card") {
			selected.add(ignore);
		} else if (ignore !== false) {
			if (type === "use") {
				ignore = this.getCards("h", i => i.hasGaintag("sha_notshan"));
			}
		}
		if (this === viewer || get.itemtype(viewer) == "player") {
			cards = this.getKnownCards(viewer);
		} else {
			cards = this.getShownCards();
		}
		count += cards.filter(card => {
			if (selected.includes(card)) {
				return false;
			}
			let name = get.name(card, this);
			if (name === "shan" || name === "hufu") {
				if (type === "use") {
					return lib.filter.cardEnabled(card, this, "forceEnable");
				}
				if (type === "respond") {
					return lib.filter.cardRespondable(card, this);
				}
				return true;
			}
			return false;
		}).length;
		if (count && rvt !== "count") {
			return rvt === "odds" ? 1 : true;
		}
		let hs = this.getCards("hs").filter(i => !cards.includes(i) && !selected.includes(i)).length;
		if (!hs) {
			if (rvt === "count") {
				return count;
			} else if (rvt === "odds") {
				return 0;
			}
			return false;
		}
		if (rvt === "count") {
			if (this.isPhaseUsing()) {
				return count + hs / 6;
			}
			return count + hs / 3.5;
		}
		if (this.isPhaseUsing()) {
			count += -1.5 * Math.log(1 - hs / 10);
		} else {
			count += (2 * hs) / (5 + hs);
		}
		if (rvt === "odds") {
			return Math.min(1, count);
		}
		return count > _status.event.getRand("mayHaveShan" + hs + this.playerid);
	}
	hasCard(name, position) {
		if (typeof name == "function") {
			for (let card of this.iterableGetCards(position, name)) {
				return true;
			}
		} else {
			if (this.countCards(position, name)) {
				return true;
			}
		}
		return false;
	}
	hasVCard(name, position) {
		if (typeof name == "function") {
			for (let card of this.iterableGetVCards(position, name)) {
				return true;
			}
		} else {
			if (this.countVCards(position, name)) {
				return true;
			}
		}
		return false;
	}
	getVEquip(name) {
		var es = this.getVCards("e");
		if (typeof name == "object" && get.info(name)) {
			name = get.info(name).subtype;
			if (name) {
				name = parseInt(name[5]);
			}
		} else if (typeof name == "string" && name.startsWith("equip") && name.length == 6) {
			name = parseInt(name[5]);
		}
		if (!name) {
			return null;
		}
		for (var i = 0; i < es.length; i++) {
			if (typeof name === "number") {
				if (get.info(es[i]).subtype === "equip" + name) {
					return es[i];
				}
			} else {
				if (es[i].name === name) {
					return es[i];
				}
				var source = get.info(es[i]).source;
				if (Array.isArray(source) && source.includes(name)) {
					return es[i];
				}
			}
		}
		return null;
	}
	getEquip(name) {
		var es = this.getCards("e");
		if (typeof name == "object" && get.info(name)) {
			name = get.info(name).subtype;
			if (name) {
				name = parseInt(name[5]);
			}
		} else if (typeof name == "string" && name.startsWith("equip") && name.length == 6) {
			name = parseInt(name[5]);
		}
		if (!name) {
			return null;
		}
		for (var i = 0; i < es.length; i++) {
			if (typeof name === "number") {
				if (get.info(es[i]).subtype === "equip" + name) {
					return es[i];
				}
			} else {
				if (es[i].name === name) {
					return es[i];
				}
				var source = get.info(es[i]).source;
				if (Array.isArray(source) && source.includes(name)) {
					return es[i];
				}
			}
		}
		return null;
	}
	/**
	 * 返回玩家判定区中的虚拟牌
	 * @param { string } [name]
	 * @returns { VCard|null }
	 */
	getVJudge(name) {
		var judges = this.getVCards("j");
		for (var i = 0; i < judges.length; i++) {
			if (judges[i].name == name) {
				return judges[i];
			}
		}
		return null;
	}
	/**
	 * 返回玩家判定区中的牌
	 * @deprecated
	 * @param { string } [name]
	 * @returns { Card|null }
	 */
	getJudge(name) {
		var judges = this.getCards("j");
		for (var i = 0; i < judges.length; i++) {
			if ((judges[i].viewAs || judges[i].name) == name) {
				return judges[i];
			}
		}
		return null;
	}
	$drawAuto(cards, target) {
		if (this.isUnderControl(true, target)) {
			this.$draw(cards);
		} else {
			this.$draw(cards.length);
		}
	}
	$draw(num, init, config, cardsetion) {
		if (!cardsetion && cardsetion !== false && lib.config.card_animation_info) {
			cardsetion = get.cardsetion(this);
		}
		if (init !== false && init !== "nobroadcast") {
			game.broadcast(
				function (player, num, init, config, cardsetion) {
					player.$draw(num, init, config, cardsetion);
				},
				this,
				num,
				init,
				config,
				cardsetion
			);
		}
		var cards, node;
		if (get.itemtype(num) == "cards") {
			cards = num;
			num = cards.length;
		} else if (get.itemtype(num) == "card") {
			cards = [num];
			num = 1;
		}
		if (init !== false) {
			if (cards) {
				game.addVideo("drawCard", this, get.cardsInfo(cards));
			} else {
				game.addVideo("draw", this, num);
			}
		}
		if (cards) {
			cards = cards.slice(0);
			node = cards.shift().copy("thrown", "drawingcard");
			if (cardsetion) {
				var next = ui.create.div(".cardsetion", cardsetion, node);
				next.style.setProperty("display", "block", "important");
				if (node.node) {
					if (node.node.cardsetion) {
						node.node.cardsetion.remove();
						delete node.node.cardsetion;
					}
					node.node.cardsetion = next;
				}
			}
		} else {
			node = ui.create.div(".card.thrown.drawingcard");
			node.classList.add("infoflip");
			node.classList.add("infohidden");
			if (cardsetion) {
				var next = ui.create.div(".cardsetion", cardsetion, node);
				next.style.setProperty("display", "block", "important");
				if (node.node) {
					if (node.node.cardsetion) {
						node.node.cardsetion.remove();
						delete node.node.cardsetion;
					}
					node.node.cardsetion = next;
				}
			}
		}
		node.fixed = true;
		node.hide();

		var dx, dy;
		if (game.chess) {
			var rect = this.getBoundingClientRect();

			if (rect.left <= 80) {
				dx = -10;
				if (rect.top <= 80) {
					dy = -10;
				} else if (rect.top + rect.height + 80 >= ui.chessContainer.offsetHeight) {
					dy = 10;
				} else {
					dy = 0;
				}
			} else if (rect.left + rect.width + 80 >= ui.chessContainer.offsetWidth) {
				dx = 10;
				if (rect.top <= 80) {
					dy = -10;
				} else if (rect.top + rect.height + 80 >= ui.chessContainer.offsetHeight) {
					dy = 10;
				} else {
					dy = 0;
				}
			} else if (rect.top <= 80) {
				dx = 0;
				dy = -10;
			} else if (rect.top + rect.height + 80 >= ui.chessContainer.offsetHeight) {
				dx = 0;
				dy = 10;
			} else {
				dx = rect.left + this.offsetWidth / 2 - ui.arena.offsetWidth / 2;
				dy = rect.top + this.offsetHeight / 2 - ui.arena.offsetHeight / 2;
			}

			var coeff = 240 / Math.sqrt(dx * dx + dy * dy);
			dx *= coeff;
			dy *= coeff;

			node.style.left = this.getLeft() + this.offsetWidth / 2 - 52 - dx + "px";
			node.style.top = this.getTop() + this.offsetHeight / 2 - 52 - dy + "px";
			this.parentNode.appendChild(node);
		} else {
			this.parentNode.appendChild(node);
			node.style.left = "calc(50% - 52px)";
			node.style.top = "calc(50% - 52px)";

			dx = this.getLeft() + this.offsetWidth / 2 - 52 - node.offsetLeft;
			dy = this.getTop() + this.offsetHeight / 2 - 52 - node.offsetTop;

			if (get.is.mobileMe(this)) {
				dx += get.cardOffset();
				if (ui.arena.classList.contains("oblongcard")) {
					dy -= 16;
				}
			}
		}
		node.style.transitionDuration = "0.8s";
		ui.refresh(node);
		if (typeof num == "number" && init !== false) {
			config = {
				total: num,
				current: 1,
			};
		}
		if (config && config.total > 1) {
			var total = config.total,
				current = config.current;
			var dxtotal;
			if (total <= 5) {
				dxtotal = Math.min(80, (total - 1) * 20);
				dx += -dxtotal + (2 * dxtotal * (current - 1)) / (total - 1);
			} else {
				var total2 = Math.floor(total / 2);
				if (current <= total2) {
					total = total2;
					dy -= 20;
				} else {
					current -= total2;
					total -= total2;
					dy += 20;
				}
				dxtotal = Math.min(80, (total - 1) * 20);
				dx += -dxtotal + (2 * dxtotal * (current - 1)) / (total - 1);
			}
			config.current++;
		}
		if (node.style.transform && node.style.transform != "none" && node.style.transform.indexOf("translate") == -1) {
			node.style.transform += " translate(" + dx + "px," + dy + "px)";
		} else {
			node.style.transform = "translate(" + dx + "px," + dy + "px)";
		}
		node.show();

		node.listenTransition(function () {
			node.style.transitionDuration = "0.5s";
			ui.refresh(node);
			node.delete();
		});
		var that = this;
		if (num && num > 1) {
			if (config && config.total > 1) {
				setTimeout(function () {
					if (cards) {
						that.$draw(cards, false, config, cardsetion);
					} else {
						that.$draw(num - 1, false, config, cardsetion);
					}
				}, 50);
			} else {
				setTimeout(function () {
					if (cards) {
						that.$draw(cards, false, config, cardsetion);
					} else {
						that.$draw(num - 1, false, config, cardsetion);
					}
				}, 200);
			}
		}
	}
	$compareMultiple(card1, targets, cards, cardsetions) {
		if (!cardsetions && lib.config.card_animation_info) {
			var cardsetions = {},
				cardsetion_targets = [this];
			cardsetion_targets.addArray(targets);
			for (let target of cardsetion_targets) {
				let id = target.playerid,
					cardsetion = get.cardsetion(target);
				cardsetions[id] = cardsetion;
			}
		}
		game.broadcast(
			function (player, card1, targets, cards, cardsetions) {
				player.$compareMultiple(card1, targets, cards, cardsetions);
			},
			this,
			card1,
			targets,
			cards,
			cardsetions
		);
		game.addVideo("compareMultiple", this, [get.cardInfo(card1), get.targetsInfo(targets), get.cardsInfo(cards)]);
		var player = this;
		var node1 = player.$throwxy2(card1, "calc(50% - 52px)", "calc(50% + 10px)", "perspective(600px) rotateY(180deg)", true);
		if (lib.config.cardback_style != "default") {
			node1.style.transitionProperty = "none";
			ui.refresh(node1);
			node1.classList.add("infohidden");
			ui.refresh(node1);
			node1.style.transitionProperty = "";
		} else {
			node1.classList.add("infohidden");
		}

		node1.style.transform = "perspective(600px) rotateY(180deg) translateX(0)";
		if (cardsetions) {
			var next = ui.create.div(".cardsetion", cardsetions[player.playerid] || "", node1);
			next.style.setProperty("display", "block", "important");
			if (node1.node) {
				if (node1.node.cardsetion) {
					node1.node.cardsetion.remove();
					delete node1.node.cardsetion;
				}
				node1.node.cardsetion = next;
			}
		}
		var onEnd01 = function () {
			//node1.removeEventListener('webkitTransitionEnd',onEnd01);
			setTimeout(function () {
				node1.style.transition = "all ease-in 0.3s";
				node1.style.transform = "perspective(600px) rotateY(270deg) translateX(52px)";
				var onEnd = function () {
					node1.classList.remove("infohidden");
					node1.style.transition = "all 0s";
					ui.refresh(node1);
					node1.style.transform = "perspective(600px) rotateY(-90deg) translateX(52px)";
					ui.refresh(node1);
					node1.style.transition = "";
					ui.refresh(node1);
					node1.style.transform = "";
					//node1.removeEventListener('webkitTransitionEnd',onEnd);
				};
				node1.listenTransition(onEnd);
			}, 300);
		};
		node1.listenTransition(onEnd01);

		setTimeout(function () {
			var left0 = -targets.length * 52 - (targets.length - 1) * 8;
			for (var i = 0; i < targets.length; i++) {
				(function (target, card2, i) {
					var left = left0 + i * 120;
					var node2;
					if (left < 0) {
						node2 = target.$throwxy2(
							card2,
							"calc(50% - " + -left + "px)",
							"calc(50% - 114px)",
							"perspective(600px) rotateY(180deg)",
							true
						);
					} else {
						node2 = target.$throwxy2(
							card2,
							"calc(50% + " + left + "px)",
							"calc(50% - 114px)",
							"perspective(600px) rotateY(180deg)",
							true
						);
					}
					if (cardsetions) {
						var next = ui.create.div(".cardsetion", cardsetions[target.playerid] || "", node2);
						next.style.setProperty("display", "block", "important");
						if (node2.node) {
							if (node2.node.cardsetion) {
								node2.node.cardsetion.remove();
								delete node2.node.cardsetion;
							}
							node2.node.cardsetion = next;
						}
					}
					if (lib.config.cardback_style != "default") {
						node2.style.transitionProperty = "none";
						ui.refresh(node2);
						node2.classList.add("infohidden");
						ui.refresh(node2);
						node2.style.transitionProperty = "";
					} else {
						node2.classList.add("infohidden");
					}
					node2.style.transform = "perspective(600px) rotateY(180deg) translateX(0)";
					var onEnd02 = function () {
						//node2.removeEventListener('webkitTransitionEnd',onEnd02);
						setTimeout(function () {
							node2.style.transition = "all ease-in 0.3s";
							node2.style.transform = "perspective(600px) rotateY(270deg) translateX(52px)";
							var onEnd = function () {
								node2.classList.remove("infohidden");
								node2.style.transition = "all 0s";
								ui.refresh(node2);
								node2.style.transform = "perspective(600px) rotateY(-90deg) translateX(52px)";
								ui.refresh(node2);
								node2.style.transition = "";
								ui.refresh(node2);
								node2.style.transform = "";
								//node2.removeEventListener('webkitTransitionEnd',onEnd);
							};
							node2.listenTransition(onEnd);
						}, 200);
					};
					node2.listenTransition(onEnd02);
				})(targets[i], cards[i], i);
			}
		}, 200);
	}
	$compare(card1, target, card2, cardsetions) {
		if (!cardsetions && lib.config.card_animation_info) {
			var cardsetions = {},
				cardsetion_targets = [this, target];
			for (let targetx of cardsetion_targets) {
				let id = targetx.playerid,
					cardsetion = get.cardsetion(targetx);
				cardsetions[id] = cardsetion;
			}
		}
		game.broadcast(
			function (player, target, card1, card2, cardsetions) {
				player.$compare(card1, target, card2, cardsetions);
			},
			this,
			target,
			card1,
			card2,
			cardsetions
		);
		game.addVideo("compare", this, [get.cardInfo(card1), target.dataset.position, get.cardInfo(card2)]);
		var player = this;
		var node1 = player.$throwxy2(card1, "calc(50% - 114px)", "calc(50% - 52px)", "perspective(600px) rotateY(180deg)", true);
		if (lib.config.cardback_style != "default") {
			node1.style.transitionProperty = "none";
			ui.refresh(node1);
			node1.classList.add("infohidden");
			ui.refresh(node1);
			node1.style.transitionProperty = "";
		} else {
			node1.classList.add("infohidden");
		}
		if (cardsetions) {
			var next = ui.create.div(".cardsetion", cardsetions[player.playerid] || "", node1);
			next.style.setProperty("display", "block", "important");
			if (node1.node) {
				if (node1.node.cardsetion) {
					node1.node.cardsetion.remove();
					delete node1.node.cardsetion;
				}
				node1.node.cardsetion = next;
			}
		}
		node1.style.transform = "perspective(600px) rotateY(180deg) translateX(0)";
		var onEnd01 = function () {
			//node1.removeEventListener('webkitTransitionEnd',onEnd01);
			setTimeout(function () {
				node1.style.transition = "all ease-in 0.3s";
				node1.style.transform = "perspective(600px) rotateY(270deg) translateX(52px)";
				var onEnd = function () {
					node1.classList.remove("infohidden");
					node1.style.transition = "all 0s";
					ui.refresh(node1);
					node1.style.transform = "perspective(600px) rotateY(-90deg) translateX(52px)";
					ui.refresh(node1);
					node1.style.transition = "";
					ui.refresh(node1);
					node1.style.transform = "";
					//node1.removeEventListener('webkitTransitionEnd',onEnd);
				};
				node1.listenTransition(onEnd);
			}, 300);
		};
		node1.listenTransition(onEnd01);
		setTimeout(function () {
			var node2 = target.$throwxy2(card2, "calc(50% + 10px)", "calc(50% - 52px)", "perspective(600px) rotateY(180deg)", true);
			if (lib.config.cardback_style != "default") {
				node2.style.transitionProperty = "none";
				ui.refresh(node2);
				node2.classList.add("infohidden");
				ui.refresh(node2);
				node2.style.transitionProperty = "";
			} else {
				node2.classList.add("infohidden");
			}
			if (cardsetions) {
				var next = ui.create.div(".cardsetion", cardsetions[target.playerid] || "", node2);
				next.style.setProperty("display", "block", "important");
				if (node2.node) {
					if (node2.node.cardsetion) {
						node2.node.cardsetion.remove();
						delete node2.node.cardsetion;
					}
					node2.node.cardsetion = next;
				}
			}
			node2.style.transform = "perspective(600px) rotateY(180deg) translateX(0)";
			var onEnd02 = function () {
				//node2.removeEventListener('webkitTransitionEnd',onEnd02);
				setTimeout(function () {
					node2.style.transition = "all ease-in 0.3s";
					node2.style.transform = "perspective(600px) rotateY(270deg) translateX(52px)";
					var onEnd = function () {
						node2.classList.remove("infohidden");
						node2.style.transition = "all 0s";
						ui.refresh(node2);
						node2.style.transform = "perspective(600px) rotateY(-90deg) translateX(52px)";
						ui.refresh(node2);
						node2.style.transition = "";
						ui.refresh(node2);
						node2.style.transform = "";
						//node2.removeEventListener('webkitTransitionEnd',onEnd);
					};
					node2.listenTransition(onEnd);
				}, 200);
			};
			node2.listenTransition(onEnd02);
		}, 200);
	}
	$throw(card, time, init, nosource, cardsetion) {
		if (!cardsetion && cardsetion !== false && lib.config.card_animation_info) {
			let source = this;
			if (["useCard", "respond"].includes(get.event().name)) {
				source = get.player();
			}
			cardsetion = get.cardsetion(source);
		}
		if (typeof card == "number") {
			var tmp = card;
			card = [];
			while (tmp--) {
				var cardx = ui.create.card();
				cardx.classList.add("infohidden");
				cardx.classList.add("infoflip");
				if (cardsetion) {
					var next = ui.create.div(".cardsetion", cardsetion, cardx);
					next.style.setProperty("display", "block", "important");
					if (cardx.node) {
						if (cardx.node.cardsetion) {
							cardx.node.cardsetion.remove();
							delete cardx.node.cardsetion;
						}
						cardx.node.cardsetion = next;
					}
				}
				card.push(cardx);
			}
		}
		if (init !== false) {
			if (init !== "nobroadcast") {
				game.broadcast(
					function (player, card, time, init, nosource, cardsetion) {
						player.$throw(card, time, init, nosource, cardsetion);
					},
					this,
					card,
					time,
					init,
					nosource,
					cardsetion
				);
			}
			if (get.itemtype(card) != "cards") {
				if (get.itemtype(card) == "card") {
					card = [card];
				} else {
					return;
				}
			}
			game.addVideo("throw", this, [get.cardsInfo(card), time, nosource]);
		}
		if (game.chess) {
			this.chessFocus();
		}
		if (get.itemtype(card) == "cards") {
			var node;
			for (var i = 0; i < card.length; i++) {
				node = this.$throw(card[i], time, false, nosource, cardsetion);
			}
			return node;
		} else {
			var node;
			if (card == undefined || card.length == 0) {
				return;
			}
			node = this.$throwordered(card.copy("thrown"), nosource, cardsetion);
			if (time != undefined) {
				node.fixed = true;
				setTimeout(function () {
					node.delete();
				}, time);
			}
			lib.listenEnd(node);
			return node;
		}
	}
	$throwordered() {
		const $throwordered2 = this.$throwordered2.apply(this, arguments);
		if (lib.config.card_animation_info) {
			let node = arguments[0];
			let eventInfo = arguments[2],
				player = this;
			if (!eventInfo) {
				eventInfo = get.cardsetion(player);
			}
			if (eventInfo?.length) {
				game.broadcastAll(
					function (node, eventInfo, id) {
						if (!node?.node) {
							node = [...ui.arena.childNodes].find(c => {
								if (c.classList.contains("thrown") && c.classList.contains("card")) {
									if (c._cardid == id && !c.selectedt) {
										c.selectedt = true;
										return true;
									}
								}
							});
						}
						if (!node?.node) {
							return;
						}
						node.classList.add("infoflip");
						let next = ui.create.div(".cardsetion", eventInfo, node);
						next.style.setProperty("display", "block", "important");
						if (node.node) {
							if (node.node.cardsetion) {
								node.node.cardsetion.remove();
								delete node.node.cardsetion;
							}
							node.node.cardsetion = next;
						}
					},
					node,
					eventInfo,
					node._cardid
				);
				node.classList.add("infoflip");
				let next = ui.create.div(".cardsetion", eventInfo, node);
				next.style.setProperty("display", "block", "important");
				if (node.node) {
					if (node.node.cardsetion) {
						node.node.cardsetion.remove();
						delete node.node.cardsetion;
					}
					node.node.cardsetion = next;
				}
			}
		}
		return $throwordered2;
		// if(lib.config.low_performance){
		// 	return this.$throwordered2.apply(this,arguments);
		// }
		// else{
		// 	return this.$throwordered1.apply(this,arguments);
		// }
	}
	$throwordered1(node, nosource) {
		node.classList.add("thrown");
		node.hide();
		node.style.transitionProperty = "left,top,opacity,transform";
		for (var i = 0; i < ui.thrown.length; i++) {
			if (ui.thrown[i].parentNode != ui.arena || ui.thrown[i].classList.contains("removing")) {
				ui.thrown.splice(i--, 1);
			}
		}
		ui.thrown.push(node);
		var uithrowns = ui.thrown.slice(0);
		var tops;
		if (game.chess) {
			switch (Math.floor((ui.thrown.length - 1) / 4)) {
				case 0:
					tops = ["calc(50% - 82px)"];
					break;
				case 1:
					tops = ["calc(50% - 139px)", "calc(50% - 25px)"];
					break;
				case 2:
					tops = ["calc(50% - 196px)", "calc(50% - 82px)", "calc(50% + 32px)"];
					break;
				default:
					tops = ["calc(50% - 253px)", "calc(50% - 139px)", "calc(50% - 25px)", "calc(50% + 89px)"];
			}
		} else {
			switch (Math.floor((ui.thrown.length - 1) / 4)) {
				case 0:
					tops = ["calc(50% - 52px)"];
					break;
				case 1:
					tops = ["calc(50% - 109px)", "calc(50% + 5px)"];
					break;
				case 2:
					tops = ["calc(50% - 166px)", "calc(50% - 52px)", "calc(50% + 62px)"];
					break;
				default:
					tops = ["calc(50% - 223px)", "calc(50% - 109px)", "calc(50% + 5px)", "calc(50% + 119px)"];
			}
		}
		while (uithrowns.length) {
			var throwns = uithrowns.splice(0, Math.min(uithrowns.length, 4));
			switch (throwns.length) {
				case 1:
					throwns[0].style.left = "calc(50% - 52px)";
					break;
				case 2:
					throwns[0].style.left = "calc(50% - 109px)";
					throwns[1].style.left = "calc(50% + 5px)";
					break;
				case 3:
					throwns[0].style.left = "calc(50% - 166px)";
					throwns[1].style.left = "calc(50% - 52px)";
					throwns[2].style.left = "calc(50% + 62px)";
					break;
				case 4:
					throwns[0].style.left = "calc(50% - 223px)";
					throwns[1].style.left = "calc(50% - 109px)";
					throwns[2].style.left = "calc(50% + 5px)";
					throwns[3].style.left = "calc(50% + 119px)";
					break;
			}
			var top;
			if (tops.length) {
				top = tops.shift();
			} else {
				if (game.chess) {
					top = "calc(50% - 82px)";
				} else {
					top = "calc(50% - 52px)";
				}
			}
			for (var i = 0; i < throwns.length; i++) {
				throwns[i].style.top = top;
			}
		}
		if (nosource) {
			node.style.transform = "scale(0)";
			node.classList.add("center");
		} else {
			var parseCalc = function (str) {
				var per = str.slice(str.indexOf("calc(") + 5, str.indexOf("%"));
				var add = str.slice(str.indexOf("%") + 1, str.indexOf("px")).replace(/\s/g, "");
				return [parseInt(per), parseInt(add)];
			};
			var nx = parseCalc(node.style.left);
			var ny = parseCalc(node.style.top);
			nx = (nx[0] * ui.arena.offsetWidth) / 100 + nx[1];
			ny = (ny[0] * ui.arena.offsetHeight) / 100 + ny[1];
			var dx, dy;
			if (game.chess) {
				var rect = this.getBoundingClientRect();
				dx = rect.left + this.offsetWidth / 2 - 52 - nx;
				dy = rect.top + this.offsetHeight / 2 - 52 - ny;
			} else {
				dx = this.getLeft() + this.offsetWidth / 2 - 52 - nx;
				dy = this.getTop() + this.offsetHeight / 2 - 52 - ny;
				if (get.is.mobileMe(this)) {
					dx += get.cardOffset();
					if (ui.arena.classList.contains("oblongcard")) {
						dy -= 16;
					}
				}
			}
			if (node.style.transform && node.style.transform != "none" && node.style.transform.indexOf("translate") == -1) {
				node.style.transform += " translate(" + dx + "px," + dy + "px)";
			} else {
				node.style.transform = "translate(" + dx + "px," + dy + "px)";
			}
		}
		ui.arena.appendChild(node);
		ui.refresh(node);
		node.style.transform = "";
		node.show();
		lib.listenEnd(node);
		return node;
	}
	$throwordered2(node, nosource) {
		node.classList.add("thrown");
		node.classList.add("center");
		node.hide();
		node.style.transitionProperty = "left,top,opacity,transform";

		if (nosource) {
			// node.style.transform='scale(0)';
		} else {
			var nx = [50, -52];
			var ny = [50, -52];
			nx = (nx[0] * ui.arena.offsetWidth) / 100 + nx[1];
			ny = (ny[0] * ui.arena.offsetHeight) / 100 + ny[1];
			var dx, dy;
			if (game.chess) {
				var rect = this.getBoundingClientRect();
				dx = rect.left + this.offsetWidth / 2 - 52 - nx;
				dy = rect.top + this.offsetHeight / 2 - 52 - ny;
			} else {
				dx = this.getLeft() + this.offsetWidth / 2 - 52 - nx;
				dy = this.getTop() + this.offsetHeight / 2 - 52 - ny;
				if (get.is.mobileMe(this)) {
					dx += get.cardOffset();
					if (ui.arena.classList.contains("oblongcard")) {
						dy -= 16;
					}
				}
			}
			if (node.style.transform && node.style.transform != "none" && node.style.transform.indexOf("translate") == -1) {
				node.style.transform += " translate(" + dx + "px," + dy + "px)";
			} else {
				node.style.transform = "translate(" + dx + "px," + dy + "px)";
			}
		}
		ui.arena.appendChild(node);
		ui.refresh(node);

		for (var i = 0; i < ui.thrown.length; i++) {
			if (ui.thrown[i].parentNode != ui.arena || ui.thrown[i].classList.contains("removing")) {
				ui.thrown.splice(i--, 1);
			}
		}
		ui.thrown.push(node);
		var cards = ui.thrown;
		var pw = ui.arena.offsetWidth;
		var cardWidth = 105;
		var cardGap = 2;
		var totalWidth = cards.length * cardWidth + (cards.length - 1) * cardGap;
		var maxWidth = pw * 0.7;
		var limitWidth = Math.min(maxWidth, pw);
		var margin = totalWidth > limitWidth ? (limitWidth - cardWidth) / (cards.length - 1) : cardWidth + cardGap;
		var actualWidth = Math.min(totalWidth, limitWidth);
		var offsetX = -actualWidth / 2 + cardWidth / 2;
		var infoOffset = cardWidth + cardGap - margin;
		if (infoOffset < 0) infoOffset = 0;
		for (var j = 0; j < cards.length; j++) {
			var x = Math.round(offsetX + j * margin);
			cards[j].style.transform = "translate(" + x + "px, -30px)";
			if (cards[j].node && j < cards.length - 1 && infoOffset > 0) {
				var actualInfoOffset = infoOffset;
				if (infoOffset > 40) {
					actualInfoOffset = 90 - (cards[j].node.info ? cards[j].node.info.offsetWidth : 20);
					if (cards[j].node.info) {
						var infoSpan = cards[j].node.info.querySelector("span");
						if (infoSpan) infoSpan.style.display = "none";
						cards[j].node.info.style.transform = "translateX(-" + actualInfoOffset + "px) translateY(-3px)";
					}
					if (cards[j].node.name) {
						if (cards[j].node.name.classList.contains("long")) {
							cards[j].node.name.style.transform = "translateY(16px) scale(0.85)";
							cards[j].node.name.style.transformOrigin = "top left";
						} else {
							cards[j].node.name.style.transform = "translateY(16px)";
						}
					}
				} else {
					if (cards[j].node.info) {
						var infoSpan = cards[j].node.info.querySelector("span");
						if (infoSpan) infoSpan.style.display = "";
						cards[j].node.info.style.transform = "translateX(-" + actualInfoOffset + "px)";
					}
					if (cards[j].node.name) {
						cards[j].node.name.style.transform = "";
						cards[j].node.name.style.transformOrigin = "";
					}
				}
			} else if (cards[j].node) {
				if (cards[j].node.info) {
					var infoSpan = cards[j].node.info.querySelector("span");
					if (infoSpan) infoSpan.style.display = "";
					cards[j].node.info.style.transform = "";
				}
				if (cards[j].node.name) {
					cards[j].node.name.style.transform = "";
					cards[j].node.name.style.transformOrigin = "";
				}
			}
		}
		node.show();
		lib.listenEnd(node);
		return node;
	}
	$throwxy(card, left, top) {
		var node = card.copy("thrown", "thrownhighlight");
		node.dataset.position = this.dataset.position;
		node.hide();
		node.style.transitionProperty = "left,top,opacity";

		ui.arena.appendChild(node);
		ui.refresh(node);
		node.show();
		node.style.left = left;
		node.style.top = top;
		lib.listenEnd(node);
		return node;
	}
	$throwxy2(card, left, top, trans, flipx, flipy) {
		if (game.chess) {
			return this.$throwxy.apply(this, arguments);
		}
		var node = card.copy("thrown", "thrownhighlight");
		node.style.left = left;
		node.style.top = top;
		node.hide();
		// node.style.transitionProperty='left,top,opacity,transform';

		var parseCalc = function (str) {
			var per = str.slice(str.indexOf("calc(") + 5, str.indexOf("%"));
			var add = str.slice(str.indexOf("%") + 1, str.indexOf("px")).replace(/\s/g, "");
			return [parseInt(per), parseInt(add)];
		};
		var nx = parseCalc(node.style.left);
		var ny = parseCalc(node.style.top);
		nx = (nx[0] * ui.arena.offsetWidth) / 100 + nx[1];
		ny = (ny[0] * ui.arena.offsetHeight) / 100 + ny[1];
		var dx = this.getLeft() + this.offsetWidth / 2 - 52 - nx;
		var dy = this.getTop() + this.offsetHeight / 2 - 52 - ny;
		if (flipx) {
			dx = -dx;
		}
		if (flipy) {
			dy = -dy;
		}
		if (trans) {
			node.style.transform = trans + " translate(" + dx + "px," + dy + "px)";
		} else {
			node.style.transform = "translate(" + dx + "px," + dy + "px)";
		}

		ui.arena.appendChild(node);
		ui.refresh(node);
		node.show();
		// node.style.transform=trans||'';
		lib.listenEnd(node);
		return node;
	}
	throwDice(num) {
		if (typeof num != "number") {
			num = get.rand(6) + 1;
			_status.event.num = num;
		}
		if (!game.online) {
			game.pause();
		}
		game.broadcastAll(function (num) {
			var diceContainer = ui.create.div(".fullsize.dice-container", ui.window);
			ui.window.classList.add("dicepaused");
			var dice = ui.create.div(".dice");
			var side;

			side = ui.create.div(".side.front", dice);
			ui.create.div(".dot.center", side);
			ui.create.div(".side.front.inner", dice);

			side = ui.create.div(".side.top", dice);
			ui.create.div(".dot.dtop.dleft", side);
			ui.create.div(".dot.dbottom.dright", side);
			ui.create.div(".side.top.inner", dice);

			side = ui.create.div(".side.right", dice);
			ui.create.div(".dot.dtop.dleft", side);
			ui.create.div(".dot.center", side);
			ui.create.div(".dot.dbottom.dright", side);
			ui.create.div(".side.right.inner", dice);

			side = ui.create.div(".side.left", dice);
			ui.create.div(".dot.dtop.dleft", side);
			ui.create.div(".dot.dtop.dright", side);
			ui.create.div(".dot.dbottom.dleft", side);
			ui.create.div(".dot.dbottom.dright", side);
			ui.create.div(".side.left.inner", dice);

			side = ui.create.div(".side.bottom", dice);
			ui.create.div(".dot.center", side);
			ui.create.div(".dot.dtop.dleft", side);
			ui.create.div(".dot.dtop.dright", side);
			ui.create.div(".dot.dbottom.dleft", side);
			ui.create.div(".dot.dbottom.dright", side);
			ui.create.div(".side.bottom.inner", dice);

			side = ui.create.div(".side.back", dice);
			ui.create.div(".dot.dtop.dleft", side);
			ui.create.div(".dot.dtop.dright", side);
			ui.create.div(".dot.dbottom.dleft", side);
			ui.create.div(".dot.dbottom.dright", side);
			ui.create.div(".dot.center dleft", side);
			ui.create.div(".dot.center dright", side);
			ui.create.div(".side.back.inner", dice);

			ui.create.div(".side.cover.x", dice);
			ui.create.div(".side.cover.y", dice);
			ui.create.div(".side.cover.z", dice);

			var map = {
				1: [75, 0, 45],
				2: [-15, 45, 0],
				3: [165, -45, 90],
				4: [345, -45, 90],
				5: [345, -45, 180],
				6: [255, 0, 135],
			};
			dice.roll = function (deg) {
				if (typeof deg == "number") {
					dice.current[0] += deg;
					deg = dice.current;
				}
				deg = deg.slice(0);
				dice.current = deg;
				this.style.transform = "rotateX(" + deg[0] + "deg) rotateY(" + deg[1] + "deg) rotateZ(" + deg[2] + "deg)";
			};
			dice.roll(map[num]);
			diceContainer.appendChild(dice);
			ui.refresh(dice);
			dice.roll(1025);

			dice.addEventListener("webkitTransitionEnd", function () {
				if (!dice.over) {
					dice.style.transition = "transform 0.8s ease";
					dice.roll(-20);
					dice.over = true;
				} else if (!dice.resumed) {
					setTimeout(function () {
						diceContainer.delete();
						ui.window.classList.remove("dicepaused");
					}, 300);
					if (!game.online) {
						setTimeout(game.resume, 800);
					}
					dice.resumed = true;
				}
			});
		}, num);
	}
	$giveAuto(card, player) {
		if (Array.isArray(card) && card.length == 0) {
			return;
		}
		var args = Array.from(arguments);
		if (_status.connectMode || (!this.isUnderControl(true) && !player.isUnderControl(true))) {
			if (Array.isArray(card)) {
				card = card.length;
			} else {
				card = 1;
			}
			args[0] = card;
		}
		return this.$give.apply(this, args);
	}
	$give(card, player, log, init, cardsetion) {
		if (!cardsetion && cardsetion !== false && lib.config.card_animation_info) {
			let evt = get.cardsetion(null, true);
			if (evt && evt.player == player) {
				cardsetion = get.cardsetion(player);
			} else {
				cardsetion = get.cardsetion(this);
			}
		}
		if (init !== false) {
			game.broadcast(
				function (source, card, player, init, cardsetion) {
					source.$give(card, player, false, init, cardsetion);
				},
				this,
				card,
				player,
				init,
				cardsetion
			);
			if (typeof card == "number" && card >= 0) {
				game.addVideo("give", this, [card, player.dataset.position]);
			} else {
				if (get.itemtype(card) == "card") {
					card = [card];
				}
				if (get.itemtype(card) == "cards") {
					game.addVideo("giveCard", this, [get.cardsInfo(card), player.dataset.position]);
				}
			}
		}
		if (get.itemtype(card) == "cards") {
			if (log != false && !_status.video) {
				game.log(player, "从", this, "获得了", card);
			}
			if (this.$givemod) {
				this.$givemod(card, player);
			} else {
				for (var i = 0; i < card.length; i++) {
					this.$give(card[i], player, false, false, cardsetion);
				}
			}
		} else if (typeof card == "number" && card >= 0) {
			if (log != false && !_status.video) {
				game.log(player, "从", this, "获得了" + get.cnNumber(card) + "张牌");
			}
			if (this.$givemod) {
				this.$givemod(card, player);
			} else {
				while (card--) {
					this.$give("", player, false, false, cardsetion);
				}
			}
		} else {
			if (log != false && !_status.video) {
				if (get.itemtype(card) == "card" && log != false) {
					game.log(player, "从", this, "获得了", card);
				} else {
					game.log(player, "从", this, "获得了一张牌");
				}
			}
			if (this.$givemod) {
				this.$givemod(card, player);
			} else {
				var node;
				if (get.itemtype(card) == "card") {
					node = card.copy("card", "thrown", false);
					if (cardsetion) {
						var next = ui.create.div(".cardsetion", cardsetion, node);
						if (node.node) {
							if (node.node.cardsetion) {
								node.node.cardsetion.remove();
								delete node.node.cardsetion;
							}
							node.node.cardsetion = next;
						}
					}
				} else {
					node = ui.create.div(".card.thrown");
					if (cardsetion) {
						node.classList.add("infoflip");
						node.classList.add("infohidden");
						let next = ui.create.div(".cardsetion", cardsetion, node);
						next.style.setProperty("display", "block", "important");
						if (node.node) {
							if (node.node.cardsetion) {
								node.node.cardsetion.remove();
								delete node.node.cardsetion;
							}
							node.node.cardsetion = next;
						}
					}
				}
				// node.dataset.position=this.dataset.position;
				node.fixed = true;
				this.$throwordered(node, null, cardsetion);
				// lib.listenEnd(node);
				// node.hide();
				// node.style.transitionProperty='left,top,opacity';
				//
				// node.style.transform='rotate('+(Math.random()*16-8)+'deg)';
				//
				// ui.arena.appendChild(node);
				// ui.refresh(node);
				// node.show();
				// node.style.left='calc(50% - 52px '+((Math.random()-0.5<0)?'+':'-')+' '+Math.random()*100+'px)';
				// node.style.top='calc(50% - 52px '+((Math.random()-0.5<0)?'+':'-')+' '+Math.random()*80+'px)';

				node.listenTransition(function () {
					var dx = player.getLeft() + player.offsetWidth / 2 - 52 - node.offsetLeft;
					var dy = player.getTop() + player.offsetHeight / 2 - 52 - node.offsetTop;
					if (node.style.transform && node.style.transform != "none" && node.style.transform.indexOf("translate") == -1) {
						node.style.transform += " translate(" + dx + "px," + dy + "px)";
					} else {
						node.style.transform = "translate(" + dx + "px," + dy + "px)";
					}

					node.delete();
				});
				// setTimeout(function(){
				// 	// node.removeAttribute('style');
				// 	// node.dataset.position=player.dataset.position;
				// 	var dx=player.offsetLeft+player.offsetWidth/2-52-node.offsetLeft;
				// 	var dy=player.offsetTop+player.offsetHeight/2-52-node.offsetTop;
				// 	if(node.style.transform&&node.style.transform!='none'&&node.style.transform.indexOf('translate')==-1){
				// 		node.style.transform+=' translate('+dx+'px,'+dy+'px)';
				// 	}
				// 	else{
				// 		node.style.transform='translate('+dx+'px,'+dy+'px)';
				// 	}
				//
				// 	node.delete();
				// },700);
			}
		}
	}
	$handleEquipChange() {
		const player = this;
		const cards = Array.from(player.node.equips.childNodes);
		const cardsResume = cards.slice(0);
		const extraEquip = [];
		player.extraEquip.forEach(info => {
			if (player.hiddenSkills.includes(info[0])) {
				return;
			}
			const extra = `${get.translation(info[0])} ${get.translation(info[1])}`;
			const subtype = get.subtype(info[1]);
			let preserve = info[2] && !info[2](player);
			if (!preserve && !extraEquip.map(info => info[1]).includes(info[1])) {
				extraEquip.add([info, extra, subtype]);
			}
		});
		cards.forEach(card => {
			let num = get.equipNum(card);
			let remove = false;
			if (card.name.indexOf("empty_equip") == 0) {
				if ((num == 4 || num == 3) && get.is.mountCombined()) {
					remove = !player.hasEmptySlot("equip3_4") || player.getEquips("equip3_4").length;
				} else if (!player.hasEmptySlot(num) || player.getEquips(num).length) {
					remove = true;
				}
				if (remove) {
					player.node.equips.removeChild(card);
					cardsResume.remove(card);
				}
			}
			if (card.extraEquip && !remove) {
				const info = card.extraEquip,
					disable = card.classList.contains("feichu");
				const extra = extraEquip.find(infox => infox.every(item => info.includes(item)));
				if (!extra) {
					if (disable) {
						card.node.name2.innerHTML = get.translation("equip" + num) + " 已废除";
						delete card.extraEquip;
					} else {
						player.node.equips.removeChild(card);
						cardsResume.remove(card);
					}
				} else {
					extraEquip.remove(extra);
				}
			} else if (card.classList.contains("feichu")) {
				let extra = extraEquip.find(info => info[2].includes("equip" + num));
				if (extra) {
					card.node.name2.innerHTML = extra[1];
					card.extraEquip = extra[0];
					extraEquip.remove(extra);
				}
			}
		});
		for (let i = 1; i <= 5; i++) {
			let add = false;
			if ((i == 4 || i == 3) && get.is.mountCombined()) {
				add = player.hasEmptySlot("equip3_4") && !player.getEquips("equip3_4").length;
			} else {
				add = player.hasEmptySlot(i) && !player.getEquips(i).length;
			}
			if (
				add &&
				!cardsResume.some(card => {
					let num = get.equipNum(card);
					if ((i == 4 || i == 3) && get.is.mountCombined()) {
						return num == 4 || num == 3;
					} else {
						return num == i;
					}
				})
			) {
				const card = game.createCard("empty_equip" + i, "", "");
				card.fix();
				//console.log('add '+card.name);
				card.style.transform = "";
				card.classList.remove("drawinghidden");
				card.classList.add("emptyequip");
				card.classList.add("hidden");
				delete card._transform;
				const equipNum = get.equipNum(card);
				let equipped = false;
				for (let j = 0; j < player.node.equips.childNodes.length; j++) {
					if (get.equipNum(player.node.equips.childNodes[j]) >= equipNum) {
						player.node.equips.insertBefore(card, player.node.equips.childNodes[j]);
						equipped = true;
						break;
					}
				}
				if (!equipped) {
					player.node.equips.appendChild(card);
					if (_status.discarded) {
						_status.discarded.remove(card);
					}
				}
			}
		}
		extraEquip.forEach(info => {
			if (player.hasEmptySlot(info[2])) {
				const card = game.createCard("empty_" + info[2], "", "");
				card.fix();
				//console.log('add '+card.name);
				card.style.transform = "";
				card.classList.remove("drawinghidden");
				card.classList.add("emptyequip");
				card.node.name2.innerHTML = info[1];
				card.extraEquip = info[0];
				delete card._transform;
				const equipNum = get.equipNum(card);
				let equipped = false;
				for (let j = 0; j < player.node.equips.childNodes.length; j++) {
					const node = player.node.equips.childNodes[j];
					if (get.equipNum(node) == info[2].at(-1) && info && node.classList.contains("emptyequip") && !node.extraEquip) {
						node.node.name2.innerHTML = info[1];
						node.extraEquip = info[0];
						node.classList.remove("hidden");
						equipped = true;
						break;
					}
					if (get.equipNum(node) >= equipNum) {
						player.node.equips.insertBefore(card, node);
						equipped = true;
						break;
					}
				}
				if (!equipped) {
					player.node.equips.appendChild(card);
					if (_status.discarded) {
						_status.discarded.remove(card);
					}
				}
			}
		});
	}
	addVirtualJudge(card, cards) {
		let cardx;
		if (get.itemtype(card) == "card" && card.isViewAsCard) {
			cardx = card[card.cardSymbol];
		} else {
			cardx = card;
		}
		cardx.initID();
		const player = this;
		game.broadcast(
			(player, card, cards) => {
				player.addVirtualJudge(card, cards);
			},
			player,
			card,
			cards
		);
		game.addVideo("addVirtualJudge", player, [get.vcardInfo(cardx), get.cardsInfo(cards)]);
		player.vcardsMap?.judges.push(cardx);
		if (_status.discarded) {
			_status.discarded.removeArray(cards);
		}
		player.$addVirtualJudge(card, cards);
		//game.addVideo("addVirtualJudge", ???);
		if (cardx.storage.equipEnable && (cardx.cards || cards).some(card => get.type(card) == "equip")) {
			const equips = (cardx.cards || cards).filter(card => get.type(card) == "equip");
			if (equips.length) {
				let skills = get.skillsFromEquips(equips);
				if (skills.length) {
					player.addSkill(skills);
				}
			}
			game.addGlobalSkill("equipEnableSkill");
		}
	}
	$addVirtualJudge(VCard, cards) {
		if (game.online) {
			return;
		}
		const player = this,
			card = VCard;
		const isViewAsCard = cards.length !== 1 || cards[0].name !== VCard.name || !card.isCard,
			info = get.info(VCard, false);
		let cardx;
		if (get.itemtype(card) == "card" && card.isViewAsCard) {
			cardx = card;
		} else {
			cardx = isViewAsCard
				? game.createCard(card.name, cards.length == 1 ? get.suit(cards[0]) : "none", cards.length == 1 ? get.number(cards[0]) : 0)
				: cards[0];
		}
		game.broadcastAll(
			(player, cardx, isViewAsCard, VCard, cards) => {
				cardx.fix();
				if (!cardx.isViewAsCard) {
					const cardSymbol = Symbol("card");
					cardx.cardSymbol = cardSymbol;
					cardx[cardSymbol] = VCard;
				}
				cardx.style.transform = "";
				cardx.classList.remove("drawinghidden");
				delete cardx._transform;
				if (isViewAsCard && !cardx.isViewAsCard) {
					cardx.isViewAsCard = true;
					cardx.destroyLog = false;
					for (let i of cards) {
						i.goto(ui.special);
						i.destiny = player.node.judges;
					}
					if (cardx.destroyed) {
						cardx._destroyed_Virtua = cardx.destroyed;
					}
					cardx.destroyed = function (card, id, player, event) {
						if (card._destroyed_Virtua) {
							if (typeof card._destroyed_Virtua == "function") {
								let bool = card._destroyed_Virtua(card, id, player, event);
								if (bool === true) {
									return true;
								}
							} else if (lib.skill[card._destroyed_Virtua]) {
								if (player) {
									if (player.hasSkill(card._destroyed_Virtua)) {
										delete card._destroyed_Virtua;
										return false;
									}
								}
								return true;
							} else if (typeof card._destroyed_Virtua == "string") {
								return card._destroyed_Virtua == id;
							} else if (card._destroyed_Virtua === true) {
								return true;
							}
						}
						if (id == "ordering" && ["phaseJudge", "executeDelayCardEffect"].includes(event.getParent().name)) {
							return false;
						}
						if (id != "judge") {
							return true;
						}
					};
				}
				const suit = get.translation(cardx.suit),
					number = get.strNumber(cardx.number);
				cardx.classList.add("drawinghidden");
				if (isViewAsCard) {
					cardx.cards = cards || [];
					cardx.viewAs = VCard.name;
					//cardx.node.name2.innerHTML = `${suit}${number} [${get.translation(VCard.name)}]`;
					if (cardx.classList.contains("fullskin") || cardx.classList.contains("fullborder") || cardx.classList.contains("fullimage")) {
						cardx.classList.add("fakejudge");
						if (cardx.classList.contains("fullimage")) {
							cardx.classList.remove("fullimage");
							cardx.classList.add("fullskin");
							cardx.style.backgroundImage = "";
						}
						cardx.node.background.innerHTML = lib.translate[cardx.viewAs + "_bg"] || get.translation(cardx.viewAs)[0];
					}
				} else {
					delete cardx.viewAs;
					//cardx.node.name2.innerHTML = `${suit}${number} ${VCard.name}`;
					cardx.classList.remove("fakejudge");
				}
				player.node.judges.insertBefore(cardx, player.node.judges.firstChild);
				ui.updatej(player);
			},
			player,
			cardx,
			isViewAsCard,
			VCard,
			cards
		);
	}
	addVirtualEquip(card, cards) {
		let cardx;
		if (get.itemtype(card) == "card" && card.isViewAsCard) {
			cardx = card[card.cardSymbol];
		} else {
			cardx = card;
		}
		cardx.initID();
		const player = this;
		game.broadcast(
			(player, card, cards) => {
				player.addVirtualEquip(card, cards);
			},
			player,
			card,
			cards
		);
		game.addVideo("addVirtualEquip", player, [get.vcardInfo(cardx), get.cardsInfo(cards)]);
		player.vcardsMap?.equips.push(cardx);
		player.vcardsMap?.equips.sort((a, b) => {
			return get.equipNum(a) - get.equipNum(b);
		});
		player.$addVirtualEquip(card, cards);
		player.addEquipTrigger(card);
		/*var info = get.info(card, false);
		if (info.skills) {
			for (var i = 0; i < info.skills.length; i++) {
				player.addSkillTrigger(info.skills[i]);
			}
		}*/
	}
	$addVirtualEquip(card, cards) {
		if (game.online) {
			return;
		}
		const player = this;
		const isViewAsCard = cards.length !== 1 || cards[0].name !== card.name || !card.isCard,
			info = get.info(card, false);
		let cardShownName = get.translation(card.name);
		if (info.subtype === "equip3") {
			cardShownName += "+";
		} else if (info.subtype === "equip4") {
			cardShownName += "-";
		}
		let cardx;
		if (get.itemtype(card) == "card" && card.isViewAsCard) {
			cardx = card;
		} else {
			cardx = isViewAsCard
				? game.createCard(card.name, cards.length == 1 ? get.suit(cards[0]) : "none", cards.length == 1 ? get.number(cards[0]) : 0)
				: cards[0];
		}
		game.broadcastAll(
			(player, cardx, isViewAsCard, card, cards, cardShownName) => {
				cardx.fix();
				if (!cardx.isViewAsCard) {
					const cardSymbol = Symbol("card");
					cardx.cardSymbol = cardSymbol;
					cardx[cardSymbol] = card;
				}
				if (card.subtypes) {
					cardx.subtypes = card.subtypes;
				}
				cardx.style.transform = "";
				cardx.classList.remove("drawinghidden");
				delete cardx._transform;
				if (isViewAsCard && !cardx.isViewAsCard) {
					cardx.isViewAsCard = true;
					cardx.destroyLog = false;
					for (let i of cards) {
						i.goto(ui.special);
						i.destiny = player.node.equips;
					}
					if (cardx.destroyed) {
						cardx._destroyed_Virtua = cardx.destroyed;
					}
					cardx.destroyed = function (card, id, player, event) {
						if (card._destroyed_Virtua) {
							if (typeof card._destroyed_Virtua == "function") {
								let bool = card._destroyed_Virtua(card, id, player, event);
								if (bool === true) {
									return true;
								}
							} else if (lib.skill[card._destroyed_Virtua]) {
								if (player) {
									if (player.hasSkill(card._destroyed_Virtua)) {
										delete card._destroyed_Virtua;
										return false;
									}
								}
								return true;
							} else if (typeof card._destroyed_Virtua == "string") {
								return card._destroyed_Virtua == id;
							} else if (card._destroyed_Virtua === true) {
								return true;
							}
						}
						if (id != "equip") {
							return true;
						}
					};
				}
				const suit = get.translation(cardx.suit),
					number = get.strNumber(cardx.number);
				if (isViewAsCard) {
					cardx.cards = cards || [];
					cardx.viewAs = card.name;
					cardx.node.name2.innerHTML = `${suit}${number} [${cardShownName}]`;
					cardx.classList.add("fakeequip");
				} else {
					delete cardx.viewAs;
					cardx.node.name2.innerHTML = `${suit}${number} ${cardShownName}`;
					cardx.classList.remove("fakeequip");
				}
				let equipped = false,
					equipNum = get.equipNum(cardx);
				if (player.node.equips.childNodes.length) {
					for (let i = 0; i < player.node.equips.childNodes.length; i++) {
						if (get.equipNum(player.node.equips.childNodes[i]) >= equipNum) {
							equipped = true;
							player.node.equips.insertBefore(cardx, player.node.equips.childNodes[i]);
							break;
						}
					}
				}
				if (equipped === false) {
					player.node.equips.appendChild(cardx);
					if (cards?.length && _status.discarded) {
						_status.discarded.removeArray(cards);
					}
				}
			},
			player,
			cardx,
			isViewAsCard,
			card,
			cards,
			cardShownName
		);
	}
	$equip(card) {
		game.broadcast(
			function (player, card) {
				player.$equip(card);
			},
			this,
			card
		);
		card.fix();
		card.style.transform = "";
		card.classList.remove("drawinghidden");
		delete card._transform;
		var player = this;
		var equipNum = get.equipNum(card);
		var equipped = false;
		for (var i = 0; i < player.node.equips.childNodes.length; i++) {
			if (get.equipNum(player.node.equips.childNodes[i]) >= equipNum) {
				player.node.equips.insertBefore(card, player.node.equips.childNodes[i]);
				equipped = true;
				break;
			}
		}
		if (!equipped) {
			player.node.equips.appendChild(card);
			if (_status.discarded) {
				_status.discarded.remove(card);
			}
		}
		var info = get.info(card);
		if (info.skills) {
			for (var i = 0; i < info.skills.length; i++) {
				player.addSkillTrigger(info.skills[i]);
			}
		}
		return player;
	}
	$gain(card, log, init, cardsetion) {
		if (!cardsetion && cardsetion !== false && lib.config.card_animation_info) {
			cardsetion = get.cardsetion(this);
		}
		if (init !== false) {
			game.broadcast(
				function (player, card, init) {
					player.$gain(card, false, init, cardsetion);
				},
				this,
				card,
				init,
				cardsetion
			);
			if (typeof card == "number" && card >= 0) {
				game.addVideo("gain", this, card);
			} else {
				if (get.itemtype(card) == "card") {
					card = [card];
				}
				if (get.itemtype(card) == "cards") {
					game.addVideo("gainCard", this, get.cardsInfo(card));
				} else {
					game.addVideo("gain", this, 1);
				}
			}
		}
		if (get.itemtype(card) == "cards") {
			if (log != false && !_status.video) {
				game.log(this, "获得了", card);
			}
			if (this.$gainmod) {
				this.$gainmod(card);
			} else {
				for (var i = 0; i < card.length; i++) {
					this.$gain(card[i], false, false);
				}
			}
		} else if (typeof card == "number" && card > 1) {
			if (log != false && !_status.video) {
				game.log(this, "获得了" + get.cnNumber(card) + "张牌");
			}
			if (this.$gainmod) {
				this.$gainmod(card);
			} else {
				for (var i = 0; i < card; i++) {
					this.$gain(1, false, false);
				}
			}
		} else {
			if (get.itemtype(card) == "card" && log != false && !_status.video) {
				game.log(this, "获得了", card);
			}
			if (this.$gainmod) {
				this.$gainmod(card);
			} else {
				var node;
				if (get.itemtype(card) == "card") {
					node = card.copy("thrown", false);
				} else {
					node = ui.create.div(".card.thrown");
					node.moveTo = lib.element.Card.prototype.moveTo;
					node.moveDelete = lib.element.Card.prototype.moveDelete;
				}
				if (cardsetion) {
					var next = ui.create.div(".cardsetion", cardsetion, node);
					next.style.setProperty("display", "block", "important");
					if (node.node) {
						if (node.node.cardsetion) {
							node.node.cardsetion.remove();
							delete node.node.cardsetion;
						}
						node.node.cardsetion = next;
					}
				}
				node.fixed = true;
				node.style.left = "calc(50% - 52px " + (Math.random() - 0.5 < 0 ? "+" : "-") + " " + Math.random() * 100 + "px)";
				node.style.top = "calc(50% - 52px " + (Math.random() - 0.5 < 0 ? "+" : "-") + " " + Math.random() * 100 + "px)";
				node.style.transform = "scale(0)";
				node.hide();
				ui.arena.appendChild(node);
				ui.refresh(node);
				node.show();
				node.style.transform = "";

				lib.listenEnd(node);
				var player = this;
				setTimeout(function () {
					node.moveDelete(player);
				}, 700);
			}
		}
	}
	$gain2(cards, log, cardsetion) {
		if (!cardsetion && cardsetion !== false && lib.config.card_animation_info) {
			cardsetion = get.cardsetion(this);
		}
		if (log === true) {
			game.log(this, "获得了", cards);
		}
		game.broadcast(
			function (player, cards, cardsetion) {
				player.$gain2(cards, null, cardsetion);
			},
			this,
			cards,
			cardsetion
		);
		if (get.itemtype(cards) == "card") {
			cards = [cards];
		} else if (get.itemtype(cards) != "cards") {
			return;
		}
		var list = [],
			list2 = [];
		for (var i = 0; i < cards.length; i++) {
			if (
				cards[i].clone &&
				(cards[i].clone.parentNode == this.parentNode || cards[i].clone.parentNode == ui.arena) &&
				parseFloat(getComputedStyle(cards[i].clone).opacity) > 0.3
			) {
				var next = ui.create.div(".cardsetion", cardsetion, cards[i].clone);
				next.style.setProperty("display", "block", "important");
				if (cards[i].clone.node) {
					if (cards[i].clone.node.cardsetion) {
						cards[i].clone.node.cardsetion.remove();
						delete cards[i].clone.node.cardsetion;
					}
					cards[i].clone.node.cardsetion = next;
				}
				cards[i].clone.moveDelete(this);
				list2.push(cards[i].clone);
			} else {
				list.push(cards[i]);
			}
		}
		if (list2.length) {
			game.addVideo("gain2", this, get.cardsInfo(list2));
		}
		if (list.length) {
			this.$draw(list, "nobroadcast", null, cardsetion);
			return true;
		}
	}
	$skill(name, type, color, avatar) {
		if (typeof type != "string") {
			type = "legend";
		}
		if (!avatar) {
			this.playerfocus(1500);
			game.delay(2);
		} else {
			game.addVideo("playerfocus2");
			game.broadcastAll(function () {
				ui.arena.classList.add("playerfocus");
				setTimeout(function () {
					ui.arena.classList.remove("playerfocus");
				}, 1800);
			});
			game.delay(3);
		}
		var that = this;
		setTimeout(
			function () {
				game.broadcastAll(
					function (that, type, name, color, avatar) {
						if (lib.config.animation && !lib.config.low_performance) {
							if (game.chess) {
								that["$" + type + "2"](1200);
							} else {
								that["$" + type](1200);
							}
						}
						if (name) {
							that.$fullscreenpop(name, color, avatar);
						}
					},
					that,
					type,
					name,
					color,
					avatar
				);
			},
			avatar ? 0 : 300
		);
	}
	$fire() {
		game.addVideo("flame", this, "fire");
		var left, top;
		if (game.chess) {
			var rect = this.getBoundingClientRect();
			left = rect.left;
			top = rect.top;
		} else {
			left = this.getLeft();
			top = this.getTop();
		}
		game.animate.flame(left + this.offsetWidth / 2, top + this.offsetHeight - 20, 700, "fire");
	}
	$thunder() {
		game.addVideo("flame", this, "thunder");
		var left, top;
		if (game.chess) {
			var rect = this.getBoundingClientRect();
			left = rect.left;
			top = rect.top;
		} else {
			left = this.getLeft();
			top = this.getTop();
		}
		game.animate.flame(left + this.offsetWidth / 2, top + this.offsetHeight - 30, 700, "thunder");
	}
	$rare2() {
		game.addVideo("flame", this, "rare2");
		var rect = this.getBoundingClientRect();
		var left = rect.left;
		var top = rect.top + 15;
		game.animate.flame(left + this.offsetWidth / 2, top + this.offsetHeight - 30, 700, "rare");
	}
	$epic2() {
		game.addVideo("flame", this, "epic2");
		var rect = this.getBoundingClientRect();
		var left = rect.left;
		var top = rect.top + 15;
		game.animate.flame(left + this.offsetWidth / 2, top + this.offsetHeight - 30, 700, "epic");
	}
	$legend2() {
		game.addVideo("flame", this, "legend2");
		var rect = this.getBoundingClientRect();
		var left = rect.left;
		var top = rect.top + 15;
		game.animate.flame(left + this.offsetWidth / 2, top + this.offsetHeight - 30, 700, "legend");
	}
	$rare(time) {
		time = time || 700;
		game.addVideo("flame", this, "rare");
		var left, top;
		if (game.chess) {
			left = this.getLeft() - ui.arena.offsetLeft;
			top = this.getTop() - ui.arena.offsetTop;
		} else {
			left = this.getLeft();
			top = this.getTop();
		}
		if (this.classList.contains("minskin")) {
			top += 15;
		}
		game.animate.flame(left + this.offsetWidth / 2, top + this.offsetHeight - 30, time, "rare");
	}
	$epic(time) {
		time = time || 700;
		game.addVideo("flame", this, "epic");
		var left, top;
		if (game.chess) {
			left = this.getLeft() - ui.arena.offsetLeft;
			top = this.getTop() - ui.arena.offsetTop;
		} else {
			left = this.getLeft();
			top = this.getTop();
		}
		if (this.classList.contains("minskin")) {
			top += 15;
		}
		game.animate.flame(left + this.offsetWidth / 2, top + this.offsetHeight - 30, time, "epic");
	}
	$legend(time) {
		time = time || 700;
		game.addVideo("flame", this, "legend");
		var left, top;
		if (game.chess) {
			left = this.getLeft() - ui.arena.offsetLeft;
			top = this.getTop() - ui.arena.offsetTop;
		} else {
			left = this.getLeft();
			top = this.getTop();
		}
		if (this.classList.contains("minskin")) {
			top += 15;
		}
		game.animate.flame(left + this.offsetWidth / 2, top + this.offsetHeight - 30, time, "legend");
	}
	$coin() {
		game.broadcast(function (player) {
			if (!lib.config.low_performance) {
				player.$coin();
			}
		}, this);
		game.addVideo("flame", this, "coin");
		var left = this.getLeft() - ui.arena.offsetLeft;
		var top = this.getTop() - ui.arena.offsetTop;
		if (this.classList.contains("minskin")) {
			top += 15;
		}
		top -= 25;
		game.animate.flame(left + this.offsetWidth / 2, top + this.offsetHeight - 30, 700, "coin");
	}
	$dust() {
		game.broadcast(function (player) {
			if (!lib.config.low_performance) {
				player.$dust();
			}
		}, this);
		game.addVideo("flame", this, "dust");
		var left = this.getLeft() - ui.arena.offsetLeft;
		var top = this.getTop() - ui.arena.offsetTop;
		if (this.classList.contains("minskin")) {
			top += 15;
		}
		top -= 25;
		game.animate.flame(left + this.offsetWidth / 2, top + this.offsetHeight - 30, 700, "dust");
	}
	$recover() {
		game.addVideo("flame", this, "recover");
		var left, top;
		if (game.chess) {
			var rect = this.getBoundingClientRect();
			left = rect.left;
			top = rect.top;
		} else {
			left = this.getLeft();
			top = this.getTop();
		}
		game.animate.flame(left + this.offsetWidth / 2, top + this.offsetHeight - 30, 700, "recover");
	}
	/**
	 * @param {*} str
	 * @param {*} [nature]
	 * @param {*} [avatar]
	 * @param { false } [broadcast]
	 */
	$fullscreenpop(str, nature, avatar, broadcast) {
		if (broadcast !== false) {
			game.broadcast(
				function (player, str, nature, avatar) {
					player.$fullscreenpop(str, nature, avatar);
				},
				this,
				str,
				nature,
				avatar
			);
		}
		game.addVideo("fullscreenpop", this, [str, nature, avatar]);
		var node = ui.create.div(".damage");
		if (avatar && this.node) {
			if (avatar == "vice") {
				if (lib.character[this.name2]) {
					avatar = this.node.avatar2;
				}
			} else {
				if (lib.character[this.name]) {
					avatar = this.node.avatar;
				}
			}
			if (!get.is.div(avatar)) {
				avatar = false;
			}
		} else {
			avatar = false;
		}
		if (avatar) {
			node.classList.add("fullscreenavatar");
			ui.create.div("", ui.create.div(node));
			// ui.create.div('',str.split('').join('<br>'),ui.create.div('.text.textbg',node));
			ui.create.div("", "<div>" + str.split("").join("</div><br><div>") + "</div>", ui.create.div(".text", node));
			node.firstChild.firstChild.style.backgroundImage = avatar.style.backgroundImage;
			node.dataset.nature = nature || "unknown";
			var num = 0;
			var nodes = node.lastChild.firstChild.querySelectorAll("div");
			var interval = setInterval(function () {
				if (num < nodes.length) {
					nodes[num].classList.add("flashtext");
					num++;
				} else {
					clearInterval(interval);
				}
			}, 100);
		} else {
			avatar = false;
			node.innerHTML = str;
			node.dataset.nature = nature || "soil";
		}
		if (avatar) {
			var rect1 = ui.window.getBoundingClientRect();
			var rect2 = this.getBoundingClientRect();
			var dx = Math.round(2 * rect2.left + rect2.width - rect1.width);
			var dy = Math.round(2 * rect2.top + rect2.height - rect1.height);
			node.style.transform = "scale(0.5) translate(" + dx + "px," + dy + "px)";
		}
		ui.window.appendChild(node);
		ui.refresh(node);
		if (avatar) {
			node.style.transform = "scale(1)";
			node.style.opacity = 1;
		} else {
			node.classList.add("damageadded");
		}
		setTimeout(
			function () {
				node.delete();
				node.style.transform = "scale(1.5)";
			},
			avatar ? 1600 : 1000
		);
	}
	/**
	 *
	 * @param { number | string } num
	 * @param { string } [nature]
	 * @param { boolean } [font]
	 * @param { boolean } [nobroadcast]
	 */
	$damagepop(num, nature = "soil", font, nobroadcast) {
		if (typeof num == "number" || typeof num == "string") {
			game.addVideo("damagepop", this, [num, nature, font]);
			if (nobroadcast !== false) {
				game.broadcast(
					function (player, num, nature, font) {
						player.$damagepop(num, nature, font);
					},
					this,
					num,
					nature,
					font
				);
			}
			var node = ui.create.div(".damage");
			if (font) {
				node.classList.add("normal-font");
			}
			if (typeof num == "number" && num > 0) {
				if (num == Infinity) {
					num = "+∞";
				} else {
					num = "+" + num;
				}
			} else if (num == -Infinity) {
				num = "-∞";
			}
			node.innerHTML = num;
			this.damagepopups.push(node);
			node.dataset.nature = nature || "soil";
			if (this.damagepopups.length == 1) {
				this.$damagepop();
			}
		} else if (this.damagepopups.length) {
			var node = this.damagepopups[0];
			this.appendChild(node);
			ui.refresh(node);
			node.classList.add("damageadded");
			node.listenTransition(function () {
				setTimeout(function () {
					node.delete();
				}, 200);
			});
			// setTimeout(function(){
			// 	node.delete();
			// },500);
			var that = this;
			setTimeout(function () {
				that.damagepopups.shift();
				that.$damagepop();
			}, 500);
		}
	}
	$damage(source) {
		if (get.itemtype(source) == "player") {
			game.addVideo("damage", this, source.dataset.position);
		} else {
			game.addVideo("damage", this);
		}
		game.broadcast(
			function (player, source) {
				player.$damage(source);
			},
			this,
			source
		);
		if (source && source != this && lib.config.damage_shake) {
			var left, top;
			if (source.getTop() == this.getTop()) {
				left = 20;
				top = 0;
			} else {
				var ratio = (source.getLeft() - this.getLeft()) / (source.getTop() - this.getTop());
				left = Math.abs((20 * ratio) / Math.sqrt(1 + ratio * ratio));
				top = Math.abs(20 / Math.sqrt(1 + ratio * ratio));
			}
			if (source.getLeft() - this.getLeft() > 0) {
				left = -left;
			}
			if (source.getTop() - this.getTop() > 0) {
				top = -top;
			}
			if (get.is.mobileMe(this)) {
				if (this.classList.contains("linked")) {
					this.node.avatar.style.transform = "translate(" + left + "px," + top + "px) rotate(-90deg)";
					this.node.avatar2.style.transform = "translate(" + left + "px," + top + "px) rotate(-90deg)";
				} else {
					this.node.avatar.style.transform = "translate(" + left + "px," + top + "px)";
					this.node.avatar2.style.transform = "translate(" + left + "px," + top + "px)";
				}
			} else if (this.classList.contains("linked") && get.is.newLayout()) {
				this.style.transform = "translate(" + left + "px," + top + "px) rotate(-90deg)";
			} else if (this._chesstransform) {
				this.style.transform = "translate(" + (left + this._chesstransform[0]) + "px," + (top + this._chesstransform[1]) + "px)";
			} else {
				this.style.transform = "translate(" + left + "px," + top + "px)";
			}
		} else {
			var zoom1 = 0.9,
				zoom2 = 0.95;
			if (arguments[1] == "phase") {
				zoom1 = 1.05;
				zoom2 = 1.05;
			}
			if (get.is.mobileMe(this)) {
				if (this.classList.contains("linked")) {
					this.node.avatar.style.transform = "scale(" + zoom1 + ") rotate(-90deg)";
					this.node.avatar2.style.transform = "scale(" + zoom1 + ") rotate(-90deg)";
				} else {
					this.node.avatar.style.transform = "scale(" + zoom1 + ")";
					this.node.avatar2.style.transform = "scale(" + zoom1 + ")";
				}
			} else if (this.classList.contains("linked") && get.is.newLayout()) {
				this.style.transform = "scale(" + zoom2 + ") rotate(-90deg)";
			} else if (game.chess && this._chesstransform) {
				this.style.transform = "translate(" + this._chesstransform[0] + "px," + this._chesstransform[1] + "px) scale(" + zoom2 + ")";
			} else {
				this.style.transform = "scale(" + zoom2 + ")";
			}
		}
		this.queue();
	}
	$die() {
		game.addVideo("die", this);
		game.broadcast(function (player) {
			player.$die();
		}, this);
		if (lib.config.die_move != "off") {
			this.$dieflip(lib.config.die_move);
		}
		if (this.$dieAfter) {
			this.$dieAfter();
		}
	}
	$dieflip(type) {
		var top0 = ui.window.offsetHeight / 2;
		var left0 = ui.window.offsetWidth / 2;
		var ratio = (left0 - this.getLeft()) / (top0 - this.getTop());
		var left = Math.abs((50 * ratio) / Math.sqrt(1 + ratio * ratio));
		var top = Math.abs(50 / Math.sqrt(1 + ratio * ratio));
		if (left0 - this.getLeft() > 0) {
			left = -left;
		}
		if (top0 - this.getTop() > 0) {
			top = -top;
		}
		if (get.is.mobileMe(this)) {
			left = -Math.random() * 5 - 10;
			top = Math.random() * 5 + 10;
		}
		if (this._chesstransform) {
			left += this._chesstransform[0];
			top += this._chesstransform[1];
		}
		var transform = "translate(" + left + "px," + top + "px) " + "rotate(" + (Math.random() * 20 - 10) + "deg) ";
		if (type == "flip") {
			if (game.layout == "long" || game.layout == "long2") {
				transform += "rotateY(180deg)";
			} else {
				transform += Math.random() - 0.5 < 0 ? "rotateX(180deg)" : "rotateY(180deg)";
			}
		}
		if (get.is.mobileMe(this)) {
			this.node.avatar.style.transform = transform;
			this.node.avatar2.style.transform = transform;
			this.style.transform = "";
		} else {
			this.node.avatar.style.transform = "";
			this.node.avatar2.style.transform = "";
			this.style.transform = transform;
		}
		this.queue(false);
	}
	$phaseJudge(card) {
		game.addVideo("phaseJudge", this, get.cardInfo(card));
		const player = this;
		if (card[card.cardSymbol]?.cards?.length) {
			const cards = card[card.cardSymbol].cards;
			const clone = player.$throw(cards);
			if (lib.config.low_performance && cards[0] && cards[0].clone) {
				const waitingForTransition = get.time();
				_status.waitingForTransition = waitingForTransition;
				cards[0].clone.listenTransition(function () {
					if (_status.waitingForTransition == waitingForTransition && _status.paused) {
						game.resume();
					}
				});
				game.pause();
			} else {
				game.delay();
			}
		} else {
			const VCard = game.createCard(card.name, "虚拟", "");
			const clone = player.$throw(VCard);
			if (lib.config.low_performance && VCard && VCard.clone) {
				const waitingForTransition = get.time();
				_status.waitingForTransition = waitingForTransition;
				VCard.clone.listenTransition(function () {
					if (_status.waitingForTransition == waitingForTransition && _status.paused) {
						game.resume();
					}
				});
				game.pause();
			} else {
				game.delay();
			}
		}
	}
}

CacheContext.inject(Player.prototype, [
	"hasCard",
	"hasValueTarget",
	"getModableSkills",
	"getCardIndex",
	"countCards",
	"getSkills",
	"getUseValue",
	"canUse",
]);
