// Rules reference: https://gitee.com/qsgs-fans/sxrm (2e0e7d3). GPL-3.0-or-later.
import { lib, game, ui, get, _status } from "noname";

const alive = () => game.filterPlayer();
const occupiedBy = p => {
	const id = p.storage.sxrm_occupy?.owner;
	return id && alive().find(q => q.playerid === id);
};
const borrowed = p =>
	alive()
		.filter(q => occupiedBy(q) === p)
		.flatMap(q => q.getVCards("e"));
const equipSkills = cards => get.skillsFromEquips(cards);
export function syncOccupation() {
	for (const p of game.filterPlayer2()) {
		p.enableSkill("sxrm_occupy_disabled");
		if (p.storage.sxrm_occupy && (!p.isIn() || !occupiedBy(p))) delete p.storage.sxrm_occupy;
		const skills = equipSkills(borrowed(p));
		if (skills.length) p.addAdditionalSkill("sxrm_occupy_borrowed", skills);
		else p.removeAdditionalSkill("sxrm_occupy_borrowed");
		if (occupiedBy(p)) {
			p.disableSkill(
				"sxrm_occupy_disabled",
				equipSkills(p.getVCards("e")).filter(s => !skills.includes(s) && !p.skills.includes(s))
			);
			p.addSkill("sxrm_occupy_block");
			p.markSkill("sxrm_occupy_block");
		} else p.removeSkill("sxrm_occupy_block");
	}
}
export function occupy(owner, target, expires = null) {
	if (owner === target || !owner.isIn() || !target.isIn()) return;
	target.storage.sxrm_occupy = { owner: owner.playerid, expires };
	game.addGlobalSkill("sxrm_occupy_rule");
	syncOccupation();
}
function distanceDelta(p, key) {
	const sum = cards => cards.reduce((n, c) => n + (get.info(c, false)?.distance?.[key] || 0), 0);
	return sum(borrowed(p)) - (occupiedBy(p) ? sum(p.getVCards("e")) : 0);
}
const rewardNames = { draw: "摸两张牌", recover: "回复1点体力", damage: "造成1点伤害", gain: "获得一名角色一张手牌", discard: "弃置场上两张牌" };
async function reward(p, key) {
	if (!p.isIn()) return;
	if (key === "draw") return await p.draw(2);
	if (key === "recover") return await p.recover();
	if (key === "damage") {
		const r = await p
			.chooseTarget("善诱：造成1点伤害", true)
			.set("ai", t => get.damageEffect(t, p, p))
			.forResult();
		if (r.bool) await r.targets[0].damage(p);
	} else if (key === "gain") {
		if (!game.hasPlayer(t => t !== p && t.countGainableCards(p, "h"))) return;
		const r = await p
			.chooseTarget("善诱：获得一名角色一张手牌", true, (c, p, t) => t !== p && t.countGainableCards(p, "h") > 0)
			.set("ai", t => -get.attitude(p, t))
			.forResult();
		if (r.bool) await p.gainPlayerCard(r.targets[0], "h", true);
	} else {
		for (let i = 0; i < 2 && p.isIn() && game.hasPlayer(t => t.countDiscardableCards(p, "ej")); i++) {
			const r = await p
				.chooseTarget("善诱：弃置场上一张牌", true, (c, p, t) => t.countDiscardableCards(p, "ej") > 0)
				.set("ai", t => get.effect(t, { name: "guohe" }, p, p))
				.forResult();
			if (r.bool) await p.discardPlayerCard(r.targets[0], "ej", true);
		}
	}
}
async function chooseReward(p, sponsor, beneficiaries = [p]) {
	const keys = ["draw", ...(beneficiaries.some(q => q.isDamaged()) ? ["recover"] : []), ...(_status.sxrm_rewards || [])];
	const controls = keys.map(k => rewardNames[k]);
	if (sponsor?.isIn()) controls.push("背水：减1点体力上限，双方执行全部奖励");
	const r = await p
		.chooseControl(controls)
		.set("prompt", "整肃奖励")
		.set("ai", () => (p.hp < 2 && p.isDamaged() ? rewardNames.recover : rewardNames.draw))
		.forResult();
	if (r.index === keys.length && sponsor) {
		await p.loseMaxHp();
		sponsor.addTempSkill("sxrmhuiduan_used", "roundStart");
		for (const q of [p, sponsor]) for (const k of ["draw", "recover", ...(_status.sxrm_rewards || [])]) await reward(q, k);
	} else for (const q of beneficiaries) await reward(q, keys[r.index] || "draw");
}

