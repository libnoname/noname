import { _status, game, get, lib, ui } from "noname";
import { security } from "@/util/sandbox.js";

/**
 * @typedef {import("../index.js").Library["message"]["client"]} ClientMsgs
 */
/**
 * @template THIS
 * @typedef {<P extends any[], K extends keyof ClientMsgs>(
 * ...args:
 * | [func: (...args: P) => any, ...P]
 * | [msg: K , ...Parameters<ClientMsgs[K]>, ...any[]]
 * ) => THIS
 * } ClientSend
 */
export class Client {
	/**
	 * @param {import('../index.js').NodeWS | InstanceType<typeof import('ws').WebSocket> | Client} ws
	 * @param {boolean} temp
	 */
	constructor(ws, temp = false) {
		if (ws instanceof Client) {
			throw new Error("Client cannot copy.");
		}
		this.ws = ws;
		/**
		 * @type { string }
		 */
		// @ts-expect-error ignore
		this.id = ws.wsid || get.id();
		this.closed = false;

		if (!temp) {
			this.sandbox = security.createSandbox(this.id);
			if (this.sandbox) {
				Reflect.defineProperty(this, "sandbox", {
					value: this.sandbox,
					writable: false,
					configurable: false,
				});
				Reflect.defineProperty(this.sandbox, "client", {
					value: this,
					writable: false,
					configurable: false,
				});
			}
		}
	}
	/**
	 * @type {ClientSend<this>}
	 */
	send() {
		if (this.closed) {
			return this;
		}
		var args = Array.from(arguments);
		if (typeof args[0] == "function") {
			args.unshift("exec");
		}
		for (var i = 1; i < args.length; i++) {
			args[i] = get.stringifiedResult(args[i]);
		}
		return this.sendSerialized(JSON.stringify(args));
	}
	/**
	 * 把「函数 + 参数」整理成可直接下发的 JSON 报文。
	 *
	 * 抽成静态方法是为了让 `game.broadcast` 能在**多客户端**时只序列化一次：
	 * 原先每个客户端各自走一遍 `get.stringifiedResult` + `JSON.stringify`，
	 * N 个客户端就是 N 次完全相同的序列化（广播在每次记日志时都会发生）。
	 *
	 * @param {any[]} args
	 * @returns {string}
	 */
	static buildPayload(args) {
		const payload = Array.from(args);
		if (typeof payload[0] == "function") {
			payload.unshift("exec");
		}
		for (let i = 1; i < payload.length; i++) {
			payload[i] = get.stringifiedResult(payload[i]);
		}
		return JSON.stringify(payload);
	}
	/**
	 * 下发已经序列化好的报文，供广播复用同一份 payload。
	 *
	 * @param {string} payload
	 */
	sendSerialized(payload) {
		if (this.closed) {
			return this;
		}
		try {
			this.ws.send(payload);
		} catch (e) {
			this.ws.close();
		}
		return this;
	}
	/**
	 * @type {boolean | undefined}
	 */
	inited;
	close() {
		lib.node.clients.remove(this);
		lib.node.observing.remove(this);
		if (ui.removeObserve && !lib.node.observing.length) {
			ui.removeObserve.remove();
			delete ui.removeObserve;
		}
		this.closed = true;
		if (_status.waitingForPlayer) {
			for (var i = 0; i < game.connectPlayers.length; i++) {
				if (game.connectPlayers[i].playerid == this.id) {
					game.connectPlayers[i].uninitOL();
					delete game.connectPlayers[i].playerid;
				}
			}
			if (game.onlinezhu == this.id) {
				game.onlinezhu = null;
			}
			game.updateWaiting();
		} else if (lib.playerOL[this.id]) {
			var player = lib.playerOL[this.id];
			player.setNickname(player.nickname + " - 离线");
			// @ts-expect-error ignore
			game.broadcast(function (player) {
				player.setNickname(player.nickname + " - 离线");
			}, player);
			player.unwait("ai");
		}
		return this;
	}
}
