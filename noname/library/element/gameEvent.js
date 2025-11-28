import { _status, game, get, lib, ui } from "noname";
import { Player } from "./index.js";
import security from "@/util/security.js";
import ContentCompiler from "./GameEvent/compilers/ContentCompiler.ts";
import GameEventManager from "./GameEvent/GameEventManager.ts";
export { GameEventManager, ContentCompiler };

/**
 * @implements { PromiseLike<Omit<GameEvent,"then">> }
 */
export class GameEvent {
	/**
	 * @param { string | GameEvent } [name]
	 * @param { boolean } [trigger]
	 * @param { GameEventManager } [manager]
	 */
	constructor(name = "", trigger = true, manager = _status.eventManager) {
		if (name instanceof GameEvent) {
			const other = name;
			name = other.name;
			manager = other.manager;
			trigger = other._triggered !== null;
		}

		this.name = name;
		this.manager = manager;
		if (trigger && !game.online) {
			this._triggered = 0;
		}
		game.globalEventHandlers.addHandlerToEvent(this);
	}
	static initialGameEvent() {
		const event = new GameEvent();
		event.finish();
		return event;
	}
	get [Symbol.toStringTag]() {
		return "GameEvent";
	}
	/**
	 * @type { Partial<Result> }
	 */
	result;
	/**
	 * @type { string }
	 */
	name;
	/**
	 * @type { string }
	 */
	type;
	/**
	 * @type { Player }
	 */
	source;
	/**
	 * @type { Player }
	 */
	player;
	/**
	 * @type { Player[] }
	 */
	players;
	/**
	 * @type { Player }
	 */
	target;
	/**
	 * @type { Player[] }
	 */
	targets;
	/**
	 * @type { Card }
	 */
	card;
	/**
	 * @type { Card[] }
	 */
	cards;
	/**
	 * @type { string }
	 */
	skill;
	/**
	 * @type { boolean }
	 */
	forced;
	/**
	 * @type { number }
	 */
	num;
	/**
	 * @type { number }
	 */
	original_num;
	/**
	 * @type { GameEvent }
	 */
	_trigger;
	/**
	 * @type { string }
	 */
	triggername;
	/**
	 * @type { boolean }
	 */
	notrigger;
	/**
	 * @type { Player[] }
	 */
	_notrigger = [];
	/**
	 * @type { Result }
	 */
	// @ts-expect-error ignore
	_result = {};
	/**
	 * @type { any[] }
	 */
	_args = [];
	/**
	 * @type { [string, any][] }
	 */
	_set = [];
	/**
	 * @type { {
	 *  add: {[type: string]: () => void}
	 *  replace: {[type :string]: () => void}
	 * } }
	 */
	custom = {
		add: {},
		replace: {},
	};
	/**
	 * @type { boolean }
	 */
	directHit = false;
	/**
	 * @type { number }
	 */
	baseDamage;
	/**
	 * @type { number }
	 */
	extraDamage;
	/**
	 * @type { Player }
	 */
	customSource;
	/**
	 * @type { string }
	 */
	nature;
	/**
	 * @type { boolean }
	 */
	unreal;
	/**
	 * @type { Button[] }
	 */
	excludeButton;
	/**
	 * @type { ((this: this) => boolean) | undefined }
	 */
	filterStop;
	/**
	 * @type { Result['cost_data'] }
	 */
	cost_data;
	/**
	 * @type { boolean }
	 */
	responded;
	/**
	 * @type { string | undefined }
	 */
	judgestr;
	/**
	 * @type { boolean }
	 */
	judging;
	/**
	 * @type { Function | undefined }
	 */
	judge2;
	/**
	 * @type { Card[] }
	 */
	orderingCards;
	/**
	 * @type { Function | undefined }
	 */
	ai;
	/**
	 * @type { string[] }
	 */
	_aiexclude = [];
	/**
	 * @type { boolean }
	 */
	forceDie;
	/**
	 * @type { Function | undefined }
	 */
	_oncancel;
	/**
	 * @type { boolean }
	 */
	includeOut;
	/**
	 * @type { Function[] }
	 */
	targetprompt2 = [];
	/**
	 * @param {keyof this} key
	 * @param {number} [value]
	 * @param {number} [baseValue]
	 */
	addNumber(key, value, baseValue) {
		if (typeof value != "number") {
			value = 0;
		}
		if (typeof this[key] == "number") {
			this[key] += value;
		} else {
			if (typeof baseValue != "number") {
				baseValue = 0;
			}
			this[key] = baseValue + value;
		}
		return this;
	}
	/**
	 * @param {keyof this} key
	 * @param {number} [baseValue]
	 */
	decrease(key, baseValue) {
		if (typeof this[key] == "number") {
			this[key]--;
		} else {
			this.subtractNumber(key, 1, baseValue);
		}
		return this;
	}
	/**
	 * @param {keyof this} key
	 * @param {number} [baseValue]
	 */
	increase(key, baseValue) {
		if (typeof this[key] == "number") {
			this[key]++;
		} else {
			this.addNumber(key, 1, baseValue);
		}
		return this;
	}
	/**
	 * @param {keyof this} key
	 * @param {number} [value]
	 * @param {number} [baseValue]
	 */
	subtractNumber(key, value, baseValue) {
		if (typeof value != "number") {
			value = 0;
		}
		if (typeof this[key] == "number") {
			this[key] -= value;
		} else {
			if (typeof baseValue != "number") {
				baseValue = 0;
			}
			this[key] = baseValue - value;
		}
		return this;
	}
	/**
	 * @param {Parameters<typeof this.hasHandler>[0]} type
	 * @param {GameEvent} event
	 * @param {{
	 * state?: 'begin' | 'end';
	 * }} option
	 * @returns {this}
	 */
	callHandler(type, event, option) {
		if (this.hasHandler(type)) {
			this.getHandler(type).forEach(handler => {
				if (typeof handler == "function") {
					handler(event, option);
				}
			});
		}
		return this;
	}
	getDefaultHandlerType() {
		const eventName = this.name;
		if (eventName) {
			return `on${eventName[0].toUpperCase()}${eventName.slice(1)}`;
		} else {
			return "";
		}
	}
	getDefaultNextHandlerType() {
		const eventName = this.name;
		if (eventName) {
			return `onNext${eventName[0].toUpperCase()}${eventName.slice(1)}`;
		} else {
			return "";
		}
	}
	/**
	 * @param {Parameters<typeof this.hasHandler>[0]} [type]
	 * @returns {((event: GameEvent, option: {
	 * state?: 'begin' | 'end';
	 * }) => void)[]}
	 */
	getHandler(type) {
		if (!type) {
			type = this.getDefaultHandlerType();
		}
		const currentHandler = this[type];
		if (!currentHandler) {
			this[type] = [];
		} else if (!Array.isArray(currentHandler)) {
			this[type] = [currentHandler];
		}
		return this[type];
	}
	/**
	 * @param {`on${Capitalize<string>}`} [type]
	 */
	hasHandler(type) {
		if (!type) {
			type = this.getDefaultHandlerType();
		}
		return Boolean(this[type] && this.getHandler(type).length);
	}
	/**
	 * @overload
	 * @param {...((event: GameEvent, option: {
	 * state?: 'begin' | 'end';
	 * }) => void)[]} handlers
	 * @returns {number}
	 */
	/**
	 * @overload
	 * @param {Parameters<typeof this.hasHandler>[0]} type
	 * @param {...((event: GameEvent, option: {
	 * state?: 'begin' | 'end';
	 * }) => void)[]} handlers
	 * @returns {number}
	 */
	pushHandler(type) {
		return typeof type == "string" ? this.getHandler(type).push(...Array.from(arguments).slice(1)) : this.getHandler().push(...arguments);
	}
	putStepCache(key, value) {
		if (!this._stepCache) {
			this._stepCache = {};
		}
		this._stepCache[key] = value;
		return this;
	}
	getStepCache(key) {
		if (!this._stepCache) {
			return undefined;
		}
		return this._stepCache[key];
	}
	clearStepCache(key) {
		if (key !== undefined && key !== null) {
			delete this._stepCache[key];
		}
		delete this._stepCache;
		return this;
	}
	callFuncUseStepCache(prefix, func, params) {
		if (typeof func != "function") {
			return;
		}
		if (_status.closeStepCache) {
			return func.apply(null, params);
		}
		var cacheKey = "[" + prefix + "]" + get.paramToCacheKey.apply(null, params);
		var ret = this.getStepCache(cacheKey);
		if (ret === undefined || ret === null) {
			ret = func.apply(null, params);
			this.putStepCache(cacheKey, ret);
		}
		return ret;
	}
	putTempCache(key1, key2, value) {
		if (!this._tempCache) {
			this._tempCache = {};
		}
		if (!this._tempCache[key1]) {
			this._tempCache[key1] = {};
		}
		this._tempCache[key1][key2] = value;
		return value;
	}
	getTempCache(key1, key2) {
		if (!this._tempCache) {
			return undefined;
		}
		if (!this._tempCache[key1]) {
			return undefined;
		}
		return this._tempCache[key1][key2];
	}
	changeToZero() {
		this.num = 0;
		this.numFixed = true;
		return this;
	}
	finish() {
		this.finished = true;
	}
	cancel(all, player, notrigger) {
		this.untrigger(all, player);
		let next;
		if (!notrigger) {
			if (this.player && lib.phaseName.includes(this.name)) {
				this.player.getHistory("skipped").add(this.name);
			}
			this._cancelled = true;
			next = this.trigger(this.name + "Cancelled");
		}
		this.finish();
		return next;
	}
	async neutralize(event = _status.event) {
		if (this._neutralized) {
			return this._triggering;
		}
		this._neutralized = true;
		this._neutralize_event = event;
		const next = this.trigger("eventNeutralized");
		if (next) {
			next.filterStop = function () {
				if (!this._neutralized) {
					delete this.filterStop;
					return true;
				}
				return false;
			};
		}
		await next;
		if (this._neutralized == true) {
			this.untrigger();
			this.finish();
		}
	}
	unneutralize() {
		if (!this._neutralized) {
			return;
		}
		this._neutralized = false;
		if (this.type == "card" && this.card && this.name == "sha") {
			this.directHit = true;
		}
	}
	goto(step) {
		this.step = step;
		return this;
	}
	redo() {
		this.goto(this.step);
		return this;
	}
	setHiddenSkill(skill) {
		if (!this.player) {
			return this;
		}
		var hidden = this.player.hiddenSkills.slice(0);
		game.expandSkills(hidden);
		if (hidden.includes(skill)) {
			this.set("hsskill", skill);
		}
		return this;
	}
	set(key, value) {
		if (arguments.length == 1 && Array.isArray(arguments[0])) {
			for (var i = 0; i < arguments[0].length; i++) {
				if (Array.isArray(arguments[0][i])) {
					this.set(arguments[0][i][0], arguments[0][i][1]);
				}
			}
		} else {
			if (typeof key != "string") {
				console.log("warning: using non-string object as event key");
				console.log(key, value);
				console.log(_status.event);
			}
			this[key] = value;
			this._set.push([key, value]);
		}
		return this;
	}
	/**
	 * @param {import("./GameEvent/compilers/IContentCompiler.js").EventCompileable} content
	 */
	setContent(content) {
		if (this.#inContent) {
			throw new Error("Cannot set content when content is running");
		}
		this.content = ContentCompiler.compile(content);
		return this;
	}

