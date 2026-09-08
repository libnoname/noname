import { lib, game, ui, get, ai, _status } from "noname";

const translates = {
    mjs_new_zhongjun: "新杀终军",
    mjs_new_zhongjun_prefix: "新杀",
    mjsnewqingying: "请缨",
    mjsnewqingying_info: "出牌阶段开始时，你可以令一名其他角色交给你至少1张牌，然后直到回合结束，当你造成伤害时，你与其各摸1张牌。",

    mjs_new_weijie: "新杀卫玠",
    mjs_new_weijie_prefix: "新杀",
    mjsnewfengshenxiuyi: "风神秀异",
    mjsnewfengshenxiuyi_info: "当你即将受到伤害时，若你的手牌上限＞体力值，则改为减少等量的手牌上限。当你打出牌时，若所有其他角色手牌中都不存在与此牌相同牌名的牌，则你的手牌上限+1，并可以选择一名有手牌的角色，获得1张与其手牌中相同牌名的牌。",

    mjs_new_wangyuanji: "新杀王元姬",
    mjs_new_wangyuanji_prefix: "新杀",
    mjsnewzhujianyishi: "烛奸抑势",
    mjsnewzhujianyishi_info: "限定，若你的行动牌全场最多，你可以将一名其他角色的1个技能中的“出牌阶段限1次”改为“限定”。",

    mjs_new_xusheng: "新杀徐盛",
    mjs_new_xusheng_prefix: "新杀",
    mjsnewbailiyicheng: "百里疑城",
    mjsnewbailiyicheng_info: "当你成为其他角色打出牌的目标时，你可以立即打出1张装备牌，或者将一名角色装备区的1张牌收回其手牌，然后随机添加1张装备牌到你的手牌。",

    mjs_new_chengong: "新杀陈宫",
    mjs_new_chengong_prefix: "新杀",
    mjsnewqiguantouyi: "弃官投义",
    mjsnewqiguantouyi_info: "当你在非摸牌阶段获得牌时，可以将其中1张牌交给一名其他角色，令其可以对你选择的另外一名其他角色打出此牌，然后你下个摸牌阶段摸牌数+1，若其没有打出，你受到1点伤害。",

    mjs_new_pangtong: "新杀庞统",
    mjs_new_pangtong_prefix: "新杀",
    mjsnewrushusance: "入蜀三策",
    mjsnewrushusance_info: "每轮限1次，其他角色的回合开始时，你可以随机添加3张战法牌至其手牌，令其立即打出其中1张，然后可以将另外2张牌交给你，否则销毁这些牌。",

    mjs_new_gongsunzan: "新杀公孙瓒",
    mjs_new_gongsunzan_prefix: "新杀",
    mjsnewbaimayicong: "白马义从",
    mjsnewbaimayicong_info: "游戏开始时，复制牌堆中所有的坐骑牌，并洗入牌堆；你的坐骑牌的效果会触发2次。",

    mjs_new_lingtong: "新杀凌统",
    mjs_new_lingtong_prefix: "新杀",
    mjsnewzongmatidao: "纵马提刀",
    mjsnewzongmatidao_info: "出杀，获得并装备1张装备牌，并且出杀次数+1。",

    mjs_new_xiangyan: "新杀项燕",
    mjs_new_xiangyan_prefix: "新杀",
    mjsnewchusuisaihu: "楚虽三户",
    mjsnewchusuisaihu_info: `阵亡，你可以将所有牌交给一名其他角色，令其获得技能${get.poptip("mjspoqinfengrui")}，并且之后每回合的摸牌数+2。`,

    mjs_new_lumochou: "新杀卢莫愁",
    mjs_new_lumochou_prefix: "新杀",
    mjsnewyangchunbaixue: "阳春白雪",
    mjsnewyangchunbaixue_info: "当你以其他角色为目标打出牌后，若此牌没有被其他角色抵消或响应，则你可以将此牌交给一名其他角色，此牌再次被打出时无法被抵消和响应。",
    mjsnewqingyinwangyou: "清音忘忧",
    mjsnewqingyinwangyou_info: "当你交给其他角色手牌后，随机弃置其卜卦区中的1张牌，若其卜卦区中没有牌，每个回合限2次，你可以选择并添加任意1张牌到其手牌。",

    mjs_new_hanxin: "新杀韩信",
    mjs_new_hanxin_prefix: "新杀",
    mjsnewbeishuiyizhan: "背水一战",
    mjsnewbeishuiyizhan_info: "你可以将所有手牌当作杀打出，此杀的伤害+1，且造成伤害后，你收回这些手牌。",

    mjs_new_lisi: "新杀李斯",
    mjs_new_lisi_prefix: "新杀",
    mjsnewfanshumingfa: "燔书明法",
    mjsnewfanshumingfa_info: "出牌阶段限1次，你可以弃置1张牌，令一名其他角色手牌上限-1。当你弃牌后，直到你的下回合开始，其他角色打出与你弃牌同名的牌时，你可以令其随机弃置1张牌，然后令此技能下个出牌阶段的发动次数+1。",

    mjs_new_baiqi: "新杀白起",
    mjs_new_baiqi_prefix: "新杀",
    mjsnewchuqiwuqiong: "出奇无穷",
    mjsnewchuqiwuqiong_info: "每个回合限1次，当你在回合外需要打出牌时，可以将任意1张手牌当作要打出的牌打出，然后获得1张要打出的牌。",

    mjs_new_yingzheng: "新杀嬴政",
    mjs_new_yingzheng_prefix: "新杀",
    mjsnewyitongliuhe: "一统六合",
    mjsnewyitongliuhe_info: "与你势力相同的角色造成伤害后，你可以将受伤角色的势力改为与你相同或移除受伤角色的势力。当全场首次仅存在一种势力时，你对所有无势力的角色造成1点伤害，回复全部体力，之后你的回合开始时，随机获得每个无势力角色的1张牌。",

    mjs_new_wangjian: "新杀王翦",
    mjs_new_wangjian_prefix: "新杀",
    mjsnewqingtian: "请田",
    mjsnewqingtian_info: "回合开始时/杀伤，可以选择一名其他角色，其可以交给你任意张牌，然后你本回合出杀次数+1。",

    mjs_new_liubiao: "新杀刘表",
    mjs_new_liubiao_prefix: "新杀",
    mjsnewpiananjingxiang: "偏安荆襄",
    mjsnewpiananjingxiang_info: "回合结束时，若你本回合没有造成过伤害，直到你的下回合开始，当其他角色弃牌时，你可以选择获得其中1张牌。",

    mjs_new_gaojianli: "新杀高渐离",
    mjs_new_gaojianli_prefix: "新杀",
    mjsnewjizhuerge: "击筑而歌",
    mjsnewjizhuerge_info: "当你打出牌时，若此牌与你打出的前1张牌的点数不同，可以弃置一名其他角色的1张牌；若点数相同，则你摸1张牌，并且此技能失效直到当前回合结束。",
    mjsnewbianzhizhisheng: "变徴之声",
    mjsnewbianzhizhisheng_info: "当你打出牌时，若此牌与你打出的前1张牌的花色不同，则你可以弃置所有手牌，并摸等量牌；若花色相同，则你摸1张牌，并且此技能失效直到当前回合结束。",

    mjs_new_junwanghou: "新杀君王后",
    mjs_new_junwanghou_prefix: "新杀",

    mjs_new_hanfei: "新杀韩非",
    mjs_new_hanfei_prefix: "新杀",
    mjsnewbuqixiugu: "不期修古",
    mjsnewbuqixiugu_info: "当你发动其他技能后，可以失去该技能，然后抽取3张武将牌，选择获得其中1名武将的1个技能。",

    mjs_new_chenajiao: "新杀陈阿娇",
    mjs_new_chenajiao_prefix: "新杀",
    mjsnewjinwucangjiao: "金屋藏娇",
    mjsnewjinwucangjiao_info: "其他角色出牌阶段限1次，其可以交给你任意张牌，然后你回复等量的体力值，令其增加等量的出杀次数。",
    
    mjs_new_zhoubo: "新杀周勃",
    mjs_new_zhoubo_prefix: "新杀",
    mjsnewxuepingzhulv: "削平诸吕",
    mjsnewxuepingzhulv_info: "每轮限1次，摸牌至与全场手牌最多的角色相同，下一次造成的伤害+1，出牌阶段结束时，如果手牌中仍存在因此技能获得的牌，则将这些牌交给一名其他角色，然后失去此技能，直到有角色阵亡。",
};

