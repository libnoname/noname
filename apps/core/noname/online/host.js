import { lib, game, ui, get, _status } from "noname";
import { ONLINE_BUILD, modePreset, normalizeCharacterPool } from "@noname/online-protocol";
import { onlineCharacterLoadList, onlineCardLoadList, validateHostedCharacterPool } from "./characterPool.js";
import { visibleSkillState } from "./publicSkillState.js";

// Only the internally launched browser has this binding. A public URL parameter
// cannot opt a player's browser into the trusted host role.
export const isHosted = () => typeof window.__nonameHostEmit === "function" && !!window.__nonameHost;
export function configureHost() {
	if (!isHosted()) return;
	const spec = window.__nonameHost;
	if (spec.build !== (import.meta.env.VITE_ONLINE_BUILD_ID || ONLINE_BUILD) || !modePreset(spec.modeId)) throw new Error("HOST_BUILD_MISMATCH");
	normalizeCharacterPool(spec.characterPool);
	Object.assign(lib.config, {
		mode: spec.modeId, new_tutorial: true, show_splash: "off", extensions: [],
		characters: onlineCharacterLoadList(), cards: ["standard"], plays: [],
		background_audio: false, background_speak: false, volumn_audio: 0, volumn_background: 0,
        background_music: "music_off", image_background: "default", image_background_random: false,
		confirm_exit: false, dev: false, debug: false, ignore_error: false,
	});
	lib.config.all.characters = onlineCharacterLoadList();
	lib.config.all.cards = onlineCardLoadList();
	lib.config.mode_config[spec.modeId] = { ...lib.config.mode_config.global, ...lib.config.mode_config[spec.modeId] };
	lib.config.mode_config[spec.modeId].player_number = String(spec.members.length);
	lib.config.mode_config[spec.modeId][spec.modeId + "_mode"] = "normal";
	localStorage.setItem(lib.configprefix + "directstart", "true");
	_status.connectMode = true;
}

