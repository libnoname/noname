
import { lib, game, get, _status, ui, ai } from "noname";
import ContentCompiler from "@/library/element/GameEvent/compilers/ContentCompiler";
import ContentCompilerBase from "@/library/element/GameEvent/compilers/ContentCompilerBase";
import { GeneratorFunction, AsyncFunction } from "@/util/index.js";
import { security } from "@/util/sandbox";
import dedent from "dedent";

// 改为HTMLDivElement.prototype.addTempClass
HTMLDivElement.prototype.animate = function (keyframes, options) {
	if (typeof keyframes == "string") {
		console.trace(this, "无名杀开发者修改的animate方法已废弃，请改为使用addTempClass方法");
		return HTMLDivElement.prototype.addTempClass.call(this, keyframes, options);
	} else {
		return HTMLElement.prototype.animate.call(this, keyframes, options);
	}
};

/*处理lib.nature等从array改为map的兼容性问题*/
{
	const mapHasFunc = function (item) {
		console.trace(this, "已经从array改为map，请改为使用has方法");
		return this.has(item);
	};
	Object.defineProperty(Map.prototype, "contains", {
		configurable: true,
		enumerable: false,
		writable: true,
		value: mapHasFunc,
	});
	Object.defineProperty(Map.prototype, "includes", {
		configurable: true,
		enumerable: false,
		writable: true,
		value: mapHasFunc,
	});
	const mapAddFunc = function (item) {
		console.trace(this, "已经从array改为map，请改为使用set方法");
		this.set(item, 0);
		return this;
	};
	Object.defineProperty(Map.prototype, "add", {
		configurable: true,
		enumerable: false,
		writable: true,
		value: mapAddFunc,
	});
	Object.defineProperty(Map.prototype, "push", {
		configurable: true,
		enumerable: false,
		writable: true,
		value: mapAddFunc,
	});
	Object.defineProperty(Map.prototype, "addArray", {
		configurable: true,
		enumerable: false,
		writable: true,
		/**
		 * @this Map
		 * @template T
		 * @template U
		 * @param { T[] } arr
		 * @returns { Map<T, U> }
		 */
		value(arr) {
			console.trace(this, "已经从array改为map，请改为使用set方法");
			for (let i = 0; i < arr.length; i++) {
				this.set(arr[i], 0);
			}
			return this;
		},
	});
	Object.defineProperty(Map.prototype, "remove", {
		configurable: true,
		enumerable: false,
		writable: true,
		/**
		 * @this Map
		 * @template T
		 * @template U
		 * @param { T } item
		 * @returns { Map<T, U> }
		 */
		value(item) {
			console.trace(this, "已经从array改为map，请改为使用delete方法");
			this.delete(item);
			return this;
		},
	});
}

// addNumber
Object.assign(lib.element.GameEvent.prototype, {
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
	},
	decrease(key, baseValue) {
		if (typeof this[key] == "number") {
			this[key]--;
		} else {
			this.subtractNumber(key, 1, baseValue);
		}
		return this;
	},
	increase(key, baseValue) {
		if (typeof this[key] == "number") {
			this[key]++;
		} else {
			this.addNumber(key, 1, baseValue);
		}
		return this;
	},
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
	},
});

// forResult
Object.assign(lib.element.GameEvent.prototype, {
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
	},
	async forResult(...params) {
		await this;
		if (params.length == 0) {
			return this.result;
		}
		if (params.length == 1) {
			return this.result[params[0]];
		}
		return Array.from(params).map(key => this.result[key]);
	},
	forResultBool() {
		return this.forResult().then(r => r.bool);
	},
	forResultTargets() {
		return this.forResult().then(r => r.targets);
	},
	forResultCards() {
		return this.forResult().then(r => r.cards);
	},
	forResultCard() {
		return this.forResult().then(r => r.card);
	},
	forResultControl() {
		return this.forResult().then(r => r.control);
	},
	forResultLinks() {
		return this.forResult().then(r => r.links);
	},
});

