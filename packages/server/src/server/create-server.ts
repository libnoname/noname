import type { ServerInstance, ServerOptions } from "../types";
import { NonameServer } from "./noname-server";

export function createServer(options: ServerOptions = {}): ServerInstance {
	return new NonameServer(options);
}
