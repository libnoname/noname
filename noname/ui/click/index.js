import { lib, game, get, _status, ui } from "noname";
export class Click {
	/**
	 * @type {() => void}
	 */
	consoleMenu;
	/**
	 * @type {(arg0: string) => void}
	 */
	menuTab;
	/**
	 * @type {() => void}
	 */
	configMenu;
	identitycircle() {
		var list = [];
		this.classList.toggle("transparent");
		for (var i = 0; i < this.parentNode.childNodes.length; i++) {
			if (!this.parentNode.childNodes[i].classList.contains("transparent")) {
				list.add(this.parentNode.childNodes[i].link[2]);
			}
		}
		var info = this.link;
		if (list.length == 1) {
			for (var i = 0; i < this.parentNode.childNodes.length; i++) {
				if (!this.parentNode.childNodes[i].classList.contains("transparent")) {
					var info2 = this.parentNode.childNodes[i].link;
					info[0].firstChild.innerHTML = info2[1];
					info[0].dataset.color = info2[2];
				}
			}
		} else {
			info[0].firstChild.innerHTML = "";
			info[0].dataset.color = "";
			ui.create.identitycircle(list, info[0].firstChild);
		}
		this._source._guozhanguess = list;
	}
	connectEvents() {
		if (this.info) {
			var button = this;
			var layer = ui.create.div(".poplayer", ui.window);
			var uiintro = ui.create.dialog("hidden", "notouchscroll");
			this.classList.add("active");
			if (lib.config.touchscreen) {
				lib.setScroll(uiintro.contentContainer);
			}
			layer.listen(function () {
				if (this.clicked) {
					this.clicked = false;
					return;
				}
				button.classList.remove("active");
				uiintro.delete();
				this.delete();
			});
			uiintro.listen(function () {
				_status.clicked = true;
			});
			uiintro.style.zIndex = 21;
			uiintro.classList.add("popped");
			uiintro.classList.add("static");
			uiintro.classList.add("onlineclient");
			uiintro.style.width = "180px";
			uiintro.style.height = "300px";
			uiintro.style.left = "auto";
			uiintro.style.right = "20px";
			uiintro.style.top = "auto";
			uiintro.style.bottom = "75px";

			uiintro.refresh = function () {
				if (button.focused) {
					return;
				}
				uiintro.content.innerHTML = "";
				uiintro.addText("创建约战");
				button.textnode = uiintro.content.lastChild.lastChild;
				uiintro.add('<input type="text" style="width:calc(100% - 10px);resize: none;border: none;border-radius: 2px;box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 0px 1px;margin-top: -2px;margin-bottom: 2px;">');
				uiintro.content.lastChild.style.paddingTop = 0;
				button.input = uiintro.content.lastChild.lastChild;
				button.input.onfocus = function () {
					button.focused = true;
				};
				button.input.onblur = function () {
					delete button.focused;
				};
				if (button.interval) {
					button.input.disabled = true;
					button.input.style.opacity = 0.6;
					if (button.intervaltext) {
						button.textnode.innerHTML = button.intervaltext;
					}
				}
				var datenode = ui.create.div(uiintro.content);
				datenode.style.marginTop = 0;
				datenode.style.whiteSpace = "nowrap";
				var date = new Date();
				var days = [];
				var currentDay = date.getDay();
				if (currentDay == 0) {
					currentDay = 7;
				}
				for (var i = 1; i <= 7; i++) {
					if (i < currentDay) {
						days.push([i.toString(), "下周" + get.cnNumber(i, true)]);
					} else if (i == 7) {
						days.push([i.toString(), "周日"]);
					} else if (i == currentDay) {
						days.push([i.toString(), "今天"]);
					} else {
						days.push([i.toString(), "周" + get.cnNumber(i, true)]);
					}
				}
				days = days.concat(days.splice(0, currentDay - 1));
				var initday = currentDay + 1;
				if (initday > 7) {
					initday -= 7;
				}
				var daysselect = ui.create.selectlist(days, initday.toString(), datenode);
				daysselect.style.width = "55px";
				var hours = [];
				for (var i = 0; i < 24; i++) {
					hours.push([i.toString(), i.toString() + "点"]);
				}
				var hoursselect = ui.create.selectlist(hours, date.getHours().toString(), datenode);
				hoursselect.style.marginLeft = "5px";
				hoursselect.style.width = "55px";
				var timeconfirm = ui.create.node("button", "确定", datenode);
				timeconfirm.style.marginLeft = "5px";
				timeconfirm.onclick = function () {
					if (!button.input.value) {
						alert("请填写约战标题");
						return;
					}
					var date2 = new Date();
					date2.setHours(parseInt(hoursselect.value));
					date2.setMinutes(0);
					date2.setSeconds(0);
					var deltaday = parseInt(daysselect.value) - currentDay;
					if (deltaday < 0) {
						deltaday += 7;
					}
					var utc = date2.getTime() + deltaday * 24 * 3600000;
					if (utc < date.getTime()) {
						alert("创建失败，时间已过");
						return;
					}
					if (get.is.banWords(button.input.value)) {
						var eventnode = ui.create.div(
							".menubutton.videotext.onlineevent.pointerdiv",
							function () {
								var that = this;
								setTimeout(function () {
									if (that.classList.contains("active")) {
										if (confirm("确定要离开" + that.info.content + "？")) {
											that.classList.remove("active");
										}
									} else {
										if (confirm("确定要加入" + that.info.content + "？")) {
											that.classList.add("active");
										}
									}
								});
							},
							uiintro.content,
							4
						);
						var fakeinfo = {
							utc: utc,
							day: parseInt(daysselect.value),
							hour: parseInt(hoursselect.value),
							nickname: get.connectNickname(),
							avatar: lib.config.connect_avatar,
							content: get.plainText(button.input.value),
							create: game.onlineKey,
							members: [game.onlineKey],
						};
						eventnode.info = fakeinfo;
						ui.create.div(".title", fakeinfo.content, eventnode);
						var str;
						if (fakeinfo.day < currentDay) {
							str = "下周";
						} else {
							str = "周";
						}
						if (fakeinfo.day == 7) {
							str += "日";
						} else {
							str += get.cnNumber(fakeinfo.day, true);
						}
						str += " ";
						var hour = fakeinfo.hour;
						if (hour <= 12) {
							if (hour <= 5) {
								str += "凌晨";
							} else if (hour < 12) {
								str += "上午";
							} else {
								str += "中午";
							}
							str += fakeinfo.hour + "点";
						} else {
							if (hour <= 17) {
								str += "下午";
							} else {
								str += "晚上";
							}
							str += fakeinfo.hour - 12 + "点";
						}
						ui.create.div("", "已有" + fakeinfo.members.length + "人加入", eventnode);
						ui.create.div("", "时间：" + str, eventnode);
						if (fakeinfo.members.includes(game.onlineKey)) {
							eventnode.classList.add("active");
						}
						button.input.value = "";
						return;
					}
					game.send(
						"server",
						"events",
						{
							utc: utc,
							day: parseInt(daysselect.value),
							hour: parseInt(hoursselect.value),
							nickname: get.connectNickname(),
							avatar: lib.config.connect_avatar,
							content: get.plainText(button.input.value),
						},
						game.onlineKey
					);
				};

				var num = 0;
				for (var i = 0; i < button.info.length; i++) {
					if (typeof button.info[i].creator == "string" && button.info[i].creator != game.onlineKey && get.is.banWords(button.info[i].content)) {
						continue;
					}
					if (button.info[i].creator == game.onlineKey) {
						num++;
					}
					var eventnode = ui.create.div(
						".menubutton.videotext.onlineevent.pointerdiv",
						function () {
							var that = this;
							if (typeof that.info.creator != "string") {
								return;
							}
							setTimeout(function () {
								if (that.classList.contains("active")) {
									if (confirm("确定要离开" + that.info.content + "？")) {
										game.send("server", "events", that.info.id, game.onlineKey, "leave");
									}
								} else {
									if (confirm("确定要加入" + that.info.content + "？")) {
										game.send("server", "events", that.info.id, game.onlineKey, "join");
									}
								}
							});
						},
						uiintro.content
					);
					eventnode.info = button.info[i];
					if (typeof button.info[i].creator == "string") {
						ui.create.div(".title", button.info[i].content, eventnode);
						var str;
						if (button.info[i].day < currentDay) {
							str = "下周";
						} else {
							str = "周";
						}
						if (button.info[i].day == 7) {
							str += "日";
						} else {
							str += get.cnNumber(button.info[i].day, true);
						}
						str += " ";
						var hour = button.info[i].hour;
						if (hour <= 12) {
							if (hour <= 5) {
								str += "凌晨";
							} else if (hour < 12) {
								str += "上午";
							} else {
								str += "中午";
							}
							str += button.info[i].hour + "点";
						} else {
							if (hour <= 17) {
								str += "下午";
							} else {
								str += "晚上";
							}
							str += button.info[i].hour - 12 + "点";
						}
						ui.create.div("", "创建者：" + button.info[i].nickname, eventnode);
						//ui.create.div('','创建者：'+(button.info[i].nickname)+'<br>ID：'+button.info[i].creator,eventnode);
						ui.create.div("", "已有" + button.info[i].members.length + "人加入", eventnode);
						ui.create.div("", "时间：" + str, eventnode);
						if (button.info[i].members.includes(game.onlineKey)) {
							eventnode.classList.add("active");
						}
					} else {
						ui.create.div(".title", button.info[i].title, eventnode);
						ui.create.div("", button.info[i].content, eventnode);
						ui.create.div("", "创建者：" + button.info[i].nickname, eventnode);
					}
				}
				if (num >= 3) {
					button.input.disabled = true;
					button.input.style.opacity = 0.6;
					hoursselect.disabled = true;
					daysselect.disabled = true;
					timeconfirm.disabled = true;
				}
			};
			uiintro.refresh();
			ui.window.appendChild(uiintro);
			_status.connectEventsCallback = function () {
				if (uiintro.parentNode == ui.window) {
					uiintro.refresh();
				}
			};
		}
	}
	connectClients() {
		if (this.info) {
			var button = this;
			var layer = ui.create.div(".poplayer", ui.window);
			var uiintro = ui.create.dialog("hidden", "notouchscroll");
			this.classList.add("active");
			if (lib.config.touchscreen) {
				lib.setScroll(uiintro.contentContainer);
			}
			layer.listen(function () {
				if (this.clicked) {
					this.clicked = false;
					return;
				}
				button.classList.remove("active");
				uiintro.delete();
				this.delete();
			});
			uiintro.listen(function () {
				_status.clicked = true;
			});
			uiintro.style.zIndex = "21";
			uiintro.classList.add("popped");
			uiintro.classList.add("static");
			uiintro.classList.add("onlineclient");
			uiintro.style.width = "180px";
			uiintro.style.height = "300px";
			uiintro.style.left = "auto";
			uiintro.style.right = "20px";
			uiintro.style.top = "auto";
			uiintro.style.bottom = "75px";

			uiintro.refresh = function () {
				if (button.focused) {
					return;
				}
				uiintro.content.innerHTML = "";
				uiintro.addText("发状态");
				button.textnode = uiintro.content.lastChild.lastChild;
				uiintro.add('<input type="text" style="width:calc(100% - 10px);resize: none;border: none;border-radius: 2px;box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 0px 1px;margin-top: -2px;margin-bottom: 2px;">');
				uiintro.content.lastChild.style.paddingTop = 0;
				button.input = uiintro.content.lastChild.lastChild;
				button.input.onfocus = function () {
					button.focused = true;
				};
				button.input.onblur = function () {
					delete button.focused;
				};
				if (button.interval) {
					button.input.disabled = true;
					button.input.style.opacity = 0.6;
					if (button.intervaltext) {
						button.textnode.innerHTML = button.intervaltext;
					}
				}
				button.input.onkeydown = function (e) {
					if (e.keyCode == 13 && !this.disabled) {
						game.send("server", "status", this.value);
						this.blur();
						this.disabled = true;
						this.style.opacity = 0.6;
						button.textnode.innerHTML = "发状态(10)";
						button.intervaltext = button.textnode.innerHTML;
						var num = 10;
						var that = this;
						button.input.disabled = true;
						button.input.style.opacity = 0.6;
						this.value = "";
						button.interval = setInterval(function () {
							num--;
							if (num > 0) {
								button.textnode.innerHTML = "发状态(" + num + ")";
								button.intervaltext = button.textnode.innerHTML;
							} else {
								button.textnode.innerHTML = "发状态";
								button.input.disabled = false;
								button.input.style.opacity = "";
								clearInterval(button.interval);
								delete button.interval;
								delete button.intervaltext;
							}
						}, 1000);
					}
				};

				for (var i = 0; i < button.info.length; i++) {
					var node = ui.create.div(".menubutton.videonode.pointerdiv", uiintro.content);
					ui.create.div(".menubutton.videoavatar", node).setBackground(button.info[i][1] || "caocao", "character");
					if (button.info[i][4] == game.wsid) {
						ui.create.div(".name", '<span class="thundertext thunderauto">' + (button.info[i][0] || "无名玩家"), node);
						node.isme = true;
					} else if (button.info[i][2]) {
						ui.create.div(".name", button.info[i][0] || "无名玩家", node);
					} else {
						ui.create.div(".name", '<span style="opacity:0.6">' + (button.info[i][0] || "无名玩家"), node);
					}
					//show ID
					//ui.create.div('.videostatus',node,button.info[i][5]);
					//node.classList.add('videonodestatus');
					if (button.info[i][3]) {
						ui.create.div(".videostatus", node, get.plainText(button.info[i][3].slice(0, 80)));
						node.classList.add("videonodestatus");
					}
				}
			};

			uiintro.refresh();
			ui.window.appendChild(uiintro);
			_status.connectClientsCallback = function () {
				if (uiintro.parentNode == ui.window) {
					uiintro.refresh();
				}
			};
		}
	}
	autoskin() {
		if (!lib.config.change_skin) {
			return;
		}
		var players = game.filterPlayer();
		var change = function (player, num, callback) {
			if (num == "1") {
				ui.click.skin(player.node.avatar, player.name, callback);
			} else {
				ui.click.skin(player.node.avatar2, player.name2, callback);
			}
		};
		var finish = function () {
			if (lib.config.change_skin_auto != "off") {
				_status.skintimeout = setTimeout(ui.click.autoskin, parseInt(lib.config.change_skin_auto));
			}
		};
		var autoskin = function () {
			if (players.length) {
				var player = players.randomRemove();
				var list = [];
				if (player.name && !player.isUnseen(0)) {
					list.push("1");
				}
				if (player.name2 && !player.isUnseen(1)) {
					list.push("2");
				}
				if (list.length) {
					change(player, list.randomRemove(), function (bool) {
						if (bool) {
							finish();
						} else if (list.length) {
							change(player, list[0], function (bool) {
								if (bool) {
									finish();
								} else {
									autoskin();
								}
							});
						} else {
							autoskin();
						}
					});
				} else {
					autoskin();
				}
			} else {
				finish();
			}
		};
		autoskin();
	}
	skin(avatar, name, callback) {
		let nowSkin = "defaultSkin";
		if (name.startsWith("gz_")) {
			name = name.slice(3);
		}
		if (lib.config.skin[name]) {
			nowSkin = lib.config.skin[name][1];
		}
		var fakeavatar = avatar.cloneNode(true);
		var finish = function (bool) {
			var player = avatar.parentNode;
			if (bool) {
				fakeavatar.style.boxShadow = "none";
				player.insertBefore(fakeavatar, avatar.nextSibling);
				setTimeout(function () {
					fakeavatar.delete();
				}, 100);
			}
			if (bool && lib.config.animation && !lib.config.low_performance) {
				player.$rare();
			}
			if (callback) {
				callback(bool);
			}
		};
		const src = get.skinPath(name);
		if (!src) {
			finish(false);
			return;
		}
		const defaultFolder = src;
		// @ts-expect-error ignore
		game.getFileList(defaultFolder, (folders, files) => {
			if (files.length) {
				const list = [...files, "defaultSkin"].filter(i => i != nowSkin);
				if (list.length) {
					const skin = list.randomGet();
					if (skin === "defaultSkin") {
						delete lib.config.skin[name];
						if (lib.characterSubstitute[name]) {
							for (const nameList of lib.characterSubstitute[name]) {
								const subName = nameList[0];
								delete lib.config.skin[subName];
							}
						}
					} else {
						lib.config.skin[name] = [skin, `${defaultFolder}${skin}`];
						if (lib.characterSubstitute[name]) {
							for (const nameList of lib.characterSubstitute[name]) {
								const subName = nameList[0],
									[fold, prefix] = skin.split(".");
								lib.config.skin[subName] = [name, `${defaultFolder}/${fold}/${subName}.${prefix}`];
							}
						}
					}
					game.saveConfig("skin", lib.config.skin);
					avatar.setBackground(name, "character");
					finish(true);
				} else {
					finish(false);
				}
			} else {
				finish(false);
			}
		}, () => {
			finish(false);
		});
	}
	touchpop(forced) {
		if (lib.config.touchscreen || forced) {
			_status.touchpopping = true;
			clearTimeout(_status.touchpoppingtimeout);
			_status.touchpoppingtimeout = setTimeout(function () {
				_status.touchpopping = false;
			}, 600);
		}
	}
	exit() {
		if (game.servermode && lib.config.reconnect_info && _status.over) {
			if (!_status.roomtimeout) {
				lib.config.reconnect_info[2] = game.roomId;
				game.saveConfig("reconnect_info", lib.config.reconnect_info);
			}
			game.reload();
			return;
		} else {
			if (typeof game.roomId != "string") {
				game.saveConfig("reconnect_info");
			}
		}
		if (!ui.exit || !ui.exit.stay) {
			if (lib.config.reconnect_info) {
				lib.config.reconnect_info.length = 1;
				game.saveConfig("reconnect_info", lib.config.reconnect_info);
			}
			game.saveConfig("tmp_user_roomId", undefined, false, function () {
				game.reload();
			});
		} else {
			game.reload();
		}
	}
	shortcut(show) {
		if (show === false) {
			ui.shortcut.classList.add("hidden");
		} else {
			ui.shortcut.classList.toggle("hidden");
		}
		if (ui.shortcut.classList.contains("hidden")) {
			ui.favmode.style.display = "none";
			if (window.StatusBar && lib.config.show_statusbar_ios == "auto") {
				document.body.classList.remove("statusbar");
				window.StatusBar.hide();
			}
			ui.window.classList.remove("shortcutpaused");
		} else {
			if (lib.config.show_favmode) {
				ui.favmode.style.display = "";
			}
			if (window.StatusBar && lib.config.show_statusbar_ios == "auto") {
				document.body.classList.add("statusbar");
				window.StatusBar.overlaysWebView(true);
				window.StatusBar.backgroundColorByName("black");
				window.StatusBar.show();
			}
			if (_status.auto) {
				ui.shortcut.autobutton.classList.add("active");
			} else {
				ui.shortcut.autobutton.classList.remove("active");
			}
			ui.window.classList.add("shortcutpaused");
		}
	}
	favouriteCharacter(e) {
		if (typeof this.link == "string") {
			if (this.innerHTML == "添加收藏") {
				this.innerHTML = "移除收藏";
				lib.config.favouriteCharacter.add(this.link);
			} else {
				this.innerHTML = "添加收藏";
				lib.config.favouriteCharacter.remove(this.link);
			}
			if (ui.favouriteCharacter) {
				if (lib.config.favouriteCharacter.includes(this.link)) {
					for (var i = 0; i < ui.favouriteCharacter.childElementCount; i++) {
						if (ui.favouriteCharacter.childNodes[i].link == this.link) {
							break;
						}
					}
					if (i == ui.favouriteCharacter.childElementCount) {
						ui.create
							.button(this.link, "character", ui.favouriteCharacter)
							.listen(function (e) {
								this._banning = "offline";
								ui.click.touchpop();
								ui.click.intro.call(this, e);
								_status.clicked = false;
								delete this._banning;
							})
							.classList.add("noclick");
					}
				} else {
					for (var i = 0; i < ui.favouriteCharacter.childElementCount; i++) {
						if (ui.favouriteCharacter.childNodes[i].link == this.link) {
							ui.favouriteCharacter.childNodes[i].remove();
							break;
						}
					}
				}
				var shownode = false;
				for (var i = 0; i < lib.config.favouriteCharacter.length; i++) {
					var favname = lib.config.favouriteCharacter[i];
					if (lib.character[favname]) {
						shownode = true;
						break;
					}
				}
				if (shownode) {
					ui.favouriteCharacter.node.style.display = "";
				} else {
					ui.favouriteCharacter.node.style.display = "none";
				}
			}
			game.saveConfig("favouriteCharacter", lib.config.favouriteCharacter);
		}
		e.stopPropagation();
	}
	buttonnameenter() {
		if (this.buttonscrollinterval) {
			clearInterval(this.buttonscrollinterval);
		}
		var node = this.node.name;
		if (node.offsetHeight < node.scrollHeight) {
			var that = this;
			var num = 40;
			that.buttonscrollinterval = setInterval(function () {
				if (node.scrollTop + node.offsetHeight >= node.scrollHeight) {
					clearInterval(that.buttonscrollinterval);
					delete that.buttonscrollinterval;
				} else {
					if (num > 0) {
						num--;
					} else {
						node.scrollTop += 2;
					}
				}
			}, 16);
		}
	}
	buttonnameleave() {
		if (this.buttonscrollinterval) {
			clearInterval(this.buttonscrollinterval);
		}
		var node = this.node.name;
		if (node.offsetHeight < node.scrollHeight) {
			var that = this;
			that.buttonscrollinterval = setInterval(function () {
				if (node.scrollTop == 0) {
					clearInterval(that.buttonscrollinterval);
					delete that.buttonscrollinterval;
				} else {
					node.scrollTop -= 2;
				}
			}, 16);
		}
	}
	dragtouchdialog(e) {
		if (e.touches.length > 1 && !this.classList.contains("popped") && !this.classList.contains("fixed")) {
			_status.draggingtouchdialog = this;
			this._dragorigin = {
				clientX: e.touches[0].clientX,
				clientY: e.touches[0].clientY,
			};
			if (!this._dragtransform) {
				this._dragtransform = [0, 0];
			}
			this._dragorigintransform = this._dragtransform.slice(0);
			e.preventDefault();
			e.stopPropagation();
		}
	}
	identity(e) {
		if (_status.dragged) {
			return;
		}
		_status.clicked = true;
		if (!game.getIdentityList) {
			return;
		}
		if (_status.video) {
			return;
		}
		if (this.parentNode.forceShown) {
			return;
		}
		if (!_status.connectMode && this.parentNode.ai.stratagem_camouflage && get.config("nei_auto_mark_camouflage") && game.me.identity == "nei") {
			return;
		}
		if (_status.clickingidentity) {
			for (var i = 0; i < _status.clickingidentity[1].length; i++) {
				_status.clickingidentity[1][i].delete();
				_status.clickingidentity[1][i].style.transform = "";
			}
			if (_status.clickingidentity[0] == this.parentNode) {
				delete _status.clickingidentity;
				return;
			}
		}
		var list = game.getIdentityList(this.parentNode);
		if (!list) {
			return;
		}
		if (lib.config.mark_identity_style == "click") {
			var list2 = [];
			for (var i in list) {
				list2.push(i);
			}
			list2.push(list2[0]);
			for (var i = 0; i < list2.length; i++) {
				if (this.firstChild.innerHTML == list[list2[i]]) {
					this.firstChild.innerHTML = list[list2[i + 1]];
					this.dataset.color = list2[i + 1];
					break;
				}
			}
		} else {
			if (get.mode() == "guozhan") {
				list = { wei: "魏", shu: "蜀", wu: "吴", qun: "群", jin: "晋", ye: "野" };
				if (_status.forceKey) {
					list.key = "键";
				}
				for (let i in list) {
					if (_status.bannedGroup?.slice(6) == i) {
						delete list[i];
					}
				}
			}
			var list2 = get.copy(list);
			if (game.getIdentityList2) {
				game.getIdentityList2(list2);
			}
			var rect = this.parentNode.getBoundingClientRect();
			this._customintro = function (uiintro) {
				if (get.mode() == "guozhan") {
					uiintro.clickintro = true;
				} else {
					uiintro.touchclose = true;
				}
				// if(lib.config.theme!='woodden'){
				uiintro.classList.add("woodbg");
				// }
				if (get.is.phoneLayout()) {
					uiintro.style.width = "100px";
				} else {
					uiintro.style.width = "85px";
				}
				var source = this.parentNode;
				for (var i in list) {
					var node = ui.create.div();
					node.classList.add("guessidentity");
					node.classList.add("pointerdiv");
					ui.create.div(".menubutton.large", list2[i], node);
					if (!get.is.phoneLayout()) {
						node.firstChild.style.fontSize = "24px";
						node.firstChild.style.lineHeight = "24px";
					}
					if (get.mode() == "guozhan") {
						if (source._guozhanguess) {
							if (!source._guozhanguess.includes(i)) {
								node.classList.add("transparent");
							}
						}
						node._source = source;
						node.listen(ui.click.identitycircle);
					} else {
						node.listen(function () {
							var info = this.link;
							info[0].firstChild.innerHTML = info[1];
							info[0].dataset.color = info[2];
							_status.clicked = false;
						});
					}

					node.link = [this, list[i], i];
					uiintro.add(node);
				}
			};
			ui.click.touchpop();
			ui.click.intro.call(this, {
				clientX: rect.left + rect.width,
				clientY: rect.top,
			});
			// var nodes=[];
			// _status.clickingidentity=[this.parentNode,nodes];
			// var num=1;
			// var dy=30;
			// if(get.is.phoneLayout()){
			// 	dy=45;
			// }
			// for(var i in list){
			// 	if(this.firstChild.innerHTML!=list[i]){
			// 		var node=ui.create.div('.identity.hidden.pointerdiv',this.parentNode,ui.click.identity2);
			// 		ui.create.div(node).innerHTML=list[i];
			// 		node.dataset.color=i;
			// 		ui.refresh(node);
			// 		node.show();
			// 		var transstr='translateY('+((num++)*dy)+'px)';
			// 		if(get.is.phoneLayout()){
			// 			transstr+=' scale(1.3)';
			// 		}
			// 		if(get.is.newLayout()&&this.parentNode.classList.contains('linked')){
			// 			transstr+=' rotate(90deg)';
			// 		}
			// 		node.style.transform=transstr;
			// 		nodes.push(node);
			// 	}
			// }
		}
	}
	identity2() {
		if (_status.clickingidentity) {
			_status.clicked = true;
			var player = _status.clickingidentity[0];
			var nodes = _status.clickingidentity[1];
			player.node.identity.dataset.color = this.dataset.color;
			player.node.identity.firstChild.innerHTML = this.firstChild.innerHTML;
			for (var i = 0; i < nodes.length; i++) {
				nodes[i].delete();
				nodes[i].style.transform = "";
			}
			delete _status.clickingidentity;
		}
	}
	roundmenu() {
		game.closeConnectMenu();
		switch (lib.config.round_menu_func) {
			case "system":
				game.closePopped();
				ui.system1.classList.add("shown");
				ui.system2.classList.add("shown");
				game.closeMenu();
				ui.click.shortcut();
				break;
			case "menu":
				if (ui.click.configMenu) {
					game.closePopped();
					game.pause2();
					ui.click.configMenu();
					ui.system1.classList.remove("shown");
					ui.system2.classList.remove("shown");
				}
				break;
			case "pause":
				ui.click.pause();
				break;
			case "auto":
				ui.click.auto();
				break;
		}
		_status.clicked = true;
	}
	pausehistory() {
		if (!lib.config.auto_popped_history) {
			return;
		}
		if (!ui.sidebar.childNodes.length) {
			return;
		}
		var uiintro = ui.create.dialog("hidden");
		uiintro.style.maxHeight = "400px";
		uiintro.add(ui.sidebar);
		return uiintro;
	}
	pauseconfig() {
		if (!lib.config.auto_popped_config) {
			return;
		}
		if (get.is.phoneLayout()) {
			return;
		}
		var uiintro = ui.create.dialog("hidden");
		uiintro.listen(function (e) {
			e.stopPropagation();
		});

		var rows = Math.floor(lib.config.all.mode.length / 3);
		uiintro.type = "config";
		var modes = lib.config.modeorder || lib.config.all.mode.slice(0);
		for (var i = 0; i < modes.length; i++) {
			if (!lib.config.all.mode.includes(modes[i])) {
				modes.splice(i--, 1);
			}
		}
		for (var k = 0; k < rows; k++) {
			var node = ui.create.div(".newgame.pointernode");
			for (var i = 0; i < 3 && i + k * 3 < modes.length; i++) {
				var thismode = modes[i + k * 3];
				var div = ui.create.div(thismode == (_status.sourcemode || lib.config.mode) ? ".underlinenode.on" : ".underlinenode", node);
				div.innerHTML = lib.translate[thismode];
				div.link = thismode;
				div.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
					game.saveConfig("mode", this.link);
					localStorage.setItem(lib.configprefix + "directstart", true);
					game.reload();
				});
			}
			uiintro.add(node);
		}

		return uiintro;
	}
	cardPileButton() {
		var uiintro = ui.create.dialog("hidden");
		uiintro.listen(function (e) {
			e.stopPropagation();
		});
		var num;
		if (game.online) {
			num = _status.cardPileNum || 0;
		} else {
			num = ui.cardPile.childNodes.length;
		}
		uiintro.add('剩余 <span style="font-family:' + "xinwei" + '">' + num);

		if (_status.connectMode) {
			return uiintro;
		}
		uiintro.add('<div class="text center">轮数 <span style="font-family:xinwei">' + game.roundNumber + '</span>&nbsp;&nbsp;&nbsp;&nbsp;洗牌 <span style="font-family:xinwei">' + game.shuffleNumber + "</div>");
		uiintro.add('<div class="text center">弃牌堆</div>');
		if (ui.discardPile.childNodes.length) {
			var list = [];
			for (var i = 0; i < ui.discardPile.childNodes.length; i++) {
				list.unshift(ui.discardPile.childNodes[i]);
			}
			uiintro.addSmall([list, "card"]);
		} else {
			uiintro.add('<div class="text center" style="padding-bottom:3px">无</div>');
		}
		return uiintro;
	}
	commonCardPileButton() {
		var uiintro = ui.create.dialog("hidden");
		uiintro.listen(function (e) {
			e.stopPropagation();
		});
		for (const [key, value] of lib.commonArea) {
			const cards = _status[value.areaStatusName];
			uiintro.add(`<div class="text center">${value.translate || get.translation(key)} (${get.cnNumber(cards?.length ?? 0)}张)</div>`);
			if (get.itemtype(cards) == "cards") {
				uiintro.addSmall([cards, "card"]);
			}
			uiintro.add(ui.create.div(".placeholder"));
		}
		return uiintro;
	}
	chat() {
		ui.system1.classList.add("shown");
		ui.system2.classList.add("shown");

		var uiintro = ui.create.dialog("hidden");
		uiintro.listen(function (e) {
			e.stopPropagation();
		});

		var list = ui.create.div(".caption");
		if (get.is.phoneLayout()) {
			list.style.maxHeight = "110px";
		} else {
			list.style.maxHeight = "220px";
		}
		list.style.overflow = "scroll";
		lib.setScroll(list);
		uiintro.contentContainer.style.overflow = "hidden";

		var input;
		var addEntry = function (info, clear) {
			if (list._chatempty) {
				list.innerHTML = "";
				delete list._chatempty;
			}
			var node = ui.create.div(".text.chat");
			node.innerHTML = info[0] + ": " + info[1];
			list.appendChild(node);
			list.scrollTop = list.scrollHeight;
			uiintro.style.height = uiintro.content.scrollHeight + "px";
		};
		_status.addChatEntry = addEntry;
		_status.addChatEntry._origin = uiintro;
		if (lib.chatHistory.length) {
			for (var i = 0; i < lib.chatHistory.length; i++) {
				addEntry(lib.chatHistory[i]);
			}
		} else {
			list._chatempty = true;
			list.appendChild(ui.create.div(".text.center", "无聊天记录"));
		}
		uiintro.add(list);
		uiintro.style.height = uiintro.content.offsetHeight + "px";
		list.scrollTop = list.scrollHeight;

		if (!_status.chatValue) {
			_status.chatValue = "";
		}
		var node = uiintro.add('<input type="text" value="' + _status.chatValue + '">');
		node.style.paddingTop = 0;
		node.style.marginBottom = "16px";
		input = node.firstChild;
		input.style.width = "calc(100% - 20px)";
		input.onchange = function () {
			_status.chatValue = input.value;
		};
		input.onkeydown = function (e) {
			if (e.keyCode == 13 && input.value) {
				var player = game.me;
				var str = input.value;
				if (!player) {
					if (game.connectPlayers) {
						if (game.online) {
							for (var i = 0; i < game.connectPlayers.length; i++) {
								if (game.connectPlayers[i].playerid == game.onlineID) {
									player = game.connectPlayers[i];
									break;
								}
							}
						} else {
							player = game.connectPlayers[0];
						}
					}
				}
				if (!player) {
					return;
				}
				if (get.is.banWords(input.value)) {
					player.say(input.value);
					input.value = "";
					_status.chatValue = "";
				} else {
					if (game.online) {
						game.send("chat", game.onlineID, str);
					} else {
						player.chat(str);
					}
					input.value = "";
					_status.chatValue = "";
				}
			}
			e.stopPropagation();
		};
		uiintro._onopen = function () {
			input.focus();
			list.scrollTop = list.scrollHeight;
		};
		uiintro._heightfixed = true;
		var emotionTitle = ui.create.div(".text.center", "聊天表情", function () {
			if (emotionTitle.innerHTML == "快捷语音") {
				emotionTitle.innerHTML = "聊天表情";
				list2.remove();
				list3.remove();
				uiintro.add(list1);
				while (list2.childNodes.length) {
					list2.firstChild.remove();
				}
			} else {
				emotionTitle.innerHTML = "快捷语音";
				list1.remove();
				list2.remove();
				uiintro.add(list3);
			}
		});
		uiintro.add(emotionTitle);
		var list1 = ui.create.div("");
		if (get.is.phoneLayout()) {
			list1.style.height = "110px";
		} else {
			list1.style.height = "150px";
		}
		list1.style.overflow = "scroll";
		lib.setScroll(list1);
		uiintro.add(list1);
		uiintro.style.height = uiintro.content.scrollHeight + "px";
		var list2 = ui.create.div("");
		if (get.is.phoneLayout()) {
			list2.style.height = "110px";
		} else {
			list2.style.height = "150px";
		}
		list2.style.overflow = "scroll";
		lib.setScroll(list2);
		//uiintro.add(list2);
		for (var i in lib.emotionList) {
			var emotionPack = ui.create.div(".card.fullskin", '<img src="' + lib.assetURL + "image/emotion/" + i + '/1.gif" width="50" height="50">', function () {
				emotionTitle.innerHTML = get.translation(this.pack);
				for (var j = 1; j <= lib.emotionList[this.pack]; j++) {
					var emotionButton = ui.create.div(".card.fullskin", '<img src="' + lib.assetURL + "image/emotion/" + this.pack + "/" + j + '.gif" width="50" height="50">', function () {
						var player = game.me;
						if (!player) {
							if (game.connectPlayers) {
								if (game.online) {
									for (var i = 0; i < game.connectPlayers.length; i++) {
										if (game.connectPlayers[i].playerid == game.onlineID) {
											player = game.connectPlayers[i];
											break;
										}
									}
								} else {
									player = game.connectPlayers[0];
								}
							}
						}
						if (!player) {
							return;
						}
						if (game.online) {
							game.send("emotion", game.onlineID, this.pack, this.emotionID);
						} else {
							player.emotion(this.pack, this.emotionID);
						}
					});
					emotionButton.emotionID = j;
					emotionButton.pack = this.pack;
					emotionButton.style.height = "50px";
					emotionButton.style.width = "50px";
					list2.appendChild(emotionButton);
				}
				list1.remove();
				uiintro.add(list2);
			});
			emotionPack.pack = i;
			emotionPack.style.height = "50px";
			emotionPack.style.width = "50px";
			list1.appendChild(emotionPack);
		}
		list1.scrollTop = list1.scrollHeight;
		uiintro.style.height = uiintro.content.scrollHeight + "px";
		var list3 = ui.create.div(".caption");
		if (get.is.phoneLayout()) {
			list3.style.height = "110px";
		} else {
			list3.style.height = "150px";
		}
		list3.style.overflow = "scroll";
		lib.setScroll(list3);
		for (var i = 0; i < lib.quickVoice.length; i++) {
			var node = ui.create.div(".text.chat", function () {
				var player = game.me;
				var str = this.innerHTML;
				if (!player) {
					if (game.connectPlayers) {
						if (game.online) {
							for (var i = 0; i < game.connectPlayers.length; i++) {
								if (game.connectPlayers[i].playerid == game.onlineID) {
									player = game.connectPlayers[i];
									break;
								}
							}
						} else {
							player = game.connectPlayers[0];
						}
					}
				}
				if (!player) {
					return;
				}
				if (game.online) {
					game.send("chat", game.onlineID, str);
				} else {
					player.chat(str);
				}
			});
			node.innerHTML = lib.quickVoice[i];
			list3.appendChild(node);
		}
		list3.scrollTop = list1.scrollHeight;
		return uiintro;
	}
	volumn() {
		var uiintro = ui.create.dialog("hidden");
		uiintro.listen(function (e) {
			e.stopPropagation();
		});
		uiintro.add("背景音乐");
		var vol1 = ui.create.div(".volumn");
		uiintro.add(vol1);
		for (var i = 0; i < 8; i++) {
			var span = document.createElement("span");
			span.link = i + 1;
			span.addEventListener(lib.config.touchscreen ? "touchend" : "click", ui.click.volumn_background);
			if (i < lib.config.volumn_background) {
				span.innerHTML = "●";
			} else {
				span.innerHTML = "○";
			}
			vol1.appendChild(span);
		}
		uiintro.add("游戏音效");

		var vol2 = ui.create.div(".volumn");
		uiintro.add(vol2);
		for (var i = 0; i < 8; i++) {
			var span = document.createElement("span");
			span.link = i + 1;
			span.addEventListener(lib.config.touchscreen ? "touchend" : "click", ui.click.volumn_audio);
			if (i < lib.config.volumn_audio) {
				span.innerHTML = "●";
			} else {
				span.innerHTML = "○";
			}
			vol2.appendChild(span);
		}
		uiintro.add(ui.create.div(".placeholder"));
		return uiintro;
	}
	volumn_background(e) {
		if (_status.dragged) {
			return;
		}
		var volume = this.link;
		if (volume === 1 && lib.config.volumn_background === 1) {
			volume = 0;
		}
		game.saveConfig("volumn_background", volume);
		ui.backgroundMusic.volume = volume / 8;
		for (var i = 0; i < 8; i++) {
			if (i < lib.config.volumn_background) {
				this.parentNode.childNodes[i].innerHTML = "●";
			} else {
				this.parentNode.childNodes[i].innerHTML = "○";
			}
		}
		e.stopPropagation();
	}
	volumn_audio(e) {
		if (_status.dragged) {
			return;
		}
		var volume = this.link;
		if (volume === 1 && lib.config.volumn_audio === 1) {
			volume = 0;
		}
		game.saveConfig("volumn_audio", volume);
		for (var i = 0; i < 8; i++) {
			if (i < lib.config.volumn_audio) {
				this.parentNode.childNodes[i].innerHTML = "●";
			} else {
				this.parentNode.childNodes[i].innerHTML = "○";
			}
		}
		e.stopPropagation();
	}
	hoverpopped() {
		if (this._uiintro) {
			return;
		}
		if (!this._poppedfunc) {
			return;
		}
		ui.click.touchpop(this.forceclick);
		var uiintro = this._poppedfunc();
		if (!uiintro) {
			return;
		}
		if (ui.currentpopped && ui.currentpopped._uiintro) {
			ui.currentpopped._uiintro.delete();
			delete ui.currentpopped._uiintro;
		}
		ui.currentpopped = this;
		uiintro.classList.add("popped");
		uiintro.classList.add("hoverdialog");
		uiintro.classList.add("static");
		this._uiintro = uiintro;

		ui.window.appendChild(uiintro);
		var width = this._poppedwidth || 330;
		uiintro.style.width = width + "px";
		if (get.is.phoneLayout()) {
			width *= 1.3;
		}

		if (uiintro._heightfixed) {
			uiintro.style.height = uiintro.content.scrollHeight + "px";
		} else {
			var height = this._poppedheight || uiintro.content.scrollHeight;
			var height2 = ui.window.offsetHeight - 260;
			if (get.is.phoneLayout()) {
				height2 = (ui.window.offsetHeight - 80) / 1.3;
			}
			uiintro.style.height = Math.min(height2, height) + "px";
		}
		if (get.is.phoneLayout()) {
			uiintro.style.top = "70px";
		} else {
			uiintro.style.top = "50px";
		}
		var left = this.parentNode.offsetLeft + this.offsetLeft + this.offsetWidth / 2 - width / 2;
		if (left < 10) {
			left = 10;
		} else if (left + width > ui.window.offsetWidth - 10) {
			left = ui.window.offsetWidth - width - 10;
		}
		uiintro.style.left = left + "px";
		uiintro._poppedorigin = this;
		if (!lib.config.touchscreen) {
			uiintro.addEventListener("mouseleave", ui.click.leavehoverpopped);
		}
		ui.click.shortcut(false);
		if (uiintro._onopen) {
			uiintro._onopen();
		}
		if (this._paused2 && !lib.config.touchscreen) {
			game.pause2();
			uiintro.classList.add("static");
			var layer = ui.create.div(".poplayer", ui.window);
			var clicklayer = function (e) {
				uiintro.delete();
				layer.remove();
				game.resume2();
				e.stopPropagation();
				return false;
			};
			uiintro.style.zIndex = 21;
			layer.onclick = clicklayer;
			layer.oncontextmenu = clicklayer;
			uiintro.addEventListener("mouseleave", clicklayer);
			uiintro.addEventListener("click", clicklayer);
		}
	}
	hoverpopped_leave() {
		this._poppedalready = false;
	}
	leavehoverpopped() {
		if (_status.dragged) {
			return;
		}
		if (this.classList.contains("noleave")) {
			return;
		}
		this.delete();
		var button = this._poppedorigin;

		var uiintro = this;
		setTimeout(function () {
			if (button._uiintro == uiintro) {
				delete button._uiintro;
			}
		}, 500);
	}
	dierevive() {
		if (game.me.isDead()) {
			game.me.revive(Math.max(1, game.me.maxHp));
			game.me.draw(2);
		} else {
			if (ui.revive) {
				ui.revive.close();
				delete ui.revive;
			}
		}
	}
	dieswap() {
		if (game.me.isDead()) {
			_status.clicked = true;
			var i, translation, intro, str;
			if (ui.intro) {
				ui.intro.close();
				if (ui.intro.source == "dieswap") {
					delete ui.intro;
					ui.control.show();
					game.resume2();
					return;
				}
			}
			game.pause2();
			ui.control.hide();
			ui.intro = ui.create.dialog();
			ui.intro.source = "dieswap";

			var players = [];
			for (var i = 0; i < game.players.length; i++) {
				if (game.players[i].isAlive()) {
					players.push(game.players[i]);
				}
			}
			ui.intro.add(players, true);
			var buttons = ui.intro.querySelectorAll(".button");
			for (var i = 0; i < buttons.length; i++) {
				buttons[i].addEventListener(lib.config.touchscreen ? "touchend" : "click", ui.click.dieswap2);
			}
		} else {
			if (ui.swap) {
				ui.swap.close();
				delete ui.swap;
			}
		}
	}
	dieswap2() {
		if (_status.dragged) {
			return;
		}
		game.swapPlayer(this.link);
	}
	touchconfirm() {
		_status.touchconfirmed = true;
		document.removeEventListener("touchstart", ui.click.touchconfirm);
	}
	windowtouchstart(e) {
		if (window.inSplash) {
			return;
		}
		if (e.touches[0] && lib.config.swipe && e.touches.length < 2) {
			_status._swipeorigin = {
				clientX: e.touches[0].clientX,
				clientY: e.touches[0].clientY,
				time: get.utc(),
			};
		}
		// if(window.ForceTouch&&!_status.paused2&&!_status.forcetouchinterval&&lib.config.enable_pressure){
		// 	_status.forcetouchinterval=setInterval(ui.click.forcetouch,30);
		// }
	}
	windowtouchmove(e) {
		e.preventDefault();
		if (window.inSplash) {
			return;
		}
		if (_status.draggingroundmenu) {
			delete _status._swipeorigin;
			if (ui.roundmenu._dragorigin && ui.roundmenu._dragtransform && e.touches.length) {
				var translate = ui.roundmenu._dragtransform.slice(0);
				var dx = e.touches[0].clientX / game.documentZoom - ui.roundmenu._dragorigin.clientX / game.documentZoom;
				var dy = e.touches[0].clientY / game.documentZoom - ui.roundmenu._dragorigin.clientY / game.documentZoom;
				translate[0] += dx;
				translate[1] += dy;
				if (dx * dx + dy * dy > 100) {
					if (ui.roundmenu._resetTimeout) {
						clearTimeout(ui.roundmenu._resetTimeout);
						delete ui.roundmenu._resetTimeout;
					}
				}
				ui.roundmenu._dragtouches = e.touches[0];
				ui.click.checkroundtranslate(translate);
			}
			_status.clicked = true;
		} else if (_status.draggingtouchdialog) {
			delete _status._swipeorigin;
			if (_status.draggingtouchdialog._dragorigin && _status.draggingtouchdialog._dragtransform && e.touches.length) {
				var translate = _status.draggingtouchdialog._dragtransform.slice(0);
				var dx = e.touches[0].clientX / game.documentZoom - _status.draggingtouchdialog._dragorigin.clientX / game.documentZoom;
				var dy = e.touches[0].clientY / game.documentZoom - _status.draggingtouchdialog._dragorigin.clientY / game.documentZoom;
				translate[0] += dx;
				translate[1] += dy;
				_status.draggingtouchdialog._dragtouches = e.touches[0];
				ui.click.checkdialogtranslate(translate, _status.draggingtouchdialog);
			}
			_status.clicked = true;
		} else if (_status._swipeorigin && e.touches[0]) {
			_status._swipeorigin.touches = e.touches[0];
		}

		if (_status.mousedragging && e.touches.length) {
			e.preventDefault();
			var item = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
			if (game.chess && ui.selected.cards.length) {
				var itemtype = get.itemtype(item);
				if (itemtype != "card" && itemtype != "button") {
					var ex = e.touches[0].clientX / game.documentZoom - ui.arena.offsetLeft;
					var ey = e.touches[0].clientY / game.documentZoom - ui.arena.offsetTop;
					for (var i = 0; i < game.players.length; i++) {
						var left = -ui.chessContainer.chessLeft + ui.chess.offsetLeft + game.players[i].getLeft();
						var top = -ui.chessContainer.chessTop + ui.chess.offsetTop + game.players[i].getTop();
						var width = game.players[i].offsetWidth;
						var height = game.players[i].offsetHeight;
						if (ex > left && ex < left + width && ey > top && ey < top + height) {
							item = game.players[i];
							break;
						}
					}
				}
			}
			while (item) {
				if (lib.config.enable_touchdragline && _status.mouseleft && !game.chess) {
					ui.canvas.width = ui.arena.offsetWidth;
					ui.canvas.height = ui.arena.offsetHeight;
					var ctx = ui.ctx;
					ctx.shadowBlur = 5;
					ctx.shadowColor = "rgba(0,0,0,0.3)";
					ctx.strokeStyle = "white";
					ctx.lineWidth = 3;
					ctx.setLineDash([8, 2]);

					ctx.beginPath();

					ctx.moveTo(_status.mousedragging.clientX / game.documentZoom - ui.arena.offsetLeft, _status.mousedragging.clientY / game.documentZoom - ui.arena.offsetTop);

					if (_status.multitarget) {
						for (var i = 0; i < _status.lastdragchange.length; i++) {
							var exy = _status.lastdragchange[i]._lastdragchange;
							ctx.lineTo(exy[0], exy[1]);
						}
					}
					if (!_status.selectionfull) {
						ctx.lineTo(e.touches[0].clientX / game.documentZoom - ui.arena.offsetLeft, e.touches[0].clientY / game.documentZoom - ui.arena.offsetTop);
					}
					ctx.stroke();
					if (!_status.multitarget) {
						for (var i = 0; i < _status.lastdragchange.length; i++) {
							ctx.moveTo(_status.mousedragging.clientX / game.documentZoom - ui.arena.offsetLeft, _status.mousedragging.clientY / game.documentZoom - ui.arena.offsetTop);
							var exy = _status.lastdragchange[i]._lastdragchange;
							ctx.lineTo(exy[0], exy[1]);
							ctx.stroke();
						}
					}
				}

				if (item == _status.mousedragorigin) {
					if (_status.mouseleft) {
						_status.mousedragging = null;
						_status.mousedragorigin = null;
						_status.clicked = false;
						game.uncheck();
						game.check();
						_status.clicked = true;
					}
					return;
				}
				var itemtype = get.itemtype(item);
				if (itemtype == "card" || itemtype == "button" || itemtype == "player") {
					_status.mouseleft = true;
					if (ui.selected.cards.length) {
						ui.selected.cards[0].updateTransform(true, 100);
					}
					var ex = e.touches[0].clientX / game.documentZoom - ui.arena.offsetLeft;
					var ey = e.touches[0].clientY / game.documentZoom - ui.arena.offsetTop;
					var exx = ex,
						eyy = ey;
					if (game.chess) {
						ex -= -ui.chessContainer.chessLeft + ui.chess.offsetLeft;
						ey -= -ui.chessContainer.chessTop + ui.chess.offsetTop;
					}
					if (itemtype != "player" || game.chess || (ex > item.offsetLeft && ex < item.offsetLeft + item.offsetWidth && ey > item.offsetTop && ey < item.offsetTop + item.offsetHeight)) {
						var targetfixed = false;
						if (itemtype == "player") {
							if (get.select(_status.event.selectTarget)[1] <= -1) {
								targetfixed = true;
							}
						}
						if (!targetfixed && item.classList.contains("selectable") && _status.dragstatuschanged != item) {
							_status.mouseleft = true;
							_status.dragstatuschanged = item;
							_status.clicked = false;
							_status.dragged = false;
							var notbefore = itemtype == "player" && !item.classList.contains("selected");
							ui.click[itemtype].call(item);
							if (item.classList.contains("selected")) {
								if (notbefore) {
									_status.lastdragchange.push(item);
									item._lastdragchange = [exx, eyy];
									if (lib.falseitem) {
										var from = [_status.mousedragging.clientX / game.documentZoom - ui.arena.offsetLeft, _status.mousedragging.clientY / game.documentZoom - ui.arena.offsetTop];
										var to = [exx, eyy];
										var node = ui.create.div(".linexy.hidden");
										node.style.left = from[0] + "px";
										node.style.top = from[1] + "px";
										node.style.transitionDuration = "0.3s";
										node.style.backgroundColor = "white";
										var dy = to[1] - from[1];
										var dx = to[0] - from[0];
										var deg = (Math.atan(Math.abs(dy) / Math.abs(dx)) / Math.PI) * 180;
										if (dx >= 0) {
											if (dy <= 0) {
												deg += 90;
											} else {
												deg = 90 - deg;
											}
										} else {
											if (dy <= 0) {
												deg = 270 - deg;
											} else {
												deg += 270;
											}
										}
										node.style.transform = "rotate(" + -deg + "deg) scaleY(0)";
										node.style.height = get.xyDistance(from, to) + "px";
										if (game.chess) {
											ui.chess.appendChild(node);
										} else {
											ui.arena.appendChild(node);
										}
										ui.refresh(node);
										node.show();
										node.style.transform = "rotate(" + -deg + "deg) scaleY(1)";
										ui.touchlines.push(node);
										node._origin = item;
									}
								}
							} else {
								_status.lastdragchange.remove(item);
								for (var i = 0; i < ui.touchlines.length; i++) {
									if (ui.touchlines[i]._origin == item) {
										ui.touchlines[i].delete();
										ui.touchlines.splice(i--, 1);
									}
								}
							}
							_status.selectionfull = true;
							if (_status.event.filterButton && ui.selected.buttons.length < get.select(_status.event.selectButton)[1]) {
								_status.selectionfull = false;
							} else if (_status.event.filterCard && ui.selected.cards.length < get.select(_status.event.selectCard)[1]) {
								_status.selectionfull = false;
							} else if (_status.event.filterTarget && ui.selected.targets.length < get.select(_status.event.selectTarget)[1]) {
								_status.selectionfull = false;
							}
						}
					}
					return;
				}
				item = item.parentNode;
			}
			_status.mouseleft = true;
			_status.dragstatuschanged = null;
		}
	}
	windowtouchend(e) {
		delete _status.force;
		// if(_status.forcetouchinterval){
		// 	clearInterval(_status.forcetouchinterval);
		// 	delete _status.forcetouchinterval;
		// }
		if (window.inSplash) {
			return;
		}
		if (e.touches.length == 1 && !_status.dragged && !_status.draggingtouchdialog) {
			ui.click.pause();
		}
		if (_status.draggingroundmenu) {
			delete _status._swipeorigin;
			if (ui.roundmenu._resetTimeout) {
				clearTimeout(ui.roundmenu._resetTimeout);
				delete ui.roundmenu._resetTimeout;
			}
			var translate;
			if (ui.roundmenu._dragorigin && ui.roundmenu._dragtransform && ui.roundmenu._dragtouches) {
				var dx = ui.roundmenu._dragtouches.clientX / game.documentZoom - ui.roundmenu._dragorigin.clientX / game.documentZoom;
				var dy = ui.roundmenu._dragtouches.clientY / game.documentZoom - ui.roundmenu._dragorigin.clientY / game.documentZoom;
				if (dx * dx + dy * dy < 1000) {
					ui.click.roundmenu();
					ui.roundmenu._dragtransform = ui.roundmenu._dragorigintransform;
					translate = ui.roundmenu._dragtransform;
					ui.roundmenu.style.transform = "translate(" + translate[0] + "px," + translate[1] + "px)";
				} else {
					translate = ui.roundmenu._dragtransform;
					translate[0] += dx;
					translate[1] += dy;
					ui.click.checkroundtranslate();
				}
				delete ui.roundmenu._dragorigin;
			} else {
				ui.click.roundmenu();
			}
			_status.clicked = false;
			game.saveConfig("roundmenu_transform", translate);
			delete _status.draggingroundmenu;
		} else if (_status.draggingtouchdialog) {
			delete _status._swipeorigin;
			var translate;
			if (_status.draggingtouchdialog._dragorigin && _status.draggingtouchdialog._dragtransform && _status.draggingtouchdialog._dragtouches) {
				var dx = _status.draggingtouchdialog._dragtouches.clientX / game.documentZoom - _status.draggingtouchdialog._dragorigin.clientX / game.documentZoom;
				var dy = _status.draggingtouchdialog._dragtouches.clientY / game.documentZoom - _status.draggingtouchdialog._dragorigin.clientY / game.documentZoom;
				translate = _status.draggingtouchdialog._dragtransform;
				translate[0] += dx;
				translate[1] += dy;
				ui.click.checkdialogtranslate(null, _status.draggingtouchdialog);

				delete _status.draggingtouchdialog._dragorigin;
			}
			_status.clicked = false;
			game.saveConfig("dialog_transform", translate);
			delete _status.draggingtouchdialog;
			_status.justdragged = true;
			setTimeout(function () {
				_status.justdragged = false;
			}, 500);
		} else if (_status._swipeorigin && !_status.paused2 && !_status.mousedragging && _status._swipeorigin.touches && !_status.filterCharacter) {
			if (get.utc() - _status._swipeorigin.time < 500) {
				var dx = _status._swipeorigin.touches.clientX / game.documentZoom - _status._swipeorigin.clientX / game.documentZoom;
				var dy = _status._swipeorigin.touches.clientY / game.documentZoom - _status._swipeorigin.clientY / game.documentZoom;
				var goswipe = function (action) {
					game.closeConnectMenu();
					switch (action) {
						case "system":
							game.closePopped();
							ui.system1.classList.add("shown");
							ui.system2.classList.add("shown");
							game.closeMenu();
							ui.click.shortcut();
							break;
						case "menu":
							if (ui.click.configMenu) {
								game.closePopped();
								game.pause2();
								ui.click.configMenu();
								ui.system1.classList.remove("shown");
								ui.system2.classList.remove("shown");
							}
							break;
						case "pause":
							ui.click.pause();
							break;
						case "auto":
							ui.click.auto();
							break;
						case "chat":
							game.closeMenu();
							if (ui.chatButton) {
								ui.click.hoverpopped.call(ui.chatButton);
							}
							break;
					}
				};
				if (Math.abs(dx) < 100) {
					if (dy < -200) {
						goswipe(lib.config.swipe_up);
					} else if (dy > 200) {
						goswipe(lib.config.swipe_down);
					}
				} else if (Math.abs(dy) < 100) {
					if (dx < -200) {
						goswipe(lib.config.swipe_left);
					} else if (dx > 200) {
						goswipe(lib.config.swipe_right);
					}
				}
			}
		}
		var tmpflag = false;
		_status.mousedown = false;
		_status.clicked = false;
		if (_status.mousedragging && _status.mouseleft) {
			if (game.check()) {
				if (ui.confirm) {
					ui.confirm.close();
				}
				var event = _status.event;
				if (!event.filterOk || event.filterOk()) {
					ui.click.ok();
				}
				ui.canvas.width = ui.arena.offsetWidth;
				ui.canvas.height = ui.arena.offsetHeight;
			} else {
				game.uncheck();
				game.check();
			}
		} else if (_status.mousedragging && _status.mousedragorigin) {
			tmpflag = _status.mousedragorigin;
		}
		_status.lastdragchange.length = 0;
		_status.mousedragging = null;
		_status.mouseleft = false;
		_status.mousedragorigin = null;
		_status.dragstatuschanged = false;
		while (ui.touchlines.length) {
			ui.touchlines.shift().delete();
		}
		if (tmpflag) {
			game.check();
		}
		_status.dragged = false;
		_status.clicked = false;
	}
	checkroundtranslate(translate) {
		var translate = translate || ui.roundmenu._dragtransform;
		if (translate[1] + ui.roundmenu._position[1] + 50 + ui.arena.offsetTop > ui.window.offsetHeight) {
			translate[1] = ui.window.offsetHeight - (ui.roundmenu._position[1] + 50) - ui.arena.offsetTop;
		} else if (translate[1] + ui.roundmenu._position[1] + ui.arena.offsetTop < 0) {
			translate[1] = -ui.roundmenu._position[1] - ui.arena.offsetTop;
		}
		if (translate[0] + ui.roundmenu._position[0] + 50 + ui.arena.offsetLeft > ui.window.offsetWidth) {
			translate[0] = ui.window.offsetWidth - (ui.roundmenu._position[0] + 50) - ui.arena.offsetLeft;
		} else if (translate[0] + ui.roundmenu._position[0] + ui.arena.offsetLeft < 0) {
			translate[0] = -ui.roundmenu._position[0] - ui.arena.offsetLeft;
		}
		ui.roundmenu.style.transform = "translate(" + translate[0] + "px," + translate[1] + "px)";
	}
	checkdialogtranslate(translate, dialog) {
		var translate = translate || dialog._dragtransform;
		if (Math.sqrt(translate[0] * translate[0] + translate[1] * translate[1]) < 10) {
			translate[0] = 0;
			translate[1] = 0;
		}
		dialog.style.transform = "translate(" + translate[0] + "px," + translate[1] + "px)";
	}
	windowmousewheel(e) {
		_status.tempunpopup = e;
	}
	windowmousemove(e) {
		if (window.inSplash) {
			return;
		}
		if (_status.tempunpopup) {
			if (get.evtDistance(_status.tempunpopup, e) > 5) {
				delete _status.tempunpopup;
			}
		}
		if (e.button == 2) {
			return;
		}
		var dialogs = document.querySelectorAll("#window>.dialog.popped:not(.static)");
		for (var i = 0; i < dialogs.length; i++) {
			dialogs[i].delete();
		}
		var node = _status.currentmouseenter;
		var sourceitem = document.elementFromPoint(e.clientX, e.clientY);
		if (game.chess && ui.selected.cards.length) {
			var itemtype = get.itemtype(sourceitem);
			if (itemtype != "card" && itemtype != "button") {
				for (var i = 0; i < game.players.length; i++) {
					var ex = e.clientX / game.documentZoom - ui.arena.offsetLeft;
					var ey = e.clientY / game.documentZoom - ui.arena.offsetTop;
					var left = -ui.chessContainer.chessLeft + ui.chess.offsetLeft + game.players[i].getLeft();
					var top = -ui.chessContainer.chessTop + ui.chess.offsetTop + game.players[i].getTop();
					var width = game.players[i].offsetWidth;
					var height = game.players[i].offsetHeight;
					if (ex > left && ex < left + width && ey > top && ey < top + height) {
						sourceitem = game.players[i];
						break;
					}
				}
			}
		}
		var item = sourceitem;
		if (_status.mousedragging) {
			e.preventDefault();
			if (lib.config.enable_dragline) {
				// var i=0;
				// var startPoint0=[_status.mousedragging.clientX/game.documentZoom-ui.arena.offsetLeft,_status.mousedragging.clientY/game.documentZoom-ui.arena.offsetTop];
				// var startPoint=startPoint0;
				// var endPoint;
				// if(_status.multitarget){
				// 	for(;i<_status.lastdragchange.length;i++){
				// 		var exy=_status.lastdragchange[i]._lastdragchange;
				// 		endPoint=[exy[0],exy[1]];
				// 		_status.dragline[i]=game.linexy(startPoint.concat(endPoint),'drag',_status.dragline[i]);
				// 		startPoint=endPoint;
				// 	}
				// }
				// if(!_status.selectionfull){
				// 	endPoint=[e.clientX/game.documentZoom-ui.arena.offsetLeft,e.clientY/game.documentZoom-ui.arena.offsetTop];
				// 	_status.dragline[i]=game.linexy(startPoint.concat(endPoint),'drag',_status.dragline[i]);
				// 	startPoint=endPoint;
				// 	i++;
				// }
				// if(!_status.multitarget){
				// 	for(var j=0;j<_status.lastdragchange.length;j++){
				// 		i+=j;
				// 		var exy=_status.lastdragchange[j]._lastdragchange;
				// 		_status.dragline[i]=game.linexy(startPoint0.concat([exy[0],exy[1]]),'drag',_status.dragline[i]);
				// 	}
				// }
				// var remained=_status.dragline.splice(i+1);
				// for(var j=0;j<remained.length;j++){
				// 	if(remained[j]) remained[j].remove();
				// }

				ui.canvas.width = ui.arena.offsetWidth;
				ui.canvas.height = ui.arena.offsetHeight;
				var ctx = ui.ctx;
				ctx.shadowBlur = 5;
				ctx.shadowColor = "rgba(0,0,0,0.3)";
				ctx.strokeStyle = "white";
				ctx.lineWidth = 3;
				ctx.setLineDash([8, 2]);

				ctx.beginPath();

				ctx.moveTo(_status.mousedragging.clientX / game.documentZoom - ui.arena.offsetLeft, _status.mousedragging.clientY / game.documentZoom - ui.arena.offsetTop);
				if (_status.multitarget) {
					for (var i = 0; i < _status.lastdragchange.length; i++) {
						var exy = _status.lastdragchange[i]._lastdragchange;
						ctx.lineTo(exy[0], exy[1]);
					}
				}
				if (!_status.selectionfull) {
					ctx.lineTo(e.clientX / game.documentZoom - ui.arena.offsetLeft, e.clientY / game.documentZoom - ui.arena.offsetTop);
				}
				ctx.stroke();
				if (!_status.multitarget) {
					for (var i = 0; i < _status.lastdragchange.length; i++) {
						ctx.moveTo(_status.mousedragging.clientX / game.documentZoom - ui.arena.offsetLeft, _status.mousedragging.clientY / game.documentZoom - ui.arena.offsetTop);
						var exy = _status.lastdragchange[i]._lastdragchange;
						ctx.lineTo(exy[0], exy[1]);
						ctx.stroke();
					}
				}
			}

			while (item) {
				if (item == _status.mousedragorigin) {
					if (_status.mouseleft) {
						_status.mousedragging = null;
						_status.mousedragorigin = null;
						_status.clicked = false;
						if (_status.event.type == "phase" && !_status.event.skill && ui.confirm) {
							ui.confirm.classList.add("removing");
						}
						game.uncheck();
						game.check();
						_status.clicked = true;
					}
					return;
				}
				var itemtype = get.itemtype(item);
				if (itemtype == "card" || itemtype == "button" || itemtype == "player") {
					_status.mouseleft = true;
					if (ui.selected.cards.length) {
						ui.selected.cards[0].updateTransform(true, 100);
					}
					var ex = e.clientX / game.documentZoom - ui.arena.offsetLeft;
					var ey = e.clientY / game.documentZoom - ui.arena.offsetTop;
					var exx = ex,
						eyy = ey;
					if (game.chess) {
						ex -= -ui.chessContainer.chessLeft + ui.chess.offsetLeft;
						ey -= -ui.chessContainer.chessTop + ui.chess.offsetTop;
					}
					if (itemtype != "player" || game.chess || (ex > item.offsetLeft && ex < item.offsetLeft + item.offsetWidth && ey > item.offsetTop && ey < item.offsetTop + item.offsetHeight)) {
						var targetfixed = false;
						if (itemtype == "player") {
							if (get.select(_status.event.selectTarget)[1] <= -1) {
								targetfixed = true;
							}
						}
						if (!targetfixed && item.classList.contains("selectable") && _status.dragstatuschanged != item) {
							_status.mouseleft = true;
							_status.dragstatuschanged = item;
							_status.clicked = false;
							var notbefore = itemtype == "player" && !item.classList.contains("selected");
							ui.click[itemtype].call(item);
							if (item.classList.contains("selected")) {
								if (notbefore) {
									_status.lastdragchange.push(item);
									item._lastdragchange = [exx, eyy];
								}
							} else {
								_status.lastdragchange.remove(item);
							}
							_status.selectionfull = true;
							if (_status.event.filterButton && ui.selected.buttons.length < get.select(_status.event.selectButton)[1]) {
								_status.selectionfull = false;
							} else if (_status.event.filterCard && ui.selected.cards.length < get.select(_status.event.selectCard)[1]) {
								_status.selectionfull = false;
							} else if (_status.event.filterTarget && ui.selected.targets.length < get.select(_status.event.selectTarget)[1]) {
								_status.selectionfull = false;
							}
						}
					}
					return;
				}
				item = item.parentNode;
			}
			if (!_status.mouseleft) {
				_status.mouseleft = true;
				game.check();
				for (var i = 0; i < ui.selected.cards.length; i++) {
					ui.selected.cards[i].updateTransform(true);
				}
			}
			_status.dragstatuschanged = null;
		} else {
			while (item) {
				if (item == node && !node._mouseentercreated) {
					ui.click.mouseentercancel();
					var hoveration;
					if (typeof node._hoveration == "number") {
						hoveration = node._hoveration;
					} else {
						hoveration = parseInt(lib.config.hoveration);
						if (node.classList.contains("button") || (node.parentNode && node.parentNode.parentNode) == ui.me) {
							hoveration += 500;
						}
					}
					_status._mouseentertimeout = setTimeout(function () {
						if (_status.currentmouseenter != node || node._mouseentercreated || _status.tempunpopup || _status.mousedragging || _status.mousedown || !node.offsetWidth || !node.offsetHeight) {
							return;
						}
						if (node._hoverfunc && !node._nopup) {
							var dialog = node._hoverfunc.call(node, e);
							if (dialog) {
								dialog.classList.add("popped");
								ui.window.appendChild(dialog);
								lib.placePoppedDialog(dialog, e);
								if (node._hoverwidth) {
									dialog.style.width = node._hoverwidth + "px";
									dialog._hovercustomed = true;
								}
								node._mouseenterdialog = dialog;
								node._mouseentercreated = true;
							}
						}
					}, hoveration);
					break;
				}
				item = item.parentNode;
			}
			if (_status.draggingdialog) {
				var ddialog = _status.draggingdialog;
				if (ddialog._dragorigin && ddialog._dragtransform) {
					var translate = ddialog._dragtransform.slice(0);
					translate[0] += e.clientX / game.documentZoom - ddialog._dragorigin.clientX / game.documentZoom;
					translate[1] += e.clientY / game.documentZoom - ddialog._dragorigin.clientY / game.documentZoom;
					ui.click.checkdialogtranslate(translate, ddialog);
				}
				_status.clicked = true;
			}
			if (_status.draggingroundmenu) {
				if (ui.roundmenu._dragorigin && ui.roundmenu._dragtransform) {
					var translate = ui.roundmenu._dragtransform.slice(0);
					translate[0] += e.clientX / game.documentZoom - ui.roundmenu._dragorigin.clientX / game.documentZoom;
					translate[1] += e.clientY / game.documentZoom - ui.roundmenu._dragorigin.clientY / game.documentZoom;
					ui.click.checkroundtranslate(translate);
				}
				_status.clicked = true;
			}
		}
	}
	windowmousedown(e) {
		if (window.inSplash) {
			return;
		}
		if (!ui.window) {
			return;
		}
		if (e.button == 2) {
			return;
		}
		_status.mousedown = true;
		var dialogs = ui.window.querySelectorAll("#window>.dialog.popped:not(.static)");
		for (var i = 0; i < dialogs.length; i++) {
			dialogs[i].delete();
		}
		var sourceitem = document.elementFromPoint(e.clientX, e.clientY);
		var item = sourceitem;
		while (item) {
			var itemtype = get.itemtype(item);
			if (itemtype == "button") {
				break;
			}
			if (itemtype == "dialog" && !item.classList.contains("popped") && !item.classList.contains("fixed")) {
				var ddialog = item;
				_status.draggingdialog = ddialog;
				ddialog._dragorigin = e;
				if (!ddialog._dragtransform) {
					ddialog._dragtransform = [0, 0];
				}
				return;
			}
			if (item == ui.roundmenu) {
				_status.draggingroundmenu = true;
				ui.roundmenu._dragorigin = e;
				if (!ui.roundmenu._dragtransform) {
					ui.roundmenu._dragtransform = [0, 0];
				}
				return;
			}
			item = item.parentNode;
		}

		var evt = _status.event;
		if (!lib.config.enable_drag) {
			return;
		}
		if (!ui.arena.classList.contains("selecting")) {
			return;
		}
		if (!evt.isMine()) {
			return;
		}

		item = sourceitem;
		while (item) {
			var itemtype = get.itemtype(item);
			if (itemtype == "card" || itemtype == "button" || itemtype == "player") {
				if (item.classList.contains("selectable") && !item.classList.contains("selected") && !item.classList.contains("noclick")) {
					_status.clicked = false;
					ui.click[itemtype].call(item);
					if (item.classList.contains("selected")) {
						_status.mousedragging = e;
						_status.mousedragorigin = item;
						_status.mouseleft = false;
						_status.selectionfull = false;
						_status.multitarget = false;
						_status.lastmouseutc = get.utc();
						ui.arena.classList.add("dragging");
					}
				}
				return;
			}
			item = item.parentNode;
		}
	}
	cardtouchstart(e) {
		if (e.touches.length != 1) {
			return;
		}
		if (!lib.config.enable_drag) {
			return;
		}
		if (!this.parentNode) {
			return;
		}
		if (!this.parentNode.parentNode) {
			return;
		}
		if (this.parentNode.parentNode.parentNode != ui.me) {
			return;
		}
		if (this.parentNode.parentNode.classList.contains("scrollh")) {
			return;
		}
		if (this.classList.contains("selectable") && !this.classList.contains("selected") && !this.classList.contains("noclick")) {
			this._waitingfordrag = {
				clientX: e.touches[0].clientX,
				clientY: e.touches[0].clientY,
			};
		}
	}
	cardtouchmove(e) {
		ui.click.longpresscancel.call(this);
		if (this._waitingfordrag) {
			var drag = this._waitingfordrag;
			_status.clicked = false;
			_status.touchnocheck = true;
			ui.click.card.call(this);
			_status.touchnocheck = false;
			if (this.classList.contains("selected")) {
				_status.mousedragging = drag;
				_status.mousedragorigin = this;
				_status.mouseleft = false;
				_status.selectionfull = false;
				_status.multitarget = false;
			}
			delete this._waitingfordrag;
		}
	}
	windowmouseup(e) {
		delete _status.force;
		// if(_status.forcetouchinterval){
		// 	clearInterval(_status.forcetouchinterval);
		// 	delete _status.forcetouchinterval;
		// }
		if (window.inSplash) {
			return;
		}
		if (_status.draggingdialog) {
			var ddialog = _status.draggingdialog;
			var translate;
			if (ddialog._dragorigin && ddialog._dragtransform) {
				translate = ddialog._dragtransform;
				translate[0] += e.clientX / game.documentZoom - ddialog._dragorigin.clientX / game.documentZoom;
				translate[1] += e.clientY / game.documentZoom - ddialog._dragorigin.clientY / game.documentZoom;
				ui.click.checkdialogtranslate(null, ddialog);
				delete ddialog._dragorigin;
			}
			game.saveConfig("dialog_transform", translate);
			delete _status.draggingdialog;
		}
		if (_status.draggingroundmenu) {
			var translate;
			if (ui.roundmenu._dragorigin && ui.roundmenu._dragtransform) {
				var dx = e.clientX / game.documentZoom - ui.roundmenu._dragorigin.clientX / game.documentZoom;
				var dy = e.clientY / game.documentZoom - ui.roundmenu._dragorigin.clientY / game.documentZoom;
				if (dx * dx + dy * dy < 25) {
					ui.click.roundmenu();
				}
				translate = ui.roundmenu._dragtransform;
				translate[0] += dx;
				translate[1] += dy;
				ui.click.checkroundtranslate();
				delete ui.roundmenu._dragorigin;
			}
			game.saveConfig("roundmenu_transform", translate);
			delete _status.draggingroundmenu;
		}
		if (e.button == 2) {
			if (_status.mousedragging) {
				_status.mousedragging = null;
				_status.mouseleft = false;
				_status.mousedragorigin = null;
				_status.dragstatuschanged = false;
				game.uncheck();
				game.check();
				_status.noright = true;
			}
		} else {
			var tmpflag = false;
			_status.mousedown = false;
			for (var i = 0; i < ui.selected.cards.length; i++) {
				ui.selected.cards[i].updateTransform(true);
			}
			if (_status.mousedragging && _status.mouseleft) {
				if (game.check()) {
					if (ui.confirm) {
						ui.confirm.close();
					}
					var event = _status.event;
					if (!event.filterOk || event.filterOk()) {
						ui.click.ok();
					}
				} else {
					game.uncheck();
					game.check();
				}
			} else if (_status.mousedragging && _status.mousedragorigin) {
				tmpflag = _status.mousedragorigin;
			}
			_status.lastdragchange.length = 0;
			_status.mousedragging = null;
			_status.mouseleft = false;
			_status.mousedragorigin = null;
			_status.dragstatuschanged = false;
			if (ui.arena) {
				ui.canvas.width = ui.arena.offsetWidth;
				ui.canvas.height = ui.arena.offsetHeight;
			}
			if (tmpflag) {
				ui.click[get.itemtype(tmpflag)].call(tmpflag);
				game.check();
			}
			// ui.updatehl();
		}
		if (ui.arena) {
			ui.arena.classList.remove("dragging");
		}
	}
	mousemove() {
		if (!lib.config.hover_handcard && this.parentNode && this.parentNode.parentNode == ui.me) {
			return;
		}
		if (!_status.currentmouseenter) {
			_status.currentmouseenter = this;
		}
	}
	mouseenter() {
		if (!lib.config.hover_handcard && this.parentNode && this.parentNode.parentNode == ui.me) {
			return;
		}
		_status.currentmouseenter = this;
	}
	mouseleave() {
		ui.click.mouseentercancel();
		if (_status.currentmouseenter == this) {
			_status.currentmouseenter = null;
		}
		this._mouseentercreated = false;
	}
	mousedown() {
		ui.click.mouseentercancel();
		if (_status.currentmouseenter == this) {
			_status.currentmouseenter = null;
		}
		this._mouseentercreated = true;
	}
	mouseentercancel() {
		if (_status._mouseentertimeout) {
			clearTimeout(_status._mouseentertimeout);
			delete _status._mouseentertimeout;
		}
	}
	hoverplayer(e) {
		var node = get.nodeintro(this, true);
		if (node) {
			node.style.zIndex = 21;
		}
		return node;
	}
	longpressdown(e) {
		if (_status.longpressed) {
			return;
		}
		if (this._longpresstimeout) {
			clearTimeout(this._longpresstimeout);
		}
		if (lib.config.longpress_info) {
			this._longpresstimeout = setTimeout(ui.click.longpresscallback, 500);
		}
		this._longpressevent = e;
		if (_status.longpressing && _status.longpressing != this) {
			ui.click.longpresscancel.call(_status.longpressing);
		}
		// if(window.ForceTouch&&!_status.forcetouchinterval&&lib.config.enable_pressure){
		// 	_status.forcetouchinterval=setInterval(ui.click.forcetouch,30);
		// }
		_status.longpressing = this;
	}
	longpresscallback() {
		if (!_status.longpressing) {
			return;
		}
		var node = _status.longpressing;
		var func = node._longpresscallback;
		var e = node._longpressevent;
		if (!func || !e) {
			return;
		}
		clearTimeout(node._longpresstimeout);
		_status.force = true;
		delete _status.longpressing;
		delete node._longpresstimeout;
		delete node._longpressevent;
		if (_status.mousedragging && _status.mouseleft) {
			return;
		}
		if (!_status.longpressed) {
			_status.longpressed = true;
			setTimeout(function () {
				_status.longpressed = false;
			}, 500);
			func.call(node, e);
			if (lib.config.touchscreen && lib.config.enable_drag && !node._waitingfordrag) {
				_status.mousedragging = null;
				_status.mousedragorigin = null;
				_status.clicked = false;
				game.uncheck();
				game.check();
				_status.clicked = true;
			}
			delete node._waitingfordrag;
			ui.click.touchpop();
		}
	}
	longpresscancel() {
		if (this._longpresstimeout) {
			clearTimeout(this._longpresstimeout);
			delete this._longpresstimeout;
		}
		delete this._longpressevent;
		if (_status.longpressing == this) {
			delete _status.longpressing;
		}
	}
	window() {
		var clicked = _status.clicked;
		var dialogtouched = false;
		if (_status.dialogtouched) {
			_status.dialogtouched = false;
			dialogtouched = true;
		}
		if (_status.dragged) {
			return;
		}
		if (_status.touchpopping) {
			return;
		}
		if (_status.reloading) {
			return;
		}
		if (_status.clicked || _status.clicked2) {
			_status.clicked = false;
			_status.clicked2 = false;
		} else {
			if (_status.clickingidentity) {
				for (var i = 0; i < _status.clickingidentity[1].length; i++) {
					_status.clickingidentity[1][i].delete();
					_status.clickingidentity[1][i].style.transform = "";
				}
				delete _status.clickingidentity;
			}
			if (!_status.event.isMine) {
				return;
			}
			if (ui.controls.length) {
				ui.updatec();
			}
			if (_status.editing) {
				if (_status.editing.innerHTML.length) {
					_status.editing.link = _status.editing.innerHTML;
				}
				_status.editing.innerHTML = get.translation(_status.editing.link);
				delete _status.editing;
			} else if (_status.choosing) {
				if (!_status.choosing.expand) {
					_status.choosing.parentNode.style.height = "";
					_status.choosing.nextSibling.delete();
					_status.choosing.previousSibling.show();
					delete _status.choosing;
				}
			} else if (ui.intro) {
				ui.intro.close();
				delete ui.intro;
				ui.control.show();
				game.resume2();
			} else if ((_status.event.isMine() || _status.event.forceMine) && !dialogtouched) {
				if (typeof _status.event.custom?.replace?.window == "function") {
					_status.event.custom.replace.window();
				} else {
					if (_status.event.skill && _status.event.name == "chooseToUse") {
						ui.click.cancel();
					} else if (_status.event._checked) {
						game.uncheck();
						game.check();
					}
				}
			}
			if (!ui.shortcut.classList.contains("hidden")) {
				ui.click.shortcut(false);
			}
			if (get.is.phoneLayout() && ui.menuContainer && ui.menuContainer.classList.contains("hidden")) {
				if (ui.system2.classList.contains("shown")) {
					_status.removinground = true;
					setTimeout(function () {
						_status.removinground = false;
					}, 200);
				}
				ui.arena.classList.remove("phonetop");
				ui.system1.classList.remove("shown");
				ui.system2.classList.remove("shown");
				// if(ui.chessinfo){
				// 	ui.chessinfo.classList.remove('zoomed');
				// }
			}
		}
		if (_status.tempunpop) {
			_status.tempunpop = false;
		} else {
			game.closePopped();
		}
		if (typeof _status.event.custom?.add?.window == "function") {
			_status.event.custom.add.window(clicked);
		}
	}
	toggle() {
		if (_status.dragged) {
			return;
		}
		if (this.parentNode.classList.contains("disabled")) {
			return;
		}
		_status.tempunpop = true;
		if (this.link) {
			this.link = false;
			this.classList.remove("on");
			if (this.additionalCommand) {
				this.additionalCommand(false, this.parentNode);
			}
		} else {
			this.link = true;
			this.classList.add("on");
			if (this.additionalCommand) {
				this.additionalCommand(true, this.parentNode);
			}
		}
	}
	editor() {
		if (_status.dragged) {
			return;
		}
		if (_status.editing) {
			return;
		}
		_status.clicked = true;
		this.innerHTML = "";
		_status.editing = this;
		if (this.additionalCommand) {
			this.additionalCommand(this);
		}
	}
	switcher() {
		if (_status.dragged) {
			return;
		}
		if (this.parentNode.classList.contains("disabled")) {
			return;
		}
		if (_status.choosing) {
			return;
		}
		_status.clicked = true;
		_status.tempunpop = true;
		this.previousSibling.hide();
		var node = ui.create.div(".switcher", this.parentNode).addTempClass("start");
		for (var i = 0; i < this.choice.length; i++) {
			var choice = ui.create.div(".pointerdiv", node);
			choice.innerHTML = get.translation(this.choice[i]);
			choice.link = this.choice[i];
			choice.addEventListener(lib.config.touchscreen ? "touchend" : "click", ui.click.choice);
		}
		// this.parentNode.style.height=(node.offsetHeight)+'px';
		_status.choosing = this;
		if (!_status.choosing.expand) {
			_status.choosing.expand = true;
			setTimeout(function () {
				_status.choosing.expand = false;
			}, 500);
		}
	}
	choice() {
		if (_status.dragged) {
			return;
		}
		if (!_status.choosing) {
			return;
		}
		_status.choosing.link = this.link;
		_status.choosing.innerHTML = get.translation(this.link);
		this.parentNode.parentNode.style.height = "";
		this.parentNode.delete();
		_status.choosing.previousSibling.show();
		delete _status.choosing;
		if (this.parentNode.parentNode.querySelector(".toggle").additionalCommand) {
			this.parentNode.parentNode.querySelector(".toggle").additionalCommand(this.link, this.parentNode.parentNode);
		}
	}
	button() {
		if (_status.dragged) {
			return;
		}
		if (_status.clicked) {
			return;
		}
		if (_status.tempNoButton) {
			return;
		}
		if (_status.draggingtouchdialog) {
			return;
		}
		if (this.classList.contains("noclick")) {
			return;
		}
		if (_status.justdragged) {
			return;
		}
		_status.clicked = true;
		var custom = _status.event.custom;
		if (typeof custom?.replace?.button == "function") {
			custom.replace.button(this);
			return;
		}
		if (!_status.event.isMine()) {
			return;
		}
		if (this.classList.contains("selectable") == false) {
			return;
		}
		if (this.classList.contains("selected")) {
			ui.selected.buttons.remove(this);
			this.classList.remove("selected");
			if (_status.multitarget || _status.event.complexSelect) {
				game.uncheck();
				game.check();
			}
		} else {
			this.classList.add("selected");
			ui.selected.buttons.add(this);
		}
		if (typeof custom?.add?.button == "function") {
			custom.add.button();
		}
		game.check();
	}
	touchintro() {
		var rect = this.getBoundingClientRect();
		ui.click.touchpop();
		ui.click.intro.call(this, {
			clientX: rect.left + 18,
			clientY: rect.top + 12,
		});
		_status.clicked = false;
	}
	card() {
		delete this._waitingfordrag;
		if (_status.dragged) {
			return;
		}
		if (_status.clicked) {
			return;
		}
		if (ui.intro) {
			return;
		}
		_status.clicked = true;
		if (this.parentNode && (this.parentNode.classList.contains("judges") || this.parentNode.classList.contains("marks"))) {
			var rect = this.getBoundingClientRect();
			ui.click.touchpop();
			ui.click.intro.call(this, {
				clientX: rect.left + 18,
				clientY: rect.top + 12,
			});
			_status.clicked = false;
			return;
		}
		var custom = _status.event.custom;
		if (typeof custom?.replace?.card == "function") {
			custom.replace.card(this);
			return;
		}
		if (this.classList.contains("selectable") == false) {
			return;
		}
		if (this.classList.contains("selected")) {
			ui.selected.cards.remove(this);
			if (_status.multitarget || _status.event.complexSelect) {
				game.uncheck();
				game.check();
			} else {
				this.classList.remove("selected");
				this.updateTransform();
			}
		} else {
			ui.selected.cards.add(this);
			this.classList.add("selected");
			this.updateTransform(true);
		}
		if (game.chess && get.config("show_range") && !_status.event.skill && this.classList.contains("selected") && _status.event.isMine() && _status.event.name == "chooseToUse") {
			var player = _status.event.player;
			var range = get.info(this).range;
			if (range) {
				if (typeof range.attack === "number") {
					player.createRangeShadow(Math.min(8, player.getAttackRange(true) + range.attack - 1));
				} else if (typeof range.global === "number") {
					player.createRangeShadow(Math.min(8, player.getGlobalFrom() + range.global));
				}
			}
		}
		if (typeof custom?.add?.card == "function") {
			custom.add.card();
		}
		game.check();

		if (lib.config.popequip && get.is.phoneLayout() && arguments[0] != "popequip" && ui.arena && ui.arena.classList.contains("selecting") && this.parentNode && this.parentNode.classList.contains("popequip")) {
			var rect = this.getBoundingClientRect();
			ui.click.touchpop();
			ui.click.intro.call(this.parentNode, {
				clientX: rect.left + 18,
				clientY: rect.top + 12,
			});
		}
	}
	avatar() {
		if (!lib.config.doubleclick_intro) {
			return;
		}
		if (this.parentNode.isUnseen(0)) {
			return;
		}
		if (!lib.character[this.parentNode.name]) {
			return;
		}
		if (!ui.menuContainer) {
			return;
		}
		var avatar = this;
		var player = this.parentNode;
		if (!game.players.includes(player) && !game.dead.includes(player)) {
			return;
		}
		if (!this._doubleClicking) {
			this._doubleClicking = true;
			setTimeout(function () {
				avatar._doubleClicking = false;
			}, 500);
			return;
		}
		// ui.click.skin(this,player.name);
		game.pause2();
		var audioName = player.skin.name || player.name1 || player.name;
		ui.click.charactercard(player.name1 || player.name, null, null, true, this, audioName);
	}
	avatar2() {
		if (!lib.config.doubleclick_intro) {
			return;
		}
		if (this.parentNode.classList.contains("unseen2")) {
			return;
		}
		if (!lib.character[this.parentNode.name2]) {
			return;
		}
		if (!ui.menuContainer) {
			return;
		}
		var avatar = this;
		var player = this.parentNode;
		if (!game.players.includes(player) && !game.dead.includes(player)) {
			return;
		}
		if (!this._doubleClicking) {
			this._doubleClicking = true;
			setTimeout(function () {
				avatar._doubleClicking = false;
			}, 500);
			return;
		}
		// ui.click.skin(this,player.name2);
		game.pause2();
		ui.click.charactercard(player.name2, null, null, true, this, player.skin.name2 || player.name2);
	}
	connectroom(e) {
		if (_status.dragged) {
			return;
		}
		if (_status.clicked) {
			return;
		}
		if (ui.intro) {
			return;
		}
		if (this.roomfull) {
			alert("房间已满");
		} else if (this.roomgaming && !game.onlineID) {
			if (this.config && this.config.observe) {
				alert("房间暂时不可旁观");
			} else {
				alert("房间不允许旁观");
			}
		} else if (!this.roomempty && this.version != lib.versionOL) {
			if (this.version > lib.versionOL) {
				alert("加入失败：你的游戏版本过低");
			} else {
				alert("加入失败：房主的游戏版本过低");
			}
		} else {
			if (!_status.enteringroom) {
				_status.enteringroom = true;
				_status.enteringroomserver = this.serving;
				game.send("server", "enter", this.key, get.connectNickname(), lib.config.connect_avatar);
			}
		}
	}
	player() {
		return ui.click.target.apply(this, arguments);
	}
	target(e) {
		if (_status.dragged) {
			return;
		}
		if (_status.clicked) {
			return;
		}
		if (ui.intro) {
			return;
		}
		if (this.classList.contains("connect")) {
			if (game.online) {
				if (game.onlinezhu) {
					if (!this.playerid && game.connectPlayers) {
						if (lib.configOL.mode == "versus" || lib.configOL.mode == "doudizhu") {
							return;
						}
						if (lib.configOL.mode == "identity" && lib.configOL.identity_mode == "zhong") {
							return;
						}
						if (!this.classList.contains("unselectable2") && lib.configOL.number <= 2) {
							return;
						}
						this.classList.toggle("unselectable2");
						if (this.classList.contains("unselectable2")) {
							lib.configOL.number--;
						} else {
							lib.configOL.number++;
						}
						game.send("changeNumConfig", lib.configOL.number, game.connectPlayers.indexOf(this), this.classList.contains("unselectable2"));
					}
				}
				return;
			}
			if (this.playerid) {
				if (this.ws) {
					if (confirm("是否踢出" + this.nickname + "？")) {
						var onlineKey = this.ws.onlineKey;
						if (onlineKey) {
							if (confirm("是否永久踢出(加入黑名单)？")) {
								var banBlacklist = lib.config.banBlacklist === undefined ? [] : lib.config.banBlacklist;
								banBlacklist.push(onlineKey);
								game.saveConfig("banBlacklist", banBlacklist);
							}
						}
						var id = get.id();
						this.ws.send(function (id) {
							if (game.ws) {
								game.ws.close();
								game.saveConfig("reconnect_info");
								game.saveConfig("banned_info", id);
							}
						}, id);
						lib.node.banned.push(id);
					}
				}
			} else {
				if (lib.configOL.mode == "versus" || lib.configOL.mode == "doudizhu" || lib.configOL.mode == "single") {
					return;
				}
				if (lib.configOL.mode == "identity" && (lib.configOL.identity_mode == "zhong" || lib.configOL.identity_mode == "purple")) {
					return;
				}
				if (!this.classList.contains("unselectable2") && lib.configOL.number <= 2) {
					return;
				}
				this.classList.toggle("unselectable2");
				if (this.classList.contains("unselectable2")) {
					lib.configOL.number--;
				} else {
					lib.configOL.number++;
				}
				game.send("server", "config", lib.configOL);
				game.updateWaiting();
			}
			return;
		}
		_status.clicked = true;
		var custom = _status.event.custom;
		if (typeof custom?.replace?.target == "function") {
			custom.replace.target(this, e);
			return;
		}
		if (this.classList.contains("selectable") == false) {
			return;
		}
		this.unprompt();
		if (this.classList.contains("selected")) {
			ui.selected.targets.remove(this);
			if (_status.multitarget || _status.event.complexSelect) {
				game.uncheck();
				game.check();
			} else {
				this.classList.remove("selected");
			}
		} else {
			ui.selected.targets.add(this);
			if (["chooseTarget", "chooseToUse", "chooseCardTarget", "chooseButtonTarget"].includes(_status.event.name)) {
				var targetprompt = null;
				if (_status.event.targetprompt) {
					targetprompt = _status.event.targetprompt;
				} else if (_status.event.skill && !get.info(_status.event.skill).viewAs) {
					targetprompt = get.info(_status.event.skill).targetprompt;
				} else if (_status.event.name == "chooseToUse") {
					var currentcard = get.card();
					if (currentcard) {
						targetprompt = get.info(currentcard).targetprompt;
					}
				}
				if (targetprompt) {
					if (Array.isArray(targetprompt)) {
						const targets = ui.selected.targets.slice();
						let index = ui.selected.targets.indexOf(this);
						for (let i = 0; i < targetprompt.length; i++) {
							const target = targets.find(cur => cur.node.prompt && cur.node.prompt.innerHTML === targetprompt[i]);
							if (target) {
								targets.remove(target);
							} else {
								index = i;
								break;
							}
						}
						targetprompt = targetprompt[Math.min(targetprompt.length - 1, index)];
					} else if (typeof targetprompt == "function") {
						targetprompt = targetprompt(this);
					}
					if (targetprompt && typeof targetprompt == "string") {
						this.prompt(targetprompt);
					}
				}
			}
			this.classList.add("selected");
		}
		if (typeof custom?.add?.target == "function") {
			custom.add.target();
		}
		game.check();
	}
	control2() {
		if (this.childNodes.length == 1 && !this._doubleclick) {
			ui.click.control.call(this.firstChild);
		}
	}
	control() {
		if (_status.dragged) {
			return;
		}
		if (ui.control.classList.contains("hidden")) {
			return;
		}
		var node = this.parentNode;
		if (node) {
			if (node._doubleclick) {
				return;
			} else {
				node._doubleclick = true;
				setTimeout(function () {
					node._doubleclick = false;
				}, 500);
			}
			if (node.classList.contains("hidden")) {
				return;
			}
			if (node.classList.contains("removing")) {
				return;
			}
			if (node.classList.contains("disabled")) {
				return;
			}
		}
		if (ui.intro) {
			ui.intro.close();
			delete ui.intro;
		}
		_status.clicked = true;
		if (this.parentNode.custom) {
			this.parentNode.custom(this.link, this);
			return;
		}
		if (this.link == "ok") {
			ui.click.ok(this);
		} else if (this.link == "cancel") {
			ui.click.cancel(this);
		} else {
			_status.event.result = {
				buttons: ui.selected.buttons.slice(0),
				cards: ui.selected.cards.slice(0),
				targets: ui.selected.targets.slice(0),
				control: this.link,
				links: get.links(ui.selected.buttons),
			};
			if (this.parentNode.close != false) {
				game.uncheck();
				this.parentNode.close();
			}
			game.resume();
		}
	}
	dialogcontrol() {
		_status.event.result = {
			buttons: ui.selected.buttons.slice(0),
			cards: ui.selected.cards.slice(0),
			targets: ui.selected.targets.slice(0),
			control: this.link,
			links: get.links(ui.selected.buttons),
		};
		game.resume();
	}
	skill(skill) {
		var info = get.info(skill);
		var event = _status.event;
		event.backup(skill);
		if (info.filterCard && info.discard != false && info.lose != false && !info.viewAs) {
			var cards = event.player.getCards(event.position);
			for (var i = 0; i < cards.length; i++) {
				if (!lib.filter.cardDiscardable(cards[i], event.player)) {
					cards[i].uncheck("useSkill");
				}
			}
		}
		if (typeof event.skillDialog == "object") {
			event.skillDialog.close();
		}
		if (event.isMine()) {
			event.skillDialog = true;
		}
		game.uncheck();
		game.check();
		if (event.skillDialog === true) {
			var str = get.translation(skill);
			if (info.prompt) {
				var str2;
				if (typeof info.prompt == "function") {
					str2 = info.prompt(event, event.player);
				} else {
					str2 = info.prompt;
				}
				event.skillDialog = ui.create.dialog(str, '<div><div style="width:100%;text-align:center">' + str2 + "</div></div>");
				if (info.longprompt) {
					event.skillDialog.forcebutton = true;
					ui.update();
				}
			} else if (info.promptfunc) {
				event.skillDialog = ui.create.dialog(str, '<div><div style="width:100%">' + info.promptfunc(event, event.player) + "</div></div>");
			} else if (lib.dynamicTranslate[skill]) {
				event.skillDialog = ui.create.dialog(str, '<div><div style="width:100%">' + lib.dynamicTranslate[skill](event.player, skill) + "</div></div>");
			} else if (lib.translate[skill + "_info"]) {
				event.skillDialog = ui.create.dialog(str, '<div><div style="width:100%">' + lib.translate[skill + "_info"] + "</div></div>");
			}
		}
	}
	ok(node) {
		const gameEvent = get.event(),
			custom = gameEvent.custom,
			replaceConfirm = custom?.replace?.confirm;
		if (typeof replaceConfirm == "function") {
			replaceConfirm(true);
			return;
		}
		const result = (gameEvent.result = {
			buttons: ui.selected.buttons.slice(),
			cards: ui.selected.cards.slice(),
			targets: ui.selected.targets.slice(),
			confirm: "ok",
			bool: true,
			links: get.links(ui.selected.buttons),
		});
		if (node) {
			node.parentNode.close();
		}
		const skill = gameEvent.skill;
		if (skill) {
			result.skill = skill;
			const info = get.info(skill);
			if (info && info.direct && !info.clearTime) {
				result._noHidingTimer = true;
			}
			const skillInformation = get.info(gameEvent.skill),
				viewAs = skillInformation.viewAs;
			if (typeof viewAs == "function") {
				const viewedAs = viewAs(result.cards, gameEvent.player);
				if (viewedAs) {
					result.card = get.autoViewAs(viewedAs);
				}
			} else if (viewAs) {
				result.card = get.autoViewAs(viewAs);
			}
			const resultCard = result.card;
			if (resultCard) {
				const cards = result.cards;
				if (cards.length == 1) {
					const firstCard = cards[0];
					if (!resultCard.suit) {
						resultCard.suit = get.suit(firstCard);
					}
					if (!resultCard.number) {
						resultCard.number = get.number(firstCard);
					}
				}
			}
			const skillDialog = gameEvent.skillDialog;
			if (skillDialog && get.objtype(skillDialog) == "div") {
				skillDialog.close();
			}
			gameEvent.player.getCards("hej").forEach(card => card.recheck("useSkill"));
			gameEvent.restore();
		} else if (["chooseToUse", "chooseToRespond"].includes(gameEvent.name)) {
			result.card = get.autoViewAs(result.cards[0]);
		}
		if (ui.skills) {
			ui.skills.close();
		}
		if (ui.skills2) {
			ui.skills2.close();
		}
		if (ui.skills3) {
			ui.skills3.close();
		}
		game.uncheck();
		const addConfirm = custom?.add?.confirm;
		if (typeof addConfirm == "function") {
			addConfirm(true);
		}
		game.resume();
	}
	cancel(node) {
		var event = _status.event;
		if (typeof event.custom?.replace?.confirm == "function") {
			event.custom.replace.confirm(false);
			return;
		}
		if (event.skill && !event.norestore) {
			if (event.skillDialog && get.objtype(event.skillDialog) == "div") {
				event.skillDialog.close();
			}
			if (typeof event.dialog == "string" && event.isMine()) {
				event.dialog = ui.create.dialog(event.dialog);
			}
			if (_status.event.type == "phase" && ui.confirm) {
				ui.confirm.classList.add("removing");
			}
			// ui.control.addTempClass('nozoom',100);
			event.restore();
			var cards = event.player.getCards("hej");
			for (var i = 0; i < cards.length; i++) {
				cards[i].recheck("useSkill");
			}
			game.uncheck();
			game.check();
			return;
		}
		event.result = {
			confirm: "cancel",
			bool: false,
		};
		if (node) {
			node.parentNode.close();
		}
		if (ui.skills) {
			ui.skills.close();
		}
		if (ui.skills2) {
			ui.skills2.close();
		}
		if (ui.skills3) {
			ui.skills3.close();
		}
		game.uncheck();
		if (typeof event.custom?.add?.confirm == "function") {
			event.custom.add.confirm(true);
		}
		game.resume();
	}
	logv(e) {
		if (_status.currentlogv) {
			if (_status.currentlogv == this) {
				return;
			}
			if (_status.logvtimeout) {
				clearTimeout(_status.logvtimeout);
			}
			var that = this;
			_status.logvtimeout = setTimeout(function () {
				if (!_status.currentlogv) {
					_status.currentlogv = that;
					ui.click.intro.call(that, e);
				}
			}, 200);
			this.logvtimeout = _status.logvtimeout;
		} else {
			_status.currentlogv = this;
			ui.click.intro.call(this, e);
		}
	}
	logvleave() {
		if (_status.currentlogv == this) {
			setTimeout(function () {
				delete _status.currentlogv;
			}, 150);
		}
		if (this.logvtimeout) {
			clearTimeout(this.logvtimeout);
			if (_status.logvtimeout == this.logvtimeout) {
				delete _status.logvtimeout;
			}
			delete this.logvtimeout;
		}
	}
	charactercard(name, sourcenode, noedit, resume, avatar, audioName) {
		if (!audioName) {
			audioName = name;
		}
		if (_status.dragged) {
			return;
		}
		if (lib.config.theme != "simple") {
			ui.window.classList.add("shortcutpaused");
			ui.menuContainer.classList.add("forceopaque");
		} else {
			ui.window.classList.add("systempaused");
			ui.menuContainer.classList.add("transparent2");
		}
		if (lib.config.blur_ui) {
			ui.arena.classList.add("blur");
			ui.system.classList.add("blur");
			ui.menuContainer.classList.add("blur");
		}
		var layer = ui.create.div(".popup-container");
		var clicklayer = function (e) {
			if (_status.touchpopping) {
				return;
			}
			if (_status.dragged) {
				return;
			}
			ui.window.classList.remove("shortcutpaused");
			ui.window.classList.remove("systempaused");
			ui.menuContainer.classList.remove("forceopaque");
			ui.menuContainer.classList.remove("transparent2");
			ui.arena.classList.remove("blur");
			ui.system.classList.remove("blur");
			ui.menuContainer.classList.remove("blur");
			this.delete();
			e.stopPropagation();
			if (resume) {
				game.resume2();
			}
			return false;
		};
		var uiintro = ui.create.div(".menubg.charactercard", layer);
		var playerbg = ui.create.div(".menubutton.large.ava", uiintro);
		let iSTemp = false;
		if (!lib.character[audioName] && lib.characterSubstitute[name]?.some(skin => skin[0] == audioName)) {
			iSTemp = true;
			lib.character[audioName] = ["", "", 0, [], (lib.characterSubstitute[name].find(i => i[0] == audioName) || [audioName, []])[1]];
		}
		var bg = ui.create
			.div(".avatar", playerbg, function () {
				if (changeskinfunc) {
					changeskinfunc();
				}
			})
			.setBackground(audioName || name, "character");
		if (iSTemp) {
			delete lib.character[audioName];
		}
		var changeskinfunc = null;
		var nameskin = name;
		var nameskin2 = name;
		var gzbool = false;
		if (nameskin.startsWith("gz_shibing")) {
			nameskin = nameskin.slice(3, 11);
		} else if (nameskin.startsWith("gz_")) {
			nameskin = nameskin.slice(3);
			gzbool = true;
		}
		let refreshSkin = null;
		if (lib.config.change_skin) {
			let node, avatars;
			const info = get.character(name),
				src = get.skinPath(name); 
			if (src) {
				const createButtons = list => {
					if (!list.length) {
						return;
					}
					if (list.length >= 6) {
						avatars.classList.add("scroll");
						if (lib.config.touchscreen) {
							lib.setScroll(avatars);
						}
					}
					for (const i of ["originSkin", ...list]) {
						const button = ui.create.div(avatars, function () {
							playerbg.classList.remove("scroll");
							if (this._link) {
								const skinname = this._skinName,
									src = this._link;
								lib.config.skin[nameskin] = [skinname, src];
								if (lib.characterSubstitute[nameskin]) {
									for (const nameList of lib.characterSubstitute[nameskin]) {
										const subName = nameList[0],
											[fold, prefix] = skinname.split(".");
										lib.config.skin[subName] = [skinname, `${src.split("/").slice(0, -1).join("/")}/${fold}/${subName}.${prefix}`];
									}
								}
								bg.style.backgroundImage = this.style.backgroundImage;
								if (sourcenode) {
									sourcenode.style.backgroundImage = this.style.backgroundImage;
								}
								if (avatar) {
									avatar.style.backgroundImage = this.style.backgroundImage;
								}
								game.saveConfig("skin", lib.config.skin);
							} else {
								delete lib.config.skin[nameskin];
								if (lib.characterSubstitute[nameskin]) {
									for (const nameList of lib.characterSubstitute[nameskin]) {
										const subName = nameList[0];
										delete lib.config.skin[subName];
									}
								}
								if (gzbool && lib.character[nameskin2].hasSkinInGuozhan && lib.config.mode_config.guozhan.guozhanSkin) {
									bg.setBackground(audioName || nameskin2, "character");
									if (sourcenode) {
										sourcenode.setBackground(audioName || nameskin2, "character");
									}
									if (avatar) {
										avatar.setBackground(audioName || nameskin2, "character");
									}
								} else {
									bg.setBackground(audioName || nameskin, "character");
									if (sourcenode) {
										sourcenode.setBackground(audioName || nameskin, "character");
									}
									if (avatar) {
										avatar.setBackground(audioName || nameskin, "character");
									}
								}
								game.saveConfig("skin", lib.config.skin);
							}
							if (refreshSkin) {
								refreshSkin();
							}
							if (applyViewMode) {
								applyViewMode("intro");
							}
						});
						if (i == "originSkin") {
							if (gzbool && lib.character[nameskin2].hasSkinInGuozhan && lib.config.mode_config.guozhan.guozhanSkin) {
								button.setBackground(audioName || nameskin2, "character", "noskin");
							} else {
								button.setBackground(audioName || nameskin, "character", "noskin");
							}
						} else {
							const [skinname, src] = i;
							button._link = src;
							button._skinName = skinname;
							if (name == audioName) {
								button.setBackgroundImage(src);
							} else {
								const [fold, prefix] = skinname.split(".");
								button.setBackgroundImage(`${src.split("/").slice(0, -1).join("/")}/${fold}/${audioName}.${prefix}`)
							}
						}
					}
				};
				let defaultFolder = src;
				game.getFileList(defaultFolder, (folders, files) => {
					if (files.length && !node) {
						node = ui.create.div(".changeskin", "可换肤", playerbg);
						avatars = ui.create.div(".avatars", playerbg);
						changeskinfunc = function() {
							playerbg.classList.add("scroll");
							if (node._created) {
								return;
							}
							node._created = true;
							game.getFileList(defaultFolder, (folders, files) => {
								const list = files.map(file => {
									let src = `${defaultFolder}${file}`;
									return [file, src];
								})
								createButtons(list);
							}, () => {});
						};
					}
				}, () => {});
			}
		}
		var ban = ui.create.div(".menubutton.large.ban.character", uiintro, "禁用", function (e) {
			if (this.classList.contains("unselectable")) {
				return;
			}
			if (typeof noedit == "string") {
				this.classList.toggle("active");
				var bannedname = noedit + "_banned";
				if (!lib.config[bannedname]) {
					lib.config[bannedname] = [];
				}
				if (this.classList.contains("active")) {
					lib.config[bannedname].add(name);
				} else {
					lib.config[bannedname].remove(name);
				}
				game.saveConfig(bannedname, lib.config[bannedname]);
				ban.updateBanned();
			} else {
				ui.click.touchpop();
				ui.click.intro.call(this, e);
				_status.clicked = true;
			}
		});
		ban.link = name;
		ban._banning = "offline";
		ban.updateBanned = function () {
			if (noedit === true) {
				return;
			}
			if (lib.config[get.mode() + "_banned"] && lib.config[get.mode() + "_banned"].includes(name)) {
				ban.classList.add("active");
			} else {
				ban.classList.remove("active");
			}
			if (sourcenode && sourcenode.updateBanned) {
				sourcenode.updateBanned();
			}
		};
		ban.updateBanned();
		var fav = ui.create.div(".menubutton.large.fav", uiintro, "收藏", function () {
			if (this.classList.contains("unselectable")) {
				return;
			}
			this.classList.toggle("active");
			if (this.classList.contains("active")) {
				lib.config.favouriteCharacter.add(name);
			} else {
				lib.config.favouriteCharacter.remove(name);
			}
			game.saveConfig("favouriteCharacter", lib.config.favouriteCharacter);
		});
		if (noedit === true) {
			fav.classList.add("unselectable");
			ban.classList.add("unselectable");
		} else if (lib.config.favouriteCharacter.includes(name)) {
			fav.classList.add("active");
		}

		let intro,
			list = [],
			clickSkill;
		let skills = ui.create.div(".characterskill", uiintro);
		let btnIntro = ui.create.div(".menubutton.large.introButton", uiintro, "简介", function () {
			applyViewMode("intro");
		});
		let btnSkill = ui.create.div(".menubutton.large.skillButton", uiintro, "技能", function () {
			applyViewMode("skill");
		});
		const applyViewMode = function (viewMode = "intro") {
			// 控制显示的区域
			const intro2Node = uiintro.querySelector(".intro2");
			if (viewMode === "intro") {
				if (intro) intro.style.display = "";
				if (intro2Node) intro2Node.style.display = "none";
				if (skills) skills.style.display = "none";
			} else {
				if (intro) intro.style.display = "none";
				if (intro2Node) intro2Node.style.display = "";
				if (skills) {
					skills.style.display = "";
					// 若尚未选中技能，则初始化第一个技能
					const first = skills.firstChild;
					if (first && !skills.querySelector(".active") && typeof clickSkill === "function") {
						clickSkill.call(first, "init");
						first.classList.add("active");
					}
				}
			}
			if (btnIntro && btnSkill) {
				btnIntro.classList.toggle("active", viewMode === "intro");
				btnSkill.classList.toggle("active", viewMode === "skill");
			}
		};
		const refreshIntro = function () {
			if (intro?.firstChild) {
				while (intro.firstChild) {
					intro.removeChild(intro.lastChild);
				}
			}
			// 样式二
			if (lib.config.show_characternamepinyin == "showPinyin2" || lib.config.show_skillnamepinyin == "showPinyin2" || lib.config.show_characternamepinyin == "showCodeIdentifier2" || lib.config.show_skillnamepinyin == "showCodeIdentifier2") {
				var nameinfo = get.character(name);
				intro = uiintro.querySelector(".characterintro") || ui.create.div(".characterintro", get.characterIntro(name), uiintro);
				if (lib.config.show_characternamepinyin == "showPinyin2" || lib.config.show_characternamepinyin == "showCodeIdentifier2") {
					var charactername = get.rawName2(name);
					var characterpinyin = lib.config.show_characternamepinyin == "showCodeIdentifier2" ? name : get.pinyin(charactername);
					var charactersex = get.translation(nameinfo[0]);
					const charactergroups = get.is.double(name, true);
					let charactergroup;
					if (charactergroups) {
						charactergroup = charactergroups.map(i => get.translation(i)).join("/");
					} else {
						charactergroup = get.translation(nameinfo[1]);
					}
					var characterhp = nameinfo[2];
					var characterintroinfo = get.characterIntro(name);
					var spacemark = " | ";
					if (charactername.length > 3) {
						spacemark = '<span style="font-size:7px">' + " " + "</span>" + "|" + '<span style="font-size:7px">' + " " + "</span>";
					}
					// 获取武将称号
					var charactertitle = lib.characterTitle[name] || "";
					var titleHtml = "";
					if (charactertitle) {
						titleHtml = '<div class="character-title">' + get.colorspan(charactertitle) + '</div>';
					}
					intro.innerHTML = titleHtml + '<span style="font-weight:bold;margin-right:5px">' + charactername + "</span>" + '<span style="font-size:14px;font-family:SimHei,STHeiti,sans-serif">' + "[" + characterpinyin + "]" + "</span>" + spacemark + charactersex + spacemark + charactergroup + spacemark + characterhp + '<span style="line-height:2"></span>' + "<br>" + characterintroinfo;

					// 添加角色append
					if (lib.characterAppend[name]) {
						intro.innerHTML += '<br><br><span style="font-weight:bold;color:#ff6b6b;">引文</span><br>' + lib.characterAppend[name];
					}
				}


				var intro2 = uiintro.querySelector(".intro2") || ui.create.div(".characterintro.intro2", uiintro);
				list.addArray(get.character(name, 3) || []);
				if (lib.config.touchscreen) {
					lib.setScroll(intro);
					lib.setScroll(intro2);
					lib.setScroll(skills);
				}

				if (lib.config.mousewheel) {
					skills.onmousewheel = ui.click.mousewheel;
				}
				clickSkill = function (e) {
					while (intro2.firstChild) {
						intro2.removeChild(intro2.lastChild);
					}
					var current = this.parentNode.querySelector(".active");
					if (current) {
						current.classList.remove("active");
					}
					this.classList.add("active");
					if (this.link != "dieAudios") {
						var skillname = get.translation(this.link);
						var skilltranslationinfo = get.skillInfoTranslation(this.link, null, false);
						if ((lib.config.show_skillnamepinyin == "showPinyin2" || lib.config.show_skillnamepinyin == "showCodeIdentifier2") && skillname != "阵亡") {
							var skillpinyin = lib.config.show_skillnamepinyin == "showCodeIdentifier2" ? this.link : get.pinyin(skillname);
							intro2.innerHTML = '<span style="font-weight:bold;margin-right:5px">' + skillname + "</span>" + '<span style="font-size:14px;font-family:SimHei,STHeiti,sans-serif">' + "[" + skillpinyin + "]" + "</span>" + "  " + skilltranslationinfo;
						} else {
							intro2.innerHTML = '<span style="font-weight:bold;margin-right:5px">' + skillname + "</span>" + skilltranslationinfo;
						}
						var info = get.info(this.link);
						var skill = this.link;
						var playername = this.linkname;
						let audioName = this.linkAudioName;
						let skinName = bg.tempSkin || audioName;
						var skillnode = this;
						if (info.derivation) {
							var derivation = info.derivation;
							if (typeof derivation == "string") {
								derivation = [derivation];
							}
							for (var i = 0; i < derivation.length; i++) {
								if (derivation[i].indexOf("_faq") == -1 && !get.info(derivation[i]).nopop) {
									continue;
								}
								var derivationname = get.translation(derivation[i]);
								var derivationtranslationinfo = get.skillInfoTranslation(derivation[i], null, false);
								if ((lib.config.show_skillnamepinyin == "showPinyin2" || lib.config.show_skillnamepinyin == "showCodeIdentifier2") && derivationname.length <= 5 && derivation[i].indexOf("_faq") == -1) {
									var derivationpinyin = lib.config.show_skillnamepinyin == "showCodeIdentifier2" ? derivation[i] : get.pinyin(derivationname);
									intro2.innerHTML += '<br><br><span style="font-weight:bold;margin-right:5px">' + derivationname + "</span>" + '<span style="font-size:14px;font-family:SimHei,STHeiti,sans-serif">' + "[" + derivationpinyin + "]" + "</span>" + "  " + derivationtranslationinfo;
								} else {
									intro2.innerHTML += '<br><br><span style="font-weight:bold;margin-right:5px">' + derivationname + "</span>" + derivationtranslationinfo;
								}
							}
						}

						// 添加技能append
						if (lib.translate[this.link + "_append"]) {
							intro2.innerHTML += '<br><br><span style="font-weight:bold;color:#ff6b6b;">引文</span><br>';
							const appendDiv = document.createElement("div");
							appendDiv.style.fontSize = "15.2px";
							appendDiv.innerHTML = lib.translate[this.link + "_append"];
							intro2.appendChild(appendDiv);
						}

						// 添加技能台词
						let skillVoiceMap = get.Audio.skill({ skill: this.link, player: { name: playername, skin: { name: skinName }, tempname: [skinName] } }).textList;
						if (skillVoiceMap.length > 0) {
							intro2.innerHTML += '<br><br><span style="font-weight:bold;color:#ff6b6b;">技能台词</span>';
							skillVoiceMap.forEach((text, index) => {
								const skillTextSpan = document.createElement("span");
								skillTextSpan.style.fontSize = "15.2px";
								skillTextSpan.innerHTML = `<br>${skillVoiceMap.length > 1 ? `${index + 1}. ` : ""}${text}`;
								intro2.appendChild(skillTextSpan);
							});
						}

						// 添加衍生技能台词
						if (info.derivation) {
							var derivation = info.derivation;
							if (typeof derivation == "string") {
								derivation = [derivation];
							}
							for (var i = 0; i < derivation.length; i++) {
								if (!get.info(derivation[i]).nopop) {
									continue;
								}
								if (derivation[i].indexOf("_faq") != -1) {
									continue;
								}
								if (nameinfo.skills.includes(derivation[i])) {
									continue;
								}
								let derivationVoiceMap = get.Audio.skill({ skill: derivation[i], player: { name: playername, skin: { name: skinName }, tempname: [skinName] } }).textList;
								if (derivationVoiceMap.length > 0) {
									intro2.innerHTML += '<br><br><span style="font-weight:bold;color:#ff6b6b;">' + get.translation(derivation[i]) + '台词</span>';
									derivationVoiceMap.forEach((text, index) => {
										const derivationTextSpan = document.createElement("span");
										derivationTextSpan.style.fontSize = "15.2px";
										derivationTextSpan.innerHTML = `<br>${derivationVoiceMap.length > 1 ? `${index + 1}. ` : ""}${text}`;
										intro2.appendChild(derivationTextSpan);
									});
								}
							}
						}

						if (lib.config.background_speak && e !== "init") {
							if (!this.playAudio || name != this.audioName) {
								const audioList = get.Audio.skill({ skill: this.link, player: { name: playername, skin: { name: skinName }, tempname: [skinName] } }).fileList;
								this.playAudio = game.tryAudio({
									audioList,
									addVideo: false,
									random: false,
									autoplay: false,
								});
								this.audioName = name;
							}
							this.playAudio();
						}
					} else {
						let skinName2 = bg.tempSkin || this.linkname;
						let dieAudios3 = get.Audio.die({ player: { name: this.playername, skin: { name: skinName2 }, tempname: [skinName2] } }).audioList.map((i3) => i3.text).filter(Boolean);
						intro2.innerHTML = '<span style="font-weight:bold;margin-right:5px">阵亡台词</span>';
						dieAudios3.forEach((text, index) => {
							const dieTextSpan = document.createElement("span");
							dieTextSpan.style.fontSize = "15.2px";
							dieTextSpan.innerHTML = `<br>${dieAudios3.length > 1 ? `${index + 1}. ` : ""}${text}`;
							intro2.appendChild(dieTextSpan);
						});
						if (lib.config.background_speak && e !== "init") {
							if (!this.playAudio || name != this.audioName) {
								let audioList = get.Audio.die({ player: { name: this.playername, skin: { name: skinName2 }, tempname: [skinName2] } }).fileList;
								this.playAudio = game.tryAudio({
									audioList,
									addVideo: false,
									random: false,
									autoplay: false,
								});
								this.audioName = name;
							}
							this.playAudio();
						}
					}
				};
			} else {
				// 样式一
				//TODO: 这里的数据也暂时没有改成新格式，需要后续的修改
				const nameInfo = get.character(name),
					showCharacterNamePinyin = lib.config.show_characternamepinyin;
				intro = uiintro.querySelector(".characterintro") || ui.create.div(".characterintro", uiintro);
				// 添加武将称号
				if (lib.characterTitle[name]) {
					const titleDiv = document.createElement("div");
					titleDiv.className = "character-title";
					titleDiv.innerHTML = get.colorspan(lib.characterTitle[name]);
					intro.appendChild(titleDiv);
					// 添加分隔线
					const hr = document.createElement("hr");
					hr.style.marginTop = "5px";
					hr.style.marginBottom = "5px";
					intro.appendChild(hr);
				}
				if (showCharacterNamePinyin != "doNotShow") {
					const characterIntroTable = ui.create.div(".character-intro-table", intro),
						span = document.createElement("span");
					span.style.fontWeight = "bold";
					const exInfo = nameInfo.trashBin,
						characterName = exInfo && exInfo.includes("ruby") ? lib.translate[name] : get.rawName2(name);
					span.innerHTML = characterName;
					const ruby = document.createElement("ruby");
					ruby.appendChild(span);
					const leftParenthesisRP = document.createElement("rp");
					leftParenthesisRP.textContent = "（";
					ruby.appendChild(leftParenthesisRP);
					const rt = document.createElement("rt");
					rt.innerHTML = showCharacterNamePinyin == "showCodeIdentifier" ? name : lib.translate[`${name}_rt`] || get.pinyin(characterName).join(" ");
					ruby.appendChild(rt);
					const rightParenthesisRP = document.createElement("rp");
					rightParenthesisRP.textContent = "）";
					ruby.appendChild(rightParenthesisRP);
					characterIntroTable.appendChild(ruby);
					const characterSexDiv = ui.create.div(".character-sex", characterIntroTable),
						exInfoSex = exInfo && exInfo.find(value => value.startsWith("sex:")),
						characterSex = exInfoSex ? exInfoSex.split(":").pop() : nameInfo[0];
					new Promise((resolve, reject) => {
						const imageName = `sex_${characterSex}`,
							information = lib.card[imageName];
						if (!information) {
							resolve(`${lib.assetURL}image/card/${imageName}.png`);
							return;
						}
						const image = information.image;
						if (!image) {
							resolve(`${lib.assetURL}image/card/${imageName}.png`);
						} else if (image.startsWith("db:")) {
							game.getDB("image", image.slice(3)).then(resolve, reject);
						} else if (image.startsWith("ext:")) {
							resolve(`${lib.assetURL}${image.replace(/^ext:/, "extension/")}`);
						} else {
							resolve(`${lib.assetURL}${image}`);
						}
					})
						.then(
							source =>
								new Promise((resolve, reject) => {
									const image = new Image();
									image.onload = () => resolve(image);
									image.onerror = reject;
									image.src = source;
								})
						)
						.then(image => characterSexDiv.appendChild(image))
						.catch(() => (characterSexDiv.innerHTML = get.translation(characterSex)));
					const characterGroupDiv = ui.create.div(".character-group", characterIntroTable),
						characterGroups = get.is.double(name, true);
					if (characterGroups) {
						Promise.all(
							characterGroups.map(characterGroup =>
								Promise.resolve()
									.then(async () => {
										const imageName = `group_${characterGroup}`,
											information = lib.card[imageName];
										if (!information) {
											return `${lib.assetURL}image/card/${imageName}.png`;
										}
										const image = information.image;
										if (!image) {
											return `${lib.assetURL}image/card/${imageName}.png`;
										}
										if (image.startsWith("db:")) {
											return await game.getDB("image", image.slice(3));
										}
										if (image.startsWith("ext:")) {
											return `${lib.assetURL}${image.replace(/^ext:/, "extension/")}`;
										}
										return `${lib.assetURL}${image}`;
									})
									.then(
										source =>
											new Promise((resolve, reject) => {
												const image = new Image();
												image.onload = () => resolve(image);
												image.onerror = reject;
												image.src = source;
											})
									)
							)
						)
							.then(images => {
								let documentFragment = document.createDocumentFragment();
								images.forEach(documentFragment.appendChild, documentFragment);
								characterGroupDiv.appendChild(documentFragment);
							})
							.catch(() => (characterGroupDiv.innerHTML = characterGroups.map(characterGroup => get.translation(characterGroup)).join("/")));
					} else {
						const characterGroup = nameInfo[1];
						Promise.resolve()
							.then(async () => {
								const imageName = `group_${characterGroup}`,
									information = lib.card[imageName];
								if (!information) {
									return `${lib.assetURL}image/card/${imageName}.png`;
								}
								const image = information.image;
								if (!image) {
									return `${lib.assetURL}image/card/${imageName}.png`;
								}
								if (image.startsWith("db:")) {
									return await game.getDB("image", image.slice(3));
								}
								if (image.startsWith("ext:")) {
									return `${lib.assetURL}${image.replace(/^ext:/, "extension/")}`;
								}
								return `${lib.assetURL}${image}`;
							})
							.then(
								source =>
									new Promise((resolve, reject) => {
										const image = new Image();
										image.onload = () => resolve(image);
										image.onerror = reject;
										image.src = source;
									})
							)
							.then(image => characterGroupDiv.appendChild(image))
							.catch(() => (characterGroupDiv.innerHTML = get.translation(characterGroup)));
					}
					const hpDiv = ui.create.div(".hp", characterIntroTable),
						nameInfoHP = nameInfo[2],
						infoHP = get.infoHp(nameInfoHP);
					hpDiv.dataset.condition = infoHP < 4 ? "mid" : "high";
					ui.create.div(hpDiv);
					const hpTextDiv = ui.create.div(".text", hpDiv),
						infoMaxHP = get.infoMaxHp(nameInfoHP);
					hpTextDiv.innerHTML = infoHP == infoMaxHP ? `×${infoHP}` : `×${infoHP}/${infoMaxHP}`;
					const infoShield = get.infoHujia(nameInfoHP);
					if (infoShield) {
						ui.create.div(".shield", hpDiv);
						const shieldTextDiv = ui.create.div(".text", hpDiv);
						shieldTextDiv.innerHTML = `×${infoShield}`;
					}
					intro.appendChild(document.createElement("hr"));
				}
				const htmlParser = document.createElement("body");
				htmlParser.innerHTML = get.characterIntro(name);
				Array.from(htmlParser.childNodes).forEach(value => intro.appendChild(value));

				// 添加角色append
				if (lib.characterAppend[name]) {
					intro.innerHTML += '<br><br><span style="font-weight:bold;color:#ff6b6b;">引文</span><br>' + lib.characterAppend[name];
				}


				const introduction2 = uiintro.querySelector(".intro2") || ui.create.div(".characterintro.intro2", uiintro);
				list.addArray(get.character(name).skills || []);
				if (lib.config.touchscreen) {
					lib.setScroll(intro);
					lib.setScroll(introduction2);
					lib.setScroll(skills);
				}

				if (lib.config.mousewheel) {
					skills.onmousewheel = ui.click.mousewheel;
				}
				clickSkill = function (e) {
					while (introduction2.firstChild) {
						introduction2.removeChild(introduction2.lastChild);
					}
					var current2 = this.parentNode.querySelector(".active");
					if (current2) {
						current2.classList.remove("active");
					}
					this.classList.add("active");
					if (this.link != "dieAudios") {
						const skillNameSpan = document.createElement("span"), skillNameSpanStyle = skillNameSpan.style;
						skillNameSpanStyle.fontWeight = "bold";
						const link = this.link, skillName = get.translation(link);
						skillNameSpan.innerHTML = skillName;
						const showSkillNamePinyin = lib.config.show_skillnamepinyin;
						if (showSkillNamePinyin != "doNotShow" && skillName != "阵亡") {
							const ruby = document.createElement("ruby");
							ruby.appendChild(skillNameSpan);
							const leftParenthesisRP = document.createElement("rp");
							leftParenthesisRP.textContent = "（";
							ruby.appendChild(leftParenthesisRP);
							const rt = document.createElement("rt");
							rt.innerHTML = showSkillNamePinyin == "showCodeIdentifier" ? link : lib.translate[`${link}_rt`] || get.pinyin(skillName).join(" ");
							ruby.appendChild(rt);
							const rightParenthesisRP = document.createElement("rp");
							rightParenthesisRP.textContent = "）";
							ruby.appendChild(rightParenthesisRP);
							const div = ui.create.div(introduction2);
							div.style.marginRight = "5px";
							div.appendChild(ruby);
						} else {
							skillNameSpanStyle.marginRight = "5px";
							introduction2.appendChild(skillNameSpan);
						}
						htmlParser.innerHTML = get.skillInfoTranslation(this.link, null, false);
						Array.from(htmlParser.childNodes).forEach((childNode) => introduction2.appendChild(childNode));
						var info = get.info(this.link);
						var skill = this.link;
						var playername = this.linkname;
						let audioName2 = this.linkAudioName;
						let skinName2 = bg.tempSkin || audioName2;
						var skillnode = this;
						let derivations = info.derivation;
						if (derivations) {
							if (typeof derivations == "string") {
								derivations = [derivations];
							}
							derivations.forEach((derivation) => {
								if (derivation.indexOf("_faq") == -1 && !get.info(derivation).nopop) {
									return false;
								}
								introduction2.appendChild(document.createElement("br"));
								introduction2.appendChild(document.createElement("br"));
								const derivationNameSpan = document.createElement("span"), derivationNameSpanStyle = derivationNameSpan.style;
								derivationNameSpanStyle.fontWeight = "bold";
								const derivationName = get.translation(derivation);
								derivationNameSpan.innerHTML = derivationName;
								if (showSkillNamePinyin != "doNotShow" && derivationName.length <= 5 && derivation.indexOf("_faq") == -1) {
									const ruby = document.createElement("ruby");
									ruby.appendChild(derivationNameSpan);
									const leftParenthesisRP = document.createElement("rp");
									leftParenthesisRP.textContent = "（";
									ruby.appendChild(leftParenthesisRP);
									const rt = document.createElement("rt");
									rt.innerHTML = showSkillNamePinyin == "showCodeIdentifier" ? derivation : lib.translate[`${derivation}_rt`] || get.pinyin(derivationName).join(" ");
									ruby.appendChild(rt);
									const rightParenthesisRP = document.createElement("rp");
									rightParenthesisRP.textContent = "）";
									ruby.appendChild(rightParenthesisRP);
									const div = ui.create.div(introduction2);
									div.style.marginRight = "5px";
									div.appendChild(ruby);
								} else {
									derivationNameSpanStyle.marginRight = "5px";
									introduction2.appendChild(derivationNameSpan);
								}
								htmlParser.innerHTML = get.skillInfoTranslation(derivation, null, false);
								Array.from(htmlParser.childNodes).forEach((childNode) => introduction2.appendChild(childNode));
							});
						}

						// 添加技能append
						if (lib.translate[this.link + "_append"]) {
							introduction2.innerHTML += '<br><br><span style="font-weight:bold;color:#ff6b6b;">引文</span><br>';
							const appendDiv = document.createElement("div");
							appendDiv.style.fontSize = "15.2px";
							appendDiv.innerHTML = lib.translate[this.link + "_append"];
							introduction2.appendChild(appendDiv);
						}

						// 添加技能台词
						let skillVoiceMap = get.Audio.skill({ skill: this.link, player: { name: playername, skin: { name: skinName2 }, tempname: [skinName2] } }).textList;
						if (skillVoiceMap.length > 0) {
							introduction2.innerHTML += '<br><br><span style="font-weight:bold;color:#ff6b6b;">技能台词</span>';
							skillVoiceMap.forEach((text, index) => {
								const skillTextSpan = document.createElement("span");
								skillTextSpan.style.fontSize = "15.2px";
								skillTextSpan.innerHTML = `<br>${skillVoiceMap.length > 1 ? `${index + 1}. ` : ""}${text}`;
								introduction2.appendChild(skillTextSpan);
							});
						}

						// 添加衍生技能台词
						/*if (info.derivation) {
							var derivation = info.derivation;
							if (typeof derivation == "string") {
								derivation = [derivation];
							}
							for (var i2 = 0; i2 < derivation.length; i2++) {
								if (derivation[i2].indexOf("_faq") != -1) {
									continue;
								}
								if (nameInfo.skills.includes(derivation[i2])) {
									continue;
								}
								let derivationVoiceMap = get.Audio.skill({ skill: derivation[i2], player: { name: playername, skin: { name: skinName2 }, tempname: [skinName2] } }).textList;
								if (derivationVoiceMap.length > 0) {
									introduction2.innerHTML += '<br><br><span style="font-weight:bold;color:#ff6b6b;">' + get.translation(derivation[i2]) + '台词</span>';
									derivationVoiceMap.forEach((text, index) => {
										const derivationTextSpan = document.createElement("span");
										derivationTextSpan.style.fontSize = "15.2px";
										derivationTextSpan.innerHTML = `<br>${derivationVoiceMap.length > 1 ? `${index + 1}. ` : ""}${text}`;
										introduction2.appendChild(derivationTextSpan);
									});
								}
							}
						}*/

						if (lib.config.background_speak && e !== "init") {
							if (!this.playAudio || name != this.audioName) {
								const audioList = get.Audio.skill({ skill: this.link, player: { name: playername, skin: { name: skinName2 }, tempname: [skinName2] } }).fileList;
								this.playAudio = game.tryAudio({
									audioList,
									addVideo: false,
									random: false,
									autoplay: false
								});
								this.audioName = name;
							}
							this.playAudio();
						}
					} else {
						let skinName2 = bg.tempSkin || this.linkname;
						let dieAudios3 = get.Audio.die({ player: { name: this.playername, skin: { name: skinName2 }, tempname: [skinName2] } }).audioList.map((i2) => i2.text).filter(Boolean);
						introduction2.innerHTML = '<span style="font-weight:bold;margin-right:5px">阵亡台词</span>';
						dieAudios3.forEach((text, index) => {
							const dieTextSpan = document.createElement("span");
							dieTextSpan.style.fontSize = "15.2px";
							dieTextSpan.innerHTML = `<br>${dieAudios3.length > 1 ? `${index + 1}. ` : ""}${text}`;
							introduction2.appendChild(dieTextSpan);
						});
						if (lib.config.background_speak && e !== "init") {
							if (!this.playAudio || name != this.audioName) {
								let audioList = get.Audio.die({ player: { name: this.playername, skin: { name: skinName2 }, tempname: [skinName2] } }).fileList;
								this.playAudio = game.tryAudio({
									audioList,
									addVideo: false,
									random: false,
									autoplay: false
								});
								this.audioName = name;
							}
							this.playAudio();
						}
					}
				};
			}
		};
		refreshIntro();
		// 默认显示人物简介
		applyViewMode("intro");

		// 创建皮肤容器并添加到intro底部
		if (lib.characterSubstitute[name]) {
			refreshSkin = function() {
				if (!intro) {
					intro = uiintro.querySelector(".characterintro");
				}
				if (intro) {
					intro.style.display = "flex";
					intro.style.flexDirection = "column";
					let contentWrapper = ui.create.div(".intro-content-wrapper");
					contentWrapper.style.flex = "1";
					while (intro.firstChild) {
						contentWrapper.appendChild(intro.firstChild);
					}
					intro.appendChild(contentWrapper);
					// 清除已有皮肤
					delete bg.tempSkin;
					const skillButtons = document.getElementsByClassName("characterskill")?.[0]?.childNodes;
					if (skillButtons) {
						for (let i = 0; i < skillButtons.length; i++) {
							delete skillButtons[i].playAudio;
						}
					}
					const currentSkinsContainer = intro.querySelector(".skins-container");
					if (currentSkinsContainer) {
						currentSkinsContainer.remove();
					}
					// 创建皮肤容器
					let skinsContainer = ui.create.div(".skins-container", intro);
					skinsContainer.style.marginTop = "auto";
					skinsContainer.style.paddingTop = "20px";
					// 创建皮肤列表
					let skinsList = ui.create.div(".skins-list.horizontal", skinsContainer);
					skinsList.style.display = "flex";
					skinsList.style.flexWrap = "wrap";
					skinsList.style.gap = "8px";
					skinsList.style.justifyContent = "flex-start";
					let skinList = lib.characterSubstitute[name];
					let skinButtonList = [name, ...skinList.map(skin => skin[0])];
					for (let skinName of skinButtonList) {
						let skinButton = ui.create.div(".skin-button", skinsList, function () {
							bg.style.backgroundImage = this.style.backgroundImage;
							bg.tempSkin = this.name;
							const skillButtons = document.getElementsByClassName("characterskill")?.[0]?.childNodes;
							if (skillButtons) {
								for (let i = 0; i < skillButtons.length; i++) {
									delete skillButtons[i].playAudio;
								}
							}
							const currentSkinsContainer = intro.querySelector(".skins-container");
							if (currentSkinsContainer) {
								currentSkinsContainer.remove();
							}
							const currentWrapper = intro.querySelector(".intro-content-wrapper");
							if (currentWrapper) {
								while (intro.firstChild) {
									intro.removeChild(intro.firstChild);
								}
								while (currentWrapper.firstChild) {
									intro.appendChild(currentWrapper.firstChild);
								}
							}
							refreshIntro();
							intro.style.display = "flex";
							intro.style.flexDirection = "column";
							let newWrapper = ui.create.div(".intro-content-wrapper");
							newWrapper.style.flex = "1";
							while (intro.firstChild && (!intro.firstChild.classList || !intro.firstChild.classList.contains("skins-container"))) {
								newWrapper.appendChild(intro.firstChild);
							}
							if (intro.firstChild) {
								intro.insertBefore(newWrapper, intro.firstChild);
							} else {
								intro.appendChild(newWrapper);
							}
							if (currentSkinsContainer) {
								intro.appendChild(currentSkinsContainer);
							}

							game.callHook("refreshSkin", [skinButtonList[0], this.name]);
						});
						skinButton.name = skinName;
						skinButton.style.width = "80px";
						skinButton.style.height = "110px";
						skinButton.style.borderRadius = "4px";
						skinButton.style.backgroundSize = "cover";
						skinButton.style.backgroundPosition = "50% 0";
						skinButton.style.boxShadow = "rgba(0, 0, 0, 0.2) 0 0 0 1px, rgba(0, 0, 0, 0.45) 0 0 5px";
						skinButton.style.cursor = "pointer";
						let iSTemp = false;
						if (!lib.character[skinName] && skinList.some(skin => skin[0] == skinName)) {
							iSTemp = true;
							lib.character[skinName] = get.convertedCharacter(["", "", 0, [], (skinList.find(skin => skin[0] == skinName) || [skinName, []])[1]]);
						}
						const skinImg = !lib.config.skin[skinName] && lib.character[skinName]?.img;
						skinImg ? skinButton.setBackgroundImage(skinImg) : skinButton.setBackground(skinName, "character");
						if (iSTemp) {
							delete lib.character[skinName];
						}
					}
				}
			};
			refreshSkin();
		}
		var initskill = false;
		let deri = [];
		for (var i = 0; i < list.length; i++) {
			if (get.info(list[i])?.nopop) {
				continue;
			}
			if (!lib.translate[list[i]] || !lib.translate[list[i] + "_info"]) {
				continue;
			}
			var skilltrans = get.translation(list[i]);
			if (skilltrans.startsWith("&nbsp;")) {
				skilltrans = skilltrans.slice(6);
			}
			var current = ui.create.div(".menubutton.large", skills, clickSkill, skilltrans);
			current.link = list[i];
			current.linkname = name;
			current.linkAudioName = audioName;
			if (!initskill) {
				initskill = true;
				clickSkill.call(current, "init");
			}
			let derivations = get.info(list[i]).derivation;
			if (derivations) {
				if (!Array.isArray(derivations)) {
					derivations = [derivations];
				}
				deri.addArray(derivations);
			}
		}
		let border = get.groupnature(get.bordergroup(name), "raw");
		for (let skill of deri) {
			if (list.includes(skill)) {
				continue;
			}
			let info = get.info(skill);
			if (info?.nopop) {
				continue;
			}
			if (!lib.translate[skill] || !lib.translate[skill + "_info"]) {
				continue;
			}
			if (skill.indexOf("_faq") != -1) {
				continue;
			}
			let tran = get.translation(skill);
			if (tran.startsWith("&nbsp;")) {
				tran = tran.slice(6);
			}
			tran = `<span data-nature="${border}">${tran}</span>`;
			let currentx = ui.create.div(".menubutton.large", skills, clickSkill, tran);
			currentx.link = skill;
			currentx.linkname = name;
			currentx.linkAudioName = audioName;
			if (!initskill) {
				initskill = true;
				clickSkill.call(currentx, "init");
			}
		}
		let dieAudios = get.Audio.die({ player: { name: name, skin: { name: bg.tempSkin || audioName } } })
			.audioList.map(i => i.text)
			.filter(Boolean);
		if (dieAudios.length) {
			let dieaudio = ui.create.div(".menubutton.large", skills, clickSkill, "阵亡");
			dieaudio.style.backgroundColor = "rgb(0, 0, 0, 1)";
			dieaudio.link = "dieAudios";
			dieaudio.dieAudios = dieAudios;
			dieaudio.playername = name;
			dieaudio.linkname = audioName;
		}

		uiintro.addEventListener(lib.config.touchscreen ? "touchend" : "click", ui.click.touchpop);
		layer.addEventListener(lib.config.touchscreen ? "touchend" : "click", clicklayer);
		ui.window.appendChild(layer);
	}
	intro(e) {
		if (_status.dragged) {
			return;
		}
		_status.clicked = true;
		if (this.classList.contains("player") && !this.name) {
			return;
		}
		if (this.parentNode == ui.historybar) {
			if (ui.historybar.style.zIndex == "22") {
				if (_status.removePop) {
					if (_status.removePop(this) == false) {
						return;
					}
				} else {
					return;
				}
			}
			ui.historybar.style.zIndex = 22;
		}
		var uiintro;
		if (this.classList.contains("card") && this.parentNode && this.parentNode.classList.contains("equips") && get.is.phoneLayout() && !get.is.mobileMe(this.parentNode.parentNode)) {
			uiintro = get.nodeintro(this.parentNode.parentNode, false, e);
		}
		uiintro = uiintro || get.nodeintro(this, false, e);
		if (!uiintro) {
			return;
		}
		uiintro.classList.add("popped");
		uiintro.classList.add("static");
		ui.window.appendChild(uiintro);
		var layer = ui.create.div(".poplayer", ui.window);
		var clicklayer = function (e) {
			if (_status.touchpopping) {
				return;
			}
			delete ui.throwEmotion;
			delete _status.removePop;
			game.closePoptipDialog();
			uiintro.delete();
			this.remove();
			ui.historybar.style.zIndex = "";
			delete _status.currentlogv;
			if (!ui.arena.classList.contains("menupaused") && !uiintro.noresume) {
				game.resume2();
			}
			if (e && e.stopPropagation) {
				e.stopPropagation();
			}
			if (uiintro._onclose) {
				uiintro._onclose();
			}
			return false;
		};
		layer.addEventListener(lib.config.touchscreen ? "touchend" : "click", clicklayer);
		if (!lib.config.touchscreen) {
			layer.oncontextmenu = clicklayer;
		}
		if (this.parentNode == ui.historybar && lib.config.touchscreen) {
			var rect = this.getBoundingClientRect();
			e = { clientX: 0, clientY: rect.top + 30 };
		}
		lib.placePoppedDialog(uiintro, e);
		if (this.parentNode == ui.historybar) {
			if (lib.config.show_history == "right") {
				uiintro.style.left = ui.historybar.offsetLeft - 230 + "px";
			} else {
				uiintro.style.left = ui.historybar.offsetLeft + 60 + "px";
			}
		}
		uiintro.style.zIndex = 21;
		var clickintro = function (e) {
			const poptip = e.relatedTarget?.parentNode?.parentNode;
			const isPoptip = e.target?.matches("noname-poptip") || (poptip && poptip === _status.poptip?.[0]);
			if (_status.touchpopping || isPoptip) {
				return;
			}
			delete _status.removePop;
			game.closePoptipDialog();
			layer.remove();
			this.delete();
			ui.historybar.style.zIndex = "";
			delete _status.currentlogv;
			if (!ui.arena.classList.contains("menupaused") && !uiintro.noresume) {
				game.resume2();
			}
			if (uiintro._onclose) {
				uiintro._onclose();
			}
		};
		var currentpop = this;
		_status.removePop = function (node) {
			if (node == currentpop) {
				return false;
			}
			layer.remove();
			uiintro.delete();
			delete _status.removePop;
			return true;
		};
		if (uiintro.clickintro) {
			uiintro.listen(function () {
				_status.clicked = true;
			});
			uiintro._clickintro = clicklayer;
		} else if (!lib.config.touchscreen) {
			uiintro.addEventListener("mouseleave", clickintro);
			uiintro.addEventListener("click", clickintro);
		} else if (uiintro.touchclose) {
			uiintro.listen(clickintro);
		}
		uiintro._close = clicklayer;

		game.pause2();
		return uiintro;
	}
	intro2() {
		if (ui.intro) {
			ui.intro.close();
			if (ui.intro.source == this) {
				delete ui.intro;
				ui.control.show();
				game.resume2();
				return;
			}
		}
	}
	auto() {
		if (!ui || !ui.auto || (ui.auto.classList.contains("hidden") && arguments[0] !== "forced")) {
			return;
		}
		if (_status.paused2) {
			return;
		}
		ui.click.shortcut(false);
		if (!_status.auto) {
			_status.auto = true;
			ui.auto.classList.add("glow");
			ui.arena.classList.add("auto");
			if (_status.imchoosing && _status.paused) {
				if (ui.confirm) {
					ui.confirm.close();
				}
				ui.control.hide();
				if (_status.event.switchToAuto) {
					_status.event.switchToAuto();
				} else {
					if (_status.paused && _status.imchoosing) {
						game.uncheck();
						_status.event.redo();
						if (_status.event.skill && !_status.event.norestore) {
							_status.event.restore();
						}
					}
				}
				game.resume();
			} else if (_status.event.switchToAuto) {
				_status.event.switchToAuto();
			}
			if (game.online) {
				game.send("auto");
			} else if (_status.connectMode) {
				game.broadcastAll(function (player) {
					player.setNickname(player.nickname + " - 托管");
				}, game.me);
			}
		} else {
			if (game.notMe) {
				return;
			}
			ui.control.show();
			_status.auto = false;
			ui.auto.classList.remove("glow");
			ui.arena.classList.remove("auto");

			if (game.online) {
				game.send("unauto");
			} else if (_status.connectMode) {
				game.broadcastAll(function (player) {
					player.setNickname(player.nickname);
				}, game.me);
			}
		}
	}
	wuxie() {
		if (this.classList.contains("hidden")) {
			return;
		}
		this.classList.toggle("glow");
		if (this.classList.contains("glow") && _status.event.type == "wuxie" && _status.event.isMine() && ui.confirm && _status.imchoosing) {
			ui.click.cancel(ui.confirm.lastChild);
		}
	}
	tempnowuxie() {
		if (this.classList.contains("hidden")) {
			return;
		}
		this.classList.toggle("glow");
		if (this.classList.contains("glow") && _status.event.type == "wuxie" && _status.event.isMine() && ui.confirm && _status.imchoosing) {
			var triggerevent = _status.event.getTrigger();
			if (triggerevent && this._origin == triggerevent.parent.id) {
				if (triggerevent.targets && triggerevent.num == triggerevent.targets.length - 1) {
					this.close();
				}
			}
			ui.click.cancel(ui.confirm.lastChild);
		}
	}
	pause() {
		if (lib.config.test_game) {
			return;
		}
		if (_status.paused2 || _status.pausing || _status.nopause || !ui.pause) {
			return;
		}
		if (!_status.video) {
			if (ui.pause.classList.contains("hidden")) {
				return;
			}
			if (!_status.gameStarted) {
				return;
			}
		}
		ui.system.hide();
		game.pause2();
		var node = ui.create.pause();
		if (!node) {
			return;
		}
		node.addTempClass("start");
		ui.sidebar3.innerHTML = "";
		if (lib.config.show_discardpile) {
			for (var i = 0; i < ui.discardPile.childNodes.length; i++) {
				var div = ui.create.div(ui.sidebar3);
				div.innerHTML = get.translation(ui.discardPile.childNodes[i]);
				ui.sidebar3.insertBefore(div, ui.sidebar3.firstChild);
			}
		}
		node.appendChild(ui.sidebar);
		node.appendChild(ui.sidebar3);
		ui.historybar.classList.add("paused");
		ui.arena.classList.add("paused");
		ui.window.classList.add("touchinfohidden");
		ui.time.hide();
		if (game.onpause) {
			game.onpause();
		}
	}
	resume(e) {
		if (_status.pausing) {
			return;
		}
		if (_status.dragged) {
			return;
		}
		if (_status.clicked) {
			return;
		}
		if (lib.config.test_game) {
			return;
		}
		this.delete();
		ui.system.show();
		ui.time.show();
		ui.historybar.classList.remove("paused");
		ui.arena.classList.remove("paused");
		ui.window.classList.remove("touchinfohidden");
		game.resume2();
		e.stopPropagation();
		if (game.onresume) {
			game.onresume();
		}
		return false;
	}
	config() {
		if (!ui.click.configMenu) {
			return;
		}
		if (_status.paused2) {
			_status.config2 = false;
		} else {
			_status.config2 = true;
		}

		_status.clicked = true;
		game.pause2();
		ui.click.configMenu();
		ui.system1.classList.remove("shown");
		ui.system2.classList.remove("shown");
	}
	swap() {
		if (_status.dragged) {
			return;
		}
		if (this.classList.contains("dead")) {
			return;
		}
		if (_status.over) {
			return;
		}
		if (ui.auto) {
			ui.auto.show();
		}
		if (ui.wuxie) {
			ui.wuxie.show();
		}
		game.swapPlayer(this);
	}
	mousewheel(evt) {
		if (this.firstElementChild && this.firstElementChild.classList.contains("handcards") && !this.classList.contains("scrollh")) {
			return;
		}
		var node = this;
		var num = this._scrollnum || 6;
		var speed = this._scrollspeed || 16;
		clearInterval(node.interval);
		if (evt.detail > 0 || evt.wheelDelta < 0) {
			node.interval = setInterval(function () {
				if (num-- && Math.abs(node.scrollLeft + node.clientWidth - node.scrollWidth) > 0) {
					node.scrollLeft += speed;
				} else {
					clearInterval(node.interval);
				}
			}, 16);
		} else {
			node.interval = setInterval(function () {
				if (num-- && node.scrollLeft > 0) {
					node.scrollLeft -= speed;
				} else {
					clearInterval(node.interval);
				}
			}, 16);
		}
	}
	touchStart(e) {
		this.startX = e.touches[0].clientX / game.documentZoom;
		this.startY = e.touches[0].clientY / game.documentZoom;
		_status.dragged = false;
	}
	dialogtouchStart(e) {
		ui.click.touchStart.call(this, e);
		_status.dialogtouched = true;
	}
	touchScroll(e) {
		if (_status.mousedragging) {
			return;
		}
		if (_status.draggingtouchdialog) {
			return;
		}
		if (!_status.dragged) {
			if (Math.abs(e.touches[0].clientX / game.documentZoom - this.startX) > 10 || Math.abs(e.touches[0].clientY / game.documentZoom - this.startY) > 10) {
				_status.dragged = true;
			}
		}
		if ((this == ui.handcards1Container || this == ui.handcards2Container) && !this.classList.contains("scrollh")) {
			e.preventDefault();
		} else if (lib.device == "ios" && this.scrollHeight <= this.offsetHeight + 5 && this.scrollWidth <= this.offsetWidth + 5) {
			e.preventDefault();
		} else {
			delete _status._swipeorigin;
			e.stopPropagation();
		}
	}
	autoskill(bool, node) {
		var list = lib.config.autoskilllist;
		if (bool) {
			list.remove(node.link);
		} else {
			list.add(node.link);
		}
		game.saveConfig("autoskilllist", list);
	}
	skillbutton() {
		this.func(this.link);
	}
	autoskill2(e) {
		this.classList.toggle("on");
		var list = [];
		if (lib.skill[this.link].frequent) {
			list.push(this.link);
		}
		if (lib.skill[this.link].subfrequent) {
			for (var i = 0; i < lib.skill[this.link].subfrequent.length; i++) {
				list.push(this.link + "_" + lib.skill[this.link].subfrequent[i]);
			}
		}
		for (var i = 0; i < list.length; i++) {
			if (this.classList.contains("on")) {
				lib.config.autoskilllist.remove(list[i]);
			} else {
				lib.config.autoskilllist.add(list[i]);
			}
		}
		game.saveConfig("autoskilllist", lib.config.autoskilllist);
		ui.click.touchpop();
		e.stopPropagation();
	}
	hiddenskill(e) {
		this.classList.toggle("on");
		var hidden = lib.skill[this.link].preHidden;
		if (Array.isArray(hidden)) {
			if (this.classList.contains("on")) {
				_status.prehidden_skills.removeArray(hidden);
			} else {
				_status.prehidden_skills.addArray(hidden);
			}
		}
		if (this.classList.contains("on")) {
			_status.prehidden_skills.remove(this.link);
		} else {
			_status.prehidden_skills.add(this.link);
		}
		ui.click.touchpop();
		e.stopPropagation();
	}
	rightplayer(e) {
		if (this._nopup) {
			return false;
		}
		if (_status.clickedplayer) {
			return false;
		}

		if (this._mouseenterdialog && this._mouseenterdialog.parentNode) {
			this._mouseenterdialog.delete();
		} else {
			ui.click.intro.call(this, e);
		}
		_status.clickedplayer = true;
		_status.clicked = false;
		ui.click.longpresscancel.call(this);
		return false;
	}
	right(e) {
		if (window.inSplash) {
			return false;
		}
		if (lib.config.touchscreen) {
			return;
		}
		if (_status.noright) {
			_status.noright = false;
			return false;
		}
		if (_status.clickedplayer) {
			_status.clickedplayer = false;
			return;
		}
		game.closePopped();
		switch (lib.config.right_click) {
			case "shortcut":
				ui.click.shortcut();
				break;
			case "pause":
				ui.click.pause();
				break;
			case "auto":
				ui.click.auto();
				break;
			case "config":
				ui.click.config();
				break;
		}
		e.preventDefault();
		return false;
	}
}
