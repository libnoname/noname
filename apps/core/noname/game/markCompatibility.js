/** Opt-in legacy compatibility. Policies describe rules; an execution actor is never guessed. */
export function createMarkCompatibilityMethods() {
	const states = new WeakMap();
	const state = game => { if (!states.has(game)) states.set(game, { policies: new Map(), current: null, events: new WeakMap() }); return states.get(game); };
	function validatePolicy(name, descriptor) {
		if (typeof name !== "string" || !name || !descriptor || !["private", "multi", "shared", "resource"].includes(descriptor.semantics)) throw new TypeError("Invalid mark semantics policy");
		const fields = ["semantics", "skills", "sourceSkill", "query", "remove", "selfResource", "lifecycle"];
		if (Object.keys(descriptor).some(key => !fields.includes(key))) throw new TypeError("Unknown mark policy field");
		if (descriptor.skills !== undefined && (!Array.isArray(descriptor.skills) || descriptor.skills.some(skill => typeof skill !== "string" || !skill))) throw new TypeError("Policy skills must be explicit IDs");
		for (const field of ["query", "remove"]) if (descriptor[field] !== undefined && !["owner", "all"].includes(descriptor[field])) throw new TypeError("Invalid mark access policy");
		if (descriptor.sourceSkill !== undefined && typeof descriptor.sourceSkill !== "string") throw new TypeError("Invalid policy source skill");
		if (descriptor.selfResource !== undefined && typeof descriptor.selfResource !== "boolean") throw new TypeError("Invalid policy self resource flag");
		if (descriptor.lifecycle !== undefined && (!descriptor.lifecycle || typeof descriptor.lifecycle !== "object" || Object.entries(descriptor.lifecycle).some(([key, value]) => !["ownerDeath", "bearerDeath", "skillRemoval", "reset"].includes(key) || !["remove", "retain"].includes(value)))) throw new TypeError("Invalid policy lifecycle");
		return JSON.parse(JSON.stringify(descriptor));
	}
	return {
		registerOwnedMarkPolicy(name, descriptor) {
			const policy = validatePolicy(name, descriptor);
			if (this._ownedMarkStore?.snapshot().revision > 0) throw new Error("Register mark policies before the first ledger transaction");
			if (state(this).policies.has(name)) throw new Error("A mark policy is already registered: " + name);
			state(this).policies.set(name, policy);
			return this.getOwnedMarkPolicy(name);
		},
		getOwnedMarkPolicy(name) {
			const policy = state(this).policies.get(name);
			return policy && JSON.parse(JSON.stringify(policy));
		},
		isMarkExecutionActive() { return state(this).current !== null; },
		exportOwnedMarkPolicies() { return [...state(this).policies].map(([name, policy]) => [name, JSON.parse(JSON.stringify(policy))]); },
		validateOwnedMarkPolicies(entries) {
			if (!Array.isArray(entries)) throw new TypeError("Invalid mark policy list");
			const names = new Set();
			return entries.map(entry => {
				if (!Array.isArray(entry) || entry.length !== 2 || names.has(entry[0])) throw new TypeError("Duplicate or invalid mark policy");
				names.add(entry[0]); return [entry[0], validatePolicy(...entry)];
			});
		},
		restoreOwnedMarkPolicies(entries) { state(this).policies = new Map(this.validateOwnedMarkPolicies(entries)); },
		withMarkExecution(actor, skill, callback, { phase = "content", event = null } = {}) {
			if (typeof callback !== "function") throw new TypeError("Execution callback required");
			if (actor != null && (typeof actor !== "object" || typeof skill !== "string" || !skill)) throw new TypeError("Explicit actor and skill required");
			const local = state(this), previous = local.current;
			local.current = actor == null ? null : { actor, skill, phase, event };
			try { return callback(); }
			finally { local.current = previous; } // Deliberately synchronous: NEVER await while exposing this actor.
		},
		captureMarkCallback(callback, binding) {
			const scope = binding || state(this).current, game = this;
			return function (...args) { return game.withMarkExecution(scope?.actor ?? null, scope?.skill ?? null, () => callback.apply(this, args), scope || {}); };
		},
		bindMarkExecution(event, actor, skill) {
			if (!event || typeof event !== "object" || !actor || typeof actor !== "object" || typeof skill !== "string" || !skill) throw new TypeError("Explicit event actor and skill required");
			state(this).events.set(event, { actor, skill, event, phase: "content" });
			return event;
		},
		runMarkContent(event, callback) {
			const scope = state(this).events.get(event);
			return this.withMarkExecution(scope?.actor ?? null, scope?.skill ?? null, callback, scope || {});
		},
		getOwnedMarkAccess(player, name, operation, options = {}) {
			const policy = state(this).policies.get(name), scope = state(this).current;
			if (options.scope !== undefined) {
				if (options.scope === "all") return { kind: "all", policy };
				if (options.scope !== "owner" || options.owner == null) throw new TypeError("Explicit owner required for owner-scoped marks");
				return { kind: "owner", owner: options.owner, policy };
			}
			if (!policy || ["shared", "resource"].includes(policy.semantics)) return null;
			const qualified = scope && policy.skills?.includes(scope.skill);
			if (!qualified) return operation === "query" ? null : { kind: "unknown", policy };
			if (operation !== "add" && policy[operation === "query" ? "query" : "remove"] === "all") return { kind: "all", policy };
			return { kind: "owner", owner: scope.actor, scope, policy, includeAnonymous: !!policy.selfResource && scope.actor === player };
		},
		countLegacyOwnedMark(player, name, options) {
			if (player.storage[name] != null && typeof player.storage[name] !== "number") return undefined;
			const access = this.getOwnedMarkAccess(player, name, "query", options);
			if (!access || access.kind === "all") return undefined;
			const store = this.getOwnedMarkStore(), bearer = this.getOwnedMarkIdentity(player);
			const owner = typeof access.owner === "string" ? access.owner : this.getOwnedMarkIdentity(access.owner);
			const anonymous = access.includeAnonymous ? store.snapshot().buckets.find(bucket => bucket.bearer === bearer && bucket.name === name)?.anonymous ?? (Number(player.storage[name]) || 0) : 0;
			return store.count({ bearer, name, owner }) + anonymous;
		},
		applyLegacyOwnedMark(player, name, operation, count, log, options) {
			if (this._applyingOwnedMarks || this._restoringOwnedMarks) return true;
			const access = this.getOwnedMarkAccess(player, name, operation, options);
			if (!access || access.kind === "all") return false;
			if (player.storage[name] != null && typeof player.storage[name] !== "number") return false;
			if (count < 0) return this.applyLegacyOwnedMark(player, name, operation === "add" ? "remove" : "add", -count, log, options);
			const store = this.getOwnedMarkStore(), bearer = this.getOwnedMarkIdentity(player);
			if (operation === "add" && access.kind === "owner") {
				player.addOwnedMark(name, access.owner, count, { sourceSkill: access.policy?.sourceSkill || access.scope?.skill || "", lifecycle: access.policy?.lifecycle, log });
				return true;
			}
			player._mutateOwnedMarks(() => {
				const bucket = store.snapshot().buckets.find(bucket => bucket.bearer === bearer && bucket.name === name);
				const total = Number(player.storage[name]) || 0, anonymous = bucket?.anonymous ?? total;
				if (operation === "add") return store.legacySet(bearer, name, total + count);
				let remaining = count;
				if (access.kind === "unknown" || access.includeAnonymous) {
					const removed = Math.min(remaining, anonymous);
					store.legacySet(bearer, name, total - removed); remaining -= removed;
				}
				if (access.kind === "owner" && remaining > 0) {
					const owner = typeof access.owner === "string" ? access.owner : this.getOwnedMarkIdentity(access.owner);
					store.remove({ bearer, name, owner }, remaining);
				}
			}, log);
			return true;
		},
	};
}