export function installHost() {
	if (!isHosted()) return;
	const spec = window.__nonameHost;
	const emit = message => window.__nonameHostEmit(message);
	const characterPool = normalizeCharacterPool(spec.characterPool);
	game.notMe = true;
	game.online = false;
	game.onlineroom = true;
	game.ip = "服务器托管房间";
	game.roomId = spec.roomId;
	lib.configOL = {
		mode: spec.modeId, identity_mode: "normal", doudizhu_mode: "normal", number: spec.members.length,
		player_number: String(spec.members.length), choose_timeout: "30", observe: false,
		characterPack: characterPool.packs, cardPack: ["standard"], banned: characterPool.banned, bannedcards: [],
		choice_zhu: 3, choice_zhong: 3, choice_fan: 3, choice_nei: 3,
		double_character: false, double_nei: false, special_identity: false,
		enable_commoner: false, enable_year_limit: false, change_card: false, feiyang_version: "online", enhance_dizhu: "none",
	};
	try {
		const code = validateHostedCharacterPool(characterPool, spec.members.length);
		if (code) { emit({ type: "failed", code }); return false; }
	} catch (error) {
		console.error("Online character pool unavailable", error);
		emit({ type: "failed", code: error.code === "CHARACTER_PACK_UNAVAILABLE" ? error.code : "CHARACTER_POOL_VALIDATION_FAILED",
			resources: error.resources, diagnostic: String(error.stack || error.message || error).slice(0, 2000) });
		return false;
	}
	const clients = new Map();
	const aiSeats = new Set(spec.members.filter(member => member.isAI).map(member => member.id));
	const choices = new Map();
	const prompts = new Map();
	const consumed = new Map();
	let sendingChoice;
	let sendingEvent;
	const originalEventSend = lib.element.GameEvent.prototype.send;
	lib.element.GameEvent.prototype.send = function (...args) {
		const previous = sendingEvent;
		sendingEvent = this;
		try { return originalEventSend.apply(this, args); }
		finally { sendingEvent = previous; }
	};
	const seatStatus = player => {
		if (!player) return;
		const label = aiSeats.has(player.playerid) ? "AI" : player.ws?.closed ? "离线托管" : player.isAuto ? "托管" : "";
		game.broadcastAll(function (target, label) {
			target.node.nameol.textContent = target.nickname + (label ? " · " + label : "");
		}, player, label);
	};
	const originalSend = lib.element.Player.prototype.send;
	lib.element.Player.prototype.send = function (...args) {
		const evt = sendingEvent || choices.get(this.playerid)?.event || _status.event;
		const functionName = typeof args[0] === "function" ? args[0].name : "";
		if (typeof args[0] === "function" && (sendingEvent?.player === this || typeof args[1] === "string" && args[1].startsWith("choose") || functionName === "chooseRemote" || ["chooseButtonOL", "chooseCardOL"].includes(evt?.name) && (Array.isArray(args[1]) || args[1] && typeof args[1] === "object") || evt?.name === "chooseAnyOL" || evt?.name === "_wuxie" && args[0] === evt.send)) {
			// A server-generated backup is scoped to this prompt. Replay both its
			// definition and selection state, including when reconnecting mid-skill.
			if (sendingEvent && args[1] === sendingEvent.name) {
				const skill = sendingEvent.skill || sendingEvent._backupevent;
				const backup = sendingEvent._onlineBackup?.source + "_backup" === skill ? sendingEvent._onlineBackup : undefined;
				const promptArgs = args.slice(1);
				promptArgs[2] = [...(promptArgs[2] || [])];
				if (skill) promptArgs[2].push(["_backupevent", skill]);
				const dialog = ["chooseButton", "chooseButtonTarget", "chooseControl"].includes(sendingEvent.name) && sendingEvent.dialog?.buttons ? sendingEvent.dialog : undefined;
				const dialogData = dialog && describeChoiceDialog(dialog, sendingEvent.prompt);
				if (dialog) {
					// DOM dialogs serialize as {}. Send their trusted button data and
					// rebuild them before applying the original engine prompt.
					promptArgs[1] = promptArgs[1].map(arg => arg === dialog ? undefined :
						arg?.dialog === dialog ? { ...arg, dialog: undefined } : arg);
					promptArgs[2] = promptArgs[2].filter(([key]) => key !== "dialog" && key !== "createDialog");
				}
				args = [function (prompt, parameters, skill, info, dialogData, backup) {
					if (backup) {
						// Recreate closures from installed skill code and host-approved
						// choices instead of serializing functions that capture links.
						lib.skill[skill] = lib.skill[backup.source].chooseButton.backup(backup.choice, game.me);
						lib.skill[skill].sourceSkill = backup.source;
					} else if (skill) lib.skill[skill] = info;
					if (dialogData) {
						const dialog = ui.create.dialog(dialogData.title, "hidden");
						for (const [item, type, disabled] of dialogData.buttons) {
							dialog.add([[item], type]);
							if (disabled) dialog.buttons[dialog.buttons.length - 1].classList.add("unselectable");
						}
						parameters[2].push(["dialog", dialog], ["closeDialog", true]);
					}
					prompt(...parameters);
				}, args[0], promptArgs, skill, skill && !backup ? lib.skill[skill] : undefined, dialogData, backup];
			}
			prompts.set(this.playerid, args);
			if (choices.has(this.playerid)) choices.get(this.playerid).prompt = args;
			// Some engine choices send their prompt before calling wait(). Defer
			// that prompt so its token always arrives before any client decision.
			queueMicrotask(() => {
				const choice = choices.get(this.playerid);
				if (!choice || choice.prompt !== args) return;
				sendingChoice = { accountId: this.playerid, token: choice.token };
				try { originalSend.apply(this, args); }
				finally { sendingChoice = undefined; }
			});
			return this;
		}
		return originalSend.apply(this, args);
	};
	const originalSkillState = get.skillState;
	get.skillState = player => {
		const state = originalSkillState(player);
		return player ? visibleSkillState(state, player.playerid, Object.keys(lib.playerOL || {})) : state;
	};
	const deliver = (id, message) => {
		if (message.type === "engine" && sendingChoice?.accountId === id) message.token = sendingChoice.token;
		const client = clients.get(id);
		if (client?.restoring) {
			client.pendingBytes += JSON.stringify(message).length;
			if (client.pendingBytes > 8 * 1024 * 1024) { client.closed = true; client.restoring = false; client.pending = []; emit({ type: "failed" }); return; }
			client.pending.push(message);
		} else emit(message);
	};
	let allInited;
	const initialized = new Promise(resolve => { allInited = resolve; });
	let serial = 0;
	const originalWait = lib.element.Player.prototype.wait;
	const originalUnwait = lib.element.Player.prototype.unwait;
	lib.element.Player.prototype.unwait = function (result) {
		if (aiSeats.has(this.playerid)) return originalUnwait.call(this, result);
		const token = choices.get(this.playerid)?.token;
		choices.get(this.playerid)?.selection._onlineValidationDialog?.close();
		choices.delete(this.playerid);
		prompts.delete(this.playerid);
		deliver(this.playerid, { type: "choiceClosed", accountId: this.playerid, token });
		return originalUnwait.call(this, result);
	};
	lib.element.Player.prototype.wait = function (...args) {
		// Parallel choices may call wait even for the local game.me element.
		if (aiSeats.has(this.playerid)) return originalWait.apply(this, args);
		const token = `${spec.instanceId}:${++serial}`;
		const event = sendingEvent || _status.event;
		const prompt = prompts.get(this.playerid);
		choices.set(this.playerid, { token, event, selection: selectionEvent(event, this, prompt), prompt, deadline: Date.now() + 35000 });
		deliver(this.playerid, { type: "choice", accountId: this.playerid, token, deadline: choices.get(this.playerid).deadline });
		originalWait.apply(this, args);
		clearTimeout(lib.node.torespondtimeout[this.playerid]);
		lib.node.torespondtimeout[this.playerid] = setTimeout(() => {
			if (choices.get(this.playerid)?.token !== token) return;
			this.send(function () {
				if (!_status.auto) ui.click.auto();
			});
			this.isAuto = true;
			seatStatus(this);
			this.unwait("ai");
		}, 35000);
	};
	game.createServer = () => {
		lib.node = { clients: [], observing: [], banned: [], torespond: {}, torespondtimeout: {}, waitForResult: {}, reconnectTokens: new Map() };
		lib.playerOL = {}; lib.cardOL = {}; lib.vcardOL = {}; lib.wsOL = {};
		for (const member of spec.members) {
			// AI seats run locally in the rules engine and never wait for a client.
			if (member.isAI) continue;
			const transport = {
				wsid: member.id,
				send(raw) { deliver(member.id, { type: "engine", accountId: member.id, raw }); },
				close() { const client = clients.get(member.id); if (client) client.closed = true; },
			};
			const client = new lib.element.Client(transport, true);
			client.nickname = member.nickname; client.avatar = "caocao";
			client.accepted = true;
			clients.set(member.id, client); lib.node.clients.push(client);
		}
	};
	lib.element.content.waitForPlayer = async event => {
		game.createServer(); event.func?.();
		_status.waitingForPlayer = true;
		// Boot is complete. Waiting for remote seats is not a loading failure.
		clearTimeout(window.resetGameTimeout);
		delete window.resetGameTimeout;
		emit({ type: "ready", build: lib.version });
		await initialized;
		_status.waitingForPlayer = false;
		lib.configOL.gameStarted = true;
		game.broadcast("gameStart");
		emit({ type: "started" });
	};
	// Human seats are remote; AI seats use the engine's local decision path.
	// game.notMe keeps the host's game.me element from requesting local input.
	game.randomMapOL = function (type) {
		game.prepareArena(spec.members.length);
		if (type === "hidden") ui.arena.classList.add("playerhidden");
		const map = [];
		for (let i = 0; i < spec.members.length; i++) {
			const member = spec.members[i], player = game.players[i];
			player.playerid = member.id; player.ws = clients.get(member.id);
			if (member.isAI) player.isAuto = true;
			player.nickname = member.nickname; player.setNickname();
			lib.playerOL[player.playerid] = player; map.push([player.playerid, player.nickname]);
		}
		game.broadcast(function (map, config) {
			lib.configOL = config; ui.create.players(config.number); ui.create.me();
			const index = map.findIndex(item => item[0] === game.onlineID);
			const ordered = map.slice(index).concat(map.slice(0, index));
			for (let i = 0; i < ordered.length; i++) {
				game.players[i].playerid = ordered[i][0]; game.players[i].nickname = ordered[i][1];
				game.players[i].setNickname(); lib.playerOL[ordered[i][0]] = game.players[i];
			}
			_status.mode = "normal";
		}, map, lib.configOL);
		_status.mode = "normal";
		return game.chooseCharacterOL();
	};
	game.syncState = () => {
		for (const [id, client] of clients) if (client.inited) client.send(function (state, current, number) {
			game.updateState?.(state); _status.currentPhase = current; game.phaseNumber = number;
		}, visibleModeState(id), _status.currentPhase, game.phaseNumber);
	};
	window.__nonameHostReceive = ({ accountId, type, payload }) => {
		const client = clients.get(accountId);
		if (!client) throw new Error("Unknown seat");
		if (type === "attach" && !lib.configOL.gameStarted) {
			client.generation = payload.generation;
			client.closed = false;
			client.attached = true;
			client.send("init", client.id, lib.configOL, game.ip, false, spec.roomId);
		} else if (type === "resume" || type === "attach") {
			if (!lib.playerOL[accountId]) throw new Error("ARENA_NOT_READY");
			client.generation = payload.generation;
			client.closed = false; client.restoring = true; client.pending = []; client.pendingBytes = 0;
			client.snapshotToken = choices.get(accountId)?.token;
			const state = visibleArena(accountId);
			const raw = JSON.stringify(["reinit", ...[lib.configOL, state, visibleModeState(accountId), game.ip, null, null, {}, {}].map(value => get.stringifiedResult(value))]);
			emit({ type: "engine", accountId, raw });
			clearTimeout(client.restoreTimer);
			client.restoreTimer = setTimeout(() => { client.closed = true; client.restoring = false; client.pending = []; emit({ type: "resumeFailed", accountId }); }, 15000);
		} else if (type === "inited") {
			if (!client.attached || payload.generation !== client.generation) throw new Error("STALE_GENERATION");
			client.inited = true;
			if ([...clients.values()].every(value => value.inited)) allInited();
		} else if (type === "reinited") {
			if (payload.generation !== client.generation || !client.restoring) throw new Error("STALE_GENERATION");
			clearTimeout(client.restoreTimer); client.restoring = false; client.inited = true;
			const player = lib.playerOL[accountId], choice = choices.get(accountId);
			player.isAuto = false;
			client.send(function (skills, current, number, round, zhu, pileSize) {
				game.me.applySkills(skills); _status.auto = false; _status.currentPhase = current;
				// Reinit restores storage after player.init. Rebuild public badges
				// locally without broadcasting or revealing hidden hand data.
				for (const target of Object.values(lib.playerOL)) {
					for (const name of ["hlhj_mushi", "hlhj_mushiyuan", "hlhj_lei"]) {
						const value = target.storage[name];
						if (Array.isArray(value) ? value.length > 0 : Number(value) > 0) target.markSkill(name, null, null, true);
						else if (target.marks[name]) target.unmarkSkill(name, true);
					}
				}
				game.phaseNumber = number; game.roundNumber = round; game.zhu = zhu;
				if (ui.cardPileNumber) ui.cardPileNumber.textContent = round + "轮 剩余牌: " + pileSize;
			}, get.skillState(player), _status.currentPhase, game.phaseNumber, game.roundNumber, game.zhu, ui.cardPile.childNodes.length);
			for (const member of spec.members) seatStatus(lib.playerOL[member.id]);
			for (const message of client.pending) emit(message);
			client.pending = []; client.pendingBytes = 0;
			if (choice && choice.token === client.snapshotToken && choice.deadline > Date.now() && choice.prompt) {
				emit({ type: "choice", accountId, token: choice.token, deadline: choice.deadline });
				sendingChoice = { accountId, token: choice.token };
				try { client.send(...choice.prompt); }
				finally { sendingChoice = undefined; }
			}
			emit({ type: "resumed", accountId });
		} else if (type === "auto") {
			if (payload.generation !== client.generation || client.restoring) throw new Error("STALE_GENERATION");
			if (typeof payload.enabled !== "boolean") throw new Error("Invalid auto state");
			lib.message.server[payload.enabled ? "auto" : "unauto"].call(client);
			seatStatus(lib.playerOL[accountId]);
			if (payload.enabled && choices.has(accountId)) lib.playerOL[accountId]?.unwait("ai");
		} else if (type === "result") {
			if (payload.generation !== client.generation || client.restoring || client.closed) throw new Error("STALE_GENERATION");
			if (typeof payload.actionId !== "string" || !payload.actionId.length || payload.actionId.length > 100 || payload.turnId !== payload.token || payload.expectedRevision !== payload.token) throw new Error("INVALID_ACTION");
			const fingerprint = JSON.stringify({ accountId, token: payload.token, result: payload.result });
			if (consumed.has(payload.actionId)) {
				if (consumed.get(payload.actionId) !== fingerprint) throw new Error("DUPLICATE_ACTION");
				return;
			}
			const choice = choices.get(accountId), player = lib.playerOL[accountId];
			if (!choice || choice.token !== payload.token || choice.deadline <= Date.now() || !player) throw new Error("选择已过期");
			let result;
			try {
				result = decodeChoice(payload.result);
				validateResult(choice.selection, player, result);
			} catch (error) {
				const source = choice.selection.skill || choice.event.getParent()?.name || "unknown";
				throw new Error(`HOST_CHOICE_REJECTED (${choice.event.name}/${choice.selection.name}; source=${source}): ${error.message}`, { cause: error });
			}
			// The normal UI restores the base choice after confirmation/cancel.
			// The host has no local click, so mirror that transition explicitly.
			if (choice.selection === choice.event && choice.event.skill && choice.event._backup) {
				choice.event.restore();
				delete choice.event._onlineBackup;
			}
			// Correlation metadata comes from the host event, never from the client.
			// In particular, _wuxie's sendback ignores otherwise valid results
			// without the id of the outstanding counterspell request.
			if (choice.event.id !== undefined) result.id = choice.event.id;
			consumed.set(payload.actionId, fingerprint); if (consumed.size > 2048) consumed.delete(consumed.keys().next().value);
			player.unwait(result);
		} else if (type === "disconnect") {
			client.closed = true;
			client.restoring = false; client.pending = []; clearTimeout(client.restoreTimer);
			seatStatus(lib.playerOL[accountId]);
			// Keep the current choice until its original deadline. Future turns use
			// the engine's offline AI path, and an in-window resume can reclaim it.
		}
	};
	// A headless host has no local winner dialog, replay or restart screen.
	// Settle directly instead of depending on the end of the UI-heavy over()
	// function reaching lib.onover without an early return or rendering error.
	game.over = result => {
		if (_status.over) return;
		const results = spec.members.map(member => ({
			accountId: member.id,
			won: typeof result === "boolean" ? game.checkOnlineResult(lib.playerOL[member.id]) : null,
		}));
		_status.over = true;
		game.pause();
		for (const timer of Object.values(lib.node.torespondtimeout)) clearTimeout(timer);
		for (const client of clients.values()) clearTimeout(client.restoreTimer);
		choices.clear(); prompts.clear();
		void emit({ type: "finished", results });
	};
}

