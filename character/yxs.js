import { lib, game, ui, get, ai, _status } from "../noname.js";
game.import("character", function () {
	return {
		name: "yxs",
		character: {
			yxs_qinqiong: ["male", "wei", 4, ["yxs_fanji", "yxs_menshen"], []],
			yxs_wuzetian: ["female", "wu", 4, ["nvquan", "qiandu", "yxsweiyi"], ["name:武|曌"]],
			yxs_caocao: ["male", "wei", 4, ["zhulu", "xieling"]],
			yxs_mozi: ["male", "qun", 3, ["jieyong", "feigong", "jianai"], ["name:墨|翟"]],
			yxs_bole: ["male", "wu", 3, ["bolehuiyan", "xiangma"], ["name:孙|阳"]],
			yxs_aijiyanhou: ["female", "qun", 3, ["seyou", "sheshi"], ["name:null|null"]],
			yxs_diaochan: ["female", "qun", 3, ["fengyi", "wange"], ["name:null|null"]],
			yxs_yangyuhuan: ["female", "wu", 3, ["fengyan", "nichang"]],
			yxs_baosi: ["female", "wu", 3, ["jieyin", "fenghuo"], ["name:姒|null"]],
			yxs_napolun: ["male", "wei", 4, ["tongling", "fanpu"], ["name:波拿巴|拿破仑"]],
			yxs_kaisa: ["male", "shu", 4, ["ducai"], ["name:尤利乌斯|盖乌斯"]],
			yxs_zhuyuanzhang: ["male", "wu", 4, ["qiangyun"]],
			// yxs_jinke:['male','qun',3,['cike','qiangxi']],
			yxs_libai: ["male", "qun", 3, ["miaobi", "zhexian"]],
			yxs_luban: ["male", "wu", 3, ["guifu", "lshengong"], ["name:公输|般"]],
			yxs_lvzhi: ["female", "shu", 4, ["zhensha", "xumou"]],
			yxs_goujian: ["male", "wu", 3, ["keji", "tuqiang"], ["name:姒|鸠浅"]],
			yxs_lishimin: ["male", "qun", 4, ["kongju"]],
			yxs_huamulan: ["female", "shu", 3, ["xiaoji", "yizhuang"], ["name:null|null"]],
			yxs_luobinhan: ["male", "wu", 4, ["xiadao", "sheshu", "lguiyin"], ["name:null|null"]],
			yxs_chengjisihan: ["male", "qun", 4, ["mashu", "qianglue"], ["name:孛儿只斤|铁木真"]],
			yxs_mingchenghuanghou: ["female", "shu", 3, ["tiewan", "chajue"], ["name:闵|兹映"]],
			yxs_wangzhaojun: ["female", "wei", 3, ["heqin", "wluoyan"], ["name:王|嫱"]],
			yxs_luocheng: ["male", "wu", 4, ["hanqiang", "biaoqi"]],
			yxs_direnjie: ["male", "wei", 3, ["shentan", "kanpo"]],
			yxs_sunwu: ["male", "wu", 3, ["bingsheng", "taolue"]],
			yxs_chengyaojin: ["male", "shu", 4, ["sanbanfu"]],
			yxs_yujix: ["female", "shu", 3, ["ysheshen", "changnian"], ["name:null|null"]],
			yxs_xiangyu: ["male", "shu", 4, ["wushuang", "ciqiu"], ["name:项|籍"]],
			yxs_yingzheng: ["male", "qun", 4, ["jianxiong", "batu"]],
			yxs_yuefei: ["male", "qun", 4, ["longdan", "wumu"]],
			yxs_fuermosi: ["male", "wei", 3, ["yanyi", "jiean"], ["name:福尔摩斯|夏洛克"]],
			yxs_guiguzi: ["male", "qun", 3, ["baihe", "yinyang", "xiushen"], ["name:王|诩"]],
			yxs_xiaoqiao: ["female", "wu", 3, ["chujia", "zhijie"], ["name:桥|null"]],
			yxs_luzhishen: ["male", "wei", 4, ["yxsdili", "kuangchan"], ["name:鲁|达"]],
			yxs_zhaoyong: ["male", "shu", 3, ["zyhufu", "hanbei"]],
			yxs_yangguang: ["male", "qun", 3, ["shiqin", "yaoyi"]],
			yxs_tangbohu: ["male", "qun", 3, ["luobi", "fengliu"], ["name:唐|寅"]],
			yxs_zhangsanfeng: ["male", "wei", 4, ["zbudao", "taiji"]],
			yxs_nandinggeer: ["female", "shu", 3, ["huli", "xianqu", "yixin"], ["name:南丁格尔|弗洛伦斯"]],
			yxs_weizhongxian: ["male", "qun", 3, ["zhuxin", "wlianhuan"]],
			yxs_meixi: ["female", "shu", 3, ["liebo", "yaoji"], ["name:嬉|null"]],
			yxs_lanlinwang: ["male", "shu", 4, ["guimian", "lyuxue"], ["name:高|肃"]],
		},
		characterIntro: {
			yxs_qinqiong: "秦琼（？—638年），字叔宝，齐州历城（今山东济南市）人，隋末唐初名将。初为隋将，先后在来护儿、张须陀、裴仁基帐下任职，因勇武过人而远近闻名。后随裴仁基投奔瓦岗军领袖李密，瓦岗败亡后转投王世充，因见王世充为人奸诈，与程咬金等人一起投奔李唐。投唐后随李世民南征北战，是一个能在万马军中取敌将首级的勇将，但也因此浑身是伤。唐统一后，秦琼久病缠身，于贞观十二年（638）病逝。生前官至左武卫大将军、翼国公，死后追赠为徐州都督、胡国公，谥曰“壮”。贞观十七年被列入凌烟阁二十四功臣。",
			yxs_wuzetian: "中国历史上唯一一个正统的女皇帝，也是继位年龄最大的皇帝（67岁即位），又是寿命最长的皇帝之一（终年82岁）。唐高宗时为皇后（655—683）、唐中宗和唐睿宗时为皇太后（683—690），后自立为武周皇帝（690—705），改国号“唐”为“周”，定都洛阳，并号其为“神都”。史称“武周”或“南周”，705年退位。武则天也是一位女诗人和政治家。",
			yxs_caocao: " 曹操（155年7月18日－220年3月15日），字孟德，一名吉利，小字阿瞒，汉族，沛国谯（今安徽省亳州市）人。曹操生于宦官之家，适逢乱世，但是胸怀大志，参与剿灭董卓战争，之后在官渡大败袁绍，占据北方，挟天子以令诸侯。最后兵败赤壁，与吴，蜀三分天下。",
			yxs_mozi: " 宋国大夫，名翟，鲁人(今山东滕州人)。墨子是我国战国时期著名的思想家、教育家、科学家、军事家、社会活动家，墨家学派的创始人。墨子曾阻止鲁阳文君攻郑，说服公输般而止楚攻宋。楚惠王打算以书社封墨子，越王也打算以吴之地方五百里以封墨子，但墨子都没有接受。其创立墨家学说，并有《墨子》一书传世。",
			yxs_bole: "伯乐，名孙阳，字子良，一作王良。春秋齐（今山东省威武）人。善于相马，为赵简子御。相传天上御者名伯乐，因其善相，遂号之，传至今。初，见老骥 拖车，喘息不定，伯乐哀之，马亦哀啼，方知乃良驹。后世长以伯乐比喻慧眼识人者。",
			yxs_aijiyanhou: "埃及艳后即克丽奥佩托拉七世,是古埃及托勒密王朝的最后一任法老。她通过政治联姻为古埃及赢取了22年的和平。埃及艳后的一生富有戏剧性，特别是卷入罗马共和末期的政治漩涡，同恺撒、安东尼关系密切，并伴以种种传闻逸事，使她成为文学和艺术作品中的著名人物。",
			yxs_diaochan: "中国古代四大美女之一，今山西忻州人，有野史说其姓霍，无名，又有一说称其任姓，小字红昌。貂蝉是东汉末年司徒王允的义女，国色天香，有倾国倾城之貌，相传貂婵在后花园拜月时，忽然轻风吹来，一块浮云将那皎洁的明月遮住。这时正好王允瞧见，便说我的女儿和月亮比美，月亮比不过，赶紧躲在云彩后面。此后，世人常用“闭月”来形容貂婵的美貌。",
			yxs_yangyuhuan: "唐朝贵妃，名玉环，字太真，蒲州永乐人（今山西永济）。杨玉环自小习音律，善歌舞，姿色超群。27岁时，得唐玄宗宠幸，召入宫中，封为贵妃。杨贵妃天生丽质，回眸一笑百媚生，六宫粉黛无颜色，堪称大唐第一美女，此后千余年无出其右者。其与西施、昭君、貂蝉并称中国古代四大美女。",
			yxs_baosi: "褒姒，周幽王姬宫涅的王后，褒姒原是一名弃婴，被一对做小买卖的夫妻收养，在褒国（今陕西省汉中西北）长大，公元前七七九年（周幽王三年），周幽王征伐有褒国，褒人献出美女褒姒乞降，幽王爱如掌上明珠，立为妃，宠冠周王宫，翌年，褒姒生子伯服（一作伯般），幽王对她更加宠爱，竟废去王后申氏和太子宜臼，册立褒姒为王后，立伯服为太子，周太史伯阳叹气道：“周王室已面临大祸，这是不可避免的了。”",
			yxs_napolun: "法兰西第一共和国执政、法兰西第一帝国皇帝，出生在法国科西嘉岛，是一位卓越的军事天才。他多次击败保王党的反扑和反法同盟的入侵，捍卫了法国大革命的成果。他颁布的《民法典》更是成为了后世资本主义国家的立法蓝本。他执政期间多次对外扩张，形成了庞大的帝国体系，创造了一系列军事奇迹。",
			kaisa: "凯撒是罗马共和国末期杰出的军事统帅、政治家。他公元前60年与庞培、克拉苏秘密结成前三巨头同盟，随后出任高卢总督，在大约8年的时间内征服了高卢全境（今法国一带），还袭击了日耳曼和不列颠。前49年，他率军占领罗马，打败庞培，集大权于一身，实行独裁统治并制定了《儒略历》。",
			yxs_zhuyuanzhang: " 朱元璋，明王朝的开国皇帝。原名重八，后取名兴宗。汉族，濠州（今安徽凤阳县东）钟离太平乡人。朱元璋自幼贫寒，父母兄长均死于瘟疫，孤苦无依，入皇觉寺为小沙弥，入寺不到二个月，因荒年寺租难收，寺主封仓遣散众僧，只得离乡为游方僧，后参加了起义军，并改名“朱元璋”意为诛（朱）灭元朝的璋（璋，古代的一种玉器）。25岁时参加郭子兴领导的红巾军反抗蒙元暴政，在郭子兴手下，率兵出征，有攻必克；因此郭便把养女马氏嫁与了他。元至正二十八年(1368)，在基本击破各路农民起义军和扫平元的残余势力后，于南京称帝，国号大明，年号洪武，建立了全国统一的封建政权。朱元璋统治时期被称为“洪武之治”。葬于明孝陵。",
			yxs_jinke: "荆轲，喜好读书击剑，为人慷慨侠义。后游历到燕国，被称为“荆卿”（或荆叔），随之由燕国智勇深沉的“节侠”田光推荐给太子丹，拜为上卿。秦国灭赵后，兵锋直指燕国南界，太子丹震惧，与田光密谋，决定派荆轲入秦行刺秦王。荆轲献计太子丹，拟以秦国叛将樊于期之头及燕督亢（今河北涿县、易县、固安一带，是一块肥沃的土地）地图进献秦王，相机行刺。太子丹不忍杀樊于期，荆轲只好私见樊于期，告以实情，樊于期为成全荆轲而自刎。",
			yxs_libai: "字太白，号青莲居士，又号“谪仙人”，祖籍陇西郡成纪县（今甘肃省平凉市静宁县南）。李白是唐朝著名的浪漫主义诗人，有“诗仙”之称。李白生平作诗无数，存世诗文达千余篇之多，《蜀道难》、《行路难》、《梦游天姥吟留别》、《将进酒》等诗篇脍炙人口，妇孺皆知，另有《李太白集》传世。",
			yxs_luban: " 鲁班，姓公输，名般。战国时期鲁国公族之后，故又称公输子、班输等。出身于工匠世家，是我国古代最著名的发明家、建筑家。鲁班一生发明无数，而最具贡献意义的则要数木工使用的工具，诸如墨斗、锯、和鲁班尺等。为后世的建筑学提供了最基础的工具。除此之外，相传石磨、云梯等工具也是鲁班发明。",
			yxs_lvzhi: "  吕雉，西汉开国皇帝高祖刘邦的原配夫人，中国历史上第一位掌权的女性统治者，是历史上有记载以来的第一位皇后、皇太后。于高祖刘邦死后掌握政权，实行高祖的“黄老政治”，百姓安乐民富国强，为“文景之治”奠定了坚实的基础。",
			yxs_goujian: "勾践，又写作句践，在出土文物“越王勾践剑”里写为鸠浅，司马贞《史记索隐》引《纪年》作菼执。是中国春秋时代后期的越国君主。有关他的先世，有说“其先禹之苗裔”，亦有说“先世无所考”，也有说他是“祝融之后”并且是楚国的芈姓，众说纷纭。父亲则是越侯允常。",
			yxs_lishimin: " 李世民，唐朝第二位皇帝。他的前半生是立下赫赫武功的军事家。平窦建德、王世充之后，始大量接触文学与书法，有《温泉铭》、《晋祠铭》等墨宝传世。后在玄武门之变杀死自己的兄弟李建成、李元吉两人，成为太子，唐高祖不久被迫让位。世民即位为帝后，积极听取群臣的意见、努力学习文治天下，成功转型为中国史上最出名的政治家与明君之一。唐太宗开创了历史上的“贞观之治”，经过主动消灭群雄割据势力，虚心纳谏、在国内厉行节约、使百姓休养生息，终于使得社会出现了国泰民安的局面。此举为后来的开元盛世奠定了重要的基础，将中国传统农业社会推向一个高峰。",
			yxs_huamulan: " 花木兰是中国文学作品中的一位代父从军的巾帼英雄，其真实性不详。花木兰最早出现于南北朝一首叙事诗《木兰辞》中，该诗约作于北魏，最初录于南朝陈的《古今乐录》，僧人智匠在《古今乐录》称：“木兰不知名。”",
			yxs_luobinhan: "罗宾汉是英国民间传说中的侠盗式的一个英雄人物，人称汉丁顿伯爵。他武艺出众、机智勇敢、聪明，仇视官吏和教士，是一位劫富济贫、行侠仗义的绿林英雄。传说他住在诺丁汉雪伍德森林。从14世纪中叶起，关于罗宾汉的民谣和传说就开始在民间流传。罗宾汉最突出的就是射箭术高超。现代射箭比赛里就有“罗宾汉”这一术语，指射中另一支已中靶心的箭。",
			yxs_chengjisihan: "成吉思汗，名铁木真，孛儿只斤氏，奇渥温姓，乞颜（起延）部人。从小遭受结拜兄弟札木合迫害，形成刚毅坚韧的性格。1206年，被推举为蒙古帝国的大汗，统一蒙古各部，为之后的进攻中原提供了坚实的基础。",
			yxs_mingchenghuanghou: "明成皇后，朝鲜近代史上的女政治家，本名闵兹映，通称闵妃，是朝鲜京畿道骊州郡人。她是朝鲜王朝高宗李熙的王妃，骊兴闵氏外戚集团的核心人物，19世纪末朝鲜的实际统治者。由于闵妃早期主张开放、后期力抗日本并身死殉难，故深受后世韩国人民的尊崇。 1897年，高宗李熙改国号称“大韩帝国”，追谥闵妃为“孝慈元圣正化合天明成皇后”，故现今韩国史学家多称她为“明成皇后”。",
			yxs_wangzhaojun: "王昭君，名嫱，字昭君，晋朝时为避司马昭讳，又称“明妃”，汉元帝时期宫女，汉族，西汉南郡秭归（今湖北省兴山县）人。匈奴呼韩邪单于阏氏。 “昭君出塞”是汉匈交往上的大事，稳定了汉朝和匈奴的外交关系，《汉书.匈奴传》和《后汉书.南匈奴传》都记载了这件事。相传和亲途中，南飞的大雁听到昭君奏起悲壮的离别之曲，看到骑在马上的这位美丽女子，忘记摆动翅膀，跌落地下，因此得“落雁”之名。昭君出塞的故事也被后世传为佳话。",
			yxs_luocheng: "《隋唐》说书和《说唐传》中的虚构人物，隋唐十八杰中列第七，十六杰列第八。在清初禇人获的讲史小说《隋唐演义》中，也虚构了罗成，是燕山罗艺的儿子，秦琼的表弟，精通枪法。",
			yxs_direnjie: "唐武周时期杰出的著名政治家，时任豫州刺史、魏州刺史等要职，官至凤阁鸾台平章事、内史，卒后追封梁国公。狄仁杰生于贞观、卒于武周时期，经历了大唐鼎盛和动乱的年代。其一生秉承了以民为本、不畏权贵、为民请命的宗旨。狄仁杰通晓了吏治、兵刑等法律制度，在任大理丞任期内解决了诸多案件，被誉为“神探”。狄仁杰为官清廉，素有政绩，有辅国安邦之能，史称“唐室砥柱”。",
			yxs_sunwu: "著名军事家，字长卿，中国春秋时期齐国乐安人。曾率领吴国军队大破数倍于己的楚国军队，占领了楚国都城郢城，几乎亡楚。其著有巨作《孙子兵法》十三篇，为后世兵法家所推崇，被誉为“兵学圣典”，置于《武经七书》之首，被译为英文、法文、德文、日文，成为国际间最著名的兵学典范之书。后人尊称其为孙子、孙武子、兵圣、百世兵家之师、东方兵学的鼻祖。",
			yxs_chengyaojin: "程咬金，原名咬金，后更名知节，字义贞，中国济州东阿斑鸠店人（现山东省东平县斑鸠店）。“凌烟阁二十四功臣”之一，唐朝开国名将。隋朝末年，隋炀帝杨广统治残暴，骄奢荒淫，民不聊生，最终爆发了大规模的农民起义。程咬金先入瓦岗军，投王世充，后降唐，成为秦王李世民的骨干成员。据史书记载，程咬金“少骁勇，善用马槊。”而在以《说唐》为代表的系列话本及历史演义小说中，程咬金则使得一柄八卦宣花斧，以“三板斧”武艺著称，是一名性格直爽、粗中有细的福将。",
			yxs_yujix: "虞姬，又称虞美人，西楚霸王项羽爱姬，相传为江苏沭阳县颜集乡人，一说苏州常熟人。公元前209年，项羽与叔父项梁起义反秦。项羽军中战将虞子期的妹妹虞姬，貌美好武，倾慕年轻勇猛的项羽，嫁其为妾，常伴左右随军出征，至终形影不离。 公元前202年，项羽在垓下之战中被刘邦、韩信、彭越三方大军合围困于垓下（今安徽灵璧县城南沱河北岸城后村），身陷十面埋伏，兵孤粮缺，夜闻四面楚歌，楚军士气尽失。项羽认为大势已去，帐中酌酒，对着虞姬唱起悲壮的“垓下歌”。虞姬拔剑起舞，含泪唱和：“汉兵已略地，四面楚歌声。大王义气尽，贱妾何聊生。”为免后顾之忧影响项羽突围，唱毕于其面前自刎。",
			yxs_xiangyu: "项籍（前232—前202）字羽，通常被称作项羽，中国古代著名将领及政治人物，汉族，秦下相（今江苏省宿迁市宿城区）人。秦末时被楚怀王熊心封为鲁公，在前207年的决定性战役巨鹿之战中统率楚军大破秦军。秦亡后自封“西楚霸王”，统治黄河及长江下游的梁楚九郡。后在楚汉战争中为汉高祖刘邦所败，在乌江（今安徽和县）自刎而死。",
			yxs_yingzheng: "秦始皇，赢姓，赵氏，名政，秦庄襄王之子。秦始皇22岁时，在雍城举行国君成人加冕仪式，开始“亲理朝政”。后除掉吕不韦，嫪毐等人，重用李斯，尉缭。自公元前230年至前221年，采取由近及远，集中力量，各个击破的策略，先后灭六国，完成统一中国的大业。同时建立起历史上第一个书同文，度同制，车同轨，行同伦的中央集权国家——秦朝。",
			yxs_yuefei: " 岳飞（1103年－1142年），字鹏举，相州汤阴（今属河南）人。南宋军事家，中国历史上著名的抗金名将。绍兴十一年（1142）十二月二十九日，秦桧以“莫须有”的罪名将岳飞毒死于临安风波亭。1162年，宋孝宗时诏复官，谥武穆，宁宗时追封为鄂王，改谥忠武，有《岳武穆集》传世。",
			yxs_fuermosi: "福尔摩斯，是一个虚构的侦探人物，是由19世纪末20世纪初的英国侦探小说家阿瑟?柯南·道尔所塑造的一个才华横溢的侦探形象。福尔摩斯不但头脑冷静、观察力敏锐、推理能力极强；而且，他的剑术、拳术和小提琴演奏水平也相当高超，已经成为侦探小说中的典型代表人物之一。",
			yxs_guiguzi: "本名王诩，春秋时纵横家，卫国（今河南鹤壁一带）人。曾隐于清溪鬼谷，常入云梦采药修道，弟子无数。有张仪、苏秦、孙膑、庞涓四弟子。精于兵法、奇门遁甲、五行八卦之学。后人称之为王禅老祖。今传《鬼谷子》十四篇。",
			yxs_xiaoqiao: "小乔，庐江皖县（今安徽潜山）人。 史书中称小桥，是中国汉末三国时期的女性， 乔公的次女，东吴名将周瑜的妻子。传说与其姐大乔均为绝世美女。合称“二乔”。",
			yxs_luzhishen: "鲁智深，梁山泊第十三位好汉，十员步军头领第一名。鲁智深原名鲁达，绰号花和尚。是经略的提辖，因为见郑屠欺侮金翠莲父女，三拳打死了镇关西。被官府追捕，逃到五台山削发为僧，改名鲁智深。",
			yxs_zhaoyong: "赵武灵王，战国中后期赵国君主，嬴姓，赵氏，名雍。赵武灵王在位时，推行的“胡服骑射”政策，赵国因而得以强盛，灭中山国，败林胡、楼烦二族，辟云中、雁门、代三郡，并修筑了“赵长城”。",
			yxs_yangguang: "隋炀帝杨广，是隋朝第二代皇帝，华阴（今陕西华阴）人，生于隋京师长安。杨广在位期间修建大运河，营建东都迁都洛阳城，开创科举制度，亲征吐谷浑，三征高句丽。但因为杨广滥用民力，导致了隋朝的灭亡，618年在江都被部下缢杀。",
			yxs_tangbohu: "唐伯虎，名寅，字伯虎，自号六如居士，明代诗人、画家，吴县（今江苏苏州）人。出身富商家庭，后家道衰落，因祝枝山之劝而潜心读书。公试时为状元，会试时候因科场舞弊案牵连而被斥为吏。后绝意仕途，以卖画为生。唐伯虎为人玩世不恭而又才气横溢，诗文擅名，与祝枝山、文征明、徐祯卿并称“江南四大才子”，画名更著，与沈周、文征明、仇英并称“吴门四家”。民间盛传其点秋香的故事。",
			yxs_zhangsanfeng: "明朝最著名的武术家、道士。原名张通，字君宝，在武当山开山立派，成为武当派开山祖师。明英宗赐号“通微显化真人”；明宪宗特封号为“韬光尚志真仙”；明世宗赠封他为“清虚元妙真君”。传说其丰姿魁伟，大耳圆目，须髯如戟。无论寒暑，只一衲一蓑，一餐能食升斗，或数日一食，或数月不食，事能前知。其在武术上的造诣和超乎寻常的长寿都为后人称道。 曾传洪武年间，两度受朱元璋诏请入京，皆避而不见。其与明初巨贾沈万三亦有交际。其所创太极拳一直延续至今，成为后人养身妙术。",
			yxs_nandinggeer: "出生于意大利，英国护士和统计学家。她谙熟数学，精通英、法、德、意四门语言，除古典文学外，还精于自然科学、历史和哲学，擅长音乐与绘画。在德国学习护理后，曾往伦敦的医院工作。南丁格尔于1854年和38位护士到克里米亚野战医院工作，成为该院的护士长，被称为“克里米亚的天使”又称“提灯女神”。1860年6月15日，南丁格尔在伦敦成立世界第一所护士学校。为了纪念她的成就，1912年，国际护士会倡仪各国医院和护士学校定每年5月12日南丁格尔诞辰日举行纪念活动，并将5月12日定为“国际护士节”，以缅怀和纪念这位伟大的女性。",
			yxs_weizhongxian: "魏忠贤（1568年－1627年12月11日），字完吾，北直隶肃宁（今河北沧州肃宁县）人，汉族，原名李进忠。由才人王氏复姓，出任秉笔太监后，改名魏忠贤。明朝末期宦官。明熹宗时期，出任司礼秉笔太监，极受宠信，被称为“九千九百岁”，排除异己，专断国政，以致人们“只知有忠贤，而不知有皇上”。朱由检继位后，打击惩治阉党，治魏忠贤十大罪，命逮捕法办，自缢而亡，其余党亦被肃清。",
			yxs_meixi: '妺喜，姓嬉（喜），生卒年不详，亦作妺嬉、末喜、末嬉，有施氏之女，夏朝最后一位君主夏桀的王后。根据先秦时代记述女子名时所用的全称和简称方式，妺喜应姓喜，即嬉（也作僖）。由于其名字的“妺”字与“妹妹”的“妹”字字形相似，且在《庄子》等作中也有以妺为妹的用法，因此常误作"妹喜"。',
			yxs_lanlinwang: "高长恭（541年―573年），又名高孝瓘、高肃，祖籍渤海调蓨（今河北省景县），神武帝高欢之孙，文襄帝高澄第四子，生母不详，南北朝时期北齐宗室、将领，封爵兰陵郡王。高长恭貌柔心壮，音容兼美。为将躬勤细事，每得甘美，虽一瓜数果，必与将士分享。累次升任至并州刺史。突厥攻入晋阳，高长恭奋力将其击退。邙山之战，高长恭为中军，率领五百骑兵再入周军包围圈，直至金墉城下，因高长恭戴着头盔，城中的人不确定是敌军或是我军，直到高长恭把头盔脱下来城上的人才知道是高长恭，派弓箭手开始放箭保护他，之后高长恭成功替金墉解围，高长恭在此次战中威名大振，士兵们为此战而讴歌他，即后来知名的《兰陵王入阵曲》。",
		},
		characterTitle: {
			yxs_qinqiong: "Sukincen",
		},
		skill: {
			yxs_fanji: {
				audio: 2,
				trigger: {
					player: "damageEnd",
				},
				direct: true,
				priority: 12,
				filter: function (event, player) {
					if (!player.countCards("h", { name: "sha" })) return false;
					return event.card && (event.card.name == "sha" || event.card.name == "juedou");
				},
				content: function () {
					player.addTempSkill("yxs_fanji2", "shaAfter");
					player.chooseToUse({ name: "sha" }, trigger.source, "反击：是否对" + get.translation(trigger.source) + "使用一张杀？").logSkill = "yxs_fanji";
				},
			},
			yxs_fanji2: {
				audio: 2,
				trigger: {
					player: "shaBegin",
				},
				direct: true,
				filter: function (event, player) {
					return event.card && event.card.name == "sha" && get.color(event.card) == "red";
				},
				content: function () {
					trigger.directHit = true;
				},
			},
			yxs_menshen3: {
				trigger: {
					player: ["phaseBegin", "dieBegin"],
				},
				silent: true,
				filter: function (event, player) {
					return game.hasPlayer(function (current) {
						return current.hasSkill("yxs_menshen2");
					});
				},
				content: function () {
					for (var i = 0; i < game.players.length; i++) {
						if (game.players[i].hasSkill("yxs_menshen2")) {
							game.players[i].removeSkill("yxs_menshen2");
						}
					}
				},
			},
			yxs_menshen: {
				audio: 2,
				trigger: {
					player: "phaseEnd",
				},
				priority: 15,
				group: "yxs_menshen3",
				onremove: true,
				filter: function (event, player) {
					return game.players.length > 1;
				},
				content: function () {
					"step 0";
					player
						.chooseTarget("选择【门神】的目标", lib.translate.yxs_menshen_info, true, function (card, player, target) {
							return target != player;
						})
						.set("ai", function (target) {
							return get.attitude(player, target);
						});
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.line(target, "green");
						game.log(target, "成为了", "【门神】", "的目标");
						target.storage.yxs_menshen2 = player;
						target.addSkill("yxs_menshen2");
					} else {
						event.finish();
					}
				},
				ai: {
					expose: 0.5,
				},
			},
			yxs_menshen2: {
				audio: 2,
				mark: "character",
				intro: {
					content: "当你成为【杀】或【决斗】的目标后，改为$成为目标",
				},
				nopop: true,
				priority: 15,
				trigger: {
					target: ["shaBegin", "juedouBegin"],
				},
				forced: true,
				popup: false,
				filter: function (event, player) {
					return player.isAlive();
				},
				content: function () {
					var target = player.storage.yxs_menshen2;
					trigger.player.line(target, "green");
					trigger.targets.remove(player);
					trigger.targets.push(target);
					trigger.target = target;
				},
			},
			guimian: {
				trigger: { source: "damageEnd" },
				forced: true,
				filter: function (event, player) {
					return event.card && event.card.name == "sha" && _status.currentPhase == player;
				},
				content: function () {
					player.getStat().card.sha--;
				},
			},
			lyuxue: {
				trigger: { source: "damageEnd" },
				forced: true,
				logTarget: "player",
				filter: function (event, player) {
					if (event._notrigger.includes(event.player)) return false;
					return event.player.isIn() && !event.player.hasSkill("lyuxue2");
				},
				content: function () {
					trigger.player.addSkill("lyuxue2");
				},
				subSkill: {
					clear: {
						trigger: { player: ["phaseBegin", "dieBegin"] },
						forced: true,
						filter: function (event, player) {
							var num = game.countPlayer(function (current) {
								return current.hasSkill("lyuxue2");
							});
							if (!num) return false;
							if (event.name == "die") return true;
							return num >= Math.floor(game.countPlayer() / 2);
						},
						content: function () {
							"step 0";
							var list = game.filterPlayer(function (current) {
								return current.hasSkill("lyuxue2");
							});
							list.sortBySeat();
							event.list = list;
							player.line(list, "green");
							"step 1";
							if (event.list.length) {
								event.list.shift().removeSkill("lyuxue2");
								event.redo();
							}
						},
					},
				},
				group: "lyuxue_clear",
			},
			lyuxue2: {
				mark: true,
				intro: {
					content: "已获得浴血标记",
				},
				onremove: function (player) {
					player.loseHp();
				},
			},
			yaoji: {
				trigger: { player: "damageEnd" },
				filter: function (event, player) {
					return event.source && event.source.isIn() && event.source != player && !event.source.hasJudge("lebu");
				},
				check: function (event, player) {
					return get.attitude(player, event.source) <= 0;
				},
				logTarget: "source",
				content: function () {
					var card = game.createCard("lebu");
					trigger.source.addJudge(card);
					trigger.source.$draw(card);
					game.delay();
				},
				ai: {
					maixie_defend: true,
				},
			},
			liebo: {
				enable: "phaseUse",
				usable: 1,
				filterTarget: function (card, player, target) {
					return Math.abs(target.countCards("h") - player.countCards("h")) <= 1;
				},
				content: function () {
					player.swapHandcards(target);
				},
				ai: {
					order: function () {
						var player = _status.event.player;
						if (
							player.hasCard(function (card) {
								return get.value(card) >= 8;
							})
						) {
							return 0;
						}
						var nh = player.countCards("h");
						if (
							game.hasPlayer(function (current) {
								return get.attitude(player, current) <= 0 && current.countCards("h") == nh + 1;
							})
						) {
							return 9;
						}
						return 1;
					},
					result: {
						player: function (player, target) {
							var att = get.attitude(player, target);
							if (att > 0) return 0;
							if (
								player.hasCard(function (card) {
									return get.value(card) >= 8;
								})
							) {
								return 0;
							}
							var n1 = target.countCards("h"),
								n2 = player.countCards("h");
							var num = 0;
							if (n1 - n2 == 1) {
								num = 1;
							}
							if (player.countCards("h", "du")) {
								if (n1 == n2) num = 0.5;
								else num = 0.1;
							}
							if (att == 0) {
								num /= 2;
							}
							return num;
						},
					},
				},
			},
			zhuxin: {
				enable: "phaseUse",
				usable: 1,
				filterTarget: function (card, player, target) {
					return target != player && target.countCards("h");
				},
				filter: function (event, player) {
					return player.countCards("h");
				},
				content: function () {
					"step 0";
					player.chooseToCompare(target);
					"step 1";
					if (result.bool) {
						target.damage();
					}
				},
				ai: {
					order: 8,
					result: {
						target: function (player, target) {
							return get.damageEffect(target, player, target);
						},
					},
				},
			},
			wlianhuan: {
				trigger: { source: "damageBegin" },
				filter: function (event, player) {
					return event.card && event.card.name == "sha" && player.countCards("e");
				},
				direct: true,
				content: function () {
					"step 0";
					var next = player.chooseToDiscard("e", get.prompt("wlianhuan", trigger.player), "弃置一张装备区内的牌使伤害+1");
					next.ai = function (card) {
						if (get.attitude(player, trigger.player) < 0) {
							return 7 - get.value(card);
						}
						return 0;
					};
					next.logSkill = ["wlianhuan", trigger.player];
					"step 1";
					if (result.bool) {
						trigger.num++;
					}
				},
			},
			huli: {
				enable: "phaseUse",
				filterCard: { suit: "heart" },
				filterTarget: function (card, player, target) {
					return get.distance(player, target) <= 1 && lib.filter.cardEnabled({ name: "tao" }, target, target);
				},
				check: function (card) {
					return 8 - get.value(card);
				},
				discard: false,
				lose: false,
				filter: function (event, player) {
					if (player.countCards("h", { suit: "heart" })) {
						return true;
					}
					return false;
				},
				prepare: "throw",
				content: function () {
					player.useCard({ name: "tao" }, cards, targets[0]).animate = false;
				},
				ai: {
					order: 9.5,
					result: {
						target: function (player, target) {
							return get.recoverEffect(target, player, target);
						},
					},
					threaten: 1.6,
				},
			},
			yixin: {
				skillAnimation: true,
				unique: true,
				mark: true,
				init: function (player) {
					player.storage.yixin = false;
				},
				enable: "phaseUse",
				filter: function (event, player) {
					return !player.storage.yixin && player.countCards("he") > 2;
				},
				intro: {
					content: "limited",
				},
				filterTarget: function (card, player, target) {
					return target.isDamaged();
				},
				filterCard: true,
				position: "he",
				selectCard: 2,
				check: function (card) {
					return 7 - get.value(card);
				},
				content: function () {
					player.awakenSkill("yixin");
					player.storage.yixin = true;
					var num = Math.min(4, target.maxHp - target.hp);
					target.recover(num);
					if (num < 4) {
						target.draw(4 - num);
					}
				},
				ai: {
					order: 9.6,
					result: {
						target: function (player, target) {
							if (target.hp == 1 && target.maxHp >= 3) {
								return get.recoverEffect(target, player, target);
							}
							return 0;
						},
					},
				},
			},
			xianqu: {
				mod: {
					targetEnabled: function (card) {
						if (card.name == "sha" && card.number < 8) return false;
					},
				},
			},
			zbudao: {
				trigger: { player: "phaseDrawBegin" },
				//check:function(event,player){
				//	if(player.hasFriend()) return true;
				//	return false;
				//},
				content: function () {
					trigger.num++;
					player.addTempSkill("zbudao2", "phaseDrawAfter");
				},
				ai: {
					threaten: 1.3,
				},
			},
			zbudao2: {
				trigger: { player: "phaseDrawEnd" },
				forced: true,
				popup: false,
				filter: function (event) {
					return event.cards && event.cards.length;
				},
				content: function () {
					"step 0";
					event.cards = trigger.cards.slice(0);
					player.chooseCardTarget({
						filterCard: function (card) {
							return _status.event.getParent().cards.includes(card);
						},
						selectCard: 1,
						filterTarget: function (card, player, target) {
							return player != target;
						},
						ai1: function (card) {
							if (ui.selected.cards.length > 0) return -1;
							if (card.name == "du") return 20;
							return _status.event.player.countCards("h") - _status.event.player.hp;
						},
						ai2: function (target) {
							var att = get.attitude(_status.event.player, target);
							if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
								return 1 - att;
							}
							return att - 4;
						},
						//forced:true,
						prompt: "将得到的一张牌交给一名其他角色，或点取消",
					});
					"step 1";
					if (result.bool) {
						player.line(result.targets, "green");
						result.targets[0].gain(result.cards, player);
						player.$give(result.cards.length, result.targets[0]);
						game.delay(0.7);
					}
				},
			},
			taiji: {
				trigger: { player: ["useCard", "respond"] },
				filter: function (event, player) {
					return event.card.name == "shan" && player.hasSha();
				},
				direct: true,
				content: function () {
					player.chooseToUse({ name: "sha" }, "太极：是否使用一张杀？").logSkill = "taiji";
				},
			},
			fengliu: {
				trigger: { player: "phaseDrawBegin" },
				filter: function (event, player) {
					return game.hasPlayer(function (current) {
						return current.sex == "female";
					});
				},
				forced: true,
				content: function () {
					var num = game.countPlayer(function (current) {
						return current.sex == "female";
					});
					if (num > 2) num = 2;
					trigger.num += num;
				},
				ai: {
					threaten: function () {
						var num = game.countPlayer(function (current) {
							return current.sex == "female";
						});
						switch (num) {
							case 0:
								return 1;
							case 1:
								return 1.3;
							default:
								return 2;
						}
					},
				},
			},
			luobi: {
				trigger: { player: "phaseEnd" },
				filter: function (event, player) {
					return player.isDamaged();
				},
				content: function () {
					"step 0";
					player.draw(player.maxHp - player.hp);
					"step 1";
					event.cards = result;
					"step 2";
					player.chooseCardTarget({
						filterCard: function (card) {
							return _status.event.getParent().cards.includes(card);
						},
						selectCard: [1, event.cards.length],
						filterTarget: function (card, player, target) {
							return player != target;
						},
						ai1: function (card) {
							if (ui.selected.cards.length > 0) return -1;
							if (card.name == "du") return 20;
							return _status.event.player.countCards("h") - _status.event.player.hp;
						},
						ai2: function (target) {
							var att = get.attitude(_status.event.player, target);
							if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
								return 1 - att;
							}
							return att - 4;
						},
						prompt: "请选择要送人的卡牌",
					});
					"step 3";
					if (result.bool) {
						player.line(result.targets, "green");
						result.targets[0].gain(result.cards, player);
						player.$give(result.cards.length, result.targets[0]);
						for (var i = 0; i < result.cards.length; i++) {
							event.cards.remove(result.cards[i]);
						}
						if (event.cards.length) event.goto(2);
					}
				},
			},
			yaoyi: {
				trigger: { player: "damageEnd" },
				direct: true,
				filter: function (event, player) {
					if (event.num > 0) {
						return game.hasPlayer(function (current) {
							return current.group != "qun" && current != player;
						});
					}
					return false;
				},
				content: function () {
					"step 0";
					player
						.chooseTarget(get.prompt("yaoyi"), [1, 2], function (card, player, target) {
							return target.countCards("h") && target.group != "qun" && target != player;
						})
						.set("ai", function (target) {
							return 0.5 - get.attitude(_status.event.player, target);
						});
					"step 1";
					if (result.bool) {
						player.logSkill("yaoyi", result.targets);
						event.targets = result.targets;
					} else {
						event.finish();
					}
					"step 2";
					if (event.targets && event.targets.length) {
						event.target = event.targets.shift();
						event.target.chooseCard("交给" + get.translation(player) + "一张手牌", true).ai = function (card) {
							return -get.value(card);
						};
					} else {
						event.finish();
					}
					"step 3";
					if (result.bool && result.cards && result.cards.length) {
						event.target.$give(1, player);
						player.gain(result.cards, event.target);
					}
					event.goto(2);
				},
				ai: {
					maixie: true,
					maixie_hp: true,
					expose: 0.2,
					effect: {
						target: function (card, player, target) {
							if (get.tag(card, "damage")) {
								if (player.hasSkillTag("jueqing", false, target)) return [1, -2];
								if (!target.hasFriend()) return;
								var players = game.filterPlayer();
								for (var i = 0; i < players.length; i++) {
									if (players[i].group != "qun" && get.attitude(player, players[i]) <= 0 && players[i] != player) {
										if (target.hp >= 4) return [1, get.tag(card, "damage") * 2];
										if (target.hp == 3) return [1, get.tag(card, "damage") * 1.5];
										if (target.hp == 2) return [1, get.tag(card, "damage") * 0.5];
									}
								}
							}
						},
					},
				},
			},
			shiqin: {
				trigger: { global: "dying" },
				priority: 9,
				filter: function (event, player) {
					return event.player != player && event.player.hp <= 0 && event.player.group == "qun";
				},
				check: function (event, player) {
					return get.attitude(player, event.player) < 0;
				},
				forced: true,
				logTarget: "player",
				content: function () {
					"step 0";
					game.delayx();
					trigger.player.die();
					"step 1";
					if (!trigger.player.isAlive()) {
						trigger.cancel(true);
					}
				},
			},
			zyhufu: {
				trigger: { player: "phaseDrawBegin" },
				filter: function (event, player) {
					return !player.getEquip(2);
				},
				forced: true,
				content: function () {
					trigger.num++;
				},
				ai: {
					threaten: 1.3,
				},
				mod: {
					maxHandcard: function (player, num) {
						if (player.getEquip(2)) return num + 5;
					},
				},
			},
			hanbei: {
				trigger: { player: "shaBegin" },
				forced: true,
				filter: function (event, player) {
					if (player.getEquip(3) || player.getEquip(4)) return true;
					return false;
				},
				content: function () {
					trigger.directHit = true;
				},
			},
			sheshu: {
				trigger: { player: "shaBegin" },
				forced: true,
				filter: function (event, player) {
					return event.target.hp >= 3;
				},
				content: function () {
					trigger.directHit = true;
				},
				mod: {
					targetInRange: function (card) {
						if (card.name == "sha") return true;
					},
				},
			},
			lguiyin: {
				unique: true,
				forceunique: true,
				enable: "phaseUse",
				filter: function (event, player) {
					return !player.hasSkill("tongyu_guiyin") && !player.getStat("damage") && [player.name1, player.name2].includes("yxs_luobinhan");
				},
				derivation: ["lzhangyi", "jimin", "tongyu"],
				content: function () {
					player.draw();
					player.setAvatar("yxs_luobinhan", "yxs_handingdun");
					player.removeSkill("lguiyin");
					player.removeSkill("sheshu");
					player.removeSkill("xiadao");
					player.addSkill("jimin");
					player.addSkill("lzhangyi");
					player.addSkill("tongyu");
					player.addTempSkill("tongyu_guiyin");
				},
				ai: {
					order: function () {
						if (_status.event.player.hp == 1) return 9;
						return 0.5;
					},
					result: {
						player: function (player) {
							if (player.hp < player.maxHp) return 1;
							return 0;
						},
					},
				},
			},
			tongyu: {
				unique: true,
				forceunique: true,
				enable: "phaseUse",
				filter: function (event, player) {
					return player.countCards("he") > 0 && !player.hasSkill("tongyu_guiyin") && [player.name1, player.name2].includes("yxs_luobinhan");
				},
				filterCard: true,
				position: "he",
				check: function (card) {
					return 7 - get.value(card);
				},
				content: function () {
					player.setAvatar("yxs_luobinhan", "yxs_luobinhan");
					player.addSkill("lguiyin");
					player.addSkill("sheshu");
					player.addSkill("xiadao");
					player.removeSkill("jimin");
					player.removeSkill("lzhangyi");
					player.removeSkill("tongyu");
					player.addTempSkill("tongyu_guiyin");
				},
				ai: {
					order: 9,
					result: {
						player: function (player) {
							if (player.hasFriend()) return 1;
							return 0;
						},
					},
				},
			},
			tongyu_guiyin: {},
			zhijie: {
				enable: "phaseUse",
				usable: 1,
				viewAsFilter: function (player) {
					return player.countCards("h", { suit: "heart" }) > 0;
				},
				viewAs: { name: "wuzhong" },
				filterCard: { suit: "heart" },
				check: function (card) {
					return 8 - get.value(card);
				},
			},
			yxsdili: {
				trigger: { player: "phaseDrawBegin" },
				forced: true,
				filter: function (event, player) {
					return player.hp < player.maxHp;
				},
				content: function () {
					trigger.num += Math.min(2, Math.ceil((player.maxHp - player.hp) / 2));
				},
				ai: {
					threaten: function (player, target) {
						var num = Math.min(2, Math.ceil((player.maxHp - player.hp) / 2));
						if (num == 2) return 2;
						if (num == 1) return 1;
						return 0.5;
					},
					maixie: true,
					effect: {
						target: function (card, player, target) {
							if (target.maxHp <= 3) return;
							if (get.tag(card, "damage")) {
								if (target.hp == target.maxHp) return [0, 1];
							}
							if (get.tag(card, "recover") && player.hp >= player.maxHp - 1) return [0, 0];
						},
					},
				},
			},
			kuangchan: {
				locked: true,
				ai: {
					neg: true,
				},
				init: function (player) {
					if (player.isZhu) {
						player.maxHp--;
						player.update();
					}
				},
			},
			chujia: {
				enable: "phaseUse",
				filterCard: function (card) {
					if (ui.selected.cards.length) {
						return get.color(card) == get.color(ui.selected.cards[0]);
					}
					return true;
				},
				complexCard: true,
				usable: 1,
				selectCard: 2,
				check: function (card) {
					return 6 - get.value(card);
				},
				filterTarget: function (card, player, target) {
					return target.hp < target.maxHp;
				},
				content: function () {
					if (target.maxHp > target.hp) {
						target.draw(target.maxHp - target.hp);
					}
				},
				ai: {
					order: 2,
					result: {
						target: function (player, target) {
							var num = target.maxHp - target.hp;
							if (num > 2) return num;
							return 0;
						},
					},
				},
			},
			baihe: {
				enable: "phaseUse",
				usable: 1,
				filterCard: true,
				position: "he",
				filterTarget: true,
				content: function () {
					"step 0";
					if (target.isLinked()) {
						target.link();
					} else {
						target.link();
						target.draw();
						event.finish();
					}
					"step 1";
					if (target.countCards("h")) {
						target.chooseToDiscard("h", true);
					}
				},
				check: function (card) {
					return 8 - get.value(card);
				},
				ai: {
					order: 1,
					result: {
						player: function (player, target) {
							if (!player.hasSkill("xiushen")) return 0;
							if (target.isLinked()) return 0;
							if (
								game.hasPlayer(function (current) {
									return current.isLinked();
								})
							) {
								return 0;
							}
							return 1;
						},
					},
				},
			},
			yinyang: {
				enable: "phaseUse",
				usable: 1,
				filterCard: true,
				selectCard: 2,
				filterTarget: true,
				selectTarget: 3,
				content: function () {
					target.link();
				},
				check: function (card) {
					return 6 - get.value(card);
				},
				ai: {
					order: 2,
					result: {
						target: function (player, target) {
							if (target.isLinked()) return 1;
							return -1;
						},
					},
				},
			},
			xiushen: {
				trigger: { player: "phaseUseEnd" },
				forced: true,
				filter: function (event, player) {
					return game.hasPlayer(function (current) {
						return current.isLinked();
					});
				},
				content: function () {
					player.draw(2);
				},
				ai: {
					threaten: 1.6,
				},
			},
			jiean: {
				trigger: { source: "damageEnd" },
				frequent: true,
				filter: function (event) {
					if (event._notrigger.includes(event.player)) return false;
					return event.player.isAlive() && event.parent.name == "yanyi" && event.player.hp < event.player.maxHp;
				},
				content: function () {
					"step 0";
					player.draw(trigger.player.maxHp - trigger.player.hp);
					"step 1";
					event.cards = result;
					"step 2";
					player.chooseCardTarget({
						filterCard: function (card) {
							return _status.event.parent.cards.includes(card);
						},
						selectCard: [1, event.cards.length],
						filterTarget: function (card, player, target) {
							return player != target;
						},
						ai1: function (card) {
							if (ui.selected.cards.length > 0) return -1;
							return _status.event.player.countCards("h") - _status.event.player.hp;
						},
						ai2: function (target) {
							return get.attitude(_status.event.player, target) - 4;
						},
						prompt: "请选择要送人的卡牌",
					});
					"step 3";
					if (result.bool) {
						result.targets[0].gain(result.cards, player);
						player.$give(result.cards.length, result.targets[0]);
						for (var i = 0; i < result.cards.length; i++) {
							event.cards.remove(result.cards[i]);
						}
						if (event.cards.length) event.goto(2);
					}
				},
			},
			yanyi: {
				enable: "phaseUse",
				usable: 1,
				filterCard: { color: "black" },
				position: "he",
				filterTarget: function (card, player, target) {
					return target != player && target.countCards("h") > 0;
				},
				content: function () {
					"step 0";
					player.chooseControl("heart2", "diamond2", "club2", "spade2").ai = function (event) {
						switch (Math.floor(Math.random() * 5)) {
							case 0:
								return "heart2";
							case 1:
							case 4:
								return "diamond2";
							case 2:
								return "club2";
							case 3:
								return "spade2";
						}
					};
					"step 1";
					game.log(player, "选择了" + get.translation(result.control));
					event.choice = result.control.slice(0, result.control.length - 1);
					target.popup(result.control);
					target.showHandcards();
					"step 2";
					if (target.countCards("h", { suit: event.choice })) {
						target.damage();
					}
				},
				ai: {
					result: {
						target: function (player, target) {
							return get.damageEffect(target, player, target);
						},
					},
				},
			},
			wumu: {
				mod: {
					targetInRange: function (card, player) {
						if (card.name == "sha" && get.color(card) == "black") return true;
					},
					cardUsable: function (card) {
						if (card.name == "sha" && get.color(card) == "red") return Infinity;
					},
				},
				trigger: { player: "useCard" },
				filter: function (event, player) {
					return event.card.name == "sha" && get.color(event.card) == "red";
				},
				forced: true,
				content: function () {
					if (player.stat[player.stat.length - 1].card.sha > 0) {
						player.stat[player.stat.length - 1].card.sha--;
					}
				},
			},
			ysheshen: {
				inherit: "yiji",
			},
			sanbanfu: {
				trigger: { player: "shaBegin" },
				filter: function (event, player) {
					if (player.storage.sanbanfu || player.storage.sanbanfu2) return false;
					return !event.directHit;
				},
				check: function (event, player) {
					if (get.attitude(player, event.target) >= 0) return false;
					if (
						event.target.hasSkillTag(
							"freeShan",
							false,
							{
								player: player,
								card: event.card,
							},
							true
						)
					)
						return false;
					if (event.target.hasSkillTag("respondShan") && event.target.countCards("h") >= 3) return false;
					return true;
				},
				logTarget: "target",
				content: function () {
					"step 0";
					var next = trigger.target.chooseToRespond({ name: "shan" });
					next.autochoose = lib.filter.autoRespondShan;
					next.ai = function (card) {
						return get.unuseful2(card);
					};
					player.storage.sanbanfu = false;
					player.storage.sanbanfu2 = false;
					"step 1";
					if (result.bool == false) {
						trigger.untrigger();
						trigger.directHit = true;
						player.storage.sanbanfu2 = true;
					} else {
						player.storage.sanbanfu = true;
					}
				},
				group: ["sanbanfu2", "sanbanfu3"],
			},
			sanbanfu2: {
				trigger: { player: "shaAfter" },
				silent: true,
				content: function () {
					if (player.storage.sanbanfu) player.damage(trigger.target);
					delete player.storage.sanbanfu;
					delete player.storage.sanbanfu2;
				},
			},
			sanbanfu3: {
				trigger: { source: "damageBegin" },
				silent: true,
				filter: function (event, player) {
					return event.card && event.card.name == "sha" && player.storage.sanbanfu2;
				},
				content: function () {
					trigger.num++;
				},
			},
			bingsheng: {
				enable: "phaseUse",
				usable: 1,
				filterCard: function (card) {
					if (ui.selected.cards.length) {
						return get.suit(card) != get.suit(ui.selected.cards[0]);
					}
					return true;
				},
				complexCard: true,
				selectCard: 2,
				check: function (card) {
					return 8 - get.value(card);
				},
				filterTarget: function (card, player, target) {
					if (target.hp == Infinity) return false;
					if (target.hp > player.hp) return true;
					if (target.hp < player.hp && target.hp < target.maxHp) return true;
					return false;
				},
				content: function () {
					var num = target.hp - player.hp;
					if (num > 2) {
						num = 2;
					}
					if (num < -2) {
						num = -2;
					}
					if (num > 0) {
						target.damage(num);
					} else if (num < 0 && target.hp < target.maxHp) {
						target.recover(-num);
					}
				},
				ai: {
					order: 8.5,
					result: {
						target: function (player, target) {
							var num;
							if (player.hp > target.maxHp) {
								num = player.hp - target.maxHp;
							} else {
								num = player.hp - target.hp;
							}
							if (target.hp == 1 && num) {
								return num + 1;
							}
							return num;
						},
					},
				},
			},
			taolue: {
				mod: {
					maxHandcard: function (player, num) {
						return num + 1;
					},
				},
			},
			shentan: {
				enable: "phaseUse",
				usable: 1,
				filterCard: true,
				filterTarget: function (card, player, target) {
					return target.countCards("h") > 0 && get.distance(player, target) <= 2;
				},
				check: function (card) {
					return 7 - get.value(card);
				},
				position: "he",
				content: function () {
					"step 0";
					var hs = target.getCards("h");
					if (hs.length) {
						event.card = hs.randomGet();
						player.gain(event.card, target);
						target.$giveAuto(event.card, player);
					} else {
						event.finish();
					}
					"step 1";
					var source = target;
					player.chooseTarget("选择一个目标送出" + get.translation(event.card), function (card, player, target) {
						return target != player;
					}).ai = function (target) {
						var att = get.attitude(player, target);
						if (att > 3 && player.countCards("h") > target.countCards("h")) {
							return att;
						}
						return 0;
					};
					"step 2";
					if (result.bool) {
						result.targets[0].gain(card, player);
						player.$give(1, result.targets[0]);
						player.line(result.targets, "green");
						game.delay();
					}
				},
				ai: {
					order: 9,
					result: {
						target: -1,
						player: function (player, target) {
							if (get.attitude(player, target) > 0) {
								return 0;
							}
							return 1;
						},
					},
				},
			},
			hanqiang: {
				mod: {
					attackFrom: function (from, to, distance) {
						if (!from.getEquip(1)) return distance - 1;
					},
				},
			},
			biaoqi: {
				trigger: { player: "shaBegin" },
				forced: true,
				content: function () {
					var range = player.getAttackRange();
					if (range > trigger.target.hp) {
						trigger.directHit = true;
					} else if (range < trigger.target.hp) {
						player.draw();
					}
				},
			},
			wluoyan: {
				trigger: { player: "damageBefore" },
				forced: true,
				content: function () {
					trigger.cancel();
					player.loseHp();
				},
				ai: {
					noDirectDamage: true,
				},
			},
			heqin: {
				skillAnimation: true,
				enable: "phaseUse",
				filter: function (event, player) {
					return !player.storage.heqin;
				},
				filterTarget: function (card, player, target) {
					return target.sex == "male" && target != player;
				},
				content: function () {
					player.awakenSkill("heqin");
					player.addSkill("heqin2");
					target.addSkill("heqin2");

					target.marks.heqin = target.markCharacter(player, {
						name: "和亲",
						content: "摸牌阶段摸牌数+1",
					});
					game.addVideo("markCharacter", target, {
						name: "放权",
						content: "摸牌阶段摸牌数+1",
						id: "heqin",
						target: player.dataset.position,
					});

					player.storage.heqin = target;
					target.storage.heqin = player;

					player.marks.heqin = player.markCharacter(target, {
						name: "和亲",
						content: "摸牌阶段摸牌数+1",
					});
					game.addVideo("markCharacter", player, {
						name: "放权",
						content: "摸牌阶段摸牌数+1",
						id: "heqin",
						target: target.dataset.position,
					});
				},
				ai: {
					order: 1,
					result: {
						target: 1,
					},
				},
			},
			heqin2: {
				trigger: { player: "phaseDrawBegin" },
				forced: true,
				content: function () {
					trigger.num++;
				},
				group: "heqin3",
			},
			heqin3: {
				trigger: { player: "dieBegin" },
				forced: true,
				popup: false,
				content: function () {
					player.removeSkill("heqin2");
					player.unmarkSkill("heqin");
					if (player.storage.heqin) {
						player.storage.heqin.removeSkill("heqin2");
						player.storage.heqin.unmarkSkill("heqin");
					}
				},
			},
			chajue: {
				trigger: { player: "damageEnd" },
				forced: true,
				filter: function (event, player) {
					return _status.currentPhase != player;
				},
				content: function () {
					player.addTempSkill("chajue2", { player: "phaseBegin" });
				},
			},
			chajue2: {
				trigger: { target: "useCardToBefore" },
				forced: true,
				priority: 15,
				mark: true,
				intro: {
					content: "杀或普通锦囊牌对你无效",
				},
				filter: function (event, player) {
					return get.type(event.card) == "trick" || event.card.name == "sha";
				},
				content: function () {
					game.log(player, "发动了察觉，", trigger.card, "对", trigger.target, "失效");
					trigger.cancel();
				},
				ai: {
					effect: {
						target(card, player, target, current) {
							if (get.type(card) == "trick" || card.name == "sha") return "zeroplayertarget";
						},
					},
				},
			},
			tiewan: {
				trigger: { global: "useCardAfter" },
				filter: function (event, player) {
					return get.type(event.card.viewAs || event.card.name) == "delay" && event.player != player;
				},
				direct: true,
				content: function () {
					"step 0";
					player.chooseCardTarget({
						prompt: get.prompt("tiewan"),
						filterCard: { color: "red" },
						position: "he",
						filterTarget: function (card, player, target) {
							return player.canUse({ name: "lebu" }, target);
						},
						ai1: function (card) {
							return 7 - get.value(card);
						},
						ai2: function (target) {
							return get.effect(target, { name: "lebu" }, player, player);
						},
					});
					"step 1";
					if (result.bool) {
						player.logSkill("tiewan");
						player.useCard({ name: "lebu" }, result.cards, result.targets);
					}
				},
				ai: {
					threaten: 1.5,
				},
			},
			qianglue: {
				trigger: { player: "shaMiss" },
				priority: -1,
				filter: function (event) {
					return event.target.countCards("he") > 0;
				},
				check: function (event, player) {
					return get.attitude(player, event.target) < 0;
				},
				content: function () {
					"step 0";
					player.judge(function (card) {
						return get.color(card) == "black" ? 1 : -1;
					});
					"step 1";
					if (result.bool) {
						player.gainPlayerCard("he", trigger.target);
					}
				},
			},
			jimin: {
				enable: ["chooseToRespond", "chooseToUse"],
				filterCard: true,
				viewAs: { name: "shan" },
				viewAsFilter: function (player) {
					if (!player.countCards("h")) return false;
					if (player.countCards("e")) return false;
				},
				prompt: "将一张手牌当闪使用或打出",
				check: function () {
					return 1;
				},
				ai: {
					respondShan: true,
					skillTagFilter: function (player) {
						if (!player.countCards("h")) return false;
						if (player.countCards("e")) return false;
					},
					effect: {
						target: function (card, player, target, current) {
							if (get.tag(card, "respondShan") && current < 0 && !target.countCards("e")) return 0.6;
						},
					},
				},
			},
			xiadao: {
				trigger: { source: "damageEnd" },
				direct: true,
				filter: function (event, player) {
					if (event._notrigger.includes(event.player)) return false;
					if (event.player.isDead()) return false;
					var nh = event.player.countCards("h");
					if (nh == 0) return false;
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (players[i] != player && players[i] != event.player && players[i].countCards("h") <= nh) {
							return true;
						}
					}
					return false;
				},
				content: function () {
					"step 0";
					var nh = trigger.player.countCards("h");
					var att = get.attitude(player, trigger.player);
					player.chooseTarget(get.prompt("xiadao"), function (card, player, target) {
						return target != player && target != trigger.player && target.countCards("h") <= nh;
					}).ai = function (target) {
						if (att > 0) return 0;
						return get.attitude(player, target);
					};
					"step 1";
					if (result.bool) {
						player.logSkill("xiadao");
						player.line2([trigger.player, result.targets[0]], "green");
						event.target = result.targets[0];
						game.delay();
					} else {
						event.finish();
					}
					"step 0";
					if (event.target) {
						var card = trigger.player.getCards("h").randomGet();
						event.target.gain(card, trigger.player);
						trigger.player.$giveAuto(card, event.target);
					}
				},
				ai: {
					expose: 0.2,
					threaten: 1.4,
				},
			},
			lzhangyi: {
				trigger: { player: "discardAfter" },
				filter: function (event, player) {
					for (var i = 0; i < event.cards.length; i++) {
						if (get.position(event.cards[i]) == "d") {
							return true;
						}
					}
					return false;
				},
				direct: true,
				popup: false,
				content: function () {
					"step 0";
					if (trigger.delay == false) game.delay();
					"step 1";
					var du = 1;
					if (trigger.cards.length == 1 && trigger.cards[0].name == "du") {
						du = -1;
					} else {
						for (var i = 0; i < trigger.cards.length; i++) {
							if (trigger.cards[i].name == "du") {
								du = -1;
								break;
							}
						}
						if (du == -1 && trigger.cards.length > 2) {
							du = 0;
						}
					}
					player
						.chooseTarget(get.prompt("lzhangyi"), function (card, player, target) {
							return player != target;
						})
						.set("du", du).ai = function (target) {
							var att = get.attitude(_status.event.player, target);
							return att * _status.event.du;
						};
					"step 2";
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill("lzhangyi", target);
						var cards = [];
						for (var i = 0; i < trigger.cards.length; i++) {
							if (get.position(trigger.cards[i]) == "d") {
								cards.push(trigger.cards[i]);
							}
						}
						target.gain(cards);
						target.$gain2(cards);
						if (target == game.me) {
							game.delayx();
						}
					}
				},
				ai: {
					threaten: 0.9,
					expose: 0.1,
				},
			},
			yizhuang: {
				trigger: { player: "phaseBegin" },
				group: "yizhuang2",
				direct: true,
				content: function () {
					"step 0";
					if (player.countCards("he")) {
						player.chooseCardTarget({
							prompt: get.prompt("yizhuang"),
							filterCard: lib.filter.cardDiscardable,
							position: "he",
							filterTarget: function (card, player, target) {
								if (target == player) return false;
								if (target.sex != "male") return false;
								var name = target.name.indexOf("unknown") == 0 ? target.name2 : target.name;
								if (name == player.storage.yizhuang) return false;
								var info = lib.character[name];
								if (info) {
									var skills = info[3];
									for (var j = 0; j < skills.length; j++) {
										if (lib.translate[skills[j] + "_info"] && lib.skill[skills[j]] && !lib.skill[skills[j]].unique && !player.hasSkill(skills[j])) {
											return true;
										}
									}
								}
								return false;
							},
							ai1: function (card) {
								if (player.additionalSkills.yizhuang && player.additionalSkills.yizhuang.length > 0) return 0;
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
						player.unmark(player.storage.yizhuang + "_charactermark");
						player.discard(result.cards);
						player.logSkill("yizhuang", result.targets);
						var name = result.targets[0].name;
						if (name.indexOf("unknown") == 0) {
							name = result.targets[0].name2;
						}
						var list = [];
						var skills = lib.character[name][3];
						for (var j = 0; j < skills.length; j++) {
							if (lib.translate[skills[j] + "_info"] && lib.skill[skills[j]] && !lib.skill[skills[j]].unique && !player.hasSkill(skills[j])) {
								list.push(skills[j]);
							}
						}
						player.addAdditionalSkill("yizhuang", list);
						player.markCharacter(name, null, true, true);
						game.addVideo("markCharacter", player, {
							name: "幻形",
							content: "",
							id: "yizhuang",
							target: name,
						});
						player.storage.yizhuang = name;
					}
				},
				ai: {
					threaten: 1.5,
				},
			},
			yizhuang2: {
				trigger: { player: "damageAfter" },
				priority: -15,
				forced: true,
				filter: function (event, player) {
					return player.additionalSkills.yizhuang && player.additionalSkills.yizhuang.length > 0;
				},
				content: function () {
					player.unmark(player.storage.yizhuang + "_charactermark");
					player.removeAdditionalSkill("yizhuang");
					delete player.storage.yizhuang;
					player.checkMarks();
				},
			},
			kongju: {
				mod: {
					maxHandcard: function (player, num) {
						if (player.hp < player.maxHp) return num + player.maxHp - player.hp;
					},
					targetEnabled: function (card, player, target, now) {
						if (target.countCards("h") < target.maxHp) {
							if (card.name == "shunshou" || card.name == "guohe") return false;
						} else if (target.countCards("h") > target.maxHp) {
							if (card.name == "lebu") return false;
						}
					},
				},
			},
			tuqiang: {
				trigger: { player: ["respond", "useCard"] },
				filter: function (event, player) {
					return event.card && event.card.name == "shan";
				},
				frequent: true,
				content: function () {
					player.draw();
				},
				ai: {
					mingzhi: false,
					effect: {
						player_use(card, player, target) {
							if (get.tag(card, "respondShan")) {
								return 0.8;
							}
						},
					},
				},
			},
			xumou: {
				inherit: "jushou",
			},
			zhensha: {
				trigger: { global: "dying" },
				priority: 9,
				filter: function (event, player) {
					return event.player.hp <= 0 && (player.countCards("h", "jiu") > 0 || player.countCards("h", { color: "black" }) >= 2) && player != event.player;
				},
				direct: true,
				content: function () {
					"step 0";
					var goon = get.attitude(player, trigger.player) < 0;
					var next = player.chooseToDiscard("鸠杀：是否弃置一张酒或两张黑色手牌令" + get.translation(trigger.player) + "立即死亡？");
					next.ai = function (card) {
						if (ui.selected.cards.length) {
							if (ui.selected.cards[0].name == "jiu") return 0;
						}
						if (goon) {
							if (card.name == "jiu") return 2;
							return 1;
						}
						return 0;
					};
					next.filterCard = function (card) {
						if (ui.selected.cards.length) {
							return get.color(card) == "black";
						}
						return get.color(card) == "black" || card.name == "jiu";
					};
					(next.complexCard = true), (next.logSkill = ["zhensha", trigger.player]);
					next.selectCard = function () {
						if (ui.selected.cards.length) {
							if (ui.selected.cards[0].name == "jiu") return [1, 1];
						}
						return [2, 2];
					};
					"step 1";
					if (result.bool) {
						trigger.player.die();
					} else {
						event.finish();
					}
					"step 2";
					if (!trigger.player.isAlive()) {
						trigger.cancel(true);
					}
				},
				ai: {
					threaten: 1.5,
				},
			},
			ducai: {
				enable: "phaseUse",
				usable: 1,
				unique: true,
				forceunique: true,
				check: function (card) {
					if (_status.event.player.countCards("h") >= 3) {
						return 5 - get.value(card);
					}
					return 0;
				},
				position: "he",
				filterCard: true,
				content: function () {
					player.storage.ducai2 = cards[0];
					player.addTempSkill("ducai2", { player: "phaseBegin" });
				},
				ai: {
					order: 8,
					result: {
						player: 1,
					},
				},
				global: "ducai3",
			},
			ducai2: {
				mark: "card",
				intro: {
					content: "card",
				},
			},
			ducai3: {
				mod: {
					cardEnabled: function (card, player) {
						if (player.hasSkill("ducai2")) return;
						var suit,
							players = game.filterPlayer();
						for (var i = 0; i < players.length; i++) {
							if (players[i].hasSkill("ducai2")) {
								suit = get.suit(players[i].storage.ducai2);
							}
						}
						if (suit && get.suit(card) == suit) return false;
					},
					cardUsable: function (card, player) {
						if (player.hasSkill("ducai2")) return;
						var suit,
							players = game.filterPlayer();
						for (var i = 0; i < players.length; i++) {
							if (players[i].hasSkill("ducai2")) {
								suit = get.suit(players[i].storage.ducai2);
							}
						}
						if (suit && get.suit(card) == suit) return false;
					},
					cardRespondable: function (card, player) {
						if (player.hasSkill("ducai2")) return;
						var suit,
							players = game.filterPlayer();
						for (var i = 0; i < players.length; i++) {
							if (players[i].hasSkill("ducai2")) {
								suit = get.suit(players[i].storage.ducai2);
							}
						}
						if (suit && get.suit(card) == suit) return false;
					},
					cardSavable: function (card, player) {
						if (player.hasSkill("ducai2")) return;
						var suit,
							players = game.filterPlayer();
						for (var i = 0; i < players.length; i++) {
							if (players[i].hasSkill("ducai2")) {
								suit = get.suit(players[i].storage.ducai2);
							}
						}
						if (suit && get.suit(card) == suit) return false;
					},
				},
			},
			tongling: {
				init: function (player) {
					player.storage.tongling = 0;
				},
				intro: {
					content: "mark",
				},
				forced: true,
				trigger: { global: "damageAfter" },
				filter: function (event, player) {
					return event.source && event.source.isFriendsOf(player) && player.storage.tongling < 3;
				},
				content: function () {
					player.storage.tongling++;
					player.syncStorage("tongling");
					player.markSkill("tongling");
				},
				ai: {
					combo: "fanpu",
				},
			},
			fanpu: {
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					return player.storage.tongling >= 3;
				},
				filterTarget: function (card, player, target) {
					return player.canUse("sha", target);
				},
				selectTarget: [1, 3],
				multitarget: true,
				multiline: true,
				content: function () {
					player.storage.tongling -= 3;
					player.unmarkSkill("tongling");
					player.syncStorage("tongling");
					player.useCard({ name: "sha" }, targets, false);
				},
				ai: {
					combo: "tongling",
					order: 2,
				},
			},
			fenghuo: {
				enable: "chooseToUse",
				filter: function (event, player) {
					return player.countCards("e") > 0;
				},
				filterCard: true,
				position: "e",
				viewAs: { name: "nanman" },
				prompt: "将一张装备区内的牌当南蛮入侵使用",
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
			nichang: {
				trigger: { player: "phaseDrawBefore" },
				check: function (event, player) {
					if (player.skipList.includes("phaseUse")) return true;
					var suits = ["spade", "heart", "diamond", "club"];
					var cards = player.getCards("h");
					for (var i = 0; i < cards.length; i++) {
						suits.remove(get.suit(cards[i]));
					}
					return suits.length >= 2;
				},
				content: function () {
					trigger.cancel();
					player.addSkill("nichang2");
				},
			},
			nichang2: {
				trigger: { player: "phaseEnd" },
				forced: true,
				content: function () {
					"step 0";
					if (player.countCards("h")) {
						player.showHandcards();
					}
					player.removeSkill("nichang2");
					"step 1";
					var suits = ["spade", "heart", "diamond", "club"];
					var cards = player.getCards("h");
					for (var i = 0; i < cards.length; i++) {
						suits.remove(get.suit(cards[i]));
					}
					player.draw(suits.length);
				},
			},
			fengyan: {
				trigger: { global: "cardsDiscardAfter" },
				frequent: true,
				filter: function (event, player) {
					var evt = event.getParent().relatedEvent;
					if (!evt || evt.name != "judge") return;
					if (evt.player.sex != "male") return false;
					if (get.position(event.cards[0], true) != "d") return false;
					return get.color(event.cards[0]) == "red";
				},
				content: function () {
					player.gain(trigger.cards, "gain2");
				},
			},
			fengyi: {
				enable: "phaseUse",
				usable: 1,
				filterCard: true,
				filterTarget: true,
				check: function (card) {
					return 8 - get.value(card);
				},
				content: function () {
					target.draw(2);
				},
				ai: {
					result: {
						target: 2,
					},
					order: 1,
					threaten: 1.5,
				},
			},
			wange: {
				trigger: { player: "phaseDrawBegin" },
				check: function (event, player) {
					return game.hasPlayer(function (current) {
						return get.attitude(player, current) < 0 && current.countCards("h");
					});
				},
				content: function () {
					trigger.num--;
					player.addSkill("wange2");
				},
				ai: {
					threaten: 1.8,
				},
			},
			wange2: {
				trigger: { player: "phaseEnd" },
				direct: true,
				content: function () {
					"step 0";
					var num = Math.max(1, player.maxHp - player.hp);
					player.chooseTarget("婉歌：获得至多" + get.cnNumber(num) + "名角色的一张手牌", [1, num], function (card, player, target) {
						return target.countCards("h") && target != player;
					}).ai = function (target) {
						return -get.attitude(player, target);
					};
					player.removeSkill("wange2");
					"step 1";
					if (result.bool) {
						event.targets = result.targets;
						player.logSkill("wange", result.targets);
					} else {
						event.finish();
					}
					"step 2";
					if (event.targets.length) {
						player.gainMultiple(event.targets);
					} else {
						event.finish();
					}
					"step 3";
					game.delay();
				},
			},
			seyou: {
				skillAnimation: true,
				unique: true,
				mark: true,
				init: function (player) {
					player.storage.seyou = false;
				},
				enable: "phaseUse",
				filter: function (event, player) {
					return !player.storage.seyou;
				},
				intro: {
					content: "limited",
				},
				filterTarget: true,
				content: function () {
					"step 0";
					player.awakenSkill("seyou");
					player.storage.seyou = true;
					event.targets = game.filterPlayer();
					event.targets.remove(player);
					event.targets.remove(target);
					for (var i = 0; i < event.targets.length; i++) {
						if (event.targets[i].sex != "male") {
							event.targets.splice(i--, 1);
						}
					}
					"step 1";
					if (event.targets.length) {
						event.current = event.targets.shift();
						if (event.current.countCards("he") && target.isAlive()) {
							event.current.chooseToUse({ name: "sha" }, target, -1);
						}
					} else {
						event.finish();
					}
					"step 2";
					if (result.bool == false) {
						player.gainPlayerCard(event.current, true, "he");
					}
					event.goto(1);
				},
				ai: {
					order: 5,
					result: {
						target: function (player, target) {
							var players = game.filterPlayer();
							if (player.hp > 1) {
								if (game.phaseNumber < game.players.length) return 0;
								for (var i = 0; i < players.length; i++) {
									if (players[i].ai.shown == 0) return 0;
									if (players[i].sex == "unknown") return 0;
								}
							}
							var effect = 0;
							for (var i = 0; i < players.length; i++) {
								if (players[i].sex == "male" && players[i] != target && players[i] != player && players[i].countCards("he")) effect += get.effect(target, { name: "sha" }, players[i], target);
							}
							return effect;
						},
					},
				},
			},
			sheshi: {
				trigger: { player: "damageEnd" },
				direct: true,
				content: function () {
					"step 0";
					if (event.isMine()) {
						event.dialog = ui.create.dialog(get.prompt("sheshi"));
					}
					if (ui.cardPile.childNodes.length < 4) {
						var discardcards = get.cards(4);
						for (var i = 0; i < discardcards.length; i++) {
							discardcards[i].discard();
						}
					}
					player.chooseControl("heart2", "diamond2", "club2", "spade2", "cancel").ai = function (event) {
						if (Math.random() < 0.5) return "club2";
						if (Math.random() < 0.5) return "spade2";
						if (Math.random < 2 / 3) return "diamond2";
						return "heart2";
					};
					"step 1";
					if (event.dialog) {
						event.dialog.close();
					}
					if (result.control && result.control.indexOf("2") != -1) {
						player.logSkill("sheshi");
						game.log(player, "指定的花色为" + get.translation(result.control));
						var suit = result.control.slice(0, result.control.length - 1);
						var cards = [];
						for (var i = 0; i < ui.cardPile.childNodes.length; i++) {
							var card = ui.cardPile.childNodes[i];
							cards.push(card);
							if (get.suit(card) == suit || i >= 3) {
								break;
							}
						}
						event.cards = cards;
						event.suit = suit;
						player.showCards(cards);
					} else {
						event.finish();
					}
					"step 2";
					if (event.cards && event.cards.length) {
						if (get.suit(event.cards[event.cards.length - 1]) == event.suit) {
							event.cards.pop().discard();
						}
						if (event.cards.length) {
							player.gain(event.cards, "draw2");
						}
					}
				},
				ai: {
					maixie: true,
					maixie_hp: true,
					effect: {
						target: function (card, player, target) {
							if (get.tag(card, "damage")) {
								if (player.hasSkillTag("jueqing", false, target)) return [1, -2];
								if (!target.hasFriend()) return;
								if (target.hp >= 4) return [1, 2];
								if (target.hp == 3) return [1, 1.5];
								if (target.hp == 2) return [1, 0.5];
							}
						},
					},
				},
			},
			bolehuiyan: {
				trigger: { global: "shaBegin" },
				direct: true,
				priority: 11,
				filter: function (event, player) {
					if (player.hasSkill("bolehuiyan4")) return false;
					if (event.target.isUnderControl()) return false;
					return event.player != player && event.target != player && event.target.countCards("h") > 0;
				},
				group: ["bolehuiyan2", "bolehuiyan3"],
				content: function () {
					"step 0";
					if (event.isMine()) {
						event.dialog = ui.create.dialog("慧眼：预言" + get.translation(trigger.player) + "对" + get.translation(trigger.target) + "的杀能否命中");
					}
					player.chooseControl("能命中", "不能命中", "cancel").ai = function (event) {
						if (trigger.player.hasSkill("wushuang")) return 0;
						if (trigger.player.hasSkill("liegong")) return 0;
						if (trigger.player.hasSkill("tieji")) return 0;
						if (trigger.player.hasSkill("juji")) return 0;
						if (trigger.player.hasSkill("retieji")) return 0;
						if (trigger.player.hasSkill("roulin") && trigger.target.sex == "female") return 0;
						if (trigger.player.hasSkill("nvquan") && trigger.target.sex == "male") return 0;
						if (trigger.target.hasSkill("yijue2")) return 0;
						if (trigger.target.hasSkill("shejie2")) return 0;
						if (trigger.target.hasSkill("shanguang2")) return 0;

						var equip = trigger.target.getEquip(2);
						if (equip && (equip.name == "bagua" || equip.name == "rewrite_bagua")) return 1;
						return trigger.target.countCards("h") < 2 ? 0 : 1;
					};
					"step 1";
					if (event.dialog) {
						event.dialog.close();
					}
					if (result.control != "cancel") {
						player.addTempSkill("bolehuiyan4");
						player.logSkill(["bolehuiyan", result.control], trigger.target);
						game.log(player, "预言" + result.control);
						player.storage.bolehuiyan = result.control;
						game.delay();
					}
				},
				ai: {
					threaten: 1.3,
				},
			},
			bolehuiyan2: {
				trigger: { global: "shaEnd" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return player.storage.bolehuiyan ? true : false;
				},
				content: function () {
					if (player.storage.bolehuiyan == "不能命中") {
						player.popup("预言成功");
						player.draw();
					} else {
						player.popup("预言失败");
						player.chooseToDiscard("预言失败，请弃置一张牌", "he", true);
					}
					delete player.storage.bolehuiyan;
				},
			},
			bolehuiyan3: {
				trigger: { global: "shaDamage" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return player.storage.bolehuiyan ? true : false;
				},
				content: function () {
					if (player.storage.bolehuiyan == "能命中") {
						player.popup("预言成功");
						player.draw();
					} else {
						player.popup("预言失败");
						player.chooseToDiscard("预言失败，请弃置一张牌", "he", true);
					}
					delete player.storage.bolehuiyan;
				},
			},
			bolehuiyan4: {},
			oldbolehuiyan: {
				trigger: { global: "judgeBegin" },
				direct: true,
				priority: 11,
				filter: function (event, player) {
					return event.player != player;
				},
				content: function () {
					"step 0";
					if (event.isMine()) {
						event.dialog = ui.create.dialog("慧眼：预言" + get.translation(trigger.player) + "的" + trigger.judgestr + "判定");
					}
					player.chooseControl("heart2", "diamond2", "club2", "spade2", "cancel").ai = function (event) {
						switch (Math.floor(Math.random() * 4)) {
							case 0:
								return "heart2";
							case 1:
								return "diamond2";
							case 2:
								return "club2";
							case 3:
								return "spade2";
						}
					};
					"step 1";
					if (event.dialog) {
						event.dialog.close();
					}
					if (result.control != "cancel") {
						game.log(player, "预言判定结果为" + get.translation(result.control));
						player.storage.bolehuiyan = result.control.slice(0, result.control.length - 1);
						player.popup(result.control);
						game.delay();
					}
				},
				group: "bolehuiyan2",
			},
			oldbolehuiyan2: {
				trigger: { global: "judgeEnd" },
				forced: true,
				popup: false,
				content: function () {
					if (player.storage.bolehuiyan == trigger.result.suit) {
						game.log(player, "预言成功");
						player.popup("洗具");
						player.draw(2);
					} else if (get.color({ suit: player.storage.bolehuiyan }) == trigger.result.color) {
						player.popup("洗具");
						player.draw();
					}
					delete player.storage.bolehuiyan;
				},
			},
			xiangma: {
				inherit: "yicong",
			},
			yxsweiyi: {
				trigger: { player: "damageEnd" },
				filter: function (event, player) {
					return event.source && event.source.countCards("he");
				},
				check: function (event, player) {
					return get.attitude(player, event.source) < 0;
				},
				content: function () {
					trigger.source.chooseToDiscard(2, "he", true);
				},
				logTarget: "source",
				ai: {
					maixie_defend: true,
					expose: 0.3,
					result: {
						target: function (card, player, target) {
							if (player.countCards("he") > 1 && get.tag(card, "damage")) {
								if (player.hasSkillTag("jueqing", false, target)) return [1, -1];
								if (get.attitude(target, player) < 0) return [1, 0, 0, -1.5];
							}
						},
					},
				},
			},
			qiandu: {
				enable: "phaseUse",
				usable: 1,
				changeSeat: true,
				seatRelated: true,
				filterTarget: function (card, player, target) {
					return player != target && player.next != target;
				},
				filterCard: { color: "black" },
				check: function (card) {
					return 4 - get.value(card);
				},
				content: function () {
					game.swapSeat(player, target);
				},
				ai: {
					order: 5,
					result: {
						player: function (player, target) {
							var att = get.attitude(player, target);
							if (target == player.previous && att > 0) return att;
							if (target == player.next && att < 0) return -att;
							var att2 = get.attitude(player, player.next);
							if (target == player.next.next && att < 0 && att2 < 0) return -att - att2;
							return 0;
						},
					},
				},
			},
			nvquan: {
				locked: false,
				group: ["nvquan1", "nvquan2", "nvquan3"],
			},
			nvquan1: {
				trigger: { player: "shaBegin" },
				forced: true,
				filter: function (event) {
					return event.target.sex == "male";
				},
				priority: -1,
				content: function () {
					if (typeof trigger.shanRequired == "number") {
						trigger.shanRequired++;
					} else {
						trigger.shanRequired = 2;
					}
				},
			},
			nvquan2: {
				trigger: { player: "juedou", target: "juedou" },
				forced: true,
				filter: function (event, player) {
					return event.turn != player && event.turn.sex == "male";
				},
				priority: -1,
				content: function () {
					"step 0";
					var next = trigger.turn.chooseToRespond({ name: "sha" }, "请打出一张杀响应决斗");
					next.set("prompt2", "（共需打出2张杀）");
					next.autochoose = lib.filter.autoRespondSha;
					next.ai = function (card) {
						if (get.attitude(trigger.turn, player) < 0 && trigger.turn.countCards("h", "sha") > 1) {
							return get.unuseful2(card);
						}
						return -1;
					};
					"step 1";
					if (result.bool == false) {
						trigger.directHit = true;
					}
				},
				ai: {
					result: {
						target: function (card, player, target) {
							if (card.name == "juedou" && target.countCards("h") > 0) return [1, 0, 0, -1];
						},
					},
				},
			},
			nvquan3: {
				mod: {
					targetEnabled: function (card, player, target) {
						if (card.name == "juedou" && player.sex == "male") {
							return false;
						}
					},
				},
			},
			feigong: {
				trigger: { global: "useCard" },
				priority: 15,
				filter: function (event, player) {
					return event.card.name == "sha" && event.player != player && player.countCards("h", "sha") > 0 && event.targets.includes(player) == false;
				},
				direct: true,
				content: function () {
					"step 0";
					var effect = 0;
					for (var i = 0; i < trigger.targets.length; i++) {
						effect += get.effect(trigger.targets[i], trigger.card, trigger.player, player);
					}
					var str = "弃置一张杀令" + get.translation(trigger.player);
					if (trigger.targets && trigger.targets.length) {
						str += "对" + get.translation(trigger.targets);
					}
					str += "的" + get.translation(trigger.card) + "失效";
					var next = player.chooseToDiscard("h", { name: "sha" }, get.prompt("feigong"));
					next.prompt2 = str;
					next.ai = function (card) {
						if (effect < 0) {
							return 9 - get.value(card);
						}
						return -1;
					};
					next.autodelay = true;
					next.logSkill = ["feigong", trigger.player];
					"step 1";
					if (result.bool) {
						trigger.cancel();
					}
				},
				ai: {
					threaten: 1.2,
					expose: 0.2,
				},
			},
			jianai: {
				trigger: { player: "recoverEnd" },
				check: function (event, player) {
					if (event.parent.name == "taoyuan" && event.parent.player == player) {
						return false;
					}
					var num = 0;
					var eff,
						players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (players[i] != player) {
							eff = 0;
							if (players[i].hp < players[i].maxHp) {
								eff++;
							}
							if (players[i].hp == 1 && players[i].maxHp > 2) {
								eff += 0.5;
							}
						}
						if (get.attitude(player, players[i]) > 0) {
							num += eff;
						} else if (get.attitude(player, players[i]) < 0) {
							num -= eff;
						}
					}
					return num > 0;
				},
				content: function () {
					"step 0";
					event.targets = game.filterPlayer();
					event.targets.remove(player);
					"step 1";
					if (event.targets.length) {
						event.targets.shift().recover();
						event.redo();
					}
				},
				ai: {
					expose: 0.1,
				},
			},
			jieyong: {
				trigger: { player: "useCardAfter" },
				direct: true,
				filter: function (event, player) {
					if (event.cards.filterInD().length == 0) return false;
					if (player.hasSkill("jieyong2")) return false;
					return player.countCards("he", { color: "black" }) > 0;
				},
				content: function () {
					"step 0";
					var next = player.chooseToDiscard("he", "是否弃置一张黑色牌并收回" + get.translation(trigger.cards.filterInD()) + "？", { color: "black" });
					next.ai = function (card) {
						return get.value(trigger.card) - get.value(card);
					};
					next.logSkill = "jieyong";
					"step 1";
					if (result.bool) {
						player.gain(trigger.cards.filterInD(), "gain2", "log");
						player.addTempSkill("jieyong2", ["phaseAfter", "phaseBegin"]);
					}
				},
				ai: {
					threaten: 1.3,
				},
			},
			jieyong2: {
				filterCard: { suit: "heart" },
				popname: true,
			},
			jieyong3: {
				trigger: { player: "useCardBefore" },
				forced: true,
				popup: false,
				filter: function (event, player) {
					return event.skill == "jieyong2";
				},
				content: function () {
					player.popup(trigger.card.name);
					player.getStat("skill").jieyong++;
				},
			},
			jieyong4: {},
			jieyong5: {},
			jieyong6: {},
			zhulu: {
				trigger: { global: "useCardAfter" },
				direct: true,
				filter: function (event, player) {
					return _status.currentPhase != player && event.player != player && get.type(event.card) == "trick" && event.cards.filterInD().length > 0 && !player.hasSkill("zhulu2") && player.countCards("he", { suit: get.suit(event.card) }) > 0;
				},
				content: function () {
					"step 0";
					var val = get.value(trigger.card);
					var suit = get.suit(trigger.card);
					var next = player.chooseToDiscard("he", "逐鹿：是否弃置一张" + get.translation(suit) + "牌并获得" + get.translation(trigger.cards.filterInD()) + "？", { suit: suit });
					next.ai = function (card) {
						return val - get.value(card);
					};
					next.logSkill = "zhulu";
					"step 1";
					if (result.bool) {
						player.gain(trigger.cards.filterInD(), "log", "gain2");
						player.addTempSkill("zhulu2");
					}
				},
				ai: {
					threaten: 1.2,
				},
			},
			zhulu2: {},
			xieling: {
				enable: "phaseUse",
				usable: 1,
				filterCard: true,
				selectCard: 2,
				check: function (card) {
					return 7 - get.value(card);
				},
				multitarget: true,
				targetprompt: ["被移走", "移动目标"],
				filterTarget: function (card, player, target) {
					if (ui.selected.targets.length) {
						var from = ui.selected.targets[0];
						var judges = from.getCards("j");
						for (var i = 0; i < judges.length; i++) {
							if (!target.hasJudge(judges[i].viewAs || judges[i].name)) return true;
						}
						if (target.isMin()) return false;
						if ((from.getEquip(1) && !target.getEquip(1)) || (from.getEquip(2) && !target.getEquip(2)) || (from.getEquip(3) && !target.getEquip(3)) || (from.getEquip(4) && !target.getEquip(4)) || (from.getEquip(5) && !target.getEquip(5))) return true;
						return false;
					} else {
						return target.countCards("ej") > 0;
					}
				},
				selectTarget: 2,
				content: function () {
					"step 0";
					if (targets.length == 2) {
						player.choosePlayerCard(
							"ej",
							function (button) {
								if (get.attitude(player, targets[0]) > get.attitude(player, targets[1])) {
									return get.position(button.link) == "j" ? 10 : 0;
								} else {
									if (get.position(button.link) == "j") return -10;
									return get.equipValue(button.link);
								}
							},
							targets[0]
						);
					} else {
						event.finish();
					}
					"step 1";
					if (result.bool) {
						if (get.position(result.buttons[0].link) == "e") {
							event.targets[1].equip(result.buttons[0].link);
						} else if (result.buttons[0].link.viewAs) {
							event.targets[1].addJudge({ name: result.buttons[0].link.viewAs }, [result.buttons[0].link]);
						} else {
							event.targets[1].addJudge(result.buttons[0].link);
						}
						event.targets[0].$give(result.buttons[0].link, event.targets[1]);
						game.delay();
					}
				},
				ai: {
					order: 10,
					result: {
						target: function (player, target) {
							if (ui.selected.targets.length == 0) {
								if (target.countCards("j") && get.attitude(player, target) > 0) return 1;
								if (get.attitude(player, target) < 0) {
									var players = game.filterPlayer();
									for (var i = 0; i < players.length; i++) {
										if (get.attitude(player, players[i]) > 0) {
											if ((target.getEquip(1) && !players[i].getEquip(1)) || (target.getEquip(2) && !players[i].getEquip(2)) || (target.getEquip(3) && !players[i].getEquip(3)) || (target.getEquip(4) && !players[i].getEquip(4)) || (target.getEquip(5) && !players[i].getEquip(5))) return -1;
										}
									}
								}
								return 0;
							} else {
								return get.attitude(player, ui.selected.targets[0]) > 0 ? -1 : 1;
							}
						},
					},
					expose: 0.2,
					threaten: 1.5,
				},
			},
			qiangyun: {
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
					noh: true,
					skillTagFilter(player, tag, arg) {
						if (tag === "noh") return player.countCards("h") === 1;
					},
					effect: {
						player_use(card, player, target) {
							if (player.countCards("h") === 1) return [1, 0.8];
						},
						target(card, player, target) {
							if (get.tag(card, "loseCard") && target.countCards("h") === 1) return 0.5;
						},
					},
				},
			},
			cike: {
				trigger: { player: "shaBegin" },
				check: function (event, player) {
					return get.attitude(player, event.target) <= 0;
				},
				logTarget: "target",
				content: function () {
					"step 0";
					player.judge();
					"step 1";
					switch (result.color) {
						case "red":
							trigger.directHit = true;
							break;

						case "black":
							player.discardPlayerCard(trigger.target);
							break;

						default:
							break;
					}
				},
				ai: {
					threaten: 1.2,
				},
			},
			miaobix: {
				filterCard: true,
				selectCard: 1,
				popname: true,
			},
			miaobi: {
				enable: "phaseUse",
				usable: 1,
				filterTarget: function (card, player, target) {
					return target != player && target.countCards("he") > 0;
				},
				content: function () {
					"step 0";
					player.discardPlayerCard(target, true);
					"step 1";
					if (result.bool) {
						var type = get.type(result.cards[0]);
						if (type != "basic" && type != "trick") {
							player.chooseToDiscard("he", true);
							event.finish();
						} else {
							event.card = result.cards[0];
						}
					} else {
						event.finish();
					}
					"step 2";
					var card = event.card;
					card = { name: card.name, nature: card.nature, suit: card.suit, number: card.number };
					if (lib.filter.cardEnabled(card)) {
						if (
							game.hasPlayer(function (current) {
								return player.canUse(card, current);
							})
						) {
							lib.skill.miaobix.viewAs = card;
							var next = player.chooseToUse();
							next.logSkill = "miaobi";
							next.set("openskilldialog", "妙笔：将一张手牌当" + get.translation(card) + "使用");
							next.set("norestore", true);
							next.set("_backupevent", "miaobix");
							next.set("custom", {
								add: {},
								replace: { window: function () { } },
							});
							next.backup("miaobix");
						}
					}
				},
				ai: {
					order: 9,
					result: {
						target: -1,
					},
				},
			},
			zhexian: {
				trigger: { player: "loseEnd" },
				usable: 1,
				filter: function (event, player) {
					return _status.currentPhase != player;
				},
				frequent: true,
				content: function () {
					player.draw();
				},
			},
			guifu: {
				enable: "phaseUse",
				usable: 1,
				filterTarget: function (card, player, target) {
					return player != target && target.countCards("e") > 0;
				},
				content: function () {
					"step 0";
					player.discardPlayerCard(target, "e", true);
					"step 1";
					game.asyncDraw([player, target]);
				},
				ai: {
					order: 8,
					threaten: 1.5,
					result: {
						target: -1,
						player: 0.5,
					},
				},
			},
			lshengong: {
				enable: "phaseUse",
				usable: 1,
				filterTarget: function (card, player, target) {
					return target.hasCard(function (card) {
						return !get.info(card).unique;
					}, "e");
				},
				check: function (card) {
					return 6 - get.value(card);
				},
				filterCard: function (card) {
					var info = lib.card[card.name];
					if (!info) return false;
					return !info.image && !info.fullimage;
				},
				discard: false,
				lose: false,
				content: function () {
					"step 0";
					var next = player.choosePlayerCard(target, "e", true);
					next.ai = get.buttonValue;
					next.filterButton = function (button) {
						return !get.info(button.link).unique;
					};
					"step 1";
					if (result.bool) {
						event.card = get.autoViewAs({ name: result.links[0].name }, event.cards);
						player
							.chooseTarget("神工：选择一个角色装备" + get.translation(event.card) + "（" + get.translation(event.cards) + "）", function (card, player, target) {
								return target.canEquip(get.event().getParent().card, true);
							})
							.set("ai", target => {
								const card = get.event().getParent().card;
								return get.equipValue(card, target) * get.attitude(get.player(), target);
							});
					} else {
						event.finish();
					}
					"step 2";
					if (result.targets && result.targets[0] && event.card) {
						player.$give(event.card, result.targets[0]);
						game.delay();
						event.toequip = result.targets[0];
					} else {
						event.finish();
					}
					"step 3";
					if (event.toequip) {
						event.toequip.equip(event.card);
					}
				},
				ai: {
					order: 9,
					threaten: 1.5,
					result: {
						player: function (player) {
							if (player.countCards("e") < 3) return 1;
							return 0;
						},
					},
				},
			},
		},
		translate: {
			yxs_guanyu: "关羽",
			yxs_wuzetian: "武则天",
			yxs_caocao: "曹操",
			yxs_mozi: "墨子",
			yxs_bole: "伯乐",
			yxs_aijiyanhou: "埃及艳后",
			yxs_diaochan: "貂蝉",
			yxs_yangyuhuan: "杨玉环",
			yxs_baosi: "褒姒",
			yxs_napolun: "拿破仑",
			yxs_kaisa: "凯撒",
			yxs_zhuyuanzhang: "朱元璋",
			yxs_jinke: "荆轲",
			yxs_libai: "李白",
			yxs_luban: "鲁班",
			yxs_lvzhi: "吕雉",
			yxs_goujian: "勾践",
			yxs_lishimin: "李世民",
			yxs_huamulan: "花木兰",
			yxs_luobinhan: "罗宾汉",
			yxs_chengjisihan: "成吉思汗",
			yxs_mingchenghuanghou: "明成皇后",
			yxs_wangzhaojun: "王昭君",
			yxs_luocheng: "罗成",
			yxs_direnjie: "狄仁杰",
			yxs_sunwu: "孙武",
			yxs_chengyaojin: "程咬金",
			yxs_yujix: "虞姬",
			yxs_xiangyu: "项羽",
			yxs_yingzheng: "嬴政",
			yxs_yuefei: "岳飞",
			yxs_fuermosi: "福尔摩斯",
			yxs_guiguzi: "鬼谷子",
			yxs_xiaoqiao: "小乔",
			yxs_luzhishen: "鲁智深",
			yxs_handingdun: "汉丁顿伯爵",
			yxs_zhaoyong: "赵雍",
			yxs_yangguang: "杨广",
			yxs_tangbohu: "唐伯虎",
			yxs_zhangsanfeng: "张三丰",
			yxs_nandinggeer: "南丁格尔",
			yxs_weizhongxian: "魏忠贤",
			yxs_lanlinwang: "兰陵王",
			yxs_meixi: "妺喜",
			yxs_qinqiong: "秦琼",

			yxs_fanji: "反击",
			yxs_fanji2: "反击",
			yxs_fanji_info: "当你受到【杀】或【决斗】造成的伤害后，你可以对伤害来源使用一张【杀】。若此【杀】为红色，其不可闪避。",
			yxs_menshen: "门神",
			yxs_menshen2: "门神",
			yxs_menshen3: "门神",
			yxs_menshen_info: "回合结束阶段，你可选择一名其他角色，若如此做，直到你的下回合开始，所有角色对该角色使用的【杀】或【决斗】均视为对你使用。",
			zhuxin: "诛心",
			zhuxin_info: "出牌阶段限一次，你可以与一名其他角色拼点，若你赢，你对其造成1点伤害。",
			wlianhuan: "连环",
			wlianhuan_info: "你使用【杀】造成伤害时，可以弃置一张装备区内的牌并令伤害+1。",
			liebo: "裂帛",
			liebo_info: "出牌阶段限一次，你可以将你的手牌与一名其他角色交换（手牌数之差不能多于1）。",
			yaoji: "妖姬",
			yaoji_info: "每当你受到一次伤害，你可以将一张【乐不思蜀】置入伤害来源的判定区。",
			guimian: "鬼面",
			guimian_info: "锁定技，每当你在出牌阶段使用【杀】造成伤害，本阶段内出【杀】次数上限+1。",
			lyuxue: "浴血",
			lyuxue2: "浴血",
			lyuxue_info: "锁定技，每当你造成一次伤害，若目标没有浴血标记，你令其获得一个浴血标记；当一名角色失去浴血标记时，其失去1点体力；准备阶段，若场上浴血标记的数量不少于存活角色数的一半（向下取整），你清空浴血标记；当你即将死亡时，你清空浴血标记。",
			huli: "护理",
			huli_info: "出牌阶段，你可以将一张红桃手牌当作【桃】对距离1以内的角色使用。",
			yixin: "医心",
			yixin_info: "限定技，你可以弃置两张牌，然后令一名已受伤角色回复X点体力并摸4-X张牌（X为该角色已损失的体力值且不超过4）。",
			xianqu: "先驱",
			xianqu_info: "锁定技，你不能成为点数小于8的【杀】的目标。",
			zbudao: "布道",
			zbudao_info: "摸牌阶段，你可以额外摸一张牌，然后将摸到的牌中的一张交给一名其他角色。",
			taiji: "太极",
			taiji_info: "每当你使用或打出一张【闪】，你可以使用一张【杀】。",
			luobi: "落笔",
			luobi_info: "结束阶段，可以摸数量等同于已损失体力值的牌，并以任意方式分配给任意角色。",
			fengliu: "风流",
			fengliu_info: "锁定技，摸牌阶段，你额外摸X张牌，X为存活女性角色数且不超过2。",
			shiqin: "弑亲",
			shiqin_info: "锁定技，其他群势力角色濒死时，你令其立即死亡。",
			yjujian: "拒谏",
			yjujian_info: "出牌阶段限一次，你可以交给一名其他角色一张牌，该角色的锦囊牌不能指定你为目标直到你的下一回合开始。",
			yaoyi: "徭役",
			yaoyi_info: "每当你受到一次伤害，你可以令至多2名非群势力角色交给你一张手牌。",
			zyhufu: "胡服",
			zyhufu_info: "锁定技，当你的装备区内没有防具牌时，你摸牌阶段额外摸一张牌；当你装备区内有防具牌时，你的手牌上限+5。",
			hanbei: "捍北",
			hanbei_info: "锁定技，你的装备区有马时，你的【杀】不可闪避。",
			kuangchan: "狂禅",
			kuangchan_info: "锁定技，你做主公时，不增加体力上限。",
			yxsdili: "底力",
			yxsdili_info: "锁定技，摸牌阶段，你额外摸X张牌，X为你已损失的体力值的一半，向上取整且最多为2。",
			chujia: "初嫁",
			chujia_info: "出牌阶段限一次，你可以弃置两张相同颜色的手牌，指定任意一名角色摸X张牌。(X为该角色已损失的体力值)",
			zhijie: "知节",
			zhijie_info: "出牌阶段限一次，你的红桃手牌可以当做【无中生有】使用。",
			baihe: "捭阖",
			baihe_info: "出牌阶段限一次，你可以弃置一张牌，选择以下1项执行：(1)横置1名未横置角色，该角色摸一张牌；(2)重置一名已横置角色，该角色弃置一张手牌。",
			yinyang: "阴阳",
			yinyang_info: "出牌阶段限一次，你可以弃置两张手牌并选择3名角色，分别横置或重置这些角色。",
			xiushen: "修身",
			xiushen_info: "锁定技，出牌阶段结束时，若场上有横置角色，你摸两张牌。",
			yanyi: "演绎",
			yanyi_info: "出牌阶段限一次，你可以弃置一张黑色牌，指定1名角色和1种花色，若被指定角色的手牌中含有此花色，则受到1点伤害。",
			jiean: "结案",
			jiean_info: "每当【演绎】造成伤害时，你可以摸X张牌，并以任意数量分配给任意角色（X为被【演绎】造成伤害角色的已损失体力值）。",
			wumu: "武穆",
			wumu_info: "锁定技，你的黑色【杀】无视距离，红色【杀】不计入回合内的出杀限制。",
			ysheshen: "舍身",
			ysheshen_info: "每当你受到1点伤害，可以观看牌堆顶的两张牌，并将其交给任意1~2名角色。",
			sanbanfu: "三板斧",
			sanbanfu_info: "当你对其他角色使用【杀】时，你可以使此【杀】有如下效果：若对方没有出【闪】，其受到2点伤害；若对方打出了一张【闪】，你与其各受到1点伤害；若对方打出了两张【闪】，你受到1点伤害。",
			bingsheng: "兵圣",
			bingsheng_info: "出牌阶段限一次，你可以弃置两张花色不同的手牌，指定一名其他角色使其体力值与你相同（体力最多变化2点）。",
			taolue: "韬略",
			taolue_info: "锁定技，你的手牌上限+1。",
			shentan: "神探",
			shentan_info: "出牌阶段限一次，你可以弃置一张牌，获得距离2以内的一名角色的手牌，并可以将其交给任意一名角色。",
			hanqiang: "寒枪",
			hanqiang_info: "锁定技，当你没装备武器时，攻击范围+1。",
			biaoqi: "骠骑",
			biaoqi_info: "锁定技，当你出【杀】指定目标后，若你的攻击范围大于目标体力值，则此【杀】不可闪避；若你的攻击范围小于目标体力值，你摸一张牌。",
			wluoyan: "落雁",
			wluoyan_info: "锁定技，你防止即将受到的伤害，改为失去1点体力。",
			heqin: "和亲",
			heqin2: "和亲",
			heqin3: "和亲",
			heqin_info: "限定技，你可以与场上一名男性角色形成【和亲】状态，你与该男性角色于摸牌阶段摸牌数+1。你或者男性角色阵亡时，【和亲】状态消失。",
			chajue: "察觉",
			chajue2: "察觉",
			chajue_info: "锁定技，你的回合外，你每受到一次伤害，任何【杀】或普通锦囊牌均对你无效，直到你的回合开始。",
			tiewan: "铁腕",
			tiewan_info: "每当其他角色使用延时类锦囊牌时，你可以立即将一张红色牌当作【乐不思蜀】使用。",
			qianglue: "强掠",
			qianglue_info: "每当你的【杀】被闪避时，你可以进行一次判定，若结果为黑色，你可以获得对方的一张牌。",
			xiadao: "侠盗",
			xiadao_info: "每当你造成一次伤害，你可以令一名手牌数不少于受伤害角色的另一名角色获得其一张手牌。",
			jimin: "机敏",
			jimin_info: "当你的装备区内没有牌时，你可以将一张手牌当作【闪】使用或打出。",
			sheshu: "射术",
			sheshu_info: "锁定技，你的【杀】无视距离；体力值不小于3的角色不能闪避你的【杀】。",
			tongyu: "统御",
			tongyu_info: "出牌阶段，你可以弃置一张牌，并转变为罗宾汉（每回合只能转变一次）。",
			lguiyin: "归隐",
			lguiyin_info: "出牌阶段，若你本回合内未造成伤害，你可以摸一张牌，并转变为汉丁顿伯爵（每回合只能转变一次）。",
			lzhangyi: "仗义",
			lzhangyi_info: "你可以将你弃置的卡牌交给一名其他角色。",
			yizhuang: "易装",
			yizhuang2: "易装",
			yizhuang_info: "准备阶段，你可以弃置一张牌并选择一名男性角色，获得其所有技能，直到你首次受到伤害。",
			kongju: "控局",
			kongju_info: "锁定技，你的手牌上限为你的体力上限；当你的手牌数小于体力上限时，你不能成为过河拆桥或顺手牵羊的目标；当你的手牌数大于体力上限时，你不能成为乐不思蜀的目标。",
			tuqiang: "图强",
			tuqiang_info: "每当你使用或打出一张【闪】，你可以摸一张牌。",
			zhensha: "鸩杀",
			zhensha_info: "当场上有角色进入濒死状态时，你可以弃置一张【酒】或两张黑色手牌，则该角色立即死亡。",
			xumou: "蓄谋",
			xumou_info: "结束阶段，你可以将武将牌翻面并摸三张牌。",
			guifu: "鬼斧",
			guifu_info: "出牌阶段限一次，你可以指定一名角色装备区内的一张牌，将其弃掉，自己和对方同时摸取一张牌。",
			lshengong: "神工",
			lshengong_info: "出牌阶段限一次，你可以选定场上任意一名角色的装备区的非特殊牌，出自己的一张手牌复制该装备，然后可以选择装备上自己或者别的角色的装备区。",
			zhexian: "谪仙",
			zhexian_info: "当你于一名其他角色的回合内首次失去牌时，你可以摸一张牌。",
			miaobi: "妙笔",
			miaobi_info: "出牌阶段限一次，你可以弃置一名其他角色的一张牌，若此牌是基本牌或普通锦囊，你可以将一张手牌当此牌使用；否则你须弃置一张牌。",
			cike: "刺客",
			cike_info: "你对其他角色出【杀】时可以选择做一次判定：若判定牌为红色花色，则此【杀】不可回避，直接命中；若判定牌为黑色花色，你可以选择弃掉对方一张牌。",
			qiangyun: "强运",
			qiangyun_info: "每当你失去最后一张手牌，可摸两张牌。",
			ducai: "独裁",
			ducai2: "独裁",
			ducai3: "独裁",
			ducai_info: "出牌阶段限一次，你可以弃置一张牌，则本轮内除你外的角色不能使用或打出与该手牌花色相同的手牌。",
			tongling: "统领",
			tongling_info: "锁定技，每当一名友方角色造成一次伤害，你获得1个统领标记（标记上限为3）。",
			fanpu: "反扑",
			fanpu_info: "出牌阶段限一次，你可以移去3枚统领标记并视为对攻击范围内的至多3名角色使用一张【杀】。",
			fenghuo: "烽火",
			fenghuo_info: "你可以将一张装备区内的牌当作【南蛮入侵】使用。",
			yxsweiyi: "威仪",
			yxsweiyi_info: "每当你受到一次伤害，可以令伤害来源弃置两张牌。",
			xieling: "挟令",
			xieling_info: "出牌阶段，弃掉两张手牌，将任意一名角色装备区或判定区的牌移动到另一名角色对应的区域。",
			baye: "霸业",
			baye_info: "出牌阶段，你可以将一张牌当做本回合内前一张使用的牌来使用。每回合限用一次。",
			nvquan: "女权",
			nvquan1: "女权",
			nvquan2: "女权",
			nvquan_info: "你对男性角色使用【杀】或【决斗】时，对方需连续打出两张【闪】或【杀】响应；你不能成为男性角色的决斗目标。",
			qiandu: "迁都",
			qiandu_info: "出牌阶段，你可以弃一张黑色手牌，和一名存活的玩家与其交换位置。每回合限一次。",
			budao: "补刀",
			budao_info: "你的回合外，你的攻击范围的一名角色受到【杀】的伤害时，你可以对其使用一张【杀】，只要你的【杀】对目标角色造成了伤害，你就可以继续对其使用【杀】。",
			feigong: "非攻",
			feigong_info: "其他角色使用【杀】时，若你不是【杀】的目标，可以弃置一张【杀】取消之。",
			jianai: "兼爱",
			jianai_info: "每当你回复1点体力，可以令所有其他角色回复1点体力。",
			bolehuiyan: "慧眼",
			bolehuiyan_info: "当一名有手牌的其他角色成为来源不为你的【杀】的目标时，你可以预言此【杀】能否命中，若预言正确，你摸一张牌，否则你须弃置一张牌。每回合限发动一次。",
			xiangma: "相马",
			xiangma_info: "锁定技，只要你的体力值大于2点，你的进攻距离+1；只要你的体力值为2点或更低，你的防御距离+1。",
			seyou: "色诱",
			seyou_info: "限定技，出牌阶段，你可以指定任意1名角色，其他所有男性角色需选择1项执行：（1）对你指定的角色出【杀】；（2）令你获得其一张牌。",
			sheshi: "蛇噬",
			sheshi_info: "每受到1次伤害，可以指定1种花色，依次展示牌堆顶的牌，直到出现指定花色的牌为止，你获得与指定花色不同花色的所有牌（最多展示四张牌）。",

			fengyi: "凤仪",
			fengyi_info: "出牌阶段，你可以弃一张手牌，指定任意目标摸两张牌。（每回合限用一次）",
			wange: "婉歌",
			wange_info: "摸牌时，你可以少摸一张牌，则结束阶段你可以抽取一名其他角色的手牌，至少1张，至多X张（X为你当前的掉血量）。",
			nichang: "霓裳",
			nichang2: "霓裳",
			nichang_info: "摸牌时，你可以选择不摸牌，并在结束阶段展示手牌，每少一种花色摸一张牌。",
			fengyan: "丰艳",
			fengyan_info: "你可以获得其他男性角色的红色判定牌。",
			zhulu: "逐鹿",
			zhulu_info: "回合外，当有普通锦囊牌结算完毕后，你可以立即弃掉一张相同花色手牌或装备区的牌，获得这张锦囊牌。",
			jieyong: "节用",
			jieyong2: "节用",
			jieyong_info: "你使用的卡牌结算完成后，你可以弃置一张黑色牌并重新获得之。（每回合限一次）",
			shangtong: "尚同",
			shangtong_info: "每当你令其他角色恢复1点血量或掉1点血量时，你可以摸一张牌（摸牌上限为4）。",
			yxsrenwang: "人望",
			yxsrenwang_info: "出牌阶段，你可以弃置两张牌并指定一名手牌数大于你的角色，你摸牌至与该角色手牌数相等，每阶段限一次。",
			shiwei: "施威",
			shiwei_info: "当其他角色失去最后一张手牌时，你可以将牌堆顶的一张牌背面朝上置于该角色面前，该角色回合，跳过出牌阶段并弃掉这张牌。",
			yxswushuang: "无双",
			yxswushuang_info: "出牌阶段，你使用【杀】时可同时打出两张【杀】，则该【杀】具有以下效果之一：1，伤害+1；2，额外指定两个目标。",
			xiaoyong: "骁勇",
			xiaoyong_info: "你可以将黑色手牌当作【杀】来使用。",
			yxsqinzheng: "亲征",
			yxsqinzheng_info: "出牌阶段，你对其他角色造成伤害时，可以令场上任意角色摸一张牌。",
			juma: "拒马",
			juma_info: "你与其他角色的距离始终视为1。",
		},
	};
});
