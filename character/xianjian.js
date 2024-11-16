import { lib, game, ui, get, ai, _status } from "../noname.js";
game.import("character", function () {
	return {
		name: "xianjian",
		character: {
			pal_lixiaoyao: ["male", "qun", 4, ["tianjian", "xjyufeng"]],
			pal_zhaoliner: ["female", "wei", 3, ["huimeng", "tianshe"]],
			pal_linyueru: ["female", "wei", 3, ["guiyuan", "qijian"]],
			pal_anu: ["female", "wu", 3, ["lingdi", "anwugu"]],

			pal_wangxiaohu: ["male", "qun", 4, ["husha"]],
			pal_sumei: ["female", "shu", 3, ["sheying", "dujiang", "huahu"]],
			pal_shenqishuang: ["female", "wei", 3, ["qixia", "jianzhen", "binxin"]],

			pal_jingtian: ["male", "wu", 3, ["sajin", "jtjubao"]],
			pal_xuejian: ["female", "shu", 3, ["xshuangren", "shenmu", "duci"]],
			pal_longkui: ["female", "qun", 3, ["fenxing", "diewu", "lingyu"]],
			pal_zixuan: ["female", "wei", 3, ["shuiyun", "wangyou", "changnian"]],
			pal_changqing: ["male", "wei", 4, ["luanjian", "ctianfu"]],

			pal_nangonghuang: ["male", "wei", 3, ["zhaoyao", "sheling", "zhangmu"], ["name:南宫|煌"]],
			pal_wenhui: ["female", "shu", 4, ["huxi", "longxiang"]],
			pal_wangpengxu: ["female", "shu", 3, ["duxinshu", "feixu"]],
			pal_xingxuan: ["male", "wei", 3, ["feizhua", "leiyu", "lingxue"]],
			pal_leiyuange: ["male", "shu", 4, ["feng", "ya", "song"]],

			pal_yuntianhe: ["male", "wu", 4, ["longxi", "zhuyue", "guanri"]],
			pal_hanlingsha: ["female", "shu", 3, ["tannang", "tuoqiao"]],
			pal_liumengli: ["female", "wei", 3, ["tianxian", "runxin", "xjzhimeng"]],
			pal_murongziying: ["male", "wei", 4, ["xuanning", "poyun", "qianfang"], ["name:慕容|紫英"]],
			pal_xuanxiao: ["male", "wei", 4, ["xuanyan", "ningbin", "xfenxin"]],

			pal_jiangyunfan: ["male", "wei", 4, ["xunying", "liefeng"]],
			pal_tangyurou: ["female", "shu", 3, ["txianqu", "qiongguang"]],
			pal_longyou: ["male", "wei", 4, ["yuexing", "minsha"]],
			pal_xiaoman: ["female", "shu", 3, ["anwugu", "lingquan", "shenwu"]],

			pal_xiahoujinxuan: ["male", "shu", 3, ["xuanmo", "danqing"]],
			pal_muchanglan: ["female", "wu", 3, ["feixia", "lueying"]],
			pal_xia: ["female", "shu", 3, ["xjzongyu", "fanling"]],
			pal_jiangcheng: ["male", "qun", 4, ["yanzhan", "fenshi"]],

			pal_yuejinzhao: ["male", "wei", 4, ["ywuhun", "xjyingfeng"]],
			pal_yueqi: ["female", "wei", 3, ["tianwu", "liguang", "shiying"]],
			pal_mingxiu: ["female", "shu", 3, ["linghuo", "guijin", "chengxin"]],
			pal_xianqing: ["male", "qun", 4, ["xtanxi", "xiaoyue"]],
			pal_luozhaoyan: ["female", "shu", 4, ["fenglue", "tanhua"]],
			pal_jushifang: ["male", "shu", 3, ["yujia", "xiepan", "yanshi"]],
		},
		characterIntro: {
			pal_lixiaoyao:
				"一个天资聪颖的乡下客栈店小二，因一壶酒被酒剑仙传授了蜀山仙剑派剑术，在仙灵岛与赵灵儿相遇，自此经历重重磨难成长为一代旷世奇侠。灵儿牺牲以后他悲痛欲绝。后出任蜀山掌门，取道号一贫，从此御剑行遍天下，行侠仗义、斩妖除魔。多年后因魔教之乱，故引咎卸职，成为蜀山七圣之一。而后虽心力交瘁，但仍竭力保护天下苍生。",
			pal_zhaoliner:
				"林青儿与巫王之女，亦是女娲族人。自幼与世隔绝，跟随姥姥隐居仙灵岛修炼，躲避仇人的追杀。难以告人的神秘身世，让她逃不过命运的捉弄，注定在滚滚红尘中历尽千灾万劫。在最终，赵灵儿为了消灭拜月水魔兽，与其同归于尽。但在王小虎、李忆如决战大魔头千叶禅师的结尾，出现了她的声音。",
			pal_linyueru:
				"天资灵秀，聪敏慧黠，情深义重。身为江南武林魁首林家堡之武门千金，与李逍遥不打不相识，并在此后的寻人旅途中相知相恋。在经历过重重艰辛和生离死别后，遥月二人终于携手而共结连理，与高堂娇儿共享天伦。",

			pal_wangxiaohu:
				"李逍遥的同乡，自小仰慕李逍遥，想要拜在他门下，得知拜师无望之后，遂跟随李大婶学习排云掌法。之后前往杭州拜“三大神捕”之一的”神眼魔刀”盛尊武为师，并习得魔刀刀法。热血少年，敢作敢当，嫉恶如仇，相信人定胜天。他最后发现千叶禅师的阴谋，与众人合力击败千叶禅师。",
			pal_sumei:
				"蛇妖和狐精之女，其父母当年被李逍遥和林月如所杀，因此她一直想要报仇，可以说是为报仇而活着。爱上王小虎，认识李忆如之后，苏媚学会了宽恕，最后甚至为了朋友和爱人牺牲自己。",
			pal_shenqishuang:
				"乳名沈七七，峨嵋山仙霞派掌门清柔师太座下弟子，与四位师姊妹合称“仙霞五奇”，排行第四，个性拘谨温婉，对小虎心怀爱意却不敢开口表达。",

			pal_jingtian:
				"永安当的小伙计，司“管饰”一职，专门保管当铺收押的首饰珠宝类贵重物品。景天不但有鉴别古董珠宝的天赋，而且对买卖、帐目能很精通，对保管的当品更有过目不忘的本事。每日幻想有朝一日能富甲天下或成为人人景仰的蜀山剑仙。",
			pal_xuejian:
				"出身唐门，虽为大小姐，却备受家族内部排挤欺凌。后离开唐家堡，与景天等人一同浪迹江湖并探寻自己的身世秘密。经历各种事件后，与景天结为连理，并育有一子名为景小楼。",
			pal_longkui:
				"古时的姜国公主，景天前世龙阳的妹妹。因国破家亡而跳入铸剑炉，成为魔剑剑灵。龙葵拥有两种性格形态：蓝色龙葵温柔娴淑，红色龙葵火辣张扬。",
			pal_zixuan:
				"女娲族后裔，饱受情爱煎熬三生三世之苦。在面对为了天下苍生而牺牲生命的女娲族宿命时，她坦然接受，把自己用水灵珠修炼的内丹渡给徐长卿使他成为上仙，最后献出自己的生命封印锁妖塔。",
			pal_changqing:
				"蜀山仙剑派俗家弟子。自幼被蜀山掌门清微收为入室弟子，武学天赋极高。与紫萱相恋三世，最终紫萱为修复锁妖塔而牺牲了自己并把自己用水灵珠修炼的内丹渡给徐长卿，使徐长卿迅速成仙并继任蜀山派第二十三代掌门，最后辞去了掌门职务归隐。",

			pal_nangonghuang:
				'出生不久后父母被为了追寻记忆而来燎日所误杀，后来被常纪带到蜀山抚养长大，视同己出。从小希望得到尊敬。后来奉蜀山掌门徐长卿之命开启地脉入口，疏通五灵，从而使蜀山"否极泰来"、回复混沌状态。',
			pal_wenhui:
				"爽朗大方，性情如同男子，极富正义感；内心却是天真少女般剔透明净。因为不愿嫁去室韦而逃出家里，后与南宫煌相遇，并随其完成地脉任务。",
			pal_wangpengxu:
				"原形是一只娇小可爱的五毒兽。擅长读心术，可以看透人的心思。多次被南宫煌无意中救下，后跟随其恢复地脉。",
			pal_xingxuan:
				"南宫煌之兄，幼时被燎日带走并由其抚养长大。身体其实是一具尸体（尸体是其父赤炎的），不仅残缺而且带有剧毒。初，灵肉分离，身体毫无感觉，后经重楼相助灵肉合一。为使尸身不坏，使用剧毒保存，故无法进入人界，绝大多数时间身在里蜀山。有领导才能，凭借自身上位者的气质和才干，在里蜀山妖界占据了一定势力。",
			pal_leiyuange:
				"是个来历成谜的木讷男子，擅长使用弩、单手斧，有三只名为风雅颂的怪鸟时常出现在他的头顶代替其言语。生前为室韦族族长，死后尸体被鬼差附身。在胜洲与南宫煌与温慧等人结识，并成为好友。",

			pal_yuntianhe:
				"自幼孤身一人在黄山青鸾峰长大，从未下过山，对外界事物一无所知。一次偶然的机会与闯入父亲的墓室寻找宝藏的少女韩菱纱相遇。为了更多地了解父亲的过去、也为了成为剑仙，云天河与韩菱纱和柳梦璃一同拜入昆仑琼华派成为门下弟子。下山后云天河虽经历种种，但从未改变过“我命由我不由天”的想法。",
			pal_hanlingsha:
				"背负着家族命运而四处奔走的少女，自称是独行千里的陵墓大盗。年纪不大，却对辨识墓穴位置、破解奇诡机关、地脉风水之学颇有研究。",
			pal_liumengli: "妖界婵幽之女，因19年前妖界大战而失散，被云天青行侠救下后送至寿阳城县家抚养。",
			pal_murongziying:
				"昆仑琼华派弟子。很小就被家人送至琼华派修行，天赋极高，在同辈弟子中修为较深，已臻“以气御剑”的境界。性格外冷内热，稳重内敛；看似不易相处，实则是一个恩怨分明、极重情义的热血男儿。",
			pal_xuanxiao:
				"天赋异禀，资质极佳，是万中无一的修仙奇才，和夙玉用双剑束缚幻瞑界吸取灵力并引发琼华派与妖界之战。因夙玉离开昆仑，修炼双剑中断，他被邪火入侵而走火入魔，打伤数名师兄弟，被夙瑶联合青阳、重光与宗炼长老冰封19年，因此逢缘与云天河结拜。",

			pal_xiahoujinxuan:
				"夏侯世家的少主。因不喜舞枪弄剑，专爱趣闻逸史，让父亲深感恨铁不成钢；好在他对于仙术符法也有所涉略，没沦落到手无缚鸡之力的境地。",
			pal_muchanglan:
				"行走江湖买卖消息的佣兵，冷艳霸气，洞察力强。受人雇佣而加入夏侯瑾轩等一行人，虽然目的不纯，但通过相处，渐渐地被改变；同时通过夏侯瑾轩等人的帮助，完成了救治暮蔼村村民的心愿。",
			pal_xia:
				"走江湖卖艺为生的孤女，性格倔强，自尊心强，不喜欢被人小看，更不爱占别人的便宜。卖艺的艰辛让她深知人间冷暖，却仍保持善良天性。",
			pal_jiangcheng:
				"折剑山庄庄主欧阳英的得意门生，但因其蚩尤后人魔族的身份，令他无法被容于人界；再加上人界半魔同族饱受人类迫害，故最终成为净天教教主魔君“姜世离”，毅然肩负起保护同族的重任。",
		},
		skill: {
			lingquan: {
				trigger: { player: "phaseEnd" },
				forced: true,
				skillAnimation: true,
				animationColor: "water",
				unique: true,
				filter: function (event, player) {
					return game.roundNumber >= 3 && player.getHistory("useCard").length > player.hp;
				},
				content: function () {
					"step 0";
					player.awakenSkill("lingquan");
					player.draw(3);
					player.addSkill("shuiyun");
					"step 1";
					if (lib.filter.filterTrigger(trigger, player, "phaseEnd", "shuiyun"))
						game.createTrigger("phaseEnd", "shuiyun", player, trigger);
				},
			},
			shenwu: {
				trigger: { global: "phaseEnd" },
				forced: true,
				skillAnimation: true,
				animationColor: "water",
				unique: true,
				filter: function (event, player) {
					return player.storage.shuiyun_count >= 3;
				},
				content: function () {
					player.awakenSkill("shenwu");
					player.gainMaxHp();
					player.recover();
					player.addSkill("huimeng");
				},
			},
			qiongguang: {
				trigger: { player: "phaseDiscardEnd" },
				filter: function (event, player) {
					return event.cards && event.cards.length > 1;
				},
				content: function () {
					"step 0";
					event.targets = player.getEnemies().sortBySeat();
					"step 1";
					if (event.targets.length) {
						player.line(event.targets.shift().getDebuff(false).addExpose(0.1), "green");
						event.redo();
					}
					"step 2";
					game.delay();
				},
				ai: {
					threaten: 2,
					expose: 0.2,
					effect: {
						player_use: function (card, player) {
							if (_status.currentPhase != player) return;
							if (_status.event.name != "chooseToUse" || _status.event.player != player) return;
							var num = player.needsToDiscard();
							if (num > 2 || num == 1) return;
							if (get.type(card) == "basic" && num != 2) return;
							if (get.tag(card, "gain")) return;
							if (get.value(card, player, "raw") >= 7) return;
							if (player.hp <= 2) return;
							if (!player.hasSkill("jilue") || player.storage.renjie == 0) {
								return "zeroplayertarget";
							}
						},
					},
				},
			},
			txianqu: {
				trigger: { source: "damageBefore" },
				logTarget: "player",
				filter: function (event, player) {
					if (player.hasSkill("txianqu2")) return false;
					var evt = event.getParent("phaseUse");
					if (evt && evt.player == player) return true;
					return false;
				},
				check: function (event, player) {
					var target = event.player;
					if (get.attitude(player, target) >= 0 || get.damageEffect(target, player, player) <= 0)
						return true;
					if (target.hp > player.hp && player.isDamaged()) return true;
					return false;
				},
				content: function () {
					trigger.cancel();
					player.draw(2);
					player.recover();
					player.addTempSkill("txianqu2");
				},
				ai: {
					jueqing: true,
					skillTagFilter: function (player, tag, arg) {
						if (!arg) return false;
						if (player.hasSkill("txianqu2")) return false;
						if (get.attitude(player, arg) > 0) return false;
						var evt = _status.event.getParent("phaseUse");
						if (evt && evt.player == player) return true;
						return false;
					},
					effect: {
						player: function (card, player, target) {
							if (get.tag(card, "damage") && get.attitude(player, target) > 0) {
								if (
									player.hp == player.maxHp ||
									get.recoverEffect(player, player, player) <= 0
								)
									return "zeroplayertarget";
								return [0, 0, 0, 0.5];
							}
						},
					},
				},
			},
			txianqu2: {},
			xunying: {
				trigger: { player: "shaAfter" },
				direct: true,
				filter: function (event, player) {
					return player.canUse("sha", event.target) && player.hasSha() && event.target.isIn();
				},
				content: function () {
					"step 0";
					if (player.hasSkill("jiu")) {
						player.removeSkill("jiu");
						event.jiu = true;
					}
					player.chooseToUse(get.prompt("xunying"), { name: "sha" }, trigger.target, -1).logSkill =
						"xunying";
					"step 1";
					if (result.bool);
					else if (event.jiu) {
						player.addSkill("jiu");
					}
				},
			},
			liefeng: {
				trigger: { player: "useCard" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return _status.currentPhase == player && [2, 3, 4].includes(player.countUsed());
				},
				content: function () {
					var skill;
					switch (player.countUsed()) {
						case 2:
							skill = "yanzhan";
							break;
						case 3:
							skill = "tianjian";
							break;
						case 4:
							skill = "xjyufeng";
							break;
					}
					if (skill && !player.hasSkill(skill)) {
						player.addTempSkill(skill);
						player.popup(skill);
						game.log(player, "获得了", "【" + get.translation(skill) + "】");
						if (skill == "xjyufeng") {
							var nh = player.countCards("h");
							if (nh < 2) {
								player.draw(2 - nh);
								player.addSkill("counttrigger");
								if (!player.storage.counttrigger) {
									player.storage.counttrigger = {};
								}
								player.storage.counttrigger.xjyufeng = 1;
							}
						}
					}
				},
				ai: {
					effect: {
						player_use(card, player) {
							if (_status.currentPhase != player) return;
							if (get.type(card) == "basic") return;
							if (get.tag(card, "gain")) return;
							if (get.value(card, player, "raw") >= 7) return;
							if (player.hp <= 2) return;
							if (player.needsToDiscard()) return;
							if (player.countUsed() >= 2) return;
							return "zeroplayertarget";
						},
					},
				},
			},
			yuexing: {
				enable: "phaseUse",
				usable: 1,
				filterTarget: function (card, player, target) {
					return target != player;
				},
				content: function () {
					player.storage.yuexing2 = target;
					player.addTempSkill("yuexing2", "phaseUseAfter");
					target.storage.yuexing2 = player;
					target.addTempSkill("yuexing2", "phaseUseAfter");
				},
				ai: {
					order: function () {
						var player = _status.event.player;
						if (player.hasSkill("minsha")) return 6.5;
						return 2;
					},
					result: {
						target: function (player, target) {
							if (
								player.hasSkill("minsha") &&
								player.countCards("he") >= 3 &&
								target.hp > 1 &&
								get.damageEffect(target, player, player, "thunder") > 0
							) {
								var num1 = game.countPlayer(function (current) {
									if (
										get.distance(target, current) <= 1 &&
										current != player &&
										current != target
									) {
										return -get.sgn(get.attitude(player, current));
									}
								});
								var num2 = game.countPlayer(function (current) {
									if (
										get.distance(player, current) <= 1 &&
										current != player &&
										current != target
									) {
										return -get.sgn(get.attitude(player, current));
									}
								});
								if (num2 >= num1) return 0;
								return 2 * (num2 - num1);
							}
							return -_status.event.getRand();
						},
					},
				},
			},
			yuexing2: {
				mark: "character",
				intro: {
					content: "到其他角色的距离基数与$交换",
				},
				onremove: true,
				mod: {
					globalFrom: function (from, to, distance) {
						if (from.storage.yuexing2) {
							var dist1 = get.distance(from, to, "pure");
							var dist2 = get.distance(from.storage.yuexing2, to, "pure");
							return distance - dist1 + dist2;
						}
					},
				},
			},
			minsha: {
				enable: "phaseUse",
				usable: 1,
				filterCard: true,
				selectCard: 2,
				position: "he",
				filter: function (event, player) {
					return player.countCards("he") >= 2;
				},
				filterTarget: function (card, player, target) {
					return target != player && target.hp > 1;
				},
				line: "thunder",
				check: function (card) {
					return 8 - get.value(card);
				},
				content: function () {
					"step 0";
					target.damage("thunder");
					"step 1";
					event.targets = game
						.filterPlayer(function (current) {
							return (
								get.distance(target, current) <= 1 && current != target && current != player
							);
						})
						.sortBySeat(target);
					"step 2";
					if (event.targets.length) {
						event.targets.shift().randomDiscard(false);
						event.redo();
					}
				},
				ai: {
					order: 6,
					result: {
						player: function (player, target) {
							if (get.damageEffect(target, player, player, "thunder") > 0) {
								if (target == player.storage.yuexing2) {
									return 10;
								}
								var num =
									1 +
									game.countPlayer(function (current) {
										if (
											get.distance(target, current) <= 1 &&
											current != player &&
											current != target
										) {
											return -get.sgn(get.attitude(player, current));
										}
									});
								if (target.hp == 1) {
									num += 2;
								}
								if (target.hp < player.hp) {
									num += 0.5;
								}
								if (player.needsToDiscard()) num += 0.1;
								return num;
							}
						},
					},
				},
			},
			lingdi: {
				enable: "phaseUse",
				filter: function (event, player) {
					var num = 1 + (player.getStat().skill.lingdi || 0);
					if (
						game.hasPlayer(function (current) {
							return current != player && Math.max(1, get.distance(player, current)) == num;
						})
					) {
						var hs = player.getCards("h");
						var suits = player.storage.lingdi || [];
						for (var i = 0; i < hs.length; i++) {
							if (!suits.includes(get.suit(hs[i]))) {
								return true;
							}
						}
					}
					return false;
				},
				filterTarget: function (card, player, target) {
					return (
						target != player &&
						Math.max(1, get.distance(player, target)) == 1 + (player.getStat().skill.lingdi || 0)
					);
				},
				filterCard: function (card, player) {
					return !(player.storage.lingdi || []).includes(get.suit(card));
				},
				check: function (card) {
					return 8 - get.value(card);
				},
				content: function () {
					game.asyncDraw([player, target]);
					if (!player.storage.lingdi) {
						player.storage.lingdi = [];
					}
					player.storage.lingdi.add(get.suit(cards[0]));
				},
				ai: {
					threaten: 1.2,
					order: 7,
					result: {
						target: 1,
					},
				},
				group: "lingdi_clear",
				subSkill: {
					clear: {
						trigger: { player: "phaseAfter" },
						silent: true,
						content: function () {
							delete player.storage.lingdi;
						},
					},
				},
			},
			xiaoyue: {
				trigger: { global: "roundStart" },
				forced: true,
				filter: function (event, player) {
					return player.countCards("h", "sha");
				},
				content: function () {
					var card = player.getCards("h", "sha").randomGet();
					var target = player.getEnemies().randomGet();
					if (card && target) {
						target.addExpose(0.1);
						player.useCard(card, target, false);
						player.changeHujia();
					}
				},
				ai: {
					effect: {
						player_use: function (card, player, target) {
							if (_status.currentPhase != player) return;
							if (
								card.name == "sha" &&
								get.itemtype(card) == "card" &&
								!player.needsToDiscard() &&
								target.hp > 1 &&
								player.countCards("h", "sha") == 1
							) {
								return "zeroplayertarget";
							}
						},
					},
				},
			},
			xiaoyue2: {
				mod: {
					cardRespondable: function (card, player) {
						if (_status.event.getParent(4).name == "xiaoyue" && get.suit(card) != "heart")
							return false;
					},
				},
			},
			huanlei: {
				trigger: { player: "damageEnd" },
				check: function (event, player) {
					return get.damageEffect(event.source, player, player, "thunder") > 0;
				},
				filter: function (event, player) {
					return event.source && event.source.isIn() && event.source.hp > player.hp;
				},
				logTarget: "source",
				content: function () {
					"step 0";
					trigger.source.damage("thunder");
					"step 1";
					trigger.source.draw();
				},
			},
			anwugu: {
				trigger: { source: "damageEnd" },
				check: function (event, player) {
					return get.attitude(player, event.player) < 0;
				},
				filter: function (event, player) {
					if (event._notrigger.includes(event.player)) return false;
					return event.player != player && event.player.isIn() && !event.player.hasSkill("anwugu2");
				},
				logTarget: "player",
				content: function () {
					trigger.player.addSkill("anwugu2");
				},
			},
			anwugu2: {
				mod: {
					cardEnabled: function (card, player) {
						if (_status.currentPhase != player) return;
						if (player.countUsed() >= player.storage.anwugu2) return false;
					},
					maxHandcard: function (player, num) {
						return num - 1;
					},
				},
				mark: true,
				intro: {
					content: "手牌上限-1，每回合最多使用$张牌（剩余$回合）",
				},
				init: function (player) {
					player.storage.anwugu2 = 3;
				},
				trigger: { player: "phaseAfter" },
				silent: true,
				onremove: true,
				content: function () {
					player.storage.anwugu2--;
					if (player.storage.anwugu2 <= 0) {
						// player.loseHp();
						player.removeSkill("anwugu2");
					} else {
						player.updateMarks();
					}
				},
			},
			xtanxi: {
				enable: "phaseUse",
				usable: 1,
				filterCard: true,
				check: function (card) {
					var enemies = _status.event.player.getEnemies();
					var num1 = 0,
						num2 = 0;
					for (var i = 0; i < enemies.length; i++) {
						if (enemies[i].countCards("h", "sha")) num1++;
						if (enemies[i].countCards("h", "shan")) num2++;
						if (enemies[i].countCards("h") >= 3) {
							num1 += 0.5;
							num2 += 0.5;
						}
					}
					var rand = _status.event.getRand();
					if (num1 >= 1 && num2 >= 1) {
						if (card.name == "shan") return (rand += 0.4);
						if (card.name == "sha") return rand;
					} else if (num1 >= 1) {
						if (card.name == "sha") return rand;
					} else if (num2 >= 1) {
						if (card.name == "shan") return rand;
					}
					return 0;
				},
				content: function () {
					player.addExpose(0.1);
					var targets = player.getEnemies();
					for (var i = 0; i < targets.length; i++) {
						if (!targets[i].countCards("h", cards[0].name)) {
							targets.splice(i--, 1);
						}
					}
					if (targets.length) {
						var target = targets.randomGet();
						player.line(target, "green");
						target.addExpose(0.1);
						player.gainPlayerCard(target, "h", "visible");
					}
				},
				ai: {
					order: 4,
					result: {
						player: 1,
					},
				},
			},
			linghuo: {
				round: 2,
				trigger: { global: "phaseEnd" },
				filter: function (event, player) {
					return event.player.getStat("damage") && event.player != player;
				},
				check: function (event, player) {
					return get.damageEffect(event.player, player, player, "fire") > 0;
				},
				logTarget: "player",
				line: "fire",
				ai: {
					expose: 0.2,
					threaten: 1.3,
				},
				content: function () {
					trigger.player.damage("fire");
				},
			},
			guijin: {
				round: 3,
				enable: "phaseUse",
				delay: 0,
				content: function () {
					"step 0";
					event.cards = get.cards(4);
					"step 1";
					if (event.cards.length) {
						var more = false,
							remain = false,
							nomore = false;
						if (event.cards.length >= 3) {
							for (var i = 0; i < event.cards.length; i++) {
								var value = get.value(event.cards[i], player, "raw");
								if (value >= 8) {
									more = true;
								}
								if (event.cards.length >= 4 && value < 6) {
									if (remain === false) {
										remain = value;
									} else {
										remain = Math.min(remain, value);
									}
								}
							}
						}
						if (remain === false) {
							remain = 0;
						}
						if (
							!more &&
							!game.hasPlayer(function (current) {
								return (
									get.attitude(player, current) < 0 &&
									!current.skipList.includes("phaseDraw")
								);
							})
						) {
							var num = 0;
							for (var i = 0; i < event.cards.length; i++) {
								num += Math.max(0, get.value(event.cards[i], player, "raw"));
							}
							if (num >= 12) {
								more = true;
							} else {
								nomore = true;
							}
						}
						player.chooseCardButton("归烬", event.cards, [1, event.cards.length]).ai = function (
							button
						) {
							if (nomore) return 0;
							if (more) {
								return get.value(button.link, player, "raw") - remain;
							} else {
								if (ui.selected.buttons.length) return 0;
								return 8 - get.value(button.link, player, "raw");
							}
						};
					} else {
						event.goto(4);
					}
					"step 2";
					if (result.bool) {
						for (var i = 0; i < result.links.length; i++) {
							event.cards.remove(result.links[i]);
						}
						event.togive = result.links.slice(0);
						player.chooseTarget("将" + get.translation(result.links) + "交给一名角色", true).ai =
							function (target) {
								var att =
									get.attitude(player, target) / Math.sqrt(target.countCards("h") + 1);
								if (result.links.length > 1) {
									if (target == player && target.needsToDiscard(result.links) > 1)
										return att / 5;
									return att;
								} else {
									if (target.skipList.includes("phaseDraw")) return att / 5;
									return -att;
								}
							};
					} else {
						event.goto(4);
					}
					"step 3";
					if (result.targets.length) {
						result.targets[0].gain(event.togive, "draw");
						result.targets[0].skip("phaseDraw");
						result.targets[0].addTempSkill("guijin2", { player: "phaseBegin" });
						game.log(
							result.targets[0],
							"获得了" + get.cnNumber(event.togive.length) + "张",
							"#g“归烬”牌"
						);
						player.line(result.targets[0], "green");
						event.goto(1);
					}
					"step 4";
					while (event.cards.length) {
						ui.cardPile.insertBefore(event.cards.pop(), ui.cardPile.firstChild);
					}
				},
				ai: {
					order: 1,
					result: {
						player: function (player) {
							if (game.roundNumber == 1 && player.hasUnknown()) return 0;
							return 1;
						},
					},
				},
			},
			guijin2: {
				mark: true,
				intro: {
					content: "跳过下一个摸牌阶段",
				},
				ai: {
					effect: {
						target: function (card, player, target) {
							if (card.name == "bingliang" || card.name == "caomu") return [0, 0];
						},
					},
				},
			},
			chengxin: {
				round: 4,
				enable: "chooseToUse",
				filter: function (event, player) {
					return event.type == "dying";
				},
				filterTarget: function (card, player, target) {
					return target == _status.event.dying;
				},
				selectTarget: -1,
				content: function () {
					target.recover(1 - target.hp);
					target.addTempSkill("chengxin2", { player: "phaseAfter" });
				},
				ai: {
					order: 6,
					threaten: 1.4,
					skillTagFilter: function (player) {
						if (4 - (game.roundNumber - player.storage.chengxin_roundcount) > 0) return false;
						if (!_status.event.dying) return false;
					},
					save: true,
					result: {
						target: 3,
					},
				},
			},
			chengxin2: {
				trigger: { player: "damageBefore" },
				mark: true,
				forced: true,
				content: function () {
					trigger.cancel();
				},
				ai: {
					nofire: true,
					nothunder: true,
					nodamage: true,
					effect: {
						target: function (card, player, target, current) {
							if (get.tag(card, "damage")) return "zeroplayertarget";
						},
					},
				},
				intro: {
					content: "防止一切伤害",
				},
			},
			tianwu: {
				trigger: { player: "useCardToBegin" },
				filter: function (event, player) {
					if (get.is.altered("tianwu") && player.hasSkill("tianwu2")) return false;
					return (
						event.targets &&
						event.targets.length == 1 &&
						player.getEnemies().includes(event.target)
					);
				},
				// alter:true,
				frequent: true,
				content: function () {
					trigger.target.getDebuff();
					player.addTempSkill("tianwu2");
				},
			},
			tianwu2: {},
			shiying: {
				trigger: { global: "dieBefore" },
				skillAnimation: "epic",
				animationColor: "water",
				unique: true,
				init: function (player) {
					player.storage.shiying = false;
				},
				mark: true,
				intro: {
					content: "limited",
				},
				check: function (event, player) {
					return get.attitude(player, event.player) >= 3;
				},
				filter: function (event, player) {
					return !player.storage.shiying && event.player != player;
				},
				logTarget: "player",
				content: function () {
					"step 0";
					trigger.cancel();
					player.awakenSkill("shiying");
					player.storage.shiying = true;

					player.maxHp = 3;
					player.hp = 3;
					trigger.player.maxHp = 3;
					trigger.player.hp = 3;

					player.clearSkills();
					trigger.player.clearSkills();
					"step 1";
					var hs = player.getCards("hej");
					player.$throw(hs);
					player.lose(player.getCards("hej"))._triggered = null;
					"step 2";
					var hs = trigger.player.getCards("hej");
					trigger.player.$throw(hs);
					trigger.player.lose(trigger.player.getCards("hej"))._triggered = null;
					"step 3";
					game.asyncDraw([player, trigger.player], 3);
				},
				ai: {
					threaten: 1.5,
				},
			},
			liguang: {
				trigger: { player: "phaseEnd" },
				filter: function (event, player) {
					if (!player.canMoveCard()) return false;
					if (
						!game.hasPlayer(function (current) {
							return current.countCards("ej");
						})
					) {
						return false;
					}
					return player.countCards("h") > 0;
				},
				direct: true,
				content: function () {
					"step 0";
					player
						.chooseToDiscard(
							get.prompt("liguang"),
							"弃置一张手牌并移动场上的一张牌",
							lib.filter.cardDiscardable
						)
						.set("ai", function (card) {
							if (!_status.event.check) return 0;
							return 7 - get.useful(card);
						})
						.set("check", player.canMoveCard(true))
						.set("logSkill", "liguang");
					"step 1";
					if (result.bool) {
						player.moveCard(true);
					} else {
						event.finish();
					}
				},
				ai: {
					expose: 0.2,
					threaten: 1.3,
				},
			},
			xiepan: {
				trigger: { player: "loseEnd" },
				direct: true,
				filter: function (event, player) {
					if (player.countCards("h", { type: "basic" })) return false;
					if (!player.countCards("h")) return false;
					for (var i = 0; i < event.cards.length; i++) {
						if (event.cards[i].original == "h" && get.type(event.cards[i]) == "basic")
							return true;
					}
					return false;
				},
				content: function () {
					"step 0";
					player
						.chooseToDiscard("h", get.prompt("xiepan"))
						.set("prompt2", "弃置一张手牌并获一件随机装备")
						.set("logSkill", "xiepan").ai = function (card) {
						return 8 - get.value(card);
					};
					"step 1";
					if (result.bool) {
						player.gain(game.createCard(get.inpile("equip").randomGet()), "draw");
					}
				},
			},
			yujia: {
				trigger: { player: "useCardAfter" },
				frequent: true,
				filter: function (event) {
					return get.type(event.card) == "equip" && lib.inpile.includes(event.card.name);
				},
				init: function (player) {
					player.storage.yujia = 0;
				},
				content: function () {
					"step 0";
					if (!player.storage.yujia) {
						player.storage.yujia = [];
					}
					var list = [];
					for (var i in lib.card) {
						if (lib.card[i].type == "jiguan") {
							list.push(i);
						}
					}
					if (list.length) {
						if (player.storage.yujia > 1) {
							list = list.randomGets(player.storage.yujia);
							for (var i = 0; i < list.length; i++) {
								list[i] = ["机关", "", list[i]];
							}
							player.chooseButton(true, ["御甲：选择一张机关牌获得之", [list, "vcard"]]).ai =
								function (button) {
									if (
										player.hasSkill("jiguanyaoshu_skill") &&
										button.link[2] == "jiguanyaoshu"
									)
										return 0;
									return get.value({ name: button.link[2] });
								};
						} else {
							var name = list.randomGet();
							player.gain(game.createCard(name), "draw");
							event.finish();
						}
					}
					"step 1";
					if (result.bool && result.links && result.links.length) {
						var list = [];
						for (var i = 0; i < result.links.length; i++) {
							list.push(game.createCard(result.links[i][2]));
						}
						player.gain(list, "draw");
					}
				},
				group: "yujia_count",
				subSkill: {
					count: {
						trigger: { player: "useCardAfter" },
						filter: function (event, player) {
							return get.type(event.card) == "jiguan";
						},
						silent: true,
						content: function () {
							player.storage.yujia++;
						},
					},
				},
				ai: {
					reverseEquip: true,
					threaten: 1.5,
					effect: {
						target_use(card, player, target, current) {
							if (get.type(card) == "equip") return [1, 3];
						},
					},
				},
			},
			yanshi: {
				trigger: { player: "phaseAfter" },
				forced: true,
				skillAnimation: true,
				init: function (player) {
					player.storage.yanshi = 0;
				},
				filter: function (event, player) {
					return player.storage.yanshi == 4;
				},
				intro: {
					content: "累计#个回合使用过机关牌",
				},
				content: function () {
					"step 0";
					player.awakenSkill("yanshi");
					player.gainMaxHp();
					"step 1";
					player.recover();
					var list = [];
					for (var i = 1; i <= 5; i++) {
						if (!player.getEquip(i)) {
							var name = get.inpile("equip" + i).randomGet();
							if (name) {
								var card = game.createCard(name);
								list.push(card);
								player.equip(card);
							}
						}
					}
					if (list.length) {
						player.$draw(list);
					}
				},
				group: "yanshi_count",
				subSkill: {
					count: {
						trigger: { player: "useCardAfter" },
						filter: function (event, player) {
							return get.type(event.card) == "jiguan" && !player.hasSkill("yanshi2");
						},
						silent: true,
						content: function () {
							player.storage.yanshi++;
							if (player.hasSkill("yanshi")) {
								player.markSkill("yanshi");
								player.updateMarks();
							}
							player.addTempSkill("yanshi2");
						},
					},
				},
			},
			yanshi2: {},
			tanhua: {
				trigger: { player: "recoverBefore" },
				forced: true,
				filter: function (event, player) {
					return player.hp > 0 && event.num > 0;
				},
				content: function () {
					trigger.cancel();
					player.draw(2 * trigger.num);
				},
				group: "tanhua_remove",
				subSkill: {
					remove: {
						trigger: { player: "dying" },
						priority: 10,
						forced: true,
						content: function () {
							player.recover();
							player.removeSkill("tanhua");
						},
					},
				},
			},
			xjyingfeng: {
				trigger: { player: "useCardAfter" },
				filter: function (event, player) {
					if (event.card.name != "sha") return false;
					if (event.parent.name == "xjyingfeng") return false;
					var enemies = player.getEnemies();
					return game.hasPlayer(function (current) {
						return (
							enemies.includes(current) &&
							!event.targets.includes(current) &&
							player.canUse("sha", current, false)
						);
					});
				},
				forced: true,
				content: function () {
					var enemies = player.getEnemies();
					enemies.remove(trigger.targets);
					if (enemies.length) {
						player.useCard({ name: "sha" }, enemies.randomGet().addExpose(0.2));
					}
				},
			},
			ywuhun: {
				trigger: { player: "phaseBefore" },
				forced: true,
				// alter:true,
				filter: function (event) {
					return event.parent.name != "ywuhun";
				},
				intro: {
					content: "回合结束后，场上及牌堆中的牌将恢复到回合前的状态",
				},
				video: function (player, data) {
					for (var i in data) {
						var current = game.playerMap[i];
						current.node.handcards1.innerHTML = "";
						current.node.handcards2.innerHTML = "";
						current.node.equips.innerHTML = "";
						current.node.judges.innerHTML = "";
						current.directgain(get.infoCards(data[i].h));
						var es = get.infoCards(data[i].e);
						for (var j = 0; j < es.length; j++) {
							current.$equip(es[j]);
						}
						var js = get.infoCards(data[i].j);
						for (var j = 0; j < js.length; j++) {
							current.node.judges.appendChild(js[j]);
						}
					}
				},
				content: function () {
					"step 0";
					var handcards1, handcards2, judges, equips, viewAs, i, j;
					event.data = [];
					event.cardPile = [];

					for (i = 0; i < game.players.length; i++) {
						viewAs = [];
						handcards1 = [];
						handcards2 = [];
						judges = [];
						equips = [];

						for (j = 0; j < game.players[i].node.handcards1.childNodes.length; j++)
							handcards1.push(game.players[i].node.handcards1.childNodes[j]);

						for (j = 0; j < game.players[i].node.handcards2.childNodes.length; j++)
							handcards2.push(game.players[i].node.handcards2.childNodes[j]);

						for (j = 0; j < game.players[i].node.judges.childNodes.length; j++) {
							viewAs.push(game.players[i].node.judges.childNodes[j].viewAs);
							judges.push(game.players[i].node.judges.childNodes[j]);
						}

						for (j = 0; j < game.players[i].node.equips.childNodes.length; j++)
							equips.push(game.players[i].node.equips.childNodes[j]);

						event.data.push({
							player: game.players[i],
							handcards1: handcards1,
							handcards2: handcards2,
							judges: judges,
							equips: equips,
							viewAs: viewAs,
							value: handcards1.length + handcards2.length + equips.length - judges.length,
						});
					}
					for (var i = 0; i < ui.cardPile.childElementCount; i++) {
						event.cardPile.push(ui.cardPile.childNodes[i]);
					}
					"step 1";
					player.markSkill("ywuhun");
					player.addSkill("ywuhun_end");
					player.phase("ywuhun");
					"step 2";
					player.removeSkill("ywuhun_end");
					game.delay(0.5);
					"step 3";
					game.animate.window(1);
					"step 4";
					player.unmarkSkill("ywuhun");
					var storage = event.data;
					for (var i = 0; i < storage.length; i++) {
						var current = storage[i].player;
						if (current.isAlive()) {
							current.removeEquipTrigger();
							var cards = current.getCards("hej");
							for (var j = 0; j < cards.length; j++) {
								cards[j].discard();
							}
						}
					}
					"step 5";
					var storage = event.data;
					var current;
					var i, j;
					for (i = 0; i < storage.length; i++) {
						current = storage[i].player;
						if (current.isAlive()) {
							for (j = 0; j < storage[i].handcards1.length; j++) {
								if (
									storage[i].handcards1[j].parentNode == ui.discardPile ||
									storage[i].handcards1[j].parentNode == ui.cardPile
								) {
									current.node.handcards1.appendChild(storage[i].handcards1[j]);
								} else {
									current.node.handcards1.appendChild(
										game.createCard(storage[i].handcards1[j])
									);
								}
							}
							for (j = 0; j < storage[i].handcards2.length; j++) {
								if (
									storage[i].handcards2[j].parentNode == ui.discardPile ||
									storage[i].handcards2[j].parentNode == ui.cardPile
								) {
									current.node.handcards2.appendChild(storage[i].handcards2[j]);
								} else {
									current.node.handcards2.appendChild(
										game.createCard(storage[i].handcards2[j])
									);
								}
							}
							for (j = 0; j < storage[i].equips.length; j++) {
								if (
									storage[i].equips[j].parentNode == ui.discardPile ||
									storage[i].equips[j].parentNode == ui.cardPile
								) {
									storage[i].equips[j].style.transform = "";
									current.$equip(storage[i].equips[j]);
								} else {
									current.$equip(game.createCard(storage[i].equips[j]));
								}
							}
							for (j = 0; j < storage[i].judges.length; j++) {
								if (
									storage[i].judges[j].parentNode == ui.discardPile ||
									storage[i].judges[j].parentNode == ui.cardPile
								) {
									storage[i].judges[j].style.transform = "";
									storage[i].judges[j].viewAs = storage[i].viewAs[j];
									if (
										storage[i].judges[j].viewAs &&
										storage[i].judges[j].viewAs != storage[i].judges[j].name &&
										storage[i].judges[j].classList.contains("fullskin")
									) {
										storage[i].judges[j].classList.add("fakejudge");
										storage[i].judges[j].node.background.innerHTML =
											lib.translate[storage[i].judges[j].viewAs + "_bg"] ||
											get.translation(storage[i].judges[j].viewAs)[0];
									}
									current.node.judges.appendChild(storage[i].judges[j]);
								}
							}
							current.update();
						}
					}
					var data = {};
					for (var i = 0; i < game.players.length; i++) {
						data[game.players[i].dataset.position] = {
							h: get.cardsInfo(game.players[i].getCards("h")),
							e: get.cardsInfo(game.players[i].getCards("e")),
							j: get.cardsInfo(game.players[i].getCards("j")),
						};
					}
					game.addVideo("skill", event.player, ["ywuhun", data]);
					game.animate.window(2);
					while (ui.cardPile.childElementCount) {
						ui.cardPile.firstChild.discard();
					}
					for (var i = 0; i < event.cardPile.length; i++) {
						if (event.cardPile[i].parentNode == ui.discardPile) {
							ui.cardPile.appendChild(event.cardPile[i]);
						} else {
							ui.cardPile.appendChild(game.createCard(event.cardPile[i]));
						}
					}
					ui.updatehl();
				},
				subSkill: {
					end: {
						trigger: { source: "damageEnd" },
						priority: 9,
						silent: true,
						content: function () {
							var evt = _status.event.getParent("ywuhun");
							if (evt) {
								_status.event = evt;
								game.resetSkills();
							}
						},
						ai: {
							jueqing: true,
						},
					},
				},
			},
			fenglue: {
				trigger: { player: "phaseUseBefore" },
				direct: true,
				filter: function (event, player) {
					var hs = player.getCards("h");
					return game.hasPlayer(function (current) {
						if (current != player) {
							for (var i = 0; i < hs.length; i++) {
								if (get.info(hs[i]).multitarget) continue;
								if (lib.filter.targetEnabled2(hs[i], player, current)) {
									return true;
								}
							}
						}
					});
				},
				content: function () {
					"step 0";
					var hs = player.getCards("h");
					player.chooseTarget(get.prompt("fenglue"), function (card, player, target) {
						if (player == target) return false;
						for (var i = 0; i < hs.length; i++) {
							if (get.info(hs[i]).multitarget) continue;
							if (lib.filter.targetEnabled2(hs[i], player, target)) {
								return true;
							}
						}
						return false;
					}).ai = function (target) {
						var use = [],
							eff = 0,
							damaged = false;
						for (var i = 0; i < hs.length; i++) {
							if (get.info(hs[i]).multitarget) continue;
							var hef;
							if (get.tag(hs[i], "damage") && damaged) {
								hef = -1;
							} else {
								hef = get.effect(target, hs[i], player, player);
							}
							if (lib.filter.targetEnabled2(hs[i], player, target) && hef > 0) {
								use.push(hs[i]);
								if (get.attitude(player, target) > 0) {
									hef /= 1.5;
									if (get.tag(hs[i], "damage")) {
										damaged = true;
									}
								}
								eff += hef;
							}
						}
						if (
							!player.needsToDiscard(0, (i, player) => {
								return !use.includes(i) && !player.canIgnoreHandcard(i);
							})
						)
							return eff;
						return 0;
					};
					"step 1";
					if (result.bool) {
						event.target = result.targets[0];
						var num = 0;
						player.chooseCard(
							[1, Infinity],
							"按顺序选择对" + get.translation(result.targets) + "使用的牌",
							function (card) {
								return lib.filter.targetEnabled2(card, player, event.target);
							}
						).ai = function (card) {
							if (get.effect(event.target, card, player, player) > 0) {
								if (get.attitude(player, event.target) > 0 && get.tag(card, "damage")) {
									for (var i = 0; i < ui.selected.cards.length; i++) {
										if (get.tag(ui.selected.cards[i], "damage")) {
											return 0;
										}
									}
								}
								return get.order(card);
							}
							return 0;
						};
					} else {
						event.finish();
					}
					"step 2";
					if (result.bool) {
						player.logSkill("fenglue", event.target);
						player.addSkill("fenglue_draw");
						player.storage.fenglue_draw_num = 0;
						player.storage.fenglue_draw = event.target;
						trigger.cancel();
						event.cards = result.cards.slice(0);
						player.lose(event.cards, ui.special);
					} else {
						event.finish();
					}
					"step 3";
					if (event.cards.length) {
						if (event.target.isIn()) {
							player.useCard(event.cards.shift(), event.target);
						} else {
							event.cards.shift().discard();
						}
						event.redo();
					}
					"step 4";
					if (player.storage.fenglue_draw_num) {
						player.draw(player.storage.fenglue_draw_num);
					}
					player.removeSkill("fenglue_draw");
					delete player.storage.fenglue_draw;
					delete player.storage.fenglue_draw_num;
				},
				subSkill: {
					draw: {
						trigger: { global: "damageEnd" },
						forced: true,
						popup: false,
						filter: function (event, player) {
							return event.player == player.storage.fenglue_draw;
						},
						content: function () {
							player.storage.fenglue_draw_num++;
						},
					},
				},
				ai: {
					threaten: 1.3,
				},
			},
			xjzongyu: {
				enable: "phaseUse",
				usable: 1,
				filterCard: { color: "black" },
				filter: function (event, player) {
					return lib.card.feibiao && player.countCards("he", { color: "black" });
				},
				check: function (card) {
					return 8 - get.value(card);
				},
				content: function () {
					var list = player.getEnemies();
					if (list.length) {
						player.useCard({ name: "feibiao" }, list.randomGets(2));
					}
				},
				ai: {
					threaten: 1.5,
					order: 6,
					result: {
						player: 1,
					},
				},
			},
			fanling: {
				trigger: { global: "loseHpAfter" },
				forced: true,
				usable: 1,
				filter: function (event, player) {
					return event.player != player && player.isDamaged();
				},
				content: function () {
					player.recover();
				},
				ai: {
					threaten: 1.5,
				},
			},
			dujiang: {
				enable: "phaseUse",
				usable: 1,
				position: "he",
				filterCard: { color: "black" },
				check: function (card) {
					return 6 - get.value(card);
				},
				content: function () {
					var list = player.getEnemies();
					if (list.length) {
						var target = list.randomGet();
						player.line(target, "green");
						target.gain(game.createCard("du"), "gain2");
					}
				},
				ai: {
					order: 1,
					result: {
						player: 1,
					},
					threaten: 1.5,
				},
			},
			sheying: {
				trigger: { source: "damageAfter" },
				filter: function (event, player) {
					return get.itemtype(event.cards) == "cards" && get.position(event.cards[0]) == "d";
				},
				usable: 1,
				prompt2: function (event) {
					return "进行一次判定，若结果为黑色，你获得" + get.translation(event.cards);
				},
				content: function () {
					"step 0";
					player.judge(function (card) {
						return get.color(card) == "black" ? 1 : -1;
					});
					"step 1";
					if (result.color == "black") {
						player.gain(trigger.cards);
						player.$gain2(trigger.cards);
					}
				},
			},
			huahu: {
				enable: "phaseUse",
				unique: true,
				mark: true,
				skillAnimation: true,
				animationColor: "metal",
				init: function (player) {
					player.storage.huahu = false;
				},
				filter: function (event, player) {
					if (player.storage.huahu) return false;
					return true;
				},
				filterTarget: function (card, player, target) {
					return target != player;
				},
				selectTarget: [1, Infinity],
				contentBefore: function () {
					player.awakenSkill("huahu");
					player.storage.huahu = true;
					player.loseMaxHp(true);
					player.clearSkills();
				},
				content: function () {
					target.recover();
					target.changeHujia();
					target.draw(false);
					target.$draw();
				},
				ai: {
					order: 1,
					result: {
						target: function (player, target) {
							if (player.hasUnknown()) return 0;
							var num = 0;
							var players = game.filterPlayer();
							for (var i = 0; i < players.length; i++) {
								if (
									get.attitude(player, players[i]) > 2 &&
									get.recoverEffect(players[i], player, player) > 0
								) {
									if (players[i].hp == 1) {
										if (player.hp < player.maxHp) {
											return 1;
										} else {
											num += 2;
										}
									} else if (players[i].hp <= 2) {
										num++;
									}
								}
							}
							if (num >= 3) return 1;
							return 0;
						},
					},
				},
				intro: {
					content: "limited",
				},
			},
			binxin: {
				trigger: { global: "phaseEnd" },
				check: function (event, player) {
					return get.attitude(player, event.player) > 0;
				},
				filter: function (event, player) {
					return event.player.hp == 1;
				},
				logTarget: "player",
				content: function () {
					trigger.player.changeHujia();
				},
				ai: {
					expose: 0.1,
				},
			},
			qixia: {
				trigger: { player: ["useCardAfter", "respondAfter"] },
				silent: true,
				init: function (player) {
					player.storage.qixia = [];
				},
				// mark:true,
				intro: {
					content: function (storage) {
						if (!storage.length) {
							return "未使用或打出过有花色的牌";
						} else {
							var str = "已使用过" + get.translation(storage[0] + "2");
							for (var i = 1; i < storage.length; i++) {
								str += "、" + get.translation(storage[i] + "2");
							}
							str += "牌";
							return str;
						}
					},
				},
				content: function () {
					var suit = get.suit(trigger.card);
					if (suit) {
						player.storage.qixia.add(suit);
						player.syncStorage("qixia");
						player.markSkill("qixia");
					}
				},
				group: "qixia_phase",
				subSkill: {
					phase: {
						trigger: { global: "phaseAfter" },
						priority: -50,
						forced: true,
						filter: function (event, player) {
							return player.storage.qixia.length >= 4;
						},
						content: function () {
							player.insertPhase();
							player.storage.qixia.length = 0;
							player.syncStorage("qixia");
							player.unmarkSkill("qixia");
						},
					},
				},
			},
			qixia2: {},
			jianzhen: {
				trigger: { player: "shaAfter" },
				forced: true,
				filter: function (event, player) {
					return (
						event.target.isIn() &&
						game.hasPlayer(function (current) {
							return current.canUse("sha", event.target, false) && current != player;
						})
					);
				},
				content: function () {
					"step 0";
					event.targets = game.filterPlayer(function (current) {
						return current.canUse("sha", trigger.target, false) && current != player;
					});
					event.targets.sortBySeat(trigger.player);
					"step 1";
					if (event.targets.length) {
						event.current = event.targets.shift();
						if (event.current.hasSha()) {
							event.current.chooseToUse(
								{ name: "sha" },
								"是否对" + get.translation(trigger.target) + "使用一张杀？",
								trigger.target,
								-1
							);
						} else {
							event.redo();
						}
					} else {
						event.finish();
					}
					"step 2";
					if (!result.bool) {
						event.goto(1);
					}
				},
				ai: {
					expose: 0.2,
					threaten: 1.4,
				},
			},
			husha: {
				trigger: { player: "phaseEnd" },
				direct: true,
				filter: function (event, player) {
					if (player.storage.husha == 1) {
						return game.hasPlayer(function (current) {
							return player.canUse("sha", current, false);
						});
					} else {
						return player.storage.husha > 0;
					}
				},
				content: function () {
					"step 0";
					var list = [];
					if (
						game.hasPlayer(function (current) {
							return player.canUse("sha", current, false);
						})
					) {
						list.push("移去1枚虎煞标记，视为使用一张杀");
					}
					if (player.storage.husha > 1) {
						list.push("移去2枚虎煞标记，视为使用一张南蛮入侵");
						if (player.storage.husha > 2) {
							list.push("移去3枚虎煞标记，视为对除你之外的角色使用一张元素毁灭");
						}
					}
					player
						.chooseControl("cancel2", function () {
							if (player.storage.husha > 2) {
								var num1 = game.countPlayer(function (current) {
									if (current != player && player.canUse("yuansuhuimie", current)) {
										return get.sgn(
											get.effect(current, { name: "yuansuhuimie" }, player, player)
										);
									}
								});
								var num2 = game.countPlayer(function (current) {
									if (current != player && player.canUse("yuansuhuimie", current)) {
										return get.effect(current, { name: "yuansuhuimie" }, player, player);
									}
								});
								if (num1 > 0 && num2 > 0) return "选项三";
							}
							if (player.storage.husha > 1) {
								var num = game.countPlayer(function (current) {
									if (current != player && player.canUse("nanman", current)) {
										return get.sgn(
											get.effect(current, { name: "nanman" }, player, player)
										);
									}
								});
								if (num > 0) return "选项二";
							}
							if (
								game.hasPlayer(function (current) {
									return (
										player.canUse("sha", current, false) &&
										get.effect(current, { name: "sha" }, player, player) > 0
									);
								})
							) {
								return "选项一";
							}
							return "cancel2";
						})
						.set("prompt", get.prompt("husha"))
						.set("choiceList", list);
					"step 1";
					if (result.control != "cancel2") {
						player.logSkill("husha");
						if (result.control == "选项一") {
							event.sha = true;
							player.storage.husha--;
							player.chooseTarget("选择出杀的目标", true, function (card, player, target) {
								return player.canUse("sha", target, false);
							}).ai = function (target) {
								return get.effect(target, { name: "sha" }, player, player);
							};
						} else if (result.control == "选项二") {
							var list = game.filterPlayer(function (current) {
								return player.canUse("nanman", current);
							});
							player.storage.husha -= 2;
							list.sortBySeat();
							player.useCard({ name: "nanman" }, list);
						} else {
							var list = game.filterPlayer(function (current) {
								return player.canUse("yuansuhuimie", current);
							});
							player.storage.husha -= 3;
							list.remove(player);
							list.sortBySeat();
							player.useCard({ name: "yuansuhuimie" }, list);
						}
						if (!player.storage.husha) {
							player.unmarkSkill("husha");
						} else {
							player.syncStorage("husha");
							player.updateMarks();
						}
					}
					"step 2";
					if (event.sha && result.targets && result.targets.length) {
						player.useCard({ name: "sha" }, result.targets[0]);
					}
				},
				init: function (player) {
					player.storage.husha = 0;
				},
				intro: {
					content: "mark",
				},
				group: "husha_count",
				subSkill: {
					count: {
						trigger: { source: "damageEnd" },
						forced: true,
						filter: function (event, player) {
							if (player.storage.husha < 3) {
								var evt = event.getParent("phaseUse");
								return evt && evt.player == player;
							}
							return false;
						},
						content: function () {
							player.storage.husha += trigger.num;
							if (player.storage.husha > 3) {
								player.storage.husha = 3;
							}
							player.markSkill("husha");
							player.syncStorage("husha");
							player.updateMarks();
						},
					},
				},
			},
			fenshi: {
				unique: true,
				skillAnimation: true,
				animationColor: "fire",
				trigger: { player: "dyingAfter" },
				forced: true,
				mark: true,
				derivation: "longhuo",
				intro: {
					content: "limited",
				},
				content: function () {
					player.awakenSkill("fenshi");
					player.changeHujia(2);
					player.draw(2);
					player.addSkill("longhuo");
				},
			},
			longhuo: {
				unique: true,
				trigger: { player: "phaseEnd" },
				check: function (event, player) {
					if (player.hp == 1 && player.hujia == 0) return false;
					var num = game.countPlayer(function (current) {
						var eff = get.sgn(get.damageEffect(current, player, player, "fire"));
						if (current.hp == 1 && current.hujia == 0) eff *= 1.5;
						return eff;
					});
					return num > 0;
				},
				content: function () {
					"step 0";
					event.targets = get.players(lib.sort.seat);
					"step 1";
					if (event.targets.length) {
						var current = event.targets.shift();
						if (current.isIn()) {
							player.line(current, "fire");
							current.damage("fire");
							event.redo();
						}
					}
				},
			},
			yanzhan: {
				enable: "phaseUse",
				viewAs: { name: "sha", nature: "fire" },
				usable: 1,
				position: "he",
				viewAsFilter: function (player) {
					if (!player.countCards("he", { color: "red" })) return false;
				},
				filterCard: { color: "red" },
				check: function (card) {
					if (get.suit(card) == "heart") return 7 - get.value(card);
					return 5 - get.value(card);
				},
				onuse: function (result) {
					if (result.targets) {
						for (var i = 0; i < result.targets.length; i++) {
							result.targets[i].addTempSkill("yanzhan3");
						}
					}
				},
				group: "yanzhan2",
				ai: {
					order: function () {
						return get.order({ name: "sha" }) + 0.15;
					},
				},
			},
			yanzhan2: {
				trigger: { source: "damageEnd" },
				forced: true,
				popup: false,
				filter: function (event) {
					return event.parent.skill == "yanzhan";
				},
				content: function () {
					player.addTempSkill("yanzhan4");
				},
			},
			yanzhan3: {
				mod: {
					cardRespondable: function (card, player) {
						if (
							_status.event.parent.skill == "yanzhan" &&
							get.suit(card) != get.suit(_status.event.parent.cards[0])
						)
							return false;
					},
				},
			},
			yanzhan4: {
				mod: {
					cardUsable: function (card, player, num) {
						if (card.name == "sha") return num + 1;
					},
				},
			},
			xjyufeng: {
				trigger: { player: "loseEnd" },
				forced: true,
				usable: 2,
				filter: function (event, player) {
					for (var i = 0; i < event.cards.length; i++) {
						if (event.cards[i].original == "h") return player.countCards("h") < 2;
					}
					return false;
				},
				content: function () {
					player.draw(2 - player.countCards("h"));
				},
				ai: {
					noh: true,
					skillTagFilter: function (player, tag) {
						var nh = player.countCards("h");
						if (tag == "noh" && (nh > 2 || nh == 0)) {
							return false;
						}
					},
				},
			},
			feixia: {
				enable: "phaseUse",
				usable: 1,
				filterCard: { color: "red" },
				position: "he",
				filter: function (event, player) {
					return player.countCards("he", { color: "red" }) > 0;
				},
				check: function (card) {
					return 7 - get.value(card);
				},
				content: function () {
					var targets = player.getEnemies();
					if (targets.length) {
						var target = targets.randomGet();
						target.addExpose(0.2);
						player.useCard({ name: "sha" }, target, false);
					}
				},
				ai: {
					order: 2.9,
					result: {
						player: 1,
					},
				},
			},
			lueying: {
				trigger: { player: "shaBegin" },
				filter: function (event, player) {
					if (event.target.countCards("he") > 0) {
						return game.hasPlayer(function (current) {
							return current != player && current != event.target && current.countCards("he");
						});
					}
					return false;
				},
				logTarget: "target",
				usable: 1,
				content: function () {
					"step 0";
					var card = trigger.target.getCards("he").randomGet();
					player.gain(card, trigger.target);
					if (get.position(card) == "e") {
						trigger.target.$give(card, player);
					} else {
						trigger.target.$giveAuto(card, player);
					}
					"step 1";
					if (
						game.hasPlayer(function (current) {
							return current != player && current != trigger.target && current.countCards("he");
						})
					) {
						trigger.target.chooseTarget(function (card, player, target) {
							return (
								target != player &&
								target != _status.event.parent.player &&
								target.countCards("he") > 0
							);
						}, "选择一名角色并令" + get.translation(player) + "弃置其一张牌").ai = function (
							target
						) {
							return -get.attitude(_status.event.player, target);
						};
					} else {
						event.finish();
					}
					"step 2";
					if (result.bool) {
						trigger.target.line(result.targets[0], "green");
						player.discardPlayerCard(result.targets[0], true, "he");
					}
				},
				ai: {
					threaten: 1.5,
					expose: 0.2,
				},
			},
			tianjian: {
				enable: "phaseUse",
				viewAs: { name: "wanjian" },
				filterCard: { name: "sha" },
				filter: function (event, player) {
					return player.countCards("h", "sha") > 0;
				},
				// alter:true,
				usable: 1,
				group: "tianjian_discard",
				subSkill: {
					discard: {
						trigger: { source: "damageEnd" },
						forced: true,
						filter: function (event) {
							if (event._notrigger.includes(event.player)) return false;
							if (get.is.altered("tianjian")) return false;
							return event.parent.skill == "tianjian" && event.player.countCards("he");
						},
						popup: false,
						content: function () {
							trigger.player.discard(trigger.player.getCards("he").randomGet());
						},
					},
				},
			},
			feng: {
				unique: true,
				init: function (player) {
					player.storage.feng = 0;
				},
				mark: true,
				intro: {
					content: "已累计摸#次牌",
				},
				trigger: { player: "drawBegin" },
				forced: true,
				popup: false,
				priority: 5,
				content: function () {
					if (player.storage.feng < 2) {
						player.storage.feng++;
					} else {
						trigger.num++;
						player.storage.feng = 0;
						player.logSkill("feng");
					}
					player.updateMarks();
				},
			},
			ya: {
				unique: true,
				init: function (player) {
					player.storage.ya = 0;
				},
				mark: true,
				intro: {
					content: "已累计受到#次伤害",
				},
				trigger: { player: "damageBegin" },
				filter: function (event, player) {
					if (player.storage.ya == 2) return event.num > 0;
					return true;
				},
				forced: true,
				popup: false,
				content: function () {
					if (player.storage.ya < 2) {
						player.storage.ya++;
					} else if (trigger.num > 0) {
						trigger.num--;
						player.storage.ya = 0;
						player.logSkill("ya");
					}
					player.updateMarks();
				},
			},
			song: {
				unique: true,
				init: function (player) {
					player.storage.song = 0;
				},
				mark: true,
				intro: {
					content: "已累计造成#次伤害",
				},
				trigger: { source: "damageBegin" },
				forced: true,
				popup: false,
				content: function () {
					if (player.storage.song < 2) {
						player.storage.song++;
					} else {
						trigger.num++;
						player.storage.song = 0;
						player.logSkill("song");
					}
					player.updateMarks();
				},
			},
			longxiang: {
				trigger: { player: "shaBegin" },
				filter: function (event, player) {
					return event.target.countCards("h") > player.countCards("h");
				},
				check: function (event, player) {
					return get.attitude(player, event.target) < 0;
				},
				logTarget: "target",
				content: function () {
					var hs = trigger.target.getCards("h");
					trigger.target.discard(hs.randomGets(hs.length - player.countCards("h")));
				},
			},
			huxi: {
				enable: "chooseToUse",
				viewAs: { name: "sha" },
				precontent: function () {
					"step 0";
					player.loseHp();
					"step 1";
					player.changeHujia();
				},
				filterCard: function () {
					return false;
				},
				selectCard: -1,
				prompt: "失去1点体力并获得1点护甲，视为使用一张杀",
				ai: {
					order: function () {
						var player = _status.event.player;
						if (player.hp <= 2) return 0;
						return 2;
					},
					skillTagFilter: function (player, tag, arg) {
						if (arg != "use") return false;
					},
					respondSha: true,
				},
			},
			xuanmo: {
				enable: "phaseUse",
				usable: 1,
				filterCard: function (card) {
					var type = get.type(card, "trick");
					return type == "basic" || type == "equip" || type == "trick";
				},
				check: function (card) {
					return 8 - get.value(card);
				},
				filter: function (event, player) {
					return player.countCards("h") > 0;
				},
				discard: false,
				prepare: "throw",
				content: function () {
					game.log(player, "将", cards, "置于牌堆顶");
					ui.cardPile.insertBefore(cards[0], ui.cardPile.firstChild);
					var list = get.inpile(get.type(cards[0], "trick"), "trick").randomGets(2);
					for (var i = 0; i < list.length; i++) {
						list[i] = game.createCard(list[i]);
					}
					player.gain(list, "draw");
				},
				ai: {
					threaten: 1.5,
					order: 5,
					result: {
						player: 1,
					},
				},
			},
			danqing: {
				trigger: { player: "phaseEnd" },
				init: function (player) {
					player.storage.danqing = [];
				},
				mark: true,
				direct: true,
				intro: {
					content: function (storage) {
						if (!storage.length) {
							return "未使用或打出过有花色的牌";
						} else {
							var str = "已使用过" + get.translation(storage[0] + "2");
							for (var i = 1; i < storage.length; i++) {
								str += "、" + get.translation(storage[i] + "2");
							}
							str += "牌";
							return str;
						}
					},
				},
				filter: function (event, player) {
					return player.storage.danqing.length == 4;
				},
				ai: {
					threaten: 1.2,
				},
				// alter:true,
				content: function () {
					"step 0";
					player.storage.danqing.length = 0;
					player.updateMarks();
					player.chooseTarget(get.prompt("danqing"), [1, get.is.altered("danqing") ? 2 : 4]).ai =
						function (target) {
							return get.attitude(player, target);
						};
					"step 1";
					if (result.bool) {
						player.logSkill("danqing", result.targets);
						for (var i = 0; i < result.targets.length; i++) {
							result.targets[i].getBuff(false);
						}
					} else {
						event.finish();
					}
					"step 2";
					game.delay();
				},
				group: "danqing_count",
			},
			danqing_count: {
				trigger: { player: "useCard" },
				silent: true,
				content: function () {
					var suit = get.suit(trigger.card);
					if (suit) {
						player.storage.danqing.add(suit);
						player.updateMarks();
					}
				},
			},
			sheling: {
				trigger: { global: ["useCardAfter", "respondAfter", "discardAfter"] },
				filter: function (event, player) {
					if (player != _status.currentPhase || player == event.player) return false;
					if (event.cards) {
						for (var i = 0; i < event.cards.length; i++) {
							if (get.position(event.cards[i]) == "d") return true;
						}
					}
					return false;
				},
				frequent: "check",
				check: function (event) {
					for (var i = 0; i < event.cards.length; i++) {
						if (get.position(event.cards[i]) == "d" && event.cards[i].name == "du") return false;
					}
					return true;
				},
				usable: 3,
				content: function () {
					var cards = [];
					for (var i = 0; i < trigger.cards.length; i++) {
						if (get.position(trigger.cards[i]) == "d") {
							cards.push(trigger.cards[i]);
						}
					}
					player.gain(cards, "gain2");
				},
			},
			zhaoyao: {
				trigger: { global: "phaseDrawBegin" },
				filter: function (event, player) {
					return (
						event.player != player &&
						event.player.countCards("h") > 0 &&
						player.countCards("h") > 0
					);
				},
				check: function (event, player) {
					if (player.isUnseen()) return false;
					if (get.attitude(player, event.player) >= 0) return false;
					var hs = player.getCards("h");
					if (hs.length < event.player.countCards("h")) return false;
					for (var i = 0; i < hs.length; i++) {
						var val = get.value(hs[0]);
						if (hs[i].number >= 10 && val <= 6) return true;
						if (hs[i].number >= 8 && val <= 3) return true;
					}
					return false;
				},
				logTarget: "player",
				content: function () {
					"step 0";
					player.chooseToCompare(trigger.player);
					"step 1";
					if (result.bool) {
						player.draw(2);
					} else {
						event.finish();
					}
					"step 2";
					player.chooseCard("将两张牌置于牌堆顶（先选择的在上）", 2, "he", true);
					"step 3";
					if (result.bool) {
						player.lose(result.cards, ui.special);
						event.cards = result.cards;
					} else {
						event.finish();
					}
					"step 4";
					game.delay();
					var nodes = [];
					for (var i = 0; i < event.cards.length; i++) {
						var cardx = ui.create.card();
						cardx.classList.add("infohidden");
						cardx.classList.add("infoflip");
						nodes.push(cardx);
					}
					player.$throw(nodes, 700, "nobroadcast");
					game.log(player, "将" + get.cnNumber(event.cards.length) + "张牌置于牌堆顶");
					"step 5";
					for (var i = event.cards.length - 1; i >= 0; i--) {
						ui.cardPile.insertBefore(event.cards[i], ui.cardPile.firstChild);
					}
				},
				ai: {
					mingzhi: false,
					expose: 0.2,
				},
			},
			zhangmu: {
				trigger: { player: ["chooseToRespondBegin", "chooseToUseBegin"] },
				filter: function (event, player) {
					if (event.responded) return false;
					if (!event.filterCard({ name: "shan" }, player, event)) return false;
					return player.countCards("h", "shan") > 0;
				},
				direct: true,
				usable: 1,
				content: function () {
					"step 0";
					var goon = get.damageEffect(player, trigger.player, player) <= 0;
					player.chooseCard(get.prompt("zhangmu"), { name: "shan" }).ai = function () {
						return goon ? 1 : 0;
					};
					"step 1";
					if (result.bool) {
						player.logSkill("zhangmu");
						player.showCards(result.cards);
						trigger.untrigger();
						trigger.responded = true;
						trigger.result = { bool: true, card: { name: "shan" } };
						player.addSkill("zhangmu_ai");
					} else {
						player.storage.counttrigger.zhangmu--;
					}
				},
				ai: {
					respondShan: true,
					effect: {
						target: function (card, player, target, effect) {
							if (get.tag(card, "respondShan") && effect < 0) {
								if (target.hasSkill("zhangmu_ai")) return 0;
								if (target.countCards("h") >= 2) return 0.5;
							}
						},
					},
				},
			},
			zhangmu_ai: {
				trigger: { player: "loseAfter" },
				silent: true,
				filter: function (event, player) {
					return player.countCards("h", "shan") == 0;
				},
				content: function () {
					player.removeSkill("zhangmu_ai");
				},
			},
			leiyu: {
				trigger: { player: "phaseEnd" },
				direct: true,
				filter: function (event, player) {
					if (!player.countCards("h", { color: "black" })) return false;
					if (player.storage.leiyu) {
						for (var i = 0; i < player.storage.leiyu.length; i++) {
							if (player.storage.leiyu[i].isAlive()) return true;
						}
					}
					return false;
				},
				content: function () {
					"step 0";
					for (var i = 0; i < player.storage.leiyu.length; i++) {
						if (player.storage.leiyu[i].isDead()) {
							player.storage.leiyu.splice(i--, 1);
						}
					}
					var num = 0;
					var num2 = 0;
					for (var i = 0; i < player.storage.leiyu.length; i++) {
						if (!player.storage.leiyu[i].isIn()) continue;
						var eff = get.effect(
							player.storage.leiyu[i],
							{ name: "jingleishan", nature: "thunder" },
							player,
							player
						);
						num += eff;
						if (eff > 0) {
							num2++;
						} else if (eff < 0) {
							num2--;
						}
					}
					var next = player.chooseToDiscard(get.prompt("leiyu", player.storage.leiyu), {
						color: "black",
					});
					next.ai = function (card) {
						if (num > 0 && num2 >= 2) {
							return 7 - get.value(card);
						}
						return 0;
					};
					next.logSkill = ["leiyu", player.storage.leiyu];
					"step 1";
					if (result.bool) {
						player.storage.leiyu.sort(lib.sort.seat);
						player.useCard(
							{ name: "jingleishan", nature: "thunder" },
							player.storage.leiyu
						).animate = false;
					}
				},
				group: ["leiyu2", "leiyu4"],
				ai: {
					threaten: 1.3,
				},
			},
			leiyu2: {
				trigger: { player: "phaseUseBegin" },
				silent: true,
				content: function () {
					player.storage.leiyu = [];
				},
			},
			leiyu3: {
				trigger: { source: "dieAfter" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return player.storage.leiyu2 ? true : false;
				},
				content: function () {
					player.recover();
					delete player.storage.leiyu2;
				},
			},
			leiyu4: {
				trigger: { player: "useCardToBegin" },
				silent: true,
				filter: function (event, player) {
					return (
						_status.currentPhase == player &&
						Array.isArray(player.storage.leiyu) &&
						event.target &&
						event.target != player
					);
				},
				content: function () {
					player.storage.leiyu.add(trigger.target);
				},
			},
			feizhua: {
				trigger: { player: "useCard" },
				filter: function (event, player) {
					if (event.card.name != "sha") return false;
					if (event.targets.length != 1) return false;
					var target = event.targets[0];
					var players = game.filterPlayer(function (current) {
						return get.distance(target, current, "pure") == 1;
					});
					for (var i = 0; i < players.length; i++) {
						if (
							player != players[i] &&
							target != players[i] &&
							player.canUse("sha", players[i], false)
						) {
							return true;
						}
					}
					return false;
				},
				prompt: function (event, player) {
					var targets = [];
					var target = event.targets[0];
					var players = game.filterPlayer(function (current) {
						return get.distance(target, current, "pure") == 1;
					});
					for (var i = 0; i < players.length; i++) {
						if (
							player != players[i] &&
							target != players[i] &&
							player.canUse("sha", players[i], false)
						) {
							targets.push(players[i]);
						}
					}
					return get.prompt("feizhua", targets);
				},
				check: function (event, player) {
					var target = event.targets[0];
					var num = 0;
					var players = game.filterPlayer(function (current) {
						return get.distance(target, current, "pure") == 1;
					});
					for (var i = 0; i < players.length; i++) {
						if (
							player != players[i] &&
							target != players[i] &&
							player.canUse("sha", players[i], false)
						) {
							num += get.effect(players[i], { name: "sha" }, player, player);
						}
					}
					return num > 0;
				},
				content: function () {
					"step 0";
					var target = trigger.targets[0];
					var players = game.filterPlayer(function (current) {
						return get.distance(target, current, "pure") == 1;
					});
					for (var i = 0; i < players.length; i++) {
						if (
							player != players[i] &&
							target != players[i] &&
							player.canUse("sha", players[i], false)
						) {
							trigger.targets.push(players[i]);
							player.line(players[i], "green");
						}
					}
				},
			},
			lingxue: {
				trigger: { player: "recoverEnd" },
				forced: true,
				content: function () {
					player.changeHujia();
				},
			},
			diesha: {
				trigger: { source: "damageEnd" },
				forced: true,
				filter: function (event) {
					if (event._notrigger.includes(event.player)) return false;
					return event.player.isAlive() && event.card && event.card.name == "sha";
				},
				content: function () {
					trigger.player.loseHp();
					player.recover();
				},
				ai: {
					threaten: 1.5,
				},
			},
			guijiang: {
				enable: "phaseUse",
				usable: 1,
				filterTarget: function (card, player, target) {
					return target != player && !target.hasSkill("guijiang2");
				},
				filterCard: { color: "black" },
				filter: function (event, player) {
					return player.countCards("h", { color: "black" });
				},
				check: function (card) {
					return 5 - get.value(card);
				},
				content: function () {
					target.addSkill("guijiang2");
					target.storage.guijiang2 = player;
				},
				ai: {
					order: 4,
					threaten: 1.2,
					expose: 0.2,
					result: {
						target: function (player, target) {
							if (target.hp == 1) return -1;
							if (target.hp == 2) return -0.5;
							return 0;
						},
					},
				},
			},
			guijiang2: {
				mark: true,
				intro: {
					content: "不能成为回复牌的目标",
				},
				trigger: { global: ["dieBegin", "phaseBegin"] },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return event.player == player.storage.guijiang2;
				},
				content: function () {
					player.removeSkill("guijiang2");
				},
				mod: {
					targetEnabled: function (card) {
						if (get.tag(card, "recover")) return false;
					},
				},
				global: "guijiang3",
			},
			guijiang3: {
				mod: {
					cardSavable: function (card, player) {
						if (_status.event.dying && _status.event.dying.hasSkill("guijiang2")) return false;
					},
				},
			},
			fenxing: {
				trigger: { player: "phaseBegin" },
				forced: true,
				unique: true,
				forceunique: true,
				filter: function (event, player) {
					return Math.random() < 0.5 && [player.name1, player.name2].includes("pal_longkui");
				},
				derivation: ["diesha", "guijiang"],
				content: function () {
					if (player.storage.fenxing) {
						player.storage.fenxing = false;
						player.removeSkill("guijiang");
						player.removeSkill("diesha");
						player.addSkill("diewu");
						player.addSkill("lingyu");
						player.setAvatar("pal_longkui", "pal_longkui");
					} else {
						player.storage.fenxing = true;
						player.removeSkill("diewu");
						player.removeSkill("lingyu");
						player.addSkill("guijiang");
						player.addSkill("diesha");
						player.setAvatar("pal_longkui", "pal_longkuigui");
					}
				},
			},
			diewu: {
				enable: "phaseUse",
				filter: function (event, player) {
					return player.countCards("h", "sha") > 0;
				},
				filterCard: { name: "sha" },
				filterTarget: function (card, player, target) {
					return target != player;
				},
				prepare: "give",
				discard: false,
				content: function () {
					target.gain(cards, player);
					if (!player.hasSkill("diewu2")) {
						player.draw();
						player.addTempSkill("diewu2");
					}
				},
				ai: {
					order: 2,
					expose: 0.2,
					result: {
						target: function (player, target) {
							if (!player.hasSkill("diewu2")) return 1;
							return 0;
						},
					},
				},
			},
			diewu2: {},
			lingyu: {
				trigger: { player: "phaseEnd" },
				direct: true,
				filter: function (event, player) {
					return game.hasPlayer(function (current) {
						return current != player && current.isDamaged();
					});
				},
				content: function () {
					"step 0";
					player.chooseTarget("灵愈：令一名其他角色回复1点体力", function (card, player, target) {
						return target != player && target.hp < target.maxHp;
					}).ai = function (target) {
						return get.recoverEffect(target, player, player);
					};
					"step 1";
					if (result.bool) {
						player.logSkill("lingyu", result.targets[0]);
						result.targets[0].recover();
					}
				},
				ai: {
					threaten: 1.5,
					expose: 0.2,
				},
			},
			duxinshu: {
				enable: "phaseUse",
				usable: 1,
				filterTarget: function (card, player, target) {
					return target != player && target.countCards("h");
				},
				content: function () {
					"step 0";
					if (player.countCards("h")) {
						player.chooseCardButton("读心", target.getCards("h")).ai = function (button) {
							return get.value(button.link) - 5;
						};
					} else {
						player.viewHandcards(target);
						event.finish();
					}
					"step 1";
					if (result.bool) {
						event.card = result.links[[0]];
						player.chooseCard("h", true, "用一张手牌替换" + get.translation(event.card)).ai =
							function (card) {
								return -get.value(card);
							};
					} else {
						event.finish();
					}
					"step 2";
					if (result.bool) {
						player.gain(event.card, target);
						target.gain(result.cards, player);
						player.$giveAuto(result.cards, target);
						target.$giveAuto(event.card, player);
						game.log(player, "与", target, "交换了一张手牌");
					}
				},
				ai: {
					threaten: 1.3,
					result: {
						target: function (player, target) {
							return -target.countCards("h");
						},
					},
					order: 10,
					expose: 0.2,
				},
			},
			feixu: {
				trigger: { global: ["useCard", "respond"] },
				filter: function (event, player) {
					return event.card && event.card.name == "shan";
				},
				check: function (event, player) {
					return get.attitude(player, event.player) > 0;
				},
				logTarget: "player",
				content: function () {
					trigger.player.draw();
				},
				ai: {
					mingzhi: false,
					threaten: 2,
					expose: 0.2,
				},
			},
			xuanyan: {
				// trigger:{source:'damageBefore'},
				// forced:true,
				// priority:5,
				// check:function(event,player){
				// 	return player.hp>3;
				// },
				// filter:function(event){
				// 	return event.card&&get.color(event.card)=='red';
				// },
				// content:function(){
				// 	trigger.nature='fire';
				// },
				group: ["xuanyan2", "xuanyan3"],
			},
			xuanyan2: {
				trigger: { source: "damageBegin" },
				forced: true,
				filter: function (event) {
					return event.hasNature("fire") && event.notLink();
				},
				content: function () {
					trigger.num++;
				},
			},
			xuanyan3: {
				trigger: { source: "damageEnd" },
				forced: true,
				popup: false,
				filter: function (event) {
					return event.hasNature("fire");
				},
				content: function () {
					player.loseHp();
				},
			},
			ningbin: {
				trigger: { player: "damageEnd" },
				forced: true,
				filter: function (event) {
					return event.hasNature("thunder");
				},
				content: function () {
					player.recover();
				},
				ai: {
					effect: {
						target: function (card, player, target) {
							if (get.tag(card, "thunderDamage")) {
								if (target.hp <= 1 || !target.hasSkill("xfenxin")) return [0, 0];
								return [0, 1.5];
							}
						},
					},
				},
			},
			xfenxin: {
				trigger: { player: "changeHp" },
				forced: true,
				filter: function (event) {
					return event.num != 0;
				},
				// alter:true,
				content: function () {
					if (get.is.altered("xfenxin")) {
						player.draw();
					} else {
						player.draw(Math.abs(trigger.num));
					}
				},
				ai: {
					effect: {
						target: function (card) {
							if (get.tag(card, "thunderDamage")) return;
							if (get.tag(card, "damage") || get.tag(card, "recover")) {
								return [1, 0.2];
							}
						},
					},
				},
				group: "xfenxin2",
			},
			xfenxin2: {
				trigger: { source: "dieAfter" },
				forced: true,
				filter: function () {
					return !get.is.altered("xfenxin");
				},
				content: function () {
					player.gainMaxHp();
					player.recover();
				},
			},
			luanjian: {
				enable: "phaseUse",
				filterCard: { name: "sha" },
				selectCard: 2,
				check: function (card) {
					var num = 0;
					var player = _status.event.player;
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (
							lib.filter.targetEnabled({ name: "sha" }, player, players[i]) &&
							get.effect(players[i], { name: "sha" }, player) > 0
						) {
							num++;
							if (num > 1) return 8 - get.value(card);
						}
					}
					return 0;
				},
				viewAs: { name: "sha" },
				selectTarget: [1, Infinity],
				filterTarget: function (card, player, target) {
					return lib.filter.targetEnabled({ name: "sha" }, player, target);
				},
				ai: {
					order: function () {
						return get.order({ name: "sha" }) + 0.1;
					},
					effect: {
						player_use: function (card, player) {
							if (_status.currentPhase != player) return;
							if (
								card.name == "sha" &&
								player.countCards("h", "sha") < 2 &&
								!player.needsToDiscard()
							) {
								var num = 0;
								var player = _status.event.player;
								var players = game.filterPlayer();
								for (var i = 0; i < players.length; i++) {
									if (
										lib.filter.targetEnabled({ name: "sha" }, player, players[i]) &&
										get.attitude(player, players[i]) < 0
									) {
										num++;
										if (num > 1) return "zeroplayertarget";
									}
								}
							}
						},
					},
				},
				group: "luanjian2",
			},
			luanjian2: {
				trigger: { source: "damageBegin" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return event.card && event.card.name == "sha" && event.parent.skill == "luanjian";
				},
				content: function () {
					if (Math.random() < 0.5) trigger.num++;
				},
			},
			ctianfu: {
				enable: "phaseUse",
				filter: function (event, player) {
					return player.countCards("h", "shan") > 0;
				},
				usable: 1,
				filterCard: { name: "shan" },
				discard: false,
				prepare: "give",
				filterTarget: function (card, player, target) {
					return target != player && !target.hasSkill("ctianfu2");
				},
				check: function (card) {
					if (_status.event.player.hp >= 3) return 8 - get.value(card);
					return 7 - get.value(card);
				},
				content: function () {
					target.storage.ctianfu2 = cards[0];
					target.storage.ctianfu3 = player;
					game.addVideo("storage", target, ["ctianfu2", get.cardInfo(cards[0]), "card"]);
					target.addSkill("ctianfu2");
				},
				ai: {
					order: 2,
					result: {
						target: function (player, target) {
							var att = get.attitude(player, target);
							if (att >= 0) return 0;
							return get.damageEffect(target, player, target, "thunder");
						},
					},
					expose: 0.2,
				},
			},
			ctianfu2: {
				trigger: { source: "damageAfter" },
				forced: true,
				mark: "card",
				filter: function (event, player) {
					return player.storage.ctianfu2 && player.storage.ctianfu3;
				},
				content: function () {
					"step 0";
					if (player.storage.ctianfu3 && player.storage.ctianfu3.isAlive()) {
						player.damage(player.storage.ctianfu3);
						player.storage.ctianfu3.line(player, "thunder");
					} else {
						player.damage("nosource");
					}
					"step 1";
					var he = player.getCards("he");
					if (he.length) {
						player.discard(he.randomGet());
					}
					"step 2";
					player.$throw(player.storage.ctianfu2);
					player.storage.ctianfu2.discard();
					delete player.storage.ctianfu2;
					delete player.storage.ctianfu3;
					player.removeSkill("ctianfu2");
				},
				group: "ctianfu3",
				intro: {
					content: "card",
				},
			},
			ctianfu3: {
				trigger: { player: "dieBegin" },
				forced: true,
				popup: false,
				content: function () {
					player.storage.ctianfu2.discard();
					delete player.storage.ctianfu2;
					delete player.storage.ctianfu3;
					player.removeSkill("ctianfu2");
				},
			},
			shuiyun: {
				trigger: { player: "phaseEnd" },
				direct: true,
				init: function (player) {
					player.storage.shuiyun = [];
					player.storage.shuiyun_count = 0;
				},
				// alter:true,
				filter: function (event, player) {
					if (player.storage.shuiyun.length >= 3) return false;
					if (player.storage.shuiyun.length >= 2 && get.is.altered("shuiyun")) return false;
					var types = [];
					for (var i = 0; i < player.storage.shuiyun.length; i++) {
						types.add(get.type(player.storage.shuiyun[i], "trick"));
					}
					var cards = player.getCards("h");
					for (var i = 0; i < cards.length; i++) {
						if (!types.includes(get.type(cards[i], "trick"))) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					"step 0";
					var types = [];
					var num = player.countCards("h");
					for (var i = 0; i < player.storage.shuiyun.length; i++) {
						types.add(get.type(player.storage.shuiyun[i], "trick"));
					}
					player.chooseCard(get.prompt2("shuiyun"), function (card) {
						return !types.includes(get.type(card, "trick"));
					}).ai = function (card) {
						return 11 - get.value(card);
					};
					"step 1";
					if (result.bool) {
						player.$throw(result.cards);
						var clone = result.cards[0].clone;
						setTimeout(function () {
							clone.moveDelete(player);
							game.addVideo("gain2", player, get.cardsInfo([clone]));
						}, 500);
						player.logSkill("shuiyun");
						player.storage.shuiyun.push(result.cards[0]);
						player.lose(result.cards, ui.special);
						player.markSkill("shuiyun");
						game.addVideo("storage", player, [
							"shuiyun",
							get.cardsInfo(player.storage.shuiyun),
							"cards",
						]);
					}
				},
				intro: {
					content: "cards",
					onunmark: function (storage, player) {
						if (storage && storage.length) {
							for (var i = 0; i < storage.length; i++) {
								storage[i].discard();
							}
							player.$throw(storage);
							delete player.storage.shuiyun;
						}
					},
				},
				ai: {
					effect: {
						player_use: function (card, player) {
							if (_status.currentPhase != player) return;
							if (get.is.altered("shuiyun")) return;
							if (
								card.name == "wuzhong" ||
								card.name == "yiyi" ||
								card.name == "yuanjiao" ||
								card.name == "shunshou"
							)
								return;
							if (!player.needsToDiscard()) {
								var types = [];
								for (var i = 0; i < player.storage.shuiyun.length; i++) {
									types.add(get.type(player.storage.shuiyun[i], "trick"));
								}
								if (!types.includes(get.type(card, "trick"))) {
									return "zeroplayertarget";
								}
							}
						},
					},
					threaten: 2.2,
				},
				group: ["shuiyun5"],
			},
			shuiyun5: {
				enable: "chooseToUse",
				filter: function (event, player) {
					return (
						event.type == "dying" &&
						event.dying &&
						event.dying.hp <= 0 &&
						player.storage.shuiyun.length > 0
					);
				},
				filterTarget: function (card, player, target) {
					return target == _status.event.dying;
				},
				delay: 0,
				selectTarget: -1,
				content: function () {
					"step 0";
					player.chooseCardButton(get.translation("shuiyun"), player.storage.shuiyun, true);
					"step 1";
					if (result.bool) {
						player.storage.shuiyun.remove(result.links[0]);
						if (!player.storage.shuiyun.length) {
							player.unmarkSkill("shuiyun");
						}
						player.$throw(result.links);
						result.links[0].discard();
						target.recover();
						if (typeof player.storage.shuiyun_count == "number") {
							player.storage.shuiyun_count++;
						}
						player.syncStorage("shuiyun");
					} else {
						event.finish();
					}
				},
				ai: {
					order: 6,
					skillTagFilter: function (player) {
						return player.storage.shuiyun.length > 0;
					},
					save: true,
					result: {
						target: 3,
					},
					threaten: 1.6,
				},
			},
			wangyou: {
				trigger: { global: "phaseEnd" },
				unique: true,
				gainable: true,
				direct: true,
				filter: function (event, player) {
					if (!player.countCards("he")) return false;
					if (player == event.player) return false;
					return game.hasPlayer(function (current) {
						return current.hasSkill("wangyou3");
					});
				},
				content: function () {
					"step 0";
					var targets = [];
					var num = 0;
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (players[i].hasSkill("wangyou3")) {
							var att = get.attitude(player, players[i]);
							if (att > 0) num++;
							else if (att < 0) num--;
							targets.push(players[i]);
						}
					}
					event.targets = targets;
					var next = player.chooseToDiscard(get.prompt("wangyou", targets), "he");
					next.logSkill = ["wangyou", event.targets];
					next.ai = function (card) {
						if (num <= 0) return 0;
						switch (num) {
							case 1:
								return 5 - get.value(card);
							case 2:
								return 7 - get.value(card);
							default:
								return 8 - get.value(card);
						}
					};
					"step 1";
					if (result.bool) {
						event.targets.sort(lib.sort.seat);
						game.asyncDraw(event.targets);
					} else {
						event.finish();
					}
				},
				ai: {
					expose: 0.1,
					threaten: 1.2,
				},
				group: "wangyou2",
			},
			wangyou2: {
				trigger: { global: "damageEnd" },
				silent: true,
				filter: function (event) {
					return event.player.isAlive();
				},
				content: function () {
					trigger.player.addTempSkill("wangyou3");
				},
			},
			wangyou3: {},
			changnian: {
				forbid: ["boss"],
				trigger: { player: "dieBegin" },
				direct: true,
				unique: true,
				derivation: "changnian2",
				content: function () {
					"step 0";
					player.chooseTarget(get.prompt("changnian"), function (card, player, target) {
						return player != target;
					}).ai = function (target) {
						return get.attitude(player, target);
					};
					"step 1";
					if (result.bool) {
						var cards = player.getCards("hej");
						var target = result.targets[0];
						// if(player.storage.shuiyun&&player.storage.shuiyun.length){
						// 	target.gainMaxHp();
						// 	target.recover(player.storage.shuiyun.length);
						// 	cards=cards.concat(player.storage.shuiyun);
						// 	player.storage.shuiyun.length=0;
						// }
						player.$give(cards, target);
						target.gain(cards);
						target.addSkill("changnian2");
						player.logSkill("changnian", target);
						target.marks.changnian = target.markCharacter(player, {
							name: "长念",
							content:
								'<div class="skill">【追思】</div><div>锁定技，结束阶段，你摸一张牌</div>',
						});
						game.addVideo("markCharacter", target, {
							name: "长念",
							content:
								'<div class="skill">【追思】</div><div>锁定技，结束阶段，你摸一张牌</div>',
							id: "changnian",
							target: player.dataset.position,
						});
					}
				},
				ai: {
					threaten: 0.8,
				},
			},
			changnian2: {
				trigger: { player: "phaseEnd" },
				forced: true,
				nopop: true,
				content: function () {
					player.draw();
				},
			},
			sajin: {
				enable: "phaseUse",
				filterTarget: function (card, player, target) {
					return target.hp < target.maxHp;
				},
				selectTarget: [1, Infinity],
				filterCard: true,
				usable: 1,
				check: function (card) {
					var player = _status.currentPhase;
					if (player.countCards("h") > player.hp) {
						return 7 - get.value(card);
					}
					return 4 - get.value(card);
				},
				content: function () {
					"step 0";
					var color = get.color(cards[0]);
					target.judge(function (card) {
						return get.color(card) == color ? 1 : 0;
					});
					"step 1";
					if (result.bool) {
						target.recover();
					}
				},
				ai: {
					order: 3,
					result: {
						target: function (player, target) {
							return get.recoverEffect(target);
						},
					},
					threaten: 1.5,
				},
			},
			jtjubao: {
				trigger: { global: "discardAfter" },
				filter: function (event, player) {
					if (player.hasSkill("jtjubao2")) return false;
					if (event.player == player) return false;
					if (_status.currentPhase == player) return false;
					for (var i = 0; i < event.cards.length; i++) {
						if (get.type(event.cards[i]) != "basic" && get.position(event.cards[i]) == "d") {
							return true;
						}
					}
					return false;
				},
				frequent: true,
				content: function () {
					"step 0";
					if (trigger.delay == false) game.delay();
					"step 1";
					var cards = [];
					for (var i = 0; i < trigger.cards.length; i++) {
						if (get.type(trigger.cards[i]) != "basic" && get.position(trigger.cards[i]) == "d") {
							cards.push(trigger.cards[i]);
						}
					}
					if (cards.length) {
						var card = cards.randomGet();
						player.gain(card, "log");
						player.$gain2(card);
						player.addTempSkill("jtjubao2");
					}
				},
				ai: {
					threaten: 1.5,
				},
			},
			jtjubao2: {},
			duci: {
				trigger: { player: "loseEnd" },
				direct: true,
				filter: function (event, player) {
					for (var i = 0; i < event.cards.length; i++) {
						if (event.cards[i].original == "e") return true;
					}
					return false;
				},
				content: function () {
					"step 0";
					player.chooseTarget(get.prompt("duci"), function (card, player, target) {
						return player != target && get.distance(player, target) <= 1;
					}).ai = function (target) {
						return get.damageEffect(target, player, player);
					};
					"step 1";
					if (result.bool) {
						player.logSkill("duci", result.targets);
						result.targets[0].damage();
					}
				},
				ai: {
					expose: 0.2,
					threaten: 1.5,
					effect: {
						target: function (card, player, target, current) {
							if (get.type(card) == "equip") {
								var players = game.filterPlayer();
								for (var i = 0; i < players.length; i++) {
									if (
										player != players[i] &&
										get.distance(player, players[i]) <= 1 &&
										get.damageEffect(players[i], player, player) > 0
									) {
										return [1, 3];
									}
								}
							}
						},
					},
				},
			},
			xshuangren: {
				trigger: { player: ["loseEnd"] },
				filter: function (event, player) {
					if (!player.equiping) return false;
					for (var i = 0; i < event.cards.length; i++) {
						if (event.cards[i].original == "e" && get.subtype(event.cards[i]) == "equip1")
							return true;
					}
					return false;
				},
				content: function () {
					var card;
					for (var i = 0; i < trigger.cards.length; i++) {
						if (trigger.cards[i].original == "e" && get.subtype(trigger.cards[i]) == "equip1") {
							card = trigger.cards[i];
						}
					}
					if (card) {
						if (player.storage.xshuangren) {
							player.unmark(player.storage.xshuangren, "xshuangren");
							player.discard(player.storage.xshuangren);
							game.addVideo("unmarkId", player, [
								get.cardInfo(player.storage.xshuangren),
								"xshuangren",
							]);
						}
						if (card.clone) {
							card.clone.moveDelete(player);
							game.addVideo("gain2", player, get.cardsInfo([card.clone]));
							player.mark(card, "xshuangren");
							game.addVideo("markId", player, [get.cardInfo(card), "xshuangren"]);
						}
						ui.special.appendChild(card);
						player.storage.xshuangren = card;
						var info = get.info(card);
						if (info.skills) {
							player.addAdditionalSkill("xshuangren", info.skills);
						} else {
							player.removeAdditionalSkill("xshuangren");
						}
					}
				},
				ai: {
					effect: {
						target: function (card, player, target, current) {
							if (get.subtype(card) == "equip1") return [1, 3];
						},
					},
				},
				intro: {
					content: "card",
				},
				group: "xshuangren2",
			},
			xshuangren2: {
				trigger: { player: "dieBegin" },
				silent: true,
				filter: function (event, player) {
					return player.storage.xshuangren ? true : false;
				},
				content: function () {
					if (player.storage.xshuangren) {
						player.storage.xshuangren.discard();
						player.$throw(player.storage.xshuangren);
					}
				},
			},
			guiyuan: {
				enable: "phaseUse",
				usable: 1,
				filterCard: { name: "sha" },
				filter: function (event, player) {
					return player.hp < player.maxHp;
				},
				content: function () {
					player.recover();
					player.draw();
				},
				ai: {
					order: 5,
					result: {
						player: 1,
					},
				},
			},
			qijian: {
				trigger: { player: "phaseDiscardEnd" },
				direct: true,
				filter: function (event, player) {
					return event.cards && event.cards.length > 0;
				},
				content: function () {
					"step 0";
					player.chooseTarget(
						[1, trigger.cards.length],
						get.prompt("qijian"),
						function (card, player, target) {
							return player.canUse({ name: "sha" }, target, false);
						}
					).ai = function (target) {
						return get.effect(target, { name: "sha" }, player);
					};
					"step 1";
					if (result.bool) {
						player.logSkill("qijian");
						player.useCard({ name: "sha" }, result.targets);
					}
				},
			},
			shenmu: {
				trigger: { global: "dying" },
				priority: 6,
				filter: function (event, player) {
					return event.player.hp <= 0 && player.countCards("h", { color: "red" });
				},
				check: function (event, player) {
					if (get.attitude(player, event.player) <= 0) return false;
					var cards = player.getCards("h", { color: "red" });
					for (var i = 0; i < cards.length; i++) {
						if (cards[i].name == "tao") return false;
						if (get.value(cards[i]) > 7 && cards.length > 2) return false;
					}
				},
				content: function () {
					"step 0";
					player.showHandcards();
					"step 1";
					var cards = player.getCards("h", { color: "red" });
					event.num = cards.length;
					player.discard(cards);
					"step 2";
					trigger.player.recover();
					trigger.player.draw(event.num);
				},
				ai: {
					threaten: 1.6,
					expose: 0.2,
				},
			},
			qianfang: {
				trigger: { player: "phaseBegin" },
				direct: true,
				filter: function (event, player) {
					return player.storage.xuanning && player.countCards("he") + player.storage.xuanning >= 3;
				},
				// alter:true,
				content: function () {
					"step 0";
					// trigger.cancel();
					var ainum = 0;
					var num = 3 - player.storage.xuanning;
					var players = game.filterPlayer();
					event.targets = [];
					for (var i = 0; i < players.length; i++) {
						if (
							players[i] != player &&
							!players[i].isOut() &&
							lib.filter.targetEnabled({ name: "wanjian" }, player, players[i])
						) {
							ainum += get.effect(players[i], { name: "wanjian" });
							event.targets.push(players[i]);
						}
					}
					if (num) {
						var next = player.chooseToDiscard(num, get.prompt2("qianfang"), "he");
						next.ai = function (card) {
							if (ainum >= 0) {
								switch (num) {
									case 1:
										return 8 - get.value(card);
									case 2:
										return 6 - get.value(card);
									case 3:
										return 4 - get.value(card);
								}
							}
							return -1;
						};
						next.logSkill = "qianfang";
						event.logged = true;
					} else {
						player.chooseBool(get.prompt2("qianfang")).ai = function () {
							return ainum >= 0;
						};
					}
					"step 1";
					if (result.bool) {
						player.storage.xuanning = 0;
						player.unmarkSkill("xuanning");
						if (!event.logged) {
							player.logSkill("qianfang");
						}
						player.useCard({ name: "wanjian" }, "qianfang", event.targets);
					} else {
						event.finish();
					}
				},
				ai: {
					expose: 0.1,
					threaten: 1.5,
				},
				group: "qianfang_draw",
				subSkill: {
					draw: {
						trigger: { source: "damageEnd" },
						forced: true,
						filter: function (event, player) {
							if (event._notrigger.includes(event.player)) return false;
							if (!event.player.isEnemiesOf(player)) return false;
							return event.parent.skill == "qianfang";
						},
						popup: false,
						content: function () {
							player.draw();
						},
					},
				},
			},
			qianfang2: {
				trigger: { player: "phaseDrawBegin" },
				forced: true,
				popup: false,
				content: function () {
					trigger.num++;
				},
			},
			poyun: {
				trigger: { source: "damageEnd" },
				// alter:true,
				filter: function (event, player) {
					if (event._notrigger.includes(event.player)) return false;
					return player.storage.xuanning > 0 && event.player.countCards("he") > 0;
				},
				direct: true,
				content: function () {
					"step 0";
					player.discardPlayerCard(trigger.player, "he", get.prompt("poyun", trigger.player), [
						1,
						get.is.altered("poyun") ? 1 : 2,
					]).logSkill = ["poyun", trigger.player];
					"step 1";
					if (result.bool) {
						player.storage.xuanning--;
						if (!player.storage.xuanning) {
							player.unmarkSkill("xuanning");
						}
						player.syncStorage("xuanning");
					}
				},
				ai: {
					threaten: 1.3,
				},
			},
			poyun2: {
				trigger: { source: "damageEnd" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return player.storage.poyun ? true : false;
				},
				content: function () {
					player.draw();
					player.storage.poyun = false;
					player.removeSkill("poyun2");
				},
			},
			poyun3: {},
			zhuyue: {
				enable: "phaseUse",
				// alter:true,
				filter: function (event, player) {
					if (get.is.altered("zhuyue")) {
						return player.hasCard(function (card) {
							return get.color(card) == "black" && get.type(card) != "basic";
						});
					}
					return player.countCards("h", { type: "basic" }) < player.countCards("he");
				},
				init: function (player) {
					player.storage.zhuyue = [];
				},
				filterCard: function (card) {
					if (get.is.altered("zhuyue")) {
						return get.type(card) != "basic" && get.color(card) == "black";
					} else {
						return get.type(card) != "basic";
					}
				},
				selectTarget: [1, 2],
				filterTarget: function (card, player, target) {
					return player != target && target.countCards("he") > 0;
				},
				usable: 1,
				locked: false,
				check: function (card) {
					return 7 - get.value(card);
				},
				multitarget: true,
				multiline: true,
				content: function () {
					"step 0";
					targets.sort(lib.sort.seat);
					var target = targets[0];
					var cs = target.getCards("he");
					if (cs.length) {
						target.discard(cs.randomGet());
					}
					player.storage.zhuyue.add(target);
					if (targets.length < 2) {
						event.finish();
					}
					"step 1";
					var target = targets[1];
					var cs = target.getCards("he");
					if (cs.length) {
						target.discard(cs.randomGet());
					}
					player.storage.zhuyue.add(target);
				},
				ai: {
					result: {
						target: function (player, target) {
							if (!target.countCards("he")) return -0.2;
							return -1;
						},
					},
					order: 10,
					threaten: 1.2,
					exoise: 0.2,
				},
				mod: {
					targetInRange: function (card, player, target) {
						if (
							card.name == "sha" &&
							player.storage.zhuyue &&
							player.storage.zhuyue.includes(target)
						) {
							return true;
						}
					},
					selectTarget: function (card, player, range) {
						if (card.name == "sha" && player.storage.zhuyue && player.storage.zhuyue.length) {
							range[1] = -1;
							range[0] = -1;
						}
					},
					playerEnabled: function (card, player, target) {
						if (
							card.name == "sha" &&
							player.storage.zhuyue &&
							player.storage.zhuyue.length &&
							!player.storage.zhuyue.includes(target)
						) {
							return false;
						}
					},
				},
				intro: {
					content: "players",
				},
				group: "zhuyue2",
			},
			zhuyue2: {
				trigger: { player: "phaseUseEnd" },
				silent: true,
				content: function () {
					player.storage.zhuyue.length = 0;
				},
			},
			longxi: {
				trigger: { player: ["chooseToRespondBegin", "chooseToUseBegin"] },
				forced: true,
				popup: false,
				max: 2,
				filter: function (event, player) {
					return _status.currentPhase != player;
				},
				priority: 101,
				content: function () {
					var cards = [];
					var max = Math.min(ui.cardPile.childNodes.length, lib.skill.longxi.max);
					for (var i = 0; i < max; i++) {
						var card = ui.cardPile.childNodes[i];
						if (trigger.filterCard(card, player, trigger)) {
							cards.push(card);
						}
					}
					if (cards.length) {
						player.gain(cards, "draw");
						player.logSkill("longxi");
						game.log(player, "获得了" + get.cnNumber(cards.length) + "张牌");
					}
				},
				ai: {
					respondSha: true,
					respondShan: true,
					effect: {
						target: function (card, player, target, effect) {
							if (get.tag(card, "respondShan")) return 0.7;
							if (get.tag(card, "respondSha")) return 0.7;
						},
					},
				},
				hiddenCard: function (player, name) {
					if (_status.currentPhase == player) return false;
					var max = Math.min(ui.cardPile.childNodes.length, lib.skill.longxi.max);
					for (var i = 0; i < max; i++) {
						var card = ui.cardPile.childNodes[i];
						if (card.name == name) return true;
					}
					return false;
				},
			},
			guanri: {
				unique: true,
				enable: "phaseUse",
				filter: function (event, player) {
					return !player.storage.guanri && player.countCards("h", { color: "red" }) >= 2;
				},
				check: function (card) {
					return 8 - get.value(card);
				},
				filterCard: function (card) {
					return get.color(card) == "red";
				},
				selectCard: 2,
				filterTarget: function (card, player, target) {
					return player != target && target.hp >= player.hp;
				},
				intro: {
					content: "limited",
				},
				line: "fire",
				content: function () {
					"step 0";
					player.storage.guanri = true;
					player.loseHp();
					"step 1";
					target.damage(2, "fire");
					"step 2";
					if (target.isAlive()) {
						target.discard(target.getCards("e"));
					}
				},
				ai: {
					order: 1,
					result: {
						target: function (player, target) {
							var eff = get.damageEffect(target, player, target, "fire");
							if (player.hp > 2) return eff;
							if (player.hp == 2 && target.hp == 2) return eff;
							return 0;
						},
					},
					expose: 0.5,
				},
			},
			tianxian: {
				mod: {
					targetInRange: function (card, player, target, now) {
						if (card.name == "sha") return true;
					},
					selectTarget: function (card, player, range) {
						if (card.name == "sha" && range[1] != -1) range[1] = Infinity;
					},
				},
				priority: 5.5,
				trigger: { player: "useCardToBefore" },
				filter: function (event) {
					return event.card.name == "sha";
				},
				forced: true,
				check: function () {
					return false;
				},
				content: function () {
					"step 0";
					trigger.target.judge(function (card) {
						return get.color(card) == "black" ? 1 : 0;
					});
					"step 1";
					if (result.bool) {
						trigger.cancel();
					}
				},
			},
			runxin: {
				trigger: { player: ["useCard", "respondEnd"] },
				direct: true,
				filter: function (event) {
					if (get.suit(event.card) == "heart") {
						return game.hasPlayer(function (current) {
							return current.isDamaged();
						});
					}
					return false;
				},
				content: function () {
					"step 0";
					var noneed =
						trigger.card.name == "tao" &&
						trigger.targets[0] == player &&
						player.hp == player.maxHp - 1;
					player
						.chooseTarget(get.prompt("runxin"), function (card, player, target) {
							return target.hp < target.maxHp;
						})
						.set("autodelay", true).ai = function (target) {
						var num = get.attitude(player, target);
						if (num > 0) {
							if (noneed && player == target) {
								num = 0.5;
							} else if (target.hp == 1) {
								num += 3;
							} else if (target.hp == 2) {
								num += 1;
							}
						}
						return num;
					};
					"step 1";
					if (result.bool) {
						player.logSkill("runxin", result.targets);
						result.targets[0].recover();
					}
				},
				ai: {
					expose: 0.3,
					threaten: 1.5,
				},
			},
			xjzhimeng: {
				trigger: { player: "phaseEnd" },
				direct: true,
				locked: true,
				unique: true,
				gainable: true,
				// alter:true,
				group: "xjzhimeng3",
				content: function () {
					"step 0";
					player.chooseTarget(get.prompt("xjzhimeng"), function (card, player, target) {
						return player != target;
					}).ai = function (target) {
						var num = get.attitude(player, target);
						if (num > 0) {
							if (player == target) {
								num++;
							}
							if (target.hp == 1) {
								num += 3;
							}
							if (target.hp == 2) {
								num += 1;
							}
						}
						return num;
					};
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						if (get.is.altered("xjzhimeng")) {
							target.draw();
						} else {
							var card = get.cards()[0];
							target.$draw(card);
							target.storage.xjzhimeng2 = card;
							game.addVideo("storage", target, ["xjzhimeng2", get.cardInfo(card), "card"]);
							target.addSkill("xjzhimeng2");
						}
						player.logSkill("xjzhimeng", target);
					}
				},
				ai: {
					expose: 0.2,
				},
			},
			xjzhimeng2: {
				intro: {
					content: "card",
					onunmark: function (storage, player) {
						delete player.storage.xjzhimeng2;
					},
				},
				mark: "card",
				trigger: { target: "useCardToBegin" },
				frequent: true,
				filter: function (event, player) {
					return (
						player.storage.xjzhimeng2 &&
						get.type(event.card, "trick") == get.type(player.storage.xjzhimeng2, "trick")
					);
				},
				content: function () {
					player.draw();
				},
				ai: {
					effect: {
						target(card, player, target) {
							if (
								target.storage.xjzhimeng2 &&
								get.type(card, "trick") == get.type(target.storage.xjzhimeng2, "trick")
							) {
								return [1, 0.5];
							}
						},
					},
				},
			},
			xjzhimeng3: {
				trigger: { player: ["phaseBegin", "dieBegin"] },
				silent: true,
				content: function () {
					"step 0";
					event.players = game.filterPlayer();
					event.num = 0;
					"step 1";
					if (event.num < event.players.length) {
						var player = event.players[event.num];
						if (player.storage.xjzhimeng2) {
							if (trigger.name == "die" && player == trigger.player) {
								player.storage.xjzhimeng2.discard();
							} else {
								game.log(player, "发动织梦，获得了", player.storage.xjzhimeng2);
								player.gain(player.storage.xjzhimeng2, "gain2");
								player.popup("xjzhimeng");
							}
							player.removeSkill("xjzhimeng2");
						}
						event.num++;
						event.redo();
					}
				},
			},
			tannang: {
				enable: "chooseToUse",
				usable: 1,
				locked: false,
				filterCard: function (card) {
					return get.suit(card) == "club";
				},
				filter: function (event, player) {
					return player.countCards("h", { suit: "club" });
				},
				viewAs: { name: "shunshou" },
				viewAsFilter: function (player) {
					if (!player.countCards("h", { suit: "club" })) return false;
				},
				prompt: "将一张装备牌当顺手牵羊使用",
				check: function (card) {
					var player = _status.currentPhase;
					if (player.countCards("h", { subtype: get.subtype(card) }) > 1) {
						return 11 - get.equipValue(card);
					}
					if (player.countCards("h") < player.hp) {
						return 6 - get.value(card);
					}
					return 2 - get.equipValue(card);
				},
				mod: {
					targetInRange: function (card, player, target, now) {
						if (card.name == "shunshou") return true;
					},
				},
				ai: {
					order: 9.5,
					threaten: 1.5,
				},
			},
			tuoqiao: {
				enable: "chooseToUse",
				filterCard: { color: "black" },
				position: "he",
				viewAs: { name: "shihuifen" },
				viewAsFilter: function (player) {
					return player.countCards("he", { color: "black" }) > 0;
				},
				ai: {
					shihuifen: true,
					skillTagFilter: function (player) {
						return player.countCards("he", { color: "black" }) > 0;
					},
				},
			},
			huimeng: {
				trigger: { player: "recoverAfter" },
				frequent: true,
				content: function () {
					player.draw(2);
				},
				ai: {
					threaten: 0.8,
				},
			},
			tianshe: {
				group: ["tianshe2"],
				trigger: { player: "damageBefore" },
				filter: function (event) {
					if (event.hasNature()) return true;
					return false;
				},
				forced: true,
				content: function () {
					trigger.cancel();
				},
				ai: {
					nofire: true,
					nothunder: true,
					effect: {
						target: function (card, player, target, current) {
							if (card.name == "tiesuo") return [0, 0];
							if (get.tag(card, "fireDamage")) return [0, 0, 0, 0];
							if (get.tag(card, "thunderDamage")) return [0, 0, 0, 0];
						},
					},
				},
			},
			tianshe2: {
				trigger: { source: "damageAfter" },
				filter: function (event, player) {
					if (event.hasNature() && player.hp < player.maxHp) return true;
				},
				forced: true,
				content: function () {
					player.recover();
				},
			},
		},
		translate: {
			pal_xiahoujinxuan: "夏侯瑾轩",
			pal_muchanglan: "暮菖兰",
			pal_xia: "瑕",
			pal_jiangcheng: "姜承",

			pal_jiangyunfan: "姜云凡",
			pal_tangyurou: "唐雨柔",
			pal_longyou: "龙幽",
			pal_xiaoman: "小蛮",

			pal_wangxiaohu: "王小虎",
			pal_sumei: "苏媚",
			pal_shenqishuang: "沈欺霜",
			pal_longkui: "龙葵",
			pal_nangonghuang: "南宫煌",
			pal_wenhui: "温慧",
			pal_wangpengxu: "王蓬絮",
			pal_xingxuan: "星璇",
			pal_leiyuange: "雷元戈",

			pal_zhaoliner: "赵灵儿",
			pal_linyueru: "林月如",
			pal_lixiaoyao: "李逍遥",

			pal_xuejian: "雪见",
			pal_jingtian: "景天",
			pal_zixuan: "紫萱",
			pal_anu: "阿奴",

			pal_yuntianhe: "云天河",
			pal_hanlingsha: "韩菱纱",
			pal_liumengli: "柳梦璃",
			pal_murongziying: "慕容紫英",
			pal_changqing: "长卿",
			pal_xuanxiao: "玄霄",

			pal_yuejinzhao: "越今朝",
			pal_yueqi: "越祈",
			pal_luozhaoyan: "洛昭言",
			pal_xianqing: "闲卿",
			pal_mingxiu: "明绣",
			pal_jushifang: "居十方",

			xyufeng: "御蜂",
			xyufeng_info: "出牌阶段限一次，可以将一张黑桃牌当作机关蜂使用。",
			lingquan: "灵泉",
			lingquan_info:
				"觉醒技，结束阶段，若游戏轮数不小于3且你本回合使用的牌数大于你的体力值，你摸三张牌，然后获得技能【水蕴】。",
			shenwu: "神舞",
			shenwu_info:
				"觉醒技，在一名角色的结束阶段，若你本局至少发动过3次【水蕴】，你增加1点体力和体力上限并获得2点护甲，然后获得技能【回梦】。",
			txianqu: "仙音",
			txianqu_info: "出牌阶段限一次，当你即将造成伤害时，你可以防止之，然后摸两张牌并回复1点体力。",
			qiongguang: "穹光",
			qiongguang_info:
				"弃牌阶段结束时，若你弃置了至少两张牌，你可以对所有敌方角色施加一个随机的负面效果。",
			xunying: "迅影",
			xunying_info: "每当你使用【杀】对一名目标结算完毕后，你可以继续对目标使用【杀】。",
			liefeng: "冽风",
			liefeng_info:
				"锁定技，当你在回合内使用第二张牌时，你本回合获得【炎斩】；当你在回合内使用第三张牌时，你本回合获得【天剑】；当你在回合内使用第四张牌时，你本回合获得【御风】。",
			yuexing: "越行",
			yuexing2: "越行",
			yuexing_info:
				"出牌阶段限一次，你可以指定一名角色，本阶段内将你与该角色到其他角色的距离基数互换。",
			lingdi: "灵笛",
			lingdi_info:
				"出牌阶段，你可以弃置一张本回合与此法弃置的牌花色均不同的手牌，然后选择一名与你距离为X的角色与其各摸一张牌，X为本回合发动灵笛的次数（含此次）。",
			xiaoyue: "啸月",
			xiaoyue_info:
				"锁定技，每轮开始时，若你手牌中有【杀】，你将手牌中的一张随机【杀】对一名随机敌方角色使用，然后获得1点护甲。",
			minsha: "冥煞",
			minsha_info:
				"出牌阶段限一次，你可以弃置两张牌，对一名体力值大于1的其他角色造成1点雷属性伤害，然后距离目标1以内的所有其他角色随机弃置一张牌。",
			xhuanlei: "唤雷",
			xhuanlei_info:
				"每当你受到一次伤害，若伤害来源体力值大于你，你可以对其造成1点雷属性伤害，然后其摸一张牌。",
			anwugu: "巫蛊",
			anwugu2: "蛊",
			anwugu_info:
				"每当你对其他角色造成一次伤害，你可以令目标获得三枚蛊标记；拥有蛊标记的角色手牌上限-1，每回合最多使用X张牌（X为蛊标记数），每个结束阶段失去一枚蛊标记。",
			xtanxi: "探息",
			xtanxi_info:
				"出牌阶段限一次，你可以弃置一张手牌，然后随机选择一名手牌中有与之同名的牌的敌方角色，观看其手牌并获得任意一张。",
			linghuo: "灵火",
			linghuo_info:
				"每两轮限一次，在一名其他角色的结束阶段，若其本回合内造成过伤害，你可以对其造成1点火属性伤害。",
			guijin: "归烬",
			guijin2: "归烬",
			guijin2_bg: "烬",
			guijin_info:
				"每三轮限一次，出牌阶段，你可以观看牌堆顶的四张牌，然后可以将其中任意张牌分配给任意角色，被分到牌的角色跳过下一摸牌阶段，然后将剩余牌以原顺序放回牌堆顶。",
			chengxin: "澄心",
			chengxin2: "澄心",
			chengxin2_bg: "心",
			chengxin_info:
				"每四轮限一次，当一名角色进入濒死状态时，你可以令其将体力值回复至1，然后该角色防止一切伤害直到下一回合结束。",
			tianwu: "天舞",
			tianwu_info: "每当你使用卡牌指定一名敌方角色为唯一目标，你可以对其施加一个随机的负面效果。",
			tianwu_info_alter:
				"每当你使用卡牌指定一名敌方角色为唯一目标，你可以对其施加一个随机的负面效果，每回合限发动一次。",
			liguang: "离光",
			liguang_info: "结束阶段，你可以弃置一张手牌并将场上的一张牌移动到另一个合理的位置。",
			shiying: "逝影",
			shiying_info:
				"限定技，在一名其他角色死亡前，你可以防止其死亡，然后你与该角色失去全部技能、将体力和体力上限变为3、移去所有牌并摸三张牌。",
			yujia: "御甲",
			yujia_info:
				"每当你使用一张未强化的装备牌，你可以随机观看X张机关牌，并选择一张获得之，X为你本局使用过的机关牌数且至少为1。",
			xiepan: "械磐",
			xiepan_info: "每当你失去最后一张基本牌，你可以弃置一张手牌，然后获得一张随机装备牌。",
			yanshi: "偃师",
			yanshi_info:
				"觉醒技，结束阶段，若你累计有4个回合使用过机关牌，你增加1点体力和体力上限，然后用随机装备填满你的装备区。",
			ywuhun: "雾魂",
			ywuhun_bg: "魂",
			ywuhun_info:
				"锁定技，回合开始前，你获得一个额外的回合，并在此回合结束后复原场上及牌堆中的所有牌；当你在此回合中造成伤害后，终止所有结算并结束此回合。",
			// ywuhun_info_alter:'锁定技，回合开始前，你获得一个额外的回合，并在此回合结束后复原场上及牌堆中的所有牌；当你在此回合中造成伤害后，终止所有结算并结束此回合。',
			feichen: "飞尘",
			feichen_info: "",
			tanhua: "昙华",
			tanhua_info:
				"锁定技，你回复体力的效果改为摸两张牌；当你进入濒死状态时，你回复1点体力并失去此技能。",
			xjyingfeng: "影锋",
			xjyingfeng_info:
				"锁定技，每当你使用一张【杀】结算完毕后，你随机对一名不是此【杀】目标的敌方角色使用一张【杀】。",
			fenglue: "风掠",
			fenglue_info:
				"你可以放弃出牌阶段，改为指定一名其他角色并选择任意张手牌，依次对该角色使用，若如此做，此阶段内该角色每受到1点伤害，你在结算后摸一张牌。",
			xjzongyu: "纵雨",
			xjzongyu_info:
				"出牌阶段限一次，你可以弃置一张黑色手牌，视为使用一张飞镖，随机指定两名敌方角色为目标。",
			fanling: "返灵",
			fanling_info: "锁定技，每当一名角色失去体力，你回复1点体力，每回合只能发动一次。",
			huahu: "化狐",
			huahu_bg: "狐",
			huahu_info:
				"限定技，你可以失去所有技能和1点体力上限，然后令任意名其他角色回复1点体力、获得1点护甲并摸一张牌。",
			sheying: "蛇影",
			sheying_info:
				"每回合限一次，当你使用卡牌造成一次伤害后，你可以进行一次判定，若结果为黑色，你收回此牌。",
			dujiang: "毒降",
			dujiang_info: "出牌阶段限一次，你可以弃置一张黑色牌令一名随机敌人获得一张毒。",
			binxin: "冰心",
			binxin_info: "在一名角色的结束阶段，若其体力值为1，你可以令其获得1点护甲。",
			qixia: "绮霞",
			qixia_info: "锁定技，当你累计使用或打出了4种不同花色的牌后，你于本回合结束后获得一个额外回合。",
			jianzhen: "剑阵",
			jianzhen_info:
				"锁定技，当你使用【杀】对目标结算完毕后，其他角色可以对该目标使用一张【杀】，当有人选择出【杀】后终止此结算。",
			husha: "虎煞",
			husha_bg: "煞",
			husha_info:
				"每当你于出牌阶段造成1点伤害，你获得一枚虎煞标记（标记数不超过3）；结束阶段，你可以选择一项：1. 移去一枚虎煞标记，视为对任意角色使用一张【杀】；2. 移去两枚虎煞标记，视为使用一张南蛮入侵；3. 移去三枚虎煞标记，视为对除你之外的角色使用一张元素毁灭。",
			longhuo: "龙火",
			longhuo_info: "结束阶段，你可以对所有角色各造成1点火焰伤害。",
			fenshi: "焚世",
			fenshi_info: "觉醒技，当你解除濒死状态时，你获得2点护甲，摸两张牌，然后获得技能龙火。",
			yanzhan: "炎斩",
			yanzhan_info:
				"出牌阶段限一次，你可以将一张红色牌当作火【杀】使用，此【杀】只能用与之花色相同的闪响应；若此【杀】造成了伤害，你本回合可以额外使用一张【杀】。",
			feixia: "飞霞",
			feixia_info: "出牌阶段限一次，你可以弃置一张红色牌视为对一名随机敌人使用一张不计入出杀次数的【杀】。",
			lueying: "掠影",
			lueying_info:
				"每当你使用一张【杀】，你可以随机获得目标的一张牌，然后目标可以指定一名其他角色，你弃置该角色一张牌（每回合限发动一次，没有弃牌目标时无法发动）。",
			feng: "风",
			feng_info: "锁定技，当你累计摸2次牌后，你下一次摸牌时摸牌数+1。",
			ya: "雅",
			ya_info: "锁定技，当你累计受到2次伤害后，你下一次受到的伤害-1。",
			song: "颂",
			song_info: "锁定技，当你累计造成2次伤害后，你下一次造成的伤害+1。",
			longxiang: "龙翔",
			longxiang_info: "当你使用【杀】指定目标后，你可以弃置目标若干张手牌直到其手牌数与你相同。",
			huxi: "虎袭",
			huxi_info: "你可以失去1点体力并获得1点护甲，视为使用一张【杀】。",
			xuanmo: "玄墨",
			xuanmo_info: "出牌阶段限一次，你可以将一张手牌置于牌堆顶并随机获得两张与之类别相同的牌。",
			danqing: "丹青",
			danqing_info:
				"结束阶段，若你累计使用了4张花色不同的牌，你可以选择至多4名角色随机获得一个正面效果。",
			danqing_info_alter:
				"结束阶段，若你累计使用了4张花色不同的牌，你可以选择至多2名角色随机获得一个正面效果。",
			zhangmu: "障目",
			zhangmu_info:
				"每回合限一次，当你需要使用或打出一张闪时，你可以展示一张闪，视为使用或打出了此闪。",
			feizhua: "飞爪",
			feizhua_info: "当你使用一张【杀】时，你可以将与目标相邻的角色追加为额外目标。",
			leiyu: "雷狱",
			leiyu_info:
				"结束阶段，你可以弃置一张黑色手牌，视为对本回合内所有成为过你的卡牌目标的角色使用一张惊雷闪。",
			lingxue: "灵血",
			lingxue_info: "锁定技，每当你回复1点体力，你获得1点护甲。",
			zhaoyao: "招摇",
			zhaoyao_info:
				"其他角色的摸牌阶段开始时，你可以与其拼点，若你赢，你摸两张牌，然后将两张牌置于牌堆顶。",
			sheling: "摄灵",
			sheling_info:
				"其他角色于你的回合内因使用、打出或弃置而失去牌时，你可以获得之（每回合最多发动三次）。",
			fenxing: "分形",
			fenxing_info: "锁定技，准备阶段，你有50%概率变身为另一形态。",
			guijiang: "鬼降",
			guijiang2: "鬼降",
			guijiang_info:
				"出牌阶段限一次，你可以弃置一张黑色牌，令一名其他角色无法成为回复牌的目标直到你下一回合开始。",
			diesha: "叠杀",
			diesha_info: "锁定技，每当你使用【杀】造成伤害，受伤害角色失去1点体力，你回复1点体力。",
			lingyu: "灵愈",
			lingyu_info: "结束阶段，你可以令一名其他角色回复1点体力。",
			diewu: "蝶舞",
			diewu_info: "出牌阶段，你可以将一张【杀】交给一名角色，若你于此阶段内首次如此做，你摸一张牌。",
			duxinshu: "读心",
			duxinshu_info: "出牌阶段限一次，你可以观看一名其他角色的手牌，然后可以用一张手牌替换其中的一张。",
			feixu: "飞絮",
			feixu_info: "每当一名角色使用或打出一张闪，你可以令其摸一张牌。",
			xuanyan: "玄炎",
			xuanyan2: "玄炎",
			xuanyan_info: "锁定技，你的火属性伤害+1；你造成火属性伤害后失去1点体力。",
			ningbin: "凝冰",
			ningbin_info: "锁定技，每当你受到1次雷属性伤害，你回复1点体力。",
			xfenxin: "焚心",
			xfenxin2: "焚心",
			xfenxin_info:
				"锁定技，每当你的体力值发生改变，你摸等量的牌；每当你杀死一名角色，你增加1点体力上限并回复1点体力。",
			xfenxin_info_alter: "锁定技，每当你的体力值发生改变，你摸一张牌。",
			luanjian: "乱剑",
			luanjian_info:
				"出牌阶段，你可以将两张【杀】当【杀】使用，此【杀】无视距离，可以指定任意名目标且有50%的机率伤害+1。",
			ctianfu: "天符",
			ctianfu2: "天符",
			ctianfu3: "天符",
			ctianfu_info:
				"出牌阶段，你可以将一张闪置于一名其他角色的武将牌上，该角色在下一次造成伤害时受到来自你的1点雷属性伤害并随机弃置一张牌，然后移去此牌。",
			shuiyun: "水蕴",
			shuiyun_bg: "蕴",
			shuiyun2: "水蕴",
			shuiyun5: "水蕴",
			shuiyun3: "水蕴",
			shuiyun_info:
				"结束阶段，你可以将一张与武将牌上的牌类别均不相同的手牌置于武将牌上称为“蕴”；任意一名角色处于濒死状态时，你可以弃置一张“蕴”令其回复1点体力。",
			shuiyun_info_alter:
				"结束阶段，你可以将一张与武将牌上的牌类别均不相同的手牌置于武将牌上称为“蕴”（不能超过2张）；任意一名角色处于濒死状态时，你可以弃置一张“蕴”令其回复1点体力。",
			wangyou: "忘忧",
			wangyou_info: "其他角色的结束阶段，你可以弃置一张牌，令此回合内受过伤害的所有角色各摸一张牌。",
			changnian: "长念",
			changnian2: "追思",
			changnian2_info: "锁定技，结束阶段，你摸一张牌。",
			changnian_info: "你死亡时，可以将所有牌交给一名其他角色，令其获得技能〖追思〗。",
			sajin: "洒金",
			sajin_info:
				"出牌阶段限一次，你可以弃置一张手牌并指定任意名角色进行判定，若判定颜色与你弃置的牌相同，该角色回复1点体力。",
			jtjubao: "聚宝",
			jtjubao_info: "当其他角色于你的回合外首次弃置非基本牌时，你可以获得其中的随机一张。",
			guiyuan: "归元",
			guiyuan_info: "出牌阶段限一次，你可以弃置一张【杀】，然后回复1点体力并摸一张牌。",
			xshuangren: "双刃",
			xshuangren_info:
				"当你的武器牌被替换时，你可以将其置于你的武将牌上，并获得此装备的武器效果（不含距离）。",
			duci: "毒刺",
			duci_info: "每当你失去一次装备牌，可以对距离1以内的一名其他角色造成1点伤害。",
			shenmu: "神木",
			shenmu_info:
				"任意一名角色濒死时，你可以展示你的手牌并弃置其中的所有红色牌（至少一张），若如此做，该角色回复1点体力，然后摸X张牌，X为你弃置的手牌数。",
			qijian: "气剑",
			qijian_info: "弃牌阶段结束时，你可以指定至多X名目标视为使用一张【杀】，X为你于此阶段弃置的卡牌数。",
			poyun: "破云",
			poyun_info: "每当你造成一次伤害，你可以弃置一枚玄凝标记，然后弃置对方两张牌。",
			poyun_info_alter: "每当你造成一次伤害，你可以弃置一枚玄凝标记，然后弃置对方一张牌。",
			qianfang: "千方",
			qianfang_info:
				"准备阶段，若你有玄凝标记，你可以弃置3-X张牌和所有玄凝标记，视为使用了一张【万箭齐发】，每当一名敌方角色因此牌受到伤害，你摸一张牌。X为你的玄凝标记数。",
			qianfang_info_alter:
				"准备阶段，若你有玄凝标记，可以弃置3-X张牌和所有玄凝标记，视为使用了一张【万箭齐发】，X为你的玄凝标记数。",
			longxi: "龙息",
			longxi2: "龙息",
			longxi_info:
				"锁定技，在回合外每当你需要使用或打出一张卡牌时，若牌堆顶的前两张中有可使用或打出的牌，你立即获得之。",
			zhuyue: "逐月",
			zhuyue_info:
				"出牌阶段限一次，你可以弃置一张非基本牌并指定至多两个目标各随机弃置一张牌，若如此做，你本回合使用的【杀】须指定选中角色为目标。",
			zhuyue_info_alter:
				"出牌阶段限一次，你可以弃置一张黑色非基本牌并指定至多两个目标各随机弃置一张牌，若如此做，你本回合使用的【杀】须指定选中角色为目标。",
			guanri: "贯日",
			guanri_info:
				"限制技，你可以弃置两张红色手牌并失去1点体力，然后对一名体力值不少于你的其他角色造成2点火焰伤害并弃置其所有装备牌。",
			tianxian: "天弦",
			tianxian_info:
				"锁定技，你的【杀】无视距离且可指定任意多个目标，目标须进行一次判定，若结果为黑色则取消之。",
			xjzhimeng: "织梦",
			xjzhimeng2: "织梦",
			xjzhimeng3: "织梦",
			xjzhimeng_info:
				"结束阶段，你可以选择一名其他角色将牌堆顶的一张牌置于该角色的武将牌上，直到你的下个准备阶段将其收入手牌。当一名角色武将牌上有织梦牌时，每当其成为与此牌类型相同的卡牌的目标，可以摸一张牌。",
			xjzhimeng_info_alter: "结束阶段，你可以令一名其他角色摸一张牌。",
			runxin: "润心",
			runxin_info: "每当你使用或打出一张红桃牌，你可以令一名角色回复1点体力。",
			tannang: "探囊",
			tannang_info: "出牌阶段限一次，你可以将一张梅花手牌当顺手牵羊使用；你的顺手牵羊无距离限制。",
			tuoqiao: "烟瘴",
			tuoqiao_info: "你可以将一张黑色牌当作石灰粉使用。",
			xiaoyao: "逍遥",
			xiaoyao_info: "每当你成为其他角色的卡牌目标，你可以弃置一张与之花色相同的手牌取消之。",
			tianjian: "天剑",
			tianjian_info: "出牌阶段限一次，你可以将一张【杀】当作【万箭齐发】使用，受到伤害的角色随机弃置一张牌。",
			tianjian_info_alter: "出牌阶段限一次，你可以将一张【杀】当作【万箭齐发】使用。",
			xjyufeng: "御风",
			xjyufeng_info: "锁定技，当你失去手牌后，若手牌数少于2，你将手牌数补至2（每回合最多发动两次）。",
			huimeng: "回梦",
			huimeng_info: "每当你回复1点体力，可以摸两张牌。",
			tianshe: "天蛇",
			tianshe2: "天蛇",
			tianshe_info: "锁定技，你防止即将受到的属性伤害，每当你造成一次属性伤害，你回复1点体力。",
		},
	};
});