// Parallel choices store their outer coordination event in wait(), while the
// client answers a per-player selection. Recreate that selection from trusted
// host arguments and detach it so validation never executes it in the game loop.
function selectionEvent(event, player, prompt) {
	if (event.name === "chooseAnyOL") {
		// The trusted factory constructs each seat's real selection. The outer
		// coordination event has no card/target/button filters of its own.
		const selection = event.func(player, ...(event.args || []), prompt?.at(-1));
		if (!(selection instanceof lib.element.GameEvent)) throw new Error("并行选择缺少选择事件");
		event.next.remove(selection);
		selection.resolve();
		return prepareSelection(selection);
	}
	if (event.name === "chooseButtonOL") {
		const row = event.list?.find(row => row[0] === player);
		if (!row) throw new Error("缺少玩家选项");
		const selection = player.chooseButton(...row.slice(1));
		event.next.remove(selection);
		selection.resolve();
		return prepareSelection(selection);
	} else if (event.name === "chooseCardOL") {
		const selection = player.chooseCard(...event._args).set(event._set);
		event.next.remove(selection);
		selection.resolve();
		return selection;
	} else if (event.name === "_wuxie") {
		const selection = player.chooseToUse({
			type: "wuxie", id: event.id, _global_waiting: true,
			filterCard(card, current) {
				return get.name(card) === "wuxie" && lib.filter.cardEnabled(card, current, "forceEnable");
			},
		});
		event.next.remove(selection);
		selection.resolve();
		return selection;
	} else return event;
}

