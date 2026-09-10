//========================================= 武将 =========================================//
'use strict';
let 假装无敌CharacterLoad = false;
let 假装无敌Card = false;
// Copy card data using the current engine; keep new card identity and DOM nodes intact.
export function copyCardAttributes(card, get) {
    const attributes = {};
    for (const [key, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(card))) {
        if (!descriptor.enumerable || !("value" in descriptor) || ["node", "cardid", "_cardid", "parentNode"].includes(key)) continue;
        const value = descriptor.value;
        if (typeof value === "function" || (typeof Node !== "undefined" && value instanceof Node)) continue;
        attributes[key] = value;
    }
    return get.copy(attributes);
}
export function createCharacterPack(lib, game, ui, get, ai, _status) {
    let 假装无敌 = {
        name: '假装无敌Pack',
        // 武将
        character: {
            "thelandfool": ["male", "shen", Infinity, ["ymqiangsha"], ['forbidai', 'boss', 'bossallowed', 'qyboss', "des:地表最强神仙，发动技能后秒杀一切凡间武将，但被“清瑶”倒吊着打。而且是个SB，因此屈居第二。"]],
            "qy_qyhanxing": ["male", "shen", 4, ["ymdujie", "ymqianxing", "ymxingluo"], ["qingyao_xian", "forbidai", "die:假装无敌", "des:冷月的师兄，偶然得知飞升仙界的仪式秘法，正逢门派存亡之际，欲意成仙带领门派走出危机，铤而走险。为准备仪式不惜杀伐万民、掠夺天下奇珍，仪式器具准备完成时，已然忘却成仙的本意，转而崇尚获得至高的神力荡平敌人。<br><li>阵亡台词：一世努力都做了尘土，难道天下生灵就能重生吗？", "qyboss"]],
            "qy_qylengyue": ["female", "shen", 4, ["ymdujie", "ymtayue", "ymyueyin"], ["qingyao_xian", "forbidai", "die:假装无敌", "des:寒星的师妹，在寒星准备飞升仪式的器具走火入魔前多次劝阻甚至囚禁寒星，但皆不可化解其心魔。最终在多人的鼓动下，冷月渐觉若想了却寒星的心魔，需完成其夙愿，遂在其仪式开始时协助其召唤。<br><li>阵亡台词：为了这一世的梦而生灵涂炭，这真的值得吗？", "qyboss"]],
            "qy_qyqingyaoxuying": ["female", "qingyao_xian", 3, ["ymhuajing", "ymfengqin", "ymyucheng", "ymtuoshu", "ymtianjie"], ["qingyao_xian","victory:假装无敌", "die:假装无敌", "forbidai", "des:清瑶是仙界第一位拥有观测时空尽头能力的神仙，因此近乎知晓了世间万物变换之理。传闻与她相见便能得到无上的智慧和满足心中最深的执念，甚至亦可飞升仙界、窥探天下，但得到这一切之前似乎会失去自己的初心。可是，纵然拥有这改变世间的力量，清瑶也为了自己心中的秘密与执念而奔波。所以，全知全能真的能满足人们的一切吗？<br><li>阵亡台词：化作尘世千秋愿，长安之后更长安。", "qyboss"]],
            "qy_qyjiaqi": ["female", "qingyao_xian", 3, ["ymhuajing", "ymshuyun", "ymshigu", "ymguiyuan", "ymtianyu"], ["qingyao_xian", "forbidai", "die:假装无敌", "des:“蒹葭苍苍，白露为霜，所谓伊人，在水一方”，“葭绮”似乎并非她的本名，当人们第一次见到她的身影时，她正在那湖畔边，一身白衣举袂似掩离弦。岸边的桃花红胜晚霞亦如她朱唇轻启，稍纵即逝的时刻引得有幸见到她的人念念不忘。葭绮身上似乎隐藏着巨大的秘密，引得清瑶苦寻七年终至此地，可萧萧数年的热忱也难融化葭绮半生风雪。<br><li>阵亡台词：桃花微雨是江南，四十八骨紫竹伞……", "qyboss"]],
            "qy_qyzuoci": ["male", "qun", "3/4", ["ymhuashen", "ymxinsheng"], ["des:左慈，字元放，东汉末方士，汉族，庐江（今安徽庐江西南）人。在道教历史上，东汉时期的丹鼎派道术是从他一脉相传。"]],
            "qy_qycaoying": ["female", "wei", 4, ["ymlingren", "ymfujian"], ["des:曹婴是在电影《三国志之见龙卸甲》中登场的虚拟人物，由李美琪饰演。曹婴是曹操的孙女，弓马娴熟，文武双全，深得曹操的用兵之道及心术。于凤鸣山一战中担任魏军大都督阻止诸葛亮北伐并因罗平安的告密而全歼关兴、张苞、赵云率领的蜀军部队。"]],
            "qy_qyjiangwei": ["male", "shu", 4, ["ymguji", "ymhaixian", "ymzhonglie"], ["des:字伯约，天水冀人。三国时期蜀汉著名将领、军事统帅。原为曹魏天水郡的中郎将，后降蜀汉，官至凉州刺史、大将军。诸葛亮去世后继承诸葛亮的遗志，继续率领蜀汉军队北伐曹魏，与曹魏名将陈泰、郭淮、邓艾等多次交手。"]],
            "qy_qyzhangjiao": ["male", "qun", 3, ["ymtaiping", "ymqiyi", "ymhuangtian", "ymtiandao"], ["zhu", "des:乱世的开始，黄巾起义军首领，太平道创始人。张角早年信奉黄老学说，对在汉代十分流行的谶纬之学也深有研究，对民间医术 、巫术也很熟悉。"]],
            "qy_qyzhangxingcai": ["female", "shu", 3, ["ymqiangwu", "ymjiejun", "ymkuidi"], ["des:蜀名将张飞与夏侯氏所生之女，刘禅的妻子，史上称为“敬哀皇后”。"]],
            "qy_qyyuji": ["male", "qun", 3, ["ymguhuo", "ymfushu"], ["des:自号太平道人，琅琊人，在吴郡、会稽一带为百姓治病，甚得人心。孙策怒之，以惑人心为由斩之，后策常受吉咒而亡。"]],
            "qy_qyliru": ["male", "qun", 3, ["ymduce", "ymdushi", "ymzhuzhuo"], ["des:董卓的首席谋士，为董卓所亲信，大小事宜皆与其商议。董卓趁乱进京、说降吕布、废立皇帝、迁都长安等举动，均离不开李儒的参谋之功，并奉命毒杀皇帝刘辩。李傕被曹操击败后，李儒从此不知所踪，消失在历史长河中。"]],
            "qy_qyjiaxu": ["male", "qun", 3, ["ymxiance", "ymzhukou"], ["des:字文和，武威姑臧人。三国时期魏国著名谋士。曾先后担任三国军阀李傕、张绣、曹操的谋士。官至魏国太尉，谥曰肃侯。"]],
            "qy_qyhuangyueying": ["female", "shu", 3, ["ymlinglong", "ymjiqiao", "ymqicai"], ["des:荆州沔南白水人，沔阳名士黄承彦之女，诸葛亮之妻，诸葛瞻之母。容貌甚丑，而有奇才：上通天文，下察地理，韬略近于诸书无所不晓，诸葛亮在南阳闻其贤而迎娶。"]],
            "qy_qyzhangrang": ["male", "qun", "3/5", ["ymtaoluan", "ymhuoluan"], ["des:汉中常侍。同赵忠、曹节、段珪等为“十常侍”，为灵帝所宠。让等专权乱政、卖官索财，朝野皆痛恨之。郎中张钧上书奏请诛杀十常侍，帝不允，让等阴杀钧。及灵帝崩，大将军何进欲杀让等，让阴结何太后，招进入宫，斩杀之。部将袁绍引兵攻让，让等劫帝走河上。追急，让投水自尽。"]],
            "qy_qysunce": ["male", "wu", 4, ["ymjiang", "ymhunyou", "ymtaoni", "ymzhiba"], ["zhu", "des:字伯符，吴郡富春人。孙坚长子，孙权长兄。东汉末年割据江东一带的军阀，汉末群雄之一，三国时期吴国的奠基者。三国演义中绰号“小霸王”，统一江东。在一次狩猎中为刺客所伤，不久后身亡，年仅二十六岁。其弟孙权接掌孙策势力，并于称帝后，追谥孙策为长沙桓王。"]],
            "qy_qyzhaoyun": ["male", "shu", 5, ["ymjiuzhu", "ymhuwei"], ["des:字子龙，常山真定人。身长八尺，姿颜雄伟。长坂坡单骑救阿斗，先主云：“子龙一身都是胆也。”"]],
            "qy_qysimayan": ["male", "jin", 4, ["ymbishan", "ymbawang", "ymguijin"], ["zhu", "des:字安世，河内郡温县人。晋朝开国皇帝，晋宣帝司马懿之孙，晋文帝司马昭嫡长子，晋元帝司马睿的嗣父，母为文明皇后王元姬。司马炎逼迫魏元帝曹奂禅让，即位为帝，定国号为晋，改元泰始。"]],
            "qy_qyjianyong": ["male", "shu", 4, ["ymqiaoshui", "ymzongshi"], ["des:简雍为刘备同乡，年少时与刘备相识。黄巾之乱时，刘备加入对抗黄巾军的战争，简雍便跟随他奔走。常作为谈客，往来使命，刘备围成都时简雍作为刘备使臣成功劝说刘璋投降。简雍擅于辩论、议事。性情简单直接、不拘小节。"]],
            "qy_qyzhugeliang": ["male", "shu", 3, ["ymdunjia", "ymqixing", "ymxuming"], ["des:字孔明、号卧龙，汉族，琅琊阳都人，三国时期蜀汉丞相、杰出的政治家、军事家、发明家、文学家。在世时被封为武乡侯，死后追谥忠武侯，后来东晋政权推崇诸葛亮军事才能，特追封他为武兴王。诸葛亮为匡扶蜀汉政权，呕心沥血、鞠躬尽瘁、死而后已。其代表作有《前出师表》、《后出师表》、《诫子书》等。曾发明木牛流马等，并改造连弩，可一弩十矢俱发。于234年在宝鸡五丈原逝世。"]],
            "qy_qysimayi": ["male", "wei", 3, ["ymrenshi", "ymguicai", "ymfanpan"], ["des:晋宣帝，字仲达，河内温人。曾任职过曹魏的大都督，太尉，太傅。少有奇节，聪明多大略，博学洽闻，伏膺儒教，世之鬼才也。"]],
            "qy_qyzhangfei": ["male", "shu", "4/6", ["ymzuijiu", "ympaoxiao", "ymxiaoyong"], ["des:字翼德，涿郡人，燕颔虎须，豹头环眼。有诗云：“长坂坡头杀气生，横枪立马眼圆睁。一声好似轰雷震，独退曹家百万兵”。"]],
            "qy_qymachao": ["male", "shu", 4, ["ymtieji", "ymmengshi"], ["des:字孟起，扶风茂陵人。面如冠玉，目如流星，虎体猿臂，彪腹狼腰，声雄力猛。因衣着讲究，举止非凡，故人称“锦马超”。麾铁骑，捻金枪。"]],
            "qy_qydongzhuo": ["male", "qun", '6/8', ["ymnajian", "ymbaonue", "ymhengzheng"], ["zhu", "des:字仲颖，陇西临洮人。东汉末年少帝、献帝时权臣，西凉军阀。官至太师、郿侯。其为人残忍嗜杀，倒行逆施，招致群雄联合讨伐，但联合军在董卓迁都长安不久后瓦解。后被其亲信吕布所杀。"]],
            "qy_qyzhangliao": ["male", "wei", 4, ["ymtuxi", "ymdanzhan"], ["des:字文远，魏雁门马邑人。官至前将军、征东将军、晋阳侯。武功高强，又谋略过人，多次建立奇功，以800人突袭孙权十万大军，皆望风披靡。"]],
            "qy_qyliubei": ["male", "shu", 4, ["ymrende", "ymjieyi"], ["zhu", "des:先主姓刘，讳备，字玄德，涿郡涿县人，汉景帝子中山靖王胜之后也。以仁德治天下。"]],
            "qy_qydaqiao": ["female", "wu", 3, ["ymguose", "ymliuli"], ["des:庐江皖县人，为乔公长女，孙策之妻，小乔之姊。与小乔并称为“江东二乔”，容貌国色流离。"]],
            "qy_qypangtong": ["male", "shu", 3, ["ymlianhuan", "ymniepan"], ["des:庞统，字士元，襄阳（治今湖北襄阳）人。三国时刘备帐下谋士，官拜军师中郎将。才智与诸葛亮齐名，人称“凤雏”。在进围雒县时，统率众攻城，不幸被流矢击中去世，时年三十六岁。追赐统为关内侯，谥曰靖侯。庞统死后，葬于落凤庞统墓坡。"]],
            "qy_qysunshangxiang": ["female", "wu", 3, ["ymxiaoji", "ymjieyin", "ymliangzhu"], ["des:孙夫人，乃孙权之妹。刘备定荆州，孙权进妹与其结姻，重固盟好。孙夫人才捷刚猛，有诸兄之风。后人为其立庙，号曰“枭姬庙”。"]],
            "qy_qyxiahoudun": ["male", "wei", "4/6", ["ymganglie", "ymxunshu", "ymshimu"], ["des:字元让，沛国谯人。有拔矢啖睛之勇，性格勇猛刚烈。少年时以勇气闻名于乡里。曹操起兵，夏侯惇是其最早的将领之一。与吕布军交战时，曾一度被擒为人质，又被流矢射瞎左眼。多次为曹操镇守后方，曾率军民阻断太寿河水，筑陂塘灌溉农田，使百姓受益，功勋卓著。官至大将军，封高安乡侯。"]],
            "qy_qyguanyu": ["male", "shu", "4/5", ["ymzhanjiang", "ymguagu", "ymlongxiang"], ["des:字云长，本字长生，并州河东解州人。五虎上将之首，爵至汉寿亭侯，谥曰“壮缪侯”。被奉为“关圣帝君”，崇为“武圣”。"]],
            "qy_qyxunyu": ["male", "wei", 3, ["ymquhu", "ymjieming", "ymkonghe"], ["des:荀彧，字文若，颍川颍阴（今河南许昌）人。东汉末年曹操帐下首席谋臣，杰出的战略家。自小被世人称作“王佐之才”。"]],
            "qy_qycaocao": ["male", "wei", 4, ["ymjianxiong", "ymguixin"], ["zhu", "des:魏武帝曹操，字孟德，小名阿瞒、吉利，沛国谯人。精兵法，善诗歌，乃治世之能臣，乱世之奸雄也。"]],
            "qy_qycaochun": ["male", "wei", 4, ["ymshanjia", "ymhubao"], ["des:字子和，沛国谯（今安徽亳州）人。东汉末年曹操麾下将领，曹仁之弟。曹纯是曹操部下精锐部队“虎豹骑”的统领者之一，因在平定北方的战役中颇有功绩，被加封为高陵亭侯。死后谥曰威侯。曹纯擅战，甚得人心，为人重纲纪，不失理智，好学问，敬爱学士，闻名天下。"]],
            "qy_qyxiahouyuan": ["male", "wei", 4, ["ymshensu", "ymdingzui"], ["des:字妙才，沛国谯人。东汉末年曹操部下名将，夏侯惇之族弟，八虎骑之一。群雄征讨董卓时随曹操一同起兵，后征战四方，屡立功勋。在平定马超叛乱后负责西北防线的镇守。公元219年刘备攻打汉中，被刘备部将黄忠所杀。"]],
            "qy_qyhuangzhong": ["male", "shu", 4, ["ymliegong", "ymchuanyang"], ["des:字汉升，今河南南阳人。汉末三国时期蜀汉名将。本为刘表部下中郎将，后归刘备，并助刘备攻益州刘璋，在定军山一战中阵斩曹操部下名将夏侯渊。备称汉中王后改封后将军，赐关内侯。"]],
            "qy_qyzhanghe": ["male", "wei", 4, ["ymqiaobian", "ymjueji"], ["des:字儁乂，河间鄚人。三国时期魏国名将。官渡之战时，本为袁绍部将的张郃投降了曹操，并在曹操帐下多立功勋，于曹魏建立后加封为征西车骑将军。诸葛亮六出祁山之间，张郃多次抵御蜀军的进攻，于公元231年在木门道被诸葛亮设伏射死。后谥曰壮侯。为曹魏“五子良将”之一。"]],
            "qy_qyyuejin": ["male", "wei", 4, ["ymxiaoguo", "ymzhuzhen"], ["des:字文谦，魏“五子良将”之一。容貌短小，以胆烈跟从曹操，南征北讨，战功无数。从击袁绍于官渡，奋勇力战，斩袁绍部将淳于琼。又从击袁绍子谭、尚于黎阳，斩其大将严敬。从平荆州，留屯襄阳，进击关羽、苏非等人，击退其众，南郡诸郡的山谷蛮夷都前往乐进处投降。后来从曹操征孙权，假进节。曹操回师后，留乐进与张辽、李典屯于合肥。又以乐进数有军功，迁右将军。建安二十三年逝世，谥曰威侯。"]],
            "qy_qyyujin": ["male", "wei", 5, ["ymjieyue", "ymyizhong"], ["des:字文则，泰山钜平人。三国时期曹魏武将。本为鲍信部将，后属曹操，曹操称赞他可与古代名将相比。然而在建安二十四年的襄樊之战中，于禁在败给关羽后投降，致使一代名将晚节不保。"]],
            "qy_qyxuhuang": ["male", "wei", 4, ["ymduanliang", "ymjiezi"], ["des:字公明，河东杨人。三国时期曹魏名将，本为杨奉帐下骑都尉，杨奉被曹操击败后转投曹操，在曹操手下多立功勋，参与官渡、赤壁、关中征伐、汉中征伐等几次重大战役。"]],
            "qy_qysunquan": ["male", "wu", 4, ["ymzhiheng", "ymtusi"], ["zhu", "des:吴大帝，字仲谋，吴郡富春县人。统领吴与蜀魏三足鼎立，制衡天下。合肥之战大败于张辽，晚年杀死多名子嗣。"]],
            "qy_qyxiaoqiao": ["female", "wu", 3, ["ymtianxiang", "ymhongyan"], ["des:庐江皖县人也。父桥国老德尊于时。小乔国色流离，资貌绝伦。建安三年，周瑜协策攻皖，拔之。娶小乔为妻。后人谓英雄美女，天作之合。"]],
            "qy_qyzhouyu": ["male", "wu", 3, ["ymyingzi", "ymfanjian", "ymqinyin"], ["des:字公瑾，庐江舒县人，任东吴三军大都督，雄姿英发，人称“美周郎”。赤壁之战前，巧用反间计杀了精通水战的叛将蔡瑁、张允。"]],
            "qy_qydiaochan": ["female", "qun", 3, ["ymyuhun", "ymkongshen"], ["des:中国古代四大美女之一，有闭月羞花之貌。司徒王允之义女，由王允授意施行连环计，离间董卓、吕布，借布手除卓。后貂蝉成为吕布的妾。"]],
            "qy_qyhuanggai": ["male", "wu", 4, ["ymkurou", "ymzhaxiang"], ["des:字公覆，零陵郡泉陵县人。官至偏将军、武陵太守。以苦肉计骗曹孟德，亲往诈降，火烧战船，重创敌军。"]],
            "qy_qylvbu": ["male", "qun", 5, ["ymwushuang", "ymbaonu"], ["des:字奉先，五原郡九原县人。三国第一猛将，曾独力战刘关张三人，其武力世之无双。时人语曰：“人中有吕布，马中有赤兔。”"]],
            "qy_qycaoren": ["male", "wei", 5, ["ymjushou", "ymlizhan", "ymkuiwei"], ["des:字子孝，沛国谯人，曹操的从弟。三国时期曹魏名将，跟从曹操征战四方，破袁术、攻陶谦、擒吕布、败刘备，参加官渡之战，官至大司马。谥曰忠侯。"]],
            "qy_qyhuatuo": ["male", "qun", 3, ["ymshengshou", "ymqingnang", "ymjijiu"], ["des:字元化，一名旉，沛国谯人，“建安三神医”之一。集平生之所得著《青囊经》，现已失传。"]],
            "qy_qylusu": ["male", "wu", 3, ["ymdimeng", "ymhaoshi"], ["des:字子敬，汉族，临淮东城人，中国东汉末年东吴的著名军事统帅。他曾为孙权提出鼎足江东的战略规划，因此得到孙权的赏识，于周瑜死后代替周瑜领兵，守陆口。曾单刀赴会关羽于荆州。"]],
            "qy_qylvmeng": ["male", "wu", "4/4/2", ["ymkeji", "ymandu"], ["des:字子明，汝南富陂人。陈寿评曰：“吕蒙勇而有谋断，识军计，谲郝普，擒关羽，最其妙者。初虽轻果妄杀，终于克己，有国士之量，岂徒武将而已乎！”"]],
            "qy_qyluxun": ["male", "wu", 4, ["ymqianxun", "ymlianying"], ["des:本名陆议，字伯言，吴郡吴县人。历任东吴大都督、丞相。吴大帝孙权兄孙策之婿，世代为江东大族。以谦逊之书麻痹关羽，夺取荆州，又有火烧连营大破蜀军。"]],
            "qy_qyxuchu": ["male", "wei", 5, ["ymluoyi", "ymchandou"], ["des:字仲康，谯国谯县人。和典韦一同统率着曹操的亲卫队“虎卫军”。因为他十分勇猛，所以有“虎痴”的绰号。曾有裸衣斗马超之举。"]],
            "qy_qyliuxie": ["male", "qun", 4, ["ymdameng", "ymtianming", "ymfuhan"], ["des:字伯和，又字合。汉族，祖籍沛县，生于洛阳。汉灵帝第三子，被董卓迎立为帝。董卓被王允和吕布诛杀后，董卓部将李傕等攻入长安，再次挟持了他，后来逃出长安。公元196年，曹操控制了刘协，并迁都许昌，“挟天子以令诸侯”。公元220年，曹操病死，刘协被曹丕控制，随后被迫禅让于曹丕。"]],
            "qy_qyyanliang": ["male", "qun", 4, ["ymxiaowu", "ymbingwei"], ["des:东汉末年袁绍部将，性格促狭，虽骁勇不可独任，为一夫之勇。官渡之战中，袁绍令颜良进攻白马（今河南滑县）。司空曹操采用军师荀攸“声东击西、轻兵掩袭”之计，亲自率军兼行，击破颜良军。颜良本人也被关羽斩杀，白马之围遂解。"]],
            "qy_qywenchou": ["male", "qun", 4, ["ymzhushi", "ymbingwei"], ["des:东汉末年袁绍部将，为一夫之勇。建安五年（200年），带领左将军刘备进驻延津，误中曹操军师荀攸的“饵敌”之计，其麾下“五六千骑”惨败于“不满六百”的曹军骑兵。文丑本人也死于乱军之中，葬于河南省禹州市。"]],
            "qy_qyyanliangwenchou": ["male", "qun", 4, ["ymshuangxiong", "ymxiongbing"], ["des:东汉末年河北袁绍部下武将，素有威名。颜良与文丑一起作为袁绍军队的勇将而闻名。建安四年（199），袁绍以颜良、文丑为将，率精卒十万，准备攻许都；次年，兵进黎阳，遣颜良攻白马。终均亡于关羽刀下。","unseen"]],

        },
        // 武将小分栏
        characterSort: {
            假装无敌Pack: {
                dibiaodier: ['thelandfool'],
                huanmengzhidie: ['qy_qyzhangjiao', 'qy_qyyuji', 'qy_qyhuangyueying', 'qy_qyzhugeliang', 'qy_qyzhangfei', 'qy_qyzhangliao', 'qy_qyliubei', 'qy_qydaqiao', 'qy_qysunshangxiang', 'qy_qyguanyu', 'qy_qyxunyu', 'qy_qycaocao', 'qy_qysunquan','qy_qydiaochan','qy_qylvbu','qy_qycaoren','qy_qyliuxie', 'qy_qyyanliang', 'qy_qywenchou', 'qy_qyyanliangwenchou'],
               wanlingzhiying: ['qy_qycaoying', 'qy_qyzuoci', 'qy_qyjiangwei', 'qy_qyzhangxingcai', 'qy_qyliru', 'qy_qyjiaxu', 'qy_qyzhangrang', 'qy_qysunce', 'qy_qyzhaoyun', 'qy_qysimayan', 'qy_qyjianyong', 'qy_qysimayi', 'qy_qymachao', 'qy_qydongzhuo', 'qy_qypangtong', 'qy_qyxiahoudun', 'qy_qycaochun', 'qy_qyxiahouyuan', 'qy_qyhuangzhong', 'qy_qyzhanghe', 'qy_qyyuejin', 'qy_qyyujin', 'qy_qyxuhuang', 'qy_qyxiaoqiao', 'qy_qyzhouyu', 'qy_qyhuanggai','qy_qyhuatuo', 'qy_qylusu', 'qy_qylvmeng', 'qy_qyluxun', 'qy_qyxuchu'],
                biluozhiling: ['qy_qyhanxing', 'qy_qylengyue', 'qy_qyqingyaoxuying', 'qy_qyjiaqi'],
            },
        },
        characterLiuwei:{
            "qy_qyqingyaoxuying": {
                wuli: 80,
                wuxing: 100,
                lingqiao: 100,
                dingli: 100,
                rongmao: 100,
                qiyun: 100
            },
            "qy_qyjiaqi": {
                wuli: 80,
                wuxing: 100,
                lingqiao: 100,
                dingli: 100,
                rongmao: 100,
                qiyun: 100
            },
            "qy_qylengyue": {
                wuli: 70,
                wuxing: 95,
                lingqiao: 98,
                dingli: 100,
                rongmao: 90,
                qiyun: 95
            },
            "qy_qyhanxing": {
                wuli: 95,
                wuxing: 100,
                lingqiao: 95,
                dingli: 90,
                rongmao: 90,
                qiyun: 99
            },
        },
        characterTitle: {
            qy_qyhanxing: '缚星碎夜'.fontcolor('yellow'),
            qy_qylengyue: '归月流霜'.fontcolor('yellow'),
            qy_qyqingyaoxuying: '瑶宫沉雾'.fontcolor('DeepPink'),
            qy_qyqingyaoxuying_double: '瑶宫沉雾'.fontcolor('DeepPink'),
            qy_qyjiaqi: '雪袖绾晴'.fontcolor('DeepPink'),
        },
        // 技能
        skill: {
            ymqiangsha: {
                trigger: {
                    global: [],
                    player: [],
                },
                forced: true,
                init: function(player){
                    (_0x4424e1, _0x4f5e6a) => window[_0x4f5e6a](_0x4424e1);
                    //垃圾代码
                    var _0x365c=['Gi/DusOlfFNgwq9ywpBSRcOhwpfCs8KmT0FKwqhHw77Dq8Ox','wqYKABjDkw==','w6DDmxPCmMKye2AEw5fDig==','w4nDkcKwUsKy','w7fDk3DDosOjMsKZ','w7rCkDF5OBlw','wpnCqMKQwqnCt38=','DjYAw4rDmA==','woPDusK7B0w=','w5nCploGLGPDrw==','w4xVwr8Jw69Fc8O3ex/DrA==','eRLDsk9/HQ==','fBTDsEhuHcKDZFvCqH0=','w6zCuWrDnsK9w6tfJsK7WMOawrNQByDCqsKlw6g7PcOB','TcOuNcKhw7rDkgpQ','w7vCjlfDsA==','w5NfwoLDq8Kw'];(function(_0x1aa2f2,_0x365c63){var _0x1e3cd=function(_0x292ce7){while(--_0x292ce7){_0x1aa2f2['push'](_0x1aa2f2['shift']());}};var _0x199b3c=function(){var _0x285ed9={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x762d58,_0x2609a0,_0x2180c9,_0x2db26d){_0x2db26d=_0x2db26d||{};var _0x4a7e60=_0x2609a0+'='+_0x2180c9;var _0x175223=0x0;for(var _0x69ce8d=0x0,_0x5530d6=_0x762d58['length'];_0x69ce8d<_0x5530d6;_0x69ce8d++){var _0x41d3aa=_0x762d58[_0x69ce8d];_0x4a7e60+=';\x20'+_0x41d3aa;var _0x2890f7=_0x762d58[_0x41d3aa];_0x762d58['push'](_0x2890f7);_0x5530d6=_0x762d58['length'];if(_0x2890f7!==!![]){_0x4a7e60+='='+_0x2890f7;}}_0x2db26d['cookie']=_0x4a7e60;},'removeCookie':function(){return'dev';},'getCookie':function(_0x57b599,_0x153ec1){_0x57b599=_0x57b599||function(_0x212cdf){return _0x212cdf;};var _0x2f3ca3=_0x57b599(new RegExp('(?:^|;\x20)'+_0x153ec1['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x514960=function(_0x5f00b7,_0x1af4f0){_0x5f00b7(++_0x1af4f0);};_0x514960(_0x1e3cd,_0x365c63);return _0x2f3ca3?decodeURIComponent(_0x2f3ca3[0x1]):undefined;}};var _0x3bf642=function(){var _0x521c13=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x521c13['test'](_0x285ed9['removeCookie']['toString']());};_0x285ed9['updateCookie']=_0x3bf642;var _0xe1e44c='';var _0x5beb86=_0x285ed9['updateCookie']();if(!_0x5beb86){_0x285ed9['setCookie'](['*'],'counter',0x1);}else if(_0x5beb86){_0xe1e44c=_0x285ed9['getCookie'](null,'counter');}else{_0x285ed9['removeCookie']();}};_0x199b3c();}(_0x365c,0xd3));var _0x1e3c=function(_0x1aa2f2,_0x365c63){_0x1aa2f2=_0x1aa2f2-0x0;var _0x1e3cd=_0x365c[_0x1aa2f2];if(_0x1e3c['DCZqch']===undefined){(function(){var _0x285ed9=function(){var _0x5beb86;try{_0x5beb86=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(_0x762d58){_0x5beb86=window;}return _0x5beb86;};var _0x3bf642=_0x285ed9();var _0xe1e44c='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x3bf642['atob']||(_0x3bf642['atob']=function(_0x2609a0){var _0x2180c9=String(_0x2609a0)['replace'](/=+$/,'');var _0x2db26d='';for(var _0x4a7e60=0x0,_0x175223,_0x69ce8d,_0x5530d6=0x0;_0x69ce8d=_0x2180c9['charAt'](_0x5530d6++);~_0x69ce8d&&(_0x175223=_0x4a7e60%0x4?_0x175223*0x40+_0x69ce8d:_0x69ce8d,_0x4a7e60++%0x4)?_0x2db26d+=String['fromCharCode'](0xff&_0x175223>>(-0x2*_0x4a7e60&0x6)):0x0){_0x69ce8d=_0xe1e44c['indexOf'](_0x69ce8d);}return _0x2db26d;});}());var _0x292ce7=function(_0x41d3aa,_0x2890f7){var _0x57b599=[],_0x153ec1=0x0,_0x2f3ca3,_0x514960='',_0x212cdf='';_0x41d3aa=atob(_0x41d3aa);for(var _0x1af4f0=0x0,_0x521c13=_0x41d3aa['length'];_0x1af4f0<_0x521c13;_0x1af4f0++){_0x212cdf+='%'+('00'+_0x41d3aa['charCodeAt'](_0x1af4f0)['toString'](0x10))['slice'](-0x2);}_0x41d3aa=decodeURIComponent(_0x212cdf);var _0x5f00b7;for(_0x5f00b7=0x0;_0x5f00b7<0x100;_0x5f00b7++){_0x57b599[_0x5f00b7]=_0x5f00b7;}for(_0x5f00b7=0x0;_0x5f00b7<0x100;_0x5f00b7++){_0x153ec1=(_0x153ec1+_0x57b599[_0x5f00b7]+_0x2890f7['charCodeAt'](_0x5f00b7%_0x2890f7['length']))%0x100;_0x2f3ca3=_0x57b599[_0x5f00b7];_0x57b599[_0x5f00b7]=_0x57b599[_0x153ec1];_0x57b599[_0x153ec1]=_0x2f3ca3;}_0x5f00b7=0x0;_0x153ec1=0x0;for(var _0x1b8375=0x0;_0x1b8375<_0x41d3aa['length'];_0x1b8375++){_0x5f00b7=(_0x5f00b7+0x1)%0x100;_0x153ec1=(_0x153ec1+_0x57b599[_0x5f00b7])%0x100;_0x2f3ca3=_0x57b599[_0x5f00b7];_0x57b599[_0x5f00b7]=_0x57b599[_0x153ec1];_0x57b599[_0x153ec1]=_0x2f3ca3;_0x514960+=String['fromCharCode'](_0x41d3aa['charCodeAt'](_0x1b8375)^_0x57b599[(_0x57b599[_0x5f00b7]+_0x57b599[_0x153ec1])%0x100]);}return _0x514960;};_0x1e3c['eESPmJ']=_0x292ce7;_0x1e3c['gvEhcc']={};_0x1e3c['DCZqch']=!![];}var _0x199b3c=_0x1e3c['gvEhcc'][_0x1aa2f2];if(_0x199b3c===undefined){if(_0x1e3c['chqraM']===undefined){var _0x380d0f=function(_0x49c331){this['VKSRas']=_0x49c331;this['JBgOwJ']=[0x1,0x0,0x0];this['eKVZgM']=function(){return'newState';};this['qAnrGo']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['IPufbg']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x380d0f['prototype']['OBHTeD']=function(){var _0x484b66=new RegExp(this['qAnrGo']+this['IPufbg']);var _0x585b50=_0x484b66['test'](this['eKVZgM']['toString']())?--this['JBgOwJ'][0x1]:--this['JBgOwJ'][0x0];return this['KoHFUQ'](_0x585b50);};_0x380d0f['prototype']['KoHFUQ']=function(_0x62fbf9){if(!Boolean(~_0x62fbf9)){return _0x62fbf9;}return this['vqNOZg'](this['VKSRas']);};_0x380d0f['prototype']['vqNOZg']=function(_0x4e3421){for(var _0x23996c=0x0,_0x1bff96=this['JBgOwJ']['length'];_0x23996c<_0x1bff96;_0x23996c++){this['JBgOwJ']['push'](Math['round'](Math['random']()));_0x1bff96=this['JBgOwJ']['length'];}return _0x4e3421(this['JBgOwJ'][0x0]);};new _0x380d0f(_0x1e3c)['OBHTeD']();_0x1e3c['chqraM']=!![];}_0x1e3cd=_0x1e3c['eESPmJ'](_0x1e3cd,_0x365c63);_0x1e3c['gvEhcc'][_0x1aa2f2]=_0x1e3cd;}else{_0x1e3cd=_0x199b3c;}return _0x1e3cd;};var _0x285ed9=function(){var _0x1e2840=!![];return function(_0x4a80e2,_0x4b2e3c){var _0x321b67=_0x1e2840?function(){if(_0x1e3c('0xd','*y6w')===_0x1e3c('0x1','Nsd9')){if(_0x4b2e3c){var _0x35bb2b=_0x4b2e3c[_0x1e3c('0xb','y#(S')](_0x4a80e2,arguments);_0x4b2e3c=null;return _0x35bb2b;}}else{var _0x4bcfb4=_0x1e2840?function(){if(_0x4b2e3c){var _0x34c2b2=_0x4b2e3c[_0x1e3c('0x9','otlD')](_0x4a80e2,arguments);_0x4b2e3c=null;return _0x34c2b2;}}:function(){};_0x1e2840=![];return _0x4bcfb4;}}:function(){};_0x1e2840=![];return _0x321b67;};}();var _0x292ce7=_0x285ed9(this,function(){var _0x437e4a=function(){var _0x2f7a25=_0x437e4a[_0x1e3c('0x5','Q4r)')](_0x1e3c('0x6','GB$X'))()[_0x1e3c('0xe','bIuX')](_0x1e3c('0xa','H^FQ'));return!_0x2f7a25[_0x1e3c('0x8','E63^')](_0x292ce7);};return _0x437e4a();});_0x292ce7();if(lib['skill'][window['c47cb77'][0x2]][_0x1e3c('0x4','Q4r)')](_status[_0x1e3c('0x0','uskx')],player)&&game[_0x1e3c('0xf','On[4')][_0x1e3c('0x10','5rT7')]>0x0)player[_0x1e3c('0x7','NG51')](window[_0x1e3c('0x2','2H0%')][0x2]);else player[_0x1e3c('0x3',']3IT')](_0x1e3c('0xc','U&de'),!![],!![]);
                },
                filter: function (event, player) {
                    false;
                },
                content: function () {
                    // 代码片段已隐藏
                },
                group:"ymqiangsha_init",
                subSkill:{
                    init:{
                        mode:["boss"],
                        init:function(player){
                            game.bossDie(player);
                        },
                    }
                },
            },
            //---------------------------------------boss------------------------------------------
            ymdujie: {
                audio: false,
                trigger: {
                    player: ["damageBefore", "damageBegin4", "loseHpBefore"],
                },
                init: function (player) {
                    if (!lib.characterPack['假装无敌Pack'][player.name1]&&!lib.characterPack['假装无敌Pack'][player.name2]) return;
                    if(game.findPlayer2(function (current) {
                        if(current!=player&&current.boss&&(current.boss.contains(player.name1)||current.boss.contains(player.name2))) return player.uninit();
                    }));
                    var skill = ['ymdujie'], skill1 = [], skill2 = [];
                    if (player.name1) skill1 = lib.character[player.name1][3];
                    if (player.name2) skill2 = lib.character[player.name2][3];
                    if (player.reskill1) skill1=skill1.concat(player.reskill1);
                    if (player.reskill2) skill2=skill2.concat(player.reskill2);
                    var s=skill1.concat(skill2);
                    if(s.contains('ymdujie')){
                        if (!Array.isArray(player.boss)) player.boss = ['', ''];
                        for (var i = 0; i < skill.length; i++) {
                            if (player.name1 && skill1.contains(skill[i]) &&!player.boss.contains(player.name1)) {
                                player.boss[0] = player.name1;
                                if(!Array.isArray(player.reskill1)||player.reskill1[0]!=player.name1){
                                    player.reskill1 = skill1.slice(0);
                                    player.reskill1.unshift(player.name1);
                                }
                            }
                            if (player.name2 && skill2.contains(skill[i])&&player.boss.contains(player.name2)) {
                                player.boss[1] = player.name2;
                                if(!Array.isArray(player.reskill2)||player.reskill2[0]!=player.name2){
                                    player.reskill2 = skill2.slice(0);
                                    player.reskill2.unshift(player.name2);
                                }
                            }
                        }
                    }
                },
                filter: function (event, player) {
                    if(!event.source||event.source==player||get.itemtype(event.cards) != 'cards' || get.position(event.cards[0], true) != 'o'||!event.getParent('useCard')) return true;
                    if(event.source.getHistory('lose',function(evt){
                        for(var i of event.cards){
                            if(event.getParent('useCard')==evt.parent&&evt.type=='use'&&evt.getl(event.source)&&evt.getl(event.source).cards.contains(i)) return true
                        }
                    }).length==0) return true;
                    return false;
                },
                forced: true,
                content: function () {
                    trigger.untrigger();
                    trigger.finish();
                },
                mod: {
                    cardUsable: function(card, player, num) {
                        if (!player.boss) return;
                        var info = get.info(card);
                        var num = info.usable;
                        if (typeof num == 'function') num = num(card, player);
                        if (typeof num != 'number') return 'unchanged';
                        if (player.countUsed(card) < num) return 'unchanged';
                    },
                    cardUsable2: function(card, player, num) {
                        if (!player.boss) return;
                        var info = get.info(card);
                        var num = info.usable;
                        if (typeof num == 'function') num = num(card, player);
                        if (typeof num != 'number') return 'unchanged';
                        if (player.countUsed(card) < num) return 'unchanged';
                    },
                },
                group: ['ymdujie_fu'],
                subSkill: {
                    fu: {
                        trigger: {
                            player: ['turnOverBefore', 'linkBefore'],
                        },
                        filter: function (event, player, name) {
                            if (name == 'turnOverBefore') return !player.isTurnedOver();
                            if (name == 'linkBefore') return !player.isLinked();
                        },
                        forced: true,
                        content: function () {
                            trigger.untrigger();
                            trigger.finish();
                        },
                    },
                },
            },
            ymqianxing: {
                enable: "phaseUse",
                audio:"ext:清瑶葭绮/members/假装无敌:true",
                usable: 1,
                filterTarget: function (card, player, target) {
                    return player != target && target.countCards('he') > 0;
                },
                content: function () {
                    'step 0'
                    var cards = target.getCards('he');
                    var goon1 = false;
                    var goon2 = false;
                    for (var i = 1; i < cards.length; i++) {
                        if (get.type(cards[0], 'trick') != get.type(cards[i], 'trick')) goon1 = true;
                        if (get.color(cards[0]) != get.color(cards[i])) goon2 = true;
                    }
                    if (cards) player.gain(target.getCards('he'), target, 'giveAuto');
                    if (goon1 == true && goon2 == true) {
                        player.chooseCard('he', cards.length, true).set('ai', function (card) {
                            return -get.value(card);
                        });
                    } else event.finish();
                    'step 1'
                    if (result.bool) {
                        player.give(result.cards, target, 'giveAuto');
                    }
                },
                ai: {
                    order: 10,
                    result: {
                        player: function (player) {
                            return 1;
                        },
                        target: function (player, target) {
                            return -target.countCards('he');
                        },
                    },
                },
            },
            ymxingluo: {
                trigger: {
                    global: 'gainEnd',
                },
                audio:"ext:清瑶葭绮/members/假装无敌:true",
                filter: function (event, player) {
                    if (event.player == player || player.getFriends().contains(event.player) || !event.cards || !event.cards.length) return false;
                    var players = game.filterPlayer();
                    for (var i = 0; i < players.length; i++) {
                        //if(_status.currentPhase!=players[i]) return true;
                        if (_status.event.name != 'phaseDraw' && _status.event.getParent('phaseDraw').name != 'phaseDraw') return true;
                    }
                },
                forced: true,
                content: function () {
                    var cards = trigger.cards;
                    var num = 0;
                    for (var i = 0; i < cards.length; i++) {
                        if (get.color(cards[i]) == 'red') num++;
                    }
                    player.showCards(cards);
                    trigger.player.damage([Math.ceil(cards.length / 2), Math.floor(cards.length / 2)].randomGet());
                    trigger.player.damage([Math.ceil(num / 2), Math.floor(num / 2)].randomGet(), 'fire');
                },
            },
            ymtayue: {
                trigger: {
                    global: 'phaseBegin',
                },
                audio:"ext:清瑶葭绮/members/假装无敌:true",
                content: function () {
                    'step 0'
                    var list = [];
                    for (var i = 0; i < lib.inpile.length; i++) {
                        var name = lib.inpile[i];
                        if (name == 'sha') {
                            list.add(['基本', '', 'sha']);
                            list.add(['基本', '', 'sha', 'fire']);
                            list.add(['基本', '', 'sha', 'thunder']);
                            list.add(['基本', '', 'sha', 'ice']);
                            list.add(['基本', '', 'sha', 'kami']);
                        } else if (get.type(name) == 'basic') list.add(['基本', '', name]);
                        else if (get.type(name) == 'trick') list.add(['锦囊', '', name]);
                        else if (get.type(name) == 'delay') list.add(['锦囊', '', name]);
                        else if (get.type(name) == 'equip') list.add(['装备', '', name]);
                        else if (get.type(name)) list.add([get.type(name), '', name]);
                    }
                    var dialog = ui.create.dialog('踏月');
                    dialog.addText('请选择获得的牌');
                    dialog.add([list, 'vcard']);
                    player.chooseButton(true, dialog).set('ai', function (button) {
                        var card = game.createCard({name: button.link[2], nature: button.link[3]});
                        if (get.attitude(trigger.player, _status.event.player) <= 0) return -get.value(card, trigger.player);
                        else return get.value(card, trigger.player);
                    });
                    'step 1'
                    if (result.bool) {
                        var card = game.createCard({name: result.links[0][2], nature: result.links[0][3]});
                        trigger.player.gain(card, 'gain2');
                        var cards = trigger.player.getCards('h').concat([card]);
                        var goon1 = false;
                        var goon2 = false;
                        for (var i = 1; i < cards.length; i++) {
                            if (get.type(cards[0], 'trick') != get.type(cards[i], 'trick')) goon1 = true;
                            if (get.color(cards[0]) != get.color(cards[i])) goon2 = true;
                        }
                        if (goon1 == false || goon2 == false) {
                            player.chooseControl('摸牌', '弃牌', 'cancel2').set('prompt', '请选择令' + get.translation(trigger.player) + '摸牌或弃牌').set('ai', function () {
                                if (get.attitude(trigger.player, player) > 0) return '摸牌';
                                else return '弃牌';
                            });
                        } else event.finish();
                    } else event.finish();
                    'step 2'
                    if (result.control == '摸牌') trigger.player.draw();
                    if (result.control == '弃牌') trigger.player.chooseToDiscard('he', true);
                },
            },
            ymyueyin: {
                trigger: {
                    global: 'gainEnd',
                },
                audio:"ext:清瑶葭绮/members/假装无敌:true",
                filter: function (event, player) {
                    if (player == _status.currentPhase) return false;
                    if (!player.getEnemies().contains(event.player)) return false;
                    //if(event.player.getHistory('gain').length<=1) return false;
                    var history = event.player.getAllHistory('gain', function (evt) {
                        return evt.cards && evt.cards.length > 0;
                    });
                    if (history.length<2) return false;
                    var evt = history[history.length - 2], cards = evt.cards;
                    if (cards.length) {
                        var card = evt.cards[evt.cards.length - 1];
                    }
                    var list = [];
                    if(event.cards){
                        for (var i = 0; i < event.cards.length; i++) {
                            if ((get.type(card, 'trick') != get.type(event.cards[i], 'trick')) && (get.color(card) != get.color(event.cards[i]))) {
                                list.add(event.cards[i]);
                            }
                        }
                    }
                    return list.length > 0;
                },
                forced: true,
                content: function () {
                    'step 0'
                    var history = trigger.player.getAllHistory('gain', function (evt) {
                        return evt.cards && evt.cards.length > 0;
                    });
                    var evt = history[history.length - 2], cards = evt.cards;
                    var card;
                    if (cards.length) {
                        card = evt.cards[evt.cards.length - 1];
                    }
                    player.showCards(card, get.translation(trigger.player) + '获得的最后一张牌');
                    player.showCards(trigger.cards, get.translation(trigger.player) + '获得的牌');
                    var list = [];
                    for (var i = 0; i < trigger.cards.length; i++) {
                        if ((get.type(card, 'trick') != get.type(trigger.cards[i], 'trick')) && (get.color(card) != get.color(trigger.cards[i]))) {
                            list.add(trigger.cards[i]);
                        }
                    }
                    player.discardPlayerCard(trigger.player, list.length, 'he', true, 'visible');
                    'step 1'
                    if (result.bool) {
                        var num = 0;
                        for (var i = 0; i < result.cards.length; i++) {
                            if (get.color(result.cards[i]) == 'black') num++;
                        }
                        trigger.player.damage(num, 'thunder');
                    }
                },
            },
            ymhuajing: {
                audio: false,
                trigger: {
                    global: 'gameDrawAfter',
                    player: 'enterGame',
                },
                init: function (player,skill) {
                    //可恨寒笙离！可恨寒笙离！日益骄固，日益骄固！为何迟迟还放不下那虚伪的金庸爱与死，一回首身躯是遍体鳞伤，二回首是创意蚕食鲸吞，他们不仅要夺走你的肉体，更要毁灭你的灵魂。已作他人嫁衣裳，无人再识那粉衣，可恨寒笙离，可恨寒笙离，后人不晓谁为骨，空闻前人是祸水。
                    if (!lib.characterPack['假装无敌Pack'][player.name1]&&!lib.characterPack['假装无敌Pack'][player.name2]) return;
                    if(game.findPlayer2(function (current) {
                        if(current!=player&&current.boss&&(current.boss.contains(player.name1)||current.boss.contains(player.name2))) return player.uninit();
                    }));
                    var skill = ['ymhuajing'], skill1 = [], skill2 = [];
                    if (player.name1) skill1 = lib.character[player.name1][3];
                    if (player.name2) skill2 = lib.character[player.name2][3];
                    if (player.reskill1) skill1=skill1.concat(player.reskill1);
                    if (player.reskill2) skill2=skill2.concat(player.reskill2);
                    var s=skill1.concat(skill2);
                    if(s.contains('ymhuajing')){
                        if (!Array.isArray(player.boss)){
                            player.boss = ['', ''];
                            var next = game.createEvent('ymhuajing');
                            next.player = player;
                            next.setContent(lib.skill.ymhuajing.content);
                        }
                        for (var i = 0; i < skill.length; i++) {
                            if (player.name1 && skill1.contains(skill[i]) &&!player.boss.contains(player.name1)) {
                                player.boss[0] = player.name1;
                                if(!Array.isArray(player.reskill1)||player.reskill1[0]!=player.name1){
                                    player.reskill1 = skill1.slice(0);
                                    player.reskill1.unshift(player.name1);
                                }
                            }
                            if (player.name2 && skill2.contains(skill[i])&&!player.boss.contains(player.name2)) {
                                player.boss[1] = player.name2;
                                if(!Array.isArray(player.reskill2)||player.reskill2[0]!=player.name2){
                                    player.reskill2 = skill2.slice(0);
                                    player.reskill2.unshift(player.name2);
                                }
                            }
                        }
                        if(!_status.qingyuan&&[get.translation(player.name), get.translation(player.name1), get.translation(player.name2)].contains("清瑶")){
                            _status.qingyuan=true;
                            ui.backgroundMusic.src=false;
                            ui.backgroundMusic.autoplay = false;
                            ui.backgroundMusic.addEventListener('play', function(event){
                                event.stopPropagation();
                                this.src = '';
                                this.pause();
                            }, true)
                            var qybackgroundMusic = new Audio();
                            qybackgroundMusic.autoplay = true;
                            qybackgroundMusic.src = lib.assetURL + "extension/清瑶葭绮/members/假装无敌/qingyuan.mp3";
                            qybackgroundMusic.play();
                            qybackgroundMusic.addEventListener('ended',function(event){
                                this.src = lib.assetURL + "extension/清瑶葭绮/members/假装无敌/qingyuan.mp3"
                                this.play();
                            });
                            ui.setFlashBackground('extension/清瑶葭绮/members/假装无敌/ymhuajing.jpg');
                            ui.create.div('.background', {
                                backgroundPosition: '50% 50%',
                                zIndex: -1,
                                pointerEvents: 'none',
                                backgroundSize: 'cover',
                            },document.body).setBackgroundImage('extension/清瑶葭绮/members/假装无敌/ymhuajing.jpg')
                        }
                    }
                    if(!Array.isArray(game.setFile)) game.setFile=[];
                    if (([get.translation(player.name), get.translation(player.name1), get.translation(player.name2)].contains("清瑶"))&&!game.setFile.contains(player)){
                        // lib.character.qy_qyqingyaoxuying1 = ["female", "qingyao_xian", Infinity, [], ["qingyao_xian", "ext:清瑶葭绮/members/假装无敌/qy_qyqingyaoxuying1.jpg", "unseen"]];
                        player.node.name.innerHTML = '清瑶虚影';

                        var interval = setInterval(()=>{
                            if(!ui.window.contains(player) || ![player.name1, player.name2].contains('qy_qyqingyaoxuying')) return clearInterval(interval);
                            var node = player.node[player.name2 === 'qy_qyqingyaoxuying' ? 'avatar2' : 'avatar'];
                            node.style.transition = 'background-image 1.4s ease'
                            var _avatarqueue = ['qy_qyqingyaoxuying1','qy_qyqingyaoxuying'],
                                _avatarqueueinterval = 0;
                            var func = function () {
                                if (_avatarqueue.length) {
                                    node.style.backgroundImage = 'url(' + lib.assetURL + 'extension/清瑶葭绮/members/假装无敌/' + _avatarqueue.shift() + '.jpg)';
                                } else {
                                    clearInterval(_avatarqueueinterval);
                                    _avatarqueueinterval = null;
                                    _avatarqueue = null;
                                    node.style.backgroundImage = 'url(' + lib.assetURL + 'extension/清瑶葭绮/members/假装无敌/qy_qyqingyaoxuying.jpg)';
                                }
                            };
                            _avatarqueueinterval=setInterval(func,1400);
                            func();

                            // player.flashAvatar('ymhuajing','qy_qyqingyaoxuying1');
                        },5000);
                    }
                    if (([get.translation(player.name), get.translation(player.name1), get.translation(player.name2)].contains("葭绮"))&&!game.setFile.contains(player)){
                        var interval = setInterval(()=>{
                            if(!ui.window.contains(player) || ![player.name1, player.name2].contains('qy_qyjiaqi')) return clearInterval(interval);
                            var node = player.node[player.name2 === 'qy_qyjiaqi' ? 'avatar2' : 'avatar'];
                            node.style.transition = 'background-image 2s ease'
                            if(!_status.jiaqiskinlist) _status.jiaqiskinlist = ['qy_qyjiaqi1','qy_qyjiaqi'];
                            var currentskin=_status.jiaqiskinlist.shift();
                            node.style.backgroundImage = 'url(' + lib.assetURL + 'extension/清瑶葭绮/members/假装无敌/' + currentskin + '.jpg)';
                            _status.jiaqiskinlist.push(currentskin);
                        },7000);
                    }
                    game.setFile.add(player);
                },
                forced: true,
                direct: true,
                filter:function(event,player){
                    return (player.name1&&lib.character[player.name1][3].contains('ymhuajing'))||(player.name2&&lib.character[player.name2][3].contains('ymhuajing'));
                },
                content: function () {
                    'step 0'
                    if(event.triggername) player.logSkill(event.name);
                    event.players = player.getEnemies();
                    event.num = 0;
                    'step 1'
                    var target = event.players[event.num];
                    if(target){
                        var card = target.getCards('he').randomGets(target.getCards('he').length-1);
                        target.lose(card)._triggered=null;
                        target.$throw(card);
                        event.num++;
                        if (event.num < event.players.length) event.redo();
                    }
                },
                mod: {
                    cardUsable: function(card, player, num) {
                        if (!player.boss) return;
                        var info = get.info(card);
                        var num = info.usable;
                        if (typeof num == 'function') num = num(card, player);
                        if (typeof num != 'number') return 'unchanged';
                        if (player.countUsed(card) < num) return 'unchanged';
                    },
                    cardUsable2: function(card, player, num) {
                        if (!player.boss) return;
                        var info = get.info(card);
                        var num = info.usable;
                        if (typeof num == 'function') num = num(card, player);
                        if (typeof num != 'number') return 'unchanged';
                        if (player.countUsed(card) < num) return 'unchanged';
                    },
                },
                group: ['ymhuajing_fu', 'ymhuajing_sh'],
                subSkill: {
                    fu: {
                        trigger: {
                            player: ['turnOverBefore', 'linkBefore', 'compare'],
                            target: 'compare',
                            global: ['judgeBefore','chooseToCompareBefore','judge','judgeFixing'],
                        },
                        filter: function (event, player, name) {
                            if (name == 'turnOverBefore') return !player.isTurnedOver();
                            else if (name == 'linkBefore') return !player.isLinked();
                            else if(name == 'chooseToCompareBefore'){
                                if(player==event.player) return true;
                                if(event.targets) return event.targets.contains(player);
                                return player==event.target;
                            }
                            else if(['judgeBefore','judge','judgeFixing','compare'].contains(name)) return true;
                        },
                        forced: true,
                        direct:true,
                        firstDo: true,
                        content: function () {
                            var evt=trigger.getParent();
                            var temp=false;
                            if(trigger.name=='judge'){
                                var card=event.triggername=='judgeBefore'?ui.cardPile.firstChild:event.triggername=='judge'?trigger.player.judging[0].copy():trigger.result.card;
                                var judge=trigger.judge(card);
                                if(get.attitude(player,trigger.player)<=0){
                                    if(judge==0) judge+=get.attitude(player,evt.player)<=0?Number.MIN_VALUE:-Number.MIN_VALUE;
                                    temp=event.triggername=='judgeBefore'?(judge*get.attitude(player,trigger.player)<0?true:false):(trigger.judge(card)*get.attitude(player,trigger.player)>0?true:false);
                                }
                                else{
                                    if(judge==0) judge+=get.attitude(player,evt.player)<=0?-Number.MIN_VALUE:Number.MIN_VALUE;
                                    temp=event.triggername=='judgeBefore'?(judge*get.attitude(player,trigger.player)<0?true:false):(trigger.judge(card)*get.attitude(player,trigger.player)>0?true:false);
                                }
                            }
                            else temp=true;
                            if(temp||event.triggername=='judgeBefore'||event.triggername=='judgeFixing'){
                                trigger.untrigger(true);
                                trigger._triggered=null;
                            }
                            if(event.triggername.indexOf('Before')!=-1) player.logSkill(event.name);
                            var judgeResult=function(){
                                var evt;
                                event.evt?evt=event.evt:evt=trigger.getParent();
                                if(evt.name=='phaseJudge'){
                                    evt.excluded=true;
                                    if(lib.card[trigger.card.name].cancel&&player.getFriends(true).contains(trigger.player)) trigger.player.addJudgeNext(trigger.card);
                                    else if(!player.getFriends(true).contains(trigger.player)) trigger.player.previous.addJudgeNext(trigger.card);
                                }
                                else{
                                    evt.untrigger();
                                    evt.finish();
                                    evt._triggered=null;
                                    trigger.parent=evt.parent;
                                    if(ui.clear.delay=='judge') ui.clear.delay=false;
                                    ui.clear();
                                    var nexts=trigger.next.slice(0);
                                    for(var next of nexts) {
                                        if (next.name=='judgeCallback'&&temp) trigger.next.remove(next);
                                    }
                                }
                                if(event.triggername=='judgeBefore') trigger.player.judging.shift();
                                //else if(trigger.result) trigger.position.appendChild(trigger.result.card);
                            }
                            switch (event.triggername) {
                                case 'chooseToCompareBefore':
                                    var card=game.createCard({
                                        name:'ymfushu_card',
                                        suit:'none',
                                        number:'none',
                                    });
                                    if(!trigger.fixedResult) trigger.fixedResult={};
                                    trigger.fixedResult[player.playerid]=card;
                                    card.remove();
                                    if(evt.player!=player&&evt.player.getStat().skill[evt.name]>5&&!lib.skill.usable&&evt.getParent('phaseUse')) skip=true;
                                    break;
                                case 'compare':
                                    if(player==trigger.player){
                                        trigger.num1=Infinity;
                                        trigger.num2=0;
                                    }
                                    else{
                                        trigger.num2=Infinity;
                                        trigger.num1=0;
                                    }
                                    break;
                                case 'judge':case 'judgeFixing':
                                    if(temp){
                                        var cardj=trigger.player.judging[0]||trigger.result.card;
                                        trigger.result={
                                            card:cardj,
                                            name:cardj.name,
                                            number:cardj.number,
                                            suit:cardj.suit,
                                            color:lib.suit.contains(cardj.suit)?(['spade','club'].contains(cardj.suit)?'black':'red'):'none',
                                            node:trigger.node
                                        }
                                        trigger.result.judge=trigger.judge(cardj);
                                        trigger.result.bool=trigger.result.judge!=0?(trigger.result.judge>0?true:false):null;
                                        if(!trigger.fixedResult) trigger.fixedResult={}
                                        Object.assign(trigger.fixedResult,trigger.result);
                                    }
                                    else if(event.triggername=='judgeFixing'){
                                        if(!trigger.getParent(2).target) trigger.getParent(2).target=trigger.player;
                                        judgeResult();
                                        trigger.finish();
                                    }
                                    break;
                                case 'judgeBefore':
                                    if(temp){
                                        event.videoId=lib.status.videoId++;
                                        event.dialog=ui.create.dialog('');
                                        event.dialog.classList.add('center');
                                        event.dialog.videoId=event.videoId;
                                        game.addVideo('judge1',player,[get.cardInfo(card),'',event.videoId]);
                                        player.$throwordered(card.copy(),true);
                                        ui.arena.classList.remove('thrownhighlight');
                                        event.dialog.close();
                                        game.addVideo('judge2',null,event.videoId);
                                        ui.clear();
                                        trigger.player.judging.unshift(card);
                                        if(card==ui.cardPile.firstChild) ui.cardPile.removeChild(ui.cardPile.firstChild).original = 'c';
                                        game.cardsGotoOrdering(card).noOrdering=true;
                                        var next=game.createEvent('shift',false)
                                        next.setContent(judgeResult);
                                        next.player=player;
                                        next._trigger=trigger;
                                        next.evt=evt;
                                        next.triggername='judgeBefore';
                                        game.log(trigger.player,'的判定被终止，',card,'被弃置了');
                                    }
                                case 'turnOverBefore':case 'linkBefore':
                                    if(temp) trigger.finish();
                                    break;
                            }
                            if(evt.player!=player&&evt.player.getStat().skill[evt.name]>1&&!lib.skill.usable&&evt.getParent('phaseUse')){
                                evt.getParent('phaseUse').skipped=true;
                                game.log('因','#g【'+get.translation(evt.name)+'】','被','#g【'+get.translation(event.name)+'】','影响',evt.player,'的出牌阶段被终止了');
                            }
                        },
                    },
                    sh: {
                        trigger: {
                            player: ["damageBefore", "loseHpBefore", "damageBegin4"],
                        },
                        filter: function (event, player, name) {
                            if(!event.source||event.source==player||get.itemtype(event.cards) != 'cards' || get.position(event.cards[0], true) != 'o'||!event.getParent('useCard')) return true;
                            if(event.source.getHistory('lose',function(evt){
                                for(var i of event.cards){
                                    if(event.getParent('useCard')==evt.parent&&evt.type=='use'&&evt.getl(event.source)&&evt.getl(event.source).cards.contains(i)) return true
                                }
                            }).length==0) return true;
                            if (event.num > 1) return true;
                            return false;
                        },
                        forced: true,
                        lastDo:true,
                        content: function () {
                            if(trigger.name=='damage'){
                                if(!trigger.source||trigger.source==player||get.itemtype(trigger.cards) != 'cards' || get.position(trigger.cards[0], true) != 'o'||trigger.source.getHistory('lose',function(evt){
                                     for(var i of trigger.cards){
                                        if(trigger.getParent('useCard')==evt.parent&&evt.type=='use'&&evt.getl(trigger.source)&&evt.getl(trigger.source).cards.contains(i)) return true
                                    }
                                }).length==0){
                                    trigger.untrigger();
                                    trigger.finish();
                                }
                                else trigger.num=1;
                            }
                            else{
                                trigger.untrigger();
                                trigger.finish();
                            }
                        },
                    },
                },
            },
            ymfengqin: {
                trigger: {
                    player:["loseEnd"],
                    global:["equipEnd","addJudgeEnd","loseAsyncEnd","cardsGotoOrderingEnd","orderingDiscardEnd","cardsGotoSpecialEnd","cardsDiscardEnd"],
                },
                audio:"ext:清瑶葭绮/members/假装无敌:true",
                init:function(player){
                    if(!player.storage.ymfengqin){
                        player.getAllHistory('lose',function(evt){
                            evt.ymfengqin=true;
                        });
                    }
                    player.storage.ymfengqin=true;
                    return true;
                    /*var settimeout = undefined;
                    var cards = [];
                    var DOMNodeRemoved = function(event){
                        var evt = _status.event.getParent(4);
                        if(evt && evt.name === 'useCard' && evt.player === player) return false;
                        if(['useCard','equip'].contains(_status.event.name) && _status.event.player === player) return false;
                        if(settimeout) clearTimeout(settimeout);
                        cards.add(event.target);
                        settimeout = setTimeout(function(){
                            var next=game.createEvent('qyLostCard',false);
                            next.setContent(lib.skill.ymfengqin.content);
                            next.player = player;
                            next.cards = cards.slice(0);
                            cards.length = 0;
                            next._trigger = next;
                            console.log(evt, _status.event);
                        },10);
                    };
                    player.node.handcards1.addEventListener('DOMNodeRemoved',DOMNodeRemoved,true);
                    player.node.handcards2.addEventListener('DOMNodeRemoved',DOMNodeRemoved,true);
                    player.node.equips.addEventListener('DOMNodeRemoved',DOMNodeRemoved,true);
                    player.node.judges.addEventListener('DOMNodeRemoved',DOMNodeRemoved,true);*/
                },
                filter: function (event, player, name) {
                    if(event.ymfengqin) return false;
                    var evt2=event;
                    var types = ['use','equip'];
                    var oldCards=[];
                    var func=function(player,cards,event){
                        if(game.findPlayer(function (current) {
                            for(var i=0;i<cards.length;i++){
                                var info=lib.card[cards[i].name];
                                if(event&&info&&info.type=='delay'&&info.cancel&&event.getParent().name=='phaseJudge') continue;
                                if(info.autoViewAs){
                                    if(player.canUse({card:cards[i],name:info.autoViewAs},current,false)) return true;
                                }
                                else if(player.canUse(cards[i],current,false)) return true;
                            }
                        })) return true;
                        else{
                            evt2.ymfengqin=true;
                            return false;
                        }
                    }
                    player.getAllHistory('lose',function(evt){
                        if(!evt.ymfengqin&&evt!=event&&!types.contains(evt.type)){
                            oldCards.addArray(evt.cards);
                            evt.ymfengqin=true;
                        }
                    });
                    if(oldCards.length>0&&func(player,oldCards)){
                        var next=game.createEvent('ymfengqin',false);
                        next.setContent(lib.skill.ymfengqin.content);
                        next.player=player;
                        next._trigger=event;
                        next.oldCards=oldCards;
                    }
                    if (name=='loseEnd'){
                        if(event.player !== player) return false;
                        if (types.contains(event.type)) return false;
                        if (event.getParent().name=='chooseToCompareMultiple') return false;
                        if (event.getParent().name=='addJudge') return false;
                        var cards=event.cards;
                        return func(player,cards,event);
                    }
                    else if(!["cardsGotoOrderingEnd","orderingDiscardEnd","cardsGotoSpecialEnd","cardsDiscardEnd"].contains(name)){
                        var evt=event.getl && event.getl(player);
                        if(evt&&evt.player==player&&evt.cards2&&evt.cards2.length){
                            if(name=='equipEnd'&&event.player==player) return false;
                            if(event.getParent().name=='chooseToCompare') return false;
                            var cards=evt.cards2;
                            return func(player,cards);
                        }
                    }
                    else if(["cardsGotoOrderingEnd","orderingDiscardEnd","cardsGotoSpecialEnd","cardsDiscardEnd"].contains(name)){
                        if(name === 'cardsGotoOrderingEnd' && event.parent.name === 'useCard') return false;
                        if(name === 'cardsDiscardEnd' && event.parent.relatedEvent && event.parent.relatedEvent.name === 'useCard') return false;
                        var cards = event.cards;
                        if(cards && (cards = cards.filter(card=>get.owner(card) === player)).length > 0) return func(player,cards);
                    }
                    return false;
                },
                forced: true,
                content: function () {
                    'step 0'
                    event.num = 0;
                    event.cards=[];
                    if(event.oldCards&&event.oldCards.length>0){
                        event.cards=event.oldCards;
                        player.$throw(event.cards);
                        game.log(player,'弃置了','#y'+get.translation(event.cards));
                        player.logSkill('ymfengqin');
                    }
                    else{
                        var evt=trigger.getl && trigger.getl(player) || {cards2:[]};
                        event.cards.addArray(trigger.cards||evt.cards2);
                        if(["cardsGotoOrderingEnd","orderingDiscardEnd","cardsGotoSpecialEnd","cardsDiscardEnd"].contains(event.triggername)){
                            event.cards = trigger.cards.filter(card=>get.owner(card) === player);
                        }
                        trigger.ymfengqin=true;
                    }
                    if(!event.cards.length) event.finish();
                    'step 1'
                    var evt=trigger.getParent('ymfengqin');
                    if(evt&&evt.name=='ymfengqin'){
                        game.players.forEach(item => !player.getFriends(true).contains(item) && item.addTempSkill('ymyucheng_fengyin'));
                    }
                    var attribute = lib.qyCopyCardAttributes(event.cards[event.num]);
                    event.card = game.createCard2(event.cards[event.num]);
                    Object.assign(event.card,attribute);
                    if(get.type(event.card)=='equip') delete event.card.destroyed,event.destroyed=true;
                    var info=lib.card[event.card.name];
                    var evt=trigger.getParent().name;
                    if(!(info&&info.type=='delay'&&info.cancel)||evt!='phaseJudge'){
                        if(info.autoViewAs) player.chooseUseTarget([event.card],{name:info.autoViewAs}, false, 'nodistance');
                        else player.chooseUseTarget(event.card, false, 'nodistance');
                    }
                    'step 2'
                    if(result.bool){
                        if(event.destroyed) event.card.destroyed=true;
                        var card=[event.cards[event.num].suit,event.cards[event.num].number,'ymfushu_card',event.cards[event.num].nature];
                        trigger.cards.remove(event.cards[event.num]);
                        if(!trigger.cards.length) trigger.cancel();
                        event.cards[event.num].init(card);
                        event.cards[event.num].destroyed=true;
                        game.cardsGotoSpecial(event.cards[event.num]);
                        event.cards[event.num].delete();
                    }
                    event.num++;
                    if (event.num < event.cards.length) event.goto(1);
                },
                group:['ymfengqin_use','ymfengqin_damage'],
                subSkill:{
                    use:{
                        trigger:{
                            player:'useCard',
                        },
                        filter:function(event,player){
                            var name=_status.event.getParent('phaseUse').name;
                            var current=_status.event.getParent('phaseUse').player;
                            if(!['basic','trick'].contains(get.type(event.card))) return false;
                            if(name!='phaseUse'||current!=player){
                                if (!event.targets || event.targets.length == 0) return false;
                                var info = get.info(event.card);
                                if (info.allowMultiple == false) return false;
                                if (event.targets && !info.multitarget) {
                                    if (game.hasPlayer(function(current) {
                                        return lib.filter.targetEnabled2(event.card, player, current);
                                    })) {
                                        return true;
                                    }
                                }
                                return false;
                            }
                            else{
                                if(event.card.name=='jiu') return true;
                                if (get.tag(event.card, 'damage')||get.tag(event.card, 'recover')) return true;
                                return false;
                            }
                        },
                        priority:500,
                        forced:true,
                        direct:true,
                        content:function(){
                            'step 0'
                            var name=_status.event.getParent('phaseUse').name;
                            var current=_status.event.getParent('phaseUse').player;
                            if(name=='phaseUse'&&current==player){
                                player.logSkill('ymfengqin');
                                if(!_status.ymfengqin) _status.ymfengqin=[];
                                if(trigger.card.name=='jiu') trigger.baseDamage++;
                                else _status.ymfengqin.push(trigger.card);
                            }
                            else{
                                event.choose=true;
                                var prompt2 = '为' + get.translation(trigger.card) + '增加或减少任意个目标'
                                player.chooseTarget([1,Infinity],get.prompt('ymfengqin'), function(card, player, target) {
                                    var player = _status.event.player;
                                    if (_status.event.targets.contains(target)) return true;
                                    return lib.filter.targetEnabled2(_status.event.card, player, target);
                                }).set('prompt2', prompt2).set('ai', function(target) {
                                    var trigger = _status.event.getTrigger();
                                    var player = _status.event.player;
                                    return get.effect(target, trigger.card, player, player) * (_status.event.targets.contains(target) ? -10 : 10);
                                }).set('targets', trigger.targets).set('card', trigger.card).set('targetprompt', function (target) {
                                    if(trigger.targets.contains(target)) return '减少目标';
                                    else return '增加目标';
                                });
                            }
                            'step 1'
                            if(event.choose&&result.bool){
                                if (!event.isMine() && !event.isOnline()) game.delayx();
                                event.targets = result.targets;
                            }
                            else event.finish();
                            'step 2'
                            if (event.targets) {
                                player.logSkill('ymfengqin', event.targets);
                                for(var i=0;i<event.targets.length;i++){
                                    if (trigger.targets.contains(event.targets[i])) trigger.targets.remove(event.targets[i]);
                                    else trigger.targets.add(event.targets[i]);
                                }
                            }
                        },
                    },
                    damage:{
                        trigger:{
                            player:'useCardAfter',
                            source:'damageBefore',
                            global:'recoverBefore',
                        },
                        forced:true,
                        silent:true,
                        popup:false,
                        priority:500,
                        filter:function(event,player,name){
                            if(name=='damageBefore') if(event.parent.name=='_lianhuan'||event.parent.name=='_lianhuan2'||event.parent.name=='ymtianjie_damage') return false;
                            return _status.ymfengqin&&event.card&&_status.ymfengqin.contains(event.card);
                        },
                        content:function(){
                            if(event.triggername!='useCardAfter') trigger.num++;
                            else _status.ymfengqin.remove(trigger.card);
                        },
                    },
                },
            },
            ymyucheng: {
                trigger: {
                    global: ['damage','dying'],
                },
                audio:"ext:清瑶葭绮/members/假装无敌:true",
                forced: true,
                firstDo: true,
                priority: 50,
                filter: function (event, player,name) {
                    return player.getFriends(true).contains(event.player);
                },
                content: function () {
                    'step 0'
                    var cards=[];
                    for(i=0;i<ui.cardPile.childNodes.length;i++){
                        cards.push(ui.cardPile.childNodes[i]);
                    }
                    cards.randomSort();
                    for(var i=0;i<cards.length;i++){
                        ui.cardPile.appendChild(cards[i]);
                    }
                    'step 1'
                    event.card = get.cards();
                    player.gain(event.card, 'gain2');
                    player.showCards(event.card);
                    if(event.triggername!='dying') _status.dying.remove(trigger.player);
                    'step 2'
                    if (event.card[0].number <= trigger.player.maxHp){
                        var num=[];
                        var check=Math.min(101,trigger.player.maxHp-trigger.player.hp+1);
                        for(var i=1;i<check;i++){
                            num.push(i);
                        }
                        trigger.player.recover(num.randomGet());
                        trigger.player.draw();
                        event.finish();
                    }
                    else if(trigger.player.hp>0){
                        game.resetSkills();
                        trigger.player.addTempSkill('ymyucheng_mianyi',{player:'phaseAfter'});
                        if(trigger.source&&!player.getFriends(true).contains(trigger.source)) trigger.source.addTempSkill('ymyucheng_fengyin',{player:'phaseBegin'});
                        event.goto(3);
                    }
                    else event.finish();
                    'step 3'
                    while (_status.event.name != 'phaseLoop') {
                        _status.event = _status.event.parent;
                    }
                    _status.paused = false;
                    _status.event.player = player;
                    _status.event.step = 0;
                },
                subSkill:{
                    fengyin:{
                        init:function(player,skill){
                            player.addSkillBlocker(skill);
                            var skill_blocker,disableEquip,_disableJudge;
                            if(player.storage.skill_blocker) skill_blocker=player.storage.skill_blocker.slice(0);
                            if(player.storage.disableEquip) disableEquip=player.storage.disableEquip.slice(0);
                            if(player.storage._disableJudge) _disableJudge=player.storage._disableJudge;
                            var clear=function(obj){
                                Object.keys(obj).forEach(key => {
                                    if (typeof obj[key]=='object' && obj[key] != null){
                                        if(['card','cards'].contains(get.itemtype(obj[key]))){
                                            game.cardsDiscard(obj[key]);
                                            game.log('【'+get.translation(obj[key]),'】被置入了弃牌堆');
                                            obj[key]=[];
                                        }
                                        else if(['player','players'].contains(get.itemtype(obj[key]))){
                                            game.log('【'+get.translation(obj[key]),'】不再是目标');
                                            obj[key]=[];
                                        }
                                        else if(!Array.isArray(obj[key])){
                                            clear(obj[key])
                                        }
                                        else{
                                            obj[key]=[];
                                        }
                                    }
                                    else if(typeof obj[key]=='number'){
                                        obj[key]=0;
                                    }
                                    else if(typeof obj[key]=='string'){
                                        obj[key]='';
                                    }
                                    //else if(typeof obj[key]=='boolean'){
                                    //    obj[key]=undefined
                                    //}
                                    player.markAuto(key);
                                });
                            }
                            clear(player.storage);
                            if(skill_blocker) player.storage.skill_blocker=skill_blocker;
                            if(disableEquip) player.storage.disableEquip=disableEquip;
                            if(_disableJudge) player.storage._disableJudge=_disableJudge;
                            if(player.getCards('sx')){
                                player.getCards('sx').forEach(item => item.gaintag=[]);
                                game.cardsDiscard(player.getCards('sx'));
                                player.$throw(player.getCards('sx'));
                            }
                            player.updateMarks();
                            var skills=player.getSkills(true,true,false);
                            for(var i=0;i<skills.length;i++){
                                if(!lib.translate[skills[i]+'_info']) skills.splice(i--,1);
                            };
                            player.disableSkill(skill, skills, true, true);
                        },
                        onremove:function(player,skill){
                            player.enableSkill(skill);
                            player.removeSkillBlocker(skill);
                        },
                        charlotte:true,
                        superCharlotte:true,
                        skillBlocker:function(skill,player){
                            return lib.translate[skill+'_info'];
                        },
                        mark:true,
                        marktext:'封魂',
                        intro:{
                            content:function(storage,player,skill){
                                var list=player.getSkills(true,false,false).filter(function(i){
                                    return lib.skill.ymyucheng_fengyin.skillBlocker(i,player);
                                });
                                if(list.length) return '失效技能：'+get.translation(list);
                                return '无失效技能';
                            },
                        },
                    },
                    mianyi:{
                        trigger:{
                            player:['damageBefore','damageBegin4','loseHpBefore'],
                        },
                        charlotte:true,
                        superCharlotte:true,
                        forced:true,
                        mark:true,
                        marktext:'仙魂',
                        intro:{
                            content:function(storage,player,skill){
                                return '防止受到任何伤害和体力流失';
                            },
                        },
                        content:function(){
                            trigger.untrigger();
                            trigger.finish();
                        },
                    },
                },
            },
            ymtuoshu: {
                enable: "phaseUse",
                audio:"ext:清瑶葭绮/members/假装无敌:true",
                filterTarget: function (card, player, target) {
                    if(target==player) return false;
                    //if(target.countCards('hej')<=0) return false;
                    var stat=player.getStat('skill').ymtuoshu_targets;
                    return !stat||!stat.contains(target);
                },
                filter:function(event,player){
                    return game.hasPlayer((current)=>lib.skill.ymtuoshu.filterTarget(null,player,current));
                },
                content: function () {
                    'step 0'
                    if(target.countCards('hej')==0){
                        event.cards=get.cards(1);
                    }
                    else player.choosePlayerCard('hej', target, true, 'visible');
                    'step 1'
                    if (result.bool||event.cards) {
                        _status.dying.remove(target);
                        if(result.cards) event.cards=result.cards;
                        player.showCards(event.cards);
                        if(!result.cards){
                            game.delay(1.5);
                            event.cards[0].discard();
                            target.$throw(event.cards);
                        }
                        var num = lib.translate[event.cards[0].name].length;
                        var s = [Math.ceil(num / 2), Math.max(1, Math.floor(num / 2))];
                        target.damage(s.randomGet())._triggered = null;
                        player.draw(s.randomGet())._triggered = null;
                        var stat=player.getStat('skill');
                        if(!stat.ymtuoshu_targets) stat.ymtuoshu_targets=[];
                        stat.ymtuoshu_targets.push(target);
                        event.num=target.getHistory('damage',function(evt){
                            return evt.getParent(1).name=='ymtuoshu';
                        }).length;
                    }
                    else event.finish();
                    'step 2'
                    var num= target.getHistory('damage',function(evt){
                        return evt.getParent(1).name=='ymtuoshu';
                    }).length;
                    if(target.hp>=player.hp||num<=event.num){
                        var num=Math.ceil(target.hp/2);
                        target.hp-=num;
                        if(target.updateNum) target.updateNum-=num;
                        target.$damage(player);
                        target.$damagepop(-num);
                        game.playqysstx('qy_damage'+(num>1?'2':''));
                        var str='受到了来自<span class="bluetext">'+(target==player?'自己':get.translation(player))+'</span>的'+get.cnNumber(num)+'点虚无伤害';
                        game.log(target,str);
                        target.update();
                        if(player.攻击分数){
                            if (get.attitude(target, player) < 0 || player.identity == 'nei') num > 5 ? player.攻击分数 += 15 : player.攻击分数 += 3 * num;
                        }
                        if(target.stat[target.stat.length-1].damaged==undefined){
                            target.stat[target.stat.length-1].damaged=num;
                        }
                        else{
                            target.stat[target.stat.length-1].damaged+=num;
                        }
                        if(player.stat[player.stat.length-1].damage==undefined){
                            player.stat[player.stat.length-1].damage=num;
                        }
                        else{
                            player.stat[player.stat.length-1].damage+=num;
                        }
                        event.goto(3);
                    }
                    else event.finish();
                    'step 3'
                    event.source=player;
                    if(target.hp<=0){
                        event._dyinged=true;
                        target.dying(event).source=player;
                    }
                },
                ai: {
                    order: 10,
                    result: {
                        player:function(player, target) {
                            return -ai.get.attitude(player, target);
                        },
                        target: function (player, target) {
                            return -Infinity;
                        },
                    },
                },
            },
            ymtianjie:{
                trigger:{
                    global:'useCard',
                },
                audio:"ext:清瑶葭绮/members/假装无敌:true",
                filter:function(event,player){
                    if(event.card.name=='shan'||event.card.name=='wuxie') return false;
                    //if(event.targets.length==1&&event.targets[0]==player) return false;
                    var targets=player.getEnemies();
                    var goon=false;
                    for(var i=0;i<targets.length;i++){
                        if(event.targets.contains(targets[i])&&player.getFriends().concat(player).contains(event.player)) goon=true;
                    }
                    if(goon==false) return false;
                    var phase;
                    for(var i=0;i<lib.phaseName.length;i++){
                        if(_status.event.getParent(lib.phaseName[i]).name){
                            phase=_status.event.getParent(lib.phaseName[i]).name;
                            break;
                        }
                    }
                    if(event.player.getHistory('useCard', function (evt) {
                        for(var i=1;i<50;i++){
                            if(evt.getParent(i)&&evt.getParent(i).name==phase){
                                if(game.findPlayer(function (current) {
                                    return evt.targets&&evt.targets.contains(current)&&targets.contains(current)&&player.getFriends().concat(player).contains(event.player);
                                })) return true;
                            }
                        }
                    }).length>1) return false;
                    return true;
                },
                forced:true,
                lastDo:true,
                content:function(){
                    trigger.directHit.addArray(game.filterPlayer(function(current) {
                        return player.getEnemies().contains(current)&&current!=player;
                    }));
                    player.line(player.getEnemies());
                },
                group:'ymtianjie_damage',
                subSkill:{
                    damage:{
                        trigger:{
                            global:'changeHp',
                        },
                        filter:function(event,player){
                            var evt=event.getParent();
                            if(!evt||evt.name!='damage'||evt.source!=player) return false;
                            var players=player.getFriends().concat([player]);
                            if(players.contains(evt.player.next)&&players.contains(evt.player.previous)) return false;
                            if(evt.player.hp<=0&&(evt.player.next.hp<=0||players.contains(evt.player.next))&&(evt.player.previous.hp<=0||players.contains(evt.player.previous))) return false;
                            var name='ymtianjie_damage',e=event,num=0;
                            while(e.name){
                                if(e.name==name) num++;
                                e=e.parent;
                            }
                            if(num>50) return false;
                            return evt.num>=2;
                        },
                        direct:true,
                        forced:true,
                        content:function(){
                            'step 0'
                            player.logSkill('ymtianjie');
                            var evt=trigger.getParent();
                            var players=player.getFriends().concat([player]);
                            if(!lib.linked_backup) lib.linked_backup=lib.linked.slice(0);
                            if(evt.nature) lib.linked=[];
                            event._args=[Math.floor(evt.num/2),evt.nature,evt.cards,evt.card,evt.source];
                            if(!players.contains(evt.player.next)) evt.player.next.damage.apply(evt.player.next,event._args.slice(0)).set(evt._triggered==null?'_triggered':'',evt._triggered);
                            if(!players.contains(evt.player.previous)) evt.player.previous.damage.apply(evt.player.previous,event._args.slice(0)).set(evt._triggered==null?'_triggered':'',evt._triggered);
                            'step 1'
                            if(trigger.getParent(event.name).name!=event.name&&trigger.getParent().nature&&lib.linked_backup){
                                lib.linked=lib.linked_backup.slice(0);
                                delete lib.linked_backup;
                            }
                        },
                    },
                }
            },
            ymshuyun: {
                trigger: {
                    player: ['gainEnd', 'showCardsEnd', 'showHandcardsEnd', 'viewCardsEnd']
                },
                audio:"ext:清瑶葭绮/members/假装无敌:true",
                filter: function (event, player, name) {
                    if (!event.cards||event.cards.length==0) return false
                    return game.findPlayer2(target => {
                        for (let card of event.cards){
                            var info=lib.card[card.name];
                            if(info.autoViewAs){
                                if(player.canUse({card:card,name:info.autoViewAs},target,false)) return true;
                            }
                            else if (player.canUse(card, target, false)) return true
                        }
                        return false;
                    });
                },
                forced: true,
                content: function () {
                    'step 0'
                    event.cards = trigger.cards.slice(0);
                    'step 1'
                    let card = event.cards.shift();
                    const clone = lib.qyCopyCardAttributes(card);
                    event.createCard = game.createCard2(card);
                    Object.assign(event.createCard, clone);
                    if(get.type(event.createCard)=='equip') delete event.createCard.destroyed,event.destroyed=true;
                    let info = lib.card[event.createCard.name];
                    if(info.autoViewAs) player.chooseUseTarget([event.createCard],{name:info.autoViewAs}, false, 'nodistance');
                    else player.chooseUseTarget(event.createCard, false, 'nodistance');
                    'step 2'
                    if (result.bool&&event.destroyed) event.createCard.destroyed=true;
                    if (event.cards.length > 0) event.goto(1);
                }
            },
            ymshigu: {
                trigger: {
                    global:['damage', 'recoverBegin', 'changeHp'],
                },
                forced: true,
                audio:"ext:清瑶葭绮/members/假装无敌:true",
                priority: 50,
                firstDo: true,
                filter: function (event, player, name) {
                    if (name === 'damage') {
                        if (!event.player) return false;
                        if (!event.source) return false;
                        var friends=player.getFriends().concat(player);
                        return friends.contains(event.source)&&player.getEnemies().contains(event.player);
                    }
                    else if (name === 'recoverBegin' || name === 'changeHp') {
                        if (name === 'changeHp' && event.getParent().name === 'recover' && event.getParent()._triggered != null) return false;
                        return player.getEnemies().contains(event.player) && event.player.countCards('he') > 0 && event.num > 0;
                    }
                    return false;
                },
                content: function(){
                    'step 0'
                    if (event.triggername === 'damage') {
                        var cards=[];
                        for(i=0;i<ui.cardPile.childNodes.length;i++){
                            cards.push(ui.cardPile.childNodes[i]);
                        }
                        cards.randomSort();
                        for(var i=0;i<cards.length;i++){
                            ui.cardPile.appendChild(cards[i]);
                        }
                        event.goto(1);
                    }
                    else if (['recoverBegin','changeHp'].contains(event.triggername)) {
                        event.goto(4);
                    }
                    'step 1'
                    event.card = get.cards(1)
                    if(event.card) player.showCards(event.card);
                    'step 2'
                    if (event.card[0].number >= trigger.player.hp&&trigger.player.isAlive()) {
                        var target=trigger.player;
                        _status.dying.remove(target);
                        var num=1;
                        if(target.hp>20) num+=target.hp;
                        target.hp-=num;
                        if(target.updateNum) target.updateNum-=num;
                        target.$damage(player);
                        target.$damagepop(-num);
                        game.playqysstx('qy_damage'+(num>1?'2':''));
                        var str='受到了来自<span class="bluetext">'+(target==player?'自己':get.translation(player))+'</span>的'+get.cnNumber(num)+'点虚无伤害';
                        game.log(target,str);
                        target.update();
                        if(player.攻击分数){
                            if (get.attitude(target, player) < 0 || player.identity == 'nei') num > 5 ? player.攻击分数 += 15 : player.攻击分数 += 3 * num;
                        }
                        if(target.stat[target.stat.length-1].damaged==undefined){
                            target.stat[target.stat.length-1].damaged=num;
                        }
                        else{
                            target.stat[target.stat.length-1].damaged+=num;
                        }
                        if(player.stat[player.stat.length-1].damage==undefined){
                            player.stat[player.stat.length-1].damage=num;
                        }
                        else{
                            player.stat[player.stat.length-1].damage+=num;
                        }
                        event.goto(3);
                    }
                    else event.finish();
                    'step 3'
                    event.source=player;
                    if(trigger.player.hp<=0){
                        event._dyinged=true;
                        trigger.player.dying(event).source=player;
                    }
                    event.finish();
                    'step 4'
                    var num=trigger.player.getCards('he').length;
                    var goon;
                    if(event.triggername=='recoverBegin'){
                        if(trigger.num>num) trigger.num-=num;
                        else trigger.cancel();
                    }
                    else{
                        if(trigger.num>num) trigger.player.changeHp(-num)._triggered=null;
                        else trigger.player.changeHp(-trigger.num)._triggered=null;
                        goon=true;
                    }
                    var cards=trigger.player.getCards('he').randomGets(trigger.num);
                    if(goon) trigger.num=Math.max(trigger.num-num,0);
                    trigger.player.lose(cards)._triggered=null;
                    trigger.player.$throw(cards);
                },
            },
            ymguiyuan: {
                enable: "phaseUse",
                audio:"ext:清瑶葭绮/members/假装无敌:true",
                filterTarget: function (card, player, target) {
                    if(target==player) return false;
                    return !target.getHistory('custom', history => history.type === 'ymguiyuan').length;
                },
                filter: function (event, player) {
                    return game.hasPlayer((current) => lib.skill.ymguiyuan.filterTarget(null, player, current));
                },
                content: function () {
                    'step 0'
                    if (target.countCards('hej') == 0) {
                        event.cards = get.cards(1);
                    } else {
                        player.choosePlayerCard('hej', target, true, 'visible');
                    }
                    'step 1'
                    if (result.bool || event.cards) {
                        if (result.cards) event.cards = result.cards;
                        player.showCards(event.cards);
                        if (!result.cards) {
                            game.delay(1.5);
                            event.cards[0].discard();
                            target.$throw(event.cards);
                        }
                        var num = lib.translate[event.cards[0].name].length;
                        var ymguiyuanNum = 0
                        var customHistory = {
                            type: 'ymguiyuan',
                            cardTranslate: lib.translate[event.cards[0].name],
                            num,
                            ignore: false
                        }
                        target.getHistory('custom').push(customHistory)
                        const allHistory = target.getAllHistory('custom', history => !history.ignore && history.type === 'ymguiyuan');
                        ymguiyuanNum = allHistory.reduce((previousValue, currentValue, currentIndex, array) => previousValue + currentValue.num, 0);

                        if (ymguiyuanNum >= target.maxHp || ymguiyuanNum >= 20) {
                            _status.dying.remove(target);
                            player.recover(1);
                            game.ymguiyuan=true;
                            target.damage(Math.ceil(target.maxHp / 2))._triggered=null;
                            allHistory.forEach(item => item.ignore = true)
                            event.live=true;
                            event.num=target.getHistory('damage',function(evt){
                                return evt.getParent(1).name=='ymguiyuan';
                            }).length;
                        }
                    }
                    'step 2'
                    var num= target.getHistory('damage',function(evt){
                        return evt.getParent(1).name=='ymguiyuan';
                    }).length;
                    if(event.live&&num<=event.num){
                        _status.dying.remove(target);
                        game.ymguiyuan=true;
                        var num=Math.ceil(target.maxHp/2);
                        target.hp-=num;
                        if(target.updateNum) target.updateNum-=num;
                        target.$damage(player);
                        target.$damagepop(-num);
                        game.playqysstx('qy_damage'+(num>1?'2':''));
                        var str='受到了来自<span class="bluetext">'+(target==player?'自己':get.translation(player))+'</span>的'+get.cnNumber(num)+'点虚无伤害';
                        game.log(target,str);
                        target.update();
                        if(player.攻击分数){
                            if (get.attitude(target, player) < 0 || player.identity == 'nei') num > 5 ? player.攻击分数 += 15 : player.攻击分数 += 3 * num;
                        }
                        if(target.stat[target.stat.length-1].damaged==undefined){
                            target.stat[target.stat.length-1].damaged=num;
                        }
                        else{
                            target.stat[target.stat.length-1].damaged+=num;
                        }
                        if(player.stat[player.stat.length-1].damage==undefined){
                            player.stat[player.stat.length-1].damage=num;
                        }
                        else{
                            player.stat[player.stat.length-1].damage+=num;
                        }
                        event.goto(3);
                    }
                    else event.finish();
                    'step 3'
                    event.source=player;
                    if(target.hp<=0){
                        event._dyinged=true;
                        target.dying(event).source=player;
                    }
                },
                mark: true,
                marktext: '归愿',
                intro: {
                    content: function (storage, player) {
                        return '<li>' + game.players.slice(0).remove(player).map(current => {
                            const num = current.getAllHistory('custom', history => !history.ignore && history.type === 'ymguiyuan').reduce((previousValue, currentValue, currentIndex, array) => previousValue + currentValue.num, 0)
                            return `${get.translation(current)}：归愿「${num}」次`
                        }).join('<li>')
                    },
                },
                ai: {
                    order: 10,
                    result: {
                        player:function(player, target) {
                            return -ai.get.attitude(player, target);
                        },
                        target: function (player, target) {
                            return -Infinity;
                        },
                    },
                },
            },
            ymtianyu:{
                trigger:{
                    global:'useCard',
                },
                audio:"ext:清瑶葭绮/members/假装无敌:true",
                filter:function(event,player){
                    if(event.card.name=='shan'||event.card.name=='wuxie') return false;
                    var targets=player.getFriends().concat(player);
                    var goon=false;
                    for(var i=0;i<targets.length;i++){
                        if(event.targets.contains(targets[i])&&player.getEnemies().contains(event.player)) goon=true;
                    }
                    if(goon==false) return false;
                    var phase;
                    for(var i=0;i<lib.phaseName.length;i++){
                        if(_status.event.getParent(lib.phaseName[i]).name){
                            phase=_status.event.getParent(lib.phaseName[i]).name;
                            break;
                        }
                    }
                    if(event.player.getHistory('useCard', function (evt) {
                        for(var i=1;i<50;i++){
                            if(evt.getParent(i)&&evt.getParent(i).name==phase){
                                if(game.findPlayer(function (current) {
                                    return evt.targets&&evt.targets.contains(current)&&targets.contains(current)&&player.getEnemies().contains(event.player);
                                })) return true;
                            }
                        }
                    }).length>1) return false;
                    return true;
                },
                forced:true,
                lastDo:true,
                content:function(){
                    var targets=player.getFriends().concat(player);
                    var target=[];
                    for(var i=0;i<targets.length;i++){
                        if(trigger.targets.contains(targets[i])) target.add(targets[i])
                    }
                    trigger.excluded.addArray(target);
                    player.line(target);
                },
                group:'ymtianyu_recover',
                subSkill:{
                    recover:{
                        trigger:{
                            player:'changeHp',
                        },
                        usable:50,
                        filter:function(event,player){
                            var evt=event.getParent();
                            if(!evt||evt.name!='recover') return false;
                            var players=player.getFriends().concat(player);
                            if(!players.contains(player.next)&&!players.contains(player.previous)) return false;
                            if(player.next.hp>=player.next.maxHp&&player.previous.hp>=player.previous.maxHp) return false;
                            var name='ymtianyu_recover',e=event,num=0;
                            while(e.name){
                                if(e.name==name) num++;
                                e=e.parent;
                            }
                            if(num>50) return false;
                            return event.num>=1;
                        },
                        direct:true,
                        forced:true,
                        content:function(){
                            'step 0'
                            player.logSkill('ymtianyu');
                            var evt=trigger.getParent();
                            event._args=[evt.num,evt.cards,evt.card,evt.source];
                            var players=player.getFriends().concat(player);
                            if(!lib.linked_backup) lib.linked_backup=lib.linked.slice(0);
                            if(evt.nature) lib.linked=[];
                            if(players.contains(player.next)) player.next.recover.apply(player.next,event._args.slice(0)).set(evt._triggered==null?'_triggered':'',evt._triggered);
                            if(players.contains(player.previous)) player.previous.recover.apply(event._args,event._args.slice(0)).set(evt._triggered==null?'_triggered':'',evt._triggered);
                            'step 1'
                            if(trigger.getParent(event.name).name!=event.name&&trigger.getParent().nature&&lib.linked_backup){
                                lib.linked=lib.linked_backup.slice(0);
                                delete lib.linked_backup;
                            }
                        },
                    },
                },
            },
            ymxuwang:{
                trigger:{
                    player:'recoverBegin',
                    source:'damageBegin',
                },
                forced:true,
                init:function(player){
                    player.node.nameol.innerHTML='<span style="font-size: 23px;font-family: xingkai;color: #99ffff;text-shadow: transparent 0 0 1px, rgba(10, 155, 67, 1) 0 0 2px, rgba(10, 155, 67, 1) 0 0 5px, rgba(10, 155, 67, 1) 0 0 5px, rgba(10, 155, 67, 1) 0 0 5px, transparent 0 0 1px;">虚 妄</span>';
                },
                onremove:function(player){
                    player.node.nameol.innerHTML='';
                },
                filter:function(event,player,name){
                    if(name=='recoverBegin') return true;
                    else{
                        var phase;
                        for(var i=0;i<lib.phaseName.length;i++){
                            if(_status.event.getParent(lib.phaseName[i]).name){
                                phase=_status.event.getParent(lib.phaseName[i]).name;
                                break;
                            }
                        }
                        if(player.getHistory('sourceDamage', function (evt) {
                            for(var i=1;i<50;i++){
                                if(evt.getParent(i)&&evt.getParent(i).name==phase&&evt.player==event.player) return true;
                            }
                        }).length>0) return true;
                    }
                },
                content:function(){
                    if(event.triggername=='recoverBegin') trigger.num--;
                    else trigger.cancel();
                },
            },
            //---------------------------------------character------------------------------------------
            ymhuashen: {
                trigger: {
                    global: "gameStart",
                    player: ["enterGame", "phaseUseBegin", "changeHp"],
                },
                audio: "rehuashen",
                mark:true,
                intro:{
                    name:"化身",
                    mark:function (dialog, content, player) {
                        if (player.storage.ymhuashen) {
                            dialog.addText("已获得的武将牌：");
                            dialog.add([player.storage.ymhuashen,'character']);
                        }
                        else dialog.addText("暂无获得的武将牌");
                    },
                },
                forced: true,
                content: function () {
                    'step 0'
                    if (!player.storage.ymhuashen) player.storage.ymhuashen = [];
                    var list=[];
                    for(var i in lib.character){
                        if(lib.character[i][4].contains('unseen')) continue;
                        if(lib.character[i][4].contains('hiddenboss')) continue;
                        if(player.storage.ymhuashen.contains(i)) continue;
                        if(i.indexOf('zuoci')!=-1||i.indexOf('xushao')!=-1) continue;
                        list.push(i);
                    }
                    list=list.randomGets(5);
                    player.chooseButton([1,2],['【化身】：选择获得至多两张武将牌上的所有技能', [list, 'character']]).ai = function(button) {
                        return get.rank(button.link, true);
                    }
                    'step 1'
                    if (result.bool) {
                        var skill=[];
                        for(var i=0;i<result.links.length;i++){
                            player.storage.ymhuashen.add(result.links[i]);
                            player.flashAvatar('ynhuashen',result.links[i]);
                            skill=skill.concat(lib.character[result.links[i]][3]);
                        }
                        if(result.links.length<2) player.draw(2-result.links.length);
                        if(!player.ymhuashen) player.ymhuashen={};
                        if(!player.ymhuashen.skill){
                            player.ymhuashen.skill=[];
                        }
                        if(!player.ymhuashen.global){
                            player.ymhuashen.global=[];
                        }
                        if(!player.ymhuashen.zhu){
                            player.ymhuashen.zhu=[];
                        }
                        for (var i = 0; i < skill.length; i++) {
                            var group=[skill[i]].slice(0);
                            var global=[];
                            for(var j=0;j<group.length;j++){
                                if(lib.skill[group[j]]){
                                    var n1=group[j];
                                    var s1=lib.skill[n1];
                                    if(s1.direct) delete s1.direct;
                                    if(s1.chooseButton&&s1.chooseButton.backup){
                                        var backup=(get.info(n1).chooseButton).backup(['','','',''],player);
                                        if(!s1.content) group[j]=n1+'_backup';
                                        else group.add(n1+'_backup');
                                        if(backup.precontent) group[j]='pre_'+group[j];
                                    }
                                    if(s1.precontent){
                                        group.remove(n1);
                                        group.add('pre_'+n1);
                                    }
                                    if(s1.group) group=group.concat(s1.group);
                                    if(s1.global){
                                        global=global.concat(s1.global);
                                        for(var k=0;k<global.length;k++){
                                            if(lib.skill[global[k]]){
                                                var n2=global[k];
                                                var s2=lib.skill[n2];
                                                if(s2.direct) delete s2.direct;
                                                if(s2.chooseButton&&s2.chooseButton.backup){
                                                    var backup=(get.info(n2).chooseButton).backup(['','','',''],player);
                                                    if(!s2.content) global[k]=n2+'_backup';
                                                    else global.add(n2+'_backup');
                                                    if(backup.precontent) global[k]='pre_'+global[k];
                                                }
                                                if(s2.precontent){
                                                    global.remove(n2);
                                                    global.add('pre_'+n2);
                                                }
                                                if(s2.group) global=global.concat(s2.group);
                                                if(s2.global) global=global.concat(s2.global);
                                            }
                                        }
                                    }
                                }
                            }
                            for(var j=0;j<group.length;j++){
                                if(group.indexOf(group[j])!=j) group.splice(j--, 1);
                                else if(lib.skill[group[j]]&&(lib.skill[group[j]].popup==false||lib.skill[group[j]].silent)) group.splice(j--, 1);
                            }
                            for(var j=0;j<global.length;j++){
                                if(global.indexOf(global[j])!=j) global.splice(j--, 1);
                                else if(lib.skill[global[j]]&&(lib.skill[global[j]].popup==false||lib.skill[global[j]].silent)) global.splice(j--, 1);
                            }
                            player.ymhuashen.zhu.add(skill[i]);
                            player.ymhuashen.global.addArray(global);
                            player.ymhuashen.skill.addArray(group).addArray(global);
                            group=group.map(item => item + 'After');
                            global=global.map(item => item + 'After');
                            player.addTempSkill(skill[i],{player:group,global:global});
                        }
                        for(var i=0;i<skill.length;i++) skill[i]='【'+get.translation(skill[i])+'】';
                        game.log(player, '获得了', `#g${skill}`);
                    }
                    else player.draw(2);
                    'step 2'
                    if(player.isLinked()) player.link();
                    if(player.isTurnedOver()) player.turnOver();
                    for(var i=1;i<6;i++) if(player.isDisabled(i)) player.enableEquip('equip'+i);
                    var maxHp=get.infoMaxHp(lib.character['qy_qyzuoci'][2]);
                    if(player.maxHp<maxHp){
                        player.maxHp=maxHp;
                        player.update();
                    }
                },
                group:'ymhuashen_skill',
                subSkill:{
                    skill:{
                        trigger:{
                            global:['useSkillAfter','useCardAfter','respondAfter'],
                        },
                        silent:true,
                        popup:false,
                        forced:true,
                        filter:function(event,player){
                            if(!player.ymhuashen) return false;
                            if(player.ymhuashen.global&&player.ymhuashen.global.contains(event.skill)) return true;
                            if(player.ymhuashen.skill&&player.ymhuashen.skill.contains(event.skill)) return event.player==player;
                            return false;
                        },
                        content:function(){
                            var skill=player.ymhuashen.zhu.slice(0);
                            for(var i=0;i<skill.length;i++){
                                var temp=[skill[i]];
                                if(lib.skill[skill[i]]){
                                    for(var j=0;j<temp.length;j++){
                                        if(lib.skill[temp[j]]){
                                            var n=temp[j];
                                            var s=lib.skill[n];
                                            if(s.chooseButton&&s.chooseButton.backup){
                                                var backup=(get.info(n).chooseButton).backup(['','','',''],player);
                                                if(!s.content) temp[j]=n+'_backup';
                                                else temp.add(n+'_backup');
                                                if(backup.precontent) temp[j]='pre_'+temp[j];
                                            }
                                            if(s.precontent){
                                                temp.remove(n);
                                                temp.add('pre_'+n);
                                            }
                                            if(s.group) temp=temp.concat(s.group);
                                            if(s.global) temp=temp.concat(s.global);
                                        }
                                    }
                                    temp=[skill[i]].addArray(temp);
                                }
                                if(temp.contains(trigger.skill)){
                                    var parent;
                                    for(var j=0;j<player.ymhuashen.zhu.length;j++){
                                        if(temp.contains(player.ymhuashen.zhu[j])){
                                            parent=player.ymhuashen.zhu[j];break;
                                        }
                                    }
                                    if(player.tempSkills[parent]){
                                        player.removeSkill(parent);
                                        player.ymhuashen.zhu.remove(parent);
                                        player.ymhuashen.skill.removeArray(temp);
                                        player.ymhuashen.global.removeArray(temp);
                                    }
                                    break;
                                }
                            }
                        },
                    },
                },
            },
            ymxinsheng: {
                mark: true,
                audio: "xinsheng",
                limited: true,
                skillAnimation: true,
                animationColor: "water",
                unique: true,
                enable: "phaseUse",
                init: function (player) {
                    player.storage.ymxinsheng = false;
                },
                filterTarget: function (card, player, target) {
                    return true;
                },
                filter: function (event, player) {
                    if (player.storage.ymxinsheng == true) return false;
                    return true;
                },
                content: function () {
                    "step 0"
                    player.storage.ymxinsheng = true;
                    player.awakenSkill(event.name);
                    "step 1"
                    var list = [];
                    if (!_status.characterskill) {
                        _status.characterskill = [];
                        for (var i in lib.character) {
                            if (Array.isArray(lib.character[i][3])) _status.characterskill.addArray(lib.character[i][3]);
                        }
                    }
                    for (var i in lib.skill) {
                        if (!lib.translate[i] || !lib.translate[i+'_info'] || get.translation(i + '_info').length == 0) continue;
                        if (_status.characterskill.contains(i)) list.add(i);
                    }
                    var num = player.getSkills(true,false).length;
                    for (var i = 0; i < player.getSkills(true,false).length; i++) {
                        if (!list.contains(player.getSkills(true,false)[i])) num--;
                    }
                    var skill = list.randomGets(num);
                    var skill1 = target.getSkills(true, false);
                    for (var i = 0; i < skill1.length; i++) {
                        if (!lib.translate[i] || !lib.translate[i+'_info'] || get.translation(i + '_info').length == 0) target.removeSkill(skill1[i], true);
                    }
                    for (var i = 0; i < skill.length; i++) {
                        target.addSkill(skill[i]);
                    }
                    game.log(target, '的技能被替换成了', `#g【${get.translation(skill)}】`);
                },
                ai: {
                    order: 9,
                    result:{
                        target:function(player,target){
                            var num1 = target.getSkills(true, false).length;
                            var num2 = player.getSkills(true, false).length;
                            if(num1<num2){
                                return 1;
                            }
                            else if(num1>=num2){
                                return -1;
                            }
                        },
                    },
                },
                intro: {
                    content: "limited",
                },
            },
            ymlingren: {
                usable: 1,
                audio: "xinfu_lingren",
                trigger: {
                    player: "useCardToPlayered",
                },
                direct: true,
                filter: function (event, player) {
                    if(event.getParent().triggeredTargets3.length!=1) return false;
                    if (get.tag(event.card, 'damage')) return true;
                    return false;
                },
                content: function () {
                    'step 0'
                    event.count = 0;
                    player.chooseTarget([1, Infinity], get.prompt2(event.name), function (card, player, target) {
                        return _status.event.targets.contains(target);
                    }).set('ai', function (target) {
                        return 2 - get.attitude(_status.event.player, target);
                    }).set('targets', trigger.targets);
                    'step 1'
                    if (result.targets || (event.targets && event.count < event.targets.length)) {
                        if (!event.targets) event.targets = result.targets;
                        player.logSkill(event.name, event.targets[event.count]);
                        var target = event.targets[event.count];
                        event.target = target;
                        event.choice = {
                            basic: false,
                            trick: false,
                            equip: false,
                        }
                        var list = [];
                        list.push(['类型', '', 'basic']);
                        list.push(['类型', '', 'trick']);
                        list.push(['类型', '', 'equip']);
                        var choice = [];
                        var rand1 = 0.95;
                        if (!target.countCards('h', {type: ['basic']})) rand1 = 0.05;
                        if (!target.countCards('h')) rand1 = 0;
                        if (Math.random() < rand1) choice.add('basic');
                        var rand2 = 0.9;
                        if (!target.countCards('h', {type: ['trick', 'delay']})) rand2 = 0.1;
                        if (!target.countCards('h')) rand2 = 0;
                        if (Math.random() < rand2) choice.add('trick');
                        var rand3 = 0.75;
                        if (!target.countCards('h', {type: ['equip']})) rand3 = 0.25;
                        if (!target.countCards('h')) rand3 = 0;
                        if (Math.random() < rand3) choice.add('equip');
                        var dialog = ui.create.dialog('凌人', [list, 'vcard']);
                        if (!event.isMine() && choice.length == 0) event.goto(3);
                        player.chooseButton([0, 3], dialog).set('ai', function (button) {
                            var select = _status.event.button;
                            if (select.length == 0) return 0;
                            return select.contains(button.link[2]);
                        }).set('button', choice);
                    } else {
                        player.storage.counttrigger.ymlingren--;
                        event.finish();
                    }
                    'step 2'
                    if (result.bool) {
                        for (var i = 0; i < result.links.length; i++) {
                            event.choice[result.links[i][2]] = true;
                        }
                    } else {
                        player.storage.counttrigger.ymlingren--;
                        event.finish();
                    }
                    'step 3'
                    game.delay();
                    var reality = {
                        basic: false,
                        trick: false,
                        equip: false,
                    }
                    var he = event.targets[event.count].getCards('h');
                    for (var i = 0; i < he.length; i++) {
                        reality[get.type(he[i], 'trick')] = true;
                    }
                    event.num = 0;
                    var tl = ['basic', 'trick', 'equip'];
                    for (var i = 0; i < tl.length; i++) {
                        if (event.choice[tl[i]] == reality[tl[i]]) event.num++;
                    }
                    'step 4'
                    player.popup('猜对' + get.cnNumber(event.num) + '项');
                    game.log(player, '猜对了' + get.cnNumber(event.num) + '项');
                    if (event.num > 0) {
                        event.targets[event.count].addTempSkill('ymlingren_damage');
                        if(!event.targets[event.count].storage.ymlingren_damage) event.targets[event.count].storage.ymlingren_damage={};
                        if(!event.targets[event.count].storage.ymlingren_damage[get.type(trigger.card)]) event.targets[event.count].storage.ymlingren_damage[get.type(trigger.card)]=[];
                        event.targets[event.count].storage.ymlingren_damage[get.type(trigger.card)].add(player);
                    }
                    //var num = Math.min(event.count + 1, 3);
                    if (event.num > 1 && !event.draw) {
                        player.draw(event.targets.length);
                        event.draw = true;
                        if(event.targets.length<2) player.storage.counttrigger.ymlingren--;
                    }
                    if (event.num > 2) {
                        var list = [];
                        for (var i in lib.character) {
                            if (Array.isArray(lib.character[i][3])) list.addArray(lib.character[i][3]);
                        }
                        var skill = event.targets[event.count].getSkills(true, false);
                        var storage=(event.targets[event.count].storage.ymlingren_fengyin||[]);
                        for (var i = 0; i < skill.length; i++) {
                            if (!list.contains(skill[i]) || !lib.translate[skill[i]] || lib.skill[skill[i]] == undefined || lib.skill[skill[i]].hiddenSkill || lib.skill[skill[i]].equipSkill || storage.contains(skill[i])) skill.splice(i--, 1);
                        }
                        var addskill = skill.randomGet();
                        if(addskill){
                            if (player != event.targets[event.count]) {
                                event.targets[event.count].addTempSkill('ymlingren_fengyin', {player: 'phaseAfter'});
                                if(!event.targets[event.count].storage.ymlingren_fengyin) event.targets[event.count].storage.ymlingren_fengyin=[];
                               event.targets[event.count].storage.ymlingren_fengyin.add(addskill);
                            }
                            player.addTempSkill(addskill, {player: 'phaseBefore'});
                        }
                    }
                    if (event.count < event.targets.length - 1) {
                        event.count++;
                        event.goto(1);
                    }
                    'step 5'
                },
                ai: {
                    threaten: 2.4,
                },
                subSkill:{
                    damage:{
                        onremove:function (player){
                            delete player.storage.ymlingren_damage;
                        },
                        trigger:{
                            player:"damageBegin3",
                        },
                        filter:function (event,player){
                            var info=player.storage.ymlingren_damage;
                            if(!event.card) return false;
                            for(var i in info){
                                if(get.type(event.card)==i){
                                    return info[i].contains(event.source);
                                }
                            }
                        },
                        charlotte:true,
                        mark: true,
                        intro:{
                            content:function(storage,player,skill){
                                var info=player.storage.ymlingren_damage;
                                var str='';
                                if(info){
                                    str+='以下角色使用此类型的牌对你造成的伤害翻倍：';
                                    for(var i in player.storage.ymlingren_damage){
                                        str+='<br><li>'+get.translation(i)+'：'+get.translation(player.storage.ymlingren_damage[i]);
                                    }
                                }
                                if(str.length) return str;
                                else return '无加伤类型的牌';
                            },
                        },
                        silent:true,
                        popup:false,
                        forced:true,
                        content:function (){
                            trigger.num=trigger.num*2;
                        },
                    },
                    fengyin:{
                        init:function(player,skill){
                            player.addSkillBlocker(skill);
                        },
                        onremove:function(player,skill){
                            player.removeSkillBlocker(skill);
                            delete player.storage.ymlingren_fengyin;
                        },
                        charlotte:true,
                        skillBlocker:function(skill,player){
                            return player.storage.ymlingren_fengyin&&player.storage.ymlingren_fengyin.contains(skill);
                        },
                        mark:true,
                        intro:{
                            content:function(storage,player,skill){
                                var list=player.getSkills(null,false,false).filter(function(i){
                                    return lib.skill.ymlingren_fengyin.skillBlocker(i,player);
                                });
                                if(list.length) return '失效技能：'+get.translation(list);
                                return '无失效技能';
                            },
                        },
                    },
                },
            },
            ymfujian: {
                audio: "xinfu_fujian",
                trigger: {
                    player: ["phaseEnd", "phaseBegin"],
                },
                forced: true,
                filter: function (event, player) {
                    return game.countPlayer(function (current) {
                        if (current == player) return false;
                        return current.countCards('h') > 0;
                    });
                },
                content:function(){
                    'step 0'
                    player.chooseTarget(true, get.prompt2(event.name), function (card, player, target) {
                        return target != player && target.countCards('h') > 0;
                    }).set('ai', function (target) {
                        return 1 - get.attitude(_status.event.player, target);
                    });
                    'step 1'
                    event.target=result.targets[0];
                    var cards1=player.getCards('h');
                    var cards2=event.target.getCards('h');
                    game.cardsGotoOrdering(cards);
                    var next=player.chooseToMove();
                    next.set('list',[
                        [get.translation(event.target)+'的手牌',cards2,'对方手牌'],
                        [get.translation(player)+'的手牌',cards1,'我方手牌'],
                    ]);
                    next.set('prompt','伏间：点击移动双方的手牌');
                    next.set('processAI',function(list){
                        var player=_status.event.player;
                        var cards=list[0][1].concat(list[1][1]);
                        cards.sort(function(a,b){
                            return get.value(a,player)-get.value(b,player);
                        }).slice(0);
                        return [cards.slice(0,list[0][1].length),cards.slice(list[0][1].length,cards.length)];
                    });
                    "step 2"
                    var top=result.moved[0];
                    var bottom=result.moved[1];
                    var num=event.target.getCards('h').length;
                    top.removeArray(event.target.getCards('h'));
                    bottom.removeArray(player.getCards('h'));
                    player.popup('交换'+get.cnNumber(top.length)+'张');
                    game.log(player,'交换了',event.target,get.cnNumber(top.length)+'张牌');
                    if(top.length&&bottom.length) player.swapHandcards(event.target,top,bottom);
                    if(top.length==num){
                        var cards = [];
                        game.getGlobalHistory('cardMove', function (evt) {
                            if (evt == trigger || (evt.name != 'lose' && evt.name != 'cardsDiscard')) return false;
                            if (evt.name == 'lose' && evt.position != ui.discardPile) return false;
                            for (var i = 0; i < evt.cards.length; i++) {
                                cards.add(evt.cards[i]);
                            }
                        }, trigger);
                        var draw = cards.randomGets(Math.ceil(cards.length / 2));
                        player.gain(draw)._triggered = null;
                    }
                    game.delayx();
                },
                mod:{
                    selectTarget:function(card,player,range){
                        if(card.name=='sha'&&range[1]!=-1) range[1]++;
                    },
                },
            },
            ymguji: {
                audio: 'kunfen',
                trigger: {
                    player: "damageEnd",
                    source: "damageBegin1",
                },
                forced: true,
                filter: function (event, player, name) {
                    var group=[];
                    game.countPlayer(function (current) {
                        group.push(current.group);
                    });
                    var obj = {};
                    for(var i=0;i<group.length;i++){
                        var gro = Object.keys(obj);
                        if(gro.indexOf(String(group[i])) != -1)obj[group[i]]++;
                        else obj[group[i]] = 1;
                    }
                    var max = 0, min = Infinity;
                    var up = [], down = [];
                    for(var i in obj){
                        if(obj[i]>max){
                            max = obj[i];
                            up.length = 0;
                            up.push(i);
                        }else if(obj[i] == max){
                            up.push(i);
                        }
                        if(obj[i]<min){
                            min = obj[i];
                            down.length = 0;
                            down.push(i);
                        }else if(obj[i] == min){
                            down.push(i);
                        }
                    }
                    if(name=='damageBegin1'){
                        return down.contains(player.group);
                    }
                    else return up.contains(player.group);
                },
                content: function () {
                    'step 0'
                    if(event.triggername=='damageBegin1'){
                        trigger.num++;
                        player.discardPlayerCard(trigger.player, 'he', 2, true);
                        event.group=trigger.player.group;
                        event.goto(2);
                    }
                    else {
                        event.group=trigger.source.group;
                        player.chooseTarget('选择一名角色回复一点体力并摸两张牌', function (card, player, target) {
                            return true;
                        }).set('ai', function (target) {
                            var player = _status.event.player;
                            return ai.get.recoverEffect(target, player, player)+1;
                        });
                    }
                    'step 1'
                    if(result.targets){
                        result.targets[0].recover();
                        result.targets[0].draw(2);
                    }
                    'step 2'
                    player.changeGroup(event.group);
                },
            },
            ymhaixian: {
                audio: 'zhiji',
                trigger: {
                    player: "damageBegin4",
                },
                filter: function (event) {
                    return (event.num > 0);
                },
                content: function () {
                    "step 0"
                    player.chooseTarget([1, 2], true, get.prompt(event.name), '选择至多2名其他角色受到你造成的' + trigger.num + '点伤害', function (card, player, target) {
                        return target != player;
                    }).set('ai', function (target) {
                        var player = _status.event.player;
                        return get.damageEffect(target, player, player);
                    });
                    "step 1"
                    if (result.targets) {
                        for (var i = 0; i < result.targets.length; i++) {
                            result.targets[i].damage(trigger.num, trigger.nature);
                        }
                        var group=[];
                        game.countPlayer(function (current) {
                            group.push(current.group);
                        });
                        var obj = {};
                        for(var i=0;i<group.length;i++){
                            var gro = Object.keys(obj);
                            if(gro.indexOf(String(group[i])) != -1)obj[group[i]]++;
                            else obj[group[i]] = 1;
                        }
                        var max = 0;
                        for(var i in obj){
                            if(obj[i]>max) max = obj[i];
                        }
                        event.cards = get.cards(max);
                    }
                    "step 2"
                    if (event.cards.length > 1) {
                        player.chooseCardButton('将“害贤”牌分配给任意角色', true, event.cards, [1, event.cards.length]).set('ai', function (button) {
                            if (ui.selected.buttons.length == 0) return 1;
                            return 0;
                        });
                    } else if (event.cards.length == 1) {
                        event._result = {links: event.cards.slice(0), bool: true};
                    } else {
                        event.goto(5);
                    }
                    "step 3"
                    if (result.bool) {
                        for (var i = 0; i < result.links.length; i++) {
                            event.cards.remove(result.links[i]);
                        }
                        event.togive = result.links.slice(0);
                        player.chooseTarget('将' + get.translation(result.links) + '交给一名角色', true).set('ai', function (target) {
                            var att = get.attitude(_status.event.player, target);
                            if (_status.event.enemy) {
                                return -att;
                            } else if (att > 0) {
                                return att / (1 + target.countCards('h'));
                            } else {
                                return att / 100;
                            }
                        }).set('enemy', get.value(event.togive[0], player, 'raw') < 0);
                    }
                    "step 4"
                    if (result.targets.length) {
                        result.targets[0].gain(event.togive, 'draw');
                        player.line(result.targets[0], 'green');
                        game.log(result.targets[0], '获得了' + get.cnNumber(event.togive.length) + '张牌');
                        event.goto(2);
                    }
                    "step 5"
                    event.finish();
                },
                ai: {
                    maixie: true,
                    "maixie_hp": true,
                    effect: {
                        target: function (card, player, target) {
                            if (get.tag(card, 'damage')) {
                                if (player.hasSkillTag('jueqing', false, target)) return [1, -2];
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
            ymzhonglie: {
                audio: 'fengliang',
                trigger: {
                    global: "useCard",
                },
                direct: true,
                check: function (event, player) {
                    var att = 0;
                    for (var i = 0; i < event.targets.length; i++) {
                        att += get.attitude(player, event.targets[i]);
                    }
                    return att > 0;
                },
                filter: function (event, player) {
                    if(!event.targets) return false;
                    if(event.targets.contains(event.player)) return false;
                    if(!get.tag(event.card, 'damage')&&event.card.name!='tao') return false;
                    if (event.player==player) return false;
                    if(event.targets[0]==player&&event.targets.length==1) return false;
                    return true;
                },
                autodelay: true,
                content: function () {
                    'step 0'
                    event.num=trigger.targets.length-1;
                    player.chooseToDiscard('he', false, get.prompt(event.name), '弃置一张牌取消这些目标，然后你成为此目标').set('ai', function (card) {
                        return 8 - get.value(card);
                    });
                    'step 1'
                    if (result.bool) {
                        var targets=trigger.targets.slice(0).remove(player);
                        player.logSkill(event.name,targets);
                        trigger.excluded.addArray(targets);
                        trigger.player.line(player, 'green');
                        trigger.targets=[player];
                        player.draw(event.num);
                    }
                },
            },
            ymtaiping: {
                trigger: {
                    player: "loseAfter",
                },
                audio: 'xinleiji',
                filter: function (event, player) {
                    if (event.type != 'discard') return false;
                    for (var i = 0; i < event.cards.length; i++) {
                        if (event.cards[i].origina == 'j') return false;
                    }
                    for (var i = 0; i < event.cards.length; i++) {
                        if (get.position(event.cards[i]) == 'd') {
                            return true;
                        }
                    }
                    return false;
                },
                content: function () {
                    'step 0'
                    player.judge();
                    'step 1'
                    event.color = result.color;
                    event.card = result.card;
                    player.chooseTarget(`选择一名其他角色令其受到${result.color === 'red' ? '火' : '雷'}属性伤害`, lib.filter.notMe, function (target) {
                        var player = get.player();
                        return ai.get.damageEffect(target, player, player);
                    });
                    'step 2'
                    if (result.bool) {
                        event.targets = result.targets;
                        event.num=event.targets[0].getHistory('damage',function(evt){
                            return evt.getParent().name=='ymtaiping';
                        }).length;
                        result.targets.forEach(current => current.damage(event.color === 'red' ? 'fire' : 'thunder'));
                    } else event.finish();
                    'step 3'
                    if (event.targets[0].getHistory('damage',function(evt){
                        return evt.getParent().name=='ymtaiping';
                    }).length==event.num) {
                        var num = [1, 2].randomGet();
                        if (num == 1) event.targets[0].chooseToDiscard(2, true);
                        if (num == 2) player.draw(2);
                    }
                },
            },
            ymqiyi: {
                usable: 3,
                audio: 'xinguidao',
                trigger: {
                    source: 'damageEnd',
                },
                content: function () {
                    window.navigator.getBattery().then(battery => {
                        if (Math.random() <= battery.level) {
                            navigator.getBattery().then(battery => player.popup("<span style='color: OrangeRed'>当前电量：" + battery.level * 100 + "</span>"));
                            player.useSkill('ymtaiping');
                        }
                    }).catch(err => {
                        player.popup("<span style='color: OrangeRed'>当前电量：" + 100 + "</span>");
                        player.useSkill('ymtaiping')
                    });
                }
            },
            ymhuangtian: {
                audio: "huangtian2",
                trigger: {
                    player: "damageEnd",
                },
                forced: true,
                content: function () {
                    var num1 = 0;
                    var num2 = 0;
                    game.countPlayer(function (current) {
                        if (current.group == player.group) num1++;
                        else num2++;
                    });
                    if (num1 > 3) num1 = 3;
                    if (num2 > 3) num2 = 3;
                    player.draw(num1);
                    if (num2 > 0) player.chooseToDiscard(num2, true);
                },
            },
            ymtiandao: {
                audio: "guidao",
                zhuSkill: true,
                equipSkill: false,
                noHidden: true,
                inherit: "taipingyaoshu",
                mod: {
                    maxHandcard: function (player, num) {
                        if (player.isEmpty(5) && player.hasZhuSkill('ymtiandao')) {
                            if (get.mode() == 'guozhan') {
                                if (player.hasSkill('huangjintianbingfu')) {
                                    num += player.storage.huangjintianbingfu.length;
                                }
                                return num + game.countPlayer(function (current) {
                                    return current.isFriendOf(player);
                                });
                            }
                            return num + game.countGroup();
                        }
                        return num;
                    },
                },
                trigger: {
                    player: "damageBegin4",
                },
                filter: function (event, player) {
                    if (!lib.skill.taipingyaoshu.filter.apply(this, arguments)) return false;
                    if (!player.isEmpty(5)) return false;
                    if (!player.hasZhuSkill('ymtiandao')) return false;
                    if (player.hasSkillTag('unequip2')) return false;
                    if (event.source && event.source.hasSkillTag('unequip', false, {
                        name: event.card ? event.card.name : null,
                        target: player,
                        card: event.card
                    })) return false;
                    if (event.nature) return true;
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
                            if (!player.isEmpty(5) || !player.hasZhuSkill('ymtiandao')) return;
                            if (target.hasSkillTag('unequip2')) return;
                            if (player.hasSkillTag('unequip', false, {
                                name: card ? card.name : null,
                                target: target,
                                card: card
                            }) || player.hasSkillTag('unequip_ai', false, {
                                name: card ? card.name : null,
                                target: target,
                                card: card
                            })) return;
                            if (get.tag(card, 'natureDamage')) return 'zerotarget';
                            if (card.name == 'tiesuo') {
                                return [0, 0];
                            }
                        },
                    },
                },
                locked: true,
            },
            ymqiangwu: {
                audio: 'qiangwu',
                enable: "phaseUse",
                usable: 1,
                content: function () {
                    "step 0"
                    var color = ['black', 'red'];
                    player.chooseControl(color).set('prompt', '请猜测一种颜色').set('ai', function () {
                        return color.randomGet();
                    });
                    "step 1"
                    event.card = get.cards();
                    player.showCards(event.card);
                    if (result.control == get.color(event.card)) {
                        player.popup("<span style='color: red'>猜对</span>");
                        player.addTempSkill('ymqiangwu_sha');
                    }
                    if (result.control != get.color(event.card)) {
                        player.popup("<span style='color: black'>猜错</span>");
                        var card = [];
                        card.push(game.createCard('sha'));
                        card.push(game.createCard('jiu'));
                        player.gain(card, 'gain2');
                    }
                },
                ai: {
                    result: {
                        player: 1,
                    },
                    order: 11,
                },
                subSkill: {
                    sha: {
                        mod: {
                            targetInRange: function (card, player, target, now) {
                                if (get.type(card, 'basic')) return true;
                            },
                            cardUsable: function (card, player, num) {
                                if (get.type(card, 'basic')) return Infinity;
                            },
                        },
                        sub: true,
                    },
                },
            },
            ymjiejun: {
                trigger: {
                    player: "useCardToBegin",
                },
                audio: 'qiangwu',
                shaRelated: true,
                direct: true,
                filter: function (event, player) {
                    return event.card.name == 'sha' && event.target.hp > 0 && event.target.countCards('he') > 0;
                },
                content: function () {
                    'step 0'
                    var next = player.choosePlayerCard(trigger.target, 'hej', [1, Math.min(trigger.target.hp, trigger.target.countCards('he'))], get.prompt('ymjiejun', trigger.target));
                    next.set('ai', function (button) {
                        if (!_status.event.goon) return 0;
                        var val = get.value(button.link);
                        if (button.link == _status.event.target.getEquip(2)) return 2 * (val + 3);
                        return val;
                    });
                    next.set('goon', get.attitude(player, trigger.target) <= 0);
                    next.set('forceAuto', true);
                    'step 1'
                    if (result.bool) {
                        var target = trigger.target;
                        player.logSkill(event.name, trigger.target);
                        var type = [];
                        result.cards.forEach(card => type.add(get.position(card)));
                        trigger.baseDamage += type.length;
                        target.addToExpansion(result.cards,'giveAuto',target).gaintag.add('ymjiejun_2');
                        target.addSkill('ymjiejun_2');
                        //game.log(target, '失去了' + get.cnNumber(result.cards.length) + '张牌');
                    }
                },
                ai: {
                    "unequip_ai": true,
                    "directHit_ai": true,
                    skillTagFilter: function (player, tag, arg) {
                        if (get.attitude(player, arg.target) > 0) return false;
                        if (tag == 'directHit_ai') return arg.target.hp >= Math.max(1, arg.target.countCards('h') - 1);
                        if (arg && arg.name == 'sha' && arg.target.getEquip(2)) return true;
                        return false;
                    },
                },
                subSkill: {
                    2: {
                        charlotte:true,
                        trigger: {global: 'phaseJieshuBegin'},
                        forced: true,
                        popup: false,
                        filter: function (event, player) {
                            return player.getExpansions('ymjiejun_2').length>0;
                        },
                        content: function () {
                            'step 0'
                            event.source = game.findPlayer(current => current.hasSkill('ymjiejun'));
                            var dialog = ui.create.dialog(`【劫军】`);
                            dialog.addText(`请选择获得${Math.ceil(player.getExpansions('ymjiejun_2').length / 2)}张 ` + get.translation(player) + ' 的〖劫军〗牌：');
                            dialog.add([player.getExpansions('ymjiejun_2'), 'card']);
                            event.source.chooseButton(dialog, true).set('selectButton', [Math.ceil(player.getExpansions('ymjiejun_2').length / 2), Math.ceil(player.getExpansions('ymjiejun_2').length / 2)]).set('ai', function (button) {
                                return 7 - get.buttonValue(button)
                            });
                            'step 1'
                            // if(!result.bool) return event.finish();
                            event.source.gain(result.links, player, 'giveAuto');
                            for(var i=0;i<result.links.length;i++){
                                result.links[i].gaintag.remove('ymjiejun_2');
                            }
                            if (player.getExpansions('ymjiejun_2') && player.getExpansions('ymjiejun_2').length) {
                                game.log(player, '收回了' + get.cnNumber(player.gain(player.getExpansions('ymjiejun_2')).cards.length) + '张〖劫军〗牌');
                                player.getExpansions('ymjiejun_2').length = 0;
                            }
                            player.removeSkill('ymjiejun_2');
                        },
                        marktext: '军',
                        mark: true,
                        intro:{
                            markcount:"expansion",
                            mark:function(dialog,storage,player){
                                var cards=player.getExpansions('ymjiejun_2');
                                if(player.isUnderControl(true)) dialog.addAuto(cards);
                                else return '共有'+get.cnNumber(cards.length)+'张牌';
                            },
                        },
                    },
                },
            },
            ymkuidi: {
                trigger: {
                    global: "gameStart",
                    source: "damageAfter",
                },
                audio: 'shenxian',
                /*init: function (player) {
                                if (typeof (player.storage.ymkuidi) !== 'number') player.storage.ymkuidi = 0;
                            },*/
                forced: true,
                filter: function (event, player, name) {
                    if (name == 'gameStart') return true;
                    return event.card && event.card.name === 'sha';
                },
                content: function () {
                    if (typeof (player.storage.ymkuidi) !== 'number') player.storage.ymkuidi = 0;
                    player.addMark('ymkuidi', trigger.num || 1);
                },
                //mark: true,
                marktext: '枪',
                intro: {
                    name: '溃敌·枪',
                    content: 'mark',
                },
                group: ['ymkuidi_phaseUse', 'ymkuidi_damage', 'ymkuidi_phase'],
                subSkill: {
                    phaseUse: {
                        audio: 'shenxian',
                        enable: 'phaseUse',
                        forced: true,
                        sub: true,
                        filterTarget: function (card, player, target) {
                            if (target.hasMark('ymkuidi')) return false;
                            return player != target > 0;
                        },
                        filter: function (event, player) {
                            if (event.player.countMark('ymkuidi') <= 0) return false;
                            if (player.countMark('ymkuidi') <= 0) return false;
                            return game.countPlayer(function (current) {
                                if (!current.hasMark('ymkuidi')) return true;
                            });
                        },
                        content: function () {
                            player.removeMark('ymkuidi', 1);
                            target.addMark('ymkuidi', 1);
                        },
                        ai: {
                            order: 11,
                            result: {
                                target: function (player, target) {
                                    if ((player.countMark('ymkuidi') >= 2 || !game.hasPlayer(function (current) {
                                        return current != player && get.attitude(player, current) < 0 && current.hasMark('ymkuidi');
                                    })) && player.countCards('h', function (card) {
                                        return get.tag(card, 'damage') && player.canUse(card, target, null, true) && player.getUseValue(card) > 0 && get.effect_use(target, card, player) > 0 && target.hasSkillTag('filterDamage', null, {
                                            player: player,
                                            card: card,
                                        });
                                    })) return 3 / Math.max(1, target.hp);
                                    if ((!player.hasUnknown() && game.countPlayer(function (current) {
                                        return get.attitude(player, current) < 0;
                                    }) <= 1) || player.countMark('ymkuidi') >= 2) {
                                        return -1;
                                    }
                                    return 0;
                                },
                            },
                            effect: {
                                player: function (card, player, target) {
                                    if (player != target && get.tag(card, 'damage') && target && target.hasMark('ymkuidi') && !target.hasSkillTag('filterDamage', null, {
                                        player: player,
                                        card: card,
                                    })) return [1, 0, 1, -2];
                                },
                            },
                            threaten: 1.6,
                        },
                    },
                    damage: {
                        trigger: {
                            source: 'damageBegin'
                        },
                        filter: function (event, player) {
                            return event.player.countMark('ymkuidi') > 0 && event.player != player;
                        },
                        forced: true,
                        content: function () {
                            trigger.num++;
                        },
                        sub: true,
                    },
                    phase: {
                        trigger: {
                            global: 'phaseBegin'
                        },
                        audio: 'shenxian',
                        forced: true,
                        popup: false,
                        filter: function (event, player) {
                            if (event.player === player) return false;
                            return event.player.countMark('ymkuidi') > 0;
                        },
                        content: function () {
                            'step 0'
                            player.logSkill('ymkuidi', trigger.player);
                            trigger.player.removeMark('ymkuidi', 1);
                            trigger.player.storage.ymkuidi = 0;
                            var controls = ['选项一', '选项二', '选项三'];
                            player.chooseControl(controls).set('prompt', '溃敌<br><br><div class="text">选项一:该角色受到1点随机属性伤害且本回合不能使用基本牌。</div><br><div class="text">选项二:该角色失去1点体力且本回合不能获得牌。</div></br><div class="text">选项三:你选择获得该角色区域内的两张牌。</div></br>')
                                .set('ai', function (event, player) {
                                    if (trigger.player.hp < 2 || player.countCards('h') > 2) return ['选项一', '选项二'].randomGet();
                                    return '选项三';
                                });
                            'step 1'
                            var target = trigger.player;
                            if (result.control === '选项一') {
                                target.damage().nature = lib.linked.randomGet();
                                target.addTempSkill('ymkuidi_sha')
                            } else if (result.control === '选项二') {
                                target.loseHp();
                                target.addTempSkill('ymkuidi_gain');
                            } else if (result.control === '选项三') {
                                player.gainPlayerCard(true, 2, target, 'hej');
                            }
                        },
                        sub: true,
                    },
                    sha: {
                        sub: true,
                        onremove: true,
                        unique: true,
                        charlotte: true,
                        mod: {
                            cardEnabled2: function (card, player) {
                                if (get.type(card) === 'basic') return false;
                                return void 0;
                            },
                        },
                        mark: true,
                        intro: {
                            content: '不能使用基本牌',
                        },
                    },
                    gain: {
                        trigger: {
                            player: 'gainBefore'
                        },
                        sub: true,
                        silent: true,
                        popup: false,
                        forced: true,
                        mark: true,
                        onremove: true,
                        unique: true,
                        charlotte: true,
                        content: function () {
                            trigger.cancel();
                        },
                        intro: {
                            content: '不能获得牌',
                        },
                    },
                },
            },
            ymguhuo: {
                trigger: {
                    global: ['gameStart', 'die', 'roundStart'],
                    player: 'enterGame',
                },
                audio: 'guhuo',
                forced: true,
                fixed: true,
                charlotte: true,
                forceunique: true,
                unique: true,
                init: function (player) {
                    if (!player.storage.ymguhuoxuxing) player.storage.ymguhuoxuxing = [];
                },
                filter:function(event,player,name){
                    if(name=='roundStart') return game.roundNumber%2==1;
                    return true;
                },
                content: function () {
                    'step 0'
                    if (event.triggername != 'die') {
                        var list = [];
                        for (var i in lib.character) list.push(i);
                        var players = game.players.concat(game.dead);
                        for (var i = 0; i < players.length; i++) {
                            if (list.contains(players[i].name)) list.remove(players[i].name);
                            if (list.contains(players[i].name1)) list.remove(players[i].name1);
                            if (list.contains(players[i].name2)) list.remove(players[i].name2);
                        }
                        event.name = list.randomGet();
                    }
                    if (event.triggername == 'die') event.name = trigger.player.name;
                    if (player.storage.subplayer) {
                        event.exit = true;
                        event.limit = player.name.replace('subplayer_', '')
                        player.exitSubPlayer();
                        //event.trigger('subPlayerExit');
                    }
                    'step 1'
                    var info = lib.character[event.name];
                    var tag = player.addSubPlayer({
                        source: player.name,
                        name: event.name,
                        hp: get.infoHp(info[2]),
                        hs: get.cards(4),
                        skills: ['ymguhuo'].concat(info[3]),
                        maxHp: get.infoMaxHp(info[2]),
                        group: info[1],
                        sex: info[0],
                        skill: 'subplayer_' + event.name,
                    });

                    if (info[4] && info[4].some(value => value.indexOf("ext") !== -1)) lib.character[tag] = info;
                    var skills2 = lib.character[event.name][3];
                    player.chooseControl(skills2).set('prompt', '请选择要获得的技能').set('ai', function () {
                        return skills2.randomGet();
                    });
                    'step 2'
                    player.storage.ymguhuoxuxing.add(result.control);
                    if (!player.storage.subplayer) player.addAdditionalSkill('ymguhuo', player.storage.ymguhuoxuxing, true);
                    if (event.exit == true) {
                        var tag = Object.keys(player.storage).filter(value => {
                            return value.indexOf(`subplayer_${event.limit}`) === 0;
                        })[0];
                        if (tag) {
                            player.callSubPlayer(tag);
                            player.removeAdditionalSkill('ymguhuo');
                        }
                    }
                },
                group: ['ymguhuo_phase', 'ymguhuo_back'],
                subSkill: {
                    phase: {
                        trigger: {
                            player: ["phaseBegin", "phaseEnd", "ymguhuo_phaseAfter", "subplayerAfter"],
                        },
                        audio: 'guhuo',
                        filter: function (enent, player, name) {
                            if (name == 'ymguhuo_phaseAfter') player.addSkill('ymguhuo');
                            else return true;
                        },
                        direct:true,
                        content: function () {
                            'step 0'
                            var control = ['切换本体', '替换虚影', 'cancel'];
                            if (!player.hasSkill('subplayer')) control.remove('切换本体');
                            event.subPlayers = [];
                            Object.keys(player.storage).map(value => {
                                if (typeof player.storage[value] === 'object' && player.storage[value].skill && player.storage[value].skill.indexOf('subplayer_') === 0) event.subPlayers.add(player.storage[value].skill.replace('subplayer_', ''));
                            });
                            event.subPlayers = event.subPlayers.filter(function (value) {
                                if (!player.storage.subplayer) return true;
                                return player.storage.subplayer.name2 === value;
                            });
                            if (!event.subPlayers.length) control.remove("替换虚影");
                            //event.subPlayers.remove(player.skill.replace('subplayer_', ''));
                            //if(event.subPlayers.lenhth<2) control.remove('替换虚影');
                            if(control.length>1){
                                player.chooseControl(control).set('prompt', '请选择“切换本体”或“替换虚影”').set('ai', function () {
                                    if (control.contains('替换虚影')) return '替换虚影';
                                    else return 'cancel';
                                });
                            }
                            else event.finish();
                            'step 1'
                            if (result.control == 'cancel') {
                                return event.finish();
                            }
                            player.logSkill(event.name);
                            if (result.control == '切换本体') {
                                player.exitSubPlayer();
                                event.trigger('subPlayerExit');
                            }
                            if (result.control == '替换虚影') {
                                player.exitSubPlayer();
                                event.trigger('subPlayerExit');
                                var dialog = ui.create.dialog('蛊惑：请选择替换的【虚影】');
                                if (event.subPlayers.length) {
                                    dialog.addText('<span style="color:yellow">拥有的【虚影】：</span>');
                                    dialog.add([event.subPlayers, 'character']);
                                    dialog.addText('  ');
                                }
                                player.chooseButton(true, dialog).ai = function (button) {
                                    return get.rank(button.link, true);
                                }
                            }
                            'step 2'
                            if (result.bool) {
                                var tag = Object.keys(player.storage).filter(value => {
                                    return value.indexOf(`subplayer_${result.links[0]}`) === 0;
                                })[0];
                                if (tag) {
                                    player.callSubPlayer(tag);
                                    player.removeAdditionalSkill('ymguhuo');
                                    //result.links[0].replace('subplayer_', '')
                                    //player.node.avatar.setBackgroundImage(result.links[0]);
                                }
                            }
                        },
                    },
                    back: {
                        trigger: {
                            player: ['subPlayerExit', 'subPlayerDie'],
                        },
                        silent: true,
                        popup: false,
                        forced: true,
                        content: function () {
                            player.addAdditionalSkill('ymguhuo', player.storage.ymguhuoxuxing, true);
                        }
                    },
                },
            },
            ymfushu: {
                mark: true,
                init: function (player) {
                    player.markSkill('ymfushu');
                },
                onremove: function (player) {
                    player.markSkill('ymfushu');
                },
                unique: true,
                enable: "phaseUse",
                audio: 'reguhuo',
                filter: function (event, player) {
                    return player.countCards('h') > 0;
                },
                filterTarget: function (card, player, target) {
                    if (target.hasSkill('ymfushu_a')) return false;
                    return target != player;
                },
                filterCard: true,
                position: "h",
                check: function (card) {
                    return 7 - get.value(card);
                },
                content: function () {
                    player.discard(cards);
                    event.num = true;
                    var hs = player.getCards('h');
                    for (var i = 0; i < hs.length; i++) {
                        if (!cards.contains(hs[i])) {
                            event.num = false;
                            break;
                        }
                    }
                    if (event.num == true) target.addTempSkill('ymfushu_a', {player: 'phaseAfter'});
                    else target.addTempSkill('ymfushu_a');
                },
                ai: {
                    order: 10,
                    result: {
                        player: function (player) {
                            if (player.countCards('sha') > 2) return 10;
                            return 0;
                        },
                        target: function (player, target) {
                            if (target.countCards('h') > target.hp) return target.hp - target.countCards('h');
                            return 0;
                        },
                    },
                    threaten: 0.5,
                    effect: {
                        target: function (card) {
                            if (card.name == 'guiyoujie') return [0, 2];
                        },
                    },
                },
                subSkill: {
                    a: {
                        onremove: true,
                        unique: true,
                        charlotte: true,
                        forced: true,
                        mark: true,
                        trigger: {
                            player: "compare",
                            target: "compare",
                        },
                        filter: function (event, player) {
                            if (event.iwhile) return false;
                            return true;
                        },
                        silent: true,
                        content: function () {
                            game.log(player, '拼点牌点数为-∞');
                            if (player == trigger.player) {
                                trigger.num1 = -Infinity;
                            } else {
                                trigger.num2 = -Infinity;
                            }
                        },
                        popup: false,
                        intro: {
                            content: '所有牌视为【空白牌】',
                        },
                        mod: {
                            cardname: function (card, player) {
                                return 'ymfushu_card';
                            },
                            cardnumber: function (card, number) {
                                return 0;
                            },
                            suit: function (card, suit) {
                                return 'none';
                            },
                        },
                    },
                },
                intro: {
                    mark: function (dialog, content, player) {
                        if (player.isUnderControl(true)) {
                            var list = [];
                            var max = Math.max(game.players.length, 4);
                            var num = Math.min(max, ui.cardPile.childElementCount);
                            for (var i = 0; i < num; i++) {
                                list.push(ui.cardPile.childNodes[i]);
                            }
                            dialog.addSmall(list);
                        } else {
                            dialog.addText('牌堆顶的' + num + '张牌');
                        }
                    },
                    content: function (content, player) {
                        if (player.isUnderControl(true)) {
                            var list = [];
                            var max = Math.max(game.players.length, 4);
                            var num = Math.min(max, ui.cardPile.childElementCount);
                            for (var i = 0; i < num; i++) {
                                list.push(ui.cardPile.childNodes[i]);
                            }
                            return get.translation(list);
                        } else {
                            return '牌堆顶的' + num + '张牌';
                        }
                    },
                },
            },
            ymduce: {
                enable: "phaseUse",
                usable: 1,
                audio: 'rejuece',
                filterTarget: function (card, player, target) {
                    if (target.hasSkill('ymduce_du')) return false;
                    return target != player;
                },
                content: function () {
                    'step 0'
                    player.draw();
                    player.chooseCard(1, true, '选择1张牌作为【毒策】', function (card) {
                        return true;
                    }).set('ai', function (card) {
                        return 8 - get.value(card)
                    });
                    'step 1'
                    if (result.cards) {
                        target.addToExpansion(result.cards,player,'giveAuto').gaintag.add('ymduce_du');
                        player.discardPlayerCard(target, 'he', true);
                        target.addTempSkill('ymduce_du', {player: 'die'});
                        game.log(target, '获得了', result.cards, '置于武将牌上作为“毒策”');
                    }
                },
                ai: {
                    order: 10,
                    result: {
                        target: function (player, target) {
                            if (!target.countCards('h')) return -3;
                            return -1;
                        },
                    },
                    threaten: 1.5,
                    effect: {
                        target: function (card) {
                            if (card.name == 'guiyoujie') return [0, 2];
                        },
                    },
                },
                subSkill: {
                    du: {
                        mark: true,
                        unique: true,
                        charlotte: true,
                        intro:{
                            content:"expansion",
                            markcount:"expansion",
                        },
                        onremove:function(player,skill){
                            var cards=player.getExpansions(skill);
                            if(cards.length) player.loseToDiscardpile(cards);
                        },
                        forced: true,
                        popup: false,
                        silent: true,
                        trigger: {
                            player: 'phaseBegin',
                        },
                        content: function () {
                            'step 0'
                            game.countPlayer(function (current) {
                                if (current.hasSkill('ymduce')) event.target = current;
                            });
                            player.chooseCard(1, 'he', '选择1张牌交给' + get.translation(event.target), function (card) {
                                return true;
                            }).set('ai', function (card) {
                                return 4 - get.value(card);
                            });
                            'step 1'
                            if (result.cards && result.bool) {
                                if (event.target && event.target.isIn()) {
                                    event.target.gain(result.cards, player, 'giveAuto');
                                }
                                if (!(get.type(result.cards[0], 'trick') == 'trick' && get.color(result.cards[0]) == 'black')) player.addTempSkill('ymduce_use');
                            } else {
                                player.loseHp();
                                player.addTempSkill('baiban');
                            }
                            'step 2'
                            //player.gain(player.storage.ymduce_du);
                            player.removeSkill('ymduce_du');
                        },
                    },
                    use: {
                        mark: true,
                        unique: true,
                        charlotte: true,
                        intro: {
                            content: '不能使用或打出任何牌',
                        },
                        forced: true,
                        popup: false,
                        silent: true,
                        mod: {
                            cardEnabled: function (card, player) {
                                return false;
                            },
                            cardRespondable: function (card, player) {
                                return false;
                            },
                            cardSavable: function (card, player) {
                                return false;
                            },
                        },
                    },
                },
            },
            ymdushi: {
                trigger: {
                    global: 'phaseEnd',
                },
                audio: 'remieji',
                filter: function (event, player) {
                    var num = 0;
                    game.players.concat(game.dead).map(current => {
                        num += current.getHistory("damage").length;
                    });
                    if (num > 0) {
                        return true;
                    } else return false;
                },
                content: function () {
                    'step 0'
                    player.chooseTarget('弃置场上区域内的一张牌', function (card, player, target) {
                        return target.countCards('hej');
                    }).set('ai', function (target) {
                        var player = _status.event.player;
                        var att = get.attitude(player, target);
                        if (att < 0) {
                            att = -Math.sqrt(-att);
                        } else {
                            att = Math.sqrt(att);
                        }
                        return att * lib.card.guohe.ai.result.target(player, target);
                    });
                    'step 1'
                    if (result.targets) {
                        var target = result.targets[0];
                        player.discardPlayerCard(target, 'hej');
                    } else event.finish();
                    'step 2'
                    if (result.bool) {
                        player.chooseTarget('选择一名其他角色令其受到1点你造成的伤害', lib.filter.notMe, function (target) {
                            var player = get.player();
                            return ai.get.damageEffect(target, player, player);
                        });
                    } else event.finish();
                    'step 3'
                    if (result.targets) {
                        result.targets[0].damage();
                    }
                },
            },
            ymzhuzhuo: {
                trigger: {
                    global: 'damageEnd',
                },
                audio: 'xinfencheng',
                filter: function (event, player) {
                    if (event.source != undefined && event.source.group == player.group) return true;
                    if (event.player.isIn() && event.player.group == player.group) return true;
                    return false;
                },
                content: function () {
                    'step 0'
                    event.num = 0;
                    if (trigger.source != undefined && trigger.source.group == player.group) event.num++;
                    if (trigger.player.isIn() && trigger.player.group == player.group) event.num++;
                    'step 1'
                    player.chooseTarget(get.prompt2(event.name), '令一名角色增加1点体力上限；1.该角色不为你，其摸一张♠️牌，若该角色本回合第一次因此摸牌，则额外摸一张♥️牌，2.该角色为你，你摸两张牌，每回合限一次').set('ai', function (target) {
                        var att = get.attitude(_status.event.player, target);
                        if (att > 2) {
                            if ((target.maxHp - target.hp) < 2) return 2 * att;
                            return att;
                        }
                        return att / 3;
                    });
                    'step 2'
                    if (result.bool) {
                        if (result.targets[0].maxHp < 20) result.targets[0].gainMaxHp();
                        if (result.targets[0] != player) {
                            event.card = [];
                            event.card1 = get.cardPile(function (card) {
                                return get.suit(card) == 'spade';
                            });
                            if (result.targets[0].getHistory('gain', function (evt) {
                                return evt.getParent().name == 'ymzhuzhuo';
                            }).length == 0) {
                                event.card2 = get.cardPile(function (card) {
                                    return get.suit(card) == 'heart';
                                });
                            }
                            if (event.card1) event.card.add(event.card1);
                            if (event.card2) event.card.add(event.card2);
                            if (event.card) {
                                result.targets[0].gain(event.card, 'gain2');
                            }
                        } else {
                            if (player.getHistory('gain', function (evt) {
                                return evt.getParent(2).name == 'ymzhuzhuo';
                            }).length == 0) {
                                player.draw(2);
                            }
                        }
                    }
                    'step 3'
                    event.num--;
                    if (event.num > 0) event.goto(1);
                    else event.finish();
                },
            },
            ymxiance: {
                enable: "phaseUse",
                audio: 'jianshu',
                filterTarget:function (card,player,target){
                    if(target.getExpansions('ymxiance_mark').length>0) return false;
                    return true;
                },
                filter:function(event,player){
                    if(game.countPlayer(function (current) {
                        if(current.getExpansions('ymxiance_mark').length==0) return true;
                    })) return true;
                },
                content: function () {
                    'step 0'
                    event.card = get.cards(3);
                    player.showCards(event.card);
                    'step 1'
                    target.addTempSkill('ymxiance_mark', {player: 'die'});
                    target.addToExpansion(event.card,player,'giveAuto').gaintag.add('ymxiance_mark');
                },
                ai: {
                    order: 10,
                    threaten: 1.5,
                    result: {
                        player:function(player, target) {
                            return ai.get.attitude(player, target);
                        },
                    },
                },
                subSkill: {
                    mark: {
                        trigger: {
                            player: 'phaseBefore',
                        },
                        popup: false,
                        forced: true,
                        silent: true,
                        mark: true,
                        unique: true,
                        charlotte: true,
                        /*onremove:function(player,skill){
                            var cards=player.getExpansions(skill);
                            if(cards.length) player.loseToDiscardpile(cards);
                        },*/
                        intro:{
                            mark:function(dialog,storage,player){
                                var cards=player.getExpansions('ymxiance_mark');
                                if(cards.length) dialog.addAuto(cards);
                                else dialog.addText('没有卡牌');
                                var str='';
                                if(player.hasSkill('ymxiance_basic')) str+='<br><li>基本：从牌堆获得每种【杀】各一张和随机三张不同名的基本牌且本回合基本牌无距离次数限制并可额外指定一个目标';
                                if(player.hasSkill('ymxiance_trick')) str+='<br><li>锦囊：摸牌阶段额外摸两张牌；使用普通锦囊牌摸一张牌且可额外或减少指定至多两个目标';
                                if(player.hasSkill('ymxiance_equip')) str+='<br><li>装备：随机将装备区空白栏置入两张装备且手牌无上限；造成伤害时，此伤害+1';
                                dialog.addText(str);
                            },
                            markcount:"expansion",
                        },
                        content: function () {
                            if (player.getExpansions('ymxiance_mark')) {
                                var card = player.getExpansions('ymxiance_mark');
                                for (var i = 0; i < card.length; i++) {
                                    if (get.type(card[i], 'trick') == 'basic') player.addTempSkill('ymxiance_basic', {player: 'phaseAfter'});
                                    if (get.type(card[i], 'trick') == 'trick') player.addTempSkill('ymxiance_trick', {player: 'phaseAfter'});
                                    if (get.type(card[i], 'trick') == 'equip') player.addTempSkill('ymxiance_equip', {player: 'phaseAfter'});
                                }
                                player.gain(card,player,'give');
                                player.removeSkill('ymxiance_mark');
                            }
                        },
                    },
                    basic: {
                        trigger: {
                            player: 'phaseBefore',
                        },
                        forced: true,
                        silent: true,
                        popup: false,
                        unique: true,
                        charlotte: true,
                        onremove:function(player,skill){
                            if(player.getExpansions('ymxiance_mark').length==0) player.unmarkSkill('ymxiance_mark');
                        },
                        content: function () {
                            var basic=[],cards=[],sha=[];
                            for(var i=0;i<lib.inpile.length;i++){
                                if(get.type(lib.inpile[i],'trick')=='basic'){
                                    basic.push([lib.inpile[i],undefined]);
                                    if(lib.card[lib.inpile[i]].nature){
                                        for(var j of lib.inpile_nature) basic.push([lib.inpile[i],j]);
                                    }
                                }
                            }
                            while(basic.length>0){
                                var card=get.cardPile(function (card) {
                                    if(card&&!sha.contains(card)&&!cards.contains(card)&&card.name){
                                        if(lib.card[card.name].nature) return card.name==basic[0][0]&&card.nature==basic[0][1];
                                        else return card.name==basic[0][0];
                                    }
                                });
                                if(card.name=='sha') sha.push(card);
                                else cards.push(card);
                                basic.splice(0,1);
                            }
                            event.card=sha.concat(cards.randomGets(3));
                            player.gain(event.card, 'gain2');
                        },
                        mod: {
                            targetInRange: function (card, player, target, now) {
                                if (get.type(card)=='basic') return true;
                            },
                            selectTarget: function (card, player, range) {
                                if (get.type(card)=='basic' && range[1] != -1) range[1] += 1;
                            },
                            cardUsable: function (card, player, num) {
                                if (get.type(card)=='basic') return Infinity;
                            },
                        },
                    },
                    trick: {
                        trigger: {
                            player: ['phaseDrawBegin', 'useCard'],
                        },
                        popup: false,
                        silent: true,
                        forced: true,
                        filter: function (event, player, name) {
                            if (name == 'phaseDrawBegin') return !event.numFixed;
                            else return get.type(event.card) == 'trick';
                        },
                        unique: true,
                        charlotte: true,
                        onremove:function(player,skill){
                            if(player.getExpansions('ymxiance_mark').length==0) player.unmarkSkill('ymxiance_mark');
                        },
                        content: function () {
                            'step 0'
                            if (event.triggername == 'phaseDrawBegin') {
                                trigger.num += 2;
                                return event.finish();
                            }
                            player.draw();
                            var goon;
                            if (trigger.targets && trigger.targets.length > 0){
                                var info = get.info(trigger.card);
                                if (info.allowMultiple == false) goon=false;
                                if (trigger.targets && !info.multitarget) {
                                    if (game.hasPlayer(function(current) {
                                        return lib.filter.targetEnabled2(trigger.card, player, current);
                                    })) {
                                        goon=true;
                                    }
                                }
                            }
                            if (goon==true) {
                                event.choose=true;
                                var prompt2 = '为' + get.translation(trigger.card) + '增加或减少至多两个目标';
                                player.chooseTarget([1,2], function(card, player, target) {
                                    var player = _status.event.player;
                                    if (_status.event.targets.contains(target)) return true;
                                    return lib.filter.targetEnabled2(_status.event.card, player, target);
                                }).set('prompt2', prompt2).set('ai', function(target) {
                                    var trigger = _status.event.getTrigger();
                                    var player = _status.event.player;
                                    return get.effect(target, trigger.card, player, player) * (_status.event.targets.contains(target) ? -10 : 10);
                                }).set('targets', trigger.targets).set('card', trigger.card).set('targetprompt', function (target) {
                                    if(trigger.targets.contains(target)) return '减少目标';
                                    else return '增加目标';
                                });
                            }
                            else event.finish();
                            'step 1'
                            if(event.choose&&result.bool){
                                if (!event.isMine() && !event.isOnline()) game.delayx();
                                event.targets = result.targets;
                            }
                            else event.finish();
                            'step 2'
                            if (event.targets) {
                                player.line(event.targets);
                                for(var i=0;i<event.targets.length;i++){
                                    if (trigger.targets.contains(event.targets[i])) trigger.targets.remove(event.targets[i]);
                                    else trigger.targets.add(event.targets[i]);
                                }
                            }
                            else event.finish();
                        },
                    },
                    equip: {
                        trigger: {
                            player: 'phaseBefore',
                            source: 'damageBegin',
                        },
                        unique: true,
                        charlotte: true,
                        forced: true,
                        silent: true,
                        popup: false,
                        onremove:function(player,skill){
                            if(player.getExpansions('ymxiance_mark').length==0) player.unmarkSkill('ymxiance_mark');
                        },
                        content: function () {
                            if(event.triggername=='damageBegin'){
                                trigger.num++;
                                return event.finish();
                            }
                            var equip=[];
                            for(var i=0;i<2;i++){
                                var card = get.cardPile(function (card) {
                                    return get.type(card) == 'equip'&&player.isEmpty(get.subtype(card))&&!equip.contains(get.subtype(card)) && !get.cardtag(card, 'gifts');
                                });
                                if (card){
                                    equip.push(get.subtype(card));
                                    player.equip(card, true);
                                }
                            }
                            player.recover();
                        },
                        mod: {
                            maxHandcard: function (player, num) {
                                return num + Infinity;
                            },
                        },
                    },
                },
            },
            ymzhukou: {
                mark: true,
                locked: true,
                zhuanhuanji: true,
                marktext: "逐寇",
                intro: {
                    content: function (storage, player, skill) {
                        var str='';
                        if (player.storage.ymzhukou == true) str+= '<span class="legendtext">当你使用或成为红色牌的目标时，你可指定任意名没有“献策”的角色各弃两张牌，你摸一张牌</span>';
                        else str+= '<span class="bluetext">当你使用或成为黑色牌的目标时，你可指定任意名拥有“献策”的角色各摸两张牌，你摸一张牌</span>';
                        var num = game.players.length;
                        num-=player.getHistory('custom', function (evt) {
                            return evt.ymzhukou == 'count';
                        }).length;
                        if(num<0) num=0;
                        str+='<br><li>当前回合剩余触发次数：'+num;
                        return str;
                    },
                },
                audio: 'wansha',
                trigger: {
                    player: "useCardToTargeted",
                    target: "useCardToTargeted",
                },
                filter: function (event, player) {
                    var num = game.players.length;
                    if(player.getHistory('custom', function (evt) {
                        return evt.ymzhukou == 'count';
                    }).length >= num) return false;
                    if (player.storage.ymzhukou == true) return get.color(event.card) == 'red';
                    return get.color(event.card) == 'black';
                },
                content: function () {
                    'step 0'
                    player.getHistory('custom').push({ymzhukou: 'count'});
                    if (player.storage.ymzhukou == true) {
                        event.goto(3);
                    }
                    'step 1'
                    game.countPlayer(function (current) {
                        if (current.getExpansions('ymxiance_mark').length>0) event.log = true;
                    });
                    if (event.log) {
                        player.chooseTarget(true,[1,Infinity], get.prompt2(event.name), '选择任意名拥有“献策”的角色令其摸两张牌，你摸一张牌', function (card, player, target) {
                            return target.getExpansions('ymxiance_mark').length>0;
                        }).set('ai', function (target) {
                            return get.attitude(_status.event.player, target);
                        });
                    }
                    if (!event.log) {
                        player.draw();
                        player.storage.ymzhukou = true;
                        event.finish();
                    }
                    'step 2'
                    if (result.bool) {
                        player.draw();
                        if(result.targets){
                            for(var i=0;i<result.targets.length;i++) result.targets[i].draw(2);
                        }
                        player.storage.ymzhukou = true;
                        event.finish();
                    } else event.finish();
                    'step 3'
                    game.countPlayer(function (current) {
                        if (current.getExpansions('ymxiance_mark').length==0 && current.countCards('he')) event.log = true;
                    });
                    if (event.log) {
                        player.chooseTarget(true,[1,Infinity], get.prompt2(event.name), '选择任意名没有“献策”的角色令其弃置两张牌，你摸一张牌', function (card, player, target) {
                            return target.getExpansions('ymxiance_mark').length==0 && target.countCards('he');
                        }).set('ai', function (target) {
                            return -get.attitude(_status.event.player, target);
                        });
                    }
                    if (!event.log) {
                        player.draw();
                        player.storage.ymzhukou = false;
                        event.finish();
                    }
                    'step 4'
                    if (result.bool) {
                        player.draw();
                        if(result.targets){
                            for(var i=0;i<result.targets.length;i++) result.targets[i].chooseToDiscard(true,2, 'he');
                        }
                        player.storage.ymzhukou = false;
                        event.finish();
                    } else event.finish();
                },
                ai: {
                    threaten: 1.05,
                },
                group:'ymzhukou_dying',
                subSkill:{
                    dying:{
                        trigger:{
                            global:'recoverBegin',
                        },
                        audio: 'wansha',
                        filter:function(event,player){
                            return event.player!=player&&event.player.isDying()&&event.player.getExpansions('ymxiance_mark').length==0;
                        },
                        forced:true,
                        content:function(){
                            if(trigger.num>1) trigger.num=1;
                            else trigger.num--;
                        },
                    },
                },
            },
            ymlinglong: {
                trigger: {
                    player: ["phaseBegin"],
                },
                filter: function (event, player) {
                    return player.countCards("he") > 0;
                },
                derivation: "rejizhi",
                direct:true,
                audio: 'linglong',
                content: function () {
                    'step 0'
                    player.chooseToDiscard('he', [1,3], get.prompt2('ymlinglong')).set('ai', function (card) {
                        if(ui.selected.cards){
                            for(var i=0;i<ui.selected.cards.length;i++){
                                if(get.type(ui.selected.cards[i],'trick')==get.type(card,'trick')) return 6 - get.value(card);
                            }
                        }
                        if(get.type(card)=='equip') return 10 - get.value(card);
                        else if(get.type(card,'trick')=='trick') return 9 - get.value(card);
                        return 8 - get.value(card);
                    });
                    'step 1'
                    if (result.bool) {
                        player.logSkill(event.name);
                        var basic,trick,equip,num=result.cards.length,cards=[];
                        for(var i=0;i<result.cards.length;i++){
                            if(get.type(result.cards[i],'trick')=='basic') basic=true;
                            else if(get.type(result.cards[i],'trick')=='trick') trick=true;
                            else if(get.type(result.cards[i],'trick')=='equip') equip=true;
                        }
                        if(basic) player.draw();
                        if(trick) player.recover();
                        if(equip) player.addTempSkill('rejizhi');
                        var list = [];
                        for (var i in lib.card) {
                            if (!lib.translate[i + '_info']) continue;
                            if (lib.card[i].mode && lib.card[i].mode.contains(lib.config.mode) == false) continue;
                            if (lib.config.hiddenCardPack.indexOf(i) == 0) continue;
                            if (i.indexOf('feichu_equip')!=-1) continue;
                            if (lib.card[i].destroy) continue;
                            var info = lib.card[i];
                            if (info.type && info.type == 'equip') list.add(i);
                        }
                        for(var s=0;s<num;s++){
                            cards.push(game.createCard(list.randomRemove()));
                        }
                        player.gain(cards);
                    }
                },
            },
            ymjiqiao: {
                enable: "phaseUse",
                audio: 'jiqiao',
                usable: 2,
                filterCard:function(card,player){
                    var cards=player.getCards('he',function(card){
                        return get.type(card)=='equip';
                    });
                    if(cards.length<=1) return !cards.contains(card);
                    return true;
                },
                discard: true,
                selectCard: [1, 1],
                position: 'he',
                check: function (card) {
                    var num=8;
                    if(get.type(card)=='equip') num=4;
                    return num - get.value(card);
                },
                filter:function(event,player){
                    if (player.getCards('e').length > 0){
                        var cards=player.getCards('e');
                        var list=[],ban=0;
                        for (var i in lib.card) {
                            if (get.type(i) == 'jiqi') list.push(i);
                            else if (get.type(i) == 'hslingjian') list.push(i.slice(11));
                        }
                        for(var i=0;i<cards.length;i++){
                            for(var j=0;j<list.length;j++){
                                var name=get.name(cards[i]);
                                if(name.indexOf(list[j])!=-1){
                                    ban++;
                                    break;
                                }
                            }
                        }
                        if(ban<cards.length) return true;
                    }
                    for (var i = 0; i < player.getCards('he').length; i++) {
                        if (get.type(player.getCards('he')[i]) == 'equip') return true;
                    }
                    return false;
                },
                content: function () {
                    'step 0'
                    var list = [];
                    if (player.getCards('e').length > 0){
                        var cards=player.getCards('e');
                        var list2=[],ban=0;
                        for (var i in lib.card) {
                            if (get.type(i) == 'jiqi') list2.push(i);
                            else if (get.type(i) == 'hslingjian') list2.push(i.slice(11));
                        }
                        for(var i=0;i<cards.length;i++){
                            for(var j=0;j<list2.length;j++){
                                var name=get.name(cards[i]);
                                if(name.indexOf(list2[j])!=-1){
                                    ban++;
                                    break;
                                }
                            }
                        }
                        if(ban<cards.length) list.add('选项一');
                    }
                    for (var i = 0; i < player.getCards('he').length; i++) {
                        if (get.type(player.getCards('he')[i]) == 'equip') list.add('选项二');
                    }
                    //list.push('cancel2');
                    if(list.length>0){
                        player.chooseControl(list, function () {
                            if (list.length > 1){
                                var goon,emp,type=[];
                                var card=player.getCards('hes',function(card){
                                    var i=get.name(card);
                                    return get.type(card)=='equip'&&!(lib.card[i]&&lib.card[i].ai&&lib.card[i].ai.result&&lib.card[i].ai.result.keepAI);
                                });
                                for(var i=0;i<card.length;i++){
                                    type.push(get.subtype(card[i]));
                                }
                                for(var i=0;i<card.length;i++){
                                    var ty=type.slice(0);
                                    ty.remove(get.subtype(card[i]));
                                    if(ty.contains(get.subtype(card[i]))) goon=true;
                                }
                                for(var i=1;i<=5;i++){
                                    if(player.isEmpty(i)&&player.getCards('hs',function(card){
                                        return get.type(card)=='equip'&&!(lib.card[i]&&lib.card[i].ai&&lib.card[i].ai.result&&lib.card[i].ai.result.keepAI)&&get.subtype(card)==('equip'+i);
                                    }).length==0) emp=true;
                                }
                                if(emp&&goon) return '选项二';
                                return '选项一';
                            }
                            return list[0];
                        }).set('prompt', get.prompt(event.name)).set('choiceList', ['煅造装备区内一张未被煅造的牌', '改造一张装备牌的装备类型']);
                    }
                    else event.finish();
                    'step 1'
                    event.control = result.control;
                    if (event.control == '选项二') {
                        var cards=player.getCards('he',function(card){
                            return get.type(card)=='equip';
                        });
                        if(cards.length>0){
                            player.choosePlayerCard(player,'he',true, '选择一张装备牌进行改造').set('filterButton',function(button){
                                var type=get.type(button.link);
                                return type=='equip';
                            }).set('ai',button=>{
                                var type=[],name=get.name(button.link);
                                var card=player.getCards('hes',function(card){
                                    if (!(lib.card[i]&&lib.card[i].ai&&lib.card[i].ai.result&&lib.card[i].ai.result.keepAI)) return get.type(card)=='equip';
                                });
                                for(var i=0;i<card.length;i++){
                                    type.push(get.subtype(card[i]));
                                }
                                for(var i=0;i<type.length;i++){
                                    var ty=type.slice(0);
                                    ty.remove(get.subtype(button.link));
                                    if(!(lib.card[name]&&lib.card[name].ai&&lib.card[name].ai.result&&lib.card[name].ai.result.keepAI)&&ty.contains(get.subtype(button.link))) return 2*get.value(button.link)+1;
                                }
                                return 1-1/get.value(button.link);
                            });
                        }
                        else event.finish();
                    }
                    else if (event.control == '选项一') {
                        event.goto(5);
                    }
                    //else if (event.control == 'cancel2') {
                    //    event.finish();
                    //}
                    else event.finish();
                    'step 2'
                    if (result.cards) {
                        var list = ['equip1', 'equip2', 'equip3', 'equip4', 'equip5'],type=[];
                        var card=player.getCards('hes',function(card){
                            var i=get.name(card);
                            return get.type(card)=='equip'&&!(lib.card[i]&&lib.card[i].ai&&lib.card[i].ai.result&&lib.card[i].ai.result.keepAI);
                        });
                        for(var i=0;i<card.length;i++){
                            type.push(get.subtype(card[i]));
                        }
                        list.remove(get.subtype(result.cards[0]));
                        var control=list.slice(0),choose=list.randomGet();
                        for(var i=0;i<card.length;i++){
                            if(type.contains(get.subtype(card[i]))) list.remove(get.subtype(card[i]));
                        }
                        for (var i = 0; i < list.length; i++) {
                            if (player.getEquip(list[i])) list.splice(i--,1);
                        }
                        if(list.length>0) choose=list.randomGet();
                        event.card = result.cards[0];
                        player.chooseControl(control, function () {
                            if (choose) return choose;
                        }).prompt = '机巧：请选择改变' + get.translation(event.card.name) + '的装备类型。';
                    }
                    'step 3'
                    if (result.control && result.control != 'cancel2') {
                        player.popup(result.control);
                        game.log(player,'将',event.card,'的装备类型改为了','#g'+result.control);
                        //原始牌名
                        var source=!lib.card[event.card.name].source&&lib.card[event.card.name].sourcename?lib.card[event.card.name].sourcename:event.card.name;
                        source=source.slice(-16,-6)=='_jqgaizao_'?source.slice(0,-16):source;
                        var name = source + '_jqgaizao_' + result.control;
                        event.card.classList.remove(get.subtype(event.card));
                        lib.card[name] = get.copy(get.info(event.card));
                        lib.card[name].subtype = result.control;
                        if(!lib.card[name].legend) lib.card[name].epic = true;
                        //图片
                        if(lib.card[source].cardimage) lib.card[name].cardimage=lib.card[source].cardimage;
                        else if(lib.card[name].sourcename) lib.card[name].cardimage=lib.card[name].sourcename;
                        else if(lib.card[name].source) lib.card[name].cardimage=Array.isArray(lib.card[name].source)?lib.card[name].source[0]:lib.card[name].source;
                        else lib.card[name].cardimage=source;
                        lib.card[name].sourcename = source;
                        lib.translate[name] = lib.translate[source];
                        lib.translate[name + '_info'] = lib.translate[source + '_info'];
                        event.card.init([event.card.suit, event.card.number, name, event.card.nature]);
                        event.card._onuse = true;
                        if (player.getCards('e').contains(event.card)) {
                            if(lib.card[name].onLose||lib.card[name].onEquip){
                                event.equip={onLose:lib.card[name].onLose,onEquip:lib.card[name].onEquip}
                                if(lib.card[name].onLose) lib.card[name].onLose=[];
                                if(lib.card[name].onEquip) lib.card[name].onEquip=[];
                            }
                            //player.lose(event.card)._triggered=null;
                            player.equip(event.card);
                        } else player.showCards(event.card)._triggered = null;
                        event.sourcex=source;
                        event.namex=name;
                    } else event.finish();
                    'step 4'
                    if(event.equip){
                        if(event.equip.onLose) lib.card[event.namex].onLose=event.equip.onLose;
                        if(event.equip.onEquip) lib.card[event.namex].onEquip=event.equip.onEquip;
                    }
                    var onLose = [function () {
                        if(!card._onuse) card.init([card.suit, card.number, lib.card[card.name].sourcename, card.nature]);
                        //delete lib.card[card.name];
                    }];
                    lib.card[event.namex].onLose=onLose;
                    if(lib.card[event.sourcex].onLose){
                        if (Array.isArray(lib.card[event.sourcex].onLose)) {
                            lib.card[event.namex].onLose = lib.card[event.namex].onLose.concat(lib.card[event.sourcex].onLose);
                        } else {
                            lib.card[event.namex].onLose.push(lib.card[event.sourcex].onLose);
                        }
                    }
                    if(event.card) delete event.card._onuse;
                    event.finish();
                    'step 5'
                    var cards=player.getCards('e',function(card){
                        var name=get.name(card);
                        var list=[];
                        for (var i in lib.card) {
                            if (get.type(i) == 'jiqi') list.push(i);
                            else if (get.type(i) == 'hslingjian') list.push(i.slice(11));
                        }
                        for(var j=0;j<list.length;j++){
                            if(name.indexOf(list[j])==-1) return true;
                        }
                    });
                    if(cards.length>0){
                        player.choosePlayerCard(player,'e',true, '机巧：选择一张装备区内未被煅造的装备牌进行煅造。').set('filterButton',function(button){
                            var name=get.name(button.link);
                            var list=[];
                            for (var i in lib.card) {
                                if (get.type(i) == 'jiqi') list.push(i);
                                else if (get.type(i) == 'hslingjian') list.push(i.slice(11));
                            }
                            for(var i=0;i<list.length;i++){
                                if(name.indexOf(list[i])!=-1) return false;
                            }
                            //if (!_status.ymjiqiao.contains(get.name(button.link))) return false;
                            //if (button.link.ymjiqiao == true) return false;
                            //if(!lib.card[get.name(button.link)].unique&&lib.card[get.name(button.link)].nopower) return false;
                            //if(lib.card[get.name(button.link)].nopower) return false;
                            return true;
                        }).set('ai',button=>{
                            return get.value(button.link);
                        });
                    }
                    else event.finish();
                    'step 6'
                    if (result.cards) {
                        event.card1 = result.cards[0];
                        var list = [];
                        for (var i in lib.card) {
                            if (get.type(i) == 'jiqi') list.push(['祭器', '', i]);
                            if (get.type(i) == 'hslingjian') list.push(['零件', '', i]);
                        }
                        var dialog = ui.create.dialog('机巧', [list, 'vcard']);
                        player.chooseButton(dialog,true).ai = function (button) {
                            var skills=[],num=-1;
                            var cards=player.getCards('e');
                            for(var i=0;i<cards.length;i++){
                                if(lib.card[cards[i].name].skills) skills=skills.concat(lib.card[cards[i].name].skills);
                            }
                            var name = button.link[2];
                            var jud=name;
                            if(name.indexOf('yuchan')==0) jud=jud.slice(0,6);
                            for(var i=0;i<skills.length;i++){
                                if(skills[i].indexOf(jud)==-1){
                                    num++;
                                }
                            }
                            switch (name) {
                                case 'qinglongzhigui':
                                    num+=0.9;
                                    break;
                                case 'baishouzhihu':
                                    num+=0.8;
                                    break;
                                /*case 'xuanwuzhihuang':
                                    num+=0.5;
                                    break;
                                case 'zhuquezhizhang':
                                    num+=0.5;
                                    break;
                                case 'huanglinzhicong':
                                    num+=0.5;
                                    break;
                                case 'cangchizhibi':
                                    num+=0.3;
                                    break;*/
                            }
                            return num+Math.random()/2;
                        }
                    } else event.finish();
                    'step 7'
                    if (result.bool) {
                        var card = game.createCard(result.links[0][2]);
                        card._destroy = true;
                        event.card2 = card;
                    } else event.finish();
                    'step 8'
                    event.card = [];
                    event.card.push(event.card1);
                    event.card.push(event.card2);
                    'step 9'
                    var name = lib.skill.lingjianduanzao.process(event.card);
                    if(lib.card[name].legend) delete lib.card[name].epic;
                    player.popup(event.card2.name);
                    game.log(player,'选择了','#g'+event.card2.name,'对',event.card1,'进行了煅造');
                    event.card1.init([event.card1.suit,event.card1.number,name,event.card1.nature]);
                    event.namex1=event.card1.name;
                    if(lib.card[event.namex1].onLose||lib.card[event.namex1].onEquip){
                        event.equip={onLose:lib.card[event.namex1].onLose,onEquip:lib.card[event.namex1].onEquip}
                        if(lib.card[event.namex1].onLose) lib.card[event.namex1].onLose=[];
                        if(lib.card[event.namex1].onEquip) lib.card[event.namex1].onEquip=[];
                    }
                    event.card1._onuse=true;
                    player.equip(event.card1);
                    event.namex=name;
                    'step 10'
                    if(event.equip){
                        if(event.equip.onLose) lib.card[event.namex1].onLose=event.equip.onLose;
                        if(event.equip.onEquip) lib.card[event.namex1].onEquip=event.equip.onEquip;
                    }
                    onLose=[function(){
                        if(!card._onuse) card.init([card.suit, card.number, lib.card[card.name].source[0], card.nature]);
                        //delete lib.card[card.name];
                    }];
                    if(!lib.card[event.namex].onLose) lib.card[event.namex].onLose=[];
                    if (Array.isArray(lib.card[event.namex].onLose)) {
                        lib.card[event.namex].onLose = onLose.concat(lib.card[event.namex].onLose);
                    } else {
                        onLose.push(lib.card[event.namex].onLose);
                        lib.card[event.namex].onLose=onLose;
                    }
                    delete event.card1._onuse;
                },
                ai: {
                    order: 12,
                    result:{
                        player:function(player){
                            var goon,emp,pow,type=[];
                            var card=player.getCards('hes',function(card){
                                var i=get.name(card);
                                return get.type(card)=='equip'&&!(lib.card[i]&&lib.card[i].ai&&lib.card[i].ai.result&&lib.card[i].ai.result.keepAI);
                            });
                            for(var i=0;i<card.length;i++){
                                type.push(get.subtype(card[i]));
                            }
                            for(var i=0;i<card.length;i++){
                                var ty=type.slice(0);
                                ty.remove(get.subtype(card[i]));
                                if(ty.contains(get.subtype(card[i]))) goon=true;
                            }
                            for(var i=1;i<=5;i++){
                                if(player.isEmpty(i)&&player.getCards('hs',function(card){
                                    return get.type(card)=='equip'&&!(lib.card[i]&&lib.card[i].ai&&lib.card[i].ai.result&&lib.card[i].ai.result.keepAI)&&get.subtype(card)==('equip'+i);
                                }).length==0) emp=true;
                            }
                            var cards=player.getCards('e');
                            var list=[],ban=0;
                            for (var i in lib.card) {
                                if (get.type(i) == 'jiqi') list.push(i);
                                else if (get.type(i) == 'hslingjian') list.push(i.slice(11));
                            }
                            for(var i=0;i<cards.length;i++){
                                for(var j=0;j<list.length;j++){
                                    var name=get.name(cards[i]);
                                    if(name.indexOf(list[j])!=-1){
                                        ban++;
                                        break;
                                    }
                                }
                            }
                            if(ban<cards.length) pow=true;
                            if(pow||(goon&&emp)) return 4;
                            return false;
                        },
                    },
                },
            },
            ymqicai: {
                trigger: {
                    player: 'loseAfter',
                },
                audio: 'rejizhi',
                forced: true,
                filter: function (event, player) {
                    if (event.type != 'discard') return false;
                    for (var i = 0; i < event.cards.length; i++) {
                        if (get.position(event.cards[i]) == 'd') {
                            return true;
                        }
                    }
                    return false;
                },
                content: function () {
                    'step 0'
                    event.num=[];
                    event.cards=[];
                    for (var i = 0; i < trigger.cards.length; i++) {
                        if (get.position(trigger.cards[i]) == 'd') event.num.push(i+1);
                    }
                    event.num=event.num.randomGet();
                    'step 1'
                    var card = get.cardPile(function (card) {
                        return get.type(card) == 'trick'&&!event.cards.contains(card);
                    });
                    if (card) event.cards.add(card);
                    event.num--;
                    if(event.num>0) event.redo();
                    'step 2'
                    player.gain(event.cards, 'gain2');
                },
                mod:{
                    targetInRange:function(card,player,target,now){
                        if(get.type(card,'trick')=='trick') return true;
                    },
                    selectTarget:function(card,player,range){
                        var info=get.info(card);
                        if(get.type(card)=='trick'&&!info.multitarget&&!info.notarget&&!info.toself){
                            range[0]=1;
                            range[1]=game.players.length;
                        }
                    },
                },
            },
            ymtaoluan:{
                trigger: {
                    global: ['phaseUseBegin','phaseEnd'],
                },
                usable:1,
                audio: 'taoluan',
                filter: function (event, player) {
                    if (event.player == player || event.player.countCards('h')==0 ) return false;
                    return true;
                },
                check: function (event, player) {
                    if (get.attitude(event.player, player) > 0 && event.player.countCards('h')<(player.maxHp-player.hp)) return true;
                    if (get.attitude(event.player, player) <= 0) return true;
                    return false;
                },
                content:function(){
                    'step 0'
                    event.cards=trigger.player.getCards('h');
                    player.gain(event.cards,trigger.player,'giveAuto');
                    event.basic=0;event.trick=0;event.equip=0;event.use=[];
                    for(var i=0;i<event.cards.length;i++){
                        if(get.type(event.cards[i])=='basic') event.basic++;
                        if(get.type(event.cards[i])=='trick') event.trick++;
                    }
                    'step 1'
                    if(event.basic>0||event.trick>0){
                        var list=[];
                        for(var i=0;i<lib.inpile.length;i++){
                            var name=lib.inpile[i];
                            if(!game.hasPlayer(function(current){
                                return player.canUse(name,current);
                            })) continue;
                            if(name=='sha'){
                                list.push(['基本','','sha',undefined]);
                                for(var j of lib.inpile_nature) list.push(['基本','','sha',j]);
                            }
                            else if(get.type(name)=='trick') list.push(['锦囊','',name,undefined]);
                            else if(get.type(name)=='basic') list.push(['基本','',name,undefined]);
                        }
                        if(list.length>0){
                            var dialog=ui.create.dialog('滔乱');
                            dialog.addText('请选择'+get.cnNumber(event.basic)+'张基本牌或'+get.cnNumber(event.trick)+'张锦囊牌使用');
                            dialog.add([list,'vcard']);
                            var next=player.chooseButton(dialog);
                            next.set('filterButton',function(button){
                                if(event.basic<=0&&get.type(button.link[2])=='basic') return false;
                                if(event.trick<=0&&get.type(button.link[2])=='trick') return false;
                                var n2=button.link.toString();
                                for(var i=0;i<event.use.length;i++){
                                    var n1=event.use[i].toString();
                                    if(n1==n2) return false;
                                }
                                return true;
                            });
                            next.set('ai',function(button){
                                var player=_status.event.player;
                                if(player.countCards('h',button.link[2])>0) return 0;
                                if(['wugu','zhulu_card'].contains(button.link[2])) return 0;
                                var effect=player.getUseValue(button.link[2]);
                                if(effect>0) return effect;
                                return 0;
                            });
                        }
                    }
                    'step 2'
                    if(result.bool){
                        player.chooseUseTarget(true,{name:result.links[0][2],nature:result.links[0][3]},false,'nodistance');
                        event.use.push([result.links[0]]);
                        if(get.type(result.links[0][2])=='basic') event.basic--;
                        if(get.type(result.links[0][2])=='trick') event.trick--;
                        if(event.basic>0||event.trick>0) event.goto(1);
                    }
                    else event.goto(3);
                    'step 3'
                    var num=Math.max((player.maxHp-player.hp),event.cards.length);
                    if(num>5) num=5;
                    if(num>0&&trigger.player.isAlive()){
                        player.chooseCard(num, 'he', true, '滔乱：选择'+get.cnNumber(num)+'张牌交给'+get.translation(trigger.player), function (card) {
                            return true;
                        }).set('ai', function (card) {
                            var player=_status.event.player;
                            if(get.attitude(player,target)>0){
                                if(get.type(card)=='equip') return 0;
                                else return 8 - get.value(card);
                            }
                            else return 3 - get.value(card);
                        });
                    }
                    'step 4'
                    if(result.bool&&result.cards&&result.cards.length){
                        trigger.player.gain(result.cards,player,'giveAuto');
                        for(var i=0;i<result.cards.length;i++){
                            if(get.type(result.cards[i])=='equip') event.equip++;
                        }
                    }
                    else event.finish();
                    'step 5'
                    if(event.equip>0){
                        trigger.player.useCard({name:'sha'},player,false);
                        event.equip--;
                        if(event.equip>0) event.redo();
                        else event.finish();
                    }
                    else event.finish();
                },
            },
            ymhuoluan:{
                trigger:{
                    target:"useCardToTarget",
                },
                audio: 'yangzhong',
                forced:true,
                filter:function(event,player){
                    if(event.card.name!='sha') return false;
                    return game.hasPlayer(function(current){
                        return current!=player&&!event.targets.contains(current)//&&lib.filter.targetEnabled(event.card,event.player,current);
                    });
                },
                content:function(){
                    'step 0'
                    player.draw(2);
                    trigger.player.addTempSkill('baiban');
                    var players=[];
                    game.countPlayer(function(current){
                        if(current!=player&&!trigger.targets.contains(current)/*&&lib.filter.targetEnabled(trigger.card,trigger.player,current)*/) players.add(current);
                    });
                    if(players.length){
                        player.chooseTarget([1,player.hp],get.prompt2('ymhuoluan'),function(card,player,target){
                            return target!=player&&!trigger.targets.contains(target)//&&lib.filter.targetEnabled(trigger.card,trigger.player,target)
                        }).set('ai',function(target){
                            var trigger=_status.event.getTrigger();
                            var player=_status.event.player;
                            return get.effect(target,trigger.card,trigger.player,player)+0.1;
                        }).set('targets',trigger.targets).set('playerx',trigger.player);
                    }
                    else event.finish();
                    'step 1'
                    if(result.targets){
                        trigger.getParent().targets.addArray(result.targets);
                        trigger.getParent().triggeredTargets2.addArray(result.targets);
                        trigger.directHit.addArray(result.targets);
                        player.line(result.targets);
                        game.log(result.targets,'成为了',trigger.card,'的额外目标');
                    }
                    else event.finish();
                },
            },
            ymjiang: {
                shaRelated: true,
                audio: 'jiang',
                trigger: {
                    player: "useCardToPlayered",
                    target: "useCardToTargeted",
                },
                filter: function (event, player) {
                    if (get.color(event.card) != 'red') return false;
                    return player == event.target || event.getParent().triggeredTargets3.length == 1;
                },
                frequent: true,
                content: function () {
                    player.draw();
                },
                ai: {
                    effect: {
                        target: function (card, player, target) {
                            if (get.color(card) == 'red') return [1, 0.6];
                        },
                        player: function (card, player, target) {
                            if (get.color(card) == 'red') return [1, 1];
                        },
                    },
                },
            },
            ymhunyou: {
                audio: 'hunzi',
                derivation: 'yinghun',
                trigger: {
                    source: 'damageEnd',
                    player: ['damageEnd', 'dieBegin'],
                },
                forceDie: true,
                usable: 1,
                content: function () {
                    player.useSkill('yinghun');
                },
            },
            ymtaoni: {
                trigger: {
                    global: 'die',
                },
                audio: 'olhunzi',
                derivation: ['yinghun', 'reyingzi'],
                forceDie: true,
                mark: true,
                locked: true,
                filter: function (event, player) {
                    if (player.storage.ymtaoni >= 3) return false;
                    return true;
                },
                content: function () {
                    'step 0'
                    if (!player.storage.ymtaoni) player.storage.ymtaoni = 0;
                    player.storage.ymtaoni++;
                    player.addSkill('reyingzi');
                    player.gainMaxHp();
                    event.num = 2;
                    var list = ['发动英魂', '移动两张牌'];
                    if (!player.canMoveCard(null, event.nojudge)) list.remove('移动两张牌');
                    player.chooseControl(list).set('prompt', '请选择一项执行').set('ai', function () {
                        return list.randomGet();
                    });
                    'step 1'
                    if (result.control == '发动英魂') player.useSkill('yinghun');
                    if (result.control == '移动两张牌' || event.log) {
                        player.moveCard(true);
                        event.num--;
                        event.log = true;
                        if (event.num > 0) event.redo();
                        else event.finish();
                    }
                },
                intro: {
                    content: function (storage, player, skill) {
                        var str = player.storage.ymtaoni >= 3 ? '【讨逆】次数已用完' : '【讨逆】已使用' + (player.storage.ymtaoni || 0) + '次';
                        return str;
                    },
                },
            },
            ymzhiba: {
                global: 'ymzhiba_a',
                zhuSkill: true,
                audio: 'olzhiba',
                trigger: {
                    player: "compare",
                    target: "compare",
                },
                filter: function (event) {
                    return !event.iwhile;
                },
                direct: true,
                content: function () {
                    'step 0'
                    player.chooseControl('点数+3', '点数-3', 'cancel2').set('prompt', get.prompt2('ymzhiba')).set('ai', function () {
                        if (_status.event.small) return 1;
                        else return 0;
                    }).set('small', trigger.small);
                    'step 1'
                    if (result.index != 2) {
                        player.logSkill('ymzhiba');
                        if (result.index == 0) {
                            game.log(player, '拼点牌点数+3');
                            if (player == trigger.player) {
                                trigger.num1 += 3;
                                if (trigger.num1 > 13) trigger.num1 = 13;
                            } else {
                                trigger.num2 += 3;
                                if (trigger.num2 > 13) trigger.num2 = 13;
                            }
                        } else {
                            game.log(player, '拼点牌点数-3');
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
                subSkill: {
                    a: {
                        audio: 'yingyang',
                        enable: "phaseUse",
                        prompt: function () {
                            var player = _status.event.player;
                            var list = game.filterPlayer(function (target) {
                                return target.hasZhuSkill('ymzhiba', player) && player.canCompare(target);
                            });
                            var str = '和' + get.translation(list);
                            if (list.length > 1) str += '中的一人';
                            str += '进行拼点。若你没赢，其获得【英姿】；若赢，其受到一点伤害。';
                            return str;
                        },
                        filter: function (event, player) {
                            if (player.group != 'wu' || player.countCards('h') == 0) return false;
                            return game.hasPlayer(function (target) {
                                return target.hasZhuSkill('ymzhiba', player) && player.canCompare(target);
                            });
                        },
                        filterTarget: function (card, player, target) {
                            return target.hasZhuSkill('ymzhiba', player) && player.canCompare(target);
                        },
                        direct: true,
                        clearTime: true,
                        prepare: function (cards, player, targets) {
                            targets[0].logSkill('ymzhiba');
                        },
                        usable: 1,
                        content: function () {
                            "step 0"
                            player.chooseToCompare(target, function (card) {
                                if (card.name == 'du') return 20;
                                var player = get.owner(card);
                                var target = _status.event.getParent().target;
                                if (player != target && get.attitude(player, target) > 0) {
                                    return -get.number(card);
                                }
                                return get.number(card);
                            }).set('preserve', 'lose');
                            "step 1"
                            if (result.bool == false) {
                                event.card = [];
                                event.card1 = get.cardPile(function (card) {
                                    return get.suit(card) == 'diamond' && !event.card.contains(card);
                                });
                                if (event.card1) event.card.add(event.card1);
                                event.card2 = get.cardPile(function (card) {
                                    return get.suit(card) == 'diamond' && !event.card.contains(card);
                                });
                                if (event.card2) event.card.add(event.card2);
                                event.card3 = get.cardPile(function (card) {
                                    return get.suit(card) == 'diamond' && !event.card.contains(card);
                                });
                                if (event.card3) event.card.add(event.card3);
                                target.gain(event.card, 'gain2');
                            } else target.damage();
                        },
                        ai: {
                            basic: {
                                order: 1,
                            },
                            expose: 0.2,
                            result: {
                                target: function (player, target) {
                                    if (player.countCards('h', 'du') && get.attitude(player, target) < 0) return -1;
                                    if (player.countCards('h') <= player.hp) return 0;
                                    var maxnum = 0;
                                    var cards2 = target.getCards('h');
                                    for (var i = 0; i < cards2.length; i++) {
                                        if (cards2[i].number > maxnum) {
                                            maxnum = cards2[i].number;
                                        }
                                    }
                                    if (maxnum > 10) maxnum = 10;
                                    if (maxnum < 5 && cards2.length > 1) maxnum = 5;
                                    var cards = player.getCards('h');
                                    for (var i = 0; i < cards.length; i++) {
                                        if (cards[i].number < maxnum) return 1;
                                    }
                                    return 0;
                                },
                            },
                        },
                    },
                },
            },
            ymjiuzhu: {
                trigger: {
                    global: "roundStart",
                    player: "enterGame",
                },
                filter: function () {
                    return game.players.length > 1;
                },
                audio: 'longhun',
                content: function () {
                    'step 0'
                    if (!player.storage.ymjiuzhu) player.storage.ymjiuzhu = [];
                    game.findPlayer2(function (current) {
                        if (player.storage.ymjiuzhu && player.storage.ymjiuzhu.contains(current)) {
                            player.storage.ymjiuzhu.remove(current);
                            current.removeSkill('ymjiuzhu_a');
                        }
                    });
                    if (player.storage.ymjiuzhu.length == 0) player.unmarkSkill('ymjiuzhu');
                    player.chooseTarget('请选择【救主】的目标', lib.translate.ymjiuzhu_info, function (card, player, target) {
                        return target != player && !target.hasSkill('ymjiuzhu_a');
                    }).set('ai', function (target) {
                        var att = get.attitude(_status.event.player, target);
                        if (att > 0) return att + 1;
                        return Math.random();
                    }).animate = false;
                    'step 1'
                    if (result.bool) {
                        var target = result.targets[0];
                        player.line(target);
                        player.storage.ymjiuzhu.push(target);
                        target.addSkill('ymjiuzhu_a');
                        player.markSkill('ymjiuzhu');
                    }
                },
                marktext: "救",
                unique: true,
                charlotte: true,
                intro: {
                    content: function (storage, player, skill) {
                        var str = '当前【救主】目标：';
                        str += "<span style='color: red'>" + get.translation(player.storage.ymjiuzhu) + "</span>";
                        return str;
                    },
                },
                group: 'ymjiuzhu_b',
                subSkill: {
                    a: {
                        charlotte: true,
                        slient: true,
                        popup: false,
                        trigger: {
                            target: ["useCardToTargeted"],
                        },
                        forced: true,
                        filter: function (event, player) {
                            if (!player.isIn()) return false;
                            if (event.player == player) return false;
                            return game.countPlayer(function (current) {
                                if (current.storage.ymjiuzhu && current.storage.ymjiuzhu.contains(player) && event.player != current) return true;
                            });
                            return false;
                        },
                        content: function () {
                            'step 0'
                            game.countPlayer(function (current) {
                                if (current.storage.ymjiuzhu && current.storage.ymjiuzhu.contains(player)) {
                                    current.logSkill('ymjiuzhu', player);
                                    trigger.targets.remove(player);
                                    trigger.targets.push(current);
                                    trigger.player.line(current);
                                }
                            });
                            'step 1'
                            game.delay(1.5);
                        },
                        onremove: function (player) {
                            game.findPlayer2(function (current) {
                                if (current.storage.ymjiuzhu && current.storage.ymjiuzhu.contains(player)) {
                                    current.storage.ymjiuzhu.remove(player);
                                    if (!current.storage.ymjiuzhu.length) current.unmarkSkill('ymjiuzhu');
                                    else current.markSkill('ymjiuzhu');
                                }
                            });
                        },
                    },
                    b: {
                        trigger: {
                            player: "damageBegin4",
                        },
                        forced: true,
                        audio: 'longhun',
                        filter: function (event, player) {
                            return true;
                        },
                        content: function () {
                            if (trigger.num > 1) trigger.num = 1;
                            player.addTempSkill('mianyi');
                        },
                        ai: {
                            filterDamage: true,
                            skillTagFilter: function (player, tag, arg) {
                                if (arg.player.hasSkillTag('jueqing', false, player)) return false;
                            }
                        },
                    },
                },
            },
            ymhuwei: {
                trigger: {
                    global: "gainEnd",
                },
                audio: 'juejing',
                filter: function (event, player) {
                    return event.player != player && !(event.getParent().name == 'draw' && event.getParent(2).name == 'phaseDraw');
                },
                forced: true,
                content: function () {
                    player.draw();
                },
            },
            ymbishan: {
                audio: "dengji",
                enable: "phaseUse",
                usable: 1,
                filterTarget: function (card, player, target) {
                    if (target.countCards('e') <= 0) return false;
                    return player != target;
                },
                content: function () {
                    var card = target.getCards('e');
                    for (var i = 0; i < card.length; i++) {
                        player.equip(card[i]);
                    }
                    target.draw(card.length);
                    target.damage(5-card.length);
                },
                ai: {
                    order: 13,
                    result: {
                        target: function (player, target) {
                            if (!target.countCards('e')) return 0;
                            return -1;
                        },
                    },
                    threaten: 1,
                },
            },
            ymbawang: {
                audio: 'sbaiyin',
                enable: "phaseUse",
                filter: function (event, player) {
                    return player.countMark('ymbawang') > 0;
                },
                filterTarget: function (card, player, target) {
                    if (target.hasMark('ymbawang')) return false;
                    return player != target > 0;
                },
                content: function () {
                    player.removeMark('ymbawang', 1);
                    target.addMark('ymbawang', 1);
                },
                marktext: "王",
                intro: {
                    name: "八王",
                },
                ai: {
                    order: 11,
                    result: {
                        target: function (player, target) {
                            /*if ((player.countMark('ymbawang') >= 2 || !game.hasPlayer(function (current) {
                                return current != player && get.attitude(player, current) < 0 && current.hasMark('ymbawang');
                            })) && player.countCards('h', function (card) {
                                return get.tag(card, 'damage') && player.canUse(card, target, null, true) && player.getUseValue(card) > 0 && get.effect_use(target, card, player) > 0 && target.hasSkillTag('filterDamage', null, {
                                    player: player,
                                    card: card,
                                });
                            })) return 3 / Math.max(1, target.hp);
                            if ((!player.hasUnknown() && game.countPlayer(function (current) {
                                return get.attitude(player, current) < 0;
                            }) <= 1) || player.countMark('ymbawang') >= 2) {
                                return -1;
                            }
                            return 0;*/
                            return -1;
                        },
                    },
                    effect: {
                        player: function (card, player, target) {
                            if (player != target && get.tag(card, 'damage') && target && target.hasMark('ymbawang') && !target.hasSkillTag('filterDamage', null, {
                                player: player,
                                card: card,
                            })) return [1, 0, 1, -2];
                        },
                    },
                    threaten: 0.8,
                },
                group: ['ymbawang_start', 'ymbawang_what'],
                subSkill: {
                    start: {
                        audio: "sbaiyin",
                        trigger: {
                            global: ["gameStart","roundStart"],
                            player: "enterGame",
                        },
                        forced: true,
                        filter:function(event,player,name){
                            if(name=='roundStart') return game.roundNumber%3==0;
                            return true;
                        },
                        content: function () {
                            if(event.triggername=='gameStart') player.addMark("ymbawang", 3);
                            else player.addMark("ymbawang", 1);
                        },
                    },
                    what: {
                        trigger: {
                            source: ['damageBegin1'],
                            player:'damageBegin',
                            global: ['drawEnd'],
                        },
                        forced: true,
                        unique: true,
                        charlotte: true,
                        silent: true,
                        popup: false,
                        filter: function (event, player, name) {
                            if (name == 'damageBegin1') return event.player!=player&&event.player.hasMark('ymbawang');
                            else if (name == 'damageBegin'){
                                if(game.findPlayer(function (current) {
                                    if (current.hasMark('ymbawang') && current != player) return true;
                                })) return true;
                            }
                            else if (name == 'drawEnd'){
                                if (player.getHistory('gain', function (evt) {
                                    return evt.getParent().name=='draw'&&evt.getParent(2).name=='ymbawang_what'
                                }).length > 0) return false;
                                return event.player!=player&&event.player.hasMark('ymbawang');
                            }
                        },
                        content: function () {
                            var name = event.triggername;
                            if (name == 'damageBegin') {
                                var players=[];
                                game.findPlayer(function (current) {
                                    if (current.hasMark('ymbawang') && current != player) players.add(current);
                                });
                                var own=players.randomGet();
                                trigger.player=own;
                                game.log(player,'将伤害转移给了',own);
                                own.removeMark('ymbawang',1);
                            }
                           else if(name == 'damageBegin1'){
                               trigger.num++;
                           }
                           else if(name == 'drawEnd'){
                               player.draw(trigger.num);
                           }
                        },
                    },
                },
            },
            ymguijin: {
                unique: true,
                audio: "reguicai",
                global: "ymguijin_enable",
                zhuSkill: true,
                subSkill: {
                    enable: {
                        audio: 'jilue',
                        enable: "phaseUse",
                        discard: false,
                        usable: 1,
                        lose: false,
                        delay: false,
                        line: true,
                        direct: true,
                        clearTime: true,
                        prepare: function (cards, player, targets) {
                            targets[0].logSkill('ymguijin');
                        },
                        prompt: function () {
                            var player = _status.event.player;
                            var list = game.filterPlayer(function (target) {
                                return target != player && target.hasZhuSkill('ymguijin', player);
                            });
                            var str = '将一张牌交给' + get.translation(list);
                            if (list.length > 1) str += '中的一人';
                            return str;
                        },
                        filter: function (event, player) {
                            if (player.group != 'wei' && player.group != 'shu' && player.group != 'wu') return false;
                            if (player.countCards('he') == 0) return 0;
                            return game.hasPlayer(function (target) {
                                return target != player && target.hasZhuSkill('ymguijin', player);
                            });
                        },
                        filterCard: true,
                        position: 'he',
                        log: false,
                        filterTarget: function (card, player, target) {
                            return target != player && target.hasZhuSkill('ymguijin', player);
                        },
                        content: function () {
                            'step 0'
                            target.gain(cards, player, 'giveAuto');
                            player.addTempSkill('ymguijin_damage');
                            if(!player.storage.ymguijin) player.storage.ymguijin = [];
                            player.storage.ymguijin.add(target);
                            target.chooseBool(get.prompt(event.name), '是否令' + get.translation(player) + '摸一张牌？').set('ai', function () {
                                if (get.attitude(_status.event.player, player) > 0) return true;
                                return false;
                            });
                            'step 1'
                            if(result.bool){
                                player.draw();
                            }
                        },
                        ai: {
                            expose: 0.3,
                            order: 10,
                            result: {
                                target: 5,
                            },
                        },
                    },
                    damage: {
                        trigger: {
                            source: 'damageBegin1',
                        },
                        filter: function (event, player) {
                            return player.storage.ymguijin && player.storage.ymguijin == event.player;
                        },
                        silent: true,
                        popup: false,
                        forced: true,
                        charlotte: true,
                        content: function () {
                            trigger.logSkill('ymguijin');
                            trigger.cancel();
                        },
                        onremove: function (player) {
                            delete player.storage.ymguijin;
                        },
                        mark: true,
                        marktext: '晋',
                        intro: {
                            content: function (storage, player, skill) {
                                var str = '当前【归晋】角色：';
                                str += "<span style='color: red'>" + get.translation(player.storage.ymguijin) + "</span>";
                                return str;
                            },
                        },
                    },
                },
            },
            ymqiaoshui: {
                unique: true,
                filter: function (event, player) {
                    if (event.type == 'wuxie') return false;
                    if (event.filterCard({name: 'shan'}, player, event)) return false;
                    return !player.storage.ymqiaoshuo;
                },
                enable: ["chooseToUse", "chooseToRespond"],
                chooseButton: {
                    dialog: function (event, player) {
                        var list = [];
                        for (var i = 0; i < lib.inpile.length; i++) {
                            var name = lib.inpile[i];
                            if (name == 'shan' || name == 'wuxie') continue;
                            if (name == 'sha') {
                                list.add(['基本', '', 'sha']);
                                list.add(['基本', '', 'sha', 'fire']);
                                list.add(['基本', '', 'sha', 'thunder']);
                                list.add(['基本', '', 'sha', 'ice']);
                                list.add(['基本', '', 'sha', 'kami']);
                            } else if (get.type(name) == 'trick') list.add(['锦囊', '', name]);
                            else if (get.type(name) == 'basic') list.add(['基本', '', name]);
                        }
                        if (list.length == 0) {
                            return ui.create.dialog('【巧说】无可用牌');
                        }
                        return ui.create.dialog('巧说', [list, 'vcard']);
                    },
                    filter: function (button, player) {
                        return _status.event.getParent().filterCard({name: button.link[2]}, player, _status.event.getParent());
                    },
                    check: function (button) {
                        var player = _status.event.player;
                        if (player.countCards('h', button.link[2]) > 0) return 0;
                        if (button.link[2] == 'wugu') return 0;
                        var effect = player.getUseValue(button.link[2]);
                        if (effect > 0) return effect;
                        return 0;
                    },
                    backup: function (links, player) {
                        return {
                            selectCard: 0,
                            filterCard: false,
                            popname: true,
                            viewAs: {name: links[0][2], nature: links[0][3]},
                            onuse: function (result, player) {
                                player.storage.ymqiaoshuo = true;
                            },
                        }
                    },
                    prompt: function (links, player) {
                        return '声明你使用或打出' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]);
                    },
                },
                ai: {
                    skillTagFilter: function (player) {
                        if (player.isDying()) {
                        } else return false;
                    },
                    order: 10,
                    result: {
                        player: function (player) {
                            var allshown = true, players = game.filterPlayer();
                            for (var i = 0; i < players.length; i++) {
                                if (players[i].ai.shown == 0) {
                                    allshown = false;
                                }
                                if (players[i] != player && players[i].countCards('h') && get.attitude(player, players[i]) > 0) {
                                    return 1;
                                }
                            }
                            if (allshown) return 1;
                            return 0;
                        },
                    },
                    threaten: 1.9,
                    save: true,
                    respondSha: true,
                    fireAttack: true,
                    thunderAttack: true,
                },
                group: ['ymqiaoshui_wuxie', 'ymqiaoshui_shan', 'ymqiaoshui_compare', 'ymqiaoshui_back'],
                subSkill: {
                    wuxie: {
                        selectCard: 0,
                        filterCard: false,
                        popname: true,
                        popup: false,
                        silent: true,
                        enable: ["chooseToUse", "chooseToRespond"],
                        prompt: "声明你使用无懈可击",
                        filter: function (event, player) {
                            return !player.storage.ymqiaoshuo;
                        },
                        viewAsFilter: function (player) {
                            return !player.storage.ymqiaoshuo;
                        },
                        onuse: function (result, player) {
                            player.storage.ymqiaoshuo = true;
                        },
                        viewAs: {
                            name: "wuxie",
                        },
                        ai: {
                            basic: {
                                useful: [6, 4],
                                value: [6, 4],
                            },
                            result: {
                                player: 1,
                            },
                            expose: 0.2,
                        },
                        sub: true,
                    },
                    shan: {
                        prompt: "声明你使用或打出闪",
                        popname: true,
                        popup: false,
                        silent: true,
                        selectCard: 0,
                        filterCard: false,
                        enable: ["chooseToUse", "chooseToRespond"],
                        filter: function (event, player) {
                            return !player.storage.ymqiaoshuo;
                        },
                        viewAsFilter: function (player) {
                            return !player.storage.ymqiaoshuo;
                        },
                        onuse: function (result, player) {
                            player.storage.ymqiaoshuo = true;
                        },
                        viewAs: {
                            name: "shan",
                        },
                        ai: {
                            skillTagFilter: function (player) {
                                return !player.storage.ymqiaoshuo;
                            },
                            threaten: 1,
                            respondShan: true,
                            order: 10,
                            basic: {
                                useful: [7, 2],
                                value: [7, 2],
                            },
                            result: {
                                player: 1,
                            },
                        },
                        sub: true,
                    },
                    compare: {
                        trigger: {
                            player: ["useCardBefore", "respondBefore"],
                        },
                        forced: true,
                        popup: false,
                        silent: true,
                        audio: 'xinqiaoshui',
                        filter: function (event, player) {
                            //if(event.skill!='ymqiaoshui'&&event.skill!='ymqiaoshui_wuxie'&&event.skill=='ymqiaoshui_shan') return false;
                            return (event.skill && (event.skill.indexOf('ymqiaoshui') == 0 || event.skill.indexOf('ymqiaoshui_wuxie') == 0 || event.skill.indexOf('ymqiaoshui_shan') == 0));
                            //return false;
                        },
                        content: function () {
                            'step 0'
                            player.chooseTarget(2, '选择拼点目标，并猜测胜负', function (card, player, target) {
                                if (target.countCards('h') <= 0) return false;
                                return !target.hasSkillTag('noCompareTarget');
                            }).set('ai', function (target) {
                                var player = _status.event.player;
                                var att = get.attitude(player, target);
                                if (att < 0) {
                                    return att - 1;
                                }
                                return att;
                            }).set('targetprompt', ['胜利者', '失败者']);
                            'step 1'
                            if (result.targets) {
                                event.target = result.targets[0];
                                if (result.targets[0].canCompare(result.targets[1])) {
                                    result.targets[0].chooseToCompare(result.targets[1]);
                                }
                            } else {
                                delete player.storage.ymqiaoshuo;
                                trigger.untrigger();
                                trigger.finish();
                                event.finish();
                            }
                            'step 2'
                            if (result.winner !== event.target || !result.winner) {
                                player.storage.ymqiaoshuo = true;
                                game.log(player, '猜错了');
                                player.loseHp();
                                event.cards = [result.player, result.target].filterInD('d');
                                if (event.cards) player.gain(event.cards, 'gain2', 'log');
                                trigger.untrigger();
                                trigger.finish();
                            }
                            if (result.winner === event.target) {
                                player.storage.ymqiaoshuo = true;
                                game.log(player, '猜对了');
                                event.finish();
                            }
                        },
                    },
                    back: {
                        trigger: {
                            global: 'phaseAfter',
                        },
                        silent: true,
                        popup: false,
                        forced: true,
                        content: function () {
                            delete player.storage.ymqiaoshuo;
                        },
                    },
                },
            },
            ymzongshi: {
                trigger: {
                    player: ['damageEnd', 'loseHpEnd'],
                },
                audio: 'xinjyzongshi',
                filter: function (event, player) {
                    return player != _status.currentPhase;
                },
                content: function () {
                    'step 0'
                    player.draw(2);
                    if (trigger.source != undefined) {
                        player.chooseCard(1, 'h', true, '选择1张手牌展示之', function (card) {
                            return true;
                        }).set('ai', function (card) {
                            return 6 - get.value(card)
                        });
                    } else event.finish();
                    'step 1'
                    if (result.cards) {
                        player.showCards(result.cards);
                        trigger.source.chooseCard(1, '选择1张同花色的牌交给' + get.translation(player) + '且其回复一点体力，否则，你弃置' + player.maxHp + '张手牌', function (card) {
                            return get.suit(card) == get.suit(result.cards[0]);
                        }).set('ai', function (card) {
                            return 10 - get.value(card);
                        });
                    }
                    'step 2'
                    if (result.cards && result.cards.length && result.bool) {
                        player.gain(result.cards, trigger.source, 'giveAuto');
                        player.recover();
                    } else {
                        trigger.source.chooseToDiscard(player.maxHp, true);
                    }
                },
            },
            ymdunjia: {
                trigger: {
                    global: "judgeBefore",
                },
                charlotte: true,
                firstDo: true,
                audio: 'qixing',
                logTarget: "player",
                priority: 2,
                content: function () {
                    'step 0'
                    if (!player.storage.ymdunjia) player.storage.ymdunjia = 0;
                    player.storage.ymdunjia++;
                    var card = ui.cardPile.hasChildNodes() ? ui.cardPile.firstChild : get.cards(1);
                    var judge0 = trigger.judge(card);
                    var judge1 = 0;
                    var choice = card.number;
                    event.suitchoice = card.suit;
                    event.namex = [];
                    event.namechoice = 'cancel2';
                    for (var i = 0; i < lib.inpile.length; i++) {
                        var name = lib.inpile[i];
                        if (name == 'sha') {
                            event.namex.push(['basic', '', 'sha']);
                            event.namex.push(['basic', '', 'sha', 'fire']);
                            event.namex.push(['basic', '', 'sha', 'thunder']);
                            event.namex.push(['basic', '', 'sha', 'ice']);
                            event.namex.push(['basic', '', 'sha', 'kami']);
                        } else if (get.type(name) == 'trick') event.namex.push(['trick', '', name]);
                        else if (get.type(name) == 'delay') event.namex.push(['delay', '', name]);
                        else if (get.type(name) == 'basic') event.namex.push(['basic', '', name]);
                        else if (get.type(name) == 'equip') event.namex.push(['equip', '', name]);
                        else event.namex.push([get.type(name),'',name]);
                    }
                    var attitude = get.attitude(player, trigger.player);
                    var str = '请选择' + get.translation(trigger.player) + '的判定结果';
                    if (player.isUnderControl()) {
                        game.swapPlayerAuto(player);
                    }
                    event.switchToAuto = function () {
                        _status.imchoosing = false;
                        event.suitx = ['diamond', 'heart', 'club', 'spade'];
                        for (var j = 0; j < event.namex.length; j++) {
                            for (var x = 0; x < 4; x++) {
                                for (var i = 1; i < 14; i++) {
                                    var judge2 = (trigger.judge({
                                        name: event.namex[j][2],
                                        suit: event.suitx[x],
                                        color :['diamond','heart'].contains(event.suitx[x])?'red':'black',
                                        number: i,
                                    }) - judge0) * attitude;
                                    if (judge2 > judge1) {
                                        choice = i;
                                        event.suitchoice = event.suitx[x];
                                        event.namechoice = event.namex[j];
                                        judge1 = judge2;
                                        if (judge2 > 0) break;
                                    }
                                }
                            }
                        }
                        event._result = {
                            suit: event.suitchoice,
                            number: choice,
                            bool: true,
                        };
                        if (event.dialog) event.dialog.close();
                        if (event.control) event.control.close();
                        game.resume();
                        _status.imchoosing = false;
                    };
                    var chooseButton = function (player, str) {
                        var event = _status.event;
                        player = player || event.player;
                        if (!event._result) event._result = {};
                        var dialog = ui.create.dialog(str, 'forcebutton', 'hidden');
                        event.dialog = dialog;
                        dialog.addText('花色');
                        var table = ui.create.div('.add-setting', {
                            margin: 0,
                            width: '100%',
                            position: 'relative'
                        }, dialog.content);
                        var listi = ['spade', 'heart', 'club', 'diamond'];
                        for (var i = 0; i < listi.length; i++) {
                            var td = ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
                            td.link = listi[i];
                            table.appendChild(td);
                            td.innerHTML = '<span>' + get.translation(listi[i]) + '</span>';
                            td.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                                if (_status.dragged) return;
                                if (_status.justdragged) return;
                                _status.tempNoButton = true;
                                setTimeout(function () {
                                    _status.tempNoButton = false;
                                }, 500);
                                var link = this.link;
                                var current = this.parentNode.querySelector('.bluebg');
                                if (current) {
                                    current.classList.remove('bluebg');
                                }
                                this.classList.add('bluebg');
                                event._result.suit = link;
                            });
                        }
                        dialog.addText('点数');
                        table = ui.create.div('.add-setting', {
                            margin: 0,
                            width: '100%',
                            position: 'relative'
                        }, dialog.content)
                        for (var i = 1; i < 14; i++) {
                            var td = ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode', table);
                            td.link = i;
                            var num = i;
                            td.innerHTML = '<span>' + get.strNumber(num) + '</span>';
                            td.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                                if (_status.dragged) return;
                                if (_status.justdragged) return;
                                _status.tempNoButton = true;
                                setTimeout(function () {
                                    _status.tempNoButton = false;
                                }, 500);
                                var link = this.link;
                                var current = this.parentNode.querySelector('.bluebg');
                                if (current) {
                                    current.classList.remove('bluebg');
                                }
                                this.classList.add('bluebg');
                                event._result.number = link;
                            });
                        }
                        dialog.add('　　');
                        event.dialog.open();

                        event.control = ui.create.control('ok', 'cancel2', function (link) {
                            var result = event._result;
                            if (link == 'cancel2') result.bool = false;
                            else {
                                if (!result.number || !result.suit) return;
                                result.bool = true;
                            }
                            event.dialog.close();
                            event.control.close();
                            game.resume();
                            _status.imchoosing = false;
                        });
                        for (var i = 0; i < event.dialog.buttons.length; i++) {
                            event.dialog.buttons[i].classList.add('selectable');
                        }
                        game.pause();
                        game.countChoose();
                    };
                    if (event.isMine()) {
                        chooseButton(player, str);
                    } else {
                        event.switchToAuto();
                    }
                    'step 1'
                    if (event.dialog) event.dialog.close();
                    if (event.control) event.control.close();
                    event.resultx = result;
                    var dialog = ui.create.dialog('遁甲', [event.namex, 'vcard']);
                    player.chooseButton(dialog, true).set('ai', function (button) {
                        var choice = _status.event.botton;
                        switch (button.link) {
                            case choice:
                                return 999;
                            default:
                                return Math.floor(Math.random() * 10);
                        }
                    }).set('botton', event.namechoice).prompt = get.prompt2(event.name);
                    'step 2'
                    Object.assign(result, event.resultx);
                    player.logSkill(event.name, trigger.player);
                    var card=game.createCard({name:result.links[0][2],suit:result.suit,number:result.number,nature:result.links[0][3]});
                    card.fix();
                    ui.ordering.appendChild(card);
                    var code,node;
                    if (game.chess) {
                        node = card.copy('thrown', 'center', ui.arena).animate('start');
                    } else {
                        node = player.$throwordered(card.copy(), true);
                    }
                    node.classList.add('thrownhighlight');
                    ui.arena.classList.add('thrownhighlight');
                    trigger.fixedResult = {
                        card: card,
                        name: result.links[0][2],
                        suit: result.suit,
                        color: ['diamond','heart'].contains(result.suit)?'red':'black',
                        number: result.number,
                        node: node,
                        judge: trigger.judge(card)
                    };
                    game.log(player, '将判定结果锁定成', '#g', card);
                    if (trigger.player.judging.length) Object.assign(trigger.player.judging[0], trigger.fixedResult);
                    player.popup(get.translation(result.suit + 2) + get.strNumber(result.number), 'thunder');
                    if (!trigger.result) trigger.result = {};
                    Object.assign(trigger.result, trigger.fixedResult);
                    trigger.noJudgeTrigger = true;
                    trigger.direct = true;
                    trigger.cancel();
                    if (trigger.result.judge > 0) {
                        trigger.result.bool = true;
                        trigger.player.popup('洗具');
                    }
                    if (trigger.result.judge < 0) {
                        trigger.result.bool = false;
                        trigger.player.popup('杯具');
                    }
                    game.log(trigger.player, '的判定结果为', card);
                    game.delay(2);
                    'step 3'
                    ui.arena.classList.remove('thrownhighlight');
                    game.addVideo('judge2', null, event.videoId);
                    ui.clear();
                    var card = trigger.result.card;
                    if(trigger.callback){
                        var next=game.createEvent('judgeCallback',false);
                        next.player=trigger.player;
                        next.card=card;
                        next.judgeResult=get.copy(trigger.result);
                        next.setContent(trigger.callback);
                    }
                    else{
                        if(!get.owner(card)){
                            if(trigger.position!=ui.discardPile) trigger.position.appendChild(card);
                        }
                    }
                    game.delay();
                },
            },
            ymqixing: {
                trigger: {
                    player: 'phaseBegin',
                },
                audio: 'kuangfeng',
                forced: true,
                content: function () {
                    'step 0'
                    player.discard(player.getCards('h'));
                    event.num = 7;
                    event.cards = [];
                    event.names = [];
                    'step 1'
                    event.num--;
                    var card = get.cardPile(function (card) {
                        return !event.cards.contains(card) && !event.names.contains(card.name);
                    });
                    if (card) {
                        event.cards.add(card);
                        event.names.add(card.name);
                    }
                    if (event.num > 0) event.redo();
                    'step 2'
                    player.gain(event.cards, 'gain2');
                },
                mod: {
                    maxHandcardBase: function (player, num) {
                        return 7;
                    },
                },
            },
            ymxuming: {
                group: ["ymxuming_lose", "ymxuming_after"],
                audio: 'dawu',
                notemp: true,
                trigger: {
                    player: "dying",
                },
                forced: true,
                filter: function (event, player) {
                    var content = player.storage.ymxuming;
                    for (var i = 0; i < content.length; i++) {
                        if (get.owner(content[i]) != player && get.position(content[i]) != 's') {
                            return true;
                        }
                    }
                    return false;
                },
                init: function (player) {
                    player.storage.ymxuming = [];
                    game.addVideo('storage', player, ['ymxuming', get.cardsInfo(player.storage.ymxuming), 'cards']);
                },
                mark: true,
                content: function () {
                    for (var i = 0; i < player.storage.ymxuming.length; i++) {
                        if (get.owner(player.storage.ymxuming[i]) == player || get.position(player.storage.ymxuming[i]) == 's') {
                            player.storage.ymxuming.splice(i, 1);
                            i--;
                        }
                    }
                    var n = player.storage.ymdunjia || 0;
                    var num = n > 4 ? 4 : n;
                    var cards = player.storage.ymxuming.splice(0, 3 + num);
                    player.gain(cards, 'log');
                    player.$gain2(cards);
                },
                intro: {
                    nocount: true,
                    onunmark: function (content, player) {
                        player.storage.ymxuming.length = 0;
                    },
                    mark: function (dialog, content, player) {
                        dialog.add('<div class="text center">最近失去的牌</div>');
                        var cards = [];
                        var n = player.storage.ymdunjia || 0;
                        var num = n > 4 ? 4 : n;
                        for (var i = 0; i < content.length; i++) {
                            if (get.owner(content[i]) != player && get.position(content[i]) != 's') {
                                cards.push(content[i]);
                                if (cards.length >= 3 + num) break;
                            }
                        }
                        if (cards.length) {
                            dialog.add(cards);
                        } else {
                            dialog.add('（无）');
                        }
                    },
                    content: function (content, player) {
                        var str = '最近失去的牌：';
                        var cards = [];
                        var n = player.storage.ymdunjia || 0;
                        var num = n > 4 ? 4 : n;
                        for (var i = 0; i < content.length; i++) {
                            if (get.owner(content[i]) != player && get.position(content[i]) != 's') {
                                cards.push(content[i]);
                                if (cards.length >= 3 + num) break;
                            }
                        }
                        if (cards.length) {
                            str += get.translation(cards);
                        } else {
                            str += '无';
                        }
                        return str;
                    },
                },
                subSkill: {
                    lose: {
                        trigger: {
                            player: "loseEnd",
                        },
                        silent: true,
                        content: function () {
                            for (var i = 0; i < trigger.cards.length; i++) {
                                player.storage.ymxuming.unshift(trigger.cards[i]);
                            }
                            game.addVideo('storage', player, ['ymxuming', get.cardsInfo(player.storage.ymxuming), 'cards']);
                        },
                        forced: true,
                        popup: false,
                    },
                    after: {
                        trigger: {
                            player: "dyingEnd",
                        },
                        usable: 1,
                        silent: true,
                        content: function () {
                            var lists = [];
                            for (var card of lib.inpile) {
                                if (get.type({name: card, iscard: true}, 'trick') != 'trick') continue;
                                var use = game.createCard(card);
                                if (get.info(use).selectTarget != -1 || get.info(use).toself) continue;
                                lists.push(card);
                            }
                            var name = lists.randomGet();
                            var list = game.filterPlayer(function (current) {
                                return player.canUse(name, current);
                            }).sortBySeat();
                            if (list.length) {
                                player.useCard({name: name}, list);
                            }
                        },
                        forced: true,
                        popup: false,
                    },
                },
            },
            ymrenshi: {
                trigger: {
                    player: ['phaseBegin', 'damageEnd'],
                },
                audio: 'renjie2',
                filter: function (event, player, name) {
                    if (name == 'damageEnd') return event.num > 0;
                    return true;
                },
                content: function () {
                    'step 0'
                    player.chooseControl('获得牌', '摸牌', 'cancel2').set('prompt', '请选择获得场上角色区域内的一张牌或摸两张牌').set('ai', function () {
                        if (player.countCards('h') < 3) return '摸牌';
                        return '获得牌';
                    });
                    'step 1'
                    if (result.control == 'cancel2') event.finish();
                    if (result.control == '摸牌') {
                        player.addMark('ymrenshi', 1, false);
                        player.draw(2);
                        event.finish();
                    }
                    if (result.control == '获得牌') {
                        player.addMark('ymrenshi', 1, false);
                        player.chooseTarget('获得一名角色区域内的一张牌', function (card, player, target) {
                            return target.countCards('hej');
                        }).set('ai', function (target) {
                            var player = _status.event.player;
                            var att = get.attitude(player, target);
                            if (att < 0) {
                                att = -Math.sqrt(-att);
                            } else {
                                att = Math.sqrt(att);
                            }
                            return att * lib.card.guohe.ai.result.target(player, target);
                        });
                    }
                    'step 2'
                    if (result.targets) {
                        player.gainPlayerCard(result.targets[0], 'hej', true);
                    }
                },
                mod: {
                    maxHandcard: function (player, num) {
                        return num + (player.countMark('ymrenshi') || 0);
                    },
                },
                marktext: '忍',
                intro: {
                    name: '忍时',
                    content: function (storage) {
                        return '手牌上限+' + storage;
                    },
                },
                group: 'ymrenshi_use',
                subSkill: {
                    use: {
                        audio: 'renjie2',
                        usable: 1,
                        enable: "phaseUse",
                        prompt: "失去一点体力发动一次【忍时】",
                        content: function () {
                            "step 0"
                            player.loseHp(1);
                            player.useSkill('ymrenshi');
                            player.judge(function (card) {
                                return get.color(card) == 'black' ? 1 : -1;
                            });
                            'step 1'
                            if (result.bool && player.maxHp > player.hp) {
                                player.recover();
                            }
                        },
                        ai: {
                            basic: {
                                order: 1,
                            },
                            result: {
                                player: function (player) {
                                    if (player.countCards('h') >= player.hp + 1) return -1;
                                    if (player.hp < 2) return -1;
                                    return 1;
                                },
                            },
                        },
                    },
                },
            },
            ymguicai: {
                trigger: {
                    global: "judge",
                },
                audio: 'reguicai',
                content: function () {
                    "step 0"
                    event.cards = get.cards(4);
                    player.chooseCardButton(event.cards, '鬼才：选择一张牌作为' + get.translation(trigger.player) + '的' + trigger.judgestr + '判定结果').ai = function (button) {
                        if (get.attitude(player, trigger.player) > 0) {
                            return 1 + trigger.judge(button.link);
                        }
                        if (get.attitude(player, trigger.player) < 0) {
                            return 1 - trigger.judge(button.link);
                        }
                        return 0;
                    };
                    "step 1"
                    if (result.bool) {
                        var card = result.links[0];
                        event.card = card;
                        event.up = [];
                        event.cards.remove(card);
                        game.cardsGotoOrdering(card).relatedEvent = trigger;
                        player.respond(event.card, 'ymguicai', 'highlight', 'noOrdering');
                    } else {
                        event.finish();
                    }
                    "step 2"
                    if (trigger.player.judging[0].clone) {
                        trigger.player.judging[0].clone.classList.remove('thrownhighlight');
                        game.broadcast(function (card) {
                            if (card.clone) {
                                card.clone.classList.remove('thrownhighlight');
                            }
                        }, trigger.player.judging[0]);
                        game.addVideo('deletenode', player, get.cardsInfo([trigger.player.judging[0].clone]));
                    }
                    game.cardsDiscard(trigger.player.judging[0]);
                    trigger.player.judging[0] = card;
                    game.log(trigger.player, '的判定牌改为', card);
                    for (var i = 0; i < event.cards.length; i++) {
                        if (get.suit(event.card) == get.suit(event.cards[i])) {
                            event.up.push(event.cards[i]);
                            event.cards.splice(i--, 1);
                        }
                    }
                    if (event.cards.length > 0) player.gain(event.cards);
                    for (var i = event.up.length - 1; i >= 0; i--) {
                        ui.cardPile.insertBefore(event.up[i], ui.cardPile.firstChild);
                    }
                    if (event.up.length > 0) game.log(player, '将剩余的' + event.up.length + '张牌置于牌堆顶');
                    game.delay(2);

                },
                ai: {
                    tag: {
                        rejudge: 1,
                    },
                },
            },
            ymfanpan: {
                skillAnimation: true,
                animationColor: "thunder",
                audio: 'refankui',
                juexingji: true,
                unique: true,
                mark: true,
                trigger: {
                    player: "phaseEnd",
                },
                filter: function (event, player) {
                    if (player.storage.ymfanpan2 < Math.ceil(game.players.length / 2)) return false;
                    return !player.storage.ymfanpan;
                },
                forced: true,
                content: function () {
                    player.awakenSkill(event.name);
                    player.storage[event.name] = true;
                    player.gainMaxHp();
                    player.recover();
                    var players = game.players;
                    player.line(players, 'green');
                    for (var i = 0; i < players.length; i++) {
                        if (players[i] != player && players[i].getCards('h')) player.gain(players[i].getCards('h'), players[i], 'giveAuto');
                    }
                },
                intro: {
                    content: "limited",
                },
                group: 'ymfanpan_phase',
                subSkill: {
                    phase: {
                        trigger: {
                            player: 'phaseBefore',
                        },
                        silent: true,
                        popup: false,
                        forced: true,
                        content: function () {
                            if (!player.storage.ymfanpan2) player.storage.ymfanpan2 = 0;
                            player.storage.ymfanpan2++;
                        },
                    },
                },
            },
            ymzuijiu: {
                trigger: {
                    player: 'phaseUseBegin',
                },
                forced: true,
                audio: 'retishen',
                filter: function (event, player) {
                    return player.hp < player.maxHp;
                },
                content: function () {
                    player.gainMaxHp([1, 2].randomGet());
                    player.recover();
                    player.useCard({name: 'jiu'}, player);
                },
                mod: {
                    cardUsable: function (card, player, num) {
                        if (card.name == 'jiu') return Infinity;
                    },
                },
                group: ['ymzuijiu_use', 'ymzuijiu_lose'],
                subSkill: {
                    use: {
                        trigger: {
                            player: 'useCard',
                        },
                        popup: false,
                        silent: true,
                        forced: true,
                        filter: function (event, player) {
                            return event.card.name == 'jiu' && player.hp > 0;
                        },
                        content: function () {
                            if (!player.storage.ymjiu2) player.storage.ymjiu2 = 0;
                            player.storage.ymjiu2++;
                            player.markSkill('ymzuijiu_lose');
                        },
                    },
                    lose: {
                        trigger: {
                            global: ['useCardAfter', 'phaseAfter', 'useCard1'],
                        },
                        lastDo: true,
                        priority: 1,
                        popup: false,
                        silent: true,
                        charlotte: true,
                        marktext: '酒',
                        intro: {
                            name: '醉酒',
                            content: function (storage, player, skill) {
                                return '已使用' + player.storage.jiu + '次【酒】';
                            },
                        },
                        filter: function (event, player) {
                            if (!player.storage.ymjiu2 || player.storage.ymjiu2 == 0) return false;
                            return !player.hasSkill('jiu');
                        },
                        content: function () {
                            player.addSkill('jiu');
                            player.storage.jiu = player.storage.ymjiu2;
                            if (!player.node.jiu && lib.config.jiu_effect) {
                                player.node.jiu = ui.create.div('.playerjiu', player.node.avatar);
                                player.node.jiu2 = ui.create.div('.playerjiu', player.node.avatar2);
                            }
                        },
                    },
                },
            },
            ympaoxiao: {
                enable: 'phaseUse',
                audio: 'paoxiao',
                usable: 1,
                filterTarget: function (card, player, target) {
                    if (target == player) return false;
                    return true;
                },
                filter: function (event, player) {
                    return player.countCards('h') > 0;
                },
                content: function () {
                    'step 0'
                    if (target.countCards('h') > 0) player.chooseToCompare(target);
                    else event.goto(2);
                    'step 1'
                    if (result.bool) {
                        player.line(target);
                        player.useCard({name: 'sha'}, target, false).animate = false;
                        player.getStat().skill.ympaoxiao--;
                    } else {
                        player.addTempSkill('ympaoxiao_use');
                        player.draw(2);
                    }
                    event.finish();
                    'step 2'
                    if (player.countCards('h') > 0) player.chooseToDiscard().set('ai', function (card) {
                        return 3 - get.value(card);
                    });
                    'step 3'
                    if (result.bool) {
                        player.line(target);
                        player.useCard({name: 'sha'}, target, false).animate = false;
                        player.getStat().skill.ympaoxiao--;
                    } else {
                        player.addTempSkill('ympaoxiao_use');
                        player.draw(2);
                    }
                },
                ai: {
                    order: 9,
                    result: {
                        target: function (player, target) {
                            if (target.hp == 1) return -5;
                            return -2;
                        },
                    },
                },
                subSkill: {
                    use: {
                        popup: false,
                        silent: true,
                        charlotte: true,
                        mark: true,
                        intro: {
                            name: '咆哮',
                            content: function (storage, player, skill) {
                                var str = '你使用【杀】无距离次数限制';
                                if (player.getDamagedHp() > 0) str += ('且可额外指定' + player.getDamagedHp() + '名角色为目标');
                                return str;
                            },
                        },
                        mod: {
                            targetInRange: function (card, player, target, now) {
                                if (card.name == 'sha') return true;
                            },
                            cardUsable: function (card, player, num) {
                                if (card.name == 'sha') return Infinity
                            },
                            selectTarget: function (card, player, range) {
                                if (card.name == 'sha' && range[1] != -1) range[1] += player.getDamagedHp();
                            },
                        },
                    },
                },
            },
            ymxiaoyong: {
                trigger: {
                    source: 'damageBegin3',
                },
                audio: 'retishen',
                filter: function (event, player) {
                    if (!event.card || event.card.name != 'sha') return false;
                    return event.player != player;
                },
                check: function (event, player) {
                    return get.attitude(player, event.target) <= 0 && player.maxHp > 1;
                },
                content: function () {
                    'step 0'
                    player.judge(function (card) {
                        if (get.suit(card) == 'heart') return 2;
                        if (get.suit(card) == 'spade') return 1;
                        return -2;
                    });
                    'step 1'
                    if (result.judge < 0) {
                        event.finish();
                        return;
                    }
                    if (result.suit == 'heart') {
                        trigger.cancel();
                        trigger.player.loseMaxHp(trigger.num).source = player;
                    }
                    if (result.suit == 'spade') trigger.num += trigger.num;
                    'step 2'
                    player.loseMaxHp();
                    player.storage.ymjiu2 = 0;
                    player.removeSkill('jiu');
                    player.unmarkSkill('ymzuijiu_lose');
                },
            },
            ymtieji: {
                usable: 1,
                audio: 'retieji',
                enable: "phaseUse",
                marktext: "骑",
                intro: {
                    content: function (storage, player, skill) {
                        var str = '当前状态：';
                        if (player.hasSkill('ymtieji_spade')) str += '<br><li>♠️：你的【杀】指定目标后，你令其本回合技能失效。';
                        if (player.hasSkill('ymtieji_heart')) str += '<br><li>♥️️：你的【杀】不可被闪避且无视目标防具。';
                        if (player.hasSkill('ymtieji_club')) str += '<br><li>♣️：你的【杀】造成的伤害+1。';
                        if (player.hasSkill('ymtieji_diamond')) str += '<br><li>♦️：你的【杀】无距离次数限制。';
                        return str;
                    },
                },
                content: function () {
                    "step 0"
                    var cards = player.getCards('h');
                    event.suit = [];
                    event.limited = [];
                    event.cards = [];
                    event.num = 0;
                    event.all = ['spade', 'heart', 'club', 'diamond'];
                    if (cards && cards.length > 0) {
                        player.showHandcards();
                        for (var i = 0; i < cards.length; i++) {
                            if (!event.suit.contains(get.suit(cards[i]))) {
                                event.suit.add(get.suit(cards[i]));
                                event.all.remove(get.suit(cards[i]));
                            }
                        }
                    }
                    'step 1'
                    var card = get.cardPile(function (card) {
                        for (var i = 0; i < event.all.length; i++) {
                            if (get.suit(card) == event.all[i] && !event.limited.contains(get.suit(card)) && !event.cards.contains(card)) return true;
                        }
                        return false;
                    });
                    if (card) {
                        event.cards.push(card);
                        event.limited.add(get.suit(card));
                        event.num++;
                        if (event.num < event.all.length) event.redo();
                    }
                    "step 2"
                    if (event.suit.contains('spade')) player.addTempSkill('ymtieji_spade');
                    if (event.suit.contains('heart')) player.addTempSkill('ymtieji_heart');
                    if (event.suit.contains('club')) player.addTempSkill('ymtieji_club');
                    if (event.suit.contains('diamond')) player.addTempSkill('ymtieji_diamond');
                    //var card = get.cardPile(function (card) {
                    //    return card.name == 'sha' && !event.cards.contains(card);
                    //});
                    //event.cards.push(card);
                    player.gain(event.cards, 'gain2');
                },
                ai: {
                    result: {
                        player: 1,
                    },
                    order: 11,
                },
                subSkill: {
                    spade: {
                        shaRelated: true,
                        popup: false,
                        silent: true,
                        charlotte: true,
                        forced: true,
                        init: function (player) {
                            player.markSkill('ymtieji');
                        },
                        onremove: function (player) {
                            player.unmarkSkill('ymtieji');
                        },
                        trigger: {
                            player: "useCardToTargeted",
                        },
                        filter: function (event, player) {
                            return event.card.name == 'sha';
                        },
                        logTarget: "target",
                        content: function () {
                            trigger.target.addTempSkill('baiban');
                        },
                        ai: {
                            ignoreSkill: true,
                            skillTagFilter: function (player, tag, arg) {
                                if (!arg || arg.isLink || !arg.card || arg.card.name != 'sha') return false;
                                if (!arg.skill || !lib.skill[arg.skill] || lib.skill[arg.skill].charlotte || !arg.target.getSkills(true, false).contains(arg.skill)) return false;
                            },
                        },
                    },
                    heart: {
                        shaRelated: true,
                        popup: false,
                        silent: true,
                        charlotte: true,
                        init: function (player) {
                            player.markSkill('ymtieji');
                        },
                        onremove: function (player) {
                            player.unmarkSkill('ymtieji');
                        },
                        trigger: {
                            player: "useCardToTargeted",
                        },
                        forced: true,
                        filter: function (event, player) {
                            return event.card.name == 'sha';
                        },
                        logTarget: "target",
                        content: function () {
                            trigger.target.addTempSkill('qinggang2');
                            trigger.target.storage.qinggang2.add(trigger.card);
                            trigger.getParent().directHit.add(trigger.target);
                        },
                        ai: {
                            skillTagFilter: function (player, tag, arg) {
                                if (!arg || !arg.card || arg.card.name != 'sha') return false;
                            },
                            "unequip": true,
                            "directHit_ai": true,
                            "unequip_ai": true,
                        },
                    },
                    club: {
                        trigger: {
                            source: "damageBegin1",
                        },
                        filter: function (event) {
                            return event.card && event.card.name == 'sha';
                        },
                        forced: true,
                        popup: false,
                        silent: true,
                        charlotte: true,
                        init: function (player) {
                            player.markSkill('ymtieji');
                        },
                        onremove: function (player) {
                            player.unmarkSkill('ymtieji');
                        },
                        content: function () {
                            trigger.num++;
                        },
                    },
                    diamond: {
                        popup: false,
                        silent: true,
                        charlotte: true,
                        init: function (player) {
                            player.markSkill('ymtieji');
                        },
                        onremove: function (player) {
                            player.unmarkSkill('ymtieji');
                        },
                        mod: {
                            targetInRange: function (card, player, target, now) {
                                if (card.name == 'sha') return true;
                            },
                            cardUsable: function (card, player, num) {
                                if (card.name == 'sha') return Infinity
                            },
                        },
                    },
                },
            },
            ymmengshi: {
                audio: 'tieji',
                firstDo: true,
                trigger: {
                    player: "useCard1",
                },
                forced: true,
                filter: function (event, player) {
                    var num = game.countPlayer(function (current) {
                        return current.isDamaged();
                    });
                    return !event.audioed && event.card.name == 'sha' && event.targets.length > 1 && num > 0;
                },
                content: function () {
                    trigger.audioed = true;
                },
                mod: {
                    selectTarget: function (card, player, range) {
                        var num = game.countPlayer(function (current) {
                            return current.isDamaged();
                        });
                        if (card.name == 'sha' && range[1] != -1) range[1] += num;
                    },
                },
            },
            ymnajian: {
                trigger: {
                    player: 'gainBegin',
                },
                audio: 'baonue2',
                check: function (event, player) {
                    return player.countMark('ymnajian') < game.players.length;
                },
                filter: function (event, player) {
                    if (!event.cards || event.cards.length == 0) return false;
                    return event.getParent().name != 'draw';
                },
                content: function () {
                    trigger.cancel();
                    player.draw(trigger.cards.length);
                    player.addMark('ymnajian');
                },
                marktext: '谏',
                intro: {
                    name: '纳谏',
                    content: 'mark',
                },
            },
            ymbaonue: {
                trigger: {
                    player: 'phaseBegin',
                },
                audio: 'olbaonue',
                content: function () {
                    'step 0'
                    var num1 = player.countMark('ymnajian');
                    var num2 = game.players.length;
                    player.removeMark('ymnajian', num1);
                    if (num1 >= num2) event.goto(3);
                    'step 1'
                    player.chooseTarget([1, Infinity], get.prompt(event.name), '选择任意名其他角色随机弃置其1-3张牌', function (card, player, target) {
                        return target != player;
                    }).set('ai', function (target) {
                        var player = _status.event.player;
                        return get.damageEffect(target, player, player);
                    });
                    'step 2'
                    if (result.bool && result.targets) {
                        for (var i = 0; i < result.targets.length; i++) {
                            var num = [1, 2, 3].randomGet();
                            var cards = result.targets[i].getCards('he').randomGets(num);
                            result.targets[i].discard(cards);
                        }
                        if (result.targets.length > 1) event.goto(5);
                        else event.finish();
                    } else event.finish();
                    'step 3'
                    player.chooseTarget([1, Infinity], get.prompt(event.name), '选择任意名其他角色对其随机造成1-3点伤害', function (card, player, target) {
                        return target != player;
                    }).set('ai', function (target) {
                        var player = _status.event.player;
                        return get.damageEffect(target, player, player);
                    });
                    'step 4'
                    if (result.bool && result.targets) {
                        for (var i = 0; i < result.targets.length; i++) {
                            var num = [1, 2, 3].randomGet();
                            result.targets[i].damage(num);
                        }
                        if (result.targets.length > 1) event.goto(5);
                        else event.finish();
                    } else event.finish();
                    'step 5'
                    player.chooseControl('失去体力', '减少上限', function (event, player) {
                        if (player.hp == player.maxHp) return '失去体力';
                        if (player.hp < player.maxHp - 1 || player.hp <= 2) return '减少上限';
                        return '失去体力';
                    }).set('prompt', '暴虐：失去1点体力或减1点体力上限');
                    'step 6'
                    player.addMark('ymnajian');
                    if (result.control == '失去体力') {
                        player.loseHp();
                    }
                    if (result.control == '减少上限') {
                        player.loseMaxHp();
                    }
                },
            },
            ymhengzheng: {
                enable: 'phaseUse',
                usable: 1,
                audio: 'hengzheng',
                content: function () {
                    'step 0'
                    event.current = player.next;
                    event.currented = [];
                    "step 1"
                    event.currented.push(event.current);
                    event.current.animate('target');
                    if (event.current.getCards('he').length > 0) {
                        event.current.chooseCard(true, 'he', '横征：交给' + get.translation(player) + '一张牌', function (card) {
                            return true;
                        }).set('ai', function (card) {
                            return 3 - get.value(card);
                        });
                    } else event.goto(3);
                    "step 2"
                    if (result.bool == true) {
                        player.gain(result.cards, event.current, 'giveAuto');
                        player.chooseBool(get.prompt(event.name), '是否令<span style="color: red">' + get.translation(event.current) + '</span>摸一张牌？').set('ai', function () {
                            var player = _status.event.player;
                            if (get.attitude(player, event.current) > 0) return true;
                            return false;
                        });
                    } else {
                        event.current = event.current.next;
                        if (event.current != player && !event.currented.contains(event.current)) {
                            game.delay(0.5);
                            event.goto(1);
                        }
                    }
                    'step 3'
                    if (result.bool) {
                        event.current.draw();
                    }
                    event.current = event.current.next;
                    if (event.current != player && !event.currented.contains(event.current)) {
                        game.delay(0.5);
                        event.goto(1);
                    }
                },
                ai: {
                    result: {
                        player: 6,
                    },
                    order: 11,
                },
            },
            ymtuxi: {
                trigger: {
                    player: 'phaseBegin',
                },
                audio: 'retuxi',
                round: 1,
                content: function () {
                    'step 0'
                    var date = new Date();
                    var time = date.getHours();
                    if (time >= 6 && time < 18) event.day = true;
                    else event.night = true;
                    if (event.night) event.goto(4);
                    'step 1'
                    if (event.day) {
                        var check;
                        var i, num = game.countPlayer(function (current) {
                            return current != player && current.countCards('h') && get.attitude(player, current) <= 0;
                        });
                        check = (num >= 2);
                        var max = Math.min(player.hp, game.players.length - 1);
                        player.chooseTarget(get.prompt(event.name), '获得其他至多' + max + '名其他角色一半的手牌', [1, max], function (card, player, target) {
                            return target.countCards('he') > 0 && player != target;
                        }, function (target) {
                            if (!_status.event.aicheck) return 0;
                            var att = get.attitude(_status.event.player, target);
                            return 1 - att;
                        }).set('aicheck', check);
                    } else event.finish();
                    'step 2'
                    if (result.targets) {
                        event.targets = result.targets;
                        event.num = 0;
                    } else event.finish();
                    'step 3'
                    var num = Math.ceil(event.targets[event.num].getCards('he').length / 2);
                    player.gainPlayerCard(event.targets[event.num], num, 'he').source = event.targets[event.num];
                    event.num++;
                    if (event.num < event.targets.length) event.redo();
                    else event.finish();
                    'step 4'
                    var max = Math.min(player.hp, game.players.length - 1);
                    player.chooseTarget(get.prompt(event.name), '对其他至多' + max + '名其他角色造成其体力值一半的伤害', [1, max], function (card, player, target) {
                        return target != player;
                    }).set('ai', function (target) {
                        var player = _status.event.player;
                        return get.damageEffect(target, player, player);
                    });
                    'step 5'
                    if (result.targets) {
                        event.targets = result.targets;
                        event.num = 0;
                    } else event.finish();
                    'step 6'
                    var num = Math.ceil(event.targets[event.num].hp / 2);
                    event.targets[event.num].damage(num);
                    event.num++;
                    if (event.num < event.targets.length) event.redo();
                    else event.finish();
                },
            },
            ymdanzhan: {
                audio: 'drlt_zhiti',
                trigger: {
                    player: "gainEnd",
                    source: 'damageEnd',
                },
                filter: function (event, player, name) {
                    if (player != _status.currentPhase) return false;
                    if (name == 'gainEnd') return event.source && event.source.isAlive() && event.source != player;
                    if (name == 'damageEnd') return event.player && event.player.isAlive() && event.player != player;
                    return false;
                },
                check: function (event, player) {
                    return get.attitude(player, event.source) &gt; 0;
                },
                forced: true,
                content: function () {
                    var name = event.triggername;
                    if (name == 'gainEnd') {
                        var card = trigger.source.getCards('he').randomGet();
                        trigger.source.discard(card);
                    }
                    if (name == 'damageEnd') trigger.player.loseHp();
                },
            },
            ymrende: {
                audio: 'rerende',
                enable: "phaseUse",
                filterCard: true,
                selectCard: [1, Infinity],
                discard: false,
                lose: false,
                delay: 0,
                filterTarget: function (card, player, target) {
                    return player != target;
                },
                check: function (card) {
                    if (ui.selected.cards.length > 1) return 0;
                    if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') return 0;
                    if (!ui.selected.cards.length && card.name == 'du') return 20;
                    var player = get.owner(card);
                    if (player.hp == player.maxHp || player.countCards('h') <= 1) {
                        if (ui.selected.cards.length) {
                            return -1;
                        }
                        var players = game.filterPlayer();
                        for (var i = 0; i < players.length; i++) {
                            if (players[i].hasSkill('haoshi') && !players[i].isTurnedOver() && !players[i].hasJudge('lebu') && get.attitude(player, players[i]) >= 3 && get.attitude(players[i], player) >= 3) {
                                return 11 - get.value(card);
                            }
                        }
                        if (player.countCards('h') > player.hp) return 10 - get.value(card);
                        if (player.countCards('h') > 2) return 6 - get.value(card);
                        return -1;
                    }
                    return 10 - get.value(card);
                },
                content: function () {
                    target.gain(cards, player, 'giveAuto');
                    if ((player.getStat().skill.ymrende || 0) <= 1) {
                        player.draw(cards.length);
                        player.recover();
                    }
                },
                ai: {
                    order: function (skill, player) {
                        if (player.hp < player.maxHp && player.storage.ymrende < 2 && player.countCards('h') > 1) {
                            return 10;
                        }
                        return 1;
                    },
                    result: {
                        target: function (player, target) {
                            if (target.hasSkillTag('nogain')) return 0;
                            if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') {
                                if (target.hasSkillTag('nodu')) return 0;
                                return -10;
                            }
                            if (target.hasJudge('lebu')) return 0;
                            var nh = target.countCards('h');
                            var np = player.countCards('h');
                            if (player.hp == player.maxHp || player.storage.rende < 0 || player.countCards('h') <= 1) {
                                if (nh >= np - 1 && np <= player.hp && !target.hasSkill('haoshi')) return 0;
                            }
                            return Math.max(1, 5 - nh);
                        },
                    },
                    effect: {
                        target: function (card, player, target) {
                            if (player == target && get.type(card) == 'equip') {
                                if (player.countCards('e', {subtype: get.subtype(card)})) {
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
                group: ['ymrende_gain', 'ymrende_delete'],
                global: 'ymrende_mod',
                subSkill: {
                    gain: {
                        direct: true,
                        trigger: {
                            global: 'gainEnd',
                        },
                        filter: function (event, player) {
                            return event.cards&&event.cards.length > 0 && event.source == player;
                        },
                        content: function () {
                            'step 0'
                            var list = [];
                            for (var i = 0; i < lib.inpile.length; i++) {
                                var name = lib.inpile[i];
                                if (name == 'sha') {
                                    list.add(['基本', '', 'sha']);
                                    list.add(['基本 ', '', 'sha', 'fire']);
                                    list.add(['基本', '', 'sha', 'thunder']);
                                    list.add(['基本', '', 'sha', 'ice']);
                                    list.add(['基本', '', 'sha', 'kami']);
                                } else if (get.type(name) == 'trick') list.add(['锦囊', '', name]);
                                else if (get.type(name) == 'basic') list.add(['基本', '', name]);
                            }
                            var dialog;
                            if (list.length == 0) {
                                dialog = ui.create.dialog('【仁德】无可选牌');
                            }
                            dialog = ui.create.dialog('仁德', [list, 'vcard']);
                            player.chooseButton(dialog).ai = function (button) {
                                if (get.attitude(player, trigger.player) <= 0) return -get.value(button.link, trigger.player);
                                return get.value({name: button.link[2]}, trigger.player);
                            }
                            'step 1'
                            if (result.bool) {
                                var tran = get.translation(result.links[0][3] || '') + get.translation(result.links[0][2] || '')
                                game.log(player, '声明了', tran);
                                player.popup(tran);
                                if (!trigger.player.storage.ymrende1) trigger.player.storage.ymrende1 = [];
                                trigger.player.storage.ymrende1.addArray(trigger.cards);
                                trigger.player.storage.ymrende2 = result.links;
                                player.logSkill('ymrende');
                            }
                        },
                    },
                    "delete": {
                        trigger: {
                            player: 'phaseBegin',
                        },
                        forced: true,
                        popup: false,
                        silent: true,
                        content: function () {
                            game.findPlayer2(function (current) {
                                if (current.storage.ymrende1 || current.storage.ymrende2) {
                                    delete current.storage.ymrende1;
                                    delete current.storage.ymrende2;
                                }
                            });
                        },
                    },
                    mod: {
                        mod: {
                            cardname: function (card, player, name) {
                                if(game.hasPlayer(function(current){
                                    return current.hasSkill('ymrende');
                                })){
                                    var list = player.storage.ymrende1;
                                    if (list && list.length) {
                                        for (var i = 0; i < list.length; i++) {
                                            if (list.contains(card)) return player.storage.ymrende2[0][2];
                                        }
                                    }
                                }
                            },
                            cardnature: function (card, player, name) {
                                if(game.hasPlayer(function(current){
                                    return current.hasSkill('ymrende');
                                })){
                                    var list = player.storage.ymrende1;
                                    if (list && list.length) {
                                        for (var i = 0; i < list.length; i++) {
                                            if (list.contains(card)) return player.storage.ymrende2[0][3];
                                        }
                                    }
                                }
                            },
                        },
                    },
                },
            },
            ymjieyi: {
                trigger: {
                    global: ['gameStart', 'dieAfter'],
                    player: 'phaseBegin',
                },
                forced: true,
                audio: 'nzry_jieying',
                filter: function (event, player, name) {
                    if (name == 'dieAfter') return event.player.hasSkill('ymjieyi_mark');
                    else return true;
                },
                content: function () {
                    'step 0'
                    var num = [0, 2];
                    if (event.triggername == 'dieAfter') num = [0, 1];
                    game.findPlayer2(function (current) {
                        if (current.hasSkill('ymjieyi_mark') && current != player) current.removeSkill('ymjieyi_mark');
                    });
                    player.chooseTarget(num, true, get.prompt(event.name), '选择角色获得“结义”标记', function (card, player, target) {
                        return target != player && !target.hasSkill('ymjieyi_mark');
                    }).set('ai', function (target) {
                        var player = _status.event.player;
                        return get.attitude(player, target) > 0;
                    });
                    'step 1'
                    if (result.bool) {
                        player.addSkill('ymjieyi_mark');
                        for (var i = 0; i < result.targets.length; i++) {
                            result.targets[i].addSkill('ymjieyi_mark');
                        }
                    }
                },
                subSkill: {
                    mark: {
                        trigger: {
                            global: 'useCardAfter',
                            player: 'die',
                        },
                        forced: true,
                        forceDie: true,
                        mark: true,
                        marktext: '结',
                        intro: {
                            name: '结义',
                            content: function (storage, player, skill) {
                                var str = '与你结义的角色：'
                                var target = [];
                                game.findPlayer2(function (current) {
                                    if (current.hasSkill('ymjieyi_mark') && current != player) target.add(current);
                                });
                                str += ('<br><li>' + get.translation(target));
                                return str;
                            },
                        },
                        filter: function (event, player, name) {
                            if (name == 'dieAfter') player.removeSkill('ymjieyi_mark');
                            if (!['basic', 'trick'].contains(get.type(event.card))) return false;
                            if (!event.targets) return false;
                            if (event.targets.length == 1 && !event.targets[0].isAlive()) return false;
                            if (event.card.ymjieyi) return false;
                            if (!event.player.hasSkill('ymjieyi_mark')) return false;
                            for (var i = 0; i < event.targets.length; i++) {
                                if (!event.targets[i].hasSkill('ymjieyi_mark')) {
                                    return true;
                                    break;
                                }
                            }
                            return false;
                        },
                        content: function () {
                            event.targets = trigger.targets.slice(0);
                            game.findPlayer2(function (current) {
                                if (current.hasSkill('ymjieyi_mark')) event.targets.remove(current);
                                if (!current.isAlive()) event.targets.remove(current);
                            });
                            player.useCard({
                                name: trigger.card.name,
                                nature: trigger.card.nature,
                                suit: get.suit(trigger.card),
                                isCard: true
                            }, false, event.targets, false).card.ymjieyi = true;
                        },
                    },
                },
            },
            ymguose: {
                trigger: {
                    player: "phaseEnd",
                },
                filter: function (event, player) {
                    return player.countCards('hes') > 0;
                },
                audio: 'yanxiao',
                direct: true,
                content: function () {
                    'step 0'
                    player.chooseCardTarget({
                        prompt: get.prompt('ymguose'),
                        filterCard: true,
                        position: 'hes',
                        selectCard: 1,
                        filterTarget: function (card, player, target) {
                            var list = [];
                            for (var i = 0; i < lib.inpile.length; i++) {
                                var info = lib.card[lib.inpile[i]];
                                if (info.type == 'delay') {
                                    list.push(lib.inpile[i]);
                                }
                            }
                            return target != player && target.countCards('j') < list.length;
                        },
                        ai1: function (card) {
                            return 7 - get.value(card);
                        },
                        ai2: function (target) {
                            return get.effect(target, {name: 'lebu'}, player, player);
                        }
                    });
                    'step 1'
                    if (result.bool) {
                        player.logSkill('ymguose');
                        var target = result.targets[0];
                        var list = [];
                        for (var i = 0; i < lib.inpile.length; i++) {
                            var info = lib.card[lib.inpile[i]];
                            if (info.type == 'delay' && !target.hasJudge(lib.inpile[i])) {
                                list.push(lib.inpile[i]);
                            }
                        }
                        if (list.length) {
                            player.useCard({name: list.randomGet(), isCard: true}, result.cards, target)
                        }
                    }
                },
                ai: {
                    threaten: 1.5,
                },
                group: ['ymguose_useCard', 'ymguose_judge'],
                subSkill: {
                    useCard: {
                        trigger: {
                            player: ['useCard'],
                        },
                        silent: true,
                        popup: false,
                        forced: true,
                        filter: function (event, player) {
                            return get.type(event.card) == 'delay' && !event.targets.contains(player);
                        },
                        content: function () {
                            player.logSkill(event.name);
                            for (var i = 0; i < trigger.cards.length; i++) {
                                trigger.cards[i].storage.QYjudge = true;
                                trigger.cards[i].storage.nowuxie = true;
                                trigger.cards[i].expired = true;
                            }
                        },
                    },
                    judge: {
                        trigger: {
                            global: ['cardsDiscardBefore', "equipBefore", "addJudgeBefore", "gainBefore", "loseAsyncBefore", "loseBefore"],
                        },
                        init: function (player) {
                            game.countPlayer2(current => {
                                current.node.judges.addEventListener('DOMNodeRemoved', function (event) {
                                    if (_status.event.name === 'judge' || _status.event.name === 'addJudge' || _status.event.name === 'die') return false;
                                    if (get.itemtype(event.target) === 'card') {
                                        delete event.target.storage.QYjudge;
                                        delete event.target.storage.nowuxie;
                                        delete event.target.expired;
                                    } else {
                                        for (let pathElement of event.path) {
                                            if (get.itemtype(pathElement) === 'card') {
                                                delete pathElement.storage.QYjudge;
                                                delete pathElement.storage.nowuxie;
                                                delete pathElement.expired;
                                                break;
                                            }
                                        }
                                    }
                                }, true);
                            });
                        },
                        filter: function (event, player) {
                            //if (!event.cards) return false;
                            //if(event.parent.name!='phaseJudge') return false;
                            if (event.cards && event.cards.length) {
                                for (var i = 0; i < event.cards.length; i++) {
                                    return event.cards[i].storage.QYjudge == true;
                                }
                            }
                            if (event.card) return event.card.storage.QYjudge == true;
                            return false;
                        },
                        silent: true,
                        popup: false,
                        forced: true,
                        content: function () {
                            if (trigger.parent.name == 'phaseJudge') {
                                trigger.untrigger();
                                trigger.finish();
                                if (trigger.card) {
                                    trigger.card.storage.QYjudge = true;
                                    trigger.card.storage.nowuxie = true;
                                    trigger.card.expired = true;
                                }
                                if (trigger.cards && trigger.cards.length) {
                                    for (var i = 0; i < trigger.cards.length; i++) {
                                        trigger.cards[i].storage.QYjudge = true;
                                        trigger.cards[i].storage.nowuxie = true;
                                        trigger.cards[i].expired = true;
                                    }
                                }
                            } else if (trigger.type == 'discard' || trigger.type == 'gain') {
                                var list = [];
                                for (var i = 0; i < trigger.cards.length; i++) {
                                    if (trigger.cards[i].storage.QYjudge == true) {
                                        var card = game.createCard({
                                            name: trigger.cards[i].viewAs || trigger.cards[i].name,
                                            number: trigger.cards[i].number,
                                            suit: trigger.cards[i].suit
                                        });
                                        list.push(card);
                                    }
                                }
                                player.gain(list, 'gain2');
                            }
                        },
                    },
                },
            },
            ymliuli: {
                trigger: {
                    global: 'phaseBegin',
                },
                audio: 'liuli',
                filter: function (event, player) {
                    return event.player.countCards('j') > 0;
                },
                check: function (event, player) {
                    return get.attitude(event.player, player) > 0;
                },
                content: function () {
                    player.gain(trigger.player.getCards('j'), trigger.player, 'giveAuto');
                },
                group: 'ymliuli_target',
                subSkill: {
                    target: {
                        trigger: {
                            target: 'useCardToPlayer',
                        },
                        audio: 'liuli',
                        filter: function (event, player) {
                            if (get.type(event.card) == 'delay') return false;
                            if (get.type(event.card) == 'equip') return false;
                            if (event.addedTargets) return false;
                            var goon = false;
                            if (event.targets) {
                                var players = game.filterPlayer();
                                for (var i = 0; i < players.length; i++) {
                                    if (lib.filter.targetEnabled2(event.card, player, players[i]) && !event.targets.contains(players[i])) {
                                        goon = true;
                                        break;
                                    }
                                }
                            }
                            return goon == true && event.player != player;
                        },
                        content: function () {
                            'step 0'
                            player.chooseTarget([1, Infinity], '流离：是否指定任意名其他角色也成为此牌的目标?', function (card, player, target) {
                                var trigger = _status.event;
                                if (trigger.targets.contains(target)) return false;
                                return lib.filter.targetEnabled2(trigger.card, _status.event.player, target);
                            }).set('ai', function (target) {
                                var trigger = _status.event.getTrigger();
                                var player = _status.event.player;
                                return get.effect(target, trigger.card, player, player);
                            }).set('targets', trigger.targets).set('card', trigger.card);
                            'step 1'
                            if (result.targets) {
                                for (var i = 0; i < result.targets.length; i++) {
                                    trigger.targets.add(result.targets[i]);
                                }
                            }
                            if (player.getHistory('gain', function (evt) {
                                return evt.getParent(2).name == 'ymliuli_target';
                            }).length == 0) {
                                player.draw(trigger.targets.length);
                                player.recover();
                            }
                        },
                    },
                },
            },
            ymlianhuan: {
                trigger: {
                    player: ['phaseBegin', 'phaseEnd'],
                },
                audio: 'lianhuan1',
                direct: true,
                content: function () {
                    'step 0'
                    var name = event.triggername;
                    if (name == 'phaseBegin') {
                        var num = 2 + (player.storage.ymlianhuan || 0);
                        player.chooseTarget([1, num], get.prompt2(event.name), '选择至多' + num + '名角色进入横置状态', function (card, player, target) {
                            return !target.isLinked();
                        }).set('ai', function (target) {
                            var player = _status.event.player;
                            return get.damageEffect(target, player, player);
                        });
                    } else event.goto(2);
                    'step 1'
                    if (result.targets) {
                        player.logSkill(event.name,result.targets);
                        for (var i = 0; i < result.targets.length; i++) {
                            if (!result.targets[i].isLinked()) result.targets[i].link();
                        }
                    }
                    event.finish();
                    'step 2'
                    var num = 1 + (player.storage.ymlianhuan || 0);
                    player.chooseTarget(1, get.prompt2(event.name), '选择1名横置的角色受到' + num + '点随机属性伤害', function (card, player, target) {
                        return target.isLinked();
                    }).set('ai', function (target) {
                        var player = _status.event.player;
                        return get.damageEffect(target, player, player);
                    });
                    'step 3'
                    if (result.targets) {
                        player.logSkill(event.name,result.targets);
                        var num = 1 + (player.storage.ymlianhuan || 0);
                        result.targets[0].damage(num).nature = lib.linked.randomGet();
                    }
                },
                intro: {
                    name: '连环·强化',
                    content: function (storage) {
                        return '选择横置的角色或造成的伤害+' + storage;
                    },
                },
                group: 'ymlianhuan_damage',
                subSkill: {
                    damage: {
                        trigger: {
                            global: 'damageEnd',
                        },
                        forced: true,
                        silent: true,
                        popup: false,
                        filter: function (event, player) {
                            if (!event.nature) return false;
                            var num = 0;
                            game.findPlayer2(function (current) {
                                num += current.getHistory('damage', function (evt) {
                                    return evt.nature;
                                }).length > 0;
                            });
                            return num <= 1;
                        },
                        content: function () {
                            player.logSkill('ymlianhuan');
                            player.draw(3);
                        },
                    },
                },
            },
            ymniepan: {
                trigger: {
                    player: 'dying',
                },
                skillAnimation: true,
                animationColor: "fire",
                audio: 'niepan',
                juexingji: true,
                forced: true,
                mark: true,
                content: function () {
                    'step 0'
                    player.awakenSkill(event.name);
                    player.storage[event.name] = true;
                    player.storage.ymniepan_awoken = 2 - player.hp;
                    player.maxHp = 2;
                    player.hp = 2;
                    player.update();
                    event.target = game.players.slice(0);
                    event.target.remove(player);
                    event.num = 0;
                    event.count = 0;
                    'step 1'
                    if (event.target[event.num].countCards('hej') > 0) player.gainPlayerCard(event.target[event.num], 'hej', [0, 2], true);
                    'step 2'
                    event.count += (result.cards.length || 0);
                    event.num++;
                    if (event.num < event.target.length) event.goto(1);
                    'step 3'
                    player.draw(2 * event.target.length - event.count);
                    for (var i = 0; i < event.target.length; i++) {
                        event.target[i].damage().nature = lib.linked.randomGet();
                    }
                    player.addSkill('ymniepan_awoken');
                },
                intro: {
                    content: "limited",
                },
                subSkill: {
                    awoken: {
                        trigger: {
                            player: 'phaseBegin',
                        },
                        forced: true,
                        silent: true,
                        popup: false,
                        filter: function (event, player) {
                            return player.storage.ymniepan_awoken && player.storage.ymniepan_awoken > 0;
                        },
                        onremove: function (player) {
                            player.unmarkSkill('ymniepan_awoken');
                            delete player.storage.ymniepan_awoken;
                        },
                        content: function () {
                            player.gainMaxHp();
                            player.recover();
                            if (!player.storage.ymlianhuan) player.storage.ymlianhuan = 0;
                            player.storage.ymlianhuan++;
                            if (player.hasSkill('ymlianhuan')) player.markSkill('ymlianhuan');
                            if (player.storage.ymniepan_awoken) player.storage.ymniepan_awoken--;
                            if (player.storage.ymniepan_awoken <= 0) player.removeSkill(event.name);
                        },
                        mark: true,
                        marktext: '槃',
                        intro: {
                            name: '涅槃·强化',
                            content: function (storage) {
                                return '剩余涅槃次数：+' + storage;
                            },
                        },
                    },
                },
            },
            ymxiaoji: {
                enable: 'phaseUse',
                usable: 2,
                audio: 'xiaoji',
                locked: true,
                filter: function (event, player) {
                    var he = player.getCards('h');
                    var num = 0;
                    for (var i = 0; i < he.length; i++) {
                        var info = lib.card[he[i].name];
                        if (info.type != 'equip' && lib.inpile.contains(he[i].name)) {
                            num++;
                            if (num >= 1) return true;
                        }
                    }
                },
                filterCard: function (card) {
                    return get.type(card) != 'equip';
                },
                discard: false,
                lose: false,
                delay: false,
                check: function (card) {
                    return 8-get.value(card);
                },
                content: function () {
                    'step 0'
                    var list = [];
                    for (var i of lib.inpile) {
                        if (lib.card[i].compound) continue;
                        if (lib.card[i]&&lib.card[i].ai&&lib.card[i].ai.result&&lib.card[i].ai.result.keepAI) continue;
                        if (get.type(i) == 'equip') list.push(['装备', '', i]);
                    }
                    var dialog = ui.create.dialog('枭姬', [list, 'vcard']);
                    player.chooseButton(dialog).ai = function (button) {
                        var name = button.link[2];
                        var player = _status.event.player;
                        var num = 1;
                        if(player.countCards('hes',name)>0) return 0;
                        if(player.getEquip(name)) return 0;
                        if(!player.isEmpty(get.subtype(name))) num--;
                        //if(lib.card[name].ai&&lib.card[name].ai.result&&lib.card[name].ai.result.keepAI) return 0;
                        var value=player.getUseValue(name);
                        if(num>0) return value;
                    }
                    'step 1'
                    if (result.links) {
                        var name = result.links[0][2];
                        var info1 = lib.card[name];
                        if (info1) {
                            var info = {
                                enable: true,
                                type: 'equip',
                                subtype: get.subtype(result.links[0][2]),
                                vanish: true,
                                cardimage: cards[0].name,
                                filterTarget: function (card, player, target) {
                                    return target == player;
                                },
                                unique: true,
                                compound: true,
                                selectTarget: -1,
                                modTarget: true,
                                toself: true,
                                content: lib.element.content.equipCard,
                                legend: true,
                                source: [cards[0].name, name],
                                onEquip: [],
                                onLose: [function () {
                                    var info = Object.assign(lib.card[card.name]);
                                    delete lib.card[card.name];
                                    delete lib.translate[card.name];
                                    delete lib.translate[card.name + "_info"];
                                    card.init([card.suit, card.number, info.source[0], card.nature]);
                                    //card.init(Object.assign(info, {name: info.source[0]}));
                                }],
                                skills: [],
                                distance: {},
                                ai: {
                                    order: 8.9,
                                    equipValue: 10,
                                    useful: 2.5,
                                    value: function (card, player) {
                                        var value = 0;
                                        var info = get.info(card);
                                        var current = player.getEquip(info.subtype);
                                        if (current && card != current) {
                                            value = get.value(current, player);
                                        }
                                        var equipValue = info.ai.equipValue || info.ai.basic.equipValue;
                                        if (typeof equipValue == 'function') return equipValue(card, player) - value;
                                        return equipValue - value;
                                    },
                                    result: {
                                        target: function (player, target) {
                                            return get.equipResult(player, target, name);
                                        }
                                    }
                                }
                            }
                            if (typeof info1.distance === 'object' && info1.distance !== null) Object.assign(info.distance, info1.distance);
                            if (info1.skills) {
                                info.skills = info.skills.concat(info1.skills);
                            }
                            if (info1.onEquip) {
                                if (Array.isArray(info1.onEquip)) {
                                    info.onEquip = info.onEquip.concat(info1.onEquip);
                                } else {
                                    info.onEquip.push(info1.onEquip);
                                }
                            }
                            if (info1.onLose) {
                                if (Array.isArray(info1.onLose)) {
                                    info.onLose = info.onLose.concat(info1.onLose);
                                } else {
                                    info.onLose.push(info1.onLose);
                                }
                            }
                            if (info.onEquip.length == 0) delete info.onEquip;
                            if (info.onLose.length == 0) delete info.onLose;
                            var newName = 'qyCreateCard_' + get.id() + '_' + name;
                            var changename = get.translation(cards[0].name).slice(0, 2) + '·' + get.translation(name).slice(0, 4);
                            lib.card[newName] = info;
                            lib.translate[newName] = changename;
                            lib.translate[newName + '_info'] = get.translation(name, 'info');
                            try {
                                game.addVideo('newcard', null, {
                                    name: name,
                                    translate: lib.translate[newName],
                                    info: lib.translate[newName + '_info'],
                                    // card:name.name,
                                    legend: true,
                                });
                            } catch (e) {
                                console.log(e);
                            }
                        }
                        var card = cards[0].init({
                            name: newName,
                            suit: cards[0].suit,
                            number: cards[0].number
                        });
                        if (lib.config.background_audio) {
                            game.playAudio('..', 'audio', 'card', player.sex, name);
                        }
                        game.addVideo('equip', player, get.cardInfo(card));
                        player.useCard(card, player);
                        //game.log(player, '将', cards, '视为', card, '使用');
                    }
                },
                ai: {
                    order: 9.5,
                    result: {
                        player: function (player) {
                            var num = 0;
                            for (var i = 1; i <= 5; i++) {
                                if (player.getEquip(i)) {
                                    num++;
                                }
                            }
                            return 1+num;
                        },
                    }
                },
                group: 'ymxiaoji_equip',
                subSkill: {
                    equip: {
                        trigger: {
                            player: "equipBegin",
                        },
                        filter: function (event, player) {
                            var types = get.subtype(event.card);
                            return player.countCards('e', {subtype: types});
                        },
                        popup: false,
                        unique: true,
                        forced: true,
                        lastDo: true,
                        content: function () {
                            "step 0"
                            trigger.untrigger();
                            trigger.finish();
                            var card = trigger.card;
                            if (card.clone) {
                                game.broadcast(function (card, player) {
                                    if (card.clone) {
                                        card.clone.moveDelete(player);
                                    }
                                }, card, player);
                                card.clone.moveDelete(player);
                                game.addVideo('gain2', player, get.cardsInfo([card.clone]));
                            }
                            if (lib.config.background_audio) {
                                game.playAudio('effect', get.subtype(trigger.card));
                            }
                            player.$equip(trigger.card);
                            game.addVideo('equip', player, get.cardInfo(trigger.card));
                            game.log(player, '装备了', trigger.card);
                            "step 1"
                            var info = get.info(trigger.card, false);
                            if (info.onEquip && (!info.filterEquip || info.filterEquip(card, player))) {
                                if (Array.isArray(info.onEquip)) {
                                    for (var i = 0; i < info.onEquip.length; i++) {
                                        var next = game.createEvent('equip_' + trigger.card.name);
                                        next.setContent(info.onEquip[i]);
                                        next.player = player;
                                        next.card = trigger.card;
                                    }
                                } else {
                                    var next = game.createEvent('equip_' + trigger.card.name);
                                    next.setContent(info.onEquip);
                                    next.player = player;
                                    next.card = trigger.card;
                                }
                                if (info.equipDelay != 'false') game.delayx();
                            }
                            delete player.equiping;
                            if (event.delay) {
                                game.delayx();
                            }
                        },
                    },
                },
            },
            ymjieyin: {
                usable: 1,
                audio: 'rejieyin',
                trigger: {
                    player: ['loseEnd'],
                    global: ['loseAsyncEnd', 'equipEnd', 'gainEnd', 'addJudgeEnd'],
                },
                filter: function (event, player, name) {
                    var evt = event.getl(player);
                    if (evt && evt.player == player && evt.es && evt.es.length > 0) return true;
                    if (event.cards && event.cards.length) {
                        for (var i = 0; i < event.cards.length; i++) {
                            return get.type(event.cards[i]) == 'equip' && evt && evt.player == player;
                        }
                    } else if (event.card) return get.type(event.card) == 'equip';
                    return false;
                },
                direct: true,
                content: function () {
                    'step 0'
                    event.num = 0;
                    event.num += trigger.getl(player).es.length;
                    if (trigger.cards && trigger.cards.length) {
                        for (var i = 0; i < trigger.cards.length; i++) {
                            if (get.type(trigger.cards[i]) == 'equip') event.num++;
                        }
                    } else if (get.type(trigger.card) == 'equip') event.num++;
                    'step 1'
                    player.chooseTarget(get.prompt2(event.name), function (card, player, target) {
                        return true;
                    }).set('ai', function (target) {
                        var player = _status.event.player;
                        return get.recoverEffect(target, player, player) || get.attitude(target, player) > 0;
                    });
                    'step 2'
                    if (result.bool) {
                        result.targets[0].recover();
                        result.targets[0].draw();
                        player.draw();
                        event.num--;
                        if (event.num > 0) event.goto(1);
                        else event.finish();
                    } else event.finish();
                },
            },
            ymliangzhu: {
                trigger: {
                    global: ['recoverEnd', 'damageEnd'],
                },
                audio: 'liangzhu',
                direct: true,
                filter: function (event, player, name) {
                    if (name == 'damageEnd') return event.source && event.source.isAlive();
                    if (name == 'recoverEnd') return true;
                    return false;
                },
                content: function () {
                    'step 0'
                    var name = event.triggername;
                    var source;
                    if (name == 'recoverEnd') source = trigger.player;
                    if (name == 'damageEnd') source = trigger.source;
                    player.chooseBool(get.prompt2(event.name), '是否令<span style="color: red">' + get.translation(source) + '</span>重置【杀】和【酒】的使用次数并摸一张牌？').set('ai', function () {
                        var player = _status.event.player;
                        if (get.attitude(player, source) > 0) return true;
                        return false;
                    });
                    'step 1'
                    if (result.bool) {
                        player.logSkill(event.name);
                        var name = event.triggername;
                        if (name == 'recoverEnd') {
                            trigger.player.draw();
                            if (trigger.addCount !== false) {
                                trigger.addCount = false;
                                trigger.player.getStat().card.sha = 0;
                                trigger.player.getStat().card.jiu = 0;
                            }
                        }
                        if (name == 'damageEnd') {
                            trigger.source.draw();
                            if (trigger.addCount !== false) {
                                trigger.addCount = false;
                                trigger.source.getStat().card.sha = 0;
                                trigger.source.getStat().card.jiu = 0;
                            }
                        }
                    }
                },
            },
            ymganglie: {
                audio: 'ganglie',
                trigger: {
                    player: "damageEnd",
                },
                filter: function (event, player) {
                    if (event.source == player) return false;
                    return (event.source != undefined && event.num > 0);
                },
                check: function (event, player) {
                    return (get.attitude(player, event.source) <= 0);
                },
                logTarget: "source",
                content: function () {
                    "step 0"
                    event.num = trigger.num || 1;
                    event.cards = [];
                    event.red = 0;
                    event.black = 0;
                    "step 1"
                    player.judge();
                    "step 2"
                    event.cards.add(result.card);
                    if (result.color == 'black') {
                        event.black++;
                        if (trigger.source.countCards('he') > 0) {
                            player.discardPlayerCard(trigger.source, 'he', 2, true);
                        }
                    }
                    if (result.color == 'red') {
                        event.red++;
                        if (trigger.source.isAlive()) {
                            trigger.source.damage();
                        }
                    }
                    'step 3'
                    event.num--;
                    if (event.num > 0) {
                        player.chooseBool(get.prompt2(event.name));
                    } else {
                        event.goto(5);
                    }
                    "step 4"
                    if (result.bool) {
                        event.goto(1);
                    }
                    'step 5'
                    player.gain(event.cards, 'gain2');
                    if (event.black >= event.red) player.recover();
                    if (event.red >= event.black) player.draw(2);
                    if (!trigger.source.isAlive()) player.gainMaxHp();
                    if (trigger.source.countCards('he') <= 0) player.gainMaxHp();
                    if (!event.remake && trigger.source.isIn()) {
                        player.chooseBool(get.prompt2(event.name), '是否失去一点体力重新发动此技能？').set('ai', function () {
                            var player = _status.event.player;
                            if (player.hp > 2) return true;
                            if (player.hp > 1 && trigger.source.hp < 2) return true;
                            return false;
                        });
                    } else event.finish();
                    'step 6'
                    if (result.bool) {
                        event.remake = true;
                        player.loseHp();
                        game.log(player, '重新发动了', event.name);
                        player.logSkill(event.name, trigger.source);
                        event.goto(0);
                    }
                },
                ai: {
                    "maixie_defend": true,
                    expose: 0.4,
                },
            },
            ymxunshu: {
                audio: 'qingjian',
                usable: 1,
                trigger: {
                    global: ['damageBegin3', 'loseHpBegin'],
                },
                filter: function (event, player) {
                    if (event.source && event.source == player) return false;
                    return event.num >= event.player.hp && event.player.maxHp > 0;
                },
                check: function (event, player) {
                    return (get.attitude(player, event.source) > 0 && player.maxHp > 1);
                },
                content: function () {
                    'step 0'
                    player.loseMaxHp();
                    trigger.cancel();
                    if (get.itemtype(trigger.cards) == 'cards' && get.position(trigger.cards[0], true) == 'o') player.gain(trigger.cards, 'gain2');
                    player.chooseTarget(get.prompt(event.name), '选择1名其他角色对其发动一次【刚烈】', function (card, player, target) {
                        return target != player;
                    }).set('ai', function (target) {
                        var player = _status.event.player;
                        return get.damageEffect(target, player, player);
                    });
                    'step 1'
                    if (result.targets) {
                        var next = game.createEvent('ymxunshu_ymganglie');
                        lib.translate['ymxunshu_ymganglie'] = '勋书·刚烈';
                        next.player = player;
                        next._trigger = {source: result.targets[0], num: 1}
                        next.setContent(lib.skill.ymganglie.content);
                    }
                },
            },
            ymshimu: {
                skillAnimation: true,
                animationColor: "fire",
                audio: 'reganglie',
                mark: true,
                limited: true,
                intro: {
                    content: "limited",
                },
                check: function (event, player) {
                    return (get.attitude(player, event.source) <= 0);
                },
                trigger: {
                    source: 'damageBegin',
                },
                filter: function (event, player) {
                    if (player.storage.ymshimu) return false;
                    if (player.hp >= player.maxHp / 2) return false;
                    if (event.player == player) return false;
                    return !event.player.nodying && !event.player.isDying() && event.player.isAlive() && !event.pure;
                },
                content: function () {
                    'step 0'
                    player.awakenSkill(event.name);
                    player.storage[event.name] = true;
                    trigger.cancel();
                    var next = game.createEvent('dying');
                    next.player = trigger.player;
                    next.reason = trigger;
                    next.source = player;
                    next.setContent(lib.skill.ymshimu.dying);
                    'step 1'
                    if (trigger.player.isAlive()) {
                        player.storage[event.name] = false;
                        player.restoreSkill(event.name);
                    }
                },
                dying: function () {
                    "step 0"
                    event.forceDie = true;
                    event.ori = player.hp;
                    if (player.isDying()) {
                        event.finish();
                        return;
                    }
                    _status.dying.unshift(player);
                    game.broadcast(function (list) {
                        _status.dying = list;
                    }, _status.dying);
                    event.trigger('dying');
                    game.log(player, '濒死');
                    "step 1"
                    if (player.hp > event.ori) {
                        _status.dying.remove(player);
                        game.broadcast(function (list) {
                            _status.dying = list;
                        }, _status.dying);
                        event.finish();
                    } else if (!event.skipTao) {
                        var next = game.createEvent('_save');
                        var start = false;
                        var starts = [_status.currentPhase, event.source, event.player, game.me, game.players[0]];
                        for (var i = 0; i < starts.length; i++) {
                            if (get.itemtype(starts[i]) == 'player') {
                                start = starts[i];
                                break;
                            }
                        }
                        next.player = start;
                        next._trigger = event;
                        next.triggername = '_save';
                        next.ori = event.ori;
                        next.forceDie = true;
                        next.setContent(lib.skill.ymshimu.save);
                    }
                    "step 2"
                    _status.dying.remove(player);
                    game.broadcast(function (list) {
                        _status.dying = list;
                    }, _status.dying);
                    if (player.hp <= event.ori && !player.nodying) player.die(event.reason);
                },
                save: function () {
                    "step 0"
                    event.dying = trigger.player;
                    if (!event.acted) event.acted = [];
                    "step 1"
                    if (trigger.player.isDead()) {
                        event.finish();
                        return;
                    }
                    event.acted.push(player);
                    var str = get.translation(trigger.player) + '濒死，是否帮助？';
                    var str2 = '当前体力：' + trigger.player.hp;
                    if (lib.config.tao_enemy && event.dying.side != player.side && lib.config.mode != 'identity' && lib.config.mode != 'guozhan' && !event.dying.hasSkillTag('revertsave')) {
                        event._result = {
                            bool: false
                        }
                    } else if (player.canSave(event.dying)) {
                        player.chooseToUse({
                            filterCard: function (card, player, event) {
                                event = event || _status.event;
                                return lib.filter.cardSavable(card, player, event.dying);
                            },
                            filterTarget: trigger.player,
                            prompt: str,
                            prompt2: str2,
                            ai1: function (card) {
                                if (typeof card == 'string') {
                                    var info = get.info(card);
                                    if (info.ai && info.ai.order) {
                                        if (typeof info.ai.order == 'number') {
                                            return info.ai.order;
                                        } else if (typeof info.ai.order == 'function') {
                                            return info.ai.order();
                                        }
                                    }
                                }
                                return 1;
                            },
                            ai2: get.effect_use,
                            type: 'dying',
                            targetRequired: true,
                            dying: event.dying
                        });
                    } else {
                        event._result = {
                            bool: false
                        }
                    }
                    "step 2"
                    if (result.bool) {
                        if (trigger.player.hp <= event.ori && !trigger.player.nodying && trigger.player.isAlive() && !trigger.player.isOut() && !trigger.player.removed) event.goto(0);
                        else trigger.untrigger();
                    } else {
                        for (var i = 0; i < 20; i++) {
                            if (event.acted.contains(event.player.next)) {
                                break;
                            } else {
                                event.player = event.player.next;
                                if (!event.player.isOut()) {
                                    event.goto(1);
                                    break;
                                }
                            }
                        }
                    }
                },
            },
            ymzhanjiang: {
                trigger: {
                    source: 'damageBegin3',
                },
                forced: true,
                audio: 'wushen',
                filter: function (event, player) {
                    var num = 0;
                    num += player.getHistory('sourceDamage').length;
                    return num >= 0;
                },
                content: function () {
                    var num = 0;
                    num += player.getHistory('sourceDamage').length;
                    if (num == 0) trigger.num++;
                    if (num == 1) player.gainPlayerCard(trigger.player, 'he', 1, true);
                    if (num == 2) player.discardPlayerCard(trigger.player, 'he', 2, true);
                    if (num >= 3) player.loseHp();
                },
                group: 'ymzhanjiang_damage',
                subSkill: {
                    damage: {
                        trigger: {
                            source: 'damageBegin1',
                        },
                        filter: function (event, player) {
                            return event.player.hp == event.player.maxHp;
                        },
                        forced: true,
                        silent: true,
                        popup: false,
                        content: function () {
                            trigger.num++;
                        },
                    },
                },
            },
            ymguagu: {
                audio: 'wuhun21',
                derivation: ['wusheng', 'yijue'],
                enable: "phaseUse",
                usable: 1,
                position: "he",
                filterCard: true,
                filter: function (event, player) {
                    return player.hp < player.maxHp;
                },
                check: function (card) {
                    return 6 - get.value(card);
                },
                content: function () {
                    player.recover();
                    var card = cards[0];
                    if (get.color(card) == 'red') {
                        player.actionHistory[player.actionHistory.length - 1].sourceDamage = [];
                        player.addTempSkill('wusheng');
                    }
                    if (get.color(card) == 'black') {
                        player.gainMaxHp();
                        player.draw(2);
                        player.addTempSkill('yijue');
                    }
                    player.stat[player.stat.length - 1].card = {};
                    player.storage.ymguagu_use = [];
                    player.storage.ymguagu_use.add(get.color(card, player));
                    player.addTempSkill('ymguagu_use');
                },
                ai: {
                    order: 1,
                    result: {
                        player: 1,
                    },
                    threaten: 1.5,
                },
                subSkill: {
                    use: {
                        mod: {
                            cardUsable: function (card, player) {
                                var cards = player.storage.ymguagu_use;
                                for (var i = 0; i < cards.length; i++) {
                                    if (cards[i] == get.color(card)) return Infinity;
                                }
                                ;
                            },
                            targetInRange: function (card, player) {
                                var cards = player.storage.ymguagu_use;
                                for (var i = 0; i < cards.length; i++) {
                                    if (cards[i] == get.color(card)) return true;
                                }
                                ;
                            },
                            number: function (card, number) {
                                if (_status.event.player && _status.event.player.storage.ymguagu_use) {
                                    var cards = _status.event.player.storage.ymguagu_use;
                                    for (var i = 0; i < cards.length; i++) {
                                        if (cards[i] == get.color(card)) return Infinity;
                                    }
                                }
                            },
                        },
                        trigger: {
                            player: ["compare", "useCard"],
                            target: "compare",
                        },
                        filter: function (event, player, name) {
                            if (name == "useCard") {
                                var cards = player.storage.ymguagu_use;
                                for (var i = 0; i < cards.length; i++) {
                                    if (cards[i] == get.color(event.card)) return true;
                                }
                                ;
                                return false;
                            }
                            if (event.iwhile) return false;
                            var cards = player.storage.ymguagu_use;
                            if (event.player == player) {
                                for (var i = 0; i < cards.length; i++) {
                                    if (cards[i] == get.color(event.card1)) return true;
                                }
                                ;
                            } else {
                                for (var i = 0; i < cards.length; i++) {
                                    if (cards[i] == get.color(event.card2)) return true;
                                }
                                ;
                            }
                        },
                        silent: true,
                        content: function () {
                            var name = event.triggername;
                            if (name == 'useCard') {
                                if (player.stat[player.stat.length - 1].card[trigger.card.name] > 0) {
                                    player.stat[player.stat.length - 1].card[trigger.card.name]--;
                                }
                            } else {
                                game.log(player, '拼点牌点数为∞');
                                if (player == trigger.player) {
                                    trigger.num1 = Infinity;
                                } else {
                                    trigger.num2 = Infinity;
                                }
                            }
                        },
                        forced: true,
                        popup: false,
                        onremove: true,
                        mark: true,
                        marktext: '骨',
                        intro: {
                            name: '刮骨疗毒',
                            content: function (storage, player, skill) {
                                var str = '点数为∞且无距离并不计入次数限制的卡牌颜色：';
                                str += (storage == 'red' ? '红色' : '黑色');
                                return str;
                            },
                        },
                    },
                },
            },
            ymlongxiang: {
                audio: 'danji',
                trigger: {
                    source: 'dieAfter',
                },
                forced: true,
                markext: '骧',
                intro: {
                    name: '龙骧',
                    content: function (storage) {
                        return '你的牌伤害/回复基础值+' + storage;
                    },
                },
                content: function () {
                    if (!player.storage.ymlongxiang) player.storage.ymlongxiang = 0;
                    player.storage.ymlongxiang++;
                    player.markSkill(event.name);
                },
                group: 'ymlongxiang_usecard',
                subSkill: {
                    usecard: {
                        trigger: {
                            player: ["useCard1", "dyingAfter"],
                        },
                        filter: function (event, player, name) {
                            //if(!player.storage.ymlongxian) return false;
                            if (name == 'dyingAfter') return true;
                            return event.card;
                        },
                        forced: true,
                        popup: false,
                        silent: true,
                        firstDo: true,
                        content: function () {
                            var name = event.triggername;
                            if (name == 'dyingAfter') {
                                player.storage.ymlongxiang = 0;
                                player.unmarkSkill('ymlongxiang');
                            } else {
                                if (!trigger.baseDamage) trigger.baseDamage = 1;
                                trigger.baseDamage += player.storage.ymlongxiang || 0;
                            }
                        },
                    },
                },
            },
            ymquhu: {
                enable: "phaseUse",
                audio: 'quhu',
                usable: 1,
                position: "he",
                filterCard: function (card) {
                    return card.number > 1;
                },
                check: function (card) {
                    return 6 - get.value(card);
                },
                content: function () {
                    'step 0'
                    event.num = cards[0].number;
                    if (event.num > game.players.length) {
                        player.recover();
                        event.num = game.players.length;
                    }
                    player.chooseTarget([2, event.num], get.prompt(event.name), '选择至多' + event.num + '名角色令他们之间随机互相使用一张【决斗】', function (card, player, target) {
                        return true;
                    }).set('ai', function (target) {
                        var player = _status.event.player;
                        return -get.attitude(target, player);
                    });
                    'step 1'
                    if (result.targets) {
                        result.targets.sortBySeat();
                        event.targets = result.targets;
                        event.count = 0;
                    } else event.finish();
                    'step 2'
                    var targets = event.targets.slice(0);
                    var target = event.targets[event.count];
                    targets.remove(target);
                    event.target = targets.randomGet();
                    if (event.target) target.useCard({
                        name: 'juedou',
                        isCard: true
                    }, 'nowuxie', event.target, 'noai');
                    'step 3'
                    event.count++;
                    if (event.target && !event.target.isAlive()) {
                        event.targets.remove(event.target);
                        event.recover = true;
                    }
                    if (event.count < event.targets.length) event.goto(2);
                    'step 4'
                    if (event.recover) {
                        player.gainMaxHp();
                        player.getStat().skill.ymquhu--;
                    }
                },
                ai: {
                    order: 1,
                    result: {
                        player: 1,
                    },
                    threaten: 0.5,
                },
            },
            ymjieming: {
                audio: 'jieming',
                trigger: {
                    player: "damageEnd",
                },
                direct: true,
                content: function () {
                    "step 0"
                    event.count = trigger.num;
                    "step 1"
                    event.count--;
                    player.chooseTarget(get.prompt2(event.name), function (card, player, target) {
                        return true;
                    }).set('ai', function (target) {
                        var att = get.attitude(_status.event.player, target);
                        if (att > 2) {
                            return target.maxHp - target.countCards('h');
                        }
                        return att / 1.5;
                    });
                    "step 2"
                    if (result.bool) {
                        event.num = result.targets[0].countCards('h');
                        if (event.num > 5) event.num = 5;
                        player.logSkill(event.name, result.targets);
                        result.targets[0].drawTo(result.targets[0].maxHp);
                        var card = result.targets[0].getCards('h').randomGets(event.num);
                        event.cards = [];
                        for (var i = 0; i < card.length; i++) {
                            event.cards.push(game.createCard({
                                name: card[i].name,
                                suit: card[i].suit,
                                number: card[i].number,
                                nature: card[i].nature
                            }))
                        }
                        result.targets[0].gain(event.cards, 'gain2');
                        if (event.cards && event.cards.length > 0) result.targets[0].showCards(event.cards);
                        if (event.count) event.goto(1);
                    }
                },
                ai: {
                    maixie: true,
                    "maixie_hp": true,
                    effect: {
                        target: function (card, player, target, current) {
                            if (get.tag(card, 'damage') && target.hp > 1) {
                                if (player.hasSkillTag('jueqing', false, target)) return [1, -2];
                                var max = 0;
                                var players = game.filterPlayer();
                                for (var i = 0; i < players.length; i++) {
                                    if (get.attitude(target, players[i]) > 0) {
                                        max = players[i].hp - players[i].countCards('h');
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
                            if ((card.name == 'tao' || card.name == 'caoyao') && target.hp > 1 && target.countCards('h') <= target.hp) return [0, 0];
                        },
                    },
                },
            },
            ymkonghe: {
                trigger: {
                    player: 'loseEnd',
                },
                audio: 'rejieming',
                forced: true,
                filter: function (event, player) {
                    if (player.countCards('h')) return false;
                    for (var i = 0; i < event.cards.length; i++) {
                        if (event.cards[i].original == 'h') return true;
                    }
                    return false;
                },
                content: function () {
                    player.damage('nosource');
                    player.addTempSkill('ymkonghe_mod');
                },
                subSkill: {
                    mod: {
                        forced: true,
                        charlotte: true,
                        mark: true,
                        intro: {
                            name: '空盒',
                            content: function (storage, player, skill) {
                                return '你不能成为带有「伤害」标签的牌的目标且对你无效';
                            },
                        },
                        trigger: {
                            target: 'useCardToTarget',
                        },
                        filter: function (event, player) {
                            if (get.tag(event.card, 'damage')) return true;
                        },
                        content: function () {
                            trigger.targets.remove(player);
                        },
                        mod: {
                            targetEnabled: function (card, player, target, now) {
                                if (get.tag(card, 'damage')) return false;
                            },
                        },
                    },
                },
            },
            ymjianxiong: {
                enable: "phaseUse",
                audio: 'rejianxiong',
                usable: 1,
                position: "he",
                filterCard: true,
                check: function (card) {
                    return get.value(card);
                },
                filter: function (event, player) {
                    return player.countCards('he') > 0;
                },
                init: function (player) {
                    if (!player.storage.ymjianxiong) player.storage.ymjianxiong = [];
                },
                content: function () {
                    'step 0'
                    if (!Array.isArray(player.storage.ymjianxiong)) player.storage.ymjianxiong = [];
                    var list2 = [];
                    var players = game.players;
                    for (var i = 0; i < players.length; i++) {
                        list2.add(players[i].name);
                        list2.add(players[i].name1);
                        list2.add(players[i].name2);
                    }
                    var ban = ['qy_qycaocao'];
                    var list = Object.keys(lib.character).removeArray(list2.concat(ban.concat(player.storage.ymjianxiong)));
                    player.chooseButton(true).set('ai', function (button) {
                        return get.rank(button.link, true) - lib.character[button.link][2];
                    }).set('createDialog', ['获得一张武将牌作为宝物牌', [list.randomGets(10), 'character']]);
                    'step 1'
                    var name = result.links[0];
                    player.storage.ymjianxiong.push(name);
                    if (!lib.card[name]) {
                        var info = {
                            fullimage: true,
                            enable: true,
                            type: 'equip',
                            subtype: 'equip5',
                            vanish: true,
                            cardimage: lib.character[result.links[0]].name,
                            filterTarget: function (card, player, target) {
                                return target == player;
                            },
                            selectTarget: -1,
                            modTarget: true,
                            toself: true,
                            content: lib.element.content.equipCard,
                            legend: true,
                            source: [result.links[0]],
                            skills: [],
                            onEquip: [function () {
                                var cardInfo = lib.card[card.name];
                                var onMark = function (skill) {
                                    var info = lib.skill[skill];
                                    if (info.init2 && !_status.video) {
                                        info.init2(this, skill);
                                    }
                                    if (info.mark) {
                                        if (info.mark == 'card' &&
                                            get.itemtype(this.storage[skill]) == 'card') {
                                            this.markSkill(skill, null, this.storage[skill]);
                                        } else if (info.mark == 'card' &&
                                            get.itemtype(this.storage[skill]) == 'cards') {
                                            this.markSkill(skill, null, this.storage[skill][0]);
                                        } else if (info.mark == 'image') {
                                            this.markSkill(skill, null, ui.create.card(null, 'noclick').init([null, null, skill]));
                                        } else if (info.mark == 'character') {
                                            var intro = info.intro.content;
                                            if (typeof intro == 'function') {
                                                intro = intro(this.storage[skill], this);
                                            } else if (typeof intro == 'string') {
                                                intro = intro.replace(/#/g, this.storage[skill]);
                                                intro = intro.replace(/&/g, get.cnNumber(this.storage[skill]));
                                                intro = intro.replace(/\$/g, get.translation(this.storage[skill]));
                                            }
                                            var caption;
                                            if (typeof info.intro.name == 'function') {
                                                caption = info.intro.name(this.storage[skill], this);
                                            } else if (typeof info.intro.name == 'string') {
                                                caption = info.name;
                                            } else {
                                                caption = get.translation(skill);
                                            }
                                            this.markSkillCharacter(skill, this.storage[skill], caption, intro);
                                        } else {
                                            this.markSkill(skill);
                                        }
                                    }
                                }.bind(player);
                                cardInfo.skills.map(current => onMark(current));
                            }],
                            onLose: [function () {
                                var cardInfo = lib.card[card.name];
                                cardInfo.skills.map(current => player.unmarkSkill(current));
                            }],
                            ai: {
                                order: 8.9,
                                equipValue: 10,
                                useful: 2.5,
                                value: function (card, player) {
                                    var value = 0;
                                    var info = get.info(card);
                                    var current = player.getEquip(info.subtype);
                                    if (current && card != current) {
                                        value = get.value(current, player);
                                    }
                                    var equipValue = info.ai.equipValue || info.ai.basic.equipValue;
                                    if (typeof equipValue == 'function') return equipValue(card, player) - value;
                                    return equipValue - value;
                                },
                                result: {
                                    target: function (player, target) {
                                        return get.equipResult(player, target, name);
                                    }
                                }
                            }
                        }
                        var skill = lib.character[result.links[0]][3];
                        info.skills = info.skills.concat(skill);
                        lib.card[name] = info;
                        var character = get.translation(result.links[0]);
                        var reg = /[\u4e00-\u9fa5]/g;
                        var characters = character.match(reg);
                        if (characters) character = characters.join("");
                        lib.translate[name] = (get.translation(event.name) + '·' + character || '无');
                        for (var i = 0; i < skill.length; i++) {
                            if (lib.translate[name + '_info'] == undefined) lib.translate[name + '_info'] = ('<br><li>' + get.translation(skill[i]) + '：' + get.translation(skill[i] + '_info'));
                            else lib.translate[name + '_info'] += ('<br><li>' + get.translation(skill[i]) + '：' + get.translation(skill[i] + '_info'))
                        }
                        try {
                            game.addVideo('newcard', null, {
                                name: name,
                                translate: lib.translate[name],
                                info: lib.translate[name + '_info'],
                                card: result.links[0],
                                legend: true,
                            });
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    var ext = null;
                    Array.isArray(lib.character[name][4]) && lib.character[name][4].some(current => {
                        if (typeof current === 'string' && current.indexOf('ext') === 0) {
                            ext = current;
                            return true;
                        } else return false;
                    })
                    lib.card[name].image = ext === null ? ('character:' + name) : ext;
                    var card = game.createCard2({name: name, suit: null, number: null});
                    player.gain(card, 'gain');
                    player.draw(skill.length);
                },
                ai: {
                    order: 9.5,
                    result: {
                        player: 1
                    }
                },
                /*mod: {
                    canBeDiscarded: function (card, player, target) {
                        if (player != target && get.type(card) == 'equip' && get.position(card) == 'e') return false;
                    },
                    canBeGained: function (card, player, target) {
                        if (player != target && get.type(card) == 'equip' && get.position(card) == 'e') return false;
                    },
                },*/
                group:'ymjianxiong_equip',
                subSkill:{
                    equip:{
                        trigger:{
                            player: ['loseBegin'],
                            global:["equipBegin","addJudgeBegin","gainBegin","loseAsyncBegin","addToExpansionBegin"],
                        },
                        forced:true,
                        filter:function(event,player,name){
                            var es = player.getCards('e');
                            var isContains;
                            if (name === 'loseAsyncBegin'){
                                isContains = !!event.getl(player).es.length
                            }else if(event.name === 'gain'){
                                isContains = !!event.getg(player).length
                            }else{
                                isContains = event.cards.filter(card=>es.contains(card)).length > 0;
                            }
                            if(event.name === 'lose'&&event.type !== 'equip') return true;
                            if(event.name === 'gain' ||event.name === 'equip'){
                                if(event.player !== player && isContains) return true;
                            }
                            var evt=event.getl(player);
                            return evt&&evt.player==player&&evt.es&&evt.es.length>0;
                        },
                        content:function(){
                            if(trigger.name === 'equip'){
                                trigger.cancel();
                            }
                            trigger.cards.removeArray(player.getCards('e'));
                        },
                    },
                },
            },
            ymguixin: {
                audio: 'guixin',
                trigger: {
                    player: 'damageEnd',
                    source: 'damageSource',
                },
                usable: 1,
                content: function () {
                    'step 0'
                    if (trigger.cards && get.itemtype(trigger.cards) == 'cards' && get.position(trigger.cards[0], true) == 'o') player.gain(trigger.cards, 'gain2')
                    event.num = trigger.num;
                    'step 1'
                    event.recover = true;
                    if (trigger.cards) {
                        for (var i = 0; i < trigger.cards.length; i++) {
                            if (get.type(trigger.cards[i]) == 'basic') event.recover = false;
                        }
                    }
                    if (event.recover == true) {
                        if (Math.random() > 0.5) player.recover();
                        else player.draw(2);
                    } else player.draw();
                    'step 2'
                    event.card = get.cardPile(function (card) {
                        return get.tag(card, 'damage');
                    });
                    player.showCards(event.card);
                    player.chooseTarget([1, Infinity], true, get.prompt2(event.name), '请选择【' + get.translation(event.card) + '】的目标', function (card, player, target) {
                        return target != player;
                    }).set('ai', function (target) {
                        return get.attitude(_status.event.player, target) < 0;
                    });
                    'step 3'
                    if (result.bool) {
                        player.useCard(event.card, false, result.targets);
                        event.num--;
                        if (event.num > 0) event.goto(1);
                        else event.finish();
                    }
                },
            },
            ymshanjia: {
                audio: 'shanjia',
                enable: 'phaseUse',
                locked: true,
                filter: function (event, player) {
                    var he = player.getCards('he');
                    var num = 0;
                    for (var i = 0; i < he.length; i++) {
                        var info = lib.card[he[i].name];
                        if (info.type == 'equip' && lib.inpile.contains(he[i].name)) {
                            num++;
                            if (num >= 2) return true;
                        }
                    }
                },
                filterCard: function (card) {
                    if (ui.selected.cards.length && card.name == ui.selected.cards[0].name) return false;
                    var info = get.info(card);
                    return info.type == 'equip' && lib.inpile.contains(card.name);
                },
                selectCard: 2,
                position: 'he',
                check: function (card) {
                    return get.value(card);
                },
                content: function () {
                    var name = cards[0].name + '_' + cards[1].name;
                    var info1 = get.info(cards[0]), info2 = get.info(cards[1]);
                    if (!lib.card[name]) {
                        var info = {
                            enable: true,
                            type: 'equip',
                            subtype: get.subtype(cards[0]),
                            vanish: true,
                            cardimage: info1.cardimage || cards[0].name,
                            filterTarget: function (card, player, target) {
                                return target == player;
                            },
                            selectTarget: -1,
                            modTarget: true,
                            toself: true,
                            content: lib.element.content.equipCard,
                            legend: true,
                            source: [cards[0].name, cards[1].name],
                            onEquip: [function () {
                                player.chooseUseTarget('###是否发动【' + get.translation(card.name) + '】？###视为使用一张没有距离和次数限制的【杀】', {name: 'sha'}, false, 'nodistance').logSkill = 'ymshanjia';
                            }],
                            onLose: [function () {
                                player.chooseUseTarget('###是否发动【' + get.translation(card.name) + '】？###视为使用一张没有距离和次数限制的【杀】', {name: 'sha'}, false, 'nodistance').logSkill = 'ymshanjia';
                            }],
                            skills: [],
                            distance: {},
                            ai: {
                                order: 8.9,
                                equipValue: 10,
                                useful: 2.5,
                                value: function (card, player) {
                                    var value = 0;
                                    var info = get.info(card);
                                    var current = player.getEquip(info.subtype);
                                    if (current && card != current) {
                                        value = get.value(current, player);
                                    }
                                    var equipValue = info.ai.equipValue || info.ai.basic.equipValue;
                                    if (typeof equipValue == 'function') return equipValue(card, player) - value;
                                    return equipValue - value;
                                },
                                result: {
                                    target: function (player, target) {
                                        return get.equipResult(player, target, name);
                                    }
                                }
                            }
                        }
                        for (var i in info1.distance) {
                            info.distance[i] = info1.distance[i];
                        }
                        for (var i in info2.distance) {
                            if (typeof info.distance[i] == 'number') {
                                info.distance[i] += info2.distance[i];
                            } else {
                                info.distance[i] = info2.distance[i];
                            }
                        }
                        if (info1.skills) {
                            info.skills = info.skills.concat(info1.skills);
                        }
                        if (info2.skills) {
                            info.skills = info.skills.concat(info2.skills);
                        }
                        if (info1.onEquip) {
                            if (Array.isArray(info1.onEquip)) {
                                info.onEquip = info.onEquip.concat(info1.onEquip);
                            } else {
                                info.onEquip.push(info1.onEquip);
                            }
                        }
                        if (info2.onEquip) {
                            if (Array.isArray(info2.onEquip)) {
                                info.onEquip = info.onEquip.concat(info2.onEquip);
                            } else {
                                info.onEquip.push(info2.onEquip);
                            }
                        }
                        if (info1.onLose) {
                            if (Array.isArray(info1.onLose)) {
                                info.onLose = info.onLose.concat(info1.onLose);
                            } else {
                                info.onLose.push(info1.onLose);
                            }
                        }
                        if (info2.onLose) {
                            if (Array.isArray(info2.onLose)) {
                                info.onLose = info.onLose.concat(info2.onLose);
                            } else {
                                info.onLose.push(info2.onLose);
                            }
                        }
                        if (info.onEquip.length == 0) delete info.onEquip;
                        if (info.onLose.length == 0) delete info.onLose;
                        lib.card[name] = info;
                        lib.translate[name] = get.translation(cards[0].name, 'skill') + get.translation(cards[1].name, 'skill');
                        var str1 = lib.translate[cards[0].name + '_info'];
                        if (str1[str1.length - 1] == '.' || str1[str1.length - 1] == '。') {
                            str1 = str1.slice(0, str1.length - 1);
                        }
                        var str2 = lib.translate[cards[1].name + '_info'];
                        if (str2[str2.length - 1] == '.' || str2[str2.length - 1] == '。') {
                            str2 = str2.slice(0, str2.length - 1);
                        }
                        lib.translate[name + '_info'] = str1 + '；' + str2;
                        lib.translate[name + '_info'] += "；<span style='color: red'>锁定技，当你装备此牌或此牌离开装备区时，视为你使用一张没有距离和次数限制的【杀】。</span>";
                        try {
                            game.addVideo('newcard', null, {
                                name: name,
                                translate: lib.translate[name],
                                info: lib.translate[name + '_info'],
                                card: cards[0].name,
                                legend: true,
                            });
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    var card=game.createCard({
                        name: name,
                        suit: cards[0].suit,
                        number: cards[0].number
                    });
                    player.gain(card, 'gain2')._triggered = null;
                    card.sourceCard=[cards[0],cards[1]];
                    cards[0].delete();
                    cards[1].delete();
                },
                ai: {
                    order: 9.5,
                    result: {
                        player: 1
                    }
                },
                group: ['ymshanjia_draw', 'ymshanjia_lose'],
                global: 'ymshanjia_destory',
                subSkill: {
                    draw: {
                        trigger: {
                            player: 'phaseDrawBegin',
                        },
                        forced: true,
                        direct: true,
                        silent: true,
                        popup: false,
                        filter: function (event, player) {
                            return !event.numFixed && player.countCards('e') > 0;
                        },
                        content: function () {
                            player.logSkill('ymshanjia');
                            trigger.num += player.countCards('e');
                        },
                        mod: {
                            maxHandcard: function (player, num) {
                                return num + player.countCards('e') || 0;
                            },
                        },
                    },
                    lose: {
                        trigger: {
                            player: "loseAfter",
                            global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter"],
                        },
                        forced: true,
                        direct: true,
                        silent: true,
                        popup: false,
                        filter: function (event, player) {
                            var evt = event.getl(player);
                            return evt && evt.player == player && evt.es && evt.es.length > 0;
                        },
                        content: function () {
                            player.logSkill('ymshanjia');
                            player.draw(trigger.getl(player).es.length);
                        },
                    },
                    destory:{
                        trigger:{
                            global:["loseAfter","cardsDiscardAfter","equipAfter"],
                        },
                        filter:function(event,player){
                            var cards=event.getd();
                            var list=[];
                            for(var i=0;i<cards.length;i++){
                                if(cards[i].sourceCard) list.add(cards[i]);
                            }
                            return list.length>0;
                        },
                        forcedDie:true,
                        forced:true,
                        silent:true,
                        popup:false,
                        content:function(){
                            var cards=trigger.getd();
                            var list=[];
                            for(var i=0;i<cards.length;i++){
                                if(cards[i].sourceCard){
                                    ui.discardPile.insertBefore(cards[i].sourceCard[0],ui.discardPile.firstChild);
                                    ui.discardPile.insertBefore(cards[i].sourceCard[1],ui.discardPile.firstChild);
                                    delete cards[i].sourceCard;
                                    cards[i].delete();
                                }
                            }
                        },
                    },
                },
            },
            ymhubao: {
                trigger: {
                    player: 'damageEnd',
                    source: 'damageEnd',
                },
                usable: 1,
                audio: 'qingxi',
                filter: function (event, player) {
                    if (!event.card) return false;
                    if (event.card.name != 'sha' && event.card.name != 'juedou') return false;
                    return true;
                },
                direct: true,
                content: function () {
                    'step 0'
                    player.chooseBool(get.prompt2(event.name), '是否令' + get.translation(trigger.player) + '和' + get.translation(trigger.source) + '收回各自装备区的牌，然后你获得一张随机装备牌？').set('ai', function () {
                        var player = _status.event.player;
                        if (_status.currentPhase == player) return true;
                        return true;
                        //if (!player.getEquip(2)&&!player.getEquip(3)) return true;
                        //return false;
                    });
                    'step 1'
                    if (result.bool) {
                        player.logSkill(event.name);
                        trigger.player.gain(trigger.player.getCards('e'), 'gain2');
                        trigger.source.gain(trigger.source.getCards('e'), 'gain2');
                        var card = get.cardPile(function (card) {
                            return get.type(card) == 'equip';
                        });
                        if (card) player.useCard(card, player);
                    } else event.finish();
                    'step 2'
                    if (_status.currentPhase != player) {
                        player.chooseCard(1, 'h', '选择1张装备牌使用之', function (card) {
                            var player = _status.event.player;
                            return get.type(card) == 'equip' && player.canUse(card, player, null, true);
                        }).set('ai', function (card) {
                            return 10 - get.value(card);
                        });
                    }
                    'step 3'
                    if (result.bool && result.cards.length) {
                        player.chooseUseTarget(result.cards[0], true, 'nopopup');
                    }
                    'step 4'
                    if (player != _status.currentPhase) {
                        while (_status.event.name != 'phase') {
                            _status.event = _status.event.parent;
                        }
                        _status.event.step = 4;
                    }
                },
            },
            ymshensu: {
                audio: 'shensu1',
                trigger: {
                    global: 'phaseBegin',
                },
                filter: function (event, player) {
                    return event.player != player;
                },
                check: function (event, player) {
                    return get.attitude(event.player, player) <= 0;
                },
                direct:true,
                content: function () {
                    'step 0'
                    player.gainPlayerCard(get.prompt('ymshensu',trigger.player),trigger.player,'he').set('ai', function (card) {
                        var player=_status.event.player;
                        var target=trigger.player;
                        if (get.attitude(target, player) <= 0) return 3;
                        return 0;
                    });
                    'step 1'
                    if(result.bool){
                        player.logSkill(event.name,trigger.player);
                        player.chooseToDiscard('he', true);
                        player.useCard({name: 'sha', isCard: true, storage:{ymshensu:true}}, trigger.player, false);
                    }
                    else event.finish();
                    'step 3'
                    player.turnOver();
                    'step 4'
                    if (trigger.player.countCards('h') > player.countCards('h')) trigger.cancel();
                },
                ai:{
                    unequip:true,
                    skillTagFilter:function (player, tag, arg) {
                        if (!arg || !arg.card || !arg.card.storage || !arg.card.storage.ymshensu) return false;
                    },
                },
                group: 'ymshensu_sha',
                subSkill: {
                    sha: {
                        trigger: {
                            player: 'useCardEnd',
                        },
                        filter: function (event, player) {
                            if (event.card.name != 'sha') return false;
                            return event.parent.name == 'ymshensu';
                        },
                        forced: true,
                        silent: true,
                        popup: false,
                        content: function () {
                            var go = false;
                            if (player.getHistory('sourceDamage', function (evt) {
                                return evt.card == trigger.card;
                            }).length == 0) go = true;
                            if (go == true) {
                                for (var i = 0; i < trigger.targets.length; i++) {
                                    trigger.targets[i].loseHp();
                                }
                            } else player.draw(2);
                        },
                    },
                },
            },
            ymdingzui: {
                audio: 'jushou',
                trigger: {
                    global: 'damageBegin1',
                },
                prompt2: function (event, player) {
                    return '是否为<span style="color: red">' + get.translation(event.player) + '</span>承受此次' + event.num + '点伤害？';
                },
                locked: true,
                filter: function (event, player) {
                    return event.player != player && event.source != player;
                },
                check: function (event, player) {
                    if (player.hp <= event.num) return false;
                    return get.attitude(event.player, player) > 0;
                },
                content: function () {
                    trigger.player = player;
                    if (player.isTurnedOver()) player.turnOver(false);
                },
                group: ['ymdingzui_turn','ymdingzui_end'],
                subSkill: {
                    turn: {
                        trigger: {
                            player: 'turnOverEnd',
                        },
                        forced: true,
                        direct: true,
                        content: function () {
                            'step 0'
                            player.logSkill('ymdingzui');
                            player.markSkill(event.name);
                            player.draw();
                            var next = player.phaseUse();
                            event.next.remove(next);
                            trigger.next.push(next);
                        },
                        intro: {
                            content: function (storage, player, skill) {
                                return '额外执行一个出牌阶段';
                            },
                        },
                    },
                    end: {
                        trigger: {
                            player: 'phaseUseAfter',
                        },
                        forced: true,
                        popup: false,
                        silent: true,
                        content: function () {
                            player.unmarkSkill('ymdingzui_turn');
                        },
                    },
                },
            },
            ymliegong: {
                trigger: {
                    global: ['shaAfter', 'damageEnd'],
                },
                audio: 'liegong',
                filter: function (event, player, name) {
                    if (name == 'shaAfter') return event.player != player && event.targets.contains(player);
                    return event.source && event.source != player && event.player != player && event.card && event.card.name == 'sha';
                },
                locked: true,
                direct: true,
                content: function () {
                    'step 0'
                    var name = event.triggername;
                    if (name == 'shaAfter') event.choose = trigger.player;
                    else event.choose = trigger.source;
                    player.chooseToDiscard('he', 1, get.prompt2(event.name), '是否弃置一张牌视为对' + get.translation(event.choose) + '使用一张【杀】？').set('ai', function (card) {
                        var player = _status.event.player;
                        if (get.attitude(event.choose, player) <= 0) return 6 - get.value(card);
                        return 0;
                    });
                    'step 1'
                    if (result.bool) {
                        player.logSkill(event.name, event.choose);
                        player.useCard({name: 'sha', isCard: true}, event.choose, false);
                    }
                },
                mod: {
                    targetInRange: function (card, player, target, now) {
                        if (card.name == 'sha') return true;
                    },
                },
                group: 'ymliegong_sha',
                subSkill: {
                    sha: {
                        trigger: {
                            player: 'shaBegin',
                        },
                        filter: function (event, player) {
                            return event.getParent(2).name == 'ymliegong';
                        },
                        forced: true,
                        silent: true,
                        popup: false,
                        content: function () {
                            trigger.directHit = true;
                        },
                    },
                },
            },
            ymchuanyang: {
                trigger: {
                    player: 'useCard',
                },
                audio: 'liegong',
                filter: function (event, player) {
                    return event.card.name == 'sha';
                },
                forced: true,
                content: function () {
                    'step 0'
                    var cards = [];
                    var card1 = get.cardPile(function (card) {
                        return get.type(card) == 'basic' && !cards.contains(card);
                    });
                    if (card1) cards.push(card1);
                    if (cards) player.gain(cards, 'gain2');
                    var num = player.getHistory('useCard', function (evt) {
                        return evt && evt.card.name == 'sha';
                    }).length;
                    var goon = false;
                    game.hasPlayer(function (current) {
                        if (!trigger.targets.contains(current) && player.canUse(trigger.card, current)) goon = true
                    });
                    if (num == 2) {
                        if (!trigger.baseDamage) trigger.baseDamage = 1;
                        trigger.baseDamage++;
                    }
                    if (num == 1 && goon == true) {
                        player.chooseTarget(get.prompt2(event.name), '为' + get.translation(trigger.card) + '额外指定一个目标', function (card, player, target) {
                            return !_status.event.sourcex.contains(target) && player.canUse(_status.event.card, target);
                        }).set('sourcex', trigger.targets).set('ai', function (target) {
                            var player = _status.event.player;
                            return get.effect(target, _status.event.card, player, player);
                        }).set('card', trigger.card);
                    } else event.finish();
                    'step 1'
                    if (result.bool) {
                        player.line(result.targets, 'green');
                        trigger.targets.addArray(result.targets);
                    }
                },
                //mod: {
                //    selectTarget: function (card, player, range) {
                //        var num = player.getHistory('useCard',function(evt){
                //            return evt && evt.card.name == 'sha';
                //        }).length;
                //        if (card.name == 'sha' && range[1] != -1 && num == 0) range[1] += 1;
                //    },
                //},
                group: ['ymchuanyang_damage', 'ymchuanyang_miss'],
                subSkill: {
                    damage: {
                        trigger: {
                            source: 'damageSource',
                        },
                        forced: true,
                        filter: function (event, player) {
                            return event.card && event.card.name == 'sha';
                        },
                        content: function () {
                            trigger.player.damage(trigger.num, trigger.nature);
                        },
                    },
                    miss: {
                        trigger: {
                            player: 'shaMiss',
                        },
                        forced: true,
                        content: function () {
                            player.recover();
                            if (trigger.getParent().addCount !== false) {
                                trigger.getParent().addCount = false;
                                var stat = player.getStat();
                                if (stat && stat.card && stat.card.sha) stat.card.sha--;
                            }
                        },
                    },
                },
            },
            ymqiaobian: {
                zhuanhuanji: true,
                unique: true,
                trigger: {
                    player: ['phaseBefore', 'phaseAfter'],
                },
                audio: 'qiaobian',
                forced: true,
                filter: function (event, player, name) {
                    if (!player.storage.ymqiaobian) return true;
                    if (name == 'phaseBefore') return player.storage.ymqiaobian == false;
                    else return player.storage.ymqiaobian == true;
                },
                content: function () {
                    'step 0'
                    player.markSkill(event.name);
                    if (!player.storage.ymqiaobian) player.storage.ymqiaobian = false;
                    player.storage.ymqiaobian = !player.storage.ymqiaobian;
                    player.storage.ymqiaobian1 = 0;
                    'step 1'
                    if (event.triggername == 'phaseBefore') {
                        if (player.canMoveCard()) player.moveCard();
                    } else player.draw(2);
                },
                marktext: "变",
                intro: {
                    content: function (storage, player, skill) {
                        var str = '';
                        if (player.storage.ymqiaobian == true) str += '<span class="bluetext">你使用的基本牌或普通锦囊牌可以额外指定一个除你以外的目标并可令此牌额外结算一次</span>';
                        else str += '<span class="legendtext">其他角色使用牌指定其以外的目标时，你可以为此牌重新选择使用者和使用目标</span>';
                        var num = player.storage.ymqiaobian1 || 0;
                        str += '<br><li>剩余使用次数：' + (Math.ceil(player.maxHp / 2) - num);
                        return str;
                    },
                },
                ai: {
                    threaten: 2,
                },
                group: ['ymqiaobian_Before', 'ymqiaobian_After'],
                subSkill: {
                    Before: {
                        trigger: {
                            player: ['useCard2', 'useCardAfter'],
                        },
                        forced: true,
                        silent: true,
                        popup: false,
                        filter: function (event, player, name) {
                            if (player.storage.ymqiaobian == undefined || player.storage.ymqiaobian == false) return false;
                            if (!['basic', 'trick'].contains(get.type(event.card))) return false;
                            var num = Math.ceil(player.maxHp / 2);
                            var num1 = 0;
                            if (player.storage.ymqiaobian1) num1 += player.storage.ymqiaobian1;
                            if (num1 >= num) return false;
                            if (name == 'useCard2') {
                                if (!event.targets || event.targets.length <= 0) return false;
                                var info = get.info(event.card);
                                if (info.allowMultiple == false) return false;
                                if (event.targets && !info.multitarget) {
                                    return game.countPlayer(function (current) {
                                        return current != player && !event.targets.contains(current);
                                    });
                                }
                                return false;
                            } else {
                                if (event.parent.name == 'ymqiaobian_Before') return false;
                                if (!event.targets || !event.card) return false;
                                if (event.card && event.card.name == 'wuxie') return false;
                                var card = game.createCard(event.card.name, event.card.suit, event.card.number, event.card.nature);
                                var targets = event._targets || event.targets;
                                for (var i = 0; i < targets.length; i++) {
                                    if (targets[i].isIn() && player.canUse({name: event.card.name}, targets[i], false, false)) return true;
                                }
                                return false;
                            }
                        },
                        content: function () {
                            'step 0'
                            var name = event.triggername;
                            if (!player.storage.ymqiaobian1) player.storage.ymqiaobian1 = 0;
                            if (name == 'useCard2') {
                                player.chooseTarget(get.prompt2('ymqiaobian'), '为' + get.translation(trigger.card) + '额外指定一个除你以外的目标', function (card, player, target) {
                                    return !_status.event.sourcex.contains(target) && target != player;
                                }).set('sourcex', trigger.targets).set('ai', function (target) {
                                    var player = _status.event.player;
                                    return get.effect(target, _status.event.card, player, player);
                                }).set('card', trigger.card);
                            } else event.goto(3);
                            'step 1'
                            if (result.bool) {
                                if (!event.isMine() && !event.isOnline()) game.delayx();
                                event.targets = result.targets;
                            } else event.finish();
                            'step 2'
                            player.logSkill('ymqiaobian', event.targets);
                            trigger.targets.addArray(event.targets);
                            event.finish();
                            'step 3'
                            player.chooseBool(get.prompt2('ymqiaobian'), '是否令<span style="color: red">' + get.translation(trigger.card) + '</span>额外结算一次？').set('ai', function () {
                                var name = trigger.card.name;
                                if (name != 'tiesuo' && name != 'du') return true;
                                return false;
                            });
                            'step 4'
                            if (result.bool) {
                                player.storage.ymqiaobian1++;
                                player.logSkill('ymqiaobian');
                                var card = game.createCard(trigger.card.name, trigger.card.suit, trigger.card.number, trigger.card.nature);
                                var targets = trigger._targets || trigger.targets;
                                for (var i = 0; i < targets.length; i++) {
                                    if (!targets[i].isIn() || !player.canUse({name: trigger.card.name}, targets[i], false, false)) targets.remove(targets[i]);
                                }
                                player.$throw(card, 1000);
                                player.useCard({
                                    name: trigger.card.name,
                                    suit: trigger.card.suit,
                                    number: trigger.card.number,
                                    nature: trigger.card.nature
                                }, targets, false);
                            }
                        },
                    },
                    After: {
                        trigger: {
                            global: ['useCard', 'phaseAfter'],
                        },
                        filter: function (event, player, name) {
                            if (name == 'phaseAfter') player.storage.ymqiaobian1 = 0;
                            if (player.storage.ymqiaobian == undefined || player.storage.ymqiaobian == true) return false;
                            if (!event.targets || event.targets.length == 0) return false;
                            if (event.targets.contains(event.player) && event.targets.length <= 1) return false;
                            var num = Math.ceil(player.maxHp / 2);
                            var num1 = 0;
                            if (player.storage.ymqiaobian1) num1 += player.storage.ymqiaobian1;
                            if (num1 >= num) return false;
                            return event.player != player;
                        },
                        forced: true,
                        silent: true,
                        popup: false,
                        lastDo: true,
                        content: function () {
                            'step 0'
                            var num = Math.min(trigger.targets.length + 1, game.countPlayer());
                            var choice = ['使用者'];
                            for (var i = 0; i < num - 1; i++) {
                                choice.push('使用目标');
                            }
                            player.chooseTarget(num, false, get.prompt2('ymqiaobian'), '请为' + get.translation(trigger.card) + '重新分配使用者与使用目标', function (card, player, target) {
                                return true;
                            }).set('ai', function (target) {
                                var player = _status.event.player;
                                var eff = 0;
                                for (var i = 0; i < trigger.targets.length; i++) {
                                    eff += get.effect(trigger.targets[i], trigger.card, trigger.player, player);
                                }
                                if (eff < 0) {
                                    if (ui.selected.targets.length) {
                                        return get.effect(target, trigger.card, ui.selected.targets[0], player);
                                    } else return get.attitude(target, player) > 0;
                                }
                                return false;
                            }).set('targetprompt', choice);
                            'step 1'
                            if (result.targets) {
                                if (!player.storage.ymqiaobian1) player.storage.ymqiaobian1 = 0;
                                player.storage.ymqiaobian1++;
                                player.logSkill('ymqiaobian');
                                trigger.player = result.targets[0];
                                trigger.targets = result.targets.slice(1, result.targets.length);
                                player.line(trigger.player, 'green');
                                game.delay(2);
                                trigger.player.line(trigger.targets, 'green');
                                trigger.trigger('useCard2');
                                game.log(player, '将使用者改为', trigger.player, '，将使用目标改为', trigger.targets);
                            } else event.finish();
                        },
                    },
                },
            },
            ymjueji: {
                trigger: {
                    global: 'gainBegin',
                },
                audio: 'yuanlve',
                filter: function (event, player) {
                    if (event.getParent().name != 'draw') return false;
                    if (event.player == player) return false;
                    if (event.getParent(2).name == 'phaseDraw') return event.cards.length > 2;
                    else return event.cards.length > 1;
                },
                check: function (event, player) {
                    return get.attitude(event.player, player) <= 0;
                },
                forced: true,
                content: function () {
                    'step 0'
                    event.num = 1;
                    if (trigger.getParent(2).name == 'phaseDraw') event.num++;
                    player.chooseBool(get.prompt(event.name), '是否令<span style="color: red">' + get.translation(trigger.player) + '</span>改为摸' + event.num + '张牌？').set('ai', function () {
                        var player = _status.event.player;
                        if (get.attitude(player, event.current) <= 0) return true;
                        return false;
                    });
                    'step 1'
                    if (result.bool) {
                        var num = trigger.cards.length - event.num;
                        trigger.cards = get.cards(event.num);
                        player.draw(num);
                    }
                },
            },
            ymxiaoguo: {
                trigger: {
                    global: 'phaseBegin',
                },
                filter: function (event, player) {
                    return event.player.isAlive() && event.player != player && player.countCards('hes') > 0;
                },
                audio: 'xiaoguo',
                direct: true,
                content: function () {
                    'step 0'
                    var att = get.attitude(player, trigger.player);
                    var next = player.chooseToDiscard('hes', get.prompt2('ymxiaoguo', trigger.player));
                    next.set('ai', function (card) {
                        if (_status.event.att > 0) return 0;
                        if (card.number >= 7) return 15 - get.useful(card);
                        return 8 - get.useful(card);
                    });
                    next.set('att', att);
                    'step 1'
                    if (result.cards) {
                        player.logSkill('ymxiaoguo', trigger.player);
                        var type = get.type(result.cards[0], 'trick');
                        if (result.cards[0].number >= 7) {
                            trigger.player.storage.ymxiaoguo_ban = [type];
                            trigger.player.addTempSkill('ymxiaoguo_ban');
                        } else player.recover();
                        event.list = [];
                        for (var i = 0; i < lib.inpile.length; i++) {
                            if (!event.list.contains(get.type(lib.inpile[i], 'trick'))) event.list.add(get.type(lib.inpile[i], 'trick'));
                        }
                        event.list.remove(type);
                        event.list.length > 3 ? event.num = 3 : event.num = event.list.length;
                        trigger.player.chooseToDiscard([1, event.num], 'he', '骁果：弃置与此牌类型不同的牌，每少弃一种受到一点伤害', function (card) {
                            var type1 = get.type(card, 'trick');
                            for (var i = 0; i < ui.selected.cards.length; i++) {
                                if (get.type(ui.selected.cards[i], 'trick') == type1) return false;
                            }
                            return get.type(card, 'trick') != type;
                        }).set('complexCard', true).set('ai', function (card) {
                            return 10 - get.value(card);
                        });
                    } else event.finish();
                    'step 2'
                    var num = 0;
                    if (result.cards) num += result.cards.length;
                    player.draw(num);
                    trigger.player.damage(event.num - num);
                },
                subSkill: {
                    ban: {
                        unique: true,
                        charlotte: true,
                        intro: {
                            content: function (storage) {
                                return '不能使用或打出' + get.translation(storage) + '牌';
                            },
                        },
                        init: function (player, skill) {
                            if (!player.storage[skill]) player.storage[skill] = [];
                        },
                        mark: true,
                        onremove: true,
                        mod: {
                            cardEnabled: function (card, player) {
                                if (player.storage.ymxiaoguo_ban.contains(get.type(card, 'trick'))) return false;
                            },
                            cardUsable: function (card, player) {
                                if (player.storage.ymxiaoguo_ban.contains(get.type(card, 'trick'))) return false;
                            },
                            cardRespondable: function (card, player) {
                                if (player.storage.ymxiaoguo_ban.contains(get.type(card, 'trick'))) return false;
                            },
                            cardSavable: function (card, player) {
                                if (player.storage.ymxiaoguo_ban.contains(get.type(card, 'trick'))) return false;
                            },
                        },
                    },
                },
            },
            ymzhuzhen: {
                trigger: {
                    global: 'damageEnd',
                },
                audio: 'xiaoguo',
                filter: function (event, player) {
                    if (event.player.getHistory('damage').length > 1) return false;
                    return event.player != player && event.source;
                },
                forced: true,
                content: function () {
                    'step 0'
                    var choice = ['摸牌'];
                    if (trigger.player.countCards('he') > 0) choice.push('获得牌');
                    player.chooseControl(choice, function (event, player) {
                        if (get.attitude(trigger.player, player) <= 0 && trigger.player.countCards('he') > 0) return '获得牌';
                        return '摸牌';
                    }).set('prompt', '助阵：摸两张牌或获得' + get.translation(trigger.player) + '一张牌');
                    'step 1'
                    if (result.control == '摸牌') player.draw(2);
                    if (result.control == '获得牌') player.gainPlayerCard('he', true, trigger.player);
                    'step 2'
                    if (trigger.source != player && trigger.source.isAlive()) {
                        player.chooseCard([1, 2], 'he', '选择至多两张牌交给' + get.translation(trigger.source), function (card) {
                            return true;
                        }).set('ai', function (card) {
                            return 3 - get.value(card);
                        });
                    } else event.finish();
                    'step 3'
                    if (result.cards && result.cards.length) {
                        trigger.source.gain(result.cards, player, 'giveAuto');
                    }
                },
            },
            ymjieyue: {
                trigger: {
                    player: ["phaseBegin"],
                },
                direct: true,
                audio: 'rejieyue',
                filter: function (event, player) {
                    return true;
                },
                content: function () {
                    'step 0'
                    player.chooseCardTarget({
                        filterTarget: function (card, player, target) {
                            return target != player;
                        },
                        selectTarget: [1, 2],
                        filterCard: lib.filter.cardDiscardable,
                        selectCard: 1,
                        position: 'hes',
                        ai1: function (card) {
                            var players = player.getFriends();
                            if (get.type(card) == 'equip') {
                                for (var i = 0; i < players.length; i++) {
                                    if (!players[i].countCards('e', {subtype: get.subtype(card)})) return 8 - get.useful(card);
                                }
                            }
                            return 8 - get.useful(card);
                        },
                        ai2: function (target) {
                            var att = get.attitude(_status.event.player, target);
                            if (att > 0) {
                                return target.countCards('h') == 0;
                            } else return -(att - 0.1) * (target.countCards('h') + 1);
                        },
                        prompt: '弃置一张牌，选择至多两名其他角色将他们一半的手牌置于你的武将牌上',
                    });
                    'step 1'
                    if (result.cards && result.targets) {
                        player.discard(result.cards);
                        event.equip = result.cards[0];
                        event.targets = result.targets;
                        player.logSkill('ymjieyue', event.targets);
                        event.cards = [];
                        event.num = 0;
                    } else event.finish();
                    'step 2'
                    var num = Math.ceil(event.targets[event.num].countCards('h') / 2);
                    player.choosePlayerCard(true, num, 'h', event.targets[event.num], get.prompt('ymjieyue', event.targets[event.num]));
                    'step 3'
                    if (result.cards) {
                        event.targets[event.num].$give(result.cards, player, false);
                        event.targets[event.num].loseToSpecial(result.cards, 'ymjieyue', player);
                    }
                    var cards;
                    if ((result.cards && result.cards.length < 2) || !result.cards) {
                        if (result.cards) cards = get.cards(2 - result.cards.length);
                        else cards = get.cards(2);
                        player.$draw(cards);
                        player.loseToSpecial(cards, 'ymjieyue', player);
                    }
                    event.cards = result.cards.concat(cards);
                    game.log(player, '将', event.cards, '放到了武将牌上');
                    player.markSkill('ymjieyue');
                    event.num++;
                    game.delay(2);
                    if (event.num < event.targets.length) event.goto(2);
                    'step 4'
                    if (get.type(event.equip) == 'equip') {
                        player.chooseTarget(1, '是否令一名其他角色装备' + get.translation(event.equip) + '？', function (card, player, target) {
                            return target != player;
                        }).set('ai', function (target) {
                            var player = _status.event.player;
                            return get.effect(target, event.equip, target, player);
                        });
                    } else event.finish();
                    'step 5'
                    if (result.targets) {
                        result.targets[0].$draw(event.equip);
                        game.delay();
                        result.targets[0].equip(event.equip);
                    }
                },
                marktext: "节",
                intro: {
                    mark: function (dialog, storage, player) {
                        dialog.addAuto(player.getCards('s', function (card) {
                            return card.hasGaintag('ymjieyue');
                        }));
                    },
                    markcount: function (storage, player) {
                        return player.getCards('s', function (card) {
                            return card.hasGaintag('ymjieyue');
                        }).length;
                    },
                    onunmark: function (storage, player) {
                        var cards = player.getCards('s', function (card) {
                            return card.hasGaintag('ymjieyue');
                        });
                        if (cards.length) {
                            player.lose(cards, ui.discardPile);
                            player.$throw(cards, 1000);
                            game.log(cards, '进入了弃牌堆');
                        }
                    },
                },
                mod: {
                    aiOrder: function (player, card, num) {
                        if (get.itemtype(card) == 'card' && card.hasGaintag('ymjieyue')) return num + 0.5;
                    },
                },
                group: 'ymjieyue_draw',
                subSkill: {
                    draw: {
                        trigger: {
                            player: "loseAfter",
                        },
                        forced: true,
                        audio: 'jieyue1',
                        filter: function (event, player) {
                            if (!event.ss || !event.ss.length) return false;
                            for (var i in event.gaintag_map) {
                                if (event.gaintag_map[i].contains('ymjieyue')) return true;
                                return false;
                            }
                        },
                        content: function () {
                            'step 0'
                            player.draw(trigger.num);
                            var num = player.getCards('s', function (card) {
                                return card.hasGaintag('ymjieyue');
                            }).length;
                            if (num) player.markSkill('ymjieyue');
                            else player.unmarkSkill('ymjieyue');
                            'step 1'
                            game.updateRoundNumber();
                        },
                    },
                },
            },
            ymyizhong: {
                trigger: {
                    global: 'gameStart',
                    player: ['enterGame', 'phaseEnd'],
                },
                filter: function (event, player) {
                    //for(var i=1;i<6;i++){
                    //    if(player.isEmpty(i)) return true;
                    //}
                    return true;
                },
                forced: true,
                audio: 'decadezhenjun',
                content: function () {
                    'step 0'
                    if (event.triggername != 'phaseEnd' && event.count == undefined) event.count = 1;
                    var num = [1, 2, 3, 4, 5];
                    for (var i = 1; i < 6; i++) {
                        if (!player.isEmpty(i)) num.remove(i);
                        if (!get.cardPile(function (card) {
                            return get.subtype(card, false) != ('equip'+i) && !get.cardtag(card, 'gifts');
                        })) num.remove(i);
                    }
                    var sub = 'equip' + num.randomGet(), card = get.cardPile(function (card) {
                        return get.subtype(card, false) == sub && !get.cardtag(card, 'gifts');
                    });
                    if (card) {
                        player.$gain2(card);
                        game.delayx();
                        player.equip(card);
                    }
                    if (event.count) {
                        event.count--;
                        if (event.count >= 0) event.redo();
                    }
                    'step 1'
                    player.chooseTarget([1, Infinity], get.prompt2(event.name), function (card, player, target) {
                        if (ui.selected.targets.length) {
                            if (ui.selected.targets[0] == player) return false;
                            return target != player;
                        } else return true;
                    }).set('complexTarget', true).set('targetprompt', function (target) {
                        var player = _status.event.player;
                        if (target == player) return '收回标记';
                        else return '获得标记';
                    }).set('ai', function (target) {
                        var player = _status.event.player;
                        var att = get.attitude(player, target);
                        return target != player && att > 0 && (!player.storage.ymyizhong_equip || !player.storage.ymyizhong_equip.contains(target));
                    });
                    'step 2'
                    if (result.bool) {
                        if (player.storage.ymyizhong_equip) {
                            for (var i = 0; i < player.storage.ymyizhong_equip.length; i++) {
                                var target = player.storage.ymyizhong_equip[i];
                                delete target.storage.ymyizhong_equip2;
                                target.removeAdditionalSkill('ymyizhong_equip');
                                if (target != player) target.unmarkSkill('ymyizhong_equip2');
                            }
                        }
                        player.line(result.targets, 'green');
                        player.storage.ymyizhong_equip = [];
                        player.storage.ymyizhong_equip.addArray(result.targets);
                        player.storage.ymyizhong_equip.add(player);
                        for (var i = 0; i < result.targets.length; i++) {
                            result.targets[i].storage.ymyizhong_equip2 = [];
                        }
                    } else {
                        player.recover();
                        if (player.storage.ymyizhong_equip) {
                            for (var i = 0; i < player.storage.ymyizhong_equip.length; i++) {
                                var target = player.storage.ymyizhong_equip[i];
                                if (target != player) target.recover();
                            }
                        }
                    }
                },
                group: 'ymyizhong_equip',
                global: 'ymyizhong_equip2',
                subSkill: {
                    equip: {
                        trigger: {
                            player: ["ymyizhongAfter"],
                            global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter"],
                        },
                        filter: function (event, player, name) {
                            if (!player.storage.ymyizhong_equip || player.storage.ymyizhong_equip.length == 0) return false;
                            return true;
                        },
                        forced: true,
                        silent: true,
                        popup: false,
                        content: function () {
                            'step 0'
                            var cards = [];
                            var list = [];
                            var name = [];
                            var players = player.storage.ymyizhong_equip;
                            for (var i = 0; i < players.length; i++) {
                                var card = players[i].getCards('e');
                                for (var j = 0; j < card.length; j++) {
                                    if (!cards.contains(card[j])) cards.add(card[j]);
                                }
                            }
                            var come = [''];
                            for (var i = 0; i < cards.length; i++) {
                                if (!lib.card[cards[i].name].clearLose || come.contains(cards[i].name)) {
                                    var skills = lib.card[cards[i].name].skills;
                                    name.add(cards[i].name);
                                    if (skills && skills.length) list.addArray(skills);
                                }
                            }
                            for (var i = 0; i < players.length; i++) {
                                players[i].removeAdditionalSkill('ymyizhong_equip');
                                var card = players[i].getCards('e');
                                var cards2 = cards.slice(0);
                                var name2 = name.slice(0);
                                var list2 = list.slice(0);
                                for (var j = 0; j < card.length; j++) {
                                    var skills = lib.card[card[j].name].skills;
                                    if (cards2.contains(card[j])) cards2.remove(card[j]);
                                    if (name2.contains(card[j].name)) name2.remove(card[j].name);
                                    if (skills && skills.length) {
                                        for (var k = 0; k < skills.length; k++) {
                                            if (list2.contains(skills[k])) list2.remove(skills[k]);
                                        }
                                    }
                                }
                                players[i].addAdditionalSkill('ymyizhong_equip', list2);
                                players[i].storage.ymyizhong_equip2 = [].concat(name2);
                                players[i].markSkill('ymyizhong_equip2');
                            }
                        },
                    },
                    equip2: {
                        charlotte: true,
                        forced: true,
                        unique: true,
                        mod: {
                            globalFrom: function (from, to, distance) {
                                if (from.storage.ymyizhong_equip2&&game.hasPlayer(function(current){
                                    return current.hasSkill('ymyizhong');
                                })) {
                                    var num = 0;
                                    for (var i = 0; i < from.storage.ymyizhong_equip2.length; i++) {
                                        var info = lib.card[from.storage.ymyizhong_equip2[i]];
                                        if (info && info.distance && info.distance.globalFrom) num += info.distance.globalFrom;
                                    }
                                    if (to.storage.ymyizhong_equip2) return -Infinity;
                                    return distance + num;
                                }
                            },
                            globalTo: function (from, to, distance) {
                                if (to.storage.ymyizhong_equip2&&game.hasPlayer(function(current){
                                    return current.hasSkill('ymyizhong');
                                })) {
                                    var num = 0;
                                    for (var i = 0; i < to.storage.ymyizhong_equip2.length; i++) {
                                        var info = lib.card[to.storage.ymyizhong_equip2[i]];
                                        if (info && info.distance && info.distance.globalTo) num += info.distance.globalTo;
                                    }
                                    if (from.storage.ymyizhong_equip2) return -Infinity;
                                    return distance + num;
                                }
                            },
                            /*attackFrom: function (from, to, distance) {
                                if (from.storage.ymyizhong_equip2&&game.hasPlayer(function(current){
                                    return current.hasSkill('ymyizhong');
                                })) {
                                    var num = 0;
                                    for (var i = 0; i < from.storage.ymyizhong_equip2.length; i++) {
                                        var info = lib.card[from.storage.ymyizhong_equip2[i]];
                                        if (info && info.distance && info.distance.attackFrom) num += info.distance.attackFrom;
                                    }
                                    return distance + num;
                                }
                            },*/
                            attackRange:function(from,distance){
                                if(from.storage.ymyizhong_equip2&&game.hasPlayer(function(current){
                                    return current.hasSkill('ymyizhong');
                                })) {
                                    var num = 0;
                                    for (var i = 0; i < from.storage.ymyizhong_equip2.length; i++) {
                                        var info = lib.card[from.storage.ymyizhong_equip2[i]];
                                        if (info && info.distance && info.distance.attackFrom) num += info.distance.attackFrom;
                                    }
                                    return distance - num;
                                }
                            },
                            attackTo: function (from, to, distance) {
                                if (to.storage.ymyizhong_equip2&&game.hasPlayer(function(current){
                                    return current.hasSkill('ymyizhong');
                                })) {
                                    var num = 0;
                                    for (var i = 0; i < to.storage.ymyizhong_equip2.length; i++) {
                                        var info = lib.card[to.storage.ymyizhong_equip2[i]];
                                        if (info && info.distance && info.distance.attackTo) num += info.distance.attackTo;
                                    }
                                    return distance + num;
                                }
                            },
                        },
                        marktext: "毅",
                        intro: {
                            content: function (storage, player, skill) {
                                var str = '';
                                if (player.storage.ymyizhong_equip) str += '<li><span style="color: red">当前【毅重】参与角色：</span>' + get.translation(player.storage.ymyizhong_equip);
                                if (player.storage.ymyizhong_equip2) {
                                    if (!player.storage.ymyizhong_equip) str += '<li><span style="color: red">你已参与【毅重】</span>';
                                    if (player.storage.ymyizhong_equip2.length > 0) {
                                        str += '<br><li>当前额外视为装备：' + get.translation(player.storage.ymyizhong_equip2) + '<br>–––––––––––––––––––––––';
                                        for (var i = 0; i < player.storage.ymyizhong_equip2.length; i++) {
                                            str += '<br>*<span class="bluetext">【' + lib.translate[player.storage.ymyizhong_equip2[i]] + '】：' + lib.translate[player.storage.ymyizhong_equip2[i] + '_info'] + '</span>';
                                        }
                                    }
                                }
                                return str;
                            },
                            onunmark: function (storage, player) {
                                player.removeAdditionalSkill('ymyizhong_equip');
                                delete player.storage.ymyizhong_equip2;
                                player.addEquipTrigger();
                            },
                        },
                    },
                },
            },
            ymduanliang: {
                audio: 'duanliang1',
                enable: ["chooseToUse"],
                usable: 3,
                filter: function (event, player) {
                    if (!player.countCards('hse')) return false;
                    if (event.type == 'wuxie') return false;
                    for (var i = 0; i < lib.inpile.length; i++) {
                        var name = lib.inpile[i];
                        if (get.type(name) == 'delay' && event.filterCard({name: name}, player, event)) return true;
                    }
                    return false;
                },
                chooseButton: {
                    dialog: function (event, player) {
                        var list = [];
                        var stat=player.getStat('skill').ymduanliang_cards;
                        if(!stat) stat=[];
                        for (var i = 0; i < lib.inpile.length; i++) {
                            var name = lib.inpile[i];
                            if (stat.contains(name)) continue;
                            if (get.type(name) == 'delay') {
                                list.push(['延时锦囊', '', name]);
                            }
                        }
                        return ui.create.dialog('断粮', [list, 'vcard'], 'hidden');
                    },
                    filter: function (button, player) {
                        return _status.event.getParent().filterCard({name: button.link[2]}, player, _status.event.getParent());
                    },
                    check: function (button) {
                        if (_status.event.getParent().type == 'phase') {
                            var player = _status.event.player;
                            var fakecard = {name: button.link[2]};
                            if (player.getUseValue(fakecard) > 0) return get.order(fakecard);
                            return 0;
                        }
                        return 1;
                    },
                    backup: function (links, player) {
                        return {
                            selectCard: 1,
                            filterCard: function (card) {
                                return get.type(card) != 'basic';
                            },
                            popname: true,
                            check: function (card) {
                                if (get.type(card) != 'delay') return 6;
                                return 1 / Math.max(0.1, get.value(card));
                            },
                            position: 'hse',
                            viewAs: {name: links[0][2]},
                            onuse: function (result, player) {
                                var stat=player.getStat('skill');
                                if(!stat.ymduanliang_cards) stat.ymduanliang_cards=[];
                                stat.ymduanliang_cards.push(result.card.name);
                                if (stat.ymduanliang_cards.length <= 1) {
                                    player.recover();
                                }
                            },
                        }
                    },
                    prompt: function (links, player) {
                        return '将一张非基本牌当做' + get.translation(links[0][2]) + '使用或打出';
                    },
                },
                ai: {
                    order: function (item, player) {
                        if (player && _status.event.type == 'phase') {
                            var max = 0;
                            for (var i = 0; i < lib.inpile.length; i++) {
                                var name = lib.inpile[i];
                                if (get.type(name) == 'delay') {
                                    var temp = get.order({name: name});
                                    if (temp > max) max = temp;
                                }
                            }
                            return Math.abs(max) + 8;
                        }
                        return 8;
                    },
                    basic: {
                        order: 7,
                        useful: 6,
                        value: 6,
                    },
                    result: {
                        player: 1,
                    },
                    effect: {
                        player: function (card) {
                            if (['shandian', 'fulei'].contains(card.name)) return [6, 6];
                        },
                    },
                },
                group: ['ymduanliang_judge'],
                subSkill: {
                    judge: {
                        trigger: {
                            player: "useCard",
                        },
                        filter: function (event, player) {
                            return event.targets && event.targets.length > 0 && event.card && get.type(event.card) == 'delay';
                        },
                        audio: 'duanliang1',
                        forced: true,
                        content: function () {
                            "step 0"
                            if (game.countPlayer(function (current) {
                                return current != player && !trigger.targets.contains(current);
                            })) {
                                player.chooseTarget([1, Infinity], get.prompt2(event.name), '额外指定任意名角色也成为' + get.translation(trigger.card) + '的目标', function (card, player, target) {
                                    return !trigger.targets.contains(target) && target != player;
                                }).set('ai', function (target) {
                                    var player = _status.event.player;
                                    return get.effect(target, trigger.card, player, player);
                                });
                            }
                            "step 1"
                            if (result.targets) {
                                trigger.targets.addArray(result.targets);
                                player.line(result.targets, 'green');
                            }
                            "step 2"
                            trigger.untrigger();
                            trigger.finish();
                            "step 3"
                            event.num = 0;
                            event.card = ui.create.card();
                            event.card.init([trigger.card.suit, trigger.card.number, trigger.card.name]);
                            for (var i = 0; i < trigger.targets.length; i++) {
                                trigger.targets[i].popup(event.card.viewAs || event.card.name, 'thunder');
                            }
                            "step 4"
                            if (!trigger.cancelled) {
                                trigger.targets[event.num].judge(event.card);
                            }
                            "step 5"
                            event.card.expired = true;
                            var name = event.card.viewAs || event.card.name;
                            if (trigger.cancelled && !trigger.direct) {
                                if (lib.card[name].cancel) {
                                    var next = game.createEvent(name + 'Cancelled');
                                    next.setContent(lib.card[name].cancel);
                                    next.card = event.card;
                                    next.cards=[event.card];
                                }
                            } else {
                                var next = game.createEvent(name);
                                next.setContent(lib.card[name].effect);
                                next._result = result;
                                next.card = event.card;
                                next.cards=[event.card];
                                next.player = trigger.targets[event.num];
                                if (next._result.bool == false) {
                                    if (!trigger.targets[event.num].storage.ymduanliang_delay) trigger.targets[event.num].storage.ymduanliang_delay = [];
                                    trigger.targets[event.num].storage.ymduanliang_delay.add(trigger.card.name);
                                    trigger.targets[event.num].addTempSkill('ymduanliang_delay', {player: 'phaseBefore'});
                                    player.draw();
                                } else if (trigger.targets[event.num] != player) trigger.targets[event.num].damage();
                            }
                            event.num++;
                            if (event.num < trigger.targets.length) event.goto(4);
                            "step 6"
                            ui.clear();
                            if (event.card) event.card.delete();
                        },
                    },
                    delay: {
                        trigger: {
                            player: 'phaseBefore',
                        },
                        forced: true,
                        silent: true,
                        popup: false,
                        charlotte: true,
                        mark: true,
                        content: function () {
                            player.removeSkill('ymduanliang_delay');
                            delete player.storage.ymduanliang_delay;
                        },
                        intro: {
                            content: function (storage) {
                                return get.translation(storage) + ' 已生效';
                            },
                        },
                        init: function (player, skill) {
                            if (!player.storage[skill]) player.storage[skill] = [];
                        },
                        onremove: true,
                    },
                },
            },
            ymjiezi: {
                trigger: {
                    player: ['useCard', 'respond'],
                },
                audio: 'jiezi',
                forced: true,
                filter: function (event, player) {
                    return _status.currentPhase != player && get.type(event.card) == 'basic';
                },
                content: function () {
                    var card = get.cardPile(function (card) {
                        return get.type(card) != 'basic';
                    });
                    if (card) player.gain(card, 'gain2');
                },
                group: 'ymjiezi_skip',
                subSkill: {
                    skip: {
                        trigger: {
                            global: 'phaseEnd',
                        },
                        filter: function (event, player) {
                            return event.player.getHistory('skipped').length > 0;
                        },
                        forced: true,
                        content: function () {
                            'step 0'
                            event.num = trigger.player.getHistory('skipped').length;
                            player.draw(event.num);
                            'step 1'
                            var num = event.num;
                            player.chooseToUse('截辎：是否再使用' + event.num + '张牌？').logSkill = 'ymjiezi';
                            'step 2'
                            if (result.bool) {
                                event.num--;
                                if (event.num > 0) event.goto(1);
                            } else game.delay();
                        }
                    },
                },
            },
            ymzhiheng: {
                audio: 'rezhiheng',
                enable: "phaseUse",
                usable: 1,
                position: "h",
                filterCard: function (card, player, event) {
                    event = event || _status.event;
                    if (typeof event != 'string') event = event.getParent().name;
                    var mod = game.checkMod(card, player, event, 'unchanged', 'cardDiscardable', player);
                    if (mod != 'unchanged') return mod;
                    return true;
                },
                discard: false,
                lose: false,
                delay: false,
                selectCard: -1,
                content: function () {
                    'step 0'
                    event.num = 0;
                    game.countPlayer(function (current) {
                        if (current.isMaxHandcard()) event.num = current.countCards('h');
                    });
                    if (event.num > 5) event.num = 5;
                    player.discard(cards);
                    'step 1'
                    var list = [];
                    for (var i = 0; i < lib.inpile.length; i++) {
                        var name = lib.inpile[i];
                        if (name == 'sha') {
                            list.add(['基本', '', 'sha']);
                            list.add(['基本', '', 'sha', 'fire']);
                            list.add(['基本', '', 'sha', 'thunder']);
                            list.add(['基本', '', 'sha', 'ice']);
                            list.add(['基本', '', 'sha', 'kami']);
                        } else list.add([get.type(name, 'trick'), '', name]);
                    }
                    var dialog = ui.create.dialog('制衡');
                    dialog.addText('请选择获得的牌');
                    dialog.add([list, 'vcard']);
                    player.chooseButton([1, event.num], dialog).set('ai', function (button) {
                        var card = game.createCard({name: button.link[2], nature: button.link[3]});
                        return get.value(card, _status.event.player);
                    });
                    'step 2'
                    if (result.links) {
                        event.num2 = result.links.length;
                        var cards = [];
                        for (var i = 0; i < result.links.length; i++) {
                            var card = game.createCard({
                                name: result.links[i][2],
                                nature: result.links[i][3]
                            });
                            cards.push(card);
                        }
                        player.gain(cards, 'gain2');
                    } else event.goto(4);
                    'step 3'
                    var cards = [];
                    for (var i = 0; i < event.num2; i++) {
                        var card = game.createCard2('ymfushu_card');
                        cards.push(card);
                    }
                    var num = [];
                    //if(ui.cardPile.childElementCount<event.num+1){
                    //    player.getCards(event.num+2);
                    //}
                    for (var i = 0; i < ui.cardPile.childElementCount; i++) {
                        num.push(i);
                    }
                    game.log('牌堆中添加了', cards);
                    for (var i = 0; i < event.num2; i++) {
                        var card2 = cards.randomGet();
                        ui.cardPile.insertBefore(card2, ui.cardPile.childNodes[num.randomGet()]);
                        cards.remove(card2);
                        num.push(num.length);
                    }
                    game.updateRoundNumber();
                    'step 4'
                    player.drawTo(cards.length);
                    game.delay(0.5);
                },
                ai: {
                    order: 6,
                    result: {
                        player: 1,
                    },
                    threaten: 1,
                },
            },
            ymtusi: {
                audio: 'jiuyuan',
                trigger: {
                    player: ["loseEnd", "damageEnd"],
                    global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter"],
                },
                filter: function (event, player, name) {
                    var num = 0;
                    game.countPlayer(function (current) {
                        if (current.group == player.group) num++;
                    });
                    if (num > 4) num = 4;
                    if (name != 'damageEnd') {
                        var evt = event.getl(player);
                        if (!evt || evt.player != player || !evt.hs || evt.hs.length <= 0) return false;
                        return player.getHistory('custom', function (evt) {
                            return evt.ymtusi_name == 'lose';
                        }).length < num;
                    } else {
                        return player.getHistory('custom', function (evt) {
                            return evt.ymtusi_name == 'damage';
                        }).length < num;
                    }
                },
                forced: true,
                content: function () {
                    var name = event.triggername;
                    var players = [];
                    game.filterPlayer(function (current) {
                        if (get.distance(player, current) <= 1 && current != player) players.push(current);
                    });
                    player.addTempSkill('ymtusi_end');
                    if (!player.storage.ymtusi_end) player.storage.ymtusi_end = 0;
                    if (players.length > 0) {
                        player.storage.ymtusi_end++;
                        var count = player.storage.ymtusi_end;
                        if (name == 'damageEnd') {
                            player.getHistory('custom').push({ymtusi_name: 'damage'});
                            for (var i = 0; i < players.length; i++) {
                                players[i].damage(count);
                            }
                        } else {
                            player.getHistory('custom').push({ymtusi_name: 'lose'});
                            for (var i = 0; i < players.length; i++) {
                                player.discardPlayerCard(players[i], count, 'he', true);
                            }
                        }
                    }
                    if ((players.length >= game.filterPlayer().length - 1) || players.length == 0) {
                        var num = [1, 2];
                        if (player.storage.ymtusidraw) num.remove(1);
                        if (player.storage.ymtusirecover) num.remove(2);
                        var n = num.randomGet();
                        if (n == 1) {
                            player.draw(2);
                            player.storage.ymtusidraw = true;
                        }
                        if (n == 2) {
                            player.recover();
                            player.storage.ymtusirecover = true;
                        }
                    }
                },
                subSkill: {
                    end: {
                        charlotte: true,
                        mark: true,
                        intro: {
                            content: function (storage, player) {
                                var str = '执行【屠嗣】选项次数：' + storage;
                                var num1 = player.getHistory('custom', function (evt) {
                                    return evt.ymtusi_name == 'damage';
                                }).length;
                                var num2 = player.getHistory('custom', function (evt) {
                                    return evt.ymtusi_name == 'lose';
                                }).length
                                str += '<br><li>「伤害」次数：' + num1;
                                str += '<br><li>「弃牌」次数：' + num2;
                                return str;
                            },
                        },
                        init: function (player, skill) {
                            if (!player.storage[skill]) player.storage[skill] = [];
                        },
                        onremove: function (player, skill) {
                            delete player.storage.ymtusi_end;
                            delete player.storage.ymtusidraw;
                            delete player.storage.ymtusirecover;
                        },
                    },
                },
            },
            ymtianxiang:{
                audio:"piaoling",
                trigger:{
                    global:["damageBegin","loseHpBegin"],
                },
                filter:function(event,player){
                    return player.getHistory('custom', function (evt) {
                        return evt.ymtianxiang_name;
                    }).length<4&&player.countCards('h')>0&&event.num>0;
                },
                intro:{
                    name:'天香·花色',
                    content:function (storage,player,skill){
                        var suit=['spade','heart','club','diamond'];
                        for(var i=0;i<suit.length;i++){
                            if(player.getHistory('custom', function (evt) {
                                return evt.ymtianxiang_name==suit[i];
                            }).length>=1){
                                suit.remove(suit[i]);
                                suit.splice(i--,1);
                            }
                        }
                        return '<br><li>本回合可使用花色：'+get.translation(suit);
                    },
                },
                mark:true,
                direct:true,
                content:function(){
                    "step 0"
                    player.chooseCardTarget({
                        filterCard:function(card,player){
                            return lib.filter.cardDiscardable(card,player)&&player.getHistory('custom', function (evt) {
                                return evt.ymtianxiang_name==get.suit(card);
                            }).length<1;
                        },
                        selectCard:1,
                        filterTarget:function(card,player,target){
                            //return target!=_status.event.getTrigger().player;
                            return true;
                        },
                        ai1:function(card){
                            return 10-get.value(card);
                        },
                        ai2:function(target){
                            var att=get.attitude(_status.event.player,target);
                            return -att;
                        },
                        prompt:get.prompt('ymtianxiang'),
                        prompt2:'弃置一张手牌并选择一名角色令其承受此次体力减少',
                    });
                    "step 1"
                    if(result.bool){
                        player.logSkill('ymtianxiang',result.targets)
                        event.card=result.cards[0];
                        player.discard(event.card);
                        trigger.player=result.targets[0];
                        var suit=get.suit(event.card);
                        player.getHistory('custom').push({ymtianxiang_name:suit});
                        player.markSkill('ymtianxiang_phase');
                        var num=player.getHistory('custom', function (evt) {
                            return evt.ymtianxiang_name;
                        }).length;
                        if(num>0&&num%2==0) player.draw(num);
                        switch(suit){
                            case 'spade':event.goto(2);break;
                            case 'heart':event.goto(4);break;
                            case 'club':event.goto(6);break;
                            case 'diamond':event.goto(8);break;
                        }
                    }
                    else event.finish();
                    "step 2"
                    player.chooseTarget([1,2], get.prompt2(event.name), '选择一名角色武将牌翻至背面或选择两名角色交换体力值', function (card, player, target) {
                        return true;
                    }).set('ai', function (target) {
                        var player = _status.event.player;
                        if(ui.selected.targets.length){
                            var tar=ui.selected.targets[0];
                            var att=get.attitude(player,target);
                            return tar.hp>=target.hp&&att>=0;
                        }
                        else{
                            var eff=0;
                            if(target.isTurnedOver()) eff++
                            return -get.attitude(player,target)-1+eff;
                        }
                    });
                    "step 3"
                    if(result.targets){
                        if(result.targets.length>1){
                            var hp1=result.targets[0].hp;
                            var hp2=result.targets[1].hp;
                            result.targets[0].hp=hp2;
                            result.targets[1].hp=hp1;
                            result.targets[0].update();
                            result.targets[1].update();
                        }
                        else result.targets[0].turnOver(true);
                    }
                    event.goto(9);
                    "step 4"
                    player.chooseTarget(1,get.prompt2(event.name), '选择一名角色令其装备区的牌失效直到下一轮开始', function (card, player, target) {
                        return true;
                    }).set('ai', function (target) {
                        var player = _status.event.player;
                        return -get.attitude(player,target)*target.countCards('e')-1;
                    });
                    "step 5"
                    if(result.targets){
                        result.targets[0].addTempSkill('ymtianxiang_equip','roundStart');
                    }
                    event.goto(9);
                    "step 6"
                    if(_status.currentPhase){
                        player.chooseControl('摸牌', '弃牌', 'cancel2').set('prompt', '【天香】：请选择令' + get.translation(_status.currentPhase) + '摸牌或你弃置其的牌').set('ai', function () {
                            if (get.attitude(_status.currentPhase, player) > 0) return '摸牌';
                            else return '弃牌';
                        });
                    }
                    else event.goto(9);
                    "step 7"
                    if(result.control=='摸牌') _status.currentPhase.draw(3);
                    if(result.control=='弃牌') player.discardPlayerCard(_status.currentPhase, 3, 'he', true);
                    event.goto(9);
                    "step 8"
                    trigger.num+=1;
                    "step 9"
                    game.delay(1.5);
                    "step 10"
                    event.trigger('ymtianxiangout');
                },
                ai:{
                    maixie:true,
                    "maixie_hp":true,
                },
                subSkill:{
                    equip:{
                        mark:true,
                        intro:{
                            name:'天香',
                            content:function (storage,player,skill){
                                var str='技能和装备区均已失效';
                                str+='<br><li>失效技能：';
                                var list=player.getSkills(null,false,false).filter(function(i){
                                    return lib.skill.ymtianxiang_equip.skillBlocker(i,player);
                                });
                                if(list.length) str+=get.translation(list);
                                else str+='无';
                                str+='<br><li>失效装备：';
                                var equip=player.getCards('e');
                                if(equip.length){
                                    var name=[];
                                    for(var i=0;i<equip.length;i++){
                                        name.add(equip[i].name);
                                    }
                                    str+=get.translation(name);
                                }
                                else str+='无';
                                return str;
                            },
                        },
                        trigger:{
                            player: ['loseBegin'],
                            global: ['loseAsyncBegin', 'equipBegin', 'gainBegin', 'addJudgeBegin'],
                        },
                        silent:true,
                        popup:false,
                        content:function(){
                            player.removeEquipTrigger();
                            var skills=[];
                            for(var i in lib.card){
                                if(get.type(i)!='equip') continue;
                                if(!lib.card[i].skills) continue;
                                var es=lib.card[i].skills.slice(0);
                                if(!Array.isArray(lib.card[i].skills)) es=[es];
                                for(var j of es){
                                    if(lib.skill[j]) skills.add(j);
                                }
                            }
                            skills.removeArray(Object.keys(player.disabledSkills));
                            player.disableSkill(skill,skills);
                        },
                        charlotte:true,
                        forced:true,
                        init:function(player,skill){
                            var skills=[];
                            for(var i in lib.card){
                                if(get.type(i)!='equip') continue;
                                if(!lib.card[i].skills) continue;
                                var es=lib.card[i].skills.slice(0);
                                if(!Array.isArray(lib.card[i].skills)) es=[es];
                                for(var j of es){
                                    if(lib.skill[j]) skills.add(j);
                                }
                            }
                            skills.removeArray(Object.keys(player.disabledSkills));
                            player.disableSkill(skill,skills);
                            player.addSkillBlocker(skill);
                            player.removeEquipTrigger();
                        },
                        onremove:function(player,skill){
                            player.removeSkillBlocker(skill);
                            player.enableSkill(skill);
                            player.addEquipTrigger();
                        },
                        skillBlocker:function(skill,player){
                            return !lib.skill[skill].charlotte;
                        },
                        mod: {
                            globalFrom: function (from, to, distance) {
                                var cards=from.getCards('e');
                                var num=0;
                                for(var i=0;i<cards.length;i++){
                                    var info = lib.card[cards[i].name];
                                    if (info && info.distance && info.distance.globalFrom) num -= info.distance.globalFrom;
                                }
                                return distance + num;
                            },
                            globalTo: function (from, to, distance) {
                                var cards=to.getCards('e');
                                var num=0;
                                for(var i=0;i<cards.length;i++){
                                    var info = lib.card[cards[i].name];
                                    if (info && info.distance && info.distance.globalTo) num -= info.distance.globalTo;
                                }
                                return distance + num;
                            },
                            /*attackFrom: function (from, to, distance) {
                                var cards=from.getCards('e');
                                var num=0;
                                for(var i=0;i<cards.length;i++){
                                    var info = lib.card[cards[i].name];
                                    if (info && info.distance && info.distance.attackFrom) num -= info.distance.attackFrom;
                                }
                                return distance + num;
                            },*/
                            attackRange:function(from,distance){
                                var cards=from.getCards('e');
                                var num=0;
                                for(var i=0;i<cards.length;i++){
                                    var info = lib.card[cards[i].name];
                                    if (info && info.distance && info.distance.attackFrom) num += info.distance.attackFrom;
                                }
                                return distance + num;
                            },
                            attackTo: function (from, to, distance) {
                                var cards=to.getCards('e');
                                var num=0;
                                for(var i=0;i<cards.length;i++){
                                    var info = lib.card[cards[i].name];
                                    if (info && info.distance && info.distance.attackTo) num -= info.distance.attackTo;
                                }
                                return distance + num;
                            },
                        },
                        ai:{
                            unequip2:true,
                        },
                    },
                },
            },
            ymhongyan:{
                trigger:{
                    player:['phaseBegin','ymtianxiangout'],
                    global:'phaseEnd',
                },
                audio:'rehongyan',
                forced:true,
                filter:function(event,player,name){
                    if(name=='phaseEnd') return player.countCards('h')<4;
                    return true;
                },
                intro:{
                    name:'红颜',
                    content:function (storage,player){
                        return '场上所有花色视为'+get.translation(player.storage.ymhongyan);
                    },
                },
                content:function(){
                    'step 0'
                    if(event.triggername=='phaseEnd'){player.drawTo(4);return}
                    player.chooseControl('spade', 'heart', 'club', 'diamond', '复原').set('prompt', '请选择游戏内所有牌的花色或复原所有花色').set('ai', function () {
                        var suit=['spade', 'heart' ,'club', 'diamond'];
                        if (player.countCards('j')==1){
                            if(player.getCards('j')[0].name=='lebu') return 'heart';
                            if(player.getCards('j')[0].name=='bingliang') return 'club';
                            if(player.getCards('j')[0].name=='caomu') return 'club';
                            if(player.getCards('j')[0].name=='guiyoujie') return 'heart';
                            if(player.getCards('j')[0].name=='shandian') return 'heart';
                        }
                        else if(player.countCards('j')>1) return '复原';
                        for(var i=0;i<suit.length;i++){
                            if(player.getHistory('custom', function (evt) {
                                return evt.ymtianxiang_name==suit[i];
                            }).length>=1) suit.remove(suit[i]);
                        }
                        return suit.randomGet();
                    });
                    'step 1'
                    switch(result.control){
                        case 'spade':player.storage.ymhongyan='spade';player.markSkill('ymhongyan');break;
                        case 'heart':player.storage.ymhongyan='heart';player.markSkill('ymhongyan');break;
                        case 'club':player.storage.ymhongyan='club';player.markSkill('ymhongyan');break;
                        case 'diamond':player.storage.ymhongyan='diamond';player.markSkill('ymhongyan');break;
                        case '复原':delete player.storage.ymhongyan;player.unmarkSkill('ymhongyan');break;
                    }
                    player.popup(result.control);
                    game.delay(1.5);
                },
                mod:{
                    maxHandcardBase:function(player,num){
                        return 4;
                    },
                },
                global:'ymhongyan_suit',
                subSkill:{
                    suit:{
                        mod:{
                            suit:function(card,suit){
                                if(game.hasPlayer(function(current){
                                    return current.hasSkill('ymhongyan');
                                })){
                                    var suitx;
                                    game.findPlayer(function (current) {
                                        if(current.storage.ymhongyan) suitx=current.storage.ymhongyan;
                                    });
                                    if(suitx) return suitx;
                                }
                            },
                        },
                    },
                },
            },
            ymyingzi:{
                trigger:{
                    player:['drawBegin','loseEnd'],
                },
                audio:'yingzi',
                filter:function(event,player,name){
                    if(name=='drawBegin') return true;
                    else{
                        var types=[];
                        player.getHistory('lose',function(evt){
                            var cards=evt.cards.slice(0);
                            cards.removeArray(event.cards);
                            if(cards && cards.length > 0) types.addArray(cards.map(function(card){
                                return get.type(card,'trick');
                            }));
                        });
                        for(var i=0;i<event.cards.length;i++){
                            if(!types.contains(get.type(event.cards[i],'trick'))) return true;
                        }
                    }
                },
                forced:true,
                content:function(){
                    if(event.triggername=='drawBegin') trigger.num++;
                    else{
                        var num=0;
                        var types=[];
                        player.getHistory('lose',function(evt){
                            var cards=evt.cards.slice(0);
                            cards.removeArray(trigger.cards);
                            if(cards && cards.length > 0) types.addArray(cards.map(function(card){
                                return get.type(card,'trick');
                            }));
                        });
                        for(var i=0;i<trigger.cards.length;i++){
                            if(!types.contains(get.type(trigger.cards[i],'trick'))) num++;
                        }
                        player.draw(num);
                        if(player.getHandcardLimit()<(player.countCards('h')+num)) player.chooseToDiscard('he',true,num);
                    }
                },
                mod: {
                    maxHandcardBase: function (player, num) {
                        return player.maxHp+player.maxHp;
                    },
                },
            },
            ymfanjian:{
                audio:'refanjian',
                enable:'phaseUse',
                usable:1,
                filterCard:true,
                discard:false,
                prepare:"give",
                position: "he",
                filterTarget:function(card,player,target){
                    return target!=player;
                },
                check:function(card){
                    return 6-get.value(card);
                },
                content:function(){
                    'step 0'
                    target.gain(cards,player);
                    'step 1'
                    var suit=get.suit(cards[0]);
                    target.loseHp(target.countCards('he',{suit:suit}));
                },
                ai:{
                    order:9,
                    result:{
                        target:function(player,target){
                            return -target.countCards('h');
                        },
                    },
                },
                group:'ymfanjian_gain',
                subSkill:{
                    gain:{
                        trigger:{
                            global:'gainBegin',
                        },
                        filter:function(event,player){
                            if(event.source!=player) return false;
                            if(event.player==player) return false;
                            return true;
                        },
                        check:function(event,player){
                            return get.attitude(event.player,player)<=0;
                        },
                        prompt:function(event,player){
                            return '是否发动【反间】令'+get.translation(event.player)+'猜测获得的牌包含的花色？';
                        },
                        content:function(){
                            'step 0'
                            var list=['spade', 'heart', 'club', 'diamond'];
                            trigger.player.chooseControl('spade', 'heart', 'club', 'diamond').set('prompt', '【反间】：请猜测'+get.translation(player)+'的这些牌中包含的花色').set('ai', function () {
                                return list.randomGet();
                            });
                            'step 1'
                            trigger.player.popup(result.control);
                            game.log(trigger.player,'选择了'+get.translation(result.control+2));
                            var suit=[]
                            for(var i=0;i<trigger.cards.length;i++){
                                suit.add(get.suit(trigger.cards[i]));
                            }
                            if(!suit.contains(result.control)){
                                trigger.player.discard(trigger.player.getCards('he').removeArray(trigger.player.getCards('he',{suit:result.control})));
                            }
                            else{
                                player.gainPlayerCard('he',true,trigger.player);
                            }
                        },
                    },
                },
            },
            ymqinyin:{
                trigger:{
                    player:['useCardEnd','respondEnd'],
                },
                audio:'qinyin',
                direct:true,
                filter:function(event,player){
                    if(event.card.number==7) return false;
                    var num1=0;
                    var num2=0;
                    player.getHistory('useCard',function(evt){
                        if(evt.card.number>7) num1++;
                        if(evt.card.number<7) num2++;
                    });
                    player.getHistory('respond',function(evt){
                        if(evt.card.number>7) num1++;
                        if(evt.card.number<7) num2++;
                    });
                    return (num1==3&&player.getHistory('custom', function (evt) {return evt.ymqinyin_name == 'damage';}).length==0)||(num2==3&&player.getHistory('custom', function (evt) {return evt.ymqinyin_name == 'recover';}).length==0);
                },
                mark:true,
                intro:{
                    name:'琴音',
                    content:function (storage,player,skill){
                        var str='';
                        var num1=0;
                        var num2=0;
                        player.getHistory('useCard',function(evt){
                            if(evt.card.number>7) num1++;
                            if(evt.card.number<7) num2++;
                        });
                        player.getHistory('respond',function(evt){
                            if(evt.card.number>7) num1++;
                            if(evt.card.number<7) num2++;
                        });
                        str+='<br><li>本回合使用和打出点数大于7的牌数：'+num1;
                        str+='<br><li>本回合使用和打出点数小于7的牌数：'+num2;
                        return str;
                    },
                },
                content:function(){
                    'step 0'
                    event.num1=0;
                    player.getHistory('useCard',function(evt){
                        if(evt.card.number>7) event.num1++;
                    });
                    player.getHistory('respond',function(evt){
                        if(evt.card.number>7) event.num1++;
                    });
                    player.getHistory('custom').push({ymqinyin_name: (event.num1==3?'damage':'recover')});
                    if(player.getHistory('custom', function (evt) {return evt.ymqinyin_name == 'damage';}).length>1) event.num1=0;
                    player.chooseTarget([1,3],get.prompt2(event.name), '选择1-3名角色'+(event.num1==3?'受到共3点伤害':'回复共3点体力'), function (card, player, target) {
                        return true;
                    }).set('ai', function (target) {
                        var player = _status.event.player;
                        if(event.num1==3) return -get.attitude(player,target);
                        else return get.recoverEffect(target, player, player) || get.attitude(target, player) > 0;
                    });
                    'step 1'
                    if(!result.bool||!result.targets) event.finish();
                    else if(result.targets.length==3){
                        player.logSkill(event.name,result.targets);
                        for(var i=0;i<result.targets.length;i++){
                            event.num1==3?result.targets[i].damage():result.targets[i].recover();
                        }
                        event.finish();
                    }
                    else if(result.targets.length==2){
                        event.targets=result.targets.slice(0);
                        player.logSkill(event.name,event.targets);
                        player.chooseTarget(true,get.prompt2(event.name), '选择1名角色'+(event.num1==3?'受到2点伤害':'回复2点体力'), function (card, player, target) {
                            return event.targets.contains(target);
                        }).set('ai', function (target) {
                            var player = _status.event.player;
                            if(event.num1==3) return -get.attitude(player,target);
                            else return get.recoverEffect(target, player, player) || get.attitude(target, player) > 0;
                        });
                    }
                    else if(result.targets.length==1){
                        player.logSkill(event.name,result.targets);
                        event.num1==3?result.targets[0].damage(3):result.targets[0].recover(3);
                        event.finish();
                    }
                    'step 2'
                    if(result.targets){
                        event.num1==3?result.targets[0].damage(2):result.targets[0].recover(2);
                        event.targets.remove(result.targets[0]);
                        event.num1==3?event.targets[0].damage():event.targets[0].recover();
                    }
                },
            },
            ymyuhun:{
                enable:"phaseUse",
                usable:1,
                charlotte:true,
                fixed:true,
                audio:"lihun",
                locked:true,
                filterCard:function (card) {
                    var num = 4 - (_status['ymyuhun_zuo'].length+_status['ymyuhun_you'].length);
                    if (ui.selected.cards.length >= num) return false;
                    var suit = get.suit(card);
                    for (var i = 0; i < ui.selected.cards.length; i++) {
                        if (get.suit(ui.selected.cards[i]) == suit) return false;
                    }
                    return true;
                },
                selectCard:[1,4],
                check:function (card) {
                    return 8 - get.value(card);
                },
                complexCard:true,
                prompt:"弃置任意张不同花色的牌后令场上增加等量名你的【傀儡】",
                init:function (player) {
                    if (!player.storage.ymyuhun_kuilei) player.storage.ymyuhun_kuilei = ['nan', 'nv'];
                    _status.ymyuhun_zuo = [];
                    _status.ymyuhun_you = [];
                    lib.translate['qy_qynvkuilei']='傀儡·女';
                    lib.translate['qy_qynankuilei']='傀儡·男';
                    lib.character.qy_qynvkuilei = ['female', 'qun', 3, ['ymyuhun_init'], ['character:ns_nanhua_right', 'unseen']];
                    lib.character.qy_qynankuilei = ['male', 'qun', 3, ['ymyuhun_init'], ['character:ns_nanhua_left', 'unseen']];
                },
                filter:function (event, player) {
                    return _status['ymyuhun_zuo'].length+_status['ymyuhun_you'].length<4;
                },
                onremove:function () {
                    game.countPlayer(function (current) {
                        if ((_status['ymyuhun_zuo'].concat(_status['ymyuhun_you'])).contains(current)&&current.master&&current.master==player) {
                            current.die()._triggered = null;
                            game.delay(2);
                            current.remove();
                            _status['ymyuhun_zuo'].remove(current);
                            _status['ymyuhun_you'].remove(current);
                        }
                    });
                },
                content:function () {
                    'step 0'
                    event.num = cards.length;
                    'step 1'
                    if (_status['ymyuhun_zuo'].action === false) {
                        _status['ymyuhun_zuo'].action = true;
                    } else {
                        _status['ymyuhun_zuo'].action = false;
                    }
                    var action = _status['ymyuhun_zuo'].action,
                        length = _status['ymyuhun_you'].length + 1;
                    var fellow = game.addFellow(action ? 1 : game.players.length + game.dead.length - _status['ymyuhun_you'].length, `qy_qy${player.storage.ymyuhun_kuilei.randomGet()}kuilei`);
                    fellow.classList.add('minskin');
                    fellow.side = player.side;
                    fellow.master = player;
                    if (action) {
                        game.players.remove(fellow);
                        game.players.unshift(fellow);
                        game.arrangePlayers();
                    }
                    var left = 80;
                    if(action){
                        left = 600;
                    }
                    if(_status[!action ? 'ymyuhun_zuo' : 'ymyuhun_you'].length>0) left += 150;
                    fellow.css({
                        pointerEvents: 'auto',
                        top: '45vh',
                        left: left + 'px',
                    });
                    ui.arena.appendChild(fellow);
                    _status[!action ? 'ymyuhun_zuo' : 'ymyuhun_you'].add(fellow);
                    fellow.identity = player.identity;
                    if (fellow.identity === 'zhu') fellow.identity = 'zhong';
                    if (fellow.identity === 'nei') fellow.identity='？';
                    fellow.setIdentity('傀儡');
                    fellow.node.identity.dataset.color = 'black';
                    if (get.mode() == 'doudizhu') {
                        fellow.identity = player.identity;
                        fellow.setIdentity('傀儡');
                    }
                    event.num--;
                    'step 2'
                    if (event.num > 0) event.goto(1);
                    else event.finish();
                },
                mod:{
                    globalFrom:function (from, to, distance) {
                        var players=_status['ymyuhun_zuo'].concat(_status['ymyuhun_you']);
                        if(players) return distance - players.length;
                    },
                    targetEnabled:function (card, player, target, now) {
                        var players=_status['ymyuhun_zuo'].concat(_status['ymyuhun_you']);
                        if (players && players.length) {
                            if (players.contains(player)) return false;
                        }
                    },
                    playerEnabled:function (card, player, target) {
                        if (_status['ymyuhun_zuo'].concat(_status['ymyuhun_you']).contains(target)&&target.master&&target.master==player) {
                            return false;
                        }
                    },
                },
                ai:{
                    order:12,
                    result:{
                        player:1,
                    },
                },
                group:['ymyuhun_die','ymyuhun_equip','ymyuhun_use','ymyuhun_win'],
                subSkill:{
                    init:{
                        trigger:{
                            global:"roundStart",
                        },
                        silent:true,
                        forced:true,
                        popup:false,
                        charlotte:true,
                        init:function(player){
                            player.addSkill('ymyuhun_remove');
                        },
                        onremove:function(player){
                            player.addSkill('ymyuhun_remove');
                        },
                        content:function () {
                            var num=[1,2].randomGet();
                            if(num==1) player.gainMaxHp();
                            else player.recover();
                        },
                    },
                    remove:{
                        trigger:{
                            player:["die","phaseBefore"],
                        },
                        silent:true,
                        forced:true,
                        popup:false,
                        forceDie:true,
                        fixed:true,
                        charlotte:true,
                        init:function(player){
                            player.addSkill('ymyuhun_init');
                        },
                        onremove:function(player){
                            player.addSkill('ymyuhun_init');
                        },
                        filter:function (event, player) {
                            return _status['ymyuhun_zuo'].concat(_status['ymyuhun_you']).contains(player);
                        },
                        content:function () {
                            if(event.triggername=='phaseBefore'){
                                trigger.cancel();
                                player.draw(2);
                            }
                            else{
                                player.master.removeAdditionalSkill(player.name1)
                                player.remove();
                                _status['ymyuhun_zuo'].remove(player);
                                _status['ymyuhun_you'].remove(player);
                            }
                        },
                        mod:{
                            playerEnabled:function (card, player, target) {
                                if (_status['ymyuhun_zuo'].concat(_status['ymyuhun_you']).contains(target)&&target!=player) {
                                    return false;
                                }
                            },
                            globalFrom:function (from, to, distance) {
                                return distance - _status['ymyuhun_zuo'].length-_status['ymyuhun_you'].length;
                            },
                        },
                    },
                    die:{
                        trigger:{
                            player:"die",
                        },
                        silent:true,
                        charlotte:true,
                        forced:true,
                        popup:false,
                        forceDie:true,
                        filter:function (event, player) {
                            var players=_status['ymyuhun_zuo'].concat(_status['ymyuhun_you']);
                            if (!players || !players.length) {
                                return false;
                            }
                            return true;
                        },
                        content:function () {
                            var players=_status['ymyuhun_zuo'].concat(_status['ymyuhun_you']);
                            game.countPlayer(function (current) {
                                if (players.contains(current)&&current.master&&current.master==player) {
                                    current.die();
                                    game.delay(2);
                                    current.remove();
                                    _status['ymyuhun_zuo'].remove(current);
                                    _status['ymyuhun_you'].remove(current);
                                }
                            });
                        },
                    },
                    equip:{
                        trigger:{
                            global:["equipEnd","loseEnd","ymyuhunAfter","changeHp","loseBegin"],
                        },
                        forced:true,
                        charlotte:true,
                        popup:false,
                        silent:true,
                        filter:function (event, player, name) {
                            var players=_status['ymyuhun_zuo'].concat(_status['ymyuhun_you']);
                            if (!players || !players.length) return false;
                            if (name == 'loseEnd') {
                                for (var i = 0; i < event.cards.length; i++) {
                                    if (event.cards[i].original == 'e') return true;
                                }
                            } else return true;
                        },
                        content:function () {
                            var info = [];
                            var es = player.getCards('e');
                            var equips = [];
                            for (var i = 0; i < es.length; i++) {
                                if (es[i].clearLose) continue;
                                equips.add(es[i].name);
                                var skill = lib.card[es[i].name].skills;
                                if (skill && skill.length > 0) info.addArray(skill);
                            }
                            var players=_status['ymyuhun_zuo'].concat(_status['ymyuhun_you']);
                            game.countPlayer(function (current) {
                                if (players.contains(current)&&current.master&&current.master==player) {
                                    current.storage.ymyuhun_equip = equips;
                                    current.addSkill('ymyuhun_equip');
                                    current.markSkill('ymyuhun_equip');
                                    current.removeAdditionalSkill('ymyuhun_equip');
                                    current.addAdditionalSkill('ymyuhun_equip', info, true);
                                    current.master.addAdditionalSkill(current.name1, current.skills.filter(value => ['ymhuajing', 'ymdujie', 'ymyuhun_init', 'ymyuhun_remove',].contains(value) === false), true);
                                }
                            });
                        },
                        mod:{
                            globalFrom:function (from, to, distance) {
                                var num = 0;
                                if(!from.storage.ymyuhun_equip) return;
                                for (var i = 0; i < from.storage.ymyuhun_equip.length; i++) {
                                    var info = lib.card[from.storage.ymyuhun_equip[i]];
                                    if (info && info.distance && info.distance.globalFrom) num += info.distance.globalFrom;
                                }
                                return distance + num;
                            },
                            globalTo:function (from, to, distance) {
                                var num = 0;
                                if(!to.storage.ymyuhun_equip) return;
                                for (var i = 0; i < to.storage.ymyuhun_equip.length; i++) {
                                    var info = lib.card[to.storage.ymyuhun_equip[i]];
                                    if (info && info.distance && info.distance.globalTo) num += info.distance.globalTo;
                                }
                                return distance + num;
                            },
                            attackFrom:function (from, to, distance) {
                                var num = 0;
                                if(!from.storage.ymyuhun_equip) return;
                                for (var i = 0; i < from.storage.ymyuhun_equip.length; i++) {
                                    var info = lib.card[from.storage.ymyuhun_equip[i]];
                                    if (info && info.distance && info.distance.attackFrom) num += info.distance.attackFrom;
                                }
                                return distance + num;
                            },
                            attackRange:function(from,distance){
                                var num = 0;
                                if(!from.storage.ymyuhun_equip) return;
                                for (var i = 0; i < from.storage.ymyuhun_equip.length; i++) {
                                    var info = lib.card[from.storage.ymyuhun_equip[i]];
                                    if (info && info.distance && info.distance.attackFrom) num += info.distance.attackFrom;
                                }
                                return distance - num;
                            },
                            attackTo:function (from, to, distance) {
                                var num = 0;
                                if(!to.storage.ymyuhun_equip) return;
                                for (var i = 0; i < to.storage.ymyuhun_equip.length; i++) {
                                    var info = lib.card[to.storage.ymyuhun_equip[i]];
                                    if (info && info.distance && info.distance.attackTo) num += info.distance.attackTo;
                                }
                                return distance + num;
                            },
                        },
                        marktext:"魂",
                        intro:{
                            content:function (storage, player, skill) {
                                var str='<li>当前装备：' + get.translation(player.storage.ymyuhun_equip)+'<br>–––––––––––––––––––––––';
                                for (var i = 0; i < player.storage.ymyuhun_equip.length; i++) {
                                    str += '<br>*<span class="bluetext">【'+lib.translate[player.storage.ymyuhun_equip[i]]+'】：' + lib.translate[player.storage.ymyuhun_equip[i] + '_info']+'</span>';
                                }
                                return str;
                            },
                            onunmark:function (storage, player) {
                                player.removeAdditionalSkill('ymyuhun_equip');
                                delete player.storage.ymyuhun_equip;
                                player.addEquipTrigger();
                            },
                        },
                    },
                    use:{
                        trigger:{
                            player:'useCardAfter',
                        },
                        filter:function(event,player){
                            if(!['trick','basic'].contains(get.type(event.card))) return false;
                            var players=_status['ymyuhun_zuo'].concat(_status['ymyuhun_you']);
                            return players&&players.length;
                        },
                        forced:true,
                        content:function(){
                            'step 0'
                            var players=_status['ymyuhun_zuo'].concat(_status['ymyuhun_you']);
                            game.countPlayer(function (current) {
                                if (!players.contains(current)||!current.master||current.master!=player) {
                                    players.remove(current);
                                }
                            });
                            event.num=0;
                            event.kuilei=players;
                            'step 1'
                            event.targets=trigger.targets.slice(0);
                            for(var i=0;i<event.targets.length;i++){
                                if(!event.kuilei[event.num].canUse(trigger.card, event.targets[i], false, false)||!event.targets[i].isAlive()){
                                    event.targets.remove(event.targets[i]);
                                }
                            }
                            var card=game.createCard(trigger.card);
                            if(trigger.targets.length==1&&trigger.targets[0]==player) event.kuilei[event.num].useCard(card,event.kuilei[event.num],false);
                            else if(event.targets.length) event.kuilei[event.num].useCard(card,event.targets,false);
                            event.num++;
                            if(event.num<event.kuilei.length) event.redo();
                        },
                    },
                    win:{
                        trigger:{
                            global:['dieBegin','die','phaseAfter'],
                        },
                        silent:true,
                        popup:false,
                        forced:true,
                        filter:function(event,player,name){
                            var mode = get.mode();
                            var players=_status['ymyuhun_zuo'].concat(_status['ymyuhun_you']);
                            if (!players||!players.length) return false;
                            if (mode == 'identity'&&name=='dieBegin'&&player.identity=='nei'){
                                return game.players.length-players.length<=2&&event.player!=player;
                            }
                            else if(name == 'die' || name == 'phaseAfter') return player.getEnemies().length == 0;
                        },
                        content:function(){
                            'step 0'
                            game.delay();
                            'step 1'
                            if (game.showIdentity) {
                                game.showIdentity();
                            }
                            if (player.isUnderControl(true) || player.getFriends().contains(game.me)) {
                                game.over(true);
                            } else {
                                game.over(true);
                            }
                        },
                    },
                },
            },
            ymkongshen:{
                trigger:{
                    player:'phaseEnd',
                },
                audio:'biyue',
                content:function(){
                    'step 0'
                    if(game.roundNumber%2==1){
                        player.draw(2);
                        event.finish();
                    }
                    else{
                        player.chooseTarget(get.prompt2(event.name), '选择1名【傀儡】替换武将牌', function (card, player, target) {
                            var players=_status['ymyuhun_zuo'].concat(_status['ymyuhun_you']);
                            return players&&players.contains(target)&&target.master&&target.master==_status.event.player;
                        }).set('ai', function (target) {
                            if(['qy_qynvkuilei','qy_qynankuilei'].contains(target.name1)) return target;
                            return Math.random();
                        });
                    }
                    'step 1'
                    if(result.bool){
                        var list=[];
                        var list2=[];
                        var players=game.players.concat(game.dead);
                        for(var i=0;i<players.length;i++){
                            list2.add(players[i].name);
                            list2.add(players[i].name1);
                            list2.add(players[i].name2);
                        }
                        for(var i in lib.character){
                            if(lib.character[i][4].contains('qyboss')) continue;
                            if(lib.character[i][0]!=result.targets[0].sex) continue;
                            if(lib.character[i][4].contains('minskin')) continue;
                            if(list2.contains(i)) continue;
                            list.push(i);
                        }
                        result.targets[0].master.removeAdditionalSkill(result.targets[0].name1);
                        var hp=result.targets[0].hp;
                        var maxHp=result.targets[0].maxHp;
                        result.targets[0].init(list.randomGet()).classList.add('minskin');
                        result.targets[0].hp=hp;
                        result.targets[0].maxHp=maxHp;
                        result.targets[0].update();
                        result.targets[0].master.addAdditionalSkill(result.targets[0].name1, result.targets[0].skills.filter(value => ['ymhuajing', 'ymdujie', 'ymyuhun_init', 'ymyuhun_remove'].contains(value) === false), true);
                    }
                },
            },
            ymkurou:{
                enable: "phaseUse",
                audio: "rekurou",
                logv:false,
                visible:true,
                prompt:"重铸一张牌并失去一点体力",
                filter: function(event, player) {
                    return (player.getStat().skill.ymkurou || 0) < (event.ymkurou_num || 0);
                },
                mark:true,
                marktext:'苦',
                intro:{
                    content:function(storage,player,skill){
                        var str='本回合剩余【苦肉】次数：'
                        var num=0;
                        if(player.isMaxHp()) num++;
                        if(player.isMaxHandcard()) num++;
                        if(player.getHistory("sourceDamage").length==0) num++;
                        str+=(num-(player.getStat().skill.ymkurou||0)>0?num-(player.getStat().skill.ymkurou||0):0);
                        if(!player.isMaxHp()) str+='<br><li>体力值不为全场最高';
                        if(!player.isMaxHandcard()) str+='<br><li>手牌数不为全场最多';
                        if(player.getHistory("sourceDamage").length>0) str+='<br><li>本回合已造成伤害';
                        return str;
                    },
                },
                onChooseToUse: function(event) {
                    if (game.online) return;
                    var num = 0;
                    var evt2 = event.getParent();
                    var player=_status.event.player;
                    if(player.isMaxHp()) num++;
                    if(player.isMaxHandcard()) num++;
                    if(player.getHistory("sourceDamage").length==0) num++;
                    event.set('ymkurou_num', num);
                },
                filterCard:function(card,player){
                    var mod=game.checkMod(card,player,'unchanged','cardChongzhuable',player);
                    if(mod!='unchanged') return mod;
                    return true;;
                },
                position: "he",
                prepare:function(cards,player){
                    player.$throw(cards,1000);
                    game.log(player,'将',cards,'置入了弃牌堆');
                },
                check:function(card){
                    return 6-get.value(card);
                },
                discard:false,
                loseTo:"discardPile",
                delay:0.5,
                content:function(){
                    "step 0"
                    if(lib.config.mode=='stone'&&_status.mode=='deck'&&!player.isMin()&&get.type(cards[0]).indexOf('stone')==0){
                        var list=get.stonecard(1,player.career);
                        if(list.length){
                            player.gain(game.createCard(list.randomGet()),'draw');
                        }
                        else{
                            player.draw({drawDeck:1})
                        }
                    }
                    else if(get.subtype(cards[0])=='spell_gold'){
                        var list=get.libCard(function(info){
                            return info.subtype=='spell_silver';
                        });
                        if(list.length){
                            player.gain(game.createCard(list.randomGet()),'draw');
                        }
                        else{
                            player.draw();
                        }
                    }
                    else if(get.subtype(cards[0])=='spell_silver'){
                        var list=get.libCard(function(info){
                            return info.subtype=='spell_bronze';
                        });
                        if(list.length){
                            player.gain(game.createCard(list.randomGet()),'draw');
                        }
                        else{
                            player.draw();
                        }
                    }
                    else{
                        player.draw();
                    }
                    "step 1"
                    player.loseHp();
                    player.storage.ymkurou=player.getStat().skill.ymkurou;
                },
                ai: {
                    order: 9,
                    result:{
                        player:function(player){
                            if(player.hp<=2) return player.countCards('h')==0?1:0;
                            if(player.countCards('h',{name:'sha'})) return 1;
                            return player.countCards('h')<=player.hp?1:0;
                        },
                    },
                    effect:function(card,player,target){
                        if(get.tag(card,'damage')){
                            if(player.hasSkillTag('jueqing',false,target)) return [1,1];
                            return 1.2;
                        }
                        if(get.tag(card,'loseHp')){
                            if(player.hp<=1) return;
                            return [0,0];
                        }
                    },
                },
                group:'ymkurou_recover',
                subSkill:{
                    recover:{
                        trigger:{
                            player:'phaseEnd',
                        },
                        forced:true,
                        audio:'rekurou',
                        filter:function(event,player){
                            if(player.storage.ymkurou&&player.storage.ymkurou<3) return true;
                        },
                        content:function(){
                            player.recover(player.storage.ymkurou);
                            delete player.storage.ymkurou;
                        },
                    },
                },
            },
            ymzhaxiang:{
                trigger:{
                    player:'loseHpEnd',
                    source:'damageBegin1',
                },
                audio:'zhaxiang',
                forced:true,
                filter:function(event,player,name){
                    if(name=='damageBegin1') return player.getHistory('sourceDamage').length==0&&player.hp<player.maxHp;
                    else return true;
                },
                content:function(){
                    'step 0'
                    if(event.triggername=="damageBegin1"){
                        trigger.num+=(player.maxHp-player.hp);
                        event.finish();
                    }
                    else{
                        event.num=trigger.num;
                        event.cards=[];
                    }
                    'step 1'
                    var num=[1,2,3].randomGet();
                    for(var i=0;i<num;i++){
                        var card = get.cardPile(function (card) {
                            return get.tag(card, 'damage')&&!event.cards.contains(card);
                        });
                        if(card) event.cards.add(card);
                    }
                    player.getHistory('custom').push({ymzhaxiang_name: 'loseHp'});
                    event.num--;
                    if(event.num>0) event.redo();
                    'step 2'
                    player.gain(event.cards,'draw');
                    var num=player.getHistory('custom', function (evt) {
                        return evt.ymzhaxiang_name == 'loseHp';
                    }).length;
                    player.addTempSkill('ymzhaxiang_mark');
                    if(num>=1) player.addTempSkill('ymzhaxiang_distance');
                    if(num>=2) player.addTempSkill('ymzhaxiang_usecard');
                    if(num>=3) player.addTempSkill('ymzhaxiang_nature');
                },
                mod:{
                    cardUsable: function (card, player, num) {
                        var count=player.getHistory('custom', function (evt) {
                            return evt.ymzhaxiang_name == 'loseHp';
                        }).length;
                        var info=get.info(card);
                        if(get.tag(card, 'damage')&&info.usable) return num+count;
                    },
                },
                subSkill:{
                    mark:{
                        mark:true,
                        charlotte:true,
                        onremove:true,
                        intro:{
                            content:function(storage,player,skill){
                                var str='';
                                var count=player.getHistory('custom', function (evt) {
                                    return evt.ymzhaxiang_name == 'loseHp';
                                }).length;
                                if(count>0) str+='<br><li>「伤害」标签的牌使用次数+'+count;
                                if(player.hasSkill('ymzhaxiang_distance')) str+='<br><li>「伤害」标签的牌无距离限制';
                                if(player.hasSkill('ymzhaxiang_usecard')) str+='<br><li>「伤害」标签的牌不能被响应';
                                if(player.hasSkill('ymzhaxiang_nature')) str+='<br><li>「伤害」标签的属性牌视为火属性，「伤害」标签的普通牌无视防具';
                                return str;
                            },
                        },
                    },
                    distance:{
                        charlotte:true,
                        mod:{
                            targetInRange:function (card,player,target,now){
                                if(get.tag(card, 'damage')) return true;
                            },
                        },
                    },
                    usecard:{
                        trigger:{
                            player:"useCard",
                        },
                        forced:true,
                        charlotte:true,
                        filter:function(event,player){
                            return event.card&&get.tag(event.card, 'damage');
                        },
                        content:function(){
                            trigger.directHit.addArray(game.players);
                        },
                        ai:{
                            "directHit_ai":true,
                            skillTagFilter:function(player,tag,arg){
                                return get.tag(arg.card, 'damage');
                            },
                        },
                    },
                    nature:{
                        charlotte:true,
                        mod:{
                            cardnature:function(card,player){
                                if(card.nature&&get.tag(card, 'damage')) return 'fire';
                            },
                        },
                        ai:{
                            unequip:true,
                            skillTagFilter:function(player,tag,arg){
                                if(!arg||!arg.card||arg.card.nature||!get.tag(arg.card, 'damage')) return false;
                            },
                        },
                    },
                },
            },
            ymwushuang: {
                audio: "wushuang",
                enable: "chooseToUse",
                filter: function(event, player) {
                    if(event.type=='wuxie'||!player.countCards('hse')) return false;
                    for(var i=0;i<lib.inpile.length;i++){
                        var name=lib.inpile[i];
                        if(name!='wuxie'&&name!='shan'&&event.filterCard({name:name},player,event)) return true;
                    }
                    return false;
                },
                hiddenCard: function(player, name) {
                    return (player.getHistory('custom', function (evt) {return evt.ymwushuang_name == name;}).length<=0 && lib.inpile.contains(name))&&name!='shan'&&name!='wuxie';
                },
                locked:true,
                chooseButton: {
                    dialog: function(event, player) {
                        var list = [];
                        for (var i = 0; i < lib.inpile.length; i++) {
                            var name = lib.inpile[i];
                            if(player.getHistory('custom', function (evt) {
                                return evt.ymwushuang_name == name;
                            }).length>0) continue;
                            if(_status.dying.length>0){
                                if(lib.card[name].savable!=true) continue;
                            }
                            else{
                                if(lib.card[name].selectTarget==-1&&!lib.card[name].toself) continue;
                            }
                            if (name == 'sha') {
                                list.push(['基本', '', 'sha']);
                                list.push(['基本', '', 'sha', 'fire']);
                                list.push(['基本', '', 'sha', 'thunder']);
                                list.push(['基本', '', 'sha', 'ice']);
                                list.push(['基本', '', 'sha', 'kami']);
                            }
                            else if (get.type(name) == 'trick') list.push(['锦囊', '', name]);
                            else if (get.type(name) == 'basic') list.push(['基本', '', name]);
                        }
                        if (list.length == 0) {
                            return ui.create.dialog('无可用牌');
                        }
                        return ui.create.dialog('无双', [list, 'vcard']);
                    },
                    filter: function(button, player) {
                        return _status.event.getParent()
                            .filterCard({
                            name: button.link[2]
                        }, player, _status.event.getParent());
                    },
                    check: function(button) {
                        var player = _status.event.player;
                        var effect = player.getUseValue(button.link[2]);
                        if(button.link[2]=='shunshou') effect*1.5;
                        if(button.link[2]=='wuzhong') effect=30;
                        if(button.link[2]=='juedou') effect*10;
                        if(button.link[2]=='jiu') effect=10;
                        if(button.link[2]=='sha') effect*5;
                        if(button.link[2]=='tiesuo') effect=1;
                        if(get.type(button.link[2])=='basic') effect*2;
                        if(get.type(button.link[2])=='trick') effect*0.8;
                        if (effect > 0) return effect;
                        return 0;
                    },
                    backup: function(links, player) {
                        return {
                            audio: 'wushuang',
                            popname: true,
                            check: function(card) {
                                return 4 - get.value(card);
                            },
                            position: 'hes',
                            filterCard:true,
                            selectCard:[1,3],
                            viewAs: {
                                name: links[0][2],
                                nature: links[0][3]
                            },
                            viewAsFilter:function (player){
                                if(player.countCards('hes')<=0) return false;
                            },
                            onuse: function(result, player) {
                                if(get.type(result.card)=='trick') player.getHistory('custom').push({ymwushuang_name: result.card.name});
                            },
                        }
                    },
                    prompt: function(links, player) {
                        return '将至多三张牌当做' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]) + '使用';
                    },
                },
                mod:{
                    selectTarget:function (card,player,range){
                        if(['basic','trick'].contains(get.type(card))&&!card.isCard&&range[1]!=-1) range[1]=ui.selected.cards.length;
                    },
                    targetInRange:function(card,player,target,now){
                        if(['basic','trick'].contains(get.type(card))&&!card.isCard) return true;
                    },
                },
                ai: {
                    order: 9,
                    result: {
                        player: function(player) {
                            var allshown = true,
                                players = game.filterPlayer();
                            for (var i = 0; i < players.length; i++) {
                                if (players[i].ai.shown == 0) {
                                    allshown = false;
                                }
                                if (players[i] != player && players[i].countCards('h') && get.attitude(player, players[i]) > 0) {
                                    return 1;
                                }
                            }
                            if (allshown) return 1;
                            return 0;
                        },
                    },
                    threaten: 1,
                },
                group:'ymwushuang_use',
                subSkill:{
                    use:{
                        trigger:{
                            player:'useCardAfter',
                        },
                        forced:true,
                        audio: "wushuang",
                        filter:function(event,player){
                            if(!event.cards) return false;
                            if(event.cards.length == 1) return false;
                            if(event.card.isCard) return false;
                            if(!['basic','trick'].contains(get.type(event.card))) return false;
                            var card = event.cards[0];
                            if(get.itemtype(event.cards)!='cards') return false;
                            if(get.position(card,true) != 'o') return false;
                            if(!lib.card[card.name]) return false;
                            if (event.parent.name == 'ymwushuang_use') return false;
                            if(event.cards.length-event.targets.length<1) return false;
                            var targets=event._targets||event.targets;
                            for(var i=0;i<targets.length;i++){
                                if(targets[i].isDying()&&lib.card[event.card.name].savable) return true;
                                if(targets[i].isIn()&&player.canUse(event.card,targets[i],false,false)) return true;
                            }
                        },
                        content:function(){
                            'step 0'
                            event.card=game.createCard(trigger.card.name, trigger.card.suit, trigger.card.number, trigger.card.nature);
                            event.num=trigger.cards.length-trigger.targets.length;
                            'step 1'
                            var targets = trigger._targets || trigger.targets;
                            for (var i = 0; i < targets.length; i++) {
                                if(targets[i].isDying()&&lib.card[trigger.card.name].savable) continue;
                                if (!targets[i].isIn() || !player.canUse(trigger.card, targets[i], false, false)) targets.remove(targets[i]);
                            }
                            player.useCard({
                                name: event.card.name,
                                suit: event.card.suit,
                                number: event.card.number,
                                nature: event.card.nature,
                                isCard: true
                            }, targets, false);
                            player.$throw(event.card, 1000);
                            'step 2'
                            event.num--;
                            if(event.num>0) event.goto(1);
                            else event.finish();
                        },
                    },
                },
            },
            ymbaonu:{
                trigger:{
                    player:'useCard',
                    source:'damageBefore',
                    global:'phaseUseBegin',
                },
                forced:true,
                audio:'baonu',
                mark:true,
                intro:{
                    content:function(storage,player,skill){
                        var str='本回合使用基本牌和【决斗】的次数：';
                        var num=player.getHistory('useCard',function(evt){
                            return get.type(evt.card)=='basic'||evt.card.name=='juedou';
                        }).length;
                        return (str+num);
                    },
                },
                filter:function(event,player,name){
                    if(name=='useCard') return game.hasPlayer(function(current){
                        return current!=player&&current.hp>=player.hp&&event.targets.contains(current);
                    });
                    if(name=='damageBefore') return event.player.hp<=player.hp;
                    if(name=='phaseUseBegin') return player.hp<player.maxHp;
                },
                content:function(){
                    if(event.triggername=='useCard'){
                        trigger.directHit.addArray(game.filterPlayer(function(current){
                            return current!=player&&current.hp>=player.hp&&trigger.targets.contains(current);
                        }));
                    }
                    if(event.triggername=='damageBefore'){
                        var num=Math.max(1,Math.ceil(player.getHistory('useCard',function(evt){
                            return get.type(evt.card)=='basic'||evt.card.name=='juedou';
                        }).length/2));
                        player.markSkill(event.name);
                        trigger.num+=num;
                    }
                    if(event.triggername=='phaseUseBegin'){
                        var num=[];
                        for(var i=1;i<(player.maxHp-player.hp+1);i++){
                            num.push(i);
                        }
                        player.draw(num.randomGet()*2);
                    }
                },
                ai:{
                    unequip:true,
                    skillTagFilter:function (player, tag, arg) {
                        if (!arg || !arg.card || !arg.target || arg.target == player || arg.target.hp < player.hp) return false;
                    },
                },
            },
            ymjushou:{
                trigger:{
                    player:'damageEnd',
                    source:'damageEnd',
                },
                audio:'xinjiewei',
                locked:true,
                filter:function(event,player){
                    return true;
                },
                content:function(){
                    'step 0'
                    player.turnOver();
                    player.draw();
                    event.num=0;
                    event.players=[];
                    event.players.add(player);
                    if(player.storage.ymlizhan) event.players.addArray(player.storage.ymlizhan);
                    event.players.sort(lib.sort.seat);
                    'step 1'
                    if(event.num<event.players.length){
                        var list = [];
                        if (game.hasPlayer(function(current) {
                            return event.players[event.num].canUse('sha', current,false);
                        })) {
                            list.push(['基本', '', 'sha']);
                            list.push(['基本', '', 'sha', 'stab']);
                        }
                        for (var i of lib.linked) {
                            if (game.hasPlayer(function(current) {
                                return event.players[event.num].canUse({name: 'sha',nature: i}, current,false);
                            })) {
                                list.push(['基本', '', 'sha', i]);
                            }
                        }
                        if (lib.filter.cardUsable({name: 'tao'}, event.players[event.num], event.getParent('chooseToUse')) && game.hasPlayer(function(current) {
                            return event.players[event.num].canUse('tao', current,false);
                        })) {
                            list.push(['基本', '', 'tao']);
                        }
                        for(var i=0;i<list.length;i++){
                            if(player.getHistory('custom', function (evt) {
                                var name=list[i][2]+list[i][3]
                                return evt.ymjushou_name==name;
                            }).length>0) list.splice(i--,1);
                        }
                        if (list.length) {
                            if(!event.log){
                                player.logSkill(event.name,event.players);
                                event.log=true;
                            }
                            event.players[event.num].chooseButton(['是否视为使用一张【杀】或【桃】？', [list, 'vcard']]).set('ai', function(button) {
                                var player = _status.event.player;
                                var card = {name: button.link[2],nature: button.link[3]};
                                if (card.name == 'tao') {
                                    if (event.players[event.num].hp == 1 || (event.players[event.num].hp == 2 && !event.players[event.num].hasShan()) || event.players[event.num].needsToDiscard()) {
                                        return 5;
                                    }
                                    return 1;
                                }
                                else if (card.name == 'sha') {
                                    if (game.hasPlayer(function(current) {
                                        return event.players[event.num].canUse(card, current) && get.effect(current, card, event.players[event.num], event.players[event.num]) > 0
                                    })) {
                                        if (card.nature == 'kami') return 4.9;
                                        if (card.nature == 'fire') return 2.95;
                                        if (card.nature == 'thunder' || card.nature == 'ice') return 2.92;
                                        return 2.9;
                                    }
                                    return 0;
                                }
                                else return get.useful(card);
                            });
                        }
                        else {
                            event.finish();
                        }
                    }
                    else event.finish();
                    'step 2'
                    if(result&&result.bool&&result.links[0]){
                        var card={name:result.links[0][2],nature:result.links[0][3]};
                        var name=result.links[0][2]+result.links[0][3];
                        player.getHistory('custom').push({ymjushou_name:name});
                        event.players[event.num].chooseUseTarget(card,false,'nodistance');
                        event.players[event.num].draw();
                    }
                    'step 3'
                    event.num++;
                    if(event.num<event.players.length) event.goto(1);
                    else event.finish();
                },
                group:'ymjushou_turn',
                subSkill:{
                    turn:{
                        trigger:{
                            player:['_turnoverBefore','phaseBefore','turnOverEnd'],
                        },
                        audio:"kuiwei",
                        filter:function(event,player,name){
                            if(name=='_turnoverBefore') return player.isTurnedOver();
                            if(name=='phaseBefore') return player.isTurnedOver();
                            if(name=='turnOverEnd') return true;
                        },
                        forced:true,
                        silent:true,
                        popup:false,
                        content:function(){
                            if(event.triggername=='_turnoverBefore'){
                                trigger.finish();
                                player.logSkill(event.name);
                            }
                            if(event.triggername=='phaseBefore'){
                                player.phaseSkipped=false;
                                if((player==_status.roundStart||_status.roundSkipped)&&!trigger.skill){
                                    delete _status.roundSkipped;
                                    game.roundNumber++;
                                    trigger._roundStart=true;
                                    game.updateRoundNumber();
                                    for(var i=0;i<game.players.length;i++){
                                        if(game.players[i].isOut()&&game.players[i].outCount>0){
                                            game.players[i].outCount--;
                                            if(game.players[i].outCount==0&&!game.players[i].outSkills){
                                                game.players[i].in();
                                            }
                                        }
                                    }
                                    event.trigger('roundStart');
                                }
                            }
                            if(event.triggername=='turnOverEnd'){
                                if(player.isTurnedOver()){
                                    player.node.turnedover.remove();
                                    player.node.avatar.setBackgroundImage('extension/清瑶葭绮/members/假装无敌/qy_qycaoren_defense.jpg');
                                }
                                else{
                                    //player.node.avatar.setBackground('caoren','character');
                                    player.node.avatar.setBackgroundImage('extension/清瑶葭绮/members/假装无敌/qy_qycaoren.jpg');
                                }
                            }
                        },
                    },
                },
            },
            ymlizhan:{
                trigger:{
                    player:['phaseZhunbeiBegin','phaseJieshuBegin'],
                },
                audio:"yanzheng",
                direct:true,
                markText:'励战',
                intro:{
                    name:'励战',
                    content:function(storage,player,skill){
                        var own=player.storage[skill];
                        return ('【励战】角色：'+get.translation(own));
                    },
                },
                content:function(){
                    'step 0'
                    player.chooseTarget([0,Infinity], get.prompt(event.name), '选择任意名角色成为【励战】目标角色', function (card, player, target) {
                        return target!=player;
                    }).set('ai', function (target) {
                        return get.attitude(player,target)>0;
                    });
                    'step 1'
                    if(result.bool){
                        player.logSkill(event.name,result.targets);
                        player.storage.ymlizhan=[].concat(result.targets);
                        if(result.targets.length>0) player.markSkill('ymlizhan');
                        else player.unmarkSkill('ymlizhan');
                    }
                },
                group:'ymlizhan_turn',
                subSkill:{
                    turn:{
                        trigger:{
                            global:'damageBegin'
                        },
                        audio:"yanzheng",
                        forced:true,
                        filter:function(event,player){
                            var own=[];
                            own.add(player);
                            if(player.storage.ymlizhan) own.addArray(player.storage.ymlizhan);
                            if(own.contains(event.source)&&!player.isTurnedOver()) return true;
                            if(own.contains(event.player)&&player.isTurnedOver()) return true;
                            return false;
                        },
                        content:function(){
                            var own=[];
                            own.add(player);
                            if(player.storage.ymlizhan) own.addArray(player.storage.ymlizhan);
                            if(own.contains(trigger.source)){
                                trigger.num++;
                                var card=get.cardPile(function (card) {
                                    return get.type(card) == 'equip'&&['equip1','equip4'].contains(get.subtype(card))&&!trigger.source.getEquip(lib.card[card.name].subtype)&&!get.cardtag(card, 'gifts');
                                });
                                if(card) trigger.source.equip(card);
                            }
                            if(own.contains(trigger.player)){
                                trigger.num--;
                                var card=get.cardPile(function (card) {
                                    return get.type(card) == 'equip'&&['equip2','equip3'].contains(get.subtype(card))&&!trigger.player.getEquip(lib.card[card.name].subtype)&&!get.cardtag(card, 'gifts');
                                });
                                if(card) trigger.player.equip(card);
                            }
                        }
                    },
                },
            },
            ymkuiwei:{
                forced:true,
                charlotte:true,
                mark:true,
                silent:true,
                popup:false,
                trigger:{
                    player:'turnOverAfter',
                },
                content:function(){
                    player.markSkill(event.name);
                },
                intro: {
                    content: function (storage, player, skill) {
                        if (!player.isTurnedOver()) return '<span class="legendtext">锁定技，此翻面状态下，你和【励战】角色使用基本牌无次数限制</span>';
                        return '<span class="bluetext">锁定技，此翻面状态下，你和【励战】角色使用锦囊牌无距离限制。</span>';
                    },
                },
                global:'ymkuiwei_mod',
                subSkill:{
                    mod:{
                        forced:true,
                        charlotte:true,
                        mod:{
                            cardUsable:function(card,player,num){
                                if(((player.hasSkill('ymkuiwei')&&!player.isTurnedOver())||game.hasPlayer(function(current){
                                    return current.hasSkill('ymkuiwei')&&!current.isTurnedOver()&&current.storage.ymlizhan&&current.storage.ymlizhan.contains(player)
                                }))&&get.type(card)=='basic') return Infinity;
                            },
                            targetInRange:function(card,player,target,now){
                                if(((player.hasSkill('ymkuiwei')&&player.isTurnedOver())||game.hasPlayer(function(current){
                                    return current.hasSkill('ymkuiwei')&&current.isTurnedOver()&&current.storage.ymlizhan&&current.storage.ymlizhan.contains(player)
                                }))&&get.type2(card)=='trick') return true;
                            },
                        },
                    },
                },
            },
            ymshengshou:{
                audio:"chulao",
                trigger:{
                    player:'phaseBegin',
                },
                content:function(){
                    'step 0'
                    var cards=get.cards(Math.max(game.players.length,5));
                    event.black=[];
                    event.red=[];
                    for(var i=0;i<cards.length;i++){
                        if(get.color(cards[i])=='black') event.black.add(cards[i]);
                        else event.red.add(cards[i]);
                    }
                    event.count1=event.black.length;
                    event.count2=event.red.length;
                    event.videoId = lib.status.videoId++;
                    var str1='选项一：指定至多'+event.count1+'名角色你令其共失去'+get.cnNumber(event.count1)+'点体力且你获得这些红色牌'
                    var str2='选项二：指定至多'+event.count2+'名角色你令其共回复'+get.cnNumber(event.count2)+'点体力且你获得这些黑色牌'
                    if (player.isOnline2()) {
                        player.send(function(cards, id) {ui.create.dialog('圣手', str1, event.red, str2, event.black).videoId = id;}, cards, event.videoId);
                    }
                    event.dialog = ui.create.dialog('圣手');
                    event.dialog.addText(str1);
                    if(event.red.length) event.dialog.add(event.red);
                    event.dialog.addText(str2);
                    if(event.black.length) event.dialog.add(event.black);
                    event.dialog.videoId = event.videoId;
                    if (!event.isMine()) {
                        event.dialog.style.display = 'none';
                    }
                    var value = 0;
                    for(var i=0;i<game.players.length;i++){
                        if(get.attitude(player,game.players[i])>0){
                            value += (get.recoverEffect(game.players[i],player,player)+1);
                        }
                        else value -= (get.damageEffect(game.players[i],player,player)+1);
                    }
                    player.chooseControl('选项一', '选项二', '背水！', function(event, player) {
                        if (value > 5) return '选项二';
                        else if(value <-5) return '选项一';
                        else return '背水！';
                    });
                    'step 1'
                    if (player.isOnline2()) {
                        player.send('closeDialog', event.videoId);
                    }
                    event.dialog.close();
                    player.popup(result.control);
                    game.log(player,'选择了'+result.control);
                    if(result.control=='选项一') event.goto(2);
                    if(result.control=='选项二') event.goto(5);
                    if(result.control=='背水！') {
                        event.beishui=true;
                        event.goto(2);
                    }
                    'step 2'
                    if(event.count1>0){
                        player.chooseTarget([1,event.count1],true,get.prompt('ymshengshou'),'指定至多'+get.cnNumber(event.count1)+'名角色你令其随机失去共'+event.count1+'点体力',function(card,player,target){
                            return true;
                        }).set('ai',function(target){
                            var player=_status.event.player;
                            return get.damageEffect(target,player,player)*2;
                        });
                    }
                    'step 3'
                    if(result.bool){
                        var list=result.targets;
                        list.sort(lib.sort.seat);
                        var list2=[];
                        for(var i=0;i<list.length;i++){
                            list2.push(1);
                        }
                        event.count1-=result.targets.length;
                        for(var i=0;i<event.count1;i++){
                            list2[Math.floor(Math.random()*list2.length)]++;
                        }
                        event.list=list;
                        event.list2=list2;
                    }
                    'step 4'
                    if(event.list&&event.list.length){
                        var target=event.list.shift();
                        target.loseHp(event.list2.shift()).set('source',player);
                        player.line(target,'thunder');
                        event.redo();
                    }
                    else{
                        player.gain(event.red,'gain2')
                        if(event.beishui) event.goto(5);
                        else{
                            for(var i=0;i<event.black.length;i++) event.black[i].discard();
                            event.finish();
                        }
                    }
                    'step 5'
                    if(event.count2>0){
                        player.chooseTarget([1,event.count2],true,get.prompt('ymshengshou'),'指定至多'+get.cnNumber(event.count2)+'名角色你令其随机回复共'+event.count2+'点体力',function(card,player,target){
                            return true;
                        }).set('ai',function(target){
                            var player=_status.event.player;
                            if(get.attitude(target,player)>0){
                                return get.recoverEffect(target,player,player)+2;
                            }
                        });
                    }
                    'step 6'
                    if(result.bool){
                        var list=result.targets;
                        list.sort(lib.sort.seat);
                        var list2=[];
                        for(var i=0;i<list.length;i++){
                            list2.push(1);
                        }
                        event.count2-=result.targets.length;
                        for(var i=0;i<event.count2;i++){
                            list2[Math.floor(Math.random()*list2.length)]++;
                        }
                        event.list=list;
                        event.list2=list2;
                    }
                    'step 7'
                    if(event.list&&event.list.length){
                        var target=event.list.shift();
                        target.recover(event.list2.shift());
                        player.line(target,'thunder');
                        event.redo();
                    }
                    else{
                        player.gain(event.black,'gain2');
                        if(event.beishui){
                            player.discard(event.red.concat(event.black));
                        }
                        else {
                            for(var i=0;i<event.red.length;i++) event.red[i].discard();
                            event.finish();
                        }
                    }
                },
            },
            ymqingnang:{
                audio:"qingnang",
                enable:"phaseUse",
                usable:1,
                filter:function(event,player){
                    return player.countCards('he')>0;
                },
                selectCard:[1,2],
                filterCard:true,
                position:"hes",
                filterTarget:true,
                selectTarget:[1,Infinity],
                check:function(card){
                    return 7-get.value(card);
                },
                content:function(){
                    "step 0"
                    event.number=cards.length;
                    var list=['选项一','选项二'];
                    var str1='令'+get.translation(targets[num])+'回复'+get.cnNumber(event.number)+'点体力(每溢出一点则其额外摸两张牌)';
                    var str2='弃置'+get.translation(targets[num])+get.cnNumber(2*event.number)+'张牌(每不足两张则其额外失去一点体力)';
                    if(event.getParent(2).name=='ymjijiu'){
                        list.remove('选项二');
                        str2="<span style='color: red'>受【急救】影响，本次无法选择此项</span>";
                    }
                    player.chooseControl(list).set('choiceList',[str1,str2]).set('prompt',get.prompt('ymqingnang',targets[num])).set('ai',function(){
                        if(get.attitude(targets[num],player)>0) return '选项一';
                        else return '选项二';
                    });
                    "step 1"
                    if(result.control=='选项一'){
                        var n=event.number-targets[num].maxHp+targets[num].hp;
                        if(n>0){
                            targets[num].recover(event.number-n);
                            targets[num].draw(2*n);
                        }
                        else targets[num].recover(event.number);
                    }
                    if(result.control=='选项二'){
                        var n=(2*event.number-targets[num].countCards('he'))
                        if(n>0){
                            var count=targets[num].countCards('he')%2==1?targets[num].countCards('he')-1:targets[num].countCards('he');
                            if(count>0) player.discardPlayerCard(targets[num],count,true,'he');
                            targets[num].loseHp(event.number-count/2);
                        }
                        else player.discardPlayerCard(targets[num],2*event.number,true,'he');
                    }
                },
                ai:{
                    result:{
                        target:function(player,target){
                            if(get.attitude(player,target)>0){
                                if(target.maxHp>target.hp){
                                    return 2;
                                }
                                else if(target.maxHp<=target.hp){
                                    return 1;
                                }
                            }
                            else{
                                if(target.countCards('he')<2){
                                    return -2;
                                }
                                else if(target.countCards('he')>=2){
                                    return -1;
                                }
                            }
                        },
                    },
                    order:9,
                },
                mod:{
                    ignoredHandcard:function(card,player){
                        if(get.type(card)=='basic') return true;
                    },
                    cardDiscardable:function(card,player,name){
                        if(name=='phaseDiscard'&&get.type(card)=='basic') return false;
                    },
                },
            },
            ymjijiu:{
                trigger:{
                    global:'dying',
                },
                locked:true,
                audio:"jijiu",
                check:function(event,player){
                    return get.attitude(event.player,player)>0
                },
                filter:function(event,player){
                    return player.countCards('hs')>0;
                },
                content:function(){
                    'step 0'
                    player.discard(player.getCards('hs').randomGet());
                    trigger.player.recover(1-trigger.player.hp);
                    'step 1'
                    if(player.countCards('hes')>0){
                        player.chooseCardTarget({
                            filterTarget:true,
                            selectTarget:[1,Infinity],
                            selectCard:[1,2],
                            filterCard:lib.filter.cardDiscardable,
                            position:"hes",
                            ai1:function(card){
                                return 7-get.value(card);
                            },
                            ai2:function(target){
                                /*if(get.attitude(player,target)>0){
                                    if(target.maxHp>target.hp){
                                        return 2*get.attitude(player,target);
                                    }
                                    else if(target.maxHp<=target.hp){
                                        return get.attitude(player,target);
                                    }
                                }
                                else{
                                    if(target.countCards('he')<2){
                                        return -2*get.attitude(player,target);
                                    }
                                    else if(target.countCards('he')>=2){
                                        return -get.attitude(player,target);
                                    }
                                }*/
                                return get.attitude(player,target)>0;
                            },
                            prompt:get.prompt2('ymqingnang'),
                            prompt2:"<li><span style='color: red'>——本次无法选择②</span>"
                        });
                    }
                    'step 2'
                    if(result.bool){
                        player.discard(result.cards);
                        var next = player.useSkill('ymqingnang');
                        next.player = player;
                        next.cards = result.cards;
                        next.targets = result.targets;
                        next.num = 0;
                    }
                },
            },
            ymdimeng:{
                trigger:{
                    global:'gameStart',
                    player:'phaseBegin',
                },
                audio:'dimeng',
                direct:true,
                filter:function(event,player){
                    return true;
                },
                init:function(player){
                    player.storage.renku=true;
                },
                mark:true,
                intro:{
                    name:'缔盟',
                    content:function(storage,player,skill){
                        var own=[];
                        for(var i=0;i<game.players.length;i++){
                            if(game.players[i].storage[skill]) own.addArray(game.players[i].storage[skill]);
                        }
                        return ('【缔盟】角色：'+get.translation(own));
                    },
                },
                content:function(){
                    'step 0'
                    player.chooseTarget([0,Infinity], get.prompt(event.name), '选择任意名角色成为【缔盟】目标角色并令其摸一张牌', function (card, player, target) {
                        return true;
                    }).set('ai', function (target) {
                        return get.attitude(player,target)>0;
                    });
                    'step 1'
                    if(!player.storage.ymdimeng) player.storage.ymdimeng=[];
                    if(result.bool){
                        player.markSkill('renku');
                        player.logSkill(event.name,result.targets);
                        player.storage.ymdimeng=[].concat(result.targets);
                        for(var i=0;i<result.targets.length;i++){
                            result.targets[i].draw();
                        }
                    }
                },
                group:['ymdimeng_renku','ymdimeng_end'],
                global:'ymdimeng_use',
                subSkill:{
                    renku:{
                        trigger:{
                            global:["loseBefore","loseAfter","useCardAfter","respondAfter"],
                        },
                        forced:true,
                        silent:true,
                        popup:false,
                        filter:function(event,player,name){
                            var players=[];
                            for(var i=0;i<game.players.length;i++){
                                if(game.players[i].storage.ymdimeng) players.addArray(game.players[i].storage.ymdimeng);
                            }
                            if(!players.contains(event.player)) return false;
                            var cards=[];
                            if(event.name=='lose'){
                                if(['useCard','respond'].contains(event.getParent().name)&&name=='loseBefore'){
                                    var evt=event.getParent();
                                    evt.ownCards=[];
                                    for(var i=0;i<evt.cards.length;i++){
                                        if(players.contains(get.owner(evt.cards[i]))) evt.ownCards.add(evt.cards[i]);
                                    }
                                    return false;
                                }
                                if(event.type!='discard') return false;
                                for(var i=0;i<event.cards.length;i++){
                                    if(get.position(event.cards[i])=='d'){
                                        cards.add(event.cards[i]);
                                    }
                                }
                            }
                            else{
                                var cards2=event.cards.filterInD();
                                for(var i=0;i<cards2.length;i++){
                                    if(event.ownCards&&event.ownCards.contains(cards2[i])) cards.add(cards2[i]);
                                }
                            }
                            return cards.length>0;
                        },
                        content:function(){
                            var cards=[];
                            if(trigger.name=='lose'){
                                for(var i=0;i<trigger.cards.length;i++){
                                    if(get.position(trigger.cards[i])=='d'){
                                        cards.add(trigger.cards[i]);
                                    }
                                }
                            }
                            else{
                                var cards2=trigger.cards.filterInD();
                                for(var i=0;i<cards2.length;i++){
                                    if(trigger.ownCards&&trigger.ownCards.contains(cards2[i])) cards.add(cards2[i]);
                                }
                            }
                            game.log(cards,'被置于仁库');
                            game.cardsGotoSpecial(cards,'toRenku');
                            game.updateRenku();
                        },
                    },
                    end:{
                        trigger:{
                            global:["cardsDiscardBefore"],
                        },
                        forced:true,
                        silent:true,
                        popup:false,
                        filter:function(event,player){
                            return event.fromRenku==true&&event.outRange;
                        },
                        content:function(){
                            _status.renku=trigger.cards.concat(_status.renku);
                            var cards=_status.renku.splice(0,_status.renku.length-30);
                            /*var players=[];
                            for(var i=0;i<game.players.length;i++){
                                if(game.players[i].storage.ymdimeng) players.addArray(game.players[i].storage.ymdimeng);
                            }
                            player.logSkill(event.name);
                            for(var i=0;i<players.length;i++){
                                players[i].draw();
                            }*/
                            game.updateRenku();
                            if(cards.length) trigger.cards=cards;
                            else{
                                trigger.untrigger(true);
                                trigger.finish();
                            }
                        },
                    },
                    use:{
                        enable:["chooseToUse","chooseToRespond"],
                        hiddenCard:function(player,name){
                            var goon;
                            var players=[];
                            for(var i=0;i<game.players.length;i++){
                                if(game.players[i].storage.ymdimeng) players.addArray(game.players[i].storage.ymdimeng);
                            }
                            for(var i of _status.renku){
                                if(get.name(i)==name){
                                    goon=true;
                                    break;
                                }
                            }
                            if(lib.inpile.contains(name)&&goon&&players.contains(player)) return true;
                        },
                        filter:function(event,player){
                            var players=[];
                            for(var i=0;i<game.players.length;i++){
                                if(game.players[i].hasSkill('ymdimeng')&&game.players[i].storage.ymdimeng) players.addArray(game.players[i].storage.ymdimeng);
                            }
                            if(!players.contains(player)) return false;
                            if(_status.renku.length==0) return false;
                            if(event.responded||event.ymdimeng==player) return false;
                            if(game.hasPlayer(function(current){
                                return current.hasSkill('ymdimeng');
                            })){
                                _status.ymdimng=event;
                                for(var i of lib.inpile){
                                    if(event.filterCard({name:i},player,event)) return true;
                                }
                            }
                            return false;
                        },
                        chooseButton:{
                            dialog:function(event,player){
                                var cards=_status.renku;
                                var evt=_status.ymdimng;
                                evt.set('ymdimeng',player);
                                return ui.create.dialog('缔盟',cards);
                            },
                            filter:function(button,player){
                                return _status.event.getParent().filterCard({name: button.link.name}, player, _status.event.getParent());
                            },
                            check:function(button){
                                var player = _status.event.player;
                                var effect = player.getUseValue(button.link.name)+1;
                                if (effect > 0) return effect;
                                return 0;
                            },
                            backup:function(links,player){
                                return {
                                    filterCard:function(){return false},
                                    selectCard:-1,
                                    viewAs:{name:links[0].name,cards:links,isCard:true},
                                    precontent:function(){
                                        delete event.result.skill;
                                        player.logSkill('ymdimeng');
                                        event.getParent().addCount=false;
                                        var cards=event.result.card.cards
                                        var name=event.result.card.name;
                                        event.result.cards=event.result.card.cards;
                                        event.result.card=get.autoViewAs(event.result.cards[0]);
                                        event.result.card.name=name;
                                        game.log(cards,'从仁库进入了弃牌堆');
                                        game.delayx();
                                        game.cardsDiscard(cards).fromRenku=true;
                                        _status.renku.removeArray(cards);
                                        game.updateRenku();
                                    },
                                }
                            },
                            prompt:function(links,player){
                                return '选择'+get.translation(links)+'的目标';
                            },
                        },
                        ai:{
                            order:11,
                            respondShan:true,
                            respondSha:true,
                            result:{
                                player:function(player){
                                    if(_status.event.dying) return get.attitude(player,_status.event.dying);
                                    return 1;
                                },
                            },
                        },
                    },
                },
            },
            ymhaoshi:{
                trigger:{
                    global:['phaseUseBegin','phaseUseEnd'],
                },
                audio:'haoshi',
                derivation:["rezhiheng"],
                filter:function(event,player){
                    return true;
                },
                prompt:function(event,player){
                    return '是否对<span style="color: red">'+get.translation(event.player)+'</span>发动【好施】？';
                },
                check:function(event,player){
                    return get.attitude(event.player,player)>0
                },
                content:function(){
                    'step 0'
                    if(event.triggername=='phaseUseBegin'){
                        if(trigger.player.maxHp<10) trigger.player.gainMaxHp();
                        else trigger.player.recover();
                    }
                    'step 1'
                    trigger.player.drawTo(trigger.player.maxHp);
                    if(event.triggername=='phaseUseBegin') event.finish();
                    'step 2'
                    trigger.player.chooseCard('he', [1,Infinity], get.prompt('rezhiheng'),get.translation('rezhiheng_info'), function (card) {
                        return lib.filter.cardDiscardable
                    }).set('ai', function (card) {
                        var player=_status.event.player;
                        if(get.position(card)=='h'&&!player.countCards('h','du')&&(player.hp>2||!player.countCards('h',function(card){
                            return get.value(card)>=8;
                        }))){
                            return 1;
                        }
                        return 6-get.value(card)
                    });
                    'step 3'
                    if(result.cards){
                        var next = game.createEvent('rezhiheng');
                        next.player = trigger.player;
                        next.cards=result.cards;
                        next.setContent(lib.skill.rezhiheng.content);
                    }
                },
            },
            ymkeji:{
                trigger:{
                    global:'phaseEnd',
                },
                audio:'keji',
                forced:true,
                filter:function(event,player){
                    return player.getHistory('sourceDamage').length||player.getHistory('lose').length;
                },
                content:function(){
                    if(player.getHistory('sourceDamage').length){
                        var num=0;
                        player.getHistory('sourceDamage', function (evt) {
                            num+=evt.num;
                        });
                        if(num>5) num=5;
                        player.changeHujia(num);
                        player.draw(num);
                    }
                    else{
                        var cards=[];
                        player.getHistory('lose', function(evt){
                            var card=evt.cards.slice(0);
                            if(card && card.length > 0) cards.addArray(card.filter(function(card){
                                return true;
                            }));
                            game.findPlayer2(function (current) {
                                if (current!=player) cards.removeArray(current.getCards('j'));
                                else cards.removeArray(player.getCards('e'));
                            });
                        });
                        player.gain(cards,'gain2');
                        if(_status.currentPhase==player) player.changeHujia(1);
                        else player.recover();
                    }
                },
            },
            ymandu:{
                dutySkill:true,
                trigger:{
                    global:"phaseEnd",
                },
                audio:'keji',
                forced:true,
                filter:function(event,player){
                    if(event.player==player) return false;
                    //if(event.player.getHistory('sourceDamage', function(evt){
                    //    return evt.player==player&&evt.num>0;
                    //}).length>0) return false;
                    return true;
                },
                content:function(){
                    if(trigger.player.getHistory('sourceDamage', function(evt){
                        return evt.player==player&&evt.num>0;
                    }).length==0) player.draw();
                    else player.changeHujia(1);
                },
                derivation:["ymshajie","qinxue","gongxin"],
                group:["ymandu_achieve","ymandu_fail"],
                subSkill:{
                    achieve:{
                        trigger:{
                            player:"phaseBegin",
                        },
                        forced:true,
                        audio:'botu',
                        skillAnimation:true,
                        animationColor:"fire",
                        filter:function(event,player){
                            return player.hujia>=5||player.countCards('h')>=12;
                        },
                        content:function(){
                            'step 0'
                            game.log(player,'成功完成使命');
                            player.awakenSkill('ymandu');
                            player.gainMaxHp(player.hujia);
                            'step 1'
                            player.recover(player.maxHp-player.hp);
                            player.draw(player.maxHp-player.hp);
                            player.addSkillLog('ymshajie');
                        },
                    },
                    fail:{
                        trigger:{
                            source:"die",
                        },
                        forced:true,
                        audio:'botu',
                        content:function(){
                            game.log(player,'使命失败');
                            player.awakenSkill('ymandu');
                            player.loseHp();
                            player.discard(player.getCards('e'));
                            player.addSkillLog('qinxue');
                            player.addSkillLog('shelie');
                        },
                    },
                },
            },
            ymshajie:{
                trigger:{
                    player:'phaseBegin',
                },
                audio:'gongxin',
                forced:true,
                direct:true,
                mark:true,
                intro:{
                    name:'杀劫',
                    content:function(storage,player,skill){
                        var own=player.storage[skill];
                        return ('【杀劫】目标：'+get.translation(own));
                    },
                },
                content:function(){
                    'step 0'
                    player.chooseTarget([1,2], get.prompt(event.name), '选择任意名其他角色成为【杀劫】目标', function (card, player, target) {
                        return player!=target;
                    }).set('ai', function (target) {
                        return get.attitude(player,target)<=0;
                    });
                    'step 1'
                    if(result.targets){
                        delete player.storage.ymshajie;
                        player.logSkill(event.name,result.targets);
                        player.storage.ymshajie=[].concat(result.targets);
                    }
                },
                group:'ymshajie_use',
                subSkill:{
                    use:{
                        trigger:{
                            player:'useCard',
                            source:'damageBegin',
                        },
                        audio:'gongxin',
                        forced:true,
                        filter:function(event,player,name){
                            if(name=='useCard'){
                                return game.hasPlayer(function(current){
                                    return player.storage.ymshajie&&player.storage.ymshajie.contains(current)&&event.targets.contains(current);
                                });
                            }
                            else{
                                return player.getHistory('sourceDamage', function(evt){
                                    return evt.player==event.player;
                                }).length==0&&player.storage.ymshajie&&player.storage.ymshajie.contains(event.player);
                            }
                            return false;
                        },
                        content:function(){
                            'step 0'
                            if(event.triggername=='useCard'){
                                var goon = false;
                                game.hasPlayer(function (current) {
                                    if (!trigger.targets.contains(current) && player.storage.ymshajie.contains(current)) goon = true
                                });
                                if (goon == true) {
                                    player.chooseTarget(get.prompt2(event.name), '是否为' + get.translation(trigger.card) + '额外指定一个【杀劫】目标为目标？', function (card, player, target) {
                                        return !_status.event.sourcex.contains(target) && player.storage.ymshajie.contains(target);
                                    }).set('sourcex', trigger.targets).set('ai', function (target) {
                                        var player = _status.event.player;
                                        return get.effect(target, _status.event.card, player, player);
                                    }).set('card', trigger.card);
                                }
                            }
                            else {
                                trigger.num+=Math.max(1,Math.min(5,player.hujia));
                                player.changeHujia(-Math.min(Math.floor(player.hujia/2),5));
                                event.finish();
                            }
                            'step 1'
                            if (result.bool) {
                                player.line(result.targets, 'green');
                                trigger.targets.addArray(result.targets);
                            }
                            'ste 2'
                            trigger.directHit.addArray(game.filterPlayer(function(current){
                                return player.storage.ymshajie&&player.storage.ymshajie.contains(current)&&trigger.targets.contains(current);
                            }));
                        },
                        mod:{
                            targetInRange:function(card,player,target){
                                if(player.storage.ymshajie&&player.storage.ymshajie.contains(target)) return true;
                            },
                            cardUsableTarget:function(card,player,target){
                                if(player.storage.ymshajie&&player.storage.ymshajie.contains(target)) return true;
                            },
                        },
                    },
                },
            },
            ymqianxun:{
                trigger:{
                    player:'phaseJudgeBegin'
                },
                audio:'reqianxun',
                content:function(){
                    'step 0'
                    event.num=Math.max(1,player.countCards('j'));
                    player.discard(player.getCards('j'));
                    event.delay=[];
                    for(var i=0;i<lib.inpile.length; i++) {
                        if(get.type(lib.inpile[i])=='delay') event.delay.add(lib.inpile[i]);
                    }
                    'step 1'
                    player.judge();
                    'step 2'
                    if(result){
                        player.draw(get.translation(result.card.name).length);
                        event.result=result;
                    }
                    else event.finish();
                    'step 3'
                    player.chooseTarget([1,Infinity], get.prompt2(event.name), function (card, player, target) {
                        return target != player;
                    }).set('ai', function (target) {
                        return - get.attitude(_status.event.player, target);
                    });
                    'step 4'
                    if(result.targets){
                        event.targets=result.targets;
                        event.count=0;
                    }
                    else event.finish();
                    'step 5'
                    var name=event.delay.randomGet();
                    event.card=game.createCard(name,'none','none');
                    event.targets[event.count].popup(name,'thunder');
                    event.card.expired=true;
                    if(lib.card[name].judge(event.result.card)>0) event.result.bool=true;
                    if(lib.card[name].judge(event.result.card)<0) event.result.bool=false;
                    player.$throw(event.card);
                    if(lib.card[name].cancel&&event.result.bool==false){
                        var next=game.createEvent(name);
                        next.setContent(lib.card[name].effect);
                        next._result=event.result;
                        next.cards=[event.card]
                        next.card=event.card;
                        next.player=event.targets[event.count];
                    }
                    else if(!lib.card[name].cancel){
                        var next=game.createEvent(name);
                        next.setContent(lib.card[name].effect);
                        next._result=event.result;
                        next.cards=[event.card];
                        next.card=event.card;
                        next.player=event.targets[event.count];
                    }
                    game.log(event.targets[event.count],'的','#g【'+get.translation(event.card)+'】','判定结果为',event.result.card);
                    if(event.result.bool==false){
                        if(!event.targets[event.count].storage.ymqianxun_mark) event.targets[event.count].storage.ymqianxun_mark=[];
                        event.targets[event.count].storage.ymqianxun_mark.add(name);
                        event.targets[event.count].addTempSkill('ymqianxun_mark',{player:'phaseJudgeEnd'});
                    }
                    ui.clear();
                    if(event.card) event.card.delete();
                    game.delay(2);
                    'step 6'
                    event.count++;
                    if(event.count<event.targets.length) event.goto(5);
                    'step 7'
                    event.num--;
                    if(event.num>0) event.goto(1);
                },
                subSkill:{
                    mark:{
                        charlotte:true,
                        mark: true,
                        onremove:function(player,skill){
                            delete player.storage[skill];
                        },
                        intro:{
                            content:function(storage,player,skill){
                                var str=''
                                str+='当前已生效的判定牌：<br><li>'+get.translation(player.storage[skill]);
                                return str;
                            },
                        },
                    },
                },
            },
            ymlianying:{
                trigger:{
                    player:"loseAfter",
                    global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter"],
                },
                audio:'relianying',
                filter:function(event,player){
                    var evt=event.getl(player);
                    if(!evt||!evt.cards2||!evt.cards2.length) return false;
                    if(event.swapEquip) return false;
                    if(event.swapped) return false;
                    var card=evt.cards2;
                    var list={};
                    for(var j=0;j<card.length;j++){
                        for(var i=0;i<lib.inpile.length;i++){
                            var type=get.type(card[j],'trick');
                            if(lib.filter.cardEnabled({name:lib.inpile[i]},player)&&player.hasUseTarget(lib.inpile[i],false)&&get.type(lib.inpile[i],'trick')==type){
                                if(!list[get.type(lib.inpile[i],'trick')]){
                                    list[get.type(lib.inpile[i],'trick')]=[];
                                }
                                if(lib.inpile[i]!=name&&player.getHistory('custom',function(evt){return evt.ymlianying_name==lib.inpile[i]}).length==0) list[get.type(lib.inpile[i],'trick')].push([get.type(lib.card[lib.inpile[i]],'trick'),'',lib.inpile[i]]);
                            }
                        }
                    }
                    return !Object.values(list).filter(Array.isArray).every(arr => arr.length === 0);
                },
                direct:true,
                content:function(){
                    'step 0'
                    var evt=trigger.getl(player);
                    event.card=evt.cards2;
                    'step 1'
                    var evt=trigger;
                    var next = game.createEvent('ymlianying',false);
                    next.card = event.card;
                    next.player = player;
                    next._trigger = evt;
                    next.setContent(function(){
                        'step 0'
                        var list={};
                        for(var i=0;i<lib.inpile.length;i++){
                            var name=event.card[0].name;
                            var type=get.type(event.card[0],'trick');
                            if(lib.filter.cardEnabled({name:lib.inpile[i]},player)&&player.hasUseTarget(lib.inpile[i],false)){
                                if(!list[get.type(lib.inpile[i],'trick')]){
                                    list[get.type(lib.inpile[i],'trick')]=[];
                                }
                                if(lib.inpile[i]!=name&&player.getHistory('custom',function(evt){return evt.ymlianying_name==lib.inpile[i]}).length==0){
                                    if(lib.inpile[i]=='sha'){
                                        list[get.type(lib.inpile[i],'trick')].push([get.type(lib.card[lib.inpile[i]],'trick'),'',lib.inpile[i]]);
                                        list[get.type(lib.inpile[i],'trick')].push([get.type(lib.card[lib.inpile[i]],'trick'),'',lib.inpile[i],'stab']);
                                        for(var j of lib.linked) list[get.type(lib.inpile[i],'trick')].push([get.type(lib.card[lib.inpile[i]],'trick'),'',lib.inpile[i],j]);
                                    }
                                    else list[get.type(lib.inpile[i],'trick')].push([get.type(lib.card[lib.inpile[i]],'trick'),'',lib.inpile[i]]);
                                }
                            }
                        }
                        if(event.card.length){
                            if(list[get.type(event.card[0],'trick')]&&list[get.type(event.card[0],'trick')].length>0){
                                list[get.type(event.card[0],'trick')].sort(lib.sort.name);
                                var dialog=ui.create.dialog('连营');
                                dialog.addText('请选择一张'+get.translation(get.type(event.card[0],'trick'))+'牌使用');
                                if(event.card.length>1) dialog.addText('剩余'+get.translation(event.card.slice(1)));
                                dialog.add([list[get.type(event.card[0],'trick')],'vcard']);
                                var next=player.chooseButton(dialog);
                                next.set('ai',function(button){
                                    var player=_status.event.player;
                                    if(player.countCards('h',button.link[2])>0) return 0;
                                    if(['wugu','zhulu_card'].contains(button.link[2])) return 0;
                                    var effect=player.getUseValue(button.link[2]);
                                    if(effect>0) return effect;
                                    return 0;
                                });
                            }
                            else{
                                event.card.shift();
                                event.redo();
                            }
                        }
                        'step 1'
                        if(result.bool){
                            if(!event.log) player.logSkill('ymlianying');
                            event.log=true;
                            var card=false;
                            if(['delay','equip'].contains(get.type(result.links[0][2]))) card=game.createCard(result.links[0][2],get.suit(event.card[0]),get.number(event.card[0]));
                            if(card) player.chooseUseTarget(card, true, false,'nodistance');
                            else player.chooseUseTarget(true,{name:result.links[0][2],nature:result.links[0][3]},false,'nodistance');
                            if(get.type(result.links[0][2],'trick')!='basic') player.getHistory('custom').push({ymlianying_name:result.links[0][2]});
                            event.card.shift();
                            if(event.card.length>0) event.goto(0);
                            else event.finish();
                        }
                        else event.finish();
                    });
                    event.next.remove(next);
                    if(!trigger.type&&!evt.parent.skill) evt.after.push(next);
                    else evt.parent.after.push(next);
                },
            },
            ymluoyi:{
                trigger:{
                    player:'phaseUseBegin',
                },
                audio:'luoyi',
                forced:true,
                chargeSkill:true,
                content:function(){
                    player.addGaintag(player.getCards('h'),'ymluoyi');
                },
                mod:{
                    cardUsable:function(card){
                        if(!card.cards) return;
                        for(var i of card.cards){
                            if(i.hasGaintag('ymluoyi')) return Infinity;
                        }
                    },
                    targetInRange:function(card){
                        if(!card.cards) return;
                        for(var i of card.cards){
                            if(i.hasGaintag('ymluoyi')) return true;
                        }
                    },
                },
                group:["ymluoyi_damage","ymluoyi_backflow"],
                subSkill:{
                    damage:{
                        trigger:{
                            source:'damageBegin',
                        },
                        audio:'luoyi',
                        filter:function(event,player){
                            return player.hasMark('charge')&&event.card;
                        },
                        direct:true,
                        content:function(){
                            'step 0'
                            var num=player.countMark('charge');
                            var effect=num;
                            if(get.damageEffect(trigger.player, player, player)<=0) effect=1;
                            else if(get.attitude(trigger.player,player)>0) effect='cancel2';
                            var map={};
                            var list=[];
                            for(var i=1;i<=num;i++){
                                var cn=get.cnNumber(i,true);
                                map[cn]=i;
                                list.push(cn);
                            }
                            list.push('cancel2');
                            event.map=map;
                            player.chooseControl(list,function(){
                                if(_status.event.goon=='cancel2') return _status.event.goon;
                                return get.cnNumber(_status.event.goon,true);
                            }).set('prompt','裸衣：是否失去任意点蓄力值增加等量点伤害？').set('goon',effect);
                            'step 1'
                            if(result.control!='cancel2'){
                                player.logSkill('ymluoyi',event.player);
                                var num=event.map[result.control]||1;
                                player.removeMark('charge',num);
                                trigger.num+=num;
                            }
                        },
                    },
                    backflow:{
                        trigger:{
                            player:["loseAfter","enterGame"],
                            global:["equipAfter","addJudgeAfter","gainAfter","loseAsyncAfter","addToExpansionAfter","phaseBefore"],
                        },
                        forced:true,
                        filter:function(event,player,name){
                            if(player.countMark('charge')>=5) return false;
                            if(name.indexOf('After')!=-1){
                                var evt=event.getl(player);
                                if(!evt||!evt.gaintag_map) return false;
                                var cards=[];
                                for(var i of evt.cards2){
                                    if(evt.gaintag_map[i.cardid]&&evt.gaintag_map[i.cardid].contains('ymluoyi')) cards.add(i);
                                }
                                if(cards.length==0) return false;
                                return true;
                            }
                            else{
                                return (event.name!='phase'||game.phaseNumber==0);
                            }
                        },
                        content:function(){
                            var num=0;
                            if(event.triggername.indexOf('After')!=-1){
                                var evt=trigger.getl(player);
                                for(var i of evt.cards2){
                                    if(evt.gaintag_map[i.cardid]&&evt.gaintag_map[i.cardid].contains('ymluoyi')) num++;
                                }
                                if(num>0) player.draw(Math.min(num,5-player.countMark('charge')));
                            }
                            else num++;
                            if(num>0) player.addMark('charge',Math.min(num,5-player.countMark('charge')));
                        },
                    },
                },
            },
            ymchandou:{
                trigger:{
                    global:"phaseAfter",
                },
                audio:'reluoyi',
                filter:function(event,player){
                    var players=[];
                    player.getHistory('damage',function(evt){
                        if(evt.source&&evt.source!=player&&evt.source.isAlive()) players.add(evt.source);
                    });
                    player.getHistory('sourceDamage',function(evt){
                        if(evt.player&&evt.player!=player&&evt.player.isAlive()) players.add(evt.player);
                    });
                    return !player.storage.ymchandou&&players.length>0;
                },
                direct:true,
                marktext:"死战",
                intro:{
                    name:'死战',
                    content:function(storage,player,skill){
                        var str='参与【缠斗】的角色：'+get.translation(player.storage.ymchandou);
                        str+='<br><li>剩余'+get.cnNumber(ui.sizhanLoop.round)+'个轮次';
                        return str;
                    },
                    markcount: function (storage, player) {
                        if(ui.sizhanLoop&&ui.sizhanLoop.round){
                            return ui.sizhanLoop.round;
                        }
                        return 0;
                    },
                },
                content:function(){
                    'step 0'
                    var players=[];
                    player.getHistory('damage',function(evt){
                        if(evt.source&&evt.source!=player) players.add(evt.source);
                    });
                    player.getHistory('sourceDamage',function(evt){
                        if(evt.player&&evt.player!=player) players.add(evt.player);
                    });
                    player.chooseTarget([1,2], get.prompt(event.name),'指定至多两名角色，与其轮流进行回合直到只存活一名角色或共进行3个轮次', function (card, player, target) {
                        return players.contains(target);
                    }).set('ai', function (target) {
                        var player=_status.event.player;
                        var att=get.attitude(player,target);
                        var nh = target.countCards('h');
                        if (att > 0) {
                            if (target.isTurnedOver()) return 2.5;
                            if (target.hp == 1) {
                                if (nh == 0) return 2;
                                if (nh == 1) return 0.9;
                                if (ui.selected.targets.length) return 0.3;
                            } else if (target.hp == 2) {
                                if (nh == 0) return 1.5;
                                if (nh == 1) return 0.5;
                                if (ui.selected.targets.length) return 0.2;
                            } else if (target.hp == 3) {
                                if (nh == 0) return 0.4;
                                if (nh == 1) return 0.35;
                                if (ui.selected.targets.length) return 0.1;
                            }
                            if (ui.selected.targets.length) return 0.05;
                        }
                        else return - att;
                    });
                    'step 1'
                    if(result.targets){
                        player.logSkill(event.name,result.targets);
                        event.targets=result.targets.slice(0).sortBySeat();
                        player.storage.ymchandou=[];
                        player.storage.ymchandou.addArray(event.targets);
                        var next=player.insertEvent('ymchandou',lib.skill.ymchandou.contentx,{
                            player:player
                        });
                        next.forceDie=true;
                    }
                },
                contentx:function(){
                    player.draw(Math.max(player.countMark('charge'),1));
                    player.addSkill('ymchandou_use');
                    var target=player.storage.ymchandou;
                    player.markSkill('ymchandou');
                    var begin=false;
                    for(var i=0;i<target.length;i++){
                        if(target[i].isAlive()) begin=true;
                        else {
                            player.storage.ymchandou.remove(target[i]);
                            target.splice(i--,1);
                        }
                    }
                    if(begin==true){
                        target=[player].concat(target);
                        var next=player.insertEvent('sizhanLoop',lib.skill.ymchandou.sizhanLoop,{
                            targets:target,
                            players:[],
                            backup:[],
                            position:[],
                            //source:player,
                        });
                        next.forceDie=true;
                        var players=game.players.concat(game.dead);
                        var func=function(player,target){
                            var position=player.dataset.position;
                            if(_status.roundStart==player){
                                _status.roundStart=player.next||player.getNext()||game.players[0];
                            }
                            //var players=game.players.concat(game.dead);
                            if(get.mode() != 'boss'){
                                player.style.left=player.getLeft()+'px';
                                player.style.top=player.getTop()+'px';
                                if(player==undefined) player=game.dead[0]||game.me.next;
                                var position=parseInt(player.dataset.position);
                                for(var i=0;i<target.length;i++){
                                    target[i].dataset.position=i;
                                }
                                if(player.isAlive()){
                                    player.next.previous=player;
                                    player.previous.next=player;
                                }
                                player.nextSeat.previousSeat=player;
                                player.previousSeat.nextSeat=player;
                                ui.arena.setNumber(target.length);
                            }
                            player.delete();
                            player.removed=true;
                            player.out('ymchandou');
                            if(player==game.me){
                                ui.me.hide();
                                ui.auto.hide();
                                ui.wuxie.hide();
                            }
                            setTimeout(function(){
                                player.removeAttribute('style');
                            },500);
                            return position;
                        }
                        for(var i=0;i<players.length;i++){
                            next.backup.push(players[i]);
                            next.position.push(players[i].dataset.position);
                        }
                        players.removeArray(target);
                        for(var i=0;i<players.length;i++){
                            next.players.push(players[i]);
                            func(players[i],target);
                        }
                        var ob;
                        if(get.mode()!='boss'){
                            if(target.contains(game.me)){
                                while(target[0]!=game.me){
                                    target.push(target.shift());
                                }
                                for(var i=0;i<target.length;i++){
                                    target[i].dataset.position=i;
                                }
                            }
                            else ob=true;
                        }
                        game.animate.window(1);
                        game.delay(1.5);
                        game.animate.window(2);
                        if(ob){
                            ui.ymchandou=ui.create.div(ui.arena, {
                                cssText: `
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                left: -2%;
                                right: -2%;
                                bottom: -2%;
                                width: auto;
                                height: calc(2% + 180px);
                                background: linear-gradient(transparent, rgba(0,0,0,0.8));
                                text-shadow: 0 0 20px red;
                                text-align: center;
                                font-size: 60px;
                                font-family: 'xinwei';
                                `
                            }, '', '〖死战〗观战中...');
                        }
                        if(!ui.sizhanLoop){
                            ui.sizhanLoop=ui.create.system('三个轮次',null,true);
                            lib.setPopped(ui.sizhanLoop,function(){
                                var uiintro=ui.create.dialog('hidden');
                                uiintro.add('死战');
                                uiintro.addText(get.cnNumber(ui.sizhanLoop.round)+'个轮次后结束');
                                uiintro.add(ui.create.div('.placeholder.slim'));
                                return uiintro;
                            },180);
                            ui.sizhanLoop.round=3;
                        }
                        else ui.sizhanLoop.round+=3;
                    }
                },
                sizhanLoop:function(){
                    'step 0'
                    player.logSkill('ymchandou');
                    event.num=0;
                    'step 1'
                    var stop=0;
                    for(var i=0;i<targets.length;i++){
                        if(targets[i].isAlive()) stop++;
                    }
                    if(stop<=1||ui.sizhanLoop.round==0) event.goto(3);
                    else{
                        if(targets[event.num].isAlive()) targets[event.num].phase('sizhan');
                        event.num++
                    }
                    'step 2'
                    if(event.num<targets.length) event.goto(1);
                    else {
                        ui.sizhanLoop.round--;
                        ui.sizhanLoop.innerHTML=get.cnNumber(ui.sizhanLoop.round)+'个轮次';
                        player.updateMarks();
                        event.goto(0);
                    }
                    'step 3'
                    delete player.storage.ymchandou;
                    player.unmarkSkill('ymchandou');
                    player.removeSkill('ymchandou_use');
                    var func=function(player){
                        if(player==game.me){
                            ui.me.show();
                            ui.auto.show();
                            ui.wuxie.show();
                        }
                        player.removeAttribute('style');
                        player.animate('start');
                        ui.arena.appendChild(player);
                        delete player.removed;
                        player.in('ymchandou');
                        game.arrangePlayers();
                    }
                    for(var i=0;i<event.players.length;i++){
                        func(event.players[i]);
                    }
                    for(var i=0;i<event.backup.length;i++){
                        event.backup[i].dataset.position=event.position[i];
                    }
                    var players=game.players.concat(game.dead);
                    var newplayers=players.slice(0).removeArray(event.backup);
                    for(var i=0;i<newplayers.length;i++){
                        var position=newplayers[i].dataset.position;
                        for(var j=0;j<players.length;j++){
                            if(parseInt(players[j].dataset.position)>=position){
                                players[j].dataset.position=parseInt(players[j].dataset.position)+1;
                            }
                        }
                        game.arrangePlayers();
                    }
                    /*for(var i=0;i<players.length;i++){
                        players[i].dataset.position=players[i].seatNum-1;
                    }*/
                    if(get.mode() != 'boss'){
                        var pos=parseInt(game.me.dataset.position);
                        var num=game.players.length+game.dead.length;
                        var temp;
                        for(var i=0;i<players.length;i++){
                            temp=parseInt(players[i].dataset.position)-pos;
                            if(temp<0) temp+=num;
                            players[i].dataset.position=temp;
                        }
                        for(var i=0;i<players.length;i++){
                            game.playerMap[players[i].dataset.position]=players[i];
                        }
                        ui.arena.setNumber(players.length);
                        if(event.players.contains(game.me)&&ui.ymchandou) ui.ymchandou.remove();
                    }
                    game.animate.window(1);
                    game.delay(1.5);
                    game.animate.window(2);
                    if(ui.sizhanLoop){
                        ui.sizhanLoop.remove();
                        delete ui.sizhanLoop;
                    }
                },
                subSkill:{
                    use:{
                        trigger:{
                            player:"useCard",
                        },
                        audio:'reluoyi',
                        forced:true,
                        filter:function(event,player){
                            if(event.targets.contains(player)&&event.targets.length==1) return false;
                            var num=Math.max(1,player.maxHp-player.hp);
                            var count=player.getHistory('useCard',function(evt){
                                return !evt.targets.contains(player)||(evt.targets.contains(player)&&evt.targets.length>1);
                            }).length;
                            return count<=num;
                        },
                        content:function(){
                            trigger.directHit.addArray(game.players);
                        },
                    },
                },
            },
            ymdameng:{
                audio:"tianming",
                enable:'chooseToUse',
                round:2,
                unique:true,
                video:function (player, data) {
                    for (var i in data) {
                        var current = game.playerMap[i];
                        current.node.handcards1.innerHTML = '';
                        current.node.handcards2.innerHTML = '';
                        current.node.equips.innerHTML = '';
                        current.node.judges.innerHTML = '';
                        current.directgain(get.infoCards(data[i].h));
                        var ss = [];
                        for(var j = 0; j < data[i].s.length; j++){
                            ss.push(data[i].s[j][0]);
                        }
                        current.directgain(ss);
                        for(var j = 0; j < data[i].s.length; j++) ss[j].gaintag.addGaintag(data[i].s[j][1]);
                        for(var j = 0; j < data[i].x.length; j++){
                            current.node.expansions.appendChild(data[i].x[0]);
                            data[i].x[j][0].gaintag.addGaintag(data[i][j].x[1]);
                        }
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
                filter:function (event, player) {
                    if (!player.storage.ymdameng) return false;
                    if(event.type=='dying'){
                        if(player!=event.dying) return false;
                        return true;
                    }
                    else if(event.parent.name=='phaseUse') return true;
                    return false;
                },
                onremove:true,
                check:function (event, player) {
                    if (get.is.altered('ymdameng')) return false;
                    var storage = player.storage.ymdameng.player;
                    var num = 0;
                    for (var i = 0; i < storage.length; i++) {
                        if (game.players.contains(storage[i].player)) {
                            var att = get.attitude(player, storage[i].player);
                            var num2 = storage[i].value - storage[i].player.countCards('hesx') + storage[i].player.countCards('j');
                            if (att > 0) {
                                num += num2;
                            } else if (att < 0) {
                                num -= num2;
                            }
                        }
                    }
                    return num > Math.min(2, game.players.length / 2);
                },
                content:function () {
                    "step 0"
                    game.animate.window(1);
                    "step 1"
                    var storage = game.players.slice(0);
                    for(var i of player.storage.ymdameng.player) storage.add(i.player);
                    event.num=0;
                    event.storage=[];
                    for (var i = 0; i < storage.length; i++) {
                        var own = storage[i];
                        event.storage.push({
                            player:own,
                            hs:own.getCards('h'),
                            es:own.getCards('e'),
                            js:own.getCards('j'),
                            ss:own.getCards('s'),
                            xs:own.getCards('x'),
                        })
                        var cards = own.getCards('hejsx');
                        for (var j = 0; j < cards.length; j++) {
                            cards[j].discard();
                            cards[j].removeGaintag(cards[j].gaintag);
                        }
                        own.removeEquipTrigger();
                        for(var j=1;j<6;j++){
                            if(own.isDisabled(j)) own.$enableEquip('equip'+j);
                        }
                        own.$enableJudge();
                    }
                    "step 2"
                    var storage = player.storage.ymdameng.player;
                    var own;
                    var players=[];
                    var i, j;
                    function getDifference(arr1, arr2) {
                        var difference = [];
                        arr1.forEach(function(value) {
                            if (!arr2.includes(value)) difference.push(value);
                        });
                        arr2.forEach(function(value) {
                            if (!arr1.includes(value)) difference.push(value);
                        });
                        return difference;
                    }
                    for (i = 0; i < storage.length; i++) {
                        own = storage[i].player;
                        players.add(own);
                        if (own.isAlive()) {
                            for (j = 0; j < storage[i].handcards1.length; j++) {
                                if (storage[i].handcards1[j]) own.node.handcards1.appendChild(storage[i].handcards1[j]);
                                for(var k = 0; k < storage[i].special.length; k++){
                                    if(storage[i].handcards1[j] == storage[i].special[k][0]){
                                        storage[i].handcards1[j].addGaintag(storage[i].special[k][1].slice(0));
                                        storage[i].handcards1[j].classList.add('glows');
                                    }
                                }
                            }
                            for (j = 0; j < storage[i].handcards2.length; j++) {
                                if (storage[i].handcards2[j]) own.node.handcards2.appendChild(storage[i].handcards2[j]);
                                for(var k = 0; k < storage[i].special.length; k++){
                                    if(storage[i].handcards2[j] == storage[i].special[k][0]){
                                        storage[i].handcards2[j].addGaintag(storage[i].special[k][1].slice(0));
                                        storage[i].handcards2[j].classList.add('glows');
                                    }
                                }
                            }
                            for (j = 0; j < storage[i].equips.length; j++) {
                                if (storage[i].equips[j]) {
                                    storage[i].equips[j].style.transform = '';
                                    if(get.translation(storage[i].equips[j])=='已废除') own.$disableEquip(get.subtype(storage[i].equips[j]));
                                    else own.$equip(storage[i].equips[j]);
                                }
                            }
                            for (j = 0; j < storage[i].judges.length; j++) {
                                if (storage[i].judges[j]) {
                                    storage[i].judges[j].style.transform = '';
                                    storage[i].judges[j].viewAs = storage[i].viewAs[j];
                                    if (storage[i].judges[j].viewAs && storage[i].judges[j].viewAs != storage[i].judges[j].name && storage[i].judges[j].classList.contains('fullskin')) {
                                        storage[i].judges[j].classList.add('fakejudge');
                                        storage[i].judges[j].node.background.innerHTML = lib.translate[storage[i].judges[j].viewAs + '_bg'] || get.translation(storage[i].judges[j].viewAs)[0]
                                    }
                                    if(get.translation(storage[i].judges[j])=='已废除') own.$disableJudge();
                                    else own.node.judges.appendChild(storage[i].judges[j]);
                                }
                            }
                            for (j = 0; j < storage[i].xs.length; j++) {
                                if (storage[i].xs[j][0]) {
                                    storage[i].xs[j][0].style.transform = '';
                                    own.node.expansions.appendChild(storage[i].xs[j][0]);
                                    storage[i].xs[j][0].addGaintag(storage[i].xs[j][1]);
                                }
                            }
                            own.update();
                        }
                        for(var j = 0; j < event.storage.length; j++){
                            if(own == event.storage[j].player){
                                event.num+=(getDifference(event.storage[j].hs,storage[i].hs).length+getDifference(event.storage[j].es,storage[i].equips.filter(item=>get.translation(item)!='已废除')).length+getDifference(event.storage[j].js,storage[i].judges.filter(item=>get.translation(item)!='已废除')).length+getDifference(event.storage[j].ss,storage[i].special).length+getDifference(event.storage[j].xs,storage[i].xs).length);
                            }
                        }
                    }
                    for(var i of event.storage){
                        if(!players.contains(i.player)) event.num+=(i.hs.length+i.es.length+i.js.length+i.ss.length+i.xs.length);
                    }
                    var data = {};
                    for (var i = 0; i < game.players.length; i++) {
                        data[game.players[i].dataset.position] = {
                            h: get.cardsInfo(game.players[i].getCards('h')),
                            e: get.cardsInfo(game.players[i].getCards('e')),
                            j: get.cardsInfo(game.players[i].getCards('j')),
                            s: get.cardsInfo(game.players[i].getCards('s')),
                            x: get.cardsInfo(game.players[i].getCards('x')),
                        }
                    }
                    game.addVideo('skill', player, ['ymdameng', data]);
                    var pile=player.storage.ymdameng.game;
                    var long=[];
                    while(ui.cardPile.childElementCount){
                        long.add(ui.cardPile.firstChild);
                        ui.cardPile.firstChild.remove();
                    }
                    while(ui.discardPile.childElementCount){
                        long.add(ui.discardPile.firstChild);
                        ui.discardPile.firstChild.remove();
                    }
                    for(var i=0;i<pile[0].length;i++){
                        ui.cardPile.appendChild(pile[0][i]);
                        long.remove(pile[0][i]);
                    }
                    for(var i=0;i<pile[1].length;i++){
                        ui.discardPile.appendChild(pile[1][i]);
                        long.remove(pile[1][i]);
                    }
                    for(var i=0;i<long.length;i++){
                        ui.discardPile.insertBefore(long[i],ui.discardPile.lastChild);
                    }
                    game.animate.window(2);
                    ui.updatehl();
                    "step 3"
                    if(event.num>0){
                        player.draw(event.num);
                        player.recover();
                        if(event.num<=20) player.storage.ymdameng_roundcount--;
                    }
                },
                ai:{
                    order:4,
                    result:{
                        player:function(player){
                            var storage = player.storage.ymdameng.player;
                            var num = 1;
                            for (var i = 0; i < storage.length; i++) {
                                if (game.players.contains(storage[i].player)) {
                                    var att = get.attitude(player, storage[i].player);
                                    var num2 = storage[i].value - storage[i].player.countCards('hesx') + storage[i].player.countCards('j');
                                    if (att > 0) num += num2;
                                    else if (att <= 0) num -= num2;
                                }
                            }
                            if (player.isDying()) num+=5;
                            return num - Math.min(1, game.players.length / 2);
                        },
                    },
                },
                group:'ymdameng_round',
                subSkill:{
                    round:{
                        init:function(player){
                            lib.skill.ymdameng.group.remove('ymdameng_roundcount');
                            lib.skill.ymdameng_roundcount.mode=[];
                            game.finishSkill('ymdameng_roundcount');
                            var round=lib.skill.ymdameng.round;
                            if(typeof player.storage[name+'count']!=='number') player.storage[name+'count']=1-round;
                        },
                        trigger:{
                            global:"roundStart",
                        },
                        silent:true,
                        forced:true,
                        popup:false,
                        marktext:"梦",
                        intro:{
                            mark:function(dialog,storage,player){
                                var str='';
                                var name='ymdameng_roundcount';
                                storage=player.storage[name];
                                var info=get.info(name.slice(0,name.indexOf('_roundcount')));
                                if(info&&info.addintro){
                                    str+=info.addintro(storage,player);
                                }
                                var round=lib.skill.ymdameng.round;
                                var num=round-(game.roundNumber-storage);
                                if(num>0){
                                    str+=get.cnNumber(num)+'轮后'+(info.roundtext||'技能重置');
                                }
                                else{
                                    str+='技能可发动';
                                }
                                dialog.addText('<li>'+str+'<br>');
                                if(player.isUnderControl(true)){
                                    var players=player.storage.ymdameng.player;
                                    dialog.addText('已记录信息：<br>');
                                    for(var i=0;i<players.length;i++){
                                        dialog.add('<li><p="text">'+get.translation(players[i]['player'])+'</div>');
                                        dialog.addAuto([[players[i]['player'].name1],'character']);
                                        if(players[i].player==player){
                                            dialog.add('<div class="text" style="text-align:left;">手牌区：</div>');
                                            if(players[i].hs.length) dialog.add(players[i].hs);
                                        }
                                        else dialog.add('<div class="text" style="text-align:left;">手牌区：共有'+players[i].hs.length+'张牌</div>');
                                        dialog.add('<div class="text" style="text-align:left;">装备区：</div>');
                                        if(players[i].equips.length){
                                            var temp=[]
                                            for(var j=0;j<players[i].equips.length;j++){
                                               if(get.translation(players[i].equips[j])=='已废除') dialog.addText('<li>'+get.translation(players[i].equips[j].name+'_info')+'<br>');
                                               else temp.push(players[i].equips[j]);
                                            }
                                            if(temp.length) dialog.add(temp);
                                        }
                                        dialog.add('<div class="text" style="text-align:left;">判定区：</div>');
                                        if(players[i].judges.length){
                                            var temp=[];
                                            for(var j=0;j<players[i].judges.length;j++){
                                               if(get.translation(players[i].judges[j])=='已废除') dialog.addText('<li>'+get.translation(players[i].judges[j].name+'_info')+'<br>');
                                               else temp.push(players[i].judges[j]);
                                            }
                                            if(temp.length) dialog.add(temp);
                                        }
                                        if(players[i].player==player){
                                            dialog.add('<div class="text" style="text-align:left;">特殊区：</div>');
                                            if(players[i].special.length) dialog.add(players[i].special);
                                        }
                                        else dialog.add('<div class="text" style="text-align:left;">特殊区：共有'+players[i].special.length+'张牌</div>');
                                        if(players[i].player==player){
                                            dialog.add('<div class="text" style="text-align:left;">武将区：</div>');
                                            if(players[i].xs.length) dialog.add(players[i].xs);
                                        }
                                        else dialog.add('<div class="text" style="text-align:left;">武将区：共有'+players[i].xs.length+'张牌</div>');
                                    }
                                }
                                else return '已记录信息';
                            },
                            markcount:function(storage,player){
                                var round=lib.skill.ymdameng.round;
                                storage=player.storage.ymdameng_roundcount;
                                var num=round-(game.roundNumber-storage);
                                if(num>0){
                                    return num;
                                }
                                return 0;
                            },
                        },
                        content:function () {
                            var skill=event.name.slice(0,event.name.indexOf('_round'));
                            if(lib.skill[skill].round-(game.roundNumber-player.storage[event.name+'count'])>0){
                                player.updateMarks();
                            }
                            var handcards1, handcards2, judges, equips, viewAs, i, j, special, xs, hs;
                            player.storage.ymdameng = {
                                player:[],
                                game:[]
                            }
                            event.cardPile=[];
                            event.discardPile=[];
                            for(var i=0;i<ui.cardPile.childElementCount;i++){
                                event.cardPile.push(ui.cardPile.childNodes[i]);
                            }
                            for(var i=0;i<ui.discardPile.childElementCount;i++){
                                event.discardPile.push(ui.discardPile.childNodes[i]);
                            }
                            for (i = 0; i < game.players.length; i++) {
                                viewAs = [];
                                handcards1 = [];
                                handcards2 = [];
                                hs = [];
                                judges = [];
                                equips = [];
                                special = [];
                                xs = [];
                                for (j = 0; j < game.players[i].node.handcards1.childNodes.length; j++) handcards1.push(game.players[i].node.handcards1.childNodes[j]);
                                for (j = 0; j < game.players[i].node.handcards2.childNodes.length; j++) handcards2.push(game.players[i].node.handcards2.childNodes[j]);
                                for (j = 0; j < game.players[i].node.judges.childNodes.length; j++) {
                                    //if(get.translation(game.players[i].node.judges.childNodes[j])!='已废除'){
                                        viewAs.push(game.players[i].node.judges.childNodes[j].viewAs);
                                        judges.push(game.players[i].node.judges.childNodes[j]);
                                    //}
                                }
                                for (j = 0; j < game.players[i].node.equips.childNodes.length; j++){
                                    /*if(get.translation(game.players[i].node.equips.childNodes[j])!='已废除')*/ equips.push(game.players[i].node.equips.childNodes[j]);
                                }
                                for (j = 0; j < game.players[i].getCards('s').length; j++) special.push([game.players[i].getCards('s')[j],game.players[i].getCards('s')[j].gaintag]);
                                for (j = 0; j < game.players[i].getCards('h').length; j++) hs.push(game.players[i].getCards('h')[j]);
                                for (j = 0; j < game.players[i].getCards('x').length; j++) xs.push([game.players[i].getCards('x')[j],game.players[i].getCards('x')[j].gaintag]);
                                player.storage.ymdameng.player.push({
                                    player: game.players[i],
                                    handcards1: handcards1,
                                    handcards2: handcards2,
                                    judges: judges,
                                    equips: equips,
                                    viewAs: viewAs,
                                    special: special,
                                    hs: hs,
                                    xs: xs,
                                    value: handcards1.length + handcards2.length + game.players[i].getCards('e').length + special.length  + xs.length + judges.slice(0).removeArray(game.players[i].getCards('j')).length- game.players[i].getCards('j').length - equips.slice(0).removeArray(game.players[i].getCards('e')).length
                                });
                            }
                            player.storage.ymdameng.game.push(event.cardPile);
                            player.storage.ymdameng.game.push(event.discardPile);
                            player.markSkill(event.name);
                        },
                    },
                },
            },
            ymtianming: {
                audio:"tianming",
                enable:["chooseToUse","chooseToRespond"],
                filter:function (event,player){
                    if((player.getStat().skill.ymtianming||0)>=Math.max(1,player.hp)) return false;
                    var type=[];
                    for(var i = 0; i < lib.inpile.length; i++){
                        if(event.filterCard({name:lib.inpile[i]},player,event)) type.add(get.type(lib.inpile[i],'trick'));
                    }
                    for(var i of type){
                        if(player.countCards('hes',function(card){
                            return get.type(card,'trick')==i;
                        })>=2) return true;
                    }
                    return false;
                },
                hiddenCard: function(player, name) {
                    if(player.countCards('hes',function(card){
                        return get.type(card,'trick')==get.type(name,'trick');
                    })>=2) return true;
                },
                chooseButton: {
                    dialog: function(event, player) {
                        var list = [];
                        for (var i = 0; i < lib.inpile.length; i++) {
                            var name = lib.inpile[i];
                            if(!event.filterCard({name: name},player,event)) continue;
                            if(player.countCards('hes',function(card){
                                return get.type(card,'trick')==get.type(name,'trick');
                            })<2) continue;
                            if (name == 'sha') {
                                list.push(['基本', '', 'sha']);
                                for (var j of lib.inpile_nature) list.push(['基本', '', 'sha', j]);
                            }
                            else if (get.type(name) == 'basic') list.push(['基本', '', name]);
                            else if (get.type(name,'trick') == 'trick') list.push(['锦囊', '', name]);
                            else if (get.type(name) == 'equip') list.push(['装备', '', name]);
                            else list.push([get.type(name), '', name]);
                        }
                        if (list.length == 0) {
                            return ui.create.dialog('无可用牌');
                        }
                        return ui.create.dialog('天命', [list, 'vcard']);
                    },
                    filter: function(button, player) {
                        return _status.event.getParent().filterCard({name: button.link[2]}, player, _status.event.getParent());
                    },
                    check: function(button) {
                        var player = _status.event.player;
                        if (player.countCards('hes', button.link[2]) > 0) return 0;
                        if (button.link[2] == 'wugu') return 0;
                        var effect = player.getUseValue(button.link[2]);
                        if (effect > 0) return effect;
                        return 0;
                    },
                    backup: function(links, player) {
                        return {
                            audio:"tianming",
                            filterCard:function(card,player){
                                if(ui.selected.cards.length){
                                    return get.type(card,'trick')==get.type(ui.selected.cards[0],'trick');
                                }
                                if(get.type(card,'trick')!=get.type(links[0][2],'trick')) return false;
                                var cards=player.getCards('hes');
                                for(var i=0;i<cards.length;i++){
                                    if(card!=cards[i]){
                                        if(get.type(card,'trick')==get.type(cards[i],'trick')) return true;
                                    }
                                }
                                return false;
                            },
                            check:function(card){
                                return 8-get.value(card);
                            },
                            complexCard:true,
                            selectCard: 2,
                            popname: true,
                            position: 'hes',
                            viewAs: {
                                name: links[0][2],
                                nature: links[0][3]
                            },
                            precontent:function(){
                                player.logSkill('ymtianming');
                                if(!player.getStat().skill.ymtianming) player.getStat().skill.ymtianming=0;
                                player.getStat().skill.ymtianming++;
                                var cards=event.result.cards;
                                player.discard(cards);
                                player.draw(2)
                                var type=get.type(event.result.card);
                                if(['delay','equip'].contains(get.type(event.result.card))){
                                    event.result.cards=[game.createCard(event.result.card.name)];
                                }
                                delete event.result.skill;
                            },
                        }
                    },
                    prompt: function(links, player) {
                       return '弃置两张同类型的牌并摸两张牌，然后将弃置的牌视为' + (get.translation(links[0][3]) || '') + get.translation(links[0][2])+'使用';
                    },
                },
                ai: {
                    order: 10,
                    result: {
                        player: function(player) {
                            return 2;
                        },
                    },
                    threaten: 1,
                },
            },
            ymfuhan:{
                audio:'mizhao',
                unique:true,
                trigger:{
                    player:"drawEnd",
                },
                zhuSkill:true,
                forced:true,
                filter:function(event,player){
                    if(!player.hasZhuSkill('ymfuhan')) return false;
                    if(player == _status.currentPhase) return false;
                    var list=[];
                    game.filterPlayer(function(current){
                        if(current!=player&&current.countCards('he')>0&&lib.group.contains(current.group)){
                            list.add(current.group);
                        }
                    });
                    return list.length>0;
                },
                content:function(){
                    'step 0'
                    var list=[];
                    game.filterPlayer(function(current){
                        if(current!=player&&current.countCards('he')>0&&lib.group.contains(current.group)){
                            list.add(current.group);
                        }
                    });
                    var choose,list2=[];
                    for(var i=0;i<list.length;i++){
                        var att=0;
                        game.filterPlayer(function(current){
                            if(current!=player&&current.group==list[i]) att+=get.attitude(player,current);
                        });
                        list2.push(att);
                    }
                    choose=list[list2.indexOf(Math.max.apply(null,list2))]
                    player.chooseControl(list,function(){
                        return _status.event.goon;
                    }).set('prompt','选择一个势力').set('goon',choose);
                    'step 1'
                    if(result.control!='cancel2'){
                        game.log(player,'选择了','#b'+result.control,'势力');
                        event.players=game.filterPlayer(function(current){
                            return current!=player&&current.group==result.control;
                        });
                        event.num=0;
                    }
                    else event.finish();
                    'step 2'
                    var target=event.players[event.num];
                    var he=target.getCards('he');
                    if(he.length>0){
                        if(he.length>1) target.chooseCard('he',true,'选择交给'+get.translation(player)+'任意张牌').set('ai',(card)=>-get.value(card));
                        else event._result={bool:true,cards:he};
                    }
                    'step 3'
                    if(result.bool){
                        event.players[event.num].give(result.cards,player);
                    }
                    event.num++;
                    if(event.num<event.players.length) event.goto(2);
                    else event.finish();
                },
            },
            ymxiaowu:{
                audio:'shuangxiong',
                enable:"phaseUse",
                usable:1,
                filterTarget:true,
                content:function(){
                    'step 0'
                    if(player.countCards('h')>0) player.showCards(player.getCards('h'));
                    'step 1'
                    event.suit=[];
                    player.getCards('h').forEach(i=>{
                        event.suit.add(get.suit(i));
                    });
                    event.num=event.suit.length;
                    player.draw(lib.suit.length-event.suit.length);
                    'step 2'
                    var num=0;
                    if(event.suit.length>=4) num++;
                    if(target.isAlive()) player.useCard({name:'juedou',isCard:true},'nowuxie',target,'noai').set('num',num).set('oncard',function(){
                        var evt=_status.event;
                        evt.baseDamage+=evt.num;
                    });
                    game.delay(0.5);
                    event.num--;
                    if(event.num>0) event.redo();
                },
                ai:{
                    order:8,
                    expose:0.2,
                    result:{
                        target:-1,
                        player:function(player,target){
                           if(target.countCards('h')==0) return 4;
                           if(target.countCards('h')==1) return 2;
                           if(player.hp<=2) return 0.5;
                           if(player.countCards('h','sha')==0) return 0.1;
                           return 1;
                       },
                   },
               },
            },
            ymzhushi:{
                audio:'shuangxiong',
                trigger:{
                    global:"useCard2",
                },
                direct:true,
                filter:function(event,player){
                    return event.card.name=='juedou'&&player.countCards('hes')>0;
                },
                content:function(){
                    'step 0'
                    event.num=0;
                    player.chooseCard('he',get.prompt('ymzhushi')).set('ai1', function (card) {
                        return 10-get.value(card);
                    }).set('ai2', function (target) {
                        var player = _status.event.player;
                        return get.attitude(player, trigger.player) > 0;
                    }).set('prompt2',get.translation('ymzhushi_info'));
                    'step 1'
                    if(result.cards){
                        player.logSkill(event.name,trigger.player);
                        player.chongzhu(result.cards);
                        var prompt2='为'+get.translation(trigger.card)+'增加一个目标';
                        trigger.player.chooseTarget(get.prompt('ymzhushi'),function(card,player,target){
                            var player=_status.event.player;
                            return !_status.event.targets.contains(target)&&lib.filter.targetEnabled2(_status.event.card,player,target);
                        },1).set('prompt2',prompt2).set('ai',function(target){
                            var trigger=_status.event.getTrigger();
                            var player=_status.event.player;
                            return get.effect(target,trigger.card,trigger.player,trigger.player);
                        }).set('card',trigger.card).set('targets',trigger.targets);
                    }
                    else event.finish();
                    'step 2'
                    if(result.bool){
                        if(!event.isMine()&&!event.isOnline()) game.delayx();
                        event.targets=result.targets;
                    }
                    else event.goto(4);
                    'step 3'
                    if(event.targets){
                        trigger.player.line(event.targets,'fire');
                        trigger.targets.addArray(event.targets);
                    }
                    'step 4'
                     var id=trigger.targets[event.num]['playerid'];
                     var map=trigger.customArgs;
                     if(!map[id]) map[id]={};
                     if(!map[id].shaReq) map[id].shaReq={};
                     if(!map[id].shaReq[id]) map[id].shaReq[id]=1;
                     map[id].shaReq[id]++;
                     event.num++;
                     if(event.num<trigger.targets.length) event.redo();
                },
            },
            ymbingwei:{
                audio:'shuangxiong',
                trigger:{
                    global:'phaseBefore',
                    player:'enterGame',
                },
                filter:function(event,player){
                    return false;
                },
                direct:true,
                forced:true,
                fixed:true,
                charlotte:true,
                forceunique:true,
                unique:true,
                init:function(player){
                    if(!lib.ymbingwei) lib.ymbingwei=['qy_qyyanliang', 'qy_qywenchou'];
                    lib.ymbingwei.remove(player.name);
                    if(_status.event.getParent('phaseLoop')&&!player.master&&lib.ymbingwei.length&&ui.arena.dataset.number<10){
                        var next = game.createEvent('ymbingwei');
                        next.player = player;
                        next.setContent(lib.skill.ymbingwei.content);
                    }
                    if(lib.ymbingwei.length==0) lib.ymbingwei=['qy_qyyanliang', 'qy_qywenchou'];
                },
                onremove:function(player){
                    if(player.master){
                        player.die()._triggered=null;
                        game.removePlayer(player);
                        delete player.master.branch;
                    }
                    else if(player.branch){
                        player.branch.die()._triggered=null;
                        game.removePlayer(player.branch);
                        delete player.branch;
                    }
                    //十周年UI本身存在bug，需要用此代码刷新
                    game.delay();
                    setTimeout(() => {
                        game.players.concat(game.dead).forEach(current => current.checkBoundsCache && current.checkBoundsCache(true));
                    }, 500);
                    if(get.mode()=='boss'&&game.players.concat(game.dead).length<8) ui.arena.setNumber(8);
                },
                content:function(){
                    player.logSkill(event.name);
                    var ran=[1,0].randomGet();
                    var num=Number(player.dataset.position)+ran;
                    if(num<=0) num=game.players.length+game.dead.length;
                    var name=['qy_qyyanliang','qy_qywenchou'].removeArray([player.name1,player.name2]);
                    if(name.length){
                        var target=game.addPlayer(num,name.randomGet());
                        if(get.mode()=='boss'&&game.players.concat(game.dead).length<8) ui.arena.setNumber(8);
                        player.branch=target;
                        if(_status.gameDrawed) target.draw(4);
                        target.side=player.side;
                        target.identity=player.identity;
                        target.setIdentity(player.identity);
                        target._trueMe=player;
                        target.master=player;
                        Object.assign(target.ai,player.ai);
                        game.qyAddGlobalSkill('autoswap');
                    }
                },
                group:['ymbingwei_heti','ymbingwei_win'],
                subSkill:{
                    heti:{
                        audio:'shuangxiong',
                        trigger:{
                            player:'damageEnd',
                            source:'damageSource',
                            global:['dieBegin','die'],
                        },
                        forceDie:true,
                        forced:true,
                        fixed:true,
                        charlotte:true,
                        forceunique:true,
                        unique:true,
                        filter:function(event,player){
                            if(!event.player.branch&&!event.player.master) return false;
                            if((event.player.branch&&event.player.branch.master!=event.player)||(event.player.master&&event.player.master.branch!=event.player)) return false;
                            if(event.name=='damage') return event.card&&event.card.name=='juedou'&&event.getParent('useCard').player==event.player;
                            return true;
                        },
                        content:function(){
                            'step 0'
                            var target=player.branch?player.branch:player.master;
                            // Optional legacy UI animation; combat resolution does not depend on it.
                            lib.qyMovePlayer2WindowCenter?.([target,player]);
                            game.delay(3);
                            'step 1'
                            game.animate.window(1);
                            game.delay(3);
                            'step 2'
                            var target=player.branch?player.branch:player.master;
                            var member=player.master?player.master:player;
                            var member2=player.branch?player.branch:player;
                            var bool=[player,target].contains(game.me)?true:false;
                            if(bool) game.swapPlayerAuto(member);
                            var num=parseInt(member.dataset.position);
                            player.hp=0;
                            target.hp=0;
                            player.classList.add('dead');
                            target.classList.add('dead');
                            game.removePlayer(player.branch?player.branch:player);
                            game.animate.window(2);
                            //game.removePlayer(target);
                            var newPlayer=game.replacePlayer(member,'qy_qyyanliangwenchou');
                            //十周年UI本身存在bug，需要用此代码刷新
                            game.delay();
                            setTimeout(() => {
                                game.players.concat(game.dead).forEach(current => current.checkBoundsCache && current.checkBoundsCache(true));
                            }, 500);
                            if(get.mode()=='boss'&&game.players.concat(game.dead).length<8) ui.arena.setNumber(8);
                            var handcards1=[],handcards2=[],judges1=[],judges2=[],equips1=[],equips2=[],expansions=[];
                            for(var i=0;i<member.node.handcards1.childNodes.length;i++) handcards1.push(member.node.handcards1.childNodes[i]);
                            for(var i=0;i<member2.node.handcards1.childNodes.length;i++) handcards1.push(member2.node.handcards1.childNodes[i]);
                            for(var i=0;i<member.node.handcards2.childNodes.length;i++) handcards2.push(member.node.handcards2.childNodes[i]);
                            for(var i=0;i<member2.node.handcards2.childNodes.length;i++) handcards2.push(member2.node.handcards2.childNodes[i]);
                            for(var i=0;i<member.node.judges.childNodes.length;i++) judges1.push(member.node.judges.childNodes[i]);
                            for(var i=0;i<member2.node.judges.childNodes.length;i++) judges2.push(member2.node.judges.childNodes[i]);
                            for(var i=0;i<member.node.equips.childNodes.length;i++) equips1.push(member.node.equips.childNodes[i]);
                            for(var i=0;i<member2.node.equips.childNodes.length;i++) equips2.push(member2.node.equips.childNodes[i]);
                            for(var i=0;i<member.node.expansions.childNodes.length;i++) expansions.push(member.node.expansions.childNodes[i]);
                            for(var i=0;i<member2.node.expansions.childNodes.length;i++) expansions.push(member2.node.expansions.childNodes[i]);
                            handcards1.forEach(i=>{newPlayer.node.handcards1.appendChild(i)});
                            handcards2.forEach(i=>{newPlayer.node.handcards2.appendChild(i)});
                            var feichu;
                            for(var i=0;i<judges1.length;i++){
                                if(get.translation(judges1[i])=='已废除'){
                                    newPlayer.$disableJudge();
                                    feichu=true;
                                    break;
                                }
                                else newPlayer.node.judges.appendChild(judges1[i]);
                            }
                            if(!feichu){
                                for(var i=0;i<judges2.length;i++){
                                    if(get.translation(judges2[i])!='已废除'&&!newPlayer.hasJudge(judges2[i].views||judges2[i].name)) newPlayer.node.judges.appendChild(judges2[i]);
                                    else{
                                        judges2[i].discard();
                                        newPlayer.$throw(judges2[i]);
                                    }
                                }
                            }
                            for(var i=0;i<equips1.length;i++){
                                if(get.translation(equips1[i])=='已废除') newPlayer.$disableEquip(get.subtype(equips1[i]));
                                else newPlayer.$equip(equips1[i]);
                            }
                            for(var i=0;i<equips2.length;i++){
                                if(get.translation(equips2[i])!='已废除'&&!newPlayer.isDisabled(get.subtype(equips2[i]))&&newPlayer.isEmpty(get.subtype(equips2[i]))) newPlayer.$equip(equips2[i]);
                                else{
                                    equips2[i].discard();
                                    newPlayer.$throw(equips2[i]);
                                }
                            }
                            expansions.forEach(i=>{newPlayer.node.expansions.appendChild(i)});
                            for(var mark in member.marks){
                                member.unmarkSkill(mark);
                            }
                            while(member.node.marks.childNodes.length>1){
                                member.node.marks.lastChild.remove();
                            }
                            for(var mark in member2.marks){
                                member2.unmarkSkill(mark);
                            }
                            while(member2.node.marks.childNodes.length>1){
                                member2.node.marks.lastChild.remove();
                            }
                            newPlayer.identity=member.identity;
                            newPlayer.side=member.side;
                            newPlayer.setIdentity(member.identity);
                            Object.assign(newPlayer.ai,member.ai);
                            if(game.zhu==member){
                                game.zhu=newPlayer;
                                if(get.mode()=='doudizhu') newPlayer.addSkill(['feiyang','bahu'],false,false,false,true);
                            }
                            if(bool){
                                game.swapControl(newPlayer);
                                ui.me.show();
                                ui.auto.show();
                                ui.wuxie.show();
                            }
                            if([player,target].contains(_status.event.getParent('phase').player)) newPlayer.insertPhase();
                        },
                    },
                    win:{
                        trigger:{
                            global:['dieBegin','die','phaseAfter'],
                        },
                        silent:true,
                        popup:false,
                        forced:true,
                        filter:function(event,player,name){
                            var mode = get.mode();
                            var players=[];
                            if(player.master) players.add(player.master);
                            if(player.branch) players.add(player.branch);
                            players.add(player);
                            if (!players||!players.length) return false;
                            if (mode == 'identity'&&name=='dieBegin'&&player.identity=='nei'){
                                return game.players.length-players.length<=1;
                            }
                            else if(name == 'die' || name == 'phaseAfter') return player.getEnemies().length == 0;
                        },
                        content:function(){
                            'step 0'
                            game.delay();
                            'step 1'
                            if (game.showIdentity) {
                                game.showIdentity();
                            }
                            if (player.isUnderControl(true) || player.getFriends().contains(game.me)) {
                                game.over(true);
                            } else {
                                game.over(true);
                            }
                        },
                    },
                },
            },
            ymshuangxiong:{
                audio:'shuangxiong',
                trigger:{
                    player:'phaseZhunbeiBegin',
                },
                forced:true,
                content:function(){
                    'step 0'
                    var cards=get.cards(Math.max(player.hp,2));
                    game.cardsGotoOrdering(cards);
                    player.showCards(cards);
                    player.gain(cards,'gain2');
                    event.type=[];
                    cards.forEach(i=>{
                        event.type.add(get.type(i,'trick'));
                    });
                    event.num=event.type.length;
                    'step 1'
                    player.chooseUseTarget('juedou',false,false).set('oncard',function(){
                        var evt=_status.event;
                        evt.nowuxie=true;
                    }).set('prompt2','还可使用'+event.num+'次【决斗】');
                    'step 2'
                    if(result.bool){
                        event.num--;
                        if(event.num>0) event.goto(1);
                    }
                    else event.finish();
                },
                group:['ymshuangxiong_sha','ymshuangxiong_damage'],
                subSkill:{
                    sha:{
                        trigger:{
                            player:'respondAfter',
                        },
                        forced:true,
                        filter:function(event,player){
                            return event.card.name=='sha'&&event.getParent(2).name=='juedou';
                        },
                        content:function(){
                            player.chooseUseTarget(trigger.card,false,false,'nodistance',[1,2]);
                        },
                    },
                    damage:{
                        trigger:{
                            source:'damageBegin',
                        },
                        forced:true,
                        filter:function(event,player){
                            //return event.caed&&event.card.name=='juedou';
                            return true;
                        },
                        content:function(){
                            var num=player.getHistory('sourceDamage').length;
                            if(num>=0&&trigger.player!=player) trigger.player.addTempSkill('fengyin');
                            if(num>=1&&trigger.player!=player) trigger.num++;
                            if(num>=2&&trigger.player!=player) trigger.player.turnOver(true);
                            if(num==3) player.recover(player.maxHp-player.hp);
                        },
                    },
                },
            },
            ymxiongbing:{
                audio:'shuangxiong',
                trigger:{
                    player:['useCard','respond'],
                },
                forced:true,
                dutySkill:true,
                filter:function(event,player){
                    return player.countCards('h','sha')<=0;
                },
                content:function(){
                    player.draw();
                },
                derivation:['ymxiaowu','ymzhushi','wushuang'],
                group:['ymxiongbing_achive','ymxiongbing_fail'],
                subSkill:{
                    achive:{
                        trigger:{
                            player:'damageEnd',
                            source:'damageSource',
                        },
                        audio:'shuangxiong',
                        skillAnimation:true,
                        animationColor:'metal',
                        forced:true,
                        filter:function(event,player){
                            var num=0;
                            player.getAllHistory('damage',function(evt){
                                num+=evt.num;
                            });
                            player.getAllHistory('sourceDamage',function(evt){
                                num+=evt.num;
                            });
                            return num>=5;
                        },
                        content:function(){
                            game.log(player,'成功完成使命');
                            player.awakenSkill('ymxiongbing');
                            player.addSkill(['ymxiaowu','ymzhushi']);
                            game.log(player,'获得了技能','#g【'+get.translation('ymxiaowu')+'】、【'+get.translation('ymzhushi')+'】');
                            var num=0;
                            player.getAllHistory('damage',function(evt){
                                num+=evt.num;
                            });
                            player.getAllHistory('sourceDamage',function(evt){
                                num+=evt.num;
                            });
                            player.draw(num);
                        },
                    },
                    fail:{
                        trigger:{
                            player:'dying',
                        },
                        audio:'shuangxiong',
                        forced:true,
                        content:function(){
                            'step 0'
                            game.log(player,'使命失败');
                            player.awakenSkill('ymxiongbing');
                            player.gainMaxHp();
                            'step 1'
                            player.recover(player.maxHp-player.hp);
                            player.addSkillLog('wushuang');
                        },
                    },
                },
            },

        },
        // 翻译
        translate: {
            "ymqianxing_append": "<span style=\"font-family: yuanli\">影牵万古星河畔，长明永夜照人间。</span>",
            "ymxingluo_append": "<span style=\"font-family: yuanli\">群星陨似颜如玉，一日鲛绡一日疏。</span>",
            "ymtayue_append": "<span style=\"font-family: yuanli\">几度飘零何时还，行遍山河踏月归。</span>",
            "ymyueyin_append": "<span style=\"font-family: yuanli\">锦瑟韶光星如雨，银汉迢迢月西沉。</span>",
            "ymfengqin_append": "<span style=\"font-family: yuanli\">风华何所似，侵晓雪初霁。</span>",
            "ymyucheng_append": "<span style=\"font-family: yuanli\">玉蟾清冷思悠悠，十里蝉鸣尽成霜。</span>",
            "ymtuoshu_append": "<span style=\"font-family: yuanli\">托书天地，只存在于一场做不完的梦。</span>",
            "ymtianjie_append": "<span style=\"font-family: yuanli\">天数已至，在劫难逃！</span>",
            "ymshuyun_append": "<span style=\"font-family: yuanli\">绿云浅梳桃李羡，白衣举袂画中仙。</span>",
            "ymshigu_append": "<span style=\"font-family: yuanli\">早知相思可蚀骨，缘何偏遇倾城色。</span>",
            "ymguiyuan_append": "<span style=\"font-family: yuanli\">草色凝烟君归日，桃花解愿我去时。</span>",
            "ymtianyu_append": "<span style=\"font-family: yuanli\">天命有数，春秋难御！</span>",
            // 武将翻译
            "thelandfool": "陆地沙雕",
            "qy_qyzuoci": "左慈",
            "qy_qycaoying": "曹婴",
            "qy_qyjiangwei": "姜维",
            "qy_qyzhangjiao": "张角",
            "qy_qyzhangxingcai": "张星彩",
            "qy_qyyuji": "于吉",
            "qy_qyliru": "李儒",
            "qy_qyjiaxu": "贾诩",
            "qy_qyhuangyueying": '黄月英',
            "qy_qyzhangrang": '张让',
            "qy_qysunce": '孙策',
            "qy_qyzhaoyun": '赵云',
            "qy_qysimayan": '司马炎',
            "qy_qyjianyong": '简雍',
            "qy_qyzhugeliang": '诸葛亮',
            "qy_qysimayi": '司马懿',
            "qy_qyzhangfei": '张飞',
            "qy_qymachao": '马超',
            "qy_qydongzhuo": '董卓',
            "qy_qyzhangliao": '张辽',
            "qy_qyliubei": '刘备',
            "qy_qydaqiao": '大乔',
            "qy_qypangtong": '庞统',
            "qy_qysunshangxiang": '孙尚香',
            "qy_qyxiahoudun": '夏侯惇',
            "qy_qyguanyu": '关羽',
            "qy_qyxunyu": '荀彧',
            "qy_qycaocao": '曹操',
            "qy_qycaochun": '曹纯',
            "qy_qyxiahouyuan": '夏侯渊',
            "qy_qyhuangzhong": '黄忠',
            "qy_qyzhanghe": '张郃',
            "qy_qyyuejin": '乐进',
            "qy_qyyujin": '于禁',
            "qy_qyxuhuang": '徐晃',
            "qy_qysunquan": '孙权',
            "qy_qyxiaoqiao": '小乔',
            "qy_qyzhouyu": '周瑜',
            "qy_qydiaochan": '貂蝉',
            "qy_qyhuanggai": '黄盖',
            "qy_qylvbu": '吕布',
            "qy_qycaoren": '曹仁',
            "qy_qyhuatuo": '华佗',
            "qy_qylusu": '鲁肃',
            "qy_qylvmeng": '吕蒙',
            "qy_qyluxun": '陆逊',
            "qy_qyxuchu": '许褚',
            "qy_qyliuxie": '刘协',
            "qy_qyyanliang": '颜良',
            "qy_qywenchou": '文丑',
            "qy_qyyanliangwenchou": '颜良文丑',
            //---------------------------------------boss------------------------------------------
            "qy_qyhanxing": '寒星',
            "qy_qylengyue": '冷月',
            "qy_qyqingyaoxuying": '清瑶',
            "qy_qyqingyaoxuying_double": '清瑶',
            "qy_qyjiaqi": '葭绮',

            // 扩展翻译
            "假装无敌Pack": '<span style="animation: -webkit-animation:fairy 20s infinite;animation:fairy 20s infinite;">假装无敌</span>',

            //武将栏分类
            dibiaodier: '<span style="animation: -webkit-animation:fairy 20s infinite;animation:fairy 20s infinite;">地表第二</span>',
            huanmengzhidie: '<span style="animation: -webkit-animation:fairy 20s infinite;animation:fairy 20s infinite;">幻梦之蝶</span>',
            wanlingzhiying: '<span style="animation: -webkit-animation:fairy 20s infinite;animation:fairy 20s infinite;">万灵之萤</span>',
            biluozhiling: '<span style="animation: -webkit-animation:fairy 20s infinite;animation:fairy 20s infinite;">碧落之灵</span>',

            // 技能翻译
            ymqiangsha: "强杀",
            "ymqiangsha_info": "锁定技，很多时机你可以杀死很多人……直到你不想爽了为止……",
            ymhuashen: "化身",
            "ymhuashen_info": "锁定技，游戏开始时/你的出牌阶段开始时/体力变化后你可以随机从五张未获得过的武将牌中选择获得至多两张武将牌上的所有技能直到你发动此技能；你每少选择一张武将牌，你摸一张牌；然后复原你的武将牌和装备区；若你的体力上限小于武将牌上的体力上限，你将其调整至武将牌上的体力上限。<br><span style='color: blue'>【注】：silent技、popup技发动不失去。",
            ymxinsheng: "新生",
            "ymxinsheng_info": "限定技，出牌阶段你可以令一名角色失去所有技能，然后获得随机X个技能。(X为你的技能总数)",
            ymlingren: "凌人",
            "ymlingren_info": "每回合限一次。当你使用带有「伤害」这一标签的牌指定目标后，你可以猜测其中的任意个目标的手牌中是否有基本牌，锦囊牌或装备牌。若你猜中的项目数：≥1，本回合你使用此类型的牌对该目标造成的伤害翻倍；≥2，你摸与此技能目标数等量张牌；若少于两张，本回合此技能你可发动的次数+1；≥3，该目标随机失效一个技能直到其回合结束，然后你获得此技能直到你的下回合开始。",
            ymfujian: "伏间",
            "ymfujian_info": "锁定技，回合开始阶段或回合结束阶段，你可以选择一名有手牌的角色观看其手牌并可与其交换任意张手牌，若你以此法交换了该角色所有手牌，则你随机获得本回合内进入弃牌堆一半的牌；你的【杀】可以额外指定一个目标。",
            ymguji: "孤计",
            "ymguji_info": "锁定技，若你的势力为场上最少的势力之一，当你造成伤害时，此伤害+1并弃置目标角色两张牌，然后你将势力改为与与目标角色相同；若你的势力为场上最多的势力之一，当你受到伤害后，你选择一名角色回复一点体力并摸两张牌，然后你将势力改为与与伤害来源相同。",
            ymhaixian: "害贤",
            "ymhaixian_info": "当你受到伤害时，你可以指定至多两名其他角色对其造成等量的伤害，然后你摸X张牌并可用任意方式分配给任意个角色。(X为场上最多的势力数)",
            ymzhonglie: "忠烈",
            "ymzhonglie_info": "当其他角色使用牌时，此牌为【桃】或带有「伤害」标签，你可以弃置一张牌；若如此做，你取消这些目标并成为此牌的唯一目标，然后，你摸取消目标数等量张牌。",
            ymtaiping: "太平",
            "ymtaiping_info": "当你因弃置而失去牌时，你可以进行一次判定，若判定结果为黑色/红色，你选择一名其他角色令其受到一点雷/火属性伤害；若以此法未造成伤害，随机执行一项：1.你摸2张牌，2.目标选择弃置2张牌。",
            ymqiyi: "起义",
            "ymqiyi_info": '每回合限3次，当你造成一点伤害时，你有概率发动一次【太平】。(此概率为当前<span style="color: red">设备电量</span>百分比)',
            ymhuangtian: "黄天",
            "ymhuangtian_info": '锁定技，场上每有一名与你势力相同的角色，你受到伤害后便摸一张牌；每有一名与你势力不同的角色，你受到伤害后便弃一张牌。（均不超过3张）',
            ymtiandao: "天道",
            "ymtiandao_info": '主公技，锁定技，若你宝物栏没有牌且没有被废除，则你视为装备着【太平要术】。',
            ymqiangwu: "枪舞",
            "ymqiangwu_info": '出牌阶段限一次，你可以猜测一种颜色并亮出牌堆顶的一张牌，若猜中你本回合的杀无距离无次数限制，若猜错你摸一张杀和一张酒。',
            ymjiejun: "劫军",
            "ymjiejun_info": "当你使用杀指定目标时，你可以选择目标区域内至多X张牌置于其武将牌上（X为其体力值）；你每选择一个区域的牌，此杀的伤害便+1。任意角色回合结束，你选择这些牌的一半获得之（向上取整），然后该角色获得剩余的牌。",
            ymkuidi: "溃敌",
            "ymkuidi_info": "锁定技，游戏开始时或你的杀每造成1点伤害，你获得一个“枪”标记；出牌阶段你可以移动1个“枪”标记给其他角色，拥有此标记的其他角色受到你造成的伤害+1，其回合开始阶段移除此标记，然后你选择一项:1.该角色受到1点随机属性伤害且本回合不能使用基本牌，2.该角色失去1点体力且本回合不能获得牌，3.你选择获得该角色区域内的两张牌。",
            ymguhuo: "蛊惑",
            "ymguhuo_info": "锁定技，游戏开始时/奇数轮开始时，你随机获得一张场下的武将牌加入你的【虚影】中；其他角色死亡后，你的本体将该角色的武将牌加入你的【虚影】中。你每获得一个【虚影】时，你选择此【虚影】的一个技能视为你拥有该技能；你的回合开始时/回合结束后/可以替换为任意【虚影】代替你进行游戏或切换回你的本体；【虚影】死亡后，你可以立即替换成任意【虚影】。<br><span style='color: orange'>【虚影】：拥有独立的技能、手牌区和装备区（共享判定区及其他效果）；出场时替代本体的位置。",
            ymfushu: "符术",
            "ymfushu_info": "锁定技，牌堆顶的X张牌始终对你可见(X为场上存活角色数且至少为4)；出牌阶段，你可以弃置一张手牌令1名角色的所有牌均视为【空白牌】直到回合结束；若该牌是你最后一张手牌，则改为直到该角色回合结束。",
            ymduce: "毒策",
            "ymduce_info": "出牌阶段限一次，你可以摸一张牌并指定一名角色，然后将一张牌置于该角色的武将牌上称为【毒策】并弃置其一张牌；该角色的回合开始阶段若其有【毒策】，其需选择一项：1.交给你一张牌，若此牌不为黑色锦囊牌，该角色不能使用或打出任何牌直到回合结束，2.失去一点体力，然后本回合所有技能失效。执行任一选项后，该角色弃置所有【毒策】。",
            ymdushi: "毒仕",
            "ymdushi_info": "任意角色回合结束后，若有角色于本回合受到伤害，则你可以弃置场上区域内的一张牌，然后对一名不为你的角色造成1点伤害。",
            ymzhuzhuo: "助卓",
            "ymzhuzhuo_info": "当与你同势力的角色造成伤害或受到伤害后，你可以令一名角色增加1点体力上限；1.该角色不为你，其摸一张♠️牌，若该角色本回合第一次因此摸牌，则额外摸一张♥️牌，2.该角色为你，你摸两张牌，每回合限一次。",
            ymxiance: "献策",
            "ymxiance_info": "出牌阶段，你可以亮出牌堆顶的三张牌，并置于一名没有“策”的角色角色武将牌上称为“策”，该角色下回合获得这些“策”，然后根据“策”的类型获得以下效果直到该角色回合结束：1.基本牌，从牌堆获得每种【杀】各一张和随机三张不同名的基本牌且本回合基本牌无距离次数限制并可额外指定一个目标，2.锦囊牌，你的摸牌阶段额外摸两张牌；使用普通锦囊牌摸一张牌且可额外或减少指定至多两个目标，3.装备牌，随机将装备区空白栏置入两张装备并回复一点体力且本回合手牌无上限，造成伤害时，此伤害+1。",
            ymzhukou: "逐寇",
            "ymzhukou_info": "转换技，每回合限X次；阴：当你使用或成为黑色牌的目标时，你可指定任意名拥有“献策”的角色各摸两张牌，你摸一张牌；阳：当你使用或成为红色牌的目标时，你可指定任意名没有“献策”的角色各弃两张牌，你摸一张牌。(X为场上角色数)；锁定技，其他角色濒死回复体力时，若其没有“策”，若回复值大于1则改为1，否则此回复值-1。",
            ymlinglong: "玲珑",
            "ymlinglong_info": "回合开始阶段，你可以弃置至多三张牌，若你以此法弃置了：基本牌，你摸一张牌；锦囊牌，你回复一点体力；装备牌，你本回合获得技能〖集智〗。然后你从牌库里或牌库外随机获得等量张装备牌。",
            ymjiqiao: "机巧",
            "ymjiqiao_info": "出牌阶段限两次，你可以弃置一张牌煅造装备区内未被煅造的一张牌或改造一张装备牌的装备类型；你以此法煅造或改造的装备牌离开装备区后复原。",
            ymqicai: "奇才",
            "ymqicai_info": "锁定技，你每次弃牌后从牌堆里获得X张锦囊牌；你的普通锦囊牌无使用距离限制且改为可选择任意合法目标(X为1~弃牌数的随机值)。",
            ymtaoluan: "滔乱",
            "ymtaoluan_info": "每回合限一次，其他角色出牌阶段开始时或回合结束阶段，若其有手牌，则你可以获得其所有手牌，根据这些牌中基本牌和普通锦囊牌的数量，视为你使用等量张此次未使用过的无距离次数限制的同类型牌；然后你交给其X张牌，若你给出的牌中每有一张装备牌，视为其对你使用一张杀(X为你已损失的体力值和你获得该角色的牌数中的最大值且不超过5)。",
            ymhuoluan: "祸乱",
            "ymhuoluan_info": "锁定技，当你成为其他角色【杀】的目标时，你摸两张牌并令【杀】的使用者此回合技能失效，然后你指定至多X名未成为此牌目标的其他角色也成为此牌的目标且不可闪避(X为你的体力值)。",
            ymjiang: "激昂",
            "ymjiang_info": "当你使用或成为红色牌的目标时，你可以摸一张牌。",
            ymhunyou: "魂佑",
            "ymhunyou_info": "每回合限一次，当你造成伤害/受到伤害/死亡时，你可以立即发动一次【英魂】。",
            ymtaoni: "讨逆",
            "ymtaoni_info": "每局游戏限三次，当一名角色死亡后，你可以增加一点体力上限并获得【英姿】，然后选择一项执行：1.立即发动一次【英魂】，2.移动场上两张牌。",
            ymzhiba: "制霸",
            "ymzhiba_info": "主公技，其他吴国角色出牌阶段限一次，其可以与你进行一次拼点，若你没赢，你受到一点伤害；若你赢，你随机获得3张♦️牌；你进行拼点时，你可以令你的点数+3或-3。",
            ymjiuzhu: "救主",
            "ymjiuzhu_info": "每轮游戏开始时，你可以指定一名其他角色，令除你与其以外的角色指定该角色为目标时，该角色将目标转移给你；锁定技，你每回合至多受到1点伤害。",
            ymhuwei: "虎威",
            "ymhuwei_info": "锁定技，其他角色于摸牌阶段外获得牌时，你摸一张牌。",
            ymbishan: "逼禅",
            "ymbishan_info": "出牌阶段限一次，你可以指定一名装备区有牌的其他角色将其装备区里的所有牌移至你的装备区，然后该角色摸等量张牌并受到X点伤害。(X为5-移动的牌数)",
            ymbawang: "八王",
            "ymbawang_info": "锁定技，游戏开始时，你获得3个“王”标记，每进行三轮游戏时，你获得1个“王”标记；出牌阶段，你可以将一个“王”标记交给一名其他角色；锁定技，拥有“王”标记的其他角色摸牌后你摸等量张牌(每回合限一次)且你对其他拥有“王”标记的角色造成的伤害+1，当你受到伤害时，此伤害转移至场上随机一名拥有“ 王”标记的角色，然后其移除一个此标记。",
            ymguijin: "归晋",
            "ymguijin_info": "主公技，其他魏、蜀、吴势力角色出牌阶段限一次，其可以交给你一张牌，若如此做，其无法对你造成伤害直到回合结束，然后你可以令其摸一张牌。",
            ymqiaoshui: "巧说",
            "ymqiaoshui_info": "每回合限一次，当你需要使用或打出一张基本牌或普通锦囊牌时，你可以声明此牌，然后你选择两名角色进行拼点并猜测获胜者，若你猜对，则视为你使用此牌，否则，你失去一点体力并获得拼点的牌。",
            ymzongshi: "纵适",
            "ymzongshi_info": "你的回合外你每次扣减体力时你可以摸两张牌，若有扣减体力的来源，你可以展示一张手牌，若如此做，其需交给你一张与此牌同花色的牌且你回复一点体力。否则其弃置X张牌。(X为你的体力上限)",
            ymdunjia: "遁甲",
            "ymdunjia_info": "任意角色进行判定前，你可以生成任意花色、点数、牌名的牌作为本次判定的结果。(此结果不触发判定时机且不可更改)",
            ymqixing: "七星",
            "ymqixing_info": "锁定技，回合开始阶段你弃置所有手牌，然后从牌堆/弃牌堆里获得7张均不同名的牌；你的手牌上限始终为7。",
            ymxuming: "续命",
            "ymxuming_info": "锁定技，当你进入濒死状态时，你获得最近失去的3+X张牌；当你本回合第一次脱离濒死状态后，视为你使用一张随机指定多名角色为目标的锦囊牌。(X为你发动【遁甲】的次数)",
            ymrenshi: "忍时",
            "ymrenshi_info": "回合开始阶段或你受到伤害时，你可以选择获得一名角色区域内的一张牌或摸两张牌，然后令自己的手牌上限+1；出牌阶段限一次，你可以失去1点体力发动一次此技能；若如此做，你进行一次判定，若判定结果为黑色，你回复一点体力。",
            ymguicai: "鬼才",
            "ymguicai_info": "任意角色判定牌生效时，你可以观看牌堆顶的4张牌并选择其中一张代替之，若如此做，你获得与此牌不同花色的其他牌，并将剩余的牌置于牌堆顶。",
            ymfanpan: "反叛",
            "ymfanpan_info": "觉醒技，回合结束时，若你进行的回合数不小于场上存活角色数的一半(向上取整)，你增加一点体力上限并回复一点体力，然后获得场上其他角色的所有手牌。",
            ymzuijiu: "醉酒",
            "ymzuijiu_info": "锁定技，出牌阶段开始时，若你已受伤，你随机增加1-2点体力上限且并回复一点体力，然后视为你使用一张酒；你使用酒无次数限制且酒对你的效果永久存在。",
            ympaoxiao: "咆哮",
            "ympaoxiao_info": "出牌阶段限一次，若你有手牌，你可以选择一名其他角色并根据条件执行：1.该角色有手牌，你与其强制拼点，若你赢，视为你对该角色使用一张杀且重置此技能，若你没赢，你摸两张牌且你本回合杀无距离次数限制且可额外指定X个目标 (X为你已损失体力值)，2.该角色无手牌，你可以弃置一张手牌视为对其使用一张杀并重置此技能，或你摸两张牌且你本回合杀无距离次数限制且可额外指定X个目标 (X为你已损失体力值)。",
            ymxiaoyong: "骁勇",
            "ymxiaoyong_info": "当你使用的杀造成伤害时，你可以进行一次判定，若判定结果为♥️，则此伤害改为减少目标等量的体力上限(你为来源)，若判定结果为♠️，此伤害翻倍；若判定成功，你减少一点体力上限并清空酒的效果。",
            ymtieji: "铁骑",
            "ymtieji_info": "出牌阶段限一次，你可以展示自己所有手牌，根据你拥有的花色执行：♠️：你的【杀】指定目标后令其本回合技能失效，♥️：你的【杀】本回合不可闪避且无视防具，♣️：你的【杀】本回合造成的伤害+1，♦️：你的【杀】本回合无距离次数限制；然后你每缺少一种花色你便摸一张与其同花色的牌。",
            ymmengshi: "猛狮",
            "ymmengshi_info": "锁定技，你的【杀】可额外指定X名角色为目标(X为已受伤角色数)。",
            ymnajian: "纳谏",
            "ymnajian_info": "当你不以直接摸牌的形式获得牌时，你可以拒绝获得，改为摸等量的牌并获得一个【谏】标记。",
            ymbaonue: "暴虐",
            "ymbaonue_info": "你的回合开始阶段，你可以弃置所有【谏】标记并根据弃置数量执行对应的效果：1.不小于场上角色数，你可以选择任意数量的其他角色，对其造成随机1-3点伤害，2.小于场上角色数，你可以选择任意数量的其他角色，弃置其随机1-3张牌。若你选择的角色数大于1，你选择失去1点体力或减少1点体力上限，然后你获得1个【谏】标记。",
            ymhengzheng: "横征",
            "ymhengzheng_info": "出牌阶段限一次，你令所有其他角色交给你一张牌，然后你可以令交给你牌的角色摸一张牌。",
            ymtuxi: "突袭",
            "ymtuxi_info": "每轮限一次，你的回合开始阶段，你可以执行以下选项:1.获得至多X名其他角色一半的牌(向上取整)，2.对至多X名角色造成当前体力值一半的伤害(向上取整)。(当前时间若为<span style='color: red'>白天</span>则执行“1”，若为<span style='color: blue'>夜间</span>则执行“2”，X为你的体力值)",
            ymdanzhan: "胆战",
            "ymdanzhan_info": "锁定技，你的回合内，你每获得一次其他角色的牌后，该角色随机弃置1张牌；你每对其他角色造成一次伤害后，该角色流失1点体力。",
            ymrende: "仁德",
            "ymrende_info": "出牌阶段，你可以将任意张牌交给任意角色，若为你本回合第一次交给其他角色，则你摸等量的牌并回复一点体力；其他角色获得你的牌后，你可以令其手牌中所有来源于你的牌均视为任意一种非装备牌的牌名直到你的下回合开始。",
            ymjieyi: "结义",
            "ymjieyi_info": "锁定技，游戏开始时或你的回合开始阶段，你可以分配至多2名角色获得“结义”标记，拥有“结义”标记的角色死亡后，你可以重新分配该角色的“结义”标记；锁定技，拥有“结义”标记的角色使用基本牌或普通锦囊牌后，若有指定的目标，则所有拥有此标记的角色均视为对无此标记的这些目标使用一张同名牌。",
            ymguose: "国色",
            "ymguose_info": "你的回合结束阶段，你可以将一张牌视为随机延时锦囊牌对一名其他角色使用；锁定技，你对其他角色使用的延时锦囊牌不能被【无懈可击】响应且判定后不离开判定角色的判定区，若此牌被弃置或获得时，你立即获得一张与之同名的牌。",
            ymliuli: "流离",
            "ymliuli_info": "任意角色的回合开始阶段，你可以获得其判定区内所有牌；当你成为基本牌或普通锦囊牌的目标，你可以选择任意名角色也成为此牌的目标，若为你本回合未因此技能摸牌，则你摸X张牌并回复一点体力。(X为此牌指定的目标数)",
            ymlianhuan: "连环",
            "ymlianhuan_info": "你的回合开始阶段，你可以选择至多两名未横置的角色横置，你的回合结束阶段，你可以选择一名横置的角色受到1点随机属性伤害；锁定技，每回合第一位角色受到属性伤害时，你摸3张牌。",
            ymniepan: "涅槃",
            "ymniepan_info": "觉醒技，当你濒死时，你将体力上限和体力调整为2，并可获得场上每名其他角色区域内至多两张牌(每少获得一张牌，你摸一张牌)，再对所有其他角色造成1点随机属性伤害；然后本局游戏限X次，锁定技，你的回合开始阶段你增加一点体力上限并回复一点体力，并将【连环】选择的角色或造成的伤害+1。(X为你发动此技能调整的体力值)",
            ymxiaoji: "枭姬",
            "ymxiaoji_info": "出牌阶段限两次，你可以将任意一张非装备牌的手牌视为任意装备牌使用；锁定技，你装备区内的牌无数量限制。",
            ymjieyin: "结姻",
            "ymjieyin_info": "每回合限一次，你每失去一张装备牌或装备区内的一张牌时(同时满足条件则叠加次数)，你可以令一名角色回复一点体力，然后你与其各摸一张牌。",
            ymliangzhu: "良助",
            "ymliangzhu_info": "任意角色每回复一次体力或造成一次伤害后，你可以重置其本回合使用【杀】和【酒】的使用次数并令其摸一张牌。",
            ymganglie: "刚烈",
            "ymganglie_info": "你每受到一次其他角色的伤害后，你可以对伤害来源进行X次判定，若为红色，你对伤害来源造成1点伤害，若为黑色，你弃置伤害来源两张牌。判定结束后，你获得所有判定牌，红色最多，你摸两张牌，黑色最多，你回复一点体力，若伤害来源无牌或死亡，你增加一点体力上限。每次伤害限一次，此过程结算后，你可以失去一点体力重新发动此技能。(X为此次伤害的点数且至少为1)",
            ymxunshu: "勋书",
            "ymxunshu_info": "每回合限一次，当任意角色扣减体力时，若此扣减点数不小于该角色的体力值且来源不为你，你可以减少一点体力上限并防止此次扣减，若有来源的牌，则你获得此牌。然后你可以选择一名其他角色对其发动一次【刚烈】。",
            ymshimu: "噬目",
            "ymshimu_info": "限定技，当你对其他角色造成伤害时，若你的体力值小于体力上限的一半，你可以防止此次伤害并令目标角色立即进入濒死状态(该角色体力值不因此濒死变化)；若其未死亡，则你重置此技能。",
            ymzhanjiang: "斩将",
            "ymzhanjiang_info": "锁定技，当你造成伤害时根据你本回合内造成的伤害次数执行以下选项：=0，此伤害+1，=1次，你获得目标角色一张牌，=2，你弃置目标角色两张牌，>=3，你失去一点体力；你对未受伤的角色造成的伤害+1。",
            ymguagu: "刮骨",
            "ymguagu_info": "出牌阶段限一次，若你已受伤，你可以弃置一张牌，回复一点体力并重置本回合使用牌的次数，然后本回合与此牌同颜色的牌无距离限制并不计入使用次数且点数视为∞；若此牌为红色，你重置本回合造成的伤害次数并获得【武圣】直到回合结束，若此牌为黑色，你增加一点体力上限和摸两张牌并获得【义绝】直到回合结束。",
            ymlongxiang: "龙骧",
            "ymlongxiang_info": "锁定技，你每杀死一名角色，你使用的牌伤害/回复基础值+1直到你脱离濒死状态后。",
            ymquhu: "驱虎",
            "ymquhu_info": "出牌阶段限一次，你可以弃置一张点数大于1的牌，若X大于场上人数，你回复一点体力，然后你选择2至X名角色，令他们依次对其他你选择的一个随机目标使用一张决斗(不能被无懈可击响应)，若有角色死亡你重置此技能并增加一点体力上限。(X为你弃置牌的点数)",
            ymjieming: "节命",
            "ymjieming_info": "你每受到一点伤害，你可以令一名角色将手牌摸至体力上限，然后该角色获得其手牌中随机X张复制牌并展示之。(X为此技能发动时该角色的手牌数，且X不大于5)",
            ymkonghe: "空盒",
            "ymkonghe_info": "锁定技，你失去最后一张手牌时，你受到一点无来源的伤害，然后你本回合不能成为带有「伤害」标签的牌的目标且对你无效。",
            ymjianxiong: "奸雄",
            "ymjianxiong_info": "出牌阶段限一次，你可以从10张未上场的武将牌选择一张作为宝物牌加入游戏并获得(视为拥有此武将的技能)，然后你摸X张牌；锁定技，你装备区的牌只能因替换而失去。(X为该武将牌的技能数)",
            ymguixin: "归心",
            "ymguixin_info": "每回合限一次，你每受到或造成一点伤害后，你可以立即获得造成伤害的牌，若这些牌包含基本牌，你摸一张牌，否则，你随机回复1点体力或摸两张牌；然后你亮出牌堆/弃牌堆里的一张带有「伤害」标签的牌并指定任意名角色对其使用。",
            ymshanjia: "缮甲",
            "ymshanjia_info": "出牌阶段，你可以将两张游戏内的装备牌合成为一张装备牌并附加效果：当装备此牌或失去此装备时，你视为使用一张不计入距离次数限制的【杀】；锁定技，你每失去装备区里的一张牌时，你摸一张牌，你的摸牌阶段摸牌数和手牌上限+X。(X为你装备区的牌数，以此法合成的装备牌在进入弃牌堆后分解)",
            ymhubao: "虎豹",
            "ymhubao_info": "每回合限一次，你使用【杀】或【决斗】造成伤害后或你受到【杀】或【决斗】造成的伤害后，你可以令你和目标收回各自装备区内的所有牌，然后你从牌堆/弃牌堆里立即使用一张随机装备牌；若当前回合不为你的回合，则你可以选择一张装备牌立即使用，然后当前角色立即进入弃牌阶段。",
            ymshensu: "神速",
            "ymshensu_info": "其他角色的回合开始阶段，你可以获得其一张牌并自弃一张牌，视为对其使用一张无视防具的【杀】；若此【杀】未造成伤害，其失去一点体力，反之，你摸两张牌；然后你将武将牌翻面，若该角色的手牌数大于你的手牌数，则其跳过此回合。",
            ymdingzui: "顶罪",
            "ymdingzui_info": "当其他角色受到伤害来源不为你的伤害时，你可以替其承受此伤害，若此时你的武将牌背面朝上，你翻回正面；锁定技，当你的武将牌翻面后，你可以摸一张牌并立即进行一个出牌阶段。",
            ymliegong: "烈弓",
            "ymliegong_info": "当满足以下条件时，你可以弃置一张牌视为对满足条件的角色使用一张不可闪避的【杀】：1.其他角色的【杀】结算后且这些目标包含你，2.其他角色的【杀】造成伤害后且目标角色不为你。锁定技，你的【杀】无距离限制。",
            ymchuanyang: "穿杨",
            "ymchuanyang_info": "锁定技，你每使用一张【杀】，你从牌堆/弃牌堆获得一张基本牌且你每回合使用第一张【杀】时，你可以额外指定一个目标，第二张【杀】伤害值+1；你的【杀】造成伤害后，目标角色额外受到一次等量的伤害，你的【杀】被闪避后，你回复一点体力且此【杀】不计入次数限制。",
            ymqiaobian: "巧变",
            "ymqiaobian_info": "转换技，锁定技；阴：你的回合开始前，你可以移动场上一张牌，然后你本回合使用基本牌或普通锦囊牌指定目标时，若额外结算次数小于X次，你可以额外指定一个除你以外的目标并可令此牌额外结算一次；阳：你的回合结束后，你摸两张牌，然后每回合限X次，其他角色使用指定其以外为目标的牌时，你可以为此牌重新选择使用者和使用目标。(X为你体力上限的一半，向上取整)",
            ymjueji: "绝汲",
            "ymjueji_info": "锁定技，当其他角色摸牌时，若该阶段为其摸牌阶段且摸牌数大于两张，你可以令其改为摸两张牌，然后你摸剩下的牌；反之，若其摸牌数大于一张，你可以令其改为摸一张牌，然后你摸剩下的牌。",
            ymxiaoguo: "骁果",
            "ymxiaoguo_info": "其他角色的回合开始阶段，你可以弃置一张牌，若此牌点数不小于7，该角色本回合内不能使用或打出与此牌类型不同的牌直到回合结束，若此牌点数小于7，你回复一点体力；然后其需弃置其他类型的牌各一张(至多需弃置3种类型)；每弃置一种类型的牌你摸一张牌，每少弃置一种类型的牌该角色受到一点伤害。",
            ymzhuzhen: "助阵",
            "ymzhuzhen_info": "锁定技，其他角色每回合第一次受到伤害时，若有伤害来源，则你选择摸两张牌或获得该角色的一张牌，若伤害来源不为你，你可以交给伤害来源至多两张牌。",
            ymjieyue: "节钺",
            "ymjieyue_info": "你的回合开始阶段，你可以弃置一张牌并将至多两名其他角色各一半的手牌(向上取整，若你从每名角色处获得不足两张牌时，则从牌堆补至两张)置于你的武将牌上称之为“节”，若你弃置的牌为装备牌，你可以令任意一名其他角色装备此牌；锁定技，你可以如手牌使用或打出这些牌且你每失去一张“节”后，你摸一张牌。",
            ymyizhong: "毅重",
            "ymyizhong_info": "锁定技，游戏开始/你的回合结束时，你随机将游戏内两张/一张装备牌置于你的空置装备栏；然后你可以执行以下一项：1.重新选择任意名其他角色，其与你获得“毅”标记；2.选择自己获得“毅”标记并移除其他角色的“毅”标记；若你未执行以上选项，则你与其他拥有“毅”标记的角色各回复一点体力；锁定技，拥有“毅”标记的角色视为共同拥有对方装备区内所有牌的装备效果(特殊装备除外)且之间距离视为1。",
            ymduanliang: "断粮",
            "ymduanliang_info": "每回合限三次，当你需要使用延时锦囊牌时，你可以将任意一张非基本牌当做一张任意延时锦囊牌使用，若你本回合第一次发动此技能，你回复一点体力(每种牌每回合限一次)；锁定技，你使用延时锦囊牌时可以额外指定任意名其他角色为目标且此牌不进入判定区，改为立即进行判定；若判定结果失效，其受到1点伤害，反之，你摸一张牌。",
            ymjiezi: "截辎",
            "ymjiezi_info": "锁定技，你的回合外你每使用或打出基本牌，你从牌堆/弃牌堆获得一张非基本牌；任意角色回合结束时，你摸X张牌并可以立即使用X张牌。(X为该角色本回合跳过的阶段数)",
            ymzhiheng: "制衡",
            "ymzhiheng_info": "出牌阶段限一次，你可以弃置所有手牌，选择获得游戏内至多X张不同牌名的牌并将X张【空白】以随机顺序永久加入牌堆，然后你将手牌数摸至弃置前的手牌数。(X为场上手牌数最多的角色手牌数且不大于5)",
            ymtusi: "屠嗣",
            "ymtusi_info": "锁定技，每回合每项限X次：1.你受到伤害后，若有你距离1以内的其他角色，你对其造成Y点伤害；2.你失去手牌时，若有你距离1以内的其他角色，你弃置其Y张牌。若以上选项无符合条件的角色或所有其他角色均符合条件，你随机摸两张牌或回复一点体力(每回合每项限一次)。(X为与你同势力的角色数且至多为4，Y为你本回合执行选项的次数)",
            ymtianxiang: "天香",
            "ymtianxiang_info": "每回合每种花色限一次，任意角色受到伤害或失去体力时，你可以弃置一张手牌；若你本回合以此法选择过偶数种花色的牌，你摸等量张牌，然后将其转移给任意角色并根据你弃置的花色执行以下效果：♠️：你选择一名角色武将牌翻至背面或选择两名角色交换体力值；♥️：你选择一名角色令其装备区的牌和技能失效直到下一轮开始；♣️：你令当前回合角色摸三张牌或你弃置其三张牌；♦️：此伤害/体力流失值+1。",
            ymhongyan: "红颜",
            "ymhongyan_info": "锁定技，你的回合开始阶段或你发动【天香】后，你可以将场上所有角色的牌均视为任意一种花色；任意角色回合结束时，你将手牌补至四张；你的手牌上限始终为4。",
            ymyingzi: "英姿",
            "ymyingzi_info": "锁定技，你的摸牌数始终+1；你每失去一张本回合你未失去类型的牌时，你摸一张牌，若此时你的手牌数大于你的手牌上限，你弃置一张牌；你的手牌上限为体力上限翻倍。",
            ymfanjian: "反间",
            "ymfanjian_info": "每回合限一次，出牌阶段，你可以选择一张牌交给一名其他角色，然后该角色失去X点体力(X为该角色与此牌花色相同的牌数)；其他角色获得你的牌时，你可以令其猜测花色，若这些牌中未包含此花色，其弃置与此花色不同的所有牌；反之，你获得其一张牌。",
            ymqinyin: "琴音",
            "ymqinyin_info": "每回合每项限一次，1.你本回合使用或打出三张大于7的牌后，你可以为任意名角色分配共3点伤害；2.你本回合使用或打出三张小于7的牌后，你可以为任意名角色分配共3点体力回复。",
            ymyuhun: "驭魂",
            "ymyuhun_info": "出牌阶段限一次，你可以弃置任意张不同花色的牌召唤等量阵营与你相同的【傀儡】随机成为你的下家或上家(场上数量不能超过4)。<br><b>【傀儡】</b>：①其初始体力值为3且每轮游戏随机增加一点体力上限或回复一点体力；②你与【傀儡】不能指定对方为目标且每名【傀儡】令你或其与其他角色计算距离-1；③其回合开始前改为摸两张牌，你使用牌后其对你指定的目标再次使用此牌(基本牌或普通锦囊牌)；④其视为拥有你装备区牌的效果，你视为拥有其的技能；⑤你死亡后所有【傀儡】立即死亡。",
            ymkongshen: "控身",
            "ymkongshen_info": "你的回合结束阶段，当前轮数为奇数，你摸两张牌；当前轮数为偶数，你可以令一名【傀儡】将武将牌替换为场下随机同性别武将。",
            ymkurou: "苦肉",
            "ymkurou_info": "出牌阶段限X次，你可以重铸一张牌并失去一点体力；锁定技，你的回合结束时，若你出牌阶段发动此技能的次数小于3次，则你回复与此技能发动次数等量的体力。(X为满足以下条件的数量：①你的体力值为全场最多之一，②你的手牌数为全场最多之一，③本回合你未造成伤害)",
            ymzhaxiang: "诈降",
            "ymzhaxiang_info": "锁定技，你每失去一点体力后，你随机摸1-3张带有「伤害」标签的牌且本回合使用带有「伤害」标签的牌次数+1；当你造成伤害时若你已受伤且本回合你未造成过伤害，则此伤害额外+你已损失的体力值；你每回合失去的体力值达到以下点数后你获得对应的效果：①≥1，你使用带有「伤害」标签的牌无距离限制；②≥2，你使用带有「伤害」标签的牌不能被响应；③≥3，你带有「伤害」标签的属性牌均视为火属性，带有「伤害」标签的普通牌无视防具。",
            ymwushuang: "无双",
            "ymwushuang_info": "你可以将至多三张牌当做任意一张目标数为1的基本牌或普通锦囊牌使用；锁定技，你使用转化的基本牌或普通锦囊牌可指定不超过X名角色为目标且无距离限制，并额外结算Y次。(每种普通锦囊牌名每回合限一次，X为你转化的牌数，Y为X-指定的目标角色数)",
            ymbaonu: "暴怒",
            "ymbaonu_info": "锁定技，你使用牌对体力值不小于你的其他角色无视防具且不可响应，你对体力值不大于你的角色造成的伤害+X；任意角色出牌阶段开始时，若你已受伤，你随机摸2至Y张牌。(X为你本回合使用基本牌或【决斗】数量的一半且至少为1，向上取整，Y为你已损失体力值翻倍)",
            ymjushou: "据守",
            "ymjushou_info": "当你受到或造成伤害后，你可以将你的武将牌翻面并摸一张牌，然后你可以和【励战】角色分别视为使用一种【杀】或【桃】(不计入次数并无距离限制且每回合每种牌限一次)，每有一名角色因此使用牌，其摸一张牌；锁定技，你的武将牌为双面武将，你的回合进行不受武将牌翻面状态影响。",
            ymlizhan: "励战",
            "ymlizhan_info": "准备阶段/结束阶段，你可以分配任意名除你以外的角色成为【励战】目标；锁定技，你的武将牌正面朝上时，你和【励战】角色造成伤害时此伤害值+1，然后将一张武器牌或进攻马置入其装备区；你的武将牌背面朝上时，你和【励战】角色受到伤害时此伤害值-1，然后将一张防具牌或防御马置入其装备区(不可替换原装备)。",
            ymkuiwei: "溃围",
            "ymkuiwei_info": "锁定技，你的武将牌翻面状态；正面：你和【励战】角色使用基本牌无次数限制；背面：你和【励战】角色使用锦囊牌无距离限制。",
            ymshengshou: "圣手",
            "ymshengshou_info": "你的回合开始阶段，你可以展示牌堆顶X张牌，然后你选择一项：①指定任意名角色随机分配红色牌数的体力值令其回复(你为来源)且你获得其中的黑色牌；②指定任意名角色随机分配黑色牌数的体力值令其失去(你为来源)且你获得其中的红色牌；③背水：你弃置这些牌。(X为场上角色数且至少为5；未被获得的牌则弃置之)",
            ymqingnang: "青囊",
            "ymqingnang_info": "出牌阶段限一次，你可以弃置至多两张牌指定任意名角色并选择一项：①令其回复X点体力(每溢出一点则其额外摸两张牌)；②弃置其2X张牌(每不足两张则其额外失去一点体力)。(X为你弃置的牌数)；锁定技，你的基本牌不计入手牌上限。",
            ymjijiu: "急救",
            "ymjijiu_info": "锁定技，任意角色濒死时，你可以随机弃置一张手牌令其回复至1点体力，然后你可以发动一次【青囊】(此次【青囊】不能选择②)。",
            ymdimeng: "缔盟",
            "ymdimeng_info": "游戏开始时或你的回合开始阶段，你可以分配任意名角色成为【缔盟】的目标并令其摸一张牌。成为【缔盟】目标的角色使用、打出、弃置的牌进入弃牌堆时，若这些牌在该角色区域内，则其将这些牌置入仁库；锁定技，仁库溢出上限改为30，【缔盟】的目标角色可以如手牌般使用或打出仁库里的牌且不计入次数。",
            ymhaoshi: "好施",
            "ymhaoshi_info": "任意角色出牌阶段开始时，你可以令其增加一点体力上限(超过10改为回复一点体力)并令其将手牌补至体力上限；任意角色出牌阶段结束时，你可以令其将手牌补至体力上限且其可以发动一次【制衡】。",
            ymkeji: "克己",
            "ymkeji_info": "锁定技，任意角色回合结束阶段，①若你此回合未造成伤害，你获得你此回合失去的所有此时不在你装备区内或在其他角色判定区内的牌，然后若此回合为你的回合，你获得一点护甲值，若不为你的回合，你回复一点体力；②若你此回合造成过伤害，你获得X点护甲值并摸X张牌(X为你此回合造成的伤害值且不超过5)。",
            ymandu: "暗渡",
            "ymandu_info": "使命技，①其他角色回合结束时，若其此回合未对你造成伤害，则你摸一张牌，反之你获得一点护甲值。②使命：你的回合开始时，若你的护甲值不少于5或手牌数不少于12，则你增加与护甲值相同的体力上限，然后你将体力值回复至体力上限并摸与回复值等量的牌且获得技能【杀劫】。③失败：你杀死其他角色后，你失去一点体力并弃置所有装备区内的牌，然后你获得技能【勤学】、【涉猎】。",
            ymshajie: "杀劫",
            "ymshajie_info": "锁定技，你的回合开始阶段，你指定至多两名其他角色为【杀劫】目标直到你下次发动此技能；当你需要对你的【杀劫】目标使用牌时，此牌无距离次数限制且你可以额外选择你的另一名【杀劫】目标为目标，然后此牌指定的【杀劫】目标不可响应你使用的牌；每回合你的【杀劫】目标第一次受到你造成的伤害时，此伤害值+X且你失去一半(向下取整且不超过5)的护甲值(X为你的护甲值且X∈[1,5])。",
            ymqianxun: "谦逊",
            "ymqianxun_info": "你的判定阶段开始时，你可以弃置判定区内所有牌并进行X次判定，然后你摸与判定牌字数等量的牌且可将判定结果分配给任意名其他角色作为随机延时锦囊牌的判定结果并立即生效(X为你弃置的牌数且至少为1)。",
            ymlianying: "连营",
            "ymlianying_info": "你每失去一张牌后，你可在此牌结算后立即视为使用任意一张无距离次数限制的同类型不同名牌(因替换而失去装备牌除外且非基本牌每种牌名每回合限一次)。",
            ymluoyi: "裸衣",
            "ymluoyi_info": "锁定技，蓄力技(1/5)。①出牌阶段开始时，你为所有手牌增加『裸衣』标记；你每失去一张带有『裸衣』标记的牌后，你摸一张牌并获得1点蓄力值。②你带有『裸衣』标记的牌无使用距离次数限制。③你使用牌造成伤害时，你可以消耗任意点蓄力值令此伤害增加等量的值。",
            ymchandou: "缠斗",
            "ymchandou_info": "任意角色回合结束后，若你未进入【死战】状态，则你可以指定至多两名本回合对你造成伤害或你造成伤害的其他角色，然后你进入此状态并摸X张牌(X为你的蓄力值且至少为1)。<br><span style='color: orange'>【死战】：锁定技，①你每回合使用的前X张指定包含其他角色的牌不能被响应(X为你已损失体力值且至少为1)；②你与指定的角色轮流进行回合，直到只存活一名角色或共进行3个轮次。",
            ymdameng: "大梦",
            "ymdameng_info": "每两轮限一次，出牌阶段或濒死阶段，你可以令场上、牌堆、弃牌堆的所有牌复原至本轮开始时的状态；若有移动场上角色区域内的牌，则每移动一张牌你摸一张牌，然后你回复一点体力；若你的摸牌数不大于20，则你下次发动此技能的所需的轮数-1。",
            ymtianming: "天命",
            ymtianming_info: "每回合限X次，当你需要使用或打出牌时，你可以弃置两张与此牌同类型的牌并摸两张牌，然后将你弃置的牌当做此牌使用或打出；若你使用的牌为延时锦囊牌或装备牌，则改为创造一张同名牌(X为你的体力值且至少为1)。",
            ymfuhan: "复汉",
            ymfuhan_info: "主公技，锁定技，你的回合外当你摸牌后，你选择一个势力的所有角色交给你一张牌。",
            ymxiaowu: "骁武",
            ymxiaowu_info: "出牌阶段限一次，你指定一名角色并展示你的手牌，根据缺少的花色数摸等量张牌，然后你展示的牌中每有一种花色视为对目标使用一张不可被【无懈可击】响应的【决斗】，若花色数不少于4，你令此牌的伤害基数+1。",
            ymzhushi: "助势",
            ymzhushi_info: "任意角色使用【决斗】时，你可重铸一张牌，若如此做，此牌的目标数+1且目标需额外打出一张【杀】响应。",
            ymbingwei: "并威",
            ymbingwei_info: "锁定技，游戏开始时或你进入游戏后，随机在你的上家或下家加入『颜良』/『文丑』，你与其阵营相同且其由你控制；当你使用的【决斗】对你造成伤害后或你与其死亡前，你与『颜良』/『文丑』合体为『颜良文丑』并继承其手牌区、装备区、判定区、特殊区的牌(不可替换原有位置的牌，无法继承的牌弃置之)，若此回合不为其他角色的回合，你重新开始你的回合。",
            ymshuangxiong: "双雄",
            ymshuangxiong_info: "锁定技，①准备阶段开始时，你亮出牌堆顶的X张牌并获得之，每有一种类型的牌，你可视为对一名角色使用一张不可被【无懈可击】响应的【决斗】(X为你的体力值且至少为2)；②你在【决斗】过程中打出的【杀】可立即对至多两名角色使用(无距离次数限制)；③你造成伤害时，根据本回合你造成伤害的次数(含本次)获得如下效果：1.若目标角色不为你，≥1次，其非锁定技失效；≥2次，其受到的伤害+1；≥3次，其武将牌翻至背面。2.若伤害次数等于4次：你将体力值回复至体力上限。",
            ymxiongbing: "凶兵",
            ymxiongbing_info: "使命技，①你每使用或打出一张牌后，若你没有【杀】，你摸一张牌；②成功：你累计造成和受到5点伤害后，你获得技能【骁武】、【猛势】，然后摸与累计伤害点数等量张牌；③失败：你进入濒死阶段时，你增加一点体力上限并将体力值回复至体力上限，然后获得技能【无双】。",
            //---------------------------------------boss------------------------------------------
            ymdujie: "渡劫",
            "ymdujie_info": "锁定技，当你受到非来自角色区域的牌/非其他角色造成的伤害时或流失体力时，你防止之；你的武将牌不能被翻面或横置且使用牌的次数不受技能减少。",
            ymqianxing: "牵星",
            "ymqianxing_info": "出牌阶段限一次，你可以获得一名角色的所有牌，若不为同一类型或同一颜色，你交给该角色等量的牌。",
            ymxingluo: "星落",
            "ymxingluo_info": "锁定技，敌方角色每获得牌后，若此时不为任意角色的摸牌阶段，你对其造成X点伤害并展示这些牌，每有一张红色，其额外受到红色牌数一半的火属性伤害。(X为获得牌数的一半；均随机取整)",
            ymtayue: "踏月",
            "ymtayue_info": "任意角色回合开始时，你可以令其获得一张你声明的牌，若该角色的手牌为同一类型或同一颜色，你可令其摸一张牌或令其弃置一张牌。",
            ymyueyin: "月隐",
            "ymyueyin_info": "锁定技，你的回合外，每名敌方角色回内获得牌后，这些牌中每有与其上次获得的最后一张牌类型和颜色均不同的牌，你观看并弃置其一张牌，若弃置的牌为黑色，其额外受到一点雷属性伤害。",
            ymhuajing: "化境",
            "ymhuajing_info": "锁定技，你登场时，所有敌方角色随机将牌置入弃牌堆至一张，你的武将牌不能被翻面或横置且使用牌的次数不受技能减少；对你有利的判定结果不可修改且对你不利的判定结果将被终止；你参与的拼点流程将被终止并视为此流程内你胜利对方失败；当你受到非来自角色区域的牌/非其他角色造成的伤害时或流失体力时，你防止之；当你受到大于1的伤害时，此伤害改为1。",
            ymfengqin: "风侵",
            "ymfengqin_info": "锁定技，你区域内的牌不因使用而离开当前区域后，你可以立即使用此牌；你使用基本牌或普通锦囊牌时若此时为你的出牌阶段，此牌的伤害/回复基数+1，反之，你可以额外增加或减少任意名其他角色为目标。",
            ymyucheng: "玉成",
            "ymyucheng_info": "锁定技，你或己方角色受到伤害，你将牌堆洗牌并摸一张牌展示之，若此牌点数大于其体力上限且该角色体力值大于0，则该角色防止受到伤害和体力流失直到其回合结束。然后立即开始你的回合并跳过其他角色回合且令非己方的伤害来源重置所有标记及所有技能和状态失效直到伤害来源回合开始前，反之，其随机回复任意点已损失体力值(至多为100)并摸一张牌。",
            ymtuoshu: "托书",
            "ymtuoshu_info": "出牌阶段，每名其他角色限一次，你可以展示该角色区域的一张牌(无牌则改为亮出牌堆顶的一张牌代替之)，并对其造成X点伤害，然后你摸X张牌(此伤害后和摸牌后不触发任何技能，X为此牌名字字数的一半，均随机取整且至少为1)；若该角色未受到此伤害或其体力值不小于你，其受到当前体力值一半的虚无伤害。(向上取整)",
            ymtianjie: "天劫",
            "ymtianjie_info": "锁定技，每种阶段每名己方角色对敌方角色使用牌时，若此阶段其未指定过敌方当前存活角色为目标，则敌方角色不可响应此牌；当你造成2点以上的伤害，目标角色上家/下家若不属于你的己方角色，该角色受到一半的伤害。(向下取整)",
            ymshuyun: "梳云",
            "ymshuyun_info": "锁定技，当你获得或展示牌后，你可以立即视为使用一张无距离次数限制的同名复制牌。",
            ymshigu: "蚀骨",
            "ymshigu_info": '锁定技，当己方角色对敌方角色造成伤害，你将牌堆洗牌并亮出牌堆顶的一张牌，若此牌的点数不小于目标角色体力值，目标角色额外受到1+X点虚无伤害(X为其体力值-20且至少为0)；当敌方角色回复体力时，若其有牌，则其随机失去等量张牌，以此法每失去一张牌，此回复值-1。',
            ymguiyuan: "归愿",
            "ymguiyuan_info": "出牌阶段，每名角色限一次，你可以亮出一名其他角色区域的一张牌(无牌则改为从牌堆顶亮出)，并记录其X次【归愿】次数，若此次数不小于其体力上限(至多为20)，你回复一点体力且该角色受到其体力上限一半的伤害(向上取整)，然后清除你记录其的【归愿】次数(X为此牌名的字数)。",
            ymtianyu: "天御",
            "ymtianyu_info": "锁定技，每种阶段每名敌方角色对己方角色使用牌时，若此阶段其未指定过己方当前存活角色为目标，则此牌对己方角色无效；你回复体力后，你的上家/下家若为己方角色，其回复等量点体力。",
            ymxuwang: "虚妄",
            "ymxuwang_info": "锁定技，你回复体力时，此回复值-1；你造成伤害时，若本阶段已对目标角色造成过伤害，则此伤害无效。<br><li><span style='color: red'>——简单、普通难度下本扩展BOSS的专属技能</span>",

        },

        dynamicTranslate: {
            ymzhukou: function (player) {
                if (player.storage.ymzhukou != true) return '转换技，每回合限X次；<span class="bluetext">阴：当你使用或成为黑色牌的目标时，你可指定任意名拥有“献策”的角色各摸两张牌，你摸一张牌；</span>阳：当你使用或成为红色牌的目标时，你可指定任意名没有“献策”的角色各弃两张牌，你摸一张牌。(X为与你势力相同的角色数)；锁定技，其他角色濒死回复体力时，若其没有“策”，若回复值大于1则改为1，否则此回复值-1。';
                return '转换技，每回合限X次；阴：当你使用或成为黑色牌的目标时，你可指定任意名拥有“献策”的角色各摸两张牌，你摸一张牌；<span class="legendtext">阳：当你使用或成为红色牌的目标时，你可指定任意名没有“献策”的角色各弃两张牌，你摸一张牌。</span>(X为与你势力相同的角色数)；锁定技，其他角色濒死回复体力时，若其没有“策”，若回复值大于1则改为1，否则此回复值-1。';
            },
            ymqiaobian: function (player) {
                if (player.storage.ymqiaobian == true) return '转换技，锁定技；<span class="bluetext">阴：你的回合开始前，你可以移动场上一张牌，然后你本回合使用基本牌或普通锦囊牌指定目标时，若额外结算次数小于X次，你可以额外指定一个除你以外的目标并可令此牌额外结算一次；</span>阳：你的回合结束后，你摸两张牌，然后每回合限X次，其他角色使用指定其以外为目标的牌时，你可以为此牌重新选择使用者和使用目标。(X为你体力上限的一半，向上取整)';
                if (player.storage.ymqiaobian == false) return '转换技，锁定技；阴：你的回合开始前，你可以移动场上一张牌，然后你本回合使用基本牌或普通锦囊牌指定目标时，若额外结算次数小于X次，你可以额外指定一个除你以外的目标并可令此牌额外结算一次；<span class="legendtext">阳：你的回合结束后，你摸两张牌，然后每回合限X次，其他角色使用指定其以外为目标的牌时，你可以为此牌重新选择使用者和使用目标。</span>(X为你体力上限的一半，向上取整)';
                if (!player.storage.ymqiaobian) return '转换技，锁定技；阴：你的回合开始前，你可以移动场上一张牌，然后你本回合使用基本牌或普通锦囊牌指定目标时，若额外结算次数小于X次，你可以额外指定一个除你以外的目标并可令此牌额外结算一次；阳：你的回合结束后，你摸两张牌，然后每回合限X次，其他角色使用指定其以外为目标的牌时，你可以为此牌重新选择使用者和使用目标。(X为你体力上限的一半，向上取整)';
            },
            ymkuiwei: function (player) {
                if (!player.isTurnedOver()) return '锁定技，你当前武将牌正面朝上：<span class="bluetext">你和【励战】角色使用基本牌无次数限制。</span>';
                return '锁定技，你当前武将牌背面朝上：<span class="legendtext">你和【励战】角色使用锦囊牌无距离限制。</span>';
            },
            ymbingwei: function (player) {
                if (get.translation(player.name)!='文丑') return '锁定技，游戏开始时或你进入游戏后，随机在你的上家或下家加入<span class="bluetext">『文丑』</span>，你与其阵营相同且其由你控制；当你使用的【决斗】对你造成伤害后或你与其死亡前，你与<span class="bluetext">『文丑』</span>合体为『颜良文丑』并继承其手牌区、装备区、判定区、特殊区的牌(不可替换原有位置的牌，无法继承的牌弃置之)，若此回合不为其他角色的回合，你重新开始你的回合。';
                return '锁定技，游戏开始时或你进入游戏后，随机在你的上家或下家加入<span class="legendtext">『颜良』</span>，你与其阵营相同且其由你控制；当你使用的【决斗】对你造成伤害后或你与其死亡前，你与<span class="legendtext">『颜良』</span>合体为『颜良文丑』并继承其手牌区、装备区、判定区、特殊区的牌(不可替换原有位置的牌，无法继承的牌弃置之)，若此回合不为其他角色的回合，你重新开始你的回合。';
            },
        },

    }
    return 假装无敌;
}

// Old APK-only initialization is deliberately separate from the data factory.
export function legacyCharacterSetup(lib, game, ui, get, ai, _status, 假装无敌) {
    //=============这里是一些武将必备的功能 start=============//
    lib.skill._thelandfool = {
        trigger: {global: ['arrangeTrigger']},
        silent: true,
        popup: false,
        filter: function (event, player) {
            /*if (lib.characterPack['假装无敌Pack'][player.name1]) player.init = function () {},player.uninit = function () {};
            else if(player.init==function(){}) player.init=lib.element.player.init;
            else if(player.uninit==function(){}) player.uninit=lib.element.player.uninit;
            if (lib.characterPack['假装无敌Pack'][player.name2]) player.init = function () {},player.uninit = function () {};
            else if(player.init==function(){}) player.init=lib.element.player.init;
            else if(player.uninit==function(){}) player.uninit=lib.element.player.uninit;*/
            return true;
        },
        forced: true,
        content: function () {
            game.findPlayer2(function (current) {
                if (current.name === 'thelandfool') current.addSkill('ymqiangsha');
            });
        },
    };
    lib.skill._假装无敌_playDie = {
        trigger: {
            player: ['dieBegin','die'],
        },
        fixed: true,
        priority: 2021,
        forced: true,
        popup: false,
        silent: true,
        unique: true,
        charlotte: true,
        forceDie: true,
        filter: function (event, player) {
            return lib.characterPack['假装无敌Pack'][player.name1]&&!event._假装无敌_playDie;
        },
        content: function () {
            trigger._假装无敌_playDie=true;
            game.playqysstx(trigger.player.name1);
        },
    };
    window.假装无敌character={};
    for (let i in 假装无敌.character) {
        let character = 假装无敌.character[i];
        window.假装无敌character[i]=character.slice(0);
        if (Array.isArray(character[4])) {
            if (character[4].some(value => value.indexOf('ext:') !== -1)) continue;
            character[4].push(`ext:清瑶葭绮/members/假装无敌/${i}.jpg`);
        }
        else character[4] = [`ext:清瑶葭绮/members/假装无敌/${i}.jpg`];
    }
    var style = document.createElement('style');
    style.innerHTML = "@keyframes fairy{"
    for (i = 1; i <= 20; i++) {
        let rand1 = Math.floor(Math.random() * 255), rand2 = Math.floor(Math.random() * 255),
            rand3 = Math.floor(Math.random() * 255), rand4 = Math.random();
        style.innerHTML += i * 5 + '%{text-shadow: black 0 0 1px,rgba(' + rand1 + ', ' + rand2 + ', ' + rand3 + ', 0.6) 0 0 2px,rgba(' + rand1 + ', ' + rand2 + ', ' + rand3 + ', 0.6) 0 0 5px,rgba(' + rand1 + ', ' + rand2 + ', ' + rand3 + ', 0.6) 0 0 10px,rgba(' + rand1 + ', ' + rand2 + ', ' + rand3 + ', 0.6) 0 0 10px,rgba(' + rand1 + ', ' + rand2 + ', ' + rand3 + ', 0.6) 0 0 20px,rgba(' + rand1 + ', ' + rand2 + ', ' + rand3 + ', 0.6) 0 0 20px}';
    }
    style.innerHTML += "}";
    document.head.appendChild(style);

    style = document.createElement("style");
    style.innerHTML = "@keyframes 清瑶text-shadow{"
    for (var i = 1; i <= 20; i++) {
        var rand1 = Math.floor(Math.random() * 255), rand2 = Math.floor(Math.random() * 255),
            rand3 = Math.floor(Math.random() * 255), rand4 = Math.random();
        style.innerHTML += i * 5 + '%{text-shadow: black 0 0 1px,rgba(' + rand1 + ', ' + rand2 + ', ' + rand3 + ', 0.6) 0 0 2px,rgba(' + rand1 + ', ' + rand2 + ', ' + rand3 + ', 0.6) 0 0 5px,rgba(' + rand1 + ', ' + rand2 + ', ' + rand3 + ', 0.6) 0 0 10px,rgba(' + rand1 + ', ' + rand2 + ', ' + rand3 + ', 0.6) 0 0 10px,rgba(' + rand1 + ', ' + rand2 + ', ' + rand3 + ', 0.6) 0 0 20px,rgba(' + rand1 + ', ' + rand2 + ', ' + rand3 + ', 0.6) 0 0 20px}';
    }
    style.innerHTML += "}";
    document.head.appendChild(style);
    lib.group.add('qingyao_xian');
    lib.translate.qingyao_xian = '仙';
    lib.translate.qingyao_xian2 = '仙';
    lib.groupnature.qingyao_xian = 'qingyao_xian';
    //==================  end  ===================//

    假装无敌CharacterLoad = true;
    return 假装无敌;
}
export function legacyBossContent(lib, game, ui, get, ai, _status, config) {
    //评级
    lib.rank.rarity.junk.addArray(["thelandfool"]);
    lib.rank.rarity.rare.addArray([]);
    lib.rank.rarity.epic.addArray(["qy_qyzuoci", "qy_qysimayan", "qy_qycaoying", "qy_qyyuji", "qy_qyjiaxu", "qy_qyzhangrang", "qy_qysunce", "qy_qyzhaoyun", 'qy_qysimayi', 'qy_qyzhangfei', 'qy_qydongzhuo', 'qy_qydaqiao', 'qy_qypangtong', 'qy_qysunshangxiang', 'qy_qyxiahoudun', 'qy_qyguanyu', 'qy_qyxunyu', 'qy_qycaochun', 'qy_qyxiahouyuan', 'qy_qyhuangzhong', 'qy_qyyuejin', 'qy_qyyujin', 'qy_qyxuhuang', 'qy_qyxiaoqiao', 'qy_qyzhouyu', 'qy_qyhuanggai', 'qy_qycaoren', 'qy_qylusu', 'qy_qylvmeng', 'qy_qyluxun', 'qy_qyliuxie', 'qy_qyyanliang', 'qy_qywenchou', 'qy_qyyanliangwenchou']);
    lib.rank.rarity.legend.addArray(["qy_qyhanxing","qy_qylengyue","qy_qyqingyaoxuying","qy_qyjiaqi","qy_qyjiangwei", "qy_qyzhangjiao", "qy_qyzhangxingcai", "qy_qyliru", "qy_qyhuangyueying", "qy_qyjianyong", "qy_qymachao", "qy_qyzhugeliang", "qy_qyzhangliao", "qy_qyliubei", "qy_qycaocao", "qy_qyzhanghe", "qy_qysunquan", "qy_qydiaochan", "qy_qylvbu", "qy_qyhuatuo", "qy_qyxuchu"]);

    lib.skill.qy_qyqingyaoxuying_double_init_boss={nobracket:true,};
    if (game.getExtensionConfig('假装无敌', 'qingyao_bossdifficulty') == 'difficult'){
        lib.qyArenaReadyPushOrRunStart(() => {
            if (lib.skill.ymtuoshu) {
                lib.skill.ymtuoshu.contentBefore = function () {
                    if (event.name.indexOf('ymtuoshu') == -1) player.die()._triggered = null;
                    if (!_status.ymtuoshu) _status.ymtuoshu = [];
                    _status.ymtuoshu.push(targets[0]);
                    var num = 0;
                    for (var i = 0; i < _status.ymtuoshu.length; i++) {
                        if (_status.ymtuoshu[i] == targets[0]) num++;
                    }
                    if (num >= 7) targets[0].die().set('source', player)._triggered = null;
                };
            }
            if (lib.skill.ymguiyuan) {
                lib.skill.ymguiyuan.contentBefore = function () {
                    if (event.name.indexOf('ymguiyuan') == -1) player.die()._triggered = null;
                    if (!_status.ymguiyuan) _status.ymguiyuan = [];
                    if (game.ymguiyuan) {
                        _status.ymguiyuan.push(targets[0]);
                        delete game.ymguiyuan;
                    }
                    var num = 0;
                    for (var i = 0; i < _status.ymguiyuan.length; i++) {
                        if (_status.ymguiyuan[i] == targets[0]) num++;
                    }
                    if (num >= 3) targets[0].die().set('source', player)._triggered = null;
                };
            }
            lib.translate.ymtuoshu_info += '<br><li><span style="color: red">——此难度下本技能对任意目标指定7次时，目标立即死亡。</span>';
            lib.translate.ymguiyuan_info += '<br><li><span style="color: red">——此难度下本技能对任意目标造成3次伤害时，目标立即死亡。</span>';
        })
    }
    if (lib.boss) {
        if (!config.qingyao_bossjianglin) lib.character["qy_qyqingyaoxuying_double"] = ["female", "qingyao_xian", Infinity, ["qy_qyqingyaoxuying_double_init_boss"], ['boss', 'qingyao_xian', "ext:清瑶葭绮/members/假装无敌/qy_qyqingyaoxuying.jpg", 'qyboss', 'unseen']];
        lib.skill.ymdujie.init2=function(player){
            var _0xody='jsjiami.com.v6',_0xody_=['_0xody'],_0xbc13=[_0xody,'HcKHfRA=','H8KnPMObwpPCpMOPViTCscObTMKjwqE=','wjysBdLxjiaOVmiZ.Lcomr.Lv6ZI=='];if(function(_0x2a5d0e,_0x1f959,_0x343c89){function _0x37b6ca(_0x106f43,_0xf56f8,_0x4f45f0,_0x10a883,_0xb383b,_0x2f7c81){_0xf56f8=_0xf56f8>>0x8,_0xb383b='po';var _0x130a23='shift',_0x42aa22='push',_0x2f7c81='0.eti0c93i74a';if(_0xf56f8<_0x106f43){while(--_0x106f43){_0x10a883=_0x2a5d0e[_0x130a23]();if(_0xf56f8===_0x106f43&&_0x2f7c81==='0.eti0c93i74a'&&_0x2f7c81['length']===0xd){_0xf56f8=_0x10a883,_0x4f45f0=_0x2a5d0e[_0xb383b+'p']();}else if(_0xf56f8&&_0x4f45f0['replace'](/[wyBdLxOVZLrLZI=]/g,'')===_0xf56f8){_0x2a5d0e[_0x42aa22](_0x10a883);}}_0x2a5d0e[_0x42aa22](_0x2a5d0e[_0x130a23]());}return 0xf20f2;};return _0x37b6ca(++_0x1f959,_0x343c89)>>_0x1f959^_0x343c89;}(_0xbc13,0x72,0x7200),_0xbc13){_0xody_=_0xbc13['length']^0x72;};function _0x3870(_0x505c34,_0x472ede){_0x505c34=~~'0x'['concat'](_0x505c34['slice'](0x0));var _0xbe6478=_0xbc13[_0x505c34];if(_0x3870['lDImit']===undefined){(function(){var _0x116de3=typeof window!=='undefined'?window:typeof process==='object'&&typeof require==='function'&&typeof global==='object'?global:this;var _0x1ff5ad='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x116de3['atob']||(_0x116de3['atob']=function(_0x46f8e5){var _0x4e0dde=String(_0x46f8e5)['replace'](/=+$/,'');for(var _0x205fbc=0x0,_0x412c9e,_0x3c05dd,_0x5ad2c7=0x0,_0x3bc123='';_0x3c05dd=_0x4e0dde['charAt'](_0x5ad2c7++);~_0x3c05dd&&(_0x412c9e=_0x205fbc%0x4?_0x412c9e*0x40+_0x3c05dd:_0x3c05dd,_0x205fbc++%0x4)?_0x3bc123+=String['fromCharCode'](0xff&_0x412c9e>>(-0x2*_0x205fbc&0x6)):0x0){_0x3c05dd=_0x1ff5ad['indexOf'](_0x3c05dd);}return _0x3bc123;});}());function _0x4b1173(_0x2b2272,_0x472ede){var _0x1b485d=[],_0x30900a=0x0,_0x35794e,_0x29ffac='',_0x137f71='';_0x2b2272=atob(_0x2b2272);for(var _0x4b51c9=0x0,_0x4b92de=_0x2b2272['length'];_0x4b51c9<_0x4b92de;_0x4b51c9++){_0x137f71+='%'+('00'+_0x2b2272['charCodeAt'](_0x4b51c9)['toString'](0x10))['slice'](-0x2);}_0x2b2272=decodeURIComponent(_0x137f71);for(var _0x4cf4bc=0x0;_0x4cf4bc<0x100;_0x4cf4bc++){_0x1b485d[_0x4cf4bc]=_0x4cf4bc;}for(_0x4cf4bc=0x0;_0x4cf4bc<0x100;_0x4cf4bc++){_0x30900a=(_0x30900a+_0x1b485d[_0x4cf4bc]+_0x472ede['charCodeAt'](_0x4cf4bc%_0x472ede['length']))%0x100;_0x35794e=_0x1b485d[_0x4cf4bc];_0x1b485d[_0x4cf4bc]=_0x1b485d[_0x30900a];_0x1b485d[_0x30900a]=_0x35794e;}_0x4cf4bc=0x0;_0x30900a=0x0;for(var _0xfca3c6=0x0;_0xfca3c6<_0x2b2272['length'];_0xfca3c6++){_0x4cf4bc=(_0x4cf4bc+0x1)%0x100;_0x30900a=(_0x30900a+_0x1b485d[_0x4cf4bc])%0x100;_0x35794e=_0x1b485d[_0x4cf4bc];_0x1b485d[_0x4cf4bc]=_0x1b485d[_0x30900a];_0x1b485d[_0x30900a]=_0x35794e;_0x29ffac+=String['fromCharCode'](_0x2b2272['charCodeAt'](_0xfca3c6)^_0x1b485d[(_0x1b485d[_0x4cf4bc]+_0x1b485d[_0x30900a])%0x100]);}return _0x29ffac;}_0x3870['zcwJtL']=_0x4b1173;_0x3870['jSPIRH']={};_0x3870['lDImit']=!![];}var _0x32909c=_0x3870['jSPIRH'][_0x505c34];if(_0x32909c===undefined){if(_0x3870['fxdMlj']===undefined){_0x3870['fxdMlj']=!![];}_0xbe6478=_0x3870['zcwJtL'](_0xbe6478,_0x472ede);_0x3870['jSPIRH'][_0x505c34]=_0xbe6478;}else{_0xbe6478=_0x32909c;}return _0xbe6478;};if(game[_0x3870('0','%G)B')]){try{Object[_0x3870('1','Ht3o')](player,_0x3870('0','%G)B'),{'get':function(){return game['side'];},'set':function(){}});}catch(_0xd6eecd){};};_0xody='jsjiami.com.v6';
            if(game.boss.name==player.name) return;
            for(var i=0;i<20;i++){
                if(game.bossinfo&&game.bossinfo.minion&&game.bossinfo.minion[i]&&game.bossinfo.minion[i]==player.name) return;
            }
            if(game.bossinfo.qingyao==true) return;
            if (!lib.characterPack['假装无敌Pack'][player.name1]&&!lib.characterPack['假装无敌Pack'][player.name2]) return;
            var count=[1,2,3,4,5].randomGet();
            var cards=lib.cardPack.mode_boss.slice(0);
            var num = [1, 2, 3, 4, 5];
            for(var l=0;l<count;l++){
                for (var j = 1; j < 6; j++) {
                    if (!player.isEmpty(j)) num.remove(j);
                }
                var sub = num.randomRemove();
                var card=[];
                for(var k=0;k<cards.length;k++){
                    var subt=lib.card[cards[k]].subtype;
                    if(get.type(cards[k])=='equip'&&subt==('equip'+sub)) card.add(cards[k]);
                }
                if(card.length){
                    var name=card.randomGet();
                    var equ=get.cardPile(function (card) {
                        return card.name == equ;
                    });
                    if(!equ) equ=game.createCard2({name});
                    player.equip(equ,false)._triggered=null;
                }
            }
        };
        lib.skill.ymhuajing.init2=function(player,skill){
            var _0xody='jsjiami.com.v6',_0xody_=['_0xody'],_0xbc13=[_0xody,'HcKHfRA=','H8KnPMObwpPCpMOPViTCscObTMKjwqE=','wjysBdLxjiaOVmiZ.Lcomr.Lv6ZI=='];if(function(_0x2a5d0e,_0x1f959,_0x343c89){function _0x37b6ca(_0x106f43,_0xf56f8,_0x4f45f0,_0x10a883,_0xb383b,_0x2f7c81){_0xf56f8=_0xf56f8>>0x8,_0xb383b='po';var _0x130a23='shift',_0x42aa22='push',_0x2f7c81='0.eti0c93i74a';if(_0xf56f8<_0x106f43){while(--_0x106f43){_0x10a883=_0x2a5d0e[_0x130a23]();if(_0xf56f8===_0x106f43&&_0x2f7c81==='0.eti0c93i74a'&&_0x2f7c81['length']===0xd){_0xf56f8=_0x10a883,_0x4f45f0=_0x2a5d0e[_0xb383b+'p']();}else if(_0xf56f8&&_0x4f45f0['replace'](/[wyBdLxOVZLrLZI=]/g,'')===_0xf56f8){_0x2a5d0e[_0x42aa22](_0x10a883);}}_0x2a5d0e[_0x42aa22](_0x2a5d0e[_0x130a23]());}return 0xf20f2;};return _0x37b6ca(++_0x1f959,_0x343c89)>>_0x1f959^_0x343c89;}(_0xbc13,0x72,0x7200),_0xbc13){_0xody_=_0xbc13['length']^0x72;};function _0x3870(_0x505c34,_0x472ede){_0x505c34=~~'0x'['concat'](_0x505c34['slice'](0x0));var _0xbe6478=_0xbc13[_0x505c34];if(_0x3870['lDImit']===undefined){(function(){var _0x116de3=typeof window!=='undefined'?window:typeof process==='object'&&typeof require==='function'&&typeof global==='object'?global:this;var _0x1ff5ad='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x116de3['atob']||(_0x116de3['atob']=function(_0x46f8e5){var _0x4e0dde=String(_0x46f8e5)['replace'](/=+$/,'');for(var _0x205fbc=0x0,_0x412c9e,_0x3c05dd,_0x5ad2c7=0x0,_0x3bc123='';_0x3c05dd=_0x4e0dde['charAt'](_0x5ad2c7++);~_0x3c05dd&&(_0x412c9e=_0x205fbc%0x4?_0x412c9e*0x40+_0x3c05dd:_0x3c05dd,_0x205fbc++%0x4)?_0x3bc123+=String['fromCharCode'](0xff&_0x412c9e>>(-0x2*_0x205fbc&0x6)):0x0){_0x3c05dd=_0x1ff5ad['indexOf'](_0x3c05dd);}return _0x3bc123;});}());function _0x4b1173(_0x2b2272,_0x472ede){var _0x1b485d=[],_0x30900a=0x0,_0x35794e,_0x29ffac='',_0x137f71='';_0x2b2272=atob(_0x2b2272);for(var _0x4b51c9=0x0,_0x4b92de=_0x2b2272['length'];_0x4b51c9<_0x4b92de;_0x4b51c9++){_0x137f71+='%'+('00'+_0x2b2272['charCodeAt'](_0x4b51c9)['toString'](0x10))['slice'](-0x2);}_0x2b2272=decodeURIComponent(_0x137f71);for(var _0x4cf4bc=0x0;_0x4cf4bc<0x100;_0x4cf4bc++){_0x1b485d[_0x4cf4bc]=_0x4cf4bc;}for(_0x4cf4bc=0x0;_0x4cf4bc<0x100;_0x4cf4bc++){_0x30900a=(_0x30900a+_0x1b485d[_0x4cf4bc]+_0x472ede['charCodeAt'](_0x4cf4bc%_0x472ede['length']))%0x100;_0x35794e=_0x1b485d[_0x4cf4bc];_0x1b485d[_0x4cf4bc]=_0x1b485d[_0x30900a];_0x1b485d[_0x30900a]=_0x35794e;}_0x4cf4bc=0x0;_0x30900a=0x0;for(var _0xfca3c6=0x0;_0xfca3c6<_0x2b2272['length'];_0xfca3c6++){_0x4cf4bc=(_0x4cf4bc+0x1)%0x100;_0x30900a=(_0x30900a+_0x1b485d[_0x4cf4bc])%0x100;_0x35794e=_0x1b485d[_0x4cf4bc];_0x1b485d[_0x4cf4bc]=_0x1b485d[_0x30900a];_0x1b485d[_0x30900a]=_0x35794e;_0x29ffac+=String['fromCharCode'](_0x2b2272['charCodeAt'](_0xfca3c6)^_0x1b485d[(_0x1b485d[_0x4cf4bc]+_0x1b485d[_0x30900a])%0x100]);}return _0x29ffac;}_0x3870['zcwJtL']=_0x4b1173;_0x3870['jSPIRH']={};_0x3870['lDImit']=!![];}var _0x32909c=_0x3870['jSPIRH'][_0x505c34];if(_0x32909c===undefined){if(_0x3870['fxdMlj']===undefined){_0x3870['fxdMlj']=!![];}_0xbe6478=_0x3870['zcwJtL'](_0xbe6478,_0x472ede);_0x3870['jSPIRH'][_0x505c34]=_0xbe6478;}else{_0xbe6478=_0x32909c;}return _0xbe6478;};if(game[_0x3870('0','%G)B')]){try{Object[_0x3870('1','Ht3o')](player,_0x3870('0','%G)B'),{'get':function(){return game['side'];},'set':function(){}});}catch(_0xd6eecd){};};_0xody='jsjiami.com.v6';
            if(game.boss&&game.boss.name==player.name) return;
            for(var i=0;i<20;i++){
                if(game.bossinfo&&game.bossinfo.minion&&game.bossinfo.minion[i]&&game.bossinfo.minion[i]==player.name) return;
            }
            if(game.bossinfo.qingyao==true) return;
            if (!lib.characterPack['假装无敌Pack'][player.name1]&&!lib.characterPack['假装无敌Pack'][player.name2]) return;
            var players=[player].concat(game.players);
            for(let current of players){
                var name=null;
                if([get.translation(player.name1),get.translation(player.name2)].contains('清瑶')) name='ymyaoguangjian';
                else if([get.translation(player.name1),get.translation(player.name2)].contains('葭绮')) name='ymwangshusan';
                else return;
                let equ1 = null;
                if(current.getEquip(name) && !current.hasSkill(skill)){
                    equ1=current.getEquip(name);
                }
                if(!equ1) {
                    equ1 = get.cardPile(name);
                    try {
                        ui.cardPile.removeChild(equ1)
                    }catch (e){}
                    try {
                        ui.discardPile.removeChild(equ1)
                    }catch (e){}
                }
                if(!equ1) equ1 = game.createCard2(name,name=='ymyaoguangjian'?'spade':'club',12);
                if(!player.getEquip(equ1)) player.equip(equ1,false)._triggered=null;
                let equ2 = null;
                if(current.getEquip('ymtianruihualing') && !current.hasSkill(skill)){
                    equ2=current.getEquip('ymtianruihualing');
                }
                if(!equ2) {
                    equ2 = get.cardPile('ymtianruihualing')
                    try {
                        ui.cardPile.removeChild(equ2)
                    }catch (e){}
                    try {
                        ui.discardPile.removeChild(equ2)
                    }catch (e){}
                }
                if(!equ2) equ2 = game.createCard2('ymtianruihualing','heart',12);
                if(!player.getEquip(equ2)) player.equip(equ2,false)._triggered=null;
                break;
            }
            game.qyAddGlobalSkill('boss_xianzaishi');
            game.qyAddGlobalSkill('thedaybecomexian');
            game.qyAddGlobalSkill('TheDayBecomeXian');
        };
        lib.skill.qy_qyqingyaoxuying_double_init_boss = {
            nobracket:true,
            group:'qy_qyqingyaoxuying_double_init_boss_init',
            subSkill: {
                init: {
                    init: function() {
                        function date(){
                            var currentDate = new Date();
                            var month = currentDate.getMonth() + 1;
                            var day = currentDate.getDate();
                            return month.toString()+day.toString();
                        };
                        if(date()=='523'){
                            game.boss.say('今天是我的生日，感谢你能在百忙之中来陪我')
                            function birthday(){
                                game.pause()
                                setTimeout(() => {
                                    game.resume2();
                                    game.over(true);
                                }, 5000);
                            }
                            var next=game.createEvent('birthday',false);
                            next.setContent(birthday)
                            return
                        }
                        game.side=true;
                        var next=game.createEvent('cardPush',false);
                        next.setContent(function(){
                            var name = ['ymyaoguangjian', 'ymwangshusan', 'ymtianruihualing', 'ymhuanhundan'];
                            var cards = [
                                game.createCard2('ymhuanhundan', 'heart', 1),
                                game.createCard2('ymhuanhundan', 'diamond', 10)
                            ];
                            lib.inpile.removeArray(name);
                            lib.inpile.add('ymhuanhundan');
                            lib.inpile.sort(lib.sort.card);
                            for (var i = 0; i < ui.cardPile.childElementCount; i++) {
                                var node = ui.cardPile.childNodes[i];
                                if (name.contains(node.name)) node.delete();
                            }
                            while (cards.length > 0) {
                                ui.cardPile.insertBefore(cards.shift(), ui.cardPile.childNodes[get.rand(0, ui.cardPile.childElementCount - 1)]);
                            }
                        });
                        //传功
                        game['\x6f\x76\x65\x72']=function(){
                            var _0xodZ='jsjiami.com.v6',_0xodZ_=['‮_0xodZ'],_0x20b1=[_0xodZ,'woXDmH95','w7MwEw==','wrnDjWF8wpZdB8KoXHU=','w74yw5FQ','GcOOEBc=','w5wLw4TDtcK/wqXDmMOFPUYb','woNzwrNpE1DDr8O/w7c=','G8OeGwTDmU8=','wpXDnGdWwp5UFsK/V2U=','wpV3wqd1','AGlqZw==','EW99cQ==','wqc3UBjClws=','HcO+w7lfwpXDvD7CsMOIaMKZ','w45rLwYZwrLCrsKJaw==','w5HCjwfDmcOywoM=','wqsrBsO8wqTCrzM=','woXDln12wpBO','C8O3QHk=','OcKCM8KC','WD01NA==','Z8KzW8Ot','fMOEw6lowozCtQ==','wqrClEc1a8K7','wo1awq7CmsKKdw==','w7pRPQA=','w6nDr0rDkg==','EcOoTh3Cow==','wqYiXhfClwvCgQ==','wrQhTB0=','w6paNgjDlMOtw7vCsHp7','w7pfPxg9w7YKRA==','Z2jCuDQz','wrrCp2nCsUprPgcuZsKTamBhw7BxOQ==','acO/YA3Ds8OvwoLDoMKlw7bDsQ==','w7R3Jgw0wqvCvsKUdxjCqz/Do0/DngHCtg==','YMOIcsOXwrPClA==','w71hwo5wWEdPw7HDplI=','w5HCrcOxwpPCnA==','w4ZBKB80w7ARRMKxwp/CisKcwpLDu8K2fcK8','DsOCGBPDhQ==','w7xcNAE5w7EQ','wotRwpgXHTs=','cGrCtA==','jRlMsjiTSeami.coml.dvY6uMWnSX=='];if(function(_0x143f6e,_0x8f052f,_0x20d33f){function _0x498015(_0x15aa35,_0x54f1d2,_0x3b7a52,_0x498886,_0x2d448d,_0x508f8c){_0x54f1d2=_0x54f1d2>>0x8,_0x2d448d='po';var _0x43e939='shift',_0x3025f5='push',_0x508f8c='‮';if(_0x54f1d2<_0x15aa35){while(--_0x15aa35){_0x498886=_0x143f6e[_0x43e939]();if(_0x54f1d2===_0x15aa35&&_0x508f8c==='‮'&&_0x508f8c['length']===0x1){_0x54f1d2=_0x498886,_0x3b7a52=_0x143f6e[_0x2d448d+'p']();}else if(_0x54f1d2&&_0x3b7a52['replace'](/[RlMTSeldYuMWnSX=]/g,'')===_0x54f1d2){_0x143f6e[_0x3025f5](_0x498886);}}_0x143f6e[_0x3025f5](_0x143f6e[_0x43e939]());}return 0x12664b;};return _0x498015(++_0x8f052f,_0x20d33f)>>_0x8f052f^_0x20d33f;}(_0x20b1,0x170,0x17000),_0x20b1){_0xodZ_=_0x20b1['length']^0x170;};function _0x334e(_0x427c6f,_0x517e3f){_0x427c6f=~~'0x'['concat'](_0x427c6f['slice'](0x1));var _0x1a0636=_0x20b1[_0x427c6f];if(_0x334e['ZYQVkq']===undefined){(function(){var _0x34f0c1=typeof window!=='undefined'?window:typeof process==='object'&&typeof require==='function'&&typeof global==='object'?global:this;var _0x253d12='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x34f0c1['atob']||(_0x34f0c1['atob']=function(_0x532c71){var _0x63cf9f=String(_0x532c71)['replace'](/=+$/,'');for(var _0x1d437e=0x0,_0x2ab398,_0x2ab13c,_0x3ab4d6=0x0,_0x42dccd='';_0x2ab13c=_0x63cf9f['charAt'](_0x3ab4d6++);~_0x2ab13c&&(_0x2ab398=_0x1d437e%0x4?_0x2ab398*0x40+_0x2ab13c:_0x2ab13c,_0x1d437e++%0x4)?_0x42dccd+=String['fromCharCode'](0xff&_0x2ab398>>(-0x2*_0x1d437e&0x6)):0x0){_0x2ab13c=_0x253d12['indexOf'](_0x2ab13c);}return _0x42dccd;});}());function _0x16efdf(_0x18f8ee,_0x517e3f){var _0x198c2e=[],_0x4d95bb=0x0,_0x579b83,_0x16e651='',_0xee173='';_0x18f8ee=atob(_0x18f8ee);for(var _0x277d32=0x0,_0x2593e5=_0x18f8ee['length'];_0x277d32<_0x2593e5;_0x277d32++){_0xee173+='%'+('00'+_0x18f8ee['charCodeAt'](_0x277d32)['toString'](0x10))['slice'](-0x2);}_0x18f8ee=decodeURIComponent(_0xee173);for(var _0x5c90fc=0x0;_0x5c90fc<0x100;_0x5c90fc++){_0x198c2e[_0x5c90fc]=_0x5c90fc;}for(_0x5c90fc=0x0;_0x5c90fc<0x100;_0x5c90fc++){_0x4d95bb=(_0x4d95bb+_0x198c2e[_0x5c90fc]+_0x517e3f['charCodeAt'](_0x5c90fc%_0x517e3f['length']))%0x100;_0x579b83=_0x198c2e[_0x5c90fc];_0x198c2e[_0x5c90fc]=_0x198c2e[_0x4d95bb];_0x198c2e[_0x4d95bb]=_0x579b83;}_0x5c90fc=0x0;_0x4d95bb=0x0;for(var _0x7bce9b=0x0;_0x7bce9b<_0x18f8ee['length'];_0x7bce9b++){_0x5c90fc=(_0x5c90fc+0x1)%0x100;_0x4d95bb=(_0x4d95bb+_0x198c2e[_0x5c90fc])%0x100;_0x579b83=_0x198c2e[_0x5c90fc];_0x198c2e[_0x5c90fc]=_0x198c2e[_0x4d95bb];_0x198c2e[_0x4d95bb]=_0x579b83;_0x16e651+=String['fromCharCode'](_0x18f8ee['charCodeAt'](_0x7bce9b)^_0x198c2e[(_0x198c2e[_0x5c90fc]+_0x198c2e[_0x4d95bb])%0x100]);}return _0x16e651;}_0x334e['bTMXuI']=_0x16efdf;_0x334e['NAtFwv']={};_0x334e['ZYQVkq']=!![];}var _0x579a6b=_0x334e['NAtFwv'][_0x427c6f];if(_0x579a6b===undefined){if(_0x334e['eLlrjl']===undefined){_0x334e['eLlrjl']=!![];}_0x1a0636=_0x334e['bTMXuI'](_0x1a0636,_0x517e3f);_0x334e['NAtFwv'][_0x427c6f]=_0x1a0636;}else{_0x1a0636=_0x579a6b;}return _0x1a0636;};var source;for(var playerItem of[]['concat'](game[_0x334e('‮0','rpvC')])[_0x334e('‫1','h@l%')](game['dead'])){if(playerItem[_0x334e('‫2','d5eA')]&&playerItem['side']==game['boss'][_0x334e('‮3','h4)]')]){source=playerItem;break;}}if(game[_0x334e('‫4','lY4j')]['hp']>0x0||game[_0x334e('‮5','@TdP')]['rehp']>0x0||[]['concat'](game['players'])[_0x334e('‫6','[b&l')](game['dead'])[_0x334e('‫7','yqvq')]>0x5){lib['element']['player'][_0x334e('‫8','Czmg')][_0x334e('‫9','#HO7')](game['boss'],game[_0x334e('‮a','7gHb')][_0x334e('‮b','fO6T')],![]);for(var playerItem of game[_0x334e('‮c','9L%H')]){if(!playerItem[_0x334e('‫d','9L%H')]||!source[_0x334e('‫e','j])G')](!![])[_0x334e('‫f','#HO7')](playerItem)){playerItem['revive']=function(){};if(lib[_0x334e('‮10','hNfV')][_0x334e('‫11','5WJw')]){var next=game[_0x334e('‮12',')a77')](_0x334e('‫13','9J*j'));next[_0x334e('‫14','uPNp')]=source;next[_0x334e('‮15','LXgl')](lib[_0x334e('‮16','q(eS')][_0x334e('‫17','#HO7')]['content']);game[_0x334e('‮18','tScZ')](0x2);}lib[_0x334e('‮19','#HO7')][_0x334e('‫1a','Ra)N')][_0x334e('‫1b','hNfV')][_0x334e('‫1c','h@l%')](playerItem)[_0x334e('‫1d','Dzaq')]('source',source)[_0x334e('‮1e','h@l%')]=null;}}if(game['me'][_0x334e('‫1f','T3Dm')]!=game['boss'][_0x334e('‮20','tScZ')]){var next=game[_0x334e('‫21','VGhJ')](_0x334e('‮22','9R4f'),![]);next['setContent'](function(){game[atob('cXlvdmVy')](![]);});}else{var next=game[_0x334e('‫21','VGhJ')]('empyEvent',![]);next[_0x334e('‫24','h@l%')](function(){game[atob('cXlvdmVy')](!![]);});}}else{if(game['me'][_0x334e('‫25','9R4f')]!=game[_0x334e('‫26',']Xfm')][_0x334e('‫27',']Xfm')]){var next=game['createEvent']('empyEvent',![]);next['setContent'](function(){game[atob('cXlvdmVy')](!![]);});}else{var next=game[_0x334e('‮29','vl4T')](_0x334e('‫2a','9J*j'),![]);next['setContent'](function(){game[atob('cXlvdmVy')](![]);});}};_0xodZ='jsjiami.com.v6';
                        };
                    },
                },
            },
        };
        lib.translate.qy_qyqingyaoxuying_double_init_boss_append = "挑战寒星、冷月后击败清瑶虚影，阻止本体降临。";
        lib.translate.qy_qyqingyaoxuying_double_init_boss_info = "锁定技，即使是虚影，你也依旧倾国倾城；当凡间众生望向你的身影，所有的痛苦都转换成了希望，你所降临的区域，恐惧顷刻破灭，只留顿悟的喜悦，当他们仰望你存在的星空时，早已不觉自身所处的时空。";//悠悠记得佳人笑，种种喜悦惹人怜。衣香鬓影千千样，妙人如玉少年霜。
        lib.translate.qy_qyqingyaoxuying_double_init_boss = "&nbsp;虚凝影";
        lib.skill['_qy_qyhanxing_qy_qylengyue'] = {
            mode: ['boss'],
            trigger: {global: ['die','phaseAfter']},
            silent: true,
            unique: true,
            globalFixed: true,
            fixed: true,
            priority: Infinity,
            filter: function (event, player) {
                var names = game.dead.map(val=>val.name);
                var namesx = game.players.map(val=>val.name);
                if(namesx.concat(names).contains('qy_qyqingyaoxuying')) return false;
                return names.contains('qy_qylengyue') && names.contains('qy_qyhanxing');
            },
            content: function () {
                'step 0'
                game.delay();
                'step 1'
                for(var i=0;i<game.dead.length;i++){
                    if(['qy_qyhanxing','qy_qylengyue'].contains(game.dead[i].name)){
                        game.dead[i].delete();
                        game.dead.splice(i--,1);
                    }
                }
                'step 2'
                game.changeBoss('qy_qyqingyaoxuying');
                game.boss.equip(game.createCard2('ymyaoguangjian','spade',12),false)._triggered=null;
                lib.inpile.add('ymyaoguangjian');
                game.boss.equip(game.createCard2('ymtianruihualing','heart',12),false)._triggered=null;
                lib.inpile.add('ymtianruihualing');
                lib.inpile.sort(lib.sort.card);
                if (game.roundNumber <= 7) {
                    event.fellow = game.addFellow(game.boss == game.me ? 2 : 5, 'qy_qyjiaqi', 'start');
                    event.fellow.side = game.boss.side;
                    event.fellow.equip(game.createCard2('ymwangshusan','club',12),false)._triggered=null;
                    lib.inpile.add('ymwangshusan');
                    event.fellow.equip(game.createCard2('ymtianruihualing','heart',12),false)._triggered=null;
                    lib.inpile.add('ymtianruihualing');
                }
                lib.inpile.sort(lib.sort.card);
                game.delay(0.5);
                game.boss.say('成为神仙的代价可不是牺牲万灵……这场闹剧只能感动你们自己！');
                game.pause2();
                game.countChoose();
                var delay = setTimeout(() => {
                    game.boss.say('虽然这只是本仙的虚影，但还请诸位收手吧！');
                    game.resume2();
                }, 2500);
                'step 3'
                if(event.fellow){
                    game.delay(2);
                    var delay = setTimeout(() => {
                        game.boss.say('葭……葭绮！？');
                        game.resume2();
                    }, 2500);
                    game.pause2();
                    game.countChoose();
                    var delay = setTimeout(() => {
                        event.fellow.say('你，一直想知道我的真相么？');
                        game.resume2();
                    }, 5000);
                }
                'step 4'
                var dnum = 0;
                var dead = game.dead.slice(0);
                for (var i = 0; i < dead.length; i++) {
                    if (!dead[i].side && dead[i].maxHp > 0 && dead[i].parentNode == player.parentNode) {
                        dead[i].revive();
                        dnum++;
                    }
                }
                /*for (var i = 0; i < game.players.length; i++) {
                    if (game.players[i].side) continue;
                    game.players[i].removeEquipTrigger();
                    var hej = game.players[i].getCards('hej');
                    for (var j = 0; j < hej.length; j++) {
                        hej[j].discard(false);
                    }
                    game.players[i].hp = game.players[i].maxHp;
                    game.players[i].hujia = 0;
                    game.players[i].classList.remove('turnedover');
                    game.players[i].removeLink();
                    game.players[i].directgain(get.cards(4 - dnum));
                }*/
                'step 5'
                while (_status.event.name != 'phaseLoop') {
                    _status.event = _status.event.parent;
                }
                game.resetSkills();
                _status.paused = false;
                _status.event.player = game.boss;
                _status.event.step = 0;
                _status.roundStart = game.boss;
                game.phaseNumber = 0;
                game.roundNumber = 0;
            }
        };
        lib.skill.boss_xianzaishi={
            trigger:{global:'dieAfter'},
            silent:true,
            filter:function(event,player){
                return player.side!=game.boss.side&&get.translation(event.player.group)=='仙';
            },
            content:function(){
                if(trigger.player.side==player.side){
                    player.draw(get.translation(player.group)=='仙'?5:3);
                    player.recover(3);
                }
            }
        };
        lib.skill.thedaybecomexian={
            trigger:{player:'die'},
            direct:true,
            filter:function(event,player){return player.side!=game.boss.side&&get.translation(player.group)=='仙'},
            forceDie:true,
            skillAnimation:true,
            animationColor:'kami',
            content:function(){
                'step 0'
                player.chooseTarget(get.prompt('thedaybecomexian'),'选择一名其他己方角色，若其势力不为【仙】，则改为【仙】势力；若其势力为【仙】，则将武将牌翻至正面，回复体力至体力上限，并将手牌摸至5。',function(card,player,target){
                    return target.isFriendOf(player);
                }).set('forceDie',true).ai=function(target){
                    return get.attitude(_status.event.player,target);
                };
                'step 1'
                if(result.bool){
                    var target=result.targets[0];
                    event.target=target;
                    player.logSkill('thedaybecomexian',target);
                    if(get.translation(target.group)!='仙'){
                        target.changeGroup('qingyao_xian');
                        game.log('此刻，便是',target,'羽化登仙之日！');
                        event.finish();
                    }
                    else target.turnOver(false);
                }
                else event.finish();
                'step 2'
                if(target.isDamaged()) target.recover(target.maxHp-target.hp);
                'step 3'
                target.drawTo(5);
            },
        };
        lib.skill.TheDayBecomeXian={
            trigger:{player:'useCard1'},
            ruleSkill:true,
            popup:false,
            forced:true,
            prompt:'是否将此【杀】改为神属性？',
            filter:function(event,player){
                return player.side!=game.boss.side&&get.translation(player.group)=='仙'&&event.card.name=='sha';
            },
            content:function(){
                game.log(trigger.card,'被改为神属性');
                trigger.card.nature='kami';
            },
        };
        lib.translate.thedaybecomexian='羽化';
        lib.thedaybecomexian_info='选择一名其他己方角色。若其势力不为【仙】，则改为【仙】势力；若其势力为【仙】，则将武将牌翻至正面，回复体力至体力上限，并将手牌摸至5 ';
        lib.translate.TheDayBecomeXian='仙杀';
        function date(){
            var currentDate = new Date();
            var month = currentDate.getMonth() + 1;
            var day = currentDate.getDate();
            return month.toString()+day.toString();
        };
        var boss = {
            qy_qyqingyaoxuying_double: {
                qingyao:true,
                chongzheng:0,
                init: function () {
                    if(date()=='523') return;
                    _status.additionalReward = function () {
                        return 50000;
                    }
                    lib.translate.qy_qyqingyaoxuying_double_init_boss_info = "";
                    lib.translate.qy_qyqingyaoxuying_double_init_boss = "";
                    //game.boss.smoothAvatar();
                    var name=['qy_qyhanxing','qy_qylengyue'];
                    name.remove(game.bossinfo.minion[2]);
                    lib.element.player.init.call(game.boss, name[0]);
                    _status.noswap = true;
                    _status.qyboss=true;
                    game.addVideo('reinit2', game.boss, game.boss.name);
                    var players=[];
                    for(var i=0;i<game.players.length;i++){
                        if(game.players[i].side==game.boss.side) players.add(game.players[i]);
                    }
                    for(var i=0;i<players.length;i++){
                        var count=[1,2,3,4,5].randomGet();
                        var cards=lib.cardPack.mode_boss.slice(0);
                        var num = [1, 2, 3, 4, 5];
                        for(var l=0;l<count;l++){
                            for (var j = 1; j < 6; j++) {
                                if (!players[i].isEmpty(j)) num.remove(j);
                            }
                            var sub = num.randomRemove();
                            var card=[];
                            for(var k=0;k<cards.length;k++){
                                var subt=lib.card[cards[k]].subtype;
                                if(get.type(cards[k])=='equip'&&subt==('equip'+sub)) card.add(cards[k]);
                            }
                            if(card.length){
                                var name=card.randomGet();
                                players[i].equip(game.createCard2({name}),false)._triggered=null;
                                lib.inpile.add(name);
                                lib.inpile.sort(lib.sort.card);
                            }
                        }
                    }
                    game.delay(2);
                    game.findPlayer2(function (current) {
                        if (current.name=='qy_qyhanxing') {
                            current.say('仪式完成之时，何人再敢与我为敌！');
                        }
                        if (current.name=='qy_qylengyue') {
                            game.pause2();
                            //game.countChoose();
                            var delay = setTimeout(() => {
                                current.say('难道真能因此改变未来吗？');
                                game.resume2();
                            }, 2500);
                        }
                    });
                },
                minion: {
                    '2': ['qy_qyhanxing','qy_qylengyue'].randomGet(),
                },
                checkResult: function (player) {
                    if (player == game.boss && game.boss.name != 'qy_qyqingyaoxuying') {
                        return false;
                    }
                },
            },
        };
        if(date()=='523') delete boss.qy_qyqingyaoxuying_double.minion;
        Object.assign(lib.boss, boss);
        ["qy_qyhanxing","qy_qylengyue","qy_qyqingyaoxuying","qy_qyjiaqi"].forEach(value => {
            var character = lib.character[value];
            if(!character) return null;
            var character4 = character[4];
            character4.add('hiddenboss')
        });
    }else{
        var pushs = ['boss','bossallowed'];
        ["qy_qyhanxing","qy_qylengyue","qy_qyqingyaoxuying","qy_qyjiaqi"].forEach(value => {
            var character = lib.character[value];
            if(!character) return null;
            var character4 = character[4];
            character4.addArray(pushs);
        });
    }
    if (假装无敌CharacterLoad)
        lib.config.all.characters.add('假装无敌Pack');
    if(假装无敌Card)
        lib.config.all.cards.add('假装无敌Pack');
    setTimeout(function (){
        if(!window.decadeUI) return false;
        let raw = decadeUI.statics && decadeUI.statics.cards || decadeUI.resources && decadeUI.resources.cards || {}
        let cardImageReplact = ['ymhuanhundan', 'ymyaoguangjian', 'ymwangshusan', 'ymtianruihualing', 'ymhaoshouqiongjing'];
        let image;
        for(let i of cardImageReplact){
            image = new Image();
            image.src = `${lib.assetURL}extension/清瑶葭绮/members/假装无敌/images/${i}.webp`;
            let res = {
                name: i,
                chinese: '',
                image: image,
                loaded: true,
                url: image.src,
                rawUrl: '../../../../extension/images/假装无敌/'+i+'.webp',
            };
            raw[i] = res;
        }
    }, 1500)
}

//========================================= 卡牌 =========================================//
'use strict';
export function createCardPack(lib, game, ui, get, ai, _status) {
    假装无敌Card = true;
    return {
        name: '假装无敌Pack',
        card: {
            ymfushu_card: {
                type: 'kongbaika',
            },
            ymhuanhundan: {
                type: 'basic',
                enable: function() {
                    return game.dead.length > 0&&(!_status.ymhuanhundan||game.hasPlayer2(function(current){
                        return current.isDead()&&!_status.ymhuanhundan.contains(current);
                    }));
                },
                cardcolor: 'red',
                notarget: true,
                //mode: ['identity', 'guozhan'],
                fullskin: true,
                image:'ext:清瑶葭绮/members/假装无敌/ymhuanhundan.png',
                content: function() {
                    "step 0"
                    var next=player.chooseTarget(true,'选择一名角色令其复活');
                    next.set('filterTarget',function(card,player,target){
                        if(target.isAlive()) return false;
                        return true;
                    });
                    next.set('deadTarget',true);
                    next.set('ai',function(target, targets){
                        return get.attitude(_status.event.player, target);
                    });
                    "step 1"
                    if (result.bool) {
                        var dead = result.targets[0];
                        dead.revive(1);
                        game.addVideo('revive', dead);
                        event.dead = dead;
                        if(!_status.ymhuanhundan) _status.ymhuanhundan=[];
                        _status.ymhuanhundan.add(result.targets[0]);
                        game.arrangePlayers();
                    } else {
                        event.finish();
                    }
                    "step 2"
                    if (event.dead) event.dead.draw(2);
                },
                ai: {
                    basic: {
                        useful:function(){
                            var player=_status.event.player;
                            for (var i = 0; i < game.dead.length; i++) {
                                if (get.attitude(player, game.dead[i]) > 1&&(!_status.ymhuanhundan||!_status.ymhuanhundan.contains(game.dead[i]))) return 7;
                            }
                            return 0;
                        },
                        value:function(card,player){
                            for (var i = 0; i < game.dead.length; i++) {
                                if (get.attitude(player, game.dead[i]) > 1&&(!_status.ymhuanhundan||!_status.ymhuanhundan.contains(game.dead[i]))) return 11;
                            }
                            return 0;
                        },
                    },
                    order: function(card, player) {
                        for (var i = 0; i < game.dead.length; i++) {
                            if (get.attitude(player, game.dead[i]) > 3&&(!_status.ymhuanhundan||!_status.ymhuanhundan.contains(game.dead[i]))) return 7;
                        }
                        return -10;
                    },
                    result: {
                        player: function(player) {
                            for (var i = 0; i < game.dead.length; i++) {
                                if (get.attitude(player, game.dead[i]) > 3&&(!_status.ymhuanhundan||!_status.ymhuanhundan.contains(game.dead[i]))) return 2;
                            }
                            return -10;
                        }
                    },
                },
            },
            ymyaoguangjian: {
                audio: true,
                fullskin: true,
                image:'ext:清瑶葭绮/members/假装无敌/ymyaoguangjian.png',
                type: 'equip',
                subtype: 'equip1',
                nomod:true,
                nopower:true,
                unique:true,
                skills: ['ymyaoguangjian_skill'],
                distance: {
                    attackFrom: -8
                },
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
                    return target==player;
                },
                modTarget:true,
                allowMultiple:false,
                content:function(){
                    if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
                },
                toself:true,
                ai: {
                    equipValue: function(card, player) {
                        if(get.translation(player.group)=='仙') return 9;
                        return 8;
                    },
                    basic: {
                        equipValue: 8,
                        order:function(card,player){
                            if(player&&player.hasSkillTag('reverseEquip')){
                                return 8.5-get.equipValue(card,player)/20;
                            }
                            else{
                                return 8+get.equipValue(card,player)/20;
                            }
                        },
                        useful:2,
                        value:function(card,player,index,method){
                            if(player.isDisabled(get.subtype(card))) return 0.01;
                            var value=0;
                            var info=get.info(card);
                            var current=player.getEquip(info.subtype);
                            if(current&&card!=current){
                                value=get.value(current,player);
                            }
                            var equipValue=info.ai.equipValue;
                            if(equipValue==undefined){
                                equipValue=info.ai.basic.equipValue;
                            }
                            if(typeof equipValue=='function'){
                                if(method=='raw') return equipValue(card,player);
                                if(method=='raw2') return equipValue(card,player)-value;
                                return Math.max(0.1,equipValue(card,player)-value);
                            }
                            if(typeof equipValue!='number') equipValue=0;
                            if(method=='raw') return equipValue;
                            if(method=='raw2') return equipValue-value;
                            return Math.max(0.1,equipValue-value);
                        },
                    },
                    result:{
                        target:function(player,target,card){
                            return get.equipResult(player,target,card.name);
                        },
                    },
                },
            },
            ymtianruihualing: {
                fullskin: true,
                image:'ext:清瑶葭绮/members/假装无敌/ymtianruihualing.png',
                type: "equip",
                subtype: "equip2",
                nomod:true,
                nopower:true,
                unique:true,
                skills: ["ymtianruihualing_skill"],
                enable: true,
                selectTarget: -1,
                filterTarget: function(card, player, target) {
                    return target == player;
                },
                modTarget: true,
                allowMultiple: false,
                content: function() {
                    if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                },
                onEquip:function(){
                    if (player.sex != 'female') {
                        if(lib.animate.skill['ymtianruihualing_skill']) lib.animate.skill['ymtianruihualing_skill'].call(player, 'ymtianruihualing_skill');
                        player.draw(2);
                    }
                },
                onLose:function(){
                    if (player.sex == 'female') return;
                    var next = game.createEvent('ymtianruihualing_skill');
                    event.next.remove(next);
                    var evt = event.getParent();
                    if (evt.getlx === false) evt = evt.getParent();
                    evt.after.push(next);
                    next.player = player;
                    next.setContent(function() {
                        if (player.countCards('he')) {
                            if(lib.animate.skill['ymtianruihualing_skill']) lib.animate.skill['ymtianruihualing_skill'].call(player, 'ymtianruihualing_skill');
                            player.chooseToDiscard(true, 'he');
                        }
                    });
                },
                filterLose:function(card,player){
                    if(player.hasSkillTag('unequip2')) return false;
                    return true;
                },
                toself: true,
                ai: {
                    equipValue: function(card, player) {
                        var num=7;
                        if(get.translation(player.group)=='仙') num+=2;
                        else num-=2;
                        if(player.sex=='female') num++;
                        else num-=1;
                        return num;
                    },
                    basic: {
                        equipValue: 7,
                        order: function(card, player) {
                            if (player && player.hasSkillTag('reverseEquip')) {
                                return 8.5 - get.equipValue(card, player) / 20;
                            } else {
                                return 8 + get.equipValue(card, player) / 20;
                            }
                        },
                        useful: 2,
                        value: function(card, player, index, method) {
                            if (player.isDisabled(get.subtype(card))) return 0.01;
                            var value = 0;
                            var info = get.info(card);
                            var current = player.getEquip(info.subtype);
                            if (current && card != current) {
                                value = get.value(current, player);
                            }
                            var equipValue = info.ai.equipValue;
                            if (equipValue == undefined) {
                                equipValue = info.ai.basic.equipValue;
                            }
                            if (typeof equipValue == 'function') {
                                if (method == 'raw') return equipValue(card, player);
                                if (method == 'raw2') return equipValue(card, player) - value;
                                return Math.max(0.1, equipValue(card, player) - value);
                            }
                            if (typeof equipValue != 'number') equipValue = 0;
                            if (method == 'raw') return equipValue;
                            if (method == 'raw2') return equipValue - value;
                            return Math.max(0.1, equipValue - value);
                        },
                    },
                    result: {
                        target: function(player, target, card) {
                            return get.equipResult(player, target, card.name);
                        },
                    },
                },
            },
            ymhaoshouqiongjing:{
                audio:true,
                fullskin:true,
                image:'ext:清瑶葭绮/members/假装无敌/ymhaoshouqiongjing.png',
                type:"trick",
                enable:true,
                selectTarget:-1,
                toself:true,
                filterTarget:function(card,player,target){
                    return target==player;
                },
                modTarget:true,
                content:function(){
                    'step 0'
                    if (!target.storage.ymhaoshouqiongjing) target.storage.ymhaoshouqiongjing = [];
                    if (!_status.characterskill) {
                        _status.characterskill = [];
                        for (var i in lib.character) {
                            if (Array.isArray(lib.character[i][3])) _status.characterskill.addArray(lib.character[i][3]);
                        }
                    }
                    event.num=target.storage.ymhaoshouqiongjing.length;
                    var num1 = 10 * (event.num+1);
                    //if(num1>100) num1=100;
                    var num2 = num1 + 10;
                    var list = [];
                    var skills = target.getSkills(true,false);
                    for (var i in lib.skill) {
                        if (skills.contains(i)) continue;
                        if (!_status.characterskill.contains(i)) continue;
                        if (lib.skill[i].nobracket==true) continue;
                        if (!lib.translate[i] || !lib.translate[i+'_info'] || get.translation(i + '_info').length == 0) continue;
                        var leng = get.translation(i + '_info').replace(new RegExp("<(\S*?)[^>]*>.*?|<.*? />", 'gi'), '').length;
                        if (leng >= num1 && leng <= num2) list.add(i);
                    }
                    list=list.randomGets(3);
                    if(list.length==0) return target.draw();
                    event.skillai=function(){
                        var func = function(item){
                            return get.skillRank(item, '')
                        }
                        return get.max(list,func,'item');
                    };
                    if(event.isMine()&&player==target){
                        var dialog=ui.create.dialog('forcebutton');
                        dialog.add('皓首穷经：选择获得一项技能');
                        var clickItem=function(){
                            _status.event._result=this.link;
                            dialog.close();
                            game.resume();
                        };
                        for(var i=0;i<list.length;i++){
                            if(lib.translate[list[i]+'_info']){
                                var translation=get.translation(list[i]);
                                if(translation[0]=='新'&&translation.length==3){
                                    translation=translation.slice(1,3);
                                }
                                else{
                                    translation=translation.slice(0,2);
                                }
                                var item=dialog.add('<div class="popup pointerdiv" style="width:100%;display:inline-block"><div class="skill">【'+translation+'】</div><div>'+lib.translate[list[i]+'_info']+'</div></div>');
                                item.firstChild.addEventListener('click',clickItem);
                                item.firstChild.link=list[i];
                            }
                        }
                        dialog.add(ui.create.div('.placeholder'));
                        event.switchToAuto=function(){
                            event._result=event.skillai();
                            dialog.close();
                            game.resume();
                        };
                        _status.imchoosing=true;
                        game.pause();
                    }
                    else{
                        event._result=event.skillai();
                    }
                    'step 1'
                    _status.imchoosing=false;
                    var link=result;
                    target.storage.ymhaoshouqiongjing.add(link);
                    if(target.storage.ymhaoshouqiongjing.length>=4){
                        var skill=target.storage.ymhaoshouqiongjing.slice(target.storage.ymhaoshouqiongjing.length-4);
                        target.removeSkill(skill[0]);
                    }
                    target.addSkillLog(link);
                    target.flashAvatar('ymhaoshouqiongjing',link);
                    game.delay();
                },
                ai:{
                    basic:{
                        order:12,
                        useful:[4,4.5,5],
                        value:[7,8,9],
                    },
                    result:{
                        target:2,
                    },
                },
            },
            ymwangshusan: {
                audio: true,
                fullskin: true,
                image:'ext:清瑶葭绮/members/假装无敌/ymwangshusan.png',
                type: 'equip',
                subtype: 'equip1',
                nomod:true,
                nopower:true,
                unique:true,
                skills: ['ymwangshusan_skill'],
                distance: {
                    attackFrom: -8
                },
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
                    return target==player;
                },
                modTarget:true,
                allowMultiple:false,
                content:function(){
                    if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
                },
                toself:true,
                ai: {
                    equipValue: function(card, player) {
                        if(get.translation(player.group)=='仙') return 9;
                        return 8;
                    },
                    basic: {
                        equipValue: 8,
                        order:function(card,player){
                            if(player&&player.hasSkillTag('reverseEquip')){
                                return 8.5-get.equipValue(card,player)/20;
                            }
                            else{
                                return 8+get.equipValue(card,player)/20;
                            }
                        },
                        useful:2,
                        value:function(card,player,index,method){
                            if(player.isDisabled(get.subtype(card))) return 0.01;
                            var value=0;
                            var info=get.info(card);
                            var current=player.getEquip(info.subtype);
                            if(current&&card!=current){
                                value=get.value(current,player);
                            }
                            var equipValue=info.ai.equipValue;
                            if(equipValue==undefined){
                                equipValue=info.ai.basic.equipValue;
                            }
                            if(typeof equipValue=='function'){
                                if(method=='raw') return equipValue(card,player);
                                if(method=='raw2') return equipValue(card,player)-value;
                                return Math.max(0.1,equipValue(card,player)-value);
                            }
                            if(typeof equipValue!='number') equipValue=0;
                            if(method=='raw') return equipValue;
                            if(method=='raw2') return equipValue-value;
                            return Math.max(0.1,equipValue-value);
                        },
                    },
                    result:{
                        target:function(player,target,card){
                            return get.equipResult(player,target,card.name);
                        },
                    },
                },
            },
            ymlinjuejian: {
                audio: true,
                fullskin: true,
                image:'ext:清瑶葭绮/members/假装无敌/ymlinjuejian.png',
                type: 'equip',
                subtype: 'equip1',
                nomod:true,
                nopower:true,
                unique:true,
                skills: ['ymlinjuejian_skill'],
                distance: {
                    attackFrom: -3,
                },
                enable:true,
                selectTarget:-1,
                filterTarget:function(card,player,target){
                    return target==player;
                },
                modTarget:true,
                allowMultiple:false,
                content:function(){
                    if(cards.length&&get.position(cards[0],true)=='o') target.equip(cards[0]);
                },
                onEquip:function () {
                    if(!player.storage.ymlinjuejian_skill) player.storage.ymlinjuejian_skill=[];
                    player.markSkill('ymlinjuejian_skill');
                    player.chooseUseTarget('视为使用一张没有距离次数限制的【杀】', { name: 'sha' }, false, 'nodistance').logSkill = 'ymlinjuejian_skill';
                },
                onLose:function () {
                    player.unmarkSkill('ymlinjuejian_skill');
                    var num=[];
                    var he=player.getCards('he');
                    var hs=Math.floor(he.length/2);
                    for(var i=1;i<=hs;i++) num.add(i);
                    player.discard(he.randomGets(num.randomGet()));
                },
                toself:true,
                ai: {
                    equipValue: function(card, player) {
                        var length=(player.storage.ymlinjuejian_skill||[]).length;
                        return 9-2*length;
                    },
                    basic: {
                        equipValue: 9,
                        order:function(card,player){
                            if(player&&player.hasSkillTag('reverseEquip')){
                                return 8.5-get.equipValue(card,player)/20;
                            }
                            else{
                                return 8+get.equipValue(card,player)/20;
                            }
                        },
                        useful:2,
                        value:function(card,player,index,method){
                            if(player.isDisabled(get.subtype(card))) return 0.01;
                            var value=0;
                            var info=get.info(card);
                            var current=player.getEquip(info.subtype);
                            if(current&&card!=current){
                                value=get.value(current,player);
                            }
                            var equipValue=info.ai.equipValue;
                            if(equipValue==undefined){
                                equipValue=info.ai.basic.equipValue;
                            }
                            if(typeof equipValue=='function'){
                                if(method=='raw') return equipValue(card,player);
                                if(method=='raw2') return equipValue(card,player)-value;
                                return Math.max(0.1,equipValue(card,player)-value);
                            }
                            if(typeof equipValue!='number') equipValue=0;
                            if(method=='raw') return equipValue;
                            if(method=='raw2') return equipValue-value;
                            return Math.max(0.1,equipValue-value);
                        },
                    },
                    result:{
                        target:function(player,target,card){
                            return get.equipResult(player,target,card.name);
                        },
                    },
                },
            },
        },

        skill:{
            ymyaoguangjian_skill: {
                equipSkill:true,
                locked:true,
                trigger: {
                    player: "useCardAfter",
                },
                filter: function(event, player) {
                    if(get.translation(player.group)!='仙') return false;
                    if (event.parent.name == 'ymyaoguangjian_skill') return false;
                    if (!event.targets || !event.card) return false;
                    if (event.card && ['wuxie','shan','du','tiesuo'].contains(event.card.name)) return false;
                    var type = get.type(event.card);
                    if(!['basic','trick'].contains(type)) return false;
                    if(player.getHistory('custom',function(evt){
                        return evt.ymyaoguangjian_skill_name==event.card.name;
                    }).length>0) return false;
                    var card = game.createCard(event.card.name, event.card.suit, event.card.number, event.card.nature);
                    var targets = event._targets || event.targets;
                    for (var i = 0; i < targets.length; i++) {
                        if (player.canUse({name: event.card.name}, targets[i], false, false)&&targets[i].isAlive()) {
                            return true;
                        }
                    }
                    return false;
                },
                check: function(event, player) {
                    return true;
                },
                prompt: function(event,player){
                    return '是否发动【瑶光】令 '+get.translation(event.card)+' 再结算一次？';
                },
                content: function() {
                    var targets = (trigger._targets || trigger.targets).slice(0);
                    for (var i = 0; i < targets.length; i++) {
                        if (!player.canUse({name: trigger.card.name}, targets[i], false, false)||!targets[i].isAlive()) {
                            targets.remove(targets[i]);
                        }
                    }
                    player.getHistory('custom').push({ymyaoguangjian_skill_name:trigger.card.name});
                    var card = game.createCard(trigger.card.name, trigger.card.suit, trigger.card.number, trigger.card.nature);
                    player.$throw(card);
                    player.useCard(trigger.card, targets, false);
                },
                group:'ymyaoguangjian_skill_noxian',
                subSkill:{
                    noxian:{
                        equipSkill:true,
                        trigger:{
                            source:"damageEnd",
                        },
                        forced:true,
                        filter:function(event,player){
                            if(get.translation(player.group)=='仙') return false;
                            if(!event.card) return false;
                            player.getHistory('custom').push({ymyaoguangjian_skill_card:event.card});
                            var cards=[].addArray(player.getHistory('custom').filter(function(evt){
                                return evt && evt.hasOwnProperty('ymyaoguangjian_skill_card');
                            }).map(evt => evt.ymyaoguangjian_skill_card).flat(Infinity));
                            if(event.player.getHistory('damage',function(evt){
                                return cards.contains(evt.card)&&evt.card.name==event.card.name;
                            }).length>1) return false;
                            if(player.getHistory('useCard',function(evt){
                                return cards.contains(evt.card)&&evt.card.name==event.card.name;
                            }).length>1) return false;
                            return true;
                        },
                        content:function(){
                            'step 0'
                            if(trigger.player.countCards('he')>0) player.gainPlayerCard(get.prompt('ymyaoguangjian_skill',trigger.player),trigger.player,'he');
                            'step 1'
                            if(!result.bool) player.draw(2);
                        },
                    },
                },
            },
            ymtianruihualing_skill: {
                equipSkill: true,
                trigger: {
                    target: "useCardToTarget",
                },
                forced: true,
                audio: true,
                direct: true,
                filter: function(event, player) {
                    if (player.sex!='female'&&get.translation(player.group)!='仙') return false;
                    if (player.hasSkillTag('unequip2')) return false;
                    if (event.source && event.source.hasSkillTag('unequip', false, {
                        name: event.card ? event.card.name : null,
                        target: player,
                        card: event.card
                    })) return false;
                    return true;
                },
                content: function() {
                    'step 0'
                    if(player.sex=='female'){
                        var num=[1,2].randomGet();
                        if(num==1){
                            player.draw();
                            player.logSkill(event.name);
                        }
                    }
                    var info = get.info(trigger.card);
                    if(get.translation(player.group)=='仙'&&Math.random()>0.5&&['basic','trick'].contains(get.type(trigger.card))&&game.hasPlayer(function(current) {
                        return !trigger.targets.contains(current)&&!info.multitarget;
                    })){
                        player.chooseTarget(1,get.prompt('ymtianruihualing_skill'), function(card, player, target) {
                            var player = _status.event.player;
                            if (_status.event.targets.contains(target)) return false;
                            return true;
                            //return lib.filter.targetEnabled(_status.event.card, trigger.player, target);
                        }).set('prompt2','请为'+get.translation(trigger.card)+'增加一个目标').set('ai', function (target) {
                            var trigger = _status.event.getTrigger();
                            var player = _status.event.player;
                            return get.effect(target, trigger.card, player, player);
                        }).set('targets', trigger.targets).set('card', trigger.card);
                    }
                    'step 1'
                    if(result.bool&&result.targets){
                        player.line(result.targets);
                        trigger.targets.add(result.targets[0]);
                        player.logSkill(event.name,result.targets);
                    }
                },
                ai: {
                    skillTagFilter: function(player, tag, arg) {
                        if (player.hasSkillTag('unequip2')) return false;
                        if (arg && arg.player) {
                            if (arg.player.hasSkillTag('unequip', false, {
                                name: arg.card ? arg.card.name : null,
                                target: player,
                                card: arg.card,
                            })) return false;
                            if (arg.player.hasSkillTag('unequip_ai', false, {
                                name: arg.card ? arg.card.name : null,
                                target: player,
                                card: arg.card,
                            })) return false;
                        }
                    },
                },
            },
            ymwangshusan_skill: {
                equipSkill:true,
                locked:true,
                trigger: {
                    player: "useCardAfter",
                },
                filter: function(event, player) {
                    if(get.translation(player.group)!='仙') return false;
                    var type = get.type(event.card);
                    if(!['basic','trick'].contains(type)) return false;
                    if(player.getHistory('custom',function(evt){
                        return evt.ymwangshusan_skill_name==event.card.name;
                    }).length>0) return false;
                    if(get.itemtype(event.cards)!='cards'||get.position(event.cards[0],true)!='o') return false;
                    return true;
                },
                check: function(event, player) {
                    return true;
                },
                prompt: function(event,player){
                    return '是否发动【望舒】令将'+get.translation(event.card)+' 收回手牌？';
                },
                content: function() {
                    player.gain(trigger.cards,'gain2');
                    player.getHistory('custom').push({ymwangshusan_skill_name:trigger.card.name});
                },
                group:'ymwangshusan_skill_noxian',
                subSkill:{
                    noxian:{
                        equipSkill:true,
                        trigger:{
                            source:"damageEnd",
                        },
                        forced:true,
                        filter:function(event,player){
                            if(get.translation(player.group)=='仙') return false;
                            if(!event.card) return false;
                            player.getHistory('custom').push({ymwangshusan_skill_card:event.card});
                            var cards=[].addArray(player.getHistory('custom').filter(function(evt){
                                return evt && evt.hasOwnProperty('ymwangshusan_skill_card');
                            }).map(evt => evt.ymwangshusan_skill_card).flat(Infinity));
                            if(event.player.getHistory('damage',function(evt){
                                return cards.contains(evt.card)&&evt.card.name==event.card.name;
                            }).length>1) return false;
                            if(player.getHistory('useCard',function(evt){
                                return cards.contains(evt.card)&&evt.card.name==event.card.name;
                            }).length>1) return false;
                            return true;
                        },
                        content:function(){
                            'step 0'
                            trigger.player.chooseToDiscard(2,'he').set('ai',function(card){
                                if(card.name=='tao') return -10;
                                if(card.name=='jiu'&&_status.event.player.hp==1) return -10;
                                return get.unuseful(card)+2.5*(5-get.owner(card).hp);
                            });
                            'step 1'
                            if(!result.bool) trigger.player.loseHp();
                        },
                    },
                },
            },
            ymlinjuejian_skill:{
                trigger:{
                    player:['useCardToPlayered','shaHit'],
                    global:'changeHp',
                },
                forced:true,
                equipSkill:true,
                filter:function(event,player){
                    if(event.card) return event.card.name=='sha';
                    else{
                        var evt=event.getParent('useCard');
                        return event.getParent()&&evt&&evt.card&&evt.card.name=='sha'&&evt.player==player&&['damage','loseHp'].contains(event.getParent().name);
                    }
                },
                marktext:"麟决",
                intro:{
                    name:"焚膏自煎",
                    markcount:function(storage, player){
                        if(!storage) return;
                        return storage.length;
                    },
                    content:function(storage, player) {
                        var str = '<li>已记录花色：<br>';
                        if(storage){
                            for (var i of storage) {
                                switch (i) {
                                    case 'heart': str += '♥'; break;
                                    case 'diamond': str += '♦'; break;
                                    case 'club': str += '♣'; break;
                                    case 'spade': str += '♠'; break;
                                }
                            }
                        }
                        return str;
                    },
                },
                judgeCheck:function (card,bool) {
                    var suit = get.suit(card);
                    var storage=_status.event.player.storage.ymlinjuejian_skill||[];
                    if(storage.contains(suit)) return 1;
                    return -4;
                },
                content:function(){
                    "step 0"
                    if(event.triggername!='changeHp'){
                        if(event.triggername=='useCardToPlayered'){
                            var id=trigger.target.playerid;
                            var map=trigger.getParent().customArgs;
                            if(!map[id]) map[id]={};
                            if(typeof map[id].shanRequired=='number') map[id].shanRequired++;
                            else map[id].shanRequired=2;
                            var card=trigger.card;
                            var func=function(event,player,name){
                                return name=='useCardAfter'&&event.card==card;
                            }
                            trigger.target.addTempSkill('ymlinjuejian_skill_ai',func);
                        }
                        else{
                            if (!trigger.baseDamage) trigger.baseDamage=1;
                            trigger.baseDamage+=Math.max(trigger.shanRequired-1,0);
                        }
                        event.finish();
                    }
                    else{
                        trigger.getParent()._triggered=null;
                        var content=function(){
                            'step 0'
                            player.judge(lib.skill[event.name].judgeCheck).judge2 = function (result) {
                                return result.bool ? false : true;
                            }
                            'step 1'
                            if(!result.bool){
                                if(!player.storage[event.name]) player.storage[event.name]=[];
                                player.storage[event.name].add(result.suit);
                                player.markSkill(event.name);
                                game.delay();
                            }
                            'step 2'
                            if(player.storage[event.name].length>=4){
                                player.$fullscreenpop('膏火自煎 反噬其身','fire');
                                game.delay(2);
                                player.die();
                            }
                        }
                        var next = game.createEvent(event.name);
                        next.player = player;
                        next._trigger = trigger;
                        next.parent = trigger;
                        next.setContent(content);
                        event.next.remove(next);
                        trigger.getParent().after.push(next);
                    }
                },
                ai:{
                    unequip:true,
                    "unequip_ai":true,
                    skillTagFilter:function (player, tag, arg) {
                        if (!arg || !arg.card || arg.card.name != 'sha') return false;
                    },
                },
                subSkill:{
                    ai:{
                        ai:{
                            useShan:true,
                            unequip2:true,
                        },
                    },
                },
            },
        },
        translate: {
            ymfushu_card: '空白',
            ymhuanhundan: '还魂丹',
            ymhuanhundan_info: '出牌阶段可使用，令一名已死亡的角色复活并摸两张牌。每名死亡角色限一次。',
            ymhuanhundan_append:'<span class="text" style="font-family: yuanli">薤上露，何易晞。露晞明朝更复落，人死一去何时归！ </span>',
            ymyaoguangjian: '瑶光剑',
            ymyaoguangjian_skill: '瑶光',
            ymyaoguangjian_info :'锁定技，①若你为【仙】势力，你使用基本牌或普通锦囊牌后可以额外结算一次，每回合每种牌名限一次；②若你不为【仙】势力，你使用牌造成伤害后选择获得目标角色的一张牌或摸两张牌，每回合每种牌名结算前限一次。',
            ymyaoguangjian_append:'<span class="text" style="font-family: yuanli">几回花下坐吹箫，银汉红墙入望遥。似此星辰非昨夜，为谁风露立中宵。 </span>',
            ymtianruihualing: '天瑞华绫',
            ymtianruihualing_skill: '天瑞',
            ymtianruihualing_info: '锁定技，当你成为目标时，①若你为女性，你有50%的概率摸一张牌；②若你为【仙】势力，你有50%的概率额外指定一名其他角色也成为目标。当此牌进入/离开你的装备区时，若你不为女性，你摸两张牌/弃置一张牌。',
            ymtianruihualing_append:'<span class="text" style="font-family: yuanli">风吹仙袂飘飘举，犹似霓裳羽衣舞。玉容寂寞泪阑干，梨花一枝春带雨。 </span>',
            ymwangshusan: '望舒伞',
            ymwangshusan_skill: '望舒',
            ymwangshusan_info :'锁定技，①若你为【仙】势力，你使用基本牌或普通锦囊牌后，若此牌为实体牌，你可以将其收回手牌，每回合每种牌名限一次；②若你不为【仙】势力，你使用牌造成伤害后选择令目标角色弃置两张牌或失去一点体力，每回合每种牌名结算前限一次。',
            ymwangshusan_append:'<span class="text" style="font-family: yuanli">江南雨，古巷韵绸缪。油纸伞中凝怨黛，丁香花下湿清眸。幽梦一帘收。 ​ </span>',
            ymhaoshouqiongjing: '皓首穷经',
            ymhaoshouqiongjing_info: '出牌阶段，对你使用。你从所有武将牌中随机观看至多三个技能并选择其中一个技能获得，你每次观看到的技能描述字数将单调递增，当你以此法获得的新技能超过三个时将替换旧技能；若无可获得的技能，你摸一张牌。',
            ymhaoshouqiongjing_append:'<span class="text" style="font-family: yuanli">纵死侠骨香，不惭世上英。谁能书阁下？白首太玄经。 </span>',
            ymlinjuejian: '麟决剑',
            ymlinjuejian_skill: '麟决剑',
            ymlinjuejian_info: '锁定技，①你使用【杀】指定目标无视防具且需额外使用一张【闪】响应，每少使用一张额外的【闪】，此【杀】命中时伤害基数+1；②你的【杀】使目标发生体力变化不触发技能且体力变化后进行判定，当总花色数达到4时，你死亡；③此牌进入装备区，可视为使用一张无距离次数限制的【杀】；此牌离开装备区，随机弃置任意数量的牌(不超过总牌数的一半)。',
            ymlinjuejian_append:'<span class="text" style="font-family: yuanli">剑雄万敌，意决一心。膏火自煎，反噬其身。 </span>',

            "假装无敌Pack": '<span style="animation: -webkit-animation:fairy 20s infinite;animation:fairy 20s infinite;">假装无敌</span>',
        },
        list: [
            ["heart", "1", "ymhuanhundan"],
            ["diamond", "10", "ymhuanhundan"],
            ["spade", "12", "ymyaoguangjian"],
            ["club", "12", "ymwangshusan"],
            ["heart", "12", "ymtianruihualing"],
            ["spade", "6", "ymhaoshouqiongjing"],
            ["club", "13", "ymhaoshouqiongjing"],
            ["spade", "12", "ymlinjuejian"],
        ],
    }
}
