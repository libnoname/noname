import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { WebSocket } from "ws";
import { startServer, type ServerInstance } from "./index.js";

// 动态分配端口，避免测试间冲突
let portCounter = 19000;
function nextPort() {
	return portCounter++;
}

/** 连接到服务器，返回 ws 和收到的第一条消息 */
function connect(port: number): Promise<{ ws: WebSocket; firstMsg: any[] }> {
	return new Promise((resolve, reject) => {
		const ws = new WebSocket(`ws://127.0.0.1:${port}`);
		ws.once("message", data => {
			resolve({ ws, firstMsg: JSON.parse(data.toString()) });
		});
		ws.once("error", reject);
	});
}

/** 从 ws 读取下一条 JSON 消息 */
function nextMessage(ws: WebSocket, timeoutMs = 2000): Promise<any[]> {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => reject(new Error("message timeout")), timeoutMs);
		ws.once("message", data => {
			clearTimeout(timer);
			resolve(JSON.parse(data.toString()));
		});
	});
}

/** 发送 server 命令 */
function sendServer(ws: WebSocket, ...args: any[]) {
	ws.send(JSON.stringify(["server", ...args]));
}

/** 等待 ws 关闭 */
function waitClose(ws: WebSocket, timeoutMs = 3000): Promise<void> {
	return new Promise((resolve, reject) => {
		if (ws.readyState === WebSocket.CLOSED) return resolve();
		const timer = setTimeout(() => reject(new Error("close timeout")), timeoutMs);
		ws.once("close", () => {
			clearTimeout(timer);
			resolve();
		});
	});
}

/** 消耗所有待处理消息直到超时 */
async function drainMessages(ws: WebSocket, timeoutMs = 200): Promise<any[][]> {
	const msgs: any[][] = [];
	try {
		while (true) {
			msgs.push(await nextMessage(ws, timeoutMs));
		}
	} catch {
		// timeout = no more messages
	}
	return msgs;
}

