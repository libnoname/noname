/**
 * Bridge the pure ledger to live players. Projection deliberately does not call
 * addMark/removeMark/markSkill/unmarkSkill: restoring state must not trigger
 * mark gains, skill rewards, on-unmark card movement, or a second replay entry.
 */
export function createOwnedMarkMethods({ OwnedMarkStore, getId, isVideo, getSkill, readSavedState, updateMarkLayout }) {
	function players(game) {
		return [...new Set([...(game.players || []), ...(game.dead || [])])];
	}
	function createStore(game, sessionId) {
		game._ownedMarkStore = new OwnedMarkStore({ sessionId, onChange: snapshot => game.syncOwnedMarks(snapshot) });
		return game._ownedMarkStore;
	}
	function project(game, snapshot, options = {}) {
		const apply = () => projectState(game, snapshot, options);
		return game.withMarkExecution ? game.withMarkExecution(null, null, apply, { phase: "projection" }) : apply();
	}
	function projectState(game, snapshot, { restoring = false } = {}) {
		const previous = game._ownedMarkProjection || new Map();
		const next = new Map();
		const previousEffects = game._ownedMarkEffects || new Map();
		const effects = new Map(snapshot.buckets.flatMap(bucket => bucket.effects).map(record => [record.id, record]));
		for (const bucket of snapshot.buckets) {
			const total = bucket.anonymous + bucket.effects.reduce((sum, effect) => sum + effect.count, 0);
			next.set(JSON.stringify([bucket.bearer, bucket.name]), { bearer: bucket.bearer, name: bucket.name, total });
		}
		const applying = game._applyingOwnedMarks;
		const wasRestoring = game._restoringOwnedMarks;
		game._applyingOwnedMarks = true;
		game._restoringOwnedMarks = restoring;
		try {
			for (const [key, value] of new Map([...previous, ...next])) {
				const { bearer, name } = value;
				const player = game.resolveOwnedMarkPlayer(bearer);
				if (!player) continue;
				const total = next.get(key)?.total || 0;
				player.storage[name] = total;
				const skill = getSkill(name);
				if ((total > 0 || skill?.mark) && skill?.intro) {
					if (!player.marks[name]) player.marks[name] = player.mark(name, skill.intro);
				} else if (player.marks[name]) {
					player.marks[name].delete();
					delete player.marks[name];
				}
				player.updateMarks();
				updateMarkLayout?.(player);
			}
			// Publish the local projection before callbacks, so nested lifecycle
			// changes see committed effects rather than applying an effect twice.
			game._ownedMarkProjection = next;
			game._ownedMarkEffects = effects;
			// Only numeric/UI projection is silent. Live relation hooks can remove
			// borrowed skills whose normal onunmark cleanup must still execute.
			game._applyingOwnedMarks = applying;
			for (const id of new Set([...previousEffects.keys(), ...effects.keys()])) {
				if (game._ownedMarkEffects !== effects) break;
				const record = effects.get(id) || null, before = previousEffects.get(id) || null;
				if (JSON.stringify(record) === JSON.stringify(before)) continue;
				for (const source of new Set([before?.sourceSkill, record?.sourceSkill])) {
					const hook = source && getSkill(source)?.onOwnedMarkChange;
					if (typeof hook !== "function") continue;
					const current = record?.sourceSkill === source ? record : null;
					const previous = before?.sourceSkill === source ? before : null;
					try {
						hook(current && JSON.parse(JSON.stringify(current)), previous && JSON.parse(JSON.stringify(previous)), { restoring });
					} catch (error) {
						console.error("Owned mark change hook failed", source, error);
					}
				}
			}
		} finally {
			game._applyingOwnedMarks = applying;
			game._restoringOwnedMarks = wasRestoring;
		}
	}
	return {
		getOwnedMarkStore() {
			return this._ownedMarkStore || createStore(this, `owned:${getId()}`);
		},
		getOwnedMarkIdentity(player) {
			if (!player || typeof player !== "object") throw new TypeError("An owned-mark identity requires a Player");
			if (!player._ownedMarkIdentity) {
				Object.defineProperty(player, "_ownedMarkIdentity", {
					value: `${this.getOwnedMarkStore().snapshot().sessionId}:p:${getId()}`,
					writable: true,
					configurable: true,
				});
			}
			(this._ownedMarkPlayers ||= new Map()).set(player._ownedMarkIdentity, player);
			return player._ownedMarkIdentity;
		},
		resolveOwnedMarkPlayer(identity) {
			return players(this).find(player => player._ownedMarkIdentity === identity) || this._ownedMarkPlayers?.get(identity);
		},
		exportOwnedMarkState() {
			const ledger = this.getOwnedMarkStore().snapshot();
			const identities = new Map(players(this).map(player => {
				const id = this.getOwnedMarkIdentity(player);
				return [id, { id, playerid: player.playerid ?? null, position: String(player.dataset.position) }];
			}));
			for (const bucket of ledger.buckets) {
				const required = [bucket.bearer, ...bucket.effects.flatMap(effect => [effect.bearer, effect.creator, effect.owner, effect.beneficiary])];
				for (const id of required) {
					if (!identities.has(id)) identities.set(id, { id, playerid: this._ownedMarkPlayers?.get(id)?.playerid ?? null, position: null, detached: true });
				}
			}
			const policies = this.exportOwnedMarkPolicies?.();
			return { ledger, players: [...identities.values()], ...(policies?.length ? { policies } : {}) };
		},
		importOwnedMarkState(payload, { force = false, replay = false } = {}) {
			if (typeof payload === "string") payload = JSON.parse(payload);
			if (!payload || !payload.ledger || !Array.isArray(payload.players)) throw new TypeError("Invalid owned-mark state");
			const existing = this._ownedMarkStore?.snapshot();
			if (!force && existing && (this._ownedMarkImportedSession || existing.revision > 0)) {
				if (payload.ledger.sessionId !== existing.sessionId) throw new Error("Owned mark snapshot belongs to another match");
				if (payload.ledger.revision <= existing.revision) return false;
			}
			const policies = this.validateOwnedMarkPolicies ? this.validateOwnedMarkPolicies(payload.policies ?? []) : undefined;
			if (payload.policies !== undefined && policies === undefined) throw new TypeError("Mark policy support is required for this snapshot");
			const ids = new Set();
			const current = players(this), bound = new Set(), bindings = [];
			for (const identity of payload.players) {
				if (!identity || typeof identity.id !== "string" || !identity.id || ids.has(identity.id) || (identity.detached !== undefined && typeof identity.detached !== "boolean") || (!identity.detached && !["number", "string"].includes(typeof identity.position))) throw new TypeError("Invalid owned-mark player identity");
				ids.add(identity.id);
				if (identity.detached) continue;
				const player = current.find(player => replay ? String(player.dataset.position) === String(identity.position) : identity.playerid != null && player.playerid === identity.playerid);
				if (!player || bound.has(player)) throw new TypeError("Missing or duplicate owned-mark player binding");
				bound.add(player);
				bindings.push({ identity, player });
			}
			if (!Array.isArray(payload.ledger.buckets)) throw new TypeError("Invalid owned-mark buckets");
			for (const bucket of payload.ledger.buckets) {
				const required = [bucket.bearer, ...bucket.effects.flatMap(effect => [effect.bearer, effect.creator, effect.owner, effect.beneficiary])];
				if (required.some(id => !ids.has(id) && !this._ownedMarkPlayers?.has(id))) throw new TypeError("Missing owned-mark identity metadata");
			}
			let store = this._ownedMarkStore;
			const firstImport = !this._ownedMarkImportedSession && (!store || store.snapshot().revision === 0);
			if (!store || (firstImport && store.snapshot().sessionId !== payload.ledger.sessionId)) store = new OwnedMarkStore({ sessionId: payload.ledger.sessionId, onChange: snapshot => this.syncOwnedMarks(snapshot) });
			if (!store.restore(payload.ledger, { force: force || firstImport })) return false;
			this._ownedMarkStore = store;
			if (policies) this.restoreOwnedMarkPolicies(policies);
			this._ownedMarkImportedSession = true;
			// Clear the old bindings before overwriting their identity; otherwise a
			// forced session replacement could leave an unreachable nonzero mark.
			if (bindings.some(({ identity, player }) => player?._ownedMarkIdentity && player._ownedMarkIdentity !== identity.id)) project(this, { buckets: [] }, { restoring: true });
			for (const { identity, player } of bindings) {
				if (player) {
					Object.defineProperty(player, "_ownedMarkIdentity", { value: identity.id, writable: true, configurable: true });
					(this._ownedMarkPlayers ||= new Map()).set(identity.id, player);
				}
			}
			project(this, store.snapshot(), { restoring: true });
			return true;
		},
		refreshOwnedMarks() {
			if (!this._ownedMarkStore) return;
			this._ownedMarkEffects = new Map();
			project(this, this._ownedMarkStore.snapshot(), { restoring: true });
		},
		syncOwnedMarks(snapshot) {
			project(this, snapshot);
			if (this.online || isVideo()) return;
			if (this.getOwnedMarkStore().snapshot().revision !== snapshot.revision) return;
			const payload = this.exportOwnedMarkState();
			// Use a JSON string to preserve arbitrary JSON params beyond the generic
			// network encoder's depth limit and its reserved string prefixes.
			this.broadcast(function (state) { game.importOwnedMarkState(state); }, JSON.stringify(payload));
			this.addVideo("ownedMarks", null, payload);
		},
		handleOwnedMarkLifecycle(player, reason, skill) {
			if (this.online || isVideo() || this._restoringOwnedMarks || !this._ownedMarkStore || !player?._ownedMarkIdentity) return [];
			return this._ownedMarkStore.lifecycle(player._ownedMarkIdentity, reason, skill);
		},
		resetOwnedMarks() {
			if (this._ownedMarkStore) project(this, { buckets: [] }, { restoring: true });
			for (const player of new Set([...players(this), ...(this._ownedMarkPlayers?.values() || [])])) delete player._ownedMarkIdentity;
			delete this._ownedMarkStore;
			delete this._ownedMarkProjection;
			delete this._ownedMarkEffects;
			delete this._ownedMarkPlayers;
			delete this._ownedMarkImportedSession;
		},
		/** Mode authors opt into persistence after creating the players to restore. */
		saveOwnedMarkState(key = "ownedMarks", mode) {
			const payload = this.exportOwnedMarkState();
			this.save(key, payload, mode);
			return payload;
		},
		loadOwnedMarkState(state = "ownedMarks", options = {}) {
			const payload = typeof state === "string" ? readSavedState(state) : state;
			if (!payload) return false;
			return this.importOwnedMarkState(payload, { force: true, replay: true, ...options });
		},
	};
}
