// PeerJS(WebRTC P2P)传输后端 —— 让纯浏览器/PWA 也能当联机房主
//
// 背景:无名杀原生联机的"开服"(game.createServer)用 require("ws").Server,只能在
// Electron/Node 环境跑,纯浏览器开不了服。但其联机架构是"房主客户端跑全部游戏逻辑、
// 服务器只做消息转发",传输层与逻辑层解耦得很干净(上层只依赖 ws 的 send/close/事件)。
//
// 本模块用 PeerJS 提供一套等价的 P2P 传输后端:房主用 peerId 当"房间号"开房,其他人
// 用房间号连入。给每条 PeerJS DataConnection 套一个适配器,伪装成上层期望的 ws 对象——
// 同时兼容两种风格:
//   - 服务端(lib.init.connection):Node ws 风格 conn.on("message"|"close", cb)
//   - 客户端(game.connect):浏览器 WebSocket 风格 conn.onopen/onmessage/onclose,onmessage 收 {data}
//
// PeerJS 默认 binary 序列化自带大消息分片,reinit 全量状态无需手动分片。

/** 房间号命名空间前缀,避免和其他用同一 PeerJS 公共信令的应用撞 peerId */
const PEER_NS = "noname-sgs-";

/**
 * 公共 STUN + 免费 TURN 兜底(对称 NAT / 严格防火墙下经 TURN 中继连通)。
 *
 * 【局限,部署者须知】这里用的是社区公开的免费服务,仅作开箱可用的默认值:
 * 同一局域网 / 宽松 NAT 下直连稳定;跨运营商的对称 NAT 需经 TURN 中继,
 * 而免费 TURN 有带宽与并发限制,不保证可用。
 * 自建部署若要稳定的跨网联机,请换成自己的 TURN(如 coturn)——
 * 覆盖 window.nonameIceServers 即可,格式同 RTCIceServer[]。
 */
const ICE_SERVERS = typeof window !== "undefined" && Array.isArray(window.nonameIceServers) ? window.nonameIceServers : [
	{ urls: "stun:stun.l.google.com:19302" },
	{ urls: "turn:openrelay.metered.ca:80", username: "openrelayproject", credential: "openrelayproject" },
	{ urls: "turn:openrelay.metered.ca:443", username: "openrelayproject", credential: "openrelayproject" },
	{ urls: "turn:openrelay.metered.ca:443?transport=tcp", username: "openrelayproject", credential: "openrelayproject" },
];

/** 房间号字符集:去掉易混淆的 0/O/1/I/L */
const CODE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/** 生成 6 位随机房间号。注:不能用 Math.random 之外的东西,这里在浏览器运行,可用 crypto */
export function generateRoomCode() {
	const arr = new Uint32Array(6);
	crypto.getRandomValues(arr);
	let code = "";
	for (let i = 0; i < 6; i++) code += CODE_CHARS[arr[i] % CODE_CHARS.length];
	return code;
}

/** 房间号规整:去空格、转大写 */
export function normalizeRoomCode(code) {
	return String(code || "").trim().toUpperCase().replace(/\s+/g, "");
}

/** 房间号 → PeerJS peerId */
export function roomCodeToPeerId(code) {
	return PEER_NS + normalizeRoomCode(code);
}

let _peerjsModule = null;
/** 动态加载 peerjs(不进主 bundle;失败抛错由调用方处理) */
async function loadPeer() {
	if (!_peerjsModule) {
		_peerjsModule = (await import("peerjs")).default;
	}
	return _peerjsModule;
}

/**
 * 把一条 PeerJS DataConnection 适配成上层期望的 ws 对象。
 * 同时支持:
 *   - conn.on("message"|"close", cb)  —— 服务端(Node ws 风格),message 回调收字符串
 *   - conn.onopen/onmessage/onerror/onclose  —— 客户端(浏览器 WebSocket 风格),onmessage 收 {data}
 * 以及 send(str) / close() / wsid。
 */
