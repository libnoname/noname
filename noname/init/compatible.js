// @ts-nocheck
import { lib, game, get, _status, ui, ai } from "noname";
import ContentCompiler from "@/library/element/GameEvent/compilers/ContentCompiler";
import ContentCompilerBase from "@/library/element/GameEvent/compilers/ContentCompilerBase";
import { GeneratorFunction } from "@/util/index.js";

// 改为HTMLDivElement.prototype.addTempClass
HTMLDivElement.prototype.animate = function (keyframes, options) {
	if (typeof keyframes == "string") {
		console.trace(this, "无名杀开发者修改的animate方法已废弃，请改为使用addTempClass方法");
		// @ts-expect-error ignore
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
