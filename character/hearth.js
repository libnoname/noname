import { lib, game, ui, get, ai, _status } from "../noname.js";
game.import("character", function () {
	return {
		name: "hearth",
		character: {
			hs_jaina: ["female", "wei", 3, ["huopu", "aoshu", "bingjia"]],
			hs_lrexxar: ["male", "shu", 4, ["yushou"]],
			hs_wuther: ["male", "qun", 4, ["fengxian", "rejieming"]],
			hs_jgarrosh: ["male", "shu", 4, ["zhanhou", "qiangxi"]],
			hs_malfurion: ["male", "wu", 4, ["jihuo"]],
			hs_guldan: ["male", "wei", 3, ["moxie", "fuhua", "hongxi"]],
			hs_anduin: ["male", "qun", 3, ["shengguang", "shijie", "anying"]],
			hs_sthrall: ["male", "wu", 4, ["tuteng", "guozai", "zuling"]],
			hs_waleera: ["female", "shu", 3, ["jianren", "mengun", "wlianji"]],

			hs_medivh: ["male", "wei", 3, ["jingxiang", "zuzhou", "mdzhoufu"]],
			hs_alleria: ["female", "wu", 3, ["fengxing", "xinliegong"]],
			hs_magni: ["male", "shu", 4, ["zhongjia", "dunji"]],
			hs_liadrin: ["female", "shu", 4, ["xueren"]],
			hs_morgl: ["male", "wu", 3, ["s_tuteng"]],
			hs_khadgar: ["male", "shu", 3, ["midian", "fuwen", "jinzhou"]],
			hs_tyrande: ["female", "wei", 3, ["yuelu", "xingluo"]],

			hs_neptulon: ["male", "wu", 4, ["liechao", "qingliu"]],
			hs_wvelen: ["male", "qun", 3, ["shengyan", "xianzhi"]],
			hs_antonidas: ["male", "wei", 3, ["yanshu", "bingshuang"]],
			hs_alakir: ["male", "wei", 3, ["fengnu", "shengdun"]],
			hs_zhouzhuo: ["male", "qun", 4, ["yiwen"]],
			hs_yngvar: ["male", "qun", 3, ["huanwu"]],
			hs_bchillmaw: ["male", "wei", 5, ["hanshuang", "bingshi"]],
			hs_malorne: ["male", "wu", 3, ["enze", "chongsheng"]],
			hs_malygos: ["male", "wei", 4, ["malymowang"]],
			hs_xuefashi: ["male", "wei", 2, ["liehun", "xjumo"]],
			hs_loatheb: ["male", "wu", 5, ["duzhang"]],
			hs_trueheart: ["female", "qun", 3, ["qianghuax"]],
			hs_sainaliusi: ["male", "wu", 4, ["chongsheng", "yulu"]],
			hs_lrhonin: ["male", "wei", 4, ["bingyan", "yufa"]],
			hs_bolvar: ["male", "wei", 4, ["yuanzheng", "bzhuiji"]],
			hs_fuding: ["male", "wei", 4, ["shengdun", "fbeifa"]],
			hs_xuanzhuanjijia: ["male", "shu", 2, ["jixuan"]],
			hs_ysera: ["female", "wu", 4, ["bimeng"]],
			hs_alextrasza: ["female", "shu", 5, ["fushi"]],
			hs_nozdormu: ["male", "qun", 5, ["shixu"]],
			hs_sapphiron: ["male", "wei", 4, ["bingdong", "stuxi"]],
			hs_kchromaggus: ["male", "wei", 4, ["fenlie"]],
			hs_lreno: ["male", "shu", 4, ["tanmi"]],
			hs_brann: ["male", "shu", 3, ["qianghua", "mashu"]],
			hs_finley: ["male", "wu", 3, ["maoxian"]],
			hs_kcthun: ["male", "qun", 4, ["luanji", "xianji"]],
			hs_anomalus: ["male", "wei", 4, ["mobao"]],
			hs_blingtron: ["male", "shu", 3, ["zengli", "xiubu"]],
			hs_yogg: ["male", "wu", 4, ["qianhou"]],
			hs_xialikeer: ["female", "shu", 3, ["duxin"]],
			hs_pyros: ["female", "shu", 2, ["pyuhuo"]],
			hs_kalimosi: ["male", "wu", 4, ["kqizhou"]],

			hs_zhishigushu: ["male", "shu", 4, ["jiaohui"]],
			hs_zhanzhenggushu: ["male", "wei", 6, ["biri"]],
			hs_ronghejuren: ["male", "shu", 8, ["ronghuo"]],
			hs_shanlingjuren: ["male", "wu", 8, ["luoshi"]],
			hs_aedwin: ["male", "wu", 4, ["lianzhan"]],
			hs_mijiaojisi: ["female", "wu", 3, ["kuixin"]],
			hs_huzhixiannv: ["female", "wu", 3, ["jingmeng", "qingliu"]],
			hs_totemic: ["male", "wu", 3, ["peiyu"]],
			hs_wujiyuansu: ["male", "wei", 3, ["hswuji"]],
			hs_xsylvanas: ["female", "qun", 3, ["busi", "xshixin", "xmojian"]],
			hs_siwangzhiyi: ["male", "qun", 12, ["mieshi"]],
			hs_bilanyoulong: ["male", "wei", 4, ["lingzhou"]],
			hs_jinglinglong: ["male", "wu", 3, ["moyao"]],
			hs_ruanniguai: ["male", "wu", 3, ["nianfu", "xiaorong"]],
			hs_hudunren: ["male", "shu", 2, ["hhudun"]],
			hs_nate: ["male", "wu", 4, ["chuidiao"]],
			hs_jiaziruila: ["male", "wu", 4, ["hannu"]],
			hs_shifazhe: ["male", "wei", 3, ["shifa"]],
			hs_lafamu: ["male", "shu", 4, ["xieneng"]],
			hs_yelise: ["female", "wei", 3, ["xunbao", "zhuizong"]],
			hs_jiawodun: ["male", "wu", 4, ["jinhua"]],

			hs_fandral: ["male", "shu", 4, ["nuyan", "chouhuo"]],
			hs_hallazeal: ["male", "wei", 4, ["shengteng", "yuansu"]],
			hs_enzoth: ["male", "qun", 4, ["mengye"]],
			hs_walian: ["male", "shu", 4, ["wzhanyi"]],
			hs_pengpeng: ["male", "qun", 4, ["yindan"]],
			hs_yashaji: ["male", "qun", 4, ["ysjqisha"]],

			hs_tanghangu: ["male", "shu", 5, ["zhongji"]],
			hs_aya: ["female", "wu", 3, ["ayuling", "qingzun"]],
			hs_barnes: ["male", "shu", 4, ["hsnitai"]],
			hs_kazhakusi: ["male", "shu", 3, ["lianjin"]],
			hs_shaku: ["male", "wei", 3, ["shouji"]],
			hs_laxiao: ["male", "shu", 3, ["hsguimou", "yingxi", "hlongyi"]],
			hs_mojinbaozi: ["male", "wei", 3, ["jingcu", "shengzhang"]],
			hs_shuiwenxuejia: ["male", "wu", 3, ["kekao"]],
			hs_shizugui: ["male", "wu", 3, ["szbianshen"]],
			hs_hemite: ["male", "wu", 6, ["zhuilie"]],
			hs_laila: ["male", "wu", 3, ["lieyang"]],

			hs_selajin: ["male", "shu", 3, ["qianfu", "shimo"]],
			hs_bannabusi: ["male", "wu", 14, ["qingtian"]],
			hs_amala: ["female", "wu", 3, ["azaowu", "shouwang"]],
			hs_yinggencao: ["male", "wu", 3, ["lieqi"]],

			hs_zhihuanhua: ["female", "wei", 3, ["huanjue"]],
			hs_shirencao: ["male", "wu", 3, ["srjici"]],
			hs_kaituozhe: ["female", "wu", 3, ["tansuo", "yinzong"]],

			hs_fachaotuteng: ["male", "wei", 3, ["xiyong"]],
			hs_huolituteng: ["male", "wei", 3, ["hllingxi"]],
			hs_manyututeng: ["male", "wu", 3, ["zhaochao"]],
			hs_tgolem: ["male", "wu", 4, ["xinwuyan", "guozaix"]],

			hs_heifengqishi: ["male", "qun", 4, ["hstianqi"]],
			hs_yangyanwageli: ["female", "qun", 3, ["hspuzhao", "hsyanxin"]],

			hs_aiqinvyao: ["female", "qun", 4, ["nsaiqi", "nsbeiming"]],

			hs_yelinlonghou: ["female", "qun", 4, ["ylyuchu"]],
			hs_yelinchulong: ["male", "qun", 1, [], ["unseen"]],
			hs_ashamoer: ["female", "wei", 3, ["asyouzhang"]],
			hs_fengjianhuanfengzhe: ["male", "wei", 3, ["tuteng", "huanfeng"]],
			hs_taisi: ["female", "wei", 3, ["hsxingyi", "hshuanling"]],

			hs_hajiasha: ["female", "wu", 3, ["zhoujiang", "muyin"]],
			hs_tuoqi: ["female", "shu", 3, ["tqchuanyue"]],
			hs_siwangxianzhi: ["male", "wei", 3, ["hualing", "yibian"]],
			hs_xukongzhiying: ["female", "qun", 3, ["wxuying"]],

			hs_duyaxinshi: ["male", "wei", 3, ["hshuanyu"]],
		},
		characterIntro: {
			hs_jaina:
				"戴林·普罗德摩尔之女。 在吉安娜成年早期，她致力于阻止将引发第三次战争的天灾瘟疫传播，当战况加剧后，吉安娜获得了新部落大酋长萨尔的信任，成为团结艾泽拉斯各族携手对抗燃烧军团的关键人物。当战争结束后，吉安娜管理着塞拉摩岛，致力于促进部落与联盟间的关系。吉安娜的和平立场与性格在接任萨尔成为部落大酋长的加尔鲁什·地狱咆哮以一颗魔法炸弹夷平塞拉摩后改变了。身为肯瑞托的新领袖，她拥有让加尔鲁什为他酿成的惨剧付出血的代价的权力与决心。",
			hs_lrexxar:
				"作为部落最伟大的英雄之一，雷克萨本是兽人与食人魔结合的产物。他从小在德拉诺的莫克纳萨氏族长大。流血冲突和以及来自部落内部的陷害慢慢消磨了雷克萨为部落而战的热情，最终导致他独自出走。雷克萨与他的新伙伴们，包括巨熊米莎，消失在艾泽拉斯世界。在第三次大战中，雷克萨结识了年轻的酋长萨尔，后者重建部落的热情令他大受启发。奥格瑞玛建成之后，部落勇士的称号也传回了他在外域（德拉诺世界的残片）的家乡。如今，雷克萨依然随时准备着为全新的部落——他真正的人民——效劳。",
			hs_wuther:
				"乌瑟尔·光明使者是白银之手骑士团的领袖，同时也是大主教阿隆索斯·法奥之徒。当暴风城被兽人攻陷，莱恩国王遇害之后，乌瑟尔跟随法奥和安度因·洛萨同往洛丹伦王国寻求援助。鉴于艾泽拉斯战役的教训和迫在眉睫的兽人的威胁，法奥决定重建洛丹伦王国的圣教组织，并由他的学徒兼助手乌瑟尔来全权负责。这就是后世著名的“白银之手”骑士团。",
			hs_jgarrosh:
				"前部落酋长。什出生于德拉诺的兽人家园，他的成长未曾受侵略艾泽拉斯兽人身上流淌着的恶魔之血所污染。虽然自身并未受腐化影响，但加尔鲁什始终活在身世的阴影之下。",
			hs_malfurion:
				"在德鲁伊的守护神、半神塞纳留斯的指引下，玛法里奥·怒风千年以来一直保护着暗夜精灵不受恶魔侵扰。在上古之战中，玛法里奥与其他英雄一起，为了保护艾泽拉斯的所有生命，抵抗过可怕的燃烧军团，随后玛法里奥和其他德鲁伊在翡翠梦境中探索了数百年之久。在第三次大战中，泰兰德唤醒了玛法里奥，请他再次协助抵抗燃烧军团。玛法里奥离开暗夜精灵主城达纳苏斯，并召集他的德鲁伊同伴再次拯救艾泽拉斯，并组成了特别部队，阻止了邪恶的炎魔拉格纳罗斯的入侵。随着灭世者的死亡，彻底觉醒的玛法里奥与泰兰德终于团聚并一同支持联盟的行动。",
			hs_guldan:
				"在兽人的家乡德拉诺，古尔丹生于影月氏族一个偏远的村庄，由于残疾，他被族人所抛弃。在村中萨满的指引下，他来到了纳格兰的元素王座，祈求元素指引他的道路，可最终，就连元素都放弃了他。但是，一股古老而可怕的黑暗势力向他伸出了“援手”——燃烧军团。得到了恶魔之力的古尔丹成为了史上第一位术士，他回到了抛弃自己的村庄，杀死了所有他曾经的族人，也“回报”了那位指引他的萨满以“感激”。现在，古尔丹是燃烧军团的先驱者，竭力使终极的毁灭降临艾泽拉斯。",
			hs_anduin:
				"蒂芬与瓦里安·乌瑞恩之子，安度因·莱恩·乌瑞恩是暴风城的王位继承人。数年前，当他的父亲失踪后，年轻的安度因便加冕暴风城国王。但尚处年幼的他无法胜任王国事务，交由联盟中德高望重的圣骑士伯瓦尔·弗塔根公爵代为执政。当国王瓦里安回归并重掌王位后，王子开始专注于心灵和外交的修炼，环游艾泽拉斯来了解如何才能治愈饱受战争摧残的大地和灵魂。安度因心灵善良且富有同情心，不同于他父亲战士出身的莽撞，令他与德莱尼的先知维伦，甚至一些部落成员结下不解之缘。",
			hs_sthrall:
				"“萨尔”是兽人古伊尔年轻时候的绰号，他的父母因反对古尔丹被杀，人类中士埃德拉斯·布莱克摩尔发现了襁褓中的他，并计划将他培育成自己野心计划的重要棋子；而萨尔，正是奴隶之意。古伊尔摆脱控制后踏上寻根之旅，最后从先祖的萨满信仰中寻得了智慧。他重整了部落，成为大酋长并领导他的人民在贫瘠之地上定居。萨尔领导部落通过了一连串的试炼，当死亡之翼重返人间并撕裂世界，萨尔从部落大酋长的位置退下，加入了大地之环这个强大的萨满组织，企图平息元素并阻止灭世者。萨尔选择加尔鲁什·地狱咆哮做为继任者，然而这个决定一直困扰着他，因为新任大酋长却把部落带上了内乱的歧途。",
			hs_waleera:
				'瓦莉拉·萨古纳尔在竞技场角斗士上认识瓦里安和暗夜精灵德鲁伊布罗尔·熊皮组成"竞技场"角斗士三人组。尽管她拒绝在部落和联盟的战争中站队，这位血精灵仍然不止一次挽救过暴风城国王的性命。',
			hs_medivh:
				"卡拉赞领主，最后的守护者。黑暗泰坦萨格拉斯在被他的母亲艾格文击败后，悄悄潜入了她的身体，并最终侵入尚未出生的麦迪文体内。随着麦迪文的成长，萨格拉斯的黑暗力量渐渐显露出来。麦迪文与古尔丹的影子议会合力，打开了连接两个世界的黑暗之门，部落军队得以大举进入艾泽拉斯。最终，得于卡德加和加罗娜的相助，洛萨率众突入卡拉赞，击败了邪恶的守护者麦迪文。",
			hs_alleria:
				"风行者三姐妹的大姐。奥蕾莉亚·风行者的成名战始于巨魔战争中期，为了保卫家园，她击退了数之不尽的巨魔。 在第二次大战中，奎尔萨拉斯边陲地带被部落烧成了灰烬，但她和两个妹妹：希尔瓦娜斯和温蕾萨却幸存了下来。在兽人耐奥祖重新打开了德拉诺和艾泽拉斯之间的通路后，奥蕾莉亚参加了远征军，穿越传送门前往德拉诺。在远征军毁掉德拉诺端的黑暗之门之前，德拉诺开始四分五裂，选征军择了一扇新的传送门，并穿越了它，此后再无音讯。",
			hs_magni:
				"麦格尼是历史上最著名的矮人之一，作为一个统治者，他展现出了无比的勇气和慷慨无私的品质。作为铁炉堡的统治者，麦格尼·铜须国王总是将人民的需求置于自身所求之前。因此，当大地裂变震撼、颠覆了艾泽拉斯时，麦格尼执行了一个古老的仪式，试图与大地沟通以了解这次事件的起源。但麦格尼还没找到答案，就被变成一具了无生息的钻石雕像。",
			hs_liadrin:
				"曾是一名高等精灵牧师，现在是血骑士的领袖。莉亚德琳曾认为血精灵永远也无法偿清他们对穆鲁所犯下的错误，但维纶却使用穆鲁的精华净化了太阳之井，让太阳之井变成了一个满溢出圣光能量的巨大能量源。莉亚德琳不愿回到触及她心中伤口的奎尔萨拉斯去，独自幽居在幽魂之地中，但她却总是收到有人匿名送来（其实照顾她的正是对她恋心依旧的洛瑟玛·塞隆）的绿色魔法水晶，以缓解她同所有高等精灵一样在失去太阳之井后不能自拔的魔瘾。",
			hs_morgl:
				"一名鳄鱼人大地之环先知。鳄鱼人自上古时代就生活于索拉查盆地，可以说是最原始的鱼人种族，他们是索拉查盆地－这个泰坦生态实验场的第一批居民之一，虽然他们的相貌的确不敢恭维，但他们却默默的守护着这片区域，守护着泰坦创世时所留下的科技成果。 然而，他们的智力仍保持于原始崇拜的地步，他们基本不在意这些泰坦科技的重要性。",
			hs_khadgar:
				"大法师卡德加曾是守护者麦迪文手下的年轻学徒，亲身经历了前两次战争。当他发现麦迪文的计划，了解到麦迪文企图打开德拉诺传送门将受恶魔控制的兽人大军释放到艾泽拉斯之后，卡德加协助打败了他的导师。在战斗中，卡德加中了一个可怕的法术，整个人急剧地衰老。虽然身体变得年迈脆弱，但他的心智依然清醒敏锐。现在卡德加致力于联合艾泽拉斯的所有力量来对抗燃烧军团的入侵，而且要一劳永逸地解决古尔丹。",
			hs_tyrande:
				"作为月光之下最出色的猎手，女神艾露恩的选民，泰兰德已经领导暗夜精灵奋战了数个世纪。泰兰德出生于数千年前，与玛法里奥·怒风和伊利丹·怒风一共长大。她响应了暗夜精灵的月亮女神的追随者们，艾露恩姐妹会的召唤，成为一名新手女祭司。而怒风兄弟则走上了另一条道路。但当燃烧军团降临艾泽拉斯，他们的命运又再次发生了交集。",

			hs_neptulon:
				'耐普图隆被称为"猎潮者"。他是四大元素领主之一。他和拉格纳罗斯能够联手为你提供最好的桑拿服务。',
			hs_wvelen:
				"他被逐出他的家园。他兄弟们都变成了邪恶的主宰……但是除此之外，他好像也没有什么别的可以抱怨的了。",
			hs_antonidas:
				"肯瑞托的首席法师，达拉然最伟大的子民，安东尼达斯在被巫妖王阿尔萨斯杀死之前，曾是吉安娜的导师。. 预言者警告他必须迁移到西方去, 但安东尼达斯没有注意。最终导致了自己和达拉然的毁灭。",
			hs_alakir: "他是四大元素领主中最弱的一个。而另外三个总是会提醒他这一点。",
			hs_zhouzhuo:
				"游学者周卓整理并分享有关潘达利亚大陆的轶事，但他最喜欢的故事，是乔伊和菲比一起外出旅行发生的事情。",
			hs_yngvar: "唤雾者召来的不光有雾，还有霾。记得戴口罩。",
			hs_bchillmaw: "冰喉一心想要毁掉锦标赛。至于原因，都是因为那些吵闹个不停地熊孩子们！",
			hs_malorne: "玛洛恩之所以讨厌恶魔，是因为他不理解为什么这些又脏又臭的生物会长着和他一样的蹄子。",
			hs_malygos: "玛里苟斯憎恨凡人使用魔法。那会让他气急败坏！",
			hs_xuefashi: "他负责每年一度的血色修道院献血运动！",
			hs_loatheb:
				"洛欧塞布原本只是头普通的沼泽兽。从它身上的变化可见矿业和农业给自然带来了多大的破坏。",
			hs_trueheart: "英雄技能2.0升级版，面向所有职业。",
			hs_sainaliusi: "“当它们还是种子的时候，我便认识它们了……”",
			hs_lrhonin: "无主之人，无冕之王。",
			hs_bolvar:
				"在伯瓦尔身上的冰融化之后，他受邀接受了采访。在采访中他对艾泽拉斯全球气候变暖现象表达了深深的忧虑。",
			hs_fuding: "如果你还没听过《提里奥·弗丁主题曲》，那是因为它还没被谱写出来。",
			hs_xuanzhuanjijia: "这个打蛋器可好用了。",
			hs_ysera:
				"伊瑟拉统治翡翠梦境。所谓翡翠梦境，究竟只是现实世界的绿色朦胧倒影，还是其它别的什么地方？",
			hs_alextrasza:
				"生命的缚誓者阿莱克丝塔萨给所有人带来生命和希望。除了死亡之翼。除了玛里苟斯。除了耐克鲁斯。",
			hs_nozdormu: "没时间写什么背景描述了。",
			hs_kchromaggus: "当两个头都无法说服对方晚餐到底吃什么的时候，它通常都会去拉面店解决问题。",
			hs_lreno: "雷诺曾四次荣获由探险者协会颁发的“年度最佳服饰奖”。",
			hs_brann: "自从铁炉堡的国王麦格尼华丽登场后，布莱恩也想像哥哥那样出一套英雄皮肤。",
			hs_finley: "除了正常的官方用语外，他还精通14种鱼人方言。",
			hs_kcthun: "克苏恩最讨厌的一张牌，就是圣骑士的奥秘“以眼还眼”。",
			hs_anomalus: "阿诺玛鲁斯是由混乱的奥术能量所组成的，所以消灭它存在相当大的风险。",
			hs_blingtron: "启动布林顿，让所有参加派对的人都嗨起来！",
			hs_yogg: "你死期到了……死期到了……期到了……到了……了！",
			hs_xialikeer: "什么！螳螂妖给你的东西你也敢喝？真是自寻死路。",
			hs_zhishigushu: "去吧，把你的名字刻在树皮上。",
			hs_zhanzhenggushu:
				"年轻的暗夜精灵们喜欢一种叫做“谁能让战争古树站起来”的游戏。如果在它起身的时候你被踩死了，你还是输了。",
			hs_ronghejuren: "无数初次来到熔火之心的冒险者倒在他滚烫的脚掌之下。",
			hs_shanlingjuren: "他的妈妈说，他只是骨架比较大而已。",
			hs_aedwin:
				"他领导石匠协会重建了暴风城，而当贵族们拒绝支付工钱的时候，他将领导迪菲亚兄弟会，嗯，拆掉暴风城。",
			hs_mijiaojisi: "你绝不知道谁在为这个秘密组织效劳……",
			hs_huzhixiannv: "传闻她手中持的便是亚瑟王的断钢剑。",
			hs_totemic: "事实证明海象人对于图腾的样式一点都不挑剔。",
			hs_xsylvanas: "没有人比女王更渴望真正地死去。",
			hs_siwangzhiyi:
				"死亡之翼原本是高贵的巨龙奈萨里奥，他发疯之后制造了艾泽拉斯的大灾变，但最终被击败。子不教，父之过？",
			hs_bilanyoulong: "它们本来应该是宝蓝色或是蔚蓝色，但这几个颜色显得有点太耀眼了。",
			hs_jinglinglong: "可爱至极，免疫魔法，不会在毯子上撒尿。真是完美的宠物！",
			hs_nate:
				"纳特·帕格是艾泽拉斯最棒的钓手！他发明了自动鱼竿3000型，伸缩鱼竿3000型，以及电气自动诱捕器2099型（仍在测试中）。",
			hs_jiaziruila:
				"祖尔法拉克队是本届巨魔世界杯的夺冠热门球队，他们的队旗上描绘着令人望而生畏的多头蛇加兹瑞拉。",
			hs_lafamu: "他在搜集神器方面很有一手，只不过都是从别人的博物馆里抢来的。",
			hs_yelise: "作为团队里的绘图师，伊莉斯现在最主要的工作就是拼凑出完整的“黄金猿藏宝图”。",
			hs_fandral:
				"每当范达尔·鹿盔举起酒杯，并以“想当年我在种世界之树的时候……”为开场白在那老调重弹时，众酒客便会作鸟兽散。",
			hs_hallazeal: "根据能量守恒定律，你损失的生命值最终会转移到我身上。",
			hs_walian: "联盟的统治者！安杜因的父亲！同时他还喜欢玩竞技模式，场均12胜。",
			hs_tanghangu: "作为污手党家族的主心骨，汉有时真想把愚钝的古扫地出门，但他没法这么做。",
			hs_aya: "别看艾雅年纪轻，她可是玉莲帮的实际掌权者。看似天真活泼的少女，转眼之间就会召唤出魔像大军，将敌人统统碾碎！",
			hs_kazhakusi:
				"暗金教在此严正声明，卡扎库斯教主并非巨龙，也从未染指过违禁药水。任何公开污蔑暗金教与卡扎库斯教主本人的言论，必将遭受法律与龙息药水的严惩。",
			hs_shaku: "艾雅曾调查过沙库尔，看看他有没有私藏了什么好东西。",
			hs_laxiao: "什么？身为死亡之翼的儿子，拉西奥居然不是龙牌？你似乎知道的太多了……",
		},
		characterTitle: {
			hs_aiqinvyao: "#bSnonamekill",
		},
		perfectPair: {
			hs_sthrall: ["hs_totemic", "hs_alakir", "hs_neptulon", "hs_yngvar"],
			hs_anduin: ["hs_wvelen", "hs_mijiaojisi"],
			hs_jaina: ["hs_antonidas"],
			hs_malfurion: ["hs_malorne"],
		},
		/** @type { importCharacterConfig['skill'] } */
		skill: {
			hshuanyu: {
				trigger: { player: "damageEnd" },
				frequent: true,
				content() {
					if (!lib.characterPack.hearth) {
						player.draw();
						return;
					}
					var list = [];
					for (var i = 0; i < lib.cardPack.mode_derivation.length; i++) {
						var name = lib.cardPack.mode_derivation[i];
						var info = lib.card[name];
						if (info.gainable == false || info.destroy) continue;
						if (lib.characterPack.hearth[info.derivation]) {
							list.push(name);
						}
					}
					if (!list.length) {
						player.draw();
					} else {
						player.discoverCard(list);
					}
				},
				ai: {
					threaten: 0.8,
					maixie: true,
					maixie_hp: true,
					effect: {
						target(card, player, target) {
							if (get.tag(card, "damage")) {
								if (player.hasSkillTag("jueqing", false, target)) return [1, -2];
								if (!target.hasFriend()) return;
								if (target.hp >= 4) return [1, get.tag(card, "damage") * 2];
								if (target.hp == 3) return [1, get.tag(card, "damage") * 1.5];
								if (target.hp == 2) return [1, get.tag(card, "damage") * 0.5];
							}
						},
					},
				},
			},
			wxuying: {
				trigger: { player: "phaseBegin" },
				forced: true,
				content() {
					"step 0";
					var cards = player.getCards("h", function (card) {
						return card.name == "hsfashu_anyingjingxiang" || card._wxuying;
					});
					if (cards.length) {
						player.lose(cards)._triggered = null;
					}
					"step 1";
					var card = game.createCard("hsfashu_anyingjingxiang");
					card._modUseful = function () {
						return 7;
					};
					card._modValue = function () {
						return 7;
					};
					player.gain(card, "gain2");
				},
				subSkill: {
					lose: {
						trigger: { player: "loseAfter" },
						silent: true,
						content() {
							for (var i = 0; i < trigger.cards.length; i++) {
								if (trigger.cards[i]._wxuying) {
									player.storage.wxuying = trigger.cards[i];
									delete trigger.cards[i]._wxuying;
								}
							}
						},
					},
					change: {
						trigger: { player: ["useCard", "respond"] },
						silent: true,
						content() {
							var cards = player.getCards("h", function (card) {
								return card.name == "hsfashu_anyingjingxiang" || card._wxuying;
							});
							for (var i = 0; i < cards.length; i++) {
								cards[i].init(trigger.card);
								cards[i].classList.add("glow");
								cards[i]._wxuying = true;
							}
						},
					},
					hide: {
						trigger: { player: ["useCard", "respond"] },
						forced: true,
						priority: -1,
						filter(event, player) {
							return event.cards.includes(player.storage.wxuying);
						},
						content() {
							if (_status.currentPhase == player) {
								player.draw();
							} else {
								player.tempHide();
							}
							delete player.storage.wxuying;
						},
					},
					clear: {
						trigger: { player: "phaseAfter" },
						silent: true,
						content() {
							delete player.storage.wxuying;
						},
					},
				},
				group: ["wxuying_change", "wxuying_hide", "wxuying_lose", "wxuying_clear"],
			},
			buwendingyibian_ai1: {},
			buwendingyibian_ai2: {},
			buwendingyibian_lose: {
				trigger: { global: "phaseAfter" },
				silent: true,
				content() {
					var cards = player.getCards("h", function (card) {
						return card.name == "hsfashu_buwendingyibian" && card._destroy;
					});
					if (cards.length) {
						player.lose(cards)._triggered = null;
					}
				},
			},
			yibian: {
				trigger: { player: "phaseUseBegin" },
				forced: true,
				filter(event, player) {
					return !player.countCards("h", "hsfashu_buwendingyibian");
				},
				content() {
					player.gain(game.createCard("hsfashu_buwendingyibian"), "gain2");
				},
			},
			hualing: {
				enable: "phaseUse",
				round: 3,
				skillAnimation: true,
				filterTarget(card, player, target) {
					return target != player;
				},
				content() {
					"step 0";
					player.chooseSkill(target, function (info, skill) {
						return !player.hasSkill(skill);
					});
					"step 1";
					if (result.bool) {
						var skill = result.skill;
						player.addAdditionalSkill("hualing", skill);
						player.popup(skill);
						player.markSkillCharacter(
							"hualing",
							target.name,
							get.skillTranslation(skill, player),
							get.skillInfoTranslation(skill)
						);
					}
					"step 2";
					var rank = get.rank(target, true);
					var list = get.gainableCharacters(true);
					var choice = [];
					for (var i = 0; i < list.length; i++) {
						if (get.rank(list[i], true) == rank + 1) {
							choice.push(list[i]);
						}
					}
					if (!choice.length) {
						for (var i = 0; i < list.length; i++) {
							if (get.rank(list[i], true) == rank) {
								choice.push(list[i]);
							}
						}
					}
					if (choice.length) {
						var hp = target.hp;
						var name = choice.randomGet();
						target.reinit(target.name, name);
						target.hp = Math.min(hp, target.maxHp);
						target.update();
						game.triggerEnter(target);
					}
				},
				ai: {
					order: 8,
					result: {
						target(player, target) {
							return 1 / (get.rank(target, true) + 1);
						},
					},
				},
			},
			muyin: {
				trigger: { player: "loseEnd" },
				forced: true,
				filter(event, player) {
					if (player.countCards("h")) return false;
					for (var i = 0; i < event.cards.length; i++) {
						if (event.cards[i].original == "h") return true;
					}
					return false;
				},
				content() {
					player.tempHide();
				},
				ai: {
					noh: true,
					skillTagFilter(player, tag) {
						if (tag == "noh") {
							if (player.countCards("h") != 1) return false;
						}
					},
				},
			},
			tqchuanyue: {
				trigger: { player: "phaseBeginStart" },
				forced: true,
				ai: {
					threaten: 1.5,
				},
				content() {
					var list = [
						"oldhanshuang",
						"oldyanshu",
						"oldfbeifa",
						"oldmalymowang",
						"oldfenlie",
						"oldshifa",
						"oldfushi",
						"oldhuanjue",
						"oldzhanhou",
						"oldduxin",
						"oldenze",
						"oldyulu",
					];
					var map = {
						oldhanshuang: "hs_bchillmaw",
						oldyanshu: "hs_antonidas",
						oldfbeifa: "hs_fuding",
						oldmalymowang: "hs_malygos",
						oldfenlie: "hs_kchromaggus",
						oldshifa: "hs_shifazhe",
						oldfushi: "hs_alextrasza",
						oldhuanjue: "hs_zhihuanhua",
						oldzhanhou: "hs_jgarrosh",
						oldduxin: "hs_xialikeer",
						oldenze: "hs_malorne",
						oldyulu: "hs_sainaliusi",
					};
					for (var i = 0; i < list.length; i++) {
						var skill = list[i];
						if (!lib.skill[skill] || player.hasSkill(skill) || get.is.empty(lib.skill[skill])) {
							list.splice(i--, 1);
						}
					}
					if (list.length) {
						var skill = list.randomGet();
						player.addAdditionalSkill("tqchuanyue", skill);
						player.popup(skill);
						player.flashAvatar("tqchuanyue", map[skill]);
						player.markSkillCharacter(
							"tqchuanyue",
							map[skill],
							get.skillTranslation(skill),
							get.skillInfoTranslation(skill)
						);
					}
				},
			},
			oldhuanjue: {
				trigger: { global: "useCard1" },
				usable: 1,
				filter(event, player) {
					if (event.targets.length != 1) return false;
					if (event.player == player) return false;
					if (player != event.targets[0]) return false;
					for (var i = 0; i < lib.inpile.length; i++) {
						var info = lib.card[lib.inpile[i]];
						if (info.multitarget) continue;
						if (lib.filter.targetEnabled2({ name: lib.inpile[i] }, event.player, player)) {
							return true;
						}
					}
					return false;
				},
				check(event, player) {
					return get.effect(player, event.card, event.player, player) < 0;
				},
				prompt2(event, player) {
					return (
						"发现一张牌代替" +
						get.translation(event.player) +
						"对你使用的" +
						get.translation(event.card)
					);
				},
				autodelay: true,
				content() {
					"step 0";
					var list = [],
						list1 = [],
						list2 = [];
					for (var i = 0; i < lib.inpile.length; i++) {
						var info = lib.card[lib.inpile[i]];
						if (info.multitarget) continue;
						if (
							lib.filter.targetEnabled2(
								{ name: lib.inpile[i] },
								trigger.player,
								trigger.targets[0]
							)
						) {
							var cardinfo = [
								trigger.card.suit || "",
								trigger.card.number || "",
								lib.inpile[i],
							];
							list1.push(cardinfo);
							if (info.type != "equip") {
								list2.push(cardinfo);
							}
						}
					}
					var equipped = false;
					for (var i = 0; i < 3; i++) {
						if (equipped && list2.length) {
							list.push(list2.randomRemove());
						} else {
							equipped = true;
							list.push(list1.randomRemove());
						}
					}
					player.chooseButton(true, ["幻觉", [list, "vcard"]]).ai = function (button) {
						var card = {
							suit: trigger.card.suit,
							number: trigger.card.number,
							name: button.link[2],
						};
						return get.effect(trigger.targets[0], card, trigger.player, player);
					};
					"step 1";
					if (result.bool) {
						var card = game.createCard({
							suit: trigger.card.suit || lib.suit.randomGet(),
							number: trigger.card.number || Math.ceil(Math.random() * 13),
							name: result.links[0][2],
						});
						event.card = card;
						game.log(player, "将", trigger.card, "变为", card);
						// if(!event.isMine()) game.delayx();
						trigger.card = get.autoViewAs(card);
						trigger.cards = [card];
						game.cardsGotoOrdering(card).relatedEvent = trigger;
					} else {
						event.finish();
					}
					"step 2";
					player.$throw(event.card, null, null, true);
					if (player == trigger.player) {
						player.line(trigger.targets[0], "green");
					} else {
						player.line(trigger.player, "green");
					}
					game.delayx(0.5);
				},
				ai: {
					threaten: 0.1,
				},
			},
			hshuanling: {
				trigger: { player: "phaseEnd" },
				direct: true,
				filter(event, player) {
					return player.storage.hshuanling.length && player.countCards("he");
				},
				init(player) {
					player.storage.hshuanling = [];
				},
				intro: {
					content: "cards",
				},
				content() {
					"step 0";
					var num = Math.min(Math.max(1, player.countCards("e")), player.storage.hshuanling.length);
					var next = player.chooseToDiscard("he", get.prompt2("hshuanling"), [1, num]);
					next.ai = function (card) {
						if (get.position(card) == "e") return 7 - get.value(card);
						return 8 - get.value(card);
					};
					next.logSkill = "hshuanling";
					next.delay = false;
					"step 1";
					if (result.bool) {
						event.num = result.cards.length;
						player.draw(event.num);
					} else {
						event.finish();
					}
					"step 2";
					if (event.num) {
						var targets = game.filterPlayer();
						var list = player.storage.hshuanling.slice(0);
						while (list.length) {
							var choice = list.randomRemove();
							var card = game.createCard(choice);
							var target;
							while (targets.length) {
								target = targets.randomRemove();
								if (
									lib.filter.targetEnabled2(card, player, target) &&
									get.effect(target, card, player, player) > 0
								) {
									break;
								}
								target = null;
							}
							if (target) {
								player.storage.hshuanling.remove(choice);
								if (!player.storage.hshuanling.length) {
									player.unmarkSkill("hshuanling");
								} else {
									player.syncStorage("hshuanling");
									player.updateMarks();
								}
								player.useCard(card, target);
								break;
							}
						}
						event.num--;
						event.redo();
					}
				},
				group: ["hshuanling_count"],
				subSkill: {
					// clear:{
					// 	trigger:{player:'phaseAfter'},
					// 	silent:true,
					// 	content(){
					// 		player.storage.hshuanling.length=0;
					// 	}
					// },
					count: {
						trigger: { global: "useCard" },
						silent: true,
						filter(event, player) {
							if (get.is.converted(event)) return false;
							if (!event.player.isEnemiesOf(player)) return false;
							if (get.type(event.card) != "trick") return false;
							if (event.targets.length != 1) return false;
							// if(!event.targets[0].isFriendsOf(player)) return false;
							if (get.info(event.card).multitarget) return false;
							if (get.info(event.card).singleCard) return false;
							if (!get.info(event.card).enable) return false;
							return true;
						},
						content() {
							player.storage.hshuanling.add(trigger.card);
							player.markSkill("hshuanling");
						},
					},
				},
			},
			hsxingyi: {
				trigger: { global: "useSkillAfter" },
				forced: true,
				filter(event, player) {
					if (lib.filter.skillDisabled(event.skill)) return false;
					if (!game.expandSkills(event.player.getStockSkills()).includes(event.skill)) return false;
					return _status.currentPhase == event.player && event.player.isEnemiesOf(player);
				},
				content() {
					player.addTempSkill(trigger.skill, { player: "phaseAfter" });
				},
			},
			asyouzhang: {
				trigger: { player: "phaseEnd" },
				frequent: true,
				filter(event, player) {
					if (player.countCards("h", { type: "basic" }) == 0) return true;
					if (player.countCards("h", { type: ["trick", "delay"] }) == 0) return true;
					if (player.countCards("h", { type: "equip" }) == 0) return true;
					return false;
				},
				content() {
					"step 0";
					if (player.countCards("h", { type: "basic" }) == 0) {
						var card = get.cardPile(function (card) {
							return get.type(card) == "basic";
						});
						if (card) {
							player.gain(card, "draw");
						}
						event.basiccard = card;
					}
					"step 1";
					if (event.basiccard) {
						if (player.hasUseTarget(event.basiccard)) {
							var next = player.chooseToUse();
							next.filterCard = function (card) {
								return card == event.basiccard;
							};
							next.prompt = "是否使用" + get.translation(event.basiccard) + "？";
						}
					}
					"step 2";
					if (player.countCards("h", { type: ["trick", "delay"] }) == 0) {
						var card = get.cardPile(function (card) {
							return get.type(card) == "trick" || get.type(card) == "delay";
						});
						if (card) {
							player.gain(card, "draw");
						}
						event.trickcard = card;
					}
					"step 3";
					if (event.trickcard) {
						if (player.hasUseTarget(event.trickcard)) {
							var next = player.chooseToUse();
							next.filterCard = function (card) {
								return card == event.trickcard;
							};
							next.prompt = "是否使用" + get.translation(event.trickcard) + "？";
						}
					}
					"step 4";
					if (player.countCards("h", { type: "equip" }) == 0) {
						var card = get.cardPile(function (card) {
							return get.type(card) == "equip";
						});
						if (card) {
							player.gain(card, "draw");
						}
						event.equipcard = card;
					}
					"step 5";
					if (event.equipcard) {
						if (player.hasUseTarget(event.equipcard)) {
							var next = player.chooseToUse();
							next.filterCard = function (card) {
								return card == event.equipcard;
							};
							next.prompt = "是否使用" + get.translation(event.equipcard) + "？";
						}
					}
				},
				ai: {
					threaten: 1.7,
				},
			},
			ylyuchu: {
				trigger: { player: "recoverAfter" },
				forced: true,
				filter(event, player) {
					if (player.hasSkill("subplayer")) return false;
					return player.storage.ylyuchu.length < 3;
				},
				init(player) {
					if (!player.storage.ylyuchu) player.storage.ylyuchu = [];
				},
				ai: {
					threaten: 0.7,
				},
				// onremove(player){
				// 	delete player.storage.ylyuchu;
				// 	delete player.storage.ylyuchu2;
				// 	delete player.storage.ylyuchu3;
				// },
				group: ["ylyuchu_swap", "ylyuchu_phase"],
				subSkill: {
					chosen: {},
					swap: {
						trigger: { player: "phaseEnd" },
						silent: true,
						filter(event, player) {
							return player.storage.ylyuchu.length;
						},
						content() {
							var list = game.filterPlayer();
							list.remove(player);
							player.storage.ylyuchu2 = list.randomGets(player.storage.ylyuchu.length);
							player.storage.ylyuchu3 = player.storage.ylyuchu.slice(0).randomSort();
						},
					},
					phase: {
						trigger: { global: "phaseBefore" },
						forced: true,
						popup: false,
						filter(event, player) {
							if (player.hasSkill("subplayer")) return false;
							if (player.storage.ylyuchu2 && player.storage.ylyuchu3) {
								var idx = player.storage.ylyuchu2.indexOf(event.player);
								var target = player.storage.ylyuchu3[idx];
								if (target && player.storage.ylyuchu.includes(target)) {
									return true;
								}
							}
							return false;
						},
						content() {
							if (player.storage.ylyuchu2 && player.storage.ylyuchu3) {
								var idx = player.storage.ylyuchu2.indexOf(trigger.player);
								var target = player.storage.ylyuchu3[idx];
								if (target && player.storage.ylyuchu.includes(target)) {
									player.callSubPlayer(target);
									player.storage.ylyuchu2[idx] = null;
								}
							}
						},
					},
					exit: {
						trigger: { player: ["phaseAfter"] },
						forced: true,
						popup: false,
						priority: -60,
						content() {
							player.exitSubPlayer();
						},
					},
					draw: {
						trigger: { player: "phaseDrawBegin" },
						silent: true,
						filter(event) {
							return event.num > 0;
						},
						content() {
							trigger.num--;
						},
					},
					enter: {
						trigger: { global: "phaseAfter" },
						forced: true,
						popup: false,
						priority: -60,
						filter(event, player) {
							return event.player != player;
						},
						content() {
							player.insertPhase();
						},
					},
				},
				content() {
					"step 0";
					event.num = trigger.num;
					"step 1";
					if (event.num && player.storage.ylyuchu.length < 3) {
						var skill = player.addSubPlayer({
							name: "hs_yelinchulong",
							skills: ["ylyuchu_draw", "ylyuchu_exit", "ylyuchu_enter"],
							hp: 2,
							maxHp: 2,
							hs: get.cards(2),
							skill: skill,
							// intro:'下个敌方回合开始前，随机切换至此随从',
							intro2: "当前回合结束后进行一个额外回合并切换回本体",
							onremove(player) {
								player.storage.ylyuchu.remove(skill);
								delete lib.skill[skill];
							},
						});
						player.storage.ylyuchu.push(skill);
						event.num--;
						event.redo();
					}
				},
			},
			nsaiqi: {
				trigger: { player: "useCard" },
				forced: true,
				init(player) {
					player.storage.nsaiqi = [];
				},
				intro: {
					content: "cards",
				},
				filter(event, player) {
					if (ui.cardPile.firstChild && ui.cardPile.firstChild.vanishtag.includes("nsaiqi")) {
						return false;
					}
					return true;
				},
				onremove: "lose",
				content() {
					var cards = get.cards(3);
					for (var i = 0; i < cards.length; i++) {
						cards[i].vanishtag.add("nsaiqi");
					}
					player.storage.nsaiqi.addArray(cards);
					player.syncStorage("nsaiqi");
					player.markSkill("nsaiqi");
				},
				mod: {
					maxHandcard(player, num) {
						return num + 1;
					},
				},
			},
			nsbeiming: {
				trigger: { player: "nsaiqiAfter" },
				forced: true,
				filter(event, player) {
					return player.storage.nsaiqi.length >= 9;
				},
				content() {
					"step 0";
					player.draw();
					"step 1";
					player.chooseCardButton(
						player.storage.nsaiqi,
						true,
						"将顺序将牌置于牌堆顶（先选择的在上）",
						player.storage.nsaiqi.length
					);
					"step 2";
					var list = result.links.slice(0);
					while (list.length) {
						ui.cardPile.insertBefore(list.pop(), ui.cardPile.firstChild);
					}
					player.storage.nsaiqi.length = 0;
					player.unmarkSkill("nsaiqi");
				},
			},
			hsnitai: {
				trigger: { player: "phaseUseBegin" },
				forced: true,
				video(player, data) {
					var skills = data[0];
					var name = data[1];
					lib.skill.hsnitai.process(skills, name);
				},
				onremove(player) {
					player.removeSkill("hsnitai_card");
				},
				process(skills, name) {
					var cardname = "hsnitai_" + name;
					lib.translate[cardname] = lib.translate[name];
					lib.translate[cardname + "_info"] =
						"出牌阶段对自己使用，获得" +
						get.translation(name) +
						"的一个技能（替换前一个以此法获得的技能，效果持续2回合）";
					lib.translate[cardname + "_append"] = "";
					for (var i = 0; i < skills.length; i++) {
						lib.translate[cardname + "_append"] +=
							'<div class="skill">【' +
							lib.translate[skills[i]] +
							"】</div><div>" +
							get.skillInfoTranslation(skills[i]) +
							"</div>";
						if (i < skills.length) {
							lib.translate[cardname + "_append"] += "<br>";
						}
					}
					lib.card[cardname] = lib.card[cardname] || {
						enable: true,
						type: "character",
						image: "character:" + name,
						fullimage: true,
						vanish: true,
						skills: skills,
						derivation: "hs_barnes",
						filterTarget(card, player, target) {
							return player == target;
						},
						selectTarget: -1,
						content() {
							"step 0";
							var list = lib.card[card.name].skills;
							for (var i = 0; i < list.length; i++) {
								if (target.hasSkill(list[i])) {
									list.splice(i--, 1);
								}
							}
							if (!list.length) {
								event.finish();
								return;
							}
							event.skillai = function () {
								return get.max(list, get.skillRank, "item");
							};
							if (list.length == 1) {
								event._result = list[0];
							} else if (event.isMine()) {
								var dialog = ui.create.dialog("forcebutton");
								dialog.add("选择获得一项技能");
								var clickItem = function () {
									_status.event._result = this.link;
									dialog.close();
									game.resume();
								};
								for (var i = 0; i < list.length; i++) {
									if (lib.translate[list[i] + "_info"]) {
										var translation = get.translation(list[i]);
										if (translation[0] == "新" && translation.length == 3) {
											translation = translation.slice(1, 3);
										} else {
											translation = translation.slice(0, 2);
										}
										var item = dialog.add(
											'<div class="popup pointerdiv" style="width:80%;display:inline-block"><div class="skill">【' +
												translation +
												"】</div><div>" +
												lib.translate[list[i] + "_info"] +
												"</div></div>"
										);
										item.firstChild.addEventListener("click", clickItem);
										item.firstChild.link = list[i];
									}
								}
								dialog.add(ui.create.div(".placeholder"));
								event.switchToAuto = function () {
									event._result = event.skillai();
									dialog.close();
									game.resume();
								};
								_status.imchoosing = true;
								game.pause();
							} else {
								event._result = event.skillai();
							}
							"step 1";
							var skill = result;
							if (!target.hasSkill(skill)) {
								player.popup(skill);
								target.$gain2(card);
								target.removeSkill("hsnitai_card");
								target.storage.hsnitai_card = card;
								target.storage.hsnitai_card_count = 1;
								target.storage.hsnitai_card_skill = skill;
								player.syncStorage("hsnitai_card");
								player.syncStorage("hsnitai_card_skill");
								target.addAdditionalSkill("hsnitai_card", skill);
								target.addSkill("hsnitai_card");
								game.log(target, "获得技能", "【" + get.translation(skill) + "】");
							}
						},
						ai: {
							order() {
								if (_status.event.player.hasSkill("hsnitai_card")) return 1;
								return 9;
							},
							result: {
								target(player, target) {
									if (!player.hasSkill("hsnitai_card") || player.needsToDiscard()) return 1;
									return 0;
								},
							},
						},
					};
				},
				content() {
					var current = game.expandSkills(player.getSkills());
					var list = get.gainableSkills(function (info, skill, name) {
						if (current.includes(skill)) return false;
						return lib.characterPack.hearth && lib.characterPack.hearth[name];
					});
					if (!list.length) {
						return;
					}
					var skill = list.randomGet();
					var source = [];
					for (var i in lib.characterPack.hearth) {
						if (lib.characterPack.hearth[i][3].includes(skill)) {
							source.push(i);
						}
					}
					if (!source.length) {
						return;
					}
					var name = source.randomGet();
					var skills = [skill];
					var nameskills = lib.characterPack.hearth[name][3];
					for (var i = 0; i < nameskills.length; i++) {
						if (list.includes(nameskills[i])) {
							skills.add(nameskills[i]);
						}
					}
					game.addVideo("skill", player, ["hsnitai", [skills, name]]);
					lib.skill.hsnitai.process(skills, name);
					player.gain(game.createCard("hsnitai_" + name), "gain2");
				},
				subSkill: {
					card: {
						mark: "card",
						onremove: ["hsnitai_card", "hsnitai_card_count", "hsnitai_card_skill"],
						intro: {
							content(storage, player) {
								var skill = player.storage.hsnitai_card_skill;
								// var skill=storage.name.slice(8);
								return (
									'<div class="skill">【' +
									lib.translate[skill] +
									"】</div><div>" +
									get.skillInfoTranslation(skill) +
									"</div>"
								);
							},
						},
						trigger: { player: "phaseUseBegin" },
						priority: -10,
						silent: true,
						content() {
							if (player.storage.hsnitai_card_count > 0) {
								player.storage.hsnitai_card_count--;
							} else {
								player.removeSkill("hsnitai_card");
							}
						},
					},
				},
			},
			hspuzhao: {
				enable: "phaseUse",
				usable: 1,
				filterCard: { suit: "heart" },
				position: "he",
				filter(event, player) {
					return player.countCards("he", { suit: "heart" }) > 0;
				},
				check(card) {
					return 7 - get.value(card);
				},
				content() {
					var targets = player.getFriends();
					if (targets.length) {
						targets.push(player);
						if (targets.length > 3) {
							targets = targets.randomGets(3);
						}
						targets.sortBySeat();
						player.line(targets, "green");
						for (var i = 0; i < targets.length; i++) {
							targets[i].addExpose(0.2);
						}
						game.asyncDraw(targets);
					} else {
						player.draw(2);
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
			hsyanxin: {
				trigger: { player: "drawBegin" },
				priority: -5,
				filter(event, player) {
					if (game.fixedPile) return false;
					if (event.num <= 0) return false;
					if (ui.cardPile.childNodes.length == 0) return false;
					if (get.color(ui.cardPile.firstChild) == "red") return false;
					return true;
				},
				forced: true,
				popup: false,
				content() {
					var card = ui.cardPile.firstChild;
					if (lib.inpile.includes(card.name)) {
						for (var i = 1; i < ui.cardPile.childElementCount; i++) {
							var card2 = ui.cardPile.childNodes[i];
							if (get.color(card2) == "red") {
								ui.cardPile.insertBefore(card2, card);
								break;
							}
						}
					} else {
						card.init([["heart", "diamond"].randomGet(), card.number, card.name, card.nature]);
					}
				},
			},
			hstianqi: {
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					return player.countCards("he") > 0;
				},
				position: "he",
				init(player) {
					player.storage.hstianqi = [];
				},
				onremove: true,
				filterCard(card, player) {
					if (get.position(card) == "h") {
						if (
							player.getEquip(1) &&
							player.getEquip(2) &&
							player.getEquip(3) &&
							player.getEquip(4)
						) {
							return false;
						}
						return true;
					} else {
						return true;
					}
				},
				check(card) {
					var player = _status.event.player;
					if (get.position(card) == "e") {
						if (card.name.indexOf("hstianqi_") == 0) {
							for (var i = 0; i < player.storage.hstianqi.length; i++) {
								if (player.storage.hstianqi[i].name == card.name) return 0;
							}
							return 20 - get.value(card);
						} else {
							return (9 - get.value(card)) / 5;
						}
					} else {
						if (get.type(card) == "equip") {
							return 9 - get.value(card);
						}
						return 7 - get.value(card);
					}
				},
				discard: false,
				lose: false,
				delay: 0,
				intro: {
					content: "cards",
				},
				content() {
					"step 0";
					event.position = get.position(cards[0]);
					player.discard(cards);
					if (event.position == "e") {
						var name = cards[0].name;
						if (name.indexOf("hstianqi_") != 0) return;
						for (var i = 0; i < player.storage.hstianqi.length; i++) {
							if (player.storage.hstianqi[i].name == name) {
								return;
							}
						}
						player.storage.hstianqi.add(cards[0]);
						player.markSkill("hstianqi");
					}
					"step 1";
					if (event.position == "h") {
						var list = [];
						if (!player.getEquip(1)) {
							list.push({ name: "hstianqi_dalian", suit: "spade", number: 1 });
						}
						if (!player.getEquip(2)) {
							list.push({ name: "hstianqi_shali", suit: "heart", number: 1 });
						}
						if (!player.getEquip(3)) {
							list.push({ name: "hstianqi_suolasi", suit: "diamond", number: 1 });
						}
						if (!player.getEquip(4)) {
							list.push({ name: "hstianqi_nazigelin", suit: "club", number: 1 });
						}
						if (list.length) {
							player.equip(game.createCard(list.randomGet()), true);
						}
					} else {
						player.draw(2);
						event.finish();
					}
					"step 2";
					if (!event.isMine()) {
						game.delay(0.5);
					}
				},
				group: ["hstianqi_win"],
				subSkill: {
					win: {
						trigger: { player: "phaseBegin" },
						priority: 30,
						forced: true,
						skillAnimation: true,
						animationColor: "legend",
						filter(event, player) {
							return player.storage.hstianqi.length == 4;
						},
						content() {
							"step 0";
							game.delay();
							"step 1";
							if (game.showIdentity) {
								game.showIdentity();
							}
							if (player.isUnderControl(true) || player.getFriends().includes(game.me)) {
								game.over(true);
							} else {
								game.over(false);
							}
						},
					},
				},
				ai: {
					threaten(player, target) {
						if (target.storage.hstianqi.length == 4) return 20;
						if (target.storage.hstianqi.length == 3) return 2;
						return 1;
					},
					order: 9,
					result: {
						player: 1,
					},
				},
			},
			hstianqi_dalian: {
				trigger: { source: "damageEnd" },
				forced: true,
				filter(event, player) {
					return player.isDamaged();
				},
				content() {
					player.recover(trigger.num);
				},
			},
			hstianqi_shali: {
				trigger: { player: "recoverEnd" },
				forced: true,
				filter(event, player) {
					return event.num > 0;
				},
				content() {
					player.changeHujia(trigger.num);
				},
			},
			ysjqisha: {
				trigger: { source: "damageEnd", player: "damageEnd" },
				forced: true,
				filter(event, player) {
					if (event._notrigger.includes(event.player)) return false;
					return (
						(event.source != player && event.source.isIn()) ||
						(event.player != player && event.player.isIn())
					);
				},
				content() {
					var target = trigger.source;
					if (target == player) {
						target = trigger.player;
					}
					var list = ["ju", "kuang", "nu", "yi", "wang", "hen", "ao"];
					for (var i = 0; i < list.length; i++) {
						list[i] = "ysjqisha_" + list[i];
						if (target.hasSkillTag(list[i])) {
							list.splice(i--, 1);
						}
					}
					if (list.length) {
						target.addTempSkill(list.randomGet(), { player: "phaseAfter" });
					}
				},
				ai: {
					threaten: 0.8,
					maixie_defend: true,
				},
				subSkill: {
					ju: {
						mark: true,
						intro: {
							content: "锁定技，每当你使用一张牌，需弃置一张牌",
						},
						trigger: { player: "useCard" },
						forced: true,
						filter(event, player) {
							return player.countCards("he") > 0;
						},
						content() {
							game.delay(0.5);
							player.chooseToDiscard(true, "he");
						},
					},
					kuang: {
						mark: true,
						intro: {
							content: "锁定技，每当你使用一张牌指定惟一目标，有50%的机率指定错误的目标",
						},
						trigger: { player: "useCard" },
						forced: true,
						filter(event, player) {
							return (
								event.getRand() < 0.5 &&
								event.targets &&
								event.targets.length == 1 &&
								game.hasPlayer(function (current) {
									return (
										current != event.targets[0] &&
										lib.filter.targetEnabled2(event.card, player, current)
									);
								})
							);
						},
						content() {
							"step 0";
							game.delay();
							"step 1";
							var list = game.filterPlayer(function (current) {
								return (
									current != trigger.targets[0] &&
									lib.filter.targetEnabled2(trigger.card, player, current)
								);
							});
							if (list.length) {
								var target = list.randomGet();
								trigger.targets[0] = target;
								player.line(target, "green");
							}
						},
					},
					nu: {
						mark: true,
						intro: {
							content: "锁定技，你使用的卡牌造成的伤害+1；每当你使用一张牌，有65%的机率失效",
						},
						forced: true,
						trigger: { source: "damageBegin", player: "useCardToBefore" },
						filter(event, player) {
							if (event.name == "damage") return event.notLink() && (event.card ? true : false);
							var info = get.info(event.card);
							if (info.multitarget && event.targets && event.targets.includes(player))
								return false;
							return event.getRand() < 0.65;
						},
						content() {
							if (trigger.name == "damage") {
								trigger.num++;
							} else {
								trigger.cancel();
							}
						},
					},
					yi: {
						mark: true,
						intro: {
							content: "锁定技，你不能成为非敌方角色的卡牌目标",
						},
						mod: {
							targetEnabled(card, player, target) {
								if (!player.getEnemies().includes(target)) return false;
							},
						},
					},
					wang: {
						mark: true,
						intro: {
							content: "锁定技，你的摸牌数始终-1",
						},
						priority: 5,
						trigger: { player: "drawBegin" },
						forced: true,
						content() {
							trigger.num--;
						},
					},
					hen: {
						mark: true,
						intro: {
							content: "锁定技，每当一名敌方角色回复1点体力，你失去1点体力",
						},
						trigger: { global: "recoverAfter" },
						forced: true,
						filter(event, player) {
							return player.getEnemies().includes(event.player);
						},
						content() {
							player.loseHp();
						},
					},
					ao: {
						mark: true,
						intro: {
							content: "锁定技，你的手牌上限-2",
						},
						mod: {
							maxHandcard(player, num) {
								return num - 2;
							},
						},
					},
				},
			},
			yindan: {
				enable: "phaseUse",
				filterCard: { suit: "spade" },
				check(card) {
					return 8 - get.value(card);
				},
				usable: 1,
				filter(event, player) {
					return player.countCards("he", { suit: "spade" }) > 0;
				},
				position: "he",
				content() {
					"step 0";
					player.loseHp();
					"step 1";
					var cards = [];
					for (var i = 0; i < 2; i++) {
						cards.push(game.createCard("hsjixie_zhadan"));
					}
					player.gain(cards, "gain2");
				},
				ai: {
					order: 7,
					result: {
						player(player, target) {
							if (player.hp >= 3) return 1;
							if (
								player.hp == 2 &&
								game.hasPlayer(function (current) {
									return (
										get.damageEffect(current, player, player, "fire") > 0 &&
										current.hp == 1
									);
								})
							) {
								return 1;
							}
							return 0;
						},
					},
				},
			},
			hllingxi: {
				enable: "phaseUse",
				filter(event, player) {
					return game.hasPlayer(function (target) {
						return lib.skill.hllingxi.filterTarget(null, player, target);
					});
				},
				filterTarget(card, player, target) {
					if (target.hasSkill("hllingxi_used")) return false;
					return target != player && target.isDamaged() && target.countCards("he") >= 2;
				},
				content() {
					"step 0";
					target.chooseToDiscard("he", 2, true);
					"step 1";
					target.recover();
					target.addTempSkill("hllingxi_used");
				},
				group: "hllingxi_end",
				subSkill: {
					used: {},
					end: {
						trigger: { player: "phaseEnd" },
						frequent: true,
						filter(event, player) {
							return player.isDamaged();
						},
						content() {
							player.recover();
						},
					},
				},
				ai: {
					order: 6,
					result: {
						target(player, target) {
							var nc = target.countCards("he");
							if (target.hasSkillTag("maixie_hp")) {
								if (nc >= 3) return 1;
								if (target.hp == 1) return 1;
								return 0;
							}
							if (nc >= 4) {
								if (target.hp <= 2) return 1;
								return 0;
							} else if (nc == 3) {
								if (target.hp == 1) return 1;
								if (target.hp >= 4) return -1;
								return 0;
							} else {
								if (target.hp == 1) return 0;
								return -1;
							}
						},
					},
				},
			},
			zhaochao: {
				trigger: { player: "phaseEnd" },
				forced: true,
				filter(event, player) {
					return player.getEnemies().length > 0;
				},
				content() {
					"step 0";
					event.targets = player.getEnemies();
					player.addSkill("zhaochao2");
					player.useCard({ name: "sha" }, event.targets.randomRemove());
					"step 1";
					player.removeSkill("zhaochao2");
					if (player.storage.zhaochao2 && event.targets.length) {
						player.useCard({ name: "sha" }, event.targets.randomRemove());
						delete player.storage.zhaochao2;
					}
				},
				ai: {
					threaten: 1.7,
				},
			},
			zhaochao2: {
				trigger: { player: "shaMiss" },
				silent: true,
				filter(event) {
					return event.getParent(2).name == "zhaochao";
				},
				content() {
					player.storage.zhaochao2 = true;
				},
			},
			xiyong: {
				trigger: { player: "phaseEnd" },
				frequent: true,
				content() {
					"step 0";
					player.draw();
					"step 1";
					if (Array.isArray(result) && result.length) {
						var gained = result[0];
						if (lib.filter.cardEnabled(gained, target)) {
							var next = player.chooseToUse();
							next.filterCard = function (card) {
								return card == gained;
							};
							next.prompt = "是否使用" + get.translation(gained) + "？";
						} else {
							event.finish();
						}
					} else {
						event.finish();
					}
					"step 2";
					if (result.bool) {
						player.draw();
					}
				},
				ai: {
					threaten: 1.6,
				},
			},
			srjici: {
				trigger: { source: "damageEnd" },
				forced: true,
				content() {
					player.draw();
					if (
						trigger.player &&
						trigger.player.isIn() &&
						!trigger._notrigger.includes(trigger.player)
					) {
						trigger.player.randomDiscard();
					}
				},
				ai: {
					threaten: 1.4,
				},
			},
			yinzong: {
				trigger: { player: "loseEnd" },
				forced: true,
				filter(event, player) {
					for (var i = 0; i < event.cards.length; i++) {
						if (event.cards[i].original == "e") return true;
					}
					return false;
				},
				content() {
					// player.tempHide();
					player.gain(game.createCard("shan"), "gain2");
				},
			},
			tansuo: {
				enable: "phaseUse",
				usable: 1,
				filterCard: true,
				position: "he",
				check(card) {
					return 8 - get.value(card);
				},
				content() {
					if (!lib.characterPack.hearth) {
						player.draw();
						return;
					}
					var list = [];
					for (var i = 0; i < lib.cardPack.mode_derivation.length; i++) {
						var name = lib.cardPack.mode_derivation[i];
						var info = lib.card[name];
						if (info.gainable == false || info.destroy) continue;
						if (lib.characterPack.hearth[info.derivation]) {
							list.push(name);
						}
					}
					if (!list.length) {
						player.draw();
					} else {
						player.discoverCard(list);
						// player.gain(game.createCard(list.randomGet()),'draw');
					}
				},
				ai: {
					threaten: 1.6,
					order: 8,
					result: {
						player: 1,
					},
				},
			},
			lieqi: {
				trigger: { player: ["phaseBegin", "phaseEnd"] },
				filter(event, player) {
					return game.hasPlayer(function (current) {
						return (
							!current.isUnderControl(true, player) &&
							current != player.storage.lieqi &&
							current.countCards("h")
						);
					});
				},
				direct: true,
				content() {
					"step 0";
					player.chooseTarget(get.prompt("lieqi"), function (card, player, target) {
						return (
							!target.isUnderControl(true, player) &&
							target != player.storage.lieqi &&
							target.countCards("h")
						);
					}).ai = function () {
						return 1;
					};
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill("lieqi", target);
						if (event.triggername == "phaseBegin") {
							player.storage.lieqi = target;
						}
						var hs = target.getCards("h").randomSort();
						if (hs.length) {
							var list2 = [];
							for (var i = 0; i < hs.length; i++) {
								if (list2.includes(hs[i].name)) {
									hs.splice(i--, 1);
								} else {
									list2.push(hs[i].name);
								}
							}
							var card = hs.randomGet();
							var list = [];
							for (var i = 0; i < lib.inpile.length; i++) {
								if (
									!list2.includes(lib.inpile[i]) &&
									(get.type(lib.inpile[i]) != "equip" || Math.random() < 0.5)
								) {
									list.push(lib.inpile[i]);
								}
							}
							event.card = card;
							player.chooseCardButton(
								true,
								"猜测哪张牌为" + get.translation(target) + "的手牌",
								[
									card,
									game.createCard(list.randomRemove()),
									game.createCard(list.randomRemove()),
								].randomSort()
							).ai = function (button) {
								if (get.value(button.link) < 0) return -10;
								if (_status.event.getRand() < 0.7) {
									return button.link == card ? 1 : -1;
								} else {
									return button.link == card ? -1 : 1;
								}
							};
						} else {
							event.finish();
						}
					} else {
						event.finish();
					}
					if (event.triggername == "phaseEnd") {
						delete player.storage.lieqi;
					}
					"step 2";
					if (result.bool && result.links) {
						if (result.links[0] == event.card) {
							player.gain(game.createCard(event.card), "draw");
						} else {
							player.viewCards("正确答案", [event.card]);
						}
					}
				},
				ai: {
					threaten: 1.5,
				},
			},
			azaowu: {
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					if (
						event.filterCard({ name: "sha" }, player, event) ||
						event.filterCard({ name: "jiu" }, player, event) ||
						event.filterCard({ name: "tao" }, player, event)
					) {
						return player.hasCard(function (card) {
							return get.type(card) == "basic";
						});
					}
					return false;
				},
				chooseButton: {
					dialog(event, player) {
						var list = [];
						if (event.filterCard({ name: "sha" }, player, event)) {
							list.push(["基本", "", "sha"]);
							list.push(["基本", "", "sha", "fire"]);
							list.push(["基本", "", "sha", "thunder"]);
						}
						for (var i = 0; i < lib.inpile.length; i++) {
							if (
								lib.inpile[i] != "sha" &&
								lib.card[lib.inpile[i]].type == "basic" &&
								event.filterCard({ name: lib.inpile[i] }, player, event)
							) {
								list.push(["基本", "", lib.inpile[i]]);
							}
						}
						return ui.create.dialog("造物", [list, "vcard"], "hidden");
					},
					check(button) {
						var player = _status.event.player;
						var card = { name: button.link[2], nature: button.link[3] };
						if (
							game.hasPlayer(function (current) {
								return (
									player.canUse(card, current) &&
									get.effect(current, card, player, player) > 0
								);
							})
						) {
							switch (button.link[2]) {
								case "tao":
									return 5;
								case "xuejibingbao":
									return 4;
								case "jiu":
									return 3.01;
								case "sha":
									if (button.link[3] == "fire") return 2.95;
									else if (button.link[3] == "thunder") return 2.92;
									else return 2.9;
								default:
									return 2 + _status.event.getRand() * 2;
							}
						}
						return 0;
					},
					backup(links, player) {
						return {
							filterCard(card) {
								return get.type(card) == "basic";
							},
							viewAs: { name: links[0][2], nature: links[0][3] },
							popname: true,
							ai1(card) {
								return 6 - get.value(card);
							},
						};
					},
					prompt(links, player) {
						return (
							"将一张基本牌当作" +
							get.translation(links[0][3] || "") +
							get.translation(links[0][2]) +
							"使用"
						);
					},
				},
				ai: {
					order() {
						var player = _status.event.player;
						var event = _status.event;
						if (
							event.filterCard({ name: "jiu" }, player, event) &&
							get.effect(player, { name: "jiu" }) > 0
						) {
							return 3.1;
						}
						return 2.9;
					},
					result: {
						player: 1,
					},
				},
			},
			shouwang: {
				enable: "chooseToUse",
				filter(event, player) {
					return event.type == "dying" && event.dying && !event.dying.hasSkill("shouwang2");
				},
				filterTarget(card, player, target) {
					return target == _status.event.dying;
				},
				selectTarget: -1,
				content() {
					target.recover();
					target.changeHujia();
					target.addSkill("shouwang2");
				},
				ai: {
					order: 6,
					skillTagFilter(player) {
						if (!_status.event.dying || _status.event.dying.hasSkill("shouwang2")) return false;
					},
					save: true,
					result: {
						target: 3,
					},
					threaten: 1.6,
				},
			},
			shouwang2: {
				charlotte: true,
				mark: true,
				intro: {
					content: "已发动",
				},
			},
			qingtian: {
				trigger: { player: "damageBegin" },
				forced: true,
				filter(event, player) {
					return player.isMaxHp(true);
				},
				check() {
					return false;
				},
				content() {
					trigger.num++;
				},
				ai: {
					neg: true,
				},
			},
			qianfu: {
				trigger: { player: "dieBefore" },
				forced: true,
				filter(event, player) {
					return !player.hasSkill("qianfu2") && player.maxHp > 0;
				},
				unique: true,
				content() {
					trigger.cancel();
					player.addSkill("qianfu2");
					player.hp = 1;
					player.update();
					player.discard(player.getCards("he"));
					player.setAvatar("hs_selajin", "hs_selajin2");
				},
				ai: {
					threaten: 0.8,
				},
			},
			qianfu2: {
				mark: true,
				intro: {
					content: "你防止非火焰伤害，不能使用或打出卡牌，并始终跳过你的回合",
				},
				mod: {
					cardEnabled(card, player) {
						return false;
					},
					cardUsable(card, player) {
						return false;
					},
					cardRespondable(card, player) {
						return false;
					},
					cardSavable(card, player) {
						return false;
					},
				},
				group: ["qianfu2_damage", "qianfu2_phase", "qianfu2_revive"],
				subSkill: {
					damage: {
						trigger: { player: "damageBefore" },
						filter(event) {
							if (event.nature != "fire") return true;
							return false;
						},
						mark: true,
						forced: true,
						content() {
							trigger.cancel();
						},
						ai: {
							nothunder: true,
							nodamage: true,
							effect: {
								target(card, player, target, current) {
									if (get.tag(card, "damage") && !get.tag(card, "fireDamage"))
										return "zeroplayertarget";
								},
							},
						},
					},
					phase: {
						trigger: { player: "phaseBefore" },
						forced: true,
						popup: false,
						content() {
							trigger.cancel();
						},
					},
					revive: {
						trigger: { player: ["changeHp", "loseMaxHpAfter"] },
						forced: true,
						filter(event, player) {
							return player.hp >= 3 || player.isHealthy();
						},
						content() {
							player.removeSkill("qianfu2");
							player.draw(3);
							player.setAvatar("hs_selajin", "hs_selajin");
						},
					},
				},
			},
			shimo: {
				trigger: { global: "damageAfter" },
				forced: true,
				filter(event, player) {
					return event.player != player && get.distance(player, event.player) <= 1;
				},
				content() {
					if (player.isDamaged()) {
						player.recover();
					} else {
						player.draw();
					}
				},
			},
			lieyang: {
				trigger: { player: "useCard" },
				forced: true,
				usable: 3,
				filter(event, player) {
					return _status.currentPhase == player && get.type(event.card, "trick") == "trick";
				},
				content() {
					var list = get.inpile("trick", "trick");
					player.gain(game.createCard(list.randomGet()), "draw");
					if (player.storage.counttrigger && player.storage.counttrigger.lieyang >= 3) {
						player.addTempSkill("lieyang2");
					}
				},
				ai: {
					threaten: 1.8,
				},
			},
			lieyang2: {
				mod: {
					cardEnabled(card) {
						if (get.type(card, "trick") == "trick") return false;
					},
				},
			},
			zhuilie: {
				trigger: { player: "phaseBegin" },
				direct: true,
				filter(event, player) {
					return player.countCards("he") > 0;
				},
				content() {
					"step 0";
					player.chooseToDiscard("he", get.prompt("zhuilie")).set("ai", function (card) {
						if (player.hp >= 4 || (player.hasSha() && player.hasShan())) {
							return 6 - get.value(card);
						}
						if (player.hasSha() || player.hasShan()) {
							return 3 - get.value(card);
						}
						return 0;
					}).logSkill = "zhuilie";
					"step 1";
					if (result.bool) {
						var list = [];
						var list2 = [];
						for (var i = 0; i < 6 && i < ui.cardPile.childElementCount; i++) {
							list.push(ui.cardPile.childNodes[i]);
						}
						for (var i = 0; i < list.length; i++) {
							if (get.type(list[i]) == "basic") {
								list[i].discard();
								list2.push(list[i]);
							}
						}
						player.showCards(
							get.translation(player) + "将" + get.cnNumber(list2.length) + "张牌移入弃牌堆",
							list2
						);
						if (list2.length > 3) {
							player.draw();
						}
					}
				},
			},
			szbianshen: {
				trigger: { player: "phaseBefore" },
				unique: true,
				skillAnimation: true,
				//forceunique: true,
				filter() {
					return game.roundNumber >= 3;
				},
				check(event, player) {
					return player.hp <= 2;
				},
				content() {
					"step 0";
					var list = get.gainableCharacters(function (info) {
						return info[2] >= 5;
					});
					var players = game.players.concat(game.dead);
					for (var i = 0; i < players.length; i++) {
						list.remove(players[i].name);
						list.remove(players[i].name1);
						list.remove(players[i].name2);
					}
					var dialog = ui.create.dialog("将武将牌替换为一名角色", "hidden");
					dialog.add([list.randomGets(5), "character"]);
					player.chooseButton(dialog, true).ai = function (button) {
						return get.rank(button.link, true);
					};
					player.awakenSkill("szbianshen");
					"step 1";
					player.reinit(get.character(player.name2, 3).includes("szbianshen") ? player.name2 : player.name1, result.links[0]);
					player.hp = player.maxHp;
					player.update();
				},
			},
			kekao: {
				trigger: { player: "phaseEnd" },
				direct: true,
				content() {
					"step 0";
					var list = [];
					for (var i in lib.card) {
						if (game.bannedcards && game.bannedcards.includes(i)) continue;
						if (lib.card[i].type == "delay") {
							list.push(["锦囊", "", i]);
						}
					}
					if (list.length == 0) {
						event.finish();
						return;
					}
					var dialog = ui.create.dialog(
						get.prompt("kekao"),
						[list.randomGets(3), "vcard"],
						"hidden"
					);
					player.chooseButton(dialog).ai = function (button) {
						var name = button.link[2];
						var num = Math.random() * get.value({ name: name });
						if (lib.card[name].selectTarget == -1) {
							return num / 10;
						}
						return num;
					};
					"step 1";
					if (result.buttons) {
						player.logSkill("kekao");
						player.gain(game.createCard(result.buttons[0].link[2]), "draw");
					}
				},
				ai: {
					threaten: 1.6,
				},
			},
			jinhua: {
				trigger: { target: "useCardToBegin" },
				forced: true,
				filter(event, player) {
					return (
						player == event.player &&
						get.type(event.card, "trick") == "trick" &&
						event.card.isCard
					);
				},
				content() {
					"step 0";
					var list = get.gainableSkills();
					list.remove(player.getSkills());
					list = list.randomGets(3);
					event.skillai = function () {
						return get.max(list, get.skillRank, "item");
					};
					if (event.isMine()) {
						var dialog = ui.create.dialog("forcebutton");
						dialog.add("选择获得一项技能");
						var clickItem = function () {
							_status.event._result = this.link;
							dialog.close();
							game.resume();
						};
						for (var i = 0; i < list.length; i++) {
							if (lib.translate[list[i] + "_info"]) {
								var translation = get.translation(list[i]);
								if (translation[0] == "新" && translation.length == 3) {
									translation = translation.slice(1, 3);
								} else {
									translation = translation.slice(0, 2);
								}
								var item = dialog.add(
									'<div class="popup pointerdiv" style="width:80%;display:inline-block"><div class="skill">【' +
										translation +
										"】</div><div>" +
										lib.translate[list[i] + "_info"] +
										"</div></div>"
								);
								item.firstChild.addEventListener("click", clickItem);
								item.firstChild.link = list[i];
							}
						}
						dialog.add(ui.create.div(".placeholder"));
						event.switchToAuto = function () {
							event._result = event.skillai();
							dialog.close();
							game.resume();
						};
						_status.imchoosing = true;
						game.pause();
					} else {
						event._result = event.skillai();
					}
					"step 1";
					_status.imchoosing = false;
					var link = result;
					player.addSkill(link, true);
					player.popup(link);
					game.log(player, "获得了技能", "【" + get.translation(link) + "】");
					game.delay();
				},
				ai: {
					effect: {
						target(card, player, target) {
							if (get.type(card, "trick") == "trick" && player == target) return [1, 1];
						},
					},
				},
			},
			kqizhou: {
				trigger: { player: "phaseBegin" },
				direct: true,
				filter(event, player) {
					return player.storage.kqizhou;
				},
				content() {
					"step 0";
					delete player.storage.kqizhou;
					var list = [
						["", "", "hsqizhou_feng"],
						["", "", "hsqizhou_shui"],
						["", "", "hsqizhou_huo"],
						["", "", "hsqizhou_tu"],
					];
					var dialog = ui.create.dialog(get.prompt("kqizhou"), [list, "vcard"], "hidden");
					var shui = player.hp <= 1 && player.maxHp >= 3;
					var tu = game.hasPlayer(function (current) {
						return current.hp == 1 && get.attitude(player, current) > 0;
					});
					player.chooseButton(dialog).ai = function (button) {
						if (!player.hasFriend() && button.link[2] == "hsqizhou_tu") return 0;
						if (player.isHealthy() && button.link[2] == "hsqizhou_shui") return 0;
						if (shui && button.link[2] == "hsqizhou_shui") return 3;
						if (tu && button.link[2] == "hsqizhou_tu") return 2;
						return Math.random();
					};
					"step 1";
					if (result.buttons) {
						player.logSkill("kqizhou");
						player.gain(game.createCard(result.buttons[0].link[2]), "draw");
					}
				},
				group: "kqizhou_add",
				subSkill: {
					add: {
						trigger: { player: "useCard" },
						silent: true,
						filter(event, player) {
							return _status.currentPhase == player && get.type(event.card, "trick") == "trick";
						},
						content() {
							player.storage.kqizhou = true;
						},
					},
				},
			},
			jingcu: {
				enable: "phaseUse",
				filter(event, player) {
					return player.maxHp > 1;
				},
				content() {
					"step 0";
					player.loseMaxHp(true);
					"step 1";
					player.draw(2);
				},
				ai: {
					order: 1.5,
					threaten: 1.4,
					result: {
						player(player) {
							if (player.isDamaged()) return 1;
							if (player.hp >= 3 && !player.needsToDiscard(2)) return 1;
							return 0;
						},
					},
				},
			},
			shengzhang: {
				trigger: { player: "phaseDiscardEnd" },
				forced: true,
				filter(event, player) {
					return event.cards && event.cards.length > 0;
				},
				content() {
					player.gainMaxHp(true);
				},
			},
			pyuhuo: {
				unique: true,
				skillAnimation: true,
				animationColor: "fire",
				trigger: { player: "dying" },
				priority: 10,
				filter(event, player) {
					return player.storage.pyuhuo != "over";
				},
				forced: true,
				content() {
					"step 0";
					player.discard(player.getCards("hej"));
					"step 1";
					player.link(false);
					"step 2";
					player.turnOver(false);
					"step 3";
					if (player.storage.pyuhuo == "mid") {
						player.storage.pyuhuo = "over";
						player.awakenSkill("pyuhuo");
						player.hp = 6;
						player.maxHp = 6;
						player.draw(6);
						player.setAvatar("hs_pyros", "hs_pyros2");
					} else {
						player.storage.pyuhuo = "mid";
						player.hp = 4;
						player.maxHp = 4;
						player.draw(4);
						player.setAvatar("hs_pyros", "hs_pyros1");
					}
				},
				ai: {
					threaten(player, target) {
						if (target.storage.pyuhuo == "mid") return 0.6;
						if (target.storage.pyuhuo == "over") return 1;
						return 0.4;
					},
				},
			},
			mengye: {
				trigger: { player: "phaseEnd" },
				direct: true,
				filter(event, player) {
					return game.hasPlayer(function (current) {
						return current != player && current.countCards("h");
					});
				},
				content() {
					"step 0";
					player.chooseTarget(get.prompt("mengye"), function (card, player, target) {
						return target.countCards("h") > 0;
					}).ai = function (target) {
						if (target.hasSkillTag("nodu")) return get.attitude(player, target) * 1.5;
						if (
							target.hasCard(function (card) {
								return card.name != "du";
							})
						) {
							return -get.attitude(player, target);
						}
						return -get.attitude(player, target) / 5;
					};
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill("mengye", target);
						var card = target
							.getCards("h", function (card) {
								return card.name != "du";
							})
							.randomGet();
						if (card) {
							card.init([card.suit, card.number, "du"]);
						}
						target.changeHujia();
						game.log(target, "将一张手牌转化为", { name: "du" });
					}
				},
				ai: {
					threaten: 1.5,
				},
			},
			mengye2: {
				temp: true,
				mark: "character",
				vanish: true,
				intro: {
					content: "由$控制本回合行动",
				},
				init(player) {
					player.ai.modAttitudeFrom = function (from, to) {
						return get.attitude(player.storage.mengye2, to);
					};
					player.ai.modAttitudeTo = function (from, to, att) {
						if (from != to) return 0;
						return att;
					};
				},
				onremove(player) {
					delete player.ai.modAttitudeFrom;
					delete player.ai.modAttitudeTo;
					delete player.storage.mengye2;
					delete player.storage.mengye3;
					delete player.storage.mengye4;
				},
				trigger: { player: ["phaseAfter", "dieBegin"] },
				forced: true,
				popup: false,
				content() {
					player.storage.mengye2.in("mengye");
					if (player == game.me && player.storage.mengye3) {
						game.swapPlayerAuto(player.storage.mengye2);
					}
					if (typeof player.ai.shown == "number") {
						player.ai.shown = player.storage.mengye4;
					}
					player.removeSkill("mad");
					player.removeSkill("mengye2");
				},
			},
			mengye3: {},
			lianzhan: {
				trigger: { source: "damageEnd" },
				forced: true,
				content() {
					if (player.getStat().damage > trigger.num) {
						player.gainMaxHp();
						player.recover();
					} else {
						player.draw(2);
					}
				},
				ai: {
					damageBonus: true,
				},
			},
			lianzhan2: {},
			kuixin: {
				trigger: { player: "phaseEnd" },
				direct: true,
				filter(event, player) {
					return game.hasPlayer(function (current) {
						if (current == player) return false;
						var nh = current.countCards("h");
						return nh && nh >= player.countCards("h");
					});
				},
				content() {
					"step 0";
					player.chooseTarget(get.prompt("kuixin"), function (card, player, target) {
						if (target == player) return false;
						var nh = target.countCards("h");
						return nh && nh >= player.countCards("h");
					}).ai = function (target) {
						var att = get.attitude(player, target);
						if (target.hasSkillTag("noe")) {
							att /= 3;
						}
						return -att;
					};
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						var card = target.getCards("h").randomGet();
						if (card) {
							player.logSkill("kuixin", target);
							player.gain(card, target);
							target.$giveAuto(card, player);
						}
					}
				},
			},
			fuhua: {
				enable: "phaseUse",
				filterCard: { name: "du" },
				check() {
					return 1;
				},
				filterTarget(card, player, target) {
					return !target.hasSkill("moxie") && !target.hasSkill("fuhua2");
				},
				filter(event, player) {
					return player.countCards("h", "du") > 0;
				},
				discard: false,
				prepare: "give",
				content() {
					"step 0";
					target.gain(cards, player);
					var choice = 1;
					if (get.attitude(target, player) > 0 || (target.hp <= 1 && !target.hasSha())) {
						choice = 0;
					}
					target
						.chooseControl(function () {
							return choice;
						})
						.set("choiceList", [
							"获得技能魔血，每个出牌阶段开始时需交给" + get.translation(player) + "一张牌",
							"视为" +
								get.translation(player) +
								"对你使用一张决斗，若你赢，本局不能再成为腐化目标",
						]);
					"step 1";
					if (result.index == 0) {
						target.storage.fuhua2 = player;
						target.addSkill("fuhua2");
						target.addSkill("moxie");
					} else {
						player.useCard({ name: "juedou" }, target);
					}
				},
				ai: {
					threaten: 1.5,
					order: 8,
					expos: 0.2,
					result: {
						player(player, target) {
							if (player.countCards("h") <= 2) return 0;
							if (get.attitude(target, player) > 0) return 1;
							if (get.effect(target, { name: "juedou" }, player, player) > 0) return 1.5;
							return 0;
						},
					},
				},
			},
			fuhua2: {
				trigger: { player: "phaseEnd" },
				forced: true,
				priority: 1,
				filter(event, player) {
					return player.storage.fuhua2.isIn() && player.countCards("h") > 0;
				},
				mark: "character",
				intro: {
					content(storage) {
						return "每个结束阶段需交给" + get.translation(storage) + "一张手牌";
					},
				},
				content() {
					"step 0";
					player.chooseCard(
						"h",
						true,
						"交给" + get.translation(player.storage.fuhua2) + "一张手牌"
					);
					"step 1";
					if (result.bool) {
						player.storage.fuhua2.gain(result.cards, player);
						player.$give(result.cards, player.storage.fuhua2);
						player.line(player.storage.fuhua2, "green");
					}
				},
				group: "fuhua2_remove",
				onremove: true,
				subSkill: {
					remove: {
						trigger: { global: "dieAfter" },
						forced: true,
						popup: false,
						filter(event, player) {
							return event.player == player.storage.fuhua2;
						},
						content() {
							player.removeSkill("fuhua2");
						},
					},
				},
			},
			fuhua3: {
				trigger: { player: "damageBefore" },
				forced: true,
				popup: false,
				filter(event, player) {
					var evt = event.getParent(3);
					return evt.name == "fuhua" && evt.target == event.source;
				},
				content() {
					trigger.getParent(3).target.storage.fuhua_failed = true;
				},
			},
			moxie: {
				trigger: { player: "loseHpBegin" },
				forced: true,
				filter: (event) => event.type == "du",
				content() {
					trigger.cancel();
					player.draw(2);
				},
				ai: {
					threaten: 1.2,
					nodu: true,
					usedu: true,
				},
				group: "moxie_use",
				subSkill: {
					use: {
						trigger: { player: "phaseEnd" },
						forced: true,
						filter(event, player) {
							return player.countCards("h") > 0;
						},
						content() {
							var hs = player.getCards("h");
							for (var i = 0; i < hs.length; i++) {
								if (hs[i].name == "du") {
									hs.splice(i--, 1);
								}
							}
							if (hs.length) {
								var card = hs.randomGet();
								card.init([card.suit, card.number, "du"]);
								game.log(player, "将一张手牌转化为", { name: "du" });
							}
						},
					},
				},
			},
			qianhou: {
				trigger: { player: "phaseBegin" },
				forced: true,
				content() {
					"step 0";
					var list = [];
					for (var i = 0; i < lib.inpile.length; i++) {
						if (lib.filter.filterCard({ name: lib.inpile[i] }, player)) {
							var info = lib.card[lib.inpile[i]];
							if (info.type == "trick" && !info.multitarget && !info.notarget) {
								if (Array.isArray(info.selectTarget)) {
									if (
										info.selectTarget[0] > 0 &&
										info.selectTarget[1] >= info.selectTarget[0]
									) {
										list.push(lib.inpile[i]);
									}
								} else if (typeof info.selectTarget == "number") {
									list.push(lib.inpile[i]);
								}
							}
						}
					}
					while (list.length) {
						var card = { name: list.randomRemove() };
						var info = get.info(card);
						var targets = game.filterPlayer(function (current) {
							return lib.filter.filterTarget(card, player, current);
						});
						if (targets.length) {
							targets.sort(lib.sort.seat);
							if (info.selectTarget != -1) {
								var num = info.selectTarget;
								if (Array.isArray(num)) {
									if (targets.length < num[0]) continue;
									num = num[0] + Math.floor(Math.random() * (num[1] - num[0] + 1));
								} else {
									if (targets.length < num) continue;
								}
								targets = targets.randomGets(num);
							}
							player.useCard(card, targets, "noai");
							if (targets.length == 1 && targets[0] != player) {
								event.cardname = card.name;
							}
							break;
						}
					}
					"step 1";
					if (player.countCards("h") && event.cardname) {
						player.chooseToDiscard(
							"是否弃置一张手牌并获得" + get.translation(event.cardname) + "？",
							"h"
						).ai = function (card) {
							return get.value({ name: event.cardname }) - get.value(card);
						};
					} else {
						event.finish();
					}
					"step 2";
					if (result.bool) {
						var card = result.cards[0];
						var fakecard = game.createCard(event.cardname, card.suit, card.number);
						player.gain(fakecard, "gain2", "log");
					}
				},
			},
			hlongyi: {
				mod: {
					ignoredHandcard(card, player) {
						if (get.color(card) == "black") {
							return true;
						}
					},
				},
			},
			zhongji: {
				trigger: { source: "damageBegin" },
				direct: true,
				filter(event, player) {
					return player.countCards("h", { color: "black" }) > 0;
				},
				content() {
					"step 0";
					var next = player.chooseToDiscard(get.prompt("zhongji", trigger.player), {
						color: "black",
					});
					next.logSkill = ["zhongji", trigger.player];
					next.ai = function (card) {
						if (get.attitude(player, trigger.player) < 0) {
							return 7 - get.value(card);
						}
						return -1;
					};
					"step 1";
					if (result.bool) {
						trigger.num++;
					}
				},
				ai: {
					threaten: 1.3,
				},
			},
			fuwen: {
				trigger: { player: "phaseDiscardEnd" },
				frequent: true,
				filter(event, player) {
					if (event.cards) {
						for (var i = 0; i < event.cards.length; i++) {
							if (get.type(event.cards[i], "trick") == "trick") return true;
						}
					}
					return false;
				},
				content() {
					player.changeHujia();
				},
			},
			jinzhou: {
				trigger: { player: "phaseEnd" },
				direct: true,
				filter(event, player) {
					return player.countCards("h", { suit: "spade" }) > 0;
				},
				content() {
					"step 0";
					player.chooseTarget(get.prompt("jinzhou"), function (card, player, target) {
						return target != player && !target.hasSkill("fengyin");
					}).ai = function (target) {
						var att = get.attitude(player, target);
						if (att >= 0) return 0;
						var skills = target.getSkills();
						for (var i = 0; i < skills.length; i++) {
							if (!get.is.locked(skills[i])) {
								if (target.hasSkillTag("maixie")) return 2;
								return get.threaten(target);
							}
						}
						return 0;
					};
					"step 1";
					if (result.bool) {
						player.logSkill("jinzhou", result.targets);
						result.targets[0].addTempSkill("fengyin", { player: "phaseAfter" });
					}
				},
				ai: {
					expose: 0.2,
					threaten: 1.4,
				},
			},
			midian: {
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					return player.countCards("h", { type: ["trick", "delay"] }) > 0;
				},
				filterCard: { type: ["trick", "delay"] },
				check(card) {
					return 10 - get.value(card);
				},
				content() {
					var list = get.inpile("trick", "trick");
					var list2 = [];
					for (var i = 0; i < 3; i++) {
						list2.push(game.createCard(list.randomGet()));
					}
					player.gain(list2, "draw");
				},
				ai: {
					order: 9.8,
					threaten: 1.8,
					result: {
						player: 1,
					},
				},
			},
			xingluo: {
				trigger: { player: "phaseBegin" },
				direct: true,
				filter(event, player) {
					return !player.isMaxHandcard();
				},
				content() {
					"step 0";
					var nh = player.countCards("h");
					var num = game.countPlayer(function (current) {
						return current.countCards("h") > nh;
					});
					player.chooseTarget(get.prompt("xingluo"), [1, num], function (card, player, target) {
						return target.countCards("h") > nh;
					}).ai = function (target) {
						return 0.5 - get.attitude(player, target);
					};
					"step 1";
					if (result.bool) {
						event.cards = [];
						event.list = result.targets.slice(0);
						event.list.sort(lib.sort.seat);
						player.logSkill("xingluo", result.targets);
					} else {
						event.finish();
					}
					"step 2";
					if (event.list.length) {
						event.list.shift().chooseToDiscard("h", true);
					} else {
						event.goto(4);
					}
					"step 3";
					if (result.bool && result.cards.length) {
						event.cards.push(result.cards[0]);
					}
					event.goto(2);
					"step 4";
					if (event.cards.length) {
						player.chooseCardButton("选择一张加入手牌", event.cards).ai = function (button) {
							return get.value(button.link);
						};
					} else {
						event.finish();
					}
					"step 5";
					if (result.bool) {
						player.gain(result.links, "gain2");
					}
				},
				ai: {
					expose: 0.2,
				},
			},
			yuelu: {
				enable: "chooseToUse",
				filter(event, player) {
					return event.type == "dying" && player.countCards("he", { color: "black" }) > 0;
				},
				// alter:true,
				filterCard: { color: "black" },
				position: "he",
				check(card) {
					return 11 - get.value(card);
				},
				filterTarget(card, player, target) {
					return target == _status.event.dying;
				},
				selectTarget: -1,
				content() {
					target.recover();
					if (!get.is.altered("yuelu")) target.changeHujia();
				},
				ai: {
					order: 10,
					skillTagFilter(player) {
						if (player.countCards("he", { color: "black" }) == 0) return false;
					},
					save: true,
					result: {
						target: 3,
					},
					threaten: 2.5,
				},
			},
			yushou: {
				enable: "phaseUse",
				filterCard: true,
				position: "he",
				derivation: ["yushou_misha", "yushou_huofu", "yushou_leiouke"],
				check(card) {
					var player = _status.event.player;
					var num = 0;
					if (player.hasSkill("yushou_misha")) num += 1.5;
					if (player.hasSkill("yushou_huofu")) num += 1.5;
					if (player.hasSkill("yushou_leiouke")) num += 1.5;
					return 5 - num - get.value(card);
				},
				filter(event, player) {
					if (
						player.hasSkill("yushou_misha") &&
						player.hasSkill("yushou_huofu") &&
						player.hasSkill("yushou_leiouke")
					)
						return false;
					return true;
				},
				content() {
					if (!lib.character.stone_misha) {
						lib.character.stone_misha = [
							"male",
							"shu",
							3,
							["lschaofeng"],
							["minskin", "stone", "mode:stone"],
							[3, 3, "hunter"],
						];
					}
					if (!lib.character.stone_huofu) {
						lib.character.stone_huofu = [
							"male",
							"qun",
							2,
							["stone_chongfeng"],
							["minskin", "stone", "mode:stone"],
							[3, 4, "hunter"],
						];
					}
					if (!lib.character.stone_leiouke) {
						lib.character.stone_leiouke = [
							"male",
							"shu",
							2,
							["hunter_zhanhuo"],
							["minskin", "stone", "mode:stone"],
							[3, 1, "hunter"],
						];
					}
					var list = ["misha", "leiouke", "huofu"];
					for (var i = 0; i < list.length; i++) {
						if (player.hasSkill("yushou_" + list[i])) {
							list.splice(i--, 1);
						}
					}
					var skill = list.randomGet();
					var name = "yushou_" + skill;
					player.addSkill(name);
					player.markSkillCharacter(
						name,
						"stone_" + skill,
						lib.translate[name],
						lib.translate[name + "_info"]
					);
				},
				ai: {
					order: 9.5,
					result: {
						player: 1,
					},
				},
				group: "yushou_lose",
			},
			yushou_lose: {
				trigger: { player: "phaseBegin" },
				silent: true,
				content() {
					var list = ["yushou_misha", "yushou_huofu", "yushou_leiouke"];
					var skills = player.getSkills();
					for (var i = 0; i < list.length; i++) {
						if (!skills.includes(list[i])) list.splice(i--, 1);
					}
					if (list.length) {
						player.removeSkill(list.randomGet());
					}
				},
			},
			yushou_misha: {
				trigger: { player: "damageEnd" },
				forced: true,
				filter(event, player) {
					return event.num >= 1;
				},
				content() {
					player.changeHujia();
				},
				ai: {
					effect: {
						target(card, player, target) {
							if (get.tag(card, "damage")) {
								if (player.hasSkillTag("jueqing", false, target)) return;
								return 0.6;
							}
						},
					},
				},
			},
			yushou_huofu: {
				enable: "phaseUse",
				viewAs: { name: "juedou" },
				filterCard: { color: "black" },
				position: "he",
				viewAsFilter(player) {
					if (!player.countCards("he", { color: "black" })) return false;
				},
				check(card) {
					return 6 - get.value(card);
				},
				ai: {
					basic: {
						order: 10,
					},
				},
			},
			yushou_leiouke: {
				trigger: { source: "damageBegin" },
				forced: true,
				usable: 1,
				content() {
					trigger.num++;
				},
			},
			qingzun: {
				// alter:true,
				subSkill: {
					count: {
						trigger: { player: "useCard" },
						silent: true,
						filter(event, player) {
							return event.card.name.indexOf("hsqingyu_") == 0;
						},
						content() {
							player.storage.qingzun++;
							player.updateMarks();
						},
					},
					draw1: {
						trigger: { player: "phaseBegin" },
						filter(event, player) {
							if (get.is.altered("qingzun")) return player.storage.qingzun >= 3;
							return player.storage.qingzun >= 2;
						},
						frequent: true,
						content() {
							player.draw();
						},
					},
					draw2: {
						trigger: { player: "phaseEnd" },
						filter(event, player) {
							if (get.is.altered("qingzun")) return player.storage.qingzun >= 9;
							return player.storage.qingzun >= 6;
						},
						frequent: true,
						content() {
							player.draw();
						},
					},
				},
				mod: {
					maxHandcard(player, num) {
						return num + player.storage.qingzun;
					},
				},
				init(player) {
					player.storage.qingzun = 0;
				},
				mark: true,
				marktext: "玉",
				intro: {
					content(storage, player) {
						if (!storage) return "未使用过青玉牌";
						var str = "手牌上限+" + storage;
						var num1, num2;
						if (get.is.altered("qingzun")) {
							num1 = 3;
							num2 = 9;
						} else {
							num1 = 2;
							num2 = 6;
						}
						if (storage >= num2) {
							str += "；准备阶段和结束阶段，你可以摸一张牌";
						} else if (storage >= num1) {
							str += "；准备阶段，你可以摸一张牌";
						}
						return str;
					},
				},
				group: ["qingzun_count", "qingzun_draw1", "qingzun_draw2"],
			},
			ayuling: {
				trigger: { player: "damageEnd" },
				frequent: true,
				content() {
					var list = ["feibiao", "hufu", "zhao", "zhanfang", "shandian"];
					player.gain(game.createCard("hsqingyu_" + list.randomGet()), "draw");
				},
				ai: {
					maixie: true,
					maixie_hp: true,
					effect: {
						target(card, player, target) {
							if (get.tag(card, "damage")) {
								if (player.hasSkillTag("jueqing", false, target)) return [1, -2];
								if (!target.hasFriend()) return;
								if (target.hp >= 4) return [1, get.tag(card, "damage") * 2];
								if (target.hp == 3) return [1, get.tag(card, "damage") * 1.5];
								if (target.hp == 2) return [1, get.tag(card, "damage") * 0.5];
							}
						},
					},
				},
			},
			aoshu: {
				enable: "phaseUse",
				usable: 1,
				position: "he",
				filterCard(card) {
					return get.suit(card) == "spade";
				},
				viewAs: { name: "wuzhong" },
				viewAsFilter(player) {
					if (!player.countCards("he", { suit: "spade" })) return false;
				},
				prompt: "将一张黑桃牌当作无中生有使用",
				check(card) {
					return 7 - get.value(card);
				},
				ai: {
					threaten: 1.4,
					order: 9,
				},
			},
			bzhuiji: {
				trigger: { global: "dieAfter" },
				check(event, player) {
					return get.attitude(player, event.source) <= 0;
				},
				filter(event, player) {
					return event.source && event.source.isAlive() && event.source != player;
				},
				content() {
					player.draw(2);
					player.useCard({ name: "juedou" }, trigger.source);
				},
				ai: {
					threaten: 1.5,
					expose: 0.1,
				},
			},
			lianjin: {
				enable: "phaseUse",
				usable: 1,
				filterCard(card) {
					return get.type(card) != "hsyaoshui";
				},
				check(card) {
					return 8 - get.value(card);
				},
				position: "he",
				// discard:false,
				// lose:false,
				// delay:false,
				content() {
					"step 0";
					var names = [];
					var inpile = lib.inpile.slice(0);
					inpile.randomSort();
					var single = false;
					var equip = Math.random() < 0.5;
					var equips = [];
					for (var i = 0; i < inpile.length; i++) {
						if (lib.inpile[i] == "chuansongmen") continue;
						var info = lib.card[inpile[i]];
						if (!info.enable) continue;
						if (!info.filterTarget) continue;
						if (typeof info.selectTarget == "function") continue;
						if (inpile[i].indexOf("_") != -1) continue;
						if (info.type == "equip") {
							equips.push(inpile[i]);
							continue;
						}
						if (equip && names.length >= 2) continue;
						if (names.length >= 3) continue;
						var select = get.select(info.selectTarget);
						if (select[0] == -1 && select[1] == -1) {
							names.push(inpile[i]);
							if (info.modTarget) single = true;
						} else if (select[0] == 1 && select[1] == 1) {
							names.push(inpile[i]);
							single = true;
						}
					}
					if (equip) {
						names.push(equips.randomGet());
					}
					names.sort(lib.sort.name);
					var name = "hsyaoshui_" + names[0] + "_" + names[1] + "_" + names[2];
					if (!lib.card[name]) {
						lib.card[name] = get.copy(lib.skill.lianjin.template);
						lib.card[name].names = names;
						lib.card[name].selectTarget = single ? 1 : -1;
						lib.translate[name] = "药水";
						lib.translate[name + "_info"] =
							get.translation(names[0]) +
							"、" +
							get.translation(names[1]) +
							"、" +
							get.translation(names[2]);
					}
					var fakecard = game.createCard(name, cards[0].suit, cards[0].number);
					player.gain(fakecard, "gain2");
					// cards[0].style.transitionDuration='0.2s';
					// ui.refresh(cards[0]);
					// cards[0].classList.add('opaque');
					// event.cardname=name;
					// if(player!=game.me){
					// 	var fakecard=game.createCard(name);
					// 	fakecard.node.info.remove();
					// 	player.$draw(fakecard);
					// }
					// game.delay(0,200);
					// stp 1
					// cards[0].style.transitionDuration='0s';
					// ui.refresh(cards[0]);
					// cards[0].classList.remove('fullskin');
					// cards[0].init([cards[0].suit,cards[0].number,event.cardname]);
					// game.delay(0,100);
					// stp 2
					// cards[0].style.transitionDuration='';
					// ui.refresh(cards[0]);
					// cards[0].classList.remove('opaque');
					// game.delay(0,200);
				},
				template: {
					type: "hsyaoshui",
					enable: true,
					fullimage: true,
					image: "card/hsyaoshui",
					vanish: true,
					derivation: "hs_kazhakusi",
					multitarget: true,
					multiline: true,
					filterTarget(card, player, target) {
						var info = get.info(card);
						var names = info.names;
						for (var i = 0; i < names.length; i++) {
							var info2 = lib.card[names[i]];
							if (get.select(info2.selectTarget)[0] == -1 && !info2.modTarget) continue;
							if (!lib.filter.targetEnabled2({ name: names[i] }, player, target)) return false;
						}
						return true;
					},
					content() {
						"step 0";
						event.names = get.info(card).names.slice(0);
						"step 1";
						if (event.names.length) {
							var name = event.names.shift();
							var info = lib.card[name];
							var targets = [];
							if (get.select(info.selectTarget)[0] == -1 && !info.modTarget) {
								var targets = game.filterPlayer(function (current) {
									return player.canUse(name, current);
								});
								targets.sort(lib.sort.seat);
							} else {
								if (target.isDead()) {
									return;
								}
								targets.push(target);
							}
							player.useCard(
								game.createCard({ name: name, suit: get.suit(card), number: card.number }),
								targets,
								"noai"
							);
							player.addExpose(0.2);
							event.redo();
						}
					},
					ai: {
						order: 9.1,
						threaten: 1.5,
						result: {
							target(player, target, card) {
								var info = get.info(card);
								if (!info) return 0;
								if (!Array.isArray(info.names)) return 0;
								var names = info.names;
								if (names.includes("xingjiegoutong") && target.countCards("h") >= 3)
									return -1;
								var num = 0;
								for (var i = 0; i < names.length; i++) {
									var info2 = lib.card[names[i]];
									if (get.select(info2.selectTarget)[0] == -1 && !info2.modTarget) continue;
									var eff = get.effect(target, { name: names[i] }, player, target);
									if (eff > 0) {
										num++;
									} else if (eff < 0) {
										num -= 0.9;
									}
								}
								return num;
							},
						},
					},
				},
				ai: {
					order: 9,
					result: {
						player: 1,
					},
					threaten: 1.4,
				},
				group: "lianjin_discard",
				subSkill: {
					discard: {
						trigger: { player: "discardAfter" },
						forced: true,
						filter(event) {
							for (var i = 0; i < event.cards.length; i++) {
								if (get.type(event.cards[i]) == "hsyaoshui") return true;
							}
							return false;
						},
						content() {
							var list = [],
								cards = [];
							for (var i = 0; i < trigger.cards.length; i++) {
								if (get.type(trigger.cards[i]) == "hsyaoshui") {
									list.push(trigger.cards[i]);
								}
							}
							for (var i = 0; i < list.length; i++) {
								var names = get.info(list[i]).names;
								if (names) {
									cards.push(game.createCard(names.randomGet()));
								}
							}
							player.gain(cards, "draw2", "log");
						},
					},
				},
			},
			shouji: {
				group: ["shouji_begin", "shouji_miss"],
				subSkill: {
					begin: {
						trigger: { player: "shaBegin" },
						frequent: true,
						usable: 1,
						filter(event) {
							return event.target.countCards("h") > 0;
						},
						content() {
							player.gain(game.createCard(trigger.target.getCards("h").randomGet()), "draw");
						},
					},
					miss: {
						trigger: { player: "shaMiss" },
						frequent: true,
						usable: 1,
						filter(event) {
							return event.target.hasCard(function (card) {
								return !get.info(card).unique;
							}, "e");
						},
						content() {
							player.gain(
								game.createCard(
									trigger.target
										.getCards("e", function (card) {
											return !get.info(card).unique;
										})
										.randomGet()
								),
								"draw"
							);
						},
					},
				},
			},
			yingxi: {
				trigger: { player: "phaseEnd" },
				direct: true,
				filter(event, player) {
					return !player.getStat("damage") && player.countCards("he", { color: "black" }) > 0;
				},
				content() {
					"step 0";
					player.chooseCardTarget({
						prompt: get.prompt("yingxi"),
						filterCard: { color: "black" },
						filterTarget(card, player, target) {
							return lib.filter.targetEnabled({ name: "sha" }, player, target);
						},
						position: "he",
						ai1(card) {
							return 8 - get.value(card);
						},
						ai2(target) {
							return get.effect(target, { name: "sha" }, player, player);
						},
					});
					"step 1";
					if (result.bool) {
						player.useCard({ name: "sha" }, result.cards, result.targets, "yingxi");
					}
				},
				group: "yingxi2",
			},
			yingxi2: {
				trigger: { player: "shaBegin" },
				forced: true,
				popup: false,
				filter(event, player) {
					return event.skill == "yingxi" && event.target.isHealthy();
				},
				content() {
					trigger.directHit = true;
				},
			},
			hsguimou: {
				trigger: { player: "damageEnd" },
				check(event, player) {
					return get.attitude(player, event.source) <= 0;
				},
				filter(event, player) {
					return (
						event.source &&
						event.source.isAlive() &&
						event.source != player &&
						event.source.countCards("h") > 0
					);
				},
				logTarget: "source",
				content() {
					var card = trigger.source.getCards("h").randomGet();
					if (card) {
						player.gain(card, trigger.source);
						if (get.color(card) == "black") {
							trigger.source.$give(card, player);
							event.redo();
						} else {
							trigger.source.$giveAuto(card, player);
						}
						game.delay(0.5);
					}
				},
				ai: {
					maixie: true,
					maixie_hp: true,
					maixie_defend: true,
					effect: {
						target(card, player, target) {
							if (player.hasSkillTag("jueqing", false, target)) return [1, -2];
							if (!target.hasFriend()) return false;
							if (get.tag(card, "damage") && player.countCards("h") > 1) return [1, 0, 0, -1];
						},
					},
				},
			},
			peiyu: {
				trigger: { player: ["phaseBegin"] },
				direct: true,
				content() {
					"step 0";
					player.chooseTarget(get.prompt("peiyu"), function (card, player, target) {
						for (var i = 1; i <= 8; i++) {
							if (target.hasSkill("tuteng" + i)) return false;
						}
						return true;
					}).ai = function (target) {
						if (
							player == target &&
							get.attitude(player, target) > 0 &&
							event.parent.triggername == "phaseBegin"
						) {
							return get.attitude(player, target) + 10;
						}
						return get.attitude(player, target);
					};
					"step 1";
					if (result.bool) {
						player.logSkill("peiyu", result.targets);
						var rand = [
							"tuteng1",
							"tuteng2",
							"tuteng3",
							"tuteng4",
							"tuteng5",
							"tuteng6",
							"tuteng7",
							"tuteng8",
						];
						result.targets[0].addAdditionalSkill("peiyu", ["peiyu2", rand.randomGet()]);
					}
				},
			},
			peiyu2: {
				trigger: { player: "damageAfter" },
				silent: true,
				content() {
					player.removeAdditionalSkill("peiyu");
				},
			},
			wzhanyi: {
				trigger: { player: "phaseUseBefore" },
				check(event, player) {
					return player.countCards("h") + 2 <= player.hp;
				},
				content() {
					"step 0";
					event.cards = get.cards(3);
					trigger.cancel();
					player.$draw(event.cards.slice(0));
					for (var i = 0; i < event.cards.length; i++) {
						if (get.type(event.cards[i]) == "equip") {
							player.equip(event.cards[i]);
							event.cards.splice(i--, 1);
						}
					}
					player.gain(event.cards);
					"step 1";
					if (player.countCards("h", "sha")) {
						player.chooseToUse("战意：使用一张杀").filterCard = function (card) {
							return card.name == "sha" && get.itemtype(card) == "card";
						};
					} else {
						event.finish();
					}
					"step 2";
					if (result.bool) {
						event.goto(1);
					}
				},
			},
			shengteng: {
				trigger: { source: "damageEnd" },
				forced: true,
				filter(event) {
					return event.card && get.type(event.card) == "trick";
				},
				content() {
					player.gainMaxHp(true);
					player.recover();
				},
			},
			yuansu: {
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					return player.maxHp - player.hp >= 3;
				},
				filterTarget(card, player, target) {
					return player.canUse("yuansuhuimie", target);
				},
				selectTarget: -1,
				multitarget: true,
				multiline: true,
				line: "thunder",
				content() {
					player.maxHp = player.hp;
					player.update();
					targets.sort(lib.sort.seat);
					player.useCard({ name: "yuansuhuimie" }, targets).animate = false;
				},
			},
			chouhuo: {
				unique: true,
				trigger: { player: "phaseBegin" },
				forced: true,
				derivation: "nuyan2",
				skillAnimation: true,
				animationColor: "fire",
				filter(event, player) {
					if (player.storage.nuyan && player.storage.nuyan.length) {
						var num = 0;
						for (var i = 0; i < lib.inpile.length; i++) {
							if (get.tag({ name: lib.inpile[i] }, "damage")) {
								num++;
							}
						}
						return num <= player.storage.nuyan.length;
					}
					return false;
				},
				content() {
					player.loseMaxHp();
					player.changeHujia(2);
					player.removeSkill("nuyan");
					player.addSkill("nuyan2");
					player.awakenSkill("chouhuo");
				},
			},
			nuyan2: {
				enable: "phaseUse",
				usable: 3,
				chooseButton: {
					dialog(event, player) {
						var list = [];
						for (var i = 0; i < lib.inpile.length; i++) {
							if (get.tag({ name: lib.inpile[i] }, "damage")) {
								list.push([get.type(lib.inpile[i]), "", lib.inpile[i]]);
							}
						}
						return ui.create.dialog([list, "vcard"]);
					},
					filter(button, player) {
						return lib.filter.filterCard(
							{ name: button.link[2] },
							player,
							_status.event.getParent()
						);
					},
					check(button) {
						var player = _status.event.player;
						var recover = 0,
							lose = 1;
						var players = game.filterPlayer();
						for (var i = 0; i < players.length; i++) {
							if (players[i].hp < players[i].maxHp) {
								if (get.attitude(player, players[i]) > 0) {
									if (players[i].hp < 2) {
										lose--;
										recover += 0.5;
									}
									lose--;
									recover++;
								} else if (get.attitude(player, players[i]) < 0) {
									if (players[i].hp < 2) {
										lose++;
										recover -= 0.5;
									}
									lose++;
									recover--;
								}
							} else {
								if (get.attitude(player, players[i]) > 0) {
									lose--;
								} else if (get.attitude(player, players[i]) < 0) {
									lose++;
								}
							}
						}
						if (
							button.link[2] == "nanman" ||
							button.link[2] == "nanman" ||
							button.link[2] == "yuansuhuimie" ||
							button.link[2] == "chiyuxi" ||
							button.link[2] == "jingleishan"
						) {
							if (lose > recover && lose > 0) {
								return 2;
							} else {
								return 0;
							}
						}
						return 1;
					},
					backup(links, player) {
						return {
							filterCard() {
								return false;
							},
							selectCard: -1,
							popname: true,
							viewAs: { name: links[0][2] },
							onuse(result, player) {
								player.loseHp();
							},
						};
					},
					prompt(links, player) {
						return "失去1点体力，视为使用一张" + get.translation(links[0][2]);
					},
				},
				ai: {
					order: 6,
					result: {
						player(player) {
							if (player.hp > 1) return 1;
							return 0;
						},
					},
				},
			},
			nuyan: {
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					return player.countCards("he", { color: "red" }) > 0;
				},
				init(player) {
					player.storage.nuyan = [];
				},
				chooseButton: {
					dialog(event, player) {
						var list = [];
						for (var i = 0; i < lib.inpile.length; i++) {
							if (get.tag({ name: lib.inpile[i] }, "damage")) {
								list.push([get.type(lib.inpile[i]), "", lib.inpile[i]]);
							}
						}
						return ui.create.dialog([list, "vcard"]);
					},
					filter(button, player) {
						if (player.storage.nuyan.includes(button.link[2])) return false;
						return lib.filter.filterCard(
							{ name: button.link[2] },
							player,
							_status.event.getParent()
						);
					},
					check(button) {
						var player = _status.event.player;
						var recover = 0,
							lose = 1;
						var players = game.filterPlayer();
						for (var i = 0; i < players.length; i++) {
							if (players[i].hp < players[i].maxHp) {
								if (get.attitude(player, players[i]) > 0) {
									if (players[i].hp < 2) {
										lose--;
										recover += 0.5;
									}
									lose--;
									recover++;
								} else if (get.attitude(player, players[i]) < 0) {
									if (players[i].hp < 2) {
										lose++;
										recover -= 0.5;
									}
									lose++;
									recover--;
								}
							} else {
								if (get.attitude(player, players[i]) > 0) {
									lose--;
								} else if (get.attitude(player, players[i]) < 0) {
									lose++;
								}
							}
						}
						if (
							button.link[2] == "nanman" ||
							button.link[2] == "nanman" ||
							button.link[2] == "yuansuhuimie" ||
							button.link[2] == "chiyuxi" ||
							button.link[2] == "jingleishan"
						) {
							if (lose > recover && lose > 0) {
								return 2;
							} else {
								return 0;
							}
						}
						return 1;
					},
					backup(links, player) {
						return {
							filterCard: { color: "red" },
							selectCard: 1,
							position: "he",
							popname: true,
							viewAs: { name: links[0][2] },
							ai1(card) {
								return 6 - get.value(card);
							},
							onuse(result, player) {
								player.storage.nuyan.add(result.card.name);
							},
						};
					},
					prompt(links, player) {
						return "将一张红色牌当作" + get.translation(links[0][2]) + "使用";
					},
				},
				ai: {
					order: 6,
					result: {
						player: 1,
					},
				},
			},
			duxin: {
				trigger: { player: ["phaseBegin", "phaseEnd"] },
				frequent: true,
				filter(event, player) {
					return !player.countCards("h", { type: "hsdusu" });
				},
				derivation: [
					"hsdusu_xueji",
					"hsdusu_huangxuecao",
					"hsdusu_kuyecao",
					"hsdusu_shinancao",
					"hsdusu_huoyanhua",
				],
				content() {
					var list = [
						"hsdusu_xueji",
						"hsdusu_huangxuecao",
						"hsdusu_kuyecao",
						"hsdusu_shinancao",
						"hsdusu_huoyanhua",
					];
					if (typeof lib.cardType.hslingjian != "number") {
						list.remove("hsdusu_kuyecao");
					}
					var name = list.randomGet();
					if (name == "hsdusu_huoyanhua") {
						player.gain(game.createCard({ name: name, nature: "fire" }), "draw");
					} else {
						player.gain(game.createCard(name), "draw");
					}
				},
				ai: {
					threaten: 1.6,
				},
			},
			oldduxin: {
				trigger: { player: ["phaseBegin", "phaseEnd"] },
				frequent: true,
				derivation: [
					"hsdusu_xueji",
					"hsdusu_huangxuecao",
					"hsdusu_kuyecao",
					"hsdusu_shinancao",
					"hsdusu_huoyanhua",
				],
				content() {
					var list = [
						"hsdusu_xueji",
						"hsdusu_huangxuecao",
						"hsdusu_kuyecao",
						"hsdusu_shinancao",
						"hsdusu_huoyanhua",
					];
					if (typeof lib.cardType.hslingjian != "number") {
						list.remove("hsdusu_kuyecao");
					}
					var name = list.randomGet();
					if (name == "hsdusu_huoyanhua") {
						player.gain(game.createCard({ name: name, nature: "fire" }), "draw");
					} else {
						player.gain(game.createCard(name), "draw");
					}
				},
				ai: {
					threaten: 1.6,
				},
			},
			hsdusu_shinancao: {
				mark: true,
				marktext: "楠",
				nopop: true,
				intro: {
					content: "下一次造成的伤害+1",
				},
				logv: false,
				trigger: { source: "damageBegin" },
				forced: true,
				content() {
					trigger.num++;
					player.removeSkill("hsdusu_shinancao");
				},
			},
			xiubu: {
				trigger: { player: "equipEnd" },
				frequent: true,
				filter(event) {
					return (
						lib.inpile.includes(event.card.name) &&
						get.subtype(event.card) == "equip1" &&
						typeof lib.cardType.hslingjian == "number"
					);
				},
				content() {
					var num = 1;
					var info = get.info(trigger.card);
					if (info && info.distance && typeof info.distance.attackFrom == "number") {
						num = 1 - info.distance.attackFrom;
					}
					if (num < 1) {
						num = 1;
					}
					var list = get.typeCard("hslingjian");
					if (!list.length) {
						return;
					}
					var cards = [];
					while (num--) {
						cards.push(game.createCard(list.randomGet()));
					}
					player.gain(cards, "gain2");
				},
				threaten: 1.3,
			},
			zengli: {
				enable: "phaseUse",
				usable: 1,
				filterTarget(card, player, target) {
					return target != player && !target.isMin();
				},
				delay: false,
				content() {
					"step 0";
					var list = [];
					for (var i = 0; i < lib.inpile.length; i++) {
						if (lib.card[lib.inpile[i]].subtype == "equip1") {
							list.push(lib.inpile[i]);
						}
					}
					if (!list.length) {
						event.finish();
						return;
					}
					event.card1 = game.createCard(list.randomGet());
					event.card2 = game.createCard(list.randomGet());
					player.$draw(event.card1);
					target.$draw(event.card2);
					game.delay();
					"step 1";
					player.equip(event.card1);
					"step 2";
					target.equip(event.card2);
				},
				ai: {
					order: 11,
					result: {
						player: 1,
						target(player, target) {
							if (target.getEquip(1)) return 0;
							return 1;
						},
					},
				},
			},
			mobao: {
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					if (!player.storage.mobao) return false;
					if (!player.countCards("h", { color: "black" })) return false;
					for (var i = 0; i < player.storage.mobao.length; i++) {
						if (player.storage.mobao[i].isAlive()) return true;
					}
					return false;
				},
				filterTarget(card, player, target) {
					return player.storage.mobao.includes(target);
				},
				position: "he",
				selectTarget: -1,
				selectCard: [1, 3],
				check(card) {
					return 8 - get.value(card);
				},
				filterCard: { color: "black" },
				line: "thunder",
				content() {
					target.damage("thunder", cards.length);
				},
				ai: {
					order: 9,
					threaten: 0.7,
					result: {
						target(player, target) {
							return get.damageEffect(target, player, target, "thunder");
						},
					},
				},
				group: ["mobao2", "mobao3"],
			},
			mobao2: {
				trigger: { player: "damageEnd" },
				silent: true,
				filter(event, player) {
					return event.source && event.source != player;
				},
				content() {
					if (!player.storage.mobao) {
						player.storage.mobao = [];
					}
					player.storage.mobao.add(trigger.source);
				},
				ai: {
					maixie_defend: true,
				},
			},
			mobao3: {
				trigger: { player: "phaseEnd" },
				silent: true,
				content() {
					delete player.storage.mobao;
				},
			},
			xianji: {
				unique: true,
				forceunique: true,
				global: "xianji2",
			},
			xianji2: {
				trigger: { player: "phaseEnd" },
				direct: true,
				filter(event, player) {
					if (player.hasSkill("xianji")) return false;
					if (!player.countCards("he")) return false;
					if (player.hasSkill("xianji3")) return true;
					return game.hasPlayer(function (current) {
						return current.hasSkill("xianji");
					});
				},
				content() {
					"step 0";
					player.removeSkill("xianji3");
					event.target = game.findPlayer(function (current) {
						return current.hasSkill("xianji");
					});
					if (event.target) {
						player
							.chooseToDiscard(
								[1, 2],
								"献祭：是否弃置1~2张手牌并令" + get.translation(event.target) + "摸等量的牌？"
							)
							.set("ai", function (card) {
								if (
									get.attitude(_status.event.player, _status.event.getParent().target) > 1
								) {
									return 6 - get.value(card);
								}
								return 0;
							})
							.set("logSkill", ["xianji", event.target]);
					} else {
						event.finish();
					}
					"step 1";
					if (result.bool) {
						event.target.draw(result.cards.length);
						player.storage.xianji3 = event.target;
						player.addSkill("xianji3");
						player.addExpose(0.2);
					}
				},
			},
			xianji3: {
				mark: "character",
				intro: {
					content: "每当$对你使用一张牌，你摸一张牌",
				},
				trigger: { target: "useCardToBegin" },
				filter(event, player) {
					return event.player == player.storage.xianji3;
				},
				forced: true,
				content() {
					player.draw();
				},
			},
			tanmi: {
				trigger: { global: "phaseEnd" },
				filter(event, player) {
					return player.countCards("h") == 0 && event.player != player;
				},
				frequent: true,
				content() {
					"step 0";
					player.draw(2);
					"step 1";
					player.chooseToUse();
					"step 2";
					if (result.bool) {
						player.chooseToUse();
					}
				},
				ai: {
					noh: true,
					skillTagFilter(player, tag) {
						if (tag == "noh") {
							if (player.countCards("h") != 1) return false;
						}
					},
				},
			},
			xueren: {
				trigger: { source: "damageEnd" },
				filter(event) {
					if (event._notrigger.includes(event.player)) return false;
					return event.card && event.card.name == "sha" && event.player.isAlive();
				},
				check(event, player) {
					if (get.attitude(player, event.player) >= 0) return false;
					if (player.hp > 2) return true;
					if (player.hp < 2) return false;
					return player.hp >= event.player.hp;
				},
				content() {
					"step 0";
					trigger.player.loseHp();
					"step 1";
					player.loseHp();
					"step 2";
					player.draw(2);
				},
			},
			maoxian: {
				enable: "phaseUse",
				usable: 2,
				direct: true,
				delay: false,
				unique: true,
				content() {
					"step 0";
					var list = get.gainableSkills();
					list.remove("maoxian");
					list = list.randomGets(3);
					event.skillai = function () {
						return get.max(list, get.skillRank, "item");
					};
					if (event.isMine()) {
						var dialog = ui.create.dialog("forcebutton");
						dialog.add("选择获得一项技能");
						var clickItem = function () {
							_status.event._result = this.link;
							dialog.close();
							game.resume();
						};
						for (var i = 0; i < list.length; i++) {
							if (lib.translate[list[i] + "_info"]) {
								var translation = get.translation(list[i]);
								if (translation[0] == "新" && translation.length == 3) {
									translation = translation.slice(1, 3);
								} else {
									translation = translation.slice(0, 2);
								}
								var item = dialog.add(
									'<div class="popup pointerdiv" style="width:80%;display:inline-block"><div class="skill">【' +
										translation +
										"】</div><div>" +
										lib.translate[list[i] + "_info"] +
										"</div></div>"
								);
								item.firstChild.addEventListener("click", clickItem);
								item.firstChild.link = list[i];
							}
						}
						dialog.add(ui.create.div(".placeholder"));
						event.switchToAuto = function () {
							event._result = event.skillai();
							dialog.close();
							game.resume();
						};
						_status.imchoosing = true;
						game.pause();
					} else {
						event._result = event.skillai();
					}
					"step 1";
					_status.imchoosing = false;
					var link = result;
					player.addAdditionalSkill("maoxian", link);
					player.popup(link);
					game.log(player, "获得了技能", "【" + get.translation(link) + "】");
					player.checkMarks();
					player.markSkill("maoxian");
					game.delay();
				},
				intro: {
					content(storage, player) {
						return "当前技能：" + get.translation(player.additionalSkills.maoxian);
					},
				},
				ai: {
					order: 11,
					result: {
						player(player) {
							if (player.getStat().skill.maoxian) return 0;
							return 1;
						},
					},
				},
			},
			yiwen: {
				trigger: { target: "useCardToBegin" },
				filter(event, player) {
					return (
						event.targets &&
						event.targets.length == 1 &&
						event.target != event.player &&
						_status.currentPhase == event.player &&
						!event.player.hasSkill("yiwen2") &&
						!get.info(event.card).unique
					);
				},
				forced: true,
				content() {
					player.gain(game.createCard(trigger.card), "gain2");
					trigger.player.addTempSkill("yiwen2");
				},
				ai: {
					threaten: 0.7,
				},
			},
			yiwen2: {},
			qianghuax: {
				enable: "phaseUse",
				usable: 1,
				filterCard(card) {
					var type = get.type(card, "trick");
					for (var i = 0; i < ui.selected.cards.length; i++) {
						if (type == get.type(ui.selected.cards[i], "trick")) return false;
					}
					return true;
				},
				complexCard: true,
				position: "he",
				check(card) {
					return 8 - get.value(card);
				},
				selectCard: [1, Infinity],
				content() {
					var cards2 = [];
					for (var i = 0; i < cards.length; i++) {
						var type = get.type(cards[i], "trick");
						var list = game.findCards(function (name) {
							if (cards[i].name == name) return;
							if (get.type({ name: name }, "trick") == type) {
								return get.value({ name: name }) > get.value(cards[i]);
							}
						});
						if (!list.length) {
							list = game.findCards(function (name) {
								if (cards[i].name == name) return;
								if (get.type({ name: name }, "trick") == type) {
									return get.value({ name: name }) == get.value(cards[i]);
								}
							});
						}
						if (!list.length) {
							list = [cards[i].name];
						}
						cards2.push(game.createCard(list.randomGet()));
					}
					player.gain(cards2, "log");
					player.$draw(cards2);
				},
				ai: {
					order: 8,
					result: {
						player: 1,
					},
				},
			},
			zhuizong: {
				enable: "phaseUse",
				usable: 1,
				filterCard: true,
				position: "he",
				selectCard: [1, Infinity],
				check(card) {
					if (ui.selected.cards.length) return 0;
					return 6 - get.value(card);
				},
				content() {
					"step 0";
					event.cards = get.cards(4 * cards.length);
					player.chooseCardButton("获得其中的一张牌", true, event.cards, true);
					"step 1";
					player.gain(result.links, "draw");
					event.cards.remove(result.links[0]);
					for (var i = 0; i < event.cards.length; i++) {
						event.cards[i].discard();
					}
				},
				ai: {
					order: 8,
					result: {
						player: 1,
					},
				},
			},
			xunbao: {
				trigger: { player: "phaseBegin" },
				frequent: true,
				filter(event, player) {
					return !player.hasSkill("xunbao2");
				},
				derivation: ["hsbaowu_cangbaotu", "hsbaowu_huangjinyuanhou"],
				priority: 1,
				// filterCard:true,
				// check(card){
				// 	return 6-get.value(card);
				// },
				// position:'he',
				content() {
					"step 0";
					event.card = game.createCard("hsbaowu_cangbaotu");
					player.storage.xunbao2 = event.card;
					player.storage.xunbao2_markcount = player.storage.xunbao2.number;
					// player.$draw(player.storage.xunbao2);
					player.addSkill("xunbao2");
					game.delay(2);
					event.node = event.card
						.copy("thrown", "center", "thrownhighlight", ui.arena)
						.addTempClass("start");
					ui.arena.classList.add("thrownhighlight");
					game.addVideo("thrownhighlight1");
					game.addVideo("centernode", null, get.cardInfo(event.card));
					"step 1";
					game.addVideo("deletenode", player, [get.cardInfo(event.node)]);
					event.node.delete();
					event.node.style.transform = "scale(0)";
					game.addVideo("thrownhighlight2");
					ui.arena.classList.remove("thrownhighlight");
				},
				ai: {
					order: 3,
					result: {
						player: 1,
					},
				},
			},
			xunbao2: {
				mark: true,
				marktext: "宝",
				intro: {
					content: "card",
				},
				direct: true,
				trigger: { player: "phaseBegin" },
				filter(event, player) {
					var hs = player.getCards("he");
					for (var i = 0; i < hs.length; i++) {
						if (hs[i].number == player.storage.xunbao2.number) return true;
					}
					return false;
				},
				content() {
					"step 0";
					player.chooseToDiscard(
						"是否弃置一张点数为" + player.storage.xunbao2.number + "的牌获得藏宝图？",
						"he",
						function (card) {
							return card.number == player.storage.xunbao2.number;
						}
					).ai = function (card) {
						return 7 - get.value(card);
					};
					"step 1";
					if (result.bool) {
						player.gain(player.storage.xunbao2, "gain2", "log");
						delete player.storage.xunbao2;
						player.removeSkill("xunbao2");
					}
				},
			},
			hsbaowu_cangbaotu: {
				trigger: { player: "phaseEnd" },
				forced: true,
				popup: false,
				content() {
					player.gain(game.createCard("hsbaowu_huangjinyuanhou"), "gain2");
					player.removeSkill("hsbaowu_cangbaotu");
				},
			},
			hsbaowu_huangjinyuanhou: {
				mark: "card",
				nopup: true,
				intro: {
					content: "锁定技，你不能成为其他角色的卡牌的目标",
				},
				mod: {
					targetEnabled(card, player, target) {
						if (player != target) return false;
					},
				},
				group: "hsbaowu_huangjinyuanhou2",
			},
			hsbaowu_huangjinyuanhou2: {
				trigger: { player: "phaseBegin" },
				silent: true,
				content() {
					player.removeSkill("hsbaowu_huangjinyuanhou");
					delete player.storage.hsbaowu_huangjinyuanhou;
				},
			},
			xieneng: {
				trigger: { player: "phaseEnd" },
				direct: true,
				content() {
					"step 0";
					var list = [
						["", "", "hsshenqi_morijingxiang"],
						["", "", "hsshenqi_kongbusangzhong"],
						["", "", "hsshenqi_nengliangzhiguang"],
					];
					var dialog = ui.create.dialog(get.prompt("xieneng"), [list, "vcard"], "hidden");
					player.chooseButton(dialog).ai = function () {
						return Math.random();
					};
					"step 1";
					if (result.buttons) {
						player.logSkill("xieneng");
						player.gain(game.createCard(result.buttons[0].link[2]), "draw");
					}
				},
				ai: {
					threaten: 1.3,
				},
			},
			fbeifa: {
				trigger: { player: "loseEnd" },
				filter(event, player) {
					if (player.countCards("h")) return false;
					for (var i = 0; i < event.cards.length; i++) {
						if (event.cards[i].original == "h") return true;
					}
					return false;
				},
				direct: true,
				usable: 3,
				content() {
					"step 0";
					player.chooseTarget(get.prompt("fbeifa"), function (card, player, target) {
						return lib.filter.targetEnabled({ name: "sha" }, player, target);
					}).ai = function (target) {
						return get.effect(target, { name: "sha" }, player);
					};
					"step 1";
					if (result.bool) {
						player.logSkill("fbeifa");
						player.useCard({ name: "sha" }, result.targets, false);
					}
				},
				ai: {
					noh: true,
					skillTagFilter(player, tag) {
						if (tag == "noh") {
							if (player.countCards("h") != 1) return false;
						}
					},
					expose: 0.2,
				},
				group: ["fbeifa_draw"],
				subSkill: {
					draw: {
						trigger: { source: "damageAfter" },
						forced: true,
						popup: false,
						filter(event) {
							return event.parent.parent.parent.name == "fbeifa";
						},
						content() {
							player.draw();
						},
					},
				},
			},
			oldfbeifa: {
				trigger: { player: "loseEnd" },
				filter(event, player) {
					if (player.countCards("h")) return false;
					for (var i = 0; i < event.cards.length; i++) {
						if (event.cards[i].original == "h") return true;
					}
					return false;
				},
				direct: true,
				usable: 3,
				content() {
					"step 0";
					player.chooseTarget(get.prompt("fbeifa"), function (card, player, target) {
						return lib.filter.targetEnabled({ name: "sha" }, player, target);
					}).ai = function (target) {
						return get.effect(target, { name: "sha" }, player);
					};
					"step 1";
					if (result.bool) {
						player.logSkill("fbeifa");
						player.useCard({ name: "sha" }, result.targets, false);
					}
				},
				ai: {
					expose: 0.2,
				},
				group: ["oldfbeifa_draw"],
				subSkill: {
					draw: {
						trigger: { source: "damageAfter" },
						forced: true,
						popup: false,
						filter(event) {
							return event.parent.parent.parent.name == "oldfbeifa";
						},
						content() {
							player.draw();
						},
					},
				},
			},
			yufa: {
				trigger: { global: "phaseEnd" },
				direct: true,
				filter(event, player) {
					return player.storage.yufa == event.player;
				},
				content() {
					"step 0";
					player.chooseTarget(get.prompt("yufa"), function (card, player, target) {
						return target != trigger.player;
					}).ai = function (target) {
						return get.attitude(player, target);
					};
					"step 1";
					if (result.bool) {
						player.logSkill("yufa", result.targets);
						result.targets[0].gain(game.createCard("chuansongmen"), "gain2");
					}
				},
				group: ["yufa2", "yufa3"],
				ai: {
					maixie: true,
					maixie_hp: true,
					expose: 0.1,
				},
			},
			yufa2: {
				trigger: { player: "damageEnd" },
				filter(event, player) {
					return event.source == _status.currentPhase && event.source != player;
				},
				silent: true,
				content() {
					player.storage.yufa = trigger.source;
				},
			},
			yufa3: {
				trigger: { global: "phaseBegin" },
				silent: true,
				content() {
					player.storage.yufa = null;
				},
			},
			bingyan: {
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					if (!lib.card.chiyuxi || !lib.card.jingleishan) return false;
					return player.countCards("he") > 0;
				},
				filterTarget(card, player, target) {
					if (get.color(card) == "red") {
						return player.canUse("chiyuxi", target);
					} else {
						return player.canUse("jingleishan", target);
					}
				},
				selectTarget: -1,
				discard: false,
				delay: false,
				line: false,
				filterCard: true,
				position: "he",
				log: "notarget",
				check(card) {
					return 6 - get.value(card);
				},
				multitarget: true,
				content() {
					if (get.color(cards[0]) == "black") {
						player.useCard({ name: "jingleishan" }, cards, targets);
					} else {
						player.useCard({ name: "chiyuxi" }, cards, targets);
					}
				},
				ai: {
					order: 9.1,
					result: {
						target(player, target) {
							var card = ui.selected.cards[0];
							if (card && get.color(card) == "black") {
								return get.effect(target, { name: "jingleishan" }, player, target);
							}
							return get.effect(target, { name: "chiyuxi" }, player, target);
						},
					},
				},
			},
			shifa: {
				trigger: { player: "phaseUseBegin" },
				forced: true,
				content() {
					"step 0";
					var list = [];
					var target = player.getEnemies().randomGet();
					for (var i = 0; i < lib.inpile.length; i++) {
						if (lib.card[lib.inpile[i]].type == "trick") {
							list.push(lib.inpile[i]);
						}
					}
					player.gain(game.createCard(list.randomGet()));
					player.$draw();
					if (target) {
						target.gain(game.createCard(list.randomGet()));
						target.$draw();
						target.addExpose(0.2);
						player.line(target, "green");
						game.log(player, "和", target, "获得了一张锦囊牌");
					}
					"step 1";
					game.delay();
				},
				group: "shifa_draw",
				subSkill: {
					draw: {
						trigger: { player: "useCard" },
						frequent: true,
						usable: 3,
						filter(event, player) {
							if (_status.currentPhase != player) return false;
							return get.type(event.card) == "trick" && event.card.isCard;
						},
						content() {
							player.draw();
						},
					},
				},
				ai: {
					threaten: 1.5,
					noautowuxie: true,
				},
			},
			oldshifa: {
				trigger: { player: "phaseUseBegin" },
				forced: true,
				content() {
					"step 0";
					var list = [];
					var target = player.getEnemies().randomGet();
					for (var i = 0; i < lib.inpile.length; i++) {
						if (lib.card[lib.inpile[i]].type == "trick") {
							list.push(lib.inpile[i]);
						}
					}
					player.gain(game.createCard(list.randomGet()));
					player.$draw();
					if (target) {
						target.gain(game.createCard(list.randomGet()));
						target.$draw();
						target.addExpose(0.2);
						player.line(target, "green");
						game.log(player, "和", target, "获得了一张锦囊牌");
					}
					"step 1";
					game.delay();
				},
				group: "oldshifa_draw",
				subSkill: {
					draw: {
						trigger: { player: "useCard" },
						frequent: true,
						filter(event, player) {
							if (_status.currentPhase != player) return false;
							return get.type(event.card) == "trick" && event.card.isCard;
						},
						content() {
							player.draw();
						},
					},
				},
				ai: {
					threaten: 1.5,
					noautowuxie: true,
				},
			},
			yuanzheng: {
				trigger: { player: "useCardToBegin" },
				direct: true,
				filter(event, player) {
					return (
						event.target &&
						event.target != player &&
						get.distance(player, event.target) > 1 &&
						event.target.countCards("he") > 0
					);
				},
				content() {
					player.discardPlayerCard(
						trigger.target,
						get.prompt("yuanzheng", trigger.target),
						"hej"
					).logSkill = ["yuanzheng", trigger.target];
				},
			},
			yulu: {
				enable: "phaseUse",
				usable: 1,
				filterTarget: true,
				selectTarget: [1, Infinity],
				content() {
					"step 0";
					if (target == targets[0]) {
						game.asyncDraw(targets);
					}
					"step 1";
					if (target == targets[0]) {
						game.delay();
					}
					"step 2";
					target.chooseToDiscard("hej", true);
				},
				ai: {
					order: 10,
					result: {
						target(player, target) {
							if (target.countCards("j")) return 2;
							switch (target.countCards("he")) {
								case 0:
									return 0;
								case 1:
									return 0.5;
								case 2:
									return 0.8;
								default:
									return 1;
							}
						},
					},
					threaten: 1.2,
				},
			},
			oldyulu: {
				enable: "phaseUse",
				usable: 1,
				filterTarget: true,
				selectTarget: [1, Infinity],
				content() {
					"step 0";
					if (target == targets[0]) {
						game.asyncDraw(targets, 2);
					}
					"step 1";
					if (target == targets[0]) {
						game.delay();
					}
					"step 2";
					target.chooseToDiscard("hej", 2, true);
				},
				ai: {
					order: 10,
					result: {
						target(player, target) {
							if (target.countCards("j")) return 2;
							switch (target.countCards("he")) {
								case 0:
									return 0;
								case 1:
									return 0.5;
								case 2:
									return 0.8;
								default:
									return 1;
							}
						},
					},
					threaten: 1.2,
				},
			},
			duzhang: {
				trigger: { player: "phaseEnd" },
				direct: true,
				filter(event, player) {
					var stat = player.getStat("card");
					for (var i in stat) {
						if (typeof stat[i] == "number" && get.type(i, "trick") == "trick") {
							return false;
						}
					}
					return true;
				},
				content() {
					"step 0";
					player.chooseTarget(get.prompt("duzhang"), function (card, player, target) {
						return target != player;
					}).ai = function (target) {
						return -get.attitude(player, target) * Math.sqrt(target.countCards("h"));
					};
					"step 1";
					if (result.bool) {
						player.logSkill("duzhang", result.targets);
						result.targets[0].addTempSkill("duzhang2", { player: "phaseAfter" });
					}
				},
			},
			duzhang2: {
				mod: {
					cardEnabled(card) {
						if (get.type(card, "trick") == "trick") return false;
					},
				},
				mark: true,
				marktext: "瘴",
				intro: {
					content: "下个回合无法使用锦囊牌",
				},
			},
			hannu: {
				trigger: { player: "damageEnd" },
				forced: true,
				filter(event, player) {
					return player.countCards("h") > 0;
				},
				content() {
					"step 0";
					var nh = player.countCards("h");
					if (nh) {
						player.draw(nh);
					} else {
						event.finish();
					}
					"step 1";
					var hs = player.getCards("h");
					if (hs.length > 10 && hs.length > player.hp) {
						player.discard(hs.randomGets(hs.length - player.hp));
					}
				},
				ai: {
					maixie: true,
					maixie_hp: true,
					effect: {
						target(card, player, target) {
							if (get.tag(card, "damage")) {
								if (player.hasSkillTag("jueqing", false, target)) return [1, -2];
								if (!target.hasFriend()) return;
								var nh = target.countCards("h");
								if (nh > 5) return [1, -1];
								if (nh <= 1) return [1, -0.1];
								if (nh == 2) {
									if (target.hp >= 2) return [1, 0.1];
								} else {
									if (target.hp >= 4) return [1, 2];
									if (target.hp == 3) return [1, 1.5];
									if (target.hp == 2) return [1, 0.5];
								}
							}
						},
					},
				},
			},
			chuidiao: {
				trigger: { player: "phaseEnd" },
				forced: true,
				content() {
					var num = Math.floor(Math.random() * 3);
					if (num) player.draw(num);
				},
			},
			hhudun: {
				trigger: { global: "phaseBegin" },
				forced: true,
				filter(event, player) {
					return !player.hujia;
				},
				content() {
					player.changeHujia();
				},
				group: "hhudun_hujia",
				subSkill: {
					hujia: {
						trigger: { player: "damageEnd" },
						filter(event) {
							return event.hujia == event.num;
						},
						forced: true,
						content() {
							player.draw();
						},
					},
				},
				ai: {
					threaten(player, target) {
						if (target.hujia) {
							return 0.5;
						} else {
							return 2;
						}
					},
				},
			},
			fenlie: {
				audio: 2,
				forced: true,
				trigger: { player: "gainAfter" },
				filter(event, player) {
					if (event.parent.parent.name == "phaseDraw") return false;
					if (event.parent.name == "fenlie") return false;
					if (!event.cards) return false;
					for (var i = 0; i < event.cards.length; i++) {
						if (!get.info(event.cards[i]).unique) return true;
					}
					return false;
				},
				usable: 2,
				content() {
					var cards = [];
					for (var i = 0; i < trigger.cards.length; i++) {
						if (get.info(trigger.cards[i]).unique) continue;
						cards.push(game.createCard(trigger.cards[i]));
					}
					player.gain(cards, "draw");
				},
				ai: {
					effect: {
						target(card) {
							if (card.name == "toulianghuanzhu") {
								return [1, 2];
							}
						},
					},
				},
			},
			oldfenlie: {
				audio: 2,
				forced: true,
				trigger: { player: "gainAfter" },
				filter(event, player) {
					if (event.parent.parent.name == "phaseDraw") return false;
					if (event.parent.name == "oldfenlie") return false;
					if (!event.cards) return false;
					for (var i = 0; i < event.cards.length; i++) {
						if (!get.info(event.cards[i]).unique) return true;
					}
					return false;
				},
				content() {
					var cards = [];
					for (var i = 0; i < trigger.cards.length; i++) {
						if (get.info(trigger.cards[i]).unique) continue;
						cards.push(game.createCard(trigger.cards[i]));
					}
					player.gain(cards, "draw");
				},
				ai: {
					effect: {
						target(card) {
							if (card.name == "toulianghuanzhu") {
								return [1, 2];
							}
						},
					},
				},
			},
			nianfu: {
				trigger: { source: "damageEnd", player: "damageEnd" },
				forced: true,
				filter(event, player) {
					if (event._notrigger.includes(event.player)) return false;
					if (player == event.source) {
						return event.player != player && event.player.countCards("e") > 0;
					} else {
						return event.source && event.source != player && event.source.countCards("e") > 0;
					}
				},
				logTarget(event, player) {
					if (player == event.player) {
						return event.source;
					} else {
						return event.player;
					}
				},
				content() {
					var target = player == trigger.player ? trigger.source : trigger.player;
					if (target) {
						var cards = target.getCards("e");
						if (cards.length) {
							var card = cards.randomGet();
							player.gain(card, target);
							target.$give(card, player);
						}
					}
				},
			},
			xiaorong: {
				mod: {
					ignoredHandcard(card, player) {
						if (get.type(card) == "equip") {
							return true;
						}
					},
				},
				trigger: { player: "phaseEnd" },
				forced: true,
				filter(event, player) {
					return player.countCards("h", { type: "equip" }) > 0;
				},
				content() {
					var cards = player.getCards("h", { type: "equip" });
					if (cards.length) {
						player.lose(cards)._triggered = null;
						var list = [];
						var names = [];
						for (var i = 0; i < lib.inpile.length; i++) {
							if (lib.card[lib.inpile[i]].type == "basic") {
								names.push(lib.inpile[i]);
							}
						}
						names.remove("du");
						for (var i = 0; i < cards.length * 2; i++) {
							list.push(game.createCard(names.randomGet()));
						}
						player.directgain(list);
						player.recover(cards.length);
					}
				},
				ai: {
					effect: {
						player_use(card, player) {
							if (_status.currentPhase != player) return;
							if (get.type(card) == "equip" && get.equipValueNumber(card) < 7) {
								if (player.needsToDiscard(2)) return;
								return [0, 0, 0, 0];
							}
						},
					},
				},
			},
			shixu: {
				group: ["shixu_begin", "shixu_end", "shixu_discard"],
				subSkill: {
					begin: {
						trigger: { global: "phaseUseBegin" },
						silent: true,
						content() {
							trigger.player.storage.shixu_begin = get.time();
						},
					},
					end: {
						trigger: { global: "phaseUseEnd" },
						silent: true,
						filter(event, player) {
							return typeof event.player.storage.shixu_begin == "number";
						},
						content() {
							trigger.player.storage.shixu = get.time() - trigger.player.storage.shixu_begin;
							delete trigger.player.storage.shixu_begin;
						},
					},
					discard: {
						trigger: { global: "phaseEnd" },
						forced: true,
						check(event, player) {
							return get.attitude(player, event.player) < 0;
						},
						filter(event, player) {
							return (
								typeof event.player.storage.shixu == "number" &&
								event.player.storage.shixu > 3000 &&
								event.player.countCards("he") > 0 &&
								event.player.isAlive()
							);
						},
						content() {
							player.line(trigger.player, "green");
							trigger.player.chooseToDiscard(
								"he",
								true,
								Math.floor(trigger.player.storage.shixu / 3000)
							);
							delete trigger.player.storage.shixu;
						},
					},
				},
			},
			jixuan: {
				trigger: { player: "phaseAfter" },
				forced: true,
				priority: -50,
				filter(event, player) {
					return event.skill != "jixuan";
				},
				content() {
					player.draw();
					player.insertPhase();
				},
				ai: {
					threaten: 1.8,
				},
			},
			qianghua: {
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					if (event.parent.name == "qianghua") return false;
					if (player.storage.qianghua >= 1) return false;
					if (_status.currentPhase != player) return false;
					if (event.parent.parent.name != "phaseUse") return false;
					if (!event.targets || !event.card) return false;
					if (get.info(event.card).complexTarget) return false;
					if (!lib.filter.cardEnabled(event.card, player, event.parent)) return false;
					var type = get.type(event.card);
					if (type != "basic" && type != "trick") return false;
					var card = game.createCard(
						event.card.name,
						event.card.suit,
						event.card.number,
						event.card.nature
					);
					var targets = event._targets || event.targets;
					for (var i = 0; i < targets.length; i++) {
						if (!targets[i].isIn()) return false;
						if (!player.canUse({ name: event.card.name }, targets[i], false, false)) {
							return false;
						}
					}
					return true;
				},
				check(event, player) {
					if (get.tag({ name: event.card.name }, "norepeat")) return false;
					return true;
				},
				content() {
					player.storage.qianghua++;
					var card = game.createCard(
						trigger.card.name,
						trigger.card.suit,
						trigger.card.number,
						trigger.card.nature
					);
					player.useCard(card, (trigger._targets || trigger.targets).slice(0));
				},
				ai: {
					threaten: 1.3,
				},
				group: "qianghua_clear",
				subSkill: {
					clear: {
						trigger: { player: "phaseBefore" },
						silent: true,
						content() {
							player.storage.qianghua = 0;
						},
					},
				},
			},
			qianghua2: {},
			biri: {
				trigger: { global: "useCard" },
				priority: 15,
				filter(event, player) {
					return (
						event.card.name == "sha" &&
						event.player != player &&
						get.distance(player, event.targets[0]) <= 1 &&
						player.countCards("h", "shan") > 0 &&
						event.targets.includes(player) == false &&
						event.targets.length == 1
					);
				},
				direct: true,
				content() {
					"step 0";
					var effect = 0;
					for (var i = 0; i < trigger.targets.length; i++) {
						effect += get.effect(trigger.targets[i], trigger.card, trigger.player, player);
					}
					var str = "蔽日：是否弃置一张闪令" + get.translation(trigger.player);
					if (trigger.targets && trigger.targets.length) {
						str += "对" + get.translation(trigger.targets);
					}
					str += "的" + get.translation(trigger.card) + "失效？";
					var next = player.chooseToDiscard(
						"h",
						function (card) {
							return card.name == "shan";
						},
						str
					);
					next.ai = function (card) {
						if (effect < 0) {
							return 9 - get.value(card);
						}
						return -1;
					};
					next.autodelay = true;
					next.logSkill = ["biri", trigger.targets];
					"step 1";
					if (result.bool) {
						trigger.cancel();
					}
				},
				ai: {
					expose: 0.2,
				},
			},
			stuxi: {
				trigger: { player: "phaseEnd" },
				forced: true,
				filter(event, player) {
					var enemies = player.getEnemies();
					for (var i = 0; i < enemies.length; i++) {
						if (!enemies[i].hasSkill("stuxi2")) return true;
					}
					return false;
				},
				content() {
					var enemies = player.getEnemies();
					for (var i = 0; i < enemies.length; i++) {
						if (enemies[i].hasSkill("stuxi2")) {
							enemies.splice(i--, 1);
						}
					}
					var target = enemies.randomGet();
					if (target) {
						player.line(target, "green");
						target.addExpose(0.2);
						target.addSkill("stuxi2");
					}
				},
				ai: {
					expose: 0.2,
				},
			},
			stuxi2: {
				trigger: { player: "phaseDrawBegin" },
				forced: true,
				mark: true,
				intro: {
					content: "下个摸牌阶段摸牌数-1",
				},
				filter(event) {
					return event.num > 0;
				},
				content() {
					trigger.num--;
					player.removeSkill("stuxi2");
				},
			},
			bingdong: {
				trigger: { source: "damageEnd" },
				forced: true,
				usable: 1,
				filter(event, player) {
					if (!lib.card.hslingjian_jinjilengdong) {
						return false;
					}
					return true;
				},
				content() {
					player.gain(game.createCard("hslingjian_jinjilengdong"), "gain2");
				},
			},
			luoshi: {
				trigger: { player: "damageEnd" },
				forced: true,
				filter(event, player) {
					return player.countCards("he") > 0 || (event.source && event.source.countCards("he") > 0);
				},
				content() {
					"step 0";
					var hs = player.getCards("he");
					if (hs.length) {
						player.discard(hs.randomGet());
					}
					"step 1";
					if (trigger.source) {
						var hs = trigger.source.getCards("he");
						if (hs.length) {
							trigger.source.discard(hs.randomGet());
						}
					}
				},
				ai: {
					maixie_defend: true,
				},
			},
			ronghuo: {
				trigger: { player: "useCardToBefore" },
				priority: 7,
				filter(event, player) {
					if (event.card.name == "sha" && !event.card.nature) return true;
				},
				check(event, player) {
					var att = get.attitude(player, event.target);
					if (event.target.hasSkillTag("nofire")) {
						return att > 0;
					}
					return att <= 0;
				},
				forced: true,
				content() {
					trigger.card.nature = "fire";
					player.addSkill("ronghuo2");
					player.storage.ronghuo = trigger.card;
				},
			},
			ronghuo2: {
				trigger: { player: "useCardAfter" },
				forced: true,
				popup: false,
				content() {
					delete player.storage.ronghuo.nature;
				},
			},
			fushi: {
				enable: "phaseUse",
				usable: 1,
				filterTarget(card, player, target) {
					return target.hp < target.maxHp;
				},
				content() {
					"step 0";
					target.loseMaxHp(true);
					"step 1";
					if (target.hp < target.maxHp) {
						target.recover();
					}
				},
				ai: {
					threaten: 1.4,
					expose: 0.2,
					order: 9,
					result: {
						target(player, target) {
							if (target.hp == target.maxHp) return 0;
							if (target.hp == target.maxHp - 1) return -1;
							if (target.hp == 1) return 1;
							if (target.hp < target.maxHp - 2) return 0.5;
							return 0;
						},
					},
				},
			},
			oldfushi: {
				enable: "phaseUse",
				filterTarget(card, player, target) {
					return target.hp < target.maxHp;
				},
				content() {
					"step 0";
					target.loseMaxHp(true);
					"step 1";
					if (target.hp < target.maxHp) {
						target.recover();
					}
				},
				ai: {
					threaten: 1.4,
					expose: 0.2,
					order: 9,
					result: {
						target(player, target) {
							if (target.hp == target.maxHp) return 0;
							if (target.hp == target.maxHp - 1) return -1;
							if (target.hp == 1) return 1;
							if (target.hp < target.maxHp - 2) return 0.5;
							return 0;
						},
					},
				},
			},
			moyao: {
				mod: {
					targetEnabled(card, player, target, now) {
						if (player != target) {
							if (get.type(card, "trick") == "trick") return false;
						}
					},
				},
			},
			jiaohui: {
				trigger: { player: "phaseEnd" },
				direct: true,
				filter(event, player) {
					return !player.getStat("damage");
				},
				content() {
					"step 0";
					player.chooseTarget(get.prompt("jiaohui")).ai = function (target) {
						var att = get.attitude(player, target);
						if (att > 1) {
							if (target.hp <= 1) att += 2;
							if (target.hp <= 2) att++;
						}
						return att;
					};
					"step 1";
					if (result.bool) {
						event.target = result.targets[0];
						player.logSkill("jiaohui", event.target);
						event.target.chooseDrawRecover(true);
					}
				},
			},
			bimeng: {
				trigger: { player: "phaseEnd" },
				frequent: true,
				derivation: [
					"hsmengjing_feicuiyoulong",
					"hsmengjing_huanxiaojiemei",
					"hsmengjing_suxing",
					"hsmengjing_mengye",
					"hsmengjing_mengjing",
				],
				content() {
					var list = [
						"hsmengjing_feicuiyoulong",
						"hsmengjing_huanxiaojiemei",
						"hsmengjing_suxing",
						"hsmengjing_mengye",
						"hsmengjing_mengjing",
					];
					player.gain(game.createCard(list.randomGet()));
					player.$draw();
				},
				ai: {
					threaten: 2,
				},
			},
			zhoujiang: {
				trigger: { player: "useCard" },
				forced: true,
				filter(event, player) {
					return get.type(event.card) == "trick";
				},
				content() {
					var list = [
						"hszuzhou_nvwudeganguo",
						"hszuzhou_nvwudepingguo",
						"hszuzhou_nvwudexuetu",
						"hszuzhou_wushushike",
						"hszuzhou_guhuo",
					];
					player.gain(game.createCard(list.randomGet()), "draw");
				},
				ai: {
					threaten: 1.5,
				},
			},
			liehun: {
				trigger: { player: "phaseEnd" },
				forced: true,
				filter(event, player) {
					return player.hasCard(function (card) {
						return get.type(card) != "basic" && !get.info(card).unique;
					});
				},
				content() {
					var hs = player.getCards("h");
					for (var i = 0; i < hs.length; i++) {
						if (get.type(hs[i]) == "basic" || get.info(hs[i]).unique) {
							hs.splice(i--, 1);
						}
					}
					if (hs.length) {
						var hs2 = [];
						for (var i = 0; i < hs.length; i++) {
							hs2.push(game.createCard(hs[i].name, hs[i].suit, hs[i].number));
						}
						player.gain(hs2, "draw");
					}
				},
				ai: {
					threaten: 1.5,
				},
			},
			xjumo: {
				mod: {
					maxHandcard(player, num) {
						if (player.hp < player.maxHp) return num + 5;
						return num + 3;
					},
				},
			},
			malymowang: {
				trigger: { source: "damageBegin" },
				forced: true,
				usable: 1,
				filter(event) {
					return (
						event.card &&
						get.type(event.card) == "trick" &&
						event.parent.name != "_lianhuan" &&
						event.parent.name != "_lianhuan2"
					);
				},
				content() {
					trigger.num++;
				},
				group: "malymowang_discover",
				ai: {
					threaten: 1.8,
				},
				subSkill: {
					discover: {
						trigger: { player: "phaseUseBegin" },
						forced: true,
						content() {
							player.discoverCard(get.inpile("trick"));
						},
					},
				},
			},
			oldmalymowang: {
				trigger: { source: "damageBegin" },
				forced: true,
				filter(event) {
					return (
						event.card &&
						get.type(event.card) == "trick" &&
						event.parent.name != "_lianhuan" &&
						event.parent.name != "_lianhuan2"
					);
				},
				content() {
					trigger.num++;
				},
				group: "oldmalymowang_discover",
				ai: {
					threaten: 1.8,
				},
				subSkill: {
					discover: {
						trigger: { player: "phaseUseBegin" },
						forced: true,
						content() {
							player.discoverCard(get.inpile("trick"));
						},
					},
				},
			},
			lingzhou: {
				trigger: { player: "useCard" },
				direct: true,
				filter(event) {
					return get.type(event.card, "trick") == "trick" && event.card.isCard;
				},
				content() {
					"step 0";
					player.chooseTarget(get.prompt("lingzhou")).ai = function (target) {
						var num = get.attitude(player, target);
						if (num > 0) {
							if (target == player) {
								num++;
							}
							if (target.hp == 1) {
								num += 3;
							} else if (target.hp == 2) {
								num += 1;
							}
						}
						return num;
					};
					"step 1";
					if (result.bool) {
						player.logSkill("lingzhou", result.targets);
						result.targets[0].chooseDrawRecover(true);
					}
				},
				ai: {
					expose: 0.2,
					threaten: 1.5,
					noautowuxie: true,
				},
			},
			mieshi: {
				trigger: { player: "phaseEnd" },
				forced: true,
				content() {
					"step 0";
					player.loseHp();
					"step 1";
					event.target = game.filterPlayer().randomGet(player);
					if (!event.target) {
						event.finish();
						return;
					}
					player.line(event.target, "fire");
					game.delayx();
					"step 2";
					event.target.damage("fire");
				},
			},
			xmojian: {
				trigger: { player: "turnOverAfter" },
				direct: true,
				filter(event, player) {
					return !player.isTurnedOver();
				},
				content() {
					"step 0";
					player.chooseTarget(get.prompt("xmojian"), function (card, player, target) {
						return lib.filter.targetEnabled({ name: "sha" }, player, target);
					}).ai = function (target) {
						return get.effect(target, { name: "sha" }, player);
					};
					"step 1";
					if (result.bool) {
						player.logSkill("xmojian");
						player.useCard({ name: "sha" }, result.targets, false);
					}
				},
				ai: {
					expose: 0.2,
				},
			},
			xshixin: {
				trigger: { source: "damageEnd" },
				forced: true,
				// alter:true,
				filter(event, player) {
					if (event._notrigger.includes(event.player)) return false;
					if (get.is.altered("xshixin") && event.player.hp < player.hp) return false;
					return event.player.isAlive() && event.player != player;
				},
				content() {
					"step 0";
					trigger.player.loseHp();
					"step 1";
					player.loseHp();
				},
			},
			enze: {
				enable: "phaseUse",
				usable: 1,
				filterTarget(card, player, target) {
					return player.countCards("h") != target.countCards("h");
				},
				// alter:true,
				content() {
					var num = player.countCards("h") - target.countCards("h");
					if (num > 0) {
						if (num > 3) {
							num = 3;
						}
						target.draw(num);
					} else if (num < 0) {
						if (num < -3) {
							num = -3;
						}
						target.chooseToDiscard(-num, true);
					}
				},
				ai: {
					threaten: 1.8,
					order(name, player) {
						var max = true,
							num = 0;
						var players = game.filterPlayer();
						for (var i = 0; i < players.length; i++) {
							if (players[i] == player) continue;
							var att = get.attitude(player, players[i]);
							var dh = player.countCards("h") - players[i].countCards("h");
							if (att * dh > num) {
								if (att > 0) {
									max = true;
								} else if (att < 0) {
									max = false;
								}
								num = att * dh;
							}
						}
						if (max) return 10;
						return 0.5;
					},
					result: {
						player(player, target) {
							return (
								(player.countCards("h") - target.countCards("h")) *
								get.attitude(player, target)
							);
						},
					},
					expose: 0.2,
				},
			},
			oldenze: {
				enable: "phaseUse",
				usable: 1,
				filterTarget(card, player, target) {
					return player.countCards("h") != target.countCards("h");
				},
				// alter:true,
				content() {
					var num = player.countCards("h") - target.countCards("h");
					if (num > 0) {
						target.draw(num);
					} else if (num < 0) {
						target.chooseToDiscard(-num, true);
					}
				},
				ai: {
					threaten: 1.8,
					order(name, player) {
						var max = true,
							num = 0;
						var players = game.filterPlayer();
						for (var i = 0; i < players.length; i++) {
							if (players[i] == player) continue;
							var att = get.attitude(player, players[i]);
							var dh = player.countCards("h") - players[i].countCards("h");
							if (att * dh > num) {
								if (att > 0) {
									max = true;
								} else if (att < 0) {
									max = false;
								}
								num = att * dh;
							}
						}
						if (max) return 10;
						return 0.5;
					},
					result: {
						player(player, target) {
							return (
								(player.countCards("h") - target.countCards("h")) *
								get.attitude(player, target)
							);
						},
					},
					expose: 0.2,
				},
			},
			chongsheng: {
				unique: true,
				enable: "chooseToUse",
				mark: true,
				init(player) {
					player.storage.chongsheng = 2;
					player.syncStorage("chongsheng");
				},
				filter(event, player) {
					if (event.type != "dying") return false;
					if (player != event.dying) return false;
					if (player.storage.chongsheng <= 0) return false;
					return true;
				},
				content() {
					"step 0";
					player.hp = Math.min(player.storage.chongsheng, player.maxHp);
					player.discard(player.getCards("hej"));
					player.draw(player.storage.chongsheng);
					player.storage.chongsheng--;
					if (player.storage.chongsheng <= 0) {
						player.unmarkSkill("chongsheng");
					}
					"step 1";
					if (player.isLinked()) player.link();
					"step 2";
					if (player.isTurnedOver()) player.turnOver();
					player.syncStorage("chongsheng");
				},
				ai: {
					skillTagFilter(player) {
						if (player.storage.chongsheng <= 0) return false;
						if (player.hp > 0) return false;
					},
					save: true,
					result: {
						player: 10,
					},
					threaten(player, target) {
						if (target.storage.chongsheng > 0) return 0.6;
					},
				},
				intro: {
					content: "time",
				},
			},
			guozai: {
				enable: "phaseUse",
				usable: 1,
				// alter:true,
				filter(event, player) {
					return player.countCards("h") < (get.is.altered("guozai") ? 3 : 4);
				},
				init(player) {
					player.storage.guozai2 = 0;
				},
				content() {
					var num = (get.is.altered("guozai") ? 3 : 4) - player.countCards("h");
					player.draw(num);
					player.addSkill("guozai2");
					player.storage.guozai2 += num;
					game.addVideo("storage", player, ["guozai2", player.storage.guozai2]);
				},
				ai: {
					order: 1,
					result: {
						player: 1,
					},
				},
			},
			guozai2: {
				mark: true,
				intro: {
					content: "当前阶段结束时需弃置&张牌",
				},
				trigger: { player: "phaseUseEnd" },
				forced: true,
				content() {
					player.chooseToDiscard("he", true, player.storage.guozai2);
					player.storage.guozai2 = 0;
					player.removeSkill("guozai2");
				},
			},
			guozaix: {
				enable: "phaseUse",
				usable: 2,
				filter(event, player) {
					return player.countCards("h") < 4;
				},
				init(player) {
					player.storage.guozaix2 = 0;
				},
				content() {
					var num = 4 - player.countCards("h");
					player.draw(num);
					player.addSkill("guozaix2");
					player.storage.guozaix2 += num;
					game.addVideo("storage", player, ["guozaix2", player.storage.guozaix2]);
				},
				ai: {
					order: 1,
					result: {
						player: 1,
					},
				},
			},
			guozaix2: {
				mark: true,
				intro: {
					content: "当前阶段结束时需弃置&张牌",
				},
				trigger: { player: "phaseUseEnd" },
				forced: true,
				content() {
					player.chooseToDiscard("he", true, player.storage.guozaix2);
					player.storage.guozaix2 = 0;
					player.removeSkill("guozaix2");
				},
			},
			hanshuang: {
				trigger: { source: "damageEnd" },
				forced: true,
				// alter:true,
				filter(event, player) {
					if (event._notrigger.includes(event.player)) return false;
					return (
						event.card &&
						get.color(event.card) == "black" &&
						!event.player.isTurnedOver() &&
						event.player.isAlive()
					);
				},
				content() {
					trigger.player.turnOver();
					if (get.is.altered("hanshuang")) trigger.player.draw();
					player.loseHp();
				},
				ai: {
					threaten: 1.5,
					effect: {
						player(card, player, target, current) {
							if (get.color(card) == "black" && get.tag(card, "damage")) {
								return [1, 0, 1, -2];
							}
						},
					},
				},
			},
			oldhanshuang: {
				trigger: { source: "damageEnd" },
				forced: true,
				// alter:true,
				filter(event, player) {
					if (event._notrigger.includes(event.player)) return false;
					return (
						event.card &&
						get.color(event.card) == "black" &&
						!event.player.isTurnedOver() &&
						event.player.isAlive()
					);
				},
				content() {
					trigger.player.turnOver();
				},
				ai: {
					threaten: 1.5,
					effect: {
						player(card, player, target, current) {
							if (get.color(card) == "black" && get.tag(card, "damage")) {
								return [1, 0, 1, -2];
							}
						},
					},
				},
			},
			bingshi: {
				global: "bingshi2",
			},
			bingshi2: {
				trigger: { global: "dieAfter" },
				forced: true,
				globalFixed: true,
				filter(event, player) {
					return event.player.hasSkill("bingshi") && event.player.isDead();
				},
				content() {
					trigger.player.line(player, "thunder");
					player.damage("nosource", "thunder").animate = false;
					player.$damage(trigger.player);
					player.$damagepop(-1, "thunder");
					if (lib.config.animation && !lib.config.low_performance) {
						player.$thunder();
					}
					if (!event.parent.parent.bingshi_logv) {
						event.parent.parent.bingshi_logv = true;
						game.logv(trigger.player, "bingshi", game.filterPlayer(), event.parent.parent);
					}
				},
			},
			huanwu: {
				enable: "phaseUse",
				usable: 1,
				filterTarget(card, player, target) {
					return !target.storage.huanwu;
				},
				content() {
					target.gainMaxHp();
					target.recover();
					target.draw(2);
					target.storage.huanwu = true;
					target.mark("huanwu", {
						name: "唤雾",
						content: "已发动",
					});
					game.addVideo("mark", target, {
						name: "唤雾",
						content: "已发动",
						id: "huanwu",
					});
				},
				ai: {
					threaten: 1.2,
					result: {
						target(player, target) {
							return 1 / target.hp;
						},
					},
					order: 10,
					expose: 0.3,
				},
			},
			fengnu: {
				mod: {
					cardUsable(card) {
						if (get.info(card) && get.info(card).forceUsable) return;
						return Infinity;
					},
					targetInRange() {
						if (!get.is.altered("fengnu")) return true;
					},
				},
				// alter:true,
				trigger: { player: "useCard" },
				filter(event, player) {
					if (_status.currentPhase != player) return false;
					return player.countUsed(event.card) > 1;
				},
				forced: true,
				usable: 3,
				content() {
					player.draw();
				},
			},
			shengdun: {
				trigger: { player: "phaseBegin" },
				forced: true,
				filter(event, player) {
					return !player.hujia;
				},
				content() {
					player.changeHujia();
					player.update();
				},
			},
			jingmeng: {
				trigger: { player: "useCard" },
				frequent: true,
				filter(event, player) {
					return _status.currentPhase == player && player.countUsed() == 1;
				},
				content() {
					var type = get.type(trigger.card);
					var card = get.cardPile2(function (card) {
						return get.type(card) == type;
					});
					if (card) {
						player.gain(card, "gain2", "log");
					}
				},
				ai: {
					threaten: 1.1,
				},
			},
			hswuji: {
				trigger: { player: "phaseUseEnd" },
				frequent: true,
				filter(event, player) {
					return player.countUsed() > 0;
				},
				content() {
					player.draw(player.countUsed());
				},
				ai: {
					threaten: 1.3,
				},
			},
			bingshuang: {
				trigger: { source: "damageEnd" },
				filter(event, player) {
					if (event._notrigger.includes(event.player)) return false;
					return (
						event.card &&
						get.type(event.card) == "trick" &&
						event.player.isAlive() &&
						!event.player.isTurnedOver()
					);
				},
				check(event, player) {
					if (event.player.hasSkillTag("noturn")) return;
					if (event.player.isTurnedOver()) {
						return get.attitude(player, event.player) > 0;
					}
					return get.attitude(player, event.player) <= 0;
				},
				logTarget: "player",
				content() {
					trigger.player.draw(2);
					trigger.player.turnOver();
				},
			},
			yanshu: {
				trigger: { player: "discardAfter" },
				frequent: true,
				usable: 1,
				filter(event, player) {
					if (!event.cards) return false;
					for (var i = 0; i < event.cards.length; i++) {
						if (get.type(event.cards[i]) != "basic") return true;
					}
					return false;
				},
				content() {
					player.gain(game.createCard("liuxinghuoyu", "red"), "gain2");
				},
			},
			oldyanshu: {
				trigger: { player: "discardAfter" },
				frequent: true,
				filter(event, player) {
					if (!event.cards) return false;
					for (var i = 0; i < event.cards.length; i++) {
						if (get.type(event.cards[i]) != "basic") return true;
					}
					return false;
				},
				content() {
					player.gain(game.createCard("liuxinghuoyu", "red"), "gain2");
				},
			},
			shengyan: {
				trigger: { global: "recoverEnd" },
				filter(event, player) {
					return !player.hasSkill("shengyan2") && event.player.hp < event.player.maxHp;
				},
				logTarget: "player",
				check(event, player) {
					return get.attitude(player, event.player) > 0;
				},
				content() {
					trigger.player.recover();
					player.addTempSkill("shengyan2");
				},
				ai: {
					expose: 0.2,
				},
			},
			shengyan2: {},
			liechao: {
				enable: "phaseUse",
				usable: 1,
				// alter:true,
				filter(event, player) {
					return !player.isTurnedOver() && player.countCards("h") <= player.hp;
				},
				content() {
					player.draw(get.is.altered("liechao") ? 3 : 4);
					player.turnOver();
					player.skip("phaseDiscard");
				},
				ai: {
					order: 10,
					result: {
						player: 1,
					},
				},
			},
			qingliu: {
				trigger: { player: "damageBefore" },
				filter(event) {
					return event.nature == "fire";
				},
				forced: true,
				content() {
					trigger.cancel();
				},
				ai: {
					nofire: true,
					effect: {
						target(card, player, target, current) {
							if (get.tag(card, "fireDamage")) return "zeroplayertarget";
						},
					},
				},
			},
			zhongjia: {
				trigger: { player: "damageEnd" },
				forced: true,
				filter(event) {
					return event.num > 0;
				},
				content() {
					player.changeHujia();
				},
				ai: {
					nohujia: true,
					maixie: true,
					maixie_hp: true,
					skillTagFilter(player) {
						return player.hp > player.countCards("h") && player.hp > 1;
					},
					threaten(player, target) {
						if (!target.hujia) return 0.8;
					},
					effect: {
						target(card, player, target) {
							if (get.tag(card, "damage")) {
								if (player.hasSkillTag("jueqing", false, target)) return [1, -1];
								return 0.8;
							}
						},
					},
				},
			},
			dunji: {
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					return player.hujia ? true : false;
				},
				filterTarget(card, player, target) {
					return player != target && get.distance(player, target, "attack") <= 1;
				},
				selectTarget() {
					return [1, _status.event.player.hujia];
				},
				contentBefore() {
					player.changeHujia(-targets.length);
				},
				content() {
					target.damage();
				},
				ai: {
					order: 9,
					result: {
						target(player, target) {
							var eff = get.damageEffect(target, player, target) + 0.5;
							if (eff > 0 && eff <= 0.5) return 0;
							return eff;
						},
					},
				},
			},
			fengxing: {
				trigger: { player: "loseEnd" },
				direct: true,
				filter(event, player) {
					return (
						_status.currentPhase != player &&
						!player.hasSkill("fengxing2") &&
						player.countCards("he") > 0
					);
				},
				content() {
					"step 0";
					player.addTempSkill("fengxing2");
					player
						.chooseToDiscard("he", get.prompt("fengxing"))
						.set("ai", function (card) {
							return 7 - get.value(card);
						})
						.set("autodelay", 0.5).logSkill = "fengxing";
					"step 1";
					if (result.bool) {
						player.draw(2);
					}
				},
				ai: {
					threaten: 0.6,
				},
			},
			fengxing2: {},
			fengxian: {
				enable: "phaseUse",
				usable: 1,
				filterTarget(card, player, target) {
					return target.countCards("h") > 0;
				},
				selectTarget: -1,
				content() {
					target.chooseToDiscard(true);
				},
				ai: {
					order: 8,
					result: {
						target(player, target) {
							var nh = target.countCards("h");
							switch (nh) {
								case 0:
									return 0;
								case 1:
									return -1.5;
								case 2:
									return -1.3;
								case 3:
									return -1;
								default:
									return -0.8;
							}
						},
					},
				},
			},
			hsmengjing_mengye: {
				trigger: { player: "phaseEnd" },
				forced: true,
				priority: -1,
				filter(event, player) {
					return player.countCards("he") > 0;
				},
				content() {
					player.discard(player.getCards("he"));
					player.removeSkill("hsmengjing_mengye");
				},
				mark: "image",
				intro: {
					content: "结束阶段，弃置所有牌",
				},
			},
			zhanhou: {
				enable: "phaseUse",
				filterCard: { subtype: "equip2" },
				position: "he",
				usable: 1,
				filter(event, player) {
					return player.countCards("he", { subtype: "equip2" }) > 0;
				},
				check(card) {
					return 7 - get.value(card);
				},
				content() {
					player.changeHujia();
				},
				ai: {
					order: 9.5,
					result: {
						player: 1,
					},
				},
				// mod:{
				// 	globalFrom(from,to,distance){
				// 		return distance-from.hujia;
				// 	}
				// },
			},
			oldzhanhou: {
				enable: "phaseUse",
				filterCard: { subtype: "equip2" },
				position: "he",
				filter(event, player) {
					return player.countCards("he", { subtype: "equip2" }) > 0;
				},
				check(card) {
					if (get.position(card) == "e") return 0;
					return 7 - get.value(card);
				},
				content() {
					player.changeHujia();
				},
				ai: {
					order: 6,
					result: {
						player: 1,
					},
				},
			},
			shijie: {
				trigger: { player: "phaseEnd" },
				direct: true,
				filter(event, player) {
					return game.hasPlayer(function (current) {
						return current != player && current.countCards("h");
					});
				},
				content() {
					"step 0";
					player.chooseTarget(get.prompt("shijie"), function (card, player, target) {
						return player != target && target.countCards("h") > 0;
					}).ai = function (target) {
						return 11 - get.attitude(player, target);
					};
					"step 1";
					if (result.bool) {
						player.logSkill("shijie", result.targets);
						var target = result.targets[0];
						var card = target.getCards("h").randomGet();
						player.gain(card, target);
						event.target = target;
						target.$giveAuto(card, player);
						event.target.draw();
					}
				},
				ai: {
					expose: 0.1,
				},
			},
			shengguang: {
				enable: "phaseUse",
				filterCard: { color: "red" },
				filter(event, player) {
					return player.countCards("he", { color: "red" }) > 0;
				},
				position: "he",
				usable: 1,
				check(card) {
					return 9 - get.value(card);
				},
				filterTarget(card, player, target) {
					if (player.storage.anying) return true;
					if (target.hp >= target.maxHp) return false;
					return true;
				},
				content() {
					if (player.storage.anying) {
						target.loseHp();
					} else {
						target.recover();
					}
				},
				ai: {
					order: 9,
					result: {
						target(player, target) {
							if (player.storage.anying) return -1;
							if (target.hp == 1) return 5;
							if (player == target && player.countCards("h") > player.hp) return 5;
							return 2;
						},
					},
					threaten: 2,
					expose: 0.2,
				},
			},
			xinci: {
				enable: "phaseUse",
				filterCard: { color: "black" },
				filter(event, player) {
					return player.countCards("he", { color: "black" }) > 0;
				},
				position: "he",
				usable: 1,
				mark: true,
				intro: {
					content: "已进入暗影形态",
				},
				check(card) {
					return 9 - get.value(card);
				},
				filterTarget: true,
				content() {
					target.loseHp();
				},
				ai: {
					order: 9,
					result: {
						target: -1,
					},
					threaten: 2,
					expose: 0.2,
				},
			},
			anying: {
				unique: true,
				enable: "phaseUse",
				skillAnimation: "epic",
				animationColor: "thunder",
				derivation: "xinci",
				filter(event, player) {
					return !player.storage.anying && player.countCards("he", { color: "black" }) > 0;
				},
				filterCard: { color: "black" },
				position: "he",
				check(card) {
					return 5 - get.value(card);
				},
				content() {
					player.storage.anying = true;
					player.awakenSkill("anying");
					player.removeSkill("shengguang");
					player.addAdditionalSkill("anying", "xinci");
				},
				ai: {
					order: 1,
					result: {
						player(player) {
							if (player.hasUnknown()) return 0;
							return !game.hasPlayer(function (current) {
								return (
									get.attitude(player, current) > 0 &&
									current.isDamaged() &&
									current.hp <= 2
								);
							});
						},
					},
				},
			},
			huanjue: {
				trigger: { player: "useCard1" },
				frequent: true,
				filter(event, player) {
					if (event._huanjue) return false;
					if (event.targets.length != 1) return false;
					var target = event.targets[0];
					for (var i = 0; i < lib.inpile.length; i++) {
						var info = lib.card[lib.inpile[i]];
						if (info.multitarget) continue;
						if (lib.filter.targetEnabled2({ name: lib.inpile[i] }, event.player, target)) {
							return true;
						}
					}
					return false;
				},
				// check(event,player){
				// 	var eff=get.effect(event.targets[0],event.card,event.player,player);
				// 	if(eff<=0) return true;
				// 	if(get.value(event.card,event.player,'raw')<5){
				// 		return true;
				// 	}
				// 	return false;
				// },
				// prompt2(event,player){
				// 	return '发现一张牌代替你对'+get.translation(event.targets[0])+'使用的'+get.translation(event.card);
				// },
				autodelay: true,
				content() {
					"step 0";
					var list = [],
						list1 = [],
						list2 = [];
					for (var i = 0; i < lib.inpile.length; i++) {
						var info = lib.card[lib.inpile[i]];
						if (info.multitarget) continue;
						if (
							lib.filter.targetEnabled2(
								{ name: lib.inpile[i] },
								trigger.player,
								trigger.targets[0]
							)
						) {
							var cardinfo = [
								trigger.card.suit || "",
								trigger.card.number || "",
								lib.inpile[i],
							];
							list1.push(cardinfo);
							if (info.type != "equip") {
								list2.push(cardinfo);
							}
						}
					}
					var equipped = false;
					for (var i = 0; i < 3; i++) {
						if (equipped && list2.length) {
							list.push(list2.randomRemove());
						} else {
							equipped = true;
							list.push(list1.randomRemove());
						}
					}
					var eff1 = get.effect(trigger.targets[0], trigger.card, trigger.player, player);
					var val1 = get.value(trigger.card, player, "raw");
					player.chooseButton(["幻觉", [list, "vcard"]]).ai = function (button) {
						var card = {
							suit: trigger.card.suit,
							number: trigger.card.number,
							name: button.link[2],
						};
						var eff2 = get.effect(trigger.targets[0], card, trigger.player, player);
						var val2 = get.value(card, player, "raw");
						if (eff1 > 0) {
							if (eff2 <= 0) return 0;
							return val2 - val1;
						} else if (eff1 < 0) {
							if (eff2 >= 0) return val2;
							return 0;
						} else if (eff1 == 0) {
							if (eff2 > 0) return val2;
							return 0;
						}
					};
					"step 1";
					if (result.bool) {
						var stat = player.stat[player.stat.length - 1].card;
						if (stat[trigger.card.name]) {
							stat[trigger.card.name]--;
						}
						var card = game.createCard({
							suit: trigger.card.suit || lib.suit.randomGet(),
							number: trigger.card.number || Math.ceil(Math.random() * 13),
							name: result.links[0][2],
						});
						event.card = card;
						game.log(player, "将", trigger.card, "变为", card);
						// if(!event.isMine()) game.delayx();
						trigger.card = get.autoViewAs(card);
						trigger.cards = [card];
						game.cardsGotoOrdering(card).relatedEvent = trigger;
						trigger._huanjue = true;
					} else {
						event.finish();
					}
					"step 2";
					player.$throw(event.card, null, null, true);
					if (player == trigger.player) {
						player.line(trigger.targets[0], "green");
					} else {
						player.line(trigger.player, "green");
					}
					game.delayx(0.5);
					"step 3";
					var stat = player.stat[player.stat.length - 1].card;
					if (!stat[trigger.card.name]) {
						stat[trigger.card.name] = 1;
					} else {
						stat[trigger.card.name]++;
					}
				},
				draw() {
					player.draw();
				},
				ai: {
					usedu: true,
				},
			},
			bingjia: {
				enable: "phaseUse",
				filter(event, player) {
					return !player.hasSkill("bingjia2");
				},
				filterCard: true,
				check(card) {
					return 6 - get.value(card);
				},
				discard: false,
				prepare(cards, player) {
					player.$give(1, player, false);
				},
				content() {
					player.storage.bingjia = cards[0];
					player.addSkill("bingjia2");
					game.addVideo("storage", player, ["bingjia", get.cardInfo(cards[0]), "card"]);
				},
				ai: {
					order: 1,
					result: {
						player: 1,
					},
				},
			},
			bingjia2: {
				mark: true,
				trigger: { target: "useCardToBegin" },
				forced: true,
				filter(event, player) {
					return event.player != player && get.suit(event.card) == get.suit(player.storage.bingjia);
				},
				content() {
					"step 0";
					player.showCards([player.storage.bingjia], get.translation(player) + "发动了【冰甲】");
					player.removeSkill("bingjia2");
					game.addVideo("storage", player, ["bingjia", null]);
					"step 1";
					player.storage.bingjia.discard();
					delete player.storage.bingjia;
					player.changeHujia();
					player.addTempSkill("mianyi");
				},
				intro: {
					mark(dialog, content, player) {
						if (player == game.me || player.isUnderControl()) {
							dialog.add([player.storage.bingjia]);
						} else {
							return "已发动冰甲";
						}
					},
					content(content, player) {
						if (player == game.me || player.isUnderControl()) {
							return get.translation(player.storage.bingjia);
						}
						return "已发动冰甲";
					},
				},
			},
			bianxing2: {},
			zuzhou: {
				trigger: { player: "phaseBegin" },
				filter(event, player) {
					if (!player.countCards("h", { suit: "spade" })) return false;
					return !game.hasPlayer(function (current) {
						return current.hasJudge("fulei");
					});
				},
				forced: true,
				check() {
					return false;
				},
				content() {
					var card = game.createCard("fulei");
					player.addJudge(card);
					player.$draw(card);
					game.delay(2);
				},
				ai: {
					threaten: 1.5,
				},
				group: "zuzhou_remove",
				subSkill: {
					remove: {
						trigger: { global: "damageEnd" },
						filter(event, player) {
							return event.card && event.card.name == "fulei";
						},
						forced: true,
						content() {
							trigger.card.expired = true;
							game.log(trigger.card, "被移去");
						},
					},
				},
			},
			mdzhoufu: {
				enable: "phaseUse",
				filterCard: { color: "black" },
				filter(event, player) {
					return player.countCards("h", { color: "black" }) > 0;
				},
				filterTarget(card, player, target) {
					return player != target && !target.hasSkill("mdzhoufu2");
				},
				prepare: "throw",
				discard: false,
				content() {
					target.$gain2(cards);
					target.storage.mdzhoufu2 = cards[0];
					target.addSkill("mdzhoufu2");
					target.storage.mdzhoufu3 = player;
					game.addVideo("storage", target, ["mdzhoufu2", get.cardInfo(cards[0]), "card"]);
					ui.special.appendChild(cards[0]);
				},
				check(card) {
					if (get.suit(card) == "spade") {
						return 6 - get.value(card);
					}
					return -1;
				},
				ai: {
					tag: {
						rejudge: 0.1,
					},
					threaten: 1.5,
					expose: 0.1,
					order: 10,
					result: {
						target: -1,
					},
				},
			},
			mdzhoufu2: {
				trigger: { player: "judge" },
				forced: true,
				priority: 10,
				mark: "card",
				content() {
					"step 0";
					player.storage.mdzhoufu2.discard();
					player.$throw(player.storage.mdzhoufu2);
					if (player.storage.mdzhoufu2.clone) {
						player.storage.mdzhoufu2.clone.classList.add("thrownhighlight");
						game.addVideo("highlightnode", player, get.cardInfo(player.storage.mdzhoufu2));
					}
					if (player.storage.mdzhoufu3.isIn()) {
						player.storage.mdzhoufu3.line(player, "green");
						player.storage.mdzhoufu3.gain(player.judging[0]);
						player.storage.mdzhoufu3.$gain2(player.judging[0]);
					} else {
						player.judging[0].discard();
						game.delay(1.5);
					}
					player.removeSkill("mdzhoufu2");
					"step 1";
					player.judging[0] = player.storage.mdzhoufu2;
					trigger.position.appendChild(player.storage.mdzhoufu2);
					// trigger.untrigger();
					game.log(player, "的判定牌改为", player.storage.mdzhoufu2);
					delete player.storage.mdzhoufu2;
					delete player.storage.mdzhoufu3;
				},
				intro: {
					content: "card",
				},
			},
			xianzhi: {
				trigger: { global: "judgeBegin" },
				frequent: true,
				filter() {
					return ui.cardPile.childNodes.length > 1;
				},
				check() {
					return false;
				},
				content() {
					"step 0";
					var str = "";
					if (trigger.card) str = get.translation(trigger.card.viewAs || trigger.card.name);
					else if (trigger.skill) str = get.translation(trigger.skill);
					else str = get.translation(trigger.parent.name);

					var cards = [ui.cardPile.childNodes[0], ui.cardPile.childNodes[1]];
					var att = get.attitude(player, trigger.player);
					var delta =
						trigger.judge(ui.cardPile.childNodes[1]) - trigger.judge(ui.cardPile.childNodes[0]);
					player.chooseControl(
						"调换顺序",
						"cancel2",
						ui.create.dialog(
							"先知：" + get.translation(trigger.player) + "的" + str + "判定",
							cards,
							"hidden"
						)
					).ai = function () {
						if (att * delta > 0) return "调换顺序";
						else return "cancel2";
					};
					"step 1";
					if (result.control == "调换顺序") {
						var card = ui.cardPile.firstChild;
						ui.cardPile.removeChild(card);
						ui.cardPile.insertBefore(card, ui.cardPile.firstChild.nextSibling);
						game.log(player, "调换了牌堆顶两张牌的顺序");
					}
				},
				ai: {
					expose: 0.1,
					tag: {
						rejudge: 0.5,
					},
				},
			},
			jingxiang: {
				trigger: { player: "chooseToRespondBegin" },
				direct: true,
				usable: 1,
				// alter:true,
				filter(event, player) {
					if (event.responded) return false;
					return game.hasPlayer(function (current) {
						return current != player && current.countCards("h");
					});
				},
				content() {
					"step 0";
					player.chooseTarget(get.prompt("jingxiang"), function (card, player, target) {
						if (target == player) return false;
						var nh = target.countCards("h");
						if (nh == 0) return false;
						if (get.is.altered("jingxiang")) {
							return nh <= player.countCards("h");
						}
						return true;
					}).ai = function (target) {
						return 1 - get.attitude(player, target);
					};
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill("jingxiang", target);
						event.target = target;
						var cards = target.getCards("h");
						player.chooseCardButton(
							"选择" + get.translation(target) + "的一张卡手牌打出",
							cards
						).filterButton = function (button) {
							return trigger.filterCard(button.link);
						};
					} else {
						event.finish();
					}
					"step 2";
					if (result.bool) {
						game.log(player, "使用了", event.target, "的手牌");
						event.target.$throw(result.links);
						event.target.lose(result.links);
						trigger.untrigger();
						trigger.animate = false;
						trigger.responded = true;
						result.buttons[0].link.remove();
						trigger.result = { bool: true, card: result.buttons[0].link };
					} else {
						player.storage.counttrigger.jingxiang--;
					}
				},
				ai: {
					respondShan: true,
					effect: {
						target(card) {
							if (get.tag(card, "respondShan")) return 0.4;
							if (get.tag(card, "respondSha")) return 0.4;
						},
					},
				},
			},
			wlianji: {
				trigger: { player: "phaseEnd" },
				frequent: true,
				filter(event, player) {
					return player.countUsed() > player.hp;
				},
				content() {
					player.draw(2);
				},
				init(player) {
					player.storage.jingce = true;
				},
				intro: {
					content(storage, player) {
						if (_status.currentPhase == player) return "已使用" + player.countUsed() + "张牌";
					},
				},
			},
			mengun: {
				trigger: { global: "useCardToBefore" },
				priority: 12,
				filter(event, player) {
					if (event.player == player) return false;
					if (_status.currentPhase != event.player) return false;
					if (event.player.hasSkill("mengun2")) return false;
					if (get.itemtype(event.card) != "card") return false;
					if (!player.countCards("h", { suit: get.suit(event.card) })) return false;
					return get.type(event.card) == "basic";
				},
				direct: true,
				content() {
					"step 0";
					var val = get.value(trigger.card);
					var suit = get.suit(trigger.card);
					var eff = get.effect(trigger.target, trigger.card, trigger.player, player);
					var next = player.chooseToDiscard(
						"是否对" +
							get.translation(trigger.player) +
							"使用的" +
							get.translation(trigger.card) +
							"发动【闷棍】？",
						function (card) {
							return get.suit(card) == suit;
						}
					);
					next.logSkill = ["mengun", trigger.player];
					next.ai = function (card) {
						if (eff >= 0) return 0;
						return Math.min(8, 1 + val) - get.value(card);
					};
					"step 1";
					if (result.bool) {
						game.log(trigger.player, "收回了", trigger.cards);
						trigger.cancel();
						game.delay();
					} else {
						event.finish();
					}
					"step 2";
					trigger.player.$gain2(trigger.cards);
					trigger.player.gain(trigger.cards);
					trigger.player.storage.mengun2 = trigger.cards[0];
					game.addVideo("storage", player, ["mengun2", get.cardInfo(trigger.cards[0]), "card"]);
					trigger.player.addTempSkill("mengun2", "phaseEnd");
				},
				ai: {
					expose: 0.2,
				},
			},
			mengun2: {
				mark: "card",
				mod: {
					cardEnabled(card, player) {
						if (card == player.storage.mengun2) return false;
					},
				},
				intro: {
					content: "card",
					onunmark(storage, player) {
						delete player.storage.mengun2;
					},
				},
			},
			jianren: {
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					return player.getEquip(1) ? true : false;
				},
				filterCard(card, player) {
					return card == player.getEquip(1);
				},
				position: "e",
				filterTarget(card, player, target) {
					return target != player;
				},
				selectCard: -1,
				selectTarget: -1,
				content() {
					target.damage();
				},
				ai: {
					order: 9,
					result: {
						target(player, target) {
							return get.damageEffect(target, player, target);
						},
					},
				},
			},
			jihuo: {
				trigger: { player: "phaseAfter" },
				filter(event, player) {
					return player.countCards("h") > 0 && event.skill != "jihuo";
				},
				direct: true,
				priority: -50,
				content() {
					"step 0";
					var next = player.chooseToDiscard(get.prompt("jihuo"));
					next.ai = get.unuseful2;
					next.logSkill = "jihuo";
					"step 1";
					if (result.bool) {
						player.insertPhase();
					}
				},
				ai: {
					threaten: 1.2,
				},
			},
			tuteng_s: {
				trigger: { player: "phaseUseBegin" },
				forced: true,
				filter(event, player) {
					var rand = ["tuteng1", "tuteng2", "tuteng3", "tuteng4"];
					for (var i = 0; i < player.skills.length; i++) {
						rand.remove(player.skills[i]);
						if (rand.length == 0) return false;
					}
					return true;
				},
				content() {
					var rand = ["tuteng1", "tuteng2", "tuteng3", "tuteng4"];
					for (var i = 0; i < player.skills.length; i++) {
						rand.remove(player.skills[i]);
					}
					if (rand.length) {
						player.addSkill(rand.randomGet());
					}
				},
				ai: {
					effect: {
						player(card, player, target) {
							if (get.tag(card, "damage")) {
								if (player.hasSkillTag("jueqing", false, target)) return [1, 1];
								return 1.2;
							}
						},
					},
					threaten: 1.3,
				},
				group: "tuteng_lose",
			},
			s_tuteng: {
				trigger: { player: "phaseBegin" },
				forced: true,
				unique: true,
				content() {
					var rand = [
						"tuteng1",
						"tuteng2",
						"tuteng3",
						"tuteng4",
						"tuteng5",
						"tuteng6",
						"tuteng7",
						"tuteng8",
					];
					var rand2 = [];
					for (var i = 0; i < rand.length; i++) {
						if (player.skills.includes(rand[i])) {
							rand2.push(rand[i]);
							rand.splice(i--, 1);
						}
					}
					if (rand2.length >= 3) {
						player.removeSkill(rand2.randomGet());
					}
					player.addSkill(rand.randomGet("tuteng1", "tuteng3"));
				},
				ai: {
					threaten: 2,
				},
			},
			tuteng: {
				enable: "phaseUse",
				usable: 1,
				unique: true,
				direct: true,
				delay: 0,
				init() {
					for (var i = 1; i <= 8; i++) {
						lib.translate["tuteng" + i + "_info"] = lib.skill["tuteng" + i].intro.content;
					}
				},
				position: "he",
				filter(event, player) {
					if (player.storage.tuteng_awake) return true;
					var rand = ["tuteng1", "tuteng2", "tuteng3", "tuteng4"];
					for (var i = 0; i < rand.length; i++) {
						if (!player.hasSkill(rand[i])) return true;
					}
					return false;
				},
				content() {
					"step 0";
					var rand = ["tuteng1", "tuteng2", "tuteng3", "tuteng4"];
					var rand2 = [];
					var randx = [];
					var rand2x = [];
					if (player.storage.tuteng_awake) {
						rand = rand.concat(["tuteng5", "tuteng6", "tuteng7", "tuteng8"]);
					}
					for (var i = 0; i < player.skills.length; i++) {
						if (rand.includes(player.skills[i])) {
							rand.remove(player.skills[i]);
							rand2.push(player.skills[i]);
						}
					}
					if (!player.storage.tuteng_awake) {
						player.addSkill(rand.randomGet());
						game.delay();
						event.finish();
						return;
					}
					if (rand.length) {
						if (event.isMine() && (rand.length > 1 || rand2.length >= 4)) {
							var dialog = ui.create.dialog();
							for (var i = 0; i < rand.length; i++) {
								randx[i] = ["", "", rand[i]];
							}
							for (var i = 0; i < rand2.length; i++) {
								rand2x[i] = ["", "", rand2[i]];
							}
							dialog.add("选择一个图腾");
							dialog.add([randx, "vcard"]);
							if (rand2.length >= 4) {
								dialog.add("替换一个已有图腾");
								dialog.add([rand2x, "vcard"]);
								player.chooseButton(dialog, 2, true).filterButton = function (button) {
									if (ui.selected.buttons.length) {
										var current = ui.selected.buttons[0].name;
										if (rand.includes(current)) {
											return rand2.includes(button.name);
										} else {
											return rand.includes(button.name);
										}
									}
									return true;
								};
							} else {
								player.chooseButton(dialog, true);
							}
							for (var i = 0; i < dialog.buttons.length; i++) {
								var item = dialog.buttons[i];
								if (i == 4) {
									item.parentNode.insertBefore(document.createElement("br"), item);
								}
								item.style.zoom = 0.7;
							}
						} else {
							if (player.hp < player.maxHp && rand.includes("tuteng1")) {
								player.addSkill("tuteng1");
							} else {
								if (rand.length > 1) {
									rand.remove("tuteng1");
								}
								player.addSkill(rand.randomGet());
							}
							// if(rand2.length>=3){
							// 	player.removeSkill(rand2.randomGet());
							// }
							game.delay();
							event.finish();
						}
					} else {
						event.finish();
					}
					"step 1";
					if (result.buttons.length == 1) {
						player.addSkill(result.buttons[0].name);
					} else if (result.buttons.length == 2) {
						var skill1 = result.buttons[0].name;
						var skill2 = result.buttons[1].name;
						if (player.hasSkill(skill1)) {
							player.removeSkill(skill1);
							player.addSkill(skill2);
						} else {
							player.removeSkill(skill2);
							player.addSkill(skill1);
						}
					}
				},
				ai: {
					order: 11,
					result: {
						player: 1,
					},
					effect: {
						player(card, player, target) {
							if (get.tag(card, "damage")) {
								if (player.hasSkillTag("jueqing", false, target)) return;
								return 1.2;
							}
						},
					},
					threaten: 2,
				},
				group: "tuteng_lose",
			},
			zuling: {
				skillAnimation: "epic",
				animationColor: "thunder",
				trigger: { player: "phaseBegin" },
				forced: true,
				unique: true,
				filter(event, player) {
					if (!player.storage.tuteng_awake) {
						var rand = [
							"tuteng1",
							"tuteng2",
							"tuteng3",
							"tuteng4",
							"tuteng5",
							"tuteng6",
							"tuteng7",
							"tuteng8",
						];
						var num = 0;
						for (var i = 0; i < player.skills.length; i++) {
							if (rand.includes(player.skills[i])) num++;
							if (num >= 3) {
								return true;
							}
						}
					}
					return false;
				},
				content() {
					player.storage.tuteng_awake = true;
					player.loseMaxHp();
					player.awakenSkill("zuling");
				},
			},
			huanfeng: {
				skillAnimation: "epic",
				animationColor: "thunder",
				trigger: { player: "phaseBeginStart" },
				forced: true,
				unique: true,
				filter(event, player) {
					// if(player.storage.huanfeng_awake) return false;
					var skills = ["tuteng1", "tuteng2", "tuteng3", "tuteng4"];
					for (var i = 0; i < skills.length; i++) {
						if (!player.hasSkill(skills[i])) {
							return false;
						}
					}
					return true;
				},
				content() {
					// player.storage.huanfeng_awake=true;
					player.removeSkill("tuteng1");
					player.removeSkill("tuteng2");
					player.removeSkill("tuteng3");
					player.removeSkill("tuteng4");
					// player.awakenSkill('huanfeng');
					player.storage.huanfeng_end = player.addSubPlayer({
						name: "hs_alakir",
						hp: 3,
						maxHp: 3,
						skills: lib.character.hs_alakir[3],
						hs: get.cards(4),
					});
					player.callSubPlayer(player.storage.huanfeng_end);
					// if(lib.filter.filterTrigger(trigger,player,'phaseBegin','shengdun')) game.createTrigger('phaseBegin','shengdun',player,trigger);
				},
				// group:'huanfeng_end',
				subSkill: {
					end: {
						temp: true,
						vanish: true,
						trigger: { player: "phaseEnd" },
						silent: true,
						filter(event, player) {
							return player.storage.huanfeng_end;
						},
						content() {
							player.insertPhase();
							delete player.storage.huanfeng_end;
						},
					},
				},
			},
			tuteng_h: {
				mod: {
					maxHandcard(player, num) {
						return num - 1;
					},
				},
			},
			tuteng_lose: {
				trigger: { player: "damageEnd" },
				forced: true,
				popup: false,
				filter(event, player) {
					var tuteng = [
						"tuteng1",
						"tuteng2",
						"tuteng3",
						"tuteng4",
						"tuteng5",
						"tuteng6",
						"tuteng7",
						"tuteng8",
					];
					for (var i = 0; i < player.skills.length; i++) {
						if (tuteng.includes(player.skills[i])) return true;
					}
					return false;
				},
				content() {
					var tuteng = [
						"tuteng1",
						"tuteng2",
						"tuteng3",
						"tuteng4",
						"tuteng5",
						"tuteng6",
						"tuteng7",
						"tuteng8",
					];
					var rand = [];
					for (var i = 0; i < player.skills.length; i++) {
						if (tuteng.includes(player.skills[i])) {
							rand.push(player.skills[i]);
						}
					}
					if (rand.length) {
						player.removeSkill(rand.randomGet());
					}
				},
			},
			tuteng1: {
				mark: "image",
				nopop: true,
				intro: {
					content: "结束阶段，你回复1点体力",
				},
				trigger: { player: "phaseEnd" },
				forced: true,
				filter(event, player) {
					return player.hp < player.maxHp;
				},
				content() {
					player.recover();
				},
			},
			tuteng2: {
				mark: "image",
				nopop: true,
				intro: {
					content: "每当你造成一次伤害，你摸一张牌",
				},
				trigger: { source: "damageAfter" },
				forced: true,
				content() {
					player.draw();
				},
			},
			tuteng3: {
				mark: "image",
				nopop: true,
				intro: {
					content: "你受到下一次伤害时，令伤害-1，然后失去此图腾",
				},
				trigger: { player: "damageBegin" },
				forced: true,
				filter(event) {
					return event.num > 0;
				},
				content() {
					trigger.num--;
					player.removeSkill("tuteng3");
				},
			},
			tuteng4: {
				mark: "image",
				nopop: true,
				intro: {
					content: "在你的回合内，你的锦囊牌造成的首次伤害+1",
				},
				trigger: { source: "damageBegin" },
				forced: true,
				usable: 1,
				filter(event, player) {
					return (
						_status.currentPhase == player &&
						event.card &&
						get.type(event.card) == "trick" &&
						event.notLink()
					);
				},
				content() {
					trigger.num++;
				},
			},
			tuteng5: {
				mark: "image",
				nopop: true,
				intro: {
					content: "结束阶段，你摸一张牌",
				},
				trigger: { player: "phaseEnd" },
				forced: true,
				content() {
					player.draw();
				},
			},
			tuteng6: {
				mark: "image",
				nopop: true,
				intro: {
					content: "在你的回合内，你的杀造成的首次伤害+1",
				},
				trigger: { source: "damageBegin" },
				forced: true,
				filter(event, player) {
					return (
						_status.currentPhase == player &&
						event.card &&
						event.card.name == "sha" &&
						event.notLink()
					);
				},
				usable: 1,
				content() {
					trigger.num++;
				},
			},
			tuteng7: {
				mark: "image",
				nopop: true,
				intro: {
					content: "结束阶段，你令一名其他角色回复1点体力",
				},
				trigger: { player: "phaseEnd" },
				direct: true,
				filter(event, player) {
					return game.hasPlayer(function (current) {
						return current != player && current.isDamaged();
					});
				},
				content() {
					"step 0";
					player.chooseTarget(
						"活力图腾：令一名其他角色回复1点体力",
						function (card, player, target) {
							return target != player && target.hp < target.maxHp;
						}
					).ai = function (target) {
						return get.recoverEffect(target, player, player);
					};
					"step 1";
					if (result.bool) {
						player.logSkill("tuteng7", result.targets[0]);
						result.targets[0].recover();
					}
				},
			},
			tuteng8: {
				mark: "image",
				nopop: true,
				intro: {
					content: "进攻距离+1",
				},
				mod: {
					globalFrom(from, to, distance) {
						return distance - 1;
					},
				},
			},
			hongxi: {
				trigger: { global: "dieAfter" },
				filter(event, player) {
					return player.hp < player.maxHp;
				},
				forced: true,
				content() {
					player.recover(player.maxHp - player.hp);
				},
				ai: {
					threaten: 1.2,
				},
			},
		},
		cardType: {
			hsfashu: 0.5,
			hszuzhou: 0.5,
			hsmengjing: 0.5,
			hsbaowu: 0.5,
			hsdusu: 0.5,
			hsshenqi: 0.5,
			hsyaoshui: 0.5,
			hsqingyu: 0.5,
			hsqizhou: 0.5,
			hsjixie: 0.5,
		},
		card: {
			hsfashu_anyingjingxiang: {
				fullimage: true,
				type: "hsfashu",
				vanish: true,
				derivation: "hs_xukongzhiying",
				gainable: false,
			},
			hsfashu_buwendingyibian: {
				enable(card, player) {
					return get.cardCount("hsfashu_buwendingyibian", player) < player.hp;
				},
				fullimage: true,
				type: "hsfashu",
				vanish: true,
				derivation: "hs_siwangxianzhi",
				filterTarget: true,
				content() {
					"step 0";
					target.chooseCard("h", true, "重铸一张手牌", lib.filter.cardRecastable);
					"step 1";
					if (result.bool && result.cards.length) {
						target.recast(result.cards, void 0, (player, cards) => {
							var type = get.type(cards[0], "trick"),
								name = cards[0].name,
								card2 = get.cardPile(
									(card) => get.type(card, "trick") == type && card.name != name
								);
							if (!card2) card2 = get.cardPile((card) => get.type(card, "trick") == type);
							if (card2) player.gain(card2, "draw");
							else player.draw().log = false;
						});
						var clone = game.createCard(card);
						player.gain(clone, "gain2");
						clone.classList.add("glow");
						clone._destroy = "yibian";
						player.addTempSkill("buwendingyibian_lose", "phaseBegin");
						if (target.hasSkill("buwendingyibian_ai1")) {
							target.addTempSkill("buwendingyibian_ai2");
						} else {
							target.addTempSkill("buwendingyibian_ai1");
						}
					}
				},
				ai: {
					wuxie() {
						return 0;
					},
					value(card) {
						if (card._destroy) return 0;
						return 5;
					},
					useful: 0,
					result: {
						target(player, target) {
							if (
								target == player &&
								target.countCards("h", function (card) {
									return card.name != "hsfashu_buwendingyibian" && get.value(card) <= 1;
								})
							) {
								return 10;
							}
							var num = target.countCards("h");
							var num0 = num;
							if (target == player) num--;
							if (target.hasSkill("buwendingyibian_ai1")) num /= 2;
							if (target.hasSkill("buwendingyibian_ai2")) num /= 2;
							if (num < 0) {
								if (num0 > 0) return 0.1;
								return 0;
							}
							return Math.sqrt(num);
						},
					},
					order: 4,
				},
			},
			hstianqi_dalian: {
				type: "equip",
				subtype: "equip1",
				distance: { attackFrom: -1 },
				fullimage: true,
				vanish: true,
				destroy: "hstianqi",
				derivation: "hs_heifengqishi",
				skills: ["hstianqi_dalian"],
				ai: {
					equipValue: 10,
				},
			},
			hstianqi_shali: {
				type: "equip",
				subtype: "equip2",
				distance: { attackFrom: -1 },
				fullimage: true,
				vanish: true,
				destroy: "hstianqi",
				derivation: "hs_heifengqishi",
				skills: ["hstianqi_shali"],
				ai: {
					equipValue: 10,
				},
			},
			hstianqi_nazigelin: {
				type: "equip",
				subtype: "equip4",
				distance: { globalFrom: -1 },
				fullimage: true,
				vanish: true,
				destroy: "hstianqi",
				derivation: "hs_heifengqishi",
				onEquip() {
					player.changeHujia();
				},
				equipDelay: false,
				ai: {
					equipValue: 10,
				},
			},
			hstianqi_suolasi: {
				type: "equip",
				subtype: "equip3",
				distance: { globalTo: 1 },
				fullimage: true,
				vanish: true,
				destroy: "hstianqi",
				derivation: "hs_heifengqishi",
				onLose() {
					if (player.isDamaged()) {
						player.logSkill("hstianqi_suolasi");
						player.recover();
					}
				},
				loseDelay: false,
				ai: {
					equipValue: 10,
				},
			},
			hsjixie_zhadan: {
				enable: true,
				fullimage: true,
				type: "hsjixie",
				vanish: true,
				derivation: "hs_pengpeng",
				filterTarget(card, player, target) {
					return target == player;
				},
				modTarget: true,
				selectTarget: -1,
				cardcolor: "black",
				content() {
					var targets = target.getEnemies();
					if (targets.length) {
						var target2 = targets.randomGet();
						player.line(target2, "fire");
						target2.addExpose(0.2);
						target2.damage("fire");
					}
				},
				ai: {
					value: 8,
					result: {
						target: 1,
					},
					order: 4,
				},
			},
			hsqizhou_feng: {
				type: "hsqizhou",
				fullimage: true,
				vanish: true,
				enable: true,
				derivation: "hs_kalimosi",
				filterTarget(card, player, target) {
					return target == player;
				},
				selectTarget: -1,
				content() {
					"step 0";
					event.list = target.getEnemies().sortBySeat();
					player.line(event.list, "thunder");
					"step 1";
					if (event.list.length) {
						event.current = event.list.shift();
						event.current.addTempClass("target");
						var next = event.current.chooseToRespond({ name: "sha" });
						next.ai = function (card) {
							if (get.damageEffect(event.current, player, event.current, "thunder") >= 0)
								return 0;
							if (player.hasSkillTag("notricksource")) return 0;
							if (event.current.hasSkillTag("notrick")) return 0;
							return 11 - get.value(card);
						};
						next.autochoose = lib.filter.autoRespondSha;
					} else {
						event.finish();
					}
					"step 2";
					if (!result.bool) {
						event.current.damage("thunder");
					}
					game.delayx(0.5);
					"step 3";
					event.goto(1);
				},
				ai: {
					order: 8,
					useful: [5, 1],
					value: 8,
					result: {
						target: 1,
					},
				},
			},
			hsqizhou_shui: {
				type: "hsqizhou",
				fullimage: true,
				vanish: true,
				enable(event, player) {
					return player.isDamaged();
				},
				derivation: "hs_kalimosi",
				filterTarget(card, player, target) {
					return target == player;
				},
				selectTarget: -1,
				content() {
					target.recover(2);
				},
				ai: {
					order: 8,
					useful: [5, 1],
					value: 8,
					tag: {
						recover: 1,
					},
					result: {
						target: 2,
					},
				},
			},
			hsqizhou_huo: {
				type: "hsqizhou",
				fullimage: true,
				vanish: true,
				enable: true,
				derivation: "hs_kalimosi",
				filterTarget: true,
				content() {
					target.damage("fire");
				},
				ai: {
					order: 5,
					result: {
						target: -1,
					},
					useful: [5, 1],
					value: 8,
					tag: {
						damage: 1,
						fireDamage: 1,
						natureDamage: 1,
					},
				},
			},
			hsqizhou_tu: {
				type: "hsqizhou",
				fullimage: true,
				vanish: true,
				enable: true,
				derivation: "hs_kalimosi",
				filterTarget(card, player, target) {
					return target != player;
				},
				selectTarget: [1, Infinity],
				content() {
					target.changeHujia();
				},
				ai: {
					order: 8,
					useful: [5, 1],
					value: 8,
					result: {
						target: 1,
					},
				},
			},
			hsqingyu_feibiao: {
				type: "hsqingyu",
				fullimage: true,
				vanish: true,
				enable: true,
				derivation: "hs_aya",
				filterTarget(card, player, target) {
					return target.countCards("he") > 0;
				},
				content() {
					var cards = [];
					var hs = target.getCards("h");
					var es = target.getCards("e");
					if (hs.length) cards.push(hs.randomGet());
					if (es.length) cards.push(es.randomGet());
					target.discard(cards);
				},
				ai: {
					order: 8,
					useful: 3,
					value: 6,
					result: {
						target(player, target) {
							var num = 0;
							if (target.countCards("h")) num--;
							if (target.countCards("e")) num--;
							return num;
						},
					},
				},
			},
			hsqingyu_zhanfang: {
				type: "hsqingyu",
				fullimage: true,
				vanish: true,
				enable: true,
				derivation: "hs_aya",
				filterTarget: true,
				content() {
					target.gainMaxHp();
					target.draw();
				},
				ai: {
					order: 5,
					useful: 3,
					value: 4,
					result: {
						target(player, target) {
							if (target.hp == target.maxHp) {
								if (target.maxHp < 3) return 2;
								if (target.maxHp == 3) return 1.5;
								return 1.2;
							}
							return 1;
						},
					},
				},
			},
			hsqingyu_hufu: {
				type: "hsqingyu",
				fullimage: true,
				vanish: true,
				enable: true,
				derivation: "hs_aya",
				filterTarget: true,
				content() {
					target.changeHujia();
				},
				ai: {
					order: 5,
					useful: 3,
					value: 6,
					result: {
						target(player, target) {
							return 2 / Math.max(1, Math.sqrt(target.hp));
						},
					},
				},
			},
			hsqingyu_shandian: {
				type: "hsqingyu",
				fullimage: true,
				vanish: true,
				enable: true,
				derivation: "hs_aya",
				filterTarget: true,
				content() {
					target.damage("thunder");
				},
				ai: {
					order: 5,
					result: {
						target: -1,
					},
					useful: 5,
					value: 8,
					tag: {
						damage: 1,
						thunderDamage: 1,
						natureDamage: 1,
					},
				},
			},
			hsqingyu_zhao: {
				type: "equip",
				subtype: "equip1",
				distance: { attackFrom: -1 },
				fullimage: true,
				vanish: true,
				derivation: "hs_aya",
				onEquip() {
					player.draw();
				},
				ai: {
					order: 9,
					useful: 5,
					value: 4,
				},
			},
			hsdusu_xueji: {
				type: "hsdusu",
				fullimage: true,
				vanish: true,
				enable: true,
				derivation: "hs_xialikeer",
				filterTarget(card, player, target) {
					return target.countCards("e") > 0;
				},
				content() {
					target.discard(target.getCards("e").randomGets(2));
				},
				ai: {
					order: 5,
					result: {
						target(player, target) {
							if (target.hasSkillTag("noe")) return 0;
							if (target.countCards("e") > 1) return -1.5;
							return -1;
						},
					},
					value: 5,
				},
			},
			hsdusu_kuyecao: {
				type: "hsdusu",
				fullimage: true,
				vanish: true,
				enable: true,
				derivation: "hs_xialikeer",
				filterTarget(card, player, target) {
					return !target.hasSkill("qianxing");
				},
				content() {
					target.tempHide();
				},
				ai: {
					order: 2,
					result: {
						target(player, target) {
							if (player != target && get.distance(player, target, "absolute") <= 1) return 0;
							var num = 1;
							if (target == player) {
								num = 1.5;
							}
							if (target.hp == 1) return 2 * num;
							if (target.hp == 2 && target.countCards("h") <= 2) return 1.2 * num;
							return num;
						},
					},
					value: 5,
				},
			},
			hsdusu_huangxuecao: {
				type: "hsdusu",
				fullimage: true,
				vanish: true,
				enable: true,
				derivation: "hs_xialikeer",
				filterTarget(card, player, target) {
					return target == player;
				},
				selectTarget: -1,
				modTarget: true,
				content() {
					target.draw(2);
				},
				ai: {
					order: 9,
					result: {
						target: 1,
					},
					value: 10,
				},
			},
			hsdusu_huoyanhua: {
				type: "hsdusu",
				fullimage: true,
				vanish: true,
				enable: true,
				derivation: "hs_xialikeer",
				range: { attack: 1 },
				filterTarget: true,
				content() {
					target.damage("fire");
				},
				ai: {
					order: 5,
					result: {
						target: -1,
					},
					useful: 5,
					value: 8,
					tag: {
						damage: 1,
						fireDamage: 1,
						natureDamage: 1,
					},
				},
			},
			hsdusu_shinancao: {
				type: "hsdusu",
				fullimage: true,
				vanish: true,
				enable: true,
				derivation: "hs_xialikeer",
				filterTarget(card, player, target) {
					return !target.hasSkill("hsdusu_shinancao");
				},
				content() {
					target.addSkill("hsdusu_shinancao");
				},
				ai: {
					order: 7,
					result: {
						target(player, target) {
							if (target.hp > 1) {
								if (target.countCards("h") > 2) return 1;
								return 0.5;
							}
							return 0.2;
						},
					},
					value: 5,
				},
			},
			hsbaowu_cangbaotu: {
				type: "hsbaowu",
				fullimage: true,
				vanish: true,
				enable: true,
				gainable: false,
				derivation: "hs_yelise",
				filterTarget(card, player, target) {
					return target == player;
				},
				selectTarget: -1,
				content() {
					target.addSkill("hsbaowu_cangbaotu");
					target.draw();
				},
				ai: {
					order: 10,
					result: {
						player: 10,
					},
					useful: 10,
					value: 10,
				},
			},
			hsbaowu_huangjinyuanhou: {
				type: "hsbaowu",
				fullimage: true,
				vanish: true,
				enable: true,
				gainable: false,
				derivation: "hs_yelise",
				filterTarget(card, player, target) {
					return target == player;
				},
				selectTarget: -1,
				content() {
					"step 0";
					var cards = target.getCards();
					if (cards.length) {
						target.lose(cards)._triggered = null;
					}
					event.num = 1 + cards.length;
					"step 1";
					var cards = [];
					var list = [];
					if (lib.characterPack.hearth) {
						for (var i = 0; i < lib.cardPack.mode_derivation.length; i++) {
							var name = lib.cardPack.mode_derivation[i];
							var info = lib.card[name];
							if (info.gainable == false) continue;
							if (lib.characterPack.hearth[info.derivation]) {
								list.push(name);
							}
						}
					}
					if (!list.length) {
						list = lib.inpile.slice(0);
					}
					if (list.length) {
						for (var i = 0; i < event.num; i++) {
							cards.push(game.createCard(list.randomGet()));
						}
						target.directgain(cards);
					}
					target.tempHide();
				},
				ai: {
					order: 10,
					result: {
						player(player) {
							if (player.countCards("h") > 1) return 1;
							if (player.hp == 1) return 1;
							return 0;
						},
					},
					useful: 10,
					value: 10,
				},
			},
			hsshenqi_nengliangzhiguang: {
				type: "hsshenqi",
				fullimage: true,
				vanish: true,
				enable(card, player) {
					return !player.isTurnedOver();
				},
				derivation: "hs_lafamu",
				filterTarget: true,
				content() {
					target.gainMaxHp();
					target.recover();
					target.draw(4);
				},
				contentAfter() {
					if (!player.isTurnedOver()) {
						player.turnOver();
					}
				},
				ai: {
					order: 5,
					result: {
						target(player, target) {
							if (target.hp <= 1) return 2;
							if (target.countCards("h") < target.hp || target.hp == 2) return 1.5;
							return 1;
						},
					},
					useful: 5,
					value: 10,
				},
			},
			hsshenqi_kongbusangzhong: {
				type: "hsshenqi",
				fullimage: true,
				vanish: true,
				enable(card, player) {
					return !player.isTurnedOver();
				},
				derivation: "hs_lafamu",
				filterTarget(card, player, target) {
					return target != player;
				},
				selectTarget: -1,
				content() {
					target.damage();
				},
				contentAfter() {
					if (!player.isTurnedOver()) {
						player.turnOver();
					}
				},
				ai: {
					order: 9,
					result: {
						target: -2,
					},
					tag: {
						damage: 1,
						multitarget: 1,
						multineg: 1,
					},
					useful: 5,
					value: 10,
				},
			},
			hsshenqi_morijingxiang: {
				type: "hsshenqi",
				fullimage: true,
				vanish: true,
				enable(card, player) {
					return !player.isTurnedOver();
				},
				derivation: "hs_lafamu",
				filterTarget(card, player, target) {
					return target != player && target.countCards("hej") > 0;
				},
				selectTarget: -1,
				content() {
					if (target.countCards("hej")) player.gainPlayerCard(target, "hej", true);
				},
				contentAfter() {
					if (!player.isTurnedOver()) {
						player.turnOver();
					}
				},
				ai: {
					order: 9.5,
					result: {
						player: (player, target) => {
							return lib.card.shunshou.ai.result.player(player, target) - 3 / game.countPlayer();
						},
						target: (player, target) => {
							return lib.card.shunshou.ai.result.target(player, target);
						}
					},
					tag: {
						multitarget: 1,
						multineg: 1,
						loseCard: 1,
						gain: 1,
					},
					useful: 5,
					value: 10,
				},
			},
			hsmengjing_feicuiyoulong: {
				type: "hsmengjing",
				fullimage: true,
				vanish: true,
				enable: true,
				derivation: "hs_ysera",
				filterTarget: true,
				content() {
					target.damage();
				},
				ai: {
					order: 5,
					result: {
						target: -1,
					},
					tag: {
						damage: 1,
					},
					useful: 5,
					value: 10,
				},
			},
			hsmengjing_suxing: {
				type: "hsmengjing",
				fullimage: true,
				vanish: true,
				enable: true,
				derivation: "hs_ysera",
				filterTarget(card, player, target) {
					return player != target;
				},
				selectTarget: -1,
				content() {
					target.loseHp();
					var he = target.getCards("he");
					if (he.length) {
						target.discard(he.randomGets(2));
					}
				},
				ai: {
					result: {
						target: -1,
					},
					order: 6,
					useful: 5,
					value: 10,
				},
			},
			hsmengjing_mengye: {
				type: "hsmengjing",
				fullimage: true,
				vanish: true,
				enable: true,
				derivation: "hs_ysera",
				filterTarget: true,
				content() {
					target.draw();
					target.addSkill("hsmengjing_mengye");
				},
				ai: {
					order: 1,
					useful: 5,
					value: 10,
					result: {
						target(player, target) {
							if (target.hasSkill("hsmengjing_mengye")) return 0.5;
							return -target.countCards("he");
						},
					},
				},
			},
			hsmengjing_mengjing: {
				type: "hsmengjing",
				fullimage: true,
				vanish: true,
				enable: true,
				derivation: "hs_ysera",
				filterTarget(card, player, target) {
					return !target.hasJudge("lebu") || target.countCards("e") > 0;
				},
				content() {
					"step 0";
					var es = target.getCards("e");
					if (es.length) {
						target.gain(es, "gain2");
					}
					"step 1";
					if (!target.hasJudge("lebu")) {
						target.addJudge(game.createCard("lebu"));
					}
				},
				ai: {
					order: 2,
					useful: 5,
					value: 10,
					result: {
						target(player, target) {
							var num = target.hp - target.countCards("he") - 2;
							if (num > -1) return -1;
							if (target.hp < 3) num--;
							if (target.hp < 2) num--;
							if (target.hp < 1) num--;
							return num;
						},
					},
				},
			},
			hsmengjing_huanxiaojiemei: {
				type: "hsmengjing",
				fullimage: true,
				vanish: true,
				enable: true,
				derivation: "hs_ysera",
				filterTarget(card, player, target) {
					return target.hp < target.maxHp;
				},
				content() {
					target.recover();
				},
				ai: {
					order: 6,
					value: 10,
					useful: [7, 4],
					result: {
						target(player, target) {
							return get.recoverEffect(target, player, target);
						},
					},
				},
			},
			hszuzhou_nvwudeganguo: {
				type: "hszuzhou",
				fullimage: true,
				vanish: true,
				enable: true,
				derivation: "hs_hajiasha",
				filterTarget(card, player, target) {
					return target.countCards("he");
				},
				content() {
					"step 0";
					target.chooseToDiscard("he", true);
					"step 1";
					if (!lib.characterPack.hearth) {
						target.draw();
						return;
					}
					var list = [];
					for (var i = 0; i < lib.cardPack.mode_derivation.length; i++) {
						var name = lib.cardPack.mode_derivation[i];
						var info = lib.card[name];
						if (info.gainable == false || info.destroy) continue;
						if (lib.characterPack.hearth[info.derivation]) {
							list.push(name);
						}
					}
					if (!list.length) {
						target.draw();
					} else {
						target.gain(game.createCard(list.randomGet()), "draw");
					}
				},
				ai: {
					order: 8,
					value: 8,
					result: {
						target: 1,
					},
				},
			},
			hszuzhou_nvwudepingguo: {
				type: "hszuzhou",
				fullimage: true,
				vanish: true,
				enable: true,
				derivation: "hs_hajiasha",
				filterTarget: true,
				content() {
					target.gain([game.createCard("sha"), game.createCard("sha")], "gain2");
				},
				ai: {
					order: 8.1,
					value: 6,
					result: {
						target: 1,
					},
				},
			},
			hszuzhou_nvwudexuetu: {
				type: "hszuzhou",
				fullimage: true,
				vanish: true,
				enable: true,
				derivation: "hs_hajiasha",
				filterTarget(card, player, target) {
					return !target.hasSkill("zhoujiang");
				},
				content() {
					if (!target.hasSkill("fengyin")) {
						target.addTempSkill("fengyin", { player: "phaseAfter" });
					}
					target.addTempSkill("zhoujiang", { player: "phaseAfter" });
				},
				ai: {
					order: 8.5,
					value: 5,
					result: {
						target(player, target) {
							if (target.hasSkill("fengyin")) {
								return 1.5;
							}
							if (target.hasSkillTag("maixie")) {
								if (target.countCards("h") <= 1) {
									return -0.1;
								}
							} else if (target.countCards("h") > 1 && get.threaten(target) <= 1.2) {
								return 1;
							}
						},
					},
				},
			},
			hszuzhou_wushushike: {
				type: "hszuzhou",
				fullimage: true,
				vanish: true,
				enable: true,
				derivation: "hs_hajiasha",
				filterTarget: true,
				selectTarget: -1,
				multitarget: true,
				multiline: true,
				content() {
					"step 0";
					event.targets = game.filterPlayer().sortBySeat();
					"step 1";
					if (event.targets.length) {
						event.current = event.targets.shift();
						var cards = event.current.getCards("h", "shan");
						if (cards.length) {
							event.current.lose(cards)._triggered = null;
						}
						event.num = cards.length;
					} else {
						event.finish();
					}
					"step 2";
					var cards = [];
					for (var i = 0; i < event.num; i++) {
						cards.push(game.createCard("sha"));
					}
					event.current.directgain(cards);
					event.goto(1);
				},
				ai: {
					order: 4,
					value: 6,
					result: {
						player(player) {
							if (
								!player.hasSha() &&
								player.countCards("h", "shan") &&
								game.hasPlayer(function (current) {
									return (
										player.canUse("sha", current, true, true) &&
										get.effect(current, { name: "sha" }, player, player) > 0
									);
								})
							) {
								return 1;
							}
							return 0;
						},
					},
				},
			},
			hszuzhou_guhuo: {
				type: "hszuzhou",
				fullimage: true,
				vanish: true,
				enable: true,
				derivation: "hs_hajiasha",
				filterTarget(card, player, target) {
					return target != player && target.countCards("he");
				},
				content() {
					"step 0";
					target.chooseCard("he", true);
					"step 1";
					if (result.bool) {
						target.give(result.cards, player);
					}
				},
				ai: {
					order: 8.6,
					value: 8,
					result: {
						target(player, target) {
							return -1 / Math.sqrt(1 + target.countCards("he"));
						},
					},
				},
			},
			tuteng1: {
				noname: true,
				fullimage: true,
				type: "hstuteng",
				derivation: "hs_sthrall",
				gainable: false,
			},
			tuteng2: {
				noname: true,
				fullimage: true,
				type: "hstuteng",
				derivation: "hs_sthrall",
				gainable: false,
			},
			tuteng3: {
				noname: true,
				fullimage: true,
				type: "hstuteng",
				derivation: "hs_sthrall",
				gainable: false,
			},
			tuteng4: {
				noname: true,
				fullimage: true,
				type: "hstuteng",
				derivation: "hs_sthrall",
				gainable: false,
			},
			tuteng5: {
				noname: true,
				fullimage: true,
				type: "hstuteng",
				derivation: "hs_sthrall",
				gainable: false,
			},
			tuteng6: {
				noname: true,
				fullimage: true,
				type: "hstuteng",
				derivation: "hs_sthrall",
				gainable: false,
			},
			tuteng7: {
				noname: true,
				fullimage: true,
				type: "hstuteng",
				derivation: "hs_sthrall",
				gainable: false,
			},
			tuteng8: {
				noname: true,
				fullimage: true,
				type: "hstuteng",
				derivation: "hs_sthrall",
				gainable: false,
			},
		},
		translate: {
			hs_alleria: "奥蕾莉亚",
			hs_magni: "麦格尼",
			hs_medivh: "麦迪文",
			hs_jaina: "吉安娜",
			hs_lrexxar: "雷克萨",
			hs_wuther: "乌瑟尔",
			hs_jgarrosh: "加尔鲁什",
			hs_malfurion: "玛法里奥",
			hs_guldan: "古尔丹",
			hs_anduin: "安度因",
			hs_sthrall: "萨尔",
			hs_waleera: "瓦莉拉",
			hs_liadrin: "莉亚德琳",
			hs_morgl: "摩戈尔",

			hs_neptulon: "耐普图隆",
			hs_wvelen: "维纶",
			hs_antonidas: "安东尼达斯",
			hs_alakir: "奥拉基尔",
			hs_zhouzhuo: "周卓",
			hs_yngvar: "伊戈瓦尔",
			hs_bchillmaw: "冰喉",
			hs_malorne: "玛洛恩",
			hs_xsylvanas: "希尔瓦娜斯",
			hs_siwangzhiyi: "死亡之翼",
			hs_malygos: "玛里苟斯",
			hs_xuefashi: "血法师",
			hs_ysera: "伊瑟拉",
			hs_alextrasza: "阿莱克斯塔",
			hs_trueheart: "图哈特",
			hs_nozdormu: "诺兹多姆",
			hs_loatheb: "洛欧塞布",
			hs_jiaziruila: "加兹瑞拉",
			hs_sainaliusi: "塞纳留斯",
			hs_bolvar: "伯瓦尔",
			hs_lrhonin: "罗宁",
			hs_fuding: "弗丁",
			hs_aedwin: "艾德温",
			hs_lafamu: "拉法姆",
			hs_yelise: "伊莉斯",
			hs_lreno: "雷诺",
			hs_finley: "芬利",
			hs_brann: "布莱恩",
			hs_kcthun: "克苏恩",
			hs_anomalus: "阿诺玛鲁斯",
			hs_blingtron: "布林顿",
			hs_fandral: "范达尔",
			hs_hallazeal: "海纳泽尔",
			hs_enzoth: "恩佐斯",
			hs_walian: "瓦里安",
			hs_pengpeng: "砰砰博士",
			hs_aya: "艾雅",
			hs_pyros: "派洛斯",
			hs_jiawodun: "嘉沃顿",
			hs_laila: "莱拉",
			hs_selajin: "瑟拉金",
			hs_bannabusi: "班纳布斯",
			hs_amala: "阿玛拉",
			hs_kazhakusi: "卡扎库斯",
			hs_shaku: "沙库尔",
			hs_laxiao: "拉希奥",
			hs_yashaji: "亚煞极",
			hs_khadgar: "卡德加",
			hs_tyrande: "泰兰德",
			hs_kalimosi: "卡利莫斯",
			hs_yogg: "尤格萨隆",
			hs_xialikeer: "夏克里尔",
			hs_tanghangu: "唐·汉古",
			hs_barnes: "巴内斯",
			hs_kchromaggus: "克洛玛古斯",
			hs_kaituozhe: "开拓者",

			hs_yelinlonghou: "夜鳞龙后",
			hs_yelinchulong: "雏龙",
			hs_ronghejuren: "熔核巨人",
			hs_shanlingjuren: "山岭巨人",
			hs_mijiaojisi: "秘教祭司",
			hs_huzhixiannv: "湖之仙女",
			hs_totemic: "图腾师",
			hs_bilanyoulong: "碧蓝幼龙",
			hs_zhishigushu: "知识古树",
			hs_zhanzhenggushu: "战争古树",
			hs_jinglinglong: "精灵龙",
			hs_sapphiron: "萨菲隆",
			hs_xuanzhuanjijia: "旋转机甲",
			hs_ruanniguai: "软泥怪",
			hs_hudunren: "护盾机甲",
			hs_nate: "纳特",
			hs_shifazhe: "嗜法者",
			hs_wujiyuansu: "无羁元素",
			hs_mojinbaozi: "魔晶孢子",
			hs_shuiwenxuejia: "水文学家",
			hs_shizugui: "始祖龟",
			hs_hemite: "赫米特",
			hs_yinggencao: "萤根草",
			hs_zhihuanhua: "致幻花",
			hs_shirencao: "食人草",
			hs_fachaotuteng: "法潮图腾",
			hs_huolituteng: "活力图腾",
			hs_manyututeng: "蛮鱼图腾",
			hs_tgolem: "图腾魔像",
			hs_heifengqishi: "黑锋骑士",
			hs_yangyanwageli: "阳焰瓦格里",
			hs_aiqinvyao: "哀泣女妖",
			hs_ashamoer: "阿莎摩尔",
			hs_fengjianhuanfengzhe: "风剪唤风者",
			hs_taisi: "苔丝",
			hs_hajiasha: "哈加莎",
			hs_tuoqi: "托奇",
			hs_siwangxianzhi: "死亡先知",
			hs_xukongzhiying: "虚空之影",
			hs_duyaxinshi: "渡鸦信使",

			hshuanyu: "幻羽",
			hshuanyu_info: "每当你受到一次伤害，你获得发现一张炉石衍生牌。",
			hsfashu: "法术",
			hsfashu_anyingjingxiang: "暗影镜像",
			hsfashu_anyingjingxiang_info: "当你使用或打出一张牌后，暗影镜像变为该牌的复制。",
			hsfashu_buwendingyibian: "不稳定异变",
			hsfashu_buwendingyibian_info:
				"出牌阶段对一名角色使用，目标将一张手牌重铸为同类别的牌，本回合可重复使用此牌，最多使用X次，X为当前体力值。",
			hualing: "化灵",
			hualing_info:
				"每三轮限一次，你可以选择一名其他角色，获得其一项技能，然后将其随机变形为一名强度高一级的武将。",
			yibian: "异变",
			yibian_info: "锁定技，出牌阶段开始时，若你没有不稳定异变，则将一张不稳定异变置于你的手牌。",
			wxuying: "虚影",
			wxuying_info:
				"锁定技，准备阶段，你移去手牌中的暗影镜像，然后获得一张暗影镜像（当你使用或打出一张牌后，暗影镜像变为该牌的复制）；当你回合内使用暗影镜像时，你摸一张牌；当你回合外使用暗影镜像时，你获得潜行直到下一回合开始。",
			zhoujiang: "咒降",
			zhoujiang_info: "锁定技，每当你使用一张普通锦囊牌，你将一张随机“诅咒”牌置于你的手牌。",
			muyin: "暮隐",
			muyin_info: "锁定技，每当你失去最后一张手牌，你获得潜行直到下一回合开始。",
			tqchuanyue: "穿越",
			tqchuanyue_info:
				"锁定技，准备阶段开始时，你随机选择一个被削弱过的炉石技能，获得其未削弱的版本，替换上一个以此法获得的技能。",
			hsxingyi: "星移",
			hsxingyi_info: "锁定技，每当一名敌方角色于回合内使用主动技能，你获得此技能直到下一回合结束。",

			hshuanling: "幻灵",
			hshuanling_bg: "灵",
			hshuanling_info:
				"结束阶段，你可以弃置至多X张牌（X为你装备区内的牌数且至少为1）并摸等量的牌，每弃置一张牌，你随机使用一张本局敌方角色使用过的单目标非转化普通锦囊牌，随机指定一个具有正收益的角色为目标。",
			huanfeng: "唤风",
			huanfeng_info: "锁定技，准备阶段，若你有4个图腾，你失去所有图腾，然后获得并召唤随从奥拉基尔。",
			asyouzhang: "幽瘴",
			asyouzhang_info:
				"结束阶段，若你的手牌中没有基本牌/锦囊牌/装备牌，你可以获得牌堆顶的一张基本牌/锦囊牌/装备牌，并可以立即使用。",
			ylyuchu: "育雏",
			ylyuchu_info:
				"锁定技，每当你回复1点体力，你获得一只雏龙随从（不超过3只）；结束阶段，你每有一只雏龙，便随机选择一名其他角色，在该角色的下个回合开始前你切换至该雏龙，然后在此回合结束后进行一个额外回合并切换回本体。",
			nsaiqi: "哀泣",
			nsaiqi_info: "锁定技，每当你使用一张牌，你移除牌堆顶的三张牌；你的手牌上限始终+1。",
			nsbeiming: "悲鸣",
			nsbeiming_info:
				"锁定技，当你移除的牌不少于9张时，你摸一张牌，然后将移除的牌以任意顺序置于牌堆顶；当被移除过的牌在牌堆顶时（洗牌后重置），你的不能发动【哀泣】移除牌。",
			hstianqi_dalian: "达里安",
			hstianqi_dalian_info: "每当你造成一次伤害，你回复等量的体力。",
			hstianqi_shali: "莎莉",
			hstianqi_shali_info: "每当你回复体力，你获得等量的护甲。",
			hstianqi_nazigelin: "纳兹戈林",
			hstianqi_nazigelin_info: "当你装备此牌时，你获得1点护甲。",
			hstianqi_suolasi: "索拉斯",
			hstianqi_suolasi_info: "当你失去此牌时，你回复1点体力。",
			hschaoxi: "潮袭",
			hschaoxi_info: "锁定技，每当你造成一次伤害，你获得两张随机鱼人牌。",
			hsnitai: "拟态",
			hsnitai_info: "锁定技，出牌阶段开始时，你获得一张随机炉石角色的技能牌。",
			hstianqi: "天启",
			hstianqi_info:
				"出牌阶段限一次，你可以选择一项：弃置一张手牌并随机装备一件天启骑士（不能替换现有装备），或弃置一张装备区内的牌并摸两张牌；当你以此法弃置天启骑士时，若你武将牌上没有对应的天启骑士，你将其置于你的武将牌上；准备阶段，若你的武将牌上有4张天启骑士，你获得游戏胜利。",
			hspuzhao: "普照",
			hspuzhao_info:
				"出牌阶段限一次，你可以弃置一张红桃牌，然后令至多三名随机友方角色各摸一张牌（若你无其他队友，改为摸两张牌）。",
			hsyanxin: "炎心",
			hsyanxin_info: "锁定技，在你摸牌时，若牌堆中有红色牌，你摸到的首张牌必为红色。",
			ysjqisha: "七煞",
			ysjqisha_ju: "惧之煞",
			ysjqisha_kuang: "狂之煞",
			ysjqisha_nu: "怒之煞",
			ysjqisha_yi: "疑之煞",
			ysjqisha_wang: "惘之煞",
			ysjqisha_hen: "恨之煞",
			ysjqisha_ao: "傲之煞",
			ysjqisha_info: "锁定技，每当你造成或受到伤害，你令对方随机获得一种消极状态直到下一回合结束。",
			zhaochao: "招潮",
			zhaochao_info:
				"锁定技，结束阶段，你视为对一名随机敌人使用一张【杀】；若此【杀】被闪避，你视为对另一名随机敌人使用一张【杀】。",
			hllingxi: "灵息",
			hllingxi_info:
				"出牌阶段，你可以令一名已受伤的其他角色弃置两张牌并回复1点体力（同阶段对一名角色限用一次）；结束阶段，你可以回复1点体力。",
			xiyong: "汐涌",
			xiyong_info: "结束阶段，你可以摸一张牌并可以使用之，若你使用了此牌，你再摸一张牌。",
			hsjixie: "机械",
			hsjixie_zhadan: "炸弹机器人",
			hsjixie_zhadan_pop: "炸弹",
			hsjixie_zhadan_info: "出牌阶段对自己使用，对一名随机敌人造成1点火属性伤害。",
			yindan: "引弹",
			yindan_info: "出牌阶段限一次，你可以弃置一张黑桃牌并失去1点体力，然后获得两张炸弹机器人。",
			huanjue: "幻觉",
			huanjue_info: "每当你使用一张牌，若此牌指定了惟一目标，你可以发现一张牌，然后可以代替此牌结算。",
			oldhuanjue: "幻觉",
			oldhuanjue_info: "每回合限一次，当你成为一名其他角色的卡牌惟一目标时，你可以发现一张牌代替此牌。",
			zhziwu: "紫雾",
			zhziwu_info: "每当你于回合外失去牌，你可以令当前回合角色不能使用【杀】直到回合结束。",
			yinzong: "影踪",
			yinzong_info: "锁定技，每当你失去装备区内的牌，你获得一张闪。",
			tansuo: "探索",
			tansuo_info: "出牌阶段限一次，你可以弃置一张牌，然后发现一张炉石衍生牌。",
			srjici: "棘刺",
			srjici_info: "锁定技，每当你造成一次伤害，你摸一张牌，受伤害角色随机弃置一张牌。",
			lieqi: "猎奇",
			lieqi_info:
				"准备和结束阶段，你可以指定一名角色，从一张该角色手牌与另外两张随机牌中猜测哪张为该角色手牌，若猜中，你获得一张该牌的复制（同一回合不能指定相同角色）。",
			azaowu: "造物",
			azaowu_backup: "造物",
			azaowu_info: "出牌阶段限一次，你可以将一张基本牌当作任意一张基本牌使用。",
			shouwang: "守望",
			shouwang2: "守望",
			shouwang_info:
				"每名角色每局限一次，当一名角色进入濒死状态时，你可以令其回复1点体力并获得1点护甲。",
			shouwang_info_alter: "每名角色每局限一次，当一名角色进入濒死状态时，你可以令其回复1点体力。",
			qingtian: "擎天",
			qingtian_info: "锁定技，若你的体力值为全场最多，你受到的伤害始终+1。",
			qianfu: "潜伏",
			qianfu2: "潜伏",
			qianfu2_bg: "伏",
			qianfu_info:
				"锁定技，在你死亡前，若你没有进入潜伏状态，你弃置所有牌并进入潜伏状态；当你体力值回复到3（或体力上限）时，你解除潜伏状态并摸三张牌。",
			shimo: "尸魔",
			shimo_info: "锁定技，距离你为1的角色受到伤害时，你回复1点体力，若你没受伤，改为摸一张牌。",
			lieyang: "裂阳",
			lieyang_info:
				"锁定技，每当你于回合内使用一张锦囊牌，你获得一张随机锦囊牌；当你发动三次此技能后，你本回合不能再使用锦囊牌。",
			zhuilie: "追猎",
			zhuilie_info:
				"准备阶段，你可以弃置一张牌，然后将牌堆顶六张牌中的基本牌移至弃牌堆；若移入弃牌堆的牌超过三张，你摸一张牌。",
			szbianshen: "变身",
			szbianshen_info:
				"限定技，回合开始时，若游戏轮数不少于3，你可以随机观看5张体力上限不小于5的武将牌，将武将牌替换为其中一张。",
			kekao: "科考",
			kekao_info: "结束阶段，你可以发现一张延时锦囊牌。",
			jinhua: "进化",
			jinhua_info: "锁定技，每当你以自己为目标使用一张非转化的锦囊牌，你发现一个技能并获得之。",
			hsqizhou: "祈咒",
			hsqizhou_feng: "风之祈咒",
			hsqizhou_feng_info: "出牌阶段对自己使用，令所有目标的敌人打出一张【杀】或受到1点雷属性伤害。",
			hsqizhou_shui: "水之祈咒",
			hsqizhou_shui_info: "出牌阶段对自己使用，回复2点体力。",
			hsqizhou_huo: "火之祈咒",
			hsqizhou_huo_info: "出牌阶段对任意角色使用，令目标受到1点火属性伤害。",
			hsqizhou_tu: "土之祈咒",
			hsqizhou_tu_info: "出牌阶段对任意其他角色使用，令目标获得1点护甲。",
			kqizhou: "祈咒",
			kqizhou_info: "准备阶段，若你于上回合使用过锦囊牌，则可以获得一张元素祈咒。",
			jingcu: "晶簇",
			jingcu_info: "出牌阶段，你可以减少1点体力上限并摸两张牌。",
			shengzhang: "生长",
			shengzhang_info: "锁定技，若你于弃牌阶段弃置了牌，你增加1点体力上限。",
			pyuhuo: "浴火",
			pyuhuo_info:
				"锁定技，在你首次进入濒死状态时，你弃置所有牌、重置武将牌、将体力和体力上限变为4并摸四张牌；在你第二次进入濒死状态时，你弃置所有牌、重置武将牌、将体力和体力上限变为6并摸六张牌。",
			mengye: "梦魇",
			mengye_info:
				"结束阶段，你可以选择一名有手牌的角色将其一张随机的非毒手牌转化为毒，然后令其获得1点护甲。",
			fuhua: "腐化",
			fuhua2: "腐化",
			fuhua_info:
				"出牌阶段，你可以将一张毒交给一名没有魔血技能的其他角色，该角色选择一项：1. 获得技能魔血，此后每个结束阶段需交给你一张手牌；2. 视为你对其使用一张决斗。",
			moxie: "魔血",
			moxie_info:
				"锁定技，当你因【毒】失去体力时，你改为摸两张牌；结束阶段，你将一张随机手牌转化为毒。",
			hlongyi: "龙裔",
			hlongyi_info: "锁定技，你的黑色牌不占用手牌上限。",
			zhongji: "重击",
			zhongji_info: "每当你即将造成伤害，可弃置一张黑色手牌令伤害+1。",
			fuwen: "符文",
			fuwen_info: "若你弃牌阶段弃置了锦囊牌，你可以获得1点护甲。",
			jinzhou: "禁咒",
			jinzhou_info:
				"结束阶段，若你手牌中有黑桃牌，你可以令一名其他角色的非锁定技失效直到其下一回合结束。",
			midian: "秘典",
			midian_info: "出牌阶段限一次，你可以弃置一张锦囊牌，然后随机获得三张锦囊牌。",
			yuelu: "月露",
			yuelu_info: "在一名角色的濒死阶段，你可以弃置一张黑色牌令其回复1点体力并获得1点护甲。",
			yuelu_info_alter: "在一名角色的濒死阶段，你可以弃置一张黑色牌令其回复1点体力。",
			xingluo: "星落",
			xingluo_info:
				"准备阶段，你可以令任意名手牌数多于你的角色各弃置一张手牌，然后你可以从弃置的牌中选择一张加入手牌。",
			yushou: "御兽",
			yushou_info:
				"出牌阶段，你可以弃置一张牌并召唤一个随机的野兽宠物，回合开始阶段，你随机失去一个宠物。",
			yushou_misha: "米莎",
			yushou_misha_info: "每当你受到一次伤害，你获得1点护甲。",
			yushou_huofu: "霍弗",
			yushou_huofu_info: "你可以将一张黑色牌当作决斗使用。",
			yushou_leiouke: "雷欧克",
			yushou_leiouke_info: "你每回合造成的首次伤害+1。",
			hsqingyu_hufu: "青玉护符",
			hsqingyu_hufu_info: "令一名角色获得1点护甲。",
			hsqingyu_zhao: "青玉之爪",
			hsqingyu_zhao_info: "当你装备此装备时，摸一张牌。",
			hsqingyu_feibiao: "青玉飞镖",
			hsqingyu_feibiao_info: "弃置一名角色的一张随机手牌和一张随机装备牌。",
			hsqingyu_shandian: "青玉闪电",
			hsqingyu_shandian_info: "对一名角色造成1点雷电伤害。",
			hsqingyu_zhanfang: "青玉绽放",
			hsqingyu_zhanfang_info: "令一名角色增加1点体力上限并摸一张牌。",
			ayuling: "玉灵",
			ayuling_info: "每当你受到一次伤害，你可以获得一张随机青玉牌。",
			qingzun: "青樽",
			qingzun_info:
				"本局对战中，每当你使用一张青玉牌，你的手牌上限+1；当你累计使用两张青玉牌后，你可以于准备阶段摸一张牌；当你累计使用六张青玉牌后，你可以于结束阶段摸一张牌。",
			qingzun_info_alter:
				"本局对战中，每当你使用一张青玉牌，你的手牌上限+1；当你累计使用三张青玉牌后，你可以于准备阶段摸一张牌；当你累计使用九张青玉牌后，你可以于结束阶段摸一张牌。",
			lianjin: "炼金",
			lianjin_info:
				"出牌阶段限一次，你可以弃置一张牌并获得一张由三张随机牌组成的药水；当你因弃置而失去药水牌时，你随机获得药水的组成卡牌之一。",
			shouji: "收集",
			shouji_info:
				"每当你使用一张【杀】，你可以获得一张目标随机手牌的复制；每当你的【杀】被闪避，你可以获得一张目标随机非特殊装备牌的复制；每回合限各限一次。",
			hsguimou: "鬼谋",
			hsguimou_info:
				"每当你受到一次伤害，你可以获得伤害来源的一张手牌，若此牌是黑色，你展示此牌并重复此过程。",
			yingxi: "影袭",
			yingxi_info:
				"结束阶段，若你本回合未造成伤害，你可以将一张黑色牌当作【杀】对任意一名角色使用，若目标未受到伤害，此【杀】不可闪避。",
			peiyu: "培育",
			peiyu_info: "准备阶段，你可以令一名没有图腾的角色获得一个随机图腾直到其首次受到伤害。",
			wzhanyi: "战意",
			wzhanyi_info:
				"你可以跳过出牌阶段，改为摸三张牌并展示之，将摸到的装备牌置于装备区，然后可以使用手牌中的【杀】。",
			shengteng: "升腾",
			shengteng_info: "锁定技，每当你使用锦囊牌造成伤害，你增加1点体力上限并回复1点体力。",
			yuansu: "寂灭",
			yuansu_info:
				"出牌阶段限一次，若你已损失的体力值不少于3，你可以将体力上限降至与体力值相同，视为使用一张元素毁灭。",
			nuyan: "怒焰",
			nuyan2: "怒焰",
			nuyan_backup: "怒焰",
			nuyan_info:
				"出牌阶段限一次，你可以将一张红色牌当作任意一张具有「伤害」标签的牌使用（不得是你本局以此法使用过的牌）。",
			nuyan2_info: "出牌阶段限三次，你可以失去1点体力，视为使用任意一张具有「伤害」标签的牌。",
			chouhuo: "仇火",
			chouhuo_info:
				"觉醒技，出牌阶段开始时，若你的怒焰技能已将可用的牌用完，你失去1点体力上限，获得2点护甲，然后将怒焰的描述改为“出牌阶段限三次，你可以失去1点体力，视为使用任意一张能造成伤害的牌”。",
			hsdusu: "毒素",
			hsdusu_xueji: "血蓟",
			hsdusu_xueji_info: "随机弃置一名角色的2张装备牌。",
			hsdusu_shinancao: "石楠草",
			hsdusu_shinancao_info: "令一名角色下一次造成的伤害+1。",
			hsdusu_kuyecao: "枯叶草",
			hsdusu_kuyecao_info: "令一名角色获得技能潜行，直到其下一回合开始。",
			hsdusu_huoyanhua: "火焰花",
			hsdusu_huoyanhua_info: "对攻击范围内的一名角色造成1点火焰伤害。",
			hsdusu_huangxuecao: "皇血草",
			hsdusu_huangxuecao_info: "摸两张牌。",
			duxin: "毒心",
			duxin_info: "准备阶段和结束阶段，若你的手中没有毒素牌，你可以获得一张随机毒素牌。",
			oldduxin: "毒心",
			oldduxin_info: "准备阶段和结束阶段，你可以获得一张随机毒素牌。",
			hstuteng: "图腾",
			zengli: "赠礼",
			zengli_info: "出牌阶段限一次，你指定一名其他角色与你各装备一把武器。",
			xiubu: "修补",
			xiubu_info: "每当你装备一把未强化的武器，你可以获得数量等同于武器攻击范围的随机零件。",
			mobao: "魔爆",
			mobao_info:
				"出牌阶段限一次，你可以弃置至多三张黑色牌，然后对所有于上轮对你造成过伤害的角色造成等同于你弃牌数的雷电伤害。",
			xianji: "献祭",
			xianji2: "献祭",
			xianji3: "献祭",
			xianji_info:
				"其他角色可以在其结束阶段弃置1~2张手牌并令你摸等量的牌，若如此做，直到其下一回合结束，每当你使用卡牌指定其为目标时，其摸一张牌。",
			xueren: "血刃",
			xueren_info: "每当你使用【杀】造成伤害，你可以令受伤害角色与你各失去1点体力，然后你摸两张牌。",
			maoxian: "奇旅",
			maoxian2: "奇旅",
			maoxian_info: "出牌阶段限两次，你可以发现一个技能并获得之（替换此前发现的技能）。",
			tanmi: "探秘",
			tanmi_info: "在一名其他角色的结束阶段，若你没有手牌，你可以摸两张牌并可以使用两张牌。",
			yiwen: "轶闻",
			yiwen_info:
				"锁定技，每当其他角色于回合内首次使用非特殊卡牌指定你为惟一目标，你获得一张此牌的复制。",
			qianghuax: "强化",
			qianghuax_info:
				"出牌阶段限一次，你可以弃置任意张不同类别的牌，然后展示并获得与弃置的牌类别相同且价值更高的牌。",
			zhuizong: "追踪",
			zhuizong_info:
				"出牌阶段限一次，你可以弃置任意张牌，观看牌堆顶的等同于弃牌数四倍的牌，然后获得其中的一张牌。",
			xunbao: "寻宝",
			xunbao2: "寻宝",
			xunbao_info:
				"准备阶段，若你的武将牌上没有藏宝图，你可以将一张藏宝图置于你的武将牌上；若你的武将牌上有藏宝图，你可以弃置一张与藏宝图点数相同的牌并获得此藏宝图。",
			xieneng: "邪能",
			xieneng_info: "结束阶段，你可以选择一张神器牌并获得之。",
			fbeifa: "北伐",
			fbeifa_info:
				"每当你失去最后一张手牌，你可以视为使用一张无视距离的【杀】，若此【杀】造成伤害，你摸一张牌，每回合最多发动3次。",
			oldfbeifa: "北伐",
			oldfbeifa_info:
				"每当你失去最后一张手牌，你可以视为使用一张无视距离的【杀】，若此【杀】造成伤害，你摸一张牌。",
			yufa: "驭法",
			yufa_info:
				"在任意一名其他角色的结束阶段，若你于此回合内受过其伤害，你可以将一张传送门交给除此角色外的任意一名角色。",
			bingyan: "冰焰",
			bingyan_info: "出牌阶段限一次，你可以将一张红色牌当作炽羽袭，或将一张黑色牌当作惊雷闪使用。",
			hsshenqi: "神器",
			hsshenqi_morijingxiang: "末日镜像",
			hsshenqi_morijingxiang_info:
				"限武将牌正面朝上时使用，从所有其他角色的区域内各获得一张牌；使用后将武将牌翻至背面。",
			hsshenqi_kongbusangzhong: "恐怖丧钟",
			hsshenqi_kongbusangzhong_info:
				"限武将牌正面朝上时使用，对所有其他角色各造成1点伤害；使用后将武将牌翻至背面。",
			hsshenqi_nengliangzhiguang: "能量之光",
			hsshenqi_nengliangzhiguang_info:
				"限武将牌正面朝上时使用，令一名角色增加1点体力上限，回复1点体力，并摸四张牌；使用后将武将牌翻至背面。",
			hsbaowu: "宝物",
			hsbaowu_huangjinyuanhou: "黄金猿猴",
			hsbaowu_huangjinyuanhou_info:
				"将你的手牌（含此张）替换为随机炉石衍生牌，并获得潜行直到下一回合开始。",
			hsbaowu_cangbaotu: "藏宝图",
			hsbaowu_cangbaotu_info: "结束阶段，将一张黄金猿猴置入你的手牌；摸一张牌。",
			hsyaoshui: "药水",
			hsqingyu: "青玉",

			lianzhan: "连斩",
			lianzhan_info:
				"每当你造成一次伤害，若此伤害是你本回合第一次造成伤害，你摸两张牌；否则你增加1点体力上限并回复1点体力。",
			shifa: "魔瘾",
			shifa_info:
				"锁定技，每当你于回合内使用一张非转化的普通锦囊牌，你摸一张牌（每回合最多发动3次）；出牌阶段开始时，你令你与一名随机敌人各获得一张随机普通锦囊牌。",
			oldshifa: "魔瘾",
			oldshifa_info:
				"锁定技，每当你于回合内使用一张非转化的普通锦囊牌，你摸一张牌；出牌阶段开始时，你令你与一名随机敌人各获得一张随机普通锦囊牌。",
			yuanzheng: "远征",
			yuanzheng_info: "每当你对距离1以外的角色使用一张牌，你可以弃置目标区域内的一张牌。",
			bzhuiji: "追击",
			bzhuiji_info: "每当一名角色死亡，你可以摸两张牌，并视为对杀死该角色的人使用一张决斗。",
			yulu: "雨露",
			yulu_info: "出牌阶段限一次，你可以指定任意名角色各摸一张牌，然后各弃置区域内的一张牌。",
			oldyulu: "雨露",
			oldyulu_info: "出牌阶段限一次，你可以指定任意名角色各摸两张牌，然后各弃置区域内的两张牌。",
			duzhang: "毒瘴",
			duzhang2: "毒瘴",
			duzhang_info:
				"结束阶段，若你于本回合内未使用过锦囊牌，你可以指定一名其他角色令其下个回合无法使用锦囊牌。",
			hannu: "寒怒",
			hannu_info:
				"锁定技，每当你受到一次伤害，你将手牌数翻倍；若你的手牌数因此超过10张，你随机弃置若干张手牌直到手牌数等于你当前的体力值。",
			chuidiao: "垂钓",
			chuidiao_info: "锁定技，结束阶段，你随机摸0~2张牌。",
			fushi: "缚誓",
			fushi_info: "出牌阶段限一次，你可以令一名已受伤角色失去1点体力上限并回复1点体力。",
			oldfushi: "缚誓",
			oldfushi_info: "出牌阶段，你可以令一名已受伤角色失去1点体力上限并回复1点体力。",
			hhudun: "护盾",
			hhudun_info:
				"锁定技，在每名角色的准备阶段，若你没有护甲，你获得1点护甲；每当你的护甲抵消一次伤害，你摸一张牌。",
			fenlie: "分裂",
			fenlie_info:
				"锁定技，每当你于摸牌阶段外获得非特殊卡牌，你获得一张此牌的复制，每回合最多发动两次。",
			oldfenlie: "分裂",
			oldfenlie_info: "锁定技，每当你于摸牌阶段外获得非特殊卡牌，你获得一张此牌的复制。",
			nianfu: "粘附",
			nianfu_info: "锁定技，每当你造成或受到伤害，你随机获得对方装备区内的一张牌。",
			xiaorong: "消融",
			xiaorong_info:
				"锁定技，你的装备牌不占用手牌上限；结束阶段，你将手牌中的每张装备牌转化为两张随机基本牌，每转化一张装备牌便回复1点体力。",
			shixu: "时序",
			shixu_info: "锁定技，所有角色于出牌阶段每消耗3秒，便须于结束阶段弃置一张牌。",
			qianghua: "绝手",
			qianghua_info: "出牌阶段内，你可以令一张你使用的基本牌或普通锦囊牌额外结算一次，每回合限一次。",
			jixuan: "疾旋",
			jixuan_info: "锁定技，回合结束后，你摸一张牌进行一个额外的回合。",
			biri: "蔽日",
			biri_info:
				"每当距离你1以内的一名其他角色成为【杀】的唯一目标时，若【杀】的使用者不是你，你可以弃置一张闪取消之。",
			stuxi: "吐息",
			stuxi2: "吐息",
			stuxi2_bg: "息",
			stuxi_info: "锁定技，结束阶段，你令一名随机敌人下一个摸牌阶段摸牌数-1。",
			bingdong: "冰冻",
			bingdong_info: "锁定技，你在一个回合内首次造成伤害后，获得一个冰冻零件。",
			ronghuo: "熔火",
			ronghuo_info: "锁定技，你的普通【杀】均视为火【杀】。",
			luoshi: "落石",
			luoshi_info: "锁定技，每当你受到一次伤害，你与伤害来源各随机弃置一张牌。",
			moyao: "魔曜",
			moyao_info: "锁定技，你不能成为其他角色的锦囊牌的目标。",
			jiaohui: "教诲",
			jiaohui_info: "结束阶段，若你没有于本回合内造成伤害，你可以令一名角色摸一张牌或回复1点体力。",
			bimeng: "碧梦",
			bimeng_info: "结束阶段，你可以将一张随机梦境牌加入你的手牌。",
			hsmengjing: "梦境",
			hsmengjing_card_config: "梦境",
			hsmengjing_feicuiyoulong: "翡翠幼龙",
			hsmengjing_feicuiyoulong_info: "出牌阶段对任意一名角色使用，对目标造成1点伤害。",
			hsmengjing_huanxiaojiemei: "欢笑姐妹",
			hsmengjing_huanxiaojiemei_info: "出牌阶段对一名已受伤角色使用，令目标恢复1点体力。",
			hsmengjing_suxing: "苏醒",
			hsmengjing_suxing_info: "令所有其他角色失去1点体力并随机弃置两张牌。",
			hsmengjing_mengye: "梦魇",
			hsmengjing_mengye_info: "令一名角色摸一张牌，并在其下一个结束阶段弃置其所有牌。",
			hsmengjing_mengjing: "梦境",
			hsmengjing_mengjing_info: "令一名角色将装备区内的所有牌收入手牌，并将一张乐不思蜀置于其判定区。",
			hszuzhou: "诅咒",
			hszuzhou_nvwudeganguo: "女巫的钳锅",
			hszuzhou_nvwudeganguo_info:
				"出牌阶段对一名角色使用，目标弃置一张牌，然后随机获得一张炉石衍生牌。",
			hszuzhou_nvwudepingguo: "女巫的苹果",
			hszuzhou_nvwudepingguo_info: "出牌阶段对一名角色使用，目标获得两张【杀】。",
			hszuzhou_nvwudexuetu: "女巫的学徒",
			hszuzhou_nvwudexuetu_info:
				"出牌阶段对没有咒降技能的角色使用，令目标非锁定技失效，并获得技能咒降直到下一回合结束。",
			hszuzhou_wushushike: "巫术时刻",
			hszuzhou_wushushike_info: "出牌阶段对所有角色使用，将手牌中的闪替换为【杀】。",
			hszuzhou_guhuo: "蛊惑",
			hszuzhou_guhuo_info: "出牌阶段对一名其他角色使用，令其交给你一张牌。",
			xjumo: "聚魔",
			xjumo_info: "锁定技，你的手牌上限+3；若你已受伤，改为+5。",
			liehun: "裂魂",
			liehun_info: "锁定技，结束阶段，你获得手牌中所有非基本、非特殊牌的复制。",
			malymowang: "魔网",
			malymowang_info:
				"锁定技，你的锦囊牌在每回合中造成的首次伤害+1；出牌阶段开始时，你发现一张普通锦囊牌。",
			oldmalymowang: "魔网",
			oldmalymowang_info: "锁定技，你的锦囊牌造成的伤害+1；出牌阶段开始时，你发现一张普通锦囊牌。",
			lingzhou: "灵咒",
			lingzhou_info: "每当你使用一张非转化的锦囊牌，可令一名角色摸一张牌或回复1点体力。",
			mieshi: "灭世",
			mieshi_info: "锁定技，结束阶段，你失去1点体力，并对一名随机的其他角色造成1点火焰伤害。",
			xshixin: "蚀心",
			xshixin_info: "锁定技，每当你对一名其他角色造成一次伤害，受伤害角色与你各失去1点体力。",
			xshixin_info_alter:
				"锁定技，每当你对一名其他角色造成一次伤害，若受伤害角色体力值不小于你，其与你各失去1点体力。",
			xmojian: "魔箭",
			xmojian_info: "每当你的武将牌翻至正面时，你可以指定一名角色视为对其使用了一张【杀】。",
			enze: "恩泽",
			enze_info: "出牌阶段限一次，你可以指定一名角色令其手牌数与你相等（最多摸或弃三张牌）。",
			oldenze: "恩泽",
			oldenze_info: "出牌阶段限一次，你可以指定一名角色令其手牌数与你相等。",
			enze_info_alter: "出牌阶段限一次，你可以指定一名角色令其手牌数与你相等（最多摸或弃两张牌）。",
			chongsheng: "重生",
			chongsheng_bg: "生",
			chongsheng_info:
				"濒死阶段，你可弃置所有牌，将体力回复至2-X，并摸2-X张牌，X为你本局发动此技能的次数。每局最多发动2次。",
			s_tuteng: "神谕",
			s_tuteng_info:
				"锁定技，准备阶段，你随机获得一个图腾，若你已有至少3个图腾，则改为随机替换一个图腾。",
			guozai: "过载",
			guozai2: "过载",
			guozai2_bg: "载",
			guozai_info: "出牌阶段限一次，你可将手牌补至四张，并于此阶段结束时弃置等量的牌。",
			guozai_info_alter: "出牌阶段限一次，你可将手牌补至三张，并于此阶段结束时弃置等量的牌。",
			guozaix: "过载",
			guozaix2: "过载",
			guozaix2_bg: "载",
			guozaix_info: "出牌阶段限两次，你可将手牌补至四张，并于此阶段结束时弃置等量的牌。",
			oldhanshuang: "寒霜",
			oldhanshuang_info: "锁定技，你使用黑色牌对一名未翻面角色造成伤害后，你令受伤害角色翻面。",
			hanshuang: "寒霜",
			hanshuang_info:
				"锁定技，你使用黑色牌对一名未翻面角色造成伤害后，你令受伤害角色翻面，然后你失去1点体力。",
			hanshuang_info_alter:
				"锁定技，你使用黑色牌对一名未翻面角色造成伤害后，你令受伤害角色翻面并摸一张牌，然后你失去1点体力。",
			bingshi: "冰噬",
			bingshi_info: "锁定技，你死亡时，对所有其他角色造成1点伤害。",
			huanwu: "唤雾",
			huanwu_info:
				"出牌阶段限一次，你可以令一名角色增加1点体力上限，回复1点体力，并摸两张牌（每名角色限发动一次）。",
			fengnu: "风怒",
			fengnu_info:
				"锁定技，你使用的任何卡牌无数量及距离限制；当你于回合内重复使用同名卡牌时，你摸一张牌（每回合最多以此法摸三张牌）。",
			fengnu_info_alter:
				"锁定技，你使用的任何卡牌无数量限制；当你于回合内重复使用同名卡牌时，你摸一张牌（每回合最多以此法摸三张牌）。",
			shengdun: "圣盾",
			shengdun_info: "锁定技，准备阶段，若你没有护甲，你获得1点护甲。",
			jingmeng: "镜梦",
			jingmeng_info: "每当你于回合内使用第一张牌时，你可以从牌堆中随机获得一张与之类型相同的牌。",
			kuixin: "窥心",
			kuixin_info: "结束阶段，你可以获得一名手牌数不少于你的角色的一张手牌。",
			hswuji: "无羁",
			hswuji_info: "出牌阶段结束时，你可以摸X张牌，X为你本回合使用的卡牌数。",
			yanshu: "炎舞",
			yanshu_info: "每回合限一次，当你弃置非基本牌后，你可以获得一张流星火雨。",
			oldyanshu: "炎舞",
			oldyanshu_info: "当你弃置非基本牌后，你可以获得一张流星火雨。",
			bingshuang: "冰枪",
			bingshuang_info: "你使用锦囊牌造成伤害后，可令目标摸两张牌并翻面。",
			shengyan: "圣言",
			shengyan_info: "任意一名角色回复体力后，你可以令其额外回复1点体力，每回合限发动一次。",
			qingliu: "清流",
			qingliu_info: "锁定技，你防止即将受到的火焰伤害。",
			liechao: "猎潮",
			liechao_info:
				"出牌阶阶段限一次，若你的武将牌正面朝上且手牌数不大于当前体力值，你可以翻面并摸四张牌，若如此做，你跳过本回合的弃牌阶段。",
			liechao_info_alter:
				"出牌阶阶段限一次，若你的武将牌正面朝上且手牌数不大于当前体力值，你可以翻面并摸三张牌，若如此做，你跳过本回合的弃牌阶段。",
			aoshu: "奥术",
			aoshu_info: "出牌阶段限一次，你可以将一张黑桃牌当作无中生有使用。",

			qianhou: "千喉",
			qianhou_info:
				"锁定技，准备阶段，你视为使用一张随机普通锦囊牌（随机指定目标）；若目标只有1人且不是你，你可以弃置一张手牌并获得此锦囊。",
			fengxing: "风行",
			fengxing_info: "每当你于回合外首次失去牌，你可以弃置一张牌并摸两张牌。",
			xinci: "心刺",
			xinci_bg: "暗",
			xinci_info: "出牌阶段限一次，你可以弃置一张黑色牌令一名角色失去1点体力。",
			zhongjia: "战甲",
			zhongjia_info:
				"锁定技，每当你受到一次伤害，你获得1点护甲；当你的体力值大于1且大于手牌数时，你的护甲不为你抵挡伤害。",
			dunji: "盾击",
			dunji_info:
				"出牌阶段限一次，你可以对攻击范围内的至多X名其他角色各造成1点伤害，并失去等量的护甲，X为你的护甲数。",
			fengxian: "奉献",
			fengxian_info: "出牌阶段限一次，你可以令场上所有角色各弃置一张手牌。",
			zhanhou: "战吼",
			zhanhou_info: "出牌阶段限一次，你可以弃置一张防具牌并获得1点护甲。",
			oldzhanhou: "战吼",
			oldzhanhou_info: "出牌阶段，你可以弃置一张防具牌并获得1点护甲。",
			anying: "暗影",
			anying_info: "限定技，出牌阶段，你可以弃置一张黑色牌，失去技能圣光，并获得技能心刺。",
			shijie: "视界",
			shijie_info: "结束阶段，你可以获得一名其他角色的一张手牌，然后该角色摸一张牌。",
			shengguang: "圣光",
			shengguang_info: "出牌阶段限一次，你可以弃置一张红色牌令一名角色回复1点体力。",
			bingjia: "冰甲",
			bingjia2: "冰甲",
			bingjia_info:
				"出牌阶段，若你武将牌上没有牌，你可以将一张手牌背面朝上置于你的武将牌上，当你成为其他角色的与此牌花色相同的牌的目标时，你移去此牌，获得1点护甲，并且本回合内防止一切伤害。",
			bianxing: "变形",
			bianxing_info:
				"当一其他角色于回合内使用卡牌指定了惟一的其他目标后，你可以用一张合理的基本牌替代此牌，每名角色的回合限一次。",
			xianzhi: "先知",
			xianzhi_info: "任意一名角色进行判定前，你可以观看牌堆顶的两张牌，并可以将其调换顺序。",
			mdzhoufu: "缚魂",
			mdzhoufu2: "缚魂",
			mdzhoufu_info:
				"出牌阶段，你可以将一张黑色手牌置于一名其他角色的武将牌上，在其判定时以此牌作为判定结果，然后你获得亮出的判定牌。",
			zuzhou: "诅咒",
			zuzhou_info:
				"锁定技，准备阶段，若场上没有浮雷且你手牌中有黑桃牌，你将牌堆中的一张浮雷置于你的判定区；当一名角色受到浮雷伤害时，你移去此浮雷。",
			jingxiang: "镜像",
			jingxiang_info:
				"每回合限一次，当你需要打出卡牌时，你可以观看一名角色的手牌并将其视为你的手牌打出。",
			jingxiang_info_alter:
				"每回合限一次，当你需要打出卡牌时，你可以观看一名手牌数不多于你的角色的手牌并将其视为你的手牌打出。",
			tuteng: "图腾",
			tuteng_info: "出牌阶段，你可以获得一个随机基础图腾；每当你受到一次伤害，你随机失去一个图腾。",
			zuling: "祖灵",
			zuling_info:
				"觉醒技，准备阶段，若你拥有至少3个图腾，你失去1点体力上限，并将图腾描述中的“获得一个随机基础图腾”改为“获得任意一个图腾（若有4个图腾则改为替换一个图腾）”。",
			tuteng1: "治疗图腾",
			tuteng1_info: "结束阶段，你回复1点体力。",
			tuteng2: "灼热图腾",
			tuteng2_info: "每当你造成一次伤害，你摸一张牌。",
			tuteng3: "石爪图腾",
			tuteng3_info: "你受到下一次伤害时，令伤害-1，然后失去此图腾。",
			tuteng4: "空气图腾",
			tuteng4_info: "在你的回合内，你的锦囊牌造成的首次伤害+1。",
			tuteng5: "法潮图腾",
			tuteng5_info: "结束阶段，你摸一张牌。",
			tuteng6: "火舌图腾",
			tuteng6_info: "在你的回合内，你的【杀】造成的首次伤害+1。",
			tuteng7: "活力图腾",
			tuteng7_info: "结束阶段，你令一名其他角色回复1点体力。",
			tuteng8: "图腾魔像",
			tuteng8_info: "你的进攻距离+1。",
			hongxi: "虹吸",
			hongxi_info: "锁定技，每当有一名角色死亡，你将体力回复至体力上限。",
			jihuo: "激活",
			jihuo_info: "在你的回合结束后，你可以弃置一张手牌并进行一个额外的回合。",
			jianren: "刃舞",
			jianren_info: "出牌阶段限一次，你可以弃置装备区内的武器牌，对所有其他角色造成1点伤害。",
			mengun: "闷棍",
			mengun2: "闷棍",
			mengun_info:
				"每当一名其他角色于回合内使用基本牌，你可以弃置一张与之花色相同的牌令其收回此牌，且在本回合内不能再次使用，每回合限一次。",
			wlianji: "连击",
			wlianji_info: "结束阶段，若你本回合使用的卡牌数大于你当前的体力值，你可以摸两张牌。",
		},
	};
});