const translates2 = {};

Object.assign(translates, translates2);

const translates3 = {
    
};

Object.assign(translates, translates3);

const translates4 = {
    mjs_pen_qihuangong: "齐桓公",
    mjs_penshigoubaixiang: "释钩拜相",
    mjs_penshigoubaixiang_info: "...",
    mjs_penzunwangrangyi: "尊王攘夷",
    mjs_penzunwangrangyi_info: "...",
    mjs_penjiuhezhuhou: "九合诸侯",
    mjs_penjiuhezhuhou_info: "...",
    
    mjs_pen_guanzhong: "管仲",
    mjs_penyikuangtianxia: "一匡天下",
    mjs_penyikuangtianxia_info: "...",
    mjs_pentonghuojicai: "通货积财",
    mjs_pentonghuojicai_info: "...",

    mjs_pen_baoshuya: "鲍叔牙",
    mjs_penfenjinrangli: "分金让利",
    mjs_penfenjinrangli_info: "...",
    mjs_penjianxianziyi: "荐贤自抑",
    mjs_penjianxianziyi_info: "...",

    mjs_pen_wenjiang: "文姜",
    mjs_penyounvtongche: "有女同车",
    mjs_penyounvtongche_info: "...",
    mjs_penludaoyoudang: "鲁道有荡",
    mjs_penludaoyoudang_info: "...",

    mjs_pen_yanying: "晏婴",
    mjs_penjuyuweizhi: "橘逾为枳",
    mjs_penjuyuweizhi_info: "...",
    mjs_penertaoshasanshi: "二桃杀三士",
    mjs_penertaoshasanshi_info: "...",

    mjs_pen_zouji: "邹忌",
    mjs_penchaofukuijing: "朝服窥镜",
    mjs_penchaofukuijing_info: "...",
    mjs_penmentingnajian: "门庭纳谏",
    mjs_penmentingnajian_info: "...",

    mjs_pen_bianque: "扁鹊",
    mjs_penwangwenwenqie: "望闻问切",
    mjs_penwangwenwenqie_info: "...",
    mjs_penhuanxinyixue: "换心易血",
    mjs_penhuanxinyixue_info: "...",

    mjs_pen_tianji: "田忌",
    mjs_penchisizhengxian: "驰驷争先",
    mjs_penchisizhengxian_info: "...",
    mjs_penweiweijiuzhao: "围魏救赵",
    mjs_penweiweijiuzhao_info: "...",

    mjs_pen_kuangzhang: "匡章",
    mjs_penbianzhihunqin: "变徴混秦",
    mjs_penbianzhihunqin_info: "...",
    mjs_penqiaofuwendu: "樵夫问渡",
    mjs_penqiaofuwendu_info: "...",
    mjs_penhuangupoguan: "函谷破关",
    mjs_penhuangupoguan_info: "...",

    mjs_pen_zouyan: "邹衍",
    mjs_penwudeshizhong: "五德始终",
    mjs_penwudeshizhong_info: "...",
    mjs_pendajiuzhoushuo: "大九州说",
    mjs_pendajiuzhoushuo_info: "...",
    mjs_penchuilvshengnuan: "吹绿生暖",
    mjs_penchuilvshengnuan_info: "...",

    mjs_pen_tianrangju: "田穰苴",
    mjs_penzhanjialiwei: "斩贾立威",
    mjs_penzhanjialiwei_info: "...",
    mjs_penfuxunshizu: "拊循士卒",
    mjs_penfuxunshizu_info: "...",
};

