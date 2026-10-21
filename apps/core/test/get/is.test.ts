import { describe, expect, it } from "vitest";
import { Is } from "@/get/is.js";

const is = new Is();

describe("get.is 卡牌形态判断", () => {
	describe("shownCard", () => {
		it.each([
			["未提供牌", undefined, false],
			["没有 gaintag", {}, false],
			["gaintag 不是数组", { gaintag: "visible_test" }, false],
			["空 gaintag", { gaintag: [] }, false],
			["普通标记", { gaintag: ["test"] }, false],
			["可见标记", { gaintag: ["visible_test"] }, true],
			["永恒可见标记", { gaintag: ["eternal_visible_test"] }, true],
			["非可见标记", { gaintag: ["invisible_test"] }, false],
			["永恒非可见标记", { gaintag: ["eternal_invisible_test"] }, false],
			["多个标记中有可见标记", { gaintag: ["foo", "visible_bar"] }, true],
		])("%s", (_name, card, expected) => {
			expect(is.shownCard(card as any)).toBe(expected);
		});
	});

	describe("virtualCard", () => {
		it.each([
			["没有 cards 字段", {}, true],
			["cards 不是数组", { cards: null }, true],
			["cards 为空数组", { cards: [] }, true],
			["cards 只有一张", { cards: [{}] }, false],
			["cards 有多张", { cards: [{}, {}] }, false],
			["实体牌的 cards 为空", { isCard: true, cards: [] }, true],
		])("%s", (_name, card, expected) => {
			expect(is.virtualCard(card as any)).toBe(expected);
		});
	});

	describe("convertedCard", () => {
		it.each([
			["没有 cards 字段", {}, false],
			["cards 不是数组", { cards: "test" }, false],
			["cards 为空数组", { cards: [] }, false],
			["转化牌只有一张", { cards: [{}] }, true],
			["显式 isCard 为 false", { isCard: false, cards: [{}] }, true],
			["实体牌", { isCard: true, cards: [{}] }, false],
		])("%s", (_name, card, expected) => {
			expect(is.convertedCard(card as any)).toBe(expected);
		});
	});

	describe("ordinaryCard", () => {
		it.each([
			["实体牌只有一张", { isCard: true, cards: [{}] }, true],
			["实体牌没有 cards 字段", { isCard: true }, false],
			["实体牌 cards 为空", { isCard: true, cards: [] }, false],
			["实体牌有多张", { isCard: true, cards: [{}, {}] }, false],
			["非实体牌只有一张", { isCard: false, cards: [{}] }, false],
			// ordinaryCard 在 isCard 为假值时直接短路返回该值（可能为 undefined），按当前实现断言
			["没有 isCard 字段", { cards: [{}] }, undefined],
		])("%s", (_name, card, expected) => {
			expect(is.ordinaryCard(card as any)).toBe(expected);
		});
	});
});
