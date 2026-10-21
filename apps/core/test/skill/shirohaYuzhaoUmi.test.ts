import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
	const deepStub: any = new Proxy(function () {}, {
		get(_target, property) {
			if (property === Symbol.toPrimitive) {
				return () => "";
			}
			if (property === "then") {
				return undefined;
			}
			if (property === Symbol.iterator) {
				return function* () {};
			}
			return deepStub;
		},
		apply() {
			return deepStub;
		},
		construct() {
			return deepStub;
		},
	});
	const make = (values: Record<PropertyKey, any>) =>
		new Proxy(values, {
			get(target, property) {
				return property in target ? target[property] : deepStub;
			},
		});

	const game = make({
		countGroup: vi.fn(() => 2),
		updateRoundNumber: vi.fn(),
	});
	const get = make({
		distance: vi.fn(() => 1),
		cards: vi.fn(() => [] as any[]),
		translation: (value: any) => String(value),
		cnNumber: (value: number) => String(value),
	});
	const ui = make({ cardPile: { name: "cardPile" } });
	return { game, get, ui, lib: make({}), ai: make({}), _status: make({ event: {} }) };
});

vi.mock("noname", () => ({
	game: mocks.game,
	get: mocks.get,
	ui: mocks.ui,
	lib: mocks.lib,
	ai: mocks.ai,
	_status: mocks._status,
}));

import skills from "../../character/key/skill.js";

const skill: any = (skills as any).shiroha_yuzhao_umi;
const expansionSkill = "shiroha_yuzhao";

function createPlayer(expansions: any[], moveResult: any) {
	const added: any[] = [];
	const gaintagAdd = vi.fn();
	const options: Record<string, any> = {};
	const move = {
		set(key: string, value: any) {
			options[key] = value;
			return move;
		},
		async forResult() {
			return moveResult;
		},
	};
	const player: any = {
		added,
		gaintagAdd,
		options,
		expansions,
		getExpansions: () => expansions,
		addToExpansion: (cards: any[]) => {
			added.push(cards);
			return { gaintag: { add: gaintagAdd } };
		},
		chooseToMove: () => move,
		lose: vi.fn(),
	};
	return player;
}

beforeEach(() => {
	vi.clearAllMocks();
	mocks.game.countGroup.mockReturnValue(2);
	mocks.game.updateRoundNumber.mockReturnValue(undefined);
	mocks.get.distance.mockReturnValue(1);
	mocks.get.cards.mockReturnValue([]);
});

describe("shiroha_yuzhao_umi", () => {
	it("仅当有兆且与当前回合角色距离不大于 1 时触发", () => {
		const player = createPlayer([{ id: 1 }], { bool: false });
		const event = { player: { id: 2 } };

		mocks.get.distance.mockReturnValue(1);
		expect(skill.filter(event, player)).toBe(true);

		mocks.get.distance.mockReturnValue(2);
		expect(skill.filter(event, player)).toBe(false);

		const emptyPlayer = createPlayer([], { bool: false });
		mocks.get.distance.mockReturnValue(1);
		expect(skill.filter(event, emptyPlayer)).toBe(false);
	});

	it("回合开始按势力数补兆，并可选择将牌置于牌堆顶", async () => {
		const c1 = { id: 1 },
			c2 = { id: 2 },
			c3 = { id: 3 };
		const expansions = [c1];
		mocks.get.cards.mockReturnValue([c2, c3]);
		const player = createPlayer(expansions, { bool: true, moved: [[], [c2, c3]] });

		await skill.content({}, { player: { id: 4 } }, player);

		expect(player.added).toEqual([[c2, c3]]);
		expect(player.gaintagAdd).toHaveBeenCalledWith(expansionSkill);
		expect(player.options.num).toBe(2);
		expect(player.options.forced).toBe(true);
		expect(player.options.list[0][1]).toBe(expansions);
		expect(player.lose).toHaveBeenCalledWith([c2, c3], mocks.ui.cardPile, "insert");
		expect(mocks.game.updateRoundNumber).toHaveBeenCalledTimes(1);
	});

	it("未确认置顶时仍更新轮数，但不移动牌", async () => {
		const player = createPlayer([{ id: 1 }], { bool: false });
		mocks.game.countGroup.mockReturnValue(1);
		mocks.get.cards.mockReturnValue([{ id: 2 }]);

		await skill.content({}, { player: { id: 3 } }, player);

		expect(player.lose).not.toHaveBeenCalled();
		expect(mocks.game.updateRoundNumber).toHaveBeenCalledTimes(1);
	});
});
