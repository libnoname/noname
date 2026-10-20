import { executionContext } from "../GameEvent/ExecutionContext.js";

/**
 * Reviewed semantics, not guesses based on names or event.player. Unknown marks
 * retain legacy aggregate behavior. Records contain data, never skill bodies.
 * `skills` are execution scopes with management rights, NOT player identities.
 */
export const markSemantics = new Map([
	["drlt_jieying_mark", {
		mode: "multi",
		skills: ["drlt_jieying", "drlt_jieying_1", "drlt_jieying_2", "drlt_jieying_3"],
		aggregateSkills: ["drlt_jieying_mark"],
		populationSkill: "drlt_jieying_mark",
	}],
	["gz_gn_jieying_mark", {
		mode: "multi",
		skills: ["gz_gn_jieying", "gz_gn_jieying_effect"],
		aggregateSkills: ["gz_gn_jieying_mark"],
		populationSkill: "gz_gn_jieying_mark",
	}],
	["xinfu_xionghuo", {
		mode: "multi",
		skills: ["xinfu_xionghuo", "xinfu_xionghuo_init", "xinfu_xionghuo_damage", "xinfu_xionghuo_effect", "xinfu_shajue"],
	}],
]);

export function contextualMarkSource(name) {
	const frame = executionContext.current, rule = markSemantics.get(name);
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