	getLogv() {
		for (var i = 1; i <= 3; i++) {
			var event = this.getParent(i);
			if (event && event.logvid) {
				return event.logvid;
			}
		}
		return null;
	}
	send() {
		this.player.send(
			function (name, args, set, event, skills) {
				game.me.applySkills(skills);
				var next = game.me[name].apply(game.me, args);
				for (var i = 0; i < set.length; i++) {
					next.set(set[i][0], set[i][1]);
				}
				if (next._backupevent) {
					next.backup(next._backupevent);
				}
				next._modparent = event;
				game.resume();
			},
			this.name,
			this._args || [],
			this._set,
			get.stringifiedResult(this.parent),
			get.skillState(this.player)
		);
		this.player.wait();
		game.pause();
		return this;
	}

	/**
	 * 在可await/异步情况下获取客机执行的结果
	 */
	sendAsync() {
		return new Promise(resolve => {
			this.send();
			if (!lib.node?.waitForResult || !this.player.playerid) {
				resolve(null);
				return;
			}

			if (!Array.isArray(lib.node.waitForResult[this.player.playerid])) {
				lib.node.waitForResult[this.player.playerid] = [resolve];
			} else {
				lib.node.waitForResult[this.player.playerid].push(resolve);
			}
		});
	}

	resume() {
		delete this._buttonChoice;
		delete this._cardChoice;
		delete this._targetChoice;
		delete this._skillChoice;
		return this;
	}
	/**
	 * 获取事件的父节点。
	 * 获取事件链上的指定事件。
	 * 默认获取上一个父节点（核心）。
	 * @param {number|string|((evt:GameEvent)=>boolean)} [level=1] 获取深度（number）/指定名字（string）/指定特征（function）
	 * @param {boolean} [forced] 若获取不到节点，默认返回{}，若forced为true则返回null
	 * @param {boolean} [includeSelf] 若level不是数字，指定搜索时是否包含事件本身
	 * @returns {GameEvent|{}|null}
	 */
	getParent(level = 1, forced, includeSelf) {
		let event = this;
		let i = 0;
		const toreturn = forced ? null : {};
		const historys = [];
		const filter = typeof level === "function" ? level : typeof level === "number" ? evt => i === level : evt => evt.name === level;
		while (true) {
			if (!event) {
				return toreturn;
			}
			historys.push(event);
			if (filter(event) && (includeSelf || i !== 0)) {
				return event;
			}
			if (game.online && event._modparent) {
				event = event._modparent;
			} else {
				event = event.parent;
			}
			if (historys.includes(event)) {
				return toreturn;
			}
			i++;
		}
	}
	getTrigger() {
		return this.getParent(e => e._trigger, false, true)._trigger;
	}
	getRand(name) {
		if (name) {
			if (!this._rand_map) {
				this._rand_map = {};
			}
			if (!this._rand_map[name]) {
				this._rand_map[name] = Math.random();
			}
			return this._rand_map[name];
		}
		if (!this._rand) {
			this._rand = Math.random();
		}
		return this._rand;
	}
	insert(content, map) {
		const next = new GameEvent(`${this.name}Inserted`, false, this.manager);
		this.next.push(next);
		next.setContent(content);
		Object.entries(map).forEach(entry => next.set(entry[0], entry[1]));
		return next;
	}
	insertAfter(content, map) {
		const next = new GameEvent(`${this.name}Inserted`, false, this.manager);
		this.after.push(next);
		next.setContent(content);
		Object.entries(map).forEach(entry => next.set(entry[0], entry[1]));
		return next;
	}
	backup(skill) {
		this._backup = {
			filterButton: this.filterButton,
			selectButton: this.selectButton,
			filterTarget: this.filterTarget,
			selectTarget: this.selectTarget,
			filterCard: this.filterCard,
			selectCard: this.selectCard,
			position: this.position,
			forced: this.forced,
			fakeforce: this.fakeforce,
			_aiexclude: this._aiexclude,
			allowChooseAll: this.allowChooseAll,
			complexSelect: this.complexSelect,
			complexCard: this.complexCard,
			complexTarget: this.complexTarget,
			_buttonChoice: this._buttonChoice,
			_cardChoice: this._cardChoice,
			_targetChoice: this._targetChoice,
			_skillChoice: this._skillChoice,
			ai1: this.ai1,
			ai2: this.ai2,
			filterOk: this.filterOk,
		};
		if (skill) {
			var info = get.info(skill);
			this.skill = skill;
			this._aiexclude = [];
			if (info.viewAs) {
				if (info.filterButton != undefined) {
					this.filterButton = get.filter(info.filterButton);
				}
				if (info.selectButton != undefined) {
					this.selectButton = info.selectButton;
				}
				if (info.filterTarget != undefined) {
					this.filterTarget = get.filter(info.filterTarget);
				}
				if (info.selectTarget != undefined) {
					this.selectTarget = info.selectTarget;
				}
				if (info.filterCard != undefined) {
					if (info.ignoreMod) {
						this.ignoreMod = true;
					}
					this.filterCard2 = get.filter(info.filterCard);
					this.filterCard = function (card, player, event) {
						var evt = event || _status.event;
						if (!evt.ignoreMod && player) {
							var mod = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
							if (mod != "unchanged") {
								return mod;
							}
						}
						return get.filter(evt.filterCard2).apply(this, arguments);
					};
				}
				this.filterOk = function () {
					var evt = _status.event;
					var card = get.card(),
						player = get.player();
					var filter = evt._backup.filterCard;
					if (typeof info.viewAs !== "function" && filter && !filter(card, player, evt)) {
						return false;
					}
					if (evt._backup.filterOk && !evt._backup.filterOk()) {
						return false;
					}
					if (info.filterOk != undefined) {
						return info.filterOk();
					}
					return true;
				};
				if (info.selectCard != undefined) {
					this.selectCard = info.selectCard;
				}
				if (info.position != undefined) {
					this.position = info.position;
				}
				//if(info.forced!=undefined) this.forced=info.forced;
				if (info.allowChooseAll != undefined) {
					this.allowChooseAll = info.allowChooseAll;
				}
				if (info.complexSelect != undefined) {
					this.complexSelect = info.complexSelect;
				}
				if (info.complexCard != undefined) {
					this.complexCard = info.complexCard;
				}
				if (info.complexTarget != undefined) {
					this.complexTarget = info.complexTarget;
				}
				if (info.ai1 != undefined) {
					this.ai1 = info.ai1;
				}
				if (info.ai2 != undefined) {
					this.ai2 = info.ai2;
				}
			} else {
				this.filterButton = info.filterButton ? get.filter(info.filterButton) : undefined;
				this.selectButton = info.selectButton;
				this.filterTarget = info.filterTarget ? get.filter(info.filterTarget) : undefined;
				this.selectTarget = info.selectTarget;
				this.filterCard = info.filterCard ? get.filter(info.filterCard) : undefined;
				this.selectCard = info.selectCard;
				this.position = info.position;
				//this.forced=info.forced;
				this.allowChooseAll = info.allowChooseAll;
				this.complexSelect = info.complexSelect;
				this.complexCard = info.complexCard;
				this.complexTarget = info.complexTarget;
				if (info.ai1 != undefined) {
					this.ai1 = info.ai1;
				}
				if (info.ai2 != undefined) {
					this.ai2 = info.ai2;
				}
				this.filterOk = info.filterOk;
			}
			delete this.fakeforce;
		}
		delete this._buttonChoice;
		delete this._cardChoice;
		delete this._targetChoice;
		delete this._skillChoice;
		return this;
	}
	restore() {
		if (this._backup) {
			this.filterButton = this._backup.filterButton;
			this.selectButton = this._backup.selectButton;
			this.filterTarget = this._backup.filterTarget;
			this.selectTarget = this._backup.selectTarget;
			this.filterCard = this._backup.filterCard;
			this.selectCard = this._backup.selectCard;
			this.position = this._backup.position;
			this.forced = this._backup.forced;
			this.fakeforce = this._backup.fakeforce;
			this._aiexclude = this._backup._aiexclude;
			this.allowChooseAll = this._backup.allowChooseAll;
			this.complexSelect = this._backup.complexSelect;
			this.complexCard = this._backup.complexCard;
			this.complexTarget = this._backup.complexTarget;
			this.ai1 = this._backup.ai1;
			this.ai2 = this._backup.ai2;
			this._buttonChoice = this._backup._buttonChoice;
			this._cardChoice = this._backup._cardChoice;
			this._targetChoice = this._backup._targetChoice;
			this._skillChoice = this._backup._skillChoice;
			this.filterOk = this._backup.filterOk;
		}
		delete this.skill;
		delete this.ignoreMod;
		delete this.filterCard2;
		return this;
	}
	isMine() {
		return this.player?.isMine();
	}
	isOnline() {
		return this.player?.isOnline();
	}
	notLink() {
		return this.getParent().name != "_lianhuan" && this.getParent().name != "_lianhuan2";
	}
	isPhaseUsing(player) {
		var evt = this.getParent("phaseUse");
		if (!evt || evt.name != "phaseUse") {
			return false;
		}
		return !player || player == evt.player;
	}
	addTrigger(skills, player) {
		if (!player || !skills) {
			return this;
		}
		let evt = this;
		if (typeof skills == "string") {
			skills = [skills];
		}
		//手动addTrigger请自己展开
		//game.expandSkills(skills);
		while (true) {
			evt = evt.getParent("arrangeTrigger");
			if (!evt || evt.name != "arrangeTrigger" || !evt.doingList) {
				return this;
			}
			const doing = evt.doingList.find(i => i.player === player);
			const firstDo = evt.doingList.find(i => i.player === "firstDo");
			const lastDo = evt.doingList.find(i => i.player === "lastDo");

			skills.forEach(skill => {
				const info = lib.skill[skill];
				if (!info.trigger) {
					return;
				}
				if (
					!Object.keys(info.trigger).some(i => {
						if (Array.isArray(info.trigger[i])) {
							return info.trigger[i].includes(evt.triggername);
						}
						return info.trigger[i] === evt.triggername;
					})
				) {
					return;
				}
				let toadds = [];
				if (typeof info.getIndex === "function") {
					const indexedResult = info.getIndex(evt.getTrigger(), player, evt.triggername);
					if (Array.isArray(indexedResult)) {
						indexedResult.forEach(indexedData => {
							toadds.push({
								skill: skill,
								player: player,
								priority: get.priority(skill),
								indexedData,
							});
						});
					} else if (typeof indexedResult === "number" && indexedResult > 0) {
						for (let i = 0; i < indexedResult; i++) {
							toadds.push({
								skill: skill,
								player: player,
								priority: get.priority(skill),
								indexedData: true,
							});
						}
					}
				} else {
					toadds.push({
						skill: skill,
						player: player,
						priority: get.priority(skill),
					});
				}
				const map = info.firstDo ? firstDo : info.lastDo ? lastDo : doing;
				if (!map) {
					return;
				}
				for (const toadd of toadds) {
					if (!toadd.indexedData) {
						if (map.doneList.some(i => i.skill === toadd.skill && i.player === toadd.player)) {
							return;
						}
						if (map.todoList.some(i => i.skill === toadd.skill && i.player === toadd.player)) {
							return;
						}
					}
					map.todoList.add(toadd);
				}
				if (typeof map.player === "string") {
					map.todoList.sort((a, b) => b.priority - a.priority || evt.playerMap.indexOf(a) - evt.playerMap.indexOf(b));
				} else {
					map.todoList.sort((a, b) => b.priority - a.priority);
				}
			});
		}
	}
	removeTrigger(skills, player) {
		if (!player || !skills) {
			return this;
		}
		let evt = this;
		if (typeof skills == "string") {
			skills = [skills];
		}
		game.expandSkills(skills);
		while (true) {
			evt = evt.getParent("arrangeTrigger");
			if (!evt || evt.name != "arrangeTrigger" || !evt.doingList) {
				return this;
			}
			const doing = evt.doingList.find(i => i.player == player);
			const firstDo = evt.doingList.find(i => i.player == "firstDo");
			const lastDo = evt.doingList.find(i => i.player == "lastDo");

			skills.forEach(skill =>
				[doing, firstDo, lastDo].forEach(map => {
					if (!map) {
						return;
					}
					const toremove = map.todoList.filter(i => i.skill == skill && i.player == player);
					if (toremove.length > 0) {
						map.todoList.removeArray(toremove);
					}
				})
			);
		}
	}
	/**
	 *
	 * @param { string } name
	 * @returns { GameEvent }
	 */
	trigger(name) {
		if (_status.video) {
			return;
		}
		if (!_status.gameDrawed && ["lose", "gain", "loseAsync", "equip", "addJudge", "addToExpansion"].includes(this.name)) {
			return;
		}
		if (name === "gameDrawEnd") {
			_status.gameDrawed = true;
		}
		if (name === "gameStart") {
			lib.announce.publish("Noname.Game.Event.GameStart", {});
			lib.announce.publish("gameStart", {});
			if (_status.brawl && _status.brawl.gameStart) {
				_status.brawl.gameStart();
			}
			if (lib.config.show_cardpile) {
				ui.cardPileButton.style.display = "";
			}
			if (lib.config.show_commonCardpile) {
				ui.commonCardPileButton.style.display = "";
			}
			_status.gameStarted = true;
			game.showHistory();
		}
		if (!lib.hookmap[name] && !lib.config.compatiblemode) {
			return;
		}
		if (!game.players || !game.players.length) {
			return;
		}
		const event = this;
		if (event.filterStop && event.filterStop()) {
			return;
		}
		let start = [_status.currentPhase, event.source, event.player, game.me, game.players[0]].find(i => get.itemtype(i) == "player");
		if (!start) {
			return;
		}
		if (!game.players.includes(start) && !game.dead.includes(start)) {
			start = game.findNext(start);
		}
		const firstDo = {
			player: "firstDo",
			todoList: [],
			doneList: [],
		};
		const lastDo = {
			player: "lastDo",
			todoList: [],
			doneList: [],
		};
		const doingList = [];
		const roles = ["player", "source", "target", "global"],
			map = lib.relatedTrigger,
			names = Object.keys(map);
		const playerMap = game.players.concat(game.dead).sortBySeat(start);
		let player = start;
		let allbool = false;
		do {
			const doing = {
				player: player,
				todoList: [],
				doneList: [],
				listAdded: {},
				addList(skill) {
					if (!skill) {
						return;
					}
					if (Array.isArray(skill)) {
						return skill.forEach(i => this.addList(i));
					}
					if (this.listAdded[skill]) {
						return;
					}
					this.listAdded[skill] = true;

					const info = lib.skill[skill];
					const list = info.firstDo ? firstDo.todoList : info.lastDo ? lastDo.todoList : this.todoList;
					if (typeof info.getIndex === "function") {
						const indexedResult = info.getIndex(event, player, name);
						if (Array.isArray(indexedResult)) {
							indexedResult.forEach(indexedData => {
								list.push({
									skill: skill,
									player: this.player,
									priority: get.priority(skill),
									indexedData,
								});
							});
						} else if (typeof indexedResult === "number" && indexedResult > 0) {
							for (let i = 0; i < indexedResult; i++) {
								list.push({
									skill: skill,
									player: this.player,
									priority: get.priority(skill),
									indexedData: true,
								});
							}
						}
					} else {
						list.push({
							skill: skill,
							player: this.player,
							priority: get.priority(skill),
						});
					}
					if (typeof list.player == "string") {
						list.sort((a, b) => b.priority - a.priority || playerMap.indexOf(a) - playerMap.indexOf(b));
					} else {
						list.sort((a, b) => b.priority - a.priority);
					}
					allbool = true;
				},
			};

			const notemp = player.skills.slice();
			for (const j in player.additionalSkills) {
				if (!j.startsWith("hidden:")) {
					notemp.addArray(player.additionalSkills[j]);
				}
			}
			Object.keys(player.tempSkills)
				.filter(skill => {
					if (notemp.includes(skill)) {
						return false;
					}
					const expire = player.tempSkills[skill];
					if (typeof expire === "function") {
						return expire(event, player, name);
					}
					if (get.objtype(expire) === "object") {
						return roles.some(role => {
							if (role !== "global" && player !== event[role]) {
								return false;
							}
							const checkTrigger = trigger => {
								if (trigger == name) {
									return true;
								}
								const evt = names.find(evt => trigger?.startsWith(evt));
								if (!evt) {
									return false;
								}
								return map[evt].some(rawTrigger => {
									return `${rawTrigger}${trigger.slice(evt.length)}` == name;
								});
							}
							if (Array.isArray(expire[role])) {
								return expire[role].length && expire[role].some(checkTrigger);
							}
							return checkTrigger(expire[role]);
						});
					}
				})
				.forEach(skill => {
					delete player.tempSkills[skill];
					player.removeSkill(skill);
				});

			if (lib.config.compatiblemode) {
				const map = lib.relatedTrigger,
					names = Object.keys(map);
				doing.addList(
					game.expandSkills(player.getSkills("invisible").concat(lib.skill.global)).filter(skill => {
						const info = get.info(skill);
						if (!info || !info.trigger) {
							return false;
						}
						return roles.some(role => {
							const list = [];
							if (typeof info.trigger[role] == "string") {
								list.add(info.trigger[role]);
							} else if (Array.isArray(info.trigger[role])) {
								list.addArray(info.trigger[role]);
							}
							if (list.includes(name)) {
								return true;
							}
							for (const trigger of list.slice()) {
								for (const name of names) {
									if (trigger.startsWith(name)) {
										list.addArray(map[name].map(i => i + trigger.slice(name.length)));
									}
								}
							}
							return list.includes(name);
							/*if (info.trigger[role] === name) {
								return true;
							}
							if (Array.isArray(info.trigger[role]) && info.trigger[role].includes(name)) {
								return true;
							}*/
						});
					})
				);
			} else {
				roles.forEach(role => {
					doing.addList(lib.hook.globalskill[role + "_" + name]);
					doing.addList(lib.hook[player.playerid + "_" + role + "_" + name]);
				});
			}
			delete doing.listAdded;
			delete doing.addList;
			doingList.push(doing);
			player = player.nextSeat;
		} while (player && player !== start);
		doingList.unshift(firstDo);
		doingList.push(lastDo);
		// console.log(name,event.player,doingList.map(i=>({player:i.player,todoList:i.todoList.slice(),doneList:i.doneList.slice()})))

		if (allbool) {
			const next = game.createEvent("arrangeTrigger", false, event);
			next.setContent("arrangeTrigger");
			next.doingList = doingList;
			next._trigger = event;
			next.triggername = name;
			next.playerMap = playerMap;
			event._triggering = next;
			next.then(() => (event._triggering = void 0));
			return next;
		}
		return null;
	}
	untrigger(all = true, player) {
		if (all) {
			if (all !== "currentOnly") {
				this._triggered = 5;
			}
			if (this._triggering) {
				this._triggering.finish();
			}
		} else if (player) {
			this._notrigger.add(player);
		}
		return this;
	}
	/**
	 * @deprecated
	 */
	toPromise() {
		return this;
	}
	/**
	 * @deprecated
	 */
	toEvent() {
		return this;
	}

