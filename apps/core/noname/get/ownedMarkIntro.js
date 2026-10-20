/** Append provenance without replacing a mark's original rules or custom nodes. */
export function appendOwnedMarkIntro(dialog, bearer, name, { game, get, document = globalThis.document }) {
	if (!bearer || typeof name !== "string" || !name || !document) return;
	// Hover is read-only: do not allocate a ledger or identities for legacy marks.
	const effects = bearer._ownedMarkIdentity && game._ownedMarkStore
		? game._ownedMarkStore.list({ bearer: bearer._ownedMarkIdentity, name })
		: [];
	const policy = game.getOwnedMarkPolicy?.(name);
	const storage = bearer.storage?.[name];
	const total = typeof storage === "number" && Number.isFinite(storage) ? Math.max(0, storage) : Array.isArray(storage) ? storage.length : null;
	const section = document.createElement("div");
	section.className = "text owned-mark-sources";
	// The engine's global div rule is position:absolute; rows must participate
	// in layout so the native popup measures and displays the whole section.
	Object.assign(section.style, { position: "relative", display: "block", textAlign: "left" });
	const title = document.createElement("div");
	Object.assign(title.style, { position: "static", display: "block" });
	title.textContent = "标记来源";
	section.appendChild(title);
	const append = (text, owner) => {
		const row = document.createElement("div");
		Object.assign(row.style, { position: "static", display: "block" });
		row.textContent = text;
		if (owner) row.dataset.ownedMarkOwner = owner;
		section.appendChild(row);
	};
	const labels = { shared: "公共标记（共享）", resource: "自身资源", private: "私有标记", multi: "多来源独立标记" };
	if (labels[policy?.semantics]) append(labels[policy.semantics]);
	const owners = new Map();
	for (const effect of effects) owners.set(effect.owner, (owners.get(effect.owner) || 0) + effect.count);
	for (const [identity, count] of owners) {
		const owner = game.resolveOwnedMarkPlayer?.(identity);
		if (!owner) {
			append(`来源未知（角色暂不可用）：${count}`, identity);
			continue;
		}
		const seat = owner.getSeatNum?.() || (owner.dataset?.position != null && Number.isFinite(Number(owner.dataset.position)) ? Number(owner.dataset.position) + 1 : null);
		const character = get.translation(owner.name || owner.name1) || "未知角色";
		append(`${character}（${seat ? `${seat}号位` : "座位未知"}）：${count}`, identity);
	}
	const known = effects.reduce((count, effect) => count + effect.count, 0);
	const anonymous = total === null ? null : Math.max(0, total - known);
	if (anonymous > 0 || !effects.length) {
		if (policy?.semantics === "resource") append(`数量：${anonymous ?? "未记录"}（自身资源，无外部管理权）`);
		else append(`来源未知（未记录）：${anonymous ?? "数量未记录"}`);
	}
	dialog.add(section);
	return section;
}
