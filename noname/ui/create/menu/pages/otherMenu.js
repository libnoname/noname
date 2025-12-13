import { menuContainer, menuxpages, menuUpdates, openMenu, clickToggle, clickSwitcher, clickContainer, clickMenuItem, createMenu, createConfig } from "../index.js";
import { ui, game, get, ai, lib, _status } from "noname";
import { parseSize, checkVersion, getRepoTagDescription, request, createProgress, getLatestVersionFromGitHub, getTreesFromGithub } from "@/library/update.js";
import { createApp } from "vue";
import security from "@/util/security.js"
import dedent from "dedent";

export const otherMenu = function (/** @type { boolean | undefined } */ connectMenu) {
	if (connectMenu) {
		return;
	}
	/**
	 * 由于联机模式会创建第二个菜单，所以需要缓存一下可变的变量
	 */
	const cacheMenuContainer = menuContainer;
	// const cachePopupContainer = popupContainer;
	// const cacheMenux = menux;
	const cacheMenuxpages = menuxpages;
	/** @type { HTMLDivElement } */
	// @ts-expect-error ignore
	var start = cacheMenuxpages.shift();
	var rightPane = start.lastChild;
	var cheatButton = ui.create.div(".menubutton.round.highlight", "作", start);
	cheatButton.style.display = "none";
	var runButton = ui.create.div(".menubutton.round.highlight", "执", start);
	runButton.style.display = "none";
	var clearButton = ui.create.div(".menubutton.round.highlight", "清", start);
	clearButton.style.display = "none";
	clearButton.style.left = "275px";
	var playButton = ui.create.div(".menubutton.round.highlight.hidden", "播", start);
	playButton.style.display = "none";
	playButton.style.left = "215px";
	playButton.style.transition = "opacity 0.3s";
	var deleteButton = ui.create.div(".menubutton.round.highlight.hidden", "删", start);
	deleteButton.style.display = "none";
	deleteButton.style.left = "275px";
	deleteButton.style.transition = "opacity 0.3s";
	var saveButton = ui.create.div(".menubutton.round.highlight.hidden", "存", start);
	saveButton.style.display = "none";
	saveButton.style.transition = "opacity 0.3s";

	/**
	 * @this { HTMLDivElement }
	 */
	var clickMode = function () {
		if (this.classList.contains("off")) {
			return;
		}
		var active = this.parentNode.querySelector(".active");
		if (active === this) {
			return;
		}
		if (active) {
			active.classList.remove("active");
			active.link.remove();
		}
		active = this;
		this.classList.add("active");
		if (this.link) {
			rightPane.appendChild(this.link);
		} else {
			this._initLink();
			rightPane.appendChild(this.link);
		}
		if (this.type == "cheat") {
			cheatButton.style.display = "";
		} else {
			cheatButton.style.display = "none";
		}
		if (this.type == "cmd") {
			runButton.style.display = "";
			clearButton.style.display = "";
		} else {
			runButton.style.display = "none";
			clearButton.style.display = "none";
		}
		if (this.type == "video") {
			playButton.style.display = "";
			saveButton.style.display = "";
			deleteButton.style.display = "";
		} else {
			playButton.style.display = "none";
			saveButton.style.display = "none";
			deleteButton.style.display = "none";
		}
	};

	ui.click.consoleMenu = function () {
		ui.click.menuTab("其它");
		clickMode.call(ui.commandnode);
	};
	//更新菜单有本体函数赋值，就不要懒加载了
	(function () {
		var page = ui.create.div("");
		var node = ui.create.div(".menubutton.large", "更新", start.firstChild, clickMode);
		node.link = page;
		page.classList.add("menu-help");
		var ul = document.createElement("ul");
		var li1 = document.createElement("li");
		var li2 = document.createElement("li");
		var li3 = document.createElement("li");
		// const trimURL = url => {
		// 	const updateURLS = lib.updateURLS;
		// 	for (const key in updateURLS) {
		// 		const updateURL = updateURLS[key];
		// 		if (url == updateURL) return lib.configMenu.general.config.update_link.item[key];
		// 	}
		// 	let index = url.indexOf('://');
		// 	if (index != -1) url = url.slice(index + 3);
		// 	index = url.indexOf('/');
		// 	if (index != -1) url = url.slice(0, index);
		// 	if (url.length > 15) {
		// 		const list = url.split('.');
		// 		if (list.length > 1) list.shift();
		// 		url = list.join('.');
		// 	}
		// 	if (url.length > 15) {
		// 		const list = url.split('.');
		// 		if (list.length > 1) list.pop();
		// 		url = list.join('.');
		// 	}
		// 	return url;
		// };
		li1.innerHTML = "游戏版本：" + lib.version + '<p style="margin-top:8px;white-space:nowrap"></p>';
		li2.innerHTML = "素材版本：" + (lib.config.asset_version || "无") + '<p style="margin-top:8px"></p>';
		// li3.innerHTML = '更新地址：<span>' + trimURL(lib.config.updateURL || lib.updateURL) + '</span><p style="margin-top:8px"></p>';
		li3.style.whiteSpace = "nowrap";
		li3.style.display = "none"; // coding

		/**
		 * @type {HTMLButtonElement}
		 */
		var checkVersionButton;
		/**
		 * @type {HTMLButtonElement}
		 */
		var checkAssetButton;
		/**
		 * @type {HTMLButtonElement}
		 */
		var checkDevVersionButton;

		game.checkForUpdate = async function (forcecheck, dev) {
			if (!dev && checkVersionButton.disabled) {
				return;
			} else if (dev && checkDevVersionButton.disabled) {
				return;
			} else {
				if (dev) {
					checkDevVersionButton.innerHTML = "正在检查更新";
				} else {
					checkVersionButton.innerHTML = "正在检查更新";
				}

				checkDevVersionButton.disabled = true;
				checkVersionButton.disabled = true;

				const refresh = () => {
					checkVersionButton.disabled = false;
					checkVersionButton.innerHTML = "检查游戏更新";
					checkDevVersionButton.disabled = false;
					checkDevVersionButton.innerHTML = "更新到开发版";
				};

				/**
				 * @param {{ assets: any; author?: { login: string; avatar_url: string; html_url: string; }; body?: string; html_url?: string; name: any; published_at?: string; zipball_url: any; }} description
				 */
				const download = description => {
					const progress = createProgress("正在更新" + description.name, 1, description.name + ".zip");
					/**
					 * @type {progress}
					 */
					let unZipProgress;
					let url = description.zipball_url;
					if (Array.isArray(description.assets) && description.assets.length > 0) {
						const coreZipData = description.assets.find(v => v.name == "noname.core.zip");
						if (coreZipData && confirm(`检测到该版本(${description.name})有离线包资源，是否改为下载离线包资源？否则将下载完整包资源`)) {
							url = "https://ghproxy.cc/" + coreZipData.browser_download_url;
						}
					}
					request(url, (receivedBytes, total, filename) => {
						if (typeof filename == "string") {
							progress.setFileName(filename);
						}
						let received = 0,
							max = 0;
						if (total) {
							max = +(total / (1024 * 1024)).toFixed(1);
						} else {
							max = 1000;
						}
						received = +(receivedBytes / (1024 * 1024)).toFixed(1);
						if (received > max) {
							max = received;
						}
						progress.setProgressMax(max);
						progress.setProgressValue(received);
					})
						.then(async blob => {
							progress.remove();
							const zip = await get.promises.zip();
							zip.load(await blob.arrayBuffer());
							const entries = Object.entries(zip.files);
							let root;
							// const hiddenFileFlags = [".", "_"];
							unZipProgress = createProgress("正在解压" + progress.getFileName(), entries.length);
							let i = 0;
							for (const [key, value] of entries) {
								// 第一个是文件夹的话，就是根文件夹
								if (i == 0 && value.dir && !description.name.includes("noname.core.zip")) {
									root = key;
								}
								unZipProgress.setProgressValue(i++);
								const fileName = typeof root == "string" && key.startsWith(root) ? key.replace(root, "") : key;
								// if (hiddenFileFlags.includes(fileName[0])) {
								// 	continue;
								// }
								if (value.dir) {
									await game.promises.createDir(fileName);
									continue;
								}
								unZipProgress.setFileName(fileName);
								const [path, name] = [fileName.split("/").slice(0, -1).join("/"), fileName.split("/").slice(-1).join("/")];
								game.print(`${fileName}(${i}/${entries.length})`);
								await game.promises.writeFile(value.asArrayBuffer(), path, name).catch(async e => {
									// 特殊处理
									if (name == "noname-server.exe" && e.message.includes("resource busy or locked")) {
										if (typeof window.require == "function" && typeof window.process == "object" && typeof window.__dirname == "string") {
											return new Promise((resolve, reject) => {
												const cp = require("child_process");
												cp.exec(`taskkill /IM noname-server.exe /F`, e => {
													if (e) {
														reject(e);
													} else {
														game.promises
															.writeFile(value.asArrayBuffer(), path, name)
															.then(() => {
																cp.exec(`start /b ${__dirname}\\noname-server.exe -platform=electron`, () => {});
																function loadURL() {
																	let myAbortController = new AbortController();
																	let signal = myAbortController.signal;
																	setTimeout(() => myAbortController.abort(), 2000);
																	fetch(`http://localhost:8089/app.html`, { signal })
																		.then(({ ok }) => {
																			if (ok) {
																				resolve(null);
																			} else {
																				throw new Error("fetch加载失败");
																			}
																		})
																		.catch(() => loadURL());
																}
																loadURL();
															})
															.catch(reject);
													}
												});
											});
										}
									} else {
										throw e;
									}
								});
							}
							unZipProgress.remove();
							if (url === description.zipball_url) {
								await lib.init.promises.js("game", "update.js");
								if (Array.isArray(window.noname_asset_list)) {
									game.saveConfig("asset_version", window.noname_asset_list[0]);
									delete window.noname_asset_list;
								}
							}
							if (confirm("更新完成，是否重启？")) {
								game.reload();
							}
							refresh();
						})
						.catch(e => {
							if (progress.parentNode) {
								progress.remove();
							}
							if (unZipProgress && unZipProgress.parentNode) {
								unZipProgress.remove();
							}
							refresh();
							throw e;
						});
				};

				if (!dev) {
					getLatestVersionFromGitHub()
						.then(tagName => {
							game.saveConfig("check_version", tagName.slice(1));
							if (typeof lib.config[`version_description_${tagName}`] == "object") {
								/** @type { ReturnType<import('../../../../library/update.js').getRepoTagDescription> } */
								const description = lib.config[`version_description_${tagName}`];
								return description;
							} else {
								return getRepoTagDescription(tagName);
							}
						})
						.then(description => {
							// 保存版本信息
							if (typeof lib.config["version_description_" + description.name] != "object") {
								game.saveConfig("version_description_" + description.name, description);
							}
							const versionResult = checkVersion(lib.version, description.name);
							if (versionResult === 0) {
								// forcecheck: 为false的时候是自动检测更新的调用
								if (forcecheck === false || !confirm("版本已是最新，是否强制更新？")) {
									refresh();
									return;
								}
							}
							const str = versionResult < 0 ? `有新版本${description.name}可用，是否下载？` : `本地版本${lib.version}高于或等于github版本${description.name}，是否强制下载？`;
							const str2 = description.body;
							if (navigator.notification && navigator.notification.confirm) {
								navigator.notification.confirm(
									str2,
									function (index) {
										if (index == 1) {
											download(description);
										} else {
											refresh();
										}
									},
									str,
									["确定", "取消"]
								);
							} else {
								if (confirm(str + "\n" + str2)) {
									download(description);
								} else {
									refresh();
								}
							}
						})
						.catch(e => {
							alert("获取更新失败: " + e);
							refresh();
						});
				} else {
					if (confirm("将要直接下载dev版本的完整包，是否继续?")) {
						download({
							name: "noname-PR-Branch",
							assets: [],
							zipball_url: "https://ghproxy.cc/https://github.com/libnoname/noname/archive/PR-Branch.zip",
						});
					} else {
						refresh();
					}
				}
			}
		};

		game.checkForAssetUpdate = async function () {
			if (checkAssetButton.disabled) {
				return;
			} else if (game.download) {
				// if (
				// 	!localStorage.getItem("noname_authorization") &&
				// 	!sessionStorage.getItem("noname_authorization")
				// ) {
				// 	if (
				// 		confirm(
				// 			"素材更新或许会直接超过每小时的访问限制，是否输入您github的token以解除访问每小时60次的限制？"
				// 		)
				// 	)
				// 		await gainAuthorization();
				// }
				checkAssetButton.innerHTML = "正在检查更新";
				checkAssetButton.disabled = true;

				const refresh = () => {
					checkAssetButton.innerHTML = "检查素材更新";
					checkAssetButton.disabled = false;
				};

				const assetDirectories = [];
				if (lib.config.asset_font) {
					assetDirectories.push("font");
				}
				if (lib.config.asset_audio) {
					assetDirectories.push("audio");
				}
				if (lib.config.asset_image) {
					assetDirectories.push("image");
				}
				const version = await getLatestVersionFromGitHub().catch(e => {
					refresh();
					throw e;
				});
				const files = await getTreesFromGithub(assetDirectories, version).catch(e => {
					refresh();
					throw e;
				});

				assetDirectories.forEach((assetDirectory, index) => {
					const arr = files[index];
					const size = arr.reduce((previous, current) => {
						return previous + current.size;
					}, 0);
					game.saveConfig(`asset_${assetDirectory}_size`, parseSize(size));
				});

				/**
				 * @template T
				 * @param { T[] } arr
				 * @param { (value: T) => Promise<boolean> } predicate
				 */
				const asyncFilter = async (arr, predicate) => {
					//将arr每20个分为一个数组，分别使用Promise.all
					/** @type { boolean[] } */
					const results = [];
					for (let i = 0; i < arr.length; i += 20) {
						const pushArr = arr.slice(i, i + 20);
						results.push(...(await Promise.all(pushArr.map(predicate))));
					}
					return arr.filter((_v, index) => results[index]);
				};

				const result = await asyncFilter(files.flat(), async v => {
					return game.promises
						.readFile(v.path)
						.then(data => {
							// 有设置就不进行对比直接返回false
							if (lib.config.asset_notReplaceExistingFiles) {
								return false;
							}
							return v.size != data.byteLength;
							// 报错了就是没有文件
						})
						.catch(() => true);
				}).then(arr => arr.map(v => v.path));

				console.log("需要更新的文件有:", result);
				game.print("需要更新的文件有:", result);
				const finish = async () => {
					await lib.init.promises.js("game", "asset");
					if (Array.isArray(window.noname_asset_list)) {
						game.saveConfig("asset_version", window.noname_asset_list[0]);
						try {
							// 动态更新素材版本显示
							if (
								li2 instanceof HTMLLIElement &&
								li2.childNodes[0] &&
								// nodeType = 3为text
								li2.childNodes[0].nodeType === 3 &&
								li2.childNodes[0].textContent.startsWith("素材版本")
							) {
								li2.childNodes[0].textContent = `素材版本：${window.noname_asset_list[0]}`;
							}
						} catch (error) {
							console.error("动态更新素材版本显示失败:", error);
						}
						delete window.noname_asset_list;
					}
					if (confirm("更新完成，是否重启？")) {
						game.reload();
					}
					refresh();
				};
				if (result.length > 0) {
					const progress = createProgress("正在更新素材包.zip");
					/**
					 * @type {progress}
					 */
					let unZipProgress;
					request(
						"https://api.unitedrhythmized.club/noname",
						(receivedBytes, total, filename) => {
							if (typeof filename == "string") {
								progress.setFileName(filename);
							}
							let received = 0,
								max = 0;
							if (total) {
								max = +(total / (1024 * 1024)).toFixed(1);
							} else {
								max = 1000;
							}
							received = +(receivedBytes / (1024 * 1024)).toFixed(1);
							if (received > max) {
								max = received;
							}
							progress.setProgressMax(max);
							progress.setProgressValue(received);
						},
						{
							method: "POST",
							body: JSON.stringify({
								action: "downloadAssets",
								version,
								fileList: result.concat("game/asset.js"),
							}),
						}
					)
						.then(async blob => {
							progress.remove();
							const zip = await get.promises.zip();
							zip.load(await blob.arrayBuffer());
							const entries = Object.entries(zip.files);
							let root;
							const hiddenFileFlags = [".", "_"];
							unZipProgress = createProgress("正在解压" + progress.getFileName(), entries.length);
							let i = 0;
							for (const [key, value] of entries) {
								unZipProgress.setProgressValue(i++);
								const fileName = typeof root == "string" && key.startsWith(root) ? key.replace(root, "") : key;
								if (hiddenFileFlags.includes(fileName[0])) {
									continue;
								}
								if (value.dir) {
									await game.promises.createDir(fileName);
									continue;
								}
								unZipProgress.setFileName(fileName);
								const [path, name] = [fileName.split("/").slice(0, -1).join("/"), fileName.split("/").slice(-1).join("/")];
								game.print(`${fileName}(${i}/${entries.length})`);
								await game.promises.writeFile(value.asArrayBuffer(), path, name);
							}
							unZipProgress.remove();
							await finish();
						})
						.catch(e => {
							if (progress.parentNode) {
								progress.remove();
							}
							if (unZipProgress && unZipProgress.parentNode) {
								unZipProgress.remove();
							}
							refresh();
							throw e;
						});
				} else {
					await finish();
				}
			} else {
				alert("此版本不支持游戏内更新素材，请手动更新");
			}
		};

		checkVersionButton = document.createElement("button");
		checkVersionButton.innerHTML = "检查游戏更新";
		checkVersionButton.onclick = () => game.checkForUpdate(null);
		li1.lastChild.appendChild(checkVersionButton);

		checkDevVersionButton = document.createElement("button");
		checkDevVersionButton.innerHTML = "更新到开发版";
		checkDevVersionButton.style.marginLeft = "5px";
		checkDevVersionButton.onclick = function () {
			game.checkForUpdate(null, true);
		};
		// if(lib.config.dev){
		//     li1.lastChild.appendChild(checkDevVersionButton);
		// }

		(function () {
			/** @type { HTMLParagraphElement } */
			// @ts-expect-error ignore
			var updatep1 = li1.querySelector("p");
			var updatep2 = li2;
			var updatep3 = li3;
			var updatep4 = node;
			var updatepx = ui.create.node("p");
			li1.appendChild(updatepx);
			updatepx.style.display = "none";
			updatepx.style.whiteSpace = "nowrap";
			updatepx.style.marginTop = "8px";
			var buttonx = ui.create.node("button", "访问项目主页", function () {
				window.open("https://github.com/libnoname/noname");
			});
			updatepx.appendChild(buttonx);
			ui.updateUpdate = function () {
				if (!game.download) {
					updatep1.style.display = "none";
					updatep2.style.display = "none";
					updatep3.style.display = "none";
					updatepx.style.display = "";
					updatep4.innerHTML = "关于";
				} else {
					updatep1.style.display = "";
					updatep2.style.display = "";
					updatep3.style.display = "none"; // coding
					updatepx.style.display = "none";
					updatep4.innerHTML = "更新";
				}
			};
			ui.updateUpdate();
		})();

		// button4 = document.createElement('button');
		// button4.innerHTML = '设置更新地址';
		// button4.onclick = function () {
		// 	game.prompt('设置更新地址', function (str) {
		// 		if (str) {
		// 			game.saveConfig('updateURL', str);
		// 			li3.querySelector('span').innerHTML = trimURL(str);
		// 			button5.style.display = '';
		// 			button6.style.display = 'none';
		// 		}
		// 	});
		// };
		// li3.lastChild.appendChild(button4);

		// var button6 = document.createElement('button');
		// button6.innerHTML = '设为备用镜像';
		// button6.style.display = 'none';// coding
		// button6.style.marginLeft='5px';
		// button6.onclick = function () {
		// 	game.saveConfig('updateURL', lib.mirrorURL);
		// 	// button5.style.display = '';
		// 	button6.style.display = 'none';
		// 	li3.querySelector('span').innerHTML = trimURL(lib.mirrorURL);
		// };
		// li3.lastChild.appendChild(button6);

		// button5 = document.createElement('button');
		// button5.innerHTML = '设为默认镜像';
		// button5.style.marginLeft='5px';
		// button5.onclick = function () {
		// 	game.saveConfig('updateURL');
		// 	button5.style.display = 'none';
		// 	button6.style.display = '';
		// 	li3.querySelector('span').innerHTML = trimURL(lib.updateURL);
		// };
		// li3.lastChild.appendChild(button5);
		// if (!lib.config.updateURL) {
		// 	button5.style.display = 'none';
		// }
		// else {
		// 	button6.style.display = 'none';
		// }

		checkAssetButton = document.createElement("button");
		checkAssetButton.innerHTML = "检查素材更新";
		checkAssetButton.onclick = () => game.checkForAssetUpdate();
		li2.lastChild.appendChild(checkAssetButton);

		var span1 = ui.create.div(".config.more", "选项 <div>&gt;</div>");
		span1.style.fontSize = "small";
		span1.style.display = "inline";
		span1.toggle = function () {
			if (!this.classList.toggle("on")) {
				game.saveConfig("asset_toggle_off", true);
				[
					span114514_br,
					span7,
					span7_br,
					span7_check,
					span3,
					span3_br,
					span3_check,
					span4,
					span4_br,
					span4_check,
					span5,
					span5_br,
					span5_check,
					/* span6, span6_br, span6_check,*/
				].forEach(item =>
					HTMLDivElement.prototype.css.call(item, {
						display: "none",
					})
				);
			} else {
				game.saveConfig("asset_toggle_off");
				[
					span114514_br,
					span7,
					span7_br,
					span7_check,
					span3,
					span3_br,
					span3_check,
					span4,
					span4_br,
					span4_check,
					span5,
					span5_br,
					span5_check,
					/* span6, span6_br, span6_check,*/
				].forEach(item =>
					HTMLDivElement.prototype.css.call(item, {
						display: "",
					})
				);
			}
		};
		span1.listen(span1.toggle);
		li2.lastChild.appendChild(span1);

		// var span6_br = ui.create.node('br');
		// li2.lastChild.appendChild(span6_br);
		// var span2_br = ui.create.node('br');
		var span114514_br = ui.create.node("br");
		li2.lastChild.appendChild(span114514_br);

		var span7 = ui.create.div("", `不替换已有素材`);
		span7.style.fontSize = "small";
		span7.style.lineHeight = "16px";
		li2.lastChild.appendChild(span7);
		var span7_check = document.createElement("input");
		span7_check.type = "checkbox";
		span7_check.style.marginLeft = "5px";
		if (lib.config.asset_notReplaceExistingFiles) {
			span7_check.checked = true;
		}
		span7_check.onchange = function () {
			game.saveConfig("asset_notReplaceExistingFiles", this.checked);
		};
		li2.lastChild.appendChild(span7_check);
		var span7_br = ui.create.node("br");
		li2.lastChild.appendChild(span7_br);

		var span4 = ui.create.div("", `字体素材（${lib.config.asset_font_size || "23.4MB"}）`);
		span4.style.fontSize = "small";
		span4.style.lineHeight = "16px";
		li2.lastChild.appendChild(span4);
		var span4_check = document.createElement("input");
		span4_check.type = "checkbox";
		span4_check.style.marginLeft = "5px";
		if (lib.config.asset_font) {
			span4_check.checked = true;
		}
		span4_check.onchange = function () {
			game.saveConfig("asset_font", this.checked);
		};
		li2.lastChild.appendChild(span4_check);
		var span3_br = ui.create.node("br");
		li2.lastChild.appendChild(span3_br);

		var span3 = ui.create.div("", `音效素材（${lib.config.asset_audio_size || "350MB"}）`);
		span3.style.fontSize = "small";
		span3.style.lineHeight = "16px";
		li2.lastChild.appendChild(span3);
		var span3_check = document.createElement("input");
		span3_check.type = "checkbox";
		span3_check.style.marginLeft = "5px";
		if (lib.config.asset_audio) {
			span3_check.checked = true;
		}
		span3_check.onchange = function () {
			game.saveConfig("asset_audio", this.checked);
		};
		li2.lastChild.appendChild(span3_check);
		var span4_br = ui.create.node("br");
		li2.lastChild.appendChild(span4_br);

		// var span2 = ui.create.div('', '皮肤素材（351MB）');
		// span2.style.fontSize = 'small';
		// span2.style.lineHeight = '16px';
		// li2.lastChild.appendChild(span2);
		// var span2_check = document.createElement('input');
		// span2_check.type = 'checkbox';
		// span2_check.style.marginLeft = '5px';
		// if (lib.config.asset_skin) {
		// 	span2_check.checked = true;
		// }
		// span2_check.onchange = function () {
		// 	game.saveConfig('asset_skin', this.checked);
		// };
		// li2.lastChild.appendChild(span2_check);
		var span5 = ui.create.div("", `图片素材（${lib.config.asset_image_size || "363MB"}）`);
		span5.style.fontSize = "small";
		span5.style.lineHeight = "16px";
		li2.lastChild.appendChild(span5);
		var span5_check = document.createElement("input");
		span5_check.type = "checkbox";
		span5_check.style.marginLeft = "5px";
		if (lib.config.asset_image) {
			span5_check.checked = true;
		}
		span5_check.onchange = function () {
			// @ts-expect-error ignore
			game.saveConfig("asset_image", this.checked);
		};
		li2.lastChild.appendChild(span5_check);
		var span5_br = ui.create.node("br");
		li2.lastChild.appendChild(span5_br);
		// li2.lastChild.appendChild(span2_br);

		// var span6 = ui.create.div('', '图片素材（完整，203MB）');
		// span6.style.fontSize = 'small';
		// span6.style.lineHeight = '16px';
		// li2.lastChild.appendChild(span6);
		// var span6_check = document.createElement('input');
		// span6_check.type = 'checkbox';
		// span6_check.style.marginLeft = '5px';
		// if (lib.config.asset_full) {
		// 	span6_check.checked = true;
		// }
		// span6_check.onchange = function () {
		// 	game.saveConfig('asset_full', this.checked);
		// };
		// li2.lastChild.appendChild(span6_check);

		[
			/* span2, span2_br, span2_check,*/
			span3,
			span3_br,
			span3_check,
			span4,
			span4_br,
			span4_check,
			span5,
			span5_br,
			span5_check,
			/* span6, span6_br, span6_check,*/
		].forEach(item =>
			HTMLDivElement.prototype.css.call(item, {
				display: "none",
			})
		);

		ul.appendChild(li1);
		ul.appendChild(li2);
		ul.appendChild(li3);
		page.appendChild(ul);

		if (!lib.config.asset_toggle_off) {
			span1.toggle();
		}
	})();
	(function () {
		var norow2 = function () {
			var node = currentrow1;
			if (!node) {
				return false;
			}
			return node.innerHTML == "横置" || node.innerHTML == "翻面" || node.innerHTML == "换人" || node.innerHTML == "复活";
		};
		var checkCheat = function () {
			if (norow2()) {
				for (var i = 0; i < row2.childElementCount; i++) {
					row2.childNodes[i].classList.remove("selectedx");
					row2.childNodes[i].classList.add("unselectable");
				}
			} else {
				for (var i = 0; i < row2.childElementCount; i++) {
					row2.childNodes[i].classList.remove("unselectable");
				}
			}
			if (currentrow1 && currentrow1.innerHTML == "复活") {
				for (var i = 0; i < row3.childNodes.length; i++) {
					if (row3.childNodes[i].dead) {
						row3.childNodes[i].style.display = "";
					} else {
						row3.childNodes[i].style.display = "none";
						row3.childNodes[i].classList.remove("glow");
					}
					row3.childNodes[i].classList.remove("unselectable");
				}
			} else {
				for (var i = 0; i < row3.childElementCount; i++) {
					if (currentrow1 && currentrow1.innerHTML == "换人" && row3.childNodes[i].link == game.me) {
						row3.childNodes[i].classList.add("unselectable");
					} else {
						row3.childNodes[i].classList.remove("unselectable");
					}
					if (!row3.childNodes[i].dead) {
						row3.childNodes[i].style.display = "";
					} else {
						row3.childNodes[i].style.display = "none";
						row3.childNodes[i].classList.remove("glow");
					}
				}
			}
			if (currentrow1 && (currentrow2 || norow2()) && row3.querySelector(".glow")) {
				cheatButton.classList.add("glowing");
				return true;
			} else {
				cheatButton.classList.remove("glowing");
				return false;
			}
		};
		cheatButton.listen(function () {
			if (checkCheat()) {
				var num;
				if (currentrow2) {
					switch (currentrow2.innerHTML) {
						case "一":
							num = 1;
							break;
						case "二":
							num = 2;
							break;
						case "三":
							num = 3;
							break;
						case "四":
							num = 4;
							break;
						case "五":
							num = 5;
							break;
					}
				}
				var targets = [];
				var buttons = row3.querySelectorAll(".glow");
				for (var i = 0; i < buttons.length; i++) {
					targets.push(buttons[i].link);
				}
				while (targets.length) {
					var target = targets.shift();
					switch (currentrow1.innerHTML) {
						case "伤害":
							target.damage(num, "nosource");
							break;
						case "回复":
							target.recover(num, "nosource");
							break;
						case "摸牌":
							target.draw(num);
							break;
						case "弃牌":
							target.discard(target.getCards("he").randomGets(num));
							break;
						case "横置":
							target.link();
							break;
						case "翻面":
							target.turnOver();
							break;
						case "复活":
							target.revive(target.maxHp);
							break;
						case "换人": {
							if (_status.event.isMine()) {
								if (!ui.auto.classList.contains("hidden")) {
									setTimeout(function () {
										ui.click.auto();
										setTimeout(function () {
											ui.click.auto();
											game.swapPlayer(target);
										}, 500);
									});
								}
							} else {
								game.swapPlayer(target);
							}
							break;
						}
					}
				}
				if (ui.coin) {
					game.changeCoin(-20);
				}
				clickContainer.call(cacheMenuContainer, connectMenu);
			}
		});

		var page = ui.create.div("");
		var node = ui.create.div(".menubutton.large", "控制", start.firstChild, clickMode);
		node.link = page;
		node.type = "cheat";
		page.classList.add("menu-sym");

		var currentrow1 = null;
		var row1 = ui.create.div(".menu-cheat", page);
		var clickrow1 = function () {
			if (this.classList.contains("unselectable")) {
				return;
			}
			if (currentrow1 == this) {
				this.classList.remove("selectedx");
				currentrow1 = null;
			} else {
				this.classList.add("selectedx");
				if (currentrow1) {
					currentrow1.classList.remove("selectedx");
				}
				currentrow1 = this;
				if (this.innerHTML == "换人") {
					for (var i = 0; i < row3.childNodes.length; i++) {
						row3.childNodes[i].classList.remove("glow");
					}
				}
			}
			checkCheat();
		};
		var nodedamage = ui.create.div(".menubutton", "伤害", row1, clickrow1);
		var noderecover = ui.create.div(".menubutton", "回复", row1, clickrow1);
		var nodedraw = ui.create.div(".menubutton", "摸牌", row1, clickrow1);
		var nodediscard = ui.create.div(".menubutton", "弃牌", row1, clickrow1);
		var nodelink = ui.create.div(".menubutton", "横置", row1, clickrow1);
		var nodeturnover = ui.create.div(".menubutton", "翻面", row1, clickrow1);
		var noderevive = ui.create.div(".menubutton", "复活", row1, clickrow1);
		var nodereplace = ui.create.div(".menubutton", "换人", row1, clickrow1);
		if (!game.canReplaceViewpoint || !game.canReplaceViewpoint()) {
			nodereplace.classList.add("unselectable");
		}

		var currentrow2 = null;
		var row2 = ui.create.div(".menu-cheat", page);
		var clickrow2 = function () {
			if (this.classList.contains("unselectable")) {
				return;
			}
			if (currentrow2 == this) {
				this.classList.remove("selectedx");
				currentrow2 = null;
			} else {
				this.classList.add("selectedx");
				if (currentrow2) {
					currentrow2.classList.remove("selectedx");
				}
				currentrow2 = this;
			}
			checkCheat();
		};
		var nodex1 = ui.create.div(".menubutton", "一", row2, clickrow2);
		var nodex2 = ui.create.div(".menubutton", "二", row2, clickrow2);
		var nodex3 = ui.create.div(".menubutton", "三", row2, clickrow2);
		var nodex4 = ui.create.div(".menubutton", "四", row2, clickrow2);
		var nodex5 = ui.create.div(".menubutton", "五", row2, clickrow2);

		var row3 = ui.create.div(".menu-buttons.leftbutton.commandbutton", page);
		row3.style.marginTop = "3px";
		var clickrow3 = function () {
			if (this.classList.contains("unselectable")) {
				return;
			}
			this.classList.toggle("glow");
			if (currentrow1 && currentrow1.innerHTML == "换人" && this.classList.contains("glow")) {
				if (this.link == game.me) {
					this.classList.remove("glow");
				}
				for (var i = 0; i < row3.childElementCount; i++) {
					if (row3.childNodes[i] != this) {
						row3.childNodes[i].classList.remove("glow");
					}
				}
			}
			checkCheat();
		};
		menuUpdates.push(function () {
			if (_status.video || _status.connectMode) {
				node.classList.add("off");
				if (node.classList.contains("active")) {
					node.classList.remove("active");
					node.link.remove();
					active = start.firstChild.firstChild;
					active.classList.add("active");
					rightPane.appendChild(active.link);
				}

				page.remove();
				cheatButton.remove();
				if (_status.video) {
					node.remove();
				}
				return;
			}
			var list = [];
			for (var i = 0; i < game.players.length; i++) {
				if (lib.character[game.players[i].name] || game.players[i].name1) {
					list.push(game.players[i]);
				}
			}
			for (var i = 0; i < game.dead.length; i++) {
				if (lib.character[game.dead[i].name] || game.dead[i].name1) {
					list.push(game.dead[i]);
				}
			}
			if (list.length) {
				row1.show();
				row2.show();
				row3.innerHTML = "";
				var buttons = ui.create.buttons(list, "player", row3, true);
				for (var i = 0; i < buttons.length; i++) {
					buttons[i].listen(clickrow3);
					if (game.dead.includes(buttons[i].link)) {
						buttons[i].dead = true;
					}
				}
				checkCheat();
			} else {
				row1.hide();
				row2.hide();
			}
			if (lib.config.mode == "identity" || lib.config.mode == "guozhan" || lib.config.mode == "doudizhu") {
				if (
					game.notMe ||
					(game.me &&
						(game.me._trueMe ||
							game.hasPlayer(function (current) {
								return current._trueMe == game.me;
							}))) ||
					!game.phaseNumber ||
					_status.qianlidanji
				) {
					nodereplace.classList.add("unselectable");
				} else if (_status.event.isMine() && ui.auto.classList.contains("hidden")) {
					nodereplace.classList.add("unselectable");
				} else {
					nodereplace.classList.remove("unselectable");
				}
			}
			if (game.dead.length == 0) {
				noderevive.classList.add("unselectable");
			} else {
				noderevive.classList.remove("unselectable");
			}
			checkCheat();
		});
	})();
	(function () {
		var page = ui.create.div("");
		var node = ui.create.div(".menubutton.large", "命令", start.firstChild, clickMode);
		ui.commandnode = node;
		node.type = "cmd";
		menuUpdates.push(function () {
			if (_status.connectMode) {
				node.classList.add("off");
				if (node.classList.contains("active")) {
					node.classList.remove("active");
					if (node.link) {
						node.link.remove();
					}
					active = start.firstChild.firstChild;
					active.classList.add("active");
					rightPane.appendChild(active.link);
				}
			}
		});
		node._initLink = function () {
			node.link = page;
			page.classList.add("menu-sym");

			const text = document.createElement("div");
			text.css({
				width: "194px",
				height: "124px",
				padding: "3px",
				borderRadius: "2px",
				boxShadow: "rgba(0, 0, 0, 0.2) 0 0 0 1px",
				textAlign: "left",
				webkitUserSelect: "initial",
				overflow: "scroll",
				position: "absolute",
				left: "30px",
				top: "50px",
				wordBreak: "break-all",
			});

			const pre = ui.create.node("pre.fullsize", text);
			text.css.call(pre, {
				margin: "0",
				padding: "0",
				position: "relative",
				webkitUserSelect: "text",
				userSelect: "text",
			});
			lib.setScroll(pre);
			page.appendChild(text);

			const text2 = document.createElement("input");
			text.css.call(text2, {
				width: "200px",
				height: "20px",
				padding: "0",
				position: "absolute",
				top: "15px",
				left: "30px",
				resize: "none",
				border: "none",
				borderRadius: "2px",
				boxShadow: "rgba(0, 0, 0, 0.2) 0 0 0 1px",
			});

			const g = {};
			const logs = [];
			let logindex = -1;
			let proxyWindow = Object.assign({}, window, {
				_status: _status,
				lib: lib,
				game: game,
				ui: ui,
				get: get,
				ai: ai,
				cheat: lib.cheat,
			});
			if (security.isSandboxRequired()) {
				const { Monitor, AccessAction } = security.importSandbox();
				new Monitor()
					.action(AccessAction.DEFINE)
					.action(AccessAction.WRITE)
					.action(AccessAction.DELETE)
					.require("target", proxyWindow)
					.require("property", "_status", "lib", "game", "ui", "get", "ai", "cheat")
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
				const keys = ["_status", "lib", "game", "ui", "get", "ai", "cheat"];

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
			//使用new Function隔绝作用域，避免在控制台可以直接访问到runCommand等变量
			/**
			 * @type { (value:string)=>any }
			 */
			let fun;
			if (security.isSandboxRequired()) {
				const reg = /^\{([^{}]+:\s*([^\s,]*|'[^']*'|"[^"]*"|\{[^}]*\}|\[[^\]]*\]|null|undefined|([a-zA-Z$_][a-zA-Z0-9$_]*\s*:\s*)?[a-zA-Z$_][a-zA-Z0-9$_]*\(\)))(?:,\s*([^{}]+:\s*(?:[^\s,]*|'[^']*'|"[^"]*"|\{[^}]*\}|\[[^\]]*\]|null|undefined|([a-zA-Z$_][a-zA-Z0-9$_]*\s*:\s*)?[a-zA-Z$_][a-zA-Z0-9$_]*\(\))))*\}$/;
				fun = function (value) {
					const exp = reg.test(value) ? `(${value})` : value;
					const expName = "_" + Math.random().toString().slice(2);
					return security.exec(`return eval(${expName})`, { window: proxyWindow, [expName]: exp });
				};
				// security.exec(`
				// 	const _status=window._status;
				// 	const lib=window.lib;
				// 	const game=window.game;
				// 	const ui=window.ui;
				// 	const get=window.get;
				// 	const ai=window.nonameAI;
				// 	// const cheat=window.lib.cheat; // 不再允许使用 cheat，因为它是不允许访问的变量
				// 	//使用正则匹配绝大多数的普通obj对象，避免解析成代码块。
				// 	const reg=${/^\{([^{}]+:\s*([^\s,]*|'[^']*'|"[^"]*"|\{[^}]*\}|\[[^\]]*\]|null|undefined|([a-zA-Z$_][a-zA-Z0-9$_]*\s*:\s*)?[a-zA-Z$_][a-zA-Z0-9$_]*\(\)))(?:,\s*([^{}]+:\s*(?:[^\s,]*|'[^']*'|"[^"]*"|\{[^}]*\}|\[[^\]]*\]|null|undefined|([a-zA-Z$_][a-zA-Z0-9$_]*\s*:\s*)?[a-zA-Z$_][a-zA-Z0-9$_]*\(\))))*\}$/};
				// 	return function(value){
				// 		"use strict";
				// 		return eval(reg.test(value)?('('+value+')'):value);
				// 	};
				// `, { window: proxyWindow });
			} else {
				fun = new Function(
					"window",
					dedent`
					const _status=window._status;
					const lib=window.lib;
					const game=window.game;
					const ui=window.ui;
					const get=window.get;
					const ai=window.nonameAI;
					const cheat=window.lib.cheat;
					//使用正则匹配绝大多数的普通obj对象，避免解析成代码块。
					const reg=${/^\{([^{}]+:\s*([^\s,]*|'[^']*'|"[^"]*"|\{[^}]*\}|\[[^\]]*\]|null|undefined|([a-zA-Z$_][a-zA-Z0-9$_]*\s*:\s*)?[a-zA-Z$_][a-zA-Z0-9$_]*\(\)))(?:,\s*([^{}]+:\s*(?:[^\s,]*|'[^']*'|"[^"]*"|\{[^}]*\}|\[[^\]]*\]|null|undefined|([a-zA-Z$_][a-zA-Z0-9$_]*\s*:\s*)?[a-zA-Z$_][a-zA-Z0-9$_]*\(\))))*\}$/};
					return function(value){ 
						"use strict";
						return eval(reg.test(value)?('('+value+')'):value);
					}
				`
				)(proxyWindow);
			}
			const runCommand = () => {
				if (text2.value && !["up", "down"].includes(text2.value)) {
					logindex = -1;
					logs.unshift(text2.value);
				}
				if (text2.value == "cls") {
					pre.innerHTML = "";
					text2.value = "";
				} else if (text2.value == "up") {
					if (logindex + 1 < logs.length) {
						text2.value = logs[++logindex];
					} else {
						text2.value = "";
					}
				} else if (text2.value == "down") {
					if (logindex >= 0) {
						logindex--;
						if (logindex < 0) {
							text2.value = "";
						} else {
							text2.value = logs[logindex];
						}
					} else {
						text2.value = "";
					}
				} else if (text2.value.includes("无天使") && (text2.value.includes("无神佛") || (text2.value.includes("无神") && text2.value.includes("无佛")))) {
					game.print("密码正确！欢迎来到死后世界战线！");
					_status.keyVerified = true;
					text2.value = "";
				} else {
					if (!game.observe && !game.online) {
						try {
							let value = text2.value.trim();
							if (value.endsWith(";")) {
								value = value.slice(0, -1).trim();
							}
							game.print(fun(value));
						} catch (e) {
							game.print(e);
						}
					}
					text2.value = "";
				}
			};
			text2.addEventListener("keydown", e => {
				if (e.code == "Enter") {
					runCommand();
				} else if (e.code == "ArrowUp") {
					if (logindex + 1 < logs.length) {
						text2.value = logs[++logindex];
					}
				} else if (e.code == "ArrowDown") {
					if (logindex >= 0) {
						logindex--;
						if (logindex < 0) {
							text2.value = "";
						} else {
							text2.value = logs[logindex];
						}
					}
				}
			});
			page.appendChild(text2);
			game.print = function () {
				const args = [...arguments];
				const printResult = args
					.map(arg => {
						if (typeof arg != "string") {
							const parse = obj => {
								if (Array.isArray(obj)) {
									return `[${obj.map(v => parse(v))}]`;
								} else if (typeof obj == "function") {
									if (typeof obj.name == "string") {
										return `[Function ${obj.name}]`;
									} else {
										return `[Function]`;
									}
								} else if (typeof obj != "string") {
									if (obj instanceof Error) {
										return `<span style="color:red;">${String(obj)}</span>`;
									}
									return String(obj);
								} else {
									return `'${String(obj)}'`;
								}
							};
							if (typeof arg == "function") {
								let argi;
								try {
									argi = get.stringify(arg);
									if (argi === "") {
										argi = arg.toString();
									}
								} catch (_) {
									argi = arg.toString();
								}
								return argi.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
							} else if (typeof arg == "object") {
								let msg = "";
								for (const name of Object.getOwnPropertyNames(arg)) {
									msg += `${name}: ${parse(arg[name])}<br>`;
								}
								return `<details><summary>${parse(arg)}</summary>${msg}</details>`;
							} else {
								return parse(arg);
							}
						} else {
							const str = String(arg);
							if (!/<[a-zA-Z]+[^>]*?\/?>.*?(?=<\/[a-zA-Z]+[^>]*?>|$)/.exec(str)) {
								return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
							} else {
								return str;
							}
						}
					})
					.join(" ");
				pre.innerHTML += printResult + "<br>";
				text.scrollTop = text.scrollHeight;
			};
			if (_status.toprint) {
				game.print(..._status.toprint);
				delete _status.toprint;
			}
			runButton.listen(runCommand);
			clearButton.listen(() => {
				pre.innerHTML = "";
			});
			if (typeof window.noname_shijianInterfaces?.showDevTools == "function") {
				game.print("点击以下按钮\n将开启诗笺版内置的控制台");
				game.print("<button onclick='window.noname_shijianInterfaces.showDevTools();'>开启DevTools</button>");
			}
		};
		if (!get.config("menu_loadondemand")) {
			node._initLink();
		}
	})();
	(function () {
		var page = ui.create.div("");
		var node = ui.create.div(".menubutton.large", "内核", start.firstChild, clickMode);
		node._initLink = function () {
			node.link = page;
			page.classList.add("menu-sym");

			const coreInfo = get.coreInfo();

			const agent = document.createElement("div");
			agent.css({
				margin: "10px 0",
				textAlign: "left",
			});
			let agentText = dedent`浏览器内核: ${coreInfo[0]}<br/>
			浏览器版本: ${coreInfo[1]}.${coreInfo[2]}.${coreInfo[3]}<br/>`;

			if (lib.device === "android") {
				agentText += dedent`应用平台: 安卓<br/>`;

				if (typeof window.NonameAndroidBridge?.getPackageName === "function") {
					agentText += dedent`安卓应用包名: ${window.NonameAndroidBridge.getPackageName()}<br/>`;
				}

				if (typeof window.NonameAndroidBridge?.getPackageVersionCode === "function") {
					agentText += dedent`安卓应用版本: ${window.NonameAndroidBridge.getPackageVersionCode()}<br/>`;
				}

				if (typeof window.device === "object") {
					agentText += dedent`安卓版本: ${device.version}<br/>
					安卓SDK版本: ${device.sdkVersion}<br/>
					设备制造商: ${device.manufacturer}<br/>`;
				}
			} else if (lib.device === "ios") {
				agentText += dedent`应用平台: 苹果<br/>`;
			} else if (typeof window.require == "function" && typeof window.process == "object" && typeof window.__dirname == "string") {
				agentText += dedent`应用平台: Electron<br/>
				Electron版本: ${process.versions.electron}<br/>`;
			}

			agent.innerHTML = agentText;

			page.appendChild(agent);

			const button = document.createElement("button");
			button.classList.add("changeWebviewProvider");
			button.innerText = "点击切换WebView实现";
			button.addEventListener("click", function () {
				if (typeof window.NonameAndroidBridge?.changeWebviewProvider === "function") {
					window.NonameAndroidBridge.changeWebviewProvider();
				} else {
					alert("此客户端不支持此功能");
				}
			});
			page.appendChild(button);
		};
		if (!get.config("menu_loadondemand")) {
			node._initLink();
		}
	})();
	(function () {
		var page = ui.create.div("");
		var node = ui.create.div(".menubutton.large", "战绩", start.firstChild, clickMode);
		node.type = "rec";
		node._initLink = function () {
			node.link = page;
			page.style.paddingBottom = "10px";
			var reset = function () {
				if (this.innerHTML == "重置") {
					this.innerHTML = "确定";
					var that = this;
					setTimeout(function () {
						that.innerHTML = "重置";
					}, 1000);
				} else {
					this.parentNode.previousSibling.remove();
					this.parentNode.remove();
					lib.config.gameRecord[this.parentNode.link] = { data: {} };
					game.saveConfig("gameRecord", lib.config.gameRecord);
				}
			};
			for (var i = 0; i < lib.config.all.mode.length; i++) {
				if (!lib.config.gameRecord[lib.config.all.mode[i]]) {
					continue;
				}
				if (lib.config.gameRecord[lib.config.all.mode[i]].str) {
					ui.create.div(".config.indent", lib.translate[lib.config.all.mode[i]], page).style.marginBottom = "-5px";
					var item = ui.create.div(".config.indent", lib.config.gameRecord[lib.config.all.mode[i]].str + "<span>重置</span>", page);
					item.style.height = "auto";
					item.lastChild.addEventListener("click", reset);
					item.lastChild.classList.add("pointerdiv");
					item.link = lib.config.all.mode[i];
				}
			}
		};
		if (!get.config("menu_loadondemand")) {
			node._initLink();
		}
	})();
	(function () {
		if (!window.indexedDB || window.nodb) {
			return;
		}
		var page = ui.create.div("");
		var node = ui.create.div(".menubutton.large", "录像", start.firstChild, clickMode);
		node.type = "video";
		lib.videos = [];
		ui.create.videoNode = (video, before) => {
			lib.videos.remove(video);
			if (_status.over) {
				return;
			}
			lib.videos[before === true ? "unshift" : "push"](video);
		};
		node._initLink = function () {
			node.link = page;
			var store = lib.db.transaction(["video"], "readwrite").objectStore("video");
			store.openCursor().onsuccess = function (e) {
				var cursor = e.target.result;
				if (cursor) {
					lib.videos.push(cursor.value);
					cursor.continue();
				} else {
					lib.videos.sort(function (a, b) {
						return parseInt(b.time) - parseInt(a.time);
					});
					var clickcapt = function () {
						var current = this.parentNode.querySelector(".videonode.active");
						if (current && current != this) {
							current.classList.remove("active");
						}
						if (this.classList.toggle("active")) {
							playButton.show();
							deleteButton.show();
							saveButton.show();
						} else {
							playButton.hide();
							deleteButton.hide();
							saveButton.hide();
						}
					};
					var staritem = function () {
						this.parentNode.classList.toggle("starred");
						var store = lib.db.transaction(["video"], "readwrite").objectStore("video");
						if (this.parentNode.classList.contains("starred")) {
							this.parentNode.link.starred = true;
						} else {
							this.parentNode.link.starred = false;
						}
						store.put(this.parentNode.link);
					};
					var createNode = function (video, before) {
						var node = ui.create.div(".videonode.menubutton.large", clickcapt);
						node.link = video;
						var nodename1 = ui.create.div(".menubutton.videoavatar", node);
						nodename1.setBackground(video.name1, "character");
						if (video.name2) {
							var nodename2 = ui.create.div(".menubutton.videoavatar2", node);
							nodename2.setBackground(video.name2, "character");
						}
						var date = new Date(video.time);
						var str = date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate() + " " + date.getHours() + ":";
						var minutes = date.getMinutes();
						if (minutes < 10) {
							str += "0";
						}
						str += minutes;
						ui.create.div(".caption", video.name[0], node);
						ui.create.div(".text", str + "<br>" + video.name[1], node);
						if (video.win) {
							ui.create.div(".victory", "胜", node);
						}

						if (before) {
							page.insertBefore(node, page.firstChild);
						} else {
							page.appendChild(node);
						}
						ui.create.div(".video_star", "★", node, staritem);
						if (video.starred) {
							node.classList.add("starred");
						}
					};
					for (var i = 0; i < lib.videos.length; i++) {
						createNode(lib.videos[i]);
					}
					ui.create.videoNode = createNode;
					var importVideoNode = ui.create.div(
						".config.switcher.pointerspan",
						'<span class="underlinenode slim ">导入录像...</span>',
						function () {
							this.nextSibling.classList.toggle("hidden");
						},
						page
					);
					importVideoNode.style.marginLeft = "12px";
					importVideoNode.style.marginTop = "3px";
					var importVideo = ui.create.div(".config.hidden", page);
					importVideo.style.whiteSpace = "nowrap";
					importVideo.style.marginBottom = "80px";
					importVideo.style.marginLeft = "13px";
					importVideo.style.width = "calc(100% - 30px)";
					importVideo.innerHTML = '<input type="file" accept="*/*" style="width:calc(100% - 40px)">' + '<button style="width:40px">确定</button>';
					importVideo.lastChild.onclick = function () {
						var fileToLoad = importVideo.firstChild.files[0];
						var fileReader = new FileReader();
						fileReader.onload = function (fileLoadedEvent) {
							var data = fileLoadedEvent.target.result;
							if (!data) {
								return;
							}
							try {
								data = JSON.parse(lib.init.decode(data));
							} catch (e) {
								console.log(e);
								alert("导入失败");
								return;
							}
							var store = lib.db.transaction(["video"], "readwrite").objectStore("video");
							var videos = lib.videos.slice(0);
							for (var i = 0; i < videos.length; i++) {
								if (videos[i].starred) {
									videos.splice(i--, 1);
								}
							}
							for (var deletei = 0; deletei < 5; deletei++) {
								if (videos.length >= parseInt(lib.config.video) && videos.length) {
									var toremove = videos.pop();
									lib.videos.remove(toremove);
									store.delete(toremove.time);
									for (var i = 0; i < page.childNodes.length; i++) {
										if (page.childNodes[i].link == toremove) {
											page.childNodes[i].remove();
											break;
										}
									}
								} else {
									break;
								}
							}
							for (var i = 0; i < lib.videos.length; i++) {
								if (lib.videos[i].time == data.time) {
									alert("录像已存在");
									return;
								}
							}
							lib.videos.unshift(data);
							store.put(data);
							createNode(data, true);
						};
						fileReader.readAsText(fileToLoad, "UTF-8");
					};

					playButton.listen(function () {
						var current = this.parentNode.querySelector(".videonode.active");
						if (current) {
							game.playVideo(current.link.time, current.link.mode);
						}
					});
					deleteButton.listen(function () {
						var current = this.parentNode.querySelector(".videonode.active");
						if (current) {
							lib.videos.remove(current.link);
							var store = lib.db.transaction(["video"], "readwrite").objectStore("video");
							store.delete(current.link.time);
							current.remove();
						}
					});
					saveButton.listen(function () {
						var current = this.parentNode.querySelector(".videonode.active");
						if (current) {
							game.export(lib.init.encode(JSON.stringify(current.link)), "无名杀 - 录像 - " + current.link.name[0] + " - " + current.link.name[1]);
						}
					});

					ui.updateVideoMenu = function () {
						var active = start.firstChild.querySelector(".active");
						if (active) {
							active.classList.remove("active");
							active.link.remove();
						}
						node.classList.add("active");
						rightPane.appendChild(page);
						playButton.style.display = "";
						deleteButton.style.display = "";
						saveButton.style.display = "";
					};
				}
			};
		};
		if (!get.config("menu_loadondemand")) {
			node._initLink();
		}
	})();

	for (const [name, content] of Object.entries(lib.help)) {
		// 创建帮助页面的内容元素
		const page = ui.create.div("");
		// 创建帮助按钮
		// TODO: 对是否应该对按钮进行其他框架的挂载处理
		var node = ui.create.div(".menubutton.large", name, start.firstChild, clickMode);
		// 设置帮助按钮的类型
		Reflect.set(node, "type", "help");
		// 初始化帮助按钮的链接
		Reflect.set(node, "link", page);
		// 在非帮助页面下默认隐藏
		node.style.display = "none";
		// 设置帮助页面的类名
		page.classList.add("menu-help");

		// 若传递的内容为对象，则特殊处理
		if (typeof content == "object") {
			/** @type {object} */
			const contentObject = content;

			// 如果对象拥有"mount"方式，则调用该方法进行挂载
			if (typeof contentObject.mount == "function") {
				contentObject.mount(page);
			}
			// 如果对象拥有"data"方式或"setup"方式，则视为vue组件
			else if (typeof contentObject.data == "function" || typeof contentObject.setup == "function") {
				// 创建vue组件
				const component = createApp(contentObject);
				// 挂载到页面
				component.mount(page);
			}
			// 否则相信`Object#toString`的结果
			else {
				page.innerHTML = content;
			}
		}
		// 否则将视为字符串，直接创建文本元素
		else {
			page.innerHTML = content;
		}
	}

	if (!connectMenu) {
		var node = ui.create.div(".menubutton.large", "帮助", start.firstChild, function () {
			var activex = start.firstChild.querySelector(".active");
			if (this.innerHTML == "帮助") {
				cheatButton.style.display = "none";
				runButton.style.display = "none";
				clearButton.style.display = "none";
				playButton.style.display = "none";
				saveButton.style.display = "none";
				deleteButton.style.display = "none";

				this.innerHTML = "返回";
				for (var i = 0; i < start.firstChild.childElementCount; i++) {
					var nodex = start.firstChild.childNodes[i];
					if (nodex == node) {
						continue;
					}
					if (nodex.type == "help") {
						nodex.style.display = "";
						if (activex && activex.type != "help") {
							activex.classList.remove("active");
							activex.link.remove();
							activex = null;
							nodex.classList.add("active");
							rightPane.appendChild(nodex.link);
						}
					} else {
						nodex.style.display = "none";
					}
				}
			} else {
				this.innerHTML = "帮助";
				for (var i = 0; i < start.firstChild.childElementCount; i++) {
					var nodex = start.firstChild.childNodes[i];
					if (nodex == node) {
						continue;
					}
					if (nodex.type != "help") {
						nodex.style.display = "";
						if (activex && activex.type == "help") {
							activex.classList.remove("active");
							activex.link.remove();
							activex = null;
							clickMode.call(nodex);
						}
					} else {
						nodex.style.display = "none";
					}
				}
			}
		});
	}

	var active = start.firstChild.querySelector(".active");
	if (!active) {
		active = start.firstChild.firstChild;
		active.classList.add("active");
	}
	if (!active.link) {
		active._initLink();
	}
	rightPane.appendChild(active.link);
};
