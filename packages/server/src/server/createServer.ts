import type { ServerInstance, ServerOptions } from "../types";
import { NonameServer } from "./NonameServer";

export function createServer(options: ServerOptions = {}): ServerInstance {
	return new NonameServer(options);
}
