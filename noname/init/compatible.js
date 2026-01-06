// @ts-nocheck
import { lib, game, get, _status, ui } from "noname";

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
	toPromise() {
		return this;
	},
	toEvent() {
		return this;
	},
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
