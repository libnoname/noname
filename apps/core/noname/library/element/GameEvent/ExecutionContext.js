/**
 * A synchronous execution frame, NOT an owner held across a pending Promise.
 * Only scheduler/callback boundaries may install frames. Never use event.player
 * from an arbitrary event as evidence that a player owns a skill effect.
 */
let active;
const eventFrames = new WeakMap();
export const executionContext = {
	get current() { return active; },
	run(frame, callback, thisArg, args = []) {
		const previous = active;
		active = frame;
		try { return Reflect.apply(callback, thisArg, args); }
		finally { active = previous; }
	},
	bind(callback) {
		const frame = active;
		return function (...args) { return executionContext.run(frame, callback, this, args); };
	},
	setSkill(event, player, skill, stage = "content") {
		// The dispatch site supplies the actual holder. A missing stable identity
		// deliberately produces no inferred owner (e.g. early player init).
		const frame = typeof player?.playerid === "string" && player.playerid.length && typeof skill === "string"
			? Object.freeze({ player, skill, event, stage }) : undefined;
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
		try { generator = executionContext.run(frame, createGenerator, thisArg, args || []); }
		catch (error) { reject(error); return; }
		const step = (method, value) => {
			let result;
			try { result = executionContext.run(frame, generator[method], generator, [value]); }
			catch (error) { reject(error); return; }
			if (result.done) { resolve(result.value); return; }
			// Promise assimilation (including GameEvent.then) must also run in the
			// correct frame; the frame is removed before either promise settles.
			const awaited = executionContext.run(frame, () => new P(r => r(result.value)));
			awaited.then(value => step("next", value), error => step("throw", error));
		};
		step("next");
	});
}