function prepareSelection(event) {
	if (["chooseButton", "chooseButtonTarget"].includes(event.name) && !event.dialog && Array.isArray(event.createDialog)) {
		event.dialog = event._onlineValidationDialog = ui.create.dialog(...event.createDialog, "hidden");
	}
	return event;
}

function decodeResult(value, depth = 0) {
	if (depth > 16) throw new Error("Result nesting limit exceeded");
	if (typeof value === "string") {
		if (value.startsWith("_noname_func:")) throw new Error("Forbidden executable value");
		if (value.startsWith("_noname_player:")) {
			const player = lib.playerOL[value.slice(15)];
			if (!player) throw new Error("Invalid player");
			return player;
		}
		if (value.startsWith("_noname_card:")) {
			const [id] = JSON.parse(value.slice(13));
			if (!lib.cardOL[id]) throw new Error("Invalid card");
			return lib.cardOL[id];
		}
		if (value.startsWith("_noname_vcard:")) {
			const card = decodeResult(JSON.parse(value.slice(14)), depth + 1);
			// Never mutate the host's cached virtual cards from client-supplied fields.
			if (!card || !Object.hasOwn(lib.card, card.name)) throw new Error("Invalid virtual card");
			return new lib.element.VCard({ name: card.name, suit: card.suit, number: card.number, nature: card.nature, cards: card.cards || [] });
		}
		if (value.startsWith("_noname_")) throw new Error("Unsupported reference");
		return value;
	}
	if (Array.isArray(value)) return value.map(item => decodeResult(item, depth + 1));
	if (value && typeof value === "object") {
		const result = {};
		for (const [key, item] of Object.entries(value)) {
			if (["__proto__", "constructor", "prototype"].includes(key)) throw new Error("Invalid field");
			result[key] = decodeResult(item, depth + 1);
		}
		return result;
	}
	return value;
}

