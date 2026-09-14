import { game, lib, ui, _status } from "noname";
import { save } from "@/util/config.js";

let activeDialog;
let recoveryDialog;

export function openConnectionRecovery(reason = "网络连接已中断") {
	if (_status.reloading || recoveryDialog?.isConnected) return;
	const dialog = document.createElement("dialog");
	dialog.className = "game-navigation";
	dialog.setAttribute("aria-labelledby", "connection-recovery-title");
	const title = document.createElement("h2");
	title.id = "connection-recovery-title";
	title.textContent = "连接已断开";
	const description = document.createElement("p");
	description.textContent = `${reason}。可重新连接原服务器；能否恢复对局取决于原房间是否仍在运行。`;
	const actions = document.createElement("div");
	actions.className = "game-navigation-actions";
	const retry = document.createElement("button");
	retry.textContent = "重新连接";
	retry.className = "primary";
	retry.onclick = async () => {
		retry.disabled = true;
		leave.disabled = true;
		try {
			await save("mode", "config", "connect");
			lib.config.mode = "connect";
			await save("directstartmode", "config", undefined);
			delete lib.config.directstartmode;
			sessionStorage.setItem(lib.configprefix + "reconnect_requested", _status.ip);
			localStorage.setItem(lib.configprefix + "directstart", "true");
			window.onbeforeunload = null;
			game.reload();
		} catch (error) {
			description.textContent = "无法保存重连信息，请重试或返回主界面。";
			retry.disabled = false;
			leave.disabled = false;
		}
	};
	const leave = document.createElement("button");
	leave.textContent = "返回或退出";
	leave.onclick = () => { dialog.close(); openGameNavigation(); };
	actions.append(retry, leave);
	dialog.append(title, description, actions);
	for (const name of ["keydown", "keyup", "keypress", "click", "touchend"]) {
		dialog.addEventListener(name, event => event.stopPropagation());
	}
	dialog.addEventListener("cancel", event => event.preventDefault());
	dialog.addEventListener("close", () => { dialog.remove(); recoveryDialog = undefined; }, { once: true });
	document.body.appendChild(dialog);
	dialog.showModal();
	recoveryDialog = dialog;
}

async function quitApplication() {
	// Allow pending engine writes to finish before terminating the native runtime.
	const deadline = Date.now() + 10000;
	while (lib.status.reload) {
		if (Date.now() > deadline) throw new Error("数据仍在保存，请稍后再退出。");
		await new Promise(resolve => setTimeout(resolve, 50));
	}
	const { onlineState, command } = await import("@/online/client");
	try {
		if (onlineState.match.state !== "idle") await command("match.cancel", {});
		if (onlineState.room) await command("room.leave", { roomId: onlineState.room.id });
	} catch (error) {
		// Closing the native app must not be blocked by an already lost server connection.
		console.warn("退出前联机清理未完成，服务器将按连接状态清理席位", error);
	}
	await game.exit();
}

/** Leave through a full reload so every mode can release its own runtime. */
async function navigate(destination) {
	if (_status.reloading) return;
	if (sessionStorage.getItem("noname_online_game") && destination === "lobby") {
		const { returnToOnlineLobby } = await import("@/online/game.js");
		await returnToOnlineLobby(true);
		return;
	}
	const { onlineState, command } = await import("@/online/client");
	try {
		if (onlineState.match.state !== "idle") await command("match.cancel", {});
		if (onlineState.room) await command("room.leave", { roomId: onlineState.room.id });
	} catch (error) {
		console.warn("返回主界面前联机清理未完成，继续释放本地运行时", error);
	}
	const keys = destination === "lobby"
		? ["continue_name", "reconnect_info", "directstartmode", "tmp_user_roomId", "tmp_owner_roomId"]
		: ["continue_name"];
	for (const key of keys) {
		await save(key, "config", undefined);
		delete lib.config[key];
	}
	for (const key of ["playback", "playbackmode"]) {
		localStorage.removeItem(lib.configprefix + key);
	}
	if (destination === "lobby") {
		sessionStorage.removeItem(lib.configprefix + "reconnect_requested");
		sessionStorage.setItem(lib.configprefix + "return_to_lobby", "true");
		localStorage.removeItem(lib.configprefix + "directstart");
	} else {
		sessionStorage.removeItem(lib.configprefix + "return_to_lobby");
		localStorage.setItem(lib.configprefix + "directstart", "true");
	}
	// reload waits for outstanding engine database writes and unloads network connections.
	game.disconnect?.();
	window.onbeforeunload = null;
	game.reload();
}

