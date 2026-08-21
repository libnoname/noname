import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

export const type = "mode";
/** @type { importModeConfig } */
export default {
	name: "doudizhu",
	start: [
		// step 0
		async (event, trigger, player) => {
			const playback = localStorage.getItem(`${lib.configprefix}playback`);
			if (playback) {
				ui.create.me();
				ui.arena.style.display = "none";
				ui.system.style.display = "none";
				_status.playback = playback;
				localStorage.removeItem(`${lib.configprefix}playback`);
				const store = lib.db.transaction(["video"], "readwrite").objectStore("video");
				store.get(parseInt(playback)).onsuccess = e => {
					if (e.target?.result) {
						game.playVideoContent(e.target.result.video);
					} else {
						alert("播放失败：找不到录像");
						game.reload();
					}
				};
				event.finish();
			} else if (!_status.connectMode) {
				game.prepareArena(3);
			}
		},
		// step 1
		async (event, trigger, player) => {
			event.replacePile = () => {
				const map = {
					shuiyanqijunx: "shuiyanqijuny",
					bingliang: "binglinchengxia",
					fangtian: "toushiche",
					wutiesuolian: "toushiche",
				};
				for (const cardInfo of lib.card.list) {
					const name = cardInfo[2];
					if (map[name]) {
						cardInfo[2] = map[name];
						cardInfo[4] = null;
						cardInfo._replaced = true;
					} else if (name === "lebu") {
						switch (cardInfo[0]) {
							case "spade":
								cardInfo[2] = "shuiyanqijuny";
								break;
							case "club":
								cardInfo[2] = "luojingxiashi";
								break;
							default:
								cardInfo[2] = "baiyidujiang";
								break;
						}
						cardInfo._replaced = true;
					}
				}
			};
			_status.mode = get.config("doudizhu_mode");
			if (_status.connectMode) {
				_status.mode = lib.configOL.doudizhu_mode;
				game.waitForPlayer(() => {
					lib.configOL.number = 3;
				});
			} else if (_status.mode === "binglin") {
				event.replacePile();
			} else if (_status.mode === "online") {
				lib.card.list = lib.online_cardPile.slice(0);
				lib.inpile.addArray(["nanman", "wanjian", "taoyuan", "wugu"]);
				game.fixedPile = true;
			}
		},
		// step 2
		async (event, trigger, player) => {
			if (_status.connectMode) {
				if (_status.mode === "online") {
					lib.card.list = lib.online_cardPile.slice(0);
					lib.inpile.addArray(["nanman", "wanjian", "taoyuan", "wugu"]);
					game.fixedPile = true;
				} else if (_status.mode === "binglin") {
					event.replacePile();
				}
				if (lib.configOL.number < 3) {
					lib.configOL.number = 3;
				}
				game.randomMapOL();
			} else {
				for (const current of game.players) {
					current.getId();
				}
				game.chooseCharacter();
			}
		},
		// step 3
		async (event, trigger, player) => {
			if (ui.coin) {
				_status.coinCoeff = get.coinCoeff([game.me.name]);
			}
			game.showIdentity(true);
			const map = {};
			for (const i in lib.playerOL) {
				map[i] = lib.playerOL[i].identity;
			}
			game.broadcast(map => {
				for (const i in map) {
					lib.playerOL[i].identity = map[i];
					lib.playerOL[i].setIdentity();
					lib.playerOL[i].ai.shown = 1;
				}
			}, map);
			switch (_status.mode) {
				case "online":
					game.addGlobalSkill("online_juzhong");
					game.addGlobalSkill("online_zhadan_button");
					game.addGlobalSkill("online_zhadan");
					game.addGlobalSkill("online_aozhan");
					game.addGlobalSkill("online_gongshoujintui");
					break;
				case "binglin":
					game.addGlobalSkill("binglin_bingjin");
					break;
				default: {
					if (game.zhu.isInitFilter("noZhuSkill")) {
						break;
					}
					const list = [];
					const version = _status.connectMode ? lib.configOL.feiyang_version : get.config("feiyang_version");
					if (version === "online") {
						list.push("feiyang");
					} else if (version === "mobile") {
						list.push("mbfeiyang");
					} else if (version === "decade") {
						list.push("dcfeiyang");
					}
					list.push("bahu");
					const enhance = _status.connectMode ? lib.configOL.enhance_dizhu : get.config("enhance_dizhu");
					if (["kaihei", "yinfu", "shiqiang", "qiangyi", "oldshiqiang"].includes(enhance)) {
						list.push(enhance);
					}
					game.zhu.addSkill(list);
					break;
				}
			}
			game.addGlobalSkill("doudizhu_viewHandcard");
			game.syncState();
			event.trigger("gameStart");

			const players = get.players(lib.sort.position);
			const info = [];
			for (const current of players) {
				info.push({
					name: current.name1,
					name2: current.name2,
					identity: current.identity,
					nickname: current.node.nameol.innerHTML,
				});
			}
			_status.videoInited = true;
			game.addVideo("init", null, info);
			if (_status.mode === "kaihei") {
				game.addGlobalSkill("kaihei");
			}

			const next = game.gameDraw(game.zhu || _status.firstAct || game.me);
			if (_status.mode === "online") {
				const card = game.createCard("diqi", "club", 13);
				game.zhu.addVirtualEquip(get.autoViewAs(card, void 0, false), [card]);
				next.num = player => {
					let num = 4;
					if (player !== game.zhu) {
						return num;
					}
					if (lib.character[player.name1] && get.infoHp(lib.character[player.name1][2]) > 3) {
						num++;
					}
					if (lib.character[player.name2] && get.infoHp(lib.character[player.name2][2]) > 3) {
						num++;
					}
					return num;
				};
			} else if (_status.mode === "binglin") {
				next.num = player => (player === game.zhu ? 5 : 4);
			}
			if (_status.mode !== "online" && _status.connectMode && lib.configOL.change_card) {
				game.replaceHandcards(game.players.slice(0));
			}
			game.phaseLoop(game.zhu || _status.firstAct || game.me);
			game.zhu.showGiveup();
		},
	],
	game: {
		/**
		 * 判断当前模式是否允许在菜单中切换角色。
		 *
		 * @returns { boolean }
		 */
		canReplaceViewpoint: () => true,
		recommendDizhu: ["re_guojia", "re_huanggai", "re_lvbu", "re_guanyu", "re_sunquan", "re_xusheng", "re_wuyi", "re_sunben", "xuyou", "zhangchunhua", "caochong", "zhangsong", "zhongyao", "wangyi", "caochun", "maliang", "sp_diaochan", "quyi", "sp_zhaoyun", "shamoke", "lijue", "liuzan", "wenyang", "shen_lvmeng", "shen_ganning", "jiakui", "wangyuanji", "lingcao", "miheng", "sp_key_yuri", "key_hinata", "key_rin", "key_kyousuke", "ns_chendao", "jiakui", "haozhao"],
		/**
		 * 记录当前玩家的一场斗地主胜负。
		 *
		 * @param { boolean } bool - 当前玩家是否获胜。
		 * @returns { void }
		 */
		addRecord(bool) {
			if (typeof bool !== "boolean") {
				return;
			}
			const data = lib.config.gameRecord.doudizhu.data;
			const identity = game.me.identity;
			if (!data[identity]) {
				data[identity] = [0, 0];
			}
			if (bool) {
				data[identity][0]++;
			} else {
				data[identity][1]++;
			}
			const identities = ["zhu", "fan"];
			let str = "";
			for (const currentIdentity of identities) {
				if (!data[currentIdentity]) {
					continue;
				}
				const translatedIdentity = lib.translate[`${currentIdentity}2`];
				str += `${translatedIdentity}：${data[currentIdentity][0]}胜 ${data[currentIdentity][1]}负<br>`;
			}
			lib.config.gameRecord.doudizhu.str = str;
			game.saveConfig("gameRecord", lib.config.gameRecord);
		},
		/**
		 * 获取联机对局中所有玩家的身份状态。
		 *
		 * @returns { Record<string, { identity: string }> }
		 */
		getState() {
			const state = {};
			for (const id in lib.playerOL) {
				const player = lib.playerOL[id];
				state[id] = { identity: player.identity };
			}
			return state;
		},
		/**
		 * 使用联机状态同步场上玩家的身份。
		 *
		 * @param { Record<string, { identity: string }> } state - 以玩家 ID 为键的身份状态。
		 * @returns { void }
		 */
		updateState(state) {
			for (const id in state) {
				const player = lib.playerOL[id];
				if (!player) {
					continue;
				}
				player.identity = state[id].identity;
			}
		},
		/**
		 * 向所有客户端同步轮数、牌堆数量及牌堆顶部节点。
		 *
		 * @returns { void }
		 */
		updateRoundNumber() {
			if (_status.mode === "online") {
				game.broadcastAll(
					(num1, num2, top, bonusNum) => {
						if (ui.cardPileNumber) {
							let str = `${num1}轮 公共牌堆: ${num2}`;
							if (game.me && game.me.storage.doudizhu_cardPile && game.me.storage.doudizhu_cardPile.length) {
								str += ` 个人牌堆: ${game.me.storage.doudizhu_cardPile.length}`;
							}
							if (bonusNum) {
								str += `<br>本场叫价: ${bonusNum * 100}`;
							}
							ui.cardPileNumber.innerHTML = str;
						}
						_status.pileTop = top;
					},
					game.roundNumber,
					ui.cardPile.childNodes.length,
					ui.cardPile.firstChild,
					game.bonusNum
				);
				return;
			}
			game.broadcastAll(
				(num1, num2, top) => {
					if (ui.cardPileNumber) {
						ui.cardPileNumber.innerHTML = `${num1}轮 剩余牌: ${num2}`;
					}
					_status.pileTop = top;
				},
				game.roundNumber,
				ui.cardPile.childNodes.length,
				ui.cardPile.firstChild
			);
		},
		/**
		 * 将斗地主联机配置添加到房间信息面板。
		 *
		 * @param { Dialog } uiintro - 房间信息面板。
		 * @returns { void }
		 */
		getRoomInfo(uiintro) {
			uiintro.add(`<div class="text chat">双将模式：${lib.configOL.double_character ? "开启" : "关闭"}`);
			if (lib.configOL.banned.length) {
				uiintro.add(`<div class="text chat">禁用武将：${get.translation(lib.configOL.banned)}`);
			}
			if (lib.configOL.bannedcards.length) {
				uiintro.add(`<div class="text chat">禁用卡牌：${get.translation(lib.configOL.bannedcards)}`);
			}
			uiintro.style.paddingBottom = "8px";
		},
		/**
		 * 获取当前对局的录像名称。
		 *
		 * @returns { [playerName: string, gameName: string] }
		 */
		getVideoName() {
			let str = get.translation(game.me.name);
			if (game.me.name2) {
				str += `/${get.translation(game.me.name2)}`;
			}
			let namex;
			switch (_status.mode) {
				case "normal":
					namex = "休闲斗地主";
					break;
				case "kaihei":
					namex = "开黑斗地主";
					break;
				case "huanle":
					namex = "欢乐斗地主";
					break;
				case "binglin":
					namex = "兵临城下";
					break;
				case "online":
					namex = "智斗三国";
					break;
			}
			const name = [str, `${namex} - ${lib.translate[`${game.me.identity}2`]}`];
			return name;
		},
		/**
		 * 公开所有玩家的身份，并清理猜测身份的临时节点。
		 *
		 * @param { boolean } [me] - 兼容旧逻辑的保留参数，目前不会影响显示范围。
		 * @returns { void }
		 */
		showIdentity(me) {
			for (const player of game.players) {
				// if (me === false && player === game.me) continue;
				player.node.identity.classList.remove("guessing");
				player.identityShown = true;
				player.ai.shown = 1;
				player.setIdentity(player.identity);
				if (player.identity === "zhu") {
					player.isZhu = true;
				}
			}
			if (!_status.clickingidentity) {
				return;
			}
			for (const identityNode of _status.clickingidentity[1]) {
				identityNode.delete();
				identityNode.style.transform = "";
			}
			delete _status.clickingidentity;
		},
		/**
		 * 根据地主存活状态和当前模式结算本机视角的胜负。
		 *
		 * @returns { void }
		 */
		checkResult() {
			const me = game.me._trueMe || game.me;
			if (game.zhu.isAlive()) {
				if (_status.mode !== "online" && (_status.mode !== "binglin" || game.roundNumber < 3) && game.players.length > 1) {
					return;
				}
				game.over(me === game.zhu);
				return;
			}
			game.over(me !== game.zhu);
		},
		/**
		 * 判断指定玩家是否满足联机对局的获胜条件。
		 *
		 * @param { Player } player - 要判断的玩家。
		 * @returns { boolean }
		 */
		checkOnlineResult(player) {
			return player.identity === (game.zhu.isAlive() ? "zhu" : "fan");
		},
		/**
		 * 创建智斗三国模式的本地叫地主与选将事件。
		 *
		 * @returns { void }
		 */
		chooseCharacterZhidou() {
			const next = game.createEvent("chooseCharacter");
			next.setContent(async (event, trigger, player) => {
				game.no_continue_game = true;
				lib.init.onfree();
				ui.arena.classList.add("choose-character");
				const groups = [];
				const characterList = [];
				const characterMap = {};
				const charactersByGroup = get.config("character_online") || lib.characterOnline;
				for (const group in charactersByGroup) {
					const groupCharacters = charactersByGroup[group];
					for (const character of [...groupCharacters]) {
						if (!lib.character[character] || (group === "key" && lib.filter.characterDisabled(character))) {
							groupCharacters.remove(character);
						}
					}
					if (groupCharacters.length >= 3) {
						groups.push(group);
						characterList.addArray(groupCharacters);
					}
				}
				characterList.randomSort();
				_status.characterlist = characterList.slice();
				const controls = ["不叫地主", "一倍", "两倍", "三倍"];
				for (const current of game.players) {
					const id = current.playerid;
					current._group = groups.randomRemove(1)[0];
					characterMap[id] = charactersByGroup[current._group].randomGets(4);
					current.storage.doudizhu_cardPile = get.cards(20).sort((a, b) => {
						if (a.name !== b.name) {
							return lib.sort.card(a.name, b.name);
						}
						if (a.suit !== b.suit) {
							return lib.suit.indexOf(a) - lib.suit.indexOf(b);
						}
						return a.number - b.number;
					});
				}
				const dialog = ui.create.dialog("你的选将框与底牌", [characterMap[game.me.playerid], "character"], game.me.storage.doudizhu_cardPile);
				const start = game.players.randomGet();
				let current = start;
				let tempDizhu;
				let biddingFinished = false;
				await game.delay(7);
				while (!biddingFinished) {
					current.classList.add("glow_phase");
					if (current === game.me) {
						dialog.content.firstChild.innerHTML = "是否叫地主？";
					} else {
						dialog.content.firstChild.innerHTML = "请等待其他玩家叫地主";
						await game.delay(2);
					}
					const result = await current
						.chooseControl({
							controls: [...controls],
							ai: () => controls.randomGet(),
						})
						.forResult();
					current.classList.remove("glow_phase");
					current._control = result.control;
					current.chat(result.control);
					if (result.control === "三倍") {
						game.bonusNum = 3;
						game.zhu = current;
						break;
					}
					if (result.control !== "不叫地主") {
						controls.splice(1, controls.indexOf(result.control));
						tempDizhu = current;
						if (result.control === "二倍") {
							game.bonusNum = 2;
						}
					}
					current = current.next;
					if (current === start && (start === tempDizhu || start._control === "不叫地主")) {
						game.zhu = tempDizhu || start.previous;
						biddingFinished = true;
					} else if (current === start.next && current._control) {
						game.zhu = tempDizhu;
						biddingFinished = true;
					}
					if (current === start.previous && !tempDizhu) {
						controls.remove("不叫地主");
					}
				}
				game.updateRoundNumber();
				for (const current of game.players) {
					current.identity = current === game.zhu ? "zhu" : "fan";
					current.showIdentity();
				}
				const selectButton = game.me === game.zhu ? 2 : 1;
				dialog.content.firstChild.innerHTML = `请选择${get.cnNumber(selectButton)}张武将牌`;
				const result = await game.me
					.chooseButton({
						dialog,
						forced: true,
						selectButton,
						filterButton: button => typeof button.link === "string",
					})
					.forResult();
				game.me.init(result.links[0], result.links[1]);
				for (const current of game.players) {
					if (current !== game.me) {
						if (current === game.zhu) {
							const characters = characterMap[current.playerid].randomGets(2);
							current.init(characters[0], characters[1]);
						} else {
							current.init(characterMap[current.playerid].randomGet());
						}
					}
					current.markSkill("doudizhu_cardPile");
				}
				game.zhu.hp = 4;
				game.zhu.maxHp = 4;
				game.zhu.update();
				for (const current of game.players) {
					_status.characterlist.remove(current.name1);
					_status.characterlist.remove(current.name2);
				}
				setTimeout(() => ui.arena.classList.remove("choose-character"), 500);
			});
		},
		/**
		 * 创建兵临城下模式的本地叫地主与选将事件。
		 *
		 * @returns { void }
		 */
		chooseCharacterBinglin() {
			const next = game.createEvent("chooseCharacter");
			next.setContent(async (event, trigger, player) => {
				game.no_continue_game = true;
				lib.init.onfree();
				ui.arena.classList.add("choose-character");
				game.zhuSkill = `zhuSkill_${["xiangyang", "jiangling", "fancheng"].randomGet()}`;
				const characterList = [];
				const characterMap = {};
				for (const name in lib.character) {
					if (lib.filter.characterDisabled(name)) {
						continue;
					}
					characterList.push(name);
				}
				characterList.randomSort();
				_status.characterlist = characterList.slice();
				for (const current of game.players) {
					characterMap[current.playerid] = characterList.randomRemove(4);
				}
				const controls = ["不叫地主", "一倍", "两倍", "三倍"];
				const dialog = ui.create.dialog(`本局城池：${get.translation(game.zhuSkill)}`, [characterMap[game.me.playerid], "character"]);
				const start = game.players.randomGet();
				let current = start;
				let tempDizhu;
				let biddingFinished = false;
				await game.delay(8);
				while (!biddingFinished) {
					current.classList.add("glow_phase");
					if (current === game.me) {
						dialog.content.firstChild.innerHTML = "是否叫地主？";
					} else {
						dialog.content.firstChild.innerHTML = "请等待其他玩家叫地主";
						await game.delay(2);
					}
					const result = await current
						.chooseControl({
							controls: [...controls],
							ai: () => controls.randomGet(),
						})
						.forResult();
					current.classList.remove("glow_phase");
					current._control = result.control;
					current.chat(result.control);
					if (result.control === "三倍") {
						game.bonusNum = 3;
						game.zhu = current;
						break;
					}
					if (result.control !== "不叫地主") {
						controls.splice(1, controls.indexOf(result.control));
						tempDizhu = current;
						if (result.control === "二倍") {
							game.bonusNum = 2;
						}
					}
					current = current.next;
					if (current === start) {
						game.zhu = tempDizhu || start.previous;
						biddingFinished = true;
					}
					if (current === start.previous && !tempDizhu) {
						controls.remove("不叫地主");
					}
				}
				for (const current of game.players) {
					current.identity = current === game.zhu ? "zhu" : "fan";
					current.showIdentity();
				}
				dialog.close();
				characterMap[game.zhu.playerid].addArray(characterList.randomRemove(3));
				const createDialog = ["请选择你的武将", [characterMap[game.me.playerid], "character"]];
				if (game.me.identity === "fan") {
					const friend = game.findPlayer(current => current !== game.me && current.identity === "fan");
					createDialog.push('<div class="text center">队友的选将框</div>');
					createDialog.push([characterMap[friend.playerid], "character"]);
				}
				const result = await game.me
					.chooseButton({
						createDialog,
						forced: true,
						filterButton: button => _status.event.list.includes(button.link),
					})
					.set("list", characterMap[game.me.playerid])
					.forResult();
				game.me.init(result.links[0]);
				for (const current of game.players) {
					if (current !== game.me) {
						current.init(characterMap[current.playerid].randomGet());
					}
					if (current === game.zhu) {
						current.addSkill(game.zhuSkill);
					} else {
						current.addSkill("binglin_neihong");
					}
				}
				if (!game.zhu.isInitFilter("noZhuHp")) {
					game.zhu.maxHp++;
					game.zhu.hp++;
					game.zhu.update();
				}
				for (const current of game.players) {
					_status.characterlist.remove(current.name1);
					_status.characterlist.remove(current.name2);
				}
				setTimeout(() => ui.arena.classList.remove("choose-character"), 500);
			});
		},
		/**
		 * 创建欢乐斗地主模式的本地叫地主与选将事件。
		 *
		 * @returns { void }
		 */
		chooseCharacterHuanle() {
			const next = game.createEvent("chooseCharacter");
			next.setContent(async (event, trigger, player) => {
				ui.arena.classList.add("choose-character");
				game.no_continue_game = true;
				const characterList = [];
				const recommendedCharacters = [];
				const replacedCharacters = [];
				if (!event.map) {
					event.map = {};
				}
				const characterMap = event.map;
				for (const group in lib.characterReplace) {
					const replacements = lib.characterReplace[group];
					for (const character of [...replacements]) {
						if (lib.filter.characterDisabled(character)) {
							replacements.remove(character);
						}
					}
					if (replacements.length) {
						const name = replacements.randomGet();
						characterList.push(name);
						if (game.recommendDizhu.includes(name)) {
							recommendedCharacters.push(name);
						}
						replacedCharacters.addArray(replacements);
					}
				}
				for (const name in lib.character) {
					if (replacedCharacters.includes(name) || lib.filter.characterDisabled(name)) {
						continue;
					}
					characterList.push(name);
					if (game.recommendDizhu.includes(name)) {
						recommendedCharacters.push(name);
					}
				}
				characterList.randomSort();
				_status.characterlist = characterList.slice();
				const controls = ["不叫", "叫地主"];
				for (const current of game.players) {
					const id = current.playerid;
					if (!characterMap[id]) {
						characterMap[id] = [];
					}
					characterMap[id].addArray(recommendedCharacters.randomRemove(1));
					characterList.removeArray(characterMap[id]);
					characterMap[id].addArray(characterList.randomRemove(4 - characterMap[id].length));
					recommendedCharacters.removeArray(characterMap[id]);
				}
				const dialog = ui.create.dialog("你的选将框", [characterMap[game.me.playerid], "character"]);
				const start = game.players.randomGet();
				let current = start;
				let biddingFinished = false;
				lib.init.onfree();
				await game.delay(2.5);
				while (!biddingFinished) {
					const choiceEvent = current.chooseControl({
						controls: [...controls],
						ai: () => (Math.random() > 0.5 ? "不叫" : "叫地主"),
					});
					if (current === game.me) {
						dialog.content.childNodes[0].innerHTML = "是否抢地主？";
					}
					const result = await choiceEvent.forResult();
					current.chat(result.control);
					if (result.control === "叫地主" || current === start.next) {
						game.zhu = result.control === "叫地主" ? current : current.next;
						biddingFinished = true;
					} else {
						current = current.next;
						await game.delay(1.5);
					}
				}
				for (const current of game.players) {
					current.identity = current === game.zhu ? "zhu" : "fan";
					current.showIdentity();
				}
				dialog.close();
				characterMap[game.zhu.playerid].addArray(characterList.randomRemove(3));
				const result = await game.me
					.chooseButton({
						createDialog: ["请选择你的武将", [characterMap[game.me.playerid], "character"]],
						forced: true,
					})
					.forResult();
				game.me.init(result.links[0]);
				for (const current of game.players) {
					if (current !== game.me) {
						current.init(characterMap[current.playerid].randomGet());
					}
				}
				if (!game.zhu.isInitFilter("noZhuHp")) {
					game.zhu.maxHp++;
					game.zhu.hp++;
					game.zhu.update();
				}
				for (const current of game.players) {
					_status.characterlist.remove(current.name1);
					_status.characterlist.remove(current.name2);
				}
				setTimeout(() => ui.arena.classList.remove("choose-character"), 500);
			});
		},

		/**
		 * 创建开黑斗地主模式的本地身份分配与选将事件。
		 *
		 * @returns { void }
		 */
		chooseCharacterKaihei() {
			const next = game.createEvent("chooseCharacter");
			next.setContent(async (event, trigger, player) => {
				ui.arena.classList.add("choose-character");
				game.no_continue_game = true;
				const identityList = ["zhu", "fan", "fan"];
				game.saveConfig("continue_name");
				const list = [];
				const list4 = [];
				identityList.randomSort();
				let index = 0;
				for (const current of game.players) {
					current.identity = identityList[index];
					current.showIdentity();
					if (identityList[index] === "zhu") {
						game.zhu = current;
					}
					index++;
				}

				if (!game.zhu) {
					game.zhu = game.me;
				} else {
					game.zhu.setIdentity();
					game.zhu.identityShown = true;
					game.zhu.isZhu = game.zhu.identity === "zhu";
					game.zhu.node.identity.classList.remove("guessing");
					game.me.setIdentity();
					game.me.node.identity.classList.remove("guessing");
				}

				for (const name in lib.characterReplace) {
					const replacements = lib.characterReplace[name];
					for (const character of [...replacements]) {
						if (lib.filter.characterDisabled(character)) {
							replacements.remove(character);
						}
					}
					if (replacements.length) {
						list.push(replacements.randomGet());
						list4.addArray(replacements);
					}
				}
				for (const name in lib.character) {
					if (list4.includes(name) || lib.filter.characterDisabled(name)) {
						continue;
					}
					list.push(name);
				}
				list.randomSort();
				_status.characterlist = list.slice();
				for (const current of game.players) {
					current._characterChoice = list.randomRemove(get.config(`choice_${current.identity}`));
					if (current.identity === "fan") {
						current._friend = current.next.identity === "fan" ? current.next : current.previous;
					}
				}
				const createDialog = ["选择武将"];
				createDialog.push([game.me._characterChoice, "character"]);
				if (game.me._friend) {
					createDialog.push("队友的武将");
					createDialog.push([game.me._friend._characterChoice, "character"]);
				}
				const result = await game.me
					.chooseButton({
						createDialog,
						forced: true,
						filterButton: button => _status.event.player._characterChoice.includes(button.link),
					})
					.set("onfree", true)
					.forResult();
				game.me.init(result.links[0]);
				for (const current of game.players) {
					if (current !== game.me) {
						current.init(current._characterChoice.randomGet());
					}
					_status.characterlist.remove(current.name1);
					_status.characterlist.remove(current.name2);
					if (current === game.zhu && !game.zhu.isInitFilter("noZhuHp")) {
						game.zhu.maxHp++;
						game.zhu.hp++;
						game.zhu.update();
					}
				}
				setTimeout(() => ui.arena.classList.remove("choose-character"), 500);
			});
		},
		/**
		 * 根据当前子模式创建本地选将事件。
		 *
		 * @returns { void }
		 */
		chooseCharacter() {
			if (_status.mode === "kaihei") {
				game.chooseCharacterKaihei();
				return;
			}
			if (_status.mode === "huanle") {
				game.chooseCharacterHuanle();
				return;
			}
			if (_status.mode === "online") {
				game.chooseCharacterZhidou();
				return;
			}
			if (_status.mode === "binglin") {
				game.chooseCharacterBinglin();
				return;
			}
			const next = game.createEvent("chooseCharacter");
			next.showConfig = true;
			next.addPlayer = player => {
				const list = get.identityList(game.players.length - 1);
				const list2 = get.identityList(game.players.length);
				for (const identity of list) {
					list2.remove(identity);
				}
				player.identity = list2[0];
				player.setIdentity("cai");
			};
			next.removePlayer = () => game.players.randomGet(game.me, game.zhu);
			next.ai = (player, list, list2, back) => {
				const listc = list.slice(0, 2);
				for (const [index, character] of listc.entries()) {
					const listx = lib.characterReplace[character];
					if (listx && listx.length) {
						listc[index] = listx.randomGet();
					}
				}
				if (get.config("double_character")) {
					player.init(listc[0], listc[1]);
				} else {
					player.init(listc[0]);
				}
				if (player === game.zhu && !game.zhu.isInitFilter("noZhuHp")) {
					game.zhu.maxHp++;
					game.zhu.hp++;
					game.zhu.update();
				}
				if (back) {
					list.remove(get.sourceCharacter(player.name1));
					list.remove(get.sourceCharacter(player.name2));
					for (const character of list) {
						back.push(character);
					}
				}
				if (typeof lib.config.test_game === "string" && player === game.me.next) {
					if (lib.config.test_game !== "_") {
						player.init(lib.config.test_game);
					}
				}
				player.node.name.dataset.nature = get.groupnature(player.group);
			};
			next.setContent([
				// step 0
				async (event, trigger, player) => {
					ui.arena.classList.add("choose-character");
					let list;
					const list4 = [];
					const identityList = ["zhu", "fan", "fan"];
					const chosen = lib.config.continue_name || [];
					let num;
					game.saveConfig("continue_name");
					event.chosen = chosen;

					const addSetting = dialog => {
						dialog.add("选择身份").classList.add("add-setting");
						const table = document.createElement("div");
						table.classList.add("add-setting");
						table.style.margin = "0";
						table.style.width = "100%";
						table.style.position = "relative";

						const identityList = ["random", "zhu", "fan"];
						for (const identity of identityList) {
							const td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
							td.link = identity;
							if (td.link === game.me.identity) {
								td.classList.add("bluebg");
							}
							table.appendChild(td);
							td.innerHTML = `<span>${get.translation(`${identity}2`)}</span>`;
							td.addEventListener(lib.config.touchscreen ? "touchend" : "click", e => {
								const target = e.currentTarget;
								if (_status.dragged) {
									return;
								}
								if (_status.justdragged) {
									return;
								}
								_status.tempNoButton = true;
								setTimeout(() => (_status.tempNoButton = false), 500);
								let link = target.link;
								if (game.zhu.name) {
									if (link !== "random") {
										_status.event.parent.fixedseat = get.distance(game.me, game.zhu, "absolute");
									}
									game.zhu.uninit();
									delete game.zhu.isZhu;
									delete game.zhu.identityShown;
								}
								let current = target.parentNode.querySelector(".bluebg");
								if (current) {
									current.classList.remove("bluebg");
								}
								current = seats.querySelector(".bluebg");
								if (current) {
									current.classList.remove("bluebg");
								}
								if (link === "random") {
									link = ["zhu", "fan"].randomGet();
									for (const child of target.parentNode.childNodes) {
										if (child.link === link) {
											child.classList.add("bluebg");
										}
									}
								} else {
									target.classList.add("bluebg");
								}
								num = get.config(`choice_${link}`);
								_status.event.parent.swapnodialog = (dialog, list) => {
									const buttons = ui.create.div(".buttons");
									const node = dialog.buttons[0].parentNode;
									dialog.buttons = ui.create.buttons(list, "characterx", buttons);
									dialog.content.insertBefore(buttons, node);
									buttons.addTempClass("start");
									node.remove();
									game.uncheck();
									game.check();
									for (const seat of seats.childNodes) {
										if (get.distance(game.zhu, game.me, "absolute") === seat.link) {
											seat.classList.add("bluebg");
										}
									}
								};
								_status.event = _status.event.parent;
								_status.event.step = 0;
								_status.event.identity = link;
								if (ui.selected.buttons.length > 0) {
									ui.selected.buttons.forEach(button => {
										if (button && button.parentNode) {
											button.classList.remove("selected");
										}
									});
									ui.selected.buttons.length = 0;
								}
								if (link !== (event.zhongmode ? "mingzhong" : "zhu")) {
									seats.previousSibling.style.display = "";
									seats.style.display = "";
								} else {
									seats.previousSibling.style.display = "none";
									seats.style.display = "none";
								}
								game.resume();
							});
						}
						dialog.content.appendChild(table);

						dialog.add("选择座位").classList.add("add-setting");
						const seats = document.createElement("div");
						seats.classList.add("add-setting");
						seats.style.margin = "0";
						seats.style.width = "100%";
						seats.style.position = "relative";
						for (let seat = 2; seat <= game.players.length; seat++) {
							const td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
							td.innerHTML = get.cnNumber(seat, true);
							td.link = seat - 1;
							seats.appendChild(td);
							if (get.distance(game.zhu, game.me, "absolute") === seat - 1) {
								td.classList.add("bluebg");
							}
							td.addEventListener(lib.config.touchscreen ? "touchend" : "click", e => {
								const target = e.currentTarget;
								if (_status.dragged) {
									return;
								}
								if (_status.justdragged) {
									return;
								}
								if (get.distance(game.zhu, game.me, "absolute") === target.link) {
									return;
								}
								const current = target.parentNode.querySelector(".bluebg");
								if (current) {
									current.classList.remove("bluebg");
								}
								target.classList.add("bluebg");
								for (const current of game.players) {
									if (get.distance(current, game.me, "absolute") === target.link) {
										game.swapSeat(game.zhu, current, false);
										return;
									}
								}
							});
						}
						dialog.content.appendChild(seats);
						if (game.me === game.zhu) {
							seats.previousSibling.style.display = "none";
							seats.style.display = "none";
						}

						dialog.add(ui.create.div(".placeholder.add-setting"));
						dialog.add(ui.create.div(".placeholder.add-setting"));
						if (get.is.phoneLayout()) {
							dialog.add(ui.create.div(".placeholder.add-setting"));
						}
					};
					const removeSetting = () => {
						const dialog = _status.event.dialog;
						if (!dialog) {
							return;
						}
						dialog.style.height = "";
						delete dialog._scrollset;
						const list = Array.from(dialog.querySelectorAll(".add-setting"));
						while (list.length) {
							list.shift().remove();
						}
						ui.update();
					};
					event.addSetting = addSetting;
					event.removeSetting = removeSetting;
					event.list = [];
					identityList.randomSort();
					if (event.identity) {
						identityList.remove(event.identity);
						identityList.unshift(event.identity);
						if (event.fixedseat) {
							const zhuIdentity = "zhu";
							if (zhuIdentity !== event.identity) {
								identityList.remove(zhuIdentity);
								identityList.splice(event.fixedseat, 0, zhuIdentity);
							}
							delete event.fixedseat;
						}
						delete event.identity;
					}
					for (const [index, current] of game.players.entries()) {
						current.identity = identityList[index];
						current.showIdentity();
						if (identityList[index] === "zhu") {
							game.zhu = current;
						}
					}

					if (!game.zhu) {
						game.zhu = game.me;
					} else {
						game.zhu.setIdentity();
						game.zhu.identityShown = true;
						game.zhu.isZhu = game.zhu.identity === "zhu";
						game.zhu.node.identity.classList.remove("guessing");
						game.me.setIdentity();
						game.me.node.identity.classList.remove("guessing");
					}
					//选将框分配
					for (const character in lib.characterReplace) {
						const replacements = lib.characterReplace[character];
						for (let index = replacements.length - 1; index >= 0; index--) {
							if (chosen.includes(replacements[index]) || lib.filter.characterDisabled(replacements[index])) {
								replacements.splice(index, 1);
							}
						}
						if (replacements.length) {
							event.list.push(character);
							list4.addArray(replacements);
						}
					}
					for (const character in lib.character) {
						if (chosen.includes(character) || list4.includes(character)) {
							continue;
						}
						if (lib.filter.characterDisabled(character)) {
							continue;
						}
						event.list.push(character);
						list4.push(character);
					}
					event.list.randomSort();
					_status.characterlist = list4.slice(0);
					num = get.config(`choice_${game.me.identity}`);
					list = event.list.slice(0, num);
					delete event.swapnochoose;
					let dialog;
					if (event.swapnodialog) {
						dialog = ui.dialog;
						event.swapnodialog(dialog, list);
						delete event.swapnodialog;
					} else {
						let str = "选择角色";
						if (_status.brawl && _status.brawl.chooseCharacterStr) {
							str = _status.brawl.chooseCharacterStr;
						}
						dialog = ui.create.dialog(str, "hidden", [list, "characterx"]);
						if ((!_status.brawl || !_status.brawl.noAddSetting) && get.config("change_identity")) {
							addSetting(dialog);
						}
					}
					dialog.setCaption("选择角色");
					game.me.setIdentity();

					if (!event.chosen.length) {
						game.me.chooseButton(dialog, true).set("onfree", true).selectButton = () => (get.config("double_character") ? 2 : 1);
					} else {
						lib.init.onfree();
					}
					ui.create.cheat = () => {
						_status.createControl = ui.cheat2;
						ui.cheat = ui.create.control("更换", () => {
							if (ui.cheat2 && ui.cheat2.dialog === _status.event.dialog) {
								return;
							}
							if (game.changeCoin) {
								game.changeCoin(-3);
							}

							event.list.randomSort();
							list = event.list.slice(0, num);

							const buttons = ui.create.div(".buttons");
							const node = _status.event.dialog.buttons[0].parentNode;
							_status.event.dialog.buttons = ui.create.buttons(list, "characterx", buttons);
							_status.event.dialog.content.insertBefore(buttons, node);
							buttons.addTempClass("start");
							node.remove();
							game.uncheck();
							game.check();
						});
						delete _status.createControl;
					};
					if (lib.onfree) {
						lib.onfree.push(() => {
							event.dialogxx = ui.create.characterDialog("heightset");
							if (ui.cheat2) {
								ui.cheat2.addTempClass("controlpressdownx", 500);
								ui.cheat2.classList.remove("disabled");
							}
						});
					} else {
						event.dialogxx = ui.create.characterDialog("heightset");
					}

					ui.create.cheat2 = () => {
						ui.cheat2 = ui.create.control("自由选将", () => {
							const control = ui.cheat2;
							if (control.dialog === _status.event.dialog) {
								if (game.changeCoin) {
									game.changeCoin(10);
								}
								control.dialog.close();
								_status.event.dialog = control.backup;
								control.backup.open();
								delete control.backup;
								game.uncheck();
								game.check();
								if (ui.cheat) {
									ui.cheat.addTempClass("controlpressdownx", 500);
									ui.cheat.classList.remove("disabled");
								}
							} else {
								if (game.changeCoin) {
									game.changeCoin(-10);
								}
								control.backup = _status.event.dialog;
								_status.event.dialog.close();
								_status.event.dialog = _status.event.parent.dialogxx;
								control.dialog = _status.event.dialog;
								control.dialog.open();
								game.uncheck();
								game.check();
								if (ui.cheat) {
									ui.cheat.classList.add("disabled");
								}
							}
						});
						if (lib.onfree) {
							ui.cheat2.classList.add("disabled");
						}
					};
					if (!_status.brawl || !_status.brawl.chooseCharacterFixed) {
						if (!ui.cheat && get.config("change_choice")) {
							ui.create.cheat();
						}
						if (!ui.cheat2 && get.config("free_choose")) {
							ui.create.cheat2();
						}
					}
				},
				// step 1
				async (event, trigger, player, result) => {
					if (ui.cheat) {
						ui.cheat.close();
						delete ui.cheat;
					}
					if (ui.cheat2) {
						ui.cheat2.close();
						delete ui.cheat2;
					}
					let chooseGroup = false;
					if (event.chosen.length) {
						if (lib.selectGroup.includes(lib.character[event.chosen[0]][1])) {
							chooseGroup = true;
						}
					} else if (event.modchosen) {
						if (event.modchosen[0] === "random") {
							event.modchosen[0] = result.buttons[0].link;
						} else {
							event.modchosen[1] = result.buttons[0].link;
						}
					} else if (result.buttons.length === 2) {
						event.choosed = [result.buttons[0].link, result.buttons[1].link];
						game.addRecentCharacter(result.buttons[0].link, result.buttons[1].link);
						if (lib.selectGroup.includes(lib.character[event.choosed[0]][1])) {
							chooseGroup = true;
						}
					} else {
						event.choosed = [result.buttons[0].link];
						if (lib.selectGroup.includes(lib.character[event.choosed[0]][1])) {
							chooseGroup = true;
						}
						game.addRecentCharacter(result.buttons[0].link);
					}
				},
				// step 2
				async (event, trigger, player) => {
					if (event.chosen.length) {
						game.me.init(event.chosen[0], event.chosen[1]);
					} else if (event.modchosen) {
						game.me.init(event.modchosen[0], event.modchosen[1]);
					} else if (event.choosed.length === 2) {
						game.me.init(event.choosed[0], event.choosed[1]);
					} else {
						game.me.init(event.choosed[0]);
					}
					event.list.remove(get.sourceCharacter(game.me.name1));
					event.list.remove(get.sourceCharacter(game.me.name2));
					if (game.me === game.zhu && !game.me.isInitFilter("noZhuHp")) {
						game.me.hp++;
						game.me.maxHp++;
						game.me.update();
					}

					for (const current of game.players) {
						if (current === game.me) {
							continue;
						}
						event.list.randomSort();
						event.ai(current, event.list.splice(0, get.config(`choice_${current.identity}`)), null, event.list);
					}
				},
				// step 3
				async (event, trigger, player) => {
					for (const current of game.players) {
						_status.characterlist.remove(current.name1);
						_status.characterlist.remove(current.name2);
					}
					setTimeout(() => ui.arena.classList.remove("choose-character"), 500);
				},
			]);
		},

		/**
		 * 创建开黑斗地主模式的联机身份分配与选将事件。
		 *
		 * @returns { void }
		 */
		chooseCharacterKaiheiOL() {
			const next = game.createEvent("chooseCharacter");
			next.setContent(async (event, trigger, player) => {
				ui.arena.classList.add("choose-character");
				const identityList = ["fan", "fan", "fan"];
				const aiList = game.filterPlayer(current => current !== game.me && !current.isOnline());
				if (aiList.length === 1) {
					identityList[game.players.indexOf(aiList[0])] = "zhu";
				} else {
					identityList[0] = "zhu";
					identityList.randomSort();
				}
				for (const [index, current] of game.players.entries()) {
					current.identity = identityList[index];
					current.showIdentity();
					current.identityShown = true;
					if (identityList[index] === "zhu") {
						game.zhu = current;
					}
				}
				const characterList = [];
				const replacedCharacters = [];

				const libCharacter = {};
				for (const packName of lib.configOL.characterPack) {
					const pack = lib.characterPack[packName];
					for (const name in pack) {
						// if (name === "zuoci") {
						// 	continue;
						// }
						if (lib.character[name]) {
							libCharacter[name] = pack[name];
						}
					}
				}
				for (const name in lib.characterReplace) {
					const replacements = lib.characterReplace[name];
					for (const character of [...replacements]) {
						if (!libCharacter[character] || lib.filter.characterDisabled(character, libCharacter)) {
							replacements.remove(character);
						}
					}
					if (replacements.length) {
						characterList.push(replacements.randomGet());
						replacedCharacters.addArray(replacements);
					}
				}
				for (const name in libCharacter) {
					if (replacedCharacters.includes(name) || lib.filter.characterDisabled(name, libCharacter)) {
						continue;
					}
					characterList.push(name);
				}
				_status.characterlist = characterList.slice();

				const map = {};
				for (const current of game.players) {
					current._characterChoice = characterList.randomRemove(lib.configOL[`choice_${current.identity}`]);
					if (current.identity === "fan") {
						current._friend = current.next.identity === "fan" ? current.next : current.previous;
					}
					map[current.playerid] = current._characterChoice;
				}
				game.broadcastAll(map => {
					for (const id in map) {
						lib.playerOL[id]._characterChoice = map[id];
					}
				}, map);
				const choices = [];
				for (const current of game.players) {
					const createDialog = ["请选择武将", [current._characterChoice, "character"]];
					if (current._friend) {
						createDialog.push("队友的武将");
						createDialog.push([current._friend._characterChoice, "character"]);
					}
					choices.push([
						current,
						{
							createDialog,
							forced: true,
							ai: () => Math.random(),
							filterButton: button => _status.event.player._characterChoice.includes(button.link),
						},
					]);
				}
				const result = await game.me
					.chooseButtonOL(choices, (current, choiceResult) => {
						if (game.online || current === game.me) {
							current.init(choiceResult.links[0]);
						}
					})
					.forResult();
				for (const id in lib.playerOL) {
					if (!result[id] || result[id] === "ai" || !result[id].links || !result[id].links.length) {
						result[id] = lib.playerOL[id]._characterChoice.randomGet();
					} else {
						result[id] = result[id].links[0];
					}
					if (!lib.playerOL[id].name) {
						lib.playerOL[id].init(result[id]);
					}
				}

				if (!game.zhu.isInitFilter("noZhuHp")) {
					game.zhu.maxHp++;
					game.zhu.hp++;
					game.zhu.update();
				}

				game.broadcast(
					(result, zhu) => {
						for (const id in result) {
							if (!lib.playerOL[id].name) {
								lib.playerOL[id].init(result[id]);
							}
						}
						game.zhu = zhu;
						if (!game.zhu.isInitFilter("noZhuHp")) {
							game.zhu.maxHp++;
							game.zhu.hp++;
							game.zhu.update();
						}

						setTimeout(() => ui.arena.classList.remove("choose-character"), 500);
					},
					result,
					game.zhu
				);
				for (const current of game.players) {
					_status.characterlist.remove(current.name1);
					_status.characterlist.remove(current.name2);
				}
				setTimeout(() => ui.arena.classList.remove("choose-character"), 500);
			});
		},
		/**
		 * 创建欢乐斗地主模式的联机叫地主与选将事件。
		 *
		 * @returns { void }
		 */
		chooseCharacterHuanleOL() {
			const next = game.createEvent("chooseCharacter");
			next.setContent(async (event, trigger, player) => {
				ui.arena.classList.add("choose-character");
				const characterList = [];
				const recommendedCharacters = [];
				const replacedCharacters = [];
				const controls = ["不叫", "叫地主"];
				if (!event.map) {
					event.map = {};
				}
				const characterMap = event.map;
				const libCharacter = {};
				for (const packName of lib.configOL.characterPack) {
					const pack = lib.characterPack[packName];
					for (const name in pack) {
						// if (name === "zuoci") {
						// 	continue;
						// }
						if (lib.character[name]) {
							libCharacter[name] = pack[name];
						}
					}
				}
				for (const group in lib.characterReplace) {
					const replacements = lib.characterReplace[group];
					for (const character of [...replacements]) {
						if (!libCharacter[character] || lib.filter.characterDisabled(character, libCharacter)) {
							replacements.remove(character);
						}
					}
					if (replacements.length) {
						const name = replacements.randomGet();
						characterList.push(name);
						if (game.recommendDizhu.includes(name)) {
							recommendedCharacters.push(name);
						}
						replacedCharacters.addArray(replacements);
					}
				}
				for (const name in libCharacter) {
					if (replacedCharacters.includes(name) || lib.filter.characterDisabled(name, libCharacter)) {
						continue;
					}
					characterList.push(name);
					if (game.recommendDizhu.includes(name)) {
						recommendedCharacters.push(name);
					}
				}
				for (const current of game.players) {
					const id = current.playerid;
					if (!characterMap[id]) {
						characterMap[id] = [];
					}
					characterMap[id].addArray(recommendedCharacters.randomRemove(1));
					characterList.removeArray(characterMap[id]);
					characterMap[id].addArray(characterList.randomRemove(4 - characterMap[id].length));
					recommendedCharacters.removeArray(characterMap[id]);
				}
				_status.characterlist = characterList.slice();
				const videoId = lib.status.videoId++;
				game.broadcastAll(
					(map, id) => {
						ui.create.dialog("你的选将框", [map[game.me.playerid], "character"]).videoId = id;
					},
					characterMap,
					videoId
				);
				const start = game.players.randomGet();
				let current = start;
				let biddingFinished = false;
				if (current !== game.me || !current.isOnline()) {
					await game.delay(3);
				}
				while (!biddingFinished) {
					const result = await current
						.chooseControl({
							controls: [...controls],
							ai: () => (Math.random() > 0.5 ? "不叫" : "叫地主"),
						})
						.forResult();
					current.chat(result.control);
					if (result.control === "叫地主" || current === start.next) {
						game.zhu = result.control === "叫地主" ? current : current.next;
						biddingFinished = true;
					} else {
						current = current.next;
					}
				}
				for (const current of game.players) {
					current.identity = current === game.zhu ? "zhu" : "fan";
					current.showIdentity();
					current.identityShown = true;
				}
				game.broadcastAll("closeDialog", videoId);
				characterMap[game.zhu.playerid].addArray(characterList.randomRemove(3));
				const choices = [];
				for (const current of game.players) {
					choices.push([
						current,
						{
							createDialog: ["选择角色", [characterMap[current.playerid], "character"]],
							forced: true,
						},
					]);
				}
				const result = await game.me
					.chooseButtonOL(choices, (current, choiceResult) => {
						if (game.online || current === game.me) {
							current.init(choiceResult.links[0], choiceResult.links[1]);
						}
					})
					.forResult();
				for (const id in result) {
					if (result[id]?.links) {
						for (const character of result[id].links) {
							recommendedCharacters.remove(character);
						}
					}
				}
				for (const id in result) {
					if (result[id] === "ai") {
						result[id] = recommendedCharacters.randomRemove(lib.configOL.double_character ? 2 : 1);
					} else {
						result[id] = result[id].links;
					}
					if (!lib.playerOL[id].name) {
						lib.playerOL[id].init(result[id][0], result[id][1]);
					}
				}

				if (!game.zhu.isInitFilter("noZhuHp")) {
					game.zhu.maxHp++;
					game.zhu.hp++;
					game.zhu.update();
				}

				game.broadcast(
					(result, zhu) => {
						for (const id in result) {
							if (!lib.playerOL[id].name) {
								lib.playerOL[id].init(result[id][0], result[id][1]);
							}
						}
						game.zhu = zhu;
						if (!game.zhu.isInitFilter("noZhuHp")) {
							game.zhu.maxHp++;
							game.zhu.hp++;
							game.zhu.update();
						}

						setTimeout(() => ui.arena.classList.remove("choose-character"), 500);
					},
					result,
					game.zhu
				);
				for (const current of game.players) {
					_status.characterlist.remove(current.name1);
					_status.characterlist.remove(current.name2);
				}
				setTimeout(() => ui.arena.classList.remove("choose-character"), 500);
			});
		},
		/**
		 * 创建兵临城下模式的联机叫地主与选将事件。
		 *
		 * @returns { void }
		 */
		chooseCharacterBinglinOL() {
			const next = game.createEvent("chooseCharacter");
			next.setContent(async (event, trigger, player) => {
				ui.arena.classList.add("choose-character");
				const libCharacter = {};
				for (const packName of lib.configOL.characterPack) {
					const pack = lib.characterPack[packName];
					for (const name in pack) {
						// if (name === "zuoci") {
						// 	continue;
						// }
						if (lib.character[name]) {
							libCharacter[name] = pack[name];
						}
					}
				}
				event.list = [];
				event.map = {};
				for (const name in libCharacter) {
					if (lib.filter.characterDisabled(name, libCharacter)) {
						continue;
					}
					event.list.push(name);
				}
				event.list.randomSort();
				_status.characterlist = event.list.slice(0);
				event.controls = ["不叫地主", "一倍", "两倍", "三倍"];
				for (const current of game.players) {
					const id = current.playerid;
					event.map[id] = event.list.randomRemove(4);
				}
				event.start = game.players.randomGet();
				event.current = event.start;

				event.videoId = lib.status.videoId++;
				game.zhuSkill = `zhuSkill_${["xiangyang", "jiangling", "fancheng"].randomGet()}`;
				game.broadcastAll(
					(map, id, skill) => {
						ui.create.dialog(`本局城池：${get.translation(skill)}`, [map[game.me.playerid], "character"]).videoId = id;
					},
					event.map,
					event.videoId,
					game.zhuSkill
				);
				await game.delay(6);
				let biddingFinished = false;
				while (!biddingFinished) {
					game.broadcastAll(
						(id, current) => {
							const dialog = get.idDialog(id);
							if (dialog) {
								dialog.content.firstChild.innerHTML = game.me === current ? "是否叫地主？" : "请等待其他玩家叫地主";
							}
						},
						event.videoId,
						event.current
					);
					if (event.current !== game.me && !event.current.isOnline()) {
						await game.delay(2);
					}
					const result = await event.current
						.chooseControl({
							controls: [...event.controls],
							ai: () => _status.event.getParent().controls.randomGet(),
						})
						.forResult();
					event.current._control = result.control;
					event.current.chat(result.control);
					if (result.control === "三倍") {
						game.bonusNum = 3;
						game.zhu = event.current;
						biddingFinished = true;
						continue;
					}
					if (result.control !== "不叫地主") {
						event.controls.splice(1, event.controls.indexOf(result.control));
						event.tempDizhu = event.current;
						if (result.control === "二倍") {
							game.bonusNum = 2;
						}
					}
					event.current = event.current.next;
					if (event.current === event.start) {
						game.zhu = event.tempDizhu || event.start;
						biddingFinished = true;
					}
					if (event.current === event.start.previous && !event.tempDizhu) {
						event.controls.remove("不叫地主");
					}
				}
				for (const current of game.players) {
					current.identity = current === game.zhu ? "zhu" : "fan";
					current.showIdentity();
					current.identityShown = true;
					current._characterChoice = event.map[current.playerid];
				}
				event.map[game.zhu.playerid].addArray(event.list.randomRemove(3));
				game.broadcastAll(
					(id, map) => {
						const dialog = get.idDialog(id);
						if (dialog) {
							dialog.close();
						}
						game.me._characterChoice = map[game.me.playerid];
					},
					event.videoId,
					event.map
				);
				const choices = [];
				for (const current of game.players) {
					const createDialog = ["请选择武将", [event.map[current.playerid], "character"]];
					if (current.identity === "fan") {
						const friend = game.findPlayer(target => target !== current && target.identity === "fan");
						createDialog.push('<div class="text center">队友的选将框</div>');
						createDialog.push([event.map[friend.playerid], "character"]);
					}
					choices.push([
						current,
						{
							createDialog,
							forced: true,
							ai: () => Math.random(),
							filterButton: button => _status.event.player._characterChoice.includes(button.link),
						},
					]);
				}
				const result = await game.me
					.chooseButtonOL(choices, (current, choiceResult) => {
						if (game.online || current === game.me) {
							current.init(choiceResult.links[0]);
						}
					})
					.forResult();
				for (const id in lib.playerOL) {
					if (!result[id] || result[id] === "ai" || !result[id].links || !result[id].links.length) {
						result[id] = event.map[id].randomGet();
					} else {
						result[id] = result[id].links[0];
					}
					if (!lib.playerOL[id].name) {
						lib.playerOL[id].init(result[id]);
					}
				}

				if (!game.zhu.isInitFilter("noZhuHp")) {
					game.zhu.maxHp++;
					game.zhu.hp++;
					game.zhu.update();
				}

				game.broadcast(
					(result, zhu) => {
						for (const id in result) {
							if (!lib.playerOL[id].name) {
								lib.playerOL[id].init(result[id]);
							}
						}
						game.zhu = zhu;
						if (!game.zhu.isInitFilter("noZhuHp")) {
							game.zhu.maxHp++;
							game.zhu.hp++;
							game.zhu.update();
						}

						setTimeout(() => ui.arena.classList.remove("choose-character"), 500);
					},
					result,
					game.zhu
				);
				for (const current of game.players) {
					if (current === game.zhu) {
						current.addSkill(game.zhuSkill);
					} else {
						current.addSkill(["binglin_shaxue", "binglin_neihong"]);
					}
				}
				for (const current of game.players) {
					_status.characterlist.remove(current.name1);
					_status.characterlist.remove(current.name2);
				}
				setTimeout(() => ui.arena.classList.remove("choose-character"), 500);
			});
		},
		/**
		 * 创建智斗三国模式的联机叫地主与选将事件。
		 *
		 * @returns { void }
		 */
		chooseCharacterZhidouOL() {
			const next = game.createEvent("chooseCharacter");
			next.setContent(async (event, trigger, player) => {
				ui.arena.classList.add("choose-character");
				const libCharacter = {};
				for (const packName of lib.configOL.characterPack) {
					const pack = lib.characterPack[packName];
					for (const name in pack) {
						// if (name === "zuoci") {
						// 	continue;
						// }
						if (lib.character[name]) {
							libCharacter[name] = pack[name];
						}
					}
				}
				const groups = [];
				event.list = [];
				event.map = {};
				const chara = get.config("character_online") || lib.characterOnline;
				for (const group in chara) {
					const list = chara[group];
					for (const name of [...list]) {
						if (!lib.character[name] || lib.connectBanned.includes(name) || (group === "key" && lib.filter.characterDisabled(name, libCharacter))) {
							list.remove(name);
						}
					}
					if (list.length >= 3) {
						groups.push(group);
						event.list.addArray(list);
					}
				}
				event.list.randomSort();
				_status.characterlist = event.list.slice(0);
				event.controls = ["不叫地主", "一倍", "两倍", "三倍"];
				for (const current of game.players) {
					const id = current.playerid;
					current._group = groups.randomRemove(1)[0];
					event.map[id] = chara[current._group].randomGets(3);
					current.storage.doudizhu_cardPile = get.cards(20).sort((a, b) => {
						if (a.name !== b.name) {
							return lib.sort.card(a.name, b.name);
						}
						if (a.suit !== b.suit) {
							return lib.suit.indexOf(a) - lib.suit.indexOf(b);
						}
						return a.number - b.number;
					});
					current.markSkill("doudizhu_cardPile");
				}
				event.start = game.players.randomGet();
				event.current = event.start;

				event.videoId = lib.status.videoId++;
				game.broadcastAll(
					(map, id) => {
						ui.create.dialog("你的选将框和底牌", [map[game.me.playerid], "character"], game.me.storage.doudizhu_cardPile).videoId = id;
					},
					event.map,
					event.videoId
				);
				await game.delay(4);
				let biddingFinished = false;
				while (!biddingFinished) {
					game.broadcastAll(
						(id, current) => {
							const dialog = get.idDialog(id);
							if (dialog) {
								dialog.content.firstChild.innerHTML = game.me === current ? "是否叫地主？" : "请等待其他玩家叫地主";
							}
						},
						event.videoId,
						event.current
					);
					if (event.current !== game.me && !event.current.isOnline()) {
						await game.delay(2);
					}
					const result = await event.current
						.chooseControl({
							controls: [...event.controls],
							ai: () => _status.event.getParent().controls.randomGet(),
						})
						.forResult();
					event.current._control = result.control;
					event.current.chat(result.control);
					if (result.control === "三倍") {
						game.bonusNum = 3;
						game.zhu = event.current;
						biddingFinished = true;
						continue;
					}
					if (result.control !== "不叫地主") {
						event.controls.splice(1, event.controls.indexOf(result.control));
						event.tempDizhu = event.current;
						if (result.control === "二倍") {
							game.bonusNum = 2;
						}
					}
					event.current = event.current.next;
					if (event.current === event.start && (event.start === event.tempDizhu || event.start._control === "不叫地主")) {
						game.zhu = event.tempDizhu || event.start.previous;
						biddingFinished = true;
					} else if (event.current === event.start.next && event.current._control) {
						game.zhu = event.tempDizhu;
						biddingFinished = true;
					}
					if (event.current === event.start.previous && !event.tempDizhu) {
						event.controls.remove("不叫地主");
					}
				}
				for (const current of game.players) {
					current.identity = current === game.zhu ? "zhu" : "fan";
					current.showIdentity();
					current.identityShown = true;
				}
				game.broadcastAll("closeDialog", event.videoId);
				const choices = [];
				for (const current of game.players) {
					choices.push([
						current,
						{
							createDialog: [`选择${current === game.zhu ? "两" : "一"}张武将牌`, [event.map[current.playerid], "character"]],
							forced: true,
							selectButton: current === game.zhu ? 2 : 1,
						},
					]);
				}
				const result = await game.me
					.chooseButtonOL(choices, (current, choiceResult) => {
						if (game.online || current === game.me) {
							current.init(choiceResult.links[0], choiceResult.links[1]);
						}
					})
					.forResult();
				for (const id in result) {
					if (result[id] === "ai") {
						result[id] = event.map[id].randomRemove(lib.playerOL[id] === game.zhu ? 2 : 1);
					} else {
						result[id] = result[id].links;
					}
					if (!lib.playerOL[id].name) {
						lib.playerOL[id].init(result[id][0], result[id][1]);
					}
				}

				game.zhu.hp = 4;
				game.zhu.maxHp = 4;
				game.zhu.update();

				game.broadcast(
					(result, zhu) => {
						for (const id in result) {
							if (!lib.playerOL[id].name) {
								lib.playerOL[id].init(result[id][0], result[id][1]);
							}
						}
						game.zhu = zhu;
						game.zhu.hp = 4;
						game.zhu.maxHp = 4;
						game.zhu.update();

						setTimeout(() => ui.arena.classList.remove("choose-character"), 500);
					},
					result,
					game.zhu
				);
				for (const current of game.players) {
					_status.characterlist.remove(current.name1);
					_status.characterlist.remove(current.name2);
				}
				setTimeout(() => ui.arena.classList.remove("choose-character"), 500);
			});
		},
		/**
		 * 根据当前子模式创建联机选将事件。
		 *
		 * @returns { void }
		 */
		chooseCharacterOL() {
			if (_status.mode === "kaihei") {
				game.chooseCharacterKaiheiOL();
				return;
			}
			if (_status.mode === "huanle") {
				game.chooseCharacterHuanleOL();
				return;
			}
			if (_status.mode === "online") {
				game.chooseCharacterZhidouOL();
				return;
			}
			if (_status.mode === "binglin") {
				game.chooseCharacterBinglinOL();
				return;
			}
			const next = game.createEvent("chooseCharacter");
			next.setContent(async (event, trigger, player) => {
				ui.arena.classList.add("choose-character");
				const identityList = ["zhu", "fan", "fan"];
				identityList.randomSort();
				for (const [index, current] of game.players.entries()) {
					current.identity = identityList[index];
					current.showIdentity();
					current.identityShown = true;
					if (identityList[index] === "zhu") {
						game.zhu = current;
					}
				}

				const characterList = [];
				const availableCharacters = [];

				const libCharacter = {};
				for (const packName of lib.configOL.characterPack) {
					const pack = lib.characterPack[packName];
					for (const name in pack) {
						// if (name === "zuoci") {
						// 	continue;
						// }
						if (lib.character[name]) {
							libCharacter[name] = pack[name];
						}
					}
				}
				for (const name in lib.characterReplace) {
					const replacements = lib.characterReplace[name];
					for (const character of [...replacements]) {
						if (!libCharacter[character] || lib.filter.characterDisabled(character, libCharacter)) {
							replacements.remove(character);
						}
					}
					if (replacements.length) {
						characterList.push(name);
						availableCharacters.addArray(replacements);
					}
				}
				game.broadcast(availableCharacters => {
					for (const name in lib.characterReplace) {
						const replacements = lib.characterReplace[name];
						for (const character of [...replacements]) {
							if (!availableCharacters.includes(character)) {
								replacements.remove(character);
							}
						}
					}
				}, availableCharacters);
				for (const name in libCharacter) {
					if (availableCharacters.includes(name) || lib.filter.characterDisabled(name, libCharacter)) {
						continue;
					}
					characterList.push(name);
					availableCharacters.push(name);
				}
				_status.characterlist = availableCharacters;
				const choices = [];
				const selectButton = lib.configOL.double_character ? 2 : 1;

				const num = Math.floor(characterList.length / game.players.length);

				for (const current of game.players) {
					const choiceCount = Math.min(num, lib.configOL[`choice_${current.identity}`]);
					choices.push([
						current,
						{
							createDialog: ["选择角色", [characterList.randomRemove(choiceCount), "characterx"]],
							selectButton,
							forced: true,
						},
					]);
				}
				const result = await game.me
					.chooseButtonOL(choices, (current, choiceResult) => {
						if (game.online || current === game.me) {
							current.init(choiceResult.links[0], choiceResult.links[1]);
						}
					})
					.forResult();
				for (const id in result) {
					if (result[id]?.links) {
						for (const character of result[id].links) {
							characterList.remove(get.sourceCharacter(character));
						}
					}
				}
				for (const id in result) {
					if (result[id] === "ai") {
						result[id] = characterList.randomRemove(lib.configOL.double_character ? 2 : 1).map(character => {
							const replacements = lib.characterReplace[character];
							return replacements?.length ? replacements.randomGet() : character;
						});
					} else {
						result[id] = result[id].links;
					}
					if (!lib.playerOL[id].name) {
						lib.playerOL[id].init(result[id][0], result[id][1]);
					}
				}

				if (!game.zhu.isInitFilter("noZhuHp")) {
					game.zhu.maxHp++;
					game.zhu.hp++;
					game.zhu.update();
				}

				game.broadcast(
					(result, zhu) => {
						for (const id in result) {
							if (!lib.playerOL[id].name) {
								lib.playerOL[id].init(result[id][0], result[id][1]);
							}
						}
						game.zhu = zhu;
						if (!game.zhu.isInitFilter("noZhuHp")) {
							game.zhu.maxHp++;
							game.zhu.hp++;
							game.zhu.update();
						}

						setTimeout(() => ui.arena.classList.remove("choose-character"), 500);
					},
					result,
					game.zhu
				);
				for (const current of game.players) {
					_status.characterlist.remove(current.name1);
					_status.characterlist.remove(current.name2);
				}
				setTimeout(() => ui.arena.classList.remove("choose-character"), 500);
			});
		},
	},
	translate: {
		zhu: "主",
		fan: "反",
		zhu2: "地主",
		fan2: "农民",
		random2: "随机",
		feiyang: "飞扬",
		doudizhu_viewHandcard: "手牌可见",
		bahu: "跋扈",
		feiyang_info: "判定阶段开始时，若你的判定区有牌，则你可以弃置两张牌，然后弃置你判定区的所有牌。",
		bahu_info: "锁定技，准备阶段开始时，你摸一张牌。出牌阶段，你出【杀】次数+1。",
		kaihei: "强易",
		kaihei_info: "出牌阶段，你可以获得一名其他角色的至多两张牌，然后交给其等量的牌。每名角色每局游戏限一次。",
		dcfeiyang: "飞扬",
		dcfeiyang_info: "判定阶段开始时，若你的判定区有牌，则你可以弃置两张手牌，然后弃置你判定区的所有牌。",
		mbfeiyang: "飞扬",
		mbfeiyang_info: "判定阶段开始时，若你的判定区有牌，则你可以弃置两张手牌，然后弃置你判定区的一张牌。",
		yinfu: "殷富",
		yinfu_info: "锁定技。①回合开始时，若你的已损失体力值不小于游戏轮次，你回复1点体力。②当你发动〖殷富①〗至少3次后，你失去〖殷富〗。",
		shiqiang: "恃强",
		shiqiang_info: "出牌阶段限一次，你可以将一张牌当无距离限制的【杀】使用。此【杀】结算结束后，若未造成伤害，你减1点体力上限。",
		oldshiqiang: "恃强",
		oldshiqiang_info: "出牌阶段限一次，你可以将一张牌当无距离限制的任意【杀】使用。你以此法使用【杀】时，摸一张牌。此【杀】结算结束后，若未造成伤害，你减1点体力上限。",
		qiangyi: "强易",
		qiangyi_info: "每名角色限一次。出牌阶段，你选择一名其他角色，获得其一张手牌，然后交给其一张手牌。",
		doudizhu_cardPile: "底牌",
		online_gongshoujintui: "攻守进退",
		gongshoujianbei: "攻守兼备",
		gongshoujianbei_info: "出牌阶段，你可选择：①将此牌当做【万箭齐发】使用。②将此牌当做【桃园结义】使用。",
		jintuiziru: "进退自如",
		jintuiziru_info: "出牌阶段，你可选择：①将此牌当做【南蛮入侵】使用。②将此牌当做【五谷丰登】使用。",
		diqi: "地契",
		diqi_skill: "地契",
		diqi_info: "当你受到伤害时，你可以弃置此牌，防止此伤害。当此牌离开你的装备区后，销毁之。",
		_juzhong: "聚众",
		juzhong_jiu: "聚众",
		zhadan: "炸弹",
		zhadan_info: "当一张牌被使用时，对此牌使用。取消此牌的所有目标，且本局游戏的底价翻倍。",
		jiwangkailai: "继往开来",
		jiwangkailai_info: "出牌阶段，对包含你自己在内的一名角色使用。目标角色选择一项：①弃置所有手牌，然后摸等量的牌。②将所有手牌当做一张不为【继往开来】的普通锦囊牌使用。",
		zhuSkill_xiangyang: "襄阳",
		zhuSkill_xiangyang_info: "回合结束时，你可获得一个额外的出牌阶段或摸牌阶段。",
		zhuSkill_jiangling: "江陵",
		zhuSkill_jiangling0: "江陵",
		zhuSkill_jiangling1: "江陵",
		zhuSkill_jiangling_info: "出牌阶段开始时，你可选择一项：①本阶段内使用【杀】或普通锦囊牌选择唯一目标时可增加一个目标。②本阶段内使用【杀】或普通锦囊牌无次数限制。",
		zhuSkill_fancheng: "樊城",
		zhuSkill_fancheng0: "樊城",
		zhuSkill_fancheng1: "樊城",
		zhuSkill_fancheng_info: "限定技，出牌阶段，你可选择获得一项效果直到游戏结束：①因执行【杀】的效果而对其他角色造成的伤害+1。②对其他角色造成的渠道不为【杀】的伤害+1。",
		binglin_shaxue: "歃血",
		binglin_shaxue_info: "锁定技，每局游戏限三次，当你受到队友造成的伤害时，你防止此伤害。",
		binglin_neihong: "内讧",
		binglin_neihong_info: "锁定技，当你杀死队友后，你所在的阵营视为游戏失败。",
		baiyidujiang: "白衣渡江",
		baiyidujiang_info: "出牌阶段，对地主使用。你选择一项：①令其将手牌数摸至全场最多。②令其将手牌数弃置至全场最少。",
		luojingxiashi: "落井下石",
		luojingxiashi_info: "出牌阶段，对所有其他的已受伤角色使用。目标角色受到1点伤害。",
		binglinchengxia: "兵临城下",
		binglinchengxia_info: "出牌阶段，对一名其他角色使用。将此牌横置于目标角色的判定区内。目标角色于判定阶段进行判定，若判定结果不为♦，则其弃置装备区内的所有牌或受到1点伤害。",
		toushiche: "投石车",
		toushiche_skill: "投石车",
		toushiche_info: "锁定技，结束阶段开始时，你令所有手牌数大于你的角色依次弃置一张手牌。",
		binglin_bingjin: "兵尽",
	},
	element: {
		player: {
			/**
			 * 从地主牌堆顶获取指定数量的牌，不足时从公共牌堆补齐。
			 *
			 * @this { Player }
			 * @param { number } [num=1] - 要获取的牌数。
			 * @returns { Card[] } 获取到的牌。
			 */
			getTopCards(num) {
				if (typeof num !== "number") {
					num = 1;
				}
				let cards;
				const player = this;
				if (num <= 0) {
					cards = [];
				} else if (player.storage.doudizhu_cardPile?.length) {
					cards = player.storage.doudizhu_cardPile.randomRemove(num);
					if (player.storage.doudizhu_cardPile.length) {
						player.markSkill("doudizhu_cardPile");
					} else {
						player.unmarkSkill("doudizhu_cardPile");
					}
				} else {
					cards = [];
				}
				if (cards.length < num) {
					cards.addArray(get.cards(num - cards.length));
				} else {
					game.updateRoundNumber();
				}
				return cards;
			},
			/**
			 * 在角色死亡后创建死亡身份标记，并使其方向与角色一致。
			 *
			 * @this { Player }
			 * @returns { void }
			 */
			$dieAfter() {
				if (_status.video) {
					return;
				}
				if (!this.node.dieidentity) {
					const str = { zhu: "地主", fan: "农民" }[this.identity];
					const node = ui.create.div(".damage.dieidentity", str, this);
					ui.refresh(node);
					node.style.opacity = 1;
					this.node.dieidentity = node;
				}
				const trans = this.style.transform;
				if (trans) {
					if (trans.indexOf("rotateY") !== -1) {
						this.node.dieidentity.style.transform = "rotateY(180deg)";
					} else if (trans.indexOf("rotateX") !== -1) {
						this.node.dieidentity.style.transform = "rotateX(180deg)";
					} else {
						this.node.dieidentity.style.transform = "";
					}
				} else {
					this.node.dieidentity.style.transform = "";
				}
			},
			/**
			 * 处理角色死亡后的胜负结算。
			 *
			 * @this { Player }
			 * @param { Player } [source] - 击杀来源角色。
			 * @returns { void }
			 */
			dieAfter(source) {
				if (_status.mode === "binglin" && source && this !== source && this.identity === source.identity && source.hasSkill("binglin_neihong")) {
					game.over(game.me === game.zhu);
					return;
				}
				game.checkResult();
			},
			/**
			 * 处理农民死亡后的队友强化和认输提示。
			 *
			 * @this { Player }
			 * @returns { void }
			 */
			dieAfter2() {
				if (_status.mode === "binglin" || _status.mode === "online" || this.identity !== "fan") {
					return;
				}
				const player = this;
				const target = game.findPlayer(current => current !== player && current.identity === "fan", true);
				if (!target) {
					return;
				}
				target.showGiveup();
				const version = _status.connectMode ? lib.configOL.enhance_nongmin : get.config("enhance_nongmin");
				if (version !== "decade") {
					target[version === "mobile" ? "chooseDrawRecover" : "draw"](version === "mobile" ? 2 : 1);
				}
			},
			/**
			 * 斗地主模式不根据行动更新 AI 身份暴露度。
			 *
			 * @this { Player }
			 * @param { Player[] | number } targets - 行动目标，或暴露度变化值。
			 * @param { Card | VCard | string } card - 使用的牌或技能。
			 * @returns { void }
			 */
			logAi(targets, card) {},
			/**
			 * 公开并同步当前角色的身份。
			 *
			 * @this { Player }
			 * @returns { void }
			 */
			showIdentity() {
				game.broadcastAll(
					(player, identity) => {
						player.identity = identity;
						player.node.identity.classList.remove("guessing");
						player.identityShown = true;
						player.ai.shown = 1;
						player.setIdentity();
						if (player.identity === "zhu") {
							player.isZhu = true;
						}
						if (!_status.clickingidentity) {
							return;
						}
						for (const node of _status.clickingidentity[1]) {
							node.delete();
							node.style.transform = "";
						}
						delete _status.clickingidentity;
					},
					this,
					this.identity
				);
			},
		},
	},
	get: {
		/**
		 * 根据双方身份计算显式态度值。
		 *
		 * @param { Player } from - 态度来源角色。
		 * @param { Player } to - 态度目标角色。
		 * @returns { number } 身份相同时为 10，否则为 -10。
		 */
		rawAttitude(from, to) {
			return from.identity === to.identity ? 10 : -10;
		},
	},
	skill: {
		binglin_bingjin: {
			trigger: { player: "phaseEnd" },
			forced: true,
			ruleSkill: true,
			filter(event, player) {
				return _status.mode === "binglin" && game.roundNumber > 14;
			},
			async content(event, trigger, player) {
				await player.loseHp();
			},
		},
		zhuSkill_xiangyang: {
			trigger: { player: "phaseEnd" },
			charlotte: true,
			direct: true,
			async content(event, trigger, player) {
				const result = await player
					.chooseControl({
						controls: ["摸牌阶段", "出牌阶段", "cancel2"],
						prompt: "襄阳：是否执行一个额外的阶段？",
					})
					.forResult();
				if (result.control === "cancel2") {
					return;
				}
				player.logSkill(event.name);
				const next = player[result.index ? "phaseUse" : "phaseDraw"]();
				event.next.remove(next);
				trigger.next.push(next);
			},
		},
		zhuSkill_jiangling: {
			trigger: { player: "phaseUseBegin" },
			direct: true,
			charlotte: true,
			async content(event, trigger, player) {
				const result = await player
					.chooseControl({
						controls: ["加目标", "多刀", "取消"],
						prompt: get.prompt2("zhuSkill_jiangling"),
						ai: () => 3 - game.countPlayer(),
					})
					.forResult();
				if (result.index >= 2) {
					return;
				}
				player.logSkill("zhuSkill_jiangling");
				player.addTempSkill(`zhuSkill_jiangling${result.index}`, "phaseUseAfter");
				game.log(player, "选择了", `#y${result.control}`, "的效果");
			},
		},
		zhuSkill_jiangling0: {
			trigger: { player: "useCard2" },
			direct: true,
			charlotte: true,
			filter(event, player) {
				if (event.card.name !== "sha" && get.type(event.card) !== "trick") {
					return false;
				}
				if (!event.targets || event.targets.length !== 1) {
					return false;
				}
				const info = get.info(event.card);
				if (info.allowMultiple === false || info.multitarget) {
					return false;
				}
				return game.hasPlayer(current => !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, player, current) && lib.filter.targetInRange(event.card, player, current));
			},
			async content(event, trigger, player) {
				const prompt2 = `为${get.translation(trigger.card)}增加一个目标`;
				const result = await player
					.chooseTarget({
						prompt: get.prompt("zhuSkill_jiangling"),
						prompt2,
						filterTarget: (_card, player, target) => !_status.event.targets.includes(target) && lib.filter.targetEnabled2(_status.event.card, player, target) && lib.filter.targetInRange(_status.event.card, player, target),
						ai: target => {
							const trigger = _status.event.getTrigger();
							const player = _status.event.player;
							return get.effect(target, trigger.card, player, player) * (_status.event.targets.includes(target) ? -1 : 1);
						},
					})
					.set("targets", trigger.targets)
					.set("card", trigger.card)
					.forResult();
				if (!result.bool) {
					return;
				}
				if (!event.isMine() && !event.isOnline()) {
					await game.delayx();
				}
				const { targets } = result;
				player.logSkill("zhuSkill_jiangling", targets);
				if (trigger.targets.includes(targets[0])) {
					trigger.targets.removeArray(targets);
				} else {
					//trigger.directHit.addArray(targets);
					trigger.targets.addArray(targets);
				}
			},
		},
		zhuSkill_jiangling1: {
			charlotte: true,
			mod: {
				cardUsable(card, player) {
					if (card.name === "sha" || get.type(card) === "trick") {
						return Infinity;
					}
				},
			},
		},
		zhuSkill_fancheng: {
			enable: "phaseUse",
			limited: true,
			charlotte: true,
			skillAnimation: true,
			animationColor: "gray",
			async content(event, trigger, player) {
				player.awakenSkill(event.name);
				const result = await player
					.chooseControl({
						controls: ["杀", "其他"],
						prompt: "选择要强化的伤害",
						ai: () => get.rand(0, 1),
					})
					.forResult();
				player.addSkill(`zhuSkill_fancheng${result.index}`);
				game.log(player, "本局游戏内", result.index ? "#g杀以外" : "#y杀", "的伤害+1");
			},
			ai: {
				order: 100,
				result: { player: 100 },
			},
		},
		zhuSkill_fancheng0: {
			trigger: { source: "damageBegin2" },
			forced: true,
			charlotte: true,
			filter(event, player) {
				return event.player !== player && event.card && event.card.name === "sha" && event.getParent().name === "sha";
			},
			logTarget: "player",
			async content(event, trigger, player) {
				trigger.num++;
			},
			mark: true,
			marktext: "殺",
			intro: { content: "因执行【杀】的效果对其他角色造成的伤害+1" },
		},
		zhuSkill_fancheng1: {
			trigger: { source: "damageBegin2" },
			forced: true,
			charlotte: true,
			filter(event, player) {
				return event.player !== player && (!event.card || event.card.name !== "sha");
			},
			logTarget: "player",
			async content(event, trigger, player) {
				trigger.num++;
			},
			mark: true,
			marktext: "谋",
			intro: { content: "不因【杀】对其他角色造成的伤害+1" },
		},
		binglin_shaxue: {
			init(player, skill) {
				player.addMark(skill, 3, false);
			},
			trigger: { player: "damageBegin3" },
			forced: true,
			charlotte: true,
			filter(event, player) {
				return event.source && player !== event.source && player.identity === event.source.identity && player.hasMark("binglin_shaxue");
			},
			async content(event, trigger, player) {
				trigger.cancel();
				player.removeMark("binglin_shaxue", 1, false);
				trigger.source.removeMark("binglin_shaxue", 1, false);
			},
			intro: { content: "剩余次数：#" },
			ai: {
				viewHandcard: true,
				skillTagFilter(player, tag, arg) {
					return player !== arg && arg.hasSkill("binglin_shaxue");
				},
			},
		},
		binglin_neihong: { charlotte: true },
		toushiche_skill: {
			trigger: { player: "phaseJieshuBegin" },
			forced: true,
			equipSkill: true,
			filter(event, player) {
				return lib.skill.toushiche_skill.logTarget(null, player).length > 0;
			},
			logTarget(event, player) {
				const hs = player.countCards("h");
				return game.filterPlayer(current => current !== player && current.countCards("h") > hs);
			},
			async content(event, trigger, player) {
				const targets = lib.skill.toushiche_skill.logTarget(null, player).sortBySeat();
				for (const target of targets) {
					if (target.hasCards("h")) {
						await target.chooseToDiscard({ position: "h", forced: true });
					}
				}
			},
		},
		online_gongshoujintui: {
			enable: "chooseToUse",
			filter(event, player) {
				const cards = player.getCards("hs");
				for (const card of cards) {
					const name = get.name(card, player);
					if (
						name === "gongshoujianbei" &&
						(event.filterCard(
							{
								name: "wanjian",
								isCard: true,
								cards: [card],
							},
							player,
							event
						) ||
							event.filterCard(
								{
									name: "taoyuan",
									isCard: true,
									cards: [card],
								},
								player,
								event
							))
					) {
						return true;
					}
					if (
						name === "jintuiziru" &&
						(event.filterCard(
							{
								name: "nanman",
								isCard: true,
								cards: [card],
							},
							player,
							event
						) ||
							event.filterCard(
								{
									name: "wugu",
									isCard: true,
									cards: [card],
								},
								player,
								event
							))
					) {
						return true;
					}
				}
				return false;
			},
			chooseButton: {
				dialog(event, player) {
					const list = [];
					if (player.countCards("hs", "gongshoujianbei")) {
						list.push(["锦囊", "", "wanjian"]);
						list.push(["锦囊", "", "taoyuan"]);
					}
					if (player.countCards("hs", "jintuiziru")) {
						list.push(["锦囊", "", "nanman"]);
						list.push(["锦囊", "", "wugu"]);
					}
					return ui.create.dialog("攻守兼备/进退自如", [list, "vcard"], "hidden");
				},
				filter(button, player) {
					const name = button.link[2];
					const rawname = name === "wanjian" || name === "taoyuan" ? "gongshoujianbei" : "jintuiziru";
					const cards = player.getCards("hs");
					const evt = _status.event.getParent();
					for (const card of cards) {
						if (
							get.name(card, player) === rawname &&
							evt.filterCard(
								{
									name,
									isCard: true,
									cards: [card],
								},
								player,
								evt
							)
						) {
							return true;
						}
					}
					return false;
				},
				check(button) {
					return _status.event.player.getUseValue({ name: button.link[2], isCard: true });
				},
				backup(links) {
					const name = links[0][2];
					const rawname = name === "wanjian" || name === "taoyuan" ? "gongshoujianbei" : "jintuiziru";
					return {
						popname: true,
						viewAs: { name, isCard: true },
						filterCard: { name: rawname },
						ai1: () => 1,
					};
				},
				prompt(links) {
					const name = links[0][2];
					const rawname = name === "wanjian" || name === "taoyuan" ? "gongshoujianbei" : "jintuiziru";
					return `将一张${get.translation(rawname)}当做${get.translation(name)}使用`;
				},
			},
			ai: {
				order: 10,
				result: {
					player: 1,
				},
			},
		},
		doudizhu_cardPile: {
			intro: {
				content: "cardCount",
			},
		},
		kaihei: {
			charlotte: true,
			enable: "phaseUse",
			filter(event, player) {
				return player === game.zhu && game.hasPlayer(current => lib.skill.kaihei.filterTarget(null, player, current));
			},
			filterTarget(card, player, target) {
				return player !== target && !player.getStorage("kaihei_used").includes(target) && target.countGainableCards(player, "he") > 0;
			},
			async content(event, trigger, player) {
				const { target } = event;
				player.markAuto(`${event.name}_used`, target);
				const result = await player
					.gainPlayerCard({
						target,
						selectButton: [1, 2],
						position: "he",
						forced: true,
					})
					.forResult();
				if (!result?.bool || !result.cards?.length) {
					return;
				}
				const num = result.cards.length;
				const hs = player.getCards("he");
				if (!hs.length || !target?.isIn()) {
					return;
				}
				let resultx;
				if (hs.length <= num) {
					resultx = { bool: true, cards: hs };
				} else {
					resultx = await player
						.chooseCard({
							position: "he",
							forced: true,
							selectCard: num,
							prompt: `选择交给${get.translation(target)}${get.cnNumber(num)}张牌`,
						})
						.forResult();
				}
				if (!resultx?.bool || !resultx.cards?.length) {
					return;
				}
				await player.give(resultx.cards, target);
			},
			ai: {
				order: 5,
				result: {
					player: 1,
					target: -1,
				},
			},
		},
		doudizhu_viewHandcard: {
			ai: {
				viewHandcard: true,
				skillTagFilter(player, tag, target) {
					if (player === target || player.identity !== "fan" || target.identity !== "fan") {
						return false;
					}
				},
			},
		},
		//OL飞扬
		feiyang: {
			charlotte: true,
			trigger: { player: "phaseJudgeBegin" },
			filter(event, player) {
				return _status.mode !== "online" && _status.mode !== "binglin" && player === game.zhu && player.hasCards("j") && player.countCards("he") > 1;
			},
			async cost(event, trigger, player) {
				event.result = await player
					.chooseToDiscard("he", 2, get.prompt(event.skill), "弃置两张牌，然后弃置判定区里的所有牌")
					.set("logSkill", event.skill)
					.set("ai", card => {
						if (_status.event.goon) {
							return 7 - get.value(card);
						}
						return 0;
					})
					.set(
						"goon",
						(() => {
							if (player.hasSkillTag("rejudge") && player.countCards("j") < 2) {
								return false;
							}
							return player.hasCard(card => {
								if (get.tag(card, "damage") && get.damageEffect(player, player, _status.event.player, get.natureList(card)) >= 0) {
									return false;
								}
								return (
									get.effect(
										player,
										{
											name: card.viewAs || card.name,
											cards: [card],
										},
										player,
										player
									) < 0
								);
							}, "j");
						})()
					)
					.forResult();
			},
			popup: false,
			async content(event, trigger, player) {
				await player.discardPlayerCard(player, "j", true, player.countCards("j"));
			},
		},
		//十周年飞扬
		dcfeiyang: {
			charlotte: true,
			trigger: { player: "phaseJudgeBegin" },
			filter(event, player) {
				return _status.mode !== "online" && _status.mode !== "binglin" && player === game.zhu && player.hasCards("j") && player.countCards("h") > 1;
			},
			async cost(event, trigger, player) {
				event.result = await player
					.chooseToDiscard("h", 2, get.prompt(event.skill), "弃置两张手牌，然后弃置判定区里的所有牌")
					.set("logSkill", event.skill)
					.set("ai", card => {
						if (_status.event.goon) {
							return 7 - get.value(card);
						}
						return 0;
					})
					.set(
						"goon",
						(() => {
							if (player.hasSkillTag("rejudge") && player.countCards("j") < 2) {
								return false;
							}
							return player.hasCard(card => {
								if (get.tag(card, "damage") && get.damageEffect(player, player, _status.event.player, get.natureList(card)) >= 0) {
									return false;
								}
								return (
									get.effect(
										player,
										{
											name: card.viewAs || card.name,
											cards: [card],
										},
										player,
										player
									) < 0
								);
							}, "j");
						})()
					)
					.forResult();
			},
			popup: false,
			async content(event, trigger, player) {
				await player.discardPlayerCard(player, "j", true, player.countCards("j"));
			},
		},
		//手杀飞扬
		mbfeiyang: {
			charlotte: true,
			trigger: { player: "phaseJudgeBegin" },
			filter(event, player) {
				return _status.mode !== "online" && _status.mode !== "binglin" && player === game.zhu && player.hasCards("j") && player.countCards("h") > 1;
			},
			async cost(event, trigger, player) {
				event.result = await player
					.chooseToDiscard("h", 2, get.prompt(event.skill), "弃置两张手牌，然后弃置判定区里的一张牌")
					.set("logSkill", event.skill)
					.set("ai", card => {
						if (_status.event.goon) {
							return 7 - get.value(card);
						}
						return 0;
					})
					.set(
						"goon",
						(() => {
							if (player.hasSkillTag("rejudge")) {
								return false;
							}
							return player.hasCard(card => {
								if (get.tag(card, "damage") && get.damageEffect(player, player, _status.event.player, get.natureList(card)) >= 0) {
									return false;
								}
								return (
									get.effect(
										player,
										{
											name: card.viewAs || card.name,
											cards: [card],
										},
										player,
										player
									) < 0
								);
							}, "j");
						})()
					)
					.forResult();
			},
			popup: false,
			async content(event, trigger, player) {
				await player.discardPlayerCard(player, "j", true);
			},
		},
		//跋扈
		bahu: {
			charlotte: true,
			trigger: { player: "phaseZhunbeiBegin" },
			filter(event, player) {
				return _status.mode !== "online" && _status.mode !== "binglin" && player === game.zhu;
			},
			forced: true,
			async content(event, trigger, player) {
				await player.draw();
			},
			mod: {
				cardUsable(card, player, num) {
					if (_status.mode !== "online" && _status.mode !== "binglin" && player === game.zhu && card.name === "sha") {
						return num + 1;
					}
				},
			},
		},
		//殷富
		yinfu: {
			charlotte: true,
			trigger: { player: "phaseBegin" },
			filter(event, player) {
				return player.isDamaged() && player.getDamagedHp() >= game.roundNumber;
			},
			forced: true,
			async content(event, trigger, player) {
				await player.recover();
				if (player.getAllHistory("useSkill", evt => evt.skill === event.name).length > 2) {
					await player.removeSkills(event.name);
				}
			},
		},
		//恃强·削弱
		shiqiang: {
			charlotte: true,
			enable: "phaseUse",
			filter(event, player) {
				return event.filterCard(get.autoViewAs({ name: "sha", storage: { shiqiang: true } }, "unsure"), player, event);
			},
			usable: 1,
			filterCard: true,
			position: "hes",
			viewAs: {
				name: "sha",
				storage: { shiqiang: true },
			},
			locked: false,
			async precontent(event, trigger, player) {
				player.addTempSkill("shiqiang_effect");
			},
			mod: {
				targetInRange(card, player, target) {
					if (card?.storage?.shiqiang) {
						return true;
					}
				},
			},
			subSkill: {
				effect: {
					charlotte: true,
					trigger: { player: "useCardAfter" },
					filter(event, player) {
						if (event.skill === "shiqiang") {
							return !game.hasPlayer2(target => target.hasHistory("damage", evt => evt.card === event.card));
						}
						return false;
					},
					forced: true,
					popup: false,
					async content(event, trigger, player) {
						await player.loseMaxHp();
					},
				},
			},
			ai: {
				order: 4,
				result: {
					player: 1,
				},
			},
		},
		//恃强
		oldshiqiang: {
			enable: "phaseUse",
			usable: 1,
			hiddenCard(player, name) {
				return name === "sha" && player.hasCards("hes");
			},
			filter(event, player) {
				return event.filterCard(get.autoViewAs({ name: "sha", storage: { oldshiqiang: true } }, "unsure"), player, event) || lib.inpile_nature.some(nature => event.filterCard(get.autoViewAs({ name: "sha", nature, storage: { oldshiqiang: true } }, "unsure"), player, event));
			},
			chooseButton: {
				dialog(event, player) {
					const list = [];
					if (event.filterCard(get.autoViewAs({ name: "sha", storage: { oldshiqiang: true } }, "unsure"), player, event)) {
						list.push(["基本", "", "sha"]);
					}
					for (const nature of lib.inpile_nature) {
						if (event.filterCard(get.autoViewAs({ name: "sha", nature, storage: { oldshiqiang: true } }, "unsure"), player, event)) {
							list.push(["基本", "", "sha", nature]);
						}
					}
					const dialog = ui.create.dialog("恃强", [list, "vcard"], "hidden");
					dialog.direct = true;
					return dialog;
				},
				check(button) {
					const player = _status.event.player;
					const card = { name: button.link[2], nature: button.link[3] };
					if (_status.event.getParent().type === "phase" && game.hasPlayer(current => player.canUse(card, current) && get.effect(current, card, player, player) > 0)) {
						switch (button.link[2]) {
							case "sha":
								if (button.link[3] === "fire") {
									return 2.95;
								} else if (button.link[3] === "thunder" || button.link[3] === "ice") {
									return 2.92;
								} else {
									return 2.9;
								}
						}
					}
					return 1 + Math.random();
				},
				backup(links, player) {
					return {
						filterCard: true,
						check(card) {
							return 6 - get.value(card);
						},
						viewAs: {
							name: links[0][2],
							nature: links[0][3],
							storage: {
								oldshiqiang: true,
							},
						},
						position: "hes",
						popname: true,
					};
				},
				prompt(links, player) {
					return `将一张牌当作${get.translation(links[0][3] || "")}【${get.translation(links[0][2])}】使用`;
				},
			},
			locked: false,
			group: ["oldshiqiang_effect"],
			mod: {
				targetInRange(card, player, target) {
					if (card?.storage?.oldshiqiang) {
						return true;
					}
				},
			},
			subSkill: {
				effect: {
					forced: true,
					locked: false,
					trigger: { player: ["useCard", "useCardAfter"] },
					filter(event, player, name) {
						if (!event.card?.storage?.oldshiqiang) {
							return false;
						}
						if (name === "useCardAfter") {
							return !player.hasHistory("sourceDamage", evt => evt.card === event.card);
						}
						return true;
					},
					async content(event, trigger, player) {
						if (event.triggername === "useCard") {
							await player.draw();
						} else {
							await player.loseMaxHp();
						}
					},
				},
			},
			ai: {
				order: 4,
				result: {
					player: 1,
				},
			},
		},
		//强易·削弱
		qiangyi: {
			charlotte: true,
			enable: "phaseUse",
			filter(event, player) {
				return player === game.zhu && game.hasPlayer(current => lib.skill.qiangyi.filterTarget(null, player, current));
			},
			filterTarget(card, player, target) {
				return player !== target && !player.getStorage("qiangyi_used").includes(target) && target.countGainableCards(player, "h") > 0;
			},
			async content(event, trigger, player) {
				const { target } = event;
				player.markAuto(`${event.name}_used`, target);
				const result = await player.gainPlayerCard(target, "h", true).forResult();
				if (!result?.bool || !result.cards?.length) {
					return event.finish();
				}
				const hs = player.getCards("h");
				if (!hs.length || !target?.isIn()) {
					return;
				}
				let resultx;
				if (hs.length === 1) {
					resultx = { bool: true, cards: hs };
				} else {
					resultx = await player.chooseCard("h", true, `选择交给${get.translation(target)}一张手牌`).forResult();
				}
				if (resultx?.bool && resultx.cards?.length) {
					await player.give(resultx.cards, target);
				}
			},
			ai: {
				order: 5,
				result: {
					player: 1,
					target: -1,
				},
			},
		},
		diqi_skill: {
			trigger: { player: "damageBegin2" },
			filter(event, player) {
				const card = player.getEquip("diqi");
				return get.itemtype(card) === "card" && lib.filter.cardDiscardable(card, player, "diqi_skill");
			},
			check(event, player) {
				return event.num >= Math.min(player.hp, 2);
			},
			prompt2(event, player) {
				return `弃置${get.translation(player.getEquip("diqi"))}并防止即将受到的${get.cnNumber(event.num)}点伤害`;
			},
			async content(event, trigger, player) {
				await player.discard({ cards: [player.getEquip("diqi")] });
				trigger.cancel();
			},
			ai: {
				filterDamage: true,
				skillTagFilter(player, tag, arg) {
					if (arg?.player?.hasSkillTag("jueqing", false, player)) {
						return false;
					}
				},
			},
		},
		online_aozhan: {
			trigger: { player: "phaseBefore" },
			forced: true,
			popup: false,
			firstDo: true,
			filter(event, player) {
				return !_status._aozhan && game.roundNumber > 10;
			},
			async content(event, trigger, player) {
				let color = get.groupnature(player.group, "raw");
				if (player.isUnseen()) {
					color = "fire";
				}
				player.$fullscreenpop("鏖战模式", color);
				game.broadcastAll(() => {
					_status._aozhan = true;
					ui.aozhan = ui.create.div(".touchinfo.left", ui.window);
					ui.aozhan.innerHTML = "鏖战模式";
					if (ui.time3) {
						ui.time3.style.display = "none";
					}
					ui.aozhanInfo = ui.create.system("鏖战模式", null, true);
					lib.setPopped(
						ui.aozhanInfo,
						() => {
							const uiintro = ui.create.dialog("hidden");
							uiintro.add("鏖战模式");
							const list = ["从第11轮开始，游戏将进入〔鏖战模式〕。", "在鏖战模式下，任何角色均不是非转化的【桃】的合法目标。【桃】可以被当做【杀】或【闪】使用或打出。"];
							const intro = `<ul style="text-align:left;margin-top:0;width:450px">${list.map(item => `<li>${item}`).join("")}</ul>`;
							uiintro.add(`<div class="text center">${intro}</div>`);
							const ul = uiintro.querySelector("ul");
							if (ul) {
								ul.style.width = "180px";
							}
							uiintro.add(ui.create.div(".placeholder"));
							return uiintro;
						},
						250
					);
					game.playBackgroundMusic();
				});
				game.removeGlobalSkill("online_aozhan");
				for (const current of game.filterPlayer()) {
					current.addSkill("aozhan");
				}
			},
		},
		online_juzhong: {
			trigger: { global: "useCard" },
			direct: true,
			ruleSkill: true,
			filter(event, player) {
				return (
					_status.mode === "online" &&
					!event.all_excluded &&
					event.player.isFriendOf(player) &&
					event.player !== player &&
					lib.skill.online_juzhong.infos[event.card.name] &&
					player.hasCard(card => {
						if (_status.connectMode) {
							return true;
						}
						return get.name(card, player) === event.card.name;
					}, "h")
				);
			},
			async content(event, trigger, player) {
				const result = await player
					.chooseToDiscard({
						prompt: "是否响应【聚众】？",
						prompt2: `${get.translation(trigger.player)}使用了${get.translation(trigger.card)}。你可弃置一张名称相同的牌，令${lib.skill.online_juzhong.infos[trigger.card.name][0]}`,
						filterCard: (card, player) => get.name(card, player) === _status.event.getTrigger().card.name,
						ai: lib.skill.online_juzhong.infos[trigger.card.name][2],
					})
					.set("logSkill", ["_juzhong", trigger.player])
					.forResult();
				if (!result.bool) {
					return;
				}
				lib.skill.online_juzhong.infos[trigger.card.name][1]();
				if (!event.goon) {
					return;
				}
				const targetResult = await trigger.player
					.chooseTarget({
						prompt: "你可选择一名角色，弃置其的一张牌",
						filterTarget: (_card, player, target) => target.countDiscardableCards(player, "he") > 0,
						ai: target => {
							const player = _status.event.player;
							return get.effect(target, { name: "guohe_copy2" }, player, player);
						},
					})
					.forResult();
				if (!targetResult.bool) {
					return;
				}
				const target = targetResult.targets[0];
				trigger.player.line(target, "green");
				await trigger.player.discardPlayerCard({ target, forced: true, position: "he" });
			},
			infos: {
				sha: [
					"此【杀】的伤害值基数+1。",
					() => {
						const evt = _status.event._trigger;
						if (!evt.baseDamage) {
							evt.baseDamage = 1;
						}
						evt.baseDamage++;
					},
					card => {
						const evt = _status.event.getTrigger();
						if (!evt.targets.length) {
							return 0;
						}
						if (
							evt.targets[0].hasShan() ||
							evt.targets[0].hasSkillTag("filterDamage", null, {
								player: evt.targets[0],
								card: evt.card,
							})
						) {
							return 0;
						}
						return 1;
					},
				],
				shan: [
					"其可弃置一名角色的一张牌。",
					() => {
						_status.event.goon = true;
					},
					card => {
						if (game.zhu.countCards("he", card => get.value(card, game.zhu) >= 6)) {
							return 7 - get.value(card);
						}
						if (game.zhu.countCards("he", card => get.value(card, game.zhu) > 0)) {
							return 5 - get.value(card);
						}
						return 0;
					},
				],
				tao: [
					"其摸两张牌。",
					() => {
						_status.event._trigger.player.draw(2);
					},
					card => 6 - get.value(card),
				],
				jiu: [
					"其本回合的伤害值或回复值+1。",
					() => {
						const player = _status.event._trigger.player;
						player.addTempSkill("juzhong_jiu");
						player.addMark("juzhong_jiu", 1, false);
					},
					card => 6 - get.value(card),
				],
			},
			ai: {
				viewHandcard: true,
				skillTagFilter(player, tag, target) {
					if (_status.mode !== "online" || player === target || player.identity !== target.identity) {
						return false;
					}
				},
			},
		},
		juzhong_jiu: {
			trigger: {
				player: "recoverBegin",
				source: "damageBegin1",
			},
			forced: true,
			popup: false,
			async content(event, trigger, player) {
				trigger.num += player.countMark("juzhong_jiu");
			},
			onremove: true,
			intro: { content: "本回合的伤害值和回复值+#" },
		},
		online_zhadan_button: {
			trigger: {
				global: "gameDrawAfter",
				player: ["gainEnd", "loseEnd"],
			},
			firstDo: true,
			forced: true,
			charlotte: true,
			popup: false,
			silent: true,
			filter(event, player) {
				if (_status.mode !== "online" || (player !== game.me && !player.isOnline())) {
					return false;
				}
				if (event.name !== "lose") {
					return !player.hasZhadan && player.countCards("hs", "zhadan") > 0;
				}
				return player.hasZhadan && !player.countCards("hs", "zhadan");
			},
			async content(event, trigger, player) {
				if (!player.hasZhadan) {
					player.hasZhadan = true;
					if (player === game.me) {
						lib.skill.online_zhadan_button.initZhadan();
					} else {
						player.send(() => {
							lib.skill.online_zhadan_button.initZhadan();
						});
					}
					return;
				}
				delete player.hasZhadan;
				if (player === game.me) {
					lib.skill.online_zhadan_button.removeZhadan();
				} else {
					player.send(() => {
						lib.skill.online_zhadan_button.removeZhadan();
					});
				}
			},
			initZhadan() {
				ui.zhadan_button = ui.create.control("激活炸弹", "stayleft", () => {
					const button = ui.zhadan_button;
					if (button.classList.contains("hidden")) {
						return;
					}
					button.classList.toggle("glow");
					if (button.classList.contains("glow") && _status.event.type === "zhadan" && _status.event.isMine() && ui.confirm && _status.imchoosing) {
						ui.click.cancel(ui.confirm.lastChild);
					}
				});
			},
			removeZhadan() {
				if (ui.zhadan_button) {
					ui.zhadan_button.remove();
					delete ui.zhadan_button;
				}
			},
		},
		online_zhadan: {
			trigger: { player: "useCard" },
			priority: 5,
			popup: false,
			forced: true,
			filter(event, player) {
				return game.hasPlayer(current => current.hasCard(card => get.name(card) === "zhadan" && lib.filter.cardEnabled(card, player, "forceEnable"), "hs"));
			},
			forceLoad: true,
			async content(event, trigger, player) {
				event.source = trigger.player;
				event.card = trigger.card;
				event.targets = trigger.targets;
				event._global_waiting = true;
				event.filterCard = (card, player) => get.name(card) === "zhadan" && get.itemtype(card) === "card" && lib.filter.cardEnabled(card, player, "forceEnable");
				event.send = (player, card, source, targets, id, id2, skillState) => {
					if (skillState) {
						player.applySkills(skillState);
					}
					if (player === game.me && ui.zhadan_button && !ui.zhadan_button.classList.contains("glow")) {
						const result = { bool: false };
						_status.event._result = result;
						if (game.online) {
							_status.event._resultid = id;
							game.resume();
						}
						return result;
					}
					const targetPrompt = targets?.length ? `对${get.translation(targets)}` : "";
					const prompt = `${get.translation(source)}${targetPrompt}使用了${get.translation(card)}，是否对其使用【炸弹】？`;

					const next = player.chooseToUse({
						filterCard(card, player) {
							return get.name(card) === "zhadan" && get.itemtype(card) === "card" && lib.filter.cardEnabled(card, player, "forceEnable");
						},
						prompt,
						_global_waiting: true,
						ai1(card) {
							const evt = _status.event.getParent("_zhadan")._trigger;
							const player = _status.event.player;
							if (!evt) {
								return 0;
							}
							if (get.attitude(player, evt.player) > 0) {
								return 0;
							}
							if (!targets.length) {
								return Math.random() - 0.5;
							}
							let eff = 0;
							for (const target of targets) {
								eff -= get.effect(target, evt.card, evt.player, player);
							}
							return eff - 8;
						},
						source,
						source2: targets,
						id,
						id2,
						type: "zhadan",
					});
					next.set("respondTo", [source, card]);

					if (game.online) {
						_status.event._resultid = id;
						game.resume();
					} else {
						next.nouse = true;
					}
					return next;
				};
				event.list = game.filterPlayer(current => current.hasCard(card => get.name(card) === "zhadan" && lib.filter.cardEnabled(card, player, "forceEnable"), "hs"));
				event.id = get.id();
				event.list.sort((a, b) => get.distance(event.source, a, "absolute") - get.distance(event.source, b, "absolute"));

				while (event.list.length && !(_status.connectMode && (event.list[0].isOnline() || event.list[0] === game.me))) {
					const current = event.list.shift();
					const response = event.send(current, event.card, event.source, event.targets, event.id, trigger.parent.id);
					const result = response?.forResult ? await response.forResult() : response;
					if (!result?.bool) {
						continue;
					}
					event.zhadanresult = current;
					event.zhadanresult2 = result;
					if (current !== game.me && !current.isOnline()) {
						await game.delayx();
					}
					break;
				}

				if (!event.zhadanresult && event.list.length) {
					const id = event.id;
					const choose = current => {
						return new Promise((resolve, reject) => {
							const settle = (result, current) => {
								if (result?.bool && (current === game.me || result.id === id)) {
									resolve([current, result]);
								} else {
									reject();
								}
							};
							if (current.isOnline()) {
								current.wait(settle);
								current.send(event.send, current, event.card, event.source, event.targets, id, trigger.parent.id, get.skillState(current));
								return;
							}

							const response = event.send(current, event.card, event.source, event.targets, id, trigger.parent.id);
							game.me.wait(settle);
							if (response?.forResult) {
								response
									.forResult()
									.then(result => game.me.unwait(result))
									.catch(reject);
							} else {
								game.me.unwait(response);
							}
						});
					};

					const players = event.list.filter(current => current.isOnline() || current === game.me);
					event.list.removeArray(players);
					for (const current of game.players) {
						current.showTimer();
					}
					const winner = await Promise.any(players.map(choose)).catch(() => null);
					if (winner) {
						[event.zhadanresult, event.zhadanresult2] = winner;
						game.broadcastAll("cancel", id);
					}
					for (const current of game.players) {
						current.hideTimer();
					}
				}
				if (!event.zhadanresult) {
					return;
				}
				event.zhadanresult.$fullscreenpop("炸弹", get.groupnature(event.zhadanresult));
				const next = event.zhadanresult.useResult(event.zhadanresult2);
				next.respondTo = [trigger.player, trigger.card];
				game.bonusNum *= 2;
				game.updateRoundNumber();
				await next;
			},
		},
	},
	card: {
		baiyidujiang: {
			fullskin: true,
			enable: true,
			filterTarget(card, player, target) {
				return target === game.zhu;
			},
			selectTarget: -1,
			type: "trick",
			async content(event, trigger, player) {
				const { target } = event;
				if (!player.isIn() || !target.isIn()) {
					return;
				}
				let num1 = 0;
				let num2 = Infinity;
				const str = get.translation(target);
				for (const current of game.filterPlayer()) {
					const num = current.countCards("h");
					if (num > num1) {
						num1 = num;
					}
					if (num < num2) {
						num2 = num;
					}
				}
				const num = target.countCards("h");
				const choices = [];
				let addIndex = 0;
				if (num < num1) {
					choices.push(`令${str}将手牌摸至${get.cnNumber(num1)}张`);
				} else {
					addIndex++;
				}
				if (num > num2) {
					choices.push(`令${str}将手牌弃置至${get.cnNumber(num2)}张`);
				}
				if (!choices.length) {
					return;
				}
				let index = 0;
				if (choices.length > 1) {
					const result = await player
						.chooseControl({
							choiceList: choices,
							ai: () => {
								const evt = _status.event.getParent();
								return get.attitude(evt.player, evt.target) > 0 ? 0 : 1;
							},
						})
						.forResult();
					index = result.index;
				}
				if (index + addIndex === 0) {
					await target.drawTo(num1);
				} else {
					await target.chooseToDiscard({
						forced: true,
						position: "h",
						selectCard: target.countCards("h") - num2,
						allowChooseAll: true,
					});
				}
			},
			ai: {
				order: 6,
				value: 4,
				useful: 2,
				tag: {
					draw: 1,
					loseCard: 1,
				},
				result: {
					target(player, target, card, isLink) {
						let num1 = 0;
						let num2 = Infinity;
						const filterCard = cardx => !ui.selected.cards.includes(cardx) && (!card.cards || !card.cards.includes(cardx));
						for (const current of game.filterPlayer()) {
							const num = current.countCards("h", filterCard);
							if (num > num1) {
								num1 = num;
							}
							if (num < num2) {
								num2 = num;
							}
						}
						const num = target.countCards("h", filterCard);
						if (num1 > num && get.attitude(player, target) > 0) {
							return (num1 - num) / 1.2;
						}
						if (num2 < num && get.attitude(player, target) > 0) {
							return (num2 - num) / 1.2;
						}
						return 0;
					},
				},
			},
		},
		luojingxiashi: {
			fullskin: true,
			enable: true,
			type: "trick",
			selectTarget: -1,
			filterTarget(card, player, target) {
				return target !== player && target.isDamaged();
			},
			async content(event, trigger, player) {
				await event.target.damage();
			},
			ai: {
				order: 3,
				value: 4,
				useful: 2,
				tag: {
					loseCard: 1,
				},
				result: {
					target: -1.5,
				},
			},
		},
		binglinchengxia: {
			fullskin: true,
			type: "delay",
			filterTarget(card, player, target) {
				return lib.filter.judge(card, player, target) && player !== target;
			},
			judge(card) {
				if (get.suit(card) === "diamond") {
					return 0;
				}
				return -3;
			},
			async effect(event, trigger, player, result) {
				if (result.bool !== false) {
					return;
				}
				const cards = player.getCards("e", card => lib.filter.cardDiscardable(card, player, "shuiyanqijuny"));
				if (!cards.length) {
					await player.damage({ nosource: true });
					return;
				}
				const controlResult = await player
					.chooseControl({
						controls: ["discard_card", "take_damage"],
						ai: (event, player) => {
							if (get.damageEffect(player, event.player, player) >= 0) {
								return "take_damage";
							}
							if (player.hp >= 3 && player.countCards("e") >= 2) {
								return "take_damage";
							}
							return "discard_card";
						},
					})
					.forResult();
				if (controlResult.control === "discard_card") {
					await player.discard({ cards });
				} else {
					await player.damage({ nosource: true });
				}
			},
			ai: {
				order: 1,
				value: 3,
				useful: 2,
				tag: {
					damage: 1,
					loseCard: 1,
				},
				result: {
					target(player, target, card, isLink) {
						const es = target.getCards("e");
						if (!es.length) {
							return -1.5;
						}
						let val = 0;
						for (const card of es) {
							val += get.value(card, target);
						}
						return -Math.min(1.5, val / 5);
					},
				},
			},
		},
		toushiche: {
			fullskin: true,
			type: "equip",
			subtype: "equip1",
			distance: { attackFrom: -3 },
			ai: {
				basic: {
					equipValue: 2.5,
				},
			},
			skills: ["toushiche_skill"],
		},
		gongshoujianbei: {
			fullskin: true,
			type: "trick",
		},
		jintuiziru: {
			fullskin: true,
			type: "trick",
		},
		diqi: {
			fullskin: true,
			type: "equip",
			subtype: "equip2",
			cardcolor: "club",
			skills: ["diqi_skill"],
			destroy: "diqi_skill",
			ai: {
				basic: {
					equipValue: 6,
				},
			},
		},
		zhadan: {
			audio: true,
			fullskin: true,
			type: "trick",
			ai: {
				basic: {
					useful: [6, 4],
					value: [6, 4],
				},
				result: { player: 1 },
			},
			notarget: true,
			async content(event, trigger, player) {
				const evt = event.getParent(2)._trigger;
				evt.targets.length = 0;
				evt.all_excluded = true;
				game.log(evt.card, "的效果被炸弹抵消了");
			},
		},
		jiwangkailai: {
			audio: true,
			fullskin: true,
			type: "trick",
			enable(card, player) {
				const hs = player.getCards("h", cardx => cardx !== card && (!card.cards || !card.cards.includes(cardx)));
				if (!hs.length) {
					return false;
				}
				let use = true;
				let discard = true;
				for (const handCard of hs) {
					if (use && !game.checkMod(handCard, player, "unchanged", "cardEnabled2", player)) {
						use = false;
					}
					if (discard && !lib.filter.cardDiscardable(handCard, player, "jiwangkailai")) {
						discard = false;
					}
					if (!use && !discard) {
						return false;
					}
				}
				return true;
			},
			selectTarget: -1,
			toself: true,
			filterTarget(card, player, target) {
				return target === player;
			},
			modTarget: true,
			async content(event, trigger, player) {
				const hs = player.getCards("h");
				if (!hs.length) {
					return;
				}
				let use = true;
				let discard = true;
				for (const handCard of hs) {
					if (use && !game.checkMod(handCard, player, "unchanged", "cardEnabled2", player)) {
						use = false;
					}
					if (discard && !lib.filter.cardDiscardable(handCard, player, "jiwangkailai")) {
						discard = false;
					}
					if (!use && !discard) {
						return;
					}
				}
				let index = use ? 1 : 0;
				if (use && discard) {
					const result = await player
						.chooseControl({
							prompt: "继往开来：请选择一项",
							choiceList: ["弃置所有手牌，然后摸等量的牌", "将所有手牌当做一张普通锦囊牌使用"],
							ai: () => (_status.event.player.countCards("h") > 2 ? 0 : 1),
						})
						.forResult();
					index = result.index;
				}
				const cards = player.getCards("h");
				if (index === 0) {
					const num = cards.length;
					await player.discard({ cards });
					await player.draw(num);
					return;
				}
				const list = [];
				for (const name of lib.inpile) {
					if (name !== "jiwangkailai" && get.type(name) === "trick" && lib.filter.filterCard({ name, cards }, player)) {
						list.push(["锦囊", "", name]);
					}
				}
				if (!list.length) {
					return;
				}
				const result = await player
					.chooseButton({
						createDialog: ["继往开来：选择要使用的牌", [list, "vcard"]],
						forced: true,
						ai: button => {
							const player = _status.event.player;
							return player.getUseValue({
								name: button.link[2],
								cards: player.getCards("h"),
							});
						},
					})
					.forResult();
				if (!result.bool) {
					return;
				}
				await player.chooseUseTarget({
					card: { name: result.links[0][2] },
					cards: player.getCards("h"),
					forced: true,
				});
			},
			ai: {
				basic: {
					order: 0.5,
					useful: 3,
					value: 5,
				},
				result: {
					target(player, target) {
						if (target.needsToDiscard(1) || !target.countCards("h", card => get.value(card, player) >= 5.5)) {
							return 1;
						}
						return 0;
					},
				},
				tag: {
					draw: 2,
				},
			},
		},
	},
	characterOnline: {
		wei: ["re_caocao", "re_guojia", "re_simayi", "re_xiahoudun", "xuzhu", "re_zhangliao", "re_zhenji", "ol_xiahouyuan", "dianwei", "re_xunyu", "zhanghe", "yujin_yujin", "re_caozhang", "wangyi", "guohuai", "hanhaoshihuan", "chenqun", "re_caoxiu", "guohuanghou", "sunziliufang", "xunyou", "xinxianying", "sp_caiwenji", "caoang", "caochun", "caohong", "sp_caoren", "chenlin", "sp_jiaxu", "litong", "sp_pangde", "simalang", "wanglang", "kuailiangkuaiyue", "wangji", "sp_simazhao", "sp_wangyuanji", "yuejin", "zangba", "xinpi", "liuye", "simashi", "zhuling", "duji", "caoanmin"],
		shu: ["re_guanyu", "re_huangyueying", "re_liubei", "re_machao", "re_zhangfei", "zhaoyun", "re_huangzhong", "re_weiyan", "re_pangtong", "ol_sp_zhugeliang", "re_menghuo", "re_zhurong", "re_fazheng", "re_masu", "xin_liaohua", "old_madai", "re_jianyong", "wuyi", "zhangsong", "zhoucang", "liuchen", "xiahoushi", "re_zhangyi", "liyan", "guanyinping", "guansuo", "mayunlu", "mazhong", "mizhu", "sunqian", "xiahouba", "zhangxingcai", "wangping", "yanyan", "chendao", "ganfuren", "re_maliang", "dengzhi", "lifeng", "zhangyì"],
		wu: ["re_ganning", "re_huanggai", "re_sunquan", "re_sunshangxiang", "re_zhouyu", "old_zhoutai", "re_xiaoqiao", "re_taishici", "sunjian", "re_zhangzhang", "re_lingtong", "re_wuguotai", "xin_xusheng", "re_bulianshi", "re_chengpu", "handang", "xin_panzhangmazhong", "xin_zhuran", "guyong", "zhuhuan", "cenhun", "sundeng", "xuezong", "daxiaoqiao", "heqi", "kanze", "sunhao", "re_sunluyu", "sunshao", "zhugejin", "zumao", "dingfeng", "sunliang", "zhoufei", "weiwenzhugezhi", "xf_sufei", "xugong", "lingcao", "sunru", "lvdai", "panjun", "yanjun", "zhoufang"],
		qun: ["re_diaochan", "re_gongsunzan", "re_huatuo", "re_huaxiong", "re_lvbu", "ol_pangde", "re_yanwen", "jiaxu", "gaoshun", "xin_liubiao", "chengong", "re_gongsunyuan", "guotufengji", "dongbai", "fuwan", "liuxie", "sp_machao", "tadun", "yanbaihu", "yuanshu", "zhangbao", "yl_luzhi", "huangfusong", "sp_ganning", "huangjinleishi", "re_panfeng", "guosi", "sp_liuqi", "mangyachang", "gaolan", "lvkuanglvxiang", "xunchen", "sp_zhanghe", "re_hansui", "re_hejin", "zhujun", "ol_dingyuan", "hanfu", "wangrong", "dongcheng", "gongsunkang", "hucheer", "sp_sufei", "yj_xuhuang", "yj_zhanghe", "yj_zhangliao", "liuyao", "wangcan", "sp_taishici", "caimao", "jiling"],
		key: ["sp_key_yuri", "key_akane", "key_akiko", "key_ao", "key_harukakanata", "key_haruko", "key_hinata", "key_kengo", "key_komari", "key_kotori", "key_kyoko", "key_nagisa", "key_noda", "key_rei", "key_rin", "key_rumi", "key_ryoichi", "key_sasami", "key_shiorimiyuki", "key_shiroha", "key_shizuku", "key_tomoya", "key_tsumugi", "key_umi", "key_yoshino", "key_youta", "key_yukine", "key_nao", "key_misuzu"],
	},
	online_cardPile: [
		["spade", 1, "guding"],
		["spade", 1, "zhadan"],
		["spade", 2, "tengjia"],
		["spade", 2, "cixiong"],
		["spade", 3, "jiu"],
		["spade", 3, "guohe"],
		["spade", 4, "sha", "thunder"],
		["spade", 4, "guohe"],
		["spade", 5, "sha", "thunder"],
		["spade", 5, "qinglong"],
		["spade", 6, "sha", "thunder"],
		["spade", 6, "jiwangkailai"],
		["spade", 7, "sha", "thunder"],
		["spade", 7, "jintuiziru"],
		["spade", 8, "sha", "thunder"],
		["spade", 8, "sha"],
		["spade", 9, "jiu"],
		["spade", 9, "sha"],
		["spade", 10, "gongshoujianbei"],
		["spade", 10, "sha"],
		["spade", 11, "tiesuo"],
		["spade", 11, "shunshou"],
		["spade", 12, "tiesuo"],
		["spade", 12, "zhangba"],
		["spade", 13, "wuxie"],
		["spade", 13, "dawanma"],

		["club", 1, "baiyin"],
		["club", 1, "zhuge"],
		["club", 2, "tengjia"],
		["club", 2, "bagua"],
		["club", 3, "jiu"],
		["club", 3, "sha"],
		["club", 4, "jintuiziru"],
		["club", 4, "sha"],
		["club", 5, "sha", "thunder"],
		["club", 5, "dilu"],
		["club", 6, "sha", "thunder"],
		["club", 6, "sha"],
		["club", 7, "sha", "thunder"],
		["club", 7, "sha"],
		["club", 8, "sha", "thunder"],
		["club", 8, "sha"],
		["club", 9, "jiu"],
		["club", 9, "sha"],
		["club", 10, "tiesuo"],
		["club", 10, "sha"],
		["club", 11, "tiesuo"],
		["club", 11, "sha"],
		["club", 12, "tiesuo"],
		["club", 12, "wuxie"],
		["club", 13, "tiesuo"],
		["club", 13, "jiedao"],
		["club", 13, "wuxie"],

		["heart", 1, "wuxie"],
		["heart", 1, "gongshoujianbei"],
		["heart", 1, "zhadan"],
		["heart", 2, "huogong"],
		["heart", 2, "shan"],
		["heart", 3, "huogong"],
		["heart", 3, "wuzhong"],
		["heart", 4, "sha", "fire"],
		["heart", 4, "tao"],
		["heart", 5, "tao"],
		["heart", 5, "chitu"],
		["heart", 6, "tao"],
		["heart", 6, "jiwangkailai"],
		["heart", 7, "sha", "fire"],
		["heart", 7, "tao"],
		["heart", 8, "shan"],
		["heart", 8, "wuzhong"],
		["heart", 9, "shan"],
		["heart", 9, "tao"],
		["heart", 10, "sha", "fire"],
		["heart", 10, "sha"],
		["heart", 11, "shan"],
		["heart", 11, "wuzhong"],
		["heart", 12, "shan"],
		["heart", 12, "guohe"],
		["heart", 13, "wuxie"],
		["heart", 13, "zhuahuang"],

		["diamond", 1, "zhuque"],
		["diamond", 1, "juedou"],
		["diamond", 2, "tao"],
		["diamond", 2, "shan"],
		["diamond", 3, "tao"],
		["diamond", 3, "shan"],
		["diamond", 4, "sha", "fire"],
		["diamond", 4, "shunshou"],
		["diamond", 5, "sha", "fire"],
		["diamond", 5, "guanshi"],
		["diamond", 6, "shan"],
		["diamond", 6, "sha"],
		["diamond", 7, "shan"],
		["diamond", 7, "shan"],
		["diamond", 8, "shan"],
		["diamond", 8, "shan"],
		["diamond", 9, "jiu"],
		["diamond", 9, "shan"],
		["diamond", 10, "shan"],
		["diamond", 10, "sha"],
		["diamond", 11, "shan"],
		["diamond", 11, "shan"],
		["diamond", 12, "huogong"],
		["diamond", 12, "tao"],
		["diamond", 13, "xiliu"],
		["diamond", 13, "sha"],
		["diamond", 13, "wuxie"],
	],
	help: {
		斗地主: html`
			<div style="margin: 10px">游戏规则</div>

			<ul style="margin-top: 0">
				<li>
					游戏人数<br />
					游戏人数为3人（地主x1 + 农民x2）。
				</li>

				<li>
					胜利条件<br />
					农民：地主死亡。<br />
					地主：所有农民死亡且自己存活。
				</li>

				<li>
					死亡奖惩<br />
					当有农民死亡时，若另一名农民存活，则其可以选择摸两张牌或回复1点体力。
				</li>

				<li>
					地主专属技能<br />
					地主可以使用专属技能〖飞扬〗和〖跋扈〗。<br />
					〖飞扬〗判定阶段开始时，若你的判定区有牌，则你可以弃置两张手牌，然后弃置你判定区的一张牌。每回合限一次。<br />
					〖跋扈〗锁定技，准备阶段开始时，你摸一张牌。出牌阶段，你可以多使用一张【杀】。
				</li>
			</ul>
		`,
	},
};