class PeerWSAdapter {
	constructor(dataConnection) {
		this._conn = dataConnection;
		/** 供服务端 Client 构造识别的稳定 id = 对端 peerId */
		this.wsid = dataConnection.peer;
		this._listeners = { message: [], close: [], open: [] };
		this._closed = false;
		// 适配器创建时连接已 open(调用方在 conn "open" 后才 new 本类)
		this._opened = true;
		this._onopen = null;

		// onmessage/onerror/onclose 赋值即生效
		this.onmessage = null;
		this.onerror = null;
		this.onclose = null;

		dataConnection.on("data", data => {
			// noname 发送的一律是 JSON 字符串;PeerJS binary 反序列化后应还原为字符串
			const str = typeof data === "string" ? data : String(data);
			for (const cb of this._listeners.message) cb(str);
			if (typeof this.onmessage === "function") this.onmessage({ data: str });
		});
		dataConnection.on("close", () => {
			if (this._closed) return;
			this._closed = true;
			for (const cb of this._listeners.close) cb();
			if (typeof this.onclose === "function") this.onclose();
		});
		dataConnection.on("error", err => {
			if (typeof this.onerror === "function") this.onerror(err);
		});
	}

	// onopen 赋值时连接通常已建立(本类在 conn "open" 之后才被 new),
	// 故赋值即异步触发一次,模拟 WebSocket.onopen 语义,让 game.connect 的握手继续。
	get onopen() {
		return this._onopen;
	}
	set onopen(cb) {
		this._onopen = cb;
		if (typeof cb === "function" && this._opened && !this._closed) {
			setTimeout(() => {
				if (!this._closed) cb();
			}, 0);
		}
	}

	/** Node ws 风格事件注册 */
	on(event, cb) {
		if (this._listeners[event]) this._listeners[event].push(cb);
		return this;
	}

	send(str) {
		if (this._closed) return;
		this._conn.send(str);
	}

	close() {
		if (this._closed) return;
		this._closed = true;
		try {
			this._conn.close();
		} catch (e) {
			/* ignore */
		}
	}
}

/**
 * 作为房主开房。
 * @param {string} roomCode 房间号(用它派生 peerId)
 * @param {(ws: PeerWSAdapter) => void} onConnection 每有一名玩家连入时回调(交给 lib.init.connection)
 * @returns {Promise<{peer: any, roomCode: string, close: () => void}>}
 */
export async function createPeerHost(roomCode, onConnection) {
	const Peer = await loadPeer();
	const peerId = roomCodeToPeerId(roomCode);
	return new Promise((resolve, reject) => {
		const peer = new Peer(peerId, { config: { iceServers: ICE_SERVERS } });
		let settled = false;
		peer.on("open", () => {
			settled = true;
			resolve({
				peer,
				roomCode: normalizeRoomCode(roomCode),
				close: () => {
					try {
						peer.destroy();
					} catch (e) {
						/* ignore */
					}
				},
			});
		});
		peer.on("connection", conn => {
			// 必须 reliable:true(有序可靠),否则游戏消息乱序会崩
			conn.on("open", () => onConnection(new PeerWSAdapter(conn)));
		});
		peer.on("error", err => {
			if (!settled) {
				settled = true;
				reject(err);
			} else {
				console.error("[peerAdapter] host peer error:", err);
			}
		});
	});
}

/**
 * 作为客户端连入房主。
 * @param {string} roomCode 房间号
 * @returns {Promise<PeerWSAdapter>} 已连通、可当 game.ws 用的适配器
 */
export async function connectToPeerHost(roomCode) {
	const Peer = await loadPeer();
	const hostPeerId = roomCodeToPeerId(roomCode);
	return new Promise((resolve, reject) => {
		// 客户端自己用随机 peerId
		const peer = new Peer({ config: { iceServers: ICE_SERVERS } });
		let settled = false;
		peer.on("open", () => {
			const conn = peer.connect(hostPeerId, { reliable: true });
			conn.on("open", () => {
				if (settled) return;
				settled = true;
				const adapter = new PeerWSAdapter(conn);
				// 客户端 peer 生命周期挂在连接上:连接关了销毁 peer
				conn.on("close", () => {
					try {
						peer.destroy();
					} catch (e) {
						/* ignore */
					}
				});
				resolve(adapter);
			});
			conn.on("error", err => {
				if (!settled) {
					settled = true;
					reject(err);
				}
			});
		});
		peer.on("error", err => {
			if (!settled) {
				settled = true;
				reject(err);
			}
		});
	});
}
