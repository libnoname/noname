import { menuContainer, popupContainer, updateActive, setUpdateActive, updateActiveCard, setUpdateActiveCard, menux, menuxpages, menuUpdates, openMenu, clickToggle, clickSwitcher, clickContainer, clickMenuItem, createMenu, createConfig } from "../index.js";
import { ui, game, get, ai, lib, _status } from "noname";
import { nonameInitialized } from "@/util/index.js";
import JSZip from "jszip";

export const optionsMenu = function (connectMenu) {
	if (connectMenu) {
		return;
	}
	/**
	 * 由于联机模式会创建第二个菜单，所以需要缓存一下可变的变量
	 */
	// const cacheMenuContainer = menuContainer;
	const cachePopupContainer = popupContainer;
	// const cacheMenux = menux;
	const cacheMenuxpages = menuxpages;
	/** @type { HTMLDivElement } */
	// @ts-expect-error ignore
	var start = cacheMenuxpages.shift();
	var rightPane = start.lastChild;

	var clickMode = function () {
		var active = this.parentNode.querySelector(".active");
		if (active === this) {
			return;
		}
		active.classList.remove("active");
		active.link.remove();
		active = this;
		active.classList.add("active");
		if (this.link) {
			rightPane.appendChild(this.link);
		} else {
			this._initLink();
			rightPane.appendChild(this.link);
		}
	};

	var clickAutoSkill = function (bool) {
		var name = this._link.config._name;
		var list = lib.config.autoskilllist;
		if (bool) {
			list.remove(name);
		} else {
			list.add(name);
		}
		game.saveConfig("autoskilllist", list);
	};
	var skilllistexpanded = game.expandSkills(lib.skilllist);
	for (var i in lib.skill) {
		if (!skilllistexpanded.includes(i)) {
			continue;
		}
		if (lib.skill[i].frequent && lib.translate[i]) {
			lib.configMenu.skill.config[i] = {
				name: lib.translate[i + "_noconf"] || lib.translate[i],
				init: true,
				type: "autoskill",
				onclick: clickAutoSkill,
				intro: lib.translate[i + "_info"],
			};
		}
	}
	var clickBanSkill = function (bool) {
		var name = this._link.config._name;
		var list = lib.config.forbidlist;
		if (bool) {
			list.remove(name);
		} else {
			list.add(name);
		}
		game.saveConfig("forbidlist", list);
	};
	var forbid = lib.config.forbid;
	if (!lib.config.forbidlist) {
		game.saveConfig("forbidlist", []);
	}
	for (var i = 0; i < forbid.length; i++) {
		var skip = false;
		var str = "";
		var str2 = "";
		var str3 = "";
		for (var j = 0; j < forbid[i].length; j++) {
			if (!lib.skilllist.includes(forbid[i][j])) {
				skip = true;
				break;
			}
			str += get.translation(forbid[i][j]) + "+";
			str2 += forbid[i][j] + "+";
			str3 += get.translation(forbid[i][j]) + "：" + lib.translate[forbid[i][j] + "_info"];
			if (j < forbid[i].length - 1) {
				str3 += '<div class="placeholder slim" style="display:block;height:8px"></div>';
			}
		}
		if (skip) {
			continue;
		}
		str = str.slice(0, str.length - 1);
		str2 = str2.slice(0, str2.length - 1);

		lib.configMenu.skill.config[str2] = {
			name: str,
			init: true,
			type: "banskill",
			onclick: clickBanSkill,
			intro: str3,
		};
	}

	var updateView = null;
	var updateAppearence = null;
	var createModeConfig = function (mode, position) {
		var info = lib.configMenu[mode];
		var page = ui.create.div("");
		var node = ui.create.div(".menubutton.large", info.name, position, clickMode);
		node.mode = mode;
		// node._initLink=function(){
		node.link = page;
		var map = {};
		if (info.config) {
			var hiddenNodes = [];
			var autoskillNodes = [];
			var banskillNodes = [];
			var custombanskillNodes = [];
			var banskill;

			if (mode == "skill") {
				var autoskillexpanded = false;
				var banskillexpanded = false;
				ui.create.div(".config.more", "自动发动 <div>&gt;</div>", page, function () {
					if (autoskillexpanded) {
						this.classList.remove("on");
						for (var k = 0; k < autoskillNodes.length; k++) {
							autoskillNodes[k].style.display = "none";
						}
					} else {
						this.classList.add("on");
						for (var k = 0; k < autoskillNodes.length; k++) {
							autoskillNodes[k].style.display = "";
						}
					}
					autoskillexpanded = !autoskillexpanded;
				});
				banskill = ui.create.div(".config.more", "双将禁配 <div>&gt;</div>", page, function () {
					if (banskillexpanded) {
						this.classList.remove("on");
						for (var k = 0; k < banskillNodes.length; k++) {
							banskillNodes[k].style.display = "none";
						}
					} else {
						this.classList.add("on");
						for (var k = 0; k < banskillNodes.length; k++) {
							banskillNodes[k].style.display = "";
						}
					}
					banskillexpanded = !banskillexpanded;
				});

				var banskilladd = ui.create.div(".config.indent", '<span class="pointerdiv">添加...</span>', page, function () {
					this.nextSibling.classList.toggle("hidden");
				});
				banskilladd.style.display = "none";
				banskillNodes.push(banskilladd);

				var banskilladdNode = ui.create.div(".config.indent.hidden.banskilladd", page);
				banskilladdNode.style.display = "none";
				banskillNodes.push(banskilladdNode);

				var matchBanSkill = function (skills1, skills2) {
					if (skills1.length != skills2.length) {
						return false;
					}
					for (var i = 0; i < skills1.length; i++) {
						if (!skills2.includes(skills1[i])) {
							return false;
						}
					}
					return true;
				};
				var deleteCustomBanSkill = function () {
					for (var i = 0; i < lib.config.customforbid.length; i++) {
						if (matchBanSkill(lib.config.customforbid[i], this.parentNode.link)) {
							lib.config.customforbid.splice(i--, 1);
							break;
						}
					}
					game.saveConfig("customforbid", lib.config.customforbid);
					this.parentNode.remove();
				};
				var createCustomBanSkill = function (skills) {
					var node = ui.create.div(".config.indent.toggle");
					node.style.display = "none";
					node.link = skills;
					banskillNodes.push(node);
					custombanskillNodes.push(node);
					var str = get.translation(skills[0]);
					for (var i = 1; i < skills.length; i++) {
						str += "+" + get.translation(skills[i]);
					}
					node.innerHTML = str;
					var span = document.createElement("span");
					span.classList.add("cardpiledelete");
					span.innerHTML = "删除";
					span.onclick = deleteCustomBanSkill;
					node.appendChild(span);
					page.insertBefore(node, banskilladdNode.nextSibling);
					return node;
				};
				for (var i = 0; i < lib.config.customforbid.length; i++) {
					createCustomBanSkill(lib.config.customforbid[i]);
				}
				(function () {
					var list = [];
					for (var i in lib.character) {
						if (lib.character[i][3].length) {
							list.push([i, lib.translate[i]]);
						}
					}
					if (!list.length) {
						return;
					}
					list.sort(function (a, b) {
						a = a[0];
						b = b[0];
						var aa = a,
							bb = b;
						if (aa.includes("_")) {
							aa = aa.slice(aa.lastIndexOf("_") + 1);
						}
						if (bb.includes("_")) {
							bb = bb.slice(bb.lastIndexOf("_") + 1);
						}
						if (aa != bb) {
							return aa > bb ? 1 : -1;
						}
						return a > b ? 1 : -1;
					});

					var list2 = [];
					var skills = lib.character[list[0][0]][3];
					for (var i = 0; i < skills.length; i++) {
						list2.push([skills[i], lib.translate[skills[i]]]);
					}

					var selectname = ui.create.selectlist(list, list[0], banskilladdNode);
					selectname.onchange = function () {
						var skills = lib.character[this.value][3];
						skillopt.innerHTML = "";
						for (var i = 0; i < skills.length; i++) {
							var option = document.createElement("option");
							option.value = skills[i];
							option.innerHTML = lib.translate[skills[i]];
							skillopt.appendChild(option);
						}
					};
					selectname.style.maxWidth = "85px";
					var skillopt = ui.create.selectlist(list2, list2[0], banskilladdNode);

					var span = document.createElement("span");
					span.innerHTML = "＋";
					banskilladdNode.appendChild(span);
					var br = document.createElement("br");
					banskilladdNode.appendChild(br);

					var selectname2 = ui.create.selectlist(list, list[0], banskilladdNode);
					selectname2.onchange = function () {
						var skills = lib.character[this.value][3];
						skillopt2.innerHTML = "";
						for (var i = 0; i < skills.length; i++) {
							var option = document.createElement("option");
							option.value = skills[i];
							option.innerHTML = lib.translate[skills[i]];
							skillopt2.appendChild(option);
						}
					};
					selectname2.style.maxWidth = "85px";
					var skillopt2 = ui.create.selectlist(list2, list2[0], banskilladdNode);
					var confirmbutton = document.createElement("button");
					confirmbutton.innerHTML = "确定";
					banskilladdNode.appendChild(confirmbutton);

					confirmbutton.onclick = function () {
						var skills = [skillopt.value, skillopt2.value];
						if (skills[0] == skills[1]) {
							skills.shift();
						}
						if (!lib.config.customforbid) {
							return;
						}
						for (var i = 0; i < lib.config.customforbid.length; i++) {
							if (matchBanSkill(lib.config.customforbid[i], skills)) {
								return;
							}
						}
						lib.config.customforbid.push(skills);
						game.saveConfig("customforbid", lib.config.customforbid);
						createCustomBanSkill(skills).style.display = "";
					};
				})();
				page.style.paddingBottom = "10px";
			}
			var config = lib.config;
			if (mode == "appearence") {
				updateAppearence = function () {
					info.config.update(config, map);
				};
			} else if (mode == "view") {
				updateView = function () {
					info.config.update(config, map);
				};
			}
			for (var j in info.config) {
				if (j === "update") {
					continue;
				}
				var cfg = get.copy(info.config[j]);
				cfg._name = j;
				if (j in config) {
					cfg.init = config[j];
				} else if (cfg.type != "autoskill" && cfg.type != "banskill") {
					game.saveConfig(j, cfg.init);
				}
				if (!cfg.onclick) {
					cfg.onclick = function (result) {
						var cfg = this._link.config;
						game.saveConfig(cfg._name, result);
						if (cfg.onsave) {
							cfg.onsave.call(this, result);
						}
					};
				}
				if (info.config.update) {
					if (mode == "appearence" || mode == "view") {
						cfg.update = function () {
							if (updateAppearence) {
								updateAppearence();
							}
							if (updateView) {
								updateView();
							}
						};
					} else {
						cfg.update = function () {
							info.config.update(config, map);
						};
					}
				}
				var cfgnode = createConfig(cfg);
				if (cfg.type == "autoskill") {
					autoskillNodes.push(cfgnode);
					// cfgnode.style.transition='all 0s';
					cfgnode.classList.add("indent");
					// cfgnode.hide();
					cfgnode.style.display = "none";
				} else if (cfg.type == "banskill") {
					banskillNodes.push(cfgnode);
					// cfgnode.style.transition='all 0s';
					cfgnode.classList.add("indent");
					// cfgnode.hide();
					cfgnode.style.display = "none";
				}
				if (j == "import_data_button") {
					ui.import_data_button = cfgnode;
					cfgnode.hide();
					cfgnode.querySelector("button").onclick = function () {
						var fileToLoad = this.previousSibling.files[0];
						if (fileToLoad) {
							var fileReader = new FileReader();
							fileReader.onload = function (fileLoadedEvent) {
								var data = fileLoadedEvent.target.result;
								if (!data) {
									return;
								}
								try {
									data = JSON.parse(lib.init.decode(data));
									if (!data || typeof data != "object") {
										throw "err";
									}
									if (lib.db && (!data.config || !data.data)) {
										throw "err";
									}
								} catch (e) {
									console.log(e);
									alert("导入失败");
									return;
								}
								alert("导入成功");
								if (!lib.db) {
									var noname_inited = localStorage.getItem("noname_inited");
									var onlineKey = localStorage.getItem(lib.configprefix + "key");
									localStorage.clear();
									if (noname_inited) {
										localStorage.setItem("noname_inited", noname_inited);
									}
									if (onlineKey) {
										localStorage.setItem(lib.configprefix + "key", onlineKey);
									}
									for (var i in data) {
										localStorage.setItem(i, data[i]);
									}
								} else {
									for (var i in data.config) {
										game.putDB("config", i, data.config[i]);
										lib.config[i] = data.config[i];
									}
									for (var i in data.data) {
										game.putDB("data", i, data.data[i]);
									}
								}
								lib.init.background();
								game.reload();
							};
							fileReader.readAsText(fileToLoad, "UTF-8");
						}
					};
				} else if (j == "import_music") {
					cfgnode.querySelector("button").onclick = function () {
						if (_status.music_importing) {
							return;
						}
						_status.music_importing = true;
						var fileToLoad = this.previousSibling.files[0];
						if (fileToLoad) {
							if (!lib.config.customBackgroundMusic) {
								lib.config.customBackgroundMusic = {};
							}
							var name = fileToLoad.name;
							if (name.includes(".")) {
								name = name.slice(0, name.indexOf("."));
							}
							var link = (game.writeFile ? "cdv_" : "custom_") + name;
							if (lib.config.customBackgroundMusic[link]) {
								if (!confirm("已经存在文件名称相同的背景音乐，是否仍然要继续导入？")) {
									_status.music_importing = false;
									return;
								}
								for (var i = 1; i < 1000; i++) {
									if (!lib.config.customBackgroundMusic[link + "_" + i]) {
										link = link + "_" + i;
										break;
									}
								}
							}
							var callback = function () {
								var nodexx = ui.background_music_setting;
								var nodeyy = nodexx._link.menu;
								var nodezz = nodexx._link.config;
								var musicname = link.slice(link.indexOf("_") + 1);
								game.prompt("###请输入音乐的名称###" + musicname, true, function (str) {
									if (str) {
										musicname = str;
									}
									lib.config.customBackgroundMusic[link] = musicname;
									lib.config.background_music = link;
									lib.config.all.background_music.add(link);
									game.saveConfig("background_music", link);
									game.saveConfig("customBackgroundMusic", lib.config.customBackgroundMusic);
									nodezz.item[link] = lib.config.customBackgroundMusic[link];
									var textMenu = ui.create.div("", lib.config.customBackgroundMusic[link], nodeyy, clickMenuItem, nodeyy.childElementCount - 2);
									textMenu._link = link;
									nodezz.updatex.call(nodexx, []);
									_status.music_importing = false;
									if (!_status._aozhan) {
										game.playBackgroundMusic();
									}
								});
							};
							if (game.writeFile) {
								game.writeFile(fileToLoad, "audio/background", link + ".mp3", callback);
							} else {
								game.putDB("audio", link, fileToLoad, callback);
							}
						}
					};
				} else if (j == "extension_source") {
					ui.extension_source = cfgnode;
					cfgnode.updateInner = function () {
						this._link.choosing.innerHTML = lib.config.extension_source;
					};
				}
				map[j] = cfgnode;
				if (!cfg.unfrequent) {
					if (cfg.type == "autoskill") {
						page.insertBefore(cfgnode, banskill);
					} else {
						page.appendChild(cfgnode);
					}
				} else {
					// cfgnode.classList.add('auto-hide');
					hiddenNodes.push(cfgnode);
				}
			}
			var expanded = false;
			if (hiddenNodes.length) {
				// ui.create.div('.config.more','更多 <div>&gt;</div>',page,function(){
				//     if(expanded){
				//      			this.classList.remove('on');
				//      			this.parentNode.classList.remove('expanded');
				//     }
				//     else{
				//      			this.classList.add('on');
				//      			this.parentNode.classList.add('expanded');
				//     }
				//     expanded=!expanded;
				// });
				page.classList.add("morenodes");
				for (var k = 0; k < hiddenNodes.length; k++) {
					page.appendChild(hiddenNodes[k]);
				}
			}
			if (info.config.update) {
				info.config.update(config, map);
			}
		}
		// };
		// if(!get.config('menu_loadondemand')) node._initLink();
		return node;
	};

	for (var i in lib.configMenu) {
		if (i != "others") {
			createModeConfig(i, start.firstChild);
		}
	}
	(function () {
		if (!game.download && !lib.device) {
			return;
		}
		var page = ui.create.div("#create-extension");
		var node = ui.create.div(".menubutton.large", "文件", start.firstChild, clickMode);
		node.mode = "create";
		node._initLink = function () {
			node.link = page;
			var pageboard = ui.create.div(page);

			var importextensionexpanded = false;
			var importExtension;
			var extensionnode = ui.create.div(".config.more", "导入素材包 <div>&gt;</div>", pageboard, function () {
				if (importextensionexpanded) {
					this.classList.remove("on");
					importExtension.style.display = "none";
				} else {
					this.classList.add("on");
					importExtension.style.display = "";
				}
				importextensionexpanded = !importextensionexpanded;
			});
			extensionnode.style.padding = "13px 33px 4px";
			extensionnode.style.left = "0px";
			importExtension = ui.create.div(".new_character.export.import", pageboard);
			importExtension.style.padding = "0px 33px 10px";
			importExtension.style.display = "none";
			importExtension.style.width = "100%";
			importExtension.style.textAlign = "left";
			ui.create.div("", '<input type="file" accept="application/zip" style="width:153px"><button>确定</button>', importExtension);
			var promptnode = ui.create.div("", '<div style="width:153px;font-size:small;margin-top:8px">', importExtension);
			promptnode.style.display = "none";
			importExtension.firstChild.lastChild.onclick = function () {
				if (promptnode.style.display != "none") {
					return;
				}
				var fileToLoad = this.previousSibling.files[0];
				if (fileToLoad) {
					promptnode.style.display = "";
					promptnode.firstChild.innerHTML = "正在解压...";
					var fileReader = new FileReader();
					fileReader.onload = function (fileLoadedEvent) {
						var data = fileLoadedEvent.target.result;
						var loadData = function () {
							var zip = new JSZip();
							zip.load(data);
							var images = [],
								audios = [],
								fonts = [],
								directories = {},
								directoryList = [];
							Object.keys(zip.files).forEach(file => {
								const parsedPath = lib.path.parse(file),
									directory = parsedPath.dir,
									fileExtension = parsedPath.ext.toLowerCase();
								if (directory.startsWith("audio") && (fileExtension == ".mp3" || fileExtension == ".ogg")) {
									audios.push(file);
								} else if (directory.startsWith("font") && fileExtension == ".woff2") {
									fonts.push(file);
								} else if (directory.startsWith("image") && (fileExtension == ".jpg" || fileExtension == ".png")) {
									images.push(file);
								} else {
									return;
								}
								if (!directories[directory]) {
									directories[directory] = [];
									directoryList.push(directory);
								}
								directories[directory].push(parsedPath.base);
							});
							if (audios.length || fonts.length || images.length) {
								var str = "";
								if (audios.length) {
									str += audios.length + "个音频文件";
								}
								if (fonts.length) {
									if (str.length) {
										str += "、";
									}
									str += fonts.length + "个字体文件";
								}
								if (images.length) {
									if (str.length) {
										str += "、";
									}
									str += images.length + "个图片文件";
								}
								var filelist = audios.concat(fonts).concat(images);
								if (filelist.length > 200) {
									str += "，导入时间可能较长";
								}
								var assetLoaded = function () {
									promptnode.firstChild.innerHTML = '导入成功。<span class="hrefnode">重新启动</span><span class="closenode">×</span>';
									promptnode.firstChild.querySelectorAll("span")[0].onclick = game.reload;
									promptnode.firstChild.querySelectorAll("span")[1].onclick = function () {
										promptnode.style.display = "none";
									};
								};
								if (confirm("本次将导入" + str + "，是否继续？")) {
									promptnode.firstChild.innerHTML = '正在导入... <span class="hrefnode">详细信息</span>';
									promptnode.firstChild.querySelector("span.hrefnode").onclick = ui.click.consoleMenu;
									if (lib.node && lib.node.fs) {
										var writeFile = function () {
											if (filelist.length) {
												var str = filelist.shift();
												game.print(str.slice(str.lastIndexOf("/") + 1));
												lib.node.fs.writeFile(__dirname + "/" + str, zip.files[str].asNodeBuffer(), null, writeFile);
											} else {
												assetLoaded();
											}
										};
										game.ensureDirectory(directoryList, writeFile);
									} else {
										var getDirectory = function () {
											if (directoryList.length) {
												var dir = directoryList.shift();
												var filelist = directories[dir];
												window.resolveLocalFileSystemURL(nonameInitialized + dir, function (entry) {
													var writeFile = function () {
														if (filelist.length) {
															var filename = filelist.shift();
															game.print(filename);
															entry.getFile(filename, { create: true }, function (fileEntry) {
																fileEntry.createWriter(function (fileWriter) {
																	fileWriter.onwriteend = writeFile;
																	fileWriter.onerror = function (e) {
																		game.print("Write failed: " + e.toString());
																	};
																	fileWriter.write(zip.files[dir + "/" + filename].asArrayBuffer());
																});
															});
														} else {
															getDirectory();
														}
													};
													writeFile();
												});
											} else {
												assetLoaded();
											}
										};
										game.ensureDirectory(directoryList, getDirectory);
									}
								} else {
									promptnode.style.display = "none";
								}
							} else {
								alert("没有检测到素材");
							}
						};
						loadData();
					};
					fileReader.readAsArrayBuffer(fileToLoad, "UTF-8");
				}
			};

			var dashboard = ui.create.div(pageboard);
			var clickDash = function () {
				ui.create.templayer();
				pageboard.hide();
				this.link.show();
				if (this.link.init) {
					this.link.init();
				}
			};
			var createDash = function (str1, str2, node) {
				var dash = ui.create.div(".menubutton.large.dashboard");
				dashboard.appendChild(dash);
				page.appendChild(node);
				dash.link = node;
				node.link = dash;
				dash.listen(clickDash);
				lib.setScroll(node);
				ui.create.div("", str1, dash);
				ui.create.div("", str2, dash);
			};
			var createDash2 = function (str1, str2, path, page) {
				var dash = ui.create.div(".menubutton.large.dashboard.dashboard2");
				page.appendChild(dash);
				dash.listen(function () {
					page.path = path;
					enterDirectory(page, path);
				});
				ui.create.div("", str1, dash);
				ui.create.div("", str2, dash);
			};
			var removeFile = function (selected, page) {
				if (lib.node && lib.node.fs) {
					var unlink = function () {
						if (selected.length) {
							lib.node.fs.unlink(__dirname + "/" + selected.shift().path, unlink);
						} else {
							enterDirectory(page, page.currentpath);
						}
					};
					unlink();
				} else {
					window.resolveLocalFileSystemURL(nonameInitialized + page.currentpath, function (entry) {
						var unlink = function () {
							if (selected.length) {
								entry.getFile(selected.shift().filename, { create: false }, function (fileEntry) {
									fileEntry.remove(unlink);
								});
							} else {
								enterDirectory(page, page.currentpath);
							}
						};
						unlink();
					});
				}
			};
			var clickDirectory = function () {
				if (_status.dragged) {
					return;
				}
				var page = this.parentNode.parentNode.parentNode;
				if (page.deletebutton.classList.contains("active")) {
					if (confirm("确认删除" + this.innerHTML + "文件夹？（此操作不可撤销）")) {
						if (lib.node && lib.node.fs) {
							try {
								var removeDirectory = function (path, callback) {
									lib.node.fs.readdir(__dirname + "/" + path, function (err, list) {
										if (err) {
											console.log(err);
											return;
										}
										var removeFile = function () {
											if (list.length) {
												var filename = list.shift();
												var url = __dirname + "/" + path + "/" + filename;
												if (lib.node.fs.statSync(url).isDirectory()) {
													removeDirectory(path + "/" + filename, removeFile);
												} else {
													lib.node.fs.unlink(url, removeFile);
												}
											} else {
												lib.node.fs.rmdir(__dirname + "/" + path, callback);
											}
										};
										removeFile();
									});
								};
								removeDirectory(this.path, function () {
									enterDirectory(page, page.currentpath);
								});
							} catch (e) {
								console.log(e);
							}
						} else {
							window.resolveLocalFileSystemURL(nonameInitialized + this.path, function (entry) {
								entry.removeRecursively(function () {
									enterDirectory(page, page.currentpath);
								});
							});
						}
					}
					return;
				}
				enterDirectory(page, this.path);
			};
			var clickFile = function () {
				if (_status.dragged) {
					return;
				}
				var page = this.parentNode.parentNode.parentNode;
				if (page.deletebutton.classList.contains("active")) {
					if (confirm("确认删除" + this.innerHTML + "？（此操作不可撤销）")) {
						removeFile([this], page);
					}
					return;
				}
				this.classList.toggle("thundertext");
				page.clicked = true;
				if (this.ext == "jpg" || this.ext == "png") {
					if (this.classList.contains("thundertext")) {
						if (!this.previewnode) {
							this.previewnode = document.createElement("img");
							this.previewnode.src = lib.assetURL + this.path;
							this.previewnode.width = "60";
							this.previewnode.style.maxHeight = "120px";
							this.parentNode.appendChild(this.previewnode);
						}
					} else {
						if (this.previewnode) {
							this.previewnode.remove();
							delete this.previewnode;
						}
					}
				} else if (this.ext == "mp3" || this.ext == "ogg") {
					if (this.classList.contains("thundertext")) {
						if (!this.previewnode) {
							this.previewnode = game.playAudio(this.path.slice(6));
						}
					} else {
						if (this.previewnode) {
							this.previewnode.remove();
							delete this.previewnode;
						}
					}
				}
			};
			var clickFileList = function () {
				if (!this.parentNode) {
					return;
				}
				if (this.parentNode.clicked) {
					this.parentNode.clicked = false;
				} else {
					var selected = Array.from(this.querySelectorAll("span.thundertext"));
					for (var i = 0; i < selected.length; i++) {
						selected[i].classList.remove("thundertext");
						if (selected[i].previewnode) {
							selected[i].previewnode.remove();
							delete selected[i].previewnode;
						}
					}
				}
			};
			var enterDirectory = function (page, path) {
				page.innerHTML = "";
				page.currentpath = path;
				var backbutton = ui.create.div(".menubutton.round", "返", page, function () {
					page.clicked = false;
					clickFileList.call(filelist);
					if (page.path == path) {
						page.reset();
					} else {
						if (path.indexOf("/") == -1) {
							enterDirectory(page, "");
						} else {
							enterDirectory(page, path.slice(0, path.lastIndexOf("/")));
						}
					}
				});
				backbutton.style.zIndex = 1;
				backbutton.style.right = "10px";
				backbutton.style.bottom = "15px";

				var refresh = function () {
					enterDirectory(page, path);
				};
				var addbutton = ui.create.div(".menubutton.round", "添", page, function () {
					var pos1 = this.getBoundingClientRect();
					var pos2 = ui.window.getBoundingClientRect();
					openMenu(this.menu, {
						clientX: pos1.left + pos1.width + 5 - pos2.left,
						clientY: pos1.top - pos2.top,
					});
				});
				addbutton.menu = ui.create.div(".menu");
				ui.create.div("", "添加文件", addbutton.menu, function () {
					cachePopupContainer.noclose = true;
				});
				var createDir = function (str) {
					if (lib.node && lib.node.fs) {
						lib.node.fs.mkdir(__dirname + "/" + path + "/" + str, refresh);
					} else {
						window.resolveLocalFileSystemURL(nonameInitialized + path, function (entry) {
							entry.getDirectory(str, { create: true }, refresh);
						});
					}
				};
				ui.create.div("", "添加目录", addbutton.menu, function () {
					ui.create.templayer();
					game.prompt("输入目录名称", function (str) {
						if (str) {
							createDir(str);
						}
					});
				});
				var input = document.createElement("input");
				input.className = "fileinput";
				input.type = "file";
				input.onchange = function () {
					var fileToLoad = input.files[0];
					game.print(fileToLoad.name);
					if (fileToLoad) {
						var fileReader = new FileReader();
						fileReader.onload = function (e) {
							game.writeFile(e.target.result, path, fileToLoad.name, refresh);
						};
						fileReader.readAsArrayBuffer(fileToLoad, "UTF-8");
					}
				};
				addbutton.menu.firstChild.appendChild(input);
				addbutton.style.zIndex = 1;
				addbutton.style.right = "10px";
				addbutton.style.bottom = "80px";

				var deletebutton = ui.create.div(".menubutton.round", "删", page, function () {
					if (!this.parentNode) {
						return;
					}
					if (!this.classList.contains("active")) {
						var selected = Array.from(filelist.querySelectorAll("span.thundertext"));
						if (selected.length) {
							if (confirm("一共要删除" + selected.length + "个文件，此操作不可撤销，是否确定？")) {
								removeFile(selected, page);
							}
						} else {
							this.classList.add("active");
						}
					} else {
						this.classList.remove("active");
					}
				});
				deletebutton.style.zIndex = 1;
				deletebutton.style.right = "10px";
				deletebutton.style.bottom = "145px";

				page.backbutton = backbutton;
				page.addbutton = addbutton;
				page.deletebutton = deletebutton;
				var filelist = ui.create.div(page);
				filelist.classList.add("file-container");
				filelist.listen(clickFileList);
				lib.setScroll(filelist);
				game.getFileList(path, function (folders, files) {
					var sort = function (a, b) {
						if (a > b) {
							return 1;
						}
						if (a < b) {
							return -1;
						}
						return 0;
					};
					folders.sort(sort);
					files.sort(sort);
					var parent = path;
					if (parent) {
						parent += "/";
					}
					for (var i = 0; i < folders.length; i++) {
						if (!page.path && folders[i] == "app") {
							continue;
						}
						var entry = ui.create.div("", "<span>" + folders[i], filelist);
						entry.firstChild.addEventListener(lib.config.touchscreen ? "touchend" : "click", clickDirectory);
						entry.firstChild.path = parent + folders[i];
					}
					for (var i = 0; i < files.length; i++) {
						if (!page.path) {
							if (files[i] == "app.html") {
								continue;
							}
							if (files[i] == "main.js") {
								continue;
							}
							if (files[i] == "package.json") {
								continue;
							}
						}
						var entry = ui.create.div("", "<span>" + files[i], filelist);
						entry.firstChild.addEventListener(lib.config.touchscreen ? "touchend" : "click", clickFile);
						entry.firstChild.ext = files[i].slice(files[i].lastIndexOf(".") + 1);
						entry.firstChild.path = parent + files[i];
						entry.firstChild.filename = files[i];
					}
				});
			};
			var dash1 = (function () {
				var page = ui.create.div(".hidden.menu-buttons");
				page.reset = function () {
					page.innerHTML = "";
					var backbutton = ui.create.div(".menubutton.round", "返", page, function () {
						ui.create.templayer();
						page.hide();
						pageboard.show();
					});
					backbutton.style.zIndex = 1;
					backbutton.style.right = "10px";
					backbutton.style.bottom = "15px";
					var placeholder = ui.create.div(".placeholder", page);
					placeholder.style.position = "relative";
					placeholder.style.display = "block";
					placeholder.style.width = "100%";
					placeholder.style.height = "14px";
					createDash2("将", "武将图片", "image/character", page);
					createDash2("肤", "皮肤图片", "image/skin", page);
					createDash2("卡", "卡牌图片", "image/card", page);
					createDash2("模", "模式图片", "image/mode", page);
					createDash2("始", "开始图片", "image/splash", page);
					createDash2("景", "背景图片", "image/background", page);
				};
				page.reset();
				return page;
			})();
			var dash2 = (function () {
				var page = ui.create.div(".hidden.menu-buttons");
				page.reset = function () {
					page.innerHTML = "";
					var backbutton = ui.create.div(".menubutton.round", "返", page, function () {
						ui.create.templayer();
						page.hide();
						pageboard.show();
					});
					backbutton.style.zIndex = 1;
					backbutton.style.right = "10px";
					backbutton.style.bottom = "15px";
					var placeholder = ui.create.div(".placeholder", page);
					placeholder.style.position = "relative";
					placeholder.style.display = "block";
					placeholder.style.width = "100%";
					placeholder.style.height = "14px";
					createDash2("技", "技能配音", "audio/skill", page);
					createDash2("卡", "男性卡牌", "audio/card/male", page);
					createDash2("牌", "女性卡牌", "audio/card/female", page);
					createDash2("亡", "阵亡配音", "audio/die", page);
					createDash2("效", "游戏音效", "audio/effect", page);
					createDash2("景", "背景音乐", "audio/background", page);
				};
				page.reset();
				return page;
			})();
			var dash3 = (function () {
				var page = ui.create.div(".hidden.menu-buttons");
				page.path = "font";
				page.reset = function () {
					ui.create.templayer();
					page.hide();
					pageboard.show();
				};
				page.init = function () {
					enterDirectory(page, "font");
				};
				return page;
			})();
			var dash4 = (function () {
				var page = ui.create.div(".hidden.menu-buttons");
				page.path = "";
				page.reset = function () {
					ui.create.templayer();
					page.hide();
					pageboard.show();
				};
				page.init = function () {
					enterDirectory(page, "");
				};
				return page;
			})();
			createDash("图", "图片文件", dash1);
			createDash("音", "音频文件", dash2);
			createDash("字", "字体文件", dash3);
			createDash("全", "全部文件", dash4);
		};
		if (!get.config("menu_loadondemand")) {
			node._initLink();
		}
	})();
	createModeConfig("others", start.firstChild);

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
