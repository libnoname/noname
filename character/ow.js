import { lib, game, ui, get, ai, _status } from "../noname.js";
game.import("character", function () {
	return {
		name: "ow",
		character: {
			ow_liekong: ["female", "shu", 3, ["shanxian", "shanhui"]],
			ow_sishen: ["male", "shu", 4, ["xiandan", "yihun", "shouge"]],
			ow_tianshi: ["female", "qun", 3, ["shouhu", "ziyu", "feiying"]],
			ow_falaozhiying: ["female", "shu", 3, ["feidan", "huoyu", "feiying"]],
			ow_zhixuzhiguang: ["female", "qun", 3, ["guangshu"]],
			ow_luxiao: ["male", "wu", 3, ["yuedong", "kuoyin", "huhuan"]],
			ow_shibing: ["male", "shu", 4, ["tuji", "mujing", "lichang"]],
			ow_yuanshi: ["male", "qun", 3, ["feiren", "lianpo", "zhanlong"]],
			ow_chanyata: ["male", "qun", 3, ["xie", "luan", "sheng"]],
			ow_dva: ["female", "shu", 2, ["jijia", "tuijin", "zihui", "chongzhuang"]],
			ow_mei: ["female", "wei", 3, ["bingqiang", "jidong", "baoxue"]],
			ow_ana: ["female", "wei", 3, ["zhiyuan", "mianzhen", "aqianghua"]],
			ow_heibaihe: ["female", "qun", 3, ["juji", "duwen", "dulei"]],
			ow_maikelei: ["male", "shu", 4, ["shanguang", "tiandan", "shenqiang"]],
			ow_kuangshu: ["male", "shu", 3, ["liudan", "shoujia", "shihuo"]],

			ow_tuobiang: ["male", "shu", 3, ["paotai", "maoding"]],
			ow_baolei: ["male", "qun", 4, ["bshaowei", "zhencha"]],
			ow_banzang: ["male", "qun", 4, ["bfengshi", "yinbo"]],
			ow_laiyinhate: ["male", "qun", 4, ["zhongdun", "mengji"]],
			ow_luba: ["male", "shu", 4, ["liangou", "xiyang"]],
			ow_wensidun: ["male", "shu", 4, ["feitiao", "dianji"]],
			ow_zhaliya: ["female", "wei", 4, ["pingzhang", "owliyong"]],

			ow_heiying: ["female", "wei", 3, ["qinru", "yinshen", "maichong"]],
			ow_orisa: ["female", "wu", 4, ["qianggu", "woliu"]],
		},
		characterIntro: {
			ow_orisa:
				"奥丽莎是用在努巴尼昙花一现的OR15防御机器人的零件组装而成的，她是这座城市的新一代守护者，但依然有很大的成长空间",
			ow_liekong:
				"莉娜·奥克斯顿（代号：“猎空”）是守望先锋原型机试飞计划的最年轻成员。但在第一次试飞过程中，原型机的传送阵列出现故障，包括飞行员在内完全失踪。莉娜在几个月后再次出现，不过她身上的分子却无法和时间流同步。这种被称为“时间解离”的症状使她彻底变成了一个“活生生”的幽灵，时隐时现。直到一位名叫温斯顿的科学家设计出了“时间加速器”，一台可以让“猎空”维持在当前时间的装置。不仅如此，这一装置还让“猎空”有能力控制她自己的时间流，使她可以任意加速或减慢时间。有了这一全新的能力，她成了守望先锋最强大的特工之一。守望先锋解散后，“猎空”依旧选择为了正义而战，守护无辜。",
			ow_sishen:
				"关于这个黑袍恐怖分子的传闻并不多，只知道大家都称他为“死神”。虽然没人知道他的真实身份和动机，但有一点是可以肯定的，他的出现意味着死亡。“死神”是一名极其不稳定、残暴、冷酷的雇佣兵，在世界各地犯下多起恐怖袭击案件。在过去的数十年间，他参与了许多武装冲突，但其本人却不属于任何组织。在多年的追踪后，“死神”神秘的面纱终于被慢慢揭开。据信，“死神”正在追杀前守望先锋特工并系统地逐一消灭。",
			ow_tianshi:
				"齐格勒是瑞士一家顶尖医院的手术部门负责人。正是她在医学领域的成就，引起了守望先锋的注意。由于齐格勒的双亲都被战争夺走了生命，因此她从一开始就极其反对该组织通过军事手段进行维和。但最终，她意识到守望先锋给她提供了一个可以拯救更多人生命的机会。作为守望先锋医学研究部门的负责人，安吉拉致力于更好地在前线治疗受到致命伤的病员。尽管她对守望先锋做出了巨大的贡献，但齐格勒博士经常质疑她的上司以及守望先锋的长远目标。而当守望先锋解散之后，齐格勒博士便致力于帮助那些受战争波及的受难者。",
			ow_falaozhiying:
				"本名法芮尔，来自一个军功卓越的军人世家，贡献与荣耀就是她最高的追求。在加入埃及军队后，她的坚韧和在战术上的天赋使她很快就晋升为了一名军官。作为一名果敢的领袖，任何在她手下服役的士兵都对她抱有绝对的忠诚。有了所有这些卓越的表现，法芮尔自然成了守望先锋最青睐的一名候选人。但在她正式加入之前，守望先锋就解散了。当她带着所有的荣誉退役后，法芮尔加入了一家名为“海力士国际安保”的私人安保公司，该公司的最重要的一笔订单就是负责保护吉萨高原地下的人工智能研究设施。尽管她对守望先锋的解散感到无比的遗憾，但她依旧梦想着能为正义而战并改变这个残破的世界。",
			ow_zhixuzhiguang:
				"当被认为是为数不多可以成为光子建筑师的人才之后，年轻的塞特娅·法斯瓦尼离开了贫穷的家乡，成为了费斯卡光子建筑师学院的一员。她很快就成为了乌托邦最顶尖的光子建筑师。但费斯卡集团在塞特娅身上还是看到了更广阔的发展潜力。费斯卡集团称其为“秩序之光”，为了集团的利益和扩大在其他国家的影响力，将其派遣到全球执行秘密任务。虽然“秩序之光”相信她的所作所为是为了实现人性之“大善”，但有时候她也会怀疑她所希望实现的控制和秩序，是否真的是人类最需要的。",
			ow_luxiao:
				"卢西奥•科雷亚•多斯桑托斯在里约热内卢长大。“智能危机”结束后，由于经济的一蹶不振导致这里变成了一个贫穷拥挤的贫民区。他想找到一个办法激发周围人的信心与活力：音乐。他开始在街边、社区派对进行表演，随着年龄的增长便开始了一系列传奇的地下演出。但当多国集团费斯卡集团计划重建城市的大部分地区时，卢西奥所在的社区陷入了混乱，人们失去了自由。卢西奥绝对不会容忍这一切。他偷走了费斯卡用来压迫人民的音波技术，反过来将人们团结在一起。最终，在一场暴动中，他们将费斯卡集团赶出了家园。卢西奥的领导能力让他在一夜之间成为了明星和社会正能量的象征。他的音乐在人们心中的地位如火箭般蹿升。随着影响力的不断扩大，卢西奥意识到他有机会可以改变这个世界，让这个世界变得更美好。",
			ow_shibing:
				"被全球通缉的独行侠“士兵：76”独自一人发动了一场旨在查出守望先锋解散真相的战争。“士兵：76”在全球一系列针对金融机构、秘密集团和守望先锋基地的袭击活动中被曝光。尽管外界至今不清楚他的动机是什么，但有人认为他曾是一位守望先锋特工，决心查出守望先锋垮台的幕后黑手。",
			ow_yuanshi:
				"岛田忍者家族大名最年轻的儿子，但对家族的非法生意毫无兴趣，被视为一个危险的累赘。在家族大名意外死亡后，他与哥哥半藏的矛盾激化，最终导致了一场生死对决，源氏也因此差点送命。后来被守望先锋救下，并被改造成机械忍者以摧毁他父亲的邪恶帝国。在完成任务后，源氏因无法接受自己的机械身躯，离开了守户先锋，并游历世界希望能找到自己存在的意义。数年之后，他遇到了智械僧侣禅雅塔，并且在这位僧侣的引导下，源氏体内的人类和机械体验终于融合在了一起。他开始明白，尽管他有一副机械身躯，但他的人类灵魂是完整的，他渐渐意识到自己的新形态是给予自己的恩赐和力量。",
			ow_chanyata:
				"在“智能危机”结束之后，一群被放逐的智能机器人感受到了被其称为“灵魂觉醒”的升华之道，他们渐渐相信他们和人类一样，同样拥有灵魂。由神秘僧侣泰哈撒·孟达塔带领的这些僧侣开始寻找让人类和机器人重回曾经的和谐相处之道。他们最终被世人所接纳，并得到了全球数百万人的支持。但其中一位僧侣，禅雅塔并不赞同这一新道路。他认为要解决人类和机器人之间根深蒂固的问题，不能依靠循循善诱，而必须通过个体联系和互动。最终，他选择离开寺庙，游走世界，帮助那些他所遇到的人摆脱凡尘。但如果有必要，他也会为了保护无辜而拿起武器，无论人类还是机器人。",
			ow_dva: "D.Va曾是一名职业玩家，而现在则利用自己的技巧驾驶一台尖端机甲保卫国家。随着智能机械不断进化，它最终干扰了MEKA的无人机控制网络，迫使军方派驾驶员驾驶这些机甲。由于难以找到合适的候选人，政府开始向那些拥有足以操控机甲尖端武器系统的必要反应和本能的国内职业玩家寻求帮助，其中就包括顶尖玩家之一的“D.Va”宋哈娜。作为一名为了获胜不惜一切代价的精英玩家，D.Va从来都不会对对手表现出丝毫的仁慈。D.Va将这次新任务视为一款全新的游戏，无所畏惧地和其他MEKA机甲冲向战场，随时准备保卫自己的国家。最近，她开始向她的粉丝直播战斗行动，而这也让她成为了世界巨星。",
			ow_mei: "守望先锋为了查明全球不断升级的怪异气候现象的真正原因，在世界各个位置建立了一系列生态监测站。周美灵就是这一长久项目的成员之一。当她来到该项目的南极洲监控站时，一场突如其来的极地风暴摧毁了大部分设施并将这里与外界隔绝了开来。随着补给物资的不断消耗，科学家们进入了急冻状态希望能够撑到救援队抵达的那一天。但救援并没有抵达。几年后，当这些科学家的急冻舱最终被发现时，美是唯一的幸存者。此时，守望先锋已经解散，所有的生态监测站也都已经被废弃，他们之前收集的研究数据全部丢失。美最终决定独自继续她的工作。她带上了一台可穿戴式气候控制装置，游历世界，希望能够重新建立起生态监测网络，查出威胁着这个星球生态系统的真正原因。",
			ow_ana: "守望先锋的创始成员之一，世界公认的顶级狙击手。智械危机结束后，安娜被晋升为了上尉。尽管身居要职，但已年过半百的安娜拒绝离开战场，依然亲临前线。直至在一次人质解救行动中，遭遇了一个叫做“黑百合”的黑爪特工，所有人都认为安娜死在了那场战斗中。但事实上，安娜活了下来，身受重伤并且失去了自己的右眼。在恢复期间，她感受到了战斗中生命的不可承受之重，因此决定就此隐居。然而随着时间一天天过去，看着自己家乡遭到的威胁愈演愈烈，她突然意识到自己依然有责任保护身边的亲人。在“征用”了守望先锋军械库中的装备后，安娜重新回到了这个世界，为了一个更安全、稳定的和平世界而战。",
			ow_heibaihe:
				"“黑百合”在成为如今的杀手之前，曾与对抗恐怖组织“黑爪”的守望先锋探员杰哈·拉克瓦结婚。在多次刺杀杰哈无果之后，黑爪决定将目标转向他的妻子，艾米丽。黑爪特工绑架了艾米丽并对其进行了一项高强度神经重构计划。他们击垮了她的意志，抑制了其本身的人性，将其变成了一个潜伏特工。她最终被守望先锋探员找到并在确认无致命伤之后重新过上了以前的生活。两周之后，她杀死了睡梦中的杰哈，并回归了黑爪。",
			ow_maikelei:
				"曾是美国西南部因非法军火交易而臭名昭著的“死局”帮中，最令人胆寒的一员，后被守望先锋逮捕。由于其枪法精湛且足智多谋，守望先锋给了他两个选择：在最高安全级别的监狱中度过余生，或加入守望先锋的秘密行动部队“暗影守望”。他选择了后者。尽管一开始他对守望先锋的理念嗤之以鼻，但他逐渐相信可以通过扫除世上的不公，来弥补自己过去犯下的罪行。后来，暗影守望内部出现了异样的气氛：废除守望先锋，独掌大权。麦克雷由于不想参与其中，于是便独自离开，销声匿迹。多年之后，他以雇佣兵的身份再次出现。尽管许多大小团体都想拉拢他，但他只为自己眼中的正义而战。",
			ow_kuangshu:
				"由于澳大利亚智能中枢核心在遭到攻击后发生爆炸，这片地区现在变成了寸草不生的辐射荒地。但即便如此，还是有一群自称为“拾荒者”的人类生存了下来。他们在残骸中寻找一切还可利用的东西，渐渐形成了一个野蛮、危险的团体。“狂鼠”就是其中的一员。和其他人一样，他也受到了辐射，因此变成了一个痴迷于危险炸弹的疯子。当他在中枢废墟中发掘出一个极其珍贵的宝藏后，全世界都知道了这个疯子的名号。尽管几乎没人知道他到底发现了什么，但他身后总有数不清的赏金猎人、黑帮和投机分子想要杀掉他，直到他与“拾荒者”打手“路霸”达到了一个协议：只要今后找到的宝贝五五分成，“路霸”就会是“狂鼠”的私人保镖。",
			ow_tuobiang:
				"托比昂是一个极其不信任智械的天才工程师，但他的同行都认为这只是他杞人忧天而已。但托比昂最担心的事情最终还是发生了，一场机器人对抗其人类发明者的“智能危机”在全球范围内爆发。由于其在工程学方面的天才造诣，守望先锋向他伸出了橄榄枝，并将其纳入了最早的守望先锋攻击部队，而他也证明了自己在终结这场危机中的关键价值。但在守望先锋解散后，托比昂设计出的许多武器被偷走并被藏在世界各地。出于对自己作品的责任心，托比昂便发誓不能让这些武器落入敌手，危害无辜的世人。",
			ow_baolei:
				"“堡垒”系列在设计之初是被用于维和目的的，这一系列的机器单位拥有能够快速在突击和攻城模式之间转换的独特能力。但在“智能危机”期间，该系列却被用来对抗其人类发明者，成为了机器人叛军的中坚力量。随着后来危机的解除，几乎所有的“堡垒”系列机器人都被销毁或拆解。直到今天，“堡垒”依旧是当年那场可怕战争的代名词。但是有一台独特的“堡垒”机器人，在那场战争的决战中严重受损，因此被遗忘了数十年。直到有一天，它被意外地重新激活，它的战斗程序几乎全部受损，取而代之的是对自然世界及其住民的强烈好奇。好奇的“堡垒”于是在这个被战火蹂躏过的世界上，开始了探索和寻找自我价值的旅途。",
			ow_banzang:
				"岛田家据传已有数百年的历史。以忍者为主要成员的岛田家，经过多年的发展，已经建立起一个以军火和非法物资交易为主的庞大黑道帝国。作为大名的长子，半藏注定要继承他的父亲统治岛田帝国。父亲过世后，家族长老就建议半藏帮助他那刚愎自用的弟弟源氏，以便两人携手管理岛田帝国。在遭到源氏拒绝后，半藏被迫亲手了结了自己的弟弟。半藏因此深受打击，他拒绝继承父亲的遗产并最终抛弃了自己的家族和所有辛苦换来的成果。现在，半藏四海为家，不断磨练着自己作为一名武士的技巧，希望终有一天能挽回自己的名誉并真正放下自己的过去。",
			ow_laiyinhate:
				"莱因哈特•威尔海姆的行事作风就像一个属于过去的勇士，时刻铭记着骑士的信条：无畏、公正、勇敢。莱因哈特独特的道德观和舍小为大的信念，深得其上级的喜爱。他有话直说，因此成为了守望先锋最坚定的拥护者，同时在有必要时，也是守望先锋最刻薄的批评者，时刻提醒着其他人，守望先锋是一支正义之师。莱因哈特一直服役到将近六十岁，因此不得不面临强制退役。而守望先锋又深陷腐败和煽动叛乱之嫌的泥沼，莱因哈特只能眼睁睁地看着自己守护了一生的信念被吞噬。尽管守望先锋最终解散，但莱因哈特绝不会在世界陷入混乱之时袖手旁观。他再一次穿上了十字军战甲，立誓为正义而战，像曾经的白银骑士那样守护欧罗巴大陆无辜的人民，坚信光明的未来必将到来。",
			ow_luba:
				"“路霸”马可曾是众多居住在澳洲内陆的居民之一。在智能危机爆发后，政府作出了一个极具争议的决定，将这里送给了差点摧毁整个国家的智能机器人，以求达成永久的和平协定。这一决定直接导致马可和大批居民被迫离开，因失去家园而怒不可遏的马可和其他人开始了一场暴力起义，最终，引发了一场大爆炸，导致周围数公里地区全部遭到辐射，只留下了变形的金属和残骸。为了在这种环境下生存下来，他戴上了面具、骑着破烂摩托开上了通往澳洲内陆的残破高速公路。一路上，他的人性一点一点地被消磨，马可最终消失了，而“路霸”就此诞生。",
			ow_wensidun:
				"在“地平线”月球殖民地的居民中，有一群经过基因改造的大猩猩。其中一只大猩猩在接受了哈罗德·温斯顿博士团队的基因改造后，显示出了极快的脑部发育迹象，博士本人也将人类科学和创造力教给了这只猩猩。但当其他大猩猩发动叛乱，杀死了所有科学家并占领殖民地后，他的生活便再也回不到过去了。出于对哈罗德博士的爱戴，这只大猩猩决定继承他的姓氏：温斯顿，并设计出了一枚临时火箭逃往了地球。他找到了新家：守望先锋 —— 这是一个代表着他所憧憬的所有人性的组织。温斯顿终于有机会实现哈罗德博士生前不断教导他的英雄理念。但随着后来守望先锋的解散，温斯顿也隐居了起来，再一次与他报以厚望的世界失去联系，但他却从未放弃对英雄最终回归的期望。",
			ow_zhaliya:
				"亚历山德拉·查莉娅诺娃是世界上最强壮的女运动员之一。然而就在世锦赛前夕，一直处于休眠状态的西伯利亚机器人控制中枢再度发动攻击，战火再次蔓延到了她的家乡。早已名利双收的亚历山德拉，毅然抛弃了一切，立即回到家乡加入了当地的防御部队。",
			ow_heiying:
				"作为全世界最臭名昭著的黑客，“黑影”利用信息与情报操控权贵。早在她称自己为“黑影”之前，░░░░░░是千千万万在智械危机后变成孤儿的儿童之一。在家乡大部分基础设施都被摧毁的情况下，她依靠自己在黑客以及计算机方面的天赋活了下来。在黑客领域的一连串的胜利让░░░░░░对自己的实力过度自信，最终她在毫无防备的情况下，陷入了一张覆盖全球的阴谋网——并且也因此被人盯上了。由于自己的安全面临严重威胁，░░░░░░不得不删除关于自己的全部信息，从此销声匿迹。后来，她以“黑影”的身份再度出现，经过改造的她决心查出那张阴谋网背后的真相。",
		},
		skill: {
			woliu: {
				trigger: { player: "phaseEnd" },
				direct: true,
				unique: true,
				forceunique: true,
				content: function () {
					"step 0";
					player.chooseTarget(get.prompt("woliu"), lib.filter.notMe, [1, 2]).ai = function (
						target
					) {
						if (get.attitude(player, target) < 0) {
							return get.effect(target, { name: "sha" }, player, player);
						}
						return 0;
					};
					"step 1";
					if (result.bool) {
						player.logSkill("woliu", result.targets);
						var list = [player].concat(result.targets);
						for (var i = 0; i < list.length; i++) {
							list[i].storage.woliu2 = list.slice(0);
							list[i].addSkill("woliu2");
						}
					}
				},
				group: "woliu_clear",
				subSkill: {
					clear: {
						trigger: { player: ["dieBegin", "phaseBegin"] },
						forced: true,
						popup: false,
						content: function () {
							for (var i = 0; i < game.players.length; i++) {
								game.players[i].removeSkill("woliu2");
							}
						},
					},
				},
			},
			woliu2: {
				mark: true,
				intro: {
					content: "players",
				},
				trigger: { global: "useCard" },
				forced: true,
				popup: false,
				onremove: function (player) {
					delete player.storage.woliu2;
					for (var i = 0; i < game.players.length; i++) {
						var current = game.players[i];
						if (
							Array.isArray(current.storage.woliu2) &&
							current.storage.woliu2.includes(player)
						) {
							current.storage.woliu2.remove(player);
							current.updateMarks();
						}
					}
				},
				filter: function (event, player) {
					if (event.card.name != "sha") return false;
					if (!event.targets.includes(player)) return false;
					if (!player.storage.woliu2) return false;
					for (var i = 0; i < player.storage.woliu2.length; i++) {
						var current = player.storage.woliu2[i];
						if (current.isIn() && event.player != current && !event.targets.includes(current)) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					"step 0";
					game.delayx();
					"step 1";
					var list = [];
					for (var i = 0; i < player.storage.woliu2.length; i++) {
						var current = player.storage.woliu2[i];
						if (
							current.isIn() &&
							trigger.player != current &&
							!trigger.targets.includes(current)
						) {
							list.push(current);
						}
					}
					player.logSkill("woliu2", list);
					trigger.targets.addArray(list);
				},
				group: "woliu2_die",
				subSkill: {
					die: {
						trigger: { player: "dieBegin" },
						silent: true,
						content: function () {
							player.removeSkill("woliu2");
						},
					},
				},
				ai: {
					effect: {
						target_use(card, player, target) {
							if (_status.woliu2_temp) return;
							if (card.name == "sha" && target.storage.woliu2) {
								_status.woliu2_temp = true;
								var num = game.countPlayer(function (current) {
									if (
										current != player &&
										current != target &&
										target.storage.woliu2.includes(current)
									) {
										return get.sgn(get.effect(current, card, player, target));
									}
								});
								delete _status.woliu2_temp;
								if (target.hasSkill("qianggu2") && get.attitude(player, target) > 0) {
									return [0, num];
								}
								if (target.hp == 1 && !target.hasShan()) return;
								return [1, num];
							}
						},
					},
				},
			},
			qianggu: {
				enable: "phaseUse",
				usable: 1,
				filterCard: true,
				selectCard: 2,
				position: "he",
				check: function (card) {
					return 8 - get.value(card);
				},
				filter: function (event, player) {
					return player.countCards("he") >= 2;
				},
				content: function () {
					player.changeHujia(2);
					player.addTempSkill("qianggu2", { player: "phaseBegin" });
				},
				ai: {
					result: {
						player: 1,
					},
					order: 2.5,
				},
			},
			qianggu2: {
				trigger: { target: "useCardToBefore" },
				forced: true,
				filter: function (event, player) {
					return event.card.name == "sha";
				},
				mark: true,
				marktext: "固",
				intro: {
					content: "其他角色对你使用杀时需要弃置一张基本牌，否则杀对你无效",
				},
				content: function () {
					"step 0";
					var eff;
					if (player.hasSkill("woliu2")) {
						eff = -get.attitude(trigger.player, player);
					} else {
						eff = get.effect(player, trigger.card, trigger.player, trigger.player);
					}
					trigger.player
						.chooseToDiscard(
							"强固：弃置一张基本牌，否则杀对" + get.translation(player) + "无效",
							function (card) {
								return get.type(card) == "basic";
							}
						)
						.set("ai", function (card) {
							if (_status.event.eff > 0) {
								return 10 - get.value(card);
							}
							return 0;
						})
						.set("eff", eff);
					"step 1";
					if (result.bool == false) {
						trigger.cancel();
					}
				},
				ai: {
					effect: {
						target(card, player, target, current) {
							if (card.name == "sha") {
								if (_status.event.name == "qianggu2") return;
								if (get.attitude(player, target) > 0) return;
								var bs = player.getCards("h", { type: "basic" });
								if (bs.length < 2) return 0;
								if (player.hasSkill("jiu") || player.hasSkill("tianxianjiu")) return;
								if (bs.length <= 3 && player.countCards("h", "sha") <= 1) {
									for (var i = 0; i < bs.length; i++) {
										if (bs[i].name != "sha" && get.value(bs[i]) < 7) {
											return [1, 0, 1, -0.5];
										}
									}
									return 0;
								}
								return [1, 0, 1, -0.5];
							}
						},
					},
				},
			},
			dianji: {
				enable: "phaseUse",
				filter: function (event, player) {
					return player.countCards("h") > 0;
				},
				filterCard: true,
				usable: 1,
				viewAs: { name: "jingleishan", nature: "thunder" },
				check: function (card) {
					return 8 - get.value(card);
				},
				ai: {
					order: 8,
					expose: 0.2,
					threaten: 1.2,
				},
				mod: {
					playerEnabled: function (card, player, target) {
						if (_status.event.skill == "dianji" && get.distance(player, target) > 2) return false;
					},
				},
			},
			feitiao: {
				trigger: { player: "phaseUseBegin" },
				direct: true,
				filter: function (event, player) {
					return player.countCards("he") > 0;
				},
				content: function () {
					"step 0";
					var next = player.chooseCardTarget({
						prompt: get.prompt("feitiao"),
						position: "he",
						filterCard: true,
						ai1: function (card) {
							return 7 - get.value(card);
						},
						ai2: function (target) {
							var att = get.attitude(player, target);
							if (att >= 0) return 0;
							if (!target.countCards("he")) return -0.01;
							var dist = get.distance(player, target);
							if (dist > 2) {
								att -= 2;
							} else if (dist == 2) {
								att--;
							}
							return -att;
						},
						filterTarget: function (card, player, target) {
							return player != target;
						},
					});
					"step 1";
					if (result.bool) {
						player.discard(result.cards);
						var target = result.targets[0];
						player.logSkill("feitiao", target);
						player.storage.feitiao2 = target;
						player.addTempSkill("feitiao2");
						target.randomDiscard();
					}
				},
			},
			feitiao2: {
				mod: {
					globalFrom: function (from, to) {
						if (to == from.storage.feitiao2) return -Infinity;
					},
				},
				mark: "character",
				intro: {
					content: "与$的距离视为1直到回合结束",
				},
				onremove: true,
			},
			zhencha: {
				init: function (player) {
					player.storage.zhencha = true;
				},
				mark: true,
				intro: {
					content: function (storage, player) {
						if (storage) {
							return "每当你使用一张杀，你摸一张牌或回复1点体力";
						} else if (player.hasSkill("bshaowei") && player.storage.bshaowei) {
							return "你的杀无视距离和防具、无数量限制且不可闪避；你不能闪避杀";
						} else {
							return "无额外技能";
						}
					},
				},
				trigger: { player: "phaseEnd" },
				filter: function (event, player) {
					if (player.hasSkill("zhencha2")) return false;
					return !player.storage.zhencha;
				},
				content: function () {
					player.storage.bshaowei = false;
					player.storage.zhencha = true;
					if (player.marks.zhencha) {
						player.marks.zhencha.firstChild.innerHTML = "侦";
					}
					player.addTempSkill("zhencha2");
				},
				subSkill: {
					sha: {
						trigger: { player: "shaBegin" },
						direct: true,
						filter: function (event, player) {
							return player.storage.zhencha && event.card && event.card.name == "sha";
						},
						content: function () {
							player.chooseDrawRecover(get.prompt("zhencha")).logSkill = "zhencha";
						},
					},
				},
				group: "zhencha_sha",
			},
			bshaowei: {
				init: function (player) {
					player.storage.bshaowei = false;
				},
				trigger: { player: "phaseEnd" },
				filter: function (event, player) {
					if (player.hasSkill("zhencha2")) return false;
					return !player.storage.bshaowei;
				},
				check: function (event, player) {
					if (!player.hasShan()) return true;
					if (!player.hasSha()) return false;
					return Math.random() < 0.5;
				},
				content: function () {
					player.storage.bshaowei = true;
					player.storage.zhencha = false;
					if (player.marks.zhencha) {
						player.marks.zhencha.firstChild.innerHTML = "哨";
					}
					player.addTempSkill("zhencha2");
				},
				subSkill: {
					sha: {
						mod: {
							targetInRange: function (card, player, target, now) {
								if (card.name == "sha" && player.storage.bshaowei) return true;
							},
							cardUsable: function (card, player, num) {
								if (card.name == "sha" && player.storage.bshaowei) return Infinity;
							},
						},
						trigger: { target: "shaBegin", player: "shaBegin" },
						forced: true,
						filter: function (event, player) {
							return player.storage.bshaowei;
						},
						check: function () {
							return false;
						},
						content: function () {
							trigger.directHit = true;
						},
						ai: {
							unequip: true,
							skillTagFilter: function (player, tag, arg) {
								if (!player.storage.bshaowei) return false;
								if (arg && arg.name == "sha") return true;
								return false;
							},
						},
					},
				},
				group: "bshaowei_sha",
				ai: {
					threaten: function (player, target) {
						if (target.storage.bshaowei) return 1.7;
						return 1;
					},
				},
			},
			zhencha2: {},
			pingzhang: {
				trigger: { global: "damageBegin" },
				// alter:true,
				intro: {
					content: function (storage, player) {
						if (player.hasSkill("pingzhang2")) {
							if (player.hasSkill("pingzhang3")) {
								return "已对自已和其他角色发动屏障";
							} else {
								return "已对自已发动屏障";
							}
						} else {
							return "已对其他角色发动屏障";
						}
					},
					markcount: function (storage, player) {
						if (player.hasSkill("pingzhang2") && player.hasSkill("pingzhang3")) {
							return 2;
						}
						return 1;
					},
				},
				filter: function (event, player) {
					if (event.num <= 0) return false;
					var position = get.is.altered("pingzhang") ? "h" : "he";
					if (event.player == player) {
						if (player.hasSkill("pingzhang2")) return false;
						return player.countCards(position, { suit: "heart" });
					} else {
						if (player.hasSkill("pingzhang3")) return false;
						return player.countCards(position, { suit: "spade" });
					}
				},
				direct: true,
				content: function () {
					"step 0";
					var position = get.is.altered("pingzhang") ? "h" : "he";
					var suit = player == trigger.player ? "heart" : "spade";
					var next = player.chooseToDiscard(
						position,
						{ suit: suit },
						get.prompt("pingzhang", trigger.player)
					);
					next.ai = function (card) {
						if (get.damageEffect(trigger.player, trigger.source, player) < 0) {
							return 8 - get.value(card);
						}
						return 0;
					};
					next.logSkill = ["pingzhang", trigger.player];
					"step 1";
					if (result.bool) {
						trigger.num--;
						if (player == trigger.player) {
							player.addSkill("pingzhang2");
						} else {
							player.addSkill("pingzhang3");
						}
						player.markSkill("pingzhang");
					}
				},
				group: ["pingzhang_count"],
				subSkill: {
					count: {
						trigger: { player: "phaseBegin" },
						silent: true,
						content: function () {
							player.storage.pingzhang = 0;
							if (player.hasSkill("pingzhang2")) {
								player.storage.pingzhang++;
								player.removeSkill("pingzhang2");
							}
							if (player.hasSkill("pingzhang3")) {
								player.storage.pingzhang++;
								player.removeSkill("pingzhang3");
							}
							player.unmarkSkill("pingzhang");
						},
					},
				},
				ai: {
					expose: 0.2,
					threaten: 1.5,
				},
			},
			pingzhang2: {},
			pingzhang3: {},
			owliyong: {
				trigger: { player: "phaseDrawBegin" },
				forced: true,
				filter: function (event, player) {
					return player.storage.pingzhang > 0;
				},
				content: function () {
					trigger.num += player.storage.pingzhang;
				},
			},
			liangou: {
				enable: "phaseUse",
				usable: 1,
				filterTarget: function (card, player, target) {
					return target != player;
				},
				filterCard: true,
				position: "he",
				check: function (card) {
					return 5 - get.value(card);
				},
				content: function () {
					"step 0";
					player.judge(function (card) {
						return get.suit(card) != "heart" ? 1 : -1;
					});
					"step 1";
					if (result.bool) {
						target.addTempSkill("liangou2");
						target.storage.liangou2 = player;
					}
				},
				ai: {
					order: 10,
					expose: 0.2,
					result: {
						target: function (player, target) {
							if (
								get.damageEffect(target, player, target) < 0 &&
								player.hasCard(function (card) {
									return get.tag(card, "damage") ? true : false;
								})
							) {
								return -1;
							}
							return 0;
						},
					},
				},
			},
			liangou2: {
				mod: {
					// cardEnabled:function(card,player){
					// 	return false;
					// },
					// cardUsable:function(card,player){
					// 	return false;
					// },
					// cardRespondable:function(card,player){
					// 	return false;
					// },
					// cardSavable:function(card,player){
					// 	return false;
					// },
					globalTo: function (from, to) {
						if (from == to.storage.liangou2) return -Infinity;
					},
				},
				onremove: true,
				trigger: { player: "damageBegin" },
				usable: 1,
				forced: true,
				popup: false,
				content: function () {
					trigger.num++;
				},
				// ai:{
				//     effect:{
				//         target:function(card,player,target){
				//             if(get.tag(card,'damage')) return [1,-2];
				//             if(get.tag(card,'respond')) return [1,-1];
				//         }
				//     }
				// }
			},
			xiyang: {
				trigger: { player: "phaseEnd" },
				filter: function (event, player) {
					return !player.isTurnedOver() && player.isDamaged();
				},
				check: function (event, player) {
					return player.hp <= 1;
				},
				content: function () {
					"step 0";
					player.turnOver();
					"step 1";
					player.recover(2);
				},
			},
			qinru: {
				trigger: { player: "useCardToBegin" },
				filter: function (event, player) {
					return (
						event.card.name == "sha" &&
						event.target != player &&
						event.target &&
						!event.target.hasSkill("fengyin")
					);
				},
				logTarget: "target",
				check: function (event, player) {
					return get.attitude(player, event.target) < 0;
				},
				intro: {
					content: "players",
					mark: function (dialog, storage, player) {
						var one = [],
							two = [],
							three = [];
						for (var i = 0; i < storage.length; i++) {
							switch (player.storage.qinru_turn[i]) {
								case 1:
									three.push(storage[i]);
									break;
								case 2:
									two.push(storage[i]);
									break;
								default:
									one.push(storage[i]);
							}
						}
						if (one.length) {
							dialog.addText("一回合前");
							dialog.addSmall(one);
						}
						if (two.length) {
							dialog.addText("两回合前");
							dialog.addSmall(two);
						}
						if (three.length) {
							dialog.addText("三回合前");
							dialog.addSmall(three);
						}
					},
				},
				init: function (player) {
					player.storage.qinru = [];
					player.storage.qinru_turn = [];
				},
				content: function () {
					"step 0";
					trigger.target.judge(function (card) {
						return get.suit(card) == "heart" ? 0 : -1;
					});
					"step 1";
					if (result.suit != "heart") {
						var target = trigger.target;
						var index = player.storage.qinru.indexOf(target);
						var num = _status.currentPhase == player ? 4 : 3;
						if (index === -1) {
							player.storage.qinru.push(target);
							player.storage.qinru_turn.push(num);
						} else {
							player.storage.qinru_turn[index] = num;
						}
						target.addTempSkill("fengyin", { player: "phaseAfter" });
						player.markSkill("qinru");
					}
				},
				ai: {
					expose: 0.2,
					threaten: 1.3,
				},
				subSkill: {
					die: {
						trigger: { global: "dieAfter" },
						silent: true,
						content: function () {
							var index = player.storage.qinru.indexOf(trigger.player);
							if (index != -1) {
								player.storage.qinru.splice(index, 1);
								player.storage.qinru_turn.splice(index, 1);
							}
							if (!player.storage.qinru.length) {
								player.unmarkSkill("qinru");
							} else {
								player.updateMarks();
							}
						},
					},
					count: {
						trigger: { player: "phaseAfter" },
						silent: true,
						content: function () {
							for (var i = 0; i < player.storage.qinru_turn.length; i++) {
								if (player.storage.qinru_turn[i] > 1) {
									player.storage.qinru_turn[i]--;
								} else {
									player.storage.qinru.splice(i, 1);
									player.storage.qinru_turn.splice(i, 1);
									i--;
								}
							}
							if (!player.storage.qinru.length) {
								player.unmarkSkill("qinru");
							} else {
								player.updateMarks();
							}
						},
					},
				},
				group: ["qinru_count", "qinru_die"],
			},
			yinshen: {
				trigger: { player: "loseEnd" },
				forced: true,
				filter: function (event, player) {
					if (player.countCards("h", { type: "basic" })) return false;
					for (var i = 0; i < event.cards.length; i++) {
						if (event.cards[i].original == "h" && get.type(event.cards[i]) == "basic")
							return true;
					}
					return false;
				},
				content: function () {
					player.tempHide();
				},
			},
			maichong: {
				trigger: { player: "useCard" },
				forced: true,
				filter: function (event, player) {
					if (!player.hasSkill("qinru") || !player.storage.qinru || !player.storage.qinru.length)
						return false;
					if (get.type(event.card) == "trick" && event.cards[0] && event.cards[0] == event.card) {
						for (var i = 0; i < player.storage.qinru.length; i++) {
							if (player.storage.qinru[i].isIn() && player.storage.qinru[i].countCards("he")) {
								return true;
							}
						}
					}
					return false;
				},
				autodelay: true,
				logTarget: function (event, player) {
					var list = [];
					for (var i = 0; i < player.storage.qinru.length; i++) {
						if (player.storage.qinru[i].isIn() && player.storage.qinru[i].countCards("he")) {
							list.push(player.storage.qinru[i]);
						}
					}
					return list;
				},
				content: function () {
					"step 0";
					event.list = player.storage.qinru.slice(0).sortBySeat();
					"step 1";
					if (event.list.length) {
						var target = event.list.shift();
						if (target.isIn()) {
							target.randomDiscard("he", false);
						}
						event.redo();
					}
				},
				ai: {
					threaten: 1.2,
					noautowuxie: true,
				},
			},
			mengji: {
				trigger: { source: "damageBegin" },
				forced: true,
				unique: true,
				filter: function (event, player) {
					return (
						player.storage.zhongdun &&
						!player.hujia &&
						event.card &&
						event.card.name == "sha" &&
						event.notLink()
					);
				},
				content: function () {
					trigger.num++;
				},
			},
			zhongdun: {
				unique: true,
				// alter:true,
				init2: function (player) {
					if (!player.storage.zhongdun) {
						player.changeHujia(get.is.altered("zhongdun") ? 6 : 8);
						player.storage.zhongdun = true;
					}
				},
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					return player.hujia > 0;
				},
				filterTarget: function (card, player, target) {
					return !target.hujia;
				},
				filterCard: true,
				position: "he",
				check: function (card) {
					var player = _status.event.player;
					if (
						game.hasPlayer(function (current) {
							return current.hp == 1 && get.attitude(player, current) > 2;
						})
					) {
						return 7 - get.value(card);
					}
					return 5 - get.value(card);
				},
				content: function () {
					player.changeHujia(-1);
					target.changeHujia();
				},
				ai: {
					order: 5,
					expose: 0.2,
					result: {
						target: function (player, target) {
							return 1 / Math.max(1, target.hp);
						},
					},
				},
			},
			maoding: {
				trigger: { player: "damageEnd", source: "damageEnd" },
				frequent: true,
				filter: function (event, player) {
					if (get.is.altered("maoding") && event.source != player) return false;
					return true;
				},
				// alter:true,
				content: function () {
					var list = get.typeCard("hslingjian");
					if (!list.length) {
						return;
					}
					player.gain(game.createCard(list.randomGet()), "gain2");
				},
				group: "maoding2",
				ai: {
					threaten: 1.5,
					maixie_defend: true,
				},
			},
			maoding2: {
				enable: "phaseUse",
				filter: function (event, player) {
					return player.countCards("h", { type: "hslingjian" }) > 1;
				},
				filterCard: { type: "hslingjian" },
				filterTarget: function (card, player, target) {
					return !target.hujia;
				},
				selectCard: 2,
				// usable:1,
				content: function () {
					target.changeHujia();
				},
				ai: {
					order: 9,
					result: {
						target: function (player, target) {
							return 2 / Math.max(1, Math.sqrt(target.hp));
						},
					},
				},
			},
			paotai: {
				enable: "phaseUse",
				intro: {
					content: function (storage) {
						var num;
						switch (storage) {
							case 1:
								num = 30;
								break;
							case 2:
								num = 60;
								break;
							case 3:
								num = 100;
								break;
						}
						return "结束阶段，有" + num + "%机率对一名随机敌人造成1点火焰伤害";
					},
				},
				init: function (player) {
					player.storage.paotai = 0;
				},
				filter: function (event, player) {
					return player.countCards("h", "sha") > 0 && player.storage.paotai < 3;
				},
				filterCard: { name: "sha" },
				content: function () {
					player.storage.paotai++;
					player.markSkill("paotai");
				},
				ai: {
					order: 5,
					threaten: 1.5,
					result: {
						player: 1,
					},
				},
				group: ["paotai2", "paotai3"],
			},
			paotai2: {
				trigger: { player: "phaseEnd" },
				forced: true,
				filter: function (event, player) {
					var num = 0;
					switch (player.storage.paotai) {
						case 1:
							num = 30;
							break;
						case 2:
							num = 60;
							break;
						case 3:
							num = 100;
							break;
					}
					return 100 * Math.random() < num;
				},
				content: function () {
					var targets = player.getEnemies();
					if (targets.length) {
						var target = targets.randomGet();
						target.addExpose(0.3);
						player.addExpose(0.3);
						target.damage("fire");
						player.line(target, "fire");
					}
				},
			},
			paotai3: {
				trigger: { player: "damageEnd" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return player.storage.paotai > 0 && event.num > 0;
				},
				content: function () {
					player.storage.paotai -= trigger.num;
					if (player.storage.paotai <= 0) {
						player.storage.paotai = 0;
						player.unmarkSkill("paotai");
					} else {
						player.updateMarks();
					}
				},
			},
			bfengshi: {
				trigger: { player: "shaBegin" },
				forced: true,
				// alter:true,
				check: function (event, player) {
					return get.attitude(player, event.target) <= 0;
				},
				filter: function (event, player) {
					if (player.hasSkill("bfengshi4")) return false;
					var num = 0.2;
					if (get.is.altered("bfengshi")) num = 0.15;
					return Math.random() < num * player.countUsed();
				},
				content: function () {
					trigger.directHit = true;
				},
				mod: {
					attackFrom: function (from, to, distance) {
						return distance - from.countUsed();
					},
				},
				group: ["bfengshi2", "bfengshi3"],
			},
			bfengshi2: {
				trigger: { source: "damageBegin" },
				forced: true,
				check: function (event, player) {
					return get.attitude(player, event.target) <= 0;
				},
				filter: function (event, player) {
					if (player.hasSkill("bfengshi4")) return false;
					var num = 0.2;
					if (get.is.altered("bfengshi")) num = 0.15;
					return event.card && event.card.name == "sha" && Math.random() < num * player.countUsed();
				},
				content: function () {
					trigger.num++;
				},
			},
			bfengshi3: {
				trigger: { player: "useCard" },
				silent: true,
				filter: function (event, player) {
					if (player.hasSkill("bfengshi4")) return false;
					return event.card.name == "sha";
				},
				content: function () {
					player.addTempSkill("bfengshi4");
				},
			},
			bfengshi4: {},
			yinbo: {
				enable: "phaseUse",
				usable: 1,
				filterCard: { suit: "spade" },
				position: "he",
				filter: function (event, player) {
					return player.countCards("he", { suit: "spade" }) > 0;
				},
				check: function (card) {
					return 7 - get.value(card);
				},
				content: function () {
					"step 0";
					var targets = player.getEnemies(function (target) {
						return target.countCards("he") > 0;
					});
					if (targets.length) {
						event.targets = targets.randomGets(3);
						event.targets.sort(lib.sort.seat);
						player.line(event.targets, "green");
					}
					"step 1";
					if (event.targets.length) {
						var target = event.targets.shift();
						var he = target.getCards("he");
						if (he.length) {
							target.addExpose(0.1);
							target.discard(he.randomGet());
						}
						event.redo();
					}
				},
				ai: {
					order: 10,
					expose: 0.3,
					result: {
						player: 1,
					},
				},
			},
			aqianghua: {
				enable: "phaseUse",
				usable: 1,
				// alter:true,
				filter: function (event, player) {
					return player.countCards("h") >= 1;
				},
				filterTarget: function (card, player, target) {
					return target != player;
				},
				filterCard: true,
				selectCard: -1,
				discard: false,
				prepare: "give",
				content: function () {
					target.gain(cards);
					if (!get.is.altered("aqianghua")) target.changeHujia();
					target.addSkill("aqianghua2");
				},
				ai: {
					threaten: 1.5,
					order: 2.1,
					result: {
						target: function (player, target) {
							if (target.hasSkillTag("nogain")) return 0;
							if (get.attitude(player, target) < 3) return 0;
							if (target.hasJudge("lebu")) return 0;
							if (target.hasSkill("aqianghua2")) return 0.1;
							return 1;
						},
					},
				},
			},
			aqianghua2: {
				trigger: { source: "damageBegin" },
				forced: true,
				content: function () {
					trigger.num++;
					player.unmarkSkill("aqianghua2");
					player.removeSkill("aqianghua2");
				},
				mark: true,
				intro: {
					content: "下一次造成的伤害+1",
				},
			},
			shihuo: {
				trigger: { global: "damageEnd" },
				forced: true,
				filter: function (event) {
					return event.hasNature("fire");
				},
				content: function () {
					player.draw();
				},
			},
			shoujia: {
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					return player.countCards("h") > 0;
				},
				filterCard: true,
				check: function (card) {
					return 6 - get.value(card);
				},
				discard: false,
				prepare: "give2",
				filterTarget: function (card, player, target) {
					return target != player && !target.hasSkill("shoujia2");
				},
				content: function () {
					target.storage.shoujia = cards[0];
					target.storage.shoujia2 = player;
					target.addSkill("shoujia2");
					target.syncStorage("shoujia");
				},
				ai: {
					order: 1,
					expose: 0.2,
					threaten: 1.4,
					result: {
						target: -1,
					},
				},
			},
			shoujia2: {
				mark: true,
				trigger: { player: "useCardToBegin" },
				forced: true,
				filter: function (event, player) {
					return (
						get.suit(event.card) == get.suit(player.storage.shoujia) &&
						event.target &&
						event.target != player
					);
				},
				content: function () {
					"step 0";
					player.showCards([player.storage.shoujia], get.translation(player) + "发动了【兽夹】");
					"step 1";
					player.storage.shoujia.discard();
					delete player.storage.shoujia;
					delete player.storage.shoujia2;
					player.removeSkill("shoujia2");
					game.addVideo("storage", player, ["shoujia", null]);
					game.addVideo("storage", player, ["shoujia2", null]);
					player.turnOver(true);
				},
				intro: {
					mark: function (dialog, content, player) {
						if (player.storage.shoujia2 && player.storage.shoujia2.isUnderControl(true)) {
							dialog.add([player.storage.shoujia]);
						} else {
							return "已成为" + get.translation(player.storage.shoujia2) + "的兽夹目标";
						}
					},
					content: function (content, player) {
						if (player.storage.shoujia2 && player.storage.shoujia2.isUnderControl(true)) {
							return get.translation(player.storage.shoujia);
						}
						return "已成为" + get.translation(player.storage.shoujia2) + "的兽夹目标";
					},
				},
				group: "shoujia3",
			},
			shoujia3: {
				trigger: { global: "damageEnd" },
				forced: true,
				filter: function (event, player) {
					return event.player == player.storage.shoujia2;
				},
				content: function () {
					player.storage.shoujia.discard();
					player.$throw(player.storage.shoujia);
					game.log(player.storage.shoujia, "被置入弃牌堆");
					delete player.storage.shoujia;
					delete player.storage.shoujia2;
					player.removeSkill("shoujia2");
					game.addVideo("storage", player, ["shoujia", null]);
					game.addVideo("storage", player, ["shoujia2", null]);
				},
			},
			liudan: {
				trigger: { player: "useCard" },
				check: function (event, player) {
					return (
						game.countPlayer(function (current) {
							if (
								event.targets.includes(current) == false &&
								current != player &&
								lib.filter.targetEnabled(event.card, player, current)
							) {
								return get.effect(current, event.card, player, player);
							}
						}) >= 0
					);
				},
				filter: function (event, player) {
					if (event.card.name != "sha") return false;
					return game.hasPlayer(function (current) {
						return (
							event.targets.includes(current) == false &&
							current != player &&
							lib.filter.targetEnabled(event.card, player, current)
						);
					});
				},
				content: function () {
					var list = game.filterPlayer(function (current) {
						return (
							trigger.targets.includes(current) == false &&
							current != player &&
							lib.filter.targetEnabled(trigger.card, player, current)
						);
					});
					if (list.length) {
						var list2 = [];
						for (var i = 0; i < list.length; i++) {
							if (Math.random() < 0.5) {
								list2.push(list[i]);
								trigger.targets.push(list[i]);
							}
						}
						if (list2.length) {
							game.log(list2, "被追加为额外目标");
							player.line(list2, "green");
						}
					}
				},
			},
			shenqiang: {
				trigger: { source: "damageEnd" },
				forced: true,
				filter: function (event, player) {
					return event.card && event.card.name == "sha" && _status.currentPhase == player;
				},
				content: function () {
					player.getStat().card.sha--;
				},
			},
			tiandan: {
				trigger: { player: "phaseDrawBegin" },
				filter: function (event, player) {
					return (
						Math.min(5, player.hp) > player.countCards("h") &&
						!player.skipList.includes("phaseUse") &&
						!player.skipList.includes("phaseDiscard")
					);
				},
				check: function (event, player) {
					var nh = player.countCards("h");
					if (Math.min(5, player.hp) - nh >= 2) return true;
					return false;
				},
				content: function () {
					var num = Math.min(5, player.hp) - player.countCards("h");
					var cards = [];
					while (num--) {
						cards.push(game.createCard("sha"));
					}
					player.gain(cards, "gain2");
					player.skip("phaseUse");
					player.skip("phaseDiscard");
				},
			},
			shanguang: {
				enable: "phaseUse",
				usable: 1,
				filterCard: { suit: "diamond" },
				position: "he",
				filter: function (event, player) {
					return player.countCards("he", { suit: "diamond" }) > 0;
				},
				filterTarget: function (card, player, target) {
					return target != player && get.distance(player, target, "attack") <= 1;
				},
				check: function (card) {
					if (card.name == "sha" && _status.event.player.countCards("h", "sha") < 3) return 0;
					return 6 - get.value(card);
				},
				content: function () {
					target.addTempSkill("shanguang2");
				},
				ai: {
					order: 7.9,
					result: {
						target: function (player, target) {
							var nh = target.countCards("h");
							if (
								get.attitude(player, target) < 0 &&
								nh >= 3 &&
								player.canUse("sha", target) &&
								player.countCards("h", "sha") &&
								get.effect(target, { name: "sha" }, player, player) > 0
							) {
								return -nh - 5;
							}
							return -nh;
						},
					},
				},
			},
			shanguang2: {
				mod: {
					cardEnabled: function () {
						return false;
					},
					cardUsable: function () {
						return false;
					},
					cardRespondable: function () {
						return false;
					},
					cardSavable: function () {
						return false;
					},
				},
				ai: {
					effect: {
						target: function (card, player, target, current) {
							if (get.tag(card, "respondShan") || get.tag(card, "respondSha")) {
								if (current < 0) return 1.5;
							}
						},
					},
				},
			},
			baoxue: {
				enable: "phaseUse",
				init: function (player) {
					player.storage.baoxue = false;
				},
				intro: {
					content: "limited",
				},
				mark: true,
				unique: true,
				skillAnimation: true,
				animationColor: "water",
				line: "thunder",
				filter: function (event, player) {
					return !player.storage.baoxue && player.countCards("he", { color: "black" }) > 0;
				},
				filterTarget: function (card, player, target) {
					return target != player;
				},
				selectTarget: function () {
					return [1, _status.event.player.countCards("he", { color: "black" })];
				},
				// alter:true,
				delay: false,
				contentBefore: function () {
					"step 0";
					game.delayx();
					"step 1";
					player.storage.baoxue = true;
					player.awakenSkill("baoxue");
					player.showHandcards();
					player.discard(player.getCards("he", { color: "black" }));
				},
				content: function () {
					"step 0";
					if (!get.is.altered("baoxue")) {
						var he = target.getCards("he");
						if (he.length) {
							target.discard(he.randomGet());
						}
					}
					"step 1";
					target.turnOver(true);
				},
				contentAfter: function () {
					player.turnOver(true);
				},
				ai: {
					order: function (skill, player) {
						var num = game.countPlayer(function (current) {
							return get.attitude(player, current) < 0;
						});
						var nh = player.countCards("he", { color: "black" });
						if (nh == 1 && num > 1) return 0;
						if (nh > num) return 1;
						return 11;
					},
					result: {
						target: function (player, target) {
							if (target.hasSkillTag("noturn")) return 0;
							if (player.hasUnknown()) return 0;
							return -1;
						},
					},
				},
			},
			mianzhen: {
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					return player.countCards("he") > 0;
				},
				filterTarget: function (card, player, target) {
					return target != player && !target.hasSkill("mianzhen2");
				},
				filterCard: true,
				position: "he",
				check: function (card) {
					return 8 - get.value(card);
				},
				content: function () {
					"step 0";
					target.chooseToRespond({ name: "shan" });
					"step 1";
					if (!result.bool) target.addSkill("mianzhen2");
				},
				ai: {
					order: 2.2,
					result: {
						target: function (player, target) {
							return Math.min(-0.1, -1 - target.countCards("h") + Math.sqrt(target.hp) / 2);
						},
					},
				},
			},
			mianzhen2: {
				mark: true,
				intro: {
					content: "不能使用或打出手牌直到受到伤害或下一回合结束",
				},
				trigger: { player: ["damageEnd", "phaseEnd"] },
				forced: true,
				popup: false,
				content: function () {
					player.removeSkill("mianzhen2");
				},
				mod: {
					cardEnabled2: function (card) {
						if (get.position(card) == "h") return false;
					},
				},
				ai: {
					threaten: 0.6,
				},
			},
			zhiyuan: {
				trigger: { source: "damageBefore" },
				check: function (event, player) {
					player.disableSkill("tmp", "zhiyuan");
					var eff = get.damageEffect(event.player, player, player);
					var att = get.attitude(player, event.player);
					var bool = false;
					if (att > 0) {
						if (eff <= 0 || event.player.hp < event.player.maxHp) {
							bool = true;
						}
					} else {
						if (eff < 0 && event.player.hp == event.player.maxHp) {
							bool = true;
						}
					}
					player.enableSkill("tmp", "zhiyuan");
					return bool;
				},
				logTarget: "player",
				filter: function (event, player) {
					return event.num > 0;
				},
				content: function () {
					trigger.cancel();
					trigger.player.recover(trigger.num);
				},
				ai: {
					effect: {
						player: function (card, player, target) {
							if (get.tag(card, "damage") && get.attitude(player, target) > 0) {
								if (
									target.hp == target.maxHp ||
									get.recoverEffect(target, player, player) <= 0
								)
									return "zeroplayertarget";
								return [0, 0, 0, 1];
							}
						},
					},
				},
			},
			duwen: {
				trigger: { source: "damageBegin" },
				check: function (event, player) {
					return get.attitude(player, event.player) <= 0;
				},
				forced: true,
				filter: function (event, player) {
					return player.countCards("h") == event.player.countCards("h") && event.notLink();
				},
				content: function () {
					trigger.num++;
				},
				ai: {
					threaten: 1.5,
				},
			},
			duwen2: {
				trigger: { source: "damageEnd" },
				forced: true,
				filter: function (event, player) {
					return (
						event.card &&
						event.card.name == "sha" &&
						player.hp == event.player.hp &&
						event.notLink()
					);
				},
				content: function () {
					player.draw(2);
				},
			},
			juji: {
				enable: "phaseUse",
				usable: 1,
				position: "he",
				filter: function (event, player) {
					return player.countCards("he") > 0;
				},
				filterCard: function (card) {
					var suit = get.suit(card);
					for (var i = 0; i < ui.selected.cards.length; i++) {
						if (get.suit(ui.selected.cards[i]) == suit) return false;
					}
					return true;
				},
				complexCard: true,
				filterTarget: function (card, player, target) {
					return target != player && target.countCards("h") > 0;
				},
				check: function (card) {
					if (ui.selected.cards.length > 1) return 0;
					return 5 - get.value(card);
				},
				selectCard: [1, 4],
				content: function () {
					var suits = [];
					for (var i = 0; i < cards.length; i++) {
						suits.push(get.suit(cards[i]));
					}
					var success = false;
					for (var i = 0; i < suits.length; i++) {
						if (target.countCards("h", { suit: suits[i] })) {
							success = true;
							break;
						}
					}
					if (!success) {
						player.popup("失败");
					} else {
						player.popup("成功");
						player.addSkill("juji2");
						player.storage.juji2 = target;
						player.markSkillCharacter(
							"juji2",
							target,
							"狙击",
							"与" +
								get.translation(target) +
								"的距离视为1且" +
								get.translation(target) +
								"不能闪避你的杀，直到回合结束"
						);
					}
				},
				ai: {
					order: 4,
					result: {
						target: function (player, target) {
							if (!player.countCards("h", "sha")) return 0;
							if (target.countCards("h") <= 1 && get.distance(player, target, "attack") <= 1)
								return 0;
							var min = [];
							var num = 0;
							var players = game.filterPlayer();
							for (var i = 0; i < players.length; i++) {
								if (players[i] != player && player.canUse("sha", players[i], false)) {
									var eff = get.effect(players[i], { name: "sha" }, player, player);
									if (eff > num) {
										min.length = 0;
										min.push(players[i]);
										num = eff;
									}
								}
							}
							for (var i = 0; i < min.length; i++) {
								if (get.attitude(player, min[i]) > 0) return 0;
								if (
									min[i].countCards("h") <= 1 &&
									get.distance(player, min[i], "attack") <= 1
								)
									return 0;
							}
							if (min.includes(target)) return -1;
							return 0;
						},
					},
				},
			},
			juji2: {
				ai: {
					effect: {
						player: function (card, player, target) {
							if (card.name == "sha" && target == player.storage.juji2) return [1, 0, 1, -1];
						},
					},
				},
				trigger: { player: "phaseAfter" },
				forced: true,
				popup: false,
				content: function () {
					player.unmarkSkill("juji2");
					player.removeSkill("juji2");
					delete player.storage.juji2;
				},
				group: "juji3",
			},
			juji3: {
				trigger: { player: "shaBegin" },
				forced: true,
				filter: function (event, player) {
					return event.target == player.storage.juji2;
				},
				content: function () {
					trigger.directHit = true;
				},
				mod: {
					globalFrom: function (from, to) {
						if (to == from.storage.juji2) return -Infinity;
					},
				},
			},
			dulei: {
				enable: "phaseUse",
				filter: function (event, player) {
					return !player.hasSkill("dulei2");
				},
				filterCard: true,
				check: function (card) {
					return 6 - get.value(card);
				},
				discard: false,
				prepare: function (cards, player) {
					player.$give(1, player, false);
				},
				content: function () {
					player.storage.dulei = cards[0];
					player.addSkill("dulei2");
					player.syncStorage("dulei");
				},
				ai: {
					order: 1,
					result: {
						player: 1,
					},
				},
			},
			dulei2: {
				mark: true,
				trigger: { target: "useCardToBegin" },
				forced: true,
				filter: function (event, player) {
					return event.player != player && get.suit(event.card) == get.suit(player.storage.dulei);
				},
				content: function () {
					"step 0";
					player.showCards([player.storage.dulei], get.translation(player) + "发动了【诡雷】");
					"step 1";
					player.storage.dulei.discard();
					delete player.storage.dulei;
					player.removeSkill("dulei2");
					game.addVideo("storage", player, ["dulei", null]);
					trigger.player.loseHp();
					"step 2";
					var he = trigger.player.getCards("he");
					if (he.length) {
						trigger.player.discard(he.randomGet());
					}
				},
				intro: {
					mark: function (dialog, content, player) {
						if (player == game.me || player.isUnderControl()) {
							dialog.add([player.storage.dulei]);
						} else {
							return "已发动诡雷";
						}
					},
					content: function (content, player) {
						if (player == game.me || player.isUnderControl()) {
							return get.translation(player.storage.dulei);
						}
						return "已发动诡雷";
					},
				},
			},
			bingqiang: {
				enable: "phaseUse",
				position: "he",
				filterCard: function (card) {
					var color = get.color(card);
					for (var i = 0; i < ui.selected.cards.length; i++) {
						if (get.color(ui.selected.cards[i]) != color) return false;
					}
					return true;
				},
				selectCard: [1, Infinity],
				complexCard: true,
				filterTarget: function (card, player, target) {
					return (
						!target.hasSkill("bingqiang2") &&
						!target.hasSkill("bingqiang5") &&
						!target.next.hasSkill("bingqiang2") &&
						!target.next.hasSkill("bingqiang5") &&
						!target.previous.hasSkill("bingqiang2") &&
						!target.previous.hasSkill("bingqiang5")
					);
				},
				check: function (card) {
					if (ui.selected.cards.length) return 0;
					var player = _status.event.player;
					var max = 0,
						min = 0,
						players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (!lib.skill.bingqiang.filterTarget(null, player, players[i])) continue;
						var num = lib.skill.bingqiang.ai.result.playerx(player, players[i]);
						if (num > max) {
							max = num;
						}
						if (num < min) {
							min = num;
						}
					}
					if (max == -min) {
						return 5 - get.value(card);
					} else if (max > -min) {
						if (get.color(card) == "red") return 5 - get.value(card);
					} else {
						if (get.color(card) == "black") return 5 - get.value(card);
					}
					return 0;
				},
				changeTarget: function (player, targets) {
					var target = targets[0];
					var add = game.filterPlayer(function (player) {
						return get.distance(target, player, "pure") == 1;
					});
					for (var i = 0; i < add.length; i++) {
						targets.add(add[i]);
					}
				},
				content: function () {
					if (get.color(cards[0]) == "red") {
						target.storage.bingqiang2 = cards.length;
						target.addSkill("bingqiang2");
					} else {
						target.storage.bingqiang5 = cards.length;
						target.addSkill("bingqiang5");
					}
					if (!player.storage.bingqiang) {
						player.storage.bingqiang = [];
					}
					player.storage.bingqiang.add(target);
				},
				ai: {
					order: 11,
					result: {
						playerx: function (player, target) {
							var targets = game.filterPlayer(function (player) {
								return player == target || get.distance(target, player, "pure") == 1;
							});
							var num = 0;
							for (var i = 0; i < targets.length; i++) {
								num += get.attitude(player, targets[i]);
							}
							return num;
						},
						player: function (player, target) {
							var num = lib.skill.bingqiang.ai.result.playerx(player, target);
							if (ui.selected.cards.length) {
								if (get.color(ui.selected.cards[0]) == "black") {
									return -num;
								} else {
									return num;
								}
							}
							return 0;
						},
					},
				},
				group: "bingqiang_remove",
			},
			bingqiang_remove: {
				trigger: { player: ["phaseBegin", "dieBegin"] },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return player.storage.bingqiang && player.storage.bingqiang.length > 0;
				},
				content: function () {
					for (var i = 0; i < player.storage.bingqiang.length; i++) {
						player.storage.bingqiang[i].removeSkill("bingqiang2");
						player.storage.bingqiang[i].removeSkill("bingqiang5");
					}
					player.storage.bingqiang = [];
				},
			},
			bingqiang2: {
				mark: true,
				intro: {
					content: "防御距离+#",
				},
				mod: {
					globalTo: function (from, to, distance) {
						if (typeof to.storage.bingqiang2 == "number") return distance + to.storage.bingqiang2;
					},
				},
			},
			bingqiang3: {
				mark: true,
				intro: {
					content: "防御距离-#",
				},
				mod: {
					globalTo: function (from, to, distance) {
						if (typeof to.storage.bingqiang3 == "number") return distance - to.storage.bingqiang3;
					},
				},
			},
			bingqiang4: {
				mark: true,
				intro: {
					content: "进攻距离+#",
				},
				mod: {
					globalFrom: function (from, to, distance) {
						if (typeof from.storage.bingqiang4 == "number")
							return distance - from.storage.bingqiang4;
					},
				},
			},
			bingqiang5: {
				mark: true,
				intro: {
					content: "进攻距离-#",
				},
				mod: {
					globalFrom: function (from, to, distance) {
						if (typeof from.storage.bingqiang5 == "number")
							return distance + from.storage.bingqiang5;
					},
				},
			},
			jidong: {
				trigger: { global: "phaseEnd" },
				filter: function (event, player) {
					return player.hp == 1 && !player.isTurnedOver();
				},
				// alter:true,
				content: function () {
					"step 0";
					player.turnOver();
					player.recover(2);
					"step 1";
					if (player.isTurnedOver() && !get.is.altered("jidong")) {
						player.addTempSkill("jidong2", { player: "turnOverAfter" });
					}
				},
				ai: {
					threaten: function (player, target) {
						if (target.hp == 1) return 2;
						return 1;
					},
				},
			},
			jidong2: {
				trigger: { player: "damageBefore" },
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
							if (get.tag(card, "damage")) return [0, 0];
						},
					},
				},
				mod: {
					targetEnabled: function (card, player, target) {
						if (player != target) return false;
					},
				},
			},
			chongzhuang: {
				trigger: { source: "damageEnd" },
				forced: true,
				filter: function (event, player) {
					return player.storage.jijia <= 0 && event.num > 0;
				},
				popup: false,
				unique: true,
				content: function () {
					player.storage.jijia2 += trigger.num;
					if (player.storage.jijia2 >= 4) {
						player.storage.jijia = 4;
						player.storage.jijia2 = 0;
						player.markSkill("jijia");
						if (lib.config.skill_animation_type != "off") {
							player.logSkill("chongzhuang");
							player.$skill("重装");
						}
					}
				},
			},
			tuijin: {
				enable: "phaseUse",
				usable: 1,
				unique: true,
				filter: function (event, player) {
					if (player.storage.jijia > 0) {
						return game.hasPlayer(function (current) {
							return get.distance(player, current) > 1;
						});
					}
					return false;
				},
				filterTarget: function (card, player, target) {
					return target != player && get.distance(player, target) > 1;
				},
				content: function () {
					player.storage.tuijin2 = target;
					player.addTempSkill("tuijin2");
				},
				ai: {
					order: 11,
					result: {
						target: function (player, target) {
							if (get.attitude(player, target) < 0) {
								if (get.distance(player, target) > 2) return -1.5;
								return -1;
							}
							return 0.3;
						},
					},
				},
			},
			tuijin2: {
				mod: {
					globalFrom: function (from, to) {
						if (to == from.storage.tuijin2) return -Infinity;
					},
				},
				mark: "character",
				intro: {
					content: "与$的距离视为1直到回合结束",
				},
				onremove: true,
			},
			jijia: {
				mark: true,
				unique: true,
				init: function (player) {
					player.storage.jijia = 4;
					player.storage.jijia2 = 0;
				},
				intro: {
					content: "机甲体力值：#",
				},
				mod: {
					maxHandcard: function (player, num) {
						if (player.storage.jijia > 0) {
							return num + player.storage.jijia;
						}
					},
				},
				trigger: { player: "changeHp" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return player.storage.jijia > 0 && event.parent.name == "damage" && event.num < 0;
				},
				content: function () {
					player.hp -= trigger.num;
					player.update();
					player.storage.jijia += trigger.num;
					if (player.storage.jijia <= 0) {
						player.unmarkSkill("jijia");
					} else {
						player.updateMarks();
					}
				},
				ai: {
					threaten: function (player, target) {
						if (target.storage.jijia <= 0) return 2;
						return 1;
					},
				},
			},
			zihui: {
				enable: "phaseUse",
				filter: function (event, player) {
					return player.storage.jijia > 0;
				},
				filterTarget: function (card, player, target) {
					return target != player && get.distance(player, target) <= 2;
				},
				unique: true,
				selectTarget: -1,
				skillAnimation: true,
				animationColor: "fire",
				line: "fire",
				// alter:true,
				content: function () {
					"step 0";
					var num = player.storage.jijia;
					if (get.is.altered("zihui")) {
						num = Math.max(1, Math.min(num, target.countCards("he")));
					}
					target.chooseToDiscard(
						num,
						"he",
						"弃置" + get.cnNumber(num) + "张牌，或受到2点火焰伤害"
					).ai = function (card) {
						if (target.hasSkillTag("nofire")) return 0;
						if (get.type(card) != "basic") return 11 - get.value(card);
						if (target.hp > 4) return 7 - get.value(card);
						if (target.hp == 4 && num >= 3) return 7 - get.value(card);
						if (target.hp == 3 && num >= 4) return 7 - get.value(card);
						if (num > 1) return 8 - get.value(card);
						return 10 - get.value(card);
					};
					"step 1";
					if (!result.bool) {
						target.damage(2, "fire");
					}
					if (target == targets[targets.length - 1]) {
						player.storage.jijia = 0;
						player.unmarkSkill("jijia");
					}
				},
				ai: {
					order: 2,
					result: {
						player: function (player) {
							var num = 0;
							var players = game.filterPlayer();
							for (var i = 0; i < players.length; i++) {
								if (
									players[i] == player ||
									players[i].hasSkillTag("nofire") ||
									get.distance(player, players[i]) > 2
								)
									continue;
								var nh = players[i].countCards("h");
								var att = get.attitude(player, players[i]);
								if (nh < player.storage.jijia) {
									if (att < 0) {
										if (players[i].hp <= 2) {
											num += 2;
										} else {
											num += 1.5;
										}
									} else if (att > 0) {
										if (players[i].hp <= 2) {
											num -= 2;
										} else {
											num -= 1.5;
										}
									}
								} else if (nh == player.storage.jijia) {
									if (att < 0) {
										num += 0.5;
									} else if (att > 0) {
										num -= 0.5;
									}
								}
							}
							if (num >= 2) return 1;
							return 0;
						},
					},
				},
			},
			xiandan: {
				trigger: { player: "shaBegin" },
				direct: true,
				content: function () {
					"step 0";
					var dis =
						trigger.target.countCards("h", "shan") ||
						trigger.target.hasSkillTag(
							"freeShan",
							false,
							{
								player: player,
								card: trigger.card,
							},
							true
						) ||
						trigger.target.countCards("h") > 2;
					var att = get.attitude(player, trigger.target);
					var next = player.chooseToDiscard(get.prompt("xiandan"));
					next.ai = function (card) {
						if (att) return 0;
						if (dis) return 7 - get.value(card);
						return 0;
					};
					next.logSkill = "xiandan";
					"step 1";
					if (result.bool) {
						if (get.color(result.cards[0]) == "red") {
							trigger.directHit = true;
						} else {
							player.addTempSkill("xiandan2", "shaAfter");
						}
					}
				},
			},
			xiandan2: {
				trigger: { source: "damageBegin" },
				filter: function (event) {
					return event.card && event.card.name == "sha" && event.notLink();
				},
				forced: true,
				popup: false,
				content: function () {
					trigger.num++;
				},
			},
			shouge: {
				trigger: { source: "dieAfter" },
				frequent: true,
				content: function () {
					player.gain(game.createCard("zhiliaobo"), "gain2");
				},
			},
			tuji: {
				mod: {
					globalFrom: function (from, to, distance) {
						if (_status.currentPhase == from) {
							return distance - from.countUsed();
						}
					},
				},
			},
			mujing: {
				enable: ["chooseToRespond", "chooseToUse"],
				filterCard: function (card) {
					return get.color(card) == "black";
				},
				position: "he",
				viewAs: { name: "sha" },
				viewAsFilter: function (player) {
					if (!player.countCards("he", { color: "black" })) return false;
				},
				prompt: "将一张黑色牌当杀使用或打出",
				check: function (card) {
					return 4 - get.value(card);
				},
				ai: {
					skillTagFilter: function (player) {
						if (!player.countCards("he", { color: "black" })) return false;
					},
					respondSha: true,
				},
				group: "mujing2",
			},
			mujing2: {
				trigger: { player: "shaMiss" },
				forced: true,
				popup: false,
				filter: function (event) {
					return !event.parent._mujinged;
				},
				content: function () {
					trigger.parent._mujinged = true;
					player.getStat().card.sha--;
				},
			},
			lichang: {
				trigger: { player: "phaseEnd" },
				direct: true,
				filter: function (event, player) {
					return player.countCards("he", { color: "red" }) > 0;
				},
				content: function () {
					"step 0";
					var next = player.chooseToDiscard(get.prompt("lichang"), "he", { color: "red" });
					next.logSkill = "lichang";
					next.ai = function (card) {
						return 6 - get.value(card);
					};
					"step 1";
					if (result.bool) {
						player.addSkill("lichang2");
					}
				},
			},
			lichang2: {
				trigger: { player: "phaseBegin" },
				direct: true,
				mark: true,
				intro: {
					content: "下个准备阶段令一名距离1以内的角色回复1点体力或摸两张牌",
				},
				content: function () {
					"step 0";
					player.chooseTarget(get.prompt("lichang"), function (card, player, target) {
						return get.distance(player, target) <= 1;
					}).ai = function (target) {
						var att = get.attitude(player, target);
						if (att > 0) {
							if (target.hp == 1 && target.maxHp > 1) return att * 2;
						}
						return att;
					};
					player.removeSkill("lichang2");
					"step 1";
					if (result.bool) {
						player.logSkill("lichang", result.targets);
						result.targets[0].chooseDrawRecover(2, true);
					}
				},
			},
			zhanlong: {
				trigger: { player: "phaseBegin" },
				unique: true,
				mark: true,
				skillAnimation: true,
				init: function (player) {
					player.storage.zhanlong = false;
				},
				check: function (event, player) {
					if (player.hasJudge("lebu")) return false;
					return true;
				},
				filter: function (event, player) {
					if (player.storage.zhanlong) return false;
					if (player.countCards("he") == 0) return false;
					if (player.hp != 1) return false;
					return true;
				},
				content: function () {
					"step 0";
					player.discard(player.getCards("he"));
					"step 1";
					player.addTempSkill("zhanlong2");
					player.awakenSkill("zhanlong");
					player.storage.zhanlong = true;
					var cards = [];
					for (var i = 0; i < 3; i++) {
						cards.push(game.createCard("sha"));
					}
					player.gain(cards, "gain2");
				},
				ai: {
					threaten: function (player, target) {
						if (target.hp == 1) return 3;
						return 1;
					},
					effect: {
						target: function (card, player, target) {
							if (!target.hasFriend()) return;
							if (
								get.tag(card, "damage") == 1 &&
								target.hp == 2 &&
								target.countCards("he") &&
								!target.isTurnedOver() &&
								_status.currentPhase != target
							) {
								if (get.distance(_status.currentPhase, target, "absolute") <= 2)
									return [0.5, 1];
								return 0.8;
							}
						},
					},
				},
				intro: {
					content: "limited",
				},
			},
			zhanlong2: {
				mod: {
					cardUsable: function (card) {
						if (card.name == "sha") return Infinity;
					},
				},
			},
			feiren: {
				trigger: { source: "damageBegin" },
				forced: true,
				// alter:true,
				filter: function (event, player) {
					return (
						!get.is.altered("feiren") &&
						event.card &&
						event.card.name == "sha" &&
						get.suit(event.card) == "spade" &&
						event.notLink()
					);
				},
				content: function () {
					trigger.num++;
				},
				mod: {
					targetInRange: function (card) {
						if (card.name == "sha") return true;
					},
					selectTarget: function (card, player, range) {
						if (card.name == "sha" && range[1] != -1 && get.suit(card) == "club") {
							range[1]++;
						}
					},
				},
				ai: {
					threaten: 1.4,
				},
			},
			feiren3: {
				trigger: { player: "useCardAfter" },
				filter: function (event, player) {
					if (event.parent.name == "feiren2") return false;
					if (event.card.name != "sha") return false;
					if (get.suit(event.card) != "spade") return false;
					var card = game.createCard(
						event.card.name,
						event.card.suit,
						event.card.number,
						event.card.nature
					);
					for (var i = 0; i < event.targets.length; i++) {
						if (!event.targets[i].isIn()) return false;
						if (!player.canUse({ name: event.card.name }, event.targets[i], false, false)) {
							return false;
						}
					}
					return true;
				},
				content: function () {
					var card = game.createCard(
						trigger.card.name,
						trigger.card.suit,
						trigger.card.number,
						trigger.card.nature
					);
					player.useCard(card, trigger.targets);
				},
				ai: {
					threaten: 1.3,
				},
			},
			xie: {
				enable: "phaseUse",
				unique: true,
				filterTarget: function (card, player, target) {
					return target != player && !target.hasSkill("xie2");
				},
				filter: function (event, player) {
					return player.countCards("h", { suit: "heart" });
				},
				filterCard: { suit: "heart" },
				check: function (card) {
					return 7 - get.value(card);
				},
				content: function () {
					var current = game.findPlayer(function (player) {
						return player.hasSkill("xie2");
					});
					if (current) {
						current.removeSkill("xie2");
					}
					target.addSkill("xie2");
					target.storage.xie = "now";
					target.storage.xie2 = player;
				},
				ai: {
					expose: 0.2,
					order: 9.1,
					threaten: 2,
					result: {
						target: function (player, target) {
							var current = game.findPlayer(function (player) {
								return player.hasSkill("xie2");
							});
							if (current && get.recoverEffect(current, player, player) > 0) {
								return 0;
							}
							return get.recoverEffect(target, player, target);
						},
					},
				},
			},
			xie2: {
				mark: true,
				trigger: { global: "phaseEnd" },
				forced: true,
				filter: function (event, player) {
					if (player.storage.xie == "now") {
						return event.player == player;
					}
					var num = game.phaseNumber - player.storage.xie;
					return num && num % 6 == 0;
				},
				content: function () {
					if (player.storage.xie == "now") {
						player.storage.xie = game.phaseNumber;
					}
					player.recover();
				},
				intro: {
					content: function (storage, player) {
						var str = "每隔六回合回复1点体力，直到" + get.translation(storage) + "死亡";
						if (typeof player.storage.xie == "number") {
							var num = game.phaseNumber - player.storage.xie;
							num = num % 6;
							if (num == 0) {
								str += "（下次生效于本回合）";
							} else {
								str += "（下次生效于" + (6 - num) + "回合后）";
							}
						}
						return str;
					},
					onunmark: function (storage, player) {
						delete player.storage.xie;
						delete player.storage.xie2;
					},
				},
				group: ["xie3", "xie4"],
			},
			xie3: {
				trigger: { global: "phaseBegin" },
				forced: true,
				popup: false,
				content: function () {
					var num = game.phaseNumber - player.storage.xie;
					num = num % 6;
					if (num) {
						num = 6 - num;
					}
					player.storage.xie2_markcount = num;
					player.updateMarks();
				},
			},
			xie4: {
				trigger: { global: "dieAfter" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return event.player == player.storage.xie2;
				},
				content: function () {
					game.log(player, "解除了", "【谐】");
					player.removeSkill("xie2");
				},
			},
			luan: {
				enable: "phaseUse",
				unique: true,
				filterTarget: function (card, player, target) {
					return target != player && !target.hasSkill("luan2");
				},
				filter: function (event, player) {
					return player.countCards("h", { suit: "spade" });
				},
				filterCard: { suit: "spade" },
				check: function (card) {
					return 7 - get.value(card);
				},
				content: function () {
					var current = game.findPlayer(function (player) {
						return player.hasSkill("luan2");
					});
					if (current) {
						current.removeSkill("luan2");
					}
					target.addSkill("luan2");
					// target.storage.luan='now';
					target.storage.luan2 = player;
				},
				ai: {
					expose: 0.2,
					order: 9.1,
					threaten: 2,
					result: {
						target: function (player, target) {
							var current = game.findPlayer(function (player) {
								return player.hasSkill("luan2");
							});
							if (current && get.attitude(player, current) < 0) {
								return 0;
							}
							if (target.hp == 1) return 0.5;
							return -1;
						},
					},
				},
			},
			luan2: {
				mark: true,
				intro: {
					content: "受到的伤害后失去1点体力，直到首次进入濒死状态",
				},
				trigger: { player: "damageEnd" },
				forced: true,
				content: function () {
					player.loseHp();
				},
				ai: {
					threaten: 1.2,
				},
				group: ["luan3", "luan4"],
			},
			luan3: {
				trigger: { player: "dyingAfter" },
				forced: true,
				popup: false,
				content: function () {
					game.log(player, "解除了", "【乱】");
					player.removeSkill("luan2");
				},
			},
			luan4: {
				trigger: { global: "dieAfter" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return event.player == player.storage.luan2;
				},
				content: function () {
					game.log(player, "解除了", "【乱】");
					player.removeSkill("luan2");
				},
			},
			sheng: {
				enable: "phaseUse",
				unique: true,
				mark: true,
				skillAnimation: true,
				animationColor: "metal",
				init: function (player) {
					player.storage.sheng = false;
				},
				filter: function (event, player) {
					if (player.storage.sheng) return false;
					return true;
				},
				filterTarget: function (card, player, target) {
					return target.isDamaged();
				},
				selectTarget: [1, Infinity],
				contentBefore: function () {
					player.turnOver();
					player.addSkill("sheng2");
					player.awakenSkill("sheng");
					player.storage.sheng = true;
				},
				content: function () {
					target.recover();
				},
				ai: {
					order: 1,
					result: {
						target: function (player, target) {
							var eff = get.recoverEffect(target, player, target);
							if (player.hp == 1) return eff;
							if (player.hasUnknown()) return 0;
							var num1 = 0,
								num2 = 0,
								num3 = 0,
								players = game.filterPlayer();
							for (var i = 0; i < players.length; i++) {
								if (get.attitude(player, players[i]) > 0) {
									num1++;
									if (players[i].isDamaged()) {
										num2++;
										if (players[i].hp <= 1) {
											num3++;
										}
									}
								}
							}
							if (num1 == num2) return eff;
							if (num2 == num1 - 1 && num3) return eff;
							if (num3 >= 2) return eff;
							return 0;
						},
					},
				},
				intro: {
					content: "limited",
				},
			},
			sheng2: {
				trigger: { player: "phaseBegin" },
				forced: true,
				popup: false,
				content: function () {
					player.removeSkill("sheng2");
				},
				mod: {
					targetEnabled: function (card, player, target) {
						if (player != target) return false;
					},
				},
			},
			yihun: {
				trigger: { player: "phaseEnd" },
				direct: true,
				filter: function (event, player) {
					return player.countCards("he", { color: "black" }) > 0 && !player.hasSkill("yihun2");
				},
				content: function () {
					"step 0";
					var next = player.chooseCardTarget({
						prompt: get.prompt("yihun"),
						position: "he",
						filterCard: function (card, player) {
							return get.color(card) == "black" && lib.filter.cardDiscardable(card, player);
						},
						ai1: function (card) {
							return 7 - get.value(card);
						},
						ai2: function (target) {
							var att = -get.attitude(player, target);
							if (target == player.next) {
								att /= 10;
							}
							if (target == player.next.next) {
								att /= 2;
							}
							return att;
						},
						filterTarget: function (card, player, target) {
							return player != target;
						},
					});
					"step 1";
					if (result.bool) {
						player.discard(result.cards);
						player.logSkill("yihun", result.targets);
						player.addSkill("yihun2");
						var target = result.targets[0];
						player.storage.yihun2 = target;
						if ((target && get.mode() != "guozhan") || !target.isUnseen()) {
							player.markSkillCharacter(
								"yihun2",
								target,
								"移魂",
								"在" + get.translation(target) + "的下一准备阶段视为对其使用一张杀"
							);
						}
					}
				},
			},
			yihun2: {
				trigger: { global: ["phaseBegin", "dieAfter"] },
				forced: true,
				filter: function (event, player) {
					return event.player == player.storage.yihun2;
				},
				content: function () {
					if (player.storage.yihun2.isIn()) {
						player.useCard({ name: "sha" }, player.storage.yihun2);
					}
					player.removeSkill("yihun2");
					delete player.storage.yihun2;
				},
				mod: {
					targetEnabled: function () {
						return false;
					},
					cardEnabled: function (card, player) {
						return false;
					},
				},
			},
			huoyu: {
				enable: "phaseUse",
				unique: true,
				mark: true,
				skillAnimation: true,
				animationColor: "fire",
				init: function (player) {
					player.storage.huoyu = false;
				},
				filter: function (event, player) {
					if (player.storage.huoyu) return false;
					if (player.countCards("he", { color: "red" }) < 2) return false;
					return true;
				},
				filterTarget: function (card, player, target) {
					return player.canUse("chiyuxi", target);
				},
				filterCard: { color: "red" },
				selectCard: 2,
				position: "he",
				check: function (card) {
					return 7 - get.value(card);
				},
				selectTarget: -1,
				multitarget: true,
				multiline: true,
				line: "fire",
				content: function () {
					"step 0";
					targets.sort(lib.sort.seat);
					player.awakenSkill("huoyu");
					player.storage.huoyu = true;
					player.useCard({ name: "chiyuxi" }, targets).animate = false;
					"step 1";
					player.useCard({ name: "chiyuxi" }, targets).animate = false;
				},
				ai: {
					order: 5,
					result: {
						target: function (player, target) {
							if (player.hasUnknown()) return 0;
							return get.effect(target, { name: "chiyuxi" }, player, target);
						},
					},
				},
				intro: {
					content: "limited",
				},
			},
			feidan: {
				trigger: { source: "damageAfter" },
				direct: true,
				filter: function (event, player) {
					if (player.countCards("he") == 0) return false;
					if (!event.card) return false;
					if (event.card.name != "sha") return false;
					return game.hasPlayer(function (current) {
						return current != event.player && get.distance(event.player, current) <= 1;
					});
				},
				content: function () {
					"step 0";
					var eff = 0;
					var targets = game.filterPlayer(function (current) {
						if (current != trigger.player && get.distance(trigger.player, current) <= 1) {
							eff += get.damageEffect(current, player, player);
							return true;
						}
					});
					event.targets = targets;
					player
						.chooseToDiscard(get.prompt("feidan", targets))
						.set("ai", function (card) {
							if (eff > 0) return 7 - get.value(card);
							return 0;
						})
						.set("logSkill", ["feidan", targets]);
					"step 1";
					if (result.bool) {
						event.targets.sort(lib.sort.seat);
					} else {
						event.finish();
					}
					"step 2";
					if (event.targets.length) {
						event.targets.shift().damage();
						event.redo();
					}
				},
				mod: {
					targetInRange: function (card, player, target) {
						if (card.name == "sha") {
							if (get.distance(player, target) <= 1) return false;
							return true;
						}
					},
				},
			},
			yuedong: {
				trigger: { player: "phaseUseEnd" },
				direct: true,
				content: function () {
					"step 0";
					var num = 1 + player.storage.yuedong_num;
					player
						.chooseTarget(get.prompt("yuedong"), [1, num], function (card, player, target) {
							if (player.storage.yuedong_recover) {
								return target.hp < target.maxHp;
							}
							return true;
						})
						.set("ai", function (target) {
							if (player.storage.yuedong_recover) {
								return get.recoverEffect(target, player, player);
							}
							var att = get.attitude(player, target) / Math.sqrt(2 + target.countCards("h"));
							if (player == target) {
								var num2 = player.needsToDiscard(num);
								if (num2 > 1) return att / 5;
								if (num2 == 1) {
									if (num > 1) return att / 3;
									return att / 4;
								}
								return att * 1.1;
							}
							return att;
						});
					"step 1";
					if (result.bool) {
						player.logSkill("yuedong", result.targets);
						var eff = 1 + player.storage.yuedong_eff;
						if (player.storage.yuedong_recover) {
							result.targets.sort(lib.sort.seat);
							for (var i = 0; i < result.targets.length; i++) {
								result.targets[i].recover(eff);
							}
						} else {
							game.asyncDraw(result.targets, eff);
						}
					}
				},
				ai: {
					expose: 0.2,
					threaten: 1.6,
				},
			},
			huhuan: {
				enable: "phaseUse",
				filterCard: true,
				selectCard: 2,
				position: "he",
				filter: function (event, player) {
					return player.countCards("he") > 1 && !player.storage.yuedong_recover;
				},
				check: function (card) {
					return 6 - get.value(card);
				},
				content: function () {
					player.storage.yuedong_recover = true;
				},
				ai: {
					order: 10.2,
					result: {
						player: function (player) {
							var num1 = 0,
								num2 = 0,
								players = game.filterPlayer();
							for (var i = 0; i < players.length; i++) {
								if (get.attitude(player, players[i]) > 0) {
									num2++;
									if (players[i].hp <= 2 && players[i].maxHp > 2) {
										num1++;
										if (players[i].hp == 1) {
											num1++;
										}
									}
								}
							}
							if (num1 >= 3) {
								return 1;
							}
							return 0;
						},
					},
				},
			},
			kuoyin: {
				enable: "phaseUse",
				filterCard: true,
				selectCard: function () {
					if (get.is.altered("kuoyin")) return 1;
					if (_status.event.player.storage.yuedong_eff) return 1;
					if (_status.event.player.storage.yuedong_num) return 2;
					return [1, 2];
				},
				position: "he",
				// alter:true,
				filter: function (event, player) {
					if (get.is.altered("kuoyin") && player.storage.yuedong_num) return false;
					if (player.storage.yuedong_eff && player.storage.yuedong_num) return false;
					return player.countCards("he") > 0;
				},
				check: function (card) {
					var player = _status.event.player;
					var num1 = 0,
						num2 = 0,
						players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (get.attitude(player, players[i]) > 0) {
							num2++;
							if (players[i].hp <= 2 && players[i].maxHp > 2) {
								num1++;
							}
						}
					}
					if (player.storage.yuedong_recover) {
						if (num1 > 1 && !player.storage.yuedong_num) {
							if (ui.selected.cards.length) return 0;
							return 7 - get.value(card);
						}
						return 0;
					} else {
						if (num2 > 1 && !player.storage.yuedong_num) {
							if (ui.selected.cards.length) return 0;
							return 7 - get.value(card);
						}
						if (num2 > 2) {
							return 6 - get.value(card);
						}
						return 5 - get.value(card);
					}
				},
				content: function () {
					if (cards.length == 1) {
						player.storage.yuedong_num += 2;
					} else {
						player.storage.yuedong_eff++;
					}
				},
				ai: {
					threaten: 1.6,
					order: 10.1,
					result: {
						player: 1,
					},
				},
				group: "kuoyin2",
			},
			kuoyin2: {
				trigger: { player: "phaseBegin" },
				silent: true,
				content: function () {
					player.storage.yuedong_recover = false;
					player.storage.yuedong_num = 0;
					player.storage.yuedong_eff = 0;
				},
			},
			guangshu: {
				enable: "phaseUse",
				check: function (card) {
					var player = _status.event.player;
					var suit = get.suit(card);
					if (suit == "heart") {
						if (
							game.hasPlayer(function (current) {
								return current.hp == 1 && get.attitude(player, current) > 0;
							})
						);
					} else if (suit == "spade") {
						return 7 - get.value(card);
					}
					return 6 - get.value(card);
				},
				filter: function (event, player) {
					return player.countCards("he") > 0;
				},
				filterTarget: function (card, player, target) {
					return (
						!target.hasSkill("guangshu_heart") &&
						!target.hasSkill("guangshu_spade") &&
						!target.hasSkill("guangshu_club") &&
						!target.hasSkill("guangshu_diamond")
					);
				},
				filterCard: true,
				position: "he",
				content: function () {
					target.addSkill("guangshu_" + get.suit(cards[0]));
				},
				ai: {
					expose: 0.2,
					threaten: 1.6,
					order: 5,
					result: {
						target: function (player, target) {
							if (!ui.selected.cards.length) return 0;
							switch (get.suit(ui.selected.cards[0])) {
								case "heart":
									if (target.hp == 1) return 1;
									return 0.1;
								case "diamond":
									return 1 + Math.sqrt(target.countCards("h"));
								case "club":
									return -target.countCards("h") - Math.sqrt(target.countCards("h", "sha"));
								case "spade":
									return get.damageEffect(target, player, target, "thunder");
								default:
									return 0;
							}
						},
					},
				},
			},
			guangshu_diamond: {
				mark: true,
				intro: {
					content: "下次造成伤害时摸两张牌",
				},
				trigger: { source: "damageEnd" },
				forced: true,
				content: function () {
					player.draw(2);
					player.removeSkill("guangshu_diamond");
				},
			},
			guangshu_heart: {
				mark: true,
				intro: {
					content: "下次受到伤害时回复1点体力",
				},
				trigger: { player: "damageEnd" },
				priority: 6,
				forced: true,
				content: function () {
					player.recover();
					player.removeSkill("guangshu_heart");
				},
			},
			guangshu_club: {
				mark: true,
				intro: {
					content: "无法使用杀直到下一回合结束",
				},
				trigger: { player: "phaseEnd" },
				forced: true,
				popup: false,
				content: function () {
					player.removeSkill("guangshu_club");
				},
				mod: {
					cardEnabled: function (card) {
						if (card.name == "sha") return false;
					},
				},
			},
			guangshu_spade: {
				mark: true,
				intro: {
					content: "下个结束阶段受到1点无来源的雷电伤害",
				},
				trigger: { player: "phaseEnd" },
				forced: true,
				content: function () {
					player.damage("thunder", "nosource");
					player.removeSkill("guangshu_spade");
				},
			},
			ziyu: {
				trigger: { global: "phaseEnd" },
				direct: true,
				filter: function (event, player) {
					if (get.is.altered("ziyu")) return game.phaseNumber % 6 == 0;
					return game.phaseNumber % 4 == 0;
				},
				// alter:true,
				content: function () {
					player.chooseDrawRecover(get.prompt("ziyu")).logSkill = "ziyu";
				},
			},
			shouhu: {
				mod: {
					cardEnabled: function (card) {
						if (card.name == "sha") return false;
					},
				},
				enable: "phaseUse",
				filter: function (event, player) {
					return player.countCards("h", "sha") > 0;
				},
				filterTarget: function (card, player, target) {
					return target.hp < target.maxHp && target != player;
				},
				content: function () {
					target.recover();
				},
				filterCard: { name: "sha" },
				ai: {
					order: 7,
					threaten: 2,
					result: {
						target: function (player, target) {
							return get.recoverEffect(target, player, target);
						},
					},
				},
			},
			shanxian: {
				trigger: { global: "phaseBefore" },
				filter: function (event, player) {
					return event.player != player && !player.isTurnedOver() && !player.storage.shanxian;
				},
				check: function (event, player) {
					return (
						get.attitude(player, event.player) < 0 &&
						((player.countCards("h") > player.hp && player.countCards("h", "lebu") == 0) ||
							get.distance(player, event.player) > 1)
					);
				},
				// alter:true,
				intro: {
					content: function (storage, player) {
						var str = "";
						if (player.storage.shanxian_h.length) {
							if (player.isUnderControl(true)) {
								str += "手牌区：" + get.translation(player.storage.shanxian_h);
							} else {
								str += "手牌区：" + player.storage.shanxian_h.length + "张牌";
							}
						}
						if (player.storage.shanxian_e.length) {
							if (str.length) str += "、";
							if (player.isUnderControl(true)) {
								str += "装备区：" + get.translation(player.storage.shanxian_e);
							} else {
								str += "装备区：" + player.storage.shanxian_e.length + "张牌";
							}
						}
						return str;
					},
					mark: function (dialog, content, player) {
						if (player.storage.shanxian_h.length) {
							if (player.isUnderControl(true)) {
								dialog.add('<div class="text center">手牌区</div>');
								dialog.addSmall(player.storage.shanxian_h);
							} else {
								dialog.add(
									'<div class="text center">手牌区：' +
										player.storage.shanxian_h.length +
										"张牌</div>"
								);
							}
						}
						if (player.storage.shanxian_e.length) {
							if (player.isUnderControl(true)) {
								dialog.add('<div class="text center">装备区</div>');
								dialog.addSmall(player.storage.shanxian_e);
							} else {
								dialog.add(
									'<div class="text center">装备区：' +
										player.storage.shanxian_e.length +
										"张牌</div>"
								);
							}
						}
					},
				},
				logTarget: "player",
				content: function () {
					"step 0";
					if (!get.is.altered("shanxian")) {
						player.draw(false);
						player.$draw();
					}
					"step 1";
					player.storage.shanxian_h = player.getCards("h");
					player.storage.shanxian_e = player.getCards("e");
					player.storage.shanxian_n = 1;
					player.syncStorage("shanxian_e");
					player.phase("shanxian");
					player.storage.shanxian = trigger.player;
					player.removeSkill("shanxian2");
					player.markSkill("shanxian");
					"step 2";
					player.turnOver(true);
					delete player.storage.shanxian;
				},
				mod: {
					targetInRange: function (card, player, target, now) {
						if (target == player.storage.shanxian) return true;
					},
				},
				ai: {
					expose: 0.1,
				},
			},
			shanxian2: {
				trigger: { player: ["gainBegin", "loseBegin"] },
				forced: true,
				popup: false,
				content: function () {
					player.removeSkill("shanxian2");
				},
			},
			shanhui: {
				unique: true,
				trigger: { player: "damageEnd", source: "damageEnd" },
				filter: function (event, player) {
					return (
						player.storage.shanxian_h &&
						player.storage.shanxian_e &&
						player.storage.shanxian_n > 0 &&
						!player.hasSkill("shanxian2")
					);
				},
				check: function (event, player) {
					var n1 = player.countCards("he");
					var n2 = player.storage.shanxian_h.length + player.storage.shanxian_e.length;
					if (n1 < n2) return true;
					if (player.hp == player.maxHp) return false;
					if (n1 == n2 + 1) return true;
					if (n2 == n2 + 2 && player.hp <= 1) return true;
					return false;
				},
				video: function (player) {
					var cards = player.getCards("he");
					for (var i = 0; i < cards.length; i++) {
						cards[i].remove();
					}
					for (var i = 0; i < player.storage.shanxian_e.length; i++) {
						player.$equip(player.storage.shanxian_e[i]);
					}
				},
				content: function () {
					game.addVideo("skill", player, "shanhui");
					for (var i = 0; i < player.storage.shanxian_h.length; i++) {
						if (get.position(player.storage.shanxian_h[i]) == "s") {
							player.storage.shanxian_h[i] = game.createCard(player.storage.shanxian_h[i]);
						}
					}
					for (var i = 0; i < player.storage.shanxian_e.length; i++) {
						if (get.position(player.storage.shanxian_e[i]) == "s") {
							player.storage.shanxian_e[i] = game.createCard(player.storage.shanxian_e[i]);
						}
					}
					player.removeEquipTrigger();
					var cards = player.getCards("he");
					for (var i = 0; i < cards.length; i++) {
						cards[i].discard();
					}
					player.directgain(player.storage.shanxian_h);
					for (var i = 0; i < player.storage.shanxian_e.length; i++) {
						player.$equip(player.storage.shanxian_e[i]);
					}
					if (cards.length > player.storage.shanxian_h.length + player.storage.shanxian_e.length) {
						player.recover();
					}
					player.storage.shanxian_n--;
					if (player.storage.shanxian_n <= 0) {
						delete player.storage.shanxian_h;
						delete player.storage.shanxian_e;
						delete player.storage.shanxian_n;
						player.unmarkSkill("shanxian");
					} else {
						player.addSkill("shanxian2");
					}
				},
			},
		},
		translate: {
			woliu: "涡流",
			woliu2: "涡流",
			woliu_info:
				"结束阶段，你可以选择至多两名角色，当你或目标中的任意一名角色成为【杀】的目标时，其余角色也将被追加为目标，直到你死亡或下一回合开始。",
			qianggu: "强固",
			qianggu_info:
				"出牌阶段限一次，你可以弃置两张牌并获得2点护甲，若如此做，直到你的下个回合开始，其他角色对你使用【杀】时需要弃置一张基本牌，否则此【杀】对你无效。",
			qianggu2: "强固",
			pingzhang: "屏障",
			pingzhang_info:
				"每轮各限一次，当你受到伤害时，你可以弃置一张红桃牌令伤害-1；当一名其他角色受到伤害时，你可以弃置一张黑桃牌令伤害-1。",
			pingzhang_info_alter:
				"每轮各限一次，当你受到伤害时，你可以弃置一张红桃手牌令伤害-1；当一名其他角色受到伤害时，你可以弃置一张黑桃手牌令伤害-1。",
			owliyong: "力涌",
			owliyong_info: "锁定技，你摸牌阶段摸牌数+X，X为你上一轮发动屏障的次数。",
			dianji: "电击",
			dianji_info: "出牌阶段限一次，你可以将一张手牌当作惊雷闪对距离2以内的角色使用。",
			feitiao: "飞跳",
			feitiao2: "飞跳",
			feitiao_info:
				"出牌阶段开始时，你可以弃置一张牌并指定一名角色，你与该角色的距离视为1直到回合结束，然后该角色随机弃置一张牌。",
			bshaowei: "哨卫",
			bshaowei_info:
				"结束阶段，你可以切换至哨卫模式。当处于此模式时，你的【杀】无视距离和防具、无数量限制且不可闪避；你不能闪避【杀】。",
			zhencha: "侦查",
			zhencha_info:
				"结束阶段，你可以切换至侦查模式。当处于此模式时，每当你使用一张【杀】，你摸一张牌或回复1点体力。",
			liangou: "链钩",
			liangou_info:
				"出牌阶段限一次，你可以弃置一张牌，指定一名其他角色并进行一次判定，若结果不为红桃，该角色与你距离为1且受到的首次伤害+1直到回合结束。",
			xiyang: "吸氧",
			xiyang_info: "结束阶段，若你武将牌正面朝上，你可以翻面并回复2点体力。",
			qinru: "侵入",
			qinru_info:
				"每当你使用【杀】指定目标时，你可以令其进行一次判定，若结果不为红桃，该角色的非锁定技失效直到其下一回合结束。",
			yinshen: "隐身",
			yinshen_info: "锁定技，每当你失去最后一张基本牌，你获得潜行直到下一回合开始。",
			maichong: "脉冲",
			maichong_info:
				"锁定技，每当你使用一张普通锦囊牌，你令最近三回合内被你侵入过的角色各随机弃置一张牌。",
			maichong_info_alter: "准备阶段，你可以令最近两名被你侵入的角色各随机弃置一张牌。",
			lichang: "力场",
			lichang2: "力场",
			lichang_info:
				"结束阶段，你可以弃置一张红色牌，若如此做，你可以在下个准备阶段令一名距离1以内的角色回复1点体力或摸两张牌。",
			mengji: "猛击",
			mengji_info: "锁定技，若你已发动重盾，当你没有护甲时，你的【杀】造成的伤害+1。",
			zhongdun: "重盾",
			zhongdun_info:
				"游戏开始时，你获得8点护甲；出牌阶段限一次，你可以弃置一张牌并将1点护甲分给一名没有护甲的其他角色。",
			zhongdun_info_alter:
				"游戏开始时，你获得6点护甲；出牌阶段限一次，你可以弃置一张牌并将1点护甲分给一名没有护甲的其他角色。",
			paotai: "炮台",
			paotai2: "炮台",
			paotai_info:
				"出牌阶段，你可以弃置一张【杀】布置或升级一个炮台（最高3级）；结束阶段，炮台有一定机率对一名随机敌人造成1点火焰伤害；每当你受到1点伤害，炮台降低一级。",
			maoding: "铆钉",
			maoding2: "铆钉",
			maoding_info:
				"每当你造成或受到一次伤害，你可以获得一个零件；出牌阶段，你可以弃置两张零件牌令一名没有护甲的角色获得1点护甲。",
			maoding_info_alter:
				"每当你造成一次伤害，你可以获得一个零件；出牌阶段，你可以弃置两张零件牌令一名没有护甲的角色获得1点护甲。",
			bfengshi: "风矢",
			bfengshi2: "风矢",
			bfengshi_info:
				"锁定技，在一合内每当你使用一张牌，你的攻击范围+1；你的首张【杀】增加20%的概率强制命中；你的首张【杀】造成伤害后增加20%的概率令伤害+1。",
			bfengshi_info_alter:
				"锁定技，在一合内每当你使用一张牌，你的攻击范围+1；你的首张【杀】增加15%的概率强制命中；你的首张【杀】造成伤害后增加15%的概率令伤害+1。",
			yinbo: "音波",
			yinbo_info: "出牌阶段限一次，你可以弃置一张黑桃牌，然后随机弃置三名敌人各一张牌。",
			liudan: "榴弹",
			liudan_info: "每当你使用一张【杀】，你可以令所有不是此【杀】目标的其他角色有50%概率成为此【杀】的额外目标。",
			shoujia: "兽夹",
			shoujia2: "兽夹",
			shoujia3: "兽夹",
			shoujia_info:
				"出牌阶段限一次，你可以将一张牌背面朝上置于一名其他角色的武将牌上，当该角色使用一张与此牌花色相同的牌指定其他角色为目标时，移去此牌，该角色将武将牌翻至背面；当你受到伤害时，移去此牌。",
			shihuo: "嗜火",
			shihuo_info: "锁定技，每当一名角色受到火焰伤害，你摸一张牌。",
			shanguang: "闪光",
			shanguang_info:
				"出牌阶段限一次，你可以弃置一张方片牌令攻击范围内的一名其他角色本回合内不能使用或打出卡牌。",
			tiandan: "填弹",
			tiandan_info:
				"摸牌阶段开始时，你可以跳过出牌和弃牌阶段，然后获得若干张【杀】直到你的手牌数等于你的体值（最多为5）。",
			shenqiang: "神枪",
			shenqiang_info: "锁定技，每当你在出牌阶段使用【杀】造成伤害，本阶段内出杀次数上限+1。",
			mianzhen: "眠针",
			mianzhen2: "眠针",
			mianzhen_info:
				"出牌阶段限一次，你可以弃置一张牌并令一名其他角色打出一张闪，否则该角色不能使用或打出卡牌直到其受到伤害或下一回合结束。",
			aqianghua: "强化",
			aqianghua2: "强化",
			aqianghua_info:
				"出牌阶段限一次，你可以将你的全部手牌（至少一张）交给一名其他角色，该角色获得1点护甲且下一次造成的伤害+1。",
			aqianghua_info_alter:
				"出牌阶段限一次，你可以将你的全部手牌（至少一张）交给一名其他角色，该角色下一次造成的伤害+1。",
			zhiyuan: "支援",
			zhiyuan_info: "每当你即将造成伤害，你可以防止此伤害，改为令目标回复等量的体力。",
			juji: "狙击",
			juji2: "狙击",
			juji3: "狙击",
			juji_info:
				"出牌阶段限一次，你可以弃置任意张花色不同的牌并指定一名有手牌的其他角色，若该角色的手牌中含有与你弃置的牌花色相同的牌，则本回合内你与其距离为1且该角色不能闪避你的【杀】。",
			duwen: "毒吻",
			duwen2: "毒吻",
			duwen_info: "锁定技，当你造成伤害时，若你的手牌数与受伤害角色相等，此伤害+1。",
			dulei: "诡雷",
			dulei2: "诡雷",
			dulei_info:
				"出牌阶段，若你武将牌上没有牌，你可以将一张牌背面朝上置于你的武将牌上，当一名角色使用与该牌花色相同的牌指定你为目标时，你展示并移去此牌，然后该角色失去1点体力并随机弃置一张牌。",
			baoxue: "暴雪",
			baoxue_info:
				"限定技，出牌阶段，若你未翻面，你可以展示并弃置你的所有黑色牌，然后令至多X名其他角色随机弃置一张牌并将武将牌翻至背面，X为你的弃牌数；结算后你将武将牌翻至背面。",
			baoxue_info_alter:
				"限定技，出牌阶段，你可以展示并弃置你的所有黑色牌，并选择等量其他角色将武将牌翻至背面，结算后你将武将牌翻至背面。",
			bingqiang: "冰墙",
			bingqiang2: "冰墙",
			bingqiang2_bg: "墙",
			bingqiang3: "冰墙",
			bingqiang3_bg: "墙",
			bingqiang4: "冰墙",
			bingqiang4_bg: "墙",
			bingqiang5: "冰墙",
			bingqiang5_bg: "障",
			bingqiang_info:
				"出牌阶段，你可以弃置X张红色牌令一名角色和其相邻角色的防御离+X，或弃置X张黑色牌令一名角色和其相邻角色的进攻离-X，效果持续到你的下个回合开始。",
			jidong: "急冻",
			jidong_info:
				"在一名角色的结束阶段，若你的体力值为1且未翻面，你可以翻面并回复2点体力，在你的武将牌翻至正面前，你防止所有伤害，也不能成为其他角色卡牌的目标。",
			jidong_info_alter: "在一名角色的结束阶段，若你的体力值为1，你可以翻面并回复2点体力。",
			jijia: "机甲",
			jijia_info:
				"锁定技，游戏开始时，你获得一个体力为4的机甲；你的手牌上限为你和机甲的体力之和；你受到的伤害由机甲承担。",
			zihui: "自毁",
			zihui_info:
				"出牌阶段，你可以令距离2以内的所有其他角色选择一项：弃置数量等同你机甲体力值的牌，或受到2点火焰伤害，并在结算完毕后摧毁你的机甲。",
			zihui_info_alter:
				"出牌阶段，你可以令距离2以内的所有其他角色选择一项：1. 弃置数量等同你机甲体力值的牌（不足则全弃，至少弃1张）；2. 或受到2点火焰伤害，并在结算完毕后摧毁你的机甲。",
			tuijin: "推进",
			tuijin2: "推进",
			tuijin_info: "出牌阶段限一次，若你有机甲，你可以指定一名角色，本回合内视为与其距离为1。",
			chongzhuang: "重装",
			chongzhuang_info: "在你失去机甲后，当你累计造成了4点伤害时，你重新获得机甲。",
			shouge: "收割",
			shouge_info: "每当你杀死一名角色，你可以获得一张治疗波。",
			tuji: "突击",
			tuji_info: "锁定技，在你的回合内，每当你使用一张牌，你的进攻距离+1。",
			mujing: "目镜",
			mujing2: "目镜",
			mujing_info: "你可以将一张黑色牌当作【杀】使用或打出；当你的【杀】被闪避后，此【杀】不计入出杀次数。",
			feiren: "飞刃",
			feiren2: "飞刃",
			feiren_info: "你的【杀】无视距离；你的黑桃【杀】造成的伤害+1，梅花【杀】可以额外指定一个目标。",
			feiren_info_alter: "你的【杀】无视距离；你的梅花【杀】可以额外指定一个目标。",
			zhanlong: "斩龙",
			zhanlong_info:
				"限定技，准备阶段，若你体力值为1，你可以弃置所有牌（至少一张），然后将三张【杀】置入你的手牌，若如此做，你本回合使用【杀】无次数限制。",
			xie: "谐",
			xie2: "谐",
			xie_info:
				"出牌阶段，你可以弃置一张红桃手牌并指定一名角色，该角色自其下一回合开始每隔六回合回复1点体力，直到你死亡。同一时间只能对一人发动。",
			luan: "乱",
			luan2: "乱",
			luan_info:
				"出牌阶段，你可以弃置一张黑桃手牌并指定一名角色，该角色受到伤害后失去1点体力，直到你死亡或其首次进入濒死状态。同一时间只能对一人发动。",
			sheng: "圣",
			sheng_info:
				"限定技，出牌阶段，你可以将你的武将牌翻面，然后令任意名角色回复1点体力，若如此做，你不能成为其他角色的卡牌目标直到下一回合开始。",
			xiandan: "霰弹",
			xiandan_info:
				"每当你使用一张【杀】，你可以弃置一张红色牌令此【杀】不可闪避，或弃置一张黑色牌令此【杀】伤害+1。",
			yihun: "移魂",
			yihun_info:
				"结束阶段，你可以弃置一张黑色牌并指定一名其他角色，你在该角色下一准备阶段视为对其使用一张【杀】；在此之前，你不能使用卡牌，也不能成为卡牌的目标。",
			feidan: "飞弹",
			feidan_info:
				"你的【杀】只能对距离1以外的角色使用；每当你使用【杀】造成伤害后，你可以弃置一张牌对距离目标1以内的其他角色各造成1点伤害。",
			huoyu: "火雨",
			huoyu_info: "限定技，出牌阶段，你可以弃置两张红色牌，视为使用两张炽羽袭。",
			yuedong: "乐动",
			yuedong_info: "出牌阶段结束时，你可以令一名角色摸一张牌。",
			kuoyin: "扩音",
			kuoyin_info:
				"出牌阶段，你可以弃置一张牌令本回合乐动的目标数改为3，或弃置两张牌令本回合乐动的摸牌量改为2。",
			kuoyin_info_alter: "出牌阶段，你可以弃置一张牌令本回合乐动的目标数改为3。",
			huhuan: "互换",
			huhuan_info: "出牌阶段，你可以弃置两张牌令本回合乐动的摸牌效果改为回复等量体力。",
			guangshu: "光枢",
			guangshu_heart: "光盾",
			guangshu_spade: "光塔",
			guangshu_club: "光井",
			guangshu_diamond: "光流",
			guangshu_info:
				"出牌阶段，你可以弃置一张牌，并指定一名角色，根据弃置牌的花色执行如下效果：♥该角色下次受到伤害时回复1点体力；♦︎该角色下次造成伤害时摸两张牌；♣该角色无法使用【杀】直到下一回合结束；♠该角色于下个结束阶段受到1点无来源的雷电伤害。",
			ziyu: "自愈",
			ziyu_info: "在一名角色的结束阶段，你可以回复1点体力或摸一张牌，每隔四回合发动一次。",
			ziyu_info_alter: "在一名角色的结束阶段，你可以回复1点体力或摸一张牌，每隔六回合发动一次。",
			shouhu: "守护",
			shouhu_info: "你不能使用【杀】；出牌阶段，你可以弃置一张【杀】令一名其他角色回复1点体力。",
			shanxian: "闪现",
			shanxian_info:
				"在一名其他角色的回合开始前，若你的武将牌正面朝上，你可以摸一张牌并进行一个额外回合，并在回合结束后将武将牌翻至背面。若如此做，你对其使用卡牌无视距离直到回合结束。",
			shanxian_info_alter:
				"在一名其他角色的回合开始前，若你的武将牌正面朝上，你可以进行一个额外回合，并在回合结束后将武将牌翻至背面。若如此做，你对其使用卡牌无视距离直到回合结束。",
			shanhui: "闪回",
			shanhui_info:
				"当你造成或受到伤害后，你可以将你的牌重置为上次发动闪现时的状态，若你的牌数因此而减少，你回复1点体力。",
			ow_liekong: "猎空",
			ow_sishen: "死神",
			ow_tianshi: "天使",
			ow_falaozhiying: "法老之鹰",
			ow_zhixuzhiguang: "秩序之光",
			ow_luxiao: "卢西奥",
			ow_shibing: "士兵76",
			ow_yuanshi: "源氏",
			ow_chanyata: "禅雅塔",
			ow_dva: "DVA",
			ow_mei: "小美",
			ow_heibaihe: "黑百合",
			ow_ana: "安娜",
			ow_baolei: "堡垒",
			ow_maikelei: "麦克雷",
			ow_banzang: "半藏",
			ow_kuangshu: "狂鼠",
			ow_tuobiang: "托比昂",
			ow_laiyinhate: "莱因哈特",
			ow_luba: "路霸",
			ow_wensidun: "温斯顿",
			ow_zhaliya: "查莉娅",
			ow_heiying: "黑影",
			ow_orisa: "奥丽莎",
		},
	};
});
