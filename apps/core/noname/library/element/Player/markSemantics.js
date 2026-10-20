import { executionContext } from "../GameEvent/ExecutionContext.js";

/**
 * Reviewed semantics, not guesses based on names or event.player. Unknown marks
 * retain legacy aggregate behavior. Records contain data, never skill bodies.
 * `skills` are execution scopes with management rights, NOT player identities.
 */
/** @type {Map<string, {mode: string, skills?: string[], consumeSkills?: string[], transferSkills?: string[], aggregateSkills?: string[], populationSkill?: string}>} */
export const markSemantics = new Map([
	["new_wuhun", { mode: "shared" }],
	["wuhun", { mode: "shared" }],
	["baonu", { mode: "resource" }],
	["renjie", { mode: "resource" }],
	[
		"drlt_jieying_mark",
		{
			mode: "multi",
			consumeSkills: ["drlt_jieying_3"],
			transferSkills: ["drlt_jieying_2"],
			skills: ["drlt_jieying", "drlt_jieying_1", "drlt_jieying_2", "drlt_jieying_3"],
			aggregateSkills: ["drlt_jieying_mark"],
			populationSkill: "drlt_jieying_mark",
		},
	],
	[
		"gz_gn_jieying_mark",
		{
			mode: "multi",
			consumeSkills: ["gz_gn_jieying_effect"],
			transferSkills: ["gz_gn_jieying_effect"],
			skills: ["gz_gn_jieying", "gz_gn_jieying_effect"],
			aggregateSkills: ["gz_gn_jieying_mark"],
			populationSkill: "gz_gn_jieying_mark",
		},
	],
	[
		"xinfu_xionghuo",
		{
			mode: "multi",
			consumeSkills: ["xinfu_xionghuo_effect"],
			transferSkills: ["xinfu_xionghuo"],
			skills: ["xinfu_xionghuo", "xinfu_xionghuo_init", "xinfu_xionghuo_damage", "xinfu_xionghuo_effect", "xinfu_shajue"],
		},
	],
]);

export function contextualMarkSource(name) {
	const frame = executionContext.current,
		rule = markSemantics.get(name);
	if (!frame || !rule || !["owned", "multi"].includes(rule.mode) || !rule.skills?.includes(frame.skill)) return;
	const id = frame.player?.playerid;
	return typeof id === "string" && id.length ? id : undefined;
}

/** Population queries in an aggregate mark's benefit scope count contributors. */
export function contextualMarkPopulation() {
	const frame = executionContext.current;
	if (!frame?.player) return;
	for (const [mark, rule] of markSemantics) {
		if (rule.populationSkill === frame.skill) {
			return player => frame.player.hasMark(mark, { source: player });
		}
	}
}

// A claim reserves management of one existing source during a yielding effect.
// It is neither a second counter nor a global "current owner". Aggregate reads
// and other sources remain unchanged; claims never manufacture provenance.
const claims = new WeakMap();
export function contextualMarkAvailable(bearer, mark, source) {
	const claim = claims.get(bearer)?.get(mark)?.get(source);
	return !claim || claim === executionContext.current?.event;
}

export function claimMarkEffect(skill, bearer, source, event) {
	for (const [mark, rule] of markSemantics) {
		if (!rule.consumeSkills?.includes(skill)) continue;
		const id = source?.playerid;
		if (!bearer || !id || !bearer.hasMark(mark, { source: id })) return false;
		let marks = claims.get(bearer);
		if (!marks) claims.set(bearer, (marks = new Map()));
		let sources = marks.get(mark);
		if (!sources) marks.set(mark, (sources = new Map()));
		if (sources.has(id)) return false;
		sources.set(id, event);
		return () => {
			if (sources.get(id) === event) sources.delete(id);
			if (!sources.size) marks.delete(mark);
			if (!marks.size) claims.delete(bearer);
		};
	}
}

// Only declared transfer scopes may pair legacy remove/add calls. Other scopes
// keep consumption-then-creation semantics. Receipts contain actual committed
// removals, never requested quantities or guesses from temporal adjacency.
const transferReceipts = new WeakMap();
function transferFrame(mark) {
	const frame = executionContext.current;
	return frame?.event && markSemantics.get(mark)?.transferSkills?.includes(frame.skill) ? frame : undefined;
}
export function recordMarkTransfer(mark, bearer, source, quantity) {
	const frame = transferFrame(mark);
	if (!frame || frame.event.finished || quantity <= 0) return;
	let receipts = transferReceipts.get(frame.event);
	if (!receipts) transferReceipts.set(frame.event, (receipts = []));
	receipts.push({ mark, bearer, source, quantity });
}
export function planMarkTransfer(mark, source, quantity) {
	const frame = transferFrame(mark);
	if (!frame) return;
	const receipts = frame.event.finished ? [] : (transferReceipts.get(frame.event) || []).filter(receipt => receipt.mark === mark && receipt.source === source && receipt.quantity > 0);
	const amount = Math.min(
		quantity,
		receipts.reduce((sum, receipt) => sum + receipt.quantity, 0)
	);
	return {
		amount,
		commit() {
			let left = amount;
			for (const receipt of receipts) {
				const used = Math.min(left, receipt.quantity);
				receipt.quantity -= used;
				left -= used;
			}
			const all = transferReceipts.get(frame.event);
			if (all?.every(receipt => receipt.quantity === 0)) transferReceipts.delete(frame.event);
		},
	};
}
