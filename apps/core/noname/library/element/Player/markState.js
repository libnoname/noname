/** Wire codec for the provenance attached to original Mark storage (protocol v1).
 * Array shares use aggregate indices, so Player/Card members restore as the
 * very same references in storage, rather than separately decoded objects.
 */
export function encodeMarkState(value, state, revision) {
	if (!state) return;
	return {
		version: 1,
		revision,
		kind: value === undefined ? "absent" : Array.isArray(value) ? "array" : "number",
		entries:
			value === undefined
				? []
				: state.entries.map(entry => {
						if (!Array.isArray(value)) return { source: entry.source, value: entry.value };
						const used = new Set();
						const indices = entry.value.map(item => {
							const index = value.findIndex((candidate, index) => !used.has(index) && Object.is(candidate, item));
							if (index < 0) throw new TypeError("Mark source is not a member of aggregate storage");
							used.add(index);
							return index;
						});
						return { source: entry.source, indices };
					}),
	};
}

export function decodeMarkState(value, payload) {
	if (payload == null) return;
	if (payload.version !== 1 || !Number.isSafeInteger(payload.revision) || payload.revision < 0 || !Array.isArray(payload.entries)) throw new TypeError("Unsupported Mark source state");
	if (payload.kind === "absent") {
		if ((value !== undefined && value !== null) || payload.entries.length) throw new TypeError("Invalid absent Mark state");
		return { value: undefined, entries: [] };
	}
	const array = payload.kind === "array";
	if (array ? !Array.isArray(value) : payload.kind !== "number" || !Number.isFinite(value) || value < 0) throw new TypeError("Mark source kind mismatch");
	const sources = new Set(),
		covered = new Set();
	const entries = payload.entries.map(entry => {
		if (!entry || (entry.source !== null && (typeof entry.source !== "string" || !entry.source.length)) || sources.has(entry.source)) throw new TypeError("Invalid or duplicated Mark source");
		sources.add(entry.source);
		if (!array) {
			if (!Number.isFinite(entry.value) || entry.value < 0) throw new TypeError("Invalid Mark source quantity");
			return { source: entry.source, value: entry.value };
		}
		if (!Array.isArray(entry.indices) || new Set(entry.indices).size !== entry.indices.length || entry.indices.some(index => !Number.isSafeInteger(index) || index < 0 || index >= value.length)) throw new TypeError("Invalid Mark member index");
		entry.indices.forEach(index => covered.add(index));
		return { source: entry.source, value: entry.indices.map(index => value[index]) };
	});
	if (array ? covered.size !== value.length : entries.reduce((sum, entry) => sum + entry.value, 0) !== value) throw new TypeError("Mark source total differs from aggregate storage");
	return { value: array ? value.slice() : value, entries };
}
