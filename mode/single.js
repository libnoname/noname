import { lib, game, ui, get, ai, _status } from "../noname.js";
export const type = "mode";
/**
 * @type { () => importModeConfig }
 */
export default () => {
	return {
		name: "single",
		changbanCharacter: [
			"key_rei",
			"key_yoshino",
			"key_noda",
			"key_nagisa",
			"re_caocao",
			"re_caozhang",
			"re_diaochan",
			"re_ganning",
			"re_gongsunzan",
			"re_guojia",
			"re_huangyueying",
			"re_lidian",
			"re_lvbu",
			"re_simayi",
			"sunquan",
			"re_xiahoudun",
			"re_xushu",
			"yuanshu",
			"xf_yiji",
			"re_zhangfei",
			"re_zhangliao",
			"re_xuzhu",
			"re_zhaoyun",
			"re_zhouyu",
			"re_zhugeliang",
			"ol_xiahouyuan",
			"re_huangzhong",
			"re_weiyan",
			"dianwei",
			"te_yanwen",
			"re_pangde",
			"re_zhurong",
			"re_sunjian",
			"jiaxu",
			"dengai",
			"re_jiangwei",
			"re_sunben",
			"wangji",
			"wangping",
			"guanqiujian",
			"chendao",
			"ol_yujin",
			"re_caozhi",
			"xin_masu",
			"re_lingtong",
			"xusheng",
			"re_gaoshun",
			"xunyou",
			"guanzhang",
			"madai",
			"handang",
			"caochong",
			"re_guohuai",
			"guanping",
			"liufeng",
			"re_zhuran",
			"xin_liru",
			"hanhaoshihuan",
			"guyong",
			"zhuhuan",
			"caoxiu",
			"liuchen",
			"re_zhangyi",
			"re_quancong",
			"sunxiu",
			"sundeng",
			"guohuanghou",
			"re_jikang",
			"xuezong",
			"qinmi",
			"lvdai",
			"re_zhangliang",
			"lingcao",
			"sunru",
			"zhuling",
			"sp_caoren",
			"fanchou",
			"fuwan",
			"sp_ganning",
			"guanyinping",
			"guosi",
			"heqi",
			"sp_jiangwei",
			"litong",
			"re_panfeng",
			"sp_pangde",
			"xf_sufei",
			"xf_tangzi",
			"xiahouba",
			"xujing",
			"yuejin",
			"sp_zhangfei",
			"zhangji",
			"zhangyì",
			"dongcheng",
		],
		singlePile: [
			["spade", 5, "sha"],
			["spade", 7, "sha"],
			["spade", 8, "sha"],
			["spade", 10, "sha"],
			["heart", 10, "sha"],
			["heart", 11, "sha"],
			["club", 4, "sha"],
			["club", 5, "sha"],
			["club", 6, "sha"],
			["club", 8, "sha"],
			["club", 9, "sha"],
			["club", 10, "sha"],
			["club", 11, "sha"],
			["diamond", 6, "sha"],
			["diamond", 9, "sha"],
			["diamond", 11, "sha"],
			["heart", 2, "shan"],
			["heart", 5, "shan"],
			["diamond", 2, "shan"],
			["diamond", 3, "shan"],
			["diamond", 7, "shan"],
			["diamond", 8, "shan"],
			["diamond", 10, "shan"],
			["diamond", 11, "shan"],
			["heart", 3, "tao"],
			["heart", 4, "tao"],
			["heart", 9, "tao"],
			["diamond", 12, "tao"],
			["club", 12, "bingliang"],
			["spade", 3, "guohe"],
			["diamond", 12, "guohe"],
			["club", 3, "guohe"],
			["club", 1, "juedou"],
			["spade", 1, "juedou"],
			["heart", 6, "lebu"],
			["spade", 1, "nanman"],
			["club", 7, "shuiyanqijunx"],
			["spade", 4, "shunshou"],
			["spade", 11, "shunshou"],
			["diamond", 4, "shunshou"],
			["heart", 1, "wanjian"],
			["heart", 5, "wuxie"],
			["club", 5, "wuxie"],
			["heart", 7, "wuzhong"],
			["heart", 8, "wuzhong"],
			["diamond", 5, "guanshi"],
			["spade", 9, "hanbing"],
			["spade", 6, "qinggang"],
			["spade", 12, "zhangba"],
			["diamond", 1, "zhuge"],
			["spade", 2, "bagua"],
			["club", 2, "renwang"],
		],
		singlePile_wuxianhuoli: [
			["heart", 1, "wanjian"],
			["heart", 2, "shan"],
			["heart", 2, "huogong"],
			["heart", 3, "tao"],
			["heart", 3, "huogong"],
			["heart", 4, "tao"],
			["heart", 4, "sha", "fire"],
			["heart", 6, "tao"],
			["heart", 7, "sha", "fire"],
			["heart", 7, "wuzhong"],
			["heart", 8, "wuzhong"],
			["heart", 9, "wuzhong"],
			["heart", 10, "sha"],
			["heart", 10, "sha"],
			["heart", 10, "sha", "fire"],
			["heart", 12, "guohe"],
			["heart", 12, "shandian"],
			["heart", 13, "shan"],

			["diamond", 1, "juedou"],
			["diamond", 1, "zhuge"],
			["diamond", 1, "zhuque"],
			["diamond", 3, "shunshou"],
			["diamond", 4, "shunshou"],
			["diamond", 5, "guanshi"],
			["diamond", 6, "sha"],
			["diamond", 6, "shan"],
			["diamond", 7, "sha"],
			["diamond", 7, "shan"],
			["diamond", 8, "sha"],
			["diamond", 8, "shan"],
			["diamond", 9, "sha"],
			["diamond", 9, "shan"],
			["diamond", 9, "jiu"],
			["diamond", 10, "shan"],
			["diamond", 11, "shan"],
			["diamond", 12, "tao"],
			["diamond", 12, "wuxie"],
			["diamond", 12, "huogong"],

			["club", 1, "juedou"],
			["club", 1, "baiyin"],
			["club", 2, "sha"],
			["club", 2, "bagua"],
			["club", 2, "renwang"],
			["club", 3, "sha"],
			["club", 3, "guohe"],
			["club", 4, "sha"],
			["club", 5, "sha"],
			["club", 5, "sha", "thunder"],
			["club", 6, "sha"],
			["club", 6, "sha", "thunder"],
			["club", 7, "sha"],
			["club", 7, "sha", "thunder"],
			["club", 7, "nanman"],
			["club", 8, "sha"],
			["club", 9, "sha"],
			["club", 9, "jiu"],
			["club", 12, "wuxie"],
			["club", 13, "wuxie"],

			["spade", 1, "juedou"],
			["spade", 1, "guding"],
			["spade", 2, "cixiong"],
			["spade", 2, "hanbing"],
			["spade", 2, "tengjia"],
			["spade", 3, "shunshou"],
			["spade", 4, "sha", "thunder"],
			["spade", 4, "guohe"],
			["spade", 4, "shunshou"],
			["spade", 5, "sha", "thunder"],
			["spade", 5, "qinglong"],
			["spade", 6, "sha", "thunder"],
			["spade", 6, "qinggang"],
			["spade", 7, "sha"],
			["spade", 7, "sha", "thunder"],
			["spade", 8, "sha"],
			["spade", 8, "sha"],
			["spade", 8, "sha", "thunder"],
			["spade", 9, "sha"],
			["spade", 9, "jiu"],
			["spade", 10, "sha"],
			["spade", 10, "bingliang"],
			["spade", 11, "wuxie"],
			["spade", 12, "guohe"],
			["spade", 12, "zhangba"],
			["spade", 13, "nanman"],
		],
		characterSingle: Object.assign(
			new Proxy(
				{},
				{
					set(target, prop, newValue) {
						return Reflect.set(target, prop, get.convertedCharacter(newValue));
					},
				}
			),
			{
				caocao: {
					sex: "male",
					group: "wei",
					hp: 4,
					skills: ["jianxiong"],
					isZhugong: true,
				},
				simayi: {
					sex: "male",
					group: "wei",
					hp: 3,
					skills: ["fankui", "guicai"],
					names: "司马|懿",
				},
				xiahoudun: {
					sex: "male",
					group: "wei",
					hp: 4,
					skills: ["ganglie"],
					names: "夏侯|惇",
				},
				zhangliao: {
					sex: "male",
					group: "wei",
					hp: 4,
					skills: ["retuxi"],
				},
				xuzhu: {
					sex: "male",
					group: "wei",
					hp: 4,
					skills: ["luoyi", "xiechan"],
				},
				guojia: {
					sex: "male",
					group: "wei",
					hp: 3,
					skills: ["tiandu", "yiji"],
				},
				zhenji: {
					sex: "female",
					group: "wei",
					hp: 3,
					skills: ["luoshen", "sgqingguo"],
				},
				liubei: {
					sex: "male",
					group: "shu",
					hp: 4,
					skills: ["sgrenwang"],
					isZhugong: true,
				},
				guanyu: {
					sex: "male",
					group: "shu",
					hp: 4,
					skills: ["wusheng", "huwei"],
				},
				zhangfei: {
					sex: "male",
					group: "shu",
					hp: 4,
					skills: ["paoxiao"],
				},
				zhugeliang: {
					sex: "male",
					group: "shu",
					hp: 3,
					skills: ["guanxing", "kongcheng"],
					names: "诸葛|亮",
				},
				zhaoyun: {
					sex: "male",
					group: "shu",
					hp: 4,
					skills: ["longdan"],
				},
				machao: {
					sex: "male",
					group: "shu",
					hp: 4,
					skills: ["xiaoxi", "tieji"],
				},
				huangyueying: {
					sex: "female",
					group: "shu",
					hp: 3,
					skills: ["jizhi", "cangji"],
				},
				sunquan: {
					sex: "male",
					group: "wu",
					hp: 4,
					skills: ["sgzhiheng"],
					isZhugong: true,
				},
				ganning: {
					sex: "male",
					group: "wu",
					hp: 4,
					skills: ["qixi"],
				},
				lvmeng: {
					sex: "male",
					group: "wu",
					hp: 4,
					skills: ["shenju", "botu"],
				},
				huanggai: {
					sex: "male",
					group: "wu",
					hp: 4,
					skills: ["kurou"],
				},
				zhouyu: {
					sex: "male",
					group: "wu",
					hp: 3,
					skills: ["yingzi", "fanjian"],
				},
				daqiao: {
					sex: "female",
					group: "wu",
					hp: 3,
					skills: ["guose", "wanrong"],
				},
				luxun: {
					sex: "male",
					group: "wu",
					hp: 3,
					skills: ["qianxun", "lianying"],
				},
				sunshangxiang: {
					sex: "female",
					group: "wu",
					hp: 3,
					skills: ["xiaoji", "yinli"],
				},
				huatuo: {
					sex: "male",
					group: "qun",
					hp: 3,
					skills: ["jijiu", "puji"],
				},
				lvbu: {
					sex: "male",
					group: "qun",
					hp: 4,
					skills: ["wushuang"],
				},
				diaochan: {
					sex: "female",
					group: "qun",
					hp: 3,
					skills: ["pianyi", "biyue"],
					names: "null|null",
				},

				xiahouyuan: {
					sex: "male",
					group: "wei",
					hp: 4,
					skills: ["shensu", "suzi"],
					names: "夏侯|渊",
				},
				old_caoren: {
					sex: "male",
					group: "wei",
					hp: 4,
					skills: ["jushou"],
				},
				huangzhong: {
					sex: "male",
					group: "shu",
					hp: 4,
					skills: ["sgliegong"],
				},
				weiyan: {
					sex: "male",
					group: "shu",
					hp: 4,
					skills: ["sgkuanggu"],
				},
				xiaoqiao: {
					sex: "female",
					group: "wu",
					hp: 3,
					skills: ["tianxiang", "hongyan"],
				},
				old_zhoutai: {
					sex: "male",
					group: "wu",
					hp: 4,
					skills: ["gzbuqu"],
				},
				zhangjiao: {
					sex: "male",
					group: "qun",
					hp: 3,
					skills: ["leiji", "guidao"],
					isZhugong: true,
				},

				dianwei: {
					sex: "male",
					group: "wei",
					hp: 4,
					skills: ["qiangxi"],
				},
				yanwen: {
					sex: "male",
					group: "qun",
					hp: 4,
					skills: ["shuangxiong"],
				},
				pangde: {
					sex: "male",
					group: "qun",
					hp: 4,
					skills: ["xiaoxi", "mengjin"],
				},

				menghuo: {
					sex: "male",
					group: "shu",
					hp: 4,
					skills: ["manyi", "zaiqi"],
				},
				zhurong: {
					sex: "female",
					group: "shu",
					hp: 4,
					skills: ["manyi", "lieren"],
					names: "null|null",
				},
				xuhuang: {
					sex: "male",
					group: "wei",
					hp: 4,
					skills: ["sgduanliang"],
				},
				sunjian: {
					sex: "male",
					group: "wu",
					hp: 4,
					skills: ["gzyinghun"],
				},

				jiangwei: {
					sex: "male",
					group: "shu",
					hp: 4,
					skills: ["tiaoxin"],
				},

				hejin: {
					sex: "male",
					group: "qun",
					hp: 4,
					skills: ["mouzhu", "yanhuo"],
				},
				hansui: {
					sex: "male",
					group: "qun",
					hp: 4,
					skills: ["xiaoxi", "niluan"],
				},
				niujin: {
					sex: "male",
					group: "wei",
					hp: 4,
					skills: ["cuorui", "liewei"],
				},

				jin_zhangchunhua: {
					sex: "female",
					group: "jin",
					hp: 3,
					skills: ["huishi", "qingleng"],
				},
				jin_simayi: {
					sex: "male",
					group: "jin",
					hp: 3,
					skills: ["smyyingshi", "xiongzhi", "quanbian"],
					names: "司马|师",
				},
				jin_wangyuanji: {
					sex: "female",
					group: "jin",
					hp: 3,
					skills: ["yanxi"],
				},
				jin_simazhao: {
					sex: "male",
					group: "jin",
					hp: 3,
					skills: ["choufa", "zhaoran"],
					names: "司马|昭",
				},
				jin_xiahouhui: {
					sex: "female",
					group: "jin",
					hp: 3,
					skills: ["jyishi", "shiduo"],
					names: "夏侯|徽",
				},
				jin_simashi: {
					sex: "male",
					group: "jin",
					hp: 3,
					maxHp: 4,
					skills: ["yimie", "tairan"],
					names: "司马|师",
				},
				zhanghuyuechen: {
					sex: "male",
					group: "jin",
					hp: 4,
					skills: ["xijue"],
					names: "张|虎-乐|綝",
				},
				duyu: {
					sex: "male",
					group: "jin",
					hp: 4,
					skills: ["sanchen", "zhaotao"],
				},
			}
		),
		startBefore() {},
		onreinit() {
			_status.mode = _status.connectMode ? lib.configOL.single_mode : get.config("single_mode");
			if (_status.mode != "normal") {
				return;
			}
			for (var i in lib.characterSingle) {
				lib.character[i] = lib.characterSingle[i];
			}
			for (var j in lib.singleTranslate) {
				lib.translate[j] = lib.singleTranslate[j];
			}
		},
		start() {
			"step 0";
			_status.mode = _status.connectMode ? lib.configOL.single_mode : get.config("single_mode");
			var playback = localStorage.getItem(lib.configprefix + "playback");
			if (playback) {
				ui.create.me();
				ui.arena.style.display = "none";
				ui.system.style.display = "none";
				_status.playback = playback;
				localStorage.removeItem(lib.configprefix + "playback");
				var store = lib.db.transaction(["video"], "readwrite").objectStore("video");
				store.get(parseInt(playback)).onsuccess = function (e) {
					if (e.target.result) {
						game.playVideoContent(e.target.result.video);
					} else {
						alert("播放失败：找不到录像");
						game.reload();
					}
				};
				event.finish();
			} else if (!_status.connectMode) {
				game.prepareArena(2);
			}
			"step 1";
			if (_status.connectMode) {
				game.waitForPlayer(function () {
					lib.configOL.number = 2;
				});
			}
			"step 2";
			if (_status.mode == "normal") {
				lib.card.list = lib.singlePile.slice(0);
				game.fixedPile = true;
				game.broadcastAll(
					function (singleTranslate, characterSingle, jin) {
						_status.mode = "normal";
						for (var j in singleTranslate) {
							lib.translate[j] = singleTranslate[j];
						}
						_status.characterlist = [];
						for (var i in characterSingle) {
							if (!jin && characterSingle[i].group === "jin") {
								continue;
							}
							lib.character[i] = characterSingle[i];
							_status.characterlist.push(i);
						}
					},
					lib.singleTranslate,
					lib.characterSingle,
					_status.connectMode ? lib.configOL.enable_jin : get.config("enable_jin")
				);
			} else if (_status.mode == "changban") {
				_status.characterlist = [];
				for (var i = 0; i < lib.changbanCharacter.length; i++) {
					var name = lib.changbanCharacter[i];
					if (lib.character[name] && !lib.filter.characterDisabled(name)) {
						_status.characterlist.push(name);
					}
				}
				game.broadcastAll(function () {
					_status.mode = "changban";
					lib.translate.bingliang_info = "目标角色判定阶段进行判定：若判定结果不为梅花，则跳过该角色的摸牌阶段。";
					lib.translate.zhuge_info = "锁定技，出牌阶段，你使用杀的次数上限+3";
				});
				for (var i = 0; i < lib.card.list.length; i++) {
					var card = lib.card.list[i];
					if (card[2] == "muniu" || card[2] == "shandian" || (card[2] == "tengjia" && card[0] == "club") || (card[2] == "wuxie" && card[0] == "diamond" && card[1] == 12)) {
						lib.card.list.splice(i--, 1);
					}
				}
			} else if (_status.mode == "wuxianhuoli") {
				var list = [];
				lib.card.list = lib.singlePile_wuxianhuoli.slice(0);
				game.fixedPile = true;
				if (_status.connectMode) {
					list = get.charactersOL();
				} else {
					var list = [];
					for (var i in lib.character) {
						if (!lib.filter.characterDisabled2(i) && !lib.filter.characterDisabled(i)) {
							list.push(i);
						}
					}
				}
				game.countPlayer2(function (current) {
					list.remove(current.name);
					list.remove(current.name1);
					list.remove(current.name2);
				});
				_status.characterlist = list;
				game.broadcast(list => (_status.characterlist = list), list);
			}
			if (_status.connectMode) {
				lib.configOL.number = 2;
				game.randomMapOL();
			} else {
				for (var i = 0; i < game.players.length; i++) {
					game.players[i].getId();
				}
				if (_status.brawl && _status.brawl.chooseCharacterBefore) {
					_status.brawl.chooseCharacterBefore();
				}
				game.chooseCharacter();
			}
			"step 3";
			if (ui.coin) {
				_status.coinCoeff = get.coinCoeff([game.me.name]);
			}

			game.syncState();
			event.trigger("gameStart");

			var players = get.players(lib.sort.position);
			var info = [];
			for (var i = 0; i < players.length; i++) {
				info.push({
					name: players[i].name1,
					name2: players[i].name2,
					identity: players[i].identity,
					nickname: players[i].node.nameol.innerHTML,
				});
			}
			_status.videoInited = true;
			game.addVideo("init", null, info);

			game.gameDraw(game.zhu, function (player) {
				if (_status.mode == "dianjiang") {
					return 4;
				}
				if (_status.mode == "wuxianhuoli") {
					return 4;
				}
				if (_status.mode == "normal") {
					if (player.hasSkill("cuorui")) {
						player.logSkill("cuorui");
						return 2 + _status.characterChoice[player.identity].length;
					}
					return player == game.zhu ? 3 : 4;
				}
				if (_status.mode == "changban") {
					return player == game.fan ? 5 : 4;
				}
				return player.maxHp;
			});
			if (_status.connectMode && lib.configOL.change_card) {
				game.replaceHandcards(game.players.slice(0));
			}
			"step 4";
			game.phaseLoop(game.zhu);
			game.countPlayer(current => current.showGiveup(), true);
		},
		game: {
			canReplaceViewpoint: () => true,
			addRecord: function (bool) {
				if (typeof bool == "boolean") {
					var mode = _status.mode;
					var data = lib.config.gameRecord.single.data;
					if (!get.is.object(data[mode])) {
						data[mode] = {};
					}
					var data2 = data[mode];
					var identity = game.me.identity;
					if (!data2[identity]) {
						data2[identity] = [0, 0];
					}
					if (bool) {
						data2[identity][0]++;
					} else {
						data2[identity][1]++;
					}
					var list = ["zhu", "fan"];
					var str = "";
					for (var j in data) {
						str += get.translation(j + 2) + "：<br>";
						for (var i = 0; i < list.length; i++) {
							if (data[j][list[i]]) {
								str += lib.translate[list[i] + "2"] + "：" + data[j][list[i]][0] + "胜" + " " + data[j][list[i]][1] + "负<br>";
							}
						}
					}
					lib.config.gameRecord.single.str = str;
					game.saveConfig("gameRecord", lib.config.gameRecord);
				}
			},
			getState: function () {
				var state = {};
				for (var i in lib.playerOL) {
					var player = lib.playerOL[i];
					state[i] = { identity: player.identity };
				}
				return state;
			},
			updateState: function (state) {
				for (var i in state) {
					var player = lib.playerOL[i];
					if (player) {
						player.identity = state[i].identity;
					}
				}
			},
			getRoomInfo: function (uiintro) {
				if (lib.configOL.single_mode == "normal") {
					uiintro.add('<div class="text chat">晋势力武将：' + (lib.configOL.enable_jin ? "开启" : "关闭"));
				}
				if (lib.configOL.bannedcards.length) {
					uiintro.add('<div class="text chat">禁用卡牌：' + get.translation(lib.configOL.bannedcards));
				}
				uiintro.style.paddingBottom = "8px";
			},
			getVideoName: function () {
				var str = get.translation(game.me.name);
				if (game.me.name2) {
					str += "/" + get.translation(game.me.name2);
				}
				var name = [str, get.translation(_status.mode + 2) + " - " + lib.translate[game.me.identity + "2"]];
				return name;
			},
			showIdentity: function () {},
			checkResult: function () {
				game.over((game.me._trueMe || game.me).isAlive());
			},
			checkOnlineResult: function (player) {
				return player.isAlive();
			},
			chooseCharacterDianjiang: function () {
				var next = game.createEvent("chooseCharacter");
				next.showConfig = true;
				next.setContent(function () {
					"step 0";
					ui.arena.classList.add("choose-character");
					lib.init.onfree();
					"step 1";
					game.me.chooseControl("先手", "后手").prompt = "请选择自己的行动顺序";
					"step 2";
					var map = result.control == "先手" ? ["zhu", "fan"] : ["fan", "zhu"];
					game.me.identity = map[0];
					game.me.next.identity = map[1];
					game.me.showIdentity();
					game.me.next.showIdentity();
					"step 3";
					event.flipassign = true;
					event.videoId = lib.status.videoId++;
					var list = [];
					for (var i in lib.character) {
						if (lib.filter.characterDisabled2(i, "ignoreForibidden")) {
							continue;
						}
						list.push(i);
					}
					_status.characterlist = list;
					var filter = function (name) {
						return !_status.characterlist.includes(name);
					};
					var dialog = ui.create.characterDialog("heightset", filter).open();
					dialog.videoId = event.videoId;

					game.me
						.chooseButton(true)
						.set("ai", function (button) {
							return Math.random();
						})
						.set(
							"selectButton",
							(function (choice) {
								if (choice == "singble") {
									return [1, 2];
								}
								if (choice == "double") {
									return 2;
								}
								return 1;
							})(get.config("double_character"))
						)
						.set("dialog", event.videoId);
					"step 4";
					game.addRecentCharacter(result.links[0]);
					_status.characterlist.removeArray(result.links);
					if (result.links.length == 2) {
						game.me.init(result.links[0], result.links[1]);
						game.addRecentCharacter(result.links[1]);
					} else {
						game.me.init(result.links[0]);
					}
					game.me
						.chooseButton(true)
						.set("ai", function (button) {
							return Math.random();
						})
						.set(
							"selectButton",
							(function (choice) {
								if (choice == "singble") {
									return [1, 2];
								}
								if (choice == "double") {
									return 2;
								}
								return 1;
							})(get.config("double_character"))
						)
						.set("dialog", event.videoId);
					"step 5";
					game.broadcastAll("closeDialog", event.videoId);
					game.addRecentCharacter(result.links[0]);
					_status.characterlist.removeArray(result.links);
					if (result.links.length == 2) {
						game.me.next.init(result.links[0], result.links[1]);
						game.addRecentCharacter(result.links[1]);
					} else {
						game.me.next.init(result.links[0]);
					}
					setTimeout(function () {
						ui.arena.classList.remove("choose-character");
					}, 500);
					if (get.config("single_control")) {
						game.addGlobalSkill("autoswap");
						game.me.next._trueMe = game.me;
					}
				});
			},
			chooseCharacterWuxianhuoli() {
				const next = game.createEvent("chooseCharacter");
				next.showConfig = true;
				next.setContent(function () {
					"step 0";
					ui.arena.classList.add("choose-character");
					lib.init.onfree();
					var num = [0, 1].randomGet();
					game.players[num].identity = "zhu";
					game.players[1 - num].identity = "fan";
					game.broadcastAll(
						function (p, t) {
							p.enemy = t;
							t.enemy = p;
						},
						game.players[0],
						game.players[1]
					);
					for (var i = 0; i < game.players.length; i++) {
						game.players[i].showIdentity();
					}
					game.globalBuff = ["wuxianhuoli_weisuoyuwei"];
					const randomBuff = ["liuanhuaming", "duoduoyishan", "xushidaifa", "mianmianjudao"].randomGet();
					game.globalBuff.add(`wuxianhuoli_${randomBuff}`);
					"step 1";
					_status.characterChoice = {
						zhu: _status.characterlist.randomRemove(6),
						fan: _status.characterlist.randomRemove(6),
					};
					// 创建自由选将功能
					const createCharacterDialog = function () {
						if (get.config("free_choose")) {
							event.dialogxx = ui.create.characterDialog("heightset");
						} else {
							event.dialogxx = ui.create.characterDialog("heightset");
						}
					};
					if (lib.onfree) {
						lib.onfree.push(createCharacterDialog);
					} else {
						createCharacterDialog();
					}
					ui.create.cheat2 = function () {
						ui.cheat2 = ui.create.control("自由选将", function () {
							if (this.dialog == _status.event.dialog) {
								if (game.changeCoin) {
									game.changeCoin(10);
								}
								this.dialog.close();
								_status.event.dialog = this.backup;
								this.backup.open();
								delete this.backup;
								game.uncheck();
								game.check();
							} else {
								if (game.changeCoin) {
									game.changeCoin(-10);
								}
								this.backup = _status.event.dialog;
								_status.event.dialog.close();
								_status.event.dialog = _status.event.parent.dialogxx;
								this.dialog = _status.event.dialog;
								this.dialog.open();
								game.uncheck();
								game.check();
							}
						});
						if (lib.onfree) {
							ui.cheat2.classList.add("disabled");
						}
					};
					if (!ui.cheat2 && get.config("free_choose")) {
						ui.create.cheat2();
					}
					const dialog = ["请选择出场武将", '<div class="text center">本局游戏Buff</div>'];
					game.globalBuff.forEach((buff, ind) => {
						dialog.add(`<div class="text">「${ind === 0 ? "固定" : "随机"}」 ${get.translation(buff)}：${get.skillInfoTranslation(buff, null, false)}</div>`);
					});
					dialog.add([_status.characterChoice[game.me.identity], "character"]);
					game.me.chooseButton(true, dialog);
					"step 2";
					if (ui.cheat2) {
						ui.cheat2.close();
						delete ui.cheat2;
					}
					game.me.init(result.links[0]);
					game.addRecentCharacter(result.links[0]);
					_status.characterChoice[game.me.identity].removeArray(result.links);
					var list = _status.characterChoice[game.me.enemy.identity].randomRemove(1);
					game.me.enemy.init(list[0]);
					[game.me, game.me.enemy].forEach(current => {
						if (current.storage.nohp || (lib.character[current.name1].hasHiddenSkill && !current.noclick)) {
							current.storage.rawHp = 1;
							current.storage.rawMaxHp = 1;
						}
						current.hp = 10;
						current.maxHp = 10;
						current.hujia = 0;
						current.update();
					});
					game.globalBuff.forEach(buff => {
						game.addGlobalSkill(buff);
					});
					game.addGlobalSkill("wuxianhuoli_task");
					_status.wuxianhuoliProgress = 0;
					_status.wuxianhuoliLevel = 0;
					const func = () => {
						ui.wuxianhuoliProgress = get.is.phoneLayout() ? ui.create.div(".touchinfo.left", ui.window) : ui.create.div(ui.gameinfo);
						ui.wuxianhuoliProgress.innerHTML = "任务进度(0/3)";
						const showTasks = () => {
							if (ui.wuxianhuoliInfo) {
								return;
							}
							ui.wuxianhuoliInfo = ui.create.system("无限火力", null, true);
							ui.wuxianhuoliInfo.currentProgress = 0;
							ui.wuxianhuoliInfo.currentLevel = 0;
							lib.setPopped(
								ui.wuxianhuoliInfo,
								() => {
									var uiintro = ui.create.dialog("hidden");
									uiintro.add(`<div class="text center" style="font-size:18px"><b>任务列表</b></div>`);
									if (typeof _status.wuxianhuoliLevel !== "number") {
										uiintro.add(`<div class="text center" style="font-size:12px">未获取当前进度，请于一名角色受伤后再查看</div>`);
									} else if (_status.wuxianhuoliLevel < 2) {
										uiintro.add(`<div class="text center">全场角色造成${_status.wuxianhuoliLevel === 0 ? 3 : 5}点伤害(当前${_status.wuxianhuoliProgress}点)</div>\
										<div class="text center">奖励：获得一个技能，摸两张牌</div>`);
									} else {
										uiintro.add(`<div class="text center">所有任务已完成，无后续任务</div>`);
									}
									uiintro.add(`<div class="text center" style="font-size:18px"><b>全局Buff</b></div>`);
									uiintro.add(
										`<div class="text">${game.globalBuff
											.map((buff, ind) => {
												return get.translation(buff) + "：" + get.skillInfoTranslation(buff, null, false);
											})
											.join("<br>")}</div>`
									);
									var ul = uiintro.querySelector("ul");
									if (ul) {
										ul.style.width = "180px";
									}
									uiintro.add(ui.create.div(".placeholder"));
									return uiintro;
								},
								250
							);
						};
						showTasks();
						var dialog = ui.create.dialog("hidden", "forcebutton");
						dialog.add(`任务一`);
						dialog.addText(`任务：全场角色共计造成3点伤害<br>奖励：获得一个技能，摸两张牌`);
						dialog.add(`任务二<div class="text center" style="font-size:10px">(完成任务一后解锁)</div>\
							<div class="text center">任务：全场角色共计造成5点伤害<br>奖励：获得一个技能，摸两张牌</div>`);
						dialog.open();
						setTimeout(() => {
							dialog.close();
						}, 3000);
					};
					game.broadcastAll(func);
					game.delay(0, 3000);
					"step 3";
					_status.characterlist.addArray(Object.values(_status.characterChoice).flat());
					setTimeout(function () {
						ui.arena.classList.remove("choose-character");
					}, 500);
				});
			},
			chooseCharacter: function () {
				if (_status.mode == "dianjiang") {
					game.chooseCharacterDianjiang();
					return;
				}
				if (_status.mode == "wuxianhuoli") {
					game.chooseCharacterWuxianhuoli();
					return;
				}
				var next = game.createEvent("chooseCharacter");
				next.showConfig = true;
				next.setContent(function () {
					"step 0";
					ui.arena.classList.add("choose-character");
					var num = [0, 1].randomGet();
					game.players[num].identity = "zhu";
					game.players[1 - num].identity = "fan";
					game.broadcastAll(
						function (p, t) {
							p.enemy = t;
							t.enemy = p;
						},
						game.players[0],
						game.players[1]
					);
					for (var i = 0; i < game.players.length; i++) {
						game.players[i].showIdentity();
					}
					"step 1";
					_status.characterChoice = {
						zhu: _status.characterlist.randomRemove(3),
						fan: _status.characterlist.randomRemove(3),
						all: _status.characterlist.randomRemove(6),
					};
					event.videoIdx = lib.status.videoId++;
					game.broadcastAll(
						function (id, list) {
							var dialog = ui.create.dialog("选择武将", [list.all, "character"], "起始武将", [list[game.me.identity], "character"]);
							dialog.videoId = id;
						},
						event.videoIdx,
						_status.characterChoice
					);
					"step 2";
					var next = game.fan.chooseButton(true, 1);
					next.filterButton = function (button) {
						return _status.event.canChoose.includes(button.link);
					};
					next.set("onfree", true);
					next.dialog = event.videoIdx;
					next.canChoose = _status.characterChoice.all;
					next.ai = function () {
						return Math.random();
					};
					"step 3";
					_status.characterChoice.fan.addArray(result.links);
					_status.characterChoice.all.removeArray(result.links);
					game.broadcastAll(
						function (link, choosing, first, id) {
							var dialog = get.idDialog(id);
							if (dialog) {
								if (choosing == game.me) {
									choosing = "你";
								} else {
									choosing = "对手";
								}
								dialog.content.firstChild.innerHTML = choosing + "选择了" + get.translation(link);
								for (var i = 0; i < dialog.buttons.length; i++) {
									if (link.includes(dialog.buttons[i].link)) {
										if (first) {
											dialog.buttons[i].classList.add("selectedx");
										} else {
											dialog.buttons[i].classList.add("glow");
										}
									}
								}
							}
						},
						result.links,
						game.fan,
						true,
						event.videoIdx
					);
					var next = game.zhu.chooseButton(true, 2);
					next.filterButton = function (button) {
						return _status.event.canChoose.includes(button.link);
					};
					next.dialog = event.videoIdx;
					next.canChoose = _status.characterChoice.all;
					next.ai = function () {
						return Math.random();
					};
					"step 4";
					_status.characterChoice.zhu.addArray(result.links);
					_status.characterChoice.all.removeArray(result.links);
					game.broadcastAll(
						function (link, choosing, first, id) {
							var dialog = get.idDialog(id);
							if (dialog) {
								if (choosing == game.me) {
									choosing = "你";
								} else {
									choosing = "对手";
								}
								dialog.content.firstChild.innerHTML = choosing + "选择了" + get.translation(link);
								for (var i = 0; i < dialog.buttons.length; i++) {
									if (link.includes(dialog.buttons[i].link)) {
										if (first) {
											dialog.buttons[i].classList.add("selectedx");
										} else {
											dialog.buttons[i].classList.add("glow");
										}
									}
								}
							}
						},
						result.links,
						game.zhu,
						false,
						event.videoIdx
					);
					var next = game.fan.chooseButton(true, 2);
					next.filterButton = function (button) {
						return _status.event.canChoose.includes(button.link);
					};
					next.dialog = event.videoIdx;
					next.canChoose = _status.characterChoice.all;
					next.ai = function () {
						return Math.random();
					};
					"step 5";
					_status.characterChoice.fan.addArray(result.links);
					_status.characterChoice.all.removeArray(result.links);
					game.broadcastAll(
						function (link, choosing, first, id) {
							var dialog = get.idDialog(id);
							if (dialog) {
								if (choosing == game.me) {
									choosing = "你";
								} else {
									choosing = "对手";
								}
								dialog.content.firstChild.innerHTML = choosing + "选择了" + get.translation(link);
								for (var i = 0; i < dialog.buttons.length; i++) {
									if (link.includes(dialog.buttons[i].link)) {
										if (first) {
											dialog.buttons[i].classList.add("selectedx");
										} else {
											dialog.buttons[i].classList.add("glow");
										}
									}
								}
							}
						},
						result.links,
						game.fan,
						true,
						event.videoIdx
					);
					var next = game.zhu.chooseButton(true);
					next.filterButton = function (button) {
						return _status.event.canChoose.includes(button.link);
					};
					next.dialog = event.videoIdx;
					next.canChoose = _status.characterChoice.all;
					next.ai = function () {
						return Math.random();
					};
					"step 6";
					_status.characterChoice.zhu.addArray(result.links);
					_status.characterChoice.all.removeArray(result.links);
					game.broadcastAll(
						function (link, choosing, first, id) {
							var dialog = get.idDialog(id);
							if (dialog) {
								if (choosing == game.me) {
									choosing = "你";
								} else {
									choosing = "对手";
								}
								dialog.content.firstChild.innerHTML = choosing + "选择了" + get.translation(link);
								for (var i = 0; i < dialog.buttons.length; i++) {
									if (link.includes(dialog.buttons[i].link)) {
										if (first) {
											dialog.buttons[i].classList.add("selectedx");
										} else {
											dialog.buttons[i].classList.add("glow");
										}
									}
								}
							}
						},
						result.links,
						game.zhu,
						false,
						event.videoIdx
					);
					"step 7";
					game.broadcastAll("closeDialog", event.videoIdx);
					"step 8";
					game.me.chooseButton(true, ["请选择出场武将", [_status.characterChoice[game.me.identity], "character"]], _status.mode == "changban" ? 2 : 1);
					"step 9";
					game.me.init(result.links[0], _status.mode == "changban" ? result.links[1] : null);
					_status.characterChoice[game.me.identity].removeArray(result.links);
					var list = _status.characterChoice[game.me.enemy.identity].randomRemove(_status.mode == "changban" ? 2 : 1);
					game.me.enemy.init(list[0], list[1]);
					"step 10";
					setTimeout(function () {
						ui.arena.classList.remove("choose-character");
					}, 500);
				});
			},
			chooseCharacterDianjiangOL: function () {
				var next = game.createEvent("chooseCharacter");
				next.showConfig = true;
				next.setContent(function () {
					"step 0";
					var map = Math.random() < 0.5 ? ["zhu", "fan"] : ["fan", "zhu"];
					game.me.identity = map[0];
					game.me.next.identity = map[1];
					game.me.showIdentity();
					game.me.next.showIdentity();
					"step 1";
					//event.flipassign=true;
					event.videoId = lib.status.videoId++;
					var list = [];
					var libCharacter = {};
					for (var i = 0; i < lib.configOL.characterPack.length; i++) {
						var pack = lib.characterPack[lib.configOL.characterPack[i]];
						for (var j in pack) {
							if (lib.character[j]) {
								libCharacter[j] = pack[j];
							}
						}
					}
					for (i in libCharacter) {
						if (lib.filter.characterDisabled(i, libCharacter)) {
							continue;
						}
						list.push(i);
					}
					game.broadcastAll(
						function (list, id) {
							_status.characterlist = list;
							var filter = function (name) {
								return !_status.characterlist.includes(name);
							};
							var dialog = ui.create.characterDialog("heightset", filter).open();
							dialog.videoId = id;
							ui.arena.classList.add("choose-character");
						},
						list,
						event.videoId
					);
					game.zhu
						.chooseButton(true)
						.set("ai", function (button) {
							return Math.random();
						})
						.set(
							"selectButton",
							(function (choice) {
								if (choice == "singble") {
									return [1, 2];
								}
								if (choice == "double") {
									return 2;
								}
								return 1;
							})(lib.configOL.double_character)
						)
						.set("dialog", event.videoId);
					"step 2";
					game.broadcastAll(
						function (player, character, id) {
							if (player == game.me) {
								game.addRecentCharacter(character[0]);
							}
							if (character.length !== 2) {
								player.init(character[0]);
							} else {
								player.init(character[0], character[1]);
								if (player == game.me) {
									game.addRecentCharacter(character[1]);
								}
							}
							_status.characterlist.removeArray(character);
						},
						game.zhu,
						result.links
					);
					game.fan
						.chooseButton(true)
						.set("ai", function (button) {
							return Math.random();
						})
						.set(
							"selectButton",
							(function (choice) {
								if (choice == "singble") {
									return [1, 2];
								}
								if (choice == "double") {
									return 2;
								}
								return 1;
							})(lib.configOL.double_character)
						)
						.set("dialog", event.videoId);
					"step 3";
					game.broadcastAll("closeDialog", event.videoId);
					game.broadcastAll(
						function (player, character, id) {
							var dialog = get.idDialog(id);
							if (dialog) {
								dialog.close();
							}
							if (player == game.me) {
								game.addRecentCharacter(character[0]);
							}
							if (character.length !== 2) {
								player.init(character[0]);
							} else {
								player.init(character[0], character[1]);
								if (player == game.me) {
									game.addRecentCharacter(character[1]);
								}
							}
							_status.characterlist.removeArray(character);
							setTimeout(function () {
								ui.arena.classList.remove("choose-character");
							}, 500);
						},
						game.fan,
						result.links,
						event.videoId
					);
				});
			},
			chooseCharacterWuxianhuoliOL() {
				var next = game.createEvent("chooseCharacter");
				next.showConfig = true;
				next.setContent(function () {
					"step 0";
					ui.arena.classList.add("choose-character");
					var num = [0, 1].randomGet();
					game.players[num].identity = "zhu";
					game.players[1 - num].identity = "fan";
					game.broadcastAll(
						function (p, t) {
							p.enemy = t;
							t.enemy = p;
						},
						game.players[0],
						game.players[1]
					);
					for (var i = 0; i < game.players.length; i++) {
						game.players[i].showIdentity();
					}
					game.globalBuff = ["wuxianhuoli_weisuoyuwei"];
					const randomBuff = ["liuanhuaming", "duoduoyishan", "xushidaifa", "mianmianjudao"].randomGet();
					game.globalBuff.add(`wuxianhuoli_${randomBuff}`);
					const setBuff = buff => {
						game.globalBuff = buff;
					};
					game.broadcast(setBuff, game.globalBuff);
					if (!_status.postReconnect.wuxianhuoliBuff) {
						_status.postReconnect.wuxianhuoliBuff = [setBuff, []];
					}
					_status.postReconnect.wuxianhuoliBuff[1].addArray(game.globalBuff);
					"step 1";
					_status.characterChoice = {
						zhu: _status.characterlist.randomRemove(6),
						fan: _status.characterlist.randomRemove(6),
					};
					// 创建自由选将功能
					const createCharacterDialog = function () {
						if (get.config("free_choose")) {
							event.dialogxx = ui.create.characterDialog("heightset");
						} else {
							event.dialogxx = ui.create.characterDialog("heightset");
						}
					};
					if (lib.onfree) {
						lib.onfree.push(createCharacterDialog);
					} else {
						createCharacterDialog();
					}
					ui.create.cheat2 = function () {
						ui.cheat2 = ui.create.control("自由选将", function () {
							if (this.dialog == _status.event.dialog) {
								if (game.changeCoin) {
									game.changeCoin(10);
								}
								this.dialog.close();
								_status.event.dialog = this.backup;
								this.backup.open();
								delete this.backup;
								game.uncheck();
								game.check();
							} else {
								if (game.changeCoin) {
									game.changeCoin(-10);
								}
								this.backup = _status.event.dialog;
								_status.event.dialog.close();
								_status.event.dialog = _status.event.parent.dialogxx;
								this.dialog = _status.event.dialog;
								this.dialog.open();
								game.uncheck();
								game.check();
							}
						});
						if (lib.onfree) {
							ui.cheat2.classList.add("disabled");
						}
					};
					if (!ui.cheat2 && get.config("free_choose")) {
						ui.create.cheat2();
					}
					const list = ["zhu", "fan"].map(identity => {
						const dialog = ["请选择出场武将", '<div class="text center">本局游戏Buff</div>'];
						game.globalBuff.forEach((buff, ind) => {
							dialog.add(`<div class="text">「${ind === 0 ? "固定" : "随机"}」 ${get.translation(buff)}：${get.skillInfoTranslation(buff, null, false)}</div>`);
						});
						dialog.add([_status.characterChoice[identity], "character"]);
						return [game[identity], true, dialog];
					});
					game.me.chooseButtonOL(list, function (player, result) {
						if (game.online || player == game.me) {
							player.init(result.links[0]);
							if (player == game.me) {
								game.addRecentCharacter(result.links[0]);
							}
							player.hp = 10;
							player.maxHp = 10;
							player.hujia = 0;
							player.update();
						}
					});
					"step 2";
					if (ui.cheat2) {
						ui.cheat2.close();
						delete ui.cheat2;
					}
					for (var i in result) {
						var current = lib.playerOL[i];
						if (result[i] == "ai") {
							result[i] = _status.characterChoice[current.identity].randomGets(1);
						} else {
							result[i] = result[i].links;
						}
						_status.characterChoice[current.identity].removeArray(result[i]);
						if (!current.name) {
							current.init(result[i][0]);
							if (current.storage.nohp || (lib.character[current.name1].hasHiddenSkill && !current.noclick)) {
								current.storage.rawHp = 1;
								current.storage.rawMaxHp = 1;
							}
							current.hp = 10;
							current.maxHp = 10;
							current.hujia = 0;
							current.update();
						}
					}
					game.broadcast(function (result) {
						for (var i in result) {
							const current = lib.playerOL[i];
							if (!current.name) {
								current.init(result[i][0]);
								if (current.storage.nohp || (lib.character[current.name1].hasHiddenSkill && !current.noclick)) {
									current.storage.rawHp = 1;
									current.storage.rawMaxHp = 1;
								}
								current.hp = 10;
								current.maxHp = 10;
								current.hujia = 0;
								current.update();
							}
						}
						setTimeout(function () {
							ui.arena.classList.remove("choose-character");
						}, 500);
					}, result);
					game.globalBuff.forEach(buff => {
						game.addGlobalSkill(buff);
					});
					game.addGlobalSkill("wuxianhuoli_task");
					game.broadcastAll(() => {
						_status.wuxianhuoliProgress = 0;
						_status.wuxianhuoliLevel = 0;
					});
					const func = () => {
						ui.wuxianhuoliProgress = get.is.phoneLayout() ? ui.create.div(".touchinfo.left", ui.window) : ui.create.div(ui.gameinfo);
						ui.wuxianhuoliProgress.innerHTML = "任务进度(0/3)";
						const showTasks = () => {
							if (ui.wuxianhuoliInfo) {
								return;
							}
							ui.wuxianhuoliInfo = ui.create.system("无限火力", null, true);
							ui.wuxianhuoliInfo.currentProgress = 0;
							ui.wuxianhuoliInfo.currentLevel = 0;
							lib.setPopped(
								ui.wuxianhuoliInfo,
								() => {
									var uiintro = ui.create.dialog("hidden");
									uiintro.add(`<div class="text center" style="font-size:18px"><b>任务列表</b></div>`);
									if (typeof _status.wuxianhuoliLevel !== "number") {
										uiintro.add(`<div class="text center" style="font-size:12px">未获取当前进度，请于一名角色受伤后再查看</div>`);
									} else if (_status.wuxianhuoliLevel < 2) {
										uiintro.add(`<div class="text center">全场角色造成${_status.wuxianhuoliLevel === 0 ? 3 : 5}点伤害(当前${_status.wuxianhuoliProgress}点)</div>\
										<div class="text center">奖励：获得一个技能，摸两张牌</div>`);
									} else {
										uiintro.add(`<div class="text center">所有任务已完成，无后续任务</div>`);
									}
									uiintro.add(`<div class="text center" style="font-size:18px"><b>全局Buff</b></div>`);
									uiintro.add(
										`<div class="text">${game.globalBuff
											.map((buff, ind) => {
												return get.translation(buff) + "：" + get.skillInfoTranslation(buff, null, false);
											})
											.join("<br>")}</div>`
									);
									var ul = uiintro.querySelector("ul");
									if (ul) {
										ul.style.width = "180px";
									}
									uiintro.add(ui.create.div(".placeholder"));
									return uiintro;
								},
								250
							);
						};
						showTasks();
						if (!_status.postReconnect.wuxianhuoliShowTasks) {
							_status.postReconnect.wuxianhuoliShowTasks = [showTasks, []];
						}
						const dialog = ui.create.dialog("hidden", "forcebutton");
						dialog.add(`任务一`);
						dialog.addText(`任务：全场角色共计造成3点伤害<br>奖励：获得一个技能，摸两张牌`);
						dialog.add(`任务二<div class="text center" style="font-size:10px">(完成任务一后解锁)</div>\
							<div class="text center">任务：全场角色共计造成5点伤害<br>奖励：获得一个技能，摸两张牌</div>`);
						dialog.open();
						setTimeout(() => {
							dialog.close();
						}, 3000);
					};
					game.broadcastAll(func);
					game.delay(0, 3000);
					"step 3";
					_status.characterlist.addArray(Object.values(_status.characterChoice).flat());
					setTimeout(function () {
						ui.arena.classList.remove("choose-character");
					}, 500);
				});
			},
			chooseCharacterOL: function () {
				if (_status.mode == "dianjiang") {
					game.chooseCharacterDianjiangOL();
					return;
				}
				if (_status.mode == "wuxianhuoli") {
					game.chooseCharacterWuxianhuoliOL();
					return;
				}
				var next = game.createEvent("chooseCharacter");
				next.setContent(function () {
					"step 0";
					ui.arena.classList.add("choose-character");
					var num = [0, 1].randomGet();
					game.players[num].identity = "zhu";
					game.players[1 - num].identity = "fan";
					game.broadcastAll(
						function (p, t) {
							p.enemy = t;
							t.enemy = p;
						},
						game.players[0],
						game.players[1]
					);
					for (var i = 0; i < game.players.length; i++) {
						game.players[i].showIdentity();
					}
					"step 1";
					_status.characterChoice = {
						zhu: _status.characterlist.randomRemove(3),
						fan: _status.characterlist.randomRemove(3),
						all: _status.characterlist.randomRemove(6),
					};
					event.videoIdx = lib.status.videoId++;
					game.broadcastAll(
						function (id, list) {
							var dialog = ui.create.dialog(game.me.identity == "fan" ? "选择武将" : "请等待对手选择武将", [list.all, "character"], "起始武将", [list[game.me.identity], "character"]);
							dialog.videoId = id;
						},
						event.videoIdx,
						_status.characterChoice
					);
					"step 2";
					var next = game.fan.chooseButton(true, 1);
					next.set("filterButton", function (button) {
						return _status.event.canChoose.includes(button.link);
					});
					next.set("dialog", event.videoIdx);
					next.set("canChoose", _status.characterChoice.all);
					next.ai = function () {
						return Math.random();
					};
					"step 3";
					_status.characterChoice.fan.addArray(result.links);
					_status.characterChoice.all.removeArray(result.links);
					game.broadcastAll(
						function (link, choosing, first, id) {
							var dialog = get.idDialog(id);
							if (dialog) {
								if (choosing == game.me) {
									choosing = "你";
								} else {
									choosing = "对手";
								}
								dialog.content.firstChild.innerHTML = choosing + "选择了" + get.translation(link);
								for (var i = 0; i < dialog.buttons.length; i++) {
									if (link.includes(dialog.buttons[i].link)) {
										if (first) {
											dialog.buttons[i].classList.add("selectedx");
										} else {
											dialog.buttons[i].classList.add("glow");
										}
									}
								}
							}
						},
						result.links,
						game.fan,
						true,
						event.videoIdx
					);
					var next = game.zhu.chooseButton(true, 2);
					next.set("filterButton", function (button) {
						return _status.event.canChoose.includes(button.link);
					});
					next.set("dialog", event.videoIdx);
					next.set("canChoose", _status.characterChoice.all);
					next.ai = function () {
						return Math.random();
					};
					"step 4";
					_status.characterChoice.zhu.addArray(result.links);
					_status.characterChoice.all.removeArray(result.links);
					game.broadcastAll(
						function (link, choosing, first, id) {
							var dialog = get.idDialog(id);
							if (dialog) {
								if (choosing == game.me) {
									choosing = "你";
								} else {
									choosing = "对手";
								}
								dialog.content.firstChild.innerHTML = choosing + "选择了" + get.translation(link);
								for (var i = 0; i < dialog.buttons.length; i++) {
									if (link.includes(dialog.buttons[i].link)) {
										if (first) {
											dialog.buttons[i].classList.add("selectedx");
										} else {
											dialog.buttons[i].classList.add("glow");
										}
									}
								}
							}
						},
						result.links,
						game.zhu,
						false,
						event.videoIdx
					);
					var next = game.fan.chooseButton(true, 2);
					next.set("filterButton", function (button) {
						return _status.event.canChoose.includes(button.link);
					});
					next.set("dialog", event.videoIdx);
					next.set("canChoose", _status.characterChoice.all);
					next.ai = function () {
						return Math.random();
					};
					"step 5";
					_status.characterChoice.fan.addArray(result.links);
					_status.characterChoice.all.removeArray(result.links);
					game.broadcastAll(
						function (link, choosing, first, id) {
							var dialog = get.idDialog(id);
							if (dialog) {
								if (choosing == game.me) {
									choosing = "你";
								} else {
									choosing = "对手";
								}
								dialog.content.firstChild.innerHTML = choosing + "选择了" + get.translation(link);
								for (var i = 0; i < dialog.buttons.length; i++) {
									if (link.includes(dialog.buttons[i].link)) {
										if (first) {
											dialog.buttons[i].classList.add("selectedx");
										} else {
											dialog.buttons[i].classList.add("glow");
										}
									}
								}
							}
						},
						result.links,
						game.fan,
						true,
						event.videoIdx
					);
					var next = game.zhu.chooseButton(true);
					next.set("filterButton", function (button) {
						return _status.event.canChoose.includes(button.link);
					});
					next.set("dialog", event.videoIdx);
					next.set("canChoose", _status.characterChoice.all);
					next.ai = function () {
						return Math.random();
					};
					"step 6";
					_status.characterChoice.zhu.addArray(result.links);
					_status.characterChoice.all.removeArray(result.links);
					game.broadcastAll(
						function (link, choosing, first, id) {
							var dialog = get.idDialog(id);
							if (dialog) {
								if (choosing == game.me) {
									choosing = "你";
								} else {
									choosing = "对手";
								}
								dialog.content.firstChild.innerHTML = choosing + "选择了" + get.translation(link);
								for (var i = 0; i < dialog.buttons.length; i++) {
									if (link.includes(dialog.buttons[i].link)) {
										if (first) {
											dialog.buttons[i].classList.add("selectedx");
										} else {
											dialog.buttons[i].classList.add("glow");
										}
									}
								}
							}
						},
						result.links,
						game.zhu,
						false,
						event.videoIdx
					);
					"step 7";
					game.broadcastAll("closeDialog", event.videoIdx);
					"step 8";
					var num = _status.mode == "changban" ? 2 : 1;
					var list = [
						[game.zhu, num, true, ["选择出场角色", [_status.characterChoice.zhu, "character"]]],
						[game.fan, num, true, ["选择出场角色", [_status.characterChoice.fan, "character"]]],
					];
					game.me.chooseButtonOL(list, function (player, result) {
						if (game.online || player == game.me) {
							player.init(result.links[0], result.links[1]);
						}
					});
					"step 9";
					for (var i in result) {
						var current = lib.playerOL[i];
						if (result[i] == "ai") {
							result[i] = _status.characterChoice[current.identity].randomGets(_status.mode == "changban" ? 2 : 1);
						} else {
							result[i] = result[i].links;
						}
						_status.characterChoice[current.identity].removeArray(result[i]);
						if (!current.name) {
							current.init(result[i][0], result[i][1]);
						}
					}
					game.broadcast(function (result) {
						for (var i in result) {
							if (!lib.playerOL[i].name) {
								lib.playerOL[i].init(result[i][0], result[i][1]);
							}
						}
						setTimeout(function () {
							ui.arena.classList.remove("choose-character");
						}, 500);
					}, result);
					setTimeout(function () {
						ui.arena.classList.remove("choose-character");
					}, 500);
				});
			},
		},
		element: {
			player: {
				dieAfter: function () {
					if (_status.mode != "normal" || _status.characterChoice[this.identity].length <= 3) {
						game.checkResult();
					}
				},
				dieAfter2: function () {
					if (_status.mode != "normal") {
						return;
					}
					var next = game.createEvent("replacePlayerSingle", false, _status.event.getParent());
					next.player = this;
					next.forceDie = true;
					next.setContent(function () {
						"step 0";
						game.delay();
						"step 1";
						player.chooseButton(true, ["请选择一名出场武将", [_status.characterChoice[player.identity].slice(0), "character"]]).set("forceDie", true);
						"step 2";
						var source = player;
						var name = result.links[0];
						var color = source.node.identity.dataset.color;

						game.broadcastAll(
							function (source, name, color) {
								source.revive(null, false);
								source.uninit();
								source.init(name);
								source.node.identity.dataset.color = color;
							},
							source,
							name,
							color
						);
						game.log(source, "出场");

						var num = _status.mode == "normal" ? 4 : source.maxHp;
						if (player.hasSkill("cuorui")) {
							player.logSkill("cuorui");
							num = 2 + _status.characterChoice[player.identity].length;
						}
						source.draw(num);
						var evt = event.getParent("dying");
						if (evt && evt.parent) {
							evt.parent.untrigger(false, source);
						}
						game.addVideo("reinit", source, [name, color]);
						game.triggerEnter(source);
						_status.characterChoice[player.identity].remove(name);
					});
				},
				logAi: function (targets, card) {},
				showIdentity: function () {
					game.broadcastAll(
						function (player, identity) {
							player.identity = identity;
							game[identity] = player;
							player.side = identity == "zhu";
							player.node.identity.classList.remove("guessing");
							player.identityShown = true;
							player.ai.shown = 1;
							player.setIdentity();
							if (player.identity == "zhu") {
								player.isZhu = true;
							}
							if (_status.clickingidentity) {
								for (var i = 0; i < _status.clickingidentity[1].length; i++) {
									_status.clickingidentity[1][i].delete();
									_status.clickingidentity[1][i].style.transform = "";
								}
								delete _status.clickingidentity;
							}
						},
						this,
						this.identity
					);
				},
			},
		},
		get: {
			attitude: function (from, to) {
				if (!from || !to) {
					return 0;
				}
				if (from.identity == to.identity) {
					return 10;
				}
				return -10;
			},
		},
		skill: {
			wanrong: {
				audio: 2,
				trigger: { target: "useCardToTargeted" },
				frequent: true,
				filter: function (event, player) {
					return event.card.name == "sha";
				},
				content: function () {
					player.draw();
				},
			},
			sgzhiheng: {
				audio: "zhiheng",
				inherit: "zhiheng",
				selectCard: [1, 2],
				prompt: "弃置至多两张牌并摸等量的牌",
			},
			xiechan: {
				audio: 2,
				limited: true,
				enable: "phaseUse",
				skillAnimation: true,
				animationColor: "water",
				filterTarget: function (card, player, target) {
					return target != player && player.canCompare(target);
				},
				content: function () {
					"step 0";
					player.awakenSkill(event.name);
					player.chooseToCompare(target);
					"step 1";
					if (result.bool) {
						player.useCard({ name: "juedou" }, target, "noai");
					} else {
						target.useCard({ name: "juedou" }, player, "noai");
					}
				},
				ai: {
					order: 1,
					result: {
						target: function (player, target) {
							if (
								player.countCards("h", function (card) {
									return get.value(card) <= 5 && get.number(card) >= 12;
								}) &&
								get.effect(target, { name: "juedou" }, player, player) > 0
							) {
								return -1;
							}
							return 0;
						},
					},
				},
			},
			huwei: {
				audio: 2,
				trigger: {
					player: "enterGame",
					global: "gameDrawAfter",
				},
				direct: true,
				content: function () {
					player.chooseUseTarget("shuiyanqijunx", get.prompt("huwei"), "视为使用一张【水淹七军】").logSkill = "huwei";
				},
			},
			sgliegong: {
				audio: "liegong",
				audioname: ["re_huangzhong"],
				trigger: { player: "useCardToPlayered" },
				filter(event, player) {
					if (event.card.name != "sha" || !player.enemy) {
						return false;
					}
					return player.enemy.countCards("h") >= player.hp;
				},
				check(event, player) {
					return get.attitude(player, event.target) <= 0;
				},
				logTarget: "target",
				async content(event, trigger, player) {
					trigger.getParent().directHit.push(trigger.target);
				},
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						if (get.attitude(player, arg.target) > 0 || arg.card.name != "sha") {
							return false;
						}
						return player.enemy && player.enemy.countCards("h") >= player.hp;
					},
				},
			},
			sgkuanggu: {
				audio: "kuanggu",
				trigger: { source: "damageSource" },
				frequent: true,
				filter: function (event, player) {
					return player.isDamaged();
				},
				content: function () {
					"step 0";
					player.judge(function (result) {
						return get.color(result) == "black" ? 2 : -2;
					});
					"step 1";
					if (result.bool == true) {
						player.recover();
					}
				},
			},
			suzi: {
				inherit: "xingshang",
			},
			cangji: {
				trigger: { player: "die" },
				filter: function (event, player) {
					return player.countCards("e") > 0;
				},
				forceDie: true,
				skillAnimation: true,
				animationColor: "orange",
				content: function () {
					var cards = player.getCards("e");
					player.cangji_yozuru = cards;
					player.lose(cards, ui.special);
					player.addSkill("cangji_yozuru");
				},
				subSkill: {
					yozuru: {
						sub: true,
						charlotte: true,
						superCharlotte: true,
						trigger: { player: "enterGame" },
						forced: true,
						popup: false,
						//onremove:true,
						content: function () {
							var cards = player.cangji_yozuru.slice(0);
							for (var i = 0; i < cards.length; i++) {
								player.equip(cards[i]);
							}
							player.removeSkill("cangji_yozuru");
							delete player.cangji_yozuru;
						},
					},
				},
			},
			sgrenwang: {
				audio: 2,
				trigger: { target: "useCardToTargeted" },
				direct: true,
				filter: function (event, player) {
					return event.player != player && event.player.isPhaseUsing() && (event.card.name == "sha" || get.type(event.card) == "trick");
				},
				content: function () {
					if (!player.hasSkill("sgrenwang_one")) {
						player.addTempSkill("sgrenwang_one", "phaseUseEnd");
					} else if (trigger.player.countDiscardableCards(player, "he")) {
						player.discardPlayerCard(trigger.player, "he", get.prompt("sgrenwang")).logSkill = ["sgrenwang", trigger.player];
					}
				},
			},
			sgrenwang_one: {},
			sgduanliang: {
				group: "sgduanliang_gdm",
				audio: "duanliang1",
				enable: "chooseToUse",
				filterCard: function (card) {
					if (get.type(card) != "basic" && get.type(card) != "equip") {
						return false;
					}
					return get.color(card) == "black";
				},
				filter: function (event, player) {
					return player.hasSkill("sgduanliang_sss") && player.countCards("he", { type: ["basic", "equip"], color: "black" });
				},
				position: "he",
				viewAs: { name: "bingliang" },
				prompt: "将一黑色的基本牌或装备牌当兵粮寸断使用",
				check: function (card) {
					return 6 - get.value(card);
				},
				ai: {
					order: 9,
				},
				subSkill: {
					gdm: {
						trigger: { player: "useCardToPlayered" },
						forced: true,
						silent: true,
						popup: false,
						content: function () {
							if (trigger.target != player) {
								player.addTempSkill("sgduanliang_sss");
							}
						},
					},
					sss: {},
				},
			},
			sgqingguo: {
				audio: "qingguo",
				enable: ["chooseToRespond", "chooseToUse"],
				filterCard: true,
				viewAs: { name: "shan" },
				viewAsFilter: function (player) {
					if (!player.countCards("e")) {
						return false;
					}
				},
				prompt: "将一张装备区中的牌当闪使用或打出",
				position: "e",
				check: function () {
					return 1;
				},
				ai: {
					order: 0.5,
					respondShan: true,
					skillTagFilter: function (player) {
						if (!player.countCards("e")) {
							return false;
						}
					},
					effect: {
						target: function (card, player, target, current) {
							if (target.countCards("e") && get.tag(card, "respondShan") && current < 0) {
								return 0.6;
							}
						},
					},
				},
			},
			pianyi: {
				audio: 2,
				trigger: { player: "enterGame" },
				forced: true,
				filter: function (event, player) {
					return event.getParent("phase").player == player.enemy;
				},
				content: function () {
					var evt = _status.event.getParent("phase");
					if (evt) {
						game.log(player, "结束了", evt.player, "的回合");
						game.resetSkills();
						_status.event = evt;
						_status.event.finish();
						_status.event.untrigger(true);
					}
				},
			},
			yinli: {
				audio: 2,
				trigger: { global: "loseEnd" },
				filter: function (event, player) {
					if (event.player == player || event.player != _status.currentPhase || event.getParent().name == "useCard") {
						return false;
					}
					for (var i = 0; i < event.cards.length; i++) {
						if (get.type(event.cards[i]) == "equip" && get.position(event.cards[i]) == "d") {
							return true;
						}
					}
					return false;
				},
				frequent: true,
				content: function () {
					var list = [];
					for (var i = 0; i < trigger.cards.length; i++) {
						if (get.type(trigger.cards[i]) == "equip" && get.position(trigger.cards[i]) == "d") {
							list.push(trigger.cards[i]);
						}
					}
					if (list.length) {
						player.gain(list, "gain2");
					}
				},
			},
			shenju: {
				audio: 2,
				mod: {
					maxHandcard: function (player, num) {
						if (player.enemy && player.enemy.hp) {
							return num + player.enemy.hp;
						}
					},
				},
			},
			puji: {
				// audio: "chulao",
				enable: "phaseUse",
				filter(event, player) {
					return player.countCards("he") > 0 && player.enemy && player.enemy.countCards("he") > 0;
				},
				filterTarget(card, player, target) {
					return target === player.enemy && target.countCards("he") > 0;
				},
				filterCard: true,
				position: "he",
				check(card) {
					if (get.suit(card) == "spade") {
						return 8 - get.value(card);
					}
					return 5 - get.value(card);
				},
				usable: 1,
				async content(event, trigger, player) {
					const target = event.targets[0];
					const result = await player
						.discardPlayerCard(target, "he", true)
						.set("ai", button => {
							let val = get.buttonValue(button);
							if (get.suit(button.link) === "spade") {
								val -= 2;
							}
							return val;
						})
						.forResult();
					if (get.suit(event.cards[0]) === "spade") {
						await player.draw();
					}
					if (result.bool && get.suit(result.cards[0]) === "spade") {
						await target.draw();
					}
				},
				ai: {
					order: 3,
					result: {
						player(player, target) {
							if (!ui.selected.cards.length) {
								return 0;
							}
							const card = ui.selected.cards[0];
							let val = get.value(card) / 6;
							if (get.suit(card) === "spade") {
								val--;
							}
							return -val;
						},
						target: -1,
					},
					threaten: 1.2,
				},
			},

			_changeHandcard: {
				trigger: { global: "gameDrawAfter" },
				silent: true,
				popup: false,
				filter: function (event, player) {
					return _status.mode == "changban" && player.maxHp <= 3;
				},
				content: function () {
					"step 0";
					player.chooseBool("是否更换手牌？").ai = function () {
						var hs = player.getCards("h");
						return get.value(hs, "raw") < 6 * hs;
					};
					"step 1";
					if (result.bool) {
						var hs = player.getCards("h");
						player.lose(hs, ui.special);
						event.hs = hs;
					} else {
						event.finish();
					}
					"step 2";
					var hs = event.hs;
					player.draw(hs.length, "nodelay");
					for (var i = 0; i < hs.length; i++) {
						hs[i].fix();
						ui.cardPile.insertBefore(hs[i], ui.cardPile.childNodes[get.rand(ui.cardPile.childElementCount)]);
					}
				},
			},
			wuxianhuoli_weisuoyuwei: {
				trigger: { player: "phaseZhunbeiBegin" },
				forced: true,
				silent: true,
				popup: true,
				charlotte: true,
				async content(_, __, player) {
					player.draw();
				},
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + 1;
						}
					},
				},
			},
			wuxianhuoli_duoduoyishan: {
				trigger: { global: "phaseEnd" },
				forced: true,
				silent: true,
				popup: true,
				charlotte: true,
				async content(_, __, player) {
					player.draw();
				},
			},
			wuxianhuoli_xushidaifa: {
				trigger: { source: "damageBegin1" },
				filter(event, player) {
					if (!event.card || event.card.name !== "sha") {
						return false;
					}
					return (
						game
							.getGlobalHistory("everything", evt => {
								if (evt.name !== "damage") {
									return false;
								}
								return evt.card && evt.card.name === "sha";
							})
							.indexOf(event) === 0
					);
				},
				forced: true,
				silent: true,
				popup: true,
				charlotte: true,
				async content(_, trigger) {
					trigger.increase("num");
				},
			},
			wuxianhuoli_liuanhuaming: {
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				filter(event, player) {
					if (player === _status.currentPhase) {
						return false;
					}
					const evt = event.getl(player);
					return evt.cards2 && evt.cards2.length > 0;
				},
				forced: true,
				silent: true,
				popup: true,
				charlotte: true,
				usable: 2,
				async content(_, __, player) {
					player.draw();
				},
			},
			wuxianhuoli_mianmianjudao: {
				trigger: { player: "phaseZhunbeiBegin" },
				forced: true,
				silent: true,
				popup: true,
				charlotte: true,
				async content(_, __, player) {
					const cards = [];
					for (const type of ["basic", "trick"]) {
						const card = get.cardPile(card => {
							const typex = get.type2(card, false);
							return type === typex;
						});
						if (card) {
							cards.add(card);
						}
					}
					if (cards.length) {
						player.gain(cards, "gain2");
					}
				},
			},
			wuxianhuoli_task: {
				trigger: { source: "damageAfter" },
				forced: true,
				popup: false,
				silent: true,
				charlotte: true,
				async content(event, trigger, player) {
					if (!_status.wuxianhuoliProgress) {
						_status.wuxianhuoliProgress = 0;
					}
					if (!_status.wuxianhuoliLevel) {
						_status.wuxianhuoliLevel = 0;
					}
					if (_status.wuxianhuoliLevel > 1) {
						return;
					}
					_status.wuxianhuoliProgress += trigger.num;
					game.broadcastAll(
						(num, level) => {
							_status.wuxianhuoliProgress = num;
							_status.wuxianhuoliLevel = level;
							if (!ui.wuxianhuoliProgress) {
								ui.wuxianhuoliProgress = get.is.phoneLayout() ? ui.create.div(".touchinfo.left", ui.window) : ui.create.div(ui.gameinfo);
							}
							ui.wuxianhuoliProgress.innerHTML = "任务进度(" + num + "/" + (level === 0 ? 3 : 5) + ")";
						},
						_status.wuxianhuoliProgress,
						_status.wuxianhuoliLevel
					);
					if (_status.wuxianhuoliProgress < (_status.wuxianhuoliLevel === 0 ? 3 : 5)) {
						return;
					}
					game.broadcastAll(() => {
						_status.wuxianhuoliProgress = 0;
						_status.wuxianhuoliLevel++;
					});
					let next;
					const send = (skills, refreshable, stop = false) => {
						let next = game.createEvent("wuxianhuoli_reward", false);
						next.setContent(lib.skill.wuxianhuoli_task.contentx);
						next.set("skills", skills);
						next.set("refreshable", refreshable);
						next.set("includeOut", true);
						if (!stop) {
							game.resume();
						}
						return next;
					};
					const sendback = (result, player) => {
						if (!result) {
							result = {};
						}
						if (!result.control && (typeof result.index !== "number" || result.index < 0)) {
							result.index = 0;
						}
						results.push([player, result]);
					};
					const ai_targets = [],
						results = [],
						players = game.players.slice(),
						skillsMap = {};
					let withme = false,
						withol = false,
						withai = false;
					for (const current of players) {
						if (_status.connectMode) {
							current.showTimer();
						}
						const skills = get.info("wuxianhuoli_task").getSkills();
						const refreshable = !current.storage.wuxianhuoli_refreshed;
						skillsMap[current.playerid] = skills;
						if (current.isOnline()) {
							withol = true;
							current.send(send, skills, refreshable);
							current.wait(sendback);
						} else if (current == game.me) {
							withme = true;
							next = send(skills, refreshable, true);
							if (_status.connectMode) {
								game.me.wait(sendback);
							}
						} else {
							ai_targets.push(current);
						}
					}
					if (ai_targets.length) {
						for (let i = 0; i < ai_targets.length; i++) {
							const current = ai_targets[i];
							if (players.includes(current)) {
								sendback({ index: 0 }, current);
								ai_targets.splice(i--, 1);
							}
						}
						if (ai_targets.length) {
							ai_targets.randomSort();
							setTimeout(function () {
								event.interval = setInterval(
									function () {
										const current = ai_targets.shift();
										if (players.includes(current)) {
											sendback({ index: 0 }, current);
										}
										if (!ai_targets.length) {
											clearInterval(event.interval);
											if (withai) {
												game.resume();
											}
										}
									},
									_status.connectMode ? 750 : 75
								);
							}, 500);
						}
					}
					if (withme) {
						let result = await next.forResult();
						if (_status.connectMode) {
							game.me.unwait(result, game.me);
						} else {
							if (!result) {
								result = {};
							}
							if (!result.control && (typeof result.index !== "number" || result.index < 0)) {
								result.index = 0;
							}
							results.push([game.me, result]);
						}
					}
					if (withol && !event.resultOL) {
						await new Promise(resolve => {
							const interval = setInterval(() => {
								if (results.length === players.length) {
									resolve();
									clearInterval(interval);
								}
							}, 4);
						});
					}
					if (ai_targets.length > 0) {
						withai = true;
						await new Promise(resolve => {
							const interval = setInterval(() => {
								if (results.length === players.length) {
									resolve();
									clearInterval(interval);
								}
							}, 4);
						});
					}
					if (_status.connectMode) {
						for (var i of players) {
							i.hideTimer();
						}
					}
					const entries = [];
					for (const res of results) {
						const target = res[0],
							result = res[1];
						if (!target || !result) {
							continue;
						}
						let skill = result.control;
						if (!skill) {
							skill = skillsMap[target.playerid][result.index];
						}
						if (result.refreshed) {
							target.storage.wuxianhuoli_refreshed = true;
						}
						entries.push([target, skill]);
					}
					entries.sort((a, b) => lib.sort.seat(a[0], b[0]));
					for (const entry of entries) {
						entry[0].popup(entry[1]);
						await entry[0].addSkills(entry[1]);
					}
					for (const entry of entries) {
						await entry[0].draw(2, "nodelay");
					}
					game.broadcastAll(
						(num, level) => {
							if (level === 2 && ui.wuxianhuoliProgress) {
								ui.wuxianhuoliProgress.innerHTML = "";
								return;
							}
							if (!ui.wuxianhuoliProgress) {
								ui.wuxianhuoliProgress = get.is.phoneLayout() ? ui.create.div(".touchinfo.left", ui.window) : ui.create.div(ui.gameinfo);
							}
							ui.wuxianhuoliProgress.innerHTML = "任务进度(" + num + "/" + (level === 0 ? 3 : 5) + ")";
						},
						_status.wuxianhuoliProgress,
						_status.wuxianhuoliLevel
					);
					await game.delay();
				},
				getSkills(num = 6) {
					let allList = _status.characterlist.slice(0);
					let list = [];
					let skills = [];
					let map = [];
					let entries = [];
					allList.randomSort();
					for (let i = 0; i < allList.length; i++) {
						let name = allList[i];
						let skills2 = lib.character[name][3].slice();
						skills2.randomSort();
						outer: for (let j = 0; j < skills2.length; j++) {
							let list2 = [skills2[j]];
							game.expandSkills(list2);
							for (let k = 0; k < list2.length; k++) {
								let info = lib.skill[list2[k]];
								if (!info || info.silent || info.juexingji || info.hiddenSkill || info.dutySkill || info.zhuSkill || info.unique || info.groupSkill) {
									continue;
								}
								if (info.ai && (info.ai.combo || info.ai.neg)) {
									continue;
								}
								list.add(name);
								if (!map[name]) {
									map[name] = [];
								}
								map[name].push(skills2[j]);
								skills.add(skills2[j]);
								entries.push([name, skills2[j]]);
								break outer;
							}
						}
						if (list.length >= num) {
							break;
						}
					}
					return skills;
				},
				async contentx(event) {
					_status.noclearcountdown = true;
					const controls = [
						link => {
							const evt = get.event();
							evt.result = { refresh: true };
							event.control.classList.add("disabled");
							event.control.firstChild.innerText = "刷新(1/1)";
							game.resume();
						},
					];
					event.control = ui.create.control(controls.concat(["刷新(0/1)", "stayleft"]));
					if (!event.refreshable) {
						event.control.classList.add("disabled");
						event.control.firstChild.innerText = "刷新(1/1)";
					}
					let refreshed = false,
						result;
					while (true) {
						const skills = event.skills.slice(3 * refreshed, 3 * (refreshed + 1));
						const next = game.me
							.chooseControl(skills)
							.set(
								"choiceList",
								skills.map(skill => {
									return '<div class="skill">【' + get.translation(lib.translate[skill + "_ab"] || get.translation(skill).slice(0, 2)) + "】</div>" + "<div>" + get.skillInfoTranslation(skill, game.me, false) + "</div>";
								})
							)
							.set("displayIndex", false)
							.set("prompt", "选择获得一个技能");
						result = await next.forResult();
						if (!result.refresh) {
							break;
						}
						refreshed = true;
					}
					if (event.control) {
						event.control.close();
					}
					delete _status.noclearcountdown;
					game.stopCountChoose();
					event.result = { control: result.control, refreshed };
				},
			},
		},
		singleTranslate: {
			xiahouyuan: "夏侯渊",
			huangzhong: "黄忠",
			weiyan: "魏延",
			xiaoqiao: "小乔",
			xuhuang: "徐晃",
			pangde: "庞德",
			zhangjiao: "张角",
			old_caoren: "曹仁",
			old_zhoutai: "周泰",
			shuiyanqijunx_info: "出牌阶段，对一名其他角色使用。目标角色选择一项：1、弃置装备区里的所有牌；2、受到你造成的1点伤害。",
			guohe_info: "出牌阶段，对有牌的一名其他角色使用。你选择一项：①弃置其装备区里的一张牌。②观看其手牌并弃置其中的一张。",
			shunshou_info: "出牌阶段，对距离为1且有牌的一名其他角色使用。你获得其的一张牌。",
		},
		translate: {
			zhu: "先",
			fan: "后",
			zhu2: "先手",
			fan2: "后手",
			normal2: "新1v1",
			changban2: "血战长坂坡",
			dianjiang2: "点将单挑",
			wuxianhuoli2: "无限火力",

			wuxianhuoli_weisuoyuwei: "为所欲为",
			wuxianhuoli_weisuoyuwei_info: "①准备阶段，你摸一张牌。②你使用【杀】的次数上限+1。",
			wuxianhuoli_duoduoyishan: "多多益善",
			wuxianhuoli_duoduoyishan_info: "一名角色的回合结束时，你摸一张牌。",
			wuxianhuoli_xushidaifa: "蓄势待发",
			wuxianhuoli_xushidaifa_info: "当你于一回合首次造成渠道为【杀】的伤害时，此伤害+1。",
			wuxianhuoli_liuanhuaming: "柳暗花明",
			wuxianhuoli_liuanhuaming_info: "每回合限两次。当你于回合外失去牌后，你摸一张牌。",
			wuxianhuoli_mianmianjudao: "面面俱到",
			wuxianhuoli_mianmianjudao_info: "准备阶段，你从牌堆或弃牌堆中获得基本牌和锦囊牌各一张。",

			wanrong: "婉容",
			wanrong_info: "当你成为【杀】的目标后，你可以摸一张牌。",
			sgzhiheng: "制衡",
			sgzhiheng_info: "出牌阶段限一次，你可以弃置至多两张牌，然后摸等量的牌。",
			xiechan: "挟缠",
			xiechan_info: "限定技，出牌阶段，你可以和对手拼点。然后赢的角色视为对没赢的角色使用一张【决斗】。",
			huwei: "虎威",
			huwei_info: "当你登场时，你可以视为使用一张【水淹七军】。",
			sgliegong: "烈弓",
			sgliegong_info: "当你使用【杀】指定目标后，若对手的手牌数大于等于你的体力值，你可令此【杀】不可被【闪】响应。",
			sgkuanggu: "狂骨",
			sgkuanggu_info: "当你造成伤害后，若你已受伤，你可以进行判定：若结果为黑色，你回复1点体力。",
			suzi: "肃资",
			cangji: "藏机",
			cangji_info: "当你死亡时，你可以将装备区内的所有牌移动到游戏外。若如此做，你的下一名角色登场时，你将这些牌置入你的装备区。",
			sgrenwang: "仁望",
			sgrenwang_info: "当你于一名其他角色的出牌阶段内成为该角色使用的【杀】或普通锦囊牌的目标后，若此牌不是其本阶段内对你使用的第一张【杀】或普通锦囊牌，则你可以弃置该角色的一张牌。",
			sgduanliang: "断粮",
			sgduanliang_info: "出牌阶段，若你本回合内使用牌指定过其他角色为目标，则你可以将一张黑色基本牌或装备牌当做【兵粮寸断】使用。",
			sgqingguo: "倾国",
			sgqingguo_info: "你可以将一张装备区内的牌当做【闪】使用或打出。",
			pianyi: "翩仪",
			pianyi_info: "锁定技，当你于对手的回合内登场时，你结束此回合。",
			yinli: "姻礼",
			yinli_info: "其他角色的装备牌于其回合内进入弃牌堆后，你可以获得之。",
			shenju: "慎拒",
			shenju_info: "锁定技，你的手牌上限+X（X为你对手的体力值）。",
			puji: "普济",
			puji_info: "出牌阶段限一次，你可弃置你与对手各一张牌，然后被弃置黑桃牌的角色各摸一张牌。",
		},
		help: {
			血战长坂: '<div style="margin:10px">游戏规则</div><ul style="margin-top:0"><li>选将阶段<br>双方在游戏开始时由系统随机分配身份。分配到先手身份的玩家优先出牌，分配到后手身份的玩家优先选将。<br>双方各自随机获得3名暗置武将，同时从将池中随机选出6名明置武将，由后手玩家开始，按照一次1张-2张-2张-1张的顺序，轮流选择获得明置武将。之后双方各从自己的6名武将中选择2名分别作为主将和副将进行游戏。<li>胜利条件<br>对方死亡。' + "<li>双将规则<br>双将主将决定角色的性别和势力，体力上限为主副将体力上限的平均值，向下取整。体力上限为3的角色可在游戏开始后更换一次起始手牌。<li>牌堆<br>牌堆中移除【木牛流马】【闪电】，♣花色的【藤甲】和【无懈可击 ♦️Q】️</ul>",
			无限火力: '<div style="margin:10px">1ｖ1火力全开模式</div><ul style="margin-top:0">（来自三国杀国际服）<li>所有角色的初始体力值和体力上限均为10，护甲均为0<li>每局游戏会有一个固定的Buff和一个随机的Buff，对所有角色生效' + "<li>游戏全程会有两个任务，分别为“所有角色造成3点伤害”和“所有角色造成5点伤害”，在任务一完成后才会解锁任务二。<br>每当任务完成时，系统会发放奖励：所有角色观看三个随机的技能并获得其中一个（每名角色每局有一次刷新的机会），然后摸两张牌。",
		},
	};
};