describe("PR 1: 服务端加固", () => {
	let server: ServerInstance;

	afterEach(async () => {
		if (server) {
			// 强制关闭所有残留客户端连接
			server.wss.clients.forEach(ws => ws.terminate());
			await server.close();
		}
	}, 15000);

	// ============================================
	// 1.1 ServerConfig
	// ============================================
	describe("1.1 ServerConfig", () => {
		it("应使用指定端口启动", async () => {
			const port = nextPort();
			server = startServer({ port });
			const { ws, firstMsg } = await connect(port);
			expect(firstMsg[0]).toBe("roomlist");
			ws.close();
		});
	});

	// ============================================
	// 1.2 结构化日志 (通过 server 正常启动来间接验证)
	// ============================================
	describe("1.2 结构化日志", () => {
		it("服务器启动后能正常接受连接", async () => {
			const port = nextPort();
			server = startServer({ port });
			const { ws, firstMsg } = await connect(port);
			// roomlist 消息包含: [roomlist, rooms, events, clients, wsid]
			expect(firstMsg[0]).toBe("roomlist");
			expect(firstMsg).toHaveLength(5);
			ws.close();
		});
	});

	// ============================================
	// 1.3 速率限制 + 消息大小验证
	// ============================================
	describe("1.3 速率限制 + 消息大小", () => {
		it("超大消息应被拒绝", async () => {
			const port = nextPort();
			server = startServer({ port, maxMessageSize: 100 });
			const { ws } = await connect(port);

			// 发送超过 100 字节的消息
			const bigMsg = JSON.stringify(["server", "status", "x".repeat(200)]);
			ws.send(bigMsg);

			const msg = await nextMessage(ws);
			expect(msg).toEqual(["denied", "message_too_large"]);
			ws.close();
		});

		it("心跳消息不消耗令牌", async () => {
			const port = nextPort();
			server = startServer({ port, rateLimit: { burst: 2, sustained: 0 } });
			const { ws } = await connect(port);

			// 发送多个心跳，不应触发速率限制
			ws.send("heartbeat");
			ws.send("heartbeat");
			ws.send("heartbeat");

			// 之后发送正常消息，应该还能通过
			sendServer(ws, "status", "online");
			// 如果速率限制没有被心跳消耗，这里不会收到 denied
			await drainMessages(ws, 300);
			// 如果到这里没有被断开，测试通过
			expect(ws.readyState).not.toBe(WebSocket.CLOSED);
			ws.close();
		});

		it("超出速率限制应被丢弃，3次违规后断连", async () => {
			const port = nextPort();
			// burst=1, sustained=0: 第一条消息后令牌耗尽
			server = startServer({ port, rateLimit: { burst: 1, sustained: 0 } });
			const { ws } = await connect(port);

			// 先发 key 消耗掉唯一的令牌
			sendServer(ws, "key", ["testkey123", "1.0"]);

			// 连续快速发送触发速率限制（3次违规后断连）
			for (let i = 0; i < 5; i++) {
				sendServer(ws, "status", `msg${i}`);
			}

			await waitClose(ws, 3000);
			expect(ws.readyState).toBe(WebSocket.CLOSED);
		});
	});

	// ============================================
	// 1.4 消息中继验证
	// ============================================
	describe("1.4 消息中继验证", () => {
		it("中继消息超过大小限制应被拦截", async () => {
			const port = nextPort();
			server = startServer({ port, maxMessageSize: 100 });

			// 房主连接并创建房间
			const owner = await connect(port);
			const ownerWsid = owner.firstMsg[4];
			sendServer(owner.ws, "key", [ownerWsid, "1.0"]);
			await drainMessages(owner.ws, 300);

			sendServer(owner.ws, "create", ownerWsid, "Owner", "caocao", { number: 8 }, "identity");
			await drainMessages(owner.ws, 300);

			// 客户端连接并加入房间
			const slave = await connect(port);
			sendServer(slave.ws, "key", ["slavekey", "1.0"]);
			await drainMessages(slave.ws, 300);

			sendServer(slave.ws, "enter", ownerWsid, "Slave", "liubei");
			await drainMessages(slave.ws, 300);
			await drainMessages(owner.ws, 300);

			// 房主尝试发送超大中继消息 —— 应被拦截
			const slaveWsid = slave.firstMsg[4];
			sendServer(owner.ws, "send", slaveWsid, "x".repeat(200));

			// 等一下看 slave 有没有收到消息（不应该收到）
			const slaveMessages = await drainMessages(slave.ws, 500);
			const hasRelayedMsg = slaveMessages.some(m => typeof m === "string" || (Array.isArray(m) && m.join("").includes("x".repeat(50))));
			expect(hasRelayedMsg).toBe(false);

			owner.ws.close();
			slave.ws.close();
		});
	});

	// ============================================
	// 1.5 房间容量限制 + 成员跟踪
	// ============================================
	describe("1.5 房间容量 + 成员跟踪", () => {
		it("创建房间后 members 应包含房主", async () => {
			const port = nextPort();
			server = startServer({ port });

			const { ws, firstMsg } = await connect(port);
			const wsid = firstMsg[4];
			sendServer(ws, "key", [wsid, "1.0"]);
			await drainMessages(ws, 300);

			sendServer(ws, "create", wsid, "Host", "caocao", { number: 2 }, "identity");
			await drainMessages(ws, 300);

			expect(server.rooms.size).toBe(1);
			const room = server.rooms.values().next().value!;
			expect(room.members.size).toBe(1);
			expect(room.members.has(wsid)).toBe(true);

			ws.close();
		});

		it("加入房间后 members 应增加", async () => {
			const port = nextPort();
			server = startServer({ port });

			// 房主
			const owner = await connect(port);
			const ownerWsid = owner.firstMsg[4];
			sendServer(owner.ws, "key", [ownerWsid, "1.0"]);
			await drainMessages(owner.ws, 300);
			sendServer(owner.ws, "create", ownerWsid, "Host", "caocao", { number: 8 }, "identity");
			await drainMessages(owner.ws, 300);

			// 设置房间配置（enter 需要 room.config 存在）
			sendServer(owner.ws, "config", { number: 8 });
			await drainMessages(owner.ws, 300);

			// 客户端
			const slave = await connect(port);
			sendServer(slave.ws, "key", ["slavekey", "1.0"]);
			await drainMessages(slave.ws, 300);
			sendServer(slave.ws, "enter", ownerWsid, "Slave", "liubei");
			await drainMessages(slave.ws, 300);
			await drainMessages(owner.ws, 300);

			const room = server.rooms.values().next().value!;
			expect(room.members.size).toBe(2);

			owner.ws.close();
			slave.ws.close();
		});

		it("房间满员时应拒绝加入", async () => {
			const port = nextPort();
			server = startServer({ port });

			// 房主创建 2 人房间
			const owner = await connect(port);
			const ownerWsid = owner.firstMsg[4];
			sendServer(owner.ws, "key", [ownerWsid, "1.0"]);
			await drainMessages(owner.ws, 300);
			sendServer(owner.ws, "create", ownerWsid, "Host", "caocao", { number: 2 }, "identity");
			await drainMessages(owner.ws, 300);
			sendServer(owner.ws, "config", { number: 2 });
			await drainMessages(owner.ws, 300);

			// 第1个加入者（room.members = 2，已满）
			const s1 = await connect(port);
			sendServer(s1.ws, "key", ["s1key", "1.0"]);
			await drainMessages(s1.ws, 300);
			sendServer(s1.ws, "enter", ownerWsid, "S1", "liubei");
			await drainMessages(s1.ws, 300);
			await drainMessages(owner.ws, 300);

			// 第2个加入者应被拒绝
			const s2 = await connect(port);
			sendServer(s2.ws, "key", ["s2key", "1.0"]);
			await drainMessages(s2.ws, 300);
			sendServer(s2.ws, "enter", ownerWsid, "S2", "guanyu");

			const s2Msgs = await drainMessages(s2.ws, 500);
			const rejected = s2Msgs.some(m => m[0] === "enterroomfailed");
			expect(rejected).toBe(true);

			owner.ws.close();
			s1.ws.close();
			s2.ws.close();
		});
	});

	// ============================================
	// 1.6 房间生命周期管理
	// ============================================
	describe("1.6 房间生命周期", () => {
		it("房主断开后应销毁房间并通知成员", async () => {
			const port = nextPort();
			server = startServer({ port });

			// 创建房间
			const owner = await connect(port);
			const ownerWsid = owner.firstMsg[4];
			sendServer(owner.ws, "key", [ownerWsid, "1.0"]);
			await drainMessages(owner.ws, 300);
			sendServer(owner.ws, "create", ownerWsid, "Host", "caocao", { number: 8 }, "identity");
			await drainMessages(owner.ws, 300);
			sendServer(owner.ws, "config", { number: 8 });
			await drainMessages(owner.ws, 300);

			// 加入成员
			const slave = await connect(port);
			sendServer(slave.ws, "key", ["slavekey", "1.0"]);
			await drainMessages(slave.ws, 300);
			sendServer(slave.ws, "enter", ownerWsid, "Slave", "liubei");
			await drainMessages(slave.ws, 300);
			await drainMessages(owner.ws, 300);

			expect(server.rooms.size).toBe(1);

			// 在房主断开之前开始监听 slave 消息（防止消息丢失）
			const selfclosePromise = new Promise<boolean>(resolve => {
				const timer = setTimeout(() => resolve(false), 3000);
				slave.ws.on("message", data => {
					const msg = JSON.parse(data.toString());
					if (msg[0] === "selfclose") {
						clearTimeout(timer);
						resolve(true);
					}
				});
			});

			// 房主断开
			owner.ws.close();

			// 成员应收到 selfclose
			const gotSelfclose = await selfclosePromise;
			expect(gotSelfclose).toBe(true);

			// 房间应被销毁
			expect(server.rooms.size).toBe(0);

			slave.ws.close();
		});

		it("成员断开后应从 room.members 移除", async () => {
			const port = nextPort();
			server = startServer({ port });

			const owner = await connect(port);
			const ownerWsid = owner.firstMsg[4];
			sendServer(owner.ws, "key", [ownerWsid, "1.0"]);
			await drainMessages(owner.ws, 300);
			sendServer(owner.ws, "create", ownerWsid, "Host", "caocao", { number: 8 }, "identity");
			await drainMessages(owner.ws, 300);
			sendServer(owner.ws, "config", { number: 8 });
			await drainMessages(owner.ws, 300);

			const slave = await connect(port);
			sendServer(slave.ws, "key", ["slavekey", "1.0"]);
			await drainMessages(slave.ws, 300);
			sendServer(slave.ws, "enter", ownerWsid, "Slave", "liubei");
			await drainMessages(slave.ws, 300);
			await drainMessages(owner.ws, 300);

			const room = server.rooms.values().next().value!;
			expect(room.members.size).toBe(2);

			// 成员断开
			slave.ws.close();
			await waitClose(slave.ws);
			await new Promise(r => setTimeout(r, 200));

			expect(room.members.size).toBe(1);

			owner.ws.close();
		});
	});

	// ============================================
	// 1.7 总连接数限制
	// ============================================
	describe("1.7 总连接数限制", () => {
		it("超过 maxClients 时新连接应被拒绝", async () => {
			const port = nextPort();
			server = startServer({ port, maxClients: 2 });

			const c1 = await connect(port);
			const c2 = await connect(port);

			// 第3个连接应被拒绝
			const { ws: c3, firstMsg } = await connect(port);
			expect(firstMsg).toEqual(["denied", "server_full"]);

			await waitClose(c3, 3000);
			expect(c3.readyState).toBe(WebSocket.CLOSED);

			c1.ws.close();
			c2.ws.close();
		});
	});

	// ============================================
	// 连接基本流程验证
	// ============================================
	describe("连接基本流程", () => {
		it("连接后应收到 roomlist 和 wsid", async () => {
			const port = nextPort();
			server = startServer({ port });
			const { ws, firstMsg } = await connect(port);

			expect(firstMsg[0]).toBe("roomlist");
			expect(Array.isArray(firstMsg[1])).toBe(true); // rooms
			expect(Array.isArray(firstMsg[2])).toBe(true); // events
			expect(Array.isArray(firstMsg[3])).toBe(true); // clients
			expect(typeof firstMsg[4]).toBe("string"); // wsid

			ws.close();
		});

		it("未发送 key 应在 2 秒后被拒绝", async () => {
			const port = nextPort();
			server = startServer({ port });
			const { ws } = await connect(port);

			const msg = await nextMessage(ws, 3000);
			expect(msg).toEqual(["denied", "key"]);

			await waitClose(ws, 3000);
		});

		it("maxRooms 限制应生效", async () => {
			const port = nextPort();
			server = startServer({ port, maxRooms: 1 });

			// 房主1 创建房间
			const c1 = await connect(port);
			const c1Wsid = c1.firstMsg[4];
			sendServer(c1.ws, "key", [c1Wsid, "1.0"]);
			await drainMessages(c1.ws, 300);
			sendServer(c1.ws, "create", c1Wsid, "Host1", "caocao", { number: 8 }, "identity");
			await drainMessages(c1.ws, 300);

			// 房主2 尝试创建第二个房间 —— 应被拒绝
			const c2 = await connect(port);
			const c2Wsid = c2.firstMsg[4];
			sendServer(c2.ws, "key", [c2Wsid, "1.0"]);
			await drainMessages(c2.ws, 300);
			sendServer(c2.ws, "create", c2Wsid, "Host2", "liubei", { number: 8 }, "identity");

			const c2Msgs = await drainMessages(c2.ws, 500);
			const denied = c2Msgs.some(m => m[0] === "denied" && m[1] === "max_rooms");
			expect(denied).toBe(true);

			c1.ws.close();
			c2.ws.close();
		});
	});
});
