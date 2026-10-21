import { afterEach, describe, expect, it, vi } from "vitest";
import { get } from "noname";
import skills from "../../character/xianding/skill.js";

const dcsbguanwu: any = (skills as any).dcsbguanwu;
const mark = dcsbguanwu.subSkill.mark;
const effectName = "dcsbguanwu_effect";

function createPlayer(history: any[] = []) {
	const marks = new Map<string, number>();
	const skills: Array<[string, string | undefined]> = [];
	const gains: any[] = [];
	const player: any = {
		marks,
		skills,
		gains,
		hasMark: (name: string) => (marks.get(name) ?? 0) > 0,
		countMark: (name: string) => marks.get(name) ?? 0,
		addMark: (name: string, count: number) => marks.set(name, (marks.get(name) ?? 0) + count),
		addTempSkill: (name: string, expire?: string) => skills.push([name, expire]),
		addSkill: (name: string) => skills.push([name, undefined]),
		gain: async (options: any) => gains.push(options),
		getRoundHistory: () => history,
	};
	return player;
}

function createShaEvent() {
	return { name: "useCard1", card: { name: "sha" } };
}

function createDamageEvent(num = 1, cardName = "sha") {
	return { name: "damageBegin1", num, card: { name: cardName } };
}

afterEach(() => {
	delete (get as any).cardPile;
	vi.restoreAllMocks();
});

describe("dcsbguanwu", () => {
	it("init 注册标记技能", () => {
		const player = createPlayer();
		dcsbguanwu.init(player, "dcsbguanwu");
		expect(player.skills).toEqual([["dcsbguanwu_mark", undefined]]);
	});

	it("每第二次使用【杀】时叠一层标记", async () => {
		const history: any[] = [];
		const player = createPlayer(history);
		for (let i = 1; i <= 4; i++) {
			const event = createShaEvent();
			history.push(event);
			const shouldTrigger = mark.filter(event, player);
			expect(shouldTrigger).toBe(i % 2 === 0);
			if (shouldTrigger) {
				await mark.content({}, event, player);
			}
		}
		expect(player.countMark(effectName)).toBe(2);
		expect(player.skills).toEqual([
			[effectName, "roundStart"],
			[effectName, "roundStart"],
		]);
	});

	it("非【杀】不触发标记", () => {
		const history = [{ name: "useCard1", card: { name: "shan" } }];
		const player = createPlayer(history);
		expect(mark.filter(history[0], player)).toBe(false);
	});

	it("本轮第 0–6 张【杀】的伤害加成依次为 0、0、1、1、2、2、3", async () => {
		const history: any[] = [];
		const player = createPlayer(history);
		const nums = [1];
		for (let i = 1; i <= 6; i++) {
			const useEvent = createShaEvent();
			history.push(useEvent);
			if (mark.filter(useEvent, player)) {
				await mark.content({}, useEvent, player);
			}
			const damage = createDamageEvent(1);
			if (dcsbguanwu.filter(damage, player)) {
				await dcsbguanwu.content({}, damage, player);
			}
			nums.push(damage.num);
		}
		expect(nums.map(num => num - 1)).toEqual([0, 0, 1, 1, 2, 2, 3]);
	});

	it("非【杀】伤害不触发加成，初始伤害不为 1 时正确累加", async () => {
		const player = createPlayer();
		player.addMark(effectName, 2);

		const notSha = createDamageEvent(1, "shan");
		expect(dcsbguanwu.filter(notSha, player)).toBe(false);

		const damage = createDamageEvent(3);
		expect(dcsbguanwu.filter(damage, player)).toBe(true);
		await dcsbguanwu.content({}, damage, player);
		expect(damage.num).toBe(5);
	});

	it("回合开始获取青龙偃月刀，且与伤害分支互不影响", async () => {
		const player = createPlayer();
		const card = { name: "qinglong" };
		(get as any).cardPile = vi.fn(() => card);

		const phase = { name: "phase" };
		expect(dcsbguanwu.filter(phase, player)).toBe(card);
		await dcsbguanwu.content({}, phase, player);
		expect(player.gains).toEqual([{ cards: [card], animate: "gain2" }]);

		const damage = createDamageEvent(1);
		expect(dcsbguanwu.filter(damage, player)).toBe(false);
	});
});
