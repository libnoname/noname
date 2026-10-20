import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const browser = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = Number(process.env.MARK_CDP_PORT || 9237);
const profile = path.resolve(process.env.MARK_PROFILE || "audit/mark-stage2-browser-profile");
const url = process.env.MARK_TEST_URL || "http://127.0.0.1:8081/@fs/C:/Users/32360/Desktop/noname/tests/browser/mark-integration.html";
fs.mkdirSync(profile, { recursive: true });
const processHandle = spawn(browser, ["--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "about:blank"], { windowsHide: true, stdio: "ignore" });
const smoke = process.env.MARK_SMOKE === "1";
let socket;
try {
	let target;
	for (let i = 0; i < 30; i++) {
		try {
			target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find(t => t.type === "page");
			if (target) break;
		} catch {}
		await delay(250);
	}
	if (!target) throw new Error("Chrome DevTools did not start");
	socket = new WebSocket(target.webSocketDebuggerUrl);
	await new Promise((resolve, reject) => {
		socket.onopen = resolve;
		socket.onerror = reject;
	});
	let serial = 0;
	const pending = new Map(),
		errors = [];
	socket.onmessage = event => {
		const message = JSON.parse(event.data);
		if (message.id) {
			const entry = pending.get(message.id);
			pending.delete(message.id);
			message.error ? entry.reject(message.error) : entry.resolve(message.result);
		}
		if (message.method === "Runtime.exceptionThrown") errors.push(message.params.exceptionDetails);
		if (smoke && message.method === "Page.javascriptDialogOpening") send("Page.handleJavaScriptDialog", { accept: true }).catch(() => {});
	};
	const send = (method, params = {}) =>
		new Promise((resolve, reject) => {
			const id = ++serial;
			pending.set(id, { resolve, reject });
			socket.send(JSON.stringify({ id, method, params }));
		});
	await send("Runtime.enable");
	await send("Page.enable");
	await send("Page.navigate", { url });
	let state;
	for (let i = 0; i < 90; i++) {
		await delay(1000);
		const expression = smoke
			? `(async () => {
 if (location.pathname !== '/index.html' || !document.querySelector('script[type=importmap]')) return {status:'loading'};
 const {lib,ui} = await import('/noname.js');
 const splash = document.getElementById('splash');
 const ready = !!splash?.children.length || !!ui.arena;
 return {status:ready ? 'done' : 'loading', result:[{name:'default index entry boot',pass:ready}], config:!!lib.config, splashChildren:splash?.children.length || 0, arena:!!ui.arena, text:document.body.innerText.slice(0,1000)};
})()`
			: "window.markTest";
		const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
		state = result.result.value;
		if (state && state.status !== "loading") break;
		if (!state && errors.length) break;
	}
	const report = { url, state, errors };
	const reportFile = process.env.MARK_REPORT || "audit/mark-stage2-browser-results.json";
	fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
	console.log(JSON.stringify({ url, status: state?.status, error: state?.error, results: state?.result?.filter(r => r.name).map(({ name, pass, error }) => ({ name, pass, error })), errors, reportFile }, null, 2));
	await send("Browser.close").catch(() => {});
	process.exitCode = state?.status === "done" && !state.result.some(r => r.pass === false) && errors.length === 0 ? 0 : 1;
} finally {
	socket?.close();
	processHandle.kill();
}