// get.event("xxx")
get.event = function (key) {
	if (key) {
		console.warn(`get.event("${key}")写法即将被废弃，请更改为get.event().${key}`);
		return _status.event[key];
	}
	return _status.event;
};

// asyncDelay
{
	game.asyncDelay = game.delay;
	game.asyncDelayx = game.delayx;
}

// jsForExtension
lib.init.jsForExtension = function (path, file, onLoad, onError) {
	if (!_status.javaScriptExtensions) {
		_status.javaScriptExtensions = [];
	}
	_status.javaScriptExtensions.push({
		path: path,
		file: file,
		onLoad: onLoad,
		onError: onError,
	});
};

// generator content (function*)
{
	const GameEvent = lib.element.GameEvent;
	ContentCompiler.addCompiler(
		new (class YieldCompiler extends ContentCompilerBase {
			type = "yield";
			static #mapArgs(event) {
				const { step, source, target, targets, card, cards, skill, forced, num, _result, _trigger, player } = event;

				return {
					event,
					step,
					source,
					player,
					target,
					targets,
					card,
					cards,
					skill,
					forced,
					num,
					trigger: _trigger,
					result: _result,
					_status,
					lib,
					game,
					ui,
					get,
					ai,
				};
			}

			filter(content) {
				return typeof content === "function" && content instanceof GeneratorFunction;
			}

			compile(content) {
				const compiler = this;
				const middleware = async function (event) {
					const args = YieldCompiler.#mapArgs(event);
					const generator =
						// @ts-expect-error ignore
						Reflect.apply(content, this, [event, args]);

					let result = null;
					let done = false;

					while (!done) {
						let value = null;

						if (!compiler.isPrevented(event)) {
							({ value, done = true } = generator.next(result));
							if (done) {
								break;
							}
							result = await (value instanceof GameEvent ? value.forResult() : value);
						}

						const nextResult = await event.waitNext();
						event._result = result ?? nextResult ?? event._result;
					}

					generator.return();
				};

				return ContentCompiler.compile([middleware]);
			}
		})()
	);
}

