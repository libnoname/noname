import fs from "node:fs";
import path from "node:path";
import { transformEventContext } from "../../packages/jit/src/event-context-transform.ts";

// Run only after the normal production build. No engine or character artifact
// is patched: this adds a test page and compiles the fixture with its real loader.
const dist = path.resolve("apps/core/dist");
const importMap = fs.readFileSync(path.join(dist, "index.html"), "utf8").match(/<script type="importmap">[\s\S]*?<\/script>/)?.[0];
if (!importMap) throw new Error("Production import map missing");
fs.mkdirSync(path.join(dist, "tests"), { recursive: true });
fs.writeFileSync(path.join(dist, "tests/mark-integration.js"), transformEventContext(fs.readFileSync("tests/browser/mark-integration.js", "utf8"), "mark-integration.js"));
fs.writeFileSync(path.join(dist, "tests/mark-integration.html"), importMap + "\n" + fs.readFileSync("tests/browser/mark-integration.html", "utf8"));
console.log("Prepared production integration fixture in", path.join(dist, "tests"));
