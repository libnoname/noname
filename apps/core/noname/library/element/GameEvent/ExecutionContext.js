/**
 * A synchronous execution frame, NOT an owner held across a pending Promise.
 * Only scheduler/callback boundaries may install frames. Never use event.player
 * from an arbitrary event as evidence that a player owns a skill effect.
 */
let active;
const eventFrames = new WeakMap();
const callbackBindings = new WeakMap();
export const executionContext = {
	get current() {
		return active;
	},
	run(frame, callback, thisArg, args = []) {
		const previous = active;
		active = frame;
		try {
			return Reflect.apply(callback, thisArg, args);
		} finally {
			active = previous;
		}
	},
	bind(callback) {
		const frame = active;
		return /** @this {any} */ function (...args) {
			return executionContext.run(frame, callback, this, args);
		};
	},
	bindEvent(event, callback) {
		const frame = executionContext.forEvent(event);
		if (!frame || typeof callback !== "function") return callback;
		let callbacks = callbackBindings.get(event);
		if (!callbacks) callbackBindings.set(event, (callbacks = new WeakMap()));
		if (callbacks.has(callback)) return callbacks.get(callback);
		const boundFrame = { ...frame, executingEvent: event };
		const bound = /** @this {any} */ function (...args) {
			return executionContext.run(boundFrame, callback, this, args);
		};
		callbacks.set(callback, bound);
		callbacks.set(bound, bound);
		return bound;
	},
	bindEventCallbacks(event) {
		for (const key of ["filterTarget", "filterCard", "filterButton", "filterOk", "ai", "ai1", "ai2"]) {
			if (typeof event[key] === "function") event[key] = executionContext.bindEvent(event, event[key]);
		}
	},
	setSkill(event, player, skill, stage = "content") {
		// The dispatch site supplies the actual holder. A missing stable identity
		// deliberately produces no inferred owner (e.g. early player init).
		const frame = typeof player?.playerid === "string" && player.playerid.length && typeof skill === "string" ? Object.freeze({ player, skill, event, stage }) : undefined;
		eventFrames.set(event, frame);
		return frame;
	},
	forEvent(event) {
		const seen = new Set();
		while (event && !seen.has(event)) {
			if (eventFrames.has(event)) return eventFrames.get(event);
			seen.add(event);
			event = event.parent;
		}
	},
};

/** TypeScript's __awaiter protocol, with the captured frame restored per segment. */
export function eventContextAwaiter(thisArg, args, PromiseType, createGenerator) {
	const frame = active;
	const P = PromiseType || Promise;
	return new P((resolve, reject) => {
		let generator;
		try {
			generator = executionContext.run(frame, createGenerator, thisArg, args || []);
		} catch (error) {
			reject(error);
			return;
		}
		const step = (method, value) => {
			let result;
			try {
				result = executionContext.run(frame, generator[method], generator, [value]);
			} catch (error) {
				reject(error);
				return;
			}
			if (result.done) {
				resolve(result.value);
				return;
			}
			// Promise assimilation (including GameEvent.then) must also run in the
			// correct frame; the frame is removed before either promise settles.
			const awaited = executionContext.run(frame, () => new P(r => r(result.value)));
			awaited.then(
				value => step("next", value),
				error => step("throw", error)
			);
		};
		step("next");
	});
}

// Native await does not call Promise.prototype.then; the module compiler above
// handles it. These wrappers cover *explicitly registered* callbacks instead.
// They capture an immutable frame per callback and never keep `active` set while
// waiting. Calls registered outside an engine frame keep their native path.
const nativeThen = Promise.prototype.then;
Object.defineProperty(Promise.prototype, "then", {
	...Object.getOwnPropertyDescriptor(Promise.prototype, "then"),
	value: function (onfulfilled, onrejected) {
		if (active) {
			if (typeof onfulfilled === "function") onfulfilled = executionContext.bind(onfulfilled);
			if (typeof onrejected === "function") onrejected = executionContext.bind(onrejected);
		}
		return Reflect.apply(nativeThen, this, [onfulfilled, onrejected]);
	},
});
for (const name of ["setTimeout", "setInterval", "queueMicrotask", "requestAnimationFrame"]) {
	const native = globalThis[name];
	if (typeof native !== "function") continue;
	globalThis[name] = function (callback, ...args) {
		if (active && typeof callback === "function") callback = executionContext.bind(callback);
		return Reflect.apply(native, this, [callback, ...args]);
	};
}

// Reserved compiler dependency marker. Step content is recompiled without its
// module closure; the marker lets StepParser inject the exact emitted alias,
// including aliases renamed by Rollup. This carries a function, never an owner.
Object.defineProperty(eventContextAwaiter, "__nonameAwait", { value: eventContextAwaiter });