// player.get/num
{
	Object.assign(lib.element.Player.prototype, {
		get(arg1, arg2, arg3, arg4) {
			var i, j;
			if (arg1 == "s") {
				var skills = this.skills.slice(0);
				var es = [];
				if (arg3 !== false) {
					for (i = 0; i < this.node.equips.childElementCount; i++) {
						if (!this.node.equips.childNodes[i].classList.contains("removing") && !this.node.equips.childNodes[i].classList.contains("feichu") && !this.node.equips.childNodes[i].classList.contains("emptyequip")) {
							var equipskills = get.info(this.node.equips.childNodes[i]).skills;
							if (equipskills) {
								es.addArray(equipskills);
							}
						}
					}
					if (arg2 == "e") {
						return es;
					}
				}
				for (var i in this.additionalSkills) {
					if (Array.isArray(this.additionalSkills[i])) {
						for (j = 0; j < this.additionalSkills[i].length; j++) {
							if (this.additionalSkills[i][j]) {
								skills.add(this.additionalSkills[i][j]);
							}
						}
					} else if (this.additionalSkills[i] && typeof this.additionalSkills[i] == "string") {
						skills.add(this.additionalSkills[i]);
					}
				}
				for (var i in this.tempSkills) {
					skills.add(i);
				}
				if (arg2) {
					skills.addArray(this.hiddenSkills);
				}
				if (arg3 !== false) {
					skills.addArray(es);
				}
				for (var i in this.forbiddenSkills) {
					skills.remove(i);
				}
				if (arg4 !== false) {
					skills = game.filterSkills(skills, this, es);
				}
				return skills;
			} else if (get.is.pos(arg1)) {
				var cards = [],
					cards1 = [];
				for (i = 0; i < arg1.length; i++) {
					if (arg1[i] == "h") {
						for (j = 0; j < this.node.handcards1.childElementCount; j++) {
							if (!this.node.handcards1.childNodes[j].classList.contains("removing") && !this.node.handcards1.childNodes[j].classList.contains("feichu") && !this.node.handcards1.childNodes[j].classList.contains("emptyequip") && !this.node.handcards1.childNodes[j].classList.contains("glows")) {
								cards.push(this.node.handcards1.childNodes[j]);
							}
						}
						for (j = 0; j < this.node.handcards2.childElementCount; j++) {
							if (!this.node.handcards2.childNodes[j].classList.contains("removing") && !this.node.handcards2.childNodes[j].classList.contains("feichu") && !this.node.handcards2.childNodes[j].classList.contains("emptyequip") && !this.node.handcards2.childNodes[j].classList.contains("glows")) {
								cards.push(this.node.handcards2.childNodes[j]);
							}
						}
					} else if (arg1[i] == "e") {
						for (j = 0; j < this.node.equips.childElementCount; j++) {
							if (!this.node.equips.childNodes[j].classList.contains("removing") && !this.node.equips.childNodes[j].classList.contains("feichu") && !this.node.equips.childNodes[j].classList.contains("emptyequip")) {
								cards.push(this.node.equips.childNodes[j]);
							}
						}
						if (arguments.length == 2 && typeof arg2 == "string" && /1|2|3|4|5/.test(arg2)) {
							for (j = 0; j < cards.length; j++) {
								if (get.subtype(cards[j]) == "equip" + arg2) {
									return cards[j];
								}
							}
							return;
						}
					} else if (arg1[i] == "j") {
						for (j = 0; j < this.node.judges.childElementCount; j++) {
							if (!this.node.judges.childNodes[j].classList.contains("removing") && !this.node.judges.childNodes[j].classList.contains("feichu") && !this.node.judges.childNodes[j].classList.contains("emptyequip")) {
								cards.push(this.node.judges.childNodes[j]);
								if (this.node.judges.childNodes[j].viewAs && arguments.length > 1) {
									this.node.judges.childNodes[j].tempJudge = this.node.judges.childNodes[j].name;
									this.node.judges.childNodes[j].name = this.node.judges.childNodes[j].viewAs;
									cards1.push(this.node.judges.childNodes[j]);
								}
							}
						}
					}
				}
				if (arguments.length == 1) {
					return cards;
				}
				if (arg2 != undefined) {
					if (typeof arg3 == "function") {
						var cards2 = cards.slice(0);
						cards.sort(function (a, b) {
							return arg3(b, cards2) - arg3(a, cards2);
						});
					}
					if (typeof arg2 == "string") {
						for (i = 0; i < cards.length; i++) {
							if (cards[i].name != arg2) {
								cards.splice(i, 1);
								i--;
							}
						}
					} else if (typeof arg2 == "object") {
						for (i = 0; i < cards.length; i++) {
							for (j in arg2) {
								if (j == "type") {
									if (typeof arg2[j] == "object") {
										if (arg2[j].includes(get.type(cards[i])) == false) {
											cards.splice(i, 1);
											i--;
											break;
										}
									} else if (typeof arg2[j] == "string") {
										if (get.type(cards[i]) != arg2[j]) {
											cards.splice(i, 1);
											i--;
											break;
										}
									}
								} else if (j == "subtype") {
									if (typeof arg2[j] == "object") {
										if (arg2[j].includes(get.subtype(cards[i])) == false) {
											cards.splice(i, 1);
											i--;
											break;
										}
									} else if (typeof arg2[j] == "string") {
										if (get.subtype(cards[i]) != arg2[j]) {
											cards.splice(i, 1);
											i--;
											break;
										}
									}
								} else if (j == "color") {
									if (typeof arg2[j] == "object") {
										if (arg2[j].includes(get.color(cards[i])) == false) {
											cards.splice(i, 1);
											i--;
											break;
										}
									} else if (typeof arg2[j] == "string") {
										if (get.color(cards[i]) != arg2[j]) {
											cards.splice(i, 1);
											i--;
											break;
										}
									}
								} else if (j == "suit") {
									if (typeof arg2[j] == "object") {
										if (arg2[j].includes(get.suit(cards[i])) == false) {
											cards.splice(i, 1);
											i--;
											break;
										}
									} else if (typeof arg2[j] == "string") {
										if (get.suit(cards[i]) != arg2[j]) {
											cards.splice(i, 1);
											i--;
											break;
										}
									}
								} else if (j == "number") {
									if (typeof arg2[j] == "object") {
										if (arg2[j].includes(get.number(cards[i])) == false) {
											cards.splice(i, 1);
											i--;
											break;
										}
									} else if (typeof arg2[j] == "string") {
										if (get.number(cards[i]) != arg2[j]) {
											cards.splice(i, 1);
											i--;
											break;
										}
									}
								} else if (typeof arg2[j] == "object") {
									if (arg2[j].includes(cards[i][j]) == false) {
										cards.splice(i, 1);
										i--;
										break;
									}
								} else if (typeof arg2[j] == "string") {
									if (cards[i][j] != arg2[j]) {
										cards.splice(i, 1);
										i--;
										break;
									}
								}
							}
						}
					} else if (typeof arg2 == "number" && arg2 > 0) {
						cards.splice(arg2);
					} else if (typeof arg2 == "function") {
						for (i = 0; i < cards.length; i++) {
							if (!arg2(cards[i])) {
								cards.splice(i, 1);
								i--;
							}
						}
					}
				}
				for (i = 0; i < cards1.length; i++) {
					if (cards1[i].tempJudge) {
						cards1[i].name = cards1[i].tempJudge;
						delete cards1[i].tempJudge;
					}
				}
				if (arg2 === 0) {
					return cards[0];
				}
				if (typeof arg3 == "number") {
					if (arg3 == 0) {
						return cards[0];
					}
					cards.splice(arg3);
				}
				if (typeof arg4 == "number") {
					if (arg4 == 0) {
						return cards[0];
					}
					cards.splice(arg4);
				}
				return cards;
			}
		},
		/**
		 * @deprecated
		 */
		num(arg1, arg2, arg3) {
			if (get.itemtype(arg1) == "position") {
				return this.get(arg1, arg2, arg3).length;
			} else if (arg1 == "s") {
				if (typeof arg2 == "boolean") {
					return game.expandSkills(this.getSkills(arg2).concat(lib.skill.global)).includes(arg3);
				} else {
					return game.expandSkills(this.getSkills().concat(lib.skill.global)).includes(arg2);
				}
			}
		},
	});
}

