import { lib, game, ui, get, ai, _status } from "noname";

export const type = "mode";

/**
 * @type { importModeConfig }
 */
export default {
	name: "connect",
	async start(event, trigger, player) {
		const directstartmode = lib.config.directstartmode;
		ui.create.menu(true);
		event.textnode = ui.create.div("", "输入联机地址");
		const createNode = () => {
			if (event.created) {
				return;
			}
			if (directstartmode && lib.node) {
				ui.exitroom = ui.create.system(
					"退出房间",
					() => {
						game.saveConfig("directstartmode");
						game.reload();
					},
					true
				);
				game.switchMode(directstartmode);
				return;
			}
			if (lib.node && window.require) {
				ui.startServer = ui.create.system(
					"启动服务器",
					e => {
						ui.click.shortcut(false);
						e.stopPropagation();
						ui.click.connectMenu();
					},
					true
				);
			}

			event.created = true;
			const node = ui.create.div(".shadowed");
			node.style.width = "400px";
			node.style.height = "30px";
			node.style.lineHeight = "30px";
			node.style.fontFamily = "xinwei";
			node.style.fontSize = "30px";
			node.style.padding = "10px";
			node.style.left = "calc(50% - 210px)";
			node.style.top = "calc(50% - 20px)";
			node.style.whiteSpace = "nowrap";
			node.textContent = lib.config.last_ip || lib.hallURL;
			node.contentEditable = true;
			node.style.webkitUserSelect = "text";
			node.style.textAlign = "center";
			node.style.overflow = "hidden";

			let connectionStarted = false;
			const connect = (e, invitationText) => {
				connectionStarted = true;
				event.textnode.textContent = "正在连接...";
				clearTimeout(event.timeout);
				if (e) {
					e.preventDefault();
				}
				const ip = node.textContent;
				game.requireSandboxOn(ip);
				game.saveConfig("last_ip", ip);
				game.connect(ip, success => {
					if (success) {
						if (invitationText) {
							_status.read_clipboard_text = invitationText;
							return;
						}
						const info = lib.config.reconnect_info;
						if (info && info[0] === _status.ip) {
							game.onlineID = info[1];
							if (typeof (game.roomId = info[2]) === "string") {
								game.roomIdServer = true;
							}
						}
						return;
					}
					if (event.textnode) {
						alert(invitationText ? "邀请链接解析失败" : "连接失败");
						event.textnode.textContent = "输入联机地址";
					}
				});
			};
			node.addEventListener("keydown", e => {
				if (e.key === "Enter") {
					connect(e);
				}
			});
			ui.window.appendChild(node);
			ui.ipnode = node;

			const text = event.textnode;
			Object.assign(text.style, {
				width: "400px",
				height: "30px",
				lineHeight: "30px",
				fontFamily: "xinwei",
				fontSize: "30px",
				padding: "10px",
				left: "calc(50% - 200px)",
				top: "calc(50% - 80px)",
				textAlign: "center",
			});
			ui.window.appendChild(text);
			ui.iptext = text;

			const button = ui.create.div(".menubutton.highlight.large.pointerdiv", "连接", connect);
			Object.assign(button.style, {
				width: "70px",
				left: "calc(50% - 35px)",
				top: "calc(50% + 60px)",
			});
			ui.window.appendChild(button);
			ui.ipbutton = button;

			ui.hall_button = ui.create.system(
				"联机大厅",
				() => {
					node.textContent = get.config("hall_ip") || lib.hallURL;
					connect();
				},
				true
			);
			if (!get.config("hall_button")) {
				ui.hall_button.style.display = "none";
			}
			ui.recentIP = ui.create.system("最近连接", null, true);
			const clickLink = function () {
				node.textContent = this.textContent;
				connect();
			};
			lib.setPopped(
				ui.recentIP,
				() => {
					if (!lib.config.recentIP.length) {
						return;
					}
					const uiintro = ui.create.dialog("hidden");
					uiintro.listen(e => {
						e.stopPropagation();
					});
					const list = ui.create.div(".caption");
					for (const ip of lib.config.recentIP) {
						ui.create.div(".text.textlink", list, clickLink).textContent = get.trimip(ip);
					}
					uiintro.add(list);
					const clear = uiintro.add('<div class="text center">清除</div>');
					clear.style.paddingTop = 0;
					clear.style.paddingBottom = "3px";
					clear.listen(() => {
						lib.config.recentIP.length = 0;
						game.saveConfig("recentIP", []);
						uiintro.delete();
					});
					return uiintro;
				},
				220
			);
			if (get.config("read_clipboard", "connect")) {
				let ced = false;
				const read = text => {
					if (connectionStarted) {
						return;
					}
					try {
						const text2 = text.split("\n")[2];
						if (!text2?.startsWith("联机地址:")) {
							return;
						}
						const ip = text2.slice(5);
						if (ip.length > 0 && (ced || confirm("是否根据剪贴板的邀请链接以进入联机地址和房间？"))) {
							node.textContent = ip;
							connect(null, text);
						}
					} catch (e) {
						console.log(e);
					}
				};
				const promptInvite = () => {
					if (connectionStarted) {
						return;
					}
					if (confirm("是否输入邀请链接以进入联机地址和房间？")) {
						ced = true;
						game.promises.prompt("请输入邀请链接").then(text => {
							if (typeof text === "string" && text.length > 0) {
								read(text);
							}
						});
					}
				};
				window.focus();
				if (navigator.clipboard && lib.node) {
					navigator.clipboard.readText().then(read).catch(promptInvite);
				} else {
					const input = ui.create.node("textarea", ui.window, { opacity: "0" });
					input.select();
					const result = document.execCommand("paste");
					input.blur();
					ui.window.removeChild(input);
					if (result || input.value.length > 0) {
						read(input.value);
					} else {
						promptInvite();
					}
				}
			}
			lib.init.onfree();
		};
		createNode();
		if (!game.onlineKey) {
			game.onlineKey = localStorage.getItem(`${lib.configprefix}key`);
			if (!game.onlineKey) {
				game.onlineKey = get.id();
				localStorage.setItem(`${lib.configprefix}key`, game.onlineKey);
			}
		}
		_status.connectDenied = createNode;
		setTimeout(lib.init.onfree, 1000);
	},
};
