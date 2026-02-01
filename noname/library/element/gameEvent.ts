import { _status, game, get, lib, ui } from "noname";
import { Player } from "./index.js";
import ContentCompiler from "./GameEvent/compilers/ContentCompiler.js";
import { EventCompileable, EventCompiledContent } from "./GameEvent/compilers/IContentCompiler.js";
import GameEventManager from "./GameEvent/GameEventManager.js";
export { GameEventManager, ContentCompiler };

type triggerSkillTodo = {
	skill: string;
	player: Player;
	priority: number;
	indexedData?: Player | true;
};
type triggerPlayerTodo = {
	player: Player | "firstDo" | "lastDo";
	todoList: triggerSkillTodo[];
	doneList: triggerSkillTodo[];
};
export class GameEvent implements PromiseLike<void> {
	constructor(name: string = "", trigger: boolean = true, manager: GameEventManager = _status.eventManager) {
		//@ts-ignore
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

	name: string;
	[key: string]: any;

	// #region 事件传参与content
	_args: any[] = [];
	_set: [string, any][] = [];
	set(key: string, value: any) {
		if (Array.isArray(key)) {
			for (let i = 0; i < key.length; i++) {
				if (Array.isArray(key[i])) {
					this.set(key[i][0], key[i][1]);
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
	content: EventCompiledContent;
	setContent(content: EventCompileable) {
		if (this.#inContent) {
			throw new Error("Cannot set content when content is running");
		}
		this.content = ContentCompiler.compile(content);
		return this;
	}
	// #endregion

	// #region promise & result
	/**
	 * 事件的返回值
	 */
	result: Partial<Result>;
	cost_data: Result["cost_data"];
	/**
	 * Attaches callbacks for the resolution and/or rejection of the Promise.
	 * @param onfulfilled The callback to execute when the Promise is resolved.
	 * @param onrejected The callback to execute when the Promise is rejected.
	 * @returns A Promise for the completion of which ever callback is executed.
	 */
	then<TResult1, TResult2>(onfulfilled?: (() => TResult1 | Promise<TResult1>) | null, onrejected?: ((reason: any) => TResult2 | Promise<TResult2>) | null): Promise<TResult1 | TResult2> {
		return (this.parent ? this.parent.waitNext().then(() => undefined) : this.start()).then(onfulfilled, onrejected);
	}
	/**
	 * Attaches a callback for only the rejection of the Promise.
	 * @param onrejected The callback to execute when the Promise is rejected.
	 * @returns A Promise for the completion of which ever callback is executed.
	 */
	catch<TResult>(onrejected?: ((reason: any) => TResult | Promise<TResult>) | null): Promise<TResult> {
		return this.then(void 0, onrejected);
	}
	/**
	 * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
	 * resolved value cannot be modified from the callback.
	 * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
	 * @returns A Promise for the completion of the callback.
	 */
	finally(onfinally?: (() => void) | null): Promise<void> {
		return this.then(
			() => {
				if (onfinally) {
					onfinally();
				}
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
	 * 获取 Result 对象中的信息。
	 * @example
	 * ```js
	 * const chooseCardResult = await player.chooseCard().forResult();
	 * // 获取整个结果对象，然后访问如 chooseCardResult.cards 等属性
	 * ```
	 */
	async forResult(): Promise<Partial<Result>> {
		await this;
		return this.result;
	}
	// #endregion

	// #region 事件之间的关系
	manager: GameEventManager;
	parent?: GameEvent;
	childEvents: GameEvent[] = [];
	/**
	 * 获取事件的父节点。
	 * 获取事件链上的指定事件。
	 * 默认获取上一个父节点（核心）。
	 * @param level 获取深度（number）/指定名字（string）/指定特征（function）
	 * @param forced 若获取不到节点，默认返回{}，若forced为true则返回undefined
	 * @param includeSelf 若level不是数字，指定搜索时是否包含事件本身
	 */
	getParent(level?: number, forced?: boolean): GameEvent | undefined;
	getParent(level: string, forced?: boolean, includeSelf?: boolean): GameEvent | undefined;
	getParent(level: (evt: GameEvent) => boolean, forced?: boolean, includeSelf?: boolean): GameEvent | undefined;
	getParent(level: number | string | ((evt: GameEvent) => boolean) = 1, forced?: boolean, includeSelf?: boolean): GameEvent | undefined {
		let event: GameEvent | undefined = this;
		let i = 0;
		const toreturn = forced ? undefined : ({} as GameEvent);
		const historys: GameEvent[] = [];
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
	next: GameEvent[] = (() => {
		const event = this;
		return new Proxy<GameEvent[]>([], {
			set(target, p, childEvent, receiver) {
				if (childEvent instanceof GameEvent && !target.includes(childEvent)) {
					childEvent.parent = event;
					const type = childEvent.getDefaultNextHandlerType();
					if (type) {
						//@ts-ignore
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
	after: GameEvent[] = [];
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
	_trigger: GameEvent;
	triggername: string;
	getTrigger() {
		return this.getParent(e => e._trigger, false, true)._trigger;
	}
	// #endregion

	// #region 事件内部流程
	_triggered: number | null = null;
	#start?: Promise<void>;
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
		const trigger = async (trigger: string, to: number) => {
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
					let next = this.content(this).catch(error => {
						if (lib.config.ignore_error || (_status.connectMode && !lib.config.debug)) {
							game.print("游戏出错：" + this.name);
							game.print(error.toString());
							console.error(error);
						} else {
							throw error;
						}
					});
					await next.finally(() => (this.#inContent = false));
				}
			} else {
				if (this._triggered === 1) {
					await trigger("Omitted", 4);
				} else if (this._triggered === 2) {
					await trigger("End", 3);
				} else if (this._triggered === 3) {
					await trigger("After", 4);
				} else if (this.after.length) {
					this.next.push(this.after.shift()!);
				} else {
					return;
				}
			}
		}
	}
	async checkSkipped(): Promise<boolean> {
		if (!this.player || (!this.player.skipList.includes(this.name) && !this.isSkipped)) {
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
	#waitNext?: Promise<Partial<Result> | void>;
	waitNext(): Promise<Partial<Result> | void> {
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
		})().finally(() => (this.#waitNext = undefined));
		return this.#waitNext;
	}
	// #endregion

	// #region trigger
	doingList: triggerPlayerTodo[];
	/**
	 * 当前执行的arrangeTrigger事件
	 */
	_triggering?: GameEvent;
	filterStop?: (this: this) => boolean;
	addTrigger(skills, player) {
		if (!player || !skills) {
			return this;
		}
		let evt: GameEvent = this;
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
				let toadds: triggerSkillTodo[] = [];
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
	trigger(name: string): GameEvent {
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
		if (!lib.hookmap[name]) {
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
		const firstDo: triggerPlayerTodo = {
			player: "firstDo",
			todoList: [],
			doneList: [],
		};
		const lastDo: triggerPlayerTodo = {
			player: "lastDo",
			todoList: [],
			doneList: [],
		};
		const doingList: triggerPlayerTodo[] = [];
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
					if (typeof this.player == "string") {
						list.sort((a, b) => b.priority - a.priority || playerMap.indexOf(a.player) - playerMap.indexOf(b.player));
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
							};
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

			roles.forEach(role => {
				doing.addList(lib.hook.globalskill[role + "_" + name]);
				doing.addList(lib.hook[player.playerid + "_" + role + "_" + name]);
			});
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
	// @todo 奇怪的参数
	untrigger(all = true, player?: Player) {
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
	notrigger: boolean;
	_notrigger: Player[] = [];
	// #endregion

	// #region 事件中断
	/**
	 * content执行中的标志，如果inContent && finished则不执行子事件
	 */
	#inContent = false;
	finished = false;
	finish() {
		this.finished = true;
	}
	// @todo 奇怪的参数
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
	// @todo
	_neutralized = false;
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
	// #endregion

	// #region step @todo
	#step: number = 0;
	#nextStep: number | null = null;
	/**
	 * 最后一个子事件的result
	 */
	_result: Partial<Result> = {};
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
	goto(step: number) {
		this.step = step;
		return this;
	}
	redo() {
		this.goto(this.step);
		return this;
	}
	// #endregion

	// #region chooseToUse @todo
	custom: {
		add: Record<string, () => void>;
		replace: Record<string, () => void>;
	} = {
		add: {},
		replace: {},
	};
	backup(skill) {
		this._backup = {
			filterButton: this.filterButton,
			selectButton: this.selectButton,
			filterTarget: this.filterTarget,
			selectTarget: this.selectTarget,
			deadTarget: this.deadTarget,
			chessForceAll: this.chessForceAll,
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
			const info = get.info(skill);
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
				if (info.deadTarget != undefined) {
					this.deadTarget = info.deadTarget;
				}
				if (info.chessForceAll != undefined) {
					this.chessForceAll = info.chessForceAll;
				}
				if (info.filterCard != undefined) {
					if (info.ignoreMod) {
						this.ignoreMod = true;
					}
					this.filterCard2 = get.filter(info.filterCard);
					this.filterCard = function (card, player, event) {
						const evt = event || _status.event;
						if (!evt.ignoreMod && player) {
							const mod = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
							if (mod != "unchanged") {
								return mod;
							}
						}
						/*if (evt.ignoreMod) {
							console.log(card);
							card.cards = [];
						}*/
						return get.filter(evt.filterCard2).apply(this, [card, player, event]);
					};
				}
				this.filterOk = function () {
					const evt = _status.event;
					const card = get.card(),
						player = get.player();
					const filter = evt._backup.filterCard;
					if (info.viewAs && filter && !filter(card, player, evt)) {
						//typeof info.viewAs !== "function" &&
						return false;
					}
					if (info.filterOk != undefined) {
						return info.filterOk();
					}
					if (evt._backup.filterOk) {
						return evt._backup.filterOk();
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
				this.deadTarget = info.deadTarget;
				this.chessForceAll = info.chessForceAll;
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
			this.deadTarget = this._backup.deadTarget;
			this.chessForceAll = this._backup.chessForceAll;
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
	// #endregion

	type: string;
	source: Player;
	player: Player;
	players: Player[];
	target: Player;
	targets: Player[];
	card: VCard;
	cards: Card[];
	skill: string;

	forced: boolean;
	num: number;
	original_num: number;
	directHit: boolean = false;
	baseDamage: number;
	extraDamage: number;
	customSource: Player;
	nature: string;
	unreal: boolean;
	responded: boolean;
	judgestr?: string;
	judging: boolean;
	judge2?: (...args: any) => any;
	orderingCards: Card[];
	ai?: (...args: any) => any;
	_aiexclude: string[] = [];
	forceDie: boolean;
	includeOut: boolean;
	targetprompt2: ((...args: any) => any)[] = [];

	changeToZero() {
		this.num = 0;
		this.numFixed = true;
		return this;
	}
	setHiddenSkill(skill: string) {
		if (!this.player) {
			return this;
		}
		const hidden = this.player.hiddenSkills.slice(0);
		game.expandSkills(hidden);
		if (hidden.includes(skill)) {
			this.set("hsskill", skill);
		}
		return this;
	}
	getLogv() {
		for (let i = 1; i <= 3; i++) {
			const event = this.getParent(i);
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
				const next = game.me[name].apply(game.me, args);
				for (let i = 0; i < set.length; i++) {
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

	getRand(name?: string) {
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
		const evt = this.getParent("phaseUse");
		if (!evt || evt.name != "phaseUse") {
			return false;
		}
		return !player || player == evt.player;
	}

	// #region cache @todo
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
		// eslint-disable-next-line prefer-rest-params
		return typeof type == "string" ? this.getHandler(type).push(...Array.from(arguments).slice(1)) : this.getHandler().push(...arguments);
	}
	// #endregion

	// #region cache @todo
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
		const cacheKey = "[" + prefix + "]" + get.paramToCacheKey.apply(null, params);
		let ret = this.getStepCache(cacheKey);
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
	// #endregion

	// #region @todo 待删除验证
	_oncancel?: (...args: any) => any;
	excludeButton: Button[];
	resume() {
		delete this._buttonChoice;
		delete this._cardChoice;
		delete this._targetChoice;
		delete this._skillChoice;
		return this;
	}
	// #endregion
}
