import { game, lib, get, _status, ui } from "noname";
import { Player } from "/noname/library/element/player.js";
import { GameEvent, GameEventManager } from "/noname/library/element/gameEvent.js";
import { executionContext } from "/noname/library/element/GameEvent/ExecutionContext.js";
import { security, initializeSandboxRealms } from "/noname/util/sandbox.js";
import { CacheContext } from "/noname/library/cache/cacheContext.js";
import "/noname/init/polyfill.js";

const results = [],
	log = [];
function eq(actual, expected, label) {
	if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`${label}: ${JSON.stringify(actual)} != ${JSON.stringify(expected)}`);
}
function install(skills) {
	for (const [name, info] of Object.entries(skills)) {
		lib.skill[name] = info;
		if (info.subSkill) install(Object.fromEntries(Object.entries(info.subSkill).map(([key, value]) => [`${name}_${key}`, value])));
	}
}

export async function run() {
	lib.config ||= { mode: "identity", mode_config: {} };
	lib.config.mode_config ||= {};
	let extra, sp, gz;
	const loadProduction = path => import(/* @vite-ignore */ path);
	if (new URL(location.href).searchParams.has("production")) {
		await loadProduction("/character/extra.js");
		await loadProduction("/character/sp.js");
		await Promise.all(_status.importing?.character || []);
		extra = lib.imported.character.extra.skill;
		sp = lib.imported.character.sp.skill;
		gz = (await loadProduction("/mode/guozhan.js")).default.skill;
	} else {
		extra = (await import("/character/extra/skill.js")).default;
		sp = (await import("/character/sp/skill.js")).default;
		gz = (await import("/mode/guozhan/src/skill/character/wushuang.js")).default;
	}
	install({ new_wuhun: extra.new_wuhun, baonu: extra.baonu, renjie: extra.renjie, drlt_jieying: extra.drlt_jieying, xinfu_xionghuo: sp.xinfu_xionghuo, xinfu_shajue: sp.xinfu_shajue, gz_gn_jieying: gz.gz_gn_jieying });
	lib.config ||= {};
	lib.config.forbid = [];
	lib.config.customforbid = [];
	lib.config.forbidlist = [];
	lib.config.debug = true;
	lib.config.mode = "identity";
	lib.config.ignore_error = false;
	await initializeSandboxRealms(false);
	await security.initSecurity({ lib, game, get, ui, _status });
	game.phaseNumber = 0;
	game.players = [];
	game.dead = [];
	get.attitude = () => 0;
	game.trySkillAudio = () => {};
	game.logv = () => {};
	game.log = () => {};
	game.delay = game.delayx = () => Promise.resolve();
	game.broadcast = () => {};
	game.addVideo = (type, player, content) => log.push({ type, player: player?.playerid, content });
	ui.updatem = () => {};
	CacheContext.setProxy({ lib, game, get });
	_status.eventManager = new GameEventManager();
	_status.event = GameEvent.initialGameEvent();
	let serial = 0;
	function player(skills = []) {
		const p = document.createElement("div");
		Object.setPrototypeOf(p, Player.prototype);
		Object.assign(p, {
			playerid: `test:${++serial}`,
			name: "same_general",
			storage: {},
			marks: {},
			skills,
			awakenedSkills: [],
			forbiddenSkills: {},
			additionalSkills: {},
			tempSkills: {},
			disabledSkills: {},
			hiddenSkills: [],
			invisibleSkills: [],
			initedSkills: [],
			skipList: [],
			hp: 4,
			maxHp: 4,
			hand: [],
			equip: [],
			ai: {},
			stat: [{ skill: {}, triggerSkill: {} }],
		});
		p.isDead = () => false;
		p.isOut = () => false;
		p.isIn = () => true;
		p.getCards = zone => (zone.includes("h") ? p.hand.slice() : []);
		p.countCards = zone => p.getCards(zone).length;
		p.getGainableCards = () => p.hand.concat(p.equip);
		p.getSkills = () => p.skills.slice();
		p.getHistory = () => [];
		p.getStat = type => (type ? (p.stat[0][type] ||= {}) : p.stat[0]);
		p.trySkillAnimate = () => {};
		p.getStat = type => (type ? (p.stat[0][type] ||= {}) : p.stat[0]);
		p.logSkill = skill => log.push({ type: "skill", skill, player: p.playerid });
		p.line = () => {};
		p.isUnderControl = () => false;
		p.isUnderControl = () => false;
		p.hasSkillTag = () => false;
		p.updateMarks = () => {};
		p.mark = () => {
			const mark = document.createElement("div");
			mark.delete = () => {};
			return mark;
		};
		p.chooseTarget = () => {
			const next = game.createEvent("chooseTarget", false);
			next.player = p;
			next.setContent(async event => {
				event.result = { bool: true, targets: [p.chosen] };
			});
			return next;
		};
		// Card/HP/animation boundaries are deterministic test doubles. Dispatch,
		// filters, cost/content, compilers, Mark methods and event queues are real.
		function effect(name, operation) {
			const next = game.createEvent(name, false);
			next.player = p;
			next.setContent(async () => {
				await (p.testGate || Promise.resolve());
				if (p.rejectEffect) throw new Error("test effect rejected");
				operation();
			});
			return next;
		}
		p.give = (cards, receiver) =>
			effect("testGive", () => {
				p.hand = p.hand.filter(card => !cards.includes(card));
				receiver.hand.push(...cards);
				log.push({ type: "give", from: p.playerid, to: receiver.playerid, cards });
			});
		p.gain = (cards, from) =>
			effect("testGain", () => {
				from.hand = from.hand.filter(card => !cards.includes(card));
				from.equip = from.equip.filter(card => !cards.includes(card));
				p.hand.push(...cards);
				log.push({ type: "gain", from: from.playerid, to: p.playerid, cards });
			});
		p.damage = () =>
			effect("testDamage", () => {
				p.hp--;
				log.push({ type: "fire", player: p.playerid });
			});
		p.loseHp = () =>
			effect("testLoseHp", () => {
				p.hp--;
				log.push({ type: "loseHp", player: p.playerid });
			});
		p.addTempSkill = skill => {
			p.skills.add(skill);
			p.tempSkills[skill] = "phaseAfter";
		};
		game.players.push(p);
		game.me ||= p;
		game.players.forEach((player, index) => {
			player.seatNum = index + 1;
			player.nextSeat = game.players[(index + 1) % game.players.length];
		});
		p.addSkillTrigger(skills);
		return p;
	}
	function root(name, bearer, source) {
		const event = new GameEvent(name, false);
		event.player = bearer;
		event.source = source;
		event.setContent(async () => {});
		return event;
	}
	// The entries parameter labels expected holders for readability only.
	// Real Player.addSkillTrigger hooks and GameEvent.trigger build the queue.
	async function trigger(name, bearer, entries, fields = {}) {
		const event = root(fields.eventName || "phase", bearer);
		Object.assign(event, fields);
		event.setContent(async current => {
			await current.trigger(name);
		});
		await event.start();
		return { event };
	}
	function snapshot(mark) {
		return game.players.map(p => ({ id: p.playerid, total: p.countMark(mark), sources: p._markSources?.[mark]?.entries, hand: p.hand.slice(), hp: p.hp }));
	}
	async function scenario(name, callback) {
		const start = log.length;
		try {
			await callback();
			results.push({ name, pass: true, log: log.slice(start) });
		} catch (error) {
			results.push({ name, pass: false, error: error.stack, log: log.slice(start) });
		}
	}
	const a = player(["xinfu_xionghuo"]),
		b = player(["xinfu_xionghuo"]),
		c = player(),
		d = player();
	a.name = b.name = "xurong";
	await scenario("original double Xurong init and active transfer", async () => {
		await trigger("phaseBefore", c, [
			[a, "xinfu_xionghuo_init"],
			[b, "xinfu_xionghuo_init"],
		]);
		eq([a.countMark("xinfu_xionghuo"), b.countMark("xinfu_xionghuo")], [3, 3], "resources");
		await a.useSkill("xinfu_xionghuo", [c]);
		eq([a.countMark("xinfu_xionghuo"), c.countMark("xinfu_xionghuo")], [2, 1], "transfer");
		const damage = await trigger("damageBegin1", c, [[b, "xinfu_xionghuo_damage"]], { eventName: "damage", source: b, num: 1 });
		eq(damage.event.num, 1, "B cannot use A's mark");
		const choiceParent = new GameEvent("selectionProbe", false);
		choiceParent.player = b;
		executionContext.setSkill(choiceParent, b, "xinfu_xionghuo");
		const selection = executionContext.run({ ...executionContext.forEvent(choiceParent), executingEvent: choiceParent }, () => Player.prototype.chooseTarget.call(b, "选择目标", sp.xinfu_xionghuo.filterTarget));
		let resumeSelection;
		const selectionGate = new Promise(resolve => (resumeSelection = resolve));
		selection.setContent(async () => {
			await selectionGate;
		});
		const selectionJob = selection.start();
		await new Promise(resolve => setTimeout(resolve, 0));
		let selectionAllowed = selection.filterTarget(null, b, c);
		resumeSelection();
		await selectionJob;
		eq(selectionAllowed, true, "deferred UI filter allows B's own mark on A's bearer");
		choiceParent.next.length = 0;

		await b.useSkill("xinfu_xionghuo", [c]);
		eq(c.countMark("xinfu_xionghuo"), 2, "independent marks");
		results.push({ state: snapshot("xinfu_xionghuo") });
	});
	for (const penalty of [0, 1, 2])
		await scenario(`original Xurong penalty ${penalty}, same event competing owners`, async () => {
			if (penalty) {
				await a.useSkill("xinfu_xionghuo", [c]);
				await b.useSkill("xinfu_xionghuo", [c]);
			}
			c.hand = ["h1", "h2", "h3", "h4"];
			get.rand = () => penalty;
			const oldA = a.hand.length,
				oldB = b.hand.length,
				oldHp = c.hp;
			await trigger("phaseUseBegin", c, [
				[a, "xinfu_xionghuo_effect"],
				[b, "xinfu_xionghuo_effect"],
			]);
			eq(c.countMark("xinfu_xionghuo"), 0, "all consumed once");
			if (penalty === 2) eq([a.hand.length - oldA, b.hand.length - oldB], [2, 2], "each correct beneficiary");
			else eq(oldHp - c.hp, 2, "each owner executes one penalty");
			const before = log.length;
			await trigger("phaseUseBegin", c, [
				[a, "xinfu_xionghuo_effect"],
				[b, "xinfu_xionghuo_effect"],
			]);
			eq(log.slice(before).filter(x => ["gain", "fire", "loseHp"].includes(x.type)).length, 0, "no second consumption");
			results.push({ state: snapshot("xinfu_xionghuo") });
		});

	await scenario("stale original Xurong activation cannot create a mark without a removed resource", async () => {
		eq(a.countMark("xinfu_xionghuo"), 0, "all original resources already used");
		await a.useSkill("xinfu_xionghuo", [d]);
		eq(d.countMark("xinfu_xionghuo"), 0, "no token can be minted by a stale action");
	});
	const g1 = player(["drlt_jieying"]),
		g2 = player(["drlt_jieying"]);
	g1.name = g2.name = "shen_ganning";
	lib.skill.global.add("drlt_jieying_mark");
	await scenario("original double Gan Ning independent generation, transfer and draw", async () => {
		await trigger("phaseBegin", g1, [[g1, "drlt_jieying_1"]]);
		await trigger("phaseBegin", g2, [[g2, "drlt_jieying_1"]]);
		eq([g1.countMark("drlt_jieying_mark"), g2.countMark("drlt_jieying_mark")], [1, 1], "independent creation");
		g1.chosen = c;
		g2.chosen = c;
		await trigger("phaseJieshuBegin", g1, [[g1, "drlt_jieying_2"]]);
		const draw = await trigger(
			"phaseDrawBegin2",
			c,
			[
				[g1, "drlt_jieying"],
				[g2, "drlt_jieying"],
			],
			{ num: 2 }
		);
		eq(draw.event.num, 3, "unrelated holder grants no bonus");
		eq(game.checkMod({ name: "sha" }, c, 1, "cardUsable", c), 2, "sha bonus counts contributing sources");
		eq(game.checkMod(c, 4, "maxHandcard", c), 3, "hand limit: 4 minus two existing penalties plus one contributor");
		await trigger("phaseJieshuBegin", g2, [[g2, "drlt_jieying_2"]]);
		eq(c.countMark("drlt_jieying_mark"), 2, "two origins same bearer");
		const doubleDraw = await trigger("phaseDrawBegin2", c, [], { num: 2 });
		eq(doubleDraw.event.num, 4, "two contributing sources grant two draw bonuses");
		eq(game.checkMod({ name: "sha" }, c, 1, "cardUsable", c), 3, "two contributors grant two sha uses");
		eq(game.checkMod(c, 4, "maxHandcard", c), 4, "two penalties and two camp contributors balance");
		c.hand = ["camp1", "camp2"];
		await trigger("phaseEnd", c, [
			[g1, "drlt_jieying_3"],
			[g2, "drlt_jieying_3"],
		]);
		eq(c.countMark("drlt_jieying_mark"), 0, "both owners clear own share");
		eq(g1.hand.slice(-2), ["camp1", "camp2"], "first owner collects current hand");
		results.push({ state: snapshot("drlt_jieying_mark") });
	});
	const z1 = player(["gz_gn_jieying"]),
		z2 = player(["gz_gn_jieying"]);
	lib.skill.global.add("gz_gn_jieying_mark");
	await scenario("original guozhan camp return after an awaited give", async () => {
		await trigger("phaseBefore", d, [
			[z1, "gz_gn_jieying"],
			[z2, "gz_gn_jieying"],
		]);
		z1.chosen = d;
		z2.chosen = d;
		await trigger("phaseEnd", z1, [[z1, "gz_gn_jieying_effect"]]);
		const draw = await trigger("phaseDrawBegin2", d, [[d, "gz_gn_jieying_mark"]], { num: 2 });
		eq(draw.event.num, 3, "one contributor despite two holders");
		await trigger("phaseEnd", z2, [[z2, "gz_gn_jieying_effect"]]);
		d.hand = ["gz1", "gz2"];
		await trigger("phaseAfter", d, [
			[z1, "gz_gn_jieying_effect"],
			[z2, "gz_gn_jieying_effect"],
		]);
		eq([d.countMark("gz_gn_jieying_mark"), z1.countMark("gz_gn_jieying_mark"), z2.countMark("gz_gn_jieying_mark")], [0, 1, 1], "return to owners");
		results.push({ state: snapshot("gz_gn_jieying_mark") });
	});
	await scenario("concurrent roots leave no event stack and retain correct Mark parents", async () => {
		await Promise.all([trigger("phaseBegin", g1, [[g1, "drlt_jieying_1"]]), trigger("phaseBegin", g2, [[g2, "drlt_jieying_1"]])]);
		eq([g1.countMark("drlt_jieying_mark"), g2.countMark("drlt_jieying_mark")], [1, 1], "separate roots");
		eq(_status.eventManager.eventStack.length, 0, "empty event stack");
		const marked = game.getGlobalHistory("everything").filter(e => e.name === "addMark" && e.markName === "drlt_jieying_mark");
		for (const e of marked) eq(e.player.playerid, e.getParent("drlt_jieying_1", true)?.player.playerid || e.getParent("drlt_jieying_2", true)?.targets?.[0]?.playerid, "mark parent belongs to executing skill");
	});

	await scenario("two pending event continuations preserve their own parent across await", async () => {
		let releaseA, releaseB;
		const gateA = new Promise(r => (releaseA = r)),
			gateB = new Promise(r => (releaseB = r));
		const captures = [];
		function pending(player, gate) {
			const event = new GameEvent("probeSkill", false);
			event.player = player;
			executionContext.setSkill(event, player, "drlt_jieying_1");
			event.setContent(async current => {
				await gate;
				const child = game.createEvent("probeChild", false);
				child.player = player;
				child.setContent(async () => {});
				captures.push(child.parent === current);
			});
			return event;
		}
		const ea = pending(g1, gateA),
			eb = pending(g2, gateB),
			pa = ea.start(),
			pb = eb.start();
		await new Promise(r => setTimeout(r, 0));
		releaseA();
		await pa;
		eq(_status.eventManager.eventStack.includes(eb), true, "pending B remains in stack when A finishes first");
		releaseB();
		await pb;
		eq(captures, [true, true], "parents follow continuation, not ambient stack top");
	});

	await scenario("original guozhan cannot resolve the same source again while give awaits", async () => {
		const target = player();
		z1.chosen = target;
		await trigger("phaseEnd", z1, [[z1, "gz_gn_jieying_effect"]]);
		target.hand = ["waiting1", "waiting2"];
		let release;
		target.testGate = new Promise(r => (release = r));
		const first = trigger("phaseAfter", target, [[z1, "gz_gn_jieying_effect"]]);
		await new Promise(r => setTimeout(r, 0));
		const second = trigger("phaseAfter", target, [[z1, "gz_gn_jieying_effect"]]);
		await new Promise(r => setTimeout(r, 0));
		release();
		await Promise.all([first, second]);
		delete target.testGate;
		eq(z1.countMark("gz_gn_jieying_mark"), 1, "one returned mark, no phantom recreation");
	});

	await scenario("original shared nightmare and self-resource skills keep legacy totals", async () => {
		const w1 = player(["new_wuhun"]),
			w2 = player(["new_wuhun"]),
			r1 = player(["baonu", "renjie"]),
			r2 = player(["baonu"]);
		await trigger("damageEnd", w1, [], { eventName: "damage", source: c, num: 1 });
		await trigger("damageEnd", w2, [], { eventName: "damage", source: c, num: 2 });
		eq(c.countMark("new_wuhun"), 3, "shared nightmare total");
		executionContext.run({ player: w2, skill: "new_wuhun" }, () => eq(c.countMark("new_wuhun"), 3, "all holders see shared marks"));
		await trigger("damageEnd", r1, [], { eventName: "damage", source: c, num: 2 });
		eq([r1.countMark("baonu"), r1.countMark("renjie"), r2.countMark("baonu")], [2, 2, 0], "independent self resources");
	});

	await scenario("original camp effect releases its source claim after a rejected child event", async () => {
		const target = player();
		z2.chosen = target;
		await trigger("phaseEnd", z2, []);
		target.hand = ["recover1"];
		target.rejectEffect = true;
		let rejected = false;
		try {
			await trigger("phaseAfter", target, []);
		} catch (error) {
			rejected = error.message.includes("test effect rejected");
		}
		eq(rejected, true, "child failure propagated");
		eq(target.countMark("gz_gn_jieying_mark"), 1, "not consumed before give completes");
		delete target.rejectEffect;
		await trigger("phaseAfter", target, []);
		eq([target.countMark("gz_gn_jieying_mark"), z2.countMark("gz_gn_jieying_mark")], [0, 1], "claim released for a new valid resolution");
	});
	await scenario("real removeSkill and addSkill keep other sources and stable instance identity", async () => {
		g1.chosen = c;
		g2.chosen = c;
		await trigger("phaseJieshuBegin", g1, []);
		await trigger("phaseJieshuBegin", g2, []);
		const id = g1.playerid;
		g1.removeSkill("drlt_jieying");
		await trigger("phaseEnd", c, []);
		eq([c.countMark("drlt_jieying_mark", { source: g1.playerid }), c.countMark("drlt_jieying_mark", { source: g2.playerid })], [1, 0], "lost source is retained but cannot be stolen");
		g1.addSkill("drlt_jieying");
		await trigger("phaseEnd", c, []);
		eq([g1.playerid, c.countMark("drlt_jieying_mark")], [id, 0], "same instance regains only its own relation");
	});
	await scenario("official wire serializer, skill state restore and video storage handler preserve sources", async () => {
		c.markAuto("arrayTransport", [d], { source: a });
		c.markAuto("arrayTransport", [d], { source: b });
		const oldPlayers = game.players.slice();
		lib.playerOL = {};
		oldPlayers.forEach(p => (lib.playerOL[p.playerid] = p));
		const data = JSON.parse(JSON.stringify(get.stringifiedResult(get.skillState(a))));
		game.players = [];
		game.me = undefined;
		lib.playerOL = {};
		const restored = new Map(
			oldPlayers.map(old => {
				const copy = player(old.skills);
				copy.playerid = old.playerid;
				lib.playerOL[copy.playerid] = copy;
				return [old.playerid, copy];
			})
		);
		restored.get(a.playerid).applySkills(get.parsedResult(data));
		const restoredC = restored.get(c.playerid),
			restoredD = restored.get(d.playerid);
		eq(restoredC.countMark("arrayTransport", { source: a.playerid }), 1, "source A restored");
		eq(restoredC.countMark("arrayTransport", { source: b.playerid }), 1, "source B restored");
		eq(restoredC.storage.arrayTransport[0] === restoredD, true, "same aggregate member reference after decoding");
		const video = log.filter(entry => entry.type === "storage" && entry.content?.[2] === "mark");
		const replay = player();
		for (const entry of video.filter(entry => entry.player === c.playerid)) game.videoContent.storage(replay, entry.content);
		eq(replay.countMark("arrayTransport", { source: a.playerid }), 1, "video source A");
		eq(replay.countMark("arrayTransport", { source: b.playerid }), 1, "video source B");
		game.videoContent.storage(replay, ["arrayTransport", ["legacy"]]);
		eq(replay.countMark("arrayTransport", { source: a.playerid }), 0, "old replay has unknown origins");
	});
	await scenario("different generals acquiring the same original skill retain separate sources", async () => {
		const first = player(["xinfu_xionghuo"]),
			second = player(["xinfu_xionghuo"]),
			target = player();
		first.name = "liubei";
		second.name = "caocao";
		await trigger("enterGame", first, [], { eventName: "enterGame" });
		await trigger("enterGame", second, [], { eventName: "enterGame" });
		await first.useSkill("xinfu_xionghuo", [target]);
		const damage = await trigger("damageBegin1", target, [], { eventName: "damage", source: second, num: 1 });
		eq(damage.event.num, 1, "borrowed skill cannot use the other instance's share");
		await second.useSkill("xinfu_xionghuo", [target]);
		eq(target.countMark("xinfu_xionghuo"), 2, "both borrowed holders contribute independently");
		get.rand = () => 0;
		const hp = target.hp;
		await trigger("phaseUseBegin", target, []);
		eq([target.countMark("xinfu_xionghuo"), hp - target.hp], [0, 2], "each borrowed holder consumes only its share");
		results.push({ state: snapshot("xinfu_xionghuo") });
	});

	await scenario("GameEvent then callbacks keep their registering skill frame", async () => {
		const owner = game.players[0],
			values = [],
			event = new GameEvent("callbackOwner", false);
		event.player = owner;
		executionContext.setSkill(event, owner, "drlt_jieying_1");
		event.setContent(async () => {
			const child = game.createEvent("callbackChild", false);
			child.setContent(async () => {});
			await child.then(async () => {
				values.push(executionContext.current?.player?.playerid);
				await Promise.resolve();
				values.push(executionContext.current?.player?.playerid);
			});
		});
		await event.start();
		eq(values, [owner.playerid, owner.playerid], "callback source before and after await");
	});

	await scenario("legacy Step content keeps object rest syntax without new free compiler helpers", async () => {
		const p = game.players[0],
			probe = new GameEvent("legacyRestProbe", false);
		probe.player = p;
		probe.payload = { unused: 0, kept: 7 };
		probe.setContent(function () {
			const { unused, ...rest } = event.payload;
			player.restProbe = rest.kept;
		});
		await probe.start();
		eq(p.restProbe, 7, "legacy body can be recompiled without module-local helpers");
	});

	await scenario("legacy Step nested async callbacks retain the compiler dependency", async () => {
		const probe = new GameEvent("legacyAsyncCallbackProbe", false);
		probe.player = game.players[0];
		probe.setContent(function () {
			event.callback = async () => {
				await Promise.resolve();
				return 7;
			};
		});
		await probe.start();
		eq(await probe.callback(), 7, "callback helper survives Step recompilation and Rollup renaming");
	});

	await scenario("actual reconnect restoration phase resolves self and later-player array members", async () => {
		const self = player(),
			later = player();
		lib.playerOL[self.playerid] = self;
		lib.playerOL[later.playerid] = later;
		self.markAuto("reconnectArray", [self, later], { source: game.players[0] });
		const state = { players: { [self.playerid]: { markState: JSON.stringify(get.stringifiedResult(self._exportMarkState())) }, [later.playerid]: { markState: JSON.stringify(get.stringifiedResult(later._exportMarkState())) } } };
		const oldSelf = self.playerid,
			oldLater = later.playerid;
		delete lib.playerOL[oldSelf];
		delete lib.playerOL[oldLater];
		const copySelf = player();
		copySelf.playerid = oldSelf;
		lib.playerOL[oldSelf] = copySelf;
		const copyLater = player();
		copyLater.playerid = oldLater;
		lib.playerOL[oldLater] = copyLater;
		// Execute the actual post-registration phase from the loaded reinit
		// handler. This is a handler-phase test, not a live socket reconnect.
		const body = lib.message.client.reinit.toString();
		const marker = body.match(/for \(const \[[\w$]+, [\w$]+\] of Object.entries\(state.players\)\)/)?.[0];
		const start = marker ? body.indexOf(marker) : -1;
		if (start < 0) throw new Error("reconnect post-registration phase missing");
		let end = body.indexOf("{", start),
			depth = 1;
		for (end++; depth; end++) {
			if (body[end] === "{") depth++;
			if (body[end] === "}") depth--;
		}
		new Function("state", "lib", body.slice(start, end))(state, lib);
		eq(copySelf.storage.reconnectArray[0] === copySelf, true, "self instance restored");
		eq(copySelf.storage.reconnectArray[1] === copyLater, true, "forward instance restored");
		copySelf.unmarkAuto("reconnectArray", copyLater, { source: game.players[0] });
		eq(copySelf.storage.reconnectArray.length, 1, "member can be removed by Player identity");
	});

	results.push({
		skillExecutions: game
			.getGlobalHistory("everything")
			.filter(e => e.skill)
			.map(e => ({ name: e.name, skill: e.skill, actor: e.player?.playerid, triggerBearer: e._trigger?.player?.playerid })),
		events: game
			.getGlobalHistory("everything")
			.filter(e => e.name === "addMark" || e.name === "removeMark")
			.map(e => ({ type: e.name, bearer: e.player?.playerid, mark: e.markName, source: e.markSource, num: e.num, actor: e.parent?.player?.playerid })),
	});

	eq(executionContext.current, undefined, "context clean after skills");
	return results;
}