	/**
	 * @type { GameEventManager }
	 */
	manager;
	/**
	 * @type { import("./GameEvent/compilers/IContentCompiler.js").EventCompiledContent }
	 */
	content;
	/**
	 * content执行中的标志，如果inContent && finished则不执行子事件
	 * @type { boolean }
	 */
	#inContent = false;
	/**
	 * @type { GameEvent | void | null }
	 */
	parent;
	/**
	 * @type { GameEvent[] }
	 */
	childEvents = [];
	/**
	 * @type { boolean }
	 */
	finished = false;
	/**
	 * @type { boolean }
	 */
	_neutralized = false;
	/**
	 * @type { number | null }
	 */
	_triggered = null;
	/**
	 * @type { GameEvent | undefined }
	 */
	_triggering;
	/**
	 * @type { number }
	 */
	#step = 0;
	/**
	 * @type { number | null }
	 */
	#nextStep = null;
	get step() {
		return this.#step;
	}
	set step(num) {
		this.#nextStep = num;
	}
	updateStep() {
		if (this.#nextStep === null) {
			return;
		}
		this.#step = this.#nextStep;
		this.#nextStep = null;
	}

	/**
	 * @type { GameEvent[] }
	 */
	next = (() => {
		const event = this;
		return new Proxy([], {
			set(target, p, childEvent, receiver) {
				// @ts-expect-error ignore
				if (childEvent instanceof GameEvent && !target.includes(childEvent)) {
					childEvent.parent = event;
					const type = childEvent.getDefaultNextHandlerType();
					// @ts-expect-error ignore
					if (type) {
						childEvent.pushHandler(...event.getHandler(type));
					}
					if (event.#inContent && event.finished) {
						childEvent.resolve();
					}
				}
				return Reflect.set(target, p, childEvent);
			},
		});
	})();
	/**
	 * @type { GameEvent[] }
	 */
	after = [];
	/**
	 * @template TResult1
	 * @template TResult2
	 * Attaches callbacks for the resolution and/or rejection of the Promise.
	 * @param { ((event: Omit<GameEvent,"then">) => TResult1 | Promise<TResult1>) | null } [onfulfilled] The callback to execute when the Promise is resolved.
	 * @param { ((reason: any) => TResult2 | Promise<TResult2>) | null } [onrejected] The callback to execute when the Promise is rejected.
	 * @returns { Promise<TResult1 | TResult2> } A Promise for the completion of which ever callback is executed.
	 */
	then(onfulfilled, onrejected) {
		return (this.parent ? this.parent.waitNext() : this.start()).then(
			onfulfilled
				? () => {
					return onfulfilled(
						new Proxy(this, {
							get(target, p, receiver) {
								if (p === "then") {
									return void 0;
								}
								return Reflect.get(target, p, receiver);
							},
						})
					);
				}
				: onfulfilled,
			onrejected
		);
	}
	/**
	 * @template TResult
	 * Attaches a callback for only the rejection of the Promise.
	 * @param onrejected The callback to execute when the Promise is rejected.* @param { ((reason: any) => TResult | Promise<TResult>) | null } [onrejected] The callback to execute when the Promise is rejected.
	 * @returns { Promise<Omit<GameEvent,"then"> | TResult> } A Promise for the completion of which ever callback is executed.
	 */
	catch(onrejected) {
		return this.then(void 0, onrejected);
	}
	/**
	 * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
	 * resolved value cannot be modified from the callback.
	 * @param { (() => void) | null } [onfinally] The callback to execute when the Promise is settled (fulfilled or rejected).
	 * @returns { Promise<Omit<GameEvent,"then">> } A Promise for the completion of the callback.
	 */
	finally(onfinally) {
		return this.then(
			result => {
				if (onfinally) {
					onfinally();
				}
				return result;
			},
			err => {
				if (onfinally) {
					onfinally();
				}
				throw err;
			}
		);
	}
	/**
	 * @type { Promise<void> | null }
	 */
	#start = null;
	resolve() {
		if (!this.#start) {
			this.#start = Promise.resolve();
		}
	}
	start() {
		if (this.#start) {
			return this.#start;
		}
		this.#start = (async () => {
			if (this.parent) {
				this.parent.childEvents.push(this);
			}
			game.getGlobalHistory("everything").push(this);
			// if (this.manager.eventStack.length === 0) {
			// 	this.manager.rootEvent = this;
			// }
			// this.manager.eventStack.push(this);
			this.manager.setStatusEvent(this, true);
			await this.loop().then(() => {
				// this.manager.eventStack.pop();
				this.manager.popStatusEvent();
			});
		})();
		return this.#start;
	}
	async loop() {
		const trigger = async (trigger, to) => {
			this._triggered = to;
			if (this.type == "card") {
				await this.trigger("useCardTo" + trigger);
			}
			await this.trigger(this.name + trigger);
		};
		if (await this.checkSkipped()) {
			return;
		}
		while (true) {
			await this.waitNext();
			if (!this.finished) {
				if (this._triggered === 0) {
					await trigger("Before", 1);
				} else if (this._triggered === 1) {
					await trigger("Begin", 2);
				} else {
					this.#inContent = true;
					let next = this.content(this);
					if (_status.withError || (_status.connectMode && !lib.config.debug)) {
						next = next.catch(error => {
							game.print("游戏出错：" + this.name);
							game.print(error.toString());
							console.error(error);
						});
					}
					await next.finally(() => (this.#inContent = false));
				}
			} else {
				if (this._triggered === 1) {
					await trigger("Omitted", 4);
				} else if (this._triggered === 2) {
					await trigger("End", 3);
				} else if (this._triggered === 3) {
					await trigger("After", 4);
				}
				// @ts-expect-error ignore
				else if (this.after.length) {
					this.next.push(this.after.shift());
				} else {
					return;
				}
			}
		}
	}

	async checkSkipped() {
		if (!this.player || !this.player.skipList.includes(this.name) && !this.isSkipped) {
			return false;
		}
		this.player.skipList.remove(this.name);
		if (lib.phaseName.includes(this.name)) {
			this.player.getHistory("skipped").add(this.name);
		}
		this.finish();
		await this.trigger(this.name + "Skipped");
		return true;
	}

	/**
	 * @type { Promise<Result | void> | null }
	 */
	#waitNext = null;
	waitNext() {
		if (this.#waitNext) {
			return this.#waitNext;
		}
		this.#waitNext = (async () => {
			let result;
			while (true) {
				await _status.pauseManager.waitPause();
				if (this.manager.tempEvent) {
					if (this.manager.tempEvent === this) {
						this.manager.tempEvent = void 0;
					} else {
						this.cancel(true, null, "notrigger");
						return result;
					}
				}
				if (!this.next.length) {
					return result;
				}
				const next = this.next[0];
				await next.start();
				if (next.result) {
					result = next.result;
				}
				this.next.shift();
			}
		})().finally(() => (this.#waitNext = null));
		return this.#waitNext;
	}
	/**
	 * 获取 Result 对象中的信息。
	 * @example 
	 * ```js
	// 示例 1：
	const chooseCardResult = await player.chooseCard().forResult();
	// 获取整个结果对象，然后访问如 chooseCardResult.cards 等属性
	
	// 示例 2：
	const cards = await player.chooseCard().forResult('cards');
	// 获取结果对象中 'cards' 属性的值
	
	// 示例 3：
	const [success, cards, targets] = await player.chooseCardTarget().forResult('bool', 'cards', 'targets');
	// 获取结果对象中多个属性的值
	// - success 表示是否成功
	// - cards 表示选择的卡片
	// - targets 表示选择的目标
	```
	 * @template {keyof Result} T
	 * @this GameEvent
	 * @overload
	 * @returns {Promise<Partial<Result>>}
	 * 
	 * @overload
	 * @param {T} param0
	 * @returns {Promise<Exclude<Result[T], undefined>>}
	 * 
	 * @overload
	 * @param { T[] } params
	 * @returns { Promise<Exclude<Result[T], undefined>[]> }
	 */
	async forResult(...params) {
		await this;
		if (params.length == 0) {
			return this.result;
		}
		if (params.length == 1) {
			return this.result[params[0]];
		}
		return Array.from(params).map(key => this.result[key]);
	}
	/**
	 * 返回result中的bool项
	 */
	forResultBool() {
		return this.forResult("bool");
	}

	/**
	 * 返回result中的targets项。
	 */
	forResultTargets() {
		return this.forResult("targets");
	}

	/**
	 * 返回result中的cards项
	 */
	forResultCards() {
		return this.forResult("cards");
	}

	/**
	 * 返回result中的card项
	 *
	 * @returns {Promise<VCard>|Promise<Card>} 返回的card项。
	 *
	 */
	forResultCard() {
		return this.forResult("card");
	}

	/**
	 * 返回result中的control项。
	 */
	forResultControl() {
		return this.forResult("control");
	}

	/**
	 * 返回result中的links项。
	 */
	forResultLinks() {
		return this.forResult("links");
	}

	/**
	 * 在某个异步事件中调试变量信息
	 *
	 * 注: 在调试步骤中`定义的变量只在当前输入的语句有效`
	 *
	 * @example
	 * 在技能中调试技能content相关的信息
	 * ```js
	 * await event.debugger();
	 * ```
	 * 在技能中调试触发此技能事件的相关的信息
	 * ```js
	 * await trigger.debugger();
	 * ```
	 */
	async debugger() {
		if (!lib.config.dev) {
			return;
		}
		if (security.isSandboxRequired()) {
			throw new Error("当前模式下禁止调试");
		}
		const runCode = function (event, code) {
			try {
				// 为了使玩家调试时使用var player=xxx时不报错，故使用var
				// var { player, _trigger: trigger, _result: result } = event;
				var context = {
					event,
					player: event.player,
					trigger: event._trigger,
					result: event._result,
				};
				return security.exec(`return ${code}`, context);
			} catch (error) {
				return error;
			}
		}.bind(window);

		const input = async () => {
			const result = await game.promises.prompt("debugger调试");

			if (result === false) {
				return false;
			}

			const obj = runCode(this, result);
			alert(!obj || obj instanceof Error ? String(obj) : get.stringify(obj));
			return true;
		};

		let result = true;
		while (result) {
			result = await input();
		}
	}
}