export function decodeChoice(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("无效选择");
	// Legacy results can install skills and overwrite useCard event fields.
	// Only selection data crosses this boundary; engine metadata stays local.
	const result = {};
	for (const key of ["bool", "cards", "targets", "links", "control", "index", "skill", "card", "moved"]) {
		if (Object.hasOwn(value, key)) result[key] = decodeResult(value[key]);
	}
	return result;
}

export function describeChoiceDialog(dialog, prompt) {
	return {
		title: dialog.content.querySelector(".text")?.textContent || prompt || "请选择",
		buttons: dialog.buttons.map(button => {
			// textbuttons() creates plain text nodes, not Button instances with
			// _args. Keep their stable link and trusted display HTML separately.
			const [item, type] = button._args || [[button.link, button.innerHTML], "textbutton"];
			return [item, type, button.classList.contains("unselectable")];
		}),
	};
}

export function validateResult(event, player, result) {
	// Skill filters such as lijian inspect the preceding selection. Recreate
	// that context synchronously and always restore the worker's own UI state.
	const selected = { cards: ui.selected.cards, targets: ui.selected.targets, buttons: ui.selected.buttons };
	const manager = _status.eventManager, previousEvent = manager.tempEvent;
	// Detached per-seat selections are validation contexts, not running events.
	// backup() supplies the same skill, view-as and mod context used by the
	// engine UI. Work on a detached copy so rejection cannot alter the live turn.
	const context = Object.assign(new lib.element.GameEvent(event.name, false), event);
	manager.tempEvent = context;
	ui.selected.cards = []; ui.selected.targets = []; ui.selected.buttons = [];
	try {
		const assigned = typeof result.skill === "string" && (result.skill === event.skill && !!event._backup || result.skill === event._backupevent);
		if (!assigned && context.skill && context._backup) context.restore();
		if (result.skill !== undefined && result.bool !== false) {
			const using = event.name.startsWith("choose");
			if (typeof result.skill !== "string" || !using || !Object.hasOwn(lib.skill, result.skill) ||
				!assigned && !lib.filter.filterEnable(context, player, result.skill)) throw new Error("当前不能发动该技能");
			if (context.skill !== result.skill || !context._backup) context.backup(result.skill);
		}
		validateSelection(context, player, result);
		// These are engine result fields, reconstructed from validated data;
		// do not accept DOM buttons or timer-control metadata from the client.
		if (typeof result.bool === "boolean") result.confirm = result.bool ? "ok" : "cancel";
		if (result.bool !== false) result.buttons = ui.selected.buttons.slice();
		const skill = result.skill && lib.skill[result.skill];
		if (skill?.direct && !skill.clearTime) result._noHidingTimer = true;
	}
	finally { Object.assign(ui.selected, selected); manager.tempEvent = previousEvent; }
}