// player.insertEvent
lib.element.Player.prototype.insertEvent = function (name, content, arg) {
	var evt = _status.event.getParent("phase");
	var next;
	if (evt && evt.parent && evt.parent.next) {
		next = game.createEvent(name, null, evt.parent);
	} else {
		next = game.createEvent(name);
	}
	for (var i in arg) {
		next[i] = arg[i];
	}
	next.player = this;
	next.setContent(content);
	return next;
};

// Draw result
{
	const originDrawContent = lib.element.content.draw;
	lib.element.content.draw = async function compatibleDraw(event, trigger, player) {
		await originDrawContent(event, trigger, player);
		const cards = event.result.cards.slice(0);
		event.result = Object.assign(cards, event.result);
	}
}

// player.when
lib.element.Player.prototype.when = function (...triggerNames) {
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
	let instantlyAdd = true;
	//从triggerNames中取出instantlyAdd的部分
	if (triggerNames.includes(false)) {
		instantlyAdd = false;
		triggerNames.remove(false);
	}
	if (triggerNames.length == 0) {
		throw new Error("player.when的参数数量应大于0");
	}
	// add other triggerNames
	// arguments.length = 1
	if (triggerNames.length == 1) {
		// 以下两种情况:
		// triggerNames = [ ['xxAfter', ...args] ]
		// triggerNames = [ 'xxAfter' ]
		if (Array.isArray(triggerNames[0]) || typeof triggerNames[0] == "string") {
			trigger = { player: triggerNames[0] };
		}
		// triggerNames = [ {player:'xxx'} ]
		else if (get.is.object(triggerNames[0])) {
			trigger = triggerNames[0];
		}
	}
	// arguments.length > 1
	else {
		// triggerNames = [ 'xxAfter', 'yyBegin' ]
		if (triggerNames.every(t => typeof t == "string")) {
			trigger = { player: triggerNames };
		}
		// triggerNames = [ {player: 'xxAfter'}, {global: 'yyBegin'} ]
		// 此处不做特殊的合并处理，由使用者自行把握，同名属性后者覆盖前者
		else if (triggerNames.every(t => get.is.object(t))) {
			trigger = triggerNames.reduce((pre, cur) => Object.assign(pre, cur));
		}
	}
	if (!trigger) {
		throw new Error("player.when传参数类型错误:" + triggerNames);
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
	/**
	 * 作用域
	 * @type { ((code: string) => any)? }
	 */
	let scope;
	/** @type { Skill } */
	let skill = {
		trigger: trigger,
		forced: true,
		charlotte: true,
		popup: false,
		sourceSkill: sourceSkill,
		// 必要条件
		/** @type { Required<Skill>['filter'][] } */
		filterFuns: [],
		// 充分条件
		/** @type { Required<Skill>['filter'][] } */
		filter2Funs: [],
		/** @type { Required<Skill>['content'][] } */
		contentFuns: [],
		// 外部变量
		get vars() {
			return vars;
		},
		get filter() {
			return (event, player, name) => skill.filterFuns.every(fun => Boolean(fun(event, player, name))) && skill.filter2(event, player, name);
		},
		get filter2() {
			return (event, player, name) => skill.filter2Funs.length === 0 || skill.filter2Funs.some(fun => Boolean(fun(event, player, name)));
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
				const begin = a.indexOf("{") == a.indexOf("}") && a.indexOf("{") == -1 && a.indexOf("=>") > -1 ? a.indexOf("=>") + 2 : a.indexOf("{") + 1;
				const str2 = a.slice(begin, a.lastIndexOf("}") != -1 ? a.lastIndexOf("}") : undefined).trim();
				// 防止注入喵
				if (!get.isFunctionBody(str2)) {
					throw new Error("无效的content函数代码");
				}
				let recompiledScope;
				if (security.isSandboxRequired()) {
					recompiledScope = scope ? security.eval(`return (${scope.toString()})`) : code => security.eval(`return (${code.toString()})`);
				} else {
					recompiledScope = scope || eval;
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
		skill: skillName,
		filter(fun) {
			if (lib.skill[skillName] != skill) {
				throw new Error(`This skill has been destroyed`);
			}
			skill.filterFuns.push(fun);
			return this;
		},
		removeFilter(fun) {
			if (lib.skill[skillName] != skill) {
				throw new Error(`This skill has been destroyed`);
			}
			skill.filterFuns.remove(fun);
			return this;
		},
		filter2(fun) {
			if (lib.skill[skillName] != skill) {
				throw new Error(`This skill has been destroyed`);
			}
			skill.filter2Funs.push(fun);
			return this;
		},
		removeFilter2(fun) {
			if (lib.skill[skillName] != skill) {
				throw new Error(`This skill has been destroyed`);
			}
			skill.filter2Funs.remove(fun);
			return this;
		},
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
		step(fun) {
			if (lib.skill[skillName] != skill) {
				throw new Error(`This skill has been destroyed`);
			}
			skill.contentFuns.push(fun);
			createContent();
			return this;
		},
		popup(str) {
			if (lib.skill[skillName] != skill) {
				throw new Error(`This skill has been destroyed`);
			}
			if (typeof str == "string") {
				skill.popup = str;
			}
			return this;
		},
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
		apply(_scope) {
			if (lib.skill[skillName] != skill) {
				throw new Error(`This skill has been destroyed`);
			}
			if (security.isSandboxRequired()) {
				console.warn("`player.when().apply()` 在沙盒模式下不推荐使用");
			}
			scope = _scope;
			if (skill.contentFuns.length > 0) {
				createContent();
			}
			return this;
		},
		finish() {
			if (lib.skill[skillName] != skill) {
				throw new Error(`This skill has been destroyed`);
			}
			player.addSkill(skillName);
			return this;
		},
	};
};
