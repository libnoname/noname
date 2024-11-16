import { lib, game, ui, get, ai, _status } from "../noname.js";
game.import("character", function () {
	return {
		name: "swd",
		character: {
			swd_huzhongxian: ["male", "wu", 3, ["daofa", "xielv", "hujing"]],

			swd_anka: ["male", "qun", 3, ["songci", "anlianying"]],
			swd_septem: ["male", "qun", 4, ["jiying", "liaoyuan", "yishan"]],
			swd_kama: ["female", "qun", 3, ["yueren", "shangshi"]],
			// swd_miles:['male','qun',4,['aojian','miles_xueyi','mohua2']],
			swd_nicole: ["female", "qun", 3, ["huanjian", "lingwu", "minjing"]],
			swd_wangsiyue: ["female", "wei", 3, ["duishi", "biyue"]],
			swd_weida: ["female", "qun", 3, ["yueren", "zhenlie", "duijue"]],
			swd_xuanyuanjianxian: ["male", "qun", 4, ["pozhou", "huajian", "xuanyuan"], ["name:轩辕|null"]],

			swd_chenjingchou: ["male", "wu", 3, ["youyin", "yihua"]],
			swd_duguningke: ["female", "qun", 3, ["nlianji", "touxi"], ["name:独孤|宁珂"]],
			swd_guyue: ["male", "wei", 3, ["gtiandao", "gxianyin", "wangchen"]],
			swd_tuobayuer: ["female", "shu", 4, ["swdliuhong", "poyue", "niepan"], ["name:拓跋|玉儿"]],
			swd_yuwentuo: ["male", "shu", 4, ["wushuang", "xielei", "kunlunjing"], ["name:宇文|拓"]],
			swd_yuxiaoxue: ["female", "wei", 3, ["huanhun", "daixing", "yinyue"]],

			swd_jiliang: ["male", "wu", 3, ["yunchou", "gongxin", "jqimou"]],
			swd_shuijing: ["female", "qun", 4, ["mojian", "duanyue", "tuzhen"]],
			swd_quxian: ["female", "qun", 3, ["mojian", "huanxia"]],
			swd_xiyan: ["male", "qun", 3, ["jiefen", "datong"]],
			swd_cheyun: ["female", "wu", 3, ["cyxianjiang", "cyqiaoxie", "shengong"]],
			swd_huanyuanzhi: ["male", "qun", 3, ["swdtianshu", "lanzhi", "mufeng"]],
			swd_murongshi: ["female", "shu", 4, ["duanyi", "guxing"], ["name:慕容|诗"]],
			swd_jipeng: ["male", "wu", 3, ["reyingzi", "guozao"]],
			swd_qi: ["male", "qun", 3, ["yaotong", "heihuo", "pojian"]],

			swd_luchengxuan: ["male", "wu", 4, ["ljifeng", "lxianglong"]],
			swd_xiarou: ["female", "shu", 3, ["xianghui", "huiqi"]],
			swd_moye: ["female", "wu", 3, ["rexue", "liuli", "senluo"]],

			swd_zhaoyun: ["male", "shu", 4, ["longdan", "pozhen", "tanlin"]],
			swd_hengai: ["female", "shu", 3, ["funiao", "ningxian", "hlingbo"]],
			swd_duanmeng: ["female", "shu", 4, ["xuanying", "lieren"], ["name:马|蕴"]],
			swd_jiangwu: ["male", "shu", 4, ["yijue", "dangping"], ["name:严|鹏"]],
			swd_tuwei: ["male", "shu", 3, ["zhanlu", "susheng"]],
			swd_yeyaxi: ["female", "shu", 3, ["rexue", "huopu", "shenyan"]],

			swd_muyun: ["male", "wei", 4, ["zhuhai", "polang", "jikong"]],
			swd_lanyin: ["female", "wei", 3, ["xingdian", "yulin", "luomei"]],
			swd_zhiyin: ["female", "wei", 3, ["xuehuang", "ningshuang", "zhuyu"]],
			swd_qiner: ["female", "wei", 3, ["huanyin", "tianhuo", "xuanzhou"]],
			swd_jiuyou: ["male", "wei", 3, ["lexue"]],
			swd_duopeng: ["male", "wu", 3, ["luanji", "reyingzi"]],

			swd_fengtianling: ["male", "shu", 4, ["guiyan", "jiang"]],
			swd_huyue: ["female", "wu", 3, ["hyunshen", "fengming"]],
			swd_jialanduo: ["male", "qun", 4, ["xianyin", "mailun"]],
			swd_rongshuang: ["female", "wu", 3, ["suiyan", "duanxing"]],
			swd_zhuoshanzhu: ["male", "wu", 4, ["suiyan", "wanjun"]],
			swd_jiting: ["female", "wei", 4, ["guanhu", "lingshi"]],

			swd_sikongyu: ["male", "wu", 4, ["sliufeng", "linyun", "hutian"], ["name:司空|宇"]],
			swd_muyue: ["female", "wei", 3, ["xingzhui", "lingxian", "shouyin"]],
			swd_ziqiao: ["female", "shu", 3, ["guaili", "fuyan"]],
			swd_fengyu: ["male", "shu", 4, ["fzhenwei", "shangxi"]],

			// swd_wushi:['male','wei',3,['zhoufu','yingbin','xuying']],
			// swd_lanmoshen:['female','wei',3,['bingjian','lieren']],
			swd_huanglei: ["male", "qun", 3, ["jilve", "gongshen", "gaizao"]],
			// swd_libai:['male','qun',3,['miaobi','zhexian']],
			swd_kendi: ["male", "qun", 3, ["zhanxing", "kbolan"]],
			// swd_lijing:['male','qun',4,['tianyi','zhuhai']],
			swd_lilian: ["female", "qun", 3, ["swd_wuxie", "lqingcheng"]],
			// swd_linming:['male','qun',3,['shelie','bifa']],
			// swd_philis:['male','qun',4,['yicong','wangxi']],
			// swd_pepin:['male','qun',4,['rejianxiong','quhu']],
			swd_kangnalishi: ["male", "qun", 1, ["busi", "xuying", "yinguo"]],
			swd_xuanyuanjiantong: ["male", "qun", 3, ["chengjian", "huanling"], ["name:轩辕|null"]],
			swd_huiyan: ["male", "qun", 4, ["hwendao", "lingfeng", "hxunzhi"]],

			// swd_chenfu:['male','qun',4,['xuanzhou','bingfeng']],
			// swd_chengyaojin:['male','qun',4,['jiuchi','jufu']],
			swd_shanxiaoxiao: ["female", "wu", 3, ["shehun", "xiaomoyu"]],
			swd_yuchiyanhong: ["female", "shu", 3, ["huanxing", "meihuo"], ["name:尉迟|嫣红"]],
			// swd_hanteng:['male','qun',4,['kuangfu']],
			// swd_heran:['male','qun',3,['yujian','guiyin','shejie']],
			// swd_xingtian:['male','qun',8,[]],
			// swd_qinshubao:['male','qun',3,['huajing','pingxu']],
			// swd_yangshuo:['male','qun',4,['longdan','luomu']],
			// swd_zhanglie:['male','qun',4,['huajin','poxiao']],

			swd_hanluo: ["male", "qun", 5, ["tiebi"]],
			swd_fu: ["male", "qun", 5, ["yudun"]],
			swd_linyue: ["male", "wei", 3, ["zhenjiu", "lmazui"]],
			swd_zidashu: ["male", "wu", 3, ["shoulie", "hudun"]],
			swd_maixing: ["male", "wu", 3, ["toudan", "shending"]],
			swd_fuyan: ["male", "qun", 4, ["lianda"]],
			swd_haidapang: ["female", "wu", 3, ["bingjian", "rumeng"]],
			swd_shaowei: ["female", "shu", 3, ["jianji", "huangyu"]],

			swd_youzhao: ["male", "shu", 4, ["longdan", "yuchen"], ["name:赵|昂"]],
			swd_shangzhang: ["male", "shu", 4, ["lianwu"], ["name:马|null"]],
			swd_situqiang: ["female", "shu", 3, ["fengze", "lingyue", "jinlin"], ["name:司徒|蔷"]],

			swd_chunyuheng: ["male", "wei", 2, ["jueqing", "shengshou", "xuying"]],
			swd_hanlong: ["male", "wei", 4, ["ciqiu", "siji"]],
			swd_yuli: ["female", "wu", 3, ["lingxin", "tianxiang"]],
			swd_zhanggao: ["male", "wei", 4, ["yicong", "poxing"]],
			swd_shuwaner: ["female", "shu", 3, ["sxianjing", "huodan"]],
			swd_xiaohuanglong: ["male", "wei", 3, ["yeying", "juxi"]],

			swd_hupo: ["male", "wu", 3, ["dunxing", "guiying"]],
			swd_jiangziya: ["male", "wu", 3, ["mingfu", "tianlun"]],
		},
		characterIntro: {
			swd_kendi:
				"占星大师老肯迪的孙子，老肯迪死后，他也自称肯迪，伪装成老肯迪，以保护老肯迪的藏书。肯迪平常以接受委托抄书与翻译拉丁文书籍为业，除了占星术以外，其余知识也相当广博。为了增长见闻，什么可怕的地方都敢去，所以认识薇达与不少的军官。后来，肯迪的子孙成为伊斯兰地区的大学者，以因果定律的学说著名于世。",
			swd_shuwaner:
				"第一代祝犁黄汉卿的妻子，二代祝犁黄采儿的母亲。陷阱机关师，擅长火系陷阱，并能驱使一种可爆裂来杀敌之神秘「火丹」技术。",
			swd_xiaohuanglong: "龙族之幻兽，后土之神将它送给兰茵避险，以保护她安全。",
			swd_huzhongxian:
				"炼妖壶是女娲神所创，是以开天辟地创造生命的工具，开创出万物后即遗留于某一处水底神殿中。由巴蛇及蛟龟守护该神器，过了约莫千年之久，炼妖壶已可幻化成人形，即为壶中仙。此时正因人类对异类的排斥，巴蛇对此愤愤不平，壶中仙与巴蛇讨论人魔共存的方法，但巴蛇觉得壶中仙是另有所图。自不采用，一日趁壶中仙不注意，将炼妖壶的妖怪全数释放，留下蛟龟看守练妖壶，巴蛇率领魔族大军反攻人类，从此人魔之战一直持续着。",
			swd_anka:
				"安卡在数千年前，曾经是法老王的宠物。在法老王过世后，本来要当陪葬品，却被一位也要被陪葬的祭司带着逃走，安卡借着长期跟随祭司，学得不少后来传到欧洲的黑魔法，成了一只猫精。但在欧洲黑猫很不受欢迎，之后遇上卡玛，成为共患难的好友。安卡有许多癖好，像是收集漂亮的石头把它藏起来，若是日后又发现会很高兴。",
			swd_septem:
				"欧洲梅罗文加王朝高卢出生的东方人与日耳曼混血儿，宇文拓的后人。深受丕平三世的器重，主要担任收集情报等工作，因为屡立大功而被受封为骑士。后因接受丕平三世的任务而秘密离开高卢前往东方寻找所谓的战争不败之术，由此踏上漫漫征途。",
			swd_kama:
				"来自印度的爱情精灵，与一只来自埃及的有翼黑猫一同旅行，黑猫名叫安卡。数百年来，卡玛跟人类有数不尽的爱情故事，大部分都以悲剧收场，她不断的在人间徘徊，为的是寻找永恒的知己。",
			swd_nicole:
				"前世是独孤宁珂，灵魂被古月仙人用伏羲琴净化，因此未受到魔界污染。她没有过去的记忆，因此个性单纯，对许多事都好奇。后来受撒旦派遣来引导赛特，希望赛特能加入撒旦的阵营。",
			swd_wangsiyue:
				"长安名士的孙女，熟读四书以及佛经，有才女之称，还没出嫁就有大批追求者，她的字画就能在市集上以高价卖出。她非常喜欢诗，特别是古朴的诗经的诗句，遇到说不出口的事，就用吟诗的方式表达。",
			swd_weida:
				"阿拉伯女性，凯利宾瓦力德之后裔，女中豪杰，做事干脆利落，不喜欢拖拖拉拉。长期的军旅生涯，使她的行事作风与一般女性不同。阿拉伯世界的女子长年戴着面纱，不能与男子一起走路，薇达则是通通不遵守。",
			swd_xuanyuanjianxian:
				"东汉末年，年幼的徐暮云的神识被应龙之女分离出来时附于野狼尸体上，化作金狼。因总想夺回成年徐暮云神识所控制的肉身而时常袭击徐暮云。在木门道获得剑气后化为人形，前往遥远的云和山的彼端，归隐为轩辕剑仙。平常能言善道，出口成章，甚至杀人出血成“书画”为其一绝。",
			swd_xuanyuanjiantong:
				"由轩辕剑鞘幻化而成的仙童，好奇心很重，完全是个小孩子的心，跟轩辕剑仙成一老一少的对比。",
			swd_chenjingchou:
				"为陈朝后裔。忠臣陈辅以“靖北虏，复国仇”为他命名“靖仇”。将所有的复国重任全都寄托于他身上。虽然师傅对其寄予厚望，但长大后的陈靖仇却个性温柔，只喜欢诗词与音乐，非常讨厌杀戮，无心复国，一心只想过着与世无争的平静生活。因这样的性格，被其师责为软弱无能、胸无大志。",
			swd_duguningke:
				"西方魔王撒旦手下的女魔将。由撒旦派往神州，目的是扩大赤贯星在神州九天结界上所划开的裂痕。是撒旦侵略神州的前锋。与宇文拓自幼相识，对他怀有感情。因不愿在宇文拓面前吃下撒旦之果而变得丑陋，在赤贯星上败给陈靖仇一行人后悲凉死去，后古月圣将她的魂魄放入伏羲琴中净化99年，宇文拓带着她的魂魄一路西行，回到欧洲。经过净化后忘记前世记忆，转世成为妮可。",
			swd_guyue:
				"仙山岛最深处隐居的年轻仙人，飘逸潇洒，气质不凡。据说他的医术在仙界，也堪称是第一、第二位之绝。真身为一只白狐，后与修炼成仙的何然同归仙山岛隐居，二人经常在对弈亭对弈，不问世事。",
			swd_tuobayuer:
				"本是拓跋部落（鲜卑）遗民，世世代代保护拓跋族神器“神农鼎”。年幼的她有一次随族人外出游牧时，隋炀帝为凸显天威而发兵侵略冲袭留守的部民，父母惨死，神鼎被夺。自此对隋人产生极深敌意，苦苦恳求姐夫张烈教她武艺，日夜勤练，打算伺机南下找回神鼎，并替父母报仇。",
			swd_yuwentuo:
				"又名杨拓，本是北周皇室后裔，因国家被隋朝所篡，他自小流落於民间。幸好隋朝名将杨素发现了他，看出他的素质，就收他为徒，并让自己师弟杨义臣收他为义子。12岁那年曾用轩辕剑歼灭南陈旧部叛乱，杨素死後，宇文拓就担负起继续捍卫杨家天下的重责大任。后通过昆仑镜预见未来，得知赤贯将要划破九天神州结界，决定再也不管隋家天下安危，转而全心寻找上古神器，只想阻止这场危机，担负起挽救神州的重任。",
			swd_yuxiaoxue:
				"女娲石转世，自幼孤儿，由月河村客栈老板贺老伯抚养，满头白发被当地村人认为是不祥的象征，备受歧视。后来她村子被村人祭祀的河神所摧毁，村人把责任全归咎于她，她因而被永远逐出了自己故乡。",
			swd_jiliang:
				"故韩王国贵族出身，世代公卿，祖父被封于张邑，因此也以张为氏。喜好思考，心思敏捷聪慧，好奇心非常旺盛。尽管看来手无缚鸡之力，但却能以过人的智慧，凭藉著最少的情报，而去推演出全局；以一人之力，而胜过千军万马。",
			swd_shuijing:
				"墨家的年轻女弟子，故赵王国人。亲人在秦战火中丧生，被协防赵国的墨家弟子在废墟之中发现，带回交由墨家夫人收容抚养。",
			swd_quxian:
				"墨家年轻女弟子，故楚王国人。出身贵族，带有独特高贵气质。由于亲眼目睹全家死于秦人机关部队，心中有难以抹灭之阴影。",
			swd_xiyan: "来自云中界的灵犀族，被壶中仙选中做为入室弟子，由他负责整合云中界的种族纠纷。",
			swd_cheyun:
				"令狐国人，祖父是令狐国的大夫。但昔日由于研究“御木为兵”的“木甲术”而被政敌北宫大夫构陷，最后遭到抄家灭族；车芸年幼，因之只被处以刖刑，需以木制义肢来行走。由家臣端木氏抚养，之后她继续秘密研究祖父的木甲术，誓要效忠国家，为祖父及家人平反。",
			swd_huanyuanzhi:
				"东晋名将桓温的亲属，为了改变淝水之战秦灭晋的结局而来到春秋时代，成为了晋国太辰宫的“九龙子”祭司之一，人称“肆龙子”，代号为 “负屃”。设置五岳阵法把王霸之气汇聚晋国，好让一千年后变成晋灭秦，和四百年以前来自不同时空的土耀使者墨老先生是同一个灵魂。",
			swd_murongshi:
				"自称昔日夏朝时负责保管「夏后祭器」的涂山氏后人，实际是从经桓远之改动的历史中穿越回来，目的是在太一之轮上刻下秦克晋生克从而改变历史。和车芸、苻殷是不同历史中同一灵魂的人。",
			swd_jipeng:
				"聒噪自大的鹦鹉国王，鹦鹉王国「多毛国」国王。原是野心家蜀桑子部下，被壶中仙丢入「云中界」后，在那里建立了自己的鹦鹉王国。由于曾偷吃壶中仙的长生丹药，因此老化速度变慢，聒噪威力不减当年。为了保护老主人女儿（墨家夫人），随同水镜返回人间，参与对抗赤松子的战争。",
			swd_qi: "上古文明的术者，沉睡千年后醒来，梦想重建古代王朝。古代蜀国的科学家，是一个天才少年。",
			swd_luchengxuan:
				"从小便拥有着强大的力量，可是不懂得控制，被周遭的人当成怪物般的看待，导致养成阴郁犹疑不轻易吐露心声的性格，后来在探索自己拥有力量与生命意义的旅程中，逐渐历练成熟，进而立志发挥自己的力量协助他人。",
			swd_xiarou:
				"纯洁无瑕的气质与温柔婉约的外表，让人以为她手无缚鸡之力，但其实体内蕴藏有相当强的灵力，与生俱来个性温柔娴静，聪慧坚强，带领着族人勇敢面对他族的侵略，希望苍生皆能过着和平安稳的生活。",
			swd_moye:
				"青龙圣者手下，对于青龙圣者有着莫名崇拜，常因沉不住气而搞砸许多事，不过还是很受族人的喜爱，单纯的个性让她丝毫不会烦恼任何事太久。后奉青龙圣者委派携带圣宇盘前往山海界西方寻找继任青龙圣者。",
			swd_zhaoyun:
				"朝云出生于三国时期普通的民家，荆州襄阳人。父亲皇甫疾，乃昔日刘表麾下的水师参军，荆州投降后，被曹魏所征召，后惨死于赤壁，母亲韩氏，则于关羽北伐时，死于逃难途中。朝云为把剩余不多的干粮留给一起逃难的姊弟，决心自我牺牲，趁夜偷偷离开他们，躲在荒野中，后来在饥寒交迫之中昏死，为路过的名将赵云救起。赵云将他带至一收容战火孤儿的组织，让他有栖身之所。后来，朝云在一次支援粮秣运输工作中，意外以剑气救了误入曹贼陷阱中的赵云及所属部队，此后，赵云便夜夜蒙面，把朝云带至营后的山上，传授枪戟武术。最终朝云在天干十杰选拔中获得首位拿下“焉逢”称号，成为蜀汉精英部队“飞羽”的“羽之部”领导人。",
			swd_hengai:
				"充满神秘色彩之女子。聪明而慧黠，凡事颇有自己见地。携上古神器「炼妖壶」在身，不时会同情敌人，又不喜杀戮的姑娘。擅法术，一头异于常人之蓝色长发，据说乃昔日为修练高深法术所造成。她对焉逢甚有好感，却又保持距离，态度甚为微妙。",
			swd_duanmeng:
				"马良之女，本名马蕴。马良死后流落南蛮，后在诸葛亮平定南中时被马良之弟马谡找到并收为义女。马谡因街亭失守被斩，马蕴认为父亲是优秀幕僚而非将帅之才，街亭失守主因在于诸葛亮用人不当。为建立功勋，洗刷父亲的污名，马蕴加入飞羽部队，在「天干十杰」选拔中获得第二名「端蒙」称号，成为飞之部领导人",
			swd_jiangwu:
				"故巴东郡主簿严函之子，因诸葛亮曾为父亲严函洗脱冤情，故对其为人与公忠体国的精神十分景仰，因此将报效朝廷一事，置于个人一己的功业之上。左手持巨弓，右手配强弩，擅远距离攻击，有百步穿杨能力。他与焉逢乃是战场上一起出生入死之多年至交，二人情深谊厚，因此平日彼此之间从不以代号互称，而皆直称对方本名。以自己能身为「飞羽」一员而深深自豪。",
			swd_tuwei:
				"容貌清秀，但沉默寡言的青年。平日常闭目若有所思，偶一说话，也仅简单几个字回应而已。与横艾为同门之师姊弟，但飞羽「十杰」排名却意外地在横艾之上。他与横艾一样，坚不透露所属之道术门派，来历神秘。擅长疗愈系之法术",
			swd_yeyaxi:
				"孙尚香的义女，深色肌肤，大眼睛，天真无邪。是吴帝孙权派人出海寻找传说中之夷洲、亶洲时，所掳回之夷洲当地原住民少女。耶亚希心里偷恋焉逢，于是在孙尚香请托下，随焉逢一行人共同旅行历练。",
			swd_muyun:
				"皇甫朝云之弟，幼时遭逢变故，流落荒野，幸得魏国前御史中丞徐庶所救，将之收为养子，抚养成人。在洛阳的那段童年时光中，暮云与青梅竹马兰茵、以及魏国名将张郃之孙张诰相交甚笃，一同习剑成长。十年匆匆，暮云如今已是英姿焕发、名满洛阳的少年剑客，但为求精进，暮云始终勤练剑术，希望有朝一日能以一身武艺协助恩师张郃，报效朝廷。",
			swd_lanyin:
				"魏国名将张郃，府中之女剑僮。性格温婉可人，剑术高超，身手利落，深为张郃所赏识。与暮云为青梅竹马，二人情投意合，经常一起行动。真实身份为应龙之女。",
			swd_zhiyin:
				"女性法师，自称多年前随师父旅行至洛阳时与兰茵相遇，认作姊妹，实际与兰茵均为应龙之女的分身。个性果决，伶俐慧黠。于并西胡匈之地修习道术、降妖伏魔。",
			swd_qiner:
				"「铜雀尊者」之副领导人，赤衣尊者，虽年纪轻轻，却有着令人难以置信之惊人实力，能施展许多强大而罕见的术法。随身总是抱着一只琵琶，以音律操纵幻术、幻兽来进行各式各样之攻击。天女青儿赠予巫山女神瑶姬的四样乐器中的磬所化。",
			swd_jiuyou:
				"本名久须毗呼，来自东方邪马台国之清秀少年。他乃是多年前邪马台国领袖日御子（卑弥呼）私下派遣至辽东接触的使臣之一，由于对中原风土民情、文化制度深为着迷，便决定留下游历。身手非凡能使术法与剑术，持有剑、镜、玉三大法器。",
			swd_duopeng:
				"来自桃源界之多毛民，自称是多毛国疾鹏大王驾前第一勇士「禽灵天尊铁爪无敌啸风攫魂多毛翔鹏大元帅」。多鹏不小心打碎了留侯夫人夫君（姬良）送给她的最喜爱的琉璃花瓶，担心被留侯夫人（水镜）宰了煮了吃。于是逃离了桃源仙境，来到了轩辕界。遇见了寻找盘古斧的兰茵，带领兰茵到云中界寻找盘古斧。",
			swd_fengtianling:
				"商朝东方最强大的诸侯国──奄国大夫凤千平之子，外貌不俗，时刻流露出强烈的贵族气质与自信，但他脸上仍保有些许少年之青涩。从小生长在商民大族中的凤天凌，家中有一位哥哥，两人从小跟随住在太山上的师父习剑，剑术天分十分被肯定。",
			swd_huyue:
				"九尾狐妖，商亡后狐妖一族被商朝太师诛灭，因年幼未被发现而逃过一劫。与幼时的凤天凌因巧合相遇，与其成为好友。",
			swd_jialanduo:
				"迦兰多来自遥远的身毒国，身为身毒皇室的后裔，他却只身一人千里迢迢来到中原，只为了寻找昔日比他更早之前便独自前来中原、但如今却音信全无的亲姐姐。",
			swd_rongshuang:
				"蓉霜来自中原西南方的古蜀国，是师承古蜀文明“战甲”一派的谜样少女。由于蓉霜初懂中原语言，因此在战甲师群中战力不算特别强大的她，也一起被派遣前来中原执行任务。",
			swd_zhuoshanzhu:
				"战甲技能非常优秀的浊山铸，深受黑火门掌门师尊的重视，并有意指定他为自己的继承人。当师尊得知中原曾出现黑火踪迹，便下令浊山铸率领众徒前往中原，务必将黑火带回蜀国。任务途中，浊山铸为了保蓉霜周全，惨遭敌对门派痛下杀手，被埋葬在异国他乡黄土之下。",
			swd_jiting:
				"周朝王姬，好武且崇尚英雄，擅长于箭术与驭车。其人飒爽英姿、风华绝代，以长弓为贴身武器。逃不开政治婚姻的宿命，因对未来夫君充满好奇并且不愿盲目嫁人，遂毅然离开镐京去寻求真相。",
			swd_sikongyu:
				"来自有熊村，祖先自夏朝被灭后一直四处迁徙躲避战乱。习练的武功是司空一家代代相传的棍术，但也痴迷于研究陷阱、鸣竹等防御外来者入侵的机关，希望通过自己的本领使族人过上安稳的生活。",
			swd_muyue:
				"华胥人，千年前，颛顼帝与华胥国主联手施行“绝地天通”之阵关闭天门，以绝世人登天之妄想，平天下之乱。“绝地天通”阵势浩大，需以华胥族人的魂灵为祭，沐月本欲替代被选为做辅祭的姐姐入阵，却在最后时刻因信念不够坚定，错过了施术时间。最终，天门关闭，华胥国被建木托升至天际，沐月独自留守在华胥。千年后，相柳为重开天门，借助青榆和伏羲琴之力试图破坏结界，沐月因此坠入人间。",
			swd_ziqiao:
				"子国巫人之女，拥有凭神的体质。身材虽然娇小，却拥有常人所没有的力量，能够轻易的挥动巨斧作战。",
			swd_fengyu: "商朝王子，化名凤煜四处游历，希望能找到解决商朝内忧外患的局面的方法",
			swd_huanglei:
				"擅长古传的机关术（鲁班一脉），曾经在任官于唐朝政府少府监，因为被李林甫排挤而对政府怀恨在心。他出任高仙芝的参谋，出了主意灭掉石国，又企图干扰大食（阿拉伯）改朝换代，引起怛罗斯之战。当高仙芝返回长安，听其余的部属劝告，又因怛罗斯之战失利跟黄雷脱不了关系，疏远黄雷。黄雷转而投靠安禄山，想藉安禄山的叛乱取得势力。",
			swd_lilian:
				"生长在一个贵族家庭，是第三千金，她父亲已经许婚给其他贵族，但她却迷恋上来做客的骑士麦尔斯，之后麦尔斯出任务到威尼斯，莉莲也偷偷的带着她的爱犬波尔去追随他。",
			swd_kangnalishi:
				"梅罗文加护教骑士的指导教士，直属罗马教皇。在高卢没有一个人喜欢这个神情诡异的人。讲话都会带给人恐惧感。他称麦尔斯是他教出来最完美的骑士。",
			swd_huiyan:
				"慧彦俗名刘书经，从小被誉为神童，一心想金榜题名，由于过于狂妄自大，在考场取笑主考官而被逐出考场，觉得了无生趣，也不敢回乡面对乡亲父老，游荡到嵩山时，对那些会武术的和尚发生兴趣，于是就在少林寺出家。慧彦天资聪颖，无论在武术、佛学上几乎凌驾师辈后来对少林祖师达摩的事迹产生兴趣。当时唐僧玄奘去天竺取经的事迹为世人尊崇，而从天竺来到达摩所教的（禅宗）却还有些出入，于是想亲身去天竺求证，获得唐玄宗支持，让他持使节信符出关。但唐玄宗额外交代一些军事上的任务，慧彦必须协助探查远至大食附近诸国的军事情势。",
			swd_shanxiaoxiao: "独孤宁珂的婢女，是宁珂来到中原之后收伏的千年琵琶精。",
			swd_yuchiyanhong: "独孤宁珂的婢女，是宁珂来到中原之后收伏之千年狐狸精。",
			swd_hanluo: "寒洛是玄武国世子，因与知盈的婚事遭其父玄武侯反对，而与之私奔。",
			swd_fu: "福来自毛民国，因助陆承轩、夏柔搭救被毛民抓来做祭品的莫耶而得罪族人，而后随陆承轩等人离开。",
			swd_linyue:
				"来自氐人国的老医生，医术高明。醉心于各种医学技术，因此常外出云游，四处学习。随遇而安的个性让他不过于担心身边的人事物。",
			swd_zidashu: "周侥国王子，十分仰慕陆承轩等人的高超武艺，故随其一同游历，磨练自己。",
			swd_maixing:
				"奇肱国老神丁的徒弟。虽然是奇肱族近来难见的天才，但好胜的个性，让他常与旁人发生争执，孤独的他在没有比较之下更以为自己技术高超，另急躁的个性也让他急于试验自己未完成的工艺品，以致于常造成大乌龙。",
			swd_fuyan: "俱有满腔的热血与爱国心，外表虽然像其他白虎族人一样勇猛，其实是自幼常生病的药罐子。",
			swd_haidapang:
				"一目民，能在远处就注意到周遭的状况，一有危险马上逃跑！过于小心翼翼的性格，对于外界既害怕又好奇，总是张着大眼睛四处观望，又像惊弓之鸟似的随时保持警戒，做好逃跑的准备。",
			swd_shaowei:
				"生在朱雀国，个性高傲、善变，因与主角战斗受伤，因而忘记过去的朱雀族少女。时而天真迷惘、时而冷漠无情、时而阴狠狡诈，不知何者是她的本性。",
			swd_youzhao:
				"名将赵云之孙，枪法凛冽，胆识过人。一心追求建立不世之功业，期许自己能协助大汉讨灭曹贼，克复中原，以光耀祖先之名声。性格冷傲孤高，对自己在「天干十杰」名次排行战之中，竟输给了籍籍无名之孤儿焉逢，暗自耿耿为怀不已。执行任务时，出手迅疾猛狠，对敌人毫不留情，是极出色之菁英战士。",
			swd_shangzhang:
				"端蒙之弟，马谡之子。由于姊姊不顾家族劝阻，坚持加入飞羽，他十分担忧她的安危，便努力苦练武艺，历经艰难之后，终于在高手如林的飞羽「天干十杰」争夺战之中，以遍体鳞伤却仍力战不懈之姿，撼动所有战友，最后如愿挤入了十天干最末一个名位。他配属于「飞之部」，在姊姊身边默默守护她。",
			swd_situqiang:
				"原籍长安，父亲原是魏国医官，后因治疫不力遭罢，举家放逐。父亲死后，司徒蔷便想运用其自幼所习的知识，行走各地教授防疫知识。",
			swd_chunyuheng:
				"字长生。身拥承袭淳于一脉的绝顶医术，却不轻易替人治病。因淳于一族不长命且无法治好自己的怪病，导致性情古怪孤僻，且言谈之间尽是轻生之词，让人难以亲近。最后知晓原因后，得同伴帮助，消除诅咒。",
			swd_hanlong:
				"魁梧高大，身手矫健，能单手持巨刃而面不改色，是一本事卓绝之勇士。原为并西之地的胡族，因该地官员贪暴，其父反抗却遭杀害，他为照顾母亲，无奈沦为草莽盗匪，靠打劫路过达官显贵以维生。",
			swd_yuli:
				"他人以为是鱼妖而自称是鱼仙的混仙。在徐暮云等人追查鱼妖传闻的真相时，与其相遇，却从此成为助她成仙的伙伴。",
			swd_zhanggao:
				"字柏乔，为大魏名将张郃之孙，同时亦是徐暮云情谊深笃之挚友。暮云视他彷若兄长，十分尊敬。不时与暮云切磋剑术，互相砥砺，同为洛阳著名之少年剑客。",
			swd_hupo:
				"属于山林鬼神一族，全身雪白，眼睛碧蓝，一对长而尖细的耳朵，长着一簇蓬松的大尾巴。它的同族都是力量强大的山林鬼魅，但一般人并看不到它们，只有拥有特殊能力的人才能看得见。",
			swd_jiangziya:
				"周军统帅、周朝开国元勋，是一位尤其擅长法术攻击的权谋大家。曾修改了用于记载宇宙间万物生克关系的神器“太一之轮”，并留下了“周克商”的生克，造就牧野之战的胜利。",
		},
		perfectPair: {
			swd_fengtianling: ["swd_huyue", "swd_jiting"],
			swd_rongshuang: ["swd_zhuoshanzhu"],
			swd_jialanduo: ["swd_zhuoshanzhu"],
			swd_sikongyu: ["swd_muyue"],
			swd_fengyu: ["swd_ziqiao"],
			swd_zhaoyun: ["swd_hengai", "swd_yeyaxi", "zhaoyun"],
			swd_hengai: ["zhugeliang", "sp_zhugeliang"],
			swd_duanmeng: ["swd_shangzhang"],
			swd_shangzhang: ["swd_situqiang"],
			swd_tuwei: ["swd_hengai"],
			swd_jiangwu: ["swd_zhaoyun"],
			swd_muyun: ["swd_lanyin", "swd_zhiyin", "swd_zhanggao", "xushu"],
			swd_lanyin: ["swd_zhiyin"],
			swd_yuli: ["swd_chunyuheng"],
			swd_jiuyou: ["swd_zhiyin"],
			swd_qiner: ["swd_hengai"],
			swd_huzhongxian: ["swd_jiliang", "swd_jipeng", "swd_xiyan"],
			swd_anka: ["swd_kama"],
			swd_septem: ["swd_nicole", "swd_kama", "swd_weida", "swd_wangsiyue", "swd_huiyan"],
			swd_nicole: ["swd_lilian"],
			swd_xuanyuanjianxian: ["swd_xuanyuanjiantong"],
			swd_chenjingchou: ["swd_yuxiaoxue", "swd_tuobayuer"],
			swd_yuxiaoxue: ["swd_yuwentuo"],
			swd_zhanglie: ["swd_tuobayuer"],
			swd_duguningke: ["swd_yuwentuo", "swd_shanxiaoxiao", "swd_yuchiyanhong"],
			swd_jiliang: ["swd_shuijing", "swd_jipeng"],
			swd_jipeng: ["swd_duopeng"],
			swd_cheyun: ["swd_huanyuanzhi", "swd_murongshi"],
			swd_murongshi: ["swd_huanyuanzhi", "swd_shuijing"],
			swd_huanyuanzhi: ["swd_jipeng"],
			swd_qi: ["swd_huzhongxian"],
			swd_luchengxuan: ["swd_xiarou"],
		},
		skill: {
			cyqiaoxie: {
				trigger: { player: "loseEnd" },
				frequent: true,
				// alter:true,
				filter: function (event, player) {
					if (event.type == "use") return false;
					for (var i = 0; i < event.cards.length; i++) {
						if (get.type(event.cards[i]) == "equip") return true;
					}
					return false;
				},
				content: function () {
					"step 0";
					event.num = 0;
					for (var i = 0; i < trigger.cards.length; i++) {
						if (get.type(trigger.cards[i]) == "equip") {
							event.num++;
						}
					}
					"step 1";
					var list = get.inpile("jiguan", function (name) {
						return player.hasUseTarget(name);
					});
					if (list.length) {
						var prompt = get.prompt("cyqiaoxie");
						if (event.num > 1) {
							prompt = "###" + prompt + "###（剩余" + get.cnNumber(event.num) + "次）";
						}
						player.chooseVCardButton(list.randomGets(3), prompt);
					} else {
						event.finish();
					}
					"step 2";
					if (result.bool) {
						player.chooseUseTarget(true, game.createCard(result.links[0][2]));
					}
					event.num--;
					if (event.num > 0) {
						event.goto(1);
					}
				},
				ai: {
					noe: true,
					reverseEquip: true,
					effect: {
						target: function (card, player, target, current) {
							if (get.type(card) == "equip") return [1, 3];
						},
					},
				},
			},
			cyxianjiang: {
				trigger: { player: "useCardToBegin" },
				init: function (player) {
					player.storage.cyxianjiang = [];
				},
				filter: function (event, player) {
					if (event.target != player && event.targets && event.targets.length == 1) {
						if (player.storage.cyxianjiang.includes(event.target)) return false;
						return event.target.countCards("e", function (card) {
							return !player.countCards("he", card.name);
						});
					}
					return false;
				},
				direct: true,
				content: function () {
					"step 0";
					player
						.choosePlayerCard(trigger.target, "e", get.prompt("cyxianjiang"))
						.set("ai", get.buttonValue)
						.set("filterButton", function (button) {
							return !player.countCards("he", button.link.name);
						});
					"step 1";
					if (result.bool) {
						player.logSkill("cyxianjiang");
						var card = result.links[0];
						player.equip(game.createCard(card), true);
						player.storage.cyxianjiang.add(trigger.target);
					}
				},
				group: "cyxianjiang_clear",
				subSkill: {
					clear: {
						trigger: { global: "phaseAfter" },
						silent: true,
						content: function () {
							player.storage.cyxianjiang.length = 0;
						},
					},
				},
			},
			gxianyin: {
				enable: "phaseUse",
				usable: 1,
				delay: 0,
				filter: function (event, player) {
					return player.countCards("h");
				},
				content: function () {
					"step 0";
					var max = 0;
					var choice = "club";
					var map = {
						club: 0,
						heart: 0,
						diamond: 0,
						spade: 0,
					};
					for (var i in map) {
						var hs = player.getCards("h", { suit: i });
						for (var j = 0; j < hs.length; j++) {
							var val = get.value(hs[j], player, "raw");
							if (val > 7) {
								map[i] = 0;
								break;
							} else if (val <= 5) {
								map[i]++;
								if (val <= 4) {
									map[i] += 0.5;
								}
								if (val < 0) {
									map[i] += 2;
								}
							}
						}
						if (map[i] > max) {
							choice = i;
							max = map[i];
						}
					}
					var controls = ["heart2", "spade2", "diamond2", "club2"];
					for (var i = 0; i < controls.length; i++) {
						if (!player.countCards("h", { suit: controls[i].slice(0, controls[i].length - 1) })) {
							controls.splice(i--, 1);
						}
					}
					if (!controls.includes(choice)) {
						choice = controls.randomGet();
					}
					player
						.chooseControl(controls, function () {
							return choice;
						})
						.set("prompt", "移去一种花色的手牌");
					"step 1";
					var hs = player.getCards("h", {
						suit: result.control.slice(0, result.control.length - 1),
					});
					if (hs.length) {
						player.lose(hs, ui.discardPile)._triggered = null;
						player.$throw(hs);
						game.log(player, "移去了", hs);
					} else {
						event.finish();
						return;
					}
					var controls = ["heart2", "spade2", "diamond2", "club2"];
					controls.remove(result.control);
					var rand = Math.random();
					var list = controls.slice(0);
					if (player.hasShan()) {
						list.remove("diamond2");
					}
					player
						.chooseControl(controls, function () {
							if (!player.hasShan() && controls.includes("diamond2")) {
								return "diamond2";
							}
							if (rand < 0.5) {
								return list[0];
							}
							if (rand < 0.8) {
								return list[1];
							}
							if (list.length >= 3) {
								return controls[2];
							} else {
								return controls[0];
							}
						})
						.set("prompt", "选择一个花色从牌堆中获得" + hs.length + "张该花色的牌");
					event.num = hs.length;
					"step 2";
					if (result.control) {
						var suit = result.control.slice(0, result.control.length - 1);
						var cards = [];
						for (var i = 0; i < event.num; i++) {
							var card = get.cardPile(function (card) {
								return get.suit(card) == suit;
							});
							if (card) {
								ui.special.appendChild(card);
								cards.push(card);
							} else {
								break;
							}
						}
						if (cards.length) {
							player.directgain(cards);
							player.$draw(cards.length);
							game.delay();
							game.log(
								player,
								"获得了" + get.cnNumber(cards.length) + "张",
								"#y" + get.translation(suit + "2") + "牌"
							);
						}
					}
				},
				ai: {
					order: 7,
					result: {
						player: function (player) {
							var list = ["club", "heart", "diamond", "spade"];
							for (var i = 0; i < list.length; i++) {
								var hs = player.getCards("h", { suit: list[i] });
								var bool = false;
								for (var j = 0; j < hs.length; j++) {
									var val = get.value(hs[j], player);
									if (val > 7) {
										bool = false;
										break;
									} else if (val <= 4) {
										bool = true;
									}
								}
								if (bool) {
									return 1;
								}
							}
							return 0;
						},
					},
				},
			},
			yeying: {
				enable: "phaseUse",
				usable: 1,
				viewAs: { name: "qiankunbiao" },
				viewAsFilter: function (player) {
					return player.countCards("he", { color: "black" });
				},
				filterCard: { color: "black" },
				position: "he",
				check: function (card) {
					return 7 - get.value(card);
				},
				ai: {
					threaten: 1.5,
				},
			},
			juxi: {
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					return player.storage.juxi >= game.countPlayer();
				},
				filterTarget: true,
				init: function (player) {
					player.storage.juxi = 0;
				},
				init2: function (player) {
					if (get.mode() == "guozhan") {
						player.logSkill("juxi");
					}
				},
				intro: {
					content: "mark",
				},
				content: function () {
					"step 0";
					player.storage.juxi -= game.countPlayer();
					player.syncStorage("juxi");
					if (player.storage.juxi <= 0) {
						player.unmarkSkill("juxi");
					} else {
						player.updateMarks();
					}
					if (target.isDamaged()) {
						player
							.chooseControl(function () {
								if (get.attitude(player, target) > 0) return 1;
								return 0;
							})
							.set("choiceList", [
								"对" + get.translation(target) + "造成1点伤害",
								"令" + get.translation(target) + "回复1点体力",
							]);
					} else {
						target.damage();
						event.finish();
					}
					"step 1";
					if (result.control == "选项一") {
						target.damage();
					} else {
						target.recover();
					}
				},
				ai: {
					order: 7,
					result: {
						target: function (player, target) {
							if (get.attitude(player, target) > 0) {
								if (target.isDamaged()) return get.recoverEffect(target, player, target);
								return 0;
							} else {
								return get.damageEffect(target, player, target);
							}
						},
					},
				},
				group: "juxi_count",
				subSkill: {
					count: {
						trigger: { global: "discardAfter" },
						forced: true,
						popup: false,
						filter: function (event, player) {
							return _status.currentPhase != event.player;
						},
						content: function () {
							player.storage.juxi++;
							player.syncStorage("juxi");
							player.markSkill("juxi");
							player.updateMarks();
						},
					},
				},
			},
			jiefen: {
				enable: "phaseUse",
				usable: 1,
				filterTarget: function (card, player, target) {
					return target.countCards("h") > player.countCards("h");
				},
				filter: function (event, player) {
					return !player.isMaxHandcard();
				},
				content: function () {
					"step 0";
					target.chooseCard("h", true, "交给" + get.translation(player) + "一张牌");
					"step 1";
					if (result.bool) {
						player.gain(result.cards, target);
						target.$giveAuto(result.cards, player);
					} else {
						event.finish();
					}
					"step 2";
					var nh = player.countCards("h");
					if (
						game.hasPlayer(function (current) {
							return current.countCards("h") < nh;
						})
					) {
						player.chooseCardTarget({
							forced: true,
							filterTarget: function (card, player, target) {
								return target.countCards("h") < nh;
							},
							filterCard: true,
							ai1: function (card) {
								return 9 - get.value(card);
							},
							ai2: function (target) {
								return get.attitude(player, target) / Math.sqrt(target.countCards("h") + 1);
							},
							prompt: "交给一名手牌数少于你的角色一张牌",
						});
					} else {
						event.finish();
					}
					"step 3";
					if (result.bool && result.targets && result.targets.length) {
						result.targets[0].gain(result.cards, player);
						player.$giveAuto(result.cards, result.targets[0]);
						player.line(result.targets, "green");
					}
				},
				ai: {
					order: 7,
					result: {
						target: -1,
					},
				},
			},
			datong: {
				trigger: { global: "phaseEnd" },
				frequent: true,
				filter: function (event, player) {
					var max = player.countCards("h");
					var min = max;
					game.countPlayer(function (current) {
						var nh = current.countCards("h");
						if (nh > max) {
							max = nh;
						}
						if (nh < min) {
							min = nh;
						}
					});
					return max - min <= 1;
				},
				content: function () {
					player.draw(2);
				},
			},
			huodan: {
				enable: "phaseUse",
				usable: 1,
				filterCard: { color: "red" },
				filter: function (event, player) {
					return player.countCards("he", { color: "red" }) > 0;
				},
				filterTarget: true,
				selectTarget: [1, 2],
				position: "he",
				check: function (card) {
					return 7 - get.value(card);
				},
				contentBefore: function () {
					player.loseHp();
				},
				// alter:true,
				content: function () {
					if (targets.length == 1) {
						target.damage("fire", 2);
						if (get.is.altered("huodan")) target.draw();
					} else {
						target.damage("fire");
					}
				},
				line: "fire",
				ai: {
					order: 15,
					expose: 0.2,
					threaten: 1.5,
					result: {
						target: function (player, target) {
							if (player.hp < 2) return 0;
							if (get.attitude(player, target) >= 0) return 0;
							if (target.hp > player.hp) return 0;
							var eff = get.damageEffect(target, player, target, "fire");
							if (eff < 0) {
								if (
									ui.selected.targets.length &&
									target.hp > 1 &&
									ui.selected.targets[0].hp > 1
								) {
									return 0;
								}
								if (target.nodying) return eff / 10;
								return eff / Math.sqrt(target.hp);
							}
							return 0;
						},
					},
				},
			},
			sxianjing: {
				enable: "phaseUse",
				filter: function (event, player) {
					var suits = [];
					for (var i = 0; i < player.storage.sxianjing.length; i++) {
						suits.add(get.suit(player.storage.sxianjing[i]));
					}
					return player.hasCard(function (card) {
						return !suits.includes(get.suit(card));
					});
				},
				init: function (player) {
					player.storage.sxianjing = [];
				},
				filterCard: function (card, player) {
					var suits = [];
					for (var i = 0; i < player.storage.sxianjing.length; i++) {
						suits.add(get.suit(player.storage.sxianjing[i]));
					}
					return !suits.includes(get.suit(card));
				},
				check: function (card) {
					return 7 - get.value(card);
				},
				discard: false,
				prepare: function (cards, player) {
					player.$give(1, player, false);
				},
				content: function () {
					player.storage.sxianjing.add(cards[0]);
					player.syncStorage("sxianjing");
					player.markSkill("sxianjing");
					player.updateMarks();
				},
				ai: {
					order: 1,
					result: {
						player: 1,
					},
					threaten: function (player, target) {
						if (target.storage.sxianjing && target.storage.sxianjing.length) {
							return Math.sqrt(1.6 / (target.storage.sxianjing.length + 1));
						} else {
							return 1.6;
						}
					},
				},
				intro: {
					mark: function (dialog, content, player) {
						if (player.isUnderControl(true)) {
							dialog.add(player.storage.sxianjing);
						} else {
							return "已有" + get.cnNumber(player.storage.sxianjing.length) + "张“陷阱”牌";
						}
					},
					content: function (content, player) {
						if (player.isUnderControl(true)) {
							return get.translation(player.storage.sxianjing);
						}
						return "已有" + get.cnNumber(player.storage.sxianjing.length) + "张“陷阱”牌";
					},
				},
				group: ["sxianjing_gain", "sxianjing_damage"],
				subSkill: {
					gain: {
						trigger: { target: "useCardToBegin" },
						forced: true,
						filter: function (event, player) {
							if (event.player == player || !event.player.countCards("he")) return false;
							var suit = get.suit(event.card);
							for (var i = 0; i < player.storage.sxianjing.length; i++) {
								if (get.suit(player.storage.sxianjing[i]) == suit) {
									return true;
								}
							}
							return false;
						},
						content: function () {
							"step 0";
							var suit = get.suit(trigger.card);
							var card = null;
							for (var i = 0; i < player.storage.sxianjing.length; i++) {
								if (get.suit(player.storage.sxianjing[i]) == suit) {
									card = player.storage.sxianjing[i];
									break;
								}
							}
							if (card) {
								player.showCards(card, get.translation(player) + "发动了【陷阱】");
								player.storage.sxianjing.remove(card);
								card.discard();
								player.syncStorage("sxianjing");
								if (player.storage.sxianjing.length) {
									player.updateMarks();
								} else {
									player.unmarkSkill("sxianjing");
								}
							}
							"step 1";
							player.randomGain(trigger.player, true);
						},
					},
					damage: {
						trigger: { player: "damageEnd" },
						forced: true,
						filter: function (event, player) {
							return player.storage.sxianjing.length > 0;
						},
						content: function () {
							var card = player.storage.sxianjing.randomGet();
							player.storage.sxianjing.remove(card);
							player.gain(card, "draw");
							player.syncStorage("sxianjing");
							if (player.storage.sxianjing.length) {
								player.updateMarks();
							} else {
								player.unmarkSkill("sxianjing");
							}
						},
					},
				},
			},
			zhanxing: {
				enable: "phaseUse",
				usable: 1,
				position: "he",
				filterCard: true,
				selectCard: [1, Infinity],
				filter: function (event, player) {
					return player.countCards("he") > 0;
				},
				check: function (card) {
					switch (ui.selected.cards.length) {
						case 0:
							return 8 - get.value(card);
						case 1:
							return 6 - get.value(card);
						case 2:
							return 3 - get.value(card);
					}
					return 0;
				},
				content: function () {
					"step 0";
					var list = get.cards(cards.length);
					event.list = list;
					player.showCards(list);
					"step 1";
					var suits = [];
					event.suits = suits;
					for (var i = 0; i < event.list.length; i++) {
						suits.add(get.suit(event.list[i]));
						event.list[i].discard();
					}
					"step 2";
					if (event.suits.includes("diamond")) {
						player.draw(2);
					}
					"step 3";
					if (event.suits.includes("heart")) {
						if (player.isDamaged()) {
							player.recover();
						} else {
							player.changeHujia();
						}
					}
					"step 4";
					if (event.suits.includes("club")) {
						var enemies = player.getEnemies();
						for (var i = 0; i < enemies.length; i++) {
							enemies[i].randomDiscard();
							enemies[i].addExpose(0.1);
							player.line(enemies[i], "green");
						}
					}
					"step 5";
					if (event.suits.includes("spade")) {
						player.chooseTarget("令一名角色受到1点无来源的雷属性伤害").ai = function (target) {
							return get.damageEffect(target, target, player, "thunder");
						};
					} else {
						event.finish();
					}
					"step 6";
					if (result.bool) {
						player.line(result.targets[0], "thunder");
						result.targets[0].damage("thunder", "nosource", "nocard");
					}
				},
				ai: {
					order: 5,
					result: {
						player: 1,
					},
					threaten: 1.5,
				},
			},
			kbolan: {
				trigger: { player: "drawBegin" },
				frequent: true,
				priority: 5,
				content: function () {
					trigger.num++;
					trigger.id = trigger.id || get.id();
					player.storage.kbolan2 = trigger.id;
					player.addTempSkill("kbolan2");
				},
			},
			kbolan2: {
				trigger: { player: "drawEnd" },
				filter: function (event, player) {
					return player.storage.kbolan2 == event.id;
				},
				silent: true,
				onremove: true,
				content: function () {
					"step 0";
					player.removeSkill("kbolan2");
					if (player.countCards("h")) {
						player.chooseCard("h", true, "将一张手牌置于牌堆顶").ai = function (card) {
							return -get.value(card);
						};
					} else {
						event.finish();
					}
					"step 1";
					if (result && result.cards) {
						event.card = result.cards[0];
						player.lose(result.cards, ui.special);
						var cardx = ui.create.card();
						cardx.classList.add("infohidden");
						cardx.classList.add("infoflip");
						player.$throw(cardx, 1000, "nobroadcast");
					}
					"step 2";
					if (event.player == game.me) game.delay(0.5);
					"step 3";
					if (event.card) {
						event.card.fix();
						ui.cardPile.insertBefore(event.card, ui.cardPile.firstChild);
					}
				},
			},
			hujing: {
				trigger: { player: "phaseBegin" },
				forced: true,
				filter: function (event, player) {
					return get.discardPile("lianyaohu") ? true : false;
				},
				content: function () {
					var card = get.discardPile("lianyaohu");
					if (card) {
						player.equip(card);
						player.$gain2(card);
						game.delayx();
					}
				},
				mod: {
					maxHandcard: function (player, num) {
						if (player.getEquip("lianyaohu")) return num + 2;
					},
				},
			},
			gaizao: {
				trigger: { player: "useCardToBegin" },
				filter: function (event, player) {
					if (player != event.target && player.countCards("e") == 5) return false;
					return lib.skill.gaizao.filterx(event.card, player) && event.target == player;
				},
				direct: true,
				filterx: function (card, player) {
					if (!lib.inpile.includes(card.name)) return false;
					var info = get.info(card);
					if (info.type != "equip") return false;
					if (info.nomod) return false;
					if (info.unique) return false;
					if (!info.subtype) return false;
					if (!player.getEquip(info.subtype)) return false;
					return true;
				},
				content: function () {
					"step 0";
					var list = ["equip1", "equip2", "equip3", "equip4", "equip5"];
					for (var i = 0; i < list.length; i++) {
						if (player.getEquip(list[i])) {
							list.splice(i--, 1);
						}
					}
					list.push("cancel2");
					player.chooseControl(list, function () {
						return list.randomGet();
					}).prompt = "改造：是否改变" + get.translation(trigger.card.name) + "的装备类型？";
					"step 1";
					if (result.control && result.control != "cancel2") {
						player.logSkill("gaizao");
						var name = trigger.card.name + "_gaizao_" + result.control;
						if (!lib.card[name]) {
							lib.card[name] = get.copy(get.info(trigger.card));
							lib.card[name].subtype = result.control;
							lib.card[name].epic = true;
							lib.card[name].cardimage = trigger.card.name;
							lib.card[name].source = [trigger.card.name];
							lib.translate[name] = lib.translate[trigger.card.name];
							lib.translate[name + "_info"] = lib.translate[trigger.card.name + "_info"];
						}
						trigger.card.name = name;
						trigger.cards[0].init([
							trigger.card.suit,
							trigger.card.number,
							name,
							trigger.card.nature,
						]);
					}
				},
				ai: {
					effect: {
						target(card, player, target, current) {
							if (
								target == player &&
								lib.skill.gaizao.filterx(card, target) &&
								target.countCards("e") < 5
							) {
								return [1, 3];
							}
						},
					},
				},
			},
			lingshi: {
				mod: {
					attackFrom: function (from, to, distance) {
						return distance - from.countCards("e") * 2;
					},
					cardUsable: function (card, player, num) {
						if (card.name == "sha" && player.getEquip(5)) return num + 1;
					},
				},
				group: ["lingshi_hit", "lingshi_draw"],
				subSkill: {
					hit: {
						trigger: { player: "shaBegin" },
						filter: function (event, player) {
							return player.getEquip(1) || player.getEquip(2);
						},
						forced: true,
						content: function () {
							trigger.directHit = true;
						},
					},
					draw: {
						trigger: { player: "phaseDrawBegin" },
						filter: function (event, player) {
							return player.getEquip(3) || player.getEquip(4);
						},
						forced: true,
						content: function () {
							trigger.num++;
						},
					},
				},
			},
			tiebi: {
				trigger: { global: "shaBegin" },
				filter: function (event, player) {
					return (
						player.countCards("h", { color: "black" }) &&
						!event.target.hujia &&
						get.distance(player, event.target) <= 1
					);
				},
				direct: true,
				content: function () {
					"step 0";
					var next = player.chooseToDiscard(get.prompt("tiebi", trigger.target), {
						color: "black",
					});
					var goon =
						get.attitude(player, trigger.target) > 2 &&
						get.damageEffect(trigger.target, trigger.player, player) < 0;
					next.ai = function (card) {
						if (goon) {
							if (trigger.target.hp == 1) return 10 - get.value(card);
							return 7 - get.value(card);
						}
						return 0;
					};
					next.logSkill = ["tiebi", trigger.target];
					"step 1";
					if (result.bool) {
						trigger.target.changeHujia();
					}
				},
				ai: {
					threaten: 1.1,
				},
			},
			shenyan: {
				trigger: { source: "damageBegin" },
				skillAnimation: true,
				animationColor: "fire",
				filter: function (event, player) {
					return !player.storage.shenyan && event.hasNature("fire");
				},
				intro: {
					content: "limited",
				},
				mark: true,
				logTarget: "player",
				init: function (player) {
					player.storage.shenyan = false;
				},
				check: function (event, player) {
					if (get.attitude(player, event.player) >= 0) return 0;
					if (player.hasUnknown()) return 0;
					var num = 0,
						players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (
							players[i] != player &&
							players[i] != event.player &&
							get.distance(event.player, players[i]) <= 1
						) {
							var eff = get.damageEffect(players[i], player, player, "fire");
							if (eff > 0) {
								num++;
							} else if (eff < 0) {
								num--;
							}
						}
					}
					return num > 0;
				},
				content: function () {
					trigger.num++;
					player.addSkill("shenyan2");
					player.storage.shenyan = true;
					player.awakenSkill("shenyan");
					player.storage.shenyan2 = [];
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (
							players[i] != player &&
							players[i] != trigger.player &&
							get.distance(trigger.player, players[i]) <= 1
						) {
							player.storage.shenyan2.push(players[i]);
						}
					}
					player.storage.shenyan2.sort(lib.sort.seat);
				},
			},
			shenyan2: {
				trigger: { global: "damageAfter" },
				forced: true,
				popup: false,
				content: function () {
					"step 0";
					if (player.storage.shenyan2 && player.storage.shenyan2.length) {
						var target = player.storage.shenyan2.shift();
						player.line(target, "fire");
						target.damage("fire");
						event.redo();
					}
					"step 1";
					delete player.storage.shenyan2;
					player.removeSkill("shenyan2");
				},
			},
			senluo: {
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					return player.isMinHandcard();
				},
				filterTarget: function (card, player, target) {
					return target != player && target.countCards("h") > 0;
				},
				content: function () {
					"step 0";
					target.chooseToDiscard(2, "h", true).delay = false;
					"step 1";
					target.draw();
				},
				selectTarget: -1,
				ai: {
					order: 9,
					result: {
						target: -1,
					},
				},
			},
			xuanying: {
				subSkill: {
					sha: {
						enable: "chooseToUse",
						viewAs: { name: "sha" },
						viewAsFilter: function (player) {
							if (player.isLinked()) return false;
						},
						precontent: function () {
							player.link();
							// player.getStat().card.sha--;
						},
						filterCard: function () {
							return false;
						},
						selectCard: -1,
						prompt: "横置武将牌，视为使用一张无视距离的杀",
						ai: {
							order: function () {
								// if(_status.event.player.countCards('h',{type:'equip'})) return 9;
								return 3.15;
							},
							skillTagFilter: function (player, tag, arg) {
								if (arg != "use") return false;
								if (player.isLinked()) return false;
							},
							respondSha: true,
						},
						mod: {
							targetInRange: function (card) {
								if (_status.event.skill == "xuanying_sha") return true;
							},
						},
					},
					shan: {
						trigger: { player: ["chooseToRespondBegin", "chooseToUseBegin"] },
						filter: function (event, player) {
							if (!player.isLinked()) return false;
							if (event.responded) return false;
							if (!event.filterCard({ name: "shan" }, player, event)) return false;
							return true;
						},
						check: function (event, player) {
							if (get.damageEffect(player, event.player, player) >= 0) return false;
							return true;
						},
						content: function () {
							"step 0";
							player.link();
							"step 1";
							trigger.untrigger();
							trigger.responded = true;
							trigger.result = { bool: true, card: { name: "shan" } };
						},
						ai: {
							respondShan: true,
							target: function (card, player, target, current) {
								if (!player.isLinked() && current < 0) return 1.5;
								if (!target.hasFriend()) return;
								if (
									get.tag(card, "loseCard") &&
									_status.currentPhase != target &&
									target.countCards("he")
								) {
									return [0.5, Math.max(2, target.countCards("h"))];
								}
								if (get.tag(card, "respondSha") || get.tag(card, "respondShan")) {
									if (get.attitude(player, target) > 0 && card.name == "juedou") return;
									return [
										0.5,
										target.countCards("h", "sha") + target.countCards("h", "shan"),
									];
								}
							},
						},
					},
					damage: {
						trigger: { player: "damageEnd" },
						filter: function (event, player) {
							return (
								event.source &&
								event.source.isAlive() &&
								player.isLinked() &&
								lib.filter.targetEnabled({ name: "sha" }, player, event.source)
							);
						},
						check: function (event, player) {
							return get.effect(event.source, { name: "sha" }, player, player) > 0;
						},
						logTarget: "source",
						content: function () {
							"step 0";
							player.link();
							"step 1";
							player.useCard({ name: "sha" }, trigger.source);
						},
					},
					use: {
						trigger: { player: "loseEnd" },
						direct: true,
						filter: function (event, player) {
							return (
								_status.currentPhase != player &&
								player.isLinked() &&
								event.cards &&
								event.cards.length
							);
						},
						content: function () {
							"step 0";
							player
								.chooseTarget(get.prompt("xuanying"), function (card, player, target) {
									return lib.filter.targetEnabled({ name: "sha" }, player, target);
								})
								.set("ai", function (target) {
									return get.effect(target, { name: "sha" }, _status.event.player);
								})
								.set("autodelay", 0.5);
							"step 1";
							if (result.bool) {
								player.logSkill("xuanying");
								player.link();
								player.useCard({ name: "sha" }, result.targets, false);
							}
						},
					},
				},
				group: ["xuanying_sha", "xuanying_use"],
				ai: {
					threaten: function (player, target) {
						if (target.isLinked()) return 0.7;
						return 1.4;
					},
				},
			},
			hwendao: {
				trigger: { player: ["useCardAfter", "respondAfter"] },
				check: function (event, player) {
					return get.attitude(player, _status.currentPhase) <= 0;
				},
				logTarget: function () {
					return _status.currentPhase;
				},
				filter: function (event, player) {
					if (player == _status.currentPhase) return false;
					if (!_status.currentPhase.countCards("he")) return false;
					return event.cards && event.cards.length == 1;
				},
				content: function () {
					"step 0";
					var suit = get.suit(trigger.cards[0]);
					var goon = get.attitude(_status.currentPhase, player) <= 0;
					_status.currentPhase.chooseToDiscard(
						"弃置一张" +
							get.translation(suit + "2") +
							"牌，或令" +
							get.translation(player) +
							"获得你的一张牌",
						{ suit: suit }
					).ai = function (card) {
						if (goon) return 8 - get.value(card);
						return 0;
					};
					"step 1";
					if (!result.bool) {
						player.gainPlayerCard(_status.currentPhase, "he", true);
					}
				},
				ai: {
					threaten: 0.7,
				},
			},
			lingfeng: {
				trigger: { player: "phaseEnd" },
				frequent: true,
				filter: function (event, player) {
					return player.countUsed() >= Math.min(3, player.hp);
				},
				content: function () {
					"step 0";
					player
						.chooseTarget("凌锋", function (card, player, target) {
							return player != target && get.distance(player, target, "attack") <= 1;
						})
						.set("prompt2", "造成1点伤害，或取消并获得1点护甲").ai = function (target) {
						if (player.hp == 1) return 0;
						if (player.hp == 2 && target.hp >= 3) return 0;
						return get.damageEffect(target, player, player);
					};
					"step 1";
					if (result.bool) {
						player.line(result.targets[0]);
						result.targets[0].damage();
					} else {
						player.changeHujia();
					}
				},
				ai: {
					order: -10,
					result: {
						target: 2,
					},
					threaten: 1.5,
				},
			},
			hxunzhi: {
				unique: true,
				enable: "phaseUse",
				derivation: ["wusheng", "paoxiao"],
				filter: function (event, player) {
					return !player.storage.hxunzhi;
				},
				// alter:true,
				init: function (player) {
					player.storage.hxunzhi = false;
				},
				mark: true,
				intro: {
					content: "limited",
				},
				skillAnimation: true,
				animationColor: "fire",
				content: function () {
					"step 0";
					player.awakenSkill("hxunzhi");
					player.storage.hxunzhi = true;
					if (!get.is.altered("hxunzhi")) {
						var targets = game.filterPlayer(function (current) {
							return player.canUse("wanjian", current);
						});
						targets.sort(lib.sort.seat);
						player.useCard({ name: "wanjian" }, targets);
					}
					"step 1";
					player.addSkill("wusheng");
					player.addSkill("paoxiao");
					player.addSkill("hxunzhi2");
				},
				ai: {
					order: 2,
					result: {
						player: function (player) {
							if (get.mode() == "identity") {
								if (player.identity == "zhu") return 0;
								if (player.identity == "nei") return 0;
							} else if (get.mode() == "guozhan") {
								if (player.identity == "ye") return 0;
								if (player.isUnseen()) return 0;
							}
							if (player.hp == 1) return 1;
							if (player.hasUnknown()) return 0;
							if (!player.hasFriend()) return 0;
							var enemies = player.getEnemies();
							if (enemies.length + 1 == game.players.length) return 0;
							var num = player.hasCard(function (card) {
								return card.name == "sha" || get.color(card) == "red";
							});
							if (num < 2) return 0;
							for (var i = 0; i < enemies.length; i++) {
								if (
									player.canUse("sha", enemies[i]) &&
									get.effect(enemies[i], { name: "sha" }, player, player) > 0 &&
									!enemies[i].getEquip(2) &&
									num > enemies[i].hp &&
									enemies[i].hp <= 2
								) {
									return 1;
								}
							}
							return 0;
						},
					},
				},
			},
			hxunzhi2: {
				trigger: { player: "phaseUseEnd" },
				forced: true,
				popup: false,
				content: function () {
					player.removeSkill("xunzhi2");
					player.die();
				},
			},
			lmazui: {
				audio: "mazui",
				enable: "phaseUse",
				usable: 1,
				filterCard: { color: "black" },
				filterTarget: function (card, player, target) {
					return !target.hasSkill("lmazui2");
				},
				check: function (card) {
					return 6 - get.value(card);
				},
				discard: false,
				prepare: "give",
				content: function () {
					target.storage.lmazui2 = cards[0];
					target.addSkill("lmazui2");
					game.addVideo("storage", target, [
						"lmazui2",
						get.cardInfo(target.storage.lmazui2),
						"card",
					]);
				},
				ai: {
					expose: 0.2,
					result: {
						target: function (player, target) {
							return -target.hp;
						},
					},
					order: 4,
					threaten: 1.2,
				},
			},
			lmazui2: {
				trigger: { source: "damageBegin" },
				forced: true,
				mark: "card",
				filter: function (event) {
					return event.num > 0;
				},
				content: function () {
					trigger.num--;
					player.addSkill("lmazui3");
					player.removeSkill("lmazui2");
				},
				intro: {
					content: "card",
				},
			},
			lmazui3: {
				trigger: { source: ["damageEnd", "damageZero"] },
				forced: true,
				popup: false,
				content: function () {
					player.gain(player.storage.lmazui2, "gain2", "log");
					player.removeSkill("lmazui3");
					delete player.storage.lmazui2;
				},
			},
			hyunshen: {
				trigger: { player: ["respond", "useCard"] },
				filter: function (event, player) {
					return event.card.name == "shan";
				},
				frequent: true,
				init: function (player) {
					player.storage.hyunshen = 0;
				},
				content: function () {
					player.storage.hyunshen++;
					player.markSkill("hyunshen");
				},
				ai: {
					effect: {
						target_use(card, player, target) {
							if (get.tag(card, "respondShan")) {
								var shans = target.countCards("h", "shan");
								var hs = target.countCards("h");
								if (shans > 1) return [1, 1];
								if (shans && hs > 2) return [1, 1];
								if (shans) return [1, 0.5];
								if (hs > 2) return [1, 0.3];
								if (hs > 1) return [1, 0.2];
								return [1.2, 0];
							}
						},
					},
					threaten: 0.8,
				},
				intro: {
					content: "mark",
				},
				group: "hyunshen2",
			},
			hyunshen2: {
				trigger: { player: "phaseBegin" },
				forced: true,
				filter: function (event, player) {
					return player.storage.hyunshen > 0;
				},
				content: function () {
					player.draw(player.storage.hyunshen);
					player.storage.hyunshen = 0;
					player.unmarkSkill("hyunshen");
				},
				mod: {
					globalTo: function (from, to, distance) {
						if (typeof to.storage.hyunshen == "number") return distance + to.storage.hyunshen;
					},
				},
			},
			hlingbo: {
				audio: ["lingbo", 2],
				trigger: { player: ["respond", "useCard"] },
				filter: function (event, player) {
					return event.card.name == "shan";
				},
				frequent: true,
				content: function () {
					player.draw(2);
				},
				ai: {
					mingzhi: false,
					useShan: true,
					effect: {
						target_use(card, player, target) {
							if (get.tag(card, "respondShan")) {
								var shans = target.countCards("h", "shan");
								var hs = target.countCards("h");
								if (shans > 1) return [0, 1];
								if (shans && hs > 2) return [0, 1];
								if (shans) return [0, 0];
								if (hs > 2) return [0, 0];
								if (hs > 1) return [1, 0.5];
								return [1.5, 0];
							}
						},
					},
					threaten: 0.8,
				},
			},
			gtiandao: {
				audio: true,
				trigger: { global: "judge" },
				direct: true,
				filter: function (event, player) {
					return player.countCards("he") > 0;
				},
				content: function () {
					"step 0";
					player.chooseCard(
						get.translation(trigger.player) +
							"的" +
							(trigger.judgestr || "") +
							"判定为" +
							get.translation(trigger.player.judging[0]) +
							"，" +
							get.prompt("gtiandao"),
						"he"
					).ai = function (card) {
						var trigger = _status.event.parent._trigger;
						var player = _status.event.player;
						var result = trigger.judge(card) - trigger.judge(trigger.player.judging[0]);
						var attitude = get.attitude(player, trigger.player);
						if (attitude == 0 || result == 0) return 0;
						if (attitude > 0) {
							return result;
						} else {
							return -result;
						}
					};
					"step 1";
					if (result.bool) {
						player.respond(result.cards, "highlight");
					} else {
						event.finish();
					}
					"step 2";
					if (result.bool) {
						player.logSkill("gtiandao");
						player.$gain2(trigger.player.judging[0]);
						player.gain(trigger.player.judging[0]);
						trigger.player.judging[0] = result.cards[0];
						trigger.position.appendChild(result.cards[0]);
						game.log(trigger.player, "的判定牌改为", result.cards[0]);
					}
					"step 3";
					game.delay(2);
				},
				ai: {
					tag: {
						rejudge: 1,
					},
					threaten: 1.5,
				},
			},
			jinlin: {
				enable: "phaseUse",
				unique: true,
				mark: true,
				skillAnimation: true,
				animationColor: "metal",
				init: function (player) {
					player.storage.jinlin = false;
				},
				filter: function (event, player) {
					if (player.storage.jinlin) return false;
					return true;
				},
				filterTarget: true,
				selectTarget: [1, Infinity],
				contentBefore: function () {
					player.awakenSkill("jinlin");
					player.storage.jinlin = true;
				},
				content: function () {
					target.changeHujia(3);
					target.addSkill("jinlin2");
					target.storage.jinlin2 = 3;
				},
				ai: {
					order: 1,
					result: {
						target: function (player, target) {
							if (player.hp == 1) return 1;
							var num = 0;
							var players = game.filterPlayer();
							for (var i = 0; i < players.length; i++) {
								if (get.attitude(player, players[i]) > 2) {
									if (players[i].hp == 1) return 1;
									if (players[i].hp == 2) {
										if (players[i].countCards("h") == 0) return 1;
										num++;
									}
								}
							}
							if (player.hasUnknown()) return 0;
							if (num > 1) return 1;
							return 0;
						},
					},
				},
				intro: {
					content: "limited",
				},
			},
			jinlin2: {
				trigger: { player: "phaseBegin" },
				silent: true,
				content: function () {
					if (player.hujia > 0) {
						player.changeHujia(-1);
					}
					player.storage.jinlin2--;
					if (player.hujia == 0 || player.storage.jinlin2 == 0) {
						player.removeSkill("jinlin2");
						delete player.storage.jinlin2;
					}
				},
				ai: {
					threaten: 0.8,
				},
			},
			lingyue: {
				trigger: { player: "shaBegin" },
				check: function (event, player) {
					return get.attitude(player, event.target) < 0;
				},
				logTarget: "target",
				filter: function (event, player) {
					return event.target.countCards("he") > 0;
				},
				content: function () {
					trigger.target.chooseToDiscard("he", true);
				},
			},
			fengze: {
				enable: "phaseUse",
				filterCard: { color: "black" },
				selectCard: 1,
				position: "he",
				usable: 1,
				viewAs: { name: "taoyuan" },
				filter: function (event, player) {
					return player.countCards("he", { color: "black" }) > 0;
				},
				audio: true,
				prompt: "将一张黑色牌当作桃园结义使用",
				check: function (card) {
					return 7 - get.useful(card);
				},
				ai: {
					threaten: 1.5,
				},
			},
			huanxia: {
				enable: "chooseToUse",
				filterCard: function (card) {
					return get.color(card) == "red";
				},
				position: "he",
				viewAs: { name: "sha" },
				viewAsFilter: function (player) {
					if (!player.countCards("he", { color: "red" })) return false;
				},
				prompt: "将一张红色牌当杀使用",
				check: function (card) {
					return 5 - get.value(card);
				},
				ai: {
					order: function () {
						return get.order({ name: "sha" }) + 0.1;
					},
					respondSha: true,
					skillTagFilter: function (player, tag, arg) {
						if (arg != "use") return false;
						if (!player.countCards("he", { color: "red" })) return false;
					},
				},
				group: ["huanxia_expire", "huanxia_draw", "huanxia_gain"],
				subSkill: {
					expire: {
						trigger: { source: "damageAfter" },
						forced: true,
						popup: false,
						filter: function (event) {
							return event.parent.skill == "huanxia";
						},
						content: function () {
							player.storage.huanxia = true;
						},
					},
					draw: {
						trigger: { player: "shaAfter" },
						forced: true,
						popup: false,
						content: function () {
							if (trigger.parent.skill == "huanxia") {
								var card = trigger.cards[0];
								if (
									get.itemtype(card) == "card" &&
									get.position(card) == "d" &&
									!player.storage.huanxia
								) {
									ui.special.appendChild(card);
									if (!player.storage.huanxia_draw) {
										player.storage.huanxia_draw = [];
									}
									player.storage.huanxia_draw.push(card);
								}
							}
							delete player.storage.huanxia;
						},
					},
					gain: {
						trigger: { player: "phaseEnd" },
						forced: true,
						filter: function (event, player) {
							return player.storage.huanxia_draw;
						},
						content: function () {
							player.gain(player.storage.huanxia_draw, "gain2");
							delete player.storage.huanxia_draw;
						},
					},
				},
			},
			huajing: {
				trigger: { source: "damageEnd" },
				filter: function (event, player) {
					return event.card && get.type(event.card, "trick") == "trick";
				},
				frequent: true,
				content: function () {
					player.recover();
					player.draw();
				},
			},
			pingxu: {
				mod: {
					globalFrom: function (from, to, current) {
						if (!from.getEquip(1)) return current - 1;
					},
					globalTo: function (from, to, current) {
						if (!to.getEquip(2)) return current + 1;
					},
				},
			},
			jufu: {
				trigger: { source: "damageBegin" },
				filter: function (event, player) {
					if (event.card && event.card.name == "sha" && player.getEquip(1)) return true;
					return false;
				},
				forced: true,
				content: function () {
					trigger.num++;
				},
			},
			bingfeng: {
				skillAnimation: "epic",
				animationColor: "water",
				unique: true,
				enable: "phaseUse",
				filter: function (event, player) {
					return !player.storage.bingfeng;
				},
				init: function (player) {
					player.storage.bingfeng = false;
				},
				filterTarget: function (card, player, target) {
					return player != target && !target.isTurnedOver();
				},
				mark: true,
				multitarget: true,
				multiline: true,
				selectTarget: [1, 3],
				content: function () {
					"step 0";
					player.awakenSkill("bingfeng");
					player.removeSkill("xuanzhou");
					player.loseMaxHp();
					player.storage.bingfeng = true;
					event.num = 0;
					player.turnOver();
					player.addSkill("bingfeng2");
					"step 1";
					if (num < targets.length) {
						var target = targets[num];
						if (!target.isTurnedOver()) {
							target.turnOver();
						}
						target.addSkill("bingfeng2");
						event.num++;
						event.redo();
					}
				},
				intro: {
					content: "limited",
				},
				ai: {
					order: 1,
					result: {
						target: function (player, target) {
							if (target.hasSkillTag("noturn")) return 0;
							if (game.phaseNumber < game.players.length) return 0;
							if (game.phaseNumber < game.players.length * 2 && player.hp == player.maxHp)
								return 0;
							if (player.hasUnknown()) return 0;
							switch (lib.config.mode) {
								case "identity": {
									switch (player.identity) {
										case "zhu": {
											if (get.situation() >= 0) return 0;
											if (get.population("fan") < 3) return 0;
											return -1;
										}
										case "zhong": {
											if (get.population("fan") < 3) return 0;
											return -1;
										}
										case "nei":
											return 0;
										case "fan": {
											if (get.population("fan") == 0) return 0;
											if (get.population("zhong") < 2) return 0;
											return -1;
										}
									}
									break;
								}
								case "guozhan": {
									if (player.identity == "unknown") return 0;
									return get.population(player.identity) >= 3 ? -1 : 0;
								}
								default: {
									return -1;
								}
							}
						},
					},
				},
			},
			bingfeng2: {
				mark: true,
				marktext: "封",
				intro: {
					content: "不能使用或打出手牌"
				},
				mod: {
					cardEnabled2: function (card) {
						if (get.position(card) == "h") return false;
					},
				},
				trigger: { player: "turnOverAfter" },
				forced: true,
				filter: function (event, player) {
					return !player.isTurnedOver();
				},
				content: function () {
					player.removeSkill("bingfeng2");
				},
			},
			yudun: {
				mod: {
					cardEnabled: function (card, player) {
						if (get.type(card, "trick") == "trick") return false;
					},
					cardRespondable: function (card, player) {
						if (get.type(card, "trick") == "trick") return false;
					},
					cardSavable: function (card, player) {
						if (get.type(card, "trick") == "trick") return false;
					},
				},
				enable: "chooseToUse",
				filterCard: function (card) {
					return get.type(card, "trick") == "trick";
				},
				selectCard: 2,
				viewAs: { name: "sha" },
				viewAsFilter: function (player) {
					if (player.countCards("h", { type: ["trick", "delay"] }) < 2) return false;
				},
				check: function () {
					return 1;
				},
				ai: {
					skillTagFilter: function (player, tag, arg) {
						if (arg != "use") return false;
						if (player.countCards("h", { type: ["trick", "delay"] }) < 2) return false;
					},
					respondSha: true,
					order: function () {
						return get.order({ name: "sha" }) + 0.1;
					},
					useful: -1,
					value: -1,
				},
				group: "yudun_count",
				subSkill: {
					count: {
						trigger: { player: "useCard" },
						forced: true,
						popup: false,
						filter: function (event, player) {
							return event.skill == "yudun" && _status.currentPhase == player;
						},
						content: function () {
							player.getStat().card.sha--;
						},
					},
				},
			},
			guozao: {
				trigger: { global: "damageEnd" },
				forced: true,
				logv: false,
				// alter:true,
				check: function (event, player) {
					return game.hasPlayer(function (current) {
						return get.attitude(player, current) > 2 && current.countCards("h") == 1;
					});
				},
				filter: function (event, player) {
					if (event.source == player) return false;
					if (get.distance(player, event.player) > 1) return false;
					return game.hasPlayer(function (current) {
						return current.countCards("h");
					});
				},
				content: function () {
					"step 0";
					var cards = [];
					if (ui.cardPile.childNodes.length < 3) {
						var discardcards = get.cards(3);
						for (var i = 0; i < discardcards.length; i++) {
							discardcards[i].discard();
						}
					}
					for (var i = 0; i < 3; i++) {
						cards.push(ui.cardPile.childNodes[i]);
					}
					event.cards = cards;
					var dialog = ui.create.dialog("聒噪：选择一个目标将手牌替换", cards, "hidden");
					dialog.classList.add("noselect");
					var dist = 2;
					if (get.is.altered("guozao")) {
						dist = 1;
					}
					var next = (player.chooseTarget(true, dialog, function (card, player, target) {
						return target.countCards("h") > 0 && get.distance(player, target) <= dist;
					}).ai = function (target) {
						var att = get.attitude(player, target);
						var hs = target.getCards("h");
						var num = hs.length;
						if (num <= 1) return att * 2;
						if (num == 2) {
							for (var i = 0; i < cards.length; i++) {
								if (get.value(cards[i], target, "raw") > 6) return att;
							}
							if (target == player) {
								for (var i = 0; i < 2; i++) {
									if (get.value(cards[i], target, "raw") > 6) return -1;
								}
							}
							return att / 2;
						}
						if (num == 3) {
							if (target == player) {
								var num2 = 0;
								for (var i = 0; i < 3; i++) {
									num2 += get.value(cards[i], player, "raw");
									num2 -= get.value(hs[i], player, "raw");
								}
								if (num2 > 0) return 0.5;
								if (num2 < 0) return -0.5;
							}
							return 0;
						}
						return -att / 2;
					});
					"step 1";
					if (result.bool && result.targets[0]) {
						var target = result.targets[0];
						player.line(target, "green");
						// player.logSkill('guozao',target,'green',true);
						var cards = target.getCards("h");
						target.lose(cards)._triggered = null;
						game.log(target, "弃置了", cards, "，并获得三张牌");
						// target.$draw(3);
						target.$throw(cards);
						target.gain(event.cards, "draw")._triggered = null;
					} else {
						event.finish();
					}
				},
				ai: {
					expose: 0.1,
				},
			},
			heihuo: {
				enable: "phaseUse",
				filter: function (event, player) {
					return (
						player.countCards("h") > 0 &&
						player.countCards("he", { type: "equip" }) > 0 &&
						!player.hasSkill("heihuo2")
					);
				},
				filterCard: function (card) {
					return get.type(card) == "equip";
				},
				position: "he",
				check: function (card) {
					var player = _status.currentPhase;
					var nh = player.countCards("h");
					var pos = get.position(card);
					if (nh < 2) return 0;
					if (nh > 4) return 0;
					if (nh == 4 && pos == "e") return 0;
					if (player.countCards("he", { subtype: get.subtype(card) }) > 1) {
						return 11 - get.equipValue(card) + (pos == "e" ? 0.4 : 0);
					}
					return 5.5 - get.value(card) + (pos == "e" ? 0.4 : 0);
				},
				content: function () {
					"step 0";
					player.draw(player.countCards("h"));
					"step 1";
					if (player.countCards("h") >= 8) {
						player.damage(3, "fire");
						player.addTempSkill("heihuo2");
					}
				},
				ai: {
					order: 10,
					threaten: 1.4,
					result: {
						player: 1,
					},
				},
			},
			heihuo2: {},
			yaotong: {
				// alter:true,
				group: ["yaotong1", "yaotong2", "yaotong3"],
				ai: {
					respondSha: true,
					respondShan: true,
					skillTagFilter: function (player, tag) {
						if (tag == "respondShan" && get.is.altered("yaotong")) return false;
						if (player.countCards("h") % 2 == 0) return false;
					},
				},
				threaten: 1.3,
			},
			yaotong1: {
				enable: ["chooseToRespond", "chooseToUse"],
				filterCard: true,
				viewAs: { name: "sha" },
				filter: function (event, player) {
					var num = player.countCards("h");
					if (num == 0) return false;
					return num % 2 == 1;
				},
				prompt: "将一张手牌当作杀使用或打出",
				check: function (card) {
					return 6 - get.value(card);
				},
			},
			yaotong2: {
				enable: ["chooseToRespond", "chooseToUse"],
				filterCard: true,
				viewAs: { name: "shan" },
				filter: function (event, player) {
					if (get.is.altered("yaotong")) return false;
					var num = player.countCards("h");
					if (num == 0) return false;
					return num % 2 == 1;
				},
				prompt: "将一张手牌当作闪使用或打出",
				check: function (card) {
					return 6 - get.value(card);
				},
			},
			yaotong3: {
				enable: "chooseToUse",
				filterCard: true,
				viewAs: { name: "wuxie" },
				filter: function (event, player) {
					var num = player.countCards("h");
					if (num == 0) return false;
					return num % 2 == 0;
				},
				viewAsFilter: function (player) {
					var num = player.countCards("h");
					if (num == 0) return false;
					return num % 2 == 0;
				},
				prompt: "将一张手牌当作无懈可击使用",
				check: function (card) {
					return 7 - get.value(card);
				},
			},
			yaotong4: {
				enable: "chooseToUse",
				filterCard: true,
				viewAs: { name: "tao" },
				filter: function (event, player) {
					var num = player.countCards("h");
					if (num == 0) return false;
					return num % 2 == 0;
				},
				viewAsFilter: function (player) {
					var num = player.countCards("h");
					if (num == 0) return false;
					return num % 2 == 0;
				},
				prompt: "将一张手牌当作桃使用",
				check: function (card) {
					return 9 - get.value(card);
				},
			},
			pojian: {
				trigger: { player: "loseEnd" },
				filter: function (event, player) {
					if (player.countCards("h")) return false;
					for (var i = 0; i < event.cards.length; i++) {
						if (event.cards[i].original == "h") return true;
					}
					return false;
				},
				content: function () {
					for (var i = 0; i < ui.cardPile.childNodes.length; i++) {
						if (get.type(ui.cardPile.childNodes[i]) == "equip") {
							player.equip(ui.cardPile.childNodes[i]);
							player.$gain2(ui.cardPile.childNodes[i]);
							game.delay();
							event.finish();
							return;
						}
					}
					for (var i = 0; i < ui.discardPile.childNodes.length; i++) {
						if (get.type(ui.discardPile.childNodes[i]) == "equip") {
							player.equip(ui.discardPile.childNodes[i]);
							player.$gain2(ui.discardPile.childNodes[i]);
							game.delay();
							event.finish();
							return;
						}
					}
				},
			},
			huajin: {
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					return player.countCards("he") > 0;
				},
				filterCard: true,
				position: "he",
				content: function () {
					player.addSkill("huajin2");
				},
				check: function (card) {
					return 5 - get.value(card);
				},
				ai: {
					order: 10,
					result: {
						player: function (player) {
							if (player.countCards("h", "juedou")) return 1;
							if (player.countCards("h", "sha") == 0) return 0;
							var players = game.filterPlayer();
							for (var i = 0; i < players.length; i++) {
								if (
									player.canUse("sha", players[i]) &&
									get.effect(players[i], { name: "sha" }, player, player) > 0
								) {
									return 1;
								}
							}
							return 0;
						},
					},
				},
			},
			huajin2: {
				trigger: { source: "damageBegin" },
				forced: true,
				content: function () {
					trigger.num++;
				},
				group: "huajin3",
			},
			huajin3: {
				trigger: { player: "phaseBegin" },
				forced: true,
				popup: false,
				content: function () {
					player.removeSkill("huajin2");
				},
			},
			yuchen: {
				trigger: { player: ["useCard", "respondAfter"] },
				direct: true,
				filter: function (event, player) {
					if (player == _status.currentPhase) return false;
					if (event.cards) {
						for (var i = 0; i < event.cards.length; i++) {
							if (get.color(event.cards[i]) == "black") return true;
						}
					}
					return false;
				},
				content: function () {
					"step 0";
					player
						.chooseTarget(get.prompt("yuchen"), function (card, player, target) {
							return player != target && target.countCards("he") > 0;
						})
						.set("autodelay", trigger.name == "respond" ? 0.5 : 1).ai = function (target) {
						return -get.attitude(player, target);
					};
					"step 1";
					if (result.bool) {
						player.logSkill("yuchen", result.targets);
						player.discardPlayerCard(result.targets[0], true);
					}
				},
				ai: {
					threaten: 0.7,
				},
			},
			bingjian: {
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					return player.countCards("he", { color: "black", name: "sha" }) > 0;
				},
				filterCard: function (card) {
					return card.name == "sha" && get.color(card) == "black";
				},
				filterTarget: function (card, player, target) {
					return player != target && target.countCards("h") > 0;
				},
				line: "thunder",
				content: function () {
					"step 0";
					target.showHandcards();
					"step 1";
					var cards = target.getCards("h", "shan");
					if (cards.length) {
						target.discard(cards);
					} else {
						target.damage("thunder");
					}
				},
				ai: {
					order: 5,
					result: {
						target: function (player, target) {
							return get.damageEffect(target, player, target, "thunder");
						},
					},
					expose: 0.2,
				},
			},
			rumeng: {
				trigger: { global: "phaseUseBefore" },
				direct: true,
				filter: function (event, player) {
					return (
						event.player != player &&
						player.countCards("he", { type: "basic" }) < player.countCards("he")
					);
				},
				content: function () {
					"step 0";
					var yep = get.attitude(player, trigger.player) < 0 && trigger.player.countCards("h") > 2;
					var next = player.chooseToDiscard(
						function (card) {
							return get.type(card) != "basic";
						},
						get.prompt("rumeng", trigger.player),
						"he"
					);
					next.logSkill = ["rumeng", trigger.player];
					next.ai = function (card) {
						if (yep) {
							return 6 - get.value(card);
						}
						return 0;
					};
					"step 1";
					if (result.bool) {
						trigger.player.chooseToDiscard(
							{ type: "basic" },
							"入梦：弃置一张基本牌或跳过出牌及弃牌阶段"
						).ai = function (card) {
							return 5 - get.value(card);
						};
					} else {
						event.finish();
					}
					"step 2";
					if (!result.bool) {
						trigger.cancel();
						trigger.player.skip("phaseDiscard");
					}
				},
				ai: {
					expose: 0.1,
				},
			},
			lianda: {
				trigger: { player: "shaAfter" },
				direct: true,
				filter: function (event, player) {
					return (
						event.target.isAlive() && player.countCards("he") > 0 && !player.hasSkill("lianda2")
					);
				},
				content: function () {
					"step 0";
					var next = player.chooseToDiscard("he", get.prompt("lianda"));
					next.ai = function (card) {
						if (get.effect(trigger.target, { name: "sha" }, player, player) > 0) {
							return 7 - get.value(card);
						}
						return 0;
					};
					next.logSkill = "lianda";
					"step 1";
					if (result.bool) {
						player.addTempSkill("lianda2");
						player.useCard({ name: "sha" }, trigger.target);
					}
				},
			},
			lianda2: {},
			huiqi: {
				trigger: { player: "damageEnd" },
				direct: true,
				filter: function (event, player) {
					return player.hp < player.maxHp;
				},
				content: function () {
					"step 0";
					player.chooseTarget(get.prompt("huiqi"), function (card, player, target) {
						return player != target;
					}).ai = function (target) {
						var att = get.attitude(player, target);
						if (player.hp <= 0) {
							if (player == target) {
								return 1;
							}
							if (att > 3) {
								return att + Math.max(0, 5 - target.countCards("h"));
							}
							return att / 4;
						}
						if (att > 3) {
							return att + Math.max(0, 5 - target.countCards("h"));
						}
						return att;
					};
					"step 1";
					if (result.bool) {
						player.logSkill("huiqi", result.targets);
						result.targets[0].draw(player.maxHp - player.hp);
					}
				},
				ai: {
					expose: 0.2,
					effect: {
						target: function (card, player, target) {
							if (get.tag(card, "damage")) {
								return [1, 0.5];
							}
						},
					},
				},
			},
			xianghui: {
				enable: "phaseUse",
				usable: 1,
				filterCard: { color: "red" },
				filter: function (event, player) {
					if (!player.countCards("h", { color: "red" })) return false;
					var players = game.filterPlayer();
					var min = players[0].hp;
					for (var i = 0; i < players.length; i++) {
						min = Math.min(min, players[i].hp);
					}
					for (var i = 0; i < players.length; i++) {
						if (players[i].hp == min && players[i].isDamaged()) return true;
					}
					return false;
				},
				prompt: function () {
					var players = game.filterPlayer();
					var targets = [];
					var min = players[0].hp;
					for (var i = 0; i < players.length; i++) {
						min = Math.min(min, players[i].hp);
					}
					for (var i = 0; i < players.length; i++) {
						if (players[i].hp == min && players[i].hp < players[i].maxHp) {
							targets.push(players[i]);
						}
					}
					return "令" + get.translation(targets) + "回复1点体力";
				},
				check: function (card) {
					return 8 - get.value(card);
				},
				filterTarget: function (card, player, target) {
					return target.isDamaged() && target.isMinHp();
				},
				selectTarget: -1,
				content: function () {
					target.recover();
				},
				ai: {
					expose: 0.1,
					order: 9,
					threaten: 1.4,
					result: {
						player: function (player, target) {
							var players = game.filterPlayer();
							var num = 0;
							var min = players[0].hp;
							for (var i = 0; i < players.length; i++) {
								min = Math.min(min, players[i].hp);
							}
							for (var i = 0; i < players.length; i++) {
								if (players[i].hp == min && players[i].hp < players[i].maxHp) {
									num += get.recoverEffect(players[i], player, player);
								}
							}
							return num;
						},
					},
				},
			},
			fzhenwei: {
				trigger: { global: "respondEnd" },
				filter: function (event, player) {
					if (_status.currentPhase != player) return false;
					if (event.player == player) return false;
					if (event.cards) {
						for (var i = 0; i < event.cards.length; i++) {
							if (get.position(event.cards[i]) == "d") return true;
						}
					}
					return false;
				},
				direct: true,
				content: function () {
					"step 0";
					var cards = trigger.cards.slice(0);
					for (var i = 0; i < cards.length; i++) {
						if (get.position(cards[i]) != "d") {
							cards.splice(i--, 1);
						}
					}
					event.cards = cards;
					player
						.chooseTarget(get.prompt("fzhenwei"), function (card, player, target) {
							return target != trigger.player;
						})
						.set("autodelay", 0.5).ai = function (target) {
						var att = get.attitude(player, target);
						if (att <= 0) return 0;
						if (att > 3) {
							return 100 - target.countCards("h");
						}
						return att;
					};
					"step 1";
					if (result.bool) {
						player.logSkill("fzhenwei", result.targets);
						result.targets[0].gain(event.cards, "gain2", "log");
					}
				},
				ai: {
					expose: 0.1,
					threaten: 1.6,
				},
			},
			shangxi: {
				trigger: { player: "phaseUseBegin" },
				direct: true,
				filter: function (event, player) {
					if (player.countCards("he") == 0) return false;
					return game.hasPlayer(function (current) {
						return (
							current != player &&
							get.distance(player, current, "attack") <= 1 &&
							player.hp <= current.hp
						);
					});
				},
				content: function () {
					"step 0";
					var next = player.chooseCardTarget({
						position: "he",
						filterTarget: function (card, player, target) {
							return (
								get.distance(player, target, "attack") <= 1 &&
								player != target &&
								player.hp <= target.hp
							);
						},
						filterCard: lib.filter.cardDiscardable,
						ai1: function (card) {
							return 9 - get.value(card);
						},
						ai2: function (target) {
							return get.damageEffect(target, player, player);
						},
						prompt: get.prompt("shangxi"),
					});
					"step 1";
					if (result.bool) {
						player.discard(result.cards);
						player.logSkill("shangxi", result.targets);
						result.targets[0].damage();
					}
				},
				ai: {
					expose: 0.3,
				},
			},
			fuyan: {
				trigger: { player: "damageEnd" },
				direct: true,
				filter: function (event) {
					return event.num > 0;
				},
				content: function () {
					"step 0";
					player.chooseTarget(get.prompt("fuyan"), function (card, player, target) {
						return !target.hujia;
					}).ai = function (target) {
						if (get.attitude(player, target) <= 0) return 0;
						var eff = -get.damageEffect(target, target, player) + (player == target ? 2 : 0);
						if (target.hp == 1) eff += 2;
						return Math.min(1, eff);
					};
					"step 1";
					if (result.bool) {
						player.logSkill("fuyan", result.targets);
						var target = result.targets[0];
						target.changeHujia();
					}
				},
				ai: {
					effect: {
						target: function (card, player, target) {
							if (get.tag(card, "damage")) {
								if (player.hasSkillTag("jueqing", false, target)) return [1, -2];
								return 0.7;
							}
						},
					},
					expose: 0.2,
				},
			},
			fuyan2: {
				trigger: { player: "damageBegin" },
				filter: function (event, player) {
					return event.num > 0;
				},
				forced: true,
				mark: "card",
				content: function () {
					trigger.num--;
					player.removeSkill("fuyan2");
					player.storage.fuyan2.discard();
					delete player.storage.fuyan2;
				},
				intro: {
					content: "card",
				},
			},
			guaili: {
				trigger: { source: "damageBegin" },
				filter: function (event) {
					return (
						event.card &&
						event.card.name == "sha" &&
						event.parent.name != "_lianhuan" &&
						event.parent.name != "_lianhuan2"
					);
				},
				forced: true,
				content: function () {
					trigger.num++;
					player.addSkill("guaili2");
				},
			},
			guaili2: {
				trigger: { source: "damageEnd" },
				forced: true,
				popup: false,
				content: function () {
					player.removeSkill("guaili2");
					player.chooseToDiscard(2, true);
				},
			},
			xingzhui: {
				enable: "phaseUse",
				usable: 1,
				filterCard: true,
				position: "he",
				filterTarget: function (card, player, target) {
					return player != target && target.countCards("he") > 0;
				},
				check: function (card) {
					if (get.type(card) == "equip") {
						var distance = get.info(card).distance;
						if (distance) {
							if (distance.attackFrom < 0 || distance.globalFrom < 0) return 10;
						}
					}
					return 7 - get.value(card);
				},
				content: function () {
					"step 0";
					event.type = get.type(cards[0], "trick");
					var dme = get.damageEffect(target, player, target);
					target.chooseToDiscard(
						"he",
						function (card) {
							return get.type(card, "trick") == event.type;
						},
						"弃置一张牌" + get.translation(event.type) + "牌，或受到1点伤害"
					).ai = function (card) {
						if (dme < 0) {
							return 8 - get.value(card);
						}
						return 0;
					};
					"step 1";
					if (!result.bool) {
						target.damage();
					}
				},
				ai: {
					order: 9,
					result: {
						target: function (player, target) {
							return get.damageEffect(target, player);
						},
					},
					threaten: 2,
					expose: 0.2,
				},
			},
			lingxian: {
				trigger: { player: ["respond", "useCard"] },
				direct: true,
				filter: function (event, player) {
					if (player == _status.currentPhase) return false;
					if (get.itemtype(event.cards) != "cards") return false;
					return game.hasPlayer(function (current) {
						return get.distance(player, current, "attack") > 1 && player != current;
					});
				},
				content: function () {
					"step 0";
					player.chooseTarget(get.prompt("lingxian"), function (card, player, target) {
						return get.distance(player, target, "attack") > 1 && player != target;
					}).ai = function (target) {
						var att = get.attitude(player, target);
						if (att <= -0.5) return 0;
						if (att <= 3) return att + 0.5;
						return att + Math.min(0.5, 5 - target.countCards("h"));
					};
					"step 1";
					if (result.bool) {
						game.asyncDraw([player, result.targets[0]]);
						player.logSkill("lingxian", result.targets);
					}
				},
				ai: {
					mingzhi: false,
					effect: {
						target_use(card, player, target) {
							if (player == _status.currentPhase) return;
							if (
								!game.hasPlayer(function (current) {
									return (
										get.distance(player, current, "attack") > 1 &&
										player != current &&
										get.attitude(player, current) >= 0
									);
								})
							) {
								return;
							}
							if (get.type(card) == "equip" && player == target) {
								var distance = get.info(card).distance;
								if (distance) {
									if (distance.attackFrom < 0 || distance.globalFrom < 0) return 0;
								}
							} else {
								if (!target.hasFriend()) return;
								var hs = target.countCards("h");
								if (get.tag(card, "respondShan")) {
									var shans = target.countCards("h", "shan");
									if (shans > 1) return [0, 1];
									if (shans && hs > 2) return [0, 1];
									if (shans) return [0, 0];
									if (hs > 2) return [0, 0];
									if (hs > 1) return [1, 0.5];
									return [1.5, 0];
								}
								if (get.tag(card, "respondSha")) {
									var shas = target.countCards("h", "sha");
									if (shas > 1) return [0, 1];
									if (shas && hs > 2) return [0, 1];
									if (shas) return [0, 0];
									if (hs > 2) return [0, 0];
									if (hs > 1) return [1, 0.5];
									return [1.5, 0];
								}
							}
						},
					},
					threaten: 0.8,
					expose: 0.1,
				},
			},
			shouyin: {
				skillAnimation: "epic",
				animationColor: "water",
				unique: true,
				enable: "chooseToUse",
				init: function (player) {
					player.storage.shouyin = false;
				},
				mark: true,
				filter: function (event, player) {
					if (event.type != "dying") return false;
					if (player.storage.shouyin) return false;
					if (player.isTurnedOver()) return false;
					return true;
				},
				content: function () {
					"step 0";
					player.awakenSkill("shouyin");
					player.storage.shouyin = true;
					player.turnOver();
					"step 1";
					event.targets = game.filterPlayer();
					event.targets.sort(lib.sort.seat);
					"step 2";
					if (event.targets.length) {
						var target = event.targets.shift();
						if (target.hp < target.maxHp) {
							var num = target.maxHp - target.hp;
							if (get.is.altered("shouyin")) num = Math.min(2, num);
							target.recover(num);
							player.line(target, "green");
						}
						event.redo();
					}
				},
				// alter:true,
				ai: {
					skillTagFilter: function (player) {
						if (player.storage.shouyin) return false;
					},
					expose: 0.3,
					save: true,
					result: {
						player: function (player) {
							if (
								_status.event.dying != player &&
								get.attitude(player, _status.event.dying) <= 0
							) {
								return 0;
							}
							var num = 0;
							var players = game.filterPlayer();
							for (var i = 0; i < players.length; i++) {
								var del = players[i].maxHp - players[i].hp;
								if (get.is.altered("shouyin")) del = Math.min(2, del);
								del /= Math.pow(1 + players[i].hp, 0.2);
								num += get.sgnAttitude(player, players[i]) * del;
							}
							return num;
						},
					},
				},
				intro: {
					content: "limited",
				},
			},
			sliufeng: {
				mod: {
					targetInRange: function (card, player, target) {
						if (card.name == "sha" && player.hp >= target.hp) {
							return true;
						}
					},
				},
			},
			linyun: {
				enable: "chooseToUse",
				filterCard: true,
				selectCard: 2,
				position: "he",
				viewAs: { name: "sha" },
				prompt: "将两张牌当杀使用",
				check: function (card) {
					if (_status.event.player.countCards("h") < 4) return 6 - get.useful(card);
					return 7 - get.useful(card);
				},
				ai: {
					order: function () {
						return get.order({ name: "sha" }) + 0.1;
					},
				},
				group: ["linyun2"],
			},
			linyun2: {
				trigger: { player: "shaBegin" },
				filter: function (event) {
					return event.skill == "linyun";
				},
				forced: true,
				popup: false,
				content: function () {
					"step 0";
					var next = trigger.target.chooseToRespond({ name: "shan" });
					next.autochoose = lib.filter.autoRespondShan;
					next.ai = function (card) {
						if (trigger.target.countCards("h", "shan") > 1) {
							return get.unuseful2(card);
						}
						return -1;
					};
					"step 1";
					if (result.bool == false) {
						trigger.untrigger();
						trigger.directHit = true;
					}
				},
				ai: {
					threaten: 1.3,
				},
			},
			linyun3: {
				trigger: { source: "damageAfter" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return event.parent.skill == "linyun" && !player.hasSkill("linyun4");
				},
				content: function () {
					player.draw();
					player.addTempSkill("linyun4", "shaAfter");
				},
			},
			linyun4: {},
			hutian: {
				trigger: { player: "phaseEnd" },
				direct: true,
				filter: function (event, player) {
					return player.countCards("h") > 0 && !player.storage.hutian;
				},
				content: function () {
					"step 0";
					var next = player.chooseCardTarget({
						filterTarget: function (card, player, target) {
							return target.maxHp >= ui.selected.cards.length;
						},
						filterCard: true,
						selectCard: [1, player.countCards("he")],
						ai1: function (card) {
							var useful = get.useful(card);
							if (card.name == "du") {
								useful = -5;
							}
							if (ui.selected.cards.length == 0 && player.hp == 1) return 11 - useful;
							if (ui.selected.cards.length > 1) return 0;
							return 7 - useful;
						},
						ai2: function (target) {
							if (target.hp > ui.selected.cards.length) {
								return 0;
							}
							return get.attitude(player, target);
						},
						position: "he",
						prompt: get.prompt("hutian"),
					});
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						event.target = target;
						player.$give(result.cards, target);
						player.lose(result.cards, ui.special);
						player.storage.hutian = target;
						player.logSkill("hutian", result.targets);
						player.addTempSkill("hutian4");
						target.addSkill("hutian2");
						target.storage.hutian2 = result.cards;
						game.addVideo("storage", target, ["hutian2", get.cardsInfo(result.cards), "cards"]);
					} else {
						event.finish();
					}
					"step 2";
					var target = event.target;
					if (target.storage.hutian2 && target.hp < target.storage.hutian2.length) {
						target.recover(target.storage.hutian2.length - target.hp);
					}
				},
				ai: {
					expose: 0.2,
					threaten: 1.5,
				},
				group: "hutian3",
			},
			hutian2: {
				trigger: { player: ["damageBegin", "loseHpBegin"] },
				forced: true,
				priority: -55,
				mark: true,
				filter: function (event, player) {
					return player.hp - event.num < player.storage.hutian2.length;
				},
				content: function () {
					trigger.num = player.hp - player.storage.hutian2.length;
				},
				intro: {
					content: "cards",
				},
				ai: {
					effect: {
						target: function (card, player, target) {
							if (get.tag(card, "damage") || get.tag(card, "loseHp")) {
								if (target.hp <= target.storage.hutian2.length) return 0;
							}
						},
					},
				},
			},
			hutian3: {
				trigger: { player: ["phaseEnd", "dieBegin"] },
				forced: true,
				filter: function (event, player) {
					if (player.hasSkill("hutian4")) return false;
					return player.storage.hutian ? true : false;
				},
				priority: -1,
				content: function () {
					var target = player.storage.hutian;
					target.gain(target.storage.hutian2, "gain2");
					delete target.storage.hutian2;
					delete player.storage.hutian;
					target.removeSkill("hutian2");
				},
			},
			hutian4: {},
			chengjian: {
				trigger: { global: "damageEnd" },
				check: function (event, player) {
					return get.attitude(player, event.source) > 0;
				},
				filter: function (event, player) {
					return event.source && event.card && event.card.name == "sha" && event.source != player;
				},
				logTarget: "source",
				content: function () {
					trigger.source.draw();
				},
				ai: {
					expose: 0.1,
					threaten: 1.2,
				},
			},
			huanxing: {
				trigger: { player: "phaseBegin" },
				group: "huanxing2",
				direct: true,
				content: function () {
					"step 0";
					if (player.countCards("he")) {
						player.chooseCardTarget({
							prompt: get.prompt("huanxing"),
							filterCard: lib.filter.cardDiscardable,
							position: "he",
							filterTarget: function (card, player, target) {
								if (target == player) return false;
								if (target.sex != "male") return false;
								var name = target.name.indexOf("unknown") == 0 ? target.name2 : target.name;
								if (name == player.storage.huanxing) return false;
								var info = lib.character[name];
								if (info) {
									var skills = info[3];
									for (var j = 0; j < skills.length; j++) {
										if (
											lib.translate[skills[j] + "_info"] &&
											lib.skill[skills[j]] &&
											!lib.skill[skills[j]].unique &&
											!player.hasSkill(skills[j])
										) {
											return true;
										}
									}
								}
								return false;
							},
							ai1: function (card) {
								if (
									player.additionalSkills.huanxing &&
									player.additionalSkills.huanxing.length > 0
								)
									return 0;
								return 7 - get.value(card);
							},
							ai2: function (target) {
								if (target.isMin()) return 0;
								return 6 - target.maxHp;
							},
						});
					} else {
						event.finish();
					}
					"step 1";
					if (result.bool) {
						player.unmark(player.storage.huanxing + "_charactermark");
						player.discard(result.cards);
						player.logSkill("huanxing", result.targets);
						var name = result.targets[0].name;
						if (name.indexOf("unknown") == 0) {
							name = result.targets[0].name2;
						}
						var list = [];
						var skills = lib.character[name][3];
						for (var j = 0; j < skills.length; j++) {
							if (
								lib.translate[skills[j] + "_info"] &&
								lib.skill[skills[j]] &&
								!lib.skill[skills[j]].unique &&
								!player.hasSkill(skills[j])
							) {
								list.push(skills[j]);
							}
						}
						player.addAdditionalSkill("huanxing", list);
						player.markCharacter(name, null, true, true);
						game.addVideo("markCharacter", player, {
							name: "幻形",
							content: "",
							id: "huanxing",
							target: name,
						});
						player.storage.huanxing = name;
					}
				},
				ai: {
					threaten: 1.5,
				},
			},
			huanxing2: {
				trigger: { player: "damageAfter" },
				priority: -15,
				forced: true,
				filter: function (event, player) {
					return player.additionalSkills.huanxing && player.additionalSkills.huanxing.length > 0;
				},
				content: function () {
					player.unmark(player.storage.huanxing + "_charactermark");
					player.removeAdditionalSkill("huanxing");
					delete player.storage.huanxing;
					player.checkMarks();
				},
			},
			guiying: {
				enable: "chooseToUse",
				filterCard: { color: "black" },
				position: "he",
				viewAs: { name: "toulianghuanzhu" },
				prompt: "将一张黑色牌当作偷梁换柱使用",
				check: function (card) {
					if (_status.event.player.countCards("h") > _status.event.player.hp) {
						return 5 - get.value(card);
					}
					return 0;
				},
			},
			suiyan: {
				trigger: { source: "damageEnd" },
				direct: true,
				filter: function (event, player) {
					if (event._notrigger.includes(event.player)) return false;
					return event.player.countCards("e");
				},
				content: function () {
					"step 0";
					var att = get.attitude(player, trigger.player);
					var next = player.chooseToDiscard("he", get.prompt("suiyan"));
					next.ai = function (card) {
						if (att < 0) return 7 - get.value(card);
						return -1;
					};
					next.logSkill = ["suiyan", trigger.player];
					"step 1";
					if (result.bool) {
						trigger.player.discard(trigger.player.getCards("e"));
					}
				},
				ai: {
					expose: 0.3,
				},
			},
			ningxian: {
				trigger: { player: "damageEnd" },
				direct: true,
				filter: function (event, player) {
					return player.countCards("he", { color: "black" }) > 0;
				},
				content: function () {
					"step 0";
					var enemy = game.countPlayer(function (current) {
						return current != player && get.damageEffect(current, player, player) > 0;
					});
					var next = player.chooseCardTarget({
						position: "he",
						filterTarget: function (card, player, target) {
							return player != target;
						},
						selectCard: [1, player.countCards("he", { color: "black" })],
						selectTarget: function () {
							if (ui.selected.targets.length > ui.selected.cards.length) {
								game.uncheck("target");
							}
							return ui.selected.cards.length;
						},
						filterCard: function (card, player) {
							return get.color(card) == "black" && lib.filter.cardDiscardable(card, player);
						},
						ai1: function (card) {
							if (ui.selected.cards.length >= enemy) return 0;
							return 9 - get.value(card);
						},
						ai2: function (target) {
							return get.damageEffect(target, player, player);
						},
						prompt: get.prompt("ningxian"),
					});
					"step 1";
					if (result.bool) {
						player.discard(result.cards);
						player.logSkill("ningxian", result.targets);
						event.targets = result.targets;
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
				ai: {
					maixie: true,
					maixie_hp: true,
					effect: {
						target(card, player, target) {
							if (get.tag(card, "damage")) {
								if (player.hasSkillTag("jueqing", false, target)) return [1, -0.5];
								if (!target.hasFriend()) {
									if (get.mode() == "guozhan") {
										if (!player.hasFriend()) return;
									} else {
										return;
									}
								}
								if (target.countCards("h") > 2 || target.countCards("e", { color: "black" })) {
									return [1, 0, 0, -1];
								}
								return [1, -0.5];
							}
						},
					}
				},
			},
			xuanyuan: {
				trigger: { player: "phaseEnd" },
				unique: true,
				forceunique: true,
				direct: true,
				filter: function (event, player) {
					if (!player.countCards("he", { suit: "spade" })) return false;
					for (var i = 0; i < ui.discardPile.childElementCount; i++) {
						if (ui.discardPile.childNodes[i].name == "xuanyuanjian") return true;
					}
					return false;
				},
				content: function () {
					"step 0";
					player
						.chooseToDiscard("he", { suit: "spade" }, get.prompt2("xuanyuan"))
						.set("ai", function (card) {
							return 8 - get.value(card);
						});
					"step 1";
					var card;
					for (var i = 0; i < ui.discardPile.childElementCount; i++) {
						if (ui.discardPile.childNodes[i].name == "xuanyuanjian") {
							card = ui.discardPile.childNodes[i];
							break;
						}
					}
					if (card) {
						player.equip(card, true);
					}
				},
				global: "xuanyuan_ai",
			},
			xuanyuan_ai: {
				ai: {
					effect: {
						player: function (card, player) {
							if (player.hasSkill("xuanyuan")) return;
							if (
								card.name == "xuanyuanjian" &&
								game.hasPlayer(function (current) {
									return current.hasSkill("xuanyuan") && get.attitude(player, current) <= 0;
								})
							) {
								return [0, 0, 0, 0];
							}
						},
					},
				},
			},
			jilve: {
				enable: "phaseUse",
				usable: 3,
				// alter:true,
				onChooseToUse: function (event) {
					var cards = [];
					var num = 3;
					if (get.is.altered("jilve")) {
						num = 2;
					}
					if (ui.cardPile.childNodes.length < num) {
						var discardcards = get.cards(num);
						for (var i = 0; i < discardcards.length; i++) {
							discardcards[i].discard();
						}
					}
					for (var i = 0; i < num; i++) {
						cards.push(ui.cardPile.childNodes[i]);
					}
					event.set("jilvecards", cards);
				},
				chooseButton: {
					dialog: function (event, player) {
						return ui.create.dialog("极略：选择一张基本牌或锦囊牌使用", event.jilvecards);
					},
					filter: function (button, player) {
						var evt = _status.event.getParent();
						if (evt && evt.filterCard) {
							var type = get.type(button.link, "trick");
							return (type != "equip") & evt.filterCard(button.link, player, evt);
						}
						return false;
					},
					check: function (button) {
						if (button.link.name == "du") return 0;
						return 1;
					},
					backup: function (links, player) {
						return {
							filterCard: function () {
								return false;
							},
							selectCard: -1,
							viewAs: links[0],
						};
					},
					prompt: function (links, player) {
						return "选择" + get.translation(links) + "的目标";
					},
				},
				ai: {
					order: 12,
					result: {
						player: 1,
					},
					threaten: 1.7,
				},
			},
			jilve6: {
				trigger: { player: "useCardBefore" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return event.skill == "jilve2";
				},
				content: function () {
					player.getStat("skill").jilve++;
				},
			},
			jilve2: {
				filterCard: function () {
					return false;
				},
				selectCard: -1,
			},
			jilve3: {},
			jilve4: {
				trigger: { player: "useCard" },
				forced: true,
				popup: false,
				filter: function (event) {
					return event.skill == "jilve2";
				},
				content: function () {
					player.storage.jilve++;
				},
			},
			jilve5: {
				trigger: { player: "phaseUseBegin" },
				forced: true,
				popup: false,
				content: function () {
					player.storage.jilve = 0;
				},
			},
			pozhou: {
				unique: true,
				trigger: { player: "damageEnd" },
				forced: true,
				init: function (player) {
					player.storage.pozhou = 0;
				},
				content: function () {
					if (typeof trigger.num == "number") {
						player.storage.pozhou += trigger.num;
					}
					if (player.storage.pozhou) {
						player.markSkill("pozhou");
					}
					game.addVideo("storage", player, ["pozhou", player.storage.pozhou]);
				},
				intro: {
					content: "mark",
				},
				group: "pozhou2",
				ai: {
					maixie: true,
					maixie_hp: true,
					effect: {
						target: function (card, player, target) {
							if (get.tag(card, "damage")) {
								if (player.hasSkillTag("jueqing", false, target)) return [1, -1.5];
								if (player.hp >= 4) return [1, 1.5];
								if (target.hp == 3) return [1, 1];
								if (target.hp == 2) return [1, 0.5];
							}
						},
					},
				},
			},
			pozhou2: {
				enable: "phaseUse",
				filter: function (event, player) {
					return player.storage.pozhou > 0;
				},
				filterTarget: function (card, player, target) {
					return target != player && !target.hasSkill("fengyin");
				},
				selectTarget: function () {
					return [1, _status.event.player.storage.pozhou];
				},
				prompt: "出牌阶段，你可以指定任意名其他角色并弃置等量的破咒标记，令目标的非锁定技失效直到其下一回合结束",
				content: function () {
					player.storage.pozhou--;
					if (!player.storage.pozhou) {
						player.unmarkSkill("pozhou");
					} else {
						player.updateMarks();
					}
					target.addTempSkill("fengyin", { player: "phaseAfter" });
				},
				ai: {
					order: 11,
					result: {
						target: function (player, target) {
							var skills = target.getSkills();
							for (var i = 0; i < skills.length; i++) {
								if (!get.is.locked(skills[i])) {
									if (target.hasSkillTag("maixie")) return -2;
									return -get.threaten(target);
								}
							}
							return 0;
						},
					},
				},
			},
			duanyue: {
				enable: "phaseUse",
				usable: 1,
				position: "he",
				filterCard: { type: "equip" },
				check: function (card) {
					var player = _status.currentPhase;
					if (player.countCards("he", { subtype: get.subtype(card) }) > 1) {
						return 12 - get.equipValue(card);
					}
					return 8 - get.equipValue(card);
				},
				filter: function (event, player) {
					return player.countCards("he", { type: "equip" });
				},
				filterTarget: function (card, player, target) {
					return player != target;
				},
				content: function () {
					target.damage();
				},
				ai: {
					order: 9.5,
					expose: 0.2,
					result: {
						player: function (player, target) {
							return get.damageEffect(target, player, player);
						},
					},
				},
			},
			tuzhen: {
				trigger: { source: "damageAfter" },
				filter: function (event, player) {
					return (
						event.player.isIn() &&
						event.player != player &&
						event.player.hasCard(function (card) {
							return get.type(card) != "basic";
						})
					);
				},
				// alter:true,
				logTarget: "player",
				check: function (event, player) {
					return get.attitude(player, event.player) < 0;
				},
				content: function () {
					var hs = trigger.player.getCards("h", function (card) {
						return get.type(card) != "basic";
					});
					if (get.is.altered("tuzhen")) {
						hs = hs.randomGet();
					}
					trigger.player.discard(hs);
				},
			},
			mojian: {
				trigger: { player: "shaBegin" },
				check: function (event, player) {
					if (get.attitude(player, event.target) > 0) return true;
					return player.hp < player.maxHp;
				},
				logTarget: "target",
				content: function () {
					"step 0";
					trigger.target.draw();
					"step 1";
					player.recover();
				},
			},
			swdliuhong: {
				trigger: { player: ["useCard"] },
				frequent: true,
				filter: function (event) {
					return event.card && event.card.name == "sha";
				},
				content: function () {
					player.draw();
				},
			},
			poyue: {
				mod: {
					targetInRange: function (card, player) {
						if (card.name == "sha" && get.color(card) == "black") return true;
					},
					cardUsable: function (card) {
						if (get.is.altered("poyue")) return;
						if (card.name == "sha" && get.color(card) == "red") return Infinity;
					},
				},
				// alter:true,
				trigger: { player: "useCard" },
				filter: function (event, player) {
					if (get.is.altered("poyue")) return false;
					return event.card.name == "sha" && get.color(event.card) == "red";
				},
				forced: true,
				content: function () {
					if (player.stat[player.stat.length - 1].card.sha > 0) {
						player.stat[player.stat.length - 1].card.sha--;
					}
				},
				group: "poyue2",
			},
			poyue2: {
				trigger: { player: "shaBegin" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return event.card && get.color(event.card) == "red";
				},
				content: function () {
					trigger.directHit = true;
				},
			},
			jianji: {
				enable: "phaseUse",
				filter: function (event, player) {
					return (
						player.countCards("he", { type: "equip" }) > 0 &&
						lib.filter.cardEnabled({ name: "sha" }, player)
					);
				},
				usable: 1,
				filterCard: { type: "equip" },
				position: "he",
				check: function (card) {
					var player = _status.currentPhase;
					if (player.countCards("he", { subtype: get.subtype(card) }) > 1) {
						return 11 - get.equipValue(card);
					}
					return 6 - get.equipValue(card);
				},
				discard: false,
				prepare: "throw",
				delay: false,
				filterTarget: function (card, player, target) {
					return lib.filter.targetEnabled({ name: "sha" }, player, target);
				},
				content: function () {
					"step 0";
					player.addAdditionalSkill("jianji", "unequip");
					player.draw();
					player.useCard({ name: "sha" }, cards, targets, false).animate = false;
					player.line(targets, "fire");
					"step 1";
					player.removeAdditionalSkill("jianji");
				},
				ai: {
					order: function () {
						return get.order({ name: "sha" }) + 0.1;
					},
					result: {
						target: function (player, target) {
							player.addAdditionalSkill("jianji_ai", "unequip");
							var eff = get.effect(target, { name: "sha" }, player, target);
							player.removeAdditionalSkill("jianji_ai");
							return eff;
						},
					},
					effect: {
						player_use: function (card, player) {
							if (_status.currentPhase != player) return;
							if (
								get.type(card) == "equip" &&
								player.countCards("e", { subtype: get.subtype(card) }) &&
								lib.filter.filterCard({ name: "sha" }, player)
							) {
								return 0;
							}
						},
					},
					threaten: 1.3,
				},
			},
			huangyu: {
				enable: "phaseUse",
				filter: function (event, player) {
					if (!lib.card.chiyuxi) return false;
					return !player.getStat("skill").huangyu && player.countCards("he", { color: "red" }) > 1;
				},
				filterCard: { color: "red" },
				selectCard: 2,
				position: "he",
				viewAs: { name: "chiyuxi", nature: "fire" },
				check: function (card) {
					var player = _status.event.player;
					if (
						player.hasSkill("jianji") &&
						get.type(card) == "equip" &&
						lib.filter.filterCard({ name: "sha" }, player)
					) {
						return 0;
					}
					return 6 - get.value(card);
				},
				ai: {
					order: 8,
					expose: 0.2,
					threaten: 1.2,
				},
			},
			gongshen: {
				trigger: { global: "useCard" },
				priority: 15,
				filter: function (event, player) {
					var type = get.type(event.card, "trick");
					if (type != "basic" && type != "trick") return false;
					return (
						event.player != player &&
						player.countCards("he", { type: "equip" }) > 0 &&
						event.targets &&
						event.targets.length > 0
					);
				},
				direct: true,
				content: function () {
					"step 0";
					var effect = 0;
					for (var i = 0; i < trigger.targets.length; i++) {
						effect += get.effect(trigger.targets[i], trigger.card, trigger.player, player);
					}
					var str = "弃置一张装备牌令" + get.translation(trigger.player);
					if (trigger.targets && trigger.targets.length) {
						str += "对" + get.translation(trigger.targets);
					}
					str += "的" + get.translation(trigger.card) + "失效";
					var next = player.chooseToDiscard("he", { type: "equip" }, get.prompt("gongshen"));
					next.prompt2 = str;
					next.logSkill = ["gongshen", trigger.player];
					next.autodelay = true;
					next.ai = function (card) {
						if (effect < 0) {
							var val = 9 - get.value(card);
							var nme = trigger.card.name;
							if (get.value(trigger.card) >= 7 && get.type(trigger.card) == "trick") return val;
							if (nme == "tao") return val;
							if (nme == "wuzhong") return val;
							if (nme == "zengbin") return val;
							if (nme == "wangmeizhike") return val;
							if (nme == "shunshou" && player == trigger.targets[0]) return val;
							if (nme == "guohe" && player == trigger.targets[0]) return val;
							if (nme == "liuxinghuoyu") return val;
							if (nme == "nanman") return val;
							if (nme == "wanjian") return val;
							if (nme == "jingleishan") return val;
							if (nme == "chiyuxi") return val;
							if (
								nme == "juedou" &&
								(player == trigger.targets[0] || trigger.targets[0].hp == 1)
							)
								return val;
							if (nme == "chenhuodajie") return val;
							if (nme == "lebu" && trigger.targets[0].countCards("h") > trigger.targets[0].hp)
								return val;
							if (nme == "sha" && trigger.targets[0].hp == 1 && !trigger.targets[0].hasShan())
								return val;
							if (nme == "jiedao" && trigger.targets[0] == player) return val;
							if (nme == "yihuajiemu" && trigger.targets[0] == player) return val;
							if (nme == "shuiyanqijun" && trigger.targets.includes(player)) return val;
							return 0;
						}
						return -1;
					};
					"step 1";
					if (result.bool) {
						// game.delay(2);
						trigger.cancel();
					}
				},
				ai: {
					effect: {
						player_use(card, player, target) {
							if (player != target) return;
							if (get.type(card) == "equip" && !player.needsToDiscard()) {
								return [0, 0, 0, 0];
							}
						},
					},
					threaten: 2,
					expose: 0.3,
				},
			},
			dangping: {
				trigger: { source: "damageAfter" },
				direct: true,
				filter: function (event, player) {
					return (
						event.parent.name != "dangping" &&
						!player.hasSkill("dangping2") &&
						player.countCards("he") > 0
					);
				},
				content: function () {
					"step 0";
					var next = player.chooseCardTarget({
						position: "he",
						filterTarget: function (card, player, target) {
							return (
								player != target &&
								trigger.player != target &&
								get.distance(trigger.player, target) <= 1
							);
						},
						filterCard: lib.filter.cardDiscardable,
						ai1: function (card) {
							return get.unuseful(card) + 9;
						},
						ai2: function (target) {
							return get.damageEffect(target, player, player);
						},
						prompt: get.prompt("dangping"),
					});
					"step 1";
					if (result.bool) {
						player.discard(result.cards);
						player.logSkill("dangping", result.targets);
						player.addTempSkill("dangping2");
					}
					"step 2";
					if (result.bool) {
						result.targets[0].damage();
					}
				},
			},
			dangping2: {},
			duishi: {
				enable: "phaseUse",
				filter: function (event, player) {
					return player.countCards("h") > 0 && !player.hasSkill("duishi2");
				},
				filterTarget: function (card, player, target) {
					return player != target && target.countCards("h") > 0 && !target.hasSkill("duishi3");
				},
				filterCard: true,
				check: function (card) {
					return 8 - get.value(card);
				},
				content: function () {
					"step 0";
					var suit = get.suit(cards[0]);
					target.chooseToDiscard(
						{ suit: suit },
						"h",
						"对诗：弃置一张" +
							get.translation(suit) +
							"牌，或令" +
							get.translation(player) +
							"获得你一张牌"
					).ai = function (card) {
						if (get.attitude(target, player) > 0) return 0;
						return 9 - get.value(card);
					};
					"step 1";
					if (result.bool) {
						target.addTempSkill("duishi3");
					} else {
						player.gainPlayerCard(target, "he", true);
						player.addTempSkill("duishi2");
					}
				},
				ai: {
					order: 9,
					threaten: 1.5,
					result: {
						target: -2,
						player: 0.5,
					},
					expose: 0.2,
				},
			},
			duishi2: {},
			duishi3: {},
			lianwu: {
				mod: {
					selectTarget: function (card, player, range) {
						if (card.name == "sha" && range[1] != -1) range[1]++;
					},
				},
				trigger: { player: "shaBegin" },
				forced: true,
				filter: function (event, player) {
					return event.card && get.color(event.card) == "red";
				},
				content: function () {
					trigger.directHit = true;
				},
			},
			mingfu: {
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					return player.countCards("he", { suit: "club" }) > 0;
				},
				position: "he",
				filterCard: { suit: "club" },
				discard: false,
				prepare: "throw",
				filterTarget: function (card, player, target) {
					return lib.filter.targetEnabled({ name: "guiyoujie" }, player, target);
				},
				check: function (card) {
					if (card.name == "du") return 20;
					return Math.max(7 - get.value(card), 7 - get.useful(card));
				},
				content: function () {
					target.addJudge("guiyoujie", cards);
				},
				ai: {
					result: {
						target: function (player, target) {
							return get.effect(target, { name: "guiyoujie" }, player, target);
						},
					},
					order: 8,
				},
			},
			mufeng: {
				trigger: { player: "phaseEnd" },
				frequent: true,
				filter: function (event, player) {
					return player.hasSkill("mufeng_used");
				},
				content: function () {
					player.discoverCard();
				},
				subSkill: {
					used: {},
					count: {
						trigger: { player: "useCard" },
						silent: true,
						filter: function (event, player) {
							return _status.currentPhase == player && get.type(event.card) == "basic";
						},
						content: function () {
							player.addTempSkill("mufeng_used");
						},
					},
				},
				group: "mufeng_count",
			},
			jiying: {
				mod: {
					targetInRange: function (card) {
						if (card.name == "sha") return true;
					},
				},
			},
			minjing: {
				trigger: { player: "damageBegin" },
				forced: true,
				filter: function (event, player) {
					if (player.getEquip(2)) return false;
					return lib.skill.guangshatianyi.filter(event, player);
				},
				content: function () {
					trigger.num--;
				},
				ai: {
					threaten: 0.8,
				},
			},
			touxi: {
				trigger: { global: "phaseEnd" },
				check: function (event, player) {
					if (get.damageEffect(event.player, player, player, "thunder") > 0) {
						if (
							get.is.altered("touxi") &&
							get.attitude(player, event.player) < 0 &&
							player.countCards("he")
						) {
							if (event.player.hp == 1 && player.hp > 1) {
								return true;
							}
						} else {
							return true;
						}
					}
					return false;
				},
				// alter:true,
				filter: function (event, player) {
					return event.player != player && !player.hasSkill("touxi2") && event.player.isAlive();
				},
				logTarget: "player",
				content: function () {
					"step 0";
					player.judge(function (card) {
						if (get.color(card) == "black") return 1;
						return -1;
					});
					"step 1";
					if (result.bool) {
						trigger.player.damage("thunder");
						player.addSkill("touxi2");
						event.finish();
					} else {
						if (player.countCards("he")) {
							var att = get.attitude(trigger.player, player);
							trigger.player[get.is.altered("touxi") ? "gainPlayerCard" : "discardPlayerCard"](
								player,
								"he",
								function (button) {
									if (att > 0) return 0;
									return get.buttonValue(button);
								}
							);
						}
					}
				},
				ai: {
					expose: 0.3,
					threaten: 1.2,
				},
			},
			touxi2: {
				trigger: { player: "phaseBegin" },
				forced: true,
				popup: false,
				content: function () {
					player.removeSkill("touxi2");
				},
			},
			nlianji: {
				audio: "lianji",
				enable: "phaseUse",
				usable: 1,
				filterTarget: function (card, player, target) {
					if (player == target) return false;
					if (!ui.selected.targets.length) return target.countCards("h") > 0;
					return ui.selected.targets[0].canCompare(target);
				},
				selectTarget: 2,
				multitarget: true,
				multiline: true,
				filter: function (event, player) {
					return player.countCards("h") > 0;
				},
				prepare: "throw",
				discard: false,
				filterCard: true,
				check: function (card) {
					return 6 - get.value(card);
				},
				content: function () {
					"step 0";
					if (targets[0].canCompare(targets[1])) {
						targets[0].chooseToCompare(targets[1]);
					} else {
						event.finish();
					}
					"step 1";
					if (result.bool) {
						targets[0].gain(cards, "log");
						targets[0].$gain2(cards);
						targets[1].damage(targets[0]);
					} else if (!result.tie) {
						targets[1].gain(cards, "log");
						targets[1].$gain2(cards);
						targets[0].damage(targets[1]);
					}
				},
				ai: {
					expose: 0.3,
					threaten: 2,
					order: 9,
					result: {
						target: -1,
					},
				},
			},
			lianji2: {
				group: ["lianji3", "lianji4"],
			},
			lianji3: {
				trigger: { player: "shaHit" },
				forced: true,
				popup: false,
				content: function () {
					player.storage.lianji2 = true;
				},
			},
			lianji4: {
				trigger: { player: "shaAfter" },
				forced: true,
				popup: false,
				content: function () {
					if (!player.storage.lianji2) {
						player.damage("thunder", player.storage.lianji);
					}
					delete player.storage.lianji;
					delete player.storage.lianji2;
					player.removeSkill("lianji2");
				},
			},
			miedao: {
				group: ["miedao1", "miedao2"],
				ai: {
					threaten: 1.4,
				},
			},
			miedao1: {
				trigger: { player: "phaseDrawBegin" },
				forced: true,
				filter: function (event, player) {
					return player.hp < player.maxHp;
				},
				content: function () {
					trigger.num += player.maxHp - player.hp;
				},
			},
			miedao2: {
				trigger: { player: "phaseDiscardBegin" },
				forced: true,
				filter: function (event, player) {
					return player.hp < player.maxHp;
				},
				content: function () {
					player.chooseToDiscard(player.maxHp - player.hp, "he", true);
				},
			},
			aojian: {
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					return player.hp < player.maxHp;
				},
				filterTarget: function (card, player, target) {
					return player != target && get.distance(player, target, "attack") <= 1;
				},
				selectTarget: function () {
					return ui.selected.cards.length;
				},
				selectCard: function () {
					var player = _status.currentPhase;
					return [1, Math.min(game.players.length - 1, player.maxHp - player.hp)];
				},
				filterCard: true,
				check: function (card) {
					if (ui.selected.cards.length == 0) {
						return 8 - get.value(card);
					}
					return 5 - get.value(card);
				},
				content: function () {
					"step 0";
					target.damage();
					"step 1";
					// target.draw();
				},
				ai: {
					order: 9,
					result: {
						target: function (player, target) {
							return get.damageEffect(target, player, target);
						},
					},
					threaten: function (player, target) {
						if (target.hp == 1) return 2;
						if (target.hp == 2) return 1.5;
						return 0.5;
					},
					maixie: true,
					effect: {
						target: function (card, player, target) {
							if (get.tag(card, "damage")) {
								if (target.hp == target.maxHp) return [0, 1];
							}
							if (get.tag(card, "recover") && player.hp >= player.maxHp - 1) return [0, 0];
						},
					},
				},
			},
			moyan: {
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					return player.hp < player.maxHp && player.countCards("h", { color: "red" }) > 0;
				},
				filterTarget: function (card, player, target) {
					return player != target; //&&get.distance(player,target,'attack')<=1;
				},
				selectTarget: function () {
					return ui.selected.cards.length;
				},
				selectCard: function () {
					var player = _status.currentPhase;
					return [1, Math.min(game.players.length - 1, player.maxHp - player.hp)];
				},
				filterCard: function (card) {
					return get.color(card) == "red";
				},
				check: function (card) {
					if (ui.selected.cards.length == 0) {
						return 8 - get.value(card);
					}
					return 6 - get.value(card);
				},
				line: "fire",
				content: function () {
					"step 0";
					target.damage("fire");
					"step 1";
					// target.draw();
				},
				ai: {
					order: 9,
					result: {
						target: function (player, target) {
							return get.damageEffect(target, player, target, "fire");
						},
					},
					threaten: function (player, target) {
						if (target.hp == 1) return 2;
						if (target.hp == 2) return 1.5;
						return 0.5;
					},
					maixie: true,
					effect: {
						target: function (card, player, target) {
							if (get.tag(card, "damage")) {
								if (target.hp == target.maxHp) return [0, 1];
							}
							if (get.tag(card, "recover") && player.hp >= player.maxHp - 1) return [0, 0];
						},
					},
				},
			},
			shejie: {
				trigger: { player: "damageEnd" },
				priority: 9,
				check: function (event, player) {
					return get.attitude(player, event.source) < 0;
				},
				filter: function (event) {
					return event && event.source;
				},
				content: function () {
					trigger.source.addSkill("shejie2");
				},
				ai: {
					threaten: 0.4,
				},
			},
			shejie2: {
				mark: true,
				marktext: "界",
				intro: {
					content: "不能使用或打出手牌直到下一回合开始"
				},
				trigger: { player: "phaseBegin" },
				forced: true,
				priority: 10,
				mod: {
					cardEnabled2: function (card) {
						if (get.position(card) == "h") return false;
					},
				},
				content: function () {
					player.removeSkill("shejie2");
				},
			},
			guiyin: {
				trigger: { player: "phaseDiscardEnd" },
				frequent: true,
				filter: function (event, player) {
					return event.cards && event.cards.length > 1;
				},
				content: function () {
					player.draw(2);
				},
			},
			wangchen: {
				trigger: { player: "phaseDiscardEnd" },
				direct: true,
				filter: function (event, player) {
					if (event.cards) {
						// if(!get.is.altered('wangchen')) return true;
						for (var i = 0; i < event.cards.length; i++) {
							if (get.type(event.cards[i]) == "basic") return true;
						}
					}
					return false;
				},
				// alter:true,
				content: function () {
					"step 0";
					player.chooseTarget(get.prompt("wangchen"), function (card, player, target) {
						return target != player;
					}).ai = function (target) {
						// if(get.is.altered('wangchen')){
						// 	return -get.attitude(player,target)/Math.sqrt(target.hp);
						// }
						if (target.hasSkillTag("noturn")) return 0;
						return get.attitude(player, target) * (target.isTurnedOver() ? 1 : -1);
						// return -get.attitude(player,target)*get.threaten(target,player);
					};
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill("wangchen", target);
						// target.out('wangchen');
						// if(!player.storage.wangchen){
						//     player.storage.wangchen=[];
						// }
						// player.storage.wangchen.push(target);
						target.turnOver();
						if (get.is.altered("wangchen")) {
							target.changeHujia();
						}
					}
				},
				// group:'wangchen_in',
				// onremove:function(player){
				//     for(var i=0;i<player.storage.wangchen.length;i++){
				//         player.storage.wangchen[i].in('wangchen');
				//     }
				//     delete player.storage.wangchen;
				// },
				// subSkill:{
				//     in:{
				//         trigger:{player:['phaseBegin','dieBegin']},
				//         direct:true,
				//         filter:function(event,player){
				//             return Array.isArray(player.storage.wangchen);
				//         },
				//         content:function(){
				//             for(var i=0;i<player.storage.wangchen.length;i++){
				//                 player.storage.wangchen[i].in('wangchen');
				//             }
				//         }
				//     }
				// },
				ai: {
					expose: 0.5,
					threaten: 2,
				},
			},
			wangchen2: {
				trigger: { player: "phaseBefore" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					var prev = player.previous;
					if (prev.storage.wangchen == prev) {
						return true;
					}
				},
				content: function () {
					player.previous.out();
				},
			},
			wangchen3: {
				trigger: { player: "dieBegin" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return player.storage.wangchen && player.storage.wangchen.isOut();
				},
				content: function () {
					player.storage.wangchen.out();
				},
			},
			yihua: {
				trigger: { target: "useCardToBefore" },
				popup: false,
				direct: true,
				filter: function (event, player) {
					if (event.addedTargets) return false;
					// return event.card&&get.color(event.card)=='red'&&event.player!=player;
					return event.targets.length == 1 && event.player != player && player.countCards("h") >= 2;
				},
				content: function () {
					"step 0";
					var next = player.chooseToDiscard(get.prompt("yihua", trigger.player), 2);
					next.ai = function (card) {
						if (get.effect(player, trigger.card) < 0) {
							if (card.name == "liuxinghuoyu") return 7 - get.value(card);
							return 5 - get.value(card);
						}
						return 0;
					};
					next.prompt2 =
						"反弹" + get.translation(trigger.player) + "的" + get.translation(trigger.card);
					next.logSkill = ["yihua", trigger.player];
					"step 1";
					if (result.bool) {
						// player.discard(result.cards);
						trigger.target = trigger.player;
						trigger.player = player;
						trigger.untrigger();
						trigger.trigger("useCardToBefore");
					}
					// "step 2"
					// if(result.bool){
					// 	trigger.target=result.targets[0];
					// 	trigger.untrigger;
					// 	trigger.trigger('shaBefore');
					// 	game.delay();
					// }
				},
				ai: {
					threaten: function (player, target) {
						if (target.countCards("h") <= 2) {
							return 2;
						}
						return 2 / (target.countCards("h") - 1);
					},
				},
			},
			youyin: {
				trigger: { global: "discardAfter" },
				filter: function (event, player) {
					if (event.player == player) return false;
					if (player.countCards("h") >= 5) return false;
					for (var i = 0; i < event.cards.length; i++) {
						if (get.type(event.cards[i]) != "basic") {
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
					player.draw();
				},
			},
			anlianying: {
				trigger: { player: "loseEnd" },
				frequent: true,
				filter: function (event, player) {
					if (player.countCards("h")) return false;
					for (var i = 0; i < event.cards.length; i++) {
						if (event.cards[i].original == "h") return true;
					}
					return false;
				},
				content: function () {
					player.draw(2);
				},
				ai: {
					effect: {
						target: function (card) {
							if (card.name == "guohe" || card.name == "liuxinghuoyu") return 0.5;
						},
					},
					noh: true,
				},
			},
			zhanlu: {
				enable: "phaseUse",
				filterCard: function (card) {
					var suit = get.suit(card);
					return suit == "spade";
				},
				position: "he",
				usable: 1,
				filter: function (event, player) {
					return player.countCards("he", { suit: "spade" }) > 0;
				},
				check: function (card) {
					return 10 - get.value(card);
				},
				filterTarget: function (card, player, target) {
					if (target.hp >= target.maxHp) return false;
					return true;
				},
				selectTarget: [1, 3],
				content: function () {
					target.recover();
				},
				ai: {
					order: 10,
					result: {
						target: function (player, target) {
							if (player == target && player.countCards("h") > player.hp) return 20;
							return get.recoverEffect(target, player, target);
						},
					},
					threaten: 2,
				},
			},
			huopu: {
				enable: "phaseUse",
				usable: 1,
				position: "he",
				filterCard: function (card) {
					return get.suit(card) == "heart";
				},
				viewAs: { name: "liuxinghuoyu" },
				viewAsFilter: function (player) {
					if (!player.countCards("he", { suit: "heart" })) return false;
				},
				prompt: "将一张红桃手牌当作流星火羽使用",
				check: function (card) {
					return 6 - get.value(card);
				},
				ai: {
					threaten: 1.4,
					order: 9,
				},
			},
			rexue: {
				trigger: { global: "phaseBegin" },
				direct: true,
				filter: function (event, player) {
					return (
						lib.filter.targetEnabled({ name: "sha" }, player, event.player) &&
						player.hasSha(null, true)
					);
				},
				content: function () {
					var next = player.chooseToUse(
						{ name: "sha" },
						"热血：是否对" + get.translation(trigger.player) + "使用一张杀",
						trigger.player,
						-1
					);
					next.logSkill = "rexue";
					next.oncard = function () {
						player.draw();
					};
				},
			},
			shengshou: {
				enable: "phaseUse",
				filterCard: function (card) {
					return get.color(card) == "black";
				},
				viewAs: { name: "caoyao" },
				prompt: "将一张黑色手牌当作草药使用",
				check: function (card) {
					return 6 - get.value(card);
				},
				ai: {
					threaten: 1.6,
				},
			},
			huanjian: {
				enable: "phaseUse",
				filterCard: function (card) {
					return get.color(card) == "black";
				},
				viewAs: { name: "bingpotong" },
				position: "he",
				filter: function (event, player) {
					return player.countCards("h", { color: "black" }) > 0;
				},
				viewAsFilter: function (player) {
					if (!player.countCards("he", { color: "black" })) return false;
				},
				prompt: "将一张黑色牌当作冰魄针使用",
				check: function (card) {
					return 5 - get.value(card);
				},
				ai: {
					threaten: 1.1,
				},
			},
			moyu: {
				trigger: { source: "dieAfter" },
				filter: function (event, player) {
					return player.hp < player.maxHp;
				},
				frequent: true,
				content: function () {
					player.recover(player.maxHp - player.hp);
				},
				threaten: 1.2,
			},
			susheng: {
				trigger: { global: "dieBefore" },
				direct: true,
				// alter:true,
				filter: function (event, player) {
					if (player.hasSkill("susheng2")) return false;
					if (get.is.altered("susheng")) {
						return player.countCards("h", { color: "red" }) > 0;
					} else {
						return player.countCards("h") > 0;
					}
				},
				content: function () {
					"step 0";
					var att = get.attitude(player, trigger.player);
					var nh = player.countCards("h");
					var next;
					if (get.is.altered("susheng")) {
						next = player.chooseToDiscard(get.prompt("susheng", trigger.player), {
							color: "red",
						});
					} else {
						next = player.chooseToDiscard(get.prompt("susheng", trigger.player));
					}
					next.logSkill = ["susheng", trigger.player];
					next.ai = function (card) {
						if (att > 3 || (att > 1 && nh > 2)) {
							return get.unuseful2(card);
						}
						return 0;
					};
					"step 1";
					if (result.bool) {
						// player.chooseToDiscard('h',true);
						trigger.cancel();
						trigger.player.hp = 1;
						if (trigger.player.maxHp < 1) trigger.player.maxHp = 1;
						trigger.player.update();
						player.addTempSkill("susheng2");
					}
				},
				ai: {
					threaten: 2,
				},
			},
			susheng2: {},
			kunlunjing: {
				unique: true,
				// alter:true,
				group: ["kunlunjing1", "kunlunjing2"],
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
			},
			kunlunjing1: {
				trigger: { player: "phaseBegin" },
				priority: 10,
				filter: function (event, player) {
					if (!player.storage.kunlunjing) return false;
					return player.hp < player.storage.kunlunjing2;
				},
				onremove: ["kunlunjing", "kunlunjing2"],
				check: function (event, player) {
					if (get.is.altered("kunlunjing")) return false;
					var storage = player.storage.kunlunjing;
					var num = 0;
					for (var i = 0; i < storage.length; i++) {
						if (game.players.includes(storage[i].player)) {
							var att = get.attitude(player, storage[i].player);
							var num2 =
								storage[i].value -
								storage[i].player.countCards("he") +
								storage[i].player.countCards("j");
							if (att > 0) {
								num += num2;
							} else if (att < 0) {
								num -= num2;
							}
						}
					}
					return num > Math.min(2, game.players.length / 2);
				},
				content: function () {
					"step 0";
					game.delay(0.5);
					"step 1";
					game.animate.window(1);
					"step 2";
					var storage = event.player.storage.kunlunjing;
					for (var i = 0; i < storage.length; i++) {
						var player = storage[i].player;
						if (player.isAlive()) {
							var cards = player.getCards("hej");
							for (var j = 0; j < cards.length; j++) {
								cards[j].discard();
							}
							player.removeEquipTrigger();
						}
					}
					"step 3";
					var storage = event.player.storage.kunlunjing;
					var player;
					var i, j;
					for (i = 0; i < storage.length; i++) {
						player = storage[i].player;
						if (player.isAlive()) {
							for (j = 0; j < storage[i].handcards1.length; j++) {
								if (
									storage[i].handcards1[j].parentNode == ui.discardPile ||
									storage[i].handcards1[j].parentNode == ui.cardPile
								) {
									player.node.handcards1.appendChild(storage[i].handcards1[j]);
								} else {
									player.node.handcards1.appendChild(
										game.createCard(storage[i].handcards1[j])
									);
								}
							}
							for (j = 0; j < storage[i].handcards2.length; j++) {
								if (
									storage[i].handcards2[j].parentNode == ui.discardPile ||
									storage[i].handcards2[j].parentNode == ui.cardPile
								) {
									player.node.handcards2.appendChild(storage[i].handcards2[j]);
								} else {
									player.node.handcards2.appendChild(
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
									player.$equip(storage[i].equips[j]);
								} else {
									player.$equip(game.createCard(storage[i].equips[j]));
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
									player.node.judges.appendChild(storage[i].judges[j]);
								}
							}
							player.update();
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
					game.addVideo("skill", event.player, ["kunlunjing", data]);
					game.animate.window(2);
					ui.updatehl();
					"step 4";
					if (get.is.altered("kunlunjing")) {
						player.loseHp();
					}
				},
			},
			kunlunjing2: {
				trigger: { player: "phaseAfter" },
				silent: true,
				content: function () {
					var handcards1, handcards2, judges, equips, viewAs, i, j;
					player.storage.kunlunjing = [];
					player.storage.kunlunjing2 = player.hp;
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

						player.storage.kunlunjing.push({
							player: game.players[i],
							handcards1: handcards1,
							handcards2: handcards2,
							judges: judges,
							equips: equips,
							viewAs: viewAs,
							value: handcards1.length + handcards2.length + equips.length - judges.length,
						});
					}
				},
			},
			oldliaoyuan: {
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					return player.countCards("h") > 0;
				},
				filterTarget: function (card, player, target) {
					return player != target;
				},
				filterCard: function (card, player) {
					if (ui.selected.cards.length) {
						return get.suit(card) == get.suit(ui.selected.cards[0]);
					}
					var cards = player.getCards("h");
					for (var i = 0; i < cards.length; i++) {
						if (card != cards[i]) {
							if (get.suit(card) == get.suit(cards[i])) return true;
						}
					}
					return false;
				},
				prepare: "throw",
				// selectTarget:[1,2],
				selectCard: [2, 2],
				check: function (card) {
					return 6 - get.useful(card);
				},
				prompt: "弃置两张相同花色的手牌，选择一名角色弃置其一张牌，并视为对其使用一张火杀",
				content: function () {
					"step 0";
					if (target.countCards("he")) {
						player.discardPlayerCard(target, "he");
					}
					"step 1";
					player.useCard(
						{ name: "sha", nature: "fire" },
						target,
						false,
						"oldliaoyuan"
					).animate = false;
				},
				ai: {
					order: 3,
					result: {
						target: function (player, target) {
							return get.effect(target, { name: "sha", nature: "fire" }, player, target) - 1;
						},
					},
					expose: 0.2,
				},
			},
			oldliaoyuan2: {
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					return player.countCards("h") > 0;
				},
				filterTarget: function (card, player, target) {
					return player != target;
				},
				filterCard: function (card, player) {
					if (ui.selected.cards.length) {
						return get.suit(card) == get.suit(ui.selected.cards[0]);
					}
					var cards = player.getCards("h");
					for (var i = 0; i < cards.length; i++) {
						if (card != cards[i]) {
							if (get.suit(card) == get.suit(cards[i])) return true;
						}
					}
					return false;
				},
				delay: false,
				discard: false,
				selectCard: [2, 2],
				check: function (card) {
					return 7 - get.value(card);
				},
				content: function () {
					"step 0";
					player.useCard({ name: "sha" }, [cards[0]], target, false, "liaoyuan");
					"step 1";
					player.useCard({ name: "sha" }, [cards[1]], target, false, "liaoyuan");
				},
				ai: {
					order: 6,
					result: {
						target: function (player, target) {
							return get.effect(target, { name: "sha" }, player, target) * 2;
						},
					},
					expose: 0.2,
				},
			},
			shehun: {
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					return player.countCards("h") > 0;
				},
				filterTarget: function (card, player, target) {
					return player != target && target.countCards("he") > 0;
				},
				filterCard: function (card) {
					var suit = get.suit(card);
					for (var i = 0; i < ui.selected.cards.length; i++) {
						if (get.suit(ui.selected.cards[i]) == suit) return false;
					}
					return true;
				},
				complexCard: true,
				selectCard: [1, 4],
				check: function (card) {
					return 7 - get.value(card);
				},
				content: function () {
					"step 0";
					var suits = [];
					event.suits = suits;
					for (var i = 0; i < cards.length; i++) {
						suits.push(get.suit(cards[i]));
					}
					var hs = target.getCards("he");
					var hss = {
						club: [],
						diamond: [],
						spade: [],
						heart: [],
					};
					var choice = [];
					for (var i = 0; i < hs.length; i++) {
						var suity = get.suit(hs[i]);
						if (hss[suity]) {
							hss[suity].push(hs[i]);
						}
					}
					for (var i in hss) {
						if (!suits.includes(i)) {
							choice = choice.concat(hss[i]);
							delete hss[i];
						}
					}
					if (choice.length < cards.length) {
						choice.length = 0;
					}
					target.chooseToDiscard(cards.length, true, "he").ai = function (card) {
						var num = choice.includes(card) ? 20 : 0;
						return num - get.value(card);
					};
					"step 1";
					var damage = false;
					for (var i = 0; i < result.cards.length; i++) {
						if (event.suits.includes(get.suit(result.cards[i]))) {
							damage = true;
							break;
						}
					}
					if (damage) {
						target.damage();
					}
				},
				ai: {
					order: 6,
					result: {
						target: function (player, target) {
							var eff = get.damageEffect(target, player);
							var num = target.countCards("he");
							var length = ui.selected.cards.length;
							if (num == length) return -2 + eff;
							if (num > length) return -1.5 + eff;
							return -1 + eff;
						},
					},
					expose: 0.2,
				},
			},
			liaoyuan: {
				trigger: { player: "shaBegin" },
				direct: true,
				filter: function (event, player) {
					if (get.itemtype(event.cards) != "cards") return false;
					return player.countCards("he", { suit: get.suit(event.cards) }) > 0;
				},
				// alter:true,
				content: function () {
					"step 0";
					player.storage.liaoyuan = 0;
					event.num = 0;
					event.cards = [];
					"step 1";
					var suit = get.suit(trigger.cards);
					event.suit = suit;
					player.chooseCard("he", get.prompt("liaoyuan"), function (card, player) {
						return get.suit(card) == suit && lib.filter.cardDiscardable(card, player);
					}).ai = function (card) {
						if (get.attitude(player, trigger.target) >= 0) return 0;
						if (get.effect(trigger.target, { name: "sha" }, player, player) > 0) {
							return 7 - get.value(card);
						}
						return 0;
					};
					"step 2";
					if (result.bool) {
						if (event.num == 0) {
							player.logSkill("liaoyuan");
						}
						player.discard(result.cards);
						event.num++;
						if (
							player.countCards("he", { suit: event.suit }) > 1 &&
							!get.is.altered("liaoyuan")
						) {
							event.goto(1);
						}
					}
					"step 3";
					if (event.num) {
						var next = trigger.target.chooseToRespond({ name: "shan" }, "请打出一张闪响应燎原");
						next.ai = get.unuseful2;
						if (event.num > 1) next.set("prompt2", "共需额外打出" + event.num + "张闪");
					} else {
						event.finish();
					}
					"step 4";
					if (result.bool) {
						event.num--;
						event.goto(3);
					} else {
						trigger.untrigger();
						trigger.directHit = true;
						player.storage.liaoyuan = event.num;
					}
				},
				group: ["liaoyuan2", "liaoyuan3"],
			},
			liaoyuan2: {
				trigger: { source: "damageBegin" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return (
						event.card &&
						event.card.name == "sha" &&
						player.storage.liaoyuan > 0 &&
						event.parent.name != "_lianhuan" &&
						event.parent.name != "_lianhuan2"
					);
				},
				content: function () {
					trigger.num += player.storage.liaoyuan;
					player.storage.liaoyuan = 0;
				},
			},
			liaoyuan3: {
				trigger: { player: "shaEnd" },
				silent: true,
				content: function () {
					player.storage.liaoyuan = 0;
				},
			},
			dunxing: {
				direct: true,
				filter: function (event, player) {
					if (event.player == player) return false;
					return player.countCards("he") > 0;
				},
				trigger: { target: "useCardToBefore" },
				content: function () {
					"step 0";
					var next = player.chooseToDiscard("he", get.prompt(event.name));
					next.logSkill = event.name;
					next.ai = function (card) {
						if (get.tag(trigger.card, "multitarget") && !get.tag(card, "multineg")) return 0;
						if (get.value(trigger.card, trigger.player, "raw") < 5) return 0;
						if (get.tag(trigger.card, "respondSha") && player.hasSha()) return 0;
						if (get.tag(trigger.card, "respondShan") && player.hasShan()) return 0;
						if (get.effect(player, trigger.card, trigger.player, player) < 0) {
							return 7 - get.value(card);
						}
						return 0;
					};
					next.prompt2 =
						"弃置一张牌并进行一次判定，若结果不为红桃则" + get.translation(trigger.card) + "失效";
					"step 1";
					if (result.bool) {
						player.judge(function (card) {
							return get.suit(card) == "heart" ? -1 : 1;
						});
					} else {
						event.finish();
					}
					"step 2";
					if (result.suit != "heart") {
						trigger.cancel();
					}
				},
			},
			duanxing: {
				trigger: { player: "equipEnd" },
				direct: true,
				filter: function (event) {
					return lib.inpile.includes(event.card.name);
				},
				content: function () {
					"step 0";
					player.chooseTarget(get.prompt("duanxing"), function (card, player, target) {
						return lib.filter.targetEnabled({ name: "sha" }, player, target);
					}).ai = function (target) {
						return get.effect(target, { name: "sha" }, player);
					};
					"step 1";
					if (result.bool) {
						player.logSkill("duanxing");
						player.useCard({ name: "sha" }, result.targets, false);
					}
				},
				ai: {
					expose: 0.2,
				},
			},
			meihuo: {
				trigger: { player: ["loseEnd"] },
				direct: true,
				filter: function (event, player) {
					if (player.equiping) return false;
					if (player.countCards("e")) return false;
					for (var i = 0; i < event.cards.length; i++) {
						if (event.cards[i].original == "e") return true;
					}
					return false;
				},
				content: function () {
					"step 0";
					player.chooseTarget([1, 1], get.prompt("meihuo"), function (card, player, target) {
						if (player == target) return false;
						return target.countCards("he") > 0;
					}).ai = function (target) {
						var att = get.attitude(player, target);
						if (att <= 0) {
							return 1 - att + (target.countCards("e") ? 2 : 0);
						}
						return 0;
					};
					"step 1";
					if (result.bool) {
						event.target = result.targets[0];
						player.logSkill("meihuo", event.target);
						player.choosePlayerCard(event.target, "he", true).ai = function (button) {
							var card = button.link;
							if (get.position(card) == "e") return get.equipValue(card);
							return 5;
						};
					}
					"step 2";
					if (result.bool) {
						if (get.position(result.buttons[0].link) == "e") {
							player.equip(result.buttons[0].link);
						} else {
							player.gain(result.buttons[0].link, event.target);
						}
						event.target.$giveAuto(result.buttons[0].link, player);
					}
				},
			},
			yishan: {
				group: "yishan2",
				trigger: { player: "damageEnd" },
				filter: function (event, player) {
					var content = player.storage.yishan;
					for (var i = 0; i < content.length; i++) {
						if (get.owner(content[i]) != player && get.position(content[i]) != "s") {
							return true;
						}
					}
					return false;
				},
				init: function (player) {
					player.storage.yishan = [];
					game.addVideo("storage", player, [
						"yishan",
						get.cardsInfo(player.storage.yishan),
						"cards",
					]);
				},
				mark: true,
				content: function () {
					for (var i = 0; i < player.storage.yishan.length; i++) {
						if (
							get.owner(player.storage.yishan[i]) == player ||
							get.position(player.storage.yishan[i]) == "s"
						) {
							player.storage.yishan.splice(i, 1);
							i--;
						}
					}
					var cards = player.storage.yishan.splice(0, 2);
					player.gain(cards, "log");
					player.$gain2(cards);
				},
				ai: {
					maixie: true,
					maixie_hp: true,
					effect: {
						target: function (card, player, target) {
							if (get.tag(card, "damage")) {
								if (player.hasSkillTag("jueqing", false, target)) return [1, -2];
								if (target.storage.yishan.length == 0) return 1.5;
								if (target.storage.yishan[0] == "tao" || target.storage.yishan[1] == "tao") {
									return [0, 2];
								}
								return [1, 1];
							}
						},
					},
				},
				intro: {
					nocount: true,
					onunmark: function (content, player) {
						player.storage.yishan.length = 0;
					},
					mark: function (dialog, content, player) {
						dialog.add('<div class="text center">最近失去的牌</div>');
						var cards = [];
						for (var i = 0; i < content.length; i++) {
							if (get.owner(content[i]) != player && get.position(content[i]) != "s") {
								cards.push(content[i]);
								if (cards.length >= 4) break;
							}
						}
						if (cards.length) {
							dialog.add(cards);
						} else {
							dialog.add("（无）");
						}
					},
					content: function (content, player) {
						var str = "最近失去的牌：";
						var cards = [];
						for (var i = 0; i < content.length; i++) {
							if (get.owner(content[i]) != player && get.position(content[i]) != "s") {
								cards.push(content[i]);
								if (cards.length >= 4) break;
							}
						}
						if (cards.length) {
							str += get.translation(cards);
						} else {
							str += "无";
						}
						return str;
					},
				},
			},
			yishan2: {
				trigger: { player: "loseEnd" },
				silent: true,
				content: function () {
					for (var i = 0; i < trigger.cards.length; i++) {
						player.storage.yishan.unshift(trigger.cards[i]);
					}
					game.addVideo("storage", player, [
						"yishan",
						get.cardsInfo(player.storage.yishan),
						"cards",
					]);
				},
			},
			guanhu: {
				trigger: { source: "damageEnd" },
				direct: true,
				filter: function (event) {
					if (event._notrigger.includes(event.player)) return false;
					return event.card && event.card.name == "sha" && event.player.countCards("he");
				},
				content: function () {
					var num = 1;
					if (trigger.player.countCards("e") && trigger.player.countCards("h")) {
						num = 2;
					}
					var next = player.discardPlayerCard(
						trigger.player,
						[1, num],
						get.prompt("guanhu", trigger.player)
					);
					next.logSkill = ["guanhu", trigger.player];
					next.filterButton = function (button) {
						if (ui.selected.buttons.length)
							return get.position(button.link) != get.position(ui.selected.buttons[0].link);
						return true;
					};
				},
				ai: {
					expose: 0.2,
				},
			},
			poxing: {
				trigger: { source: "damageBegin" },
				filter: function (trigger, player) {
					return trigger.player.hp > player.hp;
				},
				forced: true,
				content: function () {
					trigger.num++;
				},
			},
			luomu: {
				trigger: { source: "damageEnd" },
				forced: true,
				filter: function (event, player) {
					if (event._notrigger.includes(event.player)) return false;
					return event.player.countCards("hej");
				},
				content: function () {
					trigger.player.discard(trigger.player.getCards("hej").randomGet());
				},
			},
			huanhun: {
				trigger: { global: "dying" },
				priority: 6,
				filter: function (event, player) {
					if (event.player.hp > 0) return false;
					if (get.is.altered("huanhun")) return player.countCards("h", { color: "red" }) > 0;
					return player.countCards("he") > 0;
				},
				// alter:true,
				direct: true,
				content: function () {
					"step 0";
					var next = player.chooseToDiscard(
						get.is.altered("huanhun") ? "h" : "he",
						get.prompt2("huanhun", trigger.player),
						function (card) {
							if (get.is.altered("huanhun")) {
								return get.color(card) == "red";
							} else {
								return true;
							}
						}
					);
					next.logSkill = ["huanhun", trigger.player];
					next.ai = function (card) {
						if (card.name == "tao") return 0;
						if (get.attitude(player, trigger.player) > 0) {
							return 8 - get.value(card);
						}
						return 0;
					};
					"step 1";
					if (result.bool) {
						event.card = result.cards[0];
						trigger.player.judge(function (card) {
							return get.color(card) == "red" ? 1 : 0;
						});
					} else {
						event.finish();
					}
					"step 2";
					if (result.bool) {
						trigger.player.recover();
					} else if (event.card.isInPile()) {
						trigger.player.gain(event.card, "gain2");
					}
				},
				ai: {
					threaten: 1.6,
					expose: 0.2,
				},
			},
			yinyue: {
				trigger: { global: "recoverAfter" },
				check: function (event, player) {
					return get.attitude(player, event.player) > 0;
				},
				logTarget: "player",
				// alter:true,
				content: function () {
					"step 0";
					// if(get.is.altered('yinyue')){
					// 	trigger.player.draw();
					// 	event.finish();
					// }
					// else
					if (
						trigger.player != player &&
						trigger.player.countCards("h") >= player.countCards("h")
					) {
						game.asyncDraw([trigger.player, player]);
					} else {
						trigger.player.draw();
						event.finish();
					}
					"step 1";
					game.delay();
				},
				ai: {
					expose: 0.2,
				},
			},
			daofa: {
				trigger: { global: "damageAfter" },
				check: function (event, player) {
					return event.source && get.attitude(player, event.source) < 0;
				},
				filter: function (event, player) {
					return event.source && event.source != player && event.source.countCards("he");
				},
				logTarget: "source",
				content: function () {
					trigger.source.chooseToDiscard("he", true);
				},
				ai: {
					expose: 0.2,
					threaten: 1.5,
				},
			},
			daixing: {
				group: ["daixing2", "daixing3"],
				trigger: { player: "phaseEnd" },
				direct: true,
				filter: function (event, player) {
					return player.countCards("he") > 0;
				},
				content: function () {
					"step 0";
					var next = player.chooseToDiscard(get.prompt2("daixing"), "he", [
						1,
						player.countCards("he"),
					]);
					next.logSkill = "daixing";
					next.ai = function (card) {
						if (ui.selected.cards.length >= 2) return 0;
						if (ui.selected.cards.length == 1) {
							if (player.countCards("h") > player.hp) {
								return 3 - get.value(card);
							}
							return 0;
						}
						return 6 - get.value(card);
					};
					"step 1";
					if (result.bool) {
						player.changeHujia(result.cards.length);
						player.storage.daixing = result.cards.length;
					}
				},
				ai: {
					effect: {
						target: function (card, player, target) {
							if (get.tag(card, "damage")) {
								if (player.hasSkillTag("jueqing", false, target)) return;
								if (target.storage.daixing > 1) return 0.1;
								if (target.storage.daixing == 1) return 0.5;
							}
							return 1.5;
						},
					},
				},
				intro: {
					content: "mark",
				},
			},
			daixing2: {
				trigger: { player: "phaseBegin" },
				silent: true,
				content: function () {
					if (player.storage.daixing) {
						player.changeHujia(-player.storage.daixing);
						player.storage.daixing = 0;
					}
				},
			},
			daixing3: {
				trigger: { player: ["damageEnd", "damageZero"] },
				silent: true,
				filter: function (event, player) {
					return player.storage.daixing > 0 && event.hujia > 0;
				},
				content: function () {
					player.storage.daixing -= trigger.hujia;
					if (player.storage.daixing < 0) {
						player.storage.daixing = 0;
					}
				},
			},
			swd_wuxie: {
				mod: {
					targetEnabled: function (card, player, target) {
						if (get.type(card) == "delay" && player != target) {
							return false;
						}
					},
				},
			},
			lqingcheng: {
				trigger: { player: "phaseEnd" },
				frequent: true,
				content: function () {
					"step 0";
					if (event.cards == undefined) event.cards = [];
					player.judge(function (card) {
						if (get.color(card) == "red") return 1.5;
						return -1.5;
					}, ui.special);
					"step 1";
					if (result.judge > 0) {
						event.cards.push(result.card);
						if (event.cards.length == 3) {
							player.gain(event.cards);
							if (event.cards.length) {
								player.$draw(event.cards);
							}
							event.finish();
						} else if (lib.config.autoskilllist.includes("lqingcheng")) {
							player.chooseBool("是否再次发动【倾城】？");
						} else {
							event._result = { bool: true };
						}
					} else {
						player.gain(event.cards);
						if (event.cards.length) {
							player.$draw(event.cards);
						}
						event.finish();
					}
					"step 2";
					if (result.bool) {
						event.goto(0);
					} else {
						player.gain(event.cards);
						if (event.cards.length) {
							player.$draw(event.cards);
						}
					}
				},
				ai: {
					threaten: 1.4,
				},
			},
			lingxin: {
				trigger: { player: "phaseEnd" },
				frequent: true,
				content: function () {
					"step 0";
					event.cards = get.cards(3);
					player.showCards(event.cards);
					"step 1";
					for (var i = 0; i < cards.length; i++) {
						if (get.suit(event.cards[i]) != "heart") {
							cards[i].discard();
							event.cards.splice(i--, 1);
						}
					}
					if (event.cards.length == 0) {
						event.finish();
					} else {
						game.delay(0, 1000);
						player.$gain2(event.cards);
					}
					"step 2";
					player.gain(event.cards, "log");
				},
				ai: {
					result: {
						target: 2,
					},
				},
			},
			lingwu: {
				trigger: { player: "phaseAfter" },
				frequent: true,
				filter: function (event, player) {
					return player.countUsed() >= player.hp && event.skill != "lingwu";
				},
				content: function () {
					player.insertPhase();
				},
				ai: {
					order: -10,
					result: {
						target: 2,
					},
					threaten: 1.5,
				},
			},
			shengong: {
				trigger: { player: ["chooseToRespondBegin"] },
				filter: function (event, player) {
					if (event.responded) return false;
					if (!player.countCards("he")) return false;
					if (event.filterCard({ name: "shan" })) {
						if (
							game.hasPlayer(function (current) {
								return current != player && current.getEquip(2);
							})
						) {
							return true;
						}
					}
					if (event.filterCard({ name: "sha" })) {
						if (
							game.hasPlayer(function (current) {
								return current != player && current.getEquip(1);
							})
						) {
							return true;
						}
					}
					return false;
				},
				direct: true,
				content: function () {
					"step 0";
					var list = [];
					var players = game.filterPlayer();
					if (trigger.filterCard({ name: "shan" })) {
						for (var i = 0; i < players.length; i++) {
							if (players[i] != player && players[i].getEquip(2))
								list.push(players[i].getEquip(2));
						}
					}
					if (trigger.filterCard({ name: "sha" })) {
						for (var i = 0; i < players.length; i++) {
							if (players[i] != player && players[i].getEquip(1))
								list.push(players[i].getEquip(1));
						}
					}
					var dialog = ui.create.dialog(get.prompt("shengong"), list);
					for (var i = 0; i < dialog.buttons.length; i++) {
						dialog.buttons[i].querySelector(".info").innerHTML = get.translation(
							get.owner(dialog.buttons[i].link)
						);
					}
					player.chooseButton(dialog, function (button) {
						var player = get.owner(button.link);
						if (get.subtype(button.link) == "equip2" && !player.hasShan()) {
							return 11 - get.attitude(_status.event.player, player);
						}
						if (get.subtype(button.link) == "equip1" && !player.hasSha()) {
							return 11 - get.attitude(_status.event.player, player);
						}
						return 5 - get.attitude(_status.event.player, player);
					});
					"step 1";
					if (result.bool) {
						trigger.untrigger();
						trigger.responded = true;
						trigger.result = { bool: true, card: {} };
						if (get.subtype(result.buttons[0].link) == "equip1") trigger.result.card.name = "sha";
						else trigger.result.card.name = "shan";
						var target = get.owner(result.buttons[0].link);
						target.discard(result.buttons[0].link);
						target.draw();
						if (player.countCards("he")) player.chooseToDiscard(true, "he");
						player.logSkill("shengong", target);
					}
				},
				ai: {
					effect: {
						target: function (card, player, target, current) {
							var he = target.countCards("he");
							if (!he) return 1.5;
							if (he <= 1) return;
							if (get.tag(card, "respondShan")) {
								if (
									game.hasPlayer(function (current) {
										return (
											current != target &&
											current.getEquip(2) &&
											get.attitude(target, current) <= 0
										);
									})
								) {
									return 0.6 / he;
								}
							}
							if (get.tag(card, "respondSha")) {
								if (
									game.hasPlayer(function (current) {
										return (
											current != target &&
											current.getEquip(2) &&
											get.attitude(target, current) <= 0
										);
									})
								) {
									return 0.6 / he;
								}
							}
						},
					},
				},
			},
			huajian: {
				trigger: { player: "phaseUseEnd" },
				direct: true,
				filter: function (event, player) {
					return player.countCards("he") > 0;
				},
				content: function () {
					"step 0";
					var next = player.chooseCardTarget({
						position: "he",
						filterTarget: function (card, player, target) {
							return lib.filter.targetEnabled({ name: "sha" }, player, target);
						},
						filterCard: true,
						ai1: function (card) {
							return get.unuseful(card) + 9;
						},
						ai2: function (target) {
							return get.effect(target, { name: "sha" }, player);
						},
						prompt: get.prompt("huajian"),
					});
					"step 1";
					if (result.bool) {
						player.logSkill("huajian");
						player.useCard({ name: "sha" }, result.cards, result.targets, false);
					}
				},
				ai: {
					expose: 0.2,
				},
			},
			polang: {
				trigger: { source: "damageEnd" },
				filter: function (event, player) {
					if (event._notrigger.includes(event.player)) return false;
					return event.player.countCards("e");
				},
				direct: true,
				logTarget: "player",
				content: function () {
					player.discardPlayerCard(
						trigger.player,
						"e",
						get.prompt("polang", trigger.player)
					).logSkill = "polang";
				},
				ai: {
					expose: 0.3,
				},
			},
			jikong: {
				trigger: { player: ["loseEnd", "phaseBegin"] },
				direct: true,
				usable: 1,
				// alter:true,
				filter: function (event, player) {
					if (event.name == "phase") return true;
					if (get.is.altered("jikong")) return false;
					if (player.countCards("h")) return false;
					for (var i = 0; i < event.cards.length; i++) {
						if (event.cards[i].original == "h") return true;
					}
					return false;
				},
				content: function () {
					"step 0";
					player.chooseTarget(get.prompt("jikong"), function (card, player, target) {
						return lib.filter.targetEnabled({ name: "sha", nature: "thunder" }, player, target);
					}).ai = function (target) {
						return get.effect(target, { name: "sha", nature: "thunder" }, player);
					};
					"step 1";
					if (result.bool) {
						player.logSkill("jikong");
						player.useCard({ name: "sha", nature: "thunder" }, result.targets, false);
					} else {
						player.storage.counttrigger.jikong--;
					}
				},
				ai: {
					threaten: function (player, target) {
						if (target.countCards("h")) return 0.8;
						return 2;
					},
				},
			},
			xielei: {
				trigger: { player: ["useCard", "respondAfter"] },
				direct: true,
				filter: function (event) {
					return game.countPlayer() > 2 && event.card && event.card.name == "sha";
				},
				content: function () {
					"step 0";
					player.chooseCardTarget({
						prompt: get.prompt("xielei"),
						filterCard: lib.filter.cardDiscardable,
						position: "he",
						filterTarget: function (card, player, target) {
							if (player == target) return false;
							if (trigger.name == "respond") {
								return trigger.source != target;
							} else {
								return !trigger.targets.includes(target);
							}
						},
						ai1: function (card) {
							return 8 - get.value(card);
						},
						ai2: function (target) {
							return get.damageEffect(target, player, player, "thunder");
						},
					});
					"step 1";
					if (result.bool && !event.isMine()) {
						game.delayx();
					}
					"step 2";
					if (result.bool) {
						player.logSkill("xielei", result.targets, "thunder");
						player.discard(result.cards);
						result.targets[0].damage("thunder");
					}
				},
				ai: {
					expose: 0.3,
					threaten: 1.6,
				},
			},
			pozhen: {
				trigger: { player: "damageEnd" },
				filter: function (event, player) {
					if (!event.source) return false;
					if (get.is.altered("pozhen")) {
						return event.source.countCards("h") > player.countCards("h");
					}
					return event.source.countCards("h") != player.countCards("h");
				},
				// alter:true,
				// check:function(event,player){
				// 	return get.attitude(player,event.source)<0;
				// },
				direct: true,
				content: function () {
					"step 0";
					var num = player.countCards("h") - trigger.source.countCards("h");
					event.num = num;
					if (num > 0) {
						var next = player.chooseToDiscard(
							num,
							get.prompt("pozhen", trigger.source),
							"弃置" + num + "张手牌，并对" + get.translation(trigger.source) + "造成1点伤害"
						);
						next.logSkill = ["pozhen", trigger.source];
						next.ai = function (card) {
							if (get.damageEffect(trigger.source, player, player) > 0 && num <= 2) {
								return 6 - get.value(card);
							}
							return -1;
						};
					} else if (num < 0) {
						player.chooseBool(
							get.prompt("pozhen", trigger.source),
							"弃置" + get.translation(trigger.source) + -num + "张手牌"
						).ai = function () {
							return get.attitude(player, trigger.source) < 0;
						};
					} else {
						event.finish();
					}
					"step 1";
					if (result.bool) {
						if (event.num > 0) {
							trigger.source.damage();
						} else {
							player.logSkill("pozhen", trigger.source);
							var cards = trigger.source.getCards("h");
							cards.sort(lib.sort.random);
							trigger.source.discard(cards.slice(0, -event.num));
						}
					}
				},
				ai: {
					maixie_defend: true,
					effect: {
						target: function (card, player, target) {
							if (get.tag(card, "damage")) {
								if (player.hasSkillTag("jueqing", false, target)) return [1, -1];
								var num = player.countCards("h") - target.countCards("h");
								if (num > 0) {
									return [1, 0, 0, -num / 2];
								}
								if (num < 0 && !get.is.altered("pozhen")) {
									return [1, 0, 0, -0.5];
								}
							}
						},
					},
				},
			},
			tanlin_defence: {
				trigger: { player: "damageEnd" },
				filter: function (event, player) {
					return player.countCards("h") && event.source && event.source.countCards("h");
				},
				direct: true,
				content: function () {
					"step 0";
					player.chooseToDiscard(
						[1, trigger.source.countCards("h")],
						"弃置任意张手牌并令伤害来源弃置等量手牌"
					).ai = function (card) {
						if (ui.selected.cards.length >= trigger.source.countCards("h")) return -1;
						if (ui.selected.cards.length == 0) return 8 - get.value(card);
						return 4 - get.value(card);
					};
					"step 1";
					if (result.bool) {
						player.logSkill("tanlin");
						trigger.source.randomDiscard("h", result.cards.length);
					} else {
						event.finish();
					}
					"step 2";
					player.draw();
				},
				ai: {
					effect: {
						target: function (card, player, target) {
							if (
								get.tag(card, "damage") &&
								target.countCards("h") &&
								target.hp > 1 &&
								player != target
							)
								return [1, 0.2, 0, -0.2];
						},
					},
				},
			},
			tanlin: {
				enable: "phaseUse",
				usable: 1,
				group: "tanlin4",
				// alter:true,
				filterTarget: function (card, player, target) {
					return player != target && target.countCards("h");
				},
				filter: function (event, player) {
					return player.countCards("h") > 0;
				},
				content: function () {
					"step 0";
					player.chooseToCompare(target).set("preserve", "win");
					"step 1";
					if (result.bool) {
						if (target.hasSkill("tanlin2") == false) {
							target.addSkill("tanlin2");
							player.addSkill("tanlin3");
							if (get.is.altered("tanlin")) {
								player.gain([result.target]);
								player.$gain2([result.target]);
							} else {
								player.gain([result.player, result.target]);
								player.$gain2([result.player, result.target]);
							}
						}
					} else {
						player.damage(target);
					}
				},
				ai: {
					result: {
						target: function (player, target) {
							var cards = player.getCards("h");
							var num = target.countCards("h");
							if (num > cards.length + 3 && player.hp > 1) return -2;
							if (num > cards.length + 1 && player.hp > 1) return -1;
							if (num == cards.length - 1 && player.hp > 1 && !get.is.altered("pozhen"))
								return -1;
							for (var i = 0; i < cards.length; i++) {
								if (cards[i].number > 9) return num == 1 ? -1 : -0.5;
							}
							return 0;
						},
					},
					order: 9,
				},
			},
			tanlin2: {
				trigger: { global: "phaseAfter" },
				forced: true,
				content: function () {
					player.removeSkill("tanlin2");
				},
				// mod:{
				// 	cardEnabled:function(){
				// 		return false;
				// 	},
				// 	cardUsable:function(){
				// 		return false;
				// 	},
				// 	cardRespondable:function(){
				// 		return false;
				// 	},
				// 	cardSavable:function(){
				// 		return false;
				// 	}
				// },
			},
			tanlin3: {
				trigger: { global: "phaseAfter" },
				forced: true,
				popup: false,
				content: function () {
					player.removeSkill("tanlin3");
				},
				mod: {
					cardUsable: function (card, player, num) {
						if (card.name == "sha") return num + 1;
					},
				},
			},
			tanlin4: {
				mod: {
					targetInRange: function (card, player, target, now) {
						if (target.hasSkill("tanlin2")) return true;
					},
				},
			},
			yunchou: {
				enable: "phaseUse",
				usable: 1,
				filterTarget: function (card, player, target) {
					return player != target && target.countCards("h");
				},
				filterCard: function (card) {
					if (get.is.altered("yunchou")) {
						return get.type(card) != "basic";
					}
					return true;
				},
				filter: function (event, player) {
					if (get.is.altered("yunchou")) {
						return player.hasCard(function (card) {
							return get.type(card) != "basic";
						});
					}
					return true;
				},
				// alter:true,
				content: function () {
					"step 0";
					var card = target.getCards("h").randomGet();
					if (!card) {
						event.finish();
						return;
					}
					target.discard(card);
					if (get.color(card) == get.color(cards[0])) {
						event.bool = true;
					}
					"step 1";
					if (event.bool) {
						player.draw();
					} else if (player.countCards("he")) {
						target.draw();
					}
				},
				check: function (card) {
					return 7 - get.value(card);
				},
				ai: {
					order: 5,
					result: {
						target: function (player, target) {
							if (target.hasSkillTag("noh")) return 0;
							return -1;
						},
					},
					threaten: 1.3,
				},
			},
			jqimou: {
				trigger: { player: "damageEnd" },
				frequent: true,
				filter: function (event, player) {
					return _status.currentPhase != player;
				},
				content: function () {
					"step 0";
					player.draw();
					"step 1";
					player.chooseToUse("是否使用一张牌？");
				},
				ai: {
					effect: {
						target: function (card, player, target) {
							if (get.tag(card, "damage") && _status.currentPhase != target) {
								if (player.hasSkillTag("jueqing", false, target)) return [1, -1.5];
								return [1, 0.5];
							}
						},
					},
				},
			},
			lexue: {
				group: ["lexue1", "lexue2"],
			},
			lexue1: {
				trigger: { player: "phaseBegin" },
				forced: true,
				popup: false,
				content: function () {
					player.removeSkill(player.storage.lexue);
					switch (Math.floor(Math.random() * 4)) {
						case 0:
							if (lib.skill.zhiheng) {
								player.addSkill("zhiheng");
								player.storage.lexue = "zhiheng";
								player.popup("zhiheng");
							}
							break;
						case 1:
							if (lib.skill.jizhi) {
								player.addSkill("jizhi");
								player.storage.lexue = "jizhi";
								player.popup("jizhi");
							}
							break;
						case 2:
							if (lib.skill.dimeng) {
								player.addSkill("dimeng");
								player.storage.lexue = "dimeng";
								player.popup("dimeng");
							}
							break;
						case 3:
							if (lib.skill.quhu) {
								player.addSkill("quhu");
								player.storage.lexue = "quhu";
								player.popup("quhu");
							}
							break;
					}
				},
			},
			lexue2: {
				trigger: { player: "phaseEnd" },
				forced: true,
				popup: false,
				content: function () {
					player.removeSkill(player.storage.lexue);
					switch (Math.floor(Math.random() * 4)) {
						case 0:
							if (lib.skill.yiji) {
								player.addSkill("yiji");
								player.storage.lexue = "yiji";
								player.popup("yiji");
							}
							break;
						case 1:
							if (lib.skill.jijiu) {
								player.addSkill("jijiu");
								player.storage.lexue = "jijiu";
								player.popup("jijiu");
							}
							break;
						case 2:
							if (lib.skill.guidao) {
								player.addSkill("guidao");
								player.storage.lexue = "guidao";
								player.popup("guidao");
							}
							break;
						case 3:
							if (lib.skill.fankui) {
								player.addSkill("fankui");
								player.storage.lexue = "fankui";
								player.popup("fankui");
							}
							break;
					}
				},
			},
			swdtianshu2: {
				enable: "phaseUse",
				filter: function (event, player) {
					return (
						!player.hasSkill("swdtianshu3") &&
						player.storage.swdtianshu &&
						player.storage.swdtianshu.length > 0
					);
				},
				intro: {
					nocount: true,
				},
				delay: 0,
				content: function () {
					"step 0";
					var list = player.storage.swdtianshu;
					if (player.additionalSkills.swdtianshu) {
						player.removeSkill(player.additionalSkills.swdtianshu);
					}
					event.skillai = function (list) {
						return get.max(list, get.skillRank, "item");
					};
					if (event.isMine()) {
						var dialog = ui.create.dialog("forcebutton");
						dialog.add("选择获得一项技能");
						_status.event.list = list;
						var clickItem = function () {
							_status.event._result = this.link;
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
						event.dialog = dialog;
						event.switchToAuto = function () {
							event._result = event.skillai(list);
							game.resume();
						};
						game.pause();
						_status.imchoosing = true;
					} else {
						event._result = event.skillai(list);
					}
					"step 1";
					_status.imchoosing = false;
					if (event.dialog) {
						event.dialog.close();
					}
					var link = result;
					player.addSkill(link);
					player.skills.remove(link);
					player.additionalSkills.swdtianshu = link;
					player.popup(link);
					var target = player.storage.swdtianshu2[player.storage.swdtianshu.indexOf(link)];
					player.markSkillCharacter(
						"swdtianshu2",
						target,
						get.translation(link),
						lib.translate[link + "_info"]
					);
					player.checkMarks();
					player.addSkill("swdtianshu3");
				},
				ai: {
					order: 10,
					result: {
						player: function (player) {
							return 1;
						},
					},
				},
			},
			swdtianshu3: {
				trigger: { global: ["useCardAfter", "useSkillAfter", "phaseAfter"] },
				silent: true,
				filter: function (event) {
					return event.skill != "swdtianshu2";
				},
				content: function () {
					player.removeSkill("swdtianshu3");
				},
			},
			swdtianshu: {
				unique: true,
				enable: "phaseUse",
				filterCard: function (card) {
					return get.type(card, "trick") == "trick";
				},
				filter: function (event, player) {
					return player.countCards("h", { type: ["trick", "delay"] }) > 0;
				},
				filterTarget: function (card, player, target) {
					var names = [];
					if (target.name && !target.isUnseen(0)) names.add(target.name);
					if (target.name1 && !target.isUnseen(0)) names.add(target.name1);
					if (target.name2 && !target.isUnseen(1)) names.add(target.name2);
					var pss = player.getSkills();
					for (var i = 0; i < names.length; i++) {
						var info = lib.character[names[i]];
						if (info) {
							var skills = info[3];
							for (var j = 0; j < skills.length; j++) {
								if (
									lib.translate[skills[j] + "_info"] &&
									lib.skill[skills[j]] &&
									!lib.skill[skills[j]].unique &&
									!pss.includes(skills[j])
								) {
									return true;
								}
							}
						}
						return false;
					}
				},
				group: "swdtianshu_remove",
				createDialog: function (player, target, onlylist) {
					var names = [];
					var list = [];
					if (target.name && !target.isUnseen(0)) names.add(target.name);
					if (target.name1 && !target.isUnseen(0)) names.add(target.name1);
					if (target.name2 && !target.isUnseen(1)) names.add(target.name2);
					var pss = player.getSkills();
					for (var i = 0; i < names.length; i++) {
						var info = lib.character[names[i]];
						if (info) {
							var skills = info[3];
							for (var j = 0; j < skills.length; j++) {
								if (
									lib.translate[skills[j] + "_info"] &&
									lib.skill[skills[j]] &&
									!lib.skill[skills[j]].unique &&
									!pss.includes(skills[j])
								) {
									list.push(skills[j]);
								}
							}
						}
					}
					if (onlylist) return list;
					var dialog = ui.create.dialog("forcebutton");
					dialog.add("选择获得一项技能");
					_status.event.list = list;
					var clickItem = function () {
						_status.event._result = this.link;
						game.resume();
					};
					for (i = 0; i < list.length; i++) {
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
					return dialog;
				},
				check: function (card) {
					return 5 - get.value(card);
				},
				content: function () {
					"step 0";
					// target.gain(cards,player);
					event.skillai = function (list) {
						return get.max(list, get.skillRank, "item");
					};
					if (event.isMine()) {
						event.dialog = lib.skill.swdtianshu.createDialog(player, target);
						event.switchToAuto = function () {
							event._result = event.skillai(event.list);
							game.resume();
						};
						_status.imchoosing = true;
						game.pause();
					} else {
						event._result = event.skillai(
							lib.skill.swdtianshu.createDialog(player, target, true)
						);
					}
					"step 1";
					_status.imchoosing = false;
					if (event.dialog) {
						event.dialog.close();
					}
					var link = result;
					player.addAdditionalSkill("swdtianshu", link);
					player.popup(link);
					player.markSkillCharacter(
						"swdtianshu",
						target,
						get.translation(link),
						lib.translate[link + "_info"]
					);
					player.storage.swdtianshu = target;
					player.checkMarks();
					game.log(player, "获得了技能", "【" + get.translation(link) + "】");
				},
				ai: {
					order: 1,
					result: {
						player: function (player, target) {
							if (player.countCards("h") > player.hp) return 1;
							return 0;
						},
					},
				},
			},
			swdtianshu_remove: {
				trigger: { global: "dieAfter" },
				silent: true,
				filter: function (event, player) {
					return event.player == player.storage.swdtianshu;
				},
				content: function () {
					player.unmarkSkill("swdtianshu");
					player.removeAdditionalSkill("swdtianshu");
					delete player.storage.swdtianshu;
				},
			},
			luomei: {
				trigger: { player: ["useCard", "respond"] },
				frequent: true,
				filter: function (event, player) {
					if (!event.cards) return false;
					if (event.cards.length != 1) return false;
					for (var i = 0; i < event.cards.length; i++) {
						if (get.suit(event.cards[i]) == "club") return true;
					}
					return false;
				},
				content: function () {
					var num = 0;
					for (var i = 0; i < trigger.cards.length; i++) {
						if (get.suit(trigger.cards[i]) == "club") num++;
					}
					player.draw(num);
				},
			},
			xingdian: {
				enable: "phaseUse",
				usable: 1,
				filterCard: true,
				filter: function (event, player) {
					return player.countCards("h") > 0;
				},
				// filterTarget:function(card,player,target){
				// 	return player!=target&&target.countCards('h')>0;
				// },
				check: function (card) {
					return 7 - get.value(card);
				},
				// selectTarget:[1,2],
				content: function () {
					"step 0";
					event.list = game
						.filterPlayer(function (current) {
							return current.isEnemyOf(player) && current.countCards("he");
						})
						.randomGets(2)
						.sortBySeat();
					"step 1";
					if (event.list.length) {
						var target = event.list.shift();
						player.line(target, "green");
						if (event.list.length) {
							target.randomDiscard("he", false);
						} else {
							target.randomDiscard("he");
						}
						event.redo();
					}
				},
				ai: {
					order: 9,
					result: {
						player: function (player) {
							if (
								game.countPlayer(function (current) {
									return current.isEnemyOf(player) && current.countCards("he");
								}) >= 2
							) {
								return 1;
							}
							return 0;
						},
						// target:function(player,target){
						// 	if(target.countCards('h')==1) return -1.5;
						// 	return -1;
						// }
					},
				},
			},
			yulin: {
				trigger: { player: "damageBefore" },
				priority: -10,
				filter: function (event, player) {
					return player.countCards("he", { type: "equip" });
				},
				direct: true,
				content: function () {
					"step 0";
					var next = player.chooseToDiscard(
						"he",
						"是否弃置一张装备牌抵消伤害？",
						function (card, player) {
							return get.type(card) == "equip";
						}
					);
					next.logSkill = "yulin";
					next.ai = function (card) {
						if (player.hp == 1 || trigger.num > 1) {
							return 9 - get.value(card);
						}
						if (player.hp == 2) {
							return 8 - get.value(card);
						}
						return 7 - get.value(card);
					};
					"step 1";
					if (result.bool) {
						game.delay();
						trigger.cancel();
					}
				},
			},
			funiao: {
				enable: "phaseUse",
				usable: 1,
				prepare: "give2",
				filterTarget: function (card, player, target) {
					if (player == target) return false;
					return true;
				},
				filter: function (event, player) {
					return player.countCards("h") > 0;
				},
				filterCard: true,
				check: function (card) {
					if (card.name == "du") return 20;
					return 7 - get.value(card);
				},
				discard: false,
				content: function () {
					"step 0";
					target.gain(cards, player).delay = false;
					player.draw();
					"step 1";
					if (target.countCards("h")) {
						player.viewHandcards(target);
					}
				},
				ai: {
					result: {
						target: function (player, target) {
							if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
								return -1;
							}
							return 1;
						},
					},
					order: 2,
				},
			},
			xuehuang: {
				enable: "phaseUse",
				init: function (player) {
					player.storage.xuehuang = false;
				},
				intro: {
					content: "limited",
				},
				mark: true,
				unique: true,
				skillAnimation: true,
				animationColor: "fire",
				line: "fire",
				filter: function (event, player) {
					return (
						!player.storage.xuehuang &&
						player.countCards("h", { color: "red" }) > 0 &&
						player.countCards("h", { color: "black" }) == 0
					);
				},
				content: function () {
					"step 0";
					player.storage.xuehuang = true;
					player.awakenSkill("xuehuang");
					player.showHandcards();
					var cards = player.getCards("h");
					player.discard(cards);
					event.num = cards.length;
					"step 1";
					if (event.num) {
						var targets = player.getEnemies().randomGets(2);
						if (!targets.length) {
							event.finish();
							return;
						}
						player.useCard({ name: "sha", nature: "fire" }, targets);
						event.num--;
						event.redo();
					}
				},
				ai: {
					order: 9,
					result: {
						player: function (player) {
							if (player.countCards("h", { color: "red" }) < 2) return 0;
							if (
								player.hasCard(function (card) {
									return get.color(card) == "red" && get.value(card) > 8;
								})
							) {
								return 0;
							}
							return 1;
						},
					},
				},
			},
			zhuyu: {
				trigger: { global: "damageBegin" },
				filter: function (event, player) {
					if (!event.player.isLinked()) return false;
					if (!event.notLink()) return false;
					if (player.countCards("he", { color: "red" })) return true;
					return false;
				},
				direct: true,
				content: function () {
					"step 0";
					var next = player.chooseToDiscard(
						"朱羽：是否弃置一张红色牌使" + get.translation(trigger.player) + "受到的伤害+1？",
						"he",
						function (card) {
							return get.color(card) == "red";
						}
					);
					next.logSkill = ["zhuyu", trigger.player, "fire"];
					var num = game.countPlayer(function (current) {
						if (current.isLinked()) {
							if (trigger.hasNature()) {
								return get.sgn(get.damageEffect(current, player, player, "fire"));
							} else {
								if (current == trigger.player) {
									return get.sgn(get.damageEffect(current, player, player, "fire"));
								} else {
									return 2 * get.sgn(get.damageEffect(current, player, player, "fire"));
								}
							}
						}
					});
					next.ai = function (card) {
						if (trigger.player.hasSkillTag("nofire")) return 0;
						if (num > 0) {
							return 9 - get.value(card);
						}
						return 0;
					};
					"step 1";
					if (result.bool) {
						trigger.num++;
						game.setNature(trigger, "fire");
					}
				},
			},
			ningshuang: {
				trigger: { target: "useCardToBegin" },
				filter: function (event, player) {
					if (get.color(event.card) != "black") return false;
					if (!event.player) return false;
					if (event.player == player) return false;
					if (event.player.isLinked() && event.player.isTurnedOver()) return false;
					if (player.countCards("he", { color: "black" })) return true;
					return false;
				},
				direct: true,
				content: function () {
					"step 0";
					var next = player.chooseToDiscard(
						"凝霜：是否弃置一张黑色牌使" + get.translation(trigger.player) + "横置或翻面？",
						"he",
						function (card) {
							return get.color(card) == "black";
						}
					);
					next.logSkill = ["ningshuang", trigger.player];
					next.ai = function (card) {
						if (trigger.player.hasSkillTag("noturn") && trigger.player.isLinked()) return 0;
						if (get.attitude(player, trigger.player) < 0) {
							return 9 - get.value(card);
						}
						return 0;
					};
					"step 1";
					if (result.bool) {
						if (trigger.player.isTurnedOver()) {
							trigger.player.loseHp();
						}
						if (trigger.player.isLinked()) {
							trigger.player.turnOver();
						} else {
							trigger.player.link();
							player.draw();
						}
					}
				},
				ai: {
					effect: {
						target(card, player, target) {
							if (
								get.color(card) == "black" &&
								get.attitude(target, player) < 0 &&
								target.countCards("h") > 0
							) {
								return [1, 0.1, 0, -target.countCards("h") / 4];
							}
						},
					},
				},
			},
			xielv: {
				trigger: { player: "phaseDiscardEnd" },
				filter: function (event, player) {
					var cards = player.getCards("h");
					if (cards.length < 2) return false;
					var color = get.color(cards[0]);
					for (var i = 1; i < cards.length; i++) {
						if (get.color(cards[i]) != color) return false;
					}
					if (player.isDamaged()) return true;
					return game.hasPlayer(function (current) {
						return current.countCards("j");
					});
				},
				check: function (event, player) {
					if (player.isDamaged()) return true;
					return (
						game.countPlayer(function (current) {
							if (current.countCards("j")) return get.sgn(get.attitude(player, current));
						}) > 0
					);
				},
				content: function () {
					"step 0";
					player.showHandcards();
					"step 1";
					player.recover();
					event.targets = game.filterPlayer(function (current) {
						return current.countCards("j");
					});
					event.targets.sortBySeat();
					"step 2";
					if (event.targets.length) {
						var current = event.targets.shift();
						var js = current.getCards("j");
						if (js.length) {
							current.discard(js);
							player.line(current, "green");
						}
						event.redo();
					}
				},
				ai: {
					expose: 0.1,
				},
			},
			xiaomoyu: {
				trigger: { source: "damageEnd" },
				priority: 1,
				forced: true,
				filter: function (event, player) {
					return !player.hasSkill("xiaomoyu2");
				},
				content: function () {
					"step 0";
					player.addTempSkill("xiaomoyu2");
					if (player.hp < player.maxHp) {
						player.recover();
						event.finish();
					} else {
						player.draw();
						event.finish();
					}
					"step 1";
					if (result.control == "draw_card") {
						player.draw();
					} else {
						player.recover();
					}
				},
				ai: {
					effect: {
						player: function (card, player, target, current) {
							if (get.tag(card, "damage") && !player.hasSkill("xiaomoyu2")) {
								if (player.isDamaged()) return [1, 1.6];
								return [1, 0.8];
							}
						},
					},
				},
			},
			xiaomoyu2: {},
			tianhuo: {
				enable: "phaseUse",
				filterTarget: function (card, player, target) {
					return target.countCards("j") > 0;
				},
				usable: 1,
				selectTarget: -1,
				filter: function () {
					return game.hasPlayer(function (current) {
						return current.countCards("j");
					});
				},
				line: "fire",
				content: function () {
					"step 0";
					event.num = target.countCards("j");
					target.discard(target.getCards("j"));
					"step 1";
					target.damage(event.num, "fire", "nosource");
				},
				ai: {
					order: 1,
					result: {
						target: function (player, target) {
							var eff = get.damageEffect(target, player, target, "fire");
							if (eff >= 0) return eff + 1;
							var judges = target.getCards("j");
							if (!judges.length) return 0;
							if (target.hp == 1 || judges.length > 1) return -judges.length;
							var name = judges[0].viewAs || judges[0].name;
							if (name == "shandian" || name == "huoshan" || name == "hongshui")
								return -judges.length;
							return 0;
						},
					},
				},
			},
			huanyin: {
				trigger: { target: "useCardToBefore" },
				forced: true,
				priority: 5.9,
				filter: function (event, player) {
					return event.player != player;
				},
				content: function () {
					"step 0";
					var effect = get.effect(player, trigger.card, trigger.player, player);
					player.judge(function (card) {
						switch (get.suit(card)) {
							case "spade":
								return -effect;
							case "heart":
								return 1;
							default:
								return 0;
						}
					});
					"step 1";
					switch (result.suit) {
						case "spade": {
							trigger.cancel();
							break;
						}
						case "heart": {
							player.draw();
							break;
						}
					}
				},
				ai: {
					effect: {
						target_use(card, player, target) {
							return 0.7;
						},
					},
					threaten: 0.8,
				},
			},
			xuanzhou: {
				enable: "phaseUse",
				usable: 1,
				discard: false,
				filter: function (event, player) {
					return player.countCards("he", { type: "trick" }) > 0;
				},
				prepare: "throw",
				position: "he",
				filterCard: { type: "trick" },
				filterTarget: function (card, player, target) {
					return player != target;
				},
				check: function (card) {
					return 7 - get.value(card);
				},
				content: function () {
					"step 0";
					var list = [];
					for (var i in lib.card) {
						if (lib.card[i].mode && lib.card[i].mode.includes(lib.config.mode) == false) continue;
						if (lib.card[i].type == "delay") list.push([cards[0].suit, cards[0].number, i]);
					}
					var dialog = ui.create.dialog("玄咒", [list, "vcard"]);
					var bing = target.countCards("h") <= 1;
					player.chooseButton(dialog, true, function (button) {
						if (get.effect(target, { name: button.link[2] }, player, player) > 0) {
							if (button.link[2] == "bingliang") {
								if (bing) return 2;
								return 0.7;
							}
							if (button.link[2] == "lebu") {
								return 1;
							}
							if (button.link[2] == "guiyoujie") {
								return 0.5;
							}
							if (button.link[2] == "caomu") {
								return 0.3;
							}
							return 0.2;
						}
						return 0;
					}).filterButton = function (button) {
						return !target.hasJudge(button.link[2]);
					};
					"step 1";
					target.addJudge(result.links[0][2], cards);
				},
				ai: {
					result: {
						player: function (player, target) {
							var eff = 0;
							for (var i in lib.card) {
								if (lib.card[i].type == "delay") {
									var current = get.effect(target, { name: i }, player, player);
									if (current > eff) {
										eff = current;
									}
								}
							}
							return eff;
						},
					},
					order: 9.5,
				},
			},
			tianlun: {
				unique: true,
				trigger: { global: "judge" },
				direct: true,
				filter: function (event) {
					if (event.card) return true;
					return game.hasPlayer(function (current) {
						return current.countCards("j");
					});
				},
				content: function () {
					"step 0";
					var list = [];
					if (trigger.card) list.push(trigger.card);
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						list = list.concat(players[i].getCards("j"));
					}
					var dialog = ui.create.dialog(
						get.translation(trigger.player) +
							"的" +
							(trigger.judgestr || "") +
							"判定为" +
							get.translation(trigger.player.judging[0]) +
							"，" +
							get.prompt("tianlun"),
						list,
						"hidden"
					);
					player.chooseButton(dialog, function (button) {
						var card = button.link;
						var trigger = _status.event.parent._trigger;
						var player = _status.event.player;
						var result = trigger.judge(card) - trigger.judge(trigger.player.judging[0]);
						var attitude = get.attitude(player, trigger.player);
						return result * attitude;
					});
					"step 1";
					if (result.bool) {
						event.card = result.buttons[0].link;
						if (get.owner(event.card)) get.owner(event.card).discard(event.card);
						else trigger.player.$throw(event.card, 1000);
						if (event.card.clone) {
							event.card.clone.classList.add("thrownhighlight");
							game.addVideo("highlightnode", player, get.cardInfo(event.card));
						}
					}
					"step 2";
					if (event.card) {
						player.logSkill("tianlun", trigger.player);
						trigger.player.judging[0].discard();
						trigger.player.judging[0] = event.card;
						trigger.position.appendChild(event.card);
						game.log(trigger.player, "的判定牌改为", event.card);
						event.card.expired = true;
						game.delay(2);
					}
				},
				ai: {
					tag: {
						rejudge: 0.6,
					},
				},
			},
			lanzhi: {
				trigger: { player: "useCard" },
				filter: function (event, player) {
					if (get.suit(event.card) == "club") {
						return game.hasPlayer(function (current) {
							return current.hp <= player.hp && current.isDamaged();
						});
					}
					return false;
				},
				prompt: function (event, player) {
					var list = game.filterPlayer(function (current) {
						return current.hp <= player.hp && current.isDamaged();
					});
					return get.prompt("lanzhi", list);
				},
				check: function (event, player) {
					var list = game.filterPlayer(function (current) {
						return current.hp <= player.hp && current.isDamaged();
					});
					var num = 0;
					for (var i = 0; i < list.length; i++) {
						var eff = get.recoverEffect(list[i], player, player);
						if (eff > 0) {
							num++;
						} else {
							num--;
						}
					}
					return num > 0;
				},
				content: function () {
					"step 0";
					var list = game.filterPlayer(function (current) {
						return current.hp <= player.hp && current.isDamaged();
					});
					player.line(list, "green");
					list.sort(lib.sort.seat);
					event.list = list;
					"step 1";
					if (event.list.length) {
						event.list.shift().recover();
						event.redo();
					}
				},
				ai: {
					expose: 0.3,
					threaten: 1.5,
				},
			},
			duanyi: {
				enable: "phaseUse",
				usable: 1,
				// alter:true,
				filter: function (event, player) {
					return player.countCards("h", "sha") > 1;
				},
				filterCard: { name: "sha" },
				selectCard: 2,
				filterTarget: function (card, player, target) {
					return player != target;
				},
				check: function (card) {
					return 10 - get.value(card);
				},
				content: function () {
					"step 0";
					target.damage();
					if (get.is.altered("duanyi")) {
						event.finish();
					}
					"step 1";
					var he = target.getCards("he");
					target.discard(he.randomGets(target.maxHp - target.hp));
				},
				ai: {
					expose: 0.3,
					result: {
						target: function (player, target) {
							return get.damageEffect(target, player) - (target.maxHp - target.hp) / 2;
						},
					},
					order: 5,
				},
			},
			guxing: {
				group: ["guxing1", "guxing3"],
			},
			guxing1: {
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					var min = Math.max(1, player.maxHp - player.hp);
					return (
						player.countCards("h") <= min &&
						player.countCards("h") > 0 &&
						lib.filter.filterCard({ name: "sha" }, player)
					);
				},
				filterCard: true,
				selectCard: -1,
				// viewAs:{name:'sha'},
				discard: false,
				prepare: "throw",
				filterTarget: function (card, player, target) {
					return lib.filter.targetEnabled({ name: "sha" }, player, target);
				},
				content: function () {
					"step 0";
					delete player.storage.guxing;
					targets.sort(lib.sort.seat);
					player.useCard({ name: "sha" }, cards, targets, "guxing").animate = false;
					"step 1";
					if (player.storage.guxing) {
						player.draw(player.storage.guxing);
						delete player.storage.guxing;
					}
				},
				multitarget: true,
				multiline: true,
				selectTarget: [1, 3],
				ai: {
					order: function () {
						if (_status.event.player.countCards("h") == 1) return 10;
						return get.order({ name: "sha" }) + 0.1;
					},
					result: {
						target: function (player, target) {
							return get.effect(target, { name: "sha" }, player, target);
						},
					},
					threaten: function (player, target) {
						if (target.hp < target.maxHp - 1) return 1.5;
					},
					pretao: true,
				},
			},
			guxing3: {
				trigger: { source: "damageAfter" },
				forced: true,
				popup: false,
				filter: function (event) {
					return event.parent.skill == "guxing";
				},
				content: function () {
					if (!player.storage.guxing) {
						player.storage.guxing = 1;
					} else {
						player.storage.guxing++;
					}
				},
			},
			miles_xueyi: {
				trigger: { player: "damageBefore" },
				forced: true,
				priority: 10,
				content: function () {
					trigger.cancel();
					player.loseHp();
				},
			},
			jifeng: {
				mod: {
					selectTarget: function (card, player, range) {
						if (range[0] != 1 || range[1] != 1) return;
						var range2 = get.select(get.info(card).selectTarget);
						if (range2[0] != 1 && range2[1] != 1) return;
						if (card.name == "sha" || get.type(card) == "trick") range[1] = Infinity;
					},
				},
				trigger: { player: "useCardToBefore" },
				priority: 6,
				forced: true,
				popup: false,
				filter: function (event, player) {
					if (event.targets.length <= 1) return false;
					if (event.card.name == "sha") return true;
					else if (get.type(event.card) == "trick") {
						var range = get.select(get.info(event.card).selectTarget);
						if (range[0] == 1 && range[1] == 1) return true;
					}
					return false;
				},
				content: function () {
					if (Math.random() > (1.3 + trigger.targets.length / 5) / trigger.targets.length) {
						trigger.target.popup("失误");
						trigger.cancel();
					}
				},
			},
			swd_xiuluo: {
				trigger: { player: "phaseZhunbeiBegin" },
				filter: function (event, player) {
					return player.countCards("j") > 0;
				},
				direct: true,
				content: function () {
					var next = player.discardPlayerCard(
						player,
						2,
						"hj",
						"是否一张手牌来弃置一张花色相同的判定牌？"
					);
					next.filterButton = function (button) {
						var card = button.link;
						if (!lib.filter.cardDiscardable(card, player)) return false;
						if (ui.selected.buttons.length == 0) return true;
						if (get.position(ui.selected.buttons[0].link) == "h") {
							if (get.position(card) != "j") return false;
						}
						if (get.position(ui.selected.buttons[0].link) == "j") {
							if (get.position(card) != "h") return false;
						}
						return get.suit(card) == get.suit(ui.selected.buttons[0].link);
					};
					next.ai = function (button) {
						var card = button.link;
						if (get.position(card) == "h") {
							return 11 - get.value(card);
						}
						if (card.name == "lebu") return 5;
						if (card.name == "bingliang") return 4;
						if (card.name == "guiyoujie") return 3;
						return 2;
					};
					next.logSkill = "swd_xiuluo";
				},
			},
			mohua2: {
				unique: true,
				trigger: { player: "dying" },
				priority: 10,
				forced: true,
				derivation: ["moyan", "miedao", "jifeng", "swd_xiuluo"],
				content: function () {
					"step 0";
					player.removeSkill("miles_xueyi");
					player.removeSkill("aojian");
					player.removeSkill("mohua2");
					player.addSkill("moyan");
					player.addSkill("miedao");
					player.addSkill("jifeng");
					player.addSkill("swd_xiuluo");

					lib.character.swd_satan = [
						"",
						"qun",
						4,
						["moyan", "miedao", "jifeng", "swd_xiuluo"],
						["temp"],
					];
					if (player.name == "swd_miles") player.name = "swd_satan";
					if (player.name1 == "swd_miles") player.name1 = "swd_satan";
					if (player.name2 == "swd_miles") {
						player.name2 = "swd_satan";
						player.node.avatar2.setBackground("swd_satan", "character");
					} else {
						player.node.avatar.setBackground("swd_satan", "character");
					}
					"step 1";
					player.recover(2);
					"step 2";
					player.draw(2);
				},
			},
			duijue: {
				enable: "phaseUse",
				mark: true,
				unique: true,
				forceunique: true,
				skillAnimation: true,
				filter: function (event, player) {
					if (event.skill) return false;
					return !player.storage.duijue;
				},
				filterTarget: function (card, player, target) {
					if (target.hp <= 1) return false;
					// if(get.mode()=='identity'&&_status.mode=='zhong'&&game.zhu&&!game.zhu.isZhu){
					// 	return target==game.zhong;
					// }
					// if(target.identity=='zhu'||get.is.jun(target)) return false;
					return player != target;
				},
				content: function () {
					player.storage.duijue = true;
					player.awakenSkill("duijue");
					var evt = _status.event;
					for (var i = 0; i < 10; i++) {
						if (evt && evt.getParent) {
							evt = evt.getParent();
						}
						if (evt.name == "phaseUse") {
							evt.skipped = true;
							break;
						}
					}
					player.storage.duijue3 = target;
					player.addSkill("duijue3");
				},
				duijueLoop: function () {
					"step 0";
					targets[0].phase("duijue");
					"step 1";
					ui.duijueLoop.round--;
					ui.duijueLoop.innerHTML = get.cnNumber(ui.duijueLoop.round) + "回合";
					if (targets[0].isDead() || targets[1].isDead() || ui.duijueLoop.round == 0) {
						event.goto(3);
					} else {
						targets[1].phase("duijue");
					}
					"step 2";
					ui.duijueLoop.round--;
					ui.duijueLoop.innerHTML = get.cnNumber(ui.duijueLoop.round) + "回合";
					if (targets[0].isDead() || targets[1].isDead() || ui.duijueLoop.round == 0) {
						event.goto(3);
					} else {
						event.goto(0);
					}
					"step 3";
					for (var i = 0; i < event.backup.length; i++) {
						event.backup[i].in("duijue");
					}
					if (ui.duijueLoop) {
						ui.duijueLoop.remove();
						delete ui.duijueLoop;
					}
				},
				init: function (player) {
					player.storage.duijue = false;
				},
				intro: {
					content: "limited",
				},
				ai: {
					order: 1,
					result: {
						target: function (player, target) {
							if (target.hp == 1 && player.hp >= 3) return -1;
							if (target.hp < player.hp && target.countCards("h") <= player.countCards("h"))
								return -1;
							return 0;
						},
					},
				},
			},
			duijue3: {
				trigger: { player: "phaseAfter" },
				forced: true,
				popup: false,
				priority: -50,
				content: function () {
					var target = player.storage.duijue3;
					delete player.storage.duijue3;
					player.removeSkill("duijue3");
					if (!target.isAlive()) {
						event.finish();
						return;
					}
					var next = player.insertEvent("duijueLoop", lib.skill.duijue.duijueLoop, {
						targets: [target, player],
						num: 0,
						backup: [],
						source: player,
					});
					next.forceDie = true;
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i] != player && game.players[i] != target) {
							game.players[i].out("duijue");
							next.backup.push(game.players[i]);
						}
					}
					if (!ui.duijueLoop) {
						ui.duijueLoop = ui.create.system("六回合", null, true);
						lib.setPopped(
							ui.duijueLoop,
							function () {
								var uiintro = ui.create.dialog("hidden");
								uiintro.add("对决");
								uiintro.addText(get.cnNumber(ui.duijueLoop.round) + "回合后结束");
								uiintro.add(ui.create.div(".placeholder.slim"));
								return uiintro;
							},
							180
						);
						ui.duijueLoop.round = 6;
					}
				},
			},
			duijue2: {
				mod: {
					cardEnabled: function () {
						return false;
					},
					cardSavable: function () {
						return false;
					},
					targetEnabled: function () {
						return false;
					},
				},
				init: function (player) {
					player.classList.add("transparent");
				},
				onremove: function (player) {
					player.classList.remove("transparent");
				},
				intro: {
					content: "不计入距离的计算且不能使用牌且不是牌的合法目标",
				},
				group: "undist",
				trigger: { global: "dieAfter" },
				forced: true,
				popup: false,
				content: function () {
					player.removeSkill("duijue2");
				},
			},
			yueren: {
				trigger: { player: "shaBegin" },
				filter: function (event, player) {
					return !player.hasSkill("yueren2");
				},
				check: function (event, player) {
					return get.attitude(player, event.target) <= 0;
				},
				logTarget: "target",
				content: function () {
					"step 0";
					player.judge(function () {
						return 0;
					});
					player.addTempSkill("yueren2");
					"step 1";
					if (get.color(result.card) == "black") {
						if (trigger.target.countCards("he")) {
							player.discardPlayerCard(true, trigger.target, "he");
							// trigger.target.discard(trigger.target.getCards('he').randomGet());
						}
					} else if (trigger.cards && trigger.cards.length) {
						player.gain(trigger.cards);
						player.$gain2(trigger.cards);
						game.log(player, "收回了", trigger.cards);
					}
				},
			},
			yueren2: {},
			busi: {
				trigger: { player: "dying" },
				priority: 7,
				unique: true,
				forced: true,
				filter: function (event, player) {
					return player.hp <= 0;
				},
				content: function () {
					"step 0";
					player.judge(function (card) {
						return get.suit(card) == "spade" ? -1 : 1;
					});
					"step 1";
					if (result.bool) {
						player.recover(1 - player.hp);
						player.turnOver(true);
					}
				},
				ai: {
					threaten: 0.8,
				},
			},
			xuying: {
				unique: true,
				trigger: { player: "damageBefore" },
				forced: true,
				content: function () {
					trigger.cancel();
					if (player.countCards("h")) player.loseHp();
				},
				ai: {
					effect: {
						target: function (card, player, target) {
							if (get.tag(card, "damage") && target.countCards("h") == 0) return 0;
						},
					},
				},
			},
			yinguo: {
				unique: true,
				trigger: { global: "damageBefore" },
				priority: 6,
				direct: true,
				filter: function (event, player) {
					if (event.player == player || event.source == player) return false;
					if (!event.source) return false;
					if (player.countCards("he") == 0) return false;
					if (player.hasSkill("yinguo2")) return false;
					return true;
				},
				content: function () {
					"step 0";
					var go =
						get.attitude(player, trigger.player) > 0 &&
						get.attitude(player, trigger.source) < 0 &&
						get.damageEffect(trigger.player, trigger.source, player) <
							get.damageEffect(trigger.source, trigger.player, player);
					var next = player.chooseToDiscard(
						"是否将伤害来源（" +
							get.translation(trigger.source) +
							"）和目标（" +
							get.translation(trigger.player) +
							"）对调？",
						"he"
					);
					next.ai = function (card) {
						if (go) {
							return 10 - get.value(card);
						}
						return 0;
					};
					next.logSkill = "yinguo";
					"step 1";
					if (result.bool) {
						var target = trigger.player;
						trigger.player = trigger.source;
						trigger.source = target;
						trigger.trigger("damageBefore");
						player.addTempSkill("yinguo2", ["damageAfter", "damageCancelled"]);
					}
				},
				ai: {
					threaten: 10,
					expose: 0.5,
				},
				global: "yinguo3",
			},
			yinguo2: {},
			yinguo3: {
				ai: {
					effect: {
						target: function (card, player, target) {
							if (!get.tag(card, "damage")) return;
							if (target.hasSkill("yinguo")) return;
							var source = game.findPlayer(function (current) {
								return current.hasSkill("yinguo");
							});
							if (source && source.countCards("he")) {
								if (get.attitude(source, player) < 0 && get.attitude(source, target) > 0) {
									return [0, 0, 0, -1];
								}
							}
						},
					},
				},
			},
			guiyan: {
				unique: true,
				enable: "phaseUse",
				usable: 1,
				intro: {
					content: "濒死时回复1点体力并失去鬼眼",
				},
				mark: true,
				filterTarget: function (card, player, target) {
					return player != target && target.countCards("h");
				},
				content: function () {
					"step 0";
					player.chooseCardButton(target, target.getCards("h")).set("ai", function (button) {
						return get.value(button.link);
					}).filterButton = function (button) {
						return get.suit(button.link) == "club";
					};
					"step 1";
					if (result.bool) {
						player.gain(result.links[0], target);
						target.$giveAuto(result.links[0], player);
					}
				},
				ai: {
					order: 11,
					result: {
						target: -1,
						player: 1,
					},
					threaten: 1.3,
				},
				group: ["guiyan2"],
			},
			guiyan2: {
				trigger: { player: "dying" },
				priority: 6,
				forced: true,
				content: function () {
					player.recover();
					player.removeSkill("guiyan");
					player.removeSkill("guiyan2");
				},
			},
			xianyin: {
				enable: "phaseUse",
				filter: function (event, player) {
					return game.hasPlayer(function (current) {
						return current.countCards("j") && current != player;
					});
				},
				content: function () {
					"step 0";
					event.targets = game.filterPlayer(function (current) {
						return current.countCards("j") && current != player;
					});
					event.targets.sort(lib.sort.seat);
					"step 1";
					if (event.targets.length) {
						event.target = event.targets.shift();
						event.target.discard(event.target.getCards("j"));
						player.line(event.target, "green");
					} else {
						event.finish();
					}
					"step 2";
					if (event.target.countCards("h")) {
						event.target.chooseCard("选择一张手牌交给" + get.translation(player), true).ai =
							function (card) {
								return -get.value(card);
							};
					} else {
						event.goto(1);
					}
					"step 3";
					if (result.bool) {
						player.gain(result.cards[0], target);
						target.$give(1, player);
					}
					event.goto(1);
				},
				ai: {
					order: 9,
					result: {
						player: function (player) {
							var num = 0,
								players = game.filterPlayer();
							for (var i = 0; i < players.length; i++) {
								if (players[i] != player && players[i].countCards("j")) {
									if (
										get.attitude(player, players[i]) >= 0 &&
										get.attitude(players[i], player) >= 0
									) {
										num++;
									} else {
										num--;
									}
								}
							}
							return num;
						},
					},
				},
			},
			mailun: {
				unique: true,
				trigger: { player: "phaseBegin" },
				direct: true,
				intro: {
					content: function (storage) {
						if (!storage) return "无";
						return lib.skill.mailun.effects[storage - 1];
					},
				},
				effects: [
					"减少1点体力并增加1点体力上限",
					"增加1点体力并减少1点体力上限",
					"令你即将造成和即将受到的首次伤害-1",
					"令你即将造成和即将受到的首次伤害+1",
					"少摸一张牌并令手牌上限+1",
					"多摸一张牌并令手牌上限-1",
					"进攻距离+1，防御距离-1",
					"进攻距离-1，防御距离+1",
				],
				content: function () {
					"step 0";
					player.removeSkill("mailun31");
					player.removeSkill("mailun32");
					player.removeSkill("mailun41");
					player.removeSkill("mailun42");
					player.removeSkill("mailun5");
					player.removeSkill("mailun6");
					player.removeSkill("mailun7");
					player.removeSkill("mailun8");
					if (event.isMine()) {
						ui.auto.hide();
						event.dialog = ui.create.dialog("脉轮：选择一个效果", "forcebutton");
						var effects = lib.skill.mailun.effects;
						var clickItem = function () {
							event.choice = this.link;
							game.resume();
						};
						for (var i = 0; i < 8; i++) {
							if (i == 0 && player.maxHp == 6) continue;
							var item = event.dialog.add(
								'<div class="popup pointerdiv" style="width:70%;display:inline-block"><div class="skill">【' +
									get.cnNumber(i + 1, true) +
									"】</div><div>" +
									effects[i] +
									"</div></div>"
							);
							item.addEventListener("click", clickItem);
							item.link = i + 1;
						}
						event.control = ui.create.control("取消", function () {
							event.choice = 0;
							game.resume();
						});
						event.dialog.add(ui.create.div(".placeholder"));
						event.dialog.add(ui.create.div(".placeholder"));
						event.dialog.add(ui.create.div(".placeholder"));
						game.pause();
					} else {
						var ctrl;
						if (player.hp <= 1) {
							if (player.maxHp > 3) {
								ctrl = 2;
							} else {
								ctrl = 3;
							}
						} else if (player.hp == 2) {
							if (player.maxHp > 4) {
								ctrl = 2;
							} else if (player.countCards("h") == 0) {
								ctrl = 6;
							} else {
								ctrl = 3;
							}
						} else if (player.countCards("h") < player.hp) {
							ctrl = 6;
						} else if (player.countCards("h") > player.hp + 1) {
							ctrl = 5;
						}
						event.choice = ctrl;
					}
					"step 1";
					ui.auto.show();
					player.storage.mailun = event.choice;
					game.addVideo("storage", player, ["mailun", player.storage.mailun]);
					if (event.choice) {
						player.logSkill("mailun");
						player.markSkill("mailun");
						switch (event.choice) {
							case 1: {
								player.loseHp();
								player.gainMaxHp();
								break;
							}
							case 2: {
								player.recover();
								player.loseMaxHp();
								break;
							}
							case 3: {
								player.addSkill("mailun31");
								player.addSkill("mailun32");
								break;
							}
							case 4: {
								player.addSkill("mailun41");
								player.addSkill("mailun42");
								break;
							}
							case 5: {
								player.addSkill("mailun5");
								break;
							}
							case 6: {
								player.addSkill("mailun6");
								break;
							}
							case 7: {
								player.addSkill("mailun7");
								break;
							}
							case 8: {
								player.addSkill("mailun8");
								break;
							}
						}
					} else {
						player.unmarkSkill("mailun");
					}
					if (event.dialog) {
						event.dialog.close();
					}
					if (event.control) {
						event.control.close();
					}
				},
			},
			mailun31: {
				trigger: { source: "damageBegin" },
				forced: true,
				content: function () {
					trigger.num--;
					player.removeSkill("mailun31");
				},
			},
			mailun32: {
				trigger: { player: "damageBegin" },
				forced: true,
				content: function () {
					trigger.num--;
					player.removeSkill("mailun32");
				},
			},
			mailun41: {
				trigger: { source: "damageBegin" },
				forced: true,
				content: function () {
					trigger.num++;
					player.removeSkill("mailun41");
				},
			},
			mailun42: {
				trigger: { player: "damageBegin" },
				forced: true,
				content: function () {
					trigger.num++;
					player.removeSkill("mailun42");
				},
			},
			mailun5: {
				trigger: { player: "phaseDrawBegin" },
				forced: true,
				popup: false,
				content: function () {
					trigger.num--;
				},
				mod: {
					maxHandcard: function (player, num) {
						return num + 1;
					},
				},
			},
			mailun6: {
				trigger: { player: "phaseDrawBegin" },
				forced: true,
				popup: false,
				content: function () {
					trigger.num++;
				},
				mod: {
					maxHandcard: function (player, num) {
						return num - 1;
					},
				},
			},
			mailun7: {
				mod: {
					globalFrom: function (from, to, distance) {
						return distance - 1;
					},
					globalTo: function (from, to, distance) {
						return distance - 1;
					},
				},
			},
			mailun8: {
				mod: {
					globalFrom: function (from, to, distance) {
						return distance + 1;
					},
					globalTo: function (from, to, distance) {
						return distance + 1;
					},
				},
			},
			fengming: {
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					return player.countCards("he", { type: "equip" }) > 0;
				},
				filterCard: { type: "equip" },
				position: "he",
				filterTarget: true,
				content: function () {
					"step 0";
					target.recover();
					"step 1";
					target.draw();
				},
				ai: {
					order: 9,
					result: {
						target: function (player, target) {
							if (target.hp < target.maxHp) {
								return get.recoverEffect(target);
							}
						},
					},
				},
			},
			wanjun: {
				enable: "chooseToUse",
				filter: function (event, player) {
					return player.countCards("he", { type: "equip" }) > 0;
				},
				filterCard: function (card) {
					return get.type(card) == "equip";
				},
				position: "he",
				viewAs: { name: "nanman" },
				prompt: "将一张装备牌当南蛮入侵使用",
				check: function (card) {
					var player = _status.currentPhase;
					if (player.countCards("he", { subtype: get.subtype(card) }) > 1) {
						return 11 - get.equipValue(card);
					}
					if (player.countCards("h") < player.hp) {
						return 6 - get.value(card);
					}
					return 2 - get.equipValue(card);
				},
				ai: {
					order: 9,
					threaten: 1.1,
				},
			},
			huanling: {
				trigger: { player: "phaseEnd" },
				direct: true,
				content: function () {
					"step 0";
					player.chooseTarget(get.prompt("huanling"), function (card, player, target) {
						return player != target;
					}).ai = function (target) {
						if (target.hasSkillTag("noturn")) return 0;
						var att = get.attitude(player, target);
						if (target.isTurnedOver()) {
							if (att > 0) {
								return att + 5;
							}
							return -1;
						}
						if (player.isTurnedOver()) {
							return 5 - att;
						}
						if (att <= -3) {
							return -att;
						}
						return 0;
					};
					"step 1";
					if (result.bool) {
						player.logSkill("huanling", result.targets);
						player.turnOver();
						result.targets[0].turnOver();
					}
				},
				group: "huanling2",
				ai: {
					effect: {
						target: function (card, player, target, current) {
							if (target.isTurnedOver()) {
								if (get.tag(card, "damage")) return "zeroplayertarget";
							}
						},
					},
					expose: 0.2,
				},
			},
			huanling2: {
				trigger: { player: "damageBefore" },
				filter: function (event, player) {
					return player.isTurnedOver();
				},
				forced: true,
				content: function () {
					trigger.cancel();
				},
			},
			ljifeng: {
				mod: {
					selectTarget: function (card, player, range) {
						if (card.name == "sha" && range[1] != -1) range[1] += player.maxHp - player.hp;
					},
					attackFrom: function (from, to, distance) {
						return distance + from.hp - from.maxHp;
					},
				},
			},
			lxianglong: {
				trigger: { target: "shaMiss" },
				priority: 5,
				direct: true,
				content: function () {
					"step 0";
					player.chooseTarget(function (card, player, target) {
						return player.canUse("sha", target);
					}, get.prompt("lxianglong")).ai = function (target) {
						return get.effect(target, { name: "sha" }, player, player);
					};
					"step 1";
					if (result.bool) {
						player.logSkill("lxianglong", result.targets);
						player.useCard({ name: "sha" }, trigger.cards, result.targets).animate = false;
						game.delay();
					}
				},
				ai: {
					effect: {
						target: function (card, player, target) {
							if (card.name == "sha" && target.countCards("h")) return 0.7;
						},
					},
				},
			},
			zhenjiu: {
				enable: "phaseUse",
				usable: 1,
				filterCard: { color: "red" },
				filterTarget: function (card, player, target) {
					return !target.hasSkill("zhenjiu2");
				},
				check: function (card) {
					return 8 - get.value(card);
				},
				discard: false,
				prepare: "give",
				content: function () {
					target.storage.zhenjiu2 = cards[0];
					game.addVideo("storage", target, [
						"zhenjiu2",
						get.cardInfo(target.storage.zhenjiu2),
						"card",
					]);
					target.addSkill("zhenjiu2");
				},
				ai: {
					result: {
						target: function (player, target) {
							if (target.hp < target.maxHp) {
								return target == player ? 1 : 1.5;
							}
							if (player.countCards("h") > player.hp) return 0.5;
							return 0;
						},
					},
					order: 9,
					threaten: 1.7,
				},
			},
			zhenjiu2: {
				trigger: { player: "phaseBegin" },
				forced: true,
				mark: "card",
				content: function () {
					player.recover();
					player.gain(player.storage.zhenjiu2, "gain2", "log");
					player.removeSkill("zhenjiu2");
					delete player.storage.zhenjiu2;
				},
				intro: {
					content: "card",
				},
			},
			shoulie: {
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
					var next = player.chooseToDiscard(get.prompt("shoulie", trigger.target));
					next.ai = function (card) {
						if (dis) return 7 - get.value(card);
						return 0;
					};
					next.logSkill = "shoulie";
					"step 1";
					if (result.bool) {
						trigger.directHit = true;
					}
				},
			},
			hudun: {
				trigger: { source: "damageEnd" },
				forced: true,
				filter: function (event, player) {
					return !player.hujia && event.player != player;
				},
				content: function () {
					player.changeHujia();
					player.update();
				},
			},
			toudan: {
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					return player.countCards("he", { suit: "spade" });
				},
				filterTarget: function (card, player, target) {
					return player != target;
				},
				filterCard: { suit: "spade" },
				check: function (card) {
					return 10 - get.value(card);
				},
				position: "he",
				line: "fire",
				content: function () {
					"step 0";
					target.damage("fire");
					event.targets = game.filterPlayer(function (current) {
						return get.distance(target, current) <= 1;
					});
					event.targets.sortBySeat(event.target);
					event.targets.unshift(player);
					"step 1";
					if (event.targets.length) {
						var current = event.targets.shift();
						if (current.countCards("he")) {
							current.chooseToDiscard("he", true);
						}
						event.redo();
					}
				},
				ai: {
					result: {
						target: function (player, target) {
							return get.damageEffect(target, player, target, "fire");
						},
					},
					order: 10,
					threaten: 1.5,
				},
			},
			shending: {
				inherit: "longfan",
				filter: function (event, player) {
					return !player.getEquip(5);
				},
				ai: {
					order: 11,
					result: {
						player: 1,
					},
					effect: {
						target_use: function (card, player, target) {
							if (player != target) return;
							if (get.subtype(card) == "equip5") {
								if (get.equipValue(card) <= 7) return 0;
							}
						},
					},
					threaten: 1.2,
				},
			},
			poxiao: {
				mod: {
					attackFrom: function (from, to, distance) {
						if (!from.getEquip(1)) return distance - 1;
					},
					selectTarget: function (card, player, range) {
						if (!player.getEquip(1) && card.name == "sha") range[1]++;
					},
				},
				enable: "chooseToUse",
				filterCard: { type: "equip" },
				filter: function (event, player) {
					return player.countCards("he", { type: "equip" });
				},
				position: "he",
				viewAs: { name: "sha" },
				prompt: "将一张闪当杀使用或打出",
				check: function (card) {
					if (get.subtype(card) == "equip1") return 10 - get.value(card);
					return 7 - get.equipValue(card);
				},
				ai: {
					order: function () {
						return get.order({ name: "sha" }) + 0.1;
					},
					effect: {
						target_use: function (card, player) {
							if (get.subtype(card) == "equip1") {
								var num = 0,
									players = game.filterPlayer();
								for (var i = 0; i < players.length; i++) {
									if (get.attitude(player, players[i]) < 0) {
										num++;
										if (num > 1) return "zeroplayertarget";
									}
								}
							}
						},
					},
				},
			},
		},
		translate: {
			swd_yangshuo: "杨硕",
			swd_septem: "赛特",
			swd_yuxiaoxue: "于小雪",
			swd_lilian: "莉莲",
			swd_cheyun: "车芸",
			swd_jipeng: "疾鹏",
			swd_muyun: "徐暮云",
			swd_zhaoyun: "皇甫朝云",
			swd_jiliang: "姬良",
			swd_lanyin: "兰茵",
			swd_zhiyin: "芝茵",
			swd_hengai: "横艾",
			swd_huzhongxian: "壶中仙",
			swd_qiner: "磬儿",
			swd_huanyuanzhi: "桓远之",
			swd_murongshi: "慕容诗",
			swd_hupo: "琥珀",
			swd_miles: "麦尔斯",
			swd_kangnalishi: "康那里士",
			swd_satan: "撒旦",
			swd_philis: "菲力斯",
			swd_weida: "薇达",
			swd_fengtianling: "凤天凌",
			swd_huyue: "瑚月",
			swd_jiting: "姬亭",
			swd_rongshuang: "蓉霜",
			swd_zhuoshanzhu: "浊山铸",
			swd_jialanduo: "迦兰多",
			swd_linming: "林明",
			swd_duanmeng: "端蒙",
			swd_nicole: "妮可",
			swd_kendi: "肯迪",
			swd_lijing: "李靖",
			swd_hanteng: "韩腾",
			swd_yuwentuo: "宇文拓",
			swd_shanxiaoxiao: "单小小",
			swd_yuchiyanhong: "尉迟嫣红",
			swd_pepin: "丕平",
			swd_anka: "安卡",
			swd_jiangwu: "疆梧",
			swd_situqiang: "司徒蔷",
			swd_tuwei: "徒维",
			swd_yeyaxi: "耶亚希",
			swd_chunyuheng: "淳于恒",
			swd_duguningke: "独孤宁珂",
			swd_chenjingchou: "陈靖仇",
			swd_zhanglie: "张烈",
			swd_guyue: "古月圣",
			swd_kama: "卡玛",
			swd_yuli: "玉澧",
			swd_duopeng: "多鹏",
			swd_jiangziya: "姜子牙",
			swd_heran: "何然",
			swd_zhanggao: "张诰",
			swd_hanlong: "韩龙",
			swd_jiuyou: "久悠",
			swd_qingming: "青冥",
			swd_shangzhang: "尚章",
			swd_youzhao: "游兆",
			swd_wangsiyue: "王思月",
			swd_huanglei: "黄雷",
			swd_tuobayuer: "拓跋玉儿",
			swd_chengyaojin: "程咬金",
			swd_qinshubao: "秦叔宝",
			swd_lishimin: "李世民",
			swd_shuijing: "水镜",
			swd_xuanyuanjianxian: "轩辕剑仙",
			swd_xuanyuanjiantong: "轩辕剑童",
			swd_luchengxuan: "陆承轩",
			swd_xiarou: "夏柔",
			swd_moye: "莫耶",
			swd_fu: "毛民·福",
			swd_hanluo: "寒洛",
			swd_linyue: "临月",
			swd_zidashu: "子大暑",
			swd_maixing: "麦星",
			swd_haidapang: "海大胖",
			swd_shaowei: "少微",
			swd_fuyan: "符验",
			swd_huiyan: "慧彦",
			swd_sikongyu: "司空宇",
			swd_muyue: "沐月",
			swd_ziqiao: "子巧",
			swd_fengyu: "凤煜",
			swd_qi: "柒",
			swd_chenfu: "陈辅",
			swd_libai: "李白",
			swd_xingtian: "刑天",
			swd_lanmoshen: "蓝魔神",
			swd_wushi: "巫师",
			swd_quxian: "屈娴",
			swd_xiyan: "犀衍",
			swd_shuwaner: "舒莞儿",
			swd_xiaohuanglong: "小黄龙",

			cyshuiyun: "水云",
			cyshuiyun_info:
				"准备阶段，你可以弃置一名其他角色的一张牌；每当你失去此技能，你可以弃置一名其他角色的一张牌。",
			cyliuzi: "流紫",
			cyliuzi_info: "摸牌阶段，你可以额外摸一张牌；每当你失去此技能，你可以摸一张牌。",
			cyyijin: "异金",
			cyyijin_info:
				"出牌阶段，你可以对一名体力值为全场最多的角色造成1点伤害；每当你失去此技能，你可以对一名体力值为全场最多的角色造成1点伤害。",
			cyqingling: "青凌",
			cyqingling_info:
				"弃牌阶段，若你弃置了至少一张牌，你可以获得1点护甲；每当你失去此技能，你可以获得1点护甲。",
			cyqiandian: "千靛",
			cyqiandian_info:
				"结束阶段，你可以视为使用一张惊雷闪；每当你失去此技能，你可以视为使用一张惊雷闪。",
			gxianyin: "仙音",
			gxianyin_info:
				"出牌阶段限一次，你可以选择一种花色，将你的手牌中该花色的牌移至弃牌堆，然后选择另一种花色，从牌堆中获得等量的该花色的牌。",
			// gxianyin_info_alter:'',
			cyxianjiang: "仙匠",
			cyxianjiang_info:
				"每当你使用一张牌指定唯一目标时，你可以复制对方装备区内的一张你没有的牌，并置入你的装备区，每回合对一名角色最多发动一次。",
			cyqiaoxie: "巧械",
			cyqiaoxie_info: "每当你失去一张装备牌（使用除外），你可以随机观看三张机关牌，并使用其中一张。",
			cyqiaoxie_info_alter:
				"每当你装备一件装备，若你的手牌数不大于体力值，你可以摸一张牌；每当你失去一件装备牌，你可以随机观看2张机关牌，并使用其中一张。",
			cylingjia: "灵甲",
			cylingjia_info:
				"出牌阶段限一次，你可以弃置一张装备牌，然后令云狐随机装备一件装备（不替换现有装备）并将其强化。",
			cyqiaobo: "巧补",
			cyqiaobo_info: "出牌阶段限一次，你可以弃置一张锦囊牌，然后令云狐回复1点体力。",
			cqiaoxie: "巧械",
			cqiaoxie_info:
				"出牌阶段限一次，你可以将一张锦囊牌当作零件袋使用；每当你使用一张零件牌，你获得1点技能点数。",
			xiufu: "修复",
			xiufu_info: "出牌阶段，你可以弃置一张装备牌或机关牌，令云狐回复1点体力。",
			yhshengong: "神工",
			yhshengong_info:
				"游戏开始时，你获得3点技能点数；每当你造成1点伤害，你获得1点技能点数；出牌阶段，你可以通过消耗技能点令云狐获得新的技能（云狐体力为0时无法学习或发动技能）。",
			juxi: "聚息",
			juxi_info:
				"锁定技，每当一名角色于其回合外弃置牌，你获得一枚聚息标记；出牌阶段限一次，你可以移去X枚聚息标记，然后选择一项：对一名角造成1点伤害，或令一名角色回复1点体力，X为存活角色数。",
			yeying: "曳影",
			yeying_info: "出牌阶段限一次，你可以将一张黑色牌当作乾坤镖使用。",
			jiefen: "解纷",
			jiefen_info:
				"出牌阶段限一次，你可以令一名手牌数多于你的角色交给你一张牌，然后你交给一名手牌数少于你的角色一张牌。",
			datong: "大同",
			datong_info:
				"任意一名角色的结束阶段，若全场手牌数最多和最少的角色手牌数之差不超过1，你摸两张牌。",
			huodan: "火丹",
			huodan_info:
				"出牌阶段限一次，你可以弃置一张红色牌并失去1点体力，然后将2点火属性伤害分配给1~2名角色。",
			huodan_info_alter:
				"出牌阶段限一次，你可以弃置一张红色牌并失去1点体力，然后将2点火属性伤害分配给1~2名角色；若你只分配了一名角色，该角色在结算后摸一张牌。",
			sxianjing: "陷阱",
			sxianjing_bg: "阱",
			sxianjing_info:
				"出牌阶段，你可以将一张手牌背面朝上置于你的武将牌上（不能与已有花色相同）。当一名其他角色使用与一张“陷阱”牌花色相同的牌指定你为目标时，你移去对应的“陷阱”牌，然后随机获得该角色的一张牌。每当你受到一次伤害，你随机将一张“陷阱”牌返回手牌。",
			zhanxing: "占星",
			zhanxing_info:
				"出牌阶段限一次，你可以弃置任意张牌，并亮出牌堆顶的等量的牌，并根据亮出的牌包含的花色执行以下效果：♦︎摸两张牌；♥回复1点体力（若未损失体力改为获得1点护甲）；♣令所有敌人随机弃置一张牌；♠令一名角色受到1点无来源的雷属性伤害。",
			kbolan: "博览",
			kbolan_info: "每当你摸牌时，你可以额外摸一张牌，然后摸牌结束时将一张手牌置于牌堆顶。",
			gaizao: "改造",
			gaizao_info:
				"每当你即将装备一张牌（特殊类装备除外），若你的装备区内对应位置已有牌，你可以永久改变此牌的装备类型使其装备在装备区内的空余位置。",
			lingshi: "灵矢",
			lingshi_info:
				"你的装备区内每有一张牌，你的攻击范围+2；当你的装备区内有武器牌或防具牌时，你的【杀】不可闪避；当你的装备区内有马时，你摸牌阶段额外摸一张牌；当你的装备内的宝物牌时，你回合内可以额外使用一张【杀】。",
			tiebi: "铁壁",
			tiebi_info:
				"当距离你1以内的一名角色成为【杀】的目标时，若其没有护甲，你可以弃置一张黑色手牌使其获得1点护甲。",
			shenyan: "神炎",
			shenyan_bg: "炎",
			shenyan_info:
				"限定技，当你即将造成火焰伤害时，你可以令此伤害+1，并对目标距离1以内的所有其他角色各造成1点火焰伤害。",
			xuanying: "旋影",
			xuanying_info:
				"你可以横置你的武将牌，视为使用一张无视距离的【杀】；每当你于回合外失去牌，你可以竖置你的武将牌，视为使用一张无视距离的【杀】。",
			hwendao: "问道",
			hwendao_info:
				"每当你于回合外使用或打出一张牌，你可以令当前回合角色弃置一张与之花色相同的牌，否则你获得其一张牌。",
			lingfeng: "凌锋",
			lingfeng_info:
				"结束阶段，若你本回合内使用了至少X张牌，你可以选择一项：获得1点护甲，或对攻击范围内的一名角色造成1点伤害（X为你当前的体力值且最多为3）。",
			hxunzhi: "殉志",
			hxunzhi_info:
				"限定技，出牌阶段，你可以视为使用一张万箭齐发并获得技能武圣、咆哮，若如此做，你在此阶段结束时死亡。",
			hxunzhi_info_alter:
				"限定技，出牌阶段，你可以获得技能武圣、咆哮，若如此做，你在此阶段结束时死亡。",
			lmazui: "麻醉",
			lmazui2: "麻醉",
			lmazui_info:
				"出牌阶段限一次，你可以将一张黑色手牌置于一名角色的武将牌上，该角色造成的下一次伤害-1，然后获得此牌。",
			hyunshen: "云身",
			hyunshen2: "云身",
			hyunshen_info:
				"每当你打出一张闪，你可以令你的防御距离+1；准备阶段，你将累计的防御距离清零，然后摸等量的牌。",
			hlingbo: "凌波",
			hlingbo_info: "每当你使用或打出一张闪，你可以摸两张牌。",
			gtiandao: "天道",
			gtiandao_info: "任意一名角色的判定生效前，你可以打出一张牌替换之。",
			nlianji: "连计",
			nlianji_info:
				"出牌阶段限一次，你可以选择一张手牌并指定两名角色进行拼点。若拼点结果不为平局，拼点赢的角色获得此牌，并对没赢的角色造成1点伤害。",
			fengze: "风泽",
			fengze_info: "出牌阶段限一次，你可以将一张黑色牌当作桃园结义使用。",
			lingyue: "凌月",
			lingyue_info: "每当你使用一张【杀】，你可以令目标弃置一张牌。",
			jinlin: "金鳞",
			jinlin_info:
				"限定技，出牌阶段，你可以令任意名角色各获得3点护甲，获得护甲的角色于每个准备阶段失去1点护甲，直到首次失去所有护甲或累计以此法失去3点护甲。",
			huanxia: "幻霞",
			huanxia_info: "你可以将一张红色牌当作【杀】使用，若此【杀】未造成伤害，你在结束阶段收回此牌。",
			jufu: "巨斧",
			jufu_info: "锁定技，当你有武器牌时，【杀】造成的伤害+1。",
			huajing: "化精",
			huajing_info: "每当你使用锦囊牌造成伤害，可以回复1点体力并摸一张牌。",
			pingxu: "冯虚",
			pingxu_info: "锁定技，当你没有武器牌时，你的进攻距离+1；当你没有防具牌时，你的防御距离+1。",
			yudun: "愚钝",
			yudun_info: "锁定技，你无法使用锦囊牌；你可以将两张锦囊牌当作一张不计入出杀次数的【杀】使用。",
			bingfeng: "冰封",
			bingfeng2: "冰封",
			bingfeng_info:
				"限定技，出牌阶段，你可以指定至多三个目标与其一同翻面，且处于翻面状态时不能使用或打出手牌；若如此做，你失去技能玄咒并减少1点体力上限。",
			guozao: "聒噪",
			guozao_info:
				"锁定技，每当距离你1以内的角色受到一次伤害，若伤害来源不你，你须观看牌堆顶的三张牌，然后指定距离2以内的一名有手牌角色将手牌与这些牌交换。",
			guozao_info_alter:
				"锁定技，每当距离你1以内的角色受到一次伤害，若伤害来源不你，你须观看牌堆顶的三张牌，然后指定距离1以内的一名有手牌角色将手牌与这些牌交换。",
			heihuo: "黑火",
			heihuo_info:
				"出牌阶段，你可以弃置一张装备牌，令你的手牌数加倍；若你的手牌因此达到8张或更多，你立即受到3点火焰伤害且本回合内不能再次发动黑火。",
			yaotong: "妖瞳",
			yaotong1: "妖瞳",
			yaotong2: "妖瞳",
			yaotong3: "妖瞳",
			yaotong4: "妖瞳",
			yaotong_info:
				"当你的手牌数为奇数时，你可以将一张手牌当作【杀】或【闪】使用或打出，当你的手牌数为偶数时，你可以将一张手牌当作无懈可击使用。",
			yaotong_info_alter:
				"当你的手牌数为奇数时，你可以将一张手牌当作【杀】使用或打出，当你的手牌数为偶数时，你可以将一张手牌当作无懈可击使用。",
			pojian: "破茧",
			pojian_info: "每当你失去最后一张手牌，可以从牌堆中获得一张装备牌并装备之。",
			huajin: "化金",
			huajin2: "化金",
			huajin_info: "出牌阶段限一次，你可以弃置一张牌令你造成的伤害+1，直到你的下一回合开始。",
			poxiao: "破霄",
			poxiao_info:
				"你可以将一张装备牌当【杀】使用；当你没有武器牌时，你的攻击范围+1，【杀】可以额外指定一个目标。",
			jianji: "箭疾",
			jianji_info:
				"你可以将一张装备牌当【杀】使用，然后摸一张牌，此【杀】无视距离和防具，且不计入回合内出杀限制。",
			yuchen: "浴尘",
			yuchen_info: "每当你于回合外使用或打出一张黑色牌，你可以弃置一名角色的一张牌。",
			huangyu: "凰羽",
			huangyu_info: "出牌阶段限一次，你可以将两张红色牌当炽羽袭使用。",
			bingjian: "冰箭",
			bingjian_info:
				"出牌阶段限一次，你可以弃置一张黑色的【杀】，令一名有手牌的其他角色展示手牌并弃置其中的所有闪，若其没有闪则受到1点雷电伤害。",
			rumeng: "入梦",
			rumeng_info:
				"其他角色的出牌阶段前，你可以弃置一张非基本牌，并令其选择一项：弃置一张基本牌，或跳过出牌及弃牌阶段。",
			lianda: "连打",
			lianda_info: "当你使用【杀】结算完毕后，可以弃置一张牌视为对目标再使用一张【杀】。",
			xianghui: "祥晖",
			xianghui_info:
				"出牌阶段限一次，你可以弃置一张红色手牌，然后令场上体力值最少的角色各回复1点体力。",
			huiqi: "回气",
			huiqi_info: "每当你受到一次伤害，可令一名其他角色摸X张牌，X为你已损失的体力值。",
			toudan: "投弹",
			toudan_info:
				"出牌阶段限一次，你可以弃置一张黑桃牌对一名其他角色造成1点火焰伤害，然后你与距离该角色1以内的所有角色各弃置一张牌。",
			shending: "神丁",
			shending_info: "锁定技，若你没有宝物牌，视为装备了蓝格怪衣。",
			shoulie: "狩猎",
			shoulie_info: "当你使用一张【杀】指定目标后，可以弃置一张手牌令此【杀】不可闪避。",
			hudun: "盾甲",
			hudun_bg: "盾",
			hudun2: "盾甲",
			hudun_info: "锁定技，当你对其他角色造成伤害后，若你没有护甲，你获得1点护甲值。",
			zhenjiu: "针灸",
			zhenjiu2: "针灸",
			zhenjiu_info:
				"出牌阶段限一次，你可以将一张红色手牌置于一名角色的武将牌上，该角色于下一个准备阶段回复1点体力，然后获得此牌。",
			ljifeng: "疾风",
			ljifeng_info: "锁定技，你的攻击范围+X，【杀】可以额外指定X个目标，X为你已损失的体力值。",
			lxianglong: "翔龙",
			lxianglong_info: "每当你闪避一张【杀】，你可以视为使用一张【杀】。",
			shangxi: "伤袭",
			shangxi_info:
				"准备阶段，你可以弃置一张牌，并对攻击范围内一名体力值不小于你的其他角色造成1点伤害。",
			fzhenwei: "镇威",
			fzhenwei_info: "在你的回合内，你可以将其他角色打出的卡牌交给除该角色外的任意一名角色。",
			fuyan: "覆岩",
			fuyan2: "覆岩",
			fuyan_info: "每当你受到一次伤害，可以令一名没有护甲的角色获得1点护甲值。",
			guaili: "怪力",
			guaili_info: "锁定技，你的【杀】造成的伤害+1，造成伤害后需弃置两张手牌。",
			xingzhui: "星坠",
			xingzhui_info:
				"出牌阶段限一次，你可以弃置一张牌，并令一名有牌的其他角色弃置一张类别相同的牌，否则受到1点伤害。",
			lingxian: "凌仙",
			lingxian_info:
				"每当你于回合外使用或打出一张手牌，你可以选择攻击范围外的一名其他角色与你各摸一张牌。",
			shouyin: "守印",
			shouyin_info:
				"限定技，当任意一名角色处于濒死状态时，若你的武将牌正朝上，可以将武将牌翻面，然后令场上所有存活角色将体力回复至体力上限。",
			shouyin_info_alter:
				"限定技，当任意一名角色处于濒死状态时，若你的武将牌正朝上，可以将武将牌翻面，然后令场上所有存活角色回复2点体力。",
			hutian: "护天",
			hutian2: "护天",
			hutian3: "护天",
			hutian_info:
				"结束阶段，你可以将任意张牌置于一名角色的武将牌上，则该角色的体力值始终不能小于“护天”牌数；在你的下一个结束阶段，该角色获得武将牌上的“护天”牌（在此回合不能再次发动）。",
			linyun: "凌云",
			linyun_info: "你可以将两张牌当作【杀】使用，此【杀】需要额外一张闪才能闪避。",
			sliufeng: "流风",
			sliufeng_info: "锁定技，体力值不大于你的角色视为在你的攻击范围。",
			chengjian: "承剑",
			chengjian_info: "每当其他角色使用【杀】造成一次伤害，你可以令其摸一张牌。",
			huanling: "幻灵",
			huanling2: "幻灵",
			huanling_info: "结束阶段，你可以选择一名角色与你同时翻面；翻面状态下，你防止一切伤害。",
			xielei: "挟雷",
			xielei_info: "每当你使用或打出一张【杀】，可以弃置一张牌并对目标以外的一名角色造成1点雷电伤害。",
			dangping: "荡平",
			dangping_info:
				"每当你造成一次伤害，可以弃置一张手牌对其距离1以内的另一名角色造成1点伤害，每回合限一次。",
			duishi: "对诗",
			duishi_info:
				"出牌阶段，你可以弃置一张手牌，并指定一名有手牌的角色选择一项：1)弃置一张与之花色相同的手牌，本回合内对诗不能再次指定其为目标，2)令你获得其一张牌，对诗失效直到回合结束。",
			anlianying: "连营",
			anlianying_info: "每当你失去最后一张手牌，可摸两张牌。",
			lianwu: "连舞",
			lianwu_info: "锁定技，你的【杀】可以额外指定一个目标，你的红【杀】不可被闪避。",
			jiying: "疾鹰",
			jiying_info: "锁定技，你使用【杀】无视距离。",
			daofa: "道法",
			daofa_info: "每当有一名其他角色造成伤害，你可以令其弃置一张牌。",
			xiaomoyu: "魔愈",
			xiaomoyu_info:
				"锁定技，每当你于一个回合内首次造成伤害，你回复1点体力，若你没有受伤，则改为摸一张牌。",
			yihua: "移花",
			yihua_info: "每当你成为其他角色的某张卡牌的唯一目标时，你可以弃置两张手牌，将使用者与目标对调。",
			youyin: "游吟",
			youyin_info: "每当有其他角色弃置卡牌时，若其中有非基本牌且你的手牌数不超过5，你可以摸一张牌。",
			rexue: "热血",
			rexue_info: "任意一名角色的准备阶段，你可以对其使用一张【杀】，并摸一张牌。",
			huopu: "火瀑",
			huopu_info: "出牌阶段限一次，你可以将一张红桃牌当作流星火羽使用。",
			lingwu: "灵舞",
			lingwu_info:
				"回合结束后，若你在本回合内使用的牌数不少于当前体力值，你可以进行一个额外的回合（不可重复发动）。",
			lingxin: "灵心",
			lingxin_info: "结束阶段，你可以亮出牌堆顶的三张牌，然后获得其中的红桃牌。",
			fushen: "附身",
			fushen_info: "回合开始前，你可以将自己移出游戏，并代替另一名角色进行一回合，然后失去1点体力。",
			fushen2: "附身",
			wangchen: "忘尘",
			wangchen_info: "弃牌阶段结束时，若你于此阶段弃置了基本牌，你可以令一名角色翻面。",
			wangchen_info_alter:
				"弃牌阶段结束时，若你于此阶段弃置了基本牌，你可以令一名角色翻面并获得1点护甲。",
			// wangchen_info:'若你于弃牌阶段弃置了基本牌，可令一名角色翻面。',
			// wangchen_info:'弃牌阶段结束时，若你于此阶段弃置了基本牌，可将一名其他角色移出游戏直到你死亡或下一回合开始。',
			guiyin: "归隐",
			guiyin_info: "若你于弃牌阶段弃置了至少两张牌，你可以摸两张牌。",
			shejie: "设界",
			shejie2: "设界",
			shejie_info: "每当你受到一次伤害，可以令伤害来源不能使用或打出其手牌，直到其下一回合开始。",
			yinyue: "引月",
			yinyue_info:
				"每当有一名角色回复一次体力，你可以令其摸一张牌，若该角色不是你且你的手牌数不大于该角色，你也摸一张牌。",
			yinyue_info_alter: "每当有一名角色回复一次体力，你可以令其摸一张牌。",
			mohua2: "魔化",
			mohua2_info: "锁定技，当你进入濒死状态时，你立即变身为撒旦，将体力回复至２，然后摸两张牌。",
			moyan: "血焰",
			moyan_info:
				"出牌阶段，你可以弃置X张红色手牌，然后对至多X名角色各造成1点火焰伤害，X为你已损失的体力值。每阶段限一次。",
			aojian: "傲剑",
			aojian_info:
				"出牌阶段，你可以弃置X张手牌，然后对攻击范围内至多X名角色各造成1点伤害，X为你已损失的体力值。每阶段限一次。",
			huanxing: "幻形",
			huanxing2: "幻形",
			huanxing_info:
				"准备阶段，你可以弃置一张牌并选择一名男性角色，获得其所有技能，直到你首次受到伤害。",
			meihuo: "魅惑",
			meihuo_info:
				"每当你失去最后一张装备牌，你可以获得一名其他角色的一张牌，若此牌来自装备区，你立即装备之。",

			touxi: "偷袭",
			touxi_info:
				"在其他角色的结束阶段，你可以进行一次判定，若结果为黑色，你对其造成1点雷电伤害，且直到下一回合开始不能再次发动偷袭；若结果为红色，对方可以弃置你的一张牌。",
			touxi_info_alter:
				"在其他角色的结束阶段，你可以进行一次判定，若结果为黑色，你对其造成1点雷电伤害，且直到下一回合开始不能再次发动偷袭；若结果为红色，对方可以获得你的一张牌。",
			minjing: "明镜",
			minjing_info: "若你没有防具牌，你视为装备了光纱天衣。",
			jqimou: "奇谋",
			jqimou_info: "每当你于回合外受到一次伤害，你可以摸一张牌，并可以使用一张牌。",
			mufeng: "沐风",
			mufeng_info: "结束阶段，若你本回合使用过基本牌，则可发现一张牌。",
			mufeng_info_alter: "结束阶段，你可以将手牌数补至当前体力值。",
			lexue: "乐学",
			lexue_info:
				"回合内，你随机获得制衡、集智、缔盟、驱虎中的一个技能；回合外，你随机获得遗计、急救、鬼道、反馈中的一个技能。",
			mingfu: "冥缚",
			mingfu_info: "出牌阶段限一次，你可以将一张梅花牌当鬼幽结使用。",

			miedao: "灭道",
			miedao1: "灭道",
			miedao2: "灭道",
			miedao_info:
				"锁定技，摸牌阶段，你额外摸X张牌；弃牌阶段，你至少须弃X张牌（不足则全弃），X为你已损失的体力值。",

			senluo: "森罗",
			senluo_info:
				"出牌阶段限一次，若你的手牌数为全场最少或之一，你可以令所有有手牌的其他角色弃置两张手牌然后摸一张牌。",
			polang: "破浪",
			polang_info: "每当你造成一次伤害，可以一张对方的装备牌。",
			jikong: "亟空",
			jikong2: "亟空",
			jikong_info:
				"准备阶段，你可以指定一名角色视为对其使用一张雷【杀】；每当你失去最后一张手牌，你可以指定一名角色视为对其使用一张雷【杀】（每回合限发动一次）。",
			jikong_info_alter: "准备阶段，你可以指定一名角色视为对其使用一张雷【杀】。",
			hujing: "壶境",
			hujing_info:
				"锁定技，准备阶段，若弃牌堆中有炼妖壶，你装备之；当你的装备区内有炼妖壶时，你的手牌上限+2。",
			huajian: "化剑",
			huajian_info: "出牌阶段结束时，你可以将一张牌当作【杀】对任意一名角色使用。",
			xuanyuan: "轩辕",
			xuanyuan_info:
				"锁定技，你无视【轩辕剑】的装备条件及失去体力的效果；结束阶段，你可以弃置一张黑桃牌从弃牌堆中获得【轩辕剑】并装备之。",
			jilve: "极略",
			jilve_backup: "极略",
			jilve2: "极略",
			jilve_info: "出牌阶段，你可以观看牌堆顶的三张牌，然后使用其中的非装备牌。每回合最多发动三次。",
			jilve_info_alter:
				"出牌阶段，你可以观看牌堆顶的两张牌，然后使用其中的非装备牌。每回合最多发动三次。",
			gongshen: "工神",
			gongshen_info: "任意一名其他角色使用一张基本牌或锦囊牌指定目标后，你可以弃置一张装备牌令其失效。",

			swdliuhong: "流虹",
			swdliuhong_info: "每当你使用一张【杀】，可以摸一张牌。",
			poyue: "破月",
			poyue_info: "锁定技，你的黑【杀】无视距离，红【杀】不计入回合内的出杀限制且不可闪避。",
			poyue_info_alter: "锁定技，你的黑【杀】无视距离，红【杀】不可闪避。",
			mojian: "墨剑",
			mojian_info: "每当你使用【杀】并指定目标后，你可以令其摸一张牌，然后你回复1点体力。",
			duanyue: "断月",
			duanyue_info: "出牌阶段限一次，你可以弃置一张装备牌，对一名其他角色造成1点伤害。",
			tuzhen: "突阵",
			tuzhen_info: "当你造成一次伤害后，你可以弃置对方手牌中的非基本牌。",
			tuzhen_info_alter: "当你造成一次伤害后，你可以弃置对方手牌中的一张非基本牌。",
			pozhou: "破咒",
			pozhou_bg: "破",
			pozhou2: "破咒",
			pozhou_info:
				"每当你受到一次伤害，你获得一枚破咒标记。出牌阶段，你可以指定任意名其他角色并弃置等量的破咒标记，令目标的非锁定技失效直到其下一回合结束。",
			xuanzhou: "玄咒",
			xuanzhou_info:
				"出牌阶段限一次，你可以将一张普通锦囊牌当作任意一张延时锦囊，对任意一名角色使用（无视锦囊使用范围限制）。",
			ningxian: "凝霰",
			ningxian_info: "每当你受到一次伤害，你可以弃置任意张黑色牌并选择等量其他角色对其各造成1点伤害。",
			guanhu: "贯鹄",
			guanhu_info: "每当你使用【杀】造成伤害，你可以弃置对方一张手牌和一张装备牌。",
			fengming: "凤鸣",
			fengming_info: "出牌阶段限一次，你可以弃置一张装备牌，令一名角色恢复1点体力并摸一张牌。",
			duanxing: "锻星",
			duanxing_info: "每当你装备一张未强化的装备牌，可以视为一名角色使用一张【杀】。",
			wanjun: "万钧",
			wanjun_info: "你可以将一张装备牌当作南蛮入侵使用。",
			dunxing: "遁形",
			dunxing_info:
				"当你成为其他角色卡牌的目标时，你可以弃置一张牌并进行一次判定，若不为红桃，则取消之。",
			guiying: "鬼影",
			guiying_info: "你可以将一张黑色牌当偷梁换柱使用。",
			shehun: "摄魂",
			shehun_info:
				"出牌阶段限一次，你可以弃置任意张花色不同的牌，另一名其他角色弃置等量的牌，若其弃置的牌中有牌的花色与你弃置的牌相同，你对其造成1点伤害。",

			zhanlu: "沾露",
			luomu: "落木",
			liaoyuan: "燎原",
			huanhun: "唤魂",
			daixing: "代形",
			yishan: "异闪",
			yishan2: "异闪",
			swd_wuxie: "无邪",
			lqingcheng: "倾城",
			shengong: "神工",
			tanlin: "探麟",
			tanlin2: "探麟",
			pozhen: "破阵",
			yunchou: "运筹",
			swdtianshu: "天书",
			swdtianshu_bg: "书",
			swdtianshu2: "天书",
			xingdian: "星点",
			luomei: "落梅",
			yulin: "玉鳞",
			funiao: "符鸟",
			xuehuang: "血凰",
			xuehuang_bg: "凰",
			zhuyu: "朱羽",
			ningshuang: "凝霜",
			xielv: "谐率",
			tianhuo: "天火",
			huanyin: "幻音",
			tianlun: "天轮",
			hlongyin: "龙吟",
			lanzhi: "兰芷",
			duanyi: "断意",
			miesheng: "灭生",
			guxing: "孤星",
			guxing1: "孤星",
			guxing2: "孤星",
			poxing: "破星",
			miles_xueyi: "血裔",
			duijue: "对决",
			duijue_bg: "决",
			yueren: "月刃",
			busi: "不死",
			xuying: "虚影",
			yinguo: "因果",
			guiyan: "鬼眼",
			guiyan2: "鬼眼",
			swd_xiuluo: "修罗",
			suiyan: "碎岩",
			suiyan_info: "每当你造成一次伤害，可以弃置一张牌并弃置对方的全部装备牌。",
			xianyin: "散结",
			mailun: "脉轮",
			mailun31: "脉轮",
			mailun32: "脉轮",
			mailun41: "脉轮",
			mailun42: "脉轮",
			kunlunjing: "幻镜",
			kunlunjing1: "幻镜",
			kunlunjing2: "幻镜",
			susheng: "苏生",
			shengshou: "圣手",
			huanjian: "幻箭",
			huanjian_info: "出牌阶段，你可以将一张黑色牌当作冰魄针使用。",
			shengshou_info: "你可以将一张黑色手牌当作草药使用。",
			susheng_info:
				"在任意一名角色即将死亡时，你可以弃置一张手牌防止其死亡，并将其体力回复至1，每回合限发动一次。",
			susheng_info_alter:
				"在任意一名角色即将死亡时，你可以弃置一张红色手牌防止其死亡，并将其体力回复至1，每回合限发动一次。",
			zhanlu_info: "出牌阶段限一次，你可以弃置一张黑桃牌令至多3名角色各回复1点体力。",
			kunlunjing_info:
				"准备阶段，若你的体力值小于上回合结束时的体力值，你可以将场上所有牌还原到你上一回合结束时的位置。",
			kunlunjing_info_alter:
				"准备阶段，若你的体力值小于上回合结束时的体力值，你可以将场上所有牌还原到你上一回合结束时的位置，然后失去1点体力。",
			swd_xiuluo_info: "准备阶段，你可以弃一张手牌来弃置你判定区里的一张延时类锦囊（必须花色相同）。",
			xianyin_info: "出牌阶段，你可以令所有判定区内有牌的角色弃置判定区内的牌，然后交给你一张手牌。",
			mailun_info: "准备阶段，你可以选择一个脉轮效果直到下一回合开始。",
			guiyan_info:
				"出牌阶段，你可以观看一名角色的手牌，并获得其中一张梅花牌，每阶段限一次。当你首次进入濒死状态时，你须回复1点体力并失去技能鬼眼。",
			busi_info:
				"锁定技，当你进入濒死状态时，你进行一次判定，若结果不为黑桃，你将体力回复至1并将武将牌翻至背面。",
			xuying_info: "锁定技，每当你即将受到伤害，你防止此伤害，若你此时有手牌，你失去1点体力。",
			yinguo_info:
				"除你之外的任意一名角色即将受到受到伤害时，若有伤害来源，你可以弃置一张牌将伤害来源和目标对调。",
			yueren_info:
				"每当你使用一张【杀】，可以进行一次判定，若结果为黑色，你弃置目标一张牌，若结果为红色，你将此【杀】收回，每回合限发动一次。",
			duijue_info:
				"限定技，出牌阶段，你可以指定一名体力值大于1的其他角色，你结束出牌阶段，并在回合结束后将所有其他角色移出游戏，然后该角色与你轮流进行回合，直到有一方死亡或一共进行六个回合为止。",
			jifeng_info:
				"你的【杀】和单体锦囊可以额外指定任意个目标，若如此做，此卡牌有一定机率失效，指定的目标越多失效的概率越大。",
			miles_xueyi_info: "锁定技，你防止即将受到的伤害，然后失去1点体力。",
			duanyi_info:
				"出牌阶段限一次，你可以弃置两张【杀】，对一名角色造成1点伤害，然后其随机弃置X张牌，X为其已损失的体力值。",
			duanyi_info_alter: "出牌阶段限一次，你可以弃置两张【杀】，并对一名角色造成1点伤害。",
			guxing_info:
				"出牌阶段，你可以将最后至多X张手牌当【杀】使用，此【杀】无视距离且可以指定至多3个目标，每造成一次伤害，你摸一张牌，Ｘ为你已损失的体力值且至少为１。",
			tianlun_info: "任意一名角色的判定牌生效前，你可以弃置一张场上角色的判定牌代替之。",
			hlongyin_info:
				"出牌阶段，你可以弃置任意张颜色相同且点数不同的牌，并获得逆时针座位距离与卡牌点数相同的角色区域内的一张牌。每阶段限一次。",
			lanzhi_info: "每当你使用一张梅花牌，你可以令所有体力值不大于你的角色回复1点体力。",
			tianhuo_info:
				"出牌阶段，你可以令所有角色弃置其判定区域内的牌，并受到没有来源的等量火焰伤害，每阶段限一次。",
			huanyin_info:
				"锁定技，每当你成为其他角色的卡牌的目标时，你进行一次判定，若为黑桃则取消之，若为红桃你摸一张牌。",
			luomu_info: "锁定技，每当你造成伤害时，受伤害角色随机弃置一张牌。",
			poxing_info: "锁定技，每当你即将造成伤害，若目标的体力值大于你，你令伤害+1。",
			liaoyuan_info:
				"每当你使用一张【杀】指定目标后，你可以弃置任意张与此【杀】花色相同的牌，若如此做，目标需额外打出等量的闪，每少打出一张闪，此【杀】的伤害+1。",
			liaoyuan_info_alter:
				"每当你使用一张【杀】指定目标后，你可以弃置一张与此【杀】花色相同的牌，若如此做，目标需额外打出一张闪，若目标没打出闪，此【杀】的伤害+1。",
			yishan_info: "每当你受到一次伤害，你可以重新获得最近失去的两张牌。",
			huanhun_info:
				"当一名角色进入濒死状态时，你可以弃置一张牌并令其进行一次判定，若结果为红色，其回复1点体力，否则其获得你弃置的牌。",
			huanhun_info_alter:
				"当一名角色进入濒死状态时，你可以弃置一张红色手牌并令其进行一次判定，若结果为红色，其回复1点体力，否则其获得你弃置的牌。",
			daixing_info: "结束阶段，你可以弃置任意张牌并获得等量的护甲；这些护甲将在你的下个准备阶段消失。",
			swd_wuxie_info: "锁定技，你不能成为其他角色的延时锦囊的目标。",
			lqingcheng_info:
				"结束阶段，你可以进行判定，若为红色则可以继续判定，最多判定3次，判定结束后将判定成功的牌收入手牌。",
			shengong_info:
				"每当你需要打出一张【杀】或【闪】时，你可以弃置一名其他角色装备区内的一张武器牌或防具牌，视为打出一张【杀】或【闪】，然后该角色摸一张牌，你弃一张牌。",
			tanlin_info:
				"出牌阶段限一次，你可以与一名其他角色进行拼点，若你赢，你获得双方拼点牌、对该角色使用卡牌无视距离且可以额外使用一张【杀】直到回合结束，若你没赢，你受到该角色的1点伤害。",
			tanlin_info_alter:
				"出牌阶段限一次，你可以与一名其他角色进行拼点，若你赢，你获得对方拼点牌、对该角色使用卡牌无视距离且可以额外使用一张【杀】直到回合结束，若你没赢，你受到该角色的1点伤害。",
			pozhen_info:
				"每当你受到一次伤害，若你的手牌数大于伤害来源，你可以弃置X张手牌对其造成1点伤害；若你的手牌数小于伤害来源，你可以弃置其X张手牌。X为你与伤害来源的手牌数之差。",
			pozhen_info_alter:
				"每当你受到一次伤害，若你的手牌数小于伤害来源，你可以弃置其X张手牌。X为你与伤害来源的手牌数之差。",
			yunchou_info:
				"出牌阶段限一次，你可以弃置一张手牌，并弃置一名其他角色的一张手牌，若两张牌颜色相同，你摸一张牌，否则对方摸一张牌。",
			yunchou_info_alter:
				"出牌阶段限一次，你可以弃置一张非基本手牌，并弃置一名其他角色的一张手牌，若两张牌颜色相同，你摸一张牌，否则对方摸一张牌。",
			swdtianshu_info:
				"出牌阶段，你可以弃置一张锦囊牌，然后获得一名其他角色的一项技能直到该角色死亡（替换以此法获得的前一个技能）。",
			luomei_info: "每当你使用或打出一张梅花花色的牌，你可以摸一张牌。",
			xingdian_info: "出牌阶段限一次，你可以弃置一张手牌，然后随机弃置两名敌人各一张牌。",
			yulin_info: "每当你即将受到伤害，你可以弃置一张装备牌抵消此伤害。",
			funiao_info: "出牌阶段限一次，你可以将一张手牌交给一名其他角色，然后摸一张牌并观看其手牌。",
			xuehuang_info:
				"限定技，出牌阶段，若你没有黑色手牌，你可以展示并弃置所有手牌，每弃置一张牌视为使用一张火【杀】，随机指定两名敌人为目标。",
			zhuyu_info: "每当一名横置的角色即将受到伤害时，你可以弃置一张红色牌令此伤害+1并变为火属性。",
			ningshuang_info:
				"每当你成为黑色牌的目标，你可以弃置一张黑色牌将其横置，并摸一张牌，若其已经横置则改为将其翻面。",
			xielv_info:
				"弃牌阶段结束后，若你的所有手牌（至少两张）颜色均相同，你可以展示所有手牌，然后回复1点体力并弃置场上的所有判定牌。",
		},
	};
});