function validateSelection(event, player, result) {
	if (result.bool !== undefined && typeof result.bool !== "boolean") throw new Error("无效确认状态");
	for (const name of ["cards", "targets", "links"]) {
		if (result[name] !== undefined && (!Array.isArray(result[name]) || new Set(result[name]).size !== result[name].length)) throw new Error("重复或无效选择");
	}
	if (result.bool === false) {
		// A cancellation cannot carry a second, executable skill/card result.
		for (const key of Object.keys(result)) if (key !== "bool") delete result[key];
		return;
	}
	const cards = result.cards || [], targets = result.targets || [], links = result.links || [];
	const using = ["chooseToUse", "chooseToRespond"].includes(event.name);
	const otherCards = ["choosePlayerCard", "discardPlayerCard", "gainPlayerCard"].includes(event.name);
	const skillInfo = result.skill ? lib.skill[result.skill] : undefined;
	if (using && skillInfo?.chooseButton) {
		if (cards.length || targets.length || links.length || result.card || result.moved || result.control !== undefined) throw new Error("技能选项必须由服务端发起");
		return;
	}
	const checkCount = (values, selector, hasRemaining) => {
		const [min, max] = get.select(selector);
		const exhausted = values.length < min && event.forced && !event.complexSelect && hasRemaining && !hasRemaining();
		if (min >= 0 && values.length < min && !exhausted || max >= 0 && values.length > max) throw new Error("选择数量不符合规则");
		return max === -1;
	};
	// Button-target choices filter cards/targets using the preceding button selection.
	if (otherCards || ["chooseButton", "chooseButtonOL", "chooseButtonTarget"].includes(event.name)) {
		const offered = event.name === "chooseButtonOL" ? event.list?.find(row => row[0] === player)?.slice(1) : event.createDialog;
		const dialog = typeof event.dialog === "number" ? get.idDialog(event.dialog) : event.dialog;
		const buttons = dialog?.buttons;
		const available = otherCards ? (event.name === "discardPlayerCard" ? event.target.getDiscardableCards(player, event.position) :
			event.name === "gainPlayerCard" ? event.target.getGainableCards(player, event.position) : event.target.getCards(event.position)) : undefined;
		const options = buttons?.map(button => button.link) || available || collectLinks(offered);
		for (let i = 0; i < links.length; i++) {
			const matched = options.findIndex(option => sameOption(option, links[i]));
			if (matched >= 0) links[i] = options[matched];
			const link = links[i];
			if (matched < 0 && !options.some(source => typeof source === "string" && lib.characterReplace[source]?.includes(link))) throw new Error("无效选项");
			const button = buttons?.find(button => button.link === link) || (otherCards ? ui.create.button(link, "card") : { link });
			if (button.classList?.contains("unselectable")) throw new Error("当前不能选择此选项");
			if (typeof event.filterButton === "function" && !event.filterButton(button, player)) throw new Error("当前不能选择此选项");
			ui.selected.buttons.push(button);
		}
		if (new Set(links).size !== links.length) throw new Error("重复选项");
		checkCount(links, event.selectButton, () => options.some(link => !links.includes(link) &&
			(!event.filterButton || event.filterButton(buttons?.find(button => button.link === link) || { link }, player))));
		if (otherCards) {
			if (links.some(card => !available.includes(card))) throw new Error("所选卡牌不属于目标可选区域");
			if (cards.some(card => !links.includes(card))) throw new Error("卡牌与选择结果不一致");
			result.cards = links.slice();
		}
	} else if (links.length) throw new Error("当前选择不接受选项字段");
	const filterCard = event.filterCard;
	const position = event.position || "h";
	if (!otherCards) for (const card of cards) {
		if (!player.getCards(position).includes(card)) throw new Error("卡牌不属于当前可选区域");
		if (filterCard !== true && (typeof filterCard !== "function" || !filterCard.call(event, card, player, event))) throw new Error("此牌不能用于当前选择");
		if (skillInfo && !skillInfo.viewAs && skillInfo.discard !== false && skillInfo.lose !== false && !lib.filter.cardDiscardable(card, player, result.skill)) throw new Error("技能不能弃置此牌");
		ui.selected.cards.push(card);
	}
	if (using && (!skillInfo || skillInfo.viewAs)) {
		const viewAs = skillInfo?.viewAs;
		let expected = viewAs ? (typeof viewAs === "function" ? viewAs(cards, player) : viewAs) : cards[0];
		if (typeof expected === "string") expected = { name: expected };
		if (!expected || result.card && result.card.name !== expected.name) throw new Error("不能伪造出牌");
		result.card = get.autoViewAs(expected, cards);
		const acceptsCard = skillInfo ? event._backup?.filterCard : event.filterCard;
		if (typeof acceptsCard === "function" && !acceptsCard.call(event, result.card, player, event)) throw new Error("当前事件不接受此牌");
		if (event.name === "chooseToUse" && event.type === "phase" && (!lib.filter.cardEnabled(result.card, player, event) || !lib.filter.cardUsable(result.card, player, event))) throw new Error("当前不能使用此牌");
	} else if (result.card !== undefined) throw new Error("当前选择不接受出牌字段");
	const filterTarget = event.filterTarget;
	// chooseUseTarget supplies _get_card without selecting a hand card. Resolve
	// the same card as the UI (including skill view-as) from the trusted event.
	const targetCard = get.card();
	const targetPool = game.players.concat(event.deadTarget || targetCard && get.info(targetCard)?.deadTarget ? game.dead : []);
	if (targets.some(target => !targetPool.includes(target))) throw new Error("无效目标");
	for (const target of targets) {
		if (filterTarget !== true && (typeof filterTarget !== "function" || !filterTarget.call(event, targetCard, player, target))) throw new Error("当前选择不允许该目标");
		ui.selected.targets.push(target);
	}

	const acceptsPhysicalCard = card => filterCard === true || typeof filterCard === "function" && filterCard.call(event, card, player, event);
	if (!otherCards && checkCount(cards, event.filterCard ? event.selectCard : 0,
		() => player.getCards(position).some(card => !cards.includes(card) && acceptsPhysicalCard(card)))) {
		ui.selected.cards = [];
		const required = player.getCards(position).filter(acceptsPhysicalCard);
		ui.selected.cards = cards.slice();
		if (required.length !== cards.length || required.some(card => !cards.includes(card))) throw new Error("必须选择全部符合条件的牌");
	}
	const acceptsTarget = target => filterTarget === true || typeof filterTarget === "function" && filterTarget.call(event, targetCard, player, target);
	if (checkCount(targets, filterTarget ? event.selectTarget : 0,
		() => targetPool.some(target => !targets.includes(target) && acceptsTarget(target)))) {
		ui.selected.targets = [];
		const required = targetPool.filter(acceptsTarget);
		ui.selected.targets = targets.slice();
		if (required.length !== targets.length || required.some(target => !targets.includes(target))) throw new Error("必须选择全部符合条件的目标");
	}

	if (event.name === "chooseControl" && event.controls) {
		if (typeof result.control !== "string" || !event.controls.includes(result.control)) throw new Error("无效操作");
		result.index = event.controls.indexOf(result.control);
	} else { delete result.control; delete result.index; }
	if (event.name === "chooseToMove" || event.name === "chooseToMove_new") {
		const rows = event.name === "chooseToMove_new" ? (event.list || []).flatMap(row => Array.isArray(row[0]) ? row : [row]) : event.list || [];
		const remaining = rows.flatMap(row => row[1] || []);
		if (!Array.isArray(result.moved) || result.moved.length !== rows.length || result.moved.some(row => !Array.isArray(row))) throw new Error("无效移动结果");
		result.moved = result.moved.map(row => row.map(value => {
			const index = remaining.findIndex(option => sameOption(option, value));
			if (index < 0) throw new Error("不能增减或替换待移动的牌");
			return remaining.splice(index, 1)[0];
		}));
		if (remaining.length) throw new Error("不能增减或替换待移动的牌");
		if (typeof event.filterOk === "function" && !event.filterOk(result.moved)) throw new Error("移动结果不符合规则");
	} else {
		delete result.moved;
		if (typeof event.filterOk === "function" && !event.filterOk()) throw new Error("选择组合不符合规则");
	}
}

