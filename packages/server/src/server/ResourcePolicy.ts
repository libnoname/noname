import type { IncomingMessage } from "node:http";

import type { Client } from "../types";

export interface PolicyDecision {
	allowed: boolean;
	reason?: string;
}

export interface ConnectionPolicyInput {
	ip: string;
	request: IncomingMessage;
	sessionCount: number;
}

export interface MessagePolicyInput {
	client: Client;
	raw: string;
	byteLength: number;
}

export interface ResourcePolicy {
	checkConnection(input: ConnectionPolicyInput): PolicyDecision;
	checkMessage(input: MessagePolicyInput): PolicyDecision;
}

export const allowAllResourcePolicy: ResourcePolicy = {
	checkConnection() {
		return { allowed: true };
	},

	checkMessage() {
		return { allowed: true };
	},
};
