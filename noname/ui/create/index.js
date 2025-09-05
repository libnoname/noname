import { ui } from "../index.js";
import { lib } from "../../library/index.js";
import { game } from "../../game/index.js";
import { get } from "../../get/index.js";
import { _status } from "../../status/index.js";
import { ai } from "../../ai/index.js";
import { menu } from "./menu/index.js";
import { cardPackMenu } from "./menu/pages/cardPackMenu.js";
import { characterPackMenu } from "./menu/pages/characterPackMenu.js";
import { extensionMenu } from "./menu/pages/exetensionMenu.js";
import { optionsMenu } from "./menu/pages/optionsMenu.js";
import { otherMenu } from "./menu/pages/otherMenu.js";
import { startMenu } from "./menu/pages/startMenu.js";
import { Pagination } from "../../util/pagination.js";

export class Create {
	/**
	 * @type {(video: Videos, before: boolean) => void}
	 */
	videoNode;
	/**
	 * 创建身份牌实例
	 */
	identityCard(identity, position, noclick) {
		const card = ui.create.card(position, "noclick", noclick);
		card.removeEventListener(lib.config.touchscreen ? "touchend" : "click", ui.click.card);
		card.classList.add("button");
		card._customintro = uiintro => uiintro.add(`${get.translation(`${identity}${2}`)}的身份牌`);
		const fileName = `image/card/identity_${identity}.jpg`;
		new Promise((resolve, reject) => {
			const image = new Image();
			image.onload = resolve;
			image.onerror = reject;
			image.src = `${lib.assetURL}${fileName}`;
		}).then(
			() => {
				card.classList.add("fullskin");
				card.node.image.setBackgroundImage(fileName);
			},
			() => (card.node.background.innerHTML = get.translation(identity)[0])
		);
		return card;
	}
	/**
	 * 让卡牌旋转
	 */
	cardSpinning(card) {
		if (lib.config.cardback_style != "default") {
			card.style.transitionProperty = "none";
			ui.refresh(card);
			card.classList.add("infohidden");
			ui.refresh(card);
			card.style.transitionProperty = "";
		} else {
			card.classList.add("infohidden");
		}
		card.style.transition = "all 0s";
		card.style.transform = "perspective(600px) rotateY(180deg) translateX(0)";
		const onEnd01 = function () {
			setTimeout(function () {
				card.style.transition = "all ease-in 0.3s";
				card.style.transform = "perspective(600px) rotateY(270deg) translateX(52px)";
				var onEnd = function () {
					card.classList.remove("infohidden");
					card.style.transition = "all 0s";
					ui.refresh(card);
					card.style.transform = "perspective(600px) rotateY(-90deg) translateX(52px)";
					ui.refresh(card);
					card.style.transition = "";
					ui.refresh(card);
					card.style.transform = "";
				};
				card.listenTransition(onEnd);
			}, 300);
		};
		onEnd01();
	}
	/**
	 * 旋转的身份牌！
	 */
	spinningIdentityCard(identity, dialog) {
		const card = ui.create.identityCard(identity);
		const buttons = ui.create.div(".buttons", dialog.content);
		setTimeout(() => {
			buttons.appendChild(card);
			dialog.open();
			ui.create.cardSpinning(card);
		}, 50);
	}
	/**
	 * 创建codemirror5编辑器
	 * @param {HTMLDivElement} container
	 * @param {Function} saveInput
	 */
	editor(container, saveInput) {
		const createList = [];
		const containerDelete = container.delete;
		const editorpage = ui.create.div(container);
		//删除container的时候，删除创建的ul列表
		container.delete = function () {
			for (let i = createList.length - 1; i >= 0; i--) {
				createList[i].parentNode && createList[i].parentNode.removeChild(createList[i]);
			}
			Array.from(editorpage.children).forEach(v => {
				v.style.background = "";
			});
			containerDelete.apply(this, arguments);
		};
		//创建ul列表
		const createMenu = function (pos, self, List, click) {
			if (!self || self == window) {
				return;
			}
			const parent = self.parentNode;
			if (parent) {
				for (let i = 0; i < parent.childElementCount; i++) {
					const node = parent.childNodes[i];
					if (node != self && node.ul) {
						closeMenu.call(node);
					}
				}
			}
			if (self.ul) {
				self.style.background = "#08f";
				createList.add(self.ul);
				ui.window.appendChild(self.ul);
				return self.ul;
			}
			const editor = container.editor;
			if (!editor) {
				return false;
			}
			self.style.background = "#08f";
			const ul = document.createElement("ul");
			container.css.call(ul, {
				position: "absolute",
				top: pos.bottom / game.documentZoom + "px",
				left: pos.left / game.documentZoom + "px",
				height: "20em",
				width: (pos.width * 4) / game.documentZoom + "px",
				//'font-family':'shousha',
				"font-size": (lib.config.codeMirror_fontSize ? lib.config.codeMirror_fontSize.slice(0, -2) : 16) / game.documentZoom + "px",
			});
			const theme = editor.options.theme;
			lib.setScroll(ul);
			lib.setMousewheel(ul);
			ul.className = "CodeMirror-hints " + theme;
			const getActive = () => {
				let i = 0;
				while (i < ul.childElementCount) {
					if (ul.childNodes[i].classList.contains("CodeMirror-hint-active")) {
						break;
					} else {
						i++;
					}
				}
				return i;
			};
			const setActive = i => {
				ul.childNodes[getActive()].classList.remove("CodeMirror-hint-active");
				ul.childNodes[i].classList.add("CodeMirror-hint-active");
				return i;
			};
			if (List && List.length && click) {
				for (let i = 0; i < List.length; ++i) {
					const elt = ul.appendChild(document.createElement("li"));
					elt.style.color = "black";
					elt.style.boxShadow = "none";
					const cur = List[i];
					if (cur instanceof HTMLElement) {
						elt.appendChild(cur);
					} else {
						elt.innerHTML = cur;
					}
					let className = "CodeMirror-hint" + (i != 0 ? "" : " " + "CodeMirror-hint-active");
					if (cur.className != null) {
						className = cur.className + " " + className;
					}
					elt.className = className;
					elt.hintId = i;
					ui.window.listen.call(elt, function () {
						setActive(this.hintId);
						this.focus();
						click.call(this);
					});
					elt.onmousemove = elt.ontouchstart = () => {
						setActive(i);
					};
				}
			}
			createList.add(ul);
			ui.window.appendChild(ul);
			return ul;
		};
		//关闭ul列表
		const closeMenu = function () {
			const ul = this.ul;
			if (!ul) {
				return false;
			}
			if (ul.parentNode) {
				ul.parentNode.removeChild(ul);
			}
			this.style.background = "";
			//创建后不用删除了，除非以后要动态加载。
			//delete this.ul;
			createList.remove(ul);
			return ul;
		};
		const discardConfig = ui.create.div(".editbutton", "取消", editorpage, function () {
			ui.window.classList.remove("shortcutpaused");
			ui.window.classList.remove("systempaused");
			container.delete(null);
			delete window.saveNonameInput;
		});
		const saveConfig = ui.create.div(".editbutton", "保存", editorpage, saveInput);
		const theme = ui.create.div(".editbutton", "主题", editorpage, function () {
			if (!this || this == window) {
				return;
			}
			if (this.ul && this.ul.parentNode) {
				return closeMenu.call(this);
			}
			//this
			const self = this;
			if (!this.ul) {
				//主题列表
				const list = ["mdn-like", "mbo"];
				//正在使用的主题
				const active = container.editor.options.theme;
				//排个序
				list.remove(active).splice(0, 0, active);
				//元素位置
				const pos = self.getBoundingClientRect();
				//点击事件
				const click = function (e) {
					const theme = this.innerHTML;
					container.editor.setOption("theme", theme);
					setTimeout(() => container.editor.refresh(), 0);
					game.saveConfig("codeMirror_theme", theme);
					closeMenu.call(self);
				};
				const ul = createMenu(pos, self, list, click);
				self.ul = ul;
			} else {
				createMenu(null, self);
			}
		});
		const edit = ui.create.div(".editbutton", "编辑", editorpage, function () {
			if (!this || this == window) {
				return;
			}
			if (this.ul && this.ul.parentNode) {
				return closeMenu.call(this);
			}
			const self = this;
			if (!this.ul) {
				const pos = this.getBoundingClientRect();
				const list = ["撤销        Ctrl+Z", "恢复撤销    Ctrl+Y"];
				const click = function (e) {
					const num = this.innerHTML.indexOf("Ctrl");
					const inner = this.innerHTML.slice(num).replace("+", "-");
					container.editor.execCommand(container.editor.options.extraKeys[inner]);
					setTimeout(() => container.editor.refresh(), 0);
					closeMenu.call(self);
				};
				const ul = createMenu(pos, self, list, click);
				this.ul = ul;
			} else {
				createMenu(null, self);
			}
		});
		const fontSize = ui.create.div(".editbutton", "字号", editorpage, function () {
			if (!this || this == window) {
				return;
			}
			if (this.ul && this.ul.parentNode) {
				return closeMenu.call(this);
			}
			const self = this;
			if (!this.ul) {
				const pos = this.getBoundingClientRect();
				const list = ["16px", "18px", "20px", "22px", "24px", "26px"];
				const click = function (e) {
					const size = this.innerHTML;
					container.style.fontSize = size.slice(0, -2) / game.documentZoom + "px";
					Array.from(self.parentElement.children)
						.map(v => v.ul)
						.filter(Boolean)
						.forEach(v => {
							v.style.fontSize = size.slice(0, -2) / game.documentZoom + "px";
						});
					setTimeout(() => container.editor.refresh(), 0);
					game.saveConfig("codeMirror_fontSize", size);
					closeMenu.call(self);
				};
				const ul = createMenu(pos, self, list, click);
				this.ul = ul;
			} else {
				createMenu(null, self);
			}
		});
		const editor = ui.create.div(editorpage);
		return editor;
	}
	/**
	 * 创建codemirror6编辑器
	 * @param {HTMLDivElement} container
	 * @param {{ value?: string, language?: string, saveInput?:(view: import("@codemirror/view").EditorView) => any }} config
	 */
	async editor2(container, config = {}) {
		const {
			value = "",
			language = "javascript",
			saveInput = view => {
				ui.window.classList.remove("shortcutpaused");
				ui.window.classList.remove("systempaused");
				view.dom.parentElement?.parentElement?.parentElement?.remove();
			},
		} = config;

		const { basicSetup } = await import("codemirror");
		const { EditorView } = await import("@codemirror/view");
		const { linter, lintGutter } = await import("@codemirror/lint");
		const { search, highlightSelectionMatches, openSearchPanel } = await import("@codemirror/search");

		// 在editorpage中添加功能按钮等
		const editorpage = ui.create.div(container);
		editorpage.addEventListener("keydown", function (e) {
			e.stopPropagation();
		});
		editorpage.addEventListener("keyup", function (e) {
			e.stopPropagation();
		});

		const discardConfig = ui.create.div(".editbutton", "取消", editorpage, () => {
			ui.window.classList.remove("shortcutpaused");
			ui.window.classList.remove("systempaused");
			container.delete();
		});

		const saveConfig = ui.create.div(".editbutton", "保存", editorpage, () => {
			saveInput(view);
		});

		const fontSize = ui.create.div(".editbutton", "字号", editorpage, () => {
			game.promises.prompt(`###请输入字号###${lib.config.codeMirror_fontSize || "16px"}`).then(size => {
				if (size === false) {
					return;
				}
				container.style.fontSize = Number(size.slice(0, -2)) / game.documentZoom + "px";
				game.saveConfig("codeMirror_fontSize", size);
			});
		});

		container.style.fontSize = Number((lib.config.codeMirror_fontSize || "16px").slice(0, -2)) / game.documentZoom + "px";

		const searchPanel = ui.create.div(".editbutton", "搜索", editorpage, () => {
			openSearchPanel(view);
		});

		const editor = ui.create.div(editorpage);

		const extensions = [
			basicSetup,
			lintGutter(), // 显示lint信息的gutter
			search({ top: true }), // 启用搜索面板
			highlightSelectionMatches(), // 高亮匹配的选择项
		];

		if (language === "javascript" || language === "typescript") {
			const { javascript, scopeCompletionSource, javascriptLanguage, esLint } = await import("@codemirror/lang-javascript");
			const { default: security } = await import("@/noname/util/security.js");
			let proxyWindow = Object.assign({}, window, {
				_status: _status,
				lib: lib,
				game: game,
				ui: ui,
				get: get,
				ai: ai,
				player: lib.element.player,
				card: lib.element.card,
				event: lib.element.event,
				dialog: lib.element.dialog,
			});
			if (security.isSandboxRequired()) {
				const { Monitor, AccessAction } = security.importSandbox();
				new Monitor()
					.action(AccessAction.DEFINE)
					.action(AccessAction.WRITE)
					.action(AccessAction.DELETE)
					.require("target", proxyWindow)
					.require("property", "_status", "lib", "game", "ui", "get", "ai", "player", "card", "event", "dialog")
					.then((access, nameds, control) => {
						if (access.action == AccessAction.DEFINE) {
							control.preventDefault();
							control.stopPropagation();
							control.setReturnValue(false);
							return;
						}

						//
						control.overrideParameter("target", window);
					})
					.start();
			} else {
				const keys = ["_status", "lib", "game", "ui", "get", "ai", "player", "card", "event", "dialog"];

				for (const key of keys) {
					const descriptor = Reflect.getOwnPropertyDescriptor(proxyWindow, key);
					if (!descriptor) {
						continue;
					}
					descriptor.writable = false;
					descriptor.enumerable = true;
					descriptor.configurable = false;
					Reflect.defineProperty(proxyWindow, key, descriptor);
				}

				proxyWindow = new Proxy(proxyWindow, {
					set(target, propertyKey, value, receiver) {
						if (typeof propertyKey == "string" && keys.includes(propertyKey)) {
							return Reflect.set(target, propertyKey, value, receiver);
						}

						return Reflect.set(window, propertyKey, value);
					},
				});
			}

			extensions.push(
				javascript({ typescript: true }),
				javascriptLanguage.data.of({
					autocomplete: scopeCompletionSource(proxyWindow),
				})
			);
			if (language === "javascript") {
				const { Linter } = await import("@/game/eslint-linter-browserify.js");
				extensions.push(
					linter(
						esLint(new Linter(), {
							rules: {
								"no-class-assign": 0,
								"no-console": 0,
								"no-constant-condition": [
									"error",
									{
										checkLoops: false,
									},
								],
								"no-irregular-whitespace": [
									"error",
									{
										skipStrings: true,
										skipTemplates: true,
									},
								],
								"prefer-const": 0,
								"no-redeclare": 0,
								"no-undef": 0,
								"no-empty": [
									"error",
									{
										allowEmptyCatch: true,
									},
								],
								"no-unused-vars": 1,
								"require-yield": 0,
								"no-fallthrough": ["error", { commentPattern: "\\[falls[\\s\\w]*through\\]" }],
								curly: "error",
							},
							languageOptions: {
								ecmaVersion: 13,
								sourceType: "module",
							},
						})
					)
				);
			}
		} else if (language === "css") {
			const { css } = await import("@codemirror/lang-css");
			extensions.push(css());
		} else if (language === "json") {
			const { json, jsonParseLinter } = await import("@codemirror/lang-json");
			extensions.push(json(), linter(jsonParseLinter()));
		} else if (language === "html") {
			const { html } = await import("@codemirror/lang-html");
			const { parser: htmlParser } = await import("@lezer/html");
			const { parser: jsParser } = await import("@lezer/javascript");
			const { parseMixed } = await import("@lezer/common");
			const { LRLanguage } = await import("@codemirror/language");

			const mixedHTMLParser = htmlParser.configure({
				wrap: parseMixed(node => {
					return node.name == "ScriptText" ? { parser: jsParser } : null;
				}),
			});

			const mixedHTML = LRLanguage.define({ parser: mixedHTMLParser });
			extensions.push(html());
		} else if (language === "markdown") {
			const { markdown } = await import("@codemirror/lang-markdown");
			extensions.push(markdown());
		} else if (language === "vue") {
			const { vue } = await import("@codemirror/lang-vue");
			extensions.push(vue());
		}

		const view = new EditorView({
			doc: value,
			parent: editor,
			extensions,
		});
		lib.setScroll(view.scrollDOM);
		return view;
	}
	/**
	 * 弹出提示。
	 * @param {string} message 弹出的文字
	 */
	toast(message) {
		const toastContainer =
			document.querySelector(".toast-container") ||
			(() => {
				const container = document.createElement("div");
				container.classList.add("toast-container");
				document.body.appendChild(container);
				return container;
			})();
		const toast = document.createElement("div");
		toast.innerHTML = message;
		const toShow = () => {
			toast.classList.add("toast");
			toastContainer.appendChild(toast);
			ui.toastQueue.push(toast);
			ui.create.showNextToast();
		};
		if (!ui.toastStyle) {
			ui.toastStyle = lib.init.promises.css(lib.assetURL + "layout/default/toast.css").then(() => toShow());
		} else {
			toShow();
		}
		return toast;
	}
	showNextToast() {
		const toast = ui.toastQueue.shift();
		if (!toast) {
			return;
		}
		toast.style.display = "block";
		toast.addEventListener("animationend", () => {
			toast.remove();
			ui.create.showNextToast();
		});
		return toast;
	}
	cardTempName(card, applyNode) {
		let getApplyNode = applyNode || card;
		let cardName = get.name(card);
		let cardNature = get.nature(card);
		let tempname = get.translation(cardName);
		let cardTempNameConfig = lib.config.cardtempname;
		let node = getApplyNode._tempName || ui.create.div(".tempname", getApplyNode);
		let datasetNature = "";
		let cardPosition = get.position(card);
		getApplyNode._tempName = node;
		if (cardTempNameConfig != "image") {
			//清空，避免和下面的image部分有冲突
			node.innerHTML = "";
			datasetNature = "fire";
			if ((cardPosition === "e" || cardPosition === "j") && card.viewAs && card.viewAs != card.name) {
				datasetNature = "wood";
				tempname = get.translation(card.viewAs);
			} else {
				if (cardName == "sha") {
					if (cardNature) {
						tempname = get.translation(cardNature) + tempname;
					}
					if (cardNature == "thunder") {
						datasetNature = "thunder";
					}
					if (cardNature == "kami") {
						datasetNature = "kami";
					}
					if (cardNature == "ice") {
						datasetNature = "ice";
					}
				}
			}
			if (cardTempNameConfig == "default") {
				getApplyNode._tempName.classList.add("vertical");
			}
			if (datasetNature.length > 0) {
				node.dataset.nature = datasetNature;
			} else {
				delete node.dataset.nature;
				node.classList.add(datasetNature);
			}
		} else {
			if ((cardPosition === "e" || cardPosition === "j") && card.viewAs && card.viewAs != card.name) {
				cardName = card.viewAs;
				tempname = get.translation(card.viewAs);
			}
			if (cardName == "sha") {
				if (cardNature) {
					tempname = get.translation(cardNature) + tempname;
				}
				if (cardNature == "fire") {
					datasetNature = "fire";
				}
				if (cardNature == "thunder") {
					datasetNature = "thunder";
				}
				if (cardNature == "kami") {
					datasetNature = "kami";
				}
				if (cardNature == "ice") {
					datasetNature = "ice";
				}
			}
			let bg = node.querySelector("div");
			if (bg) {
				Array.from(node.childNodes)
					.filter(v => v != bg)
					.forEach(v => node.removeChild(v));
			} else {
				bg = ui.create.div(node);
			}
			node.classList.add("tempimage");
			let img = get.dynamicVariable(lib.card[cardName].image, card);
			if (img) {
				if (img.startsWith("db:")) {
					img = img.slice(3);
				} else if (!img.startsWith("ext:")) {
					img = null;
				}
			}
			if (lib.card[cardName].fullskin) {
				if (img) {
					if (img.startsWith("ext:")) {
						bg.setBackgroundImage(img.replace(/^ext:/, "extension/"));
					} else {
						bg.setBackgroundDB(img);
					}
				} else {
					if (lib.card[cardName].modeimage) {
						bg.setBackgroundImage("image/mode/" + lib.card[cardName].modeimage + "/card/" + cardName + ".png");
					} else {
						if (cardName == "sha" && lib.natureBg.has(cardNature)) {
							bg.setBackgroundImage(lib.natureBg.get(cardNature));
						} else {
							bg.setBackgroundImage("image/card/" + cardName + ".png");
						}
					}
				}
			} else if (get.dynamicVariable(lib.card[cardName].image, card) == "background") {
				if (cardNature) {
					bg.setBackground(cardName + "_" + cardNature, "card");
				} else {
					bg.setBackground(cardName, "card");
				}
			} else if (lib.card[cardName].fullimage) {
				if (img) {
					if (img.startsWith("ext:")) {
						bg.setBackgroundImage(img.replace(/^ext:/, "extension/"));
						bg.style.backgroundSize = "cover";
					} else {
						bg.setBackgroundDB(img);
					}
				} else if (get.dynamicVariable(lib.card[cardName].image, card)) {
					if (get.dynamicVariable(lib.card[cardName].image, card).startsWith("character:")) {
						bg.setBackground(get.dynamicVariable(lib.card[cardName].image, card).slice(10), "character");
					} else {
						bg.setBackground(get.dynamicVariable(lib.card[cardName].image, card));
					}
				} else {
					let cardPack = lib.cardPack["mode_" + get.mode()];
					if (Array.isArray(cardPack) && cardPack.includes(cardName)) {
						bg.setBackground("mode/" + get.mode() + "/card/" + cardName);
					} else {
						bg.setBackground("card/" + cardName);
					}
				}
			} else if (get.dynamicVariable(lib.card[cardName].image, card) == "card") {
				if (cardNature) {
					bg.setBackground(cardName + "_" + cardNature, "card");
				} else {
					bg.setBackground(cardName, "card");
				}
			} else if (typeof get.dynamicVariable(lib.card[cardName].image, card) == "string" && !lib.card[cardName].fullskin) {
				if (img) {
					if (img.startsWith("ext:")) {
						bg.setBackgroundImage(img.replace(/^ext:/, "extension/"));
						bg.style.backgroundSize = "cover";
					} else {
						bg.setBackgroundDB(img);
					}
				} else {
					bg.setBackground(get.dynamicVariable(lib.card[cardName].image, card));
				}
			} else {
				console.warn("卡牌图片解析失败");
			}
			if (datasetNature.length > 0) {
				node.classList.add(datasetNature);
			}
			delete node.dataset.nature;
		}
		node.innerHTML += `<span>${cardTempNameConfig == "default" ? get.verticalStr(tempname) : tempname}</span>`;
		node.tempname = tempname;
		return node;
	}
	connectRooms(list) {
		ui.rooms = [];
		ui.roombase = ui.create.dialog();
		ui.roombase.classList.add("fullwidth");
		ui.roombase.classList.add("fullheight");
		ui.roombase.classList.add("fixed");
		ui.roombase.classList.add("scroll1");
		ui.roombase.classList.add("scroll2");
		ui.roombase.classList.add("noupdate");
		for (var i = 0; i < list.length; i++) {
			var player = ui.roombase.add('<div class="popup text pointerdiv" style="width:calc(100% - 10px);display:inline-block;white-space:nowrap">空房间</div>');
			player.roomindex = i;
			player.initRoom = lib.element.Player.prototype.initRoom;
			player.addEventListener(lib.config.touchscreen ? "touchend" : "click", ui.click.connectroom);
			player.initRoom(list[i]);
			ui.rooms.push(player);
		}
	}
	rarity(button) {
		var rarity = game.getRarity(button.link);
		if (rarity != "common" && lib.config.show_rarity) {
			var intro = button.node.intro;
			intro.classList.add("showintro");
			intro.style.fontFamily = "yuanli";
			intro.style.fontSize = "16px";
			intro.style.bottom = "6px";
			intro.style.left = "6px";
			switch (rarity) {
				case "rare":
					intro.dataset.nature = "thunderm";
					break;
				case "epic":
					intro.dataset.nature = "metalm";
					break;
				case "legend":
					intro.dataset.nature = "orangem";
					break;
				case "junk":
					intro.dataset.nature = "woodm";
					break;
			}
			intro.innerHTML = get.translation(rarity);
		}
		/*if((button.link=='xushu'||button.link=='xin_xushu'||button.link=='jsrg_guanyu')&&button.node&&button.node.name&&button.node.group){
			if(button.classList.contains('newstyle')){
				button.node.name.dataset.nature='watermm';
				button.node.group.dataset.nature='water';
			}
			else button.node.group.style.backgroundColor=get.translation('weiColor');
		}*/
	}
	div() {
		var str, innerHTML, position, position2, style, divposition, listen;
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == "string") {
				if (typeof str == "string") {
					innerHTML = arguments[i];
				} else {
					str = arguments[i];
				}
			} else if (["div", "table", "tr", "td", "body", "fragment"].includes(get.objtype(arguments[i]))) {
				position = arguments[i];
			} else if (typeof arguments[i] == "number") {
				position2 = arguments[i];
			} else if (get.itemtype(arguments[i]) == "divposition") {
				divposition = arguments[i];
			} else if (typeof arguments[i] == "object") {
				style = arguments[i];
			} else if (typeof arguments[i] == "function") {
				listen = arguments[i];
			}
		}
		if (str == undefined) {
			str = "";
		}
		var node = document.createElement("div");
		for (var i = 0; i < str.length; i++) {
			if (str[i] == ".") {
				if (node.className.length != 0) {
					node.className += " ";
				}
				while (str[i + 1] != "." && str[i + 1] != "#" && i + 1 < str.length) {
					node.className += str[i + 1];
					i++;
				}
			} else if (str[i] == "#") {
				while (str[i + 1] != "." && str[i + 1] != "#" && i + 1 < str.length) {
					node.id += str[i + 1];
					i++;
				}
			}
		}
		if (position) {
			if (typeof position2 == "number" && position.childNodes.length > position2) {
				position.insertBefore(node, position.childNodes[position2]);
			} else {
				position.appendChild(node);
			}
		}
		if (style) {
			node.css(style);
		}
		if (divposition) {
			node.setPosition(divposition);
		}
		if (innerHTML) {
			node.innerHTML = innerHTML;
		}
		if (listen) {
			node.listen(listen);
		}
		return node;
	}
	filediv() {
		var args = Array.from(arguments);
		var func = null;
		for (var i = 0; i < args.length; i++) {
			if (typeof args[i] == "function") {
				func = args[i];
				args.splice(i, 1);
				break;
			}
		}
		var div = ui.create.div.apply(this, args);
		var input = ui.create.node("input.fileinput");
		input.type = "file";
		input.onchange = function (e) {
			func.call(this, this.files[0], e);
		};
		div.appendChild(input);
		div.inputNode = input;
		return div;
	}
	node() {
		var tagName, str, innerHTML, position, position2, style, divposition, listen;
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == "string") {
				if (typeof tagName == "string") {
					innerHTML = arguments[i];
				} else {
					tagName = arguments[i];
				}
			} else if (["div", "table", "tr", "td", "body", "fragment"].includes(get.objtype(arguments[i]))) {
				position = arguments[i];
			} else if (typeof arguments[i] == "number") {
				position2 = arguments[i];
			} else if (get.itemtype(arguments[i]) == "divposition") {
				divposition = arguments[i];
			} else if (typeof arguments[i] == "object") {
				style = arguments[i];
			} else if (typeof arguments[i] == "function") {
				listen = arguments[i];
			}
		}
		if (tagName == undefined) {
			tagName = "div";
		} else {
			var i1 = tagName.indexOf(".");
			var i2 = tagName.indexOf("#");
			if (i1 != -1 || i2 != -1) {
				if (i2 != -1 && i2 < i1) {
					i1 = i2;
				}
				str = tagName.slice(i1);
				tagName = tagName.slice(0, i1);
			}
		}
		var node = document.createElement(tagName);
		if (str) {
			for (var i = 0; i < str.length; i++) {
				if (str[i] == ".") {
					if (node.className.length != 0) {
						node.className += " ";
					}
					while (str[i + 1] != "." && str[i + 1] != "#" && i + 1 < str.length) {
						node.className += str[i + 1];
						i++;
					}
				} else if (str[i] == "#") {
					while (str[i + 1] != "." && str[i + 1] != "#" && i + 1 < str.length) {
						node.id += str[i + 1];
						i++;
					}
				}
			}
		}
		if (position) {
			if (typeof position2 == "number" && position.childNodes.length > position2) {
				position.insertBefore(node, position.childNodes[position2]);
			} else {
				position.appendChild(node);
			}
		}
		if (style) {
			HTMLDivElement.prototype.css.call(node, style);
		}
		if (divposition) {
			HTMLDivElement.prototype.setPosition.call(node, divposition);
		}
		if (innerHTML) {
			node.innerHTML = innerHTML;
		}
		if (listen) {
			node.onclick = listen;
		}
		return node;
	}
	iframe(src) {
		var layer = document.createElement("div");
		layer.classList.add("poplayer");
		layer.style.zIndex = "100";
		layer.listen(function () {
			this.remove();
		});
		layer.style.background = "white";

		var webview = document.createElement("iframe");
		webview.src = src;
		webview.style.width = "100%";
		webview.style.height = "100%";
		webview.style.left = "0px";
		webview.style.top = "0px";
		webview.style.position = "absolute";
		webview.style.border = "none";
		layer.appendChild(webview);

		var backbutton = ui.create.div(".menubutton.round", "返", layer, function () {
			layer.remove();
		});
		backbutton.style.bottom = "10px";
		backbutton.style.right = "10px";
		backbutton.style.background = "rgba(0,0,0,0.4)";
		backbutton.style.color = "white";
		backbutton.style.textShadow = "rgba(0,0,0,0.5) 0px 0px 2px";
		backbutton.style.boxShadow = "rgba(0, 0, 0, 0.3) 0 0 0 1px, rgba(0, 0, 0, 0.3) 0 3px 10px";
		backbutton.style.position = "fixed";

		ui.window.appendChild(layer);
	}
	identitycircle(list, target) {
		var container = ui.create.div(".identitycircle.menubg", target);
		var circle = ui.create.div(container);
		container.dataset.num = list.length;
		for (var i = 0; i < list.length; i++) {
			var sec1 = ui.create.div(circle);
			sec1.dataset.color = list[i];
			var sec2 = ui.create.div(circle);
			sec2.dataset.color = list[i];
			var deg1 = (360 / list.length) * i;
			var deg2 = 0;
			if (list.length == 2) {
				deg2 = 90;
			} else if (list.length == 3) {
				deg2 = 30;
			}
			sec1.style.transform = "rotate(" + deg1 + "deg)";
			sec2.style.transform = "rotate(" + (deg1 + deg2) + "deg)";
		}
	}
	chat() {
		var chat = ui.create.system("聊天", null, true);
		ui.chatButton = chat;
		lib.setPopped(chat, ui.click.chat, 220);
	}
	exit() {
		if (!ui.exit) {
			ui.exit = ui.create.control("退出房间", ui.click.exit);
		}
	}
	connecting(bool) {
		if (bool) {
			ui.window.classList.remove("connecting");
			if (ui.connecting) {
				ui.connecting.delete();
				delete ui.connecting;
			}
		} else {
			ui.window.classList.add("connecting");
			ui.connecting = ui.create.div(".fullsize.connectlayer");
			document.body.appendChild(ui.connecting);
			ui.create.div("", "正在重连...", ui.connecting);
			ui.connecting.splashtimeout = setTimeout(function () {
				if (ui.connecting) {
					delete ui.connecting.splashtimeout;
				}
			}, 300);
			// setTimeout(function(){
			// 	if(ui.connecting){
			// 		ui.connecting.firstChild.show();
			// 	}
			// },1000);
		}
	}
	roomInfo() {
		var chat = ui.create.system(
			game.online ? "房间信息" : "房间设置",
			function () {
				if (!game.online || game.onlinezhu) {
					ui.click.connectMenu();
				}
			},
			true
		);
		ui.roomInfo = chat;
		lib.setPopped(
			chat,
			function () {
				if (game.getRoomInfo) {
					var uiintro = ui.create.dialog("hidden");
					game.getRoomInfo(uiintro);
					return uiintro;
				}
			},
			180
		);
	}
	templayer(time) {
		if (typeof time != "number" || isNaN(time) || time == Infinity) {
			time = 500;
		}
		var templayer = ui.create.div(".popup-container", ui.window);
		setTimeout(function () {
			templayer.remove();
		}, time);
	}
	selectlist(list, init, position, onchange) {
		var select = document.createElement("select");
		for (var i = 0; i < list.length; i++) {
			var option = document.createElement("option");
			if (Array.isArray(list[i])) {
				option.value = list[i][0];
				option.innerHTML = list[i][1];
			} else {
				option.value = list[i];
				option.innerHTML = list[i];
			}
			if (init == option.value) {
				option.selected = "selected";
			}
			select.appendChild(option);
		}
		if (position) {
			position.appendChild(select);
		}
		if (onchange) {
			select.onchange = onchange;
		}
		return select;
	}
	/** 创建菜单 */
	menu = menu;
	/** 创建“开始”菜单 */
	startMenu = startMenu;
	/** 创建“选项”菜单 */
	optionsMenu = optionsMenu;
	/** 创建“武将”菜单 */
	characterPackMenu = characterPackMenu;
	/** 创建“卡牌”菜单 */
	cardPackMenu = cardPackMenu;
	/** 创建“扩展”菜单 */
	extensionMenu = extensionMenu;
	/** 创建“其他”菜单 */
	otherMenu = otherMenu;
	statictable() {
		var str, row, col, position, position2, fixed, style, divposition;
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == "string") {
				str = arguments[i];
			} else if (typeof arguments[i] == "number") {
				if (typeof row == "number") {
					if (typeof col == "number") {
						position2 = arguments[i];
					} else {
						col = arguments[i];
					}
				} else {
					row = arguments[i];
				}
			} else if (["div", "table", "tr", "td", "body", "fragment"].includes(get.objtype(arguments[i]))) {
				position = arguments[i];
			} else if (typeof arguments[i] == "boolean") {
				fixed = arguments[i];
			} else if (get.itemtype(arguments[i]) == "divposition") {
				divposition = arguments[i];
			} else if (typeof arguments[i] == "object") {
				style = arguments[i];
			}
		}
		if (str == undefined) {
			str = "";
		}
		var node = document.createElement("table");
		for (var i = 0; i < str.length; i++) {
			if (str[i] == ".") {
				if (node.className.length != 0) {
					node.className += " ";
				}
				while (str[i + 1] != "." && str[i + 1] != "#" && i + 1 < str.length) {
					node.className += str[i + 1];
					i++;
				}
			} else if (str[i] == "#") {
				while (str[i + 1] != "." && str[i + 1] != "#" && i + 1 < str.length) {
					node.id += str[i + 1];
					i++;
				}
			}
		}
		var tr, td;
		for (var i = 0; i < row; i++) {
			tr = document.createElement("tr");
			if (fixed) {
				tr.style.height = 100 / row + "%";
			}
			node.appendChild(tr);
			for (var j = 0; j < col; j++) {
				td = document.createElement("td");
				tr.appendChild(td);
			}
		}
		if (position) {
			if (typeof position2 == "number" && position.childNodes.length > position2) {
				position.insertBefore(node, position.childNodes[position2]);
			} else {
				position.appendChild(node);
			}
		}
		return node;
	}
	giveup() {
		if (ui.giveup) {
			return;
		}
		if (!lib.config.show_giveup) {
			return;
		}
		ui.giveup = ui.create.system(
			"投降",
			function () {
				var player = game.me;
				this.remove();
				if (game.online) {
					game.send("giveup", player);
				} else {
					_status.event.next.length = 0;
					game
						.createEvent("giveup", false)
						.set("includeOut", true)
						.setContent(function () {
							game.log(player, "投降");
							player.popup("投降");
							player.die("nosource").set("_triggered", null).includeOut = true;
						}).player = player;
				}
				if (_status.paused && _status.imchoosing && !_status.auto) {
					ui.click.auto();
				}
			},
			true,
			true
		);
	}

	groupControl(dialog) {
		return ui.create.control("wei", "shu", "wu", "qun", "jin", "western", "key", function (link, node) {
			if (link == "全部") {
				dialog.currentcapt = "";
				dialog.currentgroup = "";
				for (var i = 0; i < dialog.buttons.length; i++) {
					dialog.buttons[i].style.display = "";
				}
			} else {
				if (node.classList.contains("thundertext")) {
					dialog.currentgroup = null;
					dialog.currentgroupnode = null;
					node.classList.remove("thundertext");
					for (var i = 0; i < dialog.buttons.length; i++) {
						if (dialog.currentcapt && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt)) {
							dialog.buttons[i].classList.add("nodisplay");
						} else {
							dialog.buttons[i].classList.remove("nodisplay");
						}
					}
				} else {
					if (dialog.currentgroupnode) {
						dialog.currentgroupnode.classList.remove("thundertext");
					}
					dialog.currentgroup = link;
					dialog.currentgroupnode = node;
					node.classList.add("thundertext");
					for (var i = 0; i < dialog.buttons.length; i++) {
						if (dialog.buttons[i].group != link || (dialog.currentcapt && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt))) {
							dialog.buttons[i].classList.add("nodisplay");
						} else {
							dialog.buttons[i].classList.remove("nodisplay");
						}
					}
				}
			}
		});
	}
	cardDialog() {
		var args = ["thisiscard"];
		for (var i = 0; i < arguments.length; i++) {
			args.push(arguments[i]);
		}
		return ui.create.characterDialog.apply(this, args);
	}
	characterDialog2(filter) {
		var list = [];
		for (var i in lib.character) {
			if (lib.character[i].isMinskin) {
				continue;
			}
			if (lib.character[i].isBoss || lib.character[i].isHiddenBoss) {
				if (lib.config.mode == "boss") {
					continue;
				}
				if (!lib.character[i].isBossAllowed) {
					continue;
				}
			}

			if (lib.character[i].isHiddenInStoneMode) {
				continue;
			}
			if (lib.config.banned.includes(i)) {
				continue;
			}
			if (filter && filter(i)) {
				continue;
			}
			list.push(i);
		}
		var dialog = ui.create.dialog("hidden");
		dialog.classList.add("noupdate");
		dialog.classList.add("scroll1");
		dialog.classList.add("scroll2");
		dialog.classList.add("scroll3");
		list.sort(lib.sort.character);
		dialog.classList.add("character");
		dialog.classList.add("choose-character");
		var getPack = function (name) {
			for (var i in lib.characterPack) {
				if (lib.characterPack[i][name]) {
					return i;
				}
			}
			return null;
		};
		var packs = {};
		var packnode = ui.create.div(".packnode", dialog);
		lib.setScroll(packnode);
		var clickCapt = function () {
			var active = this.parentNode.querySelector(".active");
			if (active) {
				active.classList.remove("active");
			}
			this.classList.add("active");
			for (var i = 0; i < dialog.buttons.length; i++) {
				if (this.pack && !this.pack.includes(dialog.buttons[i].link)) {
					dialog.buttons[i].classList.add("nodisplay");
				} else {
					dialog.buttons[i].classList.remove("nodisplay");
				}
			}
		};
		var createNode = function (packname) {
			var translate;
			var pack = null;
			if (packname == "最近") {
				pack = get.config("recentCharacter") || [];
			} else if (packname == "收藏") {
				pack = lib.config.favouriteCharacter;
			}
			var node = ui.create.div(".dialogbutton.menubutton.large", packname, packnode, clickCapt);
			node.pack = pack;
			return node;
		};
		dialog.add([list, "character"]);
		var bool = true;
		var node;
		var recent = get.config("recentCharacter");
		if (recent && recent.length) {
			node = createNode("最近");
			if (lib.config.character_dialog_tool == "最近") {
				clickCapt.call(node);
				bool = false;
			}
		}
		if (lib.config.favouriteCharacter.length) {
			node = createNode("收藏");
			if (lib.config.character_dialog_tool == "收藏") {
				clickCapt.call(node);
				bool = false;
			}
		}
		var node = createNode("全部");
		if (lib.config.character_dialog_tool == "all") {
			clickCapt.call(node);
			bool = false;
		}
		if (bool) {
			clickCapt.call(packnode.firstChild);
		}

		var node = ui.create.div(".dialogbutton.menubutton.large", "筛选", packnode);
		return dialog;
	}
	characterDialog() {
		// if(lib.config.character_dialog_style=='newstyle'){
		//     for(var i=0;i<arguments.length;i++){
		//      			if(arguments[i]=='thisiscard'){
		//      						 break;
		//      			}
		//     }
		//     if(i==arguments.length){
		//      			return ui.create.characterDialog2.apply(this,arguments);
		//     }
		// }
		var filter, str, noclick, thisiscard, seperate, expandall, onlypack, heightset, characterx;
		for (var i = 0; i < arguments.length; i++) {
			if (arguments[i] === "thisiscard") {
				thisiscard = true;
			} else if (arguments[i] === "expandall") {
				expandall = true;
			} else if (arguments[i] === "heightset") {
				heightset = true;
			} else if (arguments[i] == "characterx") {
				characterx = true;
			} else if (typeof arguments[i] == "string" && arguments[i].startsWith("onlypack:")) {
				onlypack = arguments[i].slice(9);
			} else if (typeof arguments[i] == "object" && typeof arguments[i].seperate == "function") {
				seperate = arguments[i].seperate;
			} else if (typeof arguments[i] === "string") {
				str = arguments[i];
			} else if (typeof arguments[i] === "function") {
				filter = arguments[i];
			} else if (typeof arguments[i] == "boolean") {
				noclick = arguments[i];
			}
		}
		var list = [];
		const groups = [];
		/** @type { Dialog } */
		var dialog;
		/** 筛选武将的信息 */
		var node = ui.create.div(".caption.pointerspan");
		if (get.is.phoneLayout()) {
			node.style.fontSize = "30px";
		}
		var namecapt = [];
		var getCapt = function (str) {
			var capt;
			if (str.indexOf("_") == -1) {
				capt = str[0];
			} else {
				capt = str[str.lastIndexOf("_") + 1];
			}
			capt = capt.toLowerCase();
			if (!/[a-z]/i.test(capt)) {
				capt = "自定义";
			}
			return capt;
		};
		if (thisiscard) {
			for (var i in lib.card) {
				if (!lib.translate[i + "_info"]) {
					continue;
				}
				if (filter && filter(i)) {
					continue;
				}
				list.push(["", get.translation(lib.card[i].type), i]);
				if (namecapt.indexOf(getCapt(i)) == -1) {
					namecapt.push(getCapt(i));
				}
			}
		} else {
			for (var i in lib.character) {
				if (lib.character[i][4]) {
					if (lib.character[i].isMinskin) {
						continue;
					}
					if (lib.character[i].isBoss || lib.character[i].isHiddenBoss) {
						if (lib.config.mode == "boss") {
							continue;
						}
						if (!lib.character[i].isBossAllowed) {
							continue;
						}
					}

					if (lib.character[i].isHiddenInStoneMode) {
						continue;
					}
					if (lib.character[i].isUnseen) {
						continue;
					}
				}
				if (lib.config.banned.includes(i)) {
					continue;
				}
				if (lib.characterFilter[i] && !lib.characterFilter[i](get.mode())) {
					continue;
				}
				if (filter && filter(i)) {
					continue;
				}
				list.push(i);
				if (get.is.double(i)) {
					groups.add("double");
				} else {
					groups.add(lib.character[i][1]);
				}
				if (namecapt.indexOf(getCapt(i)) == -1) {
					namecapt.push(getCapt(i));
				}
			}
		}
		namecapt.sort(function (a, b) {
			return a > b ? 1 : -1;
		});
		groups.sort(lib.sort.group);
		if (!thisiscard) {
			namecapt.remove("自定义");
			namecapt.push("newline");
			for (var i in lib.characterDialogGroup) {
				namecapt.push(i);
			}
		}
		var newlined = false;
		var newlined2;
		var packsource;
		/** 点击筛选中的按钮 */
		var clickCapt = function (e) {
			if (_status.dragged) {
				return;
			}
			if (dialog.currentcapt2 == "最近" && dialog.currentcaptnode2 != this && !dialog.currentcaptnode2.inited) {
				dialog.currentcapt2 = null;
				dialog.currentcaptnode2.classList.remove("thundertext");
				dialog.currentcaptnode2.inited = true;
				dialog.currentcaptnode2 = null;
			}
			if (this.alphabet) {
				if (this.classList.contains("thundertext")) {
					dialog.currentcapt = null;
					dialog.currentcaptnode = null;
					this.classList.remove("thundertext");
					if (this.touchlink) {
						this.touchlink.classList.remove("active");
					}
					for (var i = 0; i < dialog.buttons.length; i++) {
						restoreState(dialog.buttons[i]);
						if (dialog.currentgroup && dialog.buttons[i].group != dialog.currentgroup) {
							dialog.buttons[i].classList.add("nodisplay");
						} else if (dialog.currentcapt2 && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt, true)) {
							dialog.buttons[i].classList.add("nodisplay");
						} else {
							dialog.buttons[i].classList.remove("nodisplay");
						}
					}
				} else {
					if (dialog.currentcaptnode) {
						dialog.currentcaptnode.classList.remove("thundertext");
						if (dialog.currentcaptnode.touchlink) {
							dialog.currentcaptnode.touchlink.classList.remove("active");
						}
					}
					dialog.currentcapt = this.link;
					dialog.currentcaptnode = this;
					this.classList.add("thundertext");
					if (this.touchlink) {
						this.touchlink.classList.add("active");
					}
					for (var i = 0; i < dialog.buttons.length; i++) {
						restoreState(dialog.buttons[i]);
						if (dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt)) {
							dialog.buttons[i].classList.add("nodisplay");
						} else if (dialog.currentcapt2 && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt, true)) {
							dialog.buttons[i].classList.add("nodisplay");
						} else if (dialog.currentgroup && dialog.buttons[i].group != dialog.currentgroup) {
							dialog.buttons[i].classList.add("nodisplay");
						} else {
							dialog.buttons[i].classList.remove("nodisplay");
						}
					}
				}
			} else {
				if (newlined2) {
					newlined2.style.display = "none";
					if (!packsource.onlypack) {
						packsource.classList.remove("thundertext");
						if (!get.is.phoneLayout() || !lib.config.filternode_button) {
							packsource.innerHTML = "武将包";
						}
					}
				}
				if (this.classList.contains("thundertext")) {
					dialog.currentcapt2 = null;
					dialog.currentcaptnode2 = null;
					this.classList.remove("thundertext");
					if (this.touchlink) {
						this.touchlink.classList.remove("active");
					}
					for (var i = 0; i < dialog.buttons.length; i++) {
						restoreState(dialog.buttons[i]);
						if (dialog.currentgroup && dialog.buttons[i].group != dialog.currentgroup) {
							dialog.buttons[i].classList.add("nodisplay");
						} else if (dialog.currentcapt && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt)) {
							dialog.buttons[i].classList.add("nodisplay");
						} else {
							dialog.buttons[i].classList.remove("nodisplay");
						}
					}
				} else {
					if (dialog.currentcaptnode2) {
						dialog.currentcaptnode2.classList.remove("thundertext");
						if (dialog.currentcaptnode2.touchlink) {
							dialog.currentcaptnode2.touchlink.classList.remove("active");
						}
					}
					dialog.currentcapt2 = this.link;
					dialog.currentcaptnode2 = this;
					this.classList.add("thundertext");
					if (this.touchlink) {
						this.touchlink.classList.add("active");
					} else if (this.parentNode == newlined2) {
						packsource.innerHTML = this.innerHTML;
						packsource.classList.add("thundertext");
					}
					for (var i = 0; i < dialog.buttons.length; i++) {
						restoreState(dialog.buttons[i]);
						if (dialog.currentcapt && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt)) {
							dialog.buttons[i].classList.add("nodisplay");
						} else if (dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt, true)) {
							dialog.buttons[i].classList.add("nodisplay");
						} else if (dialog.currentgroup && dialog.buttons[i].group != dialog.currentgroup) {
							dialog.buttons[i].classList.add("nodisplay");
						} else {
							if (dialog.buttons[i].activate) {
								dialog.buttons[i].activate();
							}
							dialog.buttons[i].classList.remove("nodisplay");
						}
					}
				}
			}
			if (dialog.seperate) {
				for (var i = 0; i < dialog.seperate.length; i++) {
					if (!dialog.seperate[i].nextSibling.querySelector(".button:not(.nodisplay)")) {
						dialog.seperate[i].style.display = "none";
						dialog.seperate[i].nextSibling.style.display = "none";
					} else {
						dialog.seperate[i].style.display = "";
						dialog.seperate[i].nextSibling.style.display = "";
					}
				}
			}
			if (filternode) {
				if (filternode.querySelector(".active")) {
					packsource.classList.add("thundertext");
				} else {
					packsource.classList.remove("thundertext");
				}
			}
			updatePagination();
			if (e) {
				e.stopPropagation();
			}
		};
		for (i = 0; i < namecapt.length; i++) {
			if (namecapt[i] == "newline") {
				newlined = document.createElement("div");
				newlined.style.marginTop = "5px";
				newlined.style.display = "block";
				// newlined.style.fontFamily='xinwei';
				if (get.is.phoneLayout()) {
					newlined.style.fontSize = "32px";
				} else {
					newlined.style.fontSize = "22px";
				}
				newlined.style.textAlign = "center";
				node.appendChild(newlined);
			} else if (newlined) {
				var span = ui.create.div(".tdnode.pointerdiv.shadowed.reduce_radius");
				span.style.margin = "3px";
				span.style.width = "auto";
				span.innerHTML = " " + namecapt[i].toUpperCase() + " ";
				span.link = namecapt[i];
				span.addEventListener(lib.config.touchscreen ? "touchend" : "click", clickCapt);
				newlined.appendChild(span);
				node[namecapt[i]] = span;
				if (namecapt[i] == "收藏") {
					span._nature = "fire";
				} else {
					span._nature = "wood";
				}
			} else {
				var span = document.createElement("span");
				span.innerHTML = " " + namecapt[i].toUpperCase() + " ";
				span.link = namecapt[i];
				span.alphabet = true;
				span.addEventListener(lib.config.touchscreen ? "touchend" : "click", clickCapt);
				node.appendChild(span);
			}
		}
		if (!thisiscard) {
			var natures = ["water", "soil", "wood", "metal"];
			var span = document.createElement("span");
			newlined.appendChild(span);
			span.style.margin = "8px";
			/** 点击筛选某势力的武将 */
			var clickGroup = function () {
				if (_status.dragged) {
					return;
				}
				if (dialog.currentcapt2 == "最近" && dialog.currentcaptnode2 != this && !dialog.currentcaptnode2.inited) {
					dialog.currentcapt2 = null;
					dialog.currentcaptnode2.classList.remove("thundertext");
					dialog.currentcaptnode2.inited = true;
					dialog.currentcaptnode2 = null;
				}
				var node = this,
					link = this.link;
				if (node.classList.contains("thundertext")) {
					dialog.currentgroup = null;
					dialog.currentgroupnode = null;
					node.classList.remove("thundertext");
					for (var i = 0; i < dialog.buttons.length; i++) {
						restoreState(dialog.buttons[i]);
						if (dialog.currentcapt && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt)) {
							dialog.buttons[i].classList.add("nodisplay");
						} else if (dialog.currentcapt2 && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt, true)) {
							dialog.buttons[i].classList.add("nodisplay");
						} else {
							dialog.buttons[i].classList.remove("nodisplay");
						}
					}
				} else {
					if (dialog.currentgroupnode) {
						dialog.currentgroupnode.classList.remove("thundertext");
					}
					dialog.currentgroup = link;
					dialog.currentgroupnode = node;
					node.classList.add("thundertext");
					for (var i = 0; i < dialog.buttons.length; i++) {
						restoreState(dialog.buttons[i]);
						if (dialog.currentcapt && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt)) {
							dialog.buttons[i].classList.add("nodisplay");
						} else if (dialog.currentcapt2 && dialog.buttons[i].capt != dialog.getCurrentCapt(dialog.buttons[i].link, dialog.buttons[i].capt, true)) {
							dialog.buttons[i].classList.add("nodisplay");
						} else if (dialog.currentgroup == "double") {
							if (dialog.buttons[i]._changeGroup) {
								dialog.buttons[i].classList.remove("nodisplay");
							} else {
								dialog.buttons[i].classList.add("nodisplay");
							}
						} else if (dialog.currentgroup == "ye") {
							if (dialog.buttons[i].group == "ye") {
								dialog.buttons[i].classList.remove("nodisplay");
							} else {
								dialog.buttons[i].classList.add("nodisplay");
							}
						} else {
							if (dialog.buttons[i]._changeGroup || dialog.buttons[i].group != dialog.currentgroup) {
								dialog.buttons[i].classList.add("nodisplay");
							} else {
								dialog.buttons[i].classList.remove("nodisplay");
							}
						}
					}
				}
				updatePagination();
			};
			for (var i = 0; i < groups.length; i++) {
				var span = ui.create.div(".tdnode.pointerdiv.shadowed.reduce_radius.reduce_margin");
				span.style.margin = "3px";
				newlined.appendChild(span);
				span.innerHTML = get.translation(groups[i]);
				span.link = groups[i];
				span._nature = natures[i];
				span.addEventListener(lib.config.touchscreen ? "touchend" : "click", clickGroup);
			}

			var span = document.createElement("span");
			newlined.appendChild(span);
			span.style.margin = "8px";

			packsource = ui.create.div(".tdnode.pointerdiv.shadowed.reduce_radius.reduce_margin");
			packsource.style.margin = "3px";
			newlined.appendChild(packsource);
			var filternode = null;
			var clickCaptNode = function (e) {
				delete _status.filterCharacter;
				ui.window.classList.remove("shortcutpaused");
				filternode.delete();
				filternode.classList.remove("shown");
				clickCapt.call(this.link, e);
			};
			if (get.is.phoneLayout() && lib.config.filternode_button) {
				newlined.style.marginTop = "";
				packsource.innerHTML = "筛选";
				filternode = ui.create.div(".popup-container.filter-character.modenopause");
				ui.create.div(filternode);
				filternode.listen(function (e) {
					if (this.classList.contains("removing")) {
						return;
					}
					delete _status.filterCharacter;
					ui.window.classList.remove("shortcutpaused");
					this.delete();
					this.classList.remove("shown");
					e.stopPropagation();
				});
				for (var i = 0; i < node.childElementCount; i++) {
					if (node.childNodes[i].tagName.toLowerCase() == "span") {
						node.childNodes[i].style.display = "none";
						node.childNodes[i].touchlink = ui.create.div(filternode.firstChild, clickCaptNode, ".menubutton.large.capt", node.childNodes[i].innerHTML);
						node.childNodes[i].touchlink.link = node.childNodes[i];
					}
				}
				ui.create.node("br", filternode.firstChild);
			} else {
				if (onlypack) {
					packsource.onlypack = true;
					packsource.innerHTML = get.translation(onlypack + "_character_config");
					packsource.style.display = "none";
					packsource.previousSibling.style.display = "none";
				} else {
					packsource.innerHTML = "武将包";
				}
			}

			newlined2 = document.createElement("div");
			newlined2.style.marginTop = "5px";
			newlined2.style.display = "none";
			newlined2.style.fontFamily = "xinwei";
			newlined2.classList.add("pointernode");
			if (get.is.phoneLayout()) {
				newlined2.style.fontSize = "32px";
			} else {
				newlined2.style.fontSize = "22px";
			}
			newlined2.style.textAlign = "center";
			node.appendChild(newlined2);

			packsource.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
				if (packsource.onlypack) {
					return;
				}
				if (_status.dragged) {
					return;
				}
				if (get.is.phoneLayout() && lib.config.filternode_button && filternode) {
					_status.filterCharacter = true;
					ui.window.classList.add("shortcutpaused");
					ui.window.appendChild(filternode);
					ui.refresh(filternode);
					filternode.classList.add("shown");
					var dh = filternode.offsetHeight - filternode.firstChild.offsetHeight;
					if (dh > 0) {
						filternode.firstChild.style.top = dh / 2 + "px";
					} else {
						filternode.firstChild.style.top = "";
					}
				} else {
					if (newlined2.style.display == "none") {
						newlined2.style.display = "block";
					} else {
						newlined2.style.display = "none";
					}
				}
			});
			var packlist = [];
			for (var i = 0; i < lib.config.all.characters.length; i++) {
				if (!lib.config.characters.includes(lib.config.all.characters[i])) {
					continue;
				}
				packlist.add(lib.config.all.characters[i]);
			}
			for (var i = 0; i < lib.config.characters.length; i++) {
				if (lib.config.all.characters.includes(lib.config.characters[i])) {
					continue;
				}
				if (!lib.characterPack[lib.config.characters[i]]) {
					continue;
				}
				if (!lib.translate[lib.config.characters[i] + "_character_config"]) {
					continue;
				}
				packlist.add(lib.config.characters[i]);
			}
			Object.keys(lib.characterPack)
				.filter(key => {
					if (key.indexOf("mode_extension") != 0) {
						return false;
					}
					const extName = key.slice(15);
					//if (!game.hasExtension(extName) || !game.hasExtensionLoaded(extName)) return false;
					return lib.config[`extension_${extName}_characters_enable`] === true;
				})
				.forEach(key => packlist.add(key));
			for (var i = 0; i < packlist.length; i++) {
				var span = document.createElement("div");
				span.style.display = "inline-block";
				span.style.width = "auto";
				span.style.margin = "5px";
				if (get.is.phoneLayout()) {
					span.style.fontSize = "32px";
				} else {
					span.style.fontSize = "22px";
				}
				span.innerHTML = lib.translate[packlist[i] + "_character_config"];
				span.link = packlist[i];
				span.addEventListener(lib.config.touchscreen ? "touchend" : "click", clickCapt);
				newlined2.appendChild(span);
				if (filternode && !onlypack) {
					span.touchlink = ui.create.div(filternode.firstChild, clickCaptNode, ".menubutton.large", span.innerHTML);
					span.touchlink.link = span;
				}
			}
		}

		var groupSort;
		if (thisiscard) {
			groupSort = function (name) {
				var type = lib.card[name[2]].type;
				if (lib.cardType[type]) {
					return lib.cardType[type];
				}
				switch (type) {
					case "basic":
						return 0;
					case "chess":
						return 1.5;
					case "trick":
						return 2;
					case "delay":
						return 3;
					case "equip":
						return 4;
					case "zhenfa":
						return 5;
					default:
						return 6;
				}
			};
			list.sort(function (a, b) {
				var del = groupSort(a) - groupSort(b);
				if (del != 0) {
					return del;
				}
				var aa = a,
					bb = b;
				if (a.includes("_")) {
					a = a.slice(a.lastIndexOf("_") + 1);
				}
				if (b.includes("_")) {
					b = b.slice(b.lastIndexOf("_") + 1);
				}
				if (a != b) {
					return a > b ? 1 : -1;
				}
				return aa > bb ? 1 : -1;
			});
		} else {
			list.sort(lib.sort.character);
		}
		// 自由选将
		dialog = ui.create.dialog("hidden");
		dialog.classList.add("noupdate");
		dialog.classList.add("scroll1");
		dialog.classList.add("scroll2");
		dialog.classList.add("scroll3");
		dialog.supportsPagination = Boolean(parseInt(lib.config.showMax_character_number));
		dialog.paginationMaxCount.set("character", parseInt(lib.config.showMax_character_number));
		dialog.addEventListener(lib.config.touchscreen ? "touchend" : "mouseup", function () {
			_status.clicked2 = true;
		});
		if (heightset) {
			//这里如果dialog的高度较低的话，会显示不全下面的分页按钮，所以我增加了50px，后面遇到高度问题，可以研究更完美的方案，在这里更改。
			dialog.style.height = (game.layout == "long2" || game.layout == "nova" ? 380 : 350) + 50 + "px";
			dialog._scrollset = true;
		}
		dialog.getCurrentCapt = function (link, capt, noalph) {
			var currentcapt = noalph ? this.currentcapt2 : this.currentcapt;
			if (this.seperatelist && noalph) {
				if (this.seperatelist[currentcapt].includes(link)) {
					return capt;
				}
				return null;
			}
			if (lib.characterDialogGroup[currentcapt]) {
				return lib.characterDialogGroup[currentcapt](link, capt);
			}
			if (lib.characterPack[currentcapt]) {
				if (lib.characterPack[currentcapt][link]) {
					return capt;
				}
				return null;
			}
			return this.currentcapt;
		};
		// 搜索框，by Curpond
		/** @type { Element } */
		// @ts-expect-error ignore
		const container = dialog.querySelector(".content-container>.content");
		const Searcher = ui.create.div(".searcher.caption");
		const input = document.createElement("input").css({
			textAlign: "center",
			border: "solid 2px #294510",
			borderRadius: "6px",
			fontWeight: "bold",
			fontSize: "21px",
		});
		const div = ui.create.div(".searcher.find");
		input.placeholder = "支持正则搜索";
		//使用click事件搜索，因为用input事件，难以解决按下a键会触发自动托管的bug
		let find = ui.create.button(["find", "搜索"], "tdnodes");
		find.style.display = "inline";
		const updatePagination = () => {
			if (dialog.paginationMaxCount.get("character")) {
				const buttons = dialog.content.querySelector(".buttons");
				const array = dialog.buttons.filter(item => !item.classList.contains("nodisplay") && item.style.display !== "none");
				/** @type { Pagination } */
				// @ts-expect-error ignore
				const p = dialog.paginationMap.get(buttons);
				if (p) {
					p.state.data = array;
					// @ts-expect-error ignore
					p.setTotalPageCount(Math.ceil(array.length / dialog.paginationMaxCount.get("character")));
				}
			}
		};
		const restoreState = btn => {
			if (btn.style.display == "none") {
				btn.style.display = "";
			}
		};
		const updateFind = () => {
			const { value } = input;
			const reg = new RegExp(value);
			for (let btn of dialog.buttons) {
				if (reg.test(get.translation(btn.link)) || reg.test(get.translation(btn.link + "_ab"))) {
					btn.classList.remove("nodisplay");
				} else {
					btn.classList.add("nodisplay");
				}
			}
			updatePagination();
		};
		find.addEventListener("click", updateFind);
		input.onkeydown = function (e) {
			e.stopPropagation();
			if (e.code == "Enter") {
				updateFind();
			}
		};
		//阻止冒泡以防止触发窗口被拖动而无法选中文字
		input.onmousedown = function (e) {
			e.stopPropagation();
		};
		Searcher.append(input, find);
		container.prepend(Searcher);

		if (str) {
			dialog.add(str);
		}
		dialog.add(node);
		if (thisiscard) {
			if (seperate) {
				seperate = seperate(list);
				dialog.seperate = [];
				dialog.seperatelist = seperate.list;
				if (dialog.seperatelist) {
					newlined = document.createElement("div");
					newlined.style.marginTop = "5px";
					newlined.style.display = "block";
					newlined.style.fontFamily = "xinwei";
					if (get.is.phoneLayout()) {
						newlined.style.fontSize = "32px";
					} else {
						newlined.style.fontSize = "22px";
					}
					newlined.style.textAlign = "center";
					node.appendChild(newlined);
					for (var i in dialog.seperatelist) {
						var span = document.createElement("span");
						span.style.margin = "3px";
						span.innerHTML = i;
						span.link = i;
						span.seperate = true;
						span.addEventListener(lib.config.touchscreen ? "touchend" : "click", clickCapt);
						newlined.appendChild(span);
					}
				}
				for (var i in seperate) {
					if (i == "list") {
						continue;
					}
					var link = "";
					var linkcontent = seperate[i];
					if (i.includes("_link:")) {
						link = i.slice(i.indexOf("_link:") + 6);
						i = i.slice(0, i.indexOf("_link:"));
					}
					var nodesep = dialog.add(i);
					nodesep.link = link;
					dialog.seperate.push(nodesep);
					dialog.add([linkcontent, "vcard"], noclick);
				}
			} else {
				dialog.add([list, "vcard"], noclick);
			}
		} else {
			if (characterx) {
				dialog.add([list, "characterx"], noclick);
			} else {
				dialog.add([list, "character"], noclick);
			}
		}
		dialog.add(ui.create.div(".placeholder"));
		for (i = 0; i < dialog.buttons.length; i++) {
			if (thisiscard) {
				dialog.buttons[i].capt = getCapt(dialog.buttons[i].link[2]);
			} else {
				dialog.buttons[i].group = lib.character[dialog.buttons[i].link][1];
				dialog.buttons[i].capt = getCapt(dialog.buttons[i].link);
			}
		}
		if (!expandall) {
			if (!thisiscard && (lib.characterDialogGroup[lib.config.character_dialog_tool] || lib.config.character_dialog_tool == "自创")) {
				clickCapt.call(node[lib.config.character_dialog_tool]);
			}
		}
		if (dialog.paginationMaxCount.get("character")) {
			/** @type { HTMLDivElement } */
			// @ts-expect-error ignore
			const buttons = dialog.content.querySelector(".buttons");
			const array = dialog.buttons.filter(item => !item.classList.contains("nodisplay") && item.style.display !== "none");
			// 传入初始配置 + 渲染元素
			dialog.addPagination({
				// 数据
				data: array,
				// 总页数(向上取整)
				totalPageCount: Math.ceil(array.length / dialog.paginationMaxCount.get("character")),
				// 父元素
				container: dialog.content,
				// 添加到容器的哪个子元素后面
				insertAfter: buttons,
				// 回调修改数据
				onPageChange: state => {
					const { pageNumber, data } = state;
					// 设一个dialog一页显示10张武将牌
					data.forEach((item, index) => {
						const maxCount = dialog.paginationMaxCount.get("character");
						if (index >= (pageNumber - 1) * maxCount && index < pageNumber * maxCount) {
							item.classList.remove("nodisplay");
						} else {
							item.classList.add("nodisplay");
						}
					});
				},
				// 触发什么事件来更改当前页数，默认为click
				changePageEvent: "click",
			});
		}

		return dialog;
	}
	dialog() {
		let dialog = new lib.element.Dialog(...arguments);
		if (!Array.from(arguments).includes("hidden")) {
			dialog.open();
		}
		return dialog;
	}
	line2() {
		var node = ui.create.line.apply(this, arguments);
		node.classList.add("line2");
		return node;
	}
	line() {
		var two = false,
			func;
		var node = ui.create.div(".config");
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == "string" || typeof arguments[i] == "number") {
				if (two) {
					ui.create.div(".toggle", node).innerHTML = arguments[i];
				} else {
					ui.create.div(node).innerHTML = arguments[i];
					two = true;
				}
			} else if (typeof arguments[i] == "function") {
				func = arguments[i];
			}
		}
		if (func) {
			for (var i = 0; i < node.childNodes.length; i++) {
				node.childNodes[i].listen(func);
			}
		}
		return node;
	}
	switcher(name, current, current2) {
		var func;
		var node = ui.create.div(".config");
		ui.create.div(node).innerHTML = get.translation(name + "_config");
		var switcher = ui.create.div(".toggle.pointerdiv", node);
		switcher.name = name;
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] == "function") {
				func = arguments[i];
				break;
			}
		}
		if (typeof current == "string") {
			switcher.link = current;
			switcher.innerHTML = get.translation(current);
			switcher.contentEditable = true;
			switcher.style.webkitUserSelect = "text";
			switcher.addEventListener(lib.config.touchscreen ? "touchend" : "click", ui.click.editor);
		} else if (typeof current == "object") {
			switcher.link = current2 || current[0];
			switcher.innerHTML = get.translation(switcher.link);
			switcher.choice = current;
			switcher.addEventListener(lib.config.touchscreen ? "touchend" : "click", ui.click.switcher);
		} else {
			if (current) {
				switcher.classList.add("on");
			}
			switcher.classList.add("onoff");
			ui.create.div(ui.create.div(switcher));
			switcher.link = current ? true : false;
			switcher.addEventListener(lib.config.touchscreen ? "touchend" : "click", ui.click.toggle);
		}
		if (func) {
			switcher.additionalCommand = func;
		}
		return node;
	}
	caption(str, position) {
		var caption = ui.create.div(".caption", position);
		caption.innerHTML = str;
		return caption;
	}
	control() {
		return new lib.element.Control(...arguments);
	}
	confirm(str, func) {
		if (ui.confirm && ui.confirm.str == str) {
			return;
		}
		if (str == "o") {
			if (ui.confirm) {
				ui.confirm.replace("ok");
			} else {
				ui.confirm = ui.create.control("ok");
			}
		} else if (str == "oc" || str == "co") {
			if (ui.confirm) {
				ui.confirm.replace("ok", "cancel");
			} else {
				ui.confirm = ui.create.control("ok", "cancel");
			}
		} else if (str == "c") {
			if (ui.confirm) {
				ui.confirm.replace("cancel");
			} else {
				ui.confirm = ui.create.control("cancel");
			}
		} else if (ui.confirm) {
			ui.confirm.close();
			delete ui.confirm;
		}
		if (ui.confirm) {
			ui.confirm.str = str;
			if (func) {
				ui.confirm.custom = func;
			} else {
				delete ui.confirm.custom;
			}
		}
	}
	skills(skills) {
		var i, same;
		if (ui.skills) {
			if (ui.skills.skills.length == skills.length && ui.skills.style.display != "none") {
				same = true;
				for (i = 0; i < skills.length; i++) {
					if (ui.skills.skills.includes(skills[i]) == false) {
						same = false;
						break;
					}
				}
			}
			if (same) {
				return;
			}
			ui.skills.close();
			delete ui.skills;
		}
		if (skills == undefined || skills.length == 0) {
			return;
		}
		if (!_status.event.isMine()) {
			_status.noupdatec = true;
		}
		ui.skills = ui.create.control(skills.concat([ui.click.skill]));
		for (var i = 0; i < ui.skills.childNodes.length; i++) {
			ui.skills.childNodes[i].innerHTML = get.skillTranslation(ui.skills.childNodes[i].link, _status.event.player);
		}
		if (!_status.event.isMine()) {
			ui.skills.style.display = "none";
		} else {
			ui.updatec();
		}
		_status.noupdatec = false;
		ui.skills.skills = skills;
		return ui.skills;
	}
	skills2(skills) {
		var i, same;
		if (ui.skills2) {
			if (ui.skills2.skills.length == skills.length && ui.skills2.style.display != "none") {
				same = true;
				for (i = 0; i < skills.length; i++) {
					if (ui.skills2.skills.includes(skills[i]) == false) {
						same = false;
						break;
					}
				}
			}
			if (same) {
				return;
			}
			ui.skills2.close();
			delete ui.skills2;
		}
		if (skills == undefined || skills.length == 0) {
			return;
		}
		if (!_status.event.isMine()) {
			_status.noupdatec = true;
		}
		ui.skills2 = ui.create.control(skills.concat([ui.click.skill]));
		for (var i = 0; i < ui.skills2.childNodes.length; i++) {
			ui.skills2.childNodes[i].innerHTML = get.skillTranslation(ui.skills2.childNodes[i].link, _status.event.player);
		}
		if (!_status.event.isMine()) {
			ui.skills2.style.display = "none";
		} else {
			ui.updatec();
		}
		_status.noupdatec = false;
		ui.skills2.skills = skills;
		return ui.skills2;
	}
	skills3(skills) {
		var i, same;
		if (ui.skills3) {
			if (ui.skills3.skills.length == skills.length && ui.skills3.style.display != "none") {
				same = true;
				for (i = 0; i < skills.length; i++) {
					if (ui.skills3.skills.includes(skills[i]) == false) {
						same = false;
						break;
					}
				}
			}
			if (same) {
				return;
			}
			ui.skills3.close();
			delete ui.skills3;
		}
		if (skills == undefined || skills.length == 0) {
			return;
		}
		if (!_status.event.isMine()) {
			_status.noupdatec = true;
		}
		ui.skills3 = ui.create.control(skills.concat([ui.click.skill]));
		for (var i = 0; i < ui.skills3.childNodes.length; i++) {
			ui.skills3.childNodes[i].innerHTML = get.skillTranslation(ui.skills3.childNodes[i].link, _status.event.player);
		}
		if (!_status.event.isMine()) {
			ui.skills3.style.display = "none";
		} else {
			ui.updatec();
		}
		_status.noupdatec = false;
		ui.skills3.skills = skills;
		return ui.skills3;
	}
	/**
	 * 向当前事件注入牌的全选/反选按钮喵
	 * 这个函数一般在“AI代选”的位置前面调用喵
	 */
	cardChooseAll() {
		const event = get.event();
		// 如果不是当前玩家、当前配置或者事件不允许全选或者使用complexCard与complexSelect，则取消注入喵
		if (!event.isMine() || !event.allowChooseAll || event.complexCard || event.complexSelect || !lib.config.choose_all_button) {
			return null;
		}
		// 这里的条件用的是“AI代选”按钮的条件喵
		const selectCard = event.selectCard;
		if (typeof selectCard == "function") {
			return null;
		}
		const range = get.select(selectCard);
		if (range[1] <= 1) {
			return null; // 只选一张牌就不使用全选哦喵
		}
		return event.cardChooseAll = ui.create.control("全选", function () {
			// 这个反选要封装喵？
			// 好像就只有这里用哦
			const event = get.event();
			const selecteds = [...ui.selected.cards];

			// 清空选择的牌喵
			ui.selected.cards.length = 0;
			game.check();

			const selectables = get.selectableCards();
			// @ts-expect-error 啊至少垫片函数是接受数组的喵
			const cards = selecteds.length ? [...new Set(selectables).difference(selecteds)] : selectables;
			
			if (cards.length <= range[1]) {
				// 如果可以就全选喵
				ui.selected.cards.push(...cards);
			} else {
				// 否则随机选择几张喵
				ui.selected.cards.push(...cards.randomGets(range[1]));
			}

			// 更新UI喵
			for (const card of ui.selected.cards) {
				card.classList.add("selected");
				card.updateTransform(true, 0);
			}
			for (const card of selecteds) {
				card.classList.remove("selected");
				card.updateTransform(false, 0);
			}
			game.check();
			if (typeof event.custom?.add?.card == "function") {
				_status.event.custom.add.card();
			}
		});
	}
	/**
	 * 向当前事件注入按钮的全选/反选按钮喵
	 */
	buttonChooseAll() {
		const event = get.event();
		// 如果不是当前玩家、当前配置或者事件不允许全选或者使用complexSelect，则取消注入喵
		if (!event.isMine() || !(event.dialog instanceof lib.element.Dialog) || !event.allowChooseAll || event.complexSelect || !lib.config.choose_all_button) {
			return null;
		}
		// 这里的条件用的是“AI代选”按钮的条件喵
		const selectButton = event.selectButton;
		if (typeof selectButton == "function") {
			return null;
		}
		const range = get.select(selectButton);
		if (range[1] <= 1) {
			return null; // 只选一个按钮就不使用全选哦喵
		}
		// 获取标题来作为按钮的定位喵
		const caption = event.dialog.content.querySelector(".caption");
		if (!event.dialog.content.contains(caption)) {
			return null; // 没有标题那么全选按钮就没有位置添加哦喵
		}
		// 创建全选按钮喵
		const buttonChooseAll = ui.create.div(".select-all.popup.pointerdiv");
		event.buttonChooseAll = buttonChooseAll;
		buttonChooseAll.listen(function (e) {
			const event = get.event();
			const selecteds = [...ui.selected.buttons];

			// 清空选择的按钮喵
			ui.selected.buttons.length = 0;
			game.check();
			
			const selectables = get.selectableButtons();
			// @ts-expect-error 啊至少垫片函数是接受数组的喵
			const buttons = selecteds.length ? [...new Set(selectables).difference(selecteds)] : selectables;
			
			if (buttons.length <= range[1]) {
				// 如果可以就全选喵
				ui.selected.buttons.push(...buttons);
			} else {
				// 否则随机选择几个喵
				ui.selected.buttons.push(...buttons.randomGets(range[1]));
			}

			// 更新UI喵
			for (const button of ui.selected.buttons) {
				button.classList.add("selected");
			}
			for (const button of selecteds) {
				button.classList.remove("selected");
			}
			game.check();
			if (typeof event.custom?.add?.button == "function") {
				_status.event.custom.add.button();
			}

			// 取消冒泡防止被uncheck喵
			e.stopPropagation();
		});
		event.dialog.content.insertBefore(buttonChooseAll, caption);
		return buttonChooseAll;
	}
	arena() {
		var i, j;
		ui.window = ui.create.div("#window.hidden", document.body);
		ui.create.div("#statusbg", document.body);
		ui.refresh(ui.window);
		if (!localStorage.getItem(lib.configprefix + "playback")) {
			ui.window.show();
		} else {
			setTimeout(function () {
				ui.window.show();
			}, 1000);
		}
		// lib.setPressure(ui.window,ui.click.pressurepause);
		if (window.isNonameServer) {
			ui.window.classList.add("server");
			var serverinfo = ui.create.div(".serverinfo", ui.window);
			ui.create.div("", "服务器正在运行", serverinfo);
			var serverinfotable = ui.create.table(2, 2, ui.create.div(serverinfo));
			serverinfotable.style.display = "inline-block";
			serverinfotable.firstChild.firstChild.innerHTML = "房间人数：";
			serverinfotable.firstChild.lastChild.id = "server_count";
			serverinfotable.firstChild.lastChild.innerHTML = "0";
			serverinfotable.lastChild.firstChild.innerHTML = "房间状态：";
			serverinfotable.lastChild.lastChild.id = "server_status";
			serverinfotable.lastChild.lastChild.innerHTML = "空闲";
			ui.create.div(
				".menubutton.large",
				"关闭服务器",
				function () {
					if (_status.gameStarted && !confirm("关闭服务器当前进行的游戏将终止且不可恢复，是否确定关闭？")) {
						return;
					}
					localStorage.removeItem(lib.configprefix + "asserver");
					game.reload();
				},
				ui.create.div("", serverinfo)
			);
		}

		ui.window.addEventListener(lib.config.touchscreen ? "touchend" : "click", ui.click.window);
		ui.system = ui.create.div("#system.", ui.window);
		ui.arena = ui.create.div("#arena.nome", ui.window);
		if (lib.device == "ios" && !get.is.phoneLayout()) {
			ui.arena.classList.add("ipad");
		}
		ui.arena.setNumber = function (num) {
			this.dataset.number = num;
			ui.updatePlayerPositions();
			// if(game.layout=='nova'&&parseInt(num)<7){
			// 	ui.arena.classList.add('player_autolong');
			// }
			// else if(lib.config.player_height_nova!='long'){
			// 	ui.arena.classList.remove('player_autolong');
			// }
			// if(game.layout=='long'&&parseInt(num)<parseInt(lib.config.fewplayer)){
			//     this.classList.add('fewplayer');
			// }
			// else{
			//     this.classList.remove('fewplayer');
			// }
		};

		if (lib.config.low_performance) {
			ui.window.classList.add("low_performance");
		}
		if (game.layout == "mobile" || game.layout == "long") {
			ui.arena.classList.add("mobile");
		}
		if (game.layout == "long" || game.layout == "long2") {
			ui.arena.classList.add("long");
		}
		if (game.layout == "default") {
			ui.arena.classList.add("oldlayout");
		}
		if (lib.config.player_border != "wide" || game.layout == "long" || game.layout == "long2") {
			ui.arena.classList.add("slim_player");
		}
		if (lib.config.player_border == "slim") {
			ui.arena.classList.add("uslim_player");
		}
		if (lib.config.player_border == "narrow") {
			ui.arena.classList.add("mslim_player");
		}
		if (lib.config.player_border == "normal" && lib.config.mode != "brawl" && (game.layout == "long" || game.layout == "long2")) {
			ui.arena.classList.add("lslim_player");
		}
		ui.window.dataset.player_border = lib.config.player_border;
		if (lib.config.compatiblemode) {
			ui.window.classList.add("compatiblemode");
		}
		ui.window.dataset.radius_size = lib.config.radius_size || "default";
		if (game.layout == "long" || game.layout == "mobile") {
			//if(lib.config.textequip=='text') ui.arena.classList.add('textequip');
			ui.arena.classList.add("textequip");
		}
		if (game.layout == "long" || game.layout == "long2" || game.layout == "mobile" || game.layout == "nova") {
			if (lib.config.cardshape == "oblong") {
				ui.window.classList.add("oblongcard");
				ui.arena.classList.add("oblongcard");
			}
		}
		if (lib.config.blur_ui) {
			ui.window.classList.add("blur_ui");
		}
		if (lib.config.glass_ui) {
			ui.window.classList.add("glass_ui");
		}
		if (lib.config.custom_button) {
			lib.configMenu.appearence.config.custom_button.onclick("skip");
		}

		if (lib.config.show_statusbar_ios == "overlay") {
			document.body.classList.add("statusbar");
		}
		if (lib.config.keep_awake) {
			if (window.plugins && window.plugins.insomnia) {
				window.plugins.insomnia.keepAwake();
			} else {
				lib.init.js(lib.assetURL + "game", "NoSleep", function () {
					var noSleep = new NoSleep();
					document.addEventListener(
						lib.config.touchscreen ? "touchend" : "click",
						function enableNoSleep() {
							document.removeEventListener(lib.config.touchscreen ? "touchend" : "click", enableNoSleep, false);
							noSleep.enable();
							window.noSleep = noSleep;
						},
						false
					);
				});
			}
		}
		lib.init.js(lib.assetURL + "game", "keyWords", function () {});

		lib.updateURL = lib.updateURLS[lib.config.update_link] || lib.updateURLS.coding;

		lib.init.cssstyles();

		ui.arena.dataset.player_height = lib.config.player_height || "default";
		ui.arena.dataset.player_height_nova = lib.config.player_height_nova || "default";
		// if(lib.config.player_height_nova=='long') ui.arena.classList.add('player_autolong');
		ui.arena.dataset.target_shake = lib.config.target_shake || "off";
		ui.backgroundMusic = document.createElement("audio");
		ui.backgroundMusic.volume = lib.config.volumn_background / 8;
		game.playBackgroundMusic();
		ui.backgroundMusic.autoplay = true;
		ui.backgroundMusic.addEventListener("ended", game.playBackgroundMusic);
		ui.window.appendChild(ui.backgroundMusic);
		ui.window.addEventListener(
			lib.config.touchscreen ? "touchend" : "click",
			() => {
				if (!ui.backgroundMusic.played.length && lib.config.background_music != "music_off" && !isNaN(ui.backgroundMusic.duration)) {
					ui.backgroundMusic.play();
				}
			},
			{ once: true }
		);
		if (lib.config.cursor_style == "pointer") {
			ui.window.classList.add("nopointer");
		}
		if (lib.config.turned_style == false) {
			ui.arena.classList.add("hide_turned");
		}
		if (lib.config.link_style2 != "chain") {
			ui.arena.classList.add("nolink");
		}
		if (lib.config.show_name == false) {
			ui.arena.classList.add("hide_name");
		}
		if (lib.config.change_skin_auto != "off") {
			_status.skintimeout = setTimeout(ui.click.autoskin, parseInt(lib.config.change_skin_auto));
		}
		if (lib.config.border_style && lib.config.border_style.startsWith("dragon_")) {
			ui.arena.dataset.framedecoration = lib.config.border_style.slice(7);
		}

		ui.gameinfo = ui.create.div("#time", ui.window);

		ui.arenalog = ui.create.div("#arenalog", ui.arena);
		if (lib.config.show_log == "off") {
			ui.arenalog.style.display = "none";
		} else {
			ui.arenalog.dataset.position = lib.config.show_log;
		}
		ui.historybar = ui.create.div("#historybar.shadowed", ui.window);
		lib.setScroll(ui.historybar);

		ui.roundmenu = ui.create.div("#roundmenu.roundarenabutton.menubutton.round", ui.arena);
		ui.roundmenu._position = [180, 210];
		ui.create.div(ui.roundmenu);
		ui.create.div(ui.roundmenu);
		ui.create.div(ui.roundmenu);
		ui.create.div(ui.roundmenu);
		ui.create.div(ui.roundmenu);
		ui.create.div(ui.roundmenu);

		ui.create.div(ui.roundmenu);
		ui.create.div(ui.roundmenu);
		ui.create.div(ui.roundmenu);
		ui.create.div(ui.roundmenu);
		ui.create.div(ui.roundmenu);
		ui.create.div(ui.roundmenu);

		ui.create.div(ui.roundmenu);
		ui.create.div(ui.roundmenu);

		ui.create.div(ui.roundmenu);

		if (lib.config.show_time2) {
			ui.roundmenu.classList.add("clock");
		}
		ui.roundmenu.dataset.watchface = lib.config.watchface || "none";
		if (get.is.phoneLayout()) {
			if (lib.config.show_time3) {
				ui.time3 = ui.create.div(".touchinfo.left", ui.window);
			}
			ui.cardPileNumber = ui.create.div(".touchinfo.right", ui.window);
		} else {
			if (lib.config.show_time3) {
				ui.time3 = ui.create.div(ui.gameinfo);
			}
			ui.cardPileNumber = ui.create.div(ui.gameinfo);
		}
		if (!lib.config.show_cardpile_number) {
			ui.cardPileNumber.style.display = "none";
		}
		if (ui.time3) {
			ui.time3.starttime = get.utc();
			ui.time3.interval = setInterval(function () {
				var num = Math.round((get.utc() - ui.time3.starttime) / 1000);
				if (num >= 3600) {
					var num1 = Math.floor(num / 3600);
					var num2 = Math.floor((num - num1 * 3600) / 60);
					if (num2 < 10) {
						num2 = "0" + num2.toString();
					}
					var num3 = num - num1 * 3600 - parseInt(num2) * 60;
					if (num3 < 10) {
						num3 = "0" + num3.toString();
					}
					ui.time3.innerHTML = num1 + ":" + num2 + ":" + num3;
				} else {
					var num1 = Math.floor(num / 60);
					var num2 = num - num1 * 60;
					if (num2 < 10) {
						num2 = "0" + num2.toString();
					}
					ui.time3.innerHTML = num1 + ":" + num2;
				}
			}, 1000);
		}
		if (get.is.nomenu()) {
			if (!["menu", "system"].includes(lib.config.round_menu_func)) {
				lib.config.round_menu_func = "system";
			}
		} else if (!lib.config.show_round_menu) {
			ui.roundmenu.style.display = "none";
		}

		var resetround = function (e) {
			_status.draggingroundmenu = false;
			ui.roundmenu.style.transform = "";
			ui.roundmenu._dragtransform = [0, 0];
			ui.roundmenu.style.transition = "all 0.3s";
			delete ui.roundmenu._dragtouches;
			delete ui.roundmenu._dragorigin;
			delete ui.roundmenu._dragorigintransform;
			setTimeout(function () {
				ui.roundmenu.style.transition = "";
			}, 500);
			game.saveConfig("roundmenu_transform", [0, 0]);
			if (e) {
				e.stopPropagation();
			}
			return false;
		};
		ui.click.resetround = resetround;
		if (lib.config.touchscreen) {
			ui.roundmenu.addEventListener("touchstart", function (e) {
				_status.draggingroundmenu = true;
				ui.roundmenu._dragorigin = {
					clientX: e.touches[0].clientX,
					clientY: e.touches[0].clientY,
				};
				if (!ui.roundmenu._dragtransform) {
					ui.roundmenu._dragtransform = [0, 0];
				}
				ui.roundmenu._dragorigintransform = ui.roundmenu._dragtransform.slice(0);
				ui.roundmenu._resetTimeout = setTimeout(function () {
					resetround();
					delete ui.roundmenu._resetTimeout;
				}, 1000);
			});
		} else {
			ui.roundmenu.oncontextmenu = resetround;
		}
		if (!lib.config.remember_round_button) {
			game.saveConfig("roundmenu_transform");
		}
		if (lib.config.roundmenu_transform) {
			var translate = lib.config.roundmenu_transform;
			ui.roundmenu._dragtransform = translate;
			ui.roundmenu.style.transform = "translate(" + translate[0] + "px," + translate[1] + "px)";
			ui.click.checkroundtranslate();
		}
		if (get.is.phoneLayout()) {
			ui.arena.classList.add("phone");
		}

		ui.sidebar = ui.create.div("#sidebar");
		ui.sidebar3 = ui.create.div("#sidebar3");
		ui.canvas = document.createElement("canvas");

		ui.arena.appendChild(ui.canvas);
		ui.canvas.id = "canvas";
		ui.ctx = ui.canvas.getContext("2d");

		ui.sidebar.ontouchstart = ui.click.touchStart;
		ui.sidebar.ontouchmove = ui.click.touchScroll;
		ui.sidebar.style.webkitOverflowScrolling = "touch";

		let zoom = Number.parseInt(lib.config.ui_zoom);
		if (isNaN(zoom) || zoom < 50 || zoom > 300) {
			zoom = 100;
			game.saveConfig("ui_zoom", `${zoom}%`);
		}

		game.documentZoom = (game.deviceZoom * zoom) / 100;
		zoom !== 100 && ui.updatez();

		if (get.mode() === "doudizhu") {
			if (typeof get.config("choice_zhu", "doudizhu") !== "number") {
				game.saveConfig("choice_zhu", 5, "doudizhu");
			}
			if (typeof get.config("choice_fan", "doudizhu") !== "number") {
				game.saveConfig("choice_fan", 3, "doudizhu");
			}
		}
		
		// 根据157的要求移除掉本体的五行扩展哦喵
		if (game.hasExtension("wuxing")) {
			game.removeExtension("wuxing");
		}

		ui.system1 = ui.create.div("#system1", ui.system);
		ui.system2 = ui.create.div("#system2", ui.system);

		ui.replay = ui.create.system("重来", game.reload, true);
		ui.replay.id = "restartbutton";
		ui.config2 = ui.create.system("选项", ui.click.config);
		ui.pause = ui.create.system("暂停", ui.click.pause);
		ui.pause.id = "pausebutton";
		if (!_status.video) {
			ui.pause.hide();
		}
		if (!lib.config.touchscreen) {
			lib.setPopped(ui.pause, ui.click.pausehistory, 220, 400, null, true);
		}
		if (!lib.config.show_pause) {
			ui.pause.style.display = "none";
		}
		ui.cardPileButton = ui.create.system("牌堆", null, true);
		ui.cardPileButton.style.display = "none";
		lib.setPopped(ui.cardPileButton, ui.click.cardPileButton, 220);
		ui.wuxie = ui.create.system("不询问无懈", ui.click.wuxie, true);
		if (!lib.config.touchscreen) {
			lib.setPopped(ui.config2, ui.click.pauseconfig, 170);
		}
		ui.auto = ui.create.system("托管", ui.click.auto);
		if (!game.syncMenu) {
			ui.config2.classList.add("hidden");
			ui.config2.style.transition = "all 0.5s";
			ui.roundmenu.classList.add("transparent2");

			ui.auto.style.opacity = 0.5;
			ui.auto.style.transition = "all 0.5s";
			lib.onfree.push(function () {
				ui.auto.style.opacity = "";
				setTimeout(function () {
					ui.auto.style.transition = "";
				}, 500);
			});
		}
		ui.auto.id = "autobutton";
		ui.autonode = ui.create.div("#autonode", "<div>托管中...</div>", ui.arena);
		ui.autonode.listen(ui.click.auto);
		if (lib.config.mode == "connect") {
			ui.auto.hide();
			ui.pause.hide();
		}

		if (lib.forcehide) {
			if (lib.forcehide.includes("replay")) {
				ui.replay.classList.add("forcehide");
			}
			if (lib.forcehide.includes("auto")) {
				ui.auto.classList.add("forcehide");
			}
			if (lib.forcehide.includes("pause")) {
				ui.pause.classList.add("forcehide");
			}
			if (lib.forcehide.includes("wuxie")) {
				ui.wuxie.classList.add("forcehide");
			}
			if (lib.forcehide.includes("cardPileButton")) {
				ui.cardPileButton.classList.add("forcehide");
			}
		}
		ui.volumn = ui.create.system("♫");
		lib.setPopped(ui.volumn, ui.click.volumn, 200);
		// if(lib.config.show_pause) ui.auto.style.marginLeft='10px';
		if (!lib.config.show_volumn) {
			ui.volumn.style.display = "none";
		}
		if (!lib.config.show_auto) {
			ui.auto.style.display = "none";
		}
		if (!lib.config.show_wuxie) {
			ui.wuxie.style.display = "none";
		}
		// if(!lib.config.show_cardpile||_status.connectMode){
		// 	ui.cardPileButton.style.display='none';
		// }

		ui.sortCard = ui.create.system("整理手牌", function () {
			if (!game.me || game.me.hasSkillTag("noSortCard")) {
				return;
			}
			var hs = game.me.getCards("h");
			if (!hs.length) {
				return;
			}
			game.addVideo("lose", game.me, [get.cardsInfo(hs), [], [], []]);
			for (var i = 0; i < hs.length; i++) {
				hs[i].goto(ui.special);
			}
			if (game.me.hasSkillTag("sortCardByNum")) {
				var getn = function (card) {
					var num = get.number(card, game.me);
					if (num < 3) {
						return 13 + num;
					}
					return num;
				};
				hs.sort((a, b) => getn(b) - getn(a));
			} else {
				hs.sort(function (b, a) {
					if (a.name != b.name) {
						return lib.sort.card(a.name, b.name);
					} else if (a.suit != b.suit) {
						return lib.suit.indexOf(a) - lib.suit.indexOf(b);
					} else {
						return a.number - b.number;
					}
				});
			}
			game.me.directgain(hs, false);
		});
		if (!lib.config.show_sortcard) {
			ui.sortCard.style.display = "none";
		}
		//------添加记牌器 by Curpond-------
		ui.deckMonitor = ui.create.system(
			"记牌器",
			async function () {
				function getResult() {
					return new Promise((resolve, reject) => {
						if (game.online) {
							try {
								game.ws.send(JSON.stringify(["cardPile"]));
								game.ws.addEventListener(
									"message",
									function (e) {
										let data = JSON.parse(JSON.parse(e.data)[0]);
										if (data.type == "cardPile") {
											resolve(data.data);
										}
									},
									{ once: true }
								);
							} catch (error) {
								resolve(false);
							}
						} else {
							resolve({
								drawPile: ui.cardPile.children,
								discardPile: ui.discardPile.children,
							});
						}
					});
				}
				if (!_status.gameStarted) {
					return;
				}
				game.pause2();

				let result = await getResult();
				if (!result) {
					return;
				}
				let drawPile = result.drawPile;
				let discardPile = result.discardPile;

				let popupContainer = ui.create.div(".popupContainer.deckMonitor", ui.window, function () {
					this.delete(400);
					game.resume2();
				});
				let container = ui.create.div(".deckMonitor", popupContainer, function (e) {
					e.stopPropagation();
				});
				let flag = true;
				let titleContainer = ui.create.div(".title", container, function (e) {
					if (flag) {
						statistic(discardPile, "弃牌牌堆");
					} else {
						statistic(drawPile, "摸牌牌堆");
					}
					flag = !flag;
				});
				let contentContainer = ui.create.div(".contentContainer", container);
				statistic(drawPile, "摸牌牌堆");
				function statistic(cards, title) {
					titleContainer.innerHTML = `${title}【${cards.length}张】 <span>(点击切换)</span>`;
					contentContainer.innerHTML = "";
					renderNumberColumn();
					renderSuitColumn();
					renderTypeColumns();
					function renderNumberColumn() {
						let numberResult = Object.groupBy(cards, card => get.number(card));
						for (let i = 1; i <= 13; i++) {
							if (!numberResult[i]) {
								numberResult[i] = [];
							}
						}
						createColumnContainer(numberResult, "点数", cards.length);
					}
					function renderSuitColumn() {
						let suitResult = Object.groupBy(cards, card => get.suit(card));
						Object.assign(
							suitResult,
							Object.groupBy(cards, card => {
								if (get.suit(card) == "spade" && get.number(card) <= 9 && get.number(card) >= 2) {
									return "♠2-9";
								}
							})
						);
						// @ts-expect-error ignore
						delete suitResult[void 0];
						for (let suit of lib.suit) {
							if (!suitResult[suit]) {
								suitResult[suit] = [];
							}
						}
						createColumnContainer(suitResult, "花色", cards.length);
					}
					function renderTypeColumns() {
						let typeResult = Object.groupBy(cards, card => get.type(card));
						typeResult.basic ??= [];
						typeResult.trick ??= [];
						typeResult.equip ??= [];
						typeResult.delay ??= [];
						for (let key of Object.keys(typeResult).sort((a, b) => {
							let arr = ["basic", "trick", "equip", "delay", "jiqi", "spell", "zhenfa", "food", "jiguan", "land"];
							return arr.indexOf(a) - arr.indexOf(b);
						})) {
							let result = Object.groupBy(typeResult[key], card => get.name(card));
							if (key == "basic") {
								Object.assign(
									result,
									Object.groupBy(typeResult[key], card => {
										if (get.name(card) !== "sha") {
											return;
										}
										return get.translation(get.color(card)) + "杀";
									})
								);
								Object.assign(
									result,
									Object.groupBy(typeResult[key], card => {
										if (get.name(card) !== "sha") {
											return;
										}
										let perfix = get.translation(get.nature(card));
										if (perfix == "") {
											perfix = "普通";
										}
										return perfix + "杀";
									})
								);
								// @ts-expect-error ignore
								delete result[void 0];
								createColumnContainer(result, get.translation(key), typeResult[key].length);
							} else {
								createColumnContainer(result, get.translation(key), typeResult[key].length);
							}
						}
					}
					function createColumnContainer(result, title, count) {
						let column = ui.create.div(".columnContainer", contentContainer);
						let subtitle = ui.create.div(".subtitle", column);
						subtitle.textContent = `${title}(${count})`;
						let itemContainer = ui.create.div(".itemContainer", column);
						for (let key in result) {
							let item = ui.create.div(".item", itemContainer);
							let tip = ui.create.div(".tip", item);
							tip.innerHTML = handleColor(
								result[key].reduce((a, c) => {
									return a + `${get.translation(get.suit(c))}${get.number(c)} `;
								}, "")
							);
							item.addEventListener("mouseenter", function (e) {
								if (tip.innerHTML == "") {
									return;
								}
								tip.style.display = "block";
								let rect = item.getBoundingClientRect();
								if (rect.top < window.innerHeight / 2) {
									tip.style.top = "110%";
								} else {
									tip.style.bottom = "110%";
								}
							});
							item.addEventListener("mouseleave", function (e) {
								tip.style.display = "none";
							});
							let itemName = ui.create.div(".itemName", item);
							let itemCount = ui.create.div(".itemCount", item);
							itemName.innerHTML = handleColor(get.translation(key));
							itemCount.textContent = `×${result[key].length}`;
						}
						function handleColor(str) {
							let red = `[${get.translation("diamond")}${get.translation("heart")}]`;
							let black = `[${get.translation("club")}${get.translation("spade")}]`;
							return str.replace(new RegExp(red, "g"), '<span style="color:red">$&</span>').replace(new RegExp(black, "g"), '<span style="color:black">$&</span>');
						}
					}
				}
			},
			true,
			true
		);

		lib.arenaReady?.push(function () {
			if (lib.config.show_deckMonitor) {
				ui.deckMonitor.style.display = "";
				if (_status.connectMode && !lib.config.show_deckMonitor_online) {
					ui.deckMonitor.style.display = "none";
				}
			} else {
				ui.deckMonitor.style.display = "none";
			}
			document.documentElement.style.setProperty("--tip-display", lib.config.show_tip ? "flex" : "none");
		});

		//---------------------------------
		ui.playerids = ui.create.system(
			"显示身份",
			function () {
				if (game.showIdentity) {
					game.showIdentity();
					_status.identityShown = true;
				}
			},
			true
		);
		if (!lib.config.show_playerids || !game.showIdentity) {
			ui.playerids.style.display = "none";
		}
		if (!lib.config.show_replay) {
			ui.replay.style.display = "none";
		}
		ui.control = ui.create.div("#control", ui.arena).addTempClass("nozoom");
		ui.cardPile = ui.create.div("#cardPile");
		ui.discardPile = ui.create.div("#discardPile");
		ui.special = ui.create.div("#special");
		ui.ordering = ui.create.div("#ordering");
		ui.dialogs = [];
		ui.controls = [];
		ui.style = {};

		ui.time = ui.create.div(ui.gameinfo);
		var timeInterval = function () {
			var date = new Date();
			var hours = date.getHours();
			var minutes = date.getMinutes();
			if (lib.config.watchface == "simple") {
				ui.roundmenu.childNodes[13].style.transform = "rotate(" + get.round((hours + 9) * 30, 2) + "deg)";
			} else {
				ui.roundmenu.childNodes[13].style.transform = "rotate(" + get.round((hours + minutes / 60 + 9) * 30, 2) + "deg)";
			}
			ui.roundmenu.childNodes[12].style.transform = "rotate(" + (minutes + 45) * 6 + "deg)";
			if (minutes < 10) {
				minutes = "0" + minutes.toString();
			}
			ui.time.innerHTML = hours + ":" + minutes;
		};
		_status.timeInterval = setInterval(timeInterval, 30000);
		timeInterval();
		if (!lib.config.show_time) {
			ui.time.style.display = "none";
		}

		ui.timer = ui.create.div(".skillbar.shadowed.playerbg.hidden");
		ui.timer.id = "timer";
		ui.create.div(".skillbarshadow", ui.timer);
		ui.create.div(".skillbarfill", ui.timer);
		ui.timer.fillnode = ui.create.div(ui.timer.lastChild);
		ui.timer.popnode = ui.create.div(".skillbartext", ui.timer);
		ui.timer.popnode.style.opacity = 1;
		ui.timer.position = 4;
		ui.timer.style.zIndex = 5;
		ui.timer.set = function (text, percentage) {
			if (typeof text == "string" || typeof text == "number") {
				ui.timer.popnode.innerHTML = text;
			}
			ui.timer.fillnode.style.top = (1 - percentage) * 100 + "%";
		};
		var setTimerPosition = function (e) {
			this.position++;
			if (this.position > 4) {
				this.position = 1;
			}
			var left1 = "180px";
			var left2 = "calc(100% - 245px)";
			var top1 = "210px";
			var top2 = "calc(100% - 245px)";
			if (game.layout == "default") {
				left1 = "265px";
				top1 = "160px";
				left2 = "calc(100% - 330px)";
				top2 = "calc(100% - 235px)";
			}
			if (this.position == 1 || this.position == 2) {
				this.style.top = top2;
			} else {
				this.style.top = top1;
			}
			if (this.position == 1 || this.position == 4) {
				this.style.left = left2;
			} else {
				this.style.left = left1;
			}
		};
		ui.timer.listen(setTimerPosition);

		ui.shortcut = ui.create.div("#shortcut.hidden", ui.window);
		ui.shortcut.listen(ui.click.shortcut);
		ui.create.div(ui.shortcut, function (e) {
			e.stopPropagation();
		});
		ui.create.div(".menubutton.round", "<span>重来</span>", ui.shortcut, game.reload).dataset.position = 1;
		ui.create.div(".menubutton.round", "<span>退出</span>", ui.shortcut, game.exit).dataset.position = 3;
		ui.create.div(".menubutton.round", "<span>记录</span>", ui.shortcut, ui.click.pause).dataset.position = 4;
		ui.shortcut.autobutton = ui.create.div(".menubutton.round", "<span>托管</span>", ui.shortcut, ui.click.auto);
		ui.shortcut.autobutton.dataset.position = 2;
		ui.favmodelist = ui.create.div(".favmodelist", ui.shortcut);
		ui.favmodelist.update = function () {
			const favouriteMode = lib.config.favouriteMode;
			let removed = false;
			for (let index = 0; index < favouriteMode.length; index++) {
				if (typeof favouriteMode[index] == "string") {
					continue;
				}
				favouriteMode.splice(index--, 1);
				if (!removed) {
					removed = true;
				}
			}
			if (removed) {
				game.saveConfigValue("favouriteMode");
			}
			this.innerHTML = "";
			favouriteMode.slice(0, 6).forEach((value, index) => this.add(value, index));
			let mode = lib.config.mode;
			const config = get.config(`${mode}_mode`);
			if (typeof config == "string") {
				mode += `|${config}`;
			}
			if (favouriteMode.includes(mode)) {
				ui.favmode.classList.add("glow");
			} else {
				ui.favmode.classList.remove("glow");
			}
		};
		ui.favmodelist.add = function (name, index) {
			const info = name.split("|"),
				mode = info[0],
				submode = info[1],
				node = ui.create.div(".menubutton.large", this),
				dataset = node.dataset;
			dataset.type = Math.min(6, lib.config.favouriteMode.length) % 2 == 0 ? "even" : "odd";
			dataset.position = index;
			let str = lib.translate[name] || lib.translate[mode] || "";
			if (str.length == 2) {
				str += "模式";
			}
			node.innerHTML = str;
			node.listen(() => {
				game.saveConfig("mode", mode);
				if (submode) {
					game.saveConfig(`${mode}_mode`, submode, mode);
				}
				game.reload();
			});
		};
		ui.favmode = ui.create.system("收藏", function () {
			const mode = typeof _status.mode == "string" ? `${lib.config.mode}|${_status.mode}` : lib.config.mode;
			if (this.classList.contains("glow")) {
				this.classList.remove("glow");
				lib.config.favouriteMode.remove(mode);
			} else {
				this.classList.add("glow");
				lib.config.favouriteMode.add(mode);
			}
			game.saveConfig("favouriteMode", lib.config.favouriteMode);
			ui.favmodelist.update();
			_status.clicked = true;
		});
		ui.favmode.style.display = "none";
		ui.favmodelist.update();
		// ui.create.div('.menubutton.round','<span>菜单</span>',ui.shortcut,ui.click.config).dataset.position=5;

		if (_status.connectMode) {
			ui.playerids.remove();
			ui.pause.innerHTML = "记录";
		}
		setTimerPosition.call(ui.timer);
		ui.arena.appendChild(ui.timer);

		if (!game.syncMenu) {
			lib.onfree.push(function () {
				ui.create.menu();
				ui.config2.classList.remove("hidden");
				ui.roundmenu.classList.remove("transparent2");
				setTimeout(function () {
					ui.config2.style.transition = "";
				}, 500);
			});
		} else {
			ui.create.menu();
		}

		lib.status.date = new Date();
		lib.status.dateDelayed = 0;

		while (lib.arenaReady?.length) {
			lib.arenaReady?.shift()();
		}
		delete lib.arenaReady;
		if (lib.config.auto_check_update && !sessionStorage.getItem("auto_check_update")) {
			setTimeout(() => {
				sessionStorage.setItem("auto_check_update", "1");
				game.checkForUpdate(false);
			}, 3000);
		}
		if (!lib.config.asset_version) {
			lib.onfree.push(function () {
				setTimeout(function () {
					if (!game.download) {
						game.saveConfig("asset_version", "无");
					} else {
						var func = function () {
							if (confirm("是否下载图片和字体素材？")) {
								if (!ui.arena.classList.contains("menupaused")) {
									ui.click.configMenu();
									ui.click.menuTab("其它");
								}
								setTimeout(game.checkForAssetUpdate, 500);
							} else {
								game.saveConfig("asset_version", "无");
							}
						};
						// if (_status.new_tutorial) {
						// 	_status.new_tutorial = func;
						// } else {
						// 	func();
						// }
					}
				}, 3000);
			});
		}
		if (localStorage.getItem(lib.configprefix + "playback")) {
			setTimeout(lib.init.onfree);
		}

		if (lib.config.test_game) {
			ui.window.classList.add("testing");
			lib.config.game_speed = "vfast";
			lib.config.low_performance = true;
			lib.config.animation = false;
			_status.auto = true;
			ui.auto.classList.add("glow");
			setTimeout(function () {
				var node = ui.create.pause().addTempClass("start");
				node.appendChild(ui.sidebar);
				node.firstChild.innerHTML = "正在测试";
				node.removeEventListener("click", ui.click.resume);
			}, 500);
		}
	}
	system(str, func, right, before) {
		var parent = right ? ui.system2 : ui.system1;
		var node = ui.create.div();
		if (before) {
			parent.insertBefore(node, parent.firstChild);
		} else {
			parent.appendChild(node);
		}
		node.innerHTML = str;
		if (func) {
			node.listen(func);
		}
		if (lib.config.button_press) {
			node.addEventListener(lib.config.touchscreen ? "touchstart" : "mousedown", function (e) {
				if (!node.classList.contains("hidden")) {
					node.classList.add("pressdown");
				}
			});
			node.addEventListener(lib.config.touchscreen ? "touchend" : "mouseup", function (e) {
				node.classList.remove("pressdown");
			});
			node.addEventListener(lib.config.touchscreen ? "touchmove" : "mousemove", function (e) {
				node.classList.remove("pressdown");
			});
		}
		return node;
	}
	pause() {
		if (_status.pausing) {
			return;
		}
		ui.click.shortcut(false);
		var node = ui.create.div(".pausedbg", ui.window);
		_status.pausing = true;
		setTimeout(function () {
			_status.pausing = false;
		}, 500);
		if (lib.config.touchscreen) {
			setTimeout(function () {
				node.addEventListener("touchend", ui.click.resume);
			}, 500);
		} else {
			node.addEventListener("click", ui.click.resume);
		}
		if (!lib.config.touchscreen) {
			node.oncontextmenu = ui.click.resume;
		}

		var node2 = ui.create.div(node);
		if (_status.connectMode) {
			node2.innerHTML = "";
		} else {
			node2.innerHTML = "已暂停";
		}

		// node2.listen(function(){
		// 	_status.clicked=true;
		// 	if(ui.sidebar.classList.contains('hidden')){
		// 		ui.sidebar.show();
		// 		ui.sidebar3.show();
		// 	}
		// 	else{
		// 		ui.sidebar.hide();
		// 		ui.sidebar3.hide();
		// 	}
		// });
		return node;
	}
	prebutton(item, type, position, noclick) {
		var node = ui.create.div(position);
		node.style.display = "none";
		node.link = item;
		node.activate = function () {
			ui.create.button(item, type, position, noclick, node);
			delete node.activate;
		};
		_status.prebutton.push(node);
		return node;
	}
	buttonPresets = {
		/**
		 * @returns { import("../../library/index.js").Button }
		 */
		tdnodes: (item, type, position, noclick, node) => {
			node = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode.tdnodes", position);
			if (Array.isArray(item)) {
				node.innerHTML = "<span>" + item[1] + "</span>";
				node.link = item[0];
			} else {
				node.innerHTML = "<span>" + item + "</span>";
				node.link = item;
			}
			return node;
		},
		/**
		 * @returns { import("../../library/index.js").Button }
		 */
		blank: (item, type, position, noclick, node) => {
			node = ui.create.div(".button.card", position);
			node.link = item;
			if (get.position(item) == "j" && item.viewAs && lib.config.cardtempname != "off") {
				node.classList.add("infoflip");
				node.classList.add("infohidden");
				ui.create.cardTempName(item, node).style.setProperty("display", "block", "important");
			}
			return node;
		},
		/**
		 * @returns { import("../../library/index.js").Button }
		 */
		card: (item, type, position, noclick, node) => {
			if (typeof item.copy == "function") {
				node = item.copy(false);
			} else {
				node = item.cloneNode(true);
			}
			node.classList.add("button");
			if (position) {
				position.appendChild(node);
			}
			node.link = item;
			if (item.style.backgroundImage) {
				node.style.backgroundImage = item.style.backgroundImage;
				node.style.backgroundSize = "cover";
			}
			if (item.style.color) {
				node.style.color = item.style.color;
			}
			if (item.nature) {
				let natures = get.natureList(item.nature);
				natures.forEach(n => node.classList.add(n));
			}
			if (!noclick) {
				lib.setIntro(node);
			}
			const itemPosition = get.position(item);
			if ((itemPosition === "e" || itemPosition === "j") && item.viewAs && item.viewAs != item.name && lib.config.cardtempname != "off") {
				ui.create.cardTempName(item, node);
			}
			return node;
		},
		/**
		 * @returns { import("../../library/index.js").Button }
		 */
		vcard: (item, type, position, noclick, node) => {
			if (typeof item == "string") {
				item = [get.type(item), "", item];
			}
			node = ui.create.card(position, "noclick", noclick);
			node.classList.add("button");
			node.init(item);
			node.link = item;
			return node;
		},
		/**
		 * @returns { import("../../library/index.js").Button }
		 */
		character: (item, type, position, noclick, node) => {
			if (node) {
				node.classList.add("button");
				node.classList.add("character");
				node.style.display = "";
			} else {
				node = ui.create.div(".button.character", position);
			}
			node._link = item;
			if (_status.noReplaceCharacter && type == "characterx") {
				type = "character";
			}
			if (type == "characterx") {
				if (lib.characterReplace[item] && lib.characterReplace[item].length) {
					item = lib.characterReplace[item].randomGet();
				}
			}
			node.link = item;

			var double = get.is.double(node._link, true);
			if (double) {
				node._changeGroup = true;
			}
			if (type == "characterx" && lib.characterReplace[node._link] && lib.characterReplace[node._link].length > 1) {
				node._replaceButton = true;
			}
			var func = function (node, item) {
				node.setBackground(item, "character");
				if (node.node) {
					node.node.name.remove();
					node.node.hp.remove();
					node.node.group.remove();
					node.node.intro.remove();
					if (node.node.replaceButton) {
						node.node.replaceButton.remove();
					}
				}
				node.node = {
					name: ui.create.div(".name", node),
					hp: ui.create.div(".hp", node),
					group: ui.create.div(".identity", node),
					intro: ui.create.div(".intro", node),
				};
				var infoitem = get.character(item);
				node.node.name.innerHTML = get.slimName(item);
				if (lib.config.buttoncharacter_style == "default" || lib.config.buttoncharacter_style == "simple") {
					if (lib.config.buttoncharacter_style == "simple") {
						node.node.group.style.display = "none";
					}
					node.classList.add("newstyle");
					node.node.name.dataset.nature = get.groupnature(get.bordergroup(infoitem));
					node.node.group.dataset.nature = get.groupnature(get.bordergroup(infoitem), "raw");
					ui.create.div(node.node.hp);
					var hp = infoitem.hp,
						maxHp = infoitem.maxHp,
						hujia = infoitem.hujia;
					var str = get.numStr(hp);
					if (hp !== maxHp) {
						str += "/";
						str += get.numStr(maxHp);
					}
					var textnode = ui.create.div(".text", str, node.node.hp);
					if (infoitem[2] == 0) {
						node.node.hp.hide();
					} else if (get.infoHp(infoitem[2]) <= 3) {
						node.node.hp.dataset.condition = "mid";
					} else {
						node.node.hp.dataset.condition = "high";
					}
					if (hujia > 0) {
						ui.create.div(node.node.hp, ".shield");
						ui.create.div(".text", get.numStr(hujia), node.node.hp);
					}
				} else {
					var hp = infoitem.hp,
						maxHp = infoitem.maxHp,
						shield = infoitem.hujia;
					if (maxHp > 14) {
						if (hp !== maxHp || shield > 0) {
							node.node.hp.innerHTML = infoitem[2];
						} else {
							node.node.hp.innerHTML = get.numStr(infoitem[2]);
						}
						node.node.hp.classList.add("text");
					} else {
						for (var i = 0; i < maxHp; i++) {
							var next = ui.create.div("", node.node.hp);
							if (i >= hp) {
								next.classList.add("exclude");
							}
						}
						for (var i = 0; i < shield; i++) {
							ui.create.div(node.node.hp, ".shield");
						}
					}
				}
				if (node.node.hp.childNodes.length == 0) {
					node.node.name.style.top = "8px";
				}
				if (node.node.name.querySelectorAll("br").length >= 4) {
					node.node.name.classList.add("long");
					if (lib.config.buttoncharacter_style == "old") {
						node.addEventListener("mouseenter", ui.click.buttonnameenter);
						node.addEventListener("mouseleave", ui.click.buttonnameleave);
					}
				}
				node.node.intro.innerHTML = lib.config.intro;
				if (!noclick) {
					lib.setIntro(node);
				}
				if (infoitem[1]) {
					if (double) {
						node.node.group.innerHTML = double.reduce((previousValue, currentValue) => `${previousValue}<div data-nature="${get.groupnature(currentValue)}">${get.translation(currentValue)}</div>`, "");
						if (double.length > 4) {
							if (new Set([5, 6, 9]).has(double.length)) {
								node.node.group.style.height = "48px";
							} else {
								node.node.group.style.height = "64px";
							}
						}
					} else {
						node.node.group.innerHTML = `<div>${get.translation(infoitem[1])}</div>`;
					}
					node.node.group.style.backgroundColor = get.translation(`${get.bordergroup(infoitem)}Color`);
				} else {
					node.node.group.style.display = "none";
				}
				if (node._replaceButton) {
					var intro = ui.create.div(".button.replaceButton", node);
					intro[lib.experimental.symbol.itemType] = "button";
					node.node.replaceButton = intro;
					intro.innerHTML = "切换";
					intro._node = node;
					intro.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
						_status.tempNoButton = true;
						var node = this._node;
						var list = lib.characterReplace[node._link];
						var link = node.link;
						var index = list.indexOf(link);
						if (index == list.length - 1) {
							index = 0;
						} else {
							index++;
						}
						link = list[index];
						node.link = link;
						node.refresh(node, link);
						setTimeout(function () {
							delete _status.tempNoButton;
						}, 200);
					});
				}
			};
			node.refresh = func;
			node.refresh(node, item);

			return node;
		},
		/**
		 * @returns { import("../../library/index.js").Button }
		 */
		characterx: (item, type, position, noclick, node) => {
			return ui.create.buttonPresets.character(item, type, position, noclick, node);
		},
		/**
		 * @returns { import("../../library/index.js").Button }
		 */
		player: (item, type, position, noclick, node) => {
			if (node) {
				node.classList.add("button");
				node.classList.add("character");
				node.style.display = "";
			} else {
				node = ui.create.div(".button.character", position);
			}
			node._link = item;
			node.link = item;
			node.node = {
				name: ui.create.div(".name", node),
				intro: ui.create.div(".intro", node),
			};
			if (item.name && item.name.startsWith("unknown")) {
				if (item.node && item.node.name_seat) {
					node.classList.add("cardbg");
					ui.create.div(".avatar_name", node, get.translation(item.name));
				} else {
					node.setBackground(item.name1, "character");
				}
			} else {
				node.setBackground(item.name, "character");
			}
			return node;
		},
		/**
		 * @returns { import("../../library/index.js").Button }
		 */
		skill: (item, type, position, noclick, node) => {
			//搜索拥有这个技能的角色
			let characterName;
			if (Array.isArray(item)) {
				characterName = item[1] || _status.skillOwner[item[0]];
				item = item[0];
			} else {
				characterName = _status.skillOwner[item] || "shibing";
			}
			const info = get.character(characterName);
			//创建这张vcard并重新赋值link
			node = ui.create.buttonPresets.vcard(item, "vcard", position, noclick);
			node.owner = characterName;
			node.link = item;
			//更改vcard的名字不然看不清
			node.node.name.innerHTML = `<div class="name" data-nature=${get.groupnature(info[1], "raw")}m style="position: relative;color:#ffffff;fontweight:bold">${get.translation(item)}</div>`;
			//更改vcard背景
			node.node.background.innerHTML = "";
			node.setBackground(characterName, "character");
			//添加右键查看技能信息
			node._customintro = function (uiintro, evt) {
				const skill = node.link;
				uiintro.add(get.translation(skill));
				if (lib.translate[skill + "_info"]) {
					uiintro.add(`<div class="text">${get.skillInfoTranslation(skill)}</div>`);
					if (lib.translate[skill + "_append"]) {
						uiintro._place_text = uiintro.add('<div class="text">' + lib.translate[skill + "_append"] + "</div>");
					}
				}
				if (lib.skill[skill]?.derivation) {
					let skills = lib.skill[skill].derivation;
					if (!Array.isArray(skills)) {
						skills = [skills];
					}
					skills = skills.filter(skill => lib.translate[`${skill}_info`] && lib.skill[skill]);
					if (skills.length) {
						uiintro.add(`—— 衍生技能 ——`);
					}
					uiintro.add([skills.map(i => [i, node.owner]), ui.create.buttonPresets.skill]);
				}
			};
			return node;
		},
	};
	button(item, type, position, noClick, button) {
		return new lib.element.Button(item, type, position, noClick, button);
	}
	buttons(list, type, position, noclick, zoom) {
		var buttons = [];
		var pre = typeof type == "string" && type.slice(0, 3) == "pre";
		if (pre) {
			if (!_status.prebutton) {
				_status.prebutton = [];
				lib.onfree.push(function () {
					for (var i = 0; i < _status.prebutton.length; i++) {
						if (_status.prebutton[i].activate) {
							_status.prebutton[i].activate();
						}
					}
					delete _status.prebutton;
				});
			}
		}
		var fragment = document.createDocumentFragment();
		for (var i = 0; i < list.length; i++) {
			if (pre) {
				buttons.push(ui.create.prebutton(list[i], type.slice(3), fragment, noclick));
			} else {
				buttons.push(ui.create.button(list[i], type, fragment, noclick));
			}
		}
		if (position) {
			position.appendChild(fragment);
		}
		return buttons;
	}
	textbuttons(list, dialog, noclick) {
		for (var item of list) {
			var str, link;
			if (Array.isArray(item)) {
				str = item[1];
				link = item[0];
			} else {
				str = item;
				link = item;
			}
			if (!str.startsWith("<div")) {
				str = '<div class="popup text textbutton">' + str + "</div>";
			}
			var next = dialog.add(str);
			if (!noclick) {
				next.firstChild.addEventListener(lib.config.touchscreen ? "touchend" : "click", ui.click.button);
			}
			next.firstChild.link = link;
			Object.setPrototypeOf(next, lib.element.Button.prototype);
			dialog.buttons.add(next.firstChild);
		}
	}
	player(position, noclick) {
		return new lib.element.Player(position).build(noclick);
	}
	connectPlayers(ip) {
		ui.updateConnectPlayerPositions();
		game.connectPlayers = [];
		const configOL = lib.configOL;
		const numberOfPlayers = parseInt(configOL.player_number) || configOL.number;
		for (let position = 0; position < numberOfPlayers; position++) {
			const player = ui.create.player(ui.window);
			player.dataset.position = position;
			player.classList.add("connect");
			game.connectPlayers.push(player);
		}

		var bar = ui.create.div(ui.window);
		bar.style.height = "20px";
		bar.style.width = "80%";
		bar.style.left = "10%";
		bar.style.top = "calc(200% / 7 - 120px + 5px)";
		bar.style.textAlign = "center";
		var ipbar = ui.create.div(".shadowed", ip, bar);
		ipbar.style.padding = "4px";
		ipbar.style.borderRadius = "2px";
		ipbar.style.position = "relative";

		var button = ui.create.div(".menubutton.large.highlight.connectbutton.connectbutton1.pointerdiv", game.online ? "退出联机" : "开始游戏", ui.window, function () {
			if (button.clicked) {
				return;
			}
			if (game.online) {
				if (game.onlinezhu) {
					game.send("startGame");
				} else {
					game.saveConfig("tmp_owner_roomId");
					game.saveConfig("tmp_user_roomId");
					game.saveConfig("reconnect_info");
					game.reload();
				}
			} else {
				var num = 0;
				for (var i of game.connectPlayers) {
					if (!i.nickname && !i.classList.contains("unselectable2")) {
						num++;
					}
				}
				if (num >= lib.configOL.number - 1) {
					alert("至少要有两名玩家才能开始游戏！");
					return;
				}
				game.resume();
			}
			button.delete();
			bar.delete();
			shareButton.delete();
			delete ui.connectStartButton;
			delete ui.connectStartBar;
			delete ui.connectShareButton;
			button.clicked = true;
		});

		var shareButton = ui.create.div(".menubutton.large.highlight.connectbutton.connectbutton2.pointerdiv", "分享房间", ui.window, function () {
			var text = `无名杀-联机-${lib.translate[get.mode()]}-${game.connectPlayers.filter(p => p.avatar).length}/${game.connectPlayers.filter(p => !p.classList.contains("unselectable2")).length}\n${get.connectNickname()}邀请你加入${game.roomId}房间\n联机地址:${game.ip}\n请先通过游戏内菜单-开始-联机中启用“读取邀请链接”选项`;
			window.focus();
			const fallbackCopyTextToClipboard = function (text) {
				const textArea = document.createElement("textarea");
				textArea.value = text;
				textArea.style.position = "fixed";
				textArea.style.top = "0";
				textArea.style.left = "0";
				textArea.style.width = "1px";
				textArea.style.height = "1px";
				textArea.style.padding = "0";
				textArea.style.border = "none";
				textArea.style.outline = "none";
				textArea.style.boxShadow = "none";
				textArea.style.background = "transparent";
				document.body.appendChild(textArea);
				textArea.focus();
				textArea.select();
				try {
					const successful = document.execCommand("copy");
					if (!successful) {
						console.error("Unable to copy using execCommand");
						game.promises.prompt(`###分享内容复制失败，请自行复制以下内容###${text}`, true);
					} else {
						game.alert("分享内容复制成功");
					}
				} catch (err) {
					console.error("Unable to copy using execCommand:", err);
				}
				document.body.removeChild(textArea);
			};
			if ("clipboard" in navigator) {
				navigator.clipboard
					.writeText(text)
					.then(() => {
						game.alert("分享内容复制成功");
					})
					.catch(() => {
						fallbackCopyTextToClipboard(text);
					});
			} else {
				fallbackCopyTextToClipboard(text);
			}
		});

		ui.connectStartButton = button;
		ui.connectStartBar = bar;
		ui.connectShareButton = shareButton;
	}
	players(numberOfPlayers) {
		if (numberOfPlayers === 0) {
			return;
		}
		if (numberOfPlayers == undefined) {
			numberOfPlayers = lib.configOL.number;
		}
		if (numberOfPlayers == undefined) {
			numberOfPlayers = get.playerNumber();
		}
		if (typeof numberOfPlayers == "string") {
			numberOfPlayers = parseInt(numberOfPlayers);
		}
		if (!numberOfPlayers) {
			numberOfPlayers = 5;
		}
		for (let ordinal = 0; ordinal < numberOfPlayers; ordinal++) {
			const player = ui.create.player().addTempClass("start");
			game.players.push(player);
			player.dataset.position = ordinal;
		}
		const players = game.players;
		for (let ordinal = 0; ordinal < players.length; ordinal++) {
			if (ordinal > 0) {
				players[ordinal].previous = players[ordinal - 1];
				players[ordinal].previousSeat = players[ordinal - 1];
			}
			if (ordinal < players.length - 1) {
				players[ordinal].next = players[ordinal + 1];
				players[ordinal].nextSeat = players[ordinal + 1];
			}
		}
		players[0].previous = players[players.length - 1];
		players[0].previousSeat = players[players.length - 1];
		players[players.length - 1].next = players[0];
		players[players.length - 1].nextSeat = players[0];
		ui.arena.setNumber(numberOfPlayers);
		players.forEach(player => ui.arena.appendChild(player));
		return players;
	}
	me(hasme) {
		ui.mebg = ui.create.div("#mebg", ui.arena);
		ui.me = ui.create.div("#me", ui.arena).addTempClass("start");
		ui.handcards1Container = ui.create.div("#handcards1", ui.me);
		ui.handcards2Container = ui.create.div("#handcards2", ui.me);
		ui.arena.classList.remove("nome");
		if (lib.config.mousewheel && !lib.config.touchscreen) {
			ui.handcards1Container.onmousewheel = ui.click.mousewheel;
			ui.handcards2Container.onmousewheel = ui.click.mousewheel;
		}
		ui.handcards1Container.ontouchstart = ui.click.touchStart;
		ui.handcards2Container.ontouchstart = ui.click.touchStart;
		ui.handcards1Container.ontouchmove = ui.click.touchScroll;
		ui.handcards2Container.ontouchmove = ui.click.touchScroll;
		ui.handcards1Container.style.webkitOverflowScrolling = "touch";
		ui.handcards2Container.style.webkitOverflowScrolling = "touch";

		if (hasme && game.me) {
			ui.handcards1 = game.me.node.handcards1;
			ui.handcards2 = game.me.node.handcards2;
			ui.handcards1Container.appendChild(ui.handcards1);
			ui.handcards2Container.appendChild(ui.handcards2);
			// ui.updatehl();
		} else if (game.players.length) {
			game.me = game.players[0];
			ui.handcards1 = game.me.node.handcards1;
			ui.handcards2 = game.me.node.handcards2;
			ui.handcards1Container.appendChild(ui.handcards1);
			ui.handcards2Container.appendChild(ui.handcards2);
			// ui.updatehl();
		}
	}
	card(position, info, noclick) {
		return new lib.element.Card(position).build(info, noclick);
	}
	cardsAsync() {
		if (lib.onfree) {
			_status.waitingForCards = Array.from(arguments);
			lib.onfree.push(function () {
				if (_status.waitingForCards) {
					ui.create.cards.apply(ui.create, _status.waitingForCards);
					delete _status.waitingForCards;
				}
			});
		} else {
			ui.create.cards.apply(ui.create, arguments);
		}
	}
	cards(ordered) {
		if (_status.brawl) {
			if (_status.brawl.cardPile) {
				lib.card.list = _status.brawl.cardPile(lib.card.list);
			}
			if (_status.brawl.orderedPile) {
				ordered = true;
			}
		}
		if (!ordered) {
			lib.card.list.randomSort();
		}
		for (var i = 0; i < lib.card.list.length; i++) {
			if (lib.card[lib.card.list[i][2]]) {
				if (!lib.card.list[i]._replaced) {
					if (!_status.connectMode) {
						if (lib.config.bannedcards.includes(lib.card.list[i][2])) {
							continue;
						}
					} else {
						if (lib.configOL.bannedcards.includes(lib.card.list[i][2])) {
							continue;
						}
					}
					if (game.bannedcards && game.bannedcards.includes(lib.card.list[i][2])) {
						continue;
					}
				}
				lib.inpile.add(lib.card.list[i][2]);
				if (lib.card.list[i][2] == "sha" && lib.card.list[i][3]) {
					lib.inpile_nature.add(lib.card.list[i][3]);
				}
				ui.create.card(ui.cardPile).init(lib.card.list[i]);
			}
		}
		lib.inpile.sort(lib.sort.card);
		const natures = Array.from(lib.nature.keys());
		lib.inpile_nature.sort(function (a, b) {
			return natures.indexOf(a) - natures.indexOf(b);
		});
		for (var i in _status.cardtag) {
			if (!_status.cardtag[i].length) {
				delete _status.cardtag[i];
			}
		}
		game.broadcastAll(
			function (num, pile, top, cardtag, inpile2) {
				if (ui.cardPileNumber) {
					ui.cardPileNumber.innerHTML = "0轮 剩余牌: " + num;
				}
				lib.inpile = pile;
				_status.pileTop = top;
				_status.cardtag = cardtag;
				lib.inpile_nature = inpile2;
			},
			ui.cardPile.childNodes.length,
			lib.inpile,
			ui.cardPile.firstChild,
			_status.cardtag,
			lib.inpile_nature
		);
	}
	/**
	 * 创建分页类
	 * @param {Partial<PaginationState>} options
	 */
	pagination(options) {
		return new Pagination(options);
	}
}