Object.assign(translates, translates4);

const translates5 = {
    mjs_10170_shangyang: "商鞅",
    mjs1017001: "徙木立信",
    mjs1017001_info: "出牌阶段限一次，你可以令一名其他角色依次执行：1，交给你一张牌；2，对你指定的另一名角色打出一张杀；3，失去一点体力。其每执行一项，你令其从游戏中获得一张你指定牌名的战法牌。",
    mjs1017002: "为法之敝",
    mjs1017002_info: "阵亡，将所有销毁的牌添加到牌堆中，并洗牌。",

    mjs_10240_shangyang: "商鞅",
    mjs1024001: "改弦易辙",
    mjs1024001_info: "每人回合开始时，你可以弃一张牌然后改变其本回合摸牌阶段、出牌阶段、弃牌阶段的顺序。",
    mjs1024002: "徙木立信",
    mjs1024002_info: `你可以将一张牌转化为无懈可击交给另一名角色，此牌无法被主动弃置，当其使用此牌时，你与其各获得一张战法牌，并可对其发动一次${get.poptip("mjs1024001")}。`,

    mjs_10389_shangyang: "商鞅",
    mjs1038901: "徙木立信",
    mjs1038901_info: "其他角色出牌阶段限一次，其可交给你一张♣牌，然后你可将之转化为多多益善交还给其。",
    mjs1038902: "奖耕励战",
    mjs1038902_info: "当一名角色在摸牌阶段外一次性获得两张及以上的牌，或者一次性造成两点及以上的伤害时，你可与其各摸一张牌。",

    mjs_10514_shangyang: "商鞅",
    mjs1051401: "垦草令",
    mjs1051401_info: "摸牌阶段开始时，你可以选择少摸一张牌并增加一点手牌上限。回合结束时，你将手牌摸至手牌上限。",
    mjs1051402: "变政明法",
    mjs1051402_info: "出牌阶段内，你可以弃置两张花色相同的手牌，并选择一名其他角色，其不能使用与你弃置花色相同的牌，直到你的下个回合开始。",

    mjs_10604_shangyang: "商鞅",
    mjs1060401: "明术霸国",
    mjs1060401_info: "锁定技，当你手牌的属性均一致时，每使用一张装备牌，装备上限+1；每使用一张行动牌，体力上限+1；每使用一张锦囊牌，手牌上限+1。累计触发三次或进入濒死状态时，可将此技能转移给其他角色。",
    mjs1060402: "重农励战",
    mjs1060402_info: "锁定技，一名角色的摸牌阶段开始时，若其体力上限大于你，其减一点体力上限并令摸牌阶段摸牌数+1；一名角色造成一次伤害后，若其手牌上限小于你，减一点手牌上限，令此伤害+1。该角色可取消此效果，然后受到你造成的一点伤害。",

    mjs_10381_mozi: "墨子",
    mjs1038101: "非攻",
    mjs1038101_info: "其他角色应战时，若其体力值小于目标或拥有“非攻”，你可以交给其任意张牌，然后其可以打出其中1张。",
    mjs1038102: "兼爱",
    mjs1038102_info: `当1名角色交给其他角色牌或令其他角色回复体力时，若其未拥有${get.poptip("mjs1038101")}，你可以令其获得${get.poptip("mjs1038101")}；否则你可以令其摸1张牌。`,

    mjs_10601_mozi: "墨子",
    mjs1060101: "止楚伐宋",
    mjs1060101_info: "每回合限一次，当一名角色成为杀的目标，令杀无效并回到打出者手牌，若本回合打出者仍想对对原被选为杀的目标者出杀，可弃置一张牌，若如此，你可弃置一张牌来维持取消效果，直到一方选择取消弃牌，若为你，则受到一点伤害，打出者可额外选择你为目标，若为打出者，则本回合无法对你和被杀选为目标的角色出杀。",
    mjs1060102: "兼爱非攻",
    mjs1060102_info: "你可以将任意数量的装备牌设为救兵，止楚伐宋结束后，你可以选择其中数量救兵交给该角色，该角色可以使用救兵。每打出一张救兵或你受到伤害时，可选择获得一张♣属性或♦属性的牌。",
    mjs1060103: "墨家机关",
    mjs1060103_info: "每回合限两次，♣或♦属性的牌可打造为墨家机关。墨家机关可重复打造。游戏开始时，墨子装备轭车。1张♣♣属性牌：木鹊或轭车。2张♦属性牌：连弩车或罂听。",

    mjs_10627_mozi: "墨子",
    mjs1062701: "墨家机关",
    mjs1062701_info: "出牌阶段限一次，你可以弃置一张装备牌，选择一张【墨家机关】置入一名角色的装备区。 【侦查木鸢】：回合开始时，你可以观看一名角色的所有手牌，并随机获得其中一张。 【练兵木偶】：回合结束时，你可以将手牌摸至手牌上限。【连弩车】：范围2。出牌阶段开始时，随机添加1张增强杀到你的手牌中，出牌阶段出杀次数+1。",
    mjs1062702: "节用节葬",
    mjs1062702_info: "摸牌阶段，你可以少摸任意张牌，选择一种类型的牌并从弃牌堆中获得等量该类型牌。",

    mjs_10700_mozi: "墨子",
    mjs1070001: "兼爱非攻",
    mjs1070001_info: "每回合限1次，你摸牌至手牌上限，但最多摸3张牌，然后其余角色根据顺序摸同数量的牌。 当其他角色成为杀的目标，并且此杀的伤害大于1时，你可弃置1张牌，抵消此杀，然后下一次所需弃置的牌+1。",
    mjs1070002: "墨守坚城",
    mjs1070002_info: "应战，根据你装备区的装备类型，可执行一次以下效果： 你可弃置装备区1张武器牌，将此杀的目标转移给任意一名角色，并且此杀无视距离限制。 你可弃置装备区1张防具牌，抵消此杀，回复1点体力，并且本回合的杀无法再指定你为目标。 你可弃置装备区1张坐骑牌，然后立即摸2张牌。",

    mjs_10726_mozi: "墨子",
    mjs1072601: "兼爱非攻",
    mjs1072601_info: "玩家受到伤害，其他玩家可替其承受伤害，你可令承伤玩家获得标记“墨”，“墨”玩家造成伤害后“墨”标记移除。",
    mjs1072602: "墨家子弟",
    mjs1072602_info: "“墨”玩家回合结束，未造成伤害选择1件专属装备/恢复过其他玩家体力选择1张专属战法牌。",
};

Object.assign(translates, translates5);

export default translates;