function installZhengsuRewards() {
	lib.skill.zhengsu.content = async (e, t, p) => {
		await chooseReward(p);
	};
	for (const base of ["spyanji", "spzhengjun", "houfeng"]) {
		const handler = lib.skill[base + "_share"];
		if (!handler) continue;
		handler.content = async function (e, t, p) {
			p.unmarkAuto(base, e.indexedData);
			if (!p.storage[e.indexedData]) {
				p.popup("整肃失败", "fire");
				return;
			}
			p.popup("整肃成功", "wood");
			if (base === "houfeng") {
				const beneficiaries = [
					p,
					...p
						.getStorage("houfeng_share")
						.filter(entry => entry[1] === e.indexedData && entry[0].isIn())
						.map(entry => entry[0]),
				];
				await chooseReward(p, null, beneficiaries);
			} else {
				await chooseReward(p);
				if (base === "spzhengjun" && p.isIn()) {
					const r = await p
						.chooseTarget("整军：是否令一名其他角色也获得整肃奖励？", lib.filter.notMe)
						.set("ai", q => get.attitude(p, q))
						.forResult();
					if (r.bool) await chooseReward(p, null, r.targets);
				}
			}
		};
	}
}

const skills = {
	sxrm_occupy_block: {
		charlotte: true,
		mark: true,
		marktext: "占",
		init(p) {
			p.addSkillBlocker("sxrm_occupy_block");
		},
		onremove(p) {
			p.removeSkillBlocker("sxrm_occupy_block");
			p.enableSkill("sxrm_occupy_disabled");
		},
		skillBlocker(skill, p) {
			return !!occupiedBy(p) && equipSkills(p.getVCards("e")).includes(skill) && !equipSkills(borrowed(p)).includes(skill) && !p.skills.includes(skill);
		},
		intro: {
			content(s, p) {
				return "装备仍归你所有，效果由" + get.translation(occupiedBy(p)) + "获得。";
			},
		},
	},
	sxrm_occupy_rule: {
		charlotte: true,
		forced: true,
		silent: true,
		forceDie: true,
		trigger: { global: ["equipAfter", "loseAfter", "loseAsyncAfter", "addToExpansionAfter", "gainAfter", "dieAfter", "roundStart", "roundEnd"] },
		filter(e, p) {
			return p === game.players[0];
		},
		async content(event) {
			if (event.triggername === "roundEnd" || event.triggername === "roundStart") {
				for (const p of game.filterPlayer2()) {
					const state = p.storage.sxrm_occupy;
					if (state?.expires != null && (event.triggername === "roundEnd" || state.expires < game.roundNumber)) delete p.storage.sxrm_occupy;
				}
			}
			syncOccupation();
		},
		mod: {
			attackRangeBase(p) {
				if (occupiedBy(p) || borrowed(p).length) return p.getEquipRange([...(occupiedBy(p) ? [] : p.getVCards("e")), ...borrowed(p)]);
			},
			globalFrom(p, t, d) {
				return d + distanceDelta(p, "globalFrom");
			},
			globalTo(p, t, d) {
				return d + distanceDelta(t, "globalTo");
			},
		},
	},
	sxrmjifu: {
		trigger: { global: "roundStart" },
		async cost(e, t, p) {
			e.result = await p
				.chooseTarget(get.prompt2("sxrmjifu"), lib.filter.notMe)
				.set("ai", t => t.countCards("h") - 2 - get.attitude(p, t))
				.forResult();
		},
		async content(e, t, p) {
			const q = e.targets[0];
			p.storage.sxrmjifu_target = q;
			p.addTempSkill("sxrmjifu_draw", ["roundEnd", "roundStart"]);
			q.addTempSkill("sxrmjifu_free", ["roundEnd", "roundStart"]);
			occupy(p, q, game.roundNumber);
			if (q.countCards("h")) await p.gain(q.getCards("h"), q, "giveAuto");
		},
		subSkill: {
			free: {
				charlotte: true,
				mod: {
					targetInRange() {
						return true;
					},
					cardUsable() {
						return Infinity;
					},
				},
			},
			draw: {
				charlotte: true,
				forced: true,
				trigger: { global: "drawBegin" },
				filter(e, p) {
					return e.player === p.storage.sxrmjifu_target && e.num > 0;
				},
				onremove(p) {
					delete p.storage.sxrmjifu_target;
				},
				async content(e, t, p) {
					const n = t.num,
						q = t.player;
					t.cancel();
					if (p.countCards("he") < n) await p.damage(n, q);
					else await q.gainPlayerCard(p, "he", n, true);
				},
			},
		},
	},
	sxrmjiayi: {
		trigger: { player: "phaseZhunbeiBegin" },
		frequent: true,
		async content(e, t, p) {
			await p.draw(2);
			if (!_status.sxrm_dress) _status.sxrm_dress = game.createCard("sxrm_nvzhuang", "heart", 9);
			const c = _status.sxrm_dress;
			if (p.isIn() && !get.owner(c) && ["d", "c", "s", null, undefined].includes(get.position(c, true)) && p.canEquip(c, true)) await p.useCard(c, p);
		},
	},
	sxrmsigu_lv: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(c, p, t) {
			return t !== p && t.sex === "male";
		},
		async content(e, t, p) {
			const q = e.target;
			occupy(q, p);
			const n = new Set(
				p
					.getCards("e")
					.map(c => get.suit(c))
					.filter(s => lib.suit.includes(s))
			).size;
			if (!n || !q.countGainableCards(p, "he")) return;
			const r = await p.gainPlayerCard(q, "he", [1, n], true).forResult();
			let cards = r.cards?.filter(c => get.owner(c) === p) || [];
			while (cards.length && p.isIn()) {
				const result = await p
					.chooseToGive(
						"饲骨：可以分配获得的牌",
						"h",
						[1, cards.length],
						c => cards.includes(c),
						(c, p, t) => t !== p
					)
					.set("ai", () => -1)
					.forResult();
				if (!result.bool) break;
				cards = cards.filter(c => get.owner(c) === p);
			}
		},
		ai: { order: 6, result: { target: -1 } },
	},
	sxrmyuzhu: {
		trigger: { global: "roundStart" },
		async cost(e, t, p) {
			e.result = await p
				.chooseTarget("鬻主：依次选择获得三件防具、青釭剑效果的角色", 2)
				.set("ai", q => (ui.selected.targets.length ? get.attitude(p, q) : -get.attitude(p, q)))
				.forResult();
		},
		async content(e, t, p) {
			const [shield, sword] = e.targets;
			p.storage.sxrmyuzhu_target = shield;
			p.addTempSkill("sxrmyuzhu_give", ["roundEnd", "roundStart"]);
			for (const [q, name, cards] of [
				[shield, "sxrmyuzhu_shield", ["renwang", "bagua", "tengjia"]],
				[sword, "sxrmyuzhu_sword", ["qinggang"]],
			]) {
				q.addAdditionalSkill(
					name,
					cards.flatMap(c => lib.card[c]?.skills || [])
				);
				q.addTempSkill(name, ["roundEnd", "roundStart"]);
			}
		},
		subSkill: {
			shield: {
				charlotte: true,
				mark: true,
				intro: { content: "视为装备仁王盾、八卦阵、藤甲" },
				onremove(p) {
					p.removeAdditionalSkill("sxrmyuzhu_shield");
				},
			},
			sword: {
				charlotte: true,
				mark: true,
				intro: { content: "视为装备青釭剑" },
				mod: {
					attackRange(p, n) {
						return Math.max(n, 2);
					},
				},
				onremove(p) {
					p.removeAdditionalSkill("sxrmyuzhu_sword");
				},
			},
			give: {
				charlotte: true,
				forced: true,
				trigger: { global: "damageEnd" },
				onremove(p) {
					delete p.storage.sxrmyuzhu_target;
				},
				filter(e, p) {
					return e.player === p.storage.sxrmyuzhu_target;
				},
				async content(e, t, p) {
					for (let i = 0; i < t.num && t.player.isIn(); i++) {
						for (const q of [p, t.source]) if (q?.isIn() && t.player.countCards(q === t.player ? "e" : "he")) await t.player.chooseToGive(q, q === t.player ? "e" : "he", true);
					}
				},
			},
		},
	},
	sxrmqingsang: {
		trigger: { player: "phaseJieshuBegin" },
		async cost(e, t, p) {
			e.result = await p
				.chooseTarget("请丧：依次选择决斗使用者和目标", 2, (c, p, q) => (ui.selected.targets.length ? ui.selected.targets[0].canUse({ name: "juedou" }, q) : q !== p))
				.set("ai", q => -get.attitude(p, q))
				.forResult();
		},
		async content(e) {
			const use = e.targets[0].useCard({ name: "juedou", isCard: true, sxrmqingsang: true }, e.targets[1]);
			game.addGlobalSkill("sxrmqingsang_damage");
			await use;
		},
		subSkill: {
			damage: {
				charlotte: true,
				forced: true,
				popup: false,
				trigger: { player: "damageBegin1" },
				filter(e, p) {
					return e.card?.sxrmqingsang && e.getParent("useCard").player === p;
				},
				async content(e, t) {
					const use = t.getParent("useCard"),
						target = use.targets[0];
					t.num += target.getHistory("respond", r => r.card.name === "sha" && r.getParent("useCard") === use).length;
				},
			},
		},
	},
	sxrmlulu: {
		enable: "chooseToUse",
		filter(e, p) {
			return !p.countCards("h") && game.hasPlayer(q => q !== p && q.countCards("he")) && e.filterCard({ name: "juedou", sxrmlulu: true }, p, e);
		},
		hiddenCard(p, name) {
			return name === "juedou" && !p.countCards("h") && game.hasPlayer(q => q !== p && q.countCards("he"));
		},
		chooseButton: {
			dialog(e, p) {
				return ui.create.dialog("辘辘：选择提供实体牌的角色", [alive().filter(q => q !== p && q.countCards("he")), "player"]);
			},
			check(button) {
				return -get.attitude(get.player(), button.link);
			},
			backup(links) {
				return {
					filterCard: () => false,
					selectCard: -1,
					viewAs: { name: "juedou", sxrmlulu: true },
					async precontent(e, t, p) {
						const r = await p.choosePlayerCard(links[0], "he", true).forResult();
						if (!r.bool) {
							e.getParent().cancel();
							return;
						}
						e.result.cards = r.cards;
						e.result.card = get.autoViewAs({ name: "juedou", sxrmlulu: true }, r.cards);
						delete e.result.skill;
						p.logSkill("sxrmlulu");
					},
				};
			},
			prompt() {
				return "辘辘：选择决斗目标";
			},
		},
		group: "sxrmlulu_give",
		ai: { order: 8, result: { player: 1 } },
		subSkill: {
			give: {
				trigger: { player: "useCard2" },
				forced: true,
				popup: false,
				filter(e) {
					return e.card.sxrmlulu;
				},
				async content(e, t, p) {
					const offers = [];
					// Collect decisions before revealing or transferring any card.
					for (const q of alive().filter(q => q !== p && q.countCards("h"))) {
						const r = await q
							.chooseCard("辘辘：是否展示并交给" + get.translation(p) + "一张手牌？", "h")
							.set("ai", c => (get.attitude(q, p) > 0 ? 6 - get.value(c) : -1))
							.forResult();
						if (r.bool) offers.push([q, r.cards]);
					}
					for (const [q, cards] of offers)
						if (p.isIn() && get.owner(cards[0]) === q) {
							await q.showCards(cards);
							await q.give(cards, p);
						}
				},
			},
		},
	},
	sxrmzezhu: {
		enable: "chooseToUse",
		filter(e, p) {
			return p.countCards("h") > 0 && alive().every(q => q.countCards("h") <= p.countCards("h")) && e.filterCard({ name: "sha", sxrmzezhu: true }, p, e);
		},
		filterCard: true,
		position: "h",
		selectCard: -1,
		viewAs: { name: "sha", sxrmzezhu: true },
		selectTarget() {
			return [Math.ceil(game.countPlayer() / 2), Infinity];
		},
		filterTarget(c, p, t) {
			return p !== t && lib.filter.targetEnabled(c, p, t);
		},
		complexSelect: true,
		async precontent(e) {
			e.getParent().addCount = false;
		},
		mod: {
			targetInRange(c) {
				if (c.sxrmzezhu) return true;
			},
			cardUsable(c) {
				if (c.sxrmzezhu) return Infinity;
			},
		},
		group: "sxrmzezhu_gain",
		ai: { order: 9, respondSha: true },
		subSkill: {
			gain: {
				trigger: { player: "shaMiss" },
				forced: true,
				popup: false,
				filter(e) {
					return e.card.sxrmzezhu;
				},
				async content(e, t) {
					const use = t.getParent("useCard");
					use.sxrmzezhu_misses = (use.sxrmzezhu_misses || 0) + 1;
					if (use.sxrmzezhu_misses === 2 && t.target.isIn()) {
						const cards = use.cards.filter(c => get.position(c, true) === "o");
						if (cards.length) await t.target.gain(cards, "gain2");
					}
				},
			},
		},
	},
	sxrmleixun: {
		trigger: { player: "phaseJieshuBegin" },
		limited: true,
		skillAnimation: true,
		animationColor: "thunder",
		check(e, p) {
			return p.getHistory("useCard", e => e.card.name === "sha").length > 1;
		},
		async content(e, t, p) {
			p.awakenSkill("sxrmleixun");
			p.storage.sxrmleixun = p.getHistory("useCard", e => e.card.name === "sha").length;
			p.addSkill("sxrmleixun_limit");
		},
		subSkill: {
			limit: {
				charlotte: true,
				mark: true,
				intro: {
					content(s, p) {
						return "出牌阶段出杀上限：" + p.storage.sxrmleixun;
					},
				},
				mod: {
					cardUsable(c, p) {
						if (c.name === "sha") return p.storage.sxrmleixun;
					},
				},
			},
		},
	},
	sxrmhuiduan: {
		trigger: { global: "phaseUseBegin" },
		filter(e, p) {
			return e.player !== p && p.countCards("he") > 0 && !p.hasSkill("sxrmhuiduan_used");
		},
		async cost(e, t, p) {
			e.result = await p
				.chooseCard("挥断：交给" + get.translation(t.player) + "一张牌令其整肃", "he")
				.set("ai", c => (get.attitude(p, t.player) > 0 ? 6 - get.value(c) : -1))
				.forResult();
		},
		async content(e, t, p) {
			const q = t.player;
			await p.give(e.cards, q);
			const list = ["zhengsu_leijin", "zhengsu_bianzhen", "zhengsu_mingzhi"].filter(s => !q.hasSkill(s));
			if (!list.length || !q.isIn()) return;
			const r = await p
				.chooseControl(list)
				.set("prompt", "挥断：选择整肃条件")
				.set("ai", () => list[0])
				.forResult();
			q.addTempSkill(r.control, { player: "phaseAfter" });
			q.addTempSkill("sxrmhuiduan_reward", { player: "phaseAfter" });
			(q.storage.sxrmhuiduan_reward ||= []).push({ sponsor: p, condition: r.control });
		},
		subSkill: {
			used: { charlotte: true },
			reward: {
				charlotte: true,
				forced: true,
				onremove: true,
				trigger: { player: "phaseDiscardEnd" },
				async content(e, t, p) {
					for (const entry of p.storage.sxrmhuiduan_reward || []) if (p.storage[entry.condition]) await chooseReward(p, entry.sponsor);
					delete p.storage.sxrmhuiduan_reward;
				},
			},
		},
	},
	sxrmshanyou: {
		trigger: { player: "phaseJieshuBegin" },
		filter(e, p) {
			return (p.storage.sxrmshanyou || []).length < 3;
		},
		async cost(e, t, p) {
			const keys = ["damage", "gain", "discard"].filter(k => !(p.storage.sxrmshanyou || []).includes(k));
			const r = await p
				.chooseControl([...keys.map(k => rewardNames[k]), "cancel2"])
				.set("prompt", "善诱：执行并加入本局整肃奖励")
				.set("ai", () => 0)
				.forResult();
			e.result = { bool: r.index < keys.length, cost_data: keys[r.index] };
		},
		async content(e, t, p) {
			p.markAuto("sxrmshanyou", [e.cost_data]);
			(_status.sxrm_rewards ||= []).add(e.cost_data);
			await reward(p, e.cost_data);
		},
		init() {
			installZhengsuRewards();
		},
	},
};
export default skills;
