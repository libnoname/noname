/**
 * Explicit, JSON-only effect relations. No Player, event, network or DOM dependency.
 * A transaction validates a private draft, commits once, then notifies its adapter.
 * Old aggregate amounts live in an anonymous bucket: they are never given an owner.
 */
const copy = value => JSON.parse(JSON.stringify(value));
const policies = { ownerDeath: "retain", bearerDeath: "remove", skillRemoval: "remove", reset: "remove" };
const identity = value => {
	if (typeof value !== "string" || !value.length) throw new TypeError("Owned marks require an explicit nonempty identity");
	return value;
};
function json(value, seen = new Set()) {
	if (value === null || typeof value === "string" || typeof value === "boolean") return;
	if (typeof value === "number" && Number.isFinite(value)) return;
	if (!value || typeof value !== "object" || seen.has(value)) throw new TypeError("Owned mark parameters must be finite, acyclic JSON data");
	const prototype = Object.getPrototypeOf(value);
	if (!Array.isArray(value) && prototype !== null && (Object.prototype.toString.call(value) !== "[object Object]" || prototype.constructor?.name !== "Object")) throw new TypeError("Owned mark parameters cannot contain Player or class instances");
	seen.add(value);
	for (const key of Object.keys(value)) {
		if (["__proto__", "prototype", "constructor"].includes(key)) throw new TypeError("Unsafe owned mark data key");
		json(value[key], seen);
	}
	seen.delete(value);
}
function quantity(n, zero = false) {
	if (!Number.isSafeInteger(n) || n < (zero ? 0 : 1)) throw new RangeError("Owned mark quantity must be a safe positive integer");
	return n;
}
function matches(effect, selector) {
	return Object.entries(selector).every(([key, value]) => value === undefined || effect[key === "effectId" ? "id" : key] === value);
}
function bucket(state, bearer, name, legacy = 0) {
	identity(bearer); identity(name);
	let found = state.buckets.find(b => b.bearer === bearer && b.name === name);
	if (!found) {
		if (!Number.isFinite(legacy) || legacy < 0) throw new TypeError("Owned marks require a nonnegative numeric legacy value, not an array");
		state.buckets.push(found = { bearer, name, anonymous: legacy, effects: [] });
	}
	return found;
}
function validate(state) {
	json(state);
	if (state.version !== 1) throw new TypeError("Unsupported owned mark snapshot version");
	identity(state.sessionId); quantity(state.revision, true); quantity(state.sequence, true);
	if (!Array.isArray(state.buckets)) throw new TypeError("Invalid owned mark buckets");
	const ids = new Set(), keys = new Set();
	for (const b of state.buckets) {
		identity(b.bearer); identity(b.name);
		const key = JSON.stringify([b.bearer, b.name]);
		if (keys.has(key) || !Array.isArray(b.effects) || !Number.isFinite(b.anonymous) || b.anonymous < 0) throw new TypeError("Invalid or duplicate owned mark bucket");
		keys.add(key);
		for (const e of b.effects) {
			for (const field of ["id", "creator", "owner", "beneficiary", "bearer", "name"]) identity(e[field]);
			if (ids.has(e.id) || e.bearer !== b.bearer || e.name !== b.name) throw new TypeError("Inconsistent owned mark identity or bearer");
			ids.add(e.id); quantity(e.count); quantity(e.revision);
			const prefix = `${state.sessionId}:effect:`, issued = Number(e.id.slice(prefix.length));
			if (!e.id.startsWith(prefix) || !Number.isSafeInteger(issued) || issued < 1 || issued > state.sequence) throw new TypeError("Owned mark effect sequence is inconsistent");
			if (e.revision > state.revision || typeof e.sourceSkill !== "string") throw new TypeError("Invalid owned mark revision or skill");
			for (const [key, value] of Object.entries(e.lifecycle)) if (!(key in policies) || !["remove", "retain"].includes(value)) throw new TypeError("Invalid owned mark lifecycle policy");
		}
		if (!Number.isFinite(b.anonymous + b.effects.reduce((n, e) => n + e.count, 0))) throw new RangeError("Owned mark total overflow");
	}
}

