/** Internal execution provenance. Frames exist only during a synchronous segment. */
let active;
const holders = new WeakMap();
const origins = new WeakMap();
const bindings = new WeakMap();
const callbackKeys = ["filterTarget", "filterCard", "filterButton", "filterOk", "ai", "ai1", "ai2"];

export const skillContext = {
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
	// Only the dispatcher that knows the actual holder may set this association.
	set(event, player) {
		holders.set(event, player);
	},
	capture(event) {
		origins.set(event, active);
	},
	forEvent(event) {
		return { ...(holders.has(event) ? { player: holders.get(event) } : origins.get(event)), event };
	},
	bind(event, callback) {
		if (typeof callback !== "function") return callback;
		const origin = holders.has(event) ? this.forEvent(event) : origins.get(event);
		const frame = origin && { ...origin, event };
		if (!frame) return callback;
		let cache = bindings.get(event);
		if (!cache) bindings.set(event, (cache = new WeakMap()));
		if (cache.has(callback)) return cache.get(callback);
		const bound = /** @this {any} */ function (...args) {
			return skillContext.run(frame, callback, this, args);
		};
		cache.set(callback, bound);
		cache.set(bound, bound);
		return bound;
	},
	bindCallbacks(event) {
		for (const key of callbackKeys) event[key] = this.bind(event, event[key]);
	},
	isCallback(key) {
		return callbackKeys.includes(key);
	},
};

/** TypeScript awaiter protocol; restore the immutable frame for each segment. */
export function skillContextAwaiter(thisArg, args, PromiseType, createGenerator) {
	const frame = active;
	const P = PromiseType || Promise;
	return new P((resolve, reject) => {
		const generator = skillContext.run(frame, createGenerator, thisArg, args || []);
		const step = (method, value) => {
			let result;
			try {
				result = skillContext.run(frame, generator[method], generator, [value]);
			} catch (error) {
				reject(error);
				return;
			}
			if (result.done) {
				resolve(result.value);
				return;
			}
			const awaited = skillContext.run(frame, () => new P(r => r(result.value)));
			awaited.then(
				value => step("next", value),
				error => step("throw", error)
			);
		};
		step("next");
	});
}
// Step content is recompiled without module lexical bindings. This dependency
// marker lets StepCompiler recognize a helper alias even after Rollup renames it.
Object.defineProperty(skillContextAwaiter, "__nonameSkillAwait", { value: skillContextAwaiter });
