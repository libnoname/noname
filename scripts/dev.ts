import { spawn } from "node:child_process";
spawn("pnpm -F @noname/fs dev --debug --dirname=../../apps/core", { shell: true });
spawn("pnpm -F ./packages/extension/** build --mode development --watch", { shell: true });
spawn("pnpm -F noname dev --open", { shell: true });
