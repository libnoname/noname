import type { WebSocket } from "ws";

export interface ServerOptions {
	port?: number;
}

export interface ServerInstance {
	start(): Promise<void>;
	stop(): Promise<void>;
}

export interface Client extends WebSocket {
	wsid: string;
	nickname: string;
	avatar: string;
	clientIp: string;
	onlineKey?: string;
	status?: string;
	owner?: Client;
	room?: Room;
	servermode?: boolean;
	beat?: boolean;
	keyCheck?: NodeJS.Timeout;
	heartbeat?: NodeJS.Timeout;
}

export interface Room {
	key: string;
	owner?: Client;
	config?: any;
	servermode?: boolean;
}

export interface EventItem {
	id: string;
	creator: string;
	nickname: string;
	avatar: string;
	utc: number;
	day: number;
	hour: number;
	content: string;
	members: string[];
}