export function returnToMainMenu() {
	return navigate("lobby");
}

/** Shared by the toolbar and both local/online settings menus. */
export function openGameNavigation() {
	if (_status.reloading) return;
	if (activeDialog?.isConnected) {
		activeDialog.querySelector("button")?.focus();
		return;
	}
	const online = Boolean(_status.connectMode || game.online || lib.config.mode === "connect");
	const dialog = document.createElement("dialog");
	dialog.className = "game-navigation";
	dialog.setAttribute("aria-labelledby", "game-navigation-title");
	dialog.setAttribute("aria-describedby", "game-navigation-description");
	const title = document.createElement("h2");
	title.id = "game-navigation-title";
	title.textContent = "对局操作";
	const description = document.createElement("p");
	description.id = "game-navigation-description";
	description.textContent = online
		? "返回主界面将离开当前联机房间，之后可重新选择模式。"
		: "返回主界面可重新选择模式；重新开始会结束当前对局，并重新进入本模式。";
	const status = document.createElement("p");
	status.className = "game-navigation-status";
	status.setAttribute("role", "status");
	const actions = document.createElement("div");
	actions.className = "game-navigation-actions";
	let busy = false;
	let ownsPause = false;
	const addAction = (label, action, className = "") => {
		const button = document.createElement("button");
		button.type = "button";
		button.className = className;
		button.textContent = label;
		button.addEventListener("click", action);
		actions.appendChild(button);
		return button;
	};
	const leave = async destination => {
		if (busy) return;
		busy = true;
		actions.querySelectorAll("button").forEach(button => { button.disabled = true; });
		status.textContent = destination === "quit" ? "正在保存并退出程序…" : destination === "lobby" ? "正在返回主界面…" : "正在重新开始…";
		try {
			if (destination === "quit") {
				await quitApplication();
			} else {
				await navigate(destination);
			}
		} catch (error) {
			console.error("对局导航失败:", error);
			status.textContent = error.message || "操作未完成，请重试。";
			busy = false;
			actions.querySelectorAll("button").forEach(button => { button.disabled = false; });
		}
	};
	addAction("继续游戏", () => {
		dialog.close();
		if (ui.menuContainer && !ui.menuContainer.classList.contains("hidden")) {
			ui.click.configMenu?.();
		}
		if (ui.connectMenuContainer && !ui.connectMenuContainer.classList.contains("hidden")) {
			ui.click.connectMenu?.();
		}
	});
	if (!online) addAction("重新开始", () => leave("restart"));
	addAction(online ? "退出房间并返回主界面" : "返回主界面", () => leave("lobby"), "primary");
	addAction("退出程序", () => leave("quit"), "danger");
	dialog.append(title, description, actions, status);
	// Keep game keyboard shortcuts out of the modal; Escape retains native close behavior.
	for (const event of ["keydown", "keyup", "keypress", "click", "touchend"]) {
		dialog.addEventListener(event, e => e.stopPropagation());
	}
	dialog.addEventListener("cancel", event => { if (busy) event.preventDefault(); });
	dialog.addEventListener("close", () => {
		dialog.remove();
		if (activeDialog === dialog) activeDialog = undefined;
		if (ownsPause && !_status.reloading) game.resume2();
	}, { once: true });
	document.body.appendChild(dialog);
	try {
		dialog.showModal();
		activeDialog = dialog;
		if (!online && !_status.paused2) {
			game.pause2();
			ownsPause = true;
		}
	} catch (error) {
		dialog.remove();
		throw error;
	}
}
