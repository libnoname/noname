import type { Plugin } from "vite";
import { transformEventContext } from "../../../packages/jit/src/event-context-transform.ts";

export default function eventContextPlugin(): Plugin {
	return {
		name: "noname-event-context", enforce: "pre",
		transform(source, id) {
			if (!/\.[jt]s$/.test(id) || id.includes("/node_modules/") || id.includes("/ExecutionContext.js") || id.includes("/scripts/")) return;
			return { code: transformEventContext(source, id), map: null };
		},
	};
}
