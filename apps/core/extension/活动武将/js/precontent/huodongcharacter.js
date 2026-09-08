import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

const packs = function () {
    const huodongcharacter = {
        name: 'huodongcharacter',
        connect: true,
        connectBanned: [],
        characterSort: {
            huodongcharacter: {
                Chuodong: ['bilibili_shengxunyu', 'bilibili_Firewin', 'bilibili_jinglingqiu', 'bilibili_suixingsifeng', 'bilibili_Emptycity', 'bilibili_thunderlei', 'bilibili_lonelypatients', 'bilibili_ningjingzhiyuan', 'bilibili_xizhicaikobe'],
                CDormitory: ['bilibili_yirenyixiaojian', 'bilibili_longjiuzhen', 'bilibili_diandian', 'bilibili_murufengchen', 'bilibili_wuzhuwanshui', 'bilibili_kuangshen', 'bilibili_yanjing', ...Array.from({ length: 3 }).map((_, index) => `bilibili_yanjing_friend${index + 1}`), 'bilibili_xiaoyaoruyun', 'bilibili_shuijiaobuboli'],
                Cothers: ['bilibili_majun', 'lz_sufei', 'lz_tangzi', 'lz_liuqi', 'lz_huangquan', 'bilibili_zhugeliang', 'bilibili_caocao', 'bilibili_xiahoudun', 'bilibili_liuguanzhang', 'bilibili_gaowang', 'bilibili_simayi', 'old_dongxie', 'bilibili_sunhanhua', 'bilibili_zhoutaigong', 'bilibili_zhouxiaomei', 'bilibili_caifuren', 'bilibili_zhengxuan', 'bilibili_sp_xuyou', 'old_zuoci', 'bilibili_kuailiangkuaiyue', 'bilibili_wuqiao', 'bilibili_daxiao', 'bilibili_xushao', 'bilibili_shen_guojia', 'bilibili_re_xusheng', 'bilibili_zhangrang', 'bilibili_litiansuo', 'decade_huangwudie', 'bilibili_huanggai', 'bilibili_ekeshaoge', 'bilibili_guanning', 'bilibili_wangwang', 'diy_lvmeng', 'bilibili_wangtao', 'bilibili_wangyue', 'bilibili_x_wangtao', 'bilibili_x_wangyue', 'bilibili_daqiao', 'bilibili_xiaoqiao', 'bilibili_x_daqiao', 'bilibili_x_xiaoqiao', 'bilibili_ahuinan', 'bilibili_dongtuna', 'bilibili_x_ahuinan', 'bilibili_x_dongtuna'],
                CXuanDie: ['bfake_zhanghua', 'bfake_hanshao', 'bfake_hanrong', 'bilibili_adong', 'bfake_jiananfeng', 'bfake_shen_zhangjiao', 'bfake_shen_zhangfei', 'bfake_shen_jiaxu', 'bfake_huanwen', 'bfake_miheng'],
            },
        },
        character: {
            bilibili_daxiao: ['female', 'wu', 3, ['bilibili_qiqin', 'dczixi', 'dcweiwan'], ['die:yue_daqiao', 'die:yue_xiaoqiao', 'name:桥|null-桥|null']],
            bilibili_zhoutaigong: ['male', 'wu', 3, ['dcqiqin', 'olqingshu', 'olshoushu'], ['name:周|null']],
            bilibili_zhouxiaomei: ['female', 'wu', 3, ['dcqiqin', 'dchuishu', 'dcyishu'], ['name:周|null']],
            bilibili_zhangrang: ['male', 'qun', 3, ['bilibili_taoluan'], ['die:zhangrang']],
            diy_lvmeng: ['male', 'wu', 4, ['BTkongju', 'BThouqi'], ['die:lvmeng']],
            bilibili_wangwang: ['female', 'shu', 3, ['huguan', 'yaopei', 'mingluan'], ['die:wangtao', 'die:wangyue', 'name:王|桃-王|悦']],
            bilibili_huanggai: ['male', 'wu', 4, ['bilibili_kurou', 'bilibili_zhaxiang'], ['die:re_huanggai']],
            bilibili_ekeshaoge: ['male', 'qun', 4, ['bilibili_xueji', 'bilibili_hanran'], ['name:null|null']],
            decade_huangwudie: ['female', 'shu', 3, ['decadexiwu', 'decadehongzhuang'], ['forbidai']],
            bilibili_litiansuo: ['male', 'qun', 4, ['jugu', 'yijin']],
            bilibili_sp_xuyou: ['male', 'qun', 3, ['bolshicai', 'bilibili_fushi'], ['character:sp_xuyou', 'die:sp_xuyou']],
            lz_sufei: ['male', 'qun', 4, ['lzlianpian'], ['character:xf_sufei', 'doublegroup:qun:wu', 'die:xf_sufei']],
            lz_liuqi: ['male', 'shu', 3, ['spwenji', 'lztunjiang'], ['character:liuqi', 'doublegroup:shu:qun', 'die:sp_liuqi']],
            lz_tangzi: ['male', 'wu', 4, ['lzxingzhao'], ['character:tangzi', 'doublegroup:wu:wei', 'die:xf_tangzi']],
            lz_huangquan: ['male', 'wei', 3, ['lzdianhu', 'xinfu_jianji'], ['character:xf_huangquan', 'doublegroup:wei:shu', 'die:xf_huangquan']],
            bilibili_adong: ['male', 'qun', 4, ['jueman', 'oljianman'], ['die:ahuinan', 'die:dongtuna', 'name:null|null-null|null']],
            old_zuoci: ['male', 'qun', 3, ['gz_huashen', 'gz_xinsheng']],
            bilibili_shengxunyu: ['male', 'key', 4, ['bilibili_hehu', 'bilibili_jinyan', 'bilibili_yutai'], ['clan:宿舍群|肘击群', 'name:熏|鱼']],
            bilibili_Firewin: ['male', 'key', 4, ['bilibili_xianqu', 'bilibili_tixiang'], ['clan:宿舍群|肘击群|活动群', 'name:火|赢']],
            bilibili_jinglingqiu: ['male', 'key', '3/4', ['bilibili_tiyi', 'bilibili_zili'], ['clan:活动群', 'name:精灵|球']],
            bilibili_suixingsifeng: ['female', 'key', 4, ['bilibili_liaoxing', 'bilibili_duoyang'], ['clan:肘家军|宿舍群|肘击群|活动群|Thunder群', 'name:萌新|转型中']],
            bilibili_Emptycity: ['male', 'key', 4, ['bilibili_zhiyou', 'bilibili_guanli'], ['clan:活动群|Thunder群', 'name:空|城']],
            bilibili_thunderlei: ['male', 'key', '4/4/5', ['bilibili_Thunder', 'bilibili_qianxiu'], ['clan:活动群|Thunder群|肘击群', 'name:雷|null']],
            bilibili_zhengxuan: ['male', 'qun', 3, ['bilibili_zhengjing'], ['character:zhengxuan', 'die:zhengxuan', 'name:郑|玄']],
            bilibili_sunhanhua: ['female', 'wu', 3, ['bilibili_chongxu', 'miaojian', 'shhlianhua'], ['character:sunhanhua', 'die:sunhanhua', 'name:孙|寒华']],
            bilibili_lonelypatients: ['male', 'key', 4, ['bilibili_meihua', 'bilibili_zhengyou'], ['clan:活动群', 'name:独孤|null']],
            bilibili_kuangshen: ['male', 'key', '1/10/3', ['bilibili_paoku', 'bilibili_zhijiang'], ['clan:宿舍群|肘击群|活动群']],
            bilibili_shen_guojia: ['male', 'wei', '9/9/5', ['stianyi', 'resghuishi', 'bilibili_huishi'], ['doublegroup:shen:wei:wu', 'die:shen_guojia']],
            bilibili_re_xusheng: ['male', 'wu', 4, ['bilibili_pojun', 'kuangcai', 'bilibili_baodao'], ['die:re_xusheng']],
            bilibili_xushao: ['male', 'qun', 3, ['bol_pinjian', 'bol_yuedan'], ['die:xushao']],
            bilibili_ningjingzhiyuan: ['male', 'key', 4, ['bilibili_xiezhi', 'bilibili_fazhou'], ['clan:肘家军|宿舍群|肘击群|活动群', 'name:闹动|导近']],
            bilibili_xizhicaikobe: ['male', 'key', 4, ['bilibili_zhangcai', 'bilibili_laosao'], ['clan:肘家军|宿舍群|肘击群|活动群', 'name:戏|子宓']],
            bilibili_yanjing: ['male', 'key', 3, ['bilibili_mingcha', 'bilibili_huiyan', 'bilibili_kamiman'], ['clan:肘家军|宿舍群|肘击群|活动群', 'tooenough|眼睛']],
            bilibili_yanjing_friend1: ['female', 'qun', 3, ['bilibili_roulin', 'bilibili_shenren'], ['unseen']],
            bilibili_yanjing_friend2: ['male', 'qun', '4/5', ['bilibili_benghuai', 'bilibili_shenren'], ['unseen']],
            bilibili_yanjing_friend3: ['male', 'qun', '3/4', ['bilibili_yaowu', 'bilibili_shenren'], ['unseen']],
            bilibili_caifuren: ['female', 'qun', 3, ['bilibili_kuilei'], ["name:蔡|null"]],
            bilibili_xiaoyaoruyun: ['female', 'key', 3, ['bilibili_chuandu', 'bilibili_shuaiwei', 'bilibili_huaikui'], ['clan:肘击群|活动群', 'name:鹿都|智川介']],
            bilibili_shuijiaobuboli: ['female', 'key', 3, ['bilibili_qicai', 'bilibili_jizhi', 'bilibili_fengliang', 'bilibili_guiyin'], ['clan:宿舍群|活动群', 'name:黄|月英']],
            bilibili_kuailiangkuaiyue: ['male', 'qun', 4, ['bilibili_chouhua'], ['character:kuailiangkuaiyue']],
            bilibili_wuqiao: ['male', 'qun', 4, ['bilibili_qiajue', 'clanmuyin'], ['border:jin', ...['character', 'tempname', 'die'].map(i => `${i}:clan_wuqiao`)]],
            bilibili_wuzhuwanshui: ['male', 'key', 3, ['bilibili_diaowen', 'bilibili_banyun'], ['clan:肘击群|活动群', 'name:猪|大将军']],
            bilibili_murufengchen: ['female', 'key', 3, ['bilibili_ziyuan', 'bilibili_beichen', 'bilibili_xingzhu'], ['clan:宿舍群|肘击群|活动群', 'name:风|晨']],
            bilibili_diandian: ['female', 'key', 3, ['bilibili_siyu', 'bilibili_tamen'], ['clan:肘击群|活动群', 'name:永雏|塔菲']],
            bilibili_simayi: ['male', 'shen', 3, ['reguicai', 'fangzhu', 'rewansha', 'rezhiheng', 'rejizhi'], ['wei', 'character:shen_simayi', ...['tempname', 'die'].map(i => `${i}:new_simayi`)]],
            old_dongxie: ['female', 'qun', 4, ['juntun', 'jiaojie'], ['die:dongxie']],
            bilibili_longjiuzhen: ['female', 'key', 3, ['bilibili_xingcan', 'bilibili_linglai', 'bilibili_yongtan'], ['clan:宿舍群|肘击群|活动群', 'name:null|美']],
            bilibili_gaowang: ['male', 'qun', 3, ['scsanruo', 'gaowangdead'], ['character:scs_gaowang']],
            bilibili_liuguanzhang: ['male', 'qun', 4, ['bilibili_waifa'], ['border:shen', 'name:戏|志才-陈|友谅-左|宗棠']],
            bilibili_xiahoudun: ['male', 'wei', 4, ['bilibili_ganglie', 'new_qingjian'], ['name:夏侯|惇', ...['character', 'tempname', 'die'].map(i => `${i}:re_xiahoudun`)]],
            bilibili_yirenyixiaojian: ['male', 'key', '1/Infinity', ['bilibili_ranzhi', 'bilibili_wuying', 'bilibili_jiabin'], ['clan:宿舍群|肘击群|活动群', 'name:吴|新建']],
            bilibili_caocao: ['male', 'qun', 4, ['bilibili_hanhuang'], ['border:wei']],
            bilibili_zhugeliang: ['male', 'shu', 3, ['bilibili_lianbing'], ['name:诸葛|亮', 'clan:琅琊诸葛氏']],
            bilibili_shibing: ['male', 'shu', Infinity, ['bilibili_tongshuai'], ['name:null|null', 'character:haopu', 'unseen']],
            bilibili_majun: ['male', 'wei', 3, ['xinfu_jingxie', 'bilibili_qiaosi'], ['character:majun', 'die:majun', 'name:马|钧']],
            //双面武将--正面
            bilibili_wangtao: ['female', 'shu', 3, ['huguan', 'yaopei', 'dualside'], ['dualside:bilibili_x_wangyue', 'character:wangtao', 'die:wangtao']],
            bilibili_wangyue: ['female', 'shu', 3, ['huguan', 'mingluan', 'dualside'], ['dualside:bilibili_x_wangtao', 'character:wangyue', 'tempname:wangyue', 'die:wangyue']],
            bilibili_daqiao: ['female', 'wu', 3, ['dcqiqin', 'dczixi', 'dualside'], ['dualside:bilibili_x_xiaoqiao', 'character:yue_daqiao', 'tempname:yue_daqiao', 'die:yue_daqiao']],
            bilibili_xiaoqiao: ['female', 'wu', 3, ['dcqiqin', 'dcweiwan', 'dualside'], ['dualside:bilibili_x_daqiao', 'character:yue_xiaoqiao', 'die:yue_xiaoqiao']],
            bilibili_ahuinan: ['male', 'qun', 4, ['jueman', 'dualside'], ['dualside:bilibili_x_dongtuna', 'character:ahuinan', 'die:ahuinan']],
            bilibili_dongtuna: ['male', 'qun', 4, ['oljianman', 'dualside'], ['dualside:bilibili_x_ahuinan', 'character:dongtuna', 'die:dongtuna']],
            //双面武将--背面
            bilibili_x_wangtao: ['female', 'shu', 3, ['huguan', 'yaopei', 'dualside'], ['unseen', 'character:wangtao', 'die:wangtao']],
            bilibili_x_wangyue: ['female', 'shu', 3, ['huguan', 'mingluan', 'dualside'], ['unseen', 'character:wangyue', 'tempname:wangyue', 'die:wangyue']],
            bilibili_x_daqiao: ['female', 'wu', 3, ['dcqiqin', 'dczixi', 'dualside'], ['unseen', 'character:yue_daqiao', 'tempname:yue_daqiao', 'die:yue_daqiao']],
            bilibili_x_xiaoqiao: ['female', 'wu', 3, ['dcqiqin', 'dcweiwan', 'dualside'], ['unseen', 'character:yue_xiaoqiao', 'die:yue_xiaoqiao']],
            bilibili_x_ahuinan: ['male', 'qun', 4, ['jueman', 'dualside'], ['unseen', 'character:ahuinan', 'die:ahuinan']],
            bilibili_x_dongtuna: ['male', 'qun', 4, ['oljianman', 'dualside'], ['unseen', 'character:dongtuna', 'die:dongtuna']],
            //千里走单骑
            DJ_pujing: ['male', 'qun', 1, [], ['unseen', 'character:pujing']],
            DJ_huban: ['male', 'qun', 2, [], ['unseen', 'character:huban']],
            //蝶设堂
            bfake_jiananfeng: ['female', 'jin', 8, ['bolduliao', 'bolhuidu', 'bolfushou']],
            bfake_shen_jiaxu: ['male', 'shen', 3, ['boljiandai', 'bolfangcan', 'boljuemei', 'bolluoshu'], ['qun', 'character:le_shen_jiaxu']],
            bfake_shen_zhangfei: ['male', 'shen', 5, ['bolbaohe', 'bolrenhai', 'boltiandong'], ['shu', 'character:shen_zhangfei']],
            bfake_shen_zhangjiao: ['male', 'shen', 3, ['bolyifu', 'boltianjie'], ['qun', 'character:shen_zhangjiao']],
            bfake_huanwen: ['male', 'jin', 4, ['bolyuba', 'bolxingjiang']],
            bfake_miheng: ['male', 'qun', 3, ['bolhuaici', 'boljianling'], ['character:gz_miheng']],
            bfake_zhanghua: ['male', 'jin', 3, ['boljianhe', 'bolbihun'], ['character', 'die'].map(i => `${i}:zhanghua`)],
            bfake_hanshao: ['male', 'qun', 3, ['bolfangzhen', 'bolliuju', 'bolxumin'], ['character', 'die', 'tempname'].map(i => `${i}:clan_hanshao`)],
            bfake_hanrong: ['male', 'qun', 3, ['bollianhe', 'bolhuanjia', 'bolxumin'], ['character', 'die', 'tempname'].map(i => `${i}:clan_hanrong`)],
        },
        characterIntro: {
            bilibili_zhoutaigong: '编号5256',
            bilibili_zhouxiaomei: '编号5257',
            get bilibili_wangwang() {
                return [lib?.characterIntro?.wangtao || '暂无', lib?.characterIntro?.wangyue || '暂无'].join('<br>');
            },
            get bilibili_adong() {
                return [lib?.characterIntro?.ahuinan || '暂无', lib?.characterIntro?.dongtuna || '暂无'].join('<br>');
            },
            get bilibili_daxiao() {
                return [lib?.characterIntro?.daqiao || '暂无', lib?.characterIntro?.xiaoqiao || '暂无'].join('<br>');
            },
            bfake_huanwen: '桓温（312年～373年），字元子，谯国龙亢县（今安徽省怀远县）人，出身谯国桓氏。东晋时期权臣、政治家、军事家、书法家，官至大司马，封爵南郡公。晋明帝司马绍女婿，宣城内史桓彝长子，丰城公桓冲之兄。桓温姿貌伟岸，豪爽大度，文武双全，英略过人。初迎娶南康公主，官拜驸马都尉，袭封万宁县男。咸康元年（335年），出任琅琊内史、辅国将军。后参与庾翼北伐，升迁徐州刺史。永和元年（345年），官拜使持节、安西将军、护南蛮校尉、荆州都督，掌握长江上游地区的兵权。溯江而上，灭亡成汉，官拜征西大将军、开府仪同三司，册封临贺郡公，声名大振。累迁大司马，册封南郡公。掌权期间，劝课农桑，改善吏治，抑制兼并，实施土断，重视疾苦，改善教育。三次出兵北伐，击败羌族首领姚襄，收复西晋旧都洛阳，但败北于苻健、慕容垂，在声望受损后，奢求朝廷加九锡，但受制于王谢势力阻碍，终未能如愿。宁康元年（373年）七月，桓温病逝于姑孰，享年六十二岁，东晋朝廷追赠丞相，谥号宣武公，丧礼依照西晋安平王司马孚、西汉大司马霍光旧例。',
            bilibili_ekeshaoge: '俄何烧戈，羌将。正始八年，陇西、南安、金城、西平诸羌饿何、烧戈、伐同、蛾遮塞等相结叛乱，攻围城邑，南招蜀兵，凉州名胡治无戴复叛应之。讨蜀护军夏侯霸督诸军屯为翅。郭淮退姜维，维遁退。进讨叛羌，斩饿何、烧戈，降服者万馀落。',
            bilibili_litiansuo: '刘秉义家的婚事被李荣先辈知道了，本来李荣先辈和刘家没什么深仇大恨，但是李荣先辈赚了些黑钱就想强买下刘家的房子，一直希望这刘家没落变卖家产，提高强买的几率。',
            bilibili_shengxunyu: '活动武将群聊团宠，群管理萌新（转型中）致力于对生熏鱼进行管制和保护以希望生熏鱼能够在群里拥有真正的既健康又快乐的生活。',
            bilibili_Firewin: '从活动武将群创立至今留存时间最久的人员之一，属于活动武将群元老级人员，现为活动群和管理之一，擅长素材提供。最大特征为每个月都会更换一个愤怒的小鸟的头像，因此别称“鸟鸟”。',
            bilibili_jinglingqiu: '活动武将群最最最元老级成员，活动武将群聊开创者之一，萌新于无名杀扩展群推广群聊时便使用活动武将，并且经常提供一些可靠的意见，于2022年2月2日劝说萌新创建活动武将扩展交流群。',
            bilibili_suixingsifeng: '随性似风，活动武将原作者萌新（转型中）的小号，无名杀资深牢玩家（指时间上的牢）。现因即将毕业，将扩展托付戏志才后，随性似风于2025年5月末消失于江湖之中，偶尔会以其他形态作为戏志才发副手进行活动武将的辅助更新。',
            bilibili_Emptycity: 'Empty city°，活动武将群骨干级成员，于萌新高考时加入活动武将群，给予萌新素材支持，现为活动群管理之一。',
            bilibili_thunderlei: '雷，过去萌新的同行（现在比萌新厉害太多），负责十周年武将的前瞻制作，活动群和Thunder群之间总保持着良好的关系，过去常常被群友成为在各方串门不累脚，现在主负责千幻的更新和更细致的特效制作。',
            bilibili_lonelypatients: 'lonely patients，活动群群主，美化大佬，前活动武将二群成员，因完成了活动武将第一次的全露头制作晋升二群管理，后来因合群人数需求成为活动群群主，现负责不定期活动武将的露头包制作。因群主平时较忙，故在群聊内见到群主的次数较为稀少。',
            //bilibili_babybao: '活动群资深元老，隐藏自身实力的高校研究生，为萌新负责提供图片/配音素材、进行武将测试、管理小群' + '<span style="text-decoration:line-through;">' + '反正不要拿respect当作职务' + '</span>' + '等职务。',
            bilibili_kuangshen: '狂神，无名杀究极更新者，但因为其过于超前的思想和当前时间线的发展完全脱轨而致其PR惨遭扑杀，遂黑化为狂神1103形态，别名牢狂，蠢蠢欲动，准备于未来继续打破历史。',
            bilibili_ningjingzhiyuan: '宁静致远，俗称牢宁，赛尔号抽象玩家，“科密”萌新转型中的心腹，喜爱肘击群，现负责维持群内秩序并将违规群友抓进小黑屋肘击群，肘家军大将之一，抽象集大成者。',
            bilibili_xizhicaikobe: '戏志才，抽象社恐人士，肘家军大将之一，无名杀<span style="text-decoration: line-through;">非</span>专业人士和爱好者，萌新转型中的任务召唤人。孩子们，其实牢戏<span style="text-decoration: line-through;">并不</span>想要。',
            bilibili_yanjing: '路边一条',
            bilibili_xiaoyaoruyun: '逍遥如云，肘击群内抽象人士之一<span style="text-decoration: line-through;">（孩子们，其实是牢萌干的，我有十分甚至九分确信是他害的）</span>，因在各大（其实仅一小部分）无名杀群聊内大肆（其实规模并没有那么大）传播病毒武将扩展（其实真的有病毒，还有木马和蠕虫），从而变得（其实并不怎么）出名，至今仍在各大无名杀群聊里逍遥法外（迫真）。',
            bilibili_shuijiaobuboli: '睡觉不玻璃，活动群活跃元老之一，为懒狗萌新（转型中）做尽宣传和bug收集的任务。三年过去了，她终于得到了属于自己的专属武将<span style="text-decoration: line-through;">萌新（转型中）就是个大懒棒！</span>。',
            bilibili_wuzhuwanshui: '你说得对但是我的名字是凤凰院凶真，年龄十九岁，家住在秋叶原，天天在lab里面忙着拯救世界，我每天都要熬到凌晨六点，从来不做保健操，静静观测这个世界并且爱护我亲爱的助手——克里斯蒂↑～娜↓～，我每天都要灌大量的胡椒博士，不经常看医生但是我的身体一定非常健康。<br>噫！这搬史，可真是一门学问啊！要如何把热乎的构思端给群友呢？倘若是直接呈上去，未免馨香扑鼻让人倍感惊恐，所以就需要用聊天记录套一层，来欢迎大家细细品味啊！<br>有人问，天下的构思如此之多，你搬得完吗？那当然是搬不完的，可是让眼前之人吃好吃饱，就是我们史官的溯源与目标。我们一定会为了群友的营养健康勤奋工作，积极投喂各种内容，保证群友身体健康营养均衡。',
            bilibili_murufengchen: '《星主宝诰》有云：志心皈命礼。大罗天阙，紫微星宫。尊居北极之高，位正中天之上，法号金轮炽盛，道称玉斗玄尊。璇玑玉衡，齐七政；总天经地，纬日月。星宿约，四时行，黄道紫垣，万象宗师，诸天统御。大悲大愿、大圣大慈、万星教主、无极元皇、中天紫微北极大帝。<br>————肘击群：沐如风晨',
            bilibili_diandian: '#地雷係#天使界限#天使界隈女子#水色#水色系統#水色ネイル#サプカル地雷#サプカル女子#サプカルチャ一病みかわいい病み垢#病み垢女子',
            bilibili_longjiuzhen: '美少爱蒂朵，赛尔号著名宇宙圣皇。拥有极其精彩的操作，在与肘击群群主牢宁的赛尔号大战中经常因为手法和操作而赢得对战，现为肘击群管理之一，虽然自诩正人君子，实则抽象万分。蒂朵唯一指定老公。',
            bilibili_liuguanzhang: '为对抗风系大法师丁真，三英齐聚餐厅共议对策并向丁真寄送挑战书之事。虽三英为讨伐丁真之事制定了各种不同的策略，但因丁真过于强大，最终以失败告终。',
            bilibili_yirenyixiaojian: `<a href="https://space.bilibili.com/81796729"><img style=width:160px src=${lib.assetURL}extension/活动武将/image/skin/bilibili_yirenyixiaojian/全叠建哥.jpg></a>`,
            bilibili_zhugeliang: '你拾它作甚！！！你今天拾起来，他明天还要来撒野的！！！！！！',
        },
        characterFilter: {
            bilibili_sp_xuyou(mode) {
                return !lib.characterFilter.sp_xuyou(mode);
            },
            lz_tangzi(mode) {
                return mode != 'identity' && mode != 'guozhan';
            },
            bilibili_kuangshen() {
                return true;
                //return new Date().getDate() == 8 || new Date().getDate() == 24;
            },
        },
        characterTitle: {
            bilibili_shengxunyu: '偏宠之余晖',
            bilibili_Firewin: '昔往之鸟中左慈',
            bilibili_jinglingqiu: '最初的合伙人',
            bilibili_suixingsifeng: '一将功成万骨枯',
            bilibili_Emptycity: '跨时间的支持',
            bilibili_thunderlei: '始之友邦邦主',
            bilibili_lonelypatients: '群中流砥柱',
            bilibili_kuangshen: '幺幺零叁之心',
            bilibili_ningjingzhiyuan: '神秘光之国牢师',
            bilibili_xizhicaikobe: '风流之姿牢骚哥',
            bilibili_yanjing: '路边一条',
            bilibili_xiaoyaoruyun: '三界通之邻',
            bilibili_shuijiaobuboli: '催更传话一条龙',
            bilibili_wuzhuwanshui: '搬史大王',
            bilibili_murufengchen: '殚精竭虑群书记',
            bilibili_diandian: '唐氏指定合伙人',
            bilibili_wangtao: get.poptip({
                id: 'dualside_wangyue',
                name: '双面武将',
                type: 'character',
                dialog(dialog) {
                    dialog.addSmall([['bilibili_x_wangyue'], 'character']);
                    dialog.addText('正面武将翻面时或死亡后切换至背面');
                    return dialog;
                },
            }),
            bilibili_wangyue: get.poptip({
                id: 'dualside_wangtao',
                name: '双面武将',
                type: 'character',
                dialog(dialog) {
                    dialog.addSmall([['bilibili_x_wangtao'], 'character']);
                    dialog.addText('正面武将翻面时或死亡后切换至背面');
                    return dialog;
                },
            }),
            bilibili_daqiao: get.poptip({
                id: 'dualside_xiaoqiao',
                name: '双面武将',
                type: 'character',
                dialog(dialog) {
                    dialog.addSmall([['bilibili_x_xiaoqiao'], 'character']);
                    dialog.addText('正面武将翻面时或死亡后切换至背面');
                    return dialog;
                },
            }),
            bilibili_xiaoqiao: get.poptip({
                id: 'dualside_daqiao',
                name: '双面武将',
                type: 'character',
                dialog(dialog) {
                    dialog.addSmall([['bilibili_x_daqiao'], 'character']);
                    dialog.addText('正面武将翻面时或死亡后切换至背面');
                    return dialog;
                },
            }),
            bilibili_ahuinan: get.poptip({
                id: 'dualside_dongtuna',
                name: '双面武将',
                type: 'character',
                dialog(dialog) {
                    dialog.addSmall([['bilibili_x_dongtuna'], 'character']);
                    dialog.addText('正面武将翻面时或死亡后切换至背面');
                    return dialog;
                },
            }),
            bilibili_dongtuna: get.poptip({
                id: 'dualside_ahuinan',
                name: '双面武将',
                type: 'character',
                dialog(dialog) {
                    dialog.addSmall([['bilibili_x_ahuinan'], 'character']);
                    dialog.addText('正面武将翻面时或死亡后切换至背面');
                    return dialog;
                },
            }),
            bilibili_x_wangtao: get.poptip({
                id: 'dualside2_wangyue',
                name: '背面武将',
                type: 'character',
                info: '背景武将默认隐藏，正面武将翻面时或死亡后切换至背面',
            }),
            bilibili_x_wangyue: get.poptip({
                id: 'dualside2_wangtao',
                name: '背面武将',
                type: 'character',
                info: '背景武将默认隐藏，正面武将翻面时或死亡后切换至背面',
            }),
            bilibili_x_daqiao: get.poptip({
                id: 'dualside2_xiaoqiao',
                name: '背面武将',
                type: 'character',
                info: '背景武将默认隐藏，正面武将翻面时或死亡后切换至背面',
            }),
            bilibili_x_xiaoqiao: get.poptip({
                id: 'dualside2_daqiao',
                name: '背面武将',
                type: 'character',
                info: '背景武将默认隐藏，正面武将翻面时或死亡后切换至背面',
            }),
            bilibili_x_ahuinan: get.poptip({
                id: 'dualside2_dongtuna',
                name: '背面武将',
                type: 'character',
                info: '背景武将默认隐藏，正面武将翻面时或死亡后切换至背面',
            }),
            bilibili_x_dongtuna: get.poptip({
                id: 'dualside2_ahuinan',
                name: '背面武将',
                type: 'character',
                info: '背景武将默认隐藏，正面武将翻面时或死亡后切换至背面',
            }),
            bilibili_longjiuzhen: '赛蛆',
            bilibili_yirenyixiaojian: '肘击群大西王',
            bilibili_zhugeliang: '孔明何等人物？只要有钱粮在手，他马上会变出十万精兵来！',
        },
        characterSubstitute: {
            bilibili_gaowang: [
                ['scs_gaowang_dead', []],
            ],
        },
        card: {
            //闪闪
            bol_shanshan: {
                cardimage: 'shan',
                audio: 'shan',
                global: ['bol_shanshan_skill'],
                fullskin: true,
                type: 'basic',
                notarget: true,
                content() {
                    var evt2 = event.getParent(3)._trigger;
                    if (evt2.name == "phaseJudge") {
                        evt2.untrigger("currentOnly");
                        evt2.cancelled = true;
                    }
                    else evt2.neutralize();
                    var cardx = event.getParent().respondTo;
                    if (cardx && cardx[1] && cardx[1].cards && cardx[1].cards.filterInD('od').length) player.gain(cardx[1].cards.filterInD('od'), 'gain2', 'log');
                },
                ai: {
                    basic: {
                        useful: [6, 4, 3],
                        value: [6, 4, 3],
                    },
                    result: { player: 1 },
                },
            },
            //化身牌
            huashen_unknown: {
                fullimage: true,
                image: 'ext:活动武将/image/card/huashen_unknown.jpg',
            },
            //吴起兵法
            bol_wuqibingfa: {
                cardimage: 'taigongyinfu',
                fullskin: true,
                type: 'equip',
                subtype: 'equip5',
                loseDelay: false,
                onLose() {
                    cards.forEach(card => {
                        card.fix();
                        card.remove();
                        card.destroyed = true;
                        game.log(card, '被销毁了');
                    });
                    player.addTempSkill('bol_wuqibingfa');
                },
                skills: [],
                ai: {
                    order: 10,
                    equipValue(card, player) {
                        return player.getEquips('bol_wuqibingfa').length ? 0 : 5;
                    },
                    basic: { equipValue: 5 },
                },
                derivation: 'bfake_shen_jiaxu',
            },
            //牢骚之袍
            bilibili_laosaozhipao: {
                image: 'ext:活动武将/image/card/bilibili_laosaozhipao.png',
                fullskin: true,
                type: 'equip',
                subtype: 'equip2',
                skills: ['bilibili_laosaozhipao'],
                destroy: true,
                ai: {
                    equipValue(card, player) {
                        return player.hasSkill('bilibili_jiabin') ? -get.effect(player, { name: 'losehp' }, player, player) : 0;
                    },
                    basic: { equipValue: 0 },
                },
                derivation: 'bilibili_xizhicaikobe',
            },
            //史————OL的毒
            bilibili_shi: {
                image: 'ext:活动武将/image/card/bilibili_shi.png',
                fullskin: true,
                type: 'basic',
                enable: true,
                toself: true,
                filterTarget: lib.filter.isMe,
                selectTarget: -1,
                cardcolor: 'black',
                content() { },
                ai: {
                    value: -5,
                    useful: 6,
                    result: {
                        player(player, target) {
                            if (player.hasSkillTag('usedu')) return 5;
                            return -1;
                        },
                    },
                    order: 7.5,
                },
                destroy: 'discardPile',
                global: 'bilibili_shi',
                derivation: 'bilibili_wuzhuwanshui',
            },
            //嘉宾证
            bilibili_jiabinzheng: {
                image: 'ext:活动武将/image/card/bilibili_jiabinzheng.png',
                fullimage: true,
                type: 'equip',
                ai: {
                    order: 10,
                    basic: { equipValue: 15 },
                },
                derivation: 'bilibili_yirenyixiaojian',
            },
        },
        skill: {
            bolshicai: {
                audio: 'spshicai',
                inherit: 'spshicai',
                filter(event, player) {
                    return !player.hasCard(c => c.hasGaintag('bolshicai'), 'h');
                },
                content() {
                    game.log(player, '获得了牌堆顶的一张牌');
                    player.gain(get.cards()[0], 'draw').gaintag.add(event.name);
                },
                init(player, skill) {
                    if (player.isPhaseUsing()) player.addTempSkill(skill + '_effect', 'phaseUseAfter');
                },
                onremove(player, skill) {
                    player.removeSkill(skill + '_effect');
                },
                group: 'bolshicai_mark',
                subSkill: {
                    mark: {
                        inherit: 'spshicai_mark',
                        content() {
                            player.addTempSkill('bolshicai_effect', 'phaseUseAfter');
                        },
                    },
                    effect: {
                        charlotte: true,
                        init(player) {
                            if (game.online || ui[`bolCardPileUpdate_${player.playerid}`]) return;
                            const fun = player => {
                                let dialog = ui[`bolShiCaiShow_${player.playerid}`];
                                if (!dialog) {
                                    dialog = ui[`bolShiCaiShow_${player.playerid}`] = ui.create.div(ui.window);
                                    dialog.owner = player;
                                    dialog.className = 'dialog nobutton scroll1 scroll2';
                                    dialog.style.position = 'absolute';
                                    dialog.style.left = '50%';
                                    dialog.style.top = '50%';
                                    dialog.style.transform = 'translate(-50%, -50%)';
                                    dialog.style.width = 'fit-content';
                                    dialog.style.height = 'fit-content';
                                    dialog.style.display = 'flex';
                                    dialog.style.flexDirection = 'column';
                                    dialog.style.background = 'rgba(0,0,0,0.72)';
                                    dialog.style.gap = '2.5px';
                                    Object.setPrototypeOf(dialog, lib.element.dialog);
                                    dialog.ontouchstart = ui.click.dragtouchdialog;
                                    const title = ui.create.div(dialog);
                                    title.style.position = 'relative';
                                    title.style.textAlign = 'center';
                                    title.innerHTML = '恃才';
                                    const container = dialog.container = ui.create.div('.buttons', dialog);
                                    container.style.position = 'relative';
                                    container.classList.add('smallzoom');
                                    const cards = get.itemtype(_status.pileTop) === 'card' ? [_status.pileTop] : [];
                                    const buttons = Array.from(dialog.container.childNodes);
                                    for (const card of buttons) dialog.container.removeChild(card);
                                    dialog.style.width = `${cards.length > 0 ? '125' : '0'}px`;
                                    dialog.buttons = ui.create.buttons(cards, 'card', dialog.container, true);
                                    if (dialog.buttons[0]?.node?.gaintag) {
                                        if (dialog.buttons[0].node.gaintag.innerHTML.length > 0) dialog.buttons[0].node.gaintag.innerHTML += ' ';
                                        dialog.buttons[0].node.gaintag.innerHTML += '牌堆顶';
                                    }
                                    dialog.updateDialog = function () {
                                        const owner = this.owner;
                                        if (!owner?.hasSkill('bolshicai') || !owner.hasSkill('bolshicai_effect')) return;
                                        const cards = get.itemtype(_status.pileTop) === 'card' ? [_status.pileTop] : [];
                                        const buttons = Array.from(dialog.container.childNodes);
                                        for (const card of buttons) dialog.container.removeChild(card);
                                        dialog.style.width = `${cards.length > 0 ? '125' : '0'}px`;
                                        dialog.buttons = ui.create.buttons(cards, 'card', dialog.container, true);
                                        if (dialog.buttons[0]?.node?.gaintag) {
                                            if (dialog.buttons[0].node.gaintag.innerHTML.length > 0) dialog.buttons[0].node.gaintag.innerHTML += ' ';
                                            dialog.buttons[0].node.gaintag.innerHTML += '牌堆顶';
                                        }
                                    };
                                    requestAnimationFrame(() => {
                                        const rect = dialog.getBoundingClientRect();
                                        const zoom = game.documentZoom || 1;
                                        dialog.style.transform = '';
                                        dialog.style.left = rect.left / zoom + 'px';
                                        dialog.style.top = rect.top / zoom + 'px';
                                    });
                                }
                                else dialog.style.display = '';
                                ui[`bolCardPileUpdate_${player.playerid}`] = new MutationObserver(mutationsList => {
                                    for (const mutation of mutationsList) {
                                        if (mutation.type === 'childList') {
                                            if (!player.hasSkill('bolshicai') || !player.hasSkill('bolshicai_effect')) return;
                                            if (player === game.me) ui[`bolShiCaiShow_${player.playerid}`]?.updateDialog();
                                            else if (player.isOnline2()) player.send(() => ui[`bolShiCaiShow_${player.playerid}`]?.updateDialog?.());
                                        }
                                    }
                                });
                                const config = { childList: true, subtree: false };
                                ui[`bolCardPileUpdate_${player.playerid}`].observe(ui.cardPile, config);
                            };
                            if (player.isMine()) fun(player);
                            else if (player.isOnline2()) player.send(fun, player);
                        },
                        onremove(player) {
                            if (game.online) return;
                            if (ui[`bolCardPileUpdate_${player.playerid}`]) {
                                ui[`bolCardPileUpdate_${player.playerid}`].disconnect();
                                delete ui[`bolCardPileUpdate_${player.playerid}`];
                            }
                            const fun = player => {
                                if (ui[`bolShiCaiShow_${player.playerid}`]) ui[`bolShiCaiShow_${player.playerid}`].style.display = 'none';
                            };
                            if (player.isMine()) fun(player);
                            else if (player.isOnline2()) player.send(fun, player);
                        },
                    },
                },
            },
            //许劭
            bol_pinjian: {
                init(player) {
                    if (!_status.characterlist) lib.skill.bol_pinjian.initList();
                    /*
                    if (!_status.characterlist._bol_pinjian_init) {
                        _status.characterlist.randomSort();
                        function bol_pinjian_timeset(callback, delay) {
                            let timeout;
                            return function () {
                                clearTimeout(timeout);
                                timeout = setTimeout(callback, delay);
                            };
                        };
                        const debouncedUpdate = bol_pinjian_timeset(() => {
                            for (const player of game.filterPlayer()) {
                                if (player.getSkills(null, null, false).includes('bol_pinjian')) {
                                    lib.skill.bol_pinjian.update(player);
                                }
                            }
                        }, 200);
                        const handler = {
                            set(target, property, value) {
                                const result = Reflect.set(target, property, value);
                                debouncedUpdate();
                                return result;
                            },
                            deleteProperty(target, property) {
                                const result = Reflect.deleteProperty(target, property);
                                debouncedUpdate();
                                return result;
                            }
                        };
                        _status.characterlist = new Proxy(_status.characterlist, handler);
                        _status.characterlist._bol_pinjian_init = true;
                    }
                    */
                    if (!_status.bol_pinjian_update) {
                        _status.characterlist.randomSort();
                        let updatePending = false;
                        _status.bol_pinjian_update = function () {
                            if (updatePending) return;
                            updatePending = true;
                            Promise.resolve().then(() => {
                                updatePending = false;
                                for (const player of game.filterPlayer()) {
                                    if (player.getSkills(null, null, false).includes('bol_pinjian')) {
                                        lib.skill.bol_pinjian.update(player);
                                    }
                                }
                            });
                        }
                        const list = _status.characterlist;
                        const methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
                        for (const method of methods) {
                            const original = list[method];
                            Object.defineProperty(list, method, {
                                configurable: true,
                                writable: true,
                                value(...args) {
                                    const result = original.apply(this, args);
                                    _status.bol_pinjian_update();
                                    return result;
                                }
                            });
                        }
                    }
                    lib.skill.bol_pinjian.update(player);
                },
                onremove(player) {
                    lib.skill.bol_pinjian.update(player, true);
                    player.removeSkillBlocker('bol_pinjian');
                },
                update(player, remove) {
                    const OriginalSkills = player.getStorage('bol_pinjian').reduce((list, name) => list.addArray(get.character(name).skills || []), []);
                    player.removeInvisibleSkill(OriginalSkills);
                    if (remove === true) {
                        delete player.storage.bol_pinjian;
                        return player.unmarkSkill('bol_pinjian');
                    }
                    player.addSkillBlocker('bol_pinjian');
                    const names = _status.characterlist.slice(0, 4);
                    player.storage.bol_pinjian = names;
                    player.markSkill('bol_pinjian');
                    const NowSkills = player.getStorage('bol_pinjian').reduce((list, name) => list.addArray(get.character(name).skills || []), []);
                    player.addInvisibleSkill(NowSkills);
                },
                skillBlocker(skill, player) {
                    const skills = player.getStorage('bol_pinjian').reduce((list, name) => list.addArray(get.character(name).skills || []), []);
                    return skills.includes(skill) && player.invisibleSkills.includes(skill) && (!player.hasSkill('bol_pinjian') || player.hasSkill('bol_pinjian_used'));
                },
                audio: 'pingjian1.mp3',
                trigger: { player: ['useSkill', 'logSkillBegin'] },
                filter(event, player) {
                    const skills = player.getStorage('bol_pinjian').reduce((list, name) => list.addArray(get.character(name).skills || []), []);
                    const skill = get.sourceSkillFor(event);
                    return skills.includes(skill) && player.invisibleSkills.includes(skill);
                },
                direct: true,
                content() {
                    player.addTempSkill('bol_pinjian_used');
                    const names = player.storage.bol_pinjian;
                    if (names?.length) {
                        _status.characterlist.removeArray(names);
                        _status.characterlist.addArray(names);
                    }
                },
                marktext: '将',
                intro: {
                    markcount: (storage, player) => player.isUnderControl(true) ? storage.length.toString() : '?',
                    mark(dialog, storage, player) {
                        if (!player.isUnderControl(true)) return '观看武将牌堆ing...';
                        if (!storage?.length) return '当前武将牌堆没有牌！';
                        dialog.addSmall([storage, 'character']);
                        const skills = player.getStorage('bol_pinjian').reduce((list, name) => list.addArray(get.character(name).skills || []), []);
                        if (skills.length) dialog.addText('<li>当前可用技能：' + get.translation(skills), false);
                    },
                },
                group: 'bol_pinjian_trigger',
                async triggerInvisible(event, trigger, player) {
                    if (get.info(trigger.skill)?.silent) return event.finish();
                    const result = await ((event, trigger, player) => {
                        var info = get.info(trigger.skill), check = info.check;
                        var skillName = event.name, event = trigger, trigger = event._trigger, str;
                        if (info.prompt) str = info.prompt;
                        else {
                            if (typeof info.logTarget == "string") {
                                str = get.prompt(event.skill, trigger[info.logTarget], player);
                            }
                            else if (typeof info.logTarget == "function") {
                                var logTarget = info.logTarget(trigger, player, trigger.triggername, trigger.indexedData);
                                if (get.itemtype(logTarget)?.indexOf("player") == 0) str = get.prompt(event.skill, logTarget, player);
                            }
                            else str = get.prompt(event.skill, null, player);
                        }
                        if (typeof str == "function") str = str(trigger, player, trigger.triggername, trigger.indexedData);
                        var next = player.chooseBool(get.translation(skillName) + "：" + str);
                        next.set("yes", !check || check(trigger, player, trigger.triggername, trigger.indexedData));
                        next.set("hsskill", event.skill);
                        next.set("forceDie", true);
                        next.set("ai", () => _status.event.yes);
                        if (typeof info.prompt2 == "function") {
                            next.set("prompt2", info.prompt2(trigger, player, trigger.triggername, trigger.indexedData));
                        }
                        else if (typeof info.prompt2 == "string") {
                            next.set("prompt2", info.prompt2);
                        }
                        else if (info.prompt2 != false) {
                            if (lib.dynamicTranslate[event.skill]) next.set("prompt2", lib.dynamicTranslate[event.skill](player, event.skill));
                            else if (lib.translate[event.skill + "_info"]) next.set("prompt2", lib.translate[event.skill + "_info"]);
                        }
                        if (trigger.skillwarn) {
                            if (next.prompt2) next.set("prompt2", '<span class="thundertext">' + trigger.skillwarn + "。</span>" + next.prompt2);
                            else next.set("prompt2", trigger.skillwarn);
                        }
                        return next;
                    })(event, trigger, player).forResult();
                    if (result.bool) {
                        if (!get.info(trigger.skill).cost) trigger.revealed = true;
                    }
                    else {
                        trigger.untrigger();
                        trigger.cancelled = true;
                    }
                },
                subSkill: {
                    used: { charlotte: true },
                    trigger: {
                        charlotte: true,
                        trigger: { player: 'triggerInvisible' },
                        filter(event, player) {
                            if (event.revealed) return false;
                            const info = get.info(event.skill);
                            if (info?.charlotte) return false;
                            let skills = player.getStorage('bol_pinjian').reduce((list, name) => list.addArray(get.character(name).skills || []), []);
                            game.expandSkills(skills);
                            return skills.includes(event.skill);
                        },
                        forceDie: true,
                        priority: 12,
                        forced: true,
                        popup: false,
                        content() {
                            get.info('bol_pinjian').triggerInvisible(event, trigger, player);
                        },
                    },
                },
            },
            bol_yuedan: {
                audio: 'pingjian2.mp3',
                trigger: { global: 'roundStart' },
                filter(event, player) {
                    return game.roundNumber % 4 === 0;
                },
                forced: true,
                content() {
                    if (!_status.characterlist) lib.skill.bol_pinjian.initList();
                    _status.characterlist.randomSort();
                    game.log(player, '洗切了', '#g武将牌堆');
                    game.delayx();
                },
                ai: { combo: 'bol_pinjian' },
            },
            //闪闪
            bol_shanshan_skill: {
                trigger: { target: 'useCardToBefore', player: 'phaseJudge' },
                filter(event, player) {
                    var card = event.card;
                    if (event.name == 'phaseJudge' && card.viewAs) card = { name: card.viewAs };
                    if (event.name != 'phaseJudge' && event.getParent().directHit?.includes(player)) return false;
                    return ['basic', 'trick'].includes(get.type2(card)) && player.hasUsableCard('bol_shanshan');
                },
                forced: true,
                priority: 11 + 45 + 14,
                content() {
                    'step 0'
                    var card = trigger.card;
                    if (trigger.name == 'phaseJudge' && card.viewAs) card = { name: card.viewAs };
                    var next = player.chooseToUse();
                    next.set('prompt', '是否使用【闪闪】？');
                    next.set('prompt2', '抵消' + (trigger.name != 'phaseJudge' ? (get.translation(trigger.player) + '对你使用的') : '') + get.translation(card) + (trigger.name != 'phaseJudge' ? '' : '的判定效果'));
                    next.set('filterCard', function (card, player) {
                        if (get.name(card) != 'bol_shanshan') return false;
                        return lib.filter.cardEnabled(card, player, 'forceEnable');
                    });
                    next.set('respondTo', [trigger.player, trigger.card]);
                    next.set('goon', -get.effect(player, card, trigger.player, player));
                    next.set('ai1', function (card) {
                        return _status.event.goon;
                    });
                    'step 1'
                    if (result.bool && trigger.name == 'phaseJudge' && [trigger.card].filterInD().length) player.gain([trigger.card].filterInD(), 'gain2');
                },
            },
            bilibili_chongxu: {
                audio: 'chongxu',
                inherit: 'chongxu',
                async content(event, trigger, player) {
                    await Promise.all(event.next);
                    if (_status.connectMode) event.time = lib.configOL.choose_timeout;
                    event.videoId = lib.status.videoId++;
                    if (player.isUnderControl()) game.swapPlayerAuto(player);
                    let time = 10;
                    const switchToAuto = () => {
                        return new Promise((resolve) => {
                            game.pause();
                            game.countChoose();
                            event._result = { score: 5 };
                            setTimeout(() => {
                                _status.imchoosing = false;
                                if (event.dialog) event.dialog.close();
                                game.resume();
                                resolve(event._result);
                            }, time * 1000);
                        });
                    };
                    const createDialog = (player, id) => {
                        if (_status.connectMode) lib.configOL.choose_timeout = '30';
                        if (player === game.me) return;
                        const dialog = ui.create.dialog(get.translation(player) + '正在进行“飞升”...<br>');
                        dialog.videoId = id;
                    };
                    const chooseButton = (time) => {
                        const { promise, resolve } = Promise.withResolvers(), event = _status.event;
                        event.dialog = (() => {
                            //游戏dialog
                            const dialog = ui.create.dialog('hidden');
                            dialog.classList.add('popped');
                            dialog.classList.add('static');
                            Object.assign(dialog.style, {
                                height: '100%',
                                width: '100%',
                                top: '0px',
                                left: '0px',
                                background: 'rgba(0,0,0,0.85)',
                                textAlign: 'center',
                            });
                            ui.window.appendChild(dialog);
                            dialog.innerHTML = '';
                            //游戏画布
                            const canvas = document.createElement('canvas');
                            const width = 480, height = 320;
                            canvas.width = width;
                            canvas.height = height;
                            Object.assign(canvas.style, {
                                display: 'block',
                                margin: '40px auto 10px auto',
                                background: '#000',
                                borderRadius: '8px',
                            });
                            dialog.appendChild(canvas);
                            const ctx = canvas.getContext('2d');
                            //触控按钮，给手机端用的
                            const ctrlBox = document.createElement('div');
                            Object.assign(ctrlBox.style, {
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                margin: '0 auto',
                                gap: '120px',
                            });
                            const leftBtn = document.createElement('button');
                            const rightBtn = document.createElement('button');
                            const styleBtn = {
                                width: '180px',
                                height: '40px',
                                fontSize: '20px',
                                borderRadius: '8px',
                                background: '#333',
                                color: '#fff',
                                flex: 'none',
                            };
                            Object.assign(leftBtn.style, styleBtn);
                            Object.assign(rightBtn.style, styleBtn);
                            leftBtn.textContent = '←';
                            rightBtn.textContent = '→';
                            ctrlBox.appendChild(leftBtn);
                            ctrlBox.appendChild(rightBtn);
                            dialog.appendChild(ctrlBox);
                            //主角登场
                            const player = { x: width / 2 - 15, y: height - 30, w: 30, h: 30, speed: 5 };
                            const balls = [];
                            let score = 0, running = true;
                            const keys = { left: false, right: false };
                            //电脑也干了
                            const keyDown = e => {
                                if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = true;
                                if (e.key === 'ArrowRight' || e.key === 'd') keys.right = true;
                            };
                            const keyUp = e => {
                                if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = false;
                                if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false;
                            };
                            window.addEventListener('keydown', keyDown);
                            window.addEventListener('keyup', keyUp);
                            //手机也干了
                            let holdLeft = false, holdRight = false;
                            leftBtn.addEventListener(lib.device ? 'touchstart' : 'mousedown', () => holdLeft = true);
                            leftBtn.addEventListener(lib.device ? 'touchend' : 'mouseup', () => holdLeft = false);
                            rightBtn.addEventListener(lib.device ? 'touchstart' : 'mousedown', () => holdRight = true);
                            rightBtn.addEventListener(lib.device ? 'touchend' : 'mouseup', () => holdRight = false);
                            const spawnBall = () => {
                                const good = Math.random() < 0.6;
                                balls.push({
                                    x: Math.random() * (width - 15),
                                    y: -10,
                                    r: 8,
                                    color: good ? 'lime' : 'red',
                                    speed: 1.8 + Math.random(),
                                    good,
                                });
                            };
                            //添加时间差变量
                            let lastTime = 0;
                            const update = (currentTime = 0) => {
                                //计算时间差（将不同设备均标准化到60fps）
                                const deltaTime = lastTime ? (currentTime - lastTime) / 16.67 : 1;
                                lastTime = currentTime;
                                if (keys.left || holdLeft) player.x -= player.speed * deltaTime;
                                if (keys.right || holdRight) player.x += player.speed * deltaTime;
                                player.x = Math.max(0, Math.min(width - player.w, player.x));
                                if (Math.random() < 0.03) spawnBall();
                                for (let i = balls.length - 1; i >= 0; i--) {
                                    const b = balls[i];
                                    b.y += b.speed * deltaTime;
                                    if (
                                        b.x + b.r > player.x &&
                                        b.x < player.x + player.w &&
                                        b.y + b.r > player.y &&
                                        b.y < player.y + player.h
                                    ) {
                                        score += b.good ? 1 : -1;
                                        score = Math.max(0, score);
                                        balls.splice(i, 1);
                                        continue;
                                    }
                                    if (b.y > height + 10) balls.splice(i, 1);
                                }
                            };
                            const draw = () => {
                                ctx.clearRect(0, 0, width, height);
                                ctx.fillStyle = 'white';
                                ctx.fillRect(player.x, player.y, player.w, player.h);
                                for (const b of balls) {
                                    ctx.beginPath();
                                    ctx.fillStyle = b.color;
                                    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
                                    ctx.fill();
                                }
                                ctx.fillStyle = 'yellow';
                                ctx.font = '16px monospace';
                                ctx.fillText(`分数: ${score}`, 10, 20);
                                ctx.fillText(`时间: ${time.toFixed(1)}s`, width - 110, 20);
                            };
                            const loop = (currentTime) => {
                                if (!running) return;
                                update(currentTime);
                                draw();
                                requestAnimationFrame(loop);
                            };
                            const timer = setInterval(() => {
                                time -= 0.1;
                                if (time <= 0 || score >= 5) {
                                    running = false;
                                    clearInterval(timer);
                                    setTimeout(endGame, 500);
                                }
                            }, 100);
                            const endGame = () => {
                                ctx.clearRect(0, 0, width, height);
                                ctx.fillStyle = 'white';
                                ctx.font = '24px sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(`游戏结束！得分：${score}`, width / 2, height / 2);
                                event._result = { score };
                                //孩子们，玩完游戏记得对页面进行清理哦
                                window.removeEventListener('keydown', keyDown);
                                window.removeEventListener('keyup', keyUp);
                                leftBtn.remove();
                                rightBtn.remove();
                                ctrlBox.remove();
                                setTimeout(() => {
                                    if (event.dialog) event.dialog.close();
                                    _status.imchoosing = false;
                                    game.resume();
                                    resolve(event._result);
                                }, 2000);
                            };
                            requestAnimationFrame(loop);
                            return dialog;
                        })();
                        event.switchToAuto = () => {
                            event._result = { score: 5 };
                            game.resume();
                            resolve(event._result);
                        };
                        _status.imchoosing = true;
                        game.pause();
                        game.countChoose();
                        return promise;
                    };
                    game.broadcastAll(createDialog, player, event.videoId);
                    let next;
                    if (event.isMine()) next = chooseButton(time);
                    else if (event.isOnline()) {
                        const { promise, resolve } = Promise.withResolvers();
                        event.player.send(chooseButton, time);
                        event.player.wait(async result => {
                            if (result === 'ai') result = await switchToAuto();
                            resolve(result);
                        });
                        game.pause();
                        next = promise;
                    }
                    else next = switchToAuto();
                    const result2 = await next;
                    game.broadcastAll((id, time) => {
                        if (_status.connectMode) lib.configOL.choose_timeout = time;
                        const dialog = get.idDialog(id);
                        if (dialog) dialog.close();
                    }, event.videoId, event.time);
                    if (!result2 || !result2.score || result2.score < 2) return;
                    const func = () => {
                        const event = get.event();
                        const controls = [
                            link => {
                                const evt = get.event();
                                if (evt.dialog && evt.dialog.buttons) {
                                    for (let i = 0; i < evt.dialog.buttons.length; i++) {
                                        const button = evt.dialog.buttons[i];
                                        button.classList.remove('selectable');
                                        button.classList.remove('selected');
                                        const counterNode = button.querySelector('.caption');
                                        if (counterNode) counterNode.childNodes[0].innerHTML = ``;
                                    }
                                    ui.selected.buttons.length = 0;
                                    game.check();
                                }
                                return;
                            },
                        ];
                        event.controls = [ui.create.control(controls.concat(['清除选择', 'stayleft']))];
                    };
                    if (event.isMine()) func();
                    else if (event.isOnline()) event.player.send(func);
                    const result = await player.chooseButton([
                        '###' + get.translation(event.name) + '###<div class="text center">本次共获得' + result2.score + '分，请选择你要执行的项目</div>',
                        [
                            [
                                ['miaojian', '使用3积分升级【' + get.translation('miaojian') + '】'],
                                ['shhlianhua', '使用3积分升级【' + get.translation('shhlianhua') + '】'],
                                ['draw', '使用2积分摸一张牌'],
                            ],
                            'textbutton',
                        ],
                    ], [1, Infinity]).set('filterButton', button => {
                        const player = get.player(), choice = ui.selected.buttons.map(i => i.link);
                        if (button.link !== 'draw' && (!player.hasSkill(button.link, null, null, false) || choice.filter(i => i === button.link).length + player.countMark(button.link) > 1)) return false;
                        return [...choice, button.link].reduce((sum, i) => sum + (i === 'draw' ? 2 : 3), 0) <= get.event().score;
                    }).set('score', result2.score).set('custom', {
                        add: {
                            confirm(bool) {
                                if (typeof bool !== 'boolean') return;
                                const event = get.event().parent;
                                if (Array.isArray(event.controls)) event.controls.forEach(i => i.close());
                                if (ui.confirm) ui.confirm.close();
                                game.uncheck();
                            },
                            button() {
                                if (ui.selected.buttons.length) return;
                                const event = get.event();
                                if (event.dialog && event.dialog.buttons) {
                                    for (let i = 0; i < event.dialog.buttons.length; i++) {
                                        const button = event.dialog.buttons[i];
                                        const counterNode = button.querySelector('.caption');
                                        if (counterNode) counterNode.childNodes[0].innerHTML = ``;
                                    }
                                }
                                if (!ui.selected.buttons.length) event.parent?.controls?.[0]?.classList.add('disabled');
                            },
                        },
                        replace: {
                            button(button) {
                                const event = get.event();
                                if (!event.isMine() || !event.filterButton(button) || button.classList.contains('selectable') == false) return;
                                button.classList.add('selected');
                                ui.selected.buttons.push(button);
                                let counterNode = button.querySelector('.caption');
                                const count = ui.selected.buttons.filter(i => i == button).length;
                                counterNode ? (((counterNode) => {
                                    counterNode = counterNode.childNodes[0];
                                    counterNode.innerHTML = `×${count}`;
                                })(counterNode)) : counterNode = ui.create.caption(`<span style="font-family:xinwei; text-shadow:#FFF 0 0 4px, #FFF 0 0 4px, rgba(74,29,1,1) 0 0 3px;">×${count}</span>`, button);
                                event.parent?.controls?.[0]?.classList.remove('disabled');
                                game.check();
                            },
                        },
                    }).forResult();
                    if (result?.bool && result.links?.length) {
                        const miaojian = result.links.filter(i => i === 'miaojian').length;
                        if (miaojian > 0) {
                            player.addMark('miaojian', miaojian, false);
                            player.popup('miaojian');
                            game.log(player, '升级了技能', '#g【' + get.translation('miaojian') + '】');
                        }
                        const shhlianhua = result.links.filter(i => i === 'shhlianhua').length;
                        if (shhlianhua > 0) {
                            player.addMark('shhlianhua', shhlianhua, false);
                            player.popup('shhlianhua');
                            game.log(player, '升级了技能', '#g【' + get.translation('shhlianhua') + '】');
                        }
                        const draw = result.links.filter(i => i === 'draw').length;
                        if (draw > 0) await player.draw(draw);
                    }
                },
                ai: {
                    order: 10,
                    result: { player: 1 },
                },
                derivation: [],
            },
            //水 果 忍 者
            bilibili_zhengjing: {
                audio: 'zhengjing',
                inherit: 'zhengjing',
                async content(event, trigger, player) {
                    let cards = [], names = [], types = [];
                    while (true) {
                        const card = get.cardPile(card => {
                            //判定类型是否补充完毕的辅助牌
                            const card2 = get.cardPile(card2 => card2.name !== 'du' && !names.includes(card2.name) && !types.includes(get.type2(card2)));
                            //先填补每种类型的牌各一张，然后补充其他的牌
                            return card.name !== 'du' && !names.includes(card.name) && (!types.includes(get.type2(card)) || !card2);
                        });
                        if (card) {
                            cards.push(card);
                            names.push(card.name);
                            types.push(get.type2(card));
                            if (get.mode() == 'doudizhu') {
                                if (cards.length == 1 && !get.isLuckyStar(player) && Math.random() < 0.33) break;
                                if (cards.length == 2 && !get.isLuckyStar(player) && Math.random() < 0.5) break;
                                if (cards.length >= 3) break;
                            }
                            else {
                                if (cards.length == 3 && !get.isLuckyStar(player) && Math.random() < 0.33) break;
                                if (cards.length == 4 && !get.isLuckyStar(player) && Math.random() < 0.5) break;
                                if (cards.length >= 5) break;
                            }
                        }
                        else break;
                    };
                    if (!cards.length) return event.finish();
                    let cardx = { 'du': names.length }, num = [3, 4, 6].randomGet();
                    for (const i of names) cardx[i] = num;//切牌数
                    await Promise.all(event.next);
                    if (_status.connectMode) event.time = lib.configOL.choose_timeout;
                    event.videoId = lib.status.videoId++;
                    if (player.isUnderControl()) game.swapPlayerAuto(player);
                    const switchToAuto = () => {
                        return new Promise((resolve) => {
                            game.pause();
                            game.countChoose();
                            event._result = {};
                            for (const i in cardx) event._result[i] = cardx[i];
                            setTimeout(() => {
                                _status.imchoosing = false;
                                if (event.dialog) event.dialog.close();
                                game.resume();
                                resolve(event._result);
                            }, 5000);
                        });
                    };
                    const createDialog = (player, id) => {
                        if (_status.connectMode) lib.configOL.choose_timeout = "30";
                        if (player === game.me) return;
                        const dialog = ui.create.dialog(get.translation(player) + "正在整理经书...<br>");
                        dialog.videoId = id;
                    };
                    /*
                    第一版，全屏切水果，无进度条显示，炸弹为毒
                    const chooseButton = cardx => {
                        const { promise, resolve } = Promise.withResolvers(), event = _status.event;
                        event.dialog = ((cards) => {
                            let cards1 = [], lineList = [], pointList = [], pointNum = 0, result = {}, interval;
                            for (const i in cards) cards1 = cards1.concat(Array.from({ length: cards[i] }).map(() => i));
                            if (!cards1.length) cards1.push('sha');
                            const finish = () => {
                                clearInterval(interval);
                                _status.imchoosing = false;
                                if (event.dialog) event.dialog.close();
                                event._result = result;
                                resolve(event._result);
                                game.resume();
                            };
                            const dialog = event.dialog = ui.create.dialog('hidden');
                            dialog.classList.add('popped');
                            dialog.classList.add('static');
                            dialog.style.height = '100%';
                            dialog.style.width = '100%';
                            dialog.style.top = '0px';
                            dialog.style.left = '0px';
                            dialog.style['text-align'] = 'left';
                            ui.window.appendChild(dialog);
                            dialog.innerHTML = '';
                            const getAngle = (x1, y1, x2, y2) => {
                                var x = x1 - x2;
                                var y = y1 - y2;
                                var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
                                var cos = y / z;
                                var radina = Math.acos(cos);
                                var angle = 180 / (Math.PI / radina);
                                if (x2 > x1 && y2 === y1) angle = 0;
                                if (x2 > x1 && y2 < y1) angle = angle - 90;
                                if (x2 === x1 && y1 > y2) angle = -90;
                                if (x2 < x1 && y2 < y1) angle = 270 - angle;
                                if (x2 < x1 && y2 === y1) angle = 180;
                                if (x2 < x1 && y2 > y1) angle = 270 - angle;
                                if (x2 === x1 && y2 > y1) angle = 90;
                                if (x2 > x1 && y2 > y1) angle = angle - 90;
                                return angle;
                            };
                            const createLine = e => {
                                if (dialog.hadClicked == true) {
                                    if (e.changedTouches) e = e.changedTouches[e.changedTouches.length - 1];
                                    if (pointNum % 3 == 0) {
                                        pointList.push([e.clientX / game.documentZoom, e.clientY / game.documentZoom]);
                                        if (pointList.length >= 2) {
                                            var point0 = pointList[pointList.length - 2];
                                            var point1 = pointList[pointList.length - 1];
                                            var x0 = point0[0];
                                            var y0 = point0[1];
                                            var x1 = point1[0];
                                            var y1 = point1[1];
                                            var div = document.createElement('div');
                                            div.style.zIndex = 1;
                                            div.style.borderRadius = '4px';
                                            div.style.position = 'fixed';
                                            div.style.background = '#ffffff';
                                            div.style.height = '4px';
                                            div.style.width = (Math.pow(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2), 0.5) + 2) + 'px';
                                            div.style.left = (x0 + 2) + 'px';
                                            div.style.top = (y0 + 2) + 'px';
                                            div.style.transform = 'rotate(' + getAngle(x0, y0, x1, y1) + 'deg)';
                                            div.style['transform-origin'] = '0 50%';
                                            dialog.appendChild(div);
                                            lineList.push(div);
                                            if (lineList.length > 3) {
                                                var div1 = lineList[0];
                                                div1.style.transition = 'opacity 0.25s';
                                                div1.style.opacity = 0;
                                                setTimeout(() => {
                                                    if (div1.parentNode != undefined) div1.parentNode.removeChild(div1);
                                                }, 250);
                                                lineList.remove(lineList[0]);
                                                pointList[0] = 1;
                                                pointList.remove(pointList[0]);
                                            };
                                        };
                                    };
                                    pointNum++;
                                };
                            };
                            const clearLine = () => {
                                const deleteLine = () => {
                                    const div1 = lineList[0];
                                    div1.style.transition = 'opacity 0.25s';
                                    div1.style.opacity = 0;
                                    setTimeout(() => {
                                        if (div1.parentNode != undefined) div1.parentNode.removeChild(div1);
                                    }, 250);
                                    lineList.remove(lineList[0]);
                                    if (lineList.length > 0) deleteLine();
                                };
                                if (lineList.length > 0) deleteLine();
                                pointList = [];
                            };
                            dialog.addEventListener(lib.device ? "touchstart" : "mousedown", e => {
                                e.stopPropagation();
                                dialog.hadClicked = true;
                                pointNum = 0;
                            });
                            dialog.addEventListener(lib.device ? "touchmove" : "mousemove", createLine);
                            dialog.addEventListener(lib.device ? "touchend" : "mouseup", e => {
                                e.stopPropagation();
                                delete dialog.hadClicked;
                                clearLine();
                            });
                            const createCard = name => {
                                const left = Math.ceil(Math.random() * 560), card = ui.create.card(null, 'noclick', true);
                                card.init({ name: name });
                                if (name == 'du') card.style['box-shadow'] = 'rgba(0, 0, 0, 0.2) 0 0 0 1px,rgba(255, 0, 0, 0.4) 0 0 5px, rgba(255, 0, 0, 0.4) 0 0 12px, rgba(255, 0, 0, 0.8) 0 0 15px';
                                card.style['pointer-events'] = 'none';
                                card.style.position = 'absolute';
                                card.style.top = (dialog.offsetHeight - 5) + 'px';
                                card.style.left = (left) + 'px';
                                card.style.transition = 'opacity 0.25s';
                                card.style.opacity = 0;
                                dialog.appendChild(card);
                                setTimeout(() => card.style.opacity = 1, 10);
                                var t_x = 0, t_y = 0, s_x = 0, s_y = 0, s_y0 = 0, t_x_increase = 0, t_y_increase = 0.3;
                                var v_y = [90, 95, 100, 105, 110, 115, 105, 110, 115].randomGet();
                                var a_y = [9, 9.2, 9.4, 9.6, 9.8, 10, 10.2, 10.4, 10.6, 10.8, 11].randomGet();
                                var isMovingUp = true, cardLeft = card.offsetLeft, cardTop = card.offsetTop, num_x = 63;
                                if (v_y == 90) num_x = 56;
                                else if (v_y == 95) num_x = 60;
                                else if (v_y == 100) num_x = 63;
                                else if (v_y == 105) num_x = 67;
                                else if (v_y == 110) num_x = 70;
                                else num_x = 74;
                                if ([true, false].randomGet()) {
                                    let s1 = dialog.offsetWidth - card.offsetWidth - left;
                                    t_x_increase = (s1 / num_x) * Math.random();
                                }
                                else {
                                    let s1 = left;
                                    t_x_increase = -(s1 / num_x) * Math.random();
                                };
                                const interval1 = setInterval(() => {
                                    if (!_status.paused2) {
                                        t_x += t_x_increase;
                                        s_x = t_x;
                                        card.style.left = (cardLeft + s_x) + 'px';
                                        t_y += t_y_increase;
                                        s_y = -(v_y * t_y - a_y * Math.pow(t_y, 2) / 2);
                                        card.style.top = (cardTop + s_y) + 'px';
                                        if (isMovingUp == true) {
                                            if (s_y - s_y0 > 0) isMovingUp = !isMovingUp;
                                            s_y0 = s_y;
                                        };
                                        if (card.offsetTop > dialog.offsetHeight + 5 - card.offsetWidth &&
                                            isMovingUp == false && card.hadHide != true) {
                                            card.hadHide = true;
                                            card.style.transition = 'opacity .3s';
                                            card.style.opacity = 0;
                                            setTimeout(() => {
                                                card.delete();
                                                clearInterval(interval1);
                                            }, 350);
                                        };
                                        if (card.hadCut != true) {
                                            for (var i = 0; i < pointList.length; i++) {
                                                if (card.hadCut == true || pointList[i + 1] == undefined) continue;
                                                var point0 = pointList[i];
                                                var point1 = pointList[i + 1];
                                                var x0 = point0[0] - dialog.offsetLeft;
                                                var y0 = point0[1] - dialog.offsetTop;
                                                var x1 = point1[0] - dialog.offsetLeft;
                                                var y1 = point1[1] - dialog.offsetTop;
                                                var bool = false;
                                                var x0_card = card.offsetLeft;
                                                var x1_card = card.offsetLeft + card.offsetWidth;
                                                var y0_card = card.offsetTop;
                                                var y1_card = card.offsetTop + card.offsetHeight;
                                                var xiangjiao = function (line1, line2) {
                                                    var x1 = line1[0][0];
                                                    var x2 = line1[1][0];
                                                    var x3 = line2[0][0];
                                                    var x4 = line2[1][0];
                                                    var y1 = line1[0][1];
                                                    var y2 = line1[1][1];
                                                    var y3 = line2[0][1];
                                                    var y4 = line2[1][1];
                                                    if (!(Math.min(x1, x2) <= Math.max(x3, x4) && Math.min(y3, y4) <= Math.max(y1, y2) && Math.min(x3, x4) <= Math.max(x1, x2) && Math.min(y1, y2) <= Math.max(y3, y4))) return false;
                                                    else return true;
                                                };
                                                var line = [[x0, y0], [x1, y1]];
                                                if (xiangjiao(line, [[x0_card, y0_card], [x0_card, y1_card]]) == true) bool = true;
                                                if (xiangjiao(line, [[x0_card, y1_card], [x1_card, y1_card]]) == true) bool = true;
                                                if (xiangjiao(line, [[x1_card, y1_card], [x1_card, y0_card]]) == true) bool = true;
                                                if (xiangjiao(line, [[x1_card, y0_card], [x0_card, y0_card]]) == true) bool = true;
                                                if (bool) {
                                                    if (card.name == 'du') {
                                                        if (lib.config.background_speak) game.playAudio('skill', 'zhengjing_boom');
                                                        finish();
                                                    }
                                                    else {
                                                        if (lib.config.background_speak) game.playAudio('skill', 'zhengjing_click');
                                                        result[card.name] ??= 0;
                                                        result[card.name]++;
                                                    };
                                                    card.hadCut = true;
                                                    card.style.transition = 'all .3s';
                                                    card.style.transform = 'scale(1.5)';
                                                    card.style.opacity = 0;
                                                    setTimeout(() => card.delete(), 350);
                                                    clearInterval(interval1);
                                                };
                                            };
                                        };
                                    };
                                    if (dialog.parentNode == undefined) clearInterval(interval1);
                                }, 30);
                            };
                            interval = setInterval(() => {
                                if (!_status.paused2) {
                                    const num2 = [0, 1, 1, 1, 1, 2, 2, 3].randomGet();
                                    if (num2 > 0 && cards1.length) {
                                        for (let i = 0; i < num2; i++) {
                                            createCard(cards1.randomRemove());
                                            if (!cards1.length) {
                                                setTimeout(() => finish(), 3000);
                                                break;
                                            }
                                        };
                                    };
                                };
                            }, 650);
                            return dialog;
                        })(cardx);
                        event.switchToAuto = () => {
                            game.resume();
                            event._result = {};
                            for (const i in cardx) event._result[i] = cardx[i];
                            resolve(event._result);
                            _status.imchoosing = false;
                        };
                        _status.imchoosing = true;
                        game.pause();
                        game.countChoose();
                        return promise;
                    };
                    */
                    /*
                    第二版，自己写的优化，限定显示范围且拥有进度显示
                    const chooseButton = cardx => {
                        const { promise, resolve } = Promise.withResolvers(), event = _status.event;
                        event.dialog = (cards => {
                            let cards1 = [], lineList = [], pointList = [], pointNum = 0, result = {}, interval;
                            for (const i in cards) cards1 = cards1.concat(Array.from({ length: cards[i] }).map(() => i));
                            if (!cards1.length) cards1.push('sha');
                            const dialog = (event.dialog = ui.create.dialog('hidden'));
                            dialog.classList.add('popped');
                            dialog.classList.add('static');
                            dialog.style.position = 'fixed';
                            dialog.style.width = '75%';
                            dialog.style.height = '80%';
                            dialog.style.left = '50%';
                            dialog.style.top = '50%';
                            dialog.style.transform = 'translate(-50%, -50%)';
                            dialog.style.boxSizing = 'border-box';
                            dialog.style.overflow = 'hidden';
                            dialog.style['text-align'] = 'left';
                            dialog.style['background-color'] = 'rgba(0,0,0,0.45)';
                            dialog.style['border-radius'] = '12px';
                            dialog.style['box-shadow'] = '0 0 20px rgba(0,0,0,0.5)';
                            dialog.style.zIndex = '10';
                            ui.window.appendChild(dialog);
                            dialog.innerHTML = '';
                            const progressPanel = document.createElement('div');
                            progressPanel.style.position = 'absolute';
                            progressPanel.style.left = '0';
                            progressPanel.style.bottom = '0';
                            progressPanel.style.width = '100%';
                            progressPanel.style.height = '18%';
                            progressPanel.style.display = 'flex';
                            progressPanel.style.boxSizing = 'border-box';
                            progressPanel.style.background = 'rgba(0,0,0,0.65)';
                            progressPanel.style.borderTop = '2px solid rgba(255,255,255,0.5)';
                            progressPanel.style.zIndex = '10';
                            dialog.appendChild(progressPanel);
                            const progressData = {};
                            for (const name in cards) {
                                if (name == 'du') continue; const item = document.createElement('div');
                                item.style.flex = '1';
                                item.style.height = '100%';
                                item.style.position = 'relative';
                                item.style.boxSizing = 'border-box';
                                item.style.padding = '0 6px';
                                if (Object.keys(progressData).length > 0) item.style.borderLeft = '1px solid rgba(255,255,255,0.25)';
                                const nameText = document.createElement('div');
                                nameText.innerHTML = get.translation(name);
                                nameText.style.position = 'absolute';
                                nameText.style.top = '12%';
                                nameText.style.left = '0';
                                nameText.style.width = '100%';
                                nameText.style.textAlign = 'center';
                                nameText.style.color = '#ffffff';
                                nameText.style.fontSize = '18px';
                                nameText.style.fontWeight = 'bold';
                                nameText.style.textShadow = '0 1px 3px #000';
                                nameText.style.lineHeight = '1.2';
                                const progressOuter = document.createElement('div');
                                progressOuter.style.position = 'absolute';
                                progressOuter.style.left = '7.5%';
                                progressOuter.style.bottom = '28%';
                                progressOuter.style.width = '85%';
                                progressOuter.style.height = '10px';
                                progressOuter.style.boxSizing = 'border-box';
                                progressOuter.style.border = '1px solid rgba(255,255,255,0.7)';
                                progressOuter.style.borderRadius = '6px';
                                progressOuter.style.background = 'rgba(255,255,255,0.15)';
                                progressOuter.style.overflow = 'hidden';
                                const progressInner = document.createElement('div');
                                progressInner.style.width = '0%';
                                progressInner.style.height = '100%';
                                progressInner.style.borderRadius = '6px';
                                progressInner.style.background = 'linear-gradient(to right, #66ccff, #ffffff)';
                                progressInner.style.transition = 'width 0.15s';
                                progressOuter.appendChild(progressInner);
                                const progressText = document.createElement('div');
                                progressText.innerHTML = '0 / ' + cards[name];
                                progressText.style.position = 'absolute';
                                progressText.style.bottom = '8%';
                                progressText.style.left = '0';
                                progressText.style.width = '100%';
                                progressText.style.textAlign = 'center';
                                progressText.style.color = 'rgba(255,255,255,0.9)';
                                progressText.style.fontSize = '12px';
                                progressText.style.lineHeight = '16px';
                                item.appendChild(nameText);
                                item.appendChild(progressOuter);
                                item.appendChild(progressText);
                                progressPanel.appendChild(item);
                                progressData[name] = { item: item, inner: progressInner, text: progressText };
                            }
                            const updateProgress = name => {
                                const data = progressData[name];
                                if (!data) return;
                                const current = result[name] || 0;
                                const total = cards[name];
                                const percent = Math.min(100, (current / total) * 100);
                                data.inner.style.width = percent + '%';
                                data.text.innerHTML = current + ' / ' + total;
                                if (current >= total) {
                                    data.inner.style.width = '100%';
                                    data.inner.style.background = 'linear-gradient(to right, #66ff99, #ffffff)';
                                    data.text.style.color = '#66ff99';
                                }
                            };
                            const getGameScale = () => {
                                const widthScale = dialog.offsetWidth / (ui.window.offsetWidth || window.innerWidth);
                                const heightScale = dialog.offsetHeight / (ui.window.offsetHeight || window.innerHeight);
                                return Math.max(0.55, Math.min(1, widthScale, heightScale));
                            };
                            const getCardScale = () => {
                                return Math.max(0.55, Math.min(1, getGameScale() * 1.05));
                            };
                            const getDialogPoint = e => {
                                if (e.changedTouches) e = e.changedTouches[e.changedTouches.length - 1];
                                const rect = dialog.getBoundingClientRect();
                                const zoom = game.documentZoom || 1;
                                return [(e.clientX - rect.left) / zoom, (e.clientY - rect.top) / zoom];
                            };
                            const getAngle = (x1, y1, x2, y2) => {
                                var x = x1 - x2;
                                var y = y1 - y2;
                                var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
                                if (!z) return 0;
                                var cos = y / z;
                                var radina = Math.acos(cos);
                                var angle = 180 / (Math.PI / radina);
                                if (x2 > x1 && y2 === y1) angle = 0;
                                if (x2 > x1 && y2 < y1) angle = angle - 90;
                                if (x2 === x1 && y1 > y2) angle = -90;
                                if (x2 < x1 && y2 < y1) angle = 270 - angle;
                                if (x2 < x1 && y2 === y1) angle = 180;
                                if (x2 < x1 && y2 > y1) angle = 270 - angle;
                                if (x2 === x1 && y2 > y1) angle = 90;
                                if (x2 > x1 && y2 > y1) angle = angle - 90;
                                return angle;
                            };
                            const createLine = e => {
                                if (dialog.hadClicked == true) {
                                    const point = getDialogPoint(e);
                                    if (pointNum % 3 == 0) {
                                        pointList.push(point);
                                        if (pointList.length >= 2) {
                                            var point0 = pointList[pointList.length - 2];
                                            var point1 = pointList[pointList.length - 1];
                                            var x0 = point0[0];
                                            var y0 = point0[1];
                                            var x1 = point1[0];
                                            var y1 = point1[1];
                                            var div = document.createElement('div');
                                            div.style.zIndex = 20;
                                            div.style.borderRadius = '4px';
                                            div.style.position = 'absolute';
                                            div.style.background = '#ffffff';
                                            div.style.height = '4px';
                                            div.style.width = Math.pow(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2), 0.5) + 2 + 'px';
                                            div.style.left = x0 + 2 + 'px';
                                            div.style.top = y0 + 2 + 'px';
                                            div.style.transform = 'rotate(' + getAngle(x0, y0, x1, y1) + 'deg)';
                                            div.style['transform-origin'] = '0 50%';
                                            dialog.appendChild(div);
                                            lineList.push(div);
                                            if (lineList.length > 3) {
                                                var div1 = lineList[0];
                                                div1.style.transition = 'opacity 0.25s';
                                                div1.style.opacity = 0;
                                                setTimeout(() => {
                                                    if (div1.parentNode != undefined) div1.parentNode.removeChild(div1);
                                                }, 250);
                                                lineList.remove(lineList[0]);
                                                pointList[0] = 1;
                                                pointList.remove(pointList[0]);
                                            }
                                        }
                                    }
                                    pointNum++;
                                }
                            };
                            const clearLine = () => {
                                const deleteLine = () => {
                                    const div1 = lineList[0];
                                    if (!div1) return;
                                    div1.style.transition = 'opacity 0.25s';
                                    div1.style.opacity = 0;
                                    setTimeout(() => {
                                        if (div1.parentNode != undefined) div1.parentNode.removeChild(div1);
                                    }, 250);
                                    lineList.remove(lineList[0]);
                                    if (lineList.length > 0) deleteLine();
                                };
                                if (lineList.length > 0) deleteLine();
                                pointList = [];
                            };
                            dialog.addEventListener(lib.device ? 'touchstart' : 'mousedown', e => {
                                e.stopPropagation();
                                dialog.hadClicked = true;
                                pointNum = 0;
                            });
                            dialog.addEventListener(lib.device ? 'touchmove' : 'mousemove', createLine);
                            dialog.addEventListener(lib.device ? 'touchend' : 'mouseup', e => {
                                e.stopPropagation();
                                delete dialog.hadClicked;
                                clearLine();
                            });
                            const finish = () => {
                                clearInterval(interval);
                                _status.imchoosing = false;
                                event.dialog?.close();
                                event._result = result;
                                resolve(event._result);
                                game.resume();
                            };
                            const createCard = name => {
                                const gameScale = getGameScale();
                                const cardScale = getCardScale();
                                const availableWidth = Math.max(20, dialog.offsetWidth - 80 * cardScale);
                                const left = Math.random() * availableWidth + 20;
                                const card = ui.create.card(null, 'noclick', true);
                                card.init({ name: name });
                                if (name == 'du') card.style['box-shadow'] = 'rgba(0, 0, 0, 0.2) 0 0 0 1px,' + 'rgba(255, 0, 0, 0.4) 0 0 5px,' + 'rgba(255, 0, 0, 0.4) 0 0 12px,' + 'rgba(255, 0, 0, 0.8) 0 0 15px';
                                card.style['pointer-events'] = 'none';
                                card.style.position = 'absolute';
                                const playHeight = dialog.offsetHeight - progressPanel.offsetHeight;
                                card.style.top = playHeight - 5 + 'px';
                                card.style.left = left + 'px';
                                card.style.transition = 'opacity 0.25s';
                                card.style.opacity = 0;
                                card.style['transform-origin'] = 'center center';
                                card.style.transform = 'scale(' + cardScale + ')';
                                dialog.appendChild(card);
                                setTimeout(() => {
                                    if (card.parentNode) card.style.opacity = 1;
                                }, 10);
                                var t_x = 0;
                                var t_y = 0;
                                var s_x = 0;
                                var s_y = 0;
                                var s_y0 = 0;
                                var t_x_increase = 0;
                                var t_y_increase = 0.3 * gameScale;
                                var v_y = [90, 95, 100, 105, 110, 115, 105, 110, 115].randomGet() * gameScale;
                                var a_y = [9, 9.2, 9.4, 9.6, 9.8, 10, 10.2, 10.4, 10.6, 10.8, 11].randomGet() * gameScale;
                                var isMovingUp = true;
                                var cardLeft = card.offsetLeft;
                                var cardTop = card.offsetTop;
                                var num_x = 63;
                                if (v_y / gameScale == 90) num_x = 56;
                                else if (v_y / gameScale == 95) num_x = 60;
                                else if (v_y / gameScale == 100) num_x = 63;
                                else if (v_y / gameScale == 105) num_x = 67;
                                else if (v_y / gameScale == 110) num_x = 70;
                                else num_x = 74;
                                if ([true, false].randomGet()) {
                                    let s1 = dialog.offsetWidth - card.offsetWidth - left;
                                    t_x_increase = (s1 / num_x) * Math.random() * gameScale;
                                }
                                else {
                                    let s1 = left;
                                    t_x_increase = -(s1 / num_x) * Math.random() * gameScale;
                                }
                                const interval1 = setInterval(() => {
                                    if (!_status.paused2) {
                                        t_x += t_x_increase;
                                        s_x = t_x;
                                        card.style.left = cardLeft + s_x + 'px';
                                        t_y += t_y_increase;
                                        s_y = -(v_y * t_y - (a_y * Math.pow(t_y, 2)) / 2);
                                        s_x = t_x;
                                        card.style.top = cardTop + s_y + 'px';
                                        if (isMovingUp == true) {
                                            if (s_y - s_y0 > 0) isMovingUp = !isMovingUp;
                                            s_y0 = s_y;
                                        }
                                        const cardRect = card.getBoundingClientRect();
                                        const dialogRect = dialog.getBoundingClientRect();
                                        const cardLeftNow = (cardRect.left - dialogRect.left) / (game.documentZoom || 1);
                                        const cardTopNow = (cardRect.top - dialogRect.top) / (game.documentZoom || 1);
                                        const cardRightNow = (cardRect.right - dialogRect.left) / (game.documentZoom || 1);
                                        const cardBottomNow = (cardRect.bottom - dialogRect.top) / (game.documentZoom || 1);
                                        if (cardTopNow > progressPanel.offsetTop + 5 && isMovingUp == false && card.hadHide != true) {
                                            card.hadHide = true;
                                            card.style.transition = 'opacity .3s';
                                            card.style.opacity = 0;
                                            setTimeout(() => {
                                                card.delete();
                                                clearInterval(interval1);
                                            }, 350);
                                        }
                                        if (card.hadCut != true) {
                                            for (var i = 0; i < pointList.length; i++) {
                                                if (card.hadCut == true || pointList[i + 1] == undefined) continue;
                                                var point0 = pointList[i];
                                                var point1 = pointList[i + 1];
                                                var x0 = point0[0];
                                                var y0 = point0[1];
                                                var x1 = point1[0];
                                                var y1 = point1[1];
                                                var bool = false;
                                                var xiangjiao = function (line1, line2) {
                                                    var x1 = line1[0][0];
                                                    var x2 = line1[1][0];
                                                    var x3 = line2[0][0];
                                                    var x4 = line2[1][0];
                                                    var y1 = line1[0][1];
                                                    var y2 = line1[1][1];
                                                    var y3 = line2[0][1];
                                                    var y4 = line2[1][1];
                                                    if (!(Math.min(x1, x2) <= Math.max(x3, x4) && Math.min(y3, y4) <= Math.max(y1, y2) && Math.min(x3, x4) <= Math.max(x1, x2) && Math.min(y1, y2) <= Math.max(y3, y4))) return false;
                                                    return true;
                                                };
                                                var line = [[x0, y0], [x1, y1]];
                                                if (xiangjiao(line, [
                                                    [cardLeftNow, cardTopNow],
                                                    [cardLeftNow, cardBottomNow],
                                                ]) == true) bool = true;
                                                if (xiangjiao(line, [
                                                    [cardLeftNow, cardBottomNow],
                                                    [cardRightNow, cardBottomNow],
                                                ]) == true) bool = true;
                                                if (xiangjiao(line, [
                                                    [cardRightNow, cardBottomNow],
                                                    [cardRightNow, cardTopNow],
                                                ]) == true) bool = true;
                                                if (xiangjiao(line, [
                                                    [cardRightNow, cardTopNow],
                                                    [cardLeftNow, cardTopNow],
                                                ]) == true) bool = true;
                                                if (bool) {
                                                    if (card.name == 'du') {
                                                        if (lib.config.background_speak) {
                                                            game.playAudio('skill', 'zhengjing_boom');
                                                        }
                                                        finish();
                                                    }
                                                    else {
                                                        if (lib.config.background_speak) {
                                                            game.playAudio('skill', 'zhengjing_click');
                                                        }
                                                        result[card.name] ??= 0;
                                                        result[card.name]++;
                                                        updateProgress(card.name);
                                                    }
                                                    card.hadCut = true;
                                                    card.style.transition = 'all .3s';
                                                    card.style.transform = 'scale(' + cardScale * 1.5 + ')';
                                                    card.style.opacity = 0;
                                                    setTimeout(() => {
                                                        card.delete();
                                                    }, 350);
                                                    clearInterval(interval1);
                                                }
                                            }
                                        }
                                    }
                                    if (dialog.parentNode == undefined) {
                                        clearInterval(interval1);
                                    }
                                }, 30);
                            };
                            interval = setInterval(() => {
                                if (!_status.paused2) {
                                    const num2 = [0, 1, 1, 1, 1, 2, 2, 3].randomGet();
                                    if (num2 > 0 && cards1.length) {
                                        for (let i = 0; i < num2; i++) {
                                            createCard(cards1.randomRemove());

                                            if (!cards1.length) {
                                                setTimeout(() => finish(), 3000);
                                                break;
                                            }
                                        }
                                    }
                                }
                            }, 650);
                            return dialog;
                        })(cardx);
                        event.switchToAuto = () => {
                            _status.imchoosing = false;
                            event._result = {};
                            for (const i in cardx) {
                                event._result[i] = cardx[i];
                            }
                            resolve(event._result);
                            game.resume();
                        };
                        _status.imchoosing = true;
                        game.pause();
                        game.countChoose();
                        return promise;
                    };
                    */
                    //第三版，来自橙续缘《娱乐补丁》，进行适配
                    const chooseButton = cardx => {
                        const { promise, resolve } = Promise.withResolvers();
                        const event = _status.event;
                        event.dialog = (cards => {
                            let cards1 = [];
                            let result = {};
                            let items = [];
                            let interval = null;
                            let aiTimer = null;
                            let frameId = null;
                            let finished = false;
                            let resizeObserver = null;
                            let juices = [];
                            let finishTimer = null;
                            for (const name in cards) cards1 = cards1.concat(Array.from({ length: cards[name] }).map(() => name));
                            if (!cards1.length) {
                                resolve({ bool: false });
                                return null;
                            }
                            const baseWidth = 700;
                            const baseHeight = 450;
                            const canvasWidth = 650;
                            const canvasHeight = 345;
                            const dialog = (event.dialog = ui.create.dialog('hidden'));
                            dialog.classList.add('popped');
                            dialog.classList.add('static');
                            dialog.style.position = 'fixed';
                            dialog.style.width = '80%';
                            dialog.style.height = '80%';
                            dialog.style.left = '50%';
                            dialog.style.top = '50%';
                            dialog.style.transform = 'translate(-50%, -50%)';
                            dialog.style.padding = '0';
                            dialog.style.margin = '0';
                            dialog.style.background = 'transparent';
                            dialog.style.border = 'none';
                            dialog.style.boxShadow = 'none';
                            dialog.style.overflow = 'hidden';
                            dialog.style.textAlign = 'left';
                            dialog.style.zIndex = '10';
                            ui.window.appendChild(dialog);
                            dialog.innerHTML = '';
                            const container = document.createElement('div');
                            container.style.position = 'absolute';
                            container.style.width = baseWidth + 'px';
                            container.style.height = baseHeight + 'px';
                            container.style.left = '50%';
                            container.style.top = '50%';
                            container.style.backgroundColor = '#bb936f';
                            container.style.borderRadius = '4px';
                            container.style.boxSizing = 'border-box';
                            container.style.transformOrigin = 'center center';
                            dialog.appendChild(container);
                            const updateScale = () => {
                                if (!dialog.parentNode) return;
                                const scaleX = dialog.clientWidth / baseWidth;
                                const scaleY = dialog.clientHeight / baseHeight;
                                const scale = Math.min(scaleX, scaleY);
                                container.style.transform = 'translate(-50%, -50%) scale(' + scale + ')';
                                dialog.gameScale = scale;
                            };
                            updateScale();
                            if (typeof ResizeObserver !== 'undefined') {
                                resizeObserver = new ResizeObserver(updateScale);
                                resizeObserver.observe(dialog);
                            } else {
                                window.addEventListener('resize', updateScale);
                            }
                            const frame = document.createElement('div');
                            frame.style.position = 'absolute';
                            frame.style.width = '670px';
                            frame.style.height = '400px';
                            frame.style.left = '15px';
                            frame.style.top = '15px';
                            frame.style.boxSizing = 'border-box';
                            frame.style.border = '1px solid #c6aa8f';
                            frame.style.borderRadius = '4px';
                            container.appendChild(frame);
                            const canvas = document.createElement('canvas');
                            canvas.width = canvasWidth;
                            canvas.height = canvasHeight;
                            canvas.style.position = 'absolute';
                            canvas.style.width = canvasWidth + 'px';
                            canvas.style.height = canvasHeight + 'px';
                            canvas.style.left = '25px';
                            canvas.style.top = '20px';
                            canvas.style.zIndex = '10';
                            canvas.style.borderRadius = '4px';
                            container.appendChild(canvas);
                            const ctx = canvas.getContext('2d');
                            ctx.fillStyle = '#c6aa8f';
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                            const processNode = document.createElement('div');
                            processNode.style.position = 'absolute';
                            processNode.style.width = '700px';
                            processNode.style.height = '50px';
                            processNode.style.left = '0';
                            processNode.style.bottom = '15px';
                            processNode.style.padding = '0 7.5px';
                            processNode.style.boxSizing = 'border-box';
                            processNode.style.zIndex = '20';
                            container.appendChild(processNode);
                            const process = {};
                            const processNames = Object.keys(cards).filter(name => name !== 'du');
                            for (const name of processNames) {
                                const item = document.createElement('div');
                                item.style.width = 100 / processNames.length + '%';
                                item.style.height = '50px';
                                item.style.float = 'left';
                                item.style.boxSizing = 'border-box';
                                item.style.padding = '0 7.5px';
                                item.style.position = 'relative';
                                const card = document.createElement('div');
                                card.style.width = '100%';
                                card.style.height = '50px';
                                card.style.backgroundColor = '#d2aa6e';
                                card.style.border = '2px solid #bb936f';
                                card.style.borderRadius = '4px';
                                card.style.position = 'relative';
                                card.style.boxSizing = 'border-box';
                                const cardName = document.createElement('div');
                                cardName.innerHTML = get.translation(name);
                                cardName.style.position = 'absolute';
                                cardName.style.width = '100%';
                                cardName.style.height = '40px';
                                cardName.style.left = '0';
                                cardName.style.top = '0';
                                cardName.style.lineHeight = '40px';
                                cardName.style.textAlign = 'center';
                                cardName.style.color = '#000';
                                cardName.style.fontFamily = 'xinwei';
                                cardName.style.fontSize = '20px';
                                cardName.style.whiteSpace = 'nowrap';
                                cardName.style.overflow = 'hidden';
                                cardName.style.textOverflow = 'ellipsis';
                                const probar = document.createElement('div');
                                probar.style.position = 'absolute';
                                probar.style.width = 'calc(100% - 10px)';
                                probar.style.height = '5px';
                                probar.style.left = '5px';
                                probar.style.bottom = '2.5px';
                                probar.style.borderRadius = '5px';
                                probar.style.overflow = 'hidden';
                                probar.style.backgroundColor = '#1e281a';
                                const probarSpan = document.createElement('div');
                                probarSpan.style.position = 'absolute';
                                probarSpan.style.width = '0%';
                                probarSpan.style.height = '5px';
                                probarSpan.style.left = '0';
                                probarSpan.style.top = '0';
                                probarSpan.style.borderRadius = '5px';
                                probarSpan.style.backgroundColor = '#ff773f';
                                probarSpan.style.transition = 'width .15s';
                                probar.appendChild(probarSpan);
                                card.appendChild(cardName);
                                card.appendChild(probar);
                                item.appendChild(card);
                                processNode.appendChild(item);
                                process[name] = {
                                    node: item,
                                    bar: probarSpan,
                                    current: 0,
                                    total: cards[name],
                                };
                            }
                            let mouse = null;
                            let lastMouse = null;
                            const getPoint = e => {
                                if (e.changedTouches) {
                                    e = e.changedTouches[e.changedTouches.length - 1];
                                }
                                const rect = canvas.getBoundingClientRect();
                                return {
                                    x: (e.clientX - rect.left) * (canvas.width / rect.width),
                                    y: (e.clientY - rect.top) * (canvas.height / rect.height),
                                };
                            };
                            const onMove = e => {
                                const point = getPoint(e);
                                if (mouse) {
                                    lastMouse = mouse;
                                }
                                mouse = point;
                            };
                            const onCancel = () => {
                                mouse = null;
                                lastMouse = null;
                            };
                            if (lib.device) {
                                canvas.addEventListener('touchmove', onMove, {
                                    passive: true,
                                });
                                canvas.addEventListener('touchend', onCancel);
                                canvas.addEventListener('touchcancel', onCancel);
                            } else {
                                canvas.addEventListener('mousemove', onMove);
                                canvas.addEventListener('mouseup', onCancel);
                                canvas.addEventListener('mouseleave', onCancel);
                            }
                            const drawLine = () => {
                                if (!mouse || !lastMouse) return;
                                const gradient = ctx.createLinearGradient(lastMouse.x, lastMouse.y, mouse.x, mouse.y);
                                gradient.addColorStop(0, '#c4ebf5');
                                gradient.addColorStop(1, '#6bbcd1');
                                ctx.beginPath();
                                ctx.moveTo(lastMouse.x, lastMouse.y);
                                ctx.lineTo(mouse.x, mouse.y);
                                ctx.strokeStyle = gradient;
                                ctx.lineCap = 'round';
                                ctx.lineWidth = 4;
                                ctx.stroke();
                                setTimeout(onCancel, 0);
                            };
                            const distance = (x1, y1, x2, y2) => {
                                return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
                            };
                            const checkCollision = (x, y, radius) => {
                                if (!mouse || !lastMouse) {
                                    return false;
                                }
                                const a = distance(x, y, mouse.x, mouse.y);
                                const b = distance(x, y, lastMouse.x, lastMouse.y);
                                const c = distance(mouse.x, mouse.y, lastMouse.x, lastMouse.y);
                                if (!c) return false;
                                const p = (a + b + c) / 2;
                                const s = Math.sqrt(Math.max(0, p * (p - a) * (p - b) * (p - c)));
                                const h = (2 * s) / c;
                                if (h >= radius) {
                                    return false;
                                }
                                if (a < radius || b < radius) {
                                    return true;
                                }
                                const d1 = mouse.x - x;
                                const d2 = lastMouse.x - x;
                                return (d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0);
                            };
                            const size = 76;
                            const juiceImage = new Image();
                            juiceImage.src = lib.assetURL + 'extension/活动武将/image/card/qsg_juice.png';
                            const createItem = name => {
                                const item = {
                                    id: name,
                                    left: get.rand(2 * size, canvas.width - 2 * size),
                                    bottom: 0,
                                    speed: get.rand(3, 5),
                                    direct: get.rand(70, 110),
                                    acceleration: get.rand(2, 3),
                                    name: name === 'du' ? '炸弹' : get.translation(name),
                                    isBomb: name === 'du',
                                    hadCut: false,
                                };
                                items.push(item);
                            };
                            const handler = item => {
                                if (item.isBomb) {
                                    finish(true);
                                    return;
                                }
                                if (finishTimer) {
                                    clearTimeout(finishTimer);
                                    finishTimer = null;
                                }
                                if (lib.config.background_speak) game.playAudio({ path: '../extension/活动武将/audio/effect/splatter' });
                                result[item.id] ??= 0;
                                result[item.id]++;
                                const data = process[item.id];
                                if (!data) return;
                                data.current = result[item.id];
                                data.bar.style.width = Math.min(100, (data.current / data.total) * 100) + '%';
                                if (data.current >= data.total) {
                                    data.bar.style.backgroundColor = '#6fbd63';
                                }
                                juices.push({
                                    x: item.left,
                                    y: canvas.height - item.bottom - size,
                                    size: size,
                                    time: Date.now(),
                                });
                                let complete = true;
                                for (const name of processNames) {
                                    if ((result[name] || 0) < cards[name]) {
                                        complete = false;
                                        break;
                                    }
                                }
                                if (complete && !finishTimer) finishTimer = setTimeout(finish, 2000);
                            };
                            const finish = boom => {
                                if (finished) return;
                                finished = true;
                                juices.length = 0;
                                if (interval) {
                                    clearInterval(interval);
                                    interval = null;
                                }
                                if (aiTimer) {
                                    clearInterval(aiTimer);
                                    aiTimer = null;
                                }
                                if (frameId) {
                                    cancelAnimationFrame(frameId);
                                    frameId = null;
                                }
                                if (resizeObserver) {
                                    resizeObserver.disconnect();
                                    resizeObserver = null;
                                } else {
                                    window.removeEventListener('resize', updateScale);
                                }
                                canvas.removeEventListener('touchmove', onMove);
                                canvas.removeEventListener('touchend', onCancel);
                                canvas.removeEventListener('touchcancel', onCancel);
                                canvas.removeEventListener('mousemove', onMove);
                                canvas.removeEventListener('mouseup', onCancel);
                                canvas.removeEventListener('mouseleave', onCancel);
                                const close = () => {
                                    _status.imchoosing = false;
                                    event.dialog?.close();
                                    event._result = result;
                                    game.resume();
                                    resolve(result);
                                };
                                if (boom && lib.config.background_speak) {
                                    game.playAudio({
                                        path: '../extension/活动武将/audio/effect/boom',
                                        onEnded: close,
                                    });
                                }
                                else close();
                            };
                            const render = () => {
                                if (finished) return;
                                ctx.clearRect(0, 0, canvas.width, canvas.height);
                                ctx.fillStyle = '#c6aa8f';
                                ctx.fillRect(0, 0, canvas.width, canvas.height);
                                drawLine();
                                const scale = dialog.gameScale || 1;
                                const physicsScale = Math.max(0.55, Math.min(1, scale));
                                for (let i = items.length - 1; i >= 0; i--) {
                                    const item = items[i];
                                    if (item.hadCut) {
                                        items.splice(i, 1);
                                        continue;
                                    }
                                    item.speed -= item.acceleration * physicsScale * 0.0167;
                                    item.bottom += item.speed * Math.sin((item.direct * 2 * Math.PI) / 360) * physicsScale;
                                    item.left += Math.abs(item.speed) * Math.cos((item.direct * 2 * Math.PI) / 360) * physicsScale;
                                    const radius = size / 2;
                                    const x = item.left + radius;
                                    const y = canvas.height - item.bottom - size + radius;
                                    if (item.bottom + size < 0) {
                                        items.splice(i, 1);
                                        continue;
                                    }
                                    if (checkCollision(x, y, radius)) {
                                        item.hadCut = true;
                                        handler(item);
                                        items.splice(i, 1);
                                        if (finished) {
                                            return;
                                        }
                                        continue;
                                    }
                                    ctx.beginPath();
                                    ctx.fillStyle = item.isBomb ? 'rgba(0,0,0,.6)' : 'rgba(255,255,255,.6)';
                                    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
                                    ctx.fill();
                                    ctx.beginPath();
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillStyle = item.isBomb ? '#fff' : '#000';
                                    ctx.font = '20px lishu';
                                    ctx.fillText(item.name, x, y, size - 10);
                                }
                                const now = Date.now();
                                for (let i = juices.length - 1; i >= 0; i--) {
                                    const juice = juices[i];
                                    if (now - juice.time >= 1000) {
                                        juices.splice(i, 1);
                                        continue;
                                    }
                                    if (juiceImage.complete) {
                                        ctx.drawImage(juiceImage, juice.x, juice.y, juice.size, juice.size);
                                    }
                                }
                                if (!cards1.length && !items.length && !finished) {
                                    setTimeout(finish, 1000);
                                    return;
                                }
                                frameId = requestAnimationFrame(render);
                            };
                            const totalCount = cards1.length;
                            const spawnDelay = Math.max(180, Math.min(650, Math.floor(9000 / Math.max(1, totalCount))));
                            interval = setInterval(() => {
                                if (finished) return;
                                if (_status.paused2) {
                                    return;
                                }
                                const num = [0, 1, 1, 1, 1, 2].randomGet();
                                for (let i = 0; i < num; i++) {
                                    if (!cards1.length) {
                                        break;
                                    }
                                    createItem(cards1.randomRemove());
                                }
                            }, spawnDelay);
                            aiTimer = setInterval(() => {
                                if (finished) {
                                    clearInterval(aiTimer);
                                    return;
                                }
                                for (let i = items.length - 1; i >= 0; i--) {
                                    const item = items[i];
                                    if (item.isBomb || item.hadCut) {
                                        continue;
                                    }
                                    const djl = get.rand(10) > 4;
                                    if (djl && typeof event.ai === 'function' && event.ai(item.id)) {
                                        item.hadCut = true;
                                        handler(item);
                                        items.splice(i, 1);
                                        if (finished) {
                                            return;
                                        }
                                    }
                                }
                            }, 200);
                            event.switchToAuto = () => {
                                if (finished) return;
                                finished = true;
                                juices.length = 0;
                                if (interval) {
                                    clearInterval(interval);
                                    interval = null;
                                }
                                if (aiTimer) {
                                    clearInterval(aiTimer);
                                    aiTimer = null;
                                }
                                if (frameId) {
                                    cancelAnimationFrame(frameId);
                                    frameId = null;
                                }
                                if (resizeObserver) {
                                    resizeObserver.disconnect();
                                    resizeObserver = null;
                                } else {
                                    window.removeEventListener('resize', updateScale);
                                }
                                canvas.removeEventListener('touchmove', onMove);
                                canvas.removeEventListener('touchend', onCancel);
                                canvas.removeEventListener('touchcancel', onCancel);
                                canvas.removeEventListener('mousemove', onMove);
                                canvas.removeEventListener('mouseup', onCancel);
                                canvas.removeEventListener('mouseleave', onCancel);
                                _status.imchoosing = false;
                                event._result = {};
                                for (const name in cards) {
                                    event._result[name] = cards[name];
                                }
                                if (event.dialog) {
                                    event.dialog.close();
                                }
                                game.resume();
                                resolve(event._result);
                            };
                            _status.imchoosing = true;
                            game.pause();
                            game.countChoose();
                            render();
                            return dialog;
                        })(cardx);
                        return promise;
                    };
                    game.broadcastAll(createDialog, player, event.videoId);
                    let next;
                    if (event.isMine()) next = chooseButton(cardx);
                    else if (event.isOnline()) {
                        const { promise, resolve } = Promise.withResolvers();
                        event.player.send(chooseButton, cardx);
                        event.player.wait(async result => {
                            if (result == "ai") result = await switchToAuto();
                            resolve(result);
                        });
                        game.pause();
                        next = promise;
                    }
                    else next = switchToAuto();
                    const result = await next;
                    game.broadcastAll((id, time) => {
                        if (_status.connectMode) lib.configOL.choose_timeout = time;
                        const dialog = get.idDialog(id);
                        if (dialog) dialog.close();
                    }, event.videoId, event.time);
                    for (let i = 0; i < cards.length; i++) {
                        if (!result?.[cards[i].name] || result[cards[i].name] < num) cards.splice(i--, 1);
                    }
                    if (!cards.length) {
                        game.log(player, '并没有整理出经典');
                        player.popup('杯具');
                        await game.delayx();
                        return event.finish();
                    }
                    player.popup('洗具');
                    game.broadcastAll(() => {
                        if (lib.config.background_speak) game.playAudio('skill', 'zhengjing_finish');
                    });
                    await player.showCards(cards, get.translation(player) + '整理出了以下经典');
                    await game.cardsGotoOrdering(cards);
                    const result2 = await player.chooseTarget('整经：请选择一名角色', '将整理出的经典（' + get.translation(cards) + '）置于其武将牌上', true).set('ai', target => {
                        const player = get.player();
                        if (target.hasSkill('xinfu_pdgyingshi')) return 0;
                        return -get.attitude(player, target);
                    }).forResult();
                    if (result2?.bool && result2.targets?.length) {
                        const target = result2.targets[0];
                        player.line(target, 'thunder');
                        let result3;
                        if (cards.length === 1) result3 = { bool: true, moved: [cards, []] };
                        else {
                            const next2 = player.chooseToMove('整经：请分配整理出的经典', true);
                            next2.set('list', [
                                ['置于' + get.translation(target) + '的武将牌上', cards],
                                ['自己获得'],
                            ]);
                            next2.set('filterMove', function (from, to, moved) {
                                if (moved[0].length == 1 && to == 1 && from.link == moved[0][0]) return false;
                                return true;
                            });
                            next2.set('filterOk', function (moved) {
                                return moved[0].length > 0;
                            });
                            next2.set('processAI', function (list) {
                                var cards = list[0][1].slice(0).sort(function (a, b) {
                                    return get.value(a) - get.value(b);
                                });
                                return [cards.splice(0, 1), cards];
                            });
                            result3 = await next2.forResult();
                        }
                        if (result3.bool) {
                            const [puts, gains] = result3.moved;
                            target.addSkill('zhengjing2');
                            const next3 = target.addToExpansion(puts, 'gain2');
                            next3.gaintag.add('zhengjing2');
                            await next3;
                            if (gains.length) await player.gain(gains, 'gain2');
                        }
                    }
                },
            },
            //SP许攸
            bilibili_fushi: {
                derivation: ['bilibili_zezhu', 'bilibili_chenggong'],
                trigger: {
                    player: 'enterGame',
                    global: ['dieAfter', 'changeSkillsAfter', 'changeGroupAfter', 'phaseBefore', 'showCharacterAfter'],
                },
                filter(event, player) {
                    switch (event.name) {
                        case 'die':
                            if (event.name === 'die' && !['wei', 'qun'].includes(event.player.group)) return false;
                            break;
                        case 'changeSkills':
                            if (event.name === 'changeSkills' && !event.addSkill.includes('bilibili_shicai')) return false;
                            break;
                        case 'changeGroup':
                            if (event.name === 'changeGroup' && (event.originGroup === event.group || [event.originGroup, event.group].every(i => !['wei', 'qun'].includes(i)))) return false;
                            break;
                        case 'phase':
                            if (game.phaseNumber > 0) return false;
                            break;
                        case 'showCharacter':
                            if (get.mode() === 'guozhan' && !['wei', 'qun'].includes(event.player.identity)) return false;
                            break;
                    }
                    let weis = 0, quns = 0, group = get.mode() === 'guozhan' ? 'identity' : 'group';
                    game.countPlayer(i => {
                        if (i[group] == 'wei') weis++;
                        if (i[group] == 'qun') quns++;
                    });
                    const skills = player.additionalSkills.bilibili_fushi;
                    if ((weis === quns) === (Array.isArray(skills) && skills.length > 0)) return true;
                    if (quns > weis && !skills.includes('bilibili_zezhu')) return true;
                    if (weis > quns && !skills.includes('bilibili_chenggong')) return true;
                    return false;
                },
                noHidden: true,
                forced: true,
                content() {
                    let weis = 0, quns = 0, group = get.mode() === 'guozhan' ? 'identity' : 'group';
                    game.countPlayer(i => {
                        if (i[group] == 'wei') weis++;
                        if (i[group] == 'qun') quns++;
                    });
                    const skills = player.additionalSkills.bilibili_fushi;
                    if (skills?.length) {
                        if (weis > quns && !skills.includes('bilibili_chenggong')) player.addAdditionalSkills('bilibili_fushi', ['bilibili_chenggong']);
                        else if (quns > weis && !skills.includes('bilibili_zezhu')) player.addAdditionalSkills('bilibili_fushi', ['bilibili_zezhu']);
                        else player.removeAdditionalSkill('bilibili_fushi');
                    }
                    else {
                        if (weis > quns) player.addAdditionalSkills('bilibili_fushi', ['bilibili_chenggong']);
                        if (quns > weis) player.addAdditionalSkills('bilibili_fushi', ['bilibili_zezhu']);
                    }
                },
            },
            bilibili_chenggong: {
                audio: 'chenggong',
                trigger: { global: 'useCardToPlayered' },
                filter(event, player) {
                    if (!event.isFirstTarget) return false;
                    return event.targets.length > 1;
                },
                logTarget: 'player',
                check(event, player) {
                    return get.attitude(player, event.player) > 0;
                },
                content() {
                    trigger.player.draw();
                },
            },
            bilibili_zezhu: {
                audio: 'zezhu',
                enable: 'phaseUse',
                filterTarget: lib.filter.notMe,
                selectTarget: [1, 2],
                multitarget: true,
                multiline: true,
                usable: 1,
                async content(event, trigger, player) {
                    const targets = [...event.targets].sortBySeat();
                    for (let num = 1; num <= 2; num++) {
                        for (const target of targets) {
                            if (num === 1) {
                                const result = await player.gainPlayerCard('he', target, true).forResult();
                                if (!result?.bool || !result.cards?.length) await player.draw();
                            }
                            else await player.chooseToGive(target, 'he', true);
                        }
                    }
                },
                ai: {
                    order: 7,
                    result: {
                        player(player, target) {
                            if (!target.countGainableCards(player, 'he')) return get.effect(target, { name: 'draw' }, player, player);
                            return get.effect(target, { name: 'shunshou_copy2' }, player, player);
                        },
                    },
                },
            },
            bilibili_jinfan: {
                group: 'bilibili_jinfan_buff',
                audio: 'gnjinfan',
                trigger: { player: 'phaseDiscardBegin' },
                filter(event, player) {
                    const cards = player.getExpansions('bilibili_jinfan');
                    return player.hasCard(card => {
                        if (_status.connectMode && get.position(card) === 'h') return true;
                        const suit = get.suit(card);
                        return !cards.some(cardx => get.suit(cardx) === suit);
                    }, 'he');
                },
                forced: true,
                content() {
                    'step 0'
                    player.chooseCard('锦帆：请选择一张牌', '将一张牌作为“铃”置于武将牌上', function (card, player) {
                        const suit = get.suit(card);
                        const cards = player.getExpansions('bilibili_jinfan');
                        return !cards.some(cardx => get.suit(cardx) === suit);
                    }, 'he', true);
                    'step 1'
                    if (result.bool) player.addToExpansion(result.cards, player, 'give').gaintag.add('bilibili_jinfan');
                },
                marktext: '铃',
                intro: {
                    content: 'expansion',
                    markcount: 'expansion',
                },
                onremove(player, skill) {
                    const cards = player.getExpansions(skill);
                    if (cards.length) player.loseToDiscardpile(cards);
                },
                ai: {
                    effect: {
                        player(card, player) {
                            const suit = get.suit(card);
                            if (player.getStorage('bilibili_jinfan_used').includes(suit)) return;
                            const cards = player.getExpansions('bilibili_jinfan');
                            if (cards.some(cardx => get.suit(cardx) === suit)) return [1, 1];
                        },
                    },
                },
                subSkill: {
                    buff: {
                        audio: 'gnjinfan',
                        trigger: { player: ['useCard', 'respond'] },
                        filter(event, player) {
                            const suit = get.suit(event.card);
                            if (player.getStorage('bilibili_jinfan_used').includes(suit)) return false;
                            const cards = player.getExpansions('bilibili_jinfan');
                            return cards.some(cardx => get.suit(cardx) === suit);
                        },
                        forced: true,
                        content() {
                            player.addTempSkill('bilibili_jinfan_used');
                            player.markAuto('bilibili_jinfan_used', [get.suit(trigger.card)]);
                            player.draw();
                        },
                    },
                    used: {
                        charlotte: true,
                        onremove: true,
                    },
                },
            },
            bilibili_sheque: {
                audio: 'gnsheque',
                trigger: { global: 'useCard' },
                filter(event, player) {
                    return event.player != player && get.type(event.card) == 'equip' && player.countCards('hs', function (card) {
                        return player.canUse(get.autoViewAs({ name: 'sha' }, [card]), event.player, false);
                    });
                },
                direct: true,
                clearTime: true,
                async content(event, trigger, player) {
                    const target = trigger.player;
                    const next = player.chooseToUse();
                    next.set('openskilldialog', '射却：是否将一张手牌当作【杀】对' + get.translation(target) + '使用？');
                    next.set('norestore', true);
                    next.set('_backupevent', `${event.name}_backup`);
                    next.set('custom', {
                        add: {},
                        replace: { window() { } },
                    });
                    next.backup(`${event.name}_backup`);
                    next.set('targetRequired', true);
                    next.set('complexTarget', true);
                    next.set('complexSelect', true);
                    next.set('filterTarget', function (card, player, target) {
                        if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
                        return lib.filter.targetEnabled.apply(this, arguments);
                    });
                    next.set('sourcex', target);
                    next.set('addCount', false);
                    next.set('logSkill', event.name);
                    await next;
                    if (target.hasHistory('damage', evt => evt.getParent(3) == next)) target.addTempSkill('drlt_wanglie2');
                },
                subSkill: {
                    backup: {
                        viewAs: { name: 'sha' },
                        filterCard(card) {
                            return get.itemtype(card) == 'card';
                        },
                        position: 'hs',
                        selectCard: 1,
                        check(card) {
                            return 5 - get.value(card);
                        },
                        log: false,
                    }
                }
            },
            //国战左慈
            gz_huashen: {
                audio: 'ext:活动武将/audio/skill:2',
                trigger: { player: 'phaseZhunbeiBegin' },
                async cost(event, trigger, player) {
                    const skill = event.skill, info = lib.skill[skill], storage = player.getStorage(skill);
                    if (storage.length < 2) {
                        const characters = info.getCharacter(player).randomGets(5);
                        const result = await player.chooseButton([
                            get.prompt(skill),
                            '<div class="text center">选择至多两张武将牌作为“化身”牌</div>',
                            [characters, info.$createButton],
                        ], [1, 2]).set('ai', button => get.rank(button.link, true)).forResult();
                        if (result?.bool && result.links?.length) event.result = { bool: true, cost_data: [result.links, 'gain'] };
                    }
                    else {
                        const result = await player.chooseButton([
                            get.prompt(skill),
                            '<div class="text center">替换一张“化身”牌</div>',
                            [storage, info.$createButton],
                        ]).set('ai', button => 7 - get.rank(button.link, true)).forResult();
                        if (result?.bool && result.links?.length) event.result = { bool: true, cost_data: [result.links, 'put'] };
                    }
                },
                async content(event, trigger, player) {
                    const [links, method] = event.cost_data;
                    const skill = event.name, info = lib.skill[skill];
                    if (method === 'gain') info.addVisitors(links, player);
                    else {
                        info.removeVisitors(links, player);
                        const characters = info.getCharacter(player).randomGets(1);
                        if (characters.length > 0) info.addVisitors(characters, player);
                    }
                    await game.delayx();
                },
                //ai:{threaten:5},
                $createButton(item, type, position, noclick, node, player) {
                    node = ui.create.buttonPresets.character(item, 'character', position, noclick);
                    const info = lib.character[item];
                    const skills = (info.skills ?? []).filter(function (skill) {
                        var info = get.info(skill);
                        return !get.skillCategoriesOf(skill, player).length && info && (!info.unique || info.gainable);
                    });
                    if (skills.length) {
                        const skillstr = skills.map(i => `[${get.translation(i)}]`).join('<br>');
                        const skillnode = ui.create.caption(`<div class="text" data-nature=${get.groupnature(info[1], 'raw')}m style="font-family: ${(lib.config.name_font || 'xinwei')},xinwei">${skillstr}</div>`, node);
                        skillnode.style.left = '2px';
                        skillnode.style.bottom = '2px';
                    }
                    node._customintro = function (uiintro, evt) {
                        const character = node.link, characterInfo = get.character(node.link);
                        let capt = get.translation(character);
                        if (characterInfo) {
                            capt += `&nbsp;&nbsp;${get.translation(characterInfo[0])}`;
                            let charactergroup;
                            const charactergroups = get.is.double(character, true);
                            if (charactergroups) charactergroup = charactergroups.map(i => get.translation(i)).join('/');
                            else charactergroup = get.translation(characterInfo[1]);
                            capt += `&nbsp;&nbsp;${charactergroup}`;
                        }
                        uiintro.add(capt);
                        if (lib.characterTitle[node.link]) uiintro.addText(get.colorspan(lib.characterTitle[node.link]));
                        for (let i = 0; i < skills.length; i++) {
                            if (lib.translate[skills[i] + '_info']) {
                                let translation = lib.translate[skills[i] + '_ab'] || get.translation(skills[i]).slice(0, 2);
                                if (lib.skill[skills[i]] && lib.skill[skills[i]].nobracket) uiintro.add('<div><div class="skilln">' + get.translation(skills[i]) + '</div><div>' + get.skillInfoTranslation(skills[i]) + '</div></div>');
                                else uiintro.add('<div><div class="skill">【' + translation + '】</div><div>' + get.skillInfoTranslation(skills[i]) + '</div></div>');
                                if (lib.translate[skills[i] + '_append']) uiintro._place_text = uiintro.add('<div class="text">' + lib.translate[skills[i] + '_append'] + '</div>');
                            }
                        }
                    }
                    return node;
                },
                getCharacter(player) {
                    if (!_status.characterlist) lib.skill.pingjian.initList();
                    return _status.characterlist.filter(name => {
                        if (name.includes('zuoci') || name.includes('xushao')) return false;
                        return lib.character[name]?.skills?.some(skill => {
                            const info = get.info(skill);
                            return !get.skillCategoriesOf(skill, player).length && info && (!info.unique || info.gainable);
                        });
                    });
                },
                getSkills(characters, player) {
                    let skills = [];
                    characters.forEach(name => {
                        if (Array.isArray(lib.character[name]?.skills)) {
                            const skillx = lib.character[name].skills.filter(skill => {
                                const info = get.info(skill);
                                return info && !get.skillCategoriesOf(skill, player).length && (!info.unique || info.gainable);
                            });
                            if (skillx.length) {
                                skills.addArray(skillx);
                                game.broadcastAll((player, name) => player.tempname.add(name), player, name);
                            }
                        }
                    });
                    return skills;
                },
                addVisitors(characters, player) {
                    player.addSkillBlocker('gz_huashen');
                    game.log(player, '获得了' + get.cnNumber(characters.length) + '张', '#g“化身”');
                    game.broadcastAll(function (player, list) {
                        var cards = [];
                        for (var card of list) {
                            var cardname = 'huashen_card_' + card;
                            lib.card[cardname] = {
                                fullimage: true,
                                image: player.isUnderControl(true) ? 'character:' + card : 'ext:活动武将/image/card/huashen_unknown.jpg'
                            };
                            lib.translate[cardname] = player.isUnderControl(true) ? get.rawName2(card) : ' ';
                            cards.push(game.createCard(cardname, '', ''));
                        }
                        player.$draw(cards, 'nobroadcast');
                    }, player, characters);
                    player.markAuto('gz_huashen', characters);
                    var storage = player.getStorage('gz_huashen');
                    var skills = lib.skill.gz_huashen.getSkills(storage, player);
                    player.addInvisibleSkill(skills);
                },
                removeVisitors(characters, player) {
                    if (!characters.length) return;
                    game.log(player, '移去了', '#g“化身”', '#y' + get.translation(characters));
                    game.broadcastAll(function (player, names) {
                        player.tempname.removeArray(names);
                    }, player, characters);
                    game.broadcastAll(function (player, list) {
                        var cards = [];
                        for (var card of list) {
                            var cardname = 'huashen_card_' + card;
                            lib.card[cardname] = {
                                fullimage: true,
                                image: 'character:' + card
                            };
                            lib.translate[cardname] = get.rawName2(card);
                            cards.push(game.createCard(cardname, '', ''));
                        }
                        player.$throw(cards, 'nobroadcast');
                    }, player, characters);
                    var skills = lib.skill.gz_huashen.getSkills(characters, player);
                    var characters2 = player.getStorage('gz_huashen').slice(0);
                    characters2.removeArray(characters);
                    skills.removeArray(lib.skill.gz_huashen.getSkills(characters2, player));
                    player.unmarkAuto('gz_huashen', characters);
                    _status.characterlist.addArray(characters);
                    player.removeInvisibleSkill(skills);
                },
                onremove(player, skill) {
                    lib.skill.gz_huashen.removeVisitors(player.getStorage(skill), player);
                    player.removeSkillBlocker('gz_huashen');
                },
                skillBlocker(skill, player) {
                    if (!player.invisibleSkills.includes(skill) || skill == 'gz_huashen') return false;
                    player.removeSkillBlocker('gz_huashen');
                    const bool = !player.hasSkill('gz_huashen');
                    player.addSkillBlocker('gz_huashen');
                    return bool;
                },
                intro: {
                    mark(dialog, storage, player) {
                        if (!storage || !storage.length) return '当前没有“化身”';
                        if (player.isUnderControl(true)) dialog.addSmall([storage, lib.skill.gz_huashen.$createButton]);
                        else return '共有' + get.cnNumber(storage.length) + '张“化身”';
                    },
                },
                group: ['gz_huashen_trigger', 'gz_huashen_flash', 'gz_huashen_remove'],
                subSkill: {
                    trigger: {
                        charlotte: true,
                        trigger: { player: 'triggerInvisible' },
                        filter(event, player) {
                            if (event.revealed) return false;
                            const infox = get.info(event.skill);
                            if (!infox || infox.charlotte) return false;
                            const skill = 'gz_huashen', info = lib.skill[skill], storage = player.getStorage(skill);
                            let skills = info.getSkills(storage, player);
                            game.expandSkills(skills);
                            return skills.includes(event.skill);
                        },
                        forceDie: true,
                        priority: 12,
                        forced: true,
                        popup: false,
                        content() {
                            get.info('bol_pinjian').triggerInvisible(event, trigger, player);
                        },
                    },
                    flash: {
                        charlotte: true,
                        trigger: { player: ['useSkill', 'logSkillBegin'] },
                        filter(event, player) {
                            const name = event.sourceSkill || event.skill;
                            const skill = 'gz_huashen', info = lib.skill[skill], storage = player.getStorage(skill);
                            return player.invisibleSkills.includes(name) && info.getSkills(storage, player).includes(name);
                        },
                        forceDie: true,
                        priority: 12,
                        forced: true,
                        popup: false,
                        content() {
                            const skill = 'gz_huashen', info = lib.skill[skill], storage = player.getStorage(skill);
                            const shows = storage.filter(name => get.character(name)?.skills?.includes(trigger.sourceSkill));
                            if (shows.length) shows.forEach(show => player.flashAvatar(skill, show));
                        },
                    },
                    remove: {
                        charlotte: true,
                        trigger: { player: ['useSkillAfter', 'logSkill'] },
                        filter(event, player) {
                            const name = event.sourceSkill || event.skill;
                            const skill = 'gz_huashen', info = lib.skill[skill], storage = player.getStorage(skill);
                            return player.invisibleSkills.includes(name) && info.getSkills(storage, player).includes(name);
                        },
                        forceDie: true,
                        priority: 12,
                        forced: true,
                        popup: false,
                        content() {
                            const skill = 'gz_huashen', info = lib.skill[skill], storage = player.getStorage(skill);
                            const remove = storage.filter(name => get.character(name)?.skills?.includes(trigger.sourceSkill));
                            if (remove.length > 0) info.removeVisitors(remove, player);
                        },
                    },
                },
            },
            gz_xinsheng: {
                audio: 'ext:活动武将/audio/skill:2',
                trigger: { player: 'damageEnd' },
                frequent: true,
                getIndex: event => event.num,
                async content(event, trigger, player) {
                    const skill = 'gz_huashen', info = lib.skill[skill];
                    const characters = info.getCharacter(player).randomGets(1);
                    if (characters.length > 0) info.addVisitors(characters, player);
                    await game.delayx();
                },
                ai: { combo: 'gz_huashen' },
            },
            xinzaiqi: {
                count() {
                    var num = 0;
                    game.countPlayer2(function (current) {
                        current.getHistory('lose', function (evt) {
                            if (evt.position == ui.discardPile) {
                                for (var i = 0; i < evt.cards.length; i++) {
                                    if (get.color(evt.cards[i]) == 'red') num++;
                                }
                            }
                        })
                    });
                    game.getGlobalHistory('cardMove', function (evt) {
                        if (evt.name == 'cardsDiscard') {
                            for (var i = 0; i < evt.cards.length; i++) {
                                if (get.color(evt.cards[i]) == 'red') num++;
                            }
                        }
                    })
                    return num;
                },
                audio: 'rezaiqi',
                filter(event, player) {
                    return lib.skill.xinzaiqi.count() > 0;
                },
                trigger: { player: 'phaseDiscardEnd' },
                async cost(event, trigger, player) {
                    event.result = await player.chooseTarget([1, get.info(event.skill).count()], get.prompt2(event.skill)).set('ai', target => {
                        return get.attitude(get.player(), target);
                    }).forResult();
                },
                async content(event, trigger, player) {
                    for (const target of event.targets.sortBySeat()) {
                        if (!target.isIn()) continue;
                        let result;
                        if (player.isHealthy()) result = { index: 0 };
                        else result = await target.chooseControl().set('choiceList', [
                            '摸一张牌',
                            '令' + get.translation(player) + '回复1点体力',
                        ]).set('ai', () => {
                            return get.event().choice;
                        }).set('choice', (() => {
                            if (get.attitude(target, player) > 0) return 1;
                            return 0;
                        })()).forResult();
                        if (result?.index == 1) {
                            target.line(player);
                            await player.recover();
                        }
                        else await target.draw();
                    }
                },
            },
            wansha_shen_simayi: { audio: 2 },
            old_tianzuo: {
                audio: 'tianzuo',
                inherit: 'tianzuo',
                group: 'tianzuo_rewrite',
            },
            old_lingce: {
                audio: 'lingce',
                inherit: 'lingce',
                filter(event, player) {
                    return event.card.name == 'qizhengxiangsheng' || get.zhinangs().includes(event.card.name);
                },
            },
            old_dinghan: {
                audio: 'dinghan',
                trigger: { target: 'useCardToTarget' },
                filter(event, player) {
                    return get.tag(event.card, 'damage') && !player.getStorage('old_dinghan_used').includes(event.card.name);
                },
                forced: true,
                content() {
                    player.addTempSkill('old_dinghan_used', 'roundStart');
                    player.markAuto('old_dinghan_used', [trigger.card.name]);
                    trigger.targets.remove(player);
                    trigger.getParent().triggeredTargets2.remove(player);
                    trigger.untrigger();
                },
                ai: { threaten: 0.4 },
                subSkill: { used: { charlotte: true, onremove: true } },
            },
            decadexiwu: {
                trigger: { source: 'damageBegin1' },
                filter(event, player) {
                    return event.card && event.card.name == 'sha';
                },
                forced: true,
                content() {
                    trigger.num++;
                },
                mod: {
                    cardUsable(card, player, num) {
                        if (card.name == 'sha') return Infinity;
                    },
                    targetInRange(card, player, target) {
                        if (card.name == 'sha') return true;
                    },
                },
            },
            decadehongzhuang: {
                trigger: { player: ['useCard', 'respond'] },
                filter(event, player) {
                    return typeof get.number(event.card) == 'number' && get.number(event.card) > 0;
                },
                frequent: true,
                content() {
                    player.draw(get.number(trigger.card));
                },
            },
            olddulie: {
                audio: 'dulie',
                trigger: { global: 'phaseBefore', player: 'enterGame' },
                filter(event, player) {
                    return (event.name != 'phase' || game.phaseNumber == 0) && game.countPlayer() > 1 && game.hasPlayer(function (current) {
                        return current != player && !current.hasMark('dulie');
                    });
                },
                forced: true,
                async content(event, trigger, player) {
                    const num = Math.min(game.countPlayer(function (current) {
                        return current != player && !current.hasMark('dulie');
                    }), Math.floor(game.players.length / 2));
                    const result = await player.chooseTarget('请选择【笃烈】的目标', '令' + get.cnNumber(num) + '名角色获得“围”标记', lib.filter.notMe, num, true).set('ai', function (target) {
                        const player = get.player();
                        return Math.max(1, get.attitude(player, target)) / Math.max(1, get.distance(player, target));
                    }).forResult();
                    if (result?.bool && result.targets?.length) {
                        const targets = result.targets.sortBySeat();
                        player.line(targets);
                        for (const i of targets) i.addMark('dulie', 1);
                        await game.delayx();
                    }
                },
                mod: {
                    targetInRange(card, player, target) {
                        if (card.name == 'sha' && !target.hasMark('dulie')) return true;
                    },
                },
                group: 'olddulie_sha',
                subSkill: {
                    sha: {
                        audio: 'dulie',
                        trigger: { target: 'useCardToTarget' },
                        filter(event, player) {
                            return event.card.name == 'sha' && event.player.isIn() && !event.player.hasMark('dulie');
                        },
                        forced: true,
                        logTarget: 'player',
                        async content(event, trigger, player) {
                            const result = await player.judge(result => get.color(result) == 'red' ? 2 : -1).forResult();
                            if (result?.bool) {
                                trigger.targets.remove(player);
                                trigger.getParent().triggeredTargets2.remove(player);
                                trigger.untrigger();
                                game.log(trigger.card, '对', player, '无效');
                            }
                        },
                        ai: {
                            effect: {
                                target(card, player, target, current, isLink) {
                                    if (card.name == 'sha' && !isLink && !player.hasMark('dulie')) return 0.5;
                                },
                            },
                        },
                    },
                },
            },
            oldpowei: {
                audio: 'tspowei',
                dutySkill: true,
                locked: true,
                derivation: 'oldshenzhu',
                group: ['oldpowei_achieve', 'oldpowei_fail', 'oldpowei_cancel'],
                ai: {
                    combo: ['dulie', 'olddulie'],
                    effect: {
                        player(card, player, target) {
                            if (card.name == 'sha' && target.hasMark('dulie') && get.attitude(player, target) >= 0) return [1, 1, 0, 0];
                            if (get.tag(card, 'damage') && _status.event.type == 'respondShan' && _status.event.getParent().name == 'sha' && target.hasMark('dulie') && get.attitude(target, player) >= 0) return [1, 1, 0, 0];
                        },
                    },
                },
                subSkill: {
                    cancel: {
                        audio: 'tspowei3.mp3',
                        trigger: { source: 'damageBegin3' },
                        logTarget: 'player',
                        filter(event, player) {
                            return event.card && event.card.name == 'sha' && event.player && event.player.isIn() && event.player.hasMark('dulie');
                        },
                        forced: true,
                        content() {
                            trigger.cancel();
                            trigger.player.clearMark('dulie');
                        },
                    },
                    achieve: {
                        audio: 'tspowei1.mp3',
                        trigger: { player: 'useCardAfter' },
                        forced: true,
                        skillAnimation: true,
                        animationColor: 'metal',
                        filter(event, player) {
                            return event.card.name == 'sha' && !game.hasPlayer(function (current) {
                                return current.hasMark('dulie');
                            });
                        },
                        content() {
                            game.log(player, '成功完成使命');
                            player.awakenSkill('oldpowei');
                            player.addSkills('oldshenzhu');
                        },
                    },
                    fail: {
                        audio: 'tspowei2.mp3',
                        trigger: { player: 'dying' },
                        forced: true,
                        content() {
                            'step 0'
                            game.log(player, '使命失败');
                            player.awakenSkill('oldpowei');
                            var num = player.countCards('e');
                            if (num > 0) player.chooseToDiscard('e', true, num);
                            'step 1'
                            if (player.hp < 1) player.recover(1 - player.hp);
                        },
                    },
                },
            },
            oldshenzhu: {
                mod: {
                    cardUsable(card, player, num) {
                        if (card.name == 'sha') return Infinity;
                    },
                },
                audio: 'shenzhu',
                trigger: { player: 'useCardAfter' },
                filter(event, player) {
                    return event.card.name == 'sha' && event.card.isCard && event.cards.length == 1;
                },
                forced: true,
                async content(event, trigger, player) {
                    //十周年虚拟歌姬推送
                    //整这么多官方的，加点彩蛋很合理吧
                    let cards = [], list = ['小杀', '小桃', '小闪', '小酒', '小乐', '小蛮', '小击', '小粮', '小有', '小拆', '小箭', '小牵'];
                    let list3 = ['sha', 'tao', 'shan', 'jiu', 'lebu', 'nanman', 'juedou', 'bingliang', 'wuzhong', 'guohe', 'wanjian', 'shunshou'];
                    let nums = Array.from({ length: 12 }).map((_, i) => i).randomGets(player.name2 ? 2 : 1).sort((a, b) => a - b);
                    for (let i = 0; i < nums.length; i++) {
                        const num = nums[i], name = list3[num];
                        game.log(player, '得到了', '#g' + list[num], '的庇护');
                        game.broadcastAll(function (player, i, list, num) {
                            /*
                            (async () => {
                                await lib.skill.oldshenzhu.smoothAvatarAsync(i === 1, null, player);
                                const node = player.node[i === 0 ? 'avatar' : 'avatar2'], name = player[i === 0 ? 'name' : 'name2'];
                                const node2 = player.node[i === 0 ? 'name' : 'name2'], innerHTML = node2.innerHTML;
                                node.setBackgroundImage('extension/活动武将/image/default/' + list[num] + '.jpg');
                                node2.innerHTML = list[num];
                                await lib.skill.oldshenzhu.smoothAvatarAsync(i === 1, null, player);
                                const skinName = i === 0 ? player.skin?.name : player.skin?.name2;
                                node.setBackground((!skinName || skinName === name) ? name : skinName, 'character');
                                node2.innerHTML = innerHTML;
                            })();
                            */
                            player.smoothAvatar(i === 1);
                            const node = player.node[i === 0 ? 'avatar' : 'avatar2'], name = player[i === 0 ? 'name' : 'name2'];
                            //const node2 = player.node[i === 0 ? 'name' : 'name2'], innerHTML = node2.innerHTML;
                            node.setBackgroundImage('extension/活动武将/image/default/' + list[num] + '.jpg');
                            //setTimeout(() => node2.innerHTML = list[num], 时间1);
                            setTimeout(() => {
                                const skinName = i === 0 ? player.skin?.name : player.skin?.name2;
                                player.smoothAvatar(i === 1);
                                node.setBackground((!skinName || skinName === name) ? name : skinName, 'character');
                                //setTimeout(() => node2.innerHTML = innerHTML, 时间2);
                            }, 750);
                        }, player, i, list, num);
                        const card = get.cardPile(card => {
                            if (cards.includes(card)) return false;
                            if (name == 'tao') return ['tao', 'zong'].includes(card.name);
                            if (name == 'jiu') return ['jiu', 'xionghuangjiu'].includes(card.name);
                            if (name == 'wuzhong') return ['wuzhong', 'zengbin', 'sadouchengbing', 'dongzhuxianji', 'tongzhougongji'].includes(card.name);
                            return card.name == name;
                        });
                        if (card) cards.push(card);
                    }
                    if (cards.length) await player.gain(cards, 'draw');
                },
                /*
                smoothAvatarAsync(vice, video, player) {
                    return new Promise(resolve => {
                        const div = ui.create.div('.fullsize');
                        var target = vice ? player.node.avatar2 : player.node.avatar;
                        div.style.background = getComputedStyle(target).background;
                        target.appendChild(div);
                        ui.refresh(div);
                        div.style.transition = 'all 1s';
                        div.addEventListener('transitionend', function handler() {
                            div.removeEventListener('transitionend', handler);
                            resolve();
                        });
                        setTimeout(() => div.classList.add('removing'), 50);
                        if (video !== false) game.addVideo('smoothAvatar', player, vice);
                    });
                },
                */
            },
            old_yingba: {
                audio: 'yingba',
                enable: 'phaseUse',
                usable: 1,
                filter: (event, player) => (game.hasPlayer((current) => (current != player && current.maxHp > 1))),
                filterTarget: (card, player, target) => (target != player && target.maxHp > 1),
                content() {
                    'step 0'
                    target.loseMaxHp();
                    'step 1'
                    if (target.isIn()) target.addMark('old_yingba_mark', 1);
                    player.loseMaxHp();
                },
                mod: {
                    cardUsableTarget(card, player, target) {
                        if (target.hasMark('old_yingba_mark')) return true;
                    },
                },
                ai: {
                    threaten: 4.8,
                    order: 12,
                    result: {
                        target(player, target) {
                            if (target.isHealthy()) return -3;
                            if (!target.hasMark('old_yingba_mark')) return -2;
                            if (target.maxHp < 3) return -1;
                            return 0;
                        },
                    },
                },
                subSkill: {
                    mark: {
                        marktext: '定',
                        intro: {
                            name: '平定',
                            content: 'mark',
                            onunmark: true,
                        },
                    },
                },
            },
            old_fuhai: {
                audio: 'scfuhai',
                trigger: { player: 'useCardToPlayered' },
                forced: true,
                filter(event, player) {
                    return event.target && event.target.hasMark('old_yingba_mark');
                },
                logTarget: 'target',
                content() {
                    trigger.directHit.add(trigger.target);
                },
                group: ['old_fuhai_die', 'old_fuhai_usea'],
                ai: {
                    combo: 'old_yingba',
                    directHit_ai: true,
                    skillTagFilter(player, tag, arg) {
                        return arg?.target && arg.target.hasMark('old_yingba_mark')
                    },
                },
                subSkill: {
                    usea: {
                        audio: 'scfuhai',
                        trigger: { player: 'useCardAfter' },
                        forced: true,
                        filter(event, player) {
                            return lib.skill.old_fuhai_usea.logTarget(event, player).length > 0;
                        },
                        logTarget(event, player) {
                            return event.targets.filter(function (i) {
                                return i.hasMark('old_yingba_mark');
                            });
                        },
                        content() {
                            var num = 0;
                            for (var i of trigger.targets) {
                                var numx = i.countMark('old_yingba_mark');
                                if (numx) {
                                    num += numx;
                                    i.removeMark('old_yingba_mark', numx);
                                }
                            }
                            if (num) player.gainMaxHp(num);
                        },
                    },
                    die: {
                        audio: 'scfuhai',
                        trigger: { global: 'die' },
                        forced: true,
                        filter(event, player) {
                            return event.player.countMark('old_yingba_mark') > 0;
                        },
                        content() {
                            player.gainMaxHp(trigger.player.countMark('old_yingba_mark'));
                            player.draw(trigger.player.countMark('old_yingba_mark'));
                        },
                    },
                },
            },
            old_pinghe: {
                audio: 'pinghe',
                mod: {
                    maxHandcardBase(player) {
                        return player.getDamagedHp();
                    },
                },
                locked: false,
                trigger: { player: 'damageBegin4' },
                filter(event, player) {
                    return event.source && event.source != player && event.num < player.countCards('h') && game.hasPlayer(current => player != current);
                },
                async cost(event, trigger, player) {
                    event.result = await player.chooseCardTarget({
                        prompt: get.prompt(event.skill),
                        prompt2: '将' + get.cnNumber(trigger.num) + '张手牌交给一名其他角色并防止伤害' + (player.hasSkill('old_yingba') ? '，然后令伤害来源获得等量“平定”标记' : ''),
                        selectCard: trigger.num,
                        filterCard: true,
                        filterTarget: lib.filter.notMe,
                        ai1(card) {
                            if (get.tag(card, 'recover') && !game.hasPlayer(function (current) {
                                return get.attitude(current, player) > 0 && !current.hasSkillTag('nogain');
                            })) return 0;
                            return 1 / Math.max(0.1, get.value(card));
                        },
                        ai2(target) {
                            var player = _status.event.player, att = get.attitude(player, target);
                            if (target.hasSkillTag('nogain')) att /= 9;
                            return 4 + att;
                        },
                    }).forResult();
                },
                async content(event, trigger, player) {
                    const { targets: [target], cards } = event;
                    trigger.cancel();
                    await target.gain(cards, player, 'giveAuto');
                    await player.loseMaxHp(trigger.num);
                    if (player.hasSkill('old_yingba')) {
                        trigger.source.addMark('old_yingba_mark', trigger.num);
                    }
                },
            },
            BTkongju: {
                audio: 'keji',
                scareSkill: true,
                trigger: { player: 'phaseUseEnd' },
                frequent(event, player) {
                    return player.needsToDiscard();
                },
                filter(event, player) {
                    const history = player.getHistory('useCard').concat(player.getHistory('respond'));
                    return !history.some(evt => evt.card.name === 'sha' && evt.isPhaseUsing());
                },
                content() {
                    player.skip('phaseDiscard');
                    var targets = game.filterPlayer(current => current !== player).sortBySeat();
                    player.line(targets);
                    for (var i of targets) i.addMark('BTkongju', 1);
                    game.delayx();
                },
                marktext: '惧',
                intro: { name: '恐惧', content: 'mark' },
            },
            BThouqi: {
                trigger: { player: 'phaseZhunbeiBegin' },
                filter(event, player) {
                    return game.countPlayer(target => target.countMark('BTkongju')) >= 100;
                },
                forced: true,
                skillAnimation: true,
                animationColor: 'wood',
                content() {
                    const me = game.me._trueMe || game.me;
                    const winners = game.filterPlayer2(i => i.isFriendOf(player), [], true);
                    game.over(player === me || winners.includes(me));
                },
                ai: {
                    threaten() {
                        const num = game.countPlayer(target => target.countMark('BTkongju'));
                        return Math.max(10, num) / 10;
                    },
                },
            },
            bilibili_taoluan: {
                hiddenCard(player, name) {
                    return !player.getStorage('bilibili_taoluan').includes(name) && player.countCards('hes') > 0 && lib.inpile.includes(name);
                },
                audio: 'taoluan',
                enable: 'chooseToUse',
                filter(event, player) {
                    return get.inpileVCardList(info => {
                        if (!['basic', 'trick'].includes(info[0])) return false;
                        if (player.getStorage('bilibili_taoluan').includes(info[2])) return false;
                        return player.countCards('hes', card => event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, [card]), player, event));
                    }).length;
                },
                onremove: true,
                chooseButton: {
                    dialog(event, player) {
                        var list = get.inpileVCardList(info => {
                            if (!['basic', 'trick'].includes(info[0])) return false;
                            if (player.getStorage('bilibili_taoluan').includes(info[2])) return false;
                            return player.countCards('hes', card => event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, [card]), player, event));
                        })
                        return ui.create.dialog('滔乱', [list, 'vcard']);
                    },
                    filter(button, player) {
                        return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
                    },
                    check(button) {
                        var player = _status.event.player;
                        var card = { name: button.link[2], nature: button.link[3] };
                        if (player.countCards('hes', cardx => cardx.name == card.name)) return 0;
                        return _status.event.getParent().type == 'phase' ? player.getUseValue(card) : 1;
                    },
                    backup(links, player) {
                        return {
                            audio: 'taoluan',
                            filterCard: true,
                            popname: true,
                            check(card) {
                                return 7 - get.value(card);
                            },
                            position: 'hes',
                            viewAs: {
                                name: links[0][2],
                                nature: links[0][3],
                            },
                            onuse(result, player) {
                                player.markAuto('bilibili_taoluan', [result.card.name]);
                                player.addTempSkill('bilibili_taoluan_effect');
                            },
                        }
                    },
                    prompt(links, player) {
                        return '将一张牌当作' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]) + '使用';
                    },
                },
                ai: {
                    order: 7,
                    result: { player: 1 },
                    threaten: 4.7,
                    save: true,
                    respondSha: true,
                    respondShan: true,
                    skillTagFilter(player, tag, arg) {
                        if (arg == 'respond' || !player.countCards('hes')) return false;
                        const storage = player.getStorage('bilibili_taoluan');
                        if (tag == 'respondSha' || tag == 'respondShan') return !storage.includes(tag == 'respondSha' ? 'sha' : 'shan');
                        return !storage.includes('tao') || (!storage.includes('jiu') && arg == player);
                    },
                },
                subSkill: {
                    backup: {},
                    effect: {
                        charlotte: true,
                        trigger: { player: 'useCardAfter' },
                        filter(event, player) {
                            return event.skill == 'bilibili_taoluan_backup';
                        },
                        forced: true,
                        popup: false,
                        content() {
                            'step 0'
                            if (game.hasPlayer(function (current) {
                                return current != player && current.countGainableCards(player, 'he') > 0;
                            })) player.chooseTarget(true, function (card, player, target) {
                                return target != player && target.countGainableCards(player, 'he') > 0;
                            }, '###滔乱###<div class="text center">获得一名其他角色的一张牌，如果你获得的牌与你以此法使用的牌类别相同的牌，你失去1点体力且本回合〖滔乱〗失效').set('ai', function (target) {
                                var player = _status.event.player;
                                return get.effect(target, { name: 'shunshou_copy2' }, player, player);
                            });
                            else event._result = { bool: false };
                            'step 1'
                            if (result?.bool && result.targets?.length) {
                                var target = event.target = result.targets[0];
                                player.line(target, 'green');
                                player.gainPlayerCard(target, true, 'he');
                            }
                            else event._result = { bool: false };
                            'step 2'
                            if (!result?.bool || !result.cards?.some(card => get.type2(trigger.card) == get.type2(card))) {
                                player.popup('杯具');
                                player.loseHp();
                                player.tempBanSkill('bilibili_taoluan');
                            }
                        },
                    }
                }
            },
            //2013年韩旭爆料版神甘宁
            old_jieying: {
                audio: 'drlt_jieying',
                trigger: { global: 'phaseBefore', player: 'enterGame' },
                filter(event, player) {
                    return event.name !== 'phase' || game.phaseNumber == 0;
                },
                forced: true,
                logTarget(event, player) {
                    return game.findPlayer(current => current.getSeatNum() == 1) || _status.roundStart;
                },
                async content(event, trigger, player) {
                    event.targets[0].addMark(event.name, 1);
                },
                marktext: '营',
                intro: {
                    name: '劫营',
                    name2: '营',
                    content: '已获得【营】标记',
                },
                group: 'old_jieying_phase',
                subSkill: {
                    phase: {
                        trigger: { global: ['phaseAfter', 'dieAfter'] },
                        filter(event, player) {
                            return event.player.hasMark('old_jieying');
                        },
                        forced: true,
                        logTarget: 'player',
                        async content(event, trigger, player) {
                            const num = trigger.player.countMark('old_jieying');
                            trigger.player.clearMark('old_jieying');
                            trigger.player.getNext().addMark('old_jieying', num);
                            player.insertPhase();
                        },
                    },
                },
            },
            old_tongling: {
                audio: 'drlt_poxi',
                trigger: { target: 'useCardToTargeted', global: ['logSkillBegin', 'useSkill'] },
                filter(event, player) {
                    if (event.name == 'useCardToTargeted') return event.targets.length == 1;
                    if (player == event.player) return false;
                    return event.targets?.includes(player) && event.type == 'player';
                },
                forced: true,
                logTarget: 'player',
                content() {
                    player.draw(2);
                },
            },
            //左慈
            BThuashen: {
                init(player, skill) {
                    player.storage[skill] ??= {
                        character: [],
                        shown: [],
                        map: {},
                    }
                },
                audio: 'huashen2',
                trigger: { global: 'phaseBefore', player: ['phaseBegin', 'phaseEnd', 'enterGame'] },
                filter(event, player, name) {
                    if (name == 'phaseBefore' || name == 'enterGame') return event.name != 'phase' || game.phaseNumber == 0;
                    return player.storage.BThuashen && player.storage.BThuashen.character.length > 0;
                },
                direct: true,
                content() {
                    'step 0'
                    if (event.triggername == 'phaseBefore' || event.triggername == 'enterGame') {
                        event.logged = true;
                        player.logSkill('BThuashen');
                        lib.skill.BThuashen.addFuckShens(player, 2, 'BThuashen');
                    }
                    _status.noclearcountdown = true;
                    event.videoId = lib.status.videoId++;
                    var cards = player.storage.BThuashen.character.slice(0);
                    var skills = [];
                    var sto = player.storage.BThuashen;
                    for (var i in player.storage.BThuashen.map) {
                        skills.addArray(player.storage.BThuashen.map[i]);
                    }
                    var cond = 'out';
                    if (event.triggername == 'phaseBegin') {
                        cond = 'in';
                    }
                    skills.randomSort();
                    skills.sort(function (a, b) {
                        return get.skillRank(b, cond) - get.skillRank(a, cond);
                    });
                    event.aiChoice = skills[0];
                    if (player.countMark('BTxinsheng') < 2 && (event.aiChoice == player.storage.BThuashen.current2 || get.skillRank(event.aiChoice, cond) < 1)) choice = '弃置化身';
                    else if (event.aiChoice == player.storage.BThuashen.current2 || get.skillRank(event.aiChoice, cond) < 1) choice = '制衡化身';
                    if (player.isOnline2()) {
                        player.send(function (cards, id) {
                            var dialog = ui.create.dialog('是否发动【化身】？', [cards, 'character']);
                            dialog.videoId = id;
                        }, cards, event.videoId);
                    }
                    event.dialog = ui.create.dialog(get.prompt('BThuashen'), [cards, 'character']);
                    event.dialog.videoId = event.videoId;
                    if (!event.isMine()) {
                        event.dialog.style.display = 'none';
                    }
                    if (event.triggername == 'phaseBefore' || event.triggername == 'enterGame') event._result = { control: '更换技能' };
                    else {
                        var choice = '更换技能', list = ['制衡化身', '更换技能'];
                        if (player.countMark('BTxinsheng') < 2 && player.storage.BThuashen.character.length > 1) {
                            list.push('弃置化身');
                            choice = '弃置化身';
                        }
                        list.push('cancel2');
                        player.chooseControl(list).set('ai', function () {
                            return _status.event.choice;
                        }).set('choice', choice);
                    }
                    'step 1'
                    event.control = result.control;
                    if (event.control == 'cancel2') {
                        if (player.isOnline2()) player.send('closeDialog', event.videoId);
                        delete _status.noclearcountdown;
                        if (!_status.noclearcountdown) {
                            game.stopCountChoose();
                        }
                        event.dialog.close();
                        event.finish();
                        return;
                    }
                    if (!event.logged) {
                        player.logSkill('BThuashen');
                        event.logged = true;
                    }
                    var num = player.maxHp;
                    var next = player.chooseButton(true).set('dialog', event.videoId);
                    if (event.control == '制衡化身') {
                        next.set('selectButton', [1, num]);
                        next.set('filterButton', function (button) {
                            return button.link != _status.event.current;
                        });
                        next.set('current', player.storage.BThuashen.current);
                    }
                    else if (event.control == '弃置化身') {
                        next.set('selectButton', 1);
                        next.set('filterButton', function (button) {
                            return button.link != _status.event.current;
                        });
                        next.set('current', player.storage.BThuashen.current);
                    }
                    else {
                        next.set('ai', function (button) {
                            return player.storage.BThuashen.map[button.link].includes(_status.event.choice) ? 2.5 : 1 + Math.random();
                        });
                        next.set('choice', event.aiChoice);
                    }
                    var prompt;
                    switch (event.control) {
                        case '制衡化身':
                            prompt = '选择制衡至多' + get.cnNumber(num) + '张化身';
                            break;
                        case '更换技能':
                            prompt = '选择要切换的化身';
                            break;
                        case '弃置化身':
                            prompt = '选择要弃置的化身';
                            break;
                    }
                    var func = function (id, prompt) {
                        var dialog = get.idDialog(id);
                        if (dialog) dialog.content.childNodes[0].innerHTML = prompt;
                    }
                    if (player.isOnline2()) player.send(func, event.videoId, prompt);
                    else if (event.isMine()) func(event.videoId, prompt);
                    'step 2'
                    if (result.bool && event.control == '更换技能') {
                        event.card = result.links[0];
                        var func = function (card, id) {
                            var dialog = get.idDialog(id);
                            if (dialog) {
                                for (var i = 0; i < dialog.buttons.length; i++) {
                                    dialog.buttons[i].classList.add(dialog.buttons[i].link == card ? 'selectedx' : 'unselectable');
                                }
                            }
                        }
                        if (player.isOnline2()) player.send(func, event.card, event.videoId);
                        else if (event.isMine()) func(event.card, event.videoId);
                        var list = player.storage.BThuashen.map[event.card].slice(0);
                        list.push('返回');
                        player.chooseControl(list).set('choice', event.aiChoice).set('ai', () => _status.event.choice);
                    }
                    else {
                        lib.skill.BThuashen.removeFuckShen(player, result.links.slice(0), 'BThuashen');
                        if (event.control == '制衡化身') lib.skill.BThuashen.addFuckShens(player, result.links.length, 'BThuashen');
                        else {
                            player.addMark('BTxinsheng', 1, false);
                            game.log(player, '的', '#g【新生】', '已升至', player.countMark('BTxinsheng') + 1, '级');
                        }
                    }
                    'step 3'
                    if (result.control == '返回') {
                        var func = function (id) {
                            var dialog = get.idDialog(id);
                            if (dialog) {
                                for (var i = 0; i < dialog.buttons.length; i++) {
                                    dialog.buttons[i].classList.remove('selectedx');
                                    dialog.buttons[i].classList.remove('unselectable');
                                }
                            }
                        }
                        if (player.isOnline2()) player.send(func, event.videoId);
                        else if (event.isMine()) func(event.videoId);
                        event._result = { control: '更换技能' };
                        event.goto(1);
                        return;
                    }
                    if (player.isOnline2()) player.send('closeDialog', event.videoId);
                    event.dialog.close();
                    delete _status.noclearcountdown;
                    if (!_status.noclearcountdown) game.stopCountChoose();
                    if (event.control != '更换技能') return;
                    if (player.storage.BThuashen.current != event.card) {
                        player.storage.BThuashen.current = event.card;
                        lib.skill.BThuashen.changeSex(lib.character[event, card][0], player);
                        player.changeGroup(lib.character[event, card][1]);
                    }
                    var link = result.control;
                    player.storage.BThuashen.current2 = link;
                    if (!player.additionalSkills.BThuashen || !player.additionalSkills.BThuashen.includes(link)) {
                        player.addAdditionalSkills('BThuashen', link);
                        player.flashAvatar('BThuashen', event.card);
                        player.storage.BThuashen.shown.push(event.card);
                        player.syncStorage('BThuashen');
                        player.updateMarks('BThuashen');
                    }
                },
                intro: {
                    onunmark(storage, player) {
                        _status.characterlist.addArray(storage.character);
                        storage.character = [];
                        storage.shown = [];
                        const name = player.name ? player.name : player.name1;
                        if (name) {
                            const sex = get.character(name, 0);
                            const group = get.character(name, 1);
                            if (player.sex !== sex) get.info('BThuashen').changeSex(sex, player);
                            if (player.group !== group) {
                                game.broadcastAll((player, group) => {
                                    player.group = group;
                                    player.node.name.dataset.nature = get.groupnature(group);
                                }, player, group);
                                game.log(player, '将势力变为了', '#y' + get.translation(group + 2));
                            }
                        }
                    },
                    mark(dialog, storage, player) {
                        if (!storage?.character?.length) return '没有化身';
                        var list = storage.character;
                        dialog.addSmall([list, 'character']);
                        for (var i = 0; i < dialog.buttons.length; i++) {
                            var button = dialog.buttons[i];
                            if (!player.isUnderControl(true) && !storage.shown.includes(button.link)) {
                                button.node.group.remove();
                                button.node.hp.remove();
                                button.node.intro.remove();
                                button.node.name.innerHTML = '未知';
                                button.node.name.dataset.nature = '';
                                button.style.background = '';
                                button._nointro = true;
                                button.classList.add('menubg');
                            }
                            if (button.link == storage.current) button.classList.add('glow2');
                        }
                        var skill = storage.current2;
                        if (skill) dialog.add('<div><div class="skill">【' + get.translation(lib.translate[skill + '_ab'] || get.translation(skill).slice(0, 2)) + '】</div>' + '<div>' + get.skillInfoTranslation(skill, player) + '</div></div>');
                    },
                    content(storage) {
                        return '共有' + get.cnNumber(storage.character.length) + '张“化身”'
                    },
                    markcount(storage) {
                        return storage?.character?.length || 0;
                    },
                },
                changeSex(sex, player) {
                    game.broadcastAll((sex, player) => {
                        player.sex = sex;
                    }, sex, player);
                    game.log(player, '将性别变为了', '#y' + get.translation(sex) + '性');
                },
                addFuckShen(player, skill) {
                    if (!player.storage[skill]) return;
                    if (!_status.characterlist) lib.skill.pingjian.initList();
                    _status.characterlist.randomSort();
                    for (var i = 0; i < _status.characterlist.length; i++) {
                        var name = _status.characterlist[i];
                        if (lib.character[name][1] == 'shen' || name.includes('zuoci') || name.includes('xushao') || lib.skill.rehuashen.banned.includes(name) || player.storage[skill].character.includes(name)) continue;
                        var skills = lib.character[name]?.skills ?? [];
                        for (var j = 0; j < skills.length; j++) {
                            var info = lib.skill[skills[j]];
                            if (info.charlotte || (info.unique && !info.gainable) || info.juexingji || info.limited || info.zhuSkill || info.hiddenSkill || info.dutySkill) skills.splice(j--, 1);
                        }
                        if (skills.length) {
                            player.storage[skill].character.push(name);
                            player.storage[skill].map[name] = skills;
                            _status.characterlist.remove(name);
                            return name;
                        }
                    }
                },
                addFuckShens(player, num, skill) {
                    var list = [];
                    for (var i = 0; i < num; i++) {
                        var name = lib.skill.BThuashen.addFuckShen(player, skill);
                        if (name) list.push(name);
                    }
                    if (list.length) {
                        game.log(player, '获得了', get.cnNumber(list.length) + '张', '#g化身');
                        lib.skill.rehuashen.drawCharacter(player, list);
                    }
                    player[player.storage[skill].character.length ? 'markSkill' : 'unmarkSkill'](skill);
                },
                removeFuckShen(player, links, skill) {
                    player.storage[skill].character.removeArray(links);
                    _status.characterlist.addArray(links);
                    game.log(player, '移去了', get.cnNumber(links.length) + '张', '#g化身');
                    player[player.storage[skill].character.length ? 'markSkill' : 'unmarkSkill'](skill);
                },
            },
            BTxinsheng: {
                derivation: ['BTxinsheng_1', 'BTxinsheng_2', 'BThuanhua'],
                audio: 'xinsheng',
                trigger: { player: 'damageEnd', source: 'damageSource' },
                filter(event, player, name) {
                    if (name == 'damageSource') return player.hasMark('BTxinsheng');
                    return true;
                },
                frequent: true,
                content() {
                    'step 0'
                    lib.skill.BThuashen.addFuckShens(player, trigger.num, 'BThuashen');
                    'step 1'
                    if (player.countMark('BTxinsheng') >= 2 && player.storage.BThuashen.character.length >= game.players.length && !player.hasSkill('BThuanhua')) {
                        player.$fullscreenpop('新生', 'thunder');
                        player.addSkills('BThuanhua');
                    }
                },
            },
            BThuanhua: {
                audio: ['yigui1.mp3', 'yigui2.mp3'],
                enable: 'phaseUse',
                filter(event, player) {
                    if (!player.countCards('hs')) return false;
                    var storage = player.storage.BThuashen;
                    if (!storage || storage.character.length <= (storage.current ? 1 : 0)) return false;
                    for (var i of lib.inpile) {
                        if (get.type({ name: i }) != 'basic' && get.type({ name: i }) != 'trick') continue;
                        if (event.filterCard(get.autoViewAs({ name: i }, 'unsure'), player, event)) return true;
                        if (i == 'sha') {
                            for (var j of lib.inpile_nature) if (event.filterCard(get.autoViewAs({ name: i, nature: j }, 'unsure'), player, event)) return true;
                        }
                    }
                    return false;
                },
                usable: 1,
                chooseButton: {
                    select: 2,
                    dialog(event, player) {
                        var dialog = ui.create.dialog('幻化', 'hidden');
                        dialog.add([player.storage.BThuashen.character, 'character']);
                        var list = [];
                        for (var name of lib.inpile) {
                            if (get.type({ name: name }) != 'basic' && get.type({ name: name }) != 'trick') continue;
                            list.push([get.translation(get.type({ name: name })), '', name]);
                            if (name == 'sha') {
                                for (var nature of lib.inpile_nature) list.push(['基本', '', 'sha', nature]);
                            }
                        }
                        dialog.add([list, 'vcard']);
                        return dialog;
                    },
                    check(button) {
                        var player = _status.event.player;
                        if (player.storage.BThuashen.character.includes(button.link)) return (1 / (get.character(button.link)?.skills ?? []).reduce((sum, skill) => sum + get.skillRank(skill), 0)) || 0.5;
                        return player.getUseValue({ name: button.link[2], nature: button.link[3] });
                    },
                    filter(button, player) {
                        var evt = _status.event.getParent();
                        var getBool = function (object) {
                            return player.storage.BThuashen.character.includes(object) ? 1 : -1;
                        };
                        if (button.link == player.storage.BThuashen.current) return false;
                        if (getBool(button.link) == -1 && !evt.filterCard({ name: button.link[2], nature: button.link[3] }, player, evt)) return false;
                        return !ui.selected.buttons.length || getBool(ui.selected.buttons[0].link) != getBool(button.link);
                    },
                    backup(links, player) {
                        if (player.storage.BThuashen.character.includes(links[1])) links.reverse();
                        var name = links[1][2], nature = links[1][3] || null;
                        return {
                            audio: ['yigui1.mp3', 'yigui2.mp3'],
                            filterCard: true,
                            check(card) {
                                return 8 - get.value(card);
                            },
                            position: 'hs',
                            popname: true,
                            viewAs: {
                                name: name,
                                nature: nature,
                            },
                            onuse(result, player) {
                                player.flashAvatar('BThuanhua', links[0]);
                                lib.skill.BThuashen.removeFuckShen(player, links, 'BThuashen');
                            },
                        }
                    },
                    prompt(links, player) {
                        if (player.storage.BThuashen.character.includes(links[1])) links.reverse();
                        var character = links[0], name = links[1][2], nature = links[1][3] || null;
                        return '弃置“' + get.translation(character) + '”并将一张手牌当作' + (get.translation(nature) || '') + get.translation(name) + '使用';
                    },
                    subSkill: { backup: {} },
                },
                ai: {
                    combo: 'BTxinsheng',
                    order: 1,
                    result: { player: 1 },
                },
            },
            bilibili_kurou: {
                audio: 'rekurou',
                enable: 'phaseUse',
                content() {
                    player.loseHp();
                    player.draw();
                },
                ai: {
                    order: 0.05,
                    result: {
                        player(player) {
                            if (!player.hasSkill('bilibili_zhaxiang') && get.effect(player, { name: 'losehp' }, player, player) <= 0) return 0;
                            if (!player.hasCard(card => {
                                if (player.hasValueTarget(card, true, true)) return false;
                                return lib.skill.zhiheng.check(card) > 0;
                            }, 'h')) return 0;
                            return player.countCards('hs', card => player.canSaveCard(card, player)) + player.hp - 1;
                        },
                    },
                },
            },
            bilibili_zhaxiang: {
                audio: 'zhaxiang',
                trigger: { player: ['loseHpEnd', 'damageEnd'] },
                filter(event, player) {
                    return player.hasCard('h', card => _status.connectMode || lib.filter.cardDiscardable(card, player, 'bilibili_zhaxiang'), 'h');
                },
                async cost(event, trigger, player) {
                    event.result = await player.chooseToDiscard(get.prompt2(event.skill), 'allowChooseAll', 'chooseonly', [1, Infinity]).set('ai', lib.skill.zhiheng.check).forResult();
                },
                async content(event, trigger, player) {
                    await player.discard(event.cards);
                    await player.draw(event.cards.length);
                },
            },
            //合影留念！第一个扩展的第一个贴吧武将！
            bilibili_xueji: {
                zhuanhuanji: true,
                trigger: { global: 'roundStart' },
                mark: true,
                marktext: '☯',
                intro: {
                    content(storage) {
                        if (storage) return '每轮开始时，你可以失去1点体力上限，并视为使用一张【杀】，若此【杀】造成伤害，你摸两张牌。';
                        return '每轮开始时，你可以失去1点体力，令一名角色于本轮第一次造成的伤害+1。';
                    },
                },
                async cost(event, trigger, player) {
                    let next;
                    if (player.storage[event.skill]) {
                        next = player.chooseTarget(get.prompt(event.skill), '失去1点体力上限并视为使用一张【杀】，若此杀造成伤害，你摸两张牌', (card, player, target) => {
                            return player.canUse({ name: 'sha', isCard: true }, target);
                        }).set('ai', target => {
                            const player = get.player();
                            return get.effect(target, { name: 'sha', isCard: true }, player, player);
                        });
                    }
                    else {
                        next = player.chooseTarget(get.prompt(event.skill), '失去1点体力，令一名角色于本轮第一次造成的伤害+1').set('ai', target => {
                            const player = get.player();
                            return get.attitude(player, target);
                        });
                    }
                    event.result = await next.forResult();
                },
                async content(event, trigger, player) {
                    player.changeZhuanhuanji(event.name)
                    const target = event.targets[0];
                    if (player.storage[event.name]) {
                        await player.loseHp();
                        target.addTempSkill(event.name + '_effect', 'roundStart');
                        target.addMark(event.name + '_effect', 1, false);
                    }
                    else {
                        await player.loseMaxHp();
                        const card = get.autoViewAs({ name: 'sha', isCard: true });
                        if (player.canUse(card, target, false)) {
                            const next = player.useCard(card, target, false);
                            await next;
                            if (game.hasPlayer2(current => current.hasHistory('damage', evt => {
                                return evt.getParent(2) == next;
                            }))) await player.draw(2);
                        }
                    }
                },
                subSkill: {
                    effect: {
                        charlotte: true,
                        onremove: true,
                        intro: { content: '本轮首次造成的伤害+#' },
                        trigger: { source: 'damageBegin1' },
                        forced: true,
                        popup: false,
                        async content(event, trigger, player) {
                            const num = player.countMark(event.name);
                            player.removeSkill(event.name);
                            trigger.num += num;
                        }
                    }
                }
            },
            bilibili_hanran: {
                trigger: { source: 'damageBegin3' },
                filter(event, player) {
                    return event.player != player && event.player.maxHp > player.maxHp;
                },
                forced: true,
                content() {
                    player.gainMaxHp();
                },
            },
            //远古武将技能
            oldluanji: {
                audio: 'luanji',
                enable: 'chooseToUse',
                viewAs: { name: 'wanjian' },
                filterCard(card, player) {
                    return !player.storage.oldluanji?.includes(get.suit(card));
                },
                selectCard: 2,
                check(card) {
                    var player = _status.event.player;
                    var targets = game.filterPlayer(function (current) {
                        return player.canUse('wanjian', current);
                    });
                    var num = 0;
                    for (var i = 0; i < targets.length; i++) {
                        var eff = Math.sign(get.effect(targets[i], { name: 'wanjian' }, player, player));
                        if (targets[i].hp == 1) {
                            eff *= 1.5;
                        }
                        num += eff;
                    }
                    if (!player.needsToDiscard(-1)) {
                        if (targets.length >= 7) {
                            if (num < 2) return 0;
                        }
                        else if (targets.length >= 5) {
                            if (num < 1.5) return 0;
                        }
                    }
                    return 6 - get.value(card);
                },
                ai: {
                    basic: {
                        order: 8.9
                    },
                },
                onuse(result, player) {
                    const skill = 'oldluanji_count';
                    player.addTempSkill(skill);
                    player.markAuto(skill, result.cards.map(card => get.suit(card, player)));
                    player.storage[skill].sort((a, b) => lib.suit.indexOf(b) - lib.suit.indexOf(a));
                    game.broadcastAll((player, skill, list) => player.storage[skill] = list, player, skill, player.storage[skill]);
                    player.addTip(skill, [skill, ...player.storage[skill]].map(get.translation).join(''));
                },
                group: ['oldluanji_respond'],
                subSkill: {
                    count: {
                        charlotte: true,
                        onremove(player, skill) {
                            player.removeTip(skill);
                            delete player.storage[skill];
                        },
                    },
                    respond: {
                        charlotte: true,
                        trigger: { global: 'respond' },
                        filter(event, player) {
                            return event.getParent(2).skill == 'oldluanji' && event.player.isDamaged();
                        },
                        silent: true,
                        content() {
                            trigger.player.draw();
                        },
                    },
                },
            },
            //张仲景
            old_jishi: {
                audio: 'jishi',
                inherit: 'jishi',
                group: 'old_jishi_draw',
                subSkill: {
                    draw: {
                        audio: 'jishi',
                        trigger: { global: ['gainAfter', 'cardsDiscardAfter'] },
                        forced: true,
                        filter(event, player) {
                            return event.fromRenku == true;
                        },
                        content() {
                            player.draw();
                        },
                    },
                },
            },
            old_yuheng: {
                audio: 'yuheng',
                trigger: { player: ['phaseBegin', 'useCardAfter', 'phaseEnd'] },
                filter(event, player) {
                    if (_status.currentPhase !== player) return false;
                    if (!player.hasMark('old_yuheng_count')) return false;
                    if (event.name == 'useCard') {
                        var list = [], bool = false;
                        player.getHistory('useCard', function (evt) {
                            if (!bool) {
                                list.push(evt.card);
                                if (evt.card == event.card) bool = true;
                            }
                        });
                        return list.length == player.countMark('old_yuheng_count');
                    }
                    return true;
                },
                forced: true,
                popup: false,
                async content(event, trigger, player) {
                    const num = player.countMark('old_yuheng_count');
                    const skills = (lib.config.extension_活动武将_ShenSunQuan ? lib.skill.bolyuheng.getList() : lib.skill.junkyuheng.derivation).filter(skill => !player.hasSkill(skill));
                    if (!skills.length && !player.storage.old_yuheng.length && trigger.name != 'phaseEnd') return;
                    const gainSkills = async function (player, num, skills) {
                        const gains = skills.randomGets(num);
                        player.markAuto('old_yuheng', gains);
                        await player.addSkills(gains);
                    };
                    const loseSkills = async function (player, num, skills) {
                        const removes = player.getStorage('old_yuheng').randomGets(num);
                        player.unmarkAuto('old_yuheng', removes);
                        await player.removeSkills(removes);
                    };
                    switch (event.triggername) {
                        case 'phaseBegin':
                            await gainSkills(player, num, skills);
                            break;
                        case 'useCardAfter':
                            await gainSkills(player, num, skills);
                            await loseSkills(player, num, skills);
                            break;
                        case 'phaseEnd':
                            await loseSkills(player, num, skills);
                            break;
                    }
                },
                derivation: 'bolyuheng_faq',
                init(player, skill) {
                    player.addSkill(`${skill}_mark`);
                },
                onremove(player, skill) {
                    player.removeSkill(`${skill}_mark`);
                },
                subSkill: {
                    mark: {
                        charlotte: true,
                        trigger: { player: 'phaseBeginStart' },
                        forced: true,
                        popup: false,
                        content() {
                            var list = [player.getHp(), player.getDamagedHp(), game.roundNumber].sort((a, b) => a - b);
                            if (list[1] > 0) {
                                player.addTempSkill('old_yuheng_count');
                                player.setStorage('old_yuheng_count', list[1], true);
                            }
                        },
                    },
                    count: {
                        charlotte: true,
                        onremove: true,
                        intro: { content: '本回合中位数：#' },
                    },
                },
            },
            //保留所有设定的旧美羊羊
            oldhongyi: {
                inherit: 'hongyi',
                audio: 'hongyi',
                filter(event, player) {
                    return player.countDiscardableCards(player, 'he') >= Math.min(2, game.dead.length);
                },
                filterCard: true,
                selectCard() {
                    return Math.min(2, game.dead.length);
                },
                position: 'he',
                check(card) {
                    var num = Math.min(2, game.dead.length);
                    if (!num) return 1;
                    if (num == 1) return 7 - get.value(card);
                    return 5 - get.value(card);
                },
            },
            //赵襄
            xinfanghun: {
                mod: {
                    aiValue(player, card, num) {
                        if (card.name != 'sha' && card.name != 'shan') return;
                        var geti = function () {
                            var cards = player.getCards('hs', card => card.name == 'sha' || card.name == 'shan');
                            return cards.includes(card) ? cards.indexOf(card) : cards.length;
                        };
                        return Math.max(num, [7, 5, 5, 3][Math.min(geti(), 3)]);
                    },
                    aiUseful() {
                        return lib.skill.xinfanghun.mod.aiValue.apply(this, arguments);
                    },
                },
                locked: false,
                audio: 'fanghun',
                enable: ['chooseToUse', 'chooseToRespond'],
                position: 'hs',
                prompt: '将【杀】/【闪】当作【闪】/【杀】使用或打出，然后获得1枚“梅影”标记',
                viewAs(cards, player) {
                    if (cards.length) {
                        var name = false;
                        switch (get.name(cards[0], player)) {
                            case 'sha': name = 'shan'; break;
                            case 'shan': name = 'sha'; break;
                        }
                        if (name) return { name: name };
                    }
                    return null;
                },
                check: (card) => 1,
                filterCard(card, player, event) {
                    event = event || _status.event;
                    var filter = event._backup.filterCard;
                    var name = get.name(card, player);
                    if (name == 'sha' && filter({ name: 'shan', cards: [card] }, player, event)) return true;
                    if (name == 'shan' && filter({ name: 'sha', cards: [card] }, player, event)) return true;
                    return false;
                },
                filter(event, player) {
                    if (event.filterCard(get.autoViewAs({ name: 'sha' }, 'unsure'), player, event) && player.countCards('hs', 'shan')) return true;
                    if (event.filterCard(get.autoViewAs({ name: 'shan' }, 'unsure'), player, event) && player.countCards('hs', 'sha')) return true;
                    return false;
                },
                ai: {
                    respondSha: true,
                    respondShan: true,
                    skillTagFilter(player, tag) {
                        var name;
                        switch (tag) {
                            case 'respondSha': name = 'shan'; break;
                            case 'respondShan': name = 'sha'; break;
                        }
                        if (!player.countCards('hs', name)) return false;
                    },
                    order(item, player) {
                        if (player && _status.event.type == 'phase') return get.order({ name: 'sha' }) + 0.3;
                        return 10;
                    },
                },
                group: 'xinfanghun_add',
                subSkill: {
                    add: {
                        charlotte: true,
                        trigger: { player: ['useCardAfter', 'respondAfter'] },
                        filter(event, player) {
                            return event.skill == 'xinfanghun';
                        },
                        forced: true,
                        popup: false,
                        content() {
                            player.addMark('fanghun', 1);
                        },
                    },
                },
            },
            xinfuhan: {
                derivation: ['ollongdan', 'new_rewusheng', 'new_repaoxiao', 'retieji', 'xinliegong', 'xinkuanggu'],
                audio: 'fuhan',
                trigger: { player: 'phaseZhunbeiBegin' },
                skillAnimation: true,
                animationColor: 'fire',
                forced: true,
                juexingji: true,
                filter(event, player) {
                    return player.countMark('fanghun') >= 4;
                },
                content() {
                    'step 0'
                    player.awakenSkill('xinfuhan');
                    player.clearMark('fanghun');
                    player.gainMaxHp();
                    player.recover();
                    'step 1'
                    player.changeSkills(['ollongdan'], ['xinfanghun']);
                    'step 2'
                    var list = [];
                    for (var i of lib.skill.xinfuhan.derivation) {
                        if (i !== 'ollongdan' && !player.hasSkill(i, null, false, false)) list.push(i);
                    }
                    if (list.length) {
                        if (list.length === 1) event._result = { control: list[0] };
                        else player.chooseControl(list).set('prompt', '选择获得一项技能');
                    }
                    else event.finish();
                    'step 3'
                    if (result.control) player.addSkills(result.control);
                },
            },
            old_jiebing: {
                enable: 'phaseUse',
                usable: 1,
                filter(event, player) {
                    return game.hasPlayer(current => get.info('old_jiebing').filterTarget(null, player, current));
                },
                filterTarget(card, player, target) {
                    return player != target && target.countDiscardableCards(player, 'h') > 2;
                },
                async content(event, trigger, player) {
                    const { target } = event;
                    if (!target.countDiscardableCards(player, 'h')) return;
                    const result = await player.gainPlayerCard(target, 'h', Math.min(target.countCards('h'), 3), true, 'allowChooseAll').forResult();
                    if (result?.cards?.length) {
                        const effect = event.name + '_effect';
                        player.addTempSkill(effect, 'phaseUseAfter');
                        const list = player.getStorage(effect).find(list => list[0] == target);
                        if (!list) player.markAuto(effect, [[target, result.cards]]);
                        else player.storage[effect][player.getStorage(effect).indexOf(list)] = [target, list[1].concat(result.cards)];
                        const skill = `${event.name}_${target.playerid}`;
                        game.addTempTag(skill, `兵·${get.translation(target.name)}`);
                        player.addGaintag(result.cards, skill);
                    }
                },
                ai: {
                    order: 10,
                    result: {
                        player(player, target) {
                            if (player.hp <= 1) return -1;
                            return 1;
                        },
                        target(player, target) {
                            var att = get.attitude(player, target);
                            if (att < 0 && target.countCards('h') >= 3 && player.hp > 1) return att * (20 - target.countCards('h'));
                            return 0;
                        }
                    },
                },
                subSkill: {
                    effect: {
                        mod: {
                            aiOrder(player, card, num) {
                                if (get.itemtype(card) == 'card' && player.getStorage('old_jiebing_effect').some(item => card.hasGaintag(`old_jiebing_${item[0].playerid}`))) return num + 10;
                            },
                        },
                        charlotte: true,
                        onremove(player, skill) {
                            player.getStorage(skill).forEach(item => {
                                if (item[0]) player.removeGaintag(`old_jiebing_${item[0].playerid}`)
                            });
                            delete player.storage[skill];
                        },
                        trigger: { player: 'phaseUseEnd' },
                        forced: true,
                        popup: false,
                        async content(event, trigger, player) {
                            const list = player.getStorage(event.name);
                            player.removeSkill(event.name);
                            for (const target of list.map(item => item[0]).flat().sortBySeat()) {
                                player.removeGaintag(`old_jiebing_${target.playerid}`);
                                const cards = list.find(item => item[0] == target)[1].filter(card => player.getCards('h').includes(card));
                                if (target.isIn() && cards.length) await target.gain(cards, player, 'giveAuto');
                            }
                        },
                        ai: { nokeep: true },
                    }
                }
            },
            old_kuzhan: {
                derivation: 'old_tuidi',
                group: ['old_kuzhan_end', 'old_kuzhan_fail', 'old_kuzhan_mark'],
                dutySkill: true,
                init(player) {
                    player.storage.old_kuzhan ??= [0, 0];
                },
                trigger: { player: 'phaseZhunbeiBegin' },
                filter(event, player) {
                    var num = 0;
                    player.getAllHistory('damage', function (evt) {
                        num += evt.num;
                    });
                    return num >= 5;
                },
                forced: true,
                skillAnimation: true,
                animationColor: 'thunder',
                content() {
                    'step 0'
                    player.awakenSkill('old_kuzhan');
                    player.popup('使命成功', 'wood');
                    game.log(player, '成功完成使命');
                    'step 1'
                    player.unmarkSkill('old_kuzhan_mark');
                    player.addSkills('old_tuidi');
                },
                subSkill: {
                    end: {
                        charlotte: true,
                        trigger: { player: 'phaseJieshu' },
                        filter(event, player) {
                            if (!player.hasSkill('old_kuzhan2')) player.storage.old_kuzhan = [0, 0];
                            return player.getHistory('sourceDamage').length > 0;
                        },
                        forced: true,
                        popup: false,
                        content() {
                            player.storage.old_kuzhan = [0, 0];
                        },
                    },
                    fail: {
                        trigger: { player: 'phaseEnd' },
                        filter(event, player) {
                            var bool = true;
                            for (var i of player.storage.old_kuzhan) {
                                if (i == 0) bool = false;
                            }
                            return bool;
                        },
                        forced: true,
                        content() {
                            'step 0'
                            player.popup('使命失败', 'fire');
                            game.log(player, '使命失败');
                            player.awakenSkill('old_kuzhan');
                            'step 1'
                            player.unmarkSkill('old_kuzhan_mark');
                        },
                    },
                    mark: {
                        charlotte: true,
                        intro: { content: '本局游戏已受到#点伤害' },
                        trigger: { player: 'damage' },
                        firstDo: true,
                        forced: true,
                        popup: false,
                        content() {
                            var num = 0;
                            player.getAllHistory('damage', function (evt) {
                                num += evt.num;
                            });
                            player.storage.old_kuzhan_mark = num;
                            player.markSkill('old_kuzhan_mark');
                            player.syncStorage('old_kuzhan_mark');
                        },
                    },
                },
            },
            old_kuzhan2: { charlotte: true },
            old_tuidi: {
                trigger: { source: 'damageSource' },
                filter(event, player) {
                    return event.player.isIn() && event.player != player && lib.skill.drlt_jueyan.filter(null, event.player);
                },
                check(event, player) {
                    return get.attitude(player, event.player) < 0;
                },
                logTarget: 'player',
                content() {
                    var list = [];
                    for (var i = 1; i <= 5; i++) {
                        if (trigger.player.hasEnabledSlot(i)) list.add(i);
                    }
                    if (list.includes('equip3') && list.includes('equip4')) list.push('equip3_4');
                    list.remove('equip3');
                    list.remove('equip4');
                    var num = list.randomGet();
                    if (num != '3_4') trigger.player.disableEquip(num);
                    else trigger.player.disableEquip(3, 4);
                },
            },
            old_qixi: {
                audio: 'sbqixi',
                inherit: 'qixi',
                enable: 'chooseToUse',
                group: 'old_qixi_guohe',
                contentx() {
                    const cards = target.getDiscardableCards(player, 'hej');
                    if (cards.length > 0) target.discard(cards).discarder = player;
                },
                subSkill: {
                    guohe: {
                        audio: 'sbqixi',
                        trigger: { player: 'guoheBegin' },
                        filter(event, player) {
                            const evt = event.getParent();
                            if (evt.type !== 'card') return false;
                            return evt.card.name == 'guohe' && evt.card.isCard && evt.cards.length === 1;
                        },
                        prompt2: '强化【过河拆桥】的效果',
                        check(event, player) {
                            let position = ['h', 'e', 'j'];
                            for (let i = 0; i < position.length; i++) {
                                if (!target.countDiscardableCards(player, position[i])) position.splice(i--, 1);
                            }
                            position = position.join('');
                            return get.effect(target, { name: 'guohe_copy', position }, player, player) > 0;
                        },
                        logTarget: 'target',
                        content() {
                            trigger.setContent(lib.skill.old_qixi.contentx);
                        },
                    },
                },
            },
            old_fenwei: {
                limited: true,
                audio: 'sbfenwei',
                trigger: { global: 'useCardToPlayered' },
                filter(event, player) {
                    if (event.getParent().triggeredTargets3.length > 1) return false;
                    if (get.type(event.card) != 'trick') return false;
                    if (get.info(event.card).multitarget) return false;
                    if (event.targets.length < 2) return false;
                    return true;
                },
                skillAnimation: true,
                animationColor: 'wood',
                async cost(event, trigger, player) {
                    event.result = await player.chooseTarget(get.prompt(event.skill), '令' + get.translation(trigger.card) + '对任意名角色无效', [1, trigger.targets.length], (card, player, target) => {
                        return _status.event.targets.includes(target);
                    }).set('ai', target => {
                        var trigger = _status.event.getTrigger();
                        return -get.effect(target, trigger.card, trigger.player, _status.event.player);
                    }).set('targets', trigger.targets).forResult();
                },
                async content(event, trigger, player) {
                    player.awakenSkill(event.name);
                    trigger.getParent().excluded.addArray(event.targets);
                    const num = Math.min(4, event.targets.length);
                    const cards = [];
                    for (let i = 0; i < num; i++) {
                        const card = get.cardPile2(card => {
                            return !cards.includes(card) && card.name == 'guohe';
                        });
                        if (card) cards.push(card);
                        else break;
                    }
                    if (cards.length) await player.gain(cards, 'gain2');
                },
            },
            bilibili_liangjunxiangchi: {
                mod: {
                    maxHandcard(player, num) {
                        if (game.roundNumber <= 4) return num + game.roundNumber;
                    },
                },
                trigger: { source: 'damageBegin1' },
                charlotte: true,
                silent: true,
                forced: true,
                filter(event, player) {
                    if (game.roundNumber <= 4) return false;
                    var evt2 = event.getParent('phaseUse');
                    if (evt2.player != player) return false;
                    return player.getHistory('useCard', function (evt) {
                        return evt.card.name == 'sha' && evt.getParent('phaseUse') == evt2;
                    }).indexOf(event.getParent()) == 0;
                },
                content() {
                    trigger.num++;
                },
            },
            bilibili_xutuhuanjin: {
                trigger: { player: 'phaseUseEnd' },
                forced: true,
                filter(event, player) {
                    if (player.getHistory('useCard', function (evt) {
                        return evt.card && evt.card.name == 'sha' && evt.getParent('phaseUse') == event;
                    }).length > 0) return false;
                    if (player.getHistory('respond', function (evt) {
                        return evt.card && evt.card.name == 'sha' && evt.getParent('phaseUse') == event;
                    }).length > 0) return false;
                    return true;
                },
                content() {
                    player.addTempSkill('bilibili_xutuhuanjin_yingzi', { player: 'phaseDrawAfter' });
                    player.addMark('bilibili_xutuhuanjin_yingzi', 1, false);
                },
                subSkill: {
                    yingzi: {
                        charlotte: true,
                        onremove: true,
                        mark: true,
                        marktext: '缓',
                        intro: { content: '下个摸牌阶段多摸#张牌' },
                        trigger: { player: 'phaseDrawBegin2' },
                        filter(event, player) {
                            return !event.numFixed && player.hasMark('bilibili_xutuhuanjin_yingzi');
                        },
                        forced: true,
                        content() {
                            trigger.num += player.countMark('bilibili_xutuhuanjin_yingzi');
                        },
                    },
                },
            },
            bilibili_jianshoudaiyuan: {
                charlotte: true,
                mod: {
                    aiValue(player, card, num) {
                        if (card.name != 'sha' && card.name != 'shan') return;
                        var geti = function () {
                            var cards = player.getCards('hs', function (card) {
                                return card.name == 'sha' || card.name == 'shan';
                            });
                            if (cards.includes(card)) {
                                return cards.indexOf(card);
                            }
                            return cards.length;
                        };
                        return Math.max(num, [7, 5, 5, 3][Math.min(geti(), 3)]);
                    },
                    aiUseful() {
                        return lib.skill.bilibili_jianshoudaiyuan.mod.aiValue.apply(this, arguments);
                    },
                },
                locked: false,
                enable: ['chooseToUse', 'chooseToRespond'],
                position: 'hs',
                prompt: '将【杀】当作【闪】，或将【闪】当作的【杀】使用或打出，然后你的下个弃牌阶段的手牌上限-1',
                viewAs(cards, player) {
                    if (cards.length) {
                        var name = false;
                        switch (get.name(cards[0], player)) {
                            case 'sha': name = 'shan'; break;
                            case 'shan': name = 'sha'; break;
                        }
                        if (name) return { name: name };
                    }
                    return null;
                },
                onuse(links, player) {
                    player.addTempSkill('bilibili_jianshoudaiyuan_less', { player: 'phaseDiscardAfter' });
                    player.addMark('bilibili_jianshoudaiyuan_less', 1, false);
                    player.markSkill('bilibili_jianshoudaiyuan_less');
                },
                onrespond(links, player) {
                    player.addTempSkill('bilibili_jianshoudaiyuan_less', { player: 'phaseDiscardAfter' });
                    player.addMark('bilibili_jianshoudaiyuan_less', 1, false);
                    player.markSkill('bilibili_jianshoudaiyuan_less');
                },
                check(card) {
                    var player = _status.event.player;
                    if (_status.event.type == 'phase') {
                        var max = 0;
                        var name2;
                        var list = ['sha'];
                        var map = { sha: 'shan' };
                        for (var i = 0; i < list.length; i++) {
                            var name = list[i];
                            if (player.countCards('hs', map[name]) && player.getUseValue({ name: name }) > 0) {
                                var temp = get.order({ name: name });
                                if (temp > max) {
                                    max = temp;
                                    name2 = map[name];
                                }
                            }
                        }
                        if (name2 == get.name(card, player)) return 1;
                        return 0;
                    }
                    return 1;
                },
                filterCard(card, player, event) {
                    event = event || _status.event;
                    var filter = event._backup.filterCard;
                    var name = get.name(card, player);
                    if (name == 'sha' && filter({ name: 'shan', cards: [card] }, player, event)) return true;
                    if (name == 'shan' && filter({ name: 'sha', cards: [card] }, player, event)) return true;
                    return false;
                },
                filter(event, player) {
                    var filter = event.filterCard;
                    if (filter(get.autoViewAs({ name: 'sha' }, 'unsure'), player, event) && player.countCards('hs', 'shan')) return true;
                    if (filter(get.autoViewAs({ name: 'shan' }, 'unsure'), player, event) && player.countCards('hs', 'sha')) return true;
                    return false;
                },
                ai: {
                    respondSha: true,
                    respondShan: true,
                    skillTagFilter(player, tag) {
                        var name;
                        switch (tag) {
                            case 'respondSha': name = 'shan'; break;
                            case 'respondShan': name = 'sha'; break;
                        }
                        if (!player.countCards('hs', name)) return false;
                    },
                    order: 0.01,
                },
                subSkill: {
                    less: {
                        onremove: true,
                        charlotte: true,
                        market: '守',
                        intro: { content: '手牌上限-#' },
                        mod: {
                            maxHandcard(player, num) {
                                return num - player.countMark('bilibili_jianshoudaiyuan_less');
                            },
                        },
                    },
                },
            },
            bilibili_huoshaowuchao: {
                trigger: { global: 'damageBefore' },
                silent: true,
                firstDo: true,
                filter(event, player) {
                    return !lib.linked.includes(event.nature);
                },
                content() {
                    game.setNature(trigger, 'fire');
                },
            },
            bilibili_liangcaokuifa: {
                trigger: { player: ['useCardAfter', 'phaseDrawBegin'] },
                silent: true,
                filter(event, player) {
                    if (event.name == 'phaseDraw') return true;
                    return player.getHistory('sourceDamage', function (evt) {
                        return evt.card == event.card;
                    }).length > 0;
                },
                content() {
                    if (trigger.name == 'phaseDraw') trigger.num--;
                    else player.draw();
                },
            },
            bilibili_zhanzhuyanwen: {
                trigger: { player: 'phaseBegin' },
                silent: true,
                content() {
                    'step 0'
                    player.chooseUseTarget({
                        name: 'juedou',
                        isCard: true,
                        storage: { nowuxie: true }
                    },
                        '选择一名角色，视为对其使用【决斗】', '或点【取消】失去1点体力');
                    'step 1'
                    if (!result.bool) player.loseHp();
                },
            },
            bilibili_shishengshibai: {
                mod: {
                    aiOrder(player, card, num) {
                        if (_status.bilibili_shishengshibai && _status.bilibili_shishengshibai % 10 == 9) {
                            if (['sha', 'tao', 'guohe', 'shunshou', 'tunliang', 'wuzhong', 'juedou', 'yuanjun'].includes(card.name)) return num + 15;
                        }
                    },
                },
                trigger: {
                    player: ['useCard1', 'useCardToTargeted'],
                },
                silent: true,
                filter(event, player, name) {
                    if (name == 'useCard1') return true;
                    if (!event.parent.bilibili_shishengshibai || event.targets.length != event.parent.triggeredTargets4.length) return false;
                    if (!event.targets || !event.targets.length || ['delay', 'equip'].includes(get.type(event.card))) return false;
                    return true;
                },
                content() {
                    if (event.triggername == 'useCard1') {
                        _status.bilibili_shishengshibai ??= 0;
                        _status.bilibili_shishengshibai++;
                        game.broadcastAll(function (num) {
                            if (ui.bolGuanDuInfo) ui.bolGuanDuInfo.innerHTML = '当前事件：十胜十败（' + num + '）';
                        }, _status.bilibili_shishengshibai);
                        if (_status.bilibili_shishengshibai % 10 == 0) trigger.bilibili_shishengshibai = true;
                    }
                    else {
                        trigger.getParent().targets = trigger.getParent().targets.concat(trigger.targets);
                        trigger.getParent().triggeredTargets4 = trigger.getParent().triggeredTargets4.concat(trigger.targets);
                    }
                },
                ai: {
                    result: {
                        player(card, player, target) {
                            if (_status.bilibili_shishengshibai && _status.bilibili_shishengshibai % 10 == 9 && card.name == 'tiesuo') return 'zerotarget';
                        },
                    },
                },
            },
            bilibili_yiruoshengqiang: {
                charlotte: true,
                trigger: { source: 'damageBegin2' },
                filter(event, player) {
                    return event.player.hp > player.hp;
                },
                forced: true,
                silent: true,
                content() {
                    trigger.num++;
                },
            },
            bilibili_shichongerjiao: {
                charlotte: true,
                trigger: { player: 'phaseJieshu' },
                filter(event, player) {
                    return lib.skill.bilibili_shichongerjiao.filterx(event, player) || lib.skill.bilibili_shichongerjiao.filtery(event, player);
                },
                filterx(event, player) {
                    return player.isMaxHp();
                },
                filtery(event, player) {
                    return player.isMaxHandcard();
                },
                forced: true,
                silent: true,
                content() {
                    var bool1 = lib.skill.bilibili_shichongerjiao.filterx(trigger, player);
                    var bool2 = lib.skill.bilibili_shichongerjiao.filtery(trigger, player);
                    if (bool1) player.chooseToDiscard('he', true);
                    if (bool2) player.loseHp();
                },
            },
            lzlianpian: {
                audio: 'xinfu_lianpian',
                trigger: { global: 'useCardToPlayered' },
                filter(event, player) {
                    if (!(get.mode() === 'identity' ? get.attitude(player, event.player) > 0 : event.player.isFriendOf(player))) return false;
                    if (!event.targets || !event.targets.length || !event.isFirstTarget || !event.isPhaseUsing(event.player)) return false;
                    var evt = event.player.getLastUsed(1);
                    if (!evt || !evt.targets || !evt.targets.length || !evt.isPhaseUsing(event.player)) return false;
                    return evt.targets.containsSome(...event.targets);
                },
                frequent: true,
                logTarget: 'player',
                content() {
                    trigger.player.draw();
                    if (trigger.player != player) player.addExpose(0.2);
                },
                global: 'lzlianpian_ai',
                subSkill: {
                    ai: {
                        mod: {
                            aiOrder(player, card, num) {
                                if (player != _status.currentPhase || player.getHistory('useCard').length < 1 || !game.hasPlayer(function (current) {
                                    return (get.realAttitude || get.attitude)(current, player) > 0 && current.hasSkill('lzlianpian');
                                })) return;
                                if (player.isPhaseUsing()) {
                                    var evt = player.getLastUsed();
                                    if (evt?.targets && evt.targets.length && evt.isPhaseUsing(player) && game.hasPlayer(function (current) {
                                        return evt.targets.includes(current) && player.canUse(card, current) && get.effect(current, card, player, player) > 0;
                                    })) return num + 10;
                                }
                            },
                        },
                    },
                },
                //这么臭的苏飞有存在的必要吗
                ai: { threaten: 4.1145141919810 },
            },
            lztunjiang: {
                audio: 'sptunjiang',
                trigger: { global: 'phaseJieshuBegin' },
                filter(event, player) {
                    if (!event.player.hasHistory('damage')) return false;
                    return get.mode() === 'identity' ? get.attitude(player, event.player) > 0 : event.player.isFriendOf(player);
                },
                async cost(event, trigger, player) {
                    event.result = await player.chooseTarget((card, player, target) => {
                        return target == player || target == _status.event.source;
                    }, '屯江：请选择一个目标令其摸两张牌').set('ai', target => {
                        return 114514 - target.countCards('h');
                    }).set('source', trigger.player).forResult();
                },
                async content(event, trigger, player) {
                    await event.targets[0].draw(2);
                },
            },
            lzdianhu: {
                audio: 'xinfu_dianhu',
                trigger: {
                    global: 'phaseBefore',
                    player: 'enterGame',
                },
                filter(event, player) {
                    if (!game.hasPlayer(target => target !== player && !target.hasSkill('lzdianhu2'))) return false;
                    return event.name !== 'phase' || game.phaseNumber === 0;
                },
                forced: true,
                content() {
                    'step 0'
                    player.chooseTarget('请选择【点虎】的目标', lib.translate.lzdianhu_info, (card, player, target) => {
                        return target != player && !target.hasSkill('lzdianhu2');
                    }, true).set('ai', target => {
                        var att = get.attitude(_status.event.player, target);
                        if (att < 0) return -att + 3;
                        return 1 + Math.random();
                    });
                    'step 1'
                    if (result?.bool && result.targets?.length) {
                        var target = result.targets[0];
                        player.line(target, 'green');
                        game.log(target, '成为了', '#g【点虎】', '的目标');
                        target.setStorage('lzdianhu_mark', player, true);
                        target.addSkill('lzdianhu_mark');
                    }
                },
                group: 'lzdianhu_draw',
                subSkill: {
                    draw: {
                        audio: 'xinfu_dianhu',
                        trigger: { player: 'damageEnd' },
                        filter(event, player) {
                            if (!event.source?.isIn() || event.player.storage.lzdianhu_mark !== player) return false;
                            return get.mode() === 'identity' ? get.attitude(player, event.source) > 0 : event.source.isFriendOf(player);
                        },
                        forced: true,
                        logTarget: 'source',
                        getIndex: event => event.num || 1,
                        content() {
                            trigger.source.draw();
                        },
                        onremove: true,
                    },
                    mark: {
                        charlotte: true,
                        onremove: true,
                        mark: 'character',
                        intro: { content: '当你受到来自$及其友方角色的1点伤害后，伤害来源摸一张牌' },
                    },
                },
            },
            lzxingzhao: {
                audio: 'xinfu_xingzhao',
                trigger: { global: 'useCard' },
                filter(event, player) {
                    if (get.type(event.card) !== 'equip') return false;
                    return player.countMark('lzxingzhao') >= 4 && player.getFriends(true).includes(event.player);
                },
                forced: true,
                logTarget: 'player',
                content() {
                    trigger.player.draw();
                },
                mark: true,
                intro: {
                    markcount(storage = 0, player) {
                        let num = storage || 0, max = [2, 4, 6, 12].find(num2 => num < num2) || 12;
                        return `${num}${max ? `/${max}` : ''}`;
                    },
                    content(storage = 0, player) {
                        let num = storage || 0;
                        var str = '<li>当前总共造成了';
                        str += num;
                        str += '点伤害。';
                        if (num < 2) {
                            str += '<li>距离“所有友方角色视为拥有技能〖恂恂〗”还需要造成';
                            str += 2 - num;
                            str += '点伤害。';
                        }
                        if (num >= 2) {
                            str += '<br><li>所有友方角色视为拥有技能〖恂恂〗。';
                        }
                        if (num < 4) {
                            str += '<li>距离“所有友方角色使用装备牌时摸一张牌”还需要造成';
                            str += 4 - num;
                            str += '点伤害。';
                        }
                        if (num >= 4) {
                            str += '<br><li>所有友方角色使用装备牌时摸一张牌。';
                        }
                        if (num < 6) {
                            str += '<li>距离“所有友方角色始终跳过弃牌阶段”还需要造成';
                            str += 6 - num;
                            str += '点伤害。';
                        }
                        if (num >= 6) {
                            str += '<br><li>所有友方角色始终跳过弃牌阶段。';
                        }
                        if (num < 12) {
                            str += '<li>距离“每轮开始时，你所属的阵营直接获得游戏胜利”还需要造成';
                            str += 12 - num;
                            str += '点伤害。';
                        }
                        if (num >= 12) {
                            str += '<br><li>每轮开始时，你所属的阵营直接获得游戏胜利。';
                        }
                        return str;
                    },
                },
                init(player, skill) {
                    player.addSkill(`${skill}_mark`);
                    let list = game.filterPlayer2(i => i.isFriendOf(player), [], true);
                    let num = list.reduce((sum, i) => {
                        i.getAllHistory('sourceDamage', evt => sum += evt.num);
                        return sum;
                    }, 0);
                    player.setStorage(skill, num, true);
                },
                onremove(player, skill) {
                    player.removeSkill(`${skill}_mark`);
                },
                derivation: 'xz_xunxun',
                group: ['lzxingzhao_xunxun', 'lzxingzhao_skip', 'lzxingzhao_win'],
                subSkill: {
                    mark: {
                        charlotte: true,
                        onremove: true,
                        trigger: { global: 'damage' },
                        silent: true,
                        forceOut: true,
                        content() {
                            const skill = 'lzxingzhao';
                            lib.skill[skill].init(player, skill);
                        },
                    },
                    xunxun: {
                        audio: 'xz_xunxun',
                        trigger: { global: 'phaseDrawBegin1' },
                        filter(event, player) {
                            if (event.player.hasSkill('xunxun')) return false;
                            return player.countMark('lzxingzhao') >= 2 && player.getFriends(true).includes(event.player);
                        },
                        async cost(event, trigger, player) {
                            event.result = await trigger.player.chooseBool(get.prompt2('xz_xunxun')).forResult();
                        },
                        logTarget: 'player',
                        content() {
                            const next = game.createEvent('xz_xunxun');
                            next.player = trigger.player;
                            next.setContent(lib.skill.xz_xunxun.content);
                        },
                    },
                    skip: {
                        audio: 'xinfu_xingzhao',
                        trigger: { global: 'phaseDiscardBefore' },
                        filter(event, player) {
                            let list = game.filterPlayer2(i => i.isFriendOf(player), [], true);
                            return player.countMark('lzxingzhao') >= 6 && player.getFriends(true).includes(event.player);
                        },
                        forced: true,
                        logTarget: 'player',
                        content() {
                            trigger.cancel();
                            game.log(trigger.player, '跳过了弃牌阶段');
                        },
                    },
                    win: {
                        audio: 'xinfu_xingzhao',
                        trigger: { global: 'roundStart' },
                        filter(event, player) {
                            let list = game.filterPlayer2(i => i.isFriendOf(player), [], true);
                            return player.countMark('lzxingzhao') >= 12;
                        },
                        forced: true,
                        skillAnimation: true,
                        animationColor: 'water',
                        content() {
                            const me = game.me._trueMe || game.me;
                            const winners = game.filterPlayer2(i => i.isFriendOf(player), [], true);
                            game.over(player === me || winners.includes(me));
                        },
                    },
                },
            },
            boss_tz: {
                charlotte: true,
                subSkill: {
                    sha: {
                        nopop: true,
                        charlotte: true,
                        mod: {
                            cardUsable(card, player, num) {
                                if (card.name == 'sha') return num + 1;
                            },
                        },
                    },
                    draw: {
                        nopop: true,
                        charlotte: true,
                        trigger: { player: 'phaseDrawBegin2' },
                        filter(event, player) {
                            return !event.numFixed;
                        },
                        silent: true,
                        content() {
                            trigger.num++;
                        },
                    },
                    chongsheng: {
                        charlotte: true,
                        enable: 'chooseToUse',
                        mark: true,
                        limited: true,
                        skillAnimation: true,
                        animationColor: 'orange',
                        filter(event, player) {
                            if (event.type == 'dying') return player === event.dying;
                            return false;
                        },
                        content() {
                            'step 0'
                            player.awakenSkill('boss_tz_chongsheng');
                            player.discard(player.getCards('j'));
                            'step 1'
                            player.link(false);
                            player.turnOver(false);
                            'step 2'
                            player.drawTo(5);
                            player.recoverTo(5);
                        },
                        ai: {
                            order: 10,
                            save: true,
                            skillTagFilter(player, arg, target) {
                                if (player !== target) return false;
                            },
                            result: { player: 1 },
                        },
                    },
                },
            },
            boss_yz: {
                charlotte: true,
                subSkill: {
                    equip: {
                        charlotte: true,
                        trigger: { global: 'gameDrawAfter' },
                        direct: true,
                        content() {
                            var card = get.cardPile(function (card) {
                                return get.type(card) == 'equip';
                            });
                            if (card) player.chooseUseTarget(card, true, 'nopopup', 'noanimate');
                        },
                    },
                    sha: {
                        nopop: true,
                        charlotte: true,
                        mod: {
                            cardUsable(card, player, num) {
                                if (card.name == 'sha') return num + 1;
                            },
                        },
                    },
                    draw: {
                        nopop: true,
                        charlotte: true,
                        trigger: { player: 'phaseDrawBegin2' },
                        filter(event, player) {
                            return !event.numFixed;
                        },
                        silent: true,
                        content() {
                            trigger.num++;
                        },
                    },
                    kunshou: {
                        charlotte: true,
                        trigger: { player: 'dying' },
                        juexingji: true,
                        skillAnimation: true,
                        animationColor: 'fire',
                        forced: true,
                        content() {
                            'step 0'
                            player.awakenSkill('boss_yz_kunshou');
                            'step 1'
                            if (player.hp < 5) player.recover(5 - player.hp);
                            player.drawTo(5);
                            'step 2'
                            player.addSkills('benghuai');
                        },
                    },
                },
            },
            wzdanji: {
                derivation: 'mashu',
                audio: 'danji',
                skillAnimation: true,
                animationColor: 'water',
                trigger: { player: 'phaseZhunbeiBegin' },
                forced: true,
                juexingji: true,
                filter(event, player) {
                    var zhu = get.zhu(player);
                    if (zhu?.isZhu) {
                        if (lib.translate[zhu.name].indexOf('曹操') != -1 || (zhu.name2 && lib.translate[zhu.name2].indexOf('曹操') != -1)) {
                            if (player.countCards('h') > player.hp) return true;
                        }
                    }
                    return false;
                },
                content() {
                    'step 0'
                    player.awakenSkill('wzdanji');
                    'step 1'
                    player.loseMaxHp();
                    'step 2'
                    player.addSkills('mashu');
                },
            },
            reyingzi_sunce: { audio: 2 },
            yinghun_sunce: { audio: 2 },
            //荀谌
            old_sankuang: {
                init(player) {
                    player.storage.old_sankuang = [1, 1, 1];
                },
                getNum(player, source) {
                    var storage = source.storage.old_sankuang;
                    var list = [3];
                    var num1 = player.countCards('ej');
                    if (storage[0]) list.push(num1);
                    var num2 = player.getDamagedHp();
                    if (storage[1]) list.push(num2);
                    var num3 = Math.abs(player.hp - player.countCards('h'));
                    if (storage[2]) list.push(num3);
                    list.sort((a, b) => a - b);
                    return list.length > 1 ? list[0] : 0;
                },
                findTarget(player) {
                    return player.getAllHistory('useSkill', evt => evt.skill == 'old_sankuang')[0]?.targets?.[0];
                },
                audio: 'clansankuang',
                trigger: { player: 'useCardAfter' },
                filter(event, player) {
                    return get.info('clansankuang').filter(event, player);
                },
                direct: true,
                locked: true,
                content() {
                    'step 0'
                    delete _status.sankuangCheck;
                    player.chooseTarget('请选择【三恇】的目标', lib.dynamicTranslate.old_sankuang(player, event.name), lib.filter.notMe, true).set('ai', function (target) {
                        var player = _status.event.player;
                        var num = lib.skill.old_sankuang.getNum(target, player);
                        if (!lib.skill.old_sankuang.findTarget(player) && game.hasPlayer(function (current) {
                            return player.getFriends().includes(current);
                        })) return get.attitude(player, target) * ((player.getFriends().includes(target) && target.countCards('h')) ? 100 : 1);
                        else {
                            if (!game.hasPlayer(function (current) {
                                return get.attitude(player, current) < 0 && !lib.skill.old_sankuang.getNum(current, player);
                            }) && lib.skill.old_sankuang.findTarget(player).countCards('h') && target == lib.skill.old_sankuang.findTarget(player)) {
                                _status.sankuangCheck = target;
                                return 100;
                            }
                            if (num > 0) return get.effect(target, { name: 'guohe_copy2' }, player, player) * num;
                            return get.attitude(player, target);
                        }
                    }).set('selectTarget', function () {
                        var player = _status.event.player;
                        for (var target of game.filterPlayer()) {
                            if (target == player) continue;
                            target.prompt('三恇' + lib.skill.old_sankuang.getNum(target, player));
                        }
                        return 1;
                    });
                    'step 1'
                    if (result.bool) {
                        var target = event.target = result.targets[0];
                        var cards = event.cards = trigger.cards.filterInD('ode');
                        player.logSkill('old_sankuang', target);
                        if (cards.length > 0) {
                            player.chooseControl().set('choiceList', [
                                '令' + get.translation(target) + '获得' + get.translation(cards),
                                '令' + get.translation(target) + '交给你至少' + get.cnNumber(lib.skill.old_sankuang.getNum(target, player)) + '张牌',
                            ]).set('ai', function () {
                                if (_status.sankuangCheck && _status.sankuangCheck == target) return 1;
                                if (get.attitude(player, target) > 0 && !['delay', 'equip'].includes(_status.event.type)) return 0;
                                return 1;
                            }).set('type', get.type(trigger.card));
                        }
                        else event._result = { index: 1 };
                    }
                    else event.finish();
                    'step 2'
                    if (result.index == 0 && cards.length) target.gain(cards, 'gain2');
                    if (result.index == 1 && target.countCards('he')) {
                        target.chooseToGive('he', [lib.skill.old_sankuang.getNum(target, player), Infinity], true, '交给' + get.translation(player) + '至少' + get.cnNumber(lib.skill.old_sankuang.getNum(target, player)) + '张牌', player).set('ai', function (card) {
                            if (_status.event.att) return 1;
                            return -get.value(card);
                        }).set('att', get.attitude(target, player) > 0 && lib.skill.old_sankuang.findTarget(player) == target);
                    }
                },
            },
            old_beishi: {
                audio: 'clanbeishi',
                trigger: { global: ['loseAfter', 'equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter', 'addToExpansionAfter'] },
                getIndex(event, player) {
                    var list = [player, lib.skill.old_sankuang.findTarget(player)];
                    return game.filterPlayer(function (current) {
                        if (!list.includes(current)) return false;
                        var evt = event.getl(current);
                        return evt?.hs?.length && current.countCards('h') == 0;
                    }).sortBySeat();
                },
                forced: true,
                logTarget: (event, player, name, target) => target,
                content() {
                    'step 0'
                    var storage = player.storage.old_sankuang;
                    var str1 = '', str2 = '', str3 = '';
                    for (var i = 0; i < game.players.length; i++) {
                        var target = game.players.sortBySeat(player)[i];
                        if (target == player) continue;
                        //str1 此角色场上牌数
                        str1 += get.translation(target);
                        str1 += target.countCards('ej');
                        if (i < game.players.length - 1) str1 += '、';
                        str2 += get.translation(target);
                        //str2 此角色已损失体力值
                        str2 += target.getDamagedHp();
                        if (i < game.players.length - 1) str2 += '、';
                        //str3 此角色体力值与手牌数之差
                        str3 += get.translation(target);
                        str3 += Math.abs(target.hp - target.countCards('h'));
                        if (i < game.players.length - 1) str3 += '、';
                    }
                    var choiceList = [
                        '场上牌数<br>' + str1 + '',
                        '已损失体力值<br>' + str2 + '',
                        '体力值与手牌数之差<br>' + str3 + '',
                    ];
                    for (var i = 0; i < choiceList.length; i++) {
                        if (!storage[i]) choiceList[i] = '<span style="opacity:0.5">' + choiceList[i] + '</span>';
                    }
                    player.chooseControl().set('prompt', '卑势：请选择【三恇】需要删除或复原的选项').set('choiceList', choiceList).set('ai', function () {
                        var player = _status.event.player, storage = player.storage.old_sankuang;
                        if (storage[1] == 0) return 1;
                        return [0, 2].randomGet();
                    });
                    'step 1'
                    var storage = player.storage.old_sankuang;
                    game.log(player, (storage[result.index] ? '删除' : '复原') + '了', '#g【三恇】', '的第' + get.cnNumber(result.index + 1, true) + '项');
                    if (storage[result.index]) storage[result.index]--;
                    else storage[result.index]++;
                    'step 2'
                    player.recover();
                },
                ai: { combo: 'old_sankuang' },
            },
            //荀采
            old_lieshi: {
                hiddenCard(player, name) {
                    return lib.inpile.filter(name => get.type(name) == 'delay' && !game.hasPlayer(target => {
                        return target.hasJudge(name);
                    }) && player.countCards('ej', card => game.hasPlayer(target => {
                        return player.canUse(get.autoViewAs({ name: name }, [card]), target);
                    }))).includes(name);
                },
                audio: 'clanlieshi',
                enable: 'chooseToUse',
                filter(event, player) {
                    if (event.old_lieshi) return false;
                    return lib.inpile.some(name => lib.skill.old_lieshi.hiddenCard(player, name));
                },
                chooseButton: {
                    dialog(event, player) {
                        const list = lib.inpile.filter(name => lib.skill.old_lieshi.hiddenCard(player, name));
                        return ui.create.dialog('烈誓', [list, 'vcard']);
                    },
                    filter(button, player) {
                        const evt = _status.event.getParent();
                        return evt.filterCard({ name: button.link[2] }, player, evt);
                    },
                    check(button) {
                        return _status.event.player.getUseValue({ name: button.link[2] });
                    },
                    backup(links, player) {
                        return {
                            viewAs: { name: links[0][2] },
                            filterCard: () => false,
                            selectCard: -1,
                            async precontent(event, trigger, player) {
                                const result = await player.choosePlayerCard(player, 'ej', '请选择' + get.translation(event.result.card) + '转化的卡牌').set('ai', button => {
                                    return get.value(button.link) * (get.position(button.link) == 'e' ? -1 : 1);
                                }).forResult();
                                if (result.cards) {
                                    player.logSkill('old_lieshi');
                                    player.addTempSkill('old_lieshi_end');
                                    event.result.cards = result.cards;
                                }
                                else {
                                    const evt = event.getParent();
                                    evt.old_lieshi = true;
                                    evt.goto(0);
                                    delete evt.openskilldialog;
                                    return;
                                }
                            },
                        }
                    },
                    prompt(links, player) {
                        return '请选择' + get.translation(links[0][2]) + '的目标';
                    },
                },
                ai: {
                    order: 7,
                    result: { player: 1 },
                },
                subSkill: {
                    end: {
                        charlotte: true,
                        trigger: { player: 'useCardAfter' },
                        filter(event, player) {
                            return event.skill == 'old_lieshi_backup';
                        },
                        silent: true,
                        async content(event, trigger, player) {
                            const target = trigger.targets[0];
                            const bool = player.storage.old_huanyin;
                            player.line(target);
                            let choiceList = ['受到1点火属性伤害', '弃置所有【闪】', '弃置所有【杀】'], choice = [];
                            if (bool) {
                                choiceList.reverse();
                                if (player.countCards('h', { name: 'sha' })) choice.push('选项一');
                                else choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + '（无法执行）</span>';
                                if (player.countCards('h', { name: 'shan' })) choice.push('选项二');
                                else choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + '（无法执行）</span>';
                                choice.push('选项三');
                            }
                            else {
                                choice.push('选项一');
                                if (player.countCards('h', { name: 'shan' })) choice.push('选项二');
                                else choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + '（无法执行）</span>';
                                if (player.countCards('h', { name: 'sha' })) choice.push('选项三');
                                else choiceList[2] = '<span style="opacity:0.5">' + choiceList[2] + '（无法执行）</span>';
                            }
                            if (choice.length) {
                                const result = await player.chooseControl(choice).set('choiceList', choiceList).set('ai', () => {
                                    if (get.event().controls.length == 1) return get.event().controls[0];
                                    var choice = get.event().choice, player = get.event().player;
                                    return choice[choice.length - player.storage.old_huanyin ? 2 : 1];
                                }).set('prompt', '烈誓：请选择一项执行，然后' + get.translation(target) + '执行后一项').set('choice', choice).forResult();
                                const index = ['选项一', '选项二', '选项三'].indexOf(result.control);
                                const list = [[player, index], [target, index + 1]];
                                for (const CT of list) {
                                    const current = CT[0], num = CT[1];
                                    if (num <= 2) {
                                        switch (num) {
                                            case 0:
                                                if (bool) current.discard(current.getCards('h', { name: 'sha' }));
                                                else current.damage(1, 'fire');
                                                break;
                                            case 1:
                                                current.discard(current.getCards('h', { name: 'shan' }));
                                                break;
                                            case 2:
                                                if (bool) current.damage(1, 'fire');
                                                else current.discard(current.getCards('h', { name: 'sha' }));
                                                break;
                                        }
                                    }
                                }
                            }
                            else {
                                player.chat('无法执行？！');
                                game.log('但', player, '无法执行其中的任何选项！');
                            }
                        },
                    },
                },
            },
            old_dianzhan: {
                audio: 'clandianzhan',
                trigger: { player: 'useCardAfter' },
                filter(event, player) {
                    if (!lib.suit.includes(get.suit(event.card))) return false;
                    const suit = get.suit(event.card);
                    return player.getRoundHistory('useCard', evt => get.suit(evt.card) == suit).indexOf(event) == 0;
                },
                forced: true,
                filter_x(event, player) {
                    if (!get.suit(event.card)) return false;
                    return player.countCards('h', { suit: get.suit(event.card) });
                },
                content_x() {
                    'step 0'
                    player.chooseCard('h', '请重铸一张' + get.translation(get.suit(card)) + '牌', true, function (cardx, player) {
                        return get.suit(cardx) == _status.event.suit && player.canRecast(cardx);
                    }).set('suit', get.suit(card));
                    'step 1'
                    if (result.bool) player.recast(result.cards);
                },
                content() {
                    'step 0'
                    if (player.storage.old_huanyin) player.draw();
                    else if (lib.skill.old_dianzhan.filter_x(trigger, player)) {
                        var next = game.createEvent('old_dianzhan_x');
                        next.player = player;
                        next.card = trigger.card;
                        next.setContent(lib.skill.old_dianzhan.content_x);
                    }
                    else event.finish();
                    'step 1'
                    game.delayx();
                    'step 2'
                    if (trigger.targets?.length == 1 && !trigger.targets[0].isLinked()) {
                        player.line(trigger.targets[0]);
                        trigger.targets[0].link(true);
                    }
                    else event.finish();
                    'step 3'
                    game.delayx();
                    'step 4'
                    if (!player.storage.old_huanyin) player.draw();
                    else if (lib.skill.old_dianzhan.filter_x(trigger, player)) {
                        var next = game.createEvent('old_dianzhan_x');
                        next.player = player;
                        next.card = trigger.card;
                        next.setContent(lib.skill.old_dianzhan.content_x);
                    }
                },
            },
            old_huanyin: {
                audio: 'clanhuanyin',
                trigger: { player: 'dying' },
                forced: true,
                content() {
                    'step 0'
                    player.storage.old_huanyin = !player.storage.old_huanyin;
                    game.log(player, '倒置了技能', '#g【烈誓】', '和', '#g【点盏】');
                    'step 1'
                    if (player.countCards('h') < 4) player.drawTo(4);
                },
            },
            //荀粲
            old_yunshen: {
                audio: 'clanyunshen',
                enable: 'phaseUse',
                filter(event, player) {
                    return game.hasPlayer(function (target) {
                        return target.isDamaged() && target != player;
                    });
                },
                filterTarget(card, player, target) {
                    return target.isDamaged() && target != player;
                },
                usable: 2,
                content() {
                    'step 0'
                    target.recover();
                    'step 1'
                    var str = get.translation(target);
                    if (player.hasSkill('old_yunshen_0')) result.index = 1;
                    else if (player.hasSkill('old_yunshen_1')) result.index = 0;
                    else player.chooseControl().set('choiceList', [
                        '视为' + str + '对自己使用一张冰【杀】',
                        '视为对' + str + '一张使用冰【杀】',
                    ]).set('ai', function () {
                        var evt = _status.event.getParent(), player = evt.player, target = evt.target;
                        var card = { name: 'sha', nature: 'ice', isCard: true }, att = get.attitude(player, target) > 0;
                        var eff1 = get.effect(target, card, player, player), eff2 = get.effect(player, card, target, player);
                        return eff1 >= eff2 ? 0 : 1;
                    });
                    'step 2'
                    player.addTempSkill('old_yunshen_' + result.index, 'phaseUseAfter');
                    var list = [player, target];
                    if (result.index == 1) list.reverse();
                    if (list[1].isIn() && list[0].isIn() && list[1].canUse('sha', list[0], false)) list[1].useCard({ name: 'sha', nature: 'ice', isCard: true }, list[0], false, 'noai');
                },
                ai: {
                    order: 1,
                    expose: 0.3,
                    result: {
                        player(player, target) {
                            return get.recoverEffect(target, player, player);
                        },
                    },
                },
                subSkill: {
                    '0': { charlotte: true },
                    '1': { charlotte: true },
                },
            },
            old_shangshen: {
                audio: 'clanshangshen',
                trigger: { global: 'damageEnd' },
                filter(event, player) {
                    return event.hasNature() && event.player.isIn();
                },
                check(event, player) {
                    return player.countCards('j') || (get.attitude(player, event.player) > 0 && event.player.countCards('h') < 4);
                },
                logTarget: 'player',
                content() {
                    'step 0'
                    var target = trigger.player;
                    event.target = target;
                    event.videoId = lib.status.videoId++;
                    var func = function (player, id) {
                        var list = [
                            '获得你场上的所有牌',
                            '将' + get.translation(target) + '的一张牌当作一张随机延时锦囊牌对你使用',
                            '令' + get.translation(target) + '将手牌数补至四张',
                        ];
                        var choiceList = ui.create.dialog('伤神：请选择两项');
                        choiceList.videoId = id;
                        for (var i = 0; i < list.length; i++) {
                            var str = '<div class="popup text" style="width:calc(100% - 10px);display:inline-block">';
                            str += list[i];
                            str += '</div>';
                            var next = choiceList.add(str);
                            next.firstChild.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', ui.click.button);
                            next.firstChild.link = i;
                            //for(var j in lib.element.button){
                            //next[j]=lib.element.button[j];
                            //}
                            //还是手搓带劲儿
                            Object.setPrototypeOf(next, lib.element.Button.prototype);
                            choiceList.buttons.add(next.firstChild);
                        }
                        return choiceList;
                    };
                    if (player.isOnline2()) {
                        player.send(func, player, event.videoId);
                    }
                    event.dialog = func(player, event.videoId);
                    if (player != game.me || _status.auto) {
                        event.dialog.style.display = 'none';
                    }
                    var att = get.attitude(player, trigger.player);
                    var next = player.chooseButton();
                    next.set('dialog', event.videoId);
                    next.set('forced', true);
                    next.set('selectButton', 2);
                    next.set('target', target);
                    next.set('ai', button => {
                        var player = _status.event.player;
                        var target = _status.event.target;
                        switch (button.link) {
                            case 0:
                                if (player.countCards('j')) return 3;
                                return 1;
                                break;
                            case 1:
                                return 1.5;
                                break;
                            case 2:
                                if (get.attitude(player, target) > 0) return 2;
                                return 0;
                                break;
                        }
                    });
                    'step 1'
                    if (player.isOnline2()) player.send('closeDialog', event.videoId);
                    event.dialog.close();
                    result.links.sort();
                    for (var i of result.links) game.log(player, '选择了', '#g【伤神】', '的', '#y选项' + get.cnNumber(1 + i, true));
                    if (result.links.includes(0)) player.gain(player.getCards('ej'), 'gain2');
                    event.links = result.links;
                    'step 2'
                    if (event.links.includes(1)) {
                        player.choosePlayerCard(target, 'he', true).set('ai', function (button) {
                            const { player, target } = get.event();
                            const att = get.attitude(player, target);
                            return get.effect(player, button.link, player, player) * (att > 0 ? -1 : 1);
                        });
                    }
                    else event.goto(4);
                    'step 3'
                    if (result.bool) {
                        var list = [];
                        for (var name of lib.inpile) {
                            if (get.type(name) != 'delay') continue;
                            if (target.canUse({ name: name }, player)) list.push(name);
                        }
                        if (list.length) {
                            var card = result.cards[0];
                            var cardx = get.autoViewAs({ name: list.randomGet() }, [card]);
                            target.useCard(cardx, [card], player, false);
                        }
                    }
                    'step 4'
                    if (event.links.includes(2) && target.countCards('h') < 4) target.drawTo(4);
                },
            },
            old_fenchai: {
                audio: 'clanfenchai',
                init(player, skill) {
                    if (player.getStorage(skill).length > 0) return;
                    const history = player.getHistory('useSkill', evt => {
                        if (evt.type != 'player') return false;
                        const skill = get.sourceSkillFor(evt), targets = evt.targets;
                        const info = get.info(skill);
                        if (!info || info.charlotte) return false;
                        return targets?.some(i => player.differentSexFrom(i));
                    });
                    if (history.length) {
                        const { targets } = history[0];
                        player.markAuto(skill, targets.filter(i => player.differentSexFrom(i)));
                    }
                },
                trigger: { player: ['logSkillBegin', 'useSkill'] },
                filter(event, player) {
                    if (event.type != 'player') return false;
                    const { targets } = event;
                    if (!targets?.length) return false;
                    const info = get.info(get.sourceSkillFor(event));
                    if (!info || info.charlotte) return false;
                    if (player.getStorage('old_fenchai').length) return false;
                    return targets.filter(i => player.differentSexFrom(i)).length > 0;
                },
                forced: true,
                silent: true,
                async content(event, trigger, player) {
                    player.markAuto(event.name, trigger.targets.filter(i => player.differentSexFrom(i)));
                },
                onremove: true,
                marktext: '钗',
                intro: { content: (storage, player) => '对象：' + get.translation(storage) },
                group: ['old_fenchai_audio', 'old_fenchai_give'],
                global: 'old_fenchai_global',
                subSkill: {
                    audio: {
                        audio: 'clanfenchai',
                        trigger: { global: 'judge' },
                        filter(event, player) {
                            return event.player == player || player.getStorage('old_fenchai').includes(event.player);
                        },
                        forced: true,
                        locked: false,
                        logTarget: 'player',
                        async content(event, trigger, player) { },
                    },
                    global: {
                        mod: {
                            suit(card, suit) {
                                const player = get.owner(card) || get.player();
                                if (!player?.judging || player.judging[0] != card) return;
                                if (player.hasSkill('old_fenchai') || game.hasPlayer(target => target.getStorage('old_fenchai').includes(player))) return 'heart';
                            },
                        },
                    },
                    give: {
                        audio: 'clanfenchai',
                        trigger: { global: 'die' },
                        filter(event, player) {
                            return player.getStorage('old_fenchai').includes(event.player) && event.player.countCards('h');
                        },
                        direct: true,
                        skillAnimation: true,
                        animationColor: 'water',
                        async content(event, trigger, player) {
                            const { player: target } = trigger;
                            const num = Math.ceil(target.countCards('h'));
                            const result = await target.chooseCard('he', [0, num], get.prompt('old_fenchai'), '交给' + get.translation(player) + '至多' + get.cnNumber(num) + '张牌').set('allowChooseAll', true).set('ai', card => {
                                if (get.event().goon) return get.value(card);
                                return -1;
                            }).set('goon', get.attitude(target, player) > 0).set('forceDie', true).forResult();
                            if (result?.bool && result?.cards?.length) {
                                player.logSkill(event.name);
                                target.line(player);
                                game.log(player, '收到了来自', target, '的呼唤');
                                await player.gain(result.cards, target, 'giveAuto').set('forceDie', true);
                            }
                        },
                    }
                },
            },
            //神孙权
            bolyuheng: {
                derivation: 'bolyuheng_faq',
                //全扩技能库
                getList() {
                    if (!_status.characterlist) lib.skill.pingjian.initList();
                    let list = _status.characterlist.filter(name => get.character(name, 1) == 'wu' || (get.is.double(name, true) || []).includes('wu'));
                    const players = game.players.concat(game.dead);
                    for (const player of players) list.removeArray([player.name, player.name1, player.name2]);
                    let skills = [];
                    for (const i of list) {
                        skills.addArray((lib.character[i]?.skills ?? []).filter(skill => {
                            var info = get.info(skill);
                            return info && !info.zhuSkill && !info.hiddenSkill && !info.charlotte && !info.groupSkill && !info.limited && !info.juexingji;
                        }));
                    }
                    return skills;
                },
                group: 'bolyuheng_remove',
                audio: 'yuheng',
                trigger: { player: 'phaseBegin' },
                filter(event, player) {
                    return player.hasCard(card => lib.filter.cardDiscardable(card, player, 'bolyuheng'), 'he');
                },
                forced: true,
                keepSkill: true,
                content() {
                    'step 0'
                    player.chooseToDiscard('he', true, [1, player.getCards('he').reduce((list, card) => list.add(get.suit(card, player)), []).length], function (card, player) {
                        return !ui.selected.cards.reduce((list, card) => list.add(get.suit(card, player)), []).includes(get.suit(card, player));
                    }).set('complexCard', true).set('ai', function (card) {
                        var player = _status.event.player;
                        var list = (lib.config.extension_活动武将_ShenSunQuan ? lib.skill.bolyuheng.getList() : lib.skill.junkyuheng.derivation);
                        if (ui.selected.cards.length >= list.length) return 0;
                        if (!player.hasValueTarget(card)) return 5;
                        return 1 / (get.value(card) || 0.5);
                    });
                    'step 1'
                    if (result.bool) {
                        const list = (lib.config.extension_活动武将_ShenSunQuan ? lib.skill.bolyuheng.getList() : lib.skill.junkyuheng.derivation).filter(skill => !player.hasSkill(skill));
                        const skills = list.randomGets(Math.min(list.length, result.cards.length));
                        player.addAdditionalSkills('bolyuheng', skills);
                    }
                },
                subSkill: {
                    remove: {
                        audio: 'yuheng',
                        trigger: { player: 'phaseEnd' },
                        filter(event, player) {
                            return player.additionalSkills.bolyuheng?.length;
                        },
                        forced: true,
                        content() {
                            const skills = player.additionalSkills.bolyuheng;
                            player.removeAdditionalSkills('bolyuheng');
                            player.draw(skills.length);
                        },
                    },
                },
            },
            boldili: {
                derivation: ['junkshengzhi', 'junkquandao', 'junkchigang'],
                juexingji: true,
                audio: 'dili',
                trigger: {
                    global: 'phaseBefore',
                    player: ['enterGame', 'loseMaxHpEnd', 'gainMaxHpEnd', 'changeSkillsAfter'],
                },
                filter(event, player) {
                    if (event.name == 'phase' && game.phaseNumber > 0) return false;
                    const skills = player.getSkills(null, false, false).filter(i => {
                        const info = get.info(i);
                        return info && !info.charlotte;
                    });
                    return skills.length > player.maxHp;
                },
                forced: true,
                skillAnimation: true,
                animationColor: 'wood',
                content() {
                    'step 0'
                    player.awakenSkill('boldili');
                    player.loseMaxHp();
                    'step 1'
                    var skills = player.getSkills(null, false, false).filter(i => {
                        if (i == 'boldili') return false;
                        var info = get.info(i);
                        return info && !info.charlotte;
                    });
                    if (!skills.length) { event.finish(); return; }
                    var list = [];
                    for (var skill of skills) {
                        list.push([
                            skill,
                            '<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">【' + get.translation(skill) + '】</div><div>' + lib.translate[skill + '_info'] + '</div></div>',
                        ])
                    }
                    var next = player.chooseButton([
                        '请选择失去任意个技能',
                        [list, 'textbutton'],
                    ]);
                    next.set('forced', true);
                    next.set('selectButton', [1, skills.length]);
                    next.set('ai', function (button) {
                        var skill = button.link, skills = _status.event.skills.slice(0);
                        skills.removeArray(['xinanguo', 'lanjiang', 'rezhiheng', 'bolyuheng']);
                        switch (ui.selected.buttons.length) {
                            case 0:
                                if (skills.includes(skill)) return 2;
                                if (skill == 'bolyuheng') return 1;
                                return Math.random();
                            case 1:
                                if (skills.length < 2) return 0;
                                if (skills.includes(skill)) return 2;
                                if (skill == 'bolyuheng') return 1;
                                return 0
                            case 2:
                                if (skills.includes(skill)) return 2;
                                if (skill == 'bolyuheng') return 1;
                                return 0;
                            default: return 0;
                        }
                    });
                    next.set('skills', skills);
                    'step 2'
                    if (result.bool) {
                        var skills = result.links, list = lib.skill.boldili.derivation;
                        game.log(player, '失去了以下技能：', '#g' + get.translation(skills));
                        player.removeSkills(skills.slice(0));
                        player.addSkills(list.slice(0, Math.min(skills.length, list.length)));
                    }
                },
            },
            //张华
            bolchuanwu: {
                audio: 'olchuanwu',
                trigger: { player: 'damageEnd', source: 'damageSource' },
                filter(event, player) {
                    return player.getAttackRange() > 0 && player.getStockSkills(false, true).length;
                },
                forced: true,
                async content(event, trigger, player) {
                    let skills = player.getStockSkills(false, true);
                    const num = Math.min(player.getAttackRange(), skills.length);
                    skills = skills.slice(0, num);
                    await player.removeSkills(skills);
                    if (!player.storage.bolchuanwu_restore) {
                        player.when({ global: 'phaseAfter' }).then(() => {
                            player.changeSkills(player.getStorage('bolchuanwu_restore'), []).set('$handle', (player, skills) => {
                                player.addSkillLog(skills);
                                game.broadcastAll(player => {
                                    player.skills.sort((a, b) => {
                                        const getNum = function (skill, player) {
                                            const skills = player.getStockSkills(true, true);
                                            return skills.includes(skill) ? skills.indexOf(skill) : skills.length;
                                        };
                                        return getNum(a, player) - getNum(b, player);
                                    });
                                }, player);
                                player.update();
                            });
                        }).then(() => delete player.storage.bolchuanwu_restore);
                    }
                    player.markAuto('bolchuanwu_restore', skills.filter(skill => !player.getStorage('bolchuanwu_restore').includes(skill)));
                    await player.draw(num);
                },
            },
            //徐庶
            bolzhuhai: {
                audio: 'rezhuhai',
                trigger: { global: 'phaseJieshuBegin' },
                filter(event, player) {
                    if (event.player == player || !event.player.getHistory('sourceDamage').length || !event.player.isIn()) return false;
                    return player.hasCard(card => {
                        if (_status.connectMode) return true;
                        return ['sha', 'juedou'].some(name => game.checkMod(card, player, 'unchanged', 'cardEnabled2', player) !== false && player.canUse(get.autoViewAs({ name: name }, [card]), event.player, false));
                    }, 'hs');
                },
                direct: true,
                async content(event, trigger, player) {
                    const target = trigger.player;
                    const list = [['基本', '', 'sha'], ['锦囊', '', 'guohe']];
                    let result = await player.chooseButton([`诛害：请选择要对${get.translation(target)}使用的牌`, [list, 'vcard']]).set('filterButton', button => {
                        const player = get.player();
                        return player.hasCard(card => player.hasUseTarget(get.autoViewAs({ name: button.link[2] }, [card]), false, false), 'hs');
                    }).set('ai', button => {
                        const { player, target } = get.event();
                        const name = button.link[2];
                        let eff1 = get.effect(target, { name: 'sha' }, player, player), eff2 = get.effect(target, { name: 'sha' }, player, player);
                        if (name == 'sha' && eff1 > 0 && ((player.hasSkill('xsqianxin') || player.hasSkill('fh_qianxin')) && player.isDamaged() || eff1 > eff2)) return 1;
                        if (name == 'guohe' && eff2 > 0) return 1;
                        return 0
                    }).set('target', target).forResult();
                    if (result?.bool && result?.links?.length) {
                        const name = result.links[0][2];
                        result = await player.chooseCard('hs', (card, player) => {
                            if (!game.checkMod(card, player, 'unchanged', 'cardEnabled2', player)) return false;
                            const { namex, target } = get.event();
                            return player.canUse(get.autoViewAs({ name: namex }, [card]), target, false);
                        }, '诛害：你可以将一张手牌当作【' + get.translation(name) + '】对' + get.translation(target) + '使用').set('ai', card => {
                            const { player, target, namex } = get.event();
                            return get.effect(target, get.autoViewAs({ name: namex }, [card]), player, player) / Math.max(1, get.value(card));
                        }).set('namex', name).set('target', target).forResult();
                        if (result?.bool && result?.cards?.length) await player.useCard({ name: name }, result.cards, 'bolzhuhai', target, false);
                    }
                },
            },
            //张郃【机先】
            //只因先
            bilibili_zhiyinxian: {
                trigger: { global: 'phaseBegin' },
                filter(event, player) {
                    if (player == event.player) return false;
                    return ['phaseJudge', 'phaseDraw', 'phaseUse', 'phaseDiscard'].some(phaseName => {
                        return !player.getStorage('bilibili_zhiyinxian').includes(phaseName) && !event.player.skipList.includes(phaseName);
                    });
                },
                async cost(event, trigger, player) {
                    const list = ['phaseJudge', 'phaseDraw', 'phaseUse', 'phaseDiscard'].filter(phaseName => {
                        return !player.getStorage(event.skill).includes(phaseName) && !trigger.player.skipList.includes(phaseName);
                    });
                    const result = await player.chooseControl(list, 'cancel2').set('prompt', get.prompt(event.skill, trigger.player)).set('ai', function () {
                        const player = get.player();
                        const target = get.event().getTrigger().player;
                        const att = get.attitude(player, target);
                        if (list.includes('phaseUse') && att < 0 && target.countCards('hs') >= target.hp && !target.hasJudge('lebu')) return 'phaseUse';
                        if (list.includes('phaseDraw') && att < 0 && target.countCards('hs') <= target.hp && !target.hasJudge('bingliang')) return 'phaseDraw';
                        if (list.includes('phaseDiscard') && att > 0 && target.needsToDiscard()) return 'phaseDiscard';
                        if (list.includes('phaseJudge') && att > 0 && target.countCards('j', function (card) {
                            return card.name.indexOf('yanxiao') == -1;
                        })) return 'phaseJudge';
                        return 'cancel2';
                    }).set('prompt2', '跳过' + get.translation(trigger.player) + '的一个阶段').forResult();
                    event.result = {
                        bool: result?.control != 'cancel2',
                        cost_data: result.control,
                    }
                },
                logTarget: 'player',
                async content(event, trigger, player) {
                    const phaseName = event.cost_data;
                    const target = event.targets[0];
                    player.markAuto(event.name, [phaseName]);
                    player.addExpose(0.3);
                    target.skip(phaseName);
                    game.log(target, '的', '#y' + phaseName, '被跳过了');
                },
                onremove: true,
                intro: { content: storage => `已选择阶段：${storage.map(phaseName => get.translation(phaseName)).join('、')}` },
                group: 'bilibili_zhiyinxian_restore',
                subSkill: {
                    restore: {
                        trigger: { source: 'dieAfter' },
                        filter(event, player) {
                            return player.getStorage('bilibili_zhiyinxian').length;
                        },
                        async cost(event, trigger, player) {
                            const list = ['phaseJudge', 'phaseDraw', 'phaseUse', 'phaseDiscard'].filter(phaseName => {
                                return player.getStorage('bilibili_zhiyinxian').includes(phaseName)
                            });
                            const result = await player.chooseControl(list, 'cancel2').set('prompt', get.prompt(event.skill)).set('ai', () => {
                                const list = get.event().controls.slice();
                                if (list.includes('phaseUse')) return 'phaseUse';
                                if (list.includes('phaseDraw')) return 'phaseDraw';
                                if (list.includes('phaseDiscard')) return 'phaseDiscard';
                                if (list.includes('phaseJudge')) return 'phaseJudge';
                                return 'cancel2';
                            }).set('prompt2', '恢复一个已选择过的时机').forResult();
                            event.result = {
                                bool: result?.control != 'cancel2',
                                cost_data: result.control,
                            }
                        },
                        async content(event, trigger, player) {
                            const phaseName = event.cost_data;
                            game.log(player, '恢复了', '#y' + phaseName, '的操作权');
                            player.unmarkAuto('bilibili_zhiyinxian', [phaseName]);
                        },
                    },
                },
            },
            bolhuanshi: {
                inherit: 'olhuanshi',
                prompt2(event, player) {
                    return get.translation(event.player) + '的' + event.judgestr + '判定为' + get.translation(event.player.judging[0]) + '。你可以令其观看你的牌，其选择一张牌进行改判。然后你可以重铸任意张牌。';
                },
                async content(event, trigger, player) {
                    const target = trigger.player, judge = trigger.judge(target.judging[0]), attitude = get.attitude(target, player);
                    const result = await target.choosePlayerCard('请选择代替判定的牌', 'he', 'visible', true, player).set('ai', button => {
                        const card = button.link, judge = get.event().judge, attitude = get.event().attitude;
                        const trigger = get.event().getTrigger(), player = get.event().player, result = trigger.judge(card) - judge;
                        if (result > 0) return 20 + result;
                        if (result == 0) {
                            if (_status.currentPhase == player) return 0;
                            if (attitude >= 0) return get.color(card) == 'red' ? 7 : 0 - get.value(card);
                            return get.color(card) == 'black' ? 10 : 0 + get.value(card);
                        }
                        if (attitude >= 0) return get.color(card) == 'red' ? 0 : -10 + result;
                        return get.color(card) == 'black' ? 0 : -10 + result;
                    }).set('filterButton', button => {
                        const player = get.event().player, card = button.link;
                        const mod2 = game.checkMod(card, player, 'unchanged', 'cardEnabled2', player);
                        if (mod2 != 'unchanged') return mod2;
                        const mod = game.checkMod(card, player, 'unchanged', 'cardRespondable', player);
                        if (mod != 'unchanged') return mod;
                        return true;
                    }).set('judge', judge).set('attitude', attitude).forResult();
                    if (result?.bool && result.links?.length) {
                        const { links } = result;
                        const card = links[0];
                        await player.respond(card, 'highlight', 'noOrdering').set('nopopup', true);
                        if (target.judging[0].clone) {
                            target.judging[0].clone.classList.remove('thrownhighlight');
                            game.broadcast(card => {
                                if (card.clone) card.clone.classList.remove('thrownhighlight');
                            }, target.judging[0]);
                            game.addVideo('deletenode', player, get.cardsInfo([target.judging[0].clone]));
                        }
                        game.cardsDiscard(target.judging[0]);
                        target.judging[0] = card;
                        trigger.orderingCards.add(card);
                        game.log(target, '的判定牌改为', card);
                        await game.delay(2);
                        if (player.countCards('h')) {
                            const result = await player.chooseCard('是否重铸任意张手牌？', [1, player.countCards('h')], lib.filter.cardRecastable).set('ai', card => {
                                const player = get.event().player, cards = ui.selected.cards;
                                if (!player.hasSkill('olmingzhe')) return 5 - get.value(card);
                                if (!cards.some(i => get.color(i, player) == 'red') && get.color(card, player) == 'red') return 7.5 - get.value(card);
                                return 5 - get.value(card);
                            }).set('complexCard', true).forResult();
                            if (result?.bool && result.cards?.length) await player.recast(result.cards);
                        }
                    }
                },
            },
            //程普
            bollihuo: {
                group: 'bollihuo_damage',
                audio: 'lihuo',
                trigger: { player: 'useCard1' },
                filter(event, player) {
                    return event.card.name == 'sha' && !event.card.nature;
                },
                check(event, player) {
                    return player.hp + player.countCards('hs', { name: 'tao' }) > 2;
                },
                content() {
                    game.setNature(trigger.card, 'fire');
                    trigger.card.lhdamaged = true;
                    player.addSkill('bollihuo_target');
                    player.addMark('bollihuo_target', 1, false);
                    var next = game.createEvent('bollihuo_clear');
                    next.player = player;
                    next.card = trigger.card;
                    event.next.remove(next);
                    next.forceDie = true;
                    trigger.after.push(next);
                    next.setContent(function () {
                        delete card.nature;
                        if (card.lhdamaged) delete card.lhdamaged;
                    });
                },
                subSkill: {
                    target: {
                        charlotte: true,
                        onremove: true,
                        intro: { content: '使用火【杀】可以额外指定#个目标' },
                        trigger: { player: 'useCard2' },
                        filter(event, player) {
                            if (event.card.name != 'sha' || !game.hasNature(event.card, 'fire') || !player.hasMark('bollihuo_target')) return false;
                            return game.hasPlayer(function (current) {
                                return !event.targets.includes(current) && player.canUse(event.card, current);
                            });
                        },
                        async cost(event, trigger, player) {
                            event.result = await player.chooseTarget(get.prompt(event.skill), [1, player.countMark(event.skill)], '为' + get.translation(trigger.card) + '增加至多' + get.cnNumber(player.countMark(event.skill)) + '个目标', function (card, player, target) {
                                return !_status.event.sourcex.includes(target) && player.canUse(_status.event.card, target);
                            }).set('sourcex', trigger.targets).set('card', trigger.card).set('ai', function (target) {
                                var player = _status.event.player;
                                return get.effect(target, _status.event.card, player, player);
                            }).forResult();
                        },
                        async content(event, trigger, player) {
                            if (!event.isMine() && !_status.connectMode) await game.delayx();
                            trigger.targets.addArray(event.targets);
                        },
                    },
                    damage: {
                        charlotte: true,
                        trigger: { source: 'damageSource' },
                        filter(event, player) {
                            return event.card?.lhdamaged;
                        },
                        silent: true,
                        async content(event, trigger, player) {
                            player.removeSkill(event.name);
                            const result = player.countCards('he') < 2 ? { bool: false } : await player.chooseToDiscard(2, 'he', '选择弃置两张牌，否则失去1点体力').set('goon', get.effect(player, { name: 'losehp' }, player, player) > 0).set('ai', card => {
                                if (get.event().goon) return 0;
                                return 6 - get.value(card);
                            }).forResult();
                            if (!result?.bool) await player.loseHp();
                        },
                    },
                },
            },
            bolchunlao: {
                marktext: '醇',
                intro: {
                    content: 'expansion',
                    markcount: 'expansion',
                },
                onremove(player, skill) {
                    var cards = player.getExpansions(skill);
                    if (cards.length) player.loseToDiscardpile(cards);
                },
                group: 'bolchunlao_save',
                audio: 'chunlao',
                trigger: { global: 'loseAfter' },
                filter(event, player) {
                    if (event.type != 'discard' || get.distance(player, event.player) > 1) return false;
                    return event.cards2.some(card => card.name == 'sha' && get.position(card, true) == 'd')
                },
                async cost(event, trigger, player) {
                    const list = trigger.cards2.filter(card => card.name == 'sha' && get.position(card, true) == 'd');
                    event.result = await trigger.player.chooseBool('是否对' + get.translation(player) + '发动【醇醪】？', '将' + get.translation(list) + '置于' + get.translation(player) + '的武将牌上').set('choice', get.attitude(trigger.player, player) > 0).forResult();
                },
                popup: false,
                async content(event, trigger, player) {
                    trigger.player.logSkill(event.name, player);
                    const list = trigger.cards2.filter(card => card.name == 'sha' && get.position(card, true) == 'd');
                    if (list.length) {
                        const next = player.addToExpansion('gain2', list);
                        next.gaintag.add(event.name);
                        await next;
                    }
                },
                subSkill: {
                    round: { onremove: true, charlotte: true },
                    judge: {
                        mark: true,
                        intro: { content: '下个判定阶段改为摸牌阶段' },
                        trigger: { player: 'phaseJudgeBefore' },
                        silent: true,
                        content() {
                            player.removeSkill('bolchunlao_judge');
                            trigger.cancel();
                            var next = player.phaseDraw();
                            event.next.remove(next);
                            trigger.getParent().next.push(next);
                        },
                    },
                    save: {
                        enable: 'chooseToUse',
                        filter(event, player) {
                            return event.type == 'dying' && event.dying && event.dying.hp <= 0 && player.getExpansions('bolchunlao').length >= player.countMark('bolchunlao_round');
                        },
                        filterTarget(card, player, target) {
                            return target == _status.event.dying;
                        },
                        direct: true,
                        clearTime: true,
                        delay: false,
                        selectTarget: -1,
                        content() {
                            'step 0'
                            if (player.hasMark('bolchunlao_round')) player.chooseCardButton(get.translation('bolchunlao'), player.getExpansions('bolchunlao'), player.countMark('bolchunlao_round'), true);
                            'step 1'
                            player.addTempSkill('bolchunlao_round', 'roundStart');
                            player.addMark('bolchunlao_round', 1, false);
                            player.logSkill('bolchunlao', target);
                            if (target != player) player.addExpose(0.2);
                            if (result.links) player.loseToDiscardpile(result.links);
                            event.type = 'dying';
                            target.useCard({ name: 'jiu', isCard: true }, target);
                            target.addSkill('bolchunlao_judge');
                        },
                        ai: {
                            order: 6,
                            skillTagFilter(player) {
                                return player.getExpansions('bolchunlao').length >= player.countMark('bolchunlao_round');
                            },
                            save: true,
                            result: { target: 3 },
                        },
                    },
                },
            },
            //孙登
            bolkuangbi: {
                audio: 'kuangbi',
                enable: 'phaseUse',
                filter(event, player) {
                    return player.countCards('he') && game.hasPlayer(function (target) {
                        return target != player && target.countCards('he') && !target.hasSkill('bolkuangbi2');
                    });
                },
                filterTarget(card, player, target) {
                    return target != player && target.countCards('he') && !target.hasSkill('bolkuangbi2');
                },
                usable: 1,
                content() {
                    'step 0'
                    var att = get.attitude(player, target);
                    player.chooseCardOL([player, target], '将任意张牌置于' + get.translation(target) + '的武将牌上', 'he', [1, Infinity], true).set('ai', function (card) {
                        if (att > 0) return 6 - get.value(card);
                        return -get.value(card);
                    }).set('aiCard', function (target) {
                        var hs = target.getCards('he');
                        if (att > 0) return { bool: true, cards: [hs.randomGets(target.countCards('he') / 2)] };
                        return { bool: true, cards: [hs.randomGet()] };
                    });
                    'step 1'
                    target.addTempSkill('bolkuangbi2', { player: 'die' });
                    target.addToExpansion(result[0].cards, player, 'give').gaintag.add('bolkuangbi2');
                    target.addToExpansion(result[1].cards, target, 'give').gaintag.add('bolkuangbi2');
                    target.storage.bolkuangbi2 = [result[0].cards.length + result[1].cards.length, player];
                },
                ai: {
                    order: 1,
                    result: {
                        player: 1,
                        target(player, target) {
                            if (get.attitude(player, target) > 0) return Math.sqrt(target.countCards('he'));
                            return 0;
                        },
                    },
                },
            },
            bolkuangbi2: {
                charlotte: true,
                intro: {
                    content: 'expansion',
                    markcount: 'expansion',
                },
                onremove(player, skill) {
                    delete player.storage.bolkuangbi2;
                    var cards = player.getExpansions(skill);
                    if (cards.length) player.loseToDiscardpile(cards);
                },
                audio: 'bolkuangbi',
                trigger: { global: 'phaseBegin' },
                direct: true,
                content() {
                    'step 0'
                    player.storage.bolkuangbi2[0]--;
                    'step 1'
                    if (player.storage.bolkuangbi2[0] == 0) {
                        player.logSkill('bolkuangbi2');
                        game.log(player, '的', '#g【匡弼】', '技能生效');
                        var target = player.storage.bolkuangbi2[1];
                        var num = player.getExpansions('bolkuangbi2').length;
                        player.gain(player.getExpansions('bolkuangbi2'), 'gain2');
                        if (target.isIn()) target.draw(num);
                    }
                    else {
                        game.log('距离', player, '的', '#g【匡弼】', '技能生效还剩', '#y' + player.storage.bolkuangbi2[0], '个回合');
                        event.finish();
                    }
                    'step 2'
                    player.removeSkill('bolkuangbi2');
                },
            },
            //张宝
            old_zhoufu: {
                audio: 'rezhoufu',
                enable: 'phaseUse',
                filter(event, player) {
                    return player.countCards('h') && game.hasPlayer(target => lib.skill.old_zhoufu.filterTarget(null, player, target));
                },
                filterCard: true,
                filterTarget(card, player, target) {
                    return target != player && !target.getExpansions('old_zhoufu').length;
                },
                check(card) {
                    return 6 - get.value(card);
                },
                usable: 1,
                discard: false,
                lose: false,
                delay: false,
                content() {
                    target.addSkill('old_zhoufu_judge');
                    target.addToExpansion(cards, player, 'give').gaintag.add('old_zhoufu');
                },
                ai: {
                    order: 1,
                    result: {
                        target: -1,
                    },
                },
                marktext: '咒',
                intro: {
                    content: 'expansion',
                    markcount: 'expansion',
                },
                group: 'old_zhoufu_gain',
                subSkill: {
                    judge: {
                        charlotte: true,
                        audio: 'rezhoufu',
                        trigger: { player: 'judgeBefore' },
                        filter(event, player) {
                            return !event.directresult && player.getExpansions('old_zhoufu').length;
                        },
                        forced: true,
                        locked: false,
                        content() {
                            trigger.directresult = player.getExpansions('old_zhoufu')[0];
                        },
                    },
                    gain: {
                        audio: 'rezhoufu',
                        trigger: { global: 'phaseEnd' },
                        filter(event, player) {
                            return event.player.getExpansions('old_zhoufu').length;
                        },
                        forced: true,
                        locked: false,
                        logTarget: 'player',
                        content() {
                            player.gain(trigger.player.getExpansions('old_zhoufu'), trigger.player, 'give', 'bySelf');
                        },
                    },
                },
            },
            old_yingbing: {
                audio: 'reyingbing',
                trigger: { global: 'loseAfter' },
                filter(event, player) {
                    if (event.getParent().name !== 'judge' || event.xs?.[0] !== event.getParent().directresult) return false;
                    return event.gaintag_map[event.xs[0].cardid].includes('old_zhoufu');
                },
                frequent: true,
                logTarget: 'player',
                content() {
                    player.draw(2);
                },
            },
            //用间篇孙鲁班
            //离谱的东西我来做
            boljiaozong: {
                global: 'boljiaozong_global',
                audio: 'ext:活动武将/audio/skill:2',
                trigger: { global: 'useCard' },
                filter(event, player) {
                    var evtx = event.getParent('phaseUse');
                    if (!evtx || evtx.player != event.player) return false;
                    return event.player != player && event.player.getHistory('useCard', function (evt) {
                        return evt.getParent('phaseUse') == evtx && get.color(evt.card, event.player) == 'red' && evt.targets.includes(player);
                    }).indexOf(event) == 0;
                },
                forced: true,
                content() { },
                subSkill: {
                    global: {
                        mod: {
                            playerEnabled(card, player, target) {
                                var evtx = _status.event.getParent('phaseUse');
                                if (!evtx || evtx.player != player || !game.hasPlayer(function (current) {
                                    return current != player && current.hasSkill('boljiaozong');
                                }) || (get.color(card) != 'red' && get.color(card) != 'unsure') || player.getHistory('useCard', function (evt) {
                                    return evt.getParent('phaseUse') == evtx && get.color(evt.card, player) == 'red';
                                }).length) return;
                                if (target == player || !target.hasSkill('boljiaozong')) return false;
                            },
                            selectTarget(card, player, num) {
                                var evtx = _status.event.getParent('phaseUse');
                                if (!evtx || evtx.player != player || !game.hasPlayer(function (current) {
                                    return current != player && current.hasSkill('boljiaozong');
                                }) || (get.color(card) != 'red' && get.color(card) != 'unsure') || player.getHistory('useCard', function (evt) {
                                    return evt.getParent('phaseUse') == evtx && get.color(evt.card, player) == 'red';
                                }).length) return;
                                if (num[1] != -1) num[1] = -1;
                            },
                            targetInRange(card, player, target) {
                                var evtx = _status.event.getParent('phaseUse');
                                if (!evtx || evtx.player != player || !game.hasPlayer(function (current) {
                                    return current != player && current.hasSkill('boljiaozong');
                                }) || (get.color(card) != 'red' && get.color(card) != 'unsure') || player.getHistory('useCard', function (evt) {
                                    return evt.getParent('phaseUse') == evtx && get.color(evt.card, player) == 'red';
                                }).length) return;
                                if (target != player && target.hasSkill('boljiaozong')) return true;
                            },
                        },
                    },
                },
            },
            bolchouyou: {
                audio: 'ext:活动武将/audio/skill:2',
                trigger: { target: 'useCardToTargeted' },
                filter(event, player) {
                    return event.card.name == 'sha' && game.hasPlayer(function (current) {
                        return !event.targets.includes(current) && current != player && lib.filter.targetEnabled(event.card, event.player, current);
                    });
                },
                async cost(event, trigger, player) {
                    event.result = await player.chooseTarget(get.prompt2(event.skill), function (card, player, target) {
                        return _status.event.targets.includes(target);
                    }).set('ai', function (target) {
                        var player = _status.event.player, trigger = _status.event.getTrigger(), storage = player.getStorage('bolchouyou_effect');
                        if (get.effect(player, trigger.card, trigger.player, player) > 0) return 0;
                        return get.effect(target, trigger.card, trigger.player, player) * (!storage.includes(target) ? 3 : 1);
                    }).set('targets', game.filterPlayer(function (current) {
                        return !trigger.targets.includes(current) && current != player && lib.filter.targetEnabled(trigger.card, trigger.player, current);
                    })).forResult();
                },
                async content(event, trigger, player) {
                    const target = event.targets[0];
                    const result = await target.chooseBool('仇幽：是否替' + get.translation(player) + '代为' + get.translation(trigger.card) + '的目标？', '若拒绝，则你发动非锁定技前需经过' + get.translation(player) + '的同意才可发动').set('choice', get.effect(target, trigger.card, trigger.player, target) > 0).forResult();
                    if (result?.bool) {
                        target.chat('同意');
                        game.log(target, '代替', player, '成为了', trigger.card, '的目标');
                        trigger.targets[trigger.targets.indexOf(player)] = target;
                    }
                    else {
                        target.chat('拒绝');
                        game.log(target, '拒绝代替', player, '成为', trigger.card, '的目标');
                        player.addSkill(event.name + '_effect');
                        player.markAuto(event.name + '_effect', [target]);
                    }
                },
                subSkill: {
                    effect: {
                        charlotte: true,
                        onremove: true,
                        intro: { content: '已对$产生怨恨' },
                        audio: 'bolchouyou',
                        trigger: { global: ['useSkill', 'logSkillBegin'] },
                        filter(event, player) {
                            if (!player.getStorage('bolchouyou_effect').includes(event.player)) return false;
                            if (!event.player.getSkills(null, false, false).includes(get.sourceSkillFor(event.skill))) return false;
                            const info = get.info(event.skill);
                            return info && !info.charlotte && !get.is.locked(event.skill, event.player);
                        },
                        logTarget: 'player',
                        prompt2(event, player) {
                            return `阻止${get.translation(event.player)}发动【${get.translation(event.skill)}】`;
                        },
                        check(event, player) {
                            return get.attitude(player, event.player) < 0;
                        },
                        async content(event, trigger, player) {
                            trigger.player.tempBanSkill(get.sourceSkillFor(trigger.skill), {
                                player: ['useCard1', 'useSkillBegin'],
                                global: ['phaseChange', 'phaseBefore', 'phaseAfter'],
                            });
                            player.chat('拒绝');
                            game.log(player, '#y拒绝', trigger.player, '发动', '#g【' + get.translation(trigger.skill) + '】');
                            if (trigger.name === 'useSkill') {
                                if (!trigger._finished) {
                                    trigger.finish();
                                    trigger._triggered = 5;
                                }
                            }
                            else {
                                const evt = trigger.log_event || trigger.relatedEvent || trigger.getParent();
                                if (!evt._finished) {
                                    evt.finish();
                                    evt._triggered = 5;
                                }
                                if (['useCard', 'respond'].includes(evt.name) || evt.name.startsWith('pre_')) evt.getParent().goto(0);
                                evt.next = [];
                            }
                        },
                        group: 'bolchouyou_unmark',
                    },
                    unmark: {
                        charlotte: true,
                        trigger: { player: 'recoverEnd' },
                        filter(event, player) {
                            return event.source && player.getStorage('bolchouyou_effect').includes(event.source);
                        },
                        silent: true,
                        firstDo: true,
                        content() {
                            player.unmarkAuto('bolchouyou_effect', [trigger.source]);
                        },
                    },
                },
            },
            //张仲景
            old_liaoyi: {
                init(player) {
                    player.storage.renku = true;
                },
                audio: 'liaoyi',
                trigger: { global: 'phaseBegin' },
                filter(event, player) {
                    if (player == event.player) return false;
                    if (_status.renku.length) return true;
                    return event.player.countCards('h') >= 2 && event.player.hp != event.player.countCards('h');
                },
                async cost(event, trigger, player) {
                    const target = trigger.player;
                    const num = Math.min(9, Math.max(1, Math.abs(target.hp - target.countCards('h'))));
                    const choiceList = ['令其从仁库中获得一张牌', '令其将' + get.cnNumber(num) + '张手牌置入仁库'];
                    const choices = [];
                    if (_status.renku.length) choices.push('选项一');
                    else choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + '</span>';
                    if (target.countCards('h') >= 2 && target.hp != target.countCards('h')) choices.push('选项二');
                    else choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + '</span>';
                    const result = await player.chooseControl(choices, 'cancel2').set('prompt', get.prompt(event.skill, target)).set('choiceList', choiceList).set('ai', function () {
                        var player = _status.event.player, target = _status.event.getTrigger().player;
                        var att = get.attitude(player, target), list = _status.event.list;
                        if (att > 0 && list.includes('选项一')) return '选项一';
                        if (att <= 0 && list.includes('选项二')) return '选项二';
                        return 'cancel2';
                    }).set('list', choices).forResult();
                    event.result = {
                        bool: result?.control !== 'cancel2',
                        cost_data: result?.control,
                    }
                },
                logTarget: 'player',
                async content(event, trigger, player) {
                    const [target] = event.targets;
                    if (event.cost_data == '选项一') {
                        if (!_status.renku.length) return;
                        const result = await target.chooseButton(true, ['选择获得一张牌', _status.renku]).set('direct', true).set('ai', button => {
                            return get.value(button.link, get.player());
                        }).forResult();
                        if (result?.cards?.length) await target.gain(result.cards, 'gain2', 'fromRenku');
                    }
                    else if (event.cost_data == '选项二') {
                        if (!target.countCards('h')) returnl
                        const num = Math.min(9, Math.max(1, Math.abs(target.hp - target.countCards('h'))));
                        const result = target.countCards('h') <= num ? { bool: true, cards: target.getCards('h') } : await target.chooseCard('h', true, '将' + get.cnNumber(num) + '张手牌置于仁库中', num, 'allowChooseAll').forResult();
                        if (result?.bool && result?.cards?.length) await target.lose(result.cards, ui.special, 'toRenku');
                    }
                },
                ai: { threaten: 6.4 },
            },
            //旧旧系列
            bilibili_tannang: {
                locked: true,
                mod: {
                    globalFrom(from, to, distance) {
                        return distance - (from.getDamagedHp());
                    },
                },
            },
            bilibili_yishi: {
                trigger: { source: 'damageBegin2' },
                filter(event, player) {
                    return player != event.player;
                },
                check(event, player) {
                    if (get.damageEffect(event.player, player, player) < 0) return true;
                    var att = get.attitude(player, event.player);
                    if (event.num > 1 && att != 0) return att > 0;
                    var cards = event.player.getGainableCards(player, 'e');
                    if (cards.length && att == 0 && cards.filter(function (card) {
                        return get.equipValue(card) > 0;
                    }).length) return true;
                    return cards.filter(function (card) {
                        return get.equipValue(card) >= 6;
                    }).length;
                },
                logTarget: 'player',
                content() {
                    'step 0'
                    if (trigger.player.countGainableCards(player, 'e')) player.gainPlayerCard(trigger.player, 'e', true);
                    'step 1'
                    trigger.cancel();
                },
            },
            bilibili_zhengjun: {
                audio: 'yizhong',
                trigger: { player: 'damageBegin3' },
                filter(event, player) {
                    return player.countCards('e', { type: 'equip' });
                },
                check(event, player) {
                    return player.hp <= 2 || event.num > 1;
                },
                async content(event, trigger, player) {
                    const cards = player.getCards('e');
                    if (cards.length) await player.gain(cards, 'gain2');
                    if (player.countCards('e')) {
                        const result = await player.chooseCard('整军：打出一张装备牌，然后防止此伤害', { type: 'equip' }, true).forResult();
                        if (result?.bool) {
                            await player.respond(result.cards, 'highlight', 'noOrdering');
                            trigger.cancel();
                        }
                    }
                },
            },
            //生熏鱼
            bilibili_jinyan: {
                mod: {
                    playerEnabled(card, player, target) {
                        if (_status.currentPhase != player || target == player) return;
                        if (player.getHistory('useCard', function (evt) {
                            if (evt.card.name == 'qizhengxiangsheng') return false;
                            return evt.targets && evt.targets.includes(target);
                        }).length && card.name != 'qizhengxiangsheng') return false;
                    },
                },
            },
            bilibili_hehu: {
                global: 'bilibili_hehu_global',
                trigger: { global: 'phaseEnd' },
                filter(event, player) {
                    return event.player != player && event.player.countCards('he');
                },
                logTarget: 'player',
                forced: true,
                content() {
                    'step 0'
                    //2%几率直接击杀熏鱼
                    if (Math.random() < 0.02) {
                        trigger.player.line(player);
                        trigger.player.chat('关爱个der');
                        player.die().set('source', trigger.player);
                        event.finish();
                        return;
                    }
                    trigger.player.chooseCard('交给' + get.translation(player) + '两张牌以示对其的关爱', true, 'he', 2);
                    'step 1'
                    if (result.bool) {
                        trigger.player.give(result.cards, player);
                        var skill = 'bilibili_hehu_' + player.playerid;
                        if (!lib.skill[skill]) {
                            lib.skill[skill] = {};
                            lib.translate[skill] = '呵护熏鱼<br>关爱熏鱼';
                        }
                        trigger.player.draw(2).gaintag = [skill];
                        trigger.player.gain(lib.card.ying.getYing(2), 'gain2').gaintag.add(skill);
                    }
                },
                subSkill: {
                    global: {
                        mod: {
                            ignoredHandcard(card, player) {
                                if (card.hasGaintag('poxiang')) return true;
                            },
                            cardDiscardable(card, player, name) {
                                if (name == 'phaseDiscard' && card.hasGaintag('poxiang')) return false;
                            },
                            playerEnabled(card, player, target) {
                                if (card.cards) {
                                    for (var i of card.cards) {
                                        if (i.hasGaintag('bilibili_hehu_' + target.playerid)) return false;
                                    }
                                }
                                else if (get.itemtype(card) == 'card') {
                                    if (card.hasGaintag('bilibili_hehu_' + target.playerid)) return false;
                                }
                            },
                        },
                    },
                },
            },
            bilibili_yutai: {
                init: () => game.addGlobalSkill('tianzuo_global'),
                getNum(player = _status.event.player) {
                    var num = 1 + (player.getStat('skill')['bilibili_yutai'] || 0);
                    if (game.hasPlayer2(current => get.nameList(current).includes('bilibili_suixingsifeng'))) return num;
                    return Math.min(num, 3);
                },
                enable: 'chooseToUse',
                filterCard: true,
                selectCard: () => lib.skill.bilibili_yutai.getNum(_status.event.player),
                position: 'hes',
                viewAs: { name: 'qizhengxiangsheng' },
                viewAsFilter(player) {
                    if (player.countCards('hes') < lib.skill.bilibili_yutai.getNum(player)) return false;
                },
                prompt: () => '将' + get.cnNumber(lib.skill.bilibili_yutai.getNum(_status.event.player)) + '张牌当作【奇正相生】使用',
                check(card) {
                    var player = _status.event.player;
                    if (player.countCards('h') > player.needsToDiscard()) return 8 - get.value(card);
                    return 5 - get.value(card);
                },
                ai: { order: () => get.order({ name: 'qizhengxiangsheng' }) },
            },
            //Fire.win
            bilibili_xianqu: {
                trigger: { global: 'roundStart' },
                forced: true,
                async content(event, trigger, player) {
                    const next = player.insertPhase();
                    player.addSkill(`${event.name}_effect`);
                    player.markAuto(`${event.name}_effect`, [next]);
                    if (!trigger._finished) {
                        trigger.finish();
                        trigger._triggered = 5;
                        trigger.player.insertPhase();
                    }
                },
                derivation: ['jsrgfeiyang', 'jsrgbahu'],
                subSkill: {
                    effect: {
                        charlotte: true,
                        onremove: true,
                        trigger: { player: ['phaseBegin', 'phaseAfter'] },
                        filter(event, player) {
                            return player.getStorage('bilibili_xianqu_effect').includes(event);
                        },
                        silent: true,
                        async content(event, trigger, player) {
                            if (event.triggername === 'phaseBegin') {
                                player.addTempSkills(lib.skill.bilibili_xianqu.derivation);
                            }
                            else {
                                player.unmarkAuto(event.name, [trigger]);
                                if (!player.getStorage(event.name).length) player.removeSkill(event.name);
                            }
                        },
                    },
                },
            },
            bilibili_tixiang: {
                trigger: {
                    global: 'phaseBefore',
                    player: 'enterGame',
                },
                filter(event, player) {
                    return event.name !== 'phase' || game.phaseNumber === 0;
                },
                forced: true,
                async content(event, trigger, player) {
                    if (!_status.characterlist) lib.skill.pingjian.initList();
                    let map = {}, groups = [];
                    while (true) {
                        let names = _status.characterlist.filter(name => {
                            const info = lib.character[name], double = get.is.double(name, true);
                            if (!info || double ? groups.containsSome(...double) : groups.includes(info.group)) return false;
                            return (info.skills ?? []).length > 0;
                        });
                        if (names.length) {
                            const name = names.randomGet(), info = lib.character[name], double = get.is.double(name, true);
                            groups[double ? 'addArray' : 'add'](double || info.group);
                            map[name] = info.skills;
                            if (Object.keys(map).length >= 5) break;
                        }
                        else break;
                    }
                    if (!groups.length) {
                        await player.draw(8);
                        return;
                    }
                    const result = await player.chooseButton([
                        `###${get.translation(event.name)}###<div class="text center">选择获得至多四个技能，每少获得一个技能则改为摸两张牌</div>`,
                        [dialog => {
                            dialog.classList.add('fullheight');
                            dialog.css({ top: get.is.phoneLayout() ? '20%' : '25%' });
                            const { characterMap: map } = get.event();
                            for (const name of Object.keys(map)) {
                                const table = document.createElement('div');
                                table.classList.add('add-setting');
                                table.style.margin = '0';
                                table.style.width = '100%';
                                table.style.position = 'relative';
                                table.style.display = 'flex';
                                table.style.justifyContent = 'flex-start';
                                table.style.alignItems = 'center';
                                const tdc = ui.create.button(name, 'character', table, true);
                                for (const item in tdc.node) {
                                    if (item == 'name') tdc.node.name.style.writingMode = 'horizontal-tb';
                                    else tdc.node[item].hide();
                                }
                                tdc.style.height = '40px';
                                lib.setIntro(tdc);
                                const skills = map[name];
                                for (let i = 0; i < skills.length; i++) {
                                    const td = ui.create.button([skills[i], get.translation(skills[i])], 'tdnodes', table);
                                    td.setNodeIntro(get.translation(skills[i]), get.skillInfoTranslation(skills[i], get.player()));
                                    dialog.buttons.add(td);
                                }
                                dialog.content.appendChild(table);
                            }
                        }, 'handle'],
                    ], [1, 4]).set('characterMap', map).set('ai', button => {
                        const { link } = button, info = get.info(link);
                        if (info?.ai?.neg) return 0;
                        return get.skillRank(link, 'inout');
                    }).forResult();
                    if (result?.bool && result.links?.length) await player.addSkills(result.links);
                    const num = 4 - (result?.links ?? []).length;
                    if (num > 0) await player.draw(num * 2);
                },
                group: 'bilibili_tixiang_log',
                subSkill: {
                    log: {
                        trigger: { player: ['useSkillAfter', 'logSkill'] },
                        filter(event, player) {
                            if (event.type != 'player') return false;
                            var skill = event.sourceSkill || event.skill;
                            return !get.skillCategoriesOf(skill, player).length;
                        },
                        forced: true,
                        content() {
                            lib.skill.oldshenzhu.content(event, trigger, player);
                        },
                    },
                },
            },
            //？(精灵球)
            bilibili_tiyi: {
                group: 'bilibili_tiyi_update',
                enable: 'phaseUse',
                filter(event, player) {
                    if (player.hasSkill('bilibili_tiyi_used')) return false;
                    return player.countCards('h') && game.hasPlayer(function (current) {
                        return lib.skill.bilibili_tiyi.filterTarget(null, player, current);
                    });
                },
                filterTarget(card, player, target) {
                    return target != player && target.countCards('h') && !player.getStorage('bilibili_tiyi').includes(target);
                },
                content() {
                    'step 0'
                    player.markAuto('bilibili_tiyi', [target]);
                    'step 1'
                    player.viewHandcards(target);
                    target.viewHandcards(player);
                    'step 2'
                    player.chooseToDebate([player, target]).set('ai', function (card) {
                        return 1 + Math.random();
                    }).set('aiCard', function (target) {
                        return { bool: true, cards: [player.getCards('h').randomGet()] };
                    }).set('callback', lib.skill.bilibili_tiyi.callback);
                },
                callback() {
                    var result = event.debateResult;
                    var target = event.getParent(2).target;
                    if (result.opinion) {
                        if (result.red.length) {
                            player.recover();
                            target.recover();
                        }
                        if (result.black.length) {
                            player.draw(2);
                            target.addTempSkill('bilibili_tiyi_yingzi', { player: 'phaseAfter' });
                            target.addMark('bilibili_tiyi_yingzi', 1, false);
                        }
                    }
                    else {
                        player.line(target);
                        target.damage();
                    }
                },
                intro: { content: '已和$进行过议论' },
                ai: {
                    order: 7,
                    result: {
                        player(player, target) {
                            var num1 = player.getCards('h').reduce(function (arr, card) {
                                return arr.add(get.suit(card, player)), arr;
                            }, []).length;
                            var num2 = target.getCards('h').reduce(function (arr, card) {
                                return arr.add(get.suit(card, target)), arr;
                            }, []).length;
                            if (num1 == 1 && num2 == 1) {
                                return get.color(player.getCards('h')[0], player) == get.color(target.getCards('h')[0], target) ? 1 : -1;
                            }
                            return 1;
                        },
                    },
                },
                subSkill: {
                    used: { charlotte: true },
                    yingzi: {
                        mark: true,
                        marktext: '议',
                        charlotte: true,
                        onremove: true,
                        intro: { content: '摸牌阶段多摸#张牌，手牌上限+#' },
                        mod: {
                            maxHandcard(player, num) {
                                return num + player.countMark('bilibili_tiyi_yingzi');
                            },
                        },
                        trigger: { player: 'phaseDrawBegin2' },
                        filter(event, player) {
                            return !event.numFixed;
                        },
                        silent: true,
                        content() {
                            trigger.num += player.countMark('bilibili_tiyi_yingzi');
                        },
                    },
                    update: {
                        trigger: { player: 'useSkillAfter', global: 'dieAfter' },
                        filter(event, player) {
                            return !game.hasPlayer(function (current) {
                                if (player == current) return false;
                                return !player.getStorage('bilibili_tiyi').includes(current);
                            }) && (event.name == 'die' || event.skill == 'bilibili_tiyi');
                        },
                        forced: true,
                        locked: false,
                        content() {
                            player.unmarkSkill('bilibili_tiyi');
                            delete player.storage.bilibili_tiyi;
                            player.addTempSkill('bilibili_tiyi_used');
                        },
                    },
                },
            },
            bilibili_zili: {
                init(player, skill) {
                    player.storage[skill] ??= [0, 0];
                    player.addTip(skill, [lib.translate[skill], ...player.storage[skill]].join(' '));
                },
                onremove: true,
                mod: {
                    maxHandcardBase(player, num) {
                        const number = player.storage.bilibili_zili?.[1];
                        if (typeof number === 'number' && number > 0) return number + 1;
                    },
                },
                intro: {
                    markcount: (list = [0, 0]) => list.map(i => String(i)).join(''),
                    content(list) {
                        var bool1 = (list[0] && typeof list[0] == 'number');
                        var bool2 = (list[1] && typeof list[1] == 'number');
                        var str = '';
                        if (bool1) str += '<li>摸牌阶段额定摸牌数为' + (list[0] + 1);
                        if (bool1 && bool2) str += '<br>';
                        if (bool2) str += '<li>手牌上限视为' + (list[1] + 1);
                        return str;
                    },
                },
                group: 'bilibili_zili_record',
                trigger: { player: 'phaseDrawBegin' },
                filter(event, player) {
                    const number = player.storage.bilibili_zili?.[0];
                    return typeof number === 'number' && number > 0;
                },
                forced: true,
                content() {
                    trigger.num = player.storage.bilibili_zili[0] + 1;
                },
                subSkill: {
                    record: {
                        trigger: { global: ['phaseDrawAfter', 'phaseDiscardAfter'] },
                        filter(event, player) {
                            var storage = player.storage.bilibili_zili;
                            var num = ['phaseDraw', 'phaseDiscard'].indexOf(event.name);
                            if (!storage?.[num]) return true;
                            return (num == 0 ? event.num : event.player.getHandcardLimit()) > storage[num];
                        },
                        forced: true,
                        logTarget: 'player',
                        content() {
                            const skill = 'bilibili_zili', num = ['phaseDraw', 'phaseDiscard'].indexOf(trigger.name);
                            player.storage[skill][num] = (num == 0 ? trigger.num : trigger.player.getHandcardLimit());
                            player.markSkill(skill);
                            player.addTip(skill, [lib.translate[skill], ...player.storage[skill]].join(' '));
                        },
                    },
                },
            },
            //随性似风
            bilibili_liaoxing: {
                trigger: { global: 'gameDrawAfter' },
                filter(event, player) {
                    return game.hasPlayer(target => target.countCards('h') > 0);
                },
                forced: true,
                logTarget(event, player) {
                    return game.filterPlayer(target => target.countCards('h') > 0).sortBySeat();
                },
                content() {
                    targets.forEach(target => target.addGaintag(target.getCards('h'), 'eternal_liaoxing_tag'));
                },
                group: ['bilibili_liaoxing_lose', 'bilibili_liaoxing_draw'],
                subSkill: {
                    tag: {},
                    lose: {
                        trigger: { global: ['loseAfter', 'equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter', 'addToExpansionAfter'] },
                        filter(event, player) {
                            return lib.skill.bilibili_liaoxing.subSkill.lose.logTarget(event, player).length;
                        },
                        logTarget(event, player) {
                            return game.filterPlayer(current => {
                                var evt = event.getl(current);
                                if (!evt || !evt.cards2 || !evt.cards2.length) return false;
                                if (event.name == 'lose') {
                                    for (var i in event.gaintag_map) {
                                        if (event.gaintag_map[i].includes('eternal_liaoxing_tag')) return true;
                                    }
                                    return false;
                                }
                                return current.hasHistory('lose', function (evt) {
                                    if (event != evt.getParent()) return false;
                                    for (var i in evt.gaintag_map) {
                                        if (evt.gaintag_map[i].includes('eternal_liaoxing_tag')) return true;
                                    }
                                    return false;
                                });
                            });
                        },
                        forced: true,
                        content() {
                            var targets = lib.skill.bilibili_liaoxing.subSkill.lose.logTarget(trigger, player).sortBySeat();
                            while (targets.length) {
                                var target = targets.shift(), num = 0;
                                if (trigger.name == 'lose') {
                                    for (var i in trigger.gaintag_map) {
                                        if (trigger.gaintag_map[i].includes('eternal_liaoxing_tag')) num++;
                                    }
                                }
                                else target.getHistory('lose', function (evt) {
                                    if (trigger != evt.getParent()) return false;
                                    for (var i in evt.gaintag_map) {
                                        if (evt.gaintag_map[i].includes('eternal_liaoxing_tag')) num++;
                                    }
                                    return false;
                                });
                                if (num) target.gain(lib.card.ying.getYing(num), 'gain2');
                            }
                        },
                    },
                    draw: {
                        trigger: { global: ['loseAfter', 'loseAsyncAfter'] },
                        filter(event, player) {
                            return game.hasPlayer2(current => {
                                var evt = event.getl(current);
                                return evt?.cards2?.some(card => card.name == 'ying');
                            });
                        },
                        forced: true,
                        content() {
                            var num = 0;
                            game.countPlayer2(current => {
                                var evt = trigger.getl(current);
                                if (evt?.cards2) num += evt.cards2.filter(card => card.name == 'ying').length;
                            });
                            if (num) player.draw(num);
                        },
                    },
                },
            },
            bilibili_duoyang: {
                hiddenCard(player, name) {
                    return player.hasCard(card => get.type(card) !== 'equip' && get.name(card) === name, 'e');
                },
                enable: ['chooseToUse', 'chooseToRespond'],
                filter(event, player) {
                    return player.hasCard(card => {
                        if (get.type(card) === 'equip') return false;
                        return event.filterCard(card, player, event);
                    }, 'e');
                },
                locked: true,
                chooseButton: {
                    dialog(event, player) {
                        return ui.create.dialog('多样', player.getCards('e'), 'hidden');
                    },
                    filter(button, player) {
                        if (get.type(button.link) === 'equip') return false;
                        const evt = get.event().getParent();
                        return evt?.filterCard?.(button.link, player, evt) ?? true;
                    },
                    check(button) {
                        if (get.event().getParent().type !== 'phase') return 1;
                        if (button.link.name === 'du') return 0;
                        return get.player().getUseValue(button.link);
                    },
                    prompt(links) {
                        return '###多样###<div class="text center">' + (() => {
                            const name = get.event().name, [card] = links, str = get.translation(card);
                            if (name === 'chooseToUse' && get.info(card).filterTarget && !get.info(card).notarget) return '请选择' + str + '的目标';
                            return '点击“确定”' + (name === 'chooseToUse' ? '使用' : '打出') + str;
                        })() + '</div>';
                    },
                    backup(links) {
                        return {
                            filterCard(card) {
                                if (get.itemtype(card) !== 'card') return false;
                                return get.info('bilibili_duoyang_backup').viewAs === card;
                            },
                            selectCard: -1,
                            position: 'e',
                            viewAs: links[0],
                            precontent() {
                                player.addTempSkill('bilibili_duoyang_effect2');
                            },
                        }
                    },
                },
                ai: {
                    save: true,
                    respondSha: true,
                    respondShan: true,
                    skillTagFilter(player, tag) {
                        return player.hasCard(card => {
                            if (get.type(card) === 'equip') return false;
                            switch (tag) {
                                case 'respondSha': if (card.name == 'sha') return true; break;
                                case 'respondShan': if (card.name == 'shan') return true; break;
                                case 'save': {
                                    if (card.name == 'tao' || card.name == 'spell_zhiliaoshui') return true;
                                    if (player == _status.event.dying) {
                                        if (card.name == 'jiu' || card.name == 'tianxianjiu') return true;
                                    }
                                    break;
                                }
                            }
                        }, 'e');
                    },
                    order(item, player) {
                        if (_status.event.type !== 'phase') return 4;
                        if (!player || !player.hasCard(card => get.type(card) !== 'equip' && player.getUseValue(card) > 0, 'e')) return 0;
                        let cards = player.getCards('e', card => get.type(card) !== 'equip' && player.getUseValue(card) > 0);
                        cards.sort((a, b) => get.order(b, player) - get.order(a, player));
                        if (get.order(cards[0], player) <= 0) return 0;
                        return get.order(cards[0], player) + 0.1;
                    },
                    result: {
                        player(player) {
                            if (_status.event.dying) return get.attitude(player, _status.event.dying);
                            return 1;
                        },
                    },
                },
                group: 'bilibili_duoyang_put',
                //group: ['bilibili_duoyang_put', 'bilibili_duoyang_effect'],
                subSkill: {
                    backup: {},
                    put: {
                        trigger: { global: ['loseAfter', 'loseAsyncAfter', 'cardsDiscardAfter', 'equipAfter', 'addJudgeAfter', 'addToExpansionAfter'] },
                        getIndex: event => event.getd() ?? [],
                        filter(event, player, name, card) {
                            if (event.name === 'cardsDiscard') {
                                const evt = event.getParent();
                                if (evt.name === 'orderingDiscard') {
                                    const evtx = evt.relatedEvent || evt.getParent();
                                    if (evtx.name !== 'judge' && evtx.player === player) return false;
                                }
                            }
                            if (get.position(card, true) !== 'd' || get.type(card) === 'equip' || event.getd(player).includes(card)) return false;
                            return Array.from({ length: 5 }).map((_, i) => `equip${i + 1}`).some(subtype => {
                                const card2 = get.autoViewAs(card);
                                card2.subtypes = [subtype];
                                return player.canEquip(card2);
                            });
                        },
                        forced: true,
                        async content(event, trigger, player) {
                            const card = event.indexedData;
                            const subtype = Array.from({ length: 5 }).map((_, i) => `equip${i + 1}`).filter(subtype => {
                                const card2 = get.autoViewAs(card);
                                card2.subtypes = [subtype];
                                return player.canEquip(card2);
                            }).randomGet();
                            const card2 = get.autoViewAs(card);
                            card2.subtypes = [subtype];
                            await player.equip(card2);
                        },
                    },
                    effect2: {
                        charlotte: true,
                        trigger: { player: ['useCardAfter', 'respondAfter'] },
                        filter(event, player) {
                            return event.skill === 'bilibili_duoyang_backup';
                        },
                        forced: true,
                        popup: false,
                        async content(event, trigger, player) {
                            await player.draw();
                            await player.chooseToDiscard('he', true);
                        },
                    },
                    /*
                    effect: {
                        trigger: { player: ['loseBefore', 'replaceEquipBegin'] },
                        filter(event, player) {
                            if (event.name === 'lose') {
                                const evt = event.getParent(2);
                                if (evt.name !== "disableEquip") return false;
                                return event.cards.some(card => card.parentNode?.classList.contains("equips"));
                            }
                            return true;
                        },
                        forced: true,
                        popup: false,
                        content() {
                            if (trigger.name === 'lose') {
                                trigger.cards = trigger.cards.filter(card => !card.parentNode?.classList.contains("equips"));
                            }
                            else {
                                trigger.setContent(async function (event, trigger, player) {
                                    event.result = { vcards: [], cards: [] };
                                });
                            }
                        },
                    },
                    */
                },
                /*
                init(player, skill) {
                    if (!player.storage[skill]) {
                        player.storage[skill] = true;
                        game.broadcastAll(player => {
                            player.canEquip = function (name, replace) {
                                const player = this, ranges = get.subtypes(name);
                                const rangex = [], combined = get.is.mountCombined();
                                if (combined) {
                                    ranges.forEach(type => {
                                        if (type == "equip3" || type == "equip4") rangex.add("equip3_4");
                                        else rangex.add(type);
                                    });
                                }
                                else rangex.push(...new Set(ranges));
                                if (get.itemtype(name) == "card") {
                                    const owner = get.owner(name, "judge");
                                    if (owner && !lib.filter.canBeGained(name, player, owner)) return false;
                                }
                                for (let range of rangex) {
                                    if (player.hasSkill('bilibili_duoyang')) continue;
                                    let num = player.countEquipableSlot(range);
                                    let num2 = get.numOf(rangex, range);
                                    if (!replace) num -= player.getVEquips(range).filter(card => lib.filter.canBeReplaced(card, player)).length;
                                    if (num < num2) return false;
                                }
                                return true;
                            };
                        }, player);
                    };
                },
                */
            },
            //虚拟天团
            bilibili_xuxiang: {
                audio: 'haoshi2',
                audioname2: {
                    vtb_xiaosha: 'bilibili_xuxiang_xiaosha',
                    vtb_xiaotao: 'bilibili_xuxiang_xiaotao',
                    vtb_xiaoshan: 'bilibili_xuxiang_xiaoshan',
                    vtb_xiaojiu: 'bilibili_xuxiang_xiaojiu',
                    vtb_xiaole: 'bilibili_xuxiang_xiaole',
                },
                trigger: { player: 'damageBefore' },
                forced: true,
                content() {
                    trigger.cancel();
                },
                ai: {
                    nofire: true,
                    nothunder: true,
                    nodamage: true,
                    effect: {
                        target(card, player, target, current) {
                            if (!player.hasSkillTag('jueqing') && get.tag(card, 'damage')) return 0;
                        },
                    },
                },
                subSkill: {
                    xiaosha: { audio: 'ext:活动武将/audio/skill:true' },
                    xiaotao: { audio: 'ext:活动武将/audio/skill:true' },
                    xiaoshan: { audio: 'ext:活动武将/audio/skill:true' },
                    xiaojiu: { audio: 'ext:活动武将/audio/skill:true' },
                    xiaole: { audio: 'ext:活动武将/audio/skill:true' },
                },
            },
            //Empty city°
            bilibili_zhiyou: {
                getList(player) {
                    var list = [];
                    for (var target of game.filterPlayer2()) {
                        if (player == target) continue;
                        target.getAllHistory('useSkill', function (evt) {
                            if (evt.skill == 'bilibili_zhiyou' || evt.type != 'player') return false;
                            var skill = evt.sourceSkill || evt.skill;
                            if (!target.getStockSkills(true, true).includes(skill)) return false;
                            if (player.getStorage('bilibili_zhiyou').includes(skill)) return false;
                            //if(get.skillCategoriesOf(skill,player).length) return false;
                            if (!list.includes(skill)) list.push(skill);
                        });
                    }
                    return list;
                },
                enable: 'phaseUse',
                filter(event, player) {
                    //if(player.hasSkill('bilibili_zhiyou_remove')) return false;
                    return lib.skill.bilibili_zhiyou.getList(player).length;
                },
                usable: 1,
                content() {
                    'step 0'
                    var list = lib.skill.bilibili_zhiyou.getList(player);
                    var skills = list.randomGets(Math.min(list.length, 3));
                    skills.randomSort();
                    player.chooseControl(skills).set('choiceList', skills.map(function (i) {
                        return '<div class="skill">【' + get.translation(lib.translate[i + '_ab'] || get.translation(i).slice(0, 2)) + '】</div><div>' + get.skillInfoTranslation(i, player) + '</div>';
                    })).set('displayIndex', false).set('prompt', '请选择你要获得的技能').set('ai', () => {
                        var skills = _status.event.controls.slice();
                        return skills.sort((a, b) => {
                            return get.skillRank(b, 'in') - get.skillRank(a, 'in');
                        })[0];
                    });
                    'step 1'
                    if (result.control) {
                        player.addSkills(result.control);
                        player.markAuto('bilibili_zhiyou', [result.control]);
                    }
                },
                ai: {
                    order: 12,
                    result: { player: 1 },
                },
                subSkill: {
                    remove: {
                        charlotte: true,
                        onremove: true,
                        trigger: { player: ['useSkill', 'logSkillBegin'] },
                        filter(event, player) {
                            var skills = [player.storage.bilibili_zhiyou_remove];
                            game.expandSkills(skills);
                            return skills.includes(event.skill);
                        },
                        silent: true,
                        firstDo: true,
                        content() {
                            player.removeSkill(player.storage.bilibili_zhiyou_remove);
                            player.removeSkill('bilibili_zhiyou_remove');
                        },
                    },
                },
            },
            bilibili_guanli: {
                mod: {
                    cardUsableTarget(card, player, target) {
                        var targets = game.filterPlayer2(function (target) {
                            return player.getStorage('bilibili_zhiyou').filter(function (skill) {
                                return target.getStockSkills(true, true).includes(skill);
                            }).length;
                        });
                        if (target != player && !targets.includes(target)) return true;
                    },
                    targetInRange(card, player, target) {
                        var targets = game.filterPlayer2(function (target) {
                            return player.getStorage('bilibili_zhiyou').filter(function (skill) {
                                return target.getStockSkills(true, true).includes(skill);
                            }).length;
                        });
                        if (target != player && !targets.includes(target)) return true;
                    },
                },
                trigger: { global: 'phaseDrawBegin2' },
                filter(event, player) {
                    if (event.numFixed) return false;
                    var targets = game.filterPlayer2(function (target) {
                        return player.getStorage('bilibili_zhiyou').filter(function (skill) {
                            return target.getStockSkills(true, true).includes(skill);
                        }).length;
                    });
                    if (event.player == player) return targets.length;
                    return targets.includes(event.player);
                },
                forced: true,
                logTarget: 'player',
                content() {
                    var targets = game.filterPlayer2(function (target) {
                        return player.getStorage('bilibili_zhiyou').filter(function (skill) {
                            return target.getStockSkills(true, true).includes(skill);
                        }).length;
                    });
                    if (trigger.player == player) trigger.num += targets.length;
                    else {
                        trigger.num += 3;
                        player.addTempSkill('bilibili_guanli_gain', 'phaseDrawAfter');
                        player.storage.bilibili_guanli_gain ??= {};
                        player.storage.bilibili_guanli_gain[trigger.player.playerid] ??= 0;
                        player.storage.bilibili_guanli_gain[trigger.player.playerid] += 2;
                    }
                },
                subSkill: {
                    gain: {
                        charlotte: true,
                        onremove: true,
                        trigger: { global: 'phaseDrawEnd' },
                        filter(event, player) {
                            return player.storage.bilibili_guanli_gain[event.player.playerid];
                        },
                        silent: true,
                        content() {
                            'step 0'
                            var num = player.storage.bilibili_guanli_gain[trigger.player.playerid];
                            delete player.storage.bilibili_guanli_gain[trigger.player.playerid];
                            var cards = trigger.player.getCards('he');
                            if (!cards.length) event.finish();
                            else if (cards.length <= num) event._result = { bool: true, cards: cards };
                            else trigger.player.chooseCard('he', '将' + get.cnNumber(num) + '张牌交给' + get.translation(player), num, true);
                            'step 1'
                            if (result.bool) player.gain(result.cards, trigger.player, 'giveAuto');
                        },
                    },
                },
            },
            //雷
            bilibili_Thunder: {
                trigger: { global: ['useSkillAfter', 'logSkill'] },
                filter(event, player) {
                    if (event.player == player || event.type != 'player') return false;
                    const skill = event.sourceSkill || event.skill;
                    if (_status.ThunderSkill?.includes(skill)) return false;
                    return !get.skillCategoriesOf(skill, event.player).length;
                },
                forced: true,
                async content(event, trigger, player) {
                    const skill = trigger.sourceSkill || trigger.skill;
                    const card = 'bilibili_Thunder_decade' + skill;
                    game.broadcastAll((skill, card) => {
                        _status.ThunderSkill ??= [];
                        _status.ThunderSkill.add(skill);
                        lib.card[card] = {
                            fullimage: true,
                            image: 'ext:活动武将/image/character/bilibili_thunderlei.jpg',
                            enable: true,
                            toself: true,
                            filterTarget(card, player, target) {
                                return target == player;
                            },
                            selectTarget: -1,
                            bilibili_ThunderSkill: skill,
                            async content(event, trigger, player) {
                                await game.delayx();
                                const skill = lib.card[event.card.name].bilibili_ThunderSkill;
                                if (!player.hasSkill(skill, null, false, false)) await player.addSkills(skill);
                                else await player.changeHujia(2);
                                if (event.type === 'card') {
                                    const evt = event.getParent();
                                    if (evt.cards?.length == 1 && evt.cards[0].name == event.card.name) {
                                        const cards = evt.cards.filterInD();
                                        if (cards.length) {
                                            if (!cards[0].decadeSkill) {
                                                cards[0].decadeSkill = true;
                                                game.log(cards, '已被洗入牌堆');
                                                await game.cardsGotoPile(cards, () => ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)]);
                                            }
                                            else {
                                                game.log(cards, '已被移出游戏');
                                                await game.cardsGotoSpecial(cards);
                                            }
                                        }
                                    }
                                }
                            },
                            ai: {
                                basic: {
                                    order: 114514 + 1919810,
                                    useful: 114514 + 1919810,
                                    value: 114514 + 1919810,
                                },
                                result: { target: 1 },
                            },
                        };
                        lib.translate[card] = '雷の制卡·' + lib.translate[skill];
                        lib.translate[card + '_info'] = '<li>使用此牌，获得【' + lib.translate[skill] + '】' + '<br><li>' + lib.translate[skill + '_info'];
                    }, skill, card);
                    await player.gain(game.createCard2(card, lib.suit.randomGet(), get.rand(1, 13)), 'gain2');
                },
            },
            bilibili_qianxiu: {
                trigger: { global: ['useSkill', 'logSkillBegin'] },
                filter(event, player) {
                    if (event.player === player || !event.targets?.includes(player) || event.skill === 'bilibili_qianxiu') return false;
                    if (!event.player.getSkills(null, false, false).includes(get.sourceSkillFor(event.skill))) return false;
                    const info = get.info(event.skill);
                    return info && !info.charlotte && !get.is.locked(event.skill, event.player);
                },
                logTarget: 'player',
                prompt2(event, player) {
                    return `阻止${get.translation(event.player)}发动【${get.translation(event.skill)}】`;
                },
                check(event, player) {
                    return get.attitude(player, event.player) < 0;
                },
                async content(event, trigger, player) {
                    if (player.hujia > 0) await player.changeHujia(-1);
                    else player.tempBanSkill(event.name);
                    const target = trigger.player, skill = get.sourceSkillFor(trigger.skill);
                    target.tempBanSkill(skill, {
                        player: ['useCard1', 'useSkillBegin'],
                        global: ['phaseChange', 'phaseBefore', 'phaseAfter'],
                    }, false);
                    game.log(player, '#y拒绝', target, '发动', '#g【' + get.translation(skill) + '】');
                    if (trigger.name === 'useSkill') {
                        if (!trigger._finished) {
                            trigger.finish();
                            trigger._triggered = 5;
                        }
                    }
                    else {
                        const evt = trigger.log_event || trigger.relatedEvent || trigger.getParent();
                        if (!evt._finished) {
                            evt.finish();
                            evt._triggered = 5;
                        }
                        if (['useCard', 'respond'].includes(evt.name) || evt.name.startsWith('pre_')) evt.getParent().goto(0);
                        evt.next = [];
                    }
                },
            },
            //群主
            bilibili_meihua: {
                trigger: {
                    global: 'gameStart',
                    player: ['disableEquipBefore', 'chooseToDisableBefore', 'changeSkillsAfter'],
                },
                filter(event, player) {
                    if (event.name === 'changeSkills') {
                        if (!event.addSkill.includes('bilibili_meihua')) return false;
                        return player.hasDisabledSlot();
                    }
                    if (event.name == 'disableEquip' || event.name == 'chooseToDisable') return true;
                    return lib.inpile.some(name => get.type(name) == 'equip');
                },
                forced: true,
                async content(event, trigger, player) {
                    switch (trigger.name) {
                        case 'changeSkills':
                            for (let i = 1; i <= 5; i++) {
                                while (player.hasDisabledSlot(i)) {
                                    await player.enableEquip(i);
                                }
                            }
                            break;
                        case 'disableEquip':
                        case 'chooseToDisable':
                            trigger.cancel();
                            break;
                        default:
                            const shans = Array.from(ui.cardPile.childNodes).filter(card => card.name === 'shan');
                            if (shans.length > 0) await game.cardsGotoSpecial(shans);
                            const cards = Array.from(ui.cardPile.childNodes).filter(card => get.type(card) === 'equip');
                            if (cards.length > 0) {
                                for (const card of cards) {
                                    game.broadcastAll(card => {
                                        const subtypes = card.subtypes ?? [get.info(card).subtype] ?? [];
                                        card.init([card.suit, card.number, 'bol_shanshan']);
                                        card.subtypes = subtypes;
                                        card._bilibili_meihua = true;
                                    }, card);
                                }
                            }
                            await game.cardsGotoPile(cards.map(cardx => {
                                const card = game.createCard2(cardx);
                                card.subtypes = cardx.subtypes;
                                card._bilibili_meihua = true;
                                return card;
                            }), () => {
                                return ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)];
                            });
                            break;
                    }
                },
                init(player, skill) {
                    player.addSkill(`${skill}_effect`);
                },
                onremove(player, skill) {
                    player.removeSkill(`${skill}_effect`);
                },
                group: 'bilibili_meihua_shanshan',
                subSkill: {
                    shanshan: {
                        trigger: { global: ['loseAfter', 'loseAsyncAfter', 'cardsDiscardAfter', 'equipAfter', 'addJudgeAfter', 'addToExpansionAfter'] },
                        getIndex: event => event.getd() ?? [],
                        filter(event, player, name, card) {
                            if (!card?._bilibili_meihua || !(card.subtypes ?? []).length || get.position(card, true) !== 'd') return false;
                            if (event.getd(player).includes(card) && event.getl?.(player)?.es?.includes(card)) return false;
                            const card2 = get.autoViewAs(card);
                            card2.subtypes = card.subtypes;
                            return player.canEquip(card2, true);
                        },
                        forced: true,
                        async content(event, trigger, player) {
                            const card = event.indexedData;
                            const card2 = get.autoViewAs(card);
                            card2.subtypes = card.subtypes;
                            await player.equip(card2);
                        },
                    },
                    effect: {
                        charlotte: true,
                        init(player, skill) {
                            if (!_status[skill] && lib.element.player.canEquip) {
                                game.broadcastAll(skill => {
                                    _status[skill] = lib.element.player.canEquip;
                                    lib.element.player.canEquip = function (...args) {
                                        if (this.hasSkill(skill, null, null, false)) return true;
                                        return _status[skill].call(this, ...args);
                                    };
                                    [...game.players, ...game.dead].forEach(target => target.canEquip = lib.element.player.canEquip);
                                }, skill);
                            }
                        },
                        trigger: { player: ['loseBefore', 'replaceEquipBegin'] },
                        filter(event, player) {
                            if (event.name === 'lose') {
                                const evt = event.getParent(2);
                                if (evt.name !== "disableEquip") return false;
                                return event.cards.some(card => card.parentNode?.classList.contains('equips'));
                            }
                            return true;
                        },
                        forced: true,
                        popup: false,
                        content() {
                            if (trigger.name === 'lose') {
                                trigger.cards = trigger.cards.filter(card => !card.parentNode?.classList.contains('equips'));
                            }
                            else {
                                trigger.setContent(async function (event, trigger, player) {
                                    event.result = { vcards: [], cards: [] };
                                });
                            }
                        },
                    },
                },
            },
            bilibili_zhengyou: {
                trigger: {
                    player: 'loseAfter',
                    global: ['equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter', 'addToExpansionAfter', 'phaseBefore'],
                },
                filter(event, player) {
                    if (event.name !== 'phase' && (event.name !== 'equip' || event.player !== player)) {
                        const evt = event.getl(player);
                        if (!evt || !evt.es || !evt.es.length) return false;
                    }
                    const skills = player.additionalSkills?.bilibili_zhengyou ?? [];
                    const list = lib.skill.bilibili_zhengyou.getList(player);
                    return skills.length !== list.length || skills.some(skill => !list.includes(skill));
                },
                forced: true,
                async content(event, trigger, player) {
                    const skill = event.name, list = lib.skill[skill].getList(player);
                    const skills = player.additionalSkills?.[skill] ?? [];
                    const addSkill = list.filter(skill => !skills.includes(skill));
                    const removeSkill = skills.filter(skill => !list.includes(skill));
                    if (addSkill.length) await player.addAdditionalSkills(skill, addSkill, true);
                    if (removeSkill.length) {
                        await player.changeSkills([], removeSkill).set('$handle', (player, 棍母, removeSkill) => {
                            const skill = 'bilibili_zhengyou';
                            game.log(player, '失去了技能', ...removeSkill.map(i => '#g【' + get.translation(i) + '】'));
                            player.removeSkill(removeSkill);
                            if (!player.additionalSkills[skill].length) delete player.additionalSkills[skill];
                        });
                    }
                },
                getList(player) {
                    let list = [], cards = player.getVCards('e');
                    if (cards.map(i => get.suit(i)).unique().length >= 4) list.push('bilibili_zili');
                    if (cards.filter(i => get.color(i) === 'red').length >= 8) list.push('bilibili_zhiyou');
                    if (cards.filter(i => get.color(i) === 'black').length >= 8) list.push('bilibili_qianxiu');
                    if (cards.length >= 16) list.push('bilibili_zhangcai');
                    return list;
                },
                init(player) {
                    player.addAdditionalSkill('bilibili_zhengyou', lib.skill.bilibili_zhengyou.getList(player));
                },
                onremove: true,
                derivation: ['bilibili_zili', 'bilibili_zhiyou', 'bilibili_qianxiu', 'bilibili_zhangcai'],
                //分别代表：22年牢资历，致力写出优秀代码，潜心学习不受打扰，圆满毕业由拙至才
                group: 'bilibili_zhengyou_phase',
                subSkill: {
                    phase: {
                        trigger: {
                            global: ['roundStart', 'roundEnd'],
                            player: 'phaseBeginStart',
                        },
                        filter(event, player, name) {
                            return name !== 'phaseBeginStart' || !event.skill;
                        },
                        forced: true,
                        async content(event, trigger, player) {
                            const name = event.triggername;
                            if (name !== 'phaseBeginStart') {
                                const next = player.insertPhase();
                                if (name === 'roundStart' && !trigger._finished) {
                                    trigger.finish();
                                    trigger._triggered = 5;
                                    if (trigger.player !== player || trigger.skill) trigger.player.insertPhase();
                                }
                            }
                            else {
                                trigger.cancel();
                                player.phaseSkipped = true;
                                const players = [...game.players, ...game.dead];
                                for (const current of players) {
                                    current.getHistory().isSkipped = true;
                                    current.getStat().isSkipped = true;
                                    current.getHistory().isMe = undefined;
                                    current.getStat().isMe = undefined;
                                }
                            }
                        },
                    },
                },
            },
            //仁望值
            bilibili_renwang: {
                changeMark(player, num) {
                    if (num == 0) return;
                    if (num > 0) {
                        if (player.countMark('bilibili_renwang') >= 5) return;
                        num = Math.min(5 - player.countMark('bilibili_renwang'), num);
                        player.addMark('bilibili_renwang', num, false);
                        game.log(player, '获得了', '#g' + num, '点<span class="bluetext">仁望值</span>');
                    }
                    else {
                        if (!player.hasMark('bilibili_renwang')) return;
                        num = -Math.max(-player.countMark('bilibili_renwang'), num);
                        player.removeMark('bilibili_renwang', num, false);
                        game.log(player, '消耗了', '#y' + num, '点<span class="bluetext">仁望值</span>');
                    }
                },
                getNum(event, player) {
                    var sum = 0;
                    if (game.hasPlayer2(function (current) {
                        var num = 0;
                        current.getHistory('gain', function (evt) {
                            if (evt.getParent('phaseUse') == event) num += evt.cards.length;
                        });
                        return num >= 2;
                    })) sum++;
                    if (game.getGlobalHistory('changeHp', function (evt) {
                        return evt.getParent().name == 'recover' && evt.getParent('phaseUse') == event;
                    }).length) sum++;
                    if (!player.hasHistory('sourceDamage', evt => evt.player != player && evt.getParent('phaseUse') == event)) sum++;
                    return sum;
                },
                ruleSkill: true,
                charlotte: true,
                trigger: { global: 'phaseBefore', player: ['phaseUseEnd', 'enterGame'] },
                filter(event, player) {
                    if (!player.hasSkillTag('renwang_gain') || player.countMark('bilibili_renwang') >= 5) return false;
                    if (event.name == 'phaseUse') return lib.skill.bilibili_renwang.getNum(event, player) > 0;
                    return event.name != 'phase' || game.phaseNumber == 0;
                },
                silent: true,
                content() {
                    var num = (trigger.name == 'phaseUse' ? lib.skill.bilibili_renwang.getNum(trigger, player) : 1);
                    lib.skill.bilibili_renwang.changeMark(player, num);
                },
                intro: { content: '当前共有#点仁望值' },
            },
            //华歆
            bolyuanqing: {
                audio: 'yuanqing',
                enable: 'phaseUse',
                filter(event, player) {
                    return player.countCards('h');
                },
                check(card) {
                    var player = _status.event.player;
                    var map = { red: 0, black: 0, none: 0 };
                    for (var target of game.filterPlayer()) {
                        if (target == player || !target.countDiscardableCards(target, 'h')) continue;
                        for (var i in map) {
                            if (target.countCards('h', { color: i })) map[i] += Math.sign(get.attitude(player, target));
                        }
                    }
                    var colors = Object.keys(map).filter(color => map[color] >= 0);
                    return colors.includes(get.color(card, player)) ? (1 + Math.random()) : 0;
                },
                usable: 1,
                position: 'h',
                filterCard: true,
                discard: false,
                lose: false,
                delay: false,
                content() {
                    'step 0'
                    event.cards = [];
                    event.color = get.color(cards[0], player);
                    event.targets = game.filterPlayer().sortBySeat(player);
                    event.targets.remove(player);
                    player.line(event.targets);
                    player.showCards(cards, get.translation(player) + '发动了【渊清】');
                    'step 1'
                    var target = event.targets.shift();
                    event.target = target;
                    target.chooseToDiscard('是否弃置一张' + get.translation(event.color) + '牌，然后摸一张牌？', { color: event.color }).set('ai', card => lib.skill.zhiheng.check(card));
                    'step 2'
                    if (result.bool) {
                        target.draw();
                        if (Array.isArray(result.cards)) event.cards.addArray(result.cards);
                    }
                    else {
                        target.chat('拒绝');
                        game.delayx();
                    }
                    'step 3'
                    if (event.targets.length) event.goto(1);
                    else if (!event.cards.length) event.finish();
                    else player.chooseToMove('渊清：是否将其中一张牌置于牌堆顶？').set('list', [
                        ['弃置的牌', event.cards],
                        ['牌堆顶'],
                    ]).set('filterMove', function (from, to, moved) {
                        if (moved[1].length && to == 1) return false;
                        return true;
                    }).set('filterOk', function (moved) {
                        return moved[1].length == 1;
                    }).set('processAI', function (list) {
                        var cards = list[0][1].slice(0);
                        var cards2 = cards.randomGet();
                        return [[], [cards2]];
                    });
                    'step 4'
                    if (result.bool) {
                        var cardx = result.moved[1];
                        player.$throw(cardx, 1000);
                        game.log(player, '将', cardx, '置于了牌堆顶');
                        while (cardx.length) ui.cardPile.insertBefore(cardx.pop().fix(), ui.cardPile.firstChild);
                    }
                },
                ai: {
                    order: 9,
                    result: {
                        player(player) {
                            var map = { red: 0, black: 0, none: 0 };
                            for (var target of game.filterPlayer()) {
                                if (target == player || !target.countDiscardableCards(target, 'h')) continue;
                                for (var i in map) {
                                    if (target.countCards('h', { color: i })) map[i] += Math.sign(get.attitude(player, target));
                                }
                            }
                            var colors = Object.keys(map).filter(color => map[color] >= 0);
                            return player.countCards('h', { color: colors });
                        },
                    },
                },
            },
            bolshuchen: {
                init(player) {
                    game.addGlobalSkill('bilibili_renwang');
                },
                audio: 'shuchen',
                trigger: { global: 'dying' },
                filter(event, player) {
                    return player.hasMark('bilibili_renwang');
                },//111
                async cost(event, trigger, player) {
                    const list = Array.from({ length: Math.min(player.countMark('bilibili_renwang'), 3) }).map((_, i) => get.cnNumber(i + 1, true));
                    const result = await player.chooseControl(list, 'cancel2').set('prompt', get.prompt(event.skill)).set('prompt2', '消耗任意仁望值并摸等量的牌，然后你可以交给' + get.translation(trigger.player) + '至多等量的牌').set('ai', () => {
                        const player = _status.event.player;
                        const num = Math.min(player.countMark('bilibili_renwang'), 3);
                        return num - 1;
                    }).forResult();
                    event.result = {
                        bool: result?.control !== 'cancel2',
                        cost_data: (result?.index || 0) + 1,
                    };
                },
                logTarget: 'player',
                async content(event, trigger, player) {
                    const num = event.cost_data;
                    const [target] = event.targets;
                    lib.skill.bilibili_renwang.changeMark(player, -num);
                    await player.draw(num);
                    if (player != target && player.countCards('he')) await player.chooseToGive(target, 'he', '疏陈：是否交给' + get.translation(target) + '至多' + get.cnNumber(num) + '张牌', [1, num], 'allowChooseAll').set('ai', card => {
                        const { player, target } = get.event();
                        if (get.attitude(player, target) > 0) {
                            const save = ((player.countCards('hs', { name: 'tao' }) + target.hp) > 0);
                            if (save && get.position(card) == 'h') return get.value(card);
                            return 0;
                        }
                        return card.name == 'du' ? 20 : 0;
                    });
                },
                ai: { renwang_gain: true },
            },
            bolxiezheng: {
                init(player) {
                    game.addGlobalSkill('bilibili_renwang');
                },
                getNum(event, player) {
                    const cards = [];
                    player.getHistory('lose', evt => {
                        if (evt.type == 'discard' && evt.getParent('phaseDiscard') == event) cards.addArray(evt.cards2);
                    });
                    return cards.length;
                },
                trigger: { player: 'phaseDiscardEnd' },
                filter(event, player) {
                    return get.info('bolxiezheng').getNum(event, player) > 0 && game.hasPlayer(function (current) {
                        return current.countCards('he');
                    }) && player.hasMark('bilibili_renwang');
                },
                async cost(event, trigger, player) {
                    const num = get.info(event.skill).getNum(trigger, player);
                    event.result = await player.chooseTarget(get.prompt('bolxiezheng'), '消耗1点仁望值，令一名角色弃置' + get.cnNumber(num) + '张牌', function (card, player, target) {
                        return target.countCards('he');
                    }).set('ai', function (target) {
                        const { player, num } = get.event();
                        return get.effect(target, { name: 'guohe_copy2' }, player, player) * Math.min(target.countCards('he'), _status.event.num);
                    }).set('num', num).forResult();
                },
                async content(event, trigger, player) {
                    const num = get.info(event.name).getNum(trigger, player);
                    lib.skill.bilibili_renwang.changeMark(player, -1);
                    await event.targets[0].chooseToDiscard(num, 'he', true, 'allowChooseAll');
                },
                ai: { renwang_gain: true },
            },
            //张仲景
            bolliaoyi: {
                getList(player) {
                    var types = [], history = player.actionHistory, bool = false;
                    for (var i = history.length - 1; i >= 0; i--) {
                        if (history[i].isSkipped) continue;
                        for (var evt of history[i].lose) {
                            var cards = evt.cards2.filter(cardx => !types.includes(get.type2(cardx, player)));
                            if (!cards.length) continue;
                            for (var card of cards) {
                                if (!types.includes(get.type2(card, player))) types.push(get.type2(card, player));
                            }
                        }
                        if (i < history.length - 1 && history[i].isMe) {
                            bool = true;
                            break;
                        }
                    }
                    return bool ? types : [];
                },
                audio: 'liaoyi',
                trigger: { player: 'phaseUseBegin' },
                filter(event, player) {
                    return game.hasPlayer(target => lib.skill.bolliaoyi.getList(target).length);
                },
                async cost(event, trigger, player) {
                    const list = game.filterPlayer(target => get.info(event.skill).getList(target).length);
                    const typesMap = list.reduce((map, target) => map.set(target, get.info(event.skill).getList(target)), new Map());
                    const next = player.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
                        return get.event().list.includes(target);
                    }).set('ai', target => {
                        const { player, typesMap } = get.event();
                        return typesMap.get(target).length * Math.sign(get.attitude(player, target));
                    }).set('list', list).set('typesMap', typesMap);
                    next.set('targetprompt2', next.targetprompt2.concat([
                        target => {
                            if (!target.isIn() || !get.event().filterTarget(null, get.player(), target)) return false;
                            return `${get.event().typesMap.get(target).map(type => get.translation(type)).join('、')}`;
                        },
                    ]));
                    event.result = await next.forResult();
                },
                async content(event, trigger, player) {
                    const target = event.targets[0];
                    const types = get.info(event.name).getList(target);
                    const cards = [];
                    for (const type of types) {
                        const card = get.cardPile(card => {
                            return get.type2(card) == type;
                        });
                        if (card) cards.push(card);
                    }
                    if (cards.length) target.gain(cards, 'gain2');
                },
                ai: { expose: 0.25 },
            },
            bolbinglun: {
                init(player) {
                    game.addGlobalSkill('bilibili_renwang');
                },
                audio: 'binglun',
                enable: 'phaseUse',
                filter(event, player) {
                    return player.hasMark('bilibili_renwang');
                },
                usable: 1,
                chooseButton: {
                    dialog(event, player) {
                        var dialog = ui.create.dialog('###病论###' + lib.translate.bolbinglun_info);
                        dialog.add([[
                            ['1', '消耗至多3点仁望值，令等量角色各选择一项执行'],
                            ['2', '消耗至多3点仁望值，令一名角色选择等量项执行']
                        ], 'textbutton']);
                        return dialog;
                    },
                    filter(button, player) {
                        return button.link == '2' || player.countMark('bilibili_renwang') > 1;
                    },
                    check(button) {
                        var player = _status.event.player;
                        if (player.countMark('bilibili_renwang') == 1) return 1;
                        if (!player.hasFriend()) {
                            if (button.link == '2') return 1;
                            return 0;
                        }
                        if (button.link == '1') return 1;
                        return 0;
                    },
                    backup(links) {
                        return get.copy(lib.skill['bolbinglun_' + links[0]]);
                    },
                    prompt(links, player) {
                        var num = Math.min(3, player.countMark('bilibili_renwang'));
                        if (links[0] == '1') return '请选择至多' + get.cnNumber(num) + '名角色，令这些角色各选择一项执行';
                        return '请选择一名角色，令一名角色选择至多' + get.cnNumber(num) + '项执行';
                    },
                },
                ai: {
                    renwang_gain: true,
                    order: 1,
                    result: { player: 1 },
                },
                subSkill: {
                    damage: {
                        charlotte: true,
                        onremove: true,
                        trigger: { player: 'damageBegin2' },
                        filter(event, player) {
                            return player.hasMark('bolbinglun_damage');
                        },
                        forced: true,
                        content() {
                            trigger.cancel();
                            player.removeMark('bolbinglun_damage', 1, false);
                            if (!player.countMark('bolbinglun_damage')) player.removeSkill('bolbinglun_damage');
                        },
                        intro: { content: '防止接下来的#次伤害' },
                        ai: { nofire: true, nothunder: true, nodamage: true },
                    },
                    backup: { audio: 'binglun' },
                    '1': {
                        audio: 'binglun',
                        filterTarget: true,
                        selectTarget: () => [1, Math.min(3, _status.event.player.countMark('bilibili_renwang'))],
                        multitarget: true,
                        multiline: true,
                        complexTarget: true,
                        complexSelect: true,
                        content() {
                            'step 0'
                            lib.skill.bilibili_renwang.changeMark(player, -targets.length);
                            event.num = 0;
                            event.map = {
                                '摸牌': '将手牌补至与体力值相同（至多摸五张）',
                                '回血': '回复1点体力',
                                '防止伤害': '防止下一次受到的伤害直到回合开始',
                            };
                            event.targets.sortBySeat();
                            'step 1'
                            var target = event.targets[num];
                            event.target = target;
                            var choiceList = [];
                            for (var i in event.map) choiceList.push(event.map[i]);
                            if (!Object.keys(event.map).length) { event.finish(); return; }
                            target.chooseControl(Object.keys(event.map)).set('prompt', '病论：请选择一项').set('ai', function () {
                                var list = _status.event.controls;
                                var player = _status.event.player;
                                var num1 = player.getDamagedHp() * 2;
                                var num2 = Math.min(5, Math.max(0, player.maxHp - player.countCards('h')));
                                if (player.hasSkillTag('nogain')) num2 = 0;
                                if (list.includes('摸牌') && num2 >= num1) return '摸牌';
                                if (list.includes('回血') && num1 > 0) return '回血';
                                if (list.includes('摸牌') && num2 > 0) return '摸牌';
                                if (list.includes('防止伤害')) return '防止伤害';
                                return list.randomGet();
                            }).set('choiceList', choiceList);
                            'step 2'
                            game.log(target, '选择了', '#g' + result.control);
                            delete event.map[result.control];
                            if (result.control == '摸牌') target.draw(Math.min(5, Math.max(0, target.maxHp - target.countCards('h'))));
                            if (result.control == '回血') target.recover();
                            if (result.control == '防止伤害') {
                                target.addTempSkill('bolbinglun_damage', { player: 'phaseBegin' });
                                target.addMark('bolbinglun_damage', 1, false);
                            }
                            'step 3'
                            if (num < targets.length) {
                                event.num++;
                                event.goto(1);
                            }
                        },
                        ai: {
                            result: {
                                target(player, target) {
                                    var choice = ['摸牌', '回血', '防止伤害'];
                                    var maxEff = function (current) {
                                        var num1 = current.getDamagedHp() * 2;
                                        var num2 = Math.min(5, Math.max(0, current.maxHp - current.countCards('h')));
                                        if (current.hasSkillTag('nogain')) num2 = 0;
                                        if (num2 >= num1 && choice.includes('摸牌')) return '摸牌';
                                        if (num1 > 0 && choice.includes('回血')) return '回血';
                                        if (num2 > 0 && choice.includes('摸牌')) return '摸牌';
                                        if (choice.includes('防止伤害')) return '防止伤害';
                                        return undefined;
                                    };
                                    var targets = ui.selected.targets;
                                    if (targets.length) {
                                        for (var current of targets) choice.remove(maxEff(current));
                                    }
                                    if (maxEff(target) && choice.includes(maxEff(target))) return choice.length - choice.indexOf(maxEff(target));
                                    return 0;
                                },
                            },
                        },
                    },
                    '2': {
                        audio: 'binglun',
                        filterTarget: true,
                        content() {
                            'step 0'
                            if (player.countMark('bilibili_renwang') > 1) {
                                var map = {};
                                var list = [];
                                for (var i = 1; i <= Math.min(3, player.countMark('bilibili_renwang')); i++) {
                                    var cn = (i + '点');
                                    map[cn] = i;
                                    list.push(cn);
                                }
                                event.map = map;
                                player.chooseControl(list).set('prompt', '消耗至多' + Math.min(3, player.countMark('bilibili_renwang')) + '点仁望值，令' + get.translation(target) + '选择等量项执行').set('ai', function () {
                                    var player = _status.event.player;
                                    var target = _status.event.target;
                                    var num = 1;
                                    if (target.maxHp - target.countCards('h') > 0) num++;
                                    if (target.isDamaged()) num++;
                                    num = Math.min(num, Math.min(3, player.countMark('bilibili_renwang')));
                                    return (num + '点');
                                }).set('target', target);
                            }
                            else {
                                event.map = { '1点': 1 };
                                event._result = { control: '1点' };
                            }
                            'step 1'
                            var num = event.map[result.control];
                            lib.skill.bilibili_renwang.changeMark(player, -num);
                            target.chooseButton([
                                '病论：请选择' + get.cnNumber(num) + '项',
                                [[
                                    ['摸牌', '将手牌补至与体力值相同（至多摸五张）'],
                                    ['回血', '回复1点体力'],
                                    ['防止伤害', '防止下一次受到的伤害直到回合开始']
                                ], 'textbutton']
                            ], num, true).set('ai', function (button) {
                                var player = _status.event.player;
                                var num1 = player.getDamagedHp() * 2;
                                var num2 = Math.min(5, Math.max(0, player.maxHp - player.countCards('h')));
                                if (player.hasSkillTag('nogain')) num2 = 0;
                                if (button.link == '摸牌' && num2 >= num1) return 4;
                                if (button.link == '回血' && num1 > 0) return 3;
                                if (button.link == '摸牌' && num2 > 0) return 2;
                                if (button.link == '防止伤害') return 1;
                                return 0.5;
                            });
                            'step 2'
                            var choice = ['摸牌', '回血', '防止伤害'];
                            game.log(target, '选择了', '#g' + result.links.sort((a, b) => choice.indexOf(a) - choice.indexOf(b)));
                            if (result.links.includes('摸牌')) target.draw(Math.min(5, Math.max(0, target.maxHp - target.countCards('h'))));
                            if (result.links.includes('回血')) target.recover();
                            if (result.links.includes('防止伤害')) {
                                target.addTempSkill('bolbinglun_damage', { player: 'phaseBegin' });
                                target.addMark('bolbinglun_damage', 1, false);
                            }
                        },
                        ai: { result: { target: 1 } },
                    },
                },
            },
            //贾南风
            bolduliao: {
                init(player) {
                    if (!_status.gameDrawed) return;
                    for (var target of game.players) {
                        if (!target.hasCard('hs')) continue;
                        var history = game.getAllGlobalHistory('cardMove', function (evt) {
                            if (!evt.cards.some(card => target.getCard('hs').includes(card))) return false;
                            if (evt.name == 'lose') return evt.position == ui.discardPile;
                            return evt.name == 'cardsDiscard';
                        });
                        if (history.length) {
                            var evt = history[history.length - 1];
                            if (lib.skill.bolduliao.getBool(evt, player)) {
                                target.addGaintag(target.getCard('hs', card => evt.cards.includes(card)), skill);
                            }
                        }
                    }
                },
                onremove(player) {
                    var skill = 'bolduliao' + player.playerid;
                    for (var i of game.players) i.removeGaintag(skill);
                },
                initSkill(player) {
                    var skill = 'bolduliao' + player.playerid;
                    game.broadcastAll(skill => {
                        lib.skill[skill] = {};
                        lib.translate[skill] = '毒獠·' + get.translation(player);
                    }, skill);
                },
                getBool(event, player) {
                    if (event.name != 'cardsDiscard') return event.type == 'discard' && event.player == player;
                    var evtx = event.getParent();
                    return evtx.name == 'orderingDiscard' && (evtx.relatedEvent || evtx.getParent()).player == player;
                },
                trigger: { global: 'useCard' },
                filter(event, player) {
                    if (!event.cards || !event.cards.length) return false;
                    var history = game.getAllGlobalHistory('cardMove', function (evt) {
                        if (!evt.cards.some(card => event.cards.includes(card))) return false;
                        if (evt.name == 'lose') return evt.position == ui.discardPile;
                        return evt.name == 'cardsDiscard';
                    });
                    if (!history.length) return false;
                    var evt = history[history.length - 1];
                    return lib.skill.bolduliao.getBool(evt, player);
                },
                forced: true,
                logTarget: 'player',
                content() {
                    'step 0'
                    trigger.targets.length = 0;
                    trigger.all_excluded = true;
                    game.log(trigger.card, '被无效了');
                    'step 1'
                    game.delayx();
                    'step 2'
                    trigger.player.line(player);
                    player.damage(1, trigger.player);
                },
                group: 'bolduliao_mark',
                subSkill: {
                    mark: {
                        charlotte: true,
                        trigger: { global: ['gainAfter', 'loseAsyncAfter'], player: 'die' },
                        filter(event, player) {
                            if (event.name == 'die') return true;
                            if (!player.isIn()) return false;
                            return game.hasPlayer(function (current) {
                                if (!event.getg(current).length) return false;
                                var history = game.getAllGlobalHistory('cardMove', function (evt) {
                                    if (!evt.cards.some(card => event.getg(current).includes(card))) return false;
                                    if (evt.name == 'lose') return evt.position == ui.discardPile;
                                    return evt.name == 'cardsDiscard';
                                });
                                if (!history.length) return false;
                                var evt = history[history.length - 1];
                                return lib.skill.bolduliao.getBool(evt, player);
                            });
                        },
                        forceDie: true,
                        silent: true,
                        firstDo: true,
                        priority: 114514,
                        content() {
                            if (trigger.name == 'die') lib.skill.bolduliao.onremove(player);
                            else {
                                var skill = 'bolduliao' + player.playerid;
                                if (!lib.skill[skill]) lib.skill.bolduliao.initSkill(player);
                                for (var current of game.players) {
                                    if (!trigger.getg(current).length) continue;
                                    var history = game.getAllGlobalHistory('cardMove', function (evt) {
                                        if (!evt.cards.some(card => trigger.getg(current).includes(card))) return false;
                                        if (evt.name == 'lose') return evt.position == ui.discardPile;
                                        return evt.name == 'cardsDiscard';
                                    });
                                    if (!history.length) continue;
                                    var evt = history[history.length - 1];
                                    if (lib.skill.bolduliao.getBool(evt, player)) current.addGaintag(trigger.getg(current).filter(card => evt.cards.includes(card)), skill);
                                }
                            }
                        },
                    },
                },
            },
            bolhuidu: {
                trigger: { player: 'damageBegin4', source: 'damageBegin3' },
                filter(event, player) {
                    return event.source && event.source.isIn() && event.source.countCards('he', function (card) {
                        return event.source.canRecast(card);
                    }) && (event.source.hasSex('male') || event.source.hasSex('female'));
                },
                direct: true,
                content() {
                    'step 0'
                    if (trigger.source.hasSex('male')) {
                        trigger.source.chooseCard(get.prompt('bolhuidu'), '重铸任意张牌，防止对' + get.translation(player) + '造成的伤害', lib.filter.cardRecastable, [1, Infinity], 'he').set('allowChooseAll', true).set('ai', function (card) {
                            if (_status.event.goon) return lib.skill.zhiheng.check(card) + 1;
                            return 0;
                        }).set('goon', get.damageEffect(player, trigger.source, trigger.source));
                    }
                    else event.goto(2);
                    'step 1'
                    if (result.bool) {
                        player.logSkill('bolhuidu', trigger.source);
                        var cards = result.cards;
                        trigger.source.loseToDiscardpile(cards);
                        trigger.source.draw(cards.length);
                        trigger.cancel();
                    }
                    'step 2'
                    if (!trigger.source.hasSex('female')) event.finish();
                    'step 3'
                    player.chooseBool(get.prompt('bolhuidu', trigger.source), '重铸' + get.translation(trigger.source) + '一个区域的所有牌').set('choice', function () {
                        var att = get.attitude(player, trigger.source);
                        if (att == 0) return false;
                        if (att < 0) return !trigger.source.countCards('h', card => trigger.source.canRecast(card));
                        for (var i of ['h', 'e']) {
                            var cards = trigger.source.getCards(i, card => trigger.source.canRecast(card)), value = 0;
                            if (!cards.length) continue;
                            for (var j of cards) value += get.value(j);
                            value = value / cards.length;
                            if (value <= 5) {
                                return true;
                                break;
                            }
                        }
                        return false;
                    });
                    'step 4'
                    if (result.bool) {
                        var list = [];
                        if (trigger.source.countCards('h')) list.push('手牌区');
                        if (trigger.source.countCards('e')) list.push('装备区');
                        if (!list.length) event.finish();
                        else if (list.length == 1) event._result = { control: list[0] };
                        else player.chooseControl(list).set('target', trigger.source).set('ai', function () {
                            var player = _status.event.player;
                            var target = _status.event.target;
                            var list = _status.event.controls;
                            var att = get.attitude(player, target);
                            if (att == 0) return list.randomGet();
                            if (att < 0) return '装备区';
                            for (var i of ['h', 'e']) {
                                var cards = trigger.source.getCards(i, card => trigger.source.canRecast(card)), value = 0;
                                if (!cards.length) continue;
                                for (var j of cards) value += get.value(j);
                                value = value / cards.length;
                                if (value <= 5) {
                                    return list[['h', 'e'].indexOf(i)];
                                    break;
                                }
                            }
                            return list.randomGet();
                        }).set('prompt', '令' + get.translation(trigger.source) + '重铸一个区域的所有牌');
                    }
                    else event.finish();
                    'step 5'
                    if (result.control) {
                        player.logSkill('bolhuidu', trigger.source);
                        var position = ['h', 'e'][['手牌区', '装备区'].indexOf(result.control)];
                        var cards = trigger.source.getCards(position, card => trigger.source.canRecast(card));
                        if (cards.length) trigger.source.recast(cards);
                    }
                },
            },
            bolfushou: {
                trigger: { global: 'phaseEnd' },
                filter(event, player) {
                    return !player.isMaxHp();
                },
                juexingji: true,
                forced: true,
                skillAnimation: true,
                animationColor: 'thunder',
                content() {
                    'step 0'
                    player.awakenSkill('bolfushou');
                    'step 1'
                    var cards = [];
                    game.countPlayer2(function (current) {
                        current.getHistory('lose', function (evt) {
                            if (evt.position == ui.discardPile) cards.addArray(evt.cards.filter(card => !cards.includes(card) && get.position(card, true) == 'd'));
                        });
                    });
                    game.getGlobalHistory('cardMove', function (evt) {
                        if (evt.name == 'cardsDiscard') cards.addArray(evt.cards.filter(card => !cards.includes(card) && get.position(card, true) == 'd'));
                    });
                    if (player.countCards('h')) player.loseToDiscardpile(player.getCards('h'))._triggered = null;
                    if (cards.length) player.gain(cards, 'gain2')._triggered = null;
                    game.log(player, '交换了', '#g手牌', '和', '#y本回合弃牌堆');
                    'step 2'
                    var cards1 = Array.from(ui.cardPile.childNodes);
                    var cards2 = Array.from(ui.discardPile.childNodes);
                    if (cards1.length) game.cardsDiscard(cards1);
                    while (cards2.length) ui.cardPile.insertBefore(cards2.pop(), ui.cardPile.firstChild);
                    game.log(player, '交换了', '#g牌堆', '和', '#y弃牌堆');
                    game.updateRoundNumber();
                    'step 3'
                    var num1 = player.maxHp - player.hp;
                    var num2 = player.hp;
                    player.maxHp = num2;
                    if (num1 > 0) player.changeHujia(num1);
                    player.update();
                    game.log(player, '交换了', '#g体力上限', '和', '#y体力值');
                },
            },
            //贱·陈珪
            bolyingtu: {
                audio: 'dcyingtu',
                trigger: { global: ['gainAfter', 'loseAsyncAfter'] },
                filter(event, player) {
                    return lib.skill.dcyingtu.filterx(event, player, player.getPrevious());
                },
                logTarget: (event, player) => player.getPrevious(),
                check(event, player) {
                    return lib.skill.dcyingtu.check(player, player.getPrevious());
                },
                content() {
                    'step 0'
                    var target = player.getPrevious();
                    var num = trigger.getg(target).length;
                    event.num = num;
                    player.gainPlayerCard(target, true, 'he', num);
                    'step 1'
                    var he = player.getCards('he');
                    if (he.length) {
                        var target = player.getNext();
                        event.target = target;
                        if (he.length <= num) event._result = { bool: true, cards: he };
                        else player.chooseCard('he', true, num, '交给' + get.translation(target) + get.cnNumber(num) + '张牌');
                    }
                    else event.finish();
                    'step 2'
                    if (result.bool) {
                        player.line(target);
                        player.give(result.cards, target);
                    }
                },
                group: 'bolyingtu_next',
                global: 'bolyingtu_ai',
                subSkill: {
                    next: {
                        audio: 'dcyingtu',
                        trigger: { global: 'useCardToPlayer' },
                        filter(event, player) {
                            if (event.player != player.getNext() || !event.isFirstTarget) return false;
                            if (event.card.name != 'sha' && event.card.name != 'juedou') return false;
                            return !event.targets.includes(player) && !event.targets.includes(player.getPrevious()) && event.player.canUse(event.card, player.getPrevious(), false);
                        },
                        logTarget: (event, player) => player.getNext(),
                        line: false,
                        check(event, player) {
                            var sum = event.targets.reduce((num, target) => {
                                return num + get.effect(target, event.card, event.player, player);
                            }, 0);
                            return sum < get.effect(player.getPrevious(), event.card, event.player, player);
                        },
                        prompt2(event, player) {
                            return '将' + get.translation(event.card) + '转移给' + get.translation(player.getPrevious());
                        },
                        content() {
                            'step 0'
                            var targets = trigger.targets.slice();
                            player.line2([player.getNext(), player.getPrevious()]);
                            trigger.targets.removeArray(targets);
                            trigger.getParent().triggeredTargets1.removeArray(targets);
                            trigger.untrigger();
                            trigger.targets.push(player.getPrevious());
                            'step 1'
                            game.delayx();
                        },
                    },
                    ai: {
                        ai: {
                            effect: {
                                player_use(card, player, target) {
                                    if (!player.getPrevious().hasSkill('bolyingtu')) return;
                                    if (card.name != 'sha' && card.name != 'juedou') return;
                                    var range;
                                    var select = get.copy(get.info(card).selectTarget);
                                    if (select == undefined) {
                                        if (get.info(card).filterTarget == undefined) return false;
                                        range = [1, 1];
                                    }
                                    else if (typeof select == 'number') range = [select, select];
                                    else if (get.itemtype(select) == 'select') range = select;
                                    else if (typeof select == 'function') range = select(card, player);
                                    game.checkMod(card, player, range, 'selectTarget', player);
                                    var targets = game.filterPlayer(targetx => player.canUse(card, targetx));
                                    if (range[1] != -1) {
                                        targets = targets.filter(targetx => get.effect(targetx, card, player, player) > 0);
                                        targets.sort((a, b) => get.effect(b, card, player, player) - get.effect(a, card, player, player));
                                        targets = targets.slice(0, range[1]);
                                    }
                                    if (targets.includes(player.getPrevious().getPrevious())) return;
                                    var sum = targets.reduce((num, targetx) => {
                                        return num + get.effect(targetx, card, player, player.getPrevious());
                                    }, 0);
                                    if (sum < get.effect(player.getPrevious().getPrevious(), card, player, player.getPrevious())) return 'zeroplayertarget';
                                },
                            },
                        },
                    },
                },
            },
            bolcongshi: {
                global: 'bolcongshi_use',
                audio: 'dccongshi',
                trigger: { global: 'damageSource' },
                filter(event, player) {
                    if (!event.card || !event.card.bolcongshi || player.isHealthy()) return false;
                    return event.card.bolcongshi[player.playerid] && event.card.bolcongshi[player.playerid].includes(event.player);
                },
                forced: true,
                content() {
                    player.recover();
                },
                subSkill: {
                    use: {
                        mod: {
                            targetInRange(card, player, target) {
                                if (_status.CongShiCheck || !player.isMaxHp()) return;
                                if (!target.getPrevious().hasSkill('bolcongshi') && !target.getNext().hasSkill('bolcongshi')) return;
                                return true;
                            },
                        },
                        trigger: { player: 'useCard1' },
                        filter(event, player) {
                            if (!event.targets || !event.targets.length || !player.isMaxHp()) return false;
                            var targets = event.targets.filter(target => target.getPrevious().hasSkill('bolcongshi') || target.getNext().hasSkill('bolcongshi'));
                            if (!targets.length) return false;
                            return targets.some(target => {
                                if (!player.canUse(event.card, target)) return false;
                                _status.CongShiCheck = true;
                                if (!player.canUse(event.card, target)) {
                                    delete _status.CongShiCheck;
                                    return true;
                                }
                                else {
                                    delete _status.CongShiCheck;
                                    return false;
                                }
                            });
                        },
                        firstDo: true,
                        priority: 11 + 45 + 14,
                        forced: true,
                        popup: false,
                        content() {
                            var targetx = trigger.targets.filter(target => {
                                if (!target.getPrevious().hasSkill('bolcongshi') && !target.getNext().hasSkill('bolcongshi')) return false;
                                if (!player.canUse(trigger.card, target)) return false;
                                _status.CongShiCheck = true;
                                if (!player.canUse(trigger.card, target)) {
                                    delete _status.CongShiCheck;
                                    return true;
                                }
                                else {
                                    delete _status.CongShiCheck;
                                    return false;
                                }
                            });
                            var targets = game.filterPlayer(current => {
                                if (!targetx.some(target => current == target.getPrevious() || current == target.getNext())) return false;
                                return current.hasSkill('bolcongshi');
                            });
                            trigger.card.bolcongshi = {};
                            targets.forEach(target => trigger.card.bolcongshi[target.playerid] = targetx.filter(current => current == target.getPrevious() || current == target.getNext()));
                        },
                    },
                },
            },
            yicong_jsp_zhaoyun: { audio: 2 },
            //牢狂
            //知箸侠
            bilibili_huishi: {
                audio: 'shuishi',
                inherit: 'reshuishi',
                limited: true,
                skillAnimation: true,
                animationColor: 'thunder',
                content() {
                    'step 0'
                    player.awakenSkill('bilibili_huishi');
                    event.cards = [];
                    event.suits = [];
                    'step 1'
                    player.judge(result => {
                        var evt = _status.event.getParent('bilibili_huishi');
                        return 1 - evt?.suits?.includes(get.suit(result));
                    }).set('callback', lib.skill.bilibili_huishi.callback).judge2 = function (result) {
                        return result.bool ? true : false;
                    };
                    'step 2'
                    var cards = cards.filterInD();
                    if (cards.length) {
                        player.chooseTarget('将' + get.translation(cards) + '交给一名角色', true).set('ai', target => {
                            var player = _status.event.player, att = get.attitude(player, target);
                            if (att <= 0) return att;
                            if (target.countCards('h') + _status.event.num >= _status.event.max) att /= 3;
                            if (target.hasSkillTag('nogain')) att /= 10;
                            return att;
                        }).set('num', cards.length).set('max', game.filterPlayer().reduce((num, i) => {
                            return Math.max(num, i.countCards('h'));
                        }, 0));
                    }
                    else event.finish();
                    'step 3'
                    if (result.bool) {
                        var target = result.targets[0];
                        event.target = target;
                        player.line(target, 'green');
                        target.gain(cards, 'gain2').giver = player;
                    }
                    else event.finish();
                    'step 4'
                    if (target.isMaxHandcard()) player.loseMaxHp();
                },
                callback() {
                    'step 0'
                    var evt = event.getParent(2);
                    event.getParent().orderingCards.remove(event.judgeResult.card);
                    evt.cards.push(event.judgeResult.card);
                    if (event.getParent().result.bool && player.maxHp < 10) {
                        evt.suits.push(event.getParent().result.suit);
                        player.gainMaxHp();
                        player.chooseBool('是否继续发动【慧识】？').set('frequentSkill', 'bilibili_huishi');
                    }
                    else event._result = { bool: false };
                    'step 1'
                    if (result.bool) event.getParent(2).redo();
                },
                ai: {
                    order: 0.001,
                    result: { player: 1 },
                },
            },
            //宝神
            bilibili_pojun: {
                audio: 'repojun',
                group: 'repojun_jiaozi',
                trigger: { player: 'useCardToPlayered' },
                filter(event, player) {
                    return event.card.name == 'sha' && event.target.countGainableCards(player, 'h');
                },
                logTarget: 'target',
                prompt2(event, player) {
                    return '获得' + get.translation(event.target) + '的所有手牌';
                },
                content() {
                    player.gain(trigger.target.getGainableCards(player, 'h'), player, 'giveAuto', 'bySelf');
                },
                group: 'bilibili_pojun_jiaozi',
                subSkill: {
                    jiaozi: {
                        audio: 'repojun',
                        inherit: 'jiaozi',
                        locked: false,
                    },
                },
            },
            bilibili_baodao: {
                charlotte: true,
                superCharlotte: true,
                trigger: {
                    global: ['gameStart', 'phaseBefore'],
                    player: ['enterGame'],
                },
                filter(event, player) {
                    if (event.name == 'phase' && game.phaseNumber > 0) return false;
                    return player.hasEquipableSlot(1) && !player.getEquips('guding').length;
                },
                forced: true,
                popup: false,
                async content(event, trigger, player) {
                    const card = game.createCard2('guding', 'spade', 1);
                    await player.equip(card);
                    while (get.cardPile('guding')) {
                        await game.cardsGotoSpecial([get.cardPile('guding')]);
                    }
                    for (const target of game.filterPlayer()) {
                        const cards = target.getCards('hejsx', i => i != card && i.name == 'guding');
                        if (cards.length) await target.lose(cards, ui.special);
                    }
                },
                mod: {
                    canBeGained(card, source, player) {
                        if (player.getEquips('guding').includes(card)) return false;
                    },
                    canBeDiscarded(card, source, player) {
                        if (player.getEquips('guding').includes(card)) return false;
                    },
                    canBeReplaced(card, player) {
                        if (player.getEquips('guding').includes(card)) return false;
                    },
                    cardDiscardable(card, player) {
                        if (player.getEquips('guding').includes(card)) return false;
                    },
                    cardEnabled2(card, player) {
                        if (player.getEquips('guding').includes(card)) return false;
                    },
                },
                group: 'bilibili_baodao_blocker',
                subSkill: {
                    blocker: {
                        charlotte: true,
                        superCharlotte: true,
                        trigger: { player: ['loseBefore', 'disableEquipBefore'] },
                        filter(event, player) {
                            if (event.name == 'disableEquip') return event.slots.includes('equip1');
                            var cards = player.getEquips('guding');
                            return event.cards.some(card => cards.includes(card));
                        },
                        forced: true,
                        popup: false,
                        content() {
                            if (trigger.name == 'lose') trigger.cards.removeArray(player.getEquips('guding'));
                            else {
                                while (trigger.slots.includes('equip1')) trigger.slots.remove('equip1');
                            }
                        },
                    },
                },
            },
            //神贾诩
            boljiandai: {
                init(player) {
                    if (!player.isTurnedOver()) {
                        player.classList.toggle("turnedover");
                        game.broadcast(function (player) {
                            player.classList.toggle("turnedover");
                        }, player);
                        game.addVideo("turnOver", player, player.classList.contains("turnedover"));
                    }
                },
                trigger: { player: 'turnOverBefore' },
                filter(event, player) {
                    return player.isTurnedOver();
                },
                forced: true,
                content() {
                    trigger.cancel();
                },
            },
            bolfangcan: {
                trigger: { global: 'phaseEnd' },
                filter(event, player) {
                    const list = lib.skill.bolfangcan.getCards();
                    return list[0].length == 1 || list[1].length == 1;
                },
                forced: true,
                async content(event, trigger, player) {
                    const list = lib.skill.bolfangcan.getCards();
                    let cards = [];
                    for (const i of list) {
                        if (i.length == 1) cards.addArray(i);
                    }
                    const result = await player.chooseButton(['###纺残###<div class="text center">获得或视为使用其中一张牌</div>', cards], true).set('ai', button => {
                        const player = get.event().player, card = button.link;
                        return player.getUseValue(button.link, true) + get.value(card);
                    }).forResult();
                    if (result.bool) {
                        const choose = result.links[0], vcard = new lib.element.VCard({ name: get.name(choose, player), nature: get.nature(choose, player), isCard: true });
                        if (player.hasUseTarget(vcard, true)) {
                            const result2 = await player.chooseUseTarget(vcard, false, '###纺残###视为使用' + get.translation(vcard) + '，或获得' + get.translation(choose)).forResult();
                            if (result2.bool) return;
                        }
                        await player.gain(choose, 'gain2');
                    }
                },
                getCards() {
                    const history = game.getGlobalHistory('everything', evt => evt.name == 'lose' && evt.position == ui.discardPile).slice().concat(game.getGlobalHistory('cardMove', evt => evt.name == 'cardsDiscard'));
                    const cards = history.reduce((list, evt) => list.addArray(evt.cards.filterInD('d')), []);
                    return [cards.filter(i => get.type(i, false) == 'trick'), cards.filter(i => get.type(i, false) != 'delay' && get.tag(i, 'damage'))];
                },
            },
            boljuemei: {
                trigger: { global: ['recoverEnd', 'loseMaxHpEnd', 'dyingAfter'] },
                filter(event, player) {
                    if (!event.player.isIn() || !player.canEquip(game.createCard('bol_wuqibingfa', 'none', 0), true)) return false;
                    return event.name == 'dying' || event.player.isHealthy();
                },
                forced: true,
                async content(event, trigger, player) {
                    const wuqibingfa = game.createCard('bol_wuqibingfa', 'none', 0);
                    await player.equip(wuqibingfa);
                    if (game.getAllGlobalHistory('everything', evt => {
                        return evt.name == 'boljuemei' && evt.player == player;
                    }).indexOf(event) % 2 == 1 && player.getStockSkills(false, true).length) {
                        await player.removeSkills(player.getStockSkills(false, true)[0]);
                    };
                },
                derivation: 'bol_wuqibingfa',
            },
            bol_wuqibingfa: {
                charlotte: true,
                equipSkill: true,
                trigger: {
                    player: 'loseAfter',
                    global: ['equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter', 'addToExpansionAfter'],
                },
                filter(event, player) {
                    if (!lib.skill.bol_wuqibingfa.countSkill(player)) return false;
                    const evt = event.getl(player);
                    return evt?.es?.some(card => card.name == 'bol_wuqibingfa');
                },
                forced: true,
                async content(event, trigger, player) {
                    const num = Math.min(game.countPlayer(), lib.skill.bol_wuqibingfa.countSkill(player));
                    const result = await player.chooseTarget('请选择【吴起兵法】的目标', '令至多' + get.cnNumber(num) + '名角色于本回合结束时将一张手牌当作【杀】使用', [1, num], true).set('ai', target => {
                        const player = get.event().player, sha = new lib.element.VCard({ name: 'sha' });
                        return get.attitude(player, target) * target.getUseValue(sha, true);
                    }).forResult();
                    if (result?.bool && result.targets?.length) {
                        const { targets } = result;
                        player.line(targets);
                        for (const i of targets.slice().sortBySeat()) i.addTempSkill('bol_wuqibingfa_sha');
                    }
                },
                countSkill(player) {
                    return player.getSkills(null, false, false).filter(i => !(get.info(i) || {}).charlotte).length;
                },
                subSkill: {
                    sha: {
                        charlotte: true,
                        mark: true,
                        intro: { content: '本回合结束时，将一张牌当作【杀】使用' },
                        trigger: { global: 'phaseEnd' },
                        filter(event, player) {
                            return player.hasCard(card => player.hasUseTarget(get.autoViewAs({ name: 'sha' }, [card]), true), 'hes');
                        },
                        forced: true,
                        popup: false,
                        async content(event, trigger, player) {
                            if (!player.hasCard(card => player.hasUseTarget(get.autoViewAs({ name: 'sha' }, [card]), true), 'hes')) return;
                            const next = player.chooseToUse();
                            next.set('openskilldialog', '###吴起兵法###将一张牌当作【杀】使用');
                            next.set('forced', true);
                            next.set('norestore', true);
                            next.set('addCount', false);
                            next.set('_backupevent', 'bol_wuqibingfa_backup');
                            next.set('custom', {
                                add: {},
                                replace: { window() { } }
                            });
                            next.backup('bol_wuqibingfa_backup');
                            await next;
                        },
                    },
                    backup: {
                        filterCard(card) {
                            return get.itemtype(card) == 'card';
                        },
                        position: 'hes',
                        viewAs: { name: 'sha' },
                        filterTarget: lib.filter.filterTarget,
                        check: card => -get.value(card),
                        log: false,
                    },
                },
            },
            bolluoshu: {
                initSkill() {
                    let list, skills = [];
                    if (get.mode() == 'guozhan') {
                        list = Object.keys(lib.characterPack.mode_guozhan).filter(i => lib.character[i]);
                    }
                    else if (_status.connectMode) list = get.charactersOL();
                    else list = Object.keys(lib.character).filter(i => !lib.filter.characterDisabled2(i) && !lib.filter.characterDisabled(i));
                    for (const i of list) {
                        const iskills = (get.character(i).skills || []);
                        if (i.indexOf('gz_jun') == 0 || !iskills.length) continue;
                        skills.addArray(iskills.filter(j => {
                            const info = (get.info(j) || {});
                            return info.limited && !info.combo && !info.charlotte;
                        }));
                    }
                    const derivation = ['xingshuai', 'xiongyi', 'bolxiongsuan', 'olzaowang', 'qimou', 'xinfencheng', 'yongdi', 'jianshu', 'reluanwu'];
                    _status.bolluoshuList = lib.config.extension_活动武将_ShenJiaXu ? derivation : skills;
                },
                trigger: { player: 'phaseZhunbeiBegin' },
                forced: true,
                async content(event, trigger, player) {
                    if (!_status.bolluoshuList) lib.skill.bolluoshu.initSkill();
                    let list = [], goon = player.hasSkill('bolfenfou', null, false, false);
                    if (!goon) list.add('bolfenfou');
                    list.addArray(_status.bolluoshuList.filter(skill => !player.hasSkill(skill, null, false, false)).randomGets(goon ? 3 : 2));
                    if (!list.length) {
                        player.popup('杯具');
                        game.log('已经没有可以获得的技能了！');
                        return;
                    }
                    const { control: skill } = await player.chooseControl(list).set('choiceList', list.map(i => {
                        return '<div class="skill">【' + get.translation(lib.translate[i + '_ab'] || get.translation(i).slice(0, 2)) + '】</div><div>' + get.skillInfoTranslation(i, player) + '</div>';
                    })).set('displayIndex', false).set('prompt', '络殊：请选择你要获得的技能').set('ai', () => {
                        let list = get.event().controls.slice();
                        return list.sort((a, b) => get.skillRank(b, 'in') - get.skillRank(a, 'in'))[0];
                    }).forResult();
                    player.popup(skill);
                    await player.addSkills(skill);
                },
                derivation: ['bolfenfou', 'zhendu'],
            },
            bolfenfou: {
                limited: true,
                trigger: { global: 'roundStart' },
                logTarget: () => game.filterPlayer().sortBySeat(),
                check: (_, player) => !player.hasUnknown(),
                skillAnimation: true,
                anmiationColor: 'fire',
                async content(event, trigger, player) {
                    player.awakenSkill('bolfenfou');
                    const targets = game.filterPlayer().sortBySeat();
                    let humans = targets.filter(current => current === game.me || current.isOnline());
                    let locals = targets.slice();
                    let choice = {};
                    locals.removeArray(humans);
                    const eventId = get.id();
                    const send = (current, eventId) => {
                        lib.skill.bolfenfou.chooseButton(current, eventId);
                        game.resume();
                    };
                    event._global_waiting = true;
                    let time = 10000;
                    if (lib.configOL && lib.configOL.choose_timeout) time = parseInt(lib.configOL.choose_timeout) * 1000;
                    targets.forEach(current => current.showTimer(time));
                    if (humans.length > 0) {
                        const solve = function (resolve, reject) {
                            return function (result, player) {
                                if (result?.bool) {
                                    choice[player.playerid] = result.links;
                                    resolve();
                                } else reject();
                            };
                        };
                        await Promise.any(
                            humans.map(current => {
                                return new Promise(async (resolve, reject) => {
                                    if (current.isOnline()) {
                                        current.send(send, current, eventId);
                                        current.wait(solve(resolve, reject));
                                    }
                                    else {
                                        const next = lib.skill.bolfenfou.chooseButton(current, eventId);
                                        const solver = solve(resolve, reject);
                                        if (_status.connectMode) game.me.wait(solver);
                                        const result = await next.forResult();
                                        if (_status.connectMode) game.me.unwait(result, current);
                                        else solver(result, current);
                                    }
                                });
                            })
                        ).catch(() => { });
                        game.broadcastAll("cancel", eventId);
                    }
                    if (locals.length > 0) {
                        for (let current of locals) {
                            const result = await lib.skill.bolfenfou.chooseButton(current).forResult();
                            if (result?.bool) choice[current.playerid] = result.links;
                        }
                    }
                    delete event._global_waiting;
                    for (let i of targets) i.hideTimer();
                    for (const target of targets) {
                        const controls = choice[target.playerid].map(i => { return { 'turnOver': '翻面', 'draw': '摸牌', 'zhendu': '鸩毒' }[i] })
                        target.popup(controls);
                        game.log(target, '选择了', '#y' + controls);
                        if (choice[target.playerid].includes('turnOver')) await target.turnOver();
                        if (choice[target.playerid].includes('draw')) await target.draw(2);
                        if (choice[target.playerid].includes('zhendu')) {
                            await target.addAdditionalSkills('bolfenfou_zhendu', 'zhendu');
                            target.addTempSkill('bolfenfou_zhendu', 'roundStart');
                        }
                    }
                },
                subSkill: { zhendu: { charlotte: true } },
                chooseButton(player, eventId) {
                    return player.chooseButton(2, [
                        '###纷殕###<div class="text center">选择展示或弃置一张手牌</div>',
                        [[
                            ['turnOver', '将武将牌翻面'],
                            ['draw', '摸两张牌'],
                            ['zhendu', '本轮获得【鸩毒】']
                        ], 'textbutton']
                    ], true).set('filterButton', button => {
                        const player = get.event().player;
                        return button.link != 'zhendu' || !player.hasSkill('zhendu', null, false, false);
                    }).set('ai', button => {
                        const player = get.event().player, text = button.link;
                        if (text == 'turnOver') return (player.isTurnedOver() && !player.hasSkill('boljiandai')) ? 100 : 1;
                        if (text == 'draw') return 50;
                        return 20;
                    }).set('id', eventId).set('_global_waiting', true);
                },
            },
            bolxiongsuan: {
                limited: true,
                audio: 'xiongsuan',
                enable: 'phaseUse',
                filterCard: true,
                filter(event, player) {
                    return player.countCards('h');
                },
                filterTarget(card, player, target) {
                    return target.group == player.group || target.isFriendOf(player);
                },
                check(card) {
                    return 7 - get.value(card);
                },
                async content(event, trigger, player) {
                    const { target } = event;
                    player.awakenSkill(event.name);
                    await target.damage('nocard');
                    await player.draw(3);
                    const list = [];
                    const skills = target.getOriginalSkills();
                    for (let skill of skills) {
                        if (lib.skill[skill].limited && target.awakenedSkills.includes(skill)) list.push(skill);
                    }
                    if (!list.length) return;
                    const { control: skill } = list.length == 1 ? list[0] : await player.chooseControl(list).set('choiceList', list.map(i => {
                        return '<div class="skill">【' + get.translation(lib.translate[i + '_ab'] || get.translation(i).slice(0, 2)) + '】</div><div>' + get.skillInfoTranslation(i, player) + '</div>';
                    })).set('displayIndex', false).set('prompt', `选择${get.translation(target)}一个限定技在回合结束后其重置之`).forResult();
                    target.when({ global: 'phaseEnd' }).step(async () => {
                        target.restoreSkill(skill);
                        target.popup(get.translation(skill));
                        game.log(target, '恢复了技能', `#g${get.translation(skill)}`);
                    });
                },
                ai: {
                    order: 4,
                    damage: true,
                    result: {
                        target(player, target) {
                            if (target.hp > 1) {
                                var skills = target.getOriginalSkills();
                                if (skills.some(skill => lib.skill[skill].limited && target.awakenedSkills.includes(skill))) return 8;
                            }
                            if (target != player) return 0;
                            if (get.damageEffect(target, player, player) >= 0) return 10;
                            if (target.hp >= 4) return 5;
                            if (target.hp == 3) {
                                if (player.countCards('h') <= 2 && game.hasPlayer(function (current) {
                                    return current.hp <= 1 && get.attitude(player, current) < 0;
                                })) return 3;
                            }
                            return 0;
                        },
                    },
                },
            },
            //神张飞
            bolbaohe: {
                mod: {
                    cardname(card, player) {
                        if (get.itemtype(card) == 'card' && (get.type(card, null, false) == 'trick' || get.type(card, null, false) == 'delay')) return 'sha';
                    },
                    cardnature(card, player) {
                        if (get.itemtype(card) == 'card' && (get.type(card, null, false) == 'trick' || get.type(card, null, false) == 'delay')) return false;
                    },
                    cardUsable(card, player) {
                        if (card.name == 'sha' && (card.cards || []).length == 1 && (get.type(card.cards[0], null, false) == 'trick' || get.type(card.cards[0], null, false) == 'delay')) return Infinity;
                    },
                },
                trigger: { source: 'damageBegin1' },
                filter(event, player) {
                    return event.getParent().type == 'card';
                },
                forced: true,
                logTarget: 'player',
                content() {
                    const evt = trigger.getParent(2);
                    trigger.num = (evt.cards || []).reduce((sum, card) => sum + get.cardNameLength(card), 0);
                },
                ai: {
                    effect: {
                        player(card, player, target) {
                            if (!get.tag(card, 'damage')) return;
                            if (!(card.cards || []).length) return 'zeroplayertarget';
                        },
                    },
                },
            },
            bolrenhai: {
                init(player, skill, reinit) {
                    if (!player.storage.bolrenhai || reinit) {
                        player.storage.bolrenhai_tiaozhengED = false;
                        player.storage.bolrenhai = [
                            {
                                num: 1,
                                index: '①',
                                text: ['进行【闪电】判定'],
                                effect_1: {
                                    filter: () => true,
                                    async content(player, source) {
                                        player.executeDelayCardEffect('shandian');
                                    },
                                },
                            },
                            {
                                num: 2,
                                index: '②',
                                text: ['获得【仇海】或【崩坏】'],
                                effect_2: {
                                    filter(player) {
                                        return ['chouhai', 'benghuai'].some(skill => !player.hasSkill(skill, null, false, false));
                                    },
                                    async content(player, source, control) {
                                        let result = {};
                                        player.addSkill('bolrenhai_effect');
                                        const skills = ['chouhai', 'benghuai'].filter(skill => !player.hasSkill(skill, null, false, false));
                                        if (skills.length == 1) result = { control: skills[0] };
                                        else result = await player.chooseControl(skills).set('choiceList', skills.map(i => {
                                            return '<div class="skill">【' + get.translation(lib.translate[i + '_ab'] || get.translation(i).slice(0, 2)) + '】</div><div>' + get.skillInfoTranslation(i, player) + '</div>';
                                        })).set('displayIndex', false).set('prompt', '人骇：选择获得一个技能').set('ai', () => get.rand(0, 1)).forResult();
                                        await player.addAdditionalSkills('bolrenhai_effect', [result.control], true);
                                    },
                                },
                            },
                            {
                                num: 3,
                                index: '③',
                                text: ['将本项并入邻项'],
                                effect_3: {
                                    filter(player, source) {
                                        return source.storage.bolrenhai.length > 1;
                                    },
                                    async content(player, source, control) {
                                        source.storage.bolrenhai_tiaozhengED = true;
                                        const index = source.storage.bolrenhai.indexOf(control);
                                        const nums = Array.from({ length: source.storage.bolrenhai.length }).map((_, i) => i).filter(num => num == index + 1 || num == index - 1);
                                        for (const num of nums) {
                                            //source.storage.bolrenhai[num].num+=control.num;
                                            source.storage.bolrenhai[num].text.addArray(control.text);
                                            for (const i in control) {
                                                if (!Array.isArray(control[i]) && typeof control[i] == 'object') source.storage.bolrenhai[num][i] = control[i];
                                            }
                                        }
                                        game.log(source, '将第' + get.cnNumber(index + 1, true) + '项合并至第' + nums.map(i => get.cnNumber(i + 1, true)) + '项');
                                        source.storage.bolrenhai.remove(control);
                                    },
                                },
                            },
                            {
                                num: 4,
                                index: '④',
                                text: ['获得【无谋】或【止息】'],
                                effect_4: {
                                    filter(player) {
                                        return ['wumou', 'new_zhixi'].some(skill => !player.hasSkill(skill, null, false, false));
                                    },
                                    async content(player, source, control) {
                                        let result = {};
                                        player.addSkill('bolrenhai_effect');
                                        const skills = ['wumou', 'new_zhixi'].filter(skill => !player.hasSkill(skill, null, false, false));
                                        if (skills.length == 1) result = { control: skills[0] };
                                        else result = await player.chooseControl(skills).set('choiceList', skills.map(i => {
                                            return '<div class="skill">【' + get.translation(lib.translate[i + '_ab'] || get.translation(i).slice(0, 2)) + '】</div><div>' + get.skillInfoTranslation(i, player) + '</div>';
                                        })).set('displayIndex', false).set('prompt', '人骇：选择获得一个技能').set('ai', () => get.rand(0, 1)).forResult();
                                        await player.addAdditionalSkills('bolrenhai_effect', [result.control], true);
                                    },
                                },
                            },
                        ];
                        if (reinit) {
                            player.popup('人骇');
                            game.log(player, '重置了技能', '#g【人骇】');
                        }
                    }
                },
                trigger: { source: 'damageBegin2' },
                filter(event, player) {
                    return event.num > 0;
                },
                forced: true,
                logTarget: 'player',
                async content(event, trigger, player) {
                    let chooseED = false, target = trigger.player;
                    while (trigger.num > 0) {
                        const result = await target.chooseButton([
                            '###人骇###<div class="text center">选择执行任意项并减免对应数值的伤害<br>当前剩余' + trigger.num + '点伤害</div>',
                            [
                                player.storage.bolrenhai.map(control => {
                                    let list = [control, '减少' + control.num + '点伤害：' + control.text.join('、')], noUse = true;
                                    const effects = Object.keys(control).filter(i => !Array.isArray(control[i]) && typeof control[i] == 'object');
                                    for (const i in control) {
                                        if (!Array.isArray(control[i]) && typeof control[i] == 'object' && control[i].filter(target, player)) {
                                            noUse = false;
                                            break;
                                        }
                                    }
                                    if (noUse) list[1] = '<span style="opacity:0.5">' + list[1] + '（无法选择）</span>';
                                    return list;
                                }),
                                'textbutton',
                            ]
                        ]).set('filterButton', button => {
                            const target = get.event().player, player = get.event().getParent().player;
                            for (const i in button.link) {
                                if (!Array.isArray(button.link[i]) && typeof button.link[i] == 'object' && button.link[i].filter(target, player)) return true;
                            }
                            return false;
                        }).set('ai', button => {
                            const player = get.event().player, trigger = get.event().getTrigger();
                            let num = trigger.num;
                            if (num > 1 && player.hasSkillTag('filterDamage', null, { player: trigger.player, card: trigger.card, })) num = 1;
                            return num - Math.abs(get.event().getTrigger().num - button.link.num);
                        }).set('forced', !chooseED).forResult();
                        if (result?.bool && result.links?.length) {
                            chooseED = true;
                            const control = result.links[0];
                            target.popup('-' + control.num);
                            trigger.num -= control.num;
                            game.log(target, '选择了', '#y减少' + control.num + '点伤害：' + control.text.join('、'));
                            const nums = Array.from({ length: 4 }).map((_, i) => i + 1).filter(i => control['effect_' + i] && control['effect_' + i].filter(target, player));
                            if (!nums.length) continue;
                            for (const num of nums) {
                                await control['effect_' + num].content(target, player, control);
                            }
                        }
                        else break;
                    }
                },
                derivation: ['chouhai', 'benghuai', 'wumou', 'new_zhixi'],
                subSkill: { effect: { charlotte: true, onremove: true } },
            },
            boltiandong: {
                trigger: { player: 'phaseZhunbeiBegin' },
                filter(event, player) {
                    return game.hasPlayer(target => (target.additionalSkills['bolrenhai_effect'] || []).length);
                },
                forced: true,
                async content(event, trigger, player) {
                    let num = 0, result;
                    player.line(game.filterPlayer(target => (target.additionalSkills['bolrenhai_effect'] || []).length));
                    for (const target of game.filterPlayer()) {
                        const skills = (target.additionalSkills['bolrenhai_effect'] || []);
                        if (skills.length) {
                            num += skills.length;
                            await target.removeAdditionalSkills('bolrenhai_effect');
                            target.removeSkill('bolrenhai_effect');
                        }
                    }
                    let cards = Array.from(ui.cardPile.childNodes);
                    if (cards.length) {
                        const max = cards.map(card => get.number(card, false)).unique().sort((a, b) => b - a)[0];
                        cards = cards.filter(card => get.number(card, false) == max).randomGets(num);
                        await player.gain(cards, 'gain2');
                    }
                    if (!player.storage.bolrenhai_tiaozhengED) result = { control: '翻面' };
                    else result = await player.chooseControl('翻面', '还原').set('prompt', '天动：将武将牌翻面，或还原【人骇】').set('ai', () => {
                        const player = get.event().player;
                        return player.isTurnedOver() ? '翻面' : '还原';
                    }).forResult();
                    if (result.control == '翻面') await player.turnOver();
                    else lib.skill.bolrenhai.init(player, 'bolrenhai', true);
                },
            },
            //神张角
            bolyifu: {
                trigger: { target: 'useCardToTargeted' },
                filter(event, player) {
                    return event.card.storage?.bolyifu;
                },
                forced: true,
                locked: false,
                content() {
                    player.draw();
                },
                mark: true,
                marktext: '☯',
                zhuanhuanji: 'number',
                zhuanhuanLimit: 3,
                intro: {
                    markcount: (storage) => ['天', '地', '人'][(storage || 0) % 3],
                    content(storage, player) {
                        return '转换技。①一名角色可以将一张基本牌当作【' + ['闪电', '随机应变', '铁索连环'][(storage || 0) % 3] + '】使用。②当你成为〖蚁附①〗转化的牌的目标后，你摸一张牌。';
                    },
                },
                global: 'bolyifu_viewAs',
                subSkill: {
                    viewAs_backup: {},
                    viewAs: {
                        onChooseToUse(event) {
                            if (!game.online && !event.bolyifu) {
                                let list = [['延时锦囊', '', 'shandian', undefined, 0]], player = event.player, history = player.getHistory('useCard', evt => get.type(evt.card) == 'basic' || get.type(evt.card) == 'trick');
                                const evt = history[history.length - 1];
                                if (evt) list.push([get.translation(get.type(evt.card)), '', evt.card.name, evt.card.nature ? evt.card.nature : undefined, 1]);
                                list.push(['锦囊', '', 'tiesuo', undefined, 2]);
                                event.set('bolyifu', list);
                            }
                        },
                        forceaudio: true,
                        enable: 'chooseToUse',
                        filter(event, player) {
                            const list = event.bolyifu;
                            if (!list?.length) return false;
                            const nums = game.filterPlayer(target => target.hasSkill('bolyifu')).map(target => target.countMark('bolyifu') % 3);
                            return list.some(card => nums.includes(card[4]) && player.hasCard(cardx => get.type(cardx) == 'basic' && event.filterCard({ name: card[2], nature: card[3], storage: { bolyifu: true }, cards: [cardx] }, player, event), 'hes'));
                        },
                        chooseButton: {
                            dialog(event, player) {
                                const nums = game.filterPlayer(target => target.hasSkill('bolyifu')).map(target => target.countMark('bolyifu') % 3);
                                const list = event.bolyifu.filter(card => nums.includes(card[4]) && player.hasCard(cardx => get.type(cardx) == 'basic' && event.filterCard({ name: card[2], nature: card[3], storage: { bolyifu: true }, cards: [cardx] }, player, event), 'hes'));
                                const dialog = ui.create.dialog('蚁附', [list, 'vcard']);
                                dialog.direct = true;
                                return dialog;
                            },
                            check(button) {
                                if (get.event().getParent().type !== 'phase') return 1;
                                return get.player().getUseValue({ name: button.link[2], nature: button.link[3], storage: { bolyifu: true } });
                            },
                            backup(links, player) {
                                return {
                                    filterCard(card) {
                                        return get.type(card) == 'basic' && get.itemtype(card) == 'card';
                                    },
                                    popname: true,
                                    check(card) {
                                        return 7 - get.value(card);
                                    },
                                    position: 'hes',
                                    viewAs: {
                                        name: links[0][2],
                                        nature: links[0][3],
                                        storage: { bolyifu: true },
                                    },
                                    index: links[0][4],
                                    async precontent(event, _, player) {
                                        delete event.result.skill;
                                        const target = game.findPlayer(target => target.hasSkill('bolyifu') && target.countMark('bolyifu') % 3 == lib.skill.bolyifu_viewAs_backup.index);
                                        if (target) {
                                            await target.logSkill('bolyifu', player);
                                            target.changeZhuanhuanji('bolyifu');
                                        }
                                    },
                                }
                            },
                            prompt(links, player) {
                                const [link] = links, name = link[2], nature = link[3];
                                return '###蚁附###<div class="text center">将一张基本牌当作' + (get.translation(nature) || '') + '【' + get.translation(name) + '】使用</div>';
                            },
                        },
                        hiddenCard(player, name) {
                            if (!player.hasCard(card => get.type(card) == 'basic', 'hes')) return false;
                            const nums = game.filterPlayer(target => target.hasSkill('bolyifu')).map(target => target.countMark('bolyifu') % 3);
                            const history = player.getHistory('useCard', evt => get.type(evt.card) == 'basic' || get.type(evt.card) == 'trick');
                            const evt = history[history.length - 1];
                            if (evt?.card?.name == name && nums.includes(1)) return true;
                            return (name == 'shandian' && nums.includes(0)) || (name == 'tiesuo' && nums.includes(2));
                        },
                        ai: {
                            respondSha: true,
                            respondShan: true,
                            skillTagFilter(player, tag, arg) {
                                if (arg == 'respond') return false;
                                const name = (tag == 'respondSha' ? 'sha' : 'shan');
                                if (!lib.skill.bolyifu.subSkill.viewAs.hiddenCard(player, name)) return false;
                            },
                            order(item, player) {
                                if (player && get.event().type == 'phase') {
                                    let max = 0, nums = game.filterPlayer(target => target.hasSkill('bolyifu')).map(target => target.countMark('bolyifu') % 3);
                                    let names = (get.event().bolyifu || []);
                                    names = names.filter(card => nums.includes(names.indexOf(card)));
                                    if (!names.length) return 0;
                                    names = names.map(namex => { return { name: namex[2], nature: namex[3] } });
                                    names.forEach(card => {
                                        if (player.getUseValue(card) > 0) {
                                            let temp = get.order(card);
                                            if (temp > max) max = temp;
                                        }
                                    });
                                    if (max > 0) max += 15;
                                    return max;
                                }
                                return 0.5;
                            },
                            result: {
                                player(player) {
                                    if (get.event().dying) return get.attitude(player, get.event().dying);
                                    return 1;
                                },
                            },
                            effect: {
                                target(card, player, target) {
                                    if (!card?.storage?.bolyifu || !player || !target?.hasSkill('bolyifu')) return;
                                    return [1, get.effect(target, { name: 'draw' }, player, player)];
                                },
                            },
                        },
                    },
                },
            },
            boltianjie: {
                trigger: { global: 'shandianBefore' },
                filter(event, player) {
                    const name = event.getParent().name;
                    if (name !== 'executeDelayCardEffect' && name !== 'phaseJudge') return false;
                    return event._result && event._result.bool === false;
                },
                forced: true,
                async content(event, trigger, player) {
                    trigger.cancel();
                    const str = get.translation(trigger.player);
                    const result = await player.chooseTarget('请选择【天劫】的目标', '对' + str + '或' + str + '的上家或下家造成1点雷属性伤害', (card, player, target) => {
                        const aim = get.event().getTrigger().player;
                        return [aim, aim.getPrevious(), aim.getNext()].includes(target);
                    }, true).set('ai', target => {
                        return get.damageEffect(target, get.event().player, get.event().player, 'thunder');
                    }).forResult();
                    if (result.bool) {
                        player.line(result.targets);
                        await result.targets[0].damage(1, 'thunder');
                    }
                },
                global: 'boltianjie_ai',
                group: 'boltianjie_judge',
                subSkill: {
                    ai: {
                        ai: {
                            effect: {
                                target(card, player) {
                                    if (card?.name == 'shandian' && game.hasPlayer(target => get.attitude(player, target) > 0 && target.hasSkill('boltianjie'))) return [1, 2];
                                },
                            },
                        },
                    },
                    judge: {
                        trigger: { global: 'judgeEnd' },
                        filter(event, player) {
                            if (event.result.card.name === 'shan') return false;
                            const name = event.getParent().name;
                            if (name === 'executeDelayCardEffect' && (event.card.viewAs || event.card.name) === 'shandian') return true;
                            if (name === 'phaseJudge' && event.card[event.card.cardSymbol].name === 'shandian') return true;
                            return false;
                        },
                        forced: true,
                        logTarget: 'player',
                        content() {
                            trigger.player.executeDelayCardEffect('shandian');
                        },
                    },
                },
            },
            //桓温
            bolyuba: {
                trigger: {
                    player: 'damageEnd',
                    source: 'damageSource',
                },
                prompt2(event, player, name) {
                    let history = game.getAllGlobalHistory('everything', evt => {
                        if (evt.name !== 'damage' || !evt.player.getAllHistory('damage').includes(evt)) return false;
                        return evt.player === player || evt.source === player;
                    }).map(evt => {
                        let list = [];
                        if (evt.source === player) list.push([evt, 'damageSource']);
                        if (evt.player === player) list.push([evt, 'damageEnd']);
                        return list;
                    }).flat();
                    const num = history.indexOf(history.find(lit => lit[0] === event && lit[1] === name)) + 1;
                    return `将手牌数摸至${num}张，然后弃置一张点数为${num}的牌或失去一个技能`;
                },
                check(event, player, name) {
                    let history = game.getAllGlobalHistory('everything', evt => {
                        if (evt.name !== 'damage' || !evt.player.getAllHistory('damage').includes(evt)) return false;
                        return evt.player === player || evt.source === player;
                    }).map(evt => {
                        let list = [];
                        if (evt.source === player) list.push([evt, 'damageSource']);
                        if (evt.player === player) list.push([evt, 'damageEnd']);
                        return list;
                    }).flat();
                    return player.countCards('h') < history.indexOf(history.find(lit => lit[0] === event && lit[1] === name)) + 1;
                },
                async content(event, trigger, player) {
                    let history = game.getAllGlobalHistory('everything', evt => {
                        if (evt.name !== 'damage' || !evt.player.getAllHistory('damage').includes(evt)) return false;
                        return evt.player === player || evt.source === player;
                    }).map(evt => {
                        let list = [];
                        if (evt.source === player) list.push([evt, 'damageSource']);
                        if (evt.player === player) list.push([evt, 'damageEnd']);
                        return list;
                    }).flat();
                    const num = history.indexOf(history.find(lit => lit[0] === trigger && lit[1] === event.triggername)) + 1;
                    await player.drawTo(num);
                    const skills = player.getSkills(null, false, false).filter(skill => {
                        const info = get.info(skill);
                        return info && !info.charlotte;
                    });
                    const list = [];
                    for (const skill of skills) {
                        list.push([
                            skill,
                            '<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">' + (() => {
                                let str = get.translation(skill);
                                if (!lib.skill[skill]?.nobracket) str = '【' + str + '】';
                                return str;
                            })() + '</div><div>' + lib.translate[skill + '_info'] + '</div></div>',
                        ])
                    }
                    const forced = !player.hasCard(card => lib.filter.cardDiscardable(card, player) && get.number(card) == num, 'he');
                    if (!skills.length && forced) return;
                    const result = await player.chooseButton([
                        `###欲罢###<div class="text center">选择失去一个技能${(() => {
                            if (forced) return '';
                            return `，或点“取消”弃置一张点数为${num}的牌`;
                        })()}</div>`,
                        [list, 'textbutton'],
                    ]).set('displayIndex', false).set('ai', button => {
                        const { link: skill } = button, { player, num } = get.event();
                        const info = get.info(skill);
                        if (info?.ai?.neg || info?.ai?.halfneg) return 3;
                        if (player.hasCard(card => get.number(card) == num)) return 0;
                        if (skill.startsWith('bolhuanwen_')) return 4;
                        return 1;
                    }).set('num', num).set('forced', forced).forResult();
                    if (result?.bool && result.links?.length) {
                        const [skill] = result.links;
                        player.popup(skill);
                        await player.removeSkills(skill);
                    }
                    else await player.chooseToDiscard('he', true, card => {
                        return get.number(card) == get.event().num;
                    }, `请弃置一张点数为${num}的牌`).set('num', num);
                },
            },
            bolxingjiang: {
                enable: 'phaseUse',
                usable: 1,
                filter(event, player) {
                    return player.hasCard(card => get.info('bolxingjiang').filterCard(card, player), 'he');
                },
                filterCard(card, player) {
                    if (!['basic', 'trick'].includes(get.type(card))) return false;
                    if (ui.selected.cards.length && ui.selected.cards[0].name != card.name) return false;
                    const cards = player.getCards('he');
                    return cards.includes(card) && cards.filter(i => i.name == card.name).length > 1;
                },
                selectCard: [2, Infinity],
                position: 'he',
                complexCard: true,
                check(card) {
                    const player = get.event().player;
                    const num = player.getAllHistory('useSkill', evt => evt.skill == 'bolyuba').length;
                    const value = function (card, player) {
                        const num = player.getUseValue(card);
                        return num > 0 ? num + 1 / (get.value(card) || 0.5) + 7 : 7 - get.value(card);
                    };
                    if (ui.selected.cards.length && value(card, player) < value(ui.selected.cards[0], player) && player.hasSkill('bolyuba') && num < 3) return 20 - get.value(card);
                    if (!player.hasSkill(`bolhuanwen_${card.name}`, null, null, false)) return 10;
                    return 10 - get.value(card);
                },
                async content(event, trigger, player) {
                    const name = get.name(event.cards[0]);
                    const skill = `bolhuanwen_${name}`;
                    if (!lib.skill[skill]) {
                        const skillName = `行将•${get.translation(name).slice(0, 2)}`;
                        const skillContent = {
                            nobracket: true,
                            enable: 'chooseToUse',
                            usable: 1,
                            viewAs: {
                                name: name,
                                isCard: true,
                            },
                            filterCard: () => false,
                            selectCard: -1,
                            prompt: `视为使用【${get.translation(name)}】`,
                        };
                        const skillInfo = `每回合限一次，你可以视为使用一张【${get.translation(name)}】。`;
                        game.broadcastAll((skill, skillName, skillInfo, skillContent) => {
                            lib.translate[skill] = skillName;
                            lib.translate[`${skill}_info`] = skillInfo;
                            lib.skill[skill] = skillContent;
                            game.finishSkill(skill);
                        }, skill, skillName, skillInfo, skillContent);
                    }
                    player.popup(skill);
                    await player.addSkills(skill);
                },
                ai: {
                    order(item, player) {
                        let cards = player.getCards('he', card => get.info('bolxingjiang').filterCard(card, player) && player.getUseValue(card) > 0);
                        cards = cards.filter(card => cards.filter(i => i.name == card.name).length > 1);
                        if (player.hasSkill('bolyuba') && player.getAllHistory('useSkill', evt => evt.skill == 'bolyuba').length > 2) cards = cards.filter(card => !player.hasSkill(`bolhuanwen_${card.name}`, null, null, false));
                        if (!cards.length) return 1;
                        cards.sort((a, b) => get.order(b) - get.order(a));
                        return get.order(cards[0]) + 0.001;
                    },
                    result: {
                        player: 1,
                    },
                },
            },
            //祢衡
            bolhuaici: {
                trigger: { global: ['roundStart', 'roundEnd', 'useCard2'] },
                filter(event, player, name) {
                    if (name == 'roundStart') return true;
                    if (name == 'roundEnd') return game.roundNumber == game.countPlayer2(null, true);
                    const { card } = event;
                    const info = get.info(card);
                    if (!['basic', 'trick'].includes(get.type(card))) return false;
                    if (!player.hasCard(cardx => get.is.shownCard(cardx) && get.suit(card) == get.suit(cardx), 'h')) return false;
                    if (info.allowMultiple == false) return false;
                    if (event.targets && !info.multitarget) return lib.filter.targetEnabled2(card, event.player, player) && !event.targets.includes(player);
                    return false;
                },
                forced: true,
                async content(event, trigger, player) {
                    switch (event.triggername) {
                        case 'roundStart': {
                            const num = game.countPlayer2(null, true);
                            const cards = get.cards(num);
                            await game.cardsGotoOrdering(cards);
                            await player.showCards(cards, `${get.translation(player)}发动了【怀刺】`);
                            const result = await player.chooseButton(['怀刺：你可以获得并明置其中任意张牌', cards], [1, Infinity]).set('allowChooseAll', true).forResult();
                            if (result?.bool && result?.links?.length) {
                                const { links } = result;
                                await player.gain(links, 'gain2');
                                await player.addShownCards(links, `visible_${event.name}`);
                                await player.showCards(links, `${get.translation(player)}发动了【怀刺】`);
                            }
                            break;
                        }
                        case 'roundEnd': {
                            await player.die();
                            break;
                        }
                        default: {
                            trigger.targets.add(player);
                            await game.delayex();
                        }
                    }
                },
            },
            boljianling: {
                mark: true,
                zhuanhuanji: true,
                marktext: '☯',
                intro: {
                    content(storage, player, skill) {
                        let str = '你仅使用明置牌造成伤害的回合结束后，';
                        if (storage) str += '你令所有角色将武将牌翻至背面';
                        else str += '你执行一个额外回合';
                        return str;
                    },
                },
                trigger: { global: 'phaseAfter' },
                filter(event, player) {
                    if (!player.hasHistory('sourceDamage') || player.hasHistory('sourceDamage', evt => {
                        const history = player.getHistory('lose', evt2 => {
                            return evt2.getParent().name === 'useCard' && evt2.getParent().card === evt.card;
                        })[0];
                        return !history?.cards?.some(card => {
                            return history.gaintag_map[card.cardid]?.some(tag => {
                                return tag.slice(tag.startsWith('eternal_') ? 8 : 0).startsWith('visible_');
                            });
                        });
                    })) return false;
                    return player.storage.boljianling || game.hasPlayer(current => !current.isTurnedOver());
                },
                forced: true,
                async content(event, trigger, player) {
                    player.changeZhuanhuanji(event.name);
                    if (player.storage[event.name]) player.insertPhase();
                    else {
                        for (const target of game.filterPlayer().sortBySeat()) {
                            await target.turnOver(true);
                        }
                    }
                },
            },
            //宁静致远
            bilibili_xiezhi: {
                trigger: { global: 'phaseBegin' },
                filter(event, player) {
                    return event.player != player && event.player.isIn();
                },
                async cost(event, trigger, player) {
                    const target = trigger.player, types = lib.skill[event.skill].choice;
                    const result = await player.chooseNumbers(
                        get.prompt2(event.skill, target),
                        (() => {
                            let list = [];
                            for (const type of types) {
                                list.push({
                                    prompt: lib.translate[type] || '技能',
                                    min: 2,
                                    max: Math.floor(10 - (types.length - 1)),
                                });
                            }
                            return list;
                        })(),
                    ).set('filterOk', event => {
                        return event.numbers.reduce((sum, num) => sum + num, 0) === 10;
                    }).set('processAI', () => {
                        const { player, target } = get.event();
                        if (get.attitude(player, target) < 0) return [2, 2, 4, 2];
                    }).set('target', target).forResult();
                    if (result?.bool && result.numbers?.length) {
                        event.result = {
                            bool: true,
                            cost_data: (() => {
                                const map = {};
                                result.numbers.forEach((num, index) => map[types[index]] = num);
                                return map;
                            })(),
                        };
                    }
                },
                logTarget: 'player',
                async content(event, trigger, player) {
                    const target = trigger.player;
                    const skill = 'bilibili_xiezhi_buff';
                    target.addTempSkill(skill);
                    for (const type in event.cost_data) {
                        target.storage[skill][type] ??= 0;
                        target.storage[skill][type] += event.cost_data[type];
                    }
                    target.markSkill(skill);
                    const types = lib.skill[event.name].choice;
                    target.addTip(skill, [get.translation(skill), ...types.map(type => target.storage[skill][type].toString())].join(' '));
                },
                ai: {
                    expose: 0.25,
                    threaten: 11 + 45 + 14,
                },
                choice: ['basic', 'trick', 'equip', 'skill'],
                subSkill: {
                    buff: {
                        charlotte: true,
                        init(player, skill) {
                            player.storage[skill] ??= {};
                            if (!_status[`${skill}_finishSkill`]) {
                                game.broadcastAll(skill => {
                                    _status[`${skill}_finishSkill`] = function (skill2) {
                                        if (!lib.skill[skill2]) return;
                                        const originUsable = lib.skill[skill2].usable;
                                        lib.skill[skill2].usable = function (skill, player) {
                                            let num = (() => {
                                                const type = typeof originUsable;
                                                if (type === 'function') return originUsable.apply(this, arguments);
                                                return type === 'number' ? originUsable : Infinity;
                                            })();
                                            if (lib.skill[skill].charlotte || lib.skill[skill].ruleSkill || lib.skill[skill].equipSkill || lib.skill[skill].cardSkill || typeof player.storage['bilibili_xiezhi_buff']?.skill !== 'number') return num;
                                            return Math.min(num, player.storage['bilibili_xiezhi_buff'].skill);
                                        };
                                    };
                                    const finishSkill = game.finishSkill;
                                    game.finishSkill = function (skill2) {
                                        finishSkill.apply(this, arguments);
                                        _status[`${skill}_finishSkill`](skill2);
                                    };
                                    Object.keys(lib.skill).forEach(skill2 => {
                                        const desc = Object.getOwnPropertyDescriptor(lib.skill[skill2], 'usable');
                                        if (typeof desc?.get !== 'function') _status[`${skill}_finishSkill`](skill2);
                                    });
                                }, skill);
                            }
                        },
                        onremove(player, skill) {
                            player.removeTip(skill);
                            delete player.storage[skill];
                        },
                        intro: {
                            markcount(storage = {}) {
                                const types = lib.skill['bilibili_xiezhi'].choice;
                                return types.map(type => storage[type].toString()).join('');
                            },
                            content(storage = {}) {
                                return Object.keys(storage).map(type => {
                                    if (type === 'skill') return `限发动${storage[type]}次武将技能`;
                                    return `限使用${storage[type]}次${get.translation(type)}牌`;
                                }).join('<br>');
                            },
                        },
                        mod: {
                            cardEnabled(card, player) {
                                const type = get.type2(card);
                                if (typeof player.storage['bilibili_xiezhi_buff'][type] !== 'number') return;
                                const stat = player.getStat('card');
                                if (player.storage['bilibili_xiezhi_buff'][type] <= 0) return false;
                            },
                            cardSavable(card, player) {
                                const type = get.type2(card);
                                if (typeof player.storage['bilibili_xiezhi_buff'][type] !== 'number') return;
                                const stat = player.getStat('card');
                                if (player.storage['bilibili_xiezhi_buff'][type] <= 0) return false;
                            },
                        },
                        trigger: { player: ['useCard0', 'useSkill', 'logSkillBegin'] },
                        filter(event, player, name) {
                            if (name === 'useCard0') return player.storage['bilibili_xiezhi_buff'][get.type2(event.card)];
                            if (!player.storage['bilibili_xiezhi_buff'].skill) return false;
                            const info = get.info(event.skill);
                            if (!info || info.charlotte) return false;
                            return event.type === 'player';
                        },
                        silent: true,
                        firstDo: true,
                        async content(event, trigger, player) {
                            player.storage[event.name][event.triggername === 'useCard0' ? get.type2(trigger.card) : 'skill']--;
                            player.markSkill(event.name);
                            const types = lib.skill['bilibili_xiezhi'].choice;
                            player.addTip(event.name, [get.translation(event.name), ...types.map(type => player.storage[event.name][type].toString())].join(' '));
                        },
                    },
                },
            },
            bilibili_fazhou: {
                trigger: { global: 'roundStart' },
                filter(event, player) {
                    if (game.roundNumber <= 1) return false;
                    return game.hasPlayer(target => {
                        return target != player && lib.skill.bilibili_fazhou.findTarget(target);
                    });
                },
                findTarget(player, double) {
                    let bool = player.getRoundHistory('useCard', () => true, 1).reduce((list, evt) => list.add(get.type2(evt.card)), []).length >= 3;
                    let goon = player.getRoundHistory('sourceDamage', () => true, 1).reduce((sum, evt) => sum + evt.num, 0) >= 3;
                    return double === true ? (bool && goon) : (bool || goon);
                },
                async cost(event, trigger, player) {
                    event.result = await player.chooseTarget(get.prompt('bilibili_fazhou'), '对任意名角色肘成1点伤害，然后本轮将其肘出游戏', (card, player, target) => {
                        return target != player && lib.skill.bilibili_fazhou.findTarget(target);
                    }, [1, Infinity]).set('ai', target => {
                        const player = get.event().player;
                        return get.damageEffect(target, player, player);
                    }).forResult();
                },
                async content(event, trigger, player) {
                    for (const target of event.targets.sortBySeat(player)) {
                        const manbaout = lib.skill[event.name].findTarget(target, true) && (() => {
                            const list = get.nameList(target);
                            if (list.containsSome('bilibili_suixingsifeng', 'bilibili_yanjing')) return false;
                            return list.containsSome('bilibili_xizhicaikobe', 'bilibili_longjiuzhen') || Math.random() <= 0.08;
                        })();
                        await target.damage(manbaout ? 24 : 1);
                        if (target.isIn()) {
                            target.chat('mamba out');
                            target.addTempSkill('bilibili_fazhou_mambaout', 'roundStart');
                            /*
                            const evt = trigger;
                            if (evt.player != target && !evt._finished) {
                                evt.finish();
                                evt._triggered = 5;
                                const evtx = evt.player.insertPhase();
                                delete evtx.skill;
                            }
                            */
                        }
                    }
                },
                subSkill: {
                    mambaout: {
                        inherit: 'diaohulishan',
                    },
                },
            },
            //戏志才
            bilibili_laosao: {
                trigger: { player: ['useCard', 'respond', 'useCardToPlayer'] },
                filter(event, player, name) {
                    if (name == 'useCardToPlayer') return event.target != player;
                    return Array.isArray(event.respondTo) && event.respondTo[0] != player;
                },
                silent: true,
                async content(event, trigger, player) {
                    const target = event.triggername == 'useCardToPlayer' ? trigger.target : trigger.respondTo[0];
                    game.broadcastAll((player, target) => {
                        const flashAvatar = function (player) {
                            let i = 0;
                            if (!(player.name && lib.character[player.name]?.skills?.includes('bilibili_laosao'))) {
                                if (player.name2 && lib.character[player.name2]?.skills?.includes('bilibili_laosao')) i = 1;
                            }
                            player.smoothAvatar(i === 1);
                            const node = player.node[i === 0 ? 'avatar' : 'avatar2'], name = player[i === 0 ? 'name' : 'name2'];
                            node.setBackgroundImage('extension/活动武将/image/default/smile' + get.rand(1, 7) + '.jpg');
                            setTimeout(() => {
                                const skinName = i === 0 ? player.skin?.name : player.skin?.name2;
                                player.smoothAvatar(i === 1);
                                node.setBackground((!skinName || skinName === name) ? name : skinName, 'character');
                            }, 750);
                        };
                        flashAvatar(player);
                        if (target) flashAvatar(target);
                    }, player, target);
                },
                init(player, skill) {
                    player.addExtraEquip(skill, 'bilibili_laosaozhipao', true, player => player.hasEmptySlot(2) && lib.card['bilibili_laosaozhipao']);
                },
                onremove(player, skill) {
                    player.removeExtraEquip(skill);
                },
                ai: {
                    effect: {
                        target(card, player, target) {
                            if (player == target && get.subtype(card) === 'equip2' && card.name !== 'bilibili_laosaozhipao') {
                                if (get.equipValue(card) <= 15) return 0;
                            }
                        },
                    },
                },
                group: ['bilibili_laosao_bilibili_laosaozhipao', 'bilibili_laosao_init'],
                subSkill: {
                    bilibili_laosaozhipao: {
                        inherit: 'bilibili_laosaozhipao',
                        filter(event, player) {
                            if (!player.hasEmptySlot(2) || player.getEquips('bilibili_laosaozhipao').length > 0) return false;
                            return lib.skill.bilibili_laosaozhipao.filter(event, player);
                        },
                    },
                    init: {
                        trigger: {
                            global: ['phaseBefore', 'washCard'],
                            player: 'enterGame',
                        },
                        filter(event, player) {
                            if (event.name === 'phase' && game.phaseNumber > 0) return false;
                            return !player.getEquips('bilibili_laosaozhipao').length;
                        },
                        forced: true,
                        async content(event, trigger, player) {
                            const card = game.createCard('bilibili_laosaozhipao', Math.random() > 0.5 ? 'spade' : 'heart', 13);
                            if (player.canEquip(card, true)) await player.equip(card);
                        },
                    },
                },
            },
            bilibili_laosaozhipao: {
                equipSkill: true,
                trigger: { global: 'roundStart' },
                filter(event, player) {
                    return game.hasPlayer(target => target !== player);
                },
                async cost(event, trigger, player) {
                    const goon = event.skill === 'bilibili_laosaozhipao';
                    event.result = await player.chooseTarget(`请选择【${get.translation(event.skill)}】的目标`, (() => {
                        return `选择一名其他角色，本轮将你与其外的角色移出游戏，然后你${goon ? '在其上下家分别召唤普净和胡班' : '摸两张牌'}`;
                    })(), lib.filter.notMe, true).set('ai', target => {
                        const player = get.player();
                        return -get.attitude(player, target) / (target.getHp() + 1);
                    }).forResult();
                },
                locked: true,
                async content(event, trigger, player) {
                    for (const target of game.filterPlayer()) {
                        if (event.targets.includes(target) || target === player) continue;
                        target.addTempSkill('bilibili_fazhou_mambaout', 'roundStart');
                    }
                    if (event.name === 'bilibili_laosaozhipao') {
                        const target = event.targets[0], list = ['DJ_pujing', 'DJ_huban'];
                        for (let i = 0; i < list.length; i++) {
                            const fellow = await game.addPlayerOL(target, list[i], null, !!i, { animate: false });
                            if (get.itemtype(fellow) !== 'player') continue;
                            game.addGlobalSkill('autoswap');
                            fellow.addTempSkill('bilibili_laosaozhipao_die', 'roundStart');
                            game.broadcastAll((player, target) => {
                                target.bilibili_lianbingOwner = player;
                                if (get.config('single_control')) target._trueMe = player;
                                target.identity = 'bilibili_shibing';
                                const bgImage = player.node?.avatar?.style?.backgroundImage;
                                if (bgImage) {
                                    const matches = bgImage.matchAll(/url\(["']?([^"')]+)["']?\)/g);
                                    let onload = false;
                                    for (const match of matches) {
                                        const src = match[1];
                                        if (match[1]) {
                                            const testImg = new Image();
                                            testImg.onload = function () {
                                                if (onload) return;
                                                onload = true;
                                                const node = target.node.identity.firstChild;
                                                node.innerHTML = '';
                                                node.style.width = '30px';
                                                node.style.height = '30px';
                                                node.style.backgroundImage = `url(${src})`;
                                                node.style.backgroundSize = '200% auto';
                                                node.style.backgroundPosition = '50% 10%';
                                                node.style.borderRadius = '50%';
                                            };
                                            testImg.src = src;
                                            if (onload) break;
                                        }
                                    }
                                }
                                if (target.ai) {
                                    target.ai.identity_mark = 'finished';
                                    if (typeof player.ai?.shown === 'number') target.ai.shown = player.ai.shown;
                                }
                                target.dieAfter = function () { };
                                if (typeof player.side === 'boolean') target.side = player.side;
                                target.ai.modAttitudeFrom = function (from, to) {
                                    if (to === from.bilibili_lianbingOwner) return 114514;
                                    return get.attitude(from.bilibili_lianbingOwner || from, to.bilibili_lianbingOwner || to);
                                };
                                target.ai.modAttitudeTo = function (from, to, att) {
                                    if (from === to.bilibili_lianbingOwner) return 114514;
                                    return get.attitude(from.bilibili_lianbingOwner || from, to.bilibili_lianbingOwner || to);
                                };
                                if (_status._bilibili_lianbingOwner) return;
                                _status.bilibili_lianbingOwner = true;
                                //检测游戏胜负
                                if (typeof game.checkResult === 'function') {
                                    const origin_checkResult = game.checkResult;
                                    game.checkResult = function () {
                                        const player = game.me._trueMe || game.me;
                                        if (game.players.filter(i => i !== player).every(i => i.bilibili_lianbingOwner === (player.bilibili_lianbingOwner || player))) game.over(true);
                                        return origin_checkResult.apply(this, arguments);
                                    };
                                }
                                if (typeof game.checkOnlineResult === 'function') {
                                    const origin_checkOnlineResult = game.checkOnlineResult;
                                    game.checkOnlineResult = function (player) {
                                        if (game.players.filter(i => i !== player).every(i => i.bilibili_lianbingOwner === (player.bilibili_lianbingOwner || player))) return true;
                                        return origin_checkOnlineResult.apply(this, arguments);
                                    };
                                }
                                //敌友判定
                                //实际上只是友方，敌方不用写
                                if (typeof lib.element.player.getFriends === 'function') {
                                    const origin_getFriends = lib.element.player.getFriends;
                                    const getFriends = function (func, includeDie) {
                                        const player = this;
                                        return [
                                            ...origin_getFriends.apply(this, arguments),
                                            ...game[includeDie ? 'filterPlayer2' : 'filterPlayer'](target => {
                                                return (target.bilibili_lianbingOwner || target) === (player.bilibili_lianbingOwner || player);
                                            }),
                                        ].filter(i => i !== player || func === true).unique().sortBySeat(player);
                                    };
                                    lib.element.player.getFriends = getFriends;
                                    [...game.players, ...game.dead].forEach(i => (i.getFriends = getFriends));
                                }
                                if (typeof lib.element.player.isFriendOf === 'function') {
                                    const origin_isFriendOf = lib.element.player.isFriendOf;
                                    const isFriendOf = function (player) {
                                        if ((this.bilibili_lianbingOwner || this) === (player.bilibili_lianbingOwner || player)) return true;
                                        return origin_isFriendOf.apply(this, arguments);
                                    };
                                    lib.element.player.isFriendOf = isFriendOf;
                                    [...game.players, ...game.dead].forEach(i => (i.isFriendOf = isFriendOf));
                                }
                                if (typeof lib.element.player.getEnemies === 'function') {
                                    const origin_getEnemies = lib.element.player.getEnemies;
                                    const getEnemies = function (func, includeDie) {
                                        if (this.bilibili_lianbingOwner) return this.bilibili_lianbingOwner.getEnemies(func, includeDie);
                                        else {
                                            const player = this;
                                            return [
                                                ...origin_getEnemies.apply(this, arguments),
                                                ...game[includeDie ? 'filterPlayer2' : 'filterPlayer'](target => {
                                                    return origin_getEnemies.apply(this, arguments).includes(target.bilibili_lianbingOwner || target);
                                                }),
                                            ].filter(i => player != (i.bilibili_lianbingOwner || i)).unique().sortBySeat(player);
                                        }
                                    };
                                    lib.element.player.getEnemies = getEnemies;
                                    [...game.players, ...game.dead].forEach(i => (i.getEnemies = getEnemies));
                                }
                            }, player, fellow);
                            fellow.$draw(2 - i);
                            fellow.directgain(get.cards(2 - i));
                        }
                    }
                    else await player.draw(2);
                },
                subSkill: {
                    die: {
                        charlotte: true,
                        trigger: { global: 'dieAfter' },
                        filter(event, player) {
                            return event.player === player.bilibili_master;
                        },
                        silent: true,
                        firstDo: true,
                        async content(event, trigger, player) {
                            await player.die();
                        },
                        onremove(player) {
                            const cards = player.getCards('hejsx');
                            while (cards.length) ui.discardPile.appendChild(cards.shift());
                            game.removePlayerOL(player, { animate: false });
                        },
                    }
                },
            },
            bilibili_zhangcai: {
                trigger: { player: 'gainAfter', global: 'loseAsyncAfter' },
                filter(event, player) {
                    return event.getg?.(player)?.some(card => {
                        if (!(get.owner(card) === player && get.position(card) === 'h')) return false;
                        return _status.connectMode || player.hasUseTarget(card, false);
                    });
                },
                direct: true,
                clearTime: true,
                async content(event, trigger, player) {
                    const cards = trigger.getg(player);
                    const result = await player.chooseToUse(function (card) {
                        const evt = _status.event;
                        if (!lib.filter.cardEnabled(card, evt.player, evt)) return false;
                        let cards = [card];
                        if (Array.isArray(card.cards)) cards.addArray(card.cards);
                        return cards.containsSome(...(evt.cards ?? []));
                    }, get.prompt2(event.name)).set('addCount', false).set('cards', cards).set('logSkill', event.name).forResult();
                    if (result.bool) {
                        let suits = player.getAllHistory('useCard', evt => {
                            return evt.getParent(2).name == event.name;
                        }).reduce((list, evt) => list.add(get.suit(evt.card)), []);
                        if (suits.length) {
                            suits.sort((a, b) => lib.suit.indexOf(b) - lib.suit.indexOf(a));
                            player.addTip(event.name, [event.name, ...suits].map(i => get.translation(i)).join(''));
                            await player.addAdditionalSkills(event.name, lib.skill[event.name].derivation.slice(0, Math.min(4, suits.length)));
                        }
                    }
                },
                init(player, skill) {
                    let suits = player.getAllHistory('useCard', evt => {
                        return evt.getParent(2).name == skill;
                    }).reduce((list, evt) => list.add(get.suit(evt.card)), []);
                    if (suits.length) {
                        suits.sort((a, b) => lib.suit.indexOf(b) - lib.suit.indexOf(a));
                        player.addTip(skill, [skill, ...suits].map(i => get.translation(i)).join(''));
                        player.addAdditionalSkills(skill, lib.skill[skill].derivation.slice(0, Math.min(4, suits.length)));
                    }
                },
                onremove(player, skill) {
                    player.removeTip(skill);
                },
                derivation: ['jueman', 'oljianman', 'miniaocai', 'junkshicai'],
            },
            //乐大小乔
            bilibili_qiqin: {
                audio: Array.from({ length: 2 }).map((_, i) => ['', '_yue_daqiao'].map(j => j + (i + 1))).flat().map(i => `dcqiqin${i}.mp3`),
                trigger: { global: ['gameDrawBegin', 'replaceHandcardsBegin'] },
                forced: true,
                popup: false,
                async content(event, trigger, player) {
                    const me = player;
                    if (trigger.name === 'gameDraw') {
                        player.logSkill(event.name);
                        const numx = trigger.num;
                        trigger.num = function (player) {
                            return (typeof numx === 'function' ? numx(player) : numx) * (player === me ? 2 : 1);
                        };
                    }
                    trigger.gaintag ??= {};
                    trigger.gaintag[me.playerid] = function (num, cards) {
                        return [[cards, 'eternal_dcqiqin_tag']];
                    };
                },
                group: 'bilibili_qiqin_restore',
                subSkill: {
                    restore: {
                        audio: Array.from({ length: 2 }).map((_, i) => ['', '_yue_daqiao'].map(j => j + (i + 1))).flat().map(i => `dcqiqin${i}.mp3`),
                        trigger: { player: 'phaseZhunbeiBegin' },
                        filter(event, player) {
                            return Array.from(ui.discardPile.childNodes).some(card => card.hasGaintag('eternal_dcqiqin_tag'));
                        },
                        forced: true,
                        content() {
                            const cards = Array.from(ui.discardPile.childNodes).filter(card => card.hasGaintag('eternal_dcqiqin_tag'));
                            player.gain(cards, 'gain2');
                        },
                    },
                },
                mod: {
                    ignoredHandcard(card, player) {
                        if (card.hasGaintag('eternal_dcqiqin_tag')) return true;
                    },
                    cardDiscardable(card, player, name) {
                        if (name === 'phaseDiscard' && card.hasGaintag('eternal_dcqiqin_tag')) return false;
                    },
                },
            },
            //眼睛哥
            bilibili_mingcha: {
                enable: 'phaseUse',
                usable: 1,
                filter(event, player) {
                    return game.hasPlayer(current => get.info('bilibili_mingcha').filterTarget(null, player, current));
                },
                filterTarget(card, player, target) {
                    return target.countCards('h') && target != player;
                },
                async content(event, trigger, player) {
                    const { target } = event;
                    const { cards } = await player.choosePlayerCard(target, true, 'h').forResult();
                    if (!cards?.length) return;
                    await player.showCards(cards, get.translation(player) + '对' + get.translation(target) + '发动了【明察】');
                    const goon1 = player.countCards('he'), goon2 = target.countCards('he');
                    if (goon1 || goon2) {
                        let result;
                        if (goon1 && goon2) result = await player.chooseControl().set('choiceList', [`令${get.translation(target)}交给你一张牌`, `交给${get.translation(target)}一张牌`]).set('ai', () => {
                            const player = get.player(), target = get.event().getParent().target;
                            const card = get.event().cards[0];
                            return get.attitude(player, target) > 4 ? 1 : 0;
                        }).set('cards', cards).forResult();
                        else result = { index: goon2 ? 0 : 1 };
                        if (result.index == 0) await target.chooseToGive(player, 'he', true);
                        else {
                            const { cards: give } = await player.chooseToGive(target, 'he', true).set('ai', card => {
                                const { player, target } = get.event();
                                const cardx = get.event().cards[0];
                                if (get.attitude(player, target) > 0 && get.type2(card) != get.type2(cardx)) return 10;
                                return 6 - get.value(card);
                            }).set('cards', cards).forResult();
                            if (give?.length && get.type2(give[0]) != get.type2(cards[0])) await player.draw();
                        };
                    }
                },
                ai: {
                    order: 8,
                    result: { player: 1 },
                },
            },
            bilibili_huiyan: {
                trigger: { player: 'phaseZhunbeiBegin' },
                filter(event, player) {
                    return game.hasPlayer(current => player != current);
                },
                locked: true,
                async cost(event, trigger, player) {
                    event.result = await player.chooseTarget(get.prompt(event.skill), '令一名其他角色选择一项：1.令你回复1点体力；2.令你摸一张牌', lib.filter.notMe, true).set('ai', target => {
                        const player = get.player();
                        return get.attitude(player, target);
                    }).forResult();
                },
                async content(event, trigger, player) {
                    const { targets: [target] } = event;
                    let result;
                    if (player.isDamaged()) {
                        result = await target.chooseControl().set('choiceList', [
                            `令${get.translation(player)}回复1点体力`,
                            `令${get.translation(player)}摸一张牌`,
                        ]).set('ai', () => {
                            const player = get.player(), target = get.event().getParent().player;
                            const eff1 = get.recoverEffect(target, player, player), eff2 = get.effect(target, { name: 'draw' }, player, player);
                            return eff2 > eff1 ? 1 : 0;
                        }).forResult();
                    }
                    else result = { index: 1 };
                    await player[result.index === 0 ? 'recover' : 'draw']();
                },
                ai: {
                    viewHandcard: true,
                    skillTagFilter(player, tag, arg) {
                        if (player === arg) return false;
                    },
                },
            },
            bilibili_shenren: {
                trigger: {
                    source: 'damageBegin1',
                    player: 'damageBegin2',
                },
                filter(event, player, name) {
                    if (!event.source?.isIn()) return false;
                    return get.nameList(event[['player', 'source'][parseInt(name.slice(-1)) - 1]]).some(name => {
                        return get.rawName(name).length === 4 || get.rawName(name, true).length === 4;
                    });
                },
                forced: true,
                logTarget(event, player, name) {
                    return event[['player', 'source'][parseInt(name.slice(-1)) - 1]];
                },
                async content(event, trigger, player) {
                    trigger.num++;
                },
            },
            //情人姐
            bilibili_roulin: {
                audio: 'ext:活动武将/audio/skill:1',
                inherit: 'roulin',
                filter(event, player) {
                    if (event.card.name !== 'sha') return false;
                    return player.differentSexFrom(event[player === event.player ? 'target' : 'player']);
                },
                ai: {
                    halfneg: true,
                    directHit_ai: true,
                    skillTagFilter(player, tag, arg) {
                        if (tag !== 'directHit_ai') return true;
                        if (!arg?.card || !arg.target || arg.card.name !== 'sha' || !player.differentSexFrom(arg.target) || arg.target.countCards('hs', 'shan') > 1) return false;
                    },
                },
                global: 'bilibili_roulin_global',
                subSkill: {
                    global: {
                        ai: {
                            halfneg: true,
                            directHit_ai: true,
                            skillTagFilter(player, tag, arg) {
                                if (!arg?.card || !arg.target?.hasSkill('bilibili_roulin') || arg.card.name !== 'sha' || !player.differentSexFrom(arg.target) || arg.target.countCards('hs', 'shan') > 1) return false;
                            },
                        },
                    },
                },
            },
            //胖哥
            bilibili_benghuai: {
                audio: 'ext:活动武将/audio/skill:1',
                inherit: 'benghuai',
                filter: () => true,
                async content(event, trigger, player) {
                    const result = await player.chooseControl('体力', '体力上限').set('ai', function () {
                        const player = get.player();
                        return player.isDamaged() || player.maxHp <= 1 ? 0 : 1;
                    }).set('prompt', '崩坏：失去1点体力或减1点体力上限').forResult();
                    if (typeof result?.index === 'number') {
                        await player[['loseHp', 'loseMaxHp'][result.index]](1);
                        await player.draw(1 + result.index);
                    }
                },
            },
            //公鸭
            bilibili_yaowu: {
                audio: 'ext:活动武将/audio/skill:1',
                inherit: 'reyaowu',
                filter: () => true,
                async content(event, trigger, player) {
                    await ((trigger.source?.isIn() && trigger.source.hasSex('female')) ? trigger.source : player).draw();
                },
                ai: {
                    effect: {
                        target(card, player, target) {
                            if (typeof card !== 'object' || !get.tag(card, 'damage') || player.hasSkillTag('jueqing', false, target)) return;
                            if (player.hasSex('female')) return [1, 0, 1, 0.6];
                            return [1, 0.6];
                        },
                    },
                },
            },
            //加强版眼睛
            bilibili_kamiman: {
                unique: true,
                audio: 'ext:活动武将/audio/skill:1',
                trigger: { player: 'phaseBegin' },
                filter(event, player) {
                    if (!get.nameList(player).includes('bilibili_yanjing')) return false;
                    return !event._bilibili_shenren_phase;
                },
                forced: true,
                async content(event, trigger, player) {
                    trigger._bilibili_shenren_phase = true;
                    const storage = player.storage['bilibili_kamiman'];
                    const result = await player.chooseToMove(`${get.translation(event.name)}：请选择神人们的回合顺序`).set('list', [
                        ['神人们', [
                            Object.keys(storage),
                            (item, type, position, noclick, node) => {
                                let itemcharacter = { ...lib.character[item] };
                                let { hp, maxHp, hujia, ...otheritem } = itemcharacter;
                                lib.character[item] = {
                                    ...otheritem,
                                    hp: storage[item].hp,
                                    maxHp: storage[item].maxHp,
                                    hujia: storage[item].hujia,
                                };
                                node = ui.create.buttonPresets.character(item, 'character', position, noclick);
                                node.node.group?.hide();
                                lib.character[item] = itemcharacter;
                                if (item === 'bilibili_yanjing') game.createButtonCardsetion(`本体`, node);
                                return node;
                            },
                        ]],
                    ]).set('processAI', list => {
                        return [[...list[0][1][0]].randomSort()];
                    }).forResult();
                    if (result?.bool && result.moved?.[0]) {
                        const [item2, ...sort] = result.moved[0];
                        if (item2 !== 'bilibili_yanjing') {
                            player.reinit('bilibili_yanjing', item2, [storage[item2].hp, storage[item2].maxHp, storage[item2].hujia]);
                            player.markSkill('bilibili_kamiman');
                        }
                        player.addSkill('bilibili_kamiman_phase');
                        player.storage['bilibili_kamiman_phase'] = {
                            characters: sort,
                            current: item2,
                        };
                    }
                },
                onRound(event) {
                    return !event._bilibili_shenren_phase;
                },
                init(player, skill) {
                    player.addSkill(`${skill}_effect`);
                    lib.onround.add(lib.skill[skill].onRound);
                    lib.hooks?.checkUpdate?.add(function _bilibili_shenren_update(player) {
                        const storage = player.storage?.['bilibili_kamiman'];
                        const names = get.nameList(player).filter(name => storage?.[name]);
                        if (names.length > 0) {
                            for (const item of names) {
                                const { hp, maxHp, hujia } = player;
                                player.storage['bilibili_kamiman'][item] = { hp, maxHp, hujia };
                            }
                        }
                    });
                },
                group: ['bilibili_kamiman_shenren', 'bilibili_kamiman_init', 'bilibili_kamiman_defend'],
                intro: {
                    markcount(storage = {}) {
                        return Object.keys(storage).length - 1;
                    },
                    mark(dialog, storage = {}) {
                        dialog.add([
                            Object.keys(storage),
                            (item, type, position, noclick, node) => {
                                let itemcharacter = { ...lib.character[item] };
                                let { hp, maxHp, hujia, ...otheritem } = itemcharacter;
                                lib.character[item] = {
                                    ...otheritem,
                                    hp: storage[item].hp,
                                    maxHp: storage[item].maxHp,
                                    hujia: storage[item].hujia,
                                };
                                node = ui.create.buttonPresets.character(item, 'character', position, noclick);
                                node.node.group?.hide();
                                lib.character[item] = itemcharacter;
                                if (item === 'bilibili_yanjing') game.createButtonCardsetion(`本体`, node);
                                return node;
                            },
                        ]);
                    },
                },
                subSkill: {
                    shenren: {
                        inherit: 'bilibili_shenren',
                    },
                    init: {
                        audio: 'ext:活动武将/audio/skill:1',
                        trigger: {
                            global: 'phaseBefore',
                            player: 'enterGame',
                        },
                        filter(event, player) {
                            if (!get.nameList(player).includes('bilibili_yanjing')) return false;
                            return event.name !== 'phase' || game.phaseNumber === 0;
                        },
                        forced: true,
                        async content(event, trigger, player) {
                            const list = Array.from({ length: 3 }).map((_, index) => `bilibili_yanjing_friend${index + 1}`);
                            player.storage['bilibili_kamiman'] = (() => {
                                const { hp, maxHp, hujia } = player;
                                const map = {
                                    'bilibili_yanjing': { hp, maxHp, hujia },
                                };
                                for (const name of list) {
                                    const { hp, maxHp, hujia } = lib.character[name];
                                    map[name] = { hp, maxHp, hujia };
                                }
                                return map;
                            })();
                            game.broadcastAll((player, list) => {
                                player.$draw(list.map(name => {
                                    const cardname = `huashen_card_${name}`;
                                    lib.card[cardname] = {
                                        fullimage: true,
                                        image: `character:${name}`,
                                    };
                                    lib.translate[cardname] = get.rawName2(name);
                                    return game.createCard(cardname, '', '');
                                }), 'nobroadcast');
                            }, player, list);
                            player.markSkill('bilibili_kamiman');
                        },
                    },
                    defend: {
                        audio: 'ext:活动武将/audio/skill:1',
                        trigger: { player: 'phaseAfter' },
                        filter(event, player) {
                            if (!get.nameList(player).includes('bilibili_yanjing')) return false;
                            return (!event._bilibili_shenren_phase || event._bilibili_shenren) && Object.keys(player.storage['bilibili_kamiman']).length > 1;
                        },
                        async cost(event, trigger, player) {
                            const storage = player.storage['bilibili_kamiman'];
                            const result = event.result = await player.chooseButton([
                                `${get.translation(event.skill)}：选择一个神人朋友代替你在回合外站场`,
                                [
                                    Object.keys(storage),
                                    (item, type, position, noclick, node) => {
                                        let itemcharacter = { ...lib.character[item] };
                                        let { hp, maxHp, hujia, ...otheritem } = itemcharacter;
                                        lib.character[item] = {
                                            ...otheritem,
                                            hp: storage[item].hp,
                                            maxHp: storage[item].maxHp,
                                            hujia: storage[item].hujia,
                                        };
                                        node = ui.create.buttonPresets.character(item, 'character', position, noclick);
                                        node.node.group?.hide();
                                        lib.character[item] = itemcharacter;
                                        if (item === 'bilibili_yanjing') game.createButtonCardsetion(`本体`, node);
                                        return node;
                                    },
                                ],
                            ], true).set('filterButton', button => {
                                return button.link !== 'bilibili_yanjing';
                            }).set('ai', button => {
                                const player = get.player(), item = button.link;
                                return player.storage['bilibili_kamiman'][item].hp + player.storage['bilibili_kamiman'][item].hujia;
                            }).forResult();
                            if (result?.bool && result.links?.length) event.result.cost_data = result.links[0];
                        },
                        async content(event, trigger, player) {
                            const item = event.cost_data, storage = player.storage['bilibili_kamiman'];
                            player.reinit('bilibili_yanjing', item, [storage[item].hp, storage[item].maxHp, storage[item].hujia]);
                            player.markSkill('bilibili_kamiman');
                            player.when('phaseBeginStart').filter(() => {
                                return get.nameList(player).includes(item);
                            }).then(() => {
                                const storage = player.storage['bilibili_kamiman'];
                                player.reinit(item, 'bilibili_yanjing', [storage['bilibili_yanjing'].hp, storage['bilibili_yanjing'].maxHp, storage['bilibili_yanjing'].hujia]);
                                player.markSkill('bilibili_kamiman');
                            }).vars({ item: item });
                        },
                    },
                    phase: {
                        charlotte: true,
                        onremove: true,
                        trigger: { player: 'phaseAfter' },
                        silent: true,
                        firstDo: true,
                        async content(event, trigger, player) {
                            const storage = player.storage[event.name];
                            if (!storage) {
                                player.removeSkill(event.name);
                                return;
                            }
                            const item = storage.characters[0], change = storage.current, storage2 = player.storage['bilibili_kamiman'];
                            if (!item) {
                                player.removeSkill(event.name);
                                if (item !== 'bilibili_yanjing') {
                                    player.reinit(change, 'bilibili_yanjing', [storage2['bilibili_yanjing'].hp, storage2['bilibili_yanjing'].maxHp, storage2['bilibili_yanjing'].hujia]);
                                    player.markSkill('bilibili_kamiman');
                                }
                                return;
                            }
                            player.reinit(change, item, [storage2[item].hp, storage2[item].maxHp, storage2[item].hujia]);
                            player.markSkill('bilibili_kamiman');
                            player.storage[event.name].characters.remove(item);
                            player.storage[event.name].current = item;
                            const next = player.insertPhase();
                            next._bilibili_shenren_phase = true;
                            if (!player.storage[event.name].characters.length) next._bilibili_shenren = true;
                        },
                    },
                    effect: {
                        charlotte: true,
                        trigger: { player: 'dieBefore' },
                        filter(event, player) {
                            const storage = player.storage['bilibili_kamiman'];
                            return get.nameList(player).some(name => name !== 'bilibili_yanjing' && storage[name]);
                        },
                        silent: true,
                        firstDo: true,
                        forceDie: true,
                        async content(event, trigger, player) {
                            const storage = player.storage['bilibili_kamiman'];
                            const names = get.nameList(player).filter(name => name !== 'bilibili_yanjing' && storage[name]);
                            trigger.cancel();
                            for (const item of names) {
                                delete player.storage['bilibili_kamiman'][item];
                                player.reinit(item, 'bilibili_yanjing', [storage['bilibili_yanjing'].hp, storage['bilibili_yanjing'].maxHp, storage['bilibili_yanjing'].hujia]);
                            }
                            if (player.storage['bilibili_kamiman_phase']?.current) player.storage['bilibili_kamiman_phase'].current = 'bilibili_yanjing';
                            player[Object.keys(player.storage['bilibili_kamiman']).length > 1 ? 'markSkill' : 'unmarkSkill']('bilibili_kamiman');
                        },
                    },
                },
            },
            //暗黑傀儡师蔡夫人
            bilibili_kuilei: {
                trigger: {
                    global: 'phaseBefore',
                    player: ['enterGame', 'dieBefore', 'showCharacterAfter'],
                },
                filter(event, player) {
                    if (['', '1', '2'].every(num => player['name' + num] !== 'bilibili_caifuren')) return false;
                    if (event.name === 'die') return player.maxHp > 0;
                    if (event.name === 'showCharacter') return event.toShow?.includes('bilibili_caifuren');
                    return event.name !== 'phase' || game.phaseNumber === 0;
                },
                forced: true,
                async content(event, trigger, player) {
                    get.info(event.name).onremove(player, event.name);
                    if (trigger.name === 'die') {
                        player.chat(['呃...', '可恶！', '猜猜看吧，我是否还会有下一招？'].randomGet());
                        trigger.cancel();
                        await player.loseMaxHp();
                        await player.recoverTo(player.maxHp);
                        if (player.isIn()) await game.delay(3);
                    }
                    if (!_status.characterlist) get.info('pingjian').initList();
                    const list = ['蔡', '夫人'].map(str => {
                        return _status.characterlist.filter(name => {
                            const nameStr = lib.translate[name + '_ab'] || lib.translate[name];
                            return nameStr && !nameStr.includes('蔡夫人') && nameStr.includes(str);
                        }).randomGet();
                    });
                    if (list.every(i => Boolean(i))) {
                        game.broadcastAll((player, first, chosen) => {
                            player.name1 = first;
                            player.sex = get.character(first).sex;
                            player.group = get.character(first).group;
                            player.node.avatar.setBackground(first, 'character');
                            player.node.name.innerHTML = get.slimName(first);
                            player.name2 = chosen;
                            player.classList.add('fullskin2');
                            player.node.avatar2.classList.remove('hidden');
                            player.node.avatar2.setBackground(chosen, 'character');
                            player.node.name2.innerHTML = get.slimName(chosen);
                            if (player == game.me && ui.fakeme) ui.fakeme.style.backgroundImage = player.node.avatar.style.backgroundImage;
                            if (_status.characterlist) _status.characterlist.removeArray(['', '1', '2'].map(num => player['name' + num]).filter(i => Boolean(i)));
                        }, player, ...list);
                        player.addAdditionalSkill(event.name, list.map(name => get.character(name)?.skills || []).flat());
                        game.log(player, '将', '#g主将', '替换为', '#g' + get.translation(list[0]));
                        game.log(player, '将', '#y副将', '替换为', '#y' + get.translation(list[1]));
                    }
                    else {
                        player.chat('杯具');
                        game.log('但', player, '无法凑到两个傀儡！');
                    }
                },
                onremove(player, skill) {
                    player.removeAdditionalSkill(skill);
                    if (player.name2) {
                        if (get.mode() === 'guozhan') player.showCharacter(2);
                        game.broadcastAll(player => {
                            if (_status.characterlist) _status.characterlist.addArray(['', '1', '2'].map(num => player['name' + num]).filter(i => Boolean(i)));
                            player.name1 = player.name = 'bilibili_caifuren';
                            player.sex = get.character(player.name).sex;
                            player.group = get.character(player.name).group;
                            player.node.name.dataset.nature = get.groupnature(player.group);
                            player.smoothAvatar(false);
                            player.node.avatar.setBackground(player.name, 'character');
                            player.node.name.innerHTML = get.slimName(player.name);
                            delete player.name2;
                            player.classList.remove('fullskin2');
                            player.node.avatar2.classList.add('hidden');
                            player.node.name2.innerHTML = '';
                            if (player == game.me && ui.fakeme) ui.fakeme.style.backgroundImage = player.node.avatar.style.backgroundImage;
                            if (_status.characterlist) _status.characterlist.remove(player.name);
                        }, player);
                    }
                },
            },
            //OL袁姬
            old_jieyan: {
                audio: 'oljieyan',
                trigger: { player: 'phaseZhunbeiBegin' },
                async cost(event, trigger, player) {
                    event.result = await player.chooseTarget(get.prompt2(event.name.slice(0, -5))).set('ai', target => {
                        const player = get.player(), att = get.attitude(player, target), goon = player.hasSkill('old_shuiyue', null, null, false);
                        let eff = get.damageEffect(target, player, player);
                        if (goon) {
                            if (player.storage.old_shuiyue) eff += get.effect(target, { name: 'guohe_copy2' }, player, player) * Math.min(2, target.countCards('he'));
                            else eff += get.effect(target, { name: 'draw' }, player, player);
                        }
                        if (goon && target.getHp() > 2 && att > 0 && target !== player && !player.storage.old_shuiyue) {
                            return 0.1 + (target.countCards('h') - target.getHp());
                        }
                        return eff;
                    }).forResult();
                },
                async content(event, trigger, player) {
                    const target = event.targets[0];
                    await target.damage();
                    const result = await target.chooseControl().set('choiceList', [
                        '跳过下个弃牌阶段',
                        '回复1点体力，下个弃牌阶段手牌上限-2',
                    ]).set('ai', () => {
                        const player = get.player(), target = get.event().getTrigger().player;
                        if ((get.recoverEffect(player, target, target) > 0 || get.attitude(player, target) > 0) && game.hasPlayer(current => current != player && get.attitude(player, current) > 0)) return 1;
                        return 0;
                    }).forResult();
                    if (result?.index == 0) {
                        target.skip('phaseDiscard');
                        game.log(target, '跳过下个弃牌阶段');
                    }
                    else {
                        await target.recover();
                        target.addTempSkill('old_jieyan_effect', { player: 'phaseDiscardAfter' });
                        target.addMark('old_jieyan_effect', 2, false);
                        target.when('phaseDiscardBefore').then(() => {
                            player.addTempSkill('old_jieyan_hand', { player: 'phaseDiscardAfter' });
                        });
                        player.addSkill('old_jieyan_gain');
                        player.markAuto('old_jieyan_gain', [target]);
                    }
                },
                subSkill: {
                    effect: {
                        charlotte: true,
                        onremove: true,
                        mark: true,
                        marktext: '弃',
                        intro: { content: '下个弃牌阶段手牌上限-#' },
                        mod: {
                            maxHandcard(player, num) {
                                if (player.hasSkill('old_jieyan_hand')) return num - player.countMark('old_jieyan_effect');
                            },
                        },
                    },
                    hand: { charlotte: true },
                    gain: {
                        charlotte: true,
                        onremove: true,
                        intro: { content: '节言角色：$' },
                        trigger: { global: 'phaseDiscardAfter' },
                        filter(event, player) {
                            return player.getStorage('old_jieyan_gain').includes(event.player);
                        },
                        forced: true,
                        popup: false,
                        async content(event, trigger, player) {
                            const target = trigger.player, cards = [];
                            target.getHistory('lose', evt => {
                                if (evt.type == 'discard' && evt.getParent('phaseDiscard') === trigger) cards.addArray(evt.cards2.filterInD('d'));
                            });
                            player.unmarkAuto('old_jieyan_gain', [target]);
                            if (cards.length && game.hasPlayer(current => current !== target)) {
                                const { targets } = await player.chooseTarget(get.prompt(event.name), `令一名不为${get.translation(target)}的角色获得${get.translation(cards)}`, (card, player, target) => {
                                    return target !== get.event().getTrigger().player;
                                }).set('ai', target => {
                                    const player = get.player();
                                    let att = get.attitude(player, target);
                                    if (att < 3) return 0;
                                    if (target.hasSkillTag('nogain')) att /= 10;
                                    return att;
                                }).forResult();
                                if (targets?.length) {
                                    const next = targets[0].gain(cards, 'gain2');
                                    next.giver = player;
                                    await next;
                                }
                            }
                            if (!player.getStorage('old_jieyan_gain').length) player.removeSkill('old_jieyan_gain');
                        },
                    },
                },
            },
            old_jinghua: {
                audio: 'oljinghua',
                trigger: {
                    global: 'gainAfter',
                    player: 'loseAsyncAfter',
                },
                filter(event, player, triggername, target) {
                    if (event.name === 'loseAsync' && event.type !== 'gain') return false;
                    return target?.isIn();
                },
                getIndex(event, player) {
                    return game.filterPlayer(target => {
                        if (target === player) return false;
                        if (!player.storage.old_jinghua && target.isHealthy()) return false;
                        const cards = event.getg?.(target);
                        if (!cards?.length || event.giver === player) return true;
                        return event.getl?.(player)?.cards2?.some(card => cards?.includes(card));
                    }).sortBySeat();
                },
                logTarget: (event, player, triggername, target) => target,
                check(event, player, triggername, target) {
                    return player.storage.old_jinghua ? get.effect(target, { name: 'losehp' }, player, player) > 0 : get.recoverEffect(target, player, player) > 0;
                },
                locked: false,
                forced: true,
                async content(event, trigger, player) {
                    event.targets[0][player.storage.old_jinghua ? 'loseHp' : 'recover']();
                },
                group: 'old_jinghua_change',
                subSkill: {
                    change: {
                        audio: 'oljinghua',
                        trigger: {
                            player: 'loseAfter',
                            global: ['equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter', 'addToExpansionAfter'],
                        },
                        filter(event, player) {
                            if (player.countCards('h') || player.storage.old_jinghua) return false;
                            return event.getl?.(player)?.hs?.length > 0;
                        },
                        skillAnimation: true,
                        animationColor: 'wood',
                        prompt2: '修改【镜花】为：当其他角色获得你的牌后，其失去1点体力。',
                        content() {
                            player.storage.old_jinghua = true;
                            player.popup('镜花');
                            game.log(player, '修改了技能', '#g【镜花】');
                        },
                    },
                },
            },
            old_shuiyue: {
                audio: 'olshuiyue',
                trigger: { global: 'damageEnd' },
                filter(event, player) {
                    const target = event.player, source = event.source;
                    if (!target.isIn() || target === player || source !== player) return false;
                    return !player.storage.old_shuiyue || target.countCards('he');
                },
                forced: true,
                locked: false,
                logTarget: 'player',
                async content(event, trigger, player) {
                    const target = trigger.player;
                    if (player.storage.old_shuiyue) await target.chooseToDiscard('he', true);
                    else await target.draw();
                },
                group: 'old_shuiyue_change',
                subSkill: {
                    change: {
                        audio: 'olshuiyue',
                        trigger: { source: 'dying' },
                        filter(event, player) {
                            return !player.storage.old_shuiyue && event.player !== player;
                        },
                        skillAnimation: true,
                        animationColor: 'water',
                        prompt2: '修改【水月】为：当其他角色受到你造成的伤害后，其弃置一张牌。',
                        content() {
                            player.storage.old_shuiyue = true;
                            player.popup('水月');
                            game.log(player, '修改了技能', '#g【水月】');
                        },
                    },
                },
            },
            //逍遥如云
            bilibili_chuandu: {
                trigger: { player: ['phaseZhunbeiBegin', 'phaseJieshuBegin'] },
                forced: true,
                async content(event, trigger, player) {
                    const targets = game.filterPlayer(target => {
                        if (target === player || target.hasMark('bilibili_chuandu')) return false;
                        return game.hasPlayer(current => {
                            if (current !== player && !current.hasMark('bilibili_chuandu')) return false;
                            return [current.getNext(), current.getPrevious()].includes(target);
                        });
                    });
                    if (targets.length) {
                        player.line(targets);
                        for (const i of targets) i.addMark('bilibili_chuandu', 1);
                        await game.delayx();
                    }
                    if (trigger.name === 'phaseZhunbei') await player.draw();
                    else {
                        const targetss = game.filterPlayer(target => target.hasMark('bilibili_chuandu'));
                        if (targetss.length) {
                            player.line(targetss);
                            for (const i of targetss) await i.loseHp();
                        }
                    }
                },
                marktext: '毒',
                intro: {
                    name2: '毒',
                    content: 'mark',
                },
            },
            bilibili_shuaiwei: {
                trigger: {
                    player: 'useCardToPlayered',
                    target: 'useCardToTargeted',
                },
                filter(event, player) {
                    return lib.skill.bilibili_shuaiwei.logTarget(event, player).hasMark('bilibili_chuandu');
                },
                logTarget(event, player) {
                    return event[event.name === 'useCardToPlayered' ? 'target' : 'player'];
                },
                check(event, player) {
                    return get.effect(event.target, event.card, player, player) * ((event.name === 'useCardToPlayered' && !get.tag(event.card, 'norepeat')) ? 1 : -1) > 0;
                },
                prompt2(event, player) {
                    if (event.name === 'useCardToPlayered') return `令${get.translation(event.card)}对${get.translation(event.target)}额外结算一次`;
                    return `令${get.translation(event.card)}对你无效`;
                },
                async content(event, trigger, player) {
                    event.targets[0].clearMark('bilibili_chuandu');
                    if (trigger.name === 'useCardToPlayered') {
                        player.addTempSkill('bilibili_shuaiwei_effect');
                        const list = (player.storage['bilibili_shuaiwei_effect'].get(trigger.getParent()) || []).slice();
                        player.storage['bilibili_shuaiwei_effect'].set(trigger.getParent(), [...list, event.targets[0]].sortBySeat());
                        game.log(trigger.card, '对', event.targets[0], '额外结算一次');
                    }
                    else {
                        trigger.getParent().excluded.add(player);
                        game.log(trigger.card, '对', player, '无效');
                    }
                },
                subSkill: {
                    effect: {
                        charlotte: true,
                        init(player, skill) {
                            player.storage[skill] ??= new Map([]);
                        },
                        onremove: true,
                        trigger: { global: 'useCardAfter' },
                        filter(event, player) {
                            return player.storage['bilibili_shuaiwei_effect'].has(event);
                        },
                        forced: true,
                        popup: false,
                        async content(event, trigger, player) {
                            while (player.storage[event.name].get(trigger).length > 0) {
                                let list = player.storage[event.name].get(trigger).slice(), targets = [...list].unique();
                                player.storage[event.name].set(trigger, list.slice().removeArray(targets));
                                targets = targets.filter(target => player.canUse(trigger.card, target, false)).sortBySeat();
                                if (targets.length > 0) await player.useCard(trigger.card, targets, false);
                                else break;
                            }
                        },
                    },
                },
                ai: { combo: 'bilibili_chuandu' },
            },
            bilibili_huaikui: {
                enable: 'phaseUse',
                usable: 1,
                async content(event, trigger, player) {
                    const result = await player.judge(card => ['red', 'black'].includes(get.color(card)) ? 1 : -1).forResult();
                    if (['red', 'black'].includes(result.color)) {
                        const targets = game.filterPlayer(target => target.hasMark('bilibili_chuandu'));
                        if (targets.length) {
                            player.line(targets);
                            for (const target of targets) {
                                const next = result.color === 'red' ? target.chooseToDiscard(2, 'he') : target.chooseToGive(player, 'he');
                                next.set('prompt', result.color === 'red' ? '弃置两张牌，或受到1点伤害' : ('交给' + get.translation(player) + '一张牌，或受到1点伤害'));
                                const { bool } = await next.forResult();
                                if (!bool) await target.damage();
                                await game.delayx();
                            }
                        }
                    }
                },
                ai: {
                    order: 15,
                    combo: 'bilibili_chuandu',
                    result: { player: 1 },
                },
            },
            //睡觉不玻璃
            bilibili_qicai: {
                trigger: { global: ['roundStart', 'useCard'] },
                filter(event, player) {
                    if (event.name === 'useCard') return event.player != player && player.getStorage('bilibili_qicai').includes(event.card.name);
                    return lib.inpile.some(name => !player.getStorage('bilibili_qicai').includes(name));
                },
                async cost(event, trigger, player) {
                    if (trigger.name === 'useCard') {
                        event.result = { bool: true, targets: [trigger.player] };
                    }
                    else {
                        event.result = await player.chooseButton([get.prompt('bilibili_qicai'), [lib.inpile.filter(name => !player.getStorage('bilibili_qicai').includes(name)), 'vcard']]).set('ai', button => {
                            switch (button.link[2]) {
                                case 'sha': return 5 + Math.random();
                                case 'shan': return 4 + Math.random();
                                case 'tao': return 3 + Math.random();
                                case 'lebu': return 3 + Math.random();
                                case 'wuzhong': return 4 + Math.random();
                                case 'shunshou': return 3 + Math.random();
                                case 'nanman': return 2 + Math.random();
                                case 'wanjian': return 2 + Math.random();
                                default: return 0.001 + Math.random();
                            }
                        }).forResult();
                        event.result.cost_data = event.result.links || [];
                    }
                },
                async content(event, trigger, player) {
                    if (trigger.name === 'useCard') {
                        const target = trigger.player;
                        const result = await target.chooseToDiscard({ name: trigger.card.name }, 'he', '奇才：弃置一张' + get.translation(trigger.card.name) + '，或失去1点体力').forResult();
                        if (!result?.bool) await target.loseHp();
                    }
                    else {
                        const names = event.cost_data.map(i => i[2]);
                        player.markAuto('bilibili_qicai', names);
                        player.popup(names);
                        game.log(player, '记录了', '#y' + get.translation(names));
                    }
                },
                intro: {
                    mark(dialog, content = []) {
                        if (content.length) {
                            dialog.addText('已记录牌名');
                            dialog.addSmall([content, 'vcard']);
                        }
                        else return '暂未记录牌名';
                    },
                },
            },
            bilibili_jizhi: {
                trigger: { global: 'damageBegin3' },
                filter(event, player) {
                    if (!player.countCards('h') || player.hasCard(card => !lib.filter.cardDiscardable(card, player), 'h')) return false;
                    return event.player !== player && event.card && get.type2(event.card) === 'trick';
                },
                logTarget: 'player',
                check(event, player) {
                    return player.maxHp > 1 && player.isDamaged() && player.countCards('h') <= 2;
                },
                async content(event, trigger, player) {
                    await player.discard(player.getCards('h'));
                    player.addSkill('bilibili_jizhi_effect');
                    if (!_status.characterlist) lib.skill.pingjian.initList();
                    if (_status.characterlist.length) {
                        let skills = _status.characterlist.map(i => get.character(i).skills || []).flat().unique();
                        skills = skills.filter(skill => {
                            const info = get.info(skill);
                            if (!info || info.charlotte || (info.ai && (info.ai.neg || info.ai.combo))) return false;
                            return !player.hasSkill(skill, null, false, false);
                        }).randomGets(2);
                        if (skills.length) await player.addAdditionalSkills(event.name, skills, true);
                    }
                },
                subSkill: {
                    effect: {
                        charlotte: true,
                        init(player, skill) {
                            player.storage[skill] ??= {};
                        },
                        trigger: { player: ['useSkillAfter', 'logSkill'] },
                        filter(event, player) {
                            const info = get.info(event.skill);
                            if (!info || info.charlotte) return false;
                            return player.additionalSkills?.bilibili_jizhi?.includes(get.sourceSkillFor(event));
                        },
                        silent: true,
                        firstDo: true,
                        content() {
                            const skill = get.sourceSkillFor(trigger);
                            player.storage[event.name][skill] = 1 + (player.storage[event.name][skill] ?? 0);
                            if (player.storage[event.name][skill] >= 3) {
                                player.changeSkills([], [skill]).set('$handle', (player, addSkills, removeSkills) => {
                                    for (const i of removeSkills) {
                                        player.popup(i);
                                        delete player.storage.bilibili_jizhi_effect[i];
                                    }
                                    game.log(player, "失去了技能", ...removeSkills.map(i => "#g【" + get.translation(i) + "】"));
                                    player.removeSkill(removeSkills);
                                    const additionalSkills = player.additionalSkills?.bilibili_jizhi;
                                    if (additionalSkills?.length) {
                                        additionalSkills.removeArray(removeSkills);
                                        if (!additionalSkills.length) {
                                            player.removeSkill('bilibili_jizhi_effect');
                                            delete player.additionalSkills.bilibili_jizhi;
                                        }
                                    }
                                });
                            }
                        },
                    },
                },
            },
            bilibili_fengliang: {
                trigger: { global: 'dying' },
                filter(event, player) {
                    const target = event.player;
                    return target !== player && !target.name2;
                },
                check(event, player) {
                    return get.attitude(player, event.player) > 0;
                },
                async content(event, trigger, player) {
                    await player.gainMaxHp();
                    if (!_status.characterlist) lib.skill.pingjian.initList();
                    if (_status.characterlist.length) {
                        const target = trigger.player;
                        target.addSkill('bilibili_fengliang_effect');
                        await target.changeCharacter([target.name1, _status.characterlist.randomGet()]);
                        await game.delayx();
                    }
                },
                subSkill: {
                    effect: {
                        charlotte: true,
                        trigger: { player: 'loseHpEnd' },
                        silent: true,
                        firstDo: true,
                        async content(event, trigger, player) {
                            await player.changeCharacter([player.name1]);
                            await game.delayx();
                        },
                    },
                },
            },
            bilibili_guiyin: {
                limited: true,
                trigger: { player: 'phaseEnd' },
                skillAnimation: true,
                animationColor: 'fire',
                check(event, player) {
                    return player.getHp() <= 1;
                },
                content() {
                    player.awakenSkill(event.name);
                    player.addTempSkill('diaohulishan', { player: 'phaseBegin' });
                },
            },
            //梦婉清
            bilibili_chouhua: {
                trigger: { player: 'phaseZhunbeiBegin' },
                filter(event, player) {
                    const list = get.info('bilibili_chouhua').getList(player).filter(num => num >= 0 && num !== Infinity);
                    return list.length >= 2 && list.reduce((sum, num) => sum + (num === Infinity ? 0 : num), 0);
                },
                async cost(event, trigger, player) {
                    let dialog = [get.prompt2(event.skill)];
                    const list = get.info('bilibili_chouhua').getList(player), sum = list.filter(num => num >= 0 && num !== Infinity).reduce((sum, num) => sum + (num === Infinity ? 0 : num), 0) + 1;
                    dialog.push('<div class="text center">摸牌数</div>');
                    dialog.push([Array.from({ length: sum }).map((_, i) => ['摸牌数值|' + i.toString(), i]), 'tdnodes']);
                    if (list[1] >= 0 && list[1] !== Infinity) {
                        dialog.push('<div class="text center">使用【杀】的次数上限</div>');
                        dialog.push([Array.from({ length: sum }).map((_, i) => ['次数上限|' + i.toString(), i]), 'tdnodes']);
                    }
                    if (list[2] >= 0 && list[2] !== Infinity) {
                        dialog.push('<div class="text center">攻击范围</div>');
                        dialog.push([Array.from({ length: sum }).map((_, i) => ['攻击范围|' + i.toString(), i]), 'tdnodes']);
                    }
                    if (list[3] >= 0 && list[3] !== Infinity) {
                        dialog.push('<div class="text center">手牌上限</div>');
                        dialog.push([Array.from({ length: sum }).map((_, i) => ['手牌上限|' + i.toString(), i]), 'tdnodes']);
                    }
                    const limit = list.filter(num => num >= 0 && num !== Infinity).length;
                    const result = event.result = await player.chooseButton(dialog).set('filterButton', button => {
                        const choosed = ui.selected.buttons;
                        if (choosed.some(i => i.link.split('|')[0] === button.link.split('|')[0])) return false;
                        const sum = [button.link, ...choosed.map(i => i.link)].map(list => parseInt(list.split('|')[1])).reduce((numx, num) => numx + num, 0);
                        return choosed.length === (get.event().selectButton - 1) ? (sum === get.event().sum) : (sum <= get.event().sum);
                    }).set('selectButton', limit).set('sum', sum - 1).forResult();
                    if (result?.bool && result.links?.length) event.result.cost_data = result.links;
                },
                async content(event, trigger, player) {
                    const list = get.info(event.name).getList(player);
                    for (const list2 of event.cost_data) {
                        let [choice, num] = list2.split('|');
                        num = parseInt(num);
                        let change = num - list[get.info(event.name).onremove.map(str => str.slice('bilibili_chouhua_'.length)).indexOf(choice)];
                        if (change !== 0) {
                            player.addSkill('bilibili_chouhua_' + choice);
                            if (choice !== '手牌上限') player.storage['bilibili_chouhua_' + choice] += change;
                            else {
                                //手牌上限至少为0，得用更“科学”的方法
                                change = Math.sign(change);
                                while (player.getHandcardLimit() !== num) player.storage['bilibili_chouhua_' + choice] += change;
                            }
                        }
                    }
                },
                getList(player) {
                    return [
                        (player.storage['bilibili_chouhua_摸牌数值'] ?? 0) + (((get.config("first_less") || _status.connectMode || _status.first_less_forced) && game.phaseNumber === 1 && _status.first_less) ? 1 : 2),
                        player.getCardUsable('sha', true), player.getAttackRange(), player.getHandcardLimit(),
                    ];
                },
                mark: true,
                intro: {
                    content(storage, player) {
                        const list = get.info('bilibili_chouhua').getList(player);
                        const list2 = get.info('bilibili_chouhua').onremove.map(str => str.slice('bilibili_chouhua_'.length));
                        return Array.from({ length: list.length }).map((_, i) => '<li>' + list2[i] + '：' + (list[i] == Infinity ? '无限' : list[i])).join('<br>');
                    },
                },
                onremove: ['摸牌数值', '次数上限', '攻击范围', '手牌上限'].map(str => 'bilibili_chouhua_' + str),
                subSkill: {
                    '摸牌数值': {
                        charlotte: true,
                        init: (player, skill) => player.storage[skill] ??= 0,
                        onremove: true,
                        trigger: { player: 'phaseDrawBegin' },
                        forced: true,
                        popup: false,
                        content() {
                            trigger.num += player.storage[event.name];
                            trigger.num = Math.max(0, trigger.num);
                        },
                    },
                    '次数上限': {
                        charlotte: true,
                        init: (player, skill) => player.storage[skill] ??= 0,
                        onremove: true,
                        mod: {
                            cardUsable(card, player, num) {
                                if (card.name === 'sha') return num + player.storage['bilibili_chouhua_次数上限'];
                            },
                        },
                    },
                    '攻击范围': {
                        charlotte: true,
                        init: (player, skill) => player.storage[skill] ??= 0,
                        onremove: true,
                        mod: {
                            attackRange(player, num) {
                                return num + player.storage['bilibili_chouhua_攻击范围'];
                            },
                        },
                    },
                    '手牌上限': {
                        charlotte: true,
                        init: (player, skill) => player.storage[skill] ??= 0,
                        onremove: true,
                        mod: {
                            maxHandcard(player, num) {
                                return num + player.storage['bilibili_chouhua_手牌上限'];
                            },
                        },
                    },
                },
            },
            bilibili_qiajue: {
                audio: 'clanqiajue',
                trigger: { player: ['phaseDrawEnd', 'phaseJieshuBegin'] },
                filter(event, player) {
                    const num = player.getCards('h').reduce((sum, card) => sum + get.number(card), 0);
                    return num >= 30 ? player.getHandcardLimit() !== 2 : player.hasCard(card => {
                        if (get.position(card) === 'h' && _status.connectMode) return true;
                        return lib.filter.cardDiscardable(card, player);
                    }, 'he');
                },
                async cost(event, trigger, player) {
                    const num = player.getCards('h').reduce((sum, card) => sum + get.number(card), 0);
                    if (num >= 30) event.result = { bool: true };
                    else event.result = await player.chooseToDiscard(`${get.prompt(event.skill)}（当前手牌点数和：${num}）`, '弃置一张牌并执行一个额外的摸牌阶段', 'he').set('ai', card => {
                        const player = get.player(), goon = get.position(card) === 'h';
                        const num = player.getCards('h').reduce((sum, card) => sum + get.number(card), 0);
                        if (num - (goon ? get.number(card) : 0) > 30) return 0;
                        return goon ? get.number(card) : 1 / Math.max(get.value(card), 0.1);
                    }).set('logSkill', event.skill).forResult();
                },
                popup: false,
                async content(event, trigger, player) {
                    if (!event.cards?.length) {
                        player.logSkill(event.name);
                        lib.skill.chenliuwushi.change(player, 2 - player.getHandcardLimit());
                    }
                    else {
                        const next = player.phaseDraw();
                        event.next.remove(next);
                        trigger.next.push(next);
                    }
                },
            },
            //牢狂
            bilibili_paoku: {
                trigger: { global: ['roundStart', 'roundEnd'] },
                async content(event, trigger, player) {
                    await Promise.all(event.next);
                    if (_status.connectMode) event.time = lib.configOL.choose_timeout;
                    event.videoId = lib.status.videoId++;
                    if (player.isUnderControl()) game.swapPlayerAuto(player);
                    const time = get.rand(300, 480);
                    const switchToAuto = () => {
                        return new Promise((resolve) => {
                            game.pause();
                            game.countChoose();
                            event._result = { score: time };
                            setTimeout(() => {
                                _status.imchoosing = false;
                                if (event.dialog) event.dialog.close();
                                game.resume();
                                resolve(event._result);
                            }, time * 1000);
                        });
                    };
                    const createDialog = (player, id) => {
                        if (_status.connectMode) lib.configOL.choose_timeout = 'Infinity';
                        if (player === game.me) return;
                        const dialog = ui.create.dialog(get.translation(player) + '正在进行"狂神快跑"...<br>');
                        dialog.videoId = id;
                    };
                    const chooseButton = (player, time) => {
                        const { promise, resolve } = Promise.withResolvers(), event = _status.event;
                        event.dialog = (() => {
                            //游戏dialog
                            const dialog = ui.create.dialog('hidden');
                            dialog.classList.add('popped');
                            dialog.classList.add('static');
                            Object.assign(dialog.style, {
                                height: '100%',
                                width: '100%',
                                top: '0px',
                                left: '0px',
                                background: 'rgba(0,0,0,0.85)',
                                textAlign: 'center',
                            });
                            ui.window.appendChild(dialog);
                            dialog.innerHTML = '';
                            //游戏画布
                            const canvas = document.createElement('canvas');
                            const width = 480, height = 320;
                            canvas.width = width;
                            canvas.height = height;
                            Object.assign(canvas.style, {
                                display: 'block',
                                margin: '40px auto 10px auto',
                                background: '#000',
                                borderRadius: '8px',
                            });
                            dialog.appendChild(canvas);
                            const ctx = canvas.getContext('2d');
                            //触控按钮，给手机端用的
                            const ctrlBox = document.createElement('div');
                            Object.assign(ctrlBox.style, {
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                margin: '0 auto',
                                gap: '120px',
                            });
                            const leftBtn = document.createElement('button');
                            const rightBtn = document.createElement('button');
                            const styleBtn = {
                                width: '180px',
                                height: '40px',
                                fontSize: '20px',
                                borderRadius: '8px',
                                background: '#333',
                                color: '#fff',
                                flex: 'none',
                            };
                            Object.assign(leftBtn.style, styleBtn);
                            Object.assign(rightBtn.style, styleBtn);
                            leftBtn.textContent = '←';
                            rightBtn.textContent = '→';
                            ctrlBox.appendChild(leftBtn);
                            ctrlBox.appendChild(rightBtn);
                            dialog.appendChild(ctrlBox);
                            //主角登场
                            const playerObj = { x: width / 2 - 15, y: height - 30, w: 30, h: 30, speed: 5 };
                            const barriers = [];
                            let score = 0, running = true;
                            const keys = { left: false, right: false };
                            //挡板参数
                            const barrierWidth = width / 3;
                            const barrierHeight = 15;
                            const barrierSpeed = 3;
                            let barrierSpawnTimer = 0;
                            const barrierSpawnInterval = 1000;
                            //电脑也干了
                            const keyDown = e => {
                                if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = true;
                                if (e.key === 'ArrowRight' || e.key === 'd') keys.right = true;
                            };
                            const keyUp = e => {
                                if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = false;
                                if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false;
                            };
                            window.addEventListener('keydown', keyDown);
                            window.addEventListener('keyup', keyUp);
                            //手机也干了
                            let holdLeft = false, holdRight = false;
                            leftBtn.addEventListener(lib.device ? 'touchstart' : 'mousedown', () => holdLeft = true);
                            leftBtn.addEventListener(lib.device ? 'touchend' : 'mouseup', () => holdLeft = false);
                            rightBtn.addEventListener(lib.device ? 'touchstart' : 'mousedown', () => holdRight = true);
                            rightBtn.addEventListener(lib.device ? 'touchend' : 'mouseup', () => holdRight = false);
                            //生成挡板
                            const spawnBarrier = () => {
                                const barrierCount = Math.random() < 0.6 ? 1 : 2;
                                const positions = [0, 1, 2];//三个可能的位置
                                //随机打乱位置并选择前barrierCount个
                                for (let i = positions.length - 1; i > 0; i--) {
                                    const j = Math.floor(Math.random() * (i + 1));
                                    [positions[i], positions[j]] = [positions[j], positions[i]];
                                }
                                for (let i = 0; i < barrierCount; i++) {
                                    const pos = positions[i];
                                    barriers.push({
                                        x: pos * barrierWidth,
                                        y: -barrierHeight,
                                        w: barrierWidth,
                                        h: barrierHeight,
                                        color: 'red',
                                        speed: barrierSpeed,
                                    });
                                }
                            };
                            //添加时间差变量
                            let lastTime = 0;
                            const update = (currentTime = 0) => {
                                //计算时间差（将不同设备均标准化到60fps）
                                const deltaTime = lastTime ? (currentTime - lastTime) / 16.67 : 1;
                                lastTime = currentTime;
                                if (keys.left || holdLeft) playerObj.x -= playerObj.speed * deltaTime;
                                if (keys.right || holdRight) playerObj.x += playerObj.speed * deltaTime;
                                playerObj.x = Math.max(0, Math.min(width - playerObj.w, playerObj.x));
                                barrierSpawnTimer += deltaTime * 16.67;
                                if (barrierSpawnTimer >= barrierSpawnInterval) {
                                    spawnBarrier();
                                    barrierSpawnTimer = 0;
                                }
                                for (let i = barriers.length - 1; i >= 0; i--) {
                                    const barrier = barriers[i];
                                    barrier.y += barrier.speed * deltaTime;
                                    if (
                                        barrier.x < playerObj.x + playerObj.w &&
                                        barrier.x + barrier.w > playerObj.x &&
                                        barrier.y < playerObj.y + playerObj.h &&
                                        barrier.y + barrier.h > playerObj.y
                                    ) {
                                        //碰到挡板顷刻坠机
                                        running = false;
                                        clearInterval(timer);
                                        setTimeout(endGame, 500);
                                        return;
                                    }
                                    if (barrier.y > height + 10) {
                                        barriers.splice(i, 1);
                                        score++;
                                    }
                                }
                            };
                            const draw = () => {
                                ctx.clearRect(0, 0, width, height);
                                ctx.fillStyle = 'white';
                                ctx.fillRect(playerObj.x, playerObj.y, playerObj.w, playerObj.h);
                                for (const barrier of barriers) {
                                    ctx.fillStyle = barrier.color;
                                    ctx.fillRect(barrier.x, barrier.y, barrier.w, barrier.h);
                                }
                                ctx.fillStyle = 'yellow';
                                ctx.font = '16px monospace';
                                ctx.fillText(`分数: ${score}`, 10, 20);
                                ctx.fillText(`时间: ${time.toFixed(1)}s`, width - 110, 20);
                            };
                            const loop = (currentTime) => {
                                if (!running) return;
                                update(currentTime);
                                draw();
                                requestAnimationFrame(loop);
                            };
                            const timer = setInterval(() => {
                                time -= 0.1;
                                if (time <= 0 || score + player.countMark(event.name) >= 1103) {
                                    running = false;
                                    clearInterval(timer);
                                    setTimeout(endGame, 500);
                                }
                            }, 100);
                            const endGame = () => {
                                ctx.clearRect(0, 0, width, height);
                                ctx.fillStyle = 'white';
                                ctx.font = '24px sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(score + player.countMark(event.name) >= 1103 ? '恭喜你，复活成功！' : `游戏结束！得分：${score}`, width / 2, height / 2);
                                event._result = { score };
                                //孩子们，玩完游戏记得对页面进行清理哦
                                window.removeEventListener('keydown', keyDown);
                                window.removeEventListener('keyup', keyUp);
                                leftBtn.remove();
                                rightBtn.remove();
                                ctrlBox.remove();
                                setTimeout(() => {
                                    if (event.dialog) event.dialog.close();
                                    _status.imchoosing = false;
                                    game.resume();
                                    resolve(event._result);
                                }, 2000);
                            };
                            requestAnimationFrame(loop);
                            return dialog;
                        })();
                        event.switchToAuto = () => {
                            event._result = { score: 0 };
                            game.resume();
                            resolve(event._result);
                        };
                        _status.imchoosing = true;
                        game.pause();
                        game.countChoose();
                        return promise;
                    };
                    game.broadcastAll(createDialog, player, event.videoId);
                    let next;
                    if (event.isMine()) next = chooseButton(player, time);
                    else if (event.isOnline()) {
                        const { promise, resolve } = Promise.withResolvers();
                        event.player.send(chooseButton, player, time);
                        event.player.wait(async result => {
                            if (result === 'ai') result = await switchToAuto();
                            resolve(result);
                        });
                        game.pause();
                        next = promise;
                    }
                    else next = switchToAuto();
                    const result2 = await next;
                    game.broadcastAll((id, time) => {
                        if (_status.connectMode) lib.configOL.choose_timeout = time;
                        const dialog = get.idDialog(id);
                        if (dialog) dialog.close();
                    }, event.videoId, event.time);
                    player.addMark(event.name, result2.score);
                    if (player.countMark(event.name) >= 1103) {
                        const me = game.me._trueMe || game.me;
                        const winners = game.filterPlayer2(i => i.isFriendOf(player), [], true);
                        game.over(player === me || winners.includes(me));
                    }
                },
                marktext: '🔥',
                intro: {
                    name: '复活赛',
                    name2: '复活币',
                    content: '复活赛进度条：#/1103',
                },
            },
            bilibili_zhijiang: {
                enable: 'phaseUse',
                usable: 1,
                async content(event, trigger, player) {
                    await Promise.all(event.next);
                    if (_status.connectMode) event.time = lib.configOL.choose_timeout;
                    event.videoId = lib.status.videoId++;
                    if (player.isUnderControl()) game.swapPlayerAuto(player);
                    const time = get.rand(300, 480);
                    const switchToAuto = () => {
                        return new Promise((resolve) => {
                            game.pause();
                            game.countChoose();
                            event._result = { canceled: true, score: time };
                            setTimeout(() => {
                                _status.imchoosing = false;
                                if (event.dialog) event.dialog.close();
                                game.resume();
                                resolve(event._result);
                            }, time * 1000);
                        });
                    };
                    const createDialog = (player, id) => {
                        if (_status.connectMode) lib.configOL.choose_timeout = 'Infinity';
                        if (player === game.me) return;
                        const dialog = ui.create.dialog(get.translation(player) + '正在玩游戏...<br>');
                        dialog.videoId = id;
                    };
                    const chooseButton = (time, url) => {
                        const { promise, resolve } = Promise.withResolvers(), event = _status.event;
                        let remain = time, timer;
                        event.dialog = (() => {
                            const dialog = ui.create.dialog('hidden');
                            dialog.classList.add('popped', 'static');
                            Object.assign(dialog.style, {
                                width: '100%',
                                height: '100%',
                                top: '0',
                                left: '0',
                                background: 'rgba(0,0,0,0.85)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 1145141919810,
                                overflowX: 'hidden',
                            });
                            ui.window.appendChild(dialog);
                            const box = document.createElement('div');
                            Object.assign(box.style, {
                                width: 'calc(100% - 2px)',
                                height: 'calc(100% - 2px)',
                                background: '#111',
                                borderRadius: '12px',
                                position: 'relative',
                                overflow: 'hidden',
                            });
                            dialog.appendChild(box);
                            const timerText = document.createElement('div');
                            Object.assign(timerText.style, {
                                position: 'absolute',
                                top: '10px',
                                left: '12px',
                                color: '#fff',
                                fontSize: '16px',
                                zIndex: 10,
                                userSelect: 'none',
                            });
                            timerText.innerText = `剩余时间：${remain} 秒`;
                            box.appendChild(timerText);
                            const iframe = document.createElement('iframe');
                            iframe.src = url;
                            iframe.allow = 'fullscreen';
                            Object.assign(iframe.style, {
                                width: '100%',
                                height: '100%',
                                border: 'none',
                                display: 'block',
                            });
                            iframe.onerror = () => {
                                end();
                            };
                            box.appendChild(iframe);
                            const cancelBtn = document.createElement('div');
                            cancelBtn.innerText = '✖';
                            Object.assign(cancelBtn.style, {
                                position: 'absolute',
                                top: '10px',
                                right: '12px',
                                width: '32px',
                                height: '32px',
                                lineHeight: '32px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                fontSize: '20px',
                                color: '#fff',
                                background: 'rgba(0,0,0,0.6)',
                                borderRadius: '50%',
                                zIndex: 10,
                                userSelect: 'none',
                            });
                            box.appendChild(cancelBtn);
                            const end = () => {
                                clearInterval(timer);
                                const seconds = time - remain;
                                event._result = {
                                    canceled: true,
                                    time: seconds,
                                    score: seconds,
                                };
                                if (event.dialog) event.dialog.close();
                                _status.imchoosing = false;
                                game.resume();
                                resolve(event._result);
                            };
                            cancelBtn.onclick = end;
                            timer = setInterval(() => {
                                remain--;
                                timerText.innerText = `剩余时间：${remain} 秒`;
                                if (remain <= 0) end();
                            }, 1000);
                            return dialog;
                        })();
                        event.switchToAuto = () => {
                            const seconds = time - remain;
                            event._result = {
                                canceled: true,
                                time: seconds,
                                score: seconds,
                            };
                            game.resume();
                            resolve(event._result);
                        };
                        _status.imchoosing = true;
                        game.pause();
                        game.countChoose();
                        return promise;
                    };
                    game.broadcastAll(createDialog, player, event.videoId);
                    let next, url = 'https://berrypvz.github.io/mps/';//'http://jspvz.com/plantsvszombies.htm';
                    if (event.isMine()) next = chooseButton(time, url);
                    else if (event.isOnline()) {
                        const { promise, resolve } = Promise.withResolvers();
                        event.player.send(chooseButton, time, url);
                        event.player.wait(async result => {
                            if (result === 'ai') result = await switchToAuto();
                            resolve(result);
                        });
                        game.pause();
                        next = promise;
                    }
                    else next = switchToAuto();
                    const result2 = await next;
                    game.broadcastAll((id, time) => {
                        if (_status.connectMode) lib.configOL.choose_timeout = time;
                        const dialog = get.idDialog(id);
                        if (dialog) dialog.close();
                    }, event.videoId, event.time);
                    player.addMark('bilibili_paoku', result2.score);
                    if (player.countMark('bilibili_paoku') >= 1103) {
                        const me = game.me._trueMe || game.me;
                        const winners = game.filterPlayer2(i => i.isFriendOf(player), [], true);
                        game.over(player === me || winners.includes(me));
                    }
                },
                ai: {
                    order: 10,
                    result: { player: 1 },
                },
            },
            //吾猪万睡
            bilibili_diaowen: {
                trigger: { global: ['useCardAfter', 'damageBegin4'] },
                filter(event, player) {
                    const cards = player.getExpansions('bilibili_diaowen');
                    if (event.name === 'damage') return cards.map(i => i.name).unique().length >= 3;
                    return cards.some(card => card.name == event.card.name);
                },
                forced: true,
                async content(event, trigger, player) {
                    const cards = player.getExpansions(event.name);
                    if (trigger.name === 'damage') {
                        const result = await player.chooseButton([
                            get.prompt(event.name),
                            '移去三张不同牌名的“史”，防止此伤害',
                            cards,
                        ], 3).set('filterButton', button => {
                            return !ui.selected.buttons.some(but => but.link.name === button.link.name);
                        }).set('ai', button => {
                            const player = get.player(), trigger = get.event().getTrigger();
                            if (get.damageEffect(player, trigger.source, player) > 0 || player.hp + player.countCards('hs', card => {
                                return player.canSaveCard(card, player);
                            }) - trigger.num > 0) return -1;
                            return 1 / (get.value(button.link) || 0.5);
                        }).forResult();
                        if (result?.bool && result.links?.length) {
                            await player.loseToDiscardpile(result.links);
                            trigger.cancel();
                        }
                        return;
                    }
                    await player.loseToDiscardpile(cards.filter(card => card.name == trigger.card.name));
                    const next = player.addToExpansion(get.cards(2), 'gain2');
                    next.gaintag.add(event.name);
                    await next;
                },
                group: ['bilibili_diaowen_init', 'bilibili_diaowen_give'],
                marktext: '史',
                intro: {
                    content: 'expansion',
                    markcount: 'expansion',
                },
                onremove(player, skill) {
                    const cards = player.getExpansions(skill);
                    if (cards.length) player.loseToDiscardpile(cards);
                },
                subSkill: {
                    init: {
                        trigger: { global: 'roundStart' },
                        forced: true,
                        locked: false,
                        async content(event, trigger, player) {
                            const next = player.addToExpansion(get.cards(3), 'gain2');
                            next.gaintag.add('bilibili_diaowen');
                            await next;
                        },
                    },
                    give: {
                        trigger: { global: 'roundEnd' },
                        filter(event, player) {
                            return player.getExpansions('bilibili_diaowen').some(card => {
                                return game.hasPlayer(target => {
                                    return !target.getRoundHistory('useCard', evt => card.name === evt.card.name).length;
                                });
                            });
                        },
                        direct: true,
                        async content(event, trigger, player) {
                            if (_status.connectMode) game.broadcastAll(() => (_status.noclearcountdown = true));
                            const cards = player.getExpansions('bilibili_diaowen'), map = {};
                            while (cards.some(card => {
                                return game.hasPlayer(target => {
                                    return !target.getRoundHistory('useCard', evt => card.name === evt.card.name).length;
                                });
                            })) {
                                const result = await player.chooseButtonTarget({
                                    createDialog: [`${get.translation(event.name)}：是否${Object.keys(map).length > 0 ? '继续' : ''}将史“分享”给其他角色？`, cards],
                                    filterButton(button) {
                                        return game.hasPlayer(target => {
                                            return !target.getRoundHistory('useCard', evt => button.link.name === evt.card.name).length;
                                        });
                                    },
                                    selectButton: [1, cards.length],
                                    filterTarget(card, player, target) {
                                        return ui.selected.buttons.every(button => {
                                            return !target.getRoundHistory('useCard', evt => button.link.name === evt.card.name).length;
                                        });
                                    },
                                    ai1(button) {
                                        const { player, map } = get.event();
                                        return Math.max(...game.filterPlayer().map(target => {
                                            return [...ui.selected.cards, button.link, ...(map[target.playerid] || [{ name: 'bilibili_shi' }])].reduce((sum, card) => {
                                                return get.value(card, target) * get.attitude(player, target);
                                            }, 0);
                                        }));
                                    },
                                    ai2(target) {
                                        const player = get.player();
                                        const card = ui.selected.buttons[0].link;
                                        if (card) return get.value(card, target) * get.attitude(player, target);
                                        return 0;
                                    },
                                    map: map,
                                }).forResult();
                                if (result?.bool && result.targets?.length && result.links?.length) {
                                    cards.removeArray(result.links);
                                    const id = result.targets[0].playerid;
                                    map[id] ??= [game.createCard('bilibili_shi', 'spade', 13)];
                                    map[id].addArray(result.links);
                                }
                                else break;
                            }
                            if (_status.connectMode) {
                                game.broadcastAll(() => {
                                    delete _status.noclearcountdown;
                                    game.stopCountChoose();
                                });
                            }
                            if (Object.keys(map).length) {
                                const gain_list = [];
                                for (const i in map) {
                                    const source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
                                    player.line(source, 'green');
                                    gain_list.push([source, map[i]]);
                                    game.log(source, "获得了", map[i]);
                                }
                                await game.loseAsync({
                                    gain_list: gain_list,
                                    player: player,
                                    giver: player,
                                    animate: 'give',
                                }).setContent('gaincardMultiple');
                            }
                        },
                    },
                },
            },
            bilibili_shi: {
                trigger: {
                    player: ['loseAfter', 'compare'],
                    global: ['equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter', 'addToExpansionAfter'],
                    target: 'compare',
                },
                cardSkill: true,
                filter(event, player, name) {
                    if (name === 'compare') {
                        if (player == event.player) {
                            if (event.iwhile > 0) return false;
                            return event.card1.name === 'bilibili_shi';
                        }
                        return event.card2.name == 'bilibili_shi';
                    }
                    if (event.name !== 'equip' && !event.visible) return false;
                    const evt = event.getl(player);
                    return evt?.hs?.some(i => get.name(i, player) === 'shi' || i.name === 'bilibili_shi');
                },
                forced: true,
                popup: false,
                async content(event, trigger, player) {
                    if (trigger.delay === false) await game.delayx();
                    game.log('#g【史】', '是', player, '想丢就能丢的吗？？！');
                    let num = 1;
                    if (typeof trigger.getl == 'function') {
                        num = trigger.getl(player).hs.filter(i => get.name(i, player) === 'shi' || i.name === 'bilibili_shi').length;
                    }
                    await player.loseHp(num);
                },
            },
            bilibili_banyun: {
                enable: ['chooseToUse', 'chooseToRespond'],
                hiddenCard(player, name) {
                    if (!player.getStat('skill').bilibili_banyun && player.getExpansions('bilibili_diaowen').some(card => card.name == name)) return true;
                },
                filter(event, player) {
                    if (event.responded || event.bilibili_banyun) return false;
                    return player.getExpansions('bilibili_diaowen').some(card => event.filterCard(card, player, event));
                },
                usable: 1,
                chooseButton: {
                    dialog(event, player) {
                        return ui.create.dialog('输粮', player.getExpansions('bilibili_diaowen'), 'hidden');
                    },
                    filter(button, player) {
                        const evt = _status.event.getParent();
                        return evt.filterCard(button.link, player, evt);
                    },
                    check(button) {
                        const card = button.link,
                            player = get.player();
                        return player.getUseValue(card);
                    },
                    backup(links, player) {
                        return {
                            audio: 'bilibili_banyun',
                            filterCard(card) {
                                return card === lib.skill.bilibili_banyun_backup.card;
                            },
                            selectCard: -1,
                            viewAs: links[0],
                            card: links[0],
                            position: 'x',
                            precontent() {
                                player.addTempSkill('bilibili_banyun_effect');
                            },
                        };
                    },
                    prompt(links, player) {
                        return '搬运：请选择' + get.translation(links[0]) + '的目标';
                    },
                },
                ai: {
                    combo: 'bilibili_diaowen',
                    effect: {
                        target(card, player, target, effect) {
                            if (target.getStat('skill').bilibili_banyun) return;
                            const cards = target.getExpansions('bilibili_diaowen');
                            if (get.tag(card, 'respondSha') && cards.some(card => card.name === 'sha')) return 0.7;
                            if (get.tag(card, 'respondShan') && cards.some(card => card.name === 'shan')) return 0.7;
                        },
                    },
                    order(item, player) {
                        if (player && _status.event.type === 'phase') {
                            let list = player.getExpansions('bilibili_diaowen').filter(card => player.getUseValue(card, true, true) > 0);
                            if (!list.length) return 0;
                            list.sort((a, b) => player.getUseValue(b, true, true) - player.getUseValue(a, true, true));
                            return get.order(list[0], player) + 1;
                        }
                        return 10;
                    },
                    respondShan: true,
                    respondSha: true,
                    skillTagFilter(player, tag) {
                        if (player.getStat('skill').bilibili_banyun) return false;
                        const cards = player.getExpansions('bilibili_diaowen');
                        return cards.some(card => card.name === (tag === 'respondSha' ? 'sha' : 'shan'));
                    },
                    result: {
                        player(player) {
                            if (_status.event.dying) return get.attitude(player, _status.event.dying);
                            return 1;
                        },
                    },
                },
                subSkill: {
                    backup: {},
                    effect: {
                        charlotte: true,
                        trigger: { player: ['useCardAfter', 'respondAfter'] },
                        filter(event, player) {
                            return event.skill === 'bilibili_banyun_backup' && game.hasPlayer(i => i.countCards('he') > 0);
                        },
                        forced: true,
                        popup: false,
                        async content(event, trigger, player) {
                            const result = await player.chooseTarget((card, player, target) => {
                                return target.countCards('he') > 0;
                            }, `${get.translation(event.name)}：将一名角色的一张牌置于武将牌上`, true).set('ai', target => {
                                const player = get.player();
                                return get.effect(target, { name: 'guohe_copy2' }, player, player);
                            }).forResult();
                            if (result?.bool && result.targets?.length) {
                                const target = result.targets[0];
                                await player.line(target);
                                const result2 = await player.choosePlayerCard(target, 'he', true).forResult();
                                if (result2?.bool && result2.cards?.length) {
                                    const next = player.addToExpansion(result2.cards, target, 'give');
                                    next.gaintag.add('bilibili_diaowen');
                                    await next;
                                }
                            }
                        },
                    },
                },
            },
            //点点
            bilibili_siyu: {
                audio: 'ext:活动武将/audio/skill:2',
                trigger: {
                    global: 'phaseBefore',
                    player: ['damageEnd', 'phaseBegin'],
                },
                filter(event, player, name) {
                    return name === 'phaseBegin' || event.name !== 'phase' || game.phaseNumber === 0;
                },
                forced: true,
                getIndex: event => event.name === 'damage' ? event.num : 1,
                async content(event, trigger, player) {
                    if (event.triggername === 'phaseBegin') await player.chooseToGuanxing(player.getExpansions(event.name).length + 1);
                    else {
                        const next = player.addToExpansion(get.cards(trigger.name === 'damage' ? 1 : 3), 'gain2');
                        next.gaintag.add(event.name);
                        await next;
                    }
                },
                marktext: '🐖',
                intro: {
                    name: '小菲',
                    content: 'expansion',
                    markcount: 'expansion',
                },
                onremove(player, skill) {
                    const cards = player.getExpansions(skill);
                    if (cards.length) player.loseToDiscardpile(cards);
                },
                global: ['bilibili_olfushi', 'bilibili_olfushi_put'],
                derivation: 'bilibili_olfushi',
            },
            bilibili_olfushi: {
                audio: 'ext:活动武将/audio/skill:2',
                forceaudio: true,
                enable: 'chooseToUse',
                filter(event, player) {
                    if (event.bilibili_olfushi || !event.filterCard({ name: 'sha', isCard: true }, player, event)) return false;
                    return game.hasPlayer(target => target !== player && target.hasSkill('bilibili_siyu') && target.getExpansions('bilibili_siyu').length > 0);
                },
                chooseButton: {
                    dialog(event, player) {
                        const dialog = ui.create.dialog('缚豕', 'hidden');
                        dialog.add('<div class="text center">请选择你要转化的“小菲”和额外效果</div>');
                        dialog.add([(() => {
                            let cards = [];
                            game.countPlayer(target => {
                                if (target !== player && target.hasSkill('bilibili_siyu')) {
                                    cards.addArray(target.getExpansions('bilibili_siyu'));
                                }
                            });
                            return cards.map(card => [card, get.translation(get.owner(card))]);
                        })(), (item, type, position, noclick, node) => {
                            node = ui.create.buttonPresets.card(item[0], type, position, noclick);
                            game.createButtonCardsetion(item[1], node);
                            return node;
                        }]);
                        dialog.add([['目标+1', '伤害+1'], 'tdnodes']);
                        return dialog;
                    },
                    filter(button) {
                        return !ui.selected.buttons.some(but => ['目标+1', '伤害+1'].includes(but.link) === ['目标+1', '伤害+1'].includes(button.link));
                    },
                    select: 2,
                    check(button) {
                        const player = get.player(), card = new lib.element.VCard({ name: 'sha', isCard: true });
                        if (!['目标+1', '伤害+1'].includes(button.link)) return 2 - Math.sign(get.attitude(player, get.owner(button.link))) + Math.random();
                        const targets = game.filterPlayer(target => player.canUse(card, target) && get.effect(target, card, player, player) > 0).sort((a, b) => {
                            return get.effect(b, card, player, player) - get.effect(a, card, player, player);
                        });
                        if (!targets.length) return 0;
                        const [first, second] = targets.slice(0, 2);
                        if (!second && get.damageEffect(first, player, player) > 0) return button.link === '伤害+1' ? 1 : -1;
                        if (first.hasSkillTag('filterDamage', null, {
                            player: player,
                            card: card,
                        })) return button.link === '目标+1' ? 1 : -1;
                        return button.link === (() => {
                            return get.effect(second, card, player, player) > get.effect(first, card, player, player) ? '目标+1' : '伤害+1';
                        })() ? 1 : -1;
                    },
                    prompt(links, player) {
                        if (typeof links[0] === 'string') links.reverse();
                        return `###缚豕###<div class="text center">将${get.translation(links[0])}置入弃牌堆，视为使用一张${links[1]}的【杀】</div>`;
                    },
                    backup(links, player) {
                        if (typeof links[0] === 'string') links.reverse();
                        const [card, choice] = links;
                        return {
                            audio: 'bilibili_olfushi',
                            filterCard: () => false,
                            selectCard: -1,
                            viewAs: {
                                name: 'sha',
                                storage: { bilibili_olfushi: [card, choice] },
                                isCard: true,
                            },
                            log: false,
                            async precontent(event, trigger, player) {
                                const [card, choice] = event.result.card.storage.bilibili_olfushi;
                                const owner = get.owner(card);
                                if (owner) {
                                    player.logSkill('bilibili_olfushi', owner);
                                    player.popup(choice);
                                    game.log(player, '选择了', `#g${choice}`);
                                    await owner.loseToDiscardpile([card]);
                                    await player.draw();
                                    player.addTempSkill('bilibili_olfushi_effect');
                                }
                                else {
                                    const evt = event.getParent();
                                    evt.set('bilibili_olfushi', true);
                                    evt.goto(0);
                                }
                            },
                        };
                    },
                },
                ai: {
                    order(item, player) {
                        return get.order({ name: 'sha' }, player) + ((game.hasPlayer(target => target !== player && target.hasSkill('bilibili_siyu') && get.attitude(player, target) > 0)) ? 0.1 : -0.1);
                    },
                    result: { player: 1 },
                },
                group: 'bilibili_olfushi_put',
                subSkill: {
                    backup: {},
                    put: {
                        audio: 'bilibili_olfushi',
                        forceaudio: true,
                        trigger: { player: 'useCardAfter' },
                        filter(event, player) {
                            if (event.card.name !== 'sha' || !event.cards?.someInD('od')) return false;
                            return game.hasPlayer(target => target !== player && target.hasSkill('bilibili_siyu'));
                        },
                        async cost(event, trigger, player) {
                            const cards = trigger.cards.filterInD('od');
                            event.result = await player.chooseTarget(get.prompt(event.skill), (card, player, target) => {
                                return target !== player && target.hasSkill('bilibili_siyu');
                            }, `将${get.translation(cards)}置于一名拥有“小菲”技能的角色的武将牌上`).set('ai', target => {
                                const player = get.player();
                                return get.attitude(player, target);
                            }).forResult();
                        },
                        async content(event, trigger, player) {
                            const cards = trigger.cards.filterInD('od');
                            const next = event.targets[0].addToExpansion(cards, 'gain2');
                            next.gaintag.add('bilibili_siyu');
                            await next;
                        },
                    },
                    effect: {
                        charlotte: true,
                        trigger: { player: ['useCard', 'useCard2'] },
                        filter(event, player, name) {
                            if (!event.card.storage?.bilibili_olfushi || !event.card || !event.targets?.length) return false;
                            const choice = event.card.storage.bilibili_olfushi[1];
                            if (choice === '伤害+1') return name === 'useCard';
                            return name === 'useCard2' && game.hasPlayer(target => {
                                return !event.targets.includes(target) && lib.filter.targetEnabled2(event.card, player, target);
                            });
                        },
                        forced: true,
                        popup: false,
                        async content(event, trigger, player) {
                            if (event.triggername === 'useCard') {
                                trigger.baseDamage++;
                                game.log(trigger.card, '造成的伤害', '#y+1');
                            }
                            else {
                                const result = await player.chooseTarget(`${get.translation(event.name)}：令一名角色成为${get.translation(trigger.card)}的额外目标`, (card, player, target) => {
                                    const evt = get.event().getTrigger();
                                    return !evt.targets.includes(target) && lib.filter.targetEnabled2(evt.card, player, target);
                                }, true).set('ai', target => {
                                    const player = get.player(), evt = get.event().getTrigger();
                                    return get.effect(target, evt.card, player, player);
                                }).forResult();
                                if (result?.bool && result.targets?.length) {
                                    const targets = result.targets.sortBySeat();
                                    player.line(targets);
                                    trigger.targets.addArray(targets);
                                    game.log(targets, '成为了', trigger.card, '的额外目标');
                                }
                            }
                        },
                    },
                },
            },
            bilibili_tamen: {
                audio: 'ext:活动武将/audio/skill:2',
                trigger: { player: 'useCardToPlayered' },
                filter(event, player) {
                    if (!event.isFirstTarget || !player.getExpansions('bilibili_siyu').some(i => get.color(i) === 'black')) return false;
                    return (get.type(event.card) === 'basic' || get.type(event.card) === 'trick') && get.tag(event.card, 'damage');
                },
                async cost(event, trigger, player) {
                    const result = await player.chooseButton([
                        `###${get.prompt(event.skill)}###<div class='text center'>${(() => {
                            let str = lib.translate[`${event.skill}_info`];
                            return str.split('②')[1].split('③')[0];
                        })()}</div>`,
                        player.getExpansions('bilibili_siyu'),
                    ]).set('filterButton', button => {
                        return get.color(button.link) === 'black';
                    }).set('ai', button => {
                        const player = get.player(), trigger = get.event().getTrigger(), card = button.link;
                        if (trigger.targets.reduce((sum, target) => sum + get.effect(target, trigger.card, player, player), 0) <= 0) return 0;
                        return (get.type2(card) === get.type2(trigger.card) ? 2 : 1) + Math.random();
                    }).forResult();
                    if (result?.bool && result.links?.length) event.result = { bool: true, cards: result.links };
                },
                async content(event, trigger, player) {
                    await player.loseToDiscardpile(event.cards);
                    trigger.getParent().directHit.addArray(game.players);
                    game.log(trigger.card, '不可被响应');
                    if (get.type2(event.cards[0]) === get.type2(trigger.card)) {
                        trigger.getParent().baseDamage++;
                        game.log(trigger.card, '造成的伤害', '#g+1');
                    }
                },
                group: ['bilibili_tamen_draw', 'bilibili_tamen_recover'],
                subSkill: {
                    draw: {
                        audio: 'bilibili_tamen',
                        trigger: { global: ['loseAfter', 'loseAsyncAfter', 'equipAfter', 'addJudgeAfter', 'gainAfter', 'addToExpansionAfter', 'cardsGotoSpecialAfter'] },
                        filter(event, player) {
                            if (game.hasPlayer(current => {
                                const evt = event.getl(current);
                                return evt && (evt.xs.length > 0 || evt.ss.length > 0);
                            })) return true;
                            if (event.name === 'lose' || event.name === 'loseAsync') return event.getlx !== false && event.toStorage === true;
                            return event.name === 'addToExpansion' || (event.name === 'cardsGotoSpecial' && !event.notrigger);
                        },
                        forced: true,
                        locked: false,
                        async content(event, trigger, player) {
                            await player.draw();
                        },
                    },
                    recover: {
                        audio: 'bilibili_tamen',
                        trigger: { global: 'dying' },
                        filter(event, player) {
                            return player.getExpansions('bilibili_siyu').some(i => get.color(i) === 'red');
                        },
                        async cost(event, trigger, player) {
                            const skill = get.sourceSkillFor(event.skill);
                            const result = await player.chooseButton([
                                `###${get.prompt(skill, trigger.player)}###<div class='text center'>${lib.translate[`${skill}_info`].split('③')[1]}</div>`,
                                player.getExpansions('bilibili_siyu'),
                            ]).set('filterButton', button => {
                                return get.color(button.link) === 'red';
                            }).set('ai', button => {
                                const player = get.player(), event = get.event().getTrigger();
                                return get.recoverEffect(event.player, player, player) > 0 ? (1 + Math.random()) : -1;
                            }).forResult();
                            if (result?.bool && result.links?.length) event.result = { bool: true, cards: result.links };
                        },
                        logTarget: 'player',
                        async content(event, trigger, player) {
                            await player.loseToDiscardpile(event.cards);
                            await trigger.player.recover();
                            if (!trigger.player.isDying()) {
                                const next = player.addToExpansion(get.cards(), 'gain2');
                                next.gaintag.add('bilibili_siyu');
                                await next;
                            }
                        },
                    },
                },
                ai: { combo: 'bilibili_siyu' },
            },
            // 沐如风晨
            bilibili_ziyuan: {
                trigger: {
                    global: ['phaseBefore', 'roundStart'],
                    player: ['enterGame', 'damageEnd', 'changeSkillsEnd'],
                    source: 'damageSource',
                },
                filter(event, player, name) {
                    if (name == 'roundStart' || name.startsWith('damage')) return lib.group.slice().removeArray(player.getStorage('bilibili_ziyuan')).length;
                    const list = game.filterPlayer().reduce((list, target) => list.add(target.group), []).removeArray(player.getStorage('bilibili_ziyuan'));
                    if (!list.length) return false;
                    if (event.name == 'changeSkills') return event.addSkill.includes('bilibili_ziyuan');
                    return event.name != 'phase' || game.phaseNumber == 0;
                },
                forced: true,
                async content(event, trigger, player) {
                    if (event.triggername == 'roundStart' || trigger.name.startsWith('damage')) {
                        const list = lib.group.slice().removeArray(player.getStorage(event.name));
                        if (!list.length) return;
                        const result = await player.chooseButton([
                            `${get.prompt(event.name)}：<div class='text center'>请选择要记录的势力</div>`,
                            [list.map(group => [group, get.translation(group)]), 'textbutton'],
                        ], true).forResult();
                        if (result?.links?.length) {
                            const [group] = result.links;
                            player.markAuto(event.name, [group]);
                            player.popup(`${group}2`, get.groupnature(group, 'raw'));
                        }
                    }
                    else {
                        const list = game.filterPlayer().reduce((list, target) => list.add(target.group), []).removeArray(player.getStorage(event.name));
                        list.sort((a, b) => lib.group.indexOf(a) - lib.group.indexOf(b));
                        player.markAuto(event.name, list);
                        await player.draw(list.length);
                    }
                    const next = game.createEvent('bilibili_beichen', false);
                    next.player = player;
                    next.setContent(lib.skill['bilibili_beichen'].content);
                    await next;
                },
                marktext: '垣',
                intro: { content: '已记录势力：$' },
                onremove: true,
                derivation: 'bilibili_beichen',
            },
            bilibili_beichen: {
                enable: 'phaseUse',
                usable: 1,
                filter(event, player) {
                    return player.getStorage('bilibili_ziyuan').length && typeof game.roundNumber == 'number';
                },
                prompt() {
                    const list = get.player().getStorage('bilibili_ziyuan');
                    return `你可以依次分配${get.translation(list)}势力的技能并令一名角色获得之直到其下一次以此法获得对应势力的技能`;
                },
                manualConfirm: true,
                async content(event, trigger, player) {
                    for (const group of player.getStorage('bilibili_ziyuan')) {
                        const num = game.roundNumber + 1;
                        if (!_status.characterlist) game.initCharacterList();
                        let list = _status.characterlist.filter(i => (get.character(i, 1) == group || (get.is.double(i, true) || []).includes(group)));
                        for (const current of game.players.concat(game.dead)) {
                            list.removeArray(get.nameList(current));
                        }
                        list = list.randomGets(num);
                        const map = {};
                        for (const name of list) {
                            let skills = (lib.character[name]?.skills ?? []).filter(skill => {
                                const info = get.info(skill);
                                return info && get.skillInfoTranslation(skill, player) /* && !info.zhuSkill && !info.limited && !info.juexingji && !info.hiddenSkill && !info.charlotte && !info.dutySkill */;
                            });
                            if (skills.length) map[name] = skills;
                        }
                        if (!Object.keys(map).length) continue;
                        const next = player.chooseButtonTarget({
                            createDialog: [
                                `北辰：请选择至多${get.cnNumber(num)}个技能令一名角色获得`,
                                [dialog => {
                                    dialog.css({ top: get.is.phoneLayout() ? '20%' : '25%' });
                                    const { characterMap: map } = get.event();
                                    for (const name of Object.keys(map)) {
                                        const table = document.createElement('div');
                                        table.classList.add('add-setting');
                                        table.style.margin = '0';
                                        table.style.width = '100%';
                                        table.style.position = 'relative';
                                        table.style.display = 'flex';
                                        table.style.justifyContent = 'flex-start';
                                        table.style.alignItems = 'center';
                                        const tdc = ui.create.button(name, 'character', table, true);
                                        for (const item in tdc.node) {
                                            if (item == 'name') {
                                                tdc.node.name.style.writingMode = 'horizontal-tb';
                                            } else {
                                                tdc.node[item].hide();
                                            }
                                        }
                                        tdc.style.height = '40px';
                                        lib.setIntro(tdc);
                                        const skills = map[name];
                                        for (let i = 0; i < skills.length; i++) {
                                            const td = ui.create.button([skills[i], get.translation(skills[i])], 'tdnodes', table);
                                            td.setNodeIntro(get.translation(skills[i]), get.skillInfoTranslation(skills[i], get.player()));
                                            dialog.buttons.add(td);
                                        }
                                        dialog.content.appendChild(table);
                                    }
                                }, 'handle'],
                            ],
                            selectButton: [1, num],
                            filterTarget: true,
                            ai1(button) {
                                const { link } = button;
                                const info = get.info(link);
                                if (info?.ai?.neg) return 0;
                                return 1 + Math.random();
                            },
                            ai2(target) {
                                const player = get.player();
                                const att = get.sgnAttitude(player, target);
                                if (att < 0) return 0;
                                return att * (target.hasSkill('bilibili_beichen_effect') ? 1 : 2);
                            }
                        }).set('characterMap', map).set('group', group);
                        next.set('targetprompt2', next.targetprompt2.concat([
                            target => {
                                if (!target.isIn() || !get.event().filterTarget(null, get.player(), target)) return false;
                                let str = '';
                                if (target.storage?.['bilibili_beichen_effect']?.[get.event().group]) {
                                    str += target.storage['bilibili_beichen_effect'][get.event().group].map(skill => get.translation(skill)).join('<br>');
                                }
                                return str;
                            },
                        ]));
                        const result = await next.forResult();
                        if (result?.links?.length && result.targets?.length) {
                            const skills = result.links;
                            const [target] = result.targets;
                            if (event.bilibili_beichen) {
                                await target.addSkills(skills);
                            }
                            else {
                                const effect = 'bilibili_beichen_effect';
                                target.addSkill(effect);
                                target.storage[effect] ??= {};
                                const skillsToRemove = [];
                                if (target.storage[effect][group]) skillsToRemove.addArray(target.storage[effect][group]);
                                target.storage[effect][group] = skills;
                                await target.changeSkills(skills, skillsToRemove).set('$handle', function (player, skillsToAdd, skillsToRemove) {
                                    if (skillsToRemove.length > 0) {
                                        player.removeSkillLog(skillsToRemove, get.event().popup);
                                    }
                                    if (skillsToAdd.length > 0) {
                                        game.log(player, '获得了技能', ...skillsToAdd.map(i => {
                                            if (get.event().popup) {
                                                player.popup(i);
                                            }
                                            return '#g【' + get.translation(i) + '】';
                                        }));
                                        if (!Array.isArray(player.additionalSkills['bilibili_beichen_effect'])) {
                                            player.additionalSkills['bilibili_beichen_effect'] = [];
                                        }
                                        for (var i = 0; i < skillsToAdd.length; i++) {
                                            player.addSkill(skillsToAdd[i], null, true, true);
                                            player.additionalSkills['bilibili_beichen_effect'].push(skillsToAdd[i]);
                                        }
                                        game.broadcast((player, map) => {
                                            player.additionalSkills = map;
                                        }, player, player.additionalSkills);
                                        player.checkConflict();
                                    }
                                    _status.event.clearStepCache();
                                });
                            }
                        }
                    }
                },
                ai: {
                    combo: 'bilibili_ziyuan',
                    order: 10,
                    result: { player: 1 },
                },
                subSkill: {
                    effect: {
                        charlotte: true,
                        onremove: true,
                        mark: true,
                        marktext: '辰',
                        intro: {
                            content(storage, player) {
                                if (!storage) return '暂未因〖北辰〗获得的非永久技能';
                                const entries = Object.entries(storage).sort(([a], [b]) => lib.group.indexOf(a) - lib.group.indexOf(b));
                                let str = '已因〖北辰〗获得的非永久技能：<br>';
                                for (const [key, skills] of entries) {
                                    str += `<li>${get.translation(key)}：${skills.map(skill => get.poptip(skill)).join('、')}`;
                                }
                                return str;
                            },
                        },
                    },
                },
            },
            bilibili_xingzhu: {
                getStr(player) {
                    let str = '你可以';
                    const num = game.countGroup();
                    const bool1 = player.hp != num;
                    if (player.maxHp != num) {
                        const numx = player.maxHp - num;
                        str += `${numx > 0 ? '减少' : '增加'}${Math.abs(numx)}点体力上限${bool1 ? '' : '，然后'}`;
                    }
                    if (bool1) {
                        const numx = player.hp - num;
                        str += `且${numx > 0 ? '失去' : '回复'}${Math.abs(numx)}点体力，然后`;
                    }
                    str += '发动一次永久保留技能的〖北辰〗并获得〖无极〗。';
                    return str;
                },
                enable: 'phaseUse',
                trigger: { player: 'dieBefore' },
                filter(event, player) {
                    return [player.maxHp, player.hp].some(num => num != game.countGroup());
                },
                skillAnimation: true,
                limited: true,
                animationColor: 'orange',
                check: () => true,
                prompt(event) {
                    const player = get.player();
                    return event.name == 'die' ? get.prompt('bilibili_xingzhu') : get.info('bilibili_xingzhu').getStr(player);
                },
                prompt2(event, player) {
                    return get.info('bilibili_xingzhu').getStr(player);
                },
                manualConfirm: true,
                async content(event, trigger, player) {
                    player.awakenSkill(event.name);
                    if (trigger) trigger.cancel();
                    const num = game.countGroup();
                    if (player.maxHp != num) {
                        const numx = player.maxHp - num;
                        await player[numx > 0 ? 'loseMaxHp' : 'gainMaxHp'](Math.abs(numx));
                    }
                    if (player.hp != num) {
                        const numx = player.hp - num;
                        await player[numx > 0 ? 'loseHp' : 'recover'](Math.abs(numx));
                    }
                    await player.addSkills('bilibili_wuji');
                    const next = game.createEvent('bilibili_beichen', false);
                    next.player = player;
                    next.bilibili_beichen = true;
                    next.setContent(lib.skill['bilibili_beichen'].content);
                    await next;
                },
                derivation: ['bilibili_wuji', 'bilibili_beichen'],
                ai: {
                    order: 10,
                    result: {
                        player(player) {
                            const num = game.countGroup();
                            if (player.maxHp < num) return 1;
                            if (player.getDamagedHp() > 2) return 1;
                            return 0;
                        },
                    },
                },
            },
            bilibili_wuji: {
                init(player, skill) {
                    player.addGaintag(player.getCards('h'), skill);
                    player.addTempSkill(`${skill}_clear`, 'roundStart');
                },
                onremove(player, skill) {
                    player.removeGaintag(skill);
                },
                trigger: { player: 'gainBegin' },
                forced: true,
                async content(event, trigger, player) {
                    if (trigger.name == 'gain') {
                        if (!Array.isArray(trigger.gaintag)) trigger.gaintag = [];
                        trigger.gaintag.add(event.name);
                    }
                    else player.addGaintag(player.getCards('h'), event.name);
                    player.addTempSkill(`${event.name}_clear`, 'roundStart');
                },
                group: 'bilibili_wuji_yingbian',
                subSkill: {
                    clear: {
                        charlotte: true,
                        onremove(player) {
                            player.removeGaintag('bilibili_wuji');
                        },
                    },
                    yingbian: {
                        trigger: { player: 'yingbian' },
                        filter(event, player) {
                            if (!Array.isArray(event.cards) || event.cards.length !== 1) return false;
                            return player.hasHistory('lose', evt => (evt.relatedEvent || evt.getParent()) == event && Object.values(evt.gaintag_map).flat().includes('bilibili_wuji'));
                        },
                        usable: 1,
                        forced: true,
                        async content(event, trigger, player) {
                            if (!Array.isArray(trigger.temporaryYingbian)) trigger.temporaryYingbian = [];
                            trigger.temporaryYingbian.add('force');
                            trigger.temporaryYingbian.addArray(get.yingbianEffects());
                        },
                    },
                },
            },
            //高望
            gaowangdead: {
                charlotte: true,
                trigger: { player: 'dieBefore' },
                silent: true,
                firstDo: true,
                forceDie: true,
                async content(event, trigger, player) {
                    player.changeSkin({ characterName: 'bilibili_gaowang' }, 'scs_gaowang_dead');
                },
            },
            //龙九帧
            bilibili_xingcan: {
                trigger: { player: ['phaseZhunbeiBegin', 'phaseJieshuBegin'] },
                async cost(event, trigger, player) {
                    const result = await player.chooseButton([
                        get.prompt2(event.skill),
                        [lib.suit.map(i => ['', '', `lukai_${i}`]), 'vcard'],
                    ]).set('ai', button => {
                        const player = get.player();
                        const suit = button.link[2].slice(6);
                        return Math.random();
                    }).forResult();
                    event.result = {
                        bool: result?.bool,
                        cost_data: result?.links,
                    }
                },
                async content(event, trigger, player) {
                    const suit = event.cost_data[0][2].slice(6);
                    player.popup(get.translation(suit));
                    game.log(player, '声明了', '#y' + get.translation(suit));
                    const next = player.judge(card => {
                        if (get.suit(card) === get.event().suitx) {
                            return 1.5;
                        }
                        return -1.5;
                    });
                    next.judge2 = result => result.bool;
                    next.set('suitx', suit);
                    const result = await next.forResult();
                    if (suit === result?.suit && game.hasPlayer(current => current != player)) {
                        const result = await player.chooseTarget('咏叹：你可以令一名其他角色翻面', lib.filter.notMe).set('ai', target => {
                            const player = get.player();
                            const att = get.attitude(player, target);
                            if (target.hasSkillTag('noturn')) return 0;
                            if (att < 0 && target.isTurnedOver()) return 0;
                            if (att > 2 && target.isTurnedOver()) return att * 10;
                            return -att;
                        }).forResult();
                        if (result?.targets?.length) {
                            const [target] = result.targets;
                            player.line(target);
                            await target.turnOver();
                        }
                    }
                },
            },
            bilibili_linglai: {
                trigger: { global: ['loseAfter', 'loseAsyncAfter', 'cardsDiscardAfter'] },
                filter(event, player) {
                    const cards = event.getd();
                    return cards.some(card => {
                        const id = card.cardid;
                        if (event.name !== 'cardsDiscard') {
                            if (!event.getl) return false;
                            return game.hasPlayer2(target => {
                                const cards2 = event.getl(target).cards2;
                                const evt = event.name === 'lose' ? event : target.getHistory('lose', evt2 => event === evt2.getParent())[0];
                                return evt && cards2.includes(card) && evt.gaintag_map[id]?.includes('bilibili_linglai_tag');
                            });
                        }
                        const evt = event.getParent();
                        if (evt.name !== 'orderingDiscard') return false;
                        const evtx = (evt.relatedEvent || evt.getParent());
                        return evtx.player.hasHistory('lose', evtxx => {
                            if (evtx !== (evtxx.relatedEvent || evtxx.getParent())) return false;
                            const cards2 = evtxx.getl(evtx.player).cards2;
                            return cards2.includes(card) && evtxx.gaintag_map[id]?.includes('bilibili_linglai_tag');
                        });
                    });
                },
                forced: true,
                locked: false,
                async content(event, trigger, player) {
                    const cards = trigger.getd();
                    await player.draw(cards.reduce((sum, card) => {
                        const id = card.cardid;
                        if (trigger.name !== 'cardsDiscard') {
                            sum += game.countPlayer2(target => {
                                const cards2 = trigger.getl(target).cards2;
                                const evt = trigger.name === 'lose' ? trigger : target.getHistory('lose', evt2 => trigger === evt2.getParent())[0];
                                return (evt && cards2.includes(card) && evt.gaintag_map[id]?.includes('bilibili_linglai_tag')) ? 1 : 0;
                            });
                        }
                        else {
                            const evt = trigger.getParent();
                            const evtx = (evt.relatedEvent || evt.getParent());
                            evtx.player.getHistory('lose', evtxx => {
                                if (evtx !== (evtxx.relatedEvent || evtxx.getParent())) return false;
                                const cards2 = evtxx.getl(evtx.player).cards2;
                                if (!cards2.includes(card) || !evtxx.gaintag_map[id]?.includes('bilibili_linglai_tag')) return false;
                                sum += ((evtxx.relatedEvent || evtxx.getParent()).name === 'useCard' ? 3 : 1);
                            });
                        }
                        return sum;
                    }, 0));
                },
                group: 'bilibili_linglai_effect',
                subSkill: {
                    effect: {
                        trigger: { global: 'phaseUseBegin' },
                        filter(event, player) {
                            return event.player.countCards('h') > 0;
                        },
                        async cost(event, trigger, player) {
                            const target = trigger.player, select = 1;
                            const prompt = `${get.translation(event.skill)}：标记${target === player ? '' : get.translation(target)}${select > 1 ? '各' : ''}${get.cnNumber(select)}张手牌`;
                            if (target === player) {
                                event.result = await player.chooseCard('h', true, [1, select]).set('ai', card => {
                                    return get.useful(card) * get.value(card);
                                }).set('prompt', prompt).forResult();
                            }
                            else {
                                event.result = await player.choosePlayerCard(target, 'visible', true, [1, select]).set('ai', button => {
                                    const card = button.link;
                                    return get.useful(card) * get.value(card);
                                }).set('prompt', prompt).forResult();
                            }
                        },
                        logTarget: 'player',
                        async content(event, trigger, player) {
                            const target = trigger.player;
                            target.addGaintag(event.cards, 'bilibili_linglai_tag');
                            if (target === player) target.addGaintag(event.cards, 'bilibili_linglai');
                        },
                    },
                },
            },
            bilibili_yongtan: {
                trigger: { player: 'useCardAfter' },
                filter(event, player) {
                    return player.isPhaseUsing() && game.hasPlayer(target => target !== player);
                },
                async cost(event, trigger, player) {
                    const result = await player.bilibili_chooseTargetControl({
                        prompt: get.prompt2(event.skill),
                        filterTarget: lib.filter.noeMe,
                        controls: Array.from({ length: 13 }).map((_, i) => i + 1),
                        ai1(target) {
                            const player = get.player();
                            return -get.attitude(player, target) * (1 + target.getHp());
                        },
                        ai2: () => get.rand(1, 13) - 1,
                    }).forResult();
                    if (result?.bool) {
                        event.result = {
                            bool: true,
                            targets: result.targets,
                            cost_data: result.index + 1,
                        };
                    }
                },
                async content(event, trigger, player) {
                    const target = event.targets[0], number = event.cost_data;
                    player.popup(get.strNumber(number));
                    game.log(player, '选择了', '#y' + get.strNumber(number), '点');
                    if (ui.cardPile.childElementCount > 0 && ['宿舍群', '肘击群', '活动群'].some(clan => target.hasClan(clan))) {
                        for (let i = 0; i < ui.cardPile.childElementCount; i++) {
                            const card = ui.cardPile.childNodes[i];
                            if ((get.number(card) === number) === get.nameList(target).includes('bilibili_ningjingzhiyuan')) {
                                ui.cardPile.removeChild(card);
                                ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
                                break;
                            }
                        }
                    }
                    const result = await target.judge(card => {
                        const number = get.event().getParent('bilibili_yongtan').cost_data ?? 0;
                        return get.number(card) === number ? -10 : 1;
                    }).set('judge2', result => result?.bool ? false : true).forResult();
                    if (!result.bool && target.getHp() > 0) await target.loseHp(target.getHp());
                },
            },
            //三人组
            bilibili_waifa: {
                trigger: { player: 'phaseUseBegin' },
                filter(event, player) {
                    return player.countCards('he', card => {
                        if (_status.connectMode && get.position(card) === 'h') return true;
                        return lib.filter.cardDiscardable(card, player);
                    }) >= 3;
                },
                async cost(event, trigger, player) {
                    event.result = await player.chooseToDiscard(get.prompt2(event.skill), 'he', [3, Infinity]).set('processAI', () => {
                        const player = get.player(), cards = player.getDiscardableCards(player, 'he', card => lib.skill.zhiheng.check(card) > 0);
                        const cards2 = cards.slice().sort((a, b) => get.value(a) - get.value(b)).slice(0, Math.floor(cards.length / 3) * 3);
                        return { bool: cards2.length > 0, cards: cards2 };
                    }).set('filterOk', () => ui.selected.cards.length % 3 === 0).set('logSkill', event.skill).forResult();
                },
                popup: false,
                async content(event, trigger, player) {
                    await player.draw(event.cards.length * 3);
                    for (const type of ['basic', 'trick', 'equip']) {
                        if (!event.cards.some(i => get.type2(i, player) === type)) continue;
                        const num = event.cards.filter(i => get.type2(i, player) !== type).length;
                        if (num > 0) {
                            player.addTempSkill(`${event.name}_${type}`);
                            player.addMark(`${event.name}_${type}`, num, false);
                        }
                    }
                },
                subSkill: {
                    basic: {
                        charlotte: true,
                        onremove(player, skill) {
                            delete player.storage[skill];
                            delete player.storage[`${skill}_count`];
                        },
                        marktext: '基',
                        intro: { content: '本回合使用的前#张基本牌无距离和次数限制' },
                        mod: {
                            cardUsable(card, player) {
                                if (get.type(card) === 'basic' && player.countMark('bilibili_waifa_basic_count') < player.countMark('bilibili_waifa_basic')) return Infinity;
                            },
                            targetInRange(card, player) {
                                if (get.type(card) === 'basic' && player.countMark('bilibili_waifa_basic_count') < player.countMark('bilibili_waifa_basic')) return true;
                            },
                        },
                        trigger: { player: 'useCard1' },
                        filter(event, player) {
                            return get.type(event.card) === 'basic' && player.countMark('bilibili_waifa_basic_count') < player.countMark('bilibili_waifa_basic');
                        },
                        forced: true,
                        popup: false,
                        async content(event, trigger, player) {
                            player.addMark(`${event.name}_count`, 1, false);
                            if (trigger.addCount !== false) {
                                trigger.addCount = false;
                                const stat = player.getStat();
                                if (typeof stat?.card?.[trigger.card.name] === 'number') stat.card[trigger.card.name]--;
                            }
                        },
                    },
                    trick: {
                        charlotte: true,
                        onremove(player, skill) {
                            delete player.storage[skill];
                            delete player.storage[`${skill}_count`];
                        },
                        marktext: '锦',
                        intro: { content: '本回合使用的前#张锦囊牌可以增加或减少至多#个目标' },
                        trigger: { player: 'useCard2' },
                        filter(event, player) {
                            return get.type2(event.card) === 'trick' && player.countMark('bilibili_waifa_trick_count') < player.countMark('bilibili_waifa_trick');
                        },
                        async cost(event, trigger, player) {
                            player.addMark(`${event.skill}_count`, 1, false);
                            if (lib.skill.neifa_nobasic.filter(trigger, player)) {
                                const num = player.countMark(event.skill);
                                event.result = await player.chooseTarget(get.prompt(event.skill), [1, num], (card, player, target) => {
                                    const trigger = get.event().getTrigger();
                                    if (trigger.targets.includes(target)) return true;
                                    return lib.filter.targetEnabled2(trigger.card, player, target) && lib.filter.targetInRange(trigger.card, player, target);
                                }, `为${get.translation(trigger.card)}增加或减少至多${num}个目标`).set('ai', target => {
                                    const player = get.player(), trigger = get.event().getTrigger();
                                    return get.effect(target, trigger.card, player, player) * (trigger.targets.includes(target) ? -1 : 1);
                                }).forResult();
                            }
                        },
                        async content(event, trigger, player) {
                            const targets = [...event.targets].sortBySeat();
                            for (const target of targets) {
                                const goon = trigger.targets.includes(target);
                                trigger.targets[goon ? 'remove' : 'push'](target);
                            }
                        },
                    },
                    equip: {
                        charlotte: true,
                        onremove(player, skill) {
                            delete player.storage[skill];
                            delete player.storage[`${skill}_count`];
                        },
                        marktext: '装',
                        intro: { content: '本回合使用前#张装备牌时摸#张牌' },
                        trigger: { player: 'useCard' },
                        filter(event, player) {
                            return get.type(event.card) === 'equip' && player.countMark('bilibili_waifa_equip_count') < player.countMark('bilibili_waifa_equip');
                        },
                        forced: true,
                        async content(event, trigger, player) {
                            player.addMark(`${event.name}_count`, 1, false);
                            await player.draw(player.countMark(event.name));
                        },
                    },
                },
            },
            //惇
            bilibili_ganglie: {
                audio: 'reganglie',
                trigger: {
                    source: 'damageBegin2',
                    player: 'damageEnd',
                },
                filter(event, player, name) {
                    return event[name === 'damageEnd' ? 'source' : 'player']?.isIn();
                },
                logTarget(event, player, name) {
                    return event[name === 'damageEnd' ? 'source' : 'player'];
                },
                check(event, player, name) {
                    if (name === 'damageEnd') return get.damageEffect(event.source, player, player) > 0;
                    _status._ganglie_check = true;
                    const target = event.player, num = Math.min(Math.max(1, player.getDamagedHp()), target.countDiscardableCards(player, 'he'));
                    const orieffect = get.damageEffect(target, player, player) * event.num;
                    const effect = get.effect(target, { name: 'guohe_copy2' }, player, player) * num + get.recoverEffect(target, player, player) * Math.max(1, num);
                    delete _status._ganglie_check;
                    return effect + orieffect > 0;
                },
                prompt2(event, player, name) {
                    const target = event[name === 'damageEnd' ? 'source' : 'player'], str = get.translation(target);
                    if (name === 'damageEnd') return `对${str}造成${event.num + (target.getHp() > player.getHp() ? 1 : 0)}点伤害`;
                    return `弃置${str}${get.cnNumber(Math.max(1, player.getDamagedHp()))}张牌，然后其回复1点体力，且你可以将其弃置的红色牌交给一名角色`;
                },
                async content(event, trigger, player) {
                    const target = event.targets[0];
                    if (event.triggername === 'damageEnd') {
                        await target.damage(trigger.num + (target.getHp() > player.getHp() ? 1 : 0));
                    }
                    else {
                        const result = await player.discardPlayerCard(Math.max(1, player.getDamagedHp()), target, 'he', true).forResult();
                        if (result?.bool && result.cards?.length) {
                            await target.recover();
                            const cards = result.cards.filter(card => get.color(card) === 'red' && get.position(card) === 'd');
                            if (cards.length > 0) {
                                const result2 = await player.chooseTarget(`是否令一名角色获得${get.translation(cards)}`).set('ai', card => {
                                    const { player, cards } = get.event();
                                    return Math.sign(get.attitude(player, target)) * cards.reduce((sum, card) => sum + get.value(card, target), 0);
                                }).set('cards', cards).forResult();
                                if (result2?.bool && result2.targets?.length) {
                                    const gainner = result2.targets[0];
                                    player.line(gainner);
                                    await gainner.gain(cards, 'gain2').set('giver', player);
                                }
                            }
                        }
                    }
                },
                ai: {
                    threaten: 0.6,
                    maixie: true,
                    effect: {
                        player(card, player, target) {
                            if (_status._ganglie_check || player.hasSkillTag('jueqing', false, target)) return;
                            if (get.type(card) !== 'delay' && get.tag(card, 'damage')) {
                                _status._ganglie_check = true;
                                const effect = get.effect(target, { name: 'guohe_copy2' }, player, player) * 2 + get.recoverEffect(target, player, player);
                                const effect2 = get.effect(target, { name: 'guohe_copy2' }, player, target) * 2 + get.recoverEffect(target, player, target);
                                delete _status._ganglie_check;
                                return [1, effect, 1, effect2];
                            }
                        },
                        target(card, player, target) {
                            if (player.hasSkillTag('jueqing', false, target)) return [1, -1.5];
                            if (target.hasFriend() && get.tag(card, 'damage')) return [1, 0, 0, -0.7];
                        },
                    },
                },
            },
            //结束专栏剩余的大差异蝶将
            //蝶设张华
            boljianhe: {
                audio: 'oljianhe',
                inherit: 'oljianhe',
                filterTarget: true,
                delay: 0,
                async content(event, trigger, player) {
                    const { cards, target } = event, type = get.type2(cards[0], player), num = event.cards.length - 1;
                    await player.recast(cards);
                    const result = await target.chooseCard(get.translation(player) + '对你发动了【剑合】', num, 'he', (card, player) => {
                        return get.type2(card) == _status.event.type && player.canRecast(card);
                    }, '重铸' + get.cnNumber(num) + '张' + get.translation(type) + '牌，或受到1点伤害').set('ai', card => {
                        if (!_status.event.goon) return 0;
                        return (get.type(card) == 'equip' ? 15 : 7) - get.value(card);
                    }).set('type', type).set('goon', get.damageEffect(target, player, target) < 0).forResult();
                    if (result?.bool && result.cards?.length) await target.recast(result.cards);
                    else await target.damage(player);
                    await game.delayx();
                },
                ai: {
                    order(item, player) {
                        return (player.hasSkill('bolbihun') && _status.currentPhase?.isIn() && player.getStorage('bolbihun_choosed').length < 3) ? 1 : 7;
                    },
                    expose: 0.1,
                    threaten: 3,
                    result: {
                        player: 1,
                        target(player, target) {
                            const cards = ui.selected.cards, type = get.type2(cards[0]);
                            const damage = get.damageEffect(target, player, target);
                            if (player === target) {
                                if (target.countCards('he', card => {
                                    return !cards.includes(card) && get.type(card) === type && get.value(card) < 6;
                                }) >= cards.length) return Math.max(2, damage);
                                return damage;
                            }
                            const he = target.getCards('he'), known = target.getKnownCards(player);
                            let num = { 'basic': 0.4, 'trick': 0.25, 'equip': 0.1 }[type] || 0;
                            if (known.filter(card => {
                                return get.type(card) === type && get.value(card) < 6;
                            }).length + (he - known.length) * num >= cards.length + 1) return Math.max(3, damage);
                            return damage;
                        },
                    },
                },
            },
            bolbihun: {
                audio: 'olbihun',
                trigger: { player: 'gainAfter' },
                filter(event, player) {
                    if (!_status.currentPhase?.isIn()) return false;
                    return event.getParent().name === 'draw' && player.getStorage('bolbihun_choosed').length < 3;
                },
                forced: true,
                async content(event, trigger, player) {
                    let choice = [
                        ['wuzhong', '摸两张牌'],
                        ['zhengu', `将手牌数弃置至${get.cnNumber(_status.currentPhase.getHandcardLimit())}张`],
                        ['zishou', '本回合不能对其他角色使用牌'],
                    ];
                    let restChoice = choice.map(i => i[0]).removeArray(player.getStorage('bolbihun_choosed'));
                    const result = restChoice.length > 1 ? await player.chooseButton([
                        `${get.translation(event.name)}：请选择一项`,
                        [choice, 'textbutton'],
                    ], true).set('filterButton', button => {
                        return !get.player().getStorage('bolbihun_choosed').includes(button.link);
                    }).set('ai', button => {
                        const player = get.player(), target = _status.currentPhase;
                        const { num, phaseList } = get.event().getTrigger('phase', true);
                        if (target !== player || !phaseList?.slice(num - phaseList.length).includes('phaseUse')) {
                            return 3 - ['wuzhong', 'zishou', 'zhengu'].indexOf(button.link);
                        }
                        let restChoice = ['wuzhong', 'zhengu', 'zishou'].removeArray(player.getStorage('bolbihun_choosed'));
                        const hand = player.countCards('h'), maxHand = player.getHandcardLimit(), delta = hand - maxHand;
                        const goon = player.hasCard(card => player.hasValueTarget(card, true, true), 'hs');
                        switch (button.link) {
                            case 'wuzhong':
                                if (restChoice.length === 1) return 1145141919810;
                                let wuzhong = 10;
                                if (hand <= maxHand - 1) wuzhong += 4;
                                if (hand >= maxHand) wuzhong -= 4;
                                wuzhong -= Math.max(0, delta) * 3;
                                return wuzhong;
                            case 'zhengu':
                                let zhengu = 5;
                                if (delta <= 0) return zhengu + 5;
                                if (delta === 1 && !goon) zhengu += 8;
                                zhengu -= delta * 4;
                                if (restChoice.includes('wuzhong')) zhengu += 2;
                                return zhengu;
                            case 'zishou':
                                return goon ? 2 : -10;
                        }
                    }).forResult() : { bool: true, links: restChoice };
                    if (result?.bool && result.links?.length) {
                        const choice = result.links[0];
                        player.addTempSkill('bolbihun_choosed');
                        player.markAuto('bolbihun_choosed', [choice]);
                        switch (choice) {
                            case 'wuzhong':
                                await player.draw(2);
                                break;
                            case 'zhengu':
                                const num = player.countCards('h') - _status.currentPhase.getHandcardLimit();
                                if (num > 0) await player.chooseToDiscard(num, true);
                                break;
                            case 'zishou':
                                player.addTempSkill('bolbihun_ban');
                                player.markAuto('bolbihun_ban', [player]);
                                break;
                        }
                    }
                },
                subSkill: {
                    choosed: {
                        charlotte: true,
                        onremove: true,
                    },
                    ban: {
                        charlotte: true,
                        onremove: true,
                        intro: { content: 'players' },
                        mod: {
                            playerEnabled(card, player, target) {
                                if (!player.getStorage('bolbihun_ban').includes(target)) return false;
                            },
                        },
                    },
                },
            },
            //蝶设韩融
            bollianhe: {
                audio: 'clanlianhe',
                enable: 'phaseUse',
                usable: 1,
                filter(event, player) {
                    return game.countPlayer(current => current => get.info('bollianhe').filterTarget(null, player, current)) > 1;
                },
                filterTarget(card, player, target) {
                    return !target.isLinked();
                },
                selectTarget: 2,
                multitarget: true,
                async content(event, trigger, player) {
                    event.choiceMap = new Map();
                    const targets = event.targets.sortBySeat();
                    const bool = event.name != 'bollianhe_choice';
                    if (bool) {
                        for (const target of targets) {
                            await target.link(true);
                        }
                    }
                    const map = await game.chooseAnyOL(targets, get.info('bollianhe').chooseButtonx, [player]).forResult();
                    const list = [[], []];
                    for (const target of targets) {
                        target.addExpose(0.05);
                        const choice = map.get(target).links?.[0];
                        event.choiceMap.set(target, choice == 'draw' ? 1 : 2);
                        const str = get.translation(player);
                        const controls = { 'draw': `令${str}摸一张牌`, 'gain': `令${str}获得其一张牌并翻面` }[choice];
                        game.log(target, '选择了', '#y' + controls);
                        if (choice == 'draw') {
                            list[0].push(target);
                        } else {
                            list[1].push(target);
                        }
                    }
                    if (list[0].length) {
                        for (const target of list[0].sortBySeat()) {
                            target.line(player);
                            await player.draw();
                        }
                    }
                    if (list[1].length) {
                        for (const target of list[1].sortBySeat()) {
                            target.line(player);
                            await player.gainPlayerCard(target, 'he', true);
                            await player.turnOver();
                        }
                    }
                    if (bool) {
                        for (const target of targets) {
                            target.addSkill(event.name + '_effect');
                            target.markAuto(event.name + '_effect', [player]);
                        }
                    }
                },
                chooseButtonx(player, source, eventId) {
                    const str = get.translation(source);
                    return player.chooseButton([
                        '连和：请选择一项',
                        [[
                            ['draw', `令${str}摸一张牌`],
                            ['gain', `令${str}获得你一张牌并翻面`]
                        ], 'textbutton']
                    ], true).set('filterButton', button => {
                        const { player, source } = get.event();
                        return button.link != 'gain' || player.countGainableCards(source, player !== source ? 'he' : 'e');
                    }).set('ai', button => {
                        const { player, source } = get.event();
                        const target = get.event().getParent().player;
                        const link = button.link;
                        const att = get.attitude(player, source);
                        if (link == 'draw' && att > 0) return 1;
                        if (link == 'gain') {
                            if (!source.isTurnedOver() && att < 0) return 2;
                            if (source.isTurnedOver() && att > 0) return 2;
                            return get.event().getRand();
                        }
                        return 1;
                    }).set('source', source).set('id', eventId).set('_global_waiting', true);
                },
                ai: {
                    order: 7.5,
                    result: {
                        player: 1,
                        target(player, target) {
                            if (!ui.selected.targets.length && player == target) return 1;
                            return -1;
                        },
                    },
                },
                subSkill: {
                    effect: {
                        charlotte: true,
                        onremove: true,
                        intro: { content: 'players' },
                        trigger: { player: 'phaseUseEnd' },
                        forced: true,
                        popup: false,
                        async content(event, trigger, player) {
                            const targets = player.getStorage(event.name);
                            player.removeSkill(event.name);
                            let count = 0;
                            player.checkHistory('gain', evt => {
                                if (evt.getParent(trigger.name) !== trigger) return;
                                count += evt.cards.length;
                            });
                            count = Math.min(5, count);
                            for (const source of targets.sortBySeat()) {
                                if (!source.isIn()) continue;
                                let num = 0;
                                while (num <= count) {
                                    const next = game.createEvent('bollianhe_choice');
                                    next.player = source;
                                    next.targets = [player];
                                    next.setContent(lib.skill.bollianhe.content);
                                    await next;
                                    num += next.choiceMap.get(player);
                                }
                            }
                        },
                    }
                }
            },
            bolhuanjia: {
                audio: 'clanhuanjia',
                enable: 'phaseUse',
                usable: 1,
                filter(event, player) {
                    return game.hasPlayer(current => get.info('bolhuanjia').filterTarget(null, player, current));
                },
                filterTarget(card, player, target) {
                    return player.canCompare(target);
                },
                async content(event, trigger, player) {
                    const { target } = event;
                    const result = await player.chooseToCompare(target).forResult();
                    if (result?.winner?.isIn() && result.winner.hasSex('male')) {
                        const { winner } = result;
                        winner.addSkill(event.name + '_effect')
                        winner.markAuto(event.name + '_effect', [event.getParent()]);
                    }
                },
                ai: {
                    order: 8,
                    result: {
                        target(player, target) {
                            return -1;
                        },
                    },
                },
                subSkill: {
                    effect: {
                        charlotte: true,
                        onremove: true,
                        mark: true,
                        intro: { content: '下次发动“出牌阶段限一次”的技能后复原之' },
                        trigger: { player: ['useSkillAfter', 'logSkill'] },
                        filter(event, player) {
                            if (event.type != 'player') return false;
                            if (player.getStorage('bolhuanjia_effect').includes(event)) return false;
                            const skill = get.sourceSkillFor(event);
                            const info = get.info(skill);
                            if (info.charlotte) return false;
                            const translation = get.skillInfoTranslation(skill, event.player);
                            if (!translation) return false;
                            const match = get.plainText(translation).match(/“?出牌阶段限一次/g);
                            if (!match || match.every(value => value != "出牌阶段限一次")) return false;
                            return true;
                        },
                        forced: true,
                        popup: false,
                        async content(event, trigger, player) {
                            player.removeSkill(event.name);
                            player.refreshSkill(get.sourceSkillFor(trigger));
                        }
                    }
                }
            },
            bolxumin: {
                audio: 'clanxumin',
                inherit: 'clanxumin',
                filterTarget(card, player, target) {
                    return target.countCards('h') < player.countCards('h') && player.canUse(card, target);
                },
                filterCard: () => false,
                selectCard: -1,
                async precontent(event, trigger, player) {
                    player.logSkill(event.result.skill);
                    player.awakenSkill(event.result.skill);
                    await player.turnOver();
                },
            },
            //蝶设韩韶
            bolfangzhen: {
                audio: 'clanfangzhen',
                enable: 'phaseUse',
                usable: 1,
                filter(event, player) {
                    return game.hasPlayer(current => get.info('bolfangzhen').filterTarget(null, player, current));
                },
                filterTarget(card, player, target) {
                    return !target.isLinked();
                },
                async content(event, trigger, player) {
                    const { target } = event;
                    await target.link(true);
                    const num1 = Math.min(5, target.getSeatNum());
                    const num2 = player.getAllHistory('useSkill', evt => evt.skill == event.name).length;
                    await player.drawTo(num1);
                    if (player.countCards('he') && player != target) await player.chooseToGive(target, `你可以交给${get.translation(target)}任意张牌`, 'he', 'allowChooseAll', [1, Infinity]).set('ai', card => {
                        const { player, target } = get.event();
                        const att = get.attitude(player, target);
                        if (att > 0) return 6 - get.value(card);
                        return 0;
                    });
                    if (num1 == num2) await player.turnOver();
                },
                ai: {
                    order: 6,
                    result: {
                        target(player, target) {
                            return target.getSeatNum() * get.sgnAttitude(player, target);
                        },
                    },
                }
            },
            bolliuju: {
                audio: 'clanliuju',
                getList(player) {
                    const skills = game.expandSkills(player.getStockSkills(true, true));
                    const resetSkills = [], suffixs = ['used', 'round', 'block', 'blocker', 'sunben'];
                    for (const skill of skills) {
                        const info = get.info(skill);
                        if (info.usable !== undefined) {
                            if (typeof player.getStat('triggerSkill')[skill] == 'number' && player.getStat('triggerSkill')[skill] >= 1) {
                                resetSkills.add(skill);
                            }
                            if (typeof player.getStat('skill')[skill] == 'number' && player.getStat('skill')[skill] >= 1) {
                                resetSkills.add(skill);
                            }
                        }
                        if (info.round && player.storage[skill + '_roundcount']) {
                            resetSkills.add(skill);
                        }
                        if (player.storage[`temp_ban_${skill}`]) {
                            resetSkills.add(skill);
                        }
                        if (player.awakenedSkills.includes(skill)) {
                            resetSkills.add(skill);
                        }
                        for (const suffix of suffixs) {
                            if (player.hasSkill(skill + '_' + suffix)) {
                                resetSkills.add(skill);
                            }
                        }
                    }
                    return resetSkills;
                },
                enable: 'phaseUse',
                usable: 1,
                filter(event, player) {
                    return game.hasPlayer(current => get.info('bolhuanjia').filterTarget(null, player, current));
                },
                filterTarget(card, player, target) {
                    return player.canCompare(target);
                },
                async content(event, trigger, player) {
                    const { target } = event;
                    const result = await player.chooseToCompare(target).set('small', true).forResult();
                    let cards = [];
                    game.getGlobalHistory('cardMove', evt => {
                        if (evt.getParent(2).name === 'chooseToCompare' && evt.getParent(3) === event) {
                            cards.addArray(evt.cards.filter(card => {
                                return get.position(card, true) == 'd' && get.type(card, null, false) != 'basic';
                            }));
                        }
                    });
                    event.distance = [get.distance(player, target), get.distance(target, player)];
                    cards = cards.filter(card => get.position(card, true) == 'd' && player.hasUseTarget(card));
                    while (cards.length) {
                        const result = await player.chooseButton(['留驹：是否使用其中的一张牌？', cards]).set('filterButton', button => {
                            return get.player().hasUseTarget(button.link);
                        }).set('ai', button => {
                            return get.player().getUseValue(button.link) + 0.1;
                        }).forResult();
                        if (result?.bool) {
                            const card = result.links[0];
                            cards.remove(card);
                            player.$gain2(card, false);
                            await game.delayx();
                            await player.chooseUseTarget(true, card, false);
                        }
                        else break;
                    }
                    const bool1 = !result?.tie && player !== result.winner;
                    const bool2 = get.distance(player, target) != event.distance[0] || get.distance(target, player) != event.distance[1];
                    if (bool1 || bool2) {
                        const goon = player.isTurnedOver() || player.isLinked();
                        const resetSkills = get.info(event.name).getList(player);
                        if (!goon && !resetSkills.length) return;
                        const list = resetSkills.map(skill => [
                            skill,
                            '<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">' +
                            (() => {
                                let str = get.translation(skill);
                                if (!lib.skill[skill]?.nobracket) {
                                    str = '【' + str + '】';
                                }
                                return str;
                            })() +
                            '</div><div>' +
                            lib.translate[skill + '_info'] +
                            '</div></div>',
                        ]);
                        const result = await player.chooseButton([
                            '留驹：复原武将牌或武将牌上的一个技能',
                            [['复原武将牌'].concat(list), 'textbutton'],
                        ], true).set('filterButton', button => {
                            const player = get.player();
                            if (button.link == '复原武将牌') {
                                return player.isLinked() || player.isTurnedOver()
                            }
                            return true;
                        }).set('resetSkills', resetSkills).set('ai', button => {
                            const player = get.player();
                            if (button.link == '复原武将牌') {
                                if (player.isTurnedOver()) return 2;
                                return 0.5;
                            }
                            return 1;
                        }).set('direct', true).forResult();
                        if (result?.links?.length) {
                            const [link] = result.links;
                            const bool = resetSkills.includes(link);
                            if (bool) player.refreshSkill(link);
                            else {
                                game.log(player, '选择了', '#g复原武将牌');
                                await player.turnOver(false);
                                await player.link(false);
                            }
                        }
                    }
                },
                ai: {
                    order: 8,
                    result: {
                        target(player, target) {
                            return -1;
                        },
                    },
                },
            },
            //吴新建
            bilibili_ranzhi: {
                trigger: { player: 'phaseUseBegin' },
                filter(event, player) {
                    return player.hasUseTarget(new lib.element.VCard({ name: 'huogong' }));
                },
                locked: true,
                async cost(event, trigger, player) {
                    const prompt = `${get.translation(event.skill)}：请选择【火攻】的目标`;
                    const next = player.chooseUseTarget(new lib.element.VCard({ name: 'huogong' }), true, false, prompt);
                    next.logSkill = event.skill;
                    player.addTempSkill(`${event.skill}_add`);
                    player.markAuto(`${event.skill}_add`, [next]);
                    event.result = await next.forResult();
                    event.result.cost_data = next;
                },
                popup: false,
                async content(event, trigger, player) {
                    let num = 0;
                    player.getHistory('sourceDamage', evt => {
                        if (evt.card && player.hasHistory('useCard', evt2 => evt2.getParent() === event.cost_data && evt2.card === evt.card)) num += evt.num;
                    });
                    if (num > 0) {
                        await player.recover(num);
                        if (player.getHp() > 0) await player.draw(player.getHp());
                    }
                },
                subSkill: {
                    add: {
                        charlotte: true,
                        onremove: true,
                        trigger: { global: ['useCard2', 'chooseToDiscardBegin'] },
                        filter(event, player) {
                            const evt = event.getParent({ 'useCard': 1, 'chooseToDiscard': 3 }[event.name]);
                            if (!player.getStorage('bilibili_ranzhi_add').includes(evt)) return false;
                            switch (event.name) {
                                case 'useCard':
                                    return !event.targets.includes(player) && lib.filter.targetEnabled2(event.card, event.player, player);
                                case 'chooseToDiscard':
                                    return event.player.hasCard(card => event.filterCard(card, event.player), event.discardPostion ?? 'h');
                            }
                        },
                        silent: true,
                        async content(event, trigger, player) {
                            switch (trigger.name) {
                                case 'useCard':
                                    trigger.targets.add(player);
                                    game.log(player, '成为了', trigger.card, '的额外目标');
                                    break;
                                case 'chooseToDiscard':
                                    trigger.forced = true;
                                    break;
                            }
                        },
                    },
                },
            },
            bilibili_wuying: {
                trigger: { player: 'phaseBegin' },
                filter(event, player) {
                    return game.countPlayer(target => target !== player) > 1;
                },
                async cost(event, trigger, player) {
                    event.result = await player.chooseTarget(get.prompt2(event.skill), lib.filter.notMe, 2).set('ai', target => {
                        const player = get.player(), att = Math.sign(get.attitude(player, target));
                        if (att === 0) return false;
                        const dis = get.distance(player, target, 'absolute'), max = game.countPlayer() - 1;
                        if (!ui.selected.targets.length) return att < 0 ? dis : (max - dis);
                        const target1 = ui.selected.targets[0];
                        if (Math.sign(get.attitude(player, target1)) === att) return 0;
                        return att * (get.distance(player, target, 'absolute') - get.distance(player, target1, 'absolute'));
                    }).forResult();
                },
                async content(event, trigger, player) {
                    const targets = event.targets;
                    if (Math.random() > Math.random()) {
                        game.broadcastAll((target1, target2) => {
                            game.swapSeat(target1, target2);
                        }, ...targets);
                    }
                    else {
                        for (const target of targets) {
                            player.markAuto('zhibi', [target]);
                            target.markAuto('zhibi', [player]);
                            let count = 0;
                            while (count < 10) {
                                count++;
                                target.throwEmotion(player, target.getEnemies().includes(player) ? 'flower' : 'egg');
                            }
                        }
                    }
                },
            },
            bilibili_jiabin: {
                trigger: {
                    player: 'loseAfter',
                    global: ['loseAsyncAfter', 'equipAfter', 'addJudgeAfter', 'gainAfter', 'addToExpansionAfter'],
                },
                filter(event, player) {
                    if (event.name === 'equip' && event.player === player && event.card.name === 'bilibili_jiabinzheng') return true;
                    const evt = event.getl?.(player);
                    return evt?.es?.some(card => {
                        const VEquip = evt.vcard_map.get(card);
                        return VEquip && VEquip.name === 'bilibili_jiabinzheng';
                    });
                },
                forced: true,
                async content(event, trigger, player) {
                    if (trigger.name === 'equip' && trigger.player === player && trigger.card.name === 'bilibili_jiabinzheng') {
                        await player.recover();
                        await player.draw();
                    }
                    const evt = trigger.getl?.(player);
                    const cards = evt?.es?.filter(card => {
                        const VEquip = evt.vcard_map.get(card);
                        return VEquip && VEquip.name === 'bilibili_jiabinzheng';
                    }) ?? [];
                    if (cards.length) await player.loseHp(cards.length);
                },
                group: 'bilibili_jiabin_init',
                subSkill: {
                    init: {
                        trigger: {
                            global: 'phaseBefore',
                            player: 'enterGame',
                        },
                        filter(event, player) {
                            if (!Array.from({ length: 5 }).map((_, i) => `equip${i + 1}`).some(subtype => {
                                const card = get.autoViewAs(game.createCard2('bilibili_jiabinzheng', 'spade', 13));
                                card.subtypes = [subtype];
                                return player.canEquip(card);
                            })) return false;
                            return event.name !== 'phase' || game.phaseNumber === 0;
                        },
                        forced: true,
                        async content(event, trigger, player) {
                            while (true) {
                                const subtype = Array.from({ length: 5 }).map((_, i) => `equip${i + 1}`).filter(subtype => {
                                    const card = get.autoViewAs(game.createCard2('bilibili_jiabinzheng', 'spade', 13));
                                    card.subtypes = [subtype];
                                    return player.canEquip(card);
                                })[0];
                                if (!subtype) break;
                                const card = get.autoViewAs(game.createCard2('bilibili_jiabinzheng', 'spade', 13));
                                card.subtypes = [subtype];
                                if (player.canEquip(card)) await player.equip(card);
                                else break;
                            }
                        },
                    },
                },
            },
            //曹操
            bilibili_hanhuang: {
                trigger: {
                    player: 'bilibili_hanhuang_initEnd',
                    global: ['damageSource', 'loseEnd', 'loseAsyncEnd', 'equipEnd', 'addJudgeEnd', 'gainEnd', 'addToExpansionEnd'],
                },
                filter(event, player) {
                    if (!player.getStorage('bilibili_hanhuang_init').length) return false;
                    if (event.name === 'damage') {
                        return event.source?.isIn() && (event.source === player || player.getStorage('bilibili_hanhuang_init').includes(event.source));
                    }
                    return game.hasPlayer2(target => {
                        if (target !== player && !player.getStorage('bilibili_hanhuang_init').includes(target)) return false;
                        if (event.name === 'bilibili_hanhuang_init') return true;
                        if (event.name === 'equip' && event.player === target && get.subtypes(event.card).includes('equip1')) return true;
                        const evt = event.getl(target);
                        return evt?.hs.length > 0 || evt?.es.some(card => {
                            const vcard = card[card.cardSymbol];
                            return vcard && get.subtypes(vcard).includes('equip1');
                        }) || event.getg(target).length > 0;
                    });
                },
                forced: true,
                popup: false,
                forceDie: true,
                async content(event, trigger, player) {
                    const targets = game.filterPlayer2(target => {
                        if (target !== player && !player.getStorage('bilibili_hanhuang_init').includes(target)) return false;
                        if (trigger.name === 'damage') return trigger.source !== target;
                        if (trigger.name === 'bilibili_hanhuang_init') return true;
                        if (trigger.name === 'equip' && trigger.player === target && get.subtypes(trigger.card).includes('equip1')) return true;
                        const evt = trigger.getl?.(target);
                        return evt?.hs.length > 0 || evt?.es.some(card => {
                            const vcard = card[card.cardSymbol];
                            return vcard && get.subtypes(vcard).includes('equip1');
                        }) || trigger.getg(target).some(card => get.owner(card) === target && get.position(card) === 'h');
                    }).sortBySeat();
                    if (trigger.name === 'damage') {
                        player.logSkill('bilibili_hanhuang', targets);
                        await game.asyncDraw(targets);
                        await game.delayx();
                        return;
                    }
                    for (const target of targets) {
                        let currents = [player];
                        if (target === player) currents = player.getStorage('bilibili_hanhuang_init');
                        const evt = trigger.getl?.(target), id = target.playerid, skill = `bilibili_hanhuang_${id}`;
                        if (!lib.translate[skill]) {
                            game.broadcastAll((player, skill) => {
                                lib.translate[skill] = get.translation(player);
                            }, target, skill);
                        }
                        for (const current of currents) {
                            if (trigger.name === 'bilibili_hanhuang_init') {
                                const cardsx = target.getCards('h').map(card => {
                                    const cardx = ui.create.card();
                                    cardx.init(get.cardInfo(card));
                                    cardx._cardid = card;
                                    return cardx;
                                });
                                if (cardsx.length > 0) current.directgains(cardsx, null, skill);
                                const equipsx = target.getVEquips(1);
                                if (equipsx.length > 0) {
                                    for (const vcard of equipsx) {
                                        current.markAuto('bilibili_hanhuang', vcard);
                                        const name = vcard.name;
                                        current.addExtraEquip('bilibili_hanhuang', [name], true);
                                        const skills = lib.card[name].skills ?? [];
                                        if (skills.length) current.addAdditionalSkill('bilibili_hanhuang', skills, true);
                                    }
                                }
                                continue;
                            }
                            if (evt) {
                                if (evt.hs.length) {
                                    const cards = current.getCards('s', card => card.hasGaintag(skill) && evt.hs.includes(card._cardid));
                                    if (cards.length) {
                                        game.broadcastAll((player, cards) => {
                                            cards.forEach(i => i.delete());
                                            if (player === game.me) ui.updatehl();
                                        }, current, cards);
                                    }
                                }
                                if (evt.es.some(card => {
                                    const vcard = card[card.cardSymbol];
                                    return vcard && get.subtypes(vcard).includes('equip1');
                                })) {
                                    const list = evt.es.filter(card => {
                                        const vcard = card[card.cardSymbol];
                                        return vcard && get.subtypes(vcard).includes('equip1');
                                    }).map(card => card[card.cardSymbol]);
                                    current.unmarkAuto('bilibili_hanhuang', list);
                                    list.forEach(({ name }) => {
                                        current.removeExtraEquip('bilibili_hanhuang', name);
                                        const skills = lib.card[name].skills ?? [];
                                        if (skills.length) skills.forEach(skill => current.removeAdditionalSkill('bilibili_hanhuang', skill));
                                    });
                                }
                            }
                            if (trigger.name === 'equip' && trigger.player === target && get.subtypes(trigger.card).includes('equip1')) {
                                current.markAuto('bilibili_hanhuang', [trigger.card]);
                                const name = trigger.card.name;
                                current.addExtraEquip('bilibili_hanhuang', [name], true);
                                const skills = lib.card[name].skills ?? [];
                                if (skills.length) current.addAdditionalSkill('bilibili_hanhuang', skills, true);
                            }
                            if (trigger.getg(target).some(card => get.owner(card) === target && get.position(card) === 'h')) {
                                const cardsx = trigger.getg(target).filter(card => {
                                    return get.owner(card) === target && get.position(card) === 'h';
                                }).map(card => {
                                    const cardx = ui.create.card();
                                    cardx.init(get.cardInfo(card));
                                    cardx._cardid = card;
                                    return cardx;
                                });
                                current.directgains(cardsx, null, skill);
                            }
                        }
                    }
                },
                onremove(player, skill) {
                    const targets = player.getStorage('bilibili_hanhuang_init').slice();
                    if (player.storage['bilibili_hanhuang_init']) {
                        player.unmarkSkill('bilibili_hanhuang_init');
                        delete player.storage['bilibili_hanhuang_init'];
                    }
                    for (const current of [player, ...targets].sortBySeat()) {
                        const cards = current.getCards('s', card => {
                            if (!card._cardid) return false;
                            return card.gaintag?.some(gaintag => gaintag.startsWith('bilibili_hanhuang_'));
                        });
                        if (cards.length) {
                            game.broadcastAll((player, cards) => {
                                cards.forEach(i => i.delete());
                                if (player === game.me) ui.updatehl();
                            }, current, cards);
                        }
                        if (current.storage[skill]) {
                            delete current.storage[skill];
                            current.removeExtraEquip(skill);
                            current.removeAdditionalSkill(skill);
                        }
                    }
                },
                group: 'bilibili_hanhuang_init',
                global: 'bilibili_hanhuang_use',
                subSkill: {
                    use: {
                        mod: {
                            cardUsable(card, player) {
                                let card2 = card;
                                if (card.cards) {
                                    if (card.cards.length !== 1) return;
                                    card2 = card.cards[0];
                                }
                                if (get.itemtype(card2) !== 'card' || !card2._cardid) return;
                                if (player.hasSkill('bilibili_hanhuang') || card2.gaintag?.some(gaintag => {
                                    if (!gaintag.startsWith('bilibili_hanhuang_')) return false;
                                    const target = ((_status.connectMode ? lib.playerOL : game.playerMap)[gaintag.slice('bilibili_hanhuang_'.length)]);
                                    return get.itemtype(target) === 'player' || target.hasSkill('bilibili_hanhuang');
                                })) return Infinity;
                            },
                            targetInRange(card, player) {
                                let card2 = card;
                                if (card.cards) {
                                    if (card.cards.length !== 1) return;
                                    card2 = card.cards[0];
                                }
                                if (get.itemtype(card2) !== 'card' || !card2._cardid) return;
                                if (player.hasSkill('bilibili_hanhuang') || card2.gaintag?.some(gaintag => {
                                    if (!gaintag.startsWith('bilibili_hanhuang_')) return false;
                                    const target = ((_status.connectMode ? lib.playerOL : game.playerMap)[gaintag.slice('bilibili_hanhuang_'.length)]);
                                    return get.itemtype(target) === 'player' || target.hasSkill('bilibili_hanhuang');
                                })) return true;
                            },
                            attackRange(player, num) {
                                return num + player.getEquipRange(player.getStorage('bilibili_hanhuang'));
                            },
                        },
                        trigger: { player: ['useCardBefore', 'respondBefore', 'useCard1'] },
                        filter(event, player, name) {
                            if (name === 'useCard1') {
                                if (event.addCount === false || !event.cards || event.cards.length !== 1) return false;
                                return event._bilibili_hanhuang;
                            }
                            return event.cards?.some(card => {
                                if (!card._cardid) return false;
                                return card.gaintag?.some(gaintag => gaintag.startsWith('bilibili_hanhuang_'));
                            });
                        },
                        forced: true,
                        popup: false,
                        forceDie: true,
                        async content(event, trigger, player) {
                            if (event.triggername === 'useCard1') {
                                trigger.addCount = false;
                                const stat = player.getStat().card, name = trigger.card.name;
                                if (typeof stat[name] === 'number') stat[name]--;
                                return;
                            }
                            if (trigger.name === 'useCard') trigger._bilibili_hanhuang = true;
                            trigger.cards = trigger.card.cards = trigger.cards.map(card => {
                                if (card._cardid && card.gaintag?.some(gaintag => gaintag.startsWith('bilibili_hanhuang_'))) return card._cardid;
                                return card;
                            });
                        },
                    },
                    init: {
                        trigger: {
                            global: 'phaseBefore',
                            player: 'enterGame',
                        },
                        filter(event, player) {
                            if (!game.hasPlayer(target => {
                                if (target === player) return false;
                                const mode = get.mode();
                                return mode === 'identity' || mode === 'guozhan' || player.getFriends().includes(target);
                            }));
                            return event.name !== 'phase' || game.phaseNumber === 0;
                        },
                        forced: true,
                        async content(event, trigger, player) {
                            const result = await player.chooseTarget(`${get.translation(event.name)}：请选择一名角色`, (card, player, target) => {
                                if (target === player) return false;
                                const mode = get.mode();
                                return mode === 'identity' || mode === 'guozhan' || player.getFriends().includes(target);
                            }, true).set('ai', target => {
                                const player = get.player();
                                return get.attitude(player, target);
                            }).forResult();
                            if (result?.bool && result.targets?.length) {
                                const target = result.targets[0];
                                player.line(target);
                                player.markAuto('bilibili_hanhuang_init', [target]);
                            }
                        },
                        intro: { content: 'players' },
                    },
                },
            },
            //奶龙
            bilibili_lianbing: {
                trigger: {
                    global: 'phaseBefore',
                    player: ['enterGame', 'changeSkillsAfter'],
                },
                filter(event, player) {
                    if (event.name === 'changeSkills' && !event.addSkill.includes('bilibili_lianbing')) return false;
                    return event.name !== 'phase' || game.phaseNumber === 0;
                },
                forced: true,
                locked: false,
                async content(event, trigger, player) {
                    if (!_status.characterlist) game.initCharacterList();
                    let list = _status.characterlist.slice();
                    for (const target of [...game.players, ...game.dead]) {
                        if (target !== player) list.push(get.nameList(target));
                    }
                    list = list.filter(name => {
                        if (!(lib.character[name]?.skills ?? []).length) return false;
                        return name !== 'bilibili_zhugeliang' && (get.rawName(name) === '诸葛亮' || get.rawName2(name) === '诸葛亮');
                    });
                    if (list.length > 0) {
                        const name = list.randomGet();
                        player.flashAvatar(event.name, name);
                        await player.addAdditionalSkills(event.name, lib.character[name].skills);
                        await game.delay(3);
                    }
                    const target = await game.addPlayerOL(player, 'bilibili_shibing', null, true, { animate: false });
                    if (get.itemtype(target) !== 'player') return;
                    game.addGlobalSkill('autoswap');
                    game.broadcastAll((player, target) => {
                        target.bilibili_lianbingOwner = player;
                        target._trueMe = player;
                        target.identity = 'bilibili_shibing';
                        const bgImage = player.node?.avatar?.style?.backgroundImage;
                        if (bgImage) {
                            const matches = bgImage.matchAll(/url\(["']?([^"')]+)["']?\)/g);
                            let onload = false;
                            for (const match of matches) {
                                const src = match[1];
                                if (match[1]) {
                                    const testImg = new Image();
                                    testImg.onload = function () {
                                        if (onload) return;
                                        onload = true;
                                        const node = target.node.identity.firstChild;
                                        node.innerHTML = '';
                                        node.style.width = '30px';
                                        node.style.height = '30px';
                                        node.style.backgroundImage = `url(${src})`;
                                        node.style.backgroundSize = '120% auto';
                                        node.style.backgroundPosition = '50% 10%';
                                        node.style.borderRadius = '50%';
                                    };
                                    testImg.src = src;
                                    if (onload) break;
                                }
                            }
                        }
                        if (target.ai) {
                            target.ai.identity_mark = 'finished';
                            if (typeof player.ai?.shown === 'number') target.ai.shown = player.ai.shown;
                        }
                        target.dieAfter = function () { };
                        if (typeof player.side === 'boolean') target.side = player.side;
                        target.ai.modAttitudeFrom = function (from, to) {
                            if (to === from.bilibili_lianbingOwner) return 114514;
                            return get.attitude(from.bilibili_lianbingOwner || from, to.bilibili_lianbingOwner || to);
                        };
                        target.ai.modAttitudeTo = function (from, to, att) {
                            if (from === to.bilibili_lianbingOwner) return 114514;
                            return get.attitude(from.bilibili_lianbingOwner || from, to.bilibili_lianbingOwner || to);
                        };
                        if (target.$update) {
                            const origin_update = target.$update;
                            target.$update = function (...args) {
                                const player = origin_update.call(this, ...args);
                                const skill = 'bilibili_tongshuai', hp = player.node.hp;
                                if (hp) {
                                    const num = player.countMark(skill);
                                    hp.innerHTML = `${num}<br><img style=width:18px src=${lib.assetURL}image/card/danqi_hufu.png>`;
                                }
                                if (player.hasMark(skill) && player.isOut()) game.broadcastAll(player => player.classList.remove('out'), player);
                                if (!player.hasMark(skill) && player.isIn()) game.broadcastAll(player => player.classList.add('out'), player);
                                return player;
                            };
                            target.update();
                        }
                        if (_status._bilibili_lianbingOwner) return;
                        _status.bilibili_lianbingOwner = true;
                        //检测游戏胜负
                        if (typeof game.checkResult === 'function') {
                            const origin_checkResult = game.checkResult;
                            game.checkResult = function () {
                                const player = game.me._trueMe || game.me;
                                if (game.players.filter(i => i !== player).every(i => i.bilibili_lianbingOwner === (player.bilibili_lianbingOwner || player))) game.over(true);
                                return origin_checkResult.apply(this, arguments);
                            };
                        }
                        if (typeof game.checkOnlineResult === 'function') {
                            const origin_checkOnlineResult = game.checkOnlineResult;
                            game.checkOnlineResult = function (player) {
                                if (game.players.filter(i => i !== player).every(i => i.bilibili_lianbingOwner === (player.bilibili_lianbingOwner || player))) return true;
                                return origin_checkOnlineResult.apply(this, arguments);
                            };
                        }
                        //敌友判定
                        //实际上只是友方，敌方不用写
                        if (typeof lib.element.player.getFriends === 'function') {
                            const origin_getFriends = lib.element.player.getFriends;
                            const getFriends = function (func, includeDie) {
                                const player = this;
                                return [
                                    ...origin_getFriends.apply(this, arguments),
                                    ...game[includeDie ? 'filterPlayer2' : 'filterPlayer'](target => {
                                        return (target.bilibili_lianbingOwner || target) === (player.bilibili_lianbingOwner || player);
                                    }),
                                ].filter(i => i !== player || func === true).unique().sortBySeat(player);
                            };
                            lib.element.player.getFriends = getFriends;
                            [...game.players, ...game.dead].forEach(i => (i.getFriends = getFriends));
                        }
                        if (typeof lib.element.player.isFriendOf === 'function') {
                            const origin_isFriendOf = lib.element.player.isFriendOf;
                            const isFriendOf = function (player) {
                                if ((this.bilibili_lianbingOwner || this) === (player.bilibili_lianbingOwner || player)) return true;
                                return origin_isFriendOf.apply(this, arguments);
                            };
                            lib.element.player.isFriendOf = isFriendOf;
                            [...game.players, ...game.dead].forEach(i => (i.isFriendOf = isFriendOf));
                        }
                        if (typeof lib.element.player.getEnemies === 'function') {
                            const origin_getEnemies = lib.element.player.getEnemies;
                            const getEnemies = function (func, includeDie) {
                                if (this.bilibili_lianbingOwner) return this.bilibili_lianbingOwner.getEnemies(func, includeDie);
                                else {
                                    const player = this;
                                    return [
                                        ...origin_getEnemies.apply(this, arguments),
                                        ...game[includeDie ? 'filterPlayer2' : 'filterPlayer'](target => {
                                            return origin_getEnemies.apply(this, arguments).includes(target.bilibili_lianbingOwner || target);
                                        }),
                                    ].filter(i => player != (i.bilibili_lianbingOwner || i)).unique().sortBySeat(player);
                                }
                            };
                            lib.element.player.getEnemies = getEnemies;
                            [...game.players, ...game.dead].forEach(i => (i.getEnemies = getEnemies));
                        }
                    }, player, target);
                    target.$draw(4);
                    target.directgain(get.cards(4));
                    for (let i = 1; i <= 5; i++) {
                        while (target.hasEmptySlot(i)) {
                            const card = get.cardPile2(card => get.subtypes(card).includes(`equip${i}`) && target.canEquip(card));
                            if (card) await target.equip(card);
                            else break;
                        }
                    }
                    player.addSkill(`${event.name}_clear`);
                    player.markAuto(event.name, [target]);
                },
                group: 'bilibili_lianbing_bingfu',
                subSkill: {
                    bingfu: {
                        trigger: {
                            player: 'loseAfter',
                            global: ['loseAsyncAfter', 'equipAfter', 'addJudgeAfter', 'gainAfter', 'addToExpansionAfter'],
                        },
                        filter(event, player) {
                            if (!player.getStorage('bilibili_lianbing').some(target => target.isAlive())) return false;
                            return event.getl?.(player)?.cards2?.some(card => get.suit(card, player) === 'diamond' || get.suit(card, player) === 'club');
                        },
                        forced: true,
                        logTarget(event, player) {
                            return player.getStorage('bilibili_lianbing').filter(target => target.isAlive()).sortBySeat();
                        },
                        line: false,
                        async content(event, trigger, player) {
                            const num = trigger.getl(player).cards2.filter(card => get.suit(card, player) === 'diamond' || get.suit(card, player) === 'club').length;
                            for (const target of event.targets) target.addMark('bilibili_tongshuai', num);
                        },
                    },
                    clear: {
                        charlotte: true,
                        trigger: { player: 'die' },
                        filter(event, player) {
                            return player.getStorage('bilibili_lianbing').some(target => target.isAlive());
                        },
                        forced: true,
                        forceDie: true,
                        popup: false,
                        async content(event, trigger, player) {
                            for (const target of player.getStorage('bilibili_lianbing')) {
                                if (target.isAlive()) {
                                    const cards = target.getCards('hejsx');
                                    while (cards.length) ui.discardPile.appendChild(cards.shift());
                                    await game.removePlayerOL(target, { animate: false });
                                }
                            }
                        },
                    },
                },
            },
            //士兵
            bilibili_tongshuai: {
                charlotte: true,
                init(player, skill) {
                    const desc = Object.getOwnPropertyDescriptor(player.storage, skill);
                    if (!desc?.get || !desc.set) {
                        player.storage[`${skill}_copy`] ??= 1;
                        Object.defineProperty(player.storage, skill, {
                            get() {
                                return this[`${skill}_copy`];
                            },
                            set(num) {
                                this[`${skill}_copy`] = num;
                                player.update();
                            },
                            configurable: true,
                            enumerable: true,
                        });
                    }
                },
                trigger: {
                    global: 'dieAfter',
                    player: 'changeHpBefore',
                },
                forced: true,
                popup: false,
                async content(event, trigger, player) {
                    if (trigger.name === 'changeHp') {
                        trigger.setContent(lib.skill.bilibili_tongshuai.changeHp);
                        return;
                    }
                    if (!_status._bilibili_tongshuai_list) {
                        if (!_status.characterlist) game.initCharacterList();
                        game.broadcastAll(() => {
                            _status._bilibili_tongshuai_list = _status.characterlist.map(i => lib.character[i]?.skills ?? []).unique();
                            _status._bilibili_tongshuai_list = _status._bilibili_tongshuai_list.filter(skill => {
                                const info = lib.skill[skill];
                                return info && !info.charlotte && !!(lib.translate[`${skill}_info`] ?? '').length;
                            });
                        });
                    }
                    let list = _status._bilibili_tongshuai_list.slice();
                    list.removeArray(player.additionalSkills[event.name] ?? []);
                    for (const target of [...game.players, ...game.dead]) list.removeArray(target.getSkills(null, null, false));
                    if (list.length) {
                        const skill = list.randomGet();
                        await player.addAdditionalSkills(event.name, skill, true);
                        if (player.additionalSkills[event.name].length > 2) {
                            const result = await player.chooseButton([
                                `${get.translation(event.name)}：技能槽已满，请选择你要失去的技能`,
                                [player.additionalSkills[event.name].map(skill => {
                                    return [
                                        skill,
                                        '<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">【' + get.translation(skill) + '】</div><div>' + lib.translate[skill + '_info'] + '</div></div>',
                                    ];
                                }), 'textbutton'],
                            ], true, player.additionalSkills[event.name].length - 2).set('ai', button => {
                                return -get.skillRank(button.link);
                            }).forResult();
                            if (result?.bool && result.links?.length) await player.removeSkills(result.links);
                        }
                    }
                },
                async changeHp(event, trigger, player) {
                    event.originalMaxHp = player.maxHp;
                    event.changedMaxHp = event.changedHp = 0;
                    game.getGlobalHistory().changeHp.push(event);
                    if (event.num < 0 && player.hujia > 0 && event.getParent().name === 'damage' && !player.hasSkillTag('nohujia') && !event.getParent().nohujia) {
                        event.hujia = Math.min(-event.num, player.hujia);
                        event.getParent().hujia = event.hujia;
                        event.num += event.hujia;
                        player.changeHujia(-event.hujia).type = 'damage';
                    }
                    if (event.num < 0) player.removeMark('bilibili_tongshuai', -event.num);
                },
            },
            //马钧
            bilibili_qiaosi: {
                audio: 'qiaosi',
                inherit: 'qiaosi',
                async content(event, trigger, player) {
                    await Promise.all(event.next);
                    event.videoId = lib.status.videoId++;
                    if (player.isUnderControl()) game.swapPlayerAuto(player);
                    const switchToAuto = function () {
                        game.pause();
                        game.countChoose();
                        setTimeout(function () {
                            _status.imchoosing = false;
                            event._result = {
                                bool: true,
                                links: ['qiaosi_c1', 'qiaosi_c6'].concat(['qiaosi_c2', 'qiaosi_c3', 'qiaosi_c4', 'qiaosi_c5'].randomGets(1)),
                            };
                            if (event.dialog) event.dialog.close();
                            if (event.controls) {
                                for (const i of event.controls) i.close();
                            }
                            game.resume();
                        }, 5000);
                    };
                    const createDialog = function (player, id) {
                        if (player == game.me) return;
                        const str = get.translation(player) + '正在表演...<br>';
                        for (let i = 1; i < 7; i++) {
                            str += get.translation('qiaosi_c' + i);
                            if (i % 3 != 0) str += '　　';
                            if (i == 3) str += '<br>';
                        }
                        ui.create.dialog(str, 'forcebutton').videoId = id;
                    };
                    //来自橙续缘《娱乐补丁》，进行适配
                    const chooseButton = function () {
                        const event = _status.event;
                        const { promise, resolve } = Promise.withResolvers();
                        event.status = {
                            qiaosi_c1: 0,
                            qiaosi_c2: 0,
                            qiaosi_c3: 0,
                            qiaosi_c4: 0,
                            qiaosi_c5: 0,
                            qiaosi_c6: 0,
                        };
                        event.map = {
                            qiaosi_c1: [40, 60],
                            qiaosi_c2: [80, 120],
                            qiaosi_c3: [90, 110],
                            qiaosi_c4: [90, 110],
                            qiaosi_c5: [80, 120],
                            qiaosi_c6: [40, 60],
                        };
                        event.finishedx = [];
                        const items = [
                            { name: '王', rotate: 4, max: 36, id: 'qiaosi_c1' },
                            { name: '商', rotate: 8, max: 24, id: 'qiaosi_c2' },
                            { name: '工', rotate: 12, max: 12, id: 'qiaosi_c3' },
                            { name: '农', rotate: 12, max: 12, id: 'qiaosi_c4' },
                            { name: '士', rotate: 8, max: 24, id: 'qiaosi_c5' },
                            { name: '将', rotate: 4, max: 36, id: 'qiaosi_c6' },
                        ];
                        let finished = false;
                        let timeoutId = null;
                        let aiTimer = null;
                        let resizeObserver = null;
                        const baseWidth = 700;
                        const baseHeight = 400;
                        event.dialog = ui.create.dialog('hidden');
                        event.dialog.classList.add('popped');
                        event.dialog.classList.add('static');
                        const dialog = event.dialog;
                        dialog.style.position = 'fixed';
                        dialog.style.width = '80%';
                        dialog.style.height = '80%';
                        dialog.style.left = '50%';
                        dialog.style.top = '50%';
                        dialog.style.transform = 'translate(-50%, -50%)';
                        dialog.style.padding = '0';
                        dialog.style.margin = '0';
                        dialog.style.background = 'transparent';
                        dialog.style.border = 'none';
                        dialog.style.boxShadow = 'none';
                        dialog.style.overflow = 'hidden';
                        dialog.style.textAlign = 'left';
                        dialog.style.zIndex = '10';
                        ui.window.appendChild(dialog);
                        dialog.innerHTML = '';
                        const container = document.createElement('div');
                        container.style.position = 'absolute';
                        container.style.width = baseWidth + 'px';
                        container.style.height = baseHeight + 'px';
                        container.style.left = '50%';
                        container.style.top = '50%';
                        container.style.transform = 'translate(-50%, -50%)';
                        container.style.transformOrigin = 'center center';
                        container.style.background = '#c6aa8f';
                        container.style.border = '2px solid #b6996d';
                        container.style.borderRadius = '8px';
                        container.style.boxSizing = 'border-box';
                        container.style.overflow = 'hidden';
                        container.style.display = 'flex';
                        container.style.justifyContent = 'center';
                        dialog.appendChild(container);
                        const gameBackground = document.createElement('div');
                        gameBackground.style.position = 'absolute';
                        gameBackground.style.left = '0';
                        gameBackground.style.top = '0';
                        gameBackground.style.width = '100%';
                        gameBackground.style.height = '100%';
                        gameBackground.style.background = 'radial-gradient(circle at center, #dfc59d 0%, #c6aa8f 55%, #a98b67 100%)';
                        gameBackground.style.borderRadius = '6px';
                        gameBackground.style.boxSizing = 'border-box';
                        gameBackground.style.pointerEvents = 'none';
                        gameBackground.style.zIndex = '10';
                        container.appendChild(gameBackground);
                        const title = document.createElement('div');
                        title.textContent = '水转百戏图';
                        title.style.position = 'absolute';
                        title.style.left = '0';
                        title.style.top = '8px';
                        title.style.width = '100%';
                        title.style.height = '35px';
                        title.style.lineHeight = '35px';
                        title.style.textAlign = 'center';
                        title.style.color = '#5a4028';
                        title.style.fontFamily = 'xinwei';
                        title.style.fontSize = '26px';
                        title.style.fontWeight = 'bold';
                        title.style.zIndex = '10';
                        title.style.pointerEvents = 'none';
                        container.appendChild(title);
                        const updateScale = () => {
                            if (!dialog.parentNode) return;
                            const scaleX = dialog.clientWidth / baseWidth;
                            const scaleY = dialog.clientHeight / baseHeight;
                            const scale = Math.min(scaleX, scaleY);
                            container.style.transform = 'translate(-50%, -50%) scale(' + scale + ')';
                            dialog.gameScale = scale;
                        };
                        updateScale();
                        if (typeof ResizeObserver !== 'undefined') {
                            resizeObserver = new ResizeObserver(updateScale);
                            resizeObserver.observe(dialog);
                        } else {
                            window.addEventListener('resize', updateScale);
                        }
                        const colorPrimary = '#705a3c';
                        const colorBorder = '#b6996d';
                        const colorProcess = '#1e281a';
                        container.style.width = baseWidth + 'px';
                        container.style.height = baseHeight + 'px';
                        const processHeight = baseHeight * 0.45;
                        const time = 1.5;//水柱动画时间
                        items.forEach(link => {
                            const item = document.createElement('div');
                            item.style.width = baseWidth / items.length + 'px';
                            item.style.flex = '0 0 ' + baseWidth / items.length + 'px';
                            item.style.height = baseHeight + 'px';
                            item.style.position = 'relative';
                            item.style.boxSizing = 'border-box';
                            item.style.zIndex = '10';
                            const actionSize = baseWidth / 6 / 5;
                            const action = document.createElement('div');
                            action.style.width = actionSize + 'px';
                            action.style.height = actionSize + 'px';
                            action.style.position = 'absolute';
                            action.style.borderRadius = '100%';
                            action.style.backgroundColor = colorPrimary;
                            action.style.border = '3px solid ' + colorBorder;
                            action.style.top = 'calc(50% + ' + processHeight / 2 + 'px)';
                            action.style.left = '50%';
                            action.style.transform = 'translate(-50%, -50%)';
                            action.style.cursor = 'pointer';
                            action.style.transition = 'transform 1.5s';
                            action.style.zIndex = '10';
                            action.style.boxSizing = 'border-box';
                            const anchorHeight = actionSize / 5;
                            const anchor = document.createElement('div');
                            anchor.style.width = actionSize + 'px';
                            anchor.style.height = anchorHeight + 'px';
                            anchor.style.position = 'absolute';
                            anchor.style.backgroundColor = colorPrimary;
                            anchor.style.borderTop = '2px solid ' + colorBorder;
                            anchor.style.borderBottom = '1px solid ' + colorBorder;
                            anchor.style.top = 'calc(50% - ' + anchorHeight / 2 + 'px)';
                            anchor.style.left = '50%';
                            anchor.style.boxSizing = 'border-box';
                            const anchorBefore = document.createElement('div');
                            anchorBefore.style.width = anchorHeight + 'px';
                            anchorBefore.style.height = anchorHeight + 'px';
                            anchorBefore.style.position = 'absolute';
                            anchorBefore.style.borderRadius = '100%';
                            anchorBefore.style.backgroundColor = colorPrimary;
                            anchorBefore.style.border = '2px solid ' + colorBorder;
                            anchorBefore.style.left = -anchorHeight / 2 - 2 + 'px';
                            anchorBefore.style.top = -anchorHeight / 2 - 2 + 'px';
                            anchorBefore.style.boxSizing = 'border-box';
                            const anchorAfter = document.createElement('div');
                            anchorAfter.style.width = actionSize / 2 + 'px';
                            anchorAfter.style.height = anchorHeight * 1.5 + 'px';
                            anchorAfter.style.position = 'absolute';
                            anchorAfter.style.backgroundColor = colorPrimary;
                            anchorAfter.style.border = '2px solid ' + colorBorder;
                            anchorAfter.style.top = 'calc(50% - ' + (anchorHeight * 1.5) / 2 + 2 + 'px)';
                            anchorAfter.style.left = '50%';
                            anchorAfter.style.boxSizing = 'border-box';
                            anchor.appendChild(anchorBefore);
                            anchor.appendChild(anchorAfter);
                            action.appendChild(anchor);
                            const process = document.createElement('div');
                            const processSpan = document.createElement('div');
                            process.style.position = 'absolute';
                            process.style.width = actionSize * (link.rotate / 16) + 'px';
                            process.style.height = processHeight + 'px';
                            process.style.backgroundColor = colorProcess;
                            process.style.borderLeft = '2px solid ' + colorBorder;
                            process.style.borderRight = '2px solid ' + colorBorder;
                            process.style.boxSizing = 'border-box';
                            process.style.top = '50%';
                            process.style.marginTop = -processHeight / 2 + 'px';
                            process.style.left = '50%';
                            process.style.transform = 'translateX(-50%)';
                            process.style.overflow = 'hidden';
                            processSpan.style.position = 'absolute';
                            processSpan.style.left = '0';
                            processSpan.style.bottom = '0';
                            processSpan.style.width = '100%';
                            processSpan.style.height = '0';
                            processSpan.style.background = 'linear-gradient(107deg, #6bbcd1, #c4ebf5)';
                            processSpan.style.transition = `all ${time}s`;
                            processSpan.style.overflow = 'hidden';
                            processSpan.style.backgroundSize = '200% 200%';
                            processSpan.style.animation = 'qiaosiGradientBackground 5s ease infinite';
                            const wave1 = document.createElement('div');
                            wave1.style.position = 'absolute';
                            wave1.style.bottom = '90%';
                            wave1.style.left = '55%';
                            wave1.style.width = '235px';
                            wave1.style.height = '195px';
                            wave1.style.borderRadius = '50%';
                            wave1.style.background = 'rgba(255,255,255,0.5)';
                            wave1.style.boxSizing = 'border-box';
                            wave1.style.transform = 'translateX(-50%) rotate(0)';
                            wave1.style.animation = 'qiaosiWave 6s linear infinite';
                            wave1.style.pointerEvents = 'none';
                            const wave2 = document.createElement('div');
                            wave2.style.position = 'absolute';
                            wave2.style.bottom = '90%';
                            wave2.style.left = '55%';
                            wave2.style.width = '75px';
                            wave2.style.height = '45px';
                            wave2.style.borderRadius = '30%';
                            wave2.style.boxSizing = 'border-box';
                            wave2.style.transform = 'translateX(-50%) rotate(0)';
                            wave2.style.animation = 'qiaosiWave 10s linear infinite';
                            wave2.style.pointerEvents = 'none';
                            processSpan.appendChild(wave1);
                            processSpan.appendChild(wave2);
                            process.appendChild(processSpan);
                            const contentSize = actionSize * 1.2;
                            const content = document.createElement('div');
                            content.style.position = 'absolute';
                            content.style.width = contentSize + 'px';
                            content.style.height = contentSize + 'px';
                            content.style.left = 'calc(50% - ' + contentSize / 2 + 'px)';
                            content.style.top = 60 + actionSize - 8 + 'px';
                            content.style.boxSizing = 'border-box';
                            const contentBefore = document.createElement('div');
                            contentBefore.style.position = 'absolute';
                            contentBefore.style.left = '0';
                            contentBefore.style.top = '0';
                            contentBefore.style.width = contentSize + 'px';
                            contentBefore.style.height = contentSize + 'px';
                            contentBefore.style.backgroundColor = colorPrimary;
                            contentBefore.style.border = '2px solid ' + colorBorder;
                            contentBefore.style.transform = 'rotate(45deg)';
                            contentBefore.style.boxSizing = 'border-box';
                            const contentText = document.createElement('span');
                            contentText.innerHTML = link.name;
                            contentText.style.position = 'absolute';
                            contentText.style.width = '100%';
                            contentText.style.height = '100%';
                            contentText.style.textAlign = 'center';
                            contentText.style.lineHeight = contentSize + 'px';
                            contentText.style.fontWeight = 'bold';
                            contentText.style.fontFamily = 'xinwei';
                            contentText.style.fontSize = '20px';
                            contentText.style.zIndex = '10';
                            content.appendChild(contentBefore);
                            content.appendChild(contentText);
                            item.appendChild(action);
                            item.appendChild(process);
                            item.appendChild(content);
                            container.appendChild(item);
                            action.link = link;
                            action.rotate = 0;
                            action.disabled = false;
                            action.processSpan = processSpan;
                            action.style.transform = 'translateX(-50%) rotate(0deg)';
                            const click = () => {
                                if (finished) return;
                                if (action.disabled) return;
                                if (action.rotate === link.max) return;
                                action.rotate += link.rotate;
                                action.rotate = Math.min(action.rotate, link.max);
                                event.status[link.id] = action.rotate;
                                action.processSpan.style.height = (100 * action.rotate) / link.max + '%';
                                action.style.transform = 'translateX(-50%) rotate(' + (360 * action.rotate) / 12 + 'deg)';
                                action.disabled = true;
                                if (action.rotate === link.max && event.finishedx.length < 3) {
                                    event.finishedx.push(link.id);
                                    if (event.finishedx.length >= 3) setTimeout(finish, (time + 1) * 1000);
                                }
                            };
                            link.click = click;
                            action.addEventListener(lib.device ? 'touchend' : 'click', e => {
                                e.preventDefault();
                                e.stopPropagation();
                                click();
                            });
                            action.addEventListener('transitionend', () => {
                                action.disabled = false;
                            });
                        });
                        const style = document.createElement('style');
                        style.textContent = [
                            '@keyframes qiaosiWave {',
                            '0% {',
                            'transform: translateX(-50%) rotate(0deg);',
                            '}',
                            '50% {',
                            'transform: translateX(-50%) rotate(180deg);',
                            '}',
                            '100% {',
                            'transform: translateX(-50%) rotate(360deg);',
                            '}',
                            '}',
                            '@keyframes qiaosiGradientBackground {',
                            '0% {',
                            'background-position: 0% 50%;',
                            '}',
                            '50% {',
                            'background-position: 100% 50%;',
                            '}',
                            '100% {',
                            'background-position: 0% 50%;',
                            '}',
                            '}',
                        ].join('\n');
                        document.head.appendChild(style);
                        function finish(delay = 0) {
                            if (finished) return;
                            finished = true;
                            if (timeoutId) {
                                clearTimeout(timeoutId);
                                timeoutId = null;
                            }
                            if (aiTimer) {
                                clearInterval(aiTimer);
                                aiTimer = null;
                            }
                            if (resizeObserver) {
                                resizeObserver.disconnect();
                                resizeObserver = null;
                            } else {
                                window.removeEventListener('resize', updateScale);
                            }
                            if (style.parentNode) {
                                style.parentNode.removeChild(style);
                            }
                            setTimeout(() => {
                                _status.imchoosing = false;
                                event._result = {
                                    bool: event.finishedx.length > 0,
                                    links: event.finishedx.slice(0),
                                };
                                event.dialog?.close();
                                resolve(event._result);
                                game.resume();
                            }, delay);
                        }
                        event.switchToAuto = () => {
                            if (finished) return;
                            finish();
                        };
                        if (_status.connectMode) timeoutId = setTimeout(finish, 25000);
                        _status.imchoosing = true;
                        game.pause();
                        game.countChoose();
                        return promise;
                    };
                    game.broadcastAll(createDialog, player, event.videoId);
                    let next;
                    if (event.isMine()) next = chooseButton();
                    else if (event.isOnline()) {
                        const { promise, resolve } = Promise.withResolvers();
                        event.player.send(chooseButton);
                        event.player.wait(async result => {
                            if (result === 'ai') result = await switchToAuto();
                            resolve(result);
                        });
                        game.pause();
                        next = promise;
                    }
                    else next = switchToAuto();
                    const result2 = await next;
                    game.broadcastAll('closeDialog', event.videoId);
                    if (!result2?.bool || !result2.links?.length) {
                        player.chat('杯具', 'fire');
                        game.log(player, '表演失败');
                        return;
                    }
                    player.chat('洗具', 'wood');
                    let list = result2.links, cards = [], list2 = [];
                    if (list.includes('qiaosi_c1')) {
                        list2.push('trick');
                        list2.push('trick');
                    }
                    if (list.includes('qiaosi_c2')) {
                        if (list.includes('qiaosi_c6')) list2.push(['sha', 'jiu']);
                        else list2.push(Math.random() < 0.66 ? 'equip' : ['sha', 'jiu']);
                    }
                    if (list.includes('qiaosi_c3')) list2.push([Math.random() < 0.66 ? 'sha' : 'jiu']);
                    if (list.includes('qiaosi_c4')) list2.push([Math.random() < 0.66 ? 'shan' : 'tao']);
                    if (list.includes('qiaosi_c5')) {
                        if (list.includes('qiaosi_c1')) list2.push(['shan', 'tao']);
                        else list2.push(Math.random() < 0.66 ? 'trick' : ['shan', 'tao']);
                    }
                    if (list.includes('qiaosi_c6')) {
                        list2.push('equip');
                        list2.push('equip');
                    }
                    while (list2.length) {
                        let card, filter = list2.shift();
                        card = get.cardPile(x => {
                            if (cards.includes(x)) return false;
                            if (typeof filter == 'string' && get.type(x, 'trick') == filter) return true;
                            if (typeof filter == 'object' && filter.includes(x.name)) return true;
                        });
                        if (card) cards.push(card);
                        else {
                            card = get.cardPile(x => !cards.includes(x));
                            if (card) cards.push(card);
                        }
                    }
                    if (cards.length > 0) {
                        const num = cards.length;
                        await player.showCards(cards, `${get.translation(player)}发动了【${get.translation(event.name)}】`);
                        await player.gain(cards, 'gain2');
                        const goon = player.countCards('he') > 0 && game.hasPlayer(current => current !== player);
                        const bool = player.hasCard(card => lib.filter.cardDiscardable(card, player), 'he');
                        if (!goon && !bool) return;
                        let result3;
                        if (!goon) result3 = { index: 1 };
                        else if (!bool) result3 = { index: 0 };
                        else {
                            result3 = await player.chooseControl({
                                prompt: `${get.translation(event.name)}：请选择一项`,
                                controls: ['交出卡牌', '弃置卡牌'],
                                choiceList: [`将${get.cnNumber(num)}张牌交给一名其他角色`, `弃置${get.cnNumber(num)}张牌`],
                                ai() {
                                    const player = get.player();
                                    return game.hasPlayer(current => current !== player && get.attitude(player, current) > 2) ? 0 : 1;
                                },
                            }).forResult();
                        }
                        if (typeof result3.index !== 'number') return;
                        if (result3.index == 0) {
                            const result = await player.chooseCardTarget({
                                prompt: `${get.translation(event.name)}：将${get.cnNumber(num)}张牌交给一名其他角色`,
                                filterCard: true,
                                selectCard: Math.min(num, player.countCards('he')),
                                position: 'he',
                                filterTarget: lib.filter.notMe,
                                forced: true,
                                ai1: () => 1 + Math.random(),
                                ai2(target) {
                                    const player = get.player();
                                    let att = get.attitude(player, target);
                                    if (target.hasSkillTag('nogain')) att /= 10;
                                    if (target.hasJudge('lebu')) att /= 5;
                                    return att;
                                },
                            }).forResult();
                            if (result?.bool && result.targets?.length && result.cards?.length) {
                                const target = result.targets[0];
                                player.line(target);
                                await player.give(result.cards, target);
                            }
                        }
                        else await player.chooseToDiscard('he', num, true, 'allowChooseAll');
                    }
                },
            },
        },
        dynamicTranslate: {
            bilibili_xueji(player) {
                var storage = player.storage.bilibili_xueji;
                if (storage) return '转换技，每轮开始时。阴：你可以失去1点体力，令一名角色于本轮第一次造成的伤害+1。<span class="bluetext">阳：你可以失去1点体力上限，并视为使用一张【杀】，若此【杀】造成伤害，你摸两张牌</span>。';
                return '转换技，每轮开始时。<span class="bluetext">阴：你可以失去1点体力，令一名角色于本轮第一次造成的伤害+1</span>。阳：你可以失去1点体力上限，并视为使用一张【杀】，若此【杀】造成伤害，你摸两张牌。';
            },
            BTdunshi(player) {
                var info = player.storage.BTdunshi;
                var str = '每回合限一次。你可以视为使用或打出一张';
                var list = ['sha', 'shan', 'tao', 'jiu'];
                for (var i of list) {
                    var strx = '【' + get.translation(i) + '】';
                    if (!info || !info[0].includes(i)) strx = ('<span style="text-decoration: line-through;">' + strx + '</span>');
                    str += strx;
                    if (i != 'jiu') str += '/';
                }
                str += '，然后当前回合角色于本回合内下一次造成伤害时，你选择两项：⒈防止此伤害，然后你从技能名中包含“仁/义/礼/智/信”字样的技能中选择一个当前回合角色未拥有的技能，令其获得你选择的技能；⒉从〖遁世〗中删除你本次使用或打出的牌名；⒊减1点体力上限并摸X张牌（X为你因〖遁世〗删除牌名数的牌）。';
                return str;
            },
            BTxinsheng(player) {
                var num = player.countMark('BTxinsheng');
                if (num == 0) return lib.translate.BTxinsheng_info;
                return lib.translate['BTxinsheng_' + num + '_info'];
            },
            old_lieshi(player) {
                var str = '①受到1点火焰伤害；②弃置手牌中的所有【闪】；③弃置手牌中的所有【杀】';
                if (player.storage.old_huanyin) str = '①弃置手牌中的所有【杀】；②弃置手牌中的所有【闪】；③受到1点火焰伤害';
                return '你可以将你场上的牌当作场上没有的延时锦囊牌使用并执行一项，然后令目标角色执行后一项：『 ' + str + '』。';
            },
            old_dianzhan(player) {
                var str = '①重铸此花色的一张手牌；②若此牌仅指定一个目标，你令其横置；③摸一张牌';
                if (player.storage.old_huanyin) str = '①摸一张牌；②若此牌仅指定一个目标，你令其横置；③重铸此花色的一张手牌';
                return '锁定技，当你于每轮第一次使用一种花色的牌后，你依次执行以下选项直到你执行完所有选项或需要执行无法执行的选项：『' + str + '』。';
            },
            old_sankuang(player) {
                var str = '', storage = player.storage.old_sankuang;
                if (!storage) return lib.translate.old_sankuang_info;
                var list = ['场上牌数', '已损失体力值', '手牌数与体力值之差'];
                for (var i = 0; i < list.length; i++) {
                    if (storage[i]) str += list[i];
                    else str += '<span style="opacity:0.5">' + list[i] + '</span>';
                    if (i < list.length - 1) str += '，';
                }
                return '锁定技，当你于每轮第一次使用一种类型的牌后，你令一名其他角色获得此牌或交给你至少X张牌（X为该角色『' + str + '』之间的最小值，且X至多为3）。'
            },
            bilibili_yutai(player) {
                var bool = game.hasPlayer2(current => get.nameList(current).includes('bilibili_suixingsifeng'));
                return '你可以将X张牌当作【奇正相生】使用（X为你本回合发动〖彧态〗的次数+1' + (bool ? '<span style="text-decoration: line-through;">' : '') + '，且X至多为3' + (bool ? '</span>' : '') + '）。';
            },
            bolrenhai(player) {
                const storage = player.storage.bolrenhai;
                if (!storage) return lib.translate.bolrenhai_info;
                return '锁定技，当你对一名角色造成伤害时，其选择以下任意其可执行项（可重复选择）并减少对应序号的伤害：' + storage.reduce((str, control) => {
                    return str + (control.index + control.text.join('、') + '；');
                }, '').replaceAll('【', '〖').replaceAll('】', '〗').slice(0, -1) + '。';
            },
            bolyifu(player) {
                let str = '{', count = player.countMark('bolyifu') % 3;
                if (count == 0) str += '<span class="bluetext">';
                str += '天，【闪电】';
                if (count == 0) str += '</span>';
                str += '；';
                if (count == 1) str += '<span class="bluetext">';
                str += '地，【随机应变】';
                if (count == 1) str += '</span>';
                str += '；';
                if (count == 2) str += '<span class="bluetext">';
                str += '人，【铁索连环】';
                if (count == 2) str += '</span>';
                str += '}';
                return '转换技。①一名角色可以将一张基本牌当作' + str + '使用。②当你成为〖蚁附①〗转化的牌的目标后，你摸一张牌。';
            },
            old_jinghua(player) {
                const storage = player.storage.old_jinghua;
                var str = '当其他角色获得你的牌后，或当你交给其他角色牌后，其';
                str += storage ? '失去' : '回复';
                str += '1点体力。';
                if (!storage) str += '当你失去最后的手牌后，你可以将此技能描述中的“回复”改为“失去”。';
                return str;
            },
            old_shuiyue(player) {
                const storage = player.storage.old_shuiyue;
                var str = '当其他角色受到你造成的伤害后，其';
                str += storage ? '弃置' : '摸';
                str += '一张牌。';
                if (!storage) str += '当你令其他角色进入濒死状态后，你可以将此技能描述中的“摸”改为“弃置”。';
                return str;
            },
            boljianling(player) {
                const bool = player.storage.boljianling;
                let yang = '你执行一个额外回合', yin = '你令所有角色将武将牌翻至背面';
                if (bool) yin = `<span class='bluetext'>${yin}</span>`;
                else yang = `<span class='firetext'>${yang}</span>`;
                let start = '锁定技，转换技。你仅使用明置牌造成伤害的回合结束后，', end = '。';
                return `${start}阳：${yang}；阴：${yin}${end}`;
            },
        },
        translate: {
            Chuodong: '活动群名人堂',
            CDormitory: '宿舍/肘击群杂谈',
            Cothers: '自嗨武将',
            CXuanDie: '蝶设堂',
            huashen_unknown: ' ',
            bilibili_zhengxuan: '郑玄',
            bilibili_zhengxuan_ab: '水果忍者',
            bilibili_zhengjing: '整经',
            bilibili_zhengjing_info: '出牌阶段，你可以整理一次经典。然后你将整理出的卡牌中的至少一张作为“经”置于一名角色的武将牌上，并获得其余的牌。该角色的准备阶段获得这些牌，且跳过此回合的判定和摸牌阶段。',
            bilibili_sunhanhua: '孙寒华',
            bilibili_sunhanhua_ab: '天降奇兵',
            bilibili_chongxu: '冲虚',
            bilibili_chongxu_info: '出牌阶段限一次，你可以进行一次“集灵”获取分数。然后你可修改〖妙剑〗或〖莲华〗（消耗3分），或者进行摸牌（每张2分）。',
            gz_huashen: '化身',
            gz_huashen_info: '准备阶段，若你的“化身”牌数：小于2，你可以观看剩余武将牌堆中的五张牌，然后将其中至多两张武将牌置于武将牌上，称为“化身”牌；大于等于2，你可以用剩余武将牌堆顶的一张牌替换一张“化身”牌。你可以于相应的时机明置并发动“化身”牌的一个无标签技能，然后你于技能结算完成后将此技能对应的“化身”牌放回剩余武将牌堆。',
            gz_xinsheng: '新生',
            gz_xinsheng_info: '当你受到1点伤害后，你可以随机获得一张“化身”牌。',
            bilibili_jinfan: '锦帆',
            bilibili_sheque: '射却',
            bilibili_jinfan_info: '锁定技。①弃牌阶段开始时，你将一张与武将牌上的“铃”花色均不同的牌作为“铃”置于武将牌上。②每回合每种花色限一次，当你使用或打出与“铃”花色相同的牌时，你摸一张牌。',
            bilibili_sheque_info: '当其他角色使用装备牌时，你可以将一张手牌当作【杀】对其使用，若此【杀】造成伤害，则该角色本回合不能再使用或打出手牌。',
            xinzaiqi: '再起',
            xinzaiqi_info: '弃牌阶段结束时，你可以令至多X名角色选择一项：1.摸一张牌，2.令你回复1点体力（X为本回合进入弃牌堆的红色牌数）',
            old_tianzuo: '天佐',
            old_tianzuo_info: '游戏开始时，你将8张【奇正相生】加入牌堆。当一名角色成为【奇正相生】的目标后，你可以观看其手牌，然后你可以更改其“奇兵”或“正兵”的选项。',
            old_lingce: '灵策',
            old_lingce_info: '锁定技，一名角色使用智囊牌名的锦囊或【奇正相生】时，你摸一张牌。',
            old_dinghan: '定汉',
            old_dinghan_info: '锁定技，每种牌名每轮限一次，当你成为伤害类卡牌的目标时，取消之。',
            bilibili_zhoutaigong: '周太公',
            bilibili_zhouxiaomei: '周小妹',
            bilibili_zhangrang: 'TW张让',
            bilibili_zhangrang_prefix: 'TW',
            decade_huangwudie: '黄舞蝶',
            decadexiwu: '习武',
            decadexiwu_info: '锁定技，你使用【杀】无距离和次数限制且你使用【杀】造成的伤害+1。',
            decadehongzhuang: '红妆',
            decadehongzhuang_info: '当你使用或打出一张牌时，你可以摸X张牌（X为此牌点数）。',
            olddulie: '笃烈',
            olddulie_info: '锁定技。①游戏开始时，你令X名其他角色获得“围”（X为游戏人数的一半且向下取整）。②你对没有“围”的角色使用【杀】无距离限制。③当你成为【杀】的目标时，若使用者没有“围”，则你进行判定。若结果为红色，则取消此目标。',
            oldpowei: '破围',
            oldpowei_info: '使命技。①当你因使用【杀】而对有“围”的角色造成伤害时，你防止此伤害并移去该角色的“围”。②使命：当你使用【杀】结算完成后，若场上没有“围”，则你获得〖神著〗。③失败：当你进入濒死状态时，你弃置装备区的所有牌，然后将体力值回复至1点。',
            oldshenzhu: '神著',
            oldshenzhu_info: '锁定技，你使用【杀】无次数限制。当你使用有对应实体牌的非转化【杀】结算结束后，你摸一张牌。',
            old_yingba: '英霸',
            old_yingba_info: '出牌阶段限一次，你可令一名体力上限大于1的其他角色减少1点体力上限并获得“平定”标记，然后你减少1点体力上限。你对拥有“平定”标记的角色使用牌没有次数限制。',
            old_fuhai: '覆海',
            old_fuhai_info: '锁定技。当你使用牌指定目标后，若目标角色有“平定”标记，则其不可响应此牌。当你使用牌结算结束后，你移除所有目标角色的“平定”标记并增加等量的体力上限。拥有“平定”标记的角色死亡时，你增加X点体力上限并摸X张牌。（X为其拥有的“平定”标记数）。',
            old_pinghe: '冯河',
            old_pinghe_info: '你的手牌上限基数等于你已损失的体力值。当你受到其他角色造成的伤害时，若你的手牌数大于Y，则你可以防止此伤害，减Y点体力值上限并将Y张手牌交给一名其他角色，然后若你拥有〖英霸〗，则伤害来源获得Y个“平定”标记（Y为伤害值）。',
            diy_lvmeng: '恐惧魔王',
            BTkongju: '克己',
            BThouqi: '后期',
            BTkongju_info: '恐惧技，出牌阶段结束时，若你于此阶段没有使用或打出过【杀】，你可以跳过弃牌阶段并令所有其他角色获得1枚“恐惧”标记。',
            BThouqi_info: '锁定技，准备阶段，若场上的“恐惧”标记数不少于100，你所属的阵营直接获得游戏胜利。',
            bilibili_taoluan: '滔乱',
            bilibili_taoluan_info: '你可以将一张牌当作任意一张基本牌或普通锦囊牌使用（此牌不得是本局游戏你以此法使用过的牌），然后你获得一名其他角色的一张牌，若你未获得你以此法使用的牌的类别不同的牌，你失去1点体力且〖滔乱〗无效直到回合结束。',
            old_jieying: '劫营',
            old_jieying_info: '锁定技。①游戏开始时，你令一号位角色获得“营”标记。②有“营”标记的角色的回合结束后或死亡后，将其“营”标记移动至其下家，然后你进行一个额外回合。',
            old_tongling: '铜铃',
            old_tongling_info: '锁定技，当你成为一名角色使用牌指定的唯一目标后，或其他角色对你发动技能时，你摸两张牌。',
            bilibili_wangwang: '王桃王悦',
            bilibili_wangtao: '萌设王桃',
            bilibili_wangyue: '萌设王悦',
            bilibili_x_wangtao: '萌设王桃',
            bilibili_x_wangyue: '萌设王悦',
            bilibili_wangtao_prefix: '萌设',
            bilibili_wangyue_prefix: '萌设',
            bilibili_x_wangtao_prefix: '萌设',
            bilibili_x_wangyue_prefix: '萌设',
            BThuashen: '化身',
            BThuashen_info: '游戏开始后，你随机获得两张未加入游戏的武将牌，然后选择一张置于你面前并声明该武将牌的一项技能，你视为拥有该技能且性别和势力视为与该武将相同直到该化身被替换。准备阶段和结束阶段，你可以选择一项：①弃置至多X张未展示的化身牌并重新获得等量化身牌（X为你的体力上限）；②更换所展示的化身牌或技能；③弃置一张化身牌并升级【新生】（至多升至3级）。（你不可声明限定技、觉醒技、隐匿技、使命技、主公技等特殊技能）。',
            BTxinsheng: '新生',
            BTxinsheng_info: '当你受到1点伤害后，你可以获得一张化身牌。',
            BTxinsheng_1: '新生·2级',
            BTxinsheng_1_info: '当你造成或受到1点伤害后，你可以获得一张化身牌。',
            BTxinsheng_2: '新生·3级',
            BTxinsheng_2_info: '当你造成或受到1点伤害后，你可以获得一张化身牌，然后若你的化身牌数不小于场上人数，你获得〖幻化〗。',
            BThuanhua: '幻化',
            BThuanhua_info: '出牌阶段限一次，你可以弃置一张未展示的化身牌，然后将一张手牌视为一张基本牌或普通锦囊牌使用。',
            bilibili_huanggai: '谋黄盖',
            bilibili_huanggai_prefix: '谋',
            bilibili_kurou: '苦肉',
            bilibili_kurou_info: '出牌阶段，你可以失去1点体力，然后摸一张牌。',
            bilibili_zhaxiang: '诈降',
            bilibili_zhaxiang_info: '当你失去体力或受到伤害后，你可以弃置任意张手牌，然后摸等量张牌。',
            bilibili_ekeshaoge: '俄何烧戈',
            bilibili_xueji: '血激',
            bilibili_xueji2: '血激',
            bilibili_xueji_info: '转换技，每轮开始时。阴：你可以失去1点体力，令一名角色于本轮第一次造成的伤害+1。阳：你可以失去1点体力上限，并视为使用一张【杀】，若此【杀】造成伤害，你摸两张牌。',
            bilibili_hanran: '悍然',
            bilibili_hanran_info: '锁定技，当你对其他角色造成伤害时，若该角色体力上限大于你，你加1点体力上限。',
            oldluanji: '乱击',
            oldluanji_info: '你可以将两张与你本回合以此法转化的花色均不相同的手牌当【万箭齐发】使用。当一名已受伤的角色因响应此牌而打出【闪】时，该角色摸一张牌。',
            old_jishi: '济世',
            old_jishi_info: '锁定技。①当你使用的牌结算完成后，若你未因此牌造成过伤害，则你将此牌对应的所有实体牌置于仁库中。②当有牌离开仁库时，你摸一张牌。',
            old_yuheng: '驭衡',
            old_yuheng_info: '锁定技。①回合开始时/当你每回合使用第X张牌结算完成后，你随机获得吴势力角色的X个技能。②回合结束时/当你每回合使用第X张牌结算完成后，你随机失去你因此获得的X个技能。（X为当前回合开始时你的体力值、已损失体力值和游戏轮数的中位数）',
            bilibili_litiansuo: '李田所',
            bilibili_litiansuo_ab: '李荣',
            oldhongyi: '弘仪',
            oldhongyi_info: '出牌阶段限一次，你可以弃置X张牌并选择一名其他角色（X为场上已阵亡角色数且至多为2）。你的下回合开始前，该角色造成伤害时进行判定，若结果为：黑色，此伤害-1。红色，受到伤害的角色摸一张牌。',
            xinfanghun: '芳魂',
            xinfanghun_info: '你可以将【杀】当作【闪】，或【闪】当作【杀】使用或打出，然后你获得1枚“梅影”标记。',
            xinfuhan: '扶汉',
            xinfuhan_info: '觉醒技，准备阶段，若你的“梅影”标记数不少于4，则你移去所有的“梅影”标记，增加1点体力上限并回复1点体力，然后你失去〖芳魂〗并获得〖龙胆〗，从〖武圣〗、〖咆哮〗、〖铁骑〗、〖烈弓〗、〖狂骨〗中选择一个获得之。',
            old_jiebing: '借兵',
            old_jiebing_info: '出牌阶段限一次，你可以获得一名有手牌的其他角色的三张手牌，然后受到1点伤害。若如此做，此阶段结束时，你交给其以此法获得的牌。',
            old_kuzhan: '苦战',
            old_kuzhan_info: '使命技。成功：准备阶段，若你本局游戏受到的伤害不少于5点，你获得〖退敌〗。失败：结束阶段，若你本回合和上回合均发动过〖借兵〗且均未于当前回合造成过伤害，则使命失败。',
            old_tuidi: '退敌',
            old_tuidi_info: '当你对一名其他角色造成伤害后，你可以随机废除其一种装备栏。',
            old_qixi: '奇袭',
            old_qixi_info: '你可以将一张黑色牌当作【过河拆桥】使用。你使用非转化非虚拟的【过河拆桥】可以改为：出牌阶段，对一名区域内有牌的角色使用，你弃置其区域内的所有牌。',
            old_fenwei: '奋威',
            old_fenwei_info: '限定技，当一名角色使用的锦囊牌指定了至少两名角色为目标时，你可以令此牌对其中任意名角色无效，然后你获得牌堆中的X张【过河拆桥】（X为你选择的角色数且X至多为4）。',
            bilibili_fushi: '附势',
            bilibili_fushi_info: '锁定技，若场上势力数：群大于魏，你视为拥有技能〖择主〗；魏大于群，你视为拥有技能〖逞功〗。',
            bilibili_zezhu: '择主',
            bilibili_zezhu_info: '出牌阶段限一次，你可以获得至多两名其他角色各一张牌，然后分别交给其一张牌（若你选择的角色中有人没有牌，则将获得其一张牌改为摸一张牌）。',
            bilibili_chenggong: '逞功',
            bilibili_chenggong_info: '一名角色使用牌指定目标后，若目标数不小于2，你可以令其摸一张牌。',
            bilibili_sp_xuyou: 'SP许攸',
            bilibili_sp_xuyou_prefix: 'SP',
            bilibili_liangjunxiangchi: '两军相持',
            bilibili_liangjunxiangchi_info: '若当前游戏轮数：小于等于4，所有角色的手牌上限+X（X为当前游戏轮数）；大于4，所有角色于其回合内使用的第一张【杀】造成的伤害+1。',
            bilibili_xutuhuanjin: '徐图缓进',
            bilibili_xutuhuanjin_info: '所有角色的出牌阶段结束时，若其于此阶段未使用或打出过【杀】，则其下个摸牌阶段多摸一张牌。',
            bilibili_jianshoudaiyuan: '坚守待援',
            bilibili_jianshoudaiyuan_info: '所有角色均可以将【杀】当作【闪】，【闪】当作【杀】使用或打出，然后其手牌上限-1直到其下一个弃牌阶段结束。',
            bilibili_huoshaowuchao: '火烧乌巢',
            bilibili_huoshaowuchao_info: '本局游戏内造成的无属性伤害均视为火属性。',
            bilibili_liangcaokuifa: '粮草匮乏',
            bilibili_liangcaokuifa_info: '所有角色摸牌阶段的额定摸牌数-1。当一名角色使用的牌结算完成后，若其因此牌造成了伤害，则其摸一张牌。',
            bilibili_zhanzhuyanwen: '斩颜良诛文丑',
            bilibili_zhanzhuyanwen_info: '所有角色的回合开始时，须选择一项：视为使用一张不可被【无懈可击】响应的【决斗】，或失去1点体力。',
            bilibili_shishengshibai: '十胜十败',
            bilibili_shishengshibai_info: '所有角色使用牌时，若此牌是整局游戏使用的第整十张牌且此牌不为延时锦囊牌或装备牌，则此牌所有目标角色再次成为此牌的目标角色。',
            bilibili_yiruoshengqiang: '以弱胜强',
            bilibili_yiruoshengqiang_info: '造成伤害时，若受伤角色体力值大于伤害来源，此伤害+1。',
            bilibili_shichongerjiao: '恃宠而骄',
            bilibili_shichongerjiao_info: '结束阶段，若你的体力值为全场唯一最多，你弃一张牌；若你的手牌数为全场最多，你失去1点体力。',
            lz_sufei: '龙舟苏飞',
            lz_sufei_ab: '苏飞',
            lzlianpian: '联翩',
            lzlianpian_info: '友方角色于出牌阶段使用牌连续指定同一名角色为目标后，你可以令此牌的使用者摸一张牌。',
            lz_liuqi: '龙舟刘琦',
            lz_liuqi_ab: '刘琦',
            lztunjiang: '屯江',
            lztunjiang_info: '友方角色的回合结束时，若其于本回合内未造成过伤害，则你可以令你或令其摸两张牌。',
            lz_huangquan: '龙舟黄权',
            lz_huangquan_ab: '黄权',
            lzdianhu: '点虎',
            lzdianhu_info: '锁定技，游戏开始时，你选择一名其他角色。友方角色对其造成1点伤害后，摸一张牌。',
            lz_tangzi: '龙舟唐咨',
            lz_tangzi_ab: '唐咨',
            lzxingzhao: '兴棹',
            lzxingzhao_info: '锁定技，若本局游戏中所有友方角色造成的伤害数不小于：<br><li>2，所有友方角色视为拥有技能〖恂恂〗；<br><li>4，所有友方角色使用装备牌时摸一张牌；<br><li>6，所有友方角色跳过弃牌阶段；<br><li>12，每轮开始时，你所属的阵营直接获得游戏胜利。',
            boss_tz: '等阶特权·玩家方',
            boss_tz_sha: '出杀',
            boss_tz_sha_info: '出【杀】次数+1。',
            boss_tz_draw: '摸牌',
            boss_tz_draw_info: '摸牌阶段摸牌数+1。',
            boss_tz_chongsheng: '重生',
            boss_tz_chongsheng_info: '限定技，当你处于濒死状态时，你可以弃置判定区内的所有牌，然后复原你的武将牌，将手牌摸至五张，将体力回复至5点。',
            boss_yz: '等阶特权·神武方',
            boss_yz_equip: '装备',
            boss_yz_equip_info: '登场时随机从牌堆中使用一张装备牌。',
            boss_yz_sha: '出杀',
            boss_yz_sha_info: '出【杀】次数+1。',
            boss_yz_draw: '摸牌',
            boss_yz_draw_info: '摸牌阶段摸牌数+1。',
            boss_yz_kunshou: '困兽',
            boss_yz_kunshou_info: '觉醒技，当你进入濒死状态时，你将体力回复至5，将手牌数补至5，然后获得〖崩坏〗。',
            wzdanji: '单骑',
            wzdanji_info: '觉醒技，准备阶段，若你的手牌数大于你的体力值且本局游戏的主公为曹操，你减1点体力上限，然后获得〖马术〗。',
            old_sankuang: '三恇',
            old_sankuang_info: '锁定技，当你于每轮第一次使用一种类型的牌后，你令一名其他角色获得此牌或交给你至少X张牌（X为该角色『场上牌数，已损失体力值，手牌数与体力值之差』之间的最小值，且X至多为3）。',
            old_beishi: '卑势',
            old_beishi_info: '锁定技，当你或第一次成为〖三恇〗的目标角色失去最后的手牌后，你选择移除或复原〖三恇〗描述『 』中的一个条件，然后回复1点体力。',
            old_lieshi: '烈誓',
            old_lieshi_info: '你可以将你场上的牌当作场上没有的延时锦囊牌使用并执行一项，然后令目标角色执行后一项：『①受到1点火焰伤害；②弃置手牌中的所有【闪】；③弃置手牌中的所有【杀】』。',
            old_dianzhan: '点盏',
            old_dianzhan_info: '锁定技，当你于每轮第一次使用一种花色的牌后，你依次执行以下选项直到你执行完所有选项或需要执行无法执行的选项：『①重铸此花色的一张手牌；②若此牌仅指定一个目标，你令其横置；③摸一张牌』。',
            old_huanyin: '还阴',
            old_huanyin_info: '锁定技，当你进入濒死状态时，你将〖烈誓〗和〖点盏〗描述『 』中的内容倒置，然后将手牌数补至四张。',
            old_yunshen: '熨身',
            old_yunshen_info: '出牌阶段各限一次，你可以令一名其他角色回复1点体力，然后你选择一项：①视为你对其使用一张冰【杀】；②视为其对你使用一张冰【杀】。',
            old_shangshen: '伤神',
            old_shangshen_info: '当一名角色受到属性伤害后，你可以选择下列两项：①获得你场上的所有牌；②将其一张牌当作随机一张延时锦囊牌对你使用；③令其将手牌数补至四张。',
            old_fenchai: '分钗',
            old_fenchai_info: '锁定技，你和首次成为你发动技能指定的异性角色的牌的花色均视为红桃。首次成为你发动技能指定的异性角色死亡时，其可以交给你至多一半手牌（向上取整）。',
            bolyuheng: '驭衡',
            bolyuheng_info: '锁定技。①回合开始时，你须弃置任意张花色不同的牌，随机获得等量吴势力角色的技能。②回合结束时，你失去所有因〖驭衡〗获得的技能，然后摸等量的牌。',
            bolyuheng_faq: 'FAQ',
            bolyuheng_faq_info: '非全扩技能库如下：<br>制衡、缔盟、慎行、下书、弘援、观微、安恤、秉壹、兴学、澜疆、安国、戒训、调度、弼政、诱敌',
            boldili: '帝力',
            boldili_info: '觉醒技，游戏开始时/当你增加或减少体力上限后/当你获得或失去技能后，若你拥有的技能数大于你的体力上限时，你减1点体力上限，选择失去任意个其他技能，然后获得〖圣质〗、〖权道〗、〖持纲〗的前等量个。',
            bolchuanwu: '穿屋',
            bolchuanwu_info: '锁定技。当你造成或受到伤害后，你失去武将牌上的前X个技能直到回合结束，然后你摸等同于你此次失去的技能数的牌（X为你的攻击范围）。',
            bolzhuhai: '诛害',
            bolzhuhai_info: '其他角色的回合结束时，若其本回合内造成过伤害，则你可以将一张手牌当作【杀】或【过河拆桥】对其使用。',
            bilibili_zhiyinxian: '机先',
            bilibili_zhiyinxian_info: '其他角色的回合开始时，你可以令其跳过本回合的一个阶段（不能选择准备阶段和结束阶段和你已选择过的阶段）。当你杀死角色后，你可以选择一个你已选择过的时机，然后你视为未选择过此时机。',
            bolhuanshi: '缓释',
            bolhuanshi_info: '一名角色的判定牌生效前，你可令其观看你的手牌并选择其中一张牌替代此牌，然后你可以重铸任意张牌。',
            bollihuo: '疠火',
            bollihuo_info: '当你使用普通【杀】时，可以将此牌改为火【杀】，且你本局游戏使用火【杀】可以额外指定一个目标。此牌第一次造成伤害时，你须弃置两张牌或失去1点体力。',
            bolchunlao: '醇醪',
            bolchunlao_info: '当一名与你距离为1以内的角色因弃置而失去【杀】后，其可以将此【杀】置于你的武将牌上，称为“醇”。当一名角色处于濒死状态时，你可以移去X张“醇”（X为你本轮发动此技能的次数），令其视为使用一张【酒】，然后将其下一个判定阶段改为摸牌阶段。',
            bolkuangbi: '匡弼',
            bolkuangbi2: '匡弼',
            bolkuangbi_info: '出牌阶段限一次，你可以与一名其他角色将任意张牌置于其武将牌上。若如此做，当你进入濒死状态时或下X个回合开始时，你获得其武将牌上的“匡弼”牌，其摸X张牌（X为其武将牌上的“匡弼”牌数）。',
            bol_shanshan: '闪闪',
            bol_shanshan_info: '当一张基本牌或锦囊牌即将对你生效前，对此牌使用，抵消此牌的效果，然后获得此牌对应的所有实体牌。',
            old_zhoufu: '咒缚',
            old_zhoufu_info: '出牌阶段限一次，你可以将一张手牌置于一名武将牌旁没有“咒”的其他角色的武将牌旁，称为“咒”。当有“咒”的角色判定时，将“咒”作为判定牌。有“咒”的角色的回合结束时，你获得其武将牌旁的“咒”。',
            old_yingbing: '影兵',
            old_yingbing_info: '当一张“咒”成为判定牌后，你可以摸两张牌。',
            boljiaozong: '骄纵',
            boljiaozong_info: '锁定技，其他角色出牌阶段使用的第一张红色牌无距离限制且目标必须为你。',
            bolchouyou: '仇幽',
            bolchouyou_info: '当你成为【杀】的目标后，你可以令另一名可以成为此牌目标的其他角色选择一项：①其代替你成为此牌目标；②其发动非锁定技前需经过你同意直到其令你回复体力。',
            bilibili_adong: '蝶设阿会喃董荼纳',
            bilibili_adong_ab: '蝶设阿董',
            bilibili_adong_prefix: '蝶设',
            bilibili_ahuinan: '萌设阿会喃',
            bilibili_ahuinan_prefix: '萌设',
            bilibili_dongtuna: '萌设董荼纳',
            bilibili_dongtuna_prefix: '萌设',
            bilibili_x_ahuinan: '萌设阿会喃',
            bilibili_x_ahuinan_prefix: '萌设',
            bilibili_x_dongtuna: '萌设董荼纳',
            bilibili_x_dongtuna_prefix: '萌设',
            old_liaoyi: '疗疫',
            old_liaoyi_info: '其他角色的回合开始时，你可选择一项：①令其从仁库中获得一张牌。②若其手牌数不小于2，则令其将X张手牌置入仁库（X为其手牌数与体力值之差，至少为1，至多为9）。',
            bilibili_tannang: '探囊',
            bilibili_tannang_info: '锁定技，你与其他角色计算距离-X（X为你已损失的体力值）。',
            bilibili_yishi: '义释',
            bilibili_yishi_info: '当你对其他角色造成伤害时，你可以防止此伤害，然后获得其装备区的一张牌。',
            bilibili_zhengjun: '整军',
            bilibili_zhengjun_info: '当你受到伤害时，你可以获得装备区里的牌，然后打出一张装备牌。若如此做，你防止此伤害。',
            old_zuoci: '国战左慈',
            old_zuoci_ab: '左慈',
            bilibili_shengxunyu: '生熏鱼',
            bilibili_jinyan: '禁言',
            bilibili_jinyan_info: '锁定技，其他角色于你的回合内至多成为一次你使用非【奇正相生】牌的目标。',
            bilibili_hehu: '呵护',
            bilibili_hehu_info: '锁定技，其他角色回合结束时，其须交给你两张牌，然后其摸两张牌并获得两张【影】（这些牌不计入手牌上限且不能对你使用）。',
            bilibili_yutai: '彧态',
            bilibili_yutai_info: '你可以将X张牌当作【奇正相生】使用（X为你本回合发动〖彧态〗的次数+1，且X至多为3）。',
            bilibili_yutai_append: '<span style="font-family:yuanli">我是活动群团宠，我最爱的就是惹事然后被宵禁</span>',
            bilibili_Firewin: 'Fire.win',
            bilibili_xianqu: '先驱',
            bilibili_xianqu_info: '锁定技。每轮开始时，你执行一个额外回合，且你于此回合获得〖飞扬〗和〖跋扈〗。',
            bilibili_tixiang: '替像',
            bilibili_tixiang_info: '锁定技。①游戏开始时，系统随机从剩余武将牌堆中筛选出五张不同势力的武将牌，你选择这些武将牌上的至多四个技能获得之（每少获得一个技能则改为摸两张牌）。②当你发动无标签技能结算结束后，你触发一次扩展内置彩蛋。',
            bilibili_tixiang_append: '<span style="font-family:yuanli">我每个月都要换头像，我这儿有很多的鸟可以换</span>',
            bilibili_jinglingqiu: '精灵球',
            bilibili_jinglingqiu_ab: '?',
            bilibili_tiyi: '提议',
            bilibili_tiyi_info: '出牌阶段，若你有牌，你可以记录一名有手牌的其他角色，然后与其议事。若议事有结果且为：红色，你与其各回复1点体力；黑色，你摸两张牌，其摸牌阶段多摸一张牌且手牌上限+1直到其下个回合结束。若议事无结果，你对其造成1点伤害。当你发动〖提议〗后，或场上有角色死亡后，若场上剩余存活的其他角色均已被〖提议〗记录，你清空〖提议〗角色记录且本回合不能发动〖提议〗。',
            bilibili_zili: '资历',
            bilibili_zili_info: '锁定技。①一名角色的摸牌阶段结束后，若其本阶段摸牌数A大于0，且你未记录X或X小于A，则你记录X为A。一名角色的弃牌阶段结束后，若其手牌上限B大于0，且你未记录Y或Y小于B，则你记录Y为B。③若你已有记录X，你的摸牌阶段摸牌基数视为X+1；若你已有记录Y，你的手牌上限视为Y+1。',
            bilibili_zili_append: '<span style="font-family:yuanli">大佬你这么厉害，不如建一个群接纳喜欢你的扩展的人</span>',
            bilibili_suixingsifeng: '随性似风',
            bilibili_liaoxing: '瞭星',
            eternal_liaoxing_tag: '星',
            bilibili_liaoxing_info: '锁定技。①分发起始手牌后，将所有角色的手牌被标记为“星”。②一名角色失去“星”后，其获得等量的【影】。③一名角色失去【影】后，你摸等量的牌。',
            bilibili_duoyang: '多样',
            bilibili_duoyang_info: '锁定技。①一张非装备牌不由你的区域进入弃牌堆后，你将此牌以随机副类别置入装备区。②你可以使用或打出装备区里的非装备牌，然后你摸一张牌并弃置一张牌。',
            bilibili_duoyang_append: '<span style="font-family:yuanli">萌新（转型中）御用第二人格</span>',
            bilibili_xuxiang: '虚像',
            bilibili_xuxiang_info: '锁定技，防止你受到的伤害。',
            bilibili_Emptycity: 'Empty city°',
            bilibili_zhiyou: '致优',
            bilibili_zhiyou_info: '出牌阶段限一次，你可以从其他角色已发动过但未你未因〖致优〗选择的随机三个武将牌上的技能中选择获得其中一个。',
            bilibili_guanli: '管理',
            bilibili_guanli_info: '锁定技。①你对未因〖致优〗获得过其武将牌上的技能的角色使用牌无距离和次数限制。②摸牌阶段，你多摸X张牌（X为你因〖致优〗获得过其武将牌上的技能的游戏角色数）③你因〖致优〗获得过其武将牌上的技能的角色于摸牌阶段多摸三张牌，然后交给你两张牌。',
            bilibili_guanli_append: '<span style="font-family:yuanli">你高考复习要暂时退坑了，这次肯定要整一个大的</span>',
            bilibili_thunderlei: '雷',
            bilibili_Thunder: '雷扩',
            bilibili_Thunder_info: '锁定技。其他角色发动无标签技能后，若本局游戏未因〖雷扩〗制作过此技能的卡牌，则你制作一张此技能的卡牌并获得之。使用此牌可获得此牌对应的技能（若已拥有此技能则改为获得2点护甲）。然后若此牌为首次被使用，则将此牌洗入牌堆，否则将此牌移出游戏。',
            bilibili_qianxiu: '潜修',
            bilibili_qianxiu_info: '其他角色对你发动非锁定技时，你可以失去1点护甲（若没有护甲则改为本技能本回合失效），取消本次技能结算。',
            bilibili_qianxiu_append: '<span style="font-family:yuanli">千幻雷音的密码是thunder，不是什么“Thunder”、“thunder，憋问了。”不带符号，不带空格。小雷音寺已解散，Thunder小游戏扩展的密码是thunderXYX，求求你们不要私信问我密码为什么不对了，憋问了。</span>',
            bilibili_lonelypatients: 'lonely patients',
            bilibili_meihua: '美化',
            bilibili_meihua_info: `锁定技。①分发起始手牌前，你移除牌堆中的所有【闪】，将牌堆中的所有装备牌替换为${get.poptip('bol_shanshan')}并翻倍。②你的装备栏不会被废除且拥有无限装备栏。③因此法转化的【闪闪】从你的装备区外的区域进入弃牌堆后，你将此牌以其原副类别置入装备区。`,
            bilibili_zhengyou: '争优',
            bilibili_zhengyou_info: `锁定技。①跳过你的额定回合；每轮开始时和每轮结束时，你进行一个额外回合。②根据你装备区的牌你获得以下技能：四种花色，${get.poptip('bilibili_zili')}；八张红色牌，${get.poptip('bilibili_zhiyou')}；八张黑色牌，${get.poptip('bilibili_qianxiu')}；十六张牌，${get.poptip('bilibili_zhangcai')}。`,
            bilibili_zhengyou_append: '<span style="font-family:yuanli">之前你说的，我把所有图抠好了给我管理的哈</span>',
            bilibili_renwang: '仁望值',
            bolyuanqing: '渊清',
            bolyuanqing_info: '出牌阶段限一次，你可以展示一张手牌，然后其他角色可依次选择是否弃置其中一张颜色与此牌相同的牌并摸一张牌。然后你可以将其中一张弃置的牌置于牌堆顶。',
            bolshuchen: '疏陈',
            bolshuchen_info: `当一名角色进入濒死状态时，你可以消耗至多3点${get.poptip('rule_renwangnum')}并摸等量张牌，然后你可以交给其至多等量张牌。`,
            bolxiezheng: '挟政',
            bolxiezheng_info: `弃牌阶段结束时，你可以消耗1点${get.poptip('rule_renwangnum')}并令一名角色弃置X张牌（X为本阶段你弃置的牌数）。`,
            bolliaoyi: '疗疫',
            bolliaoyi_info: '出牌阶段开始时，你可以令一名角色获得从牌堆或弃牌堆中获得其上个回合开始至现在失去过的牌的类型的牌各一张。',
            bolbinglun: '病论',
            bolbinglun_info: `出牌阶段限一次，你可以失去至多3点${get.poptip('rule_renwangnum')}，令：⒈等量名角色各选择执行以下一项；⒉一名角色执行以下等量项。①将手牌数补至体力上限（至多摸五张）；②回复1点体力；③防止下一次受到的伤害直到回合开始。`,
            bfake_jiananfeng: '蝶设贾南风',
            bfake_jiananfeng_prefix: '蝶设',
            bolduliao: '毒獠',
            bolduliao_info: '锁定技，一名角色使用牌时，若此牌上次进入弃牌堆前在位于的区域，则你令此牌无效，然后其对你造成1点伤害。',
            bolhuidu: '秽妒',
            bolhuidu_info: '当你造成或受到伤害时，若伤害来源为：男性，其可以重铸任意张牌并防止此伤害；女性，你可以选择一个区域，令其重铸此区域的所有牌。',
            bolfushou: '覆手',
            bolfushou_info: '觉醒技，一名角色的回合结束时，若你的体力值不为全场最高，则交换你的手牌和本回合进入且位于弃牌堆的牌，然后交换牌堆和弃牌堆，最后交换你的体力值和体力上限（溢出的体力值改为增加等量护甲）。',
            DJ_pujing: '普净',
            DJ_huban: '胡班',
            bilibili_gaowang: '高望',
            bolyingtu: '营图',
            bolyingtu_info: '①当你的上家于摸牌阶段外获得牌后，你可以获得其等量的牌，然后将等量的牌交给你的下家。②当你的下家使用【杀】或【决斗】指定第一个目标时，若目标角色不包含你和你的上家，则你可以取消此牌的所有目标，然后将此牌目标改为你的上家。',
            bolcongshi: '从势',
            bolcongshi_info: '锁定技。①体力值最大的角色对你的上家和下家使用牌无距离限制。②有角色使用因〖从势①〗增加距离的牌对你的上家或下家造成伤害后，你回复1点体力。',
            bilibili_kuangshen: '狂神',
            bilibili_paoku: '跑酷',
            bilibili_paoku_info: `每轮开始时和每轮结束时，你可以游玩5-8分钟的“狂神跑酷”，然后获得等量分数的${get.poptip({
                id: 'manbaout',
                name: '复活币',
                type: 'character',
                info: '牢狂的复活赛进度，拥有至少1103个复活币后，所属阵营获得游戏胜利',
            })}。`,
            bilibili_zhijiang: '植僵',
            bilibili_zhijiang_info: `出牌阶段限一次，你可以游玩5-8分钟的“植物大战僵尸”，然后获得游戏秒数的的${get.poptip('manbaout')}。`,
            bilibili_zhijiang_append: `<span style="font-family:yuanli">${[
                'v1.10.3.1版本更新内容',
                '※殴打@kuangshen04，回滚这位开发者提交的Pull Request，修复技能的group失效的bug',
            ].join('<br>')}</span>`,
            bilibili_shen_guojia: '知箸侠',
            bilibili_huishi: '慧识',
            bilibili_huishi_info: '限定技，出牌阶段限一次，若你的体力上限小于10，你可进行判定牌不置入弃牌堆的判定。若判定结果与本次发动技能时的其他判定结果的花色均不相同且你的体力上限小于10，则你加1点体力上限，且可以重复此流程。然后你将所有位于处理区的判定牌交给一名角色。若其手牌数为全场最多，则你减1点体力上限。',
            bilibili_re_xusheng: '宝神',
            bilibili_pojun: '破军',
            bilibili_pojun_info: '当你使用【杀】指定一个目标后，你可以获得其所有手牌。若你的手牌数为全场唯一最多，则你造成和受到的伤害均+1。',
            bilibili_baodao: '宝刀',
            bfake_shen_jiaxu: '蝶设神贾诩',
            bfake_shen_jiaxu_prefix: '蝶设|神',
            boljiandai: '缄殆',
            boljiandai_info: '锁定技，你的武将牌始终背面朝下。',
            boljiandai_info_guozhan: '锁定技，你的武将牌始终叠置。',
            bolfangcan: '纺残',
            bolfangcan_info: '锁定技，一名角色的回合结束时，你视为使用本回合进入且位于弃牌堆中的唯一一张普通锦囊牌或伤害牌。',
            boljuemei: '绝殙',
            boljuemei_info: '锁定技，一名角色脱离受伤状态或濒死状态后，你装备【吴起兵法】，然后若你为偶数次发动此技能，则你失去武将牌上的首个技能。',
            bol_wuqibingfa: '吴起兵法',
            bol_wuqibingfa_info: '锁定技，当此牌离开装备区时，你销毁此牌，然后令至多X名角色于本回合结束时将一张牌当作【杀】使用（X为你拥有的技能数）。',
            bolluoshu: '络殊',
            bolluoshu_info: '锁定技，准备阶段，你从随机三个限定技中选择一个获得（若你未拥有〖纷殕〗，则选项必定包含〖纷殕〗）。',
            bolfenfou: '纷殕',
            bolfenfou_info: '限定技，每轮开始时，你可以令场上所有角色同时选择两项：①将武将牌翻面；②摸两张牌；③于本轮获得〖鸩毒〗。',
            bolfenfou_info_guozhan: '限定技，每轮开始时，你可以令场上所有角色同时选择两项：①叠置武将牌；②摸两张牌；③于本轮获得〖鸩毒〗。',
            bolxiongsuan: '凶算',
            bolxiongsuan_info: '限定技，出牌阶段，你可以弃置一张手牌并对一名与你势力相同的角色造成1点伤害，然后摸三张牌。若该角色有已发动的限定技，你选择其中一个限定技并于此回合结束时复原之。',
            bfake_shen_zhangfei: '蝶设神张飞',
            bfake_shen_zhangfei_prefix: '蝶设|神',
            bolbaohe: '暴喝',
            bolbaohe_info: '锁定技。①你的锦囊牌均视为无次数限制的无属性【杀】。②你使用牌造成的伤害改为此牌对应的所有实体牌的牌名字数之和。',
            bolrenhai: '人骇',
            bolrenhai_info: '锁定技，当你对一名角色造成伤害时，其选择以下任意其可执行项（可重复选择）并减少对应序号的伤害：①进行【闪电】判定；②获得〖仇海〗或〖崩坏〗；③将本项并入邻项；④获得〖无谋〗或〖止息〗。',
            boltiandong: '天动',
            boltiandong_info: '锁定技，准备阶段，你令场上所有拥有因〖人骇〗获得技能的角色失去因〖人骇〗获得的技能，然后你随机获得牌堆中X张点数最大的牌（X为你本次移去的技能数），然后你选择一项：①将武将牌翻面；②复原〖人骇〗。',
            bfake_shen_zhangjiao: '蝶设神张角',
            bfake_shen_zhangjiao_prefix: '蝶设|神',
            bolyifu: '蚁附',
            bolyifu_info: '转换技。①一名角色可以将一张基本牌当作{天，【闪电】；地，【随机应变】；人，【铁索连环】}使用。②当你成为〖蚁附①〗转化的牌的目标后，你摸一张牌。',
            boltianjie: '天劫',
            boltianjie_info: '锁定技。①一名角色的【闪电】生效时，取消之，然后你对其或其上家或下家造成1点雷属性伤害。②一名角色的【闪电】判定牌生效后，若判定牌不为【闪】，则令其继续进行【闪电】判定。',
            bfake_huanwen: '蝶设桓温',
            bfake_huanwen_prefix: '蝶设',
            bolyuba: '欲罢',
            bolyuba_info: '当你造成或受到伤害后，你可以将手牌摸至X张，然后弃置一张点数为X的牌或失去一个技能（X为你本局游戏造成和受到伤害的次数之和）。',
            bolxingjiang: '行将',
            bolxingjiang_info: '出牌阶段限一次，你可以弃置至少两张同名基本牌或普通锦囊牌，若如此做，你获得一个技能效果为“每回合限一次，你可以视为使用一张【XXX】”的技能（XXX为你本次弃置牌的牌名）。',
            bfake_miheng: '蝶设祢衡',
            bfake_miheng_prefix: '蝶设',
            visible_bolhuaici: '怀刺',
            bolhuaici: '怀刺',
            bolhuaici_info: '锁定技。①每轮开始时，你亮出牌堆顶X张牌，获得其中任意张并明置之。②你成为与你的明置手牌花色相同的基本牌或普通锦囊牌的额外目标。③你于第X轮结束时死亡。（X为场上角色数）',
            boljianling: '翦翎',
            boljianling_info: '锁定技，转换技。你仅使用明置牌造成伤害的回合结束后，阳：你执行一个额外回合；阴：你令所有角色将武将牌翻至背面。',
            bilibili_ningjingzhiyuan: '宁静致远',
            bilibili_xiezhi: '协治',
            bilibili_xiezhi_info: '其他角色的回合开始时，你可以为其本回合基本牌、锦囊牌、装备、武将技能的最大使用次数任意分配数值，每个数值至少为2，且数值之和须为10。',
            bilibili_fazhou: '罚肘',
            bilibili_fazhou_info: '每轮开始时，你可以选择任意名上一轮使用过三种类别的牌或造成过至少3点伤害的其他角色，对这些角色依次肘成1点伤害，然后本轮将这些角色肘出游戏（同时满足两项条件的角色有8%几率改为肘成24点伤害）。',
            bilibili_fazhou_append: '<span style="font-family:yuanli">不顺群意者，当填黑屋之壑<br>吾令不从者，当膏肘击之锷</span>',
            bilibili_xizhicaikobe: '戏志才',
            bilibili_zhangcai: '彰才',
            bilibili_zhangcai_info: '当你获得牌后，你可以使用其中一张牌，然后根据你本局游戏以此法使用过的花色数视为拥有对应技能：≥1，〖蟨蛮〗；≥2，〖鹣蛮〗；≥3，〖傲才〗；≥4，〖恃才〗。',
            bilibili_laosao: '牢骚',
            bilibili_laosao_info: `锁定技。你视为装备着${get.poptip('bilibili_laosaozhipao')}。游戏开始时或牌堆洗牌后，你将${get.poptip('bilibili_laosaozhipao')}置入装备区。`,
            bilibili_laosaozhipao: '牢骚之袍',
            bilibili_laosaozhipao_info: '锁定技。每轮开始时，你选择一名其他角色，本轮将你与其外的角色移出游戏。然后若你的装备区有【牢骚之袍】，则你本轮在其上下家分别召唤普净和胡班；否则你摸两张牌。',
            bilibili_laosao_append: '<span style="font-family:yuanli"><li>seven!seven!<br><li>憋笑ing的偷菜狂&牢骚哥</span>',
            bilibili_xushao: '爆料许劭',
            bilibili_xushao_ab: '许劭',
            bol_pinjian: '品鉴',
            bol_pinjian_info: '每回合限一次，你可以于合适的时机发动武将牌堆顶四张牌中的一个技能并将这四张武将牌置入武将牌堆底。',
            bol_yuedan: '月旦',
            bol_yuedan_info: '每轮开始时，若当前游戏轮数为4的倍数，则你洗切武将牌堆。',
            bilibili_daxiao: '乐大乔小乔',
            bilibili_daxiao_prefix: '乐',
            bilibili_daqiao: '萌设大乔',
            bilibili_daqiao_prefix: '萌设',
            bilibili_xiaoqiao: '萌设小乔',
            bilibili_xiaoqiao_prefix: '萌设',
            bilibili_x_daqiao: '萌设大乔',
            bilibili_x_daqiao_prefix: '萌设',
            bilibili_x_xiaoqiao: '萌设小乔',
            bilibili_x_xiaoqiao_prefix: '萌设',
            bilibili_qiqin: '绮琴',
            bilibili_qiqin_info: '锁定技。①你的初始手牌数×2，且将这些牌标记为“琴”。②你的“琴”不计入手牌上限。③准备阶段，你获得位于弃牌堆的所有“琴”。',
            bilibili_yanjing: '👁👃👁',
            bilibili_yanjing_ab: '眼睛👁',
            bilibili_mingcha: '明察',
            bilibili_mingcha_info: '出牌阶段限一次，你可以展示一名其他角色的手牌，然后选择一项：1.令其交给你一张牌；2.你交给其一张牌。若你以此法交出的牌与其以此法展示的牌类别不同，你摸一张牌。',
            bilibili_huiyan: '慧眼',
            bilibili_huiyan_info: '锁定技。①其他角色的手牌对你可见。②准备阶段，你令一名其他角色选择一项：1.令你回复1点体力；2.令你摸一张牌。',
            bilibili_shenren: '神人',
            bilibili_shenren_info: '锁定技，四字神人对你造成的伤害+1；你对四字神人造成的伤害+1。',
            bilibili_yanjing_friend1: '情人姐',
            bilibili_roulin: '肉林',
            bilibili_roulin_info: '锁定技，你对异性角色/异性角色对你使用的【杀】需要额外使用一张【闪】响应。',
            bilibili_yanjing_friend2: '胖哥',
            bilibili_benghuai: '崩坏',
            bilibili_benghuai_info: '锁定技，结束阶段，你选择一项：①失去1点体力，摸一张牌；②减1点体力上限，摸两张牌。',
            bilibili_yanjing_friend3: '公鸭嗓',
            bilibili_yaowu: '耀武',
            bilibili_yaowu_info: '锁定技，当你受到伤害时，若此伤害存在女性伤害来源，则伤害来源摸一张牌，否则你摸一张牌。',
            bilibili_kamiman: '神人',
            bilibili_kamiman_info: [
                '锁定技。①四字神人对你造成的伤害+1；你对四字神人造成的伤害+1。',
                '②若你的武将牌有“眼睛”：' + [
                    `游戏开始时，你获得“神人”朋友${(() => {
                        return ['情人姐', '胖哥', '公鸭嗓'].map((name, index) => {
                            return get.poptip({
                                id: `character_bilibili_yanjing_friend${index + 1}`,
                                name: `“${name}”`,
                                type: 'character',
                                dialog: 'characterDialog',
                            });
                        }).join('、');
                    })()}。`,
                    '回合开始时，你可以任意调整“神人”朋友和“眼睛”的顺序，然后以这个顺序连续执行四个回合。',
                    '回合结束后，你选择一个“神人”朋友代替本体出场，于回合结束前切换回本体。',
                ].map(str => `<br><li>${str}`),
            ].join('<br>'),
            bilibili_kamiman_append: '<span style="font-family:yuanli"><span style="text-decoration: line-through;">看个几八，你个沙沟</span><br>孩子们，真没啥可写的</span><br><img style=width:160px src=' + lib.assetURL + 'extension/活动武将/image/default/smile8.jpg>',
            bilibili_caifuren: '蔡夫人-暗黑傀儡师',
            bilibili_caifuren_ab: '蔡夫人',
            bilibili_kuilei: '傀儡',
            get bilibili_kuilei_info() {
                const str = ' ，然后你将主将替换为姓名包含“蔡”但不包含“蔡夫人”的武将牌，将副将替换为姓名包含“夫人”但不包含“蔡夫人”的武将牌（保留此技能）。';
                return [
                    '锁定技，若你的武将牌有“蔡夫人-暗黑傀儡师”，则：',
                    '①' + (get.mode() === 'guozhan' ? '当你明置“蔡夫人-暗黑傀儡师”后' : '游戏开始时') + '，你移除另一张武将牌（若有）' + str,
                    '②当你死亡前，若你的体力上限大于0，则你取消之，将全部武将牌替换为单将“蔡夫人-暗黑傀儡师”，减1点体力上限并将体力回复至上限' + str,
                ].join('');
            },
            old_jieyan: '节言',
            old_jieyan_info: '准备阶段，你可以对一名角色造成1点伤害，然后其选择一项：1.跳过下个弃牌阶段；2.回复1点体力，其下个弃牌阶段手牌上限-2且你可以将其此阶段弃置的牌交给另一名角色。',
            old_jinghua: '镜花',
            old_jinghua_info: '当其他角色获得你的牌后，或当你交给其他角色牌后，其回复1点体力。当你失去最后的手牌后，你可以将此技能描述中的“回复”改为“失去”。',
            old_shuiyue: '水月',
            old_shuiyue_info: '当其他角色受到你造成的伤害后，其摸一张牌。当你令其他角色进入濒死状态后，你可以将此技能描述中的“摸”改为“弃置”。',
            bolshicai: '恃才',
            bolshicai_effect: '牌堆顶',
            bolshicai_info: '出牌阶段，牌堆顶的一张牌对你可见。你可以弃置一张牌，然后获得牌堆顶的一张牌，且不能再发动〖恃才〗直到此牌离开你的手牌区。',
            bilibili_xiaoyaoruyun: '逍遥如云',
            bilibili_chuandu: '传毒',
            bilibili_chuandu_info: '锁定技，准备阶段/结束阶段，你令你与场上所有拥有“染”标记的相邻其他角色获得“染”标记，然后你摸一张牌/拥有“染”标记的角色各失去1点体力。',
            bilibili_shuaiwei: '衰萎',
            bilibili_shuaiwei_info: '当你使用牌指定拥有“染”的角色为目标后/当你成为拥有“染”的角色使用牌的目标后，你可以移除其“染”标记，令此牌对其额外结算一次/对你无效。',
            bilibili_huaikui: '坏溃',
            bilibili_huaikui_info: '出牌阶段限一次，你可以进行一次判定，若结果为红/黑色，则场上所有拥有“染”标记的角色依次选择一项：①弃置两张牌/交给你一张牌；②受到1点伤害。',
            bilibili_huaikui_append: '<span style="font-family:yuanli">不好孩子们，我们的群聊都被病毒攻陷了！</span>',
            bilibili_shuijiaobuboli: '睡觉不玻璃',
            bilibili_qicai: '奇才',
            bilibili_qicai_info: '每轮开始时，你可以记录一个牌名。其他角色使用记录牌名的牌时，其须弃置一张同名牌，否则其失去1点体力。',
            bilibili_jizhi: '机智',
            bilibili_jizhi_info: '其他角色受到锦囊牌造成的伤害时，你可以弃置所有手牌并减1点体力上限，然后随机获得两个技能（发动三次后失去）。',
            bilibili_fengliang: '逢亮',
            bilibili_fengliang_info: '其他角色进入濒死状态时，若其没有副将，则你可以加1点体力上限，令该角色获得随机副将（失去体力后失去之）。',
            bilibili_guiyin: '归隐',
            bilibili_guiyin_info: '限定技，回合结束时，你可以将自己移出游戏直到下回合开始。',
            bilibili_guiyin_append: '<span style="font-family:yuanli">黄月英打了三年的复活赛，终于打赢了……</span>',
            bilibili_kuailiangkuaiyue: '蒯良蒯越',
            bilibili_chouhua: '筹画',
            bilibili_chouhua_info: '准备阶段，若以下不为无限且数值大于等于0的项数不小于2且这些项的数值和大于0，则你可以分配这些项的数值：①摸牌阶段摸牌数；②使用【杀】的次数上限；③攻击范围；④手牌上限。',
            bilibili_wuqiao: '吴乔',
            bilibili_qiajue: '跒倔',
            bilibili_qiajue_info: '摸牌阶段结束时/结束阶段，若你的手牌数点数和小于30，你可以弃置一张牌并执行一个额外的摸牌阶段；否则你将手牌上限调整为2。',
            bilibili_wuzhuwanshui: '吾猪万睡',
            bilibili_shi: '史',
            bilibili_shi_info: '①出牌阶段，对你自己使用。②当你从手牌区正面朝上失去此牌后，你失去1点体力。',
            bilibili_diaowen: '弔闻',
            bilibili_diaowen_info: `锁定技。①每轮开始时，你将牌堆顶三张牌称为“史”置于武将牌上。②每轮结束时，你可以任意分配“史”给场上本轮未使用过此“史”牌面的牌的角色并令这些角色获得一张${get.poptip('bilibili_shi')}。③一名角色使用牌后，你移去武将牌上与此牌牌名相同的“史”，然后将牌堆顶两张牌称为“史”置于武将牌上。④当你受到伤害时，你可以移去三张牌名不同的“史”，防止此伤害。`,
            bilibili_banyun: '搬运',
            bilibili_banyun_info: '每回合限一次，你可以使用或打出一张“史”，然后你将一名角色的一张牌称为“史”置于武将牌上。',
            bilibili_banyun_append: '<span style="font-family:yuanli">长史曰：<br>“史之不尽，赤之不竭。<br>搬出节奏，搬出风采。”</span>',
            bilibili_murufengchen: '沐如风晨',
            bilibili_ziyuan: '紫垣',
            bilibili_ziyuan_info: `锁定技。①当你获得此技能时或游戏开始时，你记录场上所有的势力，摸X张牌（X为场上势力数），然后你发动一次${get.poptip('bilibili_beichen')}。②每轮开始时或当你造成或受到伤害后，你记录一个此技能未记录的势力，然后你发动一次${get.poptip('bilibili_beichen')}。`,
            bilibili_beichen: '北辰',
            bilibili_beichen_info: `出牌阶段限一次，若你${get.poptip('bilibili_ziyuan')}记录了势力，则依次根据记录势力${get.poptip({
                name: '分配',
                info: '展示Y个对应势力的武将及其所有技能，然后可以从中选择至多Y个技能令一名角色获得（Y为游戏轮数+1）',
                type: 'character',
            })}对应势力的技能并令一名角色获得之直到其下一次以此法获得对应势力的技能。`,
            bilibili_xingzhu: '星主',
            bilibili_xingzhu_info: `限定技。出牌阶段或当你死亡前（死亡前发动则防止本次死亡），你可以将体力上限和体力值调整为X（X为场上势力数），然后发动一次永久保留技能的${get.poptip('bilibili_beichen')}并获得${get.poptip('bilibili_wuji')}。`,
            bilibili_xingzhu_append: '<span style="font-family:yuanli">南华老仙真是最有操作感的武将，不是吗？当然，我也是（憋笑）<br>——华风夏韵，洛水天依</span>',
            bilibili_wuji: '无极',
            bilibili_wuji_info: '锁定技。①当你获得此技能时，你本轮将所有手牌标记为“无极”。②当你获得牌时，你本轮将这些牌标记为“无极”。③每回合限一次，你使用的“无极”牌视为拥有全部应变效果且可以无条件发动。',
            bilibili_diandian: '点点',
            '#ext:活动武将/audio/die/bilibili_diandian:die': '呜呜呜你们比石头还冷漠，你们都是虾仁松鼠！',
            bilibili_siyu: '饲育',
            '#ext:活动武将/audio/skill/bilibili_siyu1': '我们要默认小菲是快乐喵，小菲不会伤心喵',
            '#ext:活动武将/audio/skill/bilibili_siyu2': '小菲自己会捡垃圾吃喵，所以是饿不死的喵',
            bilibili_siyu_info: `锁定技。①游戏开始时/当你受到伤害后，你将牌堆顶的三/一张牌称为“小菲”置于武将牌上。②回合开始时，你卜算X+1（X为你的“小菲”数）。③其他角色视为拥有${get.poptip('bilibili_olfushi')}。`,
            bilibili_olfushi: '缚豕',
            bilibili_olfushi_info: `①当你使用【杀】结算完毕后，你将此牌称为“小菲”置于拥有${get.poptip('bilibili_siyu')}的角色的武将牌上。②你可以将一名角色的一只“小菲”置入弃牌堆并摸一张牌，视为使用一张目标数或伤害+1的【杀】。`,
            '#ext:活动武将/audio/skill/bilibili_olfushi1': '猪头摸一摸，生活快乐多喵',
            '#ext:活动武将/audio/skill/bilibili_olfushi2': '猪猪不哭喵，到妈妈这里来喵',
            bilibili_tamen: '塔门',
            '#ext:活动武将/audio/skill/bilibili_tamen1': '塔不灭！塔不灭！雏草姬不灭！',
            '#ext:活动武将/audio/skill/bilibili_tamen2': '信塔门，得永生，仁慈的塔菲会宽恕你犯下的一切错误喵',
            bilibili_tamen_info: '①有牌移入或移出游戏后，你摸一张牌。②当你使用伤害类基本牌或普通锦囊牌指定目标后，你可以移去一只黑色“小菲”，令此牌不可被响应。然后若这两张牌的类别相同，则令此牌伤害+1。③一名角色进入濒死状态时，你可以移去一只红色“小菲”，令其回复1点体力，然后若其因此脱离濒死状态，你将牌堆顶的一张牌称为“小菲”置于武将牌上。',
            bilibili_tamen_append: '<span style="font-family:yuanli">无需王座与冠冕，我即是所有平行世界的奇迹，让流星焚尽虚妄，独属于永雏塔菲的传说，现在开演！</span>',
            bilibili_simayi: '单机神司马懿',
            bilibili_simayi_ab: '神司马懿',
            bilibili_simayi_prefix: '神',
            old_dongxie: '列传董翓',
            old_dongxie_ab: '董翓',
            bilibili_longjiuzhen: '美少爱蒂朵',
            bilibili_xingcan: '星璨',
            bilibili_xingcan_info: '准备阶段和结束阶段，你可以选择一种花色并进行判定，若判定结果与你选择的花色相同，你可以令一名其他角色翻面。',
            bilibili_linglai: '灵籁',
            bilibili_linglai_tag: 'invisible',
            bilibili_linglai_info: '一名角色的出牌阶段开始时，你可以观看其手牌并选择其中一张牌。此牌因/不因使用进入弃牌堆后，你摸三/一张牌。',
            bilibili_yongtan: '咏叹',
            bilibili_yongtan_info: '当你于出牌阶段使用牌结算完毕后，你可以选择一个点数并令一名其他角色进行判定，若判定结果与选择的点数相同，则其失去所有体力。',
            bilibili_yongtan_append: `<span style='font-family:yuanli'>${[
                '神：现在你是世界上最强的赛尔号高手了。',
                '牢宁：那牢美呢。',
                '神：牢美吗，好久没有人这么叫我了。',
            ].join('<br>')}</span>`,
            bilibili_liuguanzhang: '三人组',
            bilibili_waifa: '外伐',
            bilibili_waifa_info: '出牌阶段开始时，你可以弃置三的倍数张牌并摸三倍数量的牌。若你弃置的类别包含：基本牌，本回合你使用的前X张基本牌无距离和次数限制（X为其中的非基本牌数）；锦囊牌，本回合你使用的前Y张锦囊牌可以额外增加和减少至多Y名目标（Y为其中的非锦囊牌数）；装备牌，本回合你使用的前Z张装备牌时摸Z张牌（Z为其中的非装备牌数）。',
            bilibili_xiahoudun: '夏侯惇',
            bilibili_ganglie: '刚烈',
            bilibili_ganglie_info: '①当你受到伤害后，你可以对伤害来源造成X点伤害（X为伤害值），若其体力值大于你则X+1。②当你造成伤害时，你可以弃置受伤角色Y张牌（Y为你已损失的体力值且至少为1），然后其回复1点体力，且你可以将其弃置的红色牌交给一名角色。',
            bfake_zhanghua: '蝶设张华',
            bfake_zhanghua_prefix: '蝶设',
            boljianhe: '剑合',
            boljianhe_info: '出牌阶段，你可以重铸至少两张同名牌或装备牌，令一名角色选择一项：①重铸X-1张与本次重铸的牌类别相同的牌；②受到1点伤害。',
            bolbihun: '弼昏',
            bolbihun_info: '锁定技，当你于一名角色的回合内摸牌后，你选择本回合未选择过的一项：①摸两张牌；②将手牌数弃置至当前回合角色的手牌上限；③本回合不能对回合角色外的角色使用牌。',
            bfake_hanshao: '蝶设韩融',
            bfake_hanshao_prefix: '蝶设',
            bollianhe: '连和',
            bollianhe_info: '出牌阶段限一次。你可以横置两名角色并令其同时选择一项：1.令你摸一张牌；2.令你获得其一张牌。然后其获得以下效果：其下个出牌阶段结束时，重复选择至其所选项序号数之和大于X（X为其此阶段获得牌数，且至多为5）。',
            bolhuanjia: '缓颊',
            bolhuanjia_info: '出牌阶段限一次。你可以拼点。赢的男性角色下次发动“出牌阶段限一次”的技能后复原之。',
            bolxumin: '恤民',
            bolxumin_info: '宗族技，限定技。出牌阶段，你可以将武将牌翻面，视为对任意名手牌数少于你的角色使用【五谷丰登】。',
            bfake_hanrong: '蝶设韩韶',
            bfake_hanrong_prefix: '蝶设',
            bolfangzhen: '放赈',
            bolfangzhen_info: '出牌阶段限一次。你可以横置一名角色，将手牌摸至X张并交给其任意张牌。若为第X次发动本技能，你翻面（X为其座次号且至多为5）。',
            bolliuju: '留驹',
            bolliuju_info: '出牌阶段限一次。你可以拼点并使用拼点牌中的非基本牌。若你输或拼点者相互距离因此变化，你复原武将牌或武将牌上的一个技能。',
            bilibili_yirenyixiaojian: '一人一小建',
            bilibili_ranzhi: '燃脂',
            bilibili_ranzhi_info: '锁定技，出牌阶段开始时，你视为使用【火攻】，此【火攻】增加你为额外目标，且若你有可弃置的牌则必须弃置。若此牌造成过伤害，则你回复X点体力（X为伤害值），然后摸体力值张牌。',
            bilibili_wuying: '无影',
            bilibili_wuying_info: '回合开始时，你可以选择两名其他角色，你有概率交换这两名角色的座位。若交换失败，则与你阵营相同/不同的角色会向你砸蛋/送花。',
            bilibili_jiabin: '嘉宾',
            bilibili_jiabin_info: `锁定技，游戏开始时，你将${get.poptip('bilibili_jiabinzheng')}置入装备栏。你的装备区每置入/失去一张${get.poptip('bilibili_jiabinzheng')}，你回复1点体力并摸一张牌/你失去1点体力。`,
            bilibili_jiabin_append: '<span style="font-family:yuanli">王昌龄吗？</span>',
            bilibili_jiabinzheng: '嘉宾证',
            bilibili_jiabinzheng_info: '进入年终盛典嘉宾组的必备物品......<br>（至于效果嘛，没有）',
            bilibili_caocao: '曹操',
            bilibili_hanhuang: '汉煌',
            bilibili_hanhuang_info: '锁定技，游戏开始时，你选择一名友方角色，你与其共享手牌区和武器栏，你或其造成伤害后对方摸一张牌，你与其使用对方的牌无距离次数限制。',
            bilibili_hanhuang_info_identity: '锁定技，游戏开始时，你选择一名其他角色，你与其共享手牌区和武器栏，你或其造成伤害后对方摸一张牌，你与其使用对方的牌无距离次数限制。',
            bilibili_hanhuang_info_guozhan: '锁定技，游戏开始时，你选择一名其他角色，你与其共享手牌区和武器栏，你或其造成伤害后对方摸一张牌，你与其使用对方的牌无距离次数限制。',
            bilibili_qiangang: '乾纲',
            bilibili_qiangang_info: `出牌阶段，你可${get.poptip('olrumo')}，失去${get.poptip('bilibili_tianen')}，然后本局你使用指定唯一目标的【杀】均执行目标所选择过的所有“权御”效果。`,
            bilibili_zhugeliang: '诸葛亮',
            bilibili_zhugeliang_ab: '新三奶龙',
            bilibili_lianbing: '炼兵',
            bilibili_lianbing_info: '登场，随机获得一个“诸葛亮”的技能，在下家召唤一个与你胜利条件相同且由你操纵的士兵。当你失去♦♣牌后，士兵获得等量兵符。',
            bilibili_lianbing_append: `<span style='font-family:yuanli'>关于士兵：${[
                '士兵初始拥有满装备，4手牌与1兵符',
                '士兵扣减体力改为失去等量兵符，没有兵符的士兵视为移出游戏',
                '士兵拥有两个技能槽，场上有角色死亡后，士兵随机获得一个场上角色未拥有的技能',
                '士兵召唤者阵亡后士兵阵亡',
            ].map(i => `<li>${i}`).join('<br>')}</span>`,
            bilibili_shibing: '士兵',
            bilibili_shibing2: '召唤物',
            bilibili_majun: '马钧',
            bilibili_majun_ab: '水转百戏',
            bilibili_qiaosi: '巧思',
            bilibili_qiaosi_info: '出牌阶段限一次，你可以表演水转百戏图，若表演成功，你获得对应的卡牌，然后选择一项：①将等量张牌交给一名其他角色；②弃置等量张牌。',
        },
    };
    for (const i in huodongcharacter.character) {
        if (Array.isArray(huodongcharacter.character[i])) huodongcharacter.character[i] = get.convertedCharacter(huodongcharacter.character[i]);
        huodongcharacter.character[i].trashBin ??= [];
        huodongcharacter.character[i].dieAudios ??= [];
        if (_status['extension_活动武将_files']) {
            const files = _status['extension_活动武将_files'];
            if (files.image.character.files.includes(`${i}.jpg`)) huodongcharacter.character[i].img = `extension/活动武将/image/character/${i}.jpg`;
            else {
                const skin = huodongcharacter.character[i].trashBin.find(str => str.startsWith('character:'))?.split(':')[1];
                if (skin && files.image.character.files.includes(`${skin}.jpg`)) huodongcharacter.character[i].img = `extension/活动武将/image/character/${skin}.jpg`;
            }
            if (files.audio.die.files.includes(`${i}.mp3`)) {
                huodongcharacter.character[i].dieAudios.push('ext:活动武将/audio/die:true');
                huodongcharacter.translate[`#ext:活动武将/audio/die/${i}:die`] ??= '点击播放阵亡配音';
            }
            if (files.image.skin[i]) huodongcharacter.character[i].skinPath = `ext:活动武将/image/skin/${i}/`;
        }
        const clans = huodongcharacter.character[i].clans;
        if (clans?.containsSome('宿舍群', '肘击群', '活动群')) {
            const groups = ['宿舍群', '肘击群', '活动群'].filter(i => clans.includes(i)).map(i => { return { '宿舍群': 'bilibili_sushe', '肘击群': 'bilibili_zhouji', '活动群': 'bilibili_huodong' }[i] });
            if (groups.length > 1) huodongcharacter.character[i].doubleGroup = groups;
            else huodongcharacter.character[i].group = groups[0];
        }
    }
    //“萌新自设”前缀
    lib.namePrefix.set('萌设', {
        color: '#ff6a6a',
        showName: '萌',
    });
    lib.namePrefix.set('蝶设', {
        color: '#ff6a6a',
        showName: '蝶',
    });
    //添加群聊势力
    game.addGroup('bilibili_sushe', '寝室', '宿舍群', {
        color: [
            [58, 0, 102, 1],
            [111, 0, 255, 1],
            [163, 102, 255, 1],
            [209, 179, 255, 1],
        ],
        image: 'ext:活动武将/image/default/bilibili_sushe.png'
    });
    game.addGroup('bilibili_zhouji', '肘击', '肘帝群', {
        color: [
            [0, 106, 128, 1],
            [0, 217, 255, 1],
            [102, 236, 255, 1],
            [179, 247, 255, 1],
        ],
        image: 'ext:活动武将/image/default/bilibili_zhouji.png'
    });
    game.addGroup('bilibili_huodong', '活动', '活动群', {
        color: [
            [153, 136, 0, 1],
            [255, 238, 0, 1],
            [255, 245, 102, 1],
            [255, 251, 179, 1],
        ],
        image: 'ext:活动武将/image/default/bilibili_huodong.png'
    });
    lib.group.removeArray(['bilibili_sushe', 'bilibili_zhouji', 'bilibili_huodong']);
    lib.arenaReady.push(function () {
        lib.element.player.changeGroup = function (group, log, broadcast) {
            const next = game.createEvent('changeGroup');
            next.player = this;
            next.group = group;
            next.log = typeof log === 'boolean' ? log : true;
            next.broadcast = broadcast !== 'nobroadcast';
            next.setContent('changeGroup');
            return next;
        };
    });
    lib.config.all.sgscharacters.push('huodongcharacter');
    lib.translate['huodongcharacter_character_config'] = '<span style="font-family: xingkai">其他武将</span>';
    if (ui?.create?.menu) {
        const originLoading = ui.create.menu;
        ui.create.menu = function () {
            const result = originLoading.apply(this, arguments);
            const characterPack = Array.from(document.getElementsByTagName('div')).find(div => div.innerHTML === '武将');
            if (characterPack) {
                const originClick = characterPack.onclick || function () { };
                characterPack.onclick = () => {
                    originClick.apply(this, arguments);
                    const characterPackage = Array.from(document.querySelectorAll('.menubutton.large')).find(div => div.innerHTML === lib.translate['huodongcharacter_character_config']);
                    if (characterPackage) {
                        const originClick2 = characterPackage.onclick || function () { };
                        characterPackage.onclick = () => {
                            originClick2.apply(this, arguments);
                            const rightPane = document.querySelector('.menu-buttons.leftbutton');
                            if (rightPane && !rightPane.init) {
                                rightPane.init = true;
                                const cfgNodes = rightPane.querySelectorAll('.config.toggle');
                                for (let i = 0; i < cfgNodes.length; i++) {
                                    if (cfgNodes[i].textContent === '活动群名人堂') {
                                        const addIntro = document.createElement('div');
                                        addIntro.classList.add('config', 'pointerspan');
                                        addIntro.innerHTML = '<span style="font-family: yuanli">名人堂前言：<br>萌新特设，旨在纪念在萌新的身边对活动武将群聊发展起到重要作用的人</span>';
                                        cfgNodes[i].parentNode.insertBefore(addIntro, cfgNodes[i]);
                                    }
                                    if (cfgNodes[i].textContent === '宿舍/肘击群杂谈') {
                                        const addIntro = document.createElement('div');
                                        addIntro.classList.add('config', 'pointerspan');
                                        addIntro.innerHTML = '<span style="font-family: yuanli">杂谈前言：<br>双群自设系列，萌新转型中和戏志才帮你实现自设愿望（孩子们，不要搞军备竞赛）</span>';
                                        cfgNodes[i].parentNode.insertBefore(addIntro, cfgNodes[i]);
                                    }
                                }
                            }
                        };
                    }
                };
            }
            return result;
        };
    }
    return huodongcharacter;
};

export default packs;