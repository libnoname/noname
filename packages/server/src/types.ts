export interface ServerOptions {
	port?: number;
}

export interface ServerInstance {
	start(): Promise<void>;
	stop(): Promise<void>;
}
