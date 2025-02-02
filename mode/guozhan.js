import { lib, game, ui, get, ai, _status } from "../noname.js";
export const type = "mode";
/**
 * @type { () => importModeConfig }
 */
export default () => {
	return {
		name: "guozhan",
		startBefore() {
			var playback = localStorage.getItem(lib.configprefix + "playback");
			for (var i in lib.characterPack.mode_guozhan) {
				if (!get.config("onlyguozhan") && !playback) {
					if (lib.character[i.slice(3)]) continue;
				}
				lib.character[i] = lib.characterPack.mode_guozhan[i];
				if (!lib.translate["#" + i + ":die"] && !lib.character[i].dieAudios?.length) {
					let list = lib.character?.[i.slice(3)]?.dieAudios;
					lib.character[i].dieAudios = list?.length ? list : [i.slice(3)];
				}
				if (!lib.translate[i]) {
					lib.translate[i] = lib.translate[i.slice(3)];
				}
			}
			for (var i in lib.character) {
				if (lib.character[i].group == "shen" || lib.character[i].group == "western") {
					lib.character[i].group = lib.character[i].groupInGuozhan || "qun";
				}
			}
		},
		onreinit() {
			var pack = lib.characterPack.mode_guozhan;
			for (var i in pack) {
				lib.character[i] = pack[i];
				if (!lib.translate["#" + i + ":die"] && !lib.character[i].dieAudios?.length) {
					let list = lib.character?.[i.slice(3)]?.dieAudios;
					lib.character[i].dieAudios = list?.length ? list : [i.slice(3)];
				}
				if (!lib.translate[i]) {
					lib.translate[i] = lib.translate[i.slice(3)];
				}
			}
			for (var i in lib.character) {
				if (lib.character[i].group == "shen" || lib.character[i].group == "western") {
					lib.character[i].group = lib.character[i].groupInGuozhan || "qun";
				}
			}
		},
		start() {
			"step 0";
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
			} else if (_status.connectMode) {
				game.waitForPlayer();
			} else {
				_status.mode = get.config("guozhan_mode");
				if (!["normal", "yingbian", "old", "free"].includes(_status.mode)) _status.mode = "normal";
				//决定牌堆
				switch (_status.mode) {
					case "old":
						lib.card.list = lib.guozhanPile_old.slice(0);
						break;
					case "yingbian":
						lib.card.list = lib.guozhanPile_yingbian.slice(0);
						delete lib.translate.shuiyanqijunx_info_guozhan;
						const pack = lib.yingbian_guozhan;
						for (const i in pack) {
							lib.character[i] = pack[i];
							lib.characterPack.mode_guozhan[i] = pack[i];
							if (!lib.translate["#" + i + ":die"] && !lib.character[i].dieAudios?.length) {
								let list = lib.character?.[i.slice(3)]?.dieAudios;
								lib.character[i].dieAudios = list?.length ? list : [i.slice(3)];
							}
							if (!lib.translate[i]) lib.translate[i] = lib.translate[i.slice(3)];
						}
						break;
					case "normal":
						lib.card.list = lib.guozhanPile.slice(0);
						break;
				}
				if (_status.mode != "free") game.fixedPile = true;
				else {
					delete lib.translate.shuiyanqijunx_info_guozhan;
				}
				game.prepareArena();
				// game.delay();
				game.showChangeLog();
			}
			if (!_status.connectMode) {
				_status.mode = get.config("guozhan_mode");
				if (_status.brawl && _status.brawl.submode) {
					_status.mode = _status.brawl.submode;
				}
				if (get.config("separatism")) _status.separatism = true;
			}
			"step 1";
			if (_status.connectMode) {
				_status.mode = lib.configOL.guozhan_mode;
				if (!["normal", "yingbian", "old"].includes(_status.mode)) _status.mode = "normal";
				if (lib.configOL.separatism) _status.separatism = true;
				//决定牌堆
				switch (_status.mode) {
					case "old":
						lib.card.list = lib.guozhanPile_old.slice(0);
						break;
					case "yingbian":
						lib.card.list = lib.guozhanPile_yingbian.slice(0);
						delete lib.translate.shuiyanqijunx_info_guozhan;
						break;
					default:
						lib.card.list = lib.guozhanPile.slice(0);
						break;
				}
				game.fixedPile = true;
				game.broadcastAll(
					(mode, separatism) => {
						_status.mode = mode;
						if (separatism) _status.separatism = true;
						var pack = lib.characterPack.mode_guozhan;
						if (mode == "yingbian") {
							delete lib.translate.shuiyanqijunx_info_guozhan;
							const pack2 = lib.yingbian_guozhan;
							for (const i in pack2) {
								pack[i] = pack2[i];
							}
						}
						for (var i = 0; i < game.players.length; i++) {
							game.players[i].node.name.hide();
							game.players[i].node.name2.hide();
						}
						for (var i in pack) {
							lib.character[i] = pack[i];
							if (!lib.translate["#" + i + ":die"] && !lib.character[i].dieAudios?.length) {
								let list = lib.character?.[i.slice(3)]?.dieAudios;
								lib.character[i].dieAudios = list?.length ? list : [i.slice(3)];
							}
							if (!lib.translate[i]) {
								lib.translate[i] = lib.translate[i.slice(3)];
							}
						}
						for (var i in lib.character) {
							if (lib.character[i][1] == "shen" || lib.character[i][1] == "western") {
								lib.character[i].group = lib.character[i].groupInGuozhan || "qun";
							}
						}
						//lib.characterReplace={};
					},
					_status.mode,
					_status.separatism
				);
				game.randomMapOL();
			} else {
				//lib.characterReplace={};
				for (var i = 0; i < game.players.length; i++) {
					game.players[i].node.name.hide();
					game.players[i].node.name2.hide();
					game.players[i].getId();
				}
				if (_status.brawl && _status.brawl.chooseCharacterBefore) {
					_status.brawl.chooseCharacterBefore();
				}
				game.chooseCharacter();
			}
			"step 2";
			//game.broadcastAll(function(){
			//	lib.inpile.removeArray(['gz_haolingtianxia','gz_kefuzhongyuan','gz_guguoanbang','gz_wenheluanwu']);
			//});
			if (ui.coin) {
				_status.coinCoeff = get.coinCoeff([game.me.name1, game.me.name2]);
			}
			var player;
			if (_status.cheat_seat) {
				var seat = _status.cheat_seat.link;
				if (seat == 0) {
					player = game.me;
				} else {
					player = game.players[game.players.length - seat];
				}
				if (!player) player = game.me;
				delete _status.cheat_seat;
			} else {
				player = game.players[Math.floor(Math.random() * game.players.length)];
			}
			event.playerx = player;
			event.trigger("gameStart");
			"step 3";
			game.gameDraw(event.playerx);
			game.broadcastAll(function (player) {
				for (var i = 0; i < game.players.length; i++) {
					var seatNum = get.distance(player, game.players[i], "absolute");
					game.players[i].name = `unknown${seatNum}`;
					game.players[i].node.name_seat = ui.create.div(".name.name_seat", get.seatTranslation(seatNum), game.players[i]);
					// if(game.players[i]==game.me){
					// 	lib.translate[game.players[i].name]+='（你）';
					// }
				}
			}, event.playerx);

			var players = get.players(lib.sort.position);
			var info = [];
			for (var i = 0; i < players.length; i++) {
				info.push({
					name: game.players[i].name,
					translate: lib.translate[game.players[i].name],
					name1: players[i].name1,
					name2: players[i].name2,
					nickname: players[i].node.nameol.innerHTML,
				});
			}
			(_status.videoInited = true), game.addVideo("init", null, info);
			if (_status.mode == "mingjiang") {
				game.showIdentity(true);
			} else {
				for (var i = 0; i < game.players.length; i++) {
					game.players[i].ai.shown = 0;
				}
			}
			if (_status.connectMode && lib.configOL.change_card) game.replaceHandcards(game.players.slice(0));
			game.phaseLoop(event.playerx);
		},
		card: {
			junling1: {
				type: "junling",
				vanish: true,
				derivation: "guozhan",
			},
			junling2: {
				type: "junling",
				vanish: true,
				derivation: "guozhan",
			},
			junling3: {
				type: "junling",
				vanish: true,
				derivation: "guozhan",
			},
			junling4: {
				type: "junling",
				vanish: true,
				derivation: "guozhan",
			},
			junling5: {
				type: "junling",
				vanish: true,
				derivation: "guozhan",
			},
			junling6: {
				type: "junling",
				vanish: true,
				derivation: "guozhan",
			},
			zhulian_card: {
				cardimage: "wuzhong",
			},
		},
		aozhanRank: {
			8: ["gz_ol_lisu", "gz_panjun"],
			7: ["gz_zhongyan", "gz_yangyan"],
			6: ["gz_caoang", "gz_xianglang", "gz_wangyi"],
			5: ["gz_re_panshu", "gz_lukang", "gz_caoren", "gz_lvfan", "gz_machao", "gz_ganfuren", "gz_madai", "gz_jiling", "gz_pangde", "gz_huangzu"],
			4: ["gz_caozhen", "gz_re_lidian", "gz_yuejin", "gz_huangzhong", "gz_menghuo", "gz_sunshangxiang", "gz_lvmeng", "gz_lvbu", "gz_xiahouba", "gz_chendao", "gz_tw_tianyu"],
			3: ["gz_mazhong", "gz_tengyin", "gz_simayi", "gz_luxun", "gz_wuguotai", "gz_caiwenji", "gz_shibao", "gz_xuyou", "gz_zhugeke", "gz_re_nanhualaoxian", "gz_zhouyi"],
			2: ["gz_bulianshi", "gz_maliang", "gz_re_lusu", "gz_zhangzhang", "gz_jin_simashi", "gz_jin_zhangchunhua", "gz_zhugejin"],
			1: ["gz_caocao", "gz_guojia", "gz_xiahoudun", "gz_xunyu", "gz_caopi", "gz_liubei", "gz_fazheng", "gz_dongzhuo", "gz_yuji", "gz_liqueguosi", "gz_huanggai", "gz_re_xushu", "gz_panjun", "gz_yangxiu"],
		},
		guozhanRank: {
			8: ["gz_xurong", "gz_xunyou", "gz_re_lidian", "gz_caopi", "gz_shamoke", "gz_lifeng", "gz_wangping", "gz_xiaoqiao", "gz_zhoutai", "gz_lvfan", "gz_beimihu", "gz_mateng", "gz_jiaxu", "gz_jin_wangyuanji", "gz_huaxin", "gz_duyu", "gz_zhonghui", "gz_xuyou", "gz_simazhao"],
			7: ["gz_xianglang", "gz_wangyi", "gz_zhanghe", "gz_jianggan", "gz_simayi", "gz_weiyan", "gz_huangyueying", "gz_zhugeliang", "gz_lingtong", "gz_sunshangxiang", "gz_sunce", "gz_re_yuanshao", "gz_yuanshu", "gz_hetaihou", "gz_jin_simashi", "gz_sp_duyu", "gz_shibao", "gz_gongsunyuan", "gz_panjun", "gz_re_nanhualaoxian", "gz_xin_zhuran", "gz_jin_jiachong", "gz_jin_yanghu"],
			6: ["gz_caoang", "gz_tengyin", "gz_wangji", "gz_zhenji", "gz_guojia", "gz_yujin", "gz_jiangwei", "gz_zhangfei", "gz_sp_zhugeliang", "gz_zhouyu", "gz_lingcao", "gz_daqiao", "gz_dingfeng", "gz_yuji", "gz_caiwenji", "gz_diaochan", "gz_zuoci", "gz_key_ushio", "gz_jin_simazhao", "gz_dongzhao", "gz_liuba", "gz_zhouyi", "gz_re_xunchen", "gz_fuwan", "gz_zhugejin", "gz_yangxiu", "gz_yangyan", "gz_tw_tianyu", "gz_yangwan", "gz_wangling"],
			5: ["gz_bulianshi", "gz_re_panshu", "gz_zhangliao", "gz_caocao", "gz_xuhuang", "gz_liushan", "gz_pangtong", "gz_zhaoyun", "gz_re_lusu", "gz_sunquan", "gz_ganning", "gz_zhangxiu", "gz_liqueguosi", "gz_huatuo", "gz_zhanghuyuechen", "gz_re_xushu", "gz_mifangfushiren", "gz_huangzu", "gz_weiguan", "gz_miheng", "gz_wenqin", "gz_zumao", "gz_xuangongzhu", "gz_tw_xiahoushang"],
			4: ["gz_mazhong", "gz_caozhen", "gz_dianwei", "gz_dengai", "gz_xunyu", "gz_madai", "gz_liubei", "gz_mifuren", "gz_wuguotai", "gz_luxun", "gz_re_taishici", "gz_zhangjiao", "gz_pangde", "gz_liuqi", "gz_jin_zhangchunhua", "gz_zongyu", "gz_shixie", "gz_jin_yanghuiyu", "gz_tangzi", "gz_yanbaihu", "gz_wujing", "gz_zhugeke", "gz_sunchen", "gz_liaohua", "gz_zhongyan", "gz_xinchang", "gz_tw_liufuren"],
			3: ["gz_maliang", "gz_xiahoudun", "gz_yuejin", "gz_caoren", "gz_machao", "gz_masu", "gz_fazheng", "gz_zhangzhang", "gz_lvmeng", "gz_huanggai", "gz_jiling", "gz_lvbu", "gz_dongzhuo", "gz_jin_xiahouhui", "gz_simazhou", "gz_zhanglu", "gz_chendao", "gz_yangzhi", "gz_old_huaxiong", "gz_gaoshun"],
			2: ["gz_cuimao", "gz_xiahouyuan", "gz_caohong", "gz_zhurong", "gz_zhurong", "gz_jiangfei", "gz_xusheng", "gz_luyusheng", "gz_sunjian", "gz_zhangren", "gz_kongrong", "gz_yanwen", "gz_jin_simayi", "gz_mengda", "gz_xiahouba"],
			1: ["gz_zangba", "gz_bianfuren", "gz_xuzhu", "gz_menghuo", "gz_ganfuren", "gz_guanyu", "gz_lukang", "gz_jiangqing", "gz_chendong", "gz_zoushi", "gz_panfeng", "gz_tianfeng", "gz_sufei", "gz_yanyan"],
		},
		yingbian_guozhan: {
			gz_sp_duyu: ["male", "qun", 4, ["fakezhufu"]],
			gz_wangji: ["male", "wei", 3, ["fakeqizhi", "fakejinqu"]],
			gz_yangyan: ["female", "jin", 3, ["fakexuanbei", "xianwan"]],
			gz_shibao: ["male", "jin", 4, ["fakezhuosheng", "fakejuhou"]],
			gz_simazhou: ["male", "jin", 4, ["fakecaiwang", "fakenaxiang"]],
		},
		characterSort: {
			mode_guozhan: {
				guozhan_default: ["gz_caocao", "gz_simayi", "gz_xiahoudun", "gz_zhangliao", "gz_xuzhu", "gz_guojia", "gz_zhenji", "gz_xiahouyuan", "gz_zhanghe", "gz_xuhuang", "gz_caoren", "gz_dianwei", "gz_xunyu", "gz_caopi", "gz_yuejin", "gz_liubei", "gz_guanyu", "gz_zhangfei", "gz_zhugeliang", "gz_zhaoyun", "gz_machao", "gz_huangyueying", "gz_huangzhong", "gz_weiyan", "gz_pangtong", "gz_sp_zhugeliang", "gz_liushan", "gz_menghuo", "gz_zhurong", "gz_ganfuren", "gz_sunquan", "gz_ganning", "gz_lvmeng", "gz_huanggai", "gz_zhouyu", "gz_daqiao", "gz_luxun", "gz_sunshangxiang", "gz_sunjian", "gz_xiaoqiao", "gz_re_taishici", "gz_zhoutai", "gz_re_lusu", "gz_zhangzhang", "gz_dingfeng", "gz_huatuo", "gz_lvbu", "gz_diaochan", "gz_re_yuanshao", "gz_yanwen", "gz_jiaxu", "gz_pangde", "gz_zhangjiao", "gz_caiwenji", "gz_mateng", "gz_kongrong", "gz_jiling", "gz_tianfeng", "gz_panfeng", "gz_zoushi"],
				guozhan_zhen: ["gz_dengai", "gz_caohong", "gz_jiangfei", "gz_jiangwei", "gz_xusheng", "gz_jiangqing", "gz_hetaihou", "gz_yuji"],
				guozhan_shi: ["gz_re_lidian", "gz_zangba", "gz_madai", "gz_mifuren", "gz_sunce", "gz_chendong", "gz_sp_dongzhuo", "gz_zhangren"],
				guozhan_bian: ["gz_liqueguosi", "gz_zuoci", "gz_bianfuren", "gz_xunyou", "gz_lingtong", "gz_lvfan", "gz_masu", "gz_shamoke"],
				guozhan_quan: ["gz_cuimao", "gz_yujin", "gz_wangping", "gz_fazheng", "gz_wuguotai", "gz_lukang", "gz_yuanshu", "gz_zhangxiu"],
				guozhan_jun: ["gz_jun_caocao", "gz_jun_sunquan", "gz_jun_liubei", "gz_jun_zhangjiao"],
				guozhan_single: ["gz_re_xushu", "gz_yanbaihu", "gz_wujing", "gz_dongzhao", "gz_huangzu", "gz_zhugeke", "gz_liuba", "gz_zhuling"],
				guozhan_double: ["gz_tangzi", "gz_liuqi", "gz_mengda", "gz_mifangfushiren", "gz_zhanglu", "gz_shixie", "gz_xuyou", "gz_xiahouba", "gz_panjun", "gz_xf_sufei", "gz_wenqin", "gz_pengyang"],
				guozhan_yexinjia: ["gz_zhonghui", "gz_simazhao", "gz_gongsunyuan", "gz_sunchen"],
				guozhan_jin: ["gz_jin_simayi", "gz_jin_simazhao", "gz_jin_simashi", "gz_jin_zhangchunhua", "gz_jin_wangyuanji", "gz_jin_xiahouhui", "gz_duyu", "gz_zhanghuyuechen", "gz_jin_yanghuiyu", "gz_simazhou", "gz_shibao", "gz_weiguan", "gz_zhongyan", "gz_yangyan", "gz_zuofen", "gz_xinchang", "gz_xuangongzhu", "gz_yangzhi"],
				guozhan_zongheng: ["gz_huaxin", "gz_luyusheng", "gz_zongyu", "gz_miheng", "gz_fengxi", "gz_dengzhi", "gz_re_xunchen", "gz_dc_yanghu"],
				guozhan_decade: ["gz_wangling", "gz_wangji", "gz_yanyan", "gz_xin_zhuran", "gz_gaoshun", "gz_jin_jiachong", "gz_jin_yanghu"],
				guozhan_mobile: ["gz_sp_duyu"],
				guozhan_qunxiong: ["gz_xf_huangquan", "gz_guohuai", "gz_guanqiujian", "gz_zhujun", "gz_chengong", "gz_re_xugong"],
				guozhan_tw: ["gz_tw_tianyu", "gz_tw_liufuren"],
				guozhan_others: ["gz_ol_lisu", "gz_mazhong", "gz_bulianshi", "gz_caoang", "gz_caozhen", "gz_maliang", "gz_re_panshu", "gz_tengyin", "gz_xurong", "gz_xianglang", "gz_zumao", "gz_zhugejin", "gz_zhouyi", "gz_lingcao", "gz_yangxiu", "gz_tw_xiahoushang", "gz_beimihu", "gz_fuwan", "gz_old_huaxiong", "gz_lvlingqi", "gz_yangwan", "gz_chendao", "gz_lifeng", "gz_liaohua", "gz_jianggan", "gz_wangyi", "gz_key_ushio", "gz_re_nanhualaoxian", "gz_re_xusheng", "gz_ol_sb_sunjian"],
			},
		},
		characterPack: {
			mode_guozhan: {
				gz_shibing1wei: ["male", "wei", 0, [], ["unseen"]],
				gz_shibing2wei: ["female", "wei", 0, [], ["unseen"]],
				gz_shibing1shu: ["male", "shu", 0, [], ["unseen"]],
				gz_shibing2shu: ["female", "shu", 0, [], ["unseen"]],
				gz_shibing1wu: ["male", "wu", 0, [], ["unseen"]],
				gz_shibing2wu: ["female", "wu", 0, [], ["unseen"]],
				gz_shibing1qun: ["male", "qun", 0, [], ["unseen"]],
				gz_shibing2qun: ["female", "qun", 0, [], ["unseen"]],
				gz_shibing1jin: ["male", "jin", 0, [], ["unseen"]],
				gz_shibing2jin: ["female", "jin", 0, [], ["unseen"]],
				gz_shibing1ye: ["male", "ye", 0, [], ["unseen"]],
				gz_shibing2ye: ["female", "ye", 0, [], ["unseen"]],
				gz_shibing1key: ["male", "key", 0, [], ["unseen"]],
				gz_shibing2key: ["female", "key", 0, [], ["unseen"]],

				gz_zhonghui: ["male", "ye", 4, ["fakequanji", "fakepaiyi"], ["gzskin"]],
				gz_simazhao: ["male", "ye", 3, ["gzzhaoxin", "gzsuzhi"], ["gzskin"]],
				gz_gongsunyuan: ["male", "ye", 4, ["gzhuaiyi", "gzzisui"], ["gzskin"]], //致敬存活一年的传奇野心家公孙瓒
				gz_sunchen: ["male", "ye", 4, ["fakeshilu", "fakexiongnve"]],
				gz_tangzi: ["male", "wu", 4, ["gzxingzhao"], ["doublegroup:wei:wu", "gzskin"]],
				gz_mengda: ["male", "wei", 4, ["qiuan", "liangfan"], ["doublegroup:wei:shu"]],
				gz_liuqi: ["male", "qun", 3, ["gzwenji", "gztunjiang"], ["doublegroup:shu:qun", "gzskin"]],
				gz_mifangfushiren: ["male", "shu", 4, ["mffengshi"], ["doublegroup:shu:wu"]],
				gz_shixie: ["male", "qun", 3, ["gzbiluan", "gzrelixia"], ["doublegroup:wu:qun", "gzskin"]],
				gz_zhanglu: ["male", "qun", 3, ["gzrebushi", "gzremidao"], ["doublegroup:wei:qun", "gzskin"]],
				gz_dongzhao: ["male", "wei", 3, ["quanjin", "zaoyun"]],
				gz_re_xushu: ["male", "shu", 4, ["gzzhuhai", "gzpozhen", "gzjiancai"], ["gzskin"]],
				gz_wujing: ["male", "wu", 4, ["donggui", "fengyang"], ["gzskin"]],
				gz_yanbaihu: ["male", "qun", 4, ["gzzhidao", "gzyjili"], ["gzskin"]],
				gz_xuyou: ["male", "wei", 3, ["gzchenglve", "gzshicai"], ["doublegroup:wei:qun", "gzskin"]],
				gz_xiahouba: ["male", "shu", 4, ["gzbaolie"], ["doublegroup:wei:shu", "gzskin"]],
				gz_panjun: ["male", "wu", 3, ["gzcongcha", "xinfu_gongqing"], ["doublegroup:shu:wu", "gzskin"]],
				gz_huangzu: ["male", "qun", 4, ["gzxishe"], ["gzskin"]],
				gz_zhugeke: ["male", "wu", 3, ["aocai", "gzduwu"], ["gzskin"]],
				gz_wenqin: ["male", "wei", 4, ["gzjinfa"], ["doublegroup:wei:wu", "gzskin"]],
				gz_xf_sufei: ["male", "wu", 4, ["gzlianpian"], ["doublegroup:wu:qun", "gzskin"]],
				gz_liuba: ["male", "shu", 3, ["gztongduo", "qingyin"], ["gzskin"]],
				gz_pengyang: ["male", "shu", 3, ["gztongling", "gzjinyu"], ["doublegroup:shu:qun", "gzskin"]],
				gz_zhuling: ["male", "wei", 4, ["gzjuejue", "gzfangyuan"], ["gzskin"]],
				gz_wangyi: ["male", "wei", 3, ["zhenlie", "miji"]],
				gz_wangji: ["male", "wei", 3, ["gzqizhi", "gzjinqu"]],
				gz_xurong: ["male", "qun", 4, ["gzxionghuo"]],
				gz_xianglang: ["male", "shu", 3, ["gzkanji", "dcqianzheng"]],
				gz_tengyin: ["male", "wu", 3, ["gzchenjian", "gzxixiu"]],
				gz_re_panshu: ["female", "wu", 3, ["zhiren", "gzyaner"]],
				gz_maliang: ["male", "shu", 3, ["xiemu", "naman"], ["die:old_maliang"]],
				gz_caozhen: ["male", "wei", 4, ["gzsidi"]],
				gz_caoang: ["male", "wei", 4, ["kaikang"]],
				gz_bulianshi: ["female", "wu", 3, ["old_anxu", "zhuiyi"]],
				gz_mazhong: ["male", "shu", 4, ["twfuman"]],
				gz_ol_lisu: ["male", "qun", 3, ["qiaoyan", "xianzhu"]],

				gz_caocao: ["male", "wei", 4, ["rejianxiong_old"]],
				gz_simayi: ["male", "wei", 3, ["fankui", "guicai"]],
				gz_xiahoudun: ["male", "wei", 4, ["reganglie"]],
				gz_zhangliao: ["male", "wei", 4, ["new_retuxi"]],
				gz_xuzhu: ["male", "wei", 4, ["gzluoyi"]],
				gz_guojia: ["male", "wei", 3, ["tiandu", "gzyiji"], ["gzskin"]],
				gz_zhenji: ["female", "wei", 3, ["luoshen", "qingguo"], ["gzskin"]],
				gz_xiahouyuan: ["male", "wei", 4, ["gzshensu"], ["gzskin"]],
				gz_zhanghe: ["male", "wei", 4, ["qiaobian"]],
				gz_xuhuang: ["male", "wei", 4, ["new_duanliang"]],
				gz_caoren: ["male", "wei", 4, ["gzjushou"]],
				gz_dianwei: ["male", "wei", 5, ["reqiangxi"], ["gzskin"]],
				gz_xunyu: ["male", "wei", 3, ["quhu", "gzjieming"]],
				gz_caopi: ["male", "wei", 3, ["xingshang", "gzfangzhu"], ["gzskin"]],
				gz_yuejin: ["male", "wei", 4, ["fakexiaoguo"], ["gzskin"]],

				gz_liubei: ["male", "shu", 4, ["rerende"]],
				gz_guanyu: ["male", "shu", 5, ["new_rewusheng"], ["gzskin"]],
				gz_zhangfei: ["male", "shu", 4, ["gzpaoxiao"]],
				gz_zhugeliang: ["male", "shu", 3, ["guanxing", "new_kongcheng"], ["gzskin"]],
				gz_zhaoyun: ["male", "shu", 4, ["new_longdan"]],
				gz_machao: ["male", "shu", 4, ["mashu", "new_tieji"]],
				gz_huangyueying: ["female", "shu", 3, ["jizhi", "qicai"], ["gzskin"]],
				gz_huangzhong: ["male", "shu", 4, ["gzliegong"], ["gzskin"]],
				gz_weiyan: ["male", "shu", 4, ["xinkuanggu"]],
				gz_pangtong: ["male", "shu", 3, ["lianhuan", "oldniepan"]],
				gz_sp_zhugeliang: ["male", "shu", 3, ["huoji", "bazhen", "kanpo"], ["gzskin"]],
				gz_liushan: ["male", "shu", 3, ["xiangle", "fangquan"]],
				gz_menghuo: ["male", "shu", 4, ["huoshou", "rezaiqi"]],
				gz_zhurong: ["female", "shu", 4, ["juxiang", "lieren"]],
				gz_ganfuren: ["female", "shu", 3, ["gzshushen_new", "shenzhi"], ["gzskin"]],
				gz_yuji: ["male", "qun", 3, ["qianhuan"], ["gzskin"]],

				gz_sunquan: ["male", "wu", 4, ["gzzhiheng"]],
				gz_ganning: ["male", "wu", 4, ["qixi"]],
				gz_lvmeng: ["male", "wu", 4, ["new_keji", "new_mouduan"]],
				gz_huanggai: ["male", "wu", 4, ["new_kurou"]],
				gz_zhouyu: ["male", "wu", 3, ["reyingzi", "refanjian"], ["gzskin"]],
				gz_daqiao: ["female", "wu", 3, ["guose", "liuli"]],
				gz_luxun: ["male", "wu", 3, ["gzqianxun", "gzduoshi"], ["gzskin"]],
				gz_sunshangxiang: ["female", "wu", 3, ["jieyin", "gzxiaoji"], ["gzskin"]],
				gz_sunjian: ["male", "wu", 5, ["yinghun"], ["gzskin"]],
				gz_xiaoqiao: ["female", "wu", 3, ["gztianxiang", "gzhongyan"], ["gzskin"]],
				gz_re_taishici: ["male", "wu", 4, ["tianyi", "fakehanzhan"], ["tempname:re_taishici", "die:re_taishici"]],
				gz_zhoutai: ["male", "wu", 4, ["buqu", "new_fenji"]],
				gz_re_lusu: ["male", "wu", 3, ["haoshi", "dimeng"]],
				gz_zhangzhang: ["male", "wu", 3, ["zhijian", "guzheng"]],
				gz_dingfeng: ["male", "wu", 4, ["fakeduanbing", "fenxun"], ["gzskin"]],

				gz_huatuo: ["male", "qun", 3, ["new_chuli", "jijiu"]],
				gz_lvbu: ["male", "qun", 5, ["gzwushuang"], ["gzskin"]],
				gz_diaochan: ["female", "qun", 3, ["lijian", "biyue"], ["gzskin"]],
				gz_re_yuanshao: ["male", "qun", 4, ["new_luanji"], ["gzskin"]],
				gz_yanwen: ["male", "qun", 4, ["fakeshuangxiong"]],
				gz_jiaxu: ["male", "qun", 3, ["wansha", "luanwu", "gzweimu"], ["gzskin"]],
				gz_pangde: ["male", "qun", 4, ["mashu", "jianchu"]],
				gz_zhangjiao: ["male", "qun", 3, ["leiji", "guidao"]],
				gz_caiwenji: ["female", "qun", 3, ["beige", "gzduanchang"]],
				gz_mateng: ["male", "qun", 4, ["mashu", "xiongyi"]],
				gz_kongrong: ["male", "qun", 3, ["gzmingshi", "lirang"]],
				gz_jiling: ["male", "qun", 4, ["shuangren"]],
				gz_tianfeng: ["male", "qun", 3, ["sijian", "gzsuishi"]],
				gz_panfeng: ["male", "qun", 4, ["gzkuangfu"], ["gzskin"]],
				gz_zoushi: ["female", "qun", 3, ["huoshui", "new_qingcheng"]],

				gz_dengai: ["male", "wei", 4, ["tuntian", "ziliang", "gzjixi"], ["gzskin"]],
				gz_caohong: ["male", "wei", 4, ["fakehuyuan", "heyi"], ["gzskin"]],
				gz_jiangfei: ["male", "shu", 3, ["shengxi", "gzshoucheng"], ["gzskin"]],
				gz_jiangwei: ["male", "shu", 4, ["tiaoxin", "yizhi", "tianfu"], ["gzskin"]],
				gz_xusheng: ["male", "wu", 4, ["gzyicheng_new"], ["gzskin"]],
				//沟槽线上就使劲薅你的(A+C)/2大宝吧，我没意见（有也没用）
				gz_re_xusheng: ["male", "wu", 4, ["repojun"]],
				gz_ol_sb_sunjian: ["male", "wu", "4/5", ["olsbhulie", "olsbyipo"]],
				gz_jiangqing: ["male", "wu", 4, ["gzshangyi", "niaoxiang"]],
				gz_hetaihou: ["female", "qun", 3, ["zhendu", "qiluan"], ["gzskin"]],

				gz_re_lidian: ["male", "wei", 3, ["xunxun", "wangxi"]],
				gz_zangba: ["male", "wei", 4, ["gzhengjiang"], ["character:tw_zangba"]],
				gz_madai: ["male", "shu", 4, ["mashu", "qianxi"], ["gzskin"]],
				gz_mifuren: ["female", "shu", 3, ["gzguixiu", "gzcunsi"]],
				gz_sunce: ["male", "wu", 4, ["jiang", "yingyang", "baka_hunshang"], ["gzskin"]],
				gz_chendong: ["male", "wu", 4, ["duanxie", "fakefenming"], ["gzskin"]],
				gz_sp_dongzhuo: ["male", "qun", 4, ["hengzheng", "fakebaoling"]],
				gz_zhangren: ["male", "qun", 4, ["chuanxin", "fengshi"]],

				gz_jun_liubei: ["male", "shu", 4, ["zhangwu", "jizhao", "shouyue"]],
				gz_jun_zhangjiao: ["male", "qun", 4, ["wuxin", "hongfa", "wendao"]],
				gz_jun_sunquan: ["male", "wu", 4, ["jiahe", "lianzi", "jubao"]],

				gz_liqueguosi: ["male", "qun", 4, ["gzxiongsuan"], ["gzskin"]],
				gz_zuoci: ["male", "qun", 3, ["fakeyigui", "fakejihun"], ["gzskin"]],
				gz_bianfuren: ["female", "wei", 3, ["wanwei", "gzyuejian"], ["die:ol_bianfuren"]],
				gz_xunyou: ["male", "wei", 3, ["gzqice", "zhiyu"], ["gzskin"]],
				gz_lingtong: ["male", "wu", 4, ["xuanlve", "yongjin"], ["gzskin"]],
				gz_lvfan: ["male", "wu", 3, ["gzdiaodu_backports", "gzdiancai"], ["gzskin"]],
				gz_masu: ["male", "shu", 3, ["gzsanyao", "gzzhiman"], ["gzskin"]],
				gz_shamoke: ["male", "shu", 4, ["gzjili"], ["gzskin"]],

				gz_lingcao: ["male", "wu", 4, ["gzdujin"]],
				gz_lifeng: ["male", "shu", 3, ["tunchu", "shuliang"]],
				gz_beimihu: ["female", "qun", 3, ["gzguishu", "gzyuanyu"]],
				gz_jianggan: ["male", "wei", 3, ["weicheng", "daoshu"]],
				gz_sp_duyu: ["male", "qun", 4, ["spwuku", "spmiewu"]],
				gz_huaxin: ["male", "wei", 3, ["wanggui", "fakexibing"]],
				gz_luyusheng: ["female", "wu", 3, ["fakezhente", "fakezhiwei"]],
				gz_zongyu: ["male", "shu", 3, ["zyqiao", "gzchengshang"]],
				gz_miheng: ["male", "qun", 3, ["fakekuangcai", "gzshejian"], ["gzskin", "die:re_miheng"]],
				gz_fengxi: ["male", "wu", 3, ["gzyusui", "gzboyan"], ["gzskin"]],
				gz_dengzhi: ["male", "shu", 3, ["gzjianliang", "gzweimeng"], ["gzskin"]],
				gz_re_nanhualaoxian: ["male", "qun", 3, ["gzgongxiu", "gztaidan", "gzjinghe_new"]],
				gz_zhouyi: ["female", "wu", 3, ["gzzhukou", "gzduannian", "gzlianyou"]],
				gz_re_xunchen: ["male", "qun", 3, ["gzfenglve", "gzanyong"]],
				gz_lvlingqi: ["female", "qun", 4, ["guowu", "gzshenwei", "gzzhuangrong"], ["gzskin"]],
				gz_dc_yanghu: ["male", "wei", 3, ["gzdeshao", "gzmingfa"]],

				gz_cuimao: ["male", "wei", 3, ["gzzhengbi", "gzfengying"], ["gzskin"]],
				gz_yujin: ["male", "wei", 4, ["gzjieyue"], ["character:yujin_yujin", "die:yujin.mp3"]],
				gz_wangping: ["male", "shu", 4, ["jianglue"], ["gzskin"]],
				gz_fazheng: ["male", "shu", 3, ["gzxuanhuo", "gzenyuan"], ["gzskin", "die:xin_fazheng"]],
				gz_wuguotai: ["female", "wu", 3, ["gzbuyi", "ganlu"], ["character:re_wuguotai"]],
				gz_lukang: ["male", "wu", 4, ["fakejueyan", "fakekeshou"], ["gzskin"]],
				gz_yuanshu: ["male", "qun", 4, ["gzweidi", "gzyongsi"], ["gzskin"]],
				gz_zhangxiu: ["male", "qun", 4, ["gzfudi", "gzcongjian"], ["gzskin"]],
				gz_jun_caocao: ["male", "wei", 4, ["jianan", "huibian", "gzzongyu"], []],

				gz_jin_zhangchunhua: ["female", "jin", 3, ["gzhuishi", "fakeqingleng"]],
				gz_jin_simayi: ["male", "jin", 3, ["fakequanbian", "smyyingshi", "fakezhouting"]],
				gz_jin_wangyuanji: ["female", "jin", 3, ["fakeyanxi", "fakeshiren"]],
				gz_jin_simazhao: ["male", "jin", 3, ["zhaoran", "gzchoufa"]],
				gz_jin_xiahouhui: ["female", "jin", 3, ["fakebaoqie", "jyishi", "shiduo"]],
				gz_jin_simashi: ["male", "jin", 5, ["gzyimie", "gztairan"]],
				gz_duyu: ["male", "jin", 4, ["gzsanchen", "gzpozhu"]],
				gz_zhanghuyuechen: ["male", "jin", 4, ["fakexijue"]],
				gz_jin_yanghuiyu: ["female", "jin", 3, ["fakeciwei", "fakehuirong"]],
				gz_simazhou: ["male", "jin", 4, ["caiwang", "gznaxiang"]],
				gz_shibao: ["male", "jin", 4, ["gzzhuosheng"]],
				gz_weiguan: ["male", "jin", 3, ["zhongyun", "shenpin"]],
				gz_zhongyan: ["female", "jin", 3, ["gzbolan", "yifa"]],
				gz_yangyan: ["female", "jin", 3, ["gzxuanbei", "xianwan"]],
				gz_zuofen: ["female", "jin", 3, ["gzzhaosong", "gzlisi"]],
				gz_xuangongzhu: ["female", "jin", 3, ["fakeqimei", "ybzhuiji"]],
				gz_xinchang: ["male", "jin", 3, ["fakecanmou", "congjian"]],
				gz_yangzhi: ["female", "jin", 3, ["gzwanyi", "gzmaihuo"]],

				gz_liaohua: ["male", "shu", 4, ["gzdangxian"]],
				gz_zhugejin: ["male", "wu", 3, ["gzhuanshi", "gzhongyuan", "gzmingzhe"]],
				gz_yangxiu: ["male", "wei", 3, ["gzdanlao", "gzjilei"]],
				gz_zumao: ["male", "wu", 4, ["yinbing", "juedi"]],
				gz_fuwan: ["male", "qun", 4, ["gzmoukui"], ["character:tw_fuwan"]],
				gz_chendao: ["male", "shu", 4, ["drlt_wanglie"], []],
				gz_tw_tianyu: ["male", "wei", 4, ["gzzhenxi", "gzjiansu"], []],
				gz_tw_liufuren: ["female", "qun", 3, ["gzzhuidu", "gzshigong"], []],
				gz_old_huaxiong: ["male", "qun", 4, ["gzyaowu", "gzshiyong"], []],
				gz_tw_xiahoushang: ["male", "wei", 4, ["gztanfeng"], []],

				gz_xf_huangquan: ["male", "wei", 3, ["gzdianhu", "gzjianji"], ["doublegroup:wei:shu"]],
				gz_guohuai: ["male", "wei", 4, ["gzduanshi", "gzjingce"], ["gzskin"]],
				gz_guanqiujian: ["male", "wei", 4, ["gzzhengrong", "gzhongju"], []],
				gz_zhujun: ["male", "qun", 4, ["gzgongjian", "gzkuimang"], []],
				gz_chengong: ["male", "qun", 3, ["gzyinpan", "gzxingmou"], ["doublegroup:wei:qun", "gzskin"]],
				gz_re_xugong: ["male", "wu", 3, ["gzbiaozhao", "gzyechou"], ["doublegroup:wu:qun"]],

				gz_yangwan: ["female", "shu", 3, ["gzyouyan", "gzzhuihuan"], ["gzskin"]],

				gz_key_ushio: ["female", "key", 3, ["ushio_huanxin", "ushio_xilv"], ["doublegroup:key:wei:shu:wu:qun:jin"]],

				gz_wangling: ["male", "wei", 4, ["fakemibei"]],
				gz_yanyan: ["male", "shu", 4, ["fakejuzhan"]],
				gz_xin_zhuran: ["male", "wu", 4, ["fakedanshou"]],
				gz_gaoshun: ["male", "qun", 4, ["fakexunxi", "fakehuanjia"], ["gzskin"]],
				gz_jin_jiachong: ["male", "jin", 3, ["fakexiongshu", "fakejianhui"]],
				gz_jin_yanghu: ["male", "jin", 4, ["fakechongxin", "fakeweirong"]],
			},
		},
		skill: {
			//国战典藏2024-2025，启动！
			//国战限定
			//卑弥呼
			gzguishu: {
				audio: "bmcanshi",
				enable: "phaseUse",
				filter(event, player) {
					return player.countCards("hs", { suit: "spade" }) > 0;
				},
				chooseButton: {
					dialog(event, player) {
						var list = ["yuanjiao", "zhibi"];
						for (var i = 0; i < list.length; i++) {
							list[i] = ["锦囊", "", list[i]];
						}
						return ui.create.dialog("鬼术", [list, "vcard"]);
					},
					filter(button, player) {
						var name = button.link[2];
						if (player.storage.gzguishu_used == 1 && name == "yuanjiao") return false;
						if (player.storage.gzguishu_used == 2 && name == "zhibi") return false;
						return lib.filter.filterCard({ name: name }, player, _status.event.getParent());
					},
					check(button) {
						var player = _status.event.player;
						if (button.link == "yuanjiao") {
							return 3;
						}
						if (button.link == "zhibi") {
							if (player.countCards("hs", { suit: "spade" }) > 2) return 1;
							return 0;
						}
					},
					backup(links, player) {
						return {
							audio: "bmcanshi",
							filterCard: { suit: "spade" },
							position: "hs",
							popname: true,
							ai(card) {
								return 6 - ai.get.value(card);
							},
							viewAs: { name: links[0][2] },
							precontent() {
								player.addTempSkill("gzguishu_used");
								player.storage.gzguishu_used = ["yuanjiao", "zhibi"].indexOf(event.result.card.name) + 1;
							},
						};
					},
					prompt(links, player) {
						return "###鬼术###将一张黑桃手牌当作【" + get.translation(links[0][2]) + "】使用";
					},
				},
				ai: {
					order: 4,
					result: { player: 1 },
					threaten: 2,
				},
				subSkill: {
					backup: {},
					used: {
						charlotte: true,
						onremove: true,
					},
				},
			},
			gzyuanyu: {
				inherit: "hmkyuanyu",
				filter(event, player) {
					return !event.source?.inRange(player);
				},
				content() {
					trigger.num--;
				},
				ai: {
					effect: {
						target(card, player, target) {
							if (player.hasSkillTag("jueqing", false, target)) return;
							if (player.inRange(target)) return;
							const num = get.tag(card, "damage");
							if (num) {
								if (num > 1) return 0.5;
								return "zeroplayertarget";
							}
						},
					},
				},
			},
			//伏完
			gzmoukui: {
				audio: "moukui",
				trigger: { player: "useCardToPlayered" },
				filter(event, player) {
					return event.card?.name == "sha";
				},
				direct: true,
				preHidden: true,
				content() {
					"step 0";
					var list = ["选项一"];
					if (trigger.target.countDiscardableCards(player, "he") > 0) list.push("选项二");
					list.push("背水！");
					list.push("cancel2");
					player
						.chooseControl(list)
						.set("choiceList", ["摸一张牌", "弃置" + get.translation(trigger.target) + "的一张牌", "背水！依次执行以上两项。然后若此【杀】未令其进入濒死状态，则其弃置你的一张牌。"])
						.set("prompt", get.prompt(event.name, trigger.target))
						.setHiddenSkill(event.name);
					"step 1";
					if (result.control != "cancel2") {
						var target = trigger.target;
						player.logSkill(event.name, target);
						if (result.control == "选项一" || result.control == "背水！") player.draw();
						if (result.control == "选项二" || result.control == "背水！") player.discardPlayerCard(target, true, "he");
						if (result.control == "背水！") {
							player.addTempSkill(event.name + "_effect");
							var evt = trigger.getParent();
							if (!evt[event.name + "_effect"]) evt[event.name + "_effect"] = [];
							evt[event.name + "_effect"].add(target);
						}
					}
				},
				subSkill: {
					effect: {
						charlotte: true,
						trigger: { player: "useCardAfter" },
						filter(event, player) {
							return event.gzmoukui_effect?.some(current => {
								return current.isIn() && !current.hasHistory("damage", evt => evt.card == event.card);
							});
						},
						forced: true,
						popup: false,
						content() {
							var list = trigger.gzmoukui_effect
								.filter(current => {
									return current.isIn() && !current.hasHistory("damage", evt => evt.card == trigger.card);
								})
								.sortBySeat();
							for (var i of list) {
								i.discardPlayerCard(player, true, "he").boolline = true;
							}
						},
					},
				},
			},
			//南华老仙
			gzjinghe_new: {
				inherit: "gzjinghe",
				filter: () => true,
				filterCard: () => false,
				selectCard: -1,
				filterTarget: true,
				selectTarget: 1,
				usable: 1,
				async content(event, trigger, player) {
					const target = event.targets[0];
					const skill = get.info(event.name).derivation?.randomGet();
					if (!skill) return;
					const cardname = "gzrejinghe_" + skill;
					const videoId = lib.status.videoId++;
					lib.card[cardname] = {
						fullimage: true,
						image: "character:re_nanhualaoxian",
					};
					lib.translate[cardname] = get.translation(skill);
					game.broadcastAll(
						function (player, id, card) {
							ui.create.dialog(get.translation(player) + "发动了【经合】", [[card], "card"]).videoId = id;
						},
						player,
						videoId,
						game.createCard(cardname, " ", " ")
					);
					await game.delay(3);
					game.broadcastAll("closeDialog", videoId);
					player.addTempSkill("gzjinghe_new_clear", { player: "phaseBegin" });
					target.addAdditionalSkills("gzjinghe_new_" + player.playerid, skill);
					target.popup(skill);
				},
				subSkill: {
					clear: {
						charlotte: true,
						onremove(player) {
							game.countPlayer(current => current.removeAdditionalSkills("gzjinghe_new_" + player.playerid));
						},
					},
				},
			},
			//凌操
			gzdujin: {
				audio: "dujin",
				inherit: "dujin",
				filter(event, player) {
					return !event.numFixed;
				},
				content() {
					trigger.num += Math.floor(player.countCards("e") / 2) + 1;
				},
				group: "gzdujin_first",
				subSkill: {
					first: {
						audio: "dujin",
						trigger: { player: "showCharacterEnd" },
						filter(event, player) {
							if (
								game
									.getAllGlobalHistory(
										"everything",
										evt => {
											return evt.name == "showCharacter" && evt.player == player && evt.toShow.some(i => get.character(i, 3).includes("gzdujin"));
										},
										event
									)
									.indexOf(event) != 0
							)
								return false;
							return (
								game.getAllGlobalHistory("everything", evt => {
									return evt.name == "showCharacter" && evt.player.isFriendOf(player);
								})[0].player == player
							);
						},
						forced: true,
						locked: false,
						content() {
							player.addMark("xianqu_mark", 1);
						},
					},
				},
			},
			//王基
			gzqizhi: {
				audio: "qizhi",
				inherit: "qizhi",
				usable: 4,
			},
			gzjinqu: {
				audio: "jinqu",
				trigger: { player: "phaseJieshuBegin" },
				check(event, player) {
					return (
						player.getHistory("custom", evt => {
							return evt.gzqizhi == true;
						}).length >= player.countCards("h")
					);
				},
				prompt(event, player) {
					var num = player.getHistory("custom", evt => {
						return evt.gzqizhi == true;
					}).length;
					return "进趋：是否摸两张牌并将手牌弃置至" + get.cnNumber(num) + "张？";
				},
				async content(event, trigger, player) {
					await player.draw(2);
					let dh =
						player.countCards("h") -
						player.getHistory("custom", evt => {
							return evt.gzqizhi == true;
						}).length;
					if (dh > 0) {
						await player.chooseToDiscard(dh, true);
					}
				},
				ai: { combo: "gzqizhi" },
			},
			//徐荣
			gzxionghuo: {
				audio: "xinfu_xionghuo",
				enable: "phaseUse",
				filter(event, player) {
					return player.countMark("gzxionghuo_used") < 3;
				},
				filterTarget(card, player, target) {
					return target.isEnemyOf(player);
				},
				usable: 1,
				content() {
					player.addSkill("gzxionghuo_used");
					player.addMark("gzxionghuo_used", 1, false);
					player.addSkill("gzxionghuo_effect");
					const targets = player.getStorage("gzxionghuo_effect").slice().concat([target]);
					player.setStorage("gzxionghuo_effect", targets, true);
				},
				ai: {
					order: 9,
					result: { target: -1 },
				},
				subSkill: {
					used: {
						charlotte: true,
						onremove: true,
						intro: { content: "已发动过#次" },
					},
					effect: {
						charlotte: true,
						intro: { content: "已指定$" },
						trigger: {
							source: "damageBegin1",
							global: "phaseUseBegin",
						},
						filter(event, player) {
							if (!player.getStorage("gzxionghuo_effect").includes(event.player)) return false;
							return event.name === "phaseUse" || (event.card && !player.hasHistory("sourceDamage", evt => evt.player === event.player));
						},
						forced: true,
						logTarget: "player",
						async content(event, trigger, player) {
							let num = player.getStorage("gzxionghuo_effect").filter(i => i === trigger.player).length;
							if (trigger.name === "damage") {
								trigger.num += num;
							} else {
								const target = trigger.player;
								while (player.getStorage("gzxionghuo_effect").includes(target)) {
									player.unmarkAuto("gzxionghuo_effect", [target]);
								}
								while (num > 0) {
									num--;
									switch (get.rand(1, 3)) {
										case 1:
											player.line(target, "fire");
											await target.damage(1, "fire");
											target.addTempSkill("xinfu_xionghuo_disable");
											target.markAuto("xinfu_xionghuo_disable", [player]);
											break;
										case 2:
											player.line(target, "water");
											await target.loseHp();
											target.addTempSkill("xinfu_xionghuo_low");
											target.addMark("xinfu_xionghuo_low", 1, false);
											break;
										case 3:
											player.line(target, "green");
											for (const pos of ["e", "h"]) {
												await player.gainPlayerCard(target, pos, true);
											}
											break;
									}
								}
							}
						},
					},
				},
			},
			//向郎
			gzkanji: {
				audio: "dckanji",
				inherit: "dckanji",
				usable: 1,
				async content(event, trigger, player) {
					await player.showHandcards();
					const suits = player
						.getCards("h")
						.slice()
						.map(card => get.suit(card, player))
						.unique();
					if (suits.length == player.countCards("h")) {
						event.suitsLength = suits.length;
						player.addTempSkill("gzkanji_check");
						await player.draw(2);
					}
				},
				subSkill: {
					check: {
						charlotte: true,
						trigger: { player: "gainAfter" },
						filter(event, player) {
							if (event.getParent(2).name != "gzkanji") return false;
							const len = event.getParent(2).suitsLength;
							const suits = player
								.getCards("h")
								.slice()
								.map(card => get.suit(card, player))
								.unique();
							return suits.length >= 4 && len < 4;
						},
						forced: true,
						popup: false,
						content() {
							player.addTempSkill("gzkanji_hand");
							player.addMark("gzkanji_hand", 4, false);
						},
					},
					hand: {
						charlotte: true,
						onremove: true,
						intro: { content: "手牌上限+#" },
						mod: {
							maxHandcard(player, num) {
								return num + player.countMark("gzkanji_hand");
							},
						},
					},
				},
			},
			//滕胤
			gzchenjian: {
				audio: "chenjian",
				trigger: { player: "phaseZhunbeiBegin" },
				content() {
					"step 0";
					var cards = get.cards(3);
					event.cards = cards;
					player.showCards(cards, get.translation(player) + "发动了【陈见】");
					"step 1";
					var list = [];
					if (
						player.countCards("he", i => {
							return lib.filter.cardDiscardable(i, player, "gzchenjian");
						})
					)
						list.push("选项一");
					if (
						event.cards.some(i => {
							return player.hasUseTarget(i);
						})
					)
						list.push("选项二");
					if (list.length === 1) event._result = { control: list[0] };
					else if (list.length > 1)
						player
							.chooseControl(list)
							.set("choiceList", ["弃置一张牌，然后令一名角色获得与你弃置牌花色相同的牌", "使用" + get.translation(event.cards) + "中的一张牌"])
							.set("prompt", "陈见：请选择一项")
							.set("ai", () => {
								let player = _status.event.player,
									cards = _status.event.getParent().cards;
								if (
									cards.some(i => {
										return player.getUseValue(i) > 0;
									})
								)
									return "选项二";
								return "选项一";
							});
					else event.finish();
					"step 2";
					event.choosed = result.control;
					if (result.control === "cancel2") event.finish();
					else if (result.control === "选项二") event.goto(6);
					"step 3";
					if (
						player.countCards("he", i => {
							return lib.filter.cardDiscardable(i, player, "chenjian");
						})
					)
						player
							.chooseToDiscard("he", true)
							.set("ai", function (card) {
								let evt = _status.event.getParent(),
									val = evt.player.countMark("chenjian") < 2 ? 0 : -get.value(card),
									suit = get.suit(card);
								for (let i of evt.cards) {
									if (get.suit(i, false) == suit) val += get.value(i, "raw");
								}
								return val;
							})
							.set("prompt", "陈见：请弃置一张牌，然后令一名角色获得" + get.translation(event.cards) + "中花色与之相同的牌" + (event.goon ? "？" : ""));
					else if (event.choosed === "选项一") event.goto(6);
					else event.finish();
					"step 4";
					if (result.bool) {
						var suit = get.suit(result.cards[0], player);
						var cards2 = event.cards.filter(function (i) {
							return get.suit(i, false) == suit;
						});
						if (cards2.length) {
							event.cards2 = cards2;
							player.chooseTarget(true, "选择一名角色获得" + get.translation(cards2)).set("ai", function (target) {
								var att = get.attitude(_status.event.player, target);
								if (att > 0) {
									return att + Math.max(0, 5 - target.countCards("h"));
								}
								return att;
							});
						} else event.finish();
					} else event.finish();
					"step 5";
					if (result.bool) {
						var target = result.targets[0];
						player.line(target, "green");
						target.gain(event.cards2, "gain2");
					}
					event.finish();
					"step 6";
					var cards2 = cards.filter(function (i) {
						return player.hasUseTarget(i);
					});
					if (cards2.length)
						player.chooseButton(["陈见：" + (event.goon ? "是否" : "请") + "使用其中一张牌" + (event.goon ? "？" : ""), cards2], !event.goon).set("ai", function (button) {
							return player.getUseValue(button.link);
						});
					else event.finish();
					"step 7";
					if (result.bool) {
						player.chooseUseTarget(true, result.links[0], false);
					}
				},
			},
			gzxixiu: {
				audio: "xixiu",
				trigger: {
					player: "loseBegin",
					target: "useCardToTargeted",
				},
				filter(event, player) {
					if (event.name === "lose") {
						if (event.type != "discard" || event.getlx === false) return false;
						if (event.getParent(2).player === player || player.countCards("e") !== 1) return false;
						return event.cards.includes(player.getCards("e")[0]);
					}
					if (player == event.player || !player.countCards("e")) return false;
					var suit = get.suit(event.card, false);
					if (suit == "none") return false;
					return player.hasCard(function (card) {
						return get.suit(card, player) == suit;
					}, "e");
				},
				forced: true,
				content() {
					if (trigger.name === "lose") trigger.cards.remove(player.getCards("e")[0]);
					else player.draw();
				},
				ai: {
					effect: {
						target_use(card, player, target) {
							if (typeof card == "object" && player != target) {
								var suit = get.suit(card);
								if (suit == "none") return;
								if (
									player.hasCard(function (card) {
										return get.suit(card, player) == suit;
									}, "e")
								)
									return [1, 0.08];
							}
						},
					},
				},
			},
			//潘淑
			gzyaner: {
				audio: "yaner",
				inherit: "yaner",
				prompt2: "与该角色各摸一张牌",
				content() {
					game.asyncDraw([_status.currentPhase, player]);
				},
			},
			//曹真
			gzsidi: {
				audio: "sidi",
				trigger: { player: "damageEnd" },
				filter(event, player) {
					if (
						!player.hasCard(card => {
							if (get.position(card) === "h" && _status.connectMode) return true;
							return !player.getExpansions("gzsidi").some(cardx => get.type2(cardx) === get.type2(card));
						}, "he")
					)
						return false;
					return player.isFriendOf(event.player);
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseCard(
							get.prompt("gzsidi"),
							(card, player) => {
								return !player.getExpansions("gzsidi").some(cardx => get.type2(cardx) === get.type2(card));
							},
							"将一张与武将牌上的“驭”类别均不同的牌置于武将牌上",
							"he"
						)
						.set("ai", card => {
							return 6 - get.value(card);
						})
						.forResult();
				},
				content() {
					player.addToExpansion(event.cards, player, "give").gaintag.add("gzsidi");
				},
				intro: {
					content: "expansion",
					markcount: "expansion",
				},
				marktext: "驭",
				onremove(player, skill) {
					const cards = player.getExpansions(skill);
					if (cards.length) player.loseToDiscardpile(cards);
				},
				group: "gzsidi_effect",
				subSkill: {
					effect: {
						audio: "sidi",
						trigger: { global: "phaseBegin" },
						filter(event, player) {
							if (!event.player.isEnemyOf(player)) return false;
							return player.getExpansions("gzsidi").length;
						},
						async cost(event, trigger, player) {
							event.result = await player
								.chooseButton(["###" + get.prompt("sidi", trigger.player) + '###<div class="text center">将至多三张“驭”置入弃牌堆，然后执行等量条效果</div>', player.getExpansions("gzsidi")], [1, 3])
								.set("ai", button => {
									const player = get.player(),
										target = get.event().getTrigger().player;
									if (get.attitude(player, target) >= 0) return 0;
									return ["equip", "trick", "basic"].indexOf(get.type2(button.link)) + 2;
								})
								.forResult();
							if (event.result?.bool && event.result.links?.length) {
								event.result.cards = event.result.links;
							}
						},
						logTarget: "player",
						async content(event, trigger, player) {
							const cards = event.cards,
								target = trigger.player;
							await player.loseToDiscardpile(cards);
							let num = cards.length,
								result;
							let list = cards.slice().map(i => get.type2(i, false));
							if (num !== 3) list.add("cancel2");
							result = await player
								.chooseControl(list)
								.set("ai", () => {
									return get.event().controls.randomGet();
								})
								.set("prompt", (num === 3 ? "" : "是否") + "封禁其本回合一种类别的牌" + (num === 3 ? "" : "？（还可选择" + num + "次）"))
								.forResult();
							if (result.control !== "cancel2") {
								num--;
								player.popup(result.control);
								game.log(player, "选择了", "#g" + get.translation(result.control));
								target.addTempSkill("gzsidi_ban");
								target.markAuto("gzsidi_ban", [result.control]);
								if (!num) return event.finish();
							}
							let skills = target.getStockSkills(null, true);
							if (skills.length) {
								if (num !== 2) skills.add("cancel2");
								result = await player
									.chooseControl(skills)
									.set("ai", () => {
										return get.event().controls.randomGet();
									})
									.set("prompt", (num === 2 ? "" : "是否") + "封禁其明置武将牌上的一个技能" + (num === 3 ? "" : "？（还可选择" + num + "次）"))
									.forResult();
								if (result.control !== "cancel2") {
									num--;
									player.popup(result.control);
									game.log(player, "选择了", "#g" + get.translation(result.control));
									target.addTempSkill("gzsidi_disable");
									target.disableSkill("gzsidi_disable", result.control);
									if (!num) return event.finish();
								}
							}
							if (game.hasPlayer(target => target !== player && target.isDamaged() && target.isFriendOf(player))) {
								result = await player
									.chooseTarget("是否令一名与你势力相同的其他角色回复1点体力？", (card, player, target) => {
										return target !== player && target.isDamaged() && target.isFriendOf(player);
									})
									.set("ai", target => {
										const player = get.player();
										return get.recoverEffect(target, player, player);
									})
									.forResult();
								if (result.bool) {
									player.line(result.targets[0]);
									await result.targets[0].recover();
								}
							}
						},
					},
					ban: {
						charlotte: true,
						onremove: true,
						intro: { content: "不能使用$牌" },
						mod: {
							cardEnabled(card, player) {
								if (player.getStorage("gzsidi_ban").includes(get.type2(card))) {
									var hs = player.getCards("h"),
										cards = [card];
									if (Array.isArray(card.cards)) cards.addArray(card.cards);
									for (var i of cards) {
										if (hs.includes(i)) return false;
									}
								}
							},
							cardSavable(card, player) {
								if (player.getStorage("gzsidi_ban").includes(get.type2(card))) {
									var hs = player.getCards("h"),
										cards = [card];
									if (Array.isArray(card.cards)) cards.addArray(card.cards);
									for (var i of cards) {
										if (hs.includes(i)) return false;
									}
								}
							},
						},
					},
					disable: {
						charlotte: true,
						onremove(player, skill) {
							player.enableSkill(skill);
						},
					},
				},
			},
			//甘夫人
			gzshushen_new: {
				audio: "shushen",
				trigger: { player: "recoverEnd" },
				getIndex: event => event.num || 1,
				preHidden: true,
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget(get.prompt2("gzshushen_new"), lib.filter.notMe)
						.set("ai", target => {
							const player = get.player();
							return get.effect(target, { name: "draw" }, player, player) * (1 + !Boolean(target.countCards("h")));
						})
						.setHiddenSkill("gzshushen_new")
						.forResult();
				},
				content() {
					event.targets[0].draw(Boolean(event.targets[0].countCards("h")) ? 1 : 2);
				},
				ai: {
					threaten: 0.8,
					expose: 0.1,
				},
			},
			//徐盛
			gzyicheng_new: {
				audio: "yicheng",
				trigger: { global: ["useCardToPlayered", "useCardToTargeted"] },
				filter(event, player, name) {
					const bool = name === "useCardToPlayered";
					if (bool && !event.isFirstTarget) return false;
					return event.card.name == "sha" && event[bool ? "player" : "target"].isFriendOf(player);
				},
				logTarget(event, player, name) {
					return event[name === "useCardToPlayered" ? "player" : "target"];
				},
				async content(event, trigger, player) {
					await event.targets[0].draw();
					await event.targets[0].chooseToDiscard("he", true);
				},
			},
			//陆逊
			gzduoshi: {
				audio: "duoshi",
				trigger: { player: "phaseUseBegin" },
				filter(event, player) {
					return player.hasUseTarget(new lib.element.VCard({ name: "yiyi" }));
				},
				direct: true,
				preHidden: true,
				content() {
					player.chooseUseTarget(get.prompt2(event.name), new lib.element.VCard({ name: "yiyi" }), false).set("hiddenSkill", event.name).logSkill = event.name;
				},
			},
			//臧霸
			gzhengjiang: {
				audio: "hengjiang",
				trigger: { player: "damageEnd" },
				preHidden: true,
				check(event, player) {
					return get.attitude(player, _status.currentPhase) < 0 || !_status.currentPhase.needsToDiscard(2);
				},
				filter(event) {
					return _status.currentPhase && _status.currentPhase.isIn() && event.num > 0;
				},
				logTarget() {
					return _status.currentPhase;
				},
				content() {
					const source = _status.currentPhase;
					const num = Math.max(source.countVCards("e"), 1);
					if (source.hasSkill("gzhengjiang_effect")) {
						source.storage.gzhengjiang_effect += num;
						source.storage.gzhengjiang3.add(player);
						source.updateMarks();
					} else {
						source.storage.gzhengjiang3 = [player];
						source.storage.gzhengjiang_effect = num;
						source.addTempSkill("gzhengjiang_effect");
					}
				},
				ai: { maixie_defend: true },
				subSkill: {
					effect: {
						mark: true,
						charlotte: true,
						intro: { content: "手牌上限-#" },
						mod: {
							maxHandcard(player, num) {
								return num - player.storage.gzhengjiang_effect;
							},
						},
						onremove(player) {
							delete player.storage.gzhengjiang_effect;
							delete player.storage.gzhengjiang3;
						},
						trigger: { player: "phaseDiscardEnd" },
						filter(event, player) {
							if (event.cards?.length) return false;
							return player.storage.gzhengjiang3.some(target => target?.isIn() && target.countCards("h") < target.maxHp);
						},
						forced: true,
						popup: false,
						async content(event, trigger, player) {
							const players = player.storage.gzhengjiang3;
							for (var i = 0; i < players.length; i++) {
								const target = players[i];
								if (target.isIn() && target.countCards("h") < target.maxHp) {
									target.logSkill("gzhengjiang", player);
									await target.drawTo(target.maxHp);
								}
							}
						},
					},
				},
			},
			//宗预
			gzchengshang: {
				audio: "chengshang",
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					if (player.hasHistory("sourceDamage", evt => evt.card === event.card)) return false;
					return event.targets?.some(i => i.isIn() && i.countCards("he"));
				},
				usable: 1,
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget(get.prompt2("gzchengshang"), (card, player, target) => {
							return get.event().getTrigger().targets.includes(target) && target.countCards("he");
						})
						.set("ai", target => {
							var att = get.attitude(_status.event.player, target);
							if (att > 0) return Math.sqrt(att) / 10;
							return 5 - att;
						})
						.forResult();
				},
				async content(event, trigger, player) {
					const result = await event.targets[0]
						.chooseToGive(player, "he", true, "give")
						.set("ai", card => {
							const player = get.player(),
								source = get.event().getParent().player,
								cardx = get.event().getTrigger().card;
							if (get.suit(card) === get.suit(cardx) && get.number(card) === get.number(cardx)) {
								return 1145141919810 * get.sgn(-get.attitude(player, source));
							}
							return -get.value(card);
						})
						.forResult();
					if (result?.bool && result.cards?.length) {
						const card = result.cards[0];
						if (get.suit(card) === get.suit(trigger.card) && get.number(card) === get.number(trigger.card)) {
							await player.removeSkills("gzchengshang");
						}
					}
				},
			},
			//官盗2023
			fakexiaoguo: {
				audio: "xiaoguo",
				audioname2: { gz_jun_caocao: "jianan_xiaoguo" },
				trigger: { global: "phaseZhunbeiBegin" },
				filter(event, player) {
					return (
						event.player != player &&
						player.countCards("h", card => {
							if (_status.connectMode) return true;
							return get.type(card) == "basic" && lib.filter.cardDiscardable(card, player);
						})
					);
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseToDiscard(
							get.prompt2("fakexiaoguo", trigger.player),
							(card, player) => {
								return get.type(card) == "basic";
							},
							[1, Infinity]
						)
						.set("complexSelect", true)
						.set("ai", card => {
							const player = get.event("player"),
								target = get.event().getTrigger().player;
							const effect = get.damageEffect(target, player, player);
							const cards = target.getCards("e", card => get.attitude(player, target) * get.value(card, target) < 0);
							if (effect <= 0 && !cards.length) return 0;
							if (ui.selected.cards.length > cards.length - (effect <= 0 ? 1 : 0)) return 0;
							return 1 / (get.value(card) || 0.5);
						})
						.set("logSkill", ["fakexiaoguo", trigger.player])
						.setHiddenSkill("fakexiaoguo")
						.forResult();
				},
				popup: false,
				preHidden: true,
				async content(event, trigger, player) {
					const num = trigger.player.countCards("e"),
						num2 = event.cards.length;
					await player.discardPlayerCard(trigger.player, "e", num2, true);
					if (num2 > num) await trigger.player.damage();
				},
			},
			fakeduanbing: {
				audio: "duanbing",
				inherit: "reduanbing",
				preHidden: ["fakeduanbing_sha"],
				group: ["fakeduanbing", "fakeduanbing_sha"],
				subSkill: {
					sha: {
						audio: "duanbing",
						trigger: { player: "useCardToPlayered" },
						filter(event, player) {
							return event.card.name == "sha" && !event.getParent().directHit.includes(event.target) && event.targets.length == 1;
						},
						forced: true,
						logTarget: "target",
						content() {
							var id = trigger.target.playerid;
							var map = trigger.getParent().customArgs;
							if (!map[id]) map[id] = {};
							if (typeof map[id].shanRequired == "number") map[id].shanRequired++;
							else map[id].shanRequired = 2;
						},
						ai: {
							directHit_ai: true,
							skillTagFilter(player, tag, arg) {
								if (!arg || !arg.card || !arg.target || arg.card.name != "sha" || arg.target.countCards("h", "shan") > 1 || get.distance(player, arg.target) > 1) return false;
							},
						},
					},
				},
			},
			fakeduoshi: {
				audio: "duoshi",
				global: "fakeduoshi_global",
				subSkill: {
					global: {
						audio: "duoshi",
						forceaudio: true,
						enable: "phaseUse",
						filter(event, player) {
							const info = get.info("fakeduoshi").subSkill.global;
							return (
								game.hasPlayer(target => {
									return info.filterTarget(null, player, target);
								}) &&
								player.countCards("hs", card => {
									return info.filterCard(card, player);
								})
							);
						},
						filterTarget(card, player, target) {
							return target.hasSkill("fakeduoshi") && !target.isTempBanned("fakeduoshi") && target.isFriendOf(player);
						},
						filterCard(card, player) {
							if (!game.checkMod(card, player, "unchanged", "cardEnabled2", player)) return false;
							return get.color(card) == "red" && player.hasUseTarget(get.autoViewAs({ name: "yiyi" }, [card]));
						},
						discard: false,
						lose: false,
						delay: false,
						line: false,
						prompt: "选择一张红色手牌当作【以逸待劳】使用，并选择一名拥有【度势】的角色",
						async content(event, trigger, player) {
							const target = event.target;
							target.tempBanSkill("fakeduoshi", "roundStart", false);
							let { result } = await player.chooseUseTarget(true, { name: "yiyi" }, event.cards);
							if (result.bool && result.targets.length && target.isNotMajor()) {
								const num = result.targets.length,
									str = "将" + get.cnNumber(num) + "张手牌当作不可被响应的【火烧连营】使用？";
								const {
									result: { bool, targets },
								} = await player
									.chooseTarget("是否令一名友方角色" + str, (card, player, target) => {
										return (
											target.isFriendOf(player) &&
											target.countCards("h", card => {
												if (!target.hasUseTarget(get.autoViewAs({ name: "huoshaolianying" }, [card]))) return false;
												return target != player || game.checkMod(card, player, "unchanged", "cardEnabled2", player);
											}) >= get.event("num")
										);
									})
									.set("num", num)
									.set("ai", target => {
										return target.getUseValue(new lib.element.VCard({ name: "huoshaolianying" }));
									});
								if (bool) {
									player.line(targets[0]);
									game.broadcastAll(num => {
										lib.skill.fakeduoshi_backup.selectCard = num;
										lib.skill.fakeduoshi.subSkill.backup.selectCard = num;
									}, num);
									await targets[0]
										.chooseToUse()
										.set("openskilldialog", "度势：是否" + str)
										.set("norestore", true)
										.set("_backupevent", "fakeduoshi_backup")
										.set("custom", {
											add: {},
											replace: { window() {} },
										})
										.set("addCount", false)
										.set("oncard", () => _status.event.directHit.addArray(game.players))
										.backup("fakeduoshi_backup");
								}
							}
						},
						ai: {
							order(item, player) {
								const card = new lib.element.VCard({ name: "huoshaolianying" });
								return get.order(card, player) + 0.1;
							},
							result: { target: 1 },
						},
					},
					backup: {
						filterCard: true,
						position: "hs",
						check(card) {
							return 7 - get.value(card);
						},
						log: false,
						viewAs: { name: "huoshaolianying" },
						precontent() {
							delete event.result.skill;
						},
					},
				},
			},
			fakehanzhan: {
				audio: "hanzhan",
				trigger: {
					player: ["chooseToCompareAfter", "compareMultipleAfter"],
					target: ["chooseToCompareAfter", "compareMultipleAfter"],
				},
				filter(event, player) {
					if (event.preserve) return false;
					const list = [event.player, event.target];
					const targets = list.slice().filter(i => (event.num1 - event.num2) * get.sgn(0.5 - list.indexOf(i)) <= 0);
					return targets.some(i => {
						const target = list[1 - list.indexOf(i)];
						return target.hasCard(card => {
							return lib.filter.canBeGained(card, i, target);
						}, "e");
					});
				},
				async cost(event, trigger, player) {
					let users = [];
					const list = [trigger.player, trigger.target];
					let targets = list.slice().filter(i => (trigger.num1 - trigger.num2) * get.sgn(0.5 - list.indexOf(i)) <= 0);
					targets = targets
						.filter(i => {
							const target = list[1 - list.indexOf(i)];
							return target.hasCard(card => {
								return lib.filter.canBeGained(card, i, target);
							}, "e");
						})
						.sortBySeat(player);
					for (const i of targets) {
						const aim = list[1 - list.indexOf(i)];
						const {
							result: { bool },
						} = await i.chooseBool(get.prompt("fakehanzhan"), "获得" + get.translation(aim) + "装备区的一张牌").set(
							"choice",
							aim.hasCard(card => {
								return get.value(card, aim) * get.attitude(i, aim) < 0;
							}, "e")
						);
						if (bool) users.push(i);
					}
					event.result = { bool: Boolean(users.length), targets: users };
				},
				logLine: false,
				async content(event, trigger, player) {
					const list = [trigger.player, trigger.target];
					let targets = list.slice().filter(i => (trigger.num1 - trigger.num2) * get.sgn(0.5 - list.indexOf(i)) <= 0);
					targets = targets
						.filter(i => {
							const target = list[1 - list.indexOf(i)];
							return target.hasCard(card => {
								return lib.filter.canBeGained(card, i, target);
							}, "e");
						})
						.sortBySeat(player);
					for (const i of targets) {
						const aim = list[1 - list.indexOf(i)];
						i.line(aim, "green");
						await i.gainPlayerCard(aim, "e", true);
					}
				},
			},
			fakeshuangxiong: {
				audio: "shuangxiong",
				subfrequent: ["tiandu"],
				group: ["fakeshuangxiong_effect", "fakeshuangxiong_tiandu"],
				subSkill: {
					effect: {
						audio: "shuangxiong1",
						inherit: "shuangxiong1",
						content() {
							player.judge().set("callback", get.info("fakeshuangxiong").subSkill.effect.callback);
							trigger.changeToZero();
						},
						callback() {
							player.addTempSkill("shuangxiong2");
							player.markAuto("shuangxiong2", [event.judgeResult.color]);
						},
					},
					tiandu: {
						audio: "shuangxiong",
						inherit: "tiandu",
						filter(event, player) {
							return _status.currentPhase == player && get.info("tiandu").filter(event, player);
						},
					},
				},
			},
			fakeyicheng: {
				audio: "yicheng",
				inherit: "yicheng",
				async content(event, trigger, player) {
					const target = trigger.target;
					await target.draw();
					await target.chooseToUse(function (card) {
						if (get.type(card) != "equip") return false;
						return lib.filter.cardEnabled(card, _status.event.player, _status.event);
					}, "疑城：是否使用装备牌？");
					if (!target.storage.fakeyicheng) {
						target.when({ global: "phaseEnd" }).then(() => {
							player.chooseToDiscard("he", player.countMark("fakeyicheng"), true);
							delete player.storage.fakeyicheng;
						});
					}
					target.addMark("fakeyicheng", 1, false);
				},
			},
			fakefenming: {
				audio: "fenming",
				enable: "phaseUse",
				filter(event, player) {
					return player.isLinked();
				},
				filterTarget(card, player, target) {
					return target.isLinked();
				},
				selectTarget: -1,
				usable: 1,
				multiline: true,
				multitarget: true,
				async content(event, trigger, player) {
					for (const target of event.targets) {
						if (player == target) await player.chooseToDiscard(true, "he");
						else await player.discardPlayerCard(true, "he", target);
					}
				},
				ai: {
					order(item, player) {
						return get.order({ name: "sha" }, player) + 0.1;
					},
					result: {
						target(player, target) {
							return get.sgn(get.attitude(player, target)) * get.effect(target, { name: "guohe_copy2" }, player, player);
						},
					},
				},
			},
			fakebaoling: {
				audio: "baoling",
				inherit: "baoling",
				init(player) {
					player.checkMainSkill("fakebaoling");
				},
				content() {
					"step 0";
					player.removeCharacter(1);
					"step 1";
					player.gainMaxHp(3);
					player.recover(3);
					"step 2";
					player.addSkills("fakebenghuai");
				},
				derivation: "fakebenghuai",
			},
			fakebenghuai: {
				audio: "benghuai",
				inherit: "benghuai",
				async content(event, trigger, player) {
					const {
						result: { control },
					} = await player
						.chooseControl("体力", "上限", "背水！")
						.set("prompt", "崩坏：请选择一项")
						.set("choiceList", ["失去1点体力", "减1点体力上限", "背水！依次执行前两项，然后执行一个额外的摸牌阶段"])
						.set("ai", () => {
							const player = get.event("player");
							if (player.maxHp > 1 && (player.getHp() == 2 || !player.countCards("h"))) return "背水！";
							return player.isDamaged() ? "上限" : "体力";
						});
					player.popup(control);
					game.log(player, "选择了", "#g" + control);
					if (control != "上限") await player.loseHp();
					if (control != "体力") await player.loseMaxHp();
					if (control == "背水！") {
						const next = player.phaseDraw();
						event.next.remove(next);
						trigger.getParent().next.push(next);
					}
				},
			},
			fakediaodu: {
				audio: "diaodu",
				inherit: "xindiaodu",
				group: "fakediaodu_use",
				subSkill: {
					use: {
						trigger: { global: "useCard" },
						filter(event, player) {
							if (!lib.skill.xindiaodu.isFriendOf(player, event.player) || !(event.targets || []).includes(player)) return false;
							return (player == event.player || player.hasSkill("fakediaodu")) && !event.player.getStorage("fakediaodu_temp").includes(get.type2(event.card));
						},
						direct: true,
						async content(event, trigger, player) {
							const target = trigger.target,
								next = await target.chooseBool(get.prompt("fakediaodu"), "摸一张牌？");
							if (player.hasSkill("fakediaodu")) next.set("frequentSkill", "fakediaodu");
							if (player == trigger.player) next.setHiddenSkill("fakediaodu");
							const {
								result: { bool },
							} = next;
							if (bool) {
								player.logSkill("fakediaodu", target);
								target.draw("nodelay");
								target.addTempSkill("fakediaodu_temp");
								target.markAuto("fakediaodu_temp", [get.type2(trigger.card)]);
							}
						},
					},
					temp: {
						charlotte: true,
						onremove: true,
					},
				},
			},
			fakeyigui: {
				audio: "yigui",
				hiddenCard(player, name) {
					if (["shan", "wuxie"].includes(name) || !["basic", "trick"].includes(get.type(name))) return false;
					return lib.inpile.includes(name) && player.getStorage("fakeyigui").length && !player.getStorage("fakeyigui2").includes(get.type2(name));
				},
				enable: "chooseToUse",
				filter(event, player) {
					if (event.type == "wuxie" || event.type == "respondShan") return false;
					const storage = player.getStorage("fakeyigui"),
						storage2 = player.getStorage("fakeyigui2");
					if (!storage.length || storage2.length > 1) return false;
					if (event.type == "dying") {
						if (storage2.includes("basic")) return false;
						if (!event.filterCard({ name: "tao" }, player, event) && !event.filterCard({ name: "jiu" }, player, event)) return false;
						const target = event.dying;
						return (
							target.identity == "unknown" ||
							target.identity == "ye" ||
							storage.some(i => {
								var group = get.character(i, 1);
								if (group == "ye" || target.identity == group) return true;
								var double = get.is.double(i, true);
								if (double && double.includes(target.identity)) return true;
							})
						);
					}
					return get
						.inpileVCardList(info => {
							const name = info[2];
							if (storage2.includes(get.type(name))) return false;
							return get.type(name) == "basic" || get.type(name) == "trick";
						})
						.some(cardx => {
							const card = { name: cardx[2], nature: cardx[3] },
								info = get.info(card);
							return storage.some(character => {
								if (!lib.filter.filterCard(card, player, event)) return false;
								if (event.filterCard && !event.filterCard(card, player, event)) return false;
								const group = get.character(character, 1),
									double = get.is.double(character, true);
								if (info.changeTarget) {
									const list = game.filterPlayer(current => player.canUse(card, current));
									for (let i = 0; i < list.length; i++) {
										let giveup = false,
											targets = [list[i]];
										info.changeTarget(player, targets);
										for (let j = 0; j < targets.length; j++) {
											if (group != "ye" && targets[j].identity != "unknown" && targets[j].identity != "ye" && targets[j].identity != group && (!double || !double.includes(targets[j].identity))) {
												giveup = true;
												break;
											}
										}
										if (giveup) continue;
										if (!giveup) return true;
									}
									return false;
								}
								return game.hasPlayer(current => {
									return event.filterTarget(card, player, current) && (group == "ye" || current.identity == "unknown" || current.identity == "ye" || current.identity == group || (double && double.includes(current.identity)));
								});
							});
						});
				},
				chooseButton: {
					select: 2,
					dialog(event, player) {
						var dialog = ui.create.dialog("役鬼", "hidden");
						dialog.add([player.getStorage("fakeyigui"), "character"]);
						const list = get.inpileVCardList(info => {
							const name = info[2];
							if (player.getStorage("fakeyigui2").includes(get.type(name))) return false;
							return get.type(name) == "basic" || get.type(name) == "trick";
						});
						dialog.add([list, "vcard"]);
						return dialog;
					},
					filter(button, player) {
						var evt = _status.event.getParent("chooseToUse");
						if (!ui.selected.buttons.length) {
							if (typeof button.link != "string") return false;
							if (evt.type == "dying") {
								if (evt.dying.identity == "unknown" || evt.dying.identity == "ye") return true;
								var double = get.is.double(button.link, true);
								return evt.dying.identity == lib.character[button.link][1] || lib.character[button.link][1] == "ye" || (double && double.includes(evt.dying.identity));
							}
							return true;
						} else {
							if (typeof ui.selected.buttons[0].link != "string") return false;
							if (typeof button.link != "object") return false;
							var name = button.link[2];
							if (player.getStorage("fakeyigui2").includes(get.type(name))) return false;
							var card = { name: name };
							if (button.link[3]) card.nature = button.link[3];
							var info = get.info(card);
							var group = lib.character[ui.selected.buttons[0].link][1];
							var double = get.is.double(ui.selected.buttons[0].link, true);
							if (evt.type == "dying") return evt.filterCard(card, player, evt);
							if (!lib.filter.filterCard(card, player, evt)) return false;
							else if (evt.filterCard && !evt.filterCard(card, player, evt)) return false;
							if (info.changeTarget) {
								var list = game.filterPlayer(function (current) {
									return player.canUse(card, current);
								});
								for (var i = 0; i < list.length; i++) {
									var giveup = false;
									var targets = [list[i]];
									info.changeTarget(player, targets);
									for (var j = 0; j < targets.length; j++) {
										if (group != "ye" && targets[j].identity != "unknown" && targets[j].identity != "ye" && targets[j].identity != group && (!double || !double.includes(targets[j].identity))) {
											giveup = true;
											break;
										}
									}
									if (giveup) continue;
									if (giveup == false) return true;
								}
								return false;
							} else
								return game.hasPlayer(function (current) {
									return evt.filterTarget(card, player, current) && (group == "ye" || current.identity == "unknown" || current.identity == "ye" || current.identity == group || (double && double.includes(current.identity)));
								});
						}
					},
					check(button) {
						if (ui.selected.buttons.length) {
							var evt = _status.event.getParent("chooseToUse");
							var name = button.link[2];
							var group = lib.character[ui.selected.buttons[0].link][1];
							var double = get.is.double(ui.selected.buttons[0].link, true);
							var player = _status.event.player;
							if (evt.type == "dying") {
								if (evt.dying != player && get.effect(evt.dying, { name: name }, player, player) <= 0) return 0;
								if (name == "jiu") return 2.1;
								return 2;
							}
							if (!["tao", "juedou", "guohe", "shunshou", "wuzhong", "xietianzi", "yuanjiao", "taoyuan", "wugu", "wanjian", "nanman", "huoshaolianying"].includes(name)) return 0;
							if (["taoyuan", "wugu", "wanjian", "nanman", "huoshaolianying"].includes(name)) {
								var list = game.filterPlayer(function (current) {
									return (group == "ye" || current.identity == "unknown" || current.identity == "ye" || current.identity == group || (double && double.includes(current.identity))) && player.canUse({ name: name }, current);
								});
								var num = 0;
								for (var i = 0; i < list.length; i++) {
									num += get.effect(list[i], { name: name }, player, player);
								}
								if (num <= 0) return 0;
								if (list.length > 1) return (1.7 + Math.random()) * Math.max(num, 1);
							}
						}
						return 1 + Math.random();
					},
					backup(links, player) {
						var name = links[1][2],
							nature = links[1][3] || null;
						var character = links[0],
							group = lib.character[character][1];
						var next = {
							character: character,
							group: group,
							filterCard: () => false,
							selectCard: -1,
							popname: true,
							audio: "yigui",
							viewAs: {
								name: name,
								nature: nature,
								isCard: true,
							},
							filterTarget(card, player, target) {
								var xx = lib.skill.fakeyigui_backup;
								var evt = _status.event;
								var group = xx.group;
								var double = get.is.double(xx.character, true);
								var info = get.info(card);
								if (!(info.singleCard && ui.selected.targets.length) && group != "ye" && target.identity != "unknown" && target.identity != "ye" && target.identity != group && (!double || !double.includes(target.identity))) return false;
								if (info.changeTarget) {
									var targets = [target];
									info.changeTarget(player, targets);
									for (var i = 0; i < targets.length; i++) {
										if (group != "ye" && targets[i].identity != "unknown" && targets[i].identity != "ye" && targets[i].identity != group && (!double || !double.includes(targets[i].identity))) return false;
									}
								}
								if (evt._backup && evt._backup.filterTarget) return evt._backup.filterTarget(card, player, target);
								return lib.filter.filterTarget(card, player, target);
							},
							onuse(result, player) {
								var character = lib.skill.fakeyigui_backup.character;
								player.flashAvatar("fakeyigui", character);
								player.unmarkAuto("fakeyigui", [character]);
								_status.characterlist.add(character);
								game.log(player, "移去了一张", "#g“魂（" + get.translation(character) + "）”");
								if (!player.storage.fakeyigui2) {
									player.when({ global: "phaseBefore" }).then(() => delete player.storage.fakeyigui2);
								}
								player.markAuto("fakeyigui2", [get.type(result.card.name)]);
							},
						};
						return next;
					},
					prompt(links, player) {
						var name = links[1][2],
							character = links[0],
							nature = links[1][3];
						return "移除「" + get.translation(character) + "」并视为使用" + (get.translation(nature) || "") + get.translation(name);
					},
				},
				ai: {
					order: () => 1 + 10 * Math.random(),
					result: { player: 1 },
				},
				group: "fakeyigui_init",
				marktext: "魂",
				intro: {
					onunmark(storage) {
						_status.characterlist.addArray(storage);
						storage = [];
					},
					mark(dialog, storage, player) {
						if (storage && storage.length) {
							if (player.isUnderControl(true)) dialog.addSmall([storage, "character"]);
							else return "共有" + get.cnNumber(storage.length) + "张“魂”";
						} else return "没有“魂”";
					},
					content(storage) {
						return "共有" + get.cnNumber(storage.length) + "张“魂”";
					},
				},
				gainHun(player, num) {
					const list = _status.characterlist.randomGets(num);
					if (list.length) {
						_status.characterlist.removeArray(list);
						player.markAuto("fakeyigui", list);
						get.info("rehuashen").drawCharacter(player, list);
						game.log(player, "获得了" + get.cnNumber(list.length) + "张", "#g“魂”");
					}
				},
				subSkill: {
					backup: {},
					init: {
						audio: "fakeyigui",
						trigger: { player: "showCharacterAfter" },
						filter(event, player) {
							if (!event.toShow.some(i => get.character(i, 3).includes("fakeyigui"))) return false;
							return (
								game
									.getAllGlobalHistory(
										"everything",
										evt => {
											return evt.name == "showCharacter" && evt.player == player && evt.toShow.some(i => get.character(i, 3).includes("fakeyigui"));
										},
										event
									)
									.indexOf(event) == 0
							);
						},
						forced: true,
						locked: false,
						content() {
							get.info("fakeyigui").gainHun(player, 2);
						},
					},
				},
			},
			fakejihun: {
				audio: "jihun",
				inherit: "jihun",
				content() {
					get.info("fakeyigui").gainHun(player, 1);
				},
				ai: { combo: "fakeyigui" },
				group: "fakejihun_zhiheng",
				subSkill: {
					zhiheng: {
						audio: "jihun",
						trigger: { player: "phaseZhunbeiBegin" },
						filter(event, player) {
							return player.getStorage("fakeyigui").length;
						},
						async cost(event, trigger, player) {
							const {
								result: { bool, links },
							} = await player.chooseButton([get.prompt("fakejihun"), '<div class="text center">弃置至多两张“魂”，然后获得等量的“魂”</div>', [player.getStorage("fakeyigui"), "character"]], [1, 2]).set("ai", button => {
								const getNum = character => {
									return (
										game.countPlayer(target => {
											const group = get.character(character, 1);
											if (group == "ye" || target.identity == group) return true;
											const double = get.is.double(character, true);
											if (double && double.includes(target.identity)) return true;
										}) + 1
									);
								};
								return game.countPlayer() - getNum(button.link);
							});
							event.result = { bool: bool, cost_data: links };
						},
						async content(event, trigger, player) {
							player.unmarkAuto("fakeyigui", event.cost_data);
							_status.characterlist.addArray(event.cost_data);
							game.log(player, "移除了" + get.cnNumber(event.cost_data.length) + "张", "#g“魂”");
							get.info("fakeyigui").gainHun(player, event.cost_data.length);
						},
					},
				},
			},
			fakejueyan: {
				mainSkill: true,
				init(player) {
					if (player.checkMainSkill("fakejueyan")) player.removeMaxHp();
				},
				audio: "drlt_jueyan",
				derivation: "fakejizhi",
				trigger: { player: "phaseZhunbeiBegin" },
				async cost(event, trigger, player) {
					const {
						result: { control },
					} = await player
						.chooseControl("判定区", "装备区", "手牌区", "cancel2")
						.set("prompt", "###" + get.prompt("fakejueyan") + '###<div class="text center">于本回合结束阶段弃置一个区域的所有牌，然后…</div>')
						.set("choiceList", ["判定区：跳过判定阶段，获得〖集智〗直到回合结束", "装备区：摸三张牌，本回合手牌上限+3", "手牌区：本回合使用【杀】的额定次数+3"])
						.set("ai", () => {
							const player = get.event("player");
							if (player.countCards("j", { type: "delay" })) return "判定区";
							if (player.countCards("h") < 3) return "装备区";
							if (
								player.countCards("hs", card => {
									return get.name(card) == "sha" && player.hasUseTarget(card);
								}) > player.getCardUsable("sha")
							)
								return "手牌区";
							return "判定区";
						});
					event.result = { bool: control != "cancel2", cost_data: control };
				},
				async content(event, trigger, player) {
					const position = { 判定区: "j", 装备区: "e", 手牌区: "h" }[event.cost_data];
					switch (position) {
						case "j":
							player.skip("phaseJudge");
							player.addTempSkills("fakejizhi");
							break;
						case "e":
							await player.draw(3);
							player.addTempSkill("drlt_jueyan3");
							break;
						case "h":
							player.addTempSkill("drlt_jueyan1");
							break;
					}
					player
						.when("phaseJieshuBegin")
						.then(() => {
							if (player.countCards(pos)) player.discard(player.getCards(pos));
						})
						.vars({ pos: position });
				},
			},
			fakejizhi: {
				audio: "rejizhi",
				audioname2: { gz_lukang: "rejizhi_lukang" },
				inherit: "jizhi",
			},
			fakequanji: {
				audio: "gzquanji",
				inherit: "gzquanji",
				filter(event, player, name) {
					return !player.hasHistory("useSkill", evt => {
						return evt.skill == "fakequanji" && evt.event.triggername == name;
					});
				},
				content() {
					"step 0";
					const num = Math.max(1, Math.min(player.maxHp, player.getExpansions("fakequanji").length));
					event.num = num;
					player.draw(num);
					"step 1";
					var hs = player.getCards("he");
					if (hs.length > 0) {
						if (hs.length <= event.num) event._result = { bool: true, cards: hs };
						else player.chooseCard("he", true, "选择" + get.cnNumber(event.num) + "张牌作为“权”", event.num);
					} else event.finish();
					"step 2";
					if (result.bool) {
						var cs = result.cards;
						player.addToExpansion(cs, player, "give").gaintag.add("fakequanji");
					}
				},
				mod: {
					maxHandcard(player, num) {
						return num + player.getExpansions("fakequanji").length;
					},
				},
				ai: {
					notemp: true,
				},
			},
			fakepaiyi: {
				audio: "gzpaiyi",
				enable: "phaseUse",
				filterTarget: true,
				usable: 1,
				async content(event, trigger, player) {
					const target = event.target;
					const {
						result: { junling, targets },
					} = await player.chooseJunlingFor(target);
					if (junling) {
						const str = get.translation(player),
							num = get.cnNumber(player.getExpansions("fakequanji").length);
						const {
							result: { index },
						} = await target
							.chooseJunlingControl(player, junling, targets)
							.set("prompt", "排异")
							.set("choiceList", ["执行此军令，然后" + str + "摸" + num + "张牌并将一张“权”置入弃牌堆", "不执行此军令，然后" + str + "可以对至多" + num + "名与你势力相同的角色各造成1点伤害并移去等量的“权”"])
							.set("ai", () => {
								const all = player.getExpansions("fakequanji").length;
								const effect = get.junlingEffect(player, junling, target, targets, target);
								const eff1 = effect - get.effect(player, { name: "draw" }, player, target) * all;
								const eff2 = ((source, player, num) => {
									let targets = game
										.filterPlayer(current => {
											return current.isFriendOf(player) && get.damageEffect(current, source, source) > 0 && get.damageEffect(current, source, player) < 0;
										})
										.sort((a, b) => {
											return (get.damageEffect(b, source, source) > 0 - get.damageEffect(b, source, player)) - (get.damageEffect(a, source, source) > 0 - get.damageEffect(a, source, player));
										})
										.slice(0, num);
									return targets.reduce((sum, target) => {
										return sum + (get.damageEffect(target, source, source) - get.damageEffect(target, source, player)) / 2;
									}, 0);
								})(player, target, all);
								return Math.max(0, get.sgn(eff2 - eff1));
							});
						const cards = player.getExpansions("fakequanji");
						if (index == 0) {
							await target.carryOutJunling(player, junling, targets);
							if (cards.length) {
								await player.draw(cards.length);
								const {
									result: { bool, links },
								} = await player.chooseButton(["排异：请移去一张“权”", cards], true);
								if (bool) await player.loseToDiscardpile(links);
							}
						} else if (cards.length) {
							const { result } = await player
								.chooseTarget(
									"排异：是否对至多" + get.cnNumber(cards.length) + "名与" + get.translation(target) + "势力相同的角色各造成1点伤害并移去等量的“权”？",
									(card, player, target) => {
										return target.isFriendOf(get.event("target"));
									},
									[1, cards.length]
								)
								.set("target", target)
								.set("ai", target => {
									return get.damageEffect(target, get.event("player"), get.event("player"));
								});
							if (result.bool) {
								const targetx = result.targets.sortBySeat();
								player.line(targetx);
								for (const i of targetx) await i.damage();
								const {
									result: { bool, links },
								} = await player.chooseButton(["排异：请移去" + get.cnNumber(targetx.length) + "张“权”", cards], targetx.length, true);
								if (bool) await player.loseToDiscardpile(links);
							}
						}
					}
				},
				ai: {
					order: 1,
					result: {
						target(player, target) {
							return -game.countPlayer(current => {
								return current == target || current.isFriendOf(target);
							});
						},
					},
					combo: "fakequanji",
				},
			},
			fakeshilu: {
				audio: "zyshilu",
				trigger: { player: ["phaseZhunbeiBegin", "phaseUseEnd"] },
				filter(event, player) {
					if (event.name == "phaseZhunbei") return player.getStorage("fakeshilu").length;
					if (!player.hasViceCharacter()) return false;
					const skills = get.character(player.name2, 3).filter(i => !get.is.locked(i, player));
					return !player.hasHistory("useSkill", evt => evt.event.getParent("phaseUse") == event && skills.includes(evt.sourceSkill || evt.skill));
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					if (trigger.name == "phaseZhunbei") {
						const num = player.getStorage("fakeshilu").length;
						await player.chooseToDiscard(num, "h", true);
						await player.draw(num);
					} else {
						await player.changeVice().setContent(get.info("fakeshilu").changeVice);
					}
				},
				getGroups(player) {
					return player
						.getStorage("fakeshilu")
						.map(i => {
							const double = get.is.double(i, true);
							return double ? double : [get.character(i, 1)];
						})
						.reduce((all, groups) => {
							all.addArray(groups);
							return all;
						}, []);
				},
				changeVice() {
					"step 0";
					player.showCharacter(2);
					if (!event.num) event.num = 3;
					var group = player.identity;
					if (!lib.group.includes(group)) group = lib.character[player.name1][1];
					_status.characterlist.randomSort();
					event.tochange = [];
					for (var i = 0; i < _status.characterlist.length; i++) {
						if (_status.characterlist[i].indexOf("gz_jun_") == 0) continue;
						var goon = false,
							group2 = lib.character[_status.characterlist[i]][1];
						if (group == "ye") {
							if (group2 != "ye") goon = true;
						} else {
							if (group == group2) goon = true;
							else {
								var double = get.is.double(_status.characterlist[i], true);
								if (double && double.includes(group)) goon = true;
							}
						}
						if (goon) {
							event.tochange.push(_status.characterlist[i]);
						}
					}
					event.tochange = event.tochange
						.filter(character => {
							const groups = get.info("fakeshilu").getGroups(player);
							const doublex = get.is.double(character, true);
							const group = doublex ? doublex : [get.character(character, 1)];
							return !group.some(j => groups.includes(j));
						})
						.randomGets(event.num);
					if (!event.tochange.length) event.finish();
					else {
						if (event.tochange.length == 1)
							event._result = {
								bool: true,
								links: event.tochange,
							};
						else
							player.chooseButton(true, ["请选择要变更的武将牌，并将原副将武将牌置于武将牌上", [event.tochange, "character"]]).ai = function (button) {
								return get.guozhanRank(button.link);
							};
					}
					"step 1";
					var name = result.links[0];
					_status.characterlist.remove(name);
					if (player.hasViceCharacter()) event.change = true;
					event.toRemove = player.name2;
					event.toChange = name;
					if (event.change) event.trigger("removeCharacterBefore");
					if (event.hidden) {
						if (!player.isUnseen(1)) player.hideCharacter(1);
					}
					"step 2";
					var name = event.toChange;
					if (event.hidden) game.log(player, "替换了副将", "#g" + get.translation(player.name2));
					else game.log(player, "将副将从", "#g" + get.translation(player.name2), "变更为", "#g" + get.translation(name));
					player.viceChanged = true;
					player.reinitCharacter(player.name2, name, false);
					"step 3";
					if (event.change && event.toRemove) {
						const list = [event.toRemove];
						player.markAuto("fakeshilu", list);
						game.log(player, "将", "#g" + get.translation(list), "置于武将牌上作为", "#y“戮”");
						game.broadcastAll(
							(player, list) => {
								var cards = [];
								for (var i = 0; i < list.length; i++) {
									var cardname = "huashen_card_" + list[i];
									lib.card[cardname] = {
										fullimage: true,
										image: "character:" + list[i],
									};
									lib.translate[cardname] = get.rawName2(list[i]);
									cards.push(game.createCard(cardname, "", ""));
								}
								player.$draw(cards, "nobroadcast");
							},
							player,
							list
						);
					}
				},
				marktext: "戮",
				intro: {
					content: "character",
					onunmark(storage, player) {
						if (storage && storage.length) {
							_status.characterlist.addArray(storage);
							storage = [];
						}
					},
					mark(dialog, storage, player) {
						if (storage && storage.length) dialog.addSmall([storage, "character"]);
						else return "没有“戮”";
					},
				},
			},
			fakexiongnve: {
				audio: "zyxiongnve",
				trigger: {
					source: "damageBegin1",
					player: ["damageBegin3", "damageBegin4"],
				},
				filter(event, player, name) {
					if (!event.source) return false;
					const num = parseInt(name.slice("damageBegin".length));
					const groups = get.info("fakeshilu").getGroups(player);
					const goon = event.card && event.card.name == "sha";
					if (num != 4) return goon && groups.includes(event.source.identity);
					return !goon && groups.includes(event.source.identity);
				},
				forced: true,
				locked: false,
				logTarget(event, player) {
					return event.source == player ? event.player : event.source;
				},
				async content(event, trigger, player) {
					trigger[parseInt(event.triggername.slice("damageBegin".length)) == 4 ? "decrease" : "increase"]("num");
				},
				ai: {
					combo: "fakeshilu",
					effect: {
						target(card, player, target) {
							if (card && card.name == "sha") return;
							if (player.hasSkillTag("jueqing", false, target)) return;
							const groups = get.info("fakeshilu").getGroups(target);
							if (groups.includes(player.identity)) {
								var num = get.tag(card, "damage");
								if (num) {
									if (num > 1) return 0.5;
									return 0;
								}
							}
						},
					},
				},
			},
			fakehuaiyi: {
				audio: "gzhuaiyi",
				enable: "phaseUse",
				filter(event, player) {
					if (!game.hasPlayer(target => target.isMajor())) return false;
					return player.hasViceCharacter() || ["h", "e", "j"].some(pos => player.getCards(pos).every(card => lib.filter.cardDiscardable(card, player)));
				},
				usable: 1,
				chooseButton: {
					dialog() {
						return ui.create.dialog("###怀异###" + get.translation("fakehuaiyi_info"));
					},
					chooseControl(event, player) {
						let list = [],
							map = { h: "手牌区", e: "装备区", j: "判定区" };
						list.addArray(
							["h", "e", "j"]
								.filter(pos => {
									return player.getCards(pos).every(card => lib.filter.cardDiscardable(card, player));
								})
								.map(i => map[i])
						);
						if (player.hasViceCharacter()) list.push("移除副将");
						list.push("cancel2");
						return list;
					},
					check() {
						const player = get.event("player");
						if (player.getCards("j").every(card => lib.filter.cardDiscardable(card, player))) return "判定区";
						if (player.hasViceCharacter() && get.guozhanRank(player.name2, player) <= 3) return "移除副将";
						if (player.getCards("e").every(card => lib.filter.cardDiscardable(card, player)) && player.getCards("e") <= 1) return "装备区";
						if (player.getCards("h").every(card => lib.filter.cardDiscardable(card, player)) && player.getCards("h") <= 1) return "手牌区";
						return "cancel2";
					},
					backup(result, player) {
						return {
							audio: "gzhuaiyi",
							filterCard: () => false,
							selectCard: -1,
							info: result.control,
							async content(event, trigger, player) {
								const control = get.info("fakehuaiyi_backup").info;
								if (info == "移除副将") {
									await player.removeCharacter(1);
								} else {
									const map = { 手牌区: "h", 装备区: "e", 判定区: "j" };
									await player.discard(player.getCards(map[control]));
								}
								let num = {};
								const targetx = game.filterPlayer(target => target.isMajor());
								for (const target of targetx) {
									if (typeof num[target.identity] != "number") num[target.identity] = 0;
								}
								let groups = Object.keys(num);
								const competition = groups.length > 1;
								for (const target of targetx) {
									if (target == player) continue;
									const {
										result: { bool, cards },
									} = await target
										.chooseToGive(player, "he", true, [1, Infinity], "怀异：交给" + get.translation(player) + "至少一张牌")
										.set("ai", card => {
											const player = get.event("player"),
												targets = get.event("targetx");
											if (
												!get.event("competition") ||
												!game.hasPlayer(target => {
													return target.isFriendOf(player) && target.hasViceCharacter() && get.guozhanRank(target.name2, target) > 4;
												})
											)
												return -get.value(card);
											if (ui.selected.cards.length >= get.rand(2, 3)) return 0;
											return 7.5 - get.value(card);
										})
										.set("targets", targetx)
										.set("num", num)
										.set("prompt2", competition ? "交牌最少的势力的一名角色的副将会被移除" : "")
										.set("complexCard", true)
										.set("competition", competition);
									if (bool) {
										num[target.identity] += cards.length;
									}
								}
								groups.sort((a, b) => num[a] - num[b]);
								const group = groups[0];
								if (num[group] < num[groups[groups.length - 1]]) {
									player.line(targetx.filter(target => target.identity == group));
									if (targetx.some(target => target.identity == group && target.hasViceCharacter())) {
										const {
											result: { bool, targets },
										} = await player
											.chooseTarget(
												"怀异：移除" + get.translation(group) + "势力的其中一名角色的副将",
												(card, player, target) => {
													return target.identity == get.event("group") && target.hasViceCharacter();
												},
												true
											)
											.set("group", group)
											.set("ai", target => -get.guozhanRank(target.name2, target));
										if (bool) {
											const target = targets[0];
											player.line(target);
											game.log(player, "选择了", target);
											await target.removeCharacter(1);
										}
									}
								}
							},
							ai: { result: { player: 1 } },
						};
					},
				},
				ai: {
					order: 10,
					result: {
						player(player, target) {
							if (!game.hasPlayer(i => i.isMajor() && get.attitude(player, i) < 0)) return 0;
							if (player.getCards("j").every(card => lib.filter.cardDiscardable(card, player))) return 1;
							if (player.hasViceCharacter() && get.guozhanRank(player.name2, player) <= 3) return 1;
							if (player.getCards("e").every(card => lib.filter.cardDiscardable(card, player)) && player.getCards("e") <= 1) return 1;
							if (player.getCards("h").every(card => lib.filter.cardDiscardable(card, player)) && player.getCards("h") <= 1) return 1;
							return 0;
						},
					},
				},
				subSkill: { backup: {} },
			},
			fakezisui: {
				audio: "gzzisui",
				trigger: { global: "removeCharacterEnd" },
				filter(event, player) {
					return event.getParent().player == player;
				},
				forced: true,
				content() {
					const list = [trigger.toRemove];
					player.markAuto("fakezisui", list);
					game.log(player, "将", "#g" + get.translation(list), "置于武将牌上作为", "#y“异”");
					game.broadcastAll(
						(player, list) => {
							var cards = [];
							for (var i = 0; i < list.length; i++) {
								var cardname = "huashen_card_" + list[i];
								lib.card[cardname] = {
									fullimage: true,
									image: "character:" + list[i],
								};
								lib.translate[cardname] = get.rawName2(list[i]);
								cards.push(game.createCard(cardname, "", ""));
							}
							player.$draw(cards, "nobroadcast");
						},
						player,
						list
					);
				},
				marktext: "异",
				intro: {
					content: "character",
					onunmark(storage, player) {
						if (storage && storage.length) {
							_status.characterlist.addArray(storage);
							storage = [];
						}
					},
					mark(dialog, storage, player) {
						if (storage && storage.length) dialog.addSmall([storage, "character"]);
						else return "没有“异”";
					},
				},
				group: "fakezisui_effect",
				subSkill: {
					effect: {
						audio: "gzzisui",
						trigger: { player: ["phaseDrawBegin2", "phaseJieshuBegin"] },
						filter(event, player) {
							const num = player.getStorage("fakezisui").length;
							if (!num) return false;
							if (event.name == "phaseDraw") return !event.numFixed;
							return num > player.maxHp;
						},
						forced: true,
						content() {
							const num = player.getStorage("fakezisui").length;
							if (trigger.name == "phaseDraw") trigger.num += num;
							else player.die();
						},
					},
				},
			},
			fakejujian: {
				audio: "gzjujian",
				init(player) {
					if (player.checkViceSkill("fakejujian") && !player.viceChanged) player.removeMaxHp();
				},
				viceSkill: true,
				filter(event, player) {
					return player.countCards("he", card => {
						return _status.connectMode || (get.type(card) != "basic" && lib.filter.cardDiscardable(card, player));
					});
				},
				async cost(event, trigger, player) {
					event.result = await player.chooseCardTarget({
						prompt: get.prompt2("fakejujian"),
						filterTarget(card, player, target) {
							return target.isFriendOf(player);
						},
						filterCard(card, player) {
							return get.type(card) != "basic" && lib.filter.cardDiscardable(card, player);
						},
						position: "he",
						ai1(card) {
							return 7.5 - get.value(card);
						},
						ai2(target) {
							const player = get.event("player");
							return Math.max(get.effect(target, { name: "wuzhong" }, player, player), get.recoverEffect(target, player, player));
						},
					});
				},
				async content(event, trigger, player) {
					await player.discard(event.cards);
					const target = event.targets[0];
					await target.chooseDrawRecover(2, "举荐：摸两张牌或回复1点体力", true);
					await target.mayChangeVice();
				},
			},
			fakexibing: {
				audio: "xibing",
				filter(event, player) {
					if (player == event.player || event.targets.length != 1 || event.player.countCards("h") >= event.player.hp) return false;
					var bool = function (card) {
						return (card.name == "sha" || get.type(card, null, false) == "trick") && get.color(card, false) == "black";
					};
					if (!bool(event.card)) return false;
					var evt = event.getParent("phaseUse");
					if (evt.player != event.player) return false;
					return (
						event.player.getHistory("useCard", function (evtx) {
							return bool(evtx.card) && evtx.getParent("phaseUse") == evt;
						})[0] == event.getParent()
					);
				},
				logTarget: "player",
				check(event, player) {
					var target = event.player;
					var att = get.attitude(player, target);
					var num2 = Math.min(5, target.hp) - target.countCards("h");
					if (num2 <= 0) return att <= 0;
					var num = target.countCards("h", function (card) {
						return target.hasValueTarget(card, null, true);
					});
					if (!num) return att > 0;
					return (num - num2) * att < 0;
				},
				preHidden: true,
				content() {
					"step 0";
					var num = trigger.player.hp - trigger.player.countCards("h");
					if (num > 0) trigger.player.draw(num);
					"step 1";
					trigger.player.addTempSkill("fakexibing_banned");
					if (get.mode() != "guozhan" || player.isUnseen(2) || trigger.player.isUnseen(2)) event.finish();
					"step 2";
					var target = trigger.player;
					var players1 = [player.name1, player.name2];
					var players2 = [target.name1, target.name2];
					player
						.chooseButton(2, ["是否暗置自己和" + get.translation(target) + "的各一张武将牌？", '<div class="text center">你的武将牌</div>', [players1, "character"], '<div class="text center">' + get.translation(target) + "的武将牌</div>", [players2, "character"]])
						.set("players", players1)
						.set("complexSelect", true)
						.set("filterButton", function (button) {
							return !get.is.jun(button.link) && (ui.selected.buttons.length == 0) == _status.event.players.includes(button.link);
						});
					"step 3";
					if (result.bool) {
						var target = trigger.player;
						player.hideCharacter(player.name1 == result.links[0] ? 0 : 1);
						target.hideCharacter(target.name1 == result.links[1] ? 0 : 1);
						player.addTempSkill("fakexibing_nomingzhi");
						target.addTempSkill("fakexibing_nomingzhi");
					}
				},
				subSkill: {
					banned: {
						mod: {
							cardEnabled2(card) {
								if (get.position(card) == "h") return false;
							},
						},
					},
					nomingzhi: {
						ai: { nomingzhi: true },
					},
				},
			},
			fakechengshang: {
				audio: "chengshang",
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					if (!lib.suit.includes(get.suit(event.card, false)) || typeof get.number(event.card) != "number") return false;
					if (
						player.getHistory("sourceDamage", evt => {
							return evt.card == event.card;
						}).length
					)
						return false;
					const phsu = event.getParent("phaseUse");
					if (!phsu || phsu.player != player) return false;
					return event.targets.some(i => i.isEnemyOf(player));
				},
				usable: 1,
				preHidden: true,
				async content(event, trigger, player) {
					await player.draw();
					player.tempBanSkill("fakechengshang", "phaseUseAfter", false);
					player.addTempSkill("fakechengshang_effect");
					player.markAuto("fakechengshang_effect", [[get.suit(trigger.card), get.number(trigger.card), trigger.card.name]]);
				},
				subSkill: {
					effect: {
						charlotte: true,
						onremove: true,
						hiddenCard(player, name) {
							const type = get.type(name);
							if (type != "basic" && type != "trick") return false;
							const storage = player.getStorage("fakechengshang_effect");
							return lib.card.list.some(list => {
								return (
									name == list[2] &&
									storage.some(card => {
										return card[0] == list[0] && card[1] == list[1] && card[2] != list[2];
									})
								);
							});
						},
						audio: "chengshang",
						enable: "phaseUse",
						chooseButton: {
							dialog(event, player) {
								const storage = player.getStorage("fakechengshang_effect");
								const list = lib.card.list
									.filter(list => {
										const type = get.type(list[2]);
										if (type != "basic" && type != "trick") return false;
										return storage.some(card => card[0] == list[0] && card[1] == list[1] && card[2] != list[2]);
									})
									.map(card => [get.translation(get.type2(card[2])), "", card[2], card[3]]);
								return ui.create.dialog("承赏", [list, "vcard"]);
							},
							filter(button, player) {
								return get.event().getParent().filterCard({ name: button.link[2], nature: button.link[3] }, player, event);
							},
							check(button) {
								const player = get.event("player");
								const card = { name: button.link[2], nature: button.link[3] };
								if (player.countCards("hes", cardx => cardx.name == card.name)) return 0;
								return player.getUseValue(card);
							},
							backup(links, player) {
								return {
									audio: "chengshang",
									filterCard: true,
									position: "hs",
									popname: true,
									precontent() {
										player.logSkill("fakechengshang_effect");
										delete event.result.skill;
										const cardx = event.result.card;
										const removes = player.getStorage("fakechengshang_effect").filter(card => {
											return lib.card.list.some(list => {
												return cardx.name == list[2] && card[0] == list[0] && card[1] == list[1] && card[2] != list[2];
											});
										});
										player.unmarkAuto("fakechengshang_effect", removes);
									},
									viewAs: {
										name: links[0][2],
										nature: links[0][3],
									},
								};
							},
							prompt(links, player) {
								return "将一张手牌当作" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
							},
						},
					},
				},
			},
			fakezhente: {
				audio: "zhente",
				inherit: "zhente",
				filter(event, player) {
					var color = get.color(event.card),
						type = get.type(event.card);
					if (player == event.player || event.player.isDead() || color == "none") return false;
					return type == "trick" || (type == "basic" && color == "black");
				},
			},
			fakezhiwei: {
				unique: true,
				audio: "zhiwei",
				inherit: "zhiwei",
				filter(event, player, name) {
					if (!game.hasPlayer(current => current != player)) return false;
					return (
						event.name == "showCharacter" &&
						event.toShow.some(name => {
							return get.character(name, 3).includes("fakezhiwei");
						})
					);
				},
				content() {
					"step 0";
					player
						.chooseTarget("请选择【至微】的目标", true, lib.filter.notMe)
						.set("ai", target => {
							var att = get.attitude(_status.event.player, target);
							if (att > 0) return 1 + att;
							return Math.random();
						})
						.set("prompt2", lib.translate.fakezhiwei_info);
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill("fakezhiwei", target);
						player.storage.fakezhiwei_effect = target;
						player.addSkill("fakezhiwei_effect");
					}
				},
				subSkill: {
					effect: {
						charlotte: true,
						onremove: true,
						audio: "zhiwei",
						trigger: { player: "hideCharacterBefore" },
						filter(event, player) {
							return get.character(event.toHide, 3).includes("fakezhiwei");
						},
						forced: true,
						content() {
							trigger.cancel();
						},
						mark: "character",
						intro: { content: "已选择$" },
						group: ["fakezhiwei_draw", "fakezhiwei_discard", "fakezhiwei_gain", "fakezhiwei_clear"],
					},
					draw: {
						audio: "zhiwei",
						trigger: { global: "damageSource" },
						forced: true,
						filter(event, player) {
							return event.source == player.storage.fakezhiwei_effect;
						},
						logTarget: "source",
						content() {
							player.draw();
						},
					},
					discard: {
						audio: "zhiwei",
						trigger: { global: "damageEnd" },
						forced: true,
						filter(event, player) {
							return (
								event.player == player.storage.fakezhiwei_effect &&
								player.hasCard(card => {
									return _status.connectMode || lib.filter.cardDiscardable(card, player);
								}, "h")
							);
						},
						logTarget: "player",
						content() {
							player.chooseToDiscard("h", true);
						},
					},
					gain: {
						audio: "zhiwei",
						trigger: {
							player: "loseAfter",
							global: "loseAsyncAfter",
						},
						forced: true,
						filter(event, player) {
							if (event.type != "discard" || event.getlx === false || event.getParent("phaseDiscard").player != player || !player.storage.fakezhiwei_effect || !player.storage.fakezhiwei_effect.isIn()) return false;
							var evt = event.getl(player);
							return evt && evt.cards2.filterInD("d").length > 0;
						},
						logTarget(event, player) {
							return player.storage.fakezhiwei_effect;
						},
						content() {
							if (trigger.delay === false) game.delay();
							player.storage.fakezhiwei_effect.gain(trigger.getl(player).cards2.filterInD("d"), "gain2");
						},
					},
					clear: {
						audio: "zhiwei",
						trigger: {
							global: "die",
							player: ["hideCharacterEnd", "removeCharacterEnd"],
						},
						forced: true,
						filter(event, player) {
							if (event.name == "die") return event.player == player.storage.fakezhiwei_effect;
							if (event.name == "removeCharacter") return get.character(event.toRemove, 3).includes("fakezhiwei");
							return get.character(event.toHide, 3).includes("fakezhiwei");
						},
						content() {
							"step 0";
							player.removeSkill("fakezhiwei_effect");
							if (trigger.name != "die") event.finish();
							"step 1";
							if (get.character(player.name1, 3).includes("fakezhiwei")) player.hideCharacter(0);
							if (get.character(player.name2, 3).includes("fakezhiwei")) player.hideCharacter(1);
						},
					},
				},
			},
			fakekuangcai: {
				inherit: "gzrekuangcai",
				content() {
					const goon = Boolean(player.getHistory("useCard").length);
					get.info("rekuangcai").change(player, goon ? -1 : 1);
					player
						.when({ global: "phaseAfter" })
						.then(() => {
							get.info("rekuangcai").change(player, goon ? 1 : -1);
						})
						.vars({ goon: goon });
				},
			},
			faketunchu: {
				audio: "tunchu",
				trigger: { player: "phaseDrawBegin2" },
				filter(event, player) {
					return !event.numFixed;
				},
				check(event, player) {
					return player.countCards("h") <= 2;
				},
				locked: false,
				preHidden: true,
				content() {
					trigger.num += 2;
					player
						.when(["phaseDrawEnd", "phaseDrawSkipped", "phaseDrawCancelled"])
						.filter(evt => evt == trigger)
						.then(() => {
							var nh = player.countCards("h");
							if (nh) {
								player.chooseCard("h", [1, Math.min(nh, 2)], "将至多两张手牌置于你的武将牌上", true).set("ai", card => {
									return 7.5 - get.value(card);
								});
							} else {
								player.addTempSkill("faketunchu_effect");
								event.finish();
							}
						})
						.then(() => {
							if (result.bool) player.addToExpansion(result.cards, player, "giveAuto").gaintag.add("faketunchu");
						})
						.then(() => {
							player.addTempSkill("faketunchu_effect");
						});
				},
				intro: {
					content: "expansion",
					markcount: "expansion",
				},
				marktext: "粮",
				onremove(player, skill) {
					var cards = player.getExpansions(skill);
					if (cards.length) player.loseToDiscardpile(cards);
				},
				subSkill: {
					effect: {
						charlotte: true,
						mod: {
							cardEnabled(card, player) {
								if (card.name == "sha") return false;
							},
						},
						mark: true,
						intro: { content: "本回合不能使用【杀】" },
					},
				},
			},
			fakeshuliang: {
				audio: "shuliang",
				trigger: { global: "phaseJieshuBegin" },
				filter(event, player) {
					const num = player.getExpansions("faketunchu").length;
					if (!num || !event.player.isFriendOf(player)) return false;
					return event.player.isIn() && get.distance(player, event.player) <= num;
				},
				async cost(event, trigger, player) {
					const {
						result: { bool, links },
					} = await player
						.chooseButton([get.prompt2("fakeshuliang", trigger.player), player.getExpansions("faketunchu")])
						.set("ai", button => {
							if (get.attitude(get.event("player"), get.event().getTrigger().player) <= 0) return 0;
							return 1 + Math.random();
						})
						.setHiddenSkill("fakeshuliang");
					event.result = { bool: bool, cost_data: links };
				},
				preHidden: true,
				logTarget: "player",
				content() {
					player.loseToDiscardpile(event.cost_data);
					trigger.player.draw(2);
				},
				ai: { combo: "faketunchu" },
			},
			fakedujin: {
				audio: "dujin",
				inherit: "dujin",
				filter(event, player) {
					return player.countCards("e") && !event.numFixed;
				},
				content() {
					trigger.num += Math.ceil(player.countCards("e") / 2);
				},
				group: "fakedujin_first",
				subSkill: {
					first: {
						audio: "dujin",
						trigger: { player: "showCharacterEnd" },
						filter(event, player) {
							if (
								game
									.getAllGlobalHistory(
										"everything",
										evt => {
											return evt.name == "showCharacter" && evt.player == player && evt.toShow.some(i => get.character(i, 3).includes("fakedujin"));
										},
										event
									)
									.indexOf(event) != 0
							)
								return false;
							return (
								game.getAllGlobalHistory("everything", evt => {
									return evt.name == "showCharacter" && evt.player.isFriendOf(player);
								})[0].player == player
							);
						},
						forced: true,
						locked: false,
						content() {
							player.addMark("xianqu_mark", 1);
						},
					},
				},
			},
			fakezhufu: {
				audio: "spwuku",
				enable: "phaseUse",
				filter(event, player) {
					return player.hasCard(card => {
						return get.info("fakezhufu").filterCard(card, player);
					}, "he");
				},
				filterCard(card, player) {
					if (!lib.suit.includes(get.suit(card))) return false;
					return lib.filter.cardDiscardable(card, player) && !player.getStorage("fakezhufu_effect").includes(get.suit(card));
				},
				position: "he",
				check(card) {
					const player = get.event("player");
					let cards = player.getCards("hs", card => player.hasValueTarget(card, true, true));
					let discards = player.getCards("he", card => get.info("fakezhufu").filterCard(card, player));
					for (let i = 1; i < discards.length; i++) {
						if (discards.slice(0, i).some(card => get.suit(card) == get.suit(discards[i]))) discards.splice(i--, 1);
					}
					cards.removeArray(discards);
					if (!cards.length || !discards.length) return 0;
					cards.sort((a, b) => {
						return (player.getUseValue(b, true, true) > 0 ? get.order(b) : 0) - (player.getUseValue(a, true, true) > 0 ? get.order(a) : 0);
					});
					const cardx = cards[0];
					if (get.order(cardx, player) > 0 && discards.includes(card)) {
						if (
							(get.suit(card) == "heart" &&
								get.type(cardx) != "equip" &&
								(function (card, player) {
									const num = get.info("fakezhufu").getMaxUseTarget(card, player);
									return num != -1 && game.countPlayer(target => player.canUse(card, target, true, true) && get.effect(target, card, player, player) > 0) > num;
								})(cardx, player) &&
								game.hasPlayer(target => {
									return (
										target.isFriendOf(player) &&
										target.hasCard(cardy => {
											return lib.filter.cardDiscardable(cardy, target) && get.type2(cardy) == get.type2(cardx);
										}, "h")
									);
								})) ||
							(get.suit(card) == "diamond" &&
								get.type(cardx) != "equip" &&
								!game.hasPlayer(target => {
									return target.countCards("h") > player.countCards("h") - (get.position(card) == "h" ? 1 : 0) - (get.position(cardx) == "h" ? 1 : 0);
								})) ||
							(get.suit(card) == "spade" && player.getHp() == 1) ||
							(get.suit(card) == "club" && get.tag(cardx, "damage") && player.countCards("h") - (get.position(card) == "h" ? 1 : 0) - (get.position(cardx) == "h" ? 1 : 0) == 0)
						)
							return 1 / (getvalue(card) || 0.5);
					}
					return 0;
				},
				async content(event, trigger, player) {
					const suit = get.suit(event.cards[0], player);
					player.addTempSkill("fakezhufu_effect", "phaseUseAfter");
					player.markAuto("fakezhufu_effect", [[suit, false]]);
				},
				ai: {
					order(item, player) {
						let cards = player.getCards("hs", card => player.hasValueTarget(card, true, true));
						let discards = player.getCards("he", card => get.info("fakezhufu").filterCard(card, player));
						for (let i = 1; i < discards.length; i++) {
							if (discards.slice(0, i).some(card => get.suit(card) == get.suit(discards[i]))) discards.splice(i--, 1);
						}
						cards.removeArray(discards);
						if (!cards.length || !discards.length) return 0;
						cards.sort((a, b) => {
							return (player.getUseValue(b, true, true) > 0 ? get.order(b) : 0) - (player.getUseValue(a, true, true) > 0 ? get.order(a) : 0);
						});
						const cardx = cards[0];
						return get.order(cardx, player) > 0 &&
							((discards.some(card => {
								return get.suit(card) == "heart";
							}) &&
								get.type(cardx) != "equip" &&
								(function (card, player) {
									const num = get.info("fakezhufu").getMaxUseTarget(card, player);
									return num != -1 && game.countPlayer(target => player.canUse(card, target, true, true) && get.effect(target, card, player, player) > 0) > num;
								})(cardx, player) &&
								game.hasPlayer(target => {
									return (
										target.isFriendOf(player) &&
										target.hasCard(cardy => {
											return lib.filter.cardDiscardable(cardy, target) && get.type2(cardy) == get.type2(cardx);
										}, "h")
									);
								})) ||
								(get.type(cardx) != "equip" &&
									discards.some(card => {
										return (
											get.suit(card) == "diamond" &&
											!game.hasPlayer(target => {
												return target.countCards("h") > player.countCards("h") - (get.position(card) == "h" ? 1 : 0) - (get.position(cardx) == "h" ? 1 : 0);
											})
										);
									})) ||
								(discards.some(card => {
									return get.suit(card) == "spade";
								}) &&
									player.getHp() == 1) ||
								(get.tag(cardx, "damage") &&
									discards.some(card => {
										return get.suit(card) == "club" && player.countCards("h") - (get.position(card) == "h" ? 1 : 0) - (get.position(cardx) == "h" ? 1 : 0) == 0;
									})))
							? get.order(cardx, player) + 0.00001
							: 0;
					},
					result: {
						player(player, target) {
							let cards = player.getCards("hs", card => player.hasValueTarget(card, true, true));
							let discards = player.getCards("he", card => get.info("fakezhufu").filterCard(card, player));
							discards = discards.sort((a, b) => get.value(a) - get.value(b));
							for (let i = 1; i < discards.length; i++) {
								if (discards.slice(0, i).some(card => get.suit(card) == get.suit(discards[i]))) discards.splice(i--, 1);
							}
							cards.removeArray(discards);
							if (!cards.length || !discards.length) return 0;
							if (
								(discards.some(card => {
									return get.suit(card) == "heart";
								}) &&
									cards.some(card => {
										return (
											get.type(card) != "equip" &&
											(function (card, player) {
												const num = get.info("fakezhufu").getMaxUseTarget(card, player);
												return num != -1 && game.countPlayer(target => player.canUse(card, target, true, true) && get.effect(target, card, player, player) > 0) > num;
											})(card, player) &&
											game.hasPlayer(target => {
												return (
													target.isFriendOf(player) &&
													target.hasCard(cardx => {
														return lib.filter.cardDiscardable(cardx, target) && get.type2(cardx) == get.type2(card);
													}, "h")
												);
											})
										);
									})) ||
								discards.some(card => {
									return (
										get.suit(card) == "diamond" &&
										cards.some(cardx => {
											return (
												get.type(cardx) != "equip" &&
												!game.hasPlayer(target => {
													return target.countCards("h") > player.countCards("h") - (get.position(card) == "h" ? 1 : 0) - (get.position(cardx) == "h" ? 1 : 0);
												})
											);
										})
									);
								}) ||
								(discards.some(card => {
									return get.suit(card) == "spade";
								}) &&
									player.getHp() == 1) ||
								discards.some(card => {
									return (
										get.suit(card) == "club" &&
										cards.some(cardx => {
											return get.tag(cardx, "damage") && player.countCards("h") - (get.position(card) == "h" ? 1 : 0) - (get.position(cardx) == "h" ? 1 : 0) == 0;
										})
									);
								})
							)
								return 1;
							return 0;
						},
					},
				},
				subSkill: {
					effect: {
						charlotte: true,
						onremove: true,
						intro: {
							content(storage) {
								const suitStorage = storage.slice().sort((a, b) => lib.suit.indexOf(a[0]) - lib.suit.indexOf(b[0]));
								const suits = suitStorage.reduce((str, list) => str + get.translation(list[0]), "");
								const usedSuits = suitStorage.filter(list => list[1]).reduce((str, list) => str + get.translation(list[0]), "");
								let str = "";
								str += "<li>已弃置过的花色：";
								str += suits;
								if (usedSuits.length) {
									str += "<br><li>已触发过的花色：";
									str += usedSuits;
								}
								return str;
							},
						},
						audio: "spwuku",
						trigger: { player: "yingbian" },
						filter(event, player) {
							return player.getStorage("fakezhufu_effect").some(list => !list[1]);
						},
						forced: true,
						firstDo: true,
						async content(event, trigger, player) {
							const list = player.getStorage("fakezhufu_effect").filter(i => !i[1]);
							const forced = (function (trigger, player) {
								if (trigger.forceYingbian || player.hasSkillTag("forceYingbian")) return true;
								const list = trigger.temporaryYingbian || [];
								return list.includes("force") || get.cardtag(trigger.card, "yingbian_force");
							})(trigger, player);
							if (forced) {
								player.popup("yingbian_force_tag", lib.yingbian.condition.color.get("force"));
								game.log(player, "触发了", "#g【注傅】", "为", trigger.card, "添加的应变条件");
							}
							const hasYingBian = trigger.temporaryYingbian || [],
								map = get.info("fakezhufu").YingBianMap;
							for (const j of list) {
								player.storage.fakezhufu_effect[player.getStorage("fakezhufu_effect").indexOf(j)][1] = true;
								const tag = map[j[0]][0],
									eff = map[j[0]][1];
								if (get.cardtag(trigger.card, `yingbian_${tag}`)) continue;
								if (j[0] == "heart") {
									if (!forced && !hasYingBian.includes("add")) {
										const { result } = await lib.yingbian.condition.complex.get("zhuzhan")(trigger);
										if (result.bool) {
											game.log(player, "触发了", "#g【注傅】", "为", trigger.card, "添加的应变条件（", "#g" + get.translation(j[0]), "）");
											trigger.yingbian_addTarget = true;
											player.addTempSkill("yingbian_changeTarget");
										}
									} else {
										if (!forced) {
											game.log(player, "触发了", "#g【注傅】", "为", trigger.card, "添加的应变条件（", "#g" + get.translation(j[0]), "）");
										}
										trigger.yingbian_addTarget = true;
										player.addTempSkill("yingbian_changeTarget");
									}
								} else {
									const goon = hasYingBian.includes(eff) || lib.yingbian.condition.simple.get(tag)(trigger);
									if (!forced && goon) {
										player.popup("yingbian_force_tag", lib.yingbian.condition.color.get(eff));
										game.log(player, "触发了", "#g【注傅】", "为", trigger.card, "添加的应变条件（", "#g" + get.translation(j[0]), "）");
									}
									if (forced || goon) await game.yingbianEffect(trigger, lib.yingbian.effect.get(eff));
								}
							}
						},
					},
				},
				YingBianMap: {
					heart: ["zhuzhan", "add"],
					diamond: ["fujia", "hit"],
					spade: ["canqu", "draw"],
					club: ["kongchao", "damage"],
				},
				getMaxUseTarget(card, player) {
					let range;
					const select = get.copy(get.info(card).selectTarget);
					if (select == undefined) range = [1, 1];
					else if (typeof select == "number") range = [select, select];
					else if (get.itemtype(select) == "select") range = select;
					else if (typeof select == "function") range = select(card, player);
					game.checkMod(card, player, range, "selectTarget", player);
					return range;
				},
			},
			fakeguishu: {
				inherit: "hmkguishu",
				usable: 1,
			},
			fakeyuanyu: {
				inherit: "hmkyuanyu",
				filter(event, player) {
					if (event.num <= 0 || !event.source) return false;
					return !event.source.inRange(player);
				},
				content() {
					trigger.num--;
				},
				ai: {
					effect: {
						target(card, player, target) {
							if (player.hasSkillTag("jueqing", false, target)) return;
							if (player.inRange(target)) return;
							const num = get.tag(card, "damage");
							if (num) {
								if (num > 1) return 0.5;
								return "zeroplayertarget";
							}
						},
					},
				},
			},
			fakemibei: {
				audio: "mibei",
				trigger: { player: "phaseZhunbeiBegin" },
				filter(event, player) {
					return !player.isMaxHandcard();
				},
				async cost(event, trigger, player) {
					const filterTarget = (card, player, target) => {
							return target != player && target.isMaxHandcard();
						},
						targetx = game.filterPlayer(current => filterTarget(null, player, current));
					if (targetx.length == 1) event.result = { bool: true, targets: targetx };
					else
						event.result = await player
							.chooseTarget(filterTarget, true)
							.set("prompt2", lib.translate.fakemibei_info)
							.set("prompt", "请选择【秘备】的目标")
							.set("ai", target => {
								const player = get.event("player");
								return get.attitude(player, target);
							})
							.forResult();
				},
				preHidden: true,
				async content(event, trigger, player) {
					const target = event.targets[0];
					const {
						result: { junling, targets },
					} = await target.chooseJunlingFor(player);
					const {
						result: { index },
					} = await player.chooseJunlingControl(target, junling, targets).set("prompt", "秘备：是否执行军令？");
					if (index == 0) await player.carryOutJunling(target, junling, targets);
				},
				group: "fakemibei_junling",
				subSkill: {
					junling: {
						audio: "mibei",
						trigger: { player: ["carryOutJunlingEnd", "chooseJunlingControlEnd"] },
						filter(event, player) {
							if (event.name == "carryOutJunling") {
								return event.source.countCards("h") > player.countCards("h");
							}
							return event.result.index == 1 && player.countCards("h");
						},
						forced: true,
						locked: false,
						async content(event, trigger, player) {
							if (trigger.name == "carryOutJunling") {
								const num = Math.min(5, trigger.source.countCards("h") - player.countCards("h"));
								await player.draw(num);
							} else {
								const {
									result: { bool, cards },
								} = await player.chooseCard("秘备：展示一至三张手牌，本回合你可以将其中一张牌当作另一张基本牌或普通锦囊牌使用一次", [1, 3], true).set("ai", card => {
									const player = get.event("player"),
										goon = _status.currentPhase == player;
									if (goon) return player.getUseValue(card) / get.value(card);
									return get.value(card);
								});
								if (bool) {
									await player.showCards(cards, get.translation(player) + "发动了【秘备】");
									player.addGaintag(cards, "fakemibei_effect");
									player.addTempSkill("fakemibei_effect");
								}
							}
						},
					},
					effect: {
						charlotte: true,
						onremove(player) {
							player.removeGaintag("fakemibei_effect");
						},
						hiddenCard(player, name) {
							const cards = player.getCards("h", card => card.hasGaintag("fakemibei_effect"));
							if (cards.length < 2) return false;
							const type = get.type(name);
							if (type != "basic" && type != "trick") return false;
							return cards
								.slice()
								.map(i => i.name)
								.includes(name);
						},
						audio: "mibei",
						enable: "phaseUse",
						chooseButton: {
							dialog(event, player) {
								const list = player
									.getCards("h", card => {
										const type = get.type(card);
										if (type != "basic" && type != "trick") return false;
										return card.hasGaintag("fakemibei_effect");
									})
									.sort((a, b) => {
										return (
											lib.inpile.indexOf(a.name) +
											get.natureList(a, false).reduce((sum, nature) => {
												return sum + lib.inpile_nature.indexOf(nature);
											}, 0) -
											lib.inpile.indexOf(b.name) -
											get.natureList(b, false).reduce((sum, nature) => {
												return sum + lib.inpile_nature.indexOf(nature);
											}, 0)
										);
									})
									.slice()
									.map(card => [get.translation(get.type(card)), "", card.name, card.nature]);
								return ui.create.dialog("秘备", [list, "vcard"]);
							},
							filter(button, player) {
								const event = get.event().getParent();
								return event.filterCard({ name: button.link[2], nature: button.link[3] }, player, event);
							},
							check(button) {
								const player = get.event("player");
								const card = { name: button.link[2], nature: button.link[3] };
								if (player.countCards("hes", cardx => cardx.name == card.name)) return 0;
								return player.getUseValue(card);
							},
							backup(links, player) {
								return {
									audio: "chengshang",
									filterCard(card, player) {
										const cardx = get.info("fakemibei_effect_backup").viewAs;
										if (cardx.name == card.name && cardx.nature == card.nature) return false;
										return card.hasGaintag("fakemibei_effect");
									},
									position: "h",
									popname: true,
									precontent() {
										player.logSkill("fakemibei_effect");
										delete event.result.skill;
										player.tempBanSkill("fakemibei_effect", null, false);
									},
									viewAs: {
										name: links[0][2],
										nature: links[0][3],
									},
								};
							},
							prompt(links, player) {
								return "将一张“秘备”牌当作" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
							},
						},
					},
				},
			},
			fakeqizhi: {
				audio: "qizhi",
				trigger: { player: "useCard1" },
				filter(event, player) {
					if (!event.targets || !event.targets.length) return false;
					if (_status.currentPhase != player) return false;
					if (get.type(event.card) == "equip") return false;
					return game.hasPlayer(target => !event.targets.includes(target) && target.countCards("he") > 0);
				},
				direct: false,
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget(get.prompt2("fakeqizhi"), (card, player, target) => {
							return !get.event().getTrigger().targets.includes(target) && target.countCards("he") > 0;
						})
						.set("ai", target => {
							const player = get.event("player");
							if (target == player) return 2;
							if (get.attitude(player, target) <= 0) return 1;
							return 0.5;
						})
						.forResult();
				},
				async content(event, trigger, player) {
					const target = event.targets[0];
					const {
						result: { bool, cards },
					} = await player.discardPlayerCard(target, "he", true);
					if (bool) {
						await target.draw();
						if (cards.some(i => get.suit(i, target) == get.suit(trigger.card))) {
							trigger.forceYingbian = true;
						}
					}
				},
			},
			fakejinqu: {
				audio: "jinqu",
				trigger: { player: "phaseJieshuBegin" },
				check(event, player) {
					return (
						player.getHistory("useSkill", evt => {
							return evt.skill == "fakeqizhi";
						}).length >= player.countCards("h")
					);
				},
				prompt2(event, player) {
					const num = player.getHistory("useSkill", evt => evt.skill == "fakeqizhi").length;
					return "摸两张牌，然后将手牌弃置至" + get.cnNumber(num) + "张";
				},
				content() {
					"step 0";
					player.draw(2);
					"step 1";
					var dh =
						player.countCards("h") -
						player.getHistory("useSkill", evt => {
							return evt.skill == "fakeqizhi";
						}).length;
					if (dh > 0) player.chooseToDiscard(dh, true);
				},
				ai: { combo: "fakeqizhi" },
			},
			fakejuzhan: {
				zhuanhuanji: true,
				locked: false,
				marktext: "☯",
				intro: {
					content(storage) {
						if (storage) return "当你使用【杀】指定目标后，你可以获得其X张牌，然后若你的武将牌均明置，则其可以暗置此武将牌，且你本回合不能明置此武将牌（X为你已损失的体力值且至少为1）";
						return "当你成为【杀】的目标后，你可以与其各摸X张牌，然后其武将牌均明置，则你可以暗置其一张武将牌，且其本回合不能明置此武将牌（X为其已损失的体力值且至少为1）";
					},
				},
				audio: "nzry_juzhan_1",
				trigger: {
					player: "useCardToPlayered",
					target: "useCardToTargeted",
				},
				filter(event, player) {
					if (event.card.name != "sha") return false;
					const storage = player.storage.fakejuzhan;
					if ((event.player == player) != Boolean(storage)) return false;
					if (storage && !event.target.countCards("he")) return false;
					return true;
				},
				logTarget(event, player) {
					const storage = player.storage.fakejuzhan;
					return event[Boolean(storage) ? "target" : "player"];
				},
				async content(event, trigger, player) {
					const storage = player.storage.fakejuzhan;
					player.changeZhuanhuanji("fakejuzhan");
					const target = trigger[Boolean(storage) ? "target" : "player"];
					const num = Math.max(target.getDamagedHp(), 1);
					if (!storage) {
						await player.draw(num, "nodelay");
						await target.draw(num);
						if (!target.isUnseen(2)) {
							const {
								result: { bool, links },
							} = await player.chooseButton(["拒战：是否暗置" + get.translation(target) + "的一张武将牌？", '<div class="text center">' + get.translation(target) + "的武将牌</div>", [[target.name1, target.name2], "character"]]).set("filterButton", button => !get.is.jun(button.link));
							if (bool) {
								await target.hideCharacter(target.name1 == links[0] ? 0 : 1);
								target.addTempSkill("donggui2");
							}
						}
					} else {
						await player.gainPlayerCard(target, num, "he", true);
						const names = [player.name1, player.name2].filter(i => {
							return get.character(i, 3).includes("fakejuzhan");
						});
						if (!player.isUnseen(2) && names.length) {
							const {
								result: { bool, links },
							} = await target.chooseBool("拒战：是否暗置" + get.translation(player) + "的" + (names.includes(player.name1) ? "主将" : "") + (names.length > 1 ? "和" : "") + (names.includes(player.name2) ? "副将" : "") + "?");
							if (bool) {
								if (names.includes(player.name1)) await player.hideCharacter(0);
								if (names.includes(player.name2)) await player.hideCharacter(1);
								player.addTempSkill("donggui2");
							}
						}
					}
				},
				group: "fakejuzhan_mark",
				subSkill: {
					mark: {
						charlotte: true,
						trigger: { player: ["hideCharacterBegin", "showCharacterEnd"] },
						filter(event, player) {
							return get.character(event[event.name == "hideCharacter" ? "toHide" : "toShow"], 3).includes("fakejuzhan");
						},
						forced: true,
						popup: false,
						firstDo: true,
						content() {
							player[(trigger.name == "hideCharacter" ? "un" : "") + "markSkill"]("fakejuzhan");
						},
					},
				},
			},
			fakedanshou: {
				audio: "mobiledanshou",
				trigger: { global: "phaseZhunbeiBegin" },
				filter(event, player) {
					return ["h", "e", "j"].some(pos => {
						const cards = player.getCards(pos);
						return cards.length > 0 && cards.every(card => lib.filter.cardDiscardable(card, player));
					});
				},
				async cost(event, trigger, player) {
					let list = [],
						map = { h: "手牌区", e: "装备区", j: "判定区" };
					list.addArray(
						["h", "e", "j"]
							.filter(pos => {
								const cards = player.getCards(pos);
								return cards.length > 0 && cards.every(card => lib.filter.cardDiscardable(card, player));
							})
							.map(i => map[i])
					);
					list.push("cancel2");
					const {
						result: { control },
					} = await player
						.chooseControl(list)
						.set("prompt", get.prompt2("fakedanshou", trigger.player))
						.set("ai", () => {
							const player = get.event().player,
								controls = get.event().controls.slice();
							if (controls.includes("判定区")) return "判定区";
							if (controls.includes("装备区") && player.countCards("e") < 3) return "装备区";
							if (controls.includes("手牌区") && player.countCards("e") < 5) return "手牌区";
							return "cancel2";
						});
					event.result = { bool: control != "cancel2", cost_data: control };
				},
				round: 1,
				logTarget: "player",
				async content(event, trigger, player) {
					player.popup(event.cost_data);
					await player.discard(player.getCards({ 手牌区: "h", 装备区: "e", 判定区: "j" }[event.cost_data]));
					player.addTempSkill("fakedanshou_effect");
					player.addMark("fakedanshou_effect", 1, false);
				},
				subSkill: {
					effect: {
						charlotte: true,
						onremove(player) {
							delete player.storage.fakedanshou_effect;
							delete player._fakedanshou_effect;
						},
						audio: "mobiledanshou",
						trigger: {
							global: ["phaseJudgeBegin", "phaseDrawBegin", "phaseUseBegin", "phaseDiscardBegin"],
						},
						async cost(event, trigger, player) {
							const {
								result: { control },
							} = await player
								.chooseControl("摸牌", "增加摸牌数")
								.set("prompt", `胆守：请选择一项（当前为${get.translation(trigger.name)}）`)
								.set("ai", () => {
									const player = get.event().player,
										trigger = get.event().getTrigger();
									if (trigger.name == "phaseJudge") return "增加摸牌数";
									if (trigger.name == "phaseDiscard") return "摸牌";
									if (trigger.name == "phaseDraw") {
										if (get.damageEffect(trigger.player, player, player) > 0) {
											player._fakedanshou_effect = true;
											return "增加摸牌数";
										}
									}
									return player._fakedanshou_effect ? "增加摸牌数" : "摸牌";
								});
							event.result = { bool: true, cost_data: control };
						},
						logTarget: "player",
						async content(event, trigger, player) {
							if (event.cost_data == "增加摸牌数") {
								player.addMark("fakedanshou_effect", 1, false);
							} else {
								const num = player.countMark("fakedanshou_effect");
								await player.draw(num);
								if (num >= 4) {
									const {
										result: { bool },
									} = await player.chooseBool("胆守：是否对" + get.translation(trigger.player) + "造成1点伤害？").set("choice", get.damageEffect(trigger.player, player, player) > 0);
									if (bool) {
										player.line(trigger.player);
										await trigger.player.damage();
									}
								}
							}
						},
					},
				},
			},
			fakexunxi: {
				trigger: { global: "showCharacterEnd" },
				filter(event, player) {
					const card = new lib.element.VCard({ name: "sha" });
					return event.player != player && event.player != _status.currentPhase && player.canUse(card, event.player, false);
				},
				check(event, player) {
					const card = new lib.element.VCard({ name: "sha" });
					return get.effect(event.player, card, player, player) > 0;
				},
				logTarget: "player",
				async content(event, trigger, player) {
					const card = new lib.element.VCard({ name: "sha" });
					await player.useCard(card, trigger.player, false);
				},
			},
			fakehuanjia: {
				trigger: {
					player: "useCardToPlayered",
					target: "useCardToTargeted",
				},
				filter(event, player) {
					if (event.card.name != "sha") return false;
					if (event.target == player) {
						if (player.getStorage("fakehuanjia_used").includes(2)) return false;
						return event.player.getEquips(2).length;
					}
					if (event.targets.length != 1) return false;
					if (player.getStorage("fakehuanjia_used").includes(1)) return false;
					return event.target.getEquips(1).length;
				},
				logTarget(event, player) {
					return event.target == player ? event.player : event.target;
				},
				forced: true,
				async content(event, trigger, player) {
					player.addTempSkill("fakehuanjia_used");
					if (trigger.target == player) {
						player.markAuto("fakehuanjia_used", [2]);
						if (!player.getEquips(2).length && player.hasEmptySlot(2)) {
							player.addSkill("fakehuanjia_equip2");
							player.markAuto("fakehuanjia_equip2", [trigger.player]);
							player
								.when({
									global: "phaseAfter",
									player: ["equipEnd", "disableEquipEnd", "die"],
								})
								.filter((evt, player) => {
									if (evt.name == "phase" || evt.name == "die") return true;
									if (evt.name == "discardEquip") return !player.hasEmptySlot(2);
									return get.type(evt.card) == "equip2";
								})
								.then(() => player.removeSkill("fakehuanjia_equip2"));
							const cards = trigger.player.getEquips(2);
							if (cards.length) {
								const skills = cards.reduce((list, card) => {
									if (get.info(card) && get.info(card).skills) list.addArray(get.info(card).skills);
									return list;
								}, []);
								if (skills.length) player.addAdditionalSkill("fakehuanjia_equip2", skills);
							}
						}
					} else {
						player.markAuto("fakehuanjia_used", [1]);
						if (!player.getEquips(1).length && player.hasEmptySlot(1)) {
							player.addSkill("fakehuanjia_equip1");
							player.markAuto("fakehuanjia_equip1", [trigger.target]);
							player
								.when({
									global: "phaseAfter",
									player: ["equipEnd", "disableEquipEnd", "die"],
								})
								.filter((evt, player) => {
									if (evt.name == "phase" || evt.name == "die") return true;
									if (evt.name == "discardEquip") return !player.hasEmptySlot(1);
									return get.type(evt.card) == "equip1";
								})
								.then(() => player.removeSkill("fakehuanjia_equip1"));
							const cards = trigger.target.getEquips(1);
							if (cards.length) {
								const skills = cards.reduce((list, card) => {
									if (get.info(card) && get.info(card).skills) list.addArray(get.info(card).skills);
									return list;
								}, []);
								if (skills.length) player.addAdditionalSkill("fakehuanjia_equip1", skills);
							}
						}
					}
				},
				subSkill: {
					used: {
						charlotte: true,
						onremove: true,
					},
					equip1: {
						charlotte: true,
						onremove: true,
						mark: true,
						marktext: "攻",
						mod: {
							attackRange(player, num) {
								const targets = player.getStorage("fakehuanjia_equip1").filter(i => i.isIn());
								return (
									num +
									targets.reduce((sum, target) => {
										return sum + target.getEquipRange();
									}, 0)
								);
							},
						},
						intro: { content: "视为装备$的武器" },
						trigger: {
							global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter", "die"],
						},
						filter(event, player) {
							return game.hasPlayer(target => {
								if (!player.getStorage("fakehuanjia_equip1").includes(target)) return false;
								if (event.name == "die" && event.player == target) return true;
								if (event.name == "equip" && event.player == target) return get.subtype(event.card) == "equip1";
								if (event.getl) {
									const evt = event.getl(target);
									return evt && evt.player == target && evt.es && evt.es.some(i => get.subtype(i) == "equip1");
								}
								return false;
							});
						},
						forced: true,
						popup: false,
						content() {
							const targets = player.getStorage("fakehuanjia_equip1").filter(i => i.isIn());
							const skills = targets.reduce((list, target) => {
								const cards = target.getEquips(1);
								if (cards.length) {
									const skills = cards.reduce((listx, card) => {
										if (get.info(card) && get.info(card).skills) listx.addArray(get.info(card).skills);
										return listx;
									}, []);
									if (skills.length) list.addArray(skills);
								}
								return list;
							}, []);
							player.addAdditionalSkill("fakehuanjia_equip1", skills);
						},
					},
					equip2: {
						charlotte: true,
						onremove: true,
						mark: true,
						marktext: "防",
						intro: { content: "视为装备$的防具" },
						trigger: {
							global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter", "die"],
						},
						filter(event, player) {
							return game.hasPlayer(target => {
								if (!player.getStorage("fakehuanjia_equip2").includes(target)) return false;
								if (event.name == "die" && event.player == target) return true;
								if (event.name == "equip" && event.player == target) return get.subtype(event.card) == "equip2";
								if (event.getl) {
									const evt = event.getl(target);
									return evt && evt.player == target && evt.es && evt.es.some(i => get.subtype(i) == "equip2");
								}
								return false;
							});
						},
						forced: true,
						popup: false,
						content() {
							const targets = player.getStorage("fakehuanjia_equip2").filter(i => i.isIn());
							const skills = targets.reduce((list, target) => {
								const cards = target.getEquips(2);
								if (cards.length) {
									const skills = cards.reduce((listx, card) => {
										if (get.info(card) && get.info(card).skills) listx.addArray(get.info(card).skills);
										return listx;
									}, []);
									if (skills.length) list.addArray(skills);
								}
								return list;
							}, []);
							player.addAdditionalSkill("fakehuanjia_equip2", skills);
						},
					},
				},
			},
			fakexiongshu: {
				audio: "xiongshu",
				trigger: { global: "useCardToPlayered" },
				filter(event, player) {
					if (!event.isFirstTarget) return false;
					if (event.player == player && game.countPlayer() < 2) return false;
					if (event.player != player && !player.countDiscardableCards(player, "he")) return false;
					return event.card.name == "sha" || (get.type(event.card) == "trick" && get.tag(event.card, "damage"));
				},
				check(event, player) {
					if (event.player == player) {
						if (event.targets.some(i => i.hasSkill("gzduanchang"))) return true;
						return !event.targets.some(i => i.getHp() == 1 && !i.hasSkill("gzbuqu") && i.isEnemyOf(player));
					}
					if (event.targets.some(i => i.hasSkill("gzduanchang"))) return false;
					return event.targets.some(i => i.getHp() == 1 && !i.hasSkill("gzbuqu") && i.isEnemyOf(player));
				},
				usable: 1,
				async content(event, trigger, player) {
					if (trigger.player == player) {
						await player.draw();
						const {
							result: { bool, targets },
						} = await player.chooseTarget("令一名其他角色成为" + get.translation(trigger.card) + "的伤害来源", true, lib.filter.notMe).set("ai", target => {
							const player = get.event("player"),
								targets = get.event().getTrigger().targets;
							const goon = player.hasSkill("fakejianhui") && targets.some(i => i != target && i.isFriendOf(target));
							return targets.reduce((sum, i) => sum + get.damageEffect(i, target, player), 0) * (goon ? 3 : 1);
						});
						if (bool) {
							const target = targets[0];
							player.line(target);
							game.log(target, "成为了", trigger.card, "的伤害来源");
							trigger.getParent().customArgs.default.customSource = target;
						}
					} else {
						await player.chooseToDiscard("he", true);
						game.log(player, "成为了", trigger.card, "的伤害来源");
						trigger.getParent().customArgs.default.customSource = player;
					}
				},
			},
			fakejianhui: {
				audio: "jianhui",
				trigger: { global: "damageSource" },
				filter(event, player) {
					if (!event.source || !event.player || !event.source.isIn() || !event.player.isIn() || event.source == event.player) return false;
					return event.source.isFriendOf(event.player) && [event.source, event.player].some(target => target.countCards("he"));
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget(
							get.prompt2("fakejianhui"),
							(card, player, target) => {
								const trigger = get.event().getTrigger();
								if (!(trigger.source == target || trigger.player == target)) return false;
								if (!ui.selected.targets.length) return true;
								return target.countCards("he");
							},
							2
						)
						.set("targetprompt", ["摸牌", "拆牌"])
						.set("ai", target => {
							const player = get.event("player"),
								trigger = get.event().getTrigger();
							const source = trigger.source,
								playerx = trigger.player;
							const min = -Math.min(get.effect(source, { name: "draw" }, player, player), get.effect(playerx, { name: "draw" }, player, player));
							const max = Math.max(get.effect(source, { name: "guohe_copy" }, player, player), get.effect(playerx, { name: "guohe_copy" }, player, player));
							if (min > max) return 0;
							if (!ui.selected.targets.length) return -1 / Math.min(get.effect(target, { name: "draw" }, player, player), -0.001);
							return get.effect(target, { name: "guohe_copy" }, player, player);
						})
						.set("complexSelect", true)
						.set("complexTarget", true)
						.forResult();
				},
				popup: false,
				async content(event, trigger, player) {
					player.logSkill("fakejianhui", event.targets, false);
					player.line2(event.targets);
					await event.targets[0].draw();
					await player.discardPlayerCard(event.targets[1], "he", true);
				},
			},
			fakechongxin: {
				audio: "chongxin",
				enable: "phaseUse",
				viewAs: {
					name: "yiyi",
					isCard: true,
				},
				usable: 1,
				filter(event, player) {
					const card = new lib.element.VCard({ name: "yiyi" });
					return lib.filter.targetEnabled2(card, player, player) && game.hasPlayer(target => lib.skill.fakechongxin.filterTarget(card, player, target));
				},
				selectTarget: 1,
				filterTarget(card, player, target) {
					if (game.checkMod(card, player, target, "unchanged", "playerEnabled", player) == false) return false;
					if (game.checkMod(card, player, target, "unchanged", "targetEnabled", target) == false) return false;
					return target.isEnemyOf(player);
				},
				filterCard: () => false,
				selectCard: -1,
				precontent() {
					event.result.targets.add(player);
				},
				ai: {
					order(item, player) {
						return get.order({ name: "yiyi" }, player) + 0.1;
					},
					result: {
						target(player, target) {
							const card = new lib.element.VCard({ name: "yiyi" });
							const num = get.sgn(get.attitude(player, target));
							return num * (get.effect(player, card, player, player) - get.effect(target, card, player, player));
						},
					},
				},
			},
			fakeweirong: {
				zhuanhuanji: true,
				locked: false,
				marktext: "☯",
				intro: {
					content(storage) {
						if (storage) return "出牌阶段，你可以摸X张牌，然后当你于本轮不因此法失去牌后，你弃置一张牌。（X为你上一轮以此法摸和弃置的牌数之和，且X至少为1，至多为你的体力上限）";
						return "出牌阶段，你可以弃置X张牌，然后当你于本轮不因此法得到牌后，你摸一张牌。（X为你上一轮以此法摸和弃置的牌数之和，且X至少为1，至多为你的体力上限）";
					},
				},
				audio: "weishu",
				enable: "phaseUse",
				filter(event, player) {
					if (!get.info("fakeweirong").getNum(player)) return false;
					const storage = player.storage.fakeweirong;
					return storage || player.countCards("he", card => lib.filter.cardDiscardable) >= get.info("fakeweirong").getNum(player);
				},
				filterCard(card, player) {
					return !Boolean(player.storage.fakeweirong) && lib.filter.cardDiscardable(card, player);
				},
				selectCard() {
					const player = get.event("player");
					return player.storage.fakeweirong ? -1 : get.info("fakeweirong").getNum(player);
				},
				check(card) {
					return 7.5 - get.value(card);
				},
				prompt() {
					const player = get.event("player");
					const num = get.info("fakeweirong").getNum(player);
					if (player.storage.fakeweirong) return "摸" + get.cnNumber(num) + "张牌，然后当你于本轮不因此法失去牌后，你弃置一张牌";
					return "弃置" + get.cnNumber(num) + "张牌，然后当你于本轮不因此法得到牌后，你摸一张牌";
				},
				round: 1,
				async content(event, trigger, player) {
					const storage = player.storage.fakeweirong;
					player.changeZhuanhuanji("fakeweirong");
					if (storage) await player.draw(get.info("fakeweirong").getNum(player));
					player.addTempSkill("fakeweirong_" + (storage ? "lose" : "gain"), "roundStart");
				},
				ai: {
					order(item, player) {
						const storage = player.storage.fakeweirong;
						return storage ? 0.01 : 9;
					},
					result: { player: 1 },
				},
				group: "fakeweirong_mark",
				subSkill: {
					mark: {
						charlotte: true,
						trigger: { player: ["hideCharacterBegin", "showCharacterEnd"] },
						filter(event, player) {
							return get.character(event[event.name == "hideCharacter" ? "toHide" : "toShow"], 3).includes("fakeweirong");
						},
						forced: true,
						popup: false,
						firstDo: true,
						content() {
							player[(trigger.name == "hideCharacter" ? "un" : "") + "markSkill"]("fakeweirong");
						},
					},
					gain: {
						charlotte: true,
						mark: true,
						marktext: "↑",
						intro: { content: "不因此法得到牌后，你摸一张牌" },
						audio: "weishu",
						trigger: { player: "gainAfter", global: "loseAsyncAfter" },
						filter(event, player) {
							if (!event.getg || !event.getg(player).length) return false;
							return event.getParent(2).name != "fakeweirong_gain";
						},
						forced: true,
						content() {
							player.draw();
						},
					},
					lose: {
						charlotte: true,
						mark: true,
						marktext: "↓",
						intro: { content: "不因此法失去牌后，你弃置一张牌" },
						audio: "weishu",
						trigger: { player: "loseAfter", global: "loseAsyncAfter" },
						filter(event, player) {
							if (!player.countCards("he")) return false;
							const evt = event.getl(player);
							if (!evt || !evt.cards2 || !evt.cards2.length) return false;
							return event.getParent(3).name != "fakeweirong_lose";
						},
						forced: true,
						content() {
							player.chooseToDiscard("he", true);
						},
					},
				},
				getNum(player) {
					let num = 0,
						count = false;
					const history = player.actionHistory;
					for (let i = history.length - 1; i >= 0; i--) {
						if (history[i].isRound) {
							if (!count) {
								count = true;
								continue;
							} else break;
						}
						if (!count) continue;
						const allHistory = history[i].gain
							.filter(evt => {
								return evt.getParent(2).name == "fakeweirong" || evt.getParent(2).name == "fakeweirong_gain";
							})
							.slice()
							.concat(
								history[i].lose.filter(evt => {
									return evt.getParent(2).skill == "fakeweirong" || evt.getParent(3).name == "fakeweirong_lose";
								})
							);
						for (const evt of allHistory) num += evt.cards.length;
					}
					return Math.max(1, Math.min(player.maxHp, num));
				},
			},
			fakequanbian: {
				audio: "quanbian",
				trigger: { player: ["useCard", "respond"] },
				filter(event, player) {
					if (!Array.from(ui.cardPile.childNodes).length) return false;
					return player.countCards("h") && _status.currentPhase == player;
				},
				async cost(event, trigger, player) {
					const cards = Array.from(ui.cardPile.childNodes);
					const {
						result: { bool, moved },
					} = await player
						.chooseToMove(get.prompt2("fakequanbian"))
						.set("list", [
							["牌堆顶", cards.slice(0, Math.min(player.maxHp, cards.length)), "fakequanbian_tag"],
							["手牌", player.getCards("h")],
						])
						.set("filterOk", moved => moved[1].filter(i => !get.owner(i)).length == 1)
						.set("filterMove", (from, to) => typeof to != "number")
						.set("processAI", list => {
							const player = get.event("player"),
								goon = player.hasSkill("fakezhouting");
							let cards1 = list[0][1].slice(),
								cards2 = list[1][1].slice();
							let card1 = cards1.slice().sort((a, b) => get[goon ? "useful" : "value"](goon ? a : b) - get[goon ? "useful" : "value"](goon ? b : a))[0];
							let card2 = cards2.slice().sort((a, b) => get[goon ? "useful" : "value"](goon ? b : a) - get[goon ? "useful" : "value"](goon ? a : b))[0];
							if (get[goon ? "useful" : "value"](card1) * (goon ? -1 : 1) < get[goon ? "useful" : "value"](card2) * (goon ? -1 : 1)) {
								cards1.remove(card1);
								cards2.remove(card2);
								return [cards1.concat(card2), cards2.concat(card1)];
							}
						});
					if (bool) {
						event.result = {
							bool: true,
							cost_data: [moved[0].filter(i => get.owner(i))[0], moved[1].filter(i => !get.owner(i))[0]],
						};
					} else event.result = { bool: false };
				},
				async content(event, trigger, player) {
					await player
						.lose(event.cost_data[0], ui.cardPile)
						.set("insert_index", () => {
							return ui.cardPile.childNodes[Array.from(ui.cardPile.childNodes).indexOf(get.event("card2"))];
						})
						.set("card2", event.cost_data[1]);
					await player.gain(event.cost_data[1], "gain2");
				},
			},
			fakezhouting: {
				unique: true,
				limited: true,
				audio: "xiongzhi",
				enable: "phaseUse",
				skillAnimation: true,
				animationColor: "thunder",
				async content(event, trigger, player) {
					player.awakenSkill("fakezhouting");
					let gains = [];
					const cards = Array.from(ui.cardPile.childNodes).slice(0, Math.min(player.maxHp, Array.from(ui.cardPile.childNodes).length));
					await game.cardsGotoOrdering(cards);
					for (const card of cards) {
						if (player.hasUseTarget(card, false, false)) {
							await player.chooseUseTarget(card, true, false, "nodistance");
						} else gains.push(card);
					}
					if (gains.length) await player.gain(gains, "gain2");
					if (
						game.getGlobalHistory("everything", evt => {
							return evt.name == "die" && evt.getParent(6) == event && evt.getParent(6).player == player;
						}).length
					)
						player.restoreSkill("fakezhouting");
				},
				ai: {
					order: 1,
					result: {
						player(player) {
							return player.hasUnknown() ? 0 : 1;
						},
					},
				},
			},
			fakexuanbei: {
				audio: "xuanbei",
				trigger: { player: "showCharacterEnd" },
				filter(event, player) {
					return (
						game
							.getAllGlobalHistory(
								"everything",
								evt => {
									return evt.name == "showCharacter" && evt.player == player && evt.toShow.some(i => get.character(i, 3).includes("fakexuanbei"));
								},
								event
							)
							.indexOf(event) == 0
					);
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					await player.draw(2);
					player.addTempSkill("fakexuanbei_effect");
				},
				group: ["fakexuanbei_change", "fakexuanbei_give"],
				subSkill: {
					effect: {
						charlotte: true,
						mark: true,
						intro: { content: "使用应变牌时直接获得强化" },
					},
					give: {
						audio: "xuanbei",
						trigger: { player: "useCardAfter" },
						filter(event, player) {
							return (event.card.yingbian || get.is.yingbian(event.card)) && event.cards.filterInD().length;
						},
						usable: 1,
						async cost(event, trigger, player) {
							const cards = trigger.cards.filterInD();
							const {
								result: { bool, targets },
							} = await player.chooseTarget(get.prompt("fakexuanbei"), "令一名其他角色获得" + get.translation(event.cards), lib.filter.notMe).set("ai", target => {
								const att = get.attitude(get.event("player"), target);
								if (att < 0) return 0;
								if (target.hasJudge("lebu")) att /= 2;
								if (target.hasSkillTag("nogain")) att /= 10;
								return att / (1 + get.distance(player, target, "absolute"));
							});
							event.result = { bool: bool, targets: targets, cards: cards };
						},
						async content(event, trigger, player) {
							await event.targets[0].gain(event.cards, "gain2").set("giver", player);
						},
					},
					change: {
						audio: "xuanbei",
						trigger: { player: "die" },
						direct: true,
						forceDie: true,
						skillAnimation: true,
						animationColor: "thunder",
						async cost(event, trigger, player) {
							const {
								result: { bool, targets },
							} = await player
								.chooseTarget(get.prompt("fakexuanbei"), "令一名其他角色变更副将", lib.filter.notMe)
								.set("ai", target => {
									const player = get.event("player");
									const rank = get.guozhanRank(target.name2, target) <= 3;
									const att = get.attitude(player, target);
									if (att > 0) return (4 - rank) * att;
									return -(rank - 6) * att;
								})
								.set("forceDie", true);
							event.result = { bool: bool, targets: targets };
						},
						async content(event, trigger, player) {
							await event.targets[0].changeVice();
						},
					},
				},
			},
			fakeqingleng: {
				audio: "qingleng",
				trigger: { global: "phaseEnd" },
				filter(event, player) {
					var target = event.player;
					return target != player && target.isIn() && !target.isUnseen(2) && player.countCards("he") && player.canUse({ name: "sha", nature: "ice" }, target, false);
				},
				direct: true,
				preHidden: true,
				async content(event, trigger, player) {
					const target = trigger.player;
					const {
						result: { bool },
					} = await player
						.chooseToUse()
						.set("openskilldialog", get.prompt2("fakeqingleng", target))
						.set("norestore", true)
						.set("_backupevent", "fakeqingleng_backup")
						.set("custom", {
							add: {},
							replace: { window() {} },
						})
						.set("targetRequired", true)
						.set("complexSelect", true)
						.set("filterTarget", function (card, player, target) {
							if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
							return lib.filter.targetEnabled.apply(this, arguments);
						})
						.set("sourcex", target)
						.set("addCount", false)
						.setHiddenSkill("fakeqingleng")
						.backup("fakeqingleng_backup")
						.set("logSkill", ["fakeqingleng", target]);
					if (
						bool &&
						!player.getHistory("sourceDamage", evt => {
							return evt.getParent(4) == event;
						}).length
					) {
						const {
							result: { bool, links },
						} = await player.chooseButton(["清冷：暗置" + get.translation(target) + "的一张武将牌", '<div class="text center">' + get.translation(target) + "的武将牌</div>", [[target.name1, target.name2], "character"]], true).set("filterButton", button => !get.is.jun(button.link));
						if (bool) {
							player.line(target);
							player.addSkill("fakeqingleng_effect");
							if (player.getStorage("fakeqingleng_effect").some(list => list[0] == target)) {
								player.storage.fakeqingleng_effect.indexOf(player.getStorage("fakeqingleng_effect").find(list => list[0] == target))[1].addArray(links);
							} else player.markAuto("fakeqingleng_effect", [[target, links[0]]]);
							target
								.when(["phaseBegin", "die"])
								.vars({ target: player })
								.then(() => {
									const removes = target.getStorage("fakeqingleng_effect").filter(list => list[0] == player);
									target.unmarkAuto("fakeqingleng_effect", removes);
									if (!target.getStorage("fakeqingleng_effect").length) {
										target.removeSkill("fakeqingleng_effect");
									}
								});
							await target.hideCharacter(target.name1 == links[0] ? 0 : 1);
						}
					}
				},
				subSkill: {
					backup: {
						filterCard(card) {
							return get.itemtype(card) == "card";
						},
						check(card) {
							return 7.5 - get.value(card);
						},
						position: "he",
						popname: true,
						viewAs: { name: "sha", nature: "ice" },
						precontent() {
							delete event.result.skill;
						},
					},
					effect: {
						charlotte: true,
						onremove: true,
						intro: {
							content(storage) {
								return (
									"•" +
									storage
										.map(list => {
											return get.translation(list[0]) + "明置" + get.translation(list[1]) + "后，对其造成1点伤害";
										})
										.join("<br>•")
								);
							},
						},
						audio: "qingleng",
						trigger: { global: "showCharacterEnd" },
						filter(event, player) {
							const list = player.getStorage("fakeqingleng_effect").find(list => list[0] == event.player);
							return list && list[1].includes(event.toShow);
						},
						forced: true,
						logTarget: "player",
						content() {
							trigger.player.damage();
						},
					},
				},
			},
			fakexijue: {
				audio: "xijue",
				trigger: { player: "showCharacterEnd" },
				filter(event, player) {
					return (
						game
							.getAllGlobalHistory(
								"everything",
								evt => {
									return evt.name == "showCharacter" && evt.player == player && evt.toShow.some(i => get.character(i, 3).includes("fakexijue"));
								},
								event
							)
							.indexOf(event) == 0
					);
				},
				forced: true,
				locked: false,
				popup: false,
				preHidden: ["xijue_tuxi", "fakexijue_xiaoguo"],
				content() {
					player.addMark("xijue", 2);
				},
				derivation: ["xijue_tuxi", "fakexijue_xiaoguo"],
				group: ["fakexijue_effect", "xijue_tuxi", "fakexijue_xiaoguo"],
				subSkill: {
					effect: {
						audio: "xijue",
						trigger: { player: ["phaseDrawBegin2", "phaseEnd"] },
						filter(event, player) {
							if (event.name == "phaseDraw") return !event.numFixed;
							return player.getHistory("sourceDamage").length;
						},
						forced: true,
						popup: false,
						content() {
							if (trigger.name == "phaseDraw") trigger.num = Math.min(player.countMark("xijue"), player.maxHp);
							else player.addMark("xijue", 1);
						},
					},
					xiaoguo: {
						audio: "xijue_xiaoguo",
						trigger: { global: "phaseZhunbeiBegin" },
						filter(event, player) {
							if (!player.hasMark("xijue")) return false;
							return (
								event.player != player &&
								player.countCards("h", card => {
									if (_status.connectMode) return true;
									return get.type(card) == "basic" && lib.filter.cardDiscardable(card, player);
								})
							);
						},
						async cost(event, trigger, player) {
							event.result = await player
								.chooseToDiscard(
									get.prompt2("fakexijue_xiaoguo", trigger.player),
									(card, player) => {
										return get.type(card) == "basic";
									},
									[1, Math.min(player.countMark("xijue"), player.maxHp)]
								)
								.set("complexSelect", true)
								.set("ai", card => {
									const player = get.event("player"),
										target = get.event().getTrigger().player;
									const effect = get.damageEffect(target, player, player);
									const cards = target.getCards("e", card => get.attitude(player, target) * get.value(card, target) < 0);
									if (effect <= 0 && !cards.length) return 0;
									if (ui.selected.cards.length > cards.length - (effect <= 0 ? 1 : 0)) return 0;
									return 1 / (get.value(card) || 0.5);
								})
								.set("logSkill", ["fakexijue_xiaoguo", trigger.player])
								.setHiddenSkill("fakexijue_xiaoguo")
								.forResult();
						},
						preHidden: true,
						popup: false,
						async content(event, trigger, player) {
							const num = trigger.player.countCards("e"),
								num2 = event.cards.length;
							await player.discardPlayerCard(trigger.player, "e", num2, true);
							if (num2 > num) await trigger.player.damage();
							player.removeMark("xijue", 1);
						},
					},
				},
			},
			fakeqimei: {
				audio: "qimei",
				trigger: { player: "phaseZhunbeiBegin" },
				direct: true,
				preHidden: true,
				content() {
					"step 0";
					player
						.chooseTarget(get.prompt("fakeqimei"), "选择一名其他角色并获得“齐眉”效果", lib.filter.notMe)
						.set("ai", target => {
							var player = _status.event.player;
							return get.attitude(player, target) / (Math.abs(player.countCards("h") + 2 - target.countCards("h")) + 1);
						})
						.setHiddenSkill("fakeqimei");
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill("fakeqimei", target);
						player.addTempSkill("fakeqimei_draw");
						player.storage.fakeqimei_draw = target;
						game.delayx();
					}
				},
				subSkill: {
					draw: {
						audio: "qimei",
						charlotte: true,
						forced: true,
						popup: false,
						trigger: {
							global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "loseAfter", "addToExpansionAfter"],
						},
						filter(event, player) {
							var target = player.storage.fakeqimei_draw;
							if (!target || !target.isIn()) return false;
							if (player.countCards("h") != target.countCards("h")) return false;
							var hasChange = function (event, player) {
								var gain = 0,
									lose = 0;
								if (event.getg) gain = event.getg(player).length;
								if (event.getl) lose = event.getl(player).hs.length;
								return gain != lose;
							};
							return (hasChange(event, player) && target.isDamaged()) || (hasChange(event, target) && player.isDamaged());
						},
						content() {
							"step 0";
							if (trigger.delay === false) game.delayx();
							"step 1";
							var target = player.storage.fakeqimei_draw;
							player.logSkill("fakeqimei_draw", target);
							var drawer = [];
							var hasChange = function (event, player) {
								var gain = 0,
									lose = 0;
								if (event.getg) gain = event.getg(player).length;
								if (event.getl) lose = event.getl(player).hs.length;
								return gain != lose;
							};
							if (hasChange(trigger, player)) drawer.push(target);
							if (hasChange(trigger, target)) drawer.push(player);
							for (const i of drawer) {
								if (i.isDamaged()) i.recover();
							}
						},
						group: "fakeqimei_hp",
						onremove: true,
						mark: true,
						intro: { content: "已和$组成齐眉组合" },
					},
					hp: {
						audio: "qimei",
						trigger: { global: "changeHp" },
						charlotte: true,
						forced: true,
						logTarget(event, player) {
							return player.storage.fakeqimei_draw;
						},
						filter(event, player) {
							var target = player.storage.fakeqimei_draw;
							if (!target || !target.isIn()) return false;
							if (player != event.player && target != event.player) return false;
							return player.hp == target.hp;
						},
						content() {
							game.delayx();
							(player == trigger.player ? player.storage.fakeqimei_draw : player).draw();
						},
					},
				},
			},
			fakebaoqie: {
				unique: true,
				audio: "baoqie",
				trigger: { player: "showCharacterEnd" },
				filter(event, player) {
					if (
						!game.hasPlayer(target => {
							return target.getGainableCards(player, "e").some(card => get.subtype(card) == "equip5");
						})
					)
						return false;
					return (
						game
							.getAllGlobalHistory(
								"everything",
								evt => {
									return evt.name == "showCharacter" && evt.player == player && evt.toShow.some(i => get.character(i, 3).includes("fakebaoqie"));
								},
								event
							)
							.indexOf(event) == 0
					);
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget(get.prompt("fakebaoqie"), "获得一名角色装备区里所有的宝物牌，然后你可以使用其中的一张牌", (card, player, target) => {
							return target.getGainableCards(player, "e").some(card => get.subtype(card) == "equip5");
						})
						.set("ai", target => {
							const player = get.event("player");
							return (
								-get.sgn(get.attitude(player, target)) *
								target
									.getGainableCards(player, "e")
									.filter(card => {
										return get.subtype(card) == "equip5";
									})
									.reduce((sum, card) => sum + get.value(card, target), 0)
							);
						})
						.forResult();
				},
				async content(event, trigger, player) {
					const target = event.targets[0];
					let cards = target.getGainableCards(player, "e").filter(card => get.subtype(card) == "equip5");
					await player.gain(cards, target, "giveAuto");
					cards = cards.filter(i => get.owner(i) == player && get.position(i) == "h" && player.hasUseTarget(i));
					if (cards.length) {
						const {
							result: { bool, links },
						} = await player.chooseButton(["宝箧：是否使用其中的一张宝物牌？", cards]).set("ai", button => {
							return get.equipValue(button.link, get.event("player"));
						});
						if (bool) await player.chooseUseTarget(links[0], true);
					}
				},
				ai: { mingzhi_no: true },
				group: "fakebaoqie_damage",
				subSkill: {
					damage: {
						audio: "baoqie",
						trigger: { player: "damageBegin4" },
						filter(event, player) {
							if (!player.getStockSkills(true, true, true).includes("fakebaoqie")) return false;
							return !game.getAllGlobalHistory("everything", evt => {
								return evt.name == "showCharacter" && evt.player == player && evt.toShow.some(i => get.character(i, 3).includes("fakebaoqie"));
							}).length;
						},
						check(event, player) {
							return !event.source || get.damageEffect(player, event.source, player) < 0;
						},
						prompt: "宝箧：是否明置此武将牌并防止此伤害？",
						content() {
							trigger.cancel();
						},
					},
				},
			},
			fakeciwei: {
				audio: "ciwei",
				trigger: { global: "useCard" },
				filter(event, player) {
					if (event.all_excluded || event.player == player || !player.countCards("he")) return false;
					return event.player.getHistory("useCard").indexOf(event) % 2 == 1;
				},
				async cost(event, trigger, player) {
					let str = "弃置一张牌，取消" + get.translation(trigger.card) + "的所有目标";
					if (get.type(trigger.card) == "equip") str += "，然后你获得此牌且你可以使用之";
					event.result = await player
						.chooseToDiscard(get.prompt("fakeciwei", trigger.player), str, "he")
						.set("ai", card => {
							return _status.event.goon / 1.4 - get.value(card);
						})
						.set(
							"goon",
							(function () {
								if (!trigger.targets.length) return -get.attitude(player, trigger.player);
								var num = 0;
								for (var i of trigger.targets) {
									num -= get.effect(i, trigger.card, trigger.player, player);
								}
								return num;
							})()
						)
						.setHiddenSkill("fakeciwei")
						.set("logSkill", ["fakeciwei", trigger.player])
						.forResult();
				},
				preHidden: true,
				popup: false,
				async content(event, trigger, player) {
					trigger.targets.length = 0;
					trigger.all_excluded = true;
					const cards = trigger.cards.filterInD();
					if (cards.length && get.type(trigger.card) == "equip") {
						await player.gain(cards, "gain2");
						for (let i of cards) {
							if (player.getCards("h").includes(i) && player.hasUseTarget(i)) {
								await player.chooseUseTarget(i);
							}
						}
					}
				},
				global: "fakeciwei_ai",
				subSkill: {
					ai: {
						mod: {
							aiOrder(player, card, num) {
								if (
									!player.getHistory("useCard").length % 2 ||
									!game.hasPlayer(current => {
										return current != player && (get.realAttitude || get.attitude)(current, player) < 0 && current.hasSkill("fakeciwei") && current.countCards("he") > 0;
									})
								)
									return;
								if (!player._fakeciwei_temp) {
									player._fakeciwei_temp = true;
									num /= Math.max(1, player.getUseValue(card));
								}
								delete player._fakeciwei_temp;
								return num;
							},
						},
					},
				},
			},
			fakehuirong: {
				unique: true,
				audio: "huirong",
				trigger: { player: "showCharacterEnd" },
				filter(event, player) {
					if (
						!game.hasPlayer(target => {
							return target.countCards("h") != target.getHp();
						})
					)
						return false;
					return (
						game
							.getAllGlobalHistory(
								"everything",
								evt => {
									return evt.name == "showCharacter" && evt.player == player && evt.toShow.some(i => get.character(i, 3).includes("fakehuirong"));
								},
								event
							)
							.indexOf(event) == 0
					);
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget(get.prompt("fakehuirong"), "令一名角色将手牌数摸至/弃置至与其体力值相同", (card, player, target) => {
							return target.countCards("h") != target.getHp();
						})
						.set("ai", target => {
							const att = get.attitude(get.event("player"), target);
							const num = target.countCards("h");
							if (num > target.hp) return -att * (num - target.getHp());
							return att * Math.max(0, target.getHp() - target.countCards("h"));
						})
						.forResult();
				},
				preHidden: true,
				content() {
					const target = event.targets[0];
					if (target.countCards("h") < target.getHp()) target.drawTo(target.getHp());
					else target.chooseToDiscard("h", true, target.countCards("h") - target.getHp());
				},
				ai: { mingzhi_no: true },
				group: "fakehuirong_damage",
				subSkill: {
					damage: {
						audio: "huirong",
						trigger: { player: "damageBegin4" },
						filter(event, player) {
							if (!player.getStockSkills(true, true, true).includes("fakehuirong")) return false;
							return !game.getAllGlobalHistory("everything", evt => {
								return evt.name == "showCharacter" && evt.player == player && evt.toShow.some(i => get.character(i, 3).includes("fakehuirong"));
							}).length;
						},
						check(event, player) {
							return !event.source || get.damageEffect(player, event.source, player) < 0;
						},
						prompt: "慧容：是否明置此武将牌并防止此伤害？",
						content() {
							trigger.cancel();
						},
					},
				},
			},
			fakeyanxi: {
				audio: "yanxi",
				enable: "phaseUse",
				filter(event, player) {
					return game.hasPlayer(target => {
						return get.info("fakeyanxi").filterTarget(null, player, target);
					});
				},
				filterTarget(card, player, target) {
					return target != player && target.countCards("h");
				},
				usable: 1,
				async content(event, trigger, player) {
					const target = event.target,
						str = get.translation(target);
					const {
						result: { bool, links },
					} = await player.choosePlayerCard(target, "宴戏：展示" + str + "的一张手牌", "h", true);
					if (bool) {
						let cards = get.cards(2),
							gains = [];
						await game.cardsGotoOrdering(cards);
						cards = links.slice().concat(cards);
						await player.showCards(cards, get.translation(player) + "发动了【宴戏】");
						for (const card of cards) {
							gains.unshift(get.color(card));
							gains.add(get.type2(card));
						}
						gains = gains.unique().map(i => (i == "none" ? "none2" : i));
						const {
							result: { control },
						} = await player
							.chooseControl(gains)
							.set("cards", cards)
							.set("ai", () => {
								const player = get.event("player"),
									cards = get.event("cards"),
									getNum = function (cards, control, player) {
										cards = cards.filter(i => get.type2(i) == control || get.color(i) == control);
										return cards.reduce((sum, card) => sum + get.value(card, player), 0);
									};
								let controls = get
									.event("controls")
									.slice()
									.map(i => (i == "none2" ? "none" : i));
								controls.sort((a, b) => getNum(cards, b, player) - getNum(cards, a, player));
								return controls[0] == "none" ? "none2" : controls[0];
							})
							.set("dialog", ["获得其中一种颜色或类别的所有牌，然后" + str + "获得剩余牌", "hidden", cards]);
						if (control) {
							const choice = control == "none2" ? "none" : control;
							gains = cards.filter(i => get.type2(i) == choice || get.color(i) == choice);
							const num = gains.length;
							cards.removeArray(gains);
							if (gains.includes(links[0])) {
								gains.removeArray(links);
								await player.gain(links, target, "give", "bySelf");
							}
							if (gains.length) await player.gain(gains, "gain2");
							player.addTempSkill("fakeyanxi_maxHand");
							player.addMark("fakeyanxi_maxHand", num, false);
							cards = cards.filter(i => !links.includes(i));
							if (cards.length) await target.gain(cards, "gain2");
						}
					}
				},
				ai: {
					order: 9,
					result: {
						target(player, target) {
							return [-1, 1, 2][get.sgn(get.attitude(player, target)) + 1] / target.countCards("h");
						},
					},
				},
				subSkill: {
					maxHand: {
						charlotte: true,
						onremove: true,
						intro: { content: "手牌上限+#" },
						mod: {
							maxHandcard(player, num) {
								return num + player.countMark("fakeyanxi_maxHand");
							},
						},
					},
				},
			},
			fakeshiren: {
				unique: true,
				audio: "shiren",
				trigger: { player: "showCharacterEnd" },
				filter(event, player) {
					if (
						!game.hasPlayer(target => {
							return get.info("fakeyanxi").filterTarget(null, player, target);
						})
					)
						return false;
					return (
						game
							.getAllGlobalHistory(
								"everything",
								evt => {
									return evt.name == "showCharacter" && evt.player == player && evt.toShow.some(i => get.character(i, 3).includes("fakeshiren"));
								},
								event
							)
							.indexOf(event) == 0
					);
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget(get.prompt("fakeshiren"), "发动一次【宴戏】", (card, player, target) => {
							return get.info("fakeyanxi").filterTarget(null, player, target);
						})
						.set("ai", target => {
							const player = get.event("player");
							return -get.sgn(get.attitude(player, target)) * get.info("fakeyanxi").ai.result.target(player, target);
						})
						.forResult();
				},
				async content(event, trigger, player) {
					const target = event.targets[0];
					player.useResult({ skill: "fakeyanxi", target: target, targets: [target] }, event);
				},
				ai: { mingzhi_no: true },
				group: "fakeshiren_damage",
				subSkill: {
					damage: {
						audio: "shiren",
						trigger: { player: "damageBegin4" },
						filter(event, player) {
							if (!player.getStockSkills(true, true, true).includes("fakeshiren")) return false;
							return !game.getAllGlobalHistory("everything", evt => {
								return evt.name == "showCharacter" && evt.player == player && evt.toShow.some(i => get.character(i, 3).includes("fakeshiren"));
							}).length;
						},
						check(event, player) {
							return !event.source || get.damageEffect(player, event.source, player) < 0;
						},
						prompt: "识人：是否明置此武将牌并防止此伤害？",
						content() {
							trigger.cancel();
						},
					},
				},
			},
			fakecanmou: {
				audio: "canmou",
				trigger: { global: "useCardToPlayer" },
				filter(event, player) {
					if (!event.player.isMaxHandcard(true) || !event.isFirstTarget || get.type(event.card) != "trick") return false;
					if (event.targets.length > 1 && !player.getStorage("fakecanmou_used").includes("-")) return true;
					return get.info("fakecanmou").filter_add(event, player);
				},
				filter_add(event, player) {
					const info = get.info(event.card);
					if (info.allowMultiple == false) return false;
					if (event.targets && !info.multitarget && !player.getStorage("fakecanmou_used").includes("+")) {
						if (
							game.hasPlayer(current => {
								return !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, event.player, current);
							})
						)
							return true;
					}
					return false;
				},
				async cost(event, trigger, player) {
					let str = "",
						goon = get.info("fakecanmou").filter_add(trigger, player),
						bool = trigger.targets.length > 1 && !player.getStorage("fakecanmou_used").includes("-");
					if (goon) str += "增加";
					if (goon && bool) str = "或";
					if (bool) str += "减少";
					event.result = await player
						.chooseTarget(get.prompt("fakecanmou"), (card, player, target) => {
							const trigger = get.event().getTrigger();
							if (trigger.targets.length > 1 && !player.getStorage("fakecanmou_used").includes("-") && trigger.targets.includes(target)) return true;
							return !player.getStorage("fakecanmou_used").includes("+") && !trigger.targets.includes(target) && lib.filter.targetEnabled2(trigger.card, trigger.player, target);
						})
						.set("prompt2", "为" + get.translation(trigger.card) + str + "一个目标")
						.set("ai", target => {
							const player = get.event("player"),
								trigger = get.event().getTrigger();
							return get.effect(target, trigger.card, trigger.player, player) * (trigger.targets.includes(target) ? -1 : 1);
						})
						.setHiddenSkill("fakecanmou")
						.forResult();
				},
				preHidden: true,
				async content(event, trigger, player) {
					const target = event.targets[0],
						goon = trigger.targets.includes(target);
					player.addTempSkill("fakecanmou_used");
					player.markAuto("fakecanmou_used", [goon ? "-" : "+"]);
					if (goon) {
						trigger.targets.remove(target);
						game.log(target, "被", player, "移除了目标");
					} else {
						trigger.targets.add(target);
						game.log(target, "成为了", trigger.card, "移除了目标");
					}
				},
				subSkill: { used: { charlotte: true, onremove: true } },
			},
			fakezhuosheng: {
				hiddenCard(player, name) {
					return player.countCards("hs") > 1 && get.type(name) == "basic" && lib.inpile.includes(name) && !player.getStorage("fakezhuosheng_count").includes(name);
				},
				audio: "zhuosheng",
				enable: "chooseToUse",
				filter(event, player) {
					if (event.type == "wuxie") return false;
					if (player.countCards("hs") < 2) return false;
					return get
						.inpileVCardList(info => {
							const name = info[2];
							return !player.getStorage("fakezhuosheng_count").includes(name) && get.type(name) == "basic";
						})
						.some(card => event.filterCard({ name: card[2], nature: card[3] }, player, event));
				},
				chooseButton: {
					dialog(event, player) {
						var list = get
							.inpileVCardList(info => {
								const name = info[2];
								return !player.getStorage("fakezhuosheng_count").includes(name) && get.type(name) == "basic";
							})
							.filter(card => event.filterCard({ name: card[2], nature: card[3] }, player, event));
						return ui.create.dialog("擢升", [list, "vcard"], "hidden");
					},
					check(button) {
						var player = _status.event.player;
						var evt = _status.event.getParent();
						var name = button.link[2],
							card = { name: name, nature: button.link[3] };
						if (name == "shan") return 2;
						if (evt.type == "dying") {
							if (get.attitude(player, evt.dying) < 2) return 0;
							if (name == "jiu") return 2.1;
							return 1.9;
						}
						if (evt.type == "phase") {
							if (button.link[2] == "jiu") {
								if (player.getUseValue({ name: "jiu" }) <= 0) return 0;
								var cards = player.getCards("hs", cardx => get.value(cardx) < 8);
								cards.sort((a, b) => get.value(a) - get.value(b));
								if (cards.some(cardx => get.name(cardx) == "sha" && !cards.slice(0, 2).includes(cardx))) return player.getUseValue({ name: "jiu" });
								return 0;
							}
							return player.getUseValue(card) / 4;
						}
						return 1;
					},
					backup(links, player) {
						return {
							audio: "zhuosheng",
							filterCard: true,
							selectCard: [2, Infinity],
							position: "hs",
							complexCard: true,
							check(card) {
								if (ui.selected.cards.length >= 2) return 0;
								return 8 - get.value(card);
							},
							popname: true,
							viewAs: {
								name: links[0][2],
								nature: links[0][3],
							},
							precontent() {
								var name = event.result.card.name;
								player.addTempSkill("fakezhuosheng_count");
								player.markAuto("fakezhuosheng_count", [name]);
								player
									.when("yingbian")
									.filter(evt => evt.skill == "fakezhuosheng_backup")
									.then(() => {
										if (trigger.cards && trigger.cards.length) {
											let cards = trigger.cards.slice();
											cards = cards.filter(i => get.is.yingbian(i));
											if (cards.length) {
												if (!Array.isArray(trigger.temporaryYingbian)) trigger.temporaryYingbian = [];
												trigger.temporaryYingbian.add("force");
												trigger.temporaryYingbian.addArray(
													Array.from(lib.yingbian.effect.keys()).filter(value => {
														return cards.some(card => get.cardtag(card, `yingbian_${value}`));
													})
												);
											}
										}
									});
							},
						};
					},
					prompt(links, player) {
						var name = links[0][2];
						var nature = links[0][3];
						return "将至少两张手牌当作" + (get.translation(nature) || "") + get.translation(name) + "使用";
					},
				},
				ai: {
					order(item, player) {
						if (player && _status.event.type == "phase") {
							var add = false,
								max = 0;
							var names = lib.inpile.filter(name => get.type(name) == "basic" && !player.getStorage("fakezhuosheng_count").includes(name));
							if (names.includes("sha")) add = true;
							names = names.map(namex => {
								return { name: namex };
							});
							if (add) lib.inpile_nature.forEach(nature => names.push({ name: "sha", nature: nature }));
							names.forEach(card => {
								if (player.getUseValue(card) > 0) {
									var temp = get.order(card);
									if (card.name == "jiu") {
										var cards = player.getCards("hs", cardx => get.value(cardx) < 8);
										cards.sort((a, b) => get.value(a) - get.value(b));
										if (!cards.some(cardx => get.name(cardx) == "sha" && !cards.slice(0, 2).includes(cardx))) temp = 0;
									}
									if (temp > max) max = temp;
								}
							});
							if (max > 0) max -= 0.001;
							return max;
						}
						return 0.5;
					},
					respondShan: true,
					respondSha: true,
					fireAttack: true,
					skillTagFilter(player, tag, arg) {
						if (arg == "respond") return false;
						const name = tag == "respondShan" ? "shan" : "sha";
						return get.info("fakezhuosheng").hiddenCard(player, name);
					},
					result: {
						player(player) {
							if (_status.event.dying) return get.attitude(player, _status.event.dying);
							return 1;
						},
					},
				},
				subSkill: {
					count: { charlotte: true, onremove: true },
					backup: {},
				},
			},
			fakejuhou: {
				zhenfa: "inline",
				trigger: { global: "useCardToTargeted" },
				filter(event, player) {
					return (event.card.name == "sha" || get.type(event.card) == "trick") && event.target.inline(player);
				},
				logTarget: "target",
				async content(event, trigger, player) {
					const target = trigger.target;
					const {
						result: { bool, cards },
					} = await target.chooseCard("he", [1, Infinity], "是否将任意张牌置于武将牌上？").set("ai", card => {
						const trigger = get.event().getTrigger(),
							player = trigger.target;
						if (card.name == "baiyin" && get.position(card) == "e" && player.isDamaged() && get.recoverEffect(player, player, player) > 0) return 1;
						if (["guohe", "shunshou", "zhujinqiyuan", "chuqibuyi", "huogong"].includes(trigger.card.name) && get.effect(player, trigger.card, trigger.player, player) < 0) return 1;
						return 0;
					});
					if (bool) {
						target.addToExpansion(cards, "giveAuto", target).gaintag.add("fakejuhou");
						target.addSkill("fakejuhou");
						target
							.when({ global: "useCardAfter" })
							.filter(evt => evt == trigger.getParent())
							.then(() => {
								const cards = player.getExpansions("fakejuhou");
								if (cards.length) player.gain(cards, "gain2");
							});
					}
				},
				intro: {
					content: "expansion",
					markcount: "expansion",
				},
			},
			gznaxiang: {
				audio: "naxiang",
				inherit: "naxiang",
			},
			fakecaiwang: {
				audio: "caiwang",
				trigger: { player: "loseAfter" },
				filter(event, player) {
					const evt = event.getParent(2);
					if (evt.name != "yingbianZhuzhan") return false;
					const color = (get.color(evt.card) == get.color(event.cards[0])).toString();
					if (
						color == "true" &&
						!game.hasPlayer(target => {
							return target != player && target.countCards("he");
						})
					)
						return false;
					return !player.getStorage("fakecaiwang_used").includes(color);
				},
				async cost(event, trigger, player) {
					const color = (get.color(trigger.getParent(2).card) == get.color(trigger.cards[0])).toString();
					if (color == "false") {
						//event.result=await player.chooseBool(get.prompt('fakecaiwang'),'摸一张牌').forResult();
						event.result = { bool: true };
					} else {
						event.result = await player
							.chooseTarget(get.prompt("fakecaiwang"), "弃置一名其他角色的一张牌", (card, player, target) => {
								return target != player && target.countCards("he");
							})
							.set("ai", target => {
								const player = get.event("player");
								return get.effect(target, { name: "guohe_copy2" }, player, player);
							})
							.forResult();
					}
				},
				async content(event, trigger, player) {
					const color = (get.color(trigger.getParent(2).card) == get.color(trigger.cards[0])).toString();
					player.addTempSkill("fakecaiwang_used");
					player.markAuto("fakecaiwang_used", [color]);
					if (color == "false") await player.draw();
					else await player.discardPlayerCard(event.targets[0], "he", true);
				},
				group: "fakecaiwang_zhuzhan",
				subSkill: {
					used: {
						charlotte: true,
						onremove: true,
					},
					zhuzhan: {
						trigger: { player: "yingbianZhuzhanBegin" },
						forced: true,
						locked: false,
						popup: false,
						firstDo: true,
						content() {
							trigger.setContent(get.info("fakecaiwang").yingbian);
						},
					},
				},
				yingbian() {
					"step 0";
					event._global_waiting = true;
					event.send = (player, card, source, targets, id, id2, yingbianZhuzhanAI, skillState) => {
						if (skillState) player.applySkills(skillState);
						var type = get.type2(card),
							str = get.translation(source);
						if (targets && targets.length) str += `对${get.translation(targets)}`;
						str += `使用了${get.translation(card)}，是否弃置一张${get.translation(type)}为其助战？`;
						player.chooseCard({
							filterCard: (card, player) => get.type2(card) == type && lib.filter.cardDiscardable(card, player),
							prompt: str,
							position: "h",
							_global_waiting: true,
							id: id,
							id2: id2,
							ai:
								typeof yingbianZhuzhanAI == "function"
									? yingbianZhuzhanAI(player, card, source, targets)
									: cardx => {
											var info = get.info(card);
											if (info && info.ai && info.ai.yingbian) {
												var ai = info.ai.yingbian(card, source, targets, player);
												if (!ai) return 0;
												return ai - get.value(cardx);
											} else if (get.attitude(player, source) <= 0) return 0;
											return 5 - get.value(cardx);
										},
						});
						if (!game.online) return;
						_status.event._resultid = id;
						game.resume();
					};
					"step 1";
					var type = get.type2(card);
					event.list = game.filterPlayer(current => current.countCards("h") && (_status.connectMode || current.hasCard(cardx => get.type2(cardx) == type, "h"))).sortBySeat(_status.currentPhase || player);
					event.id = get.id();
					"step 2";
					if (!event.list.length) event.finish();
					else if (_status.connectMode && (event.list[0].isOnline() || event.list[0] == game.me)) event.goto(4);
					else event.send((event.current = event.list.shift()), event.card, player, trigger.targets, event.id, trigger.parent.id, trigger.yingbianZhuzhanAI);
					"step 3";
					if (result.bool) {
						event.zhuzhanresult = event.current;
						event.zhuzhanresult2 = result;
						if (event.current != game.me) game.delayx();
						event.goto(8);
					} else event.goto(2);
					"step 4";
					var id = event.id,
						sendback = (result, player) => {
							if (result && result.id == id && !event.zhuzhanresult && result.bool) {
								event.zhuzhanresult = player;
								event.zhuzhanresult2 = result;
								game.broadcast("cancel", id);
								if (_status.event.id == id && _status.event.name == "chooseCard" && _status.paused)
									return () => {
										event.resultOL = _status.event.resultOL;
										ui.click.cancel();
										if (ui.confirm) ui.confirm.close();
									};
							} else if (_status.event.id == id && _status.event.name == "chooseCard" && _status.paused) return () => (event.resultOL = _status.event.resultOL);
						},
						withme = false,
						withol = false,
						list = event.list;
					for (var i = 0; i < list.length; i++) {
						var current = list[i];
						if (current.isOnline()) {
							withol = true;
							current.wait(sendback);
							current.send(event.send, current, event.card, player, trigger.targets, event.id, trigger.parent.id, trigger.yingbianZhuzhanAI, get.skillState(current));
							list.splice(i--, 1);
						} else if (current == game.me) {
							withme = true;
							event.send(current, event.card, player, trigger.targets, event.id, trigger.parent.id, trigger.yingbianZhuzhanAI);
							list.splice(i--, 1);
						}
					}
					if (!withme) event.goto(6);
					if (_status.connectMode && (withme || withol))
						game.players.forEach(value => {
							if (value != player) value.showTimer();
						});
					event.withol = withol;
					"step 5";
					if (!result || !result.bool || event.zhuzhanresult) return;
					game.broadcast("cancel", event.id);
					event.zhuzhanresult = game.me;
					event.zhuzhanresult2 = result;
					"step 6";
					if (event.withol && !event.resultOL) game.pause();
					"step 7";
					game.players.forEach(value => value.hideTimer());
					"step 8";
					if (event.zhuzhanresult) {
						var target = event.zhuzhanresult;
						if (target == player && player.hasSkill("fakecaiwang")) player.logSkill("fakecaiwang");
						target.line(player, "green");
						target.discard(event.zhuzhanresult2.cards).discarder = target;
						if (typeof event.afterYingbianZhuzhan == "function") event.afterYingbianZhuzhan(event, trigger);
						var yingbianCondition = event.name.slice(8).toLowerCase(),
							yingbianConditionTag = `yingbian_${yingbianCondition}_tag`;
						target.popup(yingbianConditionTag, lib.yingbian.condition.color.get(yingbianCondition));
						game.log(target, "响应了", '<span class="bluetext">' + (target == player ? "自己" : get.translation(player)) + "</span>", "发起的", yingbianConditionTag);
						target.addExpose(0.2);
						event.result = {
							bool: true,
						};
					} else
						event.result = {
							bool: false,
						};
				},
			},
			fakenaxiang: {
				audio: "naxiang",
				trigger: {
					source: "damageSource",
					player: "damageEnd",
				},
				filter(event, player) {
					if (!event.source || !event.player || !event.source.isIn() || !event.player.isIn() || !event.source.isEnemyOf(event.player)) return false;
					return !player.getStorage("fakenaxiang").includes(get.info("fakenaxiang").logTarget(event, player));
				},
				logTarget(event, player) {
					return event.source == player ? event.player : event.source;
				},
				forced: true,
				async content(event, trigger, player) {
					const target = get.info("fakenaxiang").logTarget(trigger, player);
					const {
						result: { junling, targets },
					} = await player.chooseJunlingFor(target);
					const {
						result: { index },
					} = await target.chooseJunlingControl(player, junling, targets).set("prompt", "纳降：是否执行军令？");
					if (index == 0) await target.carryOutJunling(player, junling, targets);
					else {
						if (!player.storage.fakenaxiang) {
							player.when(["phaseBegin", "die"]).then(() => {
								player.unmarkSkill("fakenaxiang");
								delete player.storage.fakenaxiang;
							});
						}
						player.markAuto("fakenaxiang", [target]);
					}
				},
				onremove: true,
				marktext: '<span style="text-decoration: line-through;">降</span>',
				intro: { content: "无法对$发动【纳降】" },
				group: ["fakenaxiang_discard", "fakenaxiang_yingbian"],
				subSkill: {
					discard: {
						trigger: { player: "chooseCardBegin" },
						filter(event, player) {
							return event.getParent().name == "yingbianZhuzhan";
						},
						forced: true,
						popup: false,
						firstDo: true,
						content() {
							trigger.filterCard = lib.filter.cardDiscardable;
						},
					},
					yingbian: {
						trigger: { player: "yingbian" },
						filter(event, player) {
							if (event.card.yingbian) return false;
							const temporaryYingbian = event.temporaryYingbian || [],
								card = event.card;
							if (temporaryYingbian.includes("force") || get.cardtag(card, "yingbian_force")) return true;
							return get.yingbianConditions(event.card).length;
						},
						forced: true,
						popup: false,
						firstDo: true,
						content() {
							"step 0";
							trigger.card.yingbian = true;
							event.card = trigger.card;
							event.temporaryYingbian = trigger.temporaryYingbian || [];
							if (event.temporaryYingbian.includes("force") || get.cardtag(event.card, "yingbian_force") || trigger.forceYingbian || player.hasSkillTag("forceYingbian")) {
								player.popup("yingbian_force_tag", lib.yingbian.condition.color.get("force"));
								game.log(player, "触发了", event.card, "的应变条件");
								event._result = { bool: true };
							} else {
								trigger.yingbianZhuzhanAI = (player, card, source, targets) => cardx => {
									if (get.attitude(player, source) <= 0) return 0;
									var info = get.info(card),
										num = 0;
									if (info && info.ai && info.ai.yingbian) {
										var ai = info.ai.yingbian(card, source, targets, player);
										if (ai) num = ai;
									}
									return Math.max(num, 6) - get.value(cardx);
								};
								lib.yingbian.condition.complex.get("zhuzhan")(trigger);
							}
							"step 1";
							if (!result.bool) return;
							var yingbianEffectExecuted = false;
							lib.yingbian.effect.forEach((value, key) => {
								if (!event.temporaryYingbian.includes(key) && !get.cardtag(card, `yingbian_${key}`)) return;
								game.yingbianEffect(trigger, value);
								if (!yingbianEffectExecuted) yingbianEffectExecuted = true;
							});
							if (!yingbianEffectExecuted) {
								var defaultYingbianEffect = get.defaultYingbianEffect(card);
								if (lib.yingbian.effect.has(defaultYingbianEffect)) {
									game.yingbianEffect(trigger, lib.yingbian.effect.get(defaultYingbianEffect));
									if (!yingbianEffectExecuted) yingbianEffectExecuted = true;
								}
							}
							if (yingbianEffectExecuted) player.addTempSkill("yingbian_changeTarget");
						},
					},
				},
			},
			fakehuyuan: {
				audio: "yuanhu",
				trigger: { player: "phaseJieshuBegin" },
				filter(event, player) {
					return (
						player.countCards("he", card => {
							if (get.position(card) == "h" && _status.connectMode) return true;
							return get.type(card) == "equip";
						}) > 0
					);
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseCardTarget({
							prompt: get.prompt2("yuanhu"),
							filterCard(card) {
								return get.type(card) == "equip";
							},
							position: "he",
							filterTarget(card, player, target) {
								return target.canEquip(card);
							},
							ai1(card) {
								return 6 - get.value(card);
							},
							ai2(target) {
								return get.attitude(_status.event.player, target) - 3;
							},
						})
						.setHiddenSkill("fakehuyuan")
						.forResult();
				},
				preHidden: true,
				async content(event, trigger, player) {
					const card = event.cards[0],
						target = event.targets[0];
					if (target != player) player.$give(card, target, false);
					await target.equip(card);
				},
				group: "fakehuyuan_discard",
				subSkill: {
					discard: {
						trigger: { global: "equipEnd" },
						filter(event, player) {
							return (
								_status.currentPhase == player &&
								game.hasPlayer(target => {
									return get.distance(event.player, target) <= 1 && target != event.player && target.countCards("hej");
								})
							);
						},
						async cost(event, trigger, player) {
							event.result = await player
								.chooseTarget(get.prompt("fakehuyuan"), "弃置一名与" + get.translation(trigger.player) + "距离为1以内的另一名角色区域里的一张牌", (card, player, target) => {
									const trigger = get.event().getTrigger();
									return get.distance(trigger.player, target) <= 1 && target != trigger.player && target.countCards("hej");
								})
								.set("ai", target => {
									const player = get.event("player");
									return get.effect(target, { name: "guohe" }, player, player);
								})
								.setHiddenSkill("fakehuyuan")
								.forResult();
						},
						popup: false,
						async content(event, trigger, player) {
							const target = event.targets[0];
							player.logSkill("fakehuyuan", target);
							await player.discardPlayerCard(target, "hej", true);
						},
					},
				},
			},
			fakekeshou: {
				audio: "keshou",
				trigger: { player: "damageBegin3" },
				filter(event, player) {
					return event.num > 0;
				},
				preHidden: true,
				async cost(event, trigger, player) {
					event.result = await player
						.chooseToDiscard(get.prompt("fakekeshou"), "弃置两张颜色相同的牌，令即将受到的伤害-1", "he", 2, card => {
							return !ui.selected.cards.length || get.color(card) == get.color(ui.selected.cards[0]);
						})
						.set("logSkill", "fakekeshou")
						.set("complexCard", true)
						.setHiddenSkill("fakekeshou")
						.set("ai", card => {
							if (!_status.event.check) return 0;
							var player = _status.event.player;
							if (player.hp == 1) {
								if (
									!player.countCards("h", function (card) {
										return get.tag(card, "save");
									}) &&
									!player.hasSkillTag("save", true)
								)
									return 10 - get.value(card);
								return 7 - get.value(card);
							}
							return 6 - get.value(card);
						})
						.set("check", player.countCards("h", { color: "red" }) > 1 || player.countCards("h", { color: "black" }) > 1)
						.forResult();
				},
				popup: false,
				async content(event, trigger, player) {
					trigger.num--;
				},
				group: "fakekeshou_draw",
				subSkill: {
					draw: {
						audio: "keshou",
						trigger: {
							player: "loseAfter",
							global: "loseAsyncAfter",
						},
						filter(event, player) {
							if (event.type != "discard" || event.getlx === false) return false;
							if (
								!(
									!player.isUnseen() &&
									!game.hasPlayer(current => {
										return current != player && current.isFriendOf(player);
									})
								)
							)
								return false;
							const evt = event.getl(player);
							return evt && evt.cards2 && evt.cards2.length > 1;
						},
						prompt2: "进行一次判定，若为红色，则你摸一张牌",
						async content(event, trigger, player) {
							const result = await player
								.judge(card => {
									return get.color(card) == "red" ? 1 : 0;
								})
								.forResult();
							if (result.judge > 0) await player.draw();
						},
					},
				},
			},
			//国战典藏2023补充
			//吕范
			gzdiaodu: {
				audio: "diaodu",
				trigger: {
					player: "phaseUseBegin",
				},
				filter(event, player) {
					return game.hasPlayer(current => {
						if (!current.isFriendOf(player)) return false;
						return current.countGainableCards(player, "e") > 0;
					});
				},
				frequent: true,
				preHidden: true,
				async cost(event, trigger, player) {
					const next = player.chooseTarget(get.prompt2("gzdiaodu"), (_card, player, current) => current.isFriendOf(player) && current.countGainableCards(player, "e") > 0);

					next.set("ai", target => {
						let num = 0;

						if (target.hasSkill("gzxiaoji")) {
							num += 2.5;
						}
						if (target.isDamaged() && target.getEquip("baiyin")) {
							num += 2.5;
						}
						if (target.hasSkill("xuanlve")) {
							num += 2;
						}

						return num;
					});

					next.setHiddenSkill("gzdiaodu");

					event.result = await next.forResult();
				},
				logTarget: "targets",
				async content(event, trigger, player) {
					const target = event.targets[0];
					const { result } = await player.gainPlayerCard(target, "e", true);

					if (!result.bool) {
						return;
					}

					const card = result.cards[0];
					if (!player.getCards("h").includes(card)) {
						return;
					}

					const { result: result2 } = await player.chooseTarget("将" + get.translation(card, void 0) + "交给另一名角色", (_card, player, current) => current != player && current != _status.event.target, true).set("target", target);

					if (result2.bool) {
						const target2 = result2.targets[0];
						player.line(target2, "green");
						await player.give(card, target2);
					}
				},
				group: "gzdiaodu_use",
				subSkill: {
					use: {
						audio: "diaodu",
						trigger: {
							global: "useCard",
						},
						filter(event, player) {
							if (get.type(event.card) !== "equip") return false;
							if (!event.player.isIn()) return false;
							if (!event.player.isFriendOf(player)) return false;
							return player === event.player || player.hasSkill("gzdiaodu");
						},
						logTarget: "player",
						async cost(event, trigger, player) {
							const next = trigger.player.chooseBool(get.prompt("gzdiaodu"), "摸一张牌");

							if (player.hasSkill("gzdiaodu")) {
								next.set("frequentSkill", "gzdiaodu");
							}
							if (player === trigger.player) {
								next.setHiddenSkill("gzdiaodu");
							}

							event.result = await next.forResult();
						},
						async content(event, trigger, player) {
							trigger.player.draw("nodelay");
						},
					},
				},
			},
			// 回来吧老调度
			gzdiaodu_backports: {
				audio: "diaodu",
				trigger: {
					player: "phaseUseBegin",
				},
				filter(event, player) {
					return game.hasPlayer(current => {
						if (!current.isFriendOf(player)) return false;
						return current.countGainableCards(player, "e") > 0;
					});
				},
				frequent: true,
				preHidden: true,
				async cost(event, trigger, player) {
					const next = player.chooseTarget(get.prompt2("gzdiaodu_backports"), (_card, player, current) => current.isFriendOf(player) && current.countGainableCards(player, "e") > 0);

					next.set("ai", target => {
						let num = 0;

						if (target.hasSkill("gzxiaoji")) {
							num += 2.5;
						}
						if (target.isDamaged() && target.getEquip("baiyin")) {
							num += 2.5;
						}
						if (target.hasSkill("xuanlve")) {
							num += 2;
						}

						return num;
					});

					next.setHiddenSkill("gzdiaodu_backports");

					event.result = await next.forResult();
				},
				logTarget: "targets",
				async content(event, trigger, player) {
					const target = event.targets[0];
					const { result } = await player.gainPlayerCard(target, "e", true);

					if (!result.bool) {
						return;
					}

					const card = result.cards[0];
					if (!player.getCards("h").includes(card)) {
						return;
					}

					const next = player.chooseTarget(`是否将${get.translation(card)}交给一名其他角色？`);
					next.set("filterTarget", (_card, player, current) => {
						return current !== player && current !== _status.event.target && player.isFriendOf(current);
					});
					next.set("target", target);

					const result2 = await next.forResult();

					if (result2.bool) {
						const target2 = result2.targets[0];
						player.line(target2, "green");
						await player.give(card, target2);
					}
				},
				group: "gzdiaodu_backports_use",
				subSkill: {
					use: {
						audio: "diaodu",
						trigger: {
							global: "useCard",
						},
						filter(event, player) {
							if (get.type(event.card) !== "equip") return false;
							if (!event.player.isIn()) return false;
							if (!event.player.isFriendOf(player)) return false;
							return player === event.player || player.hasSkill("gzdiaodu_backports");
						},
						logTarget: "player",
						async cost(event, trigger, player) {
							const next = trigger.player.chooseBool(get.prompt("gzdiaodu_backports"), "摸一张牌");

							if (player.hasSkill("gzdiaodu_backports")) {
								next.set("frequentSkill", "gzdiaodu_backports");
							}
							if (player === trigger.player) {
								next.setHiddenSkill("gzdiaodu_backports");
							}

							event.result = await next.forResult();
						},
						async content(event, trigger, player) {
							trigger.player.draw("nodelay");
						},
					},
				},
			},
			//徐庶
			gzqiance: {
				trigger: { global: "useCardToPlayered" },
				filter(event, player) {
					if (!event.isFirstTarget || get.type(/*2*/ event.card) != "trick") return false; //延时锦囊不能响应有个锤用
					return event.player.isFriendOf(player) && event.targets.some(target => target.isMajor());
				},
				check(event, player) {
					var num = 0,
						targets = event.targets.filter(target => target.isMajor());
					for (var target of targets) num += get.sgn(get.attitude(player, target) * get.effect(target, event.card, event.player, player));
					return num >= 0;
				},
				logTarget: "player",
				content() {
					trigger.getParent().directHit.addArray(trigger.targets.filter(target => target.isMajor()));
				},
			},
			gzjujian: {
				init(player) {
					if (player.checkViceSkill("gzjujian") && !player.viceChanged) player.removeMaxHp();
				},
				viceSkill: true,
				audio: "gzjiancai",
				trigger: { global: "dying" },
				filter(event, player) {
					return event.player.isFriendOf(player);
				},
				forced: true,
				logTarget: "player",
				content() {
					trigger.player.recover(1 - trigger.player.hp);
					player.changeVice();
				},
			},
			//彭羕
			gztongling: {
				audio: "daming",
				trigger: { source: "damageSource" },
				filter(event, player) {
					if (event.player.isFriendOf(player)) return false;
					return player.isPhaseUsing() && event.player.isIn() && !player.hasSkill("gztongling_used");
				},
				direct: true,
				content() {
					"step 0";
					var str = "";
					if (get.itemtype(trigger.cards) == "cards" && trigger.cards.filterInD().length) str += "；未造成伤害，其获得" + get.translation(trigger.cards.filterInD());
					player
						.chooseTarget(get.prompt("gztongling"), "令一名势力与你相同的角色选择是否对其使用一张牌。若使用且此牌：造成伤害，你与其各摸两张牌" + str, function (card, player, target) {
							return target.isFriendOf(player);
						})
						.set("ai", function (target) {
							var aim = _status.event.aim;
							var cards = target.getCards("hs", function (card) {
								return target.canUse(card, aim, false) && get.effect(aim, card, target, player) > 0 && get.effect(aim, card, target, target) > 0;
							});
							if (cards.length) return cards.some(card => get.tag(card, "damage")) ? 2 : 1;
							return 0;
						})
						.set("aim", trigger.player);
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						event.target = target;
						player.logSkill("gztongling", target);
						player.addTempSkill("gztongling_used", "phaseUseAfter");
						player.line2([target, trigger.player]);
						target
							.chooseToUse(
								function (card, player, event) {
									return lib.filter.filterCard.apply(this, arguments);
								},
								"通令：是否对" + get.translation(trigger.player) + "使用一张牌？"
							)
							.set("targetRequired", true)
							.set("complexSelect", true)
							.set("filterTarget", function (card, player, target) {
								if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
								return lib.filter.targetEnabled.apply(this, arguments);
							})
							.set("sourcex", trigger.player)
							.set("addCount", false);
					} else event.finish();
					"step 2";
					if (result.bool) {
						if (target.hasHistory("sourceDamage", evt => evt.getParent(4).name == "gztongling")) {
							player.draw(2, "nodelay");
							target.draw(2);
						} else {
							if (get.itemtype(trigger.cards) == "cards" && trigger.cards.filterInD().length && trigger.player.isIn()) trigger.player.gain(trigger.cards.filterInD(), "gain2");
						}
					}
				},
				subSkill: { used: { charlotte: true } },
			},
			gzjinyu: {
				audio: "xiaoni",
				trigger: { player: "showCharacterAfter" },
				filter(event, player) {
					if (
						!game.hasPlayer(function (current) {
							return get.distance(player, current) <= 1;
						})
					)
						return false;
					return event.toShow.some(name => get.character(name, 3).includes("gzjinyu"));
				},
				logTarget(event, player) {
					return game
						.filterPlayer(function (current) {
							return get.distance(player, current) <= 1;
						})
						.sortBySeat(player);
				},
				forced: true,
				locked: false,
				content() {
					"step 0";
					event.targets = game
						.filterPlayer(function (current) {
							return get.distance(player, current) <= 1;
						})
						.sortBySeat(player);
					"step 1";
					var target = event.targets.shift();
					event.target = target;
					if (!target.isUnseen(2)) {
						if (get.is.jun(target)) event._result = { control: "副将" };
						else {
							target
								.chooseControl("主将", "副将")
								.set("prompt", "近谀：请暗置一张武将牌")
								.set("ai", function () {
									var target = _status.event.player;
									if (get.character(target.name, 3).includes("gzjinyu")) return "主将";
									if (get.character(target.name2, 3).includes("gzjinyu")) return "副将";
									if (
										lib.character[target.name][3].some(skill => {
											var info = get.info(skill);
											return info && info.ai && info.ai.maixie;
										})
									)
										return "主将";
									if (target.name == "gz_zhoutai") return "副将";
									if (target.name2 == "gz_zhoutai") return "主将";
									return "副将";
								});
						}
					} else {
						target.chooseToDiscard(2, "he", true);
						event.goto(3);
					}
					"step 2";
					if (result.control) target.hideCharacter(result.control == "主将" ? 0 : 1);
					"step 3";
					if (event.targets.length) event.goto(1);
				},
			},
			//公孙渊
			gzrehuaiyi: {
				audio: "gzhuaiyi",
				enable: "phaseUse",
				locked: false,
				filter(event, player) {
					return player.countCards("h") > 0;
				},
				usable: 1,
				delay: false,
				content() {
					"step 0";
					player.showHandcards();
					var hs = player.getCards("h"),
						color = get.color(hs[0], player);
					if (
						hs.length === 1 ||
						!hs.some((card, index) => {
							return index > 0 && get.color(card) !== color;
						})
					) {
						event.finish();
					}
					"step 1";
					const list = [],
						bannedList = [],
						indexs = Object.keys(lib.color);
					player.getCards("h").forEach(card => {
						const color = get.color(card, player);
						list.add(color);
						if (!lib.filter.cardDiscardable(card, player, "gzrehuaiyi")) bannedList.add(color);
					});
					list.removeArray(bannedList);
					list.sort((a, b) => indexs.indexOf(a) - indexs.indexOf(b));
					if (!list.length) event.finish();
					else if (list.length === 1) event._result = { control: list[0] };
					else
						player
							.chooseControl(list.map(i => `${i}2`))
							.set("ai", function () {
								var player = _status.event.player;
								if (player.countCards("h", { color: "red" }) == 1 && player.countCards("h", { color: "black" }) > 1) return 1;
								return 0;
							})
							.set("prompt", "请选择弃置一种颜色的所有手牌");
					"step 2";
					event.control = result.control.slice(0, result.control.length - 1);
					var cards = player.getCards("h", { color: event.control });
					player.discard(cards);
					event.num = cards.length;
					"step 3";
					player
						.chooseTarget("请选择至多" + get.cnNumber(event.num) + "名有牌的其他角色，获得这些角色的各一张牌。", [1, event.num], function (card, player, target) {
							return target != player && target.countCards("he") > 0;
						})
						.set("ai", function (target) {
							return -get.attitude(_status.event.player, target) + 0.5;
						});
					"step 4";
					if (result.bool && result.targets) {
						player.line(result.targets, "green");
						event.targets = result.targets;
						event.targets.sort(lib.sort.seat);
						event.cards = [];
					} else event.finish();
					"step 5";
					if (player.isIn() && event.targets.length) {
						player.gainPlayerCard(event.targets.shift(), "he", true);
					} else event.finish();
					"step 6";
					if (result.bool && result.cards && result.cards.length) event.cards.addArray(result.cards);
					if (event.targets.length) event.goto(5);
					"step 7";
					var hs = player.getCards("h");
					cards = cards.filter(function (card) {
						return get.type(card) == "equip" && hs.includes(card);
					});
					if (cards.length) {
						player.$give(cards, player, false);
						game.log(player, "将", cards, "置于了武将牌上");
						player.loseToSpecial(cards, "gzrehuaiyi").visible = true;
					} else event.finish();
					"step 8";
					player.addSkill("gzrehuaiyi_unmark");
					player.markSkill("gzrehuaiyi");
					game.delayx();
				},
				ai: {
					order: 10,
					result: {
						player(player, target) {
							var map = {};
							for (var i of ["red", "black", "none"]) {
								if (player.countCards("h", { color: i })) map[i] = true;
							}
							if (Object.keys(map).length < 2) return 0;
							var num =
								player.maxHp -
								player.countCards("s", function (card) {
									return card.hasGaintag("gzrehuaiyi");
								});
							if (player.countCards("h", { color: "red" }) <= num) return 1;
							if (player.countCards("h", { color: "black" }) <= num) return 1;
							return 0;
						},
					},
				},
				marktext: "异",
				intro: {
					mark(dialog, storage, player) {
						var cards = player.getCards("s", function (card) {
							return card.hasGaintag("gzrehuaiyi");
						});
						if (!cards || !cards.length) return;
						dialog.addAuto(cards);
					},
					markcount(storage, player) {
						return player.countCards("s", function (card) {
							return card.hasGaintag("gzrehuaiyi");
						});
					},
					onunmark(storage, player) {
						var cards = player.getCards("s", function (card) {
							return card.hasGaintag("gzrehuaiyi");
						});
						if (cards.length) {
							player.loseToDiscardpile(cards);
						}
					},
				},
				mod: {
					aiOrder(player, card, num) {
						if (get.itemtype(card) == "card" && card.hasGaintag("gzrehuaiyi"))
							return (
								num +
								(player.countCards("s", function (card) {
									return card.hasGaintag("gzrehuaiyi");
								}) > player.maxHp
									? 0.5
									: -0.5)
							);
					},
				},
				subSkill: {
					unmark: {
						trigger: { player: "loseAfter" },
						filter(event, player) {
							if (!event.ss || !event.ss.length) return false;
							return !player.countCards("s", function (card) {
								return card.hasGaintag("gzrehuaiyi");
							});
						},
						charlotte: true,
						forced: true,
						silent: true,
						content() {
							player.unmarkSkill("gzrehuaiyi");
							player.removeSkill("gzrehuaiyi_unmark");
						},
					},
				},
			},
			gzrezisui: {
				audio: "gzzisui",
				trigger: { player: "phaseDrawBegin2" },
				filter(event, player) {
					return (
						!event.numFixed &&
						player.countCards("s", function (card) {
							return card.hasGaintag("gzrehuaiyi");
						}) > 0
					);
				},
				forced: true,
				content() {
					trigger.num += player.countCards("s", function (card) {
						return card.hasGaintag("gzrehuaiyi");
					});
				},
				group: "gzrezisui_die",
				subSkill: {
					die: {
						audio: "gzzisui",
						trigger: { player: "phaseJieshuBegin" },
						filter(event, player) {
							return (
								player.countCards("s", function (card) {
									return card.hasGaintag("gzrehuaiyi");
								}) > player.maxHp
							);
						},
						forced: true,
						content() {
							player.die();
						},
					},
				},
			},
			//南华老仙
			gztaidan: {
				derivation: "taipingyaoshu",
				audio: "tianshu",
				locked: true,
				group: "gztaidan_taipingyaoshu",
			},
			gztaidan_taipingyaoshu: {
				equipSkill: true,
				mod: {
					maxHandcard(player, num) {
						if (!player.hasEmptySlot(2) || game.hasPlayer(target => target.getVEquip("taipingyaoshu"))) return;
						if (player.hasSkill("hongfa")) {
							num += player.getExpansions("huangjintianbingfu").length;
						}
						return (
							num +
							game.countPlayer(function (current) {
								return current.isFriendOf(player);
							})
						);
					},
				},
				audio: "tianshu",
				inherit: "taipingyaoshu",
				filter(event, player) {
					if (!player.hasEmptySlot(2) || game.hasPlayer(target => target.getVEquip("taipingyaoshu"))) return false;
					return lib.skill.taipingyaoshu.filter(event, player);
				},
				noHidden: true,
				ai: {
					effect: {
						target(card, player, target) {
							if (!target.hasEmptySlot(2) || game.hasPlayer(targetx => targetx.getVEquip("taipingyaoshu"))) return;
							if (player == target && get.subtype(card) == "equip2") {
								if (get.equipValue(card) <= 7.5) return 0;
							}
							return lib.skill.taipingyaoshu.ai.effect.target.apply(this, arguments);
						},
					},
				},
			},
			gzrejinghe: {
				audio: "jinghe",
				enable: "phaseUse",
				usable: 1,
				//delay:0,
				content() {
					"step 0";
					if (!player.storage.gzrejinghe_tianshu) {
						var list = lib.skill.gzrejinghe.derivation.slice(0);
						list.remove("gzrejinghe_faq");
						var list2 = list.slice(0, get.rand(0, list.length));
						list.removeArray(list2);
						list.addArray(list2);
						player.storage.gzrejinghe_tianshu = list;
					} else {
						var first = player.storage.gzrejinghe_tianshu[0];
						player.storage.gzrejinghe_tianshu.remove(first);
						player.storage.gzrejinghe_tianshu.push(first);
					}
					game.log(player, "转动了", "#g“天书”");
					player.markSkill("gzrejinghe");
					var skill = player.storage.gzrejinghe_tianshu[0];
					event.skill = skill;
					var cardname = "gzrejinghe_" + skill;
					lib.card[cardname] = {
						fullimage: true,
						image: "character:re_nanhualaoxian",
					};
					lib.translate[cardname] = get.translation(skill);
					event.videoId = lib.status.videoId++;
					game.broadcastAll(
						function (player, id, card) {
							ui.create.dialog(get.translation(player) + "转动了“天书”", [[card], "card"]).videoId = id;
						},
						player,
						event.videoId,
						game.createCard(cardname, " ", " ")
					);
					game.delay(3);
					"step 1";
					game.broadcastAll("closeDialog", event.videoId);
					var targets = game.filterPlayer(current => !current.hasSkill(event.skill));
					if (!targets.length) {
						event.finish();
						return;
					}
					player
						.chooseTarget(
							"经合：令一名角色获得技能【" + get.translation(event.skill) + "】",
							function (card, player, target) {
								return _status.event.targets.includes(target);
							},
							true
						)
						.set("ai", function (target) {
							var player = _status.event.player;
							return get.attitude(player, target);
						})
						.set("targets", targets);
					"step 2";
					if (result.bool) {
						var target = result.targets[0],
							skill = event.skill;
						player.line(target);
						player.addTempSkill("gzrejinghe_clear", { player: "phaseBegin" });
						target.addAdditionalSkills("gzrejinghe_" + player.playerid, skill);
						target.popup(skill);
					}
				},
				intro: {
					name: "写满技能的天书",
					markcount: () => 8,
					mark(dialog, storage, player) {
						dialog.content.style["overflow-x"] = "visible";
						var list = player.storage.gzrejinghe_tianshu;
						var core = document.createElement("div");
						var centerX = -10,
							centerY = 80,
							radius = 80;
						var radian = (Math.PI * 2) / list.length;
						for (var i = 0; i < list.length; i++) {
							var td = document.createElement("div");
							td.innerHTML = get.translation(list[i]).slice(0, 1);
							td.style.position = "absolute";
							core.appendChild(td);
							td.style.left = centerX + radius * Math.sin(radian * i) + "px";
							td.style.top = centerY - radius * Math.cos(radian * i) + "px";
						}
						dialog.content.appendChild(core);
					},
				},
				ai: {
					order: 10,
					result: { target: 1 },
				},
				derivation: ["gzrejinghe_faq", "leiji", "nhyinbing", "nhhuoqi", "nhguizhu", "nhxianshou", "nhlundao", "nhguanyue", "nhyanzheng"],
				subSkill: {
					clear: {
						onremove(player) {
							game.countPlayer(function (current) {
								current.removeAdditionalSkills("gzrejinghe_" + player.playerid);
							});
						},
					},
				},
			},
			//张鲁·新
			gzrebushi: {
				onremove: true,
				onunmark: true,
				intro: { content: "mark" },
				group: "gzrebushi_give",
				audio: "gzbushi",
				trigger: { player: ["phaseZhunbeiBegin", "phaseAfter"] },
				check(event, player) {
					return event.name == "phase";
				},
				forced: true,
				locked: false,
				content() {
					"step 0";
					if (trigger.name == "phaseZhunbei") {
						var num = game.countPlayer() - player.hp - 2;
						if (num > 0) player.chooseToDiscard(num, "he", true);
					} else {
						player.addMark("gzrebushi", player.hp);
						event.finish();
					}
					"step 1";
					player.removeMark("gzrebushi", player.countMark("gzrebushi"));
					if (!player.hasMark("gzrebushi")) player.unmarkSkill("gzrebushi");
				},
				ai: { mingzhi_no: true },
				subSkill: {
					give: {
						trigger: { global: "phaseZhunbeiBegin" },
						filter(event, player) {
							if (event.player == player) return false;
							return player.hasMark("gzrebushi") && player.countCards("he");
						},
						direct: true,
						content() {
							"step 0";
							player.chooseCard(get.prompt("gzrebushi"), "he", "失去1个“义舍”标记，将一张牌交给" + get.translation(trigger.player) + "并摸两张牌").set("ai", function (card) {
								var player = _status.event.player;
								var trigger = _status.event.getTrigger();
								var target = trigger.player;
								var num = 0,
									current = target;
								while (current != player) {
									if (current.isFriendOf(player) && !current.isTurnedOver()) num++;
									current = current.next;
								}
								if (num >= player.countMark("gzrebushi") && !target.isFriendOf(player)) return -1;
								return 6 - get.value(card);
							});
							"step 1";
							if (result.bool) {
								player.logSkill("gzrebushi", trigger.player);
								player.removeMark("gzrebushi", 1);
								if (!player.hasMark("gzrebushi")) player.unmarkSkill("gzrebushi");
								trigger.player.gain(result.cards, player, "giveAuto");
								player.draw(2);
							}
						},
					},
				},
			},
			gzremidao: {
				group: "gzremidao_change",
				audio: "gzmidao",
				trigger: { player: "phaseJieshuBegin" },
				filter(event, player) {
					return !player.getExpansions("gzremidao").length;
				},
				content() {
					"step 0";
					player.draw(2);
					"step 1";
					var cards = player.getCards("he");
					if (!cards.length) event.finish();
					else if (cards.length <= 2) event._result = { bool: true, cards: cards };
					else player.chooseCard(2, "he", true, "选择两张牌作为“米”");
					"step 2";
					if (result.bool) player.addToExpansion(result.cards, player, "give").gaintag.add("gzremidao");
				},
				marktext: "米",
				intro: {
					content: "expansion",
					markcount: "expansion",
				},
				onremove(player, skill) {
					var cards = player.getExpansions(skill);
					if (cards.length) player.loseToDiscardpile(cards);
				},
				subSkill: {
					change: {
						trigger: { global: "judge" },
						filter(event, player) {
							return player.getExpansions("gzremidao").length && event.player.isAlive();
						},
						direct: true,
						content() {
							"step 0";
							var list = player.getExpansions("gzremidao");
							player
								.chooseButton([get.translation(trigger.player) + "的" + (trigger.judgestr || "") + "判定为" + get.translation(trigger.player.judging[0]) + "，" + get.prompt("gzremidao"), list, "hidden"], function (button) {
									var card = button.link;
									var trigger = _status.event.getTrigger();
									var player = _status.event.player;
									var judging = _status.event.judging;
									var result = trigger.judge(card) - trigger.judge(judging);
									var attitude = get.attitude(player, trigger.player);
									if (result == 0) return 0.5;
									return result * attitude;
								})
								.set("judging", trigger.player.judging[0])
								.set("filterButton", function (button) {
									var player = _status.event.player;
									var card = button.link;
									var mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
									if (mod2 != "unchanged") return mod2;
									var mod = game.checkMod(card, player, "unchanged", "cardRespondable", player);
									if (mod != "unchanged") return mod;
									return true;
								});
							"step 1";
							if (result.bool) {
								event.forceDie = true;
								player.respond(result.links, "gzremidao", "highlight", "noOrdering");
								result.cards = result.links;
								var card = result.cards[0];
								event.card = card;
							} else event.finish();
							"step 2";
							if (result.bool) {
								if (trigger.player.judging[0].clone) {
									trigger.player.judging[0].clone.classList.remove("thrownhighlight");
									game.broadcast(function (card) {
										if (card.clone) card.clone.classList.remove("thrownhighlight");
									}, trigger.player.judging[0]);
									game.addVideo("deletenode", player, get.cardsInfo([trigger.player.judging[0].clone]));
								}
								player.$gain2(trigger.player.judging[0]);
								player.gain(trigger.player.judging[0]);
								trigger.player.judging[0] = result.cards[0];
								trigger.orderingCards.addArray(result.cards);
								game.log(trigger.player, "的判定牌改为", card);
								game.delay(2);
							}
						},
						ai: {
							rejudge: true,
							tag: { rejudge: 0.6 },
						},
					},
				},
			},
			//许贡
			gzbiaozhao: {
				audio: "biaozhao",
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					var players = game.filterPlayer(current => current != player);
					if (players.length < 2) return false;
					for (var i = 0; i < players.length - 1; i++) {
						for (var j = i + 1; j < players.length; j++) {
							if (players[i].isEnemyOf(players[j])) return true;
						}
					}
					return false;
				},
				multitarget: true,
				complexTarget: true,
				complexSelect: true,
				selectTarget: 2,
				filterTarget(card, player, target) {
					if (target == player) return false;
					var targets = ui.selected.targets;
					if (targets.length == 0) return player.canUse("zhibi", target);
					return target.isEnemyOf(targets[0]);
				},
				targetprompt: ["被知己知彼", "获得牌"],
				content() {
					"step 0";
					player.useCard({ name: "zhibi", isCard: true }, targets[0]);
					"step 1";
					if (player.countCards("he") > 0 && targets[1].isAlive()) {
						player.chooseCard("he", true, "交给" + get.translation(targets[1]) + "一张牌");
					} else event.finish();
					"step 2";
					player.give(result.cards, targets[1]);
					player.draw();
				},
				ai: {
					order: 6,
					result: {
						player(player, target) {
							if (ui.selected.targets.length) return 0.1;
							return get.effect(target, { name: "zhibi" }, player, player) + 0.1;
						},
						target(player, target) {
							if (ui.selected.targets.length) return 2;
							return 0;
						},
					},
				},
			},
			gzyechou: {
				audio: "yechou",
				trigger: { player: "die" },
				forced: true,
				forceDie: true,
				skillAnimation: true,
				animationColor: "gray",
				logTarget: "source",
				filter(event, player) {
					return event.source && event.source.isIn() && player.canUse("sha", event.source, false);
				},
				content() {
					"step 0";
					var target = trigger.source;
					event.target = target;
					target.addTempSkill("gzyechou_unsavable");
					player
						.useCard({ name: "sha", isCard: true }, target)
						.set("forceDie", true)
						.set("oncard", function () {
							_status.event.directHit.addArray(game.filterPlayer());
						});
					"step 1";
					player.addTempSkill("gzyechou_unequip");
					if (!target.isIn() || !player.canUse("sha", target, false)) {
						player.removeSkill("gzyechou_unequip");
						event.goto(3);
					} else {
						player
							.useCard(
								{
									name: "sha",
									isCard: true,
									storage: { gzyechou: true },
								},
								target
							)
							.set("forceDie", true);
					}
					"step 2";
					player.removeSkill("gzyechou_unequip");
					if (!target.isIn() || !player.canUse("sha", target, false)) {
						event.goto(3);
					} else
						player
							.useCard({ name: "sha", isCard: true }, target)
							.set("forceDie", true)
							.set("oncard", function () {
								_status.event.baseDamage++;
							});
					"step 3";
					target.removeSkill("gzyechou_unsavable");
				},
				ai: {
					threaten: 0.001,
				},
				subSkill: {
					unsavable: {
						charlotte: true,
						mod: {
							targetEnabled(card, player, target) {
								if (card.name == "tao" && target.isDying() && player.isFriendOf(target) && target != player) return false;
							},
						},
					},
					unequip: {
						charlotte: true,
						ai: {
							unequip: true,
							skillTagFilter(player, tag, arg) {
								if (!arg || !arg.card || !arg.card.storage || !arg.card.storage.gzyechou) return false;
							},
						},
					},
				},
			},
			//陈宫
			gzyinpan: {
				enable: "phaseUse",
				usable: 1,
				filterTarget: lib.filter.notMe,
				content() {
					"step 0";
					event.targets = game
						.filterPlayer(function (current) {
							return current != target && current.isEnemyOf(target);
						})
						.sortBySeat();
					"step 1";
					if (!event.target.isIn()) {
						event.finish();
						return;
					}
					var target = targets.shift();
					if (target.isIn() && (_status.connectMode || !lib.config.skip_shan || target.hasSha())) {
						target
							.chooseToUse(
								function (card, player, event) {
									if (get.name(card) != "sha") return false;
									return lib.filter.filterCard.apply(this, arguments);
								},
								"是否对" + get.translation(event.target) + "使用一张【杀】？"
							)
							.set("targetRequired", true)
							.set("complexSelect", true)
							.set("addCount", false)
							.set("filterTarget", function (card, player, target) {
								if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
								return lib.filter.targetEnabled.apply(this, arguments);
							})
							.set("sourcex", event.target);
					}
					if (targets.length > 0) event.redo();
					"step 2";
					if (target.isIn()) {
						var dying = false;
						var num = target.getHistory("damage", function (evt) {
							if (evt.card && evt.card.name == "sha") {
								var evtx = evt.getParent("useCard");
								if (evt.card == evtx.card && evtx.getParent(2) == event) {
									if (evt._dyinged) dying = true;
									return true;
								}
							}
						}).length;
						if (num > 0) {
							target.addTempSkill("gzyinpan_effect", { player: "phaseAfter" });
							target.addMark("gzyinpan_effect", num, false);
							if (dying) target.recover();
						}
					}
				},
				ai: {
					order: 1,
					result: { target: -1 },
				},
				subSkill: {
					effect: {
						mod: {
							cardUsable(card, player, num) {
								if (card.name == "sha") return num + player.countMark("gzyinpan_effect");
							},
						},
						onremove: true,
						charlotte: true,
						intro: { content: "使用【杀】的次数上限+#" },
					},
				},
			},
			gzxingmou: {
				trigger: { global: "gainAfter" },
				forced: true,
				preHidden: true,
				filter(event, player) {
					return event.getParent().name == "draw" && event.getParent(2).name == "die";
				},
				content() {
					player.draw();
				},
				ai: {
					noDieAfter: true,
					noDieAfter2: true,
				},
			},
			//朱儁
			gzgongjian: {
				audio: "gongjian",
				trigger: { global: "useCardToPlayered" },
				filter(event, player) {
					if (!event.isFirstTarget || event.card.name != "sha") return false;
					var history = game.getAllGlobalHistory("useCard", function (evt) {
						return evt.card.name == "sha";
					});
					var evt = event.getParent(),
						index = history.indexOf(evt);
					if (index < 1) return false;
					var evt0 = history[index - 1];
					for (var i of evt.targets) {
						if (evt0.targets.includes(i) && i.countCards("he") > 0) return true;
					}
					return false;
				},
				prompt2: "弃置这些角色的各两张牌",
				preHidden: ["gzgongjian_gain"],
				subfrequent: ["gain"],
				logTarget(event, player) {
					var history = game.getAllGlobalHistory("useCard", function (evt) {
						return evt.card.name == "sha";
					});
					var evt = event.getParent(),
						index = history.indexOf(evt);
					var evt0 = history[index - 1];
					return evt.targets.filter(function (target) {
						return evt0.targets.includes(target) && target.countCards("he") > 0;
					});
				},
				check(event, player) {
					var targets = lib.skill.gzgongjian.logTarget(event, player),
						att = 0;
					for (var i of targets) {
						att += get.attitude(player, i);
					}
					return att < 0;
				},
				content() {
					var history = game.getAllGlobalHistory("useCard", function (evt) {
						return evt.card.name == "sha";
					});
					var evt = trigger.getParent(),
						index = history.indexOf(evt);
					var evt0 = history[index - 1];
					var targets = evt.targets
						.filter(function (target) {
							return evt0.targets.includes(target);
						})
						.sortBySeat();
					for (var i of targets) i.chooseToDiscard(true, "he", 2);
				},
				group: "gzgongjian_gain",
				subSkill: {
					gain: {
						audio: "gongjian",
						trigger: {
							global: ["loseAfter", "loseAsyncAfter"],
						},
						filter(event, player) {
							if (event.name == "lose") {
								if (event.type != "discard" || event.player == player) return false;
								if ((event.discarder || event.getParent(event.getParent(2).name == "chooseToDiscard" ? 3 : 2).player) != player) return false;
								for (var i of event.cards2) {
									if (i.name == "sha") return true;
								}
							} else if (event.type == "discard") {
								if (!event.discarder || event.discarder != player) return false;
								var cards = event.getd(null, "cards2");
								cards.removeArray(event.getd(player, "cards2"));
								for (var i of cards) {
									if (i.name == "sha") return true;
								}
							}
							return false;
						},
						frequent: true,
						prompt2(event, player) {
							var cards = event.getd(null, "cards2");
							cards.removeArray(event.getd(player, "cards2"));
							cards = cards.filter(card => card.name == "sha");
							return "获得" + get.translation(cards);
						},
						content() {
							var cards = trigger.getd(null, "cards2");
							cards.removeArray(trigger.getd(player, "cards2"));
							cards = cards.filter(card => card.name == "sha");
							if (cards.length) player.gain(cards, "gain2");
						},
					},
				},
			},
			gzkuimang: {
				audio: "kuimang",
				trigger: { source: "die" },
				forced: true,
				preHidden: true,
				filter(event, player) {
					var target = event.player;
					if (target.isFriendOf(player)) return false;
					var prev = target.getPrevious(),
						next = target.getNext();
					return (prev && prev.isFriendOf(target)) || (next && next.isFriendOf(target));
				},
				content() {
					player.draw(2);
				},
			},
			//毌丘俭
			gzzhengrong: {
				audio: "drlt_zhenrong",
				trigger: {
					source: "damageBegin3",
					player: ["damageBegin1", "chooseJunlingForBegin"],
				},
				forced: true,
				preHidden: true,
				filter(event, player) {
					if (event.name != "damage") return true;
					if (player.identity != "unknown")
						return !game.hasPlayer(function (current) {
							return current != player && current.isFriendOf(player);
						});
					return !player.wontYe("wei") || !game.hasPlayer(current => current.identity == "wei");
				},
				check(event, player) {
					return (
						!event.player.hasSkillTag("filterDamage", null, {
							player: event.source,
							card: event.card,
						}) && get.damageEffect(event.player, event.source, player, _status.event.player) > 0
					);
				},
				content() {
					trigger.num++;
				},
				mod: {
					globalFrom(player, target, num) {
						if (target.isMajor()) return num - 1;
					},
				},
				ai: { halfneg: true },
			},
			gzhongju: {
				audio: "drlt_hongju",
				enable: "phaseUse",
				limited: true,
				skillAnimation: true,
				animationColor: "thunder",
				filterTarget: lib.filter.notMe,
				content() {
					"step 0";
					player.awakenSkill("gzhongju");
					event.players = game
						.filterPlayer(function (current) {
							return current != player && current != target;
						})
						.sortBySeat();
					game.delayx();
					player.chooseJunlingFor(event.players[0]).set("prompt", "请选择一项“军令”");
					"step 1";
					event.junling = result.junling;
					event.targets = result.targets;
					event.num = 0;
					player.carryOutJunling(player, event.junling, event.targets);
					"step 2";
					if (num < event.players.length) event.current = event.players[num];
					if (event.current && event.current.isAlive()) {
						player.line(event.current);
						event.current
							.chooseJunlingControl(player, event.junling, targets)
							.set("prompt", "鸿举")
							.set("choiceList", ["执行该军令", "不执行该军令，且被“调虎离山”化"])
							.set("ai", function () {
								var evt = _status.event.getParent(2);
								return get.junlingEffect(evt.player, evt.junling, evt.current, evt.targets, evt.current) > 0 ? 0 : 1;
							});
					} else event.goto(4);
					"step 3";
					if (result.index == 0) {
						event.current.carryOutJunling(player, event.junling, event.targets);
					} else {
						event.current.addTempSkill("diaohulishan");
					}
					"step 4";
					game.delayx();
					event.num++;
					if (event.num < event.players.length) event.goto(2);
				},
			},
			//郭淮
			gzduanshi: {
				audio: "yuzhang",
				trigger: { global: "drawBegin" },
				forced: true,
				mainSkill: true,
				preHidden: true,
				init(player) {
					if (player.checkMainSkill("gzduanshi")) {
						player.removeMaxHp();
					}
				},
				filter(event, player) {
					var evt = event.getParent();
					if (evt.name != "die") return false;
					if (player.identity == "unknown") {
						return player.wontYe("wei") && evt.player.identity == "wei";
					}
					return evt.player.isFriendOf(player);
				},
				logTarget: "player",
				content() {
					trigger.num--;
					if (trigger.num < 1) trigger.cancel();
					if (!trigger.gzduanshi) trigger.gzduanshi = [];
					trigger.gzduanshi.add(player);
					player.addTempSkill("gzduanshi_draw");
				},
				subSkill: {
					draw: {
						trigger: { global: ["drawAfter", "drawCancelled"] },
						forced: true,
						charlotte: true,
						popup: false,
						filter(event, player) {
							return event.gzduanshi && event.gzduanshi.includes(player);
						},
						content() {
							player.draw();
						},
					},
				},
			},
			gzjingce: {
				audio: "decadejingce",
				getDiscardNum() {
					var cards = [];
					//因为是线下武将 所以同一张牌重复进入只算一张
					game.getGlobalHistory("cardMove", function (evt) {
						if (evt.name == "cardsDiscard" || (evt.name == "lose" && evt.position == ui.discardPile)) cards.addArray(evt.cards);
					});
					return cards.length;
				},
				trigger: { player: "phaseEnd" },
				filter(event, player) {
					if (player.getHistory("useCard").length >= player.hp) return true;
					return lib.skill.gzjingce.getDiscardNum() >= player.hp;
				},
				prompt2(event, player) {
					var num1 = player.getHistory("useCard").length,
						num2 = lib.skill.gzjingce.getDiscardNum();
					if (num1 >= player.hp && num2 >= player.hp) return "执行一套额外的摸牌阶段和出牌阶段";
					return "执行一个额外的" + (num1 > num2 ? "出牌阶段" : "摸牌阶段");
				},
				preHidden: true,
				frequent: true,
				content() {
					var num1 = player.getHistory("useCard").length,
						num2 = lib.skill.gzjingce.getDiscardNum();
					var num3 = player.hp;
					if (num2 >= num3) {
						var next = player.phaseDraw();
						event.next.remove(next);
						trigger.after.push(next);
					}
					if (num1 >= num3) {
						var next = player.phaseUse();
						event.next.remove(next);
						trigger.after.push(next);
					}
				},
				ai: { threaten: 2.6 },
			},
			//黄权
			gzdianhu: {
				unique: true,
				audio: "xinfu_dianhu",
				trigger: { player: "showCharacterAfter" },
				forced: true,
				filter(event, player) {
					return (
						event.toShow.some(name => {
							return get.character(name, 3).includes("gzdianhu");
						}) && !player.storage.gzdianhu_effect
					);
				},
				content() {
					"step 0";
					player.chooseTarget("请选择【点虎】的目标", true, "给一名角色标上“虎”标记。当你或你的队友对该角色造成伤害后摸一张牌。", lib.filter.notMe).set("ai", function (target) {
						var player = _status.event.player;
						var distance = game.countPlayer(function (current) {
							if (current.isFriendOf(player)) return Math.pow(get.distance(current, target), 1.2);
						});
						return 10 / distance;
					});
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill("gzdianhu", target);
						target.markSkill("gzdianhu_mark");
						player.addSkill("gzdianhu_effect");
						player.markAuto("gzdianhu_effect", [target]);
					}
				},
				subSkill: {
					mark: {
						mark: true,
						marktext: "虎",
						intro: { content: "已成为“点虎”目标" },
					},
					effect: {
						trigger: { global: "damageEnd" },
						forced: true,
						charlotte: true,
						filter(event, player) {
							if (!player.getStorage("gzdianhu_effect").includes(event.player)) return false;
							var source = event.source;
							return source && source.isAlive() && source.isFriendOf(player);
						},
						logTarget: "source",
						content() {
							trigger.source.draw();
						},
					},
				},
			},
			gzjianji: {
				audio: "xinfu_jianji",
				inherit: "xinfu_jianji",
				filterTarget: true,
				content() {
					"step 0";
					target.draw("visible");
					"step 1";
					var card = result[0];
					if (
						card &&
						game.hasPlayer(function (current) {
							return target.canUse(card, current);
						}) &&
						get.owner(card) == target
					) {
						target.chooseToUse({
							prompt: "是否使用" + get.translation(card) + "？",
							filterCard(cardx, player, target) {
								return cardx == _status.event.cardx;
							},
							cardx: card,
						});
					}
				},
				ai: {
					order: 10,
					result: { target: 1 },
				},
			},
			//杨婉
			gzyouyan: {
				audio: "youyan",
				trigger: {
					player: "loseAfter",
					global: "loseAsyncAfter",
				},
				filter(event, player) {
					if (event.type != "discard" || event.getlx === false || player != _status.currentPhase) return false;
					var evt = event.getl(player);
					if (!evt || !evt.cards2 || !evt.cards2.length) return false;
					var list = [];
					for (var i of evt.cards2) {
						list.add(get.suit(i, player));
						if (list.length >= lib.suit.length) return false;
					}
					return true;
				},
				usable: 1,
				preHidden: true,
				async content(event, trigger, player) {
					let cards = get.cards(4, true);
					await player.showCards(cards, get.translation(player) + "发动了【诱言】");
					var evt = trigger.getl(player);
					var list = [];
					for (var i of evt.cards2) {
						list.add(get.suit(i, player));
					}
					cards = cards.filter(card => !list.includes(get.suit(card, false)));
					if (cards.length) await player.gain(cards, "gain2");
				},
				ai: {
					effect: {
						player_use(card, player, target) {
							if (
								typeof card == "object" &&
								player == _status.currentPhase &&
								(!player.storage.counttrigger || !player.storage.counttrigger.gzyouyan) &&
								player.needsToDiscard() == 1 &&
								card.cards &&
								card.cards.filter(function (i) {
									return get.position(i) == "h";
								}).length > 0 &&
								!get.tag(card, "draw") &&
								!get.tag(card, "gain") &&
								!get.tag(card, "discard")
							)
								return "zeroplayertarget";
						},
					},
				},
			},
			gzzhuihuan: {
				audio: "zhuihuan",
				trigger: { player: "phaseJieshuBegin" },
				direct: true,
				preHidden: true,
				content() {
					"step 0";
					player
						.chooseTarget([1, 2], "选择至多两名角色获得“追还”效果")
						.setHiddenSkill("gzzhuihuan")
						.set("ai", function (target) {
							return get.attitude(_status.event.player, target);
						});
					"step 1";
					if (result.bool) {
						var targets = result.targets.sortBySeat();
						player.logSkill("gzzhuihuan", targets);
						event.targets = targets;
					} else event.finish();
					"step 2";
					var next = player
						.chooseTarget("选择一名角色获得反伤效果", "被选择的目标角色下次受到伤害后，其对伤害来源造成1点伤害；未被选择的目标角色下次受到伤害后，伤害来源弃置两张牌。", function (card, player, target) {
							return _status.event.getParent().targets.includes(target);
						})
						.set("ai", function (target) {
							return get.attitude(_status.event.player, target);
						});
					if (targets.length > 1) next.set("forced", true);
					"step 3";
					for (var target of targets) {
						player.addTempSkill("gzzhuihuan_timeout", { player: "phaseZhunbeiBegin" });
						var id = "gzzhuihuan_" + player.playerid;
						if (result.targets.includes(target)) {
							player.line(target, "fire");
							target.addAdditionalSkill(id, "gzzhuihuan_damage");
						} else {
							player.line(target, "thunder");
							target.addAdditionalSkill(id, "gzzhuihuan_discard");
						}
					}
				},
				subSkill: {
					timeout: {
						charlotte: true,
						onremove(player) {
							var id = "gzzhuihuan_" + player.playerid;
							game.countPlayer(current => current.removeAdditionalSkill(id));
						},
					},
					damage: {
						charlotte: true,
						trigger: { player: "damageEnd" },
						forced: true,
						forceDie: true,
						filter(event, player) {
							return event.source && event.source.isAlive();
						},
						logTarget: "source",
						content() {
							player.removeSkill("gzzhuihuan_damage");
							trigger.source.damage();
						},
						mark: true,
						marktext: "追",
						intro: {
							content: "当你下次受到伤害后，你对伤害来源造成1点伤害。",
						},
						ai: {
							threaten: 0.5,
						},
					},
					discard: {
						charlotte: true,
						trigger: { player: "damageEnd" },
						forced: true,
						forceDie: true,
						filter(event, player) {
							return event.source && event.source.isAlive();
						},
						logTarget: "source",
						content() {
							player.removeSkill("gzzhuihuan_discard");
							trigger.source.chooseToDiscard(2, "he", true);
						},
						mark: true,
						marktext: "还",
						intro: {
							content: "当你下次受到伤害后，你令伤害来源弃置两张牌。",
						},
						ai: {
							threaten: 0.8,
						},
					},
				},
			},
			//海外田豫
			gzzhenxi: {
				audio: "twzhenxi",
				trigger: { player: "useCardToPlayered" },
				filter(event, player) {
					if (event.card.name != "sha") return false;
					if (
						event.target.countCards("he") ||
						player.hasCard(function (card) {
							return get.suit(card) == "diamond" && get.type2(card) != "trick" && player.canUse(get.autoViewAs({ name: "lebu" }, [card]), event.target);
						}, "he") ||
						player.hasCard(function (card) {
							return get.suit(card) == "club" && get.type2(card) != "trick" && player.canUse(get.autoViewAs({ name: "bingliang" }, [card]), event.target, false);
						}, "he")
					)
						return true;
					return false;
				},
				check(event, player) {
					return get.attitude(player, event.target) < 0;
				},
				direct: true,
				content() {
					"step 0";
					var target = trigger.target;
					event.target = target;
					var list = [],
						choiceList = ["弃置" + get.translation(target) + "一张牌", "将一张♦非锦囊牌当做【乐不思蜀】或♣非锦囊牌当做【兵粮寸断】对" + get.translation(target) + "使用", "背水！若其有暗置的武将牌且你的武将牌均明置，你依次执行上述两项"];
					if (target.countDiscardableCards(player, "he")) list.push("选项一");
					else choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + "</span>";
					if (
						player.countCards("he", function (card) {
							return get.suit(card) == "diamond" && get.type2(card) != "trick" && player.canUse(get.autoViewAs({ name: "lebu" }, [card]), target);
						}) ||
						player.countCards("he", function (card) {
							return get.suit(card) == "club" && get.type2(card) != "trick" && player.canUse(get.autoViewAs({ name: "bingliang" }, [card]), target);
						})
					)
						list.push("选项二");
					else choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
					if (target.isUnseen(2) && !player.isUnseen(2)) list.push("背水！");
					else choiceList[2] = '<span style="opacity:0.5">' + choiceList[2] + "</span>";
					player
						.chooseControl(list, "cancel2")
						.set("prompt", get.prompt("gzzhenxi", target))
						.set("choiceList", choiceList)
						.set("ai", function () {
							var player = _status.event.player,
								trigger = _status.event.getTrigger(),
								list = _status.event.list;
							if (get.attitude(player, trigger.target) > 0) return "cancel2";
							if (list.includes("背水！")) return "背水！";
							if (list.includes("选项二")) return "选项二";
							return "选项一";
						})
						.set("list", list)
						.setHiddenSkill("gzzhenxi");
					"step 1";
					if (result.control == "cancel2") {
						event.finish();
						return;
					}
					player.logSkill("gzzhenxi", target);
					event.choice = result.control;
					if (event.choice != "选项二" && target.countDiscardableCards(player, "he")) player.discardPlayerCard(target, "he", true);
					"step 2";
					if (
						event.choice != "选项一" &&
						(player.hasCard(function (card) {
							return get.suit(card) == "diamond" && get.type2(card) != "trick" && player.canUse(get.autoViewAs({ name: "lebu" }, [card]), target);
						}, "he") ||
							player.hasCard(function (card) {
								return get.suit(card) == "club" && get.type2(card) != "trick" && player.canUse(get.autoViewAs({ name: "bingliang" }, [card]), target, false);
							}, "he"))
					) {
						var next = game.createEvent("gzzhenxi_use");
						next.player = player;
						next.target = target;
						next.setContent(lib.skill.gzzhenxi.contentx);
					}
				},
				ai: { unequip_ai: true },
				contentx() {
					"step 0";
					player.chooseCard({
						position: "hes",
						forced: true,
						prompt: "震袭",
						prompt2: "将一张♦非锦囊牌当做【乐不思蜀】或♣非锦囊牌当做【兵粮寸断】对" + get.translation(target) + "使用",
						filterCard(card, player) {
							if (get.itemtype(card) != "card" || get.type2(card) == "trick" || !["diamond", "club"].includes(get.suit(card))) return false;
							var cardx = { name: get.suit(card) == "diamond" ? "lebu" : "bingliang" };
							return player.canUse(get.autoViewAs(cardx, [card]), _status.event.getParent().target, false);
						},
					});
					"step 1";
					if (result.bool) player.useCard({ name: get.suit(result.cards[0], player) == "diamond" ? "lebu" : "bingliang" }, target, result.cards);
				},
			},
			gzjiansu: {
				init(player) {
					if (player.checkViceSkill("gzjiansu") && !player.viceChanged) player.removeMaxHp();
				},
				viceSkill: true,
				audio: 2,
				trigger: {
					player: "gainAfter",
					global: "loseAsyncAfter",
				},
				filter(event, player) {
					if (player == _status.currentPhase) return false;
					return event.getg(player).length;
				},
				frequent: true,
				group: "gzjiansu_use",
				preHidden: ["gzjiansu_use"],
				content() {
					player.showCards(trigger.getg(player), get.translation(player) + "发动了【俭素】");
					player.addGaintag(trigger.getg(player), "gzjiansu_tag");
					player.markSkill("gzjiansu");
				},
				intro: {
					mark(dialog, content, player) {
						var hs = player.getCards("h", function (card) {
							return card.hasGaintag("gzjiansu_tag");
						});
						if (hs.length) dialog.addSmall(hs);
						else dialog.addText("无已展示手牌");
					},
					content(content, player) {
						var hs = player.getCards("h", function (card) {
							return card.hasGaintag("gzjiansu_tag");
						});
						if (hs.length) return get.translation(hs);
						else return "无已展示手牌";
					},
				},
				subSkill: {
					use: {
						audio: "gzjiansu",
						trigger: { player: "phaseUseBegin" },
						filter(event, player) {
							var num = player.countCards("h", function (card) {
								return card.hasGaintag("gzjiansu_tag");
							});
							return (
								num > 0 &&
								game.hasPlayer(function (current) {
									return current.isDamaged() && current.getDamagedHp() <= num;
								})
							);
						},
						direct: true,
						content() {
							"step 0";
							player
								.chooseCardTarget({
									prompt: get.prompt("gzjiansu"),
									prompt2: "弃置任意张“俭”，令一名体力值不大于你以此法弃置的牌数的角色回复1点体力",
									filterCard(card) {
										return get.itemtype(card) == "card" && card.hasGaintag("gzjiansu_tag");
									},
									selectCard: [1, Infinity],
									filterTarget(card, player, target) {
										return target.isDamaged();
									},
									filterOk() {
										return ui.selected.targets.length && ui.selected.targets[0].hp <= ui.selected.cards.length;
									},
									ai1(card) {
										if (ui.selected.targets.length && ui.selected.targets[0].hp <= ui.selected.cards.length) return 0;
										return 6 - get.value(card);
									},
									ai2(target) {
										var player = _status.event.player;
										return get.recoverEffect(target, player, player);
									},
								})
								.setHiddenSkill("gzjiansu_use");
							"step 1";
							if (result.bool) {
								var target = result.targets[0],
									cards = result.cards;
								player.logSkill("gzjiansu_use", target);
								player.discard(cards);
								target.recover();
							}
						},
					},
				},
			},
			//海外刘夫人
			gzzhuidu: {
				audio: "twzhuidu",
				trigger: { source: "damageBegin3" },
				filter(event, player) {
					return player.isPhaseUsing();
				},
				check(event, player) {
					return get.attitude(player, event.player) < 0;
				},
				usable: 1,
				logTarget: "player",
				content() {
					"step 0";
					var target = trigger.player;
					event.target = target;
					if (target.hasSex("female") && target.countCards("e") > 0)
						player.chooseToDiscard("he", "追妒：是否弃置一张牌并令其执行两项？").set("ai", function (card) {
							return 8 - get.value(card);
						});
					else event.goto(2);
					"step 1";
					if (result.bool) {
						event._result = { control: "我全都要！" };
						event.goto(3);
					}
					"step 2";
					if (target.countCards("e") > 0) {
						target
							.chooseControl()
							.set("prompt", "追妒：请选择一项")
							.set("choiceList", ["令" + get.translation(player) + "此次对你造成的伤害+1", "弃置装备区里的所有牌"])
							.set("ai", function () {
								var player = _status.event.player,
									cards = player.getCards("e");
								if (player.hp <= 2) return 1;
								if (get.value(cards) <= 7) return 1;
								return 0;
							});
					} else event._result = { control: "选项一" };
					"step 3";
					player.line(target);
					if (result.control != "选项二") trigger.num++;
					if (result.control != "选项一") target.chooseToDiscard(target.countCards("e"), true, "e");
				},
			},
			gzshigong: {
				audio: "twshigong",
				trigger: { player: "dying" },
				filter(event, player) {
					return _status.currentPhase && _status.currentPhase != player && _status.currentPhase.isIn() && player.hasViceCharacter() && player.hp <= 0;
				},
				skillAnimation: true,
				animationColor: "gray",
				limited: true,
				logTarget: () => _status.currentPhase,
				check(event, player) {
					if (
						player.countCards("h", function (card) {
							var mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
							if (mod2 != "unchanged") return mod2;
							var mod = game.checkMod(card, player, event.player, "unchanged", "cardSavable", player);
							if (mod != "unchanged") return mod;
							var savable = get.info(card).savable;
							if (typeof savable == "function") savable = savable(card, player, event.player);
							return savable;
						}) >=
						1 - event.player.hp
					)
						return false;
					return true;
				},
				content() {
					"step 0";
					var target = _status.currentPhase;
					event.target = target;
					player.awakenSkill("gzshigong");
					var list = lib.character[player.name2][3].filter(function (skill) {
						return get.skillCategoriesOf(skill, player).length == 0;
					});
					if (!list.length) {
						event._result = { control: "cancel2" };
						event.goto(2);
					} else event.list = list;
					player.removeCharacter(1);
					"step 1";
					target
						.chooseControl(event.list, "cancel2")
						.set(
							"choiceList",
							event.list.map(i => {
								return '<div class="skill">【' + get.translation(lib.translate[i + "_ab"] || get.translation(i).slice(0, 2)) + "】</div><div>" + get.skillInfoTranslation(i, _status.currentPhase) + "</div>";
							})
						)
						.set("displayIndex", false)
						.set("ai", function () {
							if (get.attitude(_status.event.player, _status.event.getParent().player) > 0) return 0;
							return [0, 1].randomGet();
						})
						.set("prompt", get.translation(player) + "对你发动了【示恭】")
						.set("prompt2", "获得一个技能并令其将体力回复至体力上限；或点击“取消”，令其将体力值回复至1点。");
					"step 2";
					if (result.control == "cancel2") {
						player.recover(1 - player.hp);
						event.finish();
					} else {
						target.addSkills(result.control);
						target.line(player);
						player.recover(player.maxHp - player.hp);
					}
				},
			},
			//海外服华雄
			gzyaowu: {
				audio: "new_reyaowu",
				limited: true,
				trigger: { source: "damageSource" },
				filter(event, player) {
					if (player.isUnseen(0) && lib.character[player.name1][3].includes("gzyaowu")) return true;
					if (player.isUnseen(1) && lib.character[player.name2][3].includes("gzyaowu")) return true;
					return false;
				},
				skillAnimation: true,
				animationColor: "fire",
				check(event, player) {
					return player.isDamaged() || player.hp <= 2;
				},
				content() {
					player.awakenSkill("gzyaowu");
					player.gainMaxHp(2);
					player.recover(2);
					player.addSkill("gzyaowu_die");
				},
				ai: { mingzhi_no: true },
				subSkill: {
					die: {
						audio: "new_reyaowu",
						trigger: { player: "dieAfter" },
						filter(event, player) {
							return game.hasPlayer(function (current) {
								return current != player && current.isFriendOf(player);
							});
						},
						forced: true,
						forceDie: true,
						charlotte: true,
						skillAnimation: true,
						animationColor: "fire",
						logTarget(event, player) {
							return game.filterPlayer(function (current) {
								return current != player && current.isFriendOf(player);
							});
						},
						content() {
							for (var target of lib.skill.gzyaowu_die.logTarget(trigger, player)) target.loseHp();
						},
					},
				},
			},
			gzshiyong: {
				audio: "shiyong",
				derivation: "gzshiyongx",
				trigger: { player: "damageEnd" },
				filter(event, player) {
					if (!event.card) return false;
					if (player.awakenedSkills.includes("gzyaowu")) return event.source && event.source.isIn() && get.color(event.card) != "black";
					return get.color(event.card) != "red";
				},
				forced: true,
				logTarget(event, player) {
					if (player.awakenedSkills.includes("gzyaowu")) return event.source;
					return;
				},
				content() {
					(lib.skill.gzshiyong.logTarget(trigger, player) || player).draw();
				},
			},
			//海外服夏侯尚
			gztanfeng: {
				audio: "twtanfeng",
				trigger: { player: "phaseZhunbeiBegin" },
				filter(event, player) {
					return game.hasPlayer(function (current) {
						return !current.isFriendOf(player) && current.countDiscardableCards("hej", player) > 0;
					});
				},
				direct: true,
				preHidden: true,
				content() {
					"step 0";
					player
						.chooseTarget(get.prompt2("gztanfeng"), function (card, player, target) {
							return !target.isFriendOf(player) && target.countDiscardableCards(player, "hej") > 0;
						})
						.set("ai", function (target) {
							var player = _status.event.player;
							if (target.hp + target.countCards("hs", { name: ["tao", "jiu"] }) <= 2) return 3 * get.effect(target, { name: "guohe" }, player, player);
							return get.effect(target, { name: "guohe" }, player, player);
						})
						.setHiddenSkill(event.name);
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						event.target = target;
						player.logSkill("gztanfeng", target);
						player.discardPlayerCard(target, "hej", true);
					} else event.finish();
					"step 2";
					target
						.chooseBool("是否受到" + get.translation(player) + "造成的1点火焰伤害，令其跳过一个阶段？")
						.set("ai", () => _status.event.choice)
						.set("choice", get.damageEffect(target, player, target) >= -5);
					"step 3";
					if (result.bool) {
						player.line(target);
						target.damage(1, "fire");
					} else event.finish();
					"step 4";
					var list = [];
					var list2 = [];
					event.map = {
						phaseJudge: "判定阶段",
						phaseDraw: "摸牌阶段",
						phaseUse: "出牌阶段",
						phaseDiscard: "弃牌阶段",
					};
					for (var i of ["phaseJudge", "phaseDraw", "phaseUse", "phaseDiscard"]) {
						if (!player.skipList.includes(i)) {
							i = event.map[i];
							list.push(i);
							if (i != "判定阶段" && i != "弃牌阶段") list2.push(i);
						}
					}
					target
						.chooseControl(list)
						.set("prompt", "探锋：令" + get.translation(player) + "跳过一个阶段")
						.set("ai", function () {
							return _status.event.choice;
						})
						.set(
							"choice",
							(function () {
								var att = get.attitude(target, player);
								var num = player.countCards("j");
								if (att > 0) {
									if (list.includes("判定阶段") && num > 0) return "判定阶段";
									return "弃牌阶段";
								}
								if (list.includes("摸牌阶段") && player.hasJudge("lebu")) return "摸牌阶段";
								if ((list.includes("出牌阶段") && player.hasJudge("bingliang")) || player.needsToDiscard() > 0) return "出牌阶段";
								return list2.randomGet();
							})()
						);
					"step 5";
					for (var i in event.map) {
						if (event.map[i] == result.control) player.skip(i);
					}
					target.popup(result.control);
					target.line(player);
					game.log(player, "跳过了", "#y" + result.control);
				},
			},
			//杨芷
			gzwanyi: {
				audio: "wanyi",
				enable: "phaseUse",
				filter(event, player) {
					if (player.getStorage("gzwanyi2").length >= 4) return false;
					if (_status.mode == "yingbian")
						return player.hasCard(function (i) {
							return get.is.yingbian(i);
						}, "hs");
					return player.hasCard(function (card) {
						return card.hasTag("lianheng");
					}, "hs");
				},
				chooseButton: {
					dialog(event, player) {
						var list = ["lianjunshengyan", "huoshaolianying", "xietianzi", "lulitongxin"];
						if (_status.mode == "yingbian") list = ["zhujinqiyuan", "chuqibuyi", "shuiyanqijunx", "dongzhuxianji"];
						list.removeArray(player.getStorage("gzwanyi2"));
						return ui.create.dialog("婉嫕", [list, "vcard"], "hidden");
					},
					filter(button, player) {
						return lib.filter.filterCard({ name: button.link[2] }, player, _status.event.getParent());
					},
					check(button) {
						return _status.event.player.getUseValue({ name: button.link[2] });
					},
					backup(links) {
						return {
							audio: "wanyi",
							popname: true,
							viewAs: {
								name: links[0][2],
							},
							filterCard(card) {
								if (_status.mode == "yingbian") return get.is.yingbian(card);
								return card.hasTag("lianheng");
							},
							check(card) {
								return 1 / Math.max(1, get.value(card));
							},
							position: "hs",
							onuse(links, player) {
								if (!player.storage.gzwanyi2) player.storage.gzwanyi2 = [];
								player.storage.gzwanyi2.add(links.card.name);
								player.addTempSkill("gzwanyi2");
							},
						};
					},
					prompt(links) {
						if (_status.mode == "yingbian") return "将一张应变牌当做" + get.translation(links[0][2]) + "使用";
						return "将一张合纵牌当做" + get.translation(links[0][2]) + "使用";
					},
				},
				subSkill: { backup: {} },
				ai: { order: 8, result: { player: 1 } },
			},
			gzwanyi2: { onremove: true },
			gzmaihuo: {
				audio: "maihuo",
				limited: true,
				trigger: { global: "useCardToTarget" },
				logTarget: "player",
				filter(event, player) {
					return event.card.name == "sha" && event.target.isIn() && event.target.isFriendOf(player);
				},
				preHidden: true,
				skillAnimation: true,
				animationColor: "thunder",
				check(event, player) {
					var source = event.player,
						targets = event.targets,
						card = event.card;
					for (var target of targets) {
						if (target.hasShan() || get.effect(target, card, source, player) >= 0) continue;
						if (player.hp <= 1 || target.hp <= (event.getParent().baseDamage || 1)) return true;
					}
					return false;
				},
				content() {
					player.awakenSkill("gzmaihuo");
					trigger.targets.length = 0;
					trigger.getParent().triggeredTargets2.length = 0;
					player.addSkill("gzmaihuo_effect");
					player.markAuto("gzmaihuo_effect", [trigger.player]);
					trigger.player.addMark("gzmaihuo_mark", 1, false);
				},
				subSkill: {
					effect: {
						audio: "maihuo",
						trigger: { global: "phaseBegin" },
						forced: true,
						charlotte: true,
						popup: false,
						filter(event, player) {
							return player.getStorage("gzmaihuo_effect").includes(event.player) && event.player.canUse("sha", player, false);
						},
						content() {
							"step 0";
							var target = trigger.player;
							player.unmarkAuto("gzmaihuo_effect", [target]);
							target.removeMark("gzmaihuo_mark", 1, false);
							target.useCard({ name: "sha", isCard: true }, player, "gzmaihuo_effect", false);
							"step 1";
							if (!player.getStorage("gzmaihuo_effect").length) player.removeSkill("gzmaihuo_effect");
						},
						group: "gzmaihuo_remove",
					},
					remove: {
						trigger: { player: "damageBegin2" },
						forced: true,
						filter(event, player) {
							return event.card && event.card.name == "sha" && event.getParent().skill == "gzmaihuo_effect";
						},
						content() {
							trigger.cancel();
							player.draw(2);
							if (player.checkMainSkill("gzmaihuo", false)) {
								player.removeCharacter(0);
							} else if (player.checkViceSkill("gzmaihuo", false)) {
								player.changeVice();
							}
						},
					},
					mark: {
						marktext: "祸",
						intro: {
							content: "mark",
							onunmark: true,
						},
					},
				},
			},
			//羊徽瑜
			gzcaiyuan: {
				audio: 2,
				trigger: { player: "phaseJieshuBegin" },
				forced: true,
				preHidden: true,
				filter(event, player) {
					var num1 = player.countCards("h"),
						num2 = num1;
					player.getHistory("gain", function (evt) {
						num2 -= evt.cards.length;
					});
					player.getHistory("lose", function (evt) {
						if (evt.hs) num2 += evt.hs.length;
					});
					return num1 >= num2;
				},
				content() {
					player.chooseDrawRecover(2, true);
				},
			},
			//左棻
			gzzhaosong: {
				audio: "zhaosong",
				enable: "phaseUse",
				preHidden: ["gzzhaosong_dying", "gzzhaosong_sha"],
				filter(event, player) {
					return !player.getStorage("gzzhaosong").includes("效果②") && game.hasPlayer(current => lib.skill.gzzhaosong.filterTarget(null, player, current));
				},
				filterTarget(card, player, target) {
					return target != player && (target.isUnseen(2) || target.countCards("h") > 0);
				},
				promptfunc: () => "出牌阶段，你可观看一名其他角色的所有暗置武将牌和手牌，然后可以获得其区域内的一张牌。",
				content() {
					player.markAuto("gzzhaosong", ["效果②"]);
					if (target.isUnseen(2)) player.viewCharacter(target, 2);
					if (target.countCards("hej") > 0) player.gainPlayerCard(target, "hej", "visible");
				},
				ai: {
					order: 11,
					result: {
						player(player, target) {
							return get.effect(target, { name: "zhibi" }, player, player) + get.effect(target, { name: "shunshou_copy" }, player, player);
						},
					},
				},
				group: ["gzzhaosong_dying", "gzzhaosong_sha"],
				subSkill: {
					dying: {
						audio: "zhaosong",
						trigger: { global: "dying" },
						logTarget: "player",
						filter(event, player) {
							return !player.getStorage("gzzhaosong").includes("效果①") && event.player.isDying() && event.player.hp <= 0;
						},
						prompt2: "令该角色回复至2点体力并摸一张牌",
						check(event, player) {
							return event.player.isFriendOf(player) && get.attitude(player, event.player) > 0;
						},
						content() {
							player.markAuto("gzzhaosong", ["效果①"]);
							var target = trigger.player,
								num = 2 - target.hp;
							if (num > 0) target.recover(num);
							target.draw();
						},
					},
					sha: {
						audio: "zhaosong",
						trigger: { global: "useCard2" },
						direct: true,
						filter(event, player) {
							if (event.card.name != "sha" || player.getStorage("gzzhaosong").includes("效果③")) return false;
							return game.hasPlayer(function (current) {
								return !event.targets.includes(current) && lib.filter.filterTarget(event.card, event.player, current);
							});
						},
						content() {
							"step 0";
							player
								.chooseTarget([1, 2], get.prompt("gzzhaosong"), "为" + get.translation(trigger.card) + "增加至多两个目标", function (card, player, target) {
									var event = _status.event.getTrigger();
									return !event.targets.includes(target) && lib.filter.filterTarget(event.card, event.player, target);
								})
								.set("ai", function (target) {
									var event = _status.event.getTrigger();
									return get.effect(target, event.card, event.player, _status.event.player);
								})
								.set(
									"goon",
									game.countPlayer(function (current) {
										return !trigger.targets.includes(current) && lib.filter.filterTarget(trigger.card, trigger.player, current) && get.effect(current, trigger.card, trigger.player, player) > 0;
									}) >=
										Math.min(
											2,
											game.countPlayer(function (current) {
												return !trigger.targets.includes(current) && lib.filter.filterTarget(trigger.card, trigger.player, current);
											})
										)
								)
								.setHiddenSkill("gzzhaosong_sha");
							"step 1";
							if (result.bool) {
								if (!event.isMine() && !event.isOnline()) game.delayx();
							} else event.finish();
							"step 2";
							var targets = result.targets;
							player.markAuto("gzzhaosong", ["效果③"]);
							player.logSkill("gzzhaosong_sha", targets);
							trigger.targets.addArray(targets);
						},
					},
				},
			},
			gzlisi: {
				audio: "lisi",
				trigger: { global: "dieAfter" },
				filter(event, player) {
					return event.player.isFriendOf(player) && player.getStorage("gzzhaosong").length > 0;
				},
				direct: true,
				content() {
					"step 0";
					var list = player.getStorage("gzzhaosong").slice(0);
					list.push("cancel2");
					player.chooseControl(list).set("prompt", get.prompt("gzlisi")).set("prompt2", "恢复〖诏颂〗的一个已发动的选项");
					"step 1";
					if (result.control != "cancel2") {
						player.logSkill("gzlisi");
						player.unmarkAuto("gzzhaosong", [result.control]);
					}
				},
			},
			//杨艳
			gzxuanbei: {
				audio: "xuanbei",
				trigger: { player: "showCharacterAfter" },
				filter(event, player) {
					return (
						!player.storage.gzxuanbei &&
						event.toShow.some(name => {
							return get.character(name, 3).includes("gzxuanbei");
						})
					);
				},
				forced: true,
				locked: false,
				content() {
					"step 0";
					player.storage.gzxuanbei = true;
					var cards = [];
					while (cards.length < 2) {
						var card = get.cardPile2(function (card) {
							if (cards.includes(card)) return false;
							return card.hasTag("lianheng") || get.is.yingbian(card);
						});
						if (!card) break;
						else cards.push(card);
					}
					if (cards.length) player.gain(cards, "gain2");
					if (cards.length < 2) player.draw(2 - cards.length);
					"step 1";
					player.addTempSkill("gzxuanbei_effect");
				},
				group: "gzxuanbei_change",
				subSkill: {
					effect: {
						trigger: { player: "useCard" },
						forced: true,
						popup: false,
						charlotte: true,
						filter(event, player) {
							return get.cardtag(event.card, "lianheng");
						},
						content() {
							player.draw();
						},
						ai: { forceYingbian: true },
						mark: true,
						intro: { content: "使用应变牌时直接获得强化，使用合纵牌时摸一张牌。" },
					},
					change: {
						audio: "xuanbei",
						trigger: { player: "die" },
						direct: true,
						forceDie: true,
						skillAnimation: true,
						animationColor: "thunder",
						content() {
							"step 0";
							player
								.chooseTarget(get.prompt("gzxuanbei"), "令一名其他角色变更副将", lib.filter.notMe)
								.set("forceDie", true)
								.set("ai", function (target) {
									var player = _status.event.player;
									var rank = get.guozhanRank(target.name2, target) <= 3;
									var att = get.attitude(player, target);
									if (att > 0) {
										return (4 - rank) * att;
									}
									return -(rank - 6) * att;
								});
							"step 1";
							if (result.bool) {
								var target = result.targets[0];
								player.logSkill("gzxuanbei_change", target);
								game.delayx();
								target.changeVice();
							}
						},
					},
				},
			},
			//司马师
			gzyimie: {
				audio: "yimie",
				inherit: "yimie",
				mainSkill: true,
				init(player) {
					if (player.checkMainSkill("gzyimie")) {
						player.removeMaxHp(2);
					}
				},
			},
			gztairan: {
				audio: "tairan",
				trigger: { player: "phaseUseBegin" },
				check(event, player) {
					return (
						player.isDamaged() &&
						player.hasCard(function (card) {
							return 5.5 - get.value(card);
						}, "he")
					);
				},
				content() {
					"step 0";
					var list = [],
						num = 0;
					if (
						player.isHealthy() ||
						!player.hasCard(function (card) {
							return lib.filter.cardDiscardable(card, player, "gztairan");
						}, "he")
					)
						num = 1;
					event.num = num;
					for (var i = num; i <= player.hp; i++) {
						list.push(i + "点");
					}
					player.chooseControl(list).set("prompt", "###请先失去任意点体力###此回合结束时，你将恢复等量的体力");
					"step 1";
					var num1 = result.index + num;
					event.num1 = num1;
					if (num1 > 0) player.loseHp(num1);
					"step 2";
					if (
						player.isDamaged() &&
						player.hasCard(function (card) {
							return lib.filter.cardDiscardable(card, player, "gztairan");
						}, "he")
					) {
						var next = player.chooseToDiscard("he", [1, player.getDamagedHp()], "然后请弃置任意张牌", "此回合结束时，你将摸等量的牌。").set("ai", function (card) {
							return 5.5 - get.value(card);
						});
						if (event.num1 == 0) next.set("forced", true);
					}
					"step 3";
					var num2 = 0;
					if (result.bool) num2 = result.cards.length;
					var storage = [event.num1, num2];
					player.addTempSkill("gztairan_effect");
					player.storage.gztairan_effect = storage;
				},
				subSkill: {
					effect: {
						audio: "tairan",
						trigger: { player: "phaseEnd" },
						filter(event, player) {
							var storage = player.storage.gztairan_effect;
							return storage && storage.length == 2 && (storage[1] > 0 || player.isDamaged());
						},
						forced: true,
						charlotte: true,
						onremove: true,
						content() {
							var storage = player.storage.gztairan_effect;
							if (storage[0] > 0) player.recover(storage[0]);
							if (storage[1] > 0) player.draw(storage[1]);
						},
					},
				},
			},
			//杜预
			gzsanchen: {
				audio: "sanchen",
				enable: "phaseUse",
				filter(event, player) {
					var stat = player.getStat("sanchen");
					return game.hasPlayer(function (current) {
						return !stat || !stat.includes(current);
					});
				},
				filterTarget(card, player, target) {
					var stat = player.getStat("sanchen");
					return !stat || !stat.includes(target);
				},
				usable: 1,
				content() {
					"step 0";
					if (!player._fakesanchen) {
						player._fakesanchen = true;
						player.when({ global: "phaseAfter" }).then(() => {
							delete player._fakesanchen;
							if (player.hasMark("gzsanchen")) {
								player.removeMark("gzsanchen", player.countMark("gzsanchen"), false);
							}
						});
					}
					var stat = player.getStat();
					if (!stat.sanchen) stat.sanchen = [];
					stat.sanchen.push(target);
					target.draw(3);
					"step 1";
					if (!target.countCards("he")) event.finish();
					else
						target.chooseToDiscard("he", true, 3).set("ai", function (card) {
							var list = ui.selected.cards.map(function (i) {
								return get.type2(i);
							});
							if (!list.includes(get.type2(card))) return 7 - get.value(card);
							return -get.value(card);
						});
					"step 2";
					if (result.bool && result.cards && result.cards.length) {
						var list = [];
						for (var i of result.cards) list.add(get.type2(i));
						if (list.length == result.cards.length) {
							target.draw();
							player.getStat("skill").gzsanchen--;
							player.addMark("gzsanchen", 1, false);
						}
					} else {
						target.draw();
						player.getStat("skill").gzsanchen--;
						player.addMark("gzsanchen", 1, false);
					}
				},
				ai: {
					order: 9,
					threaten: 1.7,
					result: {
						target(player, target) {
							if (target.hasSkillTag("nogain")) return 0.1;
							return Math.sqrt(target.countCards("he"));
						},
					},
				},
				marktext: "陈",
				intro: {
					name2: "陈",
					content: "mark",
				},
			},
			gzpozhu: {
				audio: "pozhu",
				enable: "phaseUse",
				mainSkill: true,
				init(player) {
					if (player.checkMainSkill("gzpozhu")) player.removeMaxHp();
				},
				viewAsFilter(player) {
					return player.countMark("gzsanchen") > 0 && player.countCards("hs") > 0;
				},
				viewAs: { name: "chuqibuyi" },
				filterCard: true,
				position: "hs",
				check(card) {
					return 7 - get.value(card);
				},
				onuse(result, player) {
					player.removeMark("gzsanchen", 1, false);
				},
			},
			//钟琰
			gzbolan: {
				audio: "bolan",
				global: "gzbolan_global",
				enable: "phaseUse",
				usable: 1,
				content() {
					"step 0";
					if ((event.num && event.num > 0) || !_status.characterlist.length) {
						event.finish();
						return;
					}
					var character = _status.characterlist.randomGet();
					var groups,
						double = get.is.double(character, true);
					if (double) groups = double.slice(0);
					else groups = [lib.character[character][1]];
					event.groups = groups;
					event.videoId = lib.status.videoId++;
					game.broadcastAll(
						function (player, id, character) {
							ui.create.dialog(get.translation(player) + "发动了【博览】", [[character], "character"]).videoId = id;
						},
						player,
						event.videoId,
						character
					);
					game.delay(3);
					"step 1";
					game.broadcastAll("closeDialog", event.videoId);
					var list1 = ["wei", "shu", "wu", "qun", "jin"],
						list2 = ["gzqice", "tiaoxin", "gzzhiheng", "new_chuli", "gzsanchen"];
					var skills = [];
					for (var i = 0; i < list1.length; i++) {
						if (event.groups.includes(list1[i])) skills.push(list2[i]);
					}
					if (!skills.length) event.finish();
					else if (skills.length == 1) event._result = { control: skills[0] };
					else player.chooseControl(skills).set("prompt", "选择获得一个技能直到回合结束");
					"step 2";
					var skill = result.control;
					player.addTempSkills(skill);
					player.popup(skill);
				},
				derivation: ["gzqice", "tiaoxin", "gzzhiheng", "new_chuli", "gzsanchen"],
				ai: {
					order: 10,
					result: { player: 1 },
				},
				subSkill: {
					global: {
						inherit: "gzbolan",
						filter(event, player) {
							return (
								!player.hasSkill("gzbolan", true) &&
								game.hasPlayer(function (current) {
									return current != player && current.hasSkill("gzbolan");
								})
							);
						},
						selectTarget: -1,
						filterTarget(card, player, target) {
							return target != player && target.hasSkill("gzbolan");
						},
						contentAfter() {
							player.loseHp();
						},
						ai: {
							order: 10,
							result: {
								player(player, target) {
									if (get.effect(player, { name: "losehp" }, player, player) > 0) return 3;
									if (player.isHealthy()) return 1;
									return -1;
								},
							},
						},
					},
				},
			},
			//司马昭
			gzchoufa: {
				audio: "choufa",
				inherit: "choufa",
				content() {
					"step 0";
					player.choosePlayerCard(target, "h", true);
					"step 1";
					player.showCards(result.cards, get.translation(player) + "对" + get.translation(target) + "发动了【筹伐】");
					var type = get.type2(result.cards[0], target),
						hs = target.getCards("h", function (card) {
							return card != result.cards[0] && get.type2(card, target) != type;
						});
					if (hs.length) {
						target.addGaintag(hs, "xinchoufa");
						target.addTempSkill("xinchoufa2");
					}
				},
			},
			//张春华
			gzhuishi: {
				audio: 2,
				trigger: { player: "phaseDrawBegin1" },
				filter(event, player) {
					return ui.discardPile.childNodes.length > 0;
				},
				preHidden: true,
				prompt() {
					return get.prompt("huishi") + "（可观看牌数：" + lib.skill.gzhuishi.getNum() + "）";
				},
				check(event, player) {
					return lib.skill.gzhuishi.getNum() > 3;
				},
				getNum() {
					var list = [];
					list.push(ui.discardPile.lastChild);
					if (list[0].previousSibling) list.push(list[0].previousSibling);
					var num = 0;
					for (var i of list) {
						var name = get.translation(i.name);
						if (name == "挟令") name = "挟天子以令诸侯";
						num += name.length;
					}
					return num;
				},
				content() {
					"step 0";
					trigger.changeToZero();
					var cards = game.cardsGotoOrdering(get.cards(lib.skill.gzhuishi.getNum())).cards;
					var num = Math.ceil(cards.length / 2);
					var next = player.chooseToMove("慧识：将" + get.cnNumber(num) + "张牌置于牌堆底并获得其余的牌", true);
					next.set("list", [["牌堆顶的展示牌", cards], ["牌堆底"]]);
					next.set("filterMove", function (from, to, moved) {
						if (moved[0].includes(from) && to == 1) return moved[1].length < _status.event.num;
						return true;
					});
					next.set("filterOk", function (moved) {
						return moved[1].length == _status.event.num;
					});
					next.set("num", num);
					next.set("processAI", function (list) {
						var cards = list[0][1].slice(0).sort(function (a, b) {
							return get.value(b) - get.useful(a);
						});
						return [cards, cards.splice(cards.length - _status.event.num)];
					});
					"step 1";
					if (result.bool) {
						var list = result.moved;
						if (list[0].length) player.gain(list[0], "gain2");
						while (list[1].length) ui.cardPile.appendChild(list[1].shift().fix());
					}
				},
			},
			gzqingleng: {
				audio: 2,
				trigger: { global: "phaseEnd" },
				direct: true,
				preHidden: true,
				filter(event, player) {
					var target = event.player;
					return target != player && target.isIn() && target.isUnseen(2) && player.countCards("he") > 0 && player.canUse({ name: "sha", nature: "ice" }, target, false);
				},
				content() {
					"step 0";
					player
						.chooseCard("he", get.prompt("gzqingleng", trigger.player), "将一张牌当做冰【杀】对其使用", function (card, player) {
							return player.canUse(get.autoViewAs({ name: "sha", nature: "ice" }, [card]), _status.event.target, false);
						})
						.set("target", trigger.player)
						.set("ai", function (card) {
							if (get.effect(_status.event.target, get.autoViewAs({ name: "sha", nature: "ice" }, [card]), player) <= 0) return false;
							return 6 - get.value(card);
						})
						.setHiddenSkill(event.name);
					"step 1";
					if (result.bool) {
						player.useCard(get.autoViewAs({ name: "sha", nature: "ice" }, result.cards), result.cards, false, trigger.player, "gzqingleng");
						if (trigger.player.isUnseen()) {
							player.draw();
						}
					}
				},
			},
			//司马懿
			gzquanbian: {
				audio: "quanbian",
				preHidden: true,
				trigger: { player: ["useCard", "respond"] },
				filter(event, player) {
					if (player.hasSkill("gzquanbian_blocker")) return false;
					var phase = event.getParent("phaseUse");
					if (!phase || phase.player != player) return false;
					var suit = get.suit(event.card);
					if (!lib.suit.includes(suit) || !lib.skill.quanbian.hasHand(event)) return false;
					return (
						player.getHistory("useCard", function (evt) {
							return evt != event && get.suit(evt.card) == suit && lib.skill.quanbian.hasHand(evt) && evt.getParent("phaseUse") == phase;
						}).length +
							player.getHistory("respond", function (evt) {
								return evt != event && get.suit(evt.card) == suit && lib.skill.quanbian.hasHand(evt) && evt.getParent("phaseUse") == phase;
							}).length ==
						0
					);
				},
				content() {
					"step 0";
					var cards = get.cards(player.maxHp);
					for (var i = cards.length - 1; i >= 0; i--) {
						ui.cardPile.insertBefore(cards[i], ui.cardPile.firstChild);
					}
					game.updateRoundNumber();
					player.chooseButton(["权变：选择获得一张牌", cards], true).set("ai", function (button) {
						var player = _status.event.player,
							card = button.link;
						var suit = get.suit(card, false),
							val = get.value(card);
						if (
							player.hasHistory("useCard", function (evt) {
								return get.suit(evt.card, false) == suit;
							}) ||
							player.hasHistory("respond", function (evt) {
								return get.suit(evt.card, false) == suit;
							})
						)
							return val;
						return val + 8;
					});
					"step 1";
					if (result.bool) {
						var card = result.links[0];
						player.gain(card, "gain2");
						var suit = get.suit(card, false);
						if (
							player.hasHistory("useCard", function (evt) {
								return get.suit(evt.card, false) == suit;
							}) ||
							player.hasHistory("respond", function (evt) {
								return get.suit(evt.card, false) == suit;
							})
						)
							player.addTempSkill("gzquanbian_blocker");
					}
				},
				subSkill: { blocker: { charlotte: true } },
			},
			//十周年羊祜
			gzdeshao: {
				audio: "dcdeshao",
				trigger: { target: "useCardToTargeted" },
				usable(skill, player) {
					return player.hp;
				},
				preHidden: true,
				countUnseen(player) {
					let num = 0;
					if (player.isUnseen(0)) num++;
					if (player.isUnseen(1)) num++;
					return num;
				},
				filter(event, player) {
					if (player == event.player || event.targets.length != 1 || get.color(event.card) != "black") return false;
					if (lib.skill.gzdeshao.countUnseen(event.player) < lib.skill.gzdeshao.countUnseen(player)) return false;
					return event.player.countDiscardableCards(player, "he");
				},
				check(event, player) {
					return get.effect(event.player, { name: "guohe_copy2" }, player, player) > 0;
				},
				logTarget: "player",
				content() {
					player.discardPlayerCard(trigger.player, true, "he");
				},
			},
			gzmingfa: {
				audio: "dcmingfa",
				enable: "phaseUse",
				usable: 1,
				filterTarget(card, player, target) {
					return player != target && target.isEnemyOf(player);
				},
				content() {
					player.markAuto("gzmingfa", targets);
					game.delayx();
				},
				onremove: true,
				ai: {
					order: 1,
					result: { target: -1 },
				},
				group: "gzmingfa_effect",
				subSkill: {
					effect: {
						audio: "dcmingfa",
						trigger: { global: "phaseEnd" },
						forced: true,
						filter(event, player) {
							return player.getStorage("gzmingfa").includes(event.player);
						},
						logTarget: "player",
						content() {
							var target = trigger.player;
							player.unmarkAuto("gzmingfa", [target]);
							if (target.isIn()) {
								var num = player.countCards("h") - target.countCards("h");
								if (num > 0) {
									target.damage();
									player.gainPlayerCard(target, true, "h");
								} else if (num < 0) {
									player.draw(Math.min(5, -num));
								}
							}
						},
					},
				},
			},
			//海外服国战
			//杨修
			gzdanlao: {
				audio: "danlao",
				inherit: "danlao",
				preHidden: true,
				filter(event, player) {
					return get.type2(event.card) == "trick" && event.targets?.length > 1;
				},
			},
			gzjilei: {
				inherit: "jilei",
				preHidden: true,
				content() {
					"step 0";
					player
						.chooseControl("basic", "trick", "equip", "cancel2", function () {
							var source = _status.event.source;
							if (get.attitude(_status.event.player, source) > 0) return "cancel2";
							var list = ["basic", "trick", "equip"].filter(function (name) {
								return !source.storage.jilei2 || !source.storage.jilei2.includes(name);
							});
							if (!list.length) return "cancel2";
							if (
								list.includes("trick") &&
								source.countCards("h", function (card) {
									return get.type(card, null, source) == "trick" && source.hasValueTarget(card);
								}) > 1
							)
								return "trick";
							return list[0];
						})
						.set("prompt", get.prompt2("jilei", trigger.source))
						.set("source", trigger.source)
						.setHiddenSkill("gzjilei");
					"step 1";
					if (result.control != "cancel2") {
						player.logSkill("gzjilei", trigger.source);
						player.chat(get.translation(result.control) + "牌");
						game.log(player, "声明了", "#y" + get.translation(result.control) + "牌");
						trigger.source.addTempSkill("jilei2");
						trigger.source.storage.jilei2.add(result.control);
						trigger.source.updateMarks("jilei2");
						game.delayx();
					}
				},
			},
			//诸葛瑾
			gzhuanshi: {
				audio: "huanshi",
				trigger: { global: "judge" },
				direct: true,
				preHidden: true,
				filter(event, player) {
					return player.countCards("hes") > 0 && event.player.isFriendOf(player);
				},
				content() {
					"step 0";
					player
						.chooseCard(get.translation(trigger.player) + "的" + (trigger.judgestr || "") + "判定为" + get.translation(trigger.player.judging[0]) + "，" + get.prompt("gzhuanshi"), "hes", function (card) {
							var player = _status.event.player;
							var mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
							if (mod2 != "unchanged") return mod2;
							var mod = game.checkMod(card, player, "unchanged", "cardRespondable", player);
							if (mod != "unchanged") return mod;
							return true;
						})
						.set("ai", function (card) {
							var trigger = _status.event.getTrigger();
							var player = _status.event.player;
							var judging = _status.event.judging;
							var result = trigger.judge(card) - trigger.judge(judging);
							var attitude = get.attitude(player, trigger.player);
							if (attitude == 0 || result == 0) return 0;
							if (attitude > 0) {
								return result - get.value(card) / 2;
							} else {
								return -result - get.value(card) / 2;
							}
						})
						.set("judging", trigger.player.judging[0])
						.setHiddenSkill("gzhuanshi");
					"step 1";
					if (result.bool) {
						player.respond(result.cards, "gzhuanshi", "highlight", "noOrdering");
					} else {
						event.finish();
					}
					"step 2";
					if (result.bool) {
						if (trigger.player.judging[0].clone) {
							trigger.player.judging[0].clone.classList.remove("thrownhighlight");
							game.broadcast(function (card) {
								if (card.clone) {
									card.clone.classList.remove("thrownhighlight");
								}
							}, trigger.player.judging[0]);
							game.addVideo("deletenode", player, get.cardsInfo([trigger.player.judging[0].clone]));
						}
						game.cardsDiscard(trigger.player.judging[0]);
						trigger.player.judging[0] = result.cards[0];
						trigger.orderingCards.addArray(result.cards);
						game.log(trigger.player, "的判定牌改为", result.cards[0]);
						game.delay(2);
					}
				},
				ai: {
					rejudge: true,
					tag: {
						rejudge: 1,
					},
				},
			},
			gzhongyuan: {
				audio: "hongyuan",
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					return player.hasCard(function (card) {
						return lib.skill.gzhongyuan.filterCard(card);
					}, "h");
				},
				filterCard(card) {
					return !card.hasTag("lianheng") && !card.hasGaintag("_lianheng");
				},
				position: "h",
				discard: false,
				lose: false,
				content() {
					cards[0].addGaintag("_lianheng");
					player.addTempSkill("gzhongyuan_clear");
				},
				check(card) {
					return 4.5 - get.value(card);
				},
				group: "gzhongyuan_draw",
				preHidden: true,
				ai: { order: 2, result: { player: 1 } },
				subSkill: {
					clear: {
						charlotte: true,
						onremove(player) {
							player.removeGaintag("_lianheng");
						},
					},
					draw: {
						audio: "hongyuan",
						trigger: { player: "drawBefore" },
						direct: true,
						filter(event, player) {
							return (
								event.getParent().name == "_lianheng" &&
								game.hasPlayer(function (current) {
									return current != player && current.isFriendOf(player);
								})
							);
						},
						content() {
							"step 0";
							player
								.chooseTarget(get.prompt("gzhongyuan"), "将摸牌（" + get.cnNumber(trigger.num) + "张）转移给一名同势力角色", function (card, player, target) {
									return target != player && target.isFriendOf(player);
								})
								.setHiddenSkill("gzhongyuan")
								.set("ai", () => -1);
							"step 1";
							if (result.bool) {
								var target = result.targets[0];
								player.logSkill("gzhongyuan", target);
								trigger.cancel();
								target.draw(trigger.num);
							}
						},
					},
				},
			},
			gzmingzhe: {
				audio: "mingzhe",
				trigger: {
					player: ["loseAfter", "useCard", "respond"],
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				filter(event, player) {
					if (player == _status.currentPhase) return false;
					if (event.name == "useCard" || event.name == "respond") {
						return (
							get.color(event.card, false) == "red" &&
							player.hasHistory("lose", function (evt) {
								return evt.getParent() == event && evt.hs && evt.hs.length > 0;
							})
						);
					}
					var evt = event.getl(player);
					if (!evt || !evt.es || !evt.es.length) return false;
					for (var i of evt.es) {
						if (get.color(i, player) == "red") return true;
					}
					return false;
				},
				frequent: true,
				preHidden: true,
				content() {
					player.draw();
				},
			},
			//廖化
			gzdangxian: {
				trigger: { player: "phaseBegin" },
				forced: true,
				preHidden: true,
				audio: "dangxian",
				audioname: ["guansuo"],
				content() {
					var next = player.phaseUse();
					event.next.remove(next);
					trigger.next.push(next);
				},
				group: "gzdangxian_show",
				subSkill: {
					show: {
						audio: "dangxian",
						trigger: { player: "showCharacterAfter" },
						forced: true,
						filter(event, player) {
							return (
								event.toShow.some(name => {
									return get.character(name, 3).includes("gzdangxian");
								}) && !player.storage.gzdangxian_draw
							);
						},
						content() {
							player.storage.gzdangxian_draw = true;
							player.addMark("xianqu_mark", 1);
						},
					},
				},
			},
			//新国标2022
			//许褚
			gzluoyi: {
				audio: "luoyi",
				trigger: { player: "phaseDrawEnd" },
				direct: true,
				preHidden: true,
				filter(event, player) {
					return player.countCards("he") > 0;
				},
				content() {
					"step 0";
					player
						.chooseToDiscard("he", get.prompt2("gzluoyi"))
						.setHiddenSkill("gzluoyi")
						.set("ai", function (card) {
							var player = _status.event.player;
							if (
								player.hasCard(function (cardx) {
									if (cardx == card) return false;
									return (cardx.name == "sha" || cardx.name == "juedou") && player.hasValueTarget(cardx, null, true);
								}, "hs")
							)
								return 5 - get.value(card);
							return -get.value(card);
						}).logSkill = "gzluoyi";
					"step 1";
					if (result.bool) player.addTempSkill("gzluoyi_buff");
				},
				subSkill: {
					buff: {
						audio: "luoyi",
						charlotte: true,
						forced: true,
						trigger: { source: "damageBegin1" },
						filter(event, player) {
							return event.card && (event.card.name == "sha" || event.card.name == "juedou") && event.getParent().type == "card";
						},
						content() {
							trigger.num++;
						},
					},
				},
			},
			//典韦
			gzqiangxi: {
				audio: "qiangxi",
				inherit: "qiangxi",
				filterTarget(card, player, target) {
					return target != player;
				},
			},
			//小乔
			gztianxiang: {
				audio: "tianxiang",
				audioname: ["daxiaoqiao", "re_xiaoqiao", "ol_xiaoqiao"],
				trigger: { player: "damageBegin4" },
				direct: true,
				preHidden: true,
				usable: 1,
				filter(event, player) {
					return (
						player.countCards("h", function (card) {
							return _status.connectMode || get.suit(card, player) == "heart";
						}) > 0 && event.num > 0
					);
				},
				content() {
					"step 0";
					player
						.chooseCardTarget({
							filterCard(card, player) {
								return get.suit(card) == "heart" && lib.filter.cardDiscardable(card, player);
							},
							filterTarget(card, player, target) {
								return player != target;
							},
							ai1(card) {
								return 10 - get.value(card);
							},
							ai2(target) {
								var att = get.attitude(_status.event.player, target);
								var trigger = _status.event.getTrigger();
								var da = 0;
								if (_status.event.player.hp == 1) {
									da = 10;
								}
								var eff = get.damageEffect(target, trigger.source, target);
								if (att == 0) return 0.1 + da;
								if (eff >= 0 && att > 0) {
									return att + da;
								}
								if (att > 0 && target.hp > 1) {
									if (target.maxHp - target.hp >= 3) return att * 1.1 + da;
									if (target.maxHp - target.hp >= 2) return att * 0.9 + da;
								}
								return -att + da;
							},
							prompt: get.prompt("gztianxiang"),
							prompt2: lib.translate.gztianxiang_info,
						})
						.setHiddenSkill(event.name);
					"step 1";
					if (result.bool) {
						player.discard(result.cards);
						var target = result.targets[0];
						player
							.chooseControlList(
								true,
								function (event, player) {
									var target = _status.event.target;
									var att = get.attitude(player, target);
									if (target.hasSkillTag("maihp")) att = -att;
									if (att > 0) {
										return 0;
									} else {
										return 1;
									}
								},
								["令" + get.translation(target) + "受到伤害来源对其造成的1点伤害，然后摸X张牌（X为其已损失体力值且至多为5）", "令" + get.translation(target) + "失去1点体力，然后获得" + get.translation(result.cards)]
							)
							.set("target", target);
						player.logSkill(event.name, target);
						trigger.cancel();
						event.target = target;
						event.card = result.cards[0];
					} else {
						player.storage.counttrigger.gztianxiang--;
						event.finish();
					}
					"step 2";
					if (typeof result.index == "number") {
						event.index = result.index;
						if (result.index) {
							event.related = event.target.loseHp();
						} else {
							event.related = event.target.damage(trigger.source || "nosource", "nocard");
						}
					} else event.finish();
					"step 3";
					//if(event.related.cancelled||target.isDead()) return;
					if (event.index && card.isInPile()) target.gain(card, "gain2");
					else if (target.getDamagedHp()) target.draw(Math.min(5, target.getDamagedHp()));
				},
				ai: {
					maixie_defend: true,
					effect: {
						target(card, player, target) {
							if (player.hasSkillTag("jueqing", false, target)) return;
							if (get.tag(card, "damage") && target.countCards("he") > 1) return 0.7;
						},
					},
				},
			},
			gzhongyan: {
				mod: {
					suit(card, suit) {
						if (suit == "spade") return "heart";
					},
					maxHandcard(player, num) {
						if (
							player.hasCard(function (card) {
								return get.suit(card, player) == "heart";
							}, "e")
						)
							return num + 1;
					},
				},
			},
			//黄忠
			gzliegong: {
				audio: "liegong",
				audioname2: { gz_jun_liubei: "shouyue_liegong" },
				locked: false,
				mod: {
					targetInRange(card, player, target) {
						if (card.name == "sha" && target.countCards("h") < player.countCards("h")) return true;
					},
					attackRange(player, distance) {
						if (get.zhu(player, "shouyue")) return distance + 1;
					},
				},
				trigger: { player: "useCardToPlayered" },
				filter(event, player) {
					return event.card.name == "sha" && player.hp <= event.target.hp;
				},
				direct: true,
				preHidden: true,
				content() {
					"step 0";
					var str = get.translation(trigger.target),
						card = get.translation(trigger.card);
					player
						.chooseControl("cancel2")
						.set("choiceList", ["令" + card + "对" + str + "的伤害+1", "令" + str + "不能响应" + card])
						.set("prompt", get.prompt("gzliegong", trigger.target))
						.setHiddenSkill("gzliegong")
						.set("ai", function () {
							var player = _status.event.player,
								target = _status.event.getTrigger().target;
							if (get.attitude(player, target) > 0) return 2;
							return target.mayHaveShan(
								player,
								"use",
								target.getCards("h", i => {
									return i.hasGaintag("sha_notshan");
								})
							)
								? 1
								: 0;
						});
					"step 1";
					if (result.control != "cancel2") {
						var target = trigger.target;
						player.logSkill("gzliegong", target);
						if (result.index == 1) {
							game.log(trigger.card, "不可被", target, "响应");
							trigger.directHit.add(target);
						} else {
							game.log(trigger.card, "对", target, "的伤害+1");
							var map = trigger.getParent().customArgs,
								id = target.playerid;
							if (!map[id]) map[id] = {};
							if (!map[id].extraDamage) map[id].extraDamage = 0;
							map[id].extraDamage++;
						}
					}
				},
			},
			//潘凤
			gzkuangfu: {
				audio: "kuangfu",
				trigger: { player: "useCardToPlayered" },
				preHidden: true,
				logTarget: "target",
				filter(event, player) {
					return event.card.name == "sha" && player.isPhaseUsing() && !player.hasSkill("gzkuangfu_extra") && event.target.countGainableCards(player, "e") > 0;
				},
				check(event, player) {
					if (
						get.attitude(player, event.target) > 0 ||
						!event.target.hasCard(function (card) {
							return lib.filter.canBeGained(card, player, event.target) && get.value(card, event.target) > 0;
						}, "e")
					)
						return false;
					return true;
				},
				content() {
					trigger.getParent()._gzkuangfued = true;
					player.gainPlayerCard(trigger.target, "e", true);
					player.addTempSkill("gzkuangfu_extra", "phaseUseAfter");
				},
				subSkill: {
					extra: {
						trigger: { player: "useCardAfter" },
						charlotte: true,
						forced: true,
						filter(event, player) {
							return (
								event._gzkuangfued &&
								!player.hasHistory("sourceDamage", function (evt) {
									return evt.card && event.card;
								}) &&
								player.countCards("h") > 0
							);
						},
						content() {
							player.chooseToDiscard("h", 2, true);
						},
					},
				},
			},
			//吕布
			gzwushuang: {
				audio: "wushuang",
				audioname2: { gz_lvlingqi: "wushuang_lvlingqi" },
				forced: true,
				locked: true,
				group: ["wushuang1", "wushuang2"],
				preHidden: ["wushuang1", "wushuang2", "gzwushuang"],
				trigger: { player: "useCard1" },
				direct: true,
				filter(event, player) {
					if (event.card.name != "juedou" || !event.card.isCard) return false;
					if (event.targets) {
						if (
							game.hasPlayer(function (current) {
								return !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, player, current);
							})
						) {
							return true;
						}
					}
					return false;
				},
				content() {
					"step 0";
					var num = game.countPlayer(function (current) {
						return !trigger.targets.includes(current) && lib.filter.targetEnabled2(trigger.card, player, current);
					});
					player
						.chooseTarget("无双：是否为" + get.translation(trigger.card) + "增加" + (num > 1 ? "至多两个" : "一个") + "目标？", [1, Math.min(2, num)], function (card, player, target) {
							var trigger = _status.event.getTrigger();
							var card = trigger.card;
							return !trigger.targets.includes(target) && lib.filter.targetEnabled2(card, player, target);
						})
						.set("ai", function (target) {
							var player = _status.event.player;
							var card = _status.event.getTrigger().card;
							return get.effect(target, card, player, player);
						})
						.setHiddenSkill("gzwushuang");
					"step 1";
					if (result.bool) {
						if (player != game.me && !player.isOnline()) game.delayx();
					} else event.finish();
					"step 2";
					var targets = result.targets.sortBySeat();
					player.logSkill("gzwushuang", targets);
					trigger.targets.addArray(targets);
				},
			},
			//夏侯渊
			gzshensu: {
				audio: "shensu1",
				audioname: ["xiahouba", "re_xiahouyuan", "ol_xiahouyuan"],
				group: ["gzshensu_1", "gzshensu_2"],
				preHidden: ["gzshensu_1", "gzshensu_2", "gzshensu"],
				trigger: { player: "phaseDiscardBegin" },
				direct: true,
				filter(event, player) {
					return player.hp > 0;
				},
				content() {
					"step 0";
					player
						.chooseTarget(get.prompt("gzshensu"), "失去1点体力并跳过弃牌阶段，视为对一名其他角色使用一张无距离限制的【杀】", function (card, player, target) {
							return player.canUse("sha", target, false);
						})
						.setHiddenSkill("gzshensu")
						.set("goon", player.needsToDiscard())
						.set("ai", function (target) {
							var player = _status.event.player;
							if (!_status.event.goon || player.hp <= target.hp) return false;
							return get.effect(target, { name: "sha", isCard: true }, player, player);
						});
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill("gzshensu", target);
						player.loseHp();
						trigger.cancel();
						player.useCard({ name: "sha", isCard: true }, target, false);
					}
				},
				subSkill: {
					1: {
						audio: "shensu1",
						inherit: "shensu1",
						sourceSkill: "gzshensu",
					},
					2: {
						inherit: "shensu2",
						sourceSkill: "gzshensu",
					},
				},
			},
			//吕玲绮
			gzshenwei: {
				audio: "llqshenwei",
				mainSkill: true,
				init(player) {
					if (player.checkMainSkill("gzshenwei")) {
						player.removeMaxHp();
					}
				},
				trigger: { player: "phaseDrawBegin2" },
				forced: true,
				locked: false,
				filter: (event, player) => !event.numFixed && player.isMaxHandcard(),
				preHidden: true,
				content() {
					trigger.num += 2;
				},
				mod: {
					maxHandcard: (player, num) => num + 2,
				},
			},
			gzzhuangrong: {
				audio: "zhuangrong",
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					return (
						!player.hasSkill("gzwushuang") &&
						player.hasCard(function (card) {
							return get.type2(card, player) == "trick";
						}, "h")
					);
				},
				filterCard(card, player) {
					return get.type2(card, player) == "trick";
				},
				content() {
					player.addTempSkill("gzwushuang", "phaseUseEnd");
				},
				derivation: "gzwushuang",
			},
			wushuang_lvlingqi: { audio: 2 },
			//荀谌
			gzfenglve: {
				audio: "refenglve",
				derivation: "gzfenglve_zongheng",
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					return (
						player.countCards("h") > 0 &&
						!player.hasSkillTag("noCompareSource") &&
						game.hasPlayer(function (current) {
							return current != player && current.countCards("h") > 0 && !current.hasSkillTag("noCompareTarget");
						})
					);
				},
				filterTarget(card, player, target) {
					return target != player && target.countCards("h") > 0 && !target.hasSkillTag("noCompareTarget");
				},
				content() {
					"step 0";
					player.chooseToCompare(target);
					"step 1";
					if (result.bool) {
						if (!target.countCards("hej")) event.goto(3);
						else {
							event.giver = target;
							event.gainner = player;
							target.choosePlayerCard(target, true, "hej", 2, "交给" + get.translation(player) + "两张牌");
						}
					} else if (result.tie) {
						event.goto(3);
					} else {
						if (!player.countCards("he")) event.goto(3);
						else {
							event.giver = player;
							event.gainner = target;
							player.chooseCard(true, "he", "交给" + get.translation(target) + "一张牌");
						}
					}
					"step 2";
					if (result.bool) event.giver.give(result.cards, event.gainner, "giveAuto");
					"step 3";
					if (target.isIn())
						player.chooseBool("纵横：是否令" + get.translation(target) + "获得【锋略】？").set("ai", function () {
							var evt = _status.event.getParent();
							return get.attitude(evt.player, evt.target) > 0;
						});
					else event.finish();
					"step 4";
					if (result.bool) {
						target.addTempSkill("gzfenglve_zongheng", { player: "phaseEnd" });
						game.log(player, "发起了", "#y纵横", "，令", target, "获得了技能", "#g【锋略】");
					}
				},
				ai: {
					order: 8,
					result: {
						target(player, target) {
							if (
								!player.hasCard(function (card) {
									if (get.position(card) != "h") return false;
									var val = get.value(card);
									if (val < 0) return true;
									if (val <= 5) {
										return card.number >= 10;
									}
									if (val <= 6) {
										return card.number >= 13;
									}
									return false;
								})
							)
								return 0;
							return -Math.sqrt(1 + target.countCards("he")) / (1 + target.countCards("j"));
						},
					},
				},
			},
			gzfenglve_zongheng: {
				inherit: "gzfenglve",
				content() {
					"step 0";
					player.chooseToCompare(target);
					"step 1";
					if (result.bool) {
						if (!target.countCards("hej")) event.finish();
						else {
							event.giver = target;
							event.gainner = player;
							target.choosePlayerCard(target, true, "hej", "交给" + get.translation(player) + "一张牌");
						}
					} else if (result.tie) {
						event.finish();
					} else {
						if (!player.countCards("he")) event.finish();
						else {
							event.giver = player;
							event.gainner = target;
							player.chooseCard(true, "he", 2, "交给" + get.translation(target) + "两张牌");
						}
					}
					"step 2";
					if (result.bool) event.giver.give(result.cards, event.gainner, "giveAuto");
				},
				ai: {
					order: 8,
					result: {
						target(player, target) {
							if (
								!player.hasCard(function (card) {
									if (get.position(card) != "h") return false;
									var val = get.value(card);
									if (val < 0) return true;
									if (val <= 5) {
										return card.number >= 12;
									}
									if (val <= 6) {
										return card.number >= 13;
									}
									return false;
								})
							)
								return 0;
							return -Math.sqrt(1 + target.countCards("he")) / (1 + target.countCards("j"));
						},
					},
				},
			},
			gzanyong: {
				audio: "anyong",
				trigger: { global: "damageBegin1" },
				usable: 1,
				filter(event, player) {
					return event.source && event.player != event.source && event.source.isFriendOf(player) && event.player.isIn();
				},
				check(event, player) {
					if (get.attitude(player, event.player) > 0) return false;
					if (
						event.player.hasSkillTag("filterDamage", null, {
							player: event.source,
							card: event.card,
						})
					)
						return false;
					if (event.player.isUnseen()) return true;
					if (event.player.hp > event.num && event.player.hp <= event.num * 2) return player.hp > 1 || event.player.isUnseen(2);
					return false;
				},
				logTarget: "player",
				preHidden: true,
				content() {
					trigger.num *= 2;
					if (!trigger.player.isUnseen(2)) {
						player.loseHp();
						player.removeSkill("gzanyong");
					} else if (!trigger.player.isUnseen()) {
						player.chooseToDiscard("h", 2, true);
					}
				},
			},
			//周夷
			gzzhukou: {
				audio: "zhukou",
				trigger: { source: "damageSource" },
				preHidden: true,
				filter(event, player) {
					if (!player.getHistory("useCard").length) return false;
					var evt = event.getParent("phaseUse");
					if (!evt || !evt.player) return false;
					return (
						player
							.getHistory("sourceDamage", function (evtx) {
								return evtx.getParent("phaseUse") == evt;
							})
							.indexOf(event) == 0
					);
				},
				frequent: true,
				content() {
					player.draw(Math.min(player.getHistory("useCard").length, 5));
				},
			},
			gzduannian: {
				audio: 2,
				trigger: { player: "phaseUseEnd" },
				preHidden: true,
				filter(event, player) {
					return (
						player.countCards("h") > 0 &&
						!player.hasCard(function (card) {
							return !lib.filter.cardDiscardable(card, player, "gzduannian");
						}, "h")
					);
				},
				check(event, player) {
					return (
						player.countCards("h", function (card) {
							return get.value(card) >= 6;
						}) <= Math.max(1, player.countCards("h") / 2)
					);
				},
				content() {
					"step 0";
					var cards = player.getCards("h", function (card) {
						return lib.filter.cardDiscardable(card, player, "gzduannian");
					});
					if (cards.length) {
						player.discard(cards);
					} else event.finish();
					"step 1";
					player.drawTo(Math.min(5, player.maxHp));
				},
			},
			gzlianyou: {
				trigger: { player: "die" },
				direct: true,
				forceDie: true,
				skillAnimation: true,
				animationColor: "fire",
				content() {
					"step 0";
					player
						.chooseTarget(lib.filter.notMe, get.prompt("gzlianyou"), "令一名其他角色获得〖兴火〗")
						.set("forceDie", true)
						.set("ai", function (target) {
							return 10 + get.attitude(_status.event.player, target) * (target.hasSkillTag("fireAttack", null, null, true) ? 2 : 1);
						});
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill("gzlianyou", target);
						target.addSkills("gzxinghuo");
						game.delayx();
					}
				},
				derivation: "gzxinghuo",
			},
			gzxinghuo: {
				trigger: { source: "damageBegin1" },
				forced: true,
				filter(event) {
					return event.hasNature("fire");
				},
				content() {
					trigger.num++;
				},
			},
			//南华老仙
			gzgongxiu: {
				audio: "gongxiu",
				trigger: { player: "phaseDrawBegin2" },
				preHidden: true,
				filter(event, player) {
					return !event.numFixed && event.num > 0 && player.maxHp > 0;
				},
				content() {
					trigger.num--;
					player.addTempSkill("gzgongxiu2", "phaseDrawAfter");
				},
			},
			gzgongxiu2: {
				trigger: { player: "phaseDrawEnd" },
				forced: true,
				charlotte: true,
				popup: false,
				content() {
					"step 0";
					var str = "令至多" + get.cnNumber(player.maxHp) + "名角色";
					if (typeof player.storage.gzgongxiu != "number") {
						player.chooseControl().set("choiceList", [str + "各摸一张牌", str + "各弃置一张牌"]);
					} else event._result = { index: 1 - player.storage.gzgongxiu };
					"step 1";
					var num = result.index;
					event.index = num;
					player.storage.gzgongxiu = num;
					player
						.chooseTarget(true, [1, player.maxHp], "选择至多" + get.cnNumber(player.maxHp) + "名角色各" + (num ? "弃置" : "摸") + "一张牌")
						.set("goon", event.index ? -1 : 1)
						.set("ai", function (target) {
							var evt = _status.event;
							return evt.goon * get.attitude(evt.player, target);
						});
					"step 2";
					if (result.bool) {
						var targets = result.targets.sortBySeat();
						player.line(targets, "green");
						if (event.index == 0) game.asyncDraw(targets);
						else {
							for (var i of targets) i.chooseToDiscard("he", true);
							event.finish();
						}
					}
					"step 3";
					game.delayx();
				},
			},
			gzjinghe: {
				audio: "jinghe",
				enable: "phaseUse",
				filter(event, player) {
					return player.maxHp > 0 && player.countCards("h") > 0 && !player.hasSkill("gzjinghe_clear");
				},
				selectCard() {
					var max = _status.event.player.maxHp;
					if (ui.selected.targets.length) return [ui.selected.targets.length, max];
					return [1, max];
				},
				selectTarget() {
					return ui.selected.cards.length;
				},
				filterTarget(card, player, target) {
					return !target.isUnseen();
				},
				filterCard(card) {
					if (ui.selected.cards.length) {
						var name = get.name(card);
						for (var i of ui.selected.cards) {
							if (get.name(i) == name) return false;
						}
					}
					return true;
				},
				position: "h",
				check(card) {
					var player = _status.event.player;
					if (
						game.countPlayer(function (current) {
							return get.attitude(player, current) > 0 && !current.isUnseen();
						}) > ui.selected.cards.length
					)
						return get.position(card) == "e" ? 2 : 1;
					return 0;
				},
				complexCard: true,
				discard: false,
				lose: false,
				delay: false,
				multitarget: true,
				multiline: true,
				content() {
					"step 0";
					player.showCards(cards, get.translation(player) + "发动了【经合】");
					event.skills = lib.skill.gzjinghe.derivation.randomGets(targets.length);
					player.addTempSkill("gzjinghe_clear", { player: "phaseBegin" });
					event.targets.sortBySeat();
					event.num = 0;
					"step 1";
					event.target = targets[num];
					event.num++;
					event.target
						.chooseControl(event.skills, "cancel2")
						.set(
							"choiceList",
							event.skills.map(function (i) {
								return '<div class="skill">【' + get.translation(lib.translate[i + "_ab"] || get.translation(i).slice(0, 2)) + "】</div><div>" + get.skillInfoTranslation(i, player) + "</div>";
							})
						)
						.set("displayIndex", false)
						.set("prompt", "选择获得一个技能");
					"step 2";
					var skill = result.control;
					if (skill != "cancel2") {
						event.skills.remove(skill);
						target.addAdditionalSkills("gzjinghe_" + player.playerid, skill);
						target.popup(skill);
					}
					if (event.num < event.targets.length) event.goto(1);
					if (target != game.me && !target.isOnline2()) game.delayx();
				},
				ai: {
					threaten: 3,
					order: 10,
					result: {
						target: 1,
					},
				},
				derivation: ["leiji", "nhyinbing", "nhhuoqi", "nhguizhu", "nhxianshou", "nhlundao", "nhguanyue", "nhyanzheng"],
				subSkill: {
					clear: {
						onremove(player) {
							game.countPlayer(function (current) {
								current.removeAdditionalSkills("gzjinghe_" + player.playerid);
							});
						},
					},
				},
			},
			//孙綝
			gzshilu: {
				audio: "zyshilu",
				preHidden: true,
				trigger: { global: "dieAfter" },
				prompt2(event, player) {
					return "将其的所有武将牌" + (player == event.source ? "及武将牌库里的两张随机武将牌" : "") + "置于武将牌上作为“戮”";
				},
				logTarget: "player",
				content() {
					var list = [],
						target = trigger.player;
					if (target.name1 && target.name1.indexOf("gz_shibing") != 0 && _status.characterlist.includes(target.name1)) list.push(target.name1);
					if (target.name2 && target.name2.indexOf("gz_shibing") != 0 && _status.characterlist.includes(target.name1)) list.push(target.name2);
					_status.characterlist.removeArray(list);
					if (player == trigger.source) list.addArray(_status.characterlist.randomRemove(2));
					if (list.length) {
						player.markAuto("gzshilu", list);
						game.log(player, "将", "#g" + get.translation(list), "置于武将牌上作为", "#y“戮”");
						game.broadcastAll(
							function (player, list) {
								var cards = [];
								for (var i = 0; i < list.length; i++) {
									var cardname = "huashen_card_" + list[i];
									lib.card[cardname] = {
										fullimage: true,
										image: "character:" + list[i],
									};
									lib.translate[cardname] = get.rawName2(list[i]);
									cards.push(game.createCard(cardname, "", ""));
								}
								player.$draw(cards, "nobroadcast");
							},
							player,
							list
						);
					}
				},
				marktext: "戮",
				intro: {
					content: "character",
					onunmark(storage, player) {
						if (storage && storage.length) {
							_status.characterlist.addArray(storage);
							storage.length = 0;
						}
					},
					mark(dialog, storage, player) {
						if (storage && storage.length) {
							dialog.addSmall([storage, "character"]);
						} else {
							return "没有“戮”";
						}
					},
					// content:function(storage,player){
					// 	return '共有'+get.cnNumber(storage.length)+'张“戮”';
					// },
				},
				group: "gzshilu_zhiheng",
				subSkill: {
					zhiheng: {
						audio: "gzshilu",
						trigger: { player: "phaseZhunbeiBegin" },
						filter(event, player) {
							return player.getStorage("gzshilu").length > 0 && player.countCards("he") > 0;
						},
						direct: true,
						content() {
							"step 0";
							var num = Math.min(player.getStorage("gzshilu").length, player.countCards("he"));
							player.chooseToDiscard("he", get.prompt("gzshilu"), "弃置至多" + get.cnNumber(num) + "张牌并摸等量的牌", [1, num]).logSkill = "gzshilu";
							"step 1";
							if (result.bool && result.cards && result.cards.length) player.draw(result.cards.length);
						},
					},
				},
			},
			gzxiongnve: {
				audio: "zyxiongnve",
				trigger: { player: "phaseUseBegin" },
				direct: true,
				filter(event, player) {
					return player.getStorage("gzshilu").length > 0;
				},
				content() {
					"step 0";
					player
						.chooseButton([get.prompt("gzxiongnve"), [player.storage.gzshilu, "character"]])
						.set("ai", function (button) {
							if (!_status.event.goon) return 0;
							var name = button.link,
								group = get.is.double(name, true);
							if (!group) group = [lib.character[name][1]];
							for (var i of group) {
								if (
									game.hasPlayer(function (current) {
										return player.inRange(current) && current.identity == i;
									})
								)
									return 1 + Math.random();
							}
							return 0;
						})
						.set(
							"goon",
							player.countCards("hs", function (card) {
								return get.tag(card, "damage") && player.hasValueTarget(card);
							}) > 1
						);
					"step 1";
					if (result.bool) {
						player.logSkill("gzxiongnve");
						lib.skill.gzxiongnve.throwCharacter(player, result.links);
						game.delayx();
						var group = get.is.double(result.links[0], true);
						if (!group) group = [lib.character[result.links[0]][1]];
						event.group = group;
						var str = get.translation(group);
						player
							.chooseControl()
							.set("prompt", "选择获得一项效果")
							.set("choiceList", ["本回合对" + str + "势力的角色造成的伤害+1", "本回合对" + str + "势力的角色造成伤害后，获得对方的一张牌", "本回合对" + str + "势力的角色使用牌没有次数限制"])
							.set("ai", function () {
								var player = _status.event.player;
								if (
									player.countCards("hs", function (card) {
										return get.name(card) == "sha" && player.hasValueTarget(card);
									}) > player.getCardUsable("sha")
								)
									return 0;
								return get.rand(1, 2);
							});
					} else event.finish();
					"step 2";
					var skill = "gzxiongnve_effect" + result.index;
					player.markAuto(skill, event.group);
					player.addTempSkill(skill);
					game.log(player, "本回合对" + get.translation(event.group) + "势力的角色", "#g" + lib.skill[skill].promptx);
				},
				group: "gzxiongnve_end",
				throwCharacter(player, list) {
					player.unmarkAuto("gzshilu", list);
					_status.characterlist.addArray(list);
					game.log(player, "从", "#y“戮”", "中移去了", "#g" + get.translation(list));
					game.broadcastAll(
						function (player, list) {
							var cards = [];
							for (var i = 0; i < list.length; i++) {
								var cardname = "huashen_card_" + list[i];
								lib.card[cardname] = {
									fullimage: true,
									image: "character:" + list[i],
								};
								lib.translate[cardname] = get.rawName2(list[i]);
								cards.push(game.createCard(cardname, "", ""));
							}
							player.$throw(cards, 1000, "nobroadcast");
						},
						player,
						list
					);
				},
				subSkill: {
					effect0: {
						promptx: "造成的伤害+1",
						charlotte: true,
						onremove: true,
						audio: "zyxiongnve",
						intro: {
							content: "对$势力的角色造成的伤害+1",
						},
						trigger: { source: "damageBegin1" },
						forced: true,
						filter(event, player) {
							return player.getStorage("gzxiongnve_effect0").includes(event.player.identity);
						},
						logTarget: "player",
						content() {
							trigger.num++;
						},
					},
					effect1: {
						promptx: "造成伤害后，获得对方的一张牌",
						charlotte: true,
						onremove: true,
						audio: "zyxiongnve",
						intro: {
							content: "对$势力的角色造成伤害后，获得对方的一张牌",
						},
						trigger: { source: "damageEnd" },
						forced: true,
						filter(event, player) {
							return player.getStorage("gzxiongnve_effect1").includes(event.player.identity) && event.player.countGainableCards(player, "he") > 0;
						},
						logTarget: "player",
						content() {
							player.gainPlayerCard(trigger.player, true, "he");
						},
					},
					effect2: {
						promptx: "使用牌没有次数限制",
						charlotte: true,
						onremove: true,
						intro: {
							content: "对$势力的角色使用牌没有次数限制",
						},
						mod: {
							cardUsableTarget(card, player, target) {
								if (player.getStorage("gzxiongnve_effect2").includes(target.identity)) return true;
							},
						},
					},
					effect3: {
						charlotte: true,
						audio: "zyxiongnve",
						mark: true,
						intro: {
							content: "其他角色对你造成伤害时，此伤害-1",
						},
						trigger: { player: "damageBegin3" },
						filter(event, player) {
							return event.source && event.source != player;
						},
						forced: true,
						logTarget: "source",
						content() {
							trigger.num--;
						},
						ai: {
							effect: {
								target(card, player, target) {
									if (target == player) return;
									if (player.hasSkillTag("jueqing", false, target)) return;
									var num = get.tag(card, "damage");
									if (num) {
										if (num > 1) return 0.5;
										return 0;
									}
								},
							},
						},
					},
					end: {
						trigger: { player: "phaseUseEnd" },
						direct: true,
						filter(event, player) {
							return player.getStorage("gzshilu").length > 1;
						},
						content() {
							"step 0";
							player.chooseButton(["是否移去两张“戮”获得减伤？", [player.storage.gzshilu, "character"]], 2).set("ai", function (button) {
								var name = button.link,
									group = get.is.double(name, true);
								if (!group) group = [lib.character[name][1]];
								for (var i of group) {
									if (
										game.hasPlayer(function (current) {
											return current.identity == i;
										})
									)
										return 0;
								}
								return 1;
							});
							"step 1";
							if (result.bool) {
								player.logSkill("gzxiongnve");
								lib.skill.gzxiongnve.throwCharacter(player, result.links);
								player.addTempSkill("gzxiongnve_effect3", { player: "phaseBegin" });
								game.delayx();
							}
						},
					},
				},
			},
			//邓芝
			gzjianliang: {
				audio: 2,
				trigger: { player: "phaseDrawBegin2" },
				frequent: true,
				preHidden: true,
				filter(event, player) {
					return player.isMinHandcard();
				},
				logTarget(event, player) {
					var isFriend;
					if (player.identity == "unknown") {
						var group = "shu";
						if (!player.wontYe("shu")) group = null;
						isFriend = function (current) {
							return current == player || current.identity == group;
						};
					} else
						isFriend = function (target) {
							return target.isFriendOf(player);
						};
					return game.filterPlayer(isFriend);
				},
				content() {
					"step 0";
					var list = game.filterPlayer(function (current) {
						return current.isFriendOf(player);
					});
					if (list.length == 1) {
						list[0].draw();
						event.finish();
					} else game.asyncDraw(list);
					"step 1";
					game.delayx();
				},
			},
			gzweimeng: {
				audio: 2,
				enable: "phaseUse",
				usable: 1,
				filterTarget(card, player, target) {
					return target != player && target.countGainableCards(player, "h") > 0;
				},
				content() {
					"step 0";
					player.gainPlayerCard(target, "h", true, event.name == "gzweimeng" ? [1, player.hp] : 1);
					"step 1";
					if (result.bool && target.isIn()) {
						var num = result.cards.length,
							hs = player.getCards("he");
						if (!hs.length) event.goto(3);
						else if (hs.length <= num) event._result = { bool: true, cards: hs };
						else player.chooseCard("he", true, "选择交给" + get.translation(target) + get.cnNumber(num) + "张牌", num);
					} else event.goto(3);
					"step 2";
					player.give(result.cards, target);
					"step 3";
					if (target.isIn() && event.name == "gzweimeng")
						player.chooseBool("纵横：是否令" + get.translation(target) + "获得【危盟】？").set("ai", function () {
							var evt = _status.event.getParent();
							return get.attitude(evt.player, evt.target) > 0;
						});
					else event.finish();
					"step 4";
					if (result.bool) {
						target.addTempSkill("gzweimeng_zongheng", { player: "phaseEnd" });
						game.log(player, "发起了", "#y纵横", "，令", target, "获得了技能", "#g【危盟】");
					}
				},
				derivation: "gzweimeng_zongheng",
				subSkill: {
					zongheng: {
						inherit: "gzweimeng",
						ai: {
							order: 6,
							tag: {
								lose: 1,
								loseCard: 1,
								gain: 1,
							},
							result: {
								target: -1,
							},
						},
					},
				},
				ai: {
					order: 6,
					tag: {
						lose: 1,
						loseCard: 1,
						gain: 1,
					},
					result: {
						target(player, target) {
							return -Math.pow(Math.min(player.hp, target.countCards("h")), 2) / 4;
						},
					},
				},
			},
			//邹氏
			huoshui: {
				audio: 2,
				forced: true,
				global: "huoshui_mingzhi",
				trigger: { player: "useCardToTargeted" },
				preHidden: true,
				filter(event, player) {
					return (event.card.name == "sha" || event.card.name == "wanjian") && event.target.isUnseen(2) && event.target.isEnemyOf(player);
				},
				logTarget: "target",
				content() {
					var target = trigger.target;
					target.addTempSkill("huoshui_norespond");
					target.markAuto("huoshui_norespond", [trigger.card]);
				},
			},
			huoshui_norespond: {
				charlotte: true,
				trigger: { global: "useCardEnd" },
				onremove: true,
				forced: true,
				popup: false,
				silent: true,
				firstDo: true,
				filter(event, player) {
					return player.getStorage("huoshui_norespond").includes(event.card);
				},
				content() {
					player.unmarkAuto("huoshui_norespond", [trigger.card]);
					if (!player.storage.huoshui_norespond.length) player.removeSkill("huoshui_norespond");
				},
				mod: {
					cardEnabled(card) {
						if (card.name == "shan") return false;
					},
					cardRespondable(card) {
						if (card.name == "shan") return false;
					},
				},
			},
			huoshui_mingzhi: {
				ai: {
					nomingzhi: true,
					skillTagFilter(player) {
						if (_status.currentPhase && _status.currentPhase != player && _status.currentPhase.hasSkill("huoshui")) {
							return true;
						}
						return false;
					},
				},
			},
			qingcheng: {
				audio: 2,
			},
			qingcheng_ai: {
				ai: {
					effect: {
						target(card) {
							if (get.tag(card, "damage")) return 2;
						},
					},
				},
			},
			//朱灵
			gzjuejue: {
				audio: 2,
				trigger: { player: "phaseDiscardBegin" },
				check(event, player) {
					return (
						player.hp > 2 &&
						player.needsToDiscard() > 0 &&
						game.countPlayer(function (current) {
							return get.attitude(current, player) <= 0;
						}) >
							game.countPlayer() / 2
					);
				},
				preHidden: true,
				content() {
					player.addTempSkill("gzjuejue_effect");
					player.loseHp();
				},
				subSkill: {
					effect: {
						trigger: { player: "phaseDiscardAfter" },
						forced: true,
						charlotte: true,
						popup: false,
						filter(event, player) {
							return (
								player.getHistory("lose", function (evt) {
									return evt.type == "discard" && evt.cards2 && evt.cards2.length > 0 && evt.getParent("phaseDiscard") == event;
								}).length > 0
							);
						},
						content() {
							"step 0";
							var num = 0;
							player.getHistory("lose", function (evt) {
								if (evt.type == "discard" && evt.getParent("phaseDiscard") == trigger) num += evt.cards2.length;
							});
							event.num = num;
							event.targets = game
								.filterPlayer(function (current) {
									return current != player;
								})
								.sortBySeat();
							player.line(event.targets, "green");
							"step 1";
							var target = targets.shift();
							event.target = target;
							if (target.isIn()) {
								target.addTempClass("target");
								target.chooseCard("h", num, "将" + get.cnNumber(num) + "张牌置入弃牌堆，或受到1点伤害").set("ai", function (card) {
									var evt = _status.event.getParent();
									if (get.damageEffect(evt.target, evt.player, evt.target) >= 0) return 0;
									return 8 / Math.sqrt(evt.num) + evt.target.getDamagedHp() - get.value(card);
								});
							} else if (targets.length) event.redo();
							else event.finish();
							"step 2";
							if (result.bool) {
								target.lose(result.cards, ui.discardPile, "visible");
								target.$throw(result.cards, 1000);
								game.log(target, "将", result.cards, "置入了弃牌堆");
							} else target.damage();
							"step 3";
							game.delayx();
							if (targets.length) event.goto(1);
						},
					},
				},
				ai: {
					noDieAfter2: true,
					skillTagFilter(player, tag, target) {
						return target.isFriendOf(player);
					},
				},
			},
			gzfangyuan: {
				audio: 2,
				trigger: { player: "phaseJieshuBegin" },
				zhenfa: "siege",
				direct: true,
				locked: false,
				filter(event, player) {
					return (
						game.countPlayer() > 4 &&
						game.hasPlayer(function (current) {
							return player.sieged(current) && player.canUse("sha", current, false);
						})
					);
				},
				preHidden: true,
				content() {
					"step 0";
					var list = game.filterPlayer(function (current) {
						return player.sieged(current) && player.canUse("sha", current, false);
					});
					if (player.hasSkill("gzfangyuan")) {
						if (list.length == 1) event._result = { bool: true, targets: list };
						else
							player
								.chooseTarget(
									"方圆：视为对一名围攻你的角色使用【杀】",
									function (card, player, target) {
										return _status.event.list.includes(target);
									},
									true
								)
								.set("list", list)
								.set("ai", function (target) {
									var player = _status.event.player;
									return get.effect(target, { name: "sha", isCard: true }, player, player);
								})
								.setHiddenSkill("gzfangyuan");
					} else {
						player
							.chooseTarget(get.prompt("gzfangyuan"), "视为对一名围攻你的角色使用【杀】", function (card, player, target) {
								return _status.event.list.includes(target);
							})
							.set("list", list)
							.set("ai", function (target) {
								var player = _status.event.player;
								return get.effect(target, { name: "sha", isCard: true }, player, player);
							});
					}
					"step 1";
					if (result.bool) {
						player.useCard({ name: "sha", isCard: true }, result.targets[0], "gzfangyuan", false);
					}
				},
				global: "gzfangyuan_siege",
				subSkill: {
					siege: {
						mod: {
							maxHandcard(player, num) {
								if (game.countPlayer() < 4) return;
								var next = player.getNext(),
									prev = player.getPrevious(),
									siege = [];
								if (player.siege(next)) siege.push(next.getNext());
								if (player.siege(prev)) siege.push(prev.getPrevious());
								if (siege.length) {
									siege.push(player);
									num += siege.filter(function (source) {
										return source.hasSkill("gzfangyuan");
									}).length;
								}
								if (player.sieged()) {
									if (next.hasSkill("gzfangyuan")) num--;
									if (prev.hasSkill("gzfangyuan")) num--;
								}
								return num;
							},
						},
					},
				},
			},
			//彭羕
			daming: {
				audio: 2,
				trigger: { global: "phaseUseBegin" },
				direct: true,
				preHidden: true,
				filter(event, player) {
					if (
						!player.isFriendOf(event.player) ||
						!game.hasPlayer(function (current) {
							return !current.isLinked();
						})
					)
						return false;
					if (_status.connectMode && player.hasSkill("daming")) return player.countCards("h") > 0;
					return player.countCards("h", function (card) {
						return get.type2(card, player) == "trick";
					});
				},
				content() {
					"step 0";
					player
						.chooseCardTarget({
							prompt: get.prompt("daming"),
							prompt2: "弃置一张锦囊牌并选择要横置的角色",
							filterCard(card, player) {
								return get.type2(card, player) == "trick" && lib.filter.cardDiscardable(card, player, "daming");
							},
							filterTarget(card, player, target) {
								return !target.isLinked();
							},
							goon: (function () {
								var target = trigger.player;
								if (get.recoverEffect(target, player, player) > 0) return true;
								var card = { name: "sha", nature: "thunder", isCard: true };
								if (
									game.hasPlayer(function (current) {
										return current != player && current != target && target.canUse(card, current, false) && get.effect(current, card, target, player) > 0;
									})
								)
									return true;
								return false;
							})(),
							ai1(card) {
								if (_status.event.goon) return 7 - get.value(card);
								return 0;
							},
							ai2(target) {
								var player = _status.event.player;
								return (
									(target.identity != "unknown" &&
									!game.hasPlayer(function (current) {
										return current != target && current.isFriendOf(target) && current.isLinked();
									})
										? 3
										: 1) *
									(-get.attitude(target, player, player) + 1)
								);
							},
						})
						.setHiddenSkill("daming");
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						event.target = target;
						player.logSkill("daming", target);
						player.discard(result.cards);
					} else event.finish();
					"step 2";
					if (!target.isLinked()) target.link();
					"step 3";
					var map = {},
						sides = [],
						pmap = _status.connectMode ? lib.playerOL : game.playerMap,
						player;
					for (var i of game.players) {
						if (i.identity == "unknown") continue;
						var added = false;
						for (var j of sides) {
							if (i.isFriendOf(pmap[j])) {
								added = true;
								map[j].push(i);
								if (i == this) player = j;
								break;
							}
						}
						if (!added) {
							map[i.playerid] = [i];
							sides.push(i.playerid);
							if (i == this) player = i.playerid;
						}
					}
					var num = 0;
					for (var i in map) {
						if (
							map[i].filter(function (i) {
								return i.isLinked();
							}).length
						)
							num++;
					}
					if (num > 0) player.draw(num);
					"step 4";
					if (trigger.player.isIn()) {
						var target = trigger.player,
							sha = game.filterPlayer(function (current) {
								return current != target && current != player && target.canUse({ name: "sha", nature: "thunder", isCard: true }, current, false);
							});
						if (sha.length) {
							var next = player.chooseTarget("请选择" + get.translation(target) + "使用雷【杀】的目标", function (card, player, target) {
								return _status.event.list.includes(target);
							});
							next.set("prompt2", "或点「取消」令其回复1点体力");
							next.set("goon", get.recoverEffect(target, player, player));
							next.set("list", sha);
							next.set("ai", function (target) {
								var player = _status.event.player;
								return get.effect(target, { name: "sha", nature: "thunder", isCard: true }, _status.event.getTrigger().player, player) - _status.event.goon;
							});
						} else if (target.isDamaged()) event._result = { bool: false };
						else event.finish();
					} else event.finish();
					"step 5";
					if (result.bool) {
						var target = result.targets[0];
						if (player == trigger.player) player.line(target);
						else {
							player.line2([trigger.player, target]);
							game.delay(0.5);
						}
						trigger.player.useCard({ name: "sha", nature: "thunder", isCard: true }, target, false).animate = false;
					} else {
						player.line(trigger.player);
						trigger.player.recover();
					}
				},
			},
			xiaoni: {
				audio: 2,
				trigger: {
					player: "useCard",
					target: "useCardToTargeted",
				},
				forced: true,
				filter(event, player) {
					var type = get.type2(event.card);
					if (type != "basic" && type != "trick") return false;
					var list = game.filterPlayer(function (current) {
						return current != player && current.isFriendOf(player);
					});
					if (!list.length) return false;
					var hs = player.countCards("h");
					for (var i of list) {
						if (i.countCards("h") > hs) return false;
					}
					return true;
				},
				check: () => false,
				preHidden: true,
				content() {
					if (trigger.name == "useCard") trigger.directHit.addArray(game.players);
					else trigger.directHit.add(player);
				},
				global: "xiaoni_ai",
				ai: {
					halfneg: true,
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						if (!arg.card) return false;
						var type = get.type2(arg.card);
						if (type != "basic" && type != "trick") return false;
						var list = game.filterPlayer(function (current) {
							return current != player && current.isFriendOf(player);
						});
						if (!list.length) return false;
						var cards = [arg.card];
						if (arg.card.cards) cards.addArray(arg.card.cards);
						cards.addArray(ui.selected.cards);
						var hhs = function (card) {
							return !cards.includes(card);
						};
						var hs = player.countCards("h", hhs);
						for (var i of list) {
							if (i.countCards("h", hhs) > hs) return false;
						}
						return true;
					},
				},
				subSkill: {
					ai: {
						ai: {
							directHit_ai: true,
							skillTagFilter(playerx, tag, arg) {
								if (!arg.card) return false;
								var type = get.type2(arg.card);
								if (type != "basic" && type != "trick") return false;
								var player;
								if (arg.target && arg.target.hasSkill("xiaoni")) player = arg.target;
								else return false;
								var list = game.filterPlayer(function (current) {
									return current != player && current.isFriendOf(player);
								});
								if (!list.length) return false;
								var cards = [arg.card];
								if (arg.card.cards) cards.addArray(arg.card.cards);
								cards.addArray(ui.selected.cards);
								var hhs = function (card) {
									return !cards.includes(card);
								};
								var hs = player.countCards("h", hhs);
								for (var i of list) {
									if (i.countCards("h", hhs) > hs) return false;
								}
								return true;
							},
						},
					},
				},
			},
			//刘巴
			gztongduo: {
				audio: 2,
				trigger: { global: "phaseJieshuBegin" },
				direct: true,
				preHidden: true,
				filter(event, player) {
					if ((player != event.player && !player.hasSkill("gztongduo")) || !event.player.isFriendOf(player)) return false;
					return (
						event.player.getHistory("lose", function (evt) {
							return evt.type == "discard" && evt.cards2.length > 0 && evt.getParent("phaseDiscard").player == event.player;
						}).length > 0
					);
				},
				content() {
					"step 0";
					var num = 0;
					trigger.player.getHistory("lose", function (evt) {
						if (evt.type == "discard" && evt.getParent("phaseDiscard").player == trigger.player) num += evt.cards2.length;
					});
					num = Math.min(3, num);
					event.num = num;
					var next = trigger.player.chooseBool("是否发动【统度】摸" + get.cnNumber(num) + "张牌？");
					if (player == trigger.player) next.setHiddenSkill("gztongduo");
					"step 1";
					if (result.bool) {
						player.logSkill("gztongduo", trigger.player);
						trigger.player.draw(num);
					}
				},
			},
			qingyin: {
				audio: 2,
				enable: "phaseUse",
				limited: true,
				delay: false,
				filter(event, player) {
					var isFriend;
					if (player.identity == "unknown") {
						var group = "shu";
						if (!player.wontYe("shu")) group = null;
						isFriend = function (current) {
							return current == player || current.identity == group;
						};
					} else
						isFriend = function (target) {
							return target.isFriendOf(player);
						};
					return game.hasPlayer(function (current) {
						return isFriend(current) && current.isDamaged();
					});
				},
				selectTarget: -1,
				filterTarget(card, player, target) {
					if (player == target) return true;
					if (player.identity == "unknown") {
						var group = "shu";
						if (!player.wontYe("shu")) return false;
						return target.identity == group;
					}
					return target.isFriendOf(player);
				},
				selectCard: [0, 1],
				filterCard: () => false,
				multitarget: true,
				multiline: true,
				skillAnimation: true,
				animationColor: "orange",
				content() {
					"step 0";
					player.awakenSkill("qingyin");
					event.num = 0;
					"step 1";
					if (targets[num].isDamaged()) {
						targets[num].recover(targets[num].maxHp - targets[num].hp);
					}
					event.num++;
					if (event.num < targets.length) event.redo();
					"step 2";
					if (lib.character[player.name1][3].includes("qingyin")) player.removeCharacter(0);
					if (lib.character[player.name2][3].includes("qingyin")) player.removeCharacter(1);
				},
				ai: {
					order(item, player) {
						var isFriend;
						if (player.identity == "unknown") {
							var group = "shu";
							if (!player.wontYe("shu")) group = null;
							isFriend = function (current) {
								return current == player || current.identity == group;
							};
						} else
							isFriend = function (target) {
								return target.isFriendOf(player);
							};
						var targets = game.filterPlayer(function (current) {
							return isFriend(current);
						});
						var num = 0,
							max = 0;
						for (var i of targets) {
							var dam = i.maxHp - i.hp;
							num += dam;
							max += i.maxHp;
						}
						return num / max >= 1 / Math.max(1.6, game.roundNumber) ? 1 : -1;
					},
					result: {
						player: 1,
					},
				},
			},
			//苏飞
			gzlianpian: {
				audio: 2,
				trigger: { global: "phaseJieshuBegin" },
				direct: true,
				preHidden: true,
				filter(event, player) {
					if (player != event.player && !player.hasSkill("gzlianpian")) return false;
					var num = 0;
					game.getGlobalHistory("cardMove", function (evt) {
						if (evt.name == "lose" && evt.type == "discard" && evt.getParent(2).player == event.player) num += evt.cards2.length;
					});
					if (num <= player.hp) return false;
					if (player == event.player)
						return game.hasPlayer(function (current) {
							return current.isFriendOf(player) && current.countCards("h") < current.maxHp;
						});
					return player.countDiscardableCards(event.player, "he") > 0 || player.isDamaged();
				},
				content() {
					"step 0";
					if (player == trigger.player) {
						player
							.chooseTarget(get.prompt("gzlianpian"), "令一名己方角色将手牌摸至手牌上限", function (card, player, target) {
								return target.isFriendOf(player) && target.maxHp > target.countCards("h");
							})
							.set("ai", function (target) {
								var att = get.attitude(_status.event.player, target);
								if (target.hasSkillTag("nogain")) att /= 6;
								if (att > 2) {
									return Math.min(5, target.maxHp) - target.countCards("h");
								}
								return att / 3;
							})
							.setHiddenSkill(event.name);
					} else {
						event.goto(2);
						event.addIndex = 0;
						var list = [],
							target = trigger.player,
							str = get.translation(player);
						event.target = target;
						if (player.countDiscardableCards(target, "he") > 0) list.push("弃置" + str + "的一张牌");
						else event.addIndex++;
						if (player.isDamaged()) list.push("令" + str + "回复1点体力");
						target
							.chooseControl("cancel2")
							.set("choiceList", list)
							.set("ai", function () {
								var evt = _status.event.getParent();
								if (get.attitude(evt.target, evt.player) > 0) return 1 - evt.addIndex;
								return evt.addIndex;
							})
							.set("prompt", "是否对" + str + "发动【连翩】？");
					}
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill("gzlianpian", target);
						target.draw(Math.min(5, target.maxHp - target.countCards("h")));
					}
					event.finish();
					"step 2";
					if (result.control == "cancel2") {
						event.finish();
						return;
					}
					player.logSkill("gzlianpian", target, false);
					target.line(player, "green");
					if (result.index + event.addIndex == 0) {
						target.discardPlayerCard("he", player, true);
						event.finish();
					} else player.recover();
					"step 3";
					game.delayx();
				},
			},
			//冯熙
			gzyusui: {
				audio: "yusui",
				trigger: { target: "useCardToTargeted" },
				filter(event, player) {
					return event.player != player && event.player.isIn() && event.player.isEnemyOf(player) && get.color(event.card) == "black";
				},
				logTarget: "player",
				check(event, player) {
					var target = event.player;
					if (player.hp < 3 || get.attitude(player, target) > -3) return false;
					if (player.hp < target.hp) return true;
					if (Math.min(target.maxHp, target.countCards("h")) > 3) return true;
					return false;
				},
				usable: 1,
				preHidden: true,
				content() {
					"step 0";
					player.loseHp();
					event.target = trigger.player;
					"step 1";
					event.addIndex = 0;
					var list = [];
					if (target.maxHp > 0 && target.countCards("h") > 0) list.push("令其弃置" + get.cnNumber(target.maxHp) + "张手牌");
					else event.addIndex++;
					if (target.hp > player.hp) list.push("令其失去" + get.cnNumber(target.hp - player.hp) + "点体力");
					if (!list.length) event.finish();
					else if (list.length == 1) event._result = { index: 0 };
					else
						player
							.chooseControl()
							.set("choiceList", list)
							.set("prompt", "令" + get.translation(target) + "执行一项")
							.set("ai", function () {
								var player = _status.event.player,
									target = _status.event.getParent().target;
								return target.hp - player.hp > Math.min(target.maxHp, target.countCards("h")) / 2 ? 1 : 0;
							});
					"step 2";
					if (result.index + event.addIndex == 0) target.chooseToDiscard(target.maxHp, true, "h");
					else target.loseHp(target.hp - player.hp);
				},
			},
			gzboyan: {
				audio: "boyan",
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					return game.hasPlayer(target => lib.skill.gzboyan.filterTarget(null, player, target));
				},
				filterTarget(card, player, target) {
					return target != player && target.countCards("h") < target.maxHp;
				},
				content() {
					"step 0";
					target.draw(Math.min(5, target.maxHp - target.countCards("h")));
					"step 1";
					target.addTempSkill("gzboyan_block");
					"step 2";
					if (target.isIn())
						player.chooseBool("纵横：是否令" + get.translation(target) + "获得【驳言】？").set("ai", function () {
							var evt = _status.event.getParent();
							return get.attitude(evt.player, evt.target) > 0;
						});
					else event.finish();
					"step 3";
					if (result.bool) {
						target.addTempSkill("gzboyan_zongheng", { player: "phaseEnd" });
						game.log(player, "发起了", "#y纵横", "，令", target, "获得了技能", "#g【驳言】");
					}
				},
				derivation: "gzboyan_zongheng",
				subSkill: {
					zongheng: {
						enable: "phaseUse",
						usable: 1,
						filterTarget: lib.filter.notMe,
						content() {
							target.addTempSkill("gzboyan_block");
						},
						ai: {
							order: 4,
							result: {
								target(player, target) {
									if (
										target.countCards("h", "shan") &&
										!target.hasSkillTag("respondShan", true, null, true) &&
										player.countCards("h", function (card) {
											return get.tag(card, "respondShan") && get.effect(target, card, player, player) > 0 && player.getUseValue(card) > 0;
										})
									)
										return -target.countCards("h");
									return -0.5;
								},
							},
						},
					},
					block: {
						mark: true,
						intro: { content: "不能使用或打出手牌" },
						charlotte: true,
						mod: {
							cardEnabled2(card) {
								if (get.position(card) == "h") return false;
							},
						},
					},
				},
				ai: {
					order: (item, player) => {
						if (
							game.hasPlayer(cur => {
								if (player === cur || get.attitude(player, cur) <= 0) return false;
								return Math.min(5, cur.maxHp) - cur.countCards("h") > 2;
							})
						)
							return get.order({ name: "nanman" }, player) - 0.1;
						return 10;
					},
					result: {
						target(player, target) {
							if (get.attitude(player, target) > 0) return Math.min(5, target.maxHp - target.countCards("h"));
							if (
								target.maxHp - target.countCards("h") == 1 &&
								target.countCards("h", "shan") &&
								!target.hasSkillTag("respondShan", true, null, true) &&
								player.countCards("h", function (card) {
									return get.tag(card, "respondShan") && get.effect(target, card, player, player) > 0 && player.getUseValue(card, null, true) > 0;
								})
							)
								return -2;
						},
					},
				},
			},
			//文钦
			gzjinfa: {
				audio: 2,
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					return (
						player.countCards("he") > 0 &&
						game.hasPlayer(function (current) {
							return current != player && current.countCards("he") > 0;
						})
					);
				},
				filterCard: true,
				position: "he",
				filterTarget(card, player, target) {
					return target != player && target.countCards("he") > 0;
				},
				check(card) {
					return 6 - get.value(card);
				},
				content() {
					"step 0";
					target
						.chooseCard("he", "交给" + get.translation(player) + "一张装备牌，或令其获得你的一张牌", { type: "equip" })
						.set("ai", function (card) {
							if (_status.event.goon && get.suit(card) == "spade") return 8 - get.value(card);
							return 5 - get.value(card);
						})
						.set("goon", target.canUse("sha", player, false) && get.effect(player, { name: "sha" }, target, target) > 0);
					"step 1";
					if (!result.bool) {
						player.gainPlayerCard(target, "he", true);
						event.finish();
					} else target.give(result.cards, player);
					"step 2";
					if (result.bool && result.cards && result.cards.length && target.isIn() && player.isIn() && get.suit(result.cards[0], target) == "spade" && target.canUse("sha", player, false)) target.useCard({ name: "sha", isCard: true }, false, player);
				},
				ai: {
					order: 6,
					result: {
						player(player, target) {
							if (
								target.countCards("e", function (card) {
									return get.suit(card) == "spade" && get.value(card) < 8;
								}) &&
								target.canUse("sha", player, false)
							)
								return get.effect(player, { name: "sha" }, target, player);
							return 0;
						},
						target(player, target) {
							var es = target.getCards("e").sort(function (a, b) {
								return get.value(b, target) - get.value(a, target);
							});
							if (es.length) return -Math.min(2, get.value(es[0]));
							return -2;
						},
					},
				},
			},
			//诸葛恪
			gzduwu: {
				limited: true,
				audio: 2,
				enable: "phaseUse",
				delay: false,
				filter(event, player) {
					var isEnemy;
					if (player.identity == "unknown") {
						if (!player.wontYe("wu"))
							isEnemy = function (current) {
								return current != player;
							};
						else
							isEnemy = function (current) {
								return current != player && current.identity != "wu";
							};
					} else
						isEnemy = function (target) {
							return target.isEnemyOf(player);
						};
					return game.hasPlayer(function (current) {
						return isEnemy(current) && player.inRange(current);
					});
				},
				filterTarget(card, player, target) {
					if (player == target || !player.inRange(target)) return false;
					if (player.identity == "unknown") {
						if (!player.wontYe("wu")) return true;
						return target.identity != "wu";
					}
					return target.isEnemyOf(player);
				},
				selectTarget: -1,
				filterCard: () => false,
				selectCard: [0, 1],
				multitarget: true,
				multiline: true,
				content() {
					"step 0";
					player.awakenSkill("gzduwu");
					player.addSkill("gzduwu_count");
					targets.sortBySeat();
					event.players = targets.slice(0);
					game.delayx();
					player.chooseJunlingFor(event.players[0]).set("prompt", "为所有目标角色选择军令牌");
					"step 1";
					event.junling = result.junling;
					event.targets = result.targets;
					event.num = 0;
					"step 2";
					if (num < event.players.length) event.current = event.players[num];
					if (event.current && event.current.isAlive()) {
						event.current
							.chooseJunlingControl(player, event.junling, targets)
							.set("prompt", "黩武")
							.set("choiceList", ["执行该军令", "不执行该军令并受到1点伤害"])
							.set("ai", function () {
								var evt = _status.event.getParent(2);
								return get.junlingEffect(evt.player, evt.junling, evt.current, evt.targets, evt.current) > get.damageEffect(evt.current, evt.player, evt.current) / get.attitude(evt.current, evt.current) ? 0 : 1;
							});
					} else event.goto(4);
					"step 3";
					if (result.index == 0) {
						event.current.carryOutJunling(player, event.junling, targets);
					} else {
						player.draw();
						event.current.damage();
					}
					"step 4";
					game.delayx();
					event.num++;
					if (event.num < event.players.length) event.goto(2);
					"step 5";
					var list = player.getStorage("gzduwu_count").filter(function (target) {
						return target.isAlive();
					});
					if (list.length) player.loseHp();
					player.removeSkill("gzduwu_count");
				},
				animationColor: "wood",
				ai: {
					order: 2,
					result: {
						player(player) {
							if (
								game.countPlayer(function (current) {
									return !current.isFriendOf(player) && !player.inRange(current);
								}) <= Math.min(2, Math.max(0, game.roundNumber - 1))
							)
								return 1;
							if (player.hp == 1) return 1;
							return 0;
						},
					},
				},
				subSkill: {
					count: {
						sub: true,
						trigger: { global: "dyingBegin" },
						silent: true,
						charlotte: true,
						filter(event, player) {
							return event.getParent("gzduwu").player == player;
						},
						content() {
							player.markAuto("gzduwu_count", [trigger.player]);
						},
					},
				},
			},
			//黄祖
			gzxishe: {
				audio: 2,
				trigger: { global: "phaseZhunbeiBegin" },
				direct: true,
				preHidden: true,
				filter(event, player) {
					return event.player != player && event.player.isIn() && player.countCards("e") > 0 && player.canUse("sha", event.player, false);
				},
				content() {
					"step 0";
					player
						.chooseCard("e", get.prompt("gzxishe", trigger.player), "将装备区内的一张牌当做" + (player.hp > trigger.player.hp ? "不可响应的" : "") + "【杀】对其使用", function (card, player) {
							return player.canUse(
								{
									name: "sha",
									cards: [card],
								},
								_status.event.target,
								false
							);
						})
						.set("target", trigger.player)
						.set("ai", function (card) {
							var evt = _status.event,
								eff = get.effect(
									evt.target,
									{
										name: "sha",
										cards: [card],
									},
									evt.player,
									evt.player
								);
							if (eff <= 0) return 0;
							var val = get.value(card);
							if (get.attitude(evt.player, evt.target) < -2 && evt.target.hp <= Math.min(2, evt.player.countCards("e"), evt.player.hp - 1)) return 2 / Math.max(1, val);
							return eff - val;
						})
						.setHiddenSkill(event.name);
					"step 1";
					if (result.bool) {
						var next = player.useCard({ name: "sha" }, result.cards, "gzxishe", trigger.player, false);
						if (player.hp > trigger.player.hp)
							next.oncard = function () {
								_status.event.directHit.add(trigger.player);
							};
					} else event.finish();
					"step 2";
					if (trigger.player.isDead()) {
						player.mayChangeVice(null, "hidden");
					} else if (lib.skill.gzxishe.filter(trigger, player)) event.goto(0);
				},
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						if (_status.event.getParent().name == "gzxishe" && arg.card && arg.card.name == "sha" && arg.target && arg.target == _status.event.target && player.hp > arg.target.hp) return true;
						return false;
					},
				},
			},
			//公孙渊
			gzhuaiyi: {
				audio: 2,
				enable: "phaseUse",
				usable: 1,
				delay: false,
				filter(event, player) {
					return player.countCards("h") > 0;
				},
				content() {
					"step 0";
					player.showHandcards();
					"step 1";
					if (!player.countCards("h", { color: "red" })) event._result = { control: "黑色" };
					else if (!player.countCards("h", { color: "black" })) event._result = { control: "红色" };
					else
						player.chooseControl("红色", "黑色").set("ai", function () {
							var player = _status.event.player,
								num = player.maxHp - player.getExpansions("gzhuaiyi").length;
							if (player.countCards("h", { color: "red" }) <= num && player.countCards("h", { color: "black" }) > num) return "红色";
							return "黑色";
						});
					"step 2";
					event.control = result.control;
					var cards;
					if (event.control == "红色") {
						cards = player.getCards("h", { color: "red" });
					} else {
						cards = player.getCards("h", { color: "black" });
					}
					player.discard(cards);
					event.num = cards.length;
					"step 3";
					player
						.chooseTarget("请选择至多" + get.cnNumber(event.num) + "名有牌的其他角色，获得这些角色的各一张牌。", [1, event.num], function (card, player, target) {
							return target != player && target.countCards("he") > 0;
						})
						.set("ai", function (target) {
							return -get.attitude(_status.event.player, target) + 0.5;
						});
					"step 4";
					if (result.bool && result.targets) {
						player.line(result.targets, "green");
						event.targets = result.targets;
						event.targets.sort(lib.sort.seat);
						event.cards = [];
					} else {
						event.finish();
					}
					"step 5";
					if (player.isAlive() && event.targets.length) {
						player.gainPlayerCard(event.targets.shift(), "he", true);
					} else event.finish();
					"step 6";
					if (result.bool && result.cards && result.cards.length) event.cards.addArray(result.cards);
					if (event.targets.length) event.goto(5);
					"step 7";
					var hs = player.getCards("h");
					cards = cards.filter(function (card) {
						return get.type(card) == "equip" && hs.includes(card);
					});
					if (cards.length) {
						player.addToExpansion(cards, player, "give").gaintag.add("gzhuaiyi");
					}
				},
				ai: {
					order: 10,
					result: {
						player(player, target) {
							var num = player.maxHp - player.getExpansions("gzhuaiyi").length;
							if (player.countCards("h", { color: "red" }) <= num) return 1;
							if (player.countCards("h", { color: "black" }) <= num) return 1;
							return 0;
						},
					},
				},
				marktext: "异",
				intro: { content: "expansion", markcount: "expansion" },
				onremove(player, skill) {
					var cards = player.getExpansions(skill);
					if (cards.length) player.loseToDiscardpile(cards);
				},
			},
			gzzisui: {
				audio: 2,
				trigger: { player: "phaseDrawBegin2" },
				forced: true,
				filter(event, player) {
					return !event.numFixed && player.getExpansions("gzhuaiyi").length > 0;
				},
				content() {
					trigger.num += player.getExpansions("gzhuaiyi").length;
				},
				group: "gzzisui_die",
				subSkill: {
					die: {
						audio: "gzzisui",
						trigger: { player: "phaseJieshuBegin" },
						forced: true,
						filter(event, player) {
							return player.getExpansions("gzhuaiyi").length > player.maxHp;
						},
						content() {
							player.die();
						},
					},
				},
			},
			//潘濬
			gzcongcha: {
				audio: 2,
				trigger: { player: "phaseZhunbeiBegin" },
				direct: true,
				filter(event, player) {
					return game.hasPlayer(function (current) {
						return current != player && current.isUnseen();
					});
				},
				preHidden: "gzcongcha_draw",
				prompt2: "选择一名武将牌均暗置的其他角色",
				content() {
					"step 0";
					player
						.chooseTarget(get.prompt2("gzcongcha"), function (card, player, target) {
							return target != player && target.isUnseen();
						})
						.set("ai", function (target) {
							if (get.attitude(_status.event.player, target) > 0) return Math.random() + Math.sqrt(target.hp);
							return Math.random() + Math.sqrt(Math.max(1, 4 - target.hp));
						});
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill("gzcongcha", target);
						player.storage.gzcongcha2 = target;
						player.addTempSkill("gzcongcha2", { player: "phaseBegin" });
						target.addSkill("gzcongcha_ai");
						game.delayx();
					}
				},
				subfrequent: ["draw"],
				group: "gzcongcha_draw",
				subSkill: {
					draw: {
						audio: "gzcongcha",
						trigger: { player: "phaseDrawBegin2" },
						frequent: true,
						filter(event, player) {
							return (
								!event.numFixed &&
								!game.hasPlayer(function (current) {
									return current.isUnseen();
								})
							);
						},
						prompt: "是否发动【聪察】多摸两张牌？",
						content() {
							trigger.num += 2;
						},
					},
				},
			},
			gzcongcha_ai: {
				charlotte: true,
				ai: {
					mingzhi_yes: true,
					mingzhi_no: true,
					skillTagFilter(player, tag) {
						if (_status.brawl) return false;
						var group = lib.character[player.name1][1];
						if (tag == "mingzhi_yes") {
							if (
								group != "ye" &&
								player.wontYe(group) &&
								game.hasPlayer(function (current) {
									return current.storage.gzcongcha2 == player && current.identity == group;
								})
							)
								return true;
							return false;
						}
						if (group == "ye" && !player.wontYe(group)) return true;
						return game.hasPlayer(function (current) {
							return current.storage.gzcongcha2 == player && current.identity != group;
						});
					},
				},
			},
			gzcongcha2: {
				trigger: { global: "showCharacterAfter" },
				forced: true,
				charlotte: true,
				onremove: true,
				filter(event, player) {
					return event.player == player.storage.gzcongcha2;
				},
				logTarget: "player",
				content() {
					"step 0";
					player.removeSkill("gzcongcha2");
					trigger.player.removeSkill("gzcongcha_ai");
					if (player.isFriendOf(trigger.player)) game.asyncDraw([player, trigger.player].sortBySeat(_status.currentPhase), 2);
					else trigger.player.loseHp();
					"step 1";
					game.delayx();
				},
				mark: "character",
				intro: { content: "已指定$为目标" },
			},
			//司马昭
			gzzhaoxin: {
				audio: 2,
				trigger: { player: "damageEnd" },
				filter(event, player) {
					return player.countCards("h") > 0;
				},
				check: () => false,
				preHidden: true,
				content() {
					"step 0";
					player.showHandcards();
					"step 1";
					var hs = player.countCards("h");
					if (
						game.hasPlayer(function (current) {
							return current != player && current.countCards("h") <= hs;
						})
					) {
						player.chooseTarget(true, "请选择要交换手牌的目标角色", function (card, player, target) {
							return target != player && target.countCards("h") <= player.countCards("h");
						});
					} else event.finish();
					"step 2";
					if (result.bool) {
						var target = result.targets[0];
						player.line(target, "green");
						player.swapHandcards(target);
					}
				},
			},
			gzsuzhi: {
				audio: 2,
				derivation: "gzfankui",
				mod: {
					targetInRange(card, player, target) {
						if (player == _status.currentPhase && player.countMark("gzsuzhi_count") < 3 && get.type2(card) == "trick") return true;
					},
				},
				trigger: { player: "phaseJieshuBegin" },
				forced: true,
				filter(event, player) {
					return player.countMark("gzsuzhi_count") < 3;
				},
				content() {
					player.addTempSkills("gzfankui", { player: "phaseBegin" });
				},
				group: ["gzsuzhi_damage", "gzsuzhi_draw", "gzsuzhi_gain"],
				preHidden: ["gzsuzhi_damage", "gzsuzhi_draw", "gzsuzhi_gain"],
				subSkill: {
					damage: {
						audio: "gzsuzhi",
						trigger: { source: "damageBegin1" },
						forced: true,
						filter(event, player) {
							return player == _status.currentPhase && player.countMark("gzsuzhi_count") < 3 && event.card && (event.card.name == "sha" || event.card.name == "juedou") && event.getParent().type == "card";
						},
						content() {
							trigger.num++;
							player.addTempSkill("gzsuzhi_count");
							player.addMark("gzsuzhi_count", 1, false);
						},
					},
					draw: {
						audio: "gzsuzhi",
						trigger: { player: "useCard" },
						forced: true,
						filter(event, player) {
							return player == _status.currentPhase && player.countMark("gzsuzhi_count") < 3 && event.card.isCard && get.type2(event.card) == "trick";
						},
						content() {
							player.draw();
							player.addTempSkill("gzsuzhi_count");
							player.addMark("gzsuzhi_count", 1, false);
						},
					},
					gain: {
						audio: "gzsuzhi",
						trigger: { global: "loseAfter" },
						forced: true,
						filter(event, player) {
							if (player != _status.currentPhase || event.type != "discard" || player == event.player || player.countMark("gzsuzhi_count") >= 3) return false;
							return event.player.countGainableCards(player, "he") > 0;
						},
						logTarget: "player",
						content() {
							"step 0";
							player.addTempSkill("gzsuzhi_count");
							player.addMark("gzsuzhi_count", 1, false);
							if (trigger.delay == false) game.delay();
							"step 1";
							player.gainPlayerCard(trigger.player, "he", true);
						},
					},
					count: {
						onremove: true,
					},
				},
			},
			gzfankui: {
				audio: 2,
				inherit: "fankui",
			},
			//夏侯霸
			gzbaolie: {
				audio: 2,
				mod: {
					targetInRange(card, player, target) {
						if (card.name == "sha" && target.hp >= player.hp) return true;
					},
					cardUsableTarget(card, player, target) {
						if (card.name == "sha" && target.hp >= player.hp) return true;
					},
				},
				trigger: { player: "phaseUseBegin" },
				forced: true,
				preHidden: true,
				filter(event, player) {
					return game.hasPlayer(function (current) {
						return current.isEnemyOf(player) && player.inRangeOf(current);
					});
				},
				logTarget(event, player) {
					return game.filterPlayer(function (current) {
						return current.isEnemyOf(player) && player.inRangeOf(current);
					});
				},
				check: () => false,
				content() {
					"step 0";
					event.targets = game
						.filterPlayer(function (current) {
							return current.isEnemyOf(player) && player.inRangeOf(current);
						})
						.sortBySeat();
					"step 1";
					var target = event.targets.shift();
					if (target.isIn()) {
						event.target = target;
						target
							.chooseToUse(
								function (card, player, event) {
									if (get.name(card) != "sha") return false;
									return lib.filter.filterCard.apply(this, arguments);
								},
								"豹烈：对" + get.translation(player) + "使用一张杀，或令其弃置你的一张牌"
							)
							.set("targetRequired", true)
							.set("complexSelect", true)
							.set("filterTarget", function (card, player, target) {
								if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
								return lib.filter.filterTarget.apply(this, arguments);
							})
							.set("sourcex", player);
					} else if (targets.length) event.redo();
					else event.finish();
					"step 2";
					if (result.bool == false && target.countCards("he") > 0) {
						player.discardPlayerCard(target, "he", true);
					}
					if (targets.length) event.goto(1);
				},
			},
			//许攸
			gzchenglve: {
				audio: 2,
				trigger: { global: "useCardAfter" },
				filter(event, player) {
					return event.targets.length > 1 && event.player.isIn() && event.player.isFriendOf(player);
				},
				logTarget: "player",
				check(event, player) {
					return get.attitude(player, event.player) > 0;
				},
				preHidden: true,
				content() {
					"step 0";
					trigger.player.draw();
					if (
						player.hasHistory("damage", function (evt) {
							return evt.card == trigger.card;
						}) &&
						game.hasPlayer(function (current) {
							if (current.hasMark("yinyang_mark") || !current.isFriendOf(player)) return false;
							let names = get.nameList(current).filter(i => i.indexOf("gz_shibing") !== 0);
							game.getAllGlobalHistory("everything", evt => {
								if (evt.name !== "showCharacter" || evt.player !== current) return false;
								names.removeArray(evt.toShow);
							});
							return names.length === 0;
						})
					) {
						player
							.chooseTarget("是否令一名武将牌均明置过的己方角色获得“阴阳鱼”标记？", function (card, player, current) {
								if (current.hasMark("yinyang_mark") || !current.isFriendOf(player)) return false;
								let names = get.nameList(current).filter(i => i.indexOf("gz_shibing") !== 0);
								game.getAllGlobalHistory("everything", evt => {
									if (evt.name !== "showCharacter" || evt.player !== current) return false;
									names.removeArray(evt.toShow);
								});
								return names.length === 0;
							})
							.set("ai", function (target) {
								return get.attitude(_status.event.player, target) * Math.sqrt(1 + target.needsToDiscard());
							});
					} else event.finish();
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.line(target, "green");
						target.addMark("yinyang_mark", 1, false);
						game.delayx();
					}
				},
			},
			gzshicai: {
				audio: 2,
				trigger: { player: "damageEnd" },
				forced: true,
				preHidden: true,
				filter(event, player) {
					return event.num == 1 || player.countCards("he") > 0;
				},
				check(event, player) {
					return event.num == 1;
				},
				content() {
					if (trigger.num == 1) player.draw();
					else player.chooseToDiscard(true, "he", 2);
				},
			},
			gzzhuosheng: {
				audio: "zhuosheng",
				trigger: { global: "damageEnd" },
				logTarget: "player",
				filter(event, player) {
					return event.player.isFriendOf(player);
				},
				preHidden: true,
				content() {
					var target = trigger.player;
					target.addTempSkill("gzzhuosheng2", { player: "phaseJieshuBegin" });
					target.draw().gaintag = ["gzzhuosheng2"];
				},
			},
			gzzhuosheng2: {
				onremove(player, skill) {
					player.removeGaintag(skill);
				},
				mod: {
					targetInRange(card, player, target) {
						if (!card.cards || get.type(card) != "basic") return;
						for (var i of card.cards) {
							if (i.hasGaintag("gzzhuosheng2")) return game.online ? player == _status.currentPhase : player.isPhaseUsing();
						}
					},
					cardUsable(card, player, target) {
						if (!card.cards || get.type(card) != "basic" || !(game.online ? player == _status.currentPhase : player.isPhaseUsing())) return;
						for (var i of card.cards) {
							if (i.hasGaintag("gzzhuosheng2")) return Infinity;
						}
					},
					aiOrder(player, card, num) {
						if (get.itemtype(card) == "card" && card.hasGaintag("gzzhuosheng2") && get.type(card) == "basic") return num - 0.1;
					},
				},
				audio: "zhuosheng",
				trigger: { player: "useCard2" },
				direct: true,
				filterx(event, player) {
					if (!player.isPhaseUsing()) return false;
					return (
						player.getHistory("lose", function (evt) {
							if (evt.getParent() != event) return false;
							for (var i in evt.gaintag_map) {
								if (evt.gaintag_map[i].includes("gzzhuosheng2")) return true;
							}
							return false;
						}).length > 0
					);
				},
				filter(event, player) {
					if (!lib.skill.gzzhuosheng2.filterx(event, player)) return false;
					if (get.type(event.card) != "trick") return false;
					if (event.targets && event.targets.length > 0) return true;
					var info = get.info(event.card);
					if (info.allowMultiple == false) return false;
					if (event.targets && !info.multitarget) {
						if (
							game.hasPlayer(function (current) {
								return !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, player, current) && lib.filter.targetInRange(event.card, player, current);
							})
						) {
							return true;
						}
					}
					return false;
				},
				content() {
					"step 0";
					var prompt2 = "为" + get.translation(trigger.card) + "增加或减少一个目标";
					player
						.chooseTarget(get.prompt("gzzhuosheng2"), function (card, player, target) {
							var player = _status.event.player;
							if (_status.event.targets.includes(target)) return true;
							return lib.filter.targetEnabled2(_status.event.card, player, target) && lib.filter.targetInRange(_status.event.card, player, target);
						})
						.set("prompt2", prompt2)
						.set("ai", function (target) {
							var trigger = _status.event.getTrigger();
							var player = _status.event.player;
							return get.effect(target, trigger.card, player, player) * (_status.event.targets.includes(target) ? -1 : 1);
						})
						.set("targets", trigger.targets)
						.set("card", trigger.card);
					"step 1";
					if (result.bool) {
						if (!event.isMine() && !event.isOnline()) game.delayx();
						event.targets = result.targets;
					} else {
						event.finish();
					}
					"step 2";
					if (event.targets) {
						player.logSkill("gzzhuosheng2", event.targets);
						if (trigger.targets.includes(event.targets[0])) trigger.targets.removeArray(event.targets);
						else trigger.targets.addArray(event.targets);
					}
				},
				group: ["gzzhuosheng2_equip", "gzzhuosheng2_silent"],
				subSkill: {
					equip: {
						audio: "zhuosheng",
						trigger: { player: "useCard" },
						filter(event, player) {
							return get.type(event.card) == "equip" && lib.skill.gzzhuosheng2.filterx(event, player);
						},
						prompt: "是否发动【擢升】摸一张牌？",
						content() {
							player.draw();
						},
					},
					silent: {
						trigger: {
							player: "useCard1",
						},
						silent: true,
						firstDo: true,
						filter(event, player) {
							return get.type(event.card) == "basic" && lib.skill.gzzhuosheng2.filterx(event, player) && event.addCount !== false;
						},
						content() {
							trigger.addCount = false;
							var stat = player.getStat();
							if (stat && stat.card && stat.card[trigger.card.name]) stat.card[trigger.card.name]--;
						},
					},
				},
			},
			gzzhuhai: {
				audio: "zhuhai",
				audioname: ["gz_re_xushu"],
				trigger: { global: "phaseJieshuBegin" },
				direct: true,
				preHidden: true,
				filter(event, player) {
					return event.player.isAlive() && event.player.getStat("damage") && lib.filter.targetEnabled({ name: "sha" }, player, event.player) && (player.hasSha() || (_status.connectMode && player.countCards("h") > 0));
				},
				content() {
					var next = player
						.chooseToUse(
							function (card, player, event) {
								if (get.name(card) != "sha") return false;
								return lib.filter.filterCard.apply(this, arguments);
							},
							"诛害：是否对" + get.translation(trigger.player) + "使用一张杀？"
						)
						.set("logSkill", "gzzhuhai")
						.set("complexSelect", true)
						.set("filterTarget", function (card, player, target) {
							if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
							return lib.filter.targetEnabled.apply(this, arguments);
						})
						.set("sourcex", trigger.player)
						.setHiddenSkill(event.name);
					player.addTempSkill("gzzhuhai2");
					next.oncard = function (card, player) {
						try {
							if (
								trigger.player.getHistory("sourceDamage", function (evt) {
									return evt.player.isFriendOf(player);
								}).length
							) {
								player.addTempSkill("gzzhuhai2");
								card.gzzhuhai_tag = true;
							}
						} catch (e) {
							alert("发生了一个导致【诛害】无法正常触发无视防具效果的错误。请关闭十周年UI/手杀UI等扩展以解决");
						}
					};
				},
				ai: {
					unequip_ai: true,
					skillTagFilter(player, tag, arg) {
						var evt = _status.event.getParent();
						if (evt.name != "gzzhuhai" || !arg || !arg.target) return false;
						if (
							!arg.target.getHistory("sourceDamage", function (evt) {
								return evt.player.isFriendOf(player);
							}).length
						)
							return false;
						return true;
					},
				},
			},
			gzzhuhai2: {
				trigger: { player: "shaMiss" },
				forced: true,
				popup: false,
				filter(event, player) {
					return event.card.gzzhuhai_tag == true && event.target.countCards("he") > 0;
				},
				content() {
					player.line(trigger.target);
					trigger.target.chooseToDiscard("he", true);
				},
				ai: {
					unequip: true,
					skillTagFilter(player, tag, arg) {
						if (!arg || !arg.card || !arg.card.gzzhuhai_tag) return false;
					},
				},
			},
			quanjin: {
				audio: 2,
				enable: "phaseUse",
				usable: 1,
				onChooseToUse(event) {
					if (!game.online) {
						event.set(
							"quanjin_list",
							game.filterPlayer(i => i != event.player && i.getHistory("damage").length)
						);
					}
				},
				filter(event, player) {
					return event.quanjin_list && event.quanjin_list.length > 0 && player.countCards("h") > 0;
				},
				filterCard: true,
				filterTarget(card, player, target) {
					return _status.event.quanjin_list.includes(target);
				},
				discard: false,
				lose: false,
				delay: false,
				check(card) {
					var evt = _status.event;
					if (
						evt.quanjin_list.filter(function (target) {
							return get.attitude(evt.player, target) > 0;
						}).length
					)
						return 8 - get.value(card);
					return 6.5 - get.value(card);
				},
				content() {
					"step 0";
					player.give(cards, target);
					"step 1";
					player.chooseJunlingFor(target);
					"step 2";
					event.junling = result.junling;
					event.targets = result.targets;
					var str = get.translation(player);
					target
						.chooseJunlingControl(player, result.junling, result.targets)
						.set("prompt", "劝进")
						.set("choiceList", ["执行该军令，然后" + str + "摸一张牌", "不执行该军令，然后其将手牌摸至与全场最多相同"])
						.set("ai", function () {
							var evt = _status.event.getParent(2),
								player = evt.target,
								source = evt.player,
								junling = evt.junling,
								targets = evt.targets;
							var num = 0;
							game.countPlayer(function (current) {
								var num2 = current.countCards("h");
								if (num2 > num) num = num2;
							});
							num = Math.max(0, num - source.countCards("h"));
							if (num > 1) {
								if (get.attitude(player, target) > 0) return get.junlingEffect(source, junling, player, targets, player) > num;
								return get.junlingEffect(source, junling, player, targets, player) > -num;
							}
							if (get.attitude(player, target) > 0) return get.junlingEffect(source, junling, player, targets, player) > 0;
							return get.junlingEffect(source, junling, player, targets, player) > 1;
						});
					"step 3";
					if (result.index == 0) {
						target.carryOutJunling(player, event.junling, targets);
						player.draw();
					} else {
						var num = 0;
						game.countPlayer(function (current) {
							var num2 = current.countCards("h");
							if (num2 > num) num = num2;
						});
						num -= player.countCards("h");
						if (num > 0) player.draw(Math.min(num, 5));
					}
				},
				ai: {
					order: 1,
					result: {
						player(player, target) {
							if (get.attitude(player, target) > 0) return 3.3;
							var num = 0;
							game.countPlayer(function (current) {
								var num2 = current.countCards("h");
								if (player == current) num2--;
								if (target == current) num2++;
								if (num2 > num) num = num2;
							});
							num = Math.max(0, num - player.countCards("h"));
							if (!num) return 0;
							if (num > 1) return 2;
							if (ui.selected.cards.length && get.value(ui.selected.cards[0]) > 5) return 0;
							return 1;
						},
					},
				},
			},
			zaoyun: {
				audio: 2,
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					var num = player.countCards("h");
					return game.hasPlayer(function (current) {
						if (current.isEnemyOf(player)) {
							var dist = get.distance(player, current);
							return dist > 1 && dist <= num;
						}
					});
				},
				selectCard() {
					var list = [],
						player = _status.event.player;
					if (ui.selected.targets.length) return get.distance(player, ui.selected.targets[0]) - 1;
					game.countPlayer(function (current) {
						if (current.isEnemyOf(player)) {
							var dist = get.distance(player, current);
							if (dist > 1) list.push(dist - 1);
						}
					});
					list.sort();
					return [list[0], list[list.length - 1]];
				},
				filterCard: true,
				filterTarget(card, player, target) {
					return target.isEnemyOf(player) && get.distance(player, target) == ui.selected.cards.length + 1;
				},
				check(card) {
					var player = _status.event.player;
					if (
						ui.selected.cards.length &&
						game.hasPlayer(function (current) {
							return current.isEnemyOf(player) && get.distance(player, current) == ui.selected.cards.length + 1 && get.damageEffect(current, player, player) > 0;
						})
					)
						return 0;
					return 7 - ui.selected.cards.length * 2 - get.value(card);
				},
				content() {
					target.damage("nocard");
					if (!player.storage.zaoyun2) player.storage.zaoyun2 = [];
					player.storage.zaoyun2.push(target);
					player.addTempSkill("zaoyun2");
				},
				ai: {
					order: 5,
					result: {
						target(player, target) {
							return get.damageEffect(target, player, target);
						},
					},
				},
			},
			zaoyun2: {
				onremove: true,
				charlotte: true,
				mod: {
					globalFrom(player, target) {
						if (player.getStorage("zaoyun2").includes(target)) return -Infinity;
					},
				},
			},
			gzzhidao: {
				audio: 2,
				trigger: { player: "phaseUseBegin" },
				forced: true,
				preHidden: true,
				content() {
					"step 0";
					player.chooseTarget("请选择【雉盗】的目标", "本回合内只能对自己和该角色使用牌，且第一次对其造成伤害时摸一张牌", lib.filter.notMe, true).set("ai", function (target) {
						var player = _status.event.player;
						return (1 - get.sgn(get.attitude(player, target))) * Math.max(1, get.distance(player, target));
					});
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.line(target, "green");
						game.log(player, "选择了", target);
						player.storage.gzzhidao2 = target;
						player.addTempSkill("gzzhidao2");
					}
				},
			},
			gzzhidao2: {
				mod: {
					playerEnabled(card, player, target) {
						if (target != player && target != player.storage.gzzhidao2) return false;
					},
					globalFrom(from, to) {
						if (to == from.storage.gzzhidao2) return -Infinity;
					},
				},
				audio: "gzzhidao",
				trigger: { source: "damageSource" },
				forced: true,
				charlotte: true,
				filter(event, player) {
					return (
						event.player == player.storage.gzzhidao2 &&
						player
							.getHistory("sourceDamage", function (evt) {
								return evt.player == event.player;
							})
							.indexOf(event) == 0 &&
						event.player.countGainableCards(player, "hej") > 0
					);
				},
				logTarget: "player",
				content() {
					player.gainPlayerCard(trigger.player, "hej", true);
				},
			},
			gzyjili: {
				audio: 2,
				forced: true,
				preHidden: ["gzyjili_remove"],
				trigger: { target: "useCardToTargeted" },
				filter(event, player) {
					if (get.color(event.card) != "red" || event.targets.length != 1) return false;
					var type = get.type(event.card);
					return type == "basic" || type == "trick";
				},
				check() {
					return false;
				},
				content() {
					player.addTempSkill("gzyjili2");
					var evt = trigger.getParent();
					if (!evt.gzyjili) evt.gzyjili = [];
					evt.gzyjili.add(player);
				},
				group: "gzyjili_remove",
				subSkill: {
					remove: {
						audio: "gzyjili",
						trigger: { player: "damageBegin2" },
						forced: true,
						filter(event, player) {
							var evt = false;
							for (var i of lib.phaseName) {
								evt = event.getParent(i);
								if (evt && evt.player) break;
							}
							return (
								evt &&
								evt.player &&
								player.getHistory("damage", function (evtx) {
									return evtx.getParent(evt.name) == evt;
								}).length == 1
							);
						},
						content() {
							trigger.cancel();
							player.removeCharacter(get.character(player.name1, 3).includes("gzyjili") ? 0 : 1);
						},
					},
				},
			},
			gzyjili2: {
				trigger: { global: "useCardAfter" },
				charlotte: true,
				popup: false,
				forced: true,
				filter(event, player) {
					return (
						event.gzyjili &&
						event.gzyjili.includes(player) &&
						!event.addedTarget &&
						event.player &&
						event.player.isAlive() &&
						event.player.canUse(
							{
								name: event.card.name,
								nature: event.card.nature,
								isCard: true,
							},
							player
						)
					);
				},
				content() {
					trigger.player.useCard(
						{
							name: trigger.card.name,
							nature: trigger.card.nature,
							isCard: true,
						},
						player,
						false
					);
				},
			},
			donggui: {
				audio: 2,
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					return game.hasPlayer(function (current) {
						return lib.skill.donggui.filterTarget(null, player, current);
					});
				},
				filterTarget(card, player, target) {
					return target != player && !target.isUnseen(2) && player.canUse("diaohulishan", target);
				},
				content() {
					"step 0";
					player.chooseButton(["暗置" + get.translation(target) + "的一张武将牌", [[target.name1, target.name2], "character"]], true).set("filterButton", function (button) {
						return !get.is.jun(button.link);
					});
					"step 1";
					var target1 = target.getNext();
					var target2 = target.getPrevious();
					if (target1 == target2 || target.inline(target1) || target.inline(target2) || target1.inline(target2)) event.finish();
					else {
						event.target1 = target1;
						event.target2 = target2;
					}
					target.hideCharacter(result.links[0] == target.name1 ? 0 : 1);
					target.addTempSkill("donggui2");
					player.useCard({ name: "diaohulishan", isCard: true }, target);
					"step 2";
					if (event.target1.inline(event.target2)) {
						player.draw(
							game.countPlayer(function (current) {
								return current.inline(event.target1);
							})
						);
					}
				},
				ai: {
					order: 2,
					result: {
						player(player, target) {
							var target1 = target.getNext();
							var target2 = target.getPrevious();
							if (target1 == target2 || target.inline(target1) || target.inline(target2) || target1.inline(target2) || !target1.isFriendOf(target2)) return 0;
							var num = game.countPlayer(function (current) {
								return current != target1 && current != target2 && (current.inline(target1) || current.inline(target2));
							});
							return 2 + num;
						},
					},
				},
			},
			donggui2: { ai: { nomingzhi: true } },
			fengyang: {
				audio: 2,
				zhenfa: "inline",
				trigger: { player: "phaseJieshuBegin" },
				filter(event, player) {
					var bool = player.hasSkill("fengyang");
					return (
						game.hasPlayer(function (current) {
							return current != player && current.inline(player);
						}) &&
						game.hasPlayer(function (current) {
							return (current == player || bool) && current.inline(player) && current.countCards("e") > 0;
						})
					);
				},
				direct: true,
				preHidden: true,
				content() {
					"step 0";
					event.list = game
						.filterPlayer(function (current) {
							return current.inline(player);
						})
						.sortBySeat();
					"step 1";
					var target = event.list.shift();
					if ((target == player || player.hasSkill("fengyang")) && target.countCards("e")) {
						event.target = target;
						var next = target.chooseToDiscard("e", get.prompt("fengyang"), "弃置装备区内的一张牌并摸两张牌").set("ai", function (card) {
							return 5.5 - get.value(card);
						});
						next.logSkill = "fengyang";
						if (player == target) next.setHiddenSkill("fengyang");
					} else event.goto(3);
					"step 2";
					if (result.bool) {
						target.draw(2);
					}
					"step 3";
					if (event.list.length) event.goto(1);
				},
			},
			fengyang_old: {
				audio: "fengyang",
				zhenfa: "inline",
				global: "fengyang_old_nogain",
				subSkill: {
					nogain: {
						mod: {
							canBeDiscarded(card, player, target) {
								if (
									get.position(card) == "e" &&
									player.identity != target.identity &&
									game.hasPlayer(function (current) {
										return current.hasSkill("fengyang_old") && (current == target || target.inline(current));
									})
								)
									return false;
							},
							canBeGained(card, player, target) {
								if (
									get.position(card) == "e" &&
									player.identity != target.identity &&
									game.hasPlayer(function (current) {
										return current.hasSkill("fengyang_old") && (current == target || target.inline(current));
									})
								)
									return false;
							},
						},
					},
				},
			},
			gzrekuangcai: {
				audio: "gzkuangcai",
				forced: true,
				preHidden: true,
				trigger: { player: "phaseDiscardBegin" },
				filter(event, player) {
					return !player.getHistory("useCard").length || !player.getHistory("sourceDamage").length;
				},
				check(event, player) {
					return !player.getHistory("useCard").length;
				},
				content() {
					lib.skill.rekuangcai.change(player, player.getHistory("useCard").length ? -1 : 1);
				},
				mod: {
					targetInRange(card, player) {
						if (player == _status.currentPhase) return true;
					},
					cardUsable(card, player) {
						if (player == _status.currentPhase) return Infinity;
					},
				},
			},
			gzkuangcai: {
				audio: 2,
				trigger: { player: "useCard1" },
				forced: true,
				firstDo: true,
				noHidden: true,
				preHidden: ["gzkuangcai_discard"],
				filter(event, player) {
					return player == _status.currentPhase && get.type(event.card) == "trick";
				},
				content() {
					trigger.nowuxie = true;
				},
				mod: {
					targetInRange(card, player) {
						if (player == _status.currentPhase) return true;
					},
					cardUsable(card, player) {
						if (player == _status.currentPhase) return Infinity;
					},
				},
				ai: {
					unequip: true,
					skillTagFilter(player) {
						return player == _status.currentPhase;
					},
				},
				group: "gzkuangcai_discard",
				subSkill: {
					discard: {
						audio: "gzkuangcai",
						trigger: { player: "phaseDiscardBegin" },
						forced: true,
						filter(event, player) {
							var use = player.getHistory("useCard").length;
							var damage = player.getStat("damage") || 0;
							if (use && !damage) return true;
							if (damage >= use) return true;
							return false;
						},
						check(event, player) {
							var use = player.getHistory("useCard").length;
							var damage = player.getStat("damage") || 0;
							if (use && !damage) return false;
							return true;
						},
						content() {
							var use = player.getHistory("useCard").length;
							var damage = player.getStat("damage") || 0;
							if (use && !damage) player.addTempSkill("gzkuangcai_less");
							else {
								player.drawTo(player.maxHp);
								player.addTempSkill("gzkuangcai_more");
							}
						},
					},
					more: {
						mod: {
							maxHandcard(player, num) {
								return num + 2;
							},
						},
						charlotte: true,
					},
					less: {
						mod: {
							maxHandcard(player, num) {
								return num - 2;
							},
						},
						charlotte: true,
					},
				},
			},
			gzshejian: {
				audio: 2,
				preHidden: true,
				trigger: { target: "useCardToTargeted" },
				filter(event, player) {
					if (player == event.player || event.targets.length != 1 || !event.player.isIn()) return false;
					if (!event.player.countCards("he") && _status.event.dying) return false;
					var hs = player.getCards("h");
					if (hs.length == 0) return false;
					return hs.every(i => lib.filter.cardDiscardable(i, player, "gzshejian"));
				},
				check(event, player) {
					var target = event.player;
					if (get.damageEffect(target, player, player) <= 0) return false;
					if (
						target.hp <= (player.hasSkill("gzcongjian") ? 2 : 1) &&
						!target.getEquip("huxinjing") &&
						!game.hasPlayer(function (current) {
							return current != target && !current.isFriendOf(player);
						})
					)
						return true;
					if (player.hasSkill("lirang") && player.hasFriend()) return true;
					if ((event.card.name == "guohe" || event.card.name == "shunshou" || event.card.name == "zhujinqiyuan") && player.countCards("h") == 1) return true;
					if (
						player.countCards("h") < 3 &&
						!player.countCards("h", function (card) {
							return get.value(card, player) > 5;
						})
					)
						return true;
					if (player.hp <= event.getParent().baseDamage) {
						if (get.tag(event.card, "respondSha")) {
							if (player.countCards("h", { name: "sha" }) == 0) {
								return true;
							}
						} else if (get.tag(event.card, "respondShan")) {
							if (player.countCards("h", { name: "shan" }) == 0) {
								return true;
							}
						} else if (get.tag(event.card, "damage")) {
							if (event.card.name == "shuiyanqijunx") return player.countCards("e") == 0;
							return true;
						}
					}
					return false;
				},
				logTarget: "player",
				content() {
					"step 0";
					var cards = player.getCards("h");
					event.num = cards.length;
					player.discard(cards);
					"step 1";
					var target = trigger.player,
						str = get.translation(target);
					event.target = target;
					if (!target.isIn()) event.finish();
					else if (_status.event.dying) event._result = { index: 0 };
					else if (target.countCards("he")) event._result = { index: 1 };
					else
						player
							.chooseControl()
							.set("choiceList", ["弃置" + str + "的" + get.cnNumber(num) + "张牌", "对" + str + "造成1点伤害"])
							.set("ai", () => 1);
					"step 2";
					if (result.index == 0) player.discardPlayerCard(target, num, true, "he");
					else target.damage();
				},
			},
			gzpozhen: {
				audio: 2,
				trigger: { global: "phaseBegin" },
				limited: true,
				preHidden: true,
				filter(event, player) {
					return player != event.player;
				},
				logTarget: "player",
				skillAnimation: true,
				animationColor: "orange",
				check(event, player) {
					var target = event.player;
					if (get.attitude(player, target) >= -3) return false;
					if (
						event.player.hasJudge("lebu") &&
						!game.hasPlayer(function (current) {
							return get.attitude(current, target) > 0 && current.hasWuxie();
						})
					)
						return false;
					var num =
						Math.min(
							target.getCardUsable("sha"),
							target.countCards("h", function (card) {
								return get.name(card, target) == "sha" && target.hasValueTarget(card);
							})
						) +
						target.countCards("h", function (card) {
							return get.name(card, target) != "sha" && target.hasValueTarget(card);
						});
					return num >= Math.max(2, target.hp);
				},
				content() {
					"step 0";
					player.awakenSkill("gzpozhen");
					var target = trigger.player;
					target.addTempSkill("gzpozhen2");
					var list = game.filterPlayer(function (current) {
						return current != target && (current.inline(target) || (current == target.getNext().getNext() && current.siege(target.getNext())) || (current == target.getPrevious().getPrevious() && current.siege(target.getPrevious())));
					});
					if (list.length) {
						list.add(target);
						list.sortBySeat(target);
						event.targets = list;
					} else event.finish();
					"step 1";
					var target = targets.shift();
					if (target.countDiscardableCards(player, "he") > 0) player.discardPlayerCard(target, "he", true).boolline = true;
					if (targets.length) event.redo();
				},
			},
			gzpozhen2: {
				mod: {
					cardEnabled2(card) {
						if (get.position(card) == "h") return false;
					},
					cardRecastable(card) {
						if (get.position(card) == "h") return false;
					},
				},
			},
			gzjiancai: {
				audio: 2,
				viceSkill: true,
				trigger: { global: "damageBegin4" },
				preHidden: true,
				init(player, skill) {
					if (player.checkViceSkill(skill) && !player.viceChanged) player.removeMaxHp();
				},
				filter(event, player) {
					return event.player.isFriendOf(player) && event.num >= event.player.hp;
				},
				check(event, player) {
					if (get.attitude(player, event.player) < 3) return false;
					if (event.num >= 1 || player.storage.gzpozhen) return true;
					if (
						player.countCards("h", function (card) {
							var mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
							if (mod2 != "unchanged") return mod2;
							var mod = game.checkMod(card, player, event.player, "unchanged", "cardSavable", player);
							if (mod != "unchanged") return mod;
							var savable = get.info(card).savable;
							if (typeof savable == "function") savable = savable(card, player, event.player);
							return savable;
						}) >=
						1 + event.num - event.player.hp
					)
						return false;
					return true;
				},
				logTarget: "player",
				skillAnimation: true,
				animationColor: "orange",
				content() {
					trigger.cancel();
					player.changeVice();
				},
				group: "gzjiancai_add",
				subSkill: {
					add: {
						trigger: { global: "changeViceBegin" },
						logTarget: "player",
						forced: true,
						locked: false,
						prompt(event, player) {
							return get.translation(event.player) + "即将变更副将，是否发动【荐才】，令其此次变更副将时增加两张可选武将牌？";
						},
						filter(event, player) {
							return event.player.isFriendOf(player);
						},
						content() {
							trigger.num += 2;
						},
					},
				},
			},
			gzxingzhao: {
				audio: 2,
				getNum() {
					var list = [],
						players = game.filterPlayer();
					for (var target of players) {
						if (target.isUnseen() || target.isHealthy()) continue;
						var add = true;
						for (var i of list) {
							if (i.isFriendOf(target)) {
								add = false;
								break;
							}
						}
						if (add) list.add(target);
					}
					return list.length;
				},
				mod: {
					maxHandcard(player, num) {
						return num + (lib.skill.gzxingzhao.getNum() > 2 ? 4 : 0);
					},
				},
				group: ["gzxingzhao_xunxun", "gzxingzhao_use", "gzxingzhao_lose"],
				preHidden: ["gzxingzhao_xunxun", "gzxingzhao_use", "gzxingzhao_lose"],
				subfrequent: ["use"],
				subSkill: {
					xunxun: {
						audio: 2,
						name: "恂恂",
						description: "摸牌阶段，你可以观看牌堆顶的四张牌，然后将其中的两张牌置于牌堆顶，并将其余的牌以任意顺序置于牌堆底。",
						trigger: { player: "phaseDrawBegin1" },
						filter(event, player) {
							return lib.skill.gzxingzhao.getNum() > 0;
						},
						content() {
							"step 0";
							var cards = get.cards(4);
							game.cardsGotoOrdering(cards);
							var next = player.chooseToMove("恂恂：将两张牌置于牌堆顶", true);
							next.set("list", [["牌堆顶", cards], ["牌堆底"]]);
							next.set("filterMove", function (from, to, moved) {
								if (to == 1 && moved[1].length >= 2) return false;
								return true;
							});
							next.set("filterOk", function (moved) {
								return moved[1].length == 2;
							});
							next.set("processAI", function (list) {
								var cards = list[0][1].slice(0).sort(function (a, b) {
									return get.value(b) - get.value(a);
								});
								return [cards, cards.splice(2)];
							});
							"step 1";
							var top = result.moved[0];
							var bottom = result.moved[1];
							top.reverse();
							for (var i = 0; i < top.length; i++) {
								ui.cardPile.insertBefore(top[i], ui.cardPile.firstChild);
							}
							for (i = 0; i < bottom.length; i++) {
								ui.cardPile.appendChild(bottom[i]);
							}
							game.updateRoundNumber();
							game.delayx();
						},
					},
					use: {
						audio: "gzxingzhao",
						trigger: {
							player: ["useCard", "damageEnd"],
						},
						forced: true,
						filter(event, player) {
							return (event.name == "damage" || get.type(event.card) == "equip") && lib.skill.gzxingzhao.getNum() > 1 && !player.isMaxHandcard();
						},
						frequent: true,
						content() {
							player.draw();
						},
					},
					draw: {
						audio: "gzxingzhao",
						trigger: { player: "damageEnd" },
						forced: true,
						filter(event, player) {
							return lib.skill.gzxingzhao.getNum() > 1 && event.source && event.source.isAlive() && event.source.countCards("h") != player.countCards("h");
						},
						logTarget(event, player) {
							var target = event.source;
							return target.countCards("h") > player.countCards("h") ? player : target;
						},
						check(event, player) {
							return get.attitude(player, lib.skill.gzxingzhao_draw.logTarget(event, player)) > 0;
						},
						content() {
							lib.skill.gzxingzhao_draw.logTarget(trigger, player).draw();
						},
					},
					skip: {
						audio: "gzxingzhao",
						trigger: { player: "phaseDiscardBefore" },
						forced: true,
						filter() {
							return lib.skill.gzxingzhao.getNum() > 2;
						},
						content() {
							trigger.cancel();
							game.log(player, "跳过了", "#y弃牌阶段");
						},
					},
					lose: {
						audio: "gzxingzhao",
						trigger: {
							player: "loseAfter",
							global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
						},
						filter(event, player) {
							var evt = event.getl(player);
							return evt && evt.player == player && evt.es && evt.es.length > 0 && lib.skill.gzxingzhao.getNum() > 3;
						},
						forced: true,
						content() {
							player.draw();
						},
					},
				},
				ai: {
					threaten: 3,
					effect: {
						target_use(card, player, target, current) {
							if (lib.skill.gzxingzhao.getNum() > 3 && get.type(card) == "equip" && !get.cardtag(card, "gifts")) return [1, 2];
						},
					},
					reverseEquip: true,
					skillTagFilter() {
						return lib.skill.gzxingzhao.getNum() > 3;
					},
				},
			},
			gzwenji: {
				audio: 2,
				trigger: { player: "phaseUseBegin" },
				direct: true,
				filter(event, player) {
					return game.hasPlayer(function (current) {
						return current != player && current.countCards("he");
					});
				},
				preHidden: true,
				content() {
					"step 0";
					player
						.chooseTarget(get.prompt2("gzwenji"), function (card, player, target) {
							return target != player && target.countCards("he") > 0;
						})
						.set("ai", function (target) {
							var att = get.attitude(_status.event.player, target);
							if (target.identity == "unknown" && att <= 0) return 20;
							if (att > 0) return Math.sqrt(att) / 10;
							return 5 - att;
						});
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						event.target = target;
						player.logSkill("gzwenji", target);
						target.chooseCard("he", true, "问计：将一张牌交给" + get.translation(player));
					} else {
						event.finish();
					}
					"step 2";
					if (result.bool) {
						event.card = result.cards[0];
						target.give(result.cards, player).gaintag.add("gzwenji");
					}
					"step 3";
					if (target.identity == "unknown" || target.isFriendOf(player)) {
						player.addTempSkill("gzwenji_respond");
						event.finish();
					} else if (
						target.isIn() &&
						player.countCards("he", function (card) {
							return !card.hasGaintag("gzwenji");
						})
					) {
						player
							.chooseCard("he", "交给" + get.translation(target) + "一张其他牌，或令其摸一张牌", function (card) {
								return !card.hasGaintag("gzwenji");
							})
							.set("ai", function (card) {
								return 5 - get.value(card);
							});
					} else event.finish();
					"step 4";
					if (result.bool) {
						player.give(result.cards, target);
						player.removeGaintag("gzwenji");
					} else {
						target.draw();
					}
				},
				subSkill: {
					respond: {
						onremove(player) {
							player.removeGaintag("gzwenji");
						},
						mod: {
							targetInRange(card, player, target) {
								if (!card.cards) return;
								for (var i of card.cards) {
									if (i.hasGaintag("gzwenji")) return true;
								}
							},
							cardUsable(card, player, target) {
								if (!card.cards) return;
								for (var i of card.cards) {
									if (i.hasGaintag("gzwenji")) return Infinity;
								}
							},
						},
						trigger: { player: "useCard" },
						forced: true,
						charlotte: true,
						audio: "gzwenji",
						filter(event, player) {
							return (
								player.getHistory("lose", function (evt) {
									if (evt.getParent() != event) return false;
									for (var i in evt.gaintag_map) {
										if (evt.gaintag_map[i].includes("gzwenji")) return true;
									}
									return false;
								}).length > 0
							);
						},
						content() {
							trigger.directHit.addArray(
								game.filterPlayer(function (current) {
									return current != player;
								})
							);
							if (trigger.addCount !== false) {
								trigger.addCount = false;
								var stat = player.getStat();
								if (stat && stat.card && stat.card[trigger.card.name]) stat.card[trigger.card.name]--;
							}
						},
						ai: {
							directHit_ai: true,
							skillTagFilter(player, tag, arg) {
								return arg.card && arg.card.cards && arg.card.cards.filter(card => card.hasGaintag("gzwenji")).length > 0;
							},
						},
					},
				},
			},
			gztunjiang: {
				audio: 2,
				trigger: { player: "phaseJieshuBegin" },
				frequent: true,
				preHidden: true,
				filter(event, player) {
					if (
						!player.getHistory("useCard", function (evt) {
							return evt.isPhaseUsing();
						}).length
					)
						return false;
					return (
						player.getHistory("useCard", function (evt) {
							if (evt.targets && evt.targets.length && evt.isPhaseUsing()) {
								var targets = evt.targets.slice(0);
								while (targets.includes(player)) targets.remove(player);
								return targets.length > 0;
							}
							return false;
						}).length == 0
					);
				},
				content() {
					player.draw(game.countGroup());
				},
			},
			gzbushi: {
				audio: 2,
				trigger: { player: "damageEnd" },
				frequent: true,
				preHidden: true,
				content() {
					"step 0";
					event.count = trigger.num;
					"step 1";
					event.count--;
					player.draw();
					"step 2";
					if (event.count > 0) {
						player.chooseBool(get.prompt2("gzbushi")).set("frequentSkill", "gzbushi");
					} else event.finish();
					"step 3";
					if (result.bool) event.goto(1);
				},
				group: "gzbushi_draw",
				subSkill: {
					draw: {
						trigger: { source: "damageSource" },
						direct: true,
						noHidden: true,
						filter(event, player) {
							return event.player.isEnemyOf(player) && event.player.isIn();
						},
						content() {
							"step 0";
							trigger.player.chooseBool("是否对" + get.translation(player) + "发动【布施】？", "你摸一张牌，然后其摸一张牌");
							"step 1";
							if (result.bool) {
								player.logSkill("gzbushi", trigger.player);
								game.asyncDraw([trigger.player, player]);
							} else event.finish();
							"step 2";
							game.delayx();
						},
					},
				},
			},
			gzbushi_old: {
				audio: 2,
				trigger: {
					player: "damageEnd",
					source: "damageSource",
				},
				forced: true,
				filter(event, player, name) {
					if (name == "damageSource" && player == event.player) return false;
					return game.hasPlayer(function (current) {
						return current.isFriendOf(event.player);
					});
				},
				check(event, player) {
					return player.isFriendOf(event.player);
				},
				content() {
					"step 0";
					event.count = trigger.num;
					if (event.triggername == "damageSource") event.count = 1;
					"step 1";
					event.count--;
					var target = trigger.player;
					var list = game.filterPlayer(function (current) {
						return current.isFriendOf(target);
					});
					if (list.length) {
						if (list.length == 1) event._result = { bool: true, targets: list };
						else
							player
								.chooseTarget("布施：令一名与" + (player == target ? "你" : get.translation(target)) + "势力相同的角色摸一张牌", true, function (card, player, target) {
									return target.isFriendOf(_status.event.target);
								})
								.set("target", target);
					} else event.finish();
					"step 2";
					if (result.bool) {
						var target = result.targets[0];
						player.line(target, "green");
						target.draw();
						if (event.count) event.goto(1);
					}
				},
			},
			gzmidao: {
				audio: 2,
				trigger: { global: "useCardToPlayered" },
				direct: true,
				//noHidden:true,
				filter(event, player) {
					var target = event.player;
					return event.isFirstTarget && target.isFriendOf(player) && target.isPhaseUsing() && (target == player || player.hasSkill("gzmidao")) && ["basic", "trick"].includes(get.type(event.card)) && get.tag(event.card, "damage") > 0 && event.cards && event.cards.length && !target.hasSkill("gzmidao2");
				},
				preHidden: true,
				content() {
					"step 0";
					var next = trigger.player.chooseBool("是否对" + get.translation(player) + "发动【米道】？", "令该角色修改" + get.translation(trigger.card) + "的花色和伤害属性");
					next.set("ai", () => false);
					if (player == next.player) next.setHiddenSkill(event.name);
					"step 1";
					if (result.bool) {
						player.logSkill("gzmidao");
						trigger.player.addTempSkill("gzmidao2");
						if (player != trigger.player) {
							trigger.player.line(player, "green");
							//player.gain(result.cards,trigger.player,'giveAuto');
						}
					} else event.finish();
					"step 2";
					if (player.isUnderControl()) {
						game.swapPlayerAuto(player);
					}
					var switchToAuto = function () {
						_status.imchoosing = false;
						var listn = ["普通"].concat(lib.inpile_nature);
						event._result = {
							bool: true,
							suit: lib.suit.randomGet(),
							nature: listn.randomGet(),
						};
						if (event.dialog) event.dialog.close();
						if (event.control) event.control.close();
					};
					var chooseButton = function (player, card) {
						var event = _status.event;
						player = player || event.player;
						if (!event._result) event._result = {};
						var dialog = ui.create.dialog("米道：请修改" + card + "的花色和属性", "forcebutton", "hidden");
						event.dialog = dialog;
						dialog.addText("花色");
						var table = document.createElement("div");
						table.classList.add("add-setting");
						table.style.margin = "0";
						table.style.width = "100%";
						table.style.position = "relative";
						var listi = ["spade", "heart", "club", "diamond"];
						for (var i = 0; i < listi.length; i++) {
							var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
							td.link = listi[i];
							table.appendChild(td);
							td.innerHTML = "<span>" + get.translation(listi[i]) + "</span>";
							td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
								if (_status.dragged) return;
								if (_status.justdragged) return;
								_status.tempNoButton = true;
								setTimeout(function () {
									_status.tempNoButton = false;
								}, 500);
								var link = this.link;
								var current = this.parentNode.querySelector(".bluebg");
								if (current) {
									current.classList.remove("bluebg");
								}
								this.classList.add("bluebg");
								event._result.suit = link;
							});
						}
						dialog.content.appendChild(table);
						dialog.addText("属性");
						var table2 = document.createElement("div");
						table2.classList.add("add-setting");
						table2.style.margin = "0";
						table2.style.width = "100%";
						table2.style.position = "relative";
						var listn = ["普通"].concat(lib.inpile_nature);
						for (var i = 0; i < listn.length; i++) {
							var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
							var nature = listn[i];
							td.link = nature;
							table2.appendChild(td);
							td.innerHTML = "<span>" + get.translation(nature) + "</span>";
							td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
								if (_status.dragged) return;
								if (_status.justdragged) return;
								_status.tempNoButton = true;
								setTimeout(function () {
									_status.tempNoButton = false;
								}, 500);
								var link = this.link;
								var current = this.parentNode.querySelector(".bluebg");
								if (current) {
									current.classList.remove("bluebg");
								}
								this.classList.add("bluebg");
								event._result.nature = link;
							});
						}
						dialog.content.appendChild(table2);
						dialog.add("　　");
						event.dialog.open();

						event.switchToAuto = function () {
							event._result = {
								bool: true,
								nature: listn.randomGet(),
								suit: listi.randomGet(),
							};
							event.dialog.close();
							event.control.close();
							game.resume();
							_status.imchoosing = false;
						};
						event.control = ui.create.control("ok", "cancel2", function (link) {
							var result = event._result;
							if (link == "cancel2") result.bool = false;
							else {
								if (!result.nature || !result.suit) return;
								result.bool = true;
							}
							event.dialog.close();
							event.control.close();
							game.resume();
							_status.imchoosing = false;
						});
						for (var i = 0; i < event.dialog.buttons.length; i++) {
							event.dialog.buttons[i].classList.add("selectable");
						}
						game.pause();
						game.countChoose();
					};
					if (event.isMine()) {
						chooseButton(player, get.translation(trigger.card));
					} else if (event.isOnline()) {
						event.player.send(chooseButton, event.player, get.translation(trigger.card));
						event.player.wait();
						game.pause();
					} else {
						switchToAuto();
					}
					"step 3";
					var map = event.result || result;
					if (map.bool) {
						game.log(player, "将", trigger.card, "的花色属性修改为了", "#g" + get.translation(map.suit + 2), "#y" + get.translation(map.nature));
						trigger.card.suit = map.suit;
						if (map.nature == "普通") delete trigger.card.nature;
						else trigger.card.nature = map.nature;
						trigger.player.storage.gzmidao2 = [trigger.card, map.nature];
						player.popup(get.translation(map.suit + 2) + get.translation(map.nature), "thunder");
					}
				},
			},
			gzmidao2: {
				charlotte: true,
				trigger: { global: "damageBefore" },
				forced: true,
				firstDo: true,
				popup: false,
				onremove: true,
				filter(event, player) {
					return player.storage.gzmidao2 && event.card == player.storage.gzmidao2[0];
				},
				content() {
					var nature = player.storage.gzmidao2[1];
					if (nature == "普通") delete trigger.nature;
					else trigger.nature = nature;
				},
			},
			gzbiluan: {
				audio: 2,
				mod: {
					globalTo(from, to, distance) {
						return distance + to.countCards("e");
					},
				},
			},
			gzrelixia: {
				audio: "gzlixia",
				trigger: { global: "phaseZhunbeiBegin" },
				noHidden: true,
				forced: true,
				filter(event, player) {
					return player != event.player && !event.player.isFriendOf(player) && !player.inRangeOf(event.player);
				},
				logTarget: "player",
				content() {
					"step 0";
					var target = trigger.player;
					event.target = target;
					if (!player.countDiscardableCards(target, "e")) {
						player.draw();
						event.finish();
						return;
					}
					var str = get.translation(player);
					target
						.chooseControl()
						.set("prompt", str + "发动了【礼下】，请选择一项")
						.set("choiceList", ["令" + str + "摸一张牌", "弃置" + str + "装备区内的一张牌并失去1点体力"])
						.set("ai", function () {
							var player = _status.event.player,
								target = _status.event.getParent().player;
							if (player.hp <= 1 || get.attitude(player, target) >= 0) return 0;
							if (
								target.countCards("e", function (card) {
									return get.value(card, target) >= 7 - player.hp;
								}) > 0
							)
								return 1;
							var dist = get.distance(player, target, "attack");
							if (dist > 1 && dist - target.countCards("e") <= 1) return true;
							return 0;
						});
					"step 1";
					if (result.index == 0) player.draw();
					else {
						target.discardPlayerCard(player, "e", true);
						target.loseHp();
					}
				},
			},
			gzlixia: {
				audio: 2,
				trigger: { global: "phaseZhunbeiBegin" },
				noHidden: true,
				direct: true,
				filter(event, player) {
					return player != event.player && !event.player.isFriendOf(player) && player.countDiscardableCards(event.player, "e") > 0;
				},
				content() {
					"step 0";
					trigger.player.chooseBool("是否对" + get.translation(player) + "发动【礼下】？", "弃置其装备区内的一张牌，然后选择一项：①弃置两张牌。②失去1点体力。③令其摸两张牌。").set("ai", function () {
						var player = _status.event.player;
						var target = _status.event.getParent().player;
						if (get.attitude(player, target) > 0)
							return (
								target.countCards("e", function (card) {
									return get.value(card, target) < 3;
								}) > 0
							);
						if (
							target.countCards("e", function (card) {
								return get.value(card, target) >= 7;
							})
						)
							return true;
						var dist = get.distance(player, target, "attack");
						if (dist > 1 && dist - target.countCards("e") <= 1) return true;
						return false;
					});
					"step 1";
					if (result.bool) {
						var target = trigger.player;
						event.target = target;
						player.logSkill("gzlixia");
						target.line(player, "green");
						target.discardPlayerCard(player, "e", true);
					} else event.finish();
					"step 2";
					var list = ["失去1点体力", "令" + get.translation(player) + "摸两张牌"];
					event.addIndex = 0;
					if (
						target.countCards("h", function (card) {
							return lib.filter.cardDiscardable(card, target, "gzlixia");
						}) > 1
					)
						list.unshift("弃置两张牌");
					else event.addIndex++;
					target
						.chooseControl()
						.set("choiceList", list)
						.set("ai", function () {
							var num = 2;
							var player = _status.event.player;
							var target = _status.event.getParent().player;
							if (get.attitude(player, target) >= 0) num = 2;
							else if (
								player.countCards("he", function (card) {
									return lib.filter.cardDiscardable(card, player, "gzlixia") && get.value(card, player) < 5;
								}) > 1
							)
								num = 0;
							else if (player.hp + player.countCards("h", "tao") > 3 && !player.hasJudge("lebu")) num = 1;
							return num - _status.event.getParent().addIndex;
						});
					"step 3";
					switch (result.index + event.addIndex) {
						case 0:
							target.chooseToDiscard(2, "h", true);
							break;
						case 1:
							target.loseHp();
							break;
						case 2:
							player.draw(2);
							break;
					}
				},
			},

			yigui: {
				audio: 2,
				hiddenCard(player, name) {
					var storage = player.storage.yigui;
					if (name == "shan" || name == "wuxie" || !storage || !storage.character.length || storage.used.includes(name) || !lib.inpile.includes(name)) return false;
					return true;
				},
				init(player, skill) {
					if (!player.storage.skill)
						player.storage[skill] = {
							character: [],
							used: [],
						};
				},
				enable: "chooseToUse",
				filter(event, player) {
					if (event.type == "wuxie" || event.type == "respondShan") return false;
					var storage = player.storage.yigui;
					if (!storage || !storage.character.length) return false;
					if (event.type == "dying") {
						if ((!event.filterCard({ name: "tao" }, player, event) || storage.used.includes("tao")) && (!event.filterCard({ name: "jiu" }, player, event) || storage.used.includes("jiu"))) return false;
						var target = event.dying;
						if (target.identity == "unknown" || target.identity == "ye") return true;
						for (var i = 0; i < storage.character.length; i++) {
							var group = lib.character[storage.character[i]][1];
							if (group == "ye" || target.identity == group) return true;
							var double = get.is.double(storage.character[i], true);
							if (double && double.includes(target.identity)) return true;
						}
						return false;
					} else return true;
				},
				chooseButton: {
					select: 2,
					dialog(event, player) {
						var dialog = ui.create.dialog("役鬼", "hidden");
						dialog.add([player.storage.yigui.character, "character"]);
						var list = lib.inpile;
						var list2 = [];
						for (var i = 0; i < list.length; i++) {
							var name = list[i];
							if (name == "shan" || name == "wuxie") continue;
							var type = get.type(name);
							if (name == "sha") {
								list2.push(["基本", "", "sha"]);
								list2.push(["基本", "", "sha", "fire"]);
								list2.push(["基本", "", "sha", "thunder"]);
							} else if (type == "basic") {
								list2.push(["基本", "", list[i]]);
							} else if (type == "trick") {
								list2.push(["锦囊", "", list[i]]);
							}
						}
						dialog.add([list2, "vcard"]);
						return dialog;
					},
					check(button) {
						if (ui.selected.buttons.length) {
							var evt = _status.event.getParent("chooseToUse");
							var name = button.link[2];
							var group = lib.character[ui.selected.buttons[0].link][1];
							var double = get.is.double(ui.selected.buttons[0].link, true);
							var player = _status.event.player;
							if (evt.type == "dying") {
								if (evt.dying != player && get.effect(evt.dying, { name: name }, player, player) <= 0) return 0;
								if (name == "jiu") return 2.1;
								return 2;
							}
							if (!["tao", "juedou", "guohe", "shunshou", "wuzhong", "xietianzi", "yuanjiao", "taoyuan", "wugu", "wanjian", "nanman", "huoshaolianying"].includes(name)) return 0;
							if (["taoyuan", "wugu", "wanjian", "nanman", "huoshaolianying"].includes(name)) {
								var list = game.filterPlayer(function (current) {
									return (group == "ye" || current.identity == "unknown" || current.identity == "ye" || current.identity == group || (double && double.includes(current.identity))) && player.canUse({ name: name }, current);
								});
								var num = 0;
								for (var i = 0; i < list.length; i++) {
									num += get.effect(list[i], { name: name }, player, player);
								}
								if (num <= 0) return 0;
								if (list.length > 1) return (1.7 + Math.random()) * Math.max(num, 1);
							}
						}
						return 1 + Math.random();
					},
					filter(button, player) {
						var evt = _status.event.getParent("chooseToUse");
						if (!ui.selected.buttons.length) {
							if (typeof button.link != "string") return false;
							if (evt.type == "dying") {
								if (evt.dying.identity == "unknown" || evt.dying.identity == "ye") return true;
								var double = get.is.double(button.link, true);
								return evt.dying.identity == lib.character[button.link][1] || lib.character[button.link][1] == "ye" || (double && double.includes(evt.dying.identity));
							}
							return true;
						} else {
							if (typeof ui.selected.buttons[0].link != "string") return false;
							if (typeof button.link != "object") return false;
							var name = button.link[2];
							if (player.storage.yigui.used.includes(name)) return false;
							var card = { name: name };
							if (button.link[3]) card.nature = button.link[3];
							var info = get.info(card);
							var group = lib.character[ui.selected.buttons[0].link][1];
							var double = get.is.double(ui.selected.buttons[0].link, true);
							if (evt.type == "dying") {
								return evt.filterCard(card, player, evt);
							}
							if (!lib.filter.filterCard(card, player, evt)) return false;
							else if (evt.filterCard && !evt.filterCard(card, player, evt)) return false;
							if (info.changeTarget) {
								var list = game.filterPlayer(function (current) {
									return player.canUse(card, current);
								});
								for (var i = 0; i < list.length; i++) {
									var giveup = false;
									var targets = [list[i]];
									info.changeTarget(player, targets);
									for (var j = 0; j < targets.length; j++) {
										if (group != "ye" && targets[j].identity != "unknown" && targets[j].identity != "ye" && targets[j].identity != group && (!double || !double.includes(targets[j].identity))) {
											giveup = true;
											break;
										}
									}
									if (giveup) continue;
									if (giveup == false) return true;
								}
								return false;
							} else
								return game.hasPlayer(function (current) {
									return evt.filterTarget(card, player, current) && (group == "ye" || current.identity == "unknown" || current.identity == "ye" || current.identity == group || (double && double.includes(current.identity)));
								});
						}
					},
					backup(links, player) {
						var name = links[1][2];
						var nature = links[1][3] || null;
						var character = links[0];
						var group = lib.character[character][1];
						var next = {
							character: character,
							group: group,
							filterCard() {
								return false;
							},
							selectCard: -1,
							complexCard: true,
							check() {
								return 1;
							},
							popname: true,
							audio: "yigui",
							viewAs: {
								name: name,
								nature: nature,
								isCard: true,
							},
							filterTarget(card, player, target) {
								var xx = lib.skill.yigui_backup;
								var evt = _status.event;
								var group = xx.group;
								var double = get.is.double(xx.character, true);
								var info = get.info(card);
								if (!(info.singleCard && ui.selected.targets.length) && group != "ye" && target.identity != "unknown" && target.identity != "ye" && target.identity != group && (!double || !double.includes(target.identity))) return false;
								if (info.changeTarget) {
									var targets = [target];
									info.changeTarget(player, targets);
									for (var i = 0; i < targets.length; i++) {
										if (group != "ye" && targets[i].identity != "unknown" && targets[i].identity != "ye" && targets[i].identity != group && (!double || !double.includes(targets[i].identity))) return false;
									}
								}
								//if(evt.type=='dying') return target==evt.dying;
								if (evt._backup && evt._backup.filterTarget) return evt._backup.filterTarget(card, player, target);
								return lib.filter.filterTarget(card, player, target);
							},
							onuse(result, player) {
								player.logSkill("yigui");
								var character = lib.skill.yigui_backup.character;
								player.flashAvatar("yigui", character);
								player.storage.yigui.character.remove(character);
								_status.characterlist.add(character);
								game.log(player, "从「魂」中移除了", "#g" + get.translation(character));
								player.syncStorage("yigui");
								player.updateMarks("yigui");
								player.storage.yigui.used.add(result.card.name);
							},
						};
						return next;
					},
					prompt(links, player) {
						var name = links[1][2];
						var character = links[0];
						var nature = links[1][3];
						return "移除「" + get.translation(character) + "」并视为使用" + (get.translation(nature) || "") + get.translation(name);
					},
				},
				group: ["yigui_init", "yigui_refrain"],
				ai: {
					order() {
						return 1 + 10 * Math.random();
					},
					result: {
						player: 1,
					},
				},
				mark: true,
				marktext: "魂",
				intro: {
					onunmark(storage, player) {
						_status.characterlist.addArray(storage.character);
						storage.character = [];
					},
					mark(dialog, storage, player) {
						if (storage && storage.character.length) {
							if (player.isUnderControl(true)) {
								dialog.addSmall([storage.character, "character"]);
							} else {
								return "共有" + get.cnNumber(storage.character.length) + "张“魂”";
							}
						} else {
							return "没有魂";
						}
					},
					content(storage, player) {
						return "共有" + get.cnNumber(storage.character.length) + "张“魂”";
					},
					markcount(storage, player) {
						if (storage && storage.character) return storage.character.length;
						return 0;
					},
				},
			},
			yigui_init: {
				audio: "yigui",
				trigger: {
					player: "showCharacterAfter",
				},
				forced: true,
				filter(event, player) {
					return (
						event.toShow.some(name => {
							return get.character(name, 3).includes("yigui");
						}) && !player.storage.yigui_init
					);
				},
				content() {
					player.storage.yigui_init = true;
					var list = _status.characterlist.randomGets(2);
					if (list.length) {
						_status.characterlist.removeArray(list);
						player.storage.yigui.character.addArray(list);
						lib.skill.gzhuashen.drawCharacter(player, list);
						player.syncStorage("yigui");
						player.updateMarks("yigui");
						game.log(player, "获得了" + get.cnNumber(list.length) + "张「魂」");
					}
				},
			},
			yigui_refrain: {
				trigger: { global: "phaseBefore" },
				forced: true,
				silent: true,
				popup: false,
				content() {
					player.storage.yigui.used = [];
				},
			},
			yigui_shan: {
				enable: "chooseToUse",
				filter(event, player) {
					if (event.type != "respondShan") return false;
					var storage = player.storage.yigui;
					if (!storage || !storage.character.length || storage.used.includes("shan")) return false;
					return event.filterCard({ name: "shan" }, player, event);
				},
				chooseButton: {
					dialog(event, player) {
						var dialog = ui.create.dialog("役鬼", "hidden");
						dialog.add([player.storage.yigui.character, "character"]);
						return dialog;
					},
					check(button) {
						return (
							1 /
							(1 +
								game.countPlayer(function (current) {
									return current.identity == button.link;
								}))
						);
					},
					backup(links, player) {
						var character = links[0];
						var next = {
							character: character,
							filterCard() {
								return false;
							},
							selectCard: -1,
							complexCard: true,
							check() {
								return 1;
							},
							popname: true,
							audio: "yigui",
							viewAs: {
								name: "shan",
								isCard: true,
							},
							onuse(result, player) {
								player.logSkill("yigui");
								var character = lib.skill.yigui_shan_backup.character;
								player.flashAvatar("yigui", character);
								player.storage.yigui.character.remove(character);
								_status.characterlist.add(character);
								game.log(player, "从「魂」中移除了", "#g" + get.translation(character));
								player.syncStorage("yigui");
								player.updateMarks("yigui");
								player.storage.yigui.used.add(result.card.name);
							},
						};
						return next;
					},
				},
				ai: {
					respondShan: true,
					skillTagFilter(player) {
						var storage = player.storage.yigui;
						if (!storage || !storage.character.length || storage.used.includes("shan")) return false;
					},
					order: 0.1,
					result: {
						player: 1,
					},
				},
			},
			yigui_wuxie: {
				enable: "chooseToUse",
				filter(event, player) {
					if (event.type != "wuxie") return false;
					var storage = player.storage.yigui;
					if (!storage || !storage.character.length || storage.used.includes("wuxie")) return false;
					return event.filterCard({ name: "wuxie" }, player, event);
				},
				chooseButton: {
					dialog(event, player) {
						var dialog = ui.create.dialog("役鬼", "hidden");
						dialog.add([player.storage.yigui.character, "character"]);
						return dialog;
					},
					check(button) {
						return (
							1 /
							(1 +
								game.countPlayer(function (current) {
									return current.identity == button.link;
								}))
						);
					},
					backup(links, player) {
						var character = links[0];
						var next = {
							character: character,
							filterCard() {
								return false;
							},
							selectCard: -1,
							complexCard: true,
							check() {
								return 1;
							},
							popname: true,
							audio: "yigui",
							viewAs: {
								name: "wuxie",
								isCard: true,
							},
							onuse(result, player) {
								player.logSkill("yigui");
								var character = lib.skill.yigui_wuxie_backup.character;
								player.flashAvatar("yigui", character);
								player.storage.yigui.character.remove(character);
								_status.characterlist.add(character);
								game.log(player, "从「魂」中移除了", "#g" + get.translation(character));
								player.syncStorage("yigui");
								player.updateMarks("yigui");
								player.storage.yigui.used.add(result.card.name);
							},
						};
						return next;
					},
				},
				ai: {
					order: 0.1,
					result: {
						player: 1,
					},
				},
			},
			yigui_gzshan: {
				enable: "chooseToUse",
				filter(event, player) {
					if (event.type != "respondShan" || !event.filterCard({ name: "shan" }, player, event) || !lib.inpile.includes("shan")) return false;
					var storage = player.storage.yigui,
						target = event.getParent().player;
					if (!storage || !target || !storage.character.length || storage.used.includes("shan")) return false;
					var identity = target.identity;
					return (
						["unknown", "ye"].includes(identity) ||
						storage.character.some(function (i) {
							if (lib.character[i][1] == "ye") return true;
							var double = get.is.double(i, true);
							var groups = double ? double : [lib.character[i][1]];
							return groups.includes(identity);
						})
					);
				},
				chooseButton: {
					dialog(event, player) {
						var dialog = ui.create.dialog("役鬼", "hidden");
						dialog.add([player.storage.yigui.character, "character"]);
						return dialog;
					},
					filter(button, player) {
						var evt = _status.event.getParent("chooseToUse");
						var target = evt.getParent().player,
							identity = target.identity;
						if (["unknown", "ye"].includes(identity)) return true;
						if (lib.character[button.link][1] == "ye") return true;
						var double = get.is.double(button.link, true);
						var groups = double ? double : [lib.character[button.link][1]];
						return groups.includes(identity);
					},
					check(button) {
						return (
							1 /
							(1 +
								game.countPlayer(function (current) {
									return current.identity == lib.character[button.link][1];
								}))
						);
					},
					backup(links, player) {
						var character = links[0];
						var next = {
							character: character,
							filterCard: () => false,
							selectCard: -1,
							complexCard: true,
							check: () => 1,
							popname: true,
							audio: "yigui",
							viewAs: { name: "shan", isCard: true },
							onuse(result, player) {
								player.logSkill("yigui");
								var character = lib.skill.yigui_gzshan_backup.character;
								player.flashAvatar("yigui", character);
								player.storage.yigui.character.remove(character);
								_status.characterlist.add(character);
								game.log(player, "从「魂」中移除了", "#g" + get.translation(character));
								player.syncStorage("yigui");
								player.updateMarks("yigui");
								player.storage.yigui.used.add(result.card.name);
							},
						};
						return next;
					},
				},
				ai: {
					respondShan: true,
					skillTagFilter(player, tag, arg) {
						if (arg == "respond" || !lib.inpile.includes("shan")) return false;
						var storage = player.storage.yigui;
						if (!storage || !storage.character.length || storage.used.includes("shan")) return false;
					},
					order: 0.1,
					result: { player: 1 },
				},
			},
			yigui_gzwuxie: {
				hiddenWuxie(player, info) {
					if (!lib.inpile.includes("wuxie")) return false;
					const storage = player.storage.yigui;
					if (!storage || !storage.character || !storage.character.length || (storage.used && storage.used.includes("wuxie"))) return false;
					if (_status.connectMode) return true;
					const target = info.target;
					if (!target) return false;
					const identity = target.identity;
					return (
						["unknown", "ye"].includes(identity) ||
						storage.character.some(function (i) {
							if (lib.character[i][1] == "ye") return true;
							const double = get.is.double(i, true);
							return (double ? double : [lib.character[i][1]]).includes(identity);
						})
					);
				},
				enable: "chooseToUse",
				filter(event, player) {
					if (event.type != "wuxie" || !lib.inpile.includes("wuxie")) return false;
					const storage = player.storage.yigui;
					if (!storage || !storage.character || !storage.character.length || (storage.used && storage.used.includes("wuxie"))) return false;
					const info = event.info_map,
						target = info.target,
						identity = target.identity;
					return (
						["unknown", "ye"].includes(identity) ||
						storage.character.some(function (i) {
							if (lib.character[i][1] == "ye") return true;
							const double = get.is.double(i, true);
							return (double ? double : [lib.character[i][1]]).includes(identity);
						})
					);
				},
				chooseButton: {
					dialog(event, player) {
						let dialog = ui.create.dialog("役鬼", "hidden");
						dialog.add([player.storage.yigui.character, "character"]);
						return dialog;
					},
					filter(button, player) {
						const evt = get.event().getParent("chooseToUse");
						const info = evt.info_map,
							target = info.target,
							identity = target.identity;
						if (["unknown", "ye"].includes(identity)) return true;
						if (lib.character[button.link][1] == "ye") return true;
						const double = get.is.double(button.link, true);
						return (double ? double : [lib.character[button.link][1]]).includes(identity);
					},
					check(button) {
						return 1 + Math.random();
					},
					backup(links, player) {
						return {
							character: links[0],
							filterCard: () => false,
							selectCard: -1,
							complexCard: true,
							check: () => 1,
							popname: true,
							audio: "yigui",
							viewAs: { name: "wuxie", isCard: true },
							onuse(result, player) {
								player.logSkill("yigui");
								const character = lib.skill.yigui_gzwuxie_backup.character;
								player.flashAvatar("yigui", character);
								player.storage.yigui.character.remove(character);
								_status.characterlist.add(character);
								game.log(player, "从「魂」中移除了", "#g" + get.translation(character));
								player.syncStorage("yigui");
								player.updateMarks("yigui");
								player.storage.yigui.used.add(result.card.name);
							},
						};
					},
				},
				ai: {
					order: 0.1,
					result: { player: 1 },
				},
			},
			jihun: {
				trigger: {
					player: "damageEnd",
					global: "dyingAfter",
				},
				audio: 2,
				frequent: true,
				preHidden: true,
				filter(event, player) {
					return event.name == "damage" || (event.player.isAlive() && !event.player.isFriendOf(player));
				},
				content() {
					var list = _status.characterlist.randomGets(1);
					if (list.length) {
						_status.characterlist.removeArray(list);
						player.storage.yigui.character.addArray(list);
						lib.skill.gzhuashen.drawCharacter(player, list);
						player.syncStorage("yigui");
						player.updateMarks("yigui");
						game.log(player, "获得了" + get.cnNumber(list.length) + "张「魂」");
					}
				},
			},
			gzbuyi: {
				trigger: { global: "dyingAfter" },
				usable: 1,
				filter(event, player) {
					if (!(event.player && event.player.isAlive() && event.source && event.source.isAlive())) return false;
					return event.player.isFriendOf(player) && event.reason && event.reason.name == "damage";
				},
				check(event, player) {
					return get.attitude(player, event.player) > 0;
				},
				logTarget: "source",
				preHidden: true,
				content() {
					"step 0";
					player.chooseJunlingFor(trigger.source);
					"step 1";
					event.junling = result.junling;
					event.targets = result.targets;
					var choiceList = [];
					choiceList.push("执行该军令");
					choiceList.push("令" + get.translation(trigger.player) + (trigger.player == trigger.source ? "（你）" : "") + "回复1点体力");
					trigger.source
						.chooseJunlingControl(player, result.junling, result.targets)
						.set("prompt", "补益")
						.set("choiceList", choiceList)
						.set("ai", function () {
							if (get.recoverEffect(trigger.player, player, _status.event.player) > 0) return 1;
							return get.attitude(trigger.source, trigger.player) < 0 && get.junlingEffect(player, result.junling, trigger.source, result.targets, trigger.source) >= -2 ? 1 : 0;
						});
					"step 2";
					if (result.index == 0) trigger.source.carryOutJunling(player, event.junling, targets);
					else trigger.player.recover(player);
				},
				audio: ["buyi", 2],
			},
			keshou: {
				audio: 2,
				trigger: { player: "damageBegin3" },
				filter(event, player) {
					return event.num > 0;
				},
				direct: true,
				preHidden: true,
				content() {
					"step 0";
					var check = player.countCards("h", { color: "red" }) > 1 || player.countCards("h", { color: "black" }) > 1;
					player
						.chooseCard(get.prompt("keshou"), "弃置两张颜色相同的牌，令即将受到的伤害-1", "he", 2, function (card) {
							if (ui.selected.cards.length) return get.color(card) == get.color(ui.selected.cards[0]);
							return true;
						})
						.set("complexCard", true)
						.set("ai", function (card) {
							if (!_status.event.check) return 0;
							var player = _status.event.player;
							if (player.hp == 1) {
								if (
									!player.countCards("h", function (card) {
										return get.tag(card, "save");
									}) &&
									!player.hasSkillTag("save", true)
								)
									return 10 - get.value(card);
								return 7 - get.value(card);
							}
							return 6 - get.value(card);
						})
						.set("check", check)
						.setHiddenSkill(event.name);
					"step 1";
					var logged = false;
					if (result.cards) {
						logged = true;
						player.logSkill("keshou");
						player.discard(result.cards);
						trigger.num--;
					}
					if (
						!player.isUnseen() &&
						!game.hasPlayer(function (current) {
							return current != player && current.isFriendOf(player);
						})
					) {
						if (!logged) player.logSkill("keshou");
						player.judge(function (card) {
							if (get.color(card) == "red") return 1;
							return 0;
						});
					} else event.finish();
					"step 2";
					if (result.judge > 0) player.draw();
				},
			},
			zhuwei: {
				audio: 2,
				trigger: { player: "judgeEnd" },
				filter(event) {
					if (get.owner(event.result.card)) return false;
					if (event.nogain && event.nogain(event.result.card)) return false;
					return true;
					//return event.result.card.name=='sha'||event.result.card.name=='juedou';
				},
				frequent: true,
				preHidden: true,
				content() {
					"step 0";
					player.gain(trigger.result.card, "gain2");
					player.chooseBool("是否令" + get.translation(_status.currentPhase) + "本回合的手牌上限和使用【杀】的次数上限+1？").ai = function () {
						return get.attitude(player, _status.currentPhase) > 0;
					};
					"step 1";
					if (result.bool) {
						var target = _status.currentPhase;
						if (!target.hasSkill("zhuwei_eff")) {
							target.addTempSkill("zhuwei_eff");
							target.storage.zhuwei_eff = 1;
						} else target.storage.zhuwei_eff++;
						target.updateMarks();
					}
				},
				subSkill: {
					eff: {
						sub: true,
						mod: {
							cardUsable(card, player, num) {
								if (card.name == "sha") return num + player.storage.zhuwei_eff;
							},
							maxHandcard(player, num) {
								return num + player.storage.zhuwei_eff;
							},
						},
						mark: true,
						charlotte: true,
						intro: {
							content(storage) {
								if (storage) return "使用【杀】的次数上限+" + storage + "，手牌上限+" + storage;
							},
						},
					},
				},
			},
			gzweidi: {
				init(player) {
					player.storage.gzweidi = [];
				},
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					return player.storage.gzweidi.length > 0;
				},
				filterTarget(card, player, target) {
					return target != player && player.storage.gzweidi.includes(target);
				},
				content() {
					"step 0";
					player.chooseJunlingFor(target);
					"step 1";
					event.junling = result.junling;
					event.targets = result.targets;
					var choiceList = ["执行该军令"];
					if (target != player) choiceList.push("令" + get.translation(player) + "获得你所有手牌，然后交给你等量的牌");
					else choiceList.push("不执行该军令");
					target
						.chooseJunlingControl(player, result.junling, result.targets)
						.set("prompt", "伪帝")
						.set("choiceList", choiceList)
						.set("ai", function () {
							if (get.attitude(target, player) >= 0) return get.junlingEffect(player, result.junling, target, result.targets, target) >= 0 ? 0 : 1;
							return get.junlingEffect(player, result.junling, target, result.targets, target) >= -1 ? 0 : 1;
						});
					"step 2";
					if (result.index == 0) target.carryOutJunling(player, event.junling, targets);
					else if (target != player && target.countCards("h")) {
						event.num = target.countCards("h");
						player.gain(target.getCards("h"), target, "giveAuto");
						player.chooseCard("交给" + get.translation(target) + get.cnNumber(event.num) + "张牌", "he", event.num, true).set("ai", function (card) {
							return -get.value(card);
						});
					} else event.finish();
					"step 3";
					if (result.cards) {
						player.give(result.cards, target);
					}
				},
				group: ["gzweidi_ft", "gzweidi_ftc"],
				ai: {
					order: 3,
					result: {
						player: 1,
					},
				},
				subSkill: {
					ft: {
						sub: true,
						trigger: { global: "gainBefore" },
						silent: true,
						filter(event, player) {
							if (player == event.player || player.storage.gzweidi.includes(event.player) || _status.currentPhase != player) return false;
							if (event.cards.length) {
								if (event.getParent().name == "draw") return true;
								for (var i = 0; i < event.cards.length; i++) if (get.position(event.cards[i]) == "c" || (!get.position(event.cards[i]) && event.cards[i].original == "c")) return true;
							}
							return false;
						},
						content() {
							player.storage.gzweidi.push(trigger.player);
						},
					},
					ftc: {
						sub: true,
						trigger: { global: "phaseAfter" },
						silent: true,
						filter(event, player) {
							return event.player == player;
						},
						content() {
							player.storage.gzweidi = [];
						},
					},
				},
				audio: ["weidi", 2],
			},
			gzyongsi: {
				audio: "yongsi1",
				group: ["gzyongsi_eff1", "gzyongsi_eff2", "gzyongsi_eff3"],
				preHidden: ["gzyongsi_eff3"],
				ai: {
					threaten(player, target) {
						if (
							game.hasPlayer(function (current) {
								return current != target && current.getEquip("yuxi");
							})
						)
							return 0.5;
						return 2;
					},
					forceMajor: true,
					skillTagFilter() {
						return !game.hasPlayer(function (current) {
							return current.getEquip("yuxi");
						});
					},
				},
				subSkill: {
					eff1: {
						sub: true,
						equipSkill: true,
						noHidden: true,
						trigger: { player: "phaseDrawBegin2" },
						//priority:8,
						forced: true,
						filter(event, player) {
							if (event.numFixed || player.isDisabled(5)) return false;
							return !game.hasPlayer(function (current) {
								return current.getEquips("yuxi").length > 0;
							});
						},
						content() {
							trigger.num++;
						},
						audio: ["yongsi1", 2],
					},
					eff2: {
						sub: true,
						trigger: { player: "phaseUseBegin" },
						//priority:8,
						forced: true,
						noHidden: true,
						equipSkill: true,
						filter(event, player) {
							if (player.isDisabled(5)) return false;
							return (
								game.hasPlayer(function (current) {
									return player.canUse("zhibi", current);
								}) &&
								!game.hasPlayer(function (current) {
									return current.getEquips("yuxi").length > 0;
								})
							);
						},
						content() {
							player.chooseUseTarget("玉玺（庸肆）：选择知己知彼的目标", { name: "zhibi" });
						},
						audio: ["yongsi1", 2],
					},
					eff3: {
						sub: true,
						trigger: { global: "useCardToTargeted" },
						//priority:16,
						forced: true,
						filter(event, player) {
							return event.target && event.target == player && event.card && event.card.name == "zhibi";
						},
						check() {
							return false;
						},
						content() {
							player.showHandcards();
						},
					},
				},
			},
			gzfudi: {
				trigger: { global: "damageEnd" },
				direct: true,
				preHidden: true,
				audio: 2,
				filter(event, player) {
					return event.source && event.source.isAlive() && event.source != player && event.player == player && player.countCards("h") && event.num > 0;
				},
				content() {
					"step 0";
					var players = game.filterPlayer(function (current) {
						return (
							current.isFriendOf(trigger.source) &&
							current.hp >= player.hp &&
							!game.hasPlayer(function (current2) {
								return current2.hp > current.hp && current2.isFriendOf(trigger.source);
							})
						);
					});
					var check = true;
					if (!players.length) check = false;
					else {
						if (get.attitude(player, trigger.source) >= 0) check = false;
					}
					player
						.chooseCard(get.prompt("gzfudi", trigger.source), "交给其一张手牌，然后对其势力中体力值最大且不小于你的一名角色造成1点伤害")
						.set("aicheck", check)
						.set("ai", function (card) {
							if (!_status.event.aicheck) return 0;
							return 9 - get.value(card);
						})
						.setHiddenSkill(event.name);
					"step 1";
					if (result.bool) {
						player.logSkill("gzfudi", trigger.source);
						player.give(result.cards, trigger.source);
					} else event.finish();
					"step 2";
					var list = game.filterPlayer(function (current) {
						return (
							current.hp >= player.hp &&
							current.isFriendOf(trigger.source) &&
							!game.hasPlayer(function (current2) {
								return current2.hp > current.hp && current2.isFriendOf(trigger.source);
							})
						);
					});
					if (list.length) {
						if (list.length == 1) event._result = { bool: true, targets: list };
						else
							player
								.chooseTarget(true, "对" + get.translation(trigger.source) + "势力中体力值最大的一名角色造成1点伤害", function (card, player, target) {
									return _status.event.list.includes(target);
								})
								.set("list", list)
								.set("ai", function (target) {
									return get.damageEffect(target, player, player);
								});
					} else event.finish();
					"step 3";
					if (result.bool && result.targets.length) {
						player.line(result.targets[0]);
						result.targets[0].damage();
					}
				},
				ai: {
					maixie: true,
					maixie_defend: true,
					effect: {
						target(card, player, target) {
							if (get.tag(card, "damage") && target.hp > 1) {
								if (player.hasSkillTag("jueqing", false, target)) return [1, -2];
								if (!target.countCards("h")) return [1, -1];
								if (
									game.countPlayer(function (current) {
										return current.isFriendOf(player) && current.hp >= target.hp - 1;
									})
								)
									return [1, 0, 0, -2];
							}
						},
					},
				},
			},
			gzcongjian: {
				trigger: {
					player: "damageBegin3",
					source: "damageBegin1",
				},
				forced: true,
				preHidden: true,
				audio: "drlt_congjian",
				filter(event, player, name) {
					if (event.num <= 0) return false;
					if (name == "damageBegin1" && _status.currentPhase != player) return true;
					if (name == "damageBegin3" && _status.currentPhase == player) return true;
					return false;
				},
				check(event, player) {
					return _status.currentPhase != player;
				},
				content() {
					trigger.num++;
				},
			},
			jianan: {
				audio: true,
				unique: true,
				forceunique: true,
				derivation: ["wuziliangjiangdao", "new_retuxi", "qiaobian", "fakexiaoguo", "gzjieyue", "new_duanliang"],
				lordSkill: true,
				global: ["wuziliangjiangdao", "g_jianan"],
				init(player) {
					player.markSkill("wuziliangjiangdao");
				},
			},
			g_jianan: {
				trigger: {
					player: ["phaseZhunbeiBegin", "phaseBefore", "dieBegin"],
				},
				audio: "wuziliangjiangdao",
				forceaudio: true,
				filter(event, player, name) {
					if (name != "phaseZhunbeiBegin") return get.is.jun(player) && player.identity == "wei";
					return this.filter2.apply(this, arguments);
				},
				filter2(event, player) {
					if (!get.zhu(player, "jianan")) return false;
					if (!player.countCards("he")) return false;
					return !player.isUnseen();
				},
				direct: true,
				content() {
					"step 0";
					if (event.triggername != "phaseZhunbeiBegin") {
						event.trigger("jiananUpdate");
						event.finish();
						return;
					}
					var skills = ["new_retuxi", "qiaobian", "fakexiaoguo", "gzjieyue", "new_duanliang"];
					game.countPlayer(function (current) {
						if (current.hasSkill("new_retuxi")) skills.remove("new_retuxi");
						if (current.hasSkill("qiaobian")) skills.remove("qiaobian");
						if (current.hasSkill("fakexiaoguo")) skills.remove("fakexiaoguo");
						if (current.hasSkill("gzjieyue")) skills.remove("gzjieyue");
						if (current.hasSkill("new_duanliang")) skills.remove("new_duanliang");
					});
					if (!skills.length) event.finish();
					else {
						event.skills = skills;
						var next = player.chooseToDiscard("he");
						var str = "";
						for (var i = 0; i < skills.length; i++) {
							str += "、【";
							str += get.translation(skills[i]);
							str += "】";
						}
						next.set("prompt", "是否发动【五子良将纛】？");
						next.set("prompt2", get.translation("弃置一张牌并暗置一张武将牌，获得以下技能中的一个直到下回合开始：" + str.slice(1)));
						next.logSkill = "g_jianan";
						next.skills = skills;
						next.ai = function (card) {
							var skills = _status.event.skills;
							var player = _status.event.player;
							var rank = 0;
							if (
								skills.includes("new_retuxi") &&
								game.countPlayer(function (current) {
									return get.attitude(player, current) < 0 && current.countGainableCards(player, "h");
								}) > 1
							)
								rank = 4;
							if (
								skills.includes("gzjieyue") &&
								player.countCards("h", function (card) {
									return get.value(card) < 7;
								}) > 1
							)
								rank = 5;
							if (skills.includes("qiaobian") && player.countCards("h") > 4) rank = 6;
							if ((get.guozhanRank(player.name1, player) < rank && !player.isUnseen(0)) || (get.guozhanRank(player.name2, player) < rank && !player.isUnseen(1))) return rank + 1 - get.value(card);
							return -1;
						};
					}
					"step 1";
					if (!result.bool) event.finish();
					else {
						var list = ["主将", "副将"];
						if (player.isUnseen(0) || get.is.jun(player)) list.remove("主将");
						if (player.isUnseen(1)) list.remove("副将");
						if (!list.length) event.goto(3);
						else if (list.length < 2) event._result = { control: list[0] };
						else {
							player.chooseControl(list).set("ai", function () {
								return get.guozhanRank(player.name1, player) < get.guozhanRank(player.name2, player) ? "主将" : "副将";
							}).prompt = "请选择暗置一张武将牌";
						}
					}
					"step 2";
					if (!result.control) event.finish();
					else {
						var num = result.control == "主将" ? 0 : 1;
						player.hideCharacter(num);
					}
					"step 3";
					player
						.chooseControl(event.skills)
						.set("ai", function () {
							var skills = event.skills;
							if (skills.includes("qiaobian") && player.countCards("h") > 3) return "qiaobian";
							if (
								skills.includes("gzjieyue") &&
								player.countCards("h", function (card) {
									return get.value(card) < 7;
								})
							)
								return "gzjieyue";
							if (skills.includes("new_retuxi")) return "new_retuxi";
							return skills.randomGet();
						})
						.set("prompt", "选择获得其中的一个技能直到君主的回合开始");
					"step 4";
					var link = result.control;
					player.addTempSkill(link, "jiananUpdate");
					player.addTempSkill("jianan_eff", "jiananUpdate");
					game.log(player, "获得了技能", "#g【" + get.translation(result.control) + "】");

					// 语音修复
					var map = {
						new_retuxi: "jianan_tuxi",
						qiaobian: "jianan_qiaobian",
						fakexiaoguo: "jianan_xiaoguo",
						gzjieyue: "jianan_jieyue",
						new_duanliang: "jianan_duanliang",
					};
					var mapSkills = map[link];
					game.broadcastAll(function () {
						var info = lib.skill[link];
						if (!info.audioname2) info.audioname2 = {};
						info.audioname2[player.name1] = mapSkills;
						info.audioname2[player.name2] = mapSkills;
					}, link);
				},
			},
			jianan_eff: {
				ai: { nomingzhi: true },
			},
			jianan_tuxi: { audio: true },
			jianan_qiaobian: { audio: true },
			jianan_xiaoguo: { audio: true },
			jianan_jieyue: { audio: true },
			jianan_duanliang: { audio: true },
			huibian: {
				enable: "phaseUse",
				audio: 2,
				usable: 1,
				filter(event, player) {
					return (
						game.countPlayer(function (current) {
							return current.identity == "wei";
						}) > 1 &&
						game.hasPlayer(function (current) {
							return current.isDamaged() && current.identity == "wei";
						})
					);
				},
				filterTarget(card, player, target) {
					if (ui.selected.targets.length) return target.isDamaged() && target.identity == "wei";
					return target.identity == "wei";
				},
				selectTarget: 2,
				multitarget: true,
				targetprompt: ["受到伤害</br>然后摸牌", "回复体力"],
				content() {
					"step 0";
					targets[0].damage(player);
					"step 1";
					if (targets[0].isAlive()) targets[0].draw(2);
					targets[1].recover();
				},
				ai: {
					threaten: 1.2,
					order: 9,
					result: {
						target(player, target) {
							if (ui.selected.targets.length) return 1;
							if (get.damageEffect(target, player, player) > 0) return 2;
							if (target.hp > 2) return 1;
							if (target.hp == 1) return -1;
							return 0.1;
						},
					},
				},
			},
			gzzongyu: {
				audio: 2,
				derivation: "liulongcanjia",
				unique: true,
				forceunique: true,
				group: "gzzongyu_others",
				global: "gzzongyu_player",
				ai: {
					threaten: 1.2,
				},
				subSkill: {
					others: {
						trigger: { global: "equipAfter" },
						direct: true,
						filter(event, player) {
							if (event.player == player || !player.countCards("e", { subtype: ["equip3", "equip4"] })) return false;
							return event.card.name == "liulongcanjia";
						},
						check(event, player) {
							if (get.attitude(player, target) <= 0) return player.countCards("e", { subtype: ["equip4", "equip4"] }) < 2;
							return true;
						},
						content() {
							"step 0";
							player.chooseBool("是否发动【总御】，与" + get.translation(trigger.player) + "交换装备区内坐骑牌？");
							"step 1";
							if (result.bool) {
								player.logSkill("gzzongyu", trigger.player);
								event.cards = [player.getCards("e", { subtype: ["equip3", "equip4"] }), trigger.player.getCards("e", { name: "liulongcanjia" })];
								player.lose(event.cards[0], ui.special);
								trigger.player.lose(event.cards[1], ui.special);
								if (event.cards[0].length) player.$give(event.cards[0], trigger.player);
								if (event.cards[1].length) trigger.player.$give(event.cards[1], player);
							} else event.finish();
							"step 2";
							for (var i = 0; i < event.cards[1].length; i++) player.equip(event.cards[1][i]);
							for (var i = 0; i < event.cards[0].length; i++) trigger.player.equip(event.cards[0][i]);
						},
					},
					player: {
						audio: "gzzongyu",
						forceaudio: true,
						trigger: { player: "equipAfter" },
						forced: true,
						filter(event, player) {
							// if (!player.hasSkill("gzzongyu")) return false;
							// 村规
							if (!player.hasSkill("gzzongyu", null, null, false)) return false;
							if (!["equip3", "equip4"].includes(get.subtype(event.card))) return false;
							for (var i = 0; i < ui.discardPile.childElementCount; i++) {
								if (ui.discardPile.childNodes[i].name == "liulongcanjia") return true;
							}
							return game.hasPlayer(function (current) {
								return current != player && current.countCards("ej", "liulongcanjia");
							});
						},
						content() {
							var list = [];
							for (var i = 0; i < ui.discardPile.childElementCount; i++) {
								if (ui.discardPile.childNodes[i].name == "liulongcanjia") {
									list.add(ui.discardPile.childNodes[i]);
								}
							}
							game.countPlayer(function (current) {
								if (current != player) {
									var ej = current.getCards("ej", "liulongcanjia");
									if (ej.length) {
										list.addArray(ej);
									}
								}
							});
							if (list.length) {
								var card = list.randomGet();
								var owner = get.owner(card);
								if (owner) {
									player.line(owner, "green");
									owner.$give(card, player);
								} else player.$gain(card, "log");
								player.equip(card);
							}
						},
					},
				},
			},
			wuziliangjiangdao: {
				audio: 2,
				nopop: true,
				unique: true,
				forceunique: true,
				mark: true,
				intro: {
					content() {
						return get.translation("wuziliangjiangdao_info");
					},
				},
			},

			gzzhengbi: {
				audio: "zhengbi",
				trigger: { player: "phaseUseBegin" },
				filter(event, player) {
					//if(event.player!=player) return false;
					return (
						game.hasPlayer(function (current) {
							return current != player && current.identity == "unknown";
						}) || player.countCards("h", { type: "basic" })
					);
				},
				check(event, player) {
					if (
						player.countCards("h", function (card) {
							return get.value(card) < 7;
						})
					) {
						if (player.isUnseen()) return Math.random() > 0.7;
						return true;
					}
				},
				preHidden: true,
				content() {
					"step 0";
					var choices = [];
					if (
						game.hasPlayer(function (current) {
							return current.isUnseen();
						})
					)
						choices.push("选择一名未确定势力的角色");
					if (
						game.hasPlayer(function (current) {
							return current != player && !current.isUnseen();
						}) &&
						player.countCards("h", { type: "basic" })
					)
						choices.push("将一张基本牌交给一名已确定势力的角色");
					if (choices.length == 1) {
						event._result = { index: choices[0] == "选择一名未确定势力的角色" ? 0 : 1 };
					} else
						player
							.chooseControl()
							.set("ai", function () {
								if (choices.length > 1) {
									var player = _status.event.player;
									if (
										!game.hasPlayer(function (current) {
											return (
												(!current.isUnseen() && current.getEquip("yuxi")) ||
												(current.hasSkill("gzyongsi") &&
													!game.hasPlayer(function (current) {
														return current.getEquips("yuxi").length > 0;
													}))
											);
										}) &&
										game.hasPlayer(function (current) {
											return current != player && current.isUnseen();
										})
									) {
										var identity;
										for (var i = 0; i < game.players; i++) {
											if (game.players[i].isMajor()) {
												identity = game.players[i].identity;
												break;
											}
										}
									}
									if (!player.isUnseen() && player.identity != identity && get.population(player.identity) + 1 >= get.population(identity)) return 0;
									return 1;
								}
								return 0;
							})
							.set("prompt", "征辟：请选择一项")
							.set("choiceList", choices);
					"step 1";
					if (result.index == 0)
						player.chooseTarget(
							"请选择一名未确定势力的角色",
							function (card, player, target) {
								return target != player && target.identity == "unknown";
							},
							true
						);
					else
						player
							.chooseCardTarget({
								prompt: "请将一张基本牌交给一名已确定势力的其他角色",
								position: "h",
								filterCard(card) {
									return get.type(card) == "basic";
								},
								filterTarget(card, player, target) {
									return target != player && target.identity != "unknown";
								},
								ai1(card) {
									return 5 - get.value(card);
								},
								ai2(target) {
									var player = _status.event.player;
									var att = get.attitude(player, target);
									if (att > 0) return 0;
									return -(att - 1) / target.countCards("h");
								},
							})
							.set("forced", true);
					"step 2";
					event.target = result.targets[0];
					player.line(result.targets, "green");
					if (result.cards.length) {
						event.cards = result.cards;
						player.give(result.cards, result.targets[0]);
					} else {
						player.storage.gzzhengbi_eff1 = result.targets[0];
						player.addTempSkill("gzzhengbi_eff1", "phaseUseAfter");
						event.finish();
					}
					"step 3";
					var choices = [];
					if (target.countCards("he", { type: ["trick", "delay", "equip"] })) choices.push("一张非基本牌");
					if (target.countCards("h", { type: "basic" }) > 1) choices.push("两张基本牌");
					if (choices.length)
						target
							.chooseControl(choices)
							.set("ai", function (event, player) {
								if (choices.length > 1) {
									if (
										player.countCards("he", { type: ["trick", "delay", "equip"] }, function (card) {
											return get.value(card) < 7;
										})
									)
										return 0;
									return 1;
								}
								return 0;
							})
							.set("prompt", "征辟：交给" + get.translation(player) + "…</div>");
					else {
						if (target.countCards("h")) {
							var cards = target.getCards("h");
							target.give(cards, player);
							event.finish();
						} else event.finish();
					}
					"step 4";
					var check = result.control == "一张非基本牌";
					target.chooseCard("he", check ? 1 : 2, { type: check ? ["trick", "delay", "equip"] : "basic" }, true);
					"step 5";
					if (result.cards) {
						target.give(result.cards, player);
					}
				},
				subSkill: {
					eff1: {
						audio: "zhengbi",
						sub: true,
						onremove: true,
						trigger: { player: "phaseUseEnd" },
						forced: true,
						charlotte: true,
						filter(event, player) {
							var target = player.storage.gzzhengbi_eff1;
							return target && !target.isUnseen() && target.countGainableCards(player, "he") > 0;
						},
						logTarget(event, player) {
							return player.storage.gzzhengbi_eff1;
						},
						content() {
							var num = 0;
							var target = player.storage.gzzhengbi_eff1;
							if (target.countGainableCards(player, "h")) num++;
							if (target.countGainableCards(player, "e")) num++;
							if (num) {
								player.gainPlayerCard(target, num, "he", true).set("filterButton", function (button) {
									for (var i = 0; i < ui.selected.buttons.length; i++) {
										if (get.position(button.link) == get.position(ui.selected.buttons[i].link)) return false;
									}
									return true;
								});
							}
						},
					},
				},
			},
			gzfengying: {
				audio: "fengying",
				limited: true,
				enable: "phaseUse",
				position: "h",
				filterCard: true,
				selectCard: -1,
				filter(event, player) {
					return !player.storage.gzfengying && player.countCards("h") > 0;
				},
				filterTarget(card, player, target) {
					return target == player;
				},
				selectTarget: -1,
				discard: false,
				lose: false,
				content() {
					"step 0";
					player.awakenSkill("gzfengying");
					player.storage.gzfengying = true;
					player.useCard({ name: "xietianzi" }, cards, target);
					"step 1";
					var list = game.filterPlayer(function (current) {
						return current.isFriendOf(player) && current.countCards("h") < current.maxHp;
					});
					list.sort(lib.sort.seat);
					player.line(list, "thunder");
					game.asyncDraw(list, function (current) {
						return current.maxHp - current.countCards("h");
					});
				},
				skillAnimation: "epic",
				animationColor: "gray",
				ai: {
					order: 0.1,
					result: {
						player(player) {
							var value = 0;
							var cards = player.getCards("h");
							if (cards.length >= 4) return 0;
							for (var i = 0; i < cards.length; i++) {
								value += Math.max(0, get.value(cards[i], player, "raw"));
							}
							var targets = game.filterPlayer(function (current) {
								return current.isFriendOf(player) && current != player;
							});
							var eff = 0;
							for (var i = 0; i < targets.length; i++) {
								var num = targets[i].countCards("h") < targets[i].maxHp;
								if (num <= 0) continue;
								eff += num;
							}
							return 5 * eff - value;
						},
					},
				},
			},

			junling4_eff: {
				mod: {
					cardEnabled2(card) {
						if (get.position(card) == "h") return false;
					},
				},
				mark: true,
				marktext: "令",
				intro: {
					content: "不能使用或打出手牌",
				},
			},
			junling5_eff: {
				trigger: { player: "recoverBefore" },
				priority: 44,
				forced: true,
				silent: true,
				popup: false,
				content() {
					trigger.cancel();
				},
				mark: true,
				marktext: "令",
				intro: {
					content: "不能回复体力",
				},
				ai: {
					effect: {
						target(card, player, target) {
							if (get.tag(card, "recover")) return "zeroplayertarget";
						},
					},
				},
			},

			gzjieyue: {
				trigger: { player: "phaseZhunbeiBegin" },
				filter(event, player) {
					return (
						player.countCards("h") &&
						game.hasPlayer(function (current) {
							return current != player && current.identity != "wei";
						})
					);
				},
				direct: true,
				preHidden: true,
				content() {
					"step 0";
					player
						.chooseCardTarget({
							prompt: get.prompt2("gzjieyue"),
							position: "h",
							filterCard: true,
							filterTarget(card, player, target) {
								return target.identity != "wei" && target != player;
							},
							ai1(card, player, target) {
								if (get.attitude(player, target) > 0) return 11 - get.value(card);
								return 7 - get.value(card);
							},
							ai2(target) {
								var att = get.attitude(get.event().player, target);
								if (att < 0) return -att;
								return 1;
							},
						})
						.setHiddenSkill("gzjieyue");
					"step 1";
					if (result.bool) {
						event.target = result.targets[0];
						player.logSkill("gzjieyue", result.targets);
						player.give(result.cards[0], result.targets[0]);
						player.chooseJunlingFor(result.targets[0]);
					} else event.finish();
					"step 2";
					event.junling = result.junling;
					event.targets = result.targets;
					var choiceList = [];
					choiceList.push("执行该军令，然后" + get.translation(player) + "摸一张牌");
					choiceList.push("令" + get.translation(player) + "摸牌阶段额外摸三张牌");
					target
						.chooseJunlingControl(player, result.junling, result.targets)
						.set("prompt", "节钺")
						.set("choiceList", choiceList)
						.set("ai", function () {
							if (get.attitude(target, player) > 0) return get.junlingEffect(player, result.junling, target, result.targets, target) > 1 ? 0 : 1;
							return get.junlingEffect(player, result.junling, target, result.targets, target) >= -1 ? 0 : 1;
						});
					"step 3";
					if (result.index == 0) {
						target.carryOutJunling(player, event.junling, targets);
						player.draw();
					} else player.addTempSkill("gzjieyue_eff");
				},
				ai: { threaten: 2 },
				subSkill: {
					eff: {
						sub: true,
						trigger: { player: "phaseDrawBegin2" },
						filter(event, player) {
							return !event.numFixed;
						},
						forced: true,
						popup: false,
						content() {
							trigger.num += 3;
						},
					},
				},
				audio: ["jieyue", 2],
				audioname2: { gz_jun_caocao: "jianan_jieyue" },
			},

			jianglue: {
				limited: true,
				audio: 2,
				enable: "phaseUse",
				prepare(cards, player) {
					var targets = game.filterPlayer(function (current) {
						return current.isFriendOf(player) || current.isUnseen();
					});
					player.line(targets, "fire");
				},
				content() {
					"step 0";
					player.awakenSkill("jianglue");
					player.addTempSkill("jianglue_count");
					player.chooseJunlingFor(player).set("prompt", "选择一张军令牌，令与你势力相同的其他角色选择是否执行");
					"step 1";
					event.junling = result.junling;
					event.targets = result.targets;
					event.players = game
						.filterPlayer(function (current) {
							if (current == player) return false;
							return current.isFriendOf(player) || (player.identity != "ye" && current.isUnseen());
						})
						.sort(lib.sort.seat);
					event.num = 0;
					event.filterName = function (name) {
						return lib.character[name][1] == player.identity && !get.is.double(name);
					};
					"step 2";
					if (num < event.players.length) event.current = event.players[num];
					if (event.current && event.current.isAlive()) {
						event.showCharacter = false;
						var choiceList = ["执行该军令，增加1点体力上限，然后回复1点体力", "不执行该军令"];
						if (event.current.isFriendOf(player))
							event.current
								.chooseJunlingControl(player, event.junling, targets)
								.set("prompt", "将略")
								.set("choiceList", choiceList)
								.set("ai", function () {
									if (event.junling == "junling6" && (event.current.countCards("h") > 3 || event.current.countCards("e") > 2)) return 1;
									return event.junling == "junling5" ? 1 : 0;
								});
						else if ((event.filterName(event.current.name1) || event.filterName(event.current.name2)) && event.current.wontYe(player.identity)) {
							event.showCharacter = true;
							choiceList[0] = "明置一张武将牌以" + choiceList[0];
							choiceList[1] = "不明置武将牌且" + choiceList[1];
							event.current
								.chooseJunlingControl(player, event.junling, targets)
								.set("prompt", "将略")
								.set("choiceList", choiceList)
								.set("ai", function () {
									if (event.junling == "junling6" && (event.current.countCards("h") > 3 || event.current.countCards("e") > 2)) return 1;
									return event.junling == "junling5" ? 1 : 0;
								});
						} else event.current.chooseJunlingControl(player, event.junling, targets).set("prompt", "将略").set("controls", ["ok"]);
					} else event.goto(4);
					"step 3";
					event.carry = false;
					if (result.index == 0 && result.control != "ok") {
						event.carry = true;
						if (event.showCharacter) {
							var list = [];
							if (event.filterName(event.current.name1)) list.push("主将");
							if (event.filterName(event.current.name2)) list.push("副将");
							if (list.length > 1)
								event.current.chooseControl(["主将", "副将"]).set("ai", function () {
									let player = _status.event.player;
									if (get.character(player.name1, 3).includes("gzxuanhuo")) return 0;
									if (get.character(player.name2, 3).includes("gzxuanhuo")) return 1;
									return Math.random() > 0.5 ? 0 : 1;
								}).prompt = "选择并展示一张武将牌，然后执行军令";
							else event._result = { index: list[0] == "主将" ? 0 : 1 };
						}
					}
					"step 4";
					if (!event.list) event.list = [player];
					if (event.carry) {
						if (event.showCharacter) event.current.showCharacter(result.index);
						event.current.carryOutJunling(player, event.junling, targets);
						event.list.push(event.current);
					}
					event.num++;
					if (event.num < event.players.length) event.goto(2);
					"step 5";
					event.num = 0;
					player.storage.jianglue_count = 0;
					"step 6";
					if (event.list[num].isAlive()) {
						event.list[num].gainMaxHp(true);
						event.list[num].recover();
					}
					event.num++;
					"step 7";
					if (event.num < event.list.length) event.goto(6);
					else if (player.storage.jianglue_count > 0) player.draw(player.storage.jianglue_count);
				},
				marktext: "略",
				skillAnimation: "epic",
				animationColor: "soil",
				ai: {
					order: 10,
					result: {
						player(player) {
							if (player.isUnseen() && player.wontYe()) {
								if (get.population(player.group) >= game.players.length / 4) return 1;
								return Math.random() > 0.7 ? 1 : 0;
							} else return 1;
						},
					},
				},
				subSkill: {
					count: {
						sub: true,
						trigger: { global: "recoverAfter" },
						silent: true,
						filter(event) {
							return event.getParent("jianglue");
						},
						content() {
							player.storage.jianglue_count++;
						},
					},
				},
			},
			gzxuanhuo: {
				audio: "xinxuanhuo",
				global: "gzxuanhuo_others",
				derivation: ["fz_wusheng", "fz_new_paoxiao", "fz_new_longdan", "fz_new_tieji", "fz_liegong", "fz_xinkuanggu"],
				ai: {
					threaten(player, target) {
						if (
							game.hasPlayer(function (current) {
								return current != target && current.isFriendOf(target);
							})
						)
							return 1.5;
						return 0.5;
					},
				},
				subSkill: {
					others: {
						audio: "xinxuanhuo",
						forceaudio: true,
						enable: "phaseUse",
						usable: 1,
						filter(event, player) {
							return (
								!player.isUnseen() &&
								player.countCards("h") > 0 &&
								game.hasPlayer(function (current) {
									return current != player && current.hasSkill("gzxuanhuo") && player.isFriendOf(current);
								})
							);
						},
						prompt: "弃置一张手牌，然后获得以下技能中的一个：〖武圣〗〖咆哮〗〖龙胆〗〖铁骑〗〖烈弓〗〖狂骨〗",
						position: "h",
						filterCard: true,
						check(card) {
							let player = _status.event.player,
								shas = player.countCards("h", cardx => {
									return cardx != card && cardx.name == "sha" && player.hasUseTarget(cardx);
								}),
								count = player.getCardUsable("sha"),
								val = (get.name(card) == "sha" ? 2 : 1) * get.value(card);
							if (!shas || count - shas > 1) return (player.needsToDiscard() ? 7 : 1) - val;
							return 7 - val;
						},
						content() {
							"step 0";
							var list = ["new_rewusheng", "gzpaoxiao", "new_longdan", "new_tieji", "liegong", "xinkuanggu"];
							player
								.chooseControl(list)
								.set("ai", function () {
									let res = get.event().res;
									if (list.includes(res)) return res;
									return 0;
								})
								.set(
									"res",
									(function () {
										let shas = player.mayHaveSha(player, "use", null, "count"),
											count = player.getCardUsable("sha");
										if (shas > count) return "gzpaoxiao";
										if (shas < count) return "new_rewusheng";
										if (!shas) return "xinkuanggu";
										return ["new_longdan", "new_tieji", "liegong"].randomGet(); //脑子不够用了
									})()
								)
								.set("prompt", "选择并获得一项技能直到回合结束");
							"step 1";
							player.popup(result.control);
							var map = {
								new_rewusheng: "fz_wusheng",
								gzpaoxiao: "fz_new_paoxiao",
								new_longdan: "fz_new_longdan",
								new_tieji: "fz_new_tieji",
								liegong: "fz_liegong",
								xinkuanggu: "fz_xinkuanggu",
							};
							player.addTempSkill(map[result.control]);
							game.log(player, "获得了技能", "#g【" + get.translation(result.control) + "】");
							game.delay();
						},
						// forceaudio:true,
						// audio:['xuanhuo',2],
						ai: {
							order: 8,
							result: { player: 1 },
						},
					},
					//used:{},
				},
				// audio:['xuanhuo',2],
			},
			fz_new_paoxiao: {
				audio: true,
				inherit: "gzpaoxiao",
			},
			fz_new_tieji: {
				audio: true,
				inherit: "new_tieji",
			},
			fz_wusheng: {
				audio: true,
				inherit: "new_rewusheng",
			},
			fz_liegong: {
				audio: true,
				inherit: "liegong",
			},
			fz_xinkuanggu: {
				audio: true,
				inherit: "xinkuanggu",
			},
			fz_new_longdan: {
				audio: true,
				group: ["fz_new_longdan_sha", "fz_new_longdan_shan", "fz_new_longdan_draw", "fz_new_longdan_shamiss", "fz_new_longdan_shanafter"],
				subSkill: {
					shanafter: {
						sub: true,
						audio: "fz_new_longdan",
						trigger: {
							player: "useCard",
						},
						//priority:1,
						filter(event, player) {
							return event.skill == "fz_new_longdan_shan" && event.getParent(2).name == "sha";
						},
						direct: true,
						content() {
							"step 0";
							player
								.chooseTarget("是否发动【龙胆】令一名其他角色回复1点体力？", function (card, player, target) {
									return target != _status.event.source && target != player && target.isDamaged();
								})
								.set("ai", function (target) {
									return get.attitude(_status.event.player, target);
								})
								.set("source", trigger.getParent(2).player);
							"step 1";
							if (result.bool && result.targets && result.targets.length) {
								player.logSkill("fz_new_longdan", result.targets[0]);
								result.targets[0].recover();
							}
						},
					},
					shamiss: {
						sub: true,
						audio: "fz_new_longdan",
						trigger: {
							player: "shaMiss",
						},
						direct: true,
						filter(event, player) {
							return event.skill == "fz_new_longdan_sha";
						},
						content() {
							"step 0";
							player
								.chooseTarget("是否发动【龙胆】对一名其他角色造成1点伤害？", function (card, player, target) {
									return target != _status.event.target && target != player;
								})
								.set("ai", function (target) {
									return -get.attitude(_status.event.player, target);
								})
								.set("target", trigger.target);
							"step 1";
							if (result.bool && result.targets && result.targets.length) {
								player.logSkill("fz_new_longdan", result.targets[0]);
								result.targets[0].damage();
							}
						},
					},
					draw: {
						trigger: {
							player: ["useCard", "respond"],
						},
						audio: "fz_new_longdan",
						forced: true,
						locked: false,
						filter(event, player) {
							if (!get.zhu(player, "shouyue")) return false;
							return event.skill == "fz_new_longdan_sha" || event.skill == "fz_new_longdan_shan";
						},
						content() {
							player.draw();
							//player.storage.fanghun2++;
						},
						sub: true,
					},
					sha: {
						audio: "fz_new_longdan",
						enable: ["chooseToUse", "chooseToRespond"],
						filterCard: {
							name: "shan",
						},
						viewAs: {
							name: "sha",
						},
						viewAsFilter(player) {
							if (!player.countCards("hs", "shan")) return false;
						},
						prompt: "将一张闪当杀使用或打出",
						position: "hs",
						check() {
							return 1;
						},
						ai: {
							effect: {
								target(card, player, target, current) {
									if (get.tag(card, "respondSha") && current < 0) return 0.6;
								},
							},
							respondSha: true,
							skillTagFilter(player) {
								if (!player.countCards("hs", "shan")) return false;
							},
							order() {
								return get.order({ name: "sha" }) + 0.1;
							},
						},
						sub: true,
					},
					shan: {
						audio: "fz_new_longdan",
						enable: ["chooseToRespond", "chooseToUse"],
						filterCard: {
							name: "sha",
						},
						viewAs: {
							name: "shan",
						},
						position: "hs",
						prompt: "将一张杀当闪使用或打出",
						check() {
							return 1;
						},
						viewAsFilter(player) {
							if (!player.countCards("hs", "sha")) return false;
						},
						ai: {
							respondShan: true,
							skillTagFilter(player) {
								if (!player.countCards("hs", "sha")) return false;
							},
							effect: {
								target(card, player, target, current) {
									if (get.tag(card, "respondShan") && current < 0) return 0.6;
								},
							},
						},
						sub: true,
					},
				},
			},
			gzenyuan: {
				locked: true,
				audio: "xinenyuan",
				group: ["gzenyuan_gain", "gzenyuan_damage"],
				preHidden: true,
				ai: {
					maixie_defend: true,
					effect: {
						target(card, player, target) {
							if (player.hasSkillTag("jueqing", false, target)) return [1, -1.5];
							if (!target.hasFriend()) return;
							if (get.tag(card, "damage")) return [1, 0, 0, -0.7];
						},
					},
				},
				subSkill: {
					gain: {
						audio: "xinenyuan",
						trigger: { target: "useCardToTargeted" },
						forced: true,
						filter(event, player) {
							return event.card.name == "tao" && event.player != player;
						},
						logTarget: "player",
						content() {
							trigger.player.draw();
						},
					},
					damage: {
						audio: "xinenyuan",
						trigger: { player: "damageEnd" },
						forced: true,
						filter(event, player) {
							return event.source && event.source != player && event.num > 0;
						},
						content() {
							"step 0";
							player.logSkill("enyuan_damage", trigger.source);
							trigger.source.chooseCard("交给" + get.translation(player) + "一张手牌，或失去1点体力", "h").set("ai", function (card) {
								if (get.attitude(_status.event.player, _status.event.getParent().player) > 0) return 11 - get.value(card);
								return 7 - get.value(card);
							});
							"step 1";
							if (result.bool) {
								trigger.source.give(result.cards[0], player, "giveAuto");
							} else trigger.source.loseHp();
						},
					},
				},
			},

			gzjushou: {
				audio: "xinjushou",
				trigger: {
					player: "phaseJieshuBegin",
				},
				preHidden: true,
				content() {
					"step 0";
					var list = [],
						players = game.filterPlayer();
					for (var target of players) {
						if (target.isUnseen()) continue;
						var add = true;
						for (var i of list) {
							if (i.isFriendOf(target)) {
								add = false;
								break;
							}
						}
						if (add) list.add(target);
					}
					event.num = list.length;
					player.draw(event.num);
					if (event.num > 2) player.turnOver();
					"step 1";
					player
						.chooseCard("h", true, "弃置一张手牌，若以此法弃置的是装备牌，则你改为使用之")
						.set("ai", function (card) {
							if (get.type(card) == "equip") {
								return 5 - get.value(card);
							}
							return -get.value(card);
						})
						.set("filterCard", lib.filter.cardDiscardable);
					"step 2";
					if (result.bool && result.cards.length) {
						if (get.type(result.cards[0]) == "equip" && player.hasUseTarget(result.cards[0])) {
							player.chooseUseTarget(result.cards[0], true, "nopopup");
						} else {
							player.discard(result.cards[0]);
						}
					}
				},
			},
			new_duanliang: {
				subSkill: {
					off: {
						sub: true,
					},
				},
				mod: {
					targetInRange(card, player, target) {
						if (card.name == "bingliang") {
							return true;
						}
					},
				},
				locked: false,
				audio: "duanliang1",
				audioname2: { gz_jun_caocao: "jianan_duanliang" },
				enable: "chooseToUse",
				filterCard(card) {
					if (get.type(card) != "basic" && get.type(card) != "equip") return false;
					return get.color(card) == "black";
				},
				filter(event, player) {
					if (player.hasSkill("new_duanliang_off")) return false;
					return player.countCards("hes", { type: ["basic", "equip"], color: "black" });
				},
				position: "hes",
				viewAs: {
					name: "bingliang",
				},
				onuse(result, player) {
					if (get.distance(player, result.targets[0]) > 2) player.addTempSkill("new_duanliang_off");
				},
				prompt: "将一黑色的基本牌或装备牌当兵粮寸断使用",
				check(card) {
					return 6 - get.value(card);
				},
				ai: {
					order: 9,
					basic: {
						order: 1,
						useful: 1,
						value: 4,
					},
					result: {
						target(player, target) {
							if (target.hasJudge("caomu")) return 0;
							return -1.5 / Math.sqrt(target.countCards("h") + 1);
						},
					},
					tag: {
						skip: "phaseDraw",
					},
				},
			},
			new_shushen: {
				audio: "shushen",
				trigger: {
					player: "recoverAfter",
				},
				direct: true,
				preHidden: true,
				content() {
					"step 0";
					event.num = trigger.num || 1;
					"step 1";
					player
						.chooseTarget(get.prompt2("new_shushen"), function (card, player, target) {
							return target != player;
						})
						.set("ai", function (target) {
							return get.attitude(_status.event.player, target);
						})
						.setHiddenSkill("new_shushen");
					"step 2";
					if (result.bool) {
						player.logSkill("new_shushen", result.targets);
						result.targets[0].draw();
						if (event.num > 1) {
							event.num--;
							event.goto(1);
						}
					}
				},
				ai: {
					threaten: 0.8,
					expose: 0.1,
				},
			},
			new_luanji: {
				audio: "luanji",
				enable: "phaseUse",
				viewAs: {
					name: "wanjian",
				},
				filterCard(card, player) {
					if (!player.storage.new_luanji) return true;
					return !player.storage.new_luanji.includes(get.suit(card));
				},
				selectCard: 2,
				position: "hs",
				filter(event, player) {
					return (
						player.countCards("hs", function (card) {
							return !player.storage.new_luanji || !player.storage.new_luanji.includes(get.suit(card));
						}) > 1
					);
				},
				check(card) {
					var player = _status.event.player;
					var targets = game.filterPlayer(function (current) {
						return player.canUse("wanjian", current);
					});
					var num = 0;
					for (var i = 0; i < targets.length; i++) {
						var eff = get.sgn(get.effect(targets[i], { name: "wanjian" }, player, player));
						if (targets[i].hp == 1) {
							eff *= 1.5;
						}
						num += eff;
					}
					if (!player.needsToDiscard(-1)) {
						if (targets.length >= 7) {
							if (num < 2) return 0;
						} else if (targets.length >= 5) {
							if (num < 1.5) return 0;
						}
					}
					return 6 - get.value(card);
				},
				group: ["new_luanji_count", "new_luanji_reset", "new_luanji_respond"],
				subSkill: {
					reset: {
						trigger: {
							player: "phaseAfter",
						},
						silent: true,
						filter(event, player) {
							return player.storage.new_luanji ? true : false;
						},
						content() {
							delete player.storage.new_luanji;
						},
						sub: true,
						forced: true,
						popup: false,
					},
					count: {
						trigger: {
							player: "useCard",
						},
						silent: true,
						filter(event) {
							return event.skill == "new_luanji";
						},
						content() {
							if (!player.storage.new_luanji) {
								player.storage.new_luanji = [];
							}
							for (var i = 0; i < trigger.cards.length; i++) {
								player.storage.new_luanji.add(get.suit(trigger.cards[i]));
							}
						},
						sub: true,
						forced: true,
						popup: false,
					},
					respond: {
						trigger: {
							global: "respond",
						},
						silent: true,
						filter(event) {
							if (event.player.isUnseen()) return false;
							return event.getParent(2).skill == "new_luanji" && event.player.isFriendOf(_status.currentPhase);
						},
						content() {
							trigger.player.draw();
						},
						sub: true,
						forced: true,
						popup: false,
					},
				},
			},
			new_qingcheng: {
				audio: "qingcheng",
				enable: "phaseUse",
				filter(event, player) {
					return (
						player.countCards("he", { color: "black" }) &&
						game.hasPlayer(function (current) {
							return current != player && !current.isUnseen(2);
						})
					);
				},
				filterCard: {
					color: "black",
				},
				position: "he",
				filterTarget(card, player, target) {
					if (target == player) return false;
					return !target.isUnseen(2);
				},
				check(card) {
					return 6 - get.value(card, _status.event.player);
				},
				content() {
					"step 0";
					event.target = target;
					event.done = false;
					"step 1";
					if (get.is.jun(event.target)) {
						event._result = { control: "副将" };
					} else {
						var choice = "主将";
						var skills = lib.character[event.target.name2][3];
						for (var i = 0; i < skills.length; i++) {
							var info = get.info(skills[i]);
							if (info && info.ai && info.ai.maixie) {
								choice = "副将";
								break;
							}
						}
						if (get.character(event.target.name, 3).includes("buqu")) {
							choice = "主将";
						} else if (get.character(event.target.name2, 3).includes("buqu")) {
							choice = "副将";
						}
						player
							.chooseControl("主将", "副将", function () {
								return _status.event.choice;
							})
							.set("prompt", "暗置" + get.translation(event.target) + "的一张武将牌")
							.set("choice", choice);
					}
					"step 2";
					if (result.control == "主将") {
						event.target.hideCharacter(0);
					} else {
						event.target.hideCharacter(1);
					}
					event.target.addTempSkill("qingcheng_ai");
					if (get.type(cards[0]) == "equip" && !event.done) {
						player
							.chooseTarget("是否暗置一名武将牌均为明置的角色的一张武将牌？", function (card, player, target) {
								return target != player && !target.isUnseen(2);
							})
							.set("ai", function (target) {
								return -get.attitude(_status.event.player, target);
							});
					} else event.finish();
					"step 3";
					if (result.bool && result.targets && result.targets.length) {
						player.line(result.targets[0], "green");
						event.done = true;
						event.target = result.targets[0];
						event.goto(1);
					}
				},
				ai: {
					order: 8,
					result: {
						target(player, target) {
							if (target.hp <= 0) return -5;
							if (player.getStat().skill.new_qingcheng) return 0;
							if (!target.hasSkillTag("maixie")) return 0;
							if (get.attitude(player, target) >= 0) return 0;
							if (
								player.hasCard(function (card) {
									return get.tag(card, "damage") && player.canUse(card, target, true, true);
								})
							) {
								if (target.maxHp > 3) return -0.5;
								return -1;
							}
							return 0;
						},
					},
				},
			},
			new_kongcheng: {
				group: ["new_kongcheng_gain", "new_kongcheng_got"],
				subSkill: {
					gain: {
						audio: "kongcheng",
						trigger: {
							player: "gainBefore",
						},
						filter(event, player) {
							return event.source && event.source != player && player != _status.currentPhase && !event.bySelf && player.countCards("h") == 0;
						},
						content() {
							trigger.name = "addToExpansion";
							trigger.setContent("addToExpansion");
							trigger.gaintag = ["new_kongcheng"];
							trigger.untrigger();
							trigger.trigger("addToExpansionBefore");
						},
						sub: true,
						forced: true,
					},
					got: {
						trigger: {
							player: "phaseDrawBegin1",
						},
						filter(event, player) {
							return player.getExpansions("new_kongcheng").length > 0;
						},
						content() {
							player.gain(player.getExpansions("new_kongcheng"), "draw");
						},
						sub: true,
						forced: true,
					},
				},
				audio: "kongcheng",
				trigger: {
					target: "useCardToTarget",
				},
				forced: true,
				check(event, player) {
					return get.effect(event.target, event.card, event.player, player) < 0;
				},
				filter(event, player) {
					return player.countCards("h") == 0 && (event.card.name == "sha" || event.card.name == "juedou");
				},
				content() {
					trigger.getParent().targets.remove(player);
				},
				ai: {
					effect: {
						target(card, player, target, current) {
							if (target.countCards("h") == 0 && (card.name == "sha" || card.name == "juedou")) return "zeroplayertarget";
						},
					},
				},
				intro: {
					markcount: "expansion",
					mark(dialog, content, player) {
						var content = player.getExpansions("new_kongcheng");
						if (content && content.length) {
							if (player == game.me || player.isUnderControl()) {
								dialog.addAuto(content);
							} else {
								return "共有" + get.cnNumber(content.length) + "张牌";
							}
						}
					},
					content(content, player) {
						var content = player.getExpansions("new_kongcheng");
						if (content && content.length) {
							if (player == game.me || player.isUnderControl()) {
								return get.translation(content);
							}
							return "共有" + get.cnNumber(content.length) + "张牌";
						}
					},
				},
				onremove(player, skill) {
					var cards = player.getExpansions(skill);
					if (cards.length) player.loseToDiscardpile(cards);
				},
			},
			new_keji: {
				audio: "keji",
				forced: true,
				trigger: {
					player: "phaseDiscardBegin",
				},
				filter(event, player) {
					var list = [];
					player.getHistory("useCard", function (evt) {
						if (evt.isPhaseUsing(player)) {
							var color = get.color(evt.card);
							if (color != "nocolor") list.add(color);
						}
					});
					return list.length <= 1;
				},
				check(event, player) {
					return player.needsToDiscard();
				},
				content() {
					player.addTempSkill("keji_add", "phaseAfter");
				},
			},
			keji_add: {
				charlotte: true,
				mod: {
					maxHandcard(player, num) {
						return num + 4;
					},
				},
			},
			new_mouduan: {
				trigger: {
					player: "phaseJieshuBegin",
				},
				//priority:2,
				audio: "botu",
				filter(event, player) {
					var history = player.getHistory("useCard");
					var suits = [];
					var types = [];
					for (var i = 0; i < history.length; i++) {
						var suit = get.suit(history[i].card);
						if (suit) suits.add(suit);
						types.add(get.type(history[i].card));
					}
					return suits.length >= 4 || types.length >= 3;
				},
				check(event, player) {
					return player.canMoveCard(true);
				},
				content() {
					player.moveCard();
				},
			},
			new_longdan: {
				audio: "longdan_sha",
				audioname2: { gz_jun_liubei: "shouyue_longdan" },
				group: ["new_longdan_sha", "new_longdan_shan", "new_longdan_draw", "new_longdan_shamiss", "new_longdan_shanafter"],
				subSkill: {
					shanafter: {
						sub: true,
						audio: "longdan_sha",
						audioname2: { gz_jun_liubei: "shouyue_longdan" },
						trigger: {
							player: "useCard",
						},
						//priority:1,
						filter(event, player) {
							return event.skill == "new_longdan_shan" && event.getParent(2).name == "sha";
						},
						direct: true,
						content() {
							"step 0";
							player
								.chooseTarget("是否发动【龙胆】令一名其他角色回复1点体力？", function (card, player, target) {
									return target != _status.event.source && target != player && target.isDamaged();
								})
								.set("ai", function (target) {
									return get.attitude(_status.event.player, target);
								})
								.set("source", trigger.getParent(2).player);
							"step 1";
							if (result.bool && result.targets && result.targets.length) {
								player.logSkill("new_longdan", result.targets[0]);
								result.targets[0].recover();
							}
						},
					},
					shamiss: {
						sub: true,
						audio: "longdan_sha",
						audioname2: { gz_jun_liubei: "shouyue_longdan" },
						trigger: {
							player: "shaMiss",
						},
						direct: true,
						filter(event, player) {
							return event.skill == "new_longdan_sha";
						},
						content() {
							"step 0";
							player
								.chooseTarget("是否发动【龙胆】对一名其他角色造成1点伤害？", function (card, player, target) {
									return target != _status.event.target && target != player;
								})
								.set("ai", function (target) {
									return -get.attitude(_status.event.player, target);
								})
								.set("target", trigger.target);
							"step 1";
							if (result.bool && result.targets && result.targets.length) {
								player.logSkill("new_longdan", result.targets[0]);
								result.targets[0].damage();
							}
						},
					},
					draw: {
						trigger: {
							player: ["useCard", "respond"],
						},
						audio: "longdan_sha",
						audioname2: { gz_jun_liubei: "shouyue_longdan" },
						forced: true,
						locked: false,
						filter(event, player) {
							if (!get.zhu(player, "shouyue")) return false;
							return event.skill == "new_longdan_sha" || event.skill == "new_longdan_shan";
						},
						content() {
							player.draw();
							//player.storage.fanghun2++;
						},
						sub: true,
					},
					sha: {
						audio: "longdan_sha",
						audioname2: { gz_jun_liubei: "shouyue_longdan" },
						enable: ["chooseToUse", "chooseToRespond"],
						filterCard: {
							name: "shan",
						},
						viewAs: {
							name: "sha",
						},
						position: "hs",
						viewAsFilter(player) {
							if (!player.countCards("hs", "shan")) return false;
						},
						prompt: "将一张闪当杀使用或打出",
						check() {
							return 1;
						},
						ai: {
							effect: {
								target(card, player, target, current) {
									if (get.tag(card, "respondSha") && current < 0) return 0.6;
								},
							},
							respondSha: true,
							skillTagFilter(player) {
								if (!player.countCards("hs", "shan")) return false;
							},
							order() {
								return get.order({ name: "sha" }) + 0.1;
							},
						},
						sub: true,
					},
					shan: {
						audio: "longdan_sha",
						audioname2: { gz_jun_liubei: "shouyue_longdan" },
						enable: ["chooseToRespond", "chooseToUse"],
						filterCard: {
							name: "sha",
						},
						viewAs: {
							name: "shan",
						},
						position: "hs",
						prompt: "将一张杀当闪使用或打出",
						check() {
							return 1;
						},
						viewAsFilter(player) {
							if (!player.countCards("hs", "sha")) return false;
						},
						ai: {
							respondShan: true,
							skillTagFilter(player) {
								if (!player.countCards("hs", "sha")) return false;
							},
							effect: {
								target(card, player, target, current) {
									if (get.tag(card, "respondShan") && current < 0) return 0.6;
								},
							},
						},
						sub: true,
					},
				},
			},
			gzpaoxiao: {
				audio: "paoxiao",
				audioname2: { gz_jun_liubei: "shouyue_paoxiao" },
				trigger: {
					player: "useCard",
				},
				filter(event, player) {
					if (_status.currentPhase != player) return false;
					if (event.card.name != "sha") return false;
					var history = player.getHistory("useCard", function (evt) {
						return evt.card.name == "sha";
					});
					return history && history.indexOf(event) == 1;
				},
				forced: true,
				preHidden: true,
				content() {
					player.draw();
				},
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") return Infinity;
					},
				},
				ai: {
					unequip: true,
					skillTagFilter(player, tag, arg) {
						if (!get.zhu(player, "shouyue")) return false;
						if (arg && arg.name == "sha") return true;
						return false;
					},
				},
			},
			new_kurou: {
				audio: "rekurou",
				enable: "phaseUse",
				usable: 1,
				filterCard: true,
				check(card) {
					return 8 - get.value(card);
				},
				position: "he",
				content() {
					player.loseHp();
					player.draw(3);
					player.addTempSkill("kurou_effect", "phaseAfter");
				},
				ai: {
					order: 8,
					result: {
						player(player) {
							if (player.hp <= 2) return player.countCards("h") == 0 ? 1 : 0;
							if (player.countCards("h", { name: "sha", color: "red" })) return 1;
							return player.countCards("h") <= player.hp ? 1 : 0;
						},
					},
				},
			},
			kurou_effect: {
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") return num + 1;
					},
				},
			},
			new_chuli: {
				audio: "chulao",
				enable: "phaseUse",
				usable: 1,
				filterTarget(card, player, target) {
					if (player == target) return false;
					for (var i = 0; i < ui.selected.targets.length; i++) {
						if (ui.selected.targets[i].isFriendOf(target)) return false;
					}
					return target.countCards("he") > 0;
				},
				filter(event, player) {
					return player.countCards("he") > 0;
				},
				filterCard: true,
				position: "he",
				selectTarget: [1, 3],
				check(card) {
					if (get.suit(card) == "spade") return 8 - get.value(card);
					return 5 - get.value(card);
				},
				contentBefore() {
					var evt = event.getParent();
					evt.draw = [];
					if (get.suit(cards[0]) == "spade") evt.draw.push(player);
				},
				content() {
					"step 0";
					player.discardPlayerCard(target, "he", true);
					"step 1";
					if (result.bool) {
						if (get.suit(result.cards[0]) == "spade") event.getParent().draw.push(target);
					}
				},
				contentAfter() {
					"step 0";
					var list = event.getParent().draw;
					if (!list.length) event.finish();
					else game.asyncDraw(list);
					"step 1";
					game.delay();
				},
				ai: {
					result: {
						target: -1,
					},
					tag: {
						discard: 1,
						lose: 1,
						loseCard: 1,
					},
					threaten: 1.2,
					order: 3,
				},
			},
			baka_hunshang: {
				skillAnimation: true,
				animationColor: "wood",
				audio: "hunzi",
				preHidden: true,
				derivation: ["baka_yingzi", "baka_yinghun"],
				viceSkill: true,
				init(player) {
					if (player.checkViceSkill("baka_hunshang") && !player.viceChanged) {
						player.removeMaxHp();
					}
				},
				trigger: {
					player: "phaseZhunbeiBegin",
				},
				filter(event, player) {
					return player.hp <= 1;
				},
				forced: true,
				locked: false,
				//priority:3,
				content() {
					player.addTempSkills(["baka_yingzi", "baka_yinghun"]);
				},
				ai: {
					threaten(player, target) {
						if (target.hp == 1) return 2;
						return 0.5;
					},
					maixie: true,
					effect: {
						target(card, player, target) {
							if (!target.hasFriend()) return;
							if (get.tag(card, "damage") == 1 && target.hp == 2 && !target.isTurnedOver() && _status.currentPhase != target && get.distance(_status.currentPhase, target, "absolute") <= 3) return [0.5, 1];
						},
					},
				},
			},
			baka_yinghun: {
				inherit: "yinghun",
				audio: "yinghun_sunce",
			},
			baka_yingzi: {
				mod: {
					maxHandcardBase(player, num) {
						return player.maxHp;
					},
				},
				audio: "reyingzi_sunce",
				trigger: {
					player: "phaseDrawBegin2",
				},
				frequent: true,
				filter(event) {
					return !event.numFixed;
				},
				content() {
					trigger.num++;
				},
				ai: {
					threaten: 1.3,
				},
			},
			gzyiji: {
				audio: "yiji",
				trigger: {
					player: "damageEnd",
				},
				frequent: true,
				preHidden: true,
				content() {
					"step 0";
					event.cards = game.cardsGotoOrdering(get.cards(2)).cards;
					"step 1";
					if (_status.connectMode)
						game.broadcastAll(function () {
							_status.noclearcountdown = true;
						});
					event.given_map = {};
					"step 2";
					if (event.cards.length > 1) {
						player.chooseCardButton("遗计：请选择要分配的牌", true, event.cards, [1, event.cards.length]).set("ai", function (button) {
							if (ui.selected.buttons.length == 0) return 1;
							return 0;
						});
					} else if (event.cards.length == 1) {
						event._result = { links: event.cards.slice(0), bool: true };
					} else {
						event.finish();
					}
					"step 3";
					if (result.bool) {
						event.cards.removeArray(result.links);
						event.togive = result.links.slice(0);
						player
							.chooseTarget("选择一名角色获得" + get.translation(result.links), true)
							.set("ai", function (target) {
								var att = get.attitude(_status.event.player, target);
								if (_status.event.enemy) {
									return -att;
								} else if (att > 0) {
									return att / (1 + target.countCards("h"));
								} else {
									return att / 100;
								}
							})
							.set("enemy", get.value(event.togive[0], player, "raw") < 0);
					}
					"step 4";
					if (result.targets.length) {
						var id = result.targets[0].playerid,
							map = event.given_map;
						if (!map[id]) map[id] = [];
						map[id].addArray(event.togive);
					}
					if (cards.length > 0) event.goto(2);
					"step 5";
					if (_status.connectMode) {
						game.broadcastAll(function () {
							delete _status.noclearcountdown;
							game.stopCountChoose();
						});
					}
					var list = [];
					for (var i in event.given_map) {
						var source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
						player.line(source, "green");
						list.push([source, event.given_map[i]]);
					}
					game.loseAsync({
						gain_list: list,
						giver: player,
						animate: "draw",
					}).setContent("gaincardMultiple");
				},
				ai: {
					maixie: true,
					maixie_hp: true,
					effect: {
						target(card, player, target) {
							if (get.tag(card, "damage")) {
								if (player.hasSkillTag("jueqing", false, target)) return [1, -2];
								if (!target.hasFriend()) return;
								var num = 1;
								if (get.attitude(player, target) > 0) {
									if (player.needsToDiscard()) {
										num = 0.7;
									} else {
										num = 0.5;
									}
								}
								if (target.hp >= 4) return [1, num * 2];
								if (target.hp == 3) return [1, num * 1.5];
								if (target.hp == 2) return [1, num * 0.5];
							}
						},
					},
				},
			},
			gzjieming: {
				audio: "jieming",
				trigger: {
					player: "damageEnd",
				},
				direct: true,
				preHidden: true,
				content() {
					"step 0";
					player
						.chooseTarget(get.prompt("gzjieming"), "令一名角色将手牌补至X张（X为其体力上限且至多为5）", function (card, player, target) {
							return true; //target.countCards('h')<Math.min(target.maxHp,5);
						})
						.set("ai", function (target) {
							var att = get.attitude(_status.event.player, target);
							if (att > 2) {
								return Math.max(0, Math.min(5, target.maxHp) - target.countCards("h"));
							}
							return att / 3;
						})
						.setHiddenSkill("gzjieming");
					"step 1";
					if (result.bool) {
						player.logSkill("gzjieming", result.targets);
						for (var i = 0; i < result.targets.length; i++) {
							var num = Math.min(5, result.targets[i].maxHp) - result.targets[i].countCards("h");
							if (num > 0) result.targets[i].draw(num);
						}
					}
				},
				ai: {
					maixie: true,
					maixie_hp: true,
					effect: {
						target(card, player, target, current) {
							if (get.tag(card, "damage") && target.hp > 1) {
								if (player.hasSkillTag("jueqing", false, target)) return [1, -2];
								var max = 0;
								var players = game.filterPlayer();
								for (var i = 0; i < players.length; i++) {
									if (get.attitude(target, players[i]) > 0) {
										max = Math.max(Math.min(5, players[i].hp) - players[i].countCards("h"), max);
									}
								}
								switch (max) {
									case 0:
										return 2;
									case 1:
										return 1.5;
									case 2:
										return [1, 2];
									default:
										return [0, max];
								}
							}
							if ((card.name == "tao" || card.name == "caoyao") && target.hp > 1 && target.countCards("h") <= target.hp) return [0, 0];
						},
					},
				},
			},
			gzfangzhu: {
				audio: "fangzhu",
				trigger: {
					player: "damageEnd",
				},
				direct: true,
				preHidden: true,
				content() {
					"step 0";
					player
						.chooseTarget(get.prompt2("gzfangzhu"), function (card, player, target) {
							return player != target;
						})
						.setHiddenSkill("gzfangzhu").ai = function (target) {
						if (target.hasSkillTag("noturn")) return 0;
						var player = _status.event.player,
							att = get.attitude(player, target);
						if (att == 0) return 0;
						if (att > 0) {
							if (target.isTurnedOver()) return 1000 - target.countCards("h");
							return -1;
						} else {
							if (target.isTurnedOver()) return -1;
							if (player.getDamagedHp() >= 3) return -1;
							return target.countCards("h") + 1;
						}
					};
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						event.target = target;
						player.logSkill("gzfangzhu", target);
						var num = player.getDamagedHp();
						if (num > 0)
							target.chooseToDiscard("he", num, "放逐：弃置" + get.cnNumber(num) + "张牌并失去1点体力", "或者点击“取消”不弃牌，改为摸" + get.cnNumber(num) + "张牌并叠置").set("ai", function (card) {
								var player = _status.event.player;
								if (player.isTurnedOver()) return -1;
								return player.hp * player.hp - Math.max(1, get.value(card));
							});
						else {
							target.turnOver();
							event.finish();
						}
					} else event.finish();
					"step 2";
					if (result.bool) {
						target.loseHp();
					} else {
						target.draw(player.getDamagedHp());
						target.turnOver();
					}
				},
				ai: {
					maixie: true,
					maixie_hp: true,
					effect: {
						target(card, player, target) {
							if (get.tag(card, "damage")) {
								if (player.hasSkillTag("jueqing", false, target)) return [1, -2];
								if (target.hp <= 1) return;
								if (!target.hasFriend()) return;
								var hastarget = false;
								var turnfriend = false;
								var players = game.filterPlayer();
								for (var i = 0; i < players.length; i++) {
									if (get.attitude(target, players[i]) < 0 && !players[i].isTurnedOver()) {
										hastarget = true;
									}
									if (get.attitude(target, players[i]) > 0 && players[i].isTurnedOver()) {
										hastarget = true;
										turnfriend = true;
									}
								}
								if (get.attitude(player, target) > 0 && !hastarget) return;
								if (turnfriend || target.hp == target.maxHp) return [0.5, 1];
								if (target.hp > 1) return [1, 0.5];
							}
						},
					},
				},
			},
			fengyin_main: {
				init(player, skill) {
					player.addSkillBlocker(skill);
				},
				onremove(player, skill) {
					player.removeSkillBlocker(skill);
				},
				charlotte: true,
				skillBlocker(skill, player) {
					return lib.character[player.name1][3].includes(skill) && !lib.skill[skill].charlotte && !get.is.locked(skill, player);
				},
				mark: true,
				marktext: "主",
				intro: {
					content(storage, player, skill) {
						var list = player.getSkills(null, null, false).filter(function (i) {
							return lib.skill.fengyin_main.skillBlocker(i, player);
						});
						if (list.length) return "失效技能：" + get.translation(list);
						return "无失效技能";
					},
				},
			},
			fengyin_vice: {
				init(player, skill) {
					player.addSkillBlocker(skill);
				},
				onremove(player, skill) {
					player.removeSkillBlocker(skill);
				},
				charlotte: true,
				skillBlocker(skill, player) {
					return lib.character[player.name2][3].includes(skill) && !lib.skill[skill].charlotte && !get.is.locked(skill, player);
				},
				mark: true,
				marktext: "副",
				intro: {
					content(storage, player, skill) {
						var list = player.getSkills(null, null, false).filter(function (i) {
							return lib.skill.fengyin_vice.skillBlocker(i, player);
						});
						if (list.length) return "失效技能：" + get.translation(list);
						return "无失效技能";
					},
				},
			},
			new_tieji: {
				audio: "retieji",
				audioname2: { gz_jun_liubei: "shouyue_tieji" },
				trigger: {
					player: "useCardToPlayered",
				},
				check(event, player) {
					return get.attitude(player, event.target) < 0;
				},
				filter(event) {
					return event.card.name == "sha";
				},
				logTarget: "target",
				content() {
					"step 0";
					var target = trigger.target;
					var controls = [];
					if (get.zhu(player, "shouyue")) {
						if (!target.isUnseen(0)) target.addTempSkill("fengyin_main");
						if (!target.isUnseen(1)) target.addTempSkill("fengyin_vice");
						event.goto(2);
					}
					if (!target.isUnseen(0) && !target.hasSkill("fengyin_main")) controls.push("主将");
					if (!target.isUnseen(1) && !target.hasSkill("fengyin_vice")) controls.push("副将");
					if (controls.length > 0) {
						if (controls.length == 1) event._result = { control: controls[0] };
						else {
							player
								.chooseControl(controls)
								.set("ai", function () {
									var choice = "主将";
									var skills = lib.character[target.name2][3];
									for (var i = 0; i < skills.length; i++) {
										var info = get.info(skills[i]);
										if (info && info.ai && info.ai.maixie) {
											choice = "副将";
											break;
										}
									}
									return choice;
								})
								.set("prompt", "请选择一个武将牌，令" + get.translation(target) + "该武将牌上的非锁定技全部失效。");
						}
					} else event.goto(2);
					"step 1";
					if (result.control) {
						player.popup(result.control, "fire");
						var target = trigger.target;
						if (result.control == "主将") target.addTempSkill("fengyin_main");
						else target.addTempSkill("fengyin_vice");
					}
					"step 2";
					player.judge(function () {
						return 0;
					});
					"step 3";
					var suit = get.suit(result.card);
					var target = trigger.target;
					var num = target.countCards("h", "shan");
					target
						.chooseToDiscard("请弃置一张" + get.translation(suit) + "牌，否则不能使用闪抵消此杀", "he", function (card) {
							return get.suit(card) == _status.event.suit;
						})
						.set("ai", function (card) {
							var num = _status.event.num;
							if (num == 0) return 0;
							if (card.name == "shan") return num > 1 ? 2 : 0;
							return 8 - get.value(card);
						})
						.set("num", num)
						.set("suit", suit);
					"step 4";
					if (!result.bool) {
						trigger.getParent().directHit.add(trigger.target);
					}
				},
			},
			hmkyuanyu: {
				audio: "zongkui",
				trigger: {
					player: "damageBegin4",
				},
				forced: true,
				preHidden: true,
				check(event, player) {
					return true;
				},
				filter(event, player) {
					if (event.num <= 0 || !event.source) return false;
					var n1 = player.getNext();
					var p1 = player.getPrevious();
					if (event.source != n1 && event.source != p1) return true;
				},
				content() {
					trigger.cancel();
				},
				ai: {
					effect: {
						target(card, player, target) {
							if (player.hasSkillTag("jueqing", false, target)) return;
							if (player == target.getNext() || player == target.getPrevious()) return;
							if (get.tag(card, "damage")) return "zeroplayertarget";
						},
					},
				},
			},
			hmkguishu: {
				audio: "bmcanshi",
				enable: "phaseUse",
				filter(event, player) {
					return player.countCards("hs", { suit: "spade" }) > 0;
				},
				init(player) {
					if (!player.storage.hmkguishu) player.storage.hmkguishu = 0;
				},
				chooseButton: {
					dialog(event, player) {
						var list = ["yuanjiao", "zhibi"];
						for (var i = 0; i < list.length; i++) {
							list[i] = ["锦囊", "", list[i]];
						}
						return ui.create.dialog("鬼术", [list, "vcard"]);
					},
					filter(button, player) {
						var name = button.link[2];
						if (player.storage.hmkguishu == 1 && name == "yuanjiao") return false;
						if (player.storage.hmkguishu == 2 && name == "zhibi") return false;
						return lib.filter.filterCard({ name: name }, player, _status.event.getParent());
					},
					check(button) {
						var player = _status.event.player;
						if (button.link == "yuanjiao") {
							return 3;
						}
						if (button.link == "zhibi") {
							if (player.countCards("hs", { suit: "spade" }) > 2) return 1;
							return 0;
						}
					},
					backup(links, player) {
						return {
							audio: "bmcanshi",
							filterCard(card, player) {
								return get.suit(card) == "spade";
							},
							position: "hs",
							selectCard: 1,
							popname: true,
							ai(card) {
								return 6 - ai.get.value(card);
							},
							viewAs: { name: links[0][2] },
							onuse(result, player) {
								player.logSkill("hmkguishu");
								if (result.card.name == "yuanjiao") player.storage.hmkguishu = 1;
								else player.storage.hmkguishu = 2;
							},
						};
					},
					prompt(links, player) {
						return "将一张手牌当作" + get.translation(links[0][2]) + "使用";
					},
				},
				ai: {
					order: 4,
					result: {
						player(player) {
							return 2;
						},
					},
					threaten: 1.6,
				},
			},
			_mingzhisuodingji: {
				mode: ["guozhan"],
				enable: "phaseUse",
				filter(event, player) {
					if (player.hasSkillTag("nomingzhi", false, null, true)) return false;
					var bool = false;
					var skillm = lib.character[player.name1][3];
					var skillv = lib.character[player.name2][3];
					if (player.isUnseen(0)) {
						for (var i = 0; i < skillm.length; i++) {
							if (get.is.locked(skillm[i])) {
								bool = true;
							}
						}
					}
					if (player.isUnseen(1)) {
						for (var i = 0; i < skillv.length; i++) {
							if (get.is.locked(skillv[i])) {
								bool = true;
							}
						}
					}
					return bool;
				},
				popup: false,
				content() {
					"step 0";
					var choice = [];
					var skillm = lib.character[player.name1][3];
					var skillv = lib.character[player.name2][3];
					if (player.isUnseen(0)) {
						for (var i = 0; i < skillm.length; i++) {
							if (get.is.locked(skillm[i]) && !choice.includes("明置主将")) {
								choice.push("明置主将");
							}
						}
					}
					if (player.isUnseen(1)) {
						for (var i = 0; i < skillv.length; i++) {
							if (get.is.locked(skillv[i]) && !choice.includes("明置副将")) {
								choice.push("明置副将");
							}
						}
					}
					if (choice.length == 2) choice.push("全部明置");
					player.chooseControl(choice);
					"step 1";
					if (result.control) {
						switch (result.control) {
							case "取消":
								break;
							case "明置主将":
								player.showCharacter(0);
								break;
							case "明置副将":
								player.showCharacter(1);
								break;
							case "全部明置":
								player.showCharacter(2);
								break;
						}
					}
				},
				ai: {
					order: 11,
					result: {
						player: -99,
					},
				},
			},
			/*----分界线----*/
			_viewnext: {
				trigger: {
					global: "gameDrawBefore",
				},
				silent: true,
				popup: false,
				forced: true,
				filter() {
					if (_status.connectMode && !lib.configOL.viewnext) return false;
					else if (!_status.connectMode && !get.config("viewnext")) return false;
					return game.players.length > 1;
				},
				content() {
					var target = player.getNext();
					player.viewCharacter(target, 1);
				},
			},
			_aozhan_judge: {
				trigger: {
					player: "phaseBefore",
				},
				forced: true,
				priority: 22,
				filter(event, player) {
					if (get.mode() != "guozhan") return false;
					if (_status.connectMode && !lib.configOL.aozhan) return false;
					else if (!_status.connectMode && !get.config("aozhan")) return false;
					if (_status._aozhan) return false;
					if (game.players.length > 4) return false;
					if (game.players.length > 3 && game.players.length + game.dead.length <= 7) return false;
					for (var i = 0; i < game.players.length; i++) {
						for (var j = i + 1; j < game.players.length; j++) {
							if (game.players[i].isFriendOf(game.players[j])) return false;
						}
					}
					return true;
				},
				content() {
					var color = get.groupnature(player.group, "raw");
					if (player.isUnseen()) color = "fire";
					player.$fullscreenpop("鏖战模式", color);
					game.broadcastAll(function () {
						_status._aozhan = true;
						ui.aozhan = ui.create.div(".touchinfo.left", ui.window);
						ui.aozhan.innerHTML = "鏖战模式";
						if (ui.time3) ui.time3.style.display = "none";
						ui.aozhanInfo = ui.create.system("鏖战模式", null, true);
						lib.setPopped(
							ui.aozhanInfo,
							function () {
								var uiintro = ui.create.dialog("hidden");
								uiintro.add("鏖战模式");
								var list = ["当游戏中仅剩四名或更少角色时（七人以下游戏时改为三名或更少），若此时全场没有超过一名势力相同的角色，则从一个新的回合开始，游戏进入鏖战模式直至游戏结束。", "在鏖战模式下，任何角色均不是非转化的【桃】的合法目标。【桃】可以被当做【杀】或【闪】使用或打出。", "进入鏖战模式后，即使之后有两名或者更多势力相同的角色出现，仍然不会取消鏖战模式。"];
								var intro = '<ul style="text-align:left;margin-top:0;width:450px">';
								for (var i = 0; i < list.length; i++) {
									intro += "<li>" + list[i];
								}
								intro += "</ul>";
								uiintro.add('<div class="text center">' + intro + "</div>");
								var ul = uiintro.querySelector("ul");
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
					game.countPlayer(function (current) {
						current.addSkill("aozhan");
					});
				},
			},
			_guozhan_marks: {
				ruleSkill: true,
				enable: "phaseUse",
				filter(event, player) {
					return player.hasMark("yexinjia_mark") || player.hasMark("xianqu_mark") || player.hasMark("yinyang_mark") || player.hasMark("zhulianbihe_mark");
				},
				chooseButton: {
					dialog(event, player) {
						return ui.create.dialog("###国战标记###弃置一枚对应的标记，发动其对应的效果");
					},
					chooseControl(event, player) {
						var list = [],
							bool = player.hasMark("yexinjia_mark");
						if (bool || player.hasMark("xianqu_mark")) list.push("先驱");
						if (bool || player.hasMark("zhulianbihe_mark")) {
							list.push("珠联(摸牌)");
							if (event.filterCard({ name: "tao", isCard: true }, player, event)) list.push("珠联(桃)");
						}
						if (bool || player.hasMark("yinyang_mark")) list.push("阴阳鱼");
						list.push("cancel2");
						return list;
					},
					check() {
						var player = _status.event.player,
							bool = player.hasMark("yexinjia_mark");
						if ((bool || player.hasMark("xianqu_mark")) && 4 - player.countCards("h") > 1) return "先驱";
						if (bool || player.hasMark("zhulianbihe_mark")) {
							if (_status.event.getParent().filterCard({ name: "tao", isCard: true }, player, event) && get.effect_use(player, { name: "tao" }, player) > 0) return "珠联(桃)";
							if (
								player.getHandcardLimit() - player.countCards("h") > 1 &&
								!game.hasPlayer(function (current) {
									return current != player && current.isFriendOf(player) && current.hp + current.countCards("h", "shan") <= 2;
								})
							)
								return "珠联(摸牌)";
						}
						if (player.hasMark("yinyang_mark") && player.getHandcardLimit() - player.countCards("h") > 0) return "阴阳鱼";
						return "cancel2";
					},
					backup(result, player) {
						switch (result.control) {
							case "珠联(桃)":
								return get.copy(lib.skill._zhulianbihe_mark_tao);
							case "珠联(摸牌)":
								return {
									content() {
										player.draw(2);
										player.removeMark(player.hasMark("zhulianbihe_mark") ? "zhulianbihe_mark" : "yexinjia_mark", 1);
									},
								};
							case "阴阳鱼":
								return {
									content() {
										player.draw();
										player.removeMark(player.hasMark("yinyang_mark") ? "yinyang_mark" : "yexinjia_mark", 1);
									},
								};
							case "先驱":
								return { content: lib.skill.xianqu_mark.content };
						}
					},
				},
				ai: {
					order: 1,
					result: {
						player: 1,
					},
				},
			},
			xianqu_mark: {
				intro: {
					content: "◇出牌阶段，你可以弃置此标记，然后将手牌摸至四张并观看一名其他角色的一张武将牌。",
				},
				content() {
					"step 0";
					player.removeMark(player.hasMark("xianqu_mark") ? "xianqu_mark" : "yexinjia_mark", 1);
					var num = 4 - player.countCards("h");
					if (num) player.draw(num);
					"step 1";
					if (
						game.hasPlayer(function (current) {
							return current != player && current.isUnseen(2);
						})
					)
						player
							.chooseTarget("是否观看一名其他角色的一张暗置武将牌？", function (card, player, target) {
								return target != player && target.isUnseen(2);
							})
							.set("ai", function (target) {
								if (target.isUnseen()) {
									var next = _status.event.player.getNext();
									if (target != next) return 10;
									return 9;
								}
								return -get.attitude(_status.event.player, target);
							});
					else event.finish();
					"step 2";
					if (result.bool) {
						event.target = result.targets[0];
						player.line(event.target, "green");
						var controls = [];
						if (event.target.isUnseen(0)) controls.push("主将");
						if (event.target.isUnseen(1)) controls.push("副将");
						if (controls.length > 1) {
							player.chooseControl(controls);
						}
						if (controls.length == 0) event.finish();
					} else {
						player.removeSkill("xianqu_mark");
						event.finish();
					}
					"step 3";
					if (result.control) {
						if (result.control == "主将") {
							player.viewCharacter(event.target, 0);
						} else {
							player.viewCharacter(event.target, 1);
						}
					} else if (target.isUnseen(0)) {
						player.viewCharacter(event.target, 0);
					} else {
						player.viewCharacter(event.target, 1);
					}
				},
			},
			zhulianbihe_mark: {
				intro: {
					content: "◇出牌阶段，你可以弃置此标记 然后摸两张牌。<br>◇你可以将此标记当做【桃】使用。",
				},
			},
			yinyang_mark: {
				intro: {
					content: "◇出牌阶段，你可以弃置此标记，然后摸一张牌。<br>◇弃牌阶段，你可以弃置此标记，然后本回合手牌上限+2。",
				},
			},
			_zhulianbihe_mark_tao: {
				ruleSkill: true,
				enable: "chooseToUse",
				filter(event, player) {
					return event.type != "phase" && (player.hasMark("zhulianbihe_mark") || player.hasMark("yexinjia_mark"));
				},
				viewAsFilter(player) {
					return player.hasMark("zhulianbihe_mark") || player.hasMark("yexinjia_mark");
				},
				viewAs: {
					name: "tao",
					isCard: true,
				},
				filterCard() {
					return false;
				},
				selectCard: -1,
				precontent() {
					player.removeMark(player.hasMark("zhulianbihe_mark") ? "zhulianbihe_mark" : "yexinjia_mark", 1);
				},
			},
			_yinyang_mark_add: {
				ruleSkill: true,
				trigger: {
					player: "phaseDiscardBegin",
				},
				filter(event, player) {
					return (player.hasMark("yinyang_mark") || player.hasMark("yexinjia_mark")) && player.needsToDiscard();
				},
				prompt(event, player) {
					return "是否弃置一枚【" + (player.hasMark("yinyang_mark") ? "阴阳鱼" : "野心家") + "】标记，使本回合的手牌上限+2？";
				},
				content() {
					player.addTempSkill("yinyang_add", "phaseAfter");
					player.removeMark(player.hasMark("yinyang_mark") ? "yinyang_mark" : "yexinjia_mark", 1);
				},
			},
			yinyang_add: {
				mod: {
					maxHandcard(player, num) {
						return num + 2;
					},
				},
			},
			yexinjia_mark: {
				intro: {
					content: "◇你可以弃置此标记，并发动【先驱】标记或【珠联璧合】标记或【阴阳鱼】标记的效果。",
				},
			},
			yexinjia_friend: {
				marktext: "盟",
				intro: {
					name: "结盟",
					content: "已经与$结成联盟",
				},
			},
			/*----分界线----*/
			_lianheng: {
				mode: ["guozhan"],
				enable: "phaseUse",
				usable: 1,
				prompt: "将至多三张可合纵的牌交给一名与你势力不同的角色，或未确定势力的角色，若你交给与你势力不同的角色，则你摸等量的牌",
				filter(event, player) {
					return player.hasCard(function (card) {
						return card.hasTag("lianheng") || card.hasGaintag("_lianheng");
					}, "h");
				},
				filterCard(card) {
					return card.hasTag("lianheng") || card.hasGaintag("_lianheng");
				},
				filterTarget(card, player, target) {
					if (target == player) return false;
					if (player.isUnseen()) return target.isUnseen();
					return !target.isFriendOf(player);
				},
				check(card) {
					if (card.name == "tao") return 0;
					return 7 - get.value(card);
				},
				selectCard: [1, 3],
				discard: false,
				lose: false,
				delay: false,
				content() {
					"step 0";
					player.give(cards, target);
					"step 1";
					if (!target.isUnseen()) {
						player.draw(cards.length);
					}
				},
				ai: {
					basic: {
						order: 8,
					},
					result: {
						player(player, target) {
							var huoshao = false;
							for (var i = 0; i < ui.selected.cards.length; i++) {
								if (ui.selected.cards[i].name == "huoshaolianying") {
									huoshao = true;
									break;
								}
							}
							if (huoshao && player.inline(target.getNext())) return -3;
							if (target.isUnseen()) return 0;
							if (player.isMajor()) return 0;
							if (!player.isMajor() && huoshao && player.getNext().isMajor()) return -2;
							if (!player.isMajor() && huoshao && player.getNext().isMajor() && player.getNext().getNext().isMajor()) return -3;
							if (!player.isMajor() && huoshao && !target.isMajor() && target.getNext().isMajor() && target.getNext().getNext().isMajor()) return 3;
							if (!player.isMajor() && huoshao && !target.isMajor() && target.getNext().isMajor()) return 1.5;
							return 1;
						},
						target(player, target) {
							if (target.isUnseen()) return 0;
							return 1;
						},
					},
				},
			},
			qianhuan: {
				group: ["qianhuan_add", "qianhuan_use"],
				intro: {
					content: "expansion",
					markcount: "expansion",
				},
				onremove(player, skill) {
					var cards = player.getExpansions(skill);
					if (cards.length) player.loseToDiscardpile(cards);
				},
				ai: {
					threaten: 1.8,
				},
				audio: 2,
				preHidden: true,
				subSkill: {
					add: {
						trigger: { global: "damageEnd" },
						filter(event, player) {
							var suits = [],
								cards = player.getExpansions("qianhuan");
							for (var i = 0; i < cards.length; i++) {
								suits.add(get.suit(cards[i]));
							}
							if (suits.length >= lib.suit.length) return false;
							return (
								player.isFriendOf(event.player) &&
								player.hasCard(function (card) {
									if (_status.connectMode && get.position(card) == "h") return true;
									return !suits.includes(get.suit(card));
								}, "he")
							);
						},
						direct: true,
						content() {
							"step 0";
							var suits = [],
								cards = player.getExpansions("qianhuan");
							for (var i = 0; i < cards.length; i++) {
								suits.add(get.suit(cards[i]));
							}
							player
								.chooseCard("he", get.prompt2("qianhuan"), function (card) {
									return !_status.event.suits.includes(get.suit(card));
								})
								.set("ai", function (card) {
									return 9 - get.value(card);
								})
								.set("suits", suits)
								.setHiddenSkill("qianhuan");
							"step 1";
							if (result.bool) {
								player.logSkill("qianhuan");
								var card = result.cards[0];
								player.addToExpansion(card, player, "give").gaintag.add("qianhuan");
							}
						},
					},
					use: {
						trigger: { global: "useCardToTarget" },
						filter(event, player) {
							if (!["basic", "trick"].includes(get.type(event.card, "trick"))) return false;
							return event.target && player.isFriendOf(event.target) && event.targets.length == 1 && player.getExpansions("qianhuan").length;
						},
						direct: true,
						content() {
							"step 0";
							var goon = get.effect(trigger.target, trigger.card, trigger.player, player) < 0;
							if (goon) {
								if (["tiesuo", "diaohulishan", "lianjunshengyan", "zhibi", "chiling", "lulitongxin"].includes(trigger.card.name)) {
									goon = false;
								} else if (trigger.card.name == "sha") {
									if (
										trigger.target.mayHaveShan(
											player,
											"use",
											trigger.target.getCards("h", i => {
												return i.hasGaintag("sha_notshan");
											})
										) ||
										trigger.target.hp >= 3
									) {
										goon = false;
									}
								} else if (trigger.card.name == "guohe") {
									if (trigger.target.countCards("he") >= 3 || !trigger.target.countCards("h")) {
										goon = false;
									}
								} else if (trigger.card.name == "shuiyanqijunx") {
									if (trigger.target.countCards("e") <= 1 || trigger.target.hp >= 3) {
										goon = false;
									}
								} else if (get.tag(trigger.card, "damage") && trigger.target.hp >= 3) {
									goon = false;
								}
							}
							player
								.chooseButton()
								.set("goon", goon)
								.set("ai", function (button) {
									if (_status.event.goon) return 1;
									return 0;
								})
								.set("createDialog", [get.prompt("qianhuan"), '<div class="text center">移去一张“千幻”牌令' + get.translation(trigger.player) + "对" + get.translation(trigger.target) + "的" + get.translation(trigger.card) + "失效</div>", player.getExpansions("qianhuan")]);
							"step 1";
							if (result.bool) {
								player.logSkill("qianhuan", trigger.player);
								trigger.getParent().targets.remove(trigger.target);
								var card = result.links[0];
								player.loseToDiscardpile(card);
							}
						},
					},
				},
			},
			gzsanyao: {
				audio: "sanyao",
				inherit: "sanyao",
				filterTarget(card, player, target) {
					return target.hp > player.hp || target.countCards("h") > player.countCards("h");
				},
			},
			gzzhiman: {
				audio: "zhiman",
				inherit: "zhiman",
				preHidden: true,
				content() {
					"step 0";
					if (trigger.player.countGainableCards(player, "ej")) {
						player.gainPlayerCard(trigger.player, "ej", true);
					}
					trigger.cancel();
					"step 1";
					if (player.isFriendOf(trigger.player)) {
						trigger.player.mayChangeVice();
					}
				},
			},
			gzdiancai: {
				audio: "diancai",
				trigger: {
					global: "phaseUseEnd",
				},
				filter(event, player) {
					if (_status.currentPhase === player) return false;

					let num = 0;

					player.getHistory("lose", evt => {
						if (evt.cards2 && evt.getParent("phaseUse") === event) num += evt.cards2.length;
					});

					return num >= player.hp;
				},
				preHidden: true,
				async content(event, trigger, player) {
					const num = player.maxHp - player.countCards("h");
					if (num > 0) {
						await player.draw(num);
					}

					await player.mayChangeVice();
				},
			},
			xuanlve: {
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				direct: true,
				preHidden: true,
				filter(event, player) {
					var evt = event.getl(player);
					return evt && evt.es && evt.es.length > 0;
				},
				content() {
					"step 0";
					player
						.chooseTarget(get.prompt("xuanlve"), "弃置一名其他角色的一张牌", function (card, player, target) {
							return target != player && target.countDiscardableCards(player, "he");
						})
						.set("ai", function (target) {
							var player = _status.event.player;
							return get.effect(target, { name: "guohe_copy2" }, player, player);
						})
						.setHiddenSkill(event.name);
					"step 1";
					if (result.bool) {
						player.logSkill("xuanlve", result.targets);
						player.discardPlayerCard(result.targets[0], "he", true);
					}
				},
				ai: {
					noe: true,
					reverseEquip: true,
					effect: {
						target(card, player, target, current) {
							if (get.type(card) == "equip") return [1, 1];
						},
					},
				},
			},
			lianzi: {
				enable: "phaseUse",
				usable: 1,
				audio: 2,
				derivation: "gzzhiheng",
				filterCard: true,
				check(card) {
					if (get.type(card) == "equip") return 0;
					var player = _status.event.player;
					var num =
						game.countPlayer(function (current) {
							if (current.identity == "wu") {
								return current.countCards("e");
							}
						}) + player.getExpansions("yuanjiangfenghuotu").length;
					if (num >= 5) {
						return 8 - get.value(card);
					}
					if (num >= 3) {
						return 7 - get.value(card);
					}
					if (num >= 2) {
						return 3 - get.value(card);
					}
					return 0;
				},
				content() {
					"step 0";
					var num =
						game.countPlayer(function (current) {
							if (current.identity == "wu") {
								return current.countCards("e");
							}
						}) + player.getExpansions("yuanjiangfenghuotu").length;
					if (num) {
						event.shown = get.cards(num);
						player.showCards(event.shown, get.translation("lianzi"));
					} else {
						event.finish();
						return;
					}
					"step 1";
					var list = [];
					var discards = [];
					var type = get.type(cards[0], "trick");
					for (var i = 0; i < event.shown.length; i++) {
						if (get.type(event.shown[i], "trick") == type) {
							list.push(event.shown[i]);
						} else {
							discards.push(event.shown[i]);
						}
					}
					game.cardsDiscard(discards);
					if (list.length) {
						player.gain(list, "gain2");
						if (list.length >= 3 && player.hasStockSkill("lianzi")) {
							player.changeSkills(["gzzhiheng"], ["lianzi"]);
						}
					}
				},
				ai: {
					order: 7,
					result: {
						player: 1,
					},
				},
			},
			jubao: {
				mod: {
					canBeGained(card, source, player) {
						if (source != player && get.position(card) == "e" && get.subtype(card) == "equip5") return false;
					},
				},
				trigger: { player: "phaseJieshuBegin" },
				audio: 2,
				derivation: "dinglanyemingzhu",
				forced: true,
				unique: true,
				filter(event, player) {
					if (
						game.hasPlayer(function (current) {
							return current.countCards("ej", function (card) {
								return card.name == "dinglanyemingzhu";
							});
						})
					) {
						return true;
					}
					for (var i = 0; i < ui.discardPile.childElementCount; i++) {
						if (ui.discardPile.childNodes[i].name == "dinglanyemingzhu") {
							return true;
						}
					}
					return false;
				},
				content() {
					"step 0";
					player.draw();
					"step 1";
					var target = game.findPlayer(function (current) {
						return current != player && current.countCards("e", "dinglanyemingzhu");
					});
					if (target && target.countGainableCards(player, "he")) {
						player.line(target, "green");
						player.gainPlayerCard(target, true);
					}
				},
				ai: {
					threaten: 1.5,
				},
			},
			jiahe: {
				audio: true,
				unique: true,
				forceunique: true,
				lordSkill: true,
				mark: true,
				derivation: ["yuanjiangfenghuotu", "jiahe_reyingzi", "jiahe_haoshi", "jiahe_shelie", "jiahe_duoshi"],
				global: ["yuanjiangfenghuotu", "jiahe_damage", "jiahe_put", "jiahe_skill"],
				init(player) {
					player.markSkill("yuanjiangfenghuotu");
				},
			},
			jiahe_damage: {
				audio: ["yuanjiangfenghuotu3.mp3", "yuanjiangfenghuotu4.mp3"],
				forceaudio: true,
				ai: {
					threaten: 2,
				},
				trigger: { player: "damageEnd" },
				forced: true,
				filter(event, player) {
					return event.card && (event.card.name == "sha" || get.type(event.card, "trick") == "trick") && player.getExpansions("yuanjiangfenghuotu").length > 0;
				},
				content() {
					"step 0";
					player.chooseCardButton("将一张“烽火”置入弃牌堆", player.getExpansions("yuanjiangfenghuotu"), true);
					"step 1";
					if (result.bool) {
						var card = result.links[0];
						player.loseToDiscardpile(card);
					}
				},
			},
			jiahe_put: {
				enable: "phaseUse",
				audio: ["yuanjiangfenghuotu", 2],
				forceaudio: true,
				filter(event, player) {
					var zhu = get.zhu(player, "jiahe");
					if (zhu) {
						return player.countCards("he", { type: "equip" }) > 0;
					}
					return false;
				},
				filterCard: { type: "equip" },
				position: "he",
				usable: 1,
				check(card) {
					var zhu = get.zhu(_status.event.player, "jiahe");
					if (!zhu) return 0;
					var num = 7 - get.value(card);
					if (get.position(card) == "h") {
						if (zhu.getExpansions("huangjintianbingfu").length >= 5) {
							return num - 3;
						}
						return num + 3;
					} else {
						var player = _status.event.player;
						var zhu = get.zhu(player, "jiahe");
						var sub = get.subtype(card);
						if (
							player.countCards("h", function (card) {
								return get.type(card) == "equip" && get.subtype(card) == "sub" && player.hasValueTarget(card);
							})
						)
							return num + 4;
						if (zhu.getExpansions("yuanjiangfenghuotu").length >= 5 && !player.hasSkillTag("noe")) {
							return num - 5;
						}
					}
					return num;
				},
				discard: false,
				lose: false,
				delay: false,
				prepare(cards, player) {
					var zhu = get.zhu(player, "jiahe");
					player.line(zhu);
				},
				content() {
					var zhu = get.zhu(player, "jiahe");
					zhu.addToExpansion(cards, player, "give").gaintag.add("yuanjiangfenghuotu");
				},
				ai: {
					order(item, player) {
						if (
							player.hasSkillTag("noe") ||
							!player.countCards("h", function (card) {
								return get.type(card) == "equip" && !player.canEquip(card) && player.hasValueTarget(card);
							})
						)
							return 1;
						return 10;
					},
					result: {
						player: 1,
					},
				},
			},
			jiahe_skill: {
				trigger: { player: "phaseZhunbeiBegin" },
				direct: true,
				audio: "jiahe_put",
				forceaudio: true,
				filter(event, player) {
					var zhu = get.zhu(player, "jiahe");
					if (zhu && zhu.getExpansions("yuanjiangfenghuotu").length) {
						return true;
					}
					return false;
				},
				content() {
					"step 0";
					var zhu = get.zhu(player, "jiahe");
					event.num = zhu.getExpansions("yuanjiangfenghuotu").length;
					"step 1";
					var list = [];
					if (event.num >= 1 && !(player.hasSkill("reyingzi") || player.hasSkill("jiahe_reyingzi"))) list.push("reyingzi");
					if (event.num >= 2 && !(player.hasSkill("haoshi") || player.hasSkill("jiahe_haoshi"))) list.push("haoshi");
					if (event.num >= 3 && !(player.hasSkill("shelie") || player.hasSkill("jiahe_shelie"))) list.push("shelie");
					if (event.num >= 4 && !(player.hasSkill("gzduoshi") || player.hasSkill("jiahe_duoshi"))) list.push("gzduoshi");
					if (!list.length) {
						event.finish();
						return;
					}
					var prompt2 = "你可以获得下列一项技能直到回合结束";
					if (list.length >= 5) {
						if (event.done) {
							prompt2 += " (2/2)";
						} else {
							prompt2 += " (1/2)";
						}
					}
					list.push("cancel2");
					player
						.chooseControl(list)
						.set("prompt", get.translation("yuanjiangfenghuotu"))
						.set("prompt2", prompt2)
						.set("centerprompt2", true)
						.set("ai", function (evt, player) {
							var controls = _status.event.controls;
							if (controls.includes("haoshi")) {
								var nh = player.countCards("h");
								if (player.hasSkill("reyingzi")) {
									if (nh == 0) return "haoshi";
								} else {
									if (nh <= 1) return "haoshi";
								}
							}
							if (controls.includes("shelie")) {
								return "shelie";
							}
							if (controls.includes("reyingzi")) {
								return "reyingzi";
							}
							if (controls.includes("gzduoshi")) {
								return "gzduoshi";
							}
							return controls.randomGet();
						});
					"step 2";
					if (result.control != "cancel2") {
						var map = {
							reyingzi: "jiahe_reyingzi",
							haoshi: "jiahe_haoshi",
							shelie: "jiahe_shelie",
							gzduoshi: "jiahe_duoshi",
						};
						var skills = map[result.control];
						player.addTempSkills(skills);

						/* 语音修复
						if (skills == "gzduoshi") {
							game.broadcastAll(function (player) {
								let info = lib.skill["gzduoshi"];
								if (!info.audioname2) info.audioname2 = {};
								info.audioname2[player.name1] = "jiahe_duoshi";
								info.audioname2[player.name2] = "jiahe_duoshi";
								let subSkillInfo = info?.subSkill?.global;
								if (subSkillInfo) {
									if (!subSkillInfo.audioname2) subSkillInfo.audioname2 = {};
									subSkillInfo.audioname2[player.name1] = "jiahe_duoshi";
									subSkillInfo.audioname2[player.name2] = "jiahe_duoshi";
								}
							}, player);
						}*/

						if (!event.done) player.logSkill("jiahe_put");
						// game.log(player,'获得了技能','【'+get.translation(skill)+'】');
						if (event.num >= 5 && !event.done) {
							event.done = true;
							event.goto(1);
						}
					}
				},
			},
			jiahe_reyingzi: {
				audio: 2,
				inherit: "reyingzi",
			},
			jiahe_haoshi: {
				audio: 2,
				inherit: "haoshi",
			},
			jiahe_shelie: {
				audio: 2,
				inherit: "shelie",
			},
			jiahe_duoshi: {
				audio: 2,
				inherit: "gzduoshi",
			},
			yuanjiangfenghuotu: {
				audio: 4,
				unique: true,
				forceunique: true,
				nopop: true,
				mark: true,
				onremove(player, skill) {
					var cards = player.getExpansions(skill);
					if (cards.length) player.loseToDiscardpile(cards);
				},
				intro: {
					content: "expansion",
					markcount: "expansion",
					mark(dialog, content, player) {
						var content = player.getExpansions("yuanjiangfenghuotu");
						if (content && content.length) {
							dialog.addSmall(content);
						}
						dialog.addText('<ul style="margin-top:5px;padding-left:22px;"><li>每名吴势力角色的出牌阶段限一次，该角色可以将一张装备牌置于“缘江烽火图”上，称之为“烽火”。<li>根据“烽火”的数量，所有吴势力角色可于其准备阶段选择并获得其中一个技能直到回合结束：一张及以上~英姿；两张及以上~好施；三张及以上~涉猎；四张及以上~度势；五张及以上~可额外选择一项。<li>锁定技，当你受到【杀】或锦囊牌造成的伤害后，你将一张“烽火”置入弃牌堆。', false);
					},
				},
			},
			gzqice: {
				enable: "phaseUse",
				usable: 1,
				audio: "qice",
				filter(event, player) {
					var hs = player.getCards("h");
					if (!hs.length) return false;
					for (var i = 0; i < hs.length; i++) {
						var mod2 = game.checkMod(hs[i], player, "unchanged", "cardEnabled2", player);
						if (mod2 === false) return false;
					}
					return true;
				},
				group: "gzqice_change",
				subSkill: {
					change: {
						trigger: { player: "useCardAfter" },
						filter(event, player) {
							return event.skill == "gzqice_backup";
						},
						silent: true,
						content() {
							player.mayChangeVice();
							event.skill = "gzqice";
							event.trigger("skillAfter");
						},
					},
				},
				chooseButton: {
					dialog() {
						var list = lib.inpile;
						var list2 = [];
						for (var i = 0; i < list.length; i++) {
							if (list[i] != "wuxie" && get.type(list[i]) == "trick") list2.push(["锦囊", "", list[i]]);
						}
						return ui.create.dialog(get.translation("gzqice"), [list2, "vcard"]);
					},
					filter(button, player) {
						var card = { name: button.link[2] };
						var info = get.info(card);
						var num = player.countCards("h");
						//if(get.tag(card,'multitarget')&&get.select(info.selectTarget)[1]==-1){
						if (get.select(info.selectTarget)[1] == -1) {
							if (
								game.countPlayer(function (current) {
									return player.canUse(card, current);
								}) > num
							) {
								return false;
							}
						} else if (info.changeTarget) {
							var giveup = true;
							var list = game.filterPlayer(function (current) {
								return player.canUse(card, current);
							});
							for (var i = 0; i < list.length; i++) {
								var targets = [list[i]];
								info.changeTarget(player, targets);
								if (targets.length <= num) {
									giveup = false;
									break;
								}
							}
							if (giveup) {
								return false;
							}
						}
						return lib.filter.filterCard(card, player, _status.event.getParent());
					},
					check(button) {
						if (["chiling", "xietianzi", "tiesuo", "lulitongxin", "diaohulishan", "jiedao"].includes(button.link[2])) return 0;
						return _status.event.player.getUseValue(button.link[2]);
					},
					backup(links, player) {
						return {
							filterCard: true,
							audio: "qice",
							selectCard: -1,
							position: "h",
							selectTarget() {
								var select = get.select(get.info(get.card()).selectTarget);
								var nh = _status.event.player.countCards("h");
								if (select[1] > nh) {
									select[1] = nh;
								}
								return select;
							},
							filterTarget(card, player, target) {
								var info = get.info(card);
								if (info.changeTarget) {
									var targets = [target];
									info.changeTarget(player, targets);
									if (targets.length > player.countCards("h")) {
										return false;
									}
								}
								return lib.filter.filterTarget(card, player, target);
							},
							popname: true,
							viewAs: { name: links[0][2] },
							ai1() {
								return 1;
							},
						};
					},
					prompt(links, player) {
						return "将全部手牌当作" + get.translation(links[0][2]) + "使用";
					},
				},
				ai: {
					order: 1,
					result: {
						player(player) {
							var num = 0;
							var cards = player.getCards("h");
							if (cards.length >= 3 && player.hp >= 3) return 0;
							for (var i = 0; i < cards.length; i++) {
								num += Math.max(0, get.value(cards[i], player, "raw"));
							}
							return 16 - num;
						},
					},
					threaten: 1.6,
				},
			},
			gzyuejian: {
				trigger: { global: "phaseDiscardBegin" },
				audio: "yuejian",
				preHidden: true,
				filter(event, player) {
					if (player.isFriendOf(event.player)) {
						return (
							event.player.getHistory("useCard", function (evt) {
								if (evt.targets) {
									var targets = evt.targets.slice(0);
									while (targets.includes(event.player)) targets.remove(event.player);
									return targets.length != 0;
								}
								return false;
							}) == 0
						);
					}
					return false;
				},
				content() {
					trigger.player.addTempSkill("gzyuejian_num");
				},
				logTarget: "player",
				forced: true,
				subSkill: {
					num: {
						mod: {
							maxHandcardBase(player, num) {
								return player.maxHp;
							},
						},
					},
				},
			},
			gzxinsheng: {
				trigger: { player: "damageEnd" },
				// frequent:true,
				content() {
					game.log(player, "获得了一张", "#g化身");
					lib.skill.gzhuashen.addCharacter(player, _status.characterlist.randomGet(), true);
					game.delayx();
				},
			},
			gzhuashen: {
				unique: true,
				group: ["gzhuashen_add", "gzhuashen_swap", "gzhuashen_remove", "gzhuashen_disallow", "gzhuashen_flash"],
				init(player) {
					player.storage.gzhuashen = [];
					player.storage.gzhuashen_removing = [];
					player.storage.gzhuashen_trigger = [];
					player.storage.gzhuashen_map = {};
				},
				onremove(player) {
					delete player.storage.gzhuashen;
					delete player.storage.gzhuashen_removing;
					delete player.storage.gzhuashen_trigger;
					delete player.storage.gzhuashen_map;
				},
				ondisable: true,
				mark: true,
				intro: {
					mark(dialog, storage, player) {
						if (storage && storage.length) {
							if (player.isUnderControl(true)) {
								dialog.addSmall([storage, "character"]);
								var skills = [];
								for (var i in player.storage.gzhuashen_map) {
									skills.addArray(player.storage.gzhuashen_map[i]);
								}
								dialog.addText("可用技能：" + (skills.length ? get.translation(skills) : "无"));
							} else {
								return "共有" + get.cnNumber(storage.length) + "张“化身”";
							}
						} else {
							return "没有化身";
						}
					},
					content(storage, player) {
						if (player.isUnderControl(true)) {
							var skills = [];
							for (var i in player.storage.gzhuashen_map) {
								skills.addArray(player.storage.gzhuashen_map[i]);
							}
							return get.translation(storage) + "；可用技能：" + (skills.length ? get.translation(skills) : "无");
						} else {
							return "共有" + get.cnNumber(storage.length) + "张“化身”";
						}
					},
				},
				filterSkill(name) {
					var skills = lib.character[name][3].slice(0);
					for (var i = 0; i < skills.length; i++) {
						var info = lib.skill[skills[i]];
						if (info.unique || info.limited || info.mainSkill || info.viceSkill || get.is.locked(skills[i])) {
							skills.splice(i--, 1);
						}
					}
					return skills;
				},
				addCharacter(player, name, show) {
					var skills = lib.skill.gzhuashen.filterSkill(name);
					if (skills.length) {
						player.storage.gzhuashen_map[name] = skills;
						for (var i = 0; i < skills.length; i++) {
							player.addAdditionalSkill("hidden:gzhuashen", skills[i], true);
						}
					}
					player.storage.gzhuashen.add(name);
					player.updateMarks("gzhuashen");
					_status.characterlist.remove(name);
					if (show) {
						lib.skill.gzhuashen.drawCharacter(player, [name]);
					}
				},
				drawCharacter(player, list) {
					game.broadcastAll(
						function (player, list) {
							if (player.isUnderControl(true)) {
								var cards = [];
								for (var i = 0; i < list.length; i++) {
									var cardname = "huashen_card_" + list[i];
									lib.card[cardname] = {
										fullimage: true,
										image: "character:" + list[i],
									};
									lib.translate[cardname] = get.rawName2(list[i]);
									cards.push(game.createCard(cardname, "", ""));
								}
								player.$draw(cards, "nobroadcast");
							}
						},
						player,
						list
					);
				},
				removeCharacter(player, name) {
					var skills = lib.skill.gzhuashen.filterSkill(name);
					if (skills.length) {
						delete player.storage.gzhuashen_map[name];
						for (var i = 0; i < skills.length; i++) {
							var remove = true;
							for (var j in player.storage.gzhuashen_map) {
								if (j != name && game.expandSkills(player.storage.gzhuashen_map[j].slice(0)).includes(skills[i])) {
									remove = false;
									break;
								}
							}
							if (remove) {
								player.removeAdditionalSkill("hidden:gzhuashen", skills[i]);
								player.storage.gzhuashen_removing.remove(skills[i]);
							}
						}
					}
					player.storage.gzhuashen.remove(name);
					player.updateMarks("gzhuashen");
					_status.characterlist.add(name);
				},
				getSkillSources(player, skill) {
					if (player.getStockSkills().includes(skill)) return [];
					var sources = [];
					for (var i in player.storage.gzhuashen_map) {
						if (game.expandSkills(player.storage.gzhuashen_map[i].slice(0)).includes(skill)) sources.push(i);
					}
					return sources;
				},
				subfrequent: ["add"],
				subSkill: {
					add: {
						trigger: { player: "phaseBeginStart" },
						frequent: true,
						filter(event, player) {
							return player.storage.gzhuashen.length < 2;
						},
						content() {
							"step 0";
							var list = _status.characterlist.randomGets(5);
							if (!list.length) {
								event.finish();
								return;
							}
							player
								.chooseButton([1, 2])
								.set("ai", function (button) {
									return get.rank(button.link, true);
								})
								.set("createDialog", ["选择至多两张武将牌作为“化身”", [list, "character"]]);
							"step 1";
							if (result.bool) {
								for (var i = 0; i < result.links.length; i++) {
									lib.skill.gzhuashen.addCharacter(player, result.links[i]);
								}
								lib.skill.gzhuashen.drawCharacter(player, result.links.slice(0));
								game.delayx();
								player.addTempSkill("gzhuashen_triggered");
								game.log(player, "获得了" + get.cnNumber(result.links.length) + "张", "#g化身");
							}
						},
					},
					swap: {
						trigger: { player: "phaseBeginStart" },
						direct: true,
						filter(event, player) {
							if (player.hasSkill("gzhuashen_triggered")) return false;
							return player.storage.gzhuashen.length >= 2;
						},
						content() {
							"step 0";
							var list = player.storage.gzhuashen.slice(0);
							if (!list.length) {
								event.finish();
								return;
							}
							player
								.chooseButton()
								.set("ai", function () {
									return Math.random() - 0.3;
								})
								.set("createDialog", ["是否替换一张“化身”？", [list, "character"]]);
							"step 1";
							if (result.bool) {
								player.logSkill("gzhuashen");
								game.log(player, "替换了一张", "#g化身");
								lib.skill.gzhuashen.addCharacter(player, _status.characterlist.randomGet(), true);
								lib.skill.gzhuashen.removeCharacter(player, result.links[0]);
								game.delayx();
							}
						},
					},
					triggered: {},
					flash: {
						hookTrigger: {
							log(player, skill) {
								var sources = lib.skill.gzhuashen.getSkillSources(player, skill);
								if (sources.length) {
									player.flashAvatar("gzhuashen", sources.randomGet());
									player.storage.gzhuashen_removing.add(skill);
								}
							},
						},
						trigger: { player: ["useSkillBegin", "useCard", "respond"] },
						silent: true,
						filter(event, player) {
							return event.skill && lib.skill.gzhuashen.getSkillSources(player, event.skill).length > 0;
						},
						content() {
							lib.skill.gzhuashen_flash.hookTrigger.log(player, trigger.skill);
						},
					},
					clear: {
						trigger: { player: "phaseAfter" },
						silent: true,
						content() {
							player.storage.gzhuashen_trigger.length = 0;
						},
					},
					disallow: {
						hookTrigger: {
							block(event, player, name, skill) {
								for (var i = 0; i < player.storage.gzhuashen_trigger.length; i++) {
									var info = player.storage.gzhuashen_trigger[i];
									if (info[0] == event && info[1] == name && lib.skill.gzhuashen.getSkillSources(player, skill).length > 0) {
										return true;
									}
								}
								return false;
							},
						},
					},
					remove: {
						trigger: {
							player: ["useSkillAfter", "useCardAfter", "respondAfter", "triggerAfter", "skillAfter"],
						},
						hookTrigger: {
							after(event, player) {
								if (event._direct && !player.storage.gzhuashen_removing.includes(event.skill)) return false;
								if (lib.skill[event.skill].silent) return false;
								return lib.skill.gzhuashen.getSkillSources(player, event.skill).length > 0;
							},
						},
						silent: true,
						filter(event, player) {
							return event.skill && lib.skill.gzhuashen.getSkillSources(player, event.skill).length > 0;
						},
						content() {
							"step 0";
							if (trigger.name == "trigger") {
								player.storage.gzhuashen_trigger.push([trigger._trigger, trigger.triggername]);
							}
							var sources = lib.skill.gzhuashen.getSkillSources(player, trigger.skill);
							if (sources.length == 1) {
								event.directresult = sources[0];
							} else {
								player.chooseButton(true).set("createDialog", ["移除一张“化身”牌", [sources, "character"]]);
							}
							"step 1";
							if (!event.directresult && result && result.links[0]) {
								event.directresult = result.links[0];
							}
							var name = event.directresult;
							lib.skill.gzhuashen.removeCharacter(player, name);
							game.log(player, "移除了化身牌", "#g" + get.translation(name));
						},
					},
				},
				ai: {
					nofrequent: true,
					skillTagFilter(player, tag, arg) {
						if (arg && player.storage.gzhuashen) {
							if (lib.skill.gzhuashen.getSkillSources(player, arg).length > 0) {
								return true;
							}
						}
						return false;
					},
				},
			},
			gzxiongsuan: {
				limited: true,
				audio: "xiongsuan",
				enable: "phaseUse",
				filterCard: true,
				filter(event, player) {
					return player.countCards("h");
				},
				filterTarget(card, player, target) {
					return target.isFriendOf(player);
				},
				check(card) {
					return 7 - get.value(card);
				},
				content() {
					"step 0";
					player.awakenSkill("gzxiongsuan");
					target.damage("nocard");
					"step 1";
					player.draw(3);
					var list = [];
					var skills = target.getOriginalSkills();
					for (var i = 0; i < skills.length; i++) {
						if (lib.skill[skills[i]].limited && target.awakenedSkills.includes(skills[i])) {
							list.push(skills[i]);
						}
					}
					if (list.length == 1) {
						target.storage.gzxiongsuan_restore = list[0];
						target.addTempSkill("gzxiongsuan_restore");
						event.finish();
					} else if (list.length > 1) {
						player.chooseControl(list).set("prompt", "选择一个限定技在回合结束后重置之");
					} else {
						event.finish();
					}
					"step 2";
					target.storage.gzxiongsuan_restore = result.control;
					target.addTempSkill("gzxiongsuan_restore");
				},
				subSkill: {
					restore: {
						trigger: { global: "phaseEnd" },
						forced: true,
						popup: false,
						charlotte: true,
						onremove: true,
						content() {
							player.restoreSkill(player.storage.gzxiongsuan_restore);
						},
					},
				},
				ai: {
					order: 4,
					damage: true,
					result: {
						target(player, target) {
							if (target.hp > 1) {
								var skills = target.getOriginalSkills();
								for (var i = 0; i < skills.length; i++) {
									if (lib.skill[skills[i]].limited && target.awakenedSkills.includes(skills[i])) {
										return 8;
									}
								}
							}
							if (target != player) return 0;
							if (get.damageEffect(target, player, player) >= 0) return 10;
							if (target.hp >= 4) return 5;
							if (target.hp == 3) {
								if (
									player.countCards("h") <= 2 &&
									game.hasPlayer(function (current) {
										return current.hp <= 1 && get.attitude(player, current) < 0;
									})
								) {
									return 3;
								}
							}
							return 0;
						},
					},
				},
			},
			gzsuishi: {
				audio: "suishi",
				preHidden: ["gzsuishi2"],
				trigger: { global: "dying" },
				forced: true,
				logAudio: () => 1,
				check() {
					return false;
				},
				filter(event, player) {
					return event.player != player && event.parent.name == "damage" && event.parent.source && event.parent.source.isFriendOf(player);
				},
				content() {
					player.draw();
				},
				group: "gzsuishi2",
			},
			gzsuishi2: {
				audio: "suishi",
				trigger: { global: "dieAfter" },
				forced: true,
				logAudio: () => 2,
				filter(event, player) {
					return event.player.isFriendOf(player);
				},
				content() {
					player.loseHp();
				},
			},
			hongfa_respond: {
				audio: ["huangjintianbingfu", 2],
				forceaudio: true,
				trigger: { player: "chooseToRespondBegin" },
				direct: true,
				filter(event, player) {
					if (event.responded) return false;
					if (!event.filterCard({ name: "sha" })) return false;
					var zhu = get.zhu(player, "hongfa");
					if (zhu && zhu.getExpansions("huangjintianbingfu").length > 0) {
						return true;
					}
					return false;
				},
				content() {
					"step 0";
					var zhu = get.zhu(player, "hongfa");
					player
						.chooseCardButton(get.prompt("huangjintianbingfu"), zhu.getExpansions("huangjintianbingfu"))
						.set("ai", function () {
							if (_status.event.goon) return 1;
							return 0;
						})
						.set("goon", player.countCards("h", "sha") == 0);
					"step 1";
					if (result.bool) {
						var card = result.links[0];
						trigger.untrigger();
						trigger.responded = true;
						trigger.result = { bool: true, card: { name: "sha" }, cards: [card] };
						var zhu = get.zhu(player, "hongfa");
						player.logSkill("hongfa_respond", zhu);
					}
				},
			},
			hongfa_use: {
				audio: ["huangjintianbingfu", 2],
				forceaudio: true,
				enable: "chooseToUse",
				filter(event, player) {
					if (!event.filterCard({ name: "sha" }, player)) return false;
					var zhu = get.zhu(player, "hongfa");
					if (zhu && zhu.getExpansions("huangjintianbingfu").length > 0) {
						return true;
					}
					return false;
				},
				chooseButton: {
					dialog(event, player) {
						var zhu = get.zhu(player, "hongfa");
						return ui.create.dialog("黄巾天兵符", zhu.getExpansions("huangjintianbingfu"), "hidden");
					},
					backup(links, player) {
						return {
							filterCard() {
								return false;
							},
							selectCard: -1,
							viewAs: { name: "sha", cards: links },
							cards: links,
							precontent() {
								var cards = lib.skill.hongfa_use_backup.cards;
								event.result.cards = cards;
								player.logSkill("hongfa_use", result.targets);
							},
						};
					},
					prompt(links, player) {
						return "选择杀的目标";
					},
				},
				ai: {
					respondSha: true,
					skillTagFilter(player) {
						var zhu = get.zhu(player, "hongfa");
						if (zhu && zhu.getExpansions("huangjintianbingfu").length > 0) {
							return true;
						}
						return false;
					},
					order() {
						return get.order({ name: "sha" }) - 0.1;
					},
					result: {
						player(player) {
							if (player.countCards("h", "sha")) return 0;
							return 1;
						},
					},
				},
			},
			hongfa: {
				audio: 3,
				locked: false,
				derivation: "huangjintianbingfu",
				unique: true,
				forceunique: true,
				lordSkill: true,
				trigger: { player: "phaseZhunbeiBegin" },
				forced: true,
				init(player) {
					player.markSkill("huangjintianbingfu");
				},
				filter(event, player) {
					return player.getExpansions("huangjintianbingfu").length == 0 && get.population("qun") > 0;
				},
				content() {
					var cards = get.cards(get.population("qun"));
					player.addToExpansion(cards, "gain2").gaintag.add("huangjintianbingfu");
				},
				ai: {
					threaten: 2,
				},
				group: "hongfa_hp",
				global: ["huangjintianbingfu", "hongfa_use", "hongfa_respond"],
				subSkill: {
					hp: {
						audio: "huangjintianbingfu3.mp3",
						trigger: { player: "loseHpBefore" },
						filter(event, player) {
							return player.getExpansions("huangjintianbingfu").length > 0;
						},
						direct: true,
						content() {
							"step 0";
							player.chooseCardButton(get.prompt("hongfa"), player.getExpansions("huangjintianbingfu")).set("ai", function () {
								return 1;
							});
							"step 1";
							if (result.bool) {
								player.logSkill("hongfa_hp");
								player.loseToDiscardpile(result.links);
								trigger.cancel();
							}
						},
					},
				},
			},
			wendao: {
				audio: 2,
				derivation: "taipingyaoshu",
				unique: true,
				forceunique: true,
				enable: "phaseUse",
				usable: 1,
				filterCard(card) {
					return get.name(card) != "taipingyaoshu" && get.color(card) == "red";
				},
				position: "he",
				check(card) {
					return 6 - get.value(card);
				},
				onChooseToUse(event) {
					if (game.online) return;
					event.set(
						"wendao",
						(function () {
							for (var i = 0; i < ui.discardPile.childElementCount; i++) {
								if (ui.discardPile.childNodes[i].name == "taipingyaoshu") return true;
							}
							return game.hasPlayer(function (current) {
								return current.countCards("ej", "taipingyaoshu");
							});
						})()
					);
				},
				filter(event, player) {
					return event.wendao == true;
				},
				content() {
					var list = [];
					for (var i = 0; i < ui.discardPile.childElementCount; i++) {
						if (ui.discardPile.childNodes[i].name == "taipingyaoshu") {
							list.add(ui.discardPile.childNodes[i]);
						}
					}
					game.countPlayer(function (current) {
						var ej = current.getCards("ej", "taipingyaoshu");
						if (ej.length) {
							list.addArray(ej);
						}
					});
					if (list.length) {
						var card = list.randomGet();
						var owner = get.owner(card);
						if (owner) {
							player.gain(card, owner, "give", "bySelf");
							player.line(owner, "green");
						} else {
							player.gain(card, "gain2");
						}
					}
				},
				ai: {
					order: 8.5,
					result: {
						player: 1,
					},
				},
			},
			huangjintianbingfu: {
				audio: 3,
				unique: true,
				forceunique: true,
				nopop: true,
				mark: true,
				onremove(player, skill) {
					var cards = player.getExpansions(skill);
					if (cards.length) player.loseToDiscardpile(cards);
				},
				intro: {
					content: "expansion",
					markcount: "expansion",
					mark(dialog, content, player) {
						var content = player.getExpansions("huangjintianbingfu");
						if (content && content.length) {
							dialog.addSmall(content);
						}
						dialog.addText('<ul style="margin-top:5px;padding-left:22px;"><li>锁定技，当你计算群势力角色数时，每一张“天兵”均可视为一名群势力角色。<li>每当你失去体力时，你可改为将一张“天兵”置入弃牌堆。<li>与你势力相同的角色可将一张“天兵”当【杀】使用或打出。', false);
					},
				},
			},
			wuxin: {
				trigger: { player: "phaseDrawBegin1" },
				audio: 2,
				filter(event, player) {
					return get.population("qun") > 0;
				},
				content() {
					"step 0";
					var num = get.population("qun");
					// if (player.hasSkill("hongfa")) {
					// 村规
					if (player.hasSkill("hongfa", null, null, false)) {
						num += player.getExpansions("huangjintianbingfu").length;
					}
					var cards = get.cards(num);
					game.cardsGotoOrdering(cards);
					var next = player.chooseToMove("悟心：将卡牌以任意顺序置于牌堆顶");
					next.set("list", [["牌堆顶", cards]]);
					next.set("processAI", function (list) {
						var cards = list[0][1].slice(0);
						cards.sort(function (a, b) {
							return get.value(b) - get.value(a);
						});
						return [cards];
					});
					"step 1";
					if (result.bool) {
						var list = result.moved[0].slice(0);
						while (list.length) {
							ui.cardPile.insertBefore(list.pop(), ui.cardPile.firstChild);
						}
						game.updateRoundNumber();
					}
				},
			},
			zhangwu: {
				audio: 2,
				derivation: "feilongduofeng",
				unique: true,
				forceunique: true,
				ai: {
					threaten: 2,
				},
				trigger: {
					global: ["loseAfter", "cardsDiscardAfter", "equipAfter"],
				},
				forced: true,
				filter(event, player) {
					if (event.name == "equip") {
						if (player == event.player) return false;
						if (event.card.name == "feilongduofeng" && event.player.getCards("e").includes(event.card)) return true;
						return event.player.hasHistory("lose", function (evt) {
							if (evt.position != ui.discardPile || evt.getParent().name != "equip") return false;
							for (var i of evt.cards) {
								if (i.name == "feilongduofeng" && get.position(i, true) == "d") return true;
							}
							return false;
						});
					}
					if (event.name == "lose" && (event.position != ui.discardPile || event.getParent().name == "equip")) return false;
					for (var i of event.cards) {
						if (i.name == "feilongduofeng" && get.position(i, true) == "d") return true;
					}
					return false;
				},
				logTarget(event, player) {
					if (event.name == "equip" && event.card.name == "feilongduofeng" && event.player.getCards("e").includes(event.card)) return event.player;
					return [];
				},
				content() {
					game.delayx();
					var cards = [];
					if (trigger.name == "equip") {
						if (trigger.card.name == "feilongduofeng" && trigger.player.getCards("e").includes(trigger.card)) cards.push(trigger.card);
						trigger.player.getHistory("lose", function (evt) {
							if (evt.position != ui.discardPile || evt.getParent() != trigger) return false;
							for (var i of evt.cards) {
								if (i.name == "feilongduofeng" && get.position(i, true) == "d") cards.push(i);
							}
							return false;
						});
					}
					if (trigger.name == "lose") {
						for (var i of trigger.cards) {
							if (i.name == "feilongduofeng" && get.position(i, true) == "d") cards.push(i);
						}
					}
					var owner = get.owner(cards[0]);
					if (owner) player.gain(cards, "give", owner, "bySelf");
					else player.gain(cards, "gain2");
				},
				group: "zhangwu_draw",
				subSkill: {
					draw: {
						audio: "zhangwu",
						trigger: {
							player: "loseEnd",
							global: ["equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd"],
						},
						filter(event, player) {
							if (event.name == "lose" && event.getParent().name == "useCard") return false;
							var evt = event.getl(player);
							return (
								evt &&
								evt.player == player &&
								evt.cards2.filter(function (i) {
									return i.name == "feilongduofeng" && get.owner(i) != player;
								}).length > 0
							);
						},
						forced: true,
						content() {
							"step 0";
							var cards = [],
								evt = trigger.getl(player);
							cards.addArray(
								evt.cards2.filter(function (i) {
									return i.name == "feilongduofeng" && get.owner(i) != player;
								})
							);
							player.showCards(cards, get.translation(player) + "发动了【章武】");
							for (var i of cards) {
								var owner = get.owner(i);
								if (owner) owner.lose(i, ui.cardPile)._triggered = null;
								else {
									i.fix();
									ui.cardPile.appendChild(i);
								}
							}
							"step 1";
							player.draw(2);
						},
					},
				},
			},
			shouyue: {
				audio: true,
				unique: true,
				forceunique: true,
				global: "wuhujiangdaqi",
				derivation: ["wuhujiangdaqi", "new_rewusheng", "gzpaoxiao", "new_longdan", "new_tieji", "gzliegong"],
				mark: true,
				lordSkill: true,
				init(player) {
					player.markSkill("wuhujiangdaqi");
				},
			},
			shouyue_wusheng: { audio: 2 },
			shouyue_paoxiao: { audio: 2 },
			shouyue_longdan: { audio: 2 },
			shouyue_tieji: { audio: 2 },
			shouyue_liegong: { audio: 2 },
			wuhujiangdaqi: {
				unique: true,
				forceunique: true,
				nopop: true,
				mark: true,
				intro: {
					content: '@<div style="margin-top:-5px"><div class="skill">【武圣】</div><div class="skillinfo">将“红色牌”改为“任意牌”</div><div class="skill">【咆哮】</div><div class="skillinfo">增加描述“你使用的【杀】无视其他角色的防具”</div><div class="skill">【龙胆】</div><div class="skillinfo">增加描述“你每发动一次‘龙胆’便摸一张牌”</div><div class="skill">【铁骑】</div><div class="skillinfo">将“一张明置的武将牌”改为“所有明置的武将牌”</div><div class="skill">【烈弓】</div><div class="skillinfo">增加描述“你的攻击范围+1”</div></div>',
				},
			},
			jizhao: {
				derivation: "rerende",
				unique: true,
				audio: 2,
				enable: "chooseToUse",
				mark: true,
				skillAnimation: true,
				animationColor: "fire",
				init(player) {
					player.storage.jizhao = false;
				},
				filter(event, player) {
					if (player.storage.jizhao) return false;
					if (event.type == "dying") {
						if (player != event.dying) return false;
						return true;
					}
					return false;
				},
				content() {
					"step 0";
					player.awakenSkill("jizhao");
					player.storage.jizhao = true;
					var num = player.maxHp - player.countCards("h");
					if (num > 0) {
						player.draw(num);
					}
					"step 1";
					if (player.hp < 2) {
						player.recover(2 - player.hp);
					}
					"step 2";
					player.removeSkill("wuhujiangdaqi");
					player.changeSkills(["rerende"], ["shouyue"]);
				},
				ai: {
					order: 1,
					skillTagFilter(player, arg, target) {
						if (player != target || player.storage.jizhao) return false;
					},
					save: true,
					result: {
						player: 10,
					},
				},
				intro: {
					content: "limited",
				},
			},
			gzshoucheng: {
				inherit: "shoucheng",
				audio: "shoucheng",
				preHidden: true,
				filter(event, player) {
					return game.hasPlayer(function (current) {
						if (current == _status.currentPhase || !current.isFriendOf(player)) return false;
						var evt = event.getl(current);
						return evt && evt.hs && evt.hs.length && current.countCards("h") == 0;
					});
				},
				content() {
					"step 0";
					event.list = game
						.filterPlayer(function (current) {
							if (current == _status.currentPhase || !current.isFriendOf(player)) return false;
							var evt = trigger.getl(current);
							return evt && evt.hs && evt.hs.length;
						})
						.sortBySeat(_status.currentPhase);
					"step 1";
					var target = event.list.shift();
					event.target = target;
					if (target.isAlive() && target.countCards("h") == 0) {
						player
							.chooseBool(get.prompt2("gzshoucheng", target))
							.set("ai", function () {
								return get.attitude(_status.event.player, _status.event.getParent().target) > 0;
							})
							.setHiddenSkill(event.name);
					} else event.goto(3);
					"step 2";
					if (result.bool) {
						player.logSkill(event.name, target);
						target.draw();
					}
					"step 3";
					if (event.list.length) event.goto(1);
				},
			},
			gzyicheng: {
				audio: "yicheng",
				trigger: {
					global: ["useCardToPlayered", "useCardToTargeted"],
				},
				preHidden: true,
				//frequent:true,
				direct: true,
				filter(event, player) {
					if (event.card.name != "sha") return false;
					if (event.name == "useCardToPlayered" && !event.isFirstTarget) return false;
					var target = lib.skill.gzyicheng.logTarget(event, player);
					if (target == player) return true;
					return target.inline(player) && target.isAlive() && player.hasSkill("gzyicheng");
				},
				logTarget(event, player) {
					return event.name == "useCardToPlayered" ? event.player : event.target;
				},
				content() {
					"step 0";
					var target = lib.skill.gzyicheng.logTarget(trigger, player);
					event.target = target;
					target.chooseBool(get.prompt("gzyicheng"), "摸一张牌，然后弃置一张牌").set("frequentSkill", "gzyicheng");
					"step 1";
					if (result.bool) {
						player.logSkill("gzyicheng", target);
						target.draw();
						target.chooseToDiscard("he", true);
					}
				},
			},
			yicheng: {
				audio: 2,
				trigger: { global: "useCardToTargeted" },
				filter(event, player) {
					return event.card.name == "sha" && event.target.isFriendOf(player);
				},
				preHidden: true,
				logTarget: "target",
				content() {
					"step 0";
					event.targets[0].draw();
					"step 1";
					event.targets[0].chooseToDiscard("he", true);
				},
			},
			gzjixi: {
				inherit: "jixi",
				audio: "jixi",
				mainSkill: true,
				init(player) {
					if (player.checkMainSkill("gzjixi")) {
						player.removeMaxHp();
					}
				},
			},
			ziliang: {
				audio: 2,
				trigger: { global: "damageEnd" },
				filter(event, player) {
					return event.player.isIn() && event.player.isFriendOf(player) && player.getExpansions("tuntian").length;
				},
				init(player) {
					player.checkViceSkill("ziliang");
				},
				viceSkill: true,
				direct: true,
				content() {
					"step 0";
					player.chooseCardButton(get.prompt("ziliang", trigger.player), player.getExpansions("tuntian")).set("ai", function (button) {
						return get.value(button.link);
					});
					"step 1";
					if (result.bool) {
						var card = result.links[0];
						player.logSkill("ziliang", trigger.player);
						player.give(card, trigger.player);
					}
				},
			},
			gzhuyuan: {
				audio: "huyuan",
				trigger: { player: "phaseJieshuBegin" },
				direct: true,
				preHidden: true,
				filter(event, player) {
					return player.countCards("he") > 0;
				},
				content() {
					"step 0";
					player
						.chooseCardTarget({
							filterCard: true,
							position: "he",
							filterTarget(card, player, target) {
								if (player == target) return false;
								var card = ui.selected.cards[0];
								if (get.type(card) != "equip") return true;
								return target.canEquip(card);
							},
							prompt: get.prompt2("gzhuyuan"),
							complexSelect: true,
							ai1(card) {
								if (!_status.event.goon) return false;
								var player = _status.event.player;
								if (get.type(card) != "equip") return 0;
								return 7.5 - get.value(card);
							},
							ai2(target) {
								if (!_status.event.goon) return false;
								var player = _status.event.player,
									card = ui.selected.cards[0];
								return get.effect(target, card, player, player);
							},
							goon: game.hasPlayer(function (current) {
								return get.effect(current, { name: "guohe_copy", position: "ej" }, player, player) > 0;
							}),
						})
						.setHiddenSkill("gzhuyuan");
					"step 1";
					if (result.bool) {
						var target = result.targets[0],
							card = result.cards[0];
						player.logSkill("gzhuyuan", target);
						if (get.type(card) == "equip") {
							player.$give(card, target, false);
							game.delayx();
							target.equip(card);
						} else {
							player.give(card, target);
							event.finish();
						}
					} else event.finish();
					"step 2";
					if (
						game.hasPlayer(function (current) {
							return current.hasCard(function (card) {
								return lib.filter.canBeDiscarded(card, player, current);
							}, "ej");
						})
					) {
						player
							.chooseTarget("是否弃置场上的一张牌？", function (card, player, target) {
								return target.hasCard(function (card) {
									return lib.filter.canBeDiscarded(card, player, target);
								}, "ej");
							})
							.set("ai", function (target) {
								const player = _status.event.player;
								return get.effect(target, { name: "guohe_copy", position: "ej" }, player, player);
							});
					} else event.finish();
					"step 3";
					if (result.bool) {
						var target = result.targets[0];
						player.line(target, "thunder");
						player.discardPlayerCard(target, true, "ej");
					}
				},
			},
			huyuan: {
				audio: 2,
				trigger: { player: "phaseJieshuBegin" },
				direct: true,
				preHidden: true,
				filter(event, player) {
					return player.countCards("he", { type: "equip" }) > 0;
				},
				content() {
					"step 0";
					player
						.chooseCardTarget({
							filterCard(card) {
								return get.type(card) == "equip";
							},
							position: "he",
							filterTarget(card, player, target) {
								return target.canEquip(card);
							},
							ai1(card) {
								return 6 - get.value(card);
							},
							ai2(target) {
								return get.attitude(_status.event.player, target) - 3;
							},
							prompt: get.prompt2("huyuan"),
						})
						.setHiddenSkill("huyuan");
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill("huyuan", target);
						event.current = target;
						target.equip(result.cards[0]);
						if (target != player) {
							player.$give(result.cards, target, false);
							game.delay(2);
						}
						player
							.chooseTarget("弃置一名角色的一张牌", function (card, player, target) {
								var source = _status.event.source;
								return get.distance(source, target) <= 1 && source != target && target.countCards("he");
							})
							.set("ai", function (target) {
								var player = _status.event.player;
								return get.effect(target, { name: "guohe_copy2" }, player, player);
							})
							.set("source", target);
					} else {
						event.finish();
					}
					"step 2";
					if (result.bool && result.targets.length) {
						event.current.line(result.targets, "green");
						player.discardPlayerCard(true, result.targets[0], "he");
					}
				},
			},
			heyi: {
				zhenfa: "inline",
				global: "heyi_distance",
			},
			heyi_distance: {
				mod: {
					globalTo(from, to, distance) {
						if (
							game.hasPlayer(function (current) {
								return current.hasSkill("heyi") && current.inline(to);
							})
						) {
							return distance + 1;
						}
					},
				},
			},
			tianfu: {
				init(player) {
					player.checkMainSkill("tianfu");
				},
				mainSkill: true,
				inherit: "kanpo",
				zhenfa: "inline",
				viewAsFilter(player) {
					return _status.currentPhase && _status.currentPhase.inline(player) && !player.hasSkill("kanpo") && player.countCards("h", { color: "black" }) > 0;
				},
			},
			yizhi: {
				init(player) {
					if (player.checkViceSkill("yizhi") && !player.viceChanged) {
						player.removeMaxHp();
					}
				},
				viceSkill: true,
				inherit: "guanxing",
				filter(event, player) {
					return !player.hasSkill("guanxing");
				},
			},
			gzshangyi: {
				audio: "shangyi",
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					return player.countCards("h") > 0;
				},
				filterTarget(card, player, target) {
					return player != target && (target.countCards("h") || target.isUnseen(2));
				},
				content() {
					"step 0";
					target.viewHandcards(player);
					"step 1";
					if (!target.countCards("h")) {
						event._result = { index: 1 };
					} else if (!target.isUnseen(2)) {
						event._result = { index: 0 };
					} else {
						player.chooseControl().set("choiceList", ["观看" + get.translation(target) + "的手牌并可以弃置其中的一张黑色牌", "观看" + get.translation(target) + "的所有暗置的武将牌"]);
					}
					"step 2";
					if (result.index == 0) {
						player
							.discardPlayerCard(target, "h")
							.set("filterButton", function (button) {
								return get.color(button.link) == "black";
							})
							.set("visible", true);
					} else {
						player.viewCharacter(target, 2);
					}
				},
				ai: {
					order: 11,
					result: {
						target(player, target) {
							return -target.countCards("h");
						},
					},
					threaten: 1.1,
				},
			},
			niaoxiang: {
				zhenfa: "siege",
				audio: "zniaoxiang",
				global: "niaoxiang_sha",
				preHidden: true,
				trigger: { global: "useCardToPlayered" },
				filter(event, player) {
					if (event.card.name != "sha") return false;
					if (game.countPlayer() < 4) return false;
					return player.siege(event.target) && event.player.siege(event.target);
				},
				forced: true,
				locked: false,
				forceaudio: true,
				logTarget: "target",
				content() {
					var id = trigger.target.playerid;
					var map = trigger.getParent().customArgs;
					if (!map[id]) map[id] = {};
					if (typeof map[id].shanRequired == "number") {
						map[id].shanRequired++;
					} else {
						map[id].shanRequired = 2;
					}
				},
			},
			fengshi: {
				audio: "zfengshi",
				zhenfa: "siege",
				trigger: { global: "useCardToPlayered" },
				filter(event, player) {
					if (event.card.name != "sha" || game.countPlayer() < 4) return false;
					return player.siege(event.target) && event.player.siege(event.target) && event.target.countCards("e");
				},
				logTarget: "target",
				content() {
					trigger.target.chooseToDiscard("e", true);
				},
			},
			gzguixiu: {
				unique: true,
				audio: "guixiu",
				trigger: { player: ["showCharacterAfter", "removeCharacterBefore"] },
				filter(event, player) {
					if (event.name == "removeCharacter" || event.name == "changeVice") return get.character(event.toRemove, 3).includes("gzguixiu") && player.isDamaged();
					return event.toShow.some(name => {
						return get.character(name, 3).includes("gzguixiu");
					});
				},
				content() {
					if (trigger.name == "showCharacter") {
						player.draw(2);
					} else {
						player.recover();
					}
				},
			},
			gzcunsi: {
				derivation: "gzyongjue",
				enable: "phaseUse",
				audio: "cunsi",
				filter(event, player) {
					return player.checkMainSkill("gzcunsi", false) || player.checkViceSkill("gzcunsi", false);
				},
				unique: true,
				forceunique: true,
				filterTarget: true,
				skillAnimation: true,
				animationColor: "orange",
				content() {
					"step 0";
					if (player.checkMainSkill("gzcunsi", false)) {
						player.removeCharacter(0);
					} else {
						player.removeCharacter(1);
					}
					"step 1";
					target.addSkills("gzyongjue");
					if (target != player) {
						target.draw(2);
					}
				},
				ai: {
					order: 9,
					result: {
						player(player, target) {
							var num = 0;
							if (player.isDamaged() && target.isFriendOf(player)) {
								num++;
								if (target.hasSkill("kanpo")) num += 0.5;
								if (target.hasSkill("liegong")) num += 0.5;
								if (target.hasSkill("tieji")) num += 0.5;
								if (target.hasSkill("gzrende")) num += 1.2;
								if (target.hasSkill("longdan")) num += 1.2;
								if (target.hasSkill("paoxiao")) num += 1.2;
								if (target.hasSkill("zhangwu")) num += 1.5;
								if (target != player) num += 0.5;
							}
							return num;
						},
					},
				},
			},
			gzyongjue: {
				audio: "yongjue",
				trigger: { global: "useCardAfter" },
				filter(event, player) {
					if (event == event.player.getHistory("useCard")[0] && event.card.name == "sha" && _status.currentPhase == event.player && event.player.isFriendOf(player)) {
						for (var i = 0; i < event.cards.length; i++) {
							if (get.position(event.cards[i], true) == "o") {
								return true;
							}
						}
					}
					return false;
				},
				mark: true,
				intro: {
					content: "若与你势力相同的一名角色于其回合内使用的第一张牌为【杀】，则该角色可以在此【杀】结算完成后获得之",
				},
				content() {
					var cards = [];
					for (var i = 0; i < trigger.cards.length; i++) {
						if (get.position(trigger.cards[i], true) == "o") {
							cards.push(trigger.cards[i]);
						}
					}
					trigger.player.gain(cards, "gain2");
				},
				global: "gzyongjue_ai",
			},
			gzyongjue_ai: {
				ai: {
					presha: true,
					skillTagFilter(player) {
						if (
							!game.hasPlayer(function (current) {
								return current.isFriendOf(player) && current.hasSkill("gzyongjue");
							})
						) {
							return false;
						}
					},
				},
			},
			baoling: {
				trigger: { player: "phaseUseEnd" },
				init(player) {
					player.checkMainSkill("baoling");
				},
				mainSkill: true,
				forced: true,
				preHidden: true,
				filter(event, player) {
					return player.hasViceCharacter();
				},
				check(event, player) {
					return player.hp <= 1 || get.guozhanRank(player.name2, player) <= 3;
				},
				content() {
					"step 0";
					player.removeCharacter(1);
					"step 1";
					player.removeSkills("baoling");
					player.gainMaxHp(3, true);
					"step 2";
					player.recover(3);
					player.addSkills("benghuai");
				},
				derivation: "benghuai",
			},
			gzmingshi: {
				audio: "mingshi",
				trigger: { player: "damageBegin3" },
				forced: true,
				preHidden: true,
				filter(event, player) {
					return event.num > 0 && event.source && event.source.isUnseen(2);
				},
				content() {
					trigger.num--;
				},
				ai: {
					effect: {
						target(card, player, target) {
							if (player.hasSkillTag("jueqing", false, target)) return;
							if (!player.isUnseen(2)) return;
							var num = get.tag(card, "damage");
							if (num) {
								if (num > 1) return 0.5;
								return 0;
							}
						},
					},
				},
			},
			hunshang: {
				init(player) {
					if (player.checkViceSkill("hunshang") && !player.viceChanged) {
						player.removeMaxHp();
					}
				},
				viceSkill: true,
				group: ["hunshang_yingzi", "hunshang_yinghun"],
			},
			reyingzi_sunce: { audio: 2 },
			yinghun_sunce: { audio: 2 },
			hunshang_yingzi: {
				inherit: "yingzi",
				audio: "reyingzi_sunce",
				filter(event, player) {
					return player.hp <= 1 && !player.hasSkill("yingzi");
				},
			},
			hunshang_yinghun: {
				inherit: "yinghun",
				audio: "yinghun_sunce",
				filter(event, player) {
					return player.hp <= 1 && player.isDamaged() && !player.hasSkill("yinghun");
				},
			},
			yingyang: {
				audio: 2,
				trigger: { player: "compare", target: "compare" },
				filter(event) {
					return !event.iwhile;
				},
				direct: true,
				preHidden: true,
				content() {
					"step 0";
					player
						.chooseControl("点数+3", "点数-3", "cancel2")
						.set("prompt", get.prompt2("yingyang"))
						.set("ai", function () {
							if (_status.event.small) return 1;
							else return 0;
						})
						.set("small", trigger.small);
					"step 1";
					if (result.index != 2) {
						player.logSkill("yingyang");
						if (result.index == 0) {
							game.log(player, "拼点牌点数+3");
							if (player == trigger.player) {
								trigger.num1 += 3;
								if (trigger.num1 > 13) trigger.num1 = 13;
							} else {
								trigger.num2 += 3;
								if (trigger.num2 > 13) trigger.num2 = 13;
							}
						} else {
							game.log(player, "拼点牌点数-3");
							if (player == trigger.player) {
								trigger.num1 -= 3;
								if (trigger.num1 < 1) trigger.num1 = 1;
							} else {
								trigger.num2 -= 3;
								if (trigger.num2 < 1) trigger.num2 = 1;
							}
						}
					}
				},
			},
			gzqianxi: {
				audio: "qianxi",
				trigger: { player: "phaseZhunbeiBegin" },
				content() {
					"step 0";
					player.judge();
					"step 1";
					event.color = result.color;
					player
						.chooseTarget(function (card, player, target) {
							return player != target && get.distance(player, target) <= 1;
						}, true)
						.set("ai", function (target) {
							return -get.attitude(_status.event.player, target);
						});
					"step 2";
					if (result.bool && result.targets.length) {
						result.targets[0].storage.qianxi2 = event.color;
						result.targets[0].addSkill("qianxi2");
						player.line(result.targets, "green");
						game.addVideo("storage", result.targets[0], ["qianxi2", event.color]);
					}
				},
			},
			gzduanchang: {
				audio: "duanchang",
				trigger: { player: "die" },
				forced: true,
				forceDie: true,
				filter(event, player) {
					return event.source && event.source.isIn() && event.source != player && (event.source.hasMainCharacter() || event.source.hasViceCharacter());
				},
				content() {
					"step 0";
					if (!trigger.source.hasViceCharacter()) {
						event._result = { control: "主将" };
					} else if (!trigger.source.hasMainCharacter()) {
						event._result = { control: "副将" };
					} else {
						player
							.chooseControl("主将", "副将", function () {
								return _status.event.choice;
							})
							.set("prompt", "令" + get.translation(trigger.source) + "失去一张武将牌的所有技能")
							.set("forceDie", true)
							.set(
								"choice",
								(function () {
									var rank = get.guozhanRank(trigger.source.name1, trigger.source) - get.guozhanRank(trigger.source.name2, trigger.source);
									if (rank == 0) rank = Math.random() > 0.5 ? 1 : -1;
									return rank * get.attitude(player, trigger.source) > 0 ? "副将" : "主将";
								})()
							);
					}
					"step 1";
					var skills;
					if (result.control == "主将") {
						trigger.source.showCharacter(0);
						game.broadcastAll(function (player) {
							player.node.avatar.classList.add("disabled");
						}, trigger.source);
						skills = lib.character[trigger.source.name][3];
						game.log(trigger.source, "失去了主将技能");
					} else {
						trigger.source.showCharacter(1);
						game.broadcastAll(function (player) {
							player.node.avatar2.classList.add("disabled");
						}, trigger.source);
						skills = lib.character[trigger.source.name2][3];
						game.log(trigger.source, "失去了副将技能");
					}
					var list = [];
					for (var i = 0; i < skills.length; i++) {
						list.add(skills[i]);
						var info = lib.skill[skills[i]];
						if (info.charlotte) {
							list.splice(i--);
							continue;
						}
						if (typeof info.derivation == "string") {
							list.add(info.derivation);
						} else if (Array.isArray(info.derivation)) {
							list.addArray(info.derivation);
						}
					}
					trigger.source.removeSkill(list);
					trigger.source.syncSkills();
					player.line(trigger.source, "green");
				},
				logTarget: "source",
				ai: {
					threaten(player, target) {
						if (target.hp == 1) return 0.2;
						return 1.5;
					},
					effect: {
						target(card, player, target, current) {
							if (!target.hasFriend()) return;
							if (target.hp <= 1 && get.tag(card, "damage")) return [1, 0, 0, -2];
						},
					},
				},
			},
			gzweimu: {
				audio: "weimu",
				trigger: { target: "useCardToTarget", player: "addJudgeBefore" },
				forced: true,
				priority: 15,
				preHidden: true,
				check(event, player) {
					return event.name == "addJudge" || (event.card.name != "chiling" && get.effect(event.target, event.card, event.player, player) < 0);
				},
				filter(event, player) {
					if (event.name == "addJudge") return get.color(event.card) == "black";
					return get.type(event.card, null, false) == "trick" && get.color(event.card) == "black";
				},
				content() {
					if (trigger.name == "addJudge") {
						trigger.cancel();
						var owner = get.owner(trigger.card);
						if (owner && owner.getCards("hej").includes(trigger.card)) owner.lose(trigger.card, ui.discardPile);
						else game.cardsDiscard(trigger.card);
						game.log(trigger.card, "进入了弃牌堆");
					} else trigger.getParent().targets.remove(player);
				},
				ai: {
					effect: {
						target(card, player, target, current) {
							if (get.type(card, "trick") == "trick" && get.color(card) == "black") return "zeroplayertarget";
						},
					},
				},
			},
			gzqianxun: {
				audio: "qianxun",
				trigger: {
					target: "useCardToTarget",
					player: "addJudgeBefore",
				},
				forced: true,
				preHidden: true,
				priority: 15,
				check(event, player) {
					return event.name == "addJudge" || get.effect(event.target, event.card, event.player, player) < 0;
				},
				filter(event, player) {
					return event.card.name == (event.name == "addJudge" ? "lebu" : "shunshou");
				},
				content() {
					if (trigger.name == "addJudge") {
						trigger.cancel();
						var owner = get.owner(trigger.card);
						if (owner && owner.getCards("hej").includes(trigger.card)) owner.lose(trigger.card, ui.discardPile);
						else game.cardsDiscard(trigger.card);
						game.log(trigger.card, "进入了弃牌堆");
					} else trigger.getParent().targets.remove(player);
				},
				ai: {
					effect: {
						target(card, player, target, current) {
							if (card.name == "shunshou" || card.name == "lebu") return "zeroplayertarget";
						},
					},
				},
			},
			gzkongcheng: {
				audio: "kongcheng",
				trigger: { target: "useCardToTarget" },
				forced: true,
				priority: 15,
				check(event, player) {
					return get.effect(event.target, event.card, event.player, player) < 0;
				},
				filter(event, player) {
					return player.countCards("h") == 0 && (event.card.name == "sha" || event.card.name == "juedou");
				},
				content() {
					trigger.getParent().targets.remove(player);
				},
				ai: {
					effect: {
						target(card, player, target, current) {
							if (target.countCards("h") == 0 && (card.name == "sha" || card.name == "juedou")) return "zeroplayertarget";
						},
					},
				},
			},
			gzxiaoji: {
				inherit: "xiaoji",
				audio: "xiaoji",
				preHidden: true,
				getIndex(event, player) {
					const evt = event.getl(player);
					if (evt && evt.player === player && evt.es && evt.es.length) return 1;
					return false;
				},
				content() {
					player.draw(player == _status.currentPhase ? 1 : 3);
				},
			},
			gzrende: {
				audio: "rende",
				group: ["gzrende1"],
				enable: "phaseUse",
				filterCard: true,
				selectCard: [1, Infinity],
				discard: false,
				prepare: "give",
				filterTarget(card, player, target) {
					return player != target;
				},
				check(card) {
					if (ui.selected.cards.length > 2) return 0;
					if (ui.selected.cards.length && ui.selected.cards[0].name == "du") return 0;
					if (!ui.selected.cards.length && card.name == "du") return 20;
					var player = get.owner(card);
					if (player.hp == player.maxHp || player.storage.gzrende < 0 || player.countCards("h") + player.storage.gzrende <= 2) {
						if (ui.selected.cards.length) {
							return -1;
						}
						var players = game.filterPlayer();
						for (var i = 0; i < players.length; i++) {
							if (players[i].hasSkill("haoshi") && !players[i].isTurnedOver() && !players[i].hasJudge("lebu") && get.attitude(player, players[i]) >= 3 && get.attitude(players[i], player) >= 3) {
								return 11 - get.value(card);
							}
						}
						if (player.countCards("h") > player.hp) return 10 - get.value(card);
						if (player.countCards("h") > 2) return 6 - get.value(card);
						return -1;
					}
					return 10 - get.value(card);
				},
				content() {
					target.gain(cards, player);
					if (typeof player.storage.gzrende != "number") {
						player.storage.gzrende = 0;
					}
					if (player.storage.gzrende >= 0) {
						player.storage.gzrende += cards.length;
						if (player.storage.gzrende >= 3) {
							player.recover();
							player.storage.gzrende = -1;
						}
					}
				},
				ai: {
					order(skill, player) {
						if (player.hp == player.maxHp || player.storage.gzrende < 0 || player.countCards("h") + player.storage.gzrende <= 2) {
							return 1;
						}
						return 10;
					},
					result: {
						target(player, target) {
							if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
								return -10;
							}
							if (target.hasJudge("lebu")) return 0;
							var nh = target.countCards("h");
							var np = player.countCards("h");
							if (player.hp == player.maxHp || player.storage.gzrende < 0 || player.countCards("h") + player.storage.gzrende <= 2) {
								if (nh >= np - 1 && np <= player.hp && !target.hasSkill("haoshi")) return 0;
							}
							return Math.max(1, 5 - nh);
						},
					},
					effect: {
						target_use(card, player, target) {
							if (player == target && get.type(card) == "equip") {
								if (player.countCards("e", { subtype: get.subtype(card) })) {
									var players = game.filterPlayer();
									for (var i = 0; i < players.length; i++) {
										if (players[i] != player && get.attitude(player, players[i]) > 0) {
											return 0;
										}
									}
								}
							}
						},
					},
					threaten: 0.8,
				},
			},
			gzrende1: {
				trigger: { player: "phaseUseBegin" },
				silent: true,
				content() {
					player.storage.gzrende = 0;
				},
			},
			gzzhiheng: {
				inherit: "zhiheng",
				audio: "zhiheng",
				selectCard() {
					var player = _status.event.player;
					var range1 = [1, player.maxHp];
					if (player.hasSkill("dinglanyemingzhu_skill")) {
						for (var i = 0; i < ui.selected.cards.length; i++) {
							if (ui.selected.cards[i] == player.getEquip("dinglanyemingzhu")) return range1;
						}
						return [1, Infinity];
					}
					return range1;
				},
				filterCard(card, player) {
					if (ui.selected.cards.length < player.maxHp || !player.hasSkill("dinglanyemingzhu_skill")) return true;
					return card != player.getEquip("dinglanyemingzhu");
				},
				complexCard: true,
				complexSelect: true,
				prompt() {
					var player = _status.event.player;
					if (player.hasSkill("dinglanyemingzhu_skill")) return "出牌阶段限一次，你可以弃置任意张牌，然后摸等量的牌";
					return "出牌阶段限一次，你可以弃置至多X张牌（X为你的体力上限），然后摸等量的牌";
				},
			},
			duoshi: {
				enable: "chooseToUse",
				viewAs: { name: "yiyi" },
				usable: 4,
				filterCard: { color: "red" },
				position: "hs",
				viewAsFilter(player) {
					return player.countCards("hs", { color: "red" }) > 0;
				},
				check(card) {
					return 5 - get.value(card);
				},
			},
			gzxiaoguo: {
				inherit: "xiaoguo",
				audio: "xiaoguo",
				preHidden: true,
				content() {
					"step 0";
					var nono = Math.abs(get.attitude(player, trigger.player)) < 3;
					if (get.damageEffect(trigger.player, player, player) <= 0) {
						nono = true;
					}
					var next = player.chooseToDiscard(get.prompt2("gzxiaoguo", trigger.player), {
						type: "basic",
					});
					next.set("ai", function (card) {
						if (_status.event.nono) return 0;
						return 8 - get.useful(card);
					});
					next.set("logSkill", ["gzxiaoguo", trigger.player]);
					next.set("nono", nono);
					next.setHiddenSkill("gzxiaoguo");
					"step 1";
					if (result.bool) {
						var nono = get.damageEffect(trigger.player, player, trigger.player) >= 0;
						trigger.player
							.chooseToDiscard("弃置一张装备牌，或受到1点伤害", "he", { type: "equip" })
							.set("ai", function (card) {
								if (_status.event.nono) {
									return 0;
								}
								if (_status.event.player.hp == 1) return 10 - get.value(card);
								return 9 - get.value(card);
							})
							.set("nono", nono);
					} else {
						event.finish();
					}
					"step 2";
					if (!result.bool) {
						trigger.player.damage();
					}
				},
			},
			_mingzhi1: {
				trigger: { player: "phaseBeginStart" },
				//priority:19,
				ruleSkill: true,
				forced: true,
				popup: false,
				filter(event, player) {
					return player.isUnseen(2) && !player.hasSkillTag("nomingzhi", false, null, true);
				},
				content() {
					"step 0";
					if (player.phaseNumber == 1 && player.isUnseen(0) && (_status.connectMode ? lib.configOL.junzhu : get.config("junzhu"))) {
						var name = player.name1;
						if (name.indexOf("gz_") != 0 || !lib.junList.includes(name.slice(3))) {
							event.goto(3);
						} else {
							event.junzhu_name = "gz_jun_" + name.slice(3);
							player.chooseBool("是否将主武将牌替换为“" + get.translation(event.junzhu_name) + "”？");
						}
					} else event.goto(3);
					"step 1";
					if (result.bool) {
						var to = event.junzhu_name;
						event.maxHp = player.maxHp;
						player.reinit(player.name1, to, 4);

						// 修改君主亮将配音播放
						var map = {
							gz_jun_liubei: "shouyue",
							gz_jun_zhangjiao: "hongfa",
							gz_jun_sunquan: "jiahe",
							gz_jun_caocao: "jianan",
						};
						game.trySkillAudio(map[to], player);

						player.showCharacter(0);
						var group = lib.character[to][1];
						var yelist = game.filterPlayer(function (current) {
							if (current.identity != "ye") return false;
							if (current == player) return true;
							return current.group == group;
						});
						if (yelist.length > 0) {
							player.line(yelist, "green");
							game.log(yelist, "失去了野心家身份");
							game.broadcastAll(
								function (list, group) {
									for (var i = 0; i < list.length; i++) {
										list[i].identity = group;
										list[i].group = group;
										list[i].setIdentity();
									}
								},
								yelist,
								player.group
							);
						}
						game.tryResult();
					} else event.goto(3);
					"step 2";
					if (player.maxHp > event.maxHp) player.recover(player.maxHp - event.maxHp);
					"step 3";
					var choice = 1;
					for (var i = 0; i < player.hiddenSkills.length; i++) {
						if (lib.skill[player.hiddenSkills[i]].ai) {
							var mingzhi = lib.skill[player.hiddenSkills[i]].ai.mingzhi;
							if (mingzhi == false) {
								choice = 0;
								break;
							}
							if (typeof mingzhi == "function" && mingzhi(trigger, player) == false) {
								choice = 0;
								break;
							}
						}
					}
					if (player.isUnseen()) {
						var group = lib.character[player.name1][1];
						player.chooseControl("bumingzhi", "明置" + get.translation(player.name1), "明置" + get.translation(player.name2), "tongshimingzhi", true).ai = function (event, player) {
							if (player.hasSkillTag("mingzhi_yes")) return get.rand(1, 2);
							if (player.hasSkillTag("mingzhi_no")) return 0;
							var popu = get.population(lib.character[player.name1][1]);
							if (popu >= 2 || (popu == 1 && game.players.length <= 4)) {
								return Math.random() < 0.5 ? 3 : Math.random() < 0.5 ? 2 : 1;
							}
							if (choice == 0) return 0;
							if (get.population(group) > 0 && player.wontYe()) {
								return Math.random() < 0.2 ? (Math.random() < 0.5 ? 3 : Math.random() < 0.5 ? 2 : 1) : 0;
							}
							var nming = 0;
							for (var i = 0; i < game.players.length; i++) {
								if (game.players[i] != player && game.players[i].identity != "unknown") {
									nming++;
								}
							}
							if (nming == game.players.length - 1) return Math.random() < 0.5 ? (Math.random() < 0.5 ? 3 : Math.random() < 0.5 ? 2 : 1) : 0;
							return Math.random() < (0.1 * nming) / game.players.length ? (Math.random() < 0.5 ? 3 : Math.random() < 0.5 ? 2 : 1) : 0;
						};
					} else {
						if (Math.random() < 0.5) choice = 0;
						if (player.isUnseen(0)) {
							player.chooseControl("bumingzhi", "明置" + get.translation(player.name1), true).choice = choice;
						} else if (player.isUnseen(1)) {
							player.chooseControl("bumingzhi", "明置" + get.translation(player.name2), true).choice = choice;
						} else {
							event.finish();
						}
					}
					"step 4";
					switch (result.control) {
						case "明置" + get.translation(player.name1):
							player.showCharacter(0);
							break;
						case "明置" + get.translation(player.name2):
							player.showCharacter(1);
							break;
						case "tongshimingzhi":
							player.showCharacter(2);
							break;
					}
				},
			},
			_mingzhi2: {
				trigger: { player: "triggerHidden" },
				forced: true,
				forceDie: true,
				popup: false,
				priority: 10,
				content() {
					"step 0";
					if (get.info(trigger.skill).silent) {
						event.finish();
					} else {
						event.skillHidden = true;
						var bool1 = game.expandSkills(lib.character[player.name1][3]).includes(trigger.skill);
						var bool2 = game.expandSkills(lib.character[player.name2][3]).includes(trigger.skill);
						var nai = function () {
							var player = _status.event.player;
							if (!_status.event.yes) return false;
							if (player.hasSkillTag("mingzhi_no")) return false;
							if (player.hasSkillTag("mingzhi_yes")) return true;
							if (player.identity != "unknown") return true;
							if (Math.random() < 0.5) return true;
							var info = get.info(_status.event.hsskill);
							if (info && info.ai && info.ai.mingzhi == true) return true;
							if (info && info.ai && info.ai.maixie) return true;
							var group = lib.character[player.name1][1];
							var popu = get.population(lib.character[player.name1][1]);
							if (popu >= 2 || (popu == 1 && game.players.length <= 4)) {
								return true;
							}
							if (get.population(group) > 0 && player.wontYe()) {
								return Math.random() < 0.2 ? true : false;
							}
							var nming = 0;
							for (var i = 0; i < game.players.length; i++) {
								if (game.players[i] != player && game.players[i].identity != "unknown") {
									nming++;
								}
							}
							if (nming == game.players.length - 1) return Math.random() < 0.5 ? true : false;
							return Math.random() < (0.1 * nming) / game.players.length ? true : false;
						};
						if (bool1 && bool2) {
							event.name = player.name1;
							event.name2 = player.name2;
						} else {
							event.name = bool1 ? player.name1 : player.name2;
						}
						var info = get.info(trigger.skill);
						var next = player.chooseBool("是否明置" + get.translation(event.name) + "以发动【" + get.translation(trigger.skill) + "】？");
						next.set("yes", !info.check || info.check(trigger._trigger, player, trigger.triggername, trigger.indexedData));
						next.set("hsskill", trigger.skill);
						next.set("ai", nai);
					}
					"step 1";
					if (result.bool) {
						if (event.name == player.name1) player.showCharacter(0);
						else player.showCharacter(1);
						trigger.revealed = true;
						event.finish();
					} else if (event.name2) {
						var info = get.info(trigger.skill);
						var next = player.chooseBool("是否明置" + get.translation(event.name2) + "以发动【" + get.translation(trigger.skill) + "】？");
						next.set("yes", !info.check || info.check(trigger._trigger, player));
						next.set("ai", function () {
							return _status.event.yes;
						});
					} else {
						event.finish();
						trigger.untrigger();
						trigger.cancelled = true;
					}
					"step 2";
					if (event.name2) {
						if (result.bool) {
							player.showCharacter(1);
							trigger.revealed = true;
						} else {
							trigger.untrigger();
							trigger.cancelled = true;
						}
					}
				},
			},
			_zhenfazhaohuan: {
				enable: "phaseUse",
				usable: 1,
				getConfig(player, target) {
					if (target == player || !target.isUnseen()) return false;
					var config = {};
					var skills = player.getSkills();
					for (var i = 0; i < skills.length; i++) {
						var info = get.info(skills[i]).zhenfa;
						if (info) {
							config[info] = true;
						}
					}
					if (config.inline) {
						var next = target.getNext();
						var previous = target.getPrevious();
						if (next == player || previous == player || (next && next.inline(player)) || (previous && previous.inline(player))) return true;
					}
					if (config.siege) {
						if (target == player.getNext().getNext() || target == player.getPrevious().getPrevious()) return true;
					}
					return false;
				},
				filter(event, player) {
					if (player.identity == "ye" || player.identity == "unknown" || !player.wontYe(player.identity)) return false;
					if (player.hasSkill("undist")) return false;
					if (
						game.countPlayer(function (current) {
							return !current.hasSkill("undist");
						}) < 4
					)
						return false;
					return game.hasPlayer(function (current) {
						return lib.skill._zhenfazhaohuan.getConfig(player, current);
					});
				},
				content() {
					"step 0";
					event.list = game
						.filterPlayer(function (current) {
							return current.isUnseen();
						})
						.sortBySeat();
					"step 1";
					var target = event.list.shift();
					event.target = target;
					if (target.wontYe(player.identity) && lib.skill._zhenfazhaohuan.getConfig(player, target)) {
						player.line(target, "green");
						var list = [];
						if (target.getGuozhanGroup(0) == player.identity) list.push("明置" + get.translation(target.name1));
						if (target.getGuozhanGroup(1) == player.identity) list.push("明置" + get.translation(target.name2));
						if (list.length > 0) {
							target
								.chooseControl(list, "cancel2")
								.set("prompt", "是否响应" + get.translation(player) + "发起的阵法召唤？")
								.set("ai", function () {
									return Math.random() < 0.5 ? 0 : 1;
								});
						} else event.goto(3);
					} else event.goto(3);
					"step 2";
					if (result.control != "cancel2") {
						if (result.control == "明置" + get.translation(target.name1)) {
							target.showCharacter(0);
						} else {
							target.showCharacter(1);
						}
					}
					"step 3";
					if (event.list.length) event.goto(1);
					"step 4";
					game.delay();
				},
				ai: {
					order: 5,
					result: {
						player: 1,
					},
				},
			},
			ushio_huanxin: {
				trigger: {
					player: ["damageEnd", "useCardAfter"],
					source: "damageSource",
				},
				frequent: true,
				preHidden: true,
				filter(event, player, name) {
					if (name == "useCardAfter") return get.type(event.card) == "equip";
					if (name == "damageEnd") return true;
					return event.getParent().name == "sha";
				},
				content() {
					player.judge().set("callback", function () {
						var card = event.judgeResult.card;
						if (card && get.position(card, true) == "o") {
							player.gain(card, "gain2");
							player.chooseToDiscard(true, "he");
						}
					});
				},
			},
			ushio_xilv: {
				trigger: { player: "judgeEnd" },
				forced: true,
				preHidden: true,
				content() {
					player.addTempSkill("ushio_xilv2", { player: "phaseJieshu" });
					player.addMark("ushio_xilv2", 1, false);
				},
			},
			ushio_xilv2: {
				onremove: true,
				charlotte: true,
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("ushio_xilv2");
					},
				},
				intro: {
					content: "手牌上限+#",
				},
			},
		},
		game: {
			canReplaceViewpoint: () => true,
			showYexings() {
				if (_status.showYexings) return;
				_status.showYexings = true;
				var next = game.createEvent("showYexings", false);
				next.setContent(function () {
					"step 0";
					event.targets = game
						.filterPlayer(function (current) {
							return lib.character[current.name1][1] == "ye";
						})
						.sortBySeat(_status.currentPhase);
					event.targets2 = [];
					"step 1";
					var target = targets.shift();
					event.target = target;
					target.chooseBool("是否【暴露野心】，展示主将并继续战斗？", "若选择“否”，则视为本局游戏失败");
					"step 2";
					if (result.bool) {
						event.targets2.push(target);
						target.$fullscreenpop("暴露野心", "thunder");
						game.log(target, "暴露了野心");
						target.showCharacter(0);
						game.delay(2);
						if (targets.length) event.goto(1);
					} else {
						if (targets.length) event.goto(1);
						else {
							var winner = game.findPlayer(function (current) {
								return lib.character[current.name1][1] != "ye";
							});
							if (winner) {
								game.broadcastAll(function (id) {
									game.winner_id = id;
								}, winner.playerid);
								game.checkResult();
							}
							delete _status.showYexings;
							event.finish();
						}
					}
					"step 3";
					var source = event.targets2.shift();
					event.source = source;
					event.targets3 = [];
					//event.targets4=[source];
					if (!_status.yexinjia_list) _status.yexinjia_list = ["夏", "商", "周", "秦", "汉", "隋", "唐", "宋", "辽", "金", "元", "明"];
					source
						.chooseControl(_status.yexinjia_list)
						.set("prompt", "请选择自己所属的野心家势力的标识")
						.set("ai", () => (_status.yexinjia_list ? _status.yexinjia_list.randomGet() : 0));
					"step 4";
					var text,
						source = event.source;
					if (result.control) {
						text = result.control;
						_status.yexinjia_list.remove(result.control);
					} else text = _status.yexinjia_list.randomRemove();
					lib.group.push(text);
					lib.translate[text + "2"] = text;
					lib.groupnature[text] = "kami";
					event.text = text;
					game.broadcastAll(
						function (player, text) {
							player.identity = text;
							player.setIdentity(text, "kami");
						},
						source,
						text
					);
					source.changeGroup(text);
					source.removeMark("yexinjia_mark", 1);
					var targets = game.filterPlayer(function (current) {
						return current.identity != "ye" && current != source && !get.is.jun(current) && !event.targets2.includes(current) && !current.getStorage("yexinjia_friend").length;
					});
					if (!targets.length) event.goto(8);
					else event.targets = targets;
					"step 5";
					var source = event.source;
					var target = targets.shift();
					event.target = target;
					source.line(target, "green");
					target
						.chooseBool("是否响应" + get.translation(source) + "发起的【拉拢人心】？", "将势力改为" + event.text)
						.set("ai", _status.event.choice)
						.set(
							"choice",
							(function () {
								let fs = target.getFriends(true).length;
								if (game.players.length <= 2 * fs) return false;
								if (source.getFriends(true).length + fs > game.players.length / 2) return true;
								if (target.isDamaged() || target.countCards("h") < 4) return false;
								return true;
							})()
						);
					"step 6";
					if (result.bool) {
						target.chat("加入");
						//event.targets4.push(target);
						game.broadcastAll(
							function (player, text) {
								player.identity = text;
								player.setIdentity(text, "kami");
							},
							target,
							event.text
						);
						target.changeGroup(event.text);
					} else {
						target.chat("拒绝");
						event.targets3.push(target);
					}
					game.delay(1.5);
					if (targets.length) event.goto(5);
					/*
					else if(event.targets4.length){
						for(var i of event.targets4){
							i.markAuto('yexinjia_friend',event.targets4.filter(j=>j!=i));
						}
					}
					*/
					"step 7";
					if (event.targets3.length) {
						for (var i of event.targets3) {
							i.drawTo(4);
							i.recover();
						}
					}
					"step 8";
					if (event.targets2.length) event.goto(3);
					else {
						delete _status.showYexings;
						if (
							!game.hasPlayer(current => {
								return game.hasPlayer(target => {
									return !target.isFriendOf(current);
								});
							})
						) {
							game.broadcastAll(function (id) {
								game.winner_id = id;
							}, event.source.playerid);
							game.checkResult();
						}
					}
				});
			},
			getCharacterChoice(list, num) {
				var choice = list.splice(0, num).sort(function (a, b) {
					return (get.is.double(a) ? 1 : -1) - (get.is.double(b) ? 1 : -1);
				});
				var map = { wei: [], shu: [], wu: [], qun: [], key: [], jin: [], ye: [] };
				for (var i = 0; i < choice.length; i++) {
					if (get.is.double(choice[i])) {
						var group = get.is.double(choice[i], true);
						for (var ii of group) {
							if (map[ii] && map[ii].length) {
								map[ii].push(choice[i]);
								lib.character[choice[i]][1] = ii;
								group = false;
								break;
							}
						}
						if (group) choice.splice(i--, 1);
					} else {
						var group = lib.character[choice[i]][1];
						if (map[group]) {
							map[group].push(choice[i]);
						}
					}
				}
				if (map.ye.length) {
					for (var i in map) {
						if (i != "ye" && map[i].length) return choice.randomSort();
					}
					choice.remove(map.ye[0]);
					map.ye.remove(map.ye[0]);
					for (var i = 0; i < list.length; i++) {
						if (lib.character[list[i]][1] != "ye") {
							choice.push(list[i]);
							list.splice(i--, 1);
							return choice.randomSort();
						}
					}
				}
				for (var i in map) {
					if (map[i].length < 2) {
						if (map[i].length == 1) {
							choice.remove(map[i][0]);
							list.push(map[i][0]);
						}
						map[i] = false;
					}
				}
				if (choice.length == num - 1) {
					for (var i = 0; i < list.length; i++) {
						if (map[lib.character[list[i]][1]]) {
							choice.push(list[i]);
							list.splice(i--, 1);
							break;
						}
					}
				} else if (choice.length < num - 1) {
					var group = null;
					for (var i = 0; i < list.length; i++) {
						if (group) {
							if (lib.character[list[i]][1] == group || lib.character[list[i]][1] == "ye") {
								choice.push(list[i]);
								list.splice(i--, 1);
								if (choice.length >= num) {
									break;
								}
							}
						} else {
							if (!map[lib.character[list[i]][1]] && !get.is.double(list[i])) {
								group = lib.character[list[i]][1];
								if (group == "ye") group = null;
								choice.push(list[i]);
								list.splice(i--, 1);
								if (choice.length >= num) {
									break;
								}
							}
						}
					}
				}
				return choice.randomSort();
			},
			getState() {
				var state = {};
				for (var i in lib.playerOL) {
					var player = lib.playerOL[i];
					state[i] = {
						identity: player.identity,
						//group:player.group,
						shown: player.ai.shown,
					};
				}
				return state;
			},
			updateState(state) {
				for (var i in state) {
					var player = lib.playerOL[i];
					if (player) {
						player.identity = state[i].identity;
						//player.group=state[i].group;
						player.ai.shown = state[i].shown;
					}
				}
			},
			getRoomInfo(uiintro) {
				var num, last;
				if (lib.configOL.initshow_draw == "off") {
					num = "关闭";
				} else {
					num = { mark: "标记", draw: "摸牌" }[lib.configOL.initshow_draw];
				}
				uiintro.add('<div class="text chat">群雄割据：' + (lib.configOL.separatism ? "开启" : "关闭"));
				uiintro.add('<div class="text chat">首亮奖励：' + num);
				uiintro.add('<div class="text chat">珠联璧合：' + (lib.configOL.zhulian ? "开启" : "关闭"));
				uiintro.add('<div class="text chat">出牌时限：' + lib.configOL.choose_timeout + "秒");
				uiintro.add('<div class="text chat">国战牌堆：' + (lib.configOL.guozhanpile ? "开启" : "关闭"));
				uiintro.add('<div class="text chat">鏖战模式：' + (lib.configOL.aozhan ? "开启" : "关闭"));
				last = uiintro.add('<div class="text chat">观看下家副将：' + (lib.configOL.viewnext ? "开启" : "关闭"));
				last.style.paddingBottom = "8px";
			},
			addRecord(bool) {
				if (typeof bool == "boolean") {
					var data = lib.config.gameRecord.guozhan.data;
					var identity = game.me.identity;
					if (!data[identity]) {
						data[identity] = [0, 0];
					}
					if (bool) {
						data[identity][0]++;
					} else {
						data[identity][1]++;
					}
					var list = lib.group.slice(0);
					list.add("ye");
					var str = "";
					for (var i = 0; i < list.length; i++) {
						if (list[i] != "shen" && list[i] != "western" && data[list[i]]) {
							str += lib.translate[list[i] + "2"] + "：" + data[list[i]][0] + "胜" + " " + data[list[i]][1] + "负<br>";
						}
					}
					lib.config.gameRecord.guozhan.str = str;
					game.saveConfig("gameRecord", lib.config.gameRecord);
				}
			},
			getIdentityList(player) {
				if (!player.isUnseen()) return;
				if (player == game.me) return;
				var list = {
					wei: "魏",
					shu: "蜀",
					wu: "吴",
					qun: "群",
					ye: "野",
					unknown: "猜",
				};
				var num = Math.floor((game.players.length + game.dead.length) / 2);
				var noye = true;
				if (get.population("wei") >= num) {
					delete list.wei;
					noye = false;
				}
				if (get.population("shu") >= num) {
					delete list.shu;
					noye = false;
				}
				if (get.population("wu") >= num) {
					delete list.wu;
					noye = false;
				}
				if (get.population("qun") >= num) {
					delete list.qun;
					noye = false;
				}
				if (noye) {
					delete list.ye;
				}
				return list;
			},
			getIdentityList2(list) {
				for (var i in list) {
					switch (i) {
						case "unknown":
							list[i] = "未知";
							break;
						case "ye":
							list[i] = "野心家";
							break;
						case "qun":
							list[i] += "雄";
							break;
						case "key":
							list[i] = "Key";
							break;
						case "jin":
							list[i] += "朝";
							break;
						default:
							list[i] += "国";
					}
				}
			},
			getVideoName() {
				var str = get.translation(game.me.name1) + "/" + get.translation(game.me.name2);
				var str2 = _status.separatism
					? get.modetrans({
							mode: lib.config.mode,
							separatism: true,
						})
					: get.cnNumber(parseInt(get.config("player_number"))) + "人" + get.translation(lib.config.mode);
				if (game.me.identity == "ye") {
					str2 += " - 野心家";
				}
				var name = [str, str2];
				return name;
			},
			showIdentity(started) {
				if (game.phaseNumber == 0 && !started) return;
				for (var i = 0; i < game.players.length; i++) {
					game.players[i].showCharacter(2, false);
				}
			},
			tryResult() {
				var map = {},
					sides = [],
					pmap = _status.connectMode ? lib.playerOL : game.playerMap,
					hiddens = [];
				for (var i of game.players) {
					if (i.identity == "unknown") {
						hiddens.push(i);
						continue;
					}
					var added = false;
					for (var j of sides) {
						if (i.isFriendOf(pmap[j])) {
							added = true;
							map[j].push(i);
							break;
						}
					}
					if (!added) {
						map[i.playerid] = [i];
						sides.push(i.playerid);
					}
				}
				if (!sides.length) return;
				else if (sides.length > 1) {
					if (!hiddens.length && sides.length == 2) {
						if (
							map[sides[0]].length == 1 &&
							!map[sides[1]].filter(function (i) {
								return i.identity != "ye" && i.isUnseen(0);
							}).length
						)
							map[sides[0]][0].showGiveup();
						if (
							map[sides[1]].length == 1 &&
							!map[sides[0]].filter(function (i) {
								return i.identity != "ye" && i.isUnseen(0);
							}).length
						)
							map[sides[1]][0].showGiveup();
					}
				} else {
					var isYe = function (player) {
						return player.identity != "ye" && lib.character[player.name1][1] == "ye";
					};
					if (!hiddens.length) {
						if (map[sides[0]].length > 1) {
							for (var i of map[sides[0]]) {
								if (isYe(i)) {
									game.showYexings();
									return;
								}
							}
						}
						game.broadcastAll(function (id) {
							game.winner_id = id;
						}, sides[0]);
						game.checkResult();
					} else {
						var identity = map[sides[0]][0].identity;
						if (identity == "ye") return;
						for (var i of map[sides[0]]) {
							if (isYe(i)) return;
						}
						for (var ind = 0; ind < hiddens.length; ind++) {
							var current = hiddens[ind];
							if (isYe(current) || current.getGuozhanGroup(2) != identity || !current.wontYe(null, ind + 1)) return;
						}
						game.broadcastAll(function (id) {
							game.winner_id = id;
						}, sides[0]);
						game.checkResult();
					}
				}
			},
			checkResult() {
				_status.overing = true;
				var me = game.me._trueMe || game.me;
				for (var i = 0; i < game.players.length; i++) {
					game.players[i].showCharacter(2);
				}
				var winner = (_status.connectMode ? lib.playerOL : game.playerMap)[game.winner_id];
				game.over(winner && winner.isFriendOf(me) ? true : false);
				game.showIdentity();
			},
			checkOnlineResult(player) {
				var winner = lib.playerOL[game.winner_id];
				return winner && winner.isFriendOf(game.me);
			},
			chooseCharacter() {
				var next = game.createEvent("chooseCharacter");
				next.showConfig = true;
				next.addPlayer = true;
				next.ai = function (player, list, back) {
					if (_status.brawl && _status.brawl.chooseCharacterAi) {
						if (_status.brawl.chooseCharacterAi(player, list, back) !== false) {
							return;
						}
					}
					var filterChoice = function (name1, name2) {
						if (_status.separatism) return true;
						var group1 = lib.character[name1][1];
						var group2 = lib.character[name2][1];
						var doublex = get.is.double(name1, true);
						if (doublex) {
							var double = get.is.double(name2, true);
							if (double) return doublex.some(group => double.includes(group));
							return doublex.includes(group2);
						} else {
							if (group1 == "ye") return group2 != "ye";
							var double = get.is.double(name2, true);
							if (double) return double.includes(group1);
							return group1 == group2;
						}
					};
					for (var i = 0; i < list.length - 1; i++) {
						for (var j = i + 1; j < list.length; j++) {
							if (filterChoice(list[i], list[j]) || filterChoice(list[j], list[i])) {
								var mainx = list[i];
								var vicex = list[j];
								if (!filterChoice(mainx, vicex) || (filterChoice(vicex, mainx) && get.guozhanReverse(mainx, vicex))) {
									mainx = list[j];
									vicex = list[i];
								}
								player.init(mainx, vicex, false);
								if (get.is.double(mainx, true)) {
									if (!get.is.double(vicex, true)) player.trueIdentity = lib.character[vicex][1];
									else if (get.is.double(mainx, true).removeArray(get.is.double(vicex, true)).length == 0 || get.is.double(vicex, true).removeArray(get.is.double(mainx, true)).length == 0)
										player.trueIdentity = get.is
											.double(vicex, true)
											.filter(group => get.is.double(mainx, true).includes(group))
											.randomGet();
									else player.trueIdentity = get.is.double(mainx, true).find(group => get.is.double(vicex, true).includes(group));
								} else if (lib.character[mainx][1] == "ye" && get.is.double(vicex, true)) player.trueIdentity = get.is.double(vicex, true).randomGet();
								if (back) {
									list.remove(player.name1);
									list.remove(player.name2);
									for (var i = 0; i < list.length; i++) {
										back.push(list[i]);
									}
								}
								return;
							}
						}
					}
				};
				next.setContent(function () {
					"step 0";
					ui.arena.classList.add("choose-character");
					var addSetting = function (dialog) {
						dialog.add("选择座位").classList.add("add-setting");
						var seats = document.createElement("table");
						seats.classList.add("add-setting");
						seats.style.margin = "0";
						seats.style.width = "100%";
						seats.style.position = "relative";
						for (var i = 1; i <= game.players.length; i++) {
							var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
							td.innerHTML = "<span>" + get.cnNumber(i, true) + "</span>";
							td.link = i - 1;
							seats.appendChild(td);
							td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
								if (_status.dragged) return;
								if (_status.justdragged) return;
								if (_status.cheat_seat) {
									_status.cheat_seat.classList.remove("bluebg");
									if (_status.cheat_seat == this) {
										delete _status.cheat_seat;
										return;
									}
								}
								this.classList.add("bluebg");
								_status.cheat_seat = this;
							});
						}
						dialog.content.appendChild(seats);
						if (game.me == game.zhu) {
							seats.previousSibling.style.display = "none";
							seats.style.display = "none";
						}

						dialog.add(ui.create.div(".placeholder.add-setting"));
						dialog.add(ui.create.div(".placeholder.add-setting"));
						if (get.is.phoneLayout()) dialog.add(ui.create.div(".placeholder.add-setting"));
					};
					var removeSetting = function () {
						var dialog = _status.event.dialog;
						if (dialog) {
							dialog.style.height = "";
							delete dialog._scrollset;
							var list = Array.from(dialog.querySelectorAll(".add-setting"));
							while (list.length) {
								list.shift().remove();
							}
							ui.update();
						}
					};
					event.addSetting = addSetting;
					event.removeSetting = removeSetting;

					var chosen = lib.config.continue_name || [];
					game.saveConfig("continue_name");
					event.chosen = chosen;

					var i;
					event.list = [];
					for (i in lib.character) {
						if (i.indexOf("gz_shibing") == 0) continue;
						if (chosen.includes(i)) continue;
						if (lib.filter.characterDisabled(i)) continue;
						if (get.config("onlyguozhan")) {
							if (!lib.characterGuozhanFilter.some(pack => lib.characterPack[pack][i])) continue;
							if (get.is.jun(i)) continue;
						}
						if (lib.character[i].hasHiddenSkill) continue;
						event.list.push(i);
					}
					_status.characterlist = event.list.slice(0);
					_status.yeidentity = [];
					if (_status.brawl && _status.brawl.chooseCharacterFilter) {
						event.list = _status.brawl.chooseCharacterFilter(event.list);
					}
					event.list.randomSort();
					// var list=event.list.splice(0,parseInt(get.config('choice_num')));
					var list;
					if (_status.brawl && _status.brawl.chooseCharacter) {
						list = _status.brawl.chooseCharacter(event.list, game.me);
					} else {
						list = game.getCharacterChoice(event.list, parseInt(get.config("choice_num")));
					}
					if (_status.auto) {
						event.ai(game.me, list);
						lib.init.onfree();
					} else if (chosen.length) {
						game.me.init(chosen[0], chosen[1], false);
						lib.init.onfree();
					} else {
						var dialog = ui.create.dialog("选择角色", "hidden", [list, "character"]);
						if (!_status.brawl || !_status.brawl.noAddSetting) {
							if (get.config("change_identity")) {
								addSetting(dialog);
							}
						}
						var next = game.me.chooseButton(dialog, true, 2).set("onfree", true);
						next.filterButton = function (button) {
							if (ui.dialog.buttons.length <= 10) {
								for (var i = 0; i < ui.dialog.buttons.length; i++) {
									if (ui.dialog.buttons[i] != button) {
										if (
											lib.element.player.perfectPair.call(
												{
													name1: button.link,
													name2: ui.dialog.buttons[i].link,
												},
												true
											)
										) {
											button.classList.add("glow2");
										}
									}
								}
							}
							if (lib.character[button.link].hasHiddenSkill) return false;
							var filterChoice = function (name1, name2) {
								if (_status.separatism) return true;
								var group1 = lib.character[name1][1];
								var group2 = lib.character[name2][1];
								var doublex = get.is.double(name1, true);
								if (doublex) {
									var double = get.is.double(name2, true);
									if (double) return doublex.some(group => double.includes(group));
									return doublex.includes(group2);
								} else {
									if (group1 == "ye") return group2 != "ye";
									var double = get.is.double(name2, true);
									if (double) return double.includes(group1);
									return group1 == group2;
								}
							};
							if (!ui.selected.buttons.length) {
								return ui.dialog.buttons.some(but => {
									if (but == button) return false;
									return filterChoice(button.link, but.link);
								});
							}
							return filterChoice(ui.selected.buttons[0].link, button.link);
						};
						next.switchToAuto = function () {
							event.ai(game.me, list);
							ui.arena.classList.remove("selecting");
						};
						var createCharacterDialog = function () {
							event.dialogxx = ui.create.characterDialog(
								"heightset",
								function (i) {
									if (i.indexOf("gz_shibing") == 0) return true;
									if (get.config("onlyguozhan")) {
										if (!lib.characterGuozhanFilter.some(pack => lib.characterPack[pack][i])) return true;
										if (get.is.jun(i)) return true;
									}
								},
								get.config("onlyguozhanexpand") ? "expandall" : undefined,
								get.config("onlyguozhan") ? "onlypack:mode_guozhan" : undefined
							);
							if (ui.cheat2) {
								ui.cheat2.addTempClass("controlpressdownx", 500);
								ui.cheat2.classList.remove("disabled");
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
									if (ui.cheat) {
										ui.cheat.addTempClass("controlpressdownx", 500);
										ui.cheat.classList.remove("disabled");
									}
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
									if (ui.cheat) {
										ui.cheat.classList.add("disabled");
									}
								}
							});
							if (lib.onfree) {
								ui.cheat2.classList.add("disabled");
							}
						};
						ui.create.cheat = function () {
							_status.createControl = ui.cheat2;
							ui.cheat = ui.create.control("更换", function () {
								if (ui.cheat2 && ui.cheat2.dialog == _status.event.dialog) {
									return;
								}
								if (game.changeCoin) {
									game.changeCoin(-3);
								}
								event.list = event.list.concat(list);
								event.list.randomSort();
								// list=event.list.splice(0,parseInt(get.config('choice_num')));
								list = game.getCharacterChoice(event.list, parseInt(get.config("choice_num")));
								var buttons = ui.create.div(".buttons");
								var node = _status.event.dialog.buttons[0].parentNode;
								_status.event.dialog.buttons = ui.create.buttons(list, "character", buttons);
								_status.event.dialog.content.insertBefore(buttons, node);
								buttons.addTempClass("start");
								node.remove();
								game.uncheck();
								game.check();
							});
							delete _status.createControl;
						};
						if (!_status.brawl || !_status.brawl.chooseCharacterFixed) {
							if (!ui.cheat && get.config("change_choice")) ui.create.cheat();
							if (!ui.cheat2 && get.config("free_choose")) ui.create.cheat2();
						}
					}
					"step 1";
					if (ui.cheat) {
						ui.cheat.close();
						delete ui.cheat;
					}
					if (ui.cheat2) {
						ui.cheat2.close();
						delete ui.cheat2;
					}
					if (result.buttons) {
						var name1 = result.buttons[0].link,
							name2 = result.buttons[1].link;
						event.choosen = [name1, name2];
						if (get.is.double(name1, true)) {
							if (!get.is.double(name2, true)) event._result = { control: lib.character[name2][1] };
							else if (get.is.double(name1, true).removeArray(get.is.double(name2, true)).length == 0 || get.is.double(name2, true).removeArray(get.is.double(name1, true)).length == 0)
								game.me
									.chooseControl(get.is.double(name2, true).filter(group => get.is.double(name1, true).includes(group)))
									.set("prompt", "请选择你代表的势力")
									.set("ai", () => _status.event.controls.randomGet());
							else
								event._result = {
									control: get.is.double(name1, true).find(group => get.is.double(name2, true).includes(group)),
								};
						} else if (lib.character[name1][1] == "ye" && get.is.double(name2, true))
							game.me
								.chooseControl(get.is.double(name2, true))
								.set("prompt", "请选择副将代表的势力")
								.set("ai", () => _status.event.controls.randomGet());
					}
					"step 2";
					if (result && result.control) game.me.trueIdentity = result.control;
					if (event.choosen) {
						game.me.init(event.choosen[0], event.choosen[1], false);
						game.addRecentCharacter(event.choosen[0], event.choosen[1]);
					}
					event.list.remove(game.me.name1);
					event.list.remove(game.me.name2);
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i] != game.me) {
							event.ai(game.players[i], game.getCharacterChoice(event.list, parseInt(get.config("choice_num"))), event.list);
						}
					}
					for (var i = 0; i < game.players.length; i++) {
						game.players[i].classList.add("unseen");
						game.players[i].classList.add("unseen2");
						_status.characterlist.remove(game.players[i].name);
						_status.characterlist.remove(game.players[i].name2);
						if (game.players[i] != game.me) {
							game.players[i].node.identity.firstChild.innerHTML = "猜";
							game.players[i].node.identity.dataset.color = "unknown";
							game.players[i].node.identity.classList.add("guessing");
						}
						game.players[i].hiddenSkills = lib.character[game.players[i].name1][3].slice(0);
						var hiddenSkills2 = lib.character[game.players[i].name2][3];
						for (var j = 0; j < hiddenSkills2.length; j++) {
							game.players[i].hiddenSkills.add(hiddenSkills2[j]);
						}
						for (var j = 0; j < game.players[i].hiddenSkills.length; j++) {
							if (!lib.skill[game.players[i].hiddenSkills[j]]) {
								game.players[i].hiddenSkills.splice(j--, 1);
							}
						}
						game.players[i].group = "unknown";
						game.players[i].sex = "unknown";
						game.players[i].name1 = game.players[i].name;
						game.players[i].name = "unknown";
						game.players[i].identity = "unknown";
						game.players[i].node.name.show();
						game.players[i].node.name2.show();
						for (var j = 0; j < game.players[i].hiddenSkills.length; j++) {
							game.players[i].addSkillTrigger(game.players[i].hiddenSkills[j], true);
						}
					}
					setTimeout(function () {
						ui.arena.classList.remove("choose-character");
					}, 500);
				});
			},
			chooseCharacterOL() {
				var next = game.createEvent("chooseCharacter");
				next.setContent(function () {
					"step 0";
					game.broadcastAll(function () {
						ui.arena.classList.add("choose-character");
						for (var i = 0; i < game.players.length; i++) {
							game.players[i].classList.add("unseen");
							game.players[i].classList.add("unseen2");
						}
					});
					var list = [];
					for (var i in lib.characterPack.mode_guozhan) {
						if (i.indexOf("gz_shibing") == 0) continue;
						if (get.is.jun(i)) continue;
						if (lib.config.guozhan_banned && lib.config.guozhan_banned.includes(i)) continue;
						list.push(i);
					}
					_status.characterlist = list.slice(0);
					_status.yeidentity = [];
					event.list = list.slice(0);
					var list2 = [];
					var num;
					if (lib.configOL.number * 6 > list.length) {
						num = 5;
					} else if (lib.configOL.number * 7 > list.length) {
						num = 6;
					} else {
						num = 7;
					}
					var filterButton = function (button) {
						if (ui.dialog) {
							if (ui.dialog.buttons.length <= 10) {
								for (var i = 0; i < ui.dialog.buttons.length; i++) {
									if (ui.dialog.buttons[i] != button) {
										if (
											lib.element.player.perfectPair.call(
												{
													name1: button.link,
													name2: ui.dialog.buttons[i].link,
												},
												true
											)
										) {
											button.classList.add("glow2");
										}
									}
								}
							}
						}
						var filterChoice = function (name1, name2) {
							if (_status.separatism) return true;
							var group1 = lib.character[name1][1];
							var group2 = lib.character[name2][1];
							var doublex = get.is.double(name1, true);
							if (doublex) {
								var double = get.is.double(name2, true);
								if (double) return doublex.some(group => double.includes(group));
								return doublex.includes(group2);
							} else {
								if (group1 == "ye") return group2 != "ye";
								var double = get.is.double(name2, true);
								if (double) return double.includes(group1);
								return group1 == group2;
							}
						};
						if (!ui.selected.buttons.length) {
							return ui.dialog.buttons.some(but => {
								if (but == button) return false;
								return filterChoice(button.link, but.link);
							});
						}
						return filterChoice(ui.selected.buttons[0].link, button.link);
					};
					list.randomSort();
					for (var i = 0; i < game.players.length; i++) {
						list2.push([
							game.players[i],
							["选择角色", [game.getCharacterChoice(list, num), "character"]],
							2,
							true,
							function () {
								return Math.random();
							},
							filterButton,
						]);
					}
					game.me
						.chooseButtonOL(list2, function (player, result) {
							if (game.online || player == game.me) player.init(result.links[0], result.links[1], false);
						})
						.set("switchToAuto", function () {
							_status.event.result = "ai";
						})
						.set("processAI", function () {
							var buttons = _status.event.dialog.buttons;
							var filterChoice = function (name1, name2) {
								if (_status.separatism) return true;
								var group1 = lib.character[name1][1];
								var group2 = lib.character[name2][1];
								var doublex = get.is.double(name1, true);
								if (doublex) {
									var double = get.is.double(name2, true);
									if (double) return doublex.some(group => double.includes(group));
									return doublex.includes(group2);
								} else {
									if (group1 == "ye") return group2 != "ye";
									var double = get.is.double(name2, true);
									if (double) return double.includes(group1);
									return group1 == group2;
								}
							};
							for (var i = 0; i < buttons.length - 1; i++) {
								for (var j = i + 1; j < buttons.length; j++) {
									if (filterChoice(buttons[i].link, buttons[j].link) || filterChoice(buttons[j].link, buttons[i].link)) {
										var mainx = buttons[i].link;
										var vicex = buttons[j].link;
										if (!filterChoice(mainx, vicex) || (filterChoice(vicex, mainx) && get.guozhanReverse(mainx, vicex))) {
											mainx = buttons[j].link;
											vicex = buttons[i].link;
										}
										var list = [mainx, vicex];
										return {
											bool: true,
											links: list,
										};
									}
								}
							}
						});
					"step 1";
					var sort = true,
						chosen = [],
						chosenCharacter = [];
					for (var i in result) {
						if (result[i] && result[i].links) {
							for (var j = 0; j < result[i].links.length; j++) {
								event.list.remove(result[i].links[j]);
							}
						}
					}
					for (var i in result) {
						if (result[i] == "ai" || !result[i].links || result[i].links.length < 1) {
							if (sort) {
								sort = false;
								event.list.randomSort();
							}
							result[i] = [event.list.shift()];
							var group = lib.character[result[i][0]][1];
							for (var j = 0; j < event.list.length; j++) {
								if (lib.character[event.list[j]][1] == group) {
									result[i].push(event.list[j]);
									event.list.splice(j--, 1);
									break;
								}
							}
						} else {
							result[i] = result[i].links;
						}
						var name1 = result[i][0],
							name2 = result[i][1];
						if (get.is.double(name1, true)) {
							if (!get.is.double(name2, true)) lib.playerOL[i].trueIdentity = lib.character[name2][1];
							else if (get.is.double(name1, true).removeArray(get.is.double(name2, true)).length == 0 || get.is.double(name2, true).removeArray(get.is.double(name1, true)).length == 0) {
								chosen.push(lib.playerOL[i]);
								chosenCharacter.push([name1, name2]);
							} else lib.playerOL[i].trueIdentity = get.is.double(name1, true).find(group => get.is.double(name2, true).includes(group));
						} else if (lib.character[name1][1] == "ye" && get.is.double(name2, true)) {
							chosen.push(lib.playerOL[i]);
							chosenCharacter.push([name1, name2]);
						}
					}
					event.result2 = result;
					if (chosen.length) {
						for (var i = 0; i < chosen.length; i++) {
							var name1 = chosenCharacter[i][0],
								name2 = chosenCharacter[i][1],
								str,
								choice;
							if (get.is.double(name1, true)) {
								str = "请选择你代表的势力";
								choice = get.is.double(name2, true).filter(group => get.is.double(name1, true).includes(group));
							}
							if (lib.character[name1][1] == "ye") {
								str = "请选择你的副将代表的势力";
								choice = get.is.double(name2, true);
							}
							chosen[i] = [
								chosen[i],
								[
									str,
									[
										choice.map(function (i) {
											return ["", "", "group_" + i];
										}),
										"vcard",
									],
								],
								1,
								true,
							];
						}
						game.me
							.chooseButtonOL(chosen, function (player, result) {
								if (player == game.me) player.trueIdentity = result.links[0][2].slice(6);
							})
							.set("switchToAuto", function () {
								_status.event.result = "ai";
							})
							.set("processAI", function () {
								return {
									bool: true,
									links: [_status.event.dialog.buttons.randomGet().link],
								};
							});
					} else event._result = {};
					"step 2";
					if (!result) result = {};
					var result2 = event.result2;
					game.broadcastAll(
						function (result, result2) {
							for (var i = 0; i < game.players.length; i++) {
								var current = game.players[i],
									id = current.playerid;
								if (result[id] && !current.name) {
									current.init(result[id][0], result[id][1], false);
								}
								if (result2[id] && result2[id].length) {
									current.trueIdentity = result2[id][0][2].slice(6);
								}
								if (game.players[i] != game.me) {
									game.players[i].node.identity.firstChild.innerHTML = "猜";
									game.players[i].node.identity.dataset.color = "unknown";
									game.players[i].node.identity.classList.add("guessing");
								}
								game.players[i].hiddenSkills = lib.character[game.players[i].name1][3].slice(0);
								var hiddenSkills2 = lib.character[game.players[i].name2][3];
								for (var j = 0; j < hiddenSkills2.length; j++) {
									game.players[i].hiddenSkills.add(hiddenSkills2[j]);
								}
								for (var j = 0; j < game.players[i].hiddenSkills.length; j++) {
									if (!lib.skill[game.players[i].hiddenSkills[j]]) {
										game.players[i].hiddenSkills.splice(j--, 1);
									}
								}
								game.players[i].group = "unknown";
								game.players[i].sex = "unknown";
								game.players[i].name1 = game.players[i].name;
								game.players[i].name = "unknown";
								game.players[i].identity = "unknown";
								game.players[i].node.name.show();
								game.players[i].node.name2.show();
								for (var j = 0; j < game.players[i].hiddenSkills.length; j++) {
									game.players[i].addSkillTrigger(game.players[i].hiddenSkills[j], true);
								}
							}
							setTimeout(function () {
								ui.arena.classList.remove("choose-character");
							}, 500);
						},
						result2,
						result
					);
				});
			},
		},
		ui: {
			click: {
				// identity:function(){
				// 	if(this.touched) {this.touched=false;return;}
				// 	_status.clicked=true;
				// 	if(this.parentNode.isUnseen()&&this.parentNode!=game.me){
				// 		switch(this.firstChild.innerHTML){
				// 			case '魏':this.firstChild.innerHTML='蜀';this.dataset.color='shu';break;
				// 			case '蜀':this.firstChild.innerHTML='吴';this.dataset.color='wu';break;
				// 			case '吴':this.firstChild.innerHTML='群';this.dataset.color='qun';break;
				// 			case '群':this.firstChild.innerHTML='野';this.dataset.color='ye';break;
				// 			case '野':this.firstChild.innerHTML='猜';this.dataset.color='unknown';break;
				// 			default:this.firstChild.innerHTML='魏';this.dataset.color='wei';break;
				// 		}
				// 	}
				// }
			},
		},
		dynamicTranslate: {
			gzzhaosong(player) {
				var storage = player.getStorage("gzzhaosong");
				var list1 = ["效果①", "效果②", "效果③"];
				var str = "每局游戏每项限一次。";
				var list2 = ["①一名角色进入濒死状态时，你可以令其回复至2点体力并摸一张牌。", "②出牌阶段，你可观看一名其他角色的所有暗置武将牌和手牌，然后可以获得其区域内的一张牌。", "③一名角色使用【杀】选择唯一目标后，你可以为此【杀】增加两个目标。"];
				for (var i = 0; i < 3; i++) {
					var bool = storage.includes(list1[i]);
					if (bool) str += '<span style="text-decoration:line-through">';
					str += list2[i];
					if (bool) str += "</span>";
				}
				return str;
			},
			gzshiyong(player) {
				return player.awakenedSkills.includes("gzyaowu") ? lib.translate.gzshiyongx_info : lib.translate.gzshiyong_info;
			},
			fakejuzhan(player) {
				let str = "转换技。",
					storage = player.storage.fakejuzhan;
				if (!storage) str += '<span class="bluetext">';
				str += "阴：当你成为【杀】的目标后，你可以与使用者各摸X张牌，然后若使用者的武将牌均明置，则你可以暗置其一张武将牌，且其本回合不能明置此武将牌。";
				if (!storage) str += "</span>";
				if (storage) str += '<span class="bluetext">';
				str += "阳，当你使用【杀】指定目标后，你可以获得目标角色的X张牌，然后若你的武将牌均明置，则其可以暗置此武将牌，且你本回合不能明置此武将牌。";
				if (storage) str += "</span>";
				return str + "（X为使用者已损失的体力值且X至少为1）";
			},
			fakeweirong(player) {
				let str = "转换技，每轮限一次，出牌阶段。",
					storage = player.storage.fakeweirong;
				if (!storage) str += '<span class="bluetext">';
				str += "阴：你可以弃置X张牌，然后当你于本轮不因此法得到牌后，你摸一张牌。";
				if (!storage) str += "</span>";
				if (storage) str += '<span class="bluetext">';
				str += "阳：你可以摸X张牌，然后当你于本轮不因此法失去牌后，你弃置一张牌。";
				if (storage) str += "</span>";
				return str + "（X为你上一轮以此法摸和弃置的牌数之和，且X至少为1，至多为你的体力上限）";
			},
		},
		translate: {
			yexinjia_mark: "野心家",

			bumingzhi: "不明置",
			mingzhizhujiang: "明置主将",
			mingzhifujiang: "明置副将",
			tongshimingzhi: "同时明置",
			mode_guozhan_character_config: "国战武将",
			_zhenfazhaohuan: "阵法召唤",
			_zhenfazhaohuan_info: "由拥有阵法技的角色发起，满足此阵法技条件的未确定势力角色均可按逆时针顺序依次明置其一张武将牌(响应阵法召唤)，以发挥阵法技的效果。",

			junling: "军令",
			junling1: "军令一",
			junling1_bg: "令",
			junling1_info: "若被执行，执行者对发起者指定的一名角色造成1点伤害。",
			junling2: "军令二",
			junling2_bg: "令",
			junling2_info: "若被执行，执行者摸一张牌，然后依次交给发起者两张牌。",
			junling3: "军令三",
			junling3_bg: "令",
			junling3_info: "若被执行，执行者失去1点体力。",
			junling4: "军令四",
			junling4_bg: "令",
			junling4_info: "若被执行，直到回合结束，执行者不能使用或打出手牌且非锁定技全部失效。",
			junling4_eff: "军令四",
			junling5: "军令五",
			junling5_bg: "令",
			junling5_info: "若被执行，执行者将武将牌叠置，且不能回复体力直到回合结束。",
			junling5_eff: "军令五",
			junling6: "军令六",
			junling6_bg: "令",
			junling6_info: "若被执行，执行者选择一张手牌和一张装备区内牌（若有），然后弃置其余的牌。",

			gz_miheng: "祢衡",
			gzshensu: "神速",
			gzshensu_info: "①判定阶段开始时，你可跳过此阶段和摸牌阶段，视为使用一张【杀】（无距离限制）。②出牌阶段开始时，你可跳过此阶段并弃置一张装备牌，视为使用一张【杀】（无距离限制）。③弃牌开始时，你可跳过此阶段并失去1点体力，视为使用一张【杀】（无距离限制）。",
			gzwushuang: "无双",
			gzwushuang_info: "锁定技。①当你使用【杀】指定一名角色为目标后，其需使用两张【闪】才能抵消；②当你使用【决斗】指定其他角色为目标后，或成为其他角色使用【决斗】的目标后，其每次响应需打出两张【杀】。③当你使用非转化的【决斗】选择目标后，你可为此【决斗】增加两个目标。",
			gzkuangfu: "狂斧",
			gzkuangfu_info: "出牌阶段限一次。当你使用【杀】指定目标后，你可获得目标角色装备区内的一张牌。然后若此【杀】未造成伤害，则你弃置两张手牌。",
			gzliegong: "烈弓",
			gzliegong_info: "①你对手牌数不大于你的角色使用【杀】不受距离关系的限制。②当你使用【杀】指定目标后，若其体力值不小于你，则你可以选择一项：⒈令此【杀】对其的伤害值基数+1。⒉令其不可响应此【杀】。",
			gzhongyan: "红颜",
			gzhongyan_info: "锁定技。①你区域内的黑桃牌和黑桃判定牌的花色视为红桃。②若你的装备区内有红桃牌，则你的手牌上限+1。",
			gztianxiang: "天香",
			gztianxiang_info: "每回合限一次。当你受到伤害时，你可以弃置一张红桃手牌，防止此次伤害并选择一名其他角色，然后你选择一项：1.令其受到伤害来源对其造成的1点伤害，然后摸X张牌（X为其已损失体力值且至多为5）；2.令其失去1点体力，然后获得你弃置的牌。",
			gzluoyi: "裸衣",
			gzluoyi_info: "摸牌阶段结束时，你可弃置一张牌，然后你于本回合内造成渠道为【杀】或【决斗】的伤害+1。",
			gzqiangxi: "强袭",
			gzqiangxi_info: "出牌阶段限一次，你可以弃置一张武器牌或失去1点体力，然后对一名其他角色造成1点伤害。",

			gz_sp_duyu: "杜预",
			gzpozhen: "破阵",
			gzpozhen_info: "限定技，其他角色的回合开始时，你可以令其本回合不可使用、打出或重铸手牌；若其处于队列或围攻关系中，你可依次弃置此队列或参与围攻关系的其他角色的一张牌。",
			gzjiancai: "荐才",
			gzjiancai_info: "副将技，此武将牌上单独的阴阳鱼个数-1。与你势力相同的角色即将受到伤害而进入濒死状态时，你可以防止此伤害，若如此做，你须变更副将；与你势力相同的角色变更副将时，其额外获得两张备选武将牌。",
			gzzhuhai: "诛害",
			gzzhuhai_info: "其他角色的结束阶段，若其本回合内造成过伤害，则你可以对其使用一张【杀】（无距离限制）。若其本回合内对与你势力相同的角色造成过伤害，则此【杀】无视防具，且当其抵消此【杀】后，其须弃置一张牌。",
			gzzhuosheng: "擢升",
			gzzhuosheng2: "擢升",
			gzzhuosheng_info: "当一名与你势力相同的角色受到伤害后，你可令其摸一张牌。然后直到其下个结束阶段前，其使用此牌根据类型执行以下效果：1. 基本牌，不计入次数且无距离限制；2. 普通锦囊牌，此牌目标可+1或-1；3. 装备牌，可摸一张牌。",

			gzzhaoxin: "昭心",
			gzzhaoxin_info: "当你受到伤害后，你可展示所有手牌，然后与一名手牌数不大于你的其他角色交换手牌。",
			gzsuzhi: "夙智",
			gzsuzhi_info: "锁定技，每回合累计限三次；①当你于回合内因执行【杀】或【决斗】造成伤害时，此伤害+1；②你于回合内使用非转化的锦囊牌时摸一张牌，且无距离限制；③当有其他角色于你的回合内弃置牌后，你获得该角色的一张牌；④结束阶段，你获得〖反馈〗直到下回合开始。",
			gzhuaiyi: "怀异",
			gzhuaiyi_info: "出牌阶段限一次，你可以展示所有手牌。若其中包含两种颜色，则你可以弃置其中一种颜色的所有牌，然后获得至多等量名角色的各一张牌。然后你将以此法得到的装备牌置于武将牌上，称为“异”。",
			gzzisui: "恣睢",
			gzzisui_info: "锁定技，摸牌阶段，你多摸X张牌。结束阶段，若X大于你的体力上限，你死亡（X为“异”数）。",

			gz_tangzi: "唐咨",
			gz_mengda: "孟达",
			gz_liuqi: "刘琦",
			gz_mifangfushiren: "糜芳傅士仁",
			gz_shixie: "士燮",
			gz_zhanglu: "张鲁",
			wenqin: "文钦",
			fengxi: "冯熙",
			liuba: "刘巴",
			pengyang: "彭羕",
			sunchen: "孙綝",
			gz_dengzhi: "邓芝",
			gzshenwei: "神威",
			gzshenwei_info: "主将技。①此武将牌减少半个阴阳鱼。②摸牌阶段，若你的手牌数为全场最多，则你额外摸两张牌。③你的手牌上限+2。",
			gzzhuangrong: "妆戎",
			gzzhuangrong_info: "出牌阶段限一次。你可弃置一张锦囊牌并获得〖无双〗至出牌阶段结束。",
			gzfenglve: "锋略",
			gzfenglve_info: "出牌阶段限一次，你可以和一名其他角色进行拼点。若你赢，其将区域内的两张牌交给你；若你输，你交给其一张牌。",
			gzfenglve_zongheng: "锋略·纵横",
			gzfenglve_zongheng_info: "出牌阶段限一次，你可以和一名其他角色进行拼点。若你赢，其将区域内的一张牌交给你；若你输，你交给其两张牌。",
			gzanyong: "暗涌",
			gzanyong_info: "每回合限一次。当己方角色对其他角色造成伤害时，你可令伤害值翻倍。然后若受伤角色：武将牌均明置，则你失去1点体力并失去〖暗涌〗；有一张明置的武将牌，则你弃置两张手牌。",
			gzzhukou: "逐寇",
			gzzhukou_info: "当你于一名角色的出牌阶段第一次造成伤害后，你可以摸X张牌（X为本回合你已使用的牌数且至多为5）。",
			gzduannian: "断念",
			gzduannian_info: "出牌阶段结束时，若你有手牌，你可以弃置所有手牌，然后将手牌摸至体力上限。",
			gzlianyou: "莲佑",
			gzlianyou_info: "你死亡时，可以选择一名其他角色。该角色获得技能“兴火”。",
			gzxinghuo: "兴火",
			gzxinghuo_info: "锁定技，你造成的火焰伤害+1。",
			gzgongxiu: "共修",
			gzgongxiu_info: "摸牌阶段，你可以少摸一张牌，然后选择一个与上次不同的选项：①令至多X名角色各摸一张牌。②令至多X名角色各弃置一张牌。（X为你的体力上限）",
			gzjinghe: "经合",
			gzjinghe_info: "出牌阶段限一次，你可以展示至多X张牌名各不相同的手牌（X为你的体力上限），并选择等量有明置武将牌的角色。然后每名角色可以从“写满技能的天书”中选择并获得一个技能直到你的下回合开始。",
			gzshilu: "嗜戮",
			gzshilu_info: "①一名角色死亡时，你可以将其所有武将牌置于你的武将牌上，称为“戮”，若杀死其的角色是你，则你从剩余的武将牌堆随机额外获得两张“戮”。②准备阶段，你可以弃置至多X张牌，然后摸等量的牌（X为“戮”数）。",
			gzxiongnve: "凶虐",
			gzxiongnve_info: "①出牌阶段开始时，你可以将一张“戮”置入武将牌堆并选择一项：1. 本回合对“戮”对应的势力的角色造成的伤害+1；2. 本回合对“戮”对应的势力的角色造成伤害时，你获得其一张牌；3. 本回合对“戮”对应的势力的角色使用牌无次数限制。②出牌阶段结束时，你可以将两张“戮”置入武将牌堆并获得以下效果直到你的下个回合开始前：当你受到其他角色造成的伤害时,此伤害-1。",
			gzjianliang: "简亮",
			gzjianliang_info: "摸牌阶段开始时，若你的手牌数为全场最少，则你可以令所有与你势力相同的角色各摸一张牌。",
			gzweimeng: "危盟",
			gzweimeng_info: "出牌阶段限一次，你可以获得一名其他角色的至多X张手牌，然后交给其等量的牌（X为你的体力值）。",
			gzweimeng_zongheng: "危盟·纵横",
			gzweimeng_zongheng_info: "出牌阶段限一次，你可以获得一名其他角色的一张手牌，然后交给其一张牌。",
			gzjuejue: "决绝",
			gzjuejue_info: "①弃牌阶段开始时，你可失去1点体力。然后若你于此阶段内弃置过你的牌，则你令其他角色各选择一项：1.将X张手牌置入弃牌堆（X为你于此阶段内弃置过的牌数）；2.受到你造成的1点伤害。②你杀死与你势力相同的角色不执行奖惩。",
			gzfangyuan: "方圆",
			gzfangyuan_info: "阵法技，若你在一个围攻关系中：①是围攻角色，则所有围攻角色的手牌上限+1且被围攻角色手牌上限-1；②是被围攻角色，则结束阶段，你视为对一名围攻角色使用【杀】。",
			daming: "达命",
			daming_info: "一名己方角色A的出牌阶段开始时，你可弃置一张锦囊牌，横置一名角色并摸X张牌（X为拥有横置角色的势力数）。然后你选择一项：①令A回复1点体力；②令A视为对由你选择的另一名角色使用一张雷【杀】。",
			xiaoni: "嚣逆",
			xiaoni_info: "锁定技，当你使用牌时，或成为其他角色使用牌的目标后，若场上存在其他己方角色且这些角色的手牌数均不大于你，则目标角色/你不可响应此牌。",
			gztongduo: "统度",
			gztongduo_info: "己方角色的结束阶段，其可以摸X张牌（X为其本回合弃牌阶段弃置的牌数且至多为3）。",
			qingyin: "清隐",
			qingyin_info: "限定技，出牌阶段，你可令所有己方角色将体力值回满，然后移除此武将牌。",
			gzlianpian: "联翩",
			gzlianpian_info: "①结束阶段，若你于此回合内弃置过所有角色的牌数之和大于你的体力值，你可令一名与你势力相同的角色将手牌补至X张（X为其体力上限）。②其他角色的结束阶段，若其于此回合内弃置过所有角色的牌数之和大于你的体力值，其可选择：1.弃置你的一张牌；2.令你回复1点体力。",
			gzyusui: "玉碎",
			gzyusui_info: "每回合限一次，当你成为其他势力的角色使用黑色牌的目标后，你可以失去1点体力，然后选择一项：①令其弃置X张手牌（X为其体力上限）；②令其失去Y点体力（Y为其的体力值减去你的体力值，不为正时不可选择）。",
			gzboyan: "驳言",
			gzboyan_info: "出牌阶段限一次，你可令一名其他角色将手牌摸至体力上限（至多摸五张），然后其本回合不能使用或打出手牌。",
			gzboyan_zongheng: "驳言·纵横",
			gzboyan_zongheng_info: "出牌阶段限一次，你可令一名其他角色本回合不能使用或打出手牌。",
			gzjinfa: "矜伐",
			gzjinfa_info: "出牌阶段限一次，你可弃置一张牌并令一名其他角色选择一项：①交给你一张装备牌，若你以此法得到了♠牌，则其视为对你使用一张【杀】。②你获得其一张牌。",
			gzduwu: "黩武",
			gzduwu_info: "限定技，出牌阶段，你可以选择一个“军令”。你令攻击范围内所有的非己方角色选择是否执行。若有角色选择否，则你对其造成1点伤害且你摸一张牌。若有角色于此技能结算过程中进入濒死状态且存活，则你失去1点体力。",
			gzxishe: "袭射",
			gzxishe_info: "其他角色的准备阶段，你可将装备区内的一张牌当做【杀】对其使用且可重复此流程。若你的体力值大于该角色，则此【杀】不可被响应。若该角色于此技能的结算流程中死亡，则你可以变更副将（不展示）。",
			gzcongcha: "聪察",
			gzcongcha2: "聪察",
			gzcongcha_info: "①准备阶段，你可以选择一名未确定势力的其他角色。当其于你的下回合开始前首次明置武将牌后，若其：与你势力相同，则你与其各摸两张牌；与你势力不同，则其失去1点体力。②摸牌阶段开始时，若场上所有角色均有明置的武将牌，则你可以令额定摸牌数+2。",
			gzchenglve: "成略",
			gzchenglve_info: "己方角色使用牌结算结束后，若此牌的目标数大于1，则你可以令其摸一张牌。若你受到过渠道为此牌的伤害，则你可以令一名武将牌均明置过且没有“阴阳鱼”标记的己方角色获得一枚“阴阳鱼”。",
			gzbaolie: "豹烈",
			gzbaolie_info: "锁定技，出牌阶段开始时，你令所有攻击范围内包含你的非己方角色依次选择：①对你使用一张【杀】；②令你弃置其一张牌。锁定技，你对体力值不小于你的角色使用【杀】没有距离和次数限制。",
			gzshicai: "恃才",
			gzshicai_info: "锁定技，当你受到的伤害后，若伤害值：为1，你摸一张牌；大于1，你弃置两张牌。",
			gzxingzhao: "兴棹",
			gzxingzhao_info: "锁定技：①摸牌阶段开始时，若X不小于1，则你可以发动〖恂恂〗的效果。②当你受到伤害后或使用装备牌时，若X不小于2且你的手牌数不为全场最多，则你摸一张牌。③若X不小于3，则你的手牌上限+4。④当你失去装备区的牌后，若X不小于4，则你摸一张牌。（X为场上有受伤角色的势力数）",
			gzxingzhao_old_info: "锁定技：①摸牌阶段开始时，若X不小于1，则你可以发动〖恂恂〗的效果。②当你受到伤害后，若X不小于2且你和伤害来源的手牌数不相等，则你于伤害来源中手牌数较少的角色摸一张牌。③若X不小于3，则你的手牌上限+4。④当你失去装备区的牌后，若X不小于4，则你摸一张牌。（X为场上有受伤角色的势力数）",
			gzwenji: "问计",
			gzwenji_info: "出牌阶段开始时，你可令一名其他角色交给你一张牌。然后若该角色：未确定势力或势力与你相同，则你于本回合内使用实体牌包含“问计”牌的牌无距离和次数限制，且不可被其他角色响应。与你势力不同，则你交给其一张不为“问计”牌的牌或令其摸一张牌。",
			gztunjiang: "屯江",
			gztunjiang_info: "结束阶段，若你于本回合的出牌阶段内使用过牌且这些牌均未指定其他角色为目标，则你可摸X张牌（X为势力数）。",
			gzbushi: "布施",
			gzbushi_info: "当你受到1点伤害后，你可摸一张牌。当你对其他势力的角色造成伤害后，其可摸一张牌，然后你摸一张牌。",
			gzbushi_old_info: "锁定技，当你受到1点伤害后，你令一名与你势力相同的角色摸一张牌；当你对其他角色造成伤害后，你令一名与该角色势力相同的角色摸一张牌。",
			gzmidao: "米道",
			gzmidao_info: "与你势力相同的角色的出牌阶段限一次。该角色使用伤害性基本牌或普通锦囊牌指定第一个目标后，其可令你改变此牌的花色和伤害属性。",
			gzmidao_old_info: "与你势力相同的其他角色的出牌阶段限一次。该角色使用伤害性基本牌或普通锦囊牌指定第一个目标后，其可交给你一张手牌，然后你可改变此牌的花色和伤害属性。",
			gzbiluan: "避乱",
			gzbiluan_info: "锁定技。其他角色计算至你的距离时+X（X为你装备区内的牌数）。",
			gzrelixia: "礼下",
			gzrelixia_info: "锁定技。与你势力不同的角色的准备阶段，若你不在其攻击范围内，则其选择一项：①弃置你装备区内的一张牌并失去1点体力。②令你摸一张牌。",
			gzlixia: "礼下",
			gzlixia_info: "与你势力不同的角色的准备阶段，其可弃置你装备区内的一张牌，然后其选择一项：①弃置两张手牌。②失去1点体力。③令你摸两张牌。",
			gzrekuangcai: "狂才",
			gzrekuangcai_info: "锁定技，你于回合内使用牌无距离和次数限制；弃牌阶段开始时，若你本回合内：未使用过牌，则你本局游戏的手牌上限+1；使用过牌但未造成过伤害，则你本局游戏的手牌上限-1。",
			gzkuangcai: "狂才",
			gzkuangcai_info: "锁定技，你的回合内，你使用牌无距离和次数限制，无视防具且不能被【无懈可击】响应；弃牌阶段开始时，若你本回合使用过牌但没造成伤害，本回合你的手牌上限-2；若你本回合造成的伤害点数不小于你使用的牌数，你将手牌摸至体力上限且本回合手牌上限+2。",
			gzshejian: "舌箭",
			gzshejian_info: "当你成为其他角色使用牌的唯一目标后，你可以弃置所有手牌。若如此做，你选择一项：⒈弃置其等量的牌。⒉若没有角色处于濒死状态，对其造成1点伤害。",
			gzzhidao: "雉盗",
			gzzhidao2: "雉盗",
			gzzhidao_info: "锁定技，出牌阶段开始时，你选择一名其他角色，然后直到此回合结束，你与其的距离视为1且你不能使用牌指定除你与其外的角色为目标；当你于出牌阶段内首次对其造成伤害后，你获得其区域内的一张牌。",
			gzyjili: "寄篱",
			gzyjili2: "寄篱",
			gzyjili_info: "锁定技。当你成为红色基本牌或红色普通锦囊牌的唯一目标后，你令此牌的使用者于此牌结算完成后视为对你使用一张牌名和属性相同的牌。当你于一个阶段内第二次受到伤害时，你防止此伤害并移除此武将牌。",
			wujing: "吴景",
			donggui: "调归",
			donggui_info: "出牌阶段限一次，你可以暗置武将牌均明置的一名其他角色一张武将牌，视为对其使用【调虎离山】，且其本回合不能明置此武将牌。若因此形成队列，你摸X张牌（X为该队列中的角色数）。",
			fengyang: "风扬",
			fengyang_info: "阵法技，结束阶段，你所在队列的角色可以依次弃置一张装备区里的牌，然后摸两张牌。",
			fengyang_old: "风扬",
			fengyang_old_info: "阵法技，与你势力不同的角色不能弃置或获得与你处于同一队列的角色的装备区里的牌。",
			dongzhao: "董昭",
			quanjin: "劝进",
			quanjin_info: "出牌阶段限一次，你可将一张手牌交给一名本回合内受到过伤害其他角色，然后令其执行一项“军令”。若其执行，则你摸一张牌。若其不执行，则你将手牌摸至与全场最多相等（至多摸五张）。",
			zaoyun: "凿运",
			zaoyun_info: "出牌阶段限一次，你可以弃置X张手牌并选择一名距离为X+1的敌方角色。你对其造成1点伤害且至其的距离视为1至回合结束。",
			gzdeshao: "德劭",
			gzdeshao_info: "每回合限X次（X为你的体力值）。其他角色使用黑色牌指定你为唯一目标后，若其暗置的武将牌数大于等于你，则你可以弃置其一张牌。",
			gzmingfa: "明伐",
			gzmingfa_info: "出牌阶段限一次，你可以选择一名敌方角色。该角色的下个回合结束时，若其手牌数：小于你，你对其造成1点伤害并获得其一张手牌；大于你，你摸X张牌（X为你与其的手牌数之差且至多为5）。",
			gzjilei_info: "当你受到有来源的伤害后，你可以声明一种牌的类别。若如此做，你令伤害来源不能使用、打出或弃置此类别的手牌直到回合结束。",
			gzdanlao_info: "当你成为锦囊牌的目标后，若此牌的目标数大于1，则你可以摸一张牌，令此牌对你无效。",

			gz_cuimao: "崔琰毛玠",
			gzzhengbi: "征辟",
			gzzhengbi_info: "出牌阶段开始时，你可以选择一项：选择一名未确定势力的角色，此出牌阶段结束时，若其有明置的武将牌，则你获得其每个区域内的各一张牌；或将一张基本牌交给一名有明置武将牌的角色，然后其交给你一张非基本牌或两张基本牌。",
			gzfengying: "奉迎",
			gzfengying_info: "限定技，你可以将所有手牌当【挟天子以令诸侯】使用（无视大势力限制），然后所有与你势力相同的角色将手牌补至体力上限。",
			gz_yujin: "于禁",
			gzjieyue: "节钺",
			gzjieyue_info: "准备阶段，你可以将一张手牌交给一名非魏势力角色，然后选择一个“军令”并令其选择一项：执行该军令，然后你摸一张牌；或令你于此回合摸牌阶段额外摸三张牌。",
			gz_wangping: "王平",
			jianglue: "将略",
			jianglue_info: "限定技，出牌阶段，你可以选择一个“军令”，然后与你势力相同的其他角色可以执行该军令（未确定势力角色可以在此时明置一张单势力武将牌）。你与所有执行该军令的角色增加1点体力上限，然后回复1点体力，然后你摸X张牌（X为以此法回复了体力的角色数）。",
			gz_fazheng: "法正",
			gzxuanhuo: "眩惑",
			gzxuanhuo_info: "与你势力相同的其他角色的出牌阶段限一次，其可弃置一张手牌，然后选择获得以下一项技能直到回合结束：〖武圣〗、〖咆哮〗、〖龙胆〗、〖铁骑〗、〖烈弓〗、〖狂骨〗。",
			gzenyuan: "恩怨",
			gzenyuan_info: "锁定技，当其他角色对你使用【桃】时，该角色摸一张牌；当你受到伤害后，伤害来源须交给你一张手牌或失去1点体力。",
			gzbuyi: "补益",
			gzbuyi_info: "每回合限一次，当一名与你势力相同的角色脱离濒死状态后，你可以选择一个“军令”，令伤害来源选择一项：执行该军令，或令该脱离濒死状态的角色回复1点体力。",
			gz_lukang: "陆抗",
			keshou: "恪守",
			keshou_info: "当你受到伤害时，你发动此技能。你可弃置两张颜色相同的牌，若如此做，此伤害-1。你的势力已确定且场上没有与你势力相同的其他角色，则你进行判定，若结果为红色，你摸一张牌。",
			zhuwei: "筑围",
			zhuwei_info: "当你的判定牌生效后，你可以获得之。然后，你可令当前回合角色本回合内使用【杀】的次数上限和手牌上限+1。",
			gz_yuanshu: "袁术",
			gzweidi: "伪帝",
			gzweidi_info: "出牌阶段限一次，你可以指定一名本回合从牌堆得到过牌的其他角色并选择一个“军令”，令其选择一项：执行该军令；或令你获得其所有手牌，然后交给其等量的牌。",
			gzyongsi: "庸肆",
			gzyongsi_info: "锁定技，若场上没有【玉玺】，则视为你装备了【玉玺】；当你成为【知己知彼】的目标时，你展示你的所有手牌。",
			//gzyongsi_eff1:'玉玺',
			//gzyongsi_eff2:'玉玺',
			gz_zhangxiu: "张绣",
			gzfudi: "附敌",
			gzfudi_info: "当你受到伤害后，你可以交给伤害来源一张手牌。若如此做，你对其势力中体力值最大且不小于你的一名角色造成1点伤害。",
			gzcongjian: "从谏",
			gzcongjian_info: "锁定技，当你于回合外造成伤害，或于回合内受到伤害时，此伤害+1。",
			gz_jun_caocao: "君曹操",
			gz_jun_caocao_prefix: "君",
			jianan: "建安",
			jianan_info: "君主技，只要此武将牌处于明置状态，你便拥有“五子良将纛”。",
			g_jianan: "五子良将纛",
			wuziliangjiangdao: "五子良将纛",
			wuziliangjiangdao_ab: "将纛",
			wuziliangjiangdao_bg: "纛",
			wuziliangjiangdao_info: "魏势力角色的准备阶段，其可以弃置一张牌。若如此做，其选择一张暗置的武将牌（若没有，则选择一张暗置），然后获得下列技能中的一项（场上所有角色已有的技能无法选择）且不能明置选择的武将牌直到你的下个回合开始：〖突袭〗，〖巧变〗，〖骁果〗，〖节钺〗，〖断粮〗。",
			huibian: "挥鞭",
			huibian_info: "出牌阶段限一次，你可以选择一名魏势力角色和另一名已受伤的魏势力角色。若如此做，你对前者造成1点伤害，然后其摸两张牌，然后后者回复1点体力。",
			gzzongyu: "总御",
			gzzongyu_info: "当【六龙骖驾】进入其他角色的装备区后，你可以将你装备区内所有坐骑牌（至少一张）与【六龙骖驾】交换位置。锁定技，当你使用坐骑牌后，若场上或弃牌堆中有【六龙骖驾】，则将【六龙骖驾】置入你的装备区。",

			yigui: "役鬼",
			yigui_info: "当你首次明置此武将牌时，你将剩余武将牌堆的两张牌置于武将牌上，称为“魂”；你可以展示一张武将牌上的“魂”并将其置入剩余武将牌堆，视为使用一张本回合内未以此法使用过的基本牌或普通锦囊牌。（此牌须指定目标，且目标须为未确定势力的角色或野心家或与此“魂”势力相同的角色）",
			yigui_init: "役鬼",
			yigui_init_info: "",
			yigui_refrain: "役鬼",
			yigui_refrain_info: "",
			yigui_shan: "役鬼",
			yigui_wuxie: "役鬼",
			yigui_gzshan: "役鬼",
			yigui_gzwuxie: "役鬼",
			jihun: "汲魂",
			jihun_info: "当你受到伤害后，或与你势力不同的角色脱离濒死状态后，你可以将剩余武将牌堆的一张牌置于武将牌上，称为“魂”。",

			_guozhan_marks: "标记",
			_guozhan_marks_backup: "标记",
			xianqu_mark: "先驱",
			zhulianbihe_mark: "珠联璧合",
			yinyang_mark: "阴阳鱼",
			_zhulianbihe_mark_tao: "珠联",
			_yinyang_mark_add: "阴阳鱼",
			yinyang_add: "阴阳鱼",

			gzjushou: "据守",
			gzjushou_info: "结束阶段，你可以摸X张牌（X为亮明势力数），然后弃置一张手牌。若以此法弃置的牌为装备牌，则改为使用此牌。若X大于2，则你将武将牌叠置。",
			new_duanliang: "断粮",
			new_duanliang_info: "出牌阶段，你可以将一张黑色基本牌或黑色装备牌当做【兵粮寸断】使用。你使用【兵粮寸断】没有距离限制。若你对距离超过2的角色发动了〖断粮〗，则本回合不能再发动〖断粮〗。",
			new_shushen: "淑慎",
			new_shushen_info: "当你回复1点体力后，你可令一名其他角色摸一张牌。",
			new_luanji: "乱击",
			new_luanji_info: "你可以将两张与你本回合以此法转化的花色均不相同的手牌当【万箭齐发】使用。当一名与你势力相同的角色因响应此牌而打出【闪】时，该角色摸一张牌。",
			new_qingcheng: "倾城",
			new_qingcheng_info: "出牌阶段，你可以弃置一张黑色牌并选择一名武将牌均明置的其他角色，然后你暗置其一张武将牌。若你以此法弃置的牌为装备牌，则你可以暗置另一名武将牌均明置的角色的一张武将牌。",
			huoshui: "祸水",
			huoshui_info: "锁定技。你的回合内，①其他角色不能明置武将牌。②当你使用【杀】或【万箭齐发】指定目标后，若目标角色与你势力不同且有暗置武将牌，则其不能使用或出【闪】直到此牌结算结束。",
			new_kongcheng: "空城",
			new_kongcheng_info: "锁定技，若你没有手牌，1.当你成为【杀】或【决斗】的目标时，取消之；2.你的回合外，其他角色交给你牌后，你将这些牌置于你的武将牌上。摸牌阶段开始时，你获得武将牌上的这些牌。",
			new_keji: "克己",
			new_keji_info: "锁定技，若你没有在出牌阶段内使用过颜色不同的牌，则你本回合的手牌上限+4。",
			keji_add: "克己",
			keji_add_info: "",
			new_mouduan: "谋断",
			new_mouduan_info: "结束阶段，若你于本回合内使用过四种花色或三种类别的牌，则你可以移动场上的一张牌。",
			new_longdan: "龙胆",
			new_longdan_info: "你可以将【杀】当【闪】，【闪】当【杀】使用或打出。当你发动〖龙胆〗使用的【杀】被【闪】抵消时，你可以对另一名角色造成1点伤害；当你发动〖龙胆〗使用的【闪】抵消了【杀】时，你可以令一名其他角色回复1点体力（不能是【杀】的使用者）。",
			fz_new_longdan: "龙胆",
			fz_new_longdan_info: "你可以将【杀】当【闪】，【闪】当【杀】使用或打出。当你发动〖龙胆〗使用的【杀】被【闪】抵消时，你可以对另一名角色造成1点伤害；当你发动〖龙胆〗使用的【闪】抵消了【杀】时，你可以令一名其他角色回复1点体力（不能是【杀】的使用者）。",
			gzpaoxiao: "咆哮",
			gzpaoxiao_info: "锁定技，你使用【杀】无数量限制；当你于一回合内使用第二张【杀】时，摸一张牌。",
			new_kurou: "苦肉",
			new_kurou_info: "出牌阶段限一次，你可以弃置一张牌，然后失去1点体力并摸三张牌，本回合使用【杀】的次数上限+1。",
			kurou_effect: "苦肉",
			kurou_effect_info: "",
			new_chuli: "除疠",
			new_chuli_info: "出牌阶段限一次，若你有牌，你可以选择至多三名势力各不相同或未确定势力的其他角色，你弃置你和这些角色的各一张牌。然后所有以此法弃置过黑桃牌的角色各摸一张牌。",
			baka_hunshang: "魂殇",
			baka_hunshang_info: "副将技，此武将牌减少半个阴阳鱼；准备阶段，若你的体力值不大于1，则你获得〖英姿〗和〖英魂〗直到回合结束。",
			baka_yinghun: "英魂",
			baka_yinghun_info: "准备阶段，你可令一名其他角色执行一项：摸X张牌，然后弃置一张牌；或摸一张牌，然后弃置X张牌（X为你已损失的体力值）。",
			baka_yingzi: "英姿",
			baka_yingzi_info: "锁定技，摸牌阶段摸，你多摸一张牌；你的手牌上限+X（X为你已损失的体力值）。",
			gzyiji: "遗计",
			gzyiji_info: "当你受到伤害后，你可以观看牌堆顶的两张牌，并将其交给任意角色。",
			gzjieming: "节命",
			gzjieming_info: "当你受到伤害后，你可以令一名角色将手牌摸至X张（X为其体力上限且最多为5）。",
			gzfangzhu: "放逐",
			gzfangzhu_info: "当你受到伤害后，你可以令一名其他角色选择一项：⒈摸X张牌并将武将牌叠置；⒉弃置X张牌并失去1点体力（X为你已损失的体力值）。",
			fengyin_main: "封印[主将]",
			fengyin_main_info: "",
			fengyin_vice: "封印[副将]",
			fengyin_vice_info: "",
			new_tieji: "铁骑",
			new_tieji_info: "当你使用【杀】指定目标后，你可以令其一张明置的武将牌上的非锁定技于本回合内失效，然后你进行判定，除非该角色弃置与结果花色相同的一张牌，否则其不能使用【闪】响应此【杀】。",
			hmkyuanyu: "远域",
			hmkyuanyu_info: "锁定技，当你受到伤害时，若伤害来源与你的座次不相邻，防止此伤害。",
			hmkguishu: "鬼术",
			hmkguishu_info: "出牌阶段，你可以将一张黑桃手牌当作【知己知彼】或【远交近攻】使用。若你本局游戏内已经发动过了〖鬼术〗，则你必须选择与上次不同的选项。",
			_mingzhisuodingji: "亮将",
			_mingzhisuodingji_info: "出牌阶段，你可以明置拥有“锁定技”的武将牌。",

			gz_jun_liubei: "君刘备",
			gz_jun_liubei_prefix: "君",
			gz_jun_zhangjiao: "君张角",
			gz_jun_zhangjiao_prefix: "君",
			gz_jun_sunquan: "君孙权",
			gz_jun_sunquan_prefix: "君",
			gz_liqueguosi: "李傕郭汜",
			gz_bianfuren: "卞夫人",
			gz_lvfan: "吕范",
			gz_shamoke: "沙摩柯",
			gz_masu: "马谡",
			gz_yuji: "于吉",

			gzshushen: "淑慎",
			gzshushen_info: "当你回复1点体力时，你可令与你势力相同的一名其他角色摸一张牌。",
			_lianheng: "合纵",
			lianheng_tag: "合纵",
			guo_tag: "国",
			qianhuan: "千幻",
			qianhuan_bg: "幻",
			qianhuan_info: "当与你势力相同的一名角色受到伤害后，你可以将一张与你武将牌上花色均不同的牌置于你的武将牌上。当一名与你势力相同的角色成为基本牌或锦囊牌的唯一目标时，你可以移去一张“千幻”牌，取消之。",
			gzsanyao_info: "出牌阶段限一次。你可以弃置一张牌，对一名手牌数或体力值大于你的角色造成1点伤害。",
			gzzhiman: "制蛮",
			gzzhiman_info: "当你对其他角色造成伤害时，你可以防止此伤害。若如此做，你获得其装备区或判定区里的一张牌。然后若该角色与你势力相同，该角色可以变更副将。",

			gzdiancai: "典财",
			gzdiancai_info: "其他角色的出牌阶段结束时，若你于此阶段失去了x张或更多的牌，则你可以将手牌摸至体力上限。若如此做，你可以变更副将（x为你的体力值）。",
			xuanlve: "旋略",
			xuanlve_info: "当你失去装备区里的牌后，你可以弃置一名其他角色的一张牌。",
			lianzi: "敛资",
			lianzi_info: "出牌阶段限一次，你可以弃置一张手牌，然后亮出牌堆顶X张牌（X为吴势力角色装备区里的牌和“烽火”的总和），获得其中所有与你弃置牌类别相同的牌，将其余的牌置入弃牌堆，若你以此法一次获得了三张或更多的牌，则你失去技能〖敛资〗并获得技能〖制衡〗。",
			gzqice: "奇策",
			gzqice_backup: "奇策",
			gzqice_info: "出牌阶段限一次，你可以将所有手牌当做任意一张普通锦囊牌使用（此牌的目标数不能超过你的手牌数）。然后，你可以变更副将。",
			gzyuejian: "约俭",
			gzyuejian_info: "锁定技，与你势力相同角色的弃牌阶段开始时，若其本回合未使用牌指定过其他势力的角色为目标，则该角色本回合手牌上限+X（X为其已损失的体力值）。",
			gzxiongsuan: "凶算",
			gzxiongsuan_info: "限定技，出牌阶段，你可以弃置一张手牌并选择与你势力相同的一名角色，对其造成1点伤害，然后你摸三张牌。若该角色有已发动的限定技，则你选择其中一个限定技，此回合结束后视为该限定技未发动过。",
			gzhuashen: "化身",
			gzhuashen_info: "准备阶段，若你的“化身”不足两张，则你可以观看剩余武将牌堆中的五张牌，然后扣置其中至多两张武将牌在你的武将旁，称为“化身”；若“化身”有两张以上，则你可以用剩余武将牌堆顶的一张牌替换一张“化身”。你可以于相应的时机明置并发动“化身”的一个技能，技能结算完成后将该“化身”放回剩余武将牌堆。你每个时机只能发动一张“化身”的技能，且不能发动带有技能类型的技能（锁定技、限定技等）。",
			gzxinsheng: "新生",
			gzxinsheng_info: "当你受到伤害后，你可以从剩余武将牌堆中扣置一张牌加入到“化身”牌中。",

			jubao: "聚宝",
			jubao_info: "锁定技，你装备区里的宝物牌不能被其他角色获得。结束阶段，若场上或弃牌堆有【定澜夜明珠】，则你摸一张牌，然后获得装备区里有【定澜夜明珠】角色的一张牌。",
			jiahe: "嘉禾",
			jiahe_info: "君主技，只要此武将牌处于明置状态，你便拥有“缘江烽火图”。",
			jiahe_damage: "缘江烽火图",
			jiahe_put: "烽火",
			jiahe_put_info: "出牌阶段限一次，你可以将一张装备牌置于“缘江烽火图”上，称之为“烽火”。",
			jiahe_skill: "缘江烽火图",
			yuanjiangfenghuotu: "缘江烽火图",
			yuanjiangfenghuotu_info: "①每名吴势力角色的出牌阶段限一次，该角色可以将一张装备牌置于“缘江烽火图”上，称之为“烽火”。②根据“烽火”的数量，所有吴势力角色可于其准备阶段选择并获得其中一个技能直到回合结束：一张及以上：〖英姿〗；两张及以上：〖好施〗；三张及以上：〖涉猎〗；四张及以上：〖度势〗；五张及以上：可额外选择一项。③锁定技，当你受到【杀】或锦囊牌造成的伤害后，你将一张“烽火”置入弃牌堆。",
			yuanjiangfenghuotu_ab: "江图",
			yuanjiangfenghuotu_bg: "图",
			wuxin: "悟心",
			wuxin_info: "摸牌阶段开始时，你可以观看牌堆顶的X张牌（X为群势力角色的数量），然后将这些牌以任意顺序置于牌堆顶。",
			hongfa: "弘法",
			hongfa_use: "天兵",
			hongfa_respond: "天兵",
			hongfa_hp: "黄巾天兵符",
			hongfa_info: "君主技。①只要此武将牌处于明置状态，你便拥有“黄巾天兵符”。②准备阶段，若没有“天兵”，你将牌堆顶的X张牌置于“黄巾天兵符”上，称为“天兵”（X为群势力角色的数量）。",
			wendao: "问道",
			wendao_info: "出牌阶段限一次，你可以弃置一张不为【太平要术】的红色牌，然后获得弃牌堆或场上的一张【太平要术】。",
			huangjintianbingfu: "黄巾天兵符",
			huangjintianbingfu_ab: "兵符",
			huangjintianbingfu_bg: "符",
			huangjintianbingfu_info: "①锁定技，当你计算群势力角色数时，每一张“天兵”均可视为一名群势力角色。②当你失去体力时，你可改为将一张“天兵”置入弃牌堆。③与你势力相同的角色可将一张“天兵”当作【杀】使用或打出。",
			wuhujiangdaqi: "五虎将大旗",
			wuhujiangdaqi_ab: "将旗",
			wuhujiangdaqi_bg: "旗",
			wuhujiangdaqi_info: "存活的蜀势力角色的技能按以下规则改动：<br><strong>武圣</strong>：将“红色牌”改为“任意牌”<br><strong>咆哮</strong>：增加描述“你使用的【杀】无视其他角色的防具”<br><strong>龙胆</strong>：增加描述“你发动〖龙胆〗使用或打出牌时摸一张牌”<br><strong>铁骑</strong>：将“一张明置的武将牌”改为“所有明置的武将牌”<br><strong>烈弓</strong>：增加描述“你的攻击范围+1”",
			zhangwu: "章武",
			zhangwu_info: "锁定技。当【飞龙夺凤】进入弃牌堆或其他角色的装备区后，你获得之。当你不因使用而失去【飞龙夺风】时，你展示此牌，将此牌置于牌堆底并摸两张牌。",
			shouyue: "授钺",
			shouyue_info: "君主技。只要此武将牌处于明置状态，你便拥有“五虎将大旗”。",
			jizhao: "激诏",
			jizhao_bg: "诏",
			jizhao_info: "限定技。当你处于濒死状态时，你可以将手牌补至体力上限，体力回复至2点，失去技能〖授钺〗并获得技能〖仁德〗。",
			gzshoucheng: "守成",
			gzshoucheng_info: "当与你势力相同的一名角色于其回合外失去手牌时，若其没有手牌，则你可以令其摸一张牌。",
			gzmingshi: "名士",
			gzmingshi_info: "锁定技，当你受到伤害时，若伤害来源有暗置的武将牌，此伤害-1。",
			fengshi: "锋矢",
			fengshi_sha: "锋矢",
			fengshi_info: "阵法技，在一个围攻关系中，若你是围攻角色，则你或另一名围攻角色使用【杀】指定被围攻角色为目标后，可令该角色弃置装备区内的一张牌。",
			gzsuishi: "随势",
			gzsuishi2: "随势",
			gzsuishi_info: "锁定技，其他角色进入濒死状态时，若伤害来源与你势力相同，你摸一张牌；其他角色死亡时，若其与你势力相同，你失去1点体力。",
			baoling: "暴凌",
			baoling_info: "主将技，锁定技，出牌阶段结束时，若你有副将，则你移除副将，然后加3点体力上限，回复3点体力，失去技能〖暴凌〗并获得〖崩坏〗。",
			yingyang: "鹰扬",
			yingyang_info: "当你的拼点牌亮出后，你可以令此牌的点数+3或-3（至多为K，至少为1）。",
			hunshang: "魂殇",
			hunshang_info: "副将技，此武将牌减少半个阴阳鱼；准备阶段，若你的体力值不大于1，则你本回合获得“英姿”和“英魂”。",
			gzguixiu: "闺秀",
			gzguixiu_info: "当你明置此武将牌时，你可以摸两张牌；当你移除此武将牌时，你可以回复1点体力。",
			gzcunsi: "存嗣",
			gzcunsi_info: "出牌阶段，你可以移除此武将牌并选择一名角色，然后其获得技能〖勇决〗，若你选择的目标角色不是自己，则其摸两张牌。",
			gzyongjue: "勇决",
			gzyongjue_info: "与你势力相同的一名角色于其回合内使用【杀】结算完成后，若此牌是其本回合内使用的第一张牌，则其可以获得此牌对应的所有实体牌。",
			gzqianxi: "潜袭",
			gzqianxi_info: "准备阶段，你可以进行判定，然后你选择距离为1的一名角色，直到回合结束，该角色不能使用或打出与结果颜色相同的手牌。",
			gzshangyi: "尚义",
			gzshangyi_info: "出牌阶段限一次，你可以令一名其他角色观看你的手牌。若如此做，你选择一项：1.观看其手牌并可以弃置其中的一张黑色牌；2.观看其所有暗置的武将牌。",
			niaoxiang: "鸟翔",
			niaoxiang_sha: "鸟翔",
			niaoxiang_info: "阵法技，在同一个围攻关系中，若你是围攻角色，则你或另一名围攻角色使用【杀】指定被围攻角色为目标后，该角色需依次使用两张【闪】才能抵消。",
			yicheng: "疑城",
			yicheng_info: "当与你势力相同的一名角色成为【杀】的目标后，你可以令该角色摸一张牌，然后弃置一张牌。",
			gzyicheng: "疑城",
			gzyicheng_info: "阵法技。当你和你队列中的角色使用【杀】指定第一个目标后，或成为【杀】的目标后，其可以摸一张牌，然后弃置一张牌。",
			yizhi: "遗志",
			yizhi_info: "副将技，此武将牌减少半个阴阳鱼。若你的主将拥有技能〖观星〗，则将其描述中的X改为5；若你的主将没有技能〖观星〗，则你视为拥有技能〖观星〗。",
			tianfu: "天覆",
			tianfu_info: "主将技，阵法技，若当前回合角色与你处于同一队列，则你视为拥有技能〖看破〗。",
			ziliang: "资粮",
			ziliang_info: "副将技，当与你势力相同的一名角色受到伤害后，你可以将一张“田”交给该角色。",
			gzjixi: "急袭",
			gzjixi_info: "主将技，此武将牌减少半个阴阳鱼。你可以将一张“田”当作【顺手牵羊】使用。",
			huyuan: "护援",
			huyuan_info: "结束阶段，你可以将一张装备牌置入一名角色的装备区，然后你可以弃置该角色距离为1的一名角色的一张牌。",
			heyi: "鹤翼",
			heyi_info: "阵法技。与你处于同一队列的角色视为拥有技能〖飞影〗。",
			gzhuyuan: "护援",
			gzhuyuan_info: "结束阶段，你可以选择一项：⒈将一张非装备牌交给一名其他角色。⒉将一张装备牌置入其他角色的装备区内，然后你可以弃置场上的一张牌。",
			gz_shibing1wei: "魏兵",
			gz_shibing2wei: "魏兵",
			gz_shibing1shu: "蜀兵",
			gz_shibing2shu: "蜀兵",
			gz_shibing1wu: "吴兵",
			gz_shibing2wu: "吴兵",
			gz_shibing1qun: "群兵",
			gz_shibing2qun: "群兵",
			gz_shibing1jin: "晋兵",
			gz_shibing2jin: "晋兵",
			gz_shibing1ye: "士兵",
			gz_shibing2ye: "士兵",
			gz_shibing1key: "键兵",
			gz_shibing2key: "键兵",
			gzduanchang: "断肠",
			gzduanchang_info: "锁定技，当你死亡时，你令杀死你的角色失去一张武将牌上的所有技能。",
			gzweimu: "帷幕",
			gzweimu_info: "锁定技，当你成为黑色普通锦囊牌的目标时，或有黑色延时锦囊牌进入你的判定区时，取消之。",
			gzqianxun: "谦逊",
			gzqianxun_info: "锁定技，当你成为【顺手牵羊】的目标时，或有【乐不思蜀】进入你的判定区时，取消之。",
			gzkongcheng: "空城",
			gzkongcheng_info: "锁定技，当你成为【杀】或【决斗】的目标时，若你没有手牌，则取消之。",
			gzxiaoji: "枭姬",
			gzxiaoji_info: "当你失去装备区里的牌后，你可以摸一张牌。若你不是当前回合角色，则你改为摸三张牌。",
			gzrende: "仁德",
			gzrende_info: "出牌阶段，你可以将任意张手牌交给其他角色，然后若你于此阶段内给出第三张“仁德”牌时，你回复1点体力。",
			gzzhiheng: "制衡",
			gzzhiheng_info: "出牌阶段限一次，你可以弃置至多X张牌（X为你的体力上限），然后摸等量的牌。",
			duoshi: "度势",
			duoshi_info: "出牌阶段限四次，你可以将一张红色手牌当做【以逸待劳】使用。",
			gzxiaoguo: "骁果",
			gzxiaoguo_info: "其他角色的结束阶段，你可以弃置一张基本牌，令该角色选择一项：1.弃置一张装备牌；2.受到你对其造成的1点伤害。",

			gzdangxian: "当先",
			gzdangxian_info: "锁定技。当你首次明置此武将牌时，你获得一枚“先驱”标记。回合开始时，你获得一个额外的出牌阶段。",
			gzhuanshi: "缓释",
			gzhuanshi_info: "一名己方角色的判定牌生效前，你可打出一张牌代替之。",
			gzhongyuan: "弘援",
			gzhongyuan_info: "①出牌阶段限一次。你可以令一张没有「合纵」标签的卡牌视为拥有「合纵」标签直到本回合结束。②当你即将因合纵效果摸牌时，你可放弃摸牌，并令一名己方角色摸等量的牌。",
			gzmingzhe: "明哲",
			gzmingzhe_info: "你的回合外，当你使用或打出红色手牌，或失去装备区内的红色装备牌时，你可摸一张牌。",
			gzquanbian: "权变",
			gzquanbian_info: "当你于出牌阶段内使用/打出手牌时，若此牌有花色且你本回合内未使用/打出过该花色的其他手牌，则你可以观看牌堆顶X张牌，选择获得其中的一张并展示之。若你本回合使用过与得到的牌花色相同的牌，则你本回合内不能再发动〖权变〗。",
			gzhuishi: "慧识",
			gzhuishi_info: "摸牌阶段，你可以放弃摸牌，改为观看牌堆顶的X张牌，获得其中的一半（向下取整），然后将其余牌置入牌堆底。（X为弃牌堆顶的两张牌的名称字数之和）",
			gzqingleng: "清冷",
			gzqingleng_info: "一名角色的回合结束时，若其有未明置的武将牌，则你可将一张牌当无距离限制的冰属性【杀】对其使用；若其所有武将牌均未明置，则你摸一张牌。",
			gzchoufa: "筹伐",
			gzchoufa_info: "出牌阶段限一次，你可展示一名其他角色的一张手牌A。你令其所有类型与A不同的手牌的牌名均视为【杀】且均视为无属性直到本回合结束。",
			gzbolan: "博览",
			gzbolan_info: "每名角色的出牌阶段限一次。其可以随机展示武将牌堆顶的一张武将牌，然后根据此武将牌包含的势力选择获得一个技能直到回合结束：魏:〖奇策〗；蜀:〖挑衅〗；吴:〖制衡〗；群:〖除疠〗；晋:〖三陈〗。若该角色不为你，则其失去1点体力。",
			gzsanchen: "三陈",
			gzsanchen_info: "出牌阶段，你可选择一名本回合内未选择过的角色。其摸三张牌，然后弃置三张牌。若其未以此法弃置牌或以此法弃置的牌的类别均不相同，则你于本回合获得一枚“陈”且其摸一张牌；否则你本阶段内不能再发动〖三陈〗。",
			gzpozhu: "破竹",
			gzpozhu_info: "主将技。此武将牌减少半个阴阳鱼。出牌阶段，你可以移去一枚“陈”并将一张手牌当做【出其不意】使用。",
			gzyimie: "夷灭",
			gzyimie_info: "主将技，此武将牌减少一整个阴阳鱼。每回合限一次，当你对其他角色造成伤害时，若伤害值X小于Y，则你可失去1点体力，将伤害值改为Y。此伤害结算结束后，其回复(Y-X)点体力。（Y为其体力值）",
			gztairan: "泰然",
			gztairan_info: "出牌阶段开始时，你可以失去任意点体力并弃置任意张牌（弃牌数不能大于你已损失的体力值）。若如此做，本回合结束时，你回复等量的体力并摸等量的牌。",
			gzxuanbei: "选备",
			gzxuanbei_info: "①当你首次明置此武将牌时，你获得两张拥有“应变”或“合纵”标签的牌（不足则摸牌），且你本回合内使用带有“应变”标签的牌时直接强化，使用带有“合纵”标签的牌时摸一张牌。②当你死亡时，你可以令一名其他角色变更副将。",
			gzzhaosong: "诏颂",
			gzzhaosong_info: "每局游戏每项限一次。①一名角色进入濒死状态时，你可以令其回复至2点体力并摸一张牌。②出牌阶段，你可观看一名其他角色的所有暗置武将牌和手牌，然后可以获得其区域内的一张牌。③一名角色使用【杀】选择唯一目标后，你可以为此【杀】增加两个目标。",
			gzlisi: "离思",
			gzlisi_info: "一名己方角色死亡后，你可以选择〖诏颂〗中的一个已发动过的选项，令其视为未发动过。",
			gzcaiyuan: "才媛",
			gzcaiyuan_info: "锁定技。结束阶段，若你的手牌数大于本回合开始时的手牌数，则你摸两张牌或回复1点体力。",
			gzwanyi: "婉嫕",
			gzwanyi_info: "出牌阶段每项各限一次。你可以将一张带有“合纵”标签的牌当做【联军盛宴】/【火烧连营】/【挟天子以令诸侯】/【戮力同心】使用。",
			gzwanyi_info_guozhan_yingbian: "出牌阶段每项各限一次。你可以将一张带有“应变”标签的牌当做【逐近弃远】/【洞烛先机】/【水淹七军】/【出其不意】使用。",
			gzmaihuo: "埋祸",
			gzmaihuo_info: "限定技。当有己方角色成为【杀】的目标时，你可以取消此【杀】的所有目标。然后此【杀】的使用者下回合开始时，其视为对你使用一张【杀】。若此【杀】对你造成伤害，则你防止此伤害，摸两张牌并移除此武将牌（若此武将牌为副将则改为变更副将）。",
			gzzhenxi: "震袭",
			gzzhenxi_info: "当你使用【杀】指定目标后，你可以选择一项：1.弃置目标角色一张牌；2.将一张♦非锦囊牌当做【乐不思蜀】或♣非锦囊牌当做【兵粮寸断】对目标角色使用；3.背水：若其有暗置的武将牌且你的武将牌均明置，则你可以依次执行这两项。",
			gzjiansu: "俭素",
			gzjiansu_tag: "俭",
			gzjiansu_info: "副将技。此武将牌减少半个阴阳鱼。①当你于回合外得到牌后，你可以展示这些牌，称为“俭”。②出牌阶段开始时，你可以弃置任意张“俭”，令一名体力值不大于X的角色回复1点体力（X为你以此法弃置的牌数）。",
			gzzhuidu: "追妒",
			gzzhuidu_info: "出牌阶段限一次。当你造成伤害时，你可以令受伤角色选择一项：1.此伤害+1；2.弃置装备区里的所有牌。若该角色为女性，则你可以弃置一张牌，改为令其选择两项。",
			gzshigong: "示恭",
			gzshigong_info: "限定技。当你于回合外进入濒死状态时，你可以移除副将，然后令当前回合角色选择一项：1.获得你以此法移除的副将武将牌上的一个没有技能标签的技能，然后令你将体力值回复至体力上限；2.令你将体力值回复至1点。",
			gz_old_huaxiong: "华雄",
			gzyaowu: "耀武",
			gzyaowu_info: "限定技。当你造成伤害后，你可以明置此武将牌，然后你加2点体力上限并回复2点体力，修改〖恃勇〗，且当你死亡后，所有与你势力相同的角色失去1点体力。",
			gzshiyong: "恃勇",
			gzshiyong_info: "锁定技。当你受到牌造成的伤害后，若此牌不为红色，你摸一张牌。",
			gzshiyongx: "恃勇·改",
			gzshiyongx_info: "锁定技。当你受到牌造成的伤害后，若此牌不为黑色，伤害来源摸一张牌。",
			gztanfeng: "探锋",
			gztanfeng_info: "准备阶段，你可以弃置与你势力不同的一名角色区域内的一张牌，然后其可以令你对其造成1点火焰伤害，并令你跳过本回合的一个阶段（准备阶段和结束阶段除外）。",
			//官盗「群雄割据」
			gzduanshi: "断势",
			gzduanshi_info: "主将技，锁定技。此武将牌减少半个阴阳鱼。当一名角色因杀死与你势力相同的角色而摸牌时，其少摸一张牌。然后你摸一张牌。",
			gzjingce: "精策",
			gzjingce_info: "回合结束时，若于本回合内进入弃牌堆的牌数不小于X，你可以执行一个额外的摸牌阶段；若你本回合使用过的牌数不小于X，你可以执行一个额外的出牌阶段（X为你的体力值）。",
			gzzhengrong: "征荣",
			gzzhengrong_info: "锁定技。①你至大势力角色的距离-1。②当你选择“军令”时，你令可选军令数量+1。③当你造成或受到伤害时，若你没有存活的队友，则此伤害+1。",
			gzhongju: "鸿举",
			gzhongju_info: "限定技。出牌阶段，你可以选择一名其他角色A并选择一个“军令”。你执行该军令，然后令除A以外的所有其他角色依次选择一项：⒈执行该军令。⒉于本回合视为移出游戏。",
			gzbiaozhao: "表召",
			gzbiaozhao_info: "出牌阶段限一次。你可以选择两名势力不同的其他角色A和B。你视为对A使用一张【知己知彼】，然后将一张牌交给B并摸一张牌。",
			gzyechou: "业仇",
			gzyechou_info: "锁定技。当你死亡时，你视为对杀死你的角色依次使用三张【杀】，其中第一张不可被响应，第二张无视防具，第三张对其造成的伤害+1。若其以此法进入濒死状态，则于本次濒死结算中除其外与其势力相同的角色不能对其使用【桃】。",
			//官盗「十年经典」
			gzdianhu: "点虎",
			gzdianhu_info: "锁定技。当你首次明置此武将牌时，你选择一名其他角色。与你势力相同的角色对其造成伤害后，伤害来源摸一张牌。",
			gzjianji: "谏计",
			gzjianji_info: "出牌阶段限一次。你可以令一名角色摸一张牌并展示之，然后其可以使用此牌。",
			gzgongjian: "攻坚",
			gzgongjian_info: "①当其他角色的牌因弃置而进入弃牌堆后，若令其弃置这些牌的角色为你，你获得其中所有的【杀】。②每回合限一次，当一名角色使用【杀】指定目标后，若有目标与本局游戏上一张被使用的【杀】相同，你可以令这些目标弃置两张牌。",
			gzkuimang: "溃蟒",
			gzkuimang_info: "锁定技。当你杀死与你势力不同且处于队列的角色时，你摸两张牌。",
			gzyinpan: "引叛",
			gzyinpan_info: "出牌阶段限一次。你可以选择一名其他角色，令所有与其势力不同的角色依次选择是否对其使用一张无距离次数限制的【杀】。然后其下回合使用【杀】的次数上限+X（X为其以此法受到的伤害次数），若其以此法进入过濒死状态，其回复1点体力。",
			gzxingmou: "兴谋",
			gzxingmou_info: "锁定技。①你杀死其他角色或其他角色杀死你均不执行奖惩。②其他角色因执行奖惩而摸牌时，你摸一张牌。",
			//官正「十年踪迹十年心」
			gzyouyan: "诱言",
			gzyouyan_info: "回合内限一次。当你的牌因弃置而进入弃牌堆后，你可以展示牌堆顶的四张牌，然后获得其中与你此次弃置的牌花色均不同的牌。",
			gzzhuihuan: "追还",
			gzzhuihuan_info: "结束阶段，你可以选择至多两名角色，然后依次为被选择的角色标记A或B（字母不能重复标记）。直到你的下回合开始，当A第一次受到伤害后，其对来源造成1点伤害；当B第一次受到伤害后，来源弃置两张手牌。",
			//插个眼，手杀国战新张鲁
			gzrebushi: "布施",
			gzrebushi_info: "①回合结束后，你获得X个“义舍”标记（X为你的体力值）。②其他角色的准备阶段，你可以失去1个“义舍”标记，交给其一张牌并摸两张牌。③准备阶段，你须弃置Y张牌，然后失去所有“义舍”标记（Y为场上存活人数-你的体力值-2）。",
			gzremidao: "米道",
			gzremidao_info: "①结束阶段，若你的武将牌上没有“米”，则你可以摸两张牌。若如此做，你将两张牌置于武将牌上，称为“米”。②一名角色的判定牌生效前，你可以打出一张“米”作为新的判定牌，然后你获得原判定牌。",
			jiahe_reyingzi: "英姿",
			jiahe_haoshi: "好施",
			jiahe_shelie: "涉猎",
			jiahe_duoshi: "度势",
			//国战典藏2023
			gzdiaodu: "调度",
			gzdiaodu_info: "①与你势力相同的角色使用装备牌时，其可以摸一张牌。②出牌阶段开始时，你可以获得一名与你势力相同的角色的装备区里的一张牌，然后你将此牌交给另一名角色。",
			gzdiaodu_backports: "调度",
			gzdiaodu_backports_info: "①与你势力相同的角色使用装备牌时，其可以摸一张牌。②出牌阶段开始时，你可以获得一名与你势力相同的角色的装备区里的一张牌，然后你可以将此牌交给另一名与你势力相同的其他角色。",
			gzqiance: "谦策",
			gzqiance_info: "与你势力相同的角色使用锦囊牌指定第一个目标后，你可以令其中的所有大势力角色无法响应此牌。",
			gzjujian: "举荐",
			gzjujian_info: "副将技，锁定技。①此武将牌计算体力上限时减少半个阴阳鱼。②与你势力相同的角色进入濒死状态时，你可以令其将体力值回复至1点，然后你变更副将。",
			gztongling: "通令",
			gztongling_info: "出牌阶段限一次，当你对一名与你势力不同的角色A造成伤害后，你可以选择一名与你势力相同的角色B，令B选择是否对A使用一张牌。若B选择使用，则此牌结算后，若此牌造成过伤害，你和B各摸两张牌，否则A获得你对其造成伤害的牌。",
			gzjinyu: "近谀",
			gzjinyu_info: "当你明置此武将牌后，你令所有与你距离为1以内的角色依次执行以下效果：若其武将牌均明置，则其选择一张武将牌暗置，否则其弃置两张牌。",
			gzrehuaiyi: "怀异",
			gzrehuaiyi_info: "出牌阶段限一次，你可以展示所有手牌。若其中至少包含两种颜色，则你可以弃置其中一种颜色的所有牌，然后获得至多等量名角色的各一张牌。然后你将以此法得到的装备牌置于武将牌上，称为“异”。你可以将“异”如手牌般使用或打出。",
			gzrezisui: "恣睢",
			gzrezisui_info: "锁定技。①摸牌阶段，你多摸X张牌。②结束阶段，若X大于你的体力上限，你死亡（X为你武将牌上的“异”数）。",
			gztaidan: "太丹",
			gztaidan_taipingyaoshu: "太丹",
			gztaidan_info: "锁定技，若你的防具栏为空且你的防具栏未被废除且场上没有角色装备【太平要术】，则你视为装备【太平要术】。",
			gzrejinghe: "经合",
			gzrejinghe_info: "出牌阶段限一次，你可以转动“天书”，然后令一名角色获得“天书”向上一面的技能直到你的下个回合开始。",
			gzrejinghe_faq: "转动“天书”",
			gzrejinghe_faq_info: "<br><li>若游戏未拥有“天书”，系统将[雷击，阴兵，活气，鬼助，仙授，论道，观月，言政]以顺时针方向组成圆环作为“天书”，并转动圆环将随机一个技能至于最上面。<br><li>若游戏已拥有“天书”，则以逆时针方向转动转动“天书”至下个技能于最上面。",

			gz_key_ushio: "冈崎汐",
			ushio_huanxin: "幻心",
			ushio_huanxin_info: "当你受到伤害后/使用【杀】造成伤害后/使用装备牌后，你可进行判定。然后你获得判定牌并弃置一张牌。",
			ushio_xilv: "汐旅",
			ushio_xilv2: "汐旅",
			ushio_xilv_info: "锁定技，此武将牌可作为任意单势力武将牌的副将。当你进行判定后，你令你的手牌上限+1直至你的下个结束阶段。",

			//官盗2023
			fakexiaoguo: "骁果",
			fakexiaoguo_info: "一名其他角色的准备阶段，你可以弃置任意张基本牌，然后弃置其装备区等量的牌，若其装备区的牌数小于你弃置的牌数，则你对其造成1点伤害。",
			fakeduanbing: "短兵",
			fakeduanbing_info: "①你使用【杀】可以额外指定一名距离为1或以内的目标。②当你使用【杀】指定唯一目标后，你令目标角色需要额外使用一张【闪】响应此【杀】。",
			fakeduoshi: "度势",
			fakeduoshi_info: "每轮限一次，友方角色可以将一张红色手牌当作【以逸待劳】使用，然后若你为小势力角色，你可以令一名友方角色将X张手牌当作不可被响应的【火烧连营】使用（X为此【以逸待劳】指定的目标数）。",
			fakehanzhan: "酣战",
			fakehanzhan_info: "有你参与的拼点事件结束后，没赢的角色可以获得对方装备区的一张牌。",
			fakeshuangxiong: "双雄",
			fakeshuangxiong_info: "①摸牌阶段，你可以放弃摸牌并进行判定，本回合你可以将一张与此牌颜色不同的手牌当作【决斗】使用。②当你的判定牌于回合内生效后，你获得此牌。",
			fakeyicheng: "疑城",
			fakeyicheng_info: "与你势力相同的角色成为【杀】的目标后，你可以令其摸一张牌，然后其可以使用一张装备牌，其于此回合结束时弃置X张牌（X为你本回合对其发动此技能的次数）。",
			fakefenming: "奋命",
			fakefenming_info: "出牌阶段限一次，若你处于横置状态，你可以弃置所有处于横置状态的角色的各一张牌。",
			fakebaoling: "暴凌",
			fakebaoling_info: "主将技，锁定技，出牌阶段结束时，若你有副将，则你移除副将，加3点体力上限并回复3点体力，然后获得〖崩坏〗。",
			fakebenghuai: "崩坏",
			fakebenghuai_info: "结束阶段，若你的体力值不为全场最低，则你选择一项：①失去1点体力；②减1点体力上限；③背水：执行一个额外的摸牌阶段。",
			fakediaodu: "调度",
			fakediaodu_info: "①每回合每种牌的类别限一次，与你势力相同的角色使用牌时，若此牌有目标且包含其，则其可以摸一张牌。②出牌阶段开始时，你可以获得与你势力相同的一名角色装备区内的一张牌，然后你可以将此牌交给另一名与你势力相同的其他角色。",
			fakeyigui: "役鬼",
			fakeyigui_info: "①当你首次明置此武将牌时，你将剩余武将牌堆的两张牌称为“魂”置于武将牌上。②你可以展示一张武将牌上的“魂”并将其置入剩余武将牌堆，视为使用一张本回合内未以此法使用过的类别的基本牌或普通锦囊牌（此牌须指定目标，且目标须为未确定势力的角色或野心家或与此“魂”势力相同的角色）。",
			fakejihun: "汲魂",
			fakejihun_info: "①当你受到伤害后，或与你势力不同的角色脱离濒死状态后，你可以将剩余武将牌堆的一张牌称为“魂”置于武将牌上。②准备阶段，你可以将至多两张“魂”置入剩余武将牌堆，然后将剩余武将牌堆的等量张牌称为“魂”置于武将牌上。",
			fakejueyan: "决堰",
			fakejizhi: "集智",
			fakejueyan_info: "主将技。①此武将牌计算体力上限时减少半个阴阳鱼。②准备阶段，你可以选择一个区域并于本回合的结束阶段弃置此区域的所有牌，然后你于本回合获得以下对应效果：⒈判定区：跳过判定阶段，获得〖集智〗直到回合结束；⒉装备区：摸三张牌，本回合手牌上限+3；⒊手牌区：本回合使用【杀】的额定次数+3。",
			fakequanji: "权计",
			fakequanji_info: "①每回合每项各限一次，当你造成或受到伤害后，你可以摸X张牌，然后将等量的牌称为“权”置于武将牌上。②你的手牌上限+X（X为你武将牌上的“权”数）。",
			fakepaiyi: "排异",
			fakepaiyi_info: "出牌阶段限一次，你可以选择一名角色，然后选择一个军令令其选择是否执行。若其执行，则你摸X张牌，然后将一张“权”置入弃牌堆；若其不执行，则你可以对至多X名与其势力相同的角色各造成1点伤害，然后将等量的“权”置入弃牌堆。（X为你武将牌上的“权”数）",
			fakeshilu: "嗜戮",
			fakeshilu_info: "①出牌阶段结束时，若你有副将且本阶段未发动过副将武将牌上的非锁定技，则你更换副将至你武将牌上的“戮”未包含的势力并将原副将称为“戮”置于武将牌上。②准备阶段，你弃置X张手牌，然后摸X张牌（X为你武将牌上的“戮”数，少牌全弃，无牌不弃）。",
			fakexiongnve: "凶虐",
			fakexiongnve_info: "①当你使用【杀】造成伤害时或受到【杀】造成的伤害时，若你武将牌上的“戮”包含伤害来源的势力，则你令此伤害+1。②当你受到不为【杀】造成的伤害时，若你武将牌上的“戮”包含伤害来源的势力，则此伤害-1。",
			fakehuaiyi: "怀异",
			fakehuaiyi_info: "出牌阶段限一次，你可以移除副将或弃置一个区域的所有牌，然后令所有大势力角色依次交给你至少一张牌，然后若存在多个大势力，则你移除一个此次交给你牌总数唯一最少的势力的其中一名角色的副将。",
			fakezisui: "恣睢",
			fakezisui_info: "锁定技。①一名角色被你移除副将后，你将被移除的武将牌称为“异”置于武将牌上。②摸牌阶段，你多摸X张牌。③结束阶段，若X大于你的体力上限，你死亡。（X为你武将牌上的“异”数）",
			fakejujian: "举荐",
			fakejujian_info: "副将技。①此武将牌计算体力上限时减少半个阴阳鱼。②结束阶段，你可以弃置一张非基本牌并选择一名友方角色，令其选择摸两张牌或回复1点体力，然后其可以变更副将。",
			fakexibing: "息兵",
			fakexibing_info: "手牌数小于体力值的其他角色于其出牌阶段内使用第一张黑色【杀】或黑色普通锦囊牌指定唯一角色为目标后，你可令该角色将手牌摸至体力值且本回合不能再使用手牌。若你与其均明置了所有武将牌，则你可以暗置你与其各一张武将牌且本回合不能再明置此武将牌。",
			fakechengshang: "承赏",
			fakechengshang_info: "出牌阶段限一次，当你使用存在花色和点数且指定了其他势力角色为目标的牌结算完毕后，若你未因此牌造成过伤害，则你可以摸一张牌，然后本阶段你可以将一张手牌当作初始游戏牌堆中与此牌花色和点数相同的另一张基本牌或普通锦囊牌使用一次。",
			fakezhente: "贞特",
			fakezhente_info: "每回合限一次，当你成为其他角色使用普通锦囊牌或黑色基本牌的目标后，你可令使用者选择一项：1.本回合不能再使用与此牌颜色相同的牌；2.令此牌对你无效。",
			fakezhiwei: "至微",
			fakezhiwei_info: "你明置此武将牌时，选择一名其他角色。该角色造成伤害后，你摸一张牌，该角色受到伤害后，你随机弃置一张手牌。你弃牌阶段弃置的牌均被该角色获得。该角色死亡时，若你的两个武将牌均明置，你暗置此武将牌。若该角色未死亡，则此武将牌被暗置前，取消之。",
			fakekuangcai: "狂才",
			fakekuangcai_info: "锁定技，你于回合内使用牌无距离和次数限制；弃牌阶段开始时，若你本回合内：未使用过牌，则你本回合手牌上限+1；使用过牌但未造成过伤害，则你本回合手牌上限-1。",
			faketunchu: "屯储",
			faketunchu_info: "摸牌阶段，你可以额外摸两张牌，然后你将一至两张牌称为“粮”置于武将牌上。若如此做，你本回合不能使用【杀】。",
			fakeshuliang: "输粮",
			fakeshuliang_info: "友方角色的结束阶段，若你与其的距离不大于你武将牌上的“粮”数，则你可以移去一张“粮”，然后令其摸两张牌。",
			fakedujin: "独进",
			fakedujin_info: "①摸牌阶段，你可以额外摸X张牌（X为你装备区的牌数的一半，向上取整）。②当你首次明置此武将牌时，若你为你们势力第一个明置武将牌的角色，则你获得1个“先驱”标记。",
			fakezhufu: "注傅",
			fakezhufu_info: "出牌阶段，你可以弃置一张本阶段未以此法弃置过的花色的牌，然后根据此牌的花色为你使用的下一张牌添加对应的应变效果：红桃，助战、目标+1；方片，富甲、不可被响应；黑桃，残躯、摸一张牌；草花，空巢、伤害+1。",
			fakeguishu: "鬼术",
			fakeguishu_info: "出牌阶段限一次，你可以将一张黑桃手牌当作【知己知彼】或【远交近攻】使用。若你本局游戏内已经发动过了〖鬼术〗，则你必须选择与上次不同的选项。",
			fakeyuanyu: "远域",
			fakeyuanyu_info: "锁定技，当你受到伤害时，若你不在伤害来源的攻击范围内，则防止此伤害。",
			fakemibei: "秘备",
			fakemibei_info: "①准备阶段，若你的手牌数不为全场最多，则你须选择一名手牌数为全场最多的角色，令其对你发起军令。②当你执行军令后，你将手牌数摸至与发起者相同（至多摸五张）。③当你拒绝执行军令后，你展示一至三张牌，然后你本回合可以将其中一张牌当作另一张基本牌或非延时锦囊牌使用一次。",
			fakeqizhi: "奇制",
			fakeqizhi_info: "当你于回合内声明使用非装备牌A时，你可以弃置不是此牌目标的一名角色的一张牌B，然后其摸一张牌。若A具有应变效果，且A和B的花色相同，则你无视条件触发A的应变效果。",
			fakejinqu: "进趋",
			fakejinqu_info: "结束阶段，你可以摸两张牌，然后你将手牌弃置至X张（X为你本回合发动过〖奇制〗的次数）。",
			fakejuzhan: "拒战",
			fakejuzhan_info: "转换技。阴：当你成为【杀】的目标后，你可以与使用者各摸X张牌，然后若使用者的武将牌均明置，则你可以暗置其一张武将牌，且其本回合不能明置此武将牌。阳，当你使用【杀】指定目标后，你可以获得目标角色的X张牌，然后若你的武将牌均明置，则其可以暗置此武将牌，且你本回合不能明置此武将牌。（X为使用者已损失的体力值且X至少为1）",
			fakedanshou: "胆守",
			fakedanshou_info: "每轮限一次，一名角色的准备阶段，你可以弃置一个区域的所有牌。若如此做，本回合其每个阶段开始时（准备阶段和结束阶段除外），你摸一张牌或令本回合以此法摸牌数+1，然后若你选择了摸牌且你本次至少摸了四张牌，则你可以对其造成1点伤害。",
			fakexunxi: "迅析",
			fakexunxi_info: "其他角色于回合外明置武将牌时，你可以视为对其使用一张【杀】（无距离限制）。",
			fakehuanjia: "擐甲",
			fakehuanjia_info: "锁定技，每回合每项各限一次。①当你成为【杀】的目标后，本回合你视为装备此牌使用者的防具，直到你的装备区中有防具。②当你使用【杀】指定唯一目标后，本回合你视为装备目标角色的武器，直到你的装备区中有武器。",
			fakexiongshu: "凶竖",
			fakexiongshu_info: "每回合限一次，一名角色使用【杀】或伤害类锦囊牌指定第一个目标后，若你为/不为此牌使用者，则你可以摸一张牌并令一名其他角色成为此牌的伤害来源/弃置一张牌并成为此牌的伤害来源。",
			fakejianhui: "奸回",
			fakejianhui_info: "当一名角色受到其势力相同的另一名角色造成的伤害后，你可以令其中一名角色摸一张牌，然后弃置其中另一名角色的一张牌。",
			fakechongxin: "崇信",
			fakechongxin_info: "出牌阶段限一次，你可以选择一名与你势力不同的角色，视为你使用一张指定你与其为目标的【以逸待劳】。",
			fakeweirong: "卫戎",
			fakeweirong_info: "转换技，每轮限一次，出牌阶段。阴：你可以弃置X张牌，然后当你于本轮不因此法得到牌后，你摸一张牌。阳：你可以摸X张牌，然后当你于本轮不因此法失去牌后，你弃置一张牌。（X为你上一轮以此法摸和弃置的牌数之和，且X至少为1，至多为你的体力上限）",
			gz_re_taishici: "太史慈",
			gz_xin_zhuran: "朱然",
			gz_jin_jiachong: "贾充",
			gz_jin_yanghu: "羊祜",
			gz_wangling: "王凌",
			fakequanbian: "权变",
			fakequanbian_tag: "牌堆顶",
			fakequanbian_info: "当你于回合内使用或打出牌时，你可以将一张手牌与牌堆顶X张牌的其中一张进行交换（X为你的体力上限）。",
			fakezhouting: "骤霆",
			fakezhouting_info: "限定技，出牌阶段，你可以依次使用牌堆顶X张牌中所有可以使用的牌，然后获得其中不能使用的牌，然后若有角色因此死亡，则你重置〖骤霆〗（X为你的体力上限）。",
			fakexuanbei: "选备",
			fakexuanbei_info: "①当你首次明置此武将牌时，你摸两张牌，且你本回合内使用带有“应变”标签的牌时直接强化。②每回合限一次，当你使用带有“应变”标签的牌结算完毕后，你可以令一名其他角色获得此牌对应的所有实体牌。③当你死亡时，你可以令一名其他角色变更副将。",
			fakeqingleng: "清冷",
			fakeqingleng_info: "其他角色的结束阶段，若其武将牌均明置，则你可以将一张牌当作冰【杀】对其使用（无距离限制）。然后若此牌未对其造成伤害，则你暗置其一张武将牌，且直到其下个回合开始，其明置此武将牌时，你对其造成1点伤害。",
			fakexijue: "袭爵",
			fakexijue_info: "①当你首次明置此武将牌时，你获得2枚“爵”标记。②回合结束时，若你本回合造成过伤害，则你获得1枚“爵”标记。③你可以于合适的时机发动〖突袭〗或〖骁果〗（至多弃置X张基本牌），然后移去1枚“爵”标记。④摸牌阶段，你改为摸X张牌。（X为你的“爵”标记数，且X至多为你的体力上限）",
			fakexijue_xiaoguo: "骁果",
			fakexijue_xiaoguo_info: "一名其他角色的准备阶段，你可以弃置至多X张基本牌（X为你的“爵”标记数，且X至多为你的体力上限），然后弃置其装备区等量的牌，若其装备区的牌数小于你弃置的牌数，则你对其造成1点伤害。",
			fakeqimei: "齐眉",
			fakeqimei_info: "准备阶段，你可以选择一名其他角色。若如此做，直到回合结束：当你或其获得牌/失去手牌后，若你与其手牌数相等，则另一名角色回复1点体力；当你或其的体力值变化后，若你与其体力值相等，则另一名角色摸一张牌。",
			fakebaoqie: "宝箧",
			fakebaoqie_info: "①当你受到伤害时，若此武将牌未明置过，则你可以明置此武将牌并防止此伤害。②当你首次明置此武将牌时，你可以获得一名角色装备区里所有的宝物牌，然后你可以使用其中的一张牌。",
			fakeciwei: "慈威",
			fakeciwei_info: "其他角色于一回合内使用第偶数张牌时，你可以弃置一张牌并取消此牌的所有目标，然后若此牌为装备牌，你可以获得之且你可以使用之。",
			fakehuirong: "慧容",
			fakehuirong_info: "①当你受到伤害时，若此武将牌未明置过，则你可以明置此武将牌并防止此伤害。②当你首次明置此武将牌时，你可以令一名角色将手牌数调整至其体力值。",
			fakeyanxi: "宴戏",
			fakeyanxi_info: "出牌阶段限一次，你可以展示一名其他角色的一张手牌和牌堆顶的两张牌，然后你获得其中一种颜色或类别的所有牌且本回合手牌上限+X（X为你获得的牌数），然后其获得剩余的牌。",
			fakeshiren: "识人",
			fakeshiren_info: "①当你受到伤害时，若此武将牌未明置过，则你可以明置此武将牌并防止此伤害。②当你首次明置此武将牌时，你可以发动一次〖宴戏〗。",
			fakecanmou: "参谋",
			fakecanmou_info: "每回合每项限一次，一名角色使用普通锦囊牌指定第一个目标时，若其手牌数为全场唯一最多，则你可以为此牌增加或减少一个目标（目标数至少为1）。",
			fakezhuosheng: "擢升",
			fakezhuosheng_info: "每回合每种牌名限一次，你可以将至少两张手牌当作任意基本牌使用，若你以此法使用的牌中包含具有应变效果的牌，则你令此牌无视条件获得对应的应变效果。",
			fakejuhou: "拒后",
			fakejuhou_info: "阵法技，与你处于同一队列的角色成为【杀】或普通锦囊牌的目标后，你可以令其将任意张牌置于其武将牌上，然后其于此牌结算完毕后获得这些牌。",
			gznaxiang: "纳降",
			gznaxiang_info: "锁定技，当你受到其他角色造成的伤害后，或你对其他角色造成伤害后，你对其发动〖才望〗时的“弃置”改为“获得”直到你的下回合开始。",
			fakecaiwang: "才望",
			fakecaiwang_info: "①你可以助战自己。②每回合每项各限一次，当你响应助战后，若你弃置的牌和被强化的牌：颜色相同，你可以弃置一名其他角色的一张牌；颜色不同，你摸一张牌。",
			fakenaxiang: "纳降",
			fakenaxiang_info: "锁定技。①当你对与你势力不同的角色造成伤害后，或受到与你势力不同的角色对你造成的伤害后。你对其发起军令，若其不执行，则你不能对其发动〖纳降①〗直到你的下个回合开始。②你响应助战弃牌无类别限制，且你触发具有应变的卡牌的条件均视为助战。",
			fakehuyuan: "护援",
			fakehuyuan_info: "①你的回合内，当一张装备牌进入一名角色的装备区后，你可以弃置与其距离为1以内的另一名角色区域里的一张牌。②结束阶段，你可以将一张装备牌置入一名角色的装备区。",
			fakekeshou: "恪守",
			fakekeshou_info: "①当你受到伤害时，你可以弃置两张颜色相同的牌并令此伤害-1。②当你因弃置而一次性失去至少两张牌后，若你的势力已确定且场上没有与你势力相同的其他角色，则你可以进行判定，若结果判定为红色，你摸一张牌。",
			gz_re_xusheng: "界徐盛",
			gz_re_xusheng_prefix: "界",
			gz_ol_sb_sunjia: "OL谋孙坚",
			gz_ol_sb_sunjia_prefix: "OL谋",
			gzguishu: "鬼术",
			gzguishu_info: "出牌阶段，你可以将一张黑桃手牌当作【知己知彼】或【远交近攻】使用（不能与本回合上次以此法使用的牌名相同）。",
			gzyuanyu: "远域",
			gzyuanyu_info: "锁定技，当你受到伤害时，若此伤害不存在来源或你不在伤害来源的攻击范围内，则此伤害-1。",
			gzmoukui: "谋溃",
			gzmoukui_info: "当你使用【杀】指定目标后，你可以选择一项：①摸一张牌；②弃置该角色的一张牌；③背水：若此【杀】未对其造成过伤害，则该角色弃置你的一张牌。",
			gzjinghe_new: "经合",
			gzjinghe_new_info: "出牌阶段限一次，你可以选择一名角色，令其随机获得“写满技能的天书”中的一个技能直到你的下个回合开始。",
			gzdujin: "独进",
			gzdujin_info: "①摸牌阶段，你可以额外摸X+1张牌（X为你装备区的牌数的一半，向下取整）。②当你首次明置此武将牌时，若你为你们势力第一个明置武将牌的角色，则你获得1个“先驱”标记。",
			gzqizhi: "奇制",
			gzqizhi_info: "每回合限四次，当你于回合内使用基本牌或锦囊牌指定首个目标后，你可以弃置不为此牌目标的一名角色的一张牌，然后其摸一张牌。",
			gzjinqu: "进趋",
			gzjinqu_info: "结束阶段，你可以摸两张牌，若如此做，你将手牌弃置至X张。（X为你于此回合发动过〖奇制〗的次数）",
			gzxionghuo: "凶镬",
			gzxionghuo_info: "每局游戏限三次，出牌阶段限一次，你可以选择一名角色，然后你获得以下效果：①当你于每回合首次对其使用牌造成伤害时，你令此伤害+1；②其出牌阶段开始时，你移去此效果，然后随机执行以下一项：⒈对其造成1点火属性伤害，其本回合不能对你使用【杀】。⒉令其失去1点体力，其本回合手牌上限-1。⒊获得其装备区一张牌，然后获得其一张手牌。",
			gzkanji: "勘集",
			gzkanji_info: "出牌阶段限一次，你可以展示所有手牌，若花色均不同，你摸两张牌。然后若你的手牌因此包含了四种花色，你本回合手牌上限+4。",
			gzchenjian: "陈见",
			gzchenjian_info: "准备阶段，你可亮出牌堆顶的三张牌，然后可以选择执行其中一项：⒈弃置一张牌，然后令一名角色获得其中与你弃置牌花色相同的牌。⒉使用其中一张牌。",
			gzxixiu: "皙秀",
			gzxixiu_info: "锁定技。①当你成为其他角色使用牌的目标时，若你的装备区内有和此牌花色相同的牌，则你摸一张牌。②若你装备区内的牌数为1，其他角色弃置此牌时，取消之。",
			gzyaner: "燕尔",
			gzyaner_info: "每回合限一次，其他角色于其出牌阶段内失去最后的手牌后，你可以与其各摸一张牌。",
			gzsidi: "司敌",
			gzsidi_info: "①一名与你势力相同的角色受到伤害后，你可以将一张与武将牌上的“驭”类别均不同的一张牌称为“驭”置于武将牌上。②与你势力不同的角色的回合开始时，你可以移去至多三张“驭”，然后选择执行等量项：⒈选择移去“驭”中的一个类别，令其本回合无法使用此类别的牌。⒉选择其一个已明置武将牌上的一个技能，令此技能于本回合失效。⒊选择一名与你势力相同的已受伤其他角色，令其回复1点体力。",
			gz_ol_lisu: "李肃",
			gzshushen_new: "淑慎",
			gzshushen_new_info: "当你回复1点体力后，你可令一名其他角色摸一张牌（若其没有手牌则改为摸两张牌）。",
			gzyicheng_new: "疑城",
			gzyicheng_new_info: "与你势力相同的角色使用【杀】指定第一个目标后或成为【杀】的目标后，你可以令其摸一张牌，然后其弃置一张牌。",
			gzduoshi: "度势",
			gzduoshi_info: "出牌阶段开始时，你可以视为使用【以逸待劳】。",
			gzhengjiang: "横江",
			gzhengjiang_info: "当你受到伤害后，你可以令当前回合角色本回合的手牌上限-X（X为其装备区牌数且至少为1）。然后其本回合弃牌阶段结束时，若其未于此阶段弃牌，则你将手牌摸至体力上限。",
			gzchengshang: "承赏",
			gzchengshang_info: "每回合限一次，当你使用指定了目标的牌结算完毕后，若你未因此牌造成过伤害，则你可以令其中一名目标角色交给你一张牌，若此牌和你使用的牌的花色和点数均相同，则你失去此技能。",

			guozhan_default: "国战标准",
			guozhan_zhen: "君临天下·阵",
			guozhan_shi: "君临天下·势",
			guozhan_bian: "君临天下·变",
			guozhan_quan: "君临天下·权",
			guozhan_jun: "君主武将",
			guozhan_jin: "文德武备",
			guozhan_single: "君临天下EX",
			guozhan_double: "双势力武将",
			guozhan_yexinjia: "野心家武将",
			guozhan_zongheng: "纵横捭阖",
			guozhan_tw: "海外服专属",
			guozhan_mobile: "移动版",
			guozhan_qunxiong: "群雄割据",
			guozhan_decade: "十年踪迹十年心",
			guozhan_others: "国战限定",

			// 台词部分
			"#gz_jiangqing:die": "竟……破我阵法……",
			"#gz_zhonghui:die": "吾机关算尽，却还是棋错一着……",
			"#gzzhaoxin1": "行明动正，何惧他人讥毁。",
			"#gzzhaoxin2": "大业之举，岂因宵小而动？",
			"#gzsuzhi1": "敌军势大与否，无碍我自计定施。",
			"#gzsuzhi2": "汝竭力强攻，也只是徒燥军心。",
			"#gzfankui1": "胆敢诽谤惑众，这就是下场！",
			"#gzfankui2": "今天，就拿你来杀鸡儆猴。",
			"#gz_simazhao:die": "千里之功，只差一步了……",
			"#gzhuaiyi1": "曹魏可王，吾亦可王！",
			"#gzhuaiyi2": "这天下，本就是我囊中之物。",
			"#gzzisui1": "仲达公，敢问这辽隧之战，谁胜谁负啊，哈哈哈哈……",
			"#gzzisui2": "凡从我大燕者，授印封爵，全族俱荣！",
			"#gz_gongsunyuan:die": "流星骤损，三军皆溃，看来大势去矣……",
			"#gz_sunchen:die": "愿陛下念臣昔日之功，陛下？陛下！！",
			"#gzxingzhao1": "让我先探他一探。",
			"#gzxingzhao2": "船，也不是一天就能造出来的。",
			"#gzxingzhao_xunxun1": "拿些上好的木料来。",
			"#gzxingzhao_xunxun2": "精挑细选，方能成百年之计。",
			"#gz_tangzi:die": "偷工减料，要不得啊……",
			"#gz_mengda:die": "吾一生寡信，今报应果然来矣……",
			"#gzwenji1": "这，可如何是好？",
			"#gzwenji2": "望先生不吝赐教。",
			"#gztunjiang1": "大恩难报，军粮以资。",
			"#gztunjiang2": "虽有不舍，也只能离家远行了。",
			"#gz_liuqi:die": "身侧之人，歹毒更甚于敌！",
			"#mffengshi1": "雪中送炭？倒不如落井下石！",
			"#mffengshi2": "今发兵援羽，敢问是过是功？",
			"#gz_mifangfushiren:die": "虞翻小儿，你安敢辱我！",
			"#gzbiluan1": "审势夺度，以稳求进。",
			"#gzbiluan2": "进退利弊，自当细细思量。",
			"#gzlixia1": "先生大才，岂可居于人下。",
			"#gzlixia2": "先生贤才，老夫着实佩服。",
			"#gz_shixie:die": "天命之时……已到……",
			"#gzbushi1": "争斗，永远没有赢家。",
			"#gzbushi2": "和平，永远没有输家。",
			"#gzmidao1": "恩结天地，法惠八荒。",
			"#gzmidao2": "行五斗米道，可知暖饱。",
			"#gz_zhanglu:die": "唉，义不敌武，道难御兵……",
			"#quanjin1": "今称魏公，则可以藩卫之名，征吴伐蜀也。",
			"#quanjin2": "明公受封，正合天心人意！",
			"#zaoyun1": "开渠输粮，振军之心，破敌之胆！",
			"#zaoyun2": "兵精粮足，胜局已定！",
			"#gz_dongzhao:die": "一生无愧，又何惧身后之议……",
			"#zhuhai_gz_re_xushu1": "今日当要替天行道。",
			"#zhuhai_gz_re_xushu2": "我容得你，天不容你！",
			"#gzjiancai1": "得此贤士，如鱼得水。",
			"#gzjiancai2": "将军，在下可举荐一人。",
			"#gz_re_xushu:die": "未尽孝道，抱憾此生……",
			"#donggui1": "闻伯符立业，今特来相助。",
			"#donggui2": "臣虽驽钝，愿以此腔热血报国。",
			"#fengyang1": "谁也休想染指江东寸土！",
			"#fengyang2": "如此咽喉要地，吾当亲力守之。",
			"#gz_wujing:die": "憾未能见，我江东一统天下之时……",
			"#gzzhidao1": "一朝得势，自当尽诸其力！",
			"#gzzhidao2": "本王要的，没有得不到的！",
			"#gzyjili1": "处处受制于人，难施拳脚。",
			"#gzyjili2": "寄居人下，终是气短。",
			"#gz_yanbaihu:die": "江东，有我一半……",
			"#gzchenglve1": "如此大胜，皆由我一人谋划。",
			"#gzchenglve2": "画谋定计，谁堪与我比较。",
			"#gzshicai1": "阿瞒，苦思之事，我早有良策。",
			"#gzshicai2": "策略已有，按部就班即可得胜。",
			"#gz_xuyou:die": "阿瞒，你竟忘恩负义！！",
			"#gzbaolie1": "废话少说，受死吧，喝！",
			"#gzbaolie2": "当今曹营之将，一个能打的都没有！",
			"#gz_xiahouba:die": "不好，有埋伏！呃！",
			"#gzcongcha1": "窥一斑而知全豹。",
			"#gzcongcha2": "问一事则明其心。",
			"#xinfu_gongqing_gz_panjun1": "水至清则无鱼，人至察则可无过。",
			"#xinfu_gongqing_gz_panjun2": "若人人怀公忘私，则天下早定矣。",
			"#gz_panjun:die": "密谋既泄，难处奸贼啊……",
			"#gzxishe1": "伏箭灭破虏，坚城拒讨逆。",
			"#gzxishe2": "什么江东猛虎？还不是我箭下之鬼！",
			"#gz_huangzu:die": "今日不过是成王败寇，哼！动手吧！",
			"#aocai_gz_zhugeke1": "诸位可知，自古英雄出少年！",
			"#aocai_gz_zhugeke2": "恪乞笔再添二字，还请陛下一观。",
			"#gzduwu1": "此战罪在当代，然功在千秋。",
			"#gzduwu2": "昔秦灭六国之事，足表养敌之患！",
			"#gz_zhugeke:die": "祸及三族，愧对父亲……",
			"#gz_wenqin:die": "公休，汝这是何意，呃……",
			"#gzlianpian1": "公之大才，当于行伍建功，安能空老林泉？",
			"#gzlianpian2": "你我旧识，此险，望兄搭救之！",
			"#gz_xf_sufei:die": "身陷庸主而不自知，今日终陷囹圄……",
			"#gztongduo1": "统荆益二州诸物之价，以为民生国祚之大计。",
			"#gztongduo2": "铸直百之钱，可平物价，定军民之心。",
			"#qingyin1": "功成身退，再不问世间诸事。",
			"#qingyin2": "天下既定，我亦当遁迹匿踪，颐养天年矣。",
			"#gz_liuba:die": "家国将逢巨变，奈何此身先陨……",
			"#daming1": "孝直溢美之言，特以此小利报之，还望笑纳。",
			"#daming2": "孟起，莫非甘心为他人座下之客。",
			"#xiaoni1": "如此荒辈之徒为主，成何用也。",
			"#xiaoni2": "公既如此，恕在下诚难留之。",
			"#gz_pengyang:die": "人言我心大志寡，难可保安，果然如此，唉……",
			"#gzjuejue1": "舍小家而取大胜，何惜之有？！",
			"#gzjuejue2": "今家小虽陷敌手，安敢以私废公！",
			"#gzfangyuan1": "布阵合围，滴水不漏，待敌自溃。",
			"#gzfangyuan2": "乘敌阵未稳，待我斩将刈旗，先奋士气！",
			"#gz_zhuling:die": "半生曹家麾下将，终是，丞相眼中，倒戈臣……",
			"#qianhuan1": "幻变迷踪，虽飞鸟亦难觅踪迹。",
			"#qianhuan2": "幻化于阴阳，藏匿于乾坤。",
			"#gz_yuji:die": "幻化之物，终是算不得真呐……",
			"#liuli1": "交给你了~",
			"#liuli2": "你来嘛~",
			"#duoshi1": "国之大计，审势为先。",
			"#duoshi2": "依今日之大势，当行此计。",
			"#gz_luxun:die": "还以为我已经不再年轻……",
			"#guzheng2": "固国安邦，居当如是！",
			"#lijian1": "嗯呵呵~~呵呵~~",
			"#biyue1": "失礼了~",
			"#biyue2": "羡慕吧~",
			"#jianchu1": "休想全身而退！",
			"#jianchu2": "杀到你丢盔弃甲！",
			"#gz_mateng:die": "儿子，为爹报仇啊！",
			"#shuangren1": "吃我一记三尖两刃刀！",
			"#huoshui1": "别走了，再玩一会儿嘛。",
			"#huoshui2": "走不动了嘛？",
			"#qingcheng1": "我和你们真是投缘啊。",
			"#qingcheng2": "哼，眼睛都直了呀。",
			"#tuntian_gz_dengai1": "积谷于此，以制四方。",
			"#tuntian_gz_dengai2": "留得良田在，何愁不破敌？",
			"#ziliang1": "吃饱了，才有力气为国效力。",
			"#ziliang2": "兵，断不可无粮啊。",
			"#jixi_gz_dengai1": "哪里走！！",
			"#jixi_gz_dengai2": "谁占到先机，谁就胜了。",
			"#gz_dengai:die": "君不知臣，臣不知君，罢了……罢了……",
			"#gz_jiangwei:die": "臣等正欲死战，陛下何故先降！",
			"#tiaoxin_gz_jiangwei1": "小小娃娃，乳臭未干。",
			"#tiaoxin_gz_jiangwei2": "快滚回去，叫你主将出来！",
			"#yizhi1": "天文地理，丞相所教，维铭记于心。",
			"#yizhi2": "哪怕只有一线生机，我也不会放弃！",
			"#tianfu1": "丞相已教我识得此计！",
			"#tianfu2": "哼，有破绽！",
			"#yicheng1": "不怕死，就尽管放马过来！",
			"#yicheng2": "待末将布下疑城，以退曹贼。",
			"#gz_xusheng:die": "可怜一身胆略，尽随一抔黄土……",
			"#yingyang1": "此战，我必取胜！",
			"#yingyang2": "相斗之趣，吾常胜之。",
			"#yinghun_sunce1": "父亲，助我背水一战！",
			"#yinghun_sunce2": "孙氏英烈，庇佑江东！",
			"#baoling1": "待吾大开杀戒，哈哈哈哈！",
			"#baoling2": "大丈夫，岂能妇人之仁？",
			"#zhangwu1": "遁剑归一，有凤来仪。",
			"#zhangwu2": "剑气化龙，听朕雷动！",
			"#jizhao1": "仇未报，汉未兴，朕志犹在！",
			"#jizhao2": "王业不偏安，起师再兴汉！",
			"#rerende_gz_jun_liubei1": "勿以恶小而为之，勿以善小而不为。",
			"#rerende_gz_jun_liubei2": "君才十倍于丕，必能安国成事。",
			"#shouyue": "布德而昭仁，见旗如见朕！",
			"#shouyue_wusheng1": "关将军雄姿，由你再现！",
			"#shouyue_wusheng2": "再次威震华雄，必成汉兴佳话！",
			"#shouyue_paoxiao1": "杀！把他捅成马蜂窝！",
			"#shouyue_paoxiao2": "昔日长坂坡，今日再咆哮！",
			"#shouyue_longdan1": "请收好，此乃子龙枪法。",
			"#shouyue_longdan2": "子龙将助你一臂之力。",
			"#shouyue_tieji1": "西凉的马蹄声，真好听。",
			"#shouyue_tieji2": "马家军风采何在？！",
			"#shouyue_liegong1": "当年老将军冲锋，也是这时机。",
			"#shouyue_liegong2": "百步穿杨，立功拜将！",
			"#gz_jun_liubei:die": "若嗣子可辅，辅之；如其不才，君可自取……",
			"#wuxin1": "冀悟迷惑之心。",
			"#wuxin2": "吾已明此救世之术矣。",
			"#hongfa1": "苍天已死，黄天当立！",
			"#hongfa2": "汝等安心，吾乃大贤良师也。",
			"#hongfa3": "此法可助汝等脱离苦海。",
			"#huangjintianbingfu1": "此乃天将天兵，尔等妖孽看着！",
			"#huangjintianbingfu2": "且作一法，召唤神力！",
			"#huangjintianbingfu3": "吾有天神护体！",
			"#wendao1": "诚心求天地之道，救世之法。",
			"#wendao2": "求太平之法以安天下。",
			"#gz_jun_zhangjiao:die": "天，真要灭我……",
			"#jiahe": "嘉禾生，大吴兴！",
			"#yuanjiangfenghuotu1": "保卫国家，人人有责！",
			"#yuanjiangfenghuotu2": "连绵的烽火，就是对敌人最好的震慑！",
			"#yuanjiangfenghuotu3": "有敌来犯，速速御敌！",
			"#yuanjiangfenghuotu4": "来，扶孤上马迎敌！",
			"#jiahe_reyingzi1": "大吴江山，儒将辈出。",
			"#jiahe_reyingzi2": "千夫奉儒将，百兽伏麒麟。",
			"#jiahe_haoshi1": "朋友有难，当倾囊相助。",
			"#jiahe_haoshi2": "好东西，就要跟朋友分享。",
			"#jiahe_shelie1": "军中多务，亦当涉猎。",
			"#jiahe_shelie2": "少说话，多看书。",
			"#jiahe_duoshi1": "广施方略，以观其变。",
			"#jiahe_duoshi2": "莫慌，观察好局势再做行动。",
			"#lianzi1": "税以足食，赋以足兵。",
			"#lianzi2": "府库充盈，国家方能强盛！",
			"#zhiheng_gz_jun_sunquan1": "二宫并阙，孤之所愿。",
			"#zhiheng_gz_jun_sunquan2": "鲁王才兼文武，堪比太子。",
			"#jubao1": "四海之宝，孤之所爱。",
			"#jubao2": "夷洲，扶南，辽东，皆大吴臣邦也！",
			"#gz_jun_sunquan:die": "朕的江山，要倒下了么……",
			"#yigui1": "百鬼众魅，自缚见形。",
			"#yigui2": "来去无踪，众谓诡异。",
			"#jihun1": "魂聚则生，魂散则弃。",
			"#jihun2": "魂羽化游，以辅四方。",
			"#xuanlve1": "强兵破阵，斩将于须臾。",
			"#xuanlve2": "轻装急袭，破敌于千里。",
			"#yongjin1": "冲啊，扬我东吴之勇！",
			"#yongjin2": "东吴虎威，岂是尔等可犯！",
			"#gzkuangcai1": "耳所瞥闻，不忘于心。",
			"#gzkuangcai2": "吾焉能从屠沽儿耶？",
			"#gzshejian1": "伤人的，可不止刀剑！",
			"#gzshejian2": "死公！云等道？",
			"#gzjianliang1": "岂曰少衣食，与君共袍泽！",
			"#gzjianliang2": "义士同心力，粮秣应期来！",
			"#gzweimeng1": "此礼献于友邦，共赴兴汉大业！",
			"#gzweimeng2": "吴有三江之守，何故委身侍魏？",
			"#gz_dengzhi:die": "伯约啊，我帮不了你了……",
			"#gzduannian1": "断思量，莫思量。",
			"#gzduannian2": "一别两宽，不负相思。",
			"#gzlianyou1": "莲花佑兴，业火可兴。",
			"#gzlianyou2": "昔日莲花开，今日红火燃。",
			"#jianglue1": "奇谋为短，将略为要。",
			"#jianglue2": "为将者，需有谋略。",
			"#fz_wusheng": "武节不减，圣德加身。",
			"#fz_new_paoxiao": "刚勇奋战，绝不退缩！",
			"#fz_new_longdan": "盘龙卧旋，攻防无解。",
			"#fz_new_tieji": "战骑铁甲，撼动踏阵。",
			"#fz_liegong": "挽弓箭出，流火漫天。",
			"#fz_xinkuanggu": "猎战沙场，我的乐趣。",
			"#keshou1": "仁以待民，自处不败之势。",
			"#keshou2": "宽济百姓，则得战前养备之机。",
			"#gz_lukang:die": "抗仅以君子之交待叔子，未有半分背国之念啊！",
			"#gzfudi1": "弃暗投明，为明公计！",
			"#gzfudi2": "绣虽有降心，奈何贵营难容。",
			"#drlt_congjian1": "听君谏言，去危亡，保宗祀！",
			"#jianan": "设使天下无孤，不知几人称帝，几人称王？",
			"#wuziliangjiangdao1": "行为军锋，还为后拒！",
			"#wuziliangjiangdao2": "国之良将，五子为先。",
			"#jianan_tuxi": "以百破万，让孤再看一次！",
			"#jianan_qiaobian": "孤之兵道，此一时，彼一时。",
			"#jianan_xiaoguo": "使孤梦回辽东者，卿之雄风也！",
			"#jianan_jieyue": "孤之股肱，谁敢不从？嗯？",
			"#jianan_duanliang": "孤以为断粮如断肠，卿意下如何？",
			"#huibian1": "吾任天下之智力，以道御之，无所不可。",
			"#huibian2": "青青子衿，悠悠我心。但为君故，沉吟至今。",
			"#gzzongyu1": "驾六龙，乘风而行。行四海，路下之八邦。",
			"#gzzongyu2": "齐桓之功，为霸之首。九合诸侯，一匡天下！", //配音错误？，应为：齐桓之功，为霸之道
			"#gz_jun_caocao:die": "神龟虽寿，犹有竟时。腾蛇乘雾，终为土灰……",
			"#sanchen1": "陈书弼国，当一而再、再而三。",
			"#mingzhe2": "塞翁失马，焉知非福？",
			"#twzhenxi2": "震疆扫寇，袭贼平戎！",
			"#mobiledanshou1": "此诚危难，我定当竭尽全力！",
			"#weishu2": "吴人来犯，当用心戒备。",
		},
		junList: ["liubei", "zhangjiao", "sunquan", "caocao"],
		guozhanPile_yingbian: [
			//黑桃普通
			["spade", 1, "shandian"],
			["spade", 1, "xietianzi"],
			["spade", 1, "juedou"],
			["spade", 2, "bagua"],
			["spade", 2, "heiguangkai"],
			["spade", 2, "cixiong"],
			["spade", 2, "taigongyinfu"],
			["spade", 3, "zhujinqiyuan", null, ["yingbian_zhuzhan", "yingbian_add"]],
			["spade", 3, "huoshaolianying"],
			["spade", 3, "shuiyanqijunx", null, ["yingbian_zhuzhan", "yingbian_add"]],
			["spade", 4, "guohe"],
			["spade", 4, "sha"],
			["spade", 4, "shuiyanqijunx", null, ["yingbian_zhuzhan", "yingbian_add"]],
			["spade", 5, "jueying"],
			["spade", 5, "qinglong"],
			["spade", 5, "sha"],
			["spade", 6, "qinggang"],
			["spade", 6, "jiu"],
			["spade", 6, "sha", "ice"],
			["spade", 7, "sha"],
			["spade", 7, "sha"],
			["spade", 7, "sha", "ice"],
			["spade", 8, "sha", "ice"],
			["spade", 8, "sha", "ice"],
			["spade", 8, "sha"],
			["spade", 9, "jiu"],
			["spade", 9, "sha", "thunder"],
			["spade", 9, "sha"],
			["spade", 10, "bingliang"],
			["spade", 10, "sha", "thunder"],
			["spade", 10, "sha", null, ["yingbian_canqu", "yingbian_add"]],
			["spade", 11, "wuxie", null, ["yingbian_kongchao", "yingbian_draw"]],
			["spade", 11, "sha", null, ["yingbian_canqu", "yingbian_add"]],
			["spade", 11, "sha", "thunder"],
			["spade", 12, "zhangba"],
			["spade", 12, "lulitongxin"],
			["spade", 12, "tiesuo"],
			["spade", 13, "wutiesuolian"],
			["spade", 13, "wuxie"],
			["spade", 13, "nanman", null, ["yingbian_fujia", "yingbian_remove"]],
			//草花普通
			["club", 1, "juedou"],
			["club", 1, "yuxi"],
			["club", 1, "huxinjing"],
			["club", 2, "sha"],
			["club", 2, "tianjitu"],
			["club", 2, "renwang"],
			["club", 2, "tengjia"],
			["club", 3, "sha"],
			["club", 3, "chiling"],
			["club", 3, "zhibi"],
			["club", 4, "sha", null, ["yingbian_kongchao", "yingbian_add"]],
			["club", 4, "sha", "thunder"],
			["club", 4, "zhibi"],
			["club", 5, "sha", null, ["yingbian_kongchao", "yingbian_add"]],
			["club", 5, "sha", "thunder"],
			["club", 5, "tongque"],
			["club", 6, "sha", "thunder"],
			["club", 6, "sha", null, ["yingbian_kongchao", "yingbian_add"]],
			["club", 6, "lebu"],
			["club", 7, "sha", "thunder"],
			["club", 7, "sha"],
			["club", 7, "nanman", null, ["yingbian_fujia", "yingbian_remove"]],
			["club", 8, "sha", "thunder"],
			["club", 8, "sha", null, ["yingbian_canqu", "yingbian_add"]],
			["club", 8, "sha"],
			["club", 9, "sha"],
			["club", 9, "jiu"],
			["club", 9, "jiu"],
			["club", 10, "bingliang"],
			["club", 10, "lulitongxin"],
			["club", 10, "sha"],
			["club", 11, "sha"],
			["club", 11, "huoshaolianying"],
			["club", 11, "sha"],
			["club", 12, "zhujinqiyuan", null, ["yingbian_zhuzhan", "yingbian_add"]],
			["club", 12, "jiedao", null, ["yingbian_fujia", "yingbian_hit"]],
			["club", 12, "tiesuo"],
			["club", 13, "tiesuo"],
			["club", 13, "wuxie", null, ["guo"]],
			["club", 13, "wuxie", null, ["guo"]],
			//红桃普通
			["heart", 1, "wanjian"],
			["heart", 1, "taoyuan"],
			["heart", 1, "lianjunshengyan"],
			["heart", 2, "shan"],
			["heart", 2, "chuqibuyi", null, ["yingbian_zhuzhan", "yingbian_add"]],
			["heart", 2, "diaohulishan"],
			["heart", 3, "chuqibuyi", null, ["yingbian_zhuzhan", "yingbian_add"]],
			["heart", 3, "wugu"],
			["heart", 3, "jingfanma"],
			["heart", 4, "tao"],
			["heart", 4, "sha", "fire", ["yingbian_canqu", "yingbian_damage"]],
			["heart", 4, "shan"],
			["heart", 5, "qilin"],
			["heart", 5, "chitu"],
			["heart", 5, "shan", null, ["yingbian_kongchao", "yingbian_draw"]],
			["heart", 6, "lebu"],
			["heart", 6, "tao"],
			["heart", 6, "shan", null, ["yingbian_kongchao", "yingbian_draw"]],
			["heart", 7, "tao"],
			["heart", 7, "dongzhuxianji"],
			["heart", 7, "shan"],
			["heart", 8, "tao"],
			["heart", 8, "dongzhuxianji"],
			["heart", 8, "tao"],
			["heart", 9, "tao"],
			["heart", 9, "yuanjiao"],
			["heart", 9, "tao"],
			["heart", 10, "sha"],
			["heart", 10, "shan"],
			["heart", 10, "sha"],
			["heart", 11, "yiyi"],
			["heart", 11, "tao"],
			["heart", 11, "sha", null, ["yingbian_zhuzhan", "yingbian_add"]],
			["heart", 12, "tao"],
			["heart", 12, "sha"],
			["heart", 12, "huoshaolianying"],
			["heart", 13, "zhuahuang"],
			["heart", 13, "shan"],
			["heart", 13, "huogong", null, ["yingbian_zhuzhan", "yingbian_add"]],
			//方片普通
			["diamond", 1, "wuxinghelingshan"],
			["diamond", 1, "zhuge"],
			["diamond", 1, "xietianzi"],
			["diamond", 2, "shan"],
			["diamond", 2, "tao"],
			["diamond", 2, "tao"],
			["diamond", 3, "shunshou"],
			["diamond", 3, "shan"],
			["diamond", 3, "tao"],
			["diamond", 4, "yiyi"],
			["diamond", 4, "sha", "fire", ["yingbian_canqu", "yingbian_damage"]],
			["diamond", 4, "sha", "fire", ["yingbian_zhuzhan", "yingbian_add"]],
			["diamond", 5, "guanshi"],
			["diamond", 5, "sha", "fire"],
			["diamond", 5, "muniu"],
			["diamond", 6, "wuliu"],
			["diamond", 6, "shan"],
			["diamond", 6, "shan"],
			["diamond", 7, "shan", null, ["yingbian_kongchao", "yingbian_draw"]],
			["diamond", 7, "shan", null, ["yingbian_kongchao", "yingbian_draw"]],
			["diamond", 7, "shan"],
			["diamond", 8, "shan", null, ["yingbian_kongchao", "yingbian_draw"]],
			["diamond", 8, "shan", null, ["yingbian_kongchao", "yingbian_draw"]],
			["diamond", 8, "sha", "fire"],
			["diamond", 9, "jiu"],
			["diamond", 9, "shan"],
			["diamond", 9, "sha", "fire"],
			["diamond", 10, "shan"],
			["diamond", 10, "sha"],
			["diamond", 10, "diaohulishan"],
			["diamond", 11, "sha"],
			["diamond", 11, "shan"],
			["diamond", 11, "wuxie", null, ["guo"]],
			["diamond", 12, "sha"],
			["diamond", 12, "sanjian"],
			["diamond", 12, "wuxie", null, ["guo"]],
			["diamond", 12, "fangtian"],
			["diamond", 13, "zixin"],
			["diamond", 13, "shan"],
			["diamond", 13, "shan"],
			//特殊
			["heart", 3, "taipingyaoshu"],
			["diamond", 4, "dinglanyemingzhu"],
			["heart", 5, "liulongcanjia"],
			["spade", 6, "feilongduofeng"],
			["club", 12, "gz_wenheluanwu"],
			["heart", 1, "gz_guguoanbang"],
			["spade", 12, "gz_haolingtianxia"],
			["diamond", 1, "gz_kefuzhongyuan"],
		],
		guozhanPile_old: [
			["spade", 1, "juedou"],
			["spade", 1, "shandian"],
			["spade", 2, "cixiong"],
			["spade", 2, "bagua"],
			["spade", 2, "hanbing"],
			["spade", 3, "guohe"],
			["spade", 3, "shunshou"],
			["spade", 4, "guohe"],
			["spade", 4, "shunshou"],
			["spade", 5, "sha"],
			["spade", 5, "jueying"],
			["spade", 6, "qinggang"],
			["spade", 6, "sha", "thunder"],
			["spade", 7, "sha"],
			["spade", 7, "sha", "thunder"],
			["spade", 8, "sha"],
			["spade", 8, "sha"],
			["spade", 9, "sha"],
			["spade", 9, "jiu"],
			["spade", 10, "sha"],
			["spade", 10, "bingliang"],
			["spade", 11, "sha"],
			["spade", 11, "wuxie"],
			["spade", 12, "zhangba"],
			["spade", 12, "tiesuo"],
			["spade", 13, "nanman"],
			["spade", 13, "dawan"],

			["club", 1, "juedou"],
			["club", 1, "baiyin"],
			["club", 2, "sha"],
			["club", 2, "tengjia"],
			["club", 2, "renwang"],
			["club", 3, "sha"],
			["club", 3, "zhibi"],
			["club", 4, "sha"],
			["club", 4, "zhibi"],
			["club", 5, "sha"],
			["club", 5, "dilu"],
			["club", 6, "lebu"],
			["club", 6, "sha", "thunder"],
			["club", 7, "nanman"],
			["club", 7, "sha", "thunder"],
			["club", 8, "sha"],
			["club", 8, "sha", "thunder"],
			["club", 9, "sha"],
			["club", 9, "jiu"],
			["club", 10, "sha"],
			["club", 10, "bingliang"],
			["club", 11, "sha"],
			["club", 11, "sha"],
			["club", 12, "jiedao"],
			["club", 12, "tiesuo"],
			["club", 13, "wuxie", null, ["guo"]],
			["club", 13, "tiesuo"],

			["diamond", 1, "zhuge"],
			["diamond", 1, "zhuque"],
			["diamond", 2, "shan"],
			["diamond", 2, "tao"],
			["diamond", 3, "shan"],
			["diamond", 3, "shunshou"],
			["diamond", 4, "yiyi"],
			["diamond", 4, "sha", "fire"],
			["diamond", 5, "guanshi"],
			["diamond", 5, "sha", "fire"],
			["diamond", 6, "shan"],
			["diamond", 6, "wuliu"],
			["diamond", 7, "shan"],
			["diamond", 7, "shan"],
			["diamond", 8, "shan"],
			["diamond", 8, "shan"],
			["diamond", 9, "shan"],
			["diamond", 9, "jiu"],
			["diamond", 10, "shan"],
			["diamond", 10, "sha"],
			["diamond", 11, "shan"],
			["diamond", 11, "sha"],
			["diamond", 12, "sha"],
			["diamond", 12, "sanjian"],
			["diamond", 12, "wuxie", null, ["guo"]],
			["diamond", 13, "shan"],
			["diamond", 13, "zixin"],

			["heart", 1, "taoyuan"],
			["heart", 1, "wanjian"],
			["heart", 2, "shan"],
			["heart", 2, "huogong"],
			["heart", 3, "wugu"],
			["heart", 3, "huogong"],
			["heart", 4, "tao"],
			["heart", 4, "sha", "fire"],
			["heart", 5, "qilin"],
			["heart", 5, "chitu"],
			["heart", 6, "tao"],
			["heart", 6, "lebu"],
			["heart", 7, "tao"],
			["heart", 7, "wuzhong"],
			["heart", 8, "tao"],
			["heart", 8, "wuzhong"],
			["heart", 9, "tao"],
			["heart", 9, "yuanjiao"],
			["heart", 10, "tao"],
			["heart", 10, "sha"],
			["heart", 11, "shan"],
			["heart", 11, "yiyi"],
			["heart", 12, "tao"],
			["heart", 12, "sha"],
			["heart", 12, "guohe"],
			["heart", 13, "shan"],
			["heart", 13, "zhuahuang"],
		],
		guozhanPile: [
			["spade", 1, "juedou"],
			["spade", 1, "shandian"],
			["spade", 2, "feilongduofeng"],
			["spade", 2, "bagua"],
			["spade", 2, "hanbing"],
			["spade", 3, "guohe"],
			["spade", 3, "shunshou"],
			["spade", 4, "guohe"],
			["spade", 4, "shunshou"],
			["spade", 5, "sha"],
			["spade", 5, "jueying"],
			["spade", 6, "qinggang"],
			["spade", 6, "sha", "thunder"],
			["spade", 7, "sha"],
			["spade", 7, "sha", "thunder"],
			["spade", 8, "sha"],
			["spade", 8, "sha"],
			["spade", 9, "sha"],
			["spade", 9, "jiu"],
			["spade", 10, "sha"],
			["spade", 10, "bingliang"],
			["spade", 11, "sha"],
			["spade", 11, "wuxie"],
			["spade", 12, "zhangba"],
			["spade", 12, "tiesuo"],
			["spade", 13, "nanman"],
			["spade", 13, "dawan"],

			["club", 1, "juedou"],
			["club", 1, "baiyin"],
			["club", 2, "sha"],
			["club", 2, "tengjia"],
			["club", 2, "renwang"],
			["club", 3, "sha"],
			["club", 3, "zhibi"],
			["club", 4, "sha"],
			["club", 4, "zhibi"],
			["club", 5, "sha"],
			["club", 5, "dilu"],
			["club", 6, "lebu"],
			["club", 6, "sha", "thunder"],
			["club", 7, "nanman"],
			["club", 7, "sha", "thunder"],
			["club", 8, "sha"],
			["club", 8, "sha", "thunder"],
			["club", 9, "sha"],
			["club", 9, "jiu"],
			["club", 10, "sha"],
			["club", 10, "bingliang"],
			["club", 11, "sha"],
			["club", 11, "sha"],
			["club", 12, "jiedao"],
			["club", 12, "tiesuo"],
			["club", 13, "wuxie", null, ["guo"]],
			["club", 13, "tiesuo"],

			["diamond", 1, "zhuge"],
			["diamond", 1, "zhuque"],
			["diamond", 2, "shan"],
			["diamond", 2, "tao"],
			["diamond", 3, "shan"],
			["diamond", 3, "shunshou"],
			["diamond", 4, "yiyi"],
			["diamond", 4, "sha", "fire"],
			["diamond", 5, "guanshi"],
			["diamond", 5, "sha", "fire"],
			["diamond", 6, "shan"],
			["diamond", 6, "wuliu"],
			["diamond", 7, "shan"],
			["diamond", 7, "shan"],
			["diamond", 8, "shan"],
			["diamond", 8, "shan"],
			["diamond", 9, "shan"],
			["diamond", 9, "jiu"],
			["diamond", 10, "shan"],
			["diamond", 10, "sha"],
			["diamond", 11, "shan"],
			["diamond", 11, "sha"],
			["diamond", 12, "sha"],
			["diamond", 12, "sanjian"],
			["diamond", 12, "wuxie", null, ["guo"]],
			["diamond", 13, "shan"],
			["diamond", 13, "zixin"],

			["heart", 1, "taoyuan"],
			["heart", 1, "wanjian"],
			["heart", 2, "shan"],
			["heart", 2, "huogong"],
			["heart", 3, "wugu"],
			["heart", 3, "taipingyaoshu"],
			["heart", 3, "huogong"],
			["heart", 4, "tao"],
			["heart", 4, "sha", "fire"],
			["heart", 5, "qilin"],
			["heart", 5, "chitu"],
			["heart", 6, "tao"],
			["heart", 6, "lebu"],
			["heart", 7, "tao"],
			["heart", 7, "wuzhong"],
			["heart", 8, "tao"],
			["heart", 8, "wuzhong"],
			["heart", 9, "tao"],
			["heart", 9, "yuanjiao"],
			["heart", 10, "tao"],
			["heart", 10, "sha"],
			["heart", 11, "shan"],
			["heart", 11, "yiyi"],
			["heart", 12, "tao"],
			["heart", 12, "sha"],
			["heart", 12, "guohe"],
			["heart", 13, "shan"],
			["heart", 13, "zhuahuang"],

			["spade", 1, "xietianzi", null, ["lianheng"]],
			["spade", 2, "minguangkai"],
			["spade", 3, "huoshaolianying", null, ["lianheng"]],
			["spade", 4, "sha"],
			["spade", 5, "qinglong"],
			["spade", 6, "jiu", null, ["lianheng"]],
			["spade", 7, "sha"],
			["spade", 8, "sha"],
			["spade", 9, "sha", "thunder"],
			["spade", 10, "sha", "thunder"],
			["spade", 11, "sha", "thunder", ["lianheng"]],
			["spade", 12, "lulitongxin"],
			["spade", 13, "wuxie"],

			["heart", 1, "lianjunshengyan"],
			["heart", 2, "diaohulishan"],
			["heart", 3, "jingfanma", null, ["lianheng"]],
			["heart", 4, "shan"],
			["heart", 5, "shan"],
			["heart", 6, "shan", null, ["lianheng"]],
			["heart", 7, "shan"],
			["heart", 8, "tao"],
			["heart", 9, "tao"],
			["heart", 10, "sha"],
			["heart", 11, "sha"],
			["heart", 12, "huoshaolianying", null, ["lianheng"]],
			["heart", 13, "shuiyanqijunx"],

			["club", 1, "yuxi"],
			["club", 2, "huxinjing", null, ["lianheng"]],
			["club", 3, "chiling"],
			["club", 4, "sha"],
			["club", 5, "sha", "thunder", ["lianheng"]],
			["club", 6, "sha"],
			["club", 7, "sha"],
			["club", 8, "sha"],
			["club", 9, "jiu"],
			["club", 10, "lulitongxin"],
			["club", 11, "huoshaolianying", null, ["lianheng"]],
			["club", 12, "shuiyanqijunx"],
			["club", 13, "wuxie", null, ["guo"]],

			["diamond", 1, "xietianzi", null, ["lianheng"]],
			["diamond", 2, "tao"],
			["diamond", 3, "tao", null, ["lianheng"]],
			["diamond", 4, "xietianzi", null, ["lianheng"]],
			["diamond", 5, "muniu"],
			["diamond", 6, "shan"],
			["diamond", 7, "shan"],
			["diamond", 8, "sha", "fire"],
			["diamond", 9, "sha", "fire"],
			["diamond", 10, "diaohulishan", null, ["lianheng"]],
			["diamond", 11, "wuxie", null, ["guo"]],
			["diamond", 12, "fangtian"],
			["diamond", 13, "shan"],

			["diamond", 6, "dinglanyemingzhu"],
			["heart", 13, "liulongcanjia"],

			//['spade',12,'gz_haolingtianxia'],
			//['diamond',1,'gz_kefuzhongyuan'],
			//['heart',1,'gz_guguoanbang'],
			//['club',12,'gz_wenheluanwu'],
		],
		element: {
			content: {
				hideCharacter() {
					game.addVideo("hideCharacter", player, num);
					var skills,
						log = event.log;
					switch (num) {
						case 0:
							if (log !== false) game.log(player, "暗置了主将" + get.translation(player.name1));
							skills = lib.character[player.name1][3];
							player.name = player.name2;
							player.sex = lib.character[player.name2][0];
							player.classList.add("unseen");
							break;
						case 1:
							if (log !== false) game.log(player, "暗置了副将" + get.translation(player.name2));
							skills = lib.character[player.name2][3];
							player.classList.add("unseen2");
							break;
					}
					game.broadcast(
						function (player, name, sex, num, skills) {
							player.name = name;
							player.sex = sex;
							switch (num) {
								case 0:
									player.classList.add("unseen");
									break;
								case 1:
									player.classList.add("unseen2");
									break;
							}
							for (var i = 0; i < skills.length; i++) {
								if (!player.skills.includes(skills[i])) continue;
								player.hiddenSkills.add(skills[i]);
								player.skills.remove(skills[i]);
							}
						},
						player,
						player.name,
						player.sex,
						num,
						skills
					);
					for (var i = 0; i < skills.length; i++) {
						if (!player.skills.includes(skills[i])) continue;
						player.hiddenSkills.add(skills[i]);
						var info = get.info(skills[i]);
						if (info.ondisable && info.onremove) {
							info.onremove(player);
						}
						player.skills.remove(skills[i]);
					}
					player.checkConflict();
				},
				chooseJunlingFor() {
					"step 0";
					var list = ["junling1", "junling2", "junling3", "junling4", "junling5", "junling6"];
					list = list.randomGets(event.num).sort();
					for (var i = 0; i < list.length; i++) list[i] = ["军令", "", list[i]];
					var prompt = event.prompt || "选择一张军令牌";
					if (target != undefined && !event.prompt) {
						var str = target == player ? "（你）" : "";
						prompt += "，令" + get.translation(target) + str + "选择是否执行";
					}
					player.chooseButton([prompt, [list, "vcard"]], true).set("ai", function (button) {
						return get.junlingEffect(_status.event.player, button.link[2], _status.event.getParent().target, [], _status.event.player);
					});
					"step 1";
					event.result = {
						junling: result.links[0][2],
						targets: [],
					};
					if (result.links[0][2] == "junling1")
						player.chooseTarget("选择一名角色，做为若该军令被执行，受到伤害的角色", true).set("ai", function (_target) {
							return get.damageEffect(_target, target, player);
						});
					"step 2";
					if (result.targets.length) {
						player.line(result.targets, "green");
						event.result.targets = result.targets;
					}
				},
				chooseJunlingControl() {
					"step 0";
					var dialog = [];
					var str1 = source == player ? "（你）" : "";
					var str2 = event.targets ? "（被指定的角色为" + get.translation(event.targets) + "）" : "";
					if (!event.prompt) dialog.add(get.translation(event.source) + str1 + "选择的军令" + str2 + "为");
					else {
						dialog.add(event.prompt);
						dialog.add(get.translation(event.source) + str1 + "选择的军令" + str2 + "为");
					}
					dialog.add([[event.junling], "vcard"]);
					var controls = [];
					if (event.choiceList) {
						for (var i = 0; i < event.choiceList.length; i++) {
							dialog.add('<div class="popup text" style="width:calc(100% - 10px);display:inline-block">选项' + get.cnNumber(i + 1, true) + "：" + event.choiceList[i] + "</div>");
							controls.push("选项" + get.cnNumber(i + 1, true));
						}
					} else if (event.controls) controls = event.controls;
					else controls = ["执行该军令", "不执行该军令"];
					if (!event.ai)
						event.ai = function () {
							return Math.floor(controls.length * Math.random());
						};
					player.chooseControl(controls).set("dialog", dialog).set("ai", event.ai);
					"step 1";
					event.result = {
						index: result.index,
						control: result.control,
					};
				},
				carryOutJunling() {
					"step 0";
					switch (event.junling) {
						case "junling1": {
							if (targets[0].isAlive()) {
								player.line(targets, "green");
								targets[0].damage(player);
							}
							break;
						}
						case "junling2":
							player.draw();
							event.num = 1;
							break;
						case "junling3":
							player.loseHp();
							break;
						case "junling4":
							player.addTempSkill("junling4_eff");
							player.addTempSkill("fengyin_vice");
							player.addTempSkill("fengyin_main");
							break;
						case "junling5":
							player.turnOver();
							player.addTempSkill("junling5_eff");
							break;
					}
					"step 1";
					if (event.junling == "junling2" && source != player && player.countCards("he") > 0) {
						player.chooseCard("交给" + get.translation(source) + "第" + get.cnNumber(event.num) + "张牌（共两张）", "he", true);
						event.ing = true;
					}
					if (event.junling == "junling6") {
						var position = "",
							num0 = 0;
						if (player.countCards("h")) {
							position += "h";
							num0++;
						}
						if (player.countCards("e")) {
							position += "e";
							num0++;
						}
						player
							.chooseCard(
								"选择一张手牌和一张装备区内牌（若有），然后弃置其余的牌",
								position,
								num0,
								function (card) {
									if (ui.selected.cards.length) return get.position(card) != get.position(ui.selected.cards[0]);
									return true;
								},
								true
							)
							.set("complexCard", true)
							.set("ai", function (card) {
								return get.value(card);
							});
					}
					"step 2";
					if (event.junling == "junling2" && source != player) {
						if (result.cards.length && event.ing) {
							player.give(result.cards, source);
						}
						event.num++;
						if (event.num < 3) {
							event.ing = false;
							event.goto(1);
						}
					}
					if (event.junling == "junling6") {
						var cards = player.getCards("he");
						for (var i = 0; i < result.cards.length; i++) cards.remove(result.cards[i]);
						player.discard(cards);
					}
				},
				doubleDraw() {
					if (!player.hasMark("yinyang_mark")) player.addMark("yinyang_mark", 1);
				},
				changeViceOnline() {
					"step 0";
					player.showCharacter(2);
					var group = lib.character[player.name1][1];
					_status.characterlist.randomSort();
					var name = false;
					for (var i = 0; i < _status.characterlist.length; i++) {
						var goon = false,
							group2 = lib.character[_status.characterlist[i]][1];
						if (game.hasPlayer2(current => get.nameList(current).includes(_status.characterlist[i]))) continue;
						if (group == "ye") {
							if (group2 != "ye") goon = true;
						} else {
							if (group == group2) goon = true;
							else {
								var double = get.is.double(_status.characterlist[i], true);
								if (double && double.includes(group)) goon = true;
							}
						}
						if (goon) {
							name = _status.characterlist[i];
							break;
						}
					}
					if (!name) {
						event.finish();
						return;
					}
					_status.characterlist.remove(name);
					if (player.hasViceCharacter()) {
						event.change = true;
						_status.characterlist.add(player.name2);
					}
					event.toRemove = player.name2;
					event.toChange = name;
					if (event.change) event.trigger("removeCharacterBefore");
					"step 1";
					if (event.hidden) {
						if (!player.isUnseen(1)) player.hideCharacter(1);
					}
					"step 2";
					var name = event.toChange;
					if (event.hidden) game.log(player, "替换了副将", "#g" + get.translation(player.name2));
					else game.log(player, "将副将从", "#g" + get.translation(player.name2), "变更为", "#g" + get.translation(name));
					player.viceChanged = true;
					player.reinitCharacter(player.name2, name, false);
				},
				changeVice() {
					"step 0";
					player.showCharacter(2);
					if (!event.num) event.num = 3;
					var group = player.identity;
					if (!lib.group.includes(group)) group = lib.character[player.name1][1];
					_status.characterlist.randomSort();
					event.tochange = [];
					for (var i = 0; i < _status.characterlist.length; i++) {
						if (_status.characterlist[i].indexOf("gz_jun_") == 0) continue;
						if (game.hasPlayer2(current => get.nameList(current).includes(_status.characterlist[i]))) continue;
						var goon = false,
							group2 = lib.character[_status.characterlist[i]][1];
						if (group == "ye") {
							if (group2 != "ye") goon = true;
						} else {
							if (group == group2) goon = true;
							else {
								var double = get.is.double(_status.characterlist[i], true);
								if (double && double.includes(group)) goon = true;
							}
						}
						if (goon) {
							event.tochange.push(_status.characterlist[i]);
							if (event.tochange.length == event.num) break;
						}
					}
					if (!event.tochange.length) event.finish();
					else {
						if (event.tochange.length == 1)
							event._result = {
								bool: true,
								links: event.tochange,
							};
						else
							player.chooseButton(true, ["选择要变更的武将牌", [event.tochange, "character"]]).ai = function (button) {
								return get.guozhanRank(button.link);
							};
					}
					"step 1";
					var name = result.links[0];
					_status.characterlist.remove(name);
					if (player.hasViceCharacter()) {
						event.change = true;
						_status.characterlist.add(player.name2);
					}
					event.toRemove = player.name2;
					event.toChange = name;
					if (event.change) event.trigger("removeCharacterBefore");
					if (event.hidden) {
						if (!player.isUnseen(1)) player.hideCharacter(1);
					}
					"step 2";
					var name = event.toChange;
					if (event.hidden) game.log(player, "替换了副将", "#g" + get.translation(player.name2));
					else game.log(player, "将副将从", "#g" + get.translation(player.name2), "变更为", "#g" + get.translation(name));
					player.viceChanged = true;
					player.reinitCharacter(player.name2, name, false);
				},
				/*----分界线----*/
				mayChangeVice() {
					"step 0";
					player.chooseBool("是否变更副将？").set("ai", function () {
						var player = _status.event.player;
						return get.guozhanRank(player.name2, player) <= 3;
					});
					"step 1";
					if (result.bool) {
						if (!event.repeat) {
							if (!_status.changedSkills[player.playerid]) _status.changedSkills[player.playerid] = [];
							_status.changedSkills[player.playerid].add(event.skill);
						}
						player.changeVice(event.hidden);
					}
				},
				zhulian() {
					player.popup("珠联璧合");
					if (!player.hasMark("zhulianbihe_mark")) player.addMark("zhulianbihe_mark", 1);
				},
			},
			player: {
				getGuozhanGroup(num) {
					if (this.trueIdentity) {
						if (lib.character[this.name1][1] != "ye" || num == 1) return this.trueIdentity;
						return "ye";
					}
					if (get.is.double(this.name2)) return lib.character[this.name1][1];
					if (num == 1) return lib.character[this.name2][1];
					return lib.character[this.name1][1];
				},
				chooseJunlingFor(target) {
					var next = game.createEvent("chooseJunlingFor");
					next.player = this;
					next.target = target;
					next.num = 2;
					next.setContent("chooseJunlingFor");
					return next;
				},
				chooseJunlingControl(source, junling, targets) {
					var next = game.createEvent("chooseJunlingControl");
					next.player = this;
					next.source = source;
					next.junling = junling;
					if (targets.length) next.targets = targets;
					next.setContent("chooseJunlingControl");
					return next;
				},
				carryOutJunling(source, junling, targets) {
					var next = game.createEvent("carryOutJunling");
					next.source = source;
					next.player = this;
					if (targets.length) next.targets = targets;
					next.junling = junling;
					next.setContent("carryOutJunling");
					return next;
				},
				/**/
				mayChangeVice(repeat, hidden) {
					if (!_status.changedSkills) _status.changedSkills = {};
					var skill = _status.event.name;
					if (repeat || !_status.changedSkills[this.playerid] || !_status.changedSkills[this.playerid].includes(skill)) {
						var next = game.createEvent("mayChangeVice");
						next.setContent("mayChangeVice");
						next.player = this;
						next.skill = skill;
						if (repeat || (!_status.connectMode && get.config("changeViceType") == "online")) next.repeat = true;
						if (hidden == "hidden") next.hidden = true;
						return next;
					}
				},
				differentIdentityFrom(target, self) {
					if (this == target) return false;
					if (this.getStorage("yexinjia_friend").includes(target)) return false;
					if (target.getStorage("yexinjia_friend").includes(this)) return false;
					if (self) {
						if (target.identity == "unknown") return false;
						if (target.identity == "ye" || this.identity == "ye") return true;
						if (this.identity == "unknown") {
							var identity = lib.character[this.name1][1];
							if (this.wontYe()) return identity != target.identity;
							return true;
						}
					} else {
						if (this.identity == "unknown" || target.identity == "unknown") return false;
						if (this.identity == "ye" || target.identity == "ye") return true;
					}
					return this.identity != target.identity;
				},
				sameIdentityAs(target, shown) {
					if (this.getStorage("yexinjia_friend").includes(target)) return true;
					if (target.getStorage("yexinjia_friend").includes(this)) return true;
					if (shown) {
						if (this.identity == "ye" || this.identity == "unknown") return false;
					} else {
						if (this == target) return true;
						if (target.identity == "unknown" || target.identity == "ye" || this.identity == "ye") return false;
						if (this.identity == "unknown") {
							var identity = lib.character[this.name1][1];
							if (this.wontYe()) return identity == target.identity;
							return false;
						}
					}
					return this.identity == target.identity;
				},
				getModeState() {
					return {
						unseen: this.isUnseen(0),
						unseen2: this.isUnseen(1),
					};
				},
				setModeState(info) {
					if (info.mode.unseen) this.classList.add("unseen");
					if (info.mode.unseen2) this.classList.add("unseen2");
					if (!info.name) return;
					// if(info.name.indexOf('unknown')==0){
					// 	if(this==game.me){
					// 		lib.translate[info.name]+='（你）';
					// 	}
					// }
					this.init(info.name1, info.name2, false);
					this.name1 = info.name1;
					this.name = info.name;
					this.node.name_seat = ui.create.div(".name.name_seat", get.verticalStr(lib.translate[this.name].slice(0, 3)), this);
					if (info.identityShown) {
						this.setIdentity(info.identity);
						this.node.identity.classList.remove("guessing");
					} else if (this != game.me) {
						this.node.identity.firstChild.innerHTML = "猜";
						this.node.identity.dataset.color = "unknown";
						this.node.identity.classList.add("guessing");
					}
				},
				dieAfter2(source) {
					var that = this;
					if (that.hasSkillTag("noDieAfter", null, source)) return;
					if (source && source.hasSkillTag("noDieAfter2", null, that)) return;
					if (source && source.shijun) {
						source.discard(source.getCards("he"));
						delete source.shijun;
					} else if (source && source.identity != "unknown") {
						if (source.identity == "ye" && !source.getStorage("yexinjia_friend").length) source.draw(3);
						else if (source.shijun2) {
							delete source.shijun2;
							source.draw(
								1 +
									game.countPlayer(function (current) {
										return current.group == that.group;
									})
							);
						} else if (that.identity == "ye") {
							if (that.getStorage("yexinjia_friend").includes(source) || source.getStorage("yexinjia_friend").includes(that)) source.discard(source.getCards("he"));
							else
								source.draw(
									1 +
										game.countPlayer(function (current) {
											if (current == that) return false;
											if (current.getStorage("yexinjia_friend").includes(that)) return true;
											if (that.getStorage("yexinjia_friend").includes(current)) return true;
											return false;
										})
								);
						} else if (that.identity != source.identity) source.draw(get.population(that.identity) + 1);
						else source.discard(source.getCards("he"));
					}
				},
				dieAfter(source) {
					this.showCharacter(2);
					if (get.is.jun(this.name1)) {
						if (source && source.identity == this.identity) source.shijun = true;
						else if (source && source.identity != "ye") source.shijun2 = true;
						var yelist = [];
						for (var i = 0; i < game.players.length; i++) {
							if (game.players[i].identity == this.identity) {
								yelist.push(game.players[i]);
							}
						}
						game.broadcastAll(function (list) {
							for (var i = 0; i < list.length; i++) {
								list[i].identity = "ye";
								list[i].setIdentity();
							}
						}, yelist);
						_status.yeidentity.add(this.identity);
					}
					game.tryResult();
				},
				viewCharacter(target, num) {
					if (num != 0 && num != 1) {
						num = 2;
					}
					if (!target.isUnseen(num)) {
						return;
					}
					var next = game.createEvent("viewCharacter");
					next.player = this;
					next.target = target;
					next.num = num;
					next.setContent(function () {
						if (!player.storage.zhibi) {
							player.storage.zhibi = [];
						}
						player.storage.zhibi.add(target);
						var content,
							str = get.translation(target) + "的";
						if (event.num == 0 || !target.isUnseen(1)) {
							content = [str + "主将", [[target.name1], "character"]];
							game.log(player, "观看了", target, "的主将");
						} else if (event.num == 1 || !target.isUnseen(0)) {
							content = [str + "副将", [[target.name2], "character"]];
							game.log(player, "观看了", target, "的副将");
						} else {
							content = [str + "主将和副将", [[target.name1, target.name2], "character"]];
							game.log(player, "观看了", target, "的主将和副将");
						}
						player.chooseControl("ok").set("dialog", content);
					});
				},
				checkViceSkill(skill, disable) {
					if (game.expandSkills(lib.character[this.name2][3].slice(0)).includes(skill)) {
						return true;
					} else {
						if (disable !== false) {
							this.awakenSkill(skill);
						}
						return false;
					}
				},
				checkMainSkill(skill, disable) {
					if (game.expandSkills(lib.character[this.name1][3].slice(0)).includes(skill)) {
						return true;
					} else {
						if (disable !== false) {
							this.awakenSkill(skill);
						}
						return false;
					}
				},
				removeMaxHp(num) {
					if (game.online) return;
					if (!num) num = 1;
					while (num > 0) {
						num--;
						if (typeof this.singleHp == "boolean") {
							if (this.singleHp) {
								this.singleHp = false;
							} else {
								this.singleHp = true;
								this.maxHp--;
							}
						} else {
							this.maxHp--;
						}
					}
					this.update();
				},
				hideCharacter(num, log) {
					if (this.isUnseen(2)) return;
					var name = this["name" + (num + 1)];
					var next = game.createEvent("hideCharacter");
					next.player = this;
					next.toHide = name;
					next.num = num;
					next.log = log;
					next.setContent("hideCharacter");
					return next;
				},
				removeCharacter(num) {
					var name = this["name" + (num + 1)];
					var next = game.createEvent("removeCharacter");
					next.player = this;
					next.toRemove = name;
					next.num = num;
					next.setContent("removeCharacter");
					return next;
				},
				$removeCharacter(num) {
					var name = this["name" + (num + 1)];
					var info = lib.character[name];
					if (!info) return;
					var to = "gz_shibing" + (info[0] == "male" ? 1 : 2) + info[1];
					game.log(this, "移除了" + (num ? "副将" : "主将"), "#b" + name);
					this.reinit(name, to, false);
					this.showCharacter(num, false);
					_status.characterlist.add(name);
				},
				changeVice(hidden) {
					var next = game.createEvent("changeVice");
					next.player = this;
					next.setContent("changeVice");
					next.num = !_status.connectMode && get.config("changeViceType") == "online" ? 1 : 3;
					if (hidden) next.hidden = true;
					return next;
				},
				hasMainCharacter() {
					return this.name1.indexOf("gz_shibing") != 0;
				},
				hasViceCharacter() {
					return this.name2.indexOf("gz_shibing") != 0;
				},
				$showCharacter(num, log) {
					var showYe = false;
					if (num == 0 && !this.isUnseen(0)) {
						return;
					}
					if (num == 1 && !this.isUnseen(1)) {
						return;
					}
					if (!this.isUnseen(2)) {
						return;
					}
					game.addVideo("showCharacter", this, num);
					if (this.identity == "unknown" || ((num == 0 || num == 2) && lib.character[this.name1][1] == "ye")) {
						this.group = this.getGuozhanGroup(num);
						if ((num == 0 || num == 2) && lib.character[this.name1][1] == "ye") {
							this.identity = "ye";
							if (!this._ye) {
								this._ye = true;
								showYe = true;
							}
						} else if (get.is.jun(this.name1) && this.isAlive()) {
							this.identity = this.group;
						} else if (this.wontYe(this.group)) {
							this.identity = this.group;
						} else {
							this.identity = "ye";
						}
						this.setIdentity(this.identity);
						this.ai.shown = 1;
						this.node.identity.classList.remove("guessing");

						if (_status.clickingidentity && _status.clickingidentity[0] == this) {
							for (var i = 0; i < _status.clickingidentity[1].length; i++) {
								_status.clickingidentity[1][i].delete();
								_status.clickingidentity[1][i].style.transform = "";
							}
							delete _status.clickingidentity;
						}
						game.addVideo("setIdentity", this, this.identity);
					}
					var skills;
					switch (num) {
						case 0:
							if (log !== false) game.log(this, "展示了主将", "#b" + this.name1);
							this.name = this.name1;
							skills = lib.character[this.name][3];
							this.sex = lib.character[this.name][0];
							this.classList.remove("unseen");
							break;
						case 1:
							if (log !== false) game.log(this, "展示了副将", "#b" + this.name2);
							skills = lib.character[this.name2][3];
							if (this.sex == "unknown") this.sex = lib.character[this.name2][0];
							if (this.name.indexOf("unknown") == 0) this.name = this.name2;
							this.classList.remove("unseen2");
							break;
						case 2:
							if (log !== false) game.log(this, "展示了主将", "#b" + this.name1, "、副将", "#b" + this.name2);
							this.name = this.name1;
							skills = lib.character[this.name][3].concat(lib.character[this.name2][3]);
							this.sex = lib.character[this.name][0];
							this.classList.remove("unseen");
							this.classList.remove("unseen2");
							break;
					}
					game.broadcast(
						function (player, name, sex, num, identity, group) {
							player.identityShown = true;
							player.group = group;
							player.name = name;
							player.sex = sex;
							player.node.identity.classList.remove("guessing");
							switch (num) {
								case 0:
									player.classList.remove("unseen");
									break;
								case 1:
									player.classList.remove("unseen2");
									break;
								case 2:
									player.classList.remove("unseen");
									player.classList.remove("unseen2");
									break;
							}
							player.ai.shown = 1;
							player.identity = identity;
							player.setIdentity(identity);
							if (_status.clickingidentity && _status.clickingidentity[0] == player) {
								for (var i = 0; i < _status.clickingidentity[1].length; i++) {
									_status.clickingidentity[1][i].delete();
									_status.clickingidentity[1][i].style.transform = "";
								}
								delete _status.clickingidentity;
							}
						},
						this,
						this.name,
						this.sex,
						num,
						this.identity,
						this.group
					);
					this.identityShown = true;
					for (var i = 0; i < skills.length; i++) {
						this.hiddenSkills.remove(skills[i]);
						this.addSkill(skills[i]);
					}
					this.checkConflict();
					if (!this.viceChanged) {
						var initdraw = get.config("initshow_draw");
						if (_status.connectMode) initdraw = lib.configOL.initshow_draw;
						if (!_status.initshown && !_status.overing && initdraw != "off" && this.isAlive() && _status.mode != "mingjiang") {
							this.popup("首亮");
							if (initdraw == "draw") {
								game.log(this, "首先明置武将，得到奖励");
								game.log(this, "摸了两张牌");
								this.draw(2).log = false;
							} else {
								this.addMark("xianqu_mark", 1);
							}
							_status.initshown = true;
						}
						if (!this.isUnseen(2) && !this._mingzhied) {
							this._mingzhied = true;
							if (this.singleHp) {
								this.doubleDraw();
							}
							if (this.perfectPair()) {
								var next = game.createEvent("guozhanDraw");
								next.player = this;
								next.setContent("zhulian");
							}
						}
						if (showYe) {
							this.addMark("yexinjia_mark", 1);
						}
					}
					game.tryResult();
				},
				wontYe(group, numOfReadyToShow) {
					if (!group) {
						if (this.trueIdentity) group = this.trueIdentity;
						else group = lib.character[this.name1][1];
					}
					if (_status.yeidentity && _status.yeidentity.includes(group)) return false;
					if (get.zhu(this, null, group)) return true;
					if (!numOfReadyToShow) numOfReadyToShow = 1;
					return get.totalPopulation(group) + numOfReadyToShow <= (_status.separatism ? Math.max(get.population() / 2 - 1, 1) : get.population() / 2);
				},
				perfectPair(choosing) {
					if (_status.connectMode) {
						if (!lib.configOL.zhulian) return false;
					} else {
						if (!get.config("zhulian")) return false;
					}
					var name1 = this.name1;
					var name2 = this.name2;
					if (name1.indexOf("gz_shibing") == 0) return false;
					if (name2.indexOf("gz_shibing") == 0) return false;
					if (get.is.jun(this.name1)) return true;
					if (choosing && lib.character[name1][1] != "ye" && lib.character[name2][1] != "ye" && lib.character[name1][1] != lib.character[name2][1]) return false;
					if (name1.indexOf("gz_") == 0) {
						name1 = name1.slice(name1.indexOf("_") + 1);
					} else {
						while (name1.indexOf("_") != -1 && !lib.perfectPair[name1]) {
							name1 = name1.slice(name1.indexOf("_") + 1);
						}
					}
					if (name2.indexOf("gz_") == 0) {
						name2 = name2.slice(name2.indexOf("_") + 1);
					} else {
						while (name2.indexOf("_") != -1 && !lib.perfectPair[name2]) {
							name2 = name2.slice(name2.indexOf("_") + 1);
						}
					}
					var list = Object.keys(lib.perfectPair).concat(Object.values(lib.perfectPair)).flat();
					if (!list.includes(name1) || !list.includes(name2)) return false;
					return (lib.perfectPair[name1] && lib.perfectPair[name1].flat(Infinity).includes(name2)) || (lib.perfectPair[name2] && lib.perfectPair[name2].flat(Infinity).includes(name1));
				},
				siege(player) {
					if (this.identity == "unknown" || this.hasSkill("undist")) return false;
					if (!player) {
						var next = this.getNext();
						if (next && next.sieged()) return true;
						var previous = this.getPrevious();
						if (previous && previous.sieged()) return true;
						return false;
					} else {
						return player.sieged() && (player.getNext() == this || player.getPrevious() == this);
					}
				},
				sieged(player) {
					if (this.identity == "unknown") return false;
					if (player) {
						return player.siege(this);
					} else {
						var next = this.getNext();
						var previous = this.getPrevious();
						if (next && previous && next != previous) {
							if (next.identity == "unknown" || next.isFriendOf(this)) return false;
							return next.isFriendOf(previous);
						}
						return false;
					}
				},
				inline() {
					if (this.identity == "unknown" || this.identity == "ye" || this.hasSkill("undist")) return false;
					var next = this,
						previous = this;
					var list = [];
					for (var i = 0; next || previous; i++) {
						if (next) {
							next = next.getNext();
							if (!next.isFriendOf(this) || next == this) {
								next = null;
							} else {
								list.add(next);
							}
						}
						if (previous) {
							previous = previous.getPrevious();
							if (!previous.isFriendOf(this) || previous == this) {
								previous = null;
							} else {
								list.add(previous);
							}
						}
					}
					if (!list.length) return false;
					for (var i = 0; i < arguments.length; i++) {
						if (!list.includes(arguments[i]) && arguments[i] != this) return false;
					}
					return true;
				},
				logAi(targets, card) {
					if (this.ai.shown == 1 || this.isMad()) return;
					if (typeof targets == "number") {
						this.ai.shown += targets;
					} else {
						var effect = 0,
							c,
							shown;
						var info = get.info(card);
						if (info.ai && info.ai.expose) {
							if (_status.event.name == "_wuxie") {
								if (_status.event.source && _status.event.source.ai.shown) {
									this.ai.shown += 0.2;
								}
							} else {
								this.ai.shown += info.ai.expose;
							}
						}
						if (targets.length > 0) {
							for (var i = 0; i < targets.length; i++) {
								shown = Math.abs(targets[i].ai.shown);
								if (shown < 0.2 || targets[i].identity == "nei") c = 0;
								else if (shown < 0.4) c = 0.5;
								else if (shown < 0.6) c = 0.8;
								else c = 1;
								effect += get.effect(targets[i], card, this) * c;
							}
						}
						if (effect > 0) {
							if (effect < 1) c = 0.5;
							else c = 1;
							if (targets.length == 1 && targets[0] == this);
							else if (targets.length == 1) this.ai.shown += 0.2 * c;
							else this.ai.shown += 0.1 * c;
						}
					}
					if (this.ai.shown > 0.95) this.ai.shown = 0.95;
					if (this.ai.shown < -0.5) this.ai.shown = -0.5;
				},
			},
		},
		get: {
			guozhanReverse(name1, name2) {
				if (get.is.double(name2)) return false;
				if (["gz_xunyou", "gz_lvfan", "gz_liubei"].includes(name2)) return true;
				if (name1 == "gz_re_xushu") return true;
				if (name2 == "gz_dengai") return lib.character[name1][2] % 2 == 1;
				if (["gz_sunce", "gz_jiangwei"].includes(name1)) return name2 == "gz_zhoutai" || lib.character[name2][2] % 2 == 1;
				return false;
			},
			guozhanRank(name, player) {
				if (name.indexOf("gz_shibing") == 0) return -1;
				if (name.indexOf("gz_jun_") == 0) return 7;
				if (player) {
					var skills = lib.character[name][3].slice(0);
					for (var i = 0; i < skills.length; i++) {
						if (lib.skill[skills[i]].limited && player.awakenedSkills.includes(skills[i])) return skills.length - 1;
					}
				}
				if (_status._aozhan) {
					for (var i in lib.aozhanRank) {
						if (lib.aozhanRank[i].includes(name)) return parseInt(i);
					}
				}
				for (var i in lib.guozhanRank) {
					if (lib.guozhanRank[i].includes(name)) return parseInt(i);
				}
				return 0;
			},
			junlingEffect(source, junling, performer, targets, viewer) {
				var att1 = get.attitude(viewer, source),
					att2 = get.attitude(viewer, performer);
				var eff1 = 0,
					eff2 = 0;
				switch (junling) {
					case "junling1":
						if (
							!targets.length &&
							game.countPlayer(function (current) {
								return get.damageEffect(viewer, current, viewer) > 0;
							})
						)
							eff1 = 2;
						else {
							if (get.damageEffect(targets[0], performer, source) >= 0) eff1 = 2;
							else eff1 = -2;
							if (get.damageEffect(targets[0], source, performer) >= 0) eff2 = 2;
							else eff2 = -2;
						}
						break;
					case "junling2":
						if (performer.countCards("he")) {
							eff1 = 1;
							eff2 = 0;
						} else {
							eff1 = 2;
							eff2 = -1;
						}
						break;
					case "junling3":
						if (performer.hp == 1 && !performer.hasSkillTag("save", true)) eff2 = -5;
						else {
							if (performer == viewer) {
								if (performer.hasSkillTag("maihp", true)) eff2 = 3;
								else eff2 = -2;
							} else {
								if (performer.hasSkillTag("maihp", false)) eff2 = 3;
								else eff2 = -2;
							}
						}
						break;
					case "junling4":
						eff1 = 0;
						eff2 = -2;
						break;
					case "junling5":
						var td = performer.isTurnedOver();
						if (td) {
							if (performer == viewer) {
								if (_status.currentPhase == performer && performer.hasSkill("jushou")) eff2 = -3;
								else eff2 = 3;
							} else eff2 = 3;
						} else {
							if (performer == viewer) {
								if (performer.hasSkillTag("noturn", true)) eff2 = 0;
								else eff2 = -3;
							} else {
								if (performer.hasSkillTag("noturn", false)) eff2 = 0;
								else eff2 = -3;
							}
						}
						break;
					case "junling6":
						if (performer.countCards("h") > 1) eff2 += 1 - performer.countCards("h");
						if (performer.countCards("e") > 1) eff2 += 1 - performer.countCards("e");
						break;
				}
				return Math.sign(att1) * eff1 + Math.sign(att2) * eff2;
			},
			realAttitude(from, to, difficulty, toidentity) {
				var getIdentity = function (player) {
					if (player.isUnseen()) {
						if (!player.wontYe()) return "ye";
						return player.getGuozhanGroup(0);
					}
					return player.identity;
				};
				var fid = getIdentity(from);
				if (fid == toidentity && toidentity != "ye") {
					return 4 + difficulty;
				}
				if (from.identity == "unknown" && fid == toidentity) {
					if (from.wontYe()) return 4 + difficulty;
				}
				var groups = [];
				var map = {},
					sides = [],
					pmap = _status.connectMode ? lib.playerOL : game.playerMap,
					player;
				for (var i of game.players) {
					if (i.identity == "unknown") continue;
					var added = false;
					for (var j of sides) {
						if (i.isFriendOf(pmap[j])) {
							added = true;
							map[j].push(i);
							if (i == this) player = j;
							break;
						}
					}
					if (!added) {
						map[i.playerid] = [i];
						sides.push(i.playerid);
						if (i == this) player = i.playerid;
					}
				}
				for (var i in map) {
					var num = map[i].length;
					groups.push(num);
				}
				var max = Math.max.apply(this, groups);
				if (max <= 1) return -3;
				var from_p;
				if (from.identity == "unknown" && from.wontYe()) from_p = get.population(fid);
				else
					from_p = game.countPlayer(function (current) {
						return current.isFriendOf(from);
					});
				var to_p = game.countPlayer(function (current) {
					return current.isFriendOf(to);
				});
				if (to.identity == "ye") to_p += 1.5;

				if (to_p >= max) return -5;
				if (from_p >= max) return -2 - to_p;
				if (max >= game.players.length / 2) {
					if (to_p <= from_p) {
						return 0.5;
					}
					return 0;
				}
				if (to_p < max - 1) return 0;
				return -0.5;
			},
			rawAttitude(from, to) {
				var getIdentity = function (player) {
					if (player.isUnseen()) {
						if (!player.wontYe()) return "ye";
						return player.getGuozhanGroup(0);
					}
					return player.identity;
				};
				var fid = getIdentity(from),
					tid = getIdentity(to);
				if (to.identity == "unknown" && game.players.length == 2) return -5;
				if (_status.currentPhase == from && from.ai.tempIgnore && from.ai.tempIgnore.includes(to) && to.identity == "unknown" && (!from.storage.zhibi || !from.storage.zhibi.includes(to))) return 0;
				var difficulty = 0;
				if (to == game.me) difficulty = (2 - get.difficulty()) * 1.5;
				if (from == to) return 5 + difficulty;
				if (from.isFriendOf(to)) return 5 + difficulty;
				if (from.identity == "unknown" && fid == to.identity) {
					if (from.wontYe()) return 4 + difficulty;
				}
				var att = get.realAttitude(from, to, difficulty, tid);
				if (from.storage.zhibi && from.storage.zhibi.includes(to)) {
					return att;
				}
				if (to.ai.shown >= 0.5) return att * to.ai.shown;

				var nshown = 0;
				for (var i = 0; i < game.players.length; i++) {
					if (game.players[i] != from && game.players[i].identity == "unknown") {
						nshown++;
					}
				}
				if (to.ai.shown == 0) {
					if (nshown >= game.players.length / 2 && att >= 0) {
						return 0;
					}
					return Math.min(0, Math.random() - 0.5) + difficulty;
				}
				if (to.ai.shown >= 0.2) {
					if (att > 2) {
						return Math.max(0, Math.random() - 0.5) + difficulty;
					}
					if (att >= 0) {
						return 0;
					}
					return Math.min(0, Math.random() - 0.7) + difficulty;
				}
				if (att > 2) {
					return Math.max(0, Math.random() - 0.7) + difficulty;
				}
				if (att >= 0) {
					return Math.min(0, Math.random() - 0.3) + difficulty;
				}
				return Math.min(0, Math.random() - 0.5) + difficulty;
			},
		},
		help: {
			国战模式:
				'<div style="margin:10px">声明</div><ul style="margin-top:0"><li>以下所有规则均为根据公开爆料整理，经村规改动后制定的临时规则。不代表任何官方意见。请以后续发布的官方规则作为标准。</ul>' +
				'<div style="margin:10px">双势力武将</div><ul style="margin-top:0"><li>双势力武将牌可以和野心家武将牌/包含势力单武将牌/含有重叠势力的其他双势力武将牌组合，若你的主将为双势力武将，则：若你的副将为单势力武将牌，你的势力视为此势力；若你的副将为双势力武将，你的势力视为两张武将牌上的重叠势力（若重叠势力不止一个则需在游戏开始时选择一个作为自己的势力）；野心家武将牌为主将，双势力武将牌为副将时，游戏开始时需选择一个副将所含势力作为副将的势力。<br><li>变更副将时，可以选择包含原势力的双势力武将牌。左慈发动〖役鬼〗时，可以使用双势力武将牌同时指定两个不同势力的角色为目标。<br><li>特殊地，“冈崎汐”作为多势力武将牌，结算流程和规则与其他双势力武将相同。</ul>' +
				'<div style="margin:10px">野心家武将</div><ul style="margin-top:0"><li>野心家武将只能放在主将位置。副将可以为任意非野心家武将牌。<br><li>选择了野心家武将牌的角色（以下简称“野心家角色”）仅明置副将时，若副将为单势力武将牌，则势力暂时视为与该武将牌相同。若副将为双势力武将牌，则势力视为游戏开始时选择的副将代表的势力。<br><li>野心家角色明置主将时，其势力改为野心家。若其是首次明置该武将牌，则其获得一个“野心家”标记。<br><li>“野心家”标记可以当做“先驱”标记，“阴阳鱼”标记或是“珠联璧合”标记使用。当同时拥有两种标记时，优先弃置原装标记，下次发动时才弃置“野心家”标记。<br><li>野心家角色变更副将时，若其主将未明置过，则按照副将的势力进行变更。若主将已经明置过，则可以选择所有的非野心家武将牌。左慈发动〖役鬼〗时，可以使用野心家武将牌同时指定所有势力的角色为目标。' +
				"<br><li>当场上触发了胜利条件时，若这些角色中存在未明置过主将的野心家角色，则这些野心家角色选择是否“暴露野心”。若无人选择“是”且场上存在非野心家角色存活，则所有非野心家角色胜利，野心家角色失败。若有人选择“是”，则这些角色明置主将，然后选择是否发起“拉拢人心”。<br><li>选择发起“拉拢人心”的野心家角色选择一个新的势力作为自己的势力，弃置“野心家”标记，令所有其他非野心家角色且非君主且非已“结盟”角色依次选择是否和该野心家角色“结盟”。选择“是”的角色将势力改为和该野心家势力相同。此次“拉拢人心”对所有其他角色询问结束后，所有选择“否”的角色将手牌摸至四张并回复1点体力。</ul>" +
				'<div style="margin:10px">纵横捭阖</div><ul style="margin-top:0"><li>当一名角色对目标角色发动具有拥有“纵横”衍生技的技能时，其可以令对方获得“纵横”衍生技直到其下回合结束。</ul>',
		},
	};
};