export class OwnedMarkStore {
	constructor({ sessionId, onChange = () => {} }) {
		this._state = { version: 1, sessionId: identity(sessionId), revision: 0, sequence: 0, buckets: [] };
		this._onChange = onChange;
	}
	snapshot() { return copy(this._state); }
	list(selector = {}) { return copy(this._state.buckets.flatMap(b => b.effects).filter(e => matches(e, selector))); }
	count(selector = {}) { return this.list(selector).reduce((n, e) => n + e.count, 0); }
	isTracked(bearer, name) { return this._state.buckets.some(b => b.bearer === bearer && b.name === name); }
	total(bearer, name) {
		const b = this._state.buckets.find(b => b.bearer === bearer && b.name === name);
		return b ? b.anonymous + b.effects.reduce((n, e) => n + e.count, 0) : 0;
	}
	_transaction(action) {
		const draft = copy(this._state), revision = draft.revision + 1;
		const result = action(draft, revision);
		if (JSON.stringify(draft) === JSON.stringify(this._state)) return copy(result);
		draft.revision = revision;
		validate(draft);
		this._state = draft;
		// A throwing observer does not roll back a committed effect or make it consumable twice.
		this._onChange(this.snapshot());
		return copy(result);
	}
	grant(input, legacy = 0) {
		identity(input.owner); identity(input.bearer); identity(input.name); quantity(input.count ?? 1);
		json(input.params ?? {});
		return this._transaction((state, revision) => {
			const effect = {
				id: `${state.sessionId}:effect:${++state.sequence}`, revision,
				name: input.name, bearer: input.bearer, creator: input.creator ?? input.owner,
				owner: input.owner, beneficiary: input.beneficiary ?? input.owner,
				count: input.count ?? 1, params: copy(input.params ?? {}), sourceSkill: input.sourceSkill ?? "",
				lifecycle: { ...policies, ...input.lifecycle },
			};
			bucket(state, effect.bearer, effect.name, legacy).effects.push(effect);
			return effect;
		});
	}
	remove(selector, count = Infinity) {
		if (count !== Infinity) quantity(count, true);
		return this._transaction((state, revision) => {
			const removed = [];
			for (const b of state.buckets) {
				for (const e of b.effects) {
					if (!count || !matches(e, selector)) continue;
					const n = Math.min(e.count, count);
					removed.push({ ...copy(e), count: n });
					e.count -= n; e.revision = revision; count -= n;
				}
				b.effects = b.effects.filter(e => e.count > 0);
			}
			return removed;
		});
	}
	clear(selector = {}) { return this.remove(selector); }
	transfer(selector, target, count = Infinity, targetLegacy = 0) {
		identity(target);
		if (count !== Infinity) quantity(count, true);
		return this._transaction((state, revision) => {
			const moved = [];
			// Collect first: newly inserted effects must not be visited again.
			for (const b of state.buckets.slice()) for (const e of b.effects.slice()) {
				if (!count || e.bearer === target || !matches(e, selector)) continue;
				const n = Math.min(e.count, count), full = n === e.count;
				const next = { ...copy(e), bearer: target, count: n, revision };
				if (!full) next.id = `${state.sessionId}:effect:${++state.sequence}`;
				e.count -= n; e.revision = revision; count -= n;
				bucket(state, target, e.name, targetLegacy).effects.push(next); moved.push(next);
			}
			for (const b of state.buckets) b.effects = b.effects.filter(e => e.count > 0);
			return moved;
		});
	}
	update(selector, patch) {
		const allowed = ["params", "count", "beneficiary", "owner", "lifecycle"];
		if (Object.keys(patch).some(key => !allowed.includes(key))) throw new TypeError("Cannot overwrite effect identity or creator");
		json(patch);
		return this._transaction((state, revision) => {
			const updated = [];
			for (const b of state.buckets) for (const e of b.effects) if (matches(e, selector)) {
				Object.assign(e, copy(patch), { revision }); updated.push(e);
			}
			return updated;
		});
	}
	/** Explicit merging is conservative: different parameters/expiry/relations stay separate. */
	merge(selector) {
		return this._transaction((state, revision) => {
			const groups = new Map(), merged = [];
			for (const b of state.buckets) {
				const deleted = new Set();
				for (const e of b.effects) if (matches(e, selector)) {
					const { id, revision: oldRevision, count, ...metadata } = e;
					const signature = JSON.stringify(metadata), previous = groups.get(signature);
					if (previous) { previous.count += e.count; previous.revision = revision; deleted.add(id); }
					else { groups.set(signature, e); merged.push(e); }
				}
				b.effects = b.effects.filter(e => !deleted.has(e.id));
			}
			return merged;
		});
	}
	legacySet(bearer, name, total) {
		if (!Number.isFinite(total) || total < 0) throw new RangeError("Tracked aggregate marks must stay nonnegative");
		return this._transaction((state, revision) => {
			const b = bucket(state, bearer, name), before = b.anonymous + b.effects.reduce((n, e) => n + e.count, 0);
			if (total >= before) b.anonymous += total - before;
			else {
				let remaining = before - total;
				const anonymous = Math.min(remaining, b.anonymous); b.anonymous -= anonymous; remaining -= anonymous;
				for (const e of b.effects) {
					const n = Math.min(e.count, remaining); e.count -= n; remaining -= n;
					if (n) e.revision = revision;
				}
				b.effects = b.effects.filter(e => e.count > 0);
			}
			return total;
		});
	}
	lifecycle(id, reason, skill) {
		identity(id);
		const doomed = this.list({}).filter(e => {
			if (reason === "remove") return [e.bearer, e.owner, e.creator, e.beneficiary].includes(id);
			if (reason === "death") return (e.owner === id && e.lifecycle.ownerDeath === "remove") || (e.bearer === id && e.lifecycle.bearerDeath === "remove");
			if (reason === "reset") return (e.bearer === id || e.owner === id) && e.lifecycle.reset === "remove";
			if (reason === "removeSkill") return e.owner === id && e.sourceSkill === skill && e.lifecycle.skillRemoval === "remove";
			return false;
		});
		const ids = new Set(doomed.map(e => e.id));
		return this._transaction(state => {
			for (const b of state.buckets) {
				b.effects = b.effects.filter(e => !ids.has(e.id));
				// uninit clears legacy storage. Projection must not resurrect the old
				// general's anonymous counters; retained owned effects remain explicit.
				if (b.bearer === id && (reason === "reset" || reason === "remove")) b.anonymous = 0;
			}
			return doomed;
		});
	}
	restore(snapshot, { force = false } = {}) {
		validate(snapshot);
		if (!force && snapshot.sessionId !== this._state.sessionId) throw new Error("Owned mark snapshot belongs to another match");
		if (!force && snapshot.revision <= this._state.revision) return false;
		this._state = copy(snapshot);
		return true;
	}
}