// Virtual-card button links are tuples, not physical card references. Their
// array identity changes during transport; retain the host's canonical option.
function sameOption(left, right) {
	if (left === right || left == null && right == null) return true;
	return Array.isArray(left) && Array.isArray(right) && left.length === right.length &&
		left.every((value, index) => sameOption(value, right[index]));
}

function collectLinks(value) {
	if (value && !Array.isArray(value) && typeof value === "object") return collectLinks(value.createDialog);
	if (!Array.isArray(value)) return [];
	if (value.length === 2 && Array.isArray(value[0]) && typeof value[1] === "string") return value[0];
	return value.flatMap(item => item && typeof item === "object" ? collectLinks(item) : []);
}

function visibleModeState(accountId) {
	const state = game.getState ? game.getState() : {};
	if (lib.configOL.mode === "identity") for (const [id, info] of Object.entries(state)) {
		if (id !== accountId && !lib.playerOL[id]?.identityShown) { info.identity = "cai"; delete info.special_identity; }
	}
	return state;
}
function visibleArena(accountId) {
	const state = get.arenaState();
	for (const [id, info] of Object.entries(state.players)) {
		if (id === accountId) continue;
		info.handcards = info.handcards.map(card => "_noname_card:" + JSON.stringify([card.cardid, null, null, null, null]));
		info.gaintag = info.handcards.map(() => []); info.specials = [];
		if (lib.configOL.mode === "identity" && !info.identityShown) { info.identity = "cai"; info.identityNode = ["猜", "unknown"]; delete info.side; }
	}
	return state;
}
